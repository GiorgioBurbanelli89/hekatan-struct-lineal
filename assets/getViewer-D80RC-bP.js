import { N as Ht, a6 as Gn, q as Gs, v as ee, a7 as Hs, D as At, M as lt, B as ze, F as Ct, a8 as Ws, x as yt, a9 as Js, aa as Os, h as as, ab as is, r as dn, ac as Qn, ad as jn, a4 as gs, _ as it, b as ht, L as Wt, w as vs, c as Qs, ae as js, f as ft, V as S, $ as cn, af as ko, H as no, d as Ft, a as So, Y as bs, Z as to, G as ea, z as Vn, A as ta, ag as eo, t as na, o as oa, I as en, a2 as Fn, E as ls, S as xn, m as Hn, ah as An, g as rs, i as cs, j as ds, C as ps, K as sa, U as aa, W as ia, X as la, T as Wn, P as Po, O as ra } from "./theme-DQ--CgsI.js";
import { T as Pt, O as us } from "./Text-ERv22veQ.js";
import { P as Ms } from "./tweakpane-BXg6ZhiP.js";
import { e as ca } from "./styles-0iLl92Fx.js";
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
    for (let w = 1; w < r; w++) {
      const v = w * d;
      for (let y = 0; y < this.map.length - 1; y++) if (v > this.map[y][0] && v <= this.map[y + 1][0]) {
        const k = this.map[y][0], F = this.map[y + 1][0];
        u.setHex(this.map[y][1], Gn), h.setHex(this.map[y + 1][1], Gn);
        const b = new Ht().lerpColors(u, h, (v - k) / (F - k));
        this.lut.push(b);
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
    const w = 1 / this.n, v = new Ht(), y = new Ht(), k = new Ht();
    for (let F = 1; F >= 0; F -= w) for (let b = this.map.length - 1; b >= 0; b--) if (F < this.map[b][0] && F >= this.map[b - 1][0]) {
      const W = this.map[b - 1][0], ye = this.map[b][0];
      v.setHex(this.map[b - 1][1], Gn), y.setHex(this.map[b][1], Gn), k.lerpColors(v, y, (F - W) / (ye - W)), u[h * 4] = Math.round(k.r * 255), u[h * 4 + 1] = Math.round(k.g * 255), u[h * 4 + 2] = Math.round(k.b * 255), u[h * 4 + 3] = 255, h += 1;
    }
    return r.putImageData(d, 0, 0), l;
  }
}
const Co = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ks = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], da = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ks, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, oo = ee.state("safe"), Ss = ee.state("auto");
function Ps(e) {
  e = Math.max(0, Math.min(1, e));
  const l = da[oo.val] ?? ks;
  for (let d = 0; d < l.length - 1; d++) {
    const [u, h, w, v] = l[d], [y, k, F, b] = l[d + 1];
    if (e <= y) {
      const W = (e - u) / (y - u);
      return [h + (k - h) * W, w + (F - w) * W, v + (b - v) * W];
    }
  }
  const r = l[l.length - 1];
  return [r[1], r[2], r[3]];
}
function fs() {
  const l = new Uint8Array(1024);
  for (let d = 0; d < 256; d++) {
    const u = d / 255, [h, w, v] = Ps(u);
    l[d * 4 + 0] = h, l[d * 4 + 1] = w, l[d * 4 + 2] = v, l[d * 4 + 3] = 255;
  }
  const r = new Js(l, 256, 1, Os);
  return r.minFilter = as, r.magFilter = as, r.wrapS = is, r.wrapT = is, r.needsUpdate = true, r;
}
function pa() {
  const l = [];
  for (let r = 0; r <= 12; r++) {
    const d = 1 - r / 12, [u, h, w] = Ps(d);
    l.push(`rgb(${u | 0},${h | 0},${w | 0}) ${(r / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function $o(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((h, w) => h - w), r = (h) => l[Math.min(l.length - 1, Math.max(0, Math.round(h * (l.length - 1))))];
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
  ee.derive(() => {
    var _a2;
    oo.val;
    const w = u.uniforms.cmap.value;
    u.uniforms.cmap.value = fs(), (_a2 = w == null ? void 0 : w.dispose) == null ? void 0 : _a2.call(w);
  });
  const h = new lt(new ze(), u);
  return h.renderOrder = -1, h.frustumCulled = false, h.userData.isShellArea = true, h.name = "__hekatan_shell_colormap", ee.derive(() => {
    h.geometry.setAttribute("position", new Ct(e.val.flat(), 3));
    const w = [], v = [], y = [];
    l.val.forEach((R, ie) => {
      R.length === 3 ? (w.push(R[0], R[1], R[2]), v.push(ie), y.push(0)) : R.length === 4 && (w.push(R[0], R[1], R[2]), w.push(R[0], R[2], R[3]), v.push(ie, ie), y.push(0, 1));
    }), h.geometry.setIndex(new Ws(w, 1)), h.userData.faceToElem = v, h.userData.faceLocal = y;
    const k = r.val.filter((R) => Number.isFinite(R));
    let F, b;
    const W = $n.val;
    if (W ? (b = W[0], F = W[1]) : [b, F] = $o(k), F === b) {
      const R = Math.max(Math.abs(F) * 1e-6, 1e-9);
      F += R, b -= R;
    }
    const ye = W && W[0] > W[1], be = Math.min(b, F), se = Math.max(b, F), I = se - be, oe = new Float32Array(r.val.length);
    for (let R = 0; R < r.val.length; R++) {
      const ie = r.val[R];
      if (!Number.isFinite(ie)) {
        oe[R] = -1;
        continue;
      }
      const B = ((ye ? se + be - ie : ie) - be) / I;
      oe[R] = Math.max(0, Math.min(1, B));
    }
    h.geometry.setAttribute("scalar", new yt(oe, 1));
  }), h;
}
function fa(e, l, r) {
  const d = document.createElement("div"), u = new Ms({ title: "Settings", expanded: true, container: d });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(u), d.setAttribute("id", "settings");
  const h = "hk_settingsPos";
  let w = null;
  try {
    const b = localStorage.getItem(h);
    b && (w = JSON.parse(b));
  } catch {
  }
  d.style.cssText = ["position:fixed", w ? `left:${w.left}px` : "left:8px", w ? `top:${w.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const v = () => {
    const b = d.querySelector(".tp-rotv_b");
    if (!b) {
      setTimeout(v, 200);
      return;
    }
    b.style.cursor = "move", b.style.userSelect = "none";
    let W = false, ye = 0, be = 0, se = 0, I = 0;
    b.addEventListener("mousedown", (oe) => {
      W = true, ye = oe.clientX, be = oe.clientY;
      const R = d.getBoundingClientRect();
      se = R.left, I = R.top, d.style.left = `${se}px`, d.style.top = `${I}px`;
    }), window.addEventListener("mousemove", (oe) => {
      if (!W) return;
      const R = oe.clientX - ye, ie = oe.clientY - be, le = Math.max(0, Math.min(window.innerWidth - 40, se + R)), B = Math.max(0, Math.min(window.innerHeight - 40, I + ie));
      d.style.left = `${le}px`, d.style.top = `${B}px`;
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
  if (v(), l == null ? void 0 : l.nodes) {
    u.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const b = u.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    b.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), b.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), b.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), b.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const W = b.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    W.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), W.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), W.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), W.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), W.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ye = u.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ye.addBinding(e.nodes, "val", { label: "Nodes" }), ye.addBinding(e.elements, "val", { label: "Elements" }), ye.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ye.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ye.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ye.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ye.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ye.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ye.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ye.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ye.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ye.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ye.addBinding(e.orientations, "val", { label: "Orientations" }), ye.addBinding(e.sections, "val", { label: "Sections" }), ye.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ye.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ye.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ye.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ye.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const b = u.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    b.addBinding(e.supports, "val", { label: "Supports" }), b.addBinding(e.loads, "val", { label: "Loads" }), b.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), b.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const b = u.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = b, b.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), b.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), b.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), b.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), b.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), b.addBinding(oo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), b.addBinding(Ss, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), b.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), b.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), b.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), b.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  r && u.addBinding(e.solids, "val", { label: "Solids" });
  const y = u.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), k = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), F = () => {
    const b = window.__hekatanClipApply;
    typeof b == "function" && b();
  };
  return y.addBinding(k, "enableX", { label: "Cortar X" }).on("change", F), y.addBinding(k, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", F), y.addBinding(k, "invertX", { label: "  invertir X" }).on("change", F), y.addBinding(k, "enableY", { label: "Cortar Y" }).on("change", F), y.addBinding(k, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", F), y.addBinding(k, "invertY", { label: "  invertir Y" }).on("change", F), y.addBinding(k, "enableZ", { label: "Cortar Z" }).on("change", F), y.addBinding(k, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", F), y.addBinding(k, "invertZ", { label: "  invertir Z" }).on("change", F), d;
}
function ha(e) {
  return { gridSize: ee.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: ee.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: ee.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: ee.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: ee.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: ee.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: ee.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: ee.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: ee.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: ee.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: ee.state((e == null ? void 0 : e.nodes) ?? true), elements: ee.state((e == null ? void 0 : e.elements) ?? true), edges: ee.state((e == null ? void 0 : e.edges) ?? true), faces: ee.state((e == null ? void 0 : e.faces) ?? true), elemColumns: ee.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: ee.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: ee.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: ee.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: ee.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: ee.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: ee.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: ee.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: ee.state((e == null ? void 0 : e.orientations) ?? false), sections: ee.state((e == null ? void 0 : e.sections) ?? true), extruded: ee.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: ee.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: ee.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: ee.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: ee.state((e == null ? void 0 : e.secFloor) ?? -1), supports: ee.state((e == null ? void 0 : e.supports) ?? true), loads: ee.state((e == null ? void 0 : e.loads) ?? false), deformedShape: ee.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: ee.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: ee.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: ee.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: ee.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: ee.state((e == null ? void 0 : e.flipAxes) ?? false), solids: ee.state((e == null ? void 0 : e.solids) ?? true), custom3D: ee.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: ee.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: ee.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: ee.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ma(e, l, r) {
  const d = dn(), u = new Qn(new ze(), new jn({ color: d.nodePoint }));
  return gs((h, w) => {
    u.material.color.setHex(w.nodePoint);
  }), u.frustumCulled = false, ee.derive(() => {
    e.nodes.val && u.geometry.setAttribute("position", new Ct(l.val.flat(), 3));
  }), ee.derive(() => {
    if (r.val, l.val, !e.nodes.rawVal) return;
    const h = l.rawVal ?? [];
    let w = e.gridSize.val * 0.5;
    if (h.length >= 2) {
      const y = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
      for (const F of h) for (let b = 0; b < 3; b++) y[b] = Math.min(y[b], F[b]), k[b] = Math.max(k[b], F[b]);
      w = Math.max(k[0] - y[0], k[1] - y[1], k[2] - y[2], 0.1);
    }
    const v = 0.03 * w;
    u.material.size = v * r.rawVal;
  }), ee.derive(() => {
    u.visible = e.nodes.val;
  }), u;
}
function zo(e, l) {
  const r = dn(), d = new it();
  d.name = "hekatan-grid";
  const u = (l == null ? void 0 : l.planes) ?? ["xy"];
  let h = (l == null ? void 0 : l.majorStep) ?? 1, w = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (h <= 0 && (h = 1), w <= 0 && (w = 0.1); e / w > 500; ) w *= 2;
  for (; e / h > 100; ) h *= 2;
  const v = e / 2;
  h = Math.max(w, Math.round(h / w) * w);
  const k = new Ht(r.grid).multiplyScalar(1.3), F = new Ht(r.grid).multiplyScalar(0.8), b = (se, I, oe, R) => {
    const ie = [], le = se === "xy" ? (A, Y) => [A, Y, 0] : se === "xz" ? (A, Y) => [A, 0, Y] : (A, Y) => [0, A, Y], B = Math.floor(v / I);
    for (let A = -B; A <= B; A++) {
      const Y = A * I, L = le(Y, -v), E = le(Y, v);
      ie.push(...L, ...E);
    }
    for (let A = -B; A <= B; A++) {
      const Y = A * I, L = le(-v, Y), E = le(v, Y);
      ie.push(...L, ...E);
    }
    const $ = new ze();
    $.setAttribute("position", new Ct(ie, 3));
    const Z = new ht({ color: oe, transparent: true, opacity: R, depthWrite: false }), X = new Wt($, Z);
    return X.name = `grid-${se}-${I === w ? "minor" : "major"}`, X;
  }, W = (se, I, oe) => {
    const R = se === "xy" ? (X, A) => [X, A, 0] : se === "xz" ? (X, A) => [X, 0, A] : (X, A) => [0, X, A], ie = [[-v, -v], [v, -v], [v, v], [-v, v]], le = [];
    for (const [X, A] of ie) le.push(...R(X, A));
    const B = new ze();
    B.setAttribute("position", new Ct(le, 3));
    const $ = new ht({ color: I, transparent: true, opacity: oe, depthWrite: false }), Z = new vs(B, $);
    return Z.name = `grid-${se}-border`, Z.renderOrder = 1, Z;
  }, ye = (se, I, oe) => {
    const R = se === "xy" ? ($, Z) => [$, Z, 0] : se === "xz" ? ($, Z) => [$, 0, Z] : ($, Z) => [0, $, Z], ie = I === "u" ? [...R(-v, 0), ...R(v, 0)] : [...R(0, -v), ...R(0, v)], le = new ze();
    le.setAttribute("position", new Ct(ie, 3));
    const B = new Wt(le, new ht({ color: oe, transparent: true, opacity: 0.45, depthWrite: false }));
    return B.name = `grid-${se}-eje-${I}`, B.renderOrder = 1, B;
  }, be = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of u) {
    d.add(b(se, w, F, 0.12)), d.add(b(se, h, k, 0.4));
    const [I, oe] = be[se];
    d.add(ye(se, "u", I)), d.add(ye(se, "v", oe)), d.add(W(se, k, 0.55));
  }
  return d.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: h, minorStep: w, gridSize: e, planes: [...u] }, d;
}
function wa(e, l, r, d) {
  const u = new it(), h = new Qs(0.5, 0.5, 0.5), w = new js(0.45, 0.7, 4);
  w.rotateX(Math.PI / 2), w.translate(0, 0, -0.35);
  const v = new ft({ color: 10166822 }), y = new ft({ color: 2792847 }), k = new ft({ color: 3835647 }), F = () => {
    const ye = r.rawVal ?? [];
    if (ye.length < 2) return l.gridSize.val * 0.5;
    let be = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const I of ye) for (let oe = 0; oe < 3; oe++) I[oe] < be[oe] && (be[oe] = I[oe]), I[oe] > se[oe] && (se[oe] = I[oe]);
    return Math.max(se[0] - be[0], se[1] - be[1], se[2] - be[2], 0.1);
  }, b = () => 0.08 * F(), W = () => d.rawVal;
  return ee.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    u.clear();
    const ye = b();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((be, se) => {
      const I = r.val[se];
      if (!I) return;
      const oe = be ?? [], R = (oe[0] ? 1 : 0) + (oe[1] ? 1 : 0) + (oe[2] ? 1 : 0), ie = (oe[3] ? 1 : 0) + (oe[4] ? 1 : 0) + (oe[5] ? 1 : 0);
      let le;
      R >= 3 && ie >= 3 ? le = new lt(h, v) : R >= 3 && ie === 0 ? le = new lt(w, y) : le = new lt(w, k), le.position.set(I[0], I[1], I[2]);
      const B = ye * W();
      le.scale.set(B, B, B), u.add(le);
    });
  }), ee.derive(() => {
    if (d.val, !l.supports.rawVal) return;
    const be = b() * W();
    u.children.forEach((se) => se.scale.set(be, be, be));
  }), ee.derive(() => {
    u.visible = l.supports.val;
  }), u;
}
function ya(e, l, r, d) {
  const u = new it();
  u.name = "loadsGroup";
  function h(v) {
    if (v.length < 2) return 0.12 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
    for (const b of v) for (let W = 0; W < 3; W++) y[W] = Math.min(y[W], b[W]), k[W] = Math.max(k[W], b[W]);
    return 0.08 * Math.max(k[0] - y[0], k[1] - y[1], k[2] - y[2], 0.1);
  }
  ee.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    u.children.forEach((se) => {
      var _a3;
      return (_a3 = se.dispose) == null ? void 0 : _a3.call(se);
    }), u.clear();
    const v = r.val, y = h(v), k = 240, F = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((se, I) => {
      v[I] && se.slice(0, 3).some((oe) => Math.abs(oe) > 1e-15) && F.push(I);
    });
    let b = F;
    if (F.length > k) {
      const se = F.map((E) => v[E][0]), I = F.map((E) => v[E][1]), oe = Math.min(...se), R = Math.max(...se), ie = Math.min(...I), le = Math.max(...I), B = F.map((E) => v[E][2]), $ = Math.max(1e-6, (Math.max(...B) - Math.min(...B)) / 40), Z = (E) => Math.round(E / $), X = new Set(B.map(Z)), A = Math.max(4, Math.floor(k / Math.max(1, X.size))), Y = Math.max(2, Math.round(Math.sqrt(A))), L = /* @__PURE__ */ new Map();
      for (const E of F) {
        const te = R - oe < 1e-9 ? 0 : (v[E][0] - oe) / (R - oe), ce = le - ie < 1e-9 ? 0 : (v[E][1] - ie) / (le - ie), he = Math.min(Y - 1, Math.floor(te * Y)), ae = Math.min(Y - 1, Math.floor(ce * Y)), N = `${he},${ae},${Z(v[E][2])}`, pe = Math.hypot(te * Y - (he + 0.5), ce * Y - (ae + 0.5)), O = L.get(N);
        (!O || pe < O.d) && L.set(N, { i: E, d: pe });
      }
      b = [...L.values()].map((E) => E.i);
    }
    let W = 0;
    for (const se of b) {
      const I = e.nodeInputs.val.loads.get(se);
      for (let oe = 0; oe < 3; oe++) W = Math.max(W, Math.abs(I[oe]));
    }
    const ye = b.length <= 60, be = (se) => {
      const I = Math.abs(se);
      return I >= 100 ? se.toFixed(0) : I >= 10 ? se.toFixed(1) : se.toFixed(2);
    };
    for (const se of b) {
      const I = e.nodeInputs.val.loads.get(se), oe = v[se];
      if (oe) for (let R = 0; R < 3; R++) {
        const ie = I[R];
        if (!(Math.abs(ie) > 1e-9 * (W || 1))) continue;
        const le = new S(R === 0 ? Math.sign(ie) : 0, R === 1 ? Math.sign(ie) : 0, R === 2 ? Math.sign(ie) : 0), B = 0.45 + 0.55 * (W ? Math.abs(ie) / W : 1), $ = new cn(le, new S(...oe), 1, R === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if ($.userData = { nudo: oe, dir: le, rel: B }, u.add($), ye) {
          const Z = new Pt(be(ie), R === 2 ? "#f5b642" : "#ff6b5e");
          Z.userData = { nudo: oe, dir: le, rel: B, texto: true }, u.add(Z);
        }
      }
    }
    w(y * d.rawVal);
  });
  function w(v) {
    u.children.forEach((y) => {
      const k = y.userData;
      if (!(k == null ? void 0 : k.dir)) return;
      const F = v * k.rel, b = new S(...k.nudo).addScaledVector(k.dir, -F * (k.texto ? 1.12 : 1));
      y.position.copy(b), k.texto ? y.updateScale(v * 0.38) : y.scale.set(F, F, F);
    });
  }
  return ee.derive(() => {
    d.val, l.loads.rawVal && w(h(r.rawVal) * d.rawVal);
  }), ee.derive(() => {
    u.visible = l.loads.val;
  }), u;
}
function xa(e, l, r) {
  const d = new it();
  return ee.derive(() => {
    if (!e.nodesIndexes.val) return;
    d.children.forEach((h) => h.dispose()), d.clear();
    const u = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((h, w) => {
      const v = new Pt(`${w}`);
      v.position.set(...h), v.updateScale(u * r.rawVal), d.add(v);
    });
  }), ee.derive(() => {
    if (r.val, !e.nodesIndexes.rawVal) return;
    const u = 0.05 * e.gridSize.val * 0.6;
    d.children.forEach((h) => h.updateScale(u * r.rawVal));
  }), ee.derive(() => {
    d.visible = e.nodesIndexes.val;
  }), d;
}
function ga(e, l, r, d) {
  const u = new it();
  return ee.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    u.children.forEach((w) => w.dispose()), u.clear();
    const h = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((w, v) => {
      const y = new Pt(`${v}`, void 0, "#001219");
      y.position.set(...va(w.map((k) => r.rawVal[k]))), y.updateScale(h * d.rawVal), u.add(y);
    });
  }), ee.derive(() => {
    if (d.val, !l.elementsIndexes.rawVal) return;
    const h = 0.05 * l.gridSize.val * 0.6;
    u.children.forEach((w) => w.updateScale(h * d.rawVal));
  }), ee.derive(() => {
    u.visible = l.elementsIndexes.val;
  }), u;
}
function va(e) {
  const l = e.reduce((d, u) => [d[0] + u[0], d[1] + u[1], d[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function hs(e, l) {
  const r = new it(), d = Math.min(0.05 * e, 0.6), u = dn(), h = new Pt("X", "red", "transparent"), w = new Pt(l ? "Z" : "Y", "green", "transparent"), v = new Pt(l ? "Y" : "Z", "blue", "transparent"), y = new cn(new S(1, 0, 0), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), k = new cn(new S(0, 1, 0), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), F = new cn(new S(0, 0, 1), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2);
  return h.position.set(1.3 * d, 0, 0), w.position.set(0, 1.3 * d, 0), v.position.set(0, 0, 1.3 * d), h.updateScale(0.4 * d), w.updateScale(0.4 * d), v.updateScale(0.4 * d), y.scale.set(d, d, d), k.scale.set(d, d, d), F.scale.set(d, d, d), r.add(y, k, F, h, w, v), r;
}
function Lo(e, l) {
  const r = new S(...e), u = new S(...l).clone().sub(r), h = u.length(), w = u.dot(new S(1, 0, 0)) / h, v = u.dot(new S(0, 1, 0)) / h, y = u.dot(new S(0, 0, 1)) / h, k = Math.sqrt(w ** 2 + v ** 2);
  let F = new ko().fromArray([[w, v, y], [-v / k, w / k, 0], [-w * y / k, -v * y / k, k]].flat());
  return y === 1 && (F = new ko().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), y === -1 && (F = new ko().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new no().setFromMatrix3(F);
}
function Eo(e, l) {
  return e == null ? void 0 : e.map((r, d) => (9 * r + l[d]) / 10);
}
function Tn(e) {
  const l = e.reduce((d, u) => [d[0] + u[0], d[1] + u[1], d[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function ba(e, l, r) {
  const d = Tn([l, r]), u = Tn([e, r]), h = Tn([e, l]), w = new S(...d).sub(new S(...u)).normalize(), v = new S(...r).sub(new S(...h)).normalize(), y = w.clone().cross(v).normalize(), k = y.clone().cross(w).normalize();
  return new no().makeBasis(w, k, y);
}
function Ma(e, l, r, d) {
  const u = new it(), h = new ze(), w = new ht({ vertexColors: true }), v = [0, 0, 0], y = [1, 0, 0], k = [0, 1, 0], F = [0, 0, 1];
  h.setAttribute("position", new Ct([...v, ...y, ...v, ...k, ...v, ...F], 3));
  const b = [255, 0, 0], W = [0, 255, 0], ye = [0, 0, 255];
  return h.setAttribute("color", new Ct([...b, ...b, ...W, ...W, ...ye, ...ye], 3)), ee.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (u.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((be) => {
      const se = new Wt(h, w), I = r.rawVal[be[0]], oe = r.rawVal[be[1]];
      if (be.length === 2 && (se.position.set(...Eo(I, oe)), se.rotation.setFromRotationMatrix(Lo(I, oe))), be.length === 3) {
        const le = r.rawVal[be[2]];
        se.position.set(...Tn([I, oe, le])), se.rotation.setFromRotationMatrix(ba(I, oe, le));
      }
      const ie = 0.05 * l.gridSize.rawVal * 0.75 * d.rawVal;
      se.scale.set(ie, ie, ie), u.add(se);
    }));
  }), ee.derive(() => {
    if (d.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * d.rawVal;
    u.children.forEach((I) => I.scale.set(se, se, se));
  }), ee.derive(() => {
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
  function w($, Z) {
    const X = $ / 2, A = Z / 2, Y = new Float32Array([0, -X, -A, 0, X, -A, 0, X, A, 0, -X, -A, 0, X, A, 0, -X, A]), L = new ze();
    L.setAttribute("position", new yt(Y, 3));
    const E = new Float32Array([0, -X, -A, 0, X, -A, 0, X, A, 0, -X, A, 0, -X, -A]), te = new ze();
    return te.setAttribute("position", new yt(E, 3)), { fill: L, outline: te };
  }
  function v($, Z = 24) {
    const X = $ / 2, A = new Float32Array(Z * 9);
    for (let te = 0; te < Z; te++) {
      const ce = te / Z * Math.PI * 2, he = (te + 1) / Z * Math.PI * 2;
      A[te * 9] = 0, A[te * 9 + 1] = 0, A[te * 9 + 2] = 0, A[te * 9 + 3] = 0, A[te * 9 + 4] = X * Math.cos(ce), A[te * 9 + 5] = X * Math.sin(ce), A[te * 9 + 6] = 0, A[te * 9 + 7] = X * Math.cos(he), A[te * 9 + 8] = X * Math.sin(he);
    }
    const Y = new ze();
    Y.setAttribute("position", new yt(A, 3));
    const L = new Float32Array((Z + 1) * 3);
    for (let te = 0; te <= Z; te++) {
      const ce = te / Z * Math.PI * 2;
      L[te * 3] = 0, L[te * 3 + 1] = X * Math.cos(ce), L[te * 3 + 2] = X * Math.sin(ce);
    }
    const E = new ze();
    return E.setAttribute("position", new yt(L, 3)), { fill: Y, outline: E };
  }
  function y($, Z, X, A) {
    const Y = X ?? Z * 0.08, L = A ?? $ * 0.07, E = $ / 2, te = Z / 2, ce = te - Y, he = L / 2, ae = [];
    function N(ge, Ee, Me, Ie) {
      ae.push(0, ge, Ee, 0, Me, Ee, 0, Me, Ie, 0, ge, Ee, 0, Me, Ie, 0, ge, Ie);
    }
    N(-E, -te, E, -ce), N(-he, -ce, he, ce), N(-E, ce, E, te);
    const pe = new ze();
    pe.setAttribute("position", new yt(new Float32Array(ae), 3));
    const O = new Float32Array([0, -E, -te, 0, E, -te, 0, E, -ce, 0, he, -ce, 0, he, ce, 0, E, ce, 0, E, te, 0, -E, te, 0, -E, ce, 0, -he, ce, 0, -he, -ce, 0, -E, -ce, 0, -E, -te]), xe = new ze();
    return xe.setAttribute("position", new yt(O, 3)), { fill: pe, outline: xe };
  }
  function k($, Z, X) {
    const A = $ / 2, Y = Z / 2, L = A - X, E = Y - X, te = [];
    function ce(pe, O, xe, ge) {
      te.push(0, pe, O, 0, xe, O, 0, xe, ge, 0, pe, O, 0, xe, ge, 0, pe, ge);
    }
    ce(-A, -Y, A, -E), ce(-A, E, A, Y), ce(-A, -E, -L, E), ce(L, -E, A, E);
    const he = new ze();
    he.setAttribute("position", new yt(new Float32Array(te), 3));
    const ae = new Float32Array([0, -A, -Y, 0, A, -Y, 0, A, -Y, 0, A, Y, 0, A, Y, 0, -A, Y, 0, -A, Y, 0, -A, -Y, 0, -L, -E, 0, L, -E, 0, L, -E, 0, L, E, 0, L, E, 0, -L, E, 0, -L, E, 0, -L, -E]), N = new ze();
    return N.setAttribute("position", new yt(ae, 3)), { fill: he, outline: N };
  }
  function F($, Z, X) {
    const A = $ / 2, Y = Z / 2, L = A - X, E = Y - X, te = new ze(), ce = new Float32Array([0, -L, -E, 0, L, -E, 0, L, E, 0, -L, -E, 0, L, E, 0, -L, E]);
    te.setAttribute("position", new yt(ce, 3));
    const he = [];
    function ae(xe, ge, Ee, Me) {
      he.push(0, xe, ge, 0, Ee, ge, 0, Ee, Me, 0, xe, ge, 0, Ee, Me, 0, xe, Me);
    }
    ae(-A, -Y, A, -E), ae(-A, E, A, Y), ae(-A, -E, -L, E), ae(L, -E, A, E);
    const N = new ze();
    N.setAttribute("position", new yt(new Float32Array(he), 3));
    const pe = new Float32Array([0, -A, -Y, 0, A, -Y, 0, A, -Y, 0, A, Y, 0, A, Y, 0, -A, Y, 0, -A, Y, 0, -A, -Y, 0, -L, -E, 0, L, -E, 0, L, -E, 0, L, E, 0, L, E, 0, -L, E, 0, -L, E, 0, -L, -E]), O = new ze();
    return O.setAttribute("position", new yt(pe, 3)), { concFill: te, steelFillGeom: N, outline: O };
  }
  function b($, Z, X) {
    const A = [], Y = [[0, -$ / 2, -Z / 2], [0, -$ / 2 + X, -Z / 2], [0, -$ / 2 + X, Z / 2 - X], [0, $ / 2, Z / 2 - X], [0, $ / 2, Z / 2], [0, -$ / 2, Z / 2]], L = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const he of L) A.push(...Y[he]);
    const E = new ze();
    E.setAttribute("position", new yt(new Float32Array(A), 3));
    const te = [];
    for (let he = 0; he < Y.length; he++) {
      const ae = (he + 1) % Y.length;
      te.push(...Y[he], ...Y[ae]);
    }
    const ce = new ze();
    return ce.setAttribute("position", new yt(new Float32Array(te), 3)), { fill: E, outline: ce };
  }
  function W($, Z, X, A) {
    const Y = A / 2, L = [], E = [[0, -$ - Y, -Z / 2], [0, -X - Y, -Z / 2], [0, -X - Y, Z / 2 - X], [0, -Y, Z / 2 - X], [0, -Y, Z / 2], [0, -$ - Y, Z / 2]], te = [[0, Y, -Z / 2], [0, Y + X, -Z / 2], [0, Y + X, Z / 2 - X], [0, $ + Y, Z / 2 - X], [0, $ + Y, Z / 2], [0, Y, Z / 2]], ce = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of ce) L.push(...E[pe]);
    for (const pe of ce) L.push(...te[pe]);
    const he = new ze();
    he.setAttribute("position", new yt(new Float32Array(L), 3));
    const ae = [];
    for (const pe of [E, te]) for (let O = 0; O < pe.length; O++) {
      const xe = (O + 1) % pe.length;
      ae.push(...pe[O], ...pe[xe]);
    }
    const N = new ze();
    return N.setAttribute("position", new yt(new Float32Array(ae), 3)), { fill: he, outline: N };
  }
  function ye($, Z, X, A) {
    const Y = Z / 2, L = $, E = [[0, -L, -Y], [0, -L, -Y + X], [0, -A, -Y + X], [0, -A, Y - X], [0, -L, Y - X], [0, -L, Y], [0, 0, Y], [0, 0, -Y]], te = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ce = [];
    for (const pe of te) ce.push(...E[pe]);
    const he = new ze();
    he.setAttribute("position", new yt(new Float32Array(ce), 3));
    const ae = [];
    for (let pe = 0; pe < E.length; pe++) {
      const O = (pe + 1) % E.length;
      ae.push(...E[pe], ...E[O]);
    }
    const N = new ze();
    return N.setAttribute("position", new yt(new Float32Array(ae), 3)), { fill: he, outline: N };
  }
  function be($, Z, X, A, Y) {
    const L = Z / 2, E = Y / 2, te = [], ce = [[0, -$, -L], [0, -$, -L + X], [0, -E - A, -L + X], [0, -E - A, L - X], [0, -$, L - X], [0, -$, L], [0, -E, L], [0, -E, -L]], he = ce.map((xe) => [xe[0], -xe[1], xe[2]]), ae = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const xe of ae) te.push(...ce[xe]);
    for (const xe of ae) te.push(...he[xe]);
    const N = new ze();
    N.setAttribute("position", new yt(new Float32Array(te), 3));
    const pe = [];
    for (const xe of [ce, he]) for (let ge = 0; ge < xe.length; ge++) {
      const Ee = (ge + 1) % xe.length;
      pe.push(...xe[ge], ...xe[Ee]);
    }
    const O = new ze();
    return O.setAttribute("position", new yt(new Float32Array(pe), 3)), { fill: N, outline: O };
  }
  function se($, Z, X, A) {
    const Y = $ / 2, L = Z / 2, E = A / 2, te = [[0, -E, -L], [0, E, -L], [0, E, L - X], [0, Y, L - X], [0, Y, L], [0, -Y, L], [0, -Y, L - X], [0, -E, L - X]], ce = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], he = [];
    for (const O of ce) he.push(...te[O]);
    const ae = new ze();
    ae.setAttribute("position", new yt(new Float32Array(he), 3));
    const N = [];
    for (let O = 0; O < te.length; O++) {
      const xe = (O + 1) % te.length;
      N.push(...te[O], ...te[xe]);
    }
    const pe = new ze();
    return pe.setAttribute("position", new yt(new Float32Array(N), 3)), { fill: ae, outline: pe };
  }
  function I($, Z, X = 24) {
    const A = $ / 2, Y = A - Z, L = [];
    for (let he = 0; he < X; he++) {
      const ae = he / X * Math.PI * 2, N = (he + 1) / X * Math.PI * 2, pe = Math.cos(ae), O = Math.sin(ae), xe = Math.cos(N), ge = Math.sin(N);
      L.push(0, A * pe, A * O, 0, A * xe, A * ge, 0, Y * xe, Y * ge), L.push(0, A * pe, A * O, 0, Y * xe, Y * ge, 0, Y * pe, Y * O);
    }
    const E = new ze();
    E.setAttribute("position", new yt(new Float32Array(L), 3));
    const te = [];
    for (let he = 0; he < X; he++) {
      const ae = he / X * Math.PI * 2, N = (he + 1) / X * Math.PI * 2;
      te.push(0, A * Math.cos(ae), A * Math.sin(ae), 0, A * Math.cos(N), A * Math.sin(N)), te.push(0, Y * Math.cos(ae), Y * Math.sin(ae), 0, Y * Math.cos(N), Y * Math.sin(N));
    }
    const ce = new ze();
    return ce.setAttribute("position", new yt(new Float32Array(te), 3)), { fill: E, outline: ce };
  }
  const oe = new ft({ color: 52479, transparent: true, opacity: 0.35, side: At, depthWrite: false }), R = new ht({ color: 52479 }), ie = new ft({ color: 16750848, transparent: true, opacity: 0.4, side: At, depthWrite: false }), le = new ht({ color: 16750848 });
  function B($, Z) {
    const X = Math.abs(Z[0] - $[0]), A = Math.abs(Z[1] - $[1]), Y = Math.abs(Z[2] - $[2]);
    return Y > X && Y > A || A > X && A > Y;
  }
  return ee.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const $ = l.secColumns.rawVal, Z = l.secBeams.rawVal;
    if (!$ && !Z) {
      u.children.forEach((E) => {
        E instanceof Pt && E.dispose();
      }), u.clear();
      return;
    }
    u.children.forEach((E) => {
      E instanceof Pt && E.dispose();
    }), u.clear();
    const X = (_a2 = e.elements) == null ? void 0 : _a2.val, A = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!X || !A) return;
    const Y = A.sectionShapes, L = l.secFloor.rawVal;
    X.forEach((E, te) => {
      if (E.length !== 2) return;
      const ce = r.rawVal[E[0]], he = r.rawVal[E[1]];
      if (!ce || !he) return;
      const ae = B(ce, he);
      if (ae && !$ || !ae && !Z) return;
      if (L >= 0) {
        const ge = Math.min(ce[1], he[1]);
        Math.max(ce[1], he[1]);
        const Ee = l.gridSize.rawVal || 3;
        if (Math.floor(ge / Ee + 0.01) !== L) return;
      }
      const N = Y == null ? void 0 : Y.get(te);
      if (!N) return;
      const pe = [(ce[0] + he[0]) / 2, (ce[1] + he[1]) / 2, (ce[2] + he[2]) / 2], O = Lo(ce, he);
      if (N.type === "CFT") {
        const ge = F(N.b, N.h, N.tw ?? N.b * 0.05), Ee = new lt(ge.concFill, oe);
        Ee.position.set(...pe), Ee.rotation.setFromRotationMatrix(O), u.add(Ee);
        const Me = new lt(ge.steelFillGeom, ie);
        Me.position.set(...pe), Me.rotation.setFromRotationMatrix(O), u.add(Me);
        const Ie = new Ft(ge.outline, le);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(O), u.add(Ie);
      } else {
        let ge, Ee, Me;
        switch (N.type) {
          case "rect":
            ge = w(N.b, N.h), Ee = oe, Me = R;
            break;
          case "circ":
            ge = v(N.d), Ee = oe, Me = R;
            break;
          case "I":
            ge = y(N.b, N.h, N.tf, N.tw), Ee = ie, Me = le;
            break;
          case "HSS":
            ge = k(N.b, N.h, N.tw ?? N.b * 0.05), Ee = ie, Me = le;
            break;
          case "CFT":
            ge = F(N.b, N.h, N.tw ?? N.b * 0.05), Ee = ie, Me = le;
            break;
          case "L":
            ge = b(N.b ?? N.h, N.h, N.t ?? N.tw ?? 3e-3), Ee = ie, Me = le;
            break;
          case "2L":
            ge = W(N.b ?? N.h, N.h, N.t ?? N.tw ?? 3e-3, N.dis ?? 0.01), Ee = ie, Me = le;
            break;
          case "C":
          case "coldC":
            ge = ye(N.b, N.h, N.tf ?? N.t ?? 3e-3, N.tw ?? N.t ?? 3e-3), Ee = ie, Me = le;
            break;
          case "2C":
            ge = be(N.b, N.h, N.tf ?? 5e-3, N.tw ?? 5e-3, N.dis ?? 0.01), Ee = ie, Me = le;
            break;
          case "T":
            ge = se(N.b, N.h, N.tf ?? 0.01, N.tw ?? 6e-3), Ee = ie, Me = le;
            break;
          case "pipe":
            ge = I(N.d, N.tw ?? N.d * 0.05), Ee = ie, Me = le;
            break;
          default:
            return;
        }
        const Ie = new lt(ge.fill, Ee);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(O), u.add(Ie);
        const Ke = new Ft(ge.outline, Me);
        Ke.position.set(...pe), Ke.rotation.setFromRotationMatrix(O), u.add(Ke);
      }
      const xe = _a(N);
      if (xe) {
        const Ee = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(N.type) ? "#ff9900" : "#00ccff", Me = new Pt(xe, Ee, "transparent");
        Me.position.set(pe[0], pe[1], pe[2]);
        const Ie = 0.05 * l.gridSize.rawVal * 0.5;
        Me.updateScale(Ie * ((d == null ? void 0 : d.rawVal) ?? 1)), h.add(Me);
      }
    });
  }), d && ee.derive(() => {
    if (d.val, !l.sections.rawVal) return;
    const $ = 0.05 * l.gridSize.val * 0.5;
    h.children.forEach((Z) => {
      Z instanceof Pt && Z.updateScale($ * d.rawVal);
    });
  }), ee.derive(() => {
    u.visible = l.sections.val;
  }), ee.derive(() => {
    h.visible = l.sectionLabels.val;
  }), u;
}
function Sa(e) {
  if (!e) return null;
  const l = e.type, r = (F, b) => [F, b], d = (F, b) => [r(-F / 2, -b / 2), r(F / 2, -b / 2), r(F / 2, b / 2), r(-F / 2, b / 2)], u = (F, b = 24) => {
    const W = F / 2, ye = [];
    for (let be = 0; be < b; be++) {
      const se = 2 * Math.PI * be / b;
      ye.push(r(W * Math.cos(se), W * Math.sin(se)));
    }
    return ye;
  }, h = e.b ?? 0, w = e.h ?? 0, v = e.d ?? 0, y = e.tw ?? e.t ?? 0, k = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return h && w ? { contorno: d(h, w) } : null;
    case "circ":
      return v ? { contorno: u(v) } : null;
    case "pipe":
      return v && y ? { contorno: u(v), huecos: [u(v - 2 * y).reverse()] } : null;
    case "HSS":
      return h && w && y ? { contorno: d(h, w), huecos: [d(h - 2 * y, w - 2 * (k || y)).reverse()] } : null;
    case "CFT":
      return h && w ? { contorno: d(h, w) } : null;
    case "I":
      return h && w && y && k ? { contorno: [r(-h / 2, -w / 2), r(h / 2, -w / 2), r(h / 2, -w / 2 + k), r(y / 2, -w / 2 + k), r(y / 2, w / 2 - k), r(h / 2, w / 2 - k), r(h / 2, w / 2), r(-h / 2, w / 2), r(-h / 2, w / 2 - k), r(-y / 2, w / 2 - k), r(-y / 2, -w / 2 + k), r(-h / 2, -w / 2 + k)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return h && w && y && k ? { contorno: [r(-h / 2, -w / 2), r(h / 2, -w / 2), r(h / 2, -w / 2 + k), r(-h / 2 + y, -w / 2 + k), r(-h / 2 + y, w / 2 - k), r(h / 2, w / 2 - k), r(h / 2, w / 2), r(-h / 2, w / 2)] } : null;
    case "T":
      return h && w && y && k ? { contorno: [r(-y / 2, -w / 2), r(y / 2, -w / 2), r(y / 2, w / 2 - k), r(h / 2, w / 2 - k), r(h / 2, w / 2), r(-h / 2, w / 2), r(-h / 2, w / 2 - k), r(-y / 2, w / 2 - k)] } : null;
    case "L":
    case "2L":
      return h && w && y ? { contorno: [r(-h / 2, -w / 2), r(h / 2, -w / 2), r(h / 2, -w / 2 + y), r(-h / 2 + y, -w / 2 + y), r(-h / 2 + y, w / 2), r(-h / 2, w / 2)] } : null;
    default:
      return h && w ? { contorno: d(h, w) } : v ? { contorno: u(v) } : null;
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
    r.forEach(([u, h], w) => w ? d.lineTo(u, h) : d.moveTo(u, h)), d.closePath(), l.holes.push(d);
  }
  return l;
}
function za(e, l, r) {
  const d = new it();
  d.name = "extrusion";
  const u = new So({ color: 8369151, transparent: true, opacity: 0.92, side: At }), h = new So({ color: 12623968, transparent: true, opacity: 0.85, side: At }), w = new So({ color: 11583173, transparent: true, opacity: 0.85, side: At }), v = new it();
  v.add(new bs(16777215, 0.55));
  const y = new to(16777215, 0.75);
  y.position.set(30, 25, 40);
  const k = new to(16777215, 0.35);
  k.position.set(-25, -20, 15), v.add(y, k);
  let F = 0;
  return ee.derive(() => {
    var _a2, _b, _c, _d, _e;
    const b = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++F, on: b }, d.visible = b;
    for (const R of [...d.children]) R !== v && (d.remove(R), (_c = (_b = R.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (d.children.includes(v) || d.add(v), !b) return;
    const W = r.val ?? [], ye = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], be = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = be.sectionShapes ?? /* @__PURE__ */ new Map(), I = be.thicknesses ?? /* @__PURE__ */ new Map();
    let oe = "";
    try {
      ye.forEach((R, ie) => {
        var _a3, _b2, _c2;
        if (R.length === 2) {
          let le = Sa(se.get(ie)), B = true;
          if (le || (le = Pa((_a3 = be.areas) == null ? void 0 : _a3.get(ie), (_b2 = be.momentsOfInertiaY) == null ? void 0 : _b2.get(ie), (_c2 = be.momentsOfInertiaZ) == null ? void 0 : _c2.get(ie)), B = false), !le) return;
          const $ = W[R[0]], Z = W[R[1]];
          if (!$ || !Z) return;
          const X = Math.hypot(Z[0] - $[0], Z[1] - $[1], Z[2] - $[2]);
          if (X < 1e-9) return;
          const A = new ea(Ca(le), { depth: X, bevelEnabled: false, curveSegments: 4 });
          A.applyMatrix4(new no().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const Y = new lt(A, B ? u : h);
          Y.position.set($[0], $[1], $[2]), Y.rotation.setFromRotationMatrix(Lo($, Z)), d.add(Y);
          return;
        }
        if (R.length === 3 || R.length === 4) {
          const le = I.get(ie);
          if (!le || le <= 0) return;
          const B = R.map((O) => W[O]).filter(Boolean);
          if (B.length < 3) return;
          const $ = [B[1][0] - B[0][0], B[1][1] - B[0][1], B[1][2] - B[0][2]], Z = [B[2][0] - B[0][0], B[2][1] - B[0][1], B[2][2] - B[0][2]], X = $[1] * Z[2] - $[2] * Z[1], A = $[2] * Z[0] - $[0] * Z[2], Y = $[0] * Z[1] - $[1] * Z[0], L = Math.hypot(X, A, Y);
          if (L < 1e-12) return;
          const E = [X / L, A / L, Y / L], te = [], ce = (O) => B.map((xe) => [xe[0] + E[0] * O, xe[1] + E[1] * O, xe[2] + E[2] * O]), he = ce(+le / 2), ae = ce(-le / 2), N = (O, xe, ge) => te.push(...O, ...xe, ...ge);
          for (const O of [he, ae]) N(O[0], O[1], O[2]), O.length === 4 && N(O[0], O[2], O[3]);
          for (let O = 0; O < B.length; O++) {
            const xe = (O + 1) % B.length;
            N(he[O], ae[O], ae[xe]), N(he[O], ae[xe], he[xe]);
          }
          const pe = new ze();
          pe.setAttribute("position", new Ct(te, 3)), pe.computeVertexNormals(), d.add(new lt(pe, w));
        }
      });
    } catch (R) {
      oe = String((R == null ? void 0 : R.message) ?? R);
    }
    globalThis.__extrusionDebug = { corridas: F, on: b, fallo: oe, nElementos: ye.length, nFormas: se.size, nEspesores: I.size, mallas: d.children.length - 1 };
  }), d;
}
function Cs(e, l, r = 0) {
  const d = [l[0] - e[0], l[1] - e[1], l[2] - e[2]], u = Math.hypot(d[0], d[1], d[2]) || 1, h = d[0] / u, w = d[1] / u, v = d[2] / u, y = Math.sqrt(h * h + w * w);
  let k, F, b;
  if (y < 1e-9) {
    const W = v > 0 ? 1 : -1;
    k = [0, 0, W], F = [1, 0, 0], b = [0, W, 0];
  } else k = [h, w, v], F = [-h * v / y, -w * v / y, y], b = [w / y, -h / y, 0];
  if (Math.abs(r) > 1e-12) {
    const W = r * Math.PI / 180, ye = Math.cos(W), be = Math.sin(W), se = F.map((oe, R) => ye * oe + be * b[R]), I = b.map((oe, R) => -be * F[R] + ye * oe);
    F = se, b = I;
  }
  return { e1: k, e2: F, e3: b };
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
  constructor(l, r, d, u, h, w, v) {
    super();
    const y = new Vn().moveTo(0, 0).lineTo(0, w[1]).lineTo(d, w[1]).lineTo(d, 0).lineTo(0, 0), k = y.getPoints(), F = new ze().setFromPoints(k);
    this.lines = new Ft(F, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), v && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const b = new eo(y), W = new ft({ color: w[1] > 0 ? 24435 : 11411474, side: At });
    this.mesh = new lt(b, W), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), v && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Pt(`${h[1].toFixed(4)}`), this.normalizedResult = w, this.textPosition = Tn([l, r]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(u), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Fo extends it {
  constructor(l, r, d, u, h, w, v) {
    super();
    const y = h[0] * d / (h[0] + h[1]), k = h[0] * h[1] > 0;
    if (this.text = new Pt(`${h[0].toFixed(4)}`), this.text2 = new Pt(`${(h[1] * -1).toFixed(4)}`), this.normalizedResult = w, this.textPosition = Eo(l, r), this.text2Position = Eo(r, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(u), this.text2.rotation.setFromRotationMatrix(u), this.add(this.text, this.text2), k) {
      const F = new Vn().moveTo(0, 0).lineTo(0, w[0]).lineTo(y, 0).lineTo(0, 0), b = new Vn().moveTo(y, 0).lineTo(d, -w[1]).lineTo(d, 0).lineTo(y, 0), W = F.getPoints(), ye = b.getPoints(), be = new ze().setFromPoints(W), se = new ze().setFromPoints(ye), I = new ht({ color: dn().resultOutline });
      this.lines = new Ft(be, I), this.lines2 = new Ft(se, I), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), this.lines2.rotation.setFromRotationMatrix(u), v && this.lines.rotateX(Math.PI / 2), v && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const oe = new eo(F), R = new eo(b), ie = new ft({ color: w[0] > 0 ? 24435 : 11411474, side: At }), le = new ft({ color: -w[1] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(oe, ie), this.mesh2 = new lt(R, le), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), this.mesh2.rotation.setFromRotationMatrix(u), v && this.mesh.rotateX(Math.PI / 2), v && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const F = new Vn().moveTo(0, 0).lineTo(0, w[0]).lineTo(d, -w[1]).lineTo(d, 0).lineTo(0, 0), b = F.getPoints(), W = new ze().setFromPoints(b);
      this.lines = new Ft(W, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), v && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ye = new eo(F), be = new ft({ color: w[0] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(ye, be), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), v && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
    const v = r.rawVal;
    if (!(v == null ? void 0 : v.length)) return 0.05 * l.gridSize.rawVal;
    const y = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
    for (const b of v) for (let W = 0; W < 3; W++) b[W] < y[W] && (y[W] = b[W]), b[W] > k[W] && (k[W] = b[W]);
    const F = Math.hypot(k[0] - y[0], k[1] - y[1], k[2] - y[2]);
    return !isFinite(F) || F <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * F;
  }, h = new it(), w = { normals: Jn, shearsY: Jn, shearsZ: Jn, torsions: Jn, bendingsY: Fo, bendingsZ: Fo };
  return ee.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, r.val, l.frameResults.val == "none") return;
    h.children.forEach((y) => y.dispose()), h.clear();
    const v = Fs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[v]) == null ? void 0 : _b.forEach((y, k) => {
      var _a3, _b2, _c, _d, _e, _f;
      const F = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[k]) ?? [0, 1], b = r.rawVal[F[0]], W = r.rawVal[F[1]];
      if (!b || !W) return;
      const ye = new S(...W).distanceTo(new S(...b)), be = Aa((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[v]), se = ((_f = (_e = (_d = (_c = e.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, k)) ?? 0, I = Cs(b, W, se), oe = zs(v, I), R = new S(...I.e1), ie = new S(...oe), le = new no().makeBasis(R, ie, R.clone().cross(ie)), [B, $] = Vo(v, y), Z = w[v] === Fo ? [B, -$] : [B, $], X = Z.map((Y) => Y / (be === 0 ? 1 : be)), A = new w[v](b, W, ye, le, Z, X, false);
      A.updateScale(u() * d.rawVal), h.add(A);
    });
  }), ee.derive(() => {
    if (d.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const v = u();
    h.children.forEach((y) => y.updateScale(v * d.rawVal));
  }), ee.derive(() => {
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
    d[0] && (this.xText1 = new Pt(`${u ? "Fx" : "Dx"}: ` + d[0].toFixed(4))), d[3] && (this.xText2 = new Pt(`${u ? "Mx" : "Rx"}: ` + d[3].toFixed(4))), d[1] && (this.yText1 = new Pt(`${u ? "Fy" : "Dy"}: ` + d[1].toFixed(4))), d[4] && (this.yText2 = new Pt(`${u ? "My" : "Ry"}: ` + d[4].toFixed(4))), d[2] && (this.zText1 = new Pt(`${u ? "Fz" : "Dz"}: ` + d[2].toFixed(4))), d[5] && (this.zText2 = new Pt(`${u ? "Mz" : "Rz"}: ` + d[5].toFixed(4))), (d[0] || d[3]) && (this.xArrow = new cn(new S(1, 0, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (d[1] || d[4]) && (this.yArrow = new cn(new S(0, 1, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (d[2] || d[5]) && (this.zArrow = new cn(new S(0, 0, 1), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
  return ee.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    u.children.forEach((v) => v.dispose()), u.clear();
    const h = Io[l.nodeResults.rawVal], w = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[h]) == null ? void 0 : _b.forEach((v, y) => {
      const k = new Ea(r.rawVal[y], h, v ?? [0, 0, 0, 0, 0, 0]);
      k.updateScale(w * d.rawVal), u.add(k);
    });
  }), ee.derive(() => {
    if (d.val, l.nodeResults.rawVal == "none") return;
    const h = 0.05 * l.gridSize.val;
    u.children.forEach((w) => w.updateScale(h * d.rawVal));
  }), ee.derive(() => {
    u.visible = l.nodeResults.val != "none";
  }), u;
}
function Ta({ drawingObj: e, gridObj: l, scene: r, getActiveCamera: d, controls: u, gridSize: h, derivedDisplayScale: w, rendererElm: v, viewerRender: y }) {
  const k = new na(), F = new oa(), b = (t) => {
    const o = v.getBoundingClientRect(), a = t.clientX - o.left, n = t.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = s / 2;
      if (a >= f) return F.x = (a - f) / f * 2 - 1, F.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? d();
      F.x = a / f * 2 - 1;
    } else F.x = a / s * 2 - 1;
    return F.y = -(n / i) * 2 + 1, d();
  }, W = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
  W.visible = true, W.frustumCulled = false, r.add(W);
  const ye = (t, o, a) => {
    const n = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, a), n.visible = false, n.frustumCulled = false, r.add(n), n;
  }, be = ye(Math.PI / 2, 0, 0), se = ye(0, Math.PI / 2, 0);
  let I = false;
  const oe = () => {
    if (I) return k.intersectObjects([W], false);
    if (be.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ze.visible) {
      const a = k.intersectObjects([Ze, rt, Xe], false);
      if (a.length > 0) return a;
    }
    const o = [W];
    return be.visible && o.push(be), se.visible && o.push(se), Ot.visible && un.length > 0 && o.push(...un), k.intersectObjects(o, false);
  }, R = new Qn(new ze(), new jn()), ie = new Qn(new ze(), new jn({ color: "gray", sizeAttenuation: false, size: 6 })), le = new Qn(new ze(), new jn({ color: "orange", sizeAttenuation: false, size: 5 }));
  r.add(le);
  const B = document.createElement("input");
  B.id = "hk-rubber-label", B.type = "text", B.spellcheck = false, B.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, B.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(B);
  let $ = null, Z = null, X = false;
  const A = new S(), Y = (t, o, a, n, s, i) => {
    const c = n - t, f = s - o, m = i - a, x = Math.hypot(c, f, m);
    if (x < 0.01) {
      B.style.display = "none";
      return;
    }
    $ = [t, o, a], Z = [c / x, f / x, m / x], A.set((t + n) / 2, (o + s) / 2, (a + i) / 2), A.project(d());
    const M = v.getBoundingClientRect(), _ = M.left + (A.x * 0.5 + 0.5) * M.width, p = M.top + (-A.y * 0.5 + 0.5) * M.height;
    if (B.style.left = _ + "px", B.style.top = p + "px", B.style.display = "block", !X) {
      if (B.value = `${x.toFixed(2)} m`, document.activeElement !== B) {
        const D = document.activeElement;
        D && (D.tagName === "INPUT" || D.tagName === "TEXTAREA") && D !== B || B.focus({ preventScroll: true });
      }
      try {
        B.select();
      } catch {
      }
    }
  }, L = () => {
    B.style.display = "none", $ = null, Z = null, X = false, document.activeElement === B && B.blur();
  }, E = (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      rn = t, de(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), B.blur();
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
      vt = t, de(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), B.blur();
      return;
    }
    if (!$ || !Z || !e.polylines) return;
    let a = Z[0], n = Z[1], s = Z[2];
    Oe === "x" ? (a = Math.sign(a) || 1, n = 0, s = 0) : Oe === "y" ? (a = 0, n = Math.sign(n) || 1, s = 0) : Oe === "z" && (a = 0, n = 0, s = Math.sign(s) || 1);
    const i = $[0] + a * t, c = $[1] + n * t, f = $[2] + s * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, c, f]];
    const m = e.polylines.rawVal, x = m.length ? m[m.length - 1] : [];
    e.polylines.val = [...m.slice(0, -1), [...x, e.points.rawVal.length - 1]], B.blur();
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
        const [i, c] = s;
        return a ? { kind: "relPolar", L: i, ang: c } : { kind: "absPolar", L: i, ang: c };
      }
      if (s.length === 3 && a) {
        const [i, c, f] = s;
        return { kind: "relSpherical", L: i, az: c, el: f };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((m) => parseFloat(m.trim()));
      if (s.some(isNaN)) return null;
      const [i, c, f = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: c, dz: f } : { kind: "absCart", x: i, y: c, z: f };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, ce = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return $ ? [$[0] + t.dx, $[1] + t.dy, $[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!$) return null;
      const o = t.ang * Math.PI / 180;
      return [$[0] + t.L * Math.cos(o), $[1] + t.L * Math.sin(o), $[2]];
    }
    if (t.kind === "relSpherical") {
      if (!$) return null;
      const o = t.az * Math.PI / 180, a = t.el * Math.PI / 180, n = t.L * Math.cos(a);
      return [$[0] + n * Math.cos(o), $[1] + n * Math.sin(o), $[2] + t.L * Math.sin(a)];
    }
    return null;
  }, he = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], $ = t, B.blur();
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
    if (o.kind === "length") return E(o.L), true;
    const a = ce(o);
    if (!a) return false;
    es(new S(a[0], a[1], a[2]), null), $ = a, B.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, B.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const a = te(B.value);
      if (!a) return;
      if (X = false, a.kind === "length") E(a.L), de(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = ce(a);
        if (!n) return;
        he(n);
        const s = a.kind;
        de(`\u270F ${s} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), X = false, B.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!X && B.style.display === "block") try {
          B.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && (X = true);
  }), window.addEventListener("keydown", (t) => {
    if (!$ || !Z || document.activeElement === B) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (B.value = t.key, B.focus(), B.setSelectionRange(1, 1), t.preventDefault());
  });
  const ae = document.createElement("div");
  ae.id = "hk-coord-readout", ae.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ae.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ae);
  const N = document.createElement("div");
  N.id = "hk-coord-fixed", N.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", N.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(N);
  const pe = new Ft(new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new Fn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", r.add(pe), window.__hekatanRubberBand = pe;
  const O = new Ft(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  O.frustumCulled = false, O.visible = false, r.add(O);
  let xe = [];
  const ge = new it(), Ee = new lt(new en(1, 1), new ft({ color: 2282478, transparent: true, opacity: 0.08, side: At, depthWrite: false })), Me = new Wt(new ls(new en(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Ie = new Wt(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), Ke = (t, o) => {
    const a = [], n = Math.ceil(t / o);
    for (let s = -n; s <= n; s++) {
      const i = s * o;
      a.push(-t, i, 0, t, i, 0), a.push(i, -t, 0, i, t, 0);
    }
    Ie.geometry.dispose(), Ie.geometry = new ze(), Ie.geometry.setAttribute("position", new Ct(a, 3));
  };
  ge.add(Ee, Me, Ie), ge.visible = false, ge.frustumCulled = false, r.add(ge);
  const st = new it();
  st.frustumCulled = false, st.visible = false, r.add(st);
  const mt = (t) => {
    const o = new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), a = new Fn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Ft(o, a);
  }, z = mt(16711680), K = mt(65280), Q = mt(35071);
  st.add(z, K, Q);
  const J = [], ve = (t) => t.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), ue = mt(16761856);
  ue.material.dashSize = 0.28, ue.material.gapSize = 0.16, ue.material.opacity = 0.9, ue.frustumCulled = false, ue.visible = false, ue.renderOrder = 98, r.add(ue);
  const Se = (t) => {
    const o = new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0)]), a = new ht({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new vs(o, a);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, me = Se(3462041), De = Se(16724804), Te = Se(6333946), We = new it();
  We.frustumCulled = false, We.visible = false, r.add(We), We.add(me, De, Te);
  const Qe = (t) => {
    const o = new en(1, 1), a = new ft({ color: t, transparent: true, opacity: 0.06, side: At, depthWrite: false }), n = new lt(o, a);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ze = Qe(3462041), rt = Qe(16724804), Xe = Qe(6333946);
  We.add(Ze, rt, Xe);
  const we = (t, o, a, n) => {
    t.scale.set(2 * n, 2 * n, 1), a === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : a === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Pe = document.createElement("div");
  Pe.id = "hk-refplane-badge", Pe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Pe), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, We.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0], c = window.__hekatanOrthoExt ?? 8;
      Ne(me, i, "xy", c), Ne(De, i, "xz", c), Ne(Te, i, "yz", c), we(Ze, i, "xy", c), we(rt, i, "xz", c), we(Xe, i, "yz", c), Ze.material.opacity = 0.05, rt.material.opacity = 0.05, Xe.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    y();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !We.visible) {
      y();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0];
    Ne(me, i, "xy", t), Ne(De, i, "xz", t), Ne(Te, i, "yz", t), we(Ze, i, "xy", t), we(rt, i, "xz", t), we(Xe, i, "yz", t), y();
  };
  const xt = (t) => {
    if (Ze.material.opacity = t === "xy" ? 0.09 : 0.025, rt.material.opacity = t === "xz" ? 0.09 : 0.025, Xe.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Pe.style.background = s.bg, Pe.style.color = s.text, Pe.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Pe.style.display = "block";
    } else Pe.style.display = "none";
  }, Ne = (t, o, a, n) => {
    let s;
    a === "xy" ? s = [new S(o[0] - n, o[1] - n, o[2]), new S(o[0] + n, o[1] - n, o[2]), new S(o[0] + n, o[1] + n, o[2]), new S(o[0] - n, o[1] + n, o[2]), new S(o[0] - n, o[1] - n, o[2])] : a === "xz" ? s = [new S(o[0] - n, o[1], o[2] - n), new S(o[0] + n, o[1], o[2] - n), new S(o[0] + n, o[1], o[2] + n), new S(o[0] - n, o[1], o[2] + n), new S(o[0] - n, o[1], o[2] - n)] : s = [new S(o[0], o[1] - n, o[2] - n), new S(o[0], o[1] + n, o[2] - n), new S(o[0], o[1] + n, o[2] + n), new S(o[0], o[1] - n, o[2] + n), new S(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(s);
  };
  let Oe = null;
  window.__hekatanAxisLock = () => Oe;
  let kt = null, qe = null;
  const Ce = document.createElement("div");
  Ce.id = "hk-axis-lock-badge", Ce.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ce);
  const Ve = () => {
    if (!Oe) {
      Ce.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = t[Oe], Ce.style.border = `1.5px solid ${t[Oe]}`, Ce.textContent = `\u{1F512} LOCK ${Oe.toUpperCase()}`, Ce.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== B) return;
    const a = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && xe.length >= 3) {
      const s = pn();
      de(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Oe = Oe === a ? null : a, Ve(), t.preventDefault();
    else if (t.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Jo(), t.preventDefault();
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
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = t ? "block" : "none";
    }
  };
  const He = new S(), Fe = new S(), ct = new S(), ut = (t) => {
    if (!Oe) return null;
    const o = t[0], a = t[1], n = t[2];
    return Oe === "x" ? (He.set(o - 1e4, a, n), Fe.set(o + 1e4, a, n)) : Oe === "y" ? (He.set(o, a - 1e4, n), Fe.set(o, a + 1e4, n)) : (He.set(o, a, n - 1e4), Fe.set(o, a, n + 1e4)), k.ray.distanceSqToSegment(He, Fe, null, ct), ct;
  };
  window.__hekatanProjectOnAxis = ut;
  const dt = new Ft(new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new ht({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  dt.renderOrder = 998, dt.frustumCulled = false, dt.visible = false, r.add(dt);
  let Be = -1, Je = -1, wt = -1;
  const Ae = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ae;
  const Mt = new Ft(new ze().setFromPoints([new S(), new S()]), new ht({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Mt.renderOrder = 997, Mt.frustumCulled = false, Mt.visible = false, r.add(Mt);
  const _t = new lt(new xn(0.02, 12, 12), new ft({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  _t.renderOrder = 998, _t.visible = false, r.add(_t);
  const Dt = (t) => {
    const o = d();
    if (o.isOrthographicCamera) {
      const n = o, s = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(t);
    return Math.max(0.05, a / 10);
  }, Et = () => {
    _t.visible && _t.scale.setScalar(Dt(_t.position));
  }, $t = new it();
  $t.frustumCulled = false, r.add($t);
  const nn = 2282478;
  let Ut = null;
  const gn = (t, o, a, n) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, c = n;
    for (let f = 0; f < s.length; f++) {
      const m = s[f];
      if (!m) continue;
      const x = Math.hypot(t - m[0], o - m[1], a - m[2]);
      x < c && (c = x, i = f);
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
      const [f, ...m] = c.split(":");
      if (f === "pt") {
        const x = t[+m[0]];
        if (!x) continue;
        const M = new lt(new xn(0.025, 12, 12), new ft({ color: nn, transparent: true, opacity: 0.9, depthTest: false }));
        M.position.set(x[0], x[1], x[2]), M.renderOrder = 999, M.__isSelectionPt = true, $t.add(M);
      } else if (f === "seg") {
        const x = o[+m[0]], M = t[x == null ? void 0 : x[+m[1]]], _ = t[x == null ? void 0 : x[+m[1] + 1]];
        if (!M || !_) continue;
        const p = new ze().setFromPoints([new S(M[0], M[1], M[2]), new S(_[0], _[1], _[2])]), D = new Ft(p, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        D.renderOrder = 999, $t.add(D);
      } else if (f === "poly") {
        const M = o[+m[0]].map((D) => {
          const j = t[D];
          return j ? new S(j[0], j[1], j[2]) : null;
        }).filter(Boolean);
        if (M.length < 2) continue;
        const _ = new ze().setFromPoints(M), p = new Ft(_, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        p.renderOrder = 999, $t.add(p);
      } else if (f === "aux") {
        const x = n[+m[0]];
        if (!x || x.length !== 6) continue;
        const M = new ze().setFromPoints([new S(x[0], x[1], x[2]), new S(x[3], x[4], x[5])]), _ = new Ft(M, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        _.renderOrder = 999, $t.add(_);
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
  window.__hekatanRefreshSelection = Vt, window.__hekatanClearSelection = () => {
    Ae.clear(), Vt();
  };
  const on = (t, o, a, n, s, i, c, f, m) => {
    const x = c - n, M = f - s, _ = m - i, p = x * x + M * M + _ * _;
    if (p < 1e-12) return Math.hypot(t - n, o - s, a - i);
    let D = ((t - n) * x + (o - s) * M + (a - i) * _) / p;
    D = Math.max(0, Math.min(1, D));
    const j = n + D * x, H = s + D * M, q = i + D * _;
    return Math.hypot(t - j, o - H, a - q);
  }, vn = (t, o, a, n) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let c = -1, f = -1, m = n;
    for (let x = 0; x < s.length; x++) {
      const M = s[x];
      for (let _ = 0; _ < M.length - 1; _++) {
        const p = i[M[_]], D = i[M[_ + 1]];
        if (!p || !D) continue;
        const j = on(t, o, a, p[0], p[1], p[2], D[0], D[1], D[2]);
        j < m && (m = j, c = x, f = _);
      }
    }
    return c >= 0 ? { polyIdx: c, segIdx: f, dist: m } : null;
  }, Ln = (t, o, a, n) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let c = -1, f = n;
    for (let m = 0; m < i.length; m++) {
      const x = i[m];
      if (!x || x.length !== 6) continue;
      const M = on(t, o, a, x[0], x[1], x[2], x[3], x[4], x[5]);
      M < f && (f = M, c = m);
    }
    return c;
  }, so = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      dt.visible = false;
      return;
    }
    dt.geometry.setFromPoints([new S(n[0], n[1], n[2]), new S(n[3], n[4], n[5])]), dt.visible = true;
  }, ao = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!a || a.length < 2) {
      dt.visible = false;
      return;
    }
    const s = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const c of a) {
      const f = n[c];
      f && i.push(new S(f[0], f[1], f[2]));
    }
    else {
      const c = n[a[o]], f = n[a[o + 1]];
      c && i.push(new S(c[0], c[1], c[2])), f && i.push(new S(f[0], f[1], f[2]));
    }
    dt.geometry.setFromPoints(i), dt.visible = true;
  }, sn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const a = o.filter((m, x) => x !== t), n = /* @__PURE__ */ new Set();
    for (const m of a) for (const x of m) n.add(x);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), c = [];
    for (let m = 0; m < s.length; m++) n.has(m) && (i.set(m, c.length), c.push(s[m]));
    const f = a.map((m) => m.map((x) => i.get(x)).filter((x) => x !== void 0));
    e.points.val = c, e.polylines.val = f, e.areas && (e.areas.val = e.areas.rawVal.filter((m) => m !== t).map((m) => m > t ? m - 1 : m)), dt.visible = false, Be = -1, Je = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, In = (t, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (t < 0 || t >= a.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false) {
      sn(t);
      return;
    }
    const s = a[t];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      sn(t);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const c = [...a.slice(0, t), ...i, ...a.slice(t + 1)], f = /* @__PURE__ */ new Set();
    for (const p of c) for (const D of p) f.add(D);
    const m = e.points.rawVal, x = /* @__PURE__ */ new Map(), M = [];
    for (let p = 0; p < m.length; p++) f.has(p) && (x.set(p, M.length), M.push(m[p]));
    const _ = c.map((p) => p.map((D) => x.get(D)).filter((D) => D !== void 0));
    if (e.points.val = M, e.polylines.val = _, e.areas) {
      const p = i.length - 1;
      e.areas.val = e.areas.rawVal.map((D) => D > t ? D + p : D);
    }
    dt.visible = false, Be = -1, Je = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  R.geometry.setAttribute("position", new Ct(e.points.rawVal.flat(), 3)), R.geometry.computeBoundingSphere(), R.frustumCulled = false, ie.frustumCulled = false, r.add(ie), W.position.set(0, 0, 0), W.rotateX(Math.PI / 2), W.geometry.rotateX(Math.PI / 2), W.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, a) => {
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
  const an = [];
  window.__hekatanCirculos = an;
  let Rn = [], Dn = "";
  const bn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${t.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === Dn) return Rn;
    Dn = a;
    const n = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const c = s.slice(0, i - 1).map((M) => t[M]).filter(Boolean);
      if (c.length < 5) continue;
      const f = [0, 1, 2].map((M) => c.reduce((_, p) => _ + p[M], 0) / c.length), m = c.map((M) => Math.hypot(M[0] - f[0], M[1] - f[1], M[2] - f[2])), x = m.reduce((M, _) => M + _, 0) / m.length;
      x < 1e-9 || m.some((M) => Math.abs(M - x) > 5e-3 * x) || n.push({ c: f, r: x });
    }
    return Rn = n;
  };
  window.__hekatanCentrosDeducidos = bn, window.__hekatanDrawCircle = (t, o, a, n, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const c = Math.max(4, Math.round(s)), f = e.points.rawVal.length, m = [];
    for (let x = 0; x < c; x++) {
      const M = 2 * Math.PI * x / c, _ = n * Math.cos(M), p = n * Math.sin(M);
      let D;
      i === "xy" ? D = [t + _, o + p, a] : i === "xz" ? D = [t + _, o, a + p] : D = [t, o + _, a + p], m.push(D);
    }
    if (e.points.val = [...e.points.rawVal, ...m], an.push({ c: [t, o, a], r: n }), e.polylines) {
      const x = [...m.map((_, p) => f + p), f], M = e.polylines.rawVal;
      ((_a2 = M[M.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...M, x, []] : e.polylines.val = [...M.slice(0, -1), x, []];
    }
  }, window.__hekatanDrawArc = (t, o, a, n = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(n)), i = new S(...t), c = new S(...o), f = new S(...a), m = new S().subVectors(c, i), x = new S().subVectors(f, i), M = new S().crossVectors(m, x).normalize(), _ = new S().addVectors(i, c).multiplyScalar(0.5), p = new S().addVectors(c, f).multiplyScalar(0.5), D = new S().crossVectors(m, M).normalize(), j = new S().crossVectors(new S().subVectors(f, c), M).normalize(), H = new S().subVectors(p, _), q = D.x * j.y - D.y * j.x;
    let g;
    if (Math.abs(q) > 1e-9) {
      const fe = (H.x * j.y - H.y * j.x) / q;
      g = new S().addVectors(_, D.clone().multiplyScalar(fe));
    } else g = _.clone();
    const V = i.distanceTo(g), T = new S().subVectors(i, g), G = new S().subVectors(f, g), P = Math.acos(Math.max(-1, Math.min(1, T.dot(G) / (V * V)))), C = e.points.rawVal.length, U = [], ne = M.clone();
    for (let fe = 0; fe <= s; fe++) {
      const _e = fe / s, Ge = P * _e, $e = new Hn().setFromAxisAngle(ne, Ge), et = T.clone().applyQuaternion($e).add(g);
      U.push([et.x, et.y, et.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...U], an.push({ c: [g.x, g.y, g.z], r: V }), e.polylines) {
      const fe = U.map((Ge, $e) => C + $e), _e = e.polylines.rawVal;
      e.polylines.val = [..._e.slice(0, -1), fe, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, a = 1, n = 6, s = 6) => {
    const i = Math.min(t[0], o[0]), c = Math.max(t[0], o[0]), f = Math.min(t[1], o[1]), m = Math.max(t[1], o[1]), x = (t[2] + o[2]) / 2, M = c - i, _ = m - f, p = Math.min(a, M / 2 - 0.01, _ / 2 - 0.01);
    if (p <= 0) return;
    const D = e.points.rawVal.length, j = [], H = [], q = (g, V) => {
      j.push([g, V, x]), H.push(D + j.length - 1);
    };
    for (let g = 0; g <= s; g++) q(i + p + (M - 2 * p) * g / s, f);
    for (let g = 1; g <= n; g++) {
      const V = -Math.PI / 2 + Math.PI / 2 * g / n;
      q(c - p + p * Math.cos(V), f + p + p * Math.sin(V));
    }
    for (let g = 1; g <= s; g++) q(c, f + p + (_ - 2 * p) * g / s);
    for (let g = 1; g <= n; g++) {
      const V = 0 + Math.PI / 2 * g / n;
      q(c - p + p * Math.cos(V), m - p + p * Math.sin(V));
    }
    for (let g = 1; g <= s; g++) q(c - p - (M - 2 * p) * g / s, m);
    for (let g = 1; g <= n; g++) {
      const V = Math.PI / 2 + Math.PI / 2 * g / n;
      q(i + p + p * Math.cos(V), m - p + p * Math.sin(V));
    }
    for (let g = 1; g <= s; g++) q(i, m - p - (_ - 2 * p) * g / s);
    for (let g = 1; g <= n; g++) {
      const V = Math.PI + Math.PI / 2 * g / n;
      q(i + p + p * Math.cos(V), f + p + p * Math.sin(V));
    }
    if (H.push(D), e.points.val = [...e.points.rawVal, ...j], e.polylines) {
      const g = e.polylines.rawVal;
      e.polylines.val = [...g.slice(0, -1), H, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], c = o[0], f = o[1], m = o[2];
    let x;
    if (Math.abs(i - m) < 1e-6 ? x = [[n, s, i], [c, s, i], [c, f, i], [n, f, i]] : Math.abs(s - f) < 1e-6 ? x = [[n, s, i], [c, s, i], [c, s, m], [n, s, m]] : x = [[n, s, i], [n, f, i], [n, f, m], [n, s, m]], e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = [a, a + 1, a + 2, a + 3, a], _ = e.polylines.rawVal;
      e.polylines.val = [..._.slice(0, -1), M, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], c = o[0], f = o[1], m = o[2];
    let x;
    if (I && e.gridTarget) {
      const M = e.gridTarget.rawVal, _ = new An(...M.rotation), p = new S(1, 0, 0).applyEuler(_), D = new S(0, 1, 0).applyEuler(_), j = new S(...M.position), H = new S(n, s, i), q = new S(c, f, m), g = H.clone().sub(j).dot(p), V = H.clone().sub(j).dot(D), T = q.clone().sub(j).dot(p), G = q.clone().sub(j).dot(D), P = (C, U) => j.clone().addScaledVector(p, C).addScaledVector(D, U).toArray();
      x = [P(g, V), P(T, V), P(T, G), P(g, G)];
    } else Math.abs(i - m) < 1e-6 ? x = [[n, s, i], [c, s, i], [c, f, i], [n, f, i]] : Math.abs(s - f) < 1e-6 ? x = [[n, s, i], [c, s, i], [c, s, m], [n, s, m]] : x = [[n, s, i], [n, f, i], [n, f, m], [n, s, m]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const M = e.polylines.rawVal, _ = M.length - 1, p = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [...M.slice(0, -1), p, []], e.areas && (e.areas.val = [...e.areas.rawVal, _]);
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
    for (let ke = 0; ke < a; ke++) {
      const Re = t[ke], tt = t[(ke + 1) % a];
      n += (Re[1] - tt[1]) * (Re[2] + tt[2]), s += (Re[2] - tt[2]) * (Re[0] + tt[0]), i += (Re[0] - tt[0]) * (Re[1] + tt[1]);
    }
    const c = Math.hypot(n, s, i) || 1;
    n /= c, s /= c, i /= c;
    let f = t[1][0] - t[0][0], m = t[1][1] - t[0][1], x = t[1][2] - t[0][2];
    const M = Math.hypot(f, m, x) || 1;
    f /= M, m /= M, x /= M;
    let _ = s * x - i * m, p = i * f - n * x, D = n * m - s * f;
    const j = Math.hypot(_, p, D) || 1;
    _ /= j, p /= j, D /= j;
    const H = t[0], q = (ke) => [(ke[0] - H[0]) * f + (ke[1] - H[1]) * m + (ke[2] - H[2]) * x, (ke[0] - H[0]) * _ + (ke[1] - H[1]) * p + (ke[2] - H[2]) * D], g = (ke, Re) => [H[0] + ke * f + Re * _, H[1] + ke * m + Re * p, H[2] + ke * x + Re * D], V = t.map(q);
    let T = 1 / 0, G = -1 / 0, P = 1 / 0, C = -1 / 0;
    for (const [ke, Re] of V) ke < T && (T = ke), ke > G && (G = ke), Re < P && (P = Re), Re > C && (C = Re);
    const U = G - T, ne = C - P;
    if (U < 1e-6 || ne < 1e-6) return 0;
    let fe = o && o > 0 ? o : 0.5;
    for (; U / fe * (ne / fe) > 2500; ) fe *= 2;
    fe = Math.min(fe, Math.min(U, ne));
    const _e = (ke, Re) => {
      let tt = false;
      for (let It = 0, Nt = V.length - 1; It < V.length; Nt = It++) {
        const [Rt, Qt] = V[It], [bo, qn] = V[Nt];
        Qt > Re != qn > Re && ke < (bo - Rt) * (Re - Qt) / (qn - Qt) + Rt && (tt = !tt);
      }
      return tt;
    }, Ge = Math.max(1, Math.round(U / fe)), $e = Math.max(1, Math.round(ne / fe)), et = U / Ge, nt = ne / $e, at = /* @__PURE__ */ new Map(), je = [], Le = e.points.rawVal.length, ot = (ke, Re) => {
      const tt = ke + "," + Re, It = at.get(tt);
      if (It !== void 0) return It;
      const Nt = Le + je.length;
      return je.push(g(T + ke * et, P + Re * nt)), at.set(tt, Nt), Nt;
    }, Ye = [];
    for (let ke = 0; ke < Ge; ke++) for (let Re = 0; Re < $e; Re++) {
      if (!_e(T + (ke + 0.5) * et, P + (Re + 0.5) * nt)) continue;
      const tt = ot(ke, Re), It = ot(ke + 1, Re), Nt = ot(ke + 1, Re + 1), Rt = ot(ke, Re + 1);
      Ye.push([tt, It, Nt, Rt]);
    }
    if (!Ye.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...je], e.polylines && e.areas) {
      let ke = e.polylines.rawVal.slice();
      ke.length && ke[ke.length - 1].length === 0 && (ke = ke.slice(0, -1));
      const Re = [];
      for (const tt of Ye) Re.push(ke.length), ke.push([tt[0], tt[1], tt[2], tt[3], tt[0]]);
      ke.push([]), e.polylines.val = ke, e.areas.val = [...e.areas.rawVal, ...Re];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), Ye.length;
  };
  const pn = () => {
    if (xe.length < 3) return xe = [], O.visible = false, y(), 0;
    const t = window.__hekatanMeshPolyArea(xe.slice());
    return xe = [], O.visible = false, y(), t;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, a) => {
    var _a2;
    const n = new S(t[0], t[1], t[2]), s = new S(o[0], o[1], o[2]), i = new S(a[0], a[1], a[2]), c = new S().subVectors(s, n).cross(new S().subVectors(i, n));
    if (c.lengthSq() < 1e-9) return false;
    c.normalize();
    const f = new Hn().setFromUnitVectors(new S(0, 0, 1), c), m = new An().setFromQuaternion(f);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [m.x, m.y, m.z] }), I = true;
    const x = new S().addVectors(n, s).add(i).multiplyScalar(1 / 3), M = Math.max(n.distanceTo(s), n.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, _ = M / 2;
    Ee.geometry.dispose(), Ee.geometry = new en(M, M), Me.geometry.dispose(), Me.geometry = new ls(new en(M, M)), Ke(_, 1), ge.position.copy(x), ge.quaternion.copy(f), ge.scale.set(1, 1, 1), ge.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return y(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), I = false, ge.visible = false, y();
  };
  const Kt = new it();
  Kt.visible = false, r.add(Kt), window.__hekatanShowAxes = (t, o, a = 12, n = 2) => {
    var _a2, _b;
    for (; Kt.children.length; ) {
      const M = Kt.children.pop();
      (_a2 = M.geometry) == null ? void 0 : _a2.dispose(), (_b = M.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const s = Math.min(...o) - n, i = Math.max(...o) + n, c = Math.min(...t) - n, f = Math.max(...t) + n, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", x = (M, _, p, D, j) => {
      const H = document.createElement("canvas");
      H.width = 64, H.height = 32;
      const q = H.getContext("2d");
      q.fillStyle = j, q.font = "bold 22px sans-serif", q.textAlign = "center", q.fillText(M, 32, 26);
      const g = new rs(H), V = new cs({ map: g, transparent: true }), T = new ds(V);
      return T.position.set(_, p, D), T.scale.set(1.2, 0.6, 1), T;
    };
    t.forEach((M, _) => {
      const p = _ < m.length ? m[_] : `X${_}`, D = new ze().setFromPoints([new S(M, s, 0), new S(M, i, 0), new S(M, s, 0), new S(M, s, a)]), j = new Fn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), H = new Wt(D, j);
      H.computeLineDistances(), Kt.add(H), Kt.add(x(p, M, s - 0.5, 0, "#60a5fa")), Kt.add(x(p, M, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((M, _) => {
      const p = `${_ + 1}`, D = new ze().setFromPoints([new S(c, M, 0), new S(f, M, 0), new S(c, M, 0), new S(c, M, a)]), j = new Fn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), H = new Wt(D, j);
      H.computeLineDistances(), Kt.add(H), Kt.add(x(p, c - 0.5, M, 0, "#fb7185")), Kt.add(x(p, f + 0.5, M, 0, "#fb7185"));
    }), Kt.visible = true, y();
  }, window.__hekatanHideAxes = () => {
    Kt.visible = false, y();
  };
  const Ot = new it();
  Ot.visible = false, r.add(Ot);
  let un = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, a = 0, n = 0) => {
    var _a2, _b;
    for (; Ot.children.length; ) {
      const i = Ot.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    un.forEach((i) => {
      r.remove(i), i.geometry.dispose(), i.material.dispose();
    }), un = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, c) => {
      const f = s[c % s.length], m = o / 2, x = [new S(a - m, n - m, i), new S(a + m, n - m, i), new S(a + m, n + m, i), new S(a - m, n + m, i), new S(a - m, n - m, i)], M = new ze().setFromPoints(x), _ = new ht({ color: f, transparent: true, opacity: 0.55 });
      Ot.add(new Ft(M, _));
      const p = document.createElement("canvas");
      p.width = 128, p.height = 32;
      const D = p.getContext("2d");
      D.fillStyle = `#${f.toString(16).padStart(6, "0")}`, D.font = "bold 18px sans-serif", D.fillText(`Z = ${i} m`, 4, 22);
      const j = new rs(p), H = new cs({ map: j, transparent: true }), q = new ds(H);
      q.position.set(a - m - 1.5, n - m - 1.5, i), q.scale.set(2.5, 0.6, 1), Ot.add(q);
      const g = new en(1e4, 1e4), V = new ft({ visible: false, side: At }), T = new lt(g, V);
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
      const a = Mn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const n = new ze().setFromPoints([new S(a[0], a[1], a[2]), new S(a[3], a[4], a[5])]), s = new Fn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Ft(n, s);
      i.computeLineDistances(), Mn.add(i);
    }
  };
  ee.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, As(), y());
  });
  const fn = new it();
  fn.frustumCulled = false, r.add(fn);
  const Ro = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const a = fn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const n = new lt(new xn(0.025, 12, 12), new ft({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(a[0], a[1], a[2]), n.renderOrder = 996, n.scale.setScalar(Dt(n.position)), fn.add(n);
    }
  };
  ee.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Ro(), y());
  }), u.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(Dt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Ro;
  const gt = new it(), Es = new lt(new xn(0.01, 12, 12), new ft({ color: 16724804, transparent: true, opacity: 0.95 })), Vs = new lt(new xn(0.015, 12, 12), new ft({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  gt.add(Es, Vs);
  const hn = 0.08, io = (t, o, a) => {
    const n = new ze().setFromPoints([new S(...t), new S(...o)]);
    return new Ft(n, new ht({ color: a, transparent: true, opacity: 0.7 }));
  };
  gt.add(io([-hn, 0, 0], [hn, 0, 0], 16711680)), gt.add(io([0, -hn, 0], [0, hn, 0], 65280)), gt.add(io([0, 0, -hn], [0, 0, hn], 35071)), gt.visible = false, gt.frustumCulled = false, r.add(gt);
  let lo = 2;
  const Bn = (t) => {
    const o = d(), a = (v == null ? void 0 : v.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
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
  }), window.__hekatanShowSnap = (t, o, a) => {
    gt.position.set(t, o, a), gt.visible = true, _n(), y();
  }, window.__hekatanHideSnap = () => {
    gt.visible = false, y();
  }, v.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = b(t);
    if (!o) return;
    k.setFromCamera(F, o);
    const a = oe();
    if (a.length) {
      const n = a[0].point, s = t.altKey, i = ro(n), c = s ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: t.clientX, y: t.clientY });
      if (c) Zo(c.type, c.x, c.y, c.z), gt.position.set(c.x, c.y, c.z), gt.visible = true, n.set(c.x, c.y, c.z), Uo(c.type, t.clientX, t.clientY);
      else {
        Is(), Yn();
        const _ = !s && window.__hekatanSnapEnabled !== false, p = window.__hekatanSnap2D ?? 0.5;
        _ && p > 0 && (n.x = Math.round(n.x / p) * p, n.y = Math.round(n.y / p) * p, n.z = Math.round(n.z / p) * p), gt.position.copy(n), gt.visible = true;
      }
      _n();
      const f = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (f === "select" || !f) {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, p = gn(n.x, n.y, n.z, _), D = vn(n.x, n.y, n.z, _), j = Ln(n.x, n.y, n.z, _);
        if (p >= 0) {
          const V = e.points.rawVal[p];
          _t.position.set(V[0], V[1], V[2]), _t.visible = true, Et(), Mt.visible = false, Ut = { kind: "pt", a: p };
        } else if (D) {
          const V = e.points.rawVal, T = e.polylines.rawVal[D.polyIdx], G = V[T[D.segIdx]], P = V[T[D.segIdx + 1]];
          Mt.geometry.setFromPoints([new S(G[0], G[1], G[2]), new S(P[0], P[1], P[2])]), Mt.visible = true, _t.visible = false, Ut = ((_f = (_e = e.areas) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.includes(D.polyIdx)) ?? false ? { kind: "poly", a: D.polyIdx } : { kind: "seg", a: D.polyIdx, b: D.segIdx };
        } else if (j >= 0) {
          const T = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[j];
          T && (Mt.geometry.setFromPoints([new S(T[0], T[1], T[2]), new S(T[3], T[4], T[5])]), Mt.visible = true, _t.visible = false, Ut = { kind: "aux", a: j });
        } else Mt.visible = false, _t.visible = false, Ut = null;
        ae.style.left = t.clientX + "px", ae.style.top = t.clientY + "px", ae.style.display = "block";
        let H = n;
        if ((Ut == null ? void 0 : Ut.kind) === "pt") {
          const V = e.points.rawVal[Ut.a];
          V && (H = new S(V[0], V[1], V[2]));
        }
        const q = `X=${H.x.toFixed(2)} Y=${H.y.toFixed(2)} Z=${H.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [H.x, H.y, H.z], Ut) {
          const V = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ae.textContent = `${q}  \xB7  \u{1F5B1} Click \u2192 ${V[Ut.kind]}`;
        } else ae.textContent = q;
        const g = document.getElementById("hk-coord-fixed");
        g && (g.textContent = q), qe = { p: H.clone(), x: t.clientX, y: t.clientY }, pe.visible = false, st.visible = false, ue.visible = false, y();
        return;
      }
      if (f === "delete" || f === "trim" || f === "extend" || f === "offset") {
        const _ = (window.__hekatanSnap2D ?? 0.5) * 1.5, p = vn(n.x, n.y, n.z, _), D = Ln(n.x, n.y, n.z, _);
        let j = false;
        if (D >= 0) if (!p) j = true;
        else {
          const V = window.__hekatanDrawingAuxLines, G = ((V == null ? void 0 : V.rawVal) ?? (V == null ? void 0 : V.val) ?? V ?? [])[D];
          on(n.x, n.y, n.z, G[0], G[1], G[2], G[3], G[4], G[5]) < p.dist && (j = true);
        }
        j ? (wt = D, Be = -1, Je = -1, so(D)) : p ? (Be = p.polyIdx, Je = p.segIdx, wt = -1, ao(p.polyIdx, p.segIdx)) : (Be = -1, Je = -1, wt = -1, dt.visible = false), pe.visible = false, st.visible = false, ue.visible = false, L(), ae.style.left = t.clientX + "px", ae.style.top = t.clientY + "px", ae.style.display = "block";
        const H = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let q = "";
        j ? q = `\u{1F5D1} l\xEDnea aux #${wt + 1}` : p ? q = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(p.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${p.polyIdx + 1}` : `\u{1F5D1} seg ${p.segIdx + 1} / poly #${p.polyIdx + 1}` : q = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ae.textContent = `${H}  \xB7  ${q}`;
        const g = document.getElementById("hk-coord-fixed");
        g && (g.textContent = H), y();
        return;
      } else dt.visible = false, Be = -1, wt = -1;
      ae.style.left = t.clientX + "px", ae.style.top = t.clientY + "px", ae.style.display = "block";
      const m = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], x = m[m.length - 1] ?? [], M = e.points.rawVal ?? [];
      if (x.length > 0 && M[x[x.length - 1]]) {
        const _ = x[x.length - 1], p = M[_];
        let D = Oe;
        if (kt = null, !D && window.__hekatanAxisSnap !== false) {
          const $e = v.getBoundingClientRect(), et = t.clientX, nt = t.clientY, at = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, je = new S(p[0], p[1], p[2]), Le = [["x", new S(1, 0, 0)], ["y", new S(0, 1, 0)], ["z", new S(0, 0, 1)]], ot = (ke) => {
            const Re = ke.clone().project(o);
            return { x: (Re.x * 0.5 + 0.5) * $e.width + $e.left, y: (-Re.y * 0.5 + 0.5) * $e.height + $e.top };
          };
          let Ye = null;
          for (const [ke, Re] of Le) {
            const tt = ot(je.clone().addScaledVector(Re, -at)), It = ot(je.clone().addScaledVector(Re, at)), Nt = It.x - tt.x, Rt = It.y - tt.y, Qt = et - tt.x, bo = nt - tt.y, qn = Nt * Nt + Rt * Rt || 1;
            let Kn = (Qt * Nt + bo * Rt) / qn;
            Kn = Math.max(0, Math.min(1, Kn));
            const ts = Math.hypot(et - (tt.x + Kn * Nt), nt - (tt.y + Kn * Rt));
            if (Ye === null || ts < Ye.dpx) {
              const Mo = k.ray, ns = je.clone().sub(Mo.origin), _o2 = Re.dot(Mo.direction), os = Re.dot(ns), qs = Mo.direction.dot(ns), ss = 1 - _o2 * _o2, Ks = Math.abs(ss) < 1e-6 ? -os : (_o2 * qs - os) / ss;
              Ye = { axis: ke, dpx: ts, pt: je.clone().addScaledVector(Re, Ks) };
            }
          }
          Ye && Ye.dpx <= 12 && (n.copy(Ye.pt), D = Ye.axis, kt = Ye.pt.clone());
        }
        const j = !!window.__hekatanOrthoMode;
        if (!D && j) {
          const $e = Math.abs(n.x - p[0]), et = Math.abs(n.y - p[1]), nt = Math.abs(n.z - p[2]), at = (_l = a[0]) == null ? void 0 : _l.object;
          let je = null;
          at === Ze ? je = "xy" : at === rt ? je = "xz" : at === Xe && (je = "yz"), je === "xy" ? D = $e >= et ? "x" : "y" : je === "xz" ? D = $e >= nt ? "x" : "z" : je === "yz" ? D = et >= nt ? "y" : "z" : D = $e >= et && $e >= nt ? "x" : et >= nt ? "y" : "z";
        }
        const H = window.__hekatanPolarTrack !== false;
        if (!D && H) {
          const $e = n.x - p[0], et = n.y - p[1], nt = n.z - p[2], at = Math.hypot($e, et, nt);
          if (at > 1e-3) {
            const Le = Math.tan(6 * Math.PI / 180) * at, ot = Math.hypot(et, nt), Ye = Math.hypot($e, nt), ke = Math.hypot($e, et), Re = [["x", ot], ["y", Ye], ["z", ke]];
            Re.sort((tt, It) => tt[1] - It[1]), Re[0][1] <= Le && (D = Re[0][0]);
          }
        }
        if (D) {
          const $e = p[0], et = p[1], nt = p[2];
          D === "x" ? n.set(n.x, et, nt) : D === "y" ? n.set($e, n.y, nt) : n.set($e, et, n.z);
          const at = !!Oe, Le = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[D];
          Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = Le, Ce.style.border = `1.5px solid ${Le}`;
          const ot = (_m = a[0]) == null ? void 0 : _m.object;
          let Ye = null;
          ot === Ze ? Ye = "xy" : ot === rt ? Ye = "xz" : ot === Xe && (Ye = "yz");
          const ke = Ye ? ` (plano ${Ye.toUpperCase()})` : "";
          Ce.textContent = at ? `\u{1F512} LOCK ${D.toUpperCase()}${ke}` : `\u22A5 ORTO ${D.toUpperCase()}${ke}`, Ce.style.left = t.clientX + 20 + "px", Ce.style.top = t.clientY + 18 + "px", Ce.style.transform = "none", Ce.style.display = "block";
        } else Oe || (Ce.style.display = "none");
        let q = null;
        if (!s && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const $e = e.points.rawVal, et = D ? [D] : ["z", "x", "y"], nt = { x: t.clientX, y: t.clientY };
          let at = 1 / 0;
          for (const je of $e) if (!(Math.abs(je[0] - p[0]) < 1e-9 && Math.abs(je[1] - p[1]) < 1e-9 && Math.abs(je[2] - p[2]) < 1e-9)) for (const Le of et) {
            const ot = new S(Le === "x" ? je[0] : n.x, Le === "y" ? je[1] : n.y, Le === "z" ? je[2] : n.z), Ye = ho(ot.x, ot.y, ot.z);
            if (!Ye) continue;
            const ke = Math.hypot(Ye.x - nt.x, Ye.y - nt.y);
            ke < kn && ke < at && (at = ke, q = { q: je, eje: Le });
          }
        }
        q ? (q.eje === "x" ? n.x = q.q[0] : q.eje === "y" ? n.y = q.q[1] : n.z = q.q[2], ue.geometry.setFromPoints([new S(q.q[0], q.q[1], q.q[2]), new S(n.x, n.y, n.z)]), (_n2 = ue.computeLineDistances) == null ? void 0 : _n2.call(ue), ue.visible = true, gt.position.set(n.x, n.y, n.z), gt.visible = true, Uo("track", t.clientX, t.clientY)) : ue.visible = false, qe = { p: n.clone(), x: t.clientX, y: t.clientY };
        const g = Math.hypot(n.x - p[0], n.y - p[1], n.z - p[2]), V = Math.atan2(n.y - p[1], n.x - p[0]) * 180 / Math.PI, T = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ae.textContent = `${T} | \u0394L=${g.toFixed(2)}m ${V.toFixed(0)}\xB0`;
        const G = document.getElementById("hk-coord-fixed");
        G && (G.textContent = T), pe.geometry.setFromPoints([new S(p[0], p[1], p[2]), new S(n.x, n.y, n.z)]), (_o = pe.computeLineDistances) == null ? void 0 : _o.call(pe), pe.visible = true, Y(p[0], p[1], p[2], n.x, n.y, n.z);
        const P = window.__hekatanOrthoExt ?? 8, C = window.__hekatanShowOrthoPlanes !== false;
        We.visible = C, C || xt(null), C && (Ne(me, p, "xy", P), Ne(De, p, "xz", P), Ne(Te, p, "yz", P), we(Ze, p, "xy", P), we(rt, p, "xz", P), we(Xe, p, "yz", P));
        const U = C ? k.intersectObjects([Ze, rt, Xe], false) : [];
        let ne = null;
        if (U.length > 0) {
          const $e = U[0].object;
          $e === Ze ? ne = "xy" : $e === rt ? ne = "xz" : $e === Xe && (ne = "yz");
        }
        xt(ne), ne && (Pe.style.left = t.clientX + "px", Pe.style.top = t.clientY + "px"), z.geometry.setFromPoints([new S(p[0] - P, p[1], p[2]), new S(p[0] + P, p[1], p[2])]), (_p = z.computeLineDistances) == null ? void 0 : _p.call(z), K.geometry.setFromPoints([new S(p[0], p[1] - P, p[2]), new S(p[0], p[1] + P, p[2])]), (_q = K.computeLineDistances) == null ? void 0 : _q.call(K), Q.geometry.setFromPoints([new S(p[0], p[1], p[2] - P), new S(p[0], p[1], p[2] + P)]), (_r = Q.computeLineDistances) == null ? void 0 : _r.call(Q), st.visible = true;
        const fe = z.material, _e2 = K.material, Ge = Q.material;
        D === "x" ? (fe.opacity = 0.95, _e2.opacity = 0.1, Ge.opacity = 0.1) : D === "y" ? (fe.opacity = 0.1, _e2.opacity = 0.95, Ge.opacity = 0.1) : D === "z" ? (fe.opacity = 0.1, _e2.opacity = 0.1, Ge.opacity = 0.95) : (fe.opacity = 0.5, _e2.opacity = 0.5, Ge.opacity = 0.5);
      } else {
        const _ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ae.textContent = _;
        const p = document.getElementById("hk-coord-fixed");
        if (p && (p.textContent = _), pe.visible = false, st.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(f)) {
          if ($ = null, Z = null, B.style.left = t.clientX + 20 + "px", B.style.top = t.clientY - 28 + "px", B.style.display = "block", !X) {
            B.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const j = document.activeElement;
            !(j && (j.tagName === "INPUT" || j.tagName === "TEXTAREA") && j !== B) && document.activeElement !== B && B.focus({ preventScroll: true });
            try {
              B.select();
            } catch {
            }
          }
        } else L();
      }
      y();
    } else Yn(), ae.style.display = "none", gt.visible = false, pe.visible = false, st.visible = false, L(), y();
  }), ee.derive(() => {
    var _a2;
    if (!e.gridTarget) return;
    const t = new Hn().setFromEuler(new An(...e.gridTarget.val.rotation)), o = new Hn().setFromAxisAngle(new S(1, 0, 0), Math.PI / 2);
    $a(l, { position: new S(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, y);
    {
      const n = e.gridTarget.val.position[2], s = Math.abs(t.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of J) r.remove(i), ve(i);
      if (J.length = 0, s) {
        const i = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], c = /* @__PURE__ */ new Set([0]);
        for (const m of i) c.add(+m[2].toFixed(3));
        for (const m of window.__hekatanLevels ?? []) isFinite(m == null ? void 0 : m.z) && c.add(+m.z.toFixed(3));
        const f = [...c].sort((m, x) => m - x).slice(0, 24);
        for (const m of f) {
          if (Math.abs(m - n) < 1e-6) continue;
          const x = l.clone(true);
          x.name = `hekatan-grid-nivel-${m}`, x.traverse((M) => {
            M.material && (M.material = M.material.clone(), M.material.transparent = true, M.material.opacity = (M.material.opacity ?? 1) * (Math.abs(m) < 1e-6 ? 0.5 : 0.22));
          }), x.position.set(0, 0, m), x.quaternion.copy(o), r.add(x), J.push(x);
        }
      }
    }
    W.position.set(...e.gridTarget.val.position), W.quaternion.setFromEuler(new An(...e.gridTarget.val.rotation)), W.updateMatrixWorld();
    const a = new S(0, 0, 1).applyEuler(new An(...e.gridTarget.val.rotation));
    I = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  }), ee.derive(() => {
    R.geometry.setAttribute("position", new Ct(e.points.val.flat(), 3)), R.geometry.computeBoundingSphere();
  }), ee.derive(() => {
    const t = 0.05 * h * 0.5 * w.val;
    k.params.Points.threshold = 0.4 * t;
  }), ee.derive(() => {
    var _a2;
    const t = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of a) {
      const [c, f, m] = t[i];
      n.push(c, f, m);
    }
    const s = new ze();
    s.setAttribute("position", new Ct(n, 3)), le.geometry.dispose(), le.geometry = s;
  });
  let co = false, ln = 0;
  v.addEventListener("pointerdown", () => {
    co = true;
  }), v.addEventListener("pointerup", () => {
    co = false;
  }), v.addEventListener("pointermove", () => {
    co && ln++;
  });
  const Lt = document.createElement("div");
  Lt.id = "hk-window-select", Lt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Lt);
  let Gt = null, Sn = false, Yt = null;
  const po = (t, o, a, n, s) => {
    s ? (Lt.style.borderColor = "#34d399", Lt.style.borderStyle = "dashed", Lt.style.background = "rgba(52, 211, 153, 0.10)") : (Lt.style.borderColor = "#22d3ee", Lt.style.borderStyle = "solid", Lt.style.background = "rgba(34, 211, 238, 0.10)"), Lt.style.left = Math.min(t, a) + "px", Lt.style.top = Math.min(o, n) + "px", Lt.style.width = Math.abs(a - t) + "px", Lt.style.height = Math.abs(n - o) + "px", Lt.style.display = "block";
  }, Bo = (t, o, a, n, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, a), c = Math.max(t, a), f = Math.min(o, n), m = Math.max(o, n), x = a < t, M = v.getBoundingClientRect(), _ = d();
    _.updateMatrixWorld();
    const p = (C) => {
      const U = new S(C[0], C[1], C[2]);
      return U.project(_), { x: M.left + (U.x * 0.5 + 0.5) * M.width, y: M.top + (-U.y * 0.5 + 0.5) * M.height };
    }, D = (C) => C.x >= i && C.x <= c && C.y >= f && C.y <= m, j = (C, U) => !(C.x < i && U.x < i || C.x > c && U.x > c || C.y < f && U.y < f || C.y > m && U.y > m);
    s || Ae.clear();
    let H = 0;
    const q = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let C = 0; C < q.length; C++) {
      const U = q[C];
      U && D(p(U)) && (Ae.add(`pt:${C}`), H++);
    }
    const g = (C, U) => x ? D(C) || D(U) || j(C, U) : D(C) && D(U), V = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], T = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let C = 0; C < V.length; C++) {
      const U = V[C];
      if (T.includes(C)) {
        let fe;
        if (!x) fe = U.every((_e) => {
          const Ge = q[_e];
          return !!Ge && D(p(Ge));
        });
        else {
          fe = false;
          for (let _e = 0; _e < U.length - 1; _e++) {
            const Ge = q[U[_e]], $e = q[U[_e + 1]];
            if (!(!Ge || !$e) && g(p(Ge), p($e))) {
              fe = true;
              break;
            }
          }
        }
        fe && (Ae.add(`poly:${C}`), H++);
      } else for (let fe = 0; fe < U.length - 1; fe++) {
        const _e = q[U[fe]], Ge = q[U[fe + 1]];
        !_e || !Ge || g(p(_e), p(Ge)) && (Ae.add(`seg:${C}:${fe}`), H++);
      }
    }
    const P = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let C = 0; C < P.length; C++) {
      const U = P[C];
      if (!U || U.length !== 6) continue;
      const ne = p([U[0], U[1], U[2]]), fe = p([U[3], U[4], U[5]]);
      g(ne, fe) && (Ae.add(`aux:${C}`), H++);
    }
    Vt(), de(H === 0 && !x ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${x ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${H} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ae.size})`), Lt.style.display = "none";
  }, Xn = () => {
    Yt && (Yt = null, Lt.style.display = "none", de("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Xn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Yt && Xn();
  });
  const Xo = () => {
    var _a2, _b, _c, _d;
    if (Ae.size === 0) return false;
    const t = [...Ae], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], c = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
    for (const j of t) {
      const [H, ...q] = j.split(":");
      if (H === "pt") c.add(+q[0]);
      else if (H === "poly") f.add(+q[0]);
      else if (H === "seg") {
        const g = +q[0], V = +q[1];
        m.has(g) || m.set(g, /* @__PURE__ */ new Set()), m.get(g).add(V);
      } else H === "aux" && x.add(+q[0]);
    }
    let M = 0, _ = [], p = [];
    const D = /* @__PURE__ */ new Map();
    for (let j = 0; j < a.length; j++) {
      if (f.has(j)) {
        M++;
        continue;
      }
      D.set(j, _.length);
      const H = m.get(j);
      if (H && H.size > 0) {
        let q = [];
        for (let g = 0; g < a[j].length; g++) q.push(a[j][g]), g < a[j].length - 1 && H.has(g) && (q.length >= 2 && _.push(q), q = [], M++);
        (q.length >= 2 || q.length === 1) && _.push(q);
      } else _.push([...a[j]]);
    }
    if (c.size > 0) {
      const j = [], H = /* @__PURE__ */ new Map();
      for (let g = 0; g < o.length; g++) {
        if (c.has(g)) {
          M++;
          continue;
        }
        H.set(g, j.length), j.push([...o[g]]);
      }
      const q = [];
      for (const g of _) {
        let V = [];
        for (const T of g) {
          const G = H.get(T);
          G === void 0 ? (V.length >= 2 && q.push(V), V = []) : V.push(G);
        }
        V.length >= 2 && q.push(V);
      }
      _ = q, e.points.val = j;
    }
    for (const j of n) {
      const H = D.get(j);
      H !== void 0 && H < _.length && p.push(H);
    }
    if (e.polylines && (e.polylines.val = _), e.areas && (e.areas.val = p), x.size > 0 && s) {
      const j = i.filter((H, q) => !x.has(q));
      "val" in s ? s.val = j : window.__hekatanDrawingAuxLines = j, M += x.size;
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
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || Ae.size !== 0 && (t.preventDefault(), Xo());
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
    let o = false, a = 0, n = 0, s = 0, i = 0;
    t.addEventListener("mousedown", (c) => {
      o = true, a = c.clientX, n = c.clientY;
      const f = Bt.getBoundingClientRect();
      s = f.left, i = f.top, Bt.style.transform = "none", Bt.style.left = `${s}px`, Bt.style.top = `${i}px`, c.preventDefault();
    }), window.addEventListener("mousemove", (c) => {
      if (!o) return;
      const f = c.clientX - a, m = c.clientY - n, x = Math.max(0, Math.min(window.innerWidth - 80, s + f)), M = Math.max(0, Math.min(window.innerHeight - 40, i + m));
      Bt.style.left = `${x}px`, Bt.style.top = `${M}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(No, JSON.stringify({ left: parseFloat(Bt.style.left), top: parseFloat(Bt.style.top) }));
        } catch {
        }
      }
    });
  }, re = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Tt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let pt = null;
  const St = (t, o, a, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: a, value: n } }));
  }, $s = () => {
    if (pt && (pt.dispose(), pt = null), Ae.size === 0) {
      Bt.style.display = "none";
      return;
    }
    const t = [...Ae], o = t.filter((_) => _.startsWith("pt:")), a = t.filter((_) => _.startsWith("seg:")), n = t.filter((_) => _.startsWith("poly:")), s = t.filter((_) => _.startsWith("aux:")), i = o.length > 0, c = a.length > 0, f = n.length > 0, m = !i && !c && !f, x = [];
    o.length && x.push(`\u{1F535} ${o.length} nodo(s)`), a.length && x.push(`\u{1F4CF} ${a.length} segmento(s)`), n.length && x.push(`\u25AD ${n.length} \xE1rea(s)`), s.length && x.push(`\u250A ${s.length} aux`);
    const M = `\u{1F3AF} ${Ae.size} item(s) \u2014 ${x.join(", ")}`;
    pt = new Ms({ container: Bt, title: M });
    {
      const _ = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      _.addBinding(Tt, "dx", { label: "\u0394x (m)", step: 0.1 }), _.addBinding(Tt, "dy", { label: "\u0394y (m)", step: 0.1 }), _.addBinding(Tt, "dz", { label: "\u0394z (m)", step: 0.1 }), _.addBinding(Tt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), _.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const H = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, Tt.copias);
        de(H ? `\u29C9 Replicado \xD7${H} (\u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const p = { vuelo: 1.5, losa: true, borde: true, ambos: true }, D = _.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      D.addBinding(p, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), D.addBinding(p, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), D.addBinding(p, "borde", { label: "con viga de borde" }), D.addBinding(p, "ambos", { label: "a los dos lados" }), D.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a2;
        const H = (_a2 = window.__hekatanVoladoSelection) == null ? void 0 : _a2.call(window, p.vuelo, { losa: p.losa, vigaBorde: p.borde, lados: p.ambos ? "ambos" : "afuera" });
        de(H ? `\u2310 Volado de ${p.vuelo} m en ${H} pa\xF1o(s)` + (p.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), _.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const H = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, 1);
        de(H ? `\u2192 Copia desplazada \u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const j = _.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      j.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), j.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), de(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const _ = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      _.addBinding(re, "Ux"), _.addBinding(re, "Uy"), _.addBinding(re, "Uz"), _.addBinding(re, "Rx"), _.addBinding(re, "Ry"), _.addBinding(re, "Rz");
      const p = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      p.addBinding(re, "Kx", { label: "Kx", min: 0, step: 100 }), p.addBinding(re, "Ky", { label: "Ky", min: 0, step: 100 }), p.addBinding(re, "Kz", { label: "Kz", min: 0, step: 100 }), p.addBinding(re, "Krx", { label: "Krx", min: 0, step: 1e3 }), p.addBinding(re, "Kry", { label: "Kry", min: 0, step: 1e3 }), p.addBinding(re, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const D = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      D.addBinding(re, "Fx", { step: 0.1 }), D.addBinding(re, "Fy", { step: 0.1 }), D.addBinding(re, "Fz", { step: 0.1 }), D.addBinding(re, "Mx", { step: 0.1 }), D.addBinding(re, "My", { step: 0.1 }), D.addBinding(re, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(re, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(re, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let q = 0;
        const g = [re.Ux, re.Uy, re.Uz, re.Rx, re.Ry, re.Rz];
        g.some((G) => G) && (St("nodes", o, "supports", g), q++);
        const V = [re.Fx, re.Fy, re.Fz, re.Mx, re.My, re.Mz];
        V.some((G) => G !== 0) && (St("nodes", o, "loads", V), q++);
        const T = [re.Kx, re.Ky, re.Kz, re.Krx, re.Kry, re.Krz];
        if (T.some((G) => G !== 0) && (St("nodes", o, "springs", T), q++), re.mass !== 0 && (St("nodes", o, "mass", re.mass), q++), re.diaphragm !== "Ninguno" && (St("nodes", o, "diaphragm", re.diaphragm), q++), q === 0) {
          de("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let G = document.getElementById("hk-prop-toast");
          G || (G = document.createElement("div"), G.id = "hk-prop-toast", G.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(G)), G.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", G.style.background = "rgba(217,119,6,0.97)", G.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            G && (G.style.opacity = "0");
          }, 3200);
        } else de(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (c) {
      const _ = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      _.addBinding(re, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), _.addBinding(re, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const p = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      p.addBinding(re, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), p.addBinding(re, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), p.addBinding(re, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), p.addBinding(re, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(re, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(re, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const H = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      H.addBinding(re, "relMxI", { label: "Mx I" }), H.addBinding(re, "relMyI", { label: "My I" }), H.addBinding(re, "relMzI", { label: "Mz I" });
      const q = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      q.addBinding(re, "relMxJ", { label: "Mx J" }), q.addBinding(re, "relMyJ", { label: "My J" }), q.addBinding(re, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(re, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const V = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      V.addBinding(re, "LKx", { label: "LKx", min: 0, step: 100 }), V.addBinding(re, "LKy", { label: "LKy", min: 0, step: 100 }), V.addBinding(re, "LKz", { label: "LKz", min: 0, step: 100 });
      const T = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      T.addBinding(re, "qx", { step: 0.1 }), T.addBinding(re, "qy", { step: 0.1 }), T.addBinding(re, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(re, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        St("segs", a, "section", re.section), St("segs", a, "material", re.material_frame);
        const P = { A: re.A_mod, Iz: re.Iz_mod, Iy: re.Iy_mod, J: re.J_mod };
        (P.A !== 1 || P.Iz !== 1 || P.Iy !== 1 || P.J !== 1) && St("segs", a, "modifiers", P), re.insertionPoint !== "10 \u2014 Centroid" && St("segs", a, "insertionPoint", re.insertionPoint), re.beta !== 0 && St("segs", a, "beta", re.beta);
        const C = [re.relMxI, re.relMyI, re.relMzI], U = [re.relMxJ, re.relMyJ, re.relMzJ];
        (C.some((_e) => _e) || U.some((_e) => _e)) && St("segs", a, "releases", { i: C, j: U }), re.hinges !== "None" && St("segs", a, "hinges", re.hinges);
        const ne = [re.LKx, re.LKy, re.LKz];
        ne.some((_e) => _e !== 0) && St("segs", a, "lineSprings", ne);
        const fe = [re.qx, re.qy, re.qz];
        fe.some((_e) => _e !== 0) && St("segs", a, "distLoad", fe), re.massPerM !== 0 && St("segs", a, "massPerM", re.massPerM), de(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (f) {
      const _ = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      _.addBinding(re, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), _.addBinding(re, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), _.addBinding(re, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(re, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        St("areas", n, "shellType", re.shellType), St("areas", n, "thickness", re.thickness), St("areas", n, "material", re.material_shell), re.surfLoad !== 0 && St("areas", n, "surfLoad", re.surfLoad), de(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (m) {
      const _ = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), p = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      _.addBinding(p, "msg", { readonly: true, label: "" });
    }
    pt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ae.clear(), Vt();
    }), Bt.style.display = "block", Ts();
  };
  window.__hekatanRefreshPropsPane = $s;
  let mn = null, Nn = false;
  v.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, Nn = false);
  }), v.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !Nn) {
      const o = t.clientX - mn.x, a = t.clientY - mn.y;
      Math.hypot(o, a) > 8 && (Nn = true);
    }
  }), v.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !Nn;
      mn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (Yt ? Xn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ae.size > 0 && (Ae.clear(), Vt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, s = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), de(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : de("\u238B Cancelado (click derecho)");
      }
    }
  }), v.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), v.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Gt = null, Sn = false));
  }), v.addEventListener("pointermove", (t) => {
    if (Yt && t.buttons === 0) {
      const i = t.clientX < Yt.x;
      po(Yt.x, Yt.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Gt) return;
    const o = t.clientX - Gt.x, a = t.clientY - Gt.y, n = Math.hypot(o, a);
    if (!Sn && n < 8) return;
    Sn = true;
    const s = t.clientX < Gt.x;
    po(Gt.x, Gt.y, t.clientX, t.clientY, s);
  }), v.addEventListener("pointerup", (t) => {
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
  const Yo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Zo = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    for (; qt.children.length; ) {
      const c = qt.children.pop();
      (_b = (_a2 = c.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = c.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Yo[t] ?? 16777215, i = new ze().setFromPoints([new S(-1, -1, 0), new S(1, -1, 0), new S(1, -1, 0), new S(1, 1, 0), new S(1, 1, 0), new S(-1, 1, 0), new S(-1, 1, 0), new S(-1, -1, 0)]);
    qt.add(new Wt(i, new ht({ color: s, linewidth: 2 }))), qt.position.set(o, a, n), qt.visible = true, fo();
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
  const Uo = (t, o, a) => {
    const n = Ls[t];
    if (!n) {
      Jt.style.display = "none";
      return;
    }
    Jt.textContent = n, Jt.style.color = "#" + (Yo[t] ?? 16777215).toString(16).padStart(6, "0"), Jt.style.left = o + 18 + "px", Jt.style.top = a - 26 + "px", Jt.style.display = "block";
  }, Is = () => {
    Jt.style.display = "none";
  }, Cn = new S(), ho = (t, o, a) => {
    const n = d();
    if (!n) return null;
    const s = v.getBoundingClientRect();
    return Cn.set(t, o, a).project(n), !isFinite(Cn.x) || !isFinite(Cn.y) ? null : { x: s.left + (Cn.x * 0.5 + 0.5) * s.width, y: s.top + (-Cn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = ho;
  const Rs = (t, o, a, n, s) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, c = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let m = null;
    const x = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, M = s, _ = (g, V, T, G) => {
      let P;
      if (M) {
        const U = ho(V, T, G);
        if (!U || (P = Math.hypot(U.x - M.x, U.y - M.y), P > kn)) return;
      } else if (P = Math.hypot(V - t, T - o, G - a), P > n) return;
      const C = x[g] ?? 9;
      (!m || C < m.r || C === m.r && P < m.d) && (m = { type: g, x: V, y: T, z: G, d: P, r: C });
    };
    if (i.ori !== false && _("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const g = window.__hekatanGridConfig, V = (g == null ? void 0 : g.minorStep) && g.minorStep > 0 ? g.minorStep : 1, T = ((g == null ? void 0 : g.gridSize) ?? 30) / 2, G = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", P = (U) => Math.round(U / V) * V, C = (U, ne) => Math.abs(U) <= T + 1e-9 && Math.abs(ne) <= T + 1e-9;
      if (G === "xz") {
        const U = P(t), ne = P(a);
        C(U, ne) && _("grid", U, o, ne);
      } else if (G === "yz") {
        const U = P(o), ne = P(a);
        C(U, ne) && _("grid", t, U, ne);
      } else {
        const U = P(t), ne = P(o);
        C(U, ne) && _("grid", U, ne, a);
      }
    }
    (i.node || i.end) && c.forEach((g) => {
      i.node && _("node", g[0], g[1], g[2]);
    });
    for (const g of f) if (!(g.length < 2)) for (let V = 0; V < g.length - 1; V++) {
      const T = c[g[V]], G = c[g[V + 1]];
      if (!(!T || !G) && (i.end && (_("end", T[0], T[1], T[2]), _("end", G[0], G[1], G[2])), i.mid && _("mid", (T[0] + G[0]) / 2, (T[1] + G[1]) / 2, (T[2] + G[2]) / 2), i.nea || i.per)) {
        const P = G[0] - T[0], C = G[1] - T[1], U = G[2] - T[2], ne = P * P + C * C + U * U;
        if (ne < 1e-12) continue;
        const fe = Math.max(0, Math.min(1, ((t - T[0]) * P + (o - T[1]) * C + (a - T[2]) * U) / ne)), _e2 = T[0] + fe * P, Ge = T[1] + fe * C, $e = T[2] + fe * U;
        i.nea && _("nea", _e2, Ge, $e), i.per && _("per", _e2, Ge, $e);
      }
    }
    if (i.cen) {
      const g = ((_e = e.areas) == null ? void 0 : _e.rawVal) ?? [];
      for (const V of g) {
        const T = f[V];
        if (!T || T.length < 3) continue;
        const G = T[0] === T[T.length - 1] ? T.slice(0, -1) : T;
        let P = 0, C = 0, U = 0, ne = 0;
        for (const fe of G) {
          const _e2 = c[fe];
          _e2 && (P += _e2[0], C += _e2[1], U += _e2[2], ne++);
        }
        ne >= 3 && _("cen", P / ne, C / ne, U / ne);
      }
    }
    if (i.cen) {
      const g = bn(), V = [...an];
      for (const T of g) V.some((G) => Math.hypot(G.c[0] - T.c[0], G.c[1] - T.c[1], G.c[2] - T.c[2]) < 1e-6 && Math.abs(G.r - T.r) < 1e-6) || V.push(T);
      for (const T of V) {
        if (!c.some((C) => Math.abs(Math.hypot(C[0] - T.c[0], C[1] - T.c[1], C[2] - T.c[2]) - T.r) < 1e-6)) continue;
        const P = Math.hypot(t - T.c[0], o - T.c[1], a - T.c[2]);
        if (P < n || Math.abs(P - T.r) < n) {
          const C = Math.min(P, n * 0.5), U = 3;
          (!m || U < m.r || U === m.r && C < m.d) && (m = { type: "cen", x: T.c[0], y: T.c[1], z: T.c[2], d: C, r: U });
        }
      }
    }
    if (i.int) {
      const g = [];
      for (const V of f) for (let T = 0; T < V.length - 1; T++) {
        const G = c[V[T]], P = c[V[T + 1]];
        if (!G || !P) continue;
        const C = P[0] - G[0], U = P[1] - G[1], ne = P[2] - G[2], fe = C * C + U * U + ne * ne;
        if (fe < 1e-12) continue;
        const _e2 = Math.max(0, Math.min(1, ((t - G[0]) * C + (o - G[1]) * U + (a - G[2]) * ne) / fe));
        Math.hypot(G[0] + _e2 * C - t, G[1] + _e2 * U - o, G[2] + _e2 * ne - a) < 3 * n && g.push([G, P]);
      }
      for (let V = 0; V < g.length; V++) for (let T = V + 1; T < g.length; T++) {
        const [G, P] = g[V], [C, U] = g[T], ne = [P[0] - G[0], P[1] - G[1], P[2] - G[2]], fe = [U[0] - C[0], U[1] - C[1], U[2] - C[2]], _e2 = [G[0] - C[0], G[1] - C[1], G[2] - C[2]], Ge = ne[0] * ne[0] + ne[1] * ne[1] + ne[2] * ne[2], $e = ne[0] * fe[0] + ne[1] * fe[1] + ne[2] * fe[2], et = fe[0] * fe[0] + fe[1] * fe[1] + fe[2] * fe[2], nt = ne[0] * _e2[0] + ne[1] * _e2[1] + ne[2] * _e2[2], at = fe[0] * _e2[0] + fe[1] * _e2[1] + fe[2] * _e2[2], je = Ge * et - $e * $e;
        if (je < 1e-12) continue;
        const Le = ($e * at - et * nt) / je, ot = (Ge * at - $e * nt) / je;
        if (Le < -1e-6 || Le > 1 + 1e-6 || ot < -1e-6 || ot > 1 + 1e-6) continue;
        const Ye = [G[0] + Le * ne[0], G[1] + Le * ne[1], G[2] + Le * ne[2]], ke = [C[0] + ot * fe[0], C[1] + ot * fe[1], C[2] + ot * fe[2]];
        if (Math.hypot(Ye[0] - ke[0], Ye[1] - ke[1], Ye[2] - ke[2]) > 1e-4) continue;
        [G, P, C, U].some((tt) => Math.hypot(tt[0] - Ye[0], tt[1] - Ye[1], tt[2] - Ye[2]) < 1e-6) || _("int", Ye[0], Ye[1], Ye[2]);
      }
    }
    const p = window.__hekatanAxisGrids ?? [], D = window.__hekatanLevels ?? [], j = p.filter((g) => g && g.start && g.end).map((g) => [g.start, g.end]);
    for (const [g, V] of j) {
      i.end && (_("end", g[0], g[1], g[2]), _("end", V[0], V[1], V[2]));
      const T = V[0] - g[0], G = V[1] - g[1], P = V[2] - g[2], C = T * T + G * G + P * P;
      if (C < 1e-12) continue;
      const U = Math.max(0, Math.min(1, ((t - g[0]) * T + (o - g[1]) * G + (a - g[2]) * P) / C));
      if (i.nea && _("nea", g[0] + U * T, g[1] + U * G, g[2] + U * P), i.int && Math.abs(P) > 1e-9) for (const ne of D) {
        const fe = (ne.z - g[2]) / P;
        fe < -1e-6 || fe > 1 + 1e-6 || _("int", g[0] + fe * T, g[1] + fe * G, ne.z);
      }
    }
    if (i.int || i.node) for (let g = 0; g < j.length; g++) for (let V = g + 1; V < j.length; V++) {
      const [T, G] = j[g], [P, C] = j[V], U = G[0] - T[0], ne = G[1] - T[1], fe = C[0] - P[0], _e2 = C[1] - P[1], Ge = U * _e2 - ne * fe;
      if (Math.abs(Ge) < 1e-12) continue;
      const $e = T[0] - P[0], et = T[1] - P[1], nt = (fe * et - _e2 * $e) / Ge, at = (U * et - ne * $e) / Ge;
      if (nt < -1e-6 || nt > 1 + 1e-6 || at < -1e-6 || at > 1 + 1e-6) continue;
      const je = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      _("int", T[0] + nt * U, T[1] + nt * ne, typeof je == "number" ? je : a);
    }
    const H = window.__hekatanDrawingAuxLines, q = (H == null ? void 0 : H.rawVal) ?? (H == null ? void 0 : H.val) ?? H ?? [];
    for (const g of q) {
      if (g.length !== 6) continue;
      const V = [g[0], g[1], g[2]], T = [g[3], g[4], g[5]];
      if (i.end && (_("end", V[0], V[1], V[2]), _("end", T[0], T[1], T[2])), i.mid && _("mid", (V[0] + T[0]) / 2, (V[1] + T[1]) / 2, (V[2] + T[2]) / 2), i.nea || i.per) {
        const G = T[0] - V[0], P = T[1] - V[1], C = T[2] - V[2], U = G * G + P * P + C * C;
        if (U < 1e-12) continue;
        const ne = Math.max(0, Math.min(1, ((t - V[0]) * G + (o - V[1]) * P + (a - V[2]) * C) / U)), fe = V[0] + ne * G, _e2 = V[1] + ne * P, Ge = V[2] + ne * C;
        i.nea && _("nea", fe, _e2, Ge), i.per && _("per", fe, _e2, Ge);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
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
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of t || []) {
      const i = String(s).split(":");
      let c = [];
      if (i[0] === "pt") {
        const x = o[+i[1]];
        x && (c = [x, [x[0] + 1e-3, x[1], x[2]]]);
      } else if (i[0] === "seg") {
        const x = a[+i[1]] || [], M = o[x[+i[2]]], _ = o[x[+i[2] + 1]];
        M && _ && (c = [M, _]);
      } else i[0] === "poly" && (c = (a[+i[1]] || []).map((M) => o[M]).filter(Boolean));
      if (c.length < 2) continue;
      const f = new ze().setFromPoints(c.map((x) => new S(x[0], x[1], x[2]))), m = new Ft(f, qo);
      m.renderOrder = 1200, wn.add(m);
    }
    if (!wn.children.length) return;
    Ko = performance.now() + 900;
    const n = () => {
      const s = Ko - performance.now();
      if (s <= 0) {
        Go(), y();
        return;
      }
      qo.opacity = Math.min(1, s / 900) * 0.95, y(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Rs, window.__hekatanOsnapShow = Zo, window.__hekatanOsnapHide = Yn;
  let Ue = [], vt = 0, rn = 0, zt = null;
  const zn = document.createElement("div");
  zn.id = "hk-cad-status", zn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", zn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(zn);
  const Ds = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), Oe && t.push(`\u{1F512} LOCK ${Oe.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && t.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
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
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], n = Ue.length, s = (i, c = []) => ({ txt: i, ops: c });
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${xe.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return s("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "rect":
        return s(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(zt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(zt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(zt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${rn > 0 ? ` (distancia ${rn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Ae.size ? s(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ae.size ? s(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ae.size ? s(`SELECCI\xD3N ${Ae.size} objeto${Ae.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(Bs);
    }
  }, Zt = () => {
    var _a2, _b, _c, _d, _e;
    try {
      const t = Xs(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !a ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e = window.__hekatanCadPrompt) == null ? void 0 : _e.call(window, s, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Zt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    de(o);
  }, window.__hekatanCadResetPending = () => {
    Ue = [], xe = [], O.visible = false, mo(), zt = null, y(), de("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Zt();
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
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ue = [], pe.visible = false, st.visible = false, L();
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
    const o = t.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Un(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return de("Cerrar necesita al menos tres puntos."), true;
      Xt(), e.polylines.val = [...n.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return yo(), de(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Un(), true;
      Xt();
      const i = s[s.length - 1], c = s.slice(0, -1), f = n.some((M, _) => _ !== n.length - 1 && M.includes(i)) || c.includes(i);
      let m = e.points.rawVal, x = [...n.slice(0, -1), c];
      if (!f && i === m.length - 1 && (m = m.slice(0, -1), e.points.val = m), e.polylines.val = x, c.length) {
        const M = m[c[c.length - 1]];
        M && ($ = [M[0], M[1], M[2]]);
      } else $ = null, pe.visible = false;
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
      const o = t.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Un();
    }
  }, { capture: true });
  const yo = () => {
    Ue = [], zt = null, mo(), Oe = null, Ve(), pe.visible = false, st.visible = false, L(), de("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), y(), Zt();
  };
  window.__hekatanFinalizeDraw = yo;
  const Jo = () => {
    var _a2, _b, _c;
    Ue = [], xe = [], O.visible = false;
    let t = false;
    Ae.size && (Ae.clear(), Vt(), t = true), yo();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    de(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), y(), Zt();
  };
  window.__hekatanEscapeCancel = Jo;
  const Oo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ae.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (t[+a.slice(5)] || []).forEach((n) => o.add(n));
      else if (a.startsWith("seg:")) {
        const n = a.split(":"), s = t[+n[1]] || [], i = s[+n[2]], c = s[+n[2] + 1];
        i != null && o.add(i), c != null && o.add(c);
      }
    }), o;
  }, Qo = (t, o, a) => {
    var _a2;
    const n = Oo();
    if (!n.size) return 0;
    Xt();
    const s = e.points.rawVal.map((i, c) => n.has(c) ? [i[0] + t, i[1] + o, i[2] + a] : i);
    e.points.val = s;
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
      $ = o, de(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Zt();
      return;
    }
    const [a, n] = Ue, s = [n[0] - a[0], n[1] - a[1], n[2] - a[2]];
    Ue = [], pe.visible = false;
    let i = 0;
    t === "move" ? i = Qo(s[0], s[1], s[2]) : (i = Oo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), de(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), t === "move" && (Ae.clear(), Vt()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Zt();
  };
  window.__hekatanPasoMoverCopiar = jo;
  const Ns = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), xo = (t, o, a, n, s, i) => {
    const c = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], f = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], m = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], x = c[0] * c[0] + c[1] * c[1] + c[2] * c[2], M = c[0] * f[0] + c[1] * f[1] + c[2] * f[2], _ = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], p = c[0] * m[0] + c[1] * m[1] + c[2] * m[2], D = f[0] * m[0] + f[1] * m[1] + f[2] * m[2], j = x * _ - M * M;
    if (j < 1e-12) return null;
    const H = (M * D - _ * p) / j, q = (x * D - M * p) / j;
    if (!s && (H < -1e-6 || H > 1 + 1e-6) || !i && (q < -1e-6 || q > 1 + 1e-6)) return null;
    const g = [t[0] + H * c[0], t[1] + H * c[1], t[2] + H * c[2]], V = [a[0] + q * f[0], a[1] + q * f[1], a[2] + q * f[2]];
    return jt(g, V) > 1e-4 ? null : g;
  }, Ys = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((n) => n === t).length, 0);
  }, Zs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Us = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, n = e.points.rawVal, s = Zs[t];
    if (!zt) {
      if (Be < 0) {
        de(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      zt = { poly: Be, seg: Math.max(0, Je) }, de(t === "offset" ? `DESFASE l\xEDnea #${zt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${rn > 0 ? ` (${rn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Zt();
      return;
    }
    if (t === "offset") {
      const H = zt.poly, q = a[H];
      if (!q || q.length < 2) {
        zt = null, de("DESFASE: esa polil\xEDnea no tiene tramos."), Zt();
        return;
      }
      const g = q.length > 2 && q[0] === q[q.length - 1], V = Ns(), T = [];
      for (let Le = 0; Le < q.length - 1; Le++) {
        const ot = n[q[Le]], Ye = n[q[Le + 1]], ke = [Ye[0] - ot[0], Ye[1] - ot[1], Ye[2] - ot[2]], Re = Math.hypot(ke[0], ke[1], ke[2]) || 1, tt = ke[0] / Re, It = ke[1] / Re, Nt = ke[2] / Re, Rt = [V[1] * Nt - V[2] * It, V[2] * tt - V[0] * Nt, V[0] * It - V[1] * tt], Qt = Math.hypot(Rt[0], Rt[1], Rt[2]) || 1;
        T.push({ a: ot, b: Ye, n: [Rt[0] / Qt, Rt[1] / Qt, Rt[2] / Qt] });
      }
      let G = 0, P = 1 / 0;
      T.forEach((Le, ot) => {
        const Ye = on(o[0], o[1], o[2], Le.a[0], Le.a[1], Le.a[2], Le.b[0], Le.b[1], Le.b[2]);
        Ye < P && (P = Ye, G = ot);
      });
      const C = T[G], U = Math.sign((o[0] - C.a[0]) * C.n[0] + (o[1] - C.a[1]) * C.n[1] + (o[2] - C.a[2]) * C.n[2]) || 1, ne = rn > 0 ? rn : P;
      if (ne < 1e-6) {
        de("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const fe = T.map((Le) => ({ a: [Le.a[0] + U * ne * Le.n[0], Le.a[1] + U * ne * Le.n[1], Le.a[2] + U * ne * Le.n[2]], b: [Le.b[0] + U * ne * Le.n[0], Le.b[1] + U * ne * Le.n[1], Le.b[2] + U * ne * Le.n[2]] })), _e = fe.length, Ge = (Le) => {
        const ot = fe[(Le - 1 + _e) % _e], Ye = fe[Le % _e];
        return xo(ot.a, ot.b, Ye.a, Ye.b, true, true) ?? Ye.a;
      }, $e = [], et = g ? _e : _e + 1;
      for (let Le = 0; Le < et; Le++) !g && Le === 0 ? $e.push(fe[0].a) : !g && Le === _e ? $e.push(fe[_e - 1].b) : $e.push(Ge(Le));
      Xt();
      const nt = n.length;
      e.points.val = [...n, ...$e];
      const at = $e.map((Le, ot) => nt + ot);
      g && at.push(nt);
      let je = a.slice();
      je.length && je[je.length - 1].length === 0 && (je = je.slice(0, -1)), e.polylines.val = [...je, at, []], zt = null, de(`\u2713 Desfase a ${ne.toFixed(2)} m \u2014 ${_e} tramo${_e === 1 ? "" : "s"} nuevo${_e === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      y(), Zt();
      return;
    }
    let i = Be, c = Math.max(0, Je);
    if (i < 0 || i === zt.poly && c === zt.seg) {
      let q = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((g, V) => {
        for (let T = 0; T < g.length - 1; T++) {
          if (V === zt.poly && T === zt.seg) continue;
          const G = n[g[T]], P = n[g[T + 1]];
          if (!G || !P) continue;
          const C = on(o[0], o[1], o[2], G[0], G[1], G[2], P[0], P[1], P[2]);
          C < q && (q = C, i = V, c = T);
        }
      }), i < 0) {
        de(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = a[zt.poly], m = n[f[zt.seg]], x = n[f[zt.seg + 1]], M = a[i], _ = M[c], p = M[c + 1];
    if (!m || !x || _ == null || p == null) {
      de(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const D = n[_], j = n[p];
    if (t === "trim") {
      const H = xo(D, j, m, x, false, false);
      if (!H) {
        de("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Xt();
      const q = n.length;
      e.points.val = [...n, H];
      const g = [...M.slice(0, c + 1), q, ...M.slice(c + 1)];
      e.polylines.val = a.map((T, G) => G === i ? g : T);
      const V = jt(o, D) < jt(o, j);
      In(i, V ? c : c + 1), de(`\u2713 Recortado en (${H[0].toFixed(2)}, ${H[1].toFixed(2)}, ${H[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const H = xo(D, j, m, x, true, false);
      if (!H) {
        de("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const g = jt(o, D) < jt(o, j) ? c : c + 1;
      if (g !== 0 && g !== M.length - 1) {
        de("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const V = M[g];
      if (jt(H, D) + jt(H, j) < jt(D, j) + 1e-6) {
        de("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Xt(), Ys(V) > 1) {
        const G = n.length;
        e.points.val = [...n, H];
        const P = M.slice();
        P[g] = G, e.polylines.val = a.map((C, U) => U === i ? P : C);
      } else e.points.val = n.map((G, P) => P === V ? H : G);
      de(`\u2713 Alargada hasta (${H[0].toFixed(2)}, ${H[1].toFixed(2)}, ${H[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
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
    const a = /* @__PURE__ */ new Set();
    return t.forEach((n, s) => {
      !n || n.length < 2 || (Ae.add(`poly:${s}`), n.forEach((i) => a.add(i)));
    }), o.forEach((n, s) => {
      a.has(s) || Ae.add(`pt:${s}`);
    }), Vt(), de(`SELECCI\xD3N ${Ae.size} objetos (todo el modelo) \xB7 Esc suelta`), Ae.size;
  }, window.__hekatanReplicateSelection = (t, o, a, n, s = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...Ae], c = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), x = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), _ = [];
    if (i.forEach((q) => {
      if (q.startsWith("pt:")) {
        const g = +q.slice(3);
        c[g] && x.add(g);
      } else if (q.startsWith("poly:")) {
        const g = +q.slice(5);
        if (!f[g] || f[g].length < 2) return;
        M.add(g), f[g].forEach((V) => x.add(V));
      } else if (q.startsWith("seg:")) {
        const g = q.split(":"), V = +g[1], T = +g[2], G = f[V] || [], P = G[T], C = G[T + 1];
        P != null && C != null && (_.push([P, C]), x.add(P), x.add(C));
      }
    }), !x.size) return 0;
    Xt();
    const p = [...c];
    let D = f.slice();
    D.length && D[D.length - 1].length === 0 && (D = D.slice(0, -1));
    const j = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], H = [...x];
    for (let q = 1; q <= n; q++) {
      const g = s + q, V = t * g, T = o * g, G = a * g, P = /* @__PURE__ */ new Map();
      H.forEach((C) => {
        P.set(C, p.length), p.push([c[C][0] + V, c[C][1] + T, c[C][2] + G]);
      }), M.forEach((C) => {
        const U = f[C].map((fe) => P.has(fe) ? P.get(fe) : fe), ne = D.length;
        D.push(U), m.has(C) && j.push(ne);
      }), _.forEach(([C, U]) => {
        D.push([P.get(C), P.get(U)]);
      });
    }
    D.push([]), e.points.val = p, e.polylines && (e.polylines.val = D), e.areas && (e.areas.val = j);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return y(), n;
  }, window.__hekatanVoladoSelection = (t, o = {}) => {
    var _a2, _b, _c;
    const a = Number(t);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const n = o.losa !== false, s = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", c = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = [];
    if ([...Ae].forEach((H) => {
      if (H.startsWith("seg:")) {
        const q = H.split(":"), g = +q[1], V = +q[2], T = f[g] || [], G = T[V], P = T[V + 1];
        G != null && P != null && m.push([G, P]);
      } else if (H.startsWith("poly:")) {
        const q = f[+H.slice(5)] || [];
        for (let g = 0; g + 1 < q.length; g++) m.push([q[g], q[g + 1]]);
      }
    }), !m.length) return 0;
    let x = 0, M = 0;
    for (const H of c) x += H[0], M += H[1];
    x /= Math.max(1, c.length), M /= Math.max(1, c.length), Xt();
    const _ = [...c];
    let p = f.slice();
    p.length && p[p.length - 1].length === 0 && (p = p.slice(0, -1));
    const D = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let j = 0;
    for (const [H, q] of m) {
      const g = c[H], V = c[q];
      if (!g || !V) continue;
      const T = V[0] - g[0], G = V[1] - g[1], P = Math.hypot(T, G);
      if (P < 1e-6) continue;
      let C = -G / P, U = T / P;
      const ne = (g[0] + V[0]) / 2, fe = (g[1] + V[1]) / 2;
      (ne - x) * C + (fe - M) * U < 0 && (C = -C, U = -U);
      const _e = i === "ambos" ? [1, -1] : [1];
      for (const Ge of _e) {
        const $e = C * a * Ge, et = U * a * Ge, nt = _.length;
        _.push([g[0] + $e, g[1] + et, g[2]]);
        const at = _.length;
        _.push([V[0] + $e, V[1] + et, V[2]]), p.push([H, nt]), p.push([q, at]), s && p.push([nt, at]), n && (D.push(p.length), p.push([H, q, at, nt, H])), j++;
      }
    }
    if (!j) return 0;
    p.push([]), e.points.val = _, e.polylines && (e.polylines.val = p), e.areas && (e.areas.val = D);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return y(), j;
  }, v.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, ln > 5) {
      ln = 0;
      return;
    }
    ln = 0;
    const o = b(t);
    if (!o) return;
    k.setFromCamera(F, o);
    const a = oe();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(u.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), c = a[0].point;
      if (!isFinite(c.x) || !isFinite(c.y) || !isFinite(c.z) || i > Math.max(s * 12, 300)) {
        de("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = a[0].point;
    (t.ctrlKey || t.metaKey) && (n = new S(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = s[s.length - 1] ?? [], c = e.points.rawVal ?? [];
      if (i.length > 0) {
        const f = c[i[i.length - 1]];
        if (f) {
          const m = !!window.__hekatanOrthoMode;
          let x = Oe;
          if (!x && m) {
            const M = Math.abs(n.x - f[0]), _ = Math.abs(n.y - f[1]), p = Math.abs(n.z - f[2]);
            x = M >= _ && M >= p ? "x" : _ >= p ? "y" : "z";
          }
          x === "x" ? n = new S(n.x, f[1], f[2]) : x === "y" ? n = new S(f[0], n.y, f[2]) : x === "z" && (n = new S(f[0], f[1], n.z));
        }
      }
    }
    if (qe && Math.abs(t.clientX - qe.x) <= 3 && Math.abs(t.clientY - qe.y) <= 3) n = qe.p.clone();
    else if (kt) n = kt.clone(), de(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const s = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s, { x: t.clientX, y: t.clientY });
      if (i) n = new S(i.x, i.y, i.z), de(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const c = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        c && f > 0 && (n = new S(Math.round(n.x / f) * f, Math.round(n.y / f) * f, Math.round(n.z / f) * f));
      }
    }
    es(n, t);
  });
  const es = (t, o) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (Ut) {
        Yt && Xn();
        const { kind: n, a: s, b: i } = Ut, c = i !== void 0 ? `${n}:${s}:${i}` : `${n}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ae.clear(), Ae.has(c) ? Ae.delete(c) : Ae.add(c), Vt(), de(`\u2713 Seleccionados ${Ae.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Yt ? (Bo(Yt.x, Yt.y, s, i, n), Yt = null) : n || (Yt = { x: s, y: i }, de("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), po(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], de(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], s);
      de(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      jo(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "delete") {
      if (wt >= 0) {
        const n = window.__hekatanDrawingAuxLines, s = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = wt;
        if (i >= 0 && i < s.length) {
          Xt();
          const c = s.slice(0, i).concat(s.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = c : window.__hekatanDrawingAuxLines = c, de(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), wt = -1, dt.visible = false;
          try {
            (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
          } catch {
          }
        }
      } else if (Be >= 0) {
        const n = Be, s = Je;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (sn(n), de(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : s >= 0 ? (In(n, s), de(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${n + 1} borrado`)) : (sn(n), de(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else de("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, s] = Ue, i = Math.hypot(s[0] - n[0], s[1] - n[1], s[2] - n[2]);
      Math.abs(s[0] - n[0]);
      const c = Math.abs(s[1] - n[1]), m = Math.abs(s[2] - n[2]) < 1e-3 ? "xy" : c < 1e-3 ? "xz" : "yz", x = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, x, m), de(`\u2713 C\xEDrculo dibujado en ${m.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${x} segmentos`), Ue = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ue.length === 2) {
        de("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, s, i] = Ue, c = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, s, i, c), de(`\u2713 Arco dibujado \u2014 ${c} segmentos`), Ue = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ue;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, s), de(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ue = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "fillarea") {
      const n = e.points.rawVal, s = ((_n2 = e.polylines) == null ? void 0 : _n2.rawVal) ?? [], i = /* @__PURE__ */ new Map(), c = (P, C) => {
        P !== C && ((i.get(P) ?? i.set(P, /* @__PURE__ */ new Set()).get(P)).add(C), (i.get(C) ?? i.set(C, /* @__PURE__ */ new Set()).get(C)).add(P));
      };
      for (const P of s) for (let C = 0; C + 1 < P.length; C++) c(P[C], P[C + 1]);
      const f = (P, C) => {
        var _a3;
        return !!((_a3 = i.get(P)) == null ? void 0 : _a3.has(C));
      }, m = /* @__PURE__ */ new Set(), x = [], M = [...i.keys()];
      for (const P of M) for (const C of i.get(P)) if (!(C < P)) {
        for (const U of i.get(C)) if (U !== P) for (const ne of i.get(U)) {
          if (ne === P || ne === C || !f(ne, P) || f(P, U) || f(C, ne)) continue;
          const fe = [P, C, U, ne].slice().sort((_e2, Ge) => _e2 - Ge).join("-");
          m.has(fe) || (m.add(fe), x.push([P, C, U, ne]));
        }
      }
      for (const P of M) for (const C of i.get(P)) if (!(C < P)) for (const U of i.get(C)) {
        if (U === P || !f(U, P)) continue;
        const ne = [P, C, U].slice().sort((fe, _e2) => fe - _e2).join("-");
        m.has(ne) || (m.add(ne), x.push([P, C, U]));
      }
      const _ = ((_q = (_p = (_o = window.__hekatanCadState) == null ? void 0 : _o.get) == null ? void 0 : _p.call(_o)) == null ? void 0 : _q.workPlane) ?? "xy", p = (P) => _ === "xy" ? [P[0], P[1]] : _ === "xz" ? [P[0], P[2]] : [P[1], P[2]], D = p([t.x, t.y, t.z]), j = (P, C) => {
        let U = false;
        for (let ne = 0, fe = C.length - 1; ne < C.length; fe = ne++) {
          const _e2 = C[ne][0], Ge = C[ne][1], $e = C[fe][0], et = C[fe][1];
          Ge > P[1] != et > P[1] && P[0] < ($e - _e2) * (P[1] - Ge) / (et - Ge) + _e2 && (U = !U);
        }
        return U;
      }, H = (P) => {
        let C = 0;
        for (let U = 0, ne = P.length - 1; U < P.length; ne = U++) C += (P[ne][0] + P[U][0]) * (P[ne][1] - P[U][1]);
        return Math.abs(C) / 2;
      };
      let q = null, g = 1 / 0;
      for (const P of x) {
        const C = P.map((ne) => p(n[ne]));
        if (!j(D, C)) continue;
        const U = H(C);
        U < g && (g = U, q = P);
      }
      if (!q) {
        de("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const V = q.slice().sort((P, C) => P - C).join("-"), T = ((_r = e.areas) == null ? void 0 : _r.rawVal) ?? [];
      if (T.some((P) => {
        const C = s[P] ?? [];
        return [...new Set(C)].sort((U, ne) => U - ne).join("-") === V;
      })) {
        de("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      e.polylines.val = [...s, [...q, q[0]]], e.areas.val = [...T, s.length], de(`\u2713 \xC1rea creada por relleno (${q.length} lados).`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ue;
      (_t2 = window.__hekatanDrawRectArea) == null ? void 0 : _t2.call(window, n, s), de(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ue = [];
      return;
    }
    if (a === "polyarea") {
      xe.push([t.x, t.y, t.z]), O.geometry.setFromPoints(xe.map((n) => new S(n[0], n[1], n[2]))), O.visible = xe.length >= 1, de(`\u25B0 \xC1rea libre \u2014 ${xe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), y();
      return;
    }
    if (a === "plane3") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length < 3) {
        de(`\u25E3 Plano inclinado \u2014 punto ${Ue.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, s, i] = Ue, c = (_u = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _u.call(window, n, s, i);
      de(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ue = [];
      return;
    }
    if (a === "col") {
      Xt();
      const n = t.z, s = vt && vt > 0 ? vt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + s]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], vt = 0, de(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, s] = Ue, i = vt && vt > 0 ? vt : 3;
      Xt();
      const c = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [n[0], n[1], n[2] + i]];
      const f = e.polylines.rawVal;
      if (f.length - 1, e.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], e.areas) {
        const m = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, m];
      }
      de(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ue = [], vt = 0;
      try {
        (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Xt();
      const n = vt && vt > 0 ? vt : 3, s = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, s], [t.x, t.y, s + n]];
      const i = e.polylines.rawVal, c = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [c - 2, c - 1], []], vt = 0, de(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_x = window.__hekatanRebuild) == null ? void 0 : _x.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = vn(t.x, t.y, t.z, n);
      if (!s) {
        de("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, c = e.points.rawVal, f = i[s.polyIdx], m = c[f[s.segIdx]], x = c[f[s.segIdx + 1]];
      if (!m || !x) {
        de("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = vt && vt > 0 ? vt : 3;
      Xt();
      const _ = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [m[0], m[1], m[2]], [x[0], x[1], x[2]], [x[0], x[1], x[2] + M], [m[0], m[1], m[2] + M]];
      const p = e.polylines.rawVal;
      if (e.polylines.val = [...p.slice(0, -1), ...p[p.length - 1].length > 0 ? [p[p.length - 1]] : [], [_, _ + 1, _ + 2, _ + 3, _], []], e.areas) {
        const D = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, D];
      }
      vt = 0, de(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
      try {
        (_y = window.__hekatanRebuild) == null ? void 0 : _y.call(window);
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
      de(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, s] = Ue, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const M = i.rawVal ?? i.val ?? [];
        i.val = [...M, [n[0], n[1], n[2], s[0], s[1], s[2]]];
      }
      const c = s[0] - n[0], f = s[1] - n[1], m = s[2] - n[2], x = Math.sqrt(c * c + f * f + m * m);
      de(`\u2713 L\xEDnea auxiliar creada \u2014 L=${x.toFixed(2)}m (cyan, no FEM)`), Ue = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      Us(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "chaflan") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ue, i = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_z = window.__hekatanDrawSlabChaflan) == null ? void 0 : _z.call(window, n, s, i, c, 6);
      const f = Math.abs(s[0] - n[0]).toFixed(1), m = Math.abs(s[1] - n[1]).toFixed(1);
      de(`\u2713 Losa con chaflanes dibujada \u2014 ${f}\xD7${m}m, r=${i}m, ${c} seg/chafl\xE1n`), Ue = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (X = false, Xt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, s = n.length - 1, i = n[s] ?? [];
      if (a === "line" && i.length >= 2) {
        de(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_B = window.__hekatanRebuild) == null ? void 0 : _B.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), de("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_C = window.__hekatanRebuild) == null ? void 0 : _C.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") de(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (a === "line") de("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") de("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const n = ((_D = e.polylines) == null ? void 0 : _D.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      de(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  v.addEventListener("click", () => Zt()), v.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && xe.length >= 3) {
      t.preventDefault();
      const a = pn();
      de(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), v.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = b(t);
    if (!o) return;
    k.setFromCamera(F, o);
    const a = oe();
    if (ie.geometry.deleteAttribute("position"), a.length) {
      let n = a[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const c = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = c[c.length - 1] ?? [], m = e.points.rawVal ?? [];
        if (f.length > 0) {
          const x = m[f[f.length - 1]];
          if (x) {
            const M = !!window.__hekatanOrthoMode;
            let _ = Oe;
            if (!_ && M) {
              const p = Math.abs(n.x - x[0]), D = Math.abs(n.y - x[1]), j = Math.abs(n.z - x[2]);
              _ = p >= D && p >= j ? "x" : D >= j ? "y" : "z";
            }
            _ === "x" ? n.set(n.x, x[1], x[2]) : _ === "y" ? n.set(x[0], n.y, x[2]) : _ === "z" && n.set(x[0], x[1], n.z);
          }
        }
      }
      const s = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const c = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0.5;
        c && f > 0 && (n.x = Math.round(n.x / f) * f, n.y = Math.round(n.y / f) * f, n.z = Math.round(n.z / f) * f);
      }
      ie.geometry.setAttribute("position", new Ct(n.toArray(), 3));
    }
    y();
  }), v.addEventListener("pointermove", (t) => {
    var _a2;
    const o = b(t);
    if (!o) return;
    k.setFromCamera(F, o);
    let a = false;
    const n = k.intersectObject(R), s = oe();
    if (n.length && s.length) {
      const i = new S(...e.points.rawVal[n[0].index]), c = new S(...s[0].point), f = i.sub(c), m = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      m.transformDirection(W.matrixWorld), Math.abs(f.dot(m)) < 1e-4 && (a = true);
    }
    ie.visible = !a;
  });
  let go = false, vo;
  v.addEventListener("pointermove", (t) => {
    var _a2;
    if (!ln) return;
    const o = b(t);
    if (!o) return;
    k.setFromCamera(F, o);
    let a = false;
    const n = k.intersectObject(R), s = oe();
    if (n.length && s.length) {
      const c = new S(...e.points.rawVal[n[0].index]), f = new S(...s[0].point), m = c.sub(f), x = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      x.transformDirection(W.matrixWorld), Math.abs(m.dot(x)) < 1e-4 && (a = true);
    }
    if (a && ln < 5 && (go = true, u.enabled = false, vo = n[0].index), !go || ln % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (vo !== void 0) {
      let c = s[0].point;
      (t.ctrlKey || t.metaKey) && (c = new S(Math.round(c.x), Math.round(c.y), Math.round(c.z))), i[vo] = c.toArray();
    }
    e.points.val = i;
  }), v.addEventListener("pointerup", () => {
    u.enabled = true, go = false;
  }), v.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = b(t);
    if (!o) return;
    k.setFromCamera(F, o);
    let a = false;
    const n = k.intersectObject(R), s = oe();
    if (n.length && s.length) {
      const f = new S(...e.points.rawVal[n[0].index]), m = new S(...s[0].point), x = f.sub(m), M = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      M.transformDirection(W.matrixWorld), Math.abs(x.dot(M)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const c = e.polylines.rawVal.map((f) => f.filter((m) => m !== n[0].index)).map((f) => f.map((m) => m > n[0].index ? m - 1 : m)).filter((f) => f.length);
    c.push([]), e.polylines.val = c;
  });
}
function $a(e, l, r) {
  const h = Math.round(14.999999999999998), w = { position: e.position.clone(), quaternion: e.quaternion.clone() }, v = setInterval(k, 1e3 / 30);
  let y = 0;
  function k() {
    y++;
    const F = y / h;
    e.position.lerpVectors(w.position, l.position, F), e.quaternion.slerpQuaternions(w.quaternion, l.quaternion, F), r && r(), y == h && clearInterval(v);
  }
}
function La(e, l, r, d) {
  const u = ua(r, e.elements, d);
  return ee.derive(() => {
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
  const w = new Ht(), v = ee.state([]);
  return ee.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const y = r.val, k = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], F = Da(l.frameResults.val);
    if (u.children.forEach((E) => {
      E.geometry && E.geometry.dispose(), E.material && E.material.dispose();
    }), u.clear(), !F || k.length === 0 || y.length === 0) {
      v.val = [];
      return;
    }
    const b = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, W = (_c = e.deformOutputs) == null ? void 0 : _c.val, ye = [], be = [];
    for (let E = 0; E < k.length; E++) {
      if (k[E].length !== 2) continue;
      const ce = Ba(F, E, b, W);
      ce && (ye.push(ce[0], ce[1]), be.push({ idx: E, vals: ce }));
    }
    if (ye.length === 0) {
      v.val = [];
      return;
    }
    const se = Math.min(...ye), I = Math.max(...ye);
    h.setMin(se), h.setMax(I), v.val = ye;
    const oe = [1 / 0, 1 / 0, 1 / 0], R = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of y) for (let te = 0; te < 3; te++) oe[te] = Math.min(oe[te], E[te]), R[te] = Math.max(R[te], E[te]);
    const le = Math.max(R[0] - oe[0], R[1] - oe[1], R[2] - oe[2], 1) * Ra, B = [], $ = [], Z = [];
    let X = 0;
    for (const { idx: E, vals: te } of be) {
      const ce = k[E], he = y[ce[0]], ae = y[ce[1]];
      if (!he || !ae) continue;
      const N = new S(ae[0] - he[0], ae[1] - he[1], ae[2] - he[2]), pe = N.length();
      if (pe < 1e-10) continue;
      N.normalize();
      const O = Math.abs(N.y) < 0.99 ? new S(0, 1, 0) : new S(1, 0, 0), xe = new S().crossVectors(N, O).normalize(), ge = new S().crossVectors(N, xe).normalize(), Ee = Ao + 1, Me = Ia;
      for (let Ie = 0; Ie < Ee; Ie++) {
        const Ke = Ie / Ao, st = he[0] + N.x * pe * Ke, mt = he[1] + N.y * pe * Ke, z = he[2] + N.z * pe * Ke, K = te[0] + (te[1] - te[0]) * Ke, Q = h.getColor(K) ?? new Ht(0, 0, 0);
        w.copy(Q).convertSRGBToLinear();
        for (let J = 0; J < Me; J++) {
          const ve = J / Me * Math.PI * 2, ue = Math.cos(ve), Se = Math.sin(ve);
          B.push(st + (xe.x * ue + ge.x * Se) * le, mt + (xe.y * ue + ge.y * Se) * le, z + (xe.z * ue + ge.z * Se) * le), $.push(w.r, w.g, w.b);
        }
      }
      for (let Ie = 0; Ie < Ao; Ie++) for (let Ke = 0; Ke < Me; Ke++) {
        const st = (Ke + 1) % Me, mt = X + Ie * Me + Ke, z = X + Ie * Me + st, K = X + (Ie + 1) * Me + Ke, Q = X + (Ie + 1) * Me + st;
        Z.push(mt, z, Q), Z.push(mt, Q, K);
      }
      X += Ee * Me;
    }
    if (B.length === 0) return;
    const A = new ze();
    A.setAttribute("position", new Ct(B, 3)), A.setAttribute("color", new Ct($, 3)), A.setIndex(Z), A.computeVertexNormals();
    const Y = new ft({ vertexColors: true, side: At }), L = new lt(A, Y);
    L.frustumCulled = false, u.add(L);
  }), u.__colorMapValues = v, u;
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
  const h = new ze(), w = new ht({ color: ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), v = new Wt(h, w);
  v.visible = false, v.renderOrder = 100, l.add(v);
  const y = new ft({ color: ms, transparent: true, opacity: 0.7, depthTest: false }), k = new lt(new ps(1, 1, 1, 12), y);
  k.visible = false, k.renderOrder = 100, l.add(k);
  const F = new ze(), b = new ft({ color: Ka, transparent: true, opacity: 0.45, side: At, depthTest: false }), W = new lt(F, b);
  W.visible = false, W.renderOrder = 100, l.add(W);
  const ye = new ze(), be = new ht({ color: Ga, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Wt(ye, be);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const I = new ft({ color: On, transparent: true, opacity: 0.95, depthTest: false }), oe = new ft({ color: On, transparent: true, opacity: 0.85, depthTest: false }), R = new ps(1, 1, 1, 12), ie = new ft({ color: On, transparent: true, opacity: 0.55, side: At, depthTest: false }), le = new ht({ color: On, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), B = [];
  window.__hekatanModelSelection = B;
  const $ = new it();
  $.renderOrder = 101, l.add($);
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function X(z) {
    const K = e.derivedNodes.rawVal;
    return !K || z < 0 || z >= K.length ? null : new S(K[z][0], K[z][1], K[z][2]);
  }
  function A(z, K) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const Q = e.getActiveCamera();
    if (!Q || !e.mesh) return null;
    const J = e.rendererElm.getBoundingClientRect(), ve = z - J.left, ue = K - J.top, Se = e.derivedNodes.rawVal, me = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Se || !me) return null;
    const De = /* @__PURE__ */ new Map(), Te = (qe) => {
      if (De.has(qe)) return De.get(qe);
      const Ce = X(qe);
      if (!Ce) return De.set(qe, null), null;
      const Ve = Ce.clone().project(Q), He = (Ve.x * 0.5 + 0.5) * J.width, Fe = (-Ve.y * 0.5 + 0.5) * J.height, ct = { x: He, y: Fe, z: Ve.z };
      return De.set(qe, ct), ct;
    }, We = /* @__PURE__ */ new Set();
    for (const qe of me) if (qe) for (const Ce of qe) We.add(Ce);
    const Qe = 8;
    let Ze = -1, rt = Qe;
    for (let qe = 0; qe < Se.length; qe++) {
      if (!We.has(qe)) continue;
      const Ce = Te(qe);
      if (!Ce || Ce.z < -1 || Ce.z > 1) continue;
      const Ve = Ce.x - ve, He = Ce.y - ue, Fe = Math.sqrt(Ve * Ve + He * He);
      Fe < rt && (rt = Fe, Ze = qe);
    }
    const Xe = Na(), we = Za[Xe.dispUnit] ?? 1e3, Pe = Ya[Xe.forceUnit] ?? 1;
    if (Ze >= 0) {
      const qe = Se[Ze];
      let Ce = `Nodo ${Ze}
(${qe[0].toFixed(3)}, ${qe[1].toFixed(3)}, ${qe[2].toFixed(3)})`;
      const Ve = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ve == null ? void 0 : Ve.deformations) {
        const He = Ve.deformations.get(Ze);
        if (He && (Ce += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ce += `
Ux = ${bt(He[0] * we, 3)} ${Xe.dispUnit}`, Ce += `
Uy = ${bt(He[1] * we, 3)} ${Xe.dispUnit}`, Ce += `
Uz = ${bt(He[2] * we, 3)} ${Xe.dispUnit}`, (Math.abs(He[3]) > 1e-9 || Math.abs(He[4]) > 1e-9 || Math.abs(He[5]) > 1e-9) && (Ce += `
Rx = ${bt(He[3] * 1e3, 3)} mrad`, Ce += `
Ry = ${bt(He[4] * 1e3, 3)} mrad`, Ce += `
Rz = ${bt(He[5] * 1e3, 3)} mrad`)), Ve.reactions) {
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
    let Ne = -1, Oe = xt, kt = "frame";
    for (let qe = 0; qe < me.length; qe++) {
      const Ce = me[qe];
      if (!(!Ce || Ce.length < 2)) {
        if (Ce.length === 2) {
          const Ve = Te(Ce[0]), He = Te(Ce[1]);
          if (!Ve || !He || Ve.z < -1 || Ve.z > 1 || He.z < -1 || He.z > 1) continue;
          const Fe = Wa(ve, ue, Ve.x, Ve.y, He.x, He.y);
          Fe < Oe && (Oe = Fe, Ne = qe, kt = "frame");
        } else if (Ce.length === 3 || Ce.length === 4) {
          const Ve = [];
          let He = true;
          for (const Fe of Ce) {
            const ct = Te(Fe);
            if (!ct || ct.z < -1 || ct.z > 1) {
              He = false;
              break;
            }
            Ve.push(ct);
          }
          if (!He) continue;
          if (Ja(ve, ue, Ve)) {
            const ct = Ve.reduce((ut, dt) => ut + dt.z, 0) / Ve.length * 1e-3;
            ct < Oe && (Oe = ct, Ne = qe, kt = "shell");
          }
        } else if (Ce.length === 8) {
          const Ve = [];
          let He = true;
          for (const Be of Ce) {
            const Je = Te(Be);
            if (!Je || Je.z < -1 || Je.z > 1) {
              He = false;
              break;
            }
            Ve.push(Je);
          }
          if (!He) continue;
          const Fe = Math.min(...Ve.map((Be) => Be.x)), ct = Math.max(...Ve.map((Be) => Be.x)), ut = Math.min(...Ve.map((Be) => Be.y)), dt = Math.max(...Ve.map((Be) => Be.y));
          if (ve >= Fe && ve <= ct && ue >= ut && ue <= dt) {
            const Je = Ve.reduce((wt, Ae) => wt + Ae.z, 0) / Ve.length * 1e-3;
            Je < Oe && (Oe = Je, Ne = qe, kt = "solid");
          }
        }
      }
    }
    if (Ne >= 0) {
      const qe = me[Ne];
      let Ve = `${kt === "frame" ? "Frame" : kt === "shell" ? "Shell" : "Solid"} ${Ne}`;
      const He = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, Fe = (_g = (_f = He == null ? void 0 : He.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, Ne);
      if (Fe) {
        Fe.name && (Ve += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (Ve += `
  Shape: ${Fe.shape}`);
        const ct = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), ut = ct ? 100 : 1e3, dt = ct ? "cm" : "mm", Be = (wt) => {
          const Ae = wt * ut;
          return Math.abs(Ae - Math.round(Ae)) < 0.05 ? `${Math.round(Ae)}` : `${Ae.toFixed(1)}`;
        }, Je = [];
        if (Fe.D != null && Je.push(`D=${Be(Fe.D)}`), Fe.B != null && Je.push(`B=${Be(Fe.B)}`), Fe.TF != null && Je.push(`TF=${Be(Fe.TF)}`), Fe.TW != null && Je.push(`TW=${Be(Fe.TW)}`), Fe.t != null && Je.push(`t=${Be(Fe.t)}`), Je.length && (Ve += `
  Dim: ${Je.join(" ")} ${dt}`), Fe.material) {
          let wt = Fe.material;
          Fe.fillMaterial && (wt += ` + FILL "${Fe.fillMaterial}"`), Ve += `
  Mat: ${wt}`;
        }
      } else {
        const ct = (_i = (_h = He == null ? void 0 : He.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, Ne), ut = (_k = (_j = He == null ? void 0 : He.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, Ne);
        ct ? (Ve += `
  ${ct}`, ut && !ct.includes(ut) && (Ve += `  (${ut})`)) : ut && (Ve += `
  Material: ${ut}`);
      }
      if (Ve += `
nodos: [${qe.join(", ")}]`, kt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const ct = e.mesh.analyzeOutputs.rawVal, ut = Ua[Xe.stressUnit] ?? 1, dt = [["bendingXX", "Mxx", Pe, `${Xe.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Pe, `${Xe.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Pe, `${Xe.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Pe, `${Xe.forceUnit}/m`], ["membraneYY", "Nyy", Pe, `${Xe.forceUnit}/m`], ["membraneXY", "Nxy", Pe, `${Xe.forceUnit}/m`], ["shearX", "Qx", Pe, `${Xe.forceUnit}/m`], ["shearY", "Qy", Pe, `${Xe.forceUnit}/m`], ["vonMises", "\u03C3VM", ut, Xe.stressUnit], ["pressure", "p", ut, Xe.stressUnit]], Be = [];
        for (const [Je, wt, Ae, Mt] of dt) {
          const _t = ct == null ? void 0 : ct[Je];
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
          const Be = dt.get(qe[0]), Je = dt.get(qe[1]), wt = Se[qe[0]], Ae = Se[qe[1]];
          if (Be && Je && wt && Ae) {
            const Mt = Ae[0] - wt[0], _t = Ae[1] - wt[1], Dt = Ae[2] - wt[2], Et = Math.sqrt(Mt * Mt + _t * _t + Dt * Dt);
            if (Et > 1e-9) {
              const $t = Mt / Et, nn = _t / Et, Ut = Dt / Et, gn = (Je[0] - Be[0]) * $t + (Je[1] - Be[1]) * nn + (Je[2] - Be[2]) * Ut, Vt = ((_n = ut.elasticities) == null ? void 0 : _n.get(Ne)) ?? 0, on = ((_o = ut.areas) == null ? void 0 : _o.get(Ne)) ?? 0, vn = ((_p = ut.momentsOfInertiaY) == null ? void 0 : _p.get(Ne)) ?? 0, Ln = ((_q = ut.momentsOfInertiaZ) == null ? void 0 : _q.get(Ne)) ?? 0, so = ((_r = ut.torsionalConstants) == null ? void 0 : _r.get(Ne)) ?? 0, ao = ((_s2 = ut.shearModuli) == null ? void 0 : _s2.get(Ne)) ?? Vt / 2.6, sn = Vt * on * (gn / Et), In = (Je[3] - Be[3]) * $t + (Je[4] - Be[4]) * nn + (Je[5] - Be[5]) * Ut, an = ao * so * (In / Et), Rn = Je[4] - Be[4], Dn = Je[5] - Be[5], bn = Vt * vn * Rn / Et, pn = Vt * Ln * Dn / Et;
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
  function Y(z, K, Q) {
    var _a2, _b, _c;
    if (u.visible = false, v.visible = false, k.visible = false, W.visible = false, se.visible = false, !z || !e.mesh) {
      Z.style.display = "none", e.render();
      return;
    }
    const J = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (z.type === "node") {
      const me = X(z.idx);
      if (me) {
        const De = e.derivedNodes.rawVal ?? [];
        let Te = 1;
        if (De.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Xe of De) for (let we = 0; we < 3; we++) Xe[we] < Ze[we] && (Ze[we] = Xe[we]), Xe[we] > rt[we] && (rt[we] = Xe[we]);
          Te = Math.max(rt[0] - Ze[0], rt[1] - Ze[1], rt[2] - Ze[2], 0.1);
        }
        const We = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Qe = 0.021 * Te * We;
        u.position.copy(me), u.scale.setScalar(Qe), u.visible = true;
      }
    } else if (z.type === "frame" && J) {
      const me = J[z.idx], De = X(me[0]), Te = X(me[1]);
      if (De && Te) {
        const We = De.clone().add(Te).multiplyScalar(0.5), Qe = Te.clone().sub(De), Ze = Qe.length(), we = e.getActiveCamera().position.distanceTo(We) * 35e-4;
        k.position.copy(We);
        const Pe = new S(0, 1, 0), xt = Pe.clone().cross(Qe).normalize(), Ne = Pe.angleTo(Qe);
        k.quaternion.setFromAxisAngle(xt, Ne), k.scale.set(we, Ze, we), k.visible = true;
      }
    } else if (z.type === "shell" && J) {
      const me = J[z.idx], De = [], Te = [];
      for (const We of me) {
        const Qe = X(We);
        if (!Qe) return;
        De.push(Qe.x, Qe.y, Qe.z);
      }
      me.length === 4 ? Te.push(0, 1, 2, 0, 2, 3) : me.length === 3 && Te.push(0, 1, 2), F.setAttribute("position", new Ct(De, 3)), F.setIndex(Te), F.computeVertexNormals(), W.visible = true;
    } else if (z.type === "solid" && J) {
      const me = J[z.idx], De = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Te = [];
      for (const [We, Qe] of De) {
        const Ze = X(me[We]), rt = X(me[Qe]);
        Ze && rt && Te.push(Ze.x, Ze.y, Ze.z, rt.x, rt.y, rt.z);
      }
      ye.setAttribute("position", new Ct(Te, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", e.render();
      return;
    }
    Z.textContent = z.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const ue = e.rendererElm.getBoundingClientRect(), Se = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? ue;
    Z.style.left = `${K - Se.left}px`, Z.style.top = `${Q - Se.top}px`, e.render();
  }
  let L = "", E = 0, te = 0;
  const ce = window.__hekatanHoverDebug ?? false, he = (z) => {
    E && cancelAnimationFrame(E), E = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const K = A(z.clientX, z.clientY);
      if (ce && te < 5) {
        const J = e.derivedNodes.rawVal, ve = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${z.clientX}, ${z.clientY}) nodes=${(J == null ? void 0 : J.length) ?? 0} elems=${(ve == null ? void 0 : ve.length) ?? 0} hover=`, K), te++;
      }
      const Q = K ? `${K.type}:${K.idx}` : "";
      if (Q !== L) L = Q, Y(K, z.clientX, z.clientY);
      else if (K) {
        const J = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        Z.style.left = `${z.clientX - J.left}px`, Z.style.top = `${z.clientY - J.top}px`;
      }
    });
  };
  let ae = null;
  const N = () => {
    L = "", u.visible = false, v.visible = false, k.visible = false, W.visible = false, se.visible = false, Z.style.display = "none", e.render();
  }, pe = (z) => {
    const K = e.rendererElm.getBoundingClientRect(), Q = z.clientX - K.left, J = z.clientY - K.top;
    (Q < -2 || J < -2 || Q > K.width + 2 || J > K.height + 2) && (ae && clearTimeout(ae), ae = window.setTimeout(N, 200));
  }, O = () => {
    ae && (clearTimeout(ae), ae = null);
  };
  e.rendererElm.addEventListener("pointermove", he), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", O);
  function xe() {
    var _a2, _b, _c;
    const z = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return z === "select" || z === "none" || !z;
  }
  let ge = null;
  e.rendererElm.addEventListener("pointerdown", (z) => {
    z.button === 0 && (ge = { x: z.clientX, y: z.clientY });
  }), e.rendererElm.addEventListener("pointerup", (z) => {
    if (z.button !== 0 || !ge) return;
    const K = z.clientX - ge.x, Q = z.clientY - ge.y;
    if (ge = null, K * K + Q * Q > 9 || !xe()) return;
    const J = A(z.clientX, z.clientY);
    J ? (st({ type: J.type, idx: J.idx }, z.shiftKey), Ke()) : mt();
  }), window.addEventListener("keydown", (z) => {
    if (z.key !== "Escape" || !B.length) return;
    const K = document.activeElement, Q = !!K && (K.id === "hk3-cmd-input" || K.id === "hk-dyn-input") && K.value === "";
    K && (K.tagName === "INPUT" || K.tagName === "TEXTAREA" || K.isContentEditable) && !Q || mt();
  }, { capture: true });
  function Ee() {
    for (const z of $.children.slice()) {
      $.remove(z);
      const K = z.geometry;
      K && K !== r && K !== R && K.dispose();
    }
  }
  const Me = (z) => {
    var _a2;
    const K = e.getActiveCamera(), Q = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return K.isOrthographicCamera ? (K.top - K.bottom) / (K.zoom || 1) / Q : 2 * K.position.distanceTo(z) * Math.tan((K.fov || 50) * Math.PI / 180 / 2) / Q;
  };
  function Ie(z, K) {
    var _a2, _b;
    const Q = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (z.type === "node") {
      const J = X(z.idx);
      if (!J) return;
      const ve = new lt(r, I);
      ve.position.copy(J), ve.scale.setScalar(Math.max(1e-4, 7 * Me(J))), ve.renderOrder = 101, $.add(ve);
    } else if (z.type === "frame" && Q) {
      const J = Q[z.idx], ve = X(J[0]), ue = X(J[1]);
      if (!ve || !ue) return;
      const Se = ve.clone().add(ue).multiplyScalar(0.5), me = ue.clone().sub(ve), De = me.length(), Te = e.getActiveCamera().position.distanceTo(Se), We = new lt(R, oe);
      We.position.copy(Se);
      const Qe = new S(0, 1, 0);
      We.quaternion.setFromAxisAngle(Qe.clone().cross(me).normalize(), Qe.angleTo(me)), We.scale.set(Te * 35e-4, De, Te * 35e-4), We.renderOrder = 101, $.add(We);
    } else if (z.type === "shell" && Q) {
      const J = Q[z.idx], ve = [], ue = [];
      for (const De of J) {
        const Te = X(De);
        if (!Te) return;
        ve.push(Te.x, Te.y, Te.z);
      }
      J.length === 4 ? ue.push(0, 1, 2, 0, 2, 3) : J.length === 3 && ue.push(0, 1, 2);
      const Se = new ze();
      Se.setAttribute("position", new Ct(ve, 3)), Se.setIndex(ue), Se.computeVertexNormals();
      const me = new lt(Se, ie);
      me.renderOrder = 101, $.add(me);
    } else if (z.type === "solid" && Q) {
      const J = Q[z.idx], ve = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ue = [];
      for (const [De, Te] of ve) {
        const We = X(J[De]), Qe = X(J[Te]);
        We && Qe && ue.push(We.x, We.y, We.z, Qe.x, Qe.y, Qe.z);
      }
      const Se = new ze();
      Se.setAttribute("position", new Ct(ue, 3));
      const me = new Wt(Se, le);
      me.renderOrder = 101, $.add(me);
    }
  }
  function Ke() {
    if (Ee(), !B.length || !e.mesh) {
      e.render();
      return;
    }
    const z = e.derivedNodes.rawVal ?? [];
    if (z.length >= 2) {
      const K = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
      for (const J of z) for (let ve = 0; ve < 3; ve++) J[ve] < K[ve] && (K[ve] = J[ve]), J[ve] > Q[ve] && (Q[ve] = J[ve]);
      Math.max(Q[0] - K[0], Q[1] - K[1], Q[2] - K[2], 0.1);
    }
    for (const K of B) Ie(K);
    e.render();
  }
  function st(z, K) {
    const Q = B.findIndex((J) => J.type === z.type && J.idx === z.idx);
    Q >= 0 ? B.splice(Q, 1) : K || B.push(z), B.length && B[B.length - 1];
  }
  function mt() {
    B.length = 0, Ke();
  }
  return ee.derive(() => {
    e.derivedNodes.val, B.length && Ke();
  }), l;
}
function Wa(e, l, r, d, u, h) {
  const w = u - r, v = h - d, y = w * w + v * v;
  if (y < 1e-9) {
    const be = e - r, se = l - d;
    return Math.sqrt(be * be + se * se);
  }
  let k = ((e - r) * w + (l - d) * v) / y;
  k = Math.max(0, Math.min(1, k));
  const F = r + k * w, b = d + k * v, W = e - F, ye = l - b;
  return Math.sqrt(W * W + ye * ye);
}
function Ja(e, l, r) {
  let d = false;
  for (let u = 0, h = r.length - 1; u < r.length; h = u++) {
    const w = r[u].x, v = r[u].y, y = r[h].x, k = r[h].y;
    v > l != k > l && e < (y - w) * (l - v) / (k - v + 1e-12) + w && (d = !d);
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
    const R = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !R || R === "none" ? null : String(R).replace(/^contour:/, "");
  }, h = (R) => {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], B = /* @__PURE__ */ new Set();
    for (const $ of le) {
      if ($.length !== 2) continue;
      const Z = ie[$[0]], X = ie[$[1]];
      if (!Z || !X) continue;
      const A = En(Z, R), Y = En(X, R);
      Math.abs(A.fuera - Y.fuera) < tn && B.add(Math.round(A.fuera * 1e3) / 1e3);
    }
    return [...B].sort(($, Z) => $ - Z);
  };
  function w(R) {
    var _a3, _b2;
    if (R == null ? void 0 : R.plano) d = { plano: R.plano, en: R.en ?? h(R.plano)[0] ?? 0 };
    else {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((Z) => Z.type === "frame"), B = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], $ = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      le && $[le.idx] && B[$[le.idx][0]] && B[$[le.idx][1]] ? d = ja(B[$[le.idx][0]], B[$[le.idx][1]]) : d = { plano: "XZ", en: h("XZ")[0] ?? 0 };
    }
    r || v(), r.hidden = false, y();
  }
  function v() {
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
    const R = r.querySelector(".hk-d2-plano"), ie = r.querySelector(".hk-d2-en");
    R.addEventListener("change", () => {
      d = { plano: R.value, en: h(R.value)[0] ?? 0 }, y();
    }), ie.addEventListener("change", () => {
      d.en = Number(ie.value), y();
    });
    const le = (Z) => {
      const X = h(d.plano), A = X.findIndex((L) => Math.abs(L - d.en) < tn), Y = Math.max(0, Math.min(X.length - 1, (A < 0 ? 0 : A) + Z));
      X.length && (d.en = X[Y], y());
    };
    r.querySelector(".hk-d2-ant").addEventListener("click", () => le(-1)), r.querySelector(".hk-d2-sig").addEventListener("click", () => le(1));
    const B = r.querySelector(".hk-d2-bar");
    let $ = null;
    B.addEventListener("pointerdown", (Z) => {
      if (Z.target.closest("select,button")) return;
      const X = r.getBoundingClientRect();
      $ = { x: Z.clientX, y: Z.clientY, l: X.left, t: X.top }, r.style.transform = "none", r.style.left = X.left + "px", r.style.top = X.top + "px";
    }), window.addEventListener("pointermove", (Z) => {
      !$ || !r || (r.style.left = $.l + Z.clientX - $.x + "px", r.style.top = $.t + Z.clientY - $.y + "px");
    }), window.addEventListener("pointerup", () => {
      $ = null;
    }), new ResizeObserver(() => {
      r && !r.hidden && y();
    }).observe(r);
  }
  function y() {
    var _a3, _b2, _c, _d, _e, _f, _g, _h;
    if (!r || r.hidden) return;
    const R = new Set(b && !b.hidden && W >= 0 ? be(W) : []), ie = r.querySelector(".hk-d2-svg"), le = r.querySelector(".hk-d2-tit"), B = r.querySelector(".hk-d2-pie"), $ = r.querySelector(".hk-d2-plano"), Z = r.querySelector(".hk-d2-en");
    $.value = d.plano;
    const X = h(d.plano), A = d.plano === "XZ" ? "y" : d.plano === "YZ" ? "x" : "z", Y = d.plano === "XY" ? "Planta" : "P\xF3rtico";
    Z.innerHTML = X.map((we, Pe) => `<option value="${we}" ${Math.abs(we - d.en) < tn ? "selected" : ""}>${Y} ${Pe + 1} \xB7 ${A} = ${we.toFixed(2)} m</option>`).join("");
    const L = u(), E = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], te = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], ce = L ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[L] : null;
    ie.innerHTML = "";
    const he = ie.clientWidth || 880, ae = ie.clientHeight || 480, N = [];
    if (te.forEach((we, Pe) => {
      if (we.length !== 2) return;
      const xt = E[we[0]], Ne = E[we[1]];
      if (!xt || !Ne) return;
      const Oe = En(xt, d.plano), kt = En(Ne, d.plano);
      Math.abs(Oe.fuera - d.en) < tn && Math.abs(kt.fuera - d.en) < tn && N.push({ i: Pe, a: Oe, b: kt });
    }), !N.length) {
      B.textContent = "No hay barras en este plano.", le.textContent = "";
      return;
    }
    let pe = 1 / 0, O = -1 / 0, xe = 1 / 0, ge = -1 / 0;
    for (const we of N) for (const Pe of [we.a, we.b]) pe = Math.min(pe, Pe.u), O = Math.max(O, Pe.u), xe = Math.min(xe, Pe.v), ge = Math.max(ge, Pe.v);
    const Ee = O - pe || 1, Me = ge - xe || 1, Ie = 0.12 * Math.max(Ee, Me), Ke = 46, st = Math.min((he - 2 * Ke) / (Ee + 2 * Ie), (ae - 2 * Ke) / (Me + 2 * Ie)), mt = (he - Ee * st) / 2, z = (ae - Me * st) / 2, K = (we) => mt + (we - pe) * st, Q = (we) => ae - (z + (we - xe) * st), J = "http://www.w3.org/2000/svg", ve = (we, Pe, xt) => {
      const Ne = document.createElementNS(J, we);
      for (const Oe in Pe) Ne.setAttribute(Oe, String(Pe[Oe]));
      return xt != null && (Ne.textContent = xt), ie.appendChild(Ne), Ne;
    }, ue = /* @__PURE__ */ new Map();
    for (const we of N) {
      const Pe = ((_h = (_g = (_f = (_e = e.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, we.i)) ?? 0, xt = En(zs(L ?? "normals", Cs(E[te[we.i][0]], E[te[we.i][1]], Pe)), d.plano), Ne = Math.hypot(xt.u, xt.v);
      ue.set(we.i, Ne > 0.3 ? [xt.u / Ne, -xt.v / Ne] : null);
    }
    const Se = N.filter((we) => !ue.get(we.i)).length;
    let me = 0;
    if (ce) for (const we of N) {
      if (!ue.get(we.i)) continue;
      const Pe = ce instanceof Map ? ce.get(we.i) : ce[we.i];
      Pe && (me = Math.max(me, Math.abs(Pe[0] ?? 0), Math.abs(Pe[1] ?? 0)));
    }
    const De = 0.12 * Math.max(Ee, Me) * st, Te = me > 0 ? De / me : 0, We = L === "bendingsY" || L === "bendingsZ", Qe = (we) => Math.abs(we) >= 100 ? we.toFixed(1) : Math.abs(we) >= 10 ? we.toFixed(2) : we.toFixed(3), Ze = [];
    for (const we of N) {
      const Pe = K(we.a.u), xt = Q(we.a.v), Ne = K(we.b.u), Oe = Q(we.b.v), kt = ue.get(we.i), [qe, Ce] = kt ?? [0, 0], Ve = ce && kt ? ce instanceof Map ? ce.get(we.i) : ce[we.i] : null, [He, Fe] = Ve ? Vo(L, Ve) : [0, 0];
      if (Ve && Te > 0) {
        const Be = [Pe + qe * He * Te * 1, xt + Ce * He * Te * 1], Je = [Ne + qe * Fe * Te * 1, Oe + Ce * Fe * Te * 1], Mt = He + Fe >= 0 ? "#3fa7d6" : "#d9534f";
        ve("polygon", { points: `${Pe},${xt} ${Be[0]},${Be[1]} ${Je[0]},${Je[1]} ${Ne},${Oe}`, fill: Mt, "fill-opacity": 0.38, stroke: Mt, "stroke-width": 1.2 }), Ze.push({ x: Be[0] + qe * 12, y: Be[1] + Ce * 12, t: Qe(He), peso: Math.abs(He) }), Ze.push({ x: Je[0] + qe * 12, y: Je[1] + Ce * 12, t: Qe(Fe), peso: Math.abs(Fe) });
      }
      ve("line", { x1: Pe, y1: xt, x2: Ne, y2: Oe, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), R.has(we.i) && ve("line", { x1: Pe, y1: xt, x2: Ne, y2: Oe, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const ct = ve("line", { x1: Pe, y1: xt, x2: Ne, y2: Oe, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      ct.addEventListener("click", () => se(we.i));
      const ut = document.createElementNS(J, "title");
      ut.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", ct.appendChild(ut);
    }
    for (const we of N) for (const Pe of [we.a, we.b]) d.plano !== "XY" && Math.abs(Pe.v - xe) < tn && ve("rect", { x: K(Pe.u) - 6, y: Q(Pe.v), width: 12, height: 7, fill: "#b03a3a" });
    const rt = [];
    Ze.sort((we, Pe) => Pe.peso - we.peso);
    for (const we of Ze) we.peso < 0.02 * me || rt.some((Pe) => Math.hypot(Pe.x - we.x, Pe.y - we.y) < 34) || (rt.push(we), ve("text", { x: we.x, y: we.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, we.t));
    const Xe = L ? Oa[L] ?? L : "sin resultado";
    le.textContent = `${Xe} \xB7 ${d.plano === "XY" ? "planta" : "alzado"} ${d.plano} en ${A} = ${d.en.toFixed(2)} m`, B.textContent = L ? `${N.length} barras en el plano \xB7 m\xE1ximo ${Qe(me)} ${Qa[L] ?? ""}` + (We ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (Se ? ` \xB7 ${Se} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const k = () => {
    try {
      y();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, k();
  }));
  let F = null;
  setInterval(() => {
    var _a3, _b2;
    const R = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, ie = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, le = [R, ie];
    if (!(F && F[0] === R && F[1] === ie)) {
      F = le, k();
      try {
        oe();
      } catch {
      }
    }
  }, 400);
  let b = null, W = -1, ye = "12";
  function be(R) {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], B = /* @__PURE__ */ new Map();
    le.forEach((A, Y) => {
      if (A.length === 2) for (const L of A) B.has(L) || B.set(L, []), B.get(L).push(Y);
    });
    const $ = (A) => {
      const Y = ie[le[A][0]], L = ie[le[A][1]], E = [L[0] - Y[0], L[1] - Y[1], L[2] - Y[2]], te = Math.hypot(E[0], E[1], E[2]) || 1;
      return E.map((ce) => ce / te);
    }, Z = (A, Y) => {
      const L = $(A), E = $(Y);
      return Math.abs(L[0] * E[0] + L[1] * E[1] + L[2] * E[2]) > 0.9999;
    }, X = [R];
    for (const A of [0, 1]) {
      let Y = R, L = le[R][A];
      for (let E = 0; E < 500; E++) {
        const te = (B.get(L) ?? []).filter((he) => he !== Y);
        if (te.length !== 1 || !Z(Y, te[0])) break;
        const ce = te[0];
        A === 0 ? X.unshift(ce) : X.push(ce), L = le[ce][0] === L ? le[ce][1] : le[ce][0], Y = ce;
      }
    }
    return X;
  }
  function se(R) {
    if (R == null) {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((B) => B.type === "frame");
      if (!le) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      R = le.idx;
    }
    W = R, b || (b = document.createElement("div"), b.id = "hk-diagrama-barra", b.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), b.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(b), b.querySelector(".hk-b-x").addEventListener("click", () => {
      b.hidden = true, I(), y();
    }), b.querySelector(".hk-b-pl").addEventListener("change", (ie) => {
      ye = ie.target.value, oe();
    })), b.hidden = false, I(), oe(), y();
  }
  function I() {
    if (!r || !b) return;
    const R = window.innerWidth, ie = Math.min(560, Math.round(R * 0.4));
    b.style.width = ie + "px", !b.hidden && !r.hidden ? (r.style.transform = "none", r.style.left = "12px", r.style.width = R - ie - 36 + "px", b.style.top = r.getBoundingClientRect().top + "px") : r.hidden || (r.style.left = "50%", r.style.transform = "translateX(-50%)", r.style.width = "min(900px,92vw)");
  }
  function oe() {
    var _a3, _b2, _c;
    if (!b || b.hidden || W < 0) return;
    const R = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ie = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], le = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!ie[W]) return;
    const B = be(W), $ = [];
    let Z = 0, X = -1;
    B.forEach((O, xe) => {
      const [ge, Ee] = ie[O], Me = xe === 0 ? B.length > 1 && ie[B[1]].includes(ge) : ge !== X, Ie = Me ? Ee : ge, Ke = Me ? ge : Ee, st = Math.hypot(R[Ke][0] - R[Ie][0], R[Ke][1] - R[Ie][1], R[Ke][2] - R[Ie][2]);
      $.push({ x: Z, e: O, fin: Me ? 1 : 0 }), Z += st, $.push({ x: Z, e: O, fin: Me ? 0 : 1 }), X = Ke;
    });
    const A = Z, Y = (O, xe) => {
      const ge = le[O], Ee = ge ? ge instanceof Map ? ge.get(xe.e) : ge[xe.e] : null;
      return Ee ? Vo(O, Ee)[xe.fin] : 0;
    }, L = R[ie[B[0]][0]], E = (O) => O.toFixed(2);
    b.querySelector(".hk-b-tit").textContent = "L = " + A.toFixed(2) + " m \xB7 " + B.length + " tramo(s) \xB7 desde (" + E(L[0]) + ", " + E(L[1]) + ", " + E(L[2]) + ")";
    const te = ye === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], ce = b.querySelector(".hk-b-cuerpo");
    ce.innerHTML = "";
    const he = Math.max(300, ce.clientWidth), ae = 124, N = 46, pe = (ae - 14) / 2;
    for (const [O, xe, ge, Ee] of te) {
      const Me = $.map((me) => Y(O, me)), Ie = Math.max(...Me), Ke = Math.min(...Me), st = Math.max(Math.abs(Ie), Math.abs(Ke)) || 1, mt = (me) => N + me / (A || 1) * (he - 2 * N), z = (me) => pe + (Ee ? 1 : -1) * (me / st) * (pe - 16), K = (me) => Math.abs(me) >= 100 ? me.toFixed(1) : Math.abs(me) >= 10 ? me.toFixed(2) : me.toFixed(3);
      let Q = mt(0) + "," + pe + " ";
      $.forEach((me, De) => {
        Q += mt(me.x) + "," + z(Me[De]) + " ";
      }), Q += mt(A) + "," + pe;
      const J = Me.indexOf(Ie), ve = Me.indexOf(Ke), ue = (me, De) => {
        const Te = z(Me[me]) + (z(Me[me]) < pe ? -5 : 13);
        return '<text x="' + mt($[me].x) + '" y="' + Te + '" text-anchor="middle" fill="' + De + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + K(Me[me]) + "</text>";
      }, Se = Ee ? "#d9534f" : "#3fa7d6";
      ce.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + xe + ' <span style="color:#6f7d90;font-weight:400">(' + ge + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + K(Ie) + " \xB7 m\xEDn " + K(Ke) + (Ee ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + he + '" height="' + ae + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + N + '" y1="' + pe + '" x2="' + (he - N) + '" y2="' + pe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Q + '" fill="' + Se + '" fill-opacity=".35" stroke="' + Se + '" stroke-width="1.4"/>' + ue(0, "#f2f5fa") + ue($.length - 1, "#f2f5fa") + (J > 0 && J < $.length - 1 ? ue(J, "#8fd3ff") : "") + (ve > 0 && ve < $.length - 1 && ve !== J ? ue(ve, "#ff9f9a") : "") + '<text x="' + N + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (he - N) + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + A.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = se, window.__hekatanDiagrama2D = w, { abrir: w, abrirBarra: se };
}
function ws(e, l = 8) {
  const r = document.createElement("div");
  r.id = "legend", r.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    ee.derive(() => {
      oo.val, r.style.background = pa();
    });
  });
  const d = document.createElement("div");
  d.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", r.appendChild(d), setTimeout(() => {
    ee.derive(() => {
      d.textContent = To.val ? `[${To.val}]` : "";
    });
  });
  const u = Array.from({ length: l + 1 }, (y, k) => k / l).reverse();
  let h, w;
  u.forEach((y, k) => {
    h = document.createElement("div"), h.id = `marker-${k}`, h.className = "marker", h.style.marginTop = k == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", w = document.createElement("p"), w.id = `marker-text-${k}`, h.append(w), r.append(h);
  });
  const v = [];
  return r.querySelectorAll("p").forEach((y) => v.push(y)), setTimeout(() => {
    ee.derive(() => {
      u.forEach((y, k) => {
        const F = v[k];
        F && (F.innerText = ti(e.val, y).toString());
      });
    });
  }), r;
}
function ti(e, l) {
  const r = $n.val;
  if (r) return ys(r[0] + l * (r[1] - r[0]));
  const d = e.filter((w) => Number.isFinite(w));
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
  ra.DEFAULT_UP = new S(0, 0, 1);
  const h = document.createElement("div"), w = new sa(), v = new aa(45, 1, 0.1, 2 * 1e6), y = new ia(-10, 10, 10, -10, -1e3, 2e6);
  let k = v;
  const F = new la({ antialias: true });
  F.localClippingEnabled = true;
  const b = new us(v, F.domElement);
  b.enableDamping = true, b.dampingFactor = 0.1, b.screenSpacePanning = true, b.zoomSpeed = 0.8, b.panSpeed = 1.2, b.rotateSpeed = 0.9, b.keyPanSpeed = 12, b.listenToKeyEvents(window), b.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, F.domElement.addEventListener("wheel", (z) => {
    if (!z.ctrlKey && Math.abs(z.deltaX) > Math.abs(z.deltaY) * 1.5) {
      z.preventDefault();
      const K = b.target, Q = new S().subVectors(v.position, K), J = new S();
      J.crossVectors(v.up, Q).normalize();
      const ue = Q.length() * 1e-3 * b.panSpeed;
      K.addScaledVector(J, z.deltaX * ue), v.position.addScaledVector(J, z.deltaX * ue), b.update();
    }
  }, { passive: false });
  const W = new Po(new S(-1, 0, 0), 0), ye = new Po(new S(0, -1, 0), 0), be = new Po(new S(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const z = window.__hekatanClip, K = [];
    z.enableX && (W.normal.set(z.invertX ? 1 : -1, 0, 0), W.constant = z.invertX ? -z.posX : z.posX, K.push(W)), z.enableY && (ye.normal.set(0, z.invertY ? 1 : -1, 0), ye.constant = z.invertY ? -z.posY : z.posY, K.push(ye)), z.enableZ && (be.normal.set(0, 0, z.invertZ ? 1 : -1), be.constant = z.invertZ ? -z.posZ : z.posZ, K.push(be)), F.clippingPlanes = K, w.traverse((J) => {
      const ve = J;
      if (ve.material) {
        const ue = Array.isArray(ve.material) ? ve.material : [ve.material];
        for (const Se of ue) Se.clippingPlanes = K, Se.needsUpdate = true;
      }
    });
    const Q = window.__hekatanPanes ?? [];
    for (const J of Q) try {
      J && typeof J.refresh == "function" && J.refresh();
    } catch {
    }
    F.render(w, k);
  }
  se(), window.__hekatanClipApply = se;
  const I = ha(l), oe = ee.derive(() => Math.pow(10, I.displayScale.val / 10)), R = ni(e, I), ie = () => {
    const z = [];
    return I.gridXY.rawVal && z.push("xy"), I.gridXZ.rawVal && z.push("xz"), I.gridYZ.rawVal && z.push("yz"), z;
  }, le = () => {
    const z = I.gridStep.rawVal, K = Math.max(z, I.gridMajor.rawVal);
    return { planes: ie(), majorStep: K, minorStep: z };
  };
  let B = zo(I.gridSize.rawVal, le());
  B.visible = I.gridVisible.rawVal, window.__hekatanSnap2D = I.cursorSnap.rawVal;
  const $ = () => {
    const z = Math.max(0, Math.min(1, I.gridOpacity.rawVal));
    B.traverse((K) => {
      const Q = K.material;
      if (!Q || !("opacity" in Q)) return;
      const J = K.name ?? "";
      let ve = 0.55;
      J.includes("border") ? ve = 1 : J.includes("major") && (ve = 0.95), Q.opacity = z * ve;
    });
  };
  $(), h.appendChild(fa(I, e, u)), h.setAttribute("id", "viewer"), h.appendChild(F.domElement), F.setPixelRatio(window.devicePixelRatio);
  const Z = dn();
  F.setClearColor(Z.background, 1);
  const X = I.gridSize.rawVal, A = X * 0.5 + X * 0.5 / Math.tan(45 * 0.5);
  v.position.set(0, 0, A), v.up.set(0, 1, 0), b.target.set(0, 0, 0), b.minDistance = 0.1, b.maxDistance = 1e4, h.__settings = I, b.zoomSpeed = 1, b._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, b.update();
  let Y = hs(I.gridSize.rawVal, I.flipAxes.rawVal);
  w.add(B, Y), ee.derive(() => {
    window.__hekatanGridPlaneXY = I.gridXY.val, window.__hekatanGridPlaneXZ = I.gridXZ.val, window.__hekatanGridPlaneYZ = I.gridYZ.val;
  });
  let L = true;
  ee.derive(() => {
    const z = I.gridVisible.val;
    if (L) {
      L = false;
      return;
    }
    B.visible = z, O();
  });
  let E = true;
  ee.derive(() => {
    if (I.gridOpacity.val, E) {
      E = false;
      return;
    }
    $(), O();
  }), ee.derive(() => {
    const z = I.cursorSnap.val;
    window.__hekatanSnap2D = z;
  });
  let te = true;
  ee.derive(() => {
    var _a2, _b, _c;
    const z = I.gridSize.val, K = I.flipAxes.val;
    if (I.gridXY.val, I.gridXZ.val, I.gridYZ.val, I.gridStep.val, I.gridMajor.val, te) {
      te = false;
      return;
    }
    w.remove(B), (_a2 = B.traverse) == null ? void 0 : _a2.call(B, (ue) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ue.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), B = zo(z, le()), B.visible = I.gridVisible.rawVal, w.add(B), $(), w.remove(Y), Y.traverse((ue) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ue.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), Y = hs(z, K), w.add(Y);
    const Q = z * 0.5 + z * 0.5 / Math.tan(45 * 0.5);
    v.position.distanceTo(b.target);
    const J = Math.abs(v.position.x) < 0.1 && Math.abs(v.position.y) < 0.1 && v.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (J ? v.position.set(0, 0, Q) : v.position.set(0.5 * z, -Q, 0.5 * z), b.target.set(0, 0, 0)), b.minDistance = Math.max(0.05, z * 0.01), b.maxDistance = Math.max(50, z * 50), b.update(), O();
  }), new ResizeObserver((z) => {
    var _a2, _b;
    for (const K of z) {
      const Q = (_a2 = K.target) == null ? void 0 : _a2.clientWidth, J = (_b = K.target) == null ? void 0 : _b.clientHeight;
      if (Q === 0 || J === 0) continue;
      const ue = (he ? Q / 2 : Q) / J;
      v.aspect = ue, v.updateProjectionMatrix();
      const Se = y.top;
      if (y.left = -Se * ue, y.right = Se * ue, y.updateProjectionMatrix(), ae && ae.isPerspectiveCamera) ae.aspect = ue, ae.updateProjectionMatrix();
      else if (ae && ae.isOrthographicCamera) {
        const me = ae, De = me.top;
        me.left = -De * ue, me.right = De * ue, me.updateProjectionMatrix();
      }
      F.setSize(Q, J), O();
    }
  }).observe(h), b.addEventListener("change", O), ee.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, I.displayScale.val, I.nodes.val, I.elements.val, (_g = I.edges) == null ? void 0 : _g.val, I.elemColumns.val, I.elemBeams.val, I.nodesIndexes.val, I.elementsIndexes.val, I.orientations.val, I.sections.val, I.secColumns.val, I.secBeams.val, I.secFloor.val, I.supports.val, I.loads.val, I.deformedShape.val, I.nodeResults.val, I.frameResults.val, I.shellResults.val, (_h = I.solidResults) == null ? void 0 : _h.val, (_i = I.extruded) == null ? void 0 : _i.val, setTimeout(O);
  });
  let he = false, ae = null, N = null, pe = false;
  function O() {
    const z = h.clientWidth || 1, K = h.clientHeight || 1;
    if (!he || !ae) {
      F.setScissorTest(false), F.setViewport(0, 0, z, K), F.render(w, k);
      return;
    }
    const Q = z / 2;
    F.setScissorTest(true), F.setViewport(0, 0, Q, K), F.setScissor(0, 0, Q, K), F.render(w, k), F.setViewport(Q, 0, Q, K), F.setScissor(Q, 0, Q, K), F.render(w, ae), F.setScissorTest(false);
  }
  function xe(z) {
    k = z, b.object = z, b.update(), O();
  }
  function ge(z, K) {
    he = z, K && (ae = K);
    const Q = h.clientWidth || 1, J = h.clientHeight || 1, ue = (z ? Q / 2 : Q) / J;
    v.isPerspectiveCamera && (v.aspect = ue, v.updateProjectionMatrix());
    const Se = y.top;
    if (y.left = -Se * ue, y.right = Se * ue, y.updateProjectionMatrix(), z && ae) {
      if (N ? (N.object = ae, N.update()) : (N = new us(ae, F.domElement), N.enableDamping = true, N.dampingFactor = 0.1, N.screenSpacePanning = true, N.zoomSpeed = 0.8, N.panSpeed = 1.2, N.rotateSpeed = 0.9, N.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, N.target.copy(b.target), N.addEventListener("change", O), N.enabled = false), !pe) {
        const me = (De) => {
          if (!he || !N) return;
          const Te = F.domElement.getBoundingClientRect(), We = De.clientX - Te.left, Qe = Te.width / 2, Ze = We >= Qe;
          b.enabled = !Ze, N.enabled = Ze;
        };
        F.domElement.addEventListener("pointerdown", me, true), F.domElement.addEventListener("wheel", me, { capture: true, passive: true }), pe = true;
      }
    } else z || (b.enabled = true, N && (N.enabled = false));
    h.__splitMode = z, window.__hekatanSplitMode = z, window.__hekatanSplitCamera = z ? ae : null, O();
  }
  if (e) {
    w.add(ma(I, R, oe), ca(e, I, R), xa(I, R, oe), ga(e, I, R, oe), wa(e, I, R, oe), ya(e, I, R, oe), Ma(e, I, R, oe), ka(e, I, R, oe), za(e, I, R), Va(e, I, R, oe), Fa(e, I, R, oe)), window.__hekatanDiagrama2D || (ei(e, I), F.domElement.addEventListener("dblclick", () => {
      var _a2;
      const me = (_a2 = I.frameResults) == null ? void 0 : _a2.rawVal;
      !me || me === "none" || !(window.__hekatanModelSelection ?? []).some((Te) => Te.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const z = Ha({ scene: w, rendererElm: F.domElement, getActiveCamera: () => k, derivedNodes: R, derivedDisplayScale: oe, mesh: e, settings: I, render: O });
    w.add(z);
    const K = ri(e, I), Q = La(e, I, R, K), J = ws(K);
    w.add(Q), h.appendChild(J);
    const ve = Xa(e, I, R);
    w.add(ve);
    const ue = ve.__colorMapValues, Se = ws(ue);
    Se.id = "frame-legend", h.appendChild(Se), ee.derive(() => {
      var _a2;
      const me = I.shellResults.val != "none", De = (((_a2 = I.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Te = me || De, We = I.frameResults.val.startsWith("contour:"), Qe = K.val.some((Ze) => Number.isFinite(Ze));
      J.hidden = !Te || !Qe, Q.visible = Te, Se.hidden = !We;
    });
  }
  if (u) {
    const z = new bs(16777215, 0.5);
    w.add(z);
    const K = new to(16777215, 0.5);
    K.position.set(30, 25, -10), K.shadow.mapSize.width = 1024, K.shadow.mapSize.height = 1024, w.add(K);
    const Q = 10;
    K.shadow.camera.left = -Q, K.shadow.camera.right = Q, K.shadow.camera.top = Q, K.shadow.camera.bottom = -Q, K.shadow.camera.far = 1e3;
    const J = new to(16777215, 0.5);
    J.color.setHSL(11, 43, 96), J.position.set(-10, 0, 30), w.add(J), ee.derive(() => {
      (u == null ? void 0 : u.val.length) && (w.remove(...u.oldVal), w.add(...u.rawVal), O());
    }), ee.derive(() => {
      u.rawVal.forEach((ve) => ve.visible = I.solids.val), O();
    });
  }
  if (d) {
    const z = [], K = (J) => {
      var _a2;
      return ((_a2 = J == null ? void 0 : J.userData) == null ? void 0 : _a2.isCota) ? I.showCotas.val : I.custom3D.val;
    }, Q = () => {
      for (const J of z) J.visible = K(J);
      O();
    };
    ee.derive(() => {
      const J = d.val;
      z.length && (w.remove(...z), z.length = 0), J.length && (w.add(...J), z.push(...J), Q()), O();
    }), ee.derive(() => {
      I.custom3D.val, Q();
    }), ee.derive(() => {
      I.showCotas.val, Q();
    });
  }
  r && Ta({ drawingObj: r, gridObj: B, scene: w, getActiveCamera: () => k, controls: b, gridSize: X, derivedDisplayScale: oe, rendererElm: F.domElement, viewerRender: O }), gs((z, K) => {
    var _a2;
    F.setClearColor(K.background, 1), w.remove(B), (_a2 = B.traverse) == null ? void 0 : _a2.call(B, (Q) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = Q.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = Q.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), B = zo(I.gridSize.rawVal, { planes: ie() }), w.add(B), h.style.setProperty("--awatif-legend-color", K.legendMarker), O();
  });
  const Ee = { scene: w, perspCamera: v, orthoCamera: y, get camera() {
    return k;
  }, controls: b, renderer: F, rendererElm: F.domElement, render: O, setActiveCamera: xe, setSplitMode: ge, get splitMode() {
    return he;
  }, get splitCamera() {
    return ae;
  }, settings: I };
  h.__ctx = Ee;
  const Me = document.createElement("div");
  Me.id = "hk-nav-camara", Me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Ie = (z, K, Q) => {
    const J = document.createElement("button");
    return J.textContent = z, J.title = K, J.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), J.onmouseenter = () => {
      J.style.background = "rgba(70,70,70,0.9)";
    }, J.onmouseleave = () => {
      J.style.background = "rgba(40,40,40,0.85)";
    }, J.onclick = (ve) => {
      ve.preventDefault(), Q();
    }, J;
  }, Ke = (z, K) => {
    const Q = b.target, J = new S().subVectors(k.position, Q), ve = J.length(), ue = new S(), Se = new S();
    ue.crossVectors(k.up, J).normalize(), Se.copy(k.up).normalize();
    const me = ve * 0.05;
    Q.addScaledVector(ue, -z * me), Q.addScaledVector(Se, K * me), k.position.addScaledVector(ue, -z * me), k.position.addScaledVector(Se, K * me), b.update(), O();
  }, st = (z) => {
    const K = new S().subVectors(k.position, b.target);
    K.multiplyScalar(z), k.position.copy(b.target).add(K), b.update(), O();
  }, mt = () => {
    const z = document.createElement("div");
    return z.style.cssText = "width:32px;height:32px;", z;
  };
  return Me.append(mt()), Me.append(Ie("\u2191", "Pan arriba", () => Ke(0, 1))), Me.append(Ie("\u2295", "Zoom in", () => st(0.85))), Me.append(Ie("\u2190", "Pan izquierda", () => Ke(-1, 0))), Me.append(Ie("\u2302", "Reset vista", () => {
    b.reset(), O();
  })), Me.append(Ie("\u2192", "Pan derecha", () => Ke(1, 0))), Me.append(Ie("\u2296", "Zoom out", () => st(1.18))), Me.append(Ie("\u2193", "Pan abajo", () => Ke(0, -1))), Me.append(mt()), getComputedStyle(h).position === "static" && (h.style.position = "relative"), h.appendChild(Me), h;
}
function ni(e, l) {
  return ee.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const r = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], d = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!d || r.length === 0) return r;
    const u = l.deformScale.val, h = l.deformScale.val * l.deformScaleZ.val, w = Number.isFinite(u) ? u : 1, v = Number.isFinite(h) ? h : 1;
    return r.map((y, k) => {
      var _a3;
      const F = ((_a3 = d.get(k)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], b = Number.isFinite(F[0]) ? F[0] : 0, W = Number.isFinite(F[1]) ? F[1] : 0, ye = Number.isFinite(F[2]) ? F[2] : 0;
      return [y[0] + b * w, y[1] + W * w, y[2] + ye * v];
    });
  });
}
const $n = ee.state(null), To = ee.state(""), oi = ee.state("kN"), si = ee.state("mm"), ai = ee.state("kN/m\xB2"), ii = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, xs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, li = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ri(e, l) {
  const r = ee.state([]);
  let d;
  return ((u) => {
    u.bendingXX = "bendingXX", u.bendingYY = "bendingYY", u.bendingXY = "bendingXY", u.membraneXX = "membraneXX", u.membraneYY = "membraneYY", u.membraneXY = "membraneXY", u.tranverseShearX = "tranverseShearX", u.tranverseShearY = "tranverseShearY", u.membranePrincipalMax = "membranePrincipalMax", u.membranePrincipalMin = "membranePrincipalMin", u.bendingPrincipalMax = "bendingPrincipalMax", u.bendingPrincipalMin = "bendingPrincipalMin", u.transverseShearMax = "transverseShearMax", u.vonMises = "vonMises", u.pressure = "pressure", u.displacementX = "displacementX", u.displacementY = "displacementY", u.displacementZ = "displacementZ";
  })(d || (d = {})), ee.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), be = (K, Q) => {
      K == null ? void 0 : K.forEach((J, ve) => {
        const ue = e.elements.val[ve];
        if (ue) for (let Se = 0; Se < ue.length; Se++) Q.set(ue[Se], [J[Se] ?? J[0]]);
      });
    };
    be((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, u), be((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, h), be((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, w), be((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, v), be((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, y), be((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, k), be((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, F), be((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, b), be((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, W), be((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, ye);
    const se = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), le = (K, Q, J, ve, ue) => {
      K.forEach((Se, me) => {
        var _a3, _b2;
        const De = Se[0] ?? 0, Te = ((_a3 = Q.get(me)) == null ? void 0 : _a3[0]) ?? 0, We = ((_b2 = J.get(me)) == null ? void 0 : _b2[0]) ?? 0, Qe = (De + Te) / 2, Ze = Math.hypot((De - Te) / 2, We);
        ve.set(me, [Qe + Ze]), ue.set(me, [Qe - Ze]);
      });
    };
    le(v, y, k, se, I), le(u, h, w, oe, R), F.forEach((K, Q) => {
      var _a3;
      ie.set(Q, [Math.hypot(K[0] ?? 0, ((_a3 = b.get(Q)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const B = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, $ = (_w = l.solidResults) == null ? void 0 : _w.val, X = $ && $ !== "none" ? $ : l.shellResults.val, A = B == null ? void 0 : B[X], Y = { bendingXX: [u, 0], bendingYY: [h, 0], bendingXY: [w, 0], membraneXX: [v, 0], membraneYY: [y, 0], membraneXY: [k, 0], tranverseShearX: [F, 0], tranverseShearY: [b, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [I, 0], bendingPrincipalMax: [oe, 0], bendingPrincipalMin: [R, 0], transverseShearMax: [ie, 0], vonMises: [W, 0], pressure: [ye, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, L = l.shellResults.val, E = oi.val, te = si.val, ce = L === "displacementX" || L === "displacementY" || L === "displacementZ", he = L === "bendingXX" || L === "bendingYY" || L === "bendingXY" || L === "bendingPrincipalMax" || L === "bendingPrincipalMin", ae = L === "membraneXX" || L === "membraneYY" || L === "membraneXY" || L === "membranePrincipalMax" || L === "membranePrincipalMin", N = L === "vonMises" || L === "pressure", pe = L === "tranverseShearX" || L === "tranverseShearY" || L === "transverseShearMax", O = (_D = l.solidResults) == null ? void 0 : _D.val, xe = O === "vonMises" || O === "sigmaXX" || O === "sigmaYY" || O === "sigmaZZ" || O === "tauXY" || O === "tauYZ" || O === "tauXZ", ge = O === "ux" || O === "uy" || O === "uz", Ee = ai.val, Me = xe ? li[Ee] : ge || ce ? xs[te] : he || ae || N || pe ? 1 / ii[E] : 1, Ie = xe ? Ee : ge || ce ? te : he ? `${E}\xB7m/m` : ae ? `${E}/m\xB2` : N ? `${E}/m\xB2` : pe ? `${E}/m` : "";
    To.val = Ie, $n.val = Array.isArray(A) && A.length === 2 ? [A[0] * Me, A[1] * Me] : null;
    const Ke = Ss.val, mt = O && O !== "none" ? [W, 0] : Y[L], z = [];
    if (e.nodes.val.forEach((K, Q) => {
      const J = mt;
      if (!J || !J[0] || typeof J[0].has != "function") return;
      if (!J[0].has(Q)) {
        z.push(Number.NaN);
        return;
      }
      const ve = J[0].get(Q), ue = ve ? ve[J[1]] ?? 0 : 0;
      z.push(ue * Me);
    }), !$n.val && Ke !== "auto") {
      const K = e.nodes.val, Q = /* @__PURE__ */ new Set(), J = (ue, Se) => {
        var _a3;
        const me = (_a3 = K[ue[0]]) == null ? void 0 : _a3[Se];
        return ue.every((De) => {
          var _a4;
          return Math.abs((((_a4 = K[De]) == null ? void 0 : _a4[Se]) ?? NaN) - me) < 1e-6;
        });
      };
      for (const ue of e.elements.val) {
        if (ue.length !== 4) continue;
        const Se = J(ue, 2), me = !Se && J(ue, 0), De = !Se && J(ue, 1);
        if (Ke === "losas" ? Se : Ke === "muros" ? me || De : Ke === "murosX" ? me : Ke === "murosY" ? De : false) for (const Qe of ue) Q.add(Qe);
      }
      const ve = [];
      for (const ue of Q) {
        const Se = z[ue];
        Number.isFinite(Se) && ve.push(Se);
      }
      ve.length && ($n.val = $o(ve));
    }
    r.val = z;
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
