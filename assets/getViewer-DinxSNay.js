import { N as Ut, a6 as Vn, q as gs, v as q, a7 as vs, D as Pt, M as Oe, B as be, F as Mt, a8 as Ms, x as pt, a9 as bs, aa as _s, h as Vo, ab as $o, r as rn, ac as In, ad as Dn, a4 as Ho, _ as tt, a as ut, L as qt, w as Wo, b as Ss, ae as ks, f as st, V as M, $ as ln, af as oo, H as fo, d as zt, c as so, Y as Jo, Z as Xn, G as Ps, z as _n, A as Cs, ag as Bn, t as zs, o as Fs, I as jt, a2 as Mn, E as Lo, S as wn, m as ao, ah as bn, g as Ro, i as Io, j as Do, C as Bo, K as As, U as Es, W as Ts, X as Vs, T as $n, P as io, O as $s } from "./theme-U-6D_qyI.js";
import { T as kt, O as Xo } from "./Text-CUW6lNkV.js";
import { P as Oo } from "./tweakpane-BXg6ZhiP.js";
import { e as Ls } from "./styles-SbI03m7S.js";
class Qo {
  constructor(l, u = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, u);
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
  setColorMap(l, u = 32) {
    this.map = lo[l] || lo.rainbow, this.n = u;
    const f = 1 / this.n, d = new Ut(), w = new Ut();
    this.lut.length = 0, this.lut.push(new Ut(this.map[0][1]));
    for (let p = 1; p < u; p++) {
      const x = p * f;
      for (let g = 0; g < this.map.length - 1; g++) if (x > this.map[g][0] && x <= this.map[g + 1][0]) {
        const S = this.map[g][0], C = this.map[g + 1][0];
        d.setHex(this.map[g][1], Vn), w.setHex(this.map[g + 1][1], Vn);
        const v = new Ut().lerpColors(d, w, (x - S) / (C - S));
        this.lut.push(v);
      }
    }
    return this.lut.push(new Ut(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = gs.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const u = Math.round(l * this.n);
    return this.lut[u];
  }
  addColorMap(l, u) {
    return lo[l] = u, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const u = l.getContext("2d", { alpha: false }), f = u.getImageData(0, 0, 1, this.n), d = f.data;
    let w = 0;
    const p = 1 / this.n, x = new Ut(), g = new Ut(), S = new Ut();
    for (let C = 1; C >= 0; C -= p) for (let v = this.map.length - 1; v >= 0; v--) if (C < this.map[v][0] && C >= this.map[v - 1][0]) {
      const Z = this.map[v - 1][0], ye = this.map[v][0];
      x.setHex(this.map[v - 1][1], Vn), g.setHex(this.map[v][1], Vn), S.lerpColors(x, g, (C - Z) / (ye - Z)), d[w * 4] = Math.round(S.r * 255), d[w * 4 + 1] = Math.round(S.g * 255), d[w * 4 + 2] = Math.round(S.b * 255), d[w * 4 + 3] = 255, w += 1;
    }
    return u.putImageData(f, 0, 0), l;
  }
}
const lo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, jo = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Rs = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: jo, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Nn = q.state("safe"), es = q.state("auto");
function ts(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Rs[Nn.val] ?? jo;
  for (let f = 0; f < l.length - 1; f++) {
    const [d, w, p, x] = l[f], [g, S, C, v] = l[f + 1];
    if (e <= g) {
      const Z = (e - d) / (g - d);
      return [w + (S - w) * Z, p + (C - p) * Z, x + (v - x) * Z];
    }
  }
  const u = l[l.length - 1];
  return [u[1], u[2], u[3]];
}
function No() {
  const l = new Uint8Array(1024);
  for (let f = 0; f < 256; f++) {
    const d = f / 255, [w, p, x] = ts(d);
    l[f * 4 + 0] = w, l[f * 4 + 1] = p, l[f * 4 + 2] = x, l[f * 4 + 3] = 255;
  }
  const u = new bs(l, 256, 1, _s);
  return u.minFilter = Vo, u.magFilter = Vo, u.wrapS = $o, u.wrapT = $o, u.needsUpdate = true, u;
}
function Is() {
  const l = [];
  for (let u = 0; u <= 12; u++) {
    const f = 1 - u / 12, [d, w, p] = ts(f);
    l.push(`rgb(${d | 0},${w | 0},${p | 0}) ${(u / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function ho(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((w, p) => w - p), u = (w) => l[Math.min(l.length - 1, Math.max(0, Math.round(w * (l.length - 1))))];
  let f = l.length >= 20 ? u(0.01) : l[0], d = l.length >= 20 ? u(0.99) : l[l.length - 1];
  return f >= 0 && d > 0 && (f = 0), d <= 0 && f < 0 && (d = 0), [f, d];
}
function Ds(e, l, u) {
  new Qo();
  const f = No(), d = new vs({ uniforms: { cmap: { value: f }, ambient: { value: 0.95 } }, vertexShader: `
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
  q.derive(() => {
    var _a2;
    Nn.val;
    const p = d.uniforms.cmap.value;
    d.uniforms.cmap.value = No(), (_a2 = p == null ? void 0 : p.dispose) == null ? void 0 : _a2.call(p);
  });
  const w = new Oe(new be(), d);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", q.derive(() => {
    w.geometry.setAttribute("position", new Mt(e.val.flat(), 3));
    const p = [], x = [], g = [];
    l.val.forEach((W, ve) => {
      W.length === 3 ? (p.push(W[0], W[1], W[2]), x.push(ve), g.push(0)) : W.length === 4 && (p.push(W[0], W[1], W[2]), p.push(W[0], W[2], W[3]), x.push(ve, ve), g.push(0, 1));
    }), w.geometry.setIndex(new Ms(p, 1)), w.userData.faceToElem = x, w.userData.faceLocal = g;
    const S = u.val.filter((W) => Number.isFinite(W));
    let C, v;
    const Z = kn.val;
    if (Z ? (v = Z[0], C = Z[1]) : [v, C] = ho(S), C === v) {
      const W = Math.max(Math.abs(C) * 1e-6, 1e-9);
      C += W, v -= W;
    }
    const ye = Z && Z[0] > Z[1], le = Math.min(v, C), te = Math.max(v, C), z = te - le, ne = new Float32Array(u.val.length);
    for (let W = 0; W < u.val.length; W++) {
      const ve = u.val[W];
      if (!Number.isFinite(ve)) {
        ne[W] = -1;
        continue;
      }
      const B = ((ye ? te + le - ve : ve) - le) / z;
      ne[W] = Math.max(0, Math.min(1, B));
    }
    w.geometry.setAttribute("scalar", new pt(ne, 1));
  }), w;
}
function Bs(e, l, u) {
  const f = document.createElement("div"), d = new Oo({ title: "Settings", expanded: true, container: f });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(d), f.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let p = null;
  try {
    const v = localStorage.getItem(w);
    v && (p = JSON.parse(v));
  } catch {
  }
  f.style.cssText = ["position:fixed", p ? `left:${p.left}px` : "left:8px", p ? `top:${p.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const x = () => {
    const v = f.querySelector(".tp-rotv_b");
    if (!v) {
      setTimeout(x, 200);
      return;
    }
    v.style.cursor = "move", v.style.userSelect = "none";
    let Z = false, ye = 0, le = 0, te = 0, z = 0;
    v.addEventListener("mousedown", (ne) => {
      Z = true, ye = ne.clientX, le = ne.clientY;
      const W = f.getBoundingClientRect();
      te = W.left, z = W.top, f.style.left = `${te}px`, f.style.top = `${z}px`;
    }), window.addEventListener("mousemove", (ne) => {
      if (!Z) return;
      const W = ne.clientX - ye, ve = ne.clientY - le, ge = Math.max(0, Math.min(window.innerWidth - 40, te + W)), B = Math.max(0, Math.min(window.innerHeight - 40, z + ve));
      f.style.left = `${ge}px`, f.style.top = `${B}px`;
    }), window.addEventListener("mouseup", () => {
      if (Z) {
        Z = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(f.style.left), top: parseFloat(f.style.top) }));
        } catch {
        }
      }
    });
  };
  if (x(), l == null ? void 0 : l.nodes) {
    d.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const v = d.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    v.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), v.addBinding(e.gridStep, "val", { label: "Separaci\xF3n grid (m)", min: 0.05, max: 5, step: 0.05 }), v.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), v.addBinding(e.cursorSnap, "val", { label: "Paso cursor (m)", min: 0.05, max: 5, step: 0.05 }), v.addBinding(e.gridVisible, "val", { label: "Mostrar" }), v.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 }), v.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), v.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), v.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const Z = d.addFolder({ title: "\u{1F441} Ver", expanded: false });
    Z.addBinding(e.nodes, "val", { label: "Nodes" }), Z.addBinding(e.elements, "val", { label: "Elements" }), Z.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), Z.addBinding(e.faces, "val", { label: "  Caras (fill)" }), Z.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), Z.addBinding(e.elemColumns, "val", { label: "    Columnas" }), Z.addBinding(e.elemBeams, "val", { label: "    Vigas" }), Z.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), Z.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), Z.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), Z.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), Z.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), Z.addBinding(e.orientations, "val", { label: "Orientations" }), Z.addBinding(e.sections, "val", { label: "Sections" }), Z.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), Z.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), Z.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), Z.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), Z.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const v = d.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    v.addBinding(e.supports, "val", { label: "Supports" }), v.addBinding(e.loads, "val", { label: "Loads" }), v.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), v.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const v = d.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = v, v.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), v.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), v.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), v.addBinding(Nn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), v.addBinding(es, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), v.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), v.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), v.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), v.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  u && d.addBinding(e.solids, "val", { label: "Solids" });
  const g = d.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), S = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), C = () => {
    const v = window.__hekatanClipApply;
    typeof v == "function" && v();
  };
  return g.addBinding(S, "enableX", { label: "Cortar X" }).on("change", C), g.addBinding(S, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", C), g.addBinding(S, "invertX", { label: "  invertir X" }).on("change", C), g.addBinding(S, "enableY", { label: "Cortar Y" }).on("change", C), g.addBinding(S, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", C), g.addBinding(S, "invertY", { label: "  invertir Y" }).on("change", C), g.addBinding(S, "enableZ", { label: "Cortar Z" }).on("change", C), g.addBinding(S, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", C), g.addBinding(S, "invertZ", { label: "  invertir Z" }).on("change", C), f;
}
function Xs(e) {
  return { gridSize: q.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: q.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: q.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: q.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: q.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: q.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: q.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: q.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: q.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: q.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: q.state((e == null ? void 0 : e.nodes) ?? true), elements: q.state((e == null ? void 0 : e.elements) ?? true), edges: q.state((e == null ? void 0 : e.edges) ?? true), faces: q.state((e == null ? void 0 : e.faces) ?? true), elemColumns: q.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: q.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: q.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: q.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: q.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: q.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: q.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: q.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: q.state((e == null ? void 0 : e.orientations) ?? false), sections: q.state((e == null ? void 0 : e.sections) ?? true), extruded: q.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: q.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: q.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: q.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: q.state((e == null ? void 0 : e.secFloor) ?? -1), supports: q.state((e == null ? void 0 : e.supports) ?? true), loads: q.state((e == null ? void 0 : e.loads) ?? false), deformedShape: q.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: q.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: q.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: q.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: q.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: q.state((e == null ? void 0 : e.flipAxes) ?? false), solids: q.state((e == null ? void 0 : e.solids) ?? true), custom3D: q.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: q.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: q.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: q.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Ns(e, l, u) {
  const f = rn(), d = new In(new be(), new Dn({ color: f.nodePoint }));
  return Ho((w, p) => {
    d.material.color.setHex(p.nodePoint);
  }), d.frustumCulled = false, q.derive(() => {
    e.nodes.val && d.geometry.setAttribute("position", new Mt(l.val.flat(), 3));
  }), q.derive(() => {
    if (u.val, l.val, !e.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let p = e.gridSize.val * 0.5;
    if (w.length >= 2) {
      const g = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
      for (const C of w) for (let v = 0; v < 3; v++) g[v] = Math.min(g[v], C[v]), S[v] = Math.max(S[v], C[v]);
      p = Math.max(S[0] - g[0], S[1] - g[1], S[2] - g[2], 0.1);
    }
    const x = 0.03 * p;
    d.material.size = x * u.rawVal;
  }), q.derive(() => {
    d.visible = e.nodes.val;
  }), d;
}
function ro(e, l) {
  const u = rn(), f = new tt();
  f.name = "hekatan-grid";
  const d = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, p = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), p <= 0 && (p = 0.1); e / p > 500; ) p *= 2;
  for (; e / w > 100; ) w *= 2;
  const x = e / 2;
  w = Math.max(p, Math.round(w / p) * p);
  const S = new Ut(u.grid), C = new Ut(u.grid).multiplyScalar(0.45), v = (te, z, ne, W) => {
    const ve = [], ge = te === "xy" ? (E, X) => [E, X, 0] : te === "xz" ? (E, X) => [E, 0, X] : (E, X) => [0, E, X], B = Math.floor(x / z);
    for (let E = -B; E <= B; E++) {
      const X = E * z, D = ge(X, -x), $ = ge(X, x);
      ve.push(...D, ...$);
    }
    for (let E = -B; E <= B; E++) {
      const X = E * z, D = ge(-x, X), $ = ge(x, X);
      ve.push(...D, ...$);
    }
    const I = new be();
    I.setAttribute("position", new Mt(ve, 3));
    const U = new ut({ color: ne, transparent: true, opacity: W, depthWrite: false }), T = new qt(I, U);
    return T.name = `grid-${te}-${z === p ? "minor" : "major"}`, T;
  }, Z = (te, z, ne) => {
    const W = te === "xy" ? (T, E) => [T, E, 0] : te === "xz" ? (T, E) => [T, 0, E] : (T, E) => [0, T, E], ve = [[-x, -x], [x, -x], [x, x], [-x, x]], ge = [];
    for (const [T, E] of ve) ge.push(...W(T, E));
    const B = new be();
    B.setAttribute("position", new Mt(ge, 3));
    const I = new ut({ color: z, transparent: true, opacity: ne, depthWrite: false }), U = new Wo(B, I);
    return U.name = `grid-${te}-border`, U.renderOrder = 1, U;
  }, ye = (te, z, ne) => {
    const W = te === "xy" ? (I, U) => [I, U, 0] : te === "xz" ? (I, U) => [I, 0, U] : (I, U) => [0, I, U], ve = z === "u" ? [...W(-x, 0), ...W(x, 0)] : [...W(0, -x), ...W(0, x)], ge = new be();
    ge.setAttribute("position", new Mt(ve, 3));
    const B = new qt(ge, new ut({ color: ne, transparent: true, opacity: 0.45, depthWrite: false }));
    return B.name = `grid-${te}-eje-${z}`, B.renderOrder = 1, B;
  }, le = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const te of d) {
    f.add(v(te, p, C, 0.12)), f.add(v(te, w, S, 0.4));
    const [z, ne] = le[te];
    f.add(ye(te, "u", z)), f.add(ye(te, "v", ne)), f.add(Z(te, S, 0.55));
  }
  return f.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: p, gridSize: e, planes: [...d] }, f;
}
function Ys(e, l, u, f) {
  const d = new tt(), w = new Ss(0.5, 0.5, 0.5), p = new ks(0.45, 0.7, 4);
  p.rotateX(Math.PI / 2), p.translate(0, 0, -0.35);
  const x = new st({ color: 10166822 }), g = new st({ color: 2792847 }), S = new st({ color: 3835647 }), C = () => {
    const ye = u.rawVal ?? [];
    if (ye.length < 2) return l.gridSize.val * 0.5;
    let le = [1 / 0, 1 / 0, 1 / 0], te = [-1 / 0, -1 / 0, -1 / 0];
    for (const z of ye) for (let ne = 0; ne < 3; ne++) z[ne] < le[ne] && (le[ne] = z[ne]), z[ne] > te[ne] && (te[ne] = z[ne]);
    return Math.max(te[0] - le[0], te[1] - le[1], te[2] - le[2], 0.1);
  }, v = () => 0.08 * C(), Z = () => f.rawVal;
  return q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    d.clear();
    const ye = v();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((le, te) => {
      const z = u.val[te];
      if (!z) return;
      const ne = le ?? [], W = (ne[0] ? 1 : 0) + (ne[1] ? 1 : 0) + (ne[2] ? 1 : 0), ve = (ne[3] ? 1 : 0) + (ne[4] ? 1 : 0) + (ne[5] ? 1 : 0);
      let ge;
      W >= 3 && ve >= 3 ? ge = new Oe(w, x) : W >= 3 && ve === 0 ? ge = new Oe(p, g) : ge = new Oe(p, S), ge.position.set(z[0], z[1], z[2]);
      const B = ye * Z();
      ge.scale.set(B, B, B), d.add(ge);
    });
  }), q.derive(() => {
    if (f.val, !l.supports.rawVal) return;
    const le = v() * Z();
    d.children.forEach((te) => te.scale.set(le, le, le));
  }), q.derive(() => {
    d.visible = l.supports.val;
  }), d;
}
function Us(e, l, u, f) {
  const d = new tt();
  d.name = "loadsGroup";
  function w(p) {
    if (p.length < 2) return 0.12 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], g = [-1 / 0, -1 / 0, -1 / 0];
    for (const C of p) for (let v = 0; v < 3; v++) x[v] = Math.min(x[v], C[v]), g[v] = Math.max(g[v], C[v]);
    return 0.08 * Math.max(g[0] - x[0], g[1] - x[1], g[2] - x[2], 0.1);
  }
  return q.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    d.children.forEach((v) => v.dispose()), d.clear();
    const p = u.val, x = w(p), g = 240, S = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((v, Z) => {
      p[Z] && v.slice(0, 3).some((ye) => Math.abs(ye) > 1e-15) && S.push(Z);
    });
    let C = S;
    if (S.length > g) {
      const v = S.map((T) => p[T][0]), Z = S.map((T) => p[T][1]), ye = Math.min(...v), le = Math.max(...v), te = Math.min(...Z), z = Math.max(...Z), ne = S.map((T) => p[T][2]), W = Math.max(1e-6, (Math.max(...ne) - Math.min(...ne)) / 40), ve = (T) => Math.round(T / W), ge = new Set(ne.map(ve)), B = Math.max(4, Math.floor(g / Math.max(1, ge.size))), I = Math.max(2, Math.round(Math.sqrt(B))), U = /* @__PURE__ */ new Map();
      for (const T of S) {
        const E = le - ye < 1e-9 ? 0 : (p[T][0] - ye) / (le - ye), X = z - te < 1e-9 ? 0 : (p[T][1] - te) / (z - te), D = Math.min(I - 1, Math.floor(E * I)), $ = Math.min(I - 1, Math.floor(X * I)), Q = `${D},${$},${ve(p[T][2])}`, re = Math.hypot(E * I - (D + 0.5), X * I - ($ + 0.5)), se = U.get(Q);
        (!se || re < se.d) && U.set(Q, { i: T, d: re });
      }
      C = [...U.values()].map((T) => T.i);
    }
    for (const v of C) {
      const Z = e.nodeInputs.val.loads.get(v), ye = p[v];
      if (!ye) continue;
      const le = new M(...Z.slice(0, 3));
      if (le.lengthSq() < 1e-30) continue;
      le.normalize();
      const te = new ln(le, new M(...ye), 1, 15637248, 0.3, 0.3), z = x * f.rawVal;
      te.scale.set(z, z, z), d.add(te);
    }
  }), q.derive(() => {
    if (f.val, !l.loads.rawVal) return;
    const x = w(u.rawVal) * f.rawVal;
    d.children.forEach((g) => g.scale.set(x, x, x));
  }), q.derive(() => {
    d.visible = l.loads.val;
  }), d;
}
function Zs(e, l, u) {
  const f = new tt();
  return q.derive(() => {
    if (!e.nodesIndexes.val) return;
    f.children.forEach((w) => w.dispose()), f.clear();
    const d = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((w, p) => {
      const x = new kt(`${p}`);
      x.position.set(...w), x.updateScale(d * u.rawVal), f.add(x);
    });
  }), q.derive(() => {
    if (u.val, !e.nodesIndexes.rawVal) return;
    const d = 0.05 * e.gridSize.val * 0.6;
    f.children.forEach((w) => w.updateScale(d * u.rawVal));
  }), q.derive(() => {
    f.visible = e.nodesIndexes.val;
  }), f;
}
function qs(e, l, u, f) {
  const d = new tt();
  return q.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    d.children.forEach((p) => p.dispose()), d.clear();
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((p, x) => {
      const g = new kt(`${x}`, void 0, "#001219");
      g.position.set(...Ks(p.map((S) => u.rawVal[S]))), g.updateScale(w * f.rawVal), d.add(g);
    });
  }), q.derive(() => {
    if (f.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    d.children.forEach((p) => p.updateScale(w * f.rawVal));
  }), q.derive(() => {
    d.visible = l.elementsIndexes.val;
  }), d;
}
function Ks(e) {
  const l = e.reduce((f, d) => [f[0] + d[0], f[1] + d[1], f[2] + d[2]], [0, 0, 0]), u = e.length;
  return [l[0] / u, l[1] / u, l[2] / u];
}
function Yo(e, l) {
  const u = new tt(), f = Math.min(0.05 * e, 0.6), d = rn(), w = new kt("X", "red", "transparent"), p = new kt(l ? "Z" : "Y", "green", "transparent"), x = new kt(l ? "Y" : "Z", "blue", "transparent"), g = new ln(new M(1, 0, 0), new M(0, 0, 0), 1, d.axisArrow, 0.2, 0.2), S = new ln(new M(0, 1, 0), new M(0, 0, 0), 1, d.axisArrow, 0.2, 0.2), C = new ln(new M(0, 0, 1), new M(0, 0, 0), 1, d.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * f, 0, 0), p.position.set(0, 1.3 * f, 0), x.position.set(0, 0, 1.3 * f), w.updateScale(0.4 * f), p.updateScale(0.4 * f), x.updateScale(0.4 * f), g.scale.set(f, f, f), S.scale.set(f, f, f), C.scale.set(f, f, f), u.add(g, S, C, w, p, x), u;
}
function Yn(e, l) {
  const u = new M(...e), d = new M(...l).clone().sub(u), w = d.length(), p = d.dot(new M(1, 0, 0)) / w, x = d.dot(new M(0, 1, 0)) / w, g = d.dot(new M(0, 0, 1)) / w, S = Math.sqrt(p ** 2 + x ** 2);
  let C = new oo().fromArray([[p, x, g], [-x / S, p / S, 0], [-p * g / S, -x * g / S, S]].flat());
  return g === 1 && (C = new oo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), g === -1 && (C = new oo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new fo().setFromMatrix3(C);
}
function po(e, l) {
  return e == null ? void 0 : e.map((u, f) => (9 * u + l[f]) / 10);
}
function Sn(e) {
  const l = e.reduce((f, d) => [f[0] + d[0], f[1] + d[1], f[2] + d[2]], [0, 0, 0]), u = e.length;
  return [l[0] / u, l[1] / u, l[2] / u];
}
function Gs(e, l, u) {
  const f = Sn([l, u]), d = Sn([e, u]), w = Sn([e, l]), p = new M(...f).sub(new M(...d)).normalize(), x = new M(...u).sub(new M(...w)).normalize(), g = p.clone().cross(x).normalize(), S = g.clone().cross(p).normalize();
  return new fo().makeBasis(p, S, g);
}
function Hs(e, l, u, f) {
  const d = new tt(), w = new be(), p = new ut({ vertexColors: true }), x = [0, 0, 0], g = [1, 0, 0], S = [0, 1, 0], C = [0, 0, 1];
  w.setAttribute("position", new Mt([...x, ...g, ...x, ...S, ...x, ...C], 3));
  const v = [255, 0, 0], Z = [0, 255, 0], ye = [0, 0, 255];
  return w.setAttribute("color", new Mt([...v, ...v, ...Z, ...Z, ...ye, ...ye], 3)), q.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (d.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((le) => {
      const te = new qt(w, p), z = u.rawVal[le[0]], ne = u.rawVal[le[1]];
      if (le.length === 2 && (te.position.set(...po(z, ne)), te.rotation.setFromRotationMatrix(Yn(z, ne))), le.length === 3) {
        const ge = u.rawVal[le[2]];
        te.position.set(...Sn([z, ne, ge])), te.rotation.setFromRotationMatrix(Gs(z, ne, ge));
      }
      const ve = 0.05 * l.gridSize.rawVal * 0.75 * f.rawVal;
      te.scale.set(ve, ve, ve), d.add(te);
    }));
  }), q.derive(() => {
    if (f.val, !l.orientations.rawVal) return;
    const te = 0.05 * l.gridSize.val * 0.75 * f.rawVal;
    d.children.forEach((z) => z.scale.set(te, te, te));
  }), q.derive(() => {
    d.visible = l.orientations.val;
  }), d;
}
function Ws(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), u = (e.h * 100).toFixed(0);
    return `${l}x${u}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function Js(e, l, u, f) {
  const d = new tt(), w = new tt();
  d.add(w);
  function p(I, U) {
    const T = I / 2, E = U / 2, X = new Float32Array([0, -T, -E, 0, T, -E, 0, T, E, 0, -T, -E, 0, T, E, 0, -T, E]), D = new be();
    D.setAttribute("position", new pt(X, 3));
    const $ = new Float32Array([0, -T, -E, 0, T, -E, 0, T, E, 0, -T, E, 0, -T, -E]), Q = new be();
    return Q.setAttribute("position", new pt($, 3)), { fill: D, outline: Q };
  }
  function x(I, U = 24) {
    const T = I / 2, E = new Float32Array(U * 9);
    for (let Q = 0; Q < U; Q++) {
      const re = Q / U * Math.PI * 2, se = (Q + 1) / U * Math.PI * 2;
      E[Q * 9] = 0, E[Q * 9 + 1] = 0, E[Q * 9 + 2] = 0, E[Q * 9 + 3] = 0, E[Q * 9 + 4] = T * Math.cos(re), E[Q * 9 + 5] = T * Math.sin(re), E[Q * 9 + 6] = 0, E[Q * 9 + 7] = T * Math.cos(se), E[Q * 9 + 8] = T * Math.sin(se);
    }
    const X = new be();
    X.setAttribute("position", new pt(E, 3));
    const D = new Float32Array((U + 1) * 3);
    for (let Q = 0; Q <= U; Q++) {
      const re = Q / U * Math.PI * 2;
      D[Q * 3] = 0, D[Q * 3 + 1] = T * Math.cos(re), D[Q * 3 + 2] = T * Math.sin(re);
    }
    const $ = new be();
    return $.setAttribute("position", new pt(D, 3)), { fill: X, outline: $ };
  }
  function g(I, U, T, E) {
    const X = T ?? U * 0.08, D = E ?? I * 0.07, $ = I / 2, Q = U / 2, re = Q - X, se = D / 2, j = [];
    function R(he, Ve, Me, Le) {
      j.push(0, he, Ve, 0, Me, Ve, 0, Me, Le, 0, he, Ve, 0, Me, Le, 0, he, Le);
    }
    R(-$, -Q, $, -re), R(-se, -re, se, re), R(-$, re, $, Q);
    const ce = new be();
    ce.setAttribute("position", new pt(new Float32Array(j), 3));
    const G = new Float32Array([0, -$, -Q, 0, $, -Q, 0, $, -re, 0, se, -re, 0, se, re, 0, $, re, 0, $, Q, 0, -$, Q, 0, -$, re, 0, -se, re, 0, -se, -re, 0, -$, -re, 0, -$, -Q]), ue = new be();
    return ue.setAttribute("position", new pt(G, 3)), { fill: ce, outline: ue };
  }
  function S(I, U, T) {
    const E = I / 2, X = U / 2, D = E - T, $ = X - T, Q = [];
    function re(ce, G, ue, he) {
      Q.push(0, ce, G, 0, ue, G, 0, ue, he, 0, ce, G, 0, ue, he, 0, ce, he);
    }
    re(-E, -X, E, -$), re(-E, $, E, X), re(-E, -$, -D, $), re(D, -$, E, $);
    const se = new be();
    se.setAttribute("position", new pt(new Float32Array(Q), 3));
    const j = new Float32Array([0, -E, -X, 0, E, -X, 0, E, -X, 0, E, X, 0, E, X, 0, -E, X, 0, -E, X, 0, -E, -X, 0, -D, -$, 0, D, -$, 0, D, -$, 0, D, $, 0, D, $, 0, -D, $, 0, -D, $, 0, -D, -$]), R = new be();
    return R.setAttribute("position", new pt(j, 3)), { fill: se, outline: R };
  }
  function C(I, U, T) {
    const E = I / 2, X = U / 2, D = E - T, $ = X - T, Q = new be(), re = new Float32Array([0, -D, -$, 0, D, -$, 0, D, $, 0, -D, -$, 0, D, $, 0, -D, $]);
    Q.setAttribute("position", new pt(re, 3));
    const se = [];
    function j(ue, he, Ve, Me) {
      se.push(0, ue, he, 0, Ve, he, 0, Ve, Me, 0, ue, he, 0, Ve, Me, 0, ue, Me);
    }
    j(-E, -X, E, -$), j(-E, $, E, X), j(-E, -$, -D, $), j(D, -$, E, $);
    const R = new be();
    R.setAttribute("position", new pt(new Float32Array(se), 3));
    const ce = new Float32Array([0, -E, -X, 0, E, -X, 0, E, -X, 0, E, X, 0, E, X, 0, -E, X, 0, -E, X, 0, -E, -X, 0, -D, -$, 0, D, -$, 0, D, -$, 0, D, $, 0, D, $, 0, -D, $, 0, -D, $, 0, -D, -$]), G = new be();
    return G.setAttribute("position", new pt(ce, 3)), { concFill: Q, steelFillGeom: R, outline: G };
  }
  function v(I, U, T) {
    const E = [], X = [[0, -I / 2, -U / 2], [0, -I / 2 + T, -U / 2], [0, -I / 2 + T, U / 2 - T], [0, I / 2, U / 2 - T], [0, I / 2, U / 2], [0, -I / 2, U / 2]], D = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const se of D) E.push(...X[se]);
    const $ = new be();
    $.setAttribute("position", new pt(new Float32Array(E), 3));
    const Q = [];
    for (let se = 0; se < X.length; se++) {
      const j = (se + 1) % X.length;
      Q.push(...X[se], ...X[j]);
    }
    const re = new be();
    return re.setAttribute("position", new pt(new Float32Array(Q), 3)), { fill: $, outline: re };
  }
  function Z(I, U, T, E) {
    const X = E / 2, D = [], $ = [[0, -I - X, -U / 2], [0, -T - X, -U / 2], [0, -T - X, U / 2 - T], [0, -X, U / 2 - T], [0, -X, U / 2], [0, -I - X, U / 2]], Q = [[0, X, -U / 2], [0, X + T, -U / 2], [0, X + T, U / 2 - T], [0, I + X, U / 2 - T], [0, I + X, U / 2], [0, X, U / 2]], re = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ce of re) D.push(...$[ce]);
    for (const ce of re) D.push(...Q[ce]);
    const se = new be();
    se.setAttribute("position", new pt(new Float32Array(D), 3));
    const j = [];
    for (const ce of [$, Q]) for (let G = 0; G < ce.length; G++) {
      const ue = (G + 1) % ce.length;
      j.push(...ce[G], ...ce[ue]);
    }
    const R = new be();
    return R.setAttribute("position", new pt(new Float32Array(j), 3)), { fill: se, outline: R };
  }
  function ye(I, U, T, E) {
    const X = U / 2, D = I, $ = [[0, -D, -X], [0, -D, -X + T], [0, -E, -X + T], [0, -E, X - T], [0, -D, X - T], [0, -D, X], [0, 0, X], [0, 0, -X]], Q = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], re = [];
    for (const ce of Q) re.push(...$[ce]);
    const se = new be();
    se.setAttribute("position", new pt(new Float32Array(re), 3));
    const j = [];
    for (let ce = 0; ce < $.length; ce++) {
      const G = (ce + 1) % $.length;
      j.push(...$[ce], ...$[G]);
    }
    const R = new be();
    return R.setAttribute("position", new pt(new Float32Array(j), 3)), { fill: se, outline: R };
  }
  function le(I, U, T, E, X) {
    const D = U / 2, $ = X / 2, Q = [], re = [[0, -I, -D], [0, -I, -D + T], [0, -$ - E, -D + T], [0, -$ - E, D - T], [0, -I, D - T], [0, -I, D], [0, -$, D], [0, -$, -D]], se = re.map((ue) => [ue[0], -ue[1], ue[2]]), j = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const ue of j) Q.push(...re[ue]);
    for (const ue of j) Q.push(...se[ue]);
    const R = new be();
    R.setAttribute("position", new pt(new Float32Array(Q), 3));
    const ce = [];
    for (const ue of [re, se]) for (let he = 0; he < ue.length; he++) {
      const Ve = (he + 1) % ue.length;
      ce.push(...ue[he], ...ue[Ve]);
    }
    const G = new be();
    return G.setAttribute("position", new pt(new Float32Array(ce), 3)), { fill: R, outline: G };
  }
  function te(I, U, T, E) {
    const X = I / 2, D = U / 2, $ = E / 2, Q = [[0, -$, -D], [0, $, -D], [0, $, D - T], [0, X, D - T], [0, X, D], [0, -X, D], [0, -X, D - T], [0, -$, D - T]], re = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], se = [];
    for (const G of re) se.push(...Q[G]);
    const j = new be();
    j.setAttribute("position", new pt(new Float32Array(se), 3));
    const R = [];
    for (let G = 0; G < Q.length; G++) {
      const ue = (G + 1) % Q.length;
      R.push(...Q[G], ...Q[ue]);
    }
    const ce = new be();
    return ce.setAttribute("position", new pt(new Float32Array(R), 3)), { fill: j, outline: ce };
  }
  function z(I, U, T = 24) {
    const E = I / 2, X = E - U, D = [];
    for (let se = 0; se < T; se++) {
      const j = se / T * Math.PI * 2, R = (se + 1) / T * Math.PI * 2, ce = Math.cos(j), G = Math.sin(j), ue = Math.cos(R), he = Math.sin(R);
      D.push(0, E * ce, E * G, 0, E * ue, E * he, 0, X * ue, X * he), D.push(0, E * ce, E * G, 0, X * ue, X * he, 0, X * ce, X * G);
    }
    const $ = new be();
    $.setAttribute("position", new pt(new Float32Array(D), 3));
    const Q = [];
    for (let se = 0; se < T; se++) {
      const j = se / T * Math.PI * 2, R = (se + 1) / T * Math.PI * 2;
      Q.push(0, E * Math.cos(j), E * Math.sin(j), 0, E * Math.cos(R), E * Math.sin(R)), Q.push(0, X * Math.cos(j), X * Math.sin(j), 0, X * Math.cos(R), X * Math.sin(R));
    }
    const re = new be();
    return re.setAttribute("position", new pt(new Float32Array(Q), 3)), { fill: $, outline: re };
  }
  const ne = new st({ color: 52479, transparent: true, opacity: 0.35, side: Pt, depthWrite: false }), W = new ut({ color: 52479 }), ve = new st({ color: 16750848, transparent: true, opacity: 0.4, side: Pt, depthWrite: false }), ge = new ut({ color: 16750848 });
  function B(I, U) {
    const T = Math.abs(U[0] - I[0]), E = Math.abs(U[1] - I[1]), X = Math.abs(U[2] - I[2]);
    return X > T && X > E || E > T && E > X;
  }
  return q.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const I = l.secColumns.rawVal, U = l.secBeams.rawVal;
    if (!I && !U) {
      d.children.forEach(($) => {
        $ instanceof kt && $.dispose();
      }), d.clear();
      return;
    }
    d.children.forEach(($) => {
      $ instanceof kt && $.dispose();
    }), d.clear();
    const T = (_a2 = e.elements) == null ? void 0 : _a2.val, E = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!T || !E) return;
    const X = E.sectionShapes, D = l.secFloor.rawVal;
    T.forEach(($, Q) => {
      if ($.length !== 2) return;
      const re = u.rawVal[$[0]], se = u.rawVal[$[1]];
      if (!re || !se) return;
      const j = B(re, se);
      if (j && !I || !j && !U) return;
      if (D >= 0) {
        const he = Math.min(re[1], se[1]);
        Math.max(re[1], se[1]);
        const Ve = l.gridSize.rawVal || 3;
        if (Math.floor(he / Ve + 0.01) !== D) return;
      }
      const R = X == null ? void 0 : X.get(Q);
      if (!R) return;
      const ce = [(re[0] + se[0]) / 2, (re[1] + se[1]) / 2, (re[2] + se[2]) / 2], G = Yn(re, se);
      if (R.type === "CFT") {
        const he = C(R.b, R.h, R.tw ?? R.b * 0.05), Ve = new Oe(he.concFill, ne);
        Ve.position.set(...ce), Ve.rotation.setFromRotationMatrix(G), d.add(Ve);
        const Me = new Oe(he.steelFillGeom, ve);
        Me.position.set(...ce), Me.rotation.setFromRotationMatrix(G), d.add(Me);
        const Le = new zt(he.outline, ge);
        Le.position.set(...ce), Le.rotation.setFromRotationMatrix(G), d.add(Le);
      } else {
        let he, Ve, Me;
        switch (R.type) {
          case "rect":
            he = p(R.b, R.h), Ve = ne, Me = W;
            break;
          case "circ":
            he = x(R.d), Ve = ne, Me = W;
            break;
          case "I":
            he = g(R.b, R.h, R.tf, R.tw), Ve = ve, Me = ge;
            break;
          case "HSS":
            he = S(R.b, R.h, R.tw ?? R.b * 0.05), Ve = ve, Me = ge;
            break;
          case "CFT":
            he = C(R.b, R.h, R.tw ?? R.b * 0.05), Ve = ve, Me = ge;
            break;
          case "L":
            he = v(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3), Ve = ve, Me = ge;
            break;
          case "2L":
            he = Z(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3, R.dis ?? 0.01), Ve = ve, Me = ge;
            break;
          case "C":
          case "coldC":
            he = ye(R.b, R.h, R.tf ?? R.t ?? 3e-3, R.tw ?? R.t ?? 3e-3), Ve = ve, Me = ge;
            break;
          case "2C":
            he = le(R.b, R.h, R.tf ?? 5e-3, R.tw ?? 5e-3, R.dis ?? 0.01), Ve = ve, Me = ge;
            break;
          case "T":
            he = te(R.b, R.h, R.tf ?? 0.01, R.tw ?? 6e-3), Ve = ve, Me = ge;
            break;
          case "pipe":
            he = z(R.d, R.tw ?? R.d * 0.05), Ve = ve, Me = ge;
            break;
          default:
            return;
        }
        const Le = new Oe(he.fill, Ve);
        Le.position.set(...ce), Le.rotation.setFromRotationMatrix(G), d.add(Le);
        const Qe = new zt(he.outline, Me);
        Qe.position.set(...ce), Qe.rotation.setFromRotationMatrix(G), d.add(Qe);
      }
      const ue = Ws(R);
      if (ue) {
        const Ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(R.type) ? "#ff9900" : "#00ccff", Me = new kt(ue, Ve, "transparent");
        Me.position.set(ce[0], ce[1], ce[2]);
        const Le = 0.05 * l.gridSize.rawVal * 0.5;
        Me.updateScale(Le * ((f == null ? void 0 : f.rawVal) ?? 1)), w.add(Me);
      }
    });
  }), f && q.derive(() => {
    if (f.val, !l.sections.rawVal) return;
    const I = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((U) => {
      U instanceof kt && U.updateScale(I * f.rawVal);
    });
  }), q.derive(() => {
    d.visible = l.sections.val;
  }), q.derive(() => {
    w.visible = l.sectionLabels.val;
  }), d;
}
function Os(e) {
  if (!e) return null;
  const l = e.type, u = (C, v) => [C, v], f = (C, v) => [u(-C / 2, -v / 2), u(C / 2, -v / 2), u(C / 2, v / 2), u(-C / 2, v / 2)], d = (C, v = 24) => {
    const Z = C / 2, ye = [];
    for (let le = 0; le < v; le++) {
      const te = 2 * Math.PI * le / v;
      ye.push(u(Z * Math.cos(te), Z * Math.sin(te)));
    }
    return ye;
  }, w = e.b ?? 0, p = e.h ?? 0, x = e.d ?? 0, g = e.tw ?? e.t ?? 0, S = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return w && p ? { contorno: f(w, p) } : null;
    case "circ":
      return x ? { contorno: d(x) } : null;
    case "pipe":
      return x && g ? { contorno: d(x), huecos: [d(x - 2 * g).reverse()] } : null;
    case "HSS":
      return w && p && g ? { contorno: f(w, p), huecos: [f(w - 2 * g, p - 2 * (S || g)).reverse()] } : null;
    case "CFT":
      return w && p ? { contorno: f(w, p) } : null;
    case "I":
      return w && p && g && S ? { contorno: [u(-w / 2, -p / 2), u(w / 2, -p / 2), u(w / 2, -p / 2 + S), u(g / 2, -p / 2 + S), u(g / 2, p / 2 - S), u(w / 2, p / 2 - S), u(w / 2, p / 2), u(-w / 2, p / 2), u(-w / 2, p / 2 - S), u(-g / 2, p / 2 - S), u(-g / 2, -p / 2 + S), u(-w / 2, -p / 2 + S)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && p && g && S ? { contorno: [u(-w / 2, -p / 2), u(w / 2, -p / 2), u(w / 2, -p / 2 + S), u(-w / 2 + g, -p / 2 + S), u(-w / 2 + g, p / 2 - S), u(w / 2, p / 2 - S), u(w / 2, p / 2), u(-w / 2, p / 2)] } : null;
    case "T":
      return w && p && g && S ? { contorno: [u(-g / 2, -p / 2), u(g / 2, -p / 2), u(g / 2, p / 2 - S), u(w / 2, p / 2 - S), u(w / 2, p / 2), u(-w / 2, p / 2), u(-w / 2, p / 2 - S), u(-g / 2, p / 2 - S)] } : null;
    case "L":
    case "2L":
      return w && p && g ? { contorno: [u(-w / 2, -p / 2), u(w / 2, -p / 2), u(w / 2, -p / 2 + g), u(-w / 2 + g, -p / 2 + g), u(-w / 2 + g, p / 2), u(-w / 2, p / 2)] } : null;
    default:
      return w && p ? { contorno: f(w, p) } : x ? { contorno: d(x) } : null;
  }
}
function Qs(e, l, u) {
  if (!e || e <= 0 || !l || !u || l <= 0 || u <= 0) return null;
  const f = Math.sqrt(Math.sqrt(u / l)), d = Math.sqrt(e / f), w = e / d;
  return !isFinite(d) || !isFinite(w) || d <= 0 || w <= 0 ? null : { contorno: [[-d / 2, -w / 2], [d / 2, -w / 2], [d / 2, w / 2], [-d / 2, w / 2]] };
}
function js(e) {
  const l = new _n();
  e.contorno.forEach(([u, f], d) => d ? l.lineTo(u, f) : l.moveTo(u, f)), l.closePath();
  for (const u of e.huecos ?? []) {
    const f = new Cs();
    u.forEach(([d, w], p) => p ? f.lineTo(d, w) : f.moveTo(d, w)), f.closePath(), l.holes.push(f);
  }
  return l;
}
function ea(e, l, u) {
  const f = new tt();
  f.name = "extrusion";
  const d = new so({ color: 8369151, transparent: true, opacity: 0.92, side: Pt }), w = new so({ color: 12623968, transparent: true, opacity: 0.85, side: Pt }), p = new so({ color: 11583173, transparent: true, opacity: 0.85, side: Pt }), x = new tt();
  x.add(new Jo(16777215, 0.55));
  const g = new Xn(16777215, 0.75);
  g.position.set(30, 25, 40);
  const S = new Xn(16777215, 0.35);
  S.position.set(-25, -20, 15), x.add(g, S);
  let C = 0;
  return q.derive(() => {
    var _a2, _b, _c, _d, _e;
    const v = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++C, on: v }, f.visible = v;
    for (const W of [...f.children]) W !== x && (f.remove(W), (_c = (_b = W.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (f.children.includes(x) || f.add(x), !v) return;
    const Z = u.val ?? [], ye = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], le = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, te = le.sectionShapes ?? /* @__PURE__ */ new Map(), z = le.thicknesses ?? /* @__PURE__ */ new Map();
    let ne = "";
    try {
      ye.forEach((W, ve) => {
        var _a3, _b2, _c2;
        if (W.length === 2) {
          let ge = Os(te.get(ve)), B = true;
          if (ge || (ge = Qs((_a3 = le.areas) == null ? void 0 : _a3.get(ve), (_b2 = le.momentsOfInertiaY) == null ? void 0 : _b2.get(ve), (_c2 = le.momentsOfInertiaZ) == null ? void 0 : _c2.get(ve)), B = false), !ge) return;
          const I = Z[W[0]], U = Z[W[1]];
          if (!I || !U) return;
          const T = Math.hypot(U[0] - I[0], U[1] - I[1], U[2] - I[2]);
          if (T < 1e-9) return;
          const E = new Ps(js(ge), { depth: T, bevelEnabled: false, curveSegments: 4 });
          E.applyMatrix4(new fo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const X = new Oe(E, B ? d : w);
          X.position.set(I[0], I[1], I[2]), X.rotation.setFromRotationMatrix(Yn(I, U)), f.add(X);
          return;
        }
        if (W.length === 3 || W.length === 4) {
          const ge = z.get(ve);
          if (!ge || ge <= 0) return;
          const B = W.map((G) => Z[G]).filter(Boolean);
          if (B.length < 3) return;
          const I = [B[1][0] - B[0][0], B[1][1] - B[0][1], B[1][2] - B[0][2]], U = [B[2][0] - B[0][0], B[2][1] - B[0][1], B[2][2] - B[0][2]], T = I[1] * U[2] - I[2] * U[1], E = I[2] * U[0] - I[0] * U[2], X = I[0] * U[1] - I[1] * U[0], D = Math.hypot(T, E, X);
          if (D < 1e-12) return;
          const $ = [T / D, E / D, X / D], Q = [], re = (G) => B.map((ue) => [ue[0] + $[0] * G, ue[1] + $[1] * G, ue[2] + $[2] * G]), se = re(+ge / 2), j = re(-ge / 2), R = (G, ue, he) => Q.push(...G, ...ue, ...he);
          for (const G of [se, j]) R(G[0], G[1], G[2]), G.length === 4 && R(G[0], G[2], G[3]);
          for (let G = 0; G < B.length; G++) {
            const ue = (G + 1) % B.length;
            R(se[G], j[G], j[ue]), R(se[G], j[ue], se[ue]);
          }
          const ce = new be();
          ce.setAttribute("position", new Mt(Q, 3)), ce.computeVertexNormals(), f.add(new Oe(ce, p));
        }
      });
    } catch (W) {
      ne = String((W == null ? void 0 : W.message) ?? W);
    }
    globalThis.__extrusionDebug = { corridas: C, on: v, fallo: ne, nElementos: ye.length, nFormas: te.size, nEspesores: z.size, mallas: f.children.length - 1 };
  }), f;
}
class Ln extends tt {
  constructor(l, u, f, d, w, p, x) {
    super();
    const g = new _n().moveTo(0, 0).lineTo(0, p[1]).lineTo(f, p[1]).lineTo(f, 0).lineTo(0, 0), S = g.getPoints(), C = new be().setFromPoints(S);
    this.lines = new zt(C, new ut({ color: rn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(d), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const v = new Bn(g), Z = new st({ color: p[1] > 0 ? 24435 : 11411474, side: Pt });
    this.mesh = new Oe(v, Z), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(d), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new kt(`${w[1].toFixed(4)}`), this.normalizedResult = p, this.textPosition = Sn([l, u]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(d), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Uo extends tt {
  constructor(l, u, f, d, w, p, x) {
    super();
    const g = w[0] * f / (w[0] + w[1]), S = w[0] * w[1] > 0;
    if (this.text = new kt(`${w[0].toFixed(4)}`), this.text2 = new kt(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = p, this.textPosition = po(l, u), this.text2Position = po(u, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(d), this.text2.rotation.setFromRotationMatrix(d), this.add(this.text, this.text2), S) {
      const C = new _n().moveTo(0, 0).lineTo(0, p[0]).lineTo(g, 0).lineTo(0, 0), v = new _n().moveTo(g, 0).lineTo(f, -p[1]).lineTo(f, 0).lineTo(g, 0), Z = C.getPoints(), ye = v.getPoints(), le = new be().setFromPoints(Z), te = new be().setFromPoints(ye), z = new ut({ color: rn().resultOutline });
      this.lines = new zt(le, z), this.lines2 = new zt(te, z), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(d), this.lines2.rotation.setFromRotationMatrix(d), x && this.lines.rotateX(Math.PI / 2), x && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ne = new Bn(C), W = new Bn(v), ve = new st({ color: p[0] > 0 ? 24435 : 11411474, side: Pt }), ge = new st({ color: -p[1] > 0 ? 24435 : 11411474, side: Pt });
      this.mesh = new Oe(ne, ve), this.mesh2 = new Oe(W, ge), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(d), this.mesh2.rotation.setFromRotationMatrix(d), x && this.mesh.rotateX(Math.PI / 2), x && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const C = new _n().moveTo(0, 0).lineTo(0, p[0]).lineTo(f, -p[1]).lineTo(f, 0).lineTo(0, 0), v = C.getPoints(), Z = new be().setFromPoints(v);
      this.lines = new zt(Z, new ut({ color: rn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(d), x && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ye = new Bn(C), le = new st({ color: p[0] > 0 ? 24435 : 11411474, side: Pt });
      this.mesh = new Oe(ye, le), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(d), x && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var ns = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(ns || {});
function ta(e, l, u, f) {
  const d = new tt(), w = { normals: Ln, shearsY: Ln, shearsZ: Ln, torsions: Ln, bendingsY: Uo, bendingsZ: Uo };
  return q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, u.val, l.frameResults.val == "none") return;
    d.children.forEach((x) => x.dispose()), d.clear();
    const p = ns[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[p]) == null ? void 0 : _b.forEach((x, g) => {
      var _a3, _b2;
      const S = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[g]) ?? [0, 1], C = u.rawVal[S[0]], v = u.rawVal[S[1]], Z = new M(...v).distanceTo(new M(...C)), ye = na((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[p]), le = x == null ? void 0 : x.map((W) => W / (ye === 0 ? 1 : ye)), te = Yn(C, v), z = new w[p](C, v, Z, te, x ?? [0, 0], le ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(p)), ne = 0.05 * l.gridSize.rawVal;
      z.updateScale(ne * f.rawVal), d.add(z);
    });
  }), q.derive(() => {
    if (f.val, l.frameResults.rawVal == "none") return;
    const p = 0.05 * l.gridSize.val;
    d.children.forEach((x) => x.updateScale(p * f.rawVal));
  }), q.derive(() => {
    d.visible = l.frameResults.val != "none";
  }), d;
}
function na(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((u) => {
    const f = Math.max(...u ?? [0, 0]);
    f > l && (l = f);
  }), l;
}
class oa extends tt {
  constructor(l, u, f) {
    super();
    const d = u === mo.reactions;
    f[0] && (this.xText1 = new kt(`${d ? "Fx" : "Dx"}: ` + f[0].toFixed(4))), f[3] && (this.xText2 = new kt(`${d ? "Mx" : "Rx"}: ` + f[3].toFixed(4))), f[1] && (this.yText1 = new kt(`${d ? "Fy" : "Dy"}: ` + f[1].toFixed(4))), f[4] && (this.yText2 = new kt(`${d ? "My" : "Ry"}: ` + f[4].toFixed(4))), f[2] && (this.zText1 = new kt(`${d ? "Fz" : "Dz"}: ` + f[2].toFixed(4))), f[5] && (this.zText2 = new kt(`${d ? "Mz" : "Rz"}: ` + f[5].toFixed(4))), (f[0] || f[3]) && (this.xArrow = new ln(new M(1, 0, 0), new M(0, 0, 0), 1, 15637248, 0.3, 0.3)), (f[1] || f[4]) && (this.yArrow = new ln(new M(0, 1, 0), new M(0, 0, 0), 1, 15637248, 0.3, 0.3)), (f[2] || f[5]) && (this.zArrow = new ln(new M(0, 0, 1), new M(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(l) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(l, l, l), (_b = this.yArrow) == null ? void 0 : _b.scale.set(l, l, l), (_c = this.zArrow) == null ? void 0 : _c.scale.set(l, l, l), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * l, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * l, 0, 0.5 * l), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * l, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * l, 0.5 * l), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * l), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * l + 0.5 * l), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * l), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * l), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * l), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * l), (_n2 = this.zText1) == null ? void 0 : _n2.updateScale(0.4 * l), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var mo = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(mo || {});
function sa(e, l, u, f) {
  const d = new tt();
  return q.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    d.children.forEach((x) => x.dispose()), d.clear();
    const w = mo[l.nodeResults.rawVal], p = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[w]) == null ? void 0 : _b.forEach((x, g) => {
      const S = new oa(u.rawVal[g], w, x ?? [0, 0, 0, 0, 0, 0]);
      S.updateScale(p * f.rawVal), d.add(S);
    });
  }), q.derive(() => {
    if (f.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    d.children.forEach((p) => p.updateScale(w * f.rawVal));
  }), q.derive(() => {
    d.visible = l.nodeResults.val != "none";
  }), d;
}
function aa({ drawingObj: e, gridObj: l, scene: u, getActiveCamera: f, controls: d, gridSize: w, derivedDisplayScale: p, rendererElm: x, viewerRender: g }) {
  const S = new zs(), C = new Fs(), v = (n) => {
    const o = x.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const m = s / 2;
      if (a >= m) return C.x = (a - m) / m * 2 - 1, C.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? f();
      C.x = a / m * 2 - 1;
    } else C.x = a / s * 2 - 1;
    return C.y = -(t / i) * 2 + 1, f();
  }, Z = new Oe(new jt(1e4, 1e4), new st({ side: Pt, transparent: true, opacity: 0, depthWrite: false }));
  Z.visible = true, Z.frustumCulled = false, u.add(Z);
  const ye = (n, o, a) => {
    const t = new Oe(new jt(1e4, 1e4), new st({ side: Pt, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, u.add(t), t;
  }, le = ye(Math.PI / 2, 0, 0), te = ye(0, Math.PI / 2, 0);
  let z = false;
  const ne = () => {
    if (z) return S.intersectObjects([Z], false);
    if (le.visible = !!window.__hekatanGridPlaneXZ, te.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ee.visible) {
      const a = S.intersectObjects([Ee, De, Be], false);
      if (a.length > 0) return a;
    }
    const o = [Z];
    return le.visible && o.push(le), te.visible && o.push(te), Xt.visible && Ot.length > 0 && o.push(...Ot), S.intersectObjects(o, false);
  }, W = new In(new be(), new Dn()), ve = new In(new be(), new Dn({ color: "gray", sizeAttenuation: false, size: 6 })), ge = new In(new be(), new Dn({ color: "orange", size: 0.1 }));
  u.add(ge);
  const B = document.createElement("input");
  B.id = "hk-rubber-label", B.type = "text", B.spellcheck = false, B.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, B.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(B);
  let I = null, U = null, T = false;
  const E = new M(), X = (n, o, a, t, s, i) => {
    const c = t - n, m = s - o, y = i - a, b = Math.hypot(c, m, y);
    if (b < 0.01) {
      B.style.display = "none";
      return;
    }
    I = [n, o, a], U = [c / b, m / b, y / b], E.set((n + t) / 2, (o + s) / 2, (a + i) / 2), E.project(f());
    const _ = x.getBoundingClientRect(), r = _.left + (E.x * 0.5 + 0.5) * _.width, h = _.top + (-E.y * 0.5 + 0.5) * _.height;
    if (B.style.left = r + "px", B.style.top = h + "px", B.style.display = "block", !T) {
      if (B.value = `${b.toFixed(2)} m`, document.activeElement !== B) {
        const k = document.activeElement;
        k && (k.tagName === "INPUT" || k.tagName === "TEXTAREA") && k !== B || B.focus({ preventScroll: true });
      }
      try {
        B.select();
      } catch {
      }
    }
  }, D = () => {
    B.style.display = "none", I = null, U = null, T = false, document.activeElement === B && B.blur();
  }, $ = (n) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      an = n, ee(`\u21C9 DESFASE distancia ${n} m \u2014 designe la l\xEDnea y luego el lado.`), B.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ae.length === 1) {
      const _ = Ae[0];
      Ae = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, _[0], _[1], _[2], n), ee(`\u2713 C\xEDrculo r=${n} m en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}).`);
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
      wt = n, ee(`\u{1F4D0} Altura ${n}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), B.blur();
      return;
    }
    if (!I || !U || !e.polylines) return;
    let a = U[0], t = U[1], s = U[2];
    at === "x" ? (a = Math.sign(a) || 1, t = 0, s = 0) : at === "y" ? (a = 0, t = Math.sign(t) || 1, s = 0) : at === "z" && (a = 0, t = 0, s = Math.sign(s) || 1);
    const i = I[0] + a * n, c = I[1] + t * n, m = I[2] + s * n;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, c, m]];
    const y = e.polylines.rawVal, b = y.length ? y[y.length - 1] : [];
    e.polylines.val = [...y.slice(0, -1), [...b, e.points.rawVal.length - 1]], B.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    g();
  }, Q = (n) => {
    let o = n.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const a = o.startsWith("@");
    if (a && (o = o.slice(1)), o.includes("<")) {
      const s = o.split("<").map((i) => parseFloat(i.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [i, c] = s;
        return a ? { kind: "relPolar", L: i, ang: c } : { kind: "absPolar", L: i, ang: c };
      }
      if (s.length === 3 && a) {
        const [i, c, m] = s;
        return { kind: "relSpherical", L: i, az: c, el: m };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((y) => parseFloat(y.trim()));
      if (s.some(isNaN)) return null;
      const [i, c, m = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: c, dz: m } : { kind: "absCart", x: i, y: c, z: m };
    }
    const t = parseFloat(o);
    return isNaN(t) || t <= 0 ? null : { kind: "length", L: t };
  }, re = (n) => {
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
  }, se = (n) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, n];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], I = n, B.blur();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    g();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (n) => {
    var _a2;
    const o = Q(n);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const a = re(o);
    if (!a) return false;
    Fo(new M(a[0], a[1], a[2]), null), I = a, B.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, B.addEventListener("keydown", (n) => {
    if (n.key === "Enter") {
      n.preventDefault();
      const a = Q(B.value);
      if (!a) return;
      if (T = false, a.kind === "length") $(a.L), ee(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = re(a);
        if (!t) return;
        se(t);
        const s = a.kind;
        ee(`\u270F ${s} \u2192 (${t[0].toFixed(2)}, ${t[1].toFixed(2)}, ${t[2].toFixed(2)})`);
      }
      return;
    }
    if (n.key === "Escape") {
      n.preventDefault(), T = false, B.blur();
      return;
    }
    const o = n.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      n.preventDefault(), setTimeout(() => {
        if (!T && B.style.display === "block") try {
          B.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(n.key) || n.key === "Backspace" || n.key === "Delete") && (T = true);
  }), window.addEventListener("keydown", (n) => {
    if (!I || !U || document.activeElement === B) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(n.key) && (B.value = n.key, B.focus(), B.setSelectionRange(1, 1), n.preventDefault());
  });
  const j = document.createElement("div");
  j.id = "hk-coord-readout", j.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", j.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(j);
  const R = document.createElement("div");
  R.id = "hk-coord-fixed", R.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", R.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(R);
  const ce = new zt(new be().setFromPoints([new M(0, 0, 0), new M(0, 0, 0)]), new Mn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  ce.frustumCulled = false, ce.visible = false, u.add(ce);
  const G = new zt(new be(), new ut({ color: 2282478, transparent: true, opacity: 0.9 }));
  G.frustumCulled = false, G.visible = false, u.add(G);
  let ue = [];
  const he = new tt(), Ve = new Oe(new jt(1, 1), new st({ color: 2282478, transparent: true, opacity: 0.08, side: Pt, depthWrite: false })), Me = new qt(new Lo(new jt(1, 1)), new ut({ color: 2282478, transparent: true, opacity: 0.85 })), Le = new qt(new be(), new ut({ color: 2282478, transparent: true, opacity: 0.3 })), Qe = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-n, i, 0, n, i, 0), a.push(i, -n, 0, i, n, 0);
    }
    Le.geometry.dispose(), Le.geometry = new be(), Le.geometry.setAttribute("position", new Mt(a, 3));
  };
  he.add(Ve, Me, Le), he.visible = false, he.frustumCulled = false, u.add(he);
  const ct = new tt();
  ct.frustumCulled = false, ct.visible = false, u.add(ct);
  const ae = (n) => {
    const o = new be().setFromPoints([new M(0, 0, 0), new M(0, 0, 0)]), a = new Mn({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new zt(o, a);
  }, F = ae(16711680), K = ae(65280), N = ae(35071);
  ct.add(F, K, N);
  const O = (n) => {
    const o = new be().setFromPoints([new M(0, 0, 0), new M(0, 0, 0), new M(0, 0, 0), new M(0, 0, 0)]), a = new ut({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new Wo(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, ie = O(3462041), fe = O(16724804), pe = O(6333946), ke = new tt();
  ke.frustumCulled = false, ke.visible = false, u.add(ke), ke.add(ie, fe, pe);
  const Fe = (n) => {
    const o = new jt(1, 1), a = new st({ color: n, transparent: true, opacity: 0.06, side: Pt, depthWrite: false }), t = new Oe(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, Ee = Fe(3462041), De = Fe(16724804), Be = Fe(6333946);
  ke.add(Ee, De, Be);
  const Ke = (n, o, a, t) => {
    n.scale.set(2 * t, 2 * t, 1), a === "xy" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, 0, 0)) : a === "xz" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(Math.PI / 2, 0, 0)) : (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, Math.PI / 2, 0));
  }, $e = document.createElement("div");
  $e.id = "hk-refplane-badge", $e.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild($e), window.__hekatanSetOrthoPlanes = (n) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = n, ke.visible = n, n) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], c = window.__hekatanOrthoExt ?? 8;
      Ge(ie, i, "xy", c), Ge(fe, i, "xz", c), Ge(pe, i, "yz", c), Ke(Ee, i, "xy", c), Ke(De, i, "xz", c), Ke(Be, i, "yz", c), Ee.material.opacity = 0.05, De.material.opacity = 0.05, Be.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    g();
  }, window.__hekatanSetOrthoExt = (n) => {
    var _a2;
    if (window.__hekatanOrthoExt = n, !ke.visible) {
      g();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0];
    Ge(ie, i, "xy", n), Ge(fe, i, "xz", n), Ge(pe, i, "yz", n), Ke(Ee, i, "xy", n), Ke(De, i, "xz", n), Ke(Be, i, "yz", n), g();
  };
  const mt = (n) => {
    if (Ee.material.opacity = n === "xy" ? 0.09 : 0.025, De.material.opacity = n === "xz" ? 0.09 : 0.025, Be.material.opacity = n === "yz" ? 0.09 : 0.025, n) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[n];
      $e.style.background = s.bg, $e.style.color = s.text, $e.textContent = `\u25A6 Plano ${n.toUpperCase()}`, $e.style.display = "block";
    } else $e.style.display = "none";
  }, Ge = (n, o, a, t) => {
    let s;
    a === "xy" ? s = [new M(o[0] - t, o[1] - t, o[2]), new M(o[0] + t, o[1] - t, o[2]), new M(o[0] + t, o[1] + t, o[2]), new M(o[0] - t, o[1] + t, o[2]), new M(o[0] - t, o[1] - t, o[2])] : a === "xz" ? s = [new M(o[0] - t, o[1], o[2] - t), new M(o[0] + t, o[1], o[2] - t), new M(o[0] + t, o[1], o[2] + t), new M(o[0] - t, o[1], o[2] + t), new M(o[0] - t, o[1], o[2] - t)] : s = [new M(o[0], o[1] - t, o[2] - t), new M(o[0], o[1] + t, o[2] - t), new M(o[0], o[1] + t, o[2] + t), new M(o[0], o[1] - t, o[2] + t), new M(o[0], o[1] - t, o[2] - t)], n.geometry.setFromPoints(s);
  };
  let at = null;
  window.__hekatanAxisLock = () => at;
  let dt = null;
  const it = document.createElement("div");
  it.id = "hk-axis-lock-badge", it.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(it);
  const Zt = () => {
    if (!at) {
      it.style.display = "none";
      return;
    }
    const n = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    it.style.background = "rgba(15,23,42,0.92)", it.style.color = n[at], it.style.border = `1.5px solid ${n[at]}`, it.textContent = `\u{1F512} LOCK ${at.toUpperCase()}`, it.style.display = "block";
  };
  window.addEventListener("keydown", (n) => {
    var _a2, _b, _c, _d, _e, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== B) return;
    const a = n.key.toLowerCase(), t = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (n.key === "Enter" && t === "polyarea" && ue.length >= 3) {
      const s = pn();
      ee(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), n.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") at = at === a ? null : a, Zt(), n.preventDefault();
    else if (n.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), ko(), n.preventDefault();
    } else n.key === "F3" ? (n.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : n.key === "F10" ? (n.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : n.key === "F8" && (n.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const n = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = n, n || An(), ee(`\u{1F9F2} OSNAP ${n ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const n = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = n, n || (ct.visible = false), ee(`\u25C8 POLAR ${n ? "ON" : "OFF"} (F10)`);
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
  const Ne = new M(), Re = new M(), ze = new M(), qe = (n) => {
    if (!at) return null;
    const o = n[0], a = n[1], t = n[2];
    return at === "x" ? (Ne.set(o - 1e4, a, t), Re.set(o + 1e4, a, t)) : at === "y" ? (Ne.set(o, a - 1e4, t), Re.set(o, a + 1e4, t)) : (Ne.set(o, a, t - 1e4), Re.set(o, a, t + 1e4)), S.ray.distanceSqToSegment(Ne, Re, null, ze), ze;
  };
  window.__hekatanProjectOnAxis = qe;
  const xe = new zt(new be().setFromPoints([new M(0, 0, 0), new M(0, 0, 0)]), new ut({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  xe.renderOrder = 998, xe.frustumCulled = false, xe.visible = false, u.add(xe);
  let Ze = -1, He = -1, xt = -1;
  const we = /* @__PURE__ */ new Set();
  window.__hekatanSelection = we;
  const Xe = new zt(new be().setFromPoints([new M(), new M()]), new ut({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Xe.renderOrder = 997, Xe.frustumCulled = false, Xe.visible = false, u.add(Xe);
  const nt = new Oe(new wn(0.02, 12, 12), new st({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  nt.renderOrder = 998, nt.visible = false, u.add(nt);
  const gt = (n) => {
    const o = f();
    if (o.isOrthographicCamera) {
      const t = o, s = (t.top - t.bottom) / t.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(n);
    return Math.max(0.05, a / 10);
  }, Kt = () => {
    nt.visible && nt.scale.setScalar(gt(nt.position));
  }, bt = new tt();
  bt.frustumCulled = false, u.add(bt);
  const Et = 2282478;
  let lt = null;
  const en = (n, o, a, t) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, c = t;
    for (let m = 0; m < s.length; m++) {
      const y = s[m];
      if (!y) continue;
      const b = Math.hypot(n - y[0], o - y[1], a - y[2]);
      b < c && (c = b, i = m);
    }
    return i;
  }, It = () => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    for (; bt.children.length; ) {
      const c = bt.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = ((_e = e.points) == null ? void 0 : _e.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const c of we) {
      const [m, ...y] = c.split(":");
      if (m === "pt") {
        const b = n[+y[0]];
        if (!b) continue;
        const _ = new Oe(new wn(0.025, 12, 12), new st({ color: Et, transparent: true, opacity: 0.9, depthTest: false }));
        _.position.set(b[0], b[1], b[2]), _.renderOrder = 999, _.__isSelectionPt = true, bt.add(_);
      } else if (m === "seg") {
        const b = o[+y[0]], _ = n[b == null ? void 0 : b[+y[1]]], r = n[b == null ? void 0 : b[+y[1] + 1]];
        if (!_ || !r) continue;
        const h = new be().setFromPoints([new M(_[0], _[1], _[2]), new M(r[0], r[1], r[2])]), k = new zt(h, new ut({ color: Et, transparent: true, opacity: 0.95, depthTest: false }));
        k.renderOrder = 999, bt.add(k);
      } else if (m === "poly") {
        const _ = o[+y[0]].map((k) => {
          const A = n[k];
          return A ? new M(A[0], A[1], A[2]) : null;
        }).filter(Boolean);
        if (_.length < 2) continue;
        const r = new be().setFromPoints(_), h = new zt(r, new ut({ color: Et, transparent: true, opacity: 0.95, depthTest: false }));
        h.renderOrder = 999, bt.add(h);
      } else if (m === "aux") {
        const b = t[+y[0]];
        if (!b || b.length !== 6) continue;
        const _ = new be().setFromPoints([new M(b[0], b[1], b[2]), new M(b[3], b[4], b[5])]), r = new zt(_, new ut({ color: Et, transparent: true, opacity: 0.95, depthTest: false }));
        r.renderOrder = 999, bt.add(r);
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
    g();
  };
  window.__hekatanRefreshSelection = It, window.__hekatanClearSelection = () => {
    we.clear(), It();
  };
  const Jt = (n, o, a, t, s, i, c, m, y) => {
    const b = c - t, _ = m - s, r = y - i, h = b * b + _ * _ + r * r;
    if (h < 1e-12) return Math.hypot(n - t, o - s, a - i);
    let k = ((n - t) * b + (o - s) * _ + (a - i) * r) / h;
    k = Math.max(0, Math.min(1, k));
    const A = t + k * b, V = s + k * _, L = i + k * r;
    return Math.hypot(n - A, o - V, a - L);
  }, tn = (n, o, a, t) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let c = -1, m = -1, y = t;
    for (let b = 0; b < s.length; b++) {
      const _ = s[b];
      for (let r = 0; r < _.length - 1; r++) {
        const h = i[_[r]], k = i[_[r + 1]];
        if (!h || !k) continue;
        const A = Jt(n, o, a, h[0], h[1], h[2], k[0], k[1], k[2]);
        A < y && (y = A, c = b, m = r);
      }
    }
    return c >= 0 ? { polyIdx: c, segIdx: m, dist: y } : null;
  }, nn = (n, o, a, t) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let c = -1, m = t;
    for (let y = 0; y < i.length; y++) {
      const b = i[y];
      if (!b || b.length !== 6) continue;
      const _ = Jt(n, o, a, b[0], b[1], b[2], b[3], b[4], b[5]);
      _ < m && (m = _, c = y);
    }
    return c;
  }, Un = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      xe.visible = false;
      return;
    }
    xe.geometry.setFromPoints([new M(t[0], t[1], t[2]), new M(t[3], t[4], t[5])]), xe.visible = true;
  }, Zn = (n, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[n], t = e.points.rawVal;
    if (!a || a.length < 2) {
      xe.visible = false;
      return;
    }
    const s = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(n)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const c of a) {
      const m = t[c];
      m && i.push(new M(m[0], m[1], m[2]));
    }
    else {
      const c = t[a[o]], m = t[a[o + 1]];
      c && i.push(new M(c[0], c[1], c[2])), m && i.push(new M(m[0], m[1], m[2]));
    }
    xe.geometry.setFromPoints(i), xe.visible = true;
  }, cn = (n) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (n < 0 || n >= o.length) return;
    const a = o.filter((y, b) => b !== n), t = /* @__PURE__ */ new Set();
    for (const y of a) for (const b of y) t.add(b);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), c = [];
    for (let y = 0; y < s.length; y++) t.has(y) && (i.set(y, c.length), c.push(s[y]));
    const m = a.map((y) => y.map((b) => i.get(b)).filter((b) => b !== void 0));
    e.points.val = c, e.polylines.val = m, e.areas && (e.areas.val = e.areas.rawVal.filter((y) => y !== n).map((y) => y > n ? y - 1 : y)), xe.visible = false, Ze = -1, He = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, Pn = (n, o) => {
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
    const c = [...a.slice(0, n), ...i, ...a.slice(n + 1)], m = /* @__PURE__ */ new Set();
    for (const h of c) for (const k of h) m.add(k);
    const y = e.points.rawVal, b = /* @__PURE__ */ new Map(), _ = [];
    for (let h = 0; h < y.length; h++) m.has(h) && (b.set(h, _.length), _.push(y[h]));
    const r = c.map((h) => h.map((k) => b.get(k)).filter((k) => k !== void 0));
    if (e.points.val = _, e.polylines.val = r, e.areas) {
      const h = i.length - 1;
      e.areas.val = e.areas.rawVal.map((k) => k > n ? k + h : k);
    }
    xe.visible = false, Ze = -1, He = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  W.geometry.setAttribute("position", new Mt(e.points.rawVal.flat(), 3)), W.geometry.computeBoundingSphere(), W.frustumCulled = false, ve.frustumCulled = false, u.add(ve), Z.position.set(0, 0, 0), Z.rotateX(Math.PI / 2), Z.geometry.rotateX(Math.PI / 2), Z.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
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
  window.__hekatanCirculos = dn, window.__hekatanDrawCircle = (n, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const c = Math.max(4, Math.round(s)), m = e.points.rawVal.length, y = [];
    for (let b = 0; b < c; b++) {
      const _ = 2 * Math.PI * b / c, r = t * Math.cos(_), h = t * Math.sin(_);
      let k;
      i === "xy" ? k = [n + r, o + h, a] : i === "xz" ? k = [n + r, o, a + h] : k = [n, o + r, a + h], y.push(k);
    }
    if (e.points.val = [...e.points.rawVal, ...y], dn.push({ c: [n, o, a], r: t }), e.polylines) {
      const b = [...y.map((r, h) => m + h), m], _ = e.polylines.rawVal;
      ((_a2 = _[_.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [..._, b, []] : e.polylines.val = [..._.slice(0, -1), b, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(t)), i = new M(...n), c = new M(...o), m = new M(...a), y = new M().subVectors(c, i), b = new M().subVectors(m, i), _ = new M().crossVectors(y, b).normalize(), r = new M().addVectors(i, c).multiplyScalar(0.5), h = new M().addVectors(c, m).multiplyScalar(0.5), k = new M().crossVectors(y, _).normalize(), A = new M().crossVectors(new M().subVectors(m, c), _).normalize(), V = new M().subVectors(h, r), L = k.x * A.y - k.y * A.x;
    let P;
    if (Math.abs(L) > 1e-9) {
      const Te = (V.x * A.y - V.y * A.x) / L;
      P = new M().addVectors(r, k.clone().multiplyScalar(Te));
    } else P = r.clone();
    const Y = i.distanceTo(P), H = new M().subVectors(i, P), oe = new M().subVectors(m, P), Pe = Math.acos(Math.max(-1, Math.min(1, H.dot(oe) / (Y * Y)))), de = e.points.rawVal.length, me = [], We = _.clone();
    for (let Te = 0; Te <= s; Te++) {
      const Se = Te / s, Ye = Pe * Se, Ue = new ao().setFromAxisAngle(We, Ye), Je = H.clone().applyQuaternion(Ue).add(P);
      me.push([Je.x, Je.y, Je.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...me], dn.push({ c: [P.x, P.y, P.z], r: Y }), e.polylines) {
      const Te = me.map((Ye, Ue) => de + Ue), Se = e.polylines.rawVal;
      e.polylines.val = [...Se.slice(0, -1), Te, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(n[0], o[0]), c = Math.max(n[0], o[0]), m = Math.min(n[1], o[1]), y = Math.max(n[1], o[1]), b = (n[2] + o[2]) / 2, _ = c - i, r = y - m, h = Math.min(a, _ / 2 - 0.01, r / 2 - 0.01);
    if (h <= 0) return;
    const k = e.points.rawVal.length, A = [], V = [], L = (P, Y) => {
      A.push([P, Y, b]), V.push(k + A.length - 1);
    };
    for (let P = 0; P <= s; P++) L(i + h + (_ - 2 * h) * P / s, m);
    for (let P = 1; P <= t; P++) {
      const Y = -Math.PI / 2 + Math.PI / 2 * P / t;
      L(c - h + h * Math.cos(Y), m + h + h * Math.sin(Y));
    }
    for (let P = 1; P <= s; P++) L(c, m + h + (r - 2 * h) * P / s);
    for (let P = 1; P <= t; P++) {
      const Y = 0 + Math.PI / 2 * P / t;
      L(c - h + h * Math.cos(Y), y - h + h * Math.sin(Y));
    }
    for (let P = 1; P <= s; P++) L(c - h - (_ - 2 * h) * P / s, y);
    for (let P = 1; P <= t; P++) {
      const Y = Math.PI / 2 + Math.PI / 2 * P / t;
      L(i + h + h * Math.cos(Y), y - h + h * Math.sin(Y));
    }
    for (let P = 1; P <= s; P++) L(i, y - h - (r - 2 * h) * P / s);
    for (let P = 1; P <= t; P++) {
      const Y = Math.PI + Math.PI / 2 * P / t;
      L(i + h + h * Math.cos(Y), m + h + h * Math.sin(Y));
    }
    if (V.push(k), e.points.val = [...e.points.rawVal, ...A], e.polylines) {
      const P = e.polylines.rawVal;
      e.polylines.val = [...P.slice(0, -1), V, []];
    }
  }, window.__hekatanDrawRect = (n, o) => {
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], c = o[0], m = o[1], y = o[2];
    let b;
    if (Math.abs(i - y) < 1e-6 ? b = [[t, s, i], [c, s, i], [c, m, i], [t, m, i]] : Math.abs(s - m) < 1e-6 ? b = [[t, s, i], [c, s, i], [c, s, y], [t, s, y]] : b = [[t, s, i], [t, m, i], [t, m, y], [t, s, y]], e.points.val = [...e.points.rawVal, ...b], e.polylines) {
      const _ = [a, a + 1, a + 2, a + 3, a], r = e.polylines.rawVal;
      e.polylines.val = [...r.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRectArea = (n, o) => {
    var _a2;
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], c = o[0], m = o[1], y = o[2];
    let b;
    if (z && e.gridTarget) {
      const _ = e.gridTarget.rawVal, r = new bn(..._.rotation), h = new M(1, 0, 0).applyEuler(r), k = new M(0, 1, 0).applyEuler(r), A = new M(..._.position), V = new M(t, s, i), L = new M(c, m, y), P = V.clone().sub(A).dot(h), Y = V.clone().sub(A).dot(k), H = L.clone().sub(A).dot(h), oe = L.clone().sub(A).dot(k), Pe = (de, me) => A.clone().addScaledVector(h, de).addScaledVector(k, me).toArray();
      b = [Pe(P, Y), Pe(H, Y), Pe(H, oe), Pe(P, oe)];
    } else Math.abs(i - y) < 1e-6 ? b = [[t, s, i], [c, s, i], [c, m, i], [t, m, i]] : Math.abs(s - m) < 1e-6 ? b = [[t, s, i], [c, s, i], [c, s, y], [t, s, y]] : b = [[t, s, i], [t, m, i], [t, m, y], [t, s, y]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...b], e.polylines) {
      const _ = e.polylines.rawVal, r = _.length - 1, h = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [..._.slice(0, -1), h, []], e.areas && (e.areas.val = [...e.areas.rawVal, r]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    g();
  }, window.__hekatanMeshPolyArea = (n, o) => {
    var _a2;
    const a = n.length;
    if (a < 3) return 0;
    let t = 0, s = 0, i = 0;
    for (let _e = 0; _e < a; _e++) {
      const Ie = n[_e], et = n[(_e + 1) % a];
      t += (Ie[1] - et[1]) * (Ie[2] + et[2]), s += (Ie[2] - et[2]) * (Ie[0] + et[0]), i += (Ie[0] - et[0]) * (Ie[1] + et[1]);
    }
    const c = Math.hypot(t, s, i) || 1;
    t /= c, s /= c, i /= c;
    let m = n[1][0] - n[0][0], y = n[1][1] - n[0][1], b = n[1][2] - n[0][2];
    const _ = Math.hypot(m, y, b) || 1;
    m /= _, y /= _, b /= _;
    let r = s * b - i * y, h = i * m - t * b, k = t * y - s * m;
    const A = Math.hypot(r, h, k) || 1;
    r /= A, h /= A, k /= A;
    const V = n[0], L = (_e) => [(_e[0] - V[0]) * m + (_e[1] - V[1]) * y + (_e[2] - V[2]) * b, (_e[0] - V[0]) * r + (_e[1] - V[1]) * h + (_e[2] - V[2]) * k], P = (_e, Ie) => [V[0] + _e * m + Ie * r, V[1] + _e * y + Ie * h, V[2] + _e * b + Ie * k], Y = n.map(L);
    let H = 1 / 0, oe = -1 / 0, Pe = 1 / 0, de = -1 / 0;
    for (const [_e, Ie] of Y) _e < H && (H = _e), _e > oe && (oe = _e), Ie < Pe && (Pe = Ie), Ie > de && (de = Ie);
    const me = oe - H, We = de - Pe;
    if (me < 1e-6 || We < 1e-6) return 0;
    let Te = o && o > 0 ? o : 0.5;
    for (; me / Te * (We / Te) > 2500; ) Te *= 2;
    Te = Math.min(Te, Math.min(me, We));
    const Se = (_e, Ie) => {
      let et = false;
      for (let At = 0, Yt = Y.length - 1; At < Y.length; Yt = At++) {
        const [Bt, Wt] = Y[At], [mn, vn] = Y[Yt];
        Wt > Ie != vn > Ie && _e < (mn - Bt) * (Ie - Wt) / (vn - Wt) + Bt && (et = !et);
      }
      return et;
    }, Ye = Math.max(1, Math.round(me / Te)), Ue = Math.max(1, Math.round(We / Te)), Je = me / Ye, ft = We / Ue, Dt = /* @__PURE__ */ new Map(), ht = [], Ce = e.points.rawVal.length, rt = (_e, Ie) => {
      const et = _e + "," + Ie, At = Dt.get(et);
      if (At !== void 0) return At;
      const Yt = Ce + ht.length;
      return ht.push(P(H + _e * Je, Pe + Ie * ft)), Dt.set(et, Yt), Yt;
    }, je = [];
    for (let _e = 0; _e < Ye; _e++) for (let Ie = 0; Ie < Ue; Ie++) {
      if (!Se(H + (_e + 0.5) * Je, Pe + (Ie + 0.5) * ft)) continue;
      const et = rt(_e, Ie), At = rt(_e + 1, Ie), Yt = rt(_e + 1, Ie + 1), Bt = rt(_e, Ie + 1);
      je.push([et, At, Yt, Bt]);
    }
    if (!je.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...ht], e.polylines && e.areas) {
      let _e = e.polylines.rawVal.slice();
      _e.length && _e[_e.length - 1].length === 0 && (_e = _e.slice(0, -1));
      const Ie = [];
      for (const et of je) Ie.push(_e.length), _e.push([et[0], et[1], et[2], et[3], et[0]]);
      _e.push([]), e.polylines.val = _e, e.areas.val = [...e.areas.rawVal, ...Ie];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return g(), je.length;
  };
  const pn = () => {
    if (ue.length < 3) return ue = [], G.visible = false, g(), 0;
    const n = window.__hekatanMeshPolyArea(ue.slice());
    return ue = [], G.visible = false, g(), n;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a2;
    const t = new M(n[0], n[1], n[2]), s = new M(o[0], o[1], o[2]), i = new M(a[0], a[1], a[2]), c = new M().subVectors(s, t).cross(new M().subVectors(i, t));
    if (c.lengthSq() < 1e-9) return false;
    c.normalize();
    const m = new ao().setFromUnitVectors(new M(0, 0, 1), c), y = new bn().setFromQuaternion(m);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [y.x, y.y, y.z] }), z = true;
    const b = new M().addVectors(t, s).add(i).multiplyScalar(1 / 3), _ = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, r = _ / 2;
    Ve.geometry.dispose(), Ve.geometry = new jt(_, _), Me.geometry.dispose(), Me.geometry = new Lo(new jt(_, _)), Qe(r, 1), he.position.copy(b), he.quaternion.copy(m), he.scale.set(1, 1, 1), he.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return g(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] }), z = false, he.visible = false, g();
  };
  const Vt = new tt();
  Vt.visible = false, u.add(Vt), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a2, _b;
    for (; Vt.children.length; ) {
      const _ = Vt.children.pop();
      (_a2 = _.geometry) == null ? void 0 : _a2.dispose(), (_b = _.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, c = Math.min(...n) - t, m = Math.max(...n) + t, y = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", b = (_, r, h, k, A) => {
      const V = document.createElement("canvas");
      V.width = 64, V.height = 32;
      const L = V.getContext("2d");
      L.fillStyle = A, L.font = "bold 22px sans-serif", L.textAlign = "center", L.fillText(_, 32, 26);
      const P = new Ro(V), Y = new Io({ map: P, transparent: true }), H = new Do(Y);
      return H.position.set(r, h, k), H.scale.set(1.2, 0.6, 1), H;
    };
    n.forEach((_, r) => {
      const h = r < y.length ? y[r] : `X${r}`, k = new be().setFromPoints([new M(_, s, 0), new M(_, i, 0), new M(_, s, 0), new M(_, s, a)]), A = new Mn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), V = new qt(k, A);
      V.computeLineDistances(), Vt.add(V), Vt.add(b(h, _, s - 0.5, 0, "#60a5fa")), Vt.add(b(h, _, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((_, r) => {
      const h = `${r + 1}`, k = new be().setFromPoints([new M(c, _, 0), new M(m, _, 0), new M(c, _, 0), new M(c, _, a)]), A = new Mn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), V = new qt(k, A);
      V.computeLineDistances(), Vt.add(V), Vt.add(b(h, c - 0.5, _, 0, "#fb7185")), Vt.add(b(h, m + 0.5, _, 0, "#fb7185"));
    }), Vt.visible = true, g();
  }, window.__hekatanHideAxes = () => {
    Vt.visible = false, g();
  };
  const Xt = new tt();
  Xt.visible = false, u.add(Xt);
  let Ot = [];
  window.__hekatanShowRefPlanes = (n = [0, 3, 6, 9, 12], o = 20, a = 0, t = 0) => {
    var _a2, _b;
    for (; Xt.children.length; ) {
      const i = Xt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    Ot.forEach((i) => {
      u.remove(i), i.geometry.dispose(), i.material.dispose();
    }), Ot = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    n.forEach((i, c) => {
      const m = s[c % s.length], y = o / 2, b = [new M(a - y, t - y, i), new M(a + y, t - y, i), new M(a + y, t + y, i), new M(a - y, t + y, i), new M(a - y, t - y, i)], _ = new be().setFromPoints(b), r = new ut({ color: m, transparent: true, opacity: 0.55 });
      Xt.add(new zt(_, r));
      const h = document.createElement("canvas");
      h.width = 128, h.height = 32;
      const k = h.getContext("2d");
      k.fillStyle = `#${m.toString(16).padStart(6, "0")}`, k.font = "bold 18px sans-serif", k.fillText(`Z = ${i} m`, 4, 22);
      const A = new Ro(h), V = new Io({ map: A, transparent: true }), L = new Do(V);
      L.position.set(a - y - 1.5, t - y - 1.5, i), L.scale.set(2.5, 0.6, 1), Xt.add(L);
      const P = new jt(1e4, 1e4), Y = new st({ visible: false, side: Pt }), H = new Oe(P, Y);
      H.position.set(0, 0, i), H.frustumCulled = false, H.userData = { refPlaneZ: i }, u.add(H), Ot.push(H);
    }), Xt.visible = true, g();
  }, window.__hekatanHideRefPlanes = () => {
    Xt.visible = false, Ot.forEach((n) => {
      n.visible = false;
    }), g();
  };
  const on = new tt();
  on.frustumCulled = false, u.add(on);
  const Cn = () => {
    var _a2, _b, _c, _d;
    for (; on.children.length; ) {
      const a = on.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxLines, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const t = new be().setFromPoints([new M(a[0], a[1], a[2]), new M(a[3], a[4], a[5])]), s = new Mn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new zt(t, s);
      i.computeLineDistances(), on.add(i);
    }
  };
  q.derive(() => {
    const n = window.__hekatanDrawingAuxLines;
    (n == null ? void 0 : n.val) && (n.val, Cn(), g());
  });
  const Gt = new tt();
  Gt.frustumCulled = false, u.add(Gt);
  const wo = () => {
    var _a2, _b, _c, _d;
    for (; Gt.children.length; ) {
      const a = Gt.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxPoints, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const t = new Oe(new wn(0.025, 12, 12), new st({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      t.position.set(a[0], a[1], a[2]), t.renderOrder = 996, t.scale.setScalar(gt(t.position)), Gt.add(t);
    }
  };
  q.derive(() => {
    const n = window.__hekatanDrawingAuxPoints;
    (n == null ? void 0 : n.val) !== void 0 && (n.val, wo(), g());
  }), d.addEventListener("change", () => {
    Gt.children.forEach((n) => {
      n.scale.setScalar(gt(n.position));
    });
  }), window.__hekatanRenderAuxPoints = wo;
  const _t = new tt(), os = new Oe(new wn(0.01, 12, 12), new st({ color: 16724804, transparent: true, opacity: 0.95 })), ss = new Oe(new wn(0.015, 12, 12), new st({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  _t.add(os, ss);
  const un = 0.08, qn = (n, o, a) => {
    const t = new be().setFromPoints([new M(...n), new M(...o)]);
    return new zt(t, new ut({ color: a, transparent: true, opacity: 0.7 }));
  };
  _t.add(qn([-un, 0, 0], [un, 0, 0], 16711680)), _t.add(qn([0, -un, 0], [0, un, 0], 65280)), _t.add(qn([0, 0, -un], [0, 0, un], 35071)), _t.visible = false, _t.frustumCulled = false, u.add(_t);
  const yo = 40, as = 2.5, Kn = () => {
    if (!_t.visible) return;
    const o = f().position.distanceTo(_t.position), a = Math.max(0.05, Math.min(as, o / yo));
    _t.scale.setScalar(a);
  }, xo = () => {
    bt.children.length !== 0 && bt.children.forEach((n) => {
      if (!n.__isSelectionPt) return;
      const o = n;
      o.scale.setScalar(gt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = xo, d.addEventListener("change", () => {
    Kn(), nt.visible && Kt();
    const n = window.__hekatanOsnapMarkerRef;
    if (n == null ? void 0 : n.visible) {
      const o = f().position.distanceTo(n.position);
      n.scale.setScalar(Math.max(0.05, o / yo));
    }
    xo();
  }), window.__hekatanShowSnap = (n, o, a) => {
    _t.position.set(n, o, a), _t.visible = true, Kn(), g();
  }, window.__hekatanHideSnap = () => {
    _t.visible = false, g();
  }, x.addEventListener("pointermove", (n) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q;
    const o = v(n);
    if (!o) return;
    S.setFromCamera(C, o);
    const a = ne();
    if (a.length) {
      const t = a[0].point, s = (window.__hekatanSnap2D ?? 0.5) * 1.2, i = (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, t.x, t.y, t.z, s);
      if (i) bo(i.type, i.x, i.y, i.z), _t.position.set(i.x, i.y, i.z), _t.visible = true, t.set(i.x, i.y, i.z);
      else {
        An();
        const _ = window.__hekatanSnapEnabled !== false, r = window.__hekatanSnap2D ?? 0.5;
        _ && r > 0 && (t.x = Math.round(t.x / r) * r, t.y = Math.round(t.y / r) * r, t.z = Math.round(t.z / r) * r), _t.position.copy(t), _t.visible = true;
      }
      Kn();
      const c = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (c === "select" || !c) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, r = en(t.x, t.y, t.z, _), h = tn(t.x, t.y, t.z, _), k = nn(t.x, t.y, t.z, _);
        if (r >= 0) {
          const P = e.points.rawVal[r];
          nt.position.set(P[0], P[1], P[2]), nt.visible = true, Kt(), Xe.visible = false, lt = { kind: "pt", a: r };
        } else if (h) {
          const P = e.points.rawVal, Y = e.polylines.rawVal[h.polyIdx], H = P[Y[h.segIdx]], oe = P[Y[h.segIdx + 1]];
          Xe.geometry.setFromPoints([new M(H[0], H[1], H[2]), new M(oe[0], oe[1], oe[2])]), Xe.visible = true, nt.visible = false, lt = ((_f = (_e = e.areas) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.includes(h.polyIdx)) ?? false ? { kind: "poly", a: h.polyIdx } : { kind: "seg", a: h.polyIdx, b: h.segIdx };
        } else if (k >= 0) {
          const Y = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[k];
          Y && (Xe.geometry.setFromPoints([new M(Y[0], Y[1], Y[2]), new M(Y[3], Y[4], Y[5])]), Xe.visible = true, nt.visible = false, lt = { kind: "aux", a: k });
        } else Xe.visible = false, nt.visible = false, lt = null;
        j.style.left = n.clientX + "px", j.style.top = n.clientY + "px", j.style.display = "block";
        let A = t;
        if ((lt == null ? void 0 : lt.kind) === "pt") {
          const P = e.points.rawVal[lt.a];
          P && (A = new M(P[0], P[1], P[2]));
        }
        const V = `X=${A.x.toFixed(2)} Y=${A.y.toFixed(2)} Z=${A.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [A.x, A.y, A.z], lt) {
          const P = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          j.textContent = `${V}  \xB7  \u{1F5B1} Click \u2192 ${P[lt.kind]}`;
        } else j.textContent = V;
        const L = document.getElementById("hk-coord-fixed");
        L && (L.textContent = V), ce.visible = false, ct.visible = false, g();
        return;
      }
      if (c === "delete" || c === "trim" || c === "extend" || c === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, r = tn(t.x, t.y, t.z, _), h = nn(t.x, t.y, t.z, _);
        let k = false;
        if (h >= 0) if (!r) k = true;
        else {
          const P = window.__hekatanDrawingAuxLines, H = ((P == null ? void 0 : P.rawVal) ?? (P == null ? void 0 : P.val) ?? P ?? [])[h];
          Jt(t.x, t.y, t.z, H[0], H[1], H[2], H[3], H[4], H[5]) < r.dist && (k = true);
        }
        k ? (xt = h, Ze = -1, He = -1, Un(h)) : r ? (Ze = r.polyIdx, He = r.segIdx, xt = -1, Zn(r.polyIdx, r.segIdx)) : (Ze = -1, He = -1, xt = -1, xe.visible = false), ce.visible = false, ct.visible = false, D(), j.style.left = n.clientX + "px", j.style.top = n.clientY + "px", j.style.display = "block";
        const A = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let V = "";
        k ? V = `\u{1F5D1} l\xEDnea aux #${xt + 1}` : r ? V = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(r.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${r.polyIdx + 1}` : `\u{1F5D1} seg ${r.segIdx + 1} / poly #${r.polyIdx + 1}` : V = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", j.textContent = `${A}  \xB7  ${V}`;
        const L = document.getElementById("hk-coord-fixed");
        L && (L.textContent = A), g();
        return;
      } else xe.visible = false, Ze = -1, xt = -1;
      j.style.left = n.clientX + "px", j.style.top = n.clientY + "px", j.style.display = "block";
      const m = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], y = m[m.length - 1] ?? [], b = e.points.rawVal ?? [];
      if (y.length > 0 && b[y[y.length - 1]]) {
        const _ = y[y.length - 1], r = b[_];
        let h = at;
        if (dt = null, !h && window.__hekatanAxisSnap !== false) {
          const Se = x.getBoundingClientRect(), Ye = n.clientX, Ue = n.clientY, Je = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, ft = new M(r[0], r[1], r[2]), Dt = [["x", new M(1, 0, 0)], ["y", new M(0, 1, 0)], ["z", new M(0, 0, 1)]], ht = (rt) => {
            const je = rt.clone().project(o);
            return { x: (je.x * 0.5 + 0.5) * Se.width + Se.left, y: (-je.y * 0.5 + 0.5) * Se.height + Se.top };
          };
          let Ce = null;
          for (const [rt, je] of Dt) {
            const _e2 = ht(ft.clone().addScaledVector(je, -Je)), Ie = ht(ft.clone().addScaledVector(je, Je)), et = Ie.x - _e2.x, At = Ie.y - _e2.y, Yt = Ye - _e2.x, Bt = Ue - _e2.y, Wt = et * et + At * At || 1;
            let mn = (Yt * et + Bt * At) / Wt;
            mn = Math.max(0, Math.min(1, mn));
            const vn = Math.hypot(Ye - (_e2.x + mn * et), Ue - (_e2.y + mn * At));
            if (Ce === null || vn < Ce.dpx) {
              const to = S.ray, Ao = ft.clone().sub(to.origin), no = je.dot(to.direction), Eo = je.dot(Ao), ys = to.direction.dot(Ao), To = 1 - no * no, xs = Math.abs(To) < 1e-6 ? -Eo : (no * ys - Eo) / To;
              Ce = { axis: rt, dpx: vn, pt: ft.clone().addScaledVector(je, xs) };
            }
          }
          Ce && Ce.dpx <= 12 && (t.copy(Ce.pt), h = Ce.axis, dt = Ce.pt.clone());
        }
        const k = !!window.__hekatanOrthoMode;
        if (!h && k) {
          const Se = Math.abs(t.x - r[0]), Ye = Math.abs(t.y - r[1]), Ue = Math.abs(t.z - r[2]), Je = (_l = a[0]) == null ? void 0 : _l.object;
          let ft = null;
          Je === Ee ? ft = "xy" : Je === De ? ft = "xz" : Je === Be && (ft = "yz"), ft === "xy" ? h = Se >= Ye ? "x" : "y" : ft === "xz" ? h = Se >= Ue ? "x" : "z" : ft === "yz" ? h = Ye >= Ue ? "y" : "z" : h = Se >= Ye && Se >= Ue ? "x" : Ye >= Ue ? "y" : "z";
        }
        const A = window.__hekatanPolarTrack !== false;
        if (!h && A) {
          const Se = t.x - r[0], Ye = t.y - r[1], Ue = t.z - r[2], Je = Math.hypot(Se, Ye, Ue);
          if (Je > 1e-3) {
            const Dt = Math.tan(6 * Math.PI / 180) * Je, ht = Math.hypot(Ye, Ue), Ce = Math.hypot(Se, Ue), rt = Math.hypot(Se, Ye), je = [["x", ht], ["y", Ce], ["z", rt]];
            je.sort((_e2, Ie) => _e2[1] - Ie[1]), je[0][1] <= Dt && (h = je[0][0]);
          }
        }
        if (h) {
          const Se = r[0], Ye = r[1], Ue = r[2];
          h === "x" ? t.set(t.x, Ye, Ue) : h === "y" ? t.set(Se, t.y, Ue) : t.set(Se, Ye, t.z);
          const Je = !!at, Dt = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[h];
          it.style.background = "rgba(15,23,42,0.92)", it.style.color = Dt, it.style.border = `1.5px solid ${Dt}`;
          const ht = (_m = a[0]) == null ? void 0 : _m.object;
          let Ce = null;
          ht === Ee ? Ce = "xy" : ht === De ? Ce = "xz" : ht === Be && (Ce = "yz");
          const rt = Ce ? ` (plano ${Ce.toUpperCase()})` : "";
          it.textContent = Je ? `\u{1F512} LOCK ${h.toUpperCase()}${rt}` : `\u22A5 ORTO ${h.toUpperCase()}${rt}`, it.style.left = n.clientX + 20 + "px", it.style.top = n.clientY + 18 + "px", it.style.transform = "none", it.style.display = "block";
        } else at || (it.style.display = "none");
        const V = Math.hypot(t.x - r[0], t.y - r[1], t.z - r[2]), L = Math.atan2(t.y - r[1], t.x - r[0]) * 180 / Math.PI, P = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        j.textContent = `${P} | \u0394L=${V.toFixed(2)}m ${L.toFixed(0)}\xB0`;
        const Y = document.getElementById("hk-coord-fixed");
        Y && (Y.textContent = P), ce.geometry.setFromPoints([new M(r[0], r[1], r[2]), new M(t.x, t.y, t.z)]), (_n2 = ce.computeLineDistances) == null ? void 0 : _n2.call(ce), ce.visible = true, X(r[0], r[1], r[2], t.x, t.y, t.z);
        const H = window.__hekatanOrthoExt ?? 8, oe = window.__hekatanShowOrthoPlanes !== false;
        ke.visible = oe, oe || mt(null), oe && (Ge(ie, r, "xy", H), Ge(fe, r, "xz", H), Ge(pe, r, "yz", H), Ke(Ee, r, "xy", H), Ke(De, r, "xz", H), Ke(Be, r, "yz", H));
        const Pe = oe ? S.intersectObjects([Ee, De, Be], false) : [];
        let de = null;
        if (Pe.length > 0) {
          const Se = Pe[0].object;
          Se === Ee ? de = "xy" : Se === De ? de = "xz" : Se === Be && (de = "yz");
        }
        mt(de), de && ($e.style.left = n.clientX + "px", $e.style.top = n.clientY + "px"), F.geometry.setFromPoints([new M(r[0] - H, r[1], r[2]), new M(r[0] + H, r[1], r[2])]), (_o2 = F.computeLineDistances) == null ? void 0 : _o2.call(F), K.geometry.setFromPoints([new M(r[0], r[1] - H, r[2]), new M(r[0], r[1] + H, r[2])]), (_p = K.computeLineDistances) == null ? void 0 : _p.call(K), N.geometry.setFromPoints([new M(r[0], r[1], r[2] - H), new M(r[0], r[1], r[2] + H)]), (_q = N.computeLineDistances) == null ? void 0 : _q.call(N), ct.visible = true;
        const me = F.material, We = K.material, Te = N.material;
        h === "x" ? (me.opacity = 0.95, We.opacity = 0.1, Te.opacity = 0.1) : h === "y" ? (me.opacity = 0.1, We.opacity = 0.95, Te.opacity = 0.1) : h === "z" ? (me.opacity = 0.1, We.opacity = 0.1, Te.opacity = 0.95) : (me.opacity = 0.5, We.opacity = 0.5, Te.opacity = 0.5);
      } else {
        const _ = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        j.textContent = _;
        const r = document.getElementById("hk-coord-fixed");
        if (r && (r.textContent = _), ce.visible = false, ct.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(c)) {
          if (I = null, U = null, B.style.left = n.clientX + 20 + "px", B.style.top = n.clientY - 28 + "px", B.style.display = "block", !T) {
            B.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const k = document.activeElement;
            !(k && (k.tagName === "INPUT" || k.tagName === "TEXTAREA") && k !== B) && document.activeElement !== B && B.focus({ preventScroll: true });
            try {
              B.select();
            } catch {
            }
          }
        } else D();
      }
      g();
    } else An(), j.style.display = "none", _t.visible = false, ce.visible = false, ct.visible = false, D(), g();
  }), q.derive(() => {
    if (!e.gridTarget) return;
    ia(l, { position: new M(...e.gridTarget.val.position), quaternion: new ao().setFromEuler(new bn(...e.gridTarget.val.rotation)) }, g), Z.position.set(...e.gridTarget.val.position), Z.quaternion.setFromEuler(new bn(...e.gridTarget.val.rotation)), Z.updateMatrixWorld();
    const n = new M(0, 0, 1).applyEuler(new bn(...e.gridTarget.val.rotation));
    z = !(Math.abs(n.x) > 0.999 || Math.abs(n.y) > 0.999 || Math.abs(n.z) > 0.999);
  }), q.derive(() => {
    W.geometry.setAttribute("position", new Mt(e.points.val.flat(), 3)), W.geometry.computeBoundingSphere();
  }), q.derive(() => {
    const n = 0.05 * w * 0.5 * p.val;
    S.params.Points.threshold = 0.4 * n;
  }), q.derive(() => {
    var _a2;
    const n = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], t = [];
    for (const i of a) {
      const [c, m, y] = n[i];
      t.push(c, m, y);
    }
    const s = new be();
    s.setAttribute("position", new Mt(t, 3)), ge.geometry.dispose(), ge.geometry = s;
  });
  let Gn = false, sn = 0;
  x.addEventListener("pointerdown", () => {
    Gn = true;
  }), x.addEventListener("pointerup", () => {
    Gn = false;
  }), x.addEventListener("pointermove", () => {
    Gn && sn++;
  });
  const Ft = document.createElement("div");
  Ft.id = "hk-window-select", Ft.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Ft);
  let Nt = null, yn = false, $t = null;
  const Hn = (n, o, a, t, s) => {
    s ? (Ft.style.borderColor = "#34d399", Ft.style.borderStyle = "dashed", Ft.style.background = "rgba(52, 211, 153, 0.10)") : (Ft.style.borderColor = "#22d3ee", Ft.style.borderStyle = "solid", Ft.style.background = "rgba(34, 211, 238, 0.10)"), Ft.style.left = Math.min(n, a) + "px", Ft.style.top = Math.min(o, t) + "px", Ft.style.width = Math.abs(a - n) + "px", Ft.style.height = Math.abs(t - o) + "px", Ft.style.display = "block";
  }, go = (n, o, a, t, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(n, a), c = Math.max(n, a), m = Math.min(o, t), y = Math.max(o, t), b = a < n, _ = x.getBoundingClientRect(), r = f();
    r.updateMatrixWorld();
    const h = (de) => {
      const me = new M(de[0], de[1], de[2]);
      return me.project(r), { x: _.left + (me.x * 0.5 + 0.5) * _.width, y: _.top + (-me.y * 0.5 + 0.5) * _.height };
    }, k = (de) => de.x >= i && de.x <= c && de.y >= m && de.y <= y, A = (de, me) => !(de.x < i && me.x < i || de.x > c && me.x > c || de.y < m && me.y < m || de.y > y && me.y > y);
    s || we.clear();
    let V = 0;
    const L = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let de = 0; de < L.length; de++) {
      const me = L[de];
      me && k(h(me)) && (we.add(`pt:${de}`), V++);
    }
    const P = (de, me) => b ? k(de) || k(me) || A(de, me) : k(de) && k(me), Y = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], H = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let de = 0; de < Y.length; de++) {
      const me = Y[de];
      if (H.includes(de)) {
        let Te;
        if (!b) Te = me.every((Se) => {
          const Ye = L[Se];
          return !!Ye && k(h(Ye));
        });
        else {
          Te = false;
          for (let Se = 0; Se < me.length - 1; Se++) {
            const Ye = L[me[Se]], Ue = L[me[Se + 1]];
            if (!(!Ye || !Ue) && P(h(Ye), h(Ue))) {
              Te = true;
              break;
            }
          }
        }
        Te && (we.add(`poly:${de}`), V++);
      } else for (let Te = 0; Te < me.length - 1; Te++) {
        const Se = L[me[Te]], Ye = L[me[Te + 1]];
        !Se || !Ye || P(h(Se), h(Ye)) && (we.add(`seg:${de}:${Te}`), V++);
      }
    }
    const Pe = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let de = 0; de < Pe.length; de++) {
      const me = Pe[de];
      if (!me || me.length !== 6) continue;
      const We = h([me[0], me[1], me[2]]), Te = h([me[3], me[4], me[5]]);
      P(We, Te) && (we.add(`aux:${de}`), V++);
    }
    It(), ee(`${b ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${V} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${we.size})`), Ft.style.display = "none";
  }, zn = () => {
    $t && ($t = null, Ft.style.display = "none", ee("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = zn, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && $t && zn();
  });
  const vo = () => {
    var _a2, _b, _c, _d;
    if (we.size === 0) return false;
    const n = [...we], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], c = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Set();
    for (const A of n) {
      const [V, ...L] = A.split(":");
      if (V === "pt") c.add(+L[0]);
      else if (V === "poly") m.add(+L[0]);
      else if (V === "seg") {
        const P = +L[0], Y = +L[1];
        y.has(P) || y.set(P, /* @__PURE__ */ new Set()), y.get(P).add(Y);
      } else V === "aux" && b.add(+L[0]);
    }
    let _ = 0, r = [], h = [];
    const k = /* @__PURE__ */ new Map();
    for (let A = 0; A < a.length; A++) {
      if (m.has(A)) {
        _++;
        continue;
      }
      k.set(A, r.length);
      const V = y.get(A);
      if (V && V.size > 0) {
        let L = [];
        for (let P = 0; P < a[A].length; P++) L.push(a[A][P]), P < a[A].length - 1 && V.has(P) && (L.length >= 2 && r.push(L), L = [], _++);
        (L.length >= 2 || L.length === 1) && r.push(L);
      } else r.push([...a[A]]);
    }
    if (c.size > 0) {
      const A = [], V = /* @__PURE__ */ new Map();
      for (let P = 0; P < o.length; P++) {
        if (c.has(P)) {
          _++;
          continue;
        }
        V.set(P, A.length), A.push([...o[P]]);
      }
      const L = [];
      for (const P of r) {
        let Y = [];
        for (const H of P) {
          const oe = V.get(H);
          oe === void 0 ? (Y.length >= 2 && L.push(Y), Y = []) : Y.push(oe);
        }
        Y.length >= 2 && L.push(Y);
      }
      r = L, e.points.val = A;
    }
    for (const A of t) {
      const V = k.get(A);
      V !== void 0 && V < r.length && h.push(V);
    }
    if (e.polylines && (e.polylines.val = r), e.areas && (e.areas.val = h), b.size > 0 && s) {
      const A = i.filter((V, L) => !b.has(L));
      "val" in s ? s.val = A : window.__hekatanDrawingAuxLines = A, _ += b.size;
    }
    we.clear(), It();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ee(`\u{1F5D1} ${_} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = vo, window.addEventListener("keydown", (n) => {
    if (n.key !== "Delete" && n.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || we.size !== 0 && (n.preventDefault(), vo());
  });
  const Tt = document.createElement("div");
  Tt.id = "hk-properties-pane";
  const Mo = "hk-props-pane-pos";
  let xn = null;
  try {
    const n = localStorage.getItem(Mo);
    n && (xn = JSON.parse(n));
  } catch {
  }
  Tt.style.cssText = ["position:fixed", xn ? `left:${xn.left}px` : "left:14px", xn ? `top:${xn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Tt);
  const is = () => {
    const n = Tt.querySelector(".tp-rotv_b");
    if (!n || n.__hkDragWired) return;
    n.__hkDragWired = true, n.style.cursor = "move", n.style.userSelect = "none";
    let o = false, a = 0, t = 0, s = 0, i = 0;
    n.addEventListener("mousedown", (c) => {
      o = true, a = c.clientX, t = c.clientY;
      const m = Tt.getBoundingClientRect();
      s = m.left, i = m.top, Tt.style.transform = "none", Tt.style.left = `${s}px`, Tt.style.top = `${i}px`, c.preventDefault();
    }), window.addEventListener("mousemove", (c) => {
      if (!o) return;
      const m = c.clientX - a, y = c.clientY - t, b = Math.max(0, Math.min(window.innerWidth - 80, s + m)), _ = Math.max(0, Math.min(window.innerHeight - 40, i + y));
      Tt.style.left = `${b}px`, Tt.style.top = `${_}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Mo, JSON.stringify({ left: parseFloat(Tt.style.left), top: parseFloat(Tt.style.top) }));
        } catch {
        }
      }
    });
  }, J = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Ct = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ot = null;
  const vt = (n, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: n, ids: o, prop: a, value: t } }));
  }, ls = () => {
    if (ot && (ot.dispose(), ot = null), we.size === 0) {
      Tt.style.display = "none";
      return;
    }
    const n = [...we], o = n.filter((r) => r.startsWith("pt:")), a = n.filter((r) => r.startsWith("seg:")), t = n.filter((r) => r.startsWith("poly:")), s = n.filter((r) => r.startsWith("aux:")), i = o.length > 0, c = a.length > 0, m = t.length > 0, y = !i && !c && !m, b = [];
    o.length && b.push(`\u{1F535} ${o.length} nodo(s)`), a.length && b.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && b.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && b.push(`\u250A ${s.length} aux`);
    const _ = `\u{1F3AF} ${we.size} item(s) \u2014 ${b.join(", ")}`;
    ot = new Oo({ container: Tt, title: _ });
    {
      const r = ot.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      r.addBinding(Ct, "dx", { label: "\u0394x (m)", step: 0.1 }), r.addBinding(Ct, "dy", { label: "\u0394y (m)", step: 0.1 }), r.addBinding(Ct, "dz", { label: "\u0394z (m)", step: 0.1 }), r.addBinding(Ct, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), r.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const k = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Ct.dx, Ct.dy, Ct.dz, Ct.copias);
        ee(k ? `\u29C9 Replicado \xD7${k} (\u0394 ${Ct.dx},${Ct.dy},${Ct.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), r.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const k = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Ct.dx, Ct.dy, Ct.dz, 1);
        ee(k ? `\u2192 Copia desplazada \u0394 ${Ct.dx},${Ct.dy},${Ct.dz} m` : "\u26A0 Nada seleccionado");
      });
      const h = r.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      h.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), h.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ee(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const r = ot.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      r.addBinding(J, "Ux"), r.addBinding(J, "Uy"), r.addBinding(J, "Uz"), r.addBinding(J, "Rx"), r.addBinding(J, "Ry"), r.addBinding(J, "Rz");
      const h = ot.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      h.addBinding(J, "Kx", { label: "Kx", min: 0, step: 100 }), h.addBinding(J, "Ky", { label: "Ky", min: 0, step: 100 }), h.addBinding(J, "Kz", { label: "Kz", min: 0, step: 100 }), h.addBinding(J, "Krx", { label: "Krx", min: 0, step: 1e3 }), h.addBinding(J, "Kry", { label: "Kry", min: 0, step: 1e3 }), h.addBinding(J, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const k = ot.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      k.addBinding(J, "Fx", { step: 0.1 }), k.addBinding(J, "Fy", { step: 0.1 }), k.addBinding(J, "Fz", { step: 0.1 }), k.addBinding(J, "Mx", { step: 0.1 }), k.addBinding(J, "My", { step: 0.1 }), k.addBinding(J, "Mz", { step: 0.1 }), ot.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(J, "mass", { label: "m", min: 0, step: 1 }), ot.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(J, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ot.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let L = 0;
        const P = [J.Ux, J.Uy, J.Uz, J.Rx, J.Ry, J.Rz];
        P.some((oe) => oe) && (vt("nodes", o, "supports", P), L++);
        const Y = [J.Fx, J.Fy, J.Fz, J.Mx, J.My, J.Mz];
        Y.some((oe) => oe !== 0) && (vt("nodes", o, "loads", Y), L++);
        const H = [J.Kx, J.Ky, J.Kz, J.Krx, J.Kry, J.Krz];
        if (H.some((oe) => oe !== 0) && (vt("nodes", o, "springs", H), L++), J.mass !== 0 && (vt("nodes", o, "mass", J.mass), L++), J.diaphragm !== "Ninguno" && (vt("nodes", o, "diaphragm", J.diaphragm), L++), L === 0) {
          ee("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let oe = document.getElementById("hk-prop-toast");
          oe || (oe = document.createElement("div"), oe.id = "hk-prop-toast", oe.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(oe)), oe.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", oe.style.background = "rgba(217,119,6,0.97)", oe.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            oe && (oe.style.opacity = "0");
          }, 3200);
        } else ee(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (c) {
      const r = ot.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      r.addBinding(J, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), r.addBinding(J, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const h = ot.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      h.addBinding(J, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), h.addBinding(J, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), h.addBinding(J, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), h.addBinding(J, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ot.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(J, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ot.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(J, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const V = ot.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      V.addBinding(J, "relMxI", { label: "Mx I" }), V.addBinding(J, "relMyI", { label: "My I" }), V.addBinding(J, "relMzI", { label: "Mz I" });
      const L = ot.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      L.addBinding(J, "relMxJ", { label: "Mx J" }), L.addBinding(J, "relMyJ", { label: "My J" }), L.addBinding(J, "relMzJ", { label: "Mz J" }), ot.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(J, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const Y = ot.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      Y.addBinding(J, "LKx", { label: "LKx", min: 0, step: 100 }), Y.addBinding(J, "LKy", { label: "LKy", min: 0, step: 100 }), Y.addBinding(J, "LKz", { label: "LKz", min: 0, step: 100 });
      const H = ot.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      H.addBinding(J, "qx", { step: 0.1 }), H.addBinding(J, "qy", { step: 0.1 }), H.addBinding(J, "qz", { step: 0.1 }), ot.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(J, "massPerM", { label: "m/L", min: 0, step: 1 }), ot.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        vt("segs", a, "section", J.section), vt("segs", a, "material", J.material_frame);
        const Pe = { A: J.A_mod, Iz: J.Iz_mod, Iy: J.Iy_mod, J: J.J_mod };
        (Pe.A !== 1 || Pe.Iz !== 1 || Pe.Iy !== 1 || Pe.J !== 1) && vt("segs", a, "modifiers", Pe), J.insertionPoint !== "10 \u2014 Centroid" && vt("segs", a, "insertionPoint", J.insertionPoint), J.beta !== 0 && vt("segs", a, "beta", J.beta);
        const de = [J.relMxI, J.relMyI, J.relMzI], me = [J.relMxJ, J.relMyJ, J.relMzJ];
        (de.some((Se) => Se) || me.some((Se) => Se)) && vt("segs", a, "releases", { i: de, j: me }), J.hinges !== "None" && vt("segs", a, "hinges", J.hinges);
        const We = [J.LKx, J.LKy, J.LKz];
        We.some((Se) => Se !== 0) && vt("segs", a, "lineSprings", We);
        const Te = [J.qx, J.qy, J.qz];
        Te.some((Se) => Se !== 0) && vt("segs", a, "distLoad", Te), J.massPerM !== 0 && vt("segs", a, "massPerM", J.massPerM), ee(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (m) {
      const r = ot.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      r.addBinding(J, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), r.addBinding(J, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), r.addBinding(J, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ot.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(J, "surfLoad", { label: "q", step: 0.1 }), ot.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        vt("areas", t, "shellType", J.shellType), vt("areas", t, "thickness", J.thickness), vt("areas", t, "material", J.material_shell), J.surfLoad !== 0 && vt("areas", t, "surfLoad", J.surfLoad), ee(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (y) {
      const r = ot.addFolder({ title: "\u2139 Selecci\xF3n" }), h = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      r.addBinding(h, "msg", { readonly: true, label: "" });
    }
    ot.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      we.clear(), It();
    }), Tt.style.display = "block", is();
  };
  window.__hekatanRefreshPropsPane = ls;
  let fn = null, Fn = false;
  x.addEventListener("pointerdown", (n) => {
    n.button === 2 && (fn = { x: n.clientX, y: n.clientY }, Fn = false);
  }), x.addEventListener("pointermove", (n) => {
    if (fn && n.buttons & 2 && !Fn) {
      const o = n.clientX - fn.x, a = n.clientY - fn.y;
      Math.hypot(o, a) > 8 && (Fn = true);
    }
  }), x.addEventListener("pointerup", (n) => {
    var _a2, _b, _c;
    if (n.button === 2) {
      const o = fn !== null && !Fn;
      fn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if ($t ? zn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), we.size > 0 && (we.clear(), It()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const t = window.__hekatanCadState, s = (_b = (_a2 = t == null ? void 0 : t.get) == null ? void 0 : _a2.call(t)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = t == null ? void 0 : t.setTool) == null ? void 0 : _c.call(t, "select"), ee(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ee("\u238B Cancelado (click derecho)");
      }
    }
  }), x.addEventListener("contextmenu", (n) => {
    n.preventDefault(), n.stopPropagation();
  }, { capture: true }), x.addEventListener("pointerdown", (n) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || n.button === 0 && (window.__hekatanBloquearVentana || n.pointerType !== "touch" && (Nt = null, yn = false));
  }), x.addEventListener("pointermove", (n) => {
    if ($t && n.buttons === 0) {
      const i = n.clientX < $t.x;
      Hn($t.x, $t.y, n.clientX, n.clientY, i);
      return;
    }
    if (!Nt) return;
    const o = n.clientX - Nt.x, a = n.clientY - Nt.y, t = Math.hypot(o, a);
    if (!yn && t < 8) return;
    yn = true;
    const s = n.clientX < Nt.x;
    Hn(Nt.x, Nt.y, n.clientX, n.clientY, s);
  }), x.addEventListener("pointerup", (n) => {
    if (!Nt) return;
    if (!yn) {
      Nt = null;
      return;
    }
    const o = n.ctrlKey || n.metaKey || n.shiftKey;
    go(Nt.x, Nt.y, n.clientX, n.clientY, o), Nt = null, yn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true };
  const Ht = new tt();
  Ht.visible = false, Ht.frustumCulled = false, u.add(Ht);
  const rs = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496 }, bo = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    for (; Ht.children.length; ) {
      const m = Ht.children.pop();
      (_b = (_a2 = m.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = m.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = rs[n] ?? 16777215, i = 0.05, c = new be().setFromPoints([new M(o - i, a - i, t), new M(o + i, a - i, t), new M(o + i, a - i, t), new M(o + i, a + i, t), new M(o + i, a + i, t), new M(o - i, a + i, t), new M(o - i, a + i, t), new M(o - i, a - i, t)]);
    Ht.add(new qt(c, new ut({ color: s, linewidth: 2 }))), Ht.position.set(0, 0, 0), Ht.visible = true;
  }, An = () => {
    Ht.visible = false;
  }, cs = (n, o, a, t) => {
    var _a2;
    const s = window.__hekatanOsnap, i = e.points.rawVal, c = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let m = null;
    const y = (r, h, k, A) => {
      const V = Math.hypot(h - n, k - o, A - a);
      V > t || (!m || V < m.d) && (m = { type: r, x: h, y: k, z: A, d: V });
    };
    (s.node || s.end) && i.forEach((r) => {
      s.node && y("node", r[0], r[1], r[2]);
    });
    for (const r of c) if (!(r.length < 2)) for (let h = 0; h < r.length - 1; h++) {
      const k = i[r[h]], A = i[r[h + 1]];
      if (!(!k || !A) && (s.end && (y("end", k[0], k[1], k[2]), y("end", A[0], A[1], A[2])), s.mid && y("mid", (k[0] + A[0]) / 2, (k[1] + A[1]) / 2, (k[2] + A[2]) / 2), s.nea || s.per)) {
        const V = A[0] - k[0], L = A[1] - k[1], P = A[2] - k[2], Y = V * V + L * L + P * P;
        if (Y < 1e-12) continue;
        const H = Math.max(0, Math.min(1, ((n - k[0]) * V + (o - k[1]) * L + (a - k[2]) * P) / Y)), oe = k[0] + H * V, Pe = k[1] + H * L, de = k[2] + H * P;
        s.nea && y("nea", oe, Pe, de), s.per && y("per", oe, Pe, de);
      }
    }
    if (s.cen) for (const r of dn) {
      if (!i.some((A) => Math.abs(Math.hypot(A[0] - r.c[0], A[1] - r.c[1], A[2] - r.c[2]) - r.r) < 1e-6)) continue;
      const k = Math.hypot(n - r.c[0], o - r.c[1], a - r.c[2]);
      if (k < t || Math.abs(k - r.r) < t) {
        const A = Math.min(k, t * 0.5);
        (!m || A < m.d) && (m = { type: "cen", x: r.c[0], y: r.c[1], z: r.c[2], d: A });
      }
    }
    if (s.int) {
      const r = [];
      for (const h of c) for (let k = 0; k < h.length - 1; k++) {
        const A = i[h[k]], V = i[h[k + 1]];
        if (!A || !V) continue;
        const L = V[0] - A[0], P = V[1] - A[1], Y = V[2] - A[2], H = L * L + P * P + Y * Y;
        if (H < 1e-12) continue;
        const oe = Math.max(0, Math.min(1, ((n - A[0]) * L + (o - A[1]) * P + (a - A[2]) * Y) / H));
        Math.hypot(A[0] + oe * L - n, A[1] + oe * P - o, A[2] + oe * Y - a) < 3 * t && r.push([A, V]);
      }
      for (let h = 0; h < r.length; h++) for (let k = h + 1; k < r.length; k++) {
        const [A, V] = r[h], [L, P] = r[k], Y = [V[0] - A[0], V[1] - A[1], V[2] - A[2]], H = [P[0] - L[0], P[1] - L[1], P[2] - L[2]], oe = [A[0] - L[0], A[1] - L[1], A[2] - L[2]], Pe = Y[0] * Y[0] + Y[1] * Y[1] + Y[2] * Y[2], de = Y[0] * H[0] + Y[1] * H[1] + Y[2] * H[2], me = H[0] * H[0] + H[1] * H[1] + H[2] * H[2], We = Y[0] * oe[0] + Y[1] * oe[1] + Y[2] * oe[2], Te = H[0] * oe[0] + H[1] * oe[1] + H[2] * oe[2], Se = Pe * me - de * de;
        if (Se < 1e-12) continue;
        const Ye = (de * Te - me * We) / Se, Ue = (Pe * Te - de * We) / Se;
        if (Ye < -1e-6 || Ye > 1 + 1e-6 || Ue < -1e-6 || Ue > 1 + 1e-6) continue;
        const Je = [A[0] + Ye * Y[0], A[1] + Ye * Y[1], A[2] + Ye * Y[2]], ft = [L[0] + Ue * H[0], L[1] + Ue * H[1], L[2] + Ue * H[2]];
        if (Math.hypot(Je[0] - ft[0], Je[1] - ft[1], Je[2] - ft[2]) > 1e-4) continue;
        [A, V, L, P].some((ht) => Math.hypot(ht[0] - Je[0], ht[1] - Je[1], ht[2] - Je[2]) < 1e-6) || y("int", Je[0], Je[1], Je[2]);
      }
    }
    const b = window.__hekatanDrawingAuxLines, _ = (b == null ? void 0 : b.rawVal) ?? (b == null ? void 0 : b.val) ?? b ?? [];
    for (const r of _) {
      if (r.length !== 6) continue;
      const h = [r[0], r[1], r[2]], k = [r[3], r[4], r[5]];
      if (s.end && (y("end", h[0], h[1], h[2]), y("end", k[0], k[1], k[2])), s.mid && y("mid", (h[0] + k[0]) / 2, (h[1] + k[1]) / 2, (h[2] + k[2]) / 2), s.nea || s.per) {
        const A = k[0] - h[0], V = k[1] - h[1], L = k[2] - h[2], P = A * A + V * V + L * L;
        if (P < 1e-12) continue;
        const Y = Math.max(0, Math.min(1, ((n - h[0]) * A + (o - h[1]) * V + (a - h[2]) * L) / P)), H = h[0] + Y * A, oe = h[1] + Y * V, Pe = h[2] + Y * L;
        s.nea && y("nea", H, oe, Pe), s.per && y("per", H, oe, Pe);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
  };
  window.__hekatanOsnapCompute = cs, window.__hekatanOsnapShow = bo, window.__hekatanOsnapHide = An;
  let Ae = [], wt = 0, an = 0, St = null;
  const gn = document.createElement("div");
  gn.id = "hk-cad-status", gn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", gn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(gn);
  const ds = () => {
    var _a2, _b, _c;
    const n = [];
    window.__hekatanOrthoMode && n.push("\u22A5 ORTO ON (F8)"), at && n.push(`\u{1F512} LOCK ${at.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && n.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && n.push("\u25A6 Planos XY/XZ/YZ"), n.length > 0 ? `   |   ${n.join("  \xB7  ")}` : "";
  }, ee = (n) => {
    var _a2;
    const o = n + ds();
    gn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, n);
    } catch {
    }
  }, ps = "Comando:", us = () => {
    var _a2, _b, _c, _d;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], t = Ae.length, s = (i, c = []) => ({ txt: i, ops: c });
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${ue.length + 1} (Enter o clic derecho cierra y malla):`);
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
        return s(St ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${an > 0 ? ` (distancia ${an} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return we.size ? s(t ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return we.size ? s(t ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return we.size ? s(`SELECCI\xD3N ${we.size} objeto${we.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(ps);
    }
  }, Lt = () => {
    var _a2;
    try {
      const n = us();
      (_a2 = window.__hekatanCadPrompt) == null ? void 0 : _a2.call(window, n.txt, n.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Lt, window.__hekatanRefreshStatus = () => {
    const n = window.__hekatanCadStatusText ?? "", o = n.split("   |   ")[0] ?? n;
    ee(o);
  }, window.__hekatanCadResetPending = () => {
    Ae = [], ue = [], G.visible = false, Wn(), St = null, g(), ee("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Lt();
  };
  function Wn() {
    if (!e.polylines) return;
    const n = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...n, []];
  }
  window.__hekatanCerrarPolilinea = Wn;
  const hn = [], En = [], Jn = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, _o = (n) => {
    var _a2;
    e.points.val = n.p, e.polylines && (e.polylines.val = n.l), e.areas && (e.areas.val = n.a), Ae = [], ce.visible = false, ct.visible = false, D();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    g(), Lt();
  }, Rt = () => {
    hn.push(Jn()), hn.length > 100 && hn.shift(), En.length = 0;
  }, Tn = () => {
    const n = hn.pop();
    if (!n) {
      ee("\u21B6 Nada para deshacer");
      return;
    }
    En.push(Jn()), _o(n), ee(`\u21B6 Deshacer \u2014 quedan ${hn.length}`);
  }, So = () => {
    const n = En.pop();
    if (!n) {
      ee("\u21B7 Nada para rehacer");
      return;
    }
    hn.push(Jn()), _o(n), ee(`\u21B7 Rehacer \u2014 quedan ${En.length}`);
  };
  window.__hekatanPushUndo = Rt, window.__hekatanUndo = Tn, window.__hekatanRedo = So, document.addEventListener("keydown", (n) => {
    var _a2;
    const o = n.key.toLowerCase();
    if (!((n.ctrlKey || n.metaKey) && (o === "y" || o === "z" && n.shiftKey))) return;
    const t = n.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a2 = t.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (n.preventDefault(), n.stopPropagation(), So());
  }, { capture: true }), window.__hekatanCadOption = (n) => {
    var _a2, _b, _c, _d, _e;
    const o = n.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Tn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ee("Cerrar necesita al menos tres puntos."), true;
      Rt(), e.polylines.val = [...t.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return On(), ee(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Tn(), true;
      Rt();
      const i = s[s.length - 1], c = s.slice(0, -1), m = t.some((_, r) => r !== t.length - 1 && _.includes(i)) || c.includes(i);
      let y = e.points.rawVal, b = [...t.slice(0, -1), c];
      if (!m && i === y.length - 1 && (y = y.slice(0, -1), e.points.val = y), e.polylines.val = b, c.length) {
        const _ = y[c[c.length - 1]];
        _ && (I = [_[0], _[1], _[2]]);
      } else I = null, ce.visible = false;
      try {
        (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
      } catch {
      }
      return g(), ee(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${c.length}.`), Lt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (n) => {
    var _a2;
    if ((n.ctrlKey || n.metaKey) && n.key.toLowerCase() === "z" && !n.shiftKey) {
      const o = n.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      n.preventDefault(), n.stopPropagation(), Tn();
    }
  }, { capture: true });
  const On = () => {
    Ae = [], St = null, Wn(), at = null, Zt(), ce.visible = false, ct.visible = false, D(), ee("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), g(), Lt();
  };
  window.__hekatanFinalizeDraw = On;
  const ko = () => {
    var _a2, _b, _c;
    Ae = [], ue = [], G.visible = false;
    let n = false;
    we.size && (we.clear(), It(), n = true), On();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ee(n ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), g(), Lt();
  };
  window.__hekatanEscapeCancel = ko;
  const Po = () => {
    var _a2;
    const n = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return we.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (n[+a.slice(5)] || []).forEach((t) => o.add(t));
      else if (a.startsWith("seg:")) {
        const t = a.split(":"), s = n[+t[1]] || [], i = s[+t[2]], c = s[+t[2] + 1];
        i != null && o.add(i), c != null && o.add(c);
      }
    }), o;
  }, Co = (n, o, a) => {
    var _a2;
    const t = Po();
    if (!t.size) return 0;
    Rt();
    const s = e.points.rawVal.map((i, c) => t.has(c) ? [i[0] + n, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return It(), g(), t.size;
  };
  window.__hekatanMoveSelection = Co;
  const zo = (n, o) => {
    var _a2, _b, _c, _d, _e;
    if (!we.size) {
      ee(`${n === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Lt();
      return;
    }
    if (Ae.push(o), Ae.length === 1) {
      I = o, ee(`${n === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Lt();
      return;
    }
    const [a, t] = Ae, s = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    Ae = [], ce.visible = false;
    let i = 0;
    n === "move" ? i = Co(s[0], s[1], s[2]) : (i = Po().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ee(`\u2713 ${n === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), n === "move" && (we.clear(), It()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Lt();
  };
  window.__hekatanPasoMoverCopiar = zo;
  const fs = () => {
    var _a2, _b, _c;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return n === "xz" ? [0, 1, 0] : n === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Qt = (n, o) => Math.hypot(n[0] - o[0], n[1] - o[1], n[2] - o[2]), Qn = (n, o, a, t, s, i) => {
    const c = [o[0] - n[0], o[1] - n[1], o[2] - n[2]], m = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], y = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], b = c[0] * c[0] + c[1] * c[1] + c[2] * c[2], _ = c[0] * m[0] + c[1] * m[1] + c[2] * m[2], r = m[0] * m[0] + m[1] * m[1] + m[2] * m[2], h = c[0] * y[0] + c[1] * y[1] + c[2] * y[2], k = m[0] * y[0] + m[1] * y[1] + m[2] * y[2], A = b * r - _ * _;
    if (A < 1e-12) return null;
    const V = (_ * k - r * h) / A, L = (b * k - _ * h) / A;
    if (!s && (V < -1e-6 || V > 1 + 1e-6) || !i && (L < -1e-6 || L > 1 + 1e-6)) return null;
    const P = [n[0] + V * c[0], n[1] + V * c[1], n[2] + V * c[2]], Y = [a[0] + L * m[0], a[1] + L * m[1], a[2] + L * m[2]];
    return Qt(P, Y) > 1e-4 ? null : P;
  }, hs = (n) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((t) => t === n).length, 0);
  }, ms = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, ws = (n, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, t = e.points.rawVal, s = ms[n];
    if (!St) {
      if (Ze < 0) {
        ee(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      St = { poly: Ze, seg: Math.max(0, He) }, ee(n === "offset" ? `DESFASE l\xEDnea #${St.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${an > 0 ? ` (${an} m)` : ""}.` : n === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Lt();
      return;
    }
    if (n === "offset") {
      const V = St.poly, L = a[V];
      if (!L || L.length < 2) {
        St = null, ee("DESFASE: esa polil\xEDnea no tiene tramos."), Lt();
        return;
      }
      const P = L.length > 2 && L[0] === L[L.length - 1], Y = fs(), H = [];
      for (let Ce = 0; Ce < L.length - 1; Ce++) {
        const rt = t[L[Ce]], je = t[L[Ce + 1]], _e = [je[0] - rt[0], je[1] - rt[1], je[2] - rt[2]], Ie = Math.hypot(_e[0], _e[1], _e[2]) || 1, et = _e[0] / Ie, At = _e[1] / Ie, Yt = _e[2] / Ie, Bt = [Y[1] * Yt - Y[2] * At, Y[2] * et - Y[0] * Yt, Y[0] * At - Y[1] * et], Wt = Math.hypot(Bt[0], Bt[1], Bt[2]) || 1;
        H.push({ a: rt, b: je, n: [Bt[0] / Wt, Bt[1] / Wt, Bt[2] / Wt] });
      }
      let oe = 0, Pe = 1 / 0;
      H.forEach((Ce, rt) => {
        const je = Jt(o[0], o[1], o[2], Ce.a[0], Ce.a[1], Ce.a[2], Ce.b[0], Ce.b[1], Ce.b[2]);
        je < Pe && (Pe = je, oe = rt);
      });
      const de = H[oe], me = Math.sign((o[0] - de.a[0]) * de.n[0] + (o[1] - de.a[1]) * de.n[1] + (o[2] - de.a[2]) * de.n[2]) || 1, We = an > 0 ? an : Pe;
      if (We < 1e-6) {
        ee("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const Te = H.map((Ce) => ({ a: [Ce.a[0] + me * We * Ce.n[0], Ce.a[1] + me * We * Ce.n[1], Ce.a[2] + me * We * Ce.n[2]], b: [Ce.b[0] + me * We * Ce.n[0], Ce.b[1] + me * We * Ce.n[1], Ce.b[2] + me * We * Ce.n[2]] })), Se = Te.length, Ye = (Ce) => {
        const rt = Te[(Ce - 1 + Se) % Se], je = Te[Ce % Se];
        return Qn(rt.a, rt.b, je.a, je.b, true, true) ?? je.a;
      }, Ue = [], Je = P ? Se : Se + 1;
      for (let Ce = 0; Ce < Je; Ce++) !P && Ce === 0 ? Ue.push(Te[0].a) : !P && Ce === Se ? Ue.push(Te[Se - 1].b) : Ue.push(Ye(Ce));
      Rt();
      const ft = t.length;
      e.points.val = [...t, ...Ue];
      const Dt = Ue.map((Ce, rt) => ft + rt);
      P && Dt.push(ft);
      let ht = a.slice();
      ht.length && ht[ht.length - 1].length === 0 && (ht = ht.slice(0, -1)), e.polylines.val = [...ht, Dt, []], St = null, ee(`\u2713 Desfase a ${We.toFixed(2)} m \u2014 ${Se} tramo${Se === 1 ? "" : "s"} nuevo${Se === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      g(), Lt();
      return;
    }
    let i = Ze, c = Math.max(0, He);
    if (i < 0 || i === St.poly && c === St.seg) {
      let L = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((P, Y) => {
        for (let H = 0; H < P.length - 1; H++) {
          if (Y === St.poly && H === St.seg) continue;
          const oe = t[P[H]], Pe = t[P[H + 1]];
          if (!oe || !Pe) continue;
          const de = Jt(o[0], o[1], o[2], oe[0], oe[1], oe[2], Pe[0], Pe[1], Pe[2]);
          de < L && (L = de, i = Y, c = H);
        }
      }), i < 0) {
        ee(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const m = a[St.poly], y = t[m[St.seg]], b = t[m[St.seg + 1]], _ = a[i], r = _[c], h = _[c + 1];
    if (!y || !b || r == null || h == null) {
      ee(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const k = t[r], A = t[h];
    if (n === "trim") {
      const V = Qn(k, A, y, b, false, false);
      if (!V) {
        ee("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Rt();
      const L = t.length;
      e.points.val = [...t, V];
      const P = [..._.slice(0, c + 1), L, ..._.slice(c + 1)];
      e.polylines.val = a.map((H, oe) => oe === i ? P : H);
      const Y = Qt(o, k) < Qt(o, A);
      Pn(i, Y ? c : c + 1), ee(`\u2713 Recortado en (${V[0].toFixed(2)}, ${V[1].toFixed(2)}, ${V[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const V = Qn(k, A, y, b, true, false);
      if (!V) {
        ee("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const P = Qt(o, k) < Qt(o, A) ? c : c + 1;
      if (P !== 0 && P !== _.length - 1) {
        ee("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const Y = _[P];
      if (Qt(V, k) + Qt(V, A) < Qt(k, A) + 1e-6) {
        ee("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Rt(), hs(Y) > 1) {
        const oe = t.length;
        e.points.val = [...t, V];
        const Pe = _.slice();
        Pe[P] = oe, e.polylines.val = a.map((de, me) => me === i ? Pe : de);
      } else e.points.val = t.map((oe, Pe) => Pe === Y ? V : oe);
      ee(`\u2713 Alargada hasta (${V[0].toFixed(2)}, ${V[1].toFixed(2)}, ${V[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    g(), Lt();
  };
  window.__hekatanReplicateSelection = (n, o, a, t) => {
    var _a2, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1));
    const s = [...we], i = e.points.rawVal, c = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), y = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), _ = [];
    if (s.forEach((V) => {
      if (V.startsWith("pt:")) y.add(+V.slice(3));
      else if (V.startsWith("poly:")) {
        const L = +V.slice(5);
        b.add(L), (c[L] || []).forEach((P) => y.add(P));
      } else if (V.startsWith("seg:")) {
        const L = V.split(":"), P = +L[1], Y = +L[2], H = c[P] || [], oe = H[Y], Pe = H[Y + 1];
        oe != null && Pe != null && (_.push([oe, Pe]), y.add(oe), y.add(Pe));
      }
    }), !y.size) return 0;
    Rt();
    const r = [...i];
    let h = c.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const k = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], A = [...y];
    for (let V = 1; V <= t; V++) {
      const L = n * V, P = o * V, Y = a * V, H = /* @__PURE__ */ new Map();
      A.forEach((oe) => {
        H.set(oe, r.length), r.push([i[oe][0] + L, i[oe][1] + P, i[oe][2] + Y]);
      }), b.forEach((oe) => {
        const Pe = c[oe].map((me) => H.has(me) ? H.get(me) : me), de = h.length;
        h.push(Pe), m.has(oe) && k.push(de);
      }), _.forEach(([oe, Pe]) => {
        h.push([H.get(oe), H.get(Pe)]);
      });
    }
    h.push([]), e.points.val = r, e.polylines && (e.polylines.val = h), e.areas && (e.areas.val = k);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return g(), t;
  }, x.addEventListener("click", (n) => {
    var _a2, _b;
    if (sn > 5) {
      sn = 0;
      return;
    }
    sn = 0;
    const o = v(n);
    if (!o) return;
    S.setFromCamera(C, o);
    const a = ne();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(d.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), c = a[0].point;
      if (!isFinite(c.x) || !isFinite(c.y) || !isFinite(c.z) || i > Math.max(s * 12, 300)) {
        ee("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let t = a[0].point;
    (n.ctrlKey || n.metaKey) && (t = new M(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = s[s.length - 1] ?? [], c = e.points.rawVal ?? [];
      if (i.length > 0) {
        const m = c[i[i.length - 1]];
        if (m) {
          const y = !!window.__hekatanOrthoMode;
          let b = at;
          if (!b && y) {
            const _ = Math.abs(t.x - m[0]), r = Math.abs(t.y - m[1]), h = Math.abs(t.z - m[2]);
            b = _ >= r && _ >= h ? "x" : r >= h ? "y" : "z";
          }
          b === "x" ? t = new M(t.x, m[1], m[2]) : b === "y" ? t = new M(m[0], t.y, m[2]) : b === "z" && (t = new M(m[0], m[1], t.z));
        }
      }
    }
    if (dt) t = dt.clone(), ee(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else {
      const s = (window.__hekatanSnap2D ?? 0.5) * 1.2, i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s);
      if (i) t = new M(i.x, i.y, i.z), ee(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      else {
        const c = window.__hekatanSnapEnabled !== false, m = window.__hekatanSnap2D ?? 0;
        c && m > 0 && (t = new M(Math.round(t.x / m) * m, Math.round(t.y / m) * m, Math.round(t.z / m) * m));
      }
    }
    Fo(t, n);
  });
  const Fo = (n, o) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (lt) {
        $t && zn();
        const { kind: t, a: s, b: i } = lt, c = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || we.clear(), we.has(c) ? we.delete(c) : we.add(c), It(), ee(`\u2713 Seleccionados ${we.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const t = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        $t ? (go($t.x, $t.y, s, i, t), $t = null) : t || ($t = { x: s, y: i }, ee("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Hn(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const t = window.__hekatanAxisDraw;
      if (!t) return;
      if (!t.pendingStart) {
        t.pendingStart = [n.x, n.y, n.z], ee(`\u{1F4CD} Eje \u2014 click 1 OK en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = t.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, t.pendingStart, [n.x, n.y, n.z], s);
      ee(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      zo(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "delete") {
      if (xt >= 0) {
        const t = window.__hekatanDrawingAuxLines, s = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [], i = xt;
        if (i >= 0 && i < s.length) {
          Rt();
          const c = s.slice(0, i).concat(s.slice(i + 1));
          t && typeof t == "object" && "val" in t ? t.val = c : window.__hekatanDrawingAuxLines = c, ee(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), xt = -1, xe.visible = false;
          try {
            (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
          } catch {
          }
        }
      } else if (Ze >= 0) {
        const t = Ze, s = He;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(t)) ?? false ? (cn(t), ee(`\u{1F5D1} \xC1rea #${t + 1} (shell Q4) borrada`)) : s >= 0 ? (Pn(t, s), ee(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${t + 1} borrado`)) : (cn(t), ee(`\u{1F5D1} Polil\xEDnea #${t + 1} borrada`));
      } else ee("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length === 1) {
        ee("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [t, s] = Ae, i = Math.hypot(s[0] - t[0], s[1] - t[1], s[2] - t[2]);
      Math.abs(s[0] - t[0]);
      const c = Math.abs(s[1] - t[1]), y = Math.abs(s[2] - t[2]) < 1e-3 ? "xy" : c < 1e-3 ? "xz" : "yz", b = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, t[0], t[1], t[2], i, b, y), ee(`\u2713 C\xEDrculo dibujado en ${y.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${b} segmentos`), Ae = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length === 1) {
        ee("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ae.length === 2) {
        ee("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [t, s, i] = Ae, c = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, t, s, i, c), ee(`\u2713 Arco dibujado \u2014 ${c} segmentos`), Ae = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length === 1) {
        ee("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Ae;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, t, s), ee(`\u2713 Rect\xE1ngulo dibujado \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ae = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length === 1) {
        ee("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Ae;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, t, s), ee(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ae = [];
      return;
    }
    if (a === "polyarea") {
      ue.push([n.x, n.y, n.z]), G.geometry.setFromPoints(ue.map((t) => new M(t[0], t[1], t[2]))), G.visible = ue.length >= 1, ee(`\u25B0 \xC1rea libre \u2014 ${ue.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), g();
      return;
    }
    if (a === "plane3") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length < 3) {
        ee(`\u25E3 Plano inclinado \u2014 punto ${Ae.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [t, s, i] = Ae, c = (_o2 = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o2.call(window, t, s, i);
      ee(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ae = [];
      return;
    }
    if (a === "col") {
      Rt();
      const t = n.z, s = wt && wt > 0 ? wt : 3;
      e.points.val = [...e.points.rawVal, [n.x, n.y, t], [n.x, n.y, t + s]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], wt = 0, ee(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length === 1) {
        ee("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [t, s] = Ae, i = wt && wt > 0 ? wt : 3;
      Rt();
      const c = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [t[0], t[1], t[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [t[0], t[1], t[2] + i]];
      const m = e.polylines.rawVal;
      if (m.length - 1, e.polylines.val = [...m.slice(0, -1), ...m[m.length - 1].length > 0 ? [m[m.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], e.areas) {
        const y = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, y];
      }
      ee(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ae = [], wt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Rt();
      const t = wt && wt > 0 ? wt : 3, s = n.z;
      e.points.val = [...e.points.rawVal, [n.x, n.y, s], [n.x, n.y, s + t]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], wt = 0, ee(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${t.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const t = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = tn(n.x, n.y, n.z, t);
      if (!s) {
        ee("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, c = e.points.rawVal, m = i[s.polyIdx], y = c[m[s.segIdx]], b = c[m[s.segIdx + 1]];
      if (!y || !b) {
        ee("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const _ = wt && wt > 0 ? wt : 3;
      Rt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [y[0], y[1], y[2]], [b[0], b[1], b[2]], [b[0], b[1], b[2] + _], [y[0], y[1], y[2] + _]];
      const h = e.polylines.rawVal;
      if (e.polylines.val = [...h.slice(0, -1), ...h[h.length - 1].length > 0 ? [h[h.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const k = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, k];
      }
      wt = 0, ee(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${_.toFixed(2)}m`);
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
      ee(`\u2726 Punto auxiliar agregado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length === 1) {
        ee("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [t, s] = Ae, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const _ = i.rawVal ?? i.val ?? [];
        i.val = [..._, [t[0], t[1], t[2], s[0], s[1], s[2]]];
      }
      const c = s[0] - t[0], m = s[1] - t[1], y = s[2] - t[2], b = Math.sqrt(c * c + m * m + y * y);
      ee(`\u2713 L\xEDnea auxiliar creada \u2014 L=${b.toFixed(2)}m (cyan, no FEM)`), Ae = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      ws(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "chaflan") {
      if (Ae.push([n.x, n.y, n.z]), Ae.length === 1) {
        ee("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Ae, i = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, t, s, i, c, 6);
      const m = Math.abs(s[0] - t[0]).toFixed(1), y = Math.abs(s[1] - t[1]).toFixed(1);
      ee(`\u2713 Losa con chaflanes dibujada \u2014 ${m}\xD7${y}m, r=${i}m, ${c} seg/chafl\xE1n`), Ae = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (T = false, Rt(), e.points.val = [...e.points.rawVal, n.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const t = e.polylines.rawVal, s = t.length - 1, i = t[s] ?? [];
      if (a === "line" && i.length >= 2) {
        ee(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...t.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), ee("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") ee(`\u25CF Nodo creado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else if (a === "line") ee("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") ee("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const t = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ee(`\u25A6 \xC1rea \u2014 click ${t.length}/4. Marc\xE1 ${4 - t.length} v\xE9rtice${4 - t.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  x.addEventListener("click", () => Lt()), x.addEventListener("contextmenu", (n) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && ue.length >= 3) {
      n.preventDefault();
      const a = pn();
      ee(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), x.addEventListener("pointermove", (n) => {
    var _a2, _b;
    const o = v(n);
    if (!o) return;
    S.setFromCamera(C, o);
    const a = ne();
    if (ve.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const c = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = c[c.length - 1] ?? [], y = e.points.rawVal ?? [];
        if (m.length > 0) {
          const b = y[m[m.length - 1]];
          if (b) {
            const _ = !!window.__hekatanOrthoMode;
            let r = at;
            if (!r && _) {
              const h = Math.abs(t.x - b[0]), k = Math.abs(t.y - b[1]), A = Math.abs(t.z - b[2]);
              r = h >= k && h >= A ? "x" : k >= A ? "y" : "z";
            }
            r === "x" ? t.set(t.x, b[1], b[2]) : r === "y" ? t.set(b[0], t.y, b[2]) : r === "z" && t.set(b[0], b[1], t.z);
          }
        }
      }
      const s = (window.__hekatanSnap2D ?? 0.5) * 1.2, i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s);
      if (i) t.set(i.x, i.y, i.z);
      else {
        const c = window.__hekatanSnapEnabled !== false, m = window.__hekatanSnap2D ?? 0.5;
        c && m > 0 && (t.x = Math.round(t.x / m) * m, t.y = Math.round(t.y / m) * m, t.z = Math.round(t.z / m) * m);
      }
      ve.geometry.setAttribute("position", new Mt(t.toArray(), 3));
    }
    g();
  }), x.addEventListener("pointermove", (n) => {
    var _a2;
    const o = v(n);
    if (!o) return;
    S.setFromCamera(C, o);
    let a = false;
    const t = S.intersectObject(W), s = ne();
    if (t.length && s.length) {
      const i = new M(...e.points.rawVal[t[0].index]), c = new M(...s[0].point), m = i.sub(c), y = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      y.transformDirection(Z.matrixWorld), Math.abs(m.dot(y)) < 1e-4 && (a = true);
    }
    ve.visible = !a;
  });
  let jn = false, eo;
  x.addEventListener("pointermove", (n) => {
    var _a2;
    if (!sn) return;
    const o = v(n);
    if (!o) return;
    S.setFromCamera(C, o);
    let a = false;
    const t = S.intersectObject(W), s = ne();
    if (t.length && s.length) {
      const c = new M(...e.points.rawVal[t[0].index]), m = new M(...s[0].point), y = c.sub(m), b = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      b.transformDirection(Z.matrixWorld), Math.abs(y.dot(b)) < 1e-4 && (a = true);
    }
    if (a && sn < 5 && (jn = true, d.enabled = false, eo = t[0].index), !jn || sn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (eo !== void 0) {
      let c = s[0].point;
      (n.ctrlKey || n.metaKey) && (c = new M(Math.round(c.x), Math.round(c.y), Math.round(c.z))), i[eo] = c.toArray();
    }
    e.points.val = i;
  }), x.addEventListener("pointerup", () => {
    d.enabled = true, jn = false;
  }), x.addEventListener("contextmenu", (n) => {
    var _a2;
    const o = v(n);
    if (!o) return;
    S.setFromCamera(C, o);
    let a = false;
    const t = S.intersectObject(W), s = ne();
    if (t.length && s.length) {
      const m = new M(...e.points.rawVal[t[0].index]), y = new M(...s[0].point), b = m.sub(y), _ = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      _.transformDirection(Z.matrixWorld), Math.abs(b.dot(_)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(t[0].index, 1), e.points.val = i, !e.polylines) return;
    const c = e.polylines.rawVal.map((m) => m.filter((y) => y !== t[0].index)).map((m) => m.map((y) => y > t[0].index ? y - 1 : y)).filter((m) => m.length);
    c.push([]), e.polylines.val = c;
  });
}
function ia(e, l, u) {
  const w = Math.round(14.999999999999998), p = { position: e.position.clone(), quaternion: e.quaternion.clone() }, x = setInterval(S, 1e3 / 30);
  let g = 0;
  function S() {
    g++;
    const C = g / w;
    e.position.lerpVectors(p.position, l.position, C), e.quaternion.slerpQuaternions(p.quaternion, l.quaternion, C), u && u(), g == w && clearInterval(x);
  }
}
function la(e, l, u, f) {
  const d = Ds(u, e.elements, f);
  return q.derive(() => {
    d.visible = l.shellResults.val != "none";
  }), d;
}
const ra = 6, co = 10, ca = 0.012;
function da(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function pa(e, l, u, f) {
  if (!u && !f) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && u) {
    const w = u[e];
    if (w && w.has(l)) return w.get(l);
  }
  return null;
}
function ua(e, l, u, f) {
  const d = new tt(), w = new Qo();
  w.setColorMap("rainbow");
  const p = new Ut(), x = q.state([]);
  return q.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const g = u.val, S = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], C = da(l.frameResults.val);
    if (d.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), d.clear(), !C || S.length === 0 || g.length === 0) {
      x.val = [];
      return;
    }
    const v = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, Z = (_c = e.deformOutputs) == null ? void 0 : _c.val, ye = [], le = [];
    for (let $ = 0; $ < S.length; $++) {
      if (S[$].length !== 2) continue;
      const re = pa(C, $, v, Z);
      re && (ye.push(re[0], re[1]), le.push({ idx: $, vals: re }));
    }
    if (ye.length === 0) {
      x.val = [];
      return;
    }
    const te = Math.min(...ye), z = Math.max(...ye);
    w.setMin(te), w.setMax(z), x.val = ye;
    const ne = [1 / 0, 1 / 0, 1 / 0], W = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of g) for (let Q = 0; Q < 3; Q++) ne[Q] = Math.min(ne[Q], $[Q]), W[Q] = Math.max(W[Q], $[Q]);
    const ge = Math.max(W[0] - ne[0], W[1] - ne[1], W[2] - ne[2], 1) * ca, B = [], I = [], U = [];
    let T = 0;
    for (const { idx: $, vals: Q } of le) {
      const re = S[$], se = g[re[0]], j = g[re[1]];
      if (!se || !j) continue;
      const R = new M(j[0] - se[0], j[1] - se[1], j[2] - se[2]), ce = R.length();
      if (ce < 1e-10) continue;
      R.normalize();
      const G = Math.abs(R.y) < 0.99 ? new M(0, 1, 0) : new M(1, 0, 0), ue = new M().crossVectors(R, G).normalize(), he = new M().crossVectors(R, ue).normalize(), Ve = co + 1, Me = ra;
      for (let Le = 0; Le < Ve; Le++) {
        const Qe = Le / co, ct = se[0] + R.x * ce * Qe, ae = se[1] + R.y * ce * Qe, F = se[2] + R.z * ce * Qe, K = Q[0] + (Q[1] - Q[0]) * Qe, N = w.getColor(K) ?? new Ut(0, 0, 0);
        p.copy(N).convertSRGBToLinear();
        for (let O = 0; O < Me; O++) {
          const ie = O / Me * Math.PI * 2, fe = Math.cos(ie), pe = Math.sin(ie);
          B.push(ct + (ue.x * fe + he.x * pe) * ge, ae + (ue.y * fe + he.y * pe) * ge, F + (ue.z * fe + he.z * pe) * ge), I.push(p.r, p.g, p.b);
        }
      }
      for (let Le = 0; Le < co; Le++) for (let Qe = 0; Qe < Me; Qe++) {
        const ct = (Qe + 1) % Me, ae = T + Le * Me + Qe, F = T + Le * Me + ct, K = T + (Le + 1) * Me + Qe, N = T + (Le + 1) * Me + ct;
        U.push(ae, F, N), U.push(ae, N, K);
      }
      T += Ve * Me;
    }
    if (B.length === 0) return;
    const E = new be();
    E.setAttribute("position", new Mt(B, 3)), E.setAttribute("color", new Mt(I, 3)), E.setIndex(U), E.computeVertexNormals();
    const X = new st({ vertexColors: true, side: Pt }), D = new Oe(E, X);
    D.frustumCulled = false, d.add(D);
  }), d.__colorMapValues = x, d;
}
function fa() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const ha = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, ma = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, wa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function yt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const ya = 16755200, Zo = 56831, xa = 56831, ga = 56831, Rn = 65382;
function va(e) {
  const l = new tt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const u = new wn(1, 16, 16), f = new st({ color: ya, transparent: true, opacity: 0.85, depthTest: false }), d = new Oe(u, f);
  d.visible = false, d.renderOrder = 100, l.add(d);
  const w = new be(), p = new ut({ color: Zo, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), x = new qt(w, p);
  x.visible = false, x.renderOrder = 100, l.add(x);
  const g = new st({ color: Zo, transparent: true, opacity: 0.7, depthTest: false }), S = new Oe(new Bo(1, 1, 1, 12), g);
  S.visible = false, S.renderOrder = 100, l.add(S);
  const C = new be(), v = new st({ color: xa, transparent: true, opacity: 0.45, side: Pt, depthTest: false }), Z = new Oe(C, v);
  Z.visible = false, Z.renderOrder = 100, l.add(Z);
  const ye = new be(), le = new ut({ color: ga, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), te = new qt(ye, le);
  te.visible = false, te.renderOrder = 100, l.add(te);
  const z = new st({ color: Rn, transparent: true, opacity: 0.95, depthTest: false }), ne = new st({ color: Rn, transparent: true, opacity: 0.85, depthTest: false }), W = new Bo(1, 1, 1, 12), ve = new st({ color: Rn, transparent: true, opacity: 0.55, side: Pt, depthTest: false }), ge = new ut({ color: Rn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), B = [];
  window.__hekatanModelSelection = B;
  const I = new tt();
  I.renderOrder = 101, l.add(I);
  const U = document.createElement("div");
  Object.assign(U.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), U.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(U);
  }, 0);
  function T(ae) {
    const F = e.derivedNodes.rawVal;
    return !F || ae < 0 || ae >= F.length ? null : new M(F[ae][0], F[ae][1], F[ae][2]);
  }
  function E(ae, F) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2;
    const K = e.getActiveCamera();
    if (!K || !e.mesh) return null;
    const N = e.rendererElm.getBoundingClientRect(), O = ae - N.left, ie = F - N.top, fe = e.derivedNodes.rawVal, pe = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!fe || !pe) return null;
    const ke = /* @__PURE__ */ new Map(), Fe = (Ne) => {
      if (ke.has(Ne)) return ke.get(Ne);
      const Re = T(Ne);
      if (!Re) return ke.set(Ne, null), null;
      const ze = Re.clone().project(K), qe = (ze.x * 0.5 + 0.5) * N.width, xe = (-ze.y * 0.5 + 0.5) * N.height, Ze = { x: qe, y: xe, z: ze.z };
      return ke.set(Ne, Ze), Ze;
    }, Ee = /* @__PURE__ */ new Set();
    for (const Ne of pe) if (Ne) for (const Re of Ne) Ee.add(Re);
    const De = 8;
    let Be = -1, Ke = De;
    for (let Ne = 0; Ne < fe.length; Ne++) {
      if (!Ee.has(Ne)) continue;
      const Re = Fe(Ne);
      if (!Re || Re.z < -1 || Re.z > 1) continue;
      const ze = Re.x - O, qe = Re.y - ie, xe = Math.sqrt(ze * ze + qe * qe);
      xe < Ke && (Ke = xe, Be = Ne);
    }
    const $e = fa(), mt = ma[$e.dispUnit] ?? 1e3, Ge = ha[$e.forceUnit] ?? 1;
    if (Be >= 0) {
      const Ne = fe[Be];
      let Re = `Nodo ${Be}
(${Ne[0].toFixed(3)}, ${Ne[1].toFixed(3)}, ${Ne[2].toFixed(3)})`;
      const ze = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (ze == null ? void 0 : ze.deformations) {
        const qe = ze.deformations.get(Be);
        if (qe && (Re += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Re += `
Ux = ${yt(qe[0] * mt, 3)} ${$e.dispUnit}`, Re += `
Uy = ${yt(qe[1] * mt, 3)} ${$e.dispUnit}`, Re += `
Uz = ${yt(qe[2] * mt, 3)} ${$e.dispUnit}`, (Math.abs(qe[3]) > 1e-9 || Math.abs(qe[4]) > 1e-9 || Math.abs(qe[5]) > 1e-9) && (Re += `
Rx = ${yt(qe[3] * 1e3, 3)} mrad`, Re += `
Ry = ${yt(qe[4] * 1e3, 3)} mrad`, Re += `
Rz = ${yt(qe[5] * 1e3, 3)} mrad`)), ze.reactions) {
          const xe = ze.reactions.get(Be);
          xe && (Math.abs(xe[0]) > 1e-9 || Math.abs(xe[1]) > 1e-9 || Math.abs(xe[2]) > 1e-9 || Math.abs(xe[3]) > 1e-6 || Math.abs(xe[4]) > 1e-6 || Math.abs(xe[5]) > 1e-6) && (Re += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Re += `
Fx = ${yt(xe[0] * Ge)} ${$e.forceUnit}`, Re += `
Fy = ${yt(xe[1] * Ge)} ${$e.forceUnit}`, Re += `
Fz = ${yt(xe[2] * Ge)} ${$e.forceUnit}`, (Math.abs(xe[3]) > 1e-6 || Math.abs(xe[4]) > 1e-6 || Math.abs(xe[5]) > 1e-6) && (Re += `
Mx = ${yt(xe[3] * Ge)} ${$e.forceUnit}\xB7m`, Re += `
My = ${yt(xe[4] * Ge)} ${$e.forceUnit}\xB7m`, Re += `
Mz = ${yt(xe[5] * Ge)} ${$e.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Be, info: Re };
    }
    const at = 5;
    let dt = -1, it = at, Zt = "frame";
    for (let Ne = 0; Ne < pe.length; Ne++) {
      const Re = pe[Ne];
      if (!(!Re || Re.length < 2)) {
        if (Re.length === 2) {
          const ze = Fe(Re[0]), qe = Fe(Re[1]);
          if (!ze || !qe || ze.z < -1 || ze.z > 1 || qe.z < -1 || qe.z > 1) continue;
          const xe = Ma(O, ie, ze.x, ze.y, qe.x, qe.y);
          xe < it && (it = xe, dt = Ne, Zt = "frame");
        } else if (Re.length === 3 || Re.length === 4) {
          const ze = [];
          let qe = true;
          for (const xe of Re) {
            const Ze = Fe(xe);
            if (!Ze || Ze.z < -1 || Ze.z > 1) {
              qe = false;
              break;
            }
            ze.push(Ze);
          }
          if (!qe) continue;
          if (ba(O, ie, ze)) {
            const Ze = ze.reduce((He, xt) => He + xt.z, 0) / ze.length * 1e-3;
            Ze < it && (it = Ze, dt = Ne, Zt = "shell");
          }
        } else if (Re.length === 8) {
          const ze = [];
          let qe = true;
          for (const we of Re) {
            const Xe = Fe(we);
            if (!Xe || Xe.z < -1 || Xe.z > 1) {
              qe = false;
              break;
            }
            ze.push(Xe);
          }
          if (!qe) continue;
          const xe = Math.min(...ze.map((we) => we.x)), Ze = Math.max(...ze.map((we) => we.x)), He = Math.min(...ze.map((we) => we.y)), xt = Math.max(...ze.map((we) => we.y));
          if (O >= xe && O <= Ze && ie >= He && ie <= xt) {
            const Xe = ze.reduce((nt, gt) => nt + gt.z, 0) / ze.length * 1e-3;
            Xe < it && (it = Xe, dt = Ne, Zt = "solid");
          }
        }
      }
    }
    if (dt >= 0) {
      const Ne = pe[dt];
      let ze = `${Zt === "frame" ? "Frame" : Zt === "shell" ? "Shell" : "Solid"} ${dt}`;
      const qe = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, xe = (_g = (_f = qe == null ? void 0 : qe.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, dt);
      if (xe) {
        xe.name && (ze += `
  \u{1F4CB} ${xe.name}`), xe.shape && (ze += `
  Shape: ${xe.shape}`);
        const Ze = /concrete|hormig|rect.*sólida/i.test(xe.shape || ""), He = Ze ? 100 : 1e3, xt = Ze ? "cm" : "mm", we = (nt) => {
          const gt = nt * He;
          return Math.abs(gt - Math.round(gt)) < 0.05 ? `${Math.round(gt)}` : `${gt.toFixed(1)}`;
        }, Xe = [];
        if (xe.D != null && Xe.push(`D=${we(xe.D)}`), xe.B != null && Xe.push(`B=${we(xe.B)}`), xe.TF != null && Xe.push(`TF=${we(xe.TF)}`), xe.TW != null && Xe.push(`TW=${we(xe.TW)}`), xe.t != null && Xe.push(`t=${we(xe.t)}`), Xe.length && (ze += `
  Dim: ${Xe.join(" ")} ${xt}`), xe.material) {
          let nt = xe.material;
          xe.fillMaterial && (nt += ` + FILL "${xe.fillMaterial}"`), ze += `
  Mat: ${nt}`;
        }
      } else {
        const Ze = (_i = (_h = qe == null ? void 0 : qe.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, dt), He = (_k = (_j = qe == null ? void 0 : qe.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, dt);
        Ze ? (ze += `
  ${Ze}`, He && !Ze.includes(He) && (ze += `  (${He})`)) : He && (ze += `
  Material: ${He}`);
      }
      if (ze += `
nodos: [${Ne.join(", ")}]`, Zt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Ze = e.mesh.analyzeOutputs.rawVal, He = wa[$e.stressUnit] ?? 1, xt = [["bendingXX", "Mxx", Ge, `${$e.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ge, `${$e.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ge, `${$e.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ge, `${$e.forceUnit}/m`], ["membraneYY", "Nyy", Ge, `${$e.forceUnit}/m`], ["membraneXY", "Nxy", Ge, `${$e.forceUnit}/m`], ["shearX", "Qx", Ge, `${$e.forceUnit}/m`], ["shearY", "Qy", Ge, `${$e.forceUnit}/m`], ["vonMises", "\u03C3VM", He, $e.stressUnit], ["pressure", "p", He, $e.stressUnit]], we = [];
        for (const [Xe, nt, gt, Kt] of xt) {
          const bt = Ze == null ? void 0 : Ze[Xe];
          if (bt && bt instanceof Map) {
            const Et = bt.get(dt);
            if (Et != null) {
              if (typeof Et == "number") we.push(`${nt} = ${yt(Et * gt, 3)} ${Kt}`);
              else if (Array.isArray(Et)) {
                let lt = Et[0];
                for (const en of Et) Math.abs(en) > Math.abs(lt) && (lt = en);
                we.push(`${nt} = ${yt(lt * gt, 3)} ${Kt}`);
              }
            }
          }
        }
        we.length > 0 && (ze += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + we.slice(0, 8).join(`
`));
      }
      if (Zt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Ze = e.mesh.deformOutputs.rawVal, He = e.mesh.elementInputs.rawVal, xt = Ze == null ? void 0 : Ze.deformations;
        if (xt && Ne.length === 2) {
          const we = xt.get(Ne[0]), Xe = xt.get(Ne[1]), nt = fe[Ne[0]], gt = fe[Ne[1]];
          if (we && Xe && nt && gt) {
            const Kt = gt[0] - nt[0], bt = gt[1] - nt[1], Et = gt[2] - nt[2], lt = Math.sqrt(Kt * Kt + bt * bt + Et * Et);
            if (lt > 1e-9) {
              const en = Kt / lt, It = bt / lt, Jt = Et / lt, tn = (Xe[0] - we[0]) * en + (Xe[1] - we[1]) * It + (Xe[2] - we[2]) * Jt, nn = ((_n2 = He.elasticities) == null ? void 0 : _n2.get(dt)) ?? 0, Un = ((_o = He.areas) == null ? void 0 : _o.get(dt)) ?? 0, Zn = ((_p = He.momentsOfInertiaY) == null ? void 0 : _p.get(dt)) ?? 0, cn = ((_q = He.momentsOfInertiaZ) == null ? void 0 : _q.get(dt)) ?? 0, Pn = ((_r = He.torsionalConstants) == null ? void 0 : _r.get(dt)) ?? 0, dn = ((_s2 = He.shearModuli) == null ? void 0 : _s2.get(dt)) ?? nn / 2.6, pn = nn * Un * (tn / lt), Vt = (Xe[3] - we[3]) * en + (Xe[4] - we[4]) * It + (Xe[5] - we[5]) * Jt, Xt = dn * Pn * (Vt / lt), Ot = Xe[4] - we[4], on = Xe[5] - we[5], Cn = nn * Zn * Ot / lt, Gt = nn * cn * on / lt;
              ze += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, ze += `
L = ${yt(lt, 3)} m`, ze += `
\u0394L = ${yt(tn * mt, 3)} ${$e.dispUnit}`, ze += `
\u03B5 = ${yt(tn / lt, 6)}`, Math.abs(pn) > 1e-6 && (ze += `
N \u2248 ${yt(pn * Ge)} ${$e.forceUnit}`), Math.abs(Xt) > 1e-6 && (ze += `
T \u2248 ${yt(Xt * Ge)} ${$e.forceUnit}\xB7m`), Math.abs(Cn) > 1e-6 && (ze += `
My \u2248 ${yt(Cn * Ge)} ${$e.forceUnit}\xB7m`), Math.abs(Gt) > 1e-6 && (ze += `
Mz \u2248 ${yt(Gt * Ge)} ${$e.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Zt, idx: dt, info: ze };
    }
    return null;
  }
  function X(ae, F, K) {
    var _a2, _b, _c;
    if (d.visible = false, x.visible = false, S.visible = false, Z.visible = false, te.visible = false, !ae || !e.mesh) {
      U.style.display = "none", e.render();
      return;
    }
    const N = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (ae.type === "node") {
      const pe = T(ae.idx);
      if (pe) {
        const ke = e.derivedNodes.rawVal ?? [];
        let Fe = 1;
        if (ke.length >= 2) {
          let Be = [1 / 0, 1 / 0, 1 / 0], Ke = [-1 / 0, -1 / 0, -1 / 0];
          for (const $e of ke) for (let mt = 0; mt < 3; mt++) $e[mt] < Be[mt] && (Be[mt] = $e[mt]), $e[mt] > Ke[mt] && (Ke[mt] = $e[mt]);
          Fe = Math.max(Ke[0] - Be[0], Ke[1] - Be[1], Ke[2] - Be[2], 0.1);
        }
        const Ee = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, De = 0.021 * Fe * Ee;
        d.position.copy(pe), d.scale.setScalar(De), d.visible = true;
      }
    } else if (ae.type === "frame" && N) {
      const pe = N[ae.idx], ke = T(pe[0]), Fe = T(pe[1]);
      if (ke && Fe) {
        const Ee = ke.clone().add(Fe).multiplyScalar(0.5), De = Fe.clone().sub(ke), Be = De.length(), mt = e.getActiveCamera().position.distanceTo(Ee) * 35e-4;
        S.position.copy(Ee);
        const Ge = new M(0, 1, 0), at = Ge.clone().cross(De).normalize(), dt = Ge.angleTo(De);
        S.quaternion.setFromAxisAngle(at, dt), S.scale.set(mt, Be, mt), S.visible = true;
      }
    } else if (ae.type === "shell" && N) {
      const pe = N[ae.idx], ke = [], Fe = [];
      for (const Ee of pe) {
        const De = T(Ee);
        if (!De) return;
        ke.push(De.x, De.y, De.z);
      }
      pe.length === 4 ? Fe.push(0, 1, 2, 0, 2, 3) : pe.length === 3 && Fe.push(0, 1, 2), C.setAttribute("position", new Mt(ke, 3)), C.setIndex(Fe), C.computeVertexNormals(), Z.visible = true;
    } else if (ae.type === "solid" && N) {
      const pe = N[ae.idx], ke = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Fe = [];
      for (const [Ee, De] of ke) {
        const Be = T(pe[Ee]), Ke = T(pe[De]);
        Be && Ke && Fe.push(Be.x, Be.y, Be.z, Ke.x, Ke.y, Ke.z);
      }
      ye.setAttribute("position", new Mt(Fe, 3)), te.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      U.style.display = "none", e.render();
      return;
    }
    U.textContent = ae.info, U.style.whiteSpace = "pre-line", U.style.display = "block";
    const ie = e.rendererElm.getBoundingClientRect(), fe = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? ie;
    U.style.left = `${F - fe.left}px`, U.style.top = `${K - fe.top}px`, e.render();
  }
  let D = "", $ = 0, Q = 0;
  const re = window.__hekatanHoverDebug ?? false, se = (ae) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const F = E(ae.clientX, ae.clientY);
      if (re && Q < 5) {
        const N = e.derivedNodes.rawVal, O = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${ae.clientX}, ${ae.clientY}) nodes=${(N == null ? void 0 : N.length) ?? 0} elems=${(O == null ? void 0 : O.length) ?? 0} hover=`, F), Q++;
      }
      const K = F ? `${F.type}:${F.idx}` : "";
      if (K !== D) D = K, X(F, ae.clientX, ae.clientY);
      else if (F) {
        const N = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        U.style.left = `${ae.clientX - N.left}px`, U.style.top = `${ae.clientY - N.top}px`;
      }
    });
  };
  let j = null;
  const R = () => {
    D = "", d.visible = false, x.visible = false, S.visible = false, Z.visible = false, te.visible = false, U.style.display = "none", e.render();
  }, ce = (ae) => {
    const F = e.rendererElm.getBoundingClientRect(), K = ae.clientX - F.left, N = ae.clientY - F.top;
    (K < -2 || N < -2 || K > F.width + 2 || N > F.height + 2) && (j && clearTimeout(j), j = window.setTimeout(R, 200));
  }, G = () => {
    j && (clearTimeout(j), j = null);
  };
  e.rendererElm.addEventListener("pointermove", se), e.rendererElm.addEventListener("pointerleave", ce), e.rendererElm.addEventListener("pointerenter", G);
  function ue() {
    var _a2, _b, _c;
    const ae = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return ae === "select" || ae === "none" || !ae;
  }
  let he = null;
  e.rendererElm.addEventListener("pointerdown", (ae) => {
    ae.button === 0 && (he = { x: ae.clientX, y: ae.clientY });
  }), e.rendererElm.addEventListener("pointerup", (ae) => {
    if (ae.button !== 0 || !he) return;
    const F = ae.clientX - he.x, K = ae.clientY - he.y;
    if (he = null, F * F + K * K > 9 || !ue()) return;
    const N = E(ae.clientX, ae.clientY);
    N ? (Qe({ type: N.type, idx: N.idx }, ae.shiftKey), Le()) : ct();
  }), window.addEventListener("keydown", (ae) => {
    if (ae.key !== "Escape" || !B.length) return;
    const F = document.activeElement, K = !!F && (F.id === "hk3-cmd-input" || F.id === "hk-dyn-input") && F.value === "";
    F && (F.tagName === "INPUT" || F.tagName === "TEXTAREA" || F.isContentEditable) && !K || ct();
  }, { capture: true });
  function Ve() {
    for (const ae of I.children.slice()) {
      I.remove(ae);
      const F = ae.geometry;
      F && F !== u && F !== W && F.dispose();
    }
  }
  function Me(ae, F) {
    var _a2, _b, _c;
    const K = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (ae.type === "node") {
      const N = T(ae.idx);
      if (!N) return;
      const O = ((_c = e.derivedDisplayScale) == null ? void 0 : _c.rawVal) ?? 1, ie = new Oe(u, z);
      ie.position.copy(N), ie.scale.setScalar(0.025 * F * O), ie.renderOrder = 101, I.add(ie);
    } else if (ae.type === "frame" && K) {
      const N = K[ae.idx], O = T(N[0]), ie = T(N[1]);
      if (!O || !ie) return;
      const fe = O.clone().add(ie).multiplyScalar(0.5), pe = ie.clone().sub(O), ke = pe.length(), Fe = e.getActiveCamera().position.distanceTo(fe), Ee = new Oe(W, ne);
      Ee.position.copy(fe);
      const De = new M(0, 1, 0);
      Ee.quaternion.setFromAxisAngle(De.clone().cross(pe).normalize(), De.angleTo(pe)), Ee.scale.set(Fe * 35e-4, ke, Fe * 35e-4), Ee.renderOrder = 101, I.add(Ee);
    } else if (ae.type === "shell" && K) {
      const N = K[ae.idx], O = [], ie = [];
      for (const ke of N) {
        const Fe = T(ke);
        if (!Fe) return;
        O.push(Fe.x, Fe.y, Fe.z);
      }
      N.length === 4 ? ie.push(0, 1, 2, 0, 2, 3) : N.length === 3 && ie.push(0, 1, 2);
      const fe = new be();
      fe.setAttribute("position", new Mt(O, 3)), fe.setIndex(ie), fe.computeVertexNormals();
      const pe = new Oe(fe, ve);
      pe.renderOrder = 101, I.add(pe);
    } else if (ae.type === "solid" && K) {
      const N = K[ae.idx], O = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ie = [];
      for (const [ke, Fe] of O) {
        const Ee = T(N[ke]), De = T(N[Fe]);
        Ee && De && ie.push(Ee.x, Ee.y, Ee.z, De.x, De.y, De.z);
      }
      const fe = new be();
      fe.setAttribute("position", new Mt(ie, 3));
      const pe = new qt(fe, ge);
      pe.renderOrder = 101, I.add(pe);
    }
  }
  function Le() {
    if (Ve(), !B.length || !e.mesh) {
      e.render();
      return;
    }
    const ae = e.derivedNodes.rawVal ?? [];
    let F = 1;
    if (ae.length >= 2) {
      const K = [1 / 0, 1 / 0, 1 / 0], N = [-1 / 0, -1 / 0, -1 / 0];
      for (const O of ae) for (let ie = 0; ie < 3; ie++) O[ie] < K[ie] && (K[ie] = O[ie]), O[ie] > N[ie] && (N[ie] = O[ie]);
      F = Math.max(N[0] - K[0], N[1] - K[1], N[2] - K[2], 0.1);
    }
    for (const K of B) Me(K, F);
    e.render();
  }
  function Qe(ae, F) {
    const K = B.findIndex((N) => N.type === ae.type && N.idx === ae.idx);
    K >= 0 ? B.splice(K, 1) : F || B.push(ae), B.length && B[B.length - 1];
  }
  function ct() {
    B.length = 0, Le();
  }
  return q.derive(() => {
    e.derivedNodes.val, B.length && Le();
  }), l;
}
function Ma(e, l, u, f, d, w) {
  const p = d - u, x = w - f, g = p * p + x * x;
  if (g < 1e-9) {
    const le = e - u, te = l - f;
    return Math.sqrt(le * le + te * te);
  }
  let S = ((e - u) * p + (l - f) * x) / g;
  S = Math.max(0, Math.min(1, S));
  const C = u + S * p, v = f + S * x, Z = e - C, ye = l - v;
  return Math.sqrt(Z * Z + ye * ye);
}
function ba(e, l, u) {
  let f = false;
  for (let d = 0, w = u.length - 1; d < u.length; w = d++) {
    const p = u[d].x, x = u[d].y, g = u[w].x, S = u[w].y;
    x > l != S > l && e < (g - p) * (l - x) / (S - x + 1e-12) + p && (f = !f);
  }
  return f;
}
function qo(e, l = 8) {
  const u = document.createElement("div");
  u.id = "legend", u.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    q.derive(() => {
      Nn.val, u.style.background = Is();
    });
  });
  const f = document.createElement("div");
  f.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", u.appendChild(f), setTimeout(() => {
    q.derive(() => {
      f.textContent = uo.val ? `[${uo.val}]` : "";
    });
  });
  const d = Array.from({ length: l + 1 }, (g, S) => S / l).reverse();
  let w, p;
  d.forEach((g, S) => {
    w = document.createElement("div"), w.id = `marker-${S}`, w.className = "marker", w.style.marginTop = S == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", p = document.createElement("p"), p.id = `marker-text-${S}`, w.append(p), u.append(w);
  });
  const x = [];
  return u.querySelectorAll("p").forEach((g) => x.push(g)), setTimeout(() => {
    q.derive(() => {
      d.forEach((g, S) => {
        const C = x[S];
        C && (C.innerText = _a(e.val, g).toString());
      });
    });
  }), u;
}
function _a(e, l) {
  const u = kn.val;
  if (u) return Ko(u[0] + l * (u[1] - u[0]));
  const f = e.filter((p) => Number.isFinite(p));
  if (f.length === 0) return "0";
  const [d, w] = ho(f);
  return Ko(d + l * (w - d));
}
function Ko(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function La({ mesh: e, settingsObj: l, drawingObj: u, objects3D: f, solids: d }) {
  $s.DEFAULT_UP = new M(0, 0, 1);
  const w = document.createElement("div"), p = new As(), x = new Es(45, 1, 0.1, 2 * 1e6), g = new Ts(-10, 10, 10, -10, -1e3, 2e6);
  let S = x;
  const C = new Vs({ antialias: true });
  C.localClippingEnabled = true;
  const v = new Xo(x, C.domElement);
  v.enableDamping = true, v.dampingFactor = 0.1, v.screenSpacePanning = true, v.zoomSpeed = 0.8, v.panSpeed = 1.2, v.rotateSpeed = 0.9, v.keyPanSpeed = 12, v.listenToKeyEvents(window), v.touches = { ONE: $n.ROTATE, TWO: $n.DOLLY_PAN }, C.domElement.addEventListener("wheel", (F) => {
    if (!F.ctrlKey && Math.abs(F.deltaX) > Math.abs(F.deltaY) * 1.5) {
      F.preventDefault();
      const K = v.target, N = new M().subVectors(x.position, K), O = new M();
      O.crossVectors(x.up, N).normalize();
      const fe = N.length() * 1e-3 * v.panSpeed;
      K.addScaledVector(O, F.deltaX * fe), x.position.addScaledVector(O, F.deltaX * fe), v.update();
    }
  }, { passive: false });
  const Z = new io(new M(-1, 0, 0), 0), ye = new io(new M(0, -1, 0), 0), le = new io(new M(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function te() {
    const F = window.__hekatanClip, K = [];
    F.enableX && (Z.normal.set(F.invertX ? 1 : -1, 0, 0), Z.constant = F.invertX ? -F.posX : F.posX, K.push(Z)), F.enableY && (ye.normal.set(0, F.invertY ? 1 : -1, 0), ye.constant = F.invertY ? -F.posY : F.posY, K.push(ye)), F.enableZ && (le.normal.set(0, 0, F.invertZ ? 1 : -1), le.constant = F.invertZ ? -F.posZ : F.posZ, K.push(le)), C.clippingPlanes = K, p.traverse((O) => {
      const ie = O;
      if (ie.material) {
        const fe = Array.isArray(ie.material) ? ie.material : [ie.material];
        for (const pe of fe) pe.clippingPlanes = K, pe.needsUpdate = true;
      }
    });
    const N = window.__hekatanPanes ?? [];
    for (const O of N) try {
      O && typeof O.refresh == "function" && O.refresh();
    } catch {
    }
    C.render(p, S);
  }
  te(), window.__hekatanClipApply = te;
  const z = Xs(l), ne = q.derive(() => Math.pow(10, z.displayScale.val / 10)), W = Sa(e, z), ve = () => {
    const F = [];
    return z.gridXY.rawVal && F.push("xy"), z.gridXZ.rawVal && F.push("xz"), z.gridYZ.rawVal && F.push("yz"), F;
  }, ge = () => {
    const F = z.gridStep.rawVal, K = Math.max(F, z.gridMajor.rawVal);
    return { planes: ve(), majorStep: K, minorStep: F };
  };
  let B = ro(z.gridSize.rawVal, ge());
  B.visible = z.gridVisible.rawVal, window.__hekatanSnap2D = z.cursorSnap.rawVal;
  const I = () => {
    const F = Math.max(0, Math.min(1, z.gridOpacity.rawVal));
    B.traverse((K) => {
      const N = K.material;
      if (!N || !("opacity" in N)) return;
      const O = K.name ?? "";
      let ie = 0.35;
      O.includes("border") ? ie = 1 : O.includes("major") && (ie = 0.75), N.opacity = F * ie;
    });
  };
  I(), w.appendChild(Bs(z, e, d)), w.setAttribute("id", "viewer"), w.appendChild(C.domElement), C.setPixelRatio(window.devicePixelRatio);
  const U = rn();
  C.setClearColor(U.background, 1);
  const T = z.gridSize.rawVal, E = T * 0.5 + T * 0.5 / Math.tan(45 * 0.5);
  x.position.set(0, 0, E), x.up.set(0, 1, 0), v.target.set(0, 0, 0), v.minDistance = 0.1, v.maxDistance = 1e4, w.__settings = z, v.zoomSpeed = 1, v._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, v.update();
  let X = Yo(z.gridSize.rawVal, z.flipAxes.rawVal);
  p.add(B, X), q.derive(() => {
    window.__hekatanGridPlaneXY = z.gridXY.val, window.__hekatanGridPlaneXZ = z.gridXZ.val, window.__hekatanGridPlaneYZ = z.gridYZ.val;
  });
  let D = true;
  q.derive(() => {
    const F = z.gridVisible.val;
    if (D) {
      D = false;
      return;
    }
    B.visible = F, G();
  });
  let $ = true;
  q.derive(() => {
    if (z.gridOpacity.val, $) {
      $ = false;
      return;
    }
    I(), G();
  }), q.derive(() => {
    const F = z.cursorSnap.val;
    window.__hekatanSnap2D = F;
  });
  let Q = true;
  q.derive(() => {
    var _a2;
    const F = z.gridSize.val, K = z.flipAxes.val;
    if (z.gridXY.val, z.gridXZ.val, z.gridYZ.val, z.gridStep.val, z.gridMajor.val, Q) {
      Q = false;
      return;
    }
    p.remove(B), (_a2 = B.traverse) == null ? void 0 : _a2.call(B, (ie) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ie.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ie.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), B = ro(F, ge()), B.visible = z.gridVisible.rawVal, p.add(B), I(), p.remove(X), X.traverse((ie) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ie.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ie.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), X = Yo(F, K), p.add(X);
    const N = F * 0.5 + F * 0.5 / Math.tan(45 * 0.5);
    x.position.distanceTo(v.target), Math.abs(x.position.x) < 0.1 && Math.abs(x.position.y) < 0.1 && x.position.z > 0 ? x.position.set(0, 0, N) : x.position.set(0.5 * F, -N, 0.5 * F), v.target.set(0, 0, 0), v.minDistance = Math.max(0.05, F * 0.01), v.maxDistance = Math.max(50, F * 50), v.update(), G();
  }), new ResizeObserver((F) => {
    var _a2, _b;
    for (const K of F) {
      const N = (_a2 = K.target) == null ? void 0 : _a2.clientWidth, O = (_b = K.target) == null ? void 0 : _b.clientHeight;
      if (N === 0 || O === 0) continue;
      const fe = (se ? N / 2 : N) / O;
      x.aspect = fe, x.updateProjectionMatrix();
      const pe = g.top;
      if (g.left = -pe * fe, g.right = pe * fe, g.updateProjectionMatrix(), j && j.isPerspectiveCamera) j.aspect = fe, j.updateProjectionMatrix();
      else if (j && j.isOrthographicCamera) {
        const ke = j, Fe = ke.top;
        ke.left = -Fe * fe, ke.right = Fe * fe, ke.updateProjectionMatrix();
      }
      C.setSize(N, O), G();
    }
  }).observe(w), v.addEventListener("change", G), q.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, z.displayScale.val, z.nodes.val, z.elements.val, (_g = z.edges) == null ? void 0 : _g.val, z.elemColumns.val, z.elemBeams.val, z.nodesIndexes.val, z.elementsIndexes.val, z.orientations.val, z.sections.val, z.secColumns.val, z.secBeams.val, z.secFloor.val, z.supports.val, z.loads.val, z.deformedShape.val, z.nodeResults.val, z.frameResults.val, z.shellResults.val, (_h = z.solidResults) == null ? void 0 : _h.val, (_i = z.extruded) == null ? void 0 : _i.val, setTimeout(G);
  });
  let se = false, j = null, R = null, ce = false;
  function G() {
    const F = w.clientWidth || 1, K = w.clientHeight || 1;
    if (!se || !j) {
      C.setScissorTest(false), C.setViewport(0, 0, F, K), C.render(p, S);
      return;
    }
    const N = F / 2;
    C.setScissorTest(true), C.setViewport(0, 0, N, K), C.setScissor(0, 0, N, K), C.render(p, S), C.setViewport(N, 0, N, K), C.setScissor(N, 0, N, K), C.render(p, j), C.setScissorTest(false);
  }
  function ue(F) {
    S = F, v.object = F, v.update(), G();
  }
  function he(F, K) {
    se = F, K && (j = K);
    const N = w.clientWidth || 1, O = w.clientHeight || 1, fe = (F ? N / 2 : N) / O;
    x.isPerspectiveCamera && (x.aspect = fe, x.updateProjectionMatrix());
    const pe = g.top;
    if (g.left = -pe * fe, g.right = pe * fe, g.updateProjectionMatrix(), F && j) {
      if (R ? (R.object = j, R.update()) : (R = new Xo(j, C.domElement), R.enableDamping = true, R.dampingFactor = 0.1, R.screenSpacePanning = true, R.zoomSpeed = 0.8, R.panSpeed = 1.2, R.rotateSpeed = 0.9, R.touches = { ONE: $n.ROTATE, TWO: $n.DOLLY_PAN }, R.target.copy(v.target), R.addEventListener("change", G), R.enabled = false), !ce) {
        const ke = (Fe) => {
          if (!se || !R) return;
          const Ee = C.domElement.getBoundingClientRect(), De = Fe.clientX - Ee.left, Be = Ee.width / 2, Ke = De >= Be;
          v.enabled = !Ke, R.enabled = Ke;
        };
        C.domElement.addEventListener("pointerdown", ke, true), C.domElement.addEventListener("wheel", ke, { capture: true, passive: true }), ce = true;
      }
    } else F || (v.enabled = true, R && (R.enabled = false));
    w.__splitMode = F, window.__hekatanSplitMode = F, window.__hekatanSplitCamera = F ? j : null, G();
  }
  if (e) {
    p.add(Ns(z, W, ne), Ls(e, z, W), Zs(z, W, ne), qs(e, z, W, ne), Ys(e, z, W, ne), Us(e, z, W, ne), Hs(e, z, W, ne), Js(e, z, W, ne), ea(e, z, W), sa(e, z, W, ne), ta(e, z, W, ne));
    const F = va({ scene: p, rendererElm: C.domElement, getActiveCamera: () => S, derivedNodes: W, derivedDisplayScale: ne, mesh: e, settings: z, render: G });
    p.add(F);
    const K = Aa(e, z), N = la(e, z, W, K), O = qo(K);
    p.add(N), w.appendChild(O);
    const ie = ua(e, z, W);
    p.add(ie);
    const fe = ie.__colorMapValues, pe = qo(fe);
    pe.id = "frame-legend", w.appendChild(pe), q.derive(() => {
      var _a2;
      const ke = z.shellResults.val != "none", Fe = (((_a2 = z.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ee = ke || Fe, De = z.frameResults.val.startsWith("contour:"), Be = K.val.some((Ke) => Number.isFinite(Ke));
      O.hidden = !Ee || !Be, N.visible = Ee, pe.hidden = !De;
    });
  }
  if (d) {
    const F = new Jo(16777215, 0.5);
    p.add(F);
    const K = new Xn(16777215, 0.5);
    K.position.set(30, 25, -10), K.shadow.mapSize.width = 1024, K.shadow.mapSize.height = 1024, p.add(K);
    const N = 10;
    K.shadow.camera.left = -N, K.shadow.camera.right = N, K.shadow.camera.top = N, K.shadow.camera.bottom = -N, K.shadow.camera.far = 1e3;
    const O = new Xn(16777215, 0.5);
    O.color.setHSL(11, 43, 96), O.position.set(-10, 0, 30), p.add(O), q.derive(() => {
      (d == null ? void 0 : d.val.length) && (p.remove(...d.oldVal), p.add(...d.rawVal), G());
    }), q.derive(() => {
      d.rawVal.forEach((ie) => ie.visible = z.solids.val), G();
    });
  }
  if (f) {
    const F = [], K = (O) => {
      var _a2;
      return ((_a2 = O == null ? void 0 : O.userData) == null ? void 0 : _a2.isCota) ? z.showCotas.val : z.custom3D.val;
    }, N = () => {
      for (const O of F) O.visible = K(O);
      G();
    };
    q.derive(() => {
      const O = f.val;
      F.length && (p.remove(...F), F.length = 0), O.length && (p.add(...O), F.push(...O), N()), G();
    }), q.derive(() => {
      z.custom3D.val, N();
    }), q.derive(() => {
      z.showCotas.val, N();
    });
  }
  u && aa({ drawingObj: u, gridObj: B, scene: p, getActiveCamera: () => S, controls: v, gridSize: T, derivedDisplayScale: ne, rendererElm: C.domElement, viewerRender: G }), Ho((F, K) => {
    var _a2;
    C.setClearColor(K.background, 1), p.remove(B), (_a2 = B.traverse) == null ? void 0 : _a2.call(B, (N) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = N.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = N.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), B = ro(z.gridSize.rawVal, { planes: ve() }), p.add(B), w.style.setProperty("--awatif-legend-color", K.legendMarker), G();
  });
  const Ve = { scene: p, perspCamera: x, orthoCamera: g, get camera() {
    return S;
  }, controls: v, renderer: C, rendererElm: C.domElement, render: G, setActiveCamera: ue, setSplitMode: he, get splitMode() {
    return se;
  }, get splitCamera() {
    return j;
  }, settings: z };
  w.__ctx = Ve;
  const Me = document.createElement("div");
  Me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Le = (F, K, N) => {
    const O = document.createElement("button");
    return O.textContent = F, O.title = K, O.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), O.onmouseenter = () => {
      O.style.background = "rgba(70,70,70,0.9)";
    }, O.onmouseleave = () => {
      O.style.background = "rgba(40,40,40,0.85)";
    }, O.onclick = (ie) => {
      ie.preventDefault(), N();
    }, O;
  }, Qe = (F, K) => {
    const N = v.target, O = new M().subVectors(S.position, N), ie = O.length(), fe = new M(), pe = new M();
    fe.crossVectors(S.up, O).normalize(), pe.copy(S.up).normalize();
    const ke = ie * 0.05;
    N.addScaledVector(fe, -F * ke), N.addScaledVector(pe, K * ke), S.position.addScaledVector(fe, -F * ke), S.position.addScaledVector(pe, K * ke), v.update(), G();
  }, ct = (F) => {
    const K = new M().subVectors(S.position, v.target);
    K.multiplyScalar(F), S.position.copy(v.target).add(K), v.update(), G();
  }, ae = () => {
    const F = document.createElement("div");
    return F.style.cssText = "width:32px;height:32px;", F;
  };
  return Me.append(ae()), Me.append(Le("\u2191", "Pan arriba", () => Qe(0, 1))), Me.append(Le("\u2295", "Zoom in", () => ct(0.85))), Me.append(Le("\u2190", "Pan izquierda", () => Qe(-1, 0))), Me.append(Le("\u2302", "Reset vista", () => {
    v.reset(), G();
  })), Me.append(Le("\u2192", "Pan derecha", () => Qe(1, 0))), Me.append(Le("\u2296", "Zoom out", () => ct(1.18))), Me.append(Le("\u2193", "Pan abajo", () => Qe(0, -1))), Me.append(ae()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(Me), w;
}
function Sa(e, l) {
  return q.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const u = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], f = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!f || u.length === 0) return u;
    const d = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, p = Number.isFinite(d) ? d : 1, x = Number.isFinite(w) ? w : 1;
    return u.map((g, S) => {
      var _a3;
      const C = ((_a3 = f.get(S)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], v = Number.isFinite(C[0]) ? C[0] : 0, Z = Number.isFinite(C[1]) ? C[1] : 0, ye = Number.isFinite(C[2]) ? C[2] : 0;
      return [g[0] + v * p, g[1] + Z * p, g[2] + ye * x];
    });
  });
}
const kn = q.state(null), uo = q.state(""), ka = q.state("kN"), Pa = q.state("mm"), Ca = q.state("kN/m\xB2"), za = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Go = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Fa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Aa(e, l) {
  const u = q.state([]);
  let f;
  return ((d) => {
    d.bendingXX = "bendingXX", d.bendingYY = "bendingYY", d.bendingXY = "bendingXY", d.membraneXX = "membraneXX", d.membraneYY = "membraneYY", d.membraneXY = "membraneXY", d.tranverseShearX = "tranverseShearX", d.tranverseShearY = "tranverseShearY", d.membranePrincipalMax = "membranePrincipalMax", d.membranePrincipalMin = "membranePrincipalMin", d.bendingPrincipalMax = "bendingPrincipalMax", d.bendingPrincipalMin = "bendingPrincipalMin", d.transverseShearMax = "transverseShearMax", d.vonMises = "vonMises", d.pressure = "pressure", d.displacementX = "displacementX", d.displacementY = "displacementY", d.displacementZ = "displacementZ";
  })(f || (f = {})), q.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const d = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), le = (K, N) => {
      K == null ? void 0 : K.forEach((O, ie) => {
        const fe = e.elements.val[ie];
        if (fe) for (let pe = 0; pe < fe.length; pe++) N.set(fe[pe], [O[pe] ?? O[0]]);
      });
    };
    le((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, d), le((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), le((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, p), le((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, x), le((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, g), le((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, S), le((_n2 = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n2.tranverseShearX, C), le((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, v), le((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, Z), le((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, ye);
    const te = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), ge = (K, N, O, ie, fe) => {
      K.forEach((pe, ke) => {
        var _a3, _b2;
        const Fe = pe[0] ?? 0, Ee = ((_a3 = N.get(ke)) == null ? void 0 : _a3[0]) ?? 0, De = ((_b2 = O.get(ke)) == null ? void 0 : _b2[0]) ?? 0, Be = (Fe + Ee) / 2, Ke = Math.hypot((Fe - Ee) / 2, De);
        ie.set(ke, [Be + Ke]), fe.set(ke, [Be - Ke]);
      });
    };
    ge(x, g, S, te, z), ge(d, w, p, ne, W), C.forEach((K, N) => {
      var _a3;
      ve.set(N, [Math.hypot(K[0] ?? 0, ((_a3 = v.get(N)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const B = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, I = (_w = l.solidResults) == null ? void 0 : _w.val, T = I && I !== "none" ? I : l.shellResults.val, E = B == null ? void 0 : B[T], X = { bendingXX: [d, 0], bendingYY: [w, 0], bendingXY: [p, 0], membraneXX: [x, 0], membraneYY: [g, 0], membraneXY: [S, 0], tranverseShearX: [C, 0], tranverseShearY: [v, 0], membranePrincipalMax: [te, 0], membranePrincipalMin: [z, 0], bendingPrincipalMax: [ne, 0], bendingPrincipalMin: [W, 0], transverseShearMax: [ve, 0], vonMises: [Z, 0], pressure: [ye, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, D = l.shellResults.val, $ = ka.val, Q = Pa.val, re = D === "displacementX" || D === "displacementY" || D === "displacementZ", se = D === "bendingXX" || D === "bendingYY" || D === "bendingXY" || D === "bendingPrincipalMax" || D === "bendingPrincipalMin", j = D === "membraneXX" || D === "membraneYY" || D === "membraneXY" || D === "membranePrincipalMax" || D === "membranePrincipalMin", R = D === "vonMises" || D === "pressure", ce = D === "tranverseShearX" || D === "tranverseShearY" || D === "transverseShearMax", G = (_D = l.solidResults) == null ? void 0 : _D.val, ue = G === "vonMises" || G === "sigmaXX" || G === "sigmaYY" || G === "sigmaZZ" || G === "tauXY" || G === "tauYZ" || G === "tauXZ", he = G === "ux" || G === "uy" || G === "uz", Ve = Ca.val, Me = ue ? Fa[Ve] : he || re ? Go[Q] : se || j || R || ce ? 1 / za[$] : 1, Le = ue ? Ve : he || re ? Q : se ? `${$}\xB7m/m` : j ? `${$}/m\xB2` : R ? `${$}/m\xB2` : ce ? `${$}/m` : "";
    uo.val = Le, kn.val = Array.isArray(E) && E.length === 2 ? [E[0] * Me, E[1] * Me] : null;
    const Qe = es.val, ae = G && G !== "none" ? [Z, 0] : X[D], F = [];
    if (e.nodes.val.forEach((K, N) => {
      const O = ae;
      if (!O || !O[0] || typeof O[0].has != "function") return;
      if (!O[0].has(N)) {
        F.push(Number.NaN);
        return;
      }
      const ie = O[0].get(N), fe = ie ? ie[O[1]] ?? 0 : 0;
      F.push(fe * Me);
    }), !kn.val && Qe !== "auto") {
      const K = e.nodes.val, N = /* @__PURE__ */ new Set(), O = (fe, pe) => {
        var _a3;
        const ke = (_a3 = K[fe[0]]) == null ? void 0 : _a3[pe];
        return fe.every((Fe) => {
          var _a4;
          return Math.abs((((_a4 = K[Fe]) == null ? void 0 : _a4[pe]) ?? NaN) - ke) < 1e-6;
        });
      };
      for (const fe of e.elements.val) {
        if (fe.length !== 4) continue;
        const pe = O(fe, 2), ke = !pe && O(fe, 0), Fe = !pe && O(fe, 1);
        if (Qe === "losas" ? pe : Qe === "muros" ? ke || Fe : Qe === "murosX" ? ke : Qe === "murosY" ? Fe : false) for (const Be of fe) N.add(Be);
      }
      const ie = [];
      for (const fe of N) {
        const pe = F[fe];
        Number.isFinite(pe) && ie.push(pe);
      }
      ie.length && (kn.val = ho(ie));
    }
    u.val = F;
  }), u;
}
export {
  Ds as a,
  qo as b,
  ka as c,
  Pa as d,
  Ca as e,
  La as g
};
