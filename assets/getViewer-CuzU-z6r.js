import { N as Ht, a6 as Kn, q as Us, v as j, a7 as qs, D as zt, M as rt, B as Ce, F as kt, a8 as Ks, x as wt, a9 as Gs, aa as Hs, h as os, ab as ss, r as dn, ac as Qn, ad as jn, a4 as xs, _ as lt, a as ht, L as Wt, w as gs, b as Ws, ae as Js, f as ft, V as k, $ as cn, af as ko, H as Vo, d as Pt, c as So, Y as vs, Z as to, G as Os, z as En, A as Qs, ag as eo, t as js, o as ea, I as en, a2 as Fn, E as as, S as xn, m as Gn, ah as An, g as is, i as ls, j as rs, C as cs, K as ta, U as na, W as oa, X as sa, T as Hn, P as Po, O as aa } from "./theme-Dxpmbnyd.js";
import { T as Ct, O as ds } from "./Text-DxjkL_3A.js";
import { P as bs } from "./tweakpane-BXg6ZhiP.js";
import { e as ia } from "./styles-DjzQZscE.js";
class Ms {
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
    const p = 1 / this.n, u = new Ht(), w = new Ht();
    this.lut.length = 0, this.lut.push(new Ht(this.map[0][1]));
    for (let f = 1; f < r; f++) {
      const b = f * p;
      for (let y = 0; y < this.map.length - 1; y++) if (b > this.map[y][0] && b <= this.map[y + 1][0]) {
        const P = this.map[y][0], V = this.map[y + 1][0];
        u.setHex(this.map[y][1], Kn), w.setHex(this.map[y + 1][1], Kn);
        const g = new Ht().lerpColors(u, w, (b - P) / (V - P));
        this.lut.push(g);
      }
    }
    return this.lut.push(new Ht(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Us.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
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
    const r = l.getContext("2d", { alpha: false }), p = r.getImageData(0, 0, 1, this.n), u = p.data;
    let w = 0;
    const f = 1 / this.n, b = new Ht(), y = new Ht(), P = new Ht();
    for (let V = 1; V >= 0; V -= f) for (let g = this.map.length - 1; g >= 0; g--) if (V < this.map[g][0] && V >= this.map[g - 1][0]) {
      const O = this.map[g - 1][0], he = this.map[g][0];
      b.setHex(this.map[g - 1][1], Kn), y.setHex(this.map[g][1], Kn), P.lerpColors(b, y, (V - O) / (he - O)), u[w * 4] = Math.round(P.r * 255), u[w * 4 + 1] = Math.round(P.g * 255), u[w * 4 + 2] = Math.round(P.b * 255), u[w * 4 + 3] = 255, w += 1;
    }
    return r.putImageData(p, 0, 0), l;
  }
}
const Co = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, _s = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], la = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: _s, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, no = j.state("safe"), ks = j.state("auto");
function Ss(e) {
  e = Math.max(0, Math.min(1, e));
  const l = la[no.val] ?? _s;
  for (let p = 0; p < l.length - 1; p++) {
    const [u, w, f, b] = l[p], [y, P, V, g] = l[p + 1];
    if (e <= y) {
      const O = (e - u) / (y - u);
      return [w + (P - w) * O, f + (V - f) * O, b + (g - b) * O];
    }
  }
  const r = l[l.length - 1];
  return [r[1], r[2], r[3]];
}
function ps() {
  const l = new Uint8Array(1024);
  for (let p = 0; p < 256; p++) {
    const u = p / 255, [w, f, b] = Ss(u);
    l[p * 4 + 0] = w, l[p * 4 + 1] = f, l[p * 4 + 2] = b, l[p * 4 + 3] = 255;
  }
  const r = new Gs(l, 256, 1, Hs);
  return r.minFilter = os, r.magFilter = os, r.wrapS = ss, r.wrapT = ss, r.needsUpdate = true, r;
}
function ra() {
  const l = [];
  for (let r = 0; r <= 12; r++) {
    const p = 1 - r / 12, [u, w, f] = Ss(p);
    l.push(`rgb(${u | 0},${w | 0},${f | 0}) ${(r / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function To(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((w, f) => w - f), r = (w) => l[Math.min(l.length - 1, Math.max(0, Math.round(w * (l.length - 1))))];
  let p = l.length >= 20 ? r(0.01) : l[0], u = l.length >= 20 ? r(0.99) : l[l.length - 1];
  return p >= 0 && u > 0 && (p = 0), u <= 0 && p < 0 && (u = 0), [p, u];
}
function ca(e, l, r) {
  new Ms();
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
    `, side: zt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  j.derive(() => {
    var _a2;
    no.val;
    const f = u.uniforms.cmap.value;
    u.uniforms.cmap.value = ps(), (_a2 = f == null ? void 0 : f.dispose) == null ? void 0 : _a2.call(f);
  });
  const w = new rt(new Ce(), u);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", j.derive(() => {
    w.geometry.setAttribute("position", new kt(e.val.flat(), 3));
    const f = [], b = [], y = [];
    l.val.forEach((B, de) => {
      B.length === 3 ? (f.push(B[0], B[1], B[2]), b.push(de), y.push(0)) : B.length === 4 && (f.push(B[0], B[1], B[2]), f.push(B[0], B[2], B[3]), b.push(de, de), y.push(0, 1));
    }), w.geometry.setIndex(new Ks(f, 1)), w.userData.faceToElem = b, w.userData.faceLocal = y;
    const P = r.val.filter((B) => Number.isFinite(B));
    let V, g;
    const O = Tn.val;
    if (O ? (g = O[0], V = O[1]) : [g, V] = To(P), V === g) {
      const B = Math.max(Math.abs(V) * 1e-6, 1e-9);
      V += B, g -= B;
    }
    const he = O && O[0] > O[1], be = Math.min(g, V), re = Math.max(g, V), I = re - be, ce = new Float32Array(r.val.length);
    for (let B = 0; B < r.val.length; B++) {
      const de = r.val[B];
      if (!Number.isFinite(de)) {
        ce[B] = -1;
        continue;
      }
      const R = ((he ? re + be - de : de) - be) / I;
      ce[B] = Math.max(0, Math.min(1, R));
    }
    w.geometry.setAttribute("scalar", new wt(ce, 1));
  }), w;
}
function da(e, l, r) {
  const p = document.createElement("div"), u = new bs({ title: "Settings", expanded: true, container: p });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(u), p.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let f = null;
  try {
    const g = localStorage.getItem(w);
    g && (f = JSON.parse(g));
  } catch {
  }
  p.style.cssText = ["position:fixed", f ? `left:${f.left}px` : "left:8px", f ? `top:${f.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const b = () => {
    const g = p.querySelector(".tp-rotv_b");
    if (!g) {
      setTimeout(b, 200);
      return;
    }
    g.style.cursor = "move", g.style.userSelect = "none";
    let O = false, he = 0, be = 0, re = 0, I = 0;
    g.addEventListener("mousedown", (ce) => {
      O = true, he = ce.clientX, be = ce.clientY;
      const B = p.getBoundingClientRect();
      re = B.left, I = B.top, p.style.left = `${re}px`, p.style.top = `${I}px`;
    }), window.addEventListener("mousemove", (ce) => {
      if (!O) return;
      const B = ce.clientX - he, de = ce.clientY - be, ae = Math.max(0, Math.min(window.innerWidth - 40, re + B)), R = Math.max(0, Math.min(window.innerHeight - 40, I + de));
      p.style.left = `${ae}px`, p.style.top = `${R}px`;
    }), window.addEventListener("mouseup", () => {
      if (O) {
        O = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(p.style.left), top: parseFloat(p.style.top) }));
        } catch {
        }
      }
    });
  };
  if (b(), l == null ? void 0 : l.nodes) {
    u.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const g = u.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    g.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), g.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), g.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), g.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const O = g.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    O.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), O.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), O.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), O.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), O.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const he = u.addFolder({ title: "\u{1F441} Ver", expanded: false });
    he.addBinding(e.nodes, "val", { label: "Nodes" }), he.addBinding(e.elements, "val", { label: "Elements" }), he.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), he.addBinding(e.faces, "val", { label: "  Caras (fill)" }), he.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), he.addBinding(e.elemColumns, "val", { label: "    Columnas" }), he.addBinding(e.elemBeams, "val", { label: "    Vigas" }), he.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), he.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), he.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), he.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), he.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), he.addBinding(e.orientations, "val", { label: "Orientations" }), he.addBinding(e.sections, "val", { label: "Sections" }), he.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), he.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), he.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), he.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), he.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const g = u.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    g.addBinding(e.supports, "val", { label: "Supports" }), g.addBinding(e.loads, "val", { label: "Loads" }), g.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), g.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const g = u.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = g, g.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), g.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), g.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), g.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), g.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), g.addBinding(no, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), g.addBinding(ks, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), g.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), g.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), g.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), g.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  r && u.addBinding(e.solids, "val", { label: "Solids" });
  const y = u.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), P = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), V = () => {
    const g = window.__hekatanClipApply;
    typeof g == "function" && g();
  };
  return y.addBinding(P, "enableX", { label: "Cortar X" }).on("change", V), y.addBinding(P, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", V), y.addBinding(P, "invertX", { label: "  invertir X" }).on("change", V), y.addBinding(P, "enableY", { label: "Cortar Y" }).on("change", V), y.addBinding(P, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", V), y.addBinding(P, "invertY", { label: "  invertir Y" }).on("change", V), y.addBinding(P, "enableZ", { label: "Cortar Z" }).on("change", V), y.addBinding(P, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", V), y.addBinding(P, "invertZ", { label: "  invertir Z" }).on("change", V), p;
}
function pa(e) {
  return { gridSize: j.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: j.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: j.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: j.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: j.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: j.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: j.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: j.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: j.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: j.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: j.state((e == null ? void 0 : e.nodes) ?? true), elements: j.state((e == null ? void 0 : e.elements) ?? true), edges: j.state((e == null ? void 0 : e.edges) ?? true), faces: j.state((e == null ? void 0 : e.faces) ?? true), elemColumns: j.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: j.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: j.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: j.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: j.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: j.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: j.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: j.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: j.state((e == null ? void 0 : e.orientations) ?? false), sections: j.state((e == null ? void 0 : e.sections) ?? true), extruded: j.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: j.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: j.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: j.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: j.state((e == null ? void 0 : e.secFloor) ?? -1), supports: j.state((e == null ? void 0 : e.supports) ?? true), loads: j.state((e == null ? void 0 : e.loads) ?? false), deformedShape: j.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: j.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: j.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: j.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: j.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: j.state((e == null ? void 0 : e.flipAxes) ?? false), solids: j.state((e == null ? void 0 : e.solids) ?? true), custom3D: j.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: j.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: j.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: j.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ua(e, l, r) {
  const p = dn(), u = new Qn(new Ce(), new jn({ color: p.nodePoint }));
  return xs((w, f) => {
    u.material.color.setHex(f.nodePoint);
  }), u.frustumCulled = false, j.derive(() => {
    e.nodes.val && u.geometry.setAttribute("position", new kt(l.val.flat(), 3));
  }), j.derive(() => {
    if (r.val, l.val, !e.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let f = e.gridSize.val * 0.5;
    if (w.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
      for (const V of w) for (let g = 0; g < 3; g++) y[g] = Math.min(y[g], V[g]), P[g] = Math.max(P[g], V[g]);
      f = Math.max(P[0] - y[0], P[1] - y[1], P[2] - y[2], 0.1);
    }
    const b = 0.03 * f;
    u.material.size = b * r.rawVal;
  }), j.derive(() => {
    u.visible = e.nodes.val;
  }), u;
}
function zo(e, l) {
  const r = dn(), p = new lt();
  p.name = "hekatan-grid";
  const u = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, f = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), f <= 0 && (f = 0.1); e / f > 500; ) f *= 2;
  for (; e / w > 100; ) w *= 2;
  const b = e / 2;
  w = Math.max(f, Math.round(w / f) * f);
  const P = new Ht(r.grid).multiplyScalar(1.3), V = new Ht(r.grid).multiplyScalar(0.8), g = (re, I, ce, B) => {
    const de = [], ae = re === "xy" ? (C, N) => [C, N, 0] : re === "xz" ? (C, N) => [C, 0, N] : (C, N) => [0, C, N], R = Math.floor(b / I);
    for (let C = -R; C <= R; C++) {
      const N = C * I, T = ae(N, -b), L = ae(N, b);
      de.push(...T, ...L);
    }
    for (let C = -R; C <= R; C++) {
      const N = C * I, T = ae(-b, N), L = ae(b, N);
      de.push(...T, ...L);
    }
    const A = new Ce();
    A.setAttribute("position", new kt(de, 3));
    const X = new ht({ color: ce, transparent: true, opacity: B, depthWrite: false }), F = new Wt(A, X);
    return F.name = `grid-${re}-${I === f ? "minor" : "major"}`, F;
  }, O = (re, I, ce) => {
    const B = re === "xy" ? (F, C) => [F, C, 0] : re === "xz" ? (F, C) => [F, 0, C] : (F, C) => [0, F, C], de = [[-b, -b], [b, -b], [b, b], [-b, b]], ae = [];
    for (const [F, C] of de) ae.push(...B(F, C));
    const R = new Ce();
    R.setAttribute("position", new kt(ae, 3));
    const A = new ht({ color: I, transparent: true, opacity: ce, depthWrite: false }), X = new gs(R, A);
    return X.name = `grid-${re}-border`, X.renderOrder = 1, X;
  }, he = (re, I, ce) => {
    const B = re === "xy" ? (A, X) => [A, X, 0] : re === "xz" ? (A, X) => [A, 0, X] : (A, X) => [0, A, X], de = I === "u" ? [...B(-b, 0), ...B(b, 0)] : [...B(0, -b), ...B(0, b)], ae = new Ce();
    ae.setAttribute("position", new kt(de, 3));
    const R = new Wt(ae, new ht({ color: ce, transparent: true, opacity: 0.45, depthWrite: false }));
    return R.name = `grid-${re}-eje-${I}`, R.renderOrder = 1, R;
  }, be = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const re of u) {
    p.add(g(re, f, V, 0.12)), p.add(g(re, w, P, 0.4));
    const [I, ce] = be[re];
    p.add(he(re, "u", I)), p.add(he(re, "v", ce)), p.add(O(re, P, 0.55));
  }
  return p.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: f, gridSize: e, planes: [...u] }, p;
}
function fa(e, l, r, p) {
  const u = new lt(), w = new Ws(0.5, 0.5, 0.5), f = new Js(0.45, 0.7, 4);
  f.rotateX(Math.PI / 2), f.translate(0, 0, -0.35);
  const b = new ft({ color: 10166822 }), y = new ft({ color: 2792847 }), P = new ft({ color: 3835647 }), V = () => {
    const he = r.rawVal ?? [];
    if (he.length < 2) return l.gridSize.val * 0.5;
    let be = [1 / 0, 1 / 0, 1 / 0], re = [-1 / 0, -1 / 0, -1 / 0];
    for (const I of he) for (let ce = 0; ce < 3; ce++) I[ce] < be[ce] && (be[ce] = I[ce]), I[ce] > re[ce] && (re[ce] = I[ce]);
    return Math.max(re[0] - be[0], re[1] - be[1], re[2] - be[2], 0.1);
  }, g = () => 0.08 * V(), O = () => p.rawVal;
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    u.clear();
    const he = g();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((be, re) => {
      const I = r.val[re];
      if (!I) return;
      const ce = be ?? [], B = (ce[0] ? 1 : 0) + (ce[1] ? 1 : 0) + (ce[2] ? 1 : 0), de = (ce[3] ? 1 : 0) + (ce[4] ? 1 : 0) + (ce[5] ? 1 : 0);
      let ae;
      B >= 3 && de >= 3 ? ae = new rt(w, b) : B >= 3 && de === 0 ? ae = new rt(f, y) : ae = new rt(f, P), ae.position.set(I[0], I[1], I[2]);
      const R = he * O();
      ae.scale.set(R, R, R), u.add(ae);
    });
  }), j.derive(() => {
    if (p.val, !l.supports.rawVal) return;
    const be = g() * O();
    u.children.forEach((re) => re.scale.set(be, be, be));
  }), j.derive(() => {
    u.visible = l.supports.val;
  }), u;
}
function ha(e, l, r, p) {
  const u = new lt();
  u.name = "loadsGroup";
  function w(f) {
    if (f.length < 2) return 0.12 * l.gridSize.rawVal;
    const b = [1 / 0, 1 / 0, 1 / 0], y = [-1 / 0, -1 / 0, -1 / 0];
    for (const V of f) for (let g = 0; g < 3; g++) b[g] = Math.min(b[g], V[g]), y[g] = Math.max(y[g], V[g]);
    return 0.08 * Math.max(y[0] - b[0], y[1] - b[1], y[2] - b[2], 0.1);
  }
  return j.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    u.children.forEach((g) => g.dispose()), u.clear();
    const f = r.val, b = w(f), y = 240, P = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((g, O) => {
      f[O] && g.slice(0, 3).some((he) => Math.abs(he) > 1e-15) && P.push(O);
    });
    let V = P;
    if (P.length > y) {
      const g = P.map((F) => f[F][0]), O = P.map((F) => f[F][1]), he = Math.min(...g), be = Math.max(...g), re = Math.min(...O), I = Math.max(...O), ce = P.map((F) => f[F][2]), B = Math.max(1e-6, (Math.max(...ce) - Math.min(...ce)) / 40), de = (F) => Math.round(F / B), ae = new Set(ce.map(de)), R = Math.max(4, Math.floor(y / Math.max(1, ae.size))), A = Math.max(2, Math.round(Math.sqrt(R))), X = /* @__PURE__ */ new Map();
      for (const F of P) {
        const C = be - he < 1e-9 ? 0 : (f[F][0] - he) / (be - he), N = I - re < 1e-9 ? 0 : (f[F][1] - re) / (I - re), T = Math.min(A - 1, Math.floor(C * A)), L = Math.min(A - 1, Math.floor(N * A)), te = `${T},${L},${de(f[F][2])}`, se = Math.hypot(C * A - (T + 0.5), N * A - (L + 0.5)), le = X.get(te);
        (!le || se < le.d) && X.set(te, { i: F, d: se });
      }
      V = [...X.values()].map((F) => F.i);
    }
    for (const g of V) {
      const O = e.nodeInputs.val.loads.get(g), he = f[g];
      if (!he) continue;
      const be = new k(...O.slice(0, 3));
      if (be.lengthSq() < 1e-30) continue;
      be.normalize();
      const re = new cn(be, new k(...he), 1, 15637248, 0.3, 0.3), I = b * p.rawVal;
      re.scale.set(I, I, I), u.add(re);
    }
  }), j.derive(() => {
    if (p.val, !l.loads.rawVal) return;
    const b = w(r.rawVal) * p.rawVal;
    u.children.forEach((y) => y.scale.set(b, b, b));
  }), j.derive(() => {
    u.visible = l.loads.val;
  }), u;
}
function ma(e, l, r) {
  const p = new lt();
  return j.derive(() => {
    if (!e.nodesIndexes.val) return;
    p.children.forEach((w) => w.dispose()), p.clear();
    const u = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((w, f) => {
      const b = new Ct(`${f}`);
      b.position.set(...w), b.updateScale(u * r.rawVal), p.add(b);
    });
  }), j.derive(() => {
    if (r.val, !e.nodesIndexes.rawVal) return;
    const u = 0.05 * e.gridSize.val * 0.6;
    p.children.forEach((w) => w.updateScale(u * r.rawVal));
  }), j.derive(() => {
    p.visible = e.nodesIndexes.val;
  }), p;
}
function wa(e, l, r, p) {
  const u = new lt();
  return j.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    u.children.forEach((f) => f.dispose()), u.clear();
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((f, b) => {
      const y = new Ct(`${b}`, void 0, "#001219");
      y.position.set(...ya(f.map((P) => r.rawVal[P]))), y.updateScale(w * p.rawVal), u.add(y);
    });
  }), j.derive(() => {
    if (p.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    u.children.forEach((f) => f.updateScale(w * p.rawVal));
  }), j.derive(() => {
    u.visible = l.elementsIndexes.val;
  }), u;
}
function ya(e) {
  const l = e.reduce((p, u) => [p[0] + u[0], p[1] + u[1], p[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function us(e, l) {
  const r = new lt(), p = Math.min(0.05 * e, 0.6), u = dn(), w = new Ct("X", "red", "transparent"), f = new Ct(l ? "Z" : "Y", "green", "transparent"), b = new Ct(l ? "Y" : "Z", "blue", "transparent"), y = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), P = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), V = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * p, 0, 0), f.position.set(0, 1.3 * p, 0), b.position.set(0, 0, 1.3 * p), w.updateScale(0.4 * p), f.updateScale(0.4 * p), b.updateScale(0.4 * p), y.scale.set(p, p, p), P.scale.set(p, p, p), V.scale.set(p, p, p), r.add(y, P, V, w, f, b), r;
}
function oo(e, l) {
  const r = new k(...e), u = new k(...l).clone().sub(r), w = u.length(), f = u.dot(new k(1, 0, 0)) / w, b = u.dot(new k(0, 1, 0)) / w, y = u.dot(new k(0, 0, 1)) / w, P = Math.sqrt(f ** 2 + b ** 2);
  let V = new ko().fromArray([[f, b, y], [-b / P, f / P, 0], [-f * y / P, -b * y / P, P]].flat());
  return y === 1 && (V = new ko().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), y === -1 && (V = new ko().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Vo().setFromMatrix3(V);
}
function Ao(e, l) {
  return e == null ? void 0 : e.map((r, p) => (9 * r + l[p]) / 10);
}
function Vn(e) {
  const l = e.reduce((p, u) => [p[0] + u[0], p[1] + u[1], p[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function xa(e, l, r) {
  const p = Vn([l, r]), u = Vn([e, r]), w = Vn([e, l]), f = new k(...p).sub(new k(...u)).normalize(), b = new k(...r).sub(new k(...w)).normalize(), y = f.clone().cross(b).normalize(), P = y.clone().cross(f).normalize();
  return new Vo().makeBasis(f, P, y);
}
function ga(e, l, r, p) {
  const u = new lt(), w = new Ce(), f = new ht({ vertexColors: true }), b = [0, 0, 0], y = [1, 0, 0], P = [0, 1, 0], V = [0, 0, 1];
  w.setAttribute("position", new kt([...b, ...y, ...b, ...P, ...b, ...V], 3));
  const g = [255, 0, 0], O = [0, 255, 0], he = [0, 0, 255];
  return w.setAttribute("color", new kt([...g, ...g, ...O, ...O, ...he, ...he], 3)), j.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (u.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((be) => {
      const re = new Wt(w, f), I = r.rawVal[be[0]], ce = r.rawVal[be[1]];
      if (be.length === 2 && (re.position.set(...Ao(I, ce)), re.rotation.setFromRotationMatrix(oo(I, ce))), be.length === 3) {
        const ae = r.rawVal[be[2]];
        re.position.set(...Vn([I, ce, ae])), re.rotation.setFromRotationMatrix(xa(I, ce, ae));
      }
      const de = 0.05 * l.gridSize.rawVal * 0.75 * p.rawVal;
      re.scale.set(de, de, de), u.add(re);
    }));
  }), j.derive(() => {
    if (p.val, !l.orientations.rawVal) return;
    const re = 0.05 * l.gridSize.val * 0.75 * p.rawVal;
    u.children.forEach((I) => I.scale.set(re, re, re));
  }), j.derive(() => {
    u.visible = l.orientations.val;
  }), u;
}
function va(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), r = (e.h * 100).toFixed(0);
    return `${l}x${r}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ba(e, l, r, p) {
  const u = new lt(), w = new lt();
  u.add(w);
  function f(A, X) {
    const F = A / 2, C = X / 2, N = new Float32Array([0, -F, -C, 0, F, -C, 0, F, C, 0, -F, -C, 0, F, C, 0, -F, C]), T = new Ce();
    T.setAttribute("position", new wt(N, 3));
    const L = new Float32Array([0, -F, -C, 0, F, -C, 0, F, C, 0, -F, C, 0, -F, -C]), te = new Ce();
    return te.setAttribute("position", new wt(L, 3)), { fill: T, outline: te };
  }
  function b(A, X = 24) {
    const F = A / 2, C = new Float32Array(X * 9);
    for (let te = 0; te < X; te++) {
      const se = te / X * Math.PI * 2, le = (te + 1) / X * Math.PI * 2;
      C[te * 9] = 0, C[te * 9 + 1] = 0, C[te * 9 + 2] = 0, C[te * 9 + 3] = 0, C[te * 9 + 4] = F * Math.cos(se), C[te * 9 + 5] = F * Math.sin(se), C[te * 9 + 6] = 0, C[te * 9 + 7] = F * Math.cos(le), C[te * 9 + 8] = F * Math.sin(le);
    }
    const N = new Ce();
    N.setAttribute("position", new wt(C, 3));
    const T = new Float32Array((X + 1) * 3);
    for (let te = 0; te <= X; te++) {
      const se = te / X * Math.PI * 2;
      T[te * 3] = 0, T[te * 3 + 1] = F * Math.cos(se), T[te * 3 + 2] = F * Math.sin(se);
    }
    const L = new Ce();
    return L.setAttribute("position", new wt(T, 3)), { fill: N, outline: L };
  }
  function y(A, X, F, C) {
    const N = F ?? X * 0.08, T = C ?? A * 0.07, L = A / 2, te = X / 2, se = te - N, le = T / 2, ne = [];
    function D(we, Fe, Me, Ie) {
      ne.push(0, we, Fe, 0, Me, Fe, 0, Me, Ie, 0, we, Fe, 0, Me, Ie, 0, we, Ie);
    }
    D(-L, -te, L, -se), D(-le, -se, le, se), D(-L, se, L, te);
    const pe = new Ce();
    pe.setAttribute("position", new wt(new Float32Array(ne), 3));
    const W = new Float32Array([0, -L, -te, 0, L, -te, 0, L, -se, 0, le, -se, 0, le, se, 0, L, se, 0, L, te, 0, -L, te, 0, -L, se, 0, -le, se, 0, -le, -se, 0, -L, -se, 0, -L, -te]), me = new Ce();
    return me.setAttribute("position", new wt(W, 3)), { fill: pe, outline: me };
  }
  function P(A, X, F) {
    const C = A / 2, N = X / 2, T = C - F, L = N - F, te = [];
    function se(pe, W, me, we) {
      te.push(0, pe, W, 0, me, W, 0, me, we, 0, pe, W, 0, me, we, 0, pe, we);
    }
    se(-C, -N, C, -L), se(-C, L, C, N), se(-C, -L, -T, L), se(T, -L, C, L);
    const le = new Ce();
    le.setAttribute("position", new wt(new Float32Array(te), 3));
    const ne = new Float32Array([0, -C, -N, 0, C, -N, 0, C, -N, 0, C, N, 0, C, N, 0, -C, N, 0, -C, N, 0, -C, -N, 0, -T, -L, 0, T, -L, 0, T, -L, 0, T, L, 0, T, L, 0, -T, L, 0, -T, L, 0, -T, -L]), D = new Ce();
    return D.setAttribute("position", new wt(ne, 3)), { fill: le, outline: D };
  }
  function V(A, X, F) {
    const C = A / 2, N = X / 2, T = C - F, L = N - F, te = new Ce(), se = new Float32Array([0, -T, -L, 0, T, -L, 0, T, L, 0, -T, -L, 0, T, L, 0, -T, L]);
    te.setAttribute("position", new wt(se, 3));
    const le = [];
    function ne(me, we, Fe, Me) {
      le.push(0, me, we, 0, Fe, we, 0, Fe, Me, 0, me, we, 0, Fe, Me, 0, me, Me);
    }
    ne(-C, -N, C, -L), ne(-C, L, C, N), ne(-C, -L, -T, L), ne(T, -L, C, L);
    const D = new Ce();
    D.setAttribute("position", new wt(new Float32Array(le), 3));
    const pe = new Float32Array([0, -C, -N, 0, C, -N, 0, C, -N, 0, C, N, 0, C, N, 0, -C, N, 0, -C, N, 0, -C, -N, 0, -T, -L, 0, T, -L, 0, T, -L, 0, T, L, 0, T, L, 0, -T, L, 0, -T, L, 0, -T, -L]), W = new Ce();
    return W.setAttribute("position", new wt(pe, 3)), { concFill: te, steelFillGeom: D, outline: W };
  }
  function g(A, X, F) {
    const C = [], N = [[0, -A / 2, -X / 2], [0, -A / 2 + F, -X / 2], [0, -A / 2 + F, X / 2 - F], [0, A / 2, X / 2 - F], [0, A / 2, X / 2], [0, -A / 2, X / 2]], T = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const le of T) C.push(...N[le]);
    const L = new Ce();
    L.setAttribute("position", new wt(new Float32Array(C), 3));
    const te = [];
    for (let le = 0; le < N.length; le++) {
      const ne = (le + 1) % N.length;
      te.push(...N[le], ...N[ne]);
    }
    const se = new Ce();
    return se.setAttribute("position", new wt(new Float32Array(te), 3)), { fill: L, outline: se };
  }
  function O(A, X, F, C) {
    const N = C / 2, T = [], L = [[0, -A - N, -X / 2], [0, -F - N, -X / 2], [0, -F - N, X / 2 - F], [0, -N, X / 2 - F], [0, -N, X / 2], [0, -A - N, X / 2]], te = [[0, N, -X / 2], [0, N + F, -X / 2], [0, N + F, X / 2 - F], [0, A + N, X / 2 - F], [0, A + N, X / 2], [0, N, X / 2]], se = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of se) T.push(...L[pe]);
    for (const pe of se) T.push(...te[pe]);
    const le = new Ce();
    le.setAttribute("position", new wt(new Float32Array(T), 3));
    const ne = [];
    for (const pe of [L, te]) for (let W = 0; W < pe.length; W++) {
      const me = (W + 1) % pe.length;
      ne.push(...pe[W], ...pe[me]);
    }
    const D = new Ce();
    return D.setAttribute("position", new wt(new Float32Array(ne), 3)), { fill: le, outline: D };
  }
  function he(A, X, F, C) {
    const N = X / 2, T = A, L = [[0, -T, -N], [0, -T, -N + F], [0, -C, -N + F], [0, -C, N - F], [0, -T, N - F], [0, -T, N], [0, 0, N], [0, 0, -N]], te = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], se = [];
    for (const pe of te) se.push(...L[pe]);
    const le = new Ce();
    le.setAttribute("position", new wt(new Float32Array(se), 3));
    const ne = [];
    for (let pe = 0; pe < L.length; pe++) {
      const W = (pe + 1) % L.length;
      ne.push(...L[pe], ...L[W]);
    }
    const D = new Ce();
    return D.setAttribute("position", new wt(new Float32Array(ne), 3)), { fill: le, outline: D };
  }
  function be(A, X, F, C, N) {
    const T = X / 2, L = N / 2, te = [], se = [[0, -A, -T], [0, -A, -T + F], [0, -L - C, -T + F], [0, -L - C, T - F], [0, -A, T - F], [0, -A, T], [0, -L, T], [0, -L, -T]], le = se.map((me) => [me[0], -me[1], me[2]]), ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const me of ne) te.push(...se[me]);
    for (const me of ne) te.push(...le[me]);
    const D = new Ce();
    D.setAttribute("position", new wt(new Float32Array(te), 3));
    const pe = [];
    for (const me of [se, le]) for (let we = 0; we < me.length; we++) {
      const Fe = (we + 1) % me.length;
      pe.push(...me[we], ...me[Fe]);
    }
    const W = new Ce();
    return W.setAttribute("position", new wt(new Float32Array(pe), 3)), { fill: D, outline: W };
  }
  function re(A, X, F, C) {
    const N = A / 2, T = X / 2, L = C / 2, te = [[0, -L, -T], [0, L, -T], [0, L, T - F], [0, N, T - F], [0, N, T], [0, -N, T], [0, -N, T - F], [0, -L, T - F]], se = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], le = [];
    for (const W of se) le.push(...te[W]);
    const ne = new Ce();
    ne.setAttribute("position", new wt(new Float32Array(le), 3));
    const D = [];
    for (let W = 0; W < te.length; W++) {
      const me = (W + 1) % te.length;
      D.push(...te[W], ...te[me]);
    }
    const pe = new Ce();
    return pe.setAttribute("position", new wt(new Float32Array(D), 3)), { fill: ne, outline: pe };
  }
  function I(A, X, F = 24) {
    const C = A / 2, N = C - X, T = [];
    for (let le = 0; le < F; le++) {
      const ne = le / F * Math.PI * 2, D = (le + 1) / F * Math.PI * 2, pe = Math.cos(ne), W = Math.sin(ne), me = Math.cos(D), we = Math.sin(D);
      T.push(0, C * pe, C * W, 0, C * me, C * we, 0, N * me, N * we), T.push(0, C * pe, C * W, 0, N * me, N * we, 0, N * pe, N * W);
    }
    const L = new Ce();
    L.setAttribute("position", new wt(new Float32Array(T), 3));
    const te = [];
    for (let le = 0; le < F; le++) {
      const ne = le / F * Math.PI * 2, D = (le + 1) / F * Math.PI * 2;
      te.push(0, C * Math.cos(ne), C * Math.sin(ne), 0, C * Math.cos(D), C * Math.sin(D)), te.push(0, N * Math.cos(ne), N * Math.sin(ne), 0, N * Math.cos(D), N * Math.sin(D));
    }
    const se = new Ce();
    return se.setAttribute("position", new wt(new Float32Array(te), 3)), { fill: L, outline: se };
  }
  const ce = new ft({ color: 52479, transparent: true, opacity: 0.35, side: zt, depthWrite: false }), B = new ht({ color: 52479 }), de = new ft({ color: 16750848, transparent: true, opacity: 0.4, side: zt, depthWrite: false }), ae = new ht({ color: 16750848 });
  function R(A, X) {
    const F = Math.abs(X[0] - A[0]), C = Math.abs(X[1] - A[1]), N = Math.abs(X[2] - A[2]);
    return N > F && N > C || C > F && C > N;
  }
  return j.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const A = l.secColumns.rawVal, X = l.secBeams.rawVal;
    if (!A && !X) {
      u.children.forEach((L) => {
        L instanceof Ct && L.dispose();
      }), u.clear();
      return;
    }
    u.children.forEach((L) => {
      L instanceof Ct && L.dispose();
    }), u.clear();
    const F = (_a2 = e.elements) == null ? void 0 : _a2.val, C = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!F || !C) return;
    const N = C.sectionShapes, T = l.secFloor.rawVal;
    F.forEach((L, te) => {
      if (L.length !== 2) return;
      const se = r.rawVal[L[0]], le = r.rawVal[L[1]];
      if (!se || !le) return;
      const ne = R(se, le);
      if (ne && !A || !ne && !X) return;
      if (T >= 0) {
        const we = Math.min(se[1], le[1]);
        Math.max(se[1], le[1]);
        const Fe = l.gridSize.rawVal || 3;
        if (Math.floor(we / Fe + 0.01) !== T) return;
      }
      const D = N == null ? void 0 : N.get(te);
      if (!D) return;
      const pe = [(se[0] + le[0]) / 2, (se[1] + le[1]) / 2, (se[2] + le[2]) / 2], W = oo(se, le);
      if (D.type === "CFT") {
        const we = V(D.b, D.h, D.tw ?? D.b * 0.05), Fe = new rt(we.concFill, ce);
        Fe.position.set(...pe), Fe.rotation.setFromRotationMatrix(W), u.add(Fe);
        const Me = new rt(we.steelFillGeom, de);
        Me.position.set(...pe), Me.rotation.setFromRotationMatrix(W), u.add(Me);
        const Ie = new Pt(we.outline, ae);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(W), u.add(Ie);
      } else {
        let we, Fe, Me;
        switch (D.type) {
          case "rect":
            we = f(D.b, D.h), Fe = ce, Me = B;
            break;
          case "circ":
            we = b(D.d), Fe = ce, Me = B;
            break;
          case "I":
            we = y(D.b, D.h, D.tf, D.tw), Fe = de, Me = ae;
            break;
          case "HSS":
            we = P(D.b, D.h, D.tw ?? D.b * 0.05), Fe = de, Me = ae;
            break;
          case "CFT":
            we = V(D.b, D.h, D.tw ?? D.b * 0.05), Fe = de, Me = ae;
            break;
          case "L":
            we = g(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3), Fe = de, Me = ae;
            break;
          case "2L":
            we = O(D.b ?? D.h, D.h, D.t ?? D.tw ?? 3e-3, D.dis ?? 0.01), Fe = de, Me = ae;
            break;
          case "C":
          case "coldC":
            we = he(D.b, D.h, D.tf ?? D.t ?? 3e-3, D.tw ?? D.t ?? 3e-3), Fe = de, Me = ae;
            break;
          case "2C":
            we = be(D.b, D.h, D.tf ?? 5e-3, D.tw ?? 5e-3, D.dis ?? 0.01), Fe = de, Me = ae;
            break;
          case "T":
            we = re(D.b, D.h, D.tf ?? 0.01, D.tw ?? 6e-3), Fe = de, Me = ae;
            break;
          case "pipe":
            we = I(D.d, D.tw ?? D.d * 0.05), Fe = de, Me = ae;
            break;
          default:
            return;
        }
        const Ie = new rt(we.fill, Fe);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(W), u.add(Ie);
        const Ne = new Pt(we.outline, Me);
        Ne.position.set(...pe), Ne.rotation.setFromRotationMatrix(W), u.add(Ne);
      }
      const me = va(D);
      if (me) {
        const Fe = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(D.type) ? "#ff9900" : "#00ccff", Me = new Ct(me, Fe, "transparent");
        Me.position.set(pe[0], pe[1], pe[2]);
        const Ie = 0.05 * l.gridSize.rawVal * 0.5;
        Me.updateScale(Ie * ((p == null ? void 0 : p.rawVal) ?? 1)), w.add(Me);
      }
    });
  }), p && j.derive(() => {
    if (p.val, !l.sections.rawVal) return;
    const A = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((X) => {
      X instanceof Ct && X.updateScale(A * p.rawVal);
    });
  }), j.derive(() => {
    u.visible = l.sections.val;
  }), j.derive(() => {
    w.visible = l.sectionLabels.val;
  }), u;
}
function Ma(e) {
  if (!e) return null;
  const l = e.type, r = (V, g) => [V, g], p = (V, g) => [r(-V / 2, -g / 2), r(V / 2, -g / 2), r(V / 2, g / 2), r(-V / 2, g / 2)], u = (V, g = 24) => {
    const O = V / 2, he = [];
    for (let be = 0; be < g; be++) {
      const re = 2 * Math.PI * be / g;
      he.push(r(O * Math.cos(re), O * Math.sin(re)));
    }
    return he;
  }, w = e.b ?? 0, f = e.h ?? 0, b = e.d ?? 0, y = e.tw ?? e.t ?? 0, P = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return w && f ? { contorno: p(w, f) } : null;
    case "circ":
      return b ? { contorno: u(b) } : null;
    case "pipe":
      return b && y ? { contorno: u(b), huecos: [u(b - 2 * y).reverse()] } : null;
    case "HSS":
      return w && f && y ? { contorno: p(w, f), huecos: [p(w - 2 * y, f - 2 * (P || y)).reverse()] } : null;
    case "CFT":
      return w && f ? { contorno: p(w, f) } : null;
    case "I":
      return w && f && y && P ? { contorno: [r(-w / 2, -f / 2), r(w / 2, -f / 2), r(w / 2, -f / 2 + P), r(y / 2, -f / 2 + P), r(y / 2, f / 2 - P), r(w / 2, f / 2 - P), r(w / 2, f / 2), r(-w / 2, f / 2), r(-w / 2, f / 2 - P), r(-y / 2, f / 2 - P), r(-y / 2, -f / 2 + P), r(-w / 2, -f / 2 + P)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && f && y && P ? { contorno: [r(-w / 2, -f / 2), r(w / 2, -f / 2), r(w / 2, -f / 2 + P), r(-w / 2 + y, -f / 2 + P), r(-w / 2 + y, f / 2 - P), r(w / 2, f / 2 - P), r(w / 2, f / 2), r(-w / 2, f / 2)] } : null;
    case "T":
      return w && f && y && P ? { contorno: [r(-y / 2, -f / 2), r(y / 2, -f / 2), r(y / 2, f / 2 - P), r(w / 2, f / 2 - P), r(w / 2, f / 2), r(-w / 2, f / 2), r(-w / 2, f / 2 - P), r(-y / 2, f / 2 - P)] } : null;
    case "L":
    case "2L":
      return w && f && y ? { contorno: [r(-w / 2, -f / 2), r(w / 2, -f / 2), r(w / 2, -f / 2 + y), r(-w / 2 + y, -f / 2 + y), r(-w / 2 + y, f / 2), r(-w / 2, f / 2)] } : null;
    default:
      return w && f ? { contorno: p(w, f) } : b ? { contorno: u(b) } : null;
  }
}
function _a(e, l, r) {
  if (!e || e <= 0 || !l || !r || l <= 0 || r <= 0) return null;
  const p = Math.sqrt(Math.sqrt(r / l)), u = Math.sqrt(e / p), w = e / u;
  return !isFinite(u) || !isFinite(w) || u <= 0 || w <= 0 ? null : { contorno: [[-u / 2, -w / 2], [u / 2, -w / 2], [u / 2, w / 2], [-u / 2, w / 2]] };
}
function ka(e) {
  const l = new En();
  e.contorno.forEach(([r, p], u) => u ? l.lineTo(r, p) : l.moveTo(r, p)), l.closePath();
  for (const r of e.huecos ?? []) {
    const p = new Qs();
    r.forEach(([u, w], f) => f ? p.lineTo(u, w) : p.moveTo(u, w)), p.closePath(), l.holes.push(p);
  }
  return l;
}
function Sa(e, l, r) {
  const p = new lt();
  p.name = "extrusion";
  const u = new So({ color: 8369151, transparent: true, opacity: 0.92, side: zt }), w = new So({ color: 12623968, transparent: true, opacity: 0.85, side: zt }), f = new So({ color: 11583173, transparent: true, opacity: 0.85, side: zt }), b = new lt();
  b.add(new vs(16777215, 0.55));
  const y = new to(16777215, 0.75);
  y.position.set(30, 25, 40);
  const P = new to(16777215, 0.35);
  P.position.set(-25, -20, 15), b.add(y, P);
  let V = 0;
  return j.derive(() => {
    var _a2, _b, _c, _d, _e;
    const g = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++V, on: g }, p.visible = g;
    for (const B of [...p.children]) B !== b && (p.remove(B), (_c = (_b = B.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (p.children.includes(b) || p.add(b), !g) return;
    const O = r.val ?? [], he = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], be = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, re = be.sectionShapes ?? /* @__PURE__ */ new Map(), I = be.thicknesses ?? /* @__PURE__ */ new Map();
    let ce = "";
    try {
      he.forEach((B, de) => {
        var _a3, _b2, _c2;
        if (B.length === 2) {
          let ae = Ma(re.get(de)), R = true;
          if (ae || (ae = _a((_a3 = be.areas) == null ? void 0 : _a3.get(de), (_b2 = be.momentsOfInertiaY) == null ? void 0 : _b2.get(de), (_c2 = be.momentsOfInertiaZ) == null ? void 0 : _c2.get(de)), R = false), !ae) return;
          const A = O[B[0]], X = O[B[1]];
          if (!A || !X) return;
          const F = Math.hypot(X[0] - A[0], X[1] - A[1], X[2] - A[2]);
          if (F < 1e-9) return;
          const C = new Os(ka(ae), { depth: F, bevelEnabled: false, curveSegments: 4 });
          C.applyMatrix4(new Vo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const N = new rt(C, R ? u : w);
          N.position.set(A[0], A[1], A[2]), N.rotation.setFromRotationMatrix(oo(A, X)), p.add(N);
          return;
        }
        if (B.length === 3 || B.length === 4) {
          const ae = I.get(de);
          if (!ae || ae <= 0) return;
          const R = B.map((W) => O[W]).filter(Boolean);
          if (R.length < 3) return;
          const A = [R[1][0] - R[0][0], R[1][1] - R[0][1], R[1][2] - R[0][2]], X = [R[2][0] - R[0][0], R[2][1] - R[0][1], R[2][2] - R[0][2]], F = A[1] * X[2] - A[2] * X[1], C = A[2] * X[0] - A[0] * X[2], N = A[0] * X[1] - A[1] * X[0], T = Math.hypot(F, C, N);
          if (T < 1e-12) return;
          const L = [F / T, C / T, N / T], te = [], se = (W) => R.map((me) => [me[0] + L[0] * W, me[1] + L[1] * W, me[2] + L[2] * W]), le = se(+ae / 2), ne = se(-ae / 2), D = (W, me, we) => te.push(...W, ...me, ...we);
          for (const W of [le, ne]) D(W[0], W[1], W[2]), W.length === 4 && D(W[0], W[2], W[3]);
          for (let W = 0; W < R.length; W++) {
            const me = (W + 1) % R.length;
            D(le[W], ne[W], ne[me]), D(le[W], ne[me], le[me]);
          }
          const pe = new Ce();
          pe.setAttribute("position", new kt(te, 3)), pe.computeVertexNormals(), p.add(new rt(pe, f));
        }
      });
    } catch (B) {
      ce = String((B == null ? void 0 : B.message) ?? B);
    }
    globalThis.__extrusionDebug = { corridas: V, on: g, fallo: ce, nElementos: he.length, nFormas: re.size, nEspesores: I.size, mallas: p.children.length - 1 };
  }), p;
}
class Wn extends lt {
  constructor(l, r, p, u, w, f, b) {
    super();
    const y = new En().moveTo(0, 0).lineTo(0, f[1]).lineTo(p, f[1]).lineTo(p, 0).lineTo(0, 0), P = y.getPoints(), V = new Ce().setFromPoints(P);
    this.lines = new Pt(V, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const g = new eo(y), O = new ft({ color: f[1] > 0 ? 24435 : 11411474, side: zt });
    this.mesh = new rt(g, O), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Ct(`${w[1].toFixed(4)}`), this.normalizedResult = f, this.textPosition = Vn([l, r]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(u), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class fs extends lt {
  constructor(l, r, p, u, w, f, b) {
    super();
    const y = w[0] * p / (w[0] + w[1]), P = w[0] * w[1] > 0;
    if (this.text = new Ct(`${w[0].toFixed(4)}`), this.text2 = new Ct(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = f, this.textPosition = Ao(l, r), this.text2Position = Ao(r, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(u), this.text2.rotation.setFromRotationMatrix(u), this.add(this.text, this.text2), P) {
      const V = new En().moveTo(0, 0).lineTo(0, f[0]).lineTo(y, 0).lineTo(0, 0), g = new En().moveTo(y, 0).lineTo(p, -f[1]).lineTo(p, 0).lineTo(y, 0), O = V.getPoints(), he = g.getPoints(), be = new Ce().setFromPoints(O), re = new Ce().setFromPoints(he), I = new ht({ color: dn().resultOutline });
      this.lines = new Pt(be, I), this.lines2 = new Pt(re, I), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), this.lines2.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), b && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ce = new eo(V), B = new eo(g), de = new ft({ color: f[0] > 0 ? 24435 : 11411474, side: zt }), ae = new ft({ color: -f[1] > 0 ? 24435 : 11411474, side: zt });
      this.mesh = new rt(ce, de), this.mesh2 = new rt(B, ae), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), this.mesh2.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), b && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const V = new En().moveTo(0, 0).lineTo(0, f[0]).lineTo(p, -f[1]).lineTo(p, 0).lineTo(0, 0), g = V.getPoints(), O = new Ce().setFromPoints(g);
      this.lines = new Pt(O, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const he = new eo(V), be = new ft({ color: f[0] > 0 ? 24435 : 11411474, side: zt });
      this.mesh = new rt(he, be), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
function Pa(e, l, r, p) {
  const u = () => {
    const b = r.rawVal;
    if (!(b == null ? void 0 : b.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
    for (const g of b) for (let O = 0; O < 3; O++) g[O] < y[O] && (y[O] = g[O]), g[O] > P[O] && (P[O] = g[O]);
    const V = Math.hypot(P[0] - y[0], P[1] - y[1], P[2] - y[2]);
    return !isFinite(V) || V <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * V;
  }, w = new lt(), f = { normals: Wn, shearsY: Wn, shearsZ: Wn, torsions: Wn, bendingsY: fs, bendingsZ: fs };
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, r.val, l.frameResults.val == "none") return;
    w.children.forEach((y) => y.dispose()), w.clear();
    const b = Ps[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[b]) == null ? void 0 : _b.forEach((y, P) => {
      var _a3, _b2;
      const V = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[P]) ?? [0, 1], g = r.rawVal[V[0]], O = r.rawVal[V[1]];
      if (!g || !O) return;
      const he = new k(...O).distanceTo(new k(...g)), be = Ca((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[b]), re = y == null ? void 0 : y.map((B) => B / (be === 0 ? 1 : be)), I = oo(g, O), ce = new f[b](g, O, he, I, y ?? [0, 0], re ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(b));
      ce.updateScale(u() * p.rawVal), w.add(ce);
    });
  }), j.derive(() => {
    if (p.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const b = u();
    w.children.forEach((y) => y.updateScale(b * p.rawVal));
  }), j.derive(() => {
    w.visible = l.frameResults.val != "none";
  }), w;
}
function Ca(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((r) => {
    const p = Math.max(...(r ?? [0, 0]).map((u) => Math.abs(u)));
    p > l && (l = p);
  }), l;
}
class za extends lt {
  constructor(l, r, p) {
    super();
    const u = r === $o.reactions;
    p[0] && (this.xText1 = new Ct(`${u ? "Fx" : "Dx"}: ` + p[0].toFixed(4))), p[3] && (this.xText2 = new Ct(`${u ? "Mx" : "Rx"}: ` + p[3].toFixed(4))), p[1] && (this.yText1 = new Ct(`${u ? "Fy" : "Dy"}: ` + p[1].toFixed(4))), p[4] && (this.yText2 = new Ct(`${u ? "My" : "Ry"}: ` + p[4].toFixed(4))), p[2] && (this.zText1 = new Ct(`${u ? "Fz" : "Dz"}: ` + p[2].toFixed(4))), p[5] && (this.zText2 = new Ct(`${u ? "Mz" : "Rz"}: ` + p[5].toFixed(4))), (p[0] || p[3]) && (this.xArrow = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[1] || p[4]) && (this.yArrow = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[2] || p[5]) && (this.zArrow = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
function Fa(e, l, r, p) {
  const u = new lt();
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    u.children.forEach((b) => b.dispose()), u.clear();
    const w = $o[l.nodeResults.rawVal], f = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[w]) == null ? void 0 : _b.forEach((b, y) => {
      const P = new za(r.rawVal[y], w, b ?? [0, 0, 0, 0, 0, 0]);
      P.updateScale(f * p.rawVal), u.add(P);
    });
  }), j.derive(() => {
    if (p.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    u.children.forEach((f) => f.updateScale(w * p.rawVal));
  }), j.derive(() => {
    u.visible = l.nodeResults.val != "none";
  }), u;
}
function Aa({ drawingObj: e, gridObj: l, scene: r, getActiveCamera: p, controls: u, gridSize: w, derivedDisplayScale: f, rendererElm: b, viewerRender: y }) {
  const P = new js(), V = new ea(), g = (t) => {
    const o = b.getBoundingClientRect(), s = t.clientX - o.left, n = t.clientY - o.top, a = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const h = a / 2;
      if (s >= h) return V.x = (s - h) / h * 2 - 1, V.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? p();
      V.x = s / h * 2 - 1;
    } else V.x = s / a * 2 - 1;
    return V.y = -(n / i) * 2 + 1, p();
  }, O = new rt(new en(1e4, 1e4), new ft({ side: zt, transparent: true, opacity: 0, depthWrite: false }));
  O.visible = true, O.frustumCulled = false, r.add(O);
  const he = (t, o, s) => {
    const n = new rt(new en(1e4, 1e4), new ft({ side: zt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, s), n.visible = false, n.frustumCulled = false, r.add(n), n;
  }, be = he(Math.PI / 2, 0, 0), re = he(0, Math.PI / 2, 0);
  let I = false;
  const ce = () => {
    if (I) return P.intersectObjects([O], false);
    if (be.visible = !!window.__hekatanGridPlaneXZ, re.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && fe.visible) {
      const s = P.intersectObjects([fe, Ae, Ee], false);
      if (s.length > 0) return s;
    }
    const o = [O];
    return be.visible && o.push(be), re.visible && o.push(re), Ot.visible && un.length > 0 && o.push(...un), P.intersectObjects(o, false);
  }, B = new Qn(new Ce(), new jn()), de = new Qn(new Ce(), new jn({ color: "gray", sizeAttenuation: false, size: 6 })), ae = new Qn(new Ce(), new jn({ color: "orange", sizeAttenuation: false, size: 5 }));
  r.add(ae);
  const R = document.createElement("input");
  R.id = "hk-rubber-label", R.type = "text", R.spellcheck = false, R.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, R.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(R);
  let A = null, X = null, F = false;
  const C = new k(), N = (t, o, s, n, a, i) => {
    const c = n - t, h = a - o, m = i - s, x = Math.hypot(c, h, m);
    if (x < 0.01) {
      R.style.display = "none";
      return;
    }
    A = [t, o, s], X = [c / x, h / x, m / x], C.set((t + n) / 2, (o + a) / 2, (s + i) / 2), C.project(p());
    const M = b.getBoundingClientRect(), _ = M.left + (C.x * 0.5 + 0.5) * M.width, d = M.top + (-C.y * 0.5 + 0.5) * M.height;
    if (R.style.left = _ + "px", R.style.top = d + "px", R.style.display = "block", !F) {
      if (R.value = `${x.toFixed(2)} m`, document.activeElement !== R) {
        const $ = document.activeElement;
        $ && ($.tagName === "INPUT" || $.tagName === "TEXTAREA") && $ !== R || R.focus({ preventScroll: true });
      }
      try {
        R.select();
      } catch {
      }
    }
  }, T = () => {
    R.style.display = "none", A = null, X = null, F = false, document.activeElement === R && R.blur();
  }, L = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      rn = t, ie(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), R.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ze.length === 1) {
      const M = Ze[0];
      Ze = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, M[0], M[1], M[2], t), ie(`\u2713 C\xEDrculo r=${t} m en (${M[0].toFixed(2)}, ${M[1].toFixed(2)}, ${M[2].toFixed(2)}).`);
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
      gt = t, ie(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), R.blur();
      return;
    }
    if (!A || !X || !e.polylines) return;
    let s = X[0], n = X[1], a = X[2];
    tt === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : tt === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : tt === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const i = A[0] + s * t, c = A[1] + n * t, h = A[2] + a * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, c, h]];
    const m = e.polylines.rawVal, x = m.length ? m[m.length - 1] : [];
    e.polylines.val = [...m.slice(0, -1), [...x, e.points.rawVal.length - 1]], R.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  }, te = (t) => {
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
      const a = o.split(",").map((m) => parseFloat(m.trim()));
      if (a.some(isNaN)) return null;
      const [i, c, h = 0] = a;
      return s ? { kind: "relCart", dx: i, dy: c, dz: h } : { kind: "absCart", x: i, y: c, z: h };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, se = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return A ? [A[0] + t.dx, A[1] + t.dy, A[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!A) return null;
      const o = t.ang * Math.PI / 180;
      return [A[0] + t.L * Math.cos(o), A[1] + t.L * Math.sin(o), A[2]];
    }
    if (t.kind === "relSpherical") {
      if (!A) return null;
      const o = t.az * Math.PI / 180, s = t.el * Math.PI / 180, n = t.L * Math.cos(s);
      return [A[0] + n * Math.cos(o), A[1] + n * Math.sin(o), A[2] + t.L * Math.sin(s)];
    }
    return null;
  }, le = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...s, e.points.rawVal.length - 1]], A = t, R.blur();
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
    const s = se(o);
    if (!s) return false;
    Qo(new k(s[0], s[1], s[2]), null), A = s, R.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, R.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const s = te(R.value);
      if (!s) return;
      if (F = false, s.kind === "length") L(s.L), ie(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = se(s);
        if (!n) return;
        le(n);
        const a = s.kind;
        ie(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), F = false, R.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!F && R.style.display === "block") try {
          R.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && (F = true);
  }), window.addEventListener("keydown", (t) => {
    if (!A || !X || document.activeElement === R) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (R.value = t.key, R.focus(), R.setSelectionRange(1, 1), t.preventDefault());
  });
  const ne = document.createElement("div");
  ne.id = "hk-coord-readout", ne.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ne.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ne);
  const D = document.createElement("div");
  D.id = "hk-coord-fixed", D.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", D.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(D);
  const pe = new Pt(new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new Fn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", r.add(pe), window.__hekatanRubberBand = pe;
  const W = new Pt(new Ce(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  W.frustumCulled = false, W.visible = false, r.add(W);
  let me = [];
  const we = new lt(), Fe = new rt(new en(1, 1), new ft({ color: 2282478, transparent: true, opacity: 0.08, side: zt, depthWrite: false })), Me = new Wt(new as(new en(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Ie = new Wt(new Ce(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), Ne = (t, o) => {
    const s = [], n = Math.ceil(t / o);
    for (let a = -n; a <= n; a++) {
      const i = a * o;
      s.push(-t, i, 0, t, i, 0), s.push(i, -t, 0, i, t, 0);
    }
    Ie.geometry.dispose(), Ie.geometry = new Ce(), Ie.geometry.setAttribute("position", new kt(s, 3));
  };
  we.add(Fe, Me, Ie), we.visible = false, we.frustumCulled = false, r.add(we);
  const ct = new lt();
  ct.frustumCulled = false, ct.visible = false, r.add(ct);
  const mt = (t) => {
    const o = new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), s = new Fn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Pt(o, s);
  }, S = mt(16711680), Y = mt(65280), Q = mt(35071);
  ct.add(S, Y, Q);
  const Z = [], ye = (t) => t.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), ue = mt(16761856);
  ue.material.dashSize = 0.28, ue.material.gapSize = 0.16, ue.material.opacity = 0.9, ue.frustumCulled = false, ue.visible = false, ue.renderOrder = 98, r.add(ue);
  const _e = (t) => {
    const o = new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0)]), s = new ht({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new gs(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, xe = _e(3462041), De = _e(16724804), Le = _e(6333946), Ge = new lt();
  Ge.frustumCulled = false, Ge.visible = false, r.add(Ge), Ge.add(xe, De, Le);
  const Oe = (t) => {
    const o = new en(1, 1), s = new ft({ color: t, transparent: true, opacity: 0.06, side: zt, depthWrite: false }), n = new rt(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, fe = Oe(3462041), Ae = Oe(16724804), Ee = Oe(6333946);
  Ge.add(fe, Ae, Ee);
  const qe = (t, o, s, n) => {
    t.scale.set(2 * n, 2 * n, 1), s === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : s === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Ye = document.createElement("div");
  Ye.id = "hk-refplane-badge", Ye.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ye), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, Ge.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], c = window.__hekatanOrthoExt ?? 8;
      et(xe, i, "xy", c), et(De, i, "xz", c), et(Le, i, "yz", c), qe(fe, i, "xy", c), qe(Ae, i, "xz", c), qe(Ee, i, "yz", c), fe.material.opacity = 0.05, Ae.material.opacity = 0.05, Ee.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !Ge.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    et(xe, i, "xy", t), et(De, i, "xz", t), et(Le, i, "yz", t), qe(fe, i, "xy", t), qe(Ae, i, "xz", t), qe(Ee, i, "yz", t), y();
  };
  const qt = (t) => {
    if (fe.material.opacity = t === "xy" ? 0.09 : 0.025, Ae.material.opacity = t === "xz" ? 0.09 : 0.025, Ee.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Ye.style.background = a.bg, Ye.style.color = a.text, Ye.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Ye.style.display = "block";
    } else Ye.style.display = "none";
  }, et = (t, o, s, n) => {
    let a;
    s === "xy" ? a = [new k(o[0] - n, o[1] - n, o[2]), new k(o[0] + n, o[1] - n, o[2]), new k(o[0] + n, o[1] + n, o[2]), new k(o[0] - n, o[1] + n, o[2]), new k(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new k(o[0] - n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] - n)] : a = [new k(o[0], o[1] - n, o[2] - n), new k(o[0], o[1] + n, o[2] - n), new k(o[0], o[1] + n, o[2] + n), new k(o[0], o[1] - n, o[2] + n), new k(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(a);
  };
  let tt = null;
  window.__hekatanAxisLock = () => tt;
  let Mt = null, Ue = null;
  const Pe = document.createElement("div");
  Pe.id = "hk-axis-lock-badge", Pe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Pe);
  const Te = () => {
    if (!tt) {
      Pe.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Pe.style.background = "rgba(15,23,42,0.92)", Pe.style.color = t[tt], Pe.style.border = `1.5px solid ${t[tt]}`, Pe.textContent = `\u{1F512} LOCK ${tt.toUpperCase()}`, Pe.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== R) return;
    const s = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && me.length >= 3) {
      const a = pn();
      ie(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") tt = tt === s ? null : s, Te(), t.preventDefault();
    else if (t.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Ho(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Nn(), ie(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (ct.visible = false), ie(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
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
  const He = new k(), Ve = new k(), at = new k(), dt = (t) => {
    if (!tt) return null;
    const o = t[0], s = t[1], n = t[2];
    return tt === "x" ? (He.set(o - 1e4, s, n), Ve.set(o + 1e4, s, n)) : tt === "y" ? (He.set(o, s - 1e4, n), Ve.set(o, s + 1e4, n)) : (He.set(o, s, n - 1e4), Ve.set(o, s, n + 1e4)), P.ray.distanceSqToSegment(He, Ve, null, at), at;
  };
  window.__hekatanProjectOnAxis = dt;
  const pt = new Pt(new Ce().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new ht({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  pt.renderOrder = 998, pt.frustumCulled = false, pt.visible = false, r.add(pt);
  let Ke = -1, We = -1, yt = -1;
  const ze = /* @__PURE__ */ new Set();
  window.__hekatanSelection = ze;
  const Ft = new Pt(new Ce().setFromPoints([new k(), new k()]), new ht({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Ft.renderOrder = 997, Ft.frustumCulled = false, Ft.visible = false, r.add(Ft);
  const bt = new rt(new xn(0.02, 12, 12), new ft({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  bt.renderOrder = 998, bt.visible = false, r.add(bt);
  const Rt = (t) => {
    const o = p();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(t);
    return Math.max(0.05, s / 10);
  }, At = () => {
    bt.visible && bt.scale.setScalar(Rt(bt.position));
  }, Tt = new lt();
  Tt.frustumCulled = false, r.add(Tt);
  const nn = 2282478;
  let Zt = null;
  const gn = (t, o, s, n) => {
    if (!e.points) return -1;
    const a = e.points.rawVal;
    let i = -1, c = n;
    for (let h = 0; h < a.length; h++) {
      const m = a[h];
      if (!m) continue;
      const x = Math.hypot(t - m[0], o - m[1], s - m[2]);
      x < c && (c = x, i = h);
    }
    return i;
  }, Et = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Tt.children.length; ) {
      const c = Tt.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const c of ze) {
      const [h, ...m] = c.split(":");
      if (h === "pt") {
        const x = t[+m[0]];
        if (!x) continue;
        const M = new rt(new xn(0.025, 12, 12), new ft({ color: nn, transparent: true, opacity: 0.9, depthTest: false }));
        M.position.set(x[0], x[1], x[2]), M.renderOrder = 999, M.__isSelectionPt = true, Tt.add(M);
      } else if (h === "seg") {
        const x = o[+m[0]], M = t[x == null ? void 0 : x[+m[1]]], _ = t[x == null ? void 0 : x[+m[1] + 1]];
        if (!M || !_) continue;
        const d = new Ce().setFromPoints([new k(M[0], M[1], M[2]), new k(_[0], _[1], _[2])]), $ = new Pt(d, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        $.renderOrder = 999, Tt.add($);
      } else if (h === "poly") {
        const M = o[+m[0]].map(($) => {
          const ee = t[$];
          return ee ? new k(ee[0], ee[1], ee[2]) : null;
        }).filter(Boolean);
        if (M.length < 2) continue;
        const _ = new Ce().setFromPoints(M), d = new Pt(_, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        d.renderOrder = 999, Tt.add(d);
      } else if (h === "aux") {
        const x = n[+m[0]];
        if (!x || x.length !== 6) continue;
        const M = new Ce().setFromPoints([new k(x[0], x[1], x[2]), new k(x[3], x[4], x[5])]), _ = new Pt(M, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        _.renderOrder = 999, Tt.add(_);
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
  window.__hekatanRefreshSelection = Et, window.__hekatanClearSelection = () => {
    ze.clear(), Et();
  };
  const on = (t, o, s, n, a, i, c, h, m) => {
    const x = c - n, M = h - a, _ = m - i, d = x * x + M * M + _ * _;
    if (d < 1e-12) return Math.hypot(t - n, o - a, s - i);
    let $ = ((t - n) * x + (o - a) * M + (s - i) * _) / d;
    $ = Math.max(0, Math.min(1, $));
    const ee = n + $ * x, G = a + $ * M, U = i + $ * _;
    return Math.hypot(t - ee, o - G, s - U);
  }, vn = (t, o, s, n) => {
    if (!e.polylines) return null;
    const a = e.polylines.rawVal, i = e.points.rawVal;
    let c = -1, h = -1, m = n;
    for (let x = 0; x < a.length; x++) {
      const M = a[x];
      for (let _ = 0; _ < M.length - 1; _++) {
        const d = i[M[_]], $ = i[M[_ + 1]];
        if (!d || !$) continue;
        const ee = on(t, o, s, d[0], d[1], d[2], $[0], $[1], $[2]);
        ee < m && (m = ee, c = x, h = _);
      }
    }
    return c >= 0 ? { polyIdx: c, segIdx: h, dist: m } : null;
  }, $n = (t, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let c = -1, h = n;
    for (let m = 0; m < i.length; m++) {
      const x = i[m];
      if (!x || x.length !== 6) continue;
      const M = on(t, o, s, x[0], x[1], x[2], x[3], x[4], x[5]);
      M < h && (h = M, c = m);
    }
    return c;
  }, so = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      pt.visible = false;
      return;
    }
    pt.geometry.setFromPoints([new k(n[0], n[1], n[2]), new k(n[3], n[4], n[5])]), pt.visible = true;
  }, ao = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!s || s.length < 2) {
      pt.visible = false;
      return;
    }
    const a = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (a || o < 0 || o >= s.length - 1) for (const c of s) {
      const h = n[c];
      h && i.push(new k(h[0], h[1], h[2]));
    }
    else {
      const c = n[s[o]], h = n[s[o + 1]];
      c && i.push(new k(c[0], c[1], c[2])), h && i.push(new k(h[0], h[1], h[2]));
    }
    pt.geometry.setFromPoints(i), pt.visible = true;
  }, sn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const s = o.filter((m, x) => x !== t), n = /* @__PURE__ */ new Set();
    for (const m of s) for (const x of m) n.add(x);
    const a = e.points.rawVal, i = /* @__PURE__ */ new Map(), c = [];
    for (let m = 0; m < a.length; m++) n.has(m) && (i.set(m, c.length), c.push(a[m]));
    const h = s.map((m) => m.map((x) => i.get(x)).filter((x) => x !== void 0));
    e.points.val = c, e.polylines.val = h, e.areas && (e.areas.val = e.areas.rawVal.filter((m) => m !== t).map((m) => m > t ? m - 1 : m)), pt.visible = false, Ke = -1, We = -1;
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
    for (const d of c) for (const $ of d) h.add($);
    const m = e.points.rawVal, x = /* @__PURE__ */ new Map(), M = [];
    for (let d = 0; d < m.length; d++) h.has(d) && (x.set(d, M.length), M.push(m[d]));
    const _ = c.map((d) => d.map(($) => x.get($)).filter(($) => $ !== void 0));
    if (e.points.val = M, e.polylines.val = _, e.areas) {
      const d = i.length - 1;
      e.areas.val = e.areas.rawVal.map(($) => $ > t ? $ + d : $);
    }
    pt.visible = false, Ke = -1, We = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  B.geometry.setAttribute("position", new kt(e.points.rawVal.flat(), 3)), B.geometry.computeBoundingSphere(), B.frustumCulled = false, de.frustumCulled = false, r.add(de), O.position.set(0, 0, 0), O.rotateX(Math.PI / 2), O.geometry.rotateX(Math.PI / 2), O.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, s) => {
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
  let In = [], Rn = "";
  const bn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], s = `${t.length}|${o.length}|${o.reduce((a, i) => a + i.length, 0)}`;
    if (s === Rn) return In;
    Rn = s;
    const n = [];
    for (const a of o) {
      const i = a.length;
      if (i < 6 || a[0] !== a[i - 1]) continue;
      const c = a.slice(0, i - 1).map((M) => t[M]).filter(Boolean);
      if (c.length < 5) continue;
      const h = [0, 1, 2].map((M) => c.reduce((_, d) => _ + d[M], 0) / c.length), m = c.map((M) => Math.hypot(M[0] - h[0], M[1] - h[1], M[2] - h[2])), x = m.reduce((M, _) => M + _, 0) / m.length;
      x < 1e-9 || m.some((M) => Math.abs(M - x) > 5e-3 * x) || n.push({ c: h, r: x });
    }
    return In = n;
  };
  window.__hekatanCentrosDeducidos = bn, window.__hekatanDrawCircle = (t, o, s, n, a = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const c = Math.max(4, Math.round(a)), h = e.points.rawVal.length, m = [];
    for (let x = 0; x < c; x++) {
      const M = 2 * Math.PI * x / c, _ = n * Math.cos(M), d = n * Math.sin(M);
      let $;
      i === "xy" ? $ = [t + _, o + d, s] : i === "xz" ? $ = [t + _, o, s + d] : $ = [t, o + _, s + d], m.push($);
    }
    if (e.points.val = [...e.points.rawVal, ...m], an.push({ c: [t, o, s], r: n }), e.polylines) {
      const x = [...m.map((_, d) => h + d), h], M = e.polylines.rawVal;
      ((_a2 = M[M.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...M, x, []] : e.polylines.val = [...M.slice(0, -1), x, []];
    }
  }, window.__hekatanDrawArc = (t, o, s, n = window.__hekatanArcSegs ?? 12) => {
    const a = Math.max(4, Math.round(n)), i = new k(...t), c = new k(...o), h = new k(...s), m = new k().subVectors(c, i), x = new k().subVectors(h, i), M = new k().crossVectors(m, x).normalize(), _ = new k().addVectors(i, c).multiplyScalar(0.5), d = new k().addVectors(c, h).multiplyScalar(0.5), $ = new k().crossVectors(m, M).normalize(), ee = new k().crossVectors(new k().subVectors(h, c), M).normalize(), G = new k().subVectors(d, _), U = $.x * ee.y - $.y * ee.x;
    let v;
    if (Math.abs(U) > 1e-9) {
      const ve = (G.x * ee.y - G.y * ee.x) / U;
      v = new k().addVectors(_, $.clone().multiplyScalar(ve));
    } else v = _.clone();
    const z = i.distanceTo(v), E = new k().subVectors(i, v), q = new k().subVectors(h, v), H = Math.acos(Math.max(-1, Math.min(1, E.dot(q) / (z * z)))), K = e.points.rawVal.length, J = [], ge = M.clone();
    for (let ve = 0; ve <= a; ve++) {
      const Se = ve / a, Qe = H * Se, Re = new Gn().setFromAxisAngle(ge, Qe), st = E.clone().applyQuaternion(Re).add(v);
      J.push([st.x, st.y, st.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...J], an.push({ c: [v.x, v.y, v.z], r: z }), e.polylines) {
      const ve = J.map((Qe, Re) => K + Re), Se = e.polylines.rawVal;
      e.polylines.val = [...Se.slice(0, -1), ve, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, s = 1, n = 6, a = 6) => {
    const i = Math.min(t[0], o[0]), c = Math.max(t[0], o[0]), h = Math.min(t[1], o[1]), m = Math.max(t[1], o[1]), x = (t[2] + o[2]) / 2, M = c - i, _ = m - h, d = Math.min(s, M / 2 - 0.01, _ / 2 - 0.01);
    if (d <= 0) return;
    const $ = e.points.rawVal.length, ee = [], G = [], U = (v, z) => {
      ee.push([v, z, x]), G.push($ + ee.length - 1);
    };
    for (let v = 0; v <= a; v++) U(i + d + (M - 2 * d) * v / a, h);
    for (let v = 1; v <= n; v++) {
      const z = -Math.PI / 2 + Math.PI / 2 * v / n;
      U(c - d + d * Math.cos(z), h + d + d * Math.sin(z));
    }
    for (let v = 1; v <= a; v++) U(c, h + d + (_ - 2 * d) * v / a);
    for (let v = 1; v <= n; v++) {
      const z = 0 + Math.PI / 2 * v / n;
      U(c - d + d * Math.cos(z), m - d + d * Math.sin(z));
    }
    for (let v = 1; v <= a; v++) U(c - d - (M - 2 * d) * v / a, m);
    for (let v = 1; v <= n; v++) {
      const z = Math.PI / 2 + Math.PI / 2 * v / n;
      U(i + d + d * Math.cos(z), m - d + d * Math.sin(z));
    }
    for (let v = 1; v <= a; v++) U(i, m - d - (_ - 2 * d) * v / a);
    for (let v = 1; v <= n; v++) {
      const z = Math.PI + Math.PI / 2 * v / n;
      U(i + d + d * Math.cos(z), h + d + d * Math.sin(z));
    }
    if (G.push($), e.points.val = [...e.points.rawVal, ...ee], e.polylines) {
      const v = e.polylines.rawVal;
      e.polylines.val = [...v.slice(0, -1), G, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], c = o[0], h = o[1], m = o[2];
    let x;
    if (Math.abs(i - m) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, a, m], [n, a, m]] : x = [[n, a, i], [n, h, i], [n, h, m], [n, a, m]], e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = [s, s + 1, s + 2, s + 3, s], _ = e.polylines.rawVal;
      e.polylines.val = [..._.slice(0, -1), M, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], c = o[0], h = o[1], m = o[2];
    let x;
    if (I && e.gridTarget) {
      const M = e.gridTarget.rawVal, _ = new An(...M.rotation), d = new k(1, 0, 0).applyEuler(_), $ = new k(0, 1, 0).applyEuler(_), ee = new k(...M.position), G = new k(n, a, i), U = new k(c, h, m), v = G.clone().sub(ee).dot(d), z = G.clone().sub(ee).dot($), E = U.clone().sub(ee).dot(d), q = U.clone().sub(ee).dot($), H = (K, J) => ee.clone().addScaledVector(d, K).addScaledVector($, J).toArray();
      x = [H(v, z), H(E, z), H(E, q), H(v, q)];
    } else Math.abs(i - m) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, h, i], [n, h, i]] : Math.abs(a - h) < 1e-6 ? x = [[n, a, i], [c, a, i], [c, a, m], [n, a, m]] : x = [[n, a, i], [n, h, i], [n, h, m], [n, a, m]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = e.polylines.rawVal, _ = M.length - 1, d = [s, s + 1, s + 2, s + 3, s];
      e.polylines.val = [...M.slice(0, -1), d, []], e.areas && (e.areas.val = [...e.areas.rawVal, _]);
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
    for (let ke = 0; ke < s; ke++) {
      const Be = t[ke], je = t[(ke + 1) % s];
      n += (Be[1] - je[1]) * (Be[2] + je[2]), a += (Be[2] - je[2]) * (Be[0] + je[0]), i += (Be[0] - je[0]) * (Be[1] + je[1]);
    }
    const c = Math.hypot(n, a, i) || 1;
    n /= c, a /= c, i /= c;
    let h = t[1][0] - t[0][0], m = t[1][1] - t[0][1], x = t[1][2] - t[0][2];
    const M = Math.hypot(h, m, x) || 1;
    h /= M, m /= M, x /= M;
    let _ = a * x - i * m, d = i * h - n * x, $ = n * m - a * h;
    const ee = Math.hypot(_, d, $) || 1;
    _ /= ee, d /= ee, $ /= ee;
    const G = t[0], U = (ke) => [(ke[0] - G[0]) * h + (ke[1] - G[1]) * m + (ke[2] - G[2]) * x, (ke[0] - G[0]) * _ + (ke[1] - G[1]) * d + (ke[2] - G[2]) * $], v = (ke, Be) => [G[0] + ke * h + Be * _, G[1] + ke * m + Be * d, G[2] + ke * x + Be * $], z = t.map(U);
    let E = 1 / 0, q = -1 / 0, H = 1 / 0, K = -1 / 0;
    for (const [ke, Be] of z) ke < E && (E = ke), ke > q && (q = ke), Be < H && (H = Be), Be > K && (K = Be);
    const J = q - E, ge = K - H;
    if (J < 1e-6 || ge < 1e-6) return 0;
    let ve = o && o > 0 ? o : 0.5;
    for (; J / ve * (ge / ve) > 2500; ) ve *= 2;
    ve = Math.min(ve, Math.min(J, ge));
    const Se = (ke, Be) => {
      let je = false;
      for (let Lt = 0, Xt = z.length - 1; Lt < z.length; Xt = Lt++) {
        const [It, Qt] = z[Lt], [bo, Un] = z[Xt];
        Qt > Be != Un > Be && ke < (bo - It) * (Be - Qt) / (Un - Qt) + It && (je = !je);
      }
      return je;
    }, Qe = Math.max(1, Math.round(J / ve)), Re = Math.max(1, Math.round(ge / ve)), st = J / Qe, nt = ge / Re, it = /* @__PURE__ */ new Map(), Je = [], $e = e.points.rawVal.length, ot = (ke, Be) => {
      const je = ke + "," + Be, Lt = it.get(je);
      if (Lt !== void 0) return Lt;
      const Xt = $e + Je.length;
      return Je.push(v(E + ke * st, H + Be * nt)), it.set(je, Xt), Xt;
    }, Xe = [];
    for (let ke = 0; ke < Qe; ke++) for (let Be = 0; Be < Re; Be++) {
      if (!Se(E + (ke + 0.5) * st, H + (Be + 0.5) * nt)) continue;
      const je = ot(ke, Be), Lt = ot(ke + 1, Be), Xt = ot(ke + 1, Be + 1), It = ot(ke, Be + 1);
      Xe.push([je, Lt, Xt, It]);
    }
    if (!Xe.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...Je], e.polylines && e.areas) {
      let ke = e.polylines.rawVal.slice();
      ke.length && ke[ke.length - 1].length === 0 && (ke = ke.slice(0, -1));
      const Be = [];
      for (const je of Xe) Be.push(ke.length), ke.push([je[0], je[1], je[2], je[3], je[0]]);
      ke.push([]), e.polylines.val = ke, e.areas.val = [...e.areas.rawVal, ...Be];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), Xe.length;
  };
  const pn = () => {
    if (me.length < 3) return me = [], W.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(me.slice());
    return me = [], W.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, s) => {
    var _a2;
    const n = new k(t[0], t[1], t[2]), a = new k(o[0], o[1], o[2]), i = new k(s[0], s[1], s[2]), c = new k().subVectors(a, n).cross(new k().subVectors(i, n));
    if (c.lengthSq() < 1e-9) return false;
    c.normalize();
    const h = new Gn().setFromUnitVectors(new k(0, 0, 1), c), m = new An().setFromQuaternion(h);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [m.x, m.y, m.z] }), I = true;
    const x = new k().addVectors(n, a).add(i).multiplyScalar(1 / 3), M = Math.max(n.distanceTo(a), n.distanceTo(i), a.distanceTo(i)) * 2.2 + 4, _ = M / 2;
    Fe.geometry.dispose(), Fe.geometry = new en(M, M), Me.geometry.dispose(), Me.geometry = new as(new en(M, M)), Ne(_, 1), we.position.copy(x), we.quaternion.copy(h), we.scale.set(1, 1, 1), we.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), I = false, we.visible = false, y();
  };
  const Kt = new lt();
  Kt.visible = false, r.add(Kt), window.__hekatanShowAxes = (t, o, s = 12, n = 2) => {
    var _a2, _b;
    for (; Kt.children.length; ) {
      const M = Kt.children.pop();
      (_a2 = M.geometry) == null ? void 0 : _a2.dispose(), (_b = M.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const a = Math.min(...o) - n, i = Math.max(...o) + n, c = Math.min(...t) - n, h = Math.max(...t) + n, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", x = (M, _, d, $, ee) => {
      const G = document.createElement("canvas");
      G.width = 64, G.height = 32;
      const U = G.getContext("2d");
      U.fillStyle = ee, U.font = "bold 22px sans-serif", U.textAlign = "center", U.fillText(M, 32, 26);
      const v = new is(G), z = new ls({ map: v, transparent: true }), E = new rs(z);
      return E.position.set(_, d, $), E.scale.set(1.2, 0.6, 1), E;
    };
    t.forEach((M, _) => {
      const d = _ < m.length ? m[_] : `X${_}`, $ = new Ce().setFromPoints([new k(M, a, 0), new k(M, i, 0), new k(M, a, 0), new k(M, a, s)]), ee = new Fn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), G = new Wt($, ee);
      G.computeLineDistances(), Kt.add(G), Kt.add(x(d, M, a - 0.5, 0, "#60a5fa")), Kt.add(x(d, M, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((M, _) => {
      const d = `${_ + 1}`, $ = new Ce().setFromPoints([new k(c, M, 0), new k(h, M, 0), new k(c, M, 0), new k(c, M, s)]), ee = new Fn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), G = new Wt($, ee);
      G.computeLineDistances(), Kt.add(G), Kt.add(x(d, c - 0.5, M, 0, "#fb7185")), Kt.add(x(d, h + 0.5, M, 0, "#fb7185"));
    }), Kt.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    Kt.visible = false, y();
  };
  const Ot = new lt();
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
      const h = a[c % a.length], m = o / 2, x = [new k(s - m, n - m, i), new k(s + m, n - m, i), new k(s + m, n + m, i), new k(s - m, n + m, i), new k(s - m, n - m, i)], M = new Ce().setFromPoints(x), _ = new ht({ color: h, transparent: true, opacity: 0.55 });
      Ot.add(new Pt(M, _));
      const d = document.createElement("canvas");
      d.width = 128, d.height = 32;
      const $ = d.getContext("2d");
      $.fillStyle = `#${h.toString(16).padStart(6, "0")}`, $.font = "bold 18px sans-serif", $.fillText(`Z = ${i} m`, 4, 22);
      const ee = new is(d), G = new ls({ map: ee, transparent: true }), U = new rs(G);
      U.position.set(s - m - 1.5, n - m - 1.5, i), U.scale.set(2.5, 0.6, 1), Ot.add(U);
      const v = new en(1e4, 1e4), z = new ft({ visible: false, side: zt }), E = new rt(v, z);
      E.position.set(0, 0, i), E.frustumCulled = false, E.userData = { refPlaneZ: i }, r.add(E), un.push(E);
    }), Ot.visible = true, y();
  }, window.__hekatanHideRefPlanes = () => {
    Ot.visible = false, un.forEach((t) => {
      t.visible = false;
    }), y();
  };
  const Mn = new lt();
  Mn.frustumCulled = false, r.add(Mn);
  const Cs = () => {
    var _a2, _b, _c, _d;
    for (; Mn.children.length; ) {
      const s = Mn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new Ce().setFromPoints([new k(s[0], s[1], s[2]), new k(s[3], s[4], s[5])]), a = new Fn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Pt(n, a);
      i.computeLineDistances(), Mn.add(i);
    }
  };
  j.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, Cs(), y());
  });
  const fn = new lt();
  fn.frustumCulled = false, r.add(fn);
  const Lo = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const s = fn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new rt(new xn(0.025, 12, 12), new ft({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(Rt(n.position)), fn.add(n);
    }
  };
  j.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Lo(), y());
  }), u.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(Rt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Lo;
  const xt = new lt(), zs = new rt(new xn(0.01, 12, 12), new ft({ color: 16724804, transparent: true, opacity: 0.95 })), Fs = new rt(new xn(0.015, 12, 12), new ft({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(zs, Fs);
  const hn = 0.08, io = (t, o, s) => {
    const n = new Ce().setFromPoints([new k(...t), new k(...o)]);
    return new Pt(n, new ht({ color: s, transparent: true, opacity: 0.7 }));
  };
  xt.add(io([-hn, 0, 0], [hn, 0, 0], 16711680)), xt.add(io([0, -hn, 0], [0, hn, 0], 65280)), xt.add(io([0, 0, -hn], [0, 0, hn], 35071)), xt.visible = false, xt.frustumCulled = false, r.add(xt);
  let lo = 2;
  const Dn = (t) => {
    const o = p(), s = (b == null ? void 0 : b.clientHeight) || 700;
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
    Tt.children.length !== 0 && Tt.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(Rt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Io, u.addEventListener("change", () => {
    var _a2;
    _n(), bt.visible && At(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Io();
  }), window.__hekatanShowSnap = (t, o, s) => {
    xt.position.set(t, o, s), xt.visible = true, _n(), y();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, y();
  }, b.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = g(t);
    if (!o) return;
    P.setFromCamera(V, o);
    const s = ce();
    if (s.length) {
      const n = s[0].point, a = t.altKey, i = ro(n), c = a ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: t.clientX, y: t.clientY });
      if (c) No(c.type, c.x, c.y, c.z), xt.position.set(c.x, c.y, c.z), xt.visible = true, n.set(c.x, c.y, c.z), Yo(c.type, t.clientX, t.clientY);
      else {
        Ts(), Nn();
        const _ = !a && window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0.5;
        _ && d > 0 && (n.x = Math.round(n.x / d) * d, n.y = Math.round(n.y / d) * d, n.z = Math.round(n.z / d) * d), xt.position.copy(n), xt.visible = true;
      }
      _n();
      const h = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (h === "select" || !h) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = gn(n.x, n.y, n.z, _), $ = vn(n.x, n.y, n.z, _), ee = $n(n.x, n.y, n.z, _);
        if (d >= 0) {
          const z = e.points.rawVal[d];
          bt.position.set(z[0], z[1], z[2]), bt.visible = true, At(), Ft.visible = false, Zt = { kind: "pt", a: d };
        } else if ($) {
          const z = e.points.rawVal, E = e.polylines.rawVal[$.polyIdx], q = z[E[$.segIdx]], H = z[E[$.segIdx + 1]];
          Ft.geometry.setFromPoints([new k(q[0], q[1], q[2]), new k(H[0], H[1], H[2])]), Ft.visible = true, bt.visible = false, Zt = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes($.polyIdx)) ?? false ? { kind: "poly", a: $.polyIdx } : { kind: "seg", a: $.polyIdx, b: $.segIdx };
        } else if (ee >= 0) {
          const E = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[ee];
          E && (Ft.geometry.setFromPoints([new k(E[0], E[1], E[2]), new k(E[3], E[4], E[5])]), Ft.visible = true, bt.visible = false, Zt = { kind: "aux", a: ee });
        } else Ft.visible = false, bt.visible = false, Zt = null;
        ne.style.left = t.clientX + "px", ne.style.top = t.clientY + "px", ne.style.display = "block";
        let G = n;
        if ((Zt == null ? void 0 : Zt.kind) === "pt") {
          const z = e.points.rawVal[Zt.a];
          z && (G = new k(z[0], z[1], z[2]));
        }
        const U = `X=${G.x.toFixed(2)} Y=${G.y.toFixed(2)} Z=${G.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [G.x, G.y, G.z], Zt) {
          const z = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ne.textContent = `${U}  \xB7  \u{1F5B1} Click \u2192 ${z[Zt.kind]}`;
        } else ne.textContent = U;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = U), Ue = { p: G.clone(), x: t.clientX, y: t.clientY }, pe.visible = false, ct.visible = false, ue.visible = false, y();
        return;
      }
      if (h === "delete" || h === "trim" || h === "extend" || h === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = vn(n.x, n.y, n.z, _), $ = $n(n.x, n.y, n.z, _);
        let ee = false;
        if ($ >= 0) if (!d) ee = true;
        else {
          const z = window.__hekatanDrawingAuxLines, q = ((z == null ? void 0 : z.rawVal) ?? (z == null ? void 0 : z.val) ?? z ?? [])[$];
          on(n.x, n.y, n.z, q[0], q[1], q[2], q[3], q[4], q[5]) < d.dist && (ee = true);
        }
        ee ? (yt = $, Ke = -1, We = -1, so($)) : d ? (Ke = d.polyIdx, We = d.segIdx, yt = -1, ao(d.polyIdx, d.segIdx)) : (Ke = -1, We = -1, yt = -1, pt.visible = false), pe.visible = false, ct.visible = false, ue.visible = false, T(), ne.style.left = t.clientX + "px", ne.style.top = t.clientY + "px", ne.style.display = "block";
        const G = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let U = "";
        ee ? U = `\u{1F5D1} l\xEDnea aux #${yt + 1}` : d ? U = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(d.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${d.polyIdx + 1}` : `\u{1F5D1} seg ${d.segIdx + 1} / poly #${d.polyIdx + 1}` : U = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ne.textContent = `${G}  \xB7  ${U}`;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = G), y();
        return;
      } else pt.visible = false, Ke = -1, yt = -1;
      ne.style.left = t.clientX + "px", ne.style.top = t.clientY + "px", ne.style.display = "block";
      const m = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], x = m[m.length - 1] ?? [], M = e.points.rawVal ?? [];
      if (x.length > 0 && M[x[x.length - 1]]) {
        const _ = x[x.length - 1], d = M[_];
        let $ = tt;
        if (Mt = null, !$ && window.__hekatanAxisSnap !== false) {
          const Re = b.getBoundingClientRect(), st = t.clientX, nt = t.clientY, it = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, Je = new k(d[0], d[1], d[2]), $e = [["x", new k(1, 0, 0)], ["y", new k(0, 1, 0)], ["z", new k(0, 0, 1)]], ot = (ke) => {
            const Be = ke.clone().project(o);
            return { x: (Be.x * 0.5 + 0.5) * Re.width + Re.left, y: (-Be.y * 0.5 + 0.5) * Re.height + Re.top };
          };
          let Xe = null;
          for (const [ke, Be] of $e) {
            const je = ot(Je.clone().addScaledVector(Be, -it)), Lt = ot(Je.clone().addScaledVector(Be, it)), Xt = Lt.x - je.x, It = Lt.y - je.y, Qt = st - je.x, bo = nt - je.y, Un = Xt * Xt + It * It || 1;
            let qn = (Qt * Xt + bo * It) / Un;
            qn = Math.max(0, Math.min(1, qn));
            const jo = Math.hypot(st - (je.x + qn * Xt), nt - (je.y + qn * It));
            if (Xe === null || jo < Xe.dpx) {
              const Mo = P.ray, es = Je.clone().sub(Mo.origin), _o2 = Be.dot(Mo.direction), ts = Be.dot(es), Ys = Mo.direction.dot(es), ns = 1 - _o2 * _o2, Zs = Math.abs(ns) < 1e-6 ? -ts : (_o2 * Ys - ts) / ns;
              Xe = { axis: ke, dpx: jo, pt: Je.clone().addScaledVector(Be, Zs) };
            }
          }
          Xe && Xe.dpx <= 12 && (n.copy(Xe.pt), $ = Xe.axis, Mt = Xe.pt.clone());
        }
        const ee = !!window.__hekatanOrthoMode;
        if (!$ && ee) {
          const Re = Math.abs(n.x - d[0]), st = Math.abs(n.y - d[1]), nt = Math.abs(n.z - d[2]), it = (_l = s[0]) == null ? void 0 : _l.object;
          let Je = null;
          it === fe ? Je = "xy" : it === Ae ? Je = "xz" : it === Ee && (Je = "yz"), Je === "xy" ? $ = Re >= st ? "x" : "y" : Je === "xz" ? $ = Re >= nt ? "x" : "z" : Je === "yz" ? $ = st >= nt ? "y" : "z" : $ = Re >= st && Re >= nt ? "x" : st >= nt ? "y" : "z";
        }
        const G = window.__hekatanPolarTrack !== false;
        if (!$ && G) {
          const Re = n.x - d[0], st = n.y - d[1], nt = n.z - d[2], it = Math.hypot(Re, st, nt);
          if (it > 1e-3) {
            const $e = Math.tan(6 * Math.PI / 180) * it, ot = Math.hypot(st, nt), Xe = Math.hypot(Re, nt), ke = Math.hypot(Re, st), Be = [["x", ot], ["y", Xe], ["z", ke]];
            Be.sort((je, Lt) => je[1] - Lt[1]), Be[0][1] <= $e && ($ = Be[0][0]);
          }
        }
        if ($) {
          const Re = d[0], st = d[1], nt = d[2];
          $ === "x" ? n.set(n.x, st, nt) : $ === "y" ? n.set(Re, n.y, nt) : n.set(Re, st, n.z);
          const it = !!tt, $e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[$];
          Pe.style.background = "rgba(15,23,42,0.92)", Pe.style.color = $e, Pe.style.border = `1.5px solid ${$e}`;
          const ot = (_m = s[0]) == null ? void 0 : _m.object;
          let Xe = null;
          ot === fe ? Xe = "xy" : ot === Ae ? Xe = "xz" : ot === Ee && (Xe = "yz");
          const ke = Xe ? ` (plano ${Xe.toUpperCase()})` : "";
          Pe.textContent = it ? `\u{1F512} LOCK ${$.toUpperCase()}${ke}` : `\u22A5 ORTO ${$.toUpperCase()}${ke}`, Pe.style.left = t.clientX + 20 + "px", Pe.style.top = t.clientY + 18 + "px", Pe.style.transform = "none", Pe.style.display = "block";
        } else tt || (Pe.style.display = "none");
        let U = null;
        if (!a && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Re = e.points.rawVal, st = $ ? [$] : ["z", "x", "y"], nt = { x: t.clientX, y: t.clientY };
          let it = 1 / 0;
          for (const Je of Re) if (!(Math.abs(Je[0] - d[0]) < 1e-9 && Math.abs(Je[1] - d[1]) < 1e-9 && Math.abs(Je[2] - d[2]) < 1e-9)) for (const $e of st) {
            const ot = new k($e === "x" ? Je[0] : n.x, $e === "y" ? Je[1] : n.y, $e === "z" ? Je[2] : n.z), Xe = ho(ot.x, ot.y, ot.z);
            if (!Xe) continue;
            const ke = Math.hypot(Xe.x - nt.x, Xe.y - nt.y);
            ke < kn && ke < it && (it = ke, U = { q: Je, eje: $e });
          }
        }
        U ? (U.eje === "x" ? n.x = U.q[0] : U.eje === "y" ? n.y = U.q[1] : n.z = U.q[2], ue.geometry.setFromPoints([new k(U.q[0], U.q[1], U.q[2]), new k(n.x, n.y, n.z)]), (_n2 = ue.computeLineDistances) == null ? void 0 : _n2.call(ue), ue.visible = true, xt.position.set(n.x, n.y, n.z), xt.visible = true, Yo("track", t.clientX, t.clientY)) : ue.visible = false, Ue = { p: n.clone(), x: t.clientX, y: t.clientY };
        const v = Math.hypot(n.x - d[0], n.y - d[1], n.z - d[2]), z = Math.atan2(n.y - d[1], n.x - d[0]) * 180 / Math.PI, E = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ne.textContent = `${E} | \u0394L=${v.toFixed(2)}m ${z.toFixed(0)}\xB0`;
        const q = document.getElementById("hk-coord-fixed");
        q && (q.textContent = E), pe.geometry.setFromPoints([new k(d[0], d[1], d[2]), new k(n.x, n.y, n.z)]), (_o = pe.computeLineDistances) == null ? void 0 : _o.call(pe), pe.visible = true, N(d[0], d[1], d[2], n.x, n.y, n.z);
        const H = window.__hekatanOrthoExt ?? 8, K = window.__hekatanShowOrthoPlanes !== false;
        Ge.visible = K, K || qt(null), K && (et(xe, d, "xy", H), et(De, d, "xz", H), et(Le, d, "yz", H), qe(fe, d, "xy", H), qe(Ae, d, "xz", H), qe(Ee, d, "yz", H));
        const J = K ? P.intersectObjects([fe, Ae, Ee], false) : [];
        let ge = null;
        if (J.length > 0) {
          const Re = J[0].object;
          Re === fe ? ge = "xy" : Re === Ae ? ge = "xz" : Re === Ee && (ge = "yz");
        }
        qt(ge), ge && (Ye.style.left = t.clientX + "px", Ye.style.top = t.clientY + "px"), S.geometry.setFromPoints([new k(d[0] - H, d[1], d[2]), new k(d[0] + H, d[1], d[2])]), (_p = S.computeLineDistances) == null ? void 0 : _p.call(S), Y.geometry.setFromPoints([new k(d[0], d[1] - H, d[2]), new k(d[0], d[1] + H, d[2])]), (_q = Y.computeLineDistances) == null ? void 0 : _q.call(Y), Q.geometry.setFromPoints([new k(d[0], d[1], d[2] - H), new k(d[0], d[1], d[2] + H)]), (_r = Q.computeLineDistances) == null ? void 0 : _r.call(Q), ct.visible = true;
        const ve = S.material, Se = Y.material, Qe = Q.material;
        $ === "x" ? (ve.opacity = 0.95, Se.opacity = 0.1, Qe.opacity = 0.1) : $ === "y" ? (ve.opacity = 0.1, Se.opacity = 0.95, Qe.opacity = 0.1) : $ === "z" ? (ve.opacity = 0.1, Se.opacity = 0.1, Qe.opacity = 0.95) : (ve.opacity = 0.5, Se.opacity = 0.5, Qe.opacity = 0.5);
      } else {
        const _ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ne.textContent = _;
        const d = document.getElementById("hk-coord-fixed");
        if (d && (d.textContent = _), pe.visible = false, ct.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(h)) {
          if (A = null, X = null, R.style.left = t.clientX + 20 + "px", R.style.top = t.clientY - 28 + "px", R.style.display = "block", !F) {
            R.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const ee = document.activeElement;
            !(ee && (ee.tagName === "INPUT" || ee.tagName === "TEXTAREA") && ee !== R) && document.activeElement !== R && R.focus({ preventScroll: true });
            try {
              R.select();
            } catch {
            }
          }
        } else T();
      }
      y();
    } else Nn(), ne.style.display = "none", xt.visible = false, pe.visible = false, ct.visible = false, T(), y();
  }), j.derive(() => {
    var _a2;
    if (!e.gridTarget) return;
    const t = new Gn().setFromEuler(new An(...e.gridTarget.val.rotation)), o = new Gn().setFromAxisAngle(new k(1, 0, 0), Math.PI / 2);
    Ea(l, { position: new k(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y);
    {
      const n = e.gridTarget.val.position[2], a = Math.abs(t.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of Z) r.remove(i), ye(i);
      if (Z.length = 0, a) {
        const i = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], c = /* @__PURE__ */ new Set([0]);
        for (const m of i) c.add(+m[2].toFixed(3));
        for (const m of window.__hekatanLevels ?? []) isFinite(m == null ? void 0 : m.z) && c.add(+m.z.toFixed(3));
        const h = [...c].sort((m, x) => m - x).slice(0, 24);
        for (const m of h) {
          if (Math.abs(m - n) < 1e-6) continue;
          const x = l.clone(true);
          x.name = `hekatan-grid-nivel-${m}`, x.traverse((M) => {
            M.material && (M.material = M.material.clone(), M.material.transparent = true, M.material.opacity = (M.material.opacity ?? 1) * (Math.abs(m) < 1e-6 ? 0.5 : 0.22));
          }), x.position.set(0, 0, m), x.quaternion.copy(o), r.add(x), Z.push(x);
        }
      }
    }
    O.position.set(...e.gridTarget.val.position), O.quaternion.setFromEuler(new An(...e.gridTarget.val.rotation)), O.updateMatrixWorld();
    const s = new k(0, 0, 1).applyEuler(new An(...e.gridTarget.val.rotation));
    I = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), j.derive(() => {
    B.geometry.setAttribute("position", new kt(e.points.val.flat(), 3)), B.geometry.computeBoundingSphere();
  }), j.derive(() => {
    const t = 0.05 * w * 0.5 * f.val;
    P.params.Points.threshold = 0.4 * t;
  }), j.derive(() => {
    var _a2;
    const t = e.points.val ?? [], s = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of s) {
      const [c, h, m] = t[i];
      n.push(c, h, m);
    }
    const a = new Ce();
    a.setAttribute("position", new kt(n, 3)), ae.geometry.dispose(), ae.geometry = a;
  });
  let co = false, ln = 0;
  b.addEventListener("pointerdown", () => {
    co = true;
  }), b.addEventListener("pointerup", () => {
    co = false;
  }), b.addEventListener("pointermove", () => {
    co && ln++;
  });
  const $t = document.createElement("div");
  $t.id = "hk-window-select", $t.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild($t);
  let Gt = null, Sn = false, Nt = null;
  const po = (t, o, s, n, a) => {
    a ? ($t.style.borderColor = "#34d399", $t.style.borderStyle = "dashed", $t.style.background = "rgba(52, 211, 153, 0.10)") : ($t.style.borderColor = "#22d3ee", $t.style.borderStyle = "solid", $t.style.background = "rgba(34, 211, 238, 0.10)"), $t.style.left = Math.min(t, s) + "px", $t.style.top = Math.min(o, n) + "px", $t.style.width = Math.abs(s - t) + "px", $t.style.height = Math.abs(n - o) + "px", $t.style.display = "block";
  }, Ro = (t, o, s, n, a) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, s), c = Math.max(t, s), h = Math.min(o, n), m = Math.max(o, n), x = s < t, M = b.getBoundingClientRect(), _ = p();
    _.updateMatrixWorld();
    const d = (K) => {
      const J = new k(K[0], K[1], K[2]);
      return J.project(_), { x: M.left + (J.x * 0.5 + 0.5) * M.width, y: M.top + (-J.y * 0.5 + 0.5) * M.height };
    }, $ = (K) => K.x >= i && K.x <= c && K.y >= h && K.y <= m, ee = (K, J) => !(K.x < i && J.x < i || K.x > c && J.x > c || K.y < h && J.y < h || K.y > m && J.y > m);
    a || ze.clear();
    let G = 0;
    const U = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let K = 0; K < U.length; K++) {
      const J = U[K];
      J && $(d(J)) && (ze.add(`pt:${K}`), G++);
    }
    const v = (K, J) => x ? $(K) || $(J) || ee(K, J) : $(K) && $(J), z = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], E = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let K = 0; K < z.length; K++) {
      const J = z[K];
      if (E.includes(K)) {
        let ve;
        if (!x) ve = J.every((Se) => {
          const Qe = U[Se];
          return !!Qe && $(d(Qe));
        });
        else {
          ve = false;
          for (let Se = 0; Se < J.length - 1; Se++) {
            const Qe = U[J[Se]], Re = U[J[Se + 1]];
            if (!(!Qe || !Re) && v(d(Qe), d(Re))) {
              ve = true;
              break;
            }
          }
        }
        ve && (ze.add(`poly:${K}`), G++);
      } else for (let ve = 0; ve < J.length - 1; ve++) {
        const Se = U[J[ve]], Qe = U[J[ve + 1]];
        !Se || !Qe || v(d(Se), d(Qe)) && (ze.add(`seg:${K}:${ve}`), G++);
      }
    }
    const H = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let K = 0; K < H.length; K++) {
      const J = H[K];
      if (!J || J.length !== 6) continue;
      const ge = d([J[0], J[1], J[2]]), ve = d([J[3], J[4], J[5]]);
      v(ge, ve) && (ze.add(`aux:${K}`), G++);
    }
    Et(), ie(G === 0 && !x ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${x ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${G} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${ze.size})`), $t.style.display = "none";
  }, Bn = () => {
    Nt && (Nt = null, $t.style.display = "none", ie("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Bn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Nt && Bn();
  });
  const Do = () => {
    var _a2, _b, _c, _d;
    if (ze.size === 0) return false;
    const t = [...ze], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? [], c = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
    for (const ee of t) {
      const [G, ...U] = ee.split(":");
      if (G === "pt") c.add(+U[0]);
      else if (G === "poly") h.add(+U[0]);
      else if (G === "seg") {
        const v = +U[0], z = +U[1];
        m.has(v) || m.set(v, /* @__PURE__ */ new Set()), m.get(v).add(z);
      } else G === "aux" && x.add(+U[0]);
    }
    let M = 0, _ = [], d = [];
    const $ = /* @__PURE__ */ new Map();
    for (let ee = 0; ee < s.length; ee++) {
      if (h.has(ee)) {
        M++;
        continue;
      }
      $.set(ee, _.length);
      const G = m.get(ee);
      if (G && G.size > 0) {
        let U = [];
        for (let v = 0; v < s[ee].length; v++) U.push(s[ee][v]), v < s[ee].length - 1 && G.has(v) && (U.length >= 2 && _.push(U), U = [], M++);
        (U.length >= 2 || U.length === 1) && _.push(U);
      } else _.push([...s[ee]]);
    }
    if (c.size > 0) {
      const ee = [], G = /* @__PURE__ */ new Map();
      for (let v = 0; v < o.length; v++) {
        if (c.has(v)) {
          M++;
          continue;
        }
        G.set(v, ee.length), ee.push([...o[v]]);
      }
      const U = [];
      for (const v of _) {
        let z = [];
        for (const E of v) {
          const q = G.get(E);
          q === void 0 ? (z.length >= 2 && U.push(z), z = []) : z.push(q);
        }
        z.length >= 2 && U.push(z);
      }
      _ = U, e.points.val = ee;
    }
    for (const ee of n) {
      const G = $.get(ee);
      G !== void 0 && G < _.length && d.push(G);
    }
    if (e.polylines && (e.polylines.val = _), e.areas && (e.areas.val = d), x.size > 0 && a) {
      const ee = i.filter((G, U) => !x.has(U));
      "val" in a ? a.val = ee : window.__hekatanDrawingAuxLines = ee, M += x.size;
    }
    ze.clear(), Et();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ie(`\u{1F5D1} ${M} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Do, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || ze.size !== 0 && (t.preventDefault(), Do());
  });
  const Dt = document.createElement("div");
  Dt.id = "hk-properties-pane";
  const Bo = "hk-props-pane-pos";
  let Pn = null;
  try {
    const t = localStorage.getItem(Bo);
    t && (Pn = JSON.parse(t));
  } catch {
  }
  Dt.style.cssText = ["position:fixed", Pn ? `left:${Pn.left}px` : "left:14px", Pn ? `top:${Pn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Dt);
  const As = () => {
    const t = Dt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, i = 0;
    t.addEventListener("mousedown", (c) => {
      o = true, s = c.clientX, n = c.clientY;
      const h = Dt.getBoundingClientRect();
      a = h.left, i = h.top, Dt.style.transform = "none", Dt.style.left = `${a}px`, Dt.style.top = `${i}px`, c.preventDefault();
    }), window.addEventListener("mousemove", (c) => {
      if (!o) return;
      const h = c.clientX - s, m = c.clientY - n, x = Math.max(0, Math.min(window.innerWidth - 80, a + h)), M = Math.max(0, Math.min(window.innerHeight - 40, i + m));
      Dt.style.left = `${x}px`, Dt.style.top = `${M}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Bo, JSON.stringify({ left: parseFloat(Dt.style.left), top: parseFloat(Dt.style.top) }));
        } catch {
        }
      }
    });
  }, oe = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Vt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ut = null;
  const _t = (t, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: s, value: n } }));
  }, Es = () => {
    if (ut && (ut.dispose(), ut = null), ze.size === 0) {
      Dt.style.display = "none";
      return;
    }
    const t = [...ze], o = t.filter((_) => _.startsWith("pt:")), s = t.filter((_) => _.startsWith("seg:")), n = t.filter((_) => _.startsWith("poly:")), a = t.filter((_) => _.startsWith("aux:")), i = o.length > 0, c = s.length > 0, h = n.length > 0, m = !i && !c && !h, x = [];
    o.length && x.push(`\u{1F535} ${o.length} nodo(s)`), s.length && x.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && x.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && x.push(`\u250A ${a.length} aux`);
    const M = `\u{1F3AF} ${ze.size} item(s) \u2014 ${x.join(", ")}`;
    ut = new bs({ container: Dt, title: M });
    {
      const _ = ut.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      _.addBinding(Vt, "dx", { label: "\u0394x (m)", step: 0.1 }), _.addBinding(Vt, "dy", { label: "\u0394y (m)", step: 0.1 }), _.addBinding(Vt, "dz", { label: "\u0394z (m)", step: 0.1 }), _.addBinding(Vt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), _.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Vt.dx, Vt.dy, Vt.dz, Vt.copias);
        ie(G ? `\u29C9 Replicado \xD7${G} (\u0394 ${Vt.dx},${Vt.dy},${Vt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const d = { vuelo: 1.5, losa: true, borde: true, ambos: true }, $ = _.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      $.addBinding(d, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), $.addBinding(d, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), $.addBinding(d, "borde", { label: "con viga de borde" }), $.addBinding(d, "ambos", { label: "a los dos lados" }), $.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanVoladoSelection) == null ? void 0 : _a2.call(window, d.vuelo, { losa: d.losa, vigaBorde: d.borde, lados: d.ambos ? "ambos" : "afuera" });
        ie(G ? `\u2310 Volado de ${d.vuelo} m en ${G} pa\xF1o(s)` + (d.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), _.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Vt.dx, Vt.dy, Vt.dz, 1);
        ie(G ? `\u2192 Copia desplazada \u0394 ${Vt.dx},${Vt.dy},${Vt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const ee = _.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      ee.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), ee.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ie(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const _ = ut.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      _.addBinding(oe, "Ux"), _.addBinding(oe, "Uy"), _.addBinding(oe, "Uz"), _.addBinding(oe, "Rx"), _.addBinding(oe, "Ry"), _.addBinding(oe, "Rz");
      const d = ut.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      d.addBinding(oe, "Kx", { label: "Kx", min: 0, step: 100 }), d.addBinding(oe, "Ky", { label: "Ky", min: 0, step: 100 }), d.addBinding(oe, "Kz", { label: "Kz", min: 0, step: 100 }), d.addBinding(oe, "Krx", { label: "Krx", min: 0, step: 1e3 }), d.addBinding(oe, "Kry", { label: "Kry", min: 0, step: 1e3 }), d.addBinding(oe, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const $ = ut.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      $.addBinding(oe, "Fx", { step: 0.1 }), $.addBinding(oe, "Fy", { step: 0.1 }), $.addBinding(oe, "Fz", { step: 0.1 }), $.addBinding(oe, "Mx", { step: 0.1 }), $.addBinding(oe, "My", { step: 0.1 }), $.addBinding(oe, "Mz", { step: 0.1 }), ut.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(oe, "mass", { label: "m", min: 0, step: 1 }), ut.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(oe, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ut.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let U = 0;
        const v = [oe.Ux, oe.Uy, oe.Uz, oe.Rx, oe.Ry, oe.Rz];
        v.some((q) => q) && (_t("nodes", o, "supports", v), U++);
        const z = [oe.Fx, oe.Fy, oe.Fz, oe.Mx, oe.My, oe.Mz];
        z.some((q) => q !== 0) && (_t("nodes", o, "loads", z), U++);
        const E = [oe.Kx, oe.Ky, oe.Kz, oe.Krx, oe.Kry, oe.Krz];
        if (E.some((q) => q !== 0) && (_t("nodes", o, "springs", E), U++), oe.mass !== 0 && (_t("nodes", o, "mass", oe.mass), U++), oe.diaphragm !== "Ninguno" && (_t("nodes", o, "diaphragm", oe.diaphragm), U++), U === 0) {
          ie("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let q = document.getElementById("hk-prop-toast");
          q || (q = document.createElement("div"), q.id = "hk-prop-toast", q.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(q)), q.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", q.style.background = "rgba(217,119,6,0.97)", q.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            q && (q.style.opacity = "0");
          }, 3200);
        } else ie(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (c) {
      const _ = ut.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      _.addBinding(oe, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), _.addBinding(oe, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const d = ut.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      d.addBinding(oe, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), d.addBinding(oe, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), d.addBinding(oe, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), d.addBinding(oe, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ut.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(oe, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ut.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(oe, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const G = ut.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      G.addBinding(oe, "relMxI", { label: "Mx I" }), G.addBinding(oe, "relMyI", { label: "My I" }), G.addBinding(oe, "relMzI", { label: "Mz I" });
      const U = ut.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      U.addBinding(oe, "relMxJ", { label: "Mx J" }), U.addBinding(oe, "relMyJ", { label: "My J" }), U.addBinding(oe, "relMzJ", { label: "Mz J" }), ut.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(oe, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const z = ut.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      z.addBinding(oe, "LKx", { label: "LKx", min: 0, step: 100 }), z.addBinding(oe, "LKy", { label: "LKy", min: 0, step: 100 }), z.addBinding(oe, "LKz", { label: "LKz", min: 0, step: 100 });
      const E = ut.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      E.addBinding(oe, "qx", { step: 0.1 }), E.addBinding(oe, "qy", { step: 0.1 }), E.addBinding(oe, "qz", { step: 0.1 }), ut.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(oe, "massPerM", { label: "m/L", min: 0, step: 1 }), ut.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        _t("segs", s, "section", oe.section), _t("segs", s, "material", oe.material_frame);
        const H = { A: oe.A_mod, Iz: oe.Iz_mod, Iy: oe.Iy_mod, J: oe.J_mod };
        (H.A !== 1 || H.Iz !== 1 || H.Iy !== 1 || H.J !== 1) && _t("segs", s, "modifiers", H), oe.insertionPoint !== "10 \u2014 Centroid" && _t("segs", s, "insertionPoint", oe.insertionPoint), oe.beta !== 0 && _t("segs", s, "beta", oe.beta);
        const K = [oe.relMxI, oe.relMyI, oe.relMzI], J = [oe.relMxJ, oe.relMyJ, oe.relMzJ];
        (K.some((Se) => Se) || J.some((Se) => Se)) && _t("segs", s, "releases", { i: K, j: J }), oe.hinges !== "None" && _t("segs", s, "hinges", oe.hinges);
        const ge = [oe.LKx, oe.LKy, oe.LKz];
        ge.some((Se) => Se !== 0) && _t("segs", s, "lineSprings", ge);
        const ve = [oe.qx, oe.qy, oe.qz];
        ve.some((Se) => Se !== 0) && _t("segs", s, "distLoad", ve), oe.massPerM !== 0 && _t("segs", s, "massPerM", oe.massPerM), ie(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (h) {
      const _ = ut.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      _.addBinding(oe, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), _.addBinding(oe, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), _.addBinding(oe, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ut.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(oe, "surfLoad", { label: "q", step: 0.1 }), ut.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        _t("areas", n, "shellType", oe.shellType), _t("areas", n, "thickness", oe.thickness), _t("areas", n, "material", oe.material_shell), oe.surfLoad !== 0 && _t("areas", n, "surfLoad", oe.surfLoad), ie(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (m) {
      const _ = ut.addFolder({ title: "\u2139 Selecci\xF3n" }), d = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      _.addBinding(d, "msg", { readonly: true, label: "" });
    }
    ut.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      ze.clear(), Et();
    }), Dt.style.display = "block", As();
  };
  window.__hekatanRefreshPropsPane = Es;
  let mn = null, Xn = false;
  b.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, Xn = false);
  }), b.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !Xn) {
      const o = t.clientX - mn.x, s = t.clientY - mn.y;
      Math.hypot(o, s) > 8 && (Xn = true);
    }
  }), b.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !Xn;
      mn = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Nt ? Bn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), ze.size > 0 && (ze.clear(), Et()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), ie(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : ie("\u238B Cancelado (click derecho)");
      }
    }
  }), b.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), b.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Gt = null, Sn = false));
  }), b.addEventListener("pointermove", (t) => {
    if (Nt && t.buttons === 0) {
      const i = t.clientX < Nt.x;
      po(Nt.x, Nt.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Gt) return;
    const o = t.clientX - Gt.x, s = t.clientY - Gt.y, n = Math.hypot(o, s);
    if (!Sn && n < 8) return;
    Sn = true;
    const a = t.clientX < Gt.x;
    po(Gt.x, Gt.y, t.clientX, t.clientY, a);
  }), b.addEventListener("pointerup", (t) => {
    if (!Gt) return;
    if (!Sn) {
      Gt = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    Ro(Gt.x, Gt.y, t.clientX, t.clientY, o), Gt = null, Sn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Ut = new lt();
  Ut.visible = false, Ut.frustumCulled = false, r.add(Ut);
  const Xo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, No = (t, o, s, n) => {
    var _a2, _b, _c, _d;
    for (; Ut.children.length; ) {
      const c = Ut.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Xo[t] ?? 16777215, i = new Ce().setFromPoints([new k(-1, -1, 0), new k(1, -1, 0), new k(1, -1, 0), new k(1, 1, 0), new k(1, 1, 0), new k(-1, 1, 0), new k(-1, 1, 0), new k(-1, -1, 0)]);
    Ut.add(new Wt(i, new ht({ color: a, linewidth: 2 }))), Ut.position.set(o, s, n), Ut.visible = true, fo();
  };
  let uo = 4;
  const fo = () => {
    Ut.visible && Ut.scale.setScalar(uo * Dn(Ut.position));
  };
  window.__hekatanOsnapMarkerRef = Ut, window.__hekatanUpdateOsnapScale = fo, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (uo = t, fo(), y()), uo);
  const Nn = () => {
    Ut.visible = false;
  }, Vs = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Jt = document.createElement("div");
  Jt.id = "hk-osnap-etiqueta", Jt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Jt);
  const Yo = (t, o, s) => {
    const n = Vs[t];
    if (!n) {
      Jt.style.display = "none";
      return;
    }
    Jt.textContent = n, Jt.style.color = "#" + (Xo[t] ?? 16777215).toString(16).padStart(6, "0"), Jt.style.left = o + 18 + "px", Jt.style.top = s - 26 + "px", Jt.style.display = "block";
  }, Ts = () => {
    Jt.style.display = "none";
  }, Cn = new k(), ho = (t, o, s) => {
    const n = p();
    if (!n) return null;
    const a = b.getBoundingClientRect();
    return Cn.set(t, o, s).project(n), !isFinite(Cn.x) || !isFinite(Cn.y) ? null : { x: a.left + (Cn.x * 0.5 + 0.5) * a.width, y: a.top + (-Cn.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = ho;
  const $s = (t, o, s, n, a) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, c = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let m = null;
    const x = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, M = a, _ = (v, z, E, q) => {
      let H;
      if (M) {
        const J = ho(z, E, q);
        if (!J || (H = Math.hypot(J.x - M.x, J.y - M.y), H > kn)) return;
      } else if (H = Math.hypot(z - t, E - o, q - s), H > n) return;
      const K = x[v] ?? 9;
      (!m || K < m.r || K === m.r && H < m.d) && (m = { type: v, x: z, y: E, z: q, d: H, r: K });
    };
    if (i.ori !== false && _("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const v = window.__hekatanGridConfig, z = (v == null ? void 0 : v.minorStep) && v.minorStep > 0 ? v.minorStep : 1, E = ((v == null ? void 0 : v.gridSize) ?? 30) / 2, q = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", H = (J) => Math.round(J / z) * z, K = (J, ge) => Math.abs(J) <= E + 1e-9 && Math.abs(ge) <= E + 1e-9;
      if (q === "xz") {
        const J = H(t), ge = H(s);
        K(J, ge) && _("grid", J, o, ge);
      } else if (q === "yz") {
        const J = H(o), ge = H(s);
        K(J, ge) && _("grid", t, J, ge);
      } else {
        const J = H(t), ge = H(o);
        K(J, ge) && _("grid", J, ge, s);
      }
    }
    (i.node || i.end) && c.forEach((v) => {
      i.node && _("node", v[0], v[1], v[2]);
    });
    for (const v of h) if (!(v.length < 2)) for (let z = 0; z < v.length - 1; z++) {
      const E = c[v[z]], q = c[v[z + 1]];
      if (!(!E || !q) && (i.end && (_("end", E[0], E[1], E[2]), _("end", q[0], q[1], q[2])), i.mid && _("mid", (E[0] + q[0]) / 2, (E[1] + q[1]) / 2, (E[2] + q[2]) / 2), i.nea || i.per)) {
        const H = q[0] - E[0], K = q[1] - E[1], J = q[2] - E[2], ge = H * H + K * K + J * J;
        if (ge < 1e-12) continue;
        const ve = Math.max(0, Math.min(1, ((t - E[0]) * H + (o - E[1]) * K + (s - E[2]) * J) / ge)), Se = E[0] + ve * H, Qe = E[1] + ve * K, Re = E[2] + ve * J;
        i.nea && _("nea", Se, Qe, Re), i.per && _("per", Se, Qe, Re);
      }
    }
    if (i.cen) {
      const v = ((_e2 = e.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const z of v) {
        const E = h[z];
        if (!E || E.length < 3) continue;
        const q = E[0] === E[E.length - 1] ? E.slice(0, -1) : E;
        let H = 0, K = 0, J = 0, ge = 0;
        for (const ve of q) {
          const Se = c[ve];
          Se && (H += Se[0], K += Se[1], J += Se[2], ge++);
        }
        ge >= 3 && _("cen", H / ge, K / ge, J / ge);
      }
    }
    if (i.cen) {
      const v = bn(), z = [...an];
      for (const E of v) z.some((q) => Math.hypot(q.c[0] - E.c[0], q.c[1] - E.c[1], q.c[2] - E.c[2]) < 1e-6 && Math.abs(q.r - E.r) < 1e-6) || z.push(E);
      for (const E of z) {
        if (!c.some((K) => Math.abs(Math.hypot(K[0] - E.c[0], K[1] - E.c[1], K[2] - E.c[2]) - E.r) < 1e-6)) continue;
        const H = Math.hypot(t - E.c[0], o - E.c[1], s - E.c[2]);
        if (H < n || Math.abs(H - E.r) < n) {
          const K = Math.min(H, n * 0.5), J = 3;
          (!m || J < m.r || J === m.r && K < m.d) && (m = { type: "cen", x: E.c[0], y: E.c[1], z: E.c[2], d: K, r: J });
        }
      }
    }
    if (i.int) {
      const v = [];
      for (const z of h) for (let E = 0; E < z.length - 1; E++) {
        const q = c[z[E]], H = c[z[E + 1]];
        if (!q || !H) continue;
        const K = H[0] - q[0], J = H[1] - q[1], ge = H[2] - q[2], ve = K * K + J * J + ge * ge;
        if (ve < 1e-12) continue;
        const Se = Math.max(0, Math.min(1, ((t - q[0]) * K + (o - q[1]) * J + (s - q[2]) * ge) / ve));
        Math.hypot(q[0] + Se * K - t, q[1] + Se * J - o, q[2] + Se * ge - s) < 3 * n && v.push([q, H]);
      }
      for (let z = 0; z < v.length; z++) for (let E = z + 1; E < v.length; E++) {
        const [q, H] = v[z], [K, J] = v[E], ge = [H[0] - q[0], H[1] - q[1], H[2] - q[2]], ve = [J[0] - K[0], J[1] - K[1], J[2] - K[2]], Se = [q[0] - K[0], q[1] - K[1], q[2] - K[2]], Qe = ge[0] * ge[0] + ge[1] * ge[1] + ge[2] * ge[2], Re = ge[0] * ve[0] + ge[1] * ve[1] + ge[2] * ve[2], st = ve[0] * ve[0] + ve[1] * ve[1] + ve[2] * ve[2], nt = ge[0] * Se[0] + ge[1] * Se[1] + ge[2] * Se[2], it = ve[0] * Se[0] + ve[1] * Se[1] + ve[2] * Se[2], Je = Qe * st - Re * Re;
        if (Je < 1e-12) continue;
        const $e = (Re * it - st * nt) / Je, ot = (Qe * it - Re * nt) / Je;
        if ($e < -1e-6 || $e > 1 + 1e-6 || ot < -1e-6 || ot > 1 + 1e-6) continue;
        const Xe = [q[0] + $e * ge[0], q[1] + $e * ge[1], q[2] + $e * ge[2]], ke = [K[0] + ot * ve[0], K[1] + ot * ve[1], K[2] + ot * ve[2]];
        if (Math.hypot(Xe[0] - ke[0], Xe[1] - ke[1], Xe[2] - ke[2]) > 1e-4) continue;
        [q, H, K, J].some((je) => Math.hypot(je[0] - Xe[0], je[1] - Xe[1], je[2] - Xe[2]) < 1e-6) || _("int", Xe[0], Xe[1], Xe[2]);
      }
    }
    const d = window.__hekatanAxisGrids ?? [], $ = window.__hekatanLevels ?? [], ee = d.filter((v) => v && v.start && v.end).map((v) => [v.start, v.end]);
    for (const [v, z] of ee) {
      i.end && (_("end", v[0], v[1], v[2]), _("end", z[0], z[1], z[2]));
      const E = z[0] - v[0], q = z[1] - v[1], H = z[2] - v[2], K = E * E + q * q + H * H;
      if (K < 1e-12) continue;
      const J = Math.max(0, Math.min(1, ((t - v[0]) * E + (o - v[1]) * q + (s - v[2]) * H) / K));
      if (i.nea && _("nea", v[0] + J * E, v[1] + J * q, v[2] + J * H), i.int && Math.abs(H) > 1e-9) for (const ge of $) {
        const ve = (ge.z - v[2]) / H;
        ve < -1e-6 || ve > 1 + 1e-6 || _("int", v[0] + ve * E, v[1] + ve * q, ge.z);
      }
    }
    if (i.int || i.node) for (let v = 0; v < ee.length; v++) for (let z = v + 1; z < ee.length; z++) {
      const [E, q] = ee[v], [H, K] = ee[z], J = q[0] - E[0], ge = q[1] - E[1], ve = K[0] - H[0], Se = K[1] - H[1], Qe = J * Se - ge * ve;
      if (Math.abs(Qe) < 1e-12) continue;
      const Re = E[0] - H[0], st = E[1] - H[1], nt = (ve * st - Se * Re) / Qe, it = (J * st - ge * Re) / Qe;
      if (nt < -1e-6 || nt > 1 + 1e-6 || it < -1e-6 || it > 1 + 1e-6) continue;
      const Je = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      _("int", E[0] + nt * J, E[1] + nt * ge, typeof Je == "number" ? Je : s);
    }
    const G = window.__hekatanDrawingAuxLines, U = (G == null ? void 0 : G.rawVal) ?? (G == null ? void 0 : G.val) ?? G ?? [];
    for (const v of U) {
      if (v.length !== 6) continue;
      const z = [v[0], v[1], v[2]], E = [v[3], v[4], v[5]];
      if (i.end && (_("end", z[0], z[1], z[2]), _("end", E[0], E[1], E[2])), i.mid && _("mid", (z[0] + E[0]) / 2, (z[1] + E[1]) / 2, (z[2] + E[2]) / 2), i.nea || i.per) {
        const q = E[0] - z[0], H = E[1] - z[1], K = E[2] - z[2], J = q * q + H * H + K * K;
        if (J < 1e-12) continue;
        const ge = Math.max(0, Math.min(1, ((t - z[0]) * q + (o - z[1]) * H + (s - z[2]) * K) / J)), ve = z[0] + ge * q, Se = z[1] + ge * H, Qe = z[2] + ge * K;
        i.nea && _("nea", ve, Se, Qe), i.per && _("per", ve, Se, Qe);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
  }, wn = new lt();
  wn.frustumCulled = false, r.add(wn);
  const Zo = new ht({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
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
      let c = [];
      if (i[0] === "pt") {
        const x = o[+i[1]];
        x && (c = [x, [x[0] + 1e-3, x[1], x[2]]]);
      } else if (i[0] === "seg") {
        const x = s[+i[1]] || [], M = o[x[+i[2]]], _ = o[x[+i[2] + 1]];
        M && _ && (c = [M, _]);
      } else i[0] === "poly" && (c = (s[+i[1]] || []).map((M) => o[M]).filter(Boolean));
      if (c.length < 2) continue;
      const h = new Ce().setFromPoints(c.map((x) => new k(x[0], x[1], x[2]))), m = new Pt(h, Zo);
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
  let Ze = [], gt = 0, rn = 0, St = null;
  const zn = document.createElement("div");
  zn.id = "hk-cad-status", zn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", zn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(zn);
  const Ls = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), tt && t.push(`\u{1F512} LOCK ${tt.toUpperCase()}`);
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && t.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, ie = (t) => {
    var _a2;
    const o = t + Ls();
    zn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Is = "Comando:", Rs = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Ze.length, a = (i, c = []) => ({ txt: i, ops: c });
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
        return a(`\xC1REA LIBRE Precise v\xE9rtice ${me.length + 1} (Enter o clic derecho cierra y malla):`);
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
        return a(St ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(St ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(St ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${rn > 0 ? ` (distancia ${rn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return ze.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return ze.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return ze.size ? a(`SELECCI\xD3N ${ze.size} objeto${ze.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(Is);
    }
  }, Yt = () => {
    var _a2, _b, _c, _d, _e2;
    try {
      const t = Rs(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !s ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Yt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    ie(o);
  }, window.__hekatanCadResetPending = () => {
    Ze = [], me = [], W.visible = false, mo(), St = null, y(), ie("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Yt();
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
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ze = [], pe.visible = false, ct.visible = false, T();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y(), Yt();
  }, Bt = () => {
    yn.push(wo()), yn.length > 100 && yn.shift(), Yn.length = 0;
  }, Zn = () => {
    const t = yn.pop();
    if (!t) {
      ie("\u21B6 Nada para deshacer");
      return;
    }
    Yn.push(wo()), Ko(t), ie(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Go = () => {
    const t = Yn.pop();
    if (!t) {
      ie("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(wo()), Ko(t), ie(`\u21B7 Rehacer \u2014 quedan ${Yn.length}`);
  };
  window.__hekatanPushUndo = Bt, window.__hekatanUndo = Zn, window.__hekatanRedo = Go, document.addEventListener("keydown", (t) => {
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
      if (a.length < 3) return ie("Cerrar necesita al menos tres puntos."), true;
      Bt(), e.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return yo(), ie(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Zn(), true;
      Bt();
      const i = a[a.length - 1], c = a.slice(0, -1), h = n.some((M, _) => _ !== n.length - 1 && M.includes(i)) || c.includes(i);
      let m = e.points.rawVal, x = [...n.slice(0, -1), c];
      if (!h && i === m.length - 1 && (m = m.slice(0, -1), e.points.val = m), e.polylines.val = x, c.length) {
        const M = m[c[c.length - 1]];
        M && (A = [M[0], M[1], M[2]]);
      } else A = null, pe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return y(), ie(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${c.length}.`), Yt(), true;
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
    Ze = [], St = null, mo(), tt = null, Te(), pe.visible = false, ct.visible = false, T(), ie("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Yt();
  };
  window.__hekatanFinalizeDraw = yo;
  const Ho = () => {
    var _a2, _b, _c;
    Ze = [], me = [], W.visible = false;
    let t = false;
    ze.size && (ze.clear(), Et(), t = true), yo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ie(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Yt();
  };
  window.__hekatanEscapeCancel = Ho;
  const Wo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return ze.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (t[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = t[+n[1]] || [], i = a[+n[2]], c = a[+n[2] + 1];
        i != null && o.add(i), c != null && o.add(c);
      }
    }), o;
  }, Jo = (t, o, s) => {
    var _a2;
    const n = Wo();
    if (!n.size) return 0;
    Bt();
    const a = e.points.rawVal.map((i, c) => n.has(c) ? [i[0] + t, i[1] + o, i[2] + s] : i);
    e.points.val = a;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Et(), y(), n.size;
  };
  window.__hekatanMoveSelection = Jo;
  const Oo = (t, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!ze.size) {
      ie(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Yt();
      return;
    }
    if (Ze.push(o), Ze.length === 1) {
      A = o, ie(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Yt();
      return;
    }
    const [s, n] = Ze, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Ze = [], pe.visible = false;
    let i = 0;
    t === "move" ? i = Jo(a[0], a[1], a[2]) : (i = Wo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), ie(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), t === "move" && (ze.clear(), Et()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Yt();
  };
  window.__hekatanPasoMoverCopiar = Oo;
  const Ds = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), xo = (t, o, s, n, a, i) => {
    const c = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], h = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], m = [t[0] - s[0], t[1] - s[1], t[2] - s[2]], x = c[0] * c[0] + c[1] * c[1] + c[2] * c[2], M = c[0] * h[0] + c[1] * h[1] + c[2] * h[2], _ = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], d = c[0] * m[0] + c[1] * m[1] + c[2] * m[2], $ = h[0] * m[0] + h[1] * m[1] + h[2] * m[2], ee = x * _ - M * M;
    if (ee < 1e-12) return null;
    const G = (M * $ - _ * d) / ee, U = (x * $ - M * d) / ee;
    if (!a && (G < -1e-6 || G > 1 + 1e-6) || !i && (U < -1e-6 || U > 1 + 1e-6)) return null;
    const v = [t[0] + G * c[0], t[1] + G * c[1], t[2] + G * c[2]], z = [s[0] + U * h[0], s[1] + U * h[1], s[2] + U * h[2]];
    return jt(v, z) > 1e-4 ? null : v;
  }, Bs = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === t).length, 0);
  }, Xs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Ns = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal, n = e.points.rawVal, a = Xs[t];
    if (!St) {
      if (Ke < 0) {
        ie(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      St = { poly: Ke, seg: Math.max(0, We) }, ie(t === "offset" ? `DESFASE l\xEDnea #${St.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${rn > 0 ? ` (${rn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Yt();
      return;
    }
    if (t === "offset") {
      const G = St.poly, U = s[G];
      if (!U || U.length < 2) {
        St = null, ie("DESFASE: esa polil\xEDnea no tiene tramos."), Yt();
        return;
      }
      const v = U.length > 2 && U[0] === U[U.length - 1], z = Ds(), E = [];
      for (let $e = 0; $e < U.length - 1; $e++) {
        const ot = n[U[$e]], Xe = n[U[$e + 1]], ke = [Xe[0] - ot[0], Xe[1] - ot[1], Xe[2] - ot[2]], Be = Math.hypot(ke[0], ke[1], ke[2]) || 1, je = ke[0] / Be, Lt = ke[1] / Be, Xt = ke[2] / Be, It = [z[1] * Xt - z[2] * Lt, z[2] * je - z[0] * Xt, z[0] * Lt - z[1] * je], Qt = Math.hypot(It[0], It[1], It[2]) || 1;
        E.push({ a: ot, b: Xe, n: [It[0] / Qt, It[1] / Qt, It[2] / Qt] });
      }
      let q = 0, H = 1 / 0;
      E.forEach(($e, ot) => {
        const Xe = on(o[0], o[1], o[2], $e.a[0], $e.a[1], $e.a[2], $e.b[0], $e.b[1], $e.b[2]);
        Xe < H && (H = Xe, q = ot);
      });
      const K = E[q], J = Math.sign((o[0] - K.a[0]) * K.n[0] + (o[1] - K.a[1]) * K.n[1] + (o[2] - K.a[2]) * K.n[2]) || 1, ge = rn > 0 ? rn : H;
      if (ge < 1e-6) {
        ie("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const ve = E.map(($e) => ({ a: [$e.a[0] + J * ge * $e.n[0], $e.a[1] + J * ge * $e.n[1], $e.a[2] + J * ge * $e.n[2]], b: [$e.b[0] + J * ge * $e.n[0], $e.b[1] + J * ge * $e.n[1], $e.b[2] + J * ge * $e.n[2]] })), Se = ve.length, Qe = ($e) => {
        const ot = ve[($e - 1 + Se) % Se], Xe = ve[$e % Se];
        return xo(ot.a, ot.b, Xe.a, Xe.b, true, true) ?? Xe.a;
      }, Re = [], st = v ? Se : Se + 1;
      for (let $e = 0; $e < st; $e++) !v && $e === 0 ? Re.push(ve[0].a) : !v && $e === Se ? Re.push(ve[Se - 1].b) : Re.push(Qe($e));
      Bt();
      const nt = n.length;
      e.points.val = [...n, ...Re];
      const it = Re.map(($e, ot) => nt + ot);
      v && it.push(nt);
      let Je = s.slice();
      Je.length && Je[Je.length - 1].length === 0 && (Je = Je.slice(0, -1)), e.polylines.val = [...Je, it, []], St = null, ie(`\u2713 Desfase a ${ge.toFixed(2)} m \u2014 ${Se} tramo${Se === 1 ? "" : "s"} nuevo${Se === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Yt();
      return;
    }
    let i = Ke, c = Math.max(0, We);
    if (i < 0 || i === St.poly && c === St.seg) {
      let U = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, s.forEach((v, z) => {
        for (let E = 0; E < v.length - 1; E++) {
          if (z === St.poly && E === St.seg) continue;
          const q = n[v[E]], H = n[v[E + 1]];
          if (!q || !H) continue;
          const K = on(o[0], o[1], o[2], q[0], q[1], q[2], H[0], H[1], H[2]);
          K < U && (U = K, i = z, c = E);
        }
      }), i < 0) {
        ie(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const h = s[St.poly], m = n[h[St.seg]], x = n[h[St.seg + 1]], M = s[i], _ = M[c], d = M[c + 1];
    if (!m || !x || _ == null || d == null) {
      ie(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const $ = n[_], ee = n[d];
    if (t === "trim") {
      const G = xo($, ee, m, x, false, false);
      if (!G) {
        ie("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Bt();
      const U = n.length;
      e.points.val = [...n, G];
      const v = [...M.slice(0, c + 1), U, ...M.slice(c + 1)];
      e.polylines.val = s.map((E, q) => q === i ? v : E);
      const z = jt(o, $) < jt(o, ee);
      Ln(i, z ? c : c + 1), ie(`\u2713 Recortado en (${G[0].toFixed(2)}, ${G[1].toFixed(2)}, ${G[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const G = xo($, ee, m, x, true, false);
      if (!G) {
        ie("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const v = jt(o, $) < jt(o, ee) ? c : c + 1;
      if (v !== 0 && v !== M.length - 1) {
        ie("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const z = M[v];
      if (jt(G, $) + jt(G, ee) < jt($, ee) + 1e-6) {
        ie("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Bt(), Bs(z) > 1) {
        const q = n.length;
        e.points.val = [...n, G];
        const H = M.slice();
        H[v] = q, e.polylines.val = s.map((K, J) => J === i ? H : K);
      } else e.points.val = n.map((q, H) => H === z ? G : q);
      ie(`\u2713 Alargada hasta (${G[0].toFixed(2)}, ${G[1].toFixed(2)}, ${G[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    y(), Yt();
  };
  window.__hekatanSelectionSize = () => ze.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return ze.clear(), o >= 0 && ze.add(`poly:${o}`), Et(), ie(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), ze.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    ze.clear();
    const s = /* @__PURE__ */ new Set();
    return t.forEach((n, a) => {
      !n || n.length < 2 || (ze.add(`poly:${a}`), n.forEach((i) => s.add(i)));
    }), o.forEach((n, a) => {
      s.has(a) || ze.add(`pt:${a}`);
    }), Et(), ie(`SELECCI\xD3N ${ze.size} objetos (todo el modelo) \xB7 Esc suelta`), ze.size;
  }, window.__hekatanReplicateSelection = (t, o, s, n, a = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const i = [...ze], c = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), x = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), _ = [];
    if (i.forEach((U) => {
      if (U.startsWith("pt:")) {
        const v = +U.slice(3);
        c[v] && x.add(v);
      } else if (U.startsWith("poly:")) {
        const v = +U.slice(5);
        if (!h[v] || h[v].length < 2) return;
        M.add(v), h[v].forEach((z) => x.add(z));
      } else if (U.startsWith("seg:")) {
        const v = U.split(":"), z = +v[1], E = +v[2], q = h[z] || [], H = q[E], K = q[E + 1];
        H != null && K != null && (_.push([H, K]), x.add(H), x.add(K));
      }
    }), !x.size) return 0;
    Bt();
    const d = [...c];
    let $ = h.slice();
    $.length && $[$.length - 1].length === 0 && ($ = $.slice(0, -1));
    const ee = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], G = [...x];
    for (let U = 1; U <= n; U++) {
      const v = a + U, z = t * v, E = o * v, q = s * v, H = /* @__PURE__ */ new Map();
      G.forEach((K) => {
        H.set(K, d.length), d.push([c[K][0] + z, c[K][1] + E, c[K][2] + q]);
      }), M.forEach((K) => {
        const J = h[K].map((ve) => H.has(ve) ? H.get(ve) : ve), ge = $.length;
        $.push(J), m.has(K) && ee.push(ge);
      }), _.forEach(([K, J]) => {
        $.push([H.get(K), H.get(J)]);
      });
    }
    $.push([]), e.points.val = d, e.polylines && (e.polylines.val = $), e.areas && (e.areas.val = ee);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return y(), n;
  }, window.__hekatanVoladoSelection = (t, o = {}) => {
    var _a2, _b, _c;
    const s = Number(t);
    if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
    const n = o.losa !== false, a = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", c = e.points.rawVal, h = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = [];
    if ([...ze].forEach((G) => {
      if (G.startsWith("seg:")) {
        const U = G.split(":"), v = +U[1], z = +U[2], E = h[v] || [], q = E[z], H = E[z + 1];
        q != null && H != null && m.push([q, H]);
      } else if (G.startsWith("poly:")) {
        const U = h[+G.slice(5)] || [];
        for (let v = 0; v + 1 < U.length; v++) m.push([U[v], U[v + 1]]);
      }
    }), !m.length) return 0;
    let x = 0, M = 0;
    for (const G of c) x += G[0], M += G[1];
    x /= Math.max(1, c.length), M /= Math.max(1, c.length), Bt();
    const _ = [...c];
    let d = h.slice();
    d.length && d[d.length - 1].length === 0 && (d = d.slice(0, -1));
    const $ = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let ee = 0;
    for (const [G, U] of m) {
      const v = c[G], z = c[U];
      if (!v || !z) continue;
      const E = z[0] - v[0], q = z[1] - v[1], H = Math.hypot(E, q);
      if (H < 1e-6) continue;
      let K = -q / H, J = E / H;
      const ge = (v[0] + z[0]) / 2, ve = (v[1] + z[1]) / 2;
      (ge - x) * K + (ve - M) * J < 0 && (K = -K, J = -J);
      const Se = i === "ambos" ? [1, -1] : [1];
      for (const Qe of Se) {
        const Re = K * s * Qe, st = J * s * Qe, nt = _.length;
        _.push([v[0] + Re, v[1] + st, v[2]]);
        const it = _.length;
        _.push([z[0] + Re, z[1] + st, z[2]]), d.push([G, nt]), d.push([U, it]), a && d.push([nt, it]), n && ($.push(d.length), d.push([G, U, it, nt, G])), ee++;
      }
    }
    if (!ee) return 0;
    d.push([]), e.points.val = _, e.polylines && (e.polylines.val = d), e.areas && (e.areas.val = $);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return y(), ee;
  }, b.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, ln > 5) {
      ln = 0;
      return;
    }
    ln = 0;
    const o = g(t);
    if (!o) return;
    P.setFromCamera(V, o);
    const s = ce();
    if (!s.length) return;
    {
      const a = o.position.distanceTo(u.target) || 1, i = s[0].distance ?? o.position.distanceTo(s[0].point), c = s[0].point;
      if (!isFinite(c.x) || !isFinite(c.y) || !isFinite(c.z) || i > Math.max(a * 12, 300)) {
        ie("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = s[0].point;
    (t.ctrlKey || t.metaKey) && (n = new k(Math.round(s[0].point.x), Math.round(s[0].point.y), Math.round(s[0].point.z)));
    {
      const a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = a[a.length - 1] ?? [], c = e.points.rawVal ?? [];
      if (i.length > 0) {
        const h = c[i[i.length - 1]];
        if (h) {
          const m = !!window.__hekatanOrthoMode;
          let x = tt;
          if (!x && m) {
            const M = Math.abs(n.x - h[0]), _ = Math.abs(n.y - h[1]), d = Math.abs(n.z - h[2]);
            x = M >= _ && M >= d ? "x" : _ >= d ? "y" : "z";
          }
          x === "x" ? n = new k(n.x, h[1], h[2]) : x === "y" ? n = new k(h[0], n.y, h[2]) : x === "z" && (n = new k(h[0], h[1], n.z));
        }
      }
    }
    if (Ue && Math.abs(t.clientX - Ue.x) <= 3 && Math.abs(t.clientY - Ue.y) <= 3) n = Ue.p.clone();
    else if (Mt) n = Mt.clone(), ie(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n = new k(i.x, i.y, i.z), ie(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const c = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0;
        c && h > 0 && (n = new k(Math.round(n.x / h) * h, Math.round(n.y / h) * h, Math.round(n.z / h) * h));
      }
    }
    Qo(n, t);
  });
  const Qo = (t, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (Zt) {
        Nt && Bn();
        const { kind: n, a, b: i } = Zt, c = i !== void 0 ? `${n}:${a}:${i}` : `${n}:${a}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || ze.clear(), ze.has(c) ? ze.delete(c) : ze.add(c), Et(), ie(`\u2713 Seleccionados ${ze.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), a = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Nt ? (Ro(Nt.x, Nt.y, a, i, n), Nt = null) : n || (Nt = { x: a, y: i }, ie("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), po(a, i, a + 1, i + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], ie(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const a = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], a);
      ie(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      Oo(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "delete") {
      if (yt >= 0) {
        const n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = yt;
        if (i >= 0 && i < a.length) {
          Bt();
          const c = a.slice(0, i).concat(a.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = c : window.__hekatanDrawingAuxLines = c, ie(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), yt = -1, pt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (Ke >= 0) {
        const n = Ke, a = We;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (sn(n), ie(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : a >= 0 ? (Ln(n, a), ie(`\u{1F5D1} Segmento ${a + 1} de polil\xEDnea #${n + 1} borrado`)) : (sn(n), ie(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else ie("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length === 1) {
        ie("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, a] = Ze, i = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
      Math.abs(a[0] - n[0]);
      const c = Math.abs(a[1] - n[1]), m = Math.abs(a[2] - n[2]) < 1e-3 ? "xy" : c < 1e-3 ? "xz" : "yz", x = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, x, m), ie(`\u2713 C\xEDrculo dibujado en ${m.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${x} segmentos`), Ze = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (s === "arc") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length === 1) {
        ie("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ze.length === 2) {
        ie("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, a, i] = Ze, c = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, a, i, c), ie(`\u2713 Arco dibujado \u2014 ${c} segmentos`), Ze = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length === 1) {
        ie("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ze;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, a), ie(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ze = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length === 1) {
        ie("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ze;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, a), ie(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ze = [];
      return;
    }
    if (s === "polyarea") {
      me.push([t.x, t.y, t.z]), W.geometry.setFromPoints(me.map((n) => new k(n[0], n[1], n[2]))), W.visible = me.length >= 1, ie(`\u25B0 \xC1rea libre \u2014 ${me.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (s === "plane3") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length < 3) {
        ie(`\u25E3 Plano inclinado \u2014 punto ${Ze.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, a, i] = Ze, c = (_o = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o.call(window, n, a, i);
      ie(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ze = [];
      return;
    }
    if (s === "col") {
      Bt();
      const n = t.z, a = gt && gt > 0 ? gt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + a]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], gt = 0, ie(`\u258C Columna creada \u2014 h=${a.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length === 1) {
        ie("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, a] = Ze, i = gt && gt > 0 ? gt : 3;
      Bt();
      const c = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [a[0], a[1], a[2]], [a[0], a[1], a[2] + i], [n[0], n[1], n[2] + i]];
      const h = e.polylines.rawVal;
      if (h.length - 1, e.polylines.val = [...h.slice(0, -1), ...h[h.length - 1].length > 0 ? [h[h.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], e.areas) {
        const m = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, m];
      }
      ie(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ze = [], gt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Bt();
      const n = gt && gt > 0 ? gt : 3, a = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, a], [t.x, t.y, a + n]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], gt = 0, ie(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, a = vn(t.x, t.y, t.z, n);
      if (!a) {
        ie("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, c = e.points.rawVal, h = i[a.polyIdx], m = c[h[a.segIdx]], x = c[h[a.segIdx + 1]];
      if (!m || !x) {
        ie("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = gt && gt > 0 ? gt : 3;
      Bt();
      const _ = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [m[0], m[1], m[2]], [x[0], x[1], x[2]], [x[0], x[1], x[2] + M], [m[0], m[1], m[2] + M]];
      const d = e.polylines.rawVal;
      if (e.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [_, _ + 1, _ + 2, _ + 3, _], []], e.areas) {
        const $ = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, $];
      }
      gt = 0, ie(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
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
      ie(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length === 1) {
        ie("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, a] = Ze, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const M = i.rawVal ?? i.val ?? [];
        i.val = [...M, [n[0], n[1], n[2], a[0], a[1], a[2]]];
      }
      const c = a[0] - n[0], h = a[1] - n[1], m = a[2] - n[2], x = Math.sqrt(c * c + h * h + m * m);
      ie(`\u2713 L\xEDnea auxiliar creada \u2014 L=${x.toFixed(2)}m (cyan, no FEM)`), Ze = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Ns(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "chaflan") {
      if (Ze.push([t.x, t.y, t.z]), Ze.length === 1) {
        ie("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ze, i = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, a, i, c, 6);
      const h = Math.abs(a[0] - n[0]).toFixed(1), m = Math.abs(a[1] - n[1]).toFixed(1);
      ie(`\u2713 Losa con chaflanes dibujada \u2014 ${h}\xD7${m}m, r=${i}m, ${c} seg/chafl\xE1n`), Ze = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (F = false, Bt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, a = n.length - 1, i = n[a] ?? [];
      if (s === "line" && i.length >= 2) {
        ie(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, a]), ie("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") ie(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (s === "line") ie("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") ie("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ie(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  b.addEventListener("click", () => Yt()), b.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && me.length >= 3) {
      t.preventDefault();
      const s = pn();
      ie(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), b.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = g(t);
    if (!o) return;
    P.setFromCamera(V, o);
    const s = ce();
    if (de.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const c = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], h = c[c.length - 1] ?? [], m = e.points.rawVal ?? [];
        if (h.length > 0) {
          const x = m[h[h.length - 1]];
          if (x) {
            const M = !!window.__hekatanOrthoMode;
            let _ = tt;
            if (!_ && M) {
              const d = Math.abs(n.x - x[0]), $ = Math.abs(n.y - x[1]), ee = Math.abs(n.z - x[2]);
              _ = d >= $ && d >= ee ? "x" : $ >= ee ? "y" : "z";
            }
            _ === "x" ? n.set(n.x, x[1], x[2]) : _ === "y" ? n.set(x[0], n.y, x[2]) : _ === "z" && n.set(x[0], x[1], n.z);
          }
        }
      }
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const c = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0.5;
        c && h > 0 && (n.x = Math.round(n.x / h) * h, n.y = Math.round(n.y / h) * h, n.z = Math.round(n.z / h) * h);
      }
      de.geometry.setAttribute("position", new kt(n.toArray(), 3));
    }
    y();
  }), b.addEventListener("pointermove", (t) => {
    var _a2;
    const o = g(t);
    if (!o) return;
    P.setFromCamera(V, o);
    let s = false;
    const n = P.intersectObject(B), a = ce();
    if (n.length && a.length) {
      const i = new k(...e.points.rawVal[n[0].index]), c = new k(...a[0].point), h = i.sub(c), m = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      m.transformDirection(O.matrixWorld), Math.abs(h.dot(m)) < 1e-4 && (s = true);
    }
    de.visible = !s;
  });
  let go = false, vo;
  b.addEventListener("pointermove", (t) => {
    var _a2;
    if (!ln) return;
    const o = g(t);
    if (!o) return;
    P.setFromCamera(V, o);
    let s = false;
    const n = P.intersectObject(B), a = ce();
    if (n.length && a.length) {
      const c = new k(...e.points.rawVal[n[0].index]), h = new k(...a[0].point), m = c.sub(h), x = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      x.transformDirection(O.matrixWorld), Math.abs(m.dot(x)) < 1e-4 && (s = true);
    }
    if (s && ln < 5 && (go = true, u.enabled = false, vo = n[0].index), !go || ln % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (vo !== void 0) {
      let c = a[0].point;
      (t.ctrlKey || t.metaKey) && (c = new k(Math.round(c.x), Math.round(c.y), Math.round(c.z))), i[vo] = c.toArray();
    }
    e.points.val = i;
  }), b.addEventListener("pointerup", () => {
    u.enabled = true, go = false;
  }), b.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = g(t);
    if (!o) return;
    P.setFromCamera(V, o);
    let s = false;
    const n = P.intersectObject(B), a = ce();
    if (n.length && a.length) {
      const h = new k(...e.points.rawVal[n[0].index]), m = new k(...a[0].point), x = h.sub(m), M = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      M.transformDirection(O.matrixWorld), Math.abs(x.dot(M)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const c = e.polylines.rawVal.map((h) => h.filter((m) => m !== n[0].index)).map((h) => h.map((m) => m > n[0].index ? m - 1 : m)).filter((h) => h.length);
    c.push([]), e.polylines.val = c;
  });
}
function Ea(e, l, r) {
  const w = Math.round(14.999999999999998), f = { position: e.position.clone(), quaternion: e.quaternion.clone() }, b = setInterval(P, 1e3 / 30);
  let y = 0;
  function P() {
    y++;
    const V = y / w;
    e.position.lerpVectors(f.position, l.position, V), e.quaternion.slerpQuaternions(f.quaternion, l.quaternion, V), r && r(), y == w && clearInterval(b);
  }
}
function Va(e, l, r, p) {
  const u = ca(r, e.elements, p);
  return j.derive(() => {
    u.visible = l.shellResults.val != "none";
  }), u;
}
const Ta = 6, Fo = 10, $a = 0.012;
function La(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ia(e, l, r, p) {
  if (!r && !p) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && r) {
    const w = r[e];
    if (w && w.has(l)) return w.get(l);
  }
  return null;
}
function Ra(e, l, r, p) {
  const u = new lt(), w = new Ms();
  w.setColorMap("rainbow");
  const f = new Ht(), b = j.state([]);
  return j.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = r.val, P = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], V = La(l.frameResults.val);
    if (u.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), u.clear(), !V || P.length === 0 || y.length === 0) {
      b.val = [];
      return;
    }
    const g = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, O = (_c = e.deformOutputs) == null ? void 0 : _c.val, he = [], be = [];
    for (let L = 0; L < P.length; L++) {
      if (P[L].length !== 2) continue;
      const se = Ia(V, L, g, O);
      se && (he.push(se[0], se[1]), be.push({ idx: L, vals: se }));
    }
    if (he.length === 0) {
      b.val = [];
      return;
    }
    const re = Math.min(...he), I = Math.max(...he);
    w.setMin(re), w.setMax(I), b.val = he;
    const ce = [1 / 0, 1 / 0, 1 / 0], B = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of y) for (let te = 0; te < 3; te++) ce[te] = Math.min(ce[te], L[te]), B[te] = Math.max(B[te], L[te]);
    const ae = Math.max(B[0] - ce[0], B[1] - ce[1], B[2] - ce[2], 1) * $a, R = [], A = [], X = [];
    let F = 0;
    for (const { idx: L, vals: te } of be) {
      const se = P[L], le = y[se[0]], ne = y[se[1]];
      if (!le || !ne) continue;
      const D = new k(ne[0] - le[0], ne[1] - le[1], ne[2] - le[2]), pe = D.length();
      if (pe < 1e-10) continue;
      D.normalize();
      const W = Math.abs(D.y) < 0.99 ? new k(0, 1, 0) : new k(1, 0, 0), me = new k().crossVectors(D, W).normalize(), we = new k().crossVectors(D, me).normalize(), Fe = Fo + 1, Me = Ta;
      for (let Ie = 0; Ie < Fe; Ie++) {
        const Ne = Ie / Fo, ct = le[0] + D.x * pe * Ne, mt = le[1] + D.y * pe * Ne, S = le[2] + D.z * pe * Ne, Y = te[0] + (te[1] - te[0]) * Ne, Q = w.getColor(Y) ?? new Ht(0, 0, 0);
        f.copy(Q).convertSRGBToLinear();
        for (let Z = 0; Z < Me; Z++) {
          const ye = Z / Me * Math.PI * 2, ue = Math.cos(ye), _e = Math.sin(ye);
          R.push(ct + (me.x * ue + we.x * _e) * ae, mt + (me.y * ue + we.y * _e) * ae, S + (me.z * ue + we.z * _e) * ae), A.push(f.r, f.g, f.b);
        }
      }
      for (let Ie = 0; Ie < Fo; Ie++) for (let Ne = 0; Ne < Me; Ne++) {
        const ct = (Ne + 1) % Me, mt = F + Ie * Me + Ne, S = F + Ie * Me + ct, Y = F + (Ie + 1) * Me + Ne, Q = F + (Ie + 1) * Me + ct;
        X.push(mt, S, Q), X.push(mt, Q, Y);
      }
      F += Fe * Me;
    }
    if (R.length === 0) return;
    const C = new Ce();
    C.setAttribute("position", new kt(R, 3)), C.setAttribute("color", new kt(A, 3)), C.setIndex(X), C.computeVertexNormals();
    const N = new ft({ vertexColors: true, side: zt }), T = new rt(C, N);
    T.frustumCulled = false, u.add(T);
  }), u.__colorMapValues = b, u;
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
  const l = new lt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const r = new xn(1, 16, 16), p = new ft({ color: Ya, transparent: true, opacity: 0.85, depthTest: false }), u = new rt(r, p);
  u.visible = false, u.renderOrder = 100, l.add(u);
  const w = new Ce(), f = new ht({ color: hs, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), b = new Wt(w, f);
  b.visible = false, b.renderOrder = 100, l.add(b);
  const y = new ft({ color: hs, transparent: true, opacity: 0.7, depthTest: false }), P = new rt(new cs(1, 1, 1, 12), y);
  P.visible = false, P.renderOrder = 100, l.add(P);
  const V = new Ce(), g = new ft({ color: Za, transparent: true, opacity: 0.45, side: zt, depthTest: false }), O = new rt(V, g);
  O.visible = false, O.renderOrder = 100, l.add(O);
  const he = new Ce(), be = new ht({ color: Ua, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), re = new Wt(he, be);
  re.visible = false, re.renderOrder = 100, l.add(re);
  const I = new ft({ color: Jn, transparent: true, opacity: 0.95, depthTest: false }), ce = new ft({ color: Jn, transparent: true, opacity: 0.85, depthTest: false }), B = new cs(1, 1, 1, 12), de = new ft({ color: Jn, transparent: true, opacity: 0.55, side: zt, depthTest: false }), ae = new ht({ color: Jn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), R = [];
  window.__hekatanModelSelection = R;
  const A = new lt();
  A.renderOrder = 101, l.add(A);
  const X = document.createElement("div");
  Object.assign(X.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), X.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(X);
  }, 0);
  function F(S) {
    const Y = e.derivedNodes.rawVal;
    return !Y || S < 0 || S >= Y.length ? null : new k(Y[S][0], Y[S][1], Y[S][2]);
  }
  function C(S, Y) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const Q = e.getActiveCamera();
    if (!Q || !e.mesh) return null;
    const Z = e.rendererElm.getBoundingClientRect(), ye = S - Z.left, ue = Y - Z.top, _e = e.derivedNodes.rawVal, xe = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!_e || !xe) return null;
    const De = /* @__PURE__ */ new Map(), Le = (Ue) => {
      if (De.has(Ue)) return De.get(Ue);
      const Pe = F(Ue);
      if (!Pe) return De.set(Ue, null), null;
      const Te = Pe.clone().project(Q), He = (Te.x * 0.5 + 0.5) * Z.width, Ve = (-Te.y * 0.5 + 0.5) * Z.height, at = { x: He, y: Ve, z: Te.z };
      return De.set(Ue, at), at;
    }, Ge = /* @__PURE__ */ new Set();
    for (const Ue of xe) if (Ue) for (const Pe of Ue) Ge.add(Pe);
    const Oe = 8;
    let fe = -1, Ae = Oe;
    for (let Ue = 0; Ue < _e.length; Ue++) {
      if (!Ge.has(Ue)) continue;
      const Pe = Le(Ue);
      if (!Pe || Pe.z < -1 || Pe.z > 1) continue;
      const Te = Pe.x - ye, He = Pe.y - ue, Ve = Math.sqrt(Te * Te + He * He);
      Ve < Ae && (Ae = Ve, fe = Ue);
    }
    const Ee = Da(), qe = Xa[Ee.dispUnit] ?? 1e3, Ye = Ba[Ee.forceUnit] ?? 1;
    if (fe >= 0) {
      const Ue = _e[fe];
      let Pe = `Nodo ${fe}
(${Ue[0].toFixed(3)}, ${Ue[1].toFixed(3)}, ${Ue[2].toFixed(3)})`;
      const Te = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Te == null ? void 0 : Te.deformations) {
        const He = Te.deformations.get(fe);
        if (He && (Pe += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Pe += `
Ux = ${vt(He[0] * qe, 3)} ${Ee.dispUnit}`, Pe += `
Uy = ${vt(He[1] * qe, 3)} ${Ee.dispUnit}`, Pe += `
Uz = ${vt(He[2] * qe, 3)} ${Ee.dispUnit}`, (Math.abs(He[3]) > 1e-9 || Math.abs(He[4]) > 1e-9 || Math.abs(He[5]) > 1e-9) && (Pe += `
Rx = ${vt(He[3] * 1e3, 3)} mrad`, Pe += `
Ry = ${vt(He[4] * 1e3, 3)} mrad`, Pe += `
Rz = ${vt(He[5] * 1e3, 3)} mrad`)), Te.reactions) {
          const Ve = Te.reactions.get(fe);
          Ve && (Math.abs(Ve[0]) > 1e-9 || Math.abs(Ve[1]) > 1e-9 || Math.abs(Ve[2]) > 1e-9 || Math.abs(Ve[3]) > 1e-6 || Math.abs(Ve[4]) > 1e-6 || Math.abs(Ve[5]) > 1e-6) && (Pe += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Pe += `
Fx = ${vt(Ve[0] * Ye)} ${Ee.forceUnit}`, Pe += `
Fy = ${vt(Ve[1] * Ye)} ${Ee.forceUnit}`, Pe += `
Fz = ${vt(Ve[2] * Ye)} ${Ee.forceUnit}`, (Math.abs(Ve[3]) > 1e-6 || Math.abs(Ve[4]) > 1e-6 || Math.abs(Ve[5]) > 1e-6) && (Pe += `
Mx = ${vt(Ve[3] * Ye)} ${Ee.forceUnit}\xB7m`, Pe += `
My = ${vt(Ve[4] * Ye)} ${Ee.forceUnit}\xB7m`, Pe += `
Mz = ${vt(Ve[5] * Ye)} ${Ee.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: fe, info: Pe };
    }
    const qt = 5;
    let et = -1, tt = qt, Mt = "frame";
    for (let Ue = 0; Ue < xe.length; Ue++) {
      const Pe = xe[Ue];
      if (!(!Pe || Pe.length < 2)) {
        if (Pe.length === 2) {
          const Te = Le(Pe[0]), He = Le(Pe[1]);
          if (!Te || !He || Te.z < -1 || Te.z > 1 || He.z < -1 || He.z > 1) continue;
          const Ve = Ka(ye, ue, Te.x, Te.y, He.x, He.y);
          Ve < tt && (tt = Ve, et = Ue, Mt = "frame");
        } else if (Pe.length === 3 || Pe.length === 4) {
          const Te = [];
          let He = true;
          for (const Ve of Pe) {
            const at = Le(Ve);
            if (!at || at.z < -1 || at.z > 1) {
              He = false;
              break;
            }
            Te.push(at);
          }
          if (!He) continue;
          if (Ga(ye, ue, Te)) {
            const at = Te.reduce((dt, pt) => dt + pt.z, 0) / Te.length * 1e-3;
            at < tt && (tt = at, et = Ue, Mt = "shell");
          }
        } else if (Pe.length === 8) {
          const Te = [];
          let He = true;
          for (const Ke of Pe) {
            const We = Le(Ke);
            if (!We || We.z < -1 || We.z > 1) {
              He = false;
              break;
            }
            Te.push(We);
          }
          if (!He) continue;
          const Ve = Math.min(...Te.map((Ke) => Ke.x)), at = Math.max(...Te.map((Ke) => Ke.x)), dt = Math.min(...Te.map((Ke) => Ke.y)), pt = Math.max(...Te.map((Ke) => Ke.y));
          if (ye >= Ve && ye <= at && ue >= dt && ue <= pt) {
            const We = Te.reduce((yt, ze) => yt + ze.z, 0) / Te.length * 1e-3;
            We < tt && (tt = We, et = Ue, Mt = "solid");
          }
        }
      }
    }
    if (et >= 0) {
      const Ue = xe[et];
      let Te = `${Mt === "frame" ? "Frame" : Mt === "shell" ? "Shell" : "Solid"} ${et}`;
      const He = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Ve = (_g = (_f = He == null ? void 0 : He.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, et);
      if (Ve) {
        Ve.name && (Te += `
  \u{1F4CB} ${Ve.name}`), Ve.shape && (Te += `
  Shape: ${Ve.shape}`);
        const at = /concrete|hormig|rect.*sólida/i.test(Ve.shape || ""), dt = at ? 100 : 1e3, pt = at ? "cm" : "mm", Ke = (yt) => {
          const ze = yt * dt;
          return Math.abs(ze - Math.round(ze)) < 0.05 ? `${Math.round(ze)}` : `${ze.toFixed(1)}`;
        }, We = [];
        if (Ve.D != null && We.push(`D=${Ke(Ve.D)}`), Ve.B != null && We.push(`B=${Ke(Ve.B)}`), Ve.TF != null && We.push(`TF=${Ke(Ve.TF)}`), Ve.TW != null && We.push(`TW=${Ke(Ve.TW)}`), Ve.t != null && We.push(`t=${Ke(Ve.t)}`), We.length && (Te += `
  Dim: ${We.join(" ")} ${pt}`), Ve.material) {
          let yt = Ve.material;
          Ve.fillMaterial && (yt += ` + FILL "${Ve.fillMaterial}"`), Te += `
  Mat: ${yt}`;
        }
      } else {
        const at = (_i = (_h = He == null ? void 0 : He.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, et), dt = (_k = (_j = He == null ? void 0 : He.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, et);
        at ? (Te += `
  ${at}`, dt && !at.includes(dt) && (Te += `  (${dt})`)) : dt && (Te += `
  Material: ${dt}`);
      }
      if (Te += `
nodos: [${Ue.join(", ")}]`, Mt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const at = e.mesh.analyzeOutputs.rawVal, dt = Na[Ee.stressUnit] ?? 1, pt = [["bendingXX", "Mxx", Ye, `${Ee.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ye, `${Ee.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ye, `${Ee.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ye, `${Ee.forceUnit}/m`], ["membraneYY", "Nyy", Ye, `${Ee.forceUnit}/m`], ["membraneXY", "Nxy", Ye, `${Ee.forceUnit}/m`], ["shearX", "Qx", Ye, `${Ee.forceUnit}/m`], ["shearY", "Qy", Ye, `${Ee.forceUnit}/m`], ["vonMises", "\u03C3VM", dt, Ee.stressUnit], ["pressure", "p", dt, Ee.stressUnit]], Ke = [];
        for (const [We, yt, ze, Ft] of pt) {
          const bt = at == null ? void 0 : at[We];
          if (bt && bt instanceof Map) {
            const Rt = bt.get(et);
            if (Rt != null) {
              if (typeof Rt == "number") Ke.push(`${yt} = ${vt(Rt * ze, 3)} ${Ft}`);
              else if (Array.isArray(Rt)) {
                let At = Rt[0];
                for (const Tt of Rt) Math.abs(Tt) > Math.abs(At) && (At = Tt);
                Ke.push(`${yt} = ${vt(At * ze, 3)} ${Ft}`);
              }
            }
          }
        }
        Ke.length > 0 && (Te += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ke.slice(0, 8).join(`
`));
      }
      if (Mt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const at = e.mesh.deformOutputs.rawVal, dt = e.mesh.elementInputs.rawVal, pt = at == null ? void 0 : at.deformations;
        if (pt && Ue.length === 2) {
          const Ke = pt.get(Ue[0]), We = pt.get(Ue[1]), yt = _e[Ue[0]], ze = _e[Ue[1]];
          if (Ke && We && yt && ze) {
            const Ft = ze[0] - yt[0], bt = ze[1] - yt[1], Rt = ze[2] - yt[2], At = Math.sqrt(Ft * Ft + bt * bt + Rt * Rt);
            if (At > 1e-9) {
              const Tt = Ft / At, nn = bt / At, Zt = Rt / At, gn = (We[0] - Ke[0]) * Tt + (We[1] - Ke[1]) * nn + (We[2] - Ke[2]) * Zt, Et = ((_n = dt.elasticities) == null ? void 0 : _n.get(et)) ?? 0, on = ((_o = dt.areas) == null ? void 0 : _o.get(et)) ?? 0, vn = ((_p = dt.momentsOfInertiaY) == null ? void 0 : _p.get(et)) ?? 0, $n = ((_q = dt.momentsOfInertiaZ) == null ? void 0 : _q.get(et)) ?? 0, so = ((_r = dt.torsionalConstants) == null ? void 0 : _r.get(et)) ?? 0, ao = ((_s2 = dt.shearModuli) == null ? void 0 : _s2.get(et)) ?? Et / 2.6, sn = Et * on * (gn / At), Ln = (We[3] - Ke[3]) * Tt + (We[4] - Ke[4]) * nn + (We[5] - Ke[5]) * Zt, an = ao * so * (Ln / At), In = We[4] - Ke[4], Rn = We[5] - Ke[5], bn = Et * vn * In / At, pn = Et * $n * Rn / At;
              Te += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Te += `
L = ${vt(At, 3)} m`, Te += `
\u0394L = ${vt(gn * qe, 3)} ${Ee.dispUnit}`, Te += `
\u03B5 = ${vt(gn / At, 6)}`, Math.abs(sn) > 1e-6 && (Te += `
N \u2248 ${vt(sn * Ye)} ${Ee.forceUnit}`), Math.abs(an) > 1e-6 && (Te += `
T \u2248 ${vt(an * Ye)} ${Ee.forceUnit}\xB7m`), Math.abs(bn) > 1e-6 && (Te += `
My \u2248 ${vt(bn * Ye)} ${Ee.forceUnit}\xB7m`), Math.abs(pn) > 1e-6 && (Te += `
Mz \u2248 ${vt(pn * Ye)} ${Ee.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Mt, idx: et, info: Te };
    }
    return null;
  }
  function N(S, Y, Q) {
    var _a2, _b, _c;
    if (u.visible = false, b.visible = false, P.visible = false, O.visible = false, re.visible = false, !S || !e.mesh) {
      X.style.display = "none", e.render();
      return;
    }
    const Z = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (S.type === "node") {
      const xe = F(S.idx);
      if (xe) {
        const De = e.derivedNodes.rawVal ?? [];
        let Le = 1;
        if (De.length >= 2) {
          let fe = [1 / 0, 1 / 0, 1 / 0], Ae = [-1 / 0, -1 / 0, -1 / 0];
          for (const Ee of De) for (let qe = 0; qe < 3; qe++) Ee[qe] < fe[qe] && (fe[qe] = Ee[qe]), Ee[qe] > Ae[qe] && (Ae[qe] = Ee[qe]);
          Le = Math.max(Ae[0] - fe[0], Ae[1] - fe[1], Ae[2] - fe[2], 0.1);
        }
        const Ge = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Oe = 0.021 * Le * Ge;
        u.position.copy(xe), u.scale.setScalar(Oe), u.visible = true;
      }
    } else if (S.type === "frame" && Z) {
      const xe = Z[S.idx], De = F(xe[0]), Le = F(xe[1]);
      if (De && Le) {
        const Ge = De.clone().add(Le).multiplyScalar(0.5), Oe = Le.clone().sub(De), fe = Oe.length(), qe = e.getActiveCamera().position.distanceTo(Ge) * 35e-4;
        P.position.copy(Ge);
        const Ye = new k(0, 1, 0), qt = Ye.clone().cross(Oe).normalize(), et = Ye.angleTo(Oe);
        P.quaternion.setFromAxisAngle(qt, et), P.scale.set(qe, fe, qe), P.visible = true;
      }
    } else if (S.type === "shell" && Z) {
      const xe = Z[S.idx], De = [], Le = [];
      for (const Ge of xe) {
        const Oe = F(Ge);
        if (!Oe) return;
        De.push(Oe.x, Oe.y, Oe.z);
      }
      xe.length === 4 ? Le.push(0, 1, 2, 0, 2, 3) : xe.length === 3 && Le.push(0, 1, 2), V.setAttribute("position", new kt(De, 3)), V.setIndex(Le), V.computeVertexNormals(), O.visible = true;
    } else if (S.type === "solid" && Z) {
      const xe = Z[S.idx], De = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Le = [];
      for (const [Ge, Oe] of De) {
        const fe = F(xe[Ge]), Ae = F(xe[Oe]);
        fe && Ae && Le.push(fe.x, fe.y, fe.z, Ae.x, Ae.y, Ae.z);
      }
      he.setAttribute("position", new kt(Le, 3)), re.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      X.style.display = "none", e.render();
      return;
    }
    X.textContent = S.info, X.style.whiteSpace = "pre-line", X.style.display = "block";
    const ue = e.rendererElm.getBoundingClientRect(), _e = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? ue;
    X.style.left = `${Y - _e.left}px`, X.style.top = `${Q - _e.top}px`, e.render();
  }
  let T = "", L = 0, te = 0;
  const se = window.__hekatanHoverDebug ?? false, le = (S) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const Y = C(S.clientX, S.clientY);
      if (se && te < 5) {
        const Z = e.derivedNodes.rawVal, ye = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${S.clientX}, ${S.clientY}) nodes=${(Z == null ? void 0 : Z.length) ?? 0} elems=${(ye == null ? void 0 : ye.length) ?? 0} hover=`, Y), te++;
      }
      const Q = Y ? `${Y.type}:${Y.idx}` : "";
      if (Q !== T) T = Q, N(Y, S.clientX, S.clientY);
      else if (Y) {
        const Z = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        X.style.left = `${S.clientX - Z.left}px`, X.style.top = `${S.clientY - Z.top}px`;
      }
    });
  };
  let ne = null;
  const D = () => {
    T = "", u.visible = false, b.visible = false, P.visible = false, O.visible = false, re.visible = false, X.style.display = "none", e.render();
  }, pe = (S) => {
    const Y = e.rendererElm.getBoundingClientRect(), Q = S.clientX - Y.left, Z = S.clientY - Y.top;
    (Q < -2 || Z < -2 || Q > Y.width + 2 || Z > Y.height + 2) && (ne && clearTimeout(ne), ne = window.setTimeout(D, 200));
  }, W = () => {
    ne && (clearTimeout(ne), ne = null);
  };
  e.rendererElm.addEventListener("pointermove", le), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", W);
  function me() {
    var _a2, _b, _c;
    const S = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return S === "select" || S === "none" || !S;
  }
  let we = null;
  e.rendererElm.addEventListener("pointerdown", (S) => {
    S.button === 0 && (we = { x: S.clientX, y: S.clientY });
  }), e.rendererElm.addEventListener("pointerup", (S) => {
    if (S.button !== 0 || !we) return;
    const Y = S.clientX - we.x, Q = S.clientY - we.y;
    if (we = null, Y * Y + Q * Q > 9 || !me()) return;
    const Z = C(S.clientX, S.clientY);
    Z ? (ct({ type: Z.type, idx: Z.idx }, S.shiftKey), Ne()) : mt();
  }), window.addEventListener("keydown", (S) => {
    if (S.key !== "Escape" || !R.length) return;
    const Y = document.activeElement, Q = !!Y && (Y.id === "hk3-cmd-input" || Y.id === "hk-dyn-input") && Y.value === "";
    Y && (Y.tagName === "INPUT" || Y.tagName === "TEXTAREA" || Y.isContentEditable) && !Q || mt();
  }, { capture: true });
  function Fe() {
    for (const S of A.children.slice()) {
      A.remove(S);
      const Y = S.geometry;
      Y && Y !== r && Y !== B && Y.dispose();
    }
  }
  const Me = (S) => {
    var _a2;
    const Y = e.getActiveCamera(), Q = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return Y.isOrthographicCamera ? (Y.top - Y.bottom) / (Y.zoom || 1) / Q : 2 * Y.position.distanceTo(S) * Math.tan((Y.fov || 50) * Math.PI / 180 / 2) / Q;
  };
  function Ie(S, Y) {
    var _a2, _b;
    const Q = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (S.type === "node") {
      const Z = F(S.idx);
      if (!Z) return;
      const ye = new rt(r, I);
      ye.position.copy(Z), ye.scale.setScalar(Math.max(1e-4, 7 * Me(Z))), ye.renderOrder = 101, A.add(ye);
    } else if (S.type === "frame" && Q) {
      const Z = Q[S.idx], ye = F(Z[0]), ue = F(Z[1]);
      if (!ye || !ue) return;
      const _e = ye.clone().add(ue).multiplyScalar(0.5), xe = ue.clone().sub(ye), De = xe.length(), Le = e.getActiveCamera().position.distanceTo(_e), Ge = new rt(B, ce);
      Ge.position.copy(_e);
      const Oe = new k(0, 1, 0);
      Ge.quaternion.setFromAxisAngle(Oe.clone().cross(xe).normalize(), Oe.angleTo(xe)), Ge.scale.set(Le * 35e-4, De, Le * 35e-4), Ge.renderOrder = 101, A.add(Ge);
    } else if (S.type === "shell" && Q) {
      const Z = Q[S.idx], ye = [], ue = [];
      for (const De of Z) {
        const Le = F(De);
        if (!Le) return;
        ye.push(Le.x, Le.y, Le.z);
      }
      Z.length === 4 ? ue.push(0, 1, 2, 0, 2, 3) : Z.length === 3 && ue.push(0, 1, 2);
      const _e = new Ce();
      _e.setAttribute("position", new kt(ye, 3)), _e.setIndex(ue), _e.computeVertexNormals();
      const xe = new rt(_e, de);
      xe.renderOrder = 101, A.add(xe);
    } else if (S.type === "solid" && Q) {
      const Z = Q[S.idx], ye = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ue = [];
      for (const [De, Le] of ye) {
        const Ge = F(Z[De]), Oe = F(Z[Le]);
        Ge && Oe && ue.push(Ge.x, Ge.y, Ge.z, Oe.x, Oe.y, Oe.z);
      }
      const _e = new Ce();
      _e.setAttribute("position", new kt(ue, 3));
      const xe = new Wt(_e, ae);
      xe.renderOrder = 101, A.add(xe);
    }
  }
  function Ne() {
    if (Fe(), !R.length || !e.mesh) {
      e.render();
      return;
    }
    const S = e.derivedNodes.rawVal ?? [];
    if (S.length >= 2) {
      const Y = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
      for (const Z of S) for (let ye = 0; ye < 3; ye++) Z[ye] < Y[ye] && (Y[ye] = Z[ye]), Z[ye] > Q[ye] && (Q[ye] = Z[ye]);
      Math.max(Q[0] - Y[0], Q[1] - Y[1], Q[2] - Y[2], 0.1);
    }
    for (const Y of R) Ie(Y);
    e.render();
  }
  function ct(S, Y) {
    const Q = R.findIndex((Z) => Z.type === S.type && Z.idx === S.idx);
    Q >= 0 ? R.splice(Q, 1) : Y || R.push(S), R.length && R[R.length - 1];
  }
  function mt() {
    R.length = 0, Ne();
  }
  return j.derive(() => {
    e.derivedNodes.val, R.length && Ne();
  }), l;
}
function Ka(e, l, r, p, u, w) {
  const f = u - r, b = w - p, y = f * f + b * b;
  if (y < 1e-9) {
    const be = e - r, re = l - p;
    return Math.sqrt(be * be + re * re);
  }
  let P = ((e - r) * f + (l - p) * b) / y;
  P = Math.max(0, Math.min(1, P));
  const V = r + P * f, g = p + P * b, O = e - V, he = l - g;
  return Math.sqrt(O * O + he * he);
}
function Ga(e, l, r) {
  let p = false;
  for (let u = 0, w = r.length - 1; u < r.length; w = u++) {
    const f = r[u].x, b = r[u].y, y = r[w].x, P = r[w].y;
    b > l != P > l && e < (y - f) * (l - b) / (P - b + 1e-12) + f && (p = !p);
  }
  return p;
}
const Ha = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Wa = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, tn = 1e-3;
function On(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function Ja(e, l) {
  const r = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < tn ? { plano: "XZ", en: e[1] } : r < tn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function Oa(e, l) {
  var _a2, _b;
  let r = null, p = { plano: "XZ", en: 0 };
  const u = () => {
    var _a3, _b2;
    const B = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !B || B === "none" ? null : String(B).replace(/^contour:/, "");
  }, w = (B) => {
    var _a3, _b2;
    const de = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ae = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], R = /* @__PURE__ */ new Set();
    for (const A of ae) {
      if (A.length !== 2) continue;
      const X = de[A[0]], F = de[A[1]];
      if (!X || !F) continue;
      const C = On(X, B), N = On(F, B);
      Math.abs(C.fuera - N.fuera) < tn && R.add(Math.round(C.fuera * 1e3) / 1e3);
    }
    return [...R].sort((A, X) => A - X);
  };
  function f(B) {
    var _a3, _b2;
    if (B == null ? void 0 : B.plano) p = { plano: B.plano, en: B.en ?? w(B.plano)[0] ?? 0 };
    else {
      const ae = [...window.__hekatanModelSelection ?? []].reverse().find((X) => X.type === "frame"), R = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], A = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      ae && A[ae.idx] && R[A[ae.idx][0]] && R[A[ae.idx][1]] ? p = Ja(R[A[ae.idx][0]], R[A[ae.idx][1]]) : p = { plano: "XZ", en: w("XZ")[0] ?? 0 };
    }
    r || b(), r.hidden = false, y();
  }
  function b() {
    r = document.createElement("div"), r.id = "hk-diagrama-2d", r.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), r.innerHTML = `
      <div class="hk-d2-bar" style="display:flex;align-items:center;gap:10px;padding:7px 10px;
           background:#141a24;border-bottom:1px solid #2f3b50;cursor:move;user-select:none">
        <b style="color:#e6c463">\u{1F4D0} Diagrama 2D</b>
        <span class="hk-d2-tit" style="color:#9fb0c6"></span>
        <label style="margin-left:auto">plano
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
    const B = r.querySelector(".hk-d2-plano"), de = r.querySelector(".hk-d2-en");
    B.addEventListener("change", () => {
      p = { plano: B.value, en: w(B.value)[0] ?? 0 }, y();
    }), de.addEventListener("change", () => {
      p.en = Number(de.value), y();
    });
    const ae = (X) => {
      const F = w(p.plano), C = F.findIndex((T) => Math.abs(T - p.en) < tn), N = Math.max(0, Math.min(F.length - 1, (C < 0 ? 0 : C) + X));
      F.length && (p.en = F[N], y());
    };
    r.querySelector(".hk-d2-ant").addEventListener("click", () => ae(-1)), r.querySelector(".hk-d2-sig").addEventListener("click", () => ae(1));
    const R = r.querySelector(".hk-d2-bar");
    let A = null;
    R.addEventListener("pointerdown", (X) => {
      if (X.target.closest("select,button")) return;
      const F = r.getBoundingClientRect();
      A = { x: X.clientX, y: X.clientY, l: F.left, t: F.top }, r.style.transform = "none", r.style.left = F.left + "px", r.style.top = F.top + "px";
    }), window.addEventListener("pointermove", (X) => {
      !A || !r || (r.style.left = A.l + X.clientX - A.x + "px", r.style.top = A.t + X.clientY - A.y + "px");
    }), window.addEventListener("pointerup", () => {
      A = null;
    }), new ResizeObserver(() => {
      r && !r.hidden && y();
    }).observe(r);
  }
  function y() {
    var _a3, _b2, _c, _d;
    if (!r || r.hidden) return;
    const B = new Set(g && !g.hidden && O >= 0 ? be(O) : []), de = r.querySelector(".hk-d2-svg"), ae = r.querySelector(".hk-d2-tit"), R = r.querySelector(".hk-d2-pie"), A = r.querySelector(".hk-d2-plano"), X = r.querySelector(".hk-d2-en");
    A.value = p.plano;
    const F = w(p.plano), C = p.plano === "XZ" ? "y" : p.plano === "YZ" ? "x" : "z", N = p.plano === "XY" ? "Planta" : "P\xF3rtico";
    X.innerHTML = F.map((fe, Ae) => `<option value="${fe}" ${Math.abs(fe - p.en) < tn ? "selected" : ""}>${N} ${Ae + 1} \xB7 ${C} = ${fe.toFixed(2)} m</option>`).join("");
    const T = u(), L = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], te = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], se = T ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[T] : null;
    de.innerHTML = "";
    const le = de.clientWidth || 880, ne = de.clientHeight || 480, D = [];
    if (te.forEach((fe, Ae) => {
      if (fe.length !== 2) return;
      const Ee = L[fe[0]], qe = L[fe[1]];
      if (!Ee || !qe) return;
      const Ye = On(Ee, p.plano), qt = On(qe, p.plano);
      Math.abs(Ye.fuera - p.en) < tn && Math.abs(qt.fuera - p.en) < tn && D.push({ i: Ae, a: Ye, b: qt });
    }), !D.length) {
      R.textContent = "No hay barras en este plano.", ae.textContent = "";
      return;
    }
    let pe = 1 / 0, W = -1 / 0, me = 1 / 0, we = -1 / 0;
    for (const fe of D) for (const Ae of [fe.a, fe.b]) pe = Math.min(pe, Ae.u), W = Math.max(W, Ae.u), me = Math.min(me, Ae.v), we = Math.max(we, Ae.v);
    const Fe = W - pe || 1, Me = we - me || 1, Ie = 70, Ne = Math.min((le - 2 * Ie) / Fe, (ne - 2 * Ie) / Me), ct = (le - Fe * Ne) / 2, mt = (ne - Me * Ne) / 2, S = (fe) => ct + (fe - pe) * Ne, Y = (fe) => ne - (mt + (fe - me) * Ne), Q = "http://www.w3.org/2000/svg", Z = (fe, Ae, Ee) => {
      const qe = document.createElementNS(Q, fe);
      for (const Ye in Ae) qe.setAttribute(Ye, String(Ae[Ye]));
      return Ee != null && (qe.textContent = Ee), de.appendChild(qe), qe;
    };
    let ye = 0;
    if (se) for (const fe of D) {
      const Ae = se instanceof Map ? se.get(fe.i) : se[fe.i];
      Ae && (ye = Math.max(ye, Math.abs(Ae[0] ?? 0), Math.abs(Ae[1] ?? 0)));
    }
    const ue = 0.12 * Math.max(Fe, Me) * Ne, _e = ye > 0 ? ue / ye : 0, xe = T === "bendingsY" || T === "bendingsZ", De = (fe) => Math.abs(fe) >= 100 ? fe.toFixed(1) : Math.abs(fe) >= 10 ? fe.toFixed(2) : fe.toFixed(3), Le = [];
    for (const fe of D) {
      const Ae = S(fe.a.u), Ee = Y(fe.a.v), qe = S(fe.b.u), Ye = Y(fe.b.v), qt = Math.hypot(qe - Ae, Ye - Ee) || 1;
      let et = (Ye - Ee) / qt, tt = -(qe - Ae) / qt;
      xe && tt < 0 && (et = -et, tt = -tt);
      const Mt = se ? se instanceof Map ? se.get(fe.i) : se[fe.i] : null, Ue = Mt ? Number(Mt[0] ?? 0) : 0, Pe = Mt ? -Number(Mt[1] ?? 0) : 0;
      if (Mt && _e > 0) {
        const at = [Ae + et * Ue * _e * 1, Ee + tt * Ue * _e * 1], dt = [qe + et * Pe * _e * 1, Ye + tt * Pe * _e * 1], We = Ue + Pe >= 0 ? "#3fa7d6" : "#d9534f";
        Z("polygon", { points: `${Ae},${Ee} ${at[0]},${at[1]} ${dt[0]},${dt[1]} ${qe},${Ye}`, fill: We, "fill-opacity": 0.38, stroke: We, "stroke-width": 1.2 }), Le.push({ x: at[0] + et * 12, y: at[1] + tt * 12, t: De(Ue), peso: Math.abs(Ue) }), Le.push({ x: dt[0] + et * 12, y: dt[1] + tt * 12, t: De(Pe), peso: Math.abs(Pe) });
      }
      Z("line", { x1: Ae, y1: Ee, x2: qe, y2: Ye, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), B.has(fe.i) && Z("line", { x1: Ae, y1: Ee, x2: qe, y2: Ye, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const Te = Z("line", { x1: Ae, y1: Ee, x2: qe, y2: Ye, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      Te.addEventListener("click", () => re(fe.i));
      const He = document.createElementNS(Q, "title");
      He.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Te.appendChild(He);
    }
    for (const fe of D) for (const Ae of [fe.a, fe.b]) p.plano !== "XY" && Math.abs(Ae.v - me) < tn && Z("rect", { x: S(Ae.u) - 6, y: Y(Ae.v), width: 12, height: 7, fill: "#b03a3a" });
    const Ge = [];
    Le.sort((fe, Ae) => Ae.peso - fe.peso);
    for (const fe of Le) fe.peso < 0.02 * ye || Ge.some((Ae) => Math.hypot(Ae.x - fe.x, Ae.y - fe.y) < 34) || (Ge.push(fe), Z("text", { x: fe.x, y: fe.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, fe.t));
    const Oe = T ? Ha[T] ?? T : "sin resultado";
    ae.textContent = `${Oe} \xB7 ${p.plano === "XY" ? "planta" : "alzado"} ${p.plano} en ${C} = ${p.en.toFixed(2)} m`, R.textContent = T ? `${D.length} barras en el plano \xB7 m\xE1ximo ${De(ye)} ${Wa[T] ?? ""}` + (xe ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const P = () => {
    try {
      y();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, P();
  }));
  let V = null;
  setInterval(() => {
    var _a3, _b2;
    const B = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, de = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, ae = [B, de];
    if (!(V && V[0] === B && V[1] === de)) {
      V = ae, P();
      try {
        ce();
      } catch {
      }
    }
  }, 400);
  let g = null, O = -1, he = "12";
  function be(B) {
    var _a3, _b2;
    const de = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ae = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], R = /* @__PURE__ */ new Map();
    ae.forEach((C, N) => {
      if (C.length === 2) for (const T of C) R.has(T) || R.set(T, []), R.get(T).push(N);
    });
    const A = (C) => {
      const N = de[ae[C][0]], T = de[ae[C][1]], L = [T[0] - N[0], T[1] - N[1], T[2] - N[2]], te = Math.hypot(L[0], L[1], L[2]) || 1;
      return L.map((se) => se / te);
    }, X = (C, N) => {
      const T = A(C), L = A(N);
      return Math.abs(T[0] * L[0] + T[1] * L[1] + T[2] * L[2]) > 0.9999;
    }, F = [B];
    for (const C of [0, 1]) {
      let N = B, T = ae[B][C];
      for (let L = 0; L < 500; L++) {
        const te = (R.get(T) ?? []).filter((le) => le !== N);
        if (te.length !== 1 || !X(N, te[0])) break;
        const se = te[0];
        C === 0 ? F.unshift(se) : F.push(se), T = ae[se][0] === T ? ae[se][1] : ae[se][0], N = se;
      }
    }
    return F;
  }
  function re(B) {
    if (B == null) {
      const ae = [...window.__hekatanModelSelection ?? []].reverse().find((R) => R.type === "frame");
      if (!ae) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      B = ae.idx;
    }
    O = B, g || (g = document.createElement("div"), g.id = "hk-diagrama-barra", g.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), g.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(g), g.querySelector(".hk-b-x").addEventListener("click", () => {
      g.hidden = true, I(), y();
    }), g.querySelector(".hk-b-pl").addEventListener("change", (de) => {
      he = de.target.value, ce();
    })), g.hidden = false, I(), ce(), y();
  }
  function I() {
    if (!r || !g) return;
    const B = window.innerWidth, de = Math.min(560, Math.round(B * 0.4));
    g.style.width = de + "px", !g.hidden && !r.hidden ? (r.style.transform = "none", r.style.left = "12px", r.style.width = B - de - 36 + "px", g.style.top = r.getBoundingClientRect().top + "px") : r.hidden || (r.style.left = "50%", r.style.transform = "translateX(-50%)", r.style.width = "min(900px,92vw)");
  }
  function ce() {
    var _a3, _b2, _c;
    if (!g || g.hidden || O < 0) return;
    const B = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], de = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], ae = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!de[O]) return;
    const R = be(O), A = [];
    let X = 0, F = -1;
    R.forEach((W, me) => {
      const [we, Fe] = de[W], Me = me === 0 ? R.length > 1 && de[R[1]].includes(we) : we !== F, Ie = Me ? Fe : we, Ne = Me ? we : Fe, ct = Math.hypot(B[Ne][0] - B[Ie][0], B[Ne][1] - B[Ie][1], B[Ne][2] - B[Ie][2]);
      A.push({ x: X, e: W, fin: Me ? 1 : 0 }), X += ct, A.push({ x: X, e: W, fin: Me ? 0 : 1 }), F = Ne;
    });
    const C = X, N = (W, me) => {
      const we = ae[W], Fe = we ? we instanceof Map ? we.get(me.e) : we[me.e] : null;
      return Fe ? me.fin === 0 ? Number(Fe[0] ?? 0) : -Number(Fe[1] ?? 0) : 0;
    }, T = B[de[R[0]][0]], L = (W) => W.toFixed(2);
    g.querySelector(".hk-b-tit").textContent = "L = " + C.toFixed(2) + " m \xB7 " + R.length + " tramo(s) \xB7 desde (" + L(T[0]) + ", " + L(T[1]) + ", " + L(T[2]) + ")";
    const te = he === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], se = g.querySelector(".hk-b-cuerpo");
    se.innerHTML = "";
    const le = Math.max(300, se.clientWidth), ne = 124, D = 46, pe = (ne - 14) / 2;
    for (const [W, me, we, Fe] of te) {
      const Me = A.map((xe) => N(W, xe)), Ie = Math.max(...Me), Ne = Math.min(...Me), ct = Math.max(Math.abs(Ie), Math.abs(Ne)) || 1, mt = (xe) => D + xe / (C || 1) * (le - 2 * D), S = (xe) => pe + (Fe ? 1 : -1) * (xe / ct) * (pe - 16), Y = (xe) => Math.abs(xe) >= 100 ? xe.toFixed(1) : Math.abs(xe) >= 10 ? xe.toFixed(2) : xe.toFixed(3);
      let Q = mt(0) + "," + pe + " ";
      A.forEach((xe, De) => {
        Q += mt(xe.x) + "," + S(Me[De]) + " ";
      }), Q += mt(C) + "," + pe;
      const Z = Me.indexOf(Ie), ye = Me.indexOf(Ne), ue = (xe, De) => {
        const Le = S(Me[xe]) + (S(Me[xe]) < pe ? -5 : 13);
        return '<text x="' + mt(A[xe].x) + '" y="' + Le + '" text-anchor="middle" fill="' + De + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Y(Me[xe]) + "</text>";
      }, _e = Fe ? "#d9534f" : "#3fa7d6";
      se.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + me + ' <span style="color:#6f7d90;font-weight:400">(' + we + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Y(Ie) + " \xB7 m\xEDn " + Y(Ne) + (Fe ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + le + '" height="' + ne + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + D + '" y1="' + pe + '" x2="' + (le - D) + '" y2="' + pe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Q + '" fill="' + _e + '" fill-opacity=".35" stroke="' + _e + '" stroke-width="1.4"/>' + ue(0, "#f2f5fa") + ue(A.length - 1, "#f2f5fa") + (Z > 0 && Z < A.length - 1 ? ue(Z, "#8fd3ff") : "") + (ye > 0 && ye < A.length - 1 && ye !== Z ? ue(ye, "#ff9f9a") : "") + '<text x="' + D + '" y="' + (ne - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (le - D) + '" y="' + (ne - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + C.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = re, window.__hekatanDiagrama2D = f, { abrir: f, abrirBarra: re };
}
function ms(e, l = 8) {
  const r = document.createElement("div");
  r.id = "legend", r.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    j.derive(() => {
      no.val, r.style.background = ra();
    });
  });
  const p = document.createElement("div");
  p.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", r.appendChild(p), setTimeout(() => {
    j.derive(() => {
      p.textContent = Eo.val ? `[${Eo.val}]` : "";
    });
  });
  const u = Array.from({ length: l + 1 }, (y, P) => P / l).reverse();
  let w, f;
  u.forEach((y, P) => {
    w = document.createElement("div"), w.id = `marker-${P}`, w.className = "marker", w.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", f = document.createElement("p"), f.id = `marker-text-${P}`, w.append(f), r.append(w);
  });
  const b = [];
  return r.querySelectorAll("p").forEach((y) => b.push(y)), setTimeout(() => {
    j.derive(() => {
      u.forEach((y, P) => {
        const V = b[P];
        V && (V.innerText = Qa(e.val, y).toString());
      });
    });
  }), r;
}
function Qa(e, l) {
  const r = Tn.val;
  if (r) return ws(r[0] + l * (r[1] - r[0]));
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
function di({ mesh: e, settingsObj: l, drawingObj: r, objects3D: p, solids: u }) {
  aa.DEFAULT_UP = new k(0, 0, 1);
  const w = document.createElement("div"), f = new ta(), b = new na(45, 1, 0.1, 2 * 1e6), y = new oa(-10, 10, 10, -10, -1e3, 2e6);
  let P = b;
  const V = new sa({ antialias: true });
  V.localClippingEnabled = true;
  const g = new ds(b, V.domElement);
  g.enableDamping = true, g.dampingFactor = 0.1, g.screenSpacePanning = true, g.zoomSpeed = 0.8, g.panSpeed = 1.2, g.rotateSpeed = 0.9, g.keyPanSpeed = 12, g.listenToKeyEvents(window), g.touches = { ONE: Hn.ROTATE, TWO: Hn.DOLLY_PAN }, V.domElement.addEventListener("wheel", (S) => {
    if (!S.ctrlKey && Math.abs(S.deltaX) > Math.abs(S.deltaY) * 1.5) {
      S.preventDefault();
      const Y = g.target, Q = new k().subVectors(b.position, Y), Z = new k();
      Z.crossVectors(b.up, Q).normalize();
      const ue = Q.length() * 1e-3 * g.panSpeed;
      Y.addScaledVector(Z, S.deltaX * ue), b.position.addScaledVector(Z, S.deltaX * ue), g.update();
    }
  }, { passive: false });
  const O = new Po(new k(-1, 0, 0), 0), he = new Po(new k(0, -1, 0), 0), be = new Po(new k(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function re() {
    const S = window.__hekatanClip, Y = [];
    S.enableX && (O.normal.set(S.invertX ? 1 : -1, 0, 0), O.constant = S.invertX ? -S.posX : S.posX, Y.push(O)), S.enableY && (he.normal.set(0, S.invertY ? 1 : -1, 0), he.constant = S.invertY ? -S.posY : S.posY, Y.push(he)), S.enableZ && (be.normal.set(0, 0, S.invertZ ? 1 : -1), be.constant = S.invertZ ? -S.posZ : S.posZ, Y.push(be)), V.clippingPlanes = Y, f.traverse((Z) => {
      const ye = Z;
      if (ye.material) {
        const ue = Array.isArray(ye.material) ? ye.material : [ye.material];
        for (const _e of ue) _e.clippingPlanes = Y, _e.needsUpdate = true;
      }
    });
    const Q = window.__hekatanPanes ?? [];
    for (const Z of Q) try {
      Z && typeof Z.refresh == "function" && Z.refresh();
    } catch {
    }
    V.render(f, P);
  }
  re(), window.__hekatanClipApply = re;
  const I = pa(l), ce = j.derive(() => Math.pow(10, I.displayScale.val / 10)), B = ja(e, I), de = () => {
    const S = [];
    return I.gridXY.rawVal && S.push("xy"), I.gridXZ.rawVal && S.push("xz"), I.gridYZ.rawVal && S.push("yz"), S;
  }, ae = () => {
    const S = I.gridStep.rawVal, Y = Math.max(S, I.gridMajor.rawVal);
    return { planes: de(), majorStep: Y, minorStep: S };
  };
  let R = zo(I.gridSize.rawVal, ae());
  R.visible = I.gridVisible.rawVal, window.__hekatanSnap2D = I.cursorSnap.rawVal;
  const A = () => {
    const S = Math.max(0, Math.min(1, I.gridOpacity.rawVal));
    R.traverse((Y) => {
      const Q = Y.material;
      if (!Q || !("opacity" in Q)) return;
      const Z = Y.name ?? "";
      let ye = 0.55;
      Z.includes("border") ? ye = 1 : Z.includes("major") && (ye = 0.95), Q.opacity = S * ye;
    });
  };
  A(), w.appendChild(da(I, e, u)), w.setAttribute("id", "viewer"), w.appendChild(V.domElement), V.setPixelRatio(window.devicePixelRatio);
  const X = dn();
  V.setClearColor(X.background, 1);
  const F = I.gridSize.rawVal, C = F * 0.5 + F * 0.5 / Math.tan(45 * 0.5);
  b.position.set(0, 0, C), b.up.set(0, 1, 0), g.target.set(0, 0, 0), g.minDistance = 0.1, g.maxDistance = 1e4, w.__settings = I, g.zoomSpeed = 1, g._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, g.update();
  let N = us(I.gridSize.rawVal, I.flipAxes.rawVal);
  f.add(R, N), j.derive(() => {
    window.__hekatanGridPlaneXY = I.gridXY.val, window.__hekatanGridPlaneXZ = I.gridXZ.val, window.__hekatanGridPlaneYZ = I.gridYZ.val;
  });
  let T = true;
  j.derive(() => {
    const S = I.gridVisible.val;
    if (T) {
      T = false;
      return;
    }
    R.visible = S, W();
  });
  let L = true;
  j.derive(() => {
    if (I.gridOpacity.val, L) {
      L = false;
      return;
    }
    A(), W();
  }), j.derive(() => {
    const S = I.cursorSnap.val;
    window.__hekatanSnap2D = S;
  });
  let te = true;
  j.derive(() => {
    var _a2, _b, _c;
    const S = I.gridSize.val, Y = I.flipAxes.val;
    if (I.gridXY.val, I.gridXZ.val, I.gridYZ.val, I.gridStep.val, I.gridMajor.val, te) {
      te = false;
      return;
    }
    f.remove(R), (_a2 = R.traverse) == null ? void 0 : _a2.call(R, (ue) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ue.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), R = zo(S, ae()), R.visible = I.gridVisible.rawVal, f.add(R), A(), f.remove(N), N.traverse((ue) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ue.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), N = us(S, Y), f.add(N);
    const Q = S * 0.5 + S * 0.5 / Math.tan(45 * 0.5);
    b.position.distanceTo(g.target);
    const Z = Math.abs(b.position.x) < 0.1 && Math.abs(b.position.y) < 0.1 && b.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (Z ? b.position.set(0, 0, Q) : b.position.set(0.5 * S, -Q, 0.5 * S), g.target.set(0, 0, 0)), g.minDistance = Math.max(0.05, S * 0.01), g.maxDistance = Math.max(50, S * 50), g.update(), W();
  }), new ResizeObserver((S) => {
    var _a2, _b;
    for (const Y of S) {
      const Q = (_a2 = Y.target) == null ? void 0 : _a2.clientWidth, Z = (_b = Y.target) == null ? void 0 : _b.clientHeight;
      if (Q === 0 || Z === 0) continue;
      const ue = (le ? Q / 2 : Q) / Z;
      b.aspect = ue, b.updateProjectionMatrix();
      const _e = y.top;
      if (y.left = -_e * ue, y.right = _e * ue, y.updateProjectionMatrix(), ne && ne.isPerspectiveCamera) ne.aspect = ue, ne.updateProjectionMatrix();
      else if (ne && ne.isOrthographicCamera) {
        const xe = ne, De = xe.top;
        xe.left = -De * ue, xe.right = De * ue, xe.updateProjectionMatrix();
      }
      V.setSize(Q, Z), W();
    }
  }).observe(w), g.addEventListener("change", W), j.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, I.displayScale.val, I.nodes.val, I.elements.val, (_g = I.edges) == null ? void 0 : _g.val, I.elemColumns.val, I.elemBeams.val, I.nodesIndexes.val, I.elementsIndexes.val, I.orientations.val, I.sections.val, I.secColumns.val, I.secBeams.val, I.secFloor.val, I.supports.val, I.loads.val, I.deformedShape.val, I.nodeResults.val, I.frameResults.val, I.shellResults.val, (_h = I.solidResults) == null ? void 0 : _h.val, (_i = I.extruded) == null ? void 0 : _i.val, setTimeout(W);
  });
  let le = false, ne = null, D = null, pe = false;
  function W() {
    const S = w.clientWidth || 1, Y = w.clientHeight || 1;
    if (!le || !ne) {
      V.setScissorTest(false), V.setViewport(0, 0, S, Y), V.render(f, P);
      return;
    }
    const Q = S / 2;
    V.setScissorTest(true), V.setViewport(0, 0, Q, Y), V.setScissor(0, 0, Q, Y), V.render(f, P), V.setViewport(Q, 0, Q, Y), V.setScissor(Q, 0, Q, Y), V.render(f, ne), V.setScissorTest(false);
  }
  function me(S) {
    P = S, g.object = S, g.update(), W();
  }
  function we(S, Y) {
    le = S, Y && (ne = Y);
    const Q = w.clientWidth || 1, Z = w.clientHeight || 1, ue = (S ? Q / 2 : Q) / Z;
    b.isPerspectiveCamera && (b.aspect = ue, b.updateProjectionMatrix());
    const _e = y.top;
    if (y.left = -_e * ue, y.right = _e * ue, y.updateProjectionMatrix(), S && ne) {
      if (D ? (D.object = ne, D.update()) : (D = new ds(ne, V.domElement), D.enableDamping = true, D.dampingFactor = 0.1, D.screenSpacePanning = true, D.zoomSpeed = 0.8, D.panSpeed = 1.2, D.rotateSpeed = 0.9, D.touches = { ONE: Hn.ROTATE, TWO: Hn.DOLLY_PAN }, D.target.copy(g.target), D.addEventListener("change", W), D.enabled = false), !pe) {
        const xe = (De) => {
          if (!le || !D) return;
          const Le = V.domElement.getBoundingClientRect(), Ge = De.clientX - Le.left, Oe = Le.width / 2, fe = Ge >= Oe;
          g.enabled = !fe, D.enabled = fe;
        };
        V.domElement.addEventListener("pointerdown", xe, true), V.domElement.addEventListener("wheel", xe, { capture: true, passive: true }), pe = true;
      }
    } else S || (g.enabled = true, D && (D.enabled = false));
    w.__splitMode = S, window.__hekatanSplitMode = S, window.__hekatanSplitCamera = S ? ne : null, W();
  }
  if (e) {
    f.add(ua(I, B, ce), ia(e, I, B), ma(I, B, ce), wa(e, I, B, ce), fa(e, I, B, ce), ha(e, I, B, ce), ga(e, I, B, ce), ba(e, I, B, ce), Sa(e, I, B), Fa(e, I, B, ce), Pa(e, I, B, ce)), window.__hekatanDiagrama2D || (Oa(e, I), V.domElement.addEventListener("dblclick", () => {
      var _a2;
      const xe = (_a2 = I.frameResults) == null ? void 0 : _a2.rawVal;
      !xe || xe === "none" || !(window.__hekatanModelSelection ?? []).some((Le) => Le.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const S = qa({ scene: f, rendererElm: V.domElement, getActiveCamera: () => P, derivedNodes: B, derivedDisplayScale: ce, mesh: e, settings: I, render: W });
    f.add(S);
    const Y = ai(e, I), Q = Va(e, I, B, Y), Z = ms(Y);
    f.add(Q), w.appendChild(Z);
    const ye = Ra(e, I, B);
    f.add(ye);
    const ue = ye.__colorMapValues, _e = ms(ue);
    _e.id = "frame-legend", w.appendChild(_e), j.derive(() => {
      var _a2;
      const xe = I.shellResults.val != "none", De = (((_a2 = I.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Le = xe || De, Ge = I.frameResults.val.startsWith("contour:"), Oe = Y.val.some((fe) => Number.isFinite(fe));
      Z.hidden = !Le || !Oe, Q.visible = Le, _e.hidden = !Ge;
    });
  }
  if (u) {
    const S = new vs(16777215, 0.5);
    f.add(S);
    const Y = new to(16777215, 0.5);
    Y.position.set(30, 25, -10), Y.shadow.mapSize.width = 1024, Y.shadow.mapSize.height = 1024, f.add(Y);
    const Q = 10;
    Y.shadow.camera.left = -Q, Y.shadow.camera.right = Q, Y.shadow.camera.top = Q, Y.shadow.camera.bottom = -Q, Y.shadow.camera.far = 1e3;
    const Z = new to(16777215, 0.5);
    Z.color.setHSL(11, 43, 96), Z.position.set(-10, 0, 30), f.add(Z), j.derive(() => {
      (u == null ? void 0 : u.val.length) && (f.remove(...u.oldVal), f.add(...u.rawVal), W());
    }), j.derive(() => {
      u.rawVal.forEach((ye) => ye.visible = I.solids.val), W();
    });
  }
  if (p) {
    const S = [], Y = (Z) => {
      var _a2;
      return ((_a2 = Z == null ? void 0 : Z.userData) == null ? void 0 : _a2.isCota) ? I.showCotas.val : I.custom3D.val;
    }, Q = () => {
      for (const Z of S) Z.visible = Y(Z);
      W();
    };
    j.derive(() => {
      const Z = p.val;
      S.length && (f.remove(...S), S.length = 0), Z.length && (f.add(...Z), S.push(...Z), Q()), W();
    }), j.derive(() => {
      I.custom3D.val, Q();
    }), j.derive(() => {
      I.showCotas.val, Q();
    });
  }
  r && Aa({ drawingObj: r, gridObj: R, scene: f, getActiveCamera: () => P, controls: g, gridSize: F, derivedDisplayScale: ce, rendererElm: V.domElement, viewerRender: W }), xs((S, Y) => {
    var _a2;
    V.setClearColor(Y.background, 1), f.remove(R), (_a2 = R.traverse) == null ? void 0 : _a2.call(R, (Q) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Q.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Q.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), R = zo(I.gridSize.rawVal, { planes: de() }), f.add(R), w.style.setProperty("--awatif-legend-color", Y.legendMarker), W();
  });
  const Fe = { scene: f, perspCamera: b, orthoCamera: y, get camera() {
    return P;
  }, controls: g, renderer: V, rendererElm: V.domElement, render: W, setActiveCamera: me, setSplitMode: we, get splitMode() {
    return le;
  }, get splitCamera() {
    return ne;
  }, settings: I };
  w.__ctx = Fe;
  const Me = document.createElement("div");
  Me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Ie = (S, Y, Q) => {
    const Z = document.createElement("button");
    return Z.textContent = S, Z.title = Y, Z.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), Z.onmouseenter = () => {
      Z.style.background = "rgba(70,70,70,0.9)";
    }, Z.onmouseleave = () => {
      Z.style.background = "rgba(40,40,40,0.85)";
    }, Z.onclick = (ye) => {
      ye.preventDefault(), Q();
    }, Z;
  }, Ne = (S, Y) => {
    const Q = g.target, Z = new k().subVectors(P.position, Q), ye = Z.length(), ue = new k(), _e = new k();
    ue.crossVectors(P.up, Z).normalize(), _e.copy(P.up).normalize();
    const xe = ye * 0.05;
    Q.addScaledVector(ue, -S * xe), Q.addScaledVector(_e, Y * xe), P.position.addScaledVector(ue, -S * xe), P.position.addScaledVector(_e, Y * xe), g.update(), W();
  }, ct = (S) => {
    const Y = new k().subVectors(P.position, g.target);
    Y.multiplyScalar(S), P.position.copy(g.target).add(Y), g.update(), W();
  }, mt = () => {
    const S = document.createElement("div");
    return S.style.cssText = "width:32px;height:32px;", S;
  };
  return Me.append(mt()), Me.append(Ie("\u2191", "Pan arriba", () => Ne(0, 1))), Me.append(Ie("\u2295", "Zoom in", () => ct(0.85))), Me.append(Ie("\u2190", "Pan izquierda", () => Ne(-1, 0))), Me.append(Ie("\u2302", "Reset vista", () => {
    g.reset(), W();
  })), Me.append(Ie("\u2192", "Pan derecha", () => Ne(1, 0))), Me.append(Ie("\u2296", "Zoom out", () => ct(1.18))), Me.append(Ie("\u2193", "Pan abajo", () => Ne(0, -1))), Me.append(mt()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(Me), w;
}
function ja(e, l) {
  return j.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const r = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], p = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!p || r.length === 0) return r;
    const u = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, f = Number.isFinite(u) ? u : 1, b = Number.isFinite(w) ? w : 1;
    return r.map((y, P) => {
      var _a3;
      const V = ((_a3 = p.get(P)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], g = Number.isFinite(V[0]) ? V[0] : 0, O = Number.isFinite(V[1]) ? V[1] : 0, he = Number.isFinite(V[2]) ? V[2] : 0;
      return [y[0] + g * f, y[1] + O * f, y[2] + he * b];
    });
  });
}
const Tn = j.state(null), Eo = j.state(""), ei = j.state("kN"), ti = j.state("mm"), ni = j.state("kN/m\xB2"), oi = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, ys = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, si = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ai(e, l) {
  const r = j.state([]);
  let p;
  return ((u) => {
    u.bendingXX = "bendingXX", u.bendingYY = "bendingYY", u.bendingXY = "bendingXY", u.membraneXX = "membraneXX", u.membraneYY = "membraneYY", u.membraneXY = "membraneXY", u.tranverseShearX = "tranverseShearX", u.tranverseShearY = "tranverseShearY", u.membranePrincipalMax = "membranePrincipalMax", u.membranePrincipalMin = "membranePrincipalMin", u.bendingPrincipalMax = "bendingPrincipalMax", u.bendingPrincipalMin = "bendingPrincipalMin", u.transverseShearMax = "transverseShearMax", u.vonMises = "vonMises", u.pressure = "pressure", u.displacementX = "displacementX", u.displacementY = "displacementY", u.displacementZ = "displacementZ";
  })(p || (p = {})), j.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const u = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), be = (Y, Q) => {
      Y == null ? void 0 : Y.forEach((Z, ye) => {
        const ue = e.elements.val[ye];
        if (ue) for (let _e2 = 0; _e2 < ue.length; _e2++) Q.set(ue[_e2], [Z[_e2] ?? Z[0]]);
      });
    };
    be((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, u), be((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), be((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, f), be((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, b), be((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), be((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), be((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, V), be((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, g), be((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, O), be((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, he);
    const re = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), ae = (Y, Q, Z, ye, ue) => {
      Y.forEach((_e2, xe) => {
        var _a3, _b2;
        const De = _e2[0] ?? 0, Le = ((_a3 = Q.get(xe)) == null ? void 0 : _a3[0]) ?? 0, Ge = ((_b2 = Z.get(xe)) == null ? void 0 : _b2[0]) ?? 0, Oe = (De + Le) / 2, fe = Math.hypot((De - Le) / 2, Ge);
        ye.set(xe, [Oe + fe]), ue.set(xe, [Oe - fe]);
      });
    };
    ae(b, y, P, re, I), ae(u, w, f, ce, B), V.forEach((Y, Q) => {
      var _a3;
      de.set(Q, [Math.hypot(Y[0] ?? 0, ((_a3 = g.get(Q)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const R = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, A = (_w = l.solidResults) == null ? void 0 : _w.val, F = A && A !== "none" ? A : l.shellResults.val, C = R == null ? void 0 : R[F], N = { bendingXX: [u, 0], bendingYY: [w, 0], bendingXY: [f, 0], membraneXX: [b, 0], membraneYY: [y, 0], membraneXY: [P, 0], tranverseShearX: [V, 0], tranverseShearY: [g, 0], membranePrincipalMax: [re, 0], membranePrincipalMin: [I, 0], bendingPrincipalMax: [ce, 0], bendingPrincipalMin: [B, 0], transverseShearMax: [de, 0], vonMises: [O, 0], pressure: [he, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, T = l.shellResults.val, L = ei.val, te = ti.val, se = T === "displacementX" || T === "displacementY" || T === "displacementZ", le = T === "bendingXX" || T === "bendingYY" || T === "bendingXY" || T === "bendingPrincipalMax" || T === "bendingPrincipalMin", ne = T === "membraneXX" || T === "membraneYY" || T === "membraneXY" || T === "membranePrincipalMax" || T === "membranePrincipalMin", D = T === "vonMises" || T === "pressure", pe = T === "tranverseShearX" || T === "tranverseShearY" || T === "transverseShearMax", W = (_D = l.solidResults) == null ? void 0 : _D.val, me = W === "vonMises" || W === "sigmaXX" || W === "sigmaYY" || W === "sigmaZZ" || W === "tauXY" || W === "tauYZ" || W === "tauXZ", we = W === "ux" || W === "uy" || W === "uz", Fe = ni.val, Me = me ? si[Fe] : we || se ? ys[te] : le || ne || D || pe ? 1 / oi[L] : 1, Ie = me ? Fe : we || se ? te : le ? `${L}\xB7m/m` : ne ? `${L}/m\xB2` : D ? `${L}/m\xB2` : pe ? `${L}/m` : "";
    Eo.val = Ie, Tn.val = Array.isArray(C) && C.length === 2 ? [C[0] * Me, C[1] * Me] : null;
    const Ne = ks.val, mt = W && W !== "none" ? [O, 0] : N[T], S = [];
    if (e.nodes.val.forEach((Y, Q) => {
      const Z = mt;
      if (!Z || !Z[0] || typeof Z[0].has != "function") return;
      if (!Z[0].has(Q)) {
        S.push(Number.NaN);
        return;
      }
      const ye = Z[0].get(Q), ue = ye ? ye[Z[1]] ?? 0 : 0;
      S.push(ue * Me);
    }), !Tn.val && Ne !== "auto") {
      const Y = e.nodes.val, Q = /* @__PURE__ */ new Set(), Z = (ue, _e2) => {
        var _a3;
        const xe = (_a3 = Y[ue[0]]) == null ? void 0 : _a3[_e2];
        return ue.every((De) => {
          var _a4;
          return Math.abs((((_a4 = Y[De]) == null ? void 0 : _a4[_e2]) ?? NaN) - xe) < 1e-6;
        });
      };
      for (const ue of e.elements.val) {
        if (ue.length !== 4) continue;
        const _e2 = Z(ue, 2), xe = !_e2 && Z(ue, 0), De = !_e2 && Z(ue, 1);
        if (Ne === "losas" ? _e2 : Ne === "muros" ? xe || De : Ne === "murosX" ? xe : Ne === "murosY" ? De : false) for (const Oe of ue) Q.add(Oe);
      }
      const ye = [];
      for (const ue of Q) {
        const _e2 = S[ue];
        Number.isFinite(_e2) && ye.push(_e2);
      }
      ye.length && (Tn.val = To(ye));
    }
    r.val = S;
  }), r;
}
export {
  ca as a,
  ms as b,
  ei as c,
  ti as d,
  ni as e,
  di as g
};
