import { N as Ht, a6 as Gn, q as Gs, v as j, a7 as Hs, D as At, M as lt, B as ze, F as Pt, a8 as Ws, x as yt, a9 as Js, aa as Os, h as as, ab as is, r as dn, ac as Qn, ad as jn, a4 as gs, _ as it, a as ht, L as Wt, w as vs, b as Qs, ae as js, f as ft, V as k, $ as cn, af as ko, H as no, d as zt, c as So, Y as bs, Z as to, G as ea, z as Vn, A as ta, ag as eo, t as na, o as oa, I as en, a2 as Fn, E as ls, S as xn, m as Hn, ah as An, g as rs, i as cs, j as ds, C as ps, K as sa, U as aa, W as ia, X as la, T as Wn, P as Po, O as ra } from "./theme-Dxpmbnyd.js";
import { T as Ft, O as us } from "./Text-DxjkL_3A.js";
import { P as Ms } from "./tweakpane-BXg6ZhiP.js";
import { e as ca } from "./styles-DjzQZscE.js";
class _s {
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
    const d = 1 / this.n, u = new Ht(), h = new Ht();
    this.lut.length = 0, this.lut.push(new Ht(this.map[0][1]));
    for (let f = 1; f < r; f++) {
      const b = f * d;
      for (let y = 0; y < this.map.length - 1; y++) if (b > this.map[y][0] && b <= this.map[y + 1][0]) {
        const S = this.map[y][0], z = this.map[y + 1][0];
        u.setHex(this.map[y][1], Gn), h.setHex(this.map[y + 1][1], Gn);
        const x = new Ht().lerpColors(u, h, (b - S) / (z - S));
        this.lut.push(x);
      }
    }
    return this.lut.push(new Ht(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Gs.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
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
    const r = l.getContext("2d", { alpha: false }), d = r.getImageData(0, 0, 1, this.n), u = d.data;
    let h = 0;
    const f = 1 / this.n, b = new Ht(), y = new Ht(), S = new Ht();
    for (let z = 1; z >= 0; z -= f) for (let x = this.map.length - 1; x >= 0; x--) if (z < this.map[x][0] && z >= this.map[x - 1][0]) {
      const W = this.map[x - 1][0], ue = this.map[x][0];
      b.setHex(this.map[x - 1][1], Gn), y.setHex(this.map[x][1], Gn), S.lerpColors(b, y, (z - W) / (ue - W)), u[h * 4] = Math.round(S.r * 255), u[h * 4 + 1] = Math.round(S.g * 255), u[h * 4 + 2] = Math.round(S.b * 255), u[h * 4 + 3] = 255, h += 1;
    }
    return r.putImageData(d, 0, 0), l;
  }
}
const Co = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ks = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], da = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ks, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, oo = j.state("safe"), Ss = j.state("auto");
function Ps(e) {
  e = Math.max(0, Math.min(1, e));
  const l = da[oo.val] ?? ks;
  for (let d = 0; d < l.length - 1; d++) {
    const [u, h, f, b] = l[d], [y, S, z, x] = l[d + 1];
    if (e <= y) {
      const W = (e - u) / (y - u);
      return [h + (S - h) * W, f + (z - f) * W, b + (x - b) * W];
    }
  }
  const r = l[l.length - 1];
  return [r[1], r[2], r[3]];
}
function fs() {
  const l = new Uint8Array(1024);
  for (let d = 0; d < 256; d++) {
    const u = d / 255, [h, f, b] = Ps(u);
    l[d * 4 + 0] = h, l[d * 4 + 1] = f, l[d * 4 + 2] = b, l[d * 4 + 3] = 255;
  }
  const r = new Js(l, 256, 1, Os);
  return r.minFilter = as, r.magFilter = as, r.wrapS = is, r.wrapT = is, r.needsUpdate = true, r;
}
function pa() {
  const l = [];
  for (let r = 0; r <= 12; r++) {
    const d = 1 - r / 12, [u, h, f] = Ps(d);
    l.push(`rgb(${u | 0},${h | 0},${f | 0}) ${(r / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function $o(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((h, f) => h - f), r = (h) => l[Math.min(l.length - 1, Math.max(0, Math.round(h * (l.length - 1))))];
  let d = l.length >= 20 ? r(0.01) : l[0], u = l.length >= 20 ? r(0.99) : l[l.length - 1];
  return d >= 0 && u > 0 && (d = 0), u <= 0 && d < 0 && (u = 0), [d, u];
}
function ua(e, l, r) {
  new _s();
  const d = fs(), u = new Hs({ uniforms: { cmap: { value: d }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: At, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  j.derive(() => {
    var _a2;
    oo.val;
    const f = u.uniforms.cmap.value;
    u.uniforms.cmap.value = fs(), (_a2 = f == null ? void 0 : f.dispose) == null ? void 0 : _a2.call(f);
  });
  const h = new lt(new ze(), u);
  return h.renderOrder = -1, h.frustumCulled = false, h.userData.isShellArea = true, h.name = "__hekatan_shell_colormap", j.derive(() => {
    h.geometry.setAttribute("position", new Pt(e.val.flat(), 3));
    const f = [], b = [], y = [];
    l.val.forEach((D, re) => {
      D.length === 3 ? (f.push(D[0], D[1], D[2]), b.push(re), y.push(0)) : D.length === 4 && (f.push(D[0], D[1], D[2]), f.push(D[0], D[2], D[3]), b.push(re, re), y.push(0, 1));
    }), h.geometry.setIndex(new Ws(f, 1)), h.userData.faceToElem = b, h.userData.faceLocal = y;
    const S = r.val.filter((D) => Number.isFinite(D));
    let z, x;
    const W = $n.val;
    if (W ? (x = W[0], z = W[1]) : [x, z] = $o(S), z === x) {
      const D = Math.max(Math.abs(z) * 1e-6, 1e-9);
      z += D, x -= D;
    }
    const ue = W && W[0] > W[1], me = Math.min(x, z), ie = Math.max(x, z), I = ie - me, le = new Float32Array(r.val.length);
    for (let D = 0; D < r.val.length; D++) {
      const re = r.val[D];
      if (!Number.isFinite(re)) {
        le[D] = -1;
        continue;
      }
      const R = ((ue ? ie + me - re : re) - me) / I;
      le[D] = Math.max(0, Math.min(1, R));
    }
    h.geometry.setAttribute("scalar", new yt(le, 1));
  }), h;
}
function fa(e, l, r) {
  const d = document.createElement("div"), u = new Ms({ title: "Settings", expanded: true, container: d });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(u), d.setAttribute("id", "settings");
  const h = "hk_settingsPos";
  let f = null;
  try {
    const x = localStorage.getItem(h);
    x && (f = JSON.parse(x));
  } catch {
  }
  d.style.cssText = ["position:fixed", f ? `left:${f.left}px` : "left:8px", f ? `top:${f.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const b = () => {
    const x = d.querySelector(".tp-rotv_b");
    if (!x) {
      setTimeout(b, 200);
      return;
    }
    x.style.cursor = "move", x.style.userSelect = "none";
    let W = false, ue = 0, me = 0, ie = 0, I = 0;
    x.addEventListener("mousedown", (le) => {
      W = true, ue = le.clientX, me = le.clientY;
      const D = d.getBoundingClientRect();
      ie = D.left, I = D.top, d.style.left = `${ie}px`, d.style.top = `${I}px`;
    }), window.addEventListener("mousemove", (le) => {
      if (!W) return;
      const D = le.clientX - ue, re = le.clientY - me, ae = Math.max(0, Math.min(window.innerWidth - 40, ie + D)), R = Math.max(0, Math.min(window.innerHeight - 40, I + re));
      d.style.left = `${ae}px`, d.style.top = `${R}px`;
    }), window.addEventListener("mouseup", () => {
      if (W) {
        W = false;
        try {
          localStorage.setItem(h, JSON.stringify({ left: parseFloat(d.style.left), top: parseFloat(d.style.top) }));
        } catch {
        }
      }
    });
  };
  if (b(), l == null ? void 0 : l.nodes) {
    u.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const x = u.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    x.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), x.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), x.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), x.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const W = x.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    W.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), W.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), W.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), W.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), W.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ue = u.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ue.addBinding(e.nodes, "val", { label: "Nodes" }), ue.addBinding(e.elements, "val", { label: "Elements" }), ue.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ue.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ue.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ue.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ue.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ue.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ue.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ue.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ue.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ue.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ue.addBinding(e.orientations, "val", { label: "Orientations" }), ue.addBinding(e.sections, "val", { label: "Sections" }), ue.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ue.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ue.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ue.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ue.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
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
    }), x.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), x.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), x.addBinding(oo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), x.addBinding(Ss, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), x.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), x.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), x.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), x.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  r && u.addBinding(e.solids, "val", { label: "Solids" });
  const y = u.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), S = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), z = () => {
    const x = window.__hekatanClipApply;
    typeof x == "function" && x();
  };
  return y.addBinding(S, "enableX", { label: "Cortar X" }).on("change", z), y.addBinding(S, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", z), y.addBinding(S, "invertX", { label: "  invertir X" }).on("change", z), y.addBinding(S, "enableY", { label: "Cortar Y" }).on("change", z), y.addBinding(S, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", z), y.addBinding(S, "invertY", { label: "  invertir Y" }).on("change", z), y.addBinding(S, "enableZ", { label: "Cortar Z" }).on("change", z), y.addBinding(S, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", z), y.addBinding(S, "invertZ", { label: "  invertir Z" }).on("change", z), d;
}
function ha(e) {
  return { gridSize: j.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: j.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: j.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: j.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: j.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: j.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: j.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: j.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: j.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: j.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: j.state((e == null ? void 0 : e.nodes) ?? true), elements: j.state((e == null ? void 0 : e.elements) ?? true), edges: j.state((e == null ? void 0 : e.edges) ?? true), faces: j.state((e == null ? void 0 : e.faces) ?? true), elemColumns: j.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: j.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: j.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: j.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: j.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: j.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: j.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: j.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: j.state((e == null ? void 0 : e.orientations) ?? false), sections: j.state((e == null ? void 0 : e.sections) ?? true), extruded: j.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: j.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: j.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: j.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: j.state((e == null ? void 0 : e.secFloor) ?? -1), supports: j.state((e == null ? void 0 : e.supports) ?? true), loads: j.state((e == null ? void 0 : e.loads) ?? false), deformedShape: j.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: j.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: j.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: j.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: j.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: j.state((e == null ? void 0 : e.flipAxes) ?? false), solids: j.state((e == null ? void 0 : e.solids) ?? true), custom3D: j.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: j.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: j.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: j.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ma(e, l, r) {
  const d = dn(), u = new Qn(new ze(), new jn({ color: d.nodePoint }));
  return gs((h, f) => {
    u.material.color.setHex(f.nodePoint);
  }), u.frustumCulled = false, j.derive(() => {
    e.nodes.val && u.geometry.setAttribute("position", new Pt(l.val.flat(), 3));
  }), j.derive(() => {
    if (r.val, l.val, !e.nodes.rawVal) return;
    const h = l.rawVal ?? [];
    let f = e.gridSize.val * 0.5;
    if (h.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
      for (const z of h) for (let x = 0; x < 3; x++) y[x] = Math.min(y[x], z[x]), S[x] = Math.max(S[x], z[x]);
      f = Math.max(S[0] - y[0], S[1] - y[1], S[2] - y[2], 0.1);
    }
    const b = 0.03 * f;
    u.material.size = b * r.rawVal;
  }), j.derive(() => {
    u.visible = e.nodes.val;
  }), u;
}
function zo(e, l) {
  const r = dn(), d = new it();
  d.name = "hekatan-grid";
  const u = (l == null ? void 0 : l.planes) ?? ["xy"];
  let h = (l == null ? void 0 : l.majorStep) ?? 1, f = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (h <= 0 && (h = 1), f <= 0 && (f = 0.1); e / f > 500; ) f *= 2;
  for (; e / h > 100; ) h *= 2;
  const b = e / 2;
  h = Math.max(f, Math.round(h / f) * f);
  const S = new Ht(r.grid).multiplyScalar(1.3), z = new Ht(r.grid).multiplyScalar(0.8), x = (ie, I, le, D) => {
    const re = [], ae = ie === "xy" ? (C, N) => [C, N, 0] : ie === "xz" ? (C, N) => [C, 0, N] : (C, N) => [0, C, N], R = Math.floor(b / I);
    for (let C = -R; C <= R; C++) {
      const N = C * I, V = ae(N, -b), $ = ae(N, b);
      re.push(...V, ...$);
    }
    for (let C = -R; C <= R; C++) {
      const N = C * I, V = ae(-b, N), $ = ae(b, N);
      re.push(...V, ...$);
    }
    const A = new ze();
    A.setAttribute("position", new Pt(re, 3));
    const X = new ht({ color: le, transparent: true, opacity: D, depthWrite: false }), E = new Wt(A, X);
    return E.name = `grid-${ie}-${I === f ? "minor" : "major"}`, E;
  }, W = (ie, I, le) => {
    const D = ie === "xy" ? (E, C) => [E, C, 0] : ie === "xz" ? (E, C) => [E, 0, C] : (E, C) => [0, E, C], re = [[-b, -b], [b, -b], [b, b], [-b, b]], ae = [];
    for (const [E, C] of re) ae.push(...D(E, C));
    const R = new ze();
    R.setAttribute("position", new Pt(ae, 3));
    const A = new ht({ color: I, transparent: true, opacity: le, depthWrite: false }), X = new vs(R, A);
    return X.name = `grid-${ie}-border`, X.renderOrder = 1, X;
  }, ue = (ie, I, le) => {
    const D = ie === "xy" ? (A, X) => [A, X, 0] : ie === "xz" ? (A, X) => [A, 0, X] : (A, X) => [0, A, X], re = I === "u" ? [...D(-b, 0), ...D(b, 0)] : [...D(0, -b), ...D(0, b)], ae = new ze();
    ae.setAttribute("position", new Pt(re, 3));
    const R = new Wt(ae, new ht({ color: le, transparent: true, opacity: 0.45, depthWrite: false }));
    return R.name = `grid-${ie}-eje-${I}`, R.renderOrder = 1, R;
  }, me = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const ie of u) {
    d.add(x(ie, f, z, 0.12)), d.add(x(ie, h, S, 0.4));
    const [I, le] = me[ie];
    d.add(ue(ie, "u", I)), d.add(ue(ie, "v", le)), d.add(W(ie, S, 0.55));
  }
  return d.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: h, minorStep: f, gridSize: e, planes: [...u] }, d;
}
function wa(e, l, r, d) {
  const u = new it(), h = new Qs(0.5, 0.5, 0.5), f = new js(0.45, 0.7, 4);
  f.rotateX(Math.PI / 2), f.translate(0, 0, -0.35);
  const b = new ft({ color: 10166822 }), y = new ft({ color: 2792847 }), S = new ft({ color: 3835647 }), z = () => {
    const ue = r.rawVal ?? [];
    if (ue.length < 2) return l.gridSize.val * 0.5;
    let me = [1 / 0, 1 / 0, 1 / 0], ie = [-1 / 0, -1 / 0, -1 / 0];
    for (const I of ue) for (let le = 0; le < 3; le++) I[le] < me[le] && (me[le] = I[le]), I[le] > ie[le] && (ie[le] = I[le]);
    return Math.max(ie[0] - me[0], ie[1] - me[1], ie[2] - me[2], 0.1);
  }, x = () => 0.08 * z(), W = () => d.rawVal;
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    u.clear();
    const ue = x();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((me, ie) => {
      const I = r.val[ie];
      if (!I) return;
      const le = me ?? [], D = (le[0] ? 1 : 0) + (le[1] ? 1 : 0) + (le[2] ? 1 : 0), re = (le[3] ? 1 : 0) + (le[4] ? 1 : 0) + (le[5] ? 1 : 0);
      let ae;
      D >= 3 && re >= 3 ? ae = new lt(h, b) : D >= 3 && re === 0 ? ae = new lt(f, y) : ae = new lt(f, S), ae.position.set(I[0], I[1], I[2]);
      const R = ue * W();
      ae.scale.set(R, R, R), u.add(ae);
    });
  }), j.derive(() => {
    if (d.val, !l.supports.rawVal) return;
    const me = x() * W();
    u.children.forEach((ie) => ie.scale.set(me, me, me));
  }), j.derive(() => {
    u.visible = l.supports.val;
  }), u;
}
function ya(e, l, r, d) {
  const u = new it();
  u.name = "loadsGroup";
  function h(f) {
    if (f.length < 2) return 0.12 * l.gridSize.rawVal;
    const b = [1 / 0, 1 / 0, 1 / 0], y = [-1 / 0, -1 / 0, -1 / 0];
    for (const z of f) for (let x = 0; x < 3; x++) b[x] = Math.min(b[x], z[x]), y[x] = Math.max(y[x], z[x]);
    return 0.08 * Math.max(y[0] - b[0], y[1] - b[1], y[2] - b[2], 0.1);
  }
  return j.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    u.children.forEach((x) => x.dispose()), u.clear();
    const f = r.val, b = h(f), y = 240, S = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((x, W) => {
      f[W] && x.slice(0, 3).some((ue) => Math.abs(ue) > 1e-15) && S.push(W);
    });
    let z = S;
    if (S.length > y) {
      const x = S.map((E) => f[E][0]), W = S.map((E) => f[E][1]), ue = Math.min(...x), me = Math.max(...x), ie = Math.min(...W), I = Math.max(...W), le = S.map((E) => f[E][2]), D = Math.max(1e-6, (Math.max(...le) - Math.min(...le)) / 40), re = (E) => Math.round(E / D), ae = new Set(le.map(re)), R = Math.max(4, Math.floor(y / Math.max(1, ae.size))), A = Math.max(2, Math.round(Math.sqrt(R))), X = /* @__PURE__ */ new Map();
      for (const E of S) {
        const C = me - ue < 1e-9 ? 0 : (f[E][0] - ue) / (me - ue), N = I - ie < 1e-9 ? 0 : (f[E][1] - ie) / (I - ie), V = Math.min(A - 1, Math.floor(C * A)), $ = Math.min(A - 1, Math.floor(N * A)), ee = `${V},${$},${re(f[E][2])}`, se = Math.hypot(C * A - (V + 0.5), N * A - ($ + 0.5)), pe = X.get(ee);
        (!pe || se < pe.d) && X.set(ee, { i: E, d: se });
      }
      z = [...X.values()].map((E) => E.i);
    }
    for (const x of z) {
      const W = e.nodeInputs.val.loads.get(x), ue = f[x];
      if (!ue) continue;
      const me = new k(...W.slice(0, 3));
      if (me.lengthSq() < 1e-30) continue;
      me.normalize();
      const ie = new cn(me, new k(...ue), 1, 15637248, 0.3, 0.3), I = b * d.rawVal;
      ie.scale.set(I, I, I), u.add(ie);
    }
  }), j.derive(() => {
    if (d.val, !l.loads.rawVal) return;
    const b = h(r.rawVal) * d.rawVal;
    u.children.forEach((y) => y.scale.set(b, b, b));
  }), j.derive(() => {
    u.visible = l.loads.val;
  }), u;
}
function xa(e, l, r) {
  const d = new it();
  return j.derive(() => {
    if (!e.nodesIndexes.val) return;
    d.children.forEach((h) => h.dispose()), d.clear();
    const u = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((h, f) => {
      const b = new Ft(`${f}`);
      b.position.set(...h), b.updateScale(u * r.rawVal), d.add(b);
    });
  }), j.derive(() => {
    if (r.val, !e.nodesIndexes.rawVal) return;
    const u = 0.05 * e.gridSize.val * 0.6;
    d.children.forEach((h) => h.updateScale(u * r.rawVal));
  }), j.derive(() => {
    d.visible = e.nodesIndexes.val;
  }), d;
}
function ga(e, l, r, d) {
  const u = new it();
  return j.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    u.children.forEach((f) => f.dispose()), u.clear();
    const h = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((f, b) => {
      const y = new Ft(`${b}`, void 0, "#001219");
      y.position.set(...va(f.map((S) => r.rawVal[S]))), y.updateScale(h * d.rawVal), u.add(y);
    });
  }), j.derive(() => {
    if (d.val, !l.elementsIndexes.rawVal) return;
    const h = 0.05 * l.gridSize.val * 0.6;
    u.children.forEach((f) => f.updateScale(h * d.rawVal));
  }), j.derive(() => {
    u.visible = l.elementsIndexes.val;
  }), u;
}
function va(e) {
  const l = e.reduce((d, u) => [d[0] + u[0], d[1] + u[1], d[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function hs(e, l) {
  const r = new it(), d = Math.min(0.05 * e, 0.6), u = dn(), h = new Ft("X", "red", "transparent"), f = new Ft(l ? "Z" : "Y", "green", "transparent"), b = new Ft(l ? "Y" : "Z", "blue", "transparent"), y = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), S = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), z = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, u.axisArrow, 0.2, 0.2);
  return h.position.set(1.3 * d, 0, 0), f.position.set(0, 1.3 * d, 0), b.position.set(0, 0, 1.3 * d), h.updateScale(0.4 * d), f.updateScale(0.4 * d), b.updateScale(0.4 * d), y.scale.set(d, d, d), S.scale.set(d, d, d), z.scale.set(d, d, d), r.add(y, S, z, h, f, b), r;
}
function Lo(e, l) {
  const r = new k(...e), u = new k(...l).clone().sub(r), h = u.length(), f = u.dot(new k(1, 0, 0)) / h, b = u.dot(new k(0, 1, 0)) / h, y = u.dot(new k(0, 0, 1)) / h, S = Math.sqrt(f ** 2 + b ** 2);
  let z = new ko().fromArray([[f, b, y], [-b / S, f / S, 0], [-f * y / S, -b * y / S, S]].flat());
  return y === 1 && (z = new ko().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), y === -1 && (z = new ko().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new no().setFromMatrix3(z);
}
function Eo(e, l) {
  return e == null ? void 0 : e.map((r, d) => (9 * r + l[d]) / 10);
}
function Tn(e) {
  const l = e.reduce((d, u) => [d[0] + u[0], d[1] + u[1], d[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function ba(e, l, r) {
  const d = Tn([l, r]), u = Tn([e, r]), h = Tn([e, l]), f = new k(...d).sub(new k(...u)).normalize(), b = new k(...r).sub(new k(...h)).normalize(), y = f.clone().cross(b).normalize(), S = y.clone().cross(f).normalize();
  return new no().makeBasis(f, S, y);
}
function Ma(e, l, r, d) {
  const u = new it(), h = new ze(), f = new ht({ vertexColors: true }), b = [0, 0, 0], y = [1, 0, 0], S = [0, 1, 0], z = [0, 0, 1];
  h.setAttribute("position", new Pt([...b, ...y, ...b, ...S, ...b, ...z], 3));
  const x = [255, 0, 0], W = [0, 255, 0], ue = [0, 0, 255];
  return h.setAttribute("color", new Pt([...x, ...x, ...W, ...W, ...ue, ...ue], 3)), j.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (u.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((me) => {
      const ie = new Wt(h, f), I = r.rawVal[me[0]], le = r.rawVal[me[1]];
      if (me.length === 2 && (ie.position.set(...Eo(I, le)), ie.rotation.setFromRotationMatrix(Lo(I, le))), me.length === 3) {
        const ae = r.rawVal[me[2]];
        ie.position.set(...Tn([I, le, ae])), ie.rotation.setFromRotationMatrix(ba(I, le, ae));
      }
      const re = 0.05 * l.gridSize.rawVal * 0.75 * d.rawVal;
      ie.scale.set(re, re, re), u.add(ie);
    }));
  }), j.derive(() => {
    if (d.val, !l.orientations.rawVal) return;
    const ie = 0.05 * l.gridSize.val * 0.75 * d.rawVal;
    u.children.forEach((I) => I.scale.set(ie, ie, ie));
  }), j.derive(() => {
    u.visible = l.orientations.val;
  }), u;
}
function _a(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), r = (e.h * 100).toFixed(0);
    return `${l}x${r}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ka(e, l, r, d) {
  const u = new it(), h = new it();
  u.add(h);
  function f(A, X) {
    const E = A / 2, C = X / 2, N = new Float32Array([0, -E, -C, 0, E, -C, 0, E, C, 0, -E, -C, 0, E, C, 0, -E, C]), V = new ze();
    V.setAttribute("position", new yt(N, 3));
    const $ = new Float32Array([0, -E, -C, 0, E, -C, 0, E, C, 0, -E, C, 0, -E, -C]), ee = new ze();
    return ee.setAttribute("position", new yt($, 3)), { fill: V, outline: ee };
  }
  function b(A, X = 24) {
    const E = A / 2, C = new Float32Array(X * 9);
    for (let ee = 0; ee < X; ee++) {
      const se = ee / X * Math.PI * 2, pe = (ee + 1) / X * Math.PI * 2;
      C[ee * 9] = 0, C[ee * 9 + 1] = 0, C[ee * 9 + 2] = 0, C[ee * 9 + 3] = 0, C[ee * 9 + 4] = E * Math.cos(se), C[ee * 9 + 5] = E * Math.sin(se), C[ee * 9 + 6] = 0, C[ee * 9 + 7] = E * Math.cos(pe), C[ee * 9 + 8] = E * Math.sin(pe);
    }
    const N = new ze();
    N.setAttribute("position", new yt(C, 3));
    const V = new Float32Array((X + 1) * 3);
    for (let ee = 0; ee <= X; ee++) {
      const se = ee / X * Math.PI * 2;
      V[ee * 3] = 0, V[ee * 3 + 1] = E * Math.cos(se), V[ee * 3 + 2] = E * Math.sin(se);
    }
    const $ = new ze();
    return $.setAttribute("position", new yt(V, 3)), { fill: N, outline: $ };
  }
  function y(A, X, E, C) {
    const N = E ?? X * 0.08, V = C ?? A * 0.07, $ = A / 2, ee = X / 2, se = ee - N, pe = V / 2, ne = [];
    function B(xe, Ee, Me, Le) {
      ne.push(0, xe, Ee, 0, Me, Ee, 0, Me, Le, 0, xe, Ee, 0, Me, Le, 0, xe, Le);
    }
    B(-$, -ee, $, -se), B(-pe, -se, pe, se), B(-$, se, $, ee);
    const fe = new ze();
    fe.setAttribute("position", new yt(new Float32Array(ne), 3));
    const J = new Float32Array([0, -$, -ee, 0, $, -ee, 0, $, -se, 0, pe, -se, 0, pe, se, 0, $, se, 0, $, ee, 0, -$, ee, 0, -$, se, 0, -pe, se, 0, -pe, -se, 0, -$, -se, 0, -$, -ee]), ye = new ze();
    return ye.setAttribute("position", new yt(J, 3)), { fill: fe, outline: ye };
  }
  function S(A, X, E) {
    const C = A / 2, N = X / 2, V = C - E, $ = N - E, ee = [];
    function se(fe, J, ye, xe) {
      ee.push(0, fe, J, 0, ye, J, 0, ye, xe, 0, fe, J, 0, ye, xe, 0, fe, xe);
    }
    se(-C, -N, C, -$), se(-C, $, C, N), se(-C, -$, -V, $), se(V, -$, C, $);
    const pe = new ze();
    pe.setAttribute("position", new yt(new Float32Array(ee), 3));
    const ne = new Float32Array([0, -C, -N, 0, C, -N, 0, C, -N, 0, C, N, 0, C, N, 0, -C, N, 0, -C, N, 0, -C, -N, 0, -V, -$, 0, V, -$, 0, V, -$, 0, V, $, 0, V, $, 0, -V, $, 0, -V, $, 0, -V, -$]), B = new ze();
    return B.setAttribute("position", new yt(ne, 3)), { fill: pe, outline: B };
  }
  function z(A, X, E) {
    const C = A / 2, N = X / 2, V = C - E, $ = N - E, ee = new ze(), se = new Float32Array([0, -V, -$, 0, V, -$, 0, V, $, 0, -V, -$, 0, V, $, 0, -V, $]);
    ee.setAttribute("position", new yt(se, 3));
    const pe = [];
    function ne(ye, xe, Ee, Me) {
      pe.push(0, ye, xe, 0, Ee, xe, 0, Ee, Me, 0, ye, xe, 0, Ee, Me, 0, ye, Me);
    }
    ne(-C, -N, C, -$), ne(-C, $, C, N), ne(-C, -$, -V, $), ne(V, -$, C, $);
    const B = new ze();
    B.setAttribute("position", new yt(new Float32Array(pe), 3));
    const fe = new Float32Array([0, -C, -N, 0, C, -N, 0, C, -N, 0, C, N, 0, C, N, 0, -C, N, 0, -C, N, 0, -C, -N, 0, -V, -$, 0, V, -$, 0, V, -$, 0, V, $, 0, V, $, 0, -V, $, 0, -V, $, 0, -V, -$]), J = new ze();
    return J.setAttribute("position", new yt(fe, 3)), { concFill: ee, steelFillGeom: B, outline: J };
  }
  function x(A, X, E) {
    const C = [], N = [[0, -A / 2, -X / 2], [0, -A / 2 + E, -X / 2], [0, -A / 2 + E, X / 2 - E], [0, A / 2, X / 2 - E], [0, A / 2, X / 2], [0, -A / 2, X / 2]], V = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of V) C.push(...N[pe]);
    const $ = new ze();
    $.setAttribute("position", new yt(new Float32Array(C), 3));
    const ee = [];
    for (let pe = 0; pe < N.length; pe++) {
      const ne = (pe + 1) % N.length;
      ee.push(...N[pe], ...N[ne]);
    }
    const se = new ze();
    return se.setAttribute("position", new yt(new Float32Array(ee), 3)), { fill: $, outline: se };
  }
  function W(A, X, E, C) {
    const N = C / 2, V = [], $ = [[0, -A - N, -X / 2], [0, -E - N, -X / 2], [0, -E - N, X / 2 - E], [0, -N, X / 2 - E], [0, -N, X / 2], [0, -A - N, X / 2]], ee = [[0, N, -X / 2], [0, N + E, -X / 2], [0, N + E, X / 2 - E], [0, A + N, X / 2 - E], [0, A + N, X / 2], [0, N, X / 2]], se = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of se) V.push(...$[fe]);
    for (const fe of se) V.push(...ee[fe]);
    const pe = new ze();
    pe.setAttribute("position", new yt(new Float32Array(V), 3));
    const ne = [];
    for (const fe of [$, ee]) for (let J = 0; J < fe.length; J++) {
      const ye = (J + 1) % fe.length;
      ne.push(...fe[J], ...fe[ye]);
    }
    const B = new ze();
    return B.setAttribute("position", new yt(new Float32Array(ne), 3)), { fill: pe, outline: B };
  }
  function ue(A, X, E, C) {
    const N = X / 2, V = A, $ = [[0, -V, -N], [0, -V, -N + E], [0, -C, -N + E], [0, -C, N - E], [0, -V, N - E], [0, -V, N], [0, 0, N], [0, 0, -N]], ee = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], se = [];
    for (const fe of ee) se.push(...$[fe]);
    const pe = new ze();
    pe.setAttribute("position", new yt(new Float32Array(se), 3));
    const ne = [];
    for (let fe = 0; fe < $.length; fe++) {
      const J = (fe + 1) % $.length;
      ne.push(...$[fe], ...$[J]);
    }
    const B = new ze();
    return B.setAttribute("position", new yt(new Float32Array(ne), 3)), { fill: pe, outline: B };
  }
  function me(A, X, E, C, N) {
    const V = X / 2, $ = N / 2, ee = [], se = [[0, -A, -V], [0, -A, -V + E], [0, -$ - C, -V + E], [0, -$ - C, V - E], [0, -A, V - E], [0, -A, V], [0, -$, V], [0, -$, -V]], pe = se.map((ye) => [ye[0], -ye[1], ye[2]]), ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const ye of ne) ee.push(...se[ye]);
    for (const ye of ne) ee.push(...pe[ye]);
    const B = new ze();
    B.setAttribute("position", new yt(new Float32Array(ee), 3));
    const fe = [];
    for (const ye of [se, pe]) for (let xe = 0; xe < ye.length; xe++) {
      const Ee = (xe + 1) % ye.length;
      fe.push(...ye[xe], ...ye[Ee]);
    }
    const J = new ze();
    return J.setAttribute("position", new yt(new Float32Array(fe), 3)), { fill: B, outline: J };
  }
  function ie(A, X, E, C) {
    const N = A / 2, V = X / 2, $ = C / 2, ee = [[0, -$, -V], [0, $, -V], [0, $, V - E], [0, N, V - E], [0, N, V], [0, -N, V], [0, -N, V - E], [0, -$, V - E]], se = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], pe = [];
    for (const J of se) pe.push(...ee[J]);
    const ne = new ze();
    ne.setAttribute("position", new yt(new Float32Array(pe), 3));
    const B = [];
    for (let J = 0; J < ee.length; J++) {
      const ye = (J + 1) % ee.length;
      B.push(...ee[J], ...ee[ye]);
    }
    const fe = new ze();
    return fe.setAttribute("position", new yt(new Float32Array(B), 3)), { fill: ne, outline: fe };
  }
  function I(A, X, E = 24) {
    const C = A / 2, N = C - X, V = [];
    for (let pe = 0; pe < E; pe++) {
      const ne = pe / E * Math.PI * 2, B = (pe + 1) / E * Math.PI * 2, fe = Math.cos(ne), J = Math.sin(ne), ye = Math.cos(B), xe = Math.sin(B);
      V.push(0, C * fe, C * J, 0, C * ye, C * xe, 0, N * ye, N * xe), V.push(0, C * fe, C * J, 0, N * ye, N * xe, 0, N * fe, N * J);
    }
    const $ = new ze();
    $.setAttribute("position", new yt(new Float32Array(V), 3));
    const ee = [];
    for (let pe = 0; pe < E; pe++) {
      const ne = pe / E * Math.PI * 2, B = (pe + 1) / E * Math.PI * 2;
      ee.push(0, C * Math.cos(ne), C * Math.sin(ne), 0, C * Math.cos(B), C * Math.sin(B)), ee.push(0, N * Math.cos(ne), N * Math.sin(ne), 0, N * Math.cos(B), N * Math.sin(B));
    }
    const se = new ze();
    return se.setAttribute("position", new yt(new Float32Array(ee), 3)), { fill: $, outline: se };
  }
  const le = new ft({ color: 52479, transparent: true, opacity: 0.35, side: At, depthWrite: false }), D = new ht({ color: 52479 }), re = new ft({ color: 16750848, transparent: true, opacity: 0.4, side: At, depthWrite: false }), ae = new ht({ color: 16750848 });
  function R(A, X) {
    const E = Math.abs(X[0] - A[0]), C = Math.abs(X[1] - A[1]), N = Math.abs(X[2] - A[2]);
    return N > E && N > C || C > E && C > N;
  }
  return j.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const A = l.secColumns.rawVal, X = l.secBeams.rawVal;
    if (!A && !X) {
      u.children.forEach(($) => {
        $ instanceof Ft && $.dispose();
      }), u.clear();
      return;
    }
    u.children.forEach(($) => {
      $ instanceof Ft && $.dispose();
    }), u.clear();
    const E = (_a2 = e.elements) == null ? void 0 : _a2.val, C = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!E || !C) return;
    const N = C.sectionShapes, V = l.secFloor.rawVal;
    E.forEach(($, ee) => {
      if ($.length !== 2) return;
      const se = r.rawVal[$[0]], pe = r.rawVal[$[1]];
      if (!se || !pe) return;
      const ne = R(se, pe);
      if (ne && !A || !ne && !X) return;
      if (V >= 0) {
        const xe = Math.min(se[1], pe[1]);
        Math.max(se[1], pe[1]);
        const Ee = l.gridSize.rawVal || 3;
        if (Math.floor(xe / Ee + 0.01) !== V) return;
      }
      const B = N == null ? void 0 : N.get(ee);
      if (!B) return;
      const fe = [(se[0] + pe[0]) / 2, (se[1] + pe[1]) / 2, (se[2] + pe[2]) / 2], J = Lo(se, pe);
      if (B.type === "CFT") {
        const xe = z(B.b, B.h, B.tw ?? B.b * 0.05), Ee = new lt(xe.concFill, le);
        Ee.position.set(...fe), Ee.rotation.setFromRotationMatrix(J), u.add(Ee);
        const Me = new lt(xe.steelFillGeom, re);
        Me.position.set(...fe), Me.rotation.setFromRotationMatrix(J), u.add(Me);
        const Le = new zt(xe.outline, ae);
        Le.position.set(...fe), Le.rotation.setFromRotationMatrix(J), u.add(Le);
      } else {
        let xe, Ee, Me;
        switch (B.type) {
          case "rect":
            xe = f(B.b, B.h), Ee = le, Me = D;
            break;
          case "circ":
            xe = b(B.d), Ee = le, Me = D;
            break;
          case "I":
            xe = y(B.b, B.h, B.tf, B.tw), Ee = re, Me = ae;
            break;
          case "HSS":
            xe = S(B.b, B.h, B.tw ?? B.b * 0.05), Ee = re, Me = ae;
            break;
          case "CFT":
            xe = z(B.b, B.h, B.tw ?? B.b * 0.05), Ee = re, Me = ae;
            break;
          case "L":
            xe = x(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3), Ee = re, Me = ae;
            break;
          case "2L":
            xe = W(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3, B.dis ?? 0.01), Ee = re, Me = ae;
            break;
          case "C":
          case "coldC":
            xe = ue(B.b, B.h, B.tf ?? B.t ?? 3e-3, B.tw ?? B.t ?? 3e-3), Ee = re, Me = ae;
            break;
          case "2C":
            xe = me(B.b, B.h, B.tf ?? 5e-3, B.tw ?? 5e-3, B.dis ?? 0.01), Ee = re, Me = ae;
            break;
          case "T":
            xe = ie(B.b, B.h, B.tf ?? 0.01, B.tw ?? 6e-3), Ee = re, Me = ae;
            break;
          case "pipe":
            xe = I(B.d, B.tw ?? B.d * 0.05), Ee = re, Me = ae;
            break;
          default:
            return;
        }
        const Le = new lt(xe.fill, Ee);
        Le.position.set(...fe), Le.rotation.setFromRotationMatrix(J), u.add(Le);
        const Ke = new zt(xe.outline, Me);
        Ke.position.set(...fe), Ke.rotation.setFromRotationMatrix(J), u.add(Ke);
      }
      const ye = _a(B);
      if (ye) {
        const Ee = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(B.type) ? "#ff9900" : "#00ccff", Me = new Ft(ye, Ee, "transparent");
        Me.position.set(fe[0], fe[1], fe[2]);
        const Le = 0.05 * l.gridSize.rawVal * 0.5;
        Me.updateScale(Le * ((d == null ? void 0 : d.rawVal) ?? 1)), h.add(Me);
      }
    });
  }), d && j.derive(() => {
    if (d.val, !l.sections.rawVal) return;
    const A = 0.05 * l.gridSize.val * 0.5;
    h.children.forEach((X) => {
      X instanceof Ft && X.updateScale(A * d.rawVal);
    });
  }), j.derive(() => {
    u.visible = l.sections.val;
  }), j.derive(() => {
    h.visible = l.sectionLabels.val;
  }), u;
}
function Sa(e) {
  if (!e) return null;
  const l = e.type, r = (z, x) => [z, x], d = (z, x) => [r(-z / 2, -x / 2), r(z / 2, -x / 2), r(z / 2, x / 2), r(-z / 2, x / 2)], u = (z, x = 24) => {
    const W = z / 2, ue = [];
    for (let me = 0; me < x; me++) {
      const ie = 2 * Math.PI * me / x;
      ue.push(r(W * Math.cos(ie), W * Math.sin(ie)));
    }
    return ue;
  }, h = e.b ?? 0, f = e.h ?? 0, b = e.d ?? 0, y = e.tw ?? e.t ?? 0, S = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return h && f ? { contorno: d(h, f) } : null;
    case "circ":
      return b ? { contorno: u(b) } : null;
    case "pipe":
      return b && y ? { contorno: u(b), huecos: [u(b - 2 * y).reverse()] } : null;
    case "HSS":
      return h && f && y ? { contorno: d(h, f), huecos: [d(h - 2 * y, f - 2 * (S || y)).reverse()] } : null;
    case "CFT":
      return h && f ? { contorno: d(h, f) } : null;
    case "I":
      return h && f && y && S ? { contorno: [r(-h / 2, -f / 2), r(h / 2, -f / 2), r(h / 2, -f / 2 + S), r(y / 2, -f / 2 + S), r(y / 2, f / 2 - S), r(h / 2, f / 2 - S), r(h / 2, f / 2), r(-h / 2, f / 2), r(-h / 2, f / 2 - S), r(-y / 2, f / 2 - S), r(-y / 2, -f / 2 + S), r(-h / 2, -f / 2 + S)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return h && f && y && S ? { contorno: [r(-h / 2, -f / 2), r(h / 2, -f / 2), r(h / 2, -f / 2 + S), r(-h / 2 + y, -f / 2 + S), r(-h / 2 + y, f / 2 - S), r(h / 2, f / 2 - S), r(h / 2, f / 2), r(-h / 2, f / 2)] } : null;
    case "T":
      return h && f && y && S ? { contorno: [r(-y / 2, -f / 2), r(y / 2, -f / 2), r(y / 2, f / 2 - S), r(h / 2, f / 2 - S), r(h / 2, f / 2), r(-h / 2, f / 2), r(-h / 2, f / 2 - S), r(-y / 2, f / 2 - S)] } : null;
    case "L":
    case "2L":
      return h && f && y ? { contorno: [r(-h / 2, -f / 2), r(h / 2, -f / 2), r(h / 2, -f / 2 + y), r(-h / 2 + y, -f / 2 + y), r(-h / 2 + y, f / 2), r(-h / 2, f / 2)] } : null;
    default:
      return h && f ? { contorno: d(h, f) } : b ? { contorno: u(b) } : null;
  }
}
function Pa(e, l, r) {
  if (!e || e <= 0 || !l || !r || l <= 0 || r <= 0) return null;
  const d = Math.sqrt(Math.sqrt(r / l)), u = Math.sqrt(e / d), h = e / u;
  return !isFinite(u) || !isFinite(h) || u <= 0 || h <= 0 ? null : { contorno: [[-u / 2, -h / 2], [u / 2, -h / 2], [u / 2, h / 2], [-u / 2, h / 2]] };
}
function Ca(e) {
  const l = new Vn();
  e.contorno.forEach(([r, d], u) => u ? l.lineTo(r, d) : l.moveTo(r, d)), l.closePath();
  for (const r of e.huecos ?? []) {
    const d = new ta();
    r.forEach(([u, h], f) => f ? d.lineTo(u, h) : d.moveTo(u, h)), d.closePath(), l.holes.push(d);
  }
  return l;
}
function za(e, l, r) {
  const d = new it();
  d.name = "extrusion";
  const u = new So({ color: 8369151, transparent: true, opacity: 0.92, side: At }), h = new So({ color: 12623968, transparent: true, opacity: 0.85, side: At }), f = new So({ color: 11583173, transparent: true, opacity: 0.85, side: At }), b = new it();
  b.add(new bs(16777215, 0.55));
  const y = new to(16777215, 0.75);
  y.position.set(30, 25, 40);
  const S = new to(16777215, 0.35);
  S.position.set(-25, -20, 15), b.add(y, S);
  let z = 0;
  return j.derive(() => {
    var _a2, _b, _c, _d, _e;
    const x = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++z, on: x }, d.visible = x;
    for (const D of [...d.children]) D !== b && (d.remove(D), (_c = (_b = D.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (d.children.includes(b) || d.add(b), !x) return;
    const W = r.val ?? [], ue = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], me = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, ie = me.sectionShapes ?? /* @__PURE__ */ new Map(), I = me.thicknesses ?? /* @__PURE__ */ new Map();
    let le = "";
    try {
      ue.forEach((D, re) => {
        var _a3, _b2, _c2;
        if (D.length === 2) {
          let ae = Sa(ie.get(re)), R = true;
          if (ae || (ae = Pa((_a3 = me.areas) == null ? void 0 : _a3.get(re), (_b2 = me.momentsOfInertiaY) == null ? void 0 : _b2.get(re), (_c2 = me.momentsOfInertiaZ) == null ? void 0 : _c2.get(re)), R = false), !ae) return;
          const A = W[D[0]], X = W[D[1]];
          if (!A || !X) return;
          const E = Math.hypot(X[0] - A[0], X[1] - A[1], X[2] - A[2]);
          if (E < 1e-9) return;
          const C = new ea(Ca(ae), { depth: E, bevelEnabled: false, curveSegments: 4 });
          C.applyMatrix4(new no().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const N = new lt(C, R ? u : h);
          N.position.set(A[0], A[1], A[2]), N.rotation.setFromRotationMatrix(Lo(A, X)), d.add(N);
          return;
        }
        if (D.length === 3 || D.length === 4) {
          const ae = I.get(re);
          if (!ae || ae <= 0) return;
          const R = D.map((J) => W[J]).filter(Boolean);
          if (R.length < 3) return;
          const A = [R[1][0] - R[0][0], R[1][1] - R[0][1], R[1][2] - R[0][2]], X = [R[2][0] - R[0][0], R[2][1] - R[0][1], R[2][2] - R[0][2]], E = A[1] * X[2] - A[2] * X[1], C = A[2] * X[0] - A[0] * X[2], N = A[0] * X[1] - A[1] * X[0], V = Math.hypot(E, C, N);
          if (V < 1e-12) return;
          const $ = [E / V, C / V, N / V], ee = [], se = (J) => R.map((ye) => [ye[0] + $[0] * J, ye[1] + $[1] * J, ye[2] + $[2] * J]), pe = se(+ae / 2), ne = se(-ae / 2), B = (J, ye, xe) => ee.push(...J, ...ye, ...xe);
          for (const J of [pe, ne]) B(J[0], J[1], J[2]), J.length === 4 && B(J[0], J[2], J[3]);
          for (let J = 0; J < R.length; J++) {
            const ye = (J + 1) % R.length;
            B(pe[J], ne[J], ne[ye]), B(pe[J], ne[ye], pe[ye]);
          }
          const fe = new ze();
          fe.setAttribute("position", new Pt(ee, 3)), fe.computeVertexNormals(), d.add(new lt(fe, f));
        }
      });
    } catch (D) {
      le = String((D == null ? void 0 : D.message) ?? D);
    }
    globalThis.__extrusionDebug = { corridas: z, on: x, fallo: le, nElementos: ue.length, nFormas: ie.size, nEspesores: I.size, mallas: d.children.length - 1 };
  }), d;
}
function Cs(e, l, r = 0) {
  const d = [l[0] - e[0], l[1] - e[1], l[2] - e[2]], u = Math.hypot(d[0], d[1], d[2]) || 1, h = d[0] / u, f = d[1] / u, b = d[2] / u, y = Math.sqrt(h * h + f * f);
  let S, z, x;
  if (y < 1e-9) {
    const W = b > 0 ? 1 : -1;
    S = [0, 0, W], z = [1, 0, 0], x = [0, W, 0];
  } else S = [h, f, b], z = [-h * b / y, -f * b / y, y], x = [f / y, -h / y, 0];
  if (Math.abs(r) > 1e-12) {
    const W = r * Math.PI / 180, ue = Math.cos(W), me = Math.sin(W), ie = z.map((le, D) => ue * le + me * x[D]), I = x.map((le, D) => -me * z[D] + ue * le);
    z = ie, x = I;
  }
  return { e1: S, e2: z, e3: x };
}
function Vo(e, l) {
  if (!l) return [0, 0];
  const r = Number(l[0] ?? 0), d = Number(l[1] ?? 0);
  return e === "bendingsY" ? [r, -d] : [-r, d];
}
function zs(e, l) {
  const r = (d) => d.map((u) => -u);
  switch (e) {
    case "bendingsZ":
      return r(l.e2);
    case "bendingsY":
      return r(l.e3);
    case "shearsZ":
      return l.e3;
    default:
      return l.e2;
  }
}
class Jn extends it {
  constructor(l, r, d, u, h, f, b) {
    super();
    const y = new Vn().moveTo(0, 0).lineTo(0, f[1]).lineTo(d, f[1]).lineTo(d, 0).lineTo(0, 0), S = y.getPoints(), z = new ze().setFromPoints(S);
    this.lines = new zt(z, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const x = new eo(y), W = new ft({ color: f[1] > 0 ? 24435 : 11411474, side: At });
    this.mesh = new lt(x, W), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Ft(`${h[1].toFixed(4)}`), this.normalizedResult = f, this.textPosition = Tn([l, r]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(u), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Fo extends it {
  constructor(l, r, d, u, h, f, b) {
    super();
    const y = h[0] * d / (h[0] + h[1]), S = h[0] * h[1] > 0;
    if (this.text = new Ft(`${h[0].toFixed(4)}`), this.text2 = new Ft(`${(h[1] * -1).toFixed(4)}`), this.normalizedResult = f, this.textPosition = Eo(l, r), this.text2Position = Eo(r, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(u), this.text2.rotation.setFromRotationMatrix(u), this.add(this.text, this.text2), S) {
      const z = new Vn().moveTo(0, 0).lineTo(0, f[0]).lineTo(y, 0).lineTo(0, 0), x = new Vn().moveTo(y, 0).lineTo(d, -f[1]).lineTo(d, 0).lineTo(y, 0), W = z.getPoints(), ue = x.getPoints(), me = new ze().setFromPoints(W), ie = new ze().setFromPoints(ue), I = new ht({ color: dn().resultOutline });
      this.lines = new zt(me, I), this.lines2 = new zt(ie, I), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), this.lines2.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), b && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const le = new eo(z), D = new eo(x), re = new ft({ color: f[0] > 0 ? 24435 : 11411474, side: At }), ae = new ft({ color: -f[1] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(le, re), this.mesh2 = new lt(D, ae), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), this.mesh2.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), b && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const z = new Vn().moveTo(0, 0).lineTo(0, f[0]).lineTo(d, -f[1]).lineTo(d, 0).lineTo(0, 0), x = z.getPoints(), W = new ze().setFromPoints(x);
      this.lines = new zt(W, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ue = new eo(z), me = new ft({ color: f[0] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(ue, me), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var Fs = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(Fs || {});
function Fa(e, l, r, d) {
  const u = () => {
    const b = r.rawVal;
    if (!(b == null ? void 0 : b.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
    for (const x of b) for (let W = 0; W < 3; W++) x[W] < y[W] && (y[W] = x[W]), x[W] > S[W] && (S[W] = x[W]);
    const z = Math.hypot(S[0] - y[0], S[1] - y[1], S[2] - y[2]);
    return !isFinite(z) || z <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * z;
  }, h = new it(), f = { normals: Jn, shearsY: Jn, shearsZ: Jn, torsions: Jn, bendingsY: Fo, bendingsZ: Fo };
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, r.val, l.frameResults.val == "none") return;
    h.children.forEach((y) => y.dispose()), h.clear();
    const b = Fs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[b]) == null ? void 0 : _b.forEach((y, S) => {
      var _a3, _b2, _c, _d, _e, _f;
      const z = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[S]) ?? [0, 1], x = r.rawVal[z[0]], W = r.rawVal[z[1]];
      if (!x || !W) return;
      const ue = new k(...W).distanceTo(new k(...x)), me = Aa((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[b]), ie = ((_f = (_e = (_d = (_c = e.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, S)) ?? 0, I = Cs(x, W, ie), le = zs(b, I), D = new k(...I.e1), re = new k(...le), ae = new no().makeBasis(D, re, D.clone().cross(re)), [R, A] = Vo(b, y), X = f[b] === Fo ? [R, -A] : [R, A], E = X.map((N) => N / (me === 0 ? 1 : me)), C = new f[b](x, W, ue, ae, X, E, false);
      C.updateScale(u() * d.rawVal), h.add(C);
    });
  }), j.derive(() => {
    if (d.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const b = u();
    h.children.forEach((y) => y.updateScale(b * d.rawVal));
  }), j.derive(() => {
    h.visible = l.frameResults.val != "none";
  }), h;
}
function Aa(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((r) => {
    const d = Math.max(...(r ?? [0, 0]).map((u) => Math.abs(u)));
    d > l && (l = d);
  }), l;
}
class Ea extends it {
  constructor(l, r, d) {
    super();
    const u = r === Io.reactions;
    d[0] && (this.xText1 = new Ft(`${u ? "Fx" : "Dx"}: ` + d[0].toFixed(4))), d[3] && (this.xText2 = new Ft(`${u ? "Mx" : "Rx"}: ` + d[3].toFixed(4))), d[1] && (this.yText1 = new Ft(`${u ? "Fy" : "Dy"}: ` + d[1].toFixed(4))), d[4] && (this.yText2 = new Ft(`${u ? "My" : "Ry"}: ` + d[4].toFixed(4))), d[2] && (this.zText1 = new Ft(`${u ? "Fz" : "Dz"}: ` + d[2].toFixed(4))), d[5] && (this.zText2 = new Ft(`${u ? "Mz" : "Rz"}: ` + d[5].toFixed(4))), (d[0] || d[3]) && (this.xArrow = new cn(new k(1, 0, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (d[1] || d[4]) && (this.yArrow = new cn(new k(0, 1, 0), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), (d[2] || d[5]) && (this.zArrow = new cn(new k(0, 0, 1), new k(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
var Io = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(Io || {});
function Va(e, l, r, d) {
  const u = new it();
  return j.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    u.children.forEach((b) => b.dispose()), u.clear();
    const h = Io[l.nodeResults.rawVal], f = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[h]) == null ? void 0 : _b.forEach((b, y) => {
      const S = new Ea(r.rawVal[y], h, b ?? [0, 0, 0, 0, 0, 0]);
      S.updateScale(f * d.rawVal), u.add(S);
    });
  }), j.derive(() => {
    if (d.val, l.nodeResults.rawVal == "none") return;
    const h = 0.05 * l.gridSize.val;
    u.children.forEach((f) => f.updateScale(h * d.rawVal));
  }), j.derive(() => {
    u.visible = l.nodeResults.val != "none";
  }), u;
}
function Ta({ drawingObj: e, gridObj: l, scene: r, getActiveCamera: d, controls: u, gridSize: h, derivedDisplayScale: f, rendererElm: b, viewerRender: y }) {
  const S = new na(), z = new oa(), x = (t) => {
    const o = b.getBoundingClientRect(), s = t.clientX - o.left, n = t.clientY - o.top, a = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const m = a / 2;
      if (s >= m) return z.x = (s - m) / m * 2 - 1, z.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? d();
      z.x = s / m * 2 - 1;
    } else z.x = s / a * 2 - 1;
    return z.y = -(n / i) * 2 + 1, d();
  }, W = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
  W.visible = true, W.frustumCulled = false, r.add(W);
  const ue = (t, o, s) => {
    const n = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, s), n.visible = false, n.frustumCulled = false, r.add(n), n;
  }, me = ue(Math.PI / 2, 0, 0), ie = ue(0, Math.PI / 2, 0);
  let I = false;
  const le = () => {
    if (I) return S.intersectObjects([W], false);
    if (me.visible = !!window.__hekatanGridPlaneXZ, ie.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ze.visible) {
      const s = S.intersectObjects([Ze, rt, Xe], false);
      if (s.length > 0) return s;
    }
    const o = [W];
    return me.visible && o.push(me), ie.visible && o.push(ie), Ot.visible && un.length > 0 && o.push(...un), S.intersectObjects(o, false);
  }, D = new Qn(new ze(), new jn()), re = new Qn(new ze(), new jn({ color: "gray", sizeAttenuation: false, size: 6 })), ae = new Qn(new ze(), new jn({ color: "orange", sizeAttenuation: false, size: 5 }));
  r.add(ae);
  const R = document.createElement("input");
  R.id = "hk-rubber-label", R.type = "text", R.spellcheck = false, R.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, R.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(R);
  let A = null, X = null, E = false;
  const C = new k(), N = (t, o, s, n, a, i) => {
    const c = n - t, m = a - o, w = i - s, g = Math.hypot(c, m, w);
    if (g < 0.01) {
      R.style.display = "none";
      return;
    }
    A = [t, o, s], X = [c / g, m / g, w / g], C.set((t + n) / 2, (o + a) / 2, (s + i) / 2), C.project(d());
    const M = b.getBoundingClientRect(), _ = M.left + (C.x * 0.5 + 0.5) * M.width, p = M.top + (-C.y * 0.5 + 0.5) * M.height;
    if (R.style.left = _ + "px", R.style.top = p + "px", R.style.display = "block", !E) {
      if (R.value = `${g.toFixed(2)} m`, document.activeElement !== R) {
        const L = document.activeElement;
        L && (L.tagName === "INPUT" || L.tagName === "TEXTAREA") && L !== R || R.focus({ preventScroll: true });
      }
      try {
        R.select();
      } catch {
      }
    }
  }, V = () => {
    R.style.display = "none", A = null, X = null, E = false, document.activeElement === R && R.blur();
  }, $ = (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      rn = t, de(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), R.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ue.length === 1) {
      const M = Ue[0];
      Ue = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, M[0], M[1], M[2], t), de(`\u2713 C\xEDrculo r=${t} m en (${M[0].toFixed(2)}, ${M[1].toFixed(2)}, ${M[2].toFixed(2)}).`);
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
      vt = t, de(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), R.blur();
      return;
    }
    if (!A || !X || !e.polylines) return;
    let s = X[0], n = X[1], a = X[2];
    Je === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : Je === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : Je === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const i = A[0] + s * t, c = A[1] + n * t, m = A[2] + a * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, c, m]];
    const w = e.polylines.rawVal, g = w.length ? w[w.length - 1] : [];
    e.polylines.val = [...w.slice(0, -1), [...g, e.points.rawVal.length - 1]], R.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    y();
  }, ee = (t) => {
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
        const [i, c, m] = a;
        return { kind: "relSpherical", L: i, az: c, el: m };
      }
      return null;
    }
    if (o.includes(",")) {
      const a = o.split(",").map((w) => parseFloat(w.trim()));
      if (a.some(isNaN)) return null;
      const [i, c, m = 0] = a;
      return s ? { kind: "relCart", dx: i, dy: c, dz: m } : { kind: "absCart", x: i, y: c, z: m };
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
  }, pe = (t) => {
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
    const o = ee(t);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const s = se(o);
    if (!s) return false;
    es(new k(s[0], s[1], s[2]), null), A = s, R.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, R.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const s = ee(R.value);
      if (!s) return;
      if (E = false, s.kind === "length") $(s.L), de(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = se(s);
        if (!n) return;
        pe(n);
        const a = s.kind;
        de(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), E = false, R.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!E && R.style.display === "block") try {
          R.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && (E = true);
  }), window.addEventListener("keydown", (t) => {
    if (!A || !X || document.activeElement === R) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (R.value = t.key, R.focus(), R.setSelectionRange(1, 1), t.preventDefault());
  });
  const ne = document.createElement("div");
  ne.id = "hk-coord-readout", ne.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ne.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ne);
  const B = document.createElement("div");
  B.id = "hk-coord-fixed", B.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", B.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(B);
  const fe = new zt(new ze().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new Fn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  fe.frustumCulled = false, fe.visible = false, fe.name = "rubberBand", r.add(fe), window.__hekatanRubberBand = fe;
  const J = new zt(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  J.frustumCulled = false, J.visible = false, r.add(J);
  let ye = [];
  const xe = new it(), Ee = new lt(new en(1, 1), new ft({ color: 2282478, transparent: true, opacity: 0.08, side: At, depthWrite: false })), Me = new Wt(new ls(new en(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Le = new Wt(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), Ke = (t, o) => {
    const s = [], n = Math.ceil(t / o);
    for (let a = -n; a <= n; a++) {
      const i = a * o;
      s.push(-t, i, 0, t, i, 0), s.push(i, -t, 0, i, t, 0);
    }
    Le.geometry.dispose(), Le.geometry = new ze(), Le.geometry.setAttribute("position", new Pt(s, 3));
  };
  xe.add(Ee, Me, Le), xe.visible = false, xe.frustumCulled = false, r.add(xe);
  const st = new it();
  st.frustumCulled = false, st.visible = false, r.add(st);
  const mt = (t) => {
    const o = new ze().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), s = new Fn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new zt(o, s);
  }, P = mt(16711680), Y = mt(65280), Q = mt(35071);
  st.add(P, Y, Q);
  const K = [], ge = (t) => t.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), ce = mt(16761856);
  ce.material.dashSize = 0.28, ce.material.gapSize = 0.16, ce.material.opacity = 0.9, ce.frustumCulled = false, ce.visible = false, ce.renderOrder = 98, r.add(ce);
  const ke = (t) => {
    const o = new ze().setFromPoints([new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0), new k(0, 0, 0)]), s = new ht({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new vs(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, he = ke(3462041), De = ke(16724804), Te = ke(6333946), He = new it();
  He.frustumCulled = false, He.visible = false, r.add(He), He.add(he, De, Te);
  const Oe = (t) => {
    const o = new en(1, 1), s = new ft({ color: t, transparent: true, opacity: 0.06, side: At, depthWrite: false }), n = new lt(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ze = Oe(3462041), rt = Oe(16724804), Xe = Oe(6333946);
  He.add(Ze, rt, Xe);
  const we = (t, o, s, n) => {
    t.scale.set(2 * n, 2 * n, 1), s === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : s === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Pe = document.createElement("div");
  Pe.id = "hk-refplane-badge", Pe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Pe), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, He.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], c = window.__hekatanOrthoExt ?? 8;
      Ne(he, i, "xy", c), Ne(De, i, "xz", c), Ne(Te, i, "yz", c), we(Ze, i, "xy", c), we(rt, i, "xz", c), we(Xe, i, "yz", c), Ze.material.opacity = 0.05, rt.material.opacity = 0.05, Xe.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !He.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = s[s.length - 1] ?? [], a = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    Ne(he, i, "xy", t), Ne(De, i, "xz", t), Ne(Te, i, "yz", t), we(Ze, i, "xy", t), we(rt, i, "xz", t), we(Xe, i, "yz", t), y();
  };
  const xt = (t) => {
    if (Ze.material.opacity = t === "xy" ? 0.09 : 0.025, rt.material.opacity = t === "xz" ? 0.09 : 0.025, Xe.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Pe.style.background = a.bg, Pe.style.color = a.text, Pe.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Pe.style.display = "block";
    } else Pe.style.display = "none";
  }, Ne = (t, o, s, n) => {
    let a;
    s === "xy" ? a = [new k(o[0] - n, o[1] - n, o[2]), new k(o[0] + n, o[1] - n, o[2]), new k(o[0] + n, o[1] + n, o[2]), new k(o[0] - n, o[1] + n, o[2]), new k(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new k(o[0] - n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] - n), new k(o[0] + n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] + n), new k(o[0] - n, o[1], o[2] - n)] : a = [new k(o[0], o[1] - n, o[2] - n), new k(o[0], o[1] + n, o[2] - n), new k(o[0], o[1] + n, o[2] + n), new k(o[0], o[1] - n, o[2] + n), new k(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(a);
  };
  let Je = null;
  window.__hekatanAxisLock = () => Je;
  let kt = null, qe = null;
  const Ce = document.createElement("div");
  Ce.id = "hk-axis-lock-badge", Ce.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ce);
  const Ve = () => {
    if (!Je) {
      Ce.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = t[Je], Ce.style.border = `1.5px solid ${t[Je]}`, Ce.textContent = `\u{1F512} LOCK ${Je.toUpperCase()}`, Ce.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== R) return;
    const s = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && ye.length >= 3) {
      const a = pn();
      de(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") Je = Je === s ? null : s, Ve(), t.preventDefault();
    else if (t.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Jo(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Yn(), de(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (st.visible = false), de(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
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
  const Ge = new k(), Fe = new k(), ct = new k(), ut = (t) => {
    if (!Je) return null;
    const o = t[0], s = t[1], n = t[2];
    return Je === "x" ? (Ge.set(o - 1e4, s, n), Fe.set(o + 1e4, s, n)) : Je === "y" ? (Ge.set(o, s - 1e4, n), Fe.set(o, s + 1e4, n)) : (Ge.set(o, s, n - 1e4), Fe.set(o, s, n + 1e4)), S.ray.distanceSqToSegment(Ge, Fe, null, ct), ct;
  };
  window.__hekatanProjectOnAxis = ut;
  const dt = new zt(new ze().setFromPoints([new k(0, 0, 0), new k(0, 0, 0)]), new ht({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  dt.renderOrder = 998, dt.frustumCulled = false, dt.visible = false, r.add(dt);
  let Be = -1, We = -1, wt = -1;
  const Ae = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ae;
  const Mt = new zt(new ze().setFromPoints([new k(), new k()]), new ht({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Mt.renderOrder = 997, Mt.frustumCulled = false, Mt.visible = false, r.add(Mt);
  const _t = new lt(new xn(0.02, 12, 12), new ft({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  _t.renderOrder = 998, _t.visible = false, r.add(_t);
  const Dt = (t) => {
    const o = d();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(t);
    return Math.max(0.05, s / 10);
  }, Et = () => {
    _t.visible && _t.scale.setScalar(Dt(_t.position));
  }, $t = new it();
  $t.frustumCulled = false, r.add($t);
  const nn = 2282478;
  let Ut = null;
  const gn = (t, o, s, n) => {
    if (!e.points) return -1;
    const a = e.points.rawVal;
    let i = -1, c = n;
    for (let m = 0; m < a.length; m++) {
      const w = a[m];
      if (!w) continue;
      const g = Math.hypot(t - w[0], o - w[1], s - w[2]);
      g < c && (c = g, i = m);
    }
    return i;
  }, Vt = () => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    for (; $t.children.length; ) {
      const c = $t.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e = e.points) == null ? void 0 : _e.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const c of Ae) {
      const [m, ...w] = c.split(":");
      if (m === "pt") {
        const g = t[+w[0]];
        if (!g) continue;
        const M = new lt(new xn(0.025, 12, 12), new ft({ color: nn, transparent: true, opacity: 0.9, depthTest: false }));
        M.position.set(g[0], g[1], g[2]), M.renderOrder = 999, M.__isSelectionPt = true, $t.add(M);
      } else if (m === "seg") {
        const g = o[+w[0]], M = t[g == null ? void 0 : g[+w[1]]], _ = t[g == null ? void 0 : g[+w[1] + 1]];
        if (!M || !_) continue;
        const p = new ze().setFromPoints([new k(M[0], M[1], M[2]), new k(_[0], _[1], _[2])]), L = new zt(p, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        L.renderOrder = 999, $t.add(L);
      } else if (m === "poly") {
        const M = o[+w[0]].map((L) => {
          const te = t[L];
          return te ? new k(te[0], te[1], te[2]) : null;
        }).filter(Boolean);
        if (M.length < 2) continue;
        const _ = new ze().setFromPoints(M), p = new zt(_, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        p.renderOrder = 999, $t.add(p);
      } else if (m === "aux") {
        const g = n[+w[0]];
        if (!g || g.length !== 6) continue;
        const M = new ze().setFromPoints([new k(g[0], g[1], g[2]), new k(g[3], g[4], g[5])]), _ = new zt(M, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        _.renderOrder = 999, $t.add(_);
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
  window.__hekatanRefreshSelection = Vt, window.__hekatanClearSelection = () => {
    Ae.clear(), Vt();
  };
  const on = (t, o, s, n, a, i, c, m, w) => {
    const g = c - n, M = m - a, _ = w - i, p = g * g + M * M + _ * _;
    if (p < 1e-12) return Math.hypot(t - n, o - a, s - i);
    let L = ((t - n) * g + (o - a) * M + (s - i) * _) / p;
    L = Math.max(0, Math.min(1, L));
    const te = n + L * g, G = a + L * M, Z = i + L * _;
    return Math.hypot(t - te, o - G, s - Z);
  }, vn = (t, o, s, n) => {
    if (!e.polylines) return null;
    const a = e.polylines.rawVal, i = e.points.rawVal;
    let c = -1, m = -1, w = n;
    for (let g = 0; g < a.length; g++) {
      const M = a[g];
      for (let _ = 0; _ < M.length - 1; _++) {
        const p = i[M[_]], L = i[M[_ + 1]];
        if (!p || !L) continue;
        const te = on(t, o, s, p[0], p[1], p[2], L[0], L[1], L[2]);
        te < w && (w = te, c = g, m = _);
      }
    }
    return c >= 0 ? { polyIdx: c, segIdx: m, dist: w } : null;
  }, Ln = (t, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let c = -1, m = n;
    for (let w = 0; w < i.length; w++) {
      const g = i[w];
      if (!g || g.length !== 6) continue;
      const M = on(t, o, s, g[0], g[1], g[2], g[3], g[4], g[5]);
      M < m && (m = M, c = w);
    }
    return c;
  }, so = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      dt.visible = false;
      return;
    }
    dt.geometry.setFromPoints([new k(n[0], n[1], n[2]), new k(n[3], n[4], n[5])]), dt.visible = true;
  }, ao = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!s || s.length < 2) {
      dt.visible = false;
      return;
    }
    const a = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (a || o < 0 || o >= s.length - 1) for (const c of s) {
      const m = n[c];
      m && i.push(new k(m[0], m[1], m[2]));
    }
    else {
      const c = n[s[o]], m = n[s[o + 1]];
      c && i.push(new k(c[0], c[1], c[2])), m && i.push(new k(m[0], m[1], m[2]));
    }
    dt.geometry.setFromPoints(i), dt.visible = true;
  }, sn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const s = o.filter((w, g) => g !== t), n = /* @__PURE__ */ new Set();
    for (const w of s) for (const g of w) n.add(g);
    const a = e.points.rawVal, i = /* @__PURE__ */ new Map(), c = [];
    for (let w = 0; w < a.length; w++) n.has(w) && (i.set(w, c.length), c.push(a[w]));
    const m = s.map((w) => w.map((g) => i.get(g)).filter((g) => g !== void 0));
    e.points.val = c, e.polylines.val = m, e.areas && (e.areas.val = e.areas.rawVal.filter((w) => w !== t).map((w) => w > t ? w - 1 : w)), dt.visible = false, Be = -1, We = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, In = (t, o) => {
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
    const c = [...s.slice(0, t), ...i, ...s.slice(t + 1)], m = /* @__PURE__ */ new Set();
    for (const p of c) for (const L of p) m.add(L);
    const w = e.points.rawVal, g = /* @__PURE__ */ new Map(), M = [];
    for (let p = 0; p < w.length; p++) m.has(p) && (g.set(p, M.length), M.push(w[p]));
    const _ = c.map((p) => p.map((L) => g.get(L)).filter((L) => L !== void 0));
    if (e.points.val = M, e.polylines.val = _, e.areas) {
      const p = i.length - 1;
      e.areas.val = e.areas.rawVal.map((L) => L > t ? L + p : L);
    }
    dt.visible = false, Be = -1, We = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  D.geometry.setAttribute("position", new Pt(e.points.rawVal.flat(), 3)), D.geometry.computeBoundingSphere(), D.frustumCulled = false, re.frustumCulled = false, r.add(re), W.position.set(0, 0, 0), W.rotateX(Math.PI / 2), W.geometry.rotateX(Math.PI / 2), W.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, s) => {
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
  let Rn = [], Dn = "";
  const bn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], s = `${t.length}|${o.length}|${o.reduce((a, i) => a + i.length, 0)}`;
    if (s === Dn) return Rn;
    Dn = s;
    const n = [];
    for (const a of o) {
      const i = a.length;
      if (i < 6 || a[0] !== a[i - 1]) continue;
      const c = a.slice(0, i - 1).map((M) => t[M]).filter(Boolean);
      if (c.length < 5) continue;
      const m = [0, 1, 2].map((M) => c.reduce((_, p) => _ + p[M], 0) / c.length), w = c.map((M) => Math.hypot(M[0] - m[0], M[1] - m[1], M[2] - m[2])), g = w.reduce((M, _) => M + _, 0) / w.length;
      g < 1e-9 || w.some((M) => Math.abs(M - g) > 5e-3 * g) || n.push({ c: m, r: g });
    }
    return Rn = n;
  };
  window.__hekatanCentrosDeducidos = bn, window.__hekatanDrawCircle = (t, o, s, n, a = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const c = Math.max(4, Math.round(a)), m = e.points.rawVal.length, w = [];
    for (let g = 0; g < c; g++) {
      const M = 2 * Math.PI * g / c, _ = n * Math.cos(M), p = n * Math.sin(M);
      let L;
      i === "xy" ? L = [t + _, o + p, s] : i === "xz" ? L = [t + _, o, s + p] : L = [t, o + _, s + p], w.push(L);
    }
    if (e.points.val = [...e.points.rawVal, ...w], an.push({ c: [t, o, s], r: n }), e.polylines) {
      const g = [...w.map((_, p) => m + p), m], M = e.polylines.rawVal;
      ((_a2 = M[M.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...M, g, []] : e.polylines.val = [...M.slice(0, -1), g, []];
    }
  }, window.__hekatanDrawArc = (t, o, s, n = window.__hekatanArcSegs ?? 12) => {
    const a = Math.max(4, Math.round(n)), i = new k(...t), c = new k(...o), m = new k(...s), w = new k().subVectors(c, i), g = new k().subVectors(m, i), M = new k().crossVectors(w, g).normalize(), _ = new k().addVectors(i, c).multiplyScalar(0.5), p = new k().addVectors(c, m).multiplyScalar(0.5), L = new k().crossVectors(w, M).normalize(), te = new k().crossVectors(new k().subVectors(m, c), M).normalize(), G = new k().subVectors(p, _), Z = L.x * te.y - L.y * te.x;
    let v;
    if (Math.abs(Z) > 1e-9) {
      const be = (G.x * te.y - G.y * te.x) / Z;
      v = new k().addVectors(_, L.clone().multiplyScalar(be));
    } else v = _.clone();
    const F = i.distanceTo(v), T = new k().subVectors(i, v), U = new k().subVectors(m, v), H = Math.acos(Math.max(-1, Math.min(1, T.dot(U) / (F * F)))), q = e.points.rawVal.length, O = [], ve = M.clone();
    for (let be = 0; be <= a; be++) {
      const Se = be / a, je = H * Se, Ie = new Hn().setFromAxisAngle(ve, je), ot = T.clone().applyQuaternion(Ie).add(v);
      O.push([ot.x, ot.y, ot.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...O], an.push({ c: [v.x, v.y, v.z], r: F }), e.polylines) {
      const be = O.map((je, Ie) => q + Ie), Se = e.polylines.rawVal;
      e.polylines.val = [...Se.slice(0, -1), be, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, s = 1, n = 6, a = 6) => {
    const i = Math.min(t[0], o[0]), c = Math.max(t[0], o[0]), m = Math.min(t[1], o[1]), w = Math.max(t[1], o[1]), g = (t[2] + o[2]) / 2, M = c - i, _ = w - m, p = Math.min(s, M / 2 - 0.01, _ / 2 - 0.01);
    if (p <= 0) return;
    const L = e.points.rawVal.length, te = [], G = [], Z = (v, F) => {
      te.push([v, F, g]), G.push(L + te.length - 1);
    };
    for (let v = 0; v <= a; v++) Z(i + p + (M - 2 * p) * v / a, m);
    for (let v = 1; v <= n; v++) {
      const F = -Math.PI / 2 + Math.PI / 2 * v / n;
      Z(c - p + p * Math.cos(F), m + p + p * Math.sin(F));
    }
    for (let v = 1; v <= a; v++) Z(c, m + p + (_ - 2 * p) * v / a);
    for (let v = 1; v <= n; v++) {
      const F = 0 + Math.PI / 2 * v / n;
      Z(c - p + p * Math.cos(F), w - p + p * Math.sin(F));
    }
    for (let v = 1; v <= a; v++) Z(c - p - (M - 2 * p) * v / a, w);
    for (let v = 1; v <= n; v++) {
      const F = Math.PI / 2 + Math.PI / 2 * v / n;
      Z(i + p + p * Math.cos(F), w - p + p * Math.sin(F));
    }
    for (let v = 1; v <= a; v++) Z(i, w - p - (_ - 2 * p) * v / a);
    for (let v = 1; v <= n; v++) {
      const F = Math.PI + Math.PI / 2 * v / n;
      Z(i + p + p * Math.cos(F), m + p + p * Math.sin(F));
    }
    if (G.push(L), e.points.val = [...e.points.rawVal, ...te], e.polylines) {
      const v = e.polylines.rawVal;
      e.polylines.val = [...v.slice(0, -1), G, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], c = o[0], m = o[1], w = o[2];
    let g;
    if (Math.abs(i - w) < 1e-6 ? g = [[n, a, i], [c, a, i], [c, m, i], [n, m, i]] : Math.abs(a - m) < 1e-6 ? g = [[n, a, i], [c, a, i], [c, a, w], [n, a, w]] : g = [[n, a, i], [n, m, i], [n, m, w], [n, a, w]], e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const M = [s, s + 1, s + 2, s + 3, s], _ = e.polylines.rawVal;
      e.polylines.val = [..._.slice(0, -1), M, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const s = e.points.rawVal.length, n = t[0], a = t[1], i = t[2], c = o[0], m = o[1], w = o[2];
    let g;
    if (I && e.gridTarget) {
      const M = e.gridTarget.rawVal, _ = new An(...M.rotation), p = new k(1, 0, 0).applyEuler(_), L = new k(0, 1, 0).applyEuler(_), te = new k(...M.position), G = new k(n, a, i), Z = new k(c, m, w), v = G.clone().sub(te).dot(p), F = G.clone().sub(te).dot(L), T = Z.clone().sub(te).dot(p), U = Z.clone().sub(te).dot(L), H = (q, O) => te.clone().addScaledVector(p, q).addScaledVector(L, O).toArray();
      g = [H(v, F), H(T, F), H(T, U), H(v, U)];
    } else Math.abs(i - w) < 1e-6 ? g = [[n, a, i], [c, a, i], [c, m, i], [n, m, i]] : Math.abs(a - m) < 1e-6 ? g = [[n, a, i], [c, a, i], [c, a, w], [n, a, w]] : g = [[n, a, i], [n, m, i], [n, m, w], [n, a, w]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const M = e.polylines.rawVal, _ = M.length - 1, p = [s, s + 1, s + 2, s + 3, s];
      e.polylines.val = [...M.slice(0, -1), p, []], e.areas && (e.areas.val = [...e.areas.rawVal, _]);
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
    for (let _e = 0; _e < s; _e++) {
      const Re = t[_e], et = t[(_e + 1) % s];
      n += (Re[1] - et[1]) * (Re[2] + et[2]), a += (Re[2] - et[2]) * (Re[0] + et[0]), i += (Re[0] - et[0]) * (Re[1] + et[1]);
    }
    const c = Math.hypot(n, a, i) || 1;
    n /= c, a /= c, i /= c;
    let m = t[1][0] - t[0][0], w = t[1][1] - t[0][1], g = t[1][2] - t[0][2];
    const M = Math.hypot(m, w, g) || 1;
    m /= M, w /= M, g /= M;
    let _ = a * g - i * w, p = i * m - n * g, L = n * w - a * m;
    const te = Math.hypot(_, p, L) || 1;
    _ /= te, p /= te, L /= te;
    const G = t[0], Z = (_e) => [(_e[0] - G[0]) * m + (_e[1] - G[1]) * w + (_e[2] - G[2]) * g, (_e[0] - G[0]) * _ + (_e[1] - G[1]) * p + (_e[2] - G[2]) * L], v = (_e, Re) => [G[0] + _e * m + Re * _, G[1] + _e * w + Re * p, G[2] + _e * g + Re * L], F = t.map(Z);
    let T = 1 / 0, U = -1 / 0, H = 1 / 0, q = -1 / 0;
    for (const [_e, Re] of F) _e < T && (T = _e), _e > U && (U = _e), Re < H && (H = Re), Re > q && (q = Re);
    const O = U - T, ve = q - H;
    if (O < 1e-6 || ve < 1e-6) return 0;
    let be = o && o > 0 ? o : 0.5;
    for (; O / be * (ve / be) > 2500; ) be *= 2;
    be = Math.min(be, Math.min(O, ve));
    const Se = (_e, Re) => {
      let et = false;
      for (let It = 0, Nt = F.length - 1; It < F.length; Nt = It++) {
        const [Rt, Qt] = F[It], [bo, qn] = F[Nt];
        Qt > Re != qn > Re && _e < (bo - Rt) * (Re - Qt) / (qn - Qt) + Rt && (et = !et);
      }
      return et;
    }, je = Math.max(1, Math.round(O / be)), Ie = Math.max(1, Math.round(ve / be)), ot = O / je, tt = ve / Ie, at = /* @__PURE__ */ new Map(), Qe = [], $e = e.points.rawVal.length, nt = (_e, Re) => {
      const et = _e + "," + Re, It = at.get(et);
      if (It !== void 0) return It;
      const Nt = $e + Qe.length;
      return Qe.push(v(T + _e * ot, H + Re * tt)), at.set(et, Nt), Nt;
    }, Ye = [];
    for (let _e = 0; _e < je; _e++) for (let Re = 0; Re < Ie; Re++) {
      if (!Se(T + (_e + 0.5) * ot, H + (Re + 0.5) * tt)) continue;
      const et = nt(_e, Re), It = nt(_e + 1, Re), Nt = nt(_e + 1, Re + 1), Rt = nt(_e, Re + 1);
      Ye.push([et, It, Nt, Rt]);
    }
    if (!Ye.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...Qe], e.polylines && e.areas) {
      let _e = e.polylines.rawVal.slice();
      _e.length && _e[_e.length - 1].length === 0 && (_e = _e.slice(0, -1));
      const Re = [];
      for (const et of Ye) Re.push(_e.length), _e.push([et[0], et[1], et[2], et[3], et[0]]);
      _e.push([]), e.polylines.val = _e, e.areas.val = [...e.areas.rawVal, ...Re];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), Ye.length;
  };
  const pn = () => {
    if (ye.length < 3) return ye = [], J.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(ye.slice());
    return ye = [], J.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, s) => {
    var _a2;
    const n = new k(t[0], t[1], t[2]), a = new k(o[0], o[1], o[2]), i = new k(s[0], s[1], s[2]), c = new k().subVectors(a, n).cross(new k().subVectors(i, n));
    if (c.lengthSq() < 1e-9) return false;
    c.normalize();
    const m = new Hn().setFromUnitVectors(new k(0, 0, 1), c), w = new An().setFromQuaternion(m);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [w.x, w.y, w.z] }), I = true;
    const g = new k().addVectors(n, a).add(i).multiplyScalar(1 / 3), M = Math.max(n.distanceTo(a), n.distanceTo(i), a.distanceTo(i)) * 2.2 + 4, _ = M / 2;
    Ee.geometry.dispose(), Ee.geometry = new en(M, M), Me.geometry.dispose(), Me.geometry = new ls(new en(M, M)), Ke(_, 1), xe.position.copy(g), xe.quaternion.copy(m), xe.scale.set(1, 1, 1), xe.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), I = false, xe.visible = false, y();
  };
  const Kt = new it();
  Kt.visible = false, r.add(Kt), window.__hekatanShowAxes = (t, o, s = 12, n = 2) => {
    var _a2, _b;
    for (; Kt.children.length; ) {
      const M = Kt.children.pop();
      (_a2 = M.geometry) == null ? void 0 : _a2.dispose(), (_b = M.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const a = Math.min(...o) - n, i = Math.max(...o) + n, c = Math.min(...t) - n, m = Math.max(...t) + n, w = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", g = (M, _, p, L, te) => {
      const G = document.createElement("canvas");
      G.width = 64, G.height = 32;
      const Z = G.getContext("2d");
      Z.fillStyle = te, Z.font = "bold 22px sans-serif", Z.textAlign = "center", Z.fillText(M, 32, 26);
      const v = new rs(G), F = new cs({ map: v, transparent: true }), T = new ds(F);
      return T.position.set(_, p, L), T.scale.set(1.2, 0.6, 1), T;
    };
    t.forEach((M, _) => {
      const p = _ < w.length ? w[_] : `X${_}`, L = new ze().setFromPoints([new k(M, a, 0), new k(M, i, 0), new k(M, a, 0), new k(M, a, s)]), te = new Fn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), G = new Wt(L, te);
      G.computeLineDistances(), Kt.add(G), Kt.add(g(p, M, a - 0.5, 0, "#60a5fa")), Kt.add(g(p, M, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((M, _) => {
      const p = `${_ + 1}`, L = new ze().setFromPoints([new k(c, M, 0), new k(m, M, 0), new k(c, M, 0), new k(c, M, s)]), te = new Fn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), G = new Wt(L, te);
      G.computeLineDistances(), Kt.add(G), Kt.add(g(p, c - 0.5, M, 0, "#fb7185")), Kt.add(g(p, m + 0.5, M, 0, "#fb7185"));
    }), Kt.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    Kt.visible = false, y();
  };
  const Ot = new it();
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
      const m = a[c % a.length], w = o / 2, g = [new k(s - w, n - w, i), new k(s + w, n - w, i), new k(s + w, n + w, i), new k(s - w, n + w, i), new k(s - w, n - w, i)], M = new ze().setFromPoints(g), _ = new ht({ color: m, transparent: true, opacity: 0.55 });
      Ot.add(new zt(M, _));
      const p = document.createElement("canvas");
      p.width = 128, p.height = 32;
      const L = p.getContext("2d");
      L.fillStyle = `#${m.toString(16).padStart(6, "0")}`, L.font = "bold 18px sans-serif", L.fillText(`Z = ${i} m`, 4, 22);
      const te = new rs(p), G = new cs({ map: te, transparent: true }), Z = new ds(G);
      Z.position.set(s - w - 1.5, n - w - 1.5, i), Z.scale.set(2.5, 0.6, 1), Ot.add(Z);
      const v = new en(1e4, 1e4), F = new ft({ visible: false, side: At }), T = new lt(v, F);
      T.position.set(0, 0, i), T.frustumCulled = false, T.userData = { refPlaneZ: i }, r.add(T), un.push(T);
    }), Ot.visible = true, y();
  }, window.__hekatanHideRefPlanes = () => {
    Ot.visible = false, un.forEach((t) => {
      t.visible = false;
    }), y();
  };
  const Mn = new it();
  Mn.frustumCulled = false, r.add(Mn);
  const As = () => {
    var _a2, _b, _c, _d;
    for (; Mn.children.length; ) {
      const s = Mn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new ze().setFromPoints([new k(s[0], s[1], s[2]), new k(s[3], s[4], s[5])]), a = new Fn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new zt(n, a);
      i.computeLineDistances(), Mn.add(i);
    }
  };
  j.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, As(), y());
  });
  const fn = new it();
  fn.frustumCulled = false, r.add(fn);
  const Ro = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const s = fn.children.pop();
      (_b = (_a2 = s.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new lt(new xn(0.025, 12, 12), new ft({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(Dt(n.position)), fn.add(n);
    }
  };
  j.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Ro(), y());
  }), u.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(Dt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Ro;
  const gt = new it(), Es = new lt(new xn(0.01, 12, 12), new ft({ color: 16724804, transparent: true, opacity: 0.95 })), Vs = new lt(new xn(0.015, 12, 12), new ft({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  gt.add(Es, Vs);
  const hn = 0.08, io = (t, o, s) => {
    const n = new ze().setFromPoints([new k(...t), new k(...o)]);
    return new zt(n, new ht({ color: s, transparent: true, opacity: 0.7 }));
  };
  gt.add(io([-hn, 0, 0], [hn, 0, 0], 16711680)), gt.add(io([0, -hn, 0], [0, hn, 0], 65280)), gt.add(io([0, 0, -hn], [0, 0, hn], 35071)), gt.visible = false, gt.frustumCulled = false, r.add(gt);
  let lo = 2;
  const Bn = (t) => {
    const o = d(), s = (b == null ? void 0 : b.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, _n = () => {
    if (!gt.visible) return;
    const t = lo * Bn(gt.position) / 0.015;
    gt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let kn = 10;
  const ro = (t) => Math.max(1e-4, kn * Bn(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (kn = t), kn), window.__hekatanUpdateSnapScale = _n, window.__hekatanSnapMarker = gt, window.__hekatanMetrosPorPixel = Bn, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (lo = t, _n(), y()), lo);
  const Do = () => {
    $t.children.length !== 0 && $t.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(Dt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Do, u.addEventListener("change", () => {
    var _a2;
    _n(), _t.visible && Et(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Do();
  }), window.__hekatanShowSnap = (t, o, s) => {
    gt.position.set(t, o, s), gt.visible = true, _n(), y();
  }, window.__hekatanHideSnap = () => {
    gt.visible = false, y();
  }, b.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = x(t);
    if (!o) return;
    S.setFromCamera(z, o);
    const s = le();
    if (s.length) {
      const n = s[0].point, a = t.altKey, i = ro(n), c = a ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: t.clientX, y: t.clientY });
      if (c) Zo(c.type, c.x, c.y, c.z), gt.position.set(c.x, c.y, c.z), gt.visible = true, n.set(c.x, c.y, c.z), Uo(c.type, t.clientX, t.clientY);
      else {
        Is(), Yn();
        const _ = !a && window.__hekatanSnapEnabled !== false, p = window.__hekatanSnap2D ?? 0.5;
        _ && p > 0 && (n.x = Math.round(n.x / p) * p, n.y = Math.round(n.y / p) * p, n.z = Math.round(n.z / p) * p), gt.position.copy(n), gt.visible = true;
      }
      _n();
      const m = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (m === "select" || !m) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, p = gn(n.x, n.y, n.z, _), L = vn(n.x, n.y, n.z, _), te = Ln(n.x, n.y, n.z, _);
        if (p >= 0) {
          const F = e.points.rawVal[p];
          _t.position.set(F[0], F[1], F[2]), _t.visible = true, Et(), Mt.visible = false, Ut = { kind: "pt", a: p };
        } else if (L) {
          const F = e.points.rawVal, T = e.polylines.rawVal[L.polyIdx], U = F[T[L.segIdx]], H = F[T[L.segIdx + 1]];
          Mt.geometry.setFromPoints([new k(U[0], U[1], U[2]), new k(H[0], H[1], H[2])]), Mt.visible = true, _t.visible = false, Ut = ((_f = (_e = e.areas) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.includes(L.polyIdx)) ?? false ? { kind: "poly", a: L.polyIdx } : { kind: "seg", a: L.polyIdx, b: L.segIdx };
        } else if (te >= 0) {
          const T = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[te];
          T && (Mt.geometry.setFromPoints([new k(T[0], T[1], T[2]), new k(T[3], T[4], T[5])]), Mt.visible = true, _t.visible = false, Ut = { kind: "aux", a: te });
        } else Mt.visible = false, _t.visible = false, Ut = null;
        ne.style.left = t.clientX + "px", ne.style.top = t.clientY + "px", ne.style.display = "block";
        let G = n;
        if ((Ut == null ? void 0 : Ut.kind) === "pt") {
          const F = e.points.rawVal[Ut.a];
          F && (G = new k(F[0], F[1], F[2]));
        }
        const Z = `X=${G.x.toFixed(2)} Y=${G.y.toFixed(2)} Z=${G.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [G.x, G.y, G.z], Ut) {
          const F = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ne.textContent = `${Z}  \xB7  \u{1F5B1} Click \u2192 ${F[Ut.kind]}`;
        } else ne.textContent = Z;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = Z), qe = { p: G.clone(), x: t.clientX, y: t.clientY }, fe.visible = false, st.visible = false, ce.visible = false, y();
        return;
      }
      if (m === "delete" || m === "trim" || m === "extend" || m === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, p = vn(n.x, n.y, n.z, _), L = Ln(n.x, n.y, n.z, _);
        let te = false;
        if (L >= 0) if (!p) te = true;
        else {
          const F = window.__hekatanDrawingAuxLines, U = ((F == null ? void 0 : F.rawVal) ?? (F == null ? void 0 : F.val) ?? F ?? [])[L];
          on(n.x, n.y, n.z, U[0], U[1], U[2], U[3], U[4], U[5]) < p.dist && (te = true);
        }
        te ? (wt = L, Be = -1, We = -1, so(L)) : p ? (Be = p.polyIdx, We = p.segIdx, wt = -1, ao(p.polyIdx, p.segIdx)) : (Be = -1, We = -1, wt = -1, dt.visible = false), fe.visible = false, st.visible = false, ce.visible = false, V(), ne.style.left = t.clientX + "px", ne.style.top = t.clientY + "px", ne.style.display = "block";
        const G = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let Z = "";
        te ? Z = `\u{1F5D1} l\xEDnea aux #${wt + 1}` : p ? Z = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(p.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${p.polyIdx + 1}` : `\u{1F5D1} seg ${p.segIdx + 1} / poly #${p.polyIdx + 1}` : Z = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ne.textContent = `${G}  \xB7  ${Z}`;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = G), y();
        return;
      } else dt.visible = false, Be = -1, wt = -1;
      ne.style.left = t.clientX + "px", ne.style.top = t.clientY + "px", ne.style.display = "block";
      const w = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], g = w[w.length - 1] ?? [], M = e.points.rawVal ?? [];
      if (g.length > 0 && M[g[g.length - 1]]) {
        const _ = g[g.length - 1], p = M[_];
        let L = Je;
        if (kt = null, !L && window.__hekatanAxisSnap !== false) {
          const Ie = b.getBoundingClientRect(), ot = t.clientX, tt = t.clientY, at = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, Qe = new k(p[0], p[1], p[2]), $e = [["x", new k(1, 0, 0)], ["y", new k(0, 1, 0)], ["z", new k(0, 0, 1)]], nt = (_e2) => {
            const Re = _e2.clone().project(o);
            return { x: (Re.x * 0.5 + 0.5) * Ie.width + Ie.left, y: (-Re.y * 0.5 + 0.5) * Ie.height + Ie.top };
          };
          let Ye = null;
          for (const [_e2, Re] of $e) {
            const et = nt(Qe.clone().addScaledVector(Re, -at)), It = nt(Qe.clone().addScaledVector(Re, at)), Nt = It.x - et.x, Rt = It.y - et.y, Qt = ot - et.x, bo = tt - et.y, qn = Nt * Nt + Rt * Rt || 1;
            let Kn = (Qt * Nt + bo * Rt) / qn;
            Kn = Math.max(0, Math.min(1, Kn));
            const ts = Math.hypot(ot - (et.x + Kn * Nt), tt - (et.y + Kn * Rt));
            if (Ye === null || ts < Ye.dpx) {
              const Mo = S.ray, ns = Qe.clone().sub(Mo.origin), _o2 = Re.dot(Mo.direction), os = Re.dot(ns), qs = Mo.direction.dot(ns), ss = 1 - _o2 * _o2, Ks = Math.abs(ss) < 1e-6 ? -os : (_o2 * qs - os) / ss;
              Ye = { axis: _e2, dpx: ts, pt: Qe.clone().addScaledVector(Re, Ks) };
            }
          }
          Ye && Ye.dpx <= 12 && (n.copy(Ye.pt), L = Ye.axis, kt = Ye.pt.clone());
        }
        const te = !!window.__hekatanOrthoMode;
        if (!L && te) {
          const Ie = Math.abs(n.x - p[0]), ot = Math.abs(n.y - p[1]), tt = Math.abs(n.z - p[2]), at = (_l = s[0]) == null ? void 0 : _l.object;
          let Qe = null;
          at === Ze ? Qe = "xy" : at === rt ? Qe = "xz" : at === Xe && (Qe = "yz"), Qe === "xy" ? L = Ie >= ot ? "x" : "y" : Qe === "xz" ? L = Ie >= tt ? "x" : "z" : Qe === "yz" ? L = ot >= tt ? "y" : "z" : L = Ie >= ot && Ie >= tt ? "x" : ot >= tt ? "y" : "z";
        }
        const G = window.__hekatanPolarTrack !== false;
        if (!L && G) {
          const Ie = n.x - p[0], ot = n.y - p[1], tt = n.z - p[2], at = Math.hypot(Ie, ot, tt);
          if (at > 1e-3) {
            const $e = Math.tan(6 * Math.PI / 180) * at, nt = Math.hypot(ot, tt), Ye = Math.hypot(Ie, tt), _e2 = Math.hypot(Ie, ot), Re = [["x", nt], ["y", Ye], ["z", _e2]];
            Re.sort((et, It) => et[1] - It[1]), Re[0][1] <= $e && (L = Re[0][0]);
          }
        }
        if (L) {
          const Ie = p[0], ot = p[1], tt = p[2];
          L === "x" ? n.set(n.x, ot, tt) : L === "y" ? n.set(Ie, n.y, tt) : n.set(Ie, ot, n.z);
          const at = !!Je, $e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[L];
          Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = $e, Ce.style.border = `1.5px solid ${$e}`;
          const nt = (_m = s[0]) == null ? void 0 : _m.object;
          let Ye = null;
          nt === Ze ? Ye = "xy" : nt === rt ? Ye = "xz" : nt === Xe && (Ye = "yz");
          const _e2 = Ye ? ` (plano ${Ye.toUpperCase()})` : "";
          Ce.textContent = at ? `\u{1F512} LOCK ${L.toUpperCase()}${_e2}` : `\u22A5 ORTO ${L.toUpperCase()}${_e2}`, Ce.style.left = t.clientX + 20 + "px", Ce.style.top = t.clientY + 18 + "px", Ce.style.transform = "none", Ce.style.display = "block";
        } else Je || (Ce.style.display = "none");
        let Z = null;
        if (!a && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ie = e.points.rawVal, ot = L ? [L] : ["z", "x", "y"], tt = { x: t.clientX, y: t.clientY };
          let at = 1 / 0;
          for (const Qe of Ie) if (!(Math.abs(Qe[0] - p[0]) < 1e-9 && Math.abs(Qe[1] - p[1]) < 1e-9 && Math.abs(Qe[2] - p[2]) < 1e-9)) for (const $e of ot) {
            const nt = new k($e === "x" ? Qe[0] : n.x, $e === "y" ? Qe[1] : n.y, $e === "z" ? Qe[2] : n.z), Ye = ho(nt.x, nt.y, nt.z);
            if (!Ye) continue;
            const _e2 = Math.hypot(Ye.x - tt.x, Ye.y - tt.y);
            _e2 < kn && _e2 < at && (at = _e2, Z = { q: Qe, eje: $e });
          }
        }
        Z ? (Z.eje === "x" ? n.x = Z.q[0] : Z.eje === "y" ? n.y = Z.q[1] : n.z = Z.q[2], ce.geometry.setFromPoints([new k(Z.q[0], Z.q[1], Z.q[2]), new k(n.x, n.y, n.z)]), (_n2 = ce.computeLineDistances) == null ? void 0 : _n2.call(ce), ce.visible = true, gt.position.set(n.x, n.y, n.z), gt.visible = true, Uo("track", t.clientX, t.clientY)) : ce.visible = false, qe = { p: n.clone(), x: t.clientX, y: t.clientY };
        const v = Math.hypot(n.x - p[0], n.y - p[1], n.z - p[2]), F = Math.atan2(n.y - p[1], n.x - p[0]) * 180 / Math.PI, T = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ne.textContent = `${T} | \u0394L=${v.toFixed(2)}m ${F.toFixed(0)}\xB0`;
        const U = document.getElementById("hk-coord-fixed");
        U && (U.textContent = T), fe.geometry.setFromPoints([new k(p[0], p[1], p[2]), new k(n.x, n.y, n.z)]), (_o = fe.computeLineDistances) == null ? void 0 : _o.call(fe), fe.visible = true, N(p[0], p[1], p[2], n.x, n.y, n.z);
        const H = window.__hekatanOrthoExt ?? 8, q = window.__hekatanShowOrthoPlanes !== false;
        He.visible = q, q || xt(null), q && (Ne(he, p, "xy", H), Ne(De, p, "xz", H), Ne(Te, p, "yz", H), we(Ze, p, "xy", H), we(rt, p, "xz", H), we(Xe, p, "yz", H));
        const O = q ? S.intersectObjects([Ze, rt, Xe], false) : [];
        let ve = null;
        if (O.length > 0) {
          const Ie = O[0].object;
          Ie === Ze ? ve = "xy" : Ie === rt ? ve = "xz" : Ie === Xe && (ve = "yz");
        }
        xt(ve), ve && (Pe.style.left = t.clientX + "px", Pe.style.top = t.clientY + "px"), P.geometry.setFromPoints([new k(p[0] - H, p[1], p[2]), new k(p[0] + H, p[1], p[2])]), (_p = P.computeLineDistances) == null ? void 0 : _p.call(P), Y.geometry.setFromPoints([new k(p[0], p[1] - H, p[2]), new k(p[0], p[1] + H, p[2])]), (_q = Y.computeLineDistances) == null ? void 0 : _q.call(Y), Q.geometry.setFromPoints([new k(p[0], p[1], p[2] - H), new k(p[0], p[1], p[2] + H)]), (_r = Q.computeLineDistances) == null ? void 0 : _r.call(Q), st.visible = true;
        const be = P.material, Se = Y.material, je = Q.material;
        L === "x" ? (be.opacity = 0.95, Se.opacity = 0.1, je.opacity = 0.1) : L === "y" ? (be.opacity = 0.1, Se.opacity = 0.95, je.opacity = 0.1) : L === "z" ? (be.opacity = 0.1, Se.opacity = 0.1, je.opacity = 0.95) : (be.opacity = 0.5, Se.opacity = 0.5, je.opacity = 0.5);
      } else {
        const _ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ne.textContent = _;
        const p = document.getElementById("hk-coord-fixed");
        if (p && (p.textContent = _), fe.visible = false, st.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(m)) {
          if (A = null, X = null, R.style.left = t.clientX + 20 + "px", R.style.top = t.clientY - 28 + "px", R.style.display = "block", !E) {
            R.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const te = document.activeElement;
            !(te && (te.tagName === "INPUT" || te.tagName === "TEXTAREA") && te !== R) && document.activeElement !== R && R.focus({ preventScroll: true });
            try {
              R.select();
            } catch {
            }
          }
        } else V();
      }
      y();
    } else Yn(), ne.style.display = "none", gt.visible = false, fe.visible = false, st.visible = false, V(), y();
  }), j.derive(() => {
    var _a2;
    if (!e.gridTarget) return;
    const t = new Hn().setFromEuler(new An(...e.gridTarget.val.rotation)), o = new Hn().setFromAxisAngle(new k(1, 0, 0), Math.PI / 2);
    $a(l, { position: new k(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y);
    {
      const n = e.gridTarget.val.position[2], a = Math.abs(t.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of K) r.remove(i), ge(i);
      if (K.length = 0, a) {
        const i = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], c = /* @__PURE__ */ new Set([0]);
        for (const w of i) c.add(+w[2].toFixed(3));
        for (const w of window.__hekatanLevels ?? []) isFinite(w == null ? void 0 : w.z) && c.add(+w.z.toFixed(3));
        const m = [...c].sort((w, g) => w - g).slice(0, 24);
        for (const w of m) {
          if (Math.abs(w - n) < 1e-6) continue;
          const g = l.clone(true);
          g.name = `hekatan-grid-nivel-${w}`, g.traverse((M) => {
            M.material && (M.material = M.material.clone(), M.material.transparent = true, M.material.opacity = (M.material.opacity ?? 1) * (Math.abs(w) < 1e-6 ? 0.5 : 0.22));
          }), g.position.set(0, 0, w), g.quaternion.copy(o), r.add(g), K.push(g);
        }
      }
    }
    W.position.set(...e.gridTarget.val.position), W.quaternion.setFromEuler(new An(...e.gridTarget.val.rotation)), W.updateMatrixWorld();
    const s = new k(0, 0, 1).applyEuler(new An(...e.gridTarget.val.rotation));
    I = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), j.derive(() => {
    D.geometry.setAttribute("position", new Pt(e.points.val.flat(), 3)), D.geometry.computeBoundingSphere();
  }), j.derive(() => {
    const t = 0.05 * h * 0.5 * f.val;
    S.params.Points.threshold = 0.4 * t;
  }), j.derive(() => {
    var _a2;
    const t = e.points.val ?? [], s = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of s) {
      const [c, m, w] = t[i];
      n.push(c, m, w);
    }
    const a = new ze();
    a.setAttribute("position", new Pt(n, 3)), ae.geometry.dispose(), ae.geometry = a;
  });
  let co = false, ln = 0;
  b.addEventListener("pointerdown", () => {
    co = true;
  }), b.addEventListener("pointerup", () => {
    co = false;
  }), b.addEventListener("pointermove", () => {
    co && ln++;
  });
  const Lt = document.createElement("div");
  Lt.id = "hk-window-select", Lt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Lt);
  let Gt = null, Sn = false, Yt = null;
  const po = (t, o, s, n, a) => {
    a ? (Lt.style.borderColor = "#34d399", Lt.style.borderStyle = "dashed", Lt.style.background = "rgba(52, 211, 153, 0.10)") : (Lt.style.borderColor = "#22d3ee", Lt.style.borderStyle = "solid", Lt.style.background = "rgba(34, 211, 238, 0.10)"), Lt.style.left = Math.min(t, s) + "px", Lt.style.top = Math.min(o, n) + "px", Lt.style.width = Math.abs(s - t) + "px", Lt.style.height = Math.abs(n - o) + "px", Lt.style.display = "block";
  }, Bo = (t, o, s, n, a) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, s), c = Math.max(t, s), m = Math.min(o, n), w = Math.max(o, n), g = s < t, M = b.getBoundingClientRect(), _ = d();
    _.updateMatrixWorld();
    const p = (q) => {
      const O = new k(q[0], q[1], q[2]);
      return O.project(_), { x: M.left + (O.x * 0.5 + 0.5) * M.width, y: M.top + (-O.y * 0.5 + 0.5) * M.height };
    }, L = (q) => q.x >= i && q.x <= c && q.y >= m && q.y <= w, te = (q, O) => !(q.x < i && O.x < i || q.x > c && O.x > c || q.y < m && O.y < m || q.y > w && O.y > w);
    a || Ae.clear();
    let G = 0;
    const Z = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let q = 0; q < Z.length; q++) {
      const O = Z[q];
      O && L(p(O)) && (Ae.add(`pt:${q}`), G++);
    }
    const v = (q, O) => g ? L(q) || L(O) || te(q, O) : L(q) && L(O), F = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], T = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let q = 0; q < F.length; q++) {
      const O = F[q];
      if (T.includes(q)) {
        let be;
        if (!g) be = O.every((Se) => {
          const je = Z[Se];
          return !!je && L(p(je));
        });
        else {
          be = false;
          for (let Se = 0; Se < O.length - 1; Se++) {
            const je = Z[O[Se]], Ie = Z[O[Se + 1]];
            if (!(!je || !Ie) && v(p(je), p(Ie))) {
              be = true;
              break;
            }
          }
        }
        be && (Ae.add(`poly:${q}`), G++);
      } else for (let be = 0; be < O.length - 1; be++) {
        const Se = Z[O[be]], je = Z[O[be + 1]];
        !Se || !je || v(p(Se), p(je)) && (Ae.add(`seg:${q}:${be}`), G++);
      }
    }
    const H = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let q = 0; q < H.length; q++) {
      const O = H[q];
      if (!O || O.length !== 6) continue;
      const ve = p([O[0], O[1], O[2]]), be = p([O[3], O[4], O[5]]);
      v(ve, be) && (Ae.add(`aux:${q}`), G++);
    }
    Vt(), de(G === 0 && !g ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${g ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${G} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ae.size})`), Lt.style.display = "none";
  }, Xn = () => {
    Yt && (Yt = null, Lt.style.display = "none", de("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Xn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Yt && Xn();
  });
  const Xo = () => {
    var _a2, _b, _c, _d;
    if (Ae.size === 0) return false;
    const t = [...Ae], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, i = (a == null ? void 0 : a.rawVal) ?? [], c = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const te of t) {
      const [G, ...Z] = te.split(":");
      if (G === "pt") c.add(+Z[0]);
      else if (G === "poly") m.add(+Z[0]);
      else if (G === "seg") {
        const v = +Z[0], F = +Z[1];
        w.has(v) || w.set(v, /* @__PURE__ */ new Set()), w.get(v).add(F);
      } else G === "aux" && g.add(+Z[0]);
    }
    let M = 0, _ = [], p = [];
    const L = /* @__PURE__ */ new Map();
    for (let te = 0; te < s.length; te++) {
      if (m.has(te)) {
        M++;
        continue;
      }
      L.set(te, _.length);
      const G = w.get(te);
      if (G && G.size > 0) {
        let Z = [];
        for (let v = 0; v < s[te].length; v++) Z.push(s[te][v]), v < s[te].length - 1 && G.has(v) && (Z.length >= 2 && _.push(Z), Z = [], M++);
        (Z.length >= 2 || Z.length === 1) && _.push(Z);
      } else _.push([...s[te]]);
    }
    if (c.size > 0) {
      const te = [], G = /* @__PURE__ */ new Map();
      for (let v = 0; v < o.length; v++) {
        if (c.has(v)) {
          M++;
          continue;
        }
        G.set(v, te.length), te.push([...o[v]]);
      }
      const Z = [];
      for (const v of _) {
        let F = [];
        for (const T of v) {
          const U = G.get(T);
          U === void 0 ? (F.length >= 2 && Z.push(F), F = []) : F.push(U);
        }
        F.length >= 2 && Z.push(F);
      }
      _ = Z, e.points.val = te;
    }
    for (const te of n) {
      const G = L.get(te);
      G !== void 0 && G < _.length && p.push(G);
    }
    if (e.polylines && (e.polylines.val = _), e.areas && (e.areas.val = p), g.size > 0 && a) {
      const te = i.filter((G, Z) => !g.has(Z));
      "val" in a ? a.val = te : window.__hekatanDrawingAuxLines = te, M += g.size;
    }
    Ae.clear(), Vt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return de(`\u{1F5D1} ${M} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Xo, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || Ae.size !== 0 && (t.preventDefault(), Xo());
  });
  const Bt = document.createElement("div");
  Bt.id = "hk-properties-pane";
  const No = "hk-props-pane-pos";
  let Pn = null;
  try {
    const t = localStorage.getItem(No);
    t && (Pn = JSON.parse(t));
  } catch {
  }
  Bt.style.cssText = ["position:fixed", Pn ? `left:${Pn.left}px` : "left:14px", Pn ? `top:${Pn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Bt);
  const Ts = () => {
    const t = Bt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, i = 0;
    t.addEventListener("mousedown", (c) => {
      o = true, s = c.clientX, n = c.clientY;
      const m = Bt.getBoundingClientRect();
      a = m.left, i = m.top, Bt.style.transform = "none", Bt.style.left = `${a}px`, Bt.style.top = `${i}px`, c.preventDefault();
    }), window.addEventListener("mousemove", (c) => {
      if (!o) return;
      const m = c.clientX - s, w = c.clientY - n, g = Math.max(0, Math.min(window.innerWidth - 80, a + m)), M = Math.max(0, Math.min(window.innerHeight - 40, i + w));
      Bt.style.left = `${g}px`, Bt.style.top = `${M}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(No, JSON.stringify({ left: parseFloat(Bt.style.left), top: parseFloat(Bt.style.top) }));
        } catch {
        }
      }
    });
  }, oe = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Tt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let pt = null;
  const St = (t, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: s, value: n } }));
  }, $s = () => {
    if (pt && (pt.dispose(), pt = null), Ae.size === 0) {
      Bt.style.display = "none";
      return;
    }
    const t = [...Ae], o = t.filter((_) => _.startsWith("pt:")), s = t.filter((_) => _.startsWith("seg:")), n = t.filter((_) => _.startsWith("poly:")), a = t.filter((_) => _.startsWith("aux:")), i = o.length > 0, c = s.length > 0, m = n.length > 0, w = !i && !c && !m, g = [];
    o.length && g.push(`\u{1F535} ${o.length} nodo(s)`), s.length && g.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && g.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && g.push(`\u250A ${a.length} aux`);
    const M = `\u{1F3AF} ${Ae.size} item(s) \u2014 ${g.join(", ")}`;
    pt = new Ms({ container: Bt, title: M });
    {
      const _ = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      _.addBinding(Tt, "dx", { label: "\u0394x (m)", step: 0.1 }), _.addBinding(Tt, "dy", { label: "\u0394y (m)", step: 0.1 }), _.addBinding(Tt, "dz", { label: "\u0394z (m)", step: 0.1 }), _.addBinding(Tt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), _.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, Tt.copias);
        de(G ? `\u29C9 Replicado \xD7${G} (\u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const p = { vuelo: 1.5, losa: true, borde: true, ambos: true }, L = _.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      L.addBinding(p, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), L.addBinding(p, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), L.addBinding(p, "borde", { label: "con viga de borde" }), L.addBinding(p, "ambos", { label: "a los dos lados" }), L.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanVoladoSelection) == null ? void 0 : _a2.call(window, p.vuelo, { losa: p.losa, vigaBorde: p.borde, lados: p.ambos ? "ambos" : "afuera" });
        de(G ? `\u2310 Volado de ${p.vuelo} m en ${G} pa\xF1o(s)` + (p.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), _.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, 1);
        de(G ? `\u2192 Copia desplazada \u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const te = _.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      te.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), te.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), de(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const _ = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      _.addBinding(oe, "Ux"), _.addBinding(oe, "Uy"), _.addBinding(oe, "Uz"), _.addBinding(oe, "Rx"), _.addBinding(oe, "Ry"), _.addBinding(oe, "Rz");
      const p = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      p.addBinding(oe, "Kx", { label: "Kx", min: 0, step: 100 }), p.addBinding(oe, "Ky", { label: "Ky", min: 0, step: 100 }), p.addBinding(oe, "Kz", { label: "Kz", min: 0, step: 100 }), p.addBinding(oe, "Krx", { label: "Krx", min: 0, step: 1e3 }), p.addBinding(oe, "Kry", { label: "Kry", min: 0, step: 1e3 }), p.addBinding(oe, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const L = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      L.addBinding(oe, "Fx", { step: 0.1 }), L.addBinding(oe, "Fy", { step: 0.1 }), L.addBinding(oe, "Fz", { step: 0.1 }), L.addBinding(oe, "Mx", { step: 0.1 }), L.addBinding(oe, "My", { step: 0.1 }), L.addBinding(oe, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(oe, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(oe, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let Z = 0;
        const v = [oe.Ux, oe.Uy, oe.Uz, oe.Rx, oe.Ry, oe.Rz];
        v.some((U) => U) && (St("nodes", o, "supports", v), Z++);
        const F = [oe.Fx, oe.Fy, oe.Fz, oe.Mx, oe.My, oe.Mz];
        F.some((U) => U !== 0) && (St("nodes", o, "loads", F), Z++);
        const T = [oe.Kx, oe.Ky, oe.Kz, oe.Krx, oe.Kry, oe.Krz];
        if (T.some((U) => U !== 0) && (St("nodes", o, "springs", T), Z++), oe.mass !== 0 && (St("nodes", o, "mass", oe.mass), Z++), oe.diaphragm !== "Ninguno" && (St("nodes", o, "diaphragm", oe.diaphragm), Z++), Z === 0) {
          de("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let U = document.getElementById("hk-prop-toast");
          U || (U = document.createElement("div"), U.id = "hk-prop-toast", U.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(U)), U.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", U.style.background = "rgba(217,119,6,0.97)", U.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            U && (U.style.opacity = "0");
          }, 3200);
        } else de(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (c) {
      const _ = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      _.addBinding(oe, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), _.addBinding(oe, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const p = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      p.addBinding(oe, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), p.addBinding(oe, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), p.addBinding(oe, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), p.addBinding(oe, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(oe, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(oe, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const G = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      G.addBinding(oe, "relMxI", { label: "Mx I" }), G.addBinding(oe, "relMyI", { label: "My I" }), G.addBinding(oe, "relMzI", { label: "Mz I" });
      const Z = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      Z.addBinding(oe, "relMxJ", { label: "Mx J" }), Z.addBinding(oe, "relMyJ", { label: "My J" }), Z.addBinding(oe, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(oe, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const F = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      F.addBinding(oe, "LKx", { label: "LKx", min: 0, step: 100 }), F.addBinding(oe, "LKy", { label: "LKy", min: 0, step: 100 }), F.addBinding(oe, "LKz", { label: "LKz", min: 0, step: 100 });
      const T = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      T.addBinding(oe, "qx", { step: 0.1 }), T.addBinding(oe, "qy", { step: 0.1 }), T.addBinding(oe, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(oe, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        St("segs", s, "section", oe.section), St("segs", s, "material", oe.material_frame);
        const H = { A: oe.A_mod, Iz: oe.Iz_mod, Iy: oe.Iy_mod, J: oe.J_mod };
        (H.A !== 1 || H.Iz !== 1 || H.Iy !== 1 || H.J !== 1) && St("segs", s, "modifiers", H), oe.insertionPoint !== "10 \u2014 Centroid" && St("segs", s, "insertionPoint", oe.insertionPoint), oe.beta !== 0 && St("segs", s, "beta", oe.beta);
        const q = [oe.relMxI, oe.relMyI, oe.relMzI], O = [oe.relMxJ, oe.relMyJ, oe.relMzJ];
        (q.some((Se) => Se) || O.some((Se) => Se)) && St("segs", s, "releases", { i: q, j: O }), oe.hinges !== "None" && St("segs", s, "hinges", oe.hinges);
        const ve = [oe.LKx, oe.LKy, oe.LKz];
        ve.some((Se) => Se !== 0) && St("segs", s, "lineSprings", ve);
        const be = [oe.qx, oe.qy, oe.qz];
        be.some((Se) => Se !== 0) && St("segs", s, "distLoad", be), oe.massPerM !== 0 && St("segs", s, "massPerM", oe.massPerM), de(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (m) {
      const _ = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      _.addBinding(oe, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), _.addBinding(oe, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), _.addBinding(oe, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(oe, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        St("areas", n, "shellType", oe.shellType), St("areas", n, "thickness", oe.thickness), St("areas", n, "material", oe.material_shell), oe.surfLoad !== 0 && St("areas", n, "surfLoad", oe.surfLoad), de(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (w) {
      const _ = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), p = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      _.addBinding(p, "msg", { readonly: true, label: "" });
    }
    pt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ae.clear(), Vt();
    }), Bt.style.display = "block", Ts();
  };
  window.__hekatanRefreshPropsPane = $s;
  let mn = null, Nn = false;
  b.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, Nn = false);
  }), b.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !Nn) {
      const o = t.clientX - mn.x, s = t.clientY - mn.y;
      Math.hypot(o, s) > 8 && (Nn = true);
    }
  }), b.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !Nn;
      mn = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Yt ? Xn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ae.size > 0 && (Ae.clear(), Vt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), de(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : de("\u238B Cancelado (click derecho)");
      }
    }
  }), b.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), b.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Gt = null, Sn = false));
  }), b.addEventListener("pointermove", (t) => {
    if (Yt && t.buttons === 0) {
      const i = t.clientX < Yt.x;
      po(Yt.x, Yt.y, t.clientX, t.clientY, i);
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
    Bo(Gt.x, Gt.y, t.clientX, t.clientY, o), Gt = null, Sn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const qt = new it();
  qt.visible = false, qt.frustumCulled = false, r.add(qt);
  const Yo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Zo = (t, o, s, n) => {
    var _a2, _b, _c, _d;
    for (; qt.children.length; ) {
      const c = qt.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Yo[t] ?? 16777215, i = new ze().setFromPoints([new k(-1, -1, 0), new k(1, -1, 0), new k(1, -1, 0), new k(1, 1, 0), new k(1, 1, 0), new k(-1, 1, 0), new k(-1, 1, 0), new k(-1, -1, 0)]);
    qt.add(new Wt(i, new ht({ color: a, linewidth: 2 }))), qt.position.set(o, s, n), qt.visible = true, fo();
  };
  let uo = 4;
  const fo = () => {
    qt.visible && qt.scale.setScalar(uo * Bn(qt.position));
  };
  window.__hekatanOsnapMarkerRef = qt, window.__hekatanUpdateOsnapScale = fo, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (uo = t, fo(), y()), uo);
  const Yn = () => {
    qt.visible = false;
  }, Ls = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Jt = document.createElement("div");
  Jt.id = "hk-osnap-etiqueta", Jt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Jt);
  const Uo = (t, o, s) => {
    const n = Ls[t];
    if (!n) {
      Jt.style.display = "none";
      return;
    }
    Jt.textContent = n, Jt.style.color = "#" + (Yo[t] ?? 16777215).toString(16).padStart(6, "0"), Jt.style.left = o + 18 + "px", Jt.style.top = s - 26 + "px", Jt.style.display = "block";
  }, Is = () => {
    Jt.style.display = "none";
  }, Cn = new k(), ho = (t, o, s) => {
    const n = d();
    if (!n) return null;
    const a = b.getBoundingClientRect();
    return Cn.set(t, o, s).project(n), !isFinite(Cn.x) || !isFinite(Cn.y) ? null : { x: a.left + (Cn.x * 0.5 + 0.5) * a.width, y: a.top + (-Cn.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = ho;
  const Rs = (t, o, s, n, a) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, c = e.points.rawVal, m = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let w = null;
    const g = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, M = a, _ = (v, F, T, U) => {
      let H;
      if (M) {
        const O = ho(F, T, U);
        if (!O || (H = Math.hypot(O.x - M.x, O.y - M.y), H > kn)) return;
      } else if (H = Math.hypot(F - t, T - o, U - s), H > n) return;
      const q = g[v] ?? 9;
      (!w || q < w.r || q === w.r && H < w.d) && (w = { type: v, x: F, y: T, z: U, d: H, r: q });
    };
    if (i.ori !== false && _("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const v = window.__hekatanGridConfig, F = (v == null ? void 0 : v.minorStep) && v.minorStep > 0 ? v.minorStep : 1, T = ((v == null ? void 0 : v.gridSize) ?? 30) / 2, U = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", H = (O) => Math.round(O / F) * F, q = (O, ve) => Math.abs(O) <= T + 1e-9 && Math.abs(ve) <= T + 1e-9;
      if (U === "xz") {
        const O = H(t), ve = H(s);
        q(O, ve) && _("grid", O, o, ve);
      } else if (U === "yz") {
        const O = H(o), ve = H(s);
        q(O, ve) && _("grid", t, O, ve);
      } else {
        const O = H(t), ve = H(o);
        q(O, ve) && _("grid", O, ve, s);
      }
    }
    (i.node || i.end) && c.forEach((v) => {
      i.node && _("node", v[0], v[1], v[2]);
    });
    for (const v of m) if (!(v.length < 2)) for (let F = 0; F < v.length - 1; F++) {
      const T = c[v[F]], U = c[v[F + 1]];
      if (!(!T || !U) && (i.end && (_("end", T[0], T[1], T[2]), _("end", U[0], U[1], U[2])), i.mid && _("mid", (T[0] + U[0]) / 2, (T[1] + U[1]) / 2, (T[2] + U[2]) / 2), i.nea || i.per)) {
        const H = U[0] - T[0], q = U[1] - T[1], O = U[2] - T[2], ve = H * H + q * q + O * O;
        if (ve < 1e-12) continue;
        const be = Math.max(0, Math.min(1, ((t - T[0]) * H + (o - T[1]) * q + (s - T[2]) * O) / ve)), Se = T[0] + be * H, je = T[1] + be * q, Ie = T[2] + be * O;
        i.nea && _("nea", Se, je, Ie), i.per && _("per", Se, je, Ie);
      }
    }
    if (i.cen) {
      const v = ((_e = e.areas) == null ? void 0 : _e.rawVal) ?? [];
      for (const F of v) {
        const T = m[F];
        if (!T || T.length < 3) continue;
        const U = T[0] === T[T.length - 1] ? T.slice(0, -1) : T;
        let H = 0, q = 0, O = 0, ve = 0;
        for (const be of U) {
          const Se = c[be];
          Se && (H += Se[0], q += Se[1], O += Se[2], ve++);
        }
        ve >= 3 && _("cen", H / ve, q / ve, O / ve);
      }
    }
    if (i.cen) {
      const v = bn(), F = [...an];
      for (const T of v) F.some((U) => Math.hypot(U.c[0] - T.c[0], U.c[1] - T.c[1], U.c[2] - T.c[2]) < 1e-6 && Math.abs(U.r - T.r) < 1e-6) || F.push(T);
      for (const T of F) {
        if (!c.some((q) => Math.abs(Math.hypot(q[0] - T.c[0], q[1] - T.c[1], q[2] - T.c[2]) - T.r) < 1e-6)) continue;
        const H = Math.hypot(t - T.c[0], o - T.c[1], s - T.c[2]);
        if (H < n || Math.abs(H - T.r) < n) {
          const q = Math.min(H, n * 0.5), O = 3;
          (!w || O < w.r || O === w.r && q < w.d) && (w = { type: "cen", x: T.c[0], y: T.c[1], z: T.c[2], d: q, r: O });
        }
      }
    }
    if (i.int) {
      const v = [];
      for (const F of m) for (let T = 0; T < F.length - 1; T++) {
        const U = c[F[T]], H = c[F[T + 1]];
        if (!U || !H) continue;
        const q = H[0] - U[0], O = H[1] - U[1], ve = H[2] - U[2], be = q * q + O * O + ve * ve;
        if (be < 1e-12) continue;
        const Se = Math.max(0, Math.min(1, ((t - U[0]) * q + (o - U[1]) * O + (s - U[2]) * ve) / be));
        Math.hypot(U[0] + Se * q - t, U[1] + Se * O - o, U[2] + Se * ve - s) < 3 * n && v.push([U, H]);
      }
      for (let F = 0; F < v.length; F++) for (let T = F + 1; T < v.length; T++) {
        const [U, H] = v[F], [q, O] = v[T], ve = [H[0] - U[0], H[1] - U[1], H[2] - U[2]], be = [O[0] - q[0], O[1] - q[1], O[2] - q[2]], Se = [U[0] - q[0], U[1] - q[1], U[2] - q[2]], je = ve[0] * ve[0] + ve[1] * ve[1] + ve[2] * ve[2], Ie = ve[0] * be[0] + ve[1] * be[1] + ve[2] * be[2], ot = be[0] * be[0] + be[1] * be[1] + be[2] * be[2], tt = ve[0] * Se[0] + ve[1] * Se[1] + ve[2] * Se[2], at = be[0] * Se[0] + be[1] * Se[1] + be[2] * Se[2], Qe = je * ot - Ie * Ie;
        if (Qe < 1e-12) continue;
        const $e = (Ie * at - ot * tt) / Qe, nt = (je * at - Ie * tt) / Qe;
        if ($e < -1e-6 || $e > 1 + 1e-6 || nt < -1e-6 || nt > 1 + 1e-6) continue;
        const Ye = [U[0] + $e * ve[0], U[1] + $e * ve[1], U[2] + $e * ve[2]], _e2 = [q[0] + nt * be[0], q[1] + nt * be[1], q[2] + nt * be[2]];
        if (Math.hypot(Ye[0] - _e2[0], Ye[1] - _e2[1], Ye[2] - _e2[2]) > 1e-4) continue;
        [U, H, q, O].some((et) => Math.hypot(et[0] - Ye[0], et[1] - Ye[1], et[2] - Ye[2]) < 1e-6) || _("int", Ye[0], Ye[1], Ye[2]);
      }
    }
    const p = window.__hekatanAxisGrids ?? [], L = window.__hekatanLevels ?? [], te = p.filter((v) => v && v.start && v.end).map((v) => [v.start, v.end]);
    for (const [v, F] of te) {
      i.end && (_("end", v[0], v[1], v[2]), _("end", F[0], F[1], F[2]));
      const T = F[0] - v[0], U = F[1] - v[1], H = F[2] - v[2], q = T * T + U * U + H * H;
      if (q < 1e-12) continue;
      const O = Math.max(0, Math.min(1, ((t - v[0]) * T + (o - v[1]) * U + (s - v[2]) * H) / q));
      if (i.nea && _("nea", v[0] + O * T, v[1] + O * U, v[2] + O * H), i.int && Math.abs(H) > 1e-9) for (const ve of L) {
        const be = (ve.z - v[2]) / H;
        be < -1e-6 || be > 1 + 1e-6 || _("int", v[0] + be * T, v[1] + be * U, ve.z);
      }
    }
    if (i.int || i.node) for (let v = 0; v < te.length; v++) for (let F = v + 1; F < te.length; F++) {
      const [T, U] = te[v], [H, q] = te[F], O = U[0] - T[0], ve = U[1] - T[1], be = q[0] - H[0], Se = q[1] - H[1], je = O * Se - ve * be;
      if (Math.abs(je) < 1e-12) continue;
      const Ie = T[0] - H[0], ot = T[1] - H[1], tt = (be * ot - Se * Ie) / je, at = (O * ot - ve * Ie) / je;
      if (tt < -1e-6 || tt > 1 + 1e-6 || at < -1e-6 || at > 1 + 1e-6) continue;
      const Qe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      _("int", T[0] + tt * O, T[1] + tt * ve, typeof Qe == "number" ? Qe : s);
    }
    const G = window.__hekatanDrawingAuxLines, Z = (G == null ? void 0 : G.rawVal) ?? (G == null ? void 0 : G.val) ?? G ?? [];
    for (const v of Z) {
      if (v.length !== 6) continue;
      const F = [v[0], v[1], v[2]], T = [v[3], v[4], v[5]];
      if (i.end && (_("end", F[0], F[1], F[2]), _("end", T[0], T[1], T[2])), i.mid && _("mid", (F[0] + T[0]) / 2, (F[1] + T[1]) / 2, (F[2] + T[2]) / 2), i.nea || i.per) {
        const U = T[0] - F[0], H = T[1] - F[1], q = T[2] - F[2], O = U * U + H * H + q * q;
        if (O < 1e-12) continue;
        const ve = Math.max(0, Math.min(1, ((t - F[0]) * U + (o - F[1]) * H + (s - F[2]) * q) / O)), be = F[0] + ve * U, Se = F[1] + ve * H, je = F[2] + ve * q;
        i.nea && _("nea", be, Se, je), i.per && _("per", be, Se, je);
      }
    }
    return w ? { type: w.type, x: w.x, y: w.y, z: w.z } : null;
  }, wn = new it();
  wn.frustumCulled = false, r.add(wn);
  const qo = new ht({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Ko = 0;
  const Go = () => {
    var _a2, _b;
    for (const t of wn.children.slice()) wn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    Go();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], s = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of t || []) {
      const i = String(a).split(":");
      let c = [];
      if (i[0] === "pt") {
        const g = o[+i[1]];
        g && (c = [g, [g[0] + 1e-3, g[1], g[2]]]);
      } else if (i[0] === "seg") {
        const g = s[+i[1]] || [], M = o[g[+i[2]]], _ = o[g[+i[2] + 1]];
        M && _ && (c = [M, _]);
      } else i[0] === "poly" && (c = (s[+i[1]] || []).map((M) => o[M]).filter(Boolean));
      if (c.length < 2) continue;
      const m = new ze().setFromPoints(c.map((g) => new k(g[0], g[1], g[2]))), w = new zt(m, qo);
      w.renderOrder = 1200, wn.add(w);
    }
    if (!wn.children.length) return;
    Ko = performance.now() + 900;
    const n = () => {
      const a = Ko - performance.now();
      if (a <= 0) {
        Go(), y();
        return;
      }
      qo.opacity = Math.min(1, a / 900) * 0.95, y(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Rs, window.__hekatanOsnapShow = Zo, window.__hekatanOsnapHide = Yn;
  let Ue = [], vt = 0, rn = 0, Ct = null;
  const zn = document.createElement("div");
  zn.id = "hk-cad-status", zn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", zn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(zn);
  const Ds = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), Je && t.push(`\u{1F512} LOCK ${Je.toUpperCase()}`);
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && t.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, de = (t) => {
    var _a2;
    const o = t + Ds();
    zn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Bs = "Comando:", Xs = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Ue.length, a = (i, c = []) => ({ txt: i, ops: c });
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
        return a(`COLUMNA Precise punto de inserci\xF3n (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return a(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return a(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return a("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return a("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return a(Ct ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(Ct ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(Ct ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${rn > 0 ? ` (distancia ${rn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Ae.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ae.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ae.size ? a(`SELECCI\xD3N ${Ae.size} objeto${Ae.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(Bs);
    }
  }, Zt = () => {
    var _a2, _b, _c, _d, _e;
    try {
      const t = Xs(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !s ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e = window.__hekatanCadPrompt) == null ? void 0 : _e.call(window, a, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Zt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    de(o);
  }, window.__hekatanCadResetPending = () => {
    Ue = [], ye = [], J.visible = false, mo(), Ct = null, y(), de("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Zt();
  };
  function mo() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = mo;
  const yn = [], Zn = [], wo = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Ho = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ue = [], fe.visible = false, st.visible = false, V();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    y(), Zt();
  }, Xt = () => {
    yn.push(wo()), yn.length > 100 && yn.shift(), Zn.length = 0;
  }, Un = () => {
    const t = yn.pop();
    if (!t) {
      de("\u21B6 Nada para deshacer");
      return;
    }
    Zn.push(wo()), Ho(t), de(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Wo = () => {
    const t = Zn.pop();
    if (!t) {
      de("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(wo()), Ho(t), de(`\u21B7 Rehacer \u2014 quedan ${Zn.length}`);
  };
  window.__hekatanPushUndo = Xt, window.__hekatanUndo = Un, window.__hekatanRedo = Wo, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Wo());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e;
    const o = t.trim().toLowerCase(), s = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Un(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return de("Cerrar necesita al menos tres puntos."), true;
      Xt(), e.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return yo(), de(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Un(), true;
      Xt();
      const i = a[a.length - 1], c = a.slice(0, -1), m = n.some((M, _) => _ !== n.length - 1 && M.includes(i)) || c.includes(i);
      let w = e.points.rawVal, g = [...n.slice(0, -1), c];
      if (!m && i === w.length - 1 && (w = w.slice(0, -1), e.points.val = w), e.polylines.val = g, c.length) {
        const M = w[c[c.length - 1]];
        M && (A = [M[0], M[1], M[2]]);
      } else A = null, fe.visible = false;
      try {
        (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
      } catch {
      }
      return y(), de(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${c.length}.`), Zt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, s = o == null ? void 0 : o.tagName;
      if ((s === "INPUT" || s === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Un();
    }
  }, { capture: true });
  const yo = () => {
    Ue = [], Ct = null, mo(), Je = null, Ve(), fe.visible = false, st.visible = false, V(), de("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Zt();
  };
  window.__hekatanFinalizeDraw = yo;
  const Jo = () => {
    var _a2, _b, _c;
    Ue = [], ye = [], J.visible = false;
    let t = false;
    Ae.size && (Ae.clear(), Vt(), t = true), yo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    de(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Zt();
  };
  window.__hekatanEscapeCancel = Jo;
  const Oo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ae.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (t[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = t[+n[1]] || [], i = a[+n[2]], c = a[+n[2] + 1];
        i != null && o.add(i), c != null && o.add(c);
      }
    }), o;
  }, Qo = (t, o, s) => {
    var _a2;
    const n = Oo();
    if (!n.size) return 0;
    Xt();
    const a = e.points.rawVal.map((i, c) => n.has(c) ? [i[0] + t, i[1] + o, i[2] + s] : i);
    e.points.val = a;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Vt(), y(), n.size;
  };
  window.__hekatanMoveSelection = Qo;
  const jo = (t, o) => {
    var _a2, _b, _c, _d, _e;
    if (!Ae.size) {
      de(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Zt();
      return;
    }
    if (Ue.push(o), Ue.length === 1) {
      A = o, de(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Zt();
      return;
    }
    const [s, n] = Ue, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Ue = [], fe.visible = false;
    let i = 0;
    t === "move" ? i = Qo(a[0], a[1], a[2]) : (i = Oo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), de(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), t === "move" && (Ae.clear(), Vt()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Zt();
  };
  window.__hekatanPasoMoverCopiar = jo;
  const Ns = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), xo = (t, o, s, n, a, i) => {
    const c = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], m = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], w = [t[0] - s[0], t[1] - s[1], t[2] - s[2]], g = c[0] * c[0] + c[1] * c[1] + c[2] * c[2], M = c[0] * m[0] + c[1] * m[1] + c[2] * m[2], _ = m[0] * m[0] + m[1] * m[1] + m[2] * m[2], p = c[0] * w[0] + c[1] * w[1] + c[2] * w[2], L = m[0] * w[0] + m[1] * w[1] + m[2] * w[2], te = g * _ - M * M;
    if (te < 1e-12) return null;
    const G = (M * L - _ * p) / te, Z = (g * L - M * p) / te;
    if (!a && (G < -1e-6 || G > 1 + 1e-6) || !i && (Z < -1e-6 || Z > 1 + 1e-6)) return null;
    const v = [t[0] + G * c[0], t[1] + G * c[1], t[2] + G * c[2]], F = [s[0] + Z * m[0], s[1] + Z * m[1], s[2] + Z * m[2]];
    return jt(v, F) > 1e-4 ? null : v;
  }, Ys = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === t).length, 0);
  }, Zs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Us = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const s = e.polylines.rawVal, n = e.points.rawVal, a = Zs[t];
    if (!Ct) {
      if (Be < 0) {
        de(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Ct = { poly: Be, seg: Math.max(0, We) }, de(t === "offset" ? `DESFASE l\xEDnea #${Ct.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${rn > 0 ? ` (${rn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Zt();
      return;
    }
    if (t === "offset") {
      const G = Ct.poly, Z = s[G];
      if (!Z || Z.length < 2) {
        Ct = null, de("DESFASE: esa polil\xEDnea no tiene tramos."), Zt();
        return;
      }
      const v = Z.length > 2 && Z[0] === Z[Z.length - 1], F = Ns(), T = [];
      for (let $e = 0; $e < Z.length - 1; $e++) {
        const nt = n[Z[$e]], Ye = n[Z[$e + 1]], _e = [Ye[0] - nt[0], Ye[1] - nt[1], Ye[2] - nt[2]], Re = Math.hypot(_e[0], _e[1], _e[2]) || 1, et = _e[0] / Re, It = _e[1] / Re, Nt = _e[2] / Re, Rt = [F[1] * Nt - F[2] * It, F[2] * et - F[0] * Nt, F[0] * It - F[1] * et], Qt = Math.hypot(Rt[0], Rt[1], Rt[2]) || 1;
        T.push({ a: nt, b: Ye, n: [Rt[0] / Qt, Rt[1] / Qt, Rt[2] / Qt] });
      }
      let U = 0, H = 1 / 0;
      T.forEach(($e, nt) => {
        const Ye = on(o[0], o[1], o[2], $e.a[0], $e.a[1], $e.a[2], $e.b[0], $e.b[1], $e.b[2]);
        Ye < H && (H = Ye, U = nt);
      });
      const q = T[U], O = Math.sign((o[0] - q.a[0]) * q.n[0] + (o[1] - q.a[1]) * q.n[1] + (o[2] - q.a[2]) * q.n[2]) || 1, ve = rn > 0 ? rn : H;
      if (ve < 1e-6) {
        de("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const be = T.map(($e) => ({ a: [$e.a[0] + O * ve * $e.n[0], $e.a[1] + O * ve * $e.n[1], $e.a[2] + O * ve * $e.n[2]], b: [$e.b[0] + O * ve * $e.n[0], $e.b[1] + O * ve * $e.n[1], $e.b[2] + O * ve * $e.n[2]] })), Se = be.length, je = ($e) => {
        const nt = be[($e - 1 + Se) % Se], Ye = be[$e % Se];
        return xo(nt.a, nt.b, Ye.a, Ye.b, true, true) ?? Ye.a;
      }, Ie = [], ot = v ? Se : Se + 1;
      for (let $e = 0; $e < ot; $e++) !v && $e === 0 ? Ie.push(be[0].a) : !v && $e === Se ? Ie.push(be[Se - 1].b) : Ie.push(je($e));
      Xt();
      const tt = n.length;
      e.points.val = [...n, ...Ie];
      const at = Ie.map(($e, nt) => tt + nt);
      v && at.push(tt);
      let Qe = s.slice();
      Qe.length && Qe[Qe.length - 1].length === 0 && (Qe = Qe.slice(0, -1)), e.polylines.val = [...Qe, at, []], Ct = null, de(`\u2713 Desfase a ${ve.toFixed(2)} m \u2014 ${Se} tramo${Se === 1 ? "" : "s"} nuevo${Se === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Zt();
      return;
    }
    let i = Be, c = Math.max(0, We);
    if (i < 0 || i === Ct.poly && c === Ct.seg) {
      let Z = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, s.forEach((v, F) => {
        for (let T = 0; T < v.length - 1; T++) {
          if (F === Ct.poly && T === Ct.seg) continue;
          const U = n[v[T]], H = n[v[T + 1]];
          if (!U || !H) continue;
          const q = on(o[0], o[1], o[2], U[0], U[1], U[2], H[0], H[1], H[2]);
          q < Z && (Z = q, i = F, c = T);
        }
      }), i < 0) {
        de(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const m = s[Ct.poly], w = n[m[Ct.seg]], g = n[m[Ct.seg + 1]], M = s[i], _ = M[c], p = M[c + 1];
    if (!w || !g || _ == null || p == null) {
      de(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const L = n[_], te = n[p];
    if (t === "trim") {
      const G = xo(L, te, w, g, false, false);
      if (!G) {
        de("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Xt();
      const Z = n.length;
      e.points.val = [...n, G];
      const v = [...M.slice(0, c + 1), Z, ...M.slice(c + 1)];
      e.polylines.val = s.map((T, U) => U === i ? v : T);
      const F = jt(o, L) < jt(o, te);
      In(i, F ? c : c + 1), de(`\u2713 Recortado en (${G[0].toFixed(2)}, ${G[1].toFixed(2)}, ${G[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const G = xo(L, te, w, g, true, false);
      if (!G) {
        de("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const v = jt(o, L) < jt(o, te) ? c : c + 1;
      if (v !== 0 && v !== M.length - 1) {
        de("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const F = M[v];
      if (jt(G, L) + jt(G, te) < jt(L, te) + 1e-6) {
        de("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Xt(), Ys(F) > 1) {
        const U = n.length;
        e.points.val = [...n, G];
        const H = M.slice();
        H[v] = U, e.polylines.val = s.map((q, O) => O === i ? H : q);
      } else e.points.val = n.map((U, H) => H === F ? G : U);
      de(`\u2713 Alargada hasta (${G[0].toFixed(2)}, ${G[1].toFixed(2)}, ${G[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    y(), Zt();
  };
  window.__hekatanSelectionSize = () => Ae.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return Ae.clear(), o >= 0 && Ae.add(`poly:${o}`), Vt(), de(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ae.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Ae.clear();
    const s = /* @__PURE__ */ new Set();
    return t.forEach((n, a) => {
      !n || n.length < 2 || (Ae.add(`poly:${a}`), n.forEach((i) => s.add(i)));
    }), o.forEach((n, a) => {
      s.has(a) || Ae.add(`pt:${a}`);
    }), Vt(), de(`SELECCI\xD3N ${Ae.size} objetos (todo el modelo) \xB7 Esc suelta`), Ae.size;
  }, window.__hekatanReplicateSelection = (t, o, s, n, a = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const i = [...Ae], c = e.points.rawVal, m = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], w = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), g = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), _ = [];
    if (i.forEach((Z) => {
      if (Z.startsWith("pt:")) {
        const v = +Z.slice(3);
        c[v] && g.add(v);
      } else if (Z.startsWith("poly:")) {
        const v = +Z.slice(5);
        if (!m[v] || m[v].length < 2) return;
        M.add(v), m[v].forEach((F) => g.add(F));
      } else if (Z.startsWith("seg:")) {
        const v = Z.split(":"), F = +v[1], T = +v[2], U = m[F] || [], H = U[T], q = U[T + 1];
        H != null && q != null && (_.push([H, q]), g.add(H), g.add(q));
      }
    }), !g.size) return 0;
    Xt();
    const p = [...c];
    let L = m.slice();
    L.length && L[L.length - 1].length === 0 && (L = L.slice(0, -1));
    const te = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], G = [...g];
    for (let Z = 1; Z <= n; Z++) {
      const v = a + Z, F = t * v, T = o * v, U = s * v, H = /* @__PURE__ */ new Map();
      G.forEach((q) => {
        H.set(q, p.length), p.push([c[q][0] + F, c[q][1] + T, c[q][2] + U]);
      }), M.forEach((q) => {
        const O = m[q].map((be) => H.has(be) ? H.get(be) : be), ve = L.length;
        L.push(O), w.has(q) && te.push(ve);
      }), _.forEach(([q, O]) => {
        L.push([H.get(q), H.get(O)]);
      });
    }
    L.push([]), e.points.val = p, e.polylines && (e.polylines.val = L), e.areas && (e.areas.val = te);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return y(), n;
  }, window.__hekatanVoladoSelection = (t, o = {}) => {
    var _a2, _b, _c;
    const s = Number(t);
    if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
    const n = o.losa !== false, a = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", c = e.points.rawVal, m = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], w = [];
    if ([...Ae].forEach((G) => {
      if (G.startsWith("seg:")) {
        const Z = G.split(":"), v = +Z[1], F = +Z[2], T = m[v] || [], U = T[F], H = T[F + 1];
        U != null && H != null && w.push([U, H]);
      } else if (G.startsWith("poly:")) {
        const Z = m[+G.slice(5)] || [];
        for (let v = 0; v + 1 < Z.length; v++) w.push([Z[v], Z[v + 1]]);
      }
    }), !w.length) return 0;
    let g = 0, M = 0;
    for (const G of c) g += G[0], M += G[1];
    g /= Math.max(1, c.length), M /= Math.max(1, c.length), Xt();
    const _ = [...c];
    let p = m.slice();
    p.length && p[p.length - 1].length === 0 && (p = p.slice(0, -1));
    const L = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let te = 0;
    for (const [G, Z] of w) {
      const v = c[G], F = c[Z];
      if (!v || !F) continue;
      const T = F[0] - v[0], U = F[1] - v[1], H = Math.hypot(T, U);
      if (H < 1e-6) continue;
      let q = -U / H, O = T / H;
      const ve = (v[0] + F[0]) / 2, be = (v[1] + F[1]) / 2;
      (ve - g) * q + (be - M) * O < 0 && (q = -q, O = -O);
      const Se = i === "ambos" ? [1, -1] : [1];
      for (const je of Se) {
        const Ie = q * s * je, ot = O * s * je, tt = _.length;
        _.push([v[0] + Ie, v[1] + ot, v[2]]);
        const at = _.length;
        _.push([F[0] + Ie, F[1] + ot, F[2]]), p.push([G, tt]), p.push([Z, at]), a && p.push([tt, at]), n && (L.push(p.length), p.push([G, Z, at, tt, G])), te++;
      }
    }
    if (!te) return 0;
    p.push([]), e.points.val = _, e.polylines && (e.polylines.val = p), e.areas && (e.areas.val = L);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return y(), te;
  }, b.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, ln > 5) {
      ln = 0;
      return;
    }
    ln = 0;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(z, o);
    const s = le();
    if (!s.length) return;
    {
      const a = o.position.distanceTo(u.target) || 1, i = s[0].distance ?? o.position.distanceTo(s[0].point), c = s[0].point;
      if (!isFinite(c.x) || !isFinite(c.y) || !isFinite(c.z) || i > Math.max(a * 12, 300)) {
        de("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = s[0].point;
    (t.ctrlKey || t.metaKey) && (n = new k(Math.round(s[0].point.x), Math.round(s[0].point.y), Math.round(s[0].point.z)));
    {
      const a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = a[a.length - 1] ?? [], c = e.points.rawVal ?? [];
      if (i.length > 0) {
        const m = c[i[i.length - 1]];
        if (m) {
          const w = !!window.__hekatanOrthoMode;
          let g = Je;
          if (!g && w) {
            const M = Math.abs(n.x - m[0]), _ = Math.abs(n.y - m[1]), p = Math.abs(n.z - m[2]);
            g = M >= _ && M >= p ? "x" : _ >= p ? "y" : "z";
          }
          g === "x" ? n = new k(n.x, m[1], m[2]) : g === "y" ? n = new k(m[0], n.y, m[2]) : g === "z" && (n = new k(m[0], m[1], n.z));
        }
      }
    }
    if (qe && Math.abs(t.clientX - qe.x) <= 3 && Math.abs(t.clientY - qe.y) <= 3) n = qe.p.clone();
    else if (kt) n = kt.clone(), de(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n = new k(i.x, i.y, i.z), de(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const c = window.__hekatanSnapEnabled !== false, m = window.__hekatanSnap2D ?? 0;
        c && m > 0 && (n = new k(Math.round(n.x / m) * m, Math.round(n.y / m) * m, Math.round(n.z / m) * m));
      }
    }
    es(n, t);
  });
  const es = (t, o) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const s = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (Ut) {
        Yt && Xn();
        const { kind: n, a, b: i } = Ut, c = i !== void 0 ? `${n}:${a}:${i}` : `${n}:${a}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ae.clear(), Ae.has(c) ? Ae.delete(c) : Ae.add(c), Vt(), de(`\u2713 Seleccionados ${Ae.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), a = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Yt ? (Bo(Yt.x, Yt.y, a, i, n), Yt = null) : n || (Yt = { x: a, y: i }, de("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), po(a, i, a + 1, i + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], de(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const a = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], a);
      de(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      jo(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "delete") {
      if (wt >= 0) {
        const n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = wt;
        if (i >= 0 && i < a.length) {
          Xt();
          const c = a.slice(0, i).concat(a.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = c : window.__hekatanDrawingAuxLines = c, de(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), wt = -1, dt.visible = false;
          try {
            (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
          } catch {
          }
        }
      } else if (Be >= 0) {
        const n = Be, a = We;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (sn(n), de(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : a >= 0 ? (In(n, a), de(`\u{1F5D1} Segmento ${a + 1} de polil\xEDnea #${n + 1} borrado`)) : (sn(n), de(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else de("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, a] = Ue, i = Math.hypot(a[0] - n[0], a[1] - n[1], a[2] - n[2]);
      Math.abs(a[0] - n[0]);
      const c = Math.abs(a[1] - n[1]), w = Math.abs(a[2] - n[2]) < 1e-3 ? "xy" : c < 1e-3 ? "xz" : "yz", g = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, g, w), de(`\u2713 C\xEDrculo dibujado en ${w.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${g} segmentos`), Ue = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (s === "arc") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ue.length === 2) {
        de("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, a, i] = Ue, c = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, a, i, c), de(`\u2713 Arco dibujado \u2014 ${c} segmentos`), Ue = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ue;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, a), de(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ue = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ue;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, a), de(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${a[0].toFixed(1)},${a[1].toFixed(1)})`), Ue = [];
      return;
    }
    if (s === "polyarea") {
      ye.push([t.x, t.y, t.z]), J.geometry.setFromPoints(ye.map((n) => new k(n[0], n[1], n[2]))), J.visible = ye.length >= 1, de(`\u25B0 \xC1rea libre \u2014 ${ye.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (s === "plane3") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length < 3) {
        de(`\u25E3 Plano inclinado \u2014 punto ${Ue.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, a, i] = Ue, c = (_o = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o.call(window, n, a, i);
      de(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ue = [];
      return;
    }
    if (s === "col") {
      Xt();
      const n = t.z, a = vt && vt > 0 ? vt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + a]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], vt = 0, de(`\u258C Columna creada \u2014 h=${a.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, a] = Ue, i = vt && vt > 0 ? vt : 3;
      Xt();
      const c = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [a[0], a[1], a[2]], [a[0], a[1], a[2] + i], [n[0], n[1], n[2] + i]];
      const m = e.polylines.rawVal;
      if (m.length - 1, e.polylines.val = [...m.slice(0, -1), ...m[m.length - 1].length > 0 ? [m[m.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], e.areas) {
        const w = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, w];
      }
      de(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ue = [], vt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Xt();
      const n = vt && vt > 0 ? vt : 3, a = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, a], [t.x, t.y, a + n]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], vt = 0, de(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, a = vn(t.x, t.y, t.z, n);
      if (!a) {
        de("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, c = e.points.rawVal, m = i[a.polyIdx], w = c[m[a.segIdx]], g = c[m[a.segIdx + 1]];
      if (!w || !g) {
        de("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = vt && vt > 0 ? vt : 3;
      Xt();
      const _ = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [w[0], w[1], w[2]], [g[0], g[1], g[2]], [g[0], g[1], g[2] + M], [w[0], w[1], w[2] + M]];
      const p = e.polylines.rawVal;
      if (e.polylines.val = [...p.slice(0, -1), ...p[p.length - 1].length > 0 ? [p[p.length - 1]] : [], [_, _ + 1, _ + 2, _ + 3, _], []], e.areas) {
        const L = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, L];
      }
      vt = 0, de(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
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
      de(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, a] = Ue, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const M = i.rawVal ?? i.val ?? [];
        i.val = [...M, [n[0], n[1], n[2], a[0], a[1], a[2]]];
      }
      const c = a[0] - n[0], m = a[1] - n[1], w = a[2] - n[2], g = Math.sqrt(c * c + m * m + w * w);
      de(`\u2713 L\xEDnea auxiliar creada \u2014 L=${g.toFixed(2)}m (cyan, no FEM)`), Ue = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Us(s, [t.x, t.y, t.z]);
      return;
    }
    if (s === "chaflan") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, a] = Ue, i = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, a, i, c, 6);
      const m = Math.abs(a[0] - n[0]).toFixed(1), w = Math.abs(a[1] - n[1]).toFixed(1);
      de(`\u2713 Losa con chaflanes dibujada \u2014 ${m}\xD7${w}m, r=${i}m, ${c} seg/chafl\xE1n`), Ue = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (E = false, Xt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, a = n.length - 1, i = n[a] ?? [];
      if (s === "line" && i.length >= 2) {
        de(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, a]), de("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") de(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (s === "line") de("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") de("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      de(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  b.addEventListener("click", () => Zt()), b.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && ye.length >= 3) {
      t.preventDefault();
      const s = pn();
      de(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), b.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(z, o);
    const s = le();
    if (re.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const c = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = c[c.length - 1] ?? [], w = e.points.rawVal ?? [];
        if (m.length > 0) {
          const g = w[m[m.length - 1]];
          if (g) {
            const M = !!window.__hekatanOrthoMode;
            let _ = Je;
            if (!_ && M) {
              const p = Math.abs(n.x - g[0]), L = Math.abs(n.y - g[1]), te = Math.abs(n.z - g[2]);
              _ = p >= L && p >= te ? "x" : L >= te ? "y" : "z";
            }
            _ === "x" ? n.set(n.x, g[1], g[2]) : _ === "y" ? n.set(g[0], n.y, g[2]) : _ === "z" && n.set(g[0], g[1], n.z);
          }
        }
      }
      const a = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const c = window.__hekatanSnapEnabled !== false, m = window.__hekatanSnap2D ?? 0.5;
        c && m > 0 && (n.x = Math.round(n.x / m) * m, n.y = Math.round(n.y / m) * m, n.z = Math.round(n.z / m) * m);
      }
      re.geometry.setAttribute("position", new Pt(n.toArray(), 3));
    }
    y();
  }), b.addEventListener("pointermove", (t) => {
    var _a2;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(z, o);
    let s = false;
    const n = S.intersectObject(D), a = le();
    if (n.length && a.length) {
      const i = new k(...e.points.rawVal[n[0].index]), c = new k(...a[0].point), m = i.sub(c), w = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      w.transformDirection(W.matrixWorld), Math.abs(m.dot(w)) < 1e-4 && (s = true);
    }
    re.visible = !s;
  });
  let go = false, vo;
  b.addEventListener("pointermove", (t) => {
    var _a2;
    if (!ln) return;
    const o = x(t);
    if (!o) return;
    S.setFromCamera(z, o);
    let s = false;
    const n = S.intersectObject(D), a = le();
    if (n.length && a.length) {
      const c = new k(...e.points.rawVal[n[0].index]), m = new k(...a[0].point), w = c.sub(m), g = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      g.transformDirection(W.matrixWorld), Math.abs(w.dot(g)) < 1e-4 && (s = true);
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
    const o = x(t);
    if (!o) return;
    S.setFromCamera(z, o);
    let s = false;
    const n = S.intersectObject(D), a = le();
    if (n.length && a.length) {
      const m = new k(...e.points.rawVal[n[0].index]), w = new k(...a[0].point), g = m.sub(w), M = (_a2 = a[0].face) == null ? void 0 : _a2.normal;
      M.transformDirection(W.matrixWorld), Math.abs(g.dot(M)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const c = e.polylines.rawVal.map((m) => m.filter((w) => w !== n[0].index)).map((m) => m.map((w) => w > n[0].index ? w - 1 : w)).filter((m) => m.length);
    c.push([]), e.polylines.val = c;
  });
}
function $a(e, l, r) {
  const h = Math.round(14.999999999999998), f = { position: e.position.clone(), quaternion: e.quaternion.clone() }, b = setInterval(S, 1e3 / 30);
  let y = 0;
  function S() {
    y++;
    const z = y / h;
    e.position.lerpVectors(f.position, l.position, z), e.quaternion.slerpQuaternions(f.quaternion, l.quaternion, z), r && r(), y == h && clearInterval(b);
  }
}
function La(e, l, r, d) {
  const u = ua(r, e.elements, d);
  return j.derive(() => {
    u.visible = l.shellResults.val != "none";
  }), u;
}
const Ia = 6, Ao = 10, Ra = 0.012;
function Da(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ba(e, l, r, d) {
  if (!r && !d) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && r) {
    const h = r[e];
    if (h && h.has(l)) return h.get(l);
  }
  return null;
}
function Xa(e, l, r, d) {
  const u = new it(), h = new _s();
  h.setColorMap("rainbow");
  const f = new Ht(), b = j.state([]);
  return j.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = r.val, S = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], z = Da(l.frameResults.val);
    if (u.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), u.clear(), !z || S.length === 0 || y.length === 0) {
      b.val = [];
      return;
    }
    const x = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, W = (_c = e.deformOutputs) == null ? void 0 : _c.val, ue = [], me = [];
    for (let $ = 0; $ < S.length; $++) {
      if (S[$].length !== 2) continue;
      const se = Ba(z, $, x, W);
      se && (ue.push(se[0], se[1]), me.push({ idx: $, vals: se }));
    }
    if (ue.length === 0) {
      b.val = [];
      return;
    }
    const ie = Math.min(...ue), I = Math.max(...ue);
    h.setMin(ie), h.setMax(I), b.val = ue;
    const le = [1 / 0, 1 / 0, 1 / 0], D = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of y) for (let ee = 0; ee < 3; ee++) le[ee] = Math.min(le[ee], $[ee]), D[ee] = Math.max(D[ee], $[ee]);
    const ae = Math.max(D[0] - le[0], D[1] - le[1], D[2] - le[2], 1) * Ra, R = [], A = [], X = [];
    let E = 0;
    for (const { idx: $, vals: ee } of me) {
      const se = S[$], pe = y[se[0]], ne = y[se[1]];
      if (!pe || !ne) continue;
      const B = new k(ne[0] - pe[0], ne[1] - pe[1], ne[2] - pe[2]), fe = B.length();
      if (fe < 1e-10) continue;
      B.normalize();
      const J = Math.abs(B.y) < 0.99 ? new k(0, 1, 0) : new k(1, 0, 0), ye = new k().crossVectors(B, J).normalize(), xe = new k().crossVectors(B, ye).normalize(), Ee = Ao + 1, Me = Ia;
      for (let Le = 0; Le < Ee; Le++) {
        const Ke = Le / Ao, st = pe[0] + B.x * fe * Ke, mt = pe[1] + B.y * fe * Ke, P = pe[2] + B.z * fe * Ke, Y = ee[0] + (ee[1] - ee[0]) * Ke, Q = h.getColor(Y) ?? new Ht(0, 0, 0);
        f.copy(Q).convertSRGBToLinear();
        for (let K = 0; K < Me; K++) {
          const ge = K / Me * Math.PI * 2, ce = Math.cos(ge), ke = Math.sin(ge);
          R.push(st + (ye.x * ce + xe.x * ke) * ae, mt + (ye.y * ce + xe.y * ke) * ae, P + (ye.z * ce + xe.z * ke) * ae), A.push(f.r, f.g, f.b);
        }
      }
      for (let Le = 0; Le < Ao; Le++) for (let Ke = 0; Ke < Me; Ke++) {
        const st = (Ke + 1) % Me, mt = E + Le * Me + Ke, P = E + Le * Me + st, Y = E + (Le + 1) * Me + Ke, Q = E + (Le + 1) * Me + st;
        X.push(mt, P, Q), X.push(mt, Q, Y);
      }
      E += Ee * Me;
    }
    if (R.length === 0) return;
    const C = new ze();
    C.setAttribute("position", new Pt(R, 3)), C.setAttribute("color", new Pt(A, 3)), C.setIndex(X), C.computeVertexNormals();
    const N = new ft({ vertexColors: true, side: At }), V = new lt(C, N);
    V.frustumCulled = false, u.add(V);
  }), u.__colorMapValues = b, u;
}
function Na() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ya = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Za = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ua = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function bt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const qa = 16755200, ms = 56831, Ka = 56831, Ga = 56831, On = 65382;
function Ha(e) {
  const l = new it();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const r = new xn(1, 16, 16), d = new ft({ color: qa, transparent: true, opacity: 0.85, depthTest: false }), u = new lt(r, d);
  u.visible = false, u.renderOrder = 100, l.add(u);
  const h = new ze(), f = new ht({ color: ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), b = new Wt(h, f);
  b.visible = false, b.renderOrder = 100, l.add(b);
  const y = new ft({ color: ms, transparent: true, opacity: 0.7, depthTest: false }), S = new lt(new ps(1, 1, 1, 12), y);
  S.visible = false, S.renderOrder = 100, l.add(S);
  const z = new ze(), x = new ft({ color: Ka, transparent: true, opacity: 0.45, side: At, depthTest: false }), W = new lt(z, x);
  W.visible = false, W.renderOrder = 100, l.add(W);
  const ue = new ze(), me = new ht({ color: Ga, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), ie = new Wt(ue, me);
  ie.visible = false, ie.renderOrder = 100, l.add(ie);
  const I = new ft({ color: On, transparent: true, opacity: 0.95, depthTest: false }), le = new ft({ color: On, transparent: true, opacity: 0.85, depthTest: false }), D = new ps(1, 1, 1, 12), re = new ft({ color: On, transparent: true, opacity: 0.55, side: At, depthTest: false }), ae = new ht({ color: On, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), R = [];
  window.__hekatanModelSelection = R;
  const A = new it();
  A.renderOrder = 101, l.add(A);
  const X = document.createElement("div");
  Object.assign(X.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), X.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(X);
  }, 0);
  function E(P) {
    const Y = e.derivedNodes.rawVal;
    return !Y || P < 0 || P >= Y.length ? null : new k(Y[P][0], Y[P][1], Y[P][2]);
  }
  function C(P, Y) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const Q = e.getActiveCamera();
    if (!Q || !e.mesh) return null;
    const K = e.rendererElm.getBoundingClientRect(), ge = P - K.left, ce = Y - K.top, ke = e.derivedNodes.rawVal, he = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!ke || !he) return null;
    const De = /* @__PURE__ */ new Map(), Te = (qe) => {
      if (De.has(qe)) return De.get(qe);
      const Ce = E(qe);
      if (!Ce) return De.set(qe, null), null;
      const Ve = Ce.clone().project(Q), Ge = (Ve.x * 0.5 + 0.5) * K.width, Fe = (-Ve.y * 0.5 + 0.5) * K.height, ct = { x: Ge, y: Fe, z: Ve.z };
      return De.set(qe, ct), ct;
    }, He = /* @__PURE__ */ new Set();
    for (const qe of he) if (qe) for (const Ce of qe) He.add(Ce);
    const Oe = 8;
    let Ze = -1, rt = Oe;
    for (let qe = 0; qe < ke.length; qe++) {
      if (!He.has(qe)) continue;
      const Ce = Te(qe);
      if (!Ce || Ce.z < -1 || Ce.z > 1) continue;
      const Ve = Ce.x - ge, Ge = Ce.y - ce, Fe = Math.sqrt(Ve * Ve + Ge * Ge);
      Fe < rt && (rt = Fe, Ze = qe);
    }
    const Xe = Na(), we = Za[Xe.dispUnit] ?? 1e3, Pe = Ya[Xe.forceUnit] ?? 1;
    if (Ze >= 0) {
      const qe = ke[Ze];
      let Ce = `Nodo ${Ze}
(${qe[0].toFixed(3)}, ${qe[1].toFixed(3)}, ${qe[2].toFixed(3)})`;
      const Ve = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ve == null ? void 0 : Ve.deformations) {
        const Ge = Ve.deformations.get(Ze);
        if (Ge && (Ce += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ce += `
Ux = ${bt(Ge[0] * we, 3)} ${Xe.dispUnit}`, Ce += `
Uy = ${bt(Ge[1] * we, 3)} ${Xe.dispUnit}`, Ce += `
Uz = ${bt(Ge[2] * we, 3)} ${Xe.dispUnit}`, (Math.abs(Ge[3]) > 1e-9 || Math.abs(Ge[4]) > 1e-9 || Math.abs(Ge[5]) > 1e-9) && (Ce += `
Rx = ${bt(Ge[3] * 1e3, 3)} mrad`, Ce += `
Ry = ${bt(Ge[4] * 1e3, 3)} mrad`, Ce += `
Rz = ${bt(Ge[5] * 1e3, 3)} mrad`)), Ve.reactions) {
          const Fe = Ve.reactions.get(Ze);
          Fe && (Math.abs(Fe[0]) > 1e-9 || Math.abs(Fe[1]) > 1e-9 || Math.abs(Fe[2]) > 1e-9 || Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Ce += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ce += `
Fx = ${bt(Fe[0] * Pe)} ${Xe.forceUnit}`, Ce += `
Fy = ${bt(Fe[1] * Pe)} ${Xe.forceUnit}`, Ce += `
Fz = ${bt(Fe[2] * Pe)} ${Xe.forceUnit}`, (Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Ce += `
Mx = ${bt(Fe[3] * Pe)} ${Xe.forceUnit}\xB7m`, Ce += `
My = ${bt(Fe[4] * Pe)} ${Xe.forceUnit}\xB7m`, Ce += `
Mz = ${bt(Fe[5] * Pe)} ${Xe.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ze, info: Ce };
    }
    const xt = 5;
    let Ne = -1, Je = xt, kt = "frame";
    for (let qe = 0; qe < he.length; qe++) {
      const Ce = he[qe];
      if (!(!Ce || Ce.length < 2)) {
        if (Ce.length === 2) {
          const Ve = Te(Ce[0]), Ge = Te(Ce[1]);
          if (!Ve || !Ge || Ve.z < -1 || Ve.z > 1 || Ge.z < -1 || Ge.z > 1) continue;
          const Fe = Wa(ge, ce, Ve.x, Ve.y, Ge.x, Ge.y);
          Fe < Je && (Je = Fe, Ne = qe, kt = "frame");
        } else if (Ce.length === 3 || Ce.length === 4) {
          const Ve = [];
          let Ge = true;
          for (const Fe of Ce) {
            const ct = Te(Fe);
            if (!ct || ct.z < -1 || ct.z > 1) {
              Ge = false;
              break;
            }
            Ve.push(ct);
          }
          if (!Ge) continue;
          if (Ja(ge, ce, Ve)) {
            const ct = Ve.reduce((ut, dt) => ut + dt.z, 0) / Ve.length * 1e-3;
            ct < Je && (Je = ct, Ne = qe, kt = "shell");
          }
        } else if (Ce.length === 8) {
          const Ve = [];
          let Ge = true;
          for (const Be of Ce) {
            const We = Te(Be);
            if (!We || We.z < -1 || We.z > 1) {
              Ge = false;
              break;
            }
            Ve.push(We);
          }
          if (!Ge) continue;
          const Fe = Math.min(...Ve.map((Be) => Be.x)), ct = Math.max(...Ve.map((Be) => Be.x)), ut = Math.min(...Ve.map((Be) => Be.y)), dt = Math.max(...Ve.map((Be) => Be.y));
          if (ge >= Fe && ge <= ct && ce >= ut && ce <= dt) {
            const We = Ve.reduce((wt, Ae) => wt + Ae.z, 0) / Ve.length * 1e-3;
            We < Je && (Je = We, Ne = qe, kt = "solid");
          }
        }
      }
    }
    if (Ne >= 0) {
      const qe = he[Ne];
      let Ve = `${kt === "frame" ? "Frame" : kt === "shell" ? "Shell" : "Solid"} ${Ne}`;
      const Ge = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, Fe = (_g = (_f = Ge == null ? void 0 : Ge.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, Ne);
      if (Fe) {
        Fe.name && (Ve += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (Ve += `
  Shape: ${Fe.shape}`);
        const ct = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), ut = ct ? 100 : 1e3, dt = ct ? "cm" : "mm", Be = (wt) => {
          const Ae = wt * ut;
          return Math.abs(Ae - Math.round(Ae)) < 0.05 ? `${Math.round(Ae)}` : `${Ae.toFixed(1)}`;
        }, We = [];
        if (Fe.D != null && We.push(`D=${Be(Fe.D)}`), Fe.B != null && We.push(`B=${Be(Fe.B)}`), Fe.TF != null && We.push(`TF=${Be(Fe.TF)}`), Fe.TW != null && We.push(`TW=${Be(Fe.TW)}`), Fe.t != null && We.push(`t=${Be(Fe.t)}`), We.length && (Ve += `
  Dim: ${We.join(" ")} ${dt}`), Fe.material) {
          let wt = Fe.material;
          Fe.fillMaterial && (wt += ` + FILL "${Fe.fillMaterial}"`), Ve += `
  Mat: ${wt}`;
        }
      } else {
        const ct = (_i = (_h = Ge == null ? void 0 : Ge.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, Ne), ut = (_k = (_j = Ge == null ? void 0 : Ge.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, Ne);
        ct ? (Ve += `
  ${ct}`, ut && !ct.includes(ut) && (Ve += `  (${ut})`)) : ut && (Ve += `
  Material: ${ut}`);
      }
      if (Ve += `
nodos: [${qe.join(", ")}]`, kt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const ct = e.mesh.analyzeOutputs.rawVal, ut = Ua[Xe.stressUnit] ?? 1, dt = [["bendingXX", "Mxx", Pe, `${Xe.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Pe, `${Xe.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Pe, `${Xe.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Pe, `${Xe.forceUnit}/m`], ["membraneYY", "Nyy", Pe, `${Xe.forceUnit}/m`], ["membraneXY", "Nxy", Pe, `${Xe.forceUnit}/m`], ["shearX", "Qx", Pe, `${Xe.forceUnit}/m`], ["shearY", "Qy", Pe, `${Xe.forceUnit}/m`], ["vonMises", "\u03C3VM", ut, Xe.stressUnit], ["pressure", "p", ut, Xe.stressUnit]], Be = [];
        for (const [We, wt, Ae, Mt] of dt) {
          const _t = ct == null ? void 0 : ct[We];
          if (_t && _t instanceof Map) {
            const Dt = _t.get(Ne);
            if (Dt != null) {
              if (typeof Dt == "number") Be.push(`${wt} = ${bt(Dt * Ae, 3)} ${Mt}`);
              else if (Array.isArray(Dt)) {
                let Et = Dt[0];
                for (const $t of Dt) Math.abs($t) > Math.abs(Et) && (Et = $t);
                Be.push(`${wt} = ${bt(Et * Ae, 3)} ${Mt}`);
              }
            }
          }
        }
        Be.length > 0 && (Ve += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Be.slice(0, 8).join(`
`));
      }
      if (kt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const ct = e.mesh.deformOutputs.rawVal, ut = e.mesh.elementInputs.rawVal, dt = ct == null ? void 0 : ct.deformations;
        if (dt && qe.length === 2) {
          const Be = dt.get(qe[0]), We = dt.get(qe[1]), wt = ke[qe[0]], Ae = ke[qe[1]];
          if (Be && We && wt && Ae) {
            const Mt = Ae[0] - wt[0], _t = Ae[1] - wt[1], Dt = Ae[2] - wt[2], Et = Math.sqrt(Mt * Mt + _t * _t + Dt * Dt);
            if (Et > 1e-9) {
              const $t = Mt / Et, nn = _t / Et, Ut = Dt / Et, gn = (We[0] - Be[0]) * $t + (We[1] - Be[1]) * nn + (We[2] - Be[2]) * Ut, Vt = ((_n = ut.elasticities) == null ? void 0 : _n.get(Ne)) ?? 0, on = ((_o = ut.areas) == null ? void 0 : _o.get(Ne)) ?? 0, vn = ((_p = ut.momentsOfInertiaY) == null ? void 0 : _p.get(Ne)) ?? 0, Ln = ((_q = ut.momentsOfInertiaZ) == null ? void 0 : _q.get(Ne)) ?? 0, so = ((_r = ut.torsionalConstants) == null ? void 0 : _r.get(Ne)) ?? 0, ao = ((_s2 = ut.shearModuli) == null ? void 0 : _s2.get(Ne)) ?? Vt / 2.6, sn = Vt * on * (gn / Et), In = (We[3] - Be[3]) * $t + (We[4] - Be[4]) * nn + (We[5] - Be[5]) * Ut, an = ao * so * (In / Et), Rn = We[4] - Be[4], Dn = We[5] - Be[5], bn = Vt * vn * Rn / Et, pn = Vt * Ln * Dn / Et;
              Ve += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ve += `
L = ${bt(Et, 3)} m`, Ve += `
\u0394L = ${bt(gn * we, 3)} ${Xe.dispUnit}`, Ve += `
\u03B5 = ${bt(gn / Et, 6)}`, Math.abs(sn) > 1e-6 && (Ve += `
N \u2248 ${bt(sn * Pe)} ${Xe.forceUnit}`), Math.abs(an) > 1e-6 && (Ve += `
T \u2248 ${bt(an * Pe)} ${Xe.forceUnit}\xB7m`), Math.abs(bn) > 1e-6 && (Ve += `
My \u2248 ${bt(bn * Pe)} ${Xe.forceUnit}\xB7m`), Math.abs(pn) > 1e-6 && (Ve += `
Mz \u2248 ${bt(pn * Pe)} ${Xe.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: kt, idx: Ne, info: Ve };
    }
    return null;
  }
  function N(P, Y, Q) {
    var _a2, _b, _c;
    if (u.visible = false, b.visible = false, S.visible = false, W.visible = false, ie.visible = false, !P || !e.mesh) {
      X.style.display = "none", e.render();
      return;
    }
    const K = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (P.type === "node") {
      const he = E(P.idx);
      if (he) {
        const De = e.derivedNodes.rawVal ?? [];
        let Te = 1;
        if (De.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Xe of De) for (let we = 0; we < 3; we++) Xe[we] < Ze[we] && (Ze[we] = Xe[we]), Xe[we] > rt[we] && (rt[we] = Xe[we]);
          Te = Math.max(rt[0] - Ze[0], rt[1] - Ze[1], rt[2] - Ze[2], 0.1);
        }
        const He = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Oe = 0.021 * Te * He;
        u.position.copy(he), u.scale.setScalar(Oe), u.visible = true;
      }
    } else if (P.type === "frame" && K) {
      const he = K[P.idx], De = E(he[0]), Te = E(he[1]);
      if (De && Te) {
        const He = De.clone().add(Te).multiplyScalar(0.5), Oe = Te.clone().sub(De), Ze = Oe.length(), we = e.getActiveCamera().position.distanceTo(He) * 35e-4;
        S.position.copy(He);
        const Pe = new k(0, 1, 0), xt = Pe.clone().cross(Oe).normalize(), Ne = Pe.angleTo(Oe);
        S.quaternion.setFromAxisAngle(xt, Ne), S.scale.set(we, Ze, we), S.visible = true;
      }
    } else if (P.type === "shell" && K) {
      const he = K[P.idx], De = [], Te = [];
      for (const He of he) {
        const Oe = E(He);
        if (!Oe) return;
        De.push(Oe.x, Oe.y, Oe.z);
      }
      he.length === 4 ? Te.push(0, 1, 2, 0, 2, 3) : he.length === 3 && Te.push(0, 1, 2), z.setAttribute("position", new Pt(De, 3)), z.setIndex(Te), z.computeVertexNormals(), W.visible = true;
    } else if (P.type === "solid" && K) {
      const he = K[P.idx], De = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Te = [];
      for (const [He, Oe] of De) {
        const Ze = E(he[He]), rt = E(he[Oe]);
        Ze && rt && Te.push(Ze.x, Ze.y, Ze.z, rt.x, rt.y, rt.z);
      }
      ue.setAttribute("position", new Pt(Te, 3)), ie.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      X.style.display = "none", e.render();
      return;
    }
    X.textContent = P.info, X.style.whiteSpace = "pre-line", X.style.display = "block";
    const ce = e.rendererElm.getBoundingClientRect(), ke = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? ce;
    X.style.left = `${Y - ke.left}px`, X.style.top = `${Q - ke.top}px`, e.render();
  }
  let V = "", $ = 0, ee = 0;
  const se = window.__hekatanHoverDebug ?? false, pe = (P) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const Y = C(P.clientX, P.clientY);
      if (se && ee < 5) {
        const K = e.derivedNodes.rawVal, ge = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${P.clientX}, ${P.clientY}) nodes=${(K == null ? void 0 : K.length) ?? 0} elems=${(ge == null ? void 0 : ge.length) ?? 0} hover=`, Y), ee++;
      }
      const Q = Y ? `${Y.type}:${Y.idx}` : "";
      if (Q !== V) V = Q, N(Y, P.clientX, P.clientY);
      else if (Y) {
        const K = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        X.style.left = `${P.clientX - K.left}px`, X.style.top = `${P.clientY - K.top}px`;
      }
    });
  };
  let ne = null;
  const B = () => {
    V = "", u.visible = false, b.visible = false, S.visible = false, W.visible = false, ie.visible = false, X.style.display = "none", e.render();
  }, fe = (P) => {
    const Y = e.rendererElm.getBoundingClientRect(), Q = P.clientX - Y.left, K = P.clientY - Y.top;
    (Q < -2 || K < -2 || Q > Y.width + 2 || K > Y.height + 2) && (ne && clearTimeout(ne), ne = window.setTimeout(B, 200));
  }, J = () => {
    ne && (clearTimeout(ne), ne = null);
  };
  e.rendererElm.addEventListener("pointermove", pe), e.rendererElm.addEventListener("pointerleave", fe), e.rendererElm.addEventListener("pointerenter", J);
  function ye() {
    var _a2, _b, _c;
    const P = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return P === "select" || P === "none" || !P;
  }
  let xe = null;
  e.rendererElm.addEventListener("pointerdown", (P) => {
    P.button === 0 && (xe = { x: P.clientX, y: P.clientY });
  }), e.rendererElm.addEventListener("pointerup", (P) => {
    if (P.button !== 0 || !xe) return;
    const Y = P.clientX - xe.x, Q = P.clientY - xe.y;
    if (xe = null, Y * Y + Q * Q > 9 || !ye()) return;
    const K = C(P.clientX, P.clientY);
    K ? (st({ type: K.type, idx: K.idx }, P.shiftKey), Ke()) : mt();
  }), window.addEventListener("keydown", (P) => {
    if (P.key !== "Escape" || !R.length) return;
    const Y = document.activeElement, Q = !!Y && (Y.id === "hk3-cmd-input" || Y.id === "hk-dyn-input") && Y.value === "";
    Y && (Y.tagName === "INPUT" || Y.tagName === "TEXTAREA" || Y.isContentEditable) && !Q || mt();
  }, { capture: true });
  function Ee() {
    for (const P of A.children.slice()) {
      A.remove(P);
      const Y = P.geometry;
      Y && Y !== r && Y !== D && Y.dispose();
    }
  }
  const Me = (P) => {
    var _a2;
    const Y = e.getActiveCamera(), Q = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return Y.isOrthographicCamera ? (Y.top - Y.bottom) / (Y.zoom || 1) / Q : 2 * Y.position.distanceTo(P) * Math.tan((Y.fov || 50) * Math.PI / 180 / 2) / Q;
  };
  function Le(P, Y) {
    var _a2, _b;
    const Q = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (P.type === "node") {
      const K = E(P.idx);
      if (!K) return;
      const ge = new lt(r, I);
      ge.position.copy(K), ge.scale.setScalar(Math.max(1e-4, 7 * Me(K))), ge.renderOrder = 101, A.add(ge);
    } else if (P.type === "frame" && Q) {
      const K = Q[P.idx], ge = E(K[0]), ce = E(K[1]);
      if (!ge || !ce) return;
      const ke = ge.clone().add(ce).multiplyScalar(0.5), he = ce.clone().sub(ge), De = he.length(), Te = e.getActiveCamera().position.distanceTo(ke), He = new lt(D, le);
      He.position.copy(ke);
      const Oe = new k(0, 1, 0);
      He.quaternion.setFromAxisAngle(Oe.clone().cross(he).normalize(), Oe.angleTo(he)), He.scale.set(Te * 35e-4, De, Te * 35e-4), He.renderOrder = 101, A.add(He);
    } else if (P.type === "shell" && Q) {
      const K = Q[P.idx], ge = [], ce = [];
      for (const De of K) {
        const Te = E(De);
        if (!Te) return;
        ge.push(Te.x, Te.y, Te.z);
      }
      K.length === 4 ? ce.push(0, 1, 2, 0, 2, 3) : K.length === 3 && ce.push(0, 1, 2);
      const ke = new ze();
      ke.setAttribute("position", new Pt(ge, 3)), ke.setIndex(ce), ke.computeVertexNormals();
      const he = new lt(ke, re);
      he.renderOrder = 101, A.add(he);
    } else if (P.type === "solid" && Q) {
      const K = Q[P.idx], ge = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ce = [];
      for (const [De, Te] of ge) {
        const He = E(K[De]), Oe = E(K[Te]);
        He && Oe && ce.push(He.x, He.y, He.z, Oe.x, Oe.y, Oe.z);
      }
      const ke = new ze();
      ke.setAttribute("position", new Pt(ce, 3));
      const he = new Wt(ke, ae);
      he.renderOrder = 101, A.add(he);
    }
  }
  function Ke() {
    if (Ee(), !R.length || !e.mesh) {
      e.render();
      return;
    }
    const P = e.derivedNodes.rawVal ?? [];
    if (P.length >= 2) {
      const Y = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
      for (const K of P) for (let ge = 0; ge < 3; ge++) K[ge] < Y[ge] && (Y[ge] = K[ge]), K[ge] > Q[ge] && (Q[ge] = K[ge]);
      Math.max(Q[0] - Y[0], Q[1] - Y[1], Q[2] - Y[2], 0.1);
    }
    for (const Y of R) Le(Y);
    e.render();
  }
  function st(P, Y) {
    const Q = R.findIndex((K) => K.type === P.type && K.idx === P.idx);
    Q >= 0 ? R.splice(Q, 1) : Y || R.push(P), R.length && R[R.length - 1];
  }
  function mt() {
    R.length = 0, Ke();
  }
  return j.derive(() => {
    e.derivedNodes.val, R.length && Ke();
  }), l;
}
function Wa(e, l, r, d, u, h) {
  const f = u - r, b = h - d, y = f * f + b * b;
  if (y < 1e-9) {
    const me = e - r, ie = l - d;
    return Math.sqrt(me * me + ie * ie);
  }
  let S = ((e - r) * f + (l - d) * b) / y;
  S = Math.max(0, Math.min(1, S));
  const z = r + S * f, x = d + S * b, W = e - z, ue = l - x;
  return Math.sqrt(W * W + ue * ue);
}
function Ja(e, l, r) {
  let d = false;
  for (let u = 0, h = r.length - 1; u < r.length; h = u++) {
    const f = r[u].x, b = r[u].y, y = r[h].x, S = r[h].y;
    b > l != S > l && e < (y - f) * (l - b) / (S - b + 1e-12) + f && (d = !d);
  }
  return d;
}
const Oa = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Qa = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, tn = 1e-3;
function En(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function ja(e, l) {
  const r = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < tn ? { plano: "XZ", en: e[1] } : r < tn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function ei(e, l) {
  var _a2, _b;
  let r = null, d = { plano: "XZ", en: 0 };
  const u = () => {
    var _a3, _b2;
    const D = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !D || D === "none" ? null : String(D).replace(/^contour:/, "");
  }, h = (D) => {
    var _a3, _b2;
    const re = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ae = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], R = /* @__PURE__ */ new Set();
    for (const A of ae) {
      if (A.length !== 2) continue;
      const X = re[A[0]], E = re[A[1]];
      if (!X || !E) continue;
      const C = En(X, D), N = En(E, D);
      Math.abs(C.fuera - N.fuera) < tn && R.add(Math.round(C.fuera * 1e3) / 1e3);
    }
    return [...R].sort((A, X) => A - X);
  };
  function f(D) {
    var _a3, _b2;
    if (D == null ? void 0 : D.plano) d = { plano: D.plano, en: D.en ?? h(D.plano)[0] ?? 0 };
    else {
      const ae = [...window.__hekatanModelSelection ?? []].reverse().find((X) => X.type === "frame"), R = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], A = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      ae && A[ae.idx] && R[A[ae.idx][0]] && R[A[ae.idx][1]] ? d = ja(R[A[ae.idx][0]], R[A[ae.idx][1]]) : d = { plano: "XZ", en: h("XZ")[0] ?? 0 };
    }
    r || b(), r.hidden = false, y();
  }
  function b() {
    r = document.createElement("div"), r.id = "hk-diagrama-2d", r.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), r.innerHTML = `
      <div class="hk-d2-bar" style="display:flex;align-items:center;gap:10px;padding:7px 10px;
           background:#141a24;border-bottom:1px solid #2f3b50;cursor:move;user-select:none">
        <b style="color:#e6c463;white-space:nowrap">\u{1F4D0} Diagrama 2D</b>
        <span class="hk-d2-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span>
        <label style="margin-left:auto;white-space:nowrap">plano
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
    const D = r.querySelector(".hk-d2-plano"), re = r.querySelector(".hk-d2-en");
    D.addEventListener("change", () => {
      d = { plano: D.value, en: h(D.value)[0] ?? 0 }, y();
    }), re.addEventListener("change", () => {
      d.en = Number(re.value), y();
    });
    const ae = (X) => {
      const E = h(d.plano), C = E.findIndex((V) => Math.abs(V - d.en) < tn), N = Math.max(0, Math.min(E.length - 1, (C < 0 ? 0 : C) + X));
      E.length && (d.en = E[N], y());
    };
    r.querySelector(".hk-d2-ant").addEventListener("click", () => ae(-1)), r.querySelector(".hk-d2-sig").addEventListener("click", () => ae(1));
    const R = r.querySelector(".hk-d2-bar");
    let A = null;
    R.addEventListener("pointerdown", (X) => {
      if (X.target.closest("select,button")) return;
      const E = r.getBoundingClientRect();
      A = { x: X.clientX, y: X.clientY, l: E.left, t: E.top }, r.style.transform = "none", r.style.left = E.left + "px", r.style.top = E.top + "px";
    }), window.addEventListener("pointermove", (X) => {
      !A || !r || (r.style.left = A.l + X.clientX - A.x + "px", r.style.top = A.t + X.clientY - A.y + "px");
    }), window.addEventListener("pointerup", () => {
      A = null;
    }), new ResizeObserver(() => {
      r && !r.hidden && y();
    }).observe(r);
  }
  function y() {
    var _a3, _b2, _c, _d, _e, _f, _g, _h;
    if (!r || r.hidden) return;
    const D = new Set(x && !x.hidden && W >= 0 ? me(W) : []), re = r.querySelector(".hk-d2-svg"), ae = r.querySelector(".hk-d2-tit"), R = r.querySelector(".hk-d2-pie"), A = r.querySelector(".hk-d2-plano"), X = r.querySelector(".hk-d2-en");
    A.value = d.plano;
    const E = h(d.plano), C = d.plano === "XZ" ? "y" : d.plano === "YZ" ? "x" : "z", N = d.plano === "XY" ? "Planta" : "P\xF3rtico";
    X.innerHTML = E.map((we, Pe) => `<option value="${we}" ${Math.abs(we - d.en) < tn ? "selected" : ""}>${N} ${Pe + 1} \xB7 ${C} = ${we.toFixed(2)} m</option>`).join("");
    const V = u(), $ = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ee = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], se = V ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[V] : null;
    re.innerHTML = "";
    const pe = re.clientWidth || 880, ne = re.clientHeight || 480, B = [];
    if (ee.forEach((we, Pe) => {
      if (we.length !== 2) return;
      const xt = $[we[0]], Ne = $[we[1]];
      if (!xt || !Ne) return;
      const Je = En(xt, d.plano), kt = En(Ne, d.plano);
      Math.abs(Je.fuera - d.en) < tn && Math.abs(kt.fuera - d.en) < tn && B.push({ i: Pe, a: Je, b: kt });
    }), !B.length) {
      R.textContent = "No hay barras en este plano.", ae.textContent = "";
      return;
    }
    let fe = 1 / 0, J = -1 / 0, ye = 1 / 0, xe = -1 / 0;
    for (const we of B) for (const Pe of [we.a, we.b]) fe = Math.min(fe, Pe.u), J = Math.max(J, Pe.u), ye = Math.min(ye, Pe.v), xe = Math.max(xe, Pe.v);
    const Ee = J - fe || 1, Me = xe - ye || 1, Le = 0.12 * Math.max(Ee, Me), Ke = 46, st = Math.min((pe - 2 * Ke) / (Ee + 2 * Le), (ne - 2 * Ke) / (Me + 2 * Le)), mt = (pe - Ee * st) / 2, P = (ne - Me * st) / 2, Y = (we) => mt + (we - fe) * st, Q = (we) => ne - (P + (we - ye) * st), K = "http://www.w3.org/2000/svg", ge = (we, Pe, xt) => {
      const Ne = document.createElementNS(K, we);
      for (const Je in Pe) Ne.setAttribute(Je, String(Pe[Je]));
      return xt != null && (Ne.textContent = xt), re.appendChild(Ne), Ne;
    }, ce = /* @__PURE__ */ new Map();
    for (const we of B) {
      const Pe = ((_h = (_g = (_f = (_e = e.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, we.i)) ?? 0, xt = En(zs(V ?? "normals", Cs($[ee[we.i][0]], $[ee[we.i][1]], Pe)), d.plano), Ne = Math.hypot(xt.u, xt.v);
      ce.set(we.i, Ne > 0.3 ? [xt.u / Ne, -xt.v / Ne] : null);
    }
    const ke = B.filter((we) => !ce.get(we.i)).length;
    let he = 0;
    if (se) for (const we of B) {
      if (!ce.get(we.i)) continue;
      const Pe = se instanceof Map ? se.get(we.i) : se[we.i];
      Pe && (he = Math.max(he, Math.abs(Pe[0] ?? 0), Math.abs(Pe[1] ?? 0)));
    }
    const De = 0.12 * Math.max(Ee, Me) * st, Te = he > 0 ? De / he : 0, He = V === "bendingsY" || V === "bendingsZ", Oe = (we) => Math.abs(we) >= 100 ? we.toFixed(1) : Math.abs(we) >= 10 ? we.toFixed(2) : we.toFixed(3), Ze = [];
    for (const we of B) {
      const Pe = Y(we.a.u), xt = Q(we.a.v), Ne = Y(we.b.u), Je = Q(we.b.v), kt = ce.get(we.i), [qe, Ce] = kt ?? [0, 0], Ve = se && kt ? se instanceof Map ? se.get(we.i) : se[we.i] : null, [Ge, Fe] = Ve ? Vo(V, Ve) : [0, 0];
      if (Ve && Te > 0) {
        const Be = [Pe + qe * Ge * Te * 1, xt + Ce * Ge * Te * 1], We = [Ne + qe * Fe * Te * 1, Je + Ce * Fe * Te * 1], Mt = Ge + Fe >= 0 ? "#3fa7d6" : "#d9534f";
        ge("polygon", { points: `${Pe},${xt} ${Be[0]},${Be[1]} ${We[0]},${We[1]} ${Ne},${Je}`, fill: Mt, "fill-opacity": 0.38, stroke: Mt, "stroke-width": 1.2 }), Ze.push({ x: Be[0] + qe * 12, y: Be[1] + Ce * 12, t: Oe(Ge), peso: Math.abs(Ge) }), Ze.push({ x: We[0] + qe * 12, y: We[1] + Ce * 12, t: Oe(Fe), peso: Math.abs(Fe) });
      }
      ge("line", { x1: Pe, y1: xt, x2: Ne, y2: Je, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), D.has(we.i) && ge("line", { x1: Pe, y1: xt, x2: Ne, y2: Je, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const ct = ge("line", { x1: Pe, y1: xt, x2: Ne, y2: Je, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      ct.addEventListener("click", () => ie(we.i));
      const ut = document.createElementNS(K, "title");
      ut.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", ct.appendChild(ut);
    }
    for (const we of B) for (const Pe of [we.a, we.b]) d.plano !== "XY" && Math.abs(Pe.v - ye) < tn && ge("rect", { x: Y(Pe.u) - 6, y: Q(Pe.v), width: 12, height: 7, fill: "#b03a3a" });
    const rt = [];
    Ze.sort((we, Pe) => Pe.peso - we.peso);
    for (const we of Ze) we.peso < 0.02 * he || rt.some((Pe) => Math.hypot(Pe.x - we.x, Pe.y - we.y) < 34) || (rt.push(we), ge("text", { x: we.x, y: we.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, we.t));
    const Xe = V ? Oa[V] ?? V : "sin resultado";
    ae.textContent = `${Xe} \xB7 ${d.plano === "XY" ? "planta" : "alzado"} ${d.plano} en ${C} = ${d.en.toFixed(2)} m`, R.textContent = V ? `${B.length} barras en el plano \xB7 m\xE1ximo ${Oe(he)} ${Qa[V] ?? ""}` + (He ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ke ? ` \xB7 ${ke} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
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
  let z = null;
  setInterval(() => {
    var _a3, _b2;
    const D = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, re = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, ae = [D, re];
    if (!(z && z[0] === D && z[1] === re)) {
      z = ae, S();
      try {
        le();
      } catch {
      }
    }
  }, 400);
  let x = null, W = -1, ue = "12";
  function me(D) {
    var _a3, _b2;
    const re = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ae = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], R = /* @__PURE__ */ new Map();
    ae.forEach((C, N) => {
      if (C.length === 2) for (const V of C) R.has(V) || R.set(V, []), R.get(V).push(N);
    });
    const A = (C) => {
      const N = re[ae[C][0]], V = re[ae[C][1]], $ = [V[0] - N[0], V[1] - N[1], V[2] - N[2]], ee = Math.hypot($[0], $[1], $[2]) || 1;
      return $.map((se) => se / ee);
    }, X = (C, N) => {
      const V = A(C), $ = A(N);
      return Math.abs(V[0] * $[0] + V[1] * $[1] + V[2] * $[2]) > 0.9999;
    }, E = [D];
    for (const C of [0, 1]) {
      let N = D, V = ae[D][C];
      for (let $ = 0; $ < 500; $++) {
        const ee = (R.get(V) ?? []).filter((pe) => pe !== N);
        if (ee.length !== 1 || !X(N, ee[0])) break;
        const se = ee[0];
        C === 0 ? E.unshift(se) : E.push(se), V = ae[se][0] === V ? ae[se][1] : ae[se][0], N = se;
      }
    }
    return E;
  }
  function ie(D) {
    if (D == null) {
      const ae = [...window.__hekatanModelSelection ?? []].reverse().find((R) => R.type === "frame");
      if (!ae) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      D = ae.idx;
    }
    W = D, x || (x = document.createElement("div"), x.id = "hk-diagrama-barra", x.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), x.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(x), x.querySelector(".hk-b-x").addEventListener("click", () => {
      x.hidden = true, I(), y();
    }), x.querySelector(".hk-b-pl").addEventListener("change", (re) => {
      ue = re.target.value, le();
    })), x.hidden = false, I(), le(), y();
  }
  function I() {
    if (!r || !x) return;
    const D = window.innerWidth, re = Math.min(560, Math.round(D * 0.4));
    x.style.width = re + "px", !x.hidden && !r.hidden ? (r.style.transform = "none", r.style.left = "12px", r.style.width = D - re - 36 + "px", x.style.top = r.getBoundingClientRect().top + "px") : r.hidden || (r.style.left = "50%", r.style.transform = "translateX(-50%)", r.style.width = "min(900px,92vw)");
  }
  function le() {
    var _a3, _b2, _c;
    if (!x || x.hidden || W < 0) return;
    const D = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], re = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], ae = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!re[W]) return;
    const R = me(W), A = [];
    let X = 0, E = -1;
    R.forEach((J, ye) => {
      const [xe, Ee] = re[J], Me = ye === 0 ? R.length > 1 && re[R[1]].includes(xe) : xe !== E, Le = Me ? Ee : xe, Ke = Me ? xe : Ee, st = Math.hypot(D[Ke][0] - D[Le][0], D[Ke][1] - D[Le][1], D[Ke][2] - D[Le][2]);
      A.push({ x: X, e: J, fin: Me ? 1 : 0 }), X += st, A.push({ x: X, e: J, fin: Me ? 0 : 1 }), E = Ke;
    });
    const C = X, N = (J, ye) => {
      const xe = ae[J], Ee = xe ? xe instanceof Map ? xe.get(ye.e) : xe[ye.e] : null;
      return Ee ? Vo(J, Ee)[ye.fin] : 0;
    }, V = D[re[R[0]][0]], $ = (J) => J.toFixed(2);
    x.querySelector(".hk-b-tit").textContent = "L = " + C.toFixed(2) + " m \xB7 " + R.length + " tramo(s) \xB7 desde (" + $(V[0]) + ", " + $(V[1]) + ", " + $(V[2]) + ")";
    const ee = ue === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], se = x.querySelector(".hk-b-cuerpo");
    se.innerHTML = "";
    const pe = Math.max(300, se.clientWidth), ne = 124, B = 46, fe = (ne - 14) / 2;
    for (const [J, ye, xe, Ee] of ee) {
      const Me = A.map((he) => N(J, he)), Le = Math.max(...Me), Ke = Math.min(...Me), st = Math.max(Math.abs(Le), Math.abs(Ke)) || 1, mt = (he) => B + he / (C || 1) * (pe - 2 * B), P = (he) => fe + (Ee ? 1 : -1) * (he / st) * (fe - 16), Y = (he) => Math.abs(he) >= 100 ? he.toFixed(1) : Math.abs(he) >= 10 ? he.toFixed(2) : he.toFixed(3);
      let Q = mt(0) + "," + fe + " ";
      A.forEach((he, De) => {
        Q += mt(he.x) + "," + P(Me[De]) + " ";
      }), Q += mt(C) + "," + fe;
      const K = Me.indexOf(Le), ge = Me.indexOf(Ke), ce = (he, De) => {
        const Te = P(Me[he]) + (P(Me[he]) < fe ? -5 : 13);
        return '<text x="' + mt(A[he].x) + '" y="' + Te + '" text-anchor="middle" fill="' + De + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Y(Me[he]) + "</text>";
      }, ke = Ee ? "#d9534f" : "#3fa7d6";
      se.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + ye + ' <span style="color:#6f7d90;font-weight:400">(' + xe + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Y(Le) + " \xB7 m\xEDn " + Y(Ke) + (Ee ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + pe + '" height="' + ne + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + B + '" y1="' + fe + '" x2="' + (pe - B) + '" y2="' + fe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Q + '" fill="' + ke + '" fill-opacity=".35" stroke="' + ke + '" stroke-width="1.4"/>' + ce(0, "#f2f5fa") + ce(A.length - 1, "#f2f5fa") + (K > 0 && K < A.length - 1 ? ce(K, "#8fd3ff") : "") + (ge > 0 && ge < A.length - 1 && ge !== K ? ce(ge, "#ff9f9a") : "") + '<text x="' + B + '" y="' + (ne - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (pe - B) + '" y="' + (ne - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + C.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = ie, window.__hekatanDiagrama2D = f, { abrir: f, abrirBarra: ie };
}
function ws(e, l = 8) {
  const r = document.createElement("div");
  r.id = "legend", r.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    j.derive(() => {
      oo.val, r.style.background = pa();
    });
  });
  const d = document.createElement("div");
  d.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", r.appendChild(d), setTimeout(() => {
    j.derive(() => {
      d.textContent = To.val ? `[${To.val}]` : "";
    });
  });
  const u = Array.from({ length: l + 1 }, (y, S) => S / l).reverse();
  let h, f;
  u.forEach((y, S) => {
    h = document.createElement("div"), h.id = `marker-${S}`, h.className = "marker", h.style.marginTop = S == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", f = document.createElement("p"), f.id = `marker-text-${S}`, h.append(f), r.append(h);
  });
  const b = [];
  return r.querySelectorAll("p").forEach((y) => b.push(y)), setTimeout(() => {
    j.derive(() => {
      u.forEach((y, S) => {
        const z = b[S];
        z && (z.innerText = ti(e.val, y).toString());
      });
    });
  }), r;
}
function ti(e, l) {
  const r = $n.val;
  if (r) return ys(r[0] + l * (r[1] - r[0]));
  const d = e.filter((f) => Number.isFinite(f));
  if (d.length === 0) return "0";
  const [u, h] = $o(d);
  return ys(u + l * (h - u));
}
function ys(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function fi({ mesh: e, settingsObj: l, drawingObj: r, objects3D: d, solids: u }) {
  ra.DEFAULT_UP = new k(0, 0, 1);
  const h = document.createElement("div"), f = new sa(), b = new aa(45, 1, 0.1, 2 * 1e6), y = new ia(-10, 10, 10, -10, -1e3, 2e6);
  let S = b;
  const z = new la({ antialias: true });
  z.localClippingEnabled = true;
  const x = new us(b, z.domElement);
  x.enableDamping = true, x.dampingFactor = 0.1, x.screenSpacePanning = true, x.zoomSpeed = 0.8, x.panSpeed = 1.2, x.rotateSpeed = 0.9, x.keyPanSpeed = 12, x.listenToKeyEvents(window), x.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, z.domElement.addEventListener("wheel", (P) => {
    if (!P.ctrlKey && Math.abs(P.deltaX) > Math.abs(P.deltaY) * 1.5) {
      P.preventDefault();
      const Y = x.target, Q = new k().subVectors(b.position, Y), K = new k();
      K.crossVectors(b.up, Q).normalize();
      const ce = Q.length() * 1e-3 * x.panSpeed;
      Y.addScaledVector(K, P.deltaX * ce), b.position.addScaledVector(K, P.deltaX * ce), x.update();
    }
  }, { passive: false });
  const W = new Po(new k(-1, 0, 0), 0), ue = new Po(new k(0, -1, 0), 0), me = new Po(new k(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function ie() {
    const P = window.__hekatanClip, Y = [];
    P.enableX && (W.normal.set(P.invertX ? 1 : -1, 0, 0), W.constant = P.invertX ? -P.posX : P.posX, Y.push(W)), P.enableY && (ue.normal.set(0, P.invertY ? 1 : -1, 0), ue.constant = P.invertY ? -P.posY : P.posY, Y.push(ue)), P.enableZ && (me.normal.set(0, 0, P.invertZ ? 1 : -1), me.constant = P.invertZ ? -P.posZ : P.posZ, Y.push(me)), z.clippingPlanes = Y, f.traverse((K) => {
      const ge = K;
      if (ge.material) {
        const ce = Array.isArray(ge.material) ? ge.material : [ge.material];
        for (const ke of ce) ke.clippingPlanes = Y, ke.needsUpdate = true;
      }
    });
    const Q = window.__hekatanPanes ?? [];
    for (const K of Q) try {
      K && typeof K.refresh == "function" && K.refresh();
    } catch {
    }
    z.render(f, S);
  }
  ie(), window.__hekatanClipApply = ie;
  const I = ha(l), le = j.derive(() => Math.pow(10, I.displayScale.val / 10)), D = ni(e, I), re = () => {
    const P = [];
    return I.gridXY.rawVal && P.push("xy"), I.gridXZ.rawVal && P.push("xz"), I.gridYZ.rawVal && P.push("yz"), P;
  }, ae = () => {
    const P = I.gridStep.rawVal, Y = Math.max(P, I.gridMajor.rawVal);
    return { planes: re(), majorStep: Y, minorStep: P };
  };
  let R = zo(I.gridSize.rawVal, ae());
  R.visible = I.gridVisible.rawVal, window.__hekatanSnap2D = I.cursorSnap.rawVal;
  const A = () => {
    const P = Math.max(0, Math.min(1, I.gridOpacity.rawVal));
    R.traverse((Y) => {
      const Q = Y.material;
      if (!Q || !("opacity" in Q)) return;
      const K = Y.name ?? "";
      let ge = 0.55;
      K.includes("border") ? ge = 1 : K.includes("major") && (ge = 0.95), Q.opacity = P * ge;
    });
  };
  A(), h.appendChild(fa(I, e, u)), h.setAttribute("id", "viewer"), h.appendChild(z.domElement), z.setPixelRatio(window.devicePixelRatio);
  const X = dn();
  z.setClearColor(X.background, 1);
  const E = I.gridSize.rawVal, C = E * 0.5 + E * 0.5 / Math.tan(45 * 0.5);
  b.position.set(0, 0, C), b.up.set(0, 1, 0), x.target.set(0, 0, 0), x.minDistance = 0.1, x.maxDistance = 1e4, h.__settings = I, x.zoomSpeed = 1, x._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, x.update();
  let N = hs(I.gridSize.rawVal, I.flipAxes.rawVal);
  f.add(R, N), j.derive(() => {
    window.__hekatanGridPlaneXY = I.gridXY.val, window.__hekatanGridPlaneXZ = I.gridXZ.val, window.__hekatanGridPlaneYZ = I.gridYZ.val;
  });
  let V = true;
  j.derive(() => {
    const P = I.gridVisible.val;
    if (V) {
      V = false;
      return;
    }
    R.visible = P, J();
  });
  let $ = true;
  j.derive(() => {
    if (I.gridOpacity.val, $) {
      $ = false;
      return;
    }
    A(), J();
  }), j.derive(() => {
    const P = I.cursorSnap.val;
    window.__hekatanSnap2D = P;
  });
  let ee = true;
  j.derive(() => {
    var _a2, _b, _c;
    const P = I.gridSize.val, Y = I.flipAxes.val;
    if (I.gridXY.val, I.gridXZ.val, I.gridYZ.val, I.gridStep.val, I.gridMajor.val, ee) {
      ee = false;
      return;
    }
    f.remove(R), (_a2 = R.traverse) == null ? void 0 : _a2.call(R, (ce) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), R = zo(P, ae()), R.visible = I.gridVisible.rawVal, f.add(R), A(), f.remove(N), N.traverse((ce) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), N = hs(P, Y), f.add(N);
    const Q = P * 0.5 + P * 0.5 / Math.tan(45 * 0.5);
    b.position.distanceTo(x.target);
    const K = Math.abs(b.position.x) < 0.1 && Math.abs(b.position.y) < 0.1 && b.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (K ? b.position.set(0, 0, Q) : b.position.set(0.5 * P, -Q, 0.5 * P), x.target.set(0, 0, 0)), x.minDistance = Math.max(0.05, P * 0.01), x.maxDistance = Math.max(50, P * 50), x.update(), J();
  }), new ResizeObserver((P) => {
    var _a2, _b;
    for (const Y of P) {
      const Q = (_a2 = Y.target) == null ? void 0 : _a2.clientWidth, K = (_b = Y.target) == null ? void 0 : _b.clientHeight;
      if (Q === 0 || K === 0) continue;
      const ce = (pe ? Q / 2 : Q) / K;
      b.aspect = ce, b.updateProjectionMatrix();
      const ke = y.top;
      if (y.left = -ke * ce, y.right = ke * ce, y.updateProjectionMatrix(), ne && ne.isPerspectiveCamera) ne.aspect = ce, ne.updateProjectionMatrix();
      else if (ne && ne.isOrthographicCamera) {
        const he = ne, De = he.top;
        he.left = -De * ce, he.right = De * ce, he.updateProjectionMatrix();
      }
      z.setSize(Q, K), J();
    }
  }).observe(h), x.addEventListener("change", J), j.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, I.displayScale.val, I.nodes.val, I.elements.val, (_g = I.edges) == null ? void 0 : _g.val, I.elemColumns.val, I.elemBeams.val, I.nodesIndexes.val, I.elementsIndexes.val, I.orientations.val, I.sections.val, I.secColumns.val, I.secBeams.val, I.secFloor.val, I.supports.val, I.loads.val, I.deformedShape.val, I.nodeResults.val, I.frameResults.val, I.shellResults.val, (_h = I.solidResults) == null ? void 0 : _h.val, (_i = I.extruded) == null ? void 0 : _i.val, setTimeout(J);
  });
  let pe = false, ne = null, B = null, fe = false;
  function J() {
    const P = h.clientWidth || 1, Y = h.clientHeight || 1;
    if (!pe || !ne) {
      z.setScissorTest(false), z.setViewport(0, 0, P, Y), z.render(f, S);
      return;
    }
    const Q = P / 2;
    z.setScissorTest(true), z.setViewport(0, 0, Q, Y), z.setScissor(0, 0, Q, Y), z.render(f, S), z.setViewport(Q, 0, Q, Y), z.setScissor(Q, 0, Q, Y), z.render(f, ne), z.setScissorTest(false);
  }
  function ye(P) {
    S = P, x.object = P, x.update(), J();
  }
  function xe(P, Y) {
    pe = P, Y && (ne = Y);
    const Q = h.clientWidth || 1, K = h.clientHeight || 1, ce = (P ? Q / 2 : Q) / K;
    b.isPerspectiveCamera && (b.aspect = ce, b.updateProjectionMatrix());
    const ke = y.top;
    if (y.left = -ke * ce, y.right = ke * ce, y.updateProjectionMatrix(), P && ne) {
      if (B ? (B.object = ne, B.update()) : (B = new us(ne, z.domElement), B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, B.target.copy(x.target), B.addEventListener("change", J), B.enabled = false), !fe) {
        const he = (De) => {
          if (!pe || !B) return;
          const Te = z.domElement.getBoundingClientRect(), He = De.clientX - Te.left, Oe = Te.width / 2, Ze = He >= Oe;
          x.enabled = !Ze, B.enabled = Ze;
        };
        z.domElement.addEventListener("pointerdown", he, true), z.domElement.addEventListener("wheel", he, { capture: true, passive: true }), fe = true;
      }
    } else P || (x.enabled = true, B && (B.enabled = false));
    h.__splitMode = P, window.__hekatanSplitMode = P, window.__hekatanSplitCamera = P ? ne : null, J();
  }
  if (e) {
    f.add(ma(I, D, le), ca(e, I, D), xa(I, D, le), ga(e, I, D, le), wa(e, I, D, le), ya(e, I, D, le), Ma(e, I, D, le), ka(e, I, D, le), za(e, I, D), Va(e, I, D, le), Fa(e, I, D, le)), window.__hekatanDiagrama2D || (ei(e, I), z.domElement.addEventListener("dblclick", () => {
      var _a2;
      const he = (_a2 = I.frameResults) == null ? void 0 : _a2.rawVal;
      !he || he === "none" || !(window.__hekatanModelSelection ?? []).some((Te) => Te.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const P = Ha({ scene: f, rendererElm: z.domElement, getActiveCamera: () => S, derivedNodes: D, derivedDisplayScale: le, mesh: e, settings: I, render: J });
    f.add(P);
    const Y = ri(e, I), Q = La(e, I, D, Y), K = ws(Y);
    f.add(Q), h.appendChild(K);
    const ge = Xa(e, I, D);
    f.add(ge);
    const ce = ge.__colorMapValues, ke = ws(ce);
    ke.id = "frame-legend", h.appendChild(ke), j.derive(() => {
      var _a2;
      const he = I.shellResults.val != "none", De = (((_a2 = I.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Te = he || De, He = I.frameResults.val.startsWith("contour:"), Oe = Y.val.some((Ze) => Number.isFinite(Ze));
      K.hidden = !Te || !Oe, Q.visible = Te, ke.hidden = !He;
    });
  }
  if (u) {
    const P = new bs(16777215, 0.5);
    f.add(P);
    const Y = new to(16777215, 0.5);
    Y.position.set(30, 25, -10), Y.shadow.mapSize.width = 1024, Y.shadow.mapSize.height = 1024, f.add(Y);
    const Q = 10;
    Y.shadow.camera.left = -Q, Y.shadow.camera.right = Q, Y.shadow.camera.top = Q, Y.shadow.camera.bottom = -Q, Y.shadow.camera.far = 1e3;
    const K = new to(16777215, 0.5);
    K.color.setHSL(11, 43, 96), K.position.set(-10, 0, 30), f.add(K), j.derive(() => {
      (u == null ? void 0 : u.val.length) && (f.remove(...u.oldVal), f.add(...u.rawVal), J());
    }), j.derive(() => {
      u.rawVal.forEach((ge) => ge.visible = I.solids.val), J();
    });
  }
  if (d) {
    const P = [], Y = (K) => {
      var _a2;
      return ((_a2 = K == null ? void 0 : K.userData) == null ? void 0 : _a2.isCota) ? I.showCotas.val : I.custom3D.val;
    }, Q = () => {
      for (const K of P) K.visible = Y(K);
      J();
    };
    j.derive(() => {
      const K = d.val;
      P.length && (f.remove(...P), P.length = 0), K.length && (f.add(...K), P.push(...K), Q()), J();
    }), j.derive(() => {
      I.custom3D.val, Q();
    }), j.derive(() => {
      I.showCotas.val, Q();
    });
  }
  r && Ta({ drawingObj: r, gridObj: R, scene: f, getActiveCamera: () => S, controls: x, gridSize: E, derivedDisplayScale: le, rendererElm: z.domElement, viewerRender: J }), gs((P, Y) => {
    var _a2;
    z.setClearColor(Y.background, 1), f.remove(R), (_a2 = R.traverse) == null ? void 0 : _a2.call(R, (Q) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Q.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Q.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), R = zo(I.gridSize.rawVal, { planes: re() }), f.add(R), h.style.setProperty("--awatif-legend-color", Y.legendMarker), J();
  });
  const Ee = { scene: f, perspCamera: b, orthoCamera: y, get camera() {
    return S;
  }, controls: x, renderer: z, rendererElm: z.domElement, render: J, setActiveCamera: ye, setSplitMode: xe, get splitMode() {
    return pe;
  }, get splitCamera() {
    return ne;
  }, settings: I };
  h.__ctx = Ee;
  const Me = document.createElement("div");
  Me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Le = (P, Y, Q) => {
    const K = document.createElement("button");
    return K.textContent = P, K.title = Y, K.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), K.onmouseenter = () => {
      K.style.background = "rgba(70,70,70,0.9)";
    }, K.onmouseleave = () => {
      K.style.background = "rgba(40,40,40,0.85)";
    }, K.onclick = (ge) => {
      ge.preventDefault(), Q();
    }, K;
  }, Ke = (P, Y) => {
    const Q = x.target, K = new k().subVectors(S.position, Q), ge = K.length(), ce = new k(), ke = new k();
    ce.crossVectors(S.up, K).normalize(), ke.copy(S.up).normalize();
    const he = ge * 0.05;
    Q.addScaledVector(ce, -P * he), Q.addScaledVector(ke, Y * he), S.position.addScaledVector(ce, -P * he), S.position.addScaledVector(ke, Y * he), x.update(), J();
  }, st = (P) => {
    const Y = new k().subVectors(S.position, x.target);
    Y.multiplyScalar(P), S.position.copy(x.target).add(Y), x.update(), J();
  }, mt = () => {
    const P = document.createElement("div");
    return P.style.cssText = "width:32px;height:32px;", P;
  };
  return Me.append(mt()), Me.append(Le("\u2191", "Pan arriba", () => Ke(0, 1))), Me.append(Le("\u2295", "Zoom in", () => st(0.85))), Me.append(Le("\u2190", "Pan izquierda", () => Ke(-1, 0))), Me.append(Le("\u2302", "Reset vista", () => {
    x.reset(), J();
  })), Me.append(Le("\u2192", "Pan derecha", () => Ke(1, 0))), Me.append(Le("\u2296", "Zoom out", () => st(1.18))), Me.append(Le("\u2193", "Pan abajo", () => Ke(0, -1))), Me.append(mt()), getComputedStyle(h).position === "static" && (h.style.position = "relative"), h.appendChild(Me), h;
}
function ni(e, l) {
  return j.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const r = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], d = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!d || r.length === 0) return r;
    const u = l.deformScale.val, h = l.deformScale.val * l.deformScaleZ.val, f = Number.isFinite(u) ? u : 1, b = Number.isFinite(h) ? h : 1;
    return r.map((y, S) => {
      var _a3;
      const z = ((_a3 = d.get(S)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], x = Number.isFinite(z[0]) ? z[0] : 0, W = Number.isFinite(z[1]) ? z[1] : 0, ue = Number.isFinite(z[2]) ? z[2] : 0;
      return [y[0] + x * f, y[1] + W * f, y[2] + ue * b];
    });
  });
}
const $n = j.state(null), To = j.state(""), oi = j.state("kN"), si = j.state("mm"), ai = j.state("kN/m\xB2"), ii = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, xs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, li = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ri(e, l) {
  const r = j.state([]);
  let d;
  return ((u) => {
    u.bendingXX = "bendingXX", u.bendingYY = "bendingYY", u.bendingXY = "bendingXY", u.membraneXX = "membraneXX", u.membraneYY = "membraneYY", u.membraneXY = "membraneXY", u.tranverseShearX = "tranverseShearX", u.tranverseShearY = "tranverseShearY", u.membranePrincipalMax = "membranePrincipalMax", u.membranePrincipalMin = "membranePrincipalMin", u.bendingPrincipalMax = "bendingPrincipalMax", u.bendingPrincipalMin = "bendingPrincipalMin", u.transverseShearMax = "transverseShearMax", u.vonMises = "vonMises", u.pressure = "pressure", u.displacementX = "displacementX", u.displacementY = "displacementY", u.displacementZ = "displacementZ";
  })(d || (d = {})), j.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), me = (Y, Q) => {
      Y == null ? void 0 : Y.forEach((K, ge) => {
        const ce = e.elements.val[ge];
        if (ce) for (let ke = 0; ke < ce.length; ke++) Q.set(ce[ke], [K[ke] ?? K[0]]);
      });
    };
    me((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, u), me((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, h), me((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, f), me((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, b), me((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), me((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, S), me((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, z), me((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, x), me((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, W), me((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, ue);
    const ie = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), ae = (Y, Q, K, ge, ce) => {
      Y.forEach((ke, he) => {
        var _a3, _b2;
        const De = ke[0] ?? 0, Te = ((_a3 = Q.get(he)) == null ? void 0 : _a3[0]) ?? 0, He = ((_b2 = K.get(he)) == null ? void 0 : _b2[0]) ?? 0, Oe = (De + Te) / 2, Ze = Math.hypot((De - Te) / 2, He);
        ge.set(he, [Oe + Ze]), ce.set(he, [Oe - Ze]);
      });
    };
    ae(b, y, S, ie, I), ae(u, h, f, le, D), z.forEach((Y, Q) => {
      var _a3;
      re.set(Q, [Math.hypot(Y[0] ?? 0, ((_a3 = x.get(Q)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const R = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, A = (_w = l.solidResults) == null ? void 0 : _w.val, E = A && A !== "none" ? A : l.shellResults.val, C = R == null ? void 0 : R[E], N = { bendingXX: [u, 0], bendingYY: [h, 0], bendingXY: [f, 0], membraneXX: [b, 0], membraneYY: [y, 0], membraneXY: [S, 0], tranverseShearX: [z, 0], tranverseShearY: [x, 0], membranePrincipalMax: [ie, 0], membranePrincipalMin: [I, 0], bendingPrincipalMax: [le, 0], bendingPrincipalMin: [D, 0], transverseShearMax: [re, 0], vonMises: [W, 0], pressure: [ue, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, V = l.shellResults.val, $ = oi.val, ee = si.val, se = V === "displacementX" || V === "displacementY" || V === "displacementZ", pe = V === "bendingXX" || V === "bendingYY" || V === "bendingXY" || V === "bendingPrincipalMax" || V === "bendingPrincipalMin", ne = V === "membraneXX" || V === "membraneYY" || V === "membraneXY" || V === "membranePrincipalMax" || V === "membranePrincipalMin", B = V === "vonMises" || V === "pressure", fe = V === "tranverseShearX" || V === "tranverseShearY" || V === "transverseShearMax", J = (_D = l.solidResults) == null ? void 0 : _D.val, ye = J === "vonMises" || J === "sigmaXX" || J === "sigmaYY" || J === "sigmaZZ" || J === "tauXY" || J === "tauYZ" || J === "tauXZ", xe = J === "ux" || J === "uy" || J === "uz", Ee = ai.val, Me = ye ? li[Ee] : xe || se ? xs[ee] : pe || ne || B || fe ? 1 / ii[$] : 1, Le = ye ? Ee : xe || se ? ee : pe ? `${$}\xB7m/m` : ne ? `${$}/m\xB2` : B ? `${$}/m\xB2` : fe ? `${$}/m` : "";
    To.val = Le, $n.val = Array.isArray(C) && C.length === 2 ? [C[0] * Me, C[1] * Me] : null;
    const Ke = Ss.val, mt = J && J !== "none" ? [W, 0] : N[V], P = [];
    if (e.nodes.val.forEach((Y, Q) => {
      const K = mt;
      if (!K || !K[0] || typeof K[0].has != "function") return;
      if (!K[0].has(Q)) {
        P.push(Number.NaN);
        return;
      }
      const ge = K[0].get(Q), ce = ge ? ge[K[1]] ?? 0 : 0;
      P.push(ce * Me);
    }), !$n.val && Ke !== "auto") {
      const Y = e.nodes.val, Q = /* @__PURE__ */ new Set(), K = (ce, ke) => {
        var _a3;
        const he = (_a3 = Y[ce[0]]) == null ? void 0 : _a3[ke];
        return ce.every((De) => {
          var _a4;
          return Math.abs((((_a4 = Y[De]) == null ? void 0 : _a4[ke]) ?? NaN) - he) < 1e-6;
        });
      };
      for (const ce of e.elements.val) {
        if (ce.length !== 4) continue;
        const ke = K(ce, 2), he = !ke && K(ce, 0), De = !ke && K(ce, 1);
        if (Ke === "losas" ? ke : Ke === "muros" ? he || De : Ke === "murosX" ? he : Ke === "murosY" ? De : false) for (const Oe of ce) Q.add(Oe);
      }
      const ge = [];
      for (const ce of Q) {
        const ke = P[ce];
        Number.isFinite(ke) && ge.push(ke);
      }
      ge.length && ($n.val = $o(ge));
    }
    r.val = P;
  }), r;
}
export {
  ua as a,
  ws as b,
  oi as c,
  si as d,
  ai as e,
  fi as g
};
