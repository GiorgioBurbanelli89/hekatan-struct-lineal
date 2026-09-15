import { u as an, a6 as Fo, q as Ja, v as ue, a7 as Oa, D as Vt, M as ct, B as Ae, F as Lt, a8 as Qa, z as xt, a9 as ja, aa as ei, h as Qs, ab as js, r as Rn, ac as Io, ad as To, a4 as ha, _ as ut, b as ft, L as Qt, y as ma, c as ti, ae as ni, f as wt, V as $, $ as Tn, af as is, K as Do, d as $t, a as ls, A as wa, t as Bo, J as oi, H as lo, I as si, ag as Ro, w as rs, o as ai, N as Pn, a2 as so, E as ea, S as Hn, m as cs, ah as ao, g as ta, i as na, j as oa, C as sa, W as ii, X as li, Y as ri, Z as ci, T as $o, P as ds, U as di } from "./theme-C-zoknmI.js";
import { T as Tt, O as aa } from "./Text-Cehu0nom.js";
import { P as ya } from "./tweakpane-BXg6ZhiP.js";
import { e as ui } from "./styles-CqEyA8nI.js";
class xa {
  constructor(h, g = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(h, g);
  }
  set(h) {
    return h.isLut === true && this.copy(h), this;
  }
  setMin(h) {
    return this.minV = h, this;
  }
  setMax(h) {
    return this.maxV = h, this;
  }
  setColorMap(h, g = 32) {
    this.map = us[h] || us.rainbow, this.n = g;
    const v = 1 / this.n, _ = new an(), z = new an();
    this.lut.length = 0, this.lut.push(new an(this.map[0][1]));
    for (let P = 1; P < g; P++) {
      const E = P * v;
      for (let C = 0; C < this.map.length - 1; C++) if (E > this.map[C][0] && E <= this.map[C + 1][0]) {
        const V = this.map[C][0], N = this.map[C + 1][0];
        _.setHex(this.map[C][1], Fo), z.setHex(this.map[C + 1][1], Fo);
        const Y = new an().lerpColors(_, z, (E - V) / (N - V));
        this.lut.push(Y);
      }
    }
    return this.lut.push(new an(this.map[this.map.length - 1][1])), this;
  }
  copy(h) {
    return this.lut = h.lut, this.map = h.map, this.n = h.n, this.minV = h.minV, this.maxV = h.maxV, this;
  }
  getColor(h) {
    h = Ja.clamp(h, this.minV, this.maxV), h = (h - this.minV) / (this.maxV - this.minV);
    const g = Math.round(h * this.n);
    return this.lut[g];
  }
  addColorMap(h, g) {
    return us[h] = g, this;
  }
  createCanvas() {
    const h = document.createElement("canvas");
    return h.width = 1, h.height = this.n, this.updateCanvas(h), h;
  }
  updateCanvas(h) {
    const g = h.getContext("2d", { alpha: false }), v = g.getImageData(0, 0, 1, this.n), _ = v.data;
    let z = 0;
    const P = 1 / this.n, E = new an(), C = new an(), V = new an();
    for (let N = 1; N >= 0; N -= P) for (let Y = this.map.length - 1; Y >= 0; Y--) if (N < this.map[Y][0] && N >= this.map[Y - 1][0]) {
      const j = this.map[Y - 1][0], X = this.map[Y][0];
      E.setHex(this.map[Y - 1][1], Fo), C.setHex(this.map[Y][1], Fo), V.lerpColors(E, C, (N - j) / (X - j)), _[z * 4] = Math.round(V.r * 255), _[z * 4 + 1] = Math.round(V.g * 255), _[z * 4 + 2] = Math.round(V.b * 255), _[z * 4 + 3] = 255, z += 1;
    }
    return g.putImageData(v, 0, 0), h;
  }
}
const us = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ga = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], pi = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ga, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, No = ue.state("safe"), ba = ue.state("auto");
function Ma(t) {
  t = Math.max(0, Math.min(1, t));
  const h = pi[No.val] ?? ga;
  for (let v = 0; v < h.length - 1; v++) {
    const [_, z, P, E] = h[v], [C, V, N, Y] = h[v + 1];
    if (t <= C) {
      const j = (t - _) / (C - _);
      return [z + (V - z) * j, P + (N - P) * j, E + (Y - E) * j];
    }
  }
  const g = h[h.length - 1];
  return [g[1], g[2], g[3]];
}
function ia() {
  const h = new Uint8Array(1024);
  for (let v = 0; v < 256; v++) {
    const _ = v / 255, [z, P, E] = Ma(_);
    h[v * 4 + 0] = z, h[v * 4 + 1] = P, h[v * 4 + 2] = E, h[v * 4 + 3] = 255;
  }
  const g = new ja(h, 256, 1, ei);
  return g.minFilter = Qs, g.magFilter = Qs, g.wrapS = js, g.wrapT = js, g.needsUpdate = true, g;
}
function fi() {
  const h = [];
  for (let g = 0; g <= 12; g++) {
    const v = 1 - g / 12, [_, z, P] = Ma(v);
    h.push(`rgb(${_ | 0},${z | 0},${P | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${h.join(",")})`;
}
function xs(t) {
  if (!t.length) return [0, 1];
  const h = [...t].sort((z, P) => z - P), g = (z) => h[Math.min(h.length - 1, Math.max(0, Math.round(z * (h.length - 1))))];
  let v = h.length >= 20 ? g(0.01) : h[0], _ = h.length >= 20 ? g(0.99) : h[h.length - 1];
  return v >= 0 && _ > 0 && (v = 0), _ <= 0 && v < 0 && (_ = 0), [v, _];
}
function hi(t, h, g) {
  new xa();
  const v = ia(), _ = new Oa({ uniforms: { cmap: { value: v }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: Vt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  ue.derive(() => {
    var _a2;
    No.val;
    const P = _.uniforms.cmap.value;
    _.uniforms.cmap.value = ia(), (_a2 = P == null ? void 0 : P.dispose) == null ? void 0 : _a2.call(P);
  });
  const z = new ct(new Ae(), _);
  return z.renderOrder = -1, z.frustumCulled = false, z.userData.isShellArea = true, z.name = "__hekatan_shell_colormap", ue.derive(() => {
    z.geometry.setAttribute("position", new Lt(t.val.flat(), 3));
    const P = [], E = [], C = [];
    h.val.forEach((se, we) => {
      se.length === 3 ? (P.push(se[0], se[1], se[2]), E.push(we), C.push(0)) : se.length === 4 && (P.push(se[0], se[1], se[2]), P.push(se[0], se[2], se[3]), E.push(we, we), C.push(0, 1));
    }), z.geometry.setIndex(new Qa(P, 1)), z.userData.faceToElem = E, z.userData.faceLocal = C;
    const V = g.val.filter((se) => Number.isFinite(se));
    let N, Y;
    const j = co.val;
    if (j ? (Y = j[0], N = j[1]) : [Y, N] = xs(V), N === Y) {
      const se = Math.max(Math.abs(N) * 1e-6, 1e-9);
      N += se, Y -= se;
    }
    const X = j && j[0] > j[1], he = Math.min(Y, N), Q = Math.max(Y, N), Z = Q - he, oe = new Float32Array(g.val.length);
    for (let se = 0; se < g.val.length; se++) {
      const we = g.val[se];
      if (!Number.isFinite(we)) {
        oe[se] = -1;
        continue;
      }
      const me = ((X ? Q + he - we : we) - he) / Z;
      oe[se] = Math.max(0, Math.min(1, me));
    }
    z.geometry.setAttribute("scalar", new xt(oe, 1));
  }), z;
}
function mi(t, h, g) {
  const v = document.createElement("div"), _ = new ya({ title: "Settings", expanded: true, container: v });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(_), v.setAttribute("id", "settings");
  const z = "hk_settingsPos";
  let P = null;
  try {
    const X = localStorage.getItem(z);
    X && (P = JSON.parse(X));
  } catch {
  }
  v.style.cssText = ["position:fixed", P ? `left:${P.left}px` : "left:8px", P ? `top:${P.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const E = () => {
    const X = v.querySelector(".tp-rotv_b");
    if (!X) {
      setTimeout(E, 200);
      return;
    }
    X.style.cursor = "move", X.style.userSelect = "none";
    let he = false, Q = 0, Z = 0, oe = 0, se = 0;
    X.addEventListener("mousedown", (we) => {
      he = true, Q = we.clientX, Z = we.clientY;
      const fe = v.getBoundingClientRect();
      oe = fe.left, se = fe.top, v.style.left = `${oe}px`, v.style.top = `${se}px`;
    }), window.addEventListener("mousemove", (we) => {
      if (!he) return;
      const fe = we.clientX - Q, me = we.clientY - Z, re = Math.max(0, Math.min(window.innerWidth - 40, oe + fe)), G = Math.max(0, Math.min(window.innerHeight - 40, se + me));
      v.style.left = `${re}px`, v.style.top = `${G}px`;
    }), window.addEventListener("mouseup", () => {
      if (he) {
        he = false;
        try {
          localStorage.setItem(z, JSON.stringify({ left: parseFloat(v.style.left), top: parseFloat(v.style.top) }));
        } catch {
        }
      }
    });
  };
  if (E(), h == null ? void 0 : h.nodes) {
    _.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const X = _.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    X.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), X.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), X.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), X.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const he = X.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    he.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), he.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), he.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), he.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), he.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const Q = _.addFolder({ title: "\u{1F441} Ver", expanded: false });
    Q.addBinding(t.nodes, "val", { label: "Nodes" }), Q.addBinding(t.elements, "val", { label: "Elements" }), Q.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), Q.addBinding(t.faces, "val", { label: "  Caras (fill)" }), Q.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), Q.addBinding(t.elemColumns, "val", { label: "    Columnas" }), Q.addBinding(t.elemBeams, "val", { label: "    Vigas" }), Q.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), Q.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), Q.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), Q.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), Q.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), Q.addBinding(t.orientations, "val", { label: "Orientations" }), Q.addBinding(t.sections, "val", { label: "Sections" }), Q.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), Q.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), Q.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), Q.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), Q.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((h == null ? void 0 : h.nodeInputs) || (h == null ? void 0 : h.elementInputs)) {
    const X = _.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    X.addBinding(t.supports, "val", { label: "Supports" }), X.addBinding(t.loads, "val", { label: "Loads" }), X.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), X.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((h == null ? void 0 : h.deformOutputs) || (h == null ? void 0 : h.analyzeOutputs)) {
    const X = _.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = X, X.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), X.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), X.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), X.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), X.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), X.addBinding(No, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), X.addBinding(ba, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), X.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), X.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), X.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), X.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && _.addBinding(t.solids, "val", { label: "Solids" });
  const C = _.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), V = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), N = () => {
    const X = window.__hekatanClipApply;
    typeof X == "function" && X();
  };
  let Y = [];
  const j = (X, he) => {
    for (const Z of Y) try {
      Z.dispose();
    } catch {
    }
    Y = [];
    const Q = (Z, oe) => {
      const se = Math.floor(Math.min(X[oe], -50)), we = Math.ceil(Math.max(he[oe], 50)), fe = we - se > 400 ? 0.5 : 0.1;
      return V["pos" + Z] = Math.max(se, Math.min(we, V["pos" + Z])), C.addBinding(V, "pos" + Z, { min: se, max: we, step: fe, label: `  pos ${Z} (m)` }).on("change", N);
    };
    Y.push(C.addBinding(V, "enableX", { label: "Cortar X" }).on("change", N), Q("X", 0), C.addBinding(V, "invertX", { label: "  invertir X" }).on("change", N), C.addBinding(V, "enableY", { label: "Cortar Y" }).on("change", N), Q("Y", 1), C.addBinding(V, "invertY", { label: "  invertir Y" }).on("change", N), C.addBinding(V, "enableZ", { label: "Cortar Z" }).on("change", N), Q("Z", 2), C.addBinding(V, "invertZ", { label: "  invertir Z" }).on("change", N));
  };
  return j([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (X, he) => {
    j(X, he);
  }, v;
}
function wi(t) {
  return { gridSize: ue.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: ue.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: ue.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: ue.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: ue.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: ue.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: ue.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: ue.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: ue.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: ue.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: ue.state((t == null ? void 0 : t.nodes) ?? true), elements: ue.state((t == null ? void 0 : t.elements) ?? true), edges: ue.state((t == null ? void 0 : t.edges) ?? true), faces: ue.state((t == null ? void 0 : t.faces) ?? true), elemColumns: ue.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: ue.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: ue.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: ue.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: ue.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: ue.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: ue.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: ue.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: ue.state((t == null ? void 0 : t.orientations) ?? false), sections: ue.state((t == null ? void 0 : t.sections) ?? true), extruded: ue.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: ue.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: ue.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: ue.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: ue.state((t == null ? void 0 : t.secFloor) ?? -1), supports: ue.state((t == null ? void 0 : t.supports) ?? true), loads: ue.state((t == null ? void 0 : t.loads) ?? false), deformedShape: ue.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: ue.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: ue.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: ue.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: ue.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: ue.state((t == null ? void 0 : t.flipAxes) ?? false), solids: ue.state((t == null ? void 0 : t.solids) ?? true), custom3D: ue.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: ue.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: ue.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: ue.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function yi(t, h, g) {
  const v = Rn(), _ = new Io(new Ae(), new To({ color: v.nodePoint }));
  return ha((z, P) => {
    _.material.color.setHex(P.nodePoint);
  }), _.frustumCulled = false, ue.derive(() => {
    t.nodes.val && _.geometry.setAttribute("position", new Lt(h.val.flat(), 3));
  }), ue.derive(() => {
    if (g.val, h.val, !t.nodes.rawVal) return;
    const z = h.rawVal ?? [];
    let P = t.gridSize.val * 0.5;
    if (z.length >= 2) {
      const C = [1 / 0, 1 / 0, 1 / 0], V = [-1 / 0, -1 / 0, -1 / 0];
      for (const N of z) for (let Y = 0; Y < 3; Y++) C[Y] = Math.min(C[Y], N[Y]), V[Y] = Math.max(V[Y], N[Y]);
      P = Math.max(V[0] - C[0], V[1] - C[1], V[2] - C[2], 0.1);
    }
    const E = 0.03 * P;
    _.material.size = E * g.rawVal;
  }), ue.derive(() => {
    _.visible = t.nodes.val;
  }), _;
}
function ps(t, h) {
  const g = Rn(), v = new ut();
  v.name = "hekatan-grid";
  const _ = (h == null ? void 0 : h.planes) ?? ["xy"];
  let z = (h == null ? void 0 : h.majorStep) ?? 1, P = (h == null ? void 0 : h.minorStep) ?? 0.1;
  for (z <= 0 && (z = 1), P <= 0 && (P = 0.1); t / P > 500; ) P *= 2;
  for (; t / z > 100; ) z *= 2;
  const E = t / 2;
  z = Math.max(P, Math.round(z / P) * P);
  const V = new an(g.grid).multiplyScalar(1.3), N = new an(g.grid).multiplyScalar(0.8), Y = (Q, Z, oe, se) => {
    const we = [], fe = Q === "xy" ? (I, K) => [I, K, 0] : Q === "xz" ? (I, K) => [I, 0, K] : (I, K) => [0, I, K], me = Math.floor(E / Z);
    for (let I = -me; I <= me; I++) {
      const K = I * Z, q = fe(K, -E), L = fe(K, E);
      we.push(...q, ...L);
    }
    for (let I = -me; I <= me; I++) {
      const K = I * Z, q = fe(-E, K), L = fe(E, K);
      we.push(...q, ...L);
    }
    const re = new Ae();
    re.setAttribute("position", new Lt(we, 3));
    const G = new ft({ color: oe, transparent: true, opacity: se, depthWrite: false }), U = new Qt(re, G);
    return U.name = `grid-${Q}-${Z === P ? "minor" : "major"}`, U;
  }, j = (Q, Z, oe) => {
    const se = Q === "xy" ? (U, I) => [U, I, 0] : Q === "xz" ? (U, I) => [U, 0, I] : (U, I) => [0, U, I], we = [[-E, -E], [E, -E], [E, E], [-E, E]], fe = [];
    for (const [U, I] of we) fe.push(...se(U, I));
    const me = new Ae();
    me.setAttribute("position", new Lt(fe, 3));
    const re = new ft({ color: Z, transparent: true, opacity: oe, depthWrite: false }), G = new ma(me, re);
    return G.name = `grid-${Q}-border`, G.renderOrder = 1, G;
  }, X = (Q, Z, oe) => {
    const se = Q === "xy" ? (re, G) => [re, G, 0] : Q === "xz" ? (re, G) => [re, 0, G] : (re, G) => [0, re, G], we = Z === "u" ? [...se(-E, 0), ...se(E, 0)] : [...se(0, -E), ...se(0, E)], fe = new Ae();
    fe.setAttribute("position", new Lt(we, 3));
    const me = new Qt(fe, new ft({ color: oe, transparent: true, opacity: 0.45, depthWrite: false }));
    return me.name = `grid-${Q}-eje-${Z}`, me.renderOrder = 1, me;
  }, he = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const Q of _) {
    v.add(Y(Q, P, N, 0.12)), v.add(Y(Q, z, V, 0.4));
    const [Z, oe] = he[Q];
    v.add(X(Q, "u", Z)), v.add(X(Q, "v", oe)), v.add(j(Q, V, 0.55));
  }
  return v.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: z, minorStep: P, gridSize: t, planes: [..._] }, v;
}
function xi(t, h, g, v) {
  const _ = new ut(), z = new ti(0.5, 0.5, 0.5), P = new ni(0.45, 0.7, 4);
  P.rotateX(Math.PI / 2), P.translate(0, 0, -0.35);
  const E = new wt({ color: 10166822 }), C = new wt({ color: 2792847 }), V = new wt({ color: 3835647 }), N = () => {
    const X = g.rawVal ?? [];
    if (X.length < 2) return h.gridSize.val * 0.5;
    let he = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
    for (const Z of X) for (let oe = 0; oe < 3; oe++) Z[oe] < he[oe] && (he[oe] = Z[oe]), Z[oe] > Q[oe] && (Q[oe] = Z[oe]);
    return Math.max(Q[0] - he[0], Q[1] - he[1], Q[2] - he[2], 0.1);
  }, Y = () => 0.08 * N(), j = () => v.rawVal;
  return ue.derive(() => {
    var _a2, _b;
    if (h.deformedShape.val, !h.supports.val) return;
    _.clear();
    const X = Y();
    (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((he, Q) => {
      const Z = g.val[Q];
      if (!Z) return;
      const oe = he ?? [], se = (oe[0] ? 1 : 0) + (oe[1] ? 1 : 0) + (oe[2] ? 1 : 0), we = (oe[3] ? 1 : 0) + (oe[4] ? 1 : 0) + (oe[5] ? 1 : 0);
      let fe;
      se >= 3 && we >= 3 ? fe = new ct(z, E) : se >= 3 && we === 0 ? fe = new ct(P, C) : fe = new ct(P, V), fe.position.set(Z[0], Z[1], Z[2]);
      const me = X * j();
      fe.scale.set(me, me, me), _.add(fe);
    });
  }), ue.derive(() => {
    if (v.val, !h.supports.rawVal) return;
    const he = Y() * j();
    _.children.forEach((Q) => Q.scale.set(he, he, he));
  }), ue.derive(() => {
    _.visible = h.supports.val;
  }), _;
}
function gi(t, h, g, v) {
  const _ = new ut();
  _.name = "loadsGroup";
  function z(E) {
    if (E.length < 2) return 0.12 * h.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], V = [-1 / 0, -1 / 0, -1 / 0];
    for (const Y of E) for (let j = 0; j < 3; j++) C[j] = Math.min(C[j], Y[j]), V[j] = Math.max(V[j], Y[j]);
    return 0.08 * Math.max(V[0] - C[0], V[1] - C[1], V[2] - C[2], 0.1);
  }
  ue.derive(() => {
    var _a2, _b, _c;
    if (h.deformedShape.val, !h.loads.val) return;
    _.children.forEach((Q) => {
      var _a3;
      return (_a3 = Q.dispose) == null ? void 0 : _a3.call(Q);
    }), _.clear();
    const E = g.val, C = z(E), V = 240, N = [];
    (_c = (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((Q, Z) => {
      E[Z] && Q.slice(0, 3).some((oe) => Math.abs(oe) > 1e-15) && N.push(Z);
    });
    let Y = N;
    if (N.length > V) {
      const Q = N.map((L) => E[L][0]), Z = N.map((L) => E[L][1]), oe = Math.min(...Q), se = Math.max(...Q), we = Math.min(...Z), fe = Math.max(...Z), me = N.map((L) => E[L][2]), re = Math.max(1e-6, (Math.max(...me) - Math.min(...me)) / 40), G = (L) => Math.round(L / re), U = new Set(me.map(G)), I = Math.max(4, Math.floor(V / Math.max(1, U.size))), K = Math.max(2, Math.round(Math.sqrt(I))), q = /* @__PURE__ */ new Map();
      for (const L of N) {
        const J = se - oe < 1e-9 ? 0 : (E[L][0] - oe) / (se - oe), de = fe - we < 1e-9 ? 0 : (E[L][1] - we) / (fe - we), pe = Math.min(K - 1, Math.floor(J * K)), ce = Math.min(K - 1, Math.floor(de * K)), H = `${pe},${ce},${G(E[L][2])}`, Me = Math.hypot(J * K - (pe + 0.5), de * K - (ce + 0.5)), ee = q.get(H);
        (!ee || Me < ee.d) && q.set(H, { i: L, d: Me });
      }
      Y = [...q.values()].map((L) => L.i);
    }
    let j = 0;
    for (const Q of Y) {
      const Z = t.nodeInputs.val.loads.get(Q);
      for (let oe = 0; oe < 3; oe++) j = Math.max(j, Math.abs(Z[oe]));
    }
    const X = Y.length <= 60, he = (Q) => {
      const Z = Math.abs(Q);
      return Z >= 100 ? Q.toFixed(0) : Z >= 10 ? Q.toFixed(1) : Q.toFixed(2);
    };
    for (const Q of Y) {
      const Z = t.nodeInputs.val.loads.get(Q), oe = E[Q];
      if (oe) for (let se = 0; se < 3; se++) {
        const we = Z[se];
        if (!(Math.abs(we) > 1e-9 * (j || 1))) continue;
        const fe = new $(se === 0 ? Math.sign(we) : 0, se === 1 ? Math.sign(we) : 0, se === 2 ? Math.sign(we) : 0), me = 0.45 + 0.55 * (j ? Math.abs(we) / j : 1), re = new Tn(fe, new $(...oe), 1, se === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (re.userData = { nudo: oe, dir: fe, rel: me }, _.add(re), X) {
          const G = new Tt(he(we), se === 2 ? "#f5b642" : "#ff6b5e");
          G.userData = { nudo: oe, dir: fe, rel: me, texto: true }, _.add(G);
        }
      }
    }
    P(C * v.rawVal);
  });
  function P(E) {
    _.children.forEach((C) => {
      const V = C.userData;
      if (!(V == null ? void 0 : V.dir)) return;
      const N = E * V.rel, Y = new $(...V.nudo).addScaledVector(V.dir, -N * (V.texto ? 1.12 : 1));
      C.position.copy(Y), V.texto ? C.updateScale(E * 0.38) : C.scale.set(N, N, N);
    });
  }
  return ue.derive(() => {
    v.val, h.loads.rawVal && P(z(g.rawVal) * v.rawVal);
  }), ue.derive(() => {
    _.visible = h.loads.val;
  }), _;
}
function bi(t, h, g) {
  const v = new ut();
  return ue.derive(() => {
    if (!t.nodesIndexes.val) return;
    v.children.forEach((z) => z.dispose()), v.clear();
    const _ = 0.05 * t.gridSize.val * 0.6;
    h.val.forEach((z, P) => {
      const E = new Tt(`${P}`);
      E.position.set(...z), E.updateScale(_ * g.rawVal), v.add(E);
    });
  }), ue.derive(() => {
    if (g.val, !t.nodesIndexes.rawVal) return;
    const _ = 0.05 * t.gridSize.val * 0.6;
    v.children.forEach((z) => z.updateScale(_ * g.rawVal));
  }), ue.derive(() => {
    v.visible = t.nodesIndexes.val;
  }), v;
}
function Mi(t, h, g, v) {
  const _ = new ut();
  return ue.derive(() => {
    var _a2;
    if (h.deformedShape.val, !h.elementsIndexes.val) return;
    _.children.forEach((P) => P.dispose()), _.clear();
    const z = 0.05 * h.gridSize.val * 0.6;
    (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((P, E) => {
      const C = new Tt(`${E}`, void 0, "#001219");
      C.position.set(...vi(P.map((V) => g.rawVal[V]))), C.updateScale(z * v.rawVal), _.add(C);
    });
  }), ue.derive(() => {
    if (v.val, !h.elementsIndexes.rawVal) return;
    const z = 0.05 * h.gridSize.val * 0.6;
    _.children.forEach((P) => P.updateScale(z * v.rawVal));
  }), ue.derive(() => {
    _.visible = h.elementsIndexes.val;
  }), _;
}
function vi(t) {
  const h = t.reduce((v, _) => [v[0] + _[0], v[1] + _[1], v[2] + _[2]], [0, 0, 0]), g = t.length;
  return [h[0] / g, h[1] / g, h[2] / g];
}
function la(t, h) {
  const g = new ut(), v = Math.min(0.05 * t, 0.6), _ = Rn(), z = new Tt("X", "red", "transparent"), P = new Tt(h ? "Z" : "Y", "green", "transparent"), E = new Tt(h ? "Y" : "Z", "blue", "transparent"), C = new Tn(new $(1, 0, 0), new $(0, 0, 0), 1, _.axisArrow, 0.2, 0.2), V = new Tn(new $(0, 1, 0), new $(0, 0, 0), 1, _.axisArrow, 0.2, 0.2), N = new Tn(new $(0, 0, 1), new $(0, 0, 0), 1, _.axisArrow, 0.2, 0.2);
  return z.position.set(1.3 * v, 0, 0), P.position.set(0, 1.3 * v, 0), E.position.set(0, 0, 1.3 * v), z.updateScale(0.4 * v), P.updateScale(0.4 * v), E.updateScale(0.4 * v), C.scale.set(v, v, v), V.scale.set(v, v, v), N.scale.set(v, v, v), g.add(C, V, N, z, P, E), g;
}
function gs(t, h) {
  const g = new $(...t), _ = new $(...h).clone().sub(g), z = _.length(), P = _.dot(new $(1, 0, 0)) / z, E = _.dot(new $(0, 1, 0)) / z, C = _.dot(new $(0, 0, 1)) / z, V = Math.sqrt(P ** 2 + E ** 2);
  let N = new is().fromArray([[P, E, C], [-E / V, P / V, 0], [-P * C / V, -E * C / V, V]].flat());
  return C === 1 && (N = new is().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), C === -1 && (N = new is().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Do().setFromMatrix3(N);
}
function ms(t, h) {
  return t == null ? void 0 : t.map((g, v) => (9 * g + h[v]) / 10);
}
function ro(t) {
  const h = t.reduce((v, _) => [v[0] + _[0], v[1] + _[1], v[2] + _[2]], [0, 0, 0]), g = t.length;
  return [h[0] / g, h[1] / g, h[2] / g];
}
function _i(t, h, g) {
  const v = ro([h, g]), _ = ro([t, g]), z = ro([t, h]), P = new $(...v).sub(new $(..._)).normalize(), E = new $(...g).sub(new $(...z)).normalize(), C = P.clone().cross(E).normalize(), V = C.clone().cross(P).normalize();
  return new Do().makeBasis(P, V, C);
}
function ki(t, h, g, v) {
  const _ = new ut(), z = new Ae(), P = new ft({ vertexColors: true }), E = [0, 0, 0], C = [1, 0, 0], V = [0, 1, 0], N = [0, 0, 1];
  z.setAttribute("position", new Lt([...E, ...C, ...E, ...V, ...E, ...N], 3));
  const Y = [255, 0, 0], j = [0, 255, 0], X = [0, 0, 255];
  return z.setAttribute("color", new Lt([...Y, ...Y, ...j, ...j, ...X, ...X], 3)), ue.derive(() => {
    var _a2;
    h.deformedShape.val, h.orientations.val && (_.clear(), (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((he) => {
      const Q = new Qt(z, P), Z = g.rawVal[he[0]], oe = g.rawVal[he[1]];
      if (he.length === 2 && (Q.position.set(...ms(Z, oe)), Q.rotation.setFromRotationMatrix(gs(Z, oe))), he.length === 3) {
        const fe = g.rawVal[he[2]];
        Q.position.set(...ro([Z, oe, fe])), Q.rotation.setFromRotationMatrix(_i(Z, oe, fe));
      }
      const we = 0.05 * h.gridSize.rawVal * 0.75 * v.rawVal;
      Q.scale.set(we, we, we), _.add(Q);
    }));
  }), ue.derive(() => {
    if (v.val, !h.orientations.rawVal) return;
    const Q = 0.05 * h.gridSize.val * 0.75 * v.rawVal;
    _.children.forEach((Z) => Z.scale.set(Q, Q, Q));
  }), ue.derive(() => {
    _.visible = h.orientations.val;
  }), _;
}
function Si(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const h = (t.b * 100).toFixed(0), g = (t.h * 100).toFixed(0);
    return `${h}x${g}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function Pi(t, h, g, v) {
  const _ = new ut(), z = new ut();
  _.add(z);
  function P(re, G) {
    const U = re / 2, I = G / 2, K = new Float32Array([0, -U, -I, 0, U, -I, 0, U, I, 0, -U, -I, 0, U, I, 0, -U, I]), q = new Ae();
    q.setAttribute("position", new xt(K, 3));
    const L = new Float32Array([0, -U, -I, 0, U, -I, 0, U, I, 0, -U, I, 0, -U, -I]), J = new Ae();
    return J.setAttribute("position", new xt(L, 3)), { fill: q, outline: J };
  }
  function E(re, G = 24) {
    const U = re / 2, I = new Float32Array(G * 9);
    for (let J = 0; J < G; J++) {
      const de = J / G * Math.PI * 2, pe = (J + 1) / G * Math.PI * 2;
      I[J * 9] = 0, I[J * 9 + 1] = 0, I[J * 9 + 2] = 0, I[J * 9 + 3] = 0, I[J * 9 + 4] = U * Math.cos(de), I[J * 9 + 5] = U * Math.sin(de), I[J * 9 + 6] = 0, I[J * 9 + 7] = U * Math.cos(pe), I[J * 9 + 8] = U * Math.sin(pe);
    }
    const K = new Ae();
    K.setAttribute("position", new xt(I, 3));
    const q = new Float32Array((G + 1) * 3);
    for (let J = 0; J <= G; J++) {
      const de = J / G * Math.PI * 2;
      q[J * 3] = 0, q[J * 3 + 1] = U * Math.cos(de), q[J * 3 + 2] = U * Math.sin(de);
    }
    const L = new Ae();
    return L.setAttribute("position", new xt(q, 3)), { fill: K, outline: L };
  }
  function C(re, G, U, I) {
    const K = U ?? G * 0.08, q = I ?? re * 0.07, L = re / 2, J = G / 2, de = J - K, pe = q / 2, ce = [];
    function H(xe, ge, ve, De) {
      ce.push(0, xe, ge, 0, ve, ge, 0, ve, De, 0, xe, ge, 0, ve, De, 0, xe, De);
    }
    H(-L, -J, L, -de), H(-pe, -de, pe, de), H(-L, de, L, J);
    const Me = new Ae();
    Me.setAttribute("position", new xt(new Float32Array(ce), 3));
    const ee = new Float32Array([0, -L, -J, 0, L, -J, 0, L, -de, 0, pe, -de, 0, pe, de, 0, L, de, 0, L, J, 0, -L, J, 0, -L, de, 0, -pe, de, 0, -pe, -de, 0, -L, -de, 0, -L, -J]), $e = new Ae();
    return $e.setAttribute("position", new xt(ee, 3)), { fill: Me, outline: $e };
  }
  function V(re, G, U) {
    const I = re / 2, K = G / 2, q = I - U, L = K - U, J = [];
    function de(Me, ee, $e, xe) {
      J.push(0, Me, ee, 0, $e, ee, 0, $e, xe, 0, Me, ee, 0, $e, xe, 0, Me, xe);
    }
    de(-I, -K, I, -L), de(-I, L, I, K), de(-I, -L, -q, L), de(q, -L, I, L);
    const pe = new Ae();
    pe.setAttribute("position", new xt(new Float32Array(J), 3));
    const ce = new Float32Array([0, -I, -K, 0, I, -K, 0, I, -K, 0, I, K, 0, I, K, 0, -I, K, 0, -I, K, 0, -I, -K, 0, -q, -L, 0, q, -L, 0, q, -L, 0, q, L, 0, q, L, 0, -q, L, 0, -q, L, 0, -q, -L]), H = new Ae();
    return H.setAttribute("position", new xt(ce, 3)), { fill: pe, outline: H };
  }
  function N(re, G, U) {
    const I = re / 2, K = G / 2, q = I - U, L = K - U, J = new Ae(), de = new Float32Array([0, -q, -L, 0, q, -L, 0, q, L, 0, -q, -L, 0, q, L, 0, -q, L]);
    J.setAttribute("position", new xt(de, 3));
    const pe = [];
    function ce($e, xe, ge, ve) {
      pe.push(0, $e, xe, 0, ge, xe, 0, ge, ve, 0, $e, xe, 0, ge, ve, 0, $e, ve);
    }
    ce(-I, -K, I, -L), ce(-I, L, I, K), ce(-I, -L, -q, L), ce(q, -L, I, L);
    const H = new Ae();
    H.setAttribute("position", new xt(new Float32Array(pe), 3));
    const Me = new Float32Array([0, -I, -K, 0, I, -K, 0, I, -K, 0, I, K, 0, I, K, 0, -I, K, 0, -I, K, 0, -I, -K, 0, -q, -L, 0, q, -L, 0, q, -L, 0, q, L, 0, q, L, 0, -q, L, 0, -q, L, 0, -q, -L]), ee = new Ae();
    return ee.setAttribute("position", new xt(Me, 3)), { concFill: J, steelFillGeom: H, outline: ee };
  }
  function Y(re, G, U) {
    const I = [], K = [[0, -re / 2, -G / 2], [0, -re / 2 + U, -G / 2], [0, -re / 2 + U, G / 2 - U], [0, re / 2, G / 2 - U], [0, re / 2, G / 2], [0, -re / 2, G / 2]], q = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of q) I.push(...K[pe]);
    const L = new Ae();
    L.setAttribute("position", new xt(new Float32Array(I), 3));
    const J = [];
    for (let pe = 0; pe < K.length; pe++) {
      const ce = (pe + 1) % K.length;
      J.push(...K[pe], ...K[ce]);
    }
    const de = new Ae();
    return de.setAttribute("position", new xt(new Float32Array(J), 3)), { fill: L, outline: de };
  }
  function j(re, G, U, I) {
    const K = I / 2, q = [], L = [[0, -re - K, -G / 2], [0, -U - K, -G / 2], [0, -U - K, G / 2 - U], [0, -K, G / 2 - U], [0, -K, G / 2], [0, -re - K, G / 2]], J = [[0, K, -G / 2], [0, K + U, -G / 2], [0, K + U, G / 2 - U], [0, re + K, G / 2 - U], [0, re + K, G / 2], [0, K, G / 2]], de = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const Me of de) q.push(...L[Me]);
    for (const Me of de) q.push(...J[Me]);
    const pe = new Ae();
    pe.setAttribute("position", new xt(new Float32Array(q), 3));
    const ce = [];
    for (const Me of [L, J]) for (let ee = 0; ee < Me.length; ee++) {
      const $e = (ee + 1) % Me.length;
      ce.push(...Me[ee], ...Me[$e]);
    }
    const H = new Ae();
    return H.setAttribute("position", new xt(new Float32Array(ce), 3)), { fill: pe, outline: H };
  }
  function X(re, G, U, I) {
    const K = G / 2, q = re, L = [[0, -q, -K], [0, -q, -K + U], [0, -I, -K + U], [0, -I, K - U], [0, -q, K - U], [0, -q, K], [0, 0, K], [0, 0, -K]], J = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], de = [];
    for (const Me of J) de.push(...L[Me]);
    const pe = new Ae();
    pe.setAttribute("position", new xt(new Float32Array(de), 3));
    const ce = [];
    for (let Me = 0; Me < L.length; Me++) {
      const ee = (Me + 1) % L.length;
      ce.push(...L[Me], ...L[ee]);
    }
    const H = new Ae();
    return H.setAttribute("position", new xt(new Float32Array(ce), 3)), { fill: pe, outline: H };
  }
  function he(re, G, U, I, K) {
    const q = G / 2, L = K / 2, J = [], de = [[0, -re, -q], [0, -re, -q + U], [0, -L - I, -q + U], [0, -L - I, q - U], [0, -re, q - U], [0, -re, q], [0, -L, q], [0, -L, -q]], pe = de.map(($e) => [$e[0], -$e[1], $e[2]]), ce = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const $e of ce) J.push(...de[$e]);
    for (const $e of ce) J.push(...pe[$e]);
    const H = new Ae();
    H.setAttribute("position", new xt(new Float32Array(J), 3));
    const Me = [];
    for (const $e of [de, pe]) for (let xe = 0; xe < $e.length; xe++) {
      const ge = (xe + 1) % $e.length;
      Me.push(...$e[xe], ...$e[ge]);
    }
    const ee = new Ae();
    return ee.setAttribute("position", new xt(new Float32Array(Me), 3)), { fill: H, outline: ee };
  }
  function Q(re, G, U, I) {
    const K = re / 2, q = G / 2, L = I / 2, J = [[0, -L, -q], [0, L, -q], [0, L, q - U], [0, K, q - U], [0, K, q], [0, -K, q], [0, -K, q - U], [0, -L, q - U]], de = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], pe = [];
    for (const ee of de) pe.push(...J[ee]);
    const ce = new Ae();
    ce.setAttribute("position", new xt(new Float32Array(pe), 3));
    const H = [];
    for (let ee = 0; ee < J.length; ee++) {
      const $e = (ee + 1) % J.length;
      H.push(...J[ee], ...J[$e]);
    }
    const Me = new Ae();
    return Me.setAttribute("position", new xt(new Float32Array(H), 3)), { fill: ce, outline: Me };
  }
  function Z(re, G, U = 24) {
    const I = re / 2, K = I - G, q = [];
    for (let pe = 0; pe < U; pe++) {
      const ce = pe / U * Math.PI * 2, H = (pe + 1) / U * Math.PI * 2, Me = Math.cos(ce), ee = Math.sin(ce), $e = Math.cos(H), xe = Math.sin(H);
      q.push(0, I * Me, I * ee, 0, I * $e, I * xe, 0, K * $e, K * xe), q.push(0, I * Me, I * ee, 0, K * $e, K * xe, 0, K * Me, K * ee);
    }
    const L = new Ae();
    L.setAttribute("position", new xt(new Float32Array(q), 3));
    const J = [];
    for (let pe = 0; pe < U; pe++) {
      const ce = pe / U * Math.PI * 2, H = (pe + 1) / U * Math.PI * 2;
      J.push(0, I * Math.cos(ce), I * Math.sin(ce), 0, I * Math.cos(H), I * Math.sin(H)), J.push(0, K * Math.cos(ce), K * Math.sin(ce), 0, K * Math.cos(H), K * Math.sin(H));
    }
    const de = new Ae();
    return de.setAttribute("position", new xt(new Float32Array(J), 3)), { fill: L, outline: de };
  }
  const oe = new wt({ color: 52479, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }), se = new ft({ color: 52479 }), we = new wt({ color: 16750848, transparent: true, opacity: 0.4, side: Vt, depthWrite: false }), fe = new ft({ color: 16750848 });
  function me(re, G) {
    const U = Math.abs(G[0] - re[0]), I = Math.abs(G[1] - re[1]), K = Math.abs(G[2] - re[2]);
    return K > U && K > I || I > U && I > K;
  }
  return ue.derive(() => {
    var _a2, _b;
    h.deformedShape.val, h.secColumns.val, h.secBeams.val, h.secFloor.val;
    const re = h.secColumns.rawVal, G = h.secBeams.rawVal;
    if (!re && !G) {
      _.children.forEach((L) => {
        L instanceof Tt && L.dispose();
      }), _.clear();
      return;
    }
    _.children.forEach((L) => {
      L instanceof Tt && L.dispose();
    }), _.clear();
    const U = (_a2 = t.elements) == null ? void 0 : _a2.val, I = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!U || !I) return;
    const K = I.sectionShapes, q = h.secFloor.rawVal;
    U.forEach((L, J) => {
      if (L.length !== 2) return;
      const de = g.rawVal[L[0]], pe = g.rawVal[L[1]];
      if (!de || !pe) return;
      const ce = me(de, pe);
      if (ce && !re || !ce && !G) return;
      if (q >= 0) {
        const xe = Math.min(de[1], pe[1]);
        Math.max(de[1], pe[1]);
        const ge = h.gridSize.rawVal || 3;
        if (Math.floor(xe / ge + 0.01) !== q) return;
      }
      const H = K == null ? void 0 : K.get(J);
      if (!H) return;
      const Me = [(de[0] + pe[0]) / 2, (de[1] + pe[1]) / 2, (de[2] + pe[2]) / 2], ee = gs(de, pe);
      if (H.type === "CFT") {
        const xe = N(H.b, H.h, H.tw ?? H.b * 0.05), ge = new ct(xe.concFill, oe);
        ge.position.set(...Me), ge.rotation.setFromRotationMatrix(ee), _.add(ge);
        const ve = new ct(xe.steelFillGeom, we);
        ve.position.set(...Me), ve.rotation.setFromRotationMatrix(ee), _.add(ve);
        const De = new $t(xe.outline, fe);
        De.position.set(...Me), De.rotation.setFromRotationMatrix(ee), _.add(De);
      } else {
        let xe, ge, ve;
        switch (H.type) {
          case "rect":
            xe = P(H.b, H.h), ge = oe, ve = se;
            break;
          case "circ":
            xe = E(H.d), ge = oe, ve = se;
            break;
          case "I":
            xe = C(H.b, H.h, H.tf, H.tw), ge = we, ve = fe;
            break;
          case "HSS":
            xe = V(H.b, H.h, H.tw ?? H.b * 0.05), ge = we, ve = fe;
            break;
          case "CFT":
            xe = N(H.b, H.h, H.tw ?? H.b * 0.05), ge = we, ve = fe;
            break;
          case "L":
            xe = Y(H.b ?? H.h, H.h, H.t ?? H.tw ?? 3e-3), ge = we, ve = fe;
            break;
          case "2L":
            xe = j(H.b ?? H.h, H.h, H.t ?? H.tw ?? 3e-3, H.dis ?? 0.01), ge = we, ve = fe;
            break;
          case "C":
          case "coldC":
            xe = X(H.b, H.h, H.tf ?? H.t ?? 3e-3, H.tw ?? H.t ?? 3e-3), ge = we, ve = fe;
            break;
          case "2C":
            xe = he(H.b, H.h, H.tf ?? 5e-3, H.tw ?? 5e-3, H.dis ?? 0.01), ge = we, ve = fe;
            break;
          case "T":
            xe = Q(H.b, H.h, H.tf ?? 0.01, H.tw ?? 6e-3), ge = we, ve = fe;
            break;
          case "pipe":
            xe = Z(H.d, H.tw ?? H.d * 0.05), ge = we, ve = fe;
            break;
          default:
            return;
        }
        const De = new ct(xe.fill, ge);
        De.position.set(...Me), De.rotation.setFromRotationMatrix(ee), _.add(De);
        const ze = new $t(xe.outline, ve);
        ze.position.set(...Me), ze.rotation.setFromRotationMatrix(ee), _.add(ze);
      }
      const $e = Si(H);
      if ($e) {
        const ge = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(H.type) ? "#ff9900" : "#00ccff", ve = new Tt($e, ge, "transparent");
        ve.position.set(Me[0], Me[1], Me[2]);
        const De = 0.05 * h.gridSize.rawVal * 0.5;
        ve.updateScale(De * ((v == null ? void 0 : v.rawVal) ?? 1)), z.add(ve);
      }
    });
  }), v && ue.derive(() => {
    if (v.val, !h.sections.rawVal) return;
    const re = 0.05 * h.gridSize.val * 0.5;
    z.children.forEach((G) => {
      G instanceof Tt && G.updateScale(re * v.rawVal);
    });
  }), ue.derive(() => {
    _.visible = h.sections.val;
  }), ue.derive(() => {
    z.visible = h.sectionLabels.val;
  }), _;
}
function zi(t) {
  if (!t) return null;
  const h = t.type, g = (N, Y) => [N, Y], v = (N, Y) => [g(-N / 2, -Y / 2), g(N / 2, -Y / 2), g(N / 2, Y / 2), g(-N / 2, Y / 2)], _ = (N, Y = 24) => {
    const j = N / 2, X = [];
    for (let he = 0; he < Y; he++) {
      const Q = 2 * Math.PI * he / Y;
      X.push(g(j * Math.cos(Q), j * Math.sin(Q)));
    }
    return X;
  }, z = t.b ?? 0, P = t.h ?? 0, E = t.d ?? 0, C = t.tw ?? t.t ?? 0, V = t.tf ?? t.t ?? 0;
  switch (h) {
    case "rect":
      return z && P ? { contorno: v(z, P) } : null;
    case "circ":
      return E ? { contorno: _(E) } : null;
    case "pipe":
      return E && C ? { contorno: _(E), huecos: [_(E - 2 * C).reverse()] } : null;
    case "HSS":
      return z && P && C ? { contorno: v(z, P), huecos: [v(z - 2 * C, P - 2 * (V || C)).reverse()] } : null;
    case "CFT":
      return z && P ? { contorno: v(z, P) } : null;
    case "I":
      return z && P && C && V ? { contorno: [g(-z / 2, -P / 2), g(z / 2, -P / 2), g(z / 2, -P / 2 + V), g(C / 2, -P / 2 + V), g(C / 2, P / 2 - V), g(z / 2, P / 2 - V), g(z / 2, P / 2), g(-z / 2, P / 2), g(-z / 2, P / 2 - V), g(-C / 2, P / 2 - V), g(-C / 2, -P / 2 + V), g(-z / 2, -P / 2 + V)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return z && P && C && V ? { contorno: [g(-z / 2, -P / 2), g(z / 2, -P / 2), g(z / 2, -P / 2 + V), g(-z / 2 + C, -P / 2 + V), g(-z / 2 + C, P / 2 - V), g(z / 2, P / 2 - V), g(z / 2, P / 2), g(-z / 2, P / 2)] } : null;
    case "T":
      return z && P && C && V ? { contorno: [g(-C / 2, -P / 2), g(C / 2, -P / 2), g(C / 2, P / 2 - V), g(z / 2, P / 2 - V), g(z / 2, P / 2), g(-z / 2, P / 2), g(-z / 2, P / 2 - V), g(-C / 2, P / 2 - V)] } : null;
    case "L":
    case "2L":
      return z && P && C ? { contorno: [g(-z / 2, -P / 2), g(z / 2, -P / 2), g(z / 2, -P / 2 + C), g(-z / 2 + C, -P / 2 + C), g(-z / 2 + C, P / 2), g(-z / 2, P / 2)] } : null;
    default:
      return z && P ? { contorno: v(z, P) } : E ? { contorno: _(E) } : null;
  }
}
function Ci(t, h, g) {
  if (!t || t <= 0 || !h || !g || h <= 0 || g <= 0) return null;
  const v = Math.sqrt(Math.sqrt(g / h)), _ = Math.sqrt(t / v), z = t / _;
  return !isFinite(_) || !isFinite(z) || _ <= 0 || z <= 0 ? null : { contorno: [[-_ / 2, -z / 2], [_ / 2, -z / 2], [_ / 2, z / 2], [-_ / 2, z / 2]] };
}
function Ai(t) {
  const h = new lo();
  t.contorno.forEach(([g, v], _) => _ ? h.lineTo(g, v) : h.moveTo(g, v)), h.closePath();
  for (const g of t.huecos ?? []) {
    const v = new si();
    g.forEach(([_, z], P) => P ? v.lineTo(_, z) : v.moveTo(_, z)), v.closePath(), h.holes.push(v);
  }
  return h;
}
function Ei(t, h, g) {
  const v = new ut();
  v.name = "extrusion";
  const _ = new ls({ color: 8369151, transparent: true, opacity: 0.92, side: Vt }), z = new ls({ color: 12623968, transparent: true, opacity: 0.85, side: Vt }), P = new ls({ color: 11583173, transparent: true, opacity: 0.85, side: Vt }), E = new ut();
  E.add(new wa(16777215, 0.55));
  const C = new Bo(16777215, 0.75);
  C.position.set(30, 25, 40);
  const V = new Bo(16777215, 0.35);
  V.position.set(-25, -20, 15), E.add(C, V);
  let N = 0;
  return ue.derive(() => {
    var _a2, _b, _c, _d, _e;
    const Y = ((_a2 = h.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++N, on: Y }, v.visible = Y;
    for (const se of [...v.children]) se !== E && (v.remove(se), (_c = (_b = se.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (v.children.includes(E) || v.add(E), !Y) return;
    const j = g.val ?? [], X = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], he = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, Q = he.sectionShapes ?? /* @__PURE__ */ new Map(), Z = he.thicknesses ?? /* @__PURE__ */ new Map();
    let oe = "";
    try {
      X.forEach((se, we) => {
        var _a3, _b2, _c2;
        if (se.length === 2) {
          let fe = zi(Q.get(we)), me = true;
          if (fe || (fe = Ci((_a3 = he.areas) == null ? void 0 : _a3.get(we), (_b2 = he.momentsOfInertiaY) == null ? void 0 : _b2.get(we), (_c2 = he.momentsOfInertiaZ) == null ? void 0 : _c2.get(we)), me = false), !fe) return;
          const re = j[se[0]], G = j[se[1]];
          if (!re || !G) return;
          const U = Math.hypot(G[0] - re[0], G[1] - re[1], G[2] - re[2]);
          if (U < 1e-9) return;
          const I = new oi(Ai(fe), { depth: U, bevelEnabled: false, curveSegments: 4 });
          I.applyMatrix4(new Do().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const K = new ct(I, me ? _ : z);
          K.position.set(re[0], re[1], re[2]), K.rotation.setFromRotationMatrix(gs(re, G)), v.add(K);
          return;
        }
        if (se.length === 3 || se.length === 4) {
          const fe = Z.get(we);
          if (!fe || fe <= 0) return;
          const me = se.map((xe) => j[xe]).filter(Boolean);
          if (me.length < 3) return;
          const re = [me[1][0] - me[0][0], me[1][1] - me[0][1], me[1][2] - me[0][2]], G = [me[2][0] - me[0][0], me[2][1] - me[0][1], me[2][2] - me[0][2]], U = re[1] * G[2] - re[2] * G[1], I = re[2] * G[0] - re[0] * G[2], K = re[0] * G[1] - re[1] * G[0], q = Math.hypot(U, I, K);
          if (q < 1e-12) return;
          const L = [U / q, I / q, K / q], J = [], de = (xe) => me.map((ge) => [ge[0] + L[0] * xe, ge[1] + L[1] * xe, ge[2] + L[2] * xe]), pe = Math.abs(L[2]) > 0.5, ce = L[2] > 0 ? -1 : 1, H = de(pe ? 0 : +fe / 2), Me = de(pe ? ce * fe : -fe / 2), ee = (xe, ge, ve) => J.push(...xe, ...ge, ...ve);
          for (const xe of [H, Me]) ee(xe[0], xe[1], xe[2]), xe.length === 4 && ee(xe[0], xe[2], xe[3]);
          for (let xe = 0; xe < me.length; xe++) {
            const ge = (xe + 1) % me.length;
            ee(H[xe], Me[xe], Me[ge]), ee(H[xe], Me[ge], H[ge]);
          }
          const $e = new Ae();
          $e.setAttribute("position", new Lt(J, 3)), $e.computeVertexNormals(), v.add(new ct($e, P));
        }
      });
    } catch (se) {
      oe = String((se == null ? void 0 : se.message) ?? se);
    }
    globalThis.__extrusionDebug = { corridas: N, on: Y, fallo: oe, nElementos: X.length, nFormas: Q.size, nEspesores: Z.size, mallas: v.children.length - 1 };
  }), v;
}
function va(t, h, g = 0) {
  const v = [h[0] - t[0], h[1] - t[1], h[2] - t[2]], _ = Math.hypot(v[0], v[1], v[2]) || 1, z = v[0] / _, P = v[1] / _, E = v[2] / _, C = Math.sqrt(z * z + P * P);
  let V, N, Y;
  if (C < 1e-9) {
    const j = E > 0 ? 1 : -1;
    V = [0, 0, j], N = [1, 0, 0], Y = [0, j, 0];
  } else V = [z, P, E], N = [-z * E / C, -P * E / C, C], Y = [P / C, -z / C, 0];
  if (Math.abs(g) > 1e-12) {
    const j = g * Math.PI / 180, X = Math.cos(j), he = Math.sin(j), Q = N.map((oe, se) => X * oe + he * Y[se]), Z = Y.map((oe, se) => -he * N[se] + X * oe);
    N = Q, Y = Z;
  }
  return { e1: V, e2: N, e3: Y };
}
function ws(t, h) {
  if (!h) return [0, 0];
  const g = Number(h[0] ?? 0), v = Number(h[1] ?? 0);
  return t === "bendingsY" ? [g, -v] : [-g, v];
}
function _a(t, h) {
  const g = (v) => v.map((_) => -_);
  switch (t) {
    case "bendingsZ":
      return g(h.e2);
    case "bendingsY":
      return g(h.e3);
    case "shearsZ":
      return h.e3;
    default:
      return h.e2;
  }
}
class Vo extends ut {
  constructor(h, g, v, _, z, P, E) {
    super();
    const C = new lo().moveTo(0, 0).lineTo(0, P[1]).lineTo(v, P[1]).lineTo(v, 0).lineTo(0, 0), V = C.getPoints(), N = new Ae().setFromPoints(V);
    this.lines = new $t(N, new ft({ color: Rn().resultOutline })), this.lines.position.set(...h), this.lines.rotation.setFromRotationMatrix(_), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const Y = new Ro(C), j = new wt({ color: P[1] > 0 ? 24435 : 11411474, side: Vt });
    this.mesh = new ct(Y, j), this.mesh.position.set(...h), this.mesh.rotation.setFromRotationMatrix(_), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Tt(`${z[1].toFixed(4)}`), this.normalizedResult = P, this.textPosition = ro([h, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(_), this.add(this.text);
  }
  updateScale(h) {
    this.lines.scale.set(1, h * 2, 1), this.mesh.scale.set(1, h * 2, 1), this.text.updateScale(h * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * h);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class fs extends ut {
  constructor(h, g, v, _, z, P, E) {
    super();
    const C = z[0] * v / (z[0] + z[1]), V = z[0] * z[1] > 0;
    if (this.text = new Tt(`${z[0].toFixed(4)}`), this.text2 = new Tt(`${(z[1] * -1).toFixed(4)}`), this.normalizedResult = P, this.textPosition = ms(h, g), this.text2Position = ms(g, h), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(_), this.text2.rotation.setFromRotationMatrix(_), this.add(this.text, this.text2), V) {
      const N = new lo().moveTo(0, 0).lineTo(0, P[0]).lineTo(C, 0).lineTo(0, 0), Y = new lo().moveTo(C, 0).lineTo(v, -P[1]).lineTo(v, 0).lineTo(C, 0), j = N.getPoints(), X = Y.getPoints(), he = new Ae().setFromPoints(j), Q = new Ae().setFromPoints(X), Z = new ft({ color: Rn().resultOutline });
      this.lines = new $t(he, Z), this.lines2 = new $t(Q, Z), this.lines.position.set(...h), this.lines2.position.set(...h), this.lines.rotation.setFromRotationMatrix(_), this.lines2.rotation.setFromRotationMatrix(_), E && this.lines.rotateX(Math.PI / 2), E && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const oe = new Ro(N), se = new Ro(Y), we = new wt({ color: P[0] > 0 ? 24435 : 11411474, side: Vt }), fe = new wt({ color: -P[1] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new ct(oe, we), this.mesh2 = new ct(se, fe), this.mesh.position.set(...h), this.mesh2.position.set(...h), this.mesh.rotation.setFromRotationMatrix(_), this.mesh2.rotation.setFromRotationMatrix(_), E && this.mesh.rotateX(Math.PI / 2), E && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const N = new lo().moveTo(0, 0).lineTo(0, P[0]).lineTo(v, -P[1]).lineTo(v, 0).lineTo(0, 0), Y = N.getPoints(), j = new Ae().setFromPoints(Y);
      this.lines = new $t(j, new ft({ color: Rn().resultOutline })), this.lines.position.set(...h), this.lines.rotation.setFromRotationMatrix(_), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const X = new Ro(N), he = new wt({ color: P[0] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new ct(X, he), this.mesh.position.set(...h), this.mesh.rotation.setFromRotationMatrix(_), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(h) {
    var _a2, _b;
    this.lines.scale.set(1, h * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, h * 2, 1), this.mesh.scale.set(1, h * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, h * 2, 1), this.text.updateScale(h * 0.6), this.text2.updateScale(h * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * h), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * h);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var ka = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(ka || {});
function Fi(t, h, g, v) {
  const _ = () => {
    const E = g.rawVal;
    if (!(E == null ? void 0 : E.length)) return 0.05 * h.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], V = [-1 / 0, -1 / 0, -1 / 0];
    for (const Y of E) for (let j = 0; j < 3; j++) Y[j] < C[j] && (C[j] = Y[j]), Y[j] > V[j] && (V[j] = Y[j]);
    const N = Math.hypot(V[0] - C[0], V[1] - C[1], V[2] - C[2]);
    return !isFinite(N) || N <= 0 ? 0.05 * h.gridSize.rawVal : 0.025 * N;
  }, z = new ut(), P = { normals: Vo, shearsY: Vo, shearsZ: Vo, torsions: Vo, bendingsY: fs, bendingsZ: fs };
  return ue.derive(() => {
    var _a2, _b;
    if (h.deformedShape.val, g.val, h.frameResults.val == "none") return;
    z.children.forEach((C) => C.dispose()), z.clear();
    const E = ka[h.frameResults.rawVal];
    (_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal[E]) == null ? void 0 : _b.forEach((C, V) => {
      var _a3, _b2, _c, _d, _e, _f;
      const N = ((_a3 = t.elements) == null ? void 0 : _a3.rawVal[V]) ?? [0, 1], Y = g.rawVal[N[0]], j = g.rawVal[N[1]];
      if (!Y || !j) return;
      const X = new $(...j).distanceTo(new $(...Y)), he = $i((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[E]), Q = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, V)) ?? 0, Z = va(Y, j, Q), oe = _a(E, Z), se = new $(...Z.e1), we = new $(...oe), fe = new Do().makeBasis(se, we, se.clone().cross(we)), [me, re] = ws(E, C), G = P[E] === fs ? [me, -re] : [me, re], U = G.map((K) => K / (he === 0 ? 1 : he)), I = new P[E](Y, j, X, fe, G, U, false);
      I.updateScale(_() * v.rawVal), z.add(I);
    });
  }), ue.derive(() => {
    if (v.val, h.frameResults.rawVal == "none") return;
    h.gridSize.val;
    const E = _();
    z.children.forEach((C) => C.updateScale(E * v.rawVal));
  }), ue.derive(() => {
    z.visible = h.frameResults.val != "none";
  }), z;
}
function $i(t) {
  let h = 0;
  return t == null ? void 0 : t.forEach((g) => {
    const v = Math.max(...(g ?? [0, 0]).map((_) => Math.abs(_)));
    v > h && (h = v);
  }), h;
}
class Vi extends ut {
  constructor(h, g, v) {
    super();
    const _ = g === bs.reactions;
    v[0] && (this.xText1 = new Tt(`${_ ? "Fx" : "Dx"}: ` + v[0].toFixed(4))), v[3] && (this.xText2 = new Tt(`${_ ? "Mx" : "Rx"}: ` + v[3].toFixed(4))), v[1] && (this.yText1 = new Tt(`${_ ? "Fy" : "Dy"}: ` + v[1].toFixed(4))), v[4] && (this.yText2 = new Tt(`${_ ? "My" : "Ry"}: ` + v[4].toFixed(4))), v[2] && (this.zText1 = new Tt(`${_ ? "Fz" : "Dz"}: ` + v[2].toFixed(4))), v[5] && (this.zText2 = new Tt(`${_ ? "Mz" : "Rz"}: ` + v[5].toFixed(4))), (v[0] || v[3]) && (this.xArrow = new Tn(new $(1, 0, 0), new $(0, 0, 0), 1, 15637248, 0.3, 0.3)), (v[1] || v[4]) && (this.yArrow = new Tn(new $(0, 1, 0), new $(0, 0, 0), 1, 15637248, 0.3, 0.3)), (v[2] || v[5]) && (this.zArrow = new Tn(new $(0, 0, 1), new $(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...h), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(h) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(h, h, h), (_b = this.yArrow) == null ? void 0 : _b.scale.set(h, h, h), (_c = this.zArrow) == null ? void 0 : _c.scale.set(h, h, h), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * h, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * h, 0, 0.5 * h), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * h, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * h, 0.5 * h), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * h), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * h + 0.5 * h), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * h), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * h), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * h), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * h), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * h), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * h);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var bs = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(bs || {});
function Li(t, h, g, v) {
  const _ = new ut();
  return ue.derive(() => {
    var _a2, _b;
    if (h.deformedShape.val, h.nodeResults.val == "none") return;
    _.children.forEach((E) => E.dispose()), _.clear();
    const z = bs[h.nodeResults.rawVal], P = 0.05 * h.gridSize.val;
    (_b = (_a2 = t.deformOutputs) == null ? void 0 : _a2.val[z]) == null ? void 0 : _b.forEach((E, C) => {
      const V = new Vi(g.rawVal[C], z, E ?? [0, 0, 0, 0, 0, 0]);
      V.updateScale(P * v.rawVal), _.add(V);
    });
  }), ue.derive(() => {
    if (v.val, h.nodeResults.rawVal == "none") return;
    const z = 0.05 * h.gridSize.val;
    _.children.forEach((P) => P.updateScale(z * v.rawVal));
  }), ue.derive(() => {
    _.visible = h.nodeResults.val != "none";
  }), _;
}
function Ii({ drawingObj: t, gridObj: h, scene: g, getActiveCamera: v, controls: _, gridSize: z, derivedDisplayScale: P, rendererElm: E, viewerRender: C }) {
  var _a2;
  const V = new rs(), N = new ai(), Y = (e) => {
    const o = E.getBoundingClientRect(), s = e.clientX - o.left, n = e.clientY - o.top, a = o.width || 1, c = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const l = a / 2;
      if (s >= l) return N.x = (s - l) / l * 2 - 1, N.y = -(n / c) * 2 + 1, window.__hekatanSplitCamera ?? v();
      N.x = s / l * 2 - 1;
    } else N.x = s / a * 2 - 1;
    return N.y = -(n / c) * 2 + 1, v();
  }, j = new ct(new Pn(1e4, 1e4), new wt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
  j.visible = true, j.frustumCulled = false, g.add(j);
  const X = (e, o, s) => {
    const n = new ct(new Pn(1e4, 1e4), new wt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(e, o, s), n.visible = false, n.frustumCulled = false, g.add(n), n;
  }, he = X(Math.PI / 2, 0, 0), Q = X(0, Math.PI / 2, 0);
  let Z = false, oe = null, se = null, we = null;
  const fe = new $t(new Ae(), new ft({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  fe.name = "ref-ifc-cadena", fe.renderOrder = 1e3, fe.frustumCulled = false, fe.visible = false, g.add(fe);
  const me = (e, o, s) => Math.round(e * 1e3) + "," + Math.round(o * 1e3) + "," + Math.round(s * 1e3), re = (e) => {
    const o = /* @__PURE__ */ new Map();
    for (let s = 0; s + 0 < e.length / 6; s++) {
      const n = 6 * s;
      for (const a of [me(e[n], e[n + 1], e[n + 2]), me(e[n + 3], e[n + 4], e[n + 5])]) {
        const c = o.get(a);
        c ? c.push(s) : o.set(a, [s]);
      }
    }
    return o;
  }, G = (e) => {
    const { S: o, adj: s } = e, n = (x, b) => new $(o[6 * x + 3 * b], o[6 * x + 3 * b + 1], o[6 * x + 3 * b + 2]), a = /* @__PURE__ */ new Set([e.s]), c = (x, b) => {
      const F = [];
      let S = x, A = b;
      for (let T = 0; T < 3e3; T++) {
        const D = (s.get(me(A.x, A.y, A.z)) || []).filter((Ge) => !a.has(Ge));
        if (D.length !== 1) break;
        const B = D[0], W = n(B, 0), ne = n(B, 1), ye = W.distanceTo(A) < ne.distanceTo(A) ? ne : W, ke = A.clone().sub(S).normalize(), st = ye.clone().sub(A).normalize();
        if (ke.dot(st) < Math.cos(35 * Math.PI / 180)) break;
        a.add(B), F.push(ye), S = A, A = ye;
      }
      return F;
    }, i = n(e.s, 0), l = n(e.s, 1), r = c(i, l), p = c(l, i), d = [...p.reverse(), i, l, ...r], w = p.length;
    if (d.length < 6) return d;
    const f = [], m = [];
    for (let x = 1; x < d.length; x++) f.push(d[x].distanceTo(d[x - 1]));
    for (let x = 1; x < d.length - 1; x++) {
      const b = d[x].clone().sub(d[x - 1]).normalize(), F = d[x + 1].clone().sub(d[x]).normalize();
      m.push(Math.acos(Math.max(-1, Math.min(1, b.dot(F)))) / Math.max(1e-6, (f[x - 1] + f[x]) / 2));
    }
    const M = m.map((x, b) => {
      let F = 0, S = 0;
      for (let A = b - 1; A <= b + 1; A++) A >= 0 && A < m.length && (F += m[A], S++);
      return F / S;
    }), k = [];
    for (let x = 3; x < M.length - 3; x++) {
      const b = (M[x - 3] + M[x - 2] + M[x - 1]) / 3, F = (M[x + 1] + M[x + 2] + M[x + 3]) / 3, S = Math.min(b, F), A = Math.max(b, F);
      A > 0.03 && A / Math.max(S, 1e-6) > 2.2 && Math.abs(M[x] - (b + F) / 2) < A && (!k.length || x - k[k.length - 1] > 3) && k.push(x + 1);
    }
    let y = 0, u = d.length - 1;
    for (const x of k) x <= w && x > y && (y = x), x > w && x < u && (u = x);
    return d.slice(y, u + 1);
  }, U = (e) => {
    if (we = e, !e || e.length < 2) {
      fe.visible = false;
      return;
    }
    fe.geometry.dispose(), fe.geometry = new Ae().setFromPoints(e), fe.visible = true;
  }, I = (e) => {
    let o = 0;
    for (let w = 1; w < e.length - 1; w++) {
      const f = e[w].clone().sub(e[w - 1]).normalize(), m = e[w + 1].clone().sub(e[w]).normalize();
      o += Math.acos(Math.max(-1, Math.min(1, f.dot(m))));
    }
    const s = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (o < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const n = String(window.__hekatanArcModo ?? "angulo"), a = n === "x" ? 0 : n === "y" ? 1 : n === "z" ? 2 : -1, c = [0];
    for (let w = 1; w < e.length; w++) c.push(c[w - 1] + e[w].distanceTo(e[w - 1]));
    const i = (w, f) => {
      for (let m = 1; m < e.length; m++) {
        const M = w(e[m - 1], m - 1), k = w(e[m], m);
        if (M <= f && f <= k || k <= f && f <= M) {
          const y = Math.abs(k - M) < 1e-12 ? 0 : (f - M) / (k - M);
          return e[m - 1].clone().lerp(e[m], y);
        }
      }
      return e[e.length - 1].clone();
    }, l = [], r = a >= 0 ? e[0].getComponent(a) : 0, p = a >= 0 ? e[e.length - 1].getComponent(a) : 0, d = a >= 0 && Math.abs(p - r) > 1e-6 && e.every((w, f) => f === 0 || (w.getComponent(a) - e[f - 1].getComponent(a)) * (p - r) >= -1e-6);
    for (let w = 0; w <= s; w++) {
      const f = d ? i((m) => m.getComponent(a), r + (p - r) * w / s) : i((m, M) => c[M], c[c.length - 1] * w / s);
      l.push([f.x, f.y, f.z]);
    }
    return l[0] = e[0].toArray(), l[s] = e[e.length - 1].toArray(), l;
  };
  window.__hekatanCadenaIfc = () => (we || []).map((e) => [e.x, e.y, e.z]);
  const K = /* @__PURE__ */ new Map(), q = (e) => {
    const o = K.get(e.id);
    if (o) return o;
    const s = e.geometry.getAttribute("position"), n = s ? Math.floor(s.count / 3) : 0, a = new Float64Array(n * 9), c = new Float64Array(n * 3), i = new Int32Array(n * 3).fill(-1);
    if (s) {
      e.updateMatrixWorld();
      const r = new $();
      for (let M = 0; M < n * 3; M++) r.fromBufferAttribute(s, M).applyMatrix4(e.matrixWorld), a[3 * M] = r.x, a[3 * M + 1] = r.y, a[3 * M + 2] = r.z;
      const p = new $(), d = new $(), w = new $(), f = (M) => Math.round(a[3 * M] * 1e3) + "," + Math.round(a[3 * M + 1] * 1e3) + "," + Math.round(a[3 * M + 2] * 1e3), m = /* @__PURE__ */ new Map();
      for (let M = 0; M < n; M++) {
        const k = 3 * M;
        p.set(a[3 * (k + 1)] - a[3 * k], a[3 * (k + 1) + 1] - a[3 * k + 1], a[3 * (k + 1) + 2] - a[3 * k + 2]), d.set(a[3 * (k + 2)] - a[3 * k], a[3 * (k + 2) + 1] - a[3 * k + 1], a[3 * (k + 2) + 2] - a[3 * k + 2]), w.crossVectors(p, d).normalize(), c[3 * M] = w.x, c[3 * M + 1] = w.y, c[3 * M + 2] = w.z;
        for (let y = 0; y < 3; y++) {
          const u = f(k + y), x = f(k + (y + 1) % 3), b = u < x ? u + "|" + x : x + "|" + u, F = m.get(b);
          F ? F.push(M, y) : m.set(b, [M, y]);
        }
      }
      for (const M of m.values()) M.length === 4 && (i[3 * M[0] + M[1]] = M[2], i[3 * M[2] + M[3]] = M[0]);
    }
    const l = { V: a, N: c, vec: i, n };
    return K.set(e.id, l), l;
  }, L = new ct(new Ae(), new wt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Vt }));
  L.name = "ref-ifc-cara", L.renderOrder = 999, L.frustumCulled = false, L.visible = false, g.add(L);
  let J = null;
  const de = (e, o) => {
    const s = Math.cos(12 * Math.PI / 180), n = Math.cos(80 * Math.PI / 180), a = [e.N[3 * o], e.N[3 * o + 1], e.N[3 * o + 2]], c = new Uint8Array(e.n), i = [], l = [o];
    for (c[o] = 1; l.length && i.length < 4e4; ) {
      const r = l.pop();
      i.push(r);
      for (let p = 0; p < 3; p++) {
        const d = e.vec[3 * r + p];
        if (d < 0 || c[d]) continue;
        const w = e.N[3 * r] * e.N[3 * d] + e.N[3 * r + 1] * e.N[3 * d + 1] + e.N[3 * r + 2] * e.N[3 * d + 2], f = a[0] * e.N[3 * d] + a[1] * e.N[3 * d + 1] + a[2] * e.N[3 * d + 2];
        w >= s && f >= n && (c[d] = 1, l.push(d));
      }
    }
    return i;
  }, pe = (e, o, s) => {
    if (!e || o < 0 || !s) {
      J && (J = null, L.visible = false);
      return;
    }
    if (J && J.m === e && J.tris.indexOf(o) >= 0) {
      J.punto = s.clone();
      return;
    }
    const n = q(e), a = de(n, o), c = new Float32Array(a.length * 9), i = new $();
    let l = true;
    a.forEach((r, p) => {
      for (let d = 0; d < 9; d++) c[9 * p + d] = n.V[9 * r + d];
      i.x += n.N[3 * r], i.y += n.N[3 * r + 1], i.z += n.N[3 * r + 2];
    }), i.normalize();
    for (const r of a) if (i.x * n.N[3 * r] + i.y * n.N[3 * r + 1] + i.z * n.N[3 * r + 2] < Math.cos(5 * Math.PI / 180)) {
      l = false;
      break;
    }
    L.geometry.dispose(), L.geometry = new Ae(), L.geometry.setAttribute("position", new xt(c, 3)), L.material.color.set(l ? 3718648 : 16096779), L.visible = true, J = { m: e, t0: o, tris: a, normal: i, plana: l, punto: s.clone() };
  }, ce = (e, o) => {
    const s = new Uint8Array(e.n);
    for (const d of o) s[d] = 1;
    const n = (d) => Math.round(e.V[3 * d] * 1e3) + "," + Math.round(e.V[3 * d + 1] * 1e3) + "," + Math.round(e.V[3 * d + 2] * 1e3), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
    for (const d of o) for (let w = 0; w < 3; w++) {
      const f = e.vec[3 * d + w];
      if (f >= 0 && s[f]) continue;
      const m = 3 * d + w, M = 3 * d + (w + 1) % 3, k = n(m), y = n(M);
      c.set(k, new $(e.V[3 * m], e.V[3 * m + 1], e.V[3 * m + 2])), c.set(y, new $(e.V[3 * M], e.V[3 * M + 1], e.V[3 * M + 2])), (a.get(k) || a.set(k, []).get(k)).push(y), (a.get(y) || a.set(y, []).get(y)).push(k);
    }
    const i = /* @__PURE__ */ new Set();
    let l = [];
    for (const d of a.keys()) {
      if (i.has(d)) continue;
      const w = [d];
      i.add(d);
      let f = "", m = d;
      for (let M = 0; M < 1e5; M++) {
        const k = (a.get(m) || []).find((y) => y !== f && !i.has(y));
        if (!k) break;
        w.push(k), i.add(k), f = m, m = k;
      }
      w.length > l.length && (l = w);
    }
    const r = l.map((d) => c.get(d)), p = [];
    for (let d = 0; d < r.length; d++) {
      const w = r[(d + r.length - 1) % r.length], f = r[d], m = r[(d + 1) % r.length];
      if (f.distanceTo(w) < 1e-3) continue;
      const M = f.clone().sub(w).normalize(), k = m.clone().sub(f).normalize();
      M.dot(k) > Math.cos(3 * Math.PI / 180) || p.push(f);
    }
    return p;
  }, H = (e, o, s) => {
    const a = new rs(o.clone().addScaledVector(s, -2e-3), s.clone().negate(), 0, 3).intersectObject(e, false);
    return a.length ? a[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, o, s, n = 2) => {
    const a = new $(e[0], e[1], e[2]), c = new $(o[0], o[1], o[2]).normalize();
    let i = null;
    for (const l of [1, -1]) {
      const p = new rs(a, c.clone().multiplyScalar(l), 0, n).intersectObjects(s, false);
      p.length && (i == null || p[0].distance < i) && (i = p[0].distance);
    }
    return i;
  }, window.__hekatanCaraIfc = () => J ? { tris: J.tris.length, plana: J.plana, normal: J.normal.toArray(), punto: J.punto.toArray(), contorno: ce(q(J.m), J.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const Me = /* @__PURE__ */ new Map(), ee = new Qt(new Ae(), new ft({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  ee.name = "ref-ifc-bordes", ee.frustumCulled = false, ee.visible = false, g.add(ee);
  const $e = 1, xe = (e, o, s) => Math.floor(e / $e) + "," + Math.floor(o / $e) + "," + Math.floor(s / $e), ge = (e) => {
    const o = Me.get(e.id);
    if (o) return o;
    const s = e.geometry.getAttribute("position"), n = [], a = /* @__PURE__ */ new Map();
    if (s) {
      e.updateMatrixWorld();
      const i = Math.floor(s.count / 3), l = new Float64Array(s.count * 3), r = new $();
      for (let y = 0; y < s.count; y++) r.fromBufferAttribute(s, y).applyMatrix4(e.matrixWorld), l[3 * y] = r.x, l[3 * y + 1] = r.y, l[3 * y + 2] = r.z;
      const p = (y) => Math.round(l[3 * y] * 1e3) + "," + Math.round(l[3 * y + 1] * 1e3) + "," + Math.round(l[3 * y + 2] * 1e3), d = new Float64Array(i * 3), w = new $(), f = new $(), m = new $();
      for (let y = 0; y < i; y++) {
        const u = 3 * y, x = 3 * y + 1, b = 3 * y + 2;
        w.set(l[3 * x] - l[3 * u], l[3 * x + 1] - l[3 * u + 1], l[3 * x + 2] - l[3 * u + 2]), f.set(l[3 * b] - l[3 * u], l[3 * b + 1] - l[3 * u + 1], l[3 * b + 2] - l[3 * u + 2]), m.crossVectors(w, f).normalize(), d[3 * y] = m.x, d[3 * y + 1] = m.y, d[3 * y + 2] = m.z;
      }
      const M = /* @__PURE__ */ new Map();
      for (let y = 0; y < i; y++) for (let u = 0; u < 3; u++) {
        const x = 3 * y + u, b = 3 * y + (u + 1) % 3, F = p(x), S = p(b), A = F < S ? F + "|" + S : S + "|" + F, T = M.get(A);
        T ? T.push(y) : M.set(A, [y, x, b]);
      }
      const k = Math.cos(25 * Math.PI / 180);
      for (const y of M.values()) {
        const u = y[0], x = y[1], b = y[2];
        let F = y.length === 3;
        if (!F && y.length === 4) {
          const A = y[3], T = d[3 * u] * d[3 * A] + d[3 * u + 1] * d[3 * A + 1] + d[3 * u + 2] * d[3 * A + 2];
          F = Math.abs(T) < k;
        }
        if (!F) continue;
        const S = n.length / 6;
        n.push(l[3 * x], l[3 * x + 1], l[3 * x + 2], l[3 * b], l[3 * b + 1], l[3 * b + 2]);
        for (const [A, T, D] of [[l[3 * x], l[3 * x + 1], l[3 * x + 2]], [l[3 * b], l[3 * b + 1], l[3 * b + 2]], [(l[3 * x] + l[3 * b]) / 2, (l[3 * x + 1] + l[3 * b + 1]) / 2, (l[3 * x + 2] + l[3 * b + 2]) / 2]]) {
          const B = xe(A, T, D), W = a.get(B);
          W ? W[W.length - 1] !== S && W.push(S) : a.set(B, [S]);
        }
      }
    }
    const c = { segs: new Float32Array(n), celdas: a };
    return Me.set(e.id, c), c;
  };
  let ve = "";
  const De = (e) => {
    const o = e.map((i) => i.id).join(",");
    if (o === ve) return;
    ve = o;
    const s = e.map((i) => ge(i).segs);
    let n = 0;
    for (const i of s) n += i.length;
    const a = new Float32Array(n);
    let c = 0;
    for (const i of s) a.set(i, c), c += i.length;
    ee.geometry.dispose(), ee.geometry = new Ae(), ee.geometry.setAttribute("position", new xt(a, 3)), ee.visible = n > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    ee.visible = ve !== "" && window.__hekatanRefIfcBordes !== false, C();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const o of Me.values()) e += o.segs.length / 6;
    return e;
  };
  const ze = (e, o) => {
    const s = window.__hekatanCursorPx;
    if (!s) return null;
    const n = ge(e), a = n.segs, c = Math.floor(o.x / $e), i = Math.floor(o.y / $e), l = Math.floor(o.z / $e), r = /* @__PURE__ */ new Set();
    let p = kn, d = null, w = kn, f = null, m = -1;
    const M = new $(), k = new $();
    for (let y = -1; y <= 1; y++) for (let u = -1; u <= 1; u++) for (let x = -1; x <= 1; x++) {
      const b = n.celdas.get(c + y + "," + (i + u) + "," + (l + x));
      if (b) for (const F of b) {
        if (r.has(F)) continue;
        r.add(F);
        const S = 6 * F;
        M.set(a[S], a[S + 1], a[S + 2]), k.set(a[S + 3], a[S + 4], a[S + 5]);
        const A = Vn(M.x, M.y, M.z), T = Vn(k.x, k.y, k.z);
        if (!A || !T) continue;
        const D = Math.hypot(A.x - s.x, A.y - s.y), B = Math.hypot(T.x - s.x, T.y - s.y);
        D < p && (p = D, d = M.clone()), B < p && (p = B, d = k.clone());
        const W = T.x - A.x, ne = T.y - A.y, ye = W * W + ne * ne || 1e-9;
        let ke = ((s.x - A.x) * W + (s.y - A.y) * ne) / ye;
        ke = Math.max(0, Math.min(1, ke));
        const st = Math.hypot(s.x - (A.x + ke * W), s.y - (A.y + ke * ne));
        st < w && (w = st, f = M.clone().lerp(k, ke), m = F);
      }
    }
    return m >= 0 && (n.adj || (n.adj = re(n.segs)), se = { S: n.segs, adj: n.adj, s: m }), d ? { tipo: "ifcVert", punto: d } : f ? { tipo: "ifcEdge", punto: f } : null;
  }, et = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((c) => {
      var _a4;
      ((_a4 = c.userData) == null ? void 0 : _a4.refIfc) && c.isMesh && e.push(c);
    }), !e.length) return ee.visible = false, ve = "", null;
    De(e);
    const o = V.intersectObjects(e, false).filter((c) => {
      const i = c.object.material;
      return (i && i.clippingPlanes || []).every((r) => r.distanceToPoint(c.point) >= 0);
    });
    if (!o.length) return null;
    const s = o[0], n = o[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? pe(s.object, s.faceIndex ?? -1, s.point) : J && pe(null, -1, null);
    const a = ze(s.object, s.point);
    if (a) return oe = { tipo: a.tipo }, [{ ...s, point: a.punto }];
    if (n && n.object === s.object && n.distance - s.distance <= 1.2) {
      const c = s.point.clone().add(n.point).multiplyScalar(0.5);
      return oe = { tipo: "ifcAxis" }, [{ ...s, point: c }];
    }
    return oe = { tipo: "ifc" }, [s];
  };
  let at = "", Be = new Float32Array(0);
  const R = new Qt(new Ae(), new ft({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  R.name = "ref-ifc-seccion", R.renderOrder = 998, R.frustumCulled = false, R.visible = false, g.add(R);
  const O = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return R.visible = false, Be = new Float32Array(0);
    const o = [];
    e.enableX && o.push([0, +e.posX]), e.enableY && o.push([1, +e.posY]), e.enableZ && o.push([2, +e.posZ]);
    const s = [];
    g.traverse((c) => {
      var _a3;
      ((_a3 = c.userData) == null ? void 0 : _a3.refIfc) && c.isMesh && s.push(c);
    });
    const n = JSON.stringify(o) + "|" + s.map((c) => c.id).join(",");
    if (n === at) return Be;
    at = n;
    const a = [];
    if (o.length && s.length) {
      const c = [new $(), new $(), new $()];
      for (const i of s) {
        const l = i.geometry.getAttribute("position");
        if (l) {
          i.updateMatrixWorld();
          for (let r = 0; r + 2 < l.count; r += 3) {
            for (let p = 0; p < 3; p++) c[p].fromBufferAttribute(l, r + p).applyMatrix4(i.matrixWorld);
            for (const [p, d] of o) {
              const w = [c[0].getComponent(p) - d, c[1].getComponent(p) - d, c[2].getComponent(p) - d], f = [];
              for (let m = 0; m < 3; m++) {
                const M = c[m], k = c[(m + 1) % 3], y = w[m], u = w[(m + 1) % 3];
                (y < 0 && u >= 0 || y >= 0 && u < 0) && f.push(M.clone().lerp(k, y / (y - u)));
              }
              f.length === 2 && a.push(f[0].x, f[0].y, f[0].z, f[1].x, f[1].y, f[1].z);
            }
          }
        }
      }
    }
    return Be = new Float32Array(a), R.geometry.dispose(), R.geometry = new Ae(), R.geometry.setAttribute("position", new xt(Be, 3)), R.visible = Be.length > 0, Be;
  };
  let ie = null, ae = null;
  const be = (e, o) => {
    const s = O();
    if (!s.length) return null;
    let n = kn * 2, a = null, c = -1;
    const i = new $(), l = new $();
    for (let r = 0; r + 5 < s.length; r += 6) {
      i.set(s[r], s[r + 1], s[r + 2]), l.set(s[r + 3], s[r + 4], s[r + 5]);
      const p = Vn(i.x, i.y, i.z), d = Vn(l.x, l.y, l.z);
      if (!p || !d) continue;
      const w = d.x - p.x, f = d.y - p.y, m = w * w + f * f || 1e-9;
      let M = ((e - p.x) * w + (o - p.y) * f) / m;
      M = Math.max(0, Math.min(1, M));
      const k = Math.hypot(e - (p.x + M * w), o - (p.y + M * f));
      k < n && (n = k, a = i.clone().lerp(l, M), c = r / 6);
    }
    return c >= 0 && (ae !== s && (ie = re(s), ae = s), se = { S: s, adj: ie, s: c }), a;
  };
  let Se = null;
  window.__hekatanSeccionIfc = () => O().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const o = O(), s = [], n = Math.max(1, Math.floor(o.length / 6 / e));
    for (let a = 0; a + 2 < o.length; a += 6 * n) s.push([o[a], o[a + 1], o[a + 2]]);
    return s;
  };
  const Re = () => {
    oe = null;
    const e = et();
    if (e) return e;
    if (Z) return V.intersectObjects([j], false);
    if (he.visible = !!window.__hekatanGridPlaneXZ, Q.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ut.visible) {
      const n = V.intersectObjects([Ut, ln, rn], false);
      if (n.length > 0) return n;
    }
    const s = [j];
    return he.visible && s.push(he), Q.visible && s.push(Q), bn.visible && Xn.length > 0 && s.push(...Xn), V.intersectObjects(s, false);
  }, Ee = new Io(new Ae(), new To()), We = new Io(new Ae(), new To({ color: "gray", sizeAttenuation: false, size: 6 })), Ze = new Io(new Ae(), new To({ color: "orange", sizeAttenuation: false, size: 5 }));
  g.add(Ze);
  const _e = document.createElement("input");
  _e.id = "hk-rubber-label", _e.type = "text", _e.spellcheck = false, _e.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, _e.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(_e);
  const Te = document.createElement("div");
  Te.id = "hk-rubber-angle", Te.style.cssText = ["position:fixed", "z-index:99996", "pointer-events:none", "padding:2px 6px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px", "font-family:Consolas,monospace", "font-size:12px", "transform:translate(-50%,0)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Te);
  let Ne = null, lt = null, Oe = false;
  const gt = new $(), yt = (e, o, s, n, a, c) => {
    const i = n - e, l = a - o, r = c - s, p = Math.hypot(i, l, r);
    if (p < 0.01) {
      _e.style.display = "none";
      return;
    }
    Ne = [e, o, s], lt = [i / p, l / p, r / p], gt.set((e + n) / 2, (o + a) / 2, (s + c) / 2), gt.project(v());
    const d = E.getBoundingClientRect(), w = d.left + (gt.x * 0.5 + 0.5) * d.width, f = d.top + (-gt.y * 0.5 + 0.5) * d.height;
    _e.style.left = w + "px", _e.style.top = f + "px", _e.style.display = "block";
    const m = new $(e, o, s).project(v()), M = new $(n, a, c).project(v()), k = d.left + (m.x * 0.5 + 0.5) * d.width, y = d.top + (-m.y * 0.5 + 0.5) * d.height, u = d.left + (M.x * 0.5 + 0.5) * d.width, x = d.top + (-M.y * 0.5 + 0.5) * d.height;
    let b = Math.atan2(-(x - y), u - k) * 180 / Math.PI;
    if (b < 0 && (b += 360), Te.textContent = `${Math.round(b) % 360}\xB0`, Te.style.left = u + "px", Te.style.top = x + 34 + "px", Te.style.display = "block", !Oe) {
      if (_e.value = `${p.toFixed(2)} m`, document.activeElement !== _e) {
        const F = document.activeElement;
        F && (F.tagName === "INPUT" || F.tagName === "TEXTAREA") && F !== _e || _e.focus({ preventScroll: true });
      }
      try {
        _e.select();
      } catch {
      }
    }
  }, dn = () => {
    _e.style.display = "none", Te.style.display = "none", Ne = null, lt = null, Oe = false, document.activeElement === _e && _e.blur();
  }, _t = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      Ln = e, le(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), _e.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ke.length === 1) {
      const d = Ke[0];
      Ke = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, d[0], d[1], d[2], e), le(`\u2713 C\xEDrculo r=${e} m en (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}).`);
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
      Ct = e, le(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), _e.blur();
      return;
    }
    if (!Ne || !lt || !t.polylines) return;
    let s = lt[0], n = lt[1], a = lt[2];
    zt === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : zt === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : zt === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const c = Ne[0] + s * e, i = Ne[1] + n * e, l = Ne[2] + a * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [c, i, l]];
    const r = t.polylines.rawVal, p = r.length ? r[r.length - 1] : [];
    t.polylines.val = [...r.slice(0, -1), [...p, t.points.rawVal.length - 1]], _e.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    C();
  }, Ve = (e) => {
    let o = e.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const s = o.startsWith("@");
    if (s && (o = o.slice(1)), o.includes("<")) {
      const a = o.split("<").map((c) => parseFloat(c.trim()));
      if (a.some(isNaN)) return null;
      if (a.length === 2) {
        const [c, i] = a;
        return s ? { kind: "relPolar", L: c, ang: i } : { kind: "absPolar", L: c, ang: i };
      }
      if (a.length === 3 && s) {
        const [c, i, l] = a;
        return { kind: "relSpherical", L: c, az: i, el: l };
      }
      return null;
    }
    if (o.includes(",")) {
      const a = o.split(",").map((r) => parseFloat(r.trim()));
      if (a.some(isNaN)) return null;
      const [c, i, l = 0] = a;
      return s ? { kind: "relCart", dx: c, dy: i, dz: l } : { kind: "absCart", x: c, y: i, z: l };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, tt = (e) => {
    if (!e) return null;
    if (e.kind === "absCart") return [e.x, e.y, e.z];
    if (e.kind === "relCart") return Ne ? [Ne[0] + e.dx, Ne[1] + e.dy, Ne[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const o = e.ang * Math.PI / 180;
      return [e.L * Math.cos(o), e.L * Math.sin(o), 0];
    }
    if (e.kind === "relPolar") {
      if (!Ne) return null;
      const o = e.ang * Math.PI / 180;
      return [Ne[0] + e.L * Math.cos(o), Ne[1] + e.L * Math.sin(o), Ne[2]];
    }
    if (e.kind === "relSpherical") {
      if (!Ne) return null;
      const o = e.az * Math.PI / 180, s = e.el * Math.PI / 180, n = e.L * Math.cos(s);
      return [Ne[0] + n * Math.cos(o), Ne[1] + n * Math.sin(o), Ne[2] + e.L * Math.sin(s)];
    }
    return null;
  }, Je = (e) => {
    var _a3, _b;
    if (!t.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, e];
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    t.polylines.val = [...o.slice(0, -1), [...s, t.points.rawVal.length - 1]], Ne = e, _e.blur();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (e) => {
    var _a3;
    const o = Ve(e);
    if (!o) return false;
    if (o.kind === "length") return _t(o.L), true;
    const s = tt(o);
    if (!s) return false;
    Gs(new $(s[0], s[1], s[2]), null), Ne = s, _e.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, _e.addEventListener("keydown", (e) => {
    var _a3, _b, _c;
    if (e.key === "Enter") {
      if (e.preventDefault(), !Oe) {
        (_a3 = window.__hekatanFinalizeDraw) == null ? void 0 : _a3.call(window);
        try {
          (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c.call(_b, "select");
        } catch {
        }
        return;
      }
      const s = Ve(_e.value);
      if (!s) return;
      if (Oe = false, s.kind === "length") _t(s.L), le(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = tt(s);
        if (!n) return;
        Je(n);
        const a = s.kind;
        le(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), Oe = false, _e.blur();
      return;
    }
    const o = e.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!Oe && _e.style.display === "block") try {
          _e.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (Oe = true);
  }), window.addEventListener("keydown", (e) => {
    if (!Ne || !lt || document.activeElement === _e) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (_e.value = e.key, _e.focus(), _e.setSelectionRange(1, 1), e.preventDefault());
  });
  const Pe = document.createElement("div");
  Pe.id = "hk-coord-readout", Pe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Pe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Pe);
  const Le = document.createElement("div");
  Le.id = "hk-coord-fixed", Le.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Le.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Le);
  const Ue = new $t(new Ae().setFromPoints([new $(0, 0, 0), new $(0, 0, 0)]), new so({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  Ue.frustumCulled = false, Ue.visible = false, Ue.name = "rubberBand", g.add(Ue), window.__hekatanRubberBand = Ue;
  const Ie = new $t(new Ae(), new ft({ color: 2282478, transparent: true, opacity: 0.9 }));
  Ie.frustumCulled = false, Ie.visible = false, g.add(Ie);
  let nt = [];
  const it = new $t(new Ae(), new ft({ color: 16763904, transparent: true, opacity: 0.95 }));
  it.frustumCulled = false, it.visible = false, it.renderOrder = 999, g.add(it);
  let pt = [];
  const Qe = document.createElement("div");
  Qe.id = "hk-measure-label", Qe.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(Qe);
  const rt = (e) => {
    var _a3, _b;
    const o = Y(e);
    if (!o) return null;
    V.setFromCamera(N, o);
    let s = null, n = null;
    const a = V.intersectObjects(g.children, true).filter((f) => f.object.isMesh && f.object !== bt && f.object !== dt && f.object.visible !== false);
    if (a.length) {
      const f = a[0], m = f.point;
      s = [m.x, m.y, m.z];
      const k = (_b = (_a3 = f.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      k && f.face && (n = [f.face.a, f.face.b, f.face.c].map((y) => {
        const u = new $().fromBufferAttribute(k, y);
        return f.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const f = Re();
      if (f.length) {
        const m = f[0].point;
        s = [m.x, m.y, m.z];
      }
    }
    if (!s) return null;
    const c = E.getBoundingClientRect(), i = (f) => {
      const m = new $(f[0], f[1], f[2]).project(o);
      return [c.left + (m.x * 0.5 + 0.5) * c.width, c.top + (-m.y * 0.5 + 0.5) * c.height];
    }, l = [e.clientX, e.clientY], r = 14;
    let p = s, d = r;
    const w = (f) => {
      const m = i(f), M = Math.hypot(m[0] - l[0], m[1] - l[1]);
      M < d && (d = M, p = f);
    };
    for (const f of n ?? []) w(f);
    for (const f of t.points.rawVal) w(f);
    return p;
  }, kt = () => {
    if (pt.length < 1) {
      Qe.style.display = "none";
      return;
    }
    const e = v(), o = pt[0], s = pt[1] ?? pt[0], a = new $((o[0] + s[0]) / 2, (o[1] + s[1]) / 2, (o[2] + s[2]) / 2).clone().project(e), c = E.getBoundingClientRect();
    Qe.style.left = c.left + (a.x * 0.5 + 0.5) * c.width + "px", Qe.style.top = c.top + (-a.y * 0.5 + 0.5) * c.height - 14 + "px", Qe.style.display = "block";
  };
  window.__hekatanMeasureRefresh = kt, window.__hekatanClearMeasure = () => {
    pt = [], it.visible = false, Qe.style.display = "none";
    try {
      C();
    } catch {
    }
  };
  try {
    (_a2 = _.addEventListener) == null ? void 0 : _a2.call(_, "change", kt);
  } catch {
  }
  const dt = new ct(new Ae(), new wt({ color: 16096779, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }));
  dt.frustumCulled = false, dt.visible = false, dt.renderOrder = 998, dt.name = "hk-fill-preview", g.add(dt), E.addEventListener("pointerleave", () => {
    Pe.style.display = "none", dt.visible && (dt.visible = false, C());
  });
  const Ht = (e) => {
    var _a3, _b, _c, _d;
    const o = t.points.rawVal, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Map(), a = (y, u) => {
      y !== u && ((n.get(y) ?? n.set(y, /* @__PURE__ */ new Set()).get(y)).add(u), (n.get(u) ?? n.set(u, /* @__PURE__ */ new Set()).get(u)).add(y));
    };
    for (const y of s) for (let u = 0; u + 1 < y.length; u++) a(y[u], y[u + 1]);
    const c = (y, u) => {
      var _a4;
      return !!((_a4 = n.get(y)) == null ? void 0 : _a4.has(u));
    }, i = [], l = /* @__PURE__ */ new Set(), r = [...n.keys()];
    for (const y of r) for (const u of n.get(y)) if (!(u < y)) {
      for (const x of n.get(u)) if (x !== y) for (const b of n.get(x)) {
        if (b === y || b === u || !c(b, y) || c(y, x) || c(u, b)) continue;
        const F = [y, u, x, b].slice().sort((S, A) => S - A).join("-");
        l.has(F) || (l.add(F), i.push([y, u, x, b]));
      }
    }
    for (const y of r) for (const u of n.get(y)) if (!(u < y)) for (const x of n.get(u)) {
      if (x === y || !c(x, y)) continue;
      const b = [y, u, x].slice().sort((F, S) => F - S).join("-");
      l.has(b) || (l.add(b), i.push([y, u, x]));
    }
    const p = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", d = (y) => p === "xy" ? [y[0], y[1]] : p === "xz" ? [y[0], y[2]] : [y[1], y[2]], w = d(e), f = (y, u) => {
      let x = false;
      for (let b = 0, F = u.length - 1; b < u.length; F = b++) {
        const S = u[b][0], A = u[b][1], T = u[F][0], D = u[F][1];
        A > y[1] != D > y[1] && y[0] < (T - S) * (y[1] - A) / (D - A) + S && (x = !x);
      }
      return x;
    }, m = (y) => {
      let u = 0;
      for (let x = 0, b = y.length - 1; x < y.length; b = x++) u += (y[b][0] + y[x][0]) * (y[b][1] - y[x][1]);
      return Math.abs(u) / 2;
    };
    let M = null, k = 1 / 0;
    for (const y of i) {
      const u = y.map((b) => d(o[b]));
      if (!f(w, u)) continue;
      const x = m(u);
      x < k && (k = x, M = y);
    }
    return M;
  }, St = new ut(), Yt = new ct(new Pn(1, 1), new wt({ color: 2282478, transparent: true, opacity: 0.08, side: Vt, depthWrite: false })), It = new Qt(new ea(new Pn(1, 1)), new ft({ color: 2282478, transparent: true, opacity: 0.85 })), Jt = new Qt(new Ae(), new ft({ color: 2282478, transparent: true, opacity: 0.3 })), uo = (e, o) => {
    const s = [], n = Math.ceil(e / o);
    for (let a = -n; a <= n; a++) {
      const c = a * o;
      s.push(-e, c, 0, e, c, 0), s.push(c, -e, 0, c, e, 0);
    }
    Jt.geometry.dispose(), Jt.geometry = new Ae(), Jt.geometry.setAttribute("position", new Lt(s, 3));
  };
  St.add(Yt, It, Jt), St.visible = false, St.frustumCulled = false, g.add(St);
  const Xt = new ut();
  Xt.frustumCulled = false, Xt.visible = false, g.add(Xt);
  const Mn = (e) => {
    const o = new Ae().setFromPoints([new $(0, 0, 0), new $(0, 0, 0)]), s = new so({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new $t(o, s);
  }, un = Mn(16711680), Cn = Mn(65280), An = Mn(35071);
  Xt.add(un, Cn, An);
  const Jn = [], Yo = (e) => e.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Zt = Mn(16761856);
  Zt.material.dashSize = 0.28, Zt.material.gapSize = 0.16, Zt.material.opacity = 0.9, Zt.frustumCulled = false, Zt.visible = false, Zt.renderOrder = 98, g.add(Zt);
  const Bn = (e) => {
    const o = new Ae().setFromPoints([new $(0, 0, 0), new $(0, 0, 0), new $(0, 0, 0), new $(0, 0, 0)]), s = new ft({ color: e, transparent: true, opacity: 0.2, depthTest: false }), n = new ma(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, Dn = Bn(3462041), En = Bn(16724804), Nn = Bn(6333946), pn = new ut();
  pn.frustumCulled = false, pn.visible = false, g.add(pn), pn.add(Dn, En, Nn);
  const Yn = (e) => {
    const o = new Pn(1, 1), s = new wt({ color: e, transparent: true, opacity: 0.06, side: Vt, depthWrite: false }), n = new ct(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ut = Yn(3462041), ln = Yn(16724804), rn = Yn(6333946);
  pn.add(Ut, ln, rn);
  const xn = (e, o, s, n) => {
    e.scale.set(2 * n, 2 * n, 1), s === "xy" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, 0, 0)) : s === "xz" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, fn = document.createElement("div");
  fn.id = "hk-refplane-badge", fn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(fn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = e, pn.visible = e, e) {
      const o = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], c = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], i = window.__hekatanOrthoExt ?? 8;
      gn(Dn, c, "xy", i), gn(En, c, "xz", i), gn(Nn, c, "yz", i), xn(Ut, c, "xy", i), xn(ln, c, "xz", i), xn(rn, c, "yz", i), Ut.material.opacity = 0.05, ln.material.opacity = 0.05, rn.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    C();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a3;
    if (window.__hekatanOrthoExt = e, !pn.visible) {
      C();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], c = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    gn(Dn, c, "xy", e), gn(En, c, "xz", e), gn(Nn, c, "yz", e), xn(Ut, c, "xy", e), xn(ln, c, "xz", e), xn(rn, c, "yz", e), C();
  };
  const Ms = (e) => {
    if (Ut.material.opacity = e === "xy" ? 0.09 : 0.025, ln.material.opacity = e === "xz" ? 0.09 : 0.025, rn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      fn.style.background = a.bg, fn.style.color = a.text, fn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, fn.style.display = "block";
    } else fn.style.display = "none";
  }, gn = (e, o, s, n) => {
    let a;
    s === "xy" ? a = [new $(o[0] - n, o[1] - n, o[2]), new $(o[0] + n, o[1] - n, o[2]), new $(o[0] + n, o[1] + n, o[2]), new $(o[0] - n, o[1] + n, o[2]), new $(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new $(o[0] - n, o[1], o[2] - n), new $(o[0] + n, o[1], o[2] - n), new $(o[0] + n, o[1], o[2] + n), new $(o[0] - n, o[1], o[2] + n), new $(o[0] - n, o[1], o[2] - n)] : a = [new $(o[0], o[1] - n, o[2] - n), new $(o[0], o[1] + n, o[2] - n), new $(o[0], o[1] + n, o[2] + n), new $(o[0], o[1] - n, o[2] + n), new $(o[0], o[1] - n, o[2] - n)], e.geometry.setFromPoints(a);
  };
  let zt = null;
  window.__hekatanAxisLock = () => zt;
  let po = null, Rt = null;
  const Bt = document.createElement("div");
  Bt.id = "hk-axis-lock-badge", Bt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Bt);
  const vs = () => {
    if (!zt) {
      Bt.style.display = "none";
      return;
    }
    const e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Bt.style.background = "rgba(15,23,42,0.92)", Bt.style.color = e[zt], Bt.style.border = `1.5px solid ${e[zt]}`, Bt.textContent = `\u{1F512} LOCK ${zt.toUpperCase()}`, Bt.style.display = "block";
  };
  window.addEventListener("keydown", (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== _e) return;
    const s = e.key.toLowerCase(), n = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && n === "polyarea" && nt.length >= 3) {
      const a = Mo();
      le(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") zt = zt === s ? null : s, vs(), e.preventDefault();
    else if (e.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Zs(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || Po(), le(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (Xt.visible = false), le(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a3;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const e = window.__hekatanOrthoMode;
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = e ? "block" : "none";
      let s = document.getElementById("hk-ortho-badge");
      s || (s = document.createElement("div"), s.id = "hk-ortho-badge", s.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", s.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(s)), s.style.display = e ? "block" : "none";
    }
  };
  const fo = new $(), ho = new $(), _s = new $(), Sa = (e) => {
    if (!zt) return null;
    const o = e[0], s = e[1], n = e[2];
    return zt === "x" ? (fo.set(o - 1e4, s, n), ho.set(o + 1e4, s, n)) : zt === "y" ? (fo.set(o, s - 1e4, n), ho.set(o, s + 1e4, n)) : (fo.set(o, s, n - 1e4), ho.set(o, s, n + 1e4)), V.ray.distanceSqToSegment(fo, ho, null, _s), _s;
  };
  window.__hekatanProjectOnAxis = Sa;
  const qt = new $t(new Ae().setFromPoints([new $(0, 0, 0), new $(0, 0, 0)]), new ft({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  qt.renderOrder = 998, qt.frustumCulled = false, qt.visible = false, g.add(qt);
  let cn = -1, vn = -1, _n = -1;
  const qe = /* @__PURE__ */ new Set();
  window.__hekatanSelection = qe;
  const hn = new $t(new Ae().setFromPoints([new $(), new $()]), new ft({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  hn.renderOrder = 997, hn.frustumCulled = false, hn.visible = false, g.add(hn);
  const jt = new ct(new Hn(0.02, 12, 12), new wt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  jt.renderOrder = 998, jt.visible = false, g.add(jt);
  const mo = (e) => {
    const o = v();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(e);
    return Math.max(0.05, s / 10);
  }, ks = () => {
    jt.visible && jt.scale.setScalar(mo(jt.position));
  }, mn = new ut();
  mn.frustumCulled = false, g.add(mn);
  const wo = 2282478;
  let wn = null;
  const Pa = (e, o, s, n) => {
    if (!t.points) return -1;
    const a = t.points.rawVal;
    let c = -1, i = n;
    for (let l = 0; l < a.length; l++) {
      const r = a[l];
      if (!r) continue;
      const p = Math.hypot(e - r[0], o - r[1], s - r[2]);
      p < i && (i = p, c = l);
    }
    return c;
  }, en = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; mn.children.length; ) {
      const i = mn.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const i of qe) {
      const [l, ...r] = i.split(":");
      if (l === "pt") {
        const p = e[+r[0]];
        if (!p) continue;
        const d = new ct(new Hn(0.025, 12, 12), new wt({ color: wo, transparent: true, opacity: 0.9, depthTest: false }));
        d.position.set(p[0], p[1], p[2]), d.renderOrder = 999, d.__isSelectionPt = true, mn.add(d);
      } else if (l === "seg") {
        const p = o[+r[0]], d = e[p == null ? void 0 : p[+r[1]]], w = e[p == null ? void 0 : p[+r[1] + 1]];
        if (!d || !w) continue;
        const f = new Ae().setFromPoints([new $(d[0], d[1], d[2]), new $(w[0], w[1], w[2])]), m = new $t(f, new ft({ color: wo, transparent: true, opacity: 0.95, depthTest: false }));
        m.renderOrder = 999, mn.add(m);
      } else if (l === "poly") {
        const d = o[+r[0]].map((m) => {
          const M = e[m];
          return M ? new $(M[0], M[1], M[2]) : null;
        }).filter(Boolean);
        if (d.length < 2) continue;
        const w = new Ae().setFromPoints(d), f = new $t(w, new ft({ color: wo, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, mn.add(f);
      } else if (l === "aux") {
        const p = n[+r[0]];
        if (!p || p.length !== 6) continue;
        const d = new Ae().setFromPoints([new $(p[0], p[1], p[2]), new $(p[3], p[4], p[5])]), w = new $t(d, new ft({ color: wo, transparent: true, opacity: 0.95, depthTest: false }));
        w.renderOrder = 999, mn.add(w);
      }
    }
    const a = window.__hekatanUpdateSelectionPtScale;
    a && a();
    const c = window.__hekatanRefreshPropsPane;
    c && c();
    try {
      (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
    } catch {
    }
    C();
  };
  window.__hekatanRefreshSelection = en, window.__hekatanSelectIds = (e) => {
    var _a3;
    qe.clear();
    for (const o of e) qe.add(o);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), qe.size;
  }, window.__hekatanClearSelection = () => {
    qe.clear(), en();
  };
  const On = (e, o, s, n, a, c, i, l, r) => {
    const p = i - n, d = l - a, w = r - c, f = p * p + d * d + w * w;
    if (f < 1e-12) return Math.hypot(e - n, o - a, s - c);
    let m = ((e - n) * p + (o - a) * d + (s - c) * w) / f;
    m = Math.max(0, Math.min(1, m));
    const M = n + m * p, k = a + m * d, y = c + m * w;
    return Math.hypot(e - M, o - k, s - y);
  }, Xo = (e, o, s, n) => {
    if (!t.polylines) return null;
    const a = t.polylines.rawVal, c = t.points.rawVal;
    let i = -1, l = -1, r = n;
    for (let p = 0; p < a.length; p++) {
      const d = a[p];
      for (let w = 0; w < d.length - 1; w++) {
        const f = c[d[w]], m = c[d[w + 1]];
        if (!f || !m) continue;
        const M = On(e, o, s, f[0], f[1], f[2], m[0], m[1], m[2]);
        M < r && (r = M, i = p, l = w);
      }
    }
    return i >= 0 ? { polyIdx: i, segIdx: l, dist: r } : null;
  }, Ss = (e, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, c = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let i = -1, l = n;
    for (let r = 0; r < c.length; r++) {
      const p = c[r];
      if (!p || p.length !== 6) continue;
      const d = On(e, o, s, p[0], p[1], p[2], p[3], p[4], p[5]);
      d < l && (l = d, i = r);
    }
    return i;
  }, za = (e) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[e];
    if (!n || n.length !== 6) {
      qt.visible = false;
      return;
    }
    qt.geometry.setFromPoints([new $(n[0], n[1], n[2]), new $(n[3], n[4], n[5])]), qt.visible = true;
  }, Ca = (e, o = -1) => {
    var _a3, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal[e], n = t.points.rawVal;
    if (!s || s.length < 2) {
      qt.visible = false;
      return;
    }
    const a = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, c = [];
    if (a || o < 0 || o >= s.length - 1) for (const i of s) {
      const l = n[i];
      l && c.push(new $(l[0], l[1], l[2]));
    }
    else {
      const i = n[s[o]], l = n[s[o + 1]];
      i && c.push(new $(i[0], i[1], i[2])), l && c.push(new $(l[0], l[1], l[2]));
    }
    qt.geometry.setFromPoints(c), qt.visible = true;
  }, yo = (e) => {
    var _a3;
    if (!t.polylines) return;
    const o = t.polylines.rawVal;
    if (e < 0 || e >= o.length) return;
    const s = o.filter((r, p) => p !== e), n = /* @__PURE__ */ new Set();
    for (const r of s) for (const p of r) n.add(p);
    const a = t.points.rawVal, c = /* @__PURE__ */ new Map(), i = [];
    for (let r = 0; r < a.length; r++) n.has(r) && (c.set(r, i.length), i.push(a[r]));
    const l = s.map((r) => r.map((p) => c.get(p)).filter((p) => p !== void 0));
    t.points.val = i, t.polylines.val = l, t.areas && (t.areas.val = t.areas.rawVal.filter((r) => r !== e).map((r) => r > e ? r - 1 : r)), qt.visible = false, cn = -1, vn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, Ps = (e, o) => {
    var _a3, _b, _c;
    if (!t.polylines) return;
    const s = t.polylines.rawVal;
    if (e < 0 || e >= s.length) return;
    if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      yo(e);
      return;
    }
    const a = s[e];
    if (o < 0 || o >= a.length - 1) return;
    if (a.length === 2) {
      yo(e);
      return;
    }
    let c;
    o === 0 ? c = [a.slice(1)] : o === a.length - 2 ? c = [a.slice(0, -1)] : c = [a.slice(0, o + 1), a.slice(o + 1)];
    const i = [...s.slice(0, e), ...c, ...s.slice(e + 1)], l = /* @__PURE__ */ new Set();
    for (const f of i) for (const m of f) l.add(m);
    const r = t.points.rawVal, p = /* @__PURE__ */ new Map(), d = [];
    for (let f = 0; f < r.length; f++) l.has(f) && (p.set(f, d.length), d.push(r[f]));
    const w = i.map((f) => f.map((m) => p.get(m)).filter((m) => m !== void 0));
    if (t.points.val = d, t.polylines.val = w, t.areas) {
      const f = c.length - 1;
      t.areas.val = t.areas.rawVal.map((m) => m > e ? m + f : m);
    }
    qt.visible = false, cn = -1, vn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Ee.geometry.setAttribute("position", new Lt(t.points.rawVal.flat(), 3)), Ee.geometry.computeBoundingSphere(), Ee.frustumCulled = false, We.frustumCulled = false, g.add(We), j.position.set(0, 0, 0), j.rotateX(Math.PI / 2), j.geometry.rotateX(Math.PI / 2), j.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, o, s) => {
    if (t.points.val = [...t.points.rawVal, [e, o, s]], t.polylines) {
      const n = t.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
      t.polylines.val = [...n.slice(0, -1), [...a, t.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a3;
    if (!t.polylines) return;
    const e = t.polylines.rawVal;
    ((_a3 = e[e.length - 1]) == null ? void 0 : _a3.length) !== 0 && (t.polylines.val = [...e, []]);
  };
  const xo = [];
  window.__hekatanCirculos = xo;
  let zs = [], Cs = "";
  const As = () => {
    var _a3;
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = `${e.length}|${o.length}|${o.reduce((a, c) => a + c.length, 0)}`;
    if (s === Cs) return zs;
    Cs = s;
    const n = [];
    for (const a of o) {
      const c = a.length;
      if (c < 6 || a[0] !== a[c - 1]) continue;
      const i = a.slice(0, c - 1).map((d) => e[d]).filter(Boolean);
      if (i.length < 5) continue;
      const l = [0, 1, 2].map((d) => i.reduce((w, f) => w + f[d], 0) / i.length), r = i.map((d) => Math.hypot(d[0] - l[0], d[1] - l[1], d[2] - l[2])), p = r.reduce((d, w) => d + w, 0) / r.length;
      p < 1e-9 || r.some((d) => Math.abs(d - p) > 5e-3 * p) || n.push({ c: l, r: p });
    }
    return zs = n;
  };
  window.__hekatanCentrosDeducidos = As;
  const go = () => !!window.__hekatanCurvasAux, bo = (e, o) => {
    const s = window.__hekatanDrawingAuxLines;
    if (!s) return 0;
    Pt();
    const n = s.rawVal ?? s.val ?? [], a = [];
    for (let c = 0; c + 1 < e.length; c++) a.push([...e[c], ...e[c + 1]]);
    return o && e.length > 2 && a.push([...e[e.length - 1], ...e[0]]), s.val = [...n, ...a], a.length;
  };
  window.__hekatanDrawCircle = (e, o, s, n, a = window.__hekatanArcSegs ?? 12, c = "xy") => {
    var _a3;
    const i = Math.max(4, Math.round(a)), l = t.points.rawVal.length, r = [];
    for (let p = 0; p < i; p++) {
      const d = 2 * Math.PI * p / i, w = n * Math.cos(d), f = n * Math.sin(d);
      let m;
      c === "xy" ? m = [e + w, o + f, s] : c === "xz" ? m = [e + w, o, s + f] : m = [e, o + w, s + f], r.push(m);
    }
    if (xo.push({ c: [e, o, s], r: n }), go()) {
      bo(r, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...r], t.polylines) {
      const p = [...r.map((w, f) => l + f), l], d = t.polylines.rawVal;
      ((_a3 = d[d.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [...d, p, []] : t.polylines.val = [...d.slice(0, -1), p, []];
    }
  }, window.__hekatanDrawArc = (e, o, s, n = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const a = Math.max(4, Math.round(n)), c = new $(...e), i = new $(...o), l = new $(...s), r = new $().subVectors(i, c), p = new $().subVectors(l, c), d = new $().crossVectors(r, p), w = 2 * d.lengthSq();
    let f;
    if (w < 1e-12) f = new $().addVectors(c, l).multiplyScalar(0.5);
    else {
      const ye = p.clone().multiplyScalar(r.lengthSq()).sub(r.clone().multiplyScalar(p.lengthSq())), ke = new $().crossVectors(ye, d);
      f = c.clone().add(ke.divideScalar(w));
    }
    const m = c.distanceTo(f), M = d.lengthSq() > 1e-12 ? d.clone().normalize() : new $(0, 1, 0), k = new $().subVectors(c, f).normalize(), y = new $().crossVectors(M, k).normalize(), u = (ye) => {
      const ke = new $().subVectors(ye, f);
      return Math.atan2(ke.dot(y), ke.dot(k));
    }, x = (ye) => {
      let ke = ye;
      for (; ke < 0; ) ke += 2 * Math.PI;
      for (; ke >= 2 * Math.PI; ) ke -= 2 * Math.PI;
      return ke;
    }, b = x(u(i)), F = x(u(l)), S = b <= F ? F : F - 2 * Math.PI, A = t.points.rawVal.length, T = [], D = (ye) => {
      const ke = k.clone().multiplyScalar(Math.cos(ye)).add(y.clone().multiplyScalar(Math.sin(ye)));
      return f.clone().add(ke.multiplyScalar(m));
    }, B = String(window.__hekatanArcModo ?? "angulo"), W = B === "x" ? 0 : B === "y" ? 1 : B === "z" ? 2 : -1;
    let ne = false;
    if (W >= 0) {
      const ye = e[W], ke = s[W], st = 512;
      let Ge = Math.abs(ke - ye) > 1e-9, ot = ye;
      for (let Fe = 1; Fe <= st && Ge; Fe++) {
        const je = D(S * Fe / st).getComponent(W);
        (je - ot) * (ke - ye) < -1e-9 && (Ge = false), ot = je;
      }
      if (Ge) {
        ne = true;
        for (let Fe = 0; Fe <= a; Fe++) {
          const je = ye + (ke - ye) * Fe / a;
          let Ye = 0, Ce = S;
          for (let He = 0; He < 60; He++) {
            const mt = (Ye + Ce) / 2;
            (D(mt).getComponent(W) - je) * (ke - ye) < 0 ? Ye = mt : Ce = mt;
          }
          const Xe = D((Ye + Ce) / 2);
          T.push([Xe.x, Xe.y, Xe.z]);
        }
        T[0] = [e[0], e[1], e[2]], T[a] = [s[0], s[1], s[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${B.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!ne) for (let ye = 0; ye <= a; ye++) {
      const ke = D(S * (ye / a));
      T.push([ke.x, ke.y, ke.z]);
    }
    if (xo.push({ c: [f.x, f.y, f.z], r: m }), go()) {
      bo(T, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...T], t.polylines) {
      const ye = T.map((st, Ge) => A + Ge), ke = t.polylines.rawVal;
      t.polylines.val = [...ke.slice(0, -1), ye, []];
    }
  }, window.__hekatanDrawPolinomio = (e, o = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const s = e.length;
    if (s < 2) return { ok: false, msg: "faltan puntos" };
    const n = Math.max(s - 1, Math.round(o)), a = (S) => Math.max(...e.map((A) => A[S])) - Math.min(...e.map((A) => A[S])), c = [a(0), a(1), a(2)], i = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), l = i === "xy" ? 2 : i === "xz" ? 1 : i === "yz" ? 0 : -1, r = l >= 0 && c[l] < 1e-6 ? l : c[2] <= c[0] && c[2] <= c[1] ? 2 : c[1] <= c[0] ? 1 : 0, p = r === 2 ? "xy" : r === 1 ? "xz" : "yz", d = [0, 1, 2].filter((S) => S !== r), [w, f] = c[d[0]] >= c[d[1]] ? d : [d[1], d[0]], m = e.map((S) => S[w]), M = e.map((S) => S[f]);
    for (let S = 0; S < s; S++) for (let A = S + 1; A < s; A++) if (Math.abs(m[S] - m[A]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[w]} en ${p.toUpperCase()}): no hay polinomio que pase por los dos` };
    const k = (S) => {
      let A = 0;
      for (let T = 0; T < s; T++) {
        let D = 1;
        for (let B = 0; B < s; B++) B !== T && (D *= (S - m[B]) / (m[T] - m[B]));
        A += M[T] * D;
      }
      return A;
    }, y = (() => {
      const S = s, A = m.map((B) => Array.from({ length: S }, (W, ne) => B ** ne)), T = M.slice();
      for (let B = 0; B < S; B++) {
        let W = B;
        for (let ne = B + 1; ne < S; ne++) Math.abs(A[ne][B]) > Math.abs(A[W][B]) && (W = ne);
        [A[B], A[W]] = [A[W], A[B]], [T[B], T[W]] = [T[W], T[B]];
        for (let ne = B + 1; ne < S; ne++) {
          const ye = A[ne][B] / A[B][B];
          for (let ke = B; ke < S; ke++) A[ne][ke] -= ye * A[B][ke];
          T[ne] -= ye * T[B];
        }
      }
      const D = new Array(S).fill(0);
      for (let B = S - 1; B >= 0; B--) {
        let W = T[B];
        for (let ne = B + 1; ne < S; ne++) W -= A[B][ne] * D[ne];
        D[B] = W / A[B][B];
      }
      return D;
    })(), u = m[0], x = m[s - 1], b = t.points.rawVal.length, F = [];
    for (let S = 0; S <= n; S++) {
      const A = u + (x - u) * S / n, T = [e[0][0], e[0][1], e[0][2]];
      T[w] = A, T[f] = k(A), T[r] = e[0][r], F.push(T);
    }
    if (F[0] = [e[0][0], e[0][1], e[0][2]], F[n] = [e[s - 1][0], e[s - 1][1], e[s - 1][2]], go()) return bo(F, false), { ok: true, plano: p, coef: y, ia: w, io: f };
    if (t.points.val = [...t.points.rawVal, ...F], t.polylines) {
      const S = F.map((T, D) => b + D), A = t.polylines.rawVal;
      t.polylines.val = ((_d = A[A.length - 1]) == null ? void 0 : _d.length) > 0 ? [...A, S, []] : [...A.slice(0, -1), S, []];
    }
    return { ok: true, plano: p, coef: y, ia: w, io: f };
  };
  const Es = () => {
    var _a3, _b;
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? [], c = [], i = [], l = /* @__PURE__ */ new Set(), r = (p) => [e[p][0], e[p][1], e[p][2]];
    return [...qe].forEach((p) => {
      const d = p.split(":");
      if (d[0] === "aux") {
        const f = a[+d[1]];
        f && f.length === 6 && (c.push([[f[0], f[1], f[2]], [f[3], f[4], f[5]]]), i.push(p));
        return;
      }
      const w = d[0] === "poly" || d[0] === "seg" ? +d[1] : -1;
      if (!(w < 0 || !o[w] || s.has(w))) if (d[0] === "poly") {
        if (l.has(w)) return;
        l.add(w);
        for (let f = 0; f + 1 < o[w].length; f++) c.push([r(o[w][f]), r(o[w][f + 1])]);
      } else {
        const f = o[w][+d[2]], m = o[w][+d[2] + 1];
        f != null && m != null && !l.has(w) && c.push([r(f), r(m)]);
      }
    }), { segs: c, auxIds: i };
  }, Qn = (e, o) => Math.abs(e[0] - o[0]) < 1e-6 && Math.abs(e[1] - o[1]) < 1e-6 && Math.abs(e[2] - o[2]) < 1e-6, Aa = (e) => {
    const o = new Array(e.length).fill(false), s = [];
    for (let n = 0; n < e.length; n++) {
      if (o[n]) continue;
      o[n] = true;
      const a = [e[n][0], e[n][1]];
      let c = true;
      for (; c; ) {
        c = false;
        for (let l = 0; l < e.length; l++) {
          if (o[l]) continue;
          const [r, p] = e[l], d = a[a.length - 1], w = a[0];
          Qn(r, d) ? (a.push(p), o[l] = true, c = true) : Qn(p, d) ? (a.push(r), o[l] = true, c = true) : Qn(p, w) ? (a.unshift(r), o[l] = true, c = true) : Qn(r, w) && (a.unshift(p), o[l] = true, c = true);
        }
      }
      const i = a.length > 3 && Qn(a[0], a[a.length - 1]);
      i && a.pop(), s.push({ pts: a, cerrada: i });
    }
    return s;
  }, Zo = (e, o) => {
    let s = e.findIndex((n) => Math.abs(n[0] - o[0]) < 1e-3 && Math.abs(n[1] - o[1]) < 1e-3 && Math.abs(n[2] - o[2]) < 1e-3);
    return s < 0 && (s = e.length, e.push(o)), s;
  }, Fs = (e) => {
    if (!e.length) return 0;
    qe.clear(), e.forEach((s) => qe.add(s));
    const o = e.length;
    return Ho(), qe.clear(), o;
  };
  window.__hekatanRevolveSelection = (e, o, s, n = 360) => {
    var _a3, _b, _c;
    const a = Math.max(3, Math.round(s || 16)), c = Math.abs(n - 360) < 1e-9, i = a, l = c ? a : a + 1, { segs: r, auxIds: p } = Es();
    if (!r.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (c && a % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    Pt();
    const d = t.points.rawVal, w = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], f = [...d];
    let m = w.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const M = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], k = /* @__PURE__ */ new Map(), y = (T) => T.map((D) => Math.round(D * 1e4)).join(","), u = (T) => Math.hypot(T[0] - e, T[1] - o) < 1e-6, x = (T) => {
      const D = y(T);
      let B = k.get(D);
      if (B) return B;
      if (u(T)) return B = [Zo(f, T)], k.set(D, B), B;
      const W = Math.hypot(T[0] - e, T[1] - o), ne = Math.atan2(T[1] - o, T[0] - e);
      B = [];
      for (let ye = 0; ye < l; ye++) {
        const ke = ne + n * Math.PI / 180 * ye / a;
        B.push(Zo(f, ye === 0 ? T : [e + W * Math.cos(ke), o + W * Math.sin(ke), T[2]]));
      }
      return k.set(D, B), B;
    };
    let b = 0, F = false;
    const S = (T) => {
      M.push(m.length), m.push([...T, T[0]]), b++;
    };
    for (const [T, D] of r) {
      const B = x(T), W = x(D);
      if (!(B.length === 1 && W.length === 1)) {
        if (B.length === 1 || W.length === 1) {
          F = true;
          const ne = B.length === 1 ? B[0] : W[0], ye = B.length === 1 ? W : B;
          for (let ke = 0; ke + 2 <= i; ke += 2) S([ne, ye[ke % l], ye[(ke + 1) % l], ye[(ke + 2) % l]]);
          continue;
        }
        for (let ne = 0; ne < i; ne++) S([B[ne], W[ne], W[(ne + 1) % l], B[(ne + 1) % l]]);
      }
    }
    m.push([]), t.points.val = f, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = M);
    const A = Fs(p);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { anillos: k.size, areas: b, polo: F, guias: A };
  }, window.__hekatanLoftSelection = (e, o) => {
    var _a3, _b, _c;
    const { segs: s, auxIds: n } = Es(), a = Aa(s), c = (W) => W.pts.every((ne) => Math.abs(ne[2] - W.pts[0][2]) < 1e-6), i = a.find((W) => W.cerrada && c(W)), l = a.find((W) => !W.cerrada && W.pts.length >= 2 && !c(W));
    if (!i) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!l) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const r = i.pts, p = r.length, d = l.pts.slice();
    d[d.length - 1][2] < d[0][2] && d.reverse();
    let w = 0;
    for (let W = 0; W < p; W++) {
      const ne = r[W], ye = r[(W + 1) % p];
      w += ne[0] * ye[1] - ye[0] * ne[1];
    }
    const f = w > 0 ? 1 : -1, m = (W) => {
      const ne = r[(W - 1 + p) % p], ye = r[W], ke = r[(W + 1) % p], st = [ye[0] - ne[0], ye[1] - ne[1]], Ge = [ke[0] - ye[0], ke[1] - ye[1]], ot = Math.hypot(st[0], st[1]) || 1, Fe = Math.hypot(Ge[0], Ge[1]) || 1, je = [f * st[1] / ot, -f * st[0] / ot], Ye = [f * Ge[1] / Fe, -f * Ge[0] / Fe], Ce = 1 + (je[0] * Ye[0] + je[1] * Ye[1]);
      return [(je[0] + Ye[0]) / Math.max(Ce, 1e-6), (je[1] + Ye[1]) / Math.max(Ce, 1e-6)];
    }, M = r.map((W, ne) => m(ne)), k = d[0];
    let y = [0, 0], u = 0;
    for (const W of d) {
      const ne = W[0] - k[0], ye = W[1] - k[1], ke = Math.hypot(ne, ye);
      ke > u && (u = ke, y = [ne / ke, ye / ke]);
    }
    if (u < 1e-9) {
      const W = k[0] - e, ne = k[1] - o, ye = Math.hypot(W, ne) || 1;
      y = [W / ye, ne / ye];
    }
    y[0] * (k[0] - e) + y[1] * (k[1] - o) < 0 && (y = [-y[0], -y[1]]), Pt();
    const x = t.points.rawVal, b = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], F = [...x];
    let S = b.slice();
    S.length && S[S.length - 1].length === 0 && (S = S.slice(0, -1));
    const A = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], T = d.map((W) => {
      const ne = (W[0] - k[0]) * y[0] + (W[1] - k[1]) * y[1], ye = W[2];
      return r.map((ke, st) => Zo(F, [ke[0] + M[st][0] * ne, ke[1] + M[st][1] * ne, ye]));
    });
    let D = 0;
    for (let W = 0; W + 1 < T.length; W++) for (let ne = 0; ne < p; ne++) {
      const ye = [T[W][ne], T[W][(ne + 1) % p], T[W + 1][(ne + 1) % p], T[W + 1][ne]];
      new Set(ye).size < 4 || (A.push(S.length), S.push([...ye, ye[0]]), D++);
    }
    S.push([]), t.points.val = F, t.polylines && (t.polylines.val = S), t.areas && (t.areas.val = A);
    const B = Fs(n);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { contorno: p, perfil: d.length, areas: D, guias: B };
  }, window.__hekatanDrawSlabChaflan = (e, o, s = 1, n = 6, a = 6) => {
    const c = Math.min(e[0], o[0]), i = Math.max(e[0], o[0]), l = Math.min(e[1], o[1]), r = Math.max(e[1], o[1]), p = (e[2] + o[2]) / 2, d = i - c, w = r - l, f = Math.min(s, d / 2 - 0.01, w / 2 - 0.01);
    if (f <= 0) return;
    const m = t.points.rawVal.length, M = [], k = [], y = (u, x) => {
      M.push([u, x, p]), k.push(m + M.length - 1);
    };
    for (let u = 0; u <= a; u++) y(c + f + (d - 2 * f) * u / a, l);
    for (let u = 1; u <= n; u++) {
      const x = -Math.PI / 2 + Math.PI / 2 * u / n;
      y(i - f + f * Math.cos(x), l + f + f * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) y(i, l + f + (w - 2 * f) * u / a);
    for (let u = 1; u <= n; u++) {
      const x = 0 + Math.PI / 2 * u / n;
      y(i - f + f * Math.cos(x), r - f + f * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) y(i - f - (d - 2 * f) * u / a, r);
    for (let u = 1; u <= n; u++) {
      const x = Math.PI / 2 + Math.PI / 2 * u / n;
      y(c + f + f * Math.cos(x), r - f + f * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) y(c, r - f - (w - 2 * f) * u / a);
    for (let u = 1; u < n; u++) {
      const x = Math.PI + Math.PI / 2 * u / n;
      y(c + f + f * Math.cos(x), l + f + f * Math.sin(x));
    }
    if (k.push(m), go()) {
      bo(M, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...M], t.polylines) {
      const u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), k, []];
    }
  }, window.__hekatanDrawRect = (e, o) => {
    const s = t.points.rawVal.length, n = e[0], a = e[1], c = e[2], i = o[0], l = o[1], r = o[2];
    let p;
    if (Math.abs(c - r) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, l, c], [n, l, c]] : Math.abs(a - l) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, a, r], [n, a, r]] : p = [[n, a, c], [n, l, c], [n, l, r], [n, a, r]], t.points.val = [...t.points.rawVal, ...p], t.polylines) {
      const d = [s, s + 1, s + 2, s + 3, s], w = t.polylines.rawVal;
      t.polylines.val = [...w.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawRectArea = (e, o) => {
    var _a3;
    const s = t.points.rawVal.length, n = e[0], a = e[1], c = e[2], i = o[0], l = o[1], r = o[2];
    let p;
    if (Z && t.gridTarget) {
      const d = t.gridTarget.rawVal, w = new ao(...d.rotation), f = new $(1, 0, 0).applyEuler(w), m = new $(0, 1, 0).applyEuler(w), M = new $(...d.position), k = new $(n, a, c), y = new $(i, l, r), u = k.clone().sub(M).dot(f), x = k.clone().sub(M).dot(m), b = y.clone().sub(M).dot(f), F = y.clone().sub(M).dot(m), S = (A, T) => M.clone().addScaledVector(f, A).addScaledVector(m, T).toArray();
      p = [S(u, x), S(b, x), S(b, F), S(u, F)];
    } else Math.abs(c - r) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, l, c], [n, l, c]] : Math.abs(a - l) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, a, r], [n, a, r]] : p = [[n, a, c], [n, l, c], [n, l, r], [n, a, r]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...p], t.polylines) {
      const d = t.polylines.rawVal, w = d.length - 1, f = [s, s + 1, s + 2, s + 3, s];
      t.polylines.val = [...d.slice(0, -1), f, []], t.areas && (t.areas.val = [...t.areas.rawVal, w]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = t.points.rawVal, s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = (y) => y.map((u) => Math.round(u * 1e4) / 1e4).join(",");
    for (let y = 0; y < o.length; y++) {
      const u = a(o[y]), x = s.get(u);
      x === void 0 && s.set(u, y), n.set(y, x ?? y);
    }
    const c = e.map((y) => y.map((u) => n.get(u) ?? u)), i = /* @__PURE__ */ new Map(), l = (y, u) => {
      y !== u && ((i.get(y) ?? i.set(y, /* @__PURE__ */ new Set()).get(y)).add(u), (i.get(u) ?? i.set(u, /* @__PURE__ */ new Set()).get(u)).add(y));
    };
    for (const y of c) for (let u = 0; u + 1 < y.length; u++) l(y[u], y[u + 1]);
    const r = (y, u) => {
      var _a4;
      return !!((_a4 = i.get(y)) == null ? void 0 : _a4.has(u));
    }, p = /* @__PURE__ */ new Set(), d = [], w = [...i.keys()];
    for (const y of w) for (const u of i.get(y)) if (!(u < y)) {
      for (const x of i.get(u)) if (x !== y) for (const b of i.get(x)) {
        if (b === y || b === u || !r(b, y) || r(y, x) || r(u, b)) continue;
        const F = [y, u, x, b].slice().sort((S, A) => S - A).join("-");
        p.has(F) || (p.add(F), d.push([y, u, x, b]));
      }
    }
    for (const y of w) for (const u of i.get(y)) if (!(u < y)) for (const x of i.get(u)) {
      if (x === y || !r(x, y)) continue;
      const b = [y, u, x].slice().sort((F, S) => F - S).join("-");
      p.has(b) || (p.add(b), d.push([y, u, x]));
    }
    if (!d.length) return 0;
    const f = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], m = new Set(f.map((y) => [...new Set(c[y] ?? [])].sort((u, x) => u - x).join("-"))), M = [...c];
    let k = 0;
    for (const y of d) {
      const u = y.slice().sort((x, b) => x - b).join("-");
      m.has(u) || (m.add(u), M.push([...y, y[0]]), f.push(M.length - 1), k++);
    }
    if (k) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = M, t.areas && (t.areas.val = f);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      C();
    }
    return k;
  }, window.__hekatanMeshPolyArea = (e, o) => {
    var _a3;
    const s = e.length;
    if (s < 3) return 0;
    let n = 0, a = 0, c = 0;
    for (let Ce = 0; Ce < s; Ce++) {
      const Xe = e[Ce], He = e[(Ce + 1) % s];
      n += (Xe[1] - He[1]) * (Xe[2] + He[2]), a += (Xe[2] - He[2]) * (Xe[0] + He[0]), c += (Xe[0] - He[0]) * (Xe[1] + He[1]);
    }
    const i = Math.hypot(n, a, c) || 1;
    n /= i, a /= i, c /= i;
    let l = e[1][0] - e[0][0], r = e[1][1] - e[0][1], p = e[1][2] - e[0][2];
    const d = Math.hypot(l, r, p) || 1;
    l /= d, r /= d, p /= d;
    let w = a * p - c * r, f = c * l - n * p, m = n * r - a * l;
    const M = Math.hypot(w, f, m) || 1;
    w /= M, f /= M, m /= M;
    const k = e[0], y = (Ce) => [(Ce[0] - k[0]) * l + (Ce[1] - k[1]) * r + (Ce[2] - k[2]) * p, (Ce[0] - k[0]) * w + (Ce[1] - k[1]) * f + (Ce[2] - k[2]) * m], u = (Ce, Xe) => [k[0] + Ce * l + Xe * w, k[1] + Ce * r + Xe * f, k[2] + Ce * p + Xe * m], x = e.map(y);
    let b = 1 / 0, F = -1 / 0, S = 1 / 0, A = -1 / 0;
    for (const [Ce, Xe] of x) Ce < b && (b = Ce), Ce > F && (F = Ce), Xe < S && (S = Xe), Xe > A && (A = Xe);
    const T = F - b, D = A - S;
    if (T < 1e-6 || D < 1e-6) return 0;
    let B = o && o > 0 ? o : 0.5;
    for (; T / B * (D / B) > 2500; ) B *= 2;
    B = Math.min(B, Math.min(T, D));
    const W = (Ce, Xe) => {
      let He = false;
      for (let mt = 0, vt = x.length - 1; mt < x.length; vt = mt++) {
        const [Ft, on] = x[mt], [Wn, In] = x[vt];
        on > Xe != In > Xe && Ce < (Wn - Ft) * (Xe - on) / (In - on) + Ft && (He = !He);
      }
      return He;
    }, ne = Math.max(1, Math.round(T / B)), ye = Math.max(1, Math.round(D / B)), ke = T / ne, st = D / ye, Ge = /* @__PURE__ */ new Map(), ot = [], Fe = t.points.rawVal.length, je = (Ce, Xe) => {
      const He = Ce + "," + Xe, mt = Ge.get(He);
      if (mt !== void 0) return mt;
      const vt = Fe + ot.length;
      return ot.push(u(b + Ce * ke, S + Xe * st)), Ge.set(He, vt), vt;
    }, Ye = [];
    for (let Ce = 0; Ce < ne; Ce++) for (let Xe = 0; Xe < ye; Xe++) {
      if (!W(b + (Ce + 0.5) * ke, S + (Xe + 0.5) * st)) continue;
      const He = je(Ce, Xe), mt = je(Ce + 1, Xe), vt = je(Ce + 1, Xe + 1), Ft = je(Ce, Xe + 1);
      Ye.push([He, mt, vt, Ft]);
    }
    if (!Ye.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...ot], t.polylines && t.areas) {
      let Ce = t.polylines.rawVal.slice();
      Ce.length && Ce[Ce.length - 1].length === 0 && (Ce = Ce.slice(0, -1));
      const Xe = [];
      for (const He of Ye) Xe.push(Ce.length), Ce.push([He[0], He[1], He[2], He[3], He[0]]);
      Ce.push([]), t.polylines.val = Ce, t.areas.val = [...t.areas.rawVal, ...Xe];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), Ye.length;
  };
  const Mo = () => {
    if (nt.length < 3) return nt = [], Ie.visible = false, C(), 0;
    const e = window.__hekatanMeshPolyArea(nt.slice());
    return nt = [], Ie.visible = false, C(), e;
  };
  window.__hekatanFinalizePolyArea = Mo, window.__hekatanSetInclinedPlaneFrom3 = (e, o, s) => {
    var _a3;
    const n = new $(e[0], e[1], e[2]), a = new $(o[0], o[1], o[2]), c = new $(s[0], s[1], s[2]), i = new $().subVectors(a, n).cross(new $().subVectors(c, n));
    if (i.lengthSq() < 1e-9) return false;
    i.normalize();
    const l = new cs().setFromUnitVectors(new $(0, 0, 1), i), r = new ao().setFromQuaternion(l);
    t.gridTarget && (t.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [r.x, r.y, r.z] }), Z = true;
    const p = new $().addVectors(n, a).add(c).multiplyScalar(1 / 3), d = Math.max(n.distanceTo(a), n.distanceTo(c), a.distanceTo(c)) * 2.2 + 4, w = d / 2;
    Yt.geometry.dispose(), Yt.geometry = new Pn(d, d), It.geometry.dispose(), It.geometry = new ea(new Pn(d, d)), uo(w, 1), St.position.copy(p), St.quaternion.copy(l), St.scale.set(1, 1, 1), St.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), Z = false, St.visible = false, C();
  };
  const tn = new ut();
  tn.visible = false, g.add(tn), window.__hekatanShowAxes = (e, o, s = 12, n = 2) => {
    var _a3, _b;
    for (; tn.children.length; ) {
      const d = tn.children.pop();
      (_a3 = d.geometry) == null ? void 0 : _a3.dispose(), (_b = d.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !o.length) return;
    const a = Math.min(...o) - n, c = Math.max(...o) + n, i = Math.min(...e) - n, l = Math.max(...e) + n, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", p = (d, w, f, m, M) => {
      const k = document.createElement("canvas");
      k.width = 64, k.height = 32;
      const y = k.getContext("2d");
      y.fillStyle = M, y.font = "bold 22px sans-serif", y.textAlign = "center", y.fillText(d, 32, 26);
      const u = new ta(k), x = new na({ map: u, transparent: true }), b = new oa(x);
      return b.position.set(w, f, m), b.scale.set(1.2, 0.6, 1), b;
    };
    e.forEach((d, w) => {
      const f = w < r.length ? r[w] : `X${w}`, m = new Ae().setFromPoints([new $(d, a, 0), new $(d, c, 0), new $(d, a, 0), new $(d, a, s)]), M = new so({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Qt(m, M);
      k.computeLineDistances(), tn.add(k), tn.add(p(f, d, a - 0.5, 0, "#60a5fa")), tn.add(p(f, d, c + 0.5, 0, "#60a5fa"));
    }), o.forEach((d, w) => {
      const f = `${w + 1}`, m = new Ae().setFromPoints([new $(i, d, 0), new $(l, d, 0), new $(i, d, 0), new $(i, d, s)]), M = new so({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new Qt(m, M);
      k.computeLineDistances(), tn.add(k), tn.add(p(f, i - 0.5, d, 0, "#fb7185")), tn.add(p(f, l + 0.5, d, 0, "#fb7185"));
    }), tn.visible = true, C();
  }, window.__hekatanHideAxes = () => {
    tn.visible = false, C();
  };
  const bn = new ut();
  bn.visible = false, g.add(bn);
  let Xn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a3, _b;
    for (; bn.children.length; ) {
      const c = bn.children.pop();
      (_a3 = c.geometry) == null ? void 0 : _a3.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    Xn.forEach((c) => {
      g.remove(c), c.geometry.dispose(), c.material.dispose();
    }), Xn = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((c, i) => {
      const l = a[i % a.length], r = o / 2, p = [new $(s - r, n - r, c), new $(s + r, n - r, c), new $(s + r, n + r, c), new $(s - r, n + r, c), new $(s - r, n - r, c)], d = new Ae().setFromPoints(p), w = new ft({ color: l, transparent: true, opacity: 0.55 });
      bn.add(new $t(d, w));
      const f = document.createElement("canvas");
      f.width = 128, f.height = 32;
      const m = f.getContext("2d");
      m.fillStyle = `#${l.toString(16).padStart(6, "0")}`, m.font = "bold 18px sans-serif", m.fillText(`Z = ${c} m`, 4, 22);
      const M = new ta(f), k = new na({ map: M, transparent: true }), y = new oa(k);
      y.position.set(s - r - 1.5, n - r - 1.5, c), y.scale.set(2.5, 0.6, 1), bn.add(y);
      const u = new Pn(1e4, 1e4), x = new wt({ visible: false, side: Vt }), b = new ct(u, x);
      b.position.set(0, 0, c), b.frustumCulled = false, b.userData = { refPlaneZ: c }, g.add(b), Xn.push(b);
    }), bn.visible = true, C();
  }, window.__hekatanHideRefPlanes = () => {
    bn.visible = false, Xn.forEach((e) => {
      e.visible = false;
    }), C();
  };
  const jn = new ut();
  jn.frustumCulled = false, g.add(jn);
  const Ea = () => {
    var _a3, _b, _c, _d;
    for (; jn.children.length; ) {
      const s = jn.children.pop();
      (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new Ae().setFromPoints([new $(s[0], s[1], s[2]), new $(s[3], s[4], s[5])]), a = new so({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), c = new $t(n, a);
      c.computeLineDistances(), jn.add(c);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Ea(), C());
  });
  const Zn = new ut();
  Zn.frustumCulled = false, g.add(Zn);
  const $s = () => {
    var _a3, _b, _c, _d;
    for (; Zn.children.length; ) {
      const s = Zn.children.pop();
      (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new ct(new Hn(0.025, 12, 12), new wt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(mo(n.position)), Zn.add(n);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, $s(), C());
  }), _.addEventListener("change", () => {
    Zn.children.forEach((e) => {
      e.scale.setScalar(mo(e.position));
    });
  }), window.__hekatanRenderAuxPoints = $s;
  const bt = new ut(), Fa = new ct(new Hn(0.01, 12, 12), new wt({ color: 16777215, transparent: true, opacity: 0.95 })), Vs = new ct(new Hn(0.015, 12, 12), new wt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Vs.visible = false, bt.add(Fa, Vs);
  const Un = 0.08, Uo = (e, o, s) => {
    const n = new Ae().setFromPoints([new $(...e), new $(...o)]);
    return new $t(n, new ft({ color: s, transparent: true, opacity: 0.7 }));
  };
  bt.add(Uo([-Un, 0, 0], [Un, 0, 0], 16777215)), bt.add(Uo([0, -Un, 0], [0, Un, 0], 16777215)), bt.add(Uo([0, 0, -Un], [0, 0, Un], 16777215)), bt.visible = false, bt.frustumCulled = false, g.add(bt);
  let qo = 2;
  const vo = (e) => {
    const o = v(), s = (E == null ? void 0 : E.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(e) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, eo = () => {
    if (!bt.visible) return;
    const e = qo * vo(bt.position) / 0.015;
    bt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let kn = 10;
  const Ko = (e) => Math.max(1e-4, kn * vo(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (kn = e), kn), window.__hekatanUpdateSnapScale = eo, window.__hekatanSnapMarker = bt, window.__hekatanMetrosPorPixel = vo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (qo = e, eo(), C()), qo);
  const Ls = () => {
    mn.children.length !== 0 && mn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const o = e;
      o.scale.setScalar(mo(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Ls, _.addEventListener("change", () => {
    var _a3;
    eo(), jt.visible && ks(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), Ls();
  }), window.__hekatanShowSnap = (e, o, s) => {
    bt.position.set(e, o, s), bt.visible = true, eo(), C();
  }, window.__hekatanHideSnap = () => {
    bt.visible = false, C();
  }, E.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const o = Y(e);
    if (!o) return;
    V.setFromCamera(N, o), se = null;
    const s = Re();
    if ((!s.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && dt.visible && (dt.visible = false), s.length) {
      const n = s[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const m = Ht([n.x, n.y, n.z]);
        if (m) {
          const M = m.map((u) => t.points.rawVal[u]), k = [];
          for (let u = 1; u < M.length - 1; u++) k.push(M[0][0], M[0][1], M[0][2], M[u][0], M[u][1], M[u][2], M[u + 1][0], M[u + 1][1], M[u + 1][2]);
          const y = dt.geometry;
          y.setAttribute("position", new Lt(k, 3)), y.computeVertexNormals(), dt.visible = true;
        } else dt.visible = false;
      } else dt.visible && (dt.visible = false);
      const a = e.altKey;
      let c = false;
      const i = Ko(n), l = a ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, n.x, n.y, n.z, i, { x: e.clientX, y: e.clientY });
      if (l) So(l.type, l.x, l.y, l.z), bt.position.set(l.x, l.y, l.z), bt.visible = true, n.set(l.x, l.y, l.z), zo(l.type, e.clientX, e.clientY);
      else if (!a && (Se = be(e.clientX, e.clientY))) c = true, n.copy(Se), So("ifcSec", n.x, n.y, n.z), zo("ifcSec", e.clientX, e.clientY), bt.position.copy(n), bt.visible = true;
      else if (oe && !a) c = true, So(oe.tipo, n.x, n.y, n.z), zo(oe.tipo, e.clientX, e.clientY), bt.position.copy(n), bt.visible = true;
      else {
        Ia(), Po();
        const f = !a && window.__hekatanSnapEnabled !== false, m = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        f && m > 0 && (n.x = Math.round(n.x / m) * m, n.y = Math.round(n.y / m) * m, n.z = Math.round(n.z / m) * m), bt.position.copy(n), bt.visible = true;
      }
      eo(), U(se && !l && (c || oe) ? G(se) : null), Rt = { p: n.clone(), x: e.clientX, y: e.clientY };
      const r = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (r === "select" || !r) {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, m = Pa(n.x, n.y, n.z, f), M = Xo(n.x, n.y, n.z, f), k = Ss(n.x, n.y, n.z, f);
        if (m >= 0) {
          const b = t.points.rawVal[m];
          jt.position.set(b[0], b[1], b[2]), jt.visible = true, ks(), hn.visible = false, wn = { kind: "pt", a: m };
        } else if (M) {
          const b = t.points.rawVal, F = t.polylines.rawVal[M.polyIdx], S = b[F[M.segIdx]], A = b[F[M.segIdx + 1]];
          hn.geometry.setFromPoints([new $(S[0], S[1], S[2]), new $(A[0], A[1], A[2])]), hn.visible = true, jt.visible = false, wn = ((_m = (_l = t.areas) == null ? void 0 : _l.rawVal) == null ? void 0 : _m.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (k >= 0) {
          const F = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[k];
          F && (hn.geometry.setFromPoints([new $(F[0], F[1], F[2]), new $(F[3], F[4], F[5])]), hn.visible = true, jt.visible = false, wn = { kind: "aux", a: k });
        } else hn.visible = false, jt.visible = false, wn = null;
        Pe.style.left = e.clientX + "px", Pe.style.top = e.clientY + "px", Pe.style.display = "block";
        let y = n;
        if ((wn == null ? void 0 : wn.kind) === "pt") {
          const b = t.points.rawVal[wn.a];
          b && (y = new $(b[0], b[1], b[2]));
        }
        const u = `X=${y.x.toFixed(2)} Y=${y.y.toFixed(2)} Z=${y.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [y.x, y.y, y.z], wn) {
          const b = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Pe.textContent = `${u}  \xB7  \u{1F5B1} Click \u2192 ${b[wn.kind]}`;
        } else Pe.textContent = u;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = u), Rt = { p: y.clone(), x: e.clientX, y: e.clientY }, Ue.visible = false, Xt.visible = false, Zt.visible = false, C();
        return;
      }
      if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, m = Xo(n.x, n.y, n.z, f), M = Ss(n.x, n.y, n.z, f);
        let k = false;
        if (M >= 0) if (!m) k = true;
        else {
          const b = window.__hekatanDrawingAuxLines, S = ((b == null ? void 0 : b.rawVal) ?? (b == null ? void 0 : b.val) ?? b ?? [])[M];
          On(n.x, n.y, n.z, S[0], S[1], S[2], S[3], S[4], S[5]) < m.dist && (k = true);
        }
        k ? (_n = M, cn = -1, vn = -1, za(M)) : m ? (cn = m.polyIdx, vn = m.segIdx, _n = -1, Ca(m.polyIdx, m.segIdx)) : (cn = -1, vn = -1, _n = -1, qt.visible = false), Ue.visible = false, Xt.visible = false, Zt.visible = false, dn(), Pe.style.left = e.clientX + "px", Pe.style.top = e.clientY + "px", Pe.style.display = "block";
        const y = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let u = "";
        k ? u = `\u{1F5D1} l\xEDnea aux #${_n + 1}` : m ? u = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(m.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${m.polyIdx + 1}` : `\u{1F5D1} seg ${m.segIdx + 1} / poly #${m.polyIdx + 1}` : u = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Pe.textContent = `${y}  \xB7  ${u}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = y), C();
        return;
      } else qt.visible = false, cn = -1, _n = -1;
      Pe.style.left = e.clientX + "px", Pe.style.top = e.clientY + "px", Pe.style.display = "block";
      const p = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], d = p[p.length - 1] ?? [], w = t.points.rawVal ?? [];
      if (d.length > 0 && w[d[d.length - 1]]) {
        const f = d[d.length - 1], m = w[f];
        let M = zt;
        po = null;
        const k = !!l || c;
        if (!M && !k && window.__hekatanAxisSnap !== false) {
          const Ge = E.getBoundingClientRect(), ot = e.clientX, Fe = e.clientY, je = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Ye = new $(m[0], m[1], m[2]), Ce = [["x", new $(1, 0, 0)], ["y", new $(0, 1, 0)], ["z", new $(0, 0, 1)]], Xe = (mt) => {
            const vt = mt.clone().project(o);
            return { x: (vt.x * 0.5 + 0.5) * Ge.width + Ge.left, y: (-vt.y * 0.5 + 0.5) * Ge.height + Ge.top };
          };
          let He = null;
          for (const [mt, vt] of Ce) {
            const Ft = Xe(Ye.clone().addScaledVector(vt, -je)), on = Xe(Ye.clone().addScaledVector(vt, je)), Wn = on.x - Ft.x, In = on.y - Ft.y, qa = ot - Ft.x, Ka = Fe - Ft.y, Ga = Wn * Wn + In * In || 1;
            let Eo = (qa * Wn + Ka * In) / Ga;
            Eo = Math.max(0, Math.min(1, Eo));
            const Ws = Math.hypot(ot - (Ft.x + Eo * Wn), Fe - (Ft.y + Eo * In));
            if (He === null || Ws < He.dpx) {
              const ss = V.ray, Hs = Ye.clone().sub(ss.origin), as = vt.dot(ss.direction), Js = vt.dot(Hs), Wa = ss.direction.dot(Hs), Os = 1 - as * as, Ha = Math.abs(Os) < 1e-6 ? -Js : (as * Wa - Js) / Os;
              He = { axis: mt, dpx: Ws, pt: Ye.clone().addScaledVector(vt, Ha) };
            }
          }
          He && He.dpx <= 12 && (n.copy(He.pt), M = He.axis, po = He.pt.clone());
        }
        const y = !!window.__hekatanOrthoMode;
        if (!M && !k && y) {
          const Ge = Math.abs(n.x - m[0]), ot = Math.abs(n.y - m[1]), Fe = Math.abs(n.z - m[2]), je = (_s2 = s[0]) == null ? void 0 : _s2.object;
          let Ye = null;
          je === Ut ? Ye = "xy" : je === ln ? Ye = "xz" : je === rn && (Ye = "yz"), Ye === "xy" ? M = Ge >= ot ? "x" : "y" : Ye === "xz" ? M = Ge >= Fe ? "x" : "z" : Ye === "yz" ? M = ot >= Fe ? "y" : "z" : M = Ge >= ot && Ge >= Fe ? "x" : ot >= Fe ? "y" : "z";
        }
        const u = window.__hekatanPolarTrack !== false;
        if (!M && !k && u) {
          const Ge = n.x - m[0], ot = n.y - m[1], Fe = n.z - m[2], je = Math.hypot(Ge, ot, Fe);
          if (je > 1e-3) {
            const Ce = Math.tan(6 * Math.PI / 180) * je, Xe = Math.hypot(ot, Fe), He = Math.hypot(Ge, Fe), mt = Math.hypot(Ge, ot), vt = [["x", Xe], ["y", He], ["z", mt]];
            vt.sort((Ft, on) => Ft[1] - on[1]), vt[0][1] <= Ce && (M = vt[0][0]);
          }
        }
        if (M) {
          const Ge = m[0], ot = m[1], Fe = m[2];
          M === "x" ? n.set(n.x, ot, Fe) : M === "y" ? n.set(Ge, n.y, Fe) : n.set(Ge, ot, n.z);
          const je = !!zt, Ce = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          Bt.style.background = "rgba(15,23,42,0.92)", Bt.style.color = Ce, Bt.style.border = `1.5px solid ${Ce}`;
          const Xe = (_t2 = s[0]) == null ? void 0 : _t2.object;
          let He = null;
          Xe === Ut ? He = "xy" : Xe === ln ? He = "xz" : Xe === rn && (He = "yz");
          const mt = He ? ` (plano ${He.toUpperCase()})` : "";
          Bt.textContent = je ? `\u{1F512} LOCK ${M.toUpperCase()}${mt}` : `\u22A5 ORTO ${M.toUpperCase()}${mt}`, Bt.style.left = e.clientX + 20 + "px", Bt.style.top = e.clientY + 18 + "px", Bt.style.transform = "none", Bt.style.display = "block";
        } else zt || (Bt.style.display = "none");
        let x = null;
        if (!a && !k && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ge = t.points.rawVal, ot = M ? [M] : ["z", "x", "y"], Fe = { x: e.clientX, y: e.clientY };
          let je = 1 / 0;
          for (const Ye of Ge) if (!(Math.abs(Ye[0] - m[0]) < 1e-9 && Math.abs(Ye[1] - m[1]) < 1e-9 && Math.abs(Ye[2] - m[2]) < 1e-9)) for (const Ce of ot) {
            const Xe = new $(Ce === "x" ? Ye[0] : n.x, Ce === "y" ? Ye[1] : n.y, Ce === "z" ? Ye[2] : n.z), He = Vn(Xe.x, Xe.y, Xe.z);
            if (!He) continue;
            const mt = Math.hypot(He.x - Fe.x, He.y - Fe.y);
            mt < kn && mt < je && (je = mt, x = { q: Ye, eje: Ce });
          }
        }
        x ? (x.eje === "x" ? n.x = x.q[0] : x.eje === "y" ? n.y = x.q[1] : n.z = x.q[2], Zt.geometry.setFromPoints([new $(x.q[0], x.q[1], x.q[2]), new $(n.x, n.y, n.z)]), (_u = Zt.computeLineDistances) == null ? void 0 : _u.call(Zt), Zt.visible = true, bt.position.set(n.x, n.y, n.z), bt.visible = true, zo("track", e.clientX, e.clientY)) : Zt.visible = false, Rt = { p: n.clone(), x: e.clientX, y: e.clientY };
        const b = Math.hypot(n.x - m[0], n.y - m[1], n.z - m[2]), F = Math.atan2(n.y - m[1], n.x - m[0]) * 180 / Math.PI, S = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`, A = (F % 360 + 360) % 360;
        Pe.textContent = `L = ${b.toFixed(3)} m   \u2220 ${A.toFixed(1)}\xB0   \xB7   ${S}`;
        const T = document.getElementById("hk-coord-fixed");
        T && (T.textContent = S), Ue.geometry.setFromPoints([new $(m[0], m[1], m[2]), new $(n.x, n.y, n.z)]), (_v = Ue.computeLineDistances) == null ? void 0 : _v.call(Ue), Ue.visible = true, yt(m[0], m[1], m[2], n.x, n.y, n.z);
        const D = window.__hekatanOrthoExt ?? 8, B = window.__hekatanShowOrthoPlanes !== false;
        pn.visible = B, B || Ms(null), B && (gn(Dn, m, "xy", D), gn(En, m, "xz", D), gn(Nn, m, "yz", D), xn(Ut, m, "xy", D), xn(ln, m, "xz", D), xn(rn, m, "yz", D));
        const W = B ? V.intersectObjects([Ut, ln, rn], false) : [];
        let ne = null;
        if (W.length > 0) {
          const Ge = W[0].object;
          Ge === Ut ? ne = "xy" : Ge === ln ? ne = "xz" : Ge === rn && (ne = "yz");
        }
        Ms(ne), ne && (fn.style.left = e.clientX + "px", fn.style.top = e.clientY + "px"), un.geometry.setFromPoints([new $(m[0] - D, m[1], m[2]), new $(m[0] + D, m[1], m[2])]), (_w = un.computeLineDistances) == null ? void 0 : _w.call(un), Cn.geometry.setFromPoints([new $(m[0], m[1] - D, m[2]), new $(m[0], m[1] + D, m[2])]), (_x = Cn.computeLineDistances) == null ? void 0 : _x.call(Cn), An.geometry.setFromPoints([new $(m[0], m[1], m[2] - D), new $(m[0], m[1], m[2] + D)]), (_y = An.computeLineDistances) == null ? void 0 : _y.call(An), Xt.visible = true;
        const ye = un.material, ke = Cn.material, st = An.material;
        un.visible = M === "x", Cn.visible = M === "y", An.visible = M === "z", ye.opacity = 0.95, ke.opacity = 0.95, st.opacity = 0.95;
      } else {
        const f = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        Pe.textContent = f;
        const m = document.getElementById("hk-coord-fixed");
        if (m && (m.textContent = f), Ue.visible = false, Xt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if (Ne = null, lt = null, _e.style.left = e.clientX + 20 + "px", _e.style.top = e.clientY - 28 + "px", _e.style.display = "block", !Oe) {
            _e.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const k = document.activeElement;
            !(k && (k.tagName === "INPUT" || k.tagName === "TEXTAREA") && k !== _e) && document.activeElement !== _e && _e.focus({ preventScroll: true });
            try {
              _e.select();
            } catch {
            }
          }
        } else dn();
      }
      C();
    } else Po(), Pe.style.display = "none", bt.visible = false, Ue.visible = false, Xt.visible = false, dn(), C();
  }), ue.derive(() => {
    var _a3;
    if (!t.gridTarget) return;
    const e = new cs().setFromEuler(new ao(...t.gridTarget.val.rotation)), o = new cs().setFromAxisAngle(new $(1, 0, 0), Math.PI / 2);
    Ti(h, { position: new $(...t.gridTarget.val.position), quaternion: e.clone().multiply(o) }, C);
    {
      const n = t.gridTarget.val.position[2], a = Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const c of Jn) g.remove(c), Yo(c);
      if (Jn.length = 0, a) {
        const c = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], i = /* @__PURE__ */ new Set([0]);
        for (const r of c) i.add(+r[2].toFixed(3));
        for (const r of window.__hekatanLevels ?? []) isFinite(r == null ? void 0 : r.z) && i.add(+r.z.toFixed(3));
        const l = [...i].sort((r, p) => r - p).slice(0, 24);
        for (const r of l) {
          if (Math.abs(r - n) < 1e-6) continue;
          const p = h.clone(true);
          p.name = `hekatan-grid-nivel-${r}`, p.traverse((d) => {
            d.material && (d.material = d.material.clone(), d.material.transparent = true, d.material.opacity = (d.material.opacity ?? 1) * (Math.abs(r) < 1e-6 ? 0.5 : 0.22));
          }), p.position.set(0, 0, r), p.quaternion.copy(o), g.add(p), Jn.push(p);
        }
      }
    }
    j.position.set(...t.gridTarget.val.position), j.quaternion.setFromEuler(new ao(...t.gridTarget.val.rotation)), j.updateMatrixWorld();
    const s = new $(0, 0, 1).applyEuler(new ao(...t.gridTarget.val.rotation));
    Z = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), ue.derive(() => {
    Ee.geometry.setAttribute("position", new Lt(t.points.val.flat(), 3)), Ee.geometry.computeBoundingSphere();
  }), ue.derive(() => {
    const e = 0.05 * z * 0.5 * P.val;
    V.params.Points.threshold = 0.4 * e;
  }), ue.derive(() => {
    var _a3;
    const e = t.points.val ?? [], s = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], n = [];
    for (const c of s) {
      const [i, l, r] = e[c];
      n.push(i, l, r);
    }
    const a = new Ae();
    a.setAttribute("position", new Lt(n, 3)), Ze.geometry.dispose(), Ze.geometry = a;
  });
  let Go = false, Fn = 0;
  E.addEventListener("pointerdown", () => {
    Go = true;
  }), E.addEventListener("pointerup", () => {
    Go = false;
  }), E.addEventListener("pointermove", () => {
    Go && Fn++;
  });
  const Nt = document.createElement("div");
  Nt.id = "hk-window-select", Nt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Nt);
  let nn = null, to = false, Gt = null;
  const Wo = (e, o, s, n, a) => {
    a ? (Nt.style.borderColor = "#34d399", Nt.style.borderStyle = "dashed", Nt.style.background = "rgba(52, 211, 153, 0.10)") : (Nt.style.borderColor = "#22d3ee", Nt.style.borderStyle = "solid", Nt.style.background = "rgba(34, 211, 238, 0.10)"), Nt.style.left = Math.min(e, s) + "px", Nt.style.top = Math.min(o, n) + "px", Nt.style.width = Math.abs(s - e) + "px", Nt.style.height = Math.abs(n - o) + "px", Nt.style.display = "block";
  }, Is = (e, o, s, n, a) => {
    var _a3, _b, _c, _d;
    const c = Math.min(e, s), i = Math.max(e, s), l = Math.min(o, n), r = Math.max(o, n), p = s < e, d = E.getBoundingClientRect(), w = v();
    w.updateMatrixWorld();
    const f = (A) => {
      const T = new $(A[0], A[1], A[2]);
      return T.project(w), { x: d.left + (T.x * 0.5 + 0.5) * d.width, y: d.top + (-T.y * 0.5 + 0.5) * d.height };
    }, m = (A) => A.x >= c && A.x <= i && A.y >= l && A.y <= r, M = (A, T) => !(A.x < c && T.x < c || A.x > i && T.x > i || A.y < l && T.y < l || A.y > r && T.y > r);
    a || qe.clear();
    let k = 0;
    const y = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let A = 0; A < y.length; A++) {
      const T = y[A];
      T && m(f(T)) && (qe.add(`pt:${A}`), k++);
    }
    const u = (A, T) => p ? m(A) || m(T) || M(A, T) : m(A) && m(T), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], b = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let A = 0; A < x.length; A++) {
      const T = x[A];
      if (b.includes(A)) {
        let B;
        if (!p) B = T.every((W) => {
          const ne = y[W];
          return !!ne && m(f(ne));
        });
        else {
          B = false;
          for (let W = 0; W < T.length - 1; W++) {
            const ne = y[T[W]], ye = y[T[W + 1]];
            if (!(!ne || !ye) && u(f(ne), f(ye))) {
              B = true;
              break;
            }
          }
        }
        B && (qe.add(`poly:${A}`), k++);
      } else for (let B = 0; B < T.length - 1; B++) {
        const W = y[T[B]], ne = y[T[B + 1]];
        !W || !ne || u(f(W), f(ne)) && (qe.add(`seg:${A}:${B}`), k++);
      }
    }
    const S = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let A = 0; A < S.length; A++) {
      const T = S[A];
      if (!T || T.length !== 6) continue;
      const D = f([T[0], T[1], T[2]]), B = f([T[3], T[4], T[5]]);
      u(D, B) && (qe.add(`aux:${A}`), k++);
    }
    en(), le(k === 0 && !p ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${p ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${k} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${qe.size})`), Nt.style.display = "none";
  }, _o = () => {
    Gt && (Gt = null, Nt.style.display = "none", le("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = _o, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Gt && _o();
  });
  const Ho = () => {
    var _a3, _b, _c, _d;
    if (qe.size === 0) return false;
    const e = [...qe], o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, c = (a == null ? void 0 : a.rawVal) ?? [], i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
    for (const M of e) {
      const [k, ...y] = M.split(":");
      if (k === "pt") i.add(+y[0]);
      else if (k === "poly") l.add(+y[0]);
      else if (k === "seg") {
        const u = +y[0], x = +y[1];
        r.has(u) || r.set(u, /* @__PURE__ */ new Set()), r.get(u).add(x);
      } else k === "aux" && p.add(+y[0]);
    }
    let d = 0, w = [], f = [];
    const m = /* @__PURE__ */ new Map();
    for (let M = 0; M < s.length; M++) {
      if (l.has(M)) {
        d++;
        continue;
      }
      m.set(M, w.length);
      const k = r.get(M);
      if (k && k.size > 0) {
        let y = [];
        for (let u = 0; u < s[M].length; u++) y.push(s[M][u]), u < s[M].length - 1 && k.has(u) && (y.length >= 2 && w.push(y), y = [], d++);
        (y.length >= 2 || y.length === 1) && w.push(y);
      } else w.push([...s[M]]);
    }
    if (i.size > 0) {
      const M = [], k = /* @__PURE__ */ new Map();
      for (let u = 0; u < o.length; u++) {
        if (i.has(u)) {
          d++;
          continue;
        }
        k.set(u, M.length), M.push([...o[u]]);
      }
      const y = [];
      for (const u of w) {
        let x = [];
        for (const b of u) {
          const F = k.get(b);
          F === void 0 ? (x.length >= 2 && y.push(x), x = []) : x.push(F);
        }
        x.length >= 2 && y.push(x);
      }
      w = y, t.points.val = M;
    }
    for (const M of n) {
      const k = m.get(M);
      k !== void 0 && k < w.length && f.push(k);
    }
    if (t.polylines && (t.polylines.val = w), t.areas && (t.areas.val = f), p.size > 0 && a) {
      const M = c.filter((k, y) => !p.has(y));
      "val" in a ? a.val = M : window.__hekatanDrawingAuxLines = M, d += p.size;
    }
    qe.clear(), en();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return le(`\u{1F5D1} ${d} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Ho, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || qe.size !== 0 && (e.preventDefault(), Ho());
  });
  const Kt = document.createElement("div");
  Kt.id = "hk-properties-pane";
  const Ts = "hk-props-pane-pos";
  let no = null;
  try {
    const e = localStorage.getItem(Ts);
    e && (no = JSON.parse(e));
  } catch {
  }
  Kt.style.cssText = ["position:fixed", no ? `left:${no.left}px` : "left:14px", no ? `top:${no.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Kt);
  const $a = () => {
    const e = Kt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, c = 0;
    e.addEventListener("mousedown", (i) => {
      o = true, s = i.clientX, n = i.clientY;
      const l = Kt.getBoundingClientRect();
      a = l.left, c = l.top, Kt.style.transform = "none", Kt.style.left = `${a}px`, Kt.style.top = `${c}px`, i.preventDefault();
    }), window.addEventListener("mousemove", (i) => {
      if (!o) return;
      const l = i.clientX - s, r = i.clientY - n, p = Math.max(0, Math.min(window.innerWidth - 80, a + l)), d = Math.max(0, Math.min(window.innerHeight - 40, c + r));
      Kt.style.left = `${p}px`, Kt.style.top = `${d}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Ts, JSON.stringify({ left: parseFloat(Kt.style.left), top: parseFloat(Kt.style.top) }));
        } catch {
        }
      }
    });
  }, te = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Mt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ht = null;
  const Et = (e, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: o, prop: s, value: n } }));
  }, Va = () => {
    var _a3, _b;
    if (ht && (ht.dispose(), ht = null), qe.size === 0) {
      Kt.style.display = "none";
      return;
    }
    const e = [...qe], o = e.filter((w) => w.startsWith("pt:"));
    if (o.length === 1) {
      const w = +o[0].slice(3), m = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(w);
      m ? [te.Ux, te.Uy, te.Uz, te.Rx, te.Ry, te.Rz] = m.map(Boolean) : te.Ux = te.Uy = te.Uz = te.Rx = te.Ry = te.Rz = false;
      const k = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(w);
      k ? [te.Fx, te.Fy, te.Fz, te.Mx, te.My, te.Mz] = k : te.Fx = te.Fy = te.Fz = te.Mx = te.My = te.Mz = 0;
    }
    const s = e.filter((w) => w.startsWith("seg:")), n = e.filter((w) => w.startsWith("poly:")), a = e.filter((w) => w.startsWith("aux:")), c = o.length > 0, i = s.length > 0, l = n.length > 0, r = !c && !i && !l, p = [];
    o.length && p.push(`\u{1F535} ${o.length} nodo(s)`), s.length && p.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && p.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && p.push(`\u250A ${a.length} aux`);
    const d = `\u{1F3AF} ${qe.size} item(s) \u2014 ${p.join(", ")}`;
    ht = new ya({ container: Kt, title: d });
    {
      const w = ht.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      w.addBinding(Mt, "dx", { label: "\u0394x (m)", step: 0.1 }), w.addBinding(Mt, "dy", { label: "\u0394y (m)", step: 0.1 }), w.addBinding(Mt, "dz", { label: "\u0394z (m)", step: 0.1 }), w.addBinding(Mt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), w.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        le(k ? `\u29C9 Replicado \xD7${k} (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), w.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        le(k && (k.lineas || k.areas) ? `\u21D7 Extruido: ${k.lineas} barra(s), ${k.areas} pa\xF1o(s) (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m \xD7 ${Mt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const f = { vuelo: 1.5, losa: true, borde: true, ambos: true }, m = w.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      m.addBinding(f, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), m.addBinding(f, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), m.addBinding(f, "borde", { label: "con viga de borde" }), m.addBinding(f, "ambos", { label: "a los dos lados" }), m.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, f.vuelo, { losa: f.losa, vigaBorde: f.borde, lados: f.ambos ? "ambos" : "afuera" });
        le(k ? `\u2310 Volado de ${f.vuelo} m en ${k} pa\xF1o(s)` + (f.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), w.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, 1);
        le(k ? `\u2192 Copia desplazada \u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const M = w.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      M.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a4;
        return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
      }), M.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), le(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (c) {
      const w = ht.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      w.addBinding(te, "Ux"), w.addBinding(te, "Uy"), w.addBinding(te, "Uz"), w.addBinding(te, "Rx"), w.addBinding(te, "Ry"), w.addBinding(te, "Rz");
      const f = (u, x) => {
        [te.Ux, te.Uy, te.Uz, te.Rx, te.Ry, te.Rz] = u;
        try {
          ht.refresh();
        } catch {
        }
        Et("nodes", o, "supports", u), le(`\u2713 ${x}: ${o.length} nudo(s) apoyado(s) (${u.map((b, F) => b ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][F] : "").filter(Boolean).join(" ")}).`);
      };
      w.addButton({ title: `\u25B2 Empotrar los ${o.length} nudo(s) (6 GDL)` }).on("click", () => f([true, true, true, true, true, true], "Empotrado")), w.addButton({ title: `\u25B3 Articular los ${o.length} nudo(s) (Ux Uy Uz)` }).on("click", () => f([true, true, true, false, false, false], "Articulado"));
      const m = ht.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      m.addBinding(te, "Kx", { label: "Kx", min: 0, step: 100 }), m.addBinding(te, "Ky", { label: "Ky", min: 0, step: 100 }), m.addBinding(te, "Kz", { label: "Kz", min: 0, step: 100 }), m.addBinding(te, "Krx", { label: "Krx", min: 0, step: 1e3 }), m.addBinding(te, "Kry", { label: "Kry", min: 0, step: 1e3 }), m.addBinding(te, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const M = ht.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      M.addBinding(te, "Fx", { step: 0.1 }), M.addBinding(te, "Fy", { step: 0.1 }), M.addBinding(te, "Fz", { step: 0.1 }), M.addBinding(te, "Mx", { step: 0.1 }), M.addBinding(te, "My", { step: 0.1 }), M.addBinding(te, "Mz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(te, "mass", { label: "m", min: 0, step: 1 }), ht.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(te, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ht.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let u = 0;
        const x = [te.Ux, te.Uy, te.Uz, te.Rx, te.Ry, te.Rz];
        x.some((S) => S) && (Et("nodes", o, "supports", x), u++);
        const b = [te.Fx, te.Fy, te.Fz, te.Mx, te.My, te.Mz];
        b.some((S) => S !== 0) && (Et("nodes", o, "loads", b), u++);
        const F = [te.Kx, te.Ky, te.Kz, te.Krx, te.Kry, te.Krz];
        if (F.some((S) => S !== 0) && (Et("nodes", o, "springs", F), u++), te.mass !== 0 && (Et("nodes", o, "mass", te.mass), u++), te.diaphragm !== "Ninguno" && (Et("nodes", o, "diaphragm", te.diaphragm), u++), u === 0) {
          le("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let S = document.getElementById("hk-prop-toast");
          S || (S = document.createElement("div"), S.id = "hk-prop-toast", S.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(S)), S.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", S.style.background = "rgba(217,119,6,0.97)", S.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            S && (S.style.opacity = "0");
          }, 3200);
        } else le(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (i) {
      const w = ht.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      w.addBinding(te, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), w.addBinding(te, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const f = ht.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      f.addBinding(te, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), f.addBinding(te, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), f.addBinding(te, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), f.addBinding(te, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ht.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(te, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ht.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(te, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const k = ht.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      k.addBinding(te, "relMxI", { label: "Mx I" }), k.addBinding(te, "relMyI", { label: "My I" }), k.addBinding(te, "relMzI", { label: "Mz I" });
      const y = ht.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      y.addBinding(te, "relMxJ", { label: "Mx J" }), y.addBinding(te, "relMyJ", { label: "My J" }), y.addBinding(te, "relMzJ", { label: "Mz J" }), ht.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(te, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const x = ht.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      x.addBinding(te, "LKx", { label: "LKx", min: 0, step: 100 }), x.addBinding(te, "LKy", { label: "LKy", min: 0, step: 100 }), x.addBinding(te, "LKz", { label: "LKz", min: 0, step: 100 });
      const b = ht.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      b.addBinding(te, "qx", { step: 0.1 }), b.addBinding(te, "qy", { step: 0.1 }), b.addBinding(te, "qz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(te, "massPerM", { label: "m/L", min: 0, step: 1 }), ht.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Et("segs", s, "section", te.section), Et("segs", s, "material", te.material_frame);
        const S = { A: te.A_mod, Iz: te.Iz_mod, Iy: te.Iy_mod, J: te.J_mod };
        (S.A !== 1 || S.Iz !== 1 || S.Iy !== 1 || S.J !== 1) && Et("segs", s, "modifiers", S), te.insertionPoint !== "10 \u2014 Centroid" && Et("segs", s, "insertionPoint", te.insertionPoint), te.beta !== 0 && Et("segs", s, "beta", te.beta);
        const A = [te.relMxI, te.relMyI, te.relMzI], T = [te.relMxJ, te.relMyJ, te.relMzJ];
        (A.some((W) => W) || T.some((W) => W)) && Et("segs", s, "releases", { i: A, j: T }), te.hinges !== "None" && Et("segs", s, "hinges", te.hinges);
        const D = [te.LKx, te.LKy, te.LKz];
        D.some((W) => W !== 0) && Et("segs", s, "lineSprings", D);
        const B = [te.qx, te.qy, te.qz];
        B.some((W) => W !== 0) && Et("segs", s, "distLoad", B), te.massPerM !== 0 && Et("segs", s, "massPerM", te.massPerM), le(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (l) {
      const w = ht.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      w.addBinding(te, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), w.addBinding(te, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), w.addBinding(te, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ht.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(te, "surfLoad", { label: "q", step: 0.1 }), ht.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Et("areas", n, "shellType", te.shellType), Et("areas", n, "thickness", te.thickness), Et("areas", n, "material", te.material_shell), te.surfLoad !== 0 && Et("areas", n, "surfLoad", te.surfLoad), le(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (r) {
      const w = ht.addFolder({ title: "\u2139 Selecci\xF3n" }), f = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      w.addBinding(f, "msg", { readonly: true, label: "" });
    }
    ht.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      qe.clear(), en();
    }), Kt.style.display = "block", $a();
  };
  window.__hekatanRefreshPropsPane = Va;
  let qn = null, ko = false;
  E.addEventListener("pointerdown", (e) => {
    e.button === 2 && (qn = { x: e.clientX, y: e.clientY }, ko = false);
  }), E.addEventListener("pointermove", (e) => {
    if (qn && e.buttons & 2 && !ko) {
      const o = e.clientX - qn.x, s = e.clientY - qn.y;
      Math.hypot(o, s) > 8 && (ko = true);
    }
  }), E.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const o = qn !== null && !ko;
      qn = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Gt ? _o() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), qe.size > 0 && (qe.clear(), en()), t.polylines) {
          const c = t.polylines.rawVal;
          (c[c.length - 1] ?? []).length > 0 && (t.polylines.val = [...c, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), le(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : le("\u238B Cancelado (click derecho)");
      }
    }
  }), E.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), E.addEventListener("pointerdown", (e) => {
    var _a3, _b, _c;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (nn = null, to = false));
  }), E.addEventListener("pointermove", (e) => {
    if (Gt && e.buttons === 0) {
      const c = e.clientX < Gt.x;
      Wo(Gt.x, Gt.y, e.clientX, e.clientY, c);
      return;
    }
    if (!nn) return;
    const o = e.clientX - nn.x, s = e.clientY - nn.y, n = Math.hypot(o, s);
    if (!to && n < 8) return;
    to = true;
    const a = e.clientX < nn.x;
    Wo(nn.x, nn.y, e.clientX, e.clientY, a);
  }), E.addEventListener("pointerup", (e) => {
    if (!nn) return;
    if (!to) {
      nn = null;
      return;
    }
    const o = e.ctrlKey || e.metaKey || e.shiftKey;
    Is(nn.x, nn.y, e.clientX, e.clientY, o), nn = null, to = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Ot = new ut();
  Ot.visible = false, Ot.frustumCulled = false, g.add(Ot);
  const Rs = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, So = (e, o, s, n) => {
    var _a3, _b, _c, _d;
    for (; Ot.children.length; ) {
      const i = Ot.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Rs[e] ?? 16777215, c = new Ae().setFromPoints([new $(-1, -1, 0), new $(1, -1, 0), new $(1, -1, 0), new $(1, 1, 0), new $(1, 1, 0), new $(-1, 1, 0), new $(-1, 1, 0), new $(-1, -1, 0)]);
    Ot.add(new Qt(c, new ft({ color: a, linewidth: 2 }))), Ot.position.set(o, s, n), Ot.visible = true, Oo();
  };
  let Jo = 4;
  const Oo = () => {
    Ot.visible && Ot.scale.setScalar(Jo * vo(Ot.position));
  };
  window.__hekatanOsnapMarkerRef = Ot, window.__hekatanUpdateOsnapScale = Oo, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (Jo = e, Oo(), C()), Jo);
  const Po = () => {
    Ot.visible = false;
  }, La = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, yn = document.createElement("div");
  yn.id = "hk-osnap-etiqueta", yn.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(yn);
  const zo = (e, o, s) => {
    const n = La[e];
    if (!n) {
      yn.style.display = "none";
      return;
    }
    yn.textContent = n, yn.style.color = "#" + (Rs[e] ?? 16777215).toString(16).padStart(6, "0"), yn.style.left = o + 18 + "px", yn.style.top = s - 26 + "px", yn.style.display = "block";
  }, Ia = () => {
    yn.style.display = "none";
  }, $n = new $(), Vn = (e, o, s) => {
    const n = v();
    if (!n) return null;
    const a = E.getBoundingClientRect();
    return $n.set(e, o, s).project(n), !isFinite($n.x) || !isFinite($n.y) || $n.z < -1 || $n.z > 1 ? null : { x: a.left + ($n.x * 0.5 + 0.5) * a.width, y: a.top + (-$n.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = Vn;
  const Ta = (e, o, s, n, a) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const c = window.__hekatanOsnap, i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let r = null;
    const p = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, d = a, w = (u, x, b, F) => {
      let S;
      if (d) {
        const T = Vn(x, b, F);
        if (!T || (S = Math.hypot(T.x - d.x, T.y - d.y), S > kn)) return;
      } else if (S = Math.hypot(x - e, b - o, F - s), S > n) return;
      const A = p[u] ?? 9;
      (!r || A < r.r || A === r.r && S < r.d) && (r = { type: u, x, y: b, z: F, d: S, r: A });
    };
    if (c.ori !== false && w("ori", 0, 0, 0), c.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, x = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, b = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, F = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", S = (T) => Math.round(T / x) * x, A = (T, D) => Math.abs(T) <= b + 1e-9 && Math.abs(D) <= b + 1e-9;
      if (F === "xz") {
        const T = S(e), D = S(s);
        A(T, D) && w("grid", T, o, D);
      } else if (F === "yz") {
        const T = S(o), D = S(s);
        A(T, D) && w("grid", e, T, D);
      } else {
        const T = S(e), D = S(o);
        A(T, D) && w("grid", T, D, s);
      }
    }
    (c.node || c.end) && i.forEach((u) => {
      c.node && w("node", u[0], u[1], u[2]);
    });
    for (const u of l) if (!(u.length < 2)) for (let x = 0; x < u.length - 1; x++) {
      const b = i[u[x]], F = i[u[x + 1]];
      if (!(!b || !F) && (c.end && (w("end", b[0], b[1], b[2]), w("end", F[0], F[1], F[2])), c.mid && w("mid", (b[0] + F[0]) / 2, (b[1] + F[1]) / 2, (b[2] + F[2]) / 2), c.nea || c.per)) {
        const S = F[0] - b[0], A = F[1] - b[1], T = F[2] - b[2], D = S * S + A * A + T * T;
        if (D < 1e-12) continue;
        const B = Math.max(0, Math.min(1, ((e - b[0]) * S + (o - b[1]) * A + (s - b[2]) * T) / D)), W = b[0] + B * S, ne = b[1] + B * A, ye = b[2] + B * T;
        c.nea && w("nea", W, ne, ye), c.per && w("per", W, ne, ye);
      }
    }
    if (c.cen) {
      const u = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const x of u) {
        const b = l[x];
        if (!b || b.length < 3) continue;
        const F = b[0] === b[b.length - 1] ? b.slice(0, -1) : b;
        let S = 0, A = 0, T = 0, D = 0;
        for (const B of F) {
          const W = i[B];
          W && (S += W[0], A += W[1], T += W[2], D++);
        }
        D >= 3 && w("cen", S / D, A / D, T / D);
      }
    }
    if (c.cen) {
      const u = As(), x = [...xo];
      for (const b of u) x.some((F) => Math.hypot(F.c[0] - b.c[0], F.c[1] - b.c[1], F.c[2] - b.c[2]) < 1e-6 && Math.abs(F.r - b.r) < 1e-6) || x.push(b);
      for (const b of x) {
        if (!i.some((A) => Math.abs(Math.hypot(A[0] - b.c[0], A[1] - b.c[1], A[2] - b.c[2]) - b.r) < 1e-6)) continue;
        const S = Math.hypot(e - b.c[0], o - b.c[1], s - b.c[2]);
        if (S < n || Math.abs(S - b.r) < n) {
          const A = Math.min(S, n * 0.5), T = 3;
          (!r || T < r.r || T === r.r && A < r.d) && (r = { type: "cen", x: b.c[0], y: b.c[1], z: b.c[2], d: A, r: T });
        }
      }
    }
    if (c.int) {
      const u = [];
      for (const x of l) for (let b = 0; b < x.length - 1; b++) {
        const F = i[x[b]], S = i[x[b + 1]];
        if (!F || !S) continue;
        const A = S[0] - F[0], T = S[1] - F[1], D = S[2] - F[2], B = A * A + T * T + D * D;
        if (B < 1e-12) continue;
        const W = Math.max(0, Math.min(1, ((e - F[0]) * A + (o - F[1]) * T + (s - F[2]) * D) / B));
        Math.hypot(F[0] + W * A - e, F[1] + W * T - o, F[2] + W * D - s) < 3 * n && u.push([F, S]);
      }
      for (let x = 0; x < u.length; x++) for (let b = x + 1; b < u.length; b++) {
        const [F, S] = u[x], [A, T] = u[b], D = [S[0] - F[0], S[1] - F[1], S[2] - F[2]], B = [T[0] - A[0], T[1] - A[1], T[2] - A[2]], W = [F[0] - A[0], F[1] - A[1], F[2] - A[2]], ne = D[0] * D[0] + D[1] * D[1] + D[2] * D[2], ye = D[0] * B[0] + D[1] * B[1] + D[2] * B[2], ke = B[0] * B[0] + B[1] * B[1] + B[2] * B[2], st = D[0] * W[0] + D[1] * W[1] + D[2] * W[2], Ge = B[0] * W[0] + B[1] * W[1] + B[2] * W[2], ot = ne * ke - ye * ye;
        if (ot < 1e-12) continue;
        const Fe = (ye * Ge - ke * st) / ot, je = (ne * Ge - ye * st) / ot;
        if (Fe < -1e-6 || Fe > 1 + 1e-6 || je < -1e-6 || je > 1 + 1e-6) continue;
        const Ye = [F[0] + Fe * D[0], F[1] + Fe * D[1], F[2] + Fe * D[2]], Ce = [A[0] + je * B[0], A[1] + je * B[1], A[2] + je * B[2]];
        if (Math.hypot(Ye[0] - Ce[0], Ye[1] - Ce[1], Ye[2] - Ce[2]) > 1e-4) continue;
        [F, S, A, T].some((He) => Math.hypot(He[0] - Ye[0], He[1] - Ye[1], He[2] - Ye[2]) < 1e-6) || w("int", Ye[0], Ye[1], Ye[2]);
      }
    }
    const f = window.__hekatanAxisGrids ?? [], m = window.__hekatanLevels ?? [], M = f.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, x] of M) {
      c.end && (w("end", u[0], u[1], u[2]), w("end", x[0], x[1], x[2]));
      const b = x[0] - u[0], F = x[1] - u[1], S = x[2] - u[2], A = b * b + F * F + S * S;
      if (A < 1e-12) continue;
      const T = Math.max(0, Math.min(1, ((e - u[0]) * b + (o - u[1]) * F + (s - u[2]) * S) / A));
      if (c.nea && w("nea", u[0] + T * b, u[1] + T * F, u[2] + T * S), c.int && Math.abs(S) > 1e-9) for (const D of m) {
        const B = (D.z - u[2]) / S;
        B < -1e-6 || B > 1 + 1e-6 || w("int", u[0] + B * b, u[1] + B * F, D.z);
      }
    }
    if (c.int || c.node) for (let u = 0; u < M.length; u++) for (let x = u + 1; x < M.length; x++) {
      const [b, F] = M[u], [S, A] = M[x], T = F[0] - b[0], D = F[1] - b[1], B = A[0] - S[0], W = A[1] - S[1], ne = T * W - D * B;
      if (Math.abs(ne) < 1e-12) continue;
      const ye = b[0] - S[0], ke = b[1] - S[1], st = (B * ke - W * ye) / ne, Ge = (T * ke - D * ye) / ne;
      if (st < -1e-6 || st > 1 + 1e-6 || Ge < -1e-6 || Ge > 1 + 1e-6) continue;
      const ot = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      w("int", b[0] + st * T, b[1] + st * D, typeof ot == "number" ? ot : s);
    }
    const k = window.__hekatanDrawingAuxLines, y = (k == null ? void 0 : k.rawVal) ?? (k == null ? void 0 : k.val) ?? k ?? [];
    for (const u of y) {
      if (u.length !== 6) continue;
      const x = [u[0], u[1], u[2]], b = [u[3], u[4], u[5]];
      if (c.end && (w("end", x[0], x[1], x[2]), w("end", b[0], b[1], b[2])), c.mid && w("mid", (x[0] + b[0]) / 2, (x[1] + b[1]) / 2, (x[2] + b[2]) / 2), c.nea || c.per) {
        const F = b[0] - x[0], S = b[1] - x[1], A = b[2] - x[2], T = F * F + S * S + A * A;
        if (T < 1e-12) continue;
        const D = Math.max(0, Math.min(1, ((e - x[0]) * F + (o - x[1]) * S + (s - x[2]) * A) / T)), B = x[0] + D * F, W = x[1] + D * S, ne = x[2] + D * A;
        c.nea && w("nea", B, W, ne), c.per && w("per", B, W, ne);
      }
    }
    return r ? { type: r.type, x: r.x, y: r.y, z: r.z } : null;
  }, Kn = new ut();
  Kn.frustumCulled = false, g.add(Kn);
  const Bs = new ft({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Ds = 0;
  const Ns = () => {
    var _a3, _b;
    for (const e of Kn.children.slice()) Kn.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (e) => {
    var _a3, _b;
    Ns();
    const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of e || []) {
      const c = String(a).split(":");
      let i = [];
      if (c[0] === "pt") {
        const p = o[+c[1]];
        p && (i = [p, [p[0] + 1e-3, p[1], p[2]]]);
      } else if (c[0] === "seg") {
        const p = s[+c[1]] || [], d = o[p[+c[2]]], w = o[p[+c[2] + 1]];
        d && w && (i = [d, w]);
      } else c[0] === "poly" && (i = (s[+c[1]] || []).map((d) => o[d]).filter(Boolean));
      if (i.length < 2) continue;
      const l = new Ae().setFromPoints(i.map((p) => new $(p[0], p[1], p[2]))), r = new $t(l, Bs);
      r.renderOrder = 1200, Kn.add(r);
    }
    if (!Kn.children.length) return;
    Ds = performance.now() + 900;
    const n = () => {
      const a = Ds - performance.now();
      if (a <= 0) {
        Ns(), C();
        return;
      }
      Bs.opacity = Math.min(1, a / 900) * 0.95, C(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a3;
    const o = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Ta, window.__hekatanOsnapShow = So, window.__hekatanOsnapHide = Po;
  let Ke = [], Ct = 0, Ln = 0, Dt = null;
  const oo = document.createElement("div");
  oo.id = "hk-cad-status", oo.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", oo.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(oo);
  const Ra = () => {
    var _a3, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), zt && e.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
    const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && e.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, le = (e) => {
    var _a3;
    const o = e + Ra();
    oo.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, Ba = "Comando:", Da = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Ke.length, a = (c, i = []) => ({ txt: c, ops: i });
    switch (e) {
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
        return a(`\xC1REA LIBRE Precise v\xE9rtice ${nt.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return a("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return a(`REGLA ${pt.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
      case "rect":
        return a(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return a(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return a(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "parabola":
        return a(`PAR\xC1BOLA Precise punto ${n + 1} de 3 (pasa por los tres):`);
      case "cubica":
        return a(`C\xDABICA Precise punto ${n + 1} de 4 (pasa por los cuatro):`);
      case "revolve":
        return a("REVOLUCI\xD3N Precise un punto del eje vertical (Z) alrededor del que gira la selecci\xF3n:");
      case "loft":
        return a("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
      case "col":
        return a(`COLUMNA Precise punto de inserci\xF3n (altura ${Ct > 0 ? Ct : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return a(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${Ct > 0 ? Ct : 3} m; teclee otra + Enter):`);
      case "plane3":
        return a(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return a("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return a("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return a(Dt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(Dt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(Dt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Ln > 0 ? ` (distancia ${Ln} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return qe.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return qe.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return qe.size ? a(`SELECCI\xD3N ${qe.size} objeto${qe.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(Ba);
    }
  }, Wt = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const e = Da(), o = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !o && !s ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Wt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", o = e.split("   |   ")[0] ?? e;
    le(o);
  }, window.__hekatanCadResetPending = () => {
    Ke = [], nt = [], Ie.visible = false, Qo(), Dt = null, C(), le("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Wt();
  };
  function Qo() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((o) => o.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = Qo;
  const Gn = [], Co = [], Na = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, jo = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])), x: Na() };
  }, Ys = (e) => {
    var _a3;
    if (t.points.val = e.p, t.polylines && (t.polylines.val = e.l), t.areas && (t.areas.val = e.a), e.x) {
      const o = window.__hekatanDrawingAuxLines;
      o && "val" in o && (o.val = e.x);
    }
    Ke = [], Ue.visible = false, Xt.visible = false, dn();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C(), Wt();
  }, Pt = () => {
    Gn.push(jo()), Gn.length > 100 && Gn.shift(), Co.length = 0;
  }, Ao = () => {
    const e = Gn.pop();
    if (!e) {
      le("\u21B6 Nada para deshacer");
      return;
    }
    Co.push(jo()), Ys(e), le(`\u21B6 Deshacer \u2014 quedan ${Gn.length}`);
  }, Xs = () => {
    const e = Co.pop();
    if (!e) {
      le("\u21B7 Nada para rehacer");
      return;
    }
    Gn.push(jo()), Ys(e), le(`\u21B7 Rehacer \u2014 quedan ${Co.length}`);
  };
  window.__hekatanPushUndo = Pt, window.__hekatanUndo = Ao, window.__hekatanRedo = Xs, document.addEventListener("keydown", (e) => {
    var _a3;
    const o = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (o === "y" || o === "z" && e.shiftKey))) return;
    const n = e.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a3 = n.value) == null ? void 0 : _a3.length) ?? 0) > 0 && n.__hkSucio || (e.preventDefault(), e.stopPropagation(), Xs());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a3, _b, _c, _d, _e2;
    const o = e.trim().toLowerCase(), s = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const n = t.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Ao(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return le("Cerrar necesita al menos tres puntos."), true;
      Pt(), t.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return es(), le(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Ao(), true;
      Pt();
      const c = a[a.length - 1], i = a.slice(0, -1), l = n.some((d, w) => w !== n.length - 1 && d.includes(c)) || i.includes(c);
      let r = t.points.rawVal, p = [...n.slice(0, -1), i];
      if (!l && c === r.length - 1 && (r = r.slice(0, -1), t.points.val = r), t.polylines.val = p, i.length) {
        const d = r[i[i.length - 1]];
        d && (Ne = [d[0], d[1], d[2]]);
      } else Ne = null, Ue.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return C(), le(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${i.length}.`), Wt(), true;
    }
    return false;
  }, document.addEventListener("input", (e) => {
    const o = e.target;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && (o.__hkSucio = true);
  }, { capture: true }), document.addEventListener("focusout", (e) => {
    const o = e.target;
    o && (o.__hkSucio = false);
  }, { capture: true }), document.addEventListener("keydown", (e) => {
    var _a3;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
      const o = e.target, s = o == null ? void 0 : o.tagName;
      if ((s === "INPUT" || s === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a3 = o.value) == null ? void 0 : _a3.length) > 0 && !!o.__hkSucio) return;
      e.preventDefault(), e.stopPropagation(), Ao();
    }
  }, { capture: true });
  const es = () => {
    Ke = [], Dt = null, Qo(), zt = null, vs(), Ue.visible = false, Xt.visible = false, dn(), le("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), C(), Wt();
  };
  window.__hekatanFinalizeDraw = es;
  const Zs = () => {
    var _a3, _b, _c;
    Ke = [], nt = [], Ie.visible = false;
    let e = false;
    qe.size && (qe.clear(), en(), e = true), es();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    le(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), C(), Wt();
  };
  window.__hekatanEscapeCancel = Zs;
  const Us = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return qe.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (e[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = e[+n[1]] || [], c = a[+n[2]], i = a[+n[2] + 1];
        c != null && o.add(c), i != null && o.add(i);
      }
    }), o;
  }, qs = (e, o, s) => {
    var _a3;
    const n = Us();
    if (!n.size) return 0;
    Pt();
    const a = t.points.rawVal.map((c, i) => n.has(i) ? [c[0] + e, c[1] + o, c[2] + s] : c);
    t.points.val = a;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return en(), C(), n.size;
  };
  window.__hekatanMoveSelection = qs;
  const Ks = (e, o) => {
    var _a3, _b, _c, _d, _e2;
    if (!qe.size) {
      le(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Wt();
      return;
    }
    if (Ke.push(o), Ke.length === 1) {
      Ne = o, le(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Wt();
      return;
    }
    const [s, n] = Ke, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Ke = [], Ue.visible = false;
    let c = 0;
    e === "move" ? c = qs(a[0], a[1], a[2]) : (c = Us().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), le(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${c} nudo${c === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), e === "move" && (qe.clear(), en()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Wt();
  };
  window.__hekatanPasoMoverCopiar = Ks;
  const Ya = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Sn = (e, o) => Math.hypot(e[0] - o[0], e[1] - o[1], e[2] - o[2]), ts = (e, o, s, n, a, c) => {
    const i = [o[0] - e[0], o[1] - e[1], o[2] - e[2]], l = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], r = [e[0] - s[0], e[1] - s[1], e[2] - s[2]], p = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], d = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], w = l[0] * l[0] + l[1] * l[1] + l[2] * l[2], f = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], m = l[0] * r[0] + l[1] * r[1] + l[2] * r[2], M = p * w - d * d;
    if (M < 1e-12) return null;
    const k = (d * m - w * f) / M, y = (p * m - d * f) / M;
    if (!a && (k < -1e-6 || k > 1 + 1e-6) || !c && (y < -1e-6 || y > 1 + 1e-6)) return null;
    const u = [e[0] + k * i[0], e[1] + k * i[1], e[2] + k * i[2]], x = [s[0] + y * l[0], s[1] + y * l[1], s[2] + y * l[2]];
    return Sn(u, x) > 1e-4 ? null : u;
  }, Xa = (e) => {
    var _a3;
    return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === e).length, 0);
  }, Za = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Ua = (e, o) => {
    var _a3, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal, n = t.points.rawVal, a = Za[e];
    if (!Dt) {
      if (cn < 0) {
        le(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Dt = { poly: cn, seg: Math.max(0, vn) }, le(e === "offset" ? `DESFASE l\xEDnea #${Dt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Ln > 0 ? ` (${Ln} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Wt();
      return;
    }
    if (e === "offset") {
      const k = Dt.poly, y = s[k];
      if (!y || y.length < 2) {
        Dt = null, le("DESFASE: esa polil\xEDnea no tiene tramos."), Wt();
        return;
      }
      const u = y.length > 2 && y[0] === y[y.length - 1], x = Ya(), b = [];
      for (let Fe = 0; Fe < y.length - 1; Fe++) {
        const je = n[y[Fe]], Ye = n[y[Fe + 1]], Ce = [Ye[0] - je[0], Ye[1] - je[1], Ye[2] - je[2]], Xe = Math.hypot(Ce[0], Ce[1], Ce[2]) || 1, He = Ce[0] / Xe, mt = Ce[1] / Xe, vt = Ce[2] / Xe, Ft = [x[1] * vt - x[2] * mt, x[2] * He - x[0] * vt, x[0] * mt - x[1] * He], on = Math.hypot(Ft[0], Ft[1], Ft[2]) || 1;
        b.push({ a: je, b: Ye, n: [Ft[0] / on, Ft[1] / on, Ft[2] / on] });
      }
      let F = 0, S = 1 / 0;
      b.forEach((Fe, je) => {
        const Ye = On(o[0], o[1], o[2], Fe.a[0], Fe.a[1], Fe.a[2], Fe.b[0], Fe.b[1], Fe.b[2]);
        Ye < S && (S = Ye, F = je);
      });
      const A = b[F], T = Math.sign((o[0] - A.a[0]) * A.n[0] + (o[1] - A.a[1]) * A.n[1] + (o[2] - A.a[2]) * A.n[2]) || 1, D = Ln > 0 ? Ln : S;
      if (D < 1e-6) {
        le("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const B = b.map((Fe) => ({ a: [Fe.a[0] + T * D * Fe.n[0], Fe.a[1] + T * D * Fe.n[1], Fe.a[2] + T * D * Fe.n[2]], b: [Fe.b[0] + T * D * Fe.n[0], Fe.b[1] + T * D * Fe.n[1], Fe.b[2] + T * D * Fe.n[2]] })), W = B.length, ne = (Fe) => {
        const je = B[(Fe - 1 + W) % W], Ye = B[Fe % W];
        return ts(je.a, je.b, Ye.a, Ye.b, true, true) ?? Ye.a;
      }, ye = [], ke = u ? W : W + 1;
      for (let Fe = 0; Fe < ke; Fe++) !u && Fe === 0 ? ye.push(B[0].a) : !u && Fe === W ? ye.push(B[W - 1].b) : ye.push(ne(Fe));
      Pt();
      const st = n.length;
      t.points.val = [...n, ...ye];
      const Ge = ye.map((Fe, je) => st + je);
      u && Ge.push(st);
      let ot = s.slice();
      ot.length && ot[ot.length - 1].length === 0 && (ot = ot.slice(0, -1)), t.polylines.val = [...ot, Ge, []], Dt = null, le(`\u2713 Desfase a ${D.toFixed(2)} m \u2014 ${W} tramo${W === 1 ? "" : "s"} nuevo${W === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      C(), Wt();
      return;
    }
    let c = cn, i = Math.max(0, vn);
    if (c < 0 || c === Dt.poly && i === Dt.seg) {
      let y = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (c = -1, s.forEach((u, x) => {
        for (let b = 0; b < u.length - 1; b++) {
          if (x === Dt.poly && b === Dt.seg) continue;
          const F = n[u[b]], S = n[u[b + 1]];
          if (!F || !S) continue;
          const A = On(o[0], o[1], o[2], F[0], F[1], F[2], S[0], S[1], S[2]);
          A < y && (y = A, c = x, i = b);
        }
      }), c < 0) {
        le(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const l = s[Dt.poly], r = n[l[Dt.seg]], p = n[l[Dt.seg + 1]], d = s[c], w = d[i], f = d[i + 1];
    if (!r || !p || w == null || f == null) {
      le(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const m = n[w], M = n[f];
    if (e === "trim") {
      const k = ts(m, M, r, p, false, false);
      if (!k) {
        le("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Pt();
      const y = n.length;
      t.points.val = [...n, k];
      const u = [...d.slice(0, i + 1), y, ...d.slice(i + 1)];
      t.polylines.val = s.map((b, F) => F === c ? u : b);
      const x = Sn(o, m) < Sn(o, M);
      Ps(c, x ? i : i + 1), le(`\u2713 Recortado en (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const k = ts(m, M, r, p, true, false);
      if (!k) {
        le("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = Sn(o, m) < Sn(o, M) ? i : i + 1;
      if (u !== 0 && u !== d.length - 1) {
        le("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = d[u];
      if (Sn(k, m) + Sn(k, M) < Sn(m, M) + 1e-6) {
        le("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Pt(), Xa(x) > 1) {
        const F = n.length;
        t.points.val = [...n, k];
        const S = d.slice();
        S[u] = F, t.polylines.val = s.map((A, T) => T === c ? S : A);
      } else t.points.val = n.map((F, S) => S === x ? k : F);
      le(`\u2713 Alargada hasta (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    C(), Wt();
  };
  window.__hekatanSelectionSize = () => qe.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let o = e.length - 1;
    for (; o >= 0 && (!e[o] || e[o].length < 2); ) o--;
    return qe.clear(), o >= 0 && qe.add(`poly:${o}`), en(), le(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), qe.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    qe.clear();
    const s = /* @__PURE__ */ new Set();
    return e.forEach((n, a) => {
      !n || n.length < 2 || (qe.add(`poly:${a}`), n.forEach((c) => s.add(c)));
    }), o.forEach((n, a) => {
      s.has(a) || qe.add(`pt:${a}`);
    }), en(), le(`SELECCI\xD3N ${qe.size} objetos (todo el modelo) \xB7 Esc suelta`), qe.size;
  }, window.__hekatanReplicateSelection = (e, o, s, n, a = 0) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const c = [...qe], i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), p = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), w = [];
    if (c.forEach((y) => {
      if (y.startsWith("pt:")) {
        const u = +y.slice(3);
        i[u] && p.add(u);
      } else if (y.startsWith("poly:")) {
        const u = +y.slice(5);
        if (!l[u] || l[u].length < 2) return;
        d.add(u), l[u].forEach((x) => p.add(x));
      } else if (y.startsWith("seg:")) {
        const u = y.split(":"), x = +u[1], b = +u[2], F = l[x] || [], S = F[b], A = F[b + 1];
        S != null && A != null && (w.push([S, A]), p.add(S), p.add(A));
      }
    }), !p.size) return 0;
    Pt();
    const f = [...i];
    let m = l.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const M = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], k = [...p];
    for (let y = 1; y <= n; y++) {
      const u = a + y, x = e * u, b = o * u, F = s * u, S = /* @__PURE__ */ new Map();
      k.forEach((A) => {
        S.set(A, f.length), f.push([i[A][0] + x, i[A][1] + b, i[A][2] + F]);
      }), d.forEach((A) => {
        const T = l[A].map((B) => S.has(B) ? S.get(B) : B), D = m.length;
        m.push(T), r.has(A) && M.push(D);
      }), w.forEach(([A, T]) => {
        m.push([S.get(A), S.get(T)]);
      });
    }
    m.push([]), t.points.val = f, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = M);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), n;
  }, window.__hekatanExtrudeSelection = (e, o, s, n) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1));
    const a = [...qe], c = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), r = /* @__PURE__ */ new Set(), p = [], d = /* @__PURE__ */ new Set();
    for (const x of i) for (const b of x) d.add(b);
    if (a.forEach((x) => {
      if (x.startsWith("poly:")) {
        const b = +x.slice(5);
        if (l.has(b)) return;
        const F = i[b] || [];
        for (let S = 0; S + 1 < F.length; S++) p.push([F[S], F[S + 1]]), d.add(F[S]), d.add(F[S + 1]);
      } else if (x.startsWith("seg:")) {
        const b = x.split(":"), F = +b[1], S = +b[2], A = i[F] || [], T = A[S], D = A[S + 1];
        T != null && D != null && (p.push([T, D]), d.add(T), d.add(D));
      }
    }), a.forEach((x) => {
      if (x.startsWith("pt:")) {
        const b = +x.slice(3);
        c[b] && !d.has(b) && r.add(b);
      }
    }), !r.size && !p.length) return { lineas: 0, areas: 0 };
    Pt();
    const w = [...c];
    let f = i.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const m = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], M = /* @__PURE__ */ new Map(), k = (x, b) => {
      if (b === 0) return x;
      const F = x + ":" + b;
      let S = M.get(F);
      if (S == null) {
        const A = [c[x][0] + e * b, c[x][1] + o * b, c[x][2] + s * b];
        S = w.findIndex((T) => Math.abs(T[0] - A[0]) < 1e-3 && Math.abs(T[1] - A[1]) < 1e-3 && Math.abs(T[2] - A[2]) < 1e-3), S < 0 && (S = w.length, w.push(A)), M.set(F, S);
      }
      return S;
    };
    let y = 0, u = 0;
    r.forEach((x) => {
      const b = [x];
      for (let F = 1; F <= n; F++) b.push(k(x, F));
      f.push(b), y += n;
    }), p.forEach(([x, b]) => {
      for (let F = 1; F <= n; F++) {
        const S = [k(x, F - 1), k(b, F - 1), k(b, F), k(x, F)];
        m.push(f.length), f.push([...S, S[0]]), u++;
      }
    }), f.push([]), t.points.val = w, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = m);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), { lineas: y, areas: u };
  }, window.__hekatanVoladoSelection = (e, o = {}) => {
    var _a3, _b, _c;
    const s = Number(e);
    if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
    const n = o.losa !== false, a = o.vigaBorde !== false, c = o.lados === "afuera" ? "afuera" : "ambos", i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = [];
    if ([...qe].forEach((k) => {
      if (k.startsWith("seg:")) {
        const y = k.split(":"), u = +y[1], x = +y[2], b = l[u] || [], F = b[x], S = b[x + 1];
        F != null && S != null && r.push([F, S]);
      } else if (k.startsWith("poly:")) {
        const y = l[+k.slice(5)] || [];
        for (let u = 0; u + 1 < y.length; u++) r.push([y[u], y[u + 1]]);
      }
    }), !r.length) return 0;
    let p = 0, d = 0;
    for (const k of i) p += k[0], d += k[1];
    p /= Math.max(1, i.length), d /= Math.max(1, i.length), Pt();
    const w = [...i];
    let f = l.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const m = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let M = 0;
    for (const [k, y] of r) {
      const u = i[k], x = i[y];
      if (!u || !x) continue;
      const b = x[0] - u[0], F = x[1] - u[1], S = Math.hypot(b, F);
      if (S < 1e-6) continue;
      let A = -F / S, T = b / S;
      const D = (u[0] + x[0]) / 2, B = (u[1] + x[1]) / 2;
      (D - p) * A + (B - d) * T < 0 && (A = -A, T = -T);
      const W = c === "ambos" ? [1, -1] : [1];
      for (const ne of W) {
        const ye = A * s * ne, ke = T * s * ne, st = w.length;
        w.push([u[0] + ye, u[1] + ke, u[2]]);
        const Ge = w.length;
        w.push([x[0] + ye, x[1] + ke, x[2]]), f.push([k, st]), f.push([y, Ge]), a && f.push([st, Ge]), n && (m.push(f.length), f.push([k, y, Ge, st, k])), M++;
      }
    }
    if (!M) return 0;
    f.push([]), t.points.val = w, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = m);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), M;
  }, E.addEventListener("click", (e) => {
    var _a3, _b, _c;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Fn > 5) {
      Fn = 0;
      return;
    }
    Fn = 0;
    const o = Y(e);
    if (!o) return;
    V.setFromCamera(N, o);
    const s = !!(Rt && Math.abs(e.clientX - Rt.x) <= 3 && Math.abs(e.clientY - Rt.y) <= 3), n = s ? [{ point: Rt.p.clone(), distance: o.position.distanceTo(Rt.p) }] : Re();
    if (!n.length) return;
    if (!s) {
      const c = o.position.distanceTo(_.target) || 1, i = n[0].distance ?? o.position.distanceTo(n[0].point), l = n[0].point;
      if (!isFinite(l.x) || !isFinite(l.y) || !isFinite(l.z) || i > Math.max(c * 12, 300)) {
        le("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let a = n[0].point;
    (e.ctrlKey || e.metaKey) && (a = new $(Math.round(n[0].point.x), Math.round(n[0].point.y), Math.round(n[0].point.z)));
    {
      const c = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = c[c.length - 1] ?? [], l = t.points.rawVal ?? [];
      if (i.length > 0) {
        const r = l[i[i.length - 1]];
        if (r) {
          const p = !!window.__hekatanOrthoMode;
          let d = zt;
          if (!d && p) {
            const w = Math.abs(a.x - r[0]), f = Math.abs(a.y - r[1]), m = Math.abs(a.z - r[2]);
            d = w >= f && w >= m ? "x" : f >= m ? "y" : "z";
          }
          d === "x" ? a = new $(a.x, r[1], r[2]) : d === "y" ? a = new $(r[0], a.y, r[2]) : d === "z" && (a = new $(r[0], r[1], a.z));
        }
      }
    }
    if (Rt && Math.abs(e.clientX - Rt.x) <= 3 && Math.abs(e.clientY - Rt.y) <= 3) a = Rt.p.clone();
    else if (po) a = po.clone(), le(`\u{1F4D0} Eje \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
    else {
      const c = Ko(a), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, a.x, a.y, a.z, c, { x: e.clientX, y: e.clientY });
      if (i) a = new $(i.x, i.y, i.z), le(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
      else {
        const l = window.__hekatanSnapEnabled !== false, r = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        l && r > 0 && (a = new $(Math.round(a.x / r) * r, Math.round(a.y / r) * r, Math.round(a.z / r) * r));
      }
    }
    Gs(a, e);
  });
  const Gs = (e, o) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (wn) {
        Gt && _o();
        const { kind: i, a: l, b: r } = wn, p = r !== void 0 ? `${i}:${l}:${r}` : `${i}:${l}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || qe.clear(), qe.has(p) ? qe.delete(p) : qe.add(p), en(), le(`\u2713 Seleccionados ${qe.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), l = (o == null ? void 0 : o.clientX) ?? 0, r = (o == null ? void 0 : o.clientY) ?? 0;
        Gt ? (Is(Gt.x, Gt.y, l, r, i), Gt = null) : i || (Gt = { x: l, y: r }, le("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Wo(l, r, l + 1, r + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const i = window.__hekatanAxisDraw;
      if (!i) return;
      if (!i.pendingStart) {
        i.pendingStart = [e.x, e.y, e.z], le(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const l = i.mode === "number", r = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, i.pendingStart, [e.x, e.y, e.z], l);
      le(`\u2713 Eje "${r}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      Ks(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "delete") {
      if (_n >= 0) {
        const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], r = _n;
        if (r >= 0 && r < l.length) {
          Pt();
          const p = l.slice(0, r).concat(l.slice(r + 1));
          i && typeof i == "object" && "val" in i ? i.val = p : window.__hekatanDrawingAuxLines = p, le(`\u{1F5D1} L\xEDnea auxiliar #${r + 1} borrada`), _n = -1, qt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (cn >= 0) {
        const i = cn, l = vn;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (yo(i), le(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (Ps(i, l), le(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : (yo(i), le(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else le("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        le("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, l] = Ke, r = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), p = Math.abs(l[0] - i[0]), d = Math.abs(l[1] - i[1]), w = Math.abs(l[2] - i[2]), f = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), M = (f === "xy" ? w < 1e-3 : f === "xz" ? d < 1e-3 : f === "yz" ? p < 1e-3 : false) ? f : w < 1e-3 ? "xy" : d < 1e-3 ? "xz" : "yz", k = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], r, k, M), le(`\u2713 C\xEDrculo dibujado en ${M.toUpperCase()} \u2014 r=${r.toFixed(2)}m, ${k} segmentos`), Ke = [];
      try {
        (_l = window.__hekatanRebuild) == null ? void 0 : _l.call(window);
      } catch {
      }
      return;
    }
    if (s === "ifcface") {
      if (!J) {
        le("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!J.plana) {
        le("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const i = q(J.m), l = ce(i, J.tris);
      if (l.length < 3) {
        le("\u25A6 No se pudo cerrar el contorno de la cara.");
        return;
      }
      const r = J.normal.clone(), p = H(J.m, J.punto, r);
      let d = String(window.__hekatanIfcCaraPos ?? "auto"), w = false;
      try {
        const b = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        w = Math.round((b == null ? void 0 : b.matShell) ?? 0) === 1;
      } catch {
      }
      d === "auto" && (d = Math.abs(r.z) > 0.5 ? w ? "interior" : "exterior" : "media");
      const f = p ?? 0.2, m = d === "exterior" ? 0 : d === "interior" ? f : f / 2, M = l.map((b) => b.clone().addScaledVector(r, -m));
      Pt(), nt = M.map((b) => [b.x, b.y, b.z]);
      const k = Mo();
      try {
        const b = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        b && p && (b.tShell = Math.round(p * 100) / 100);
      } catch {
      }
      const y = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let u = "la de \xABSecci\xF3n shells\xBB";
      try {
        const b = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        b && b.formaPlaca != null && (u = y[Math.round(b.formaPlaca)] ?? u);
      } catch {
      }
      const x = d === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : d === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + f.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (f / 2).toFixed(2) + " m hacia dentro)";
      le(`\u25A6 \xC1rea desde la cara del IFC: ${l.length} v\xE9rtices, ${k} shell(s). Espesor medido ${p ? p.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${x}; formulaci\xF3n ${u}, t = ${f.toFixed(2)} m.`), pe(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      C();
      return;
    }
    if (s === "ifcline") {
      if (!we || we.length < 2) {
        le("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = I(we);
      Pt();
      const l = t.points.rawVal, r = [], p = [];
      for (const w of i) {
        let f = l.findIndex((m) => Math.abs(m[0] - w[0]) < 1e-3 && Math.abs(m[1] - w[1]) < 1e-3 && Math.abs(m[2] - w[2]) < 1e-3);
        f < 0 && (f = l.length + p.length, p.push(w)), r.push(f);
      }
      if (t.points.val = [...l, ...p], t.polylines) {
        const w = t.polylines.rawVal, f = w.length && w[w.length - 1].length === 0 ? w.slice(0, -1) : w;
        t.polylines.val = [...f, r, []];
      }
      const d = we.reduce((w, f, m) => m ? w + f.distanceTo(we[m - 1]) : 0, 0);
      le(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${d.toFixed(2)} m de desarrollo.`), U(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      C();
      return;
    }
    if (s === "arc") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        le("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ke.length === 2) {
        le("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [i, l, r] = Ke, p = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, l, r, p), le(`\u2713 Arco dibujado \u2014 ${p} segmentos`), Ke = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (s === "parabola" || s === "cubica") {
      const i = s === "parabola" ? 3 : 4, l = s === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Ke.push([e.x, e.y, e.z]), Ke.length < i) {
        le(`\u223F ${l} \u2014 punto ${Ke.length}/${i} OK. Marc\xE1 el ${Ke.length + 1}\xBA.`);
        return;
      }
      const r = window.__hekatanArcSegs ?? 12, p = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Ke.slice(), r);
      if (!(p == null ? void 0 : p.ok)) {
        le(`\u26A0 ${l}: ${(p == null ? void 0 : p.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Ke = [];
        return;
      }
      const d = "xyz"[p.ia ?? 0], w = "xyz"[p.io ?? 2], f = (p.coef ?? []).map((m, M) => `${m >= 0 && M ? "+" : ""}${m.toFixed(3)}${M ? "\xB7" + d + (M > 1 ? "^" + M : "") : ""}`).join(" ");
      le(`\u2713 ${l} dibujada en ${String(p.plano ?? "").toUpperCase()} \u2014 ${r} tramos a \u0394 igual de ${d} \xB7 ${w} = ${f}`), Ke = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (s === "revolve") {
      const i = Math.round(window.__hekatanRevSectores ?? 16), l = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, i, 360);
      if (l == null ? void 0 : l.msg) {
        le(`\u26A0 Revoluci\xF3n: ${l.msg}.`);
        return;
      }
      le(`\u2713 Revoluci\xF3n: ${l.anillos} anillo(s) \xD7 ${i} sectores \u2192 ${l.areas} pa\xF1o(s) Q4${l.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${l.guias ? ` ${l.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (s === "loft") {
      const i = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, e.x, e.y);
      if (i == null ? void 0 : i.msg) {
        le(`\u26A0 Barrido: ${i.msg}.`);
        return;
      }
      le(`\u2713 Barrido: contorno de ${i.contorno} lados \xD7 perfil de ${i.perfil} puntos \u2192 ${i.areas} pa\xF1o(s) Q4. Eje por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${i.guias ? ` ${i.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        le("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Ke;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, l), le(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Ke = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (s === "medir") {
      const l = (Rt && Math.abs(Rt.x - o.clientX) < 3 && Math.abs(Rt.y - o.clientY) < 3 ? [Rt.p.x, Rt.p.y, Rt.p.z] : null) ?? rt(o);
      if (!l) return;
      if (pt.length >= 2 && (pt = []), pt.push(l), pt.length === 1) it.visible = false, kt(), le("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [r, p] = pt;
        it.geometry.setFromPoints([new $(r[0], r[1], r[2]), new $(p[0], p[1], p[2])]), it.visible = true;
        const d = Math.hypot(p[0] - r[0], p[1] - r[1], p[2] - r[2]), w = Math.hypot(p[0] - r[0], p[1] - r[1]);
        Qe.textContent = `${d.toFixed(3)} m`, kt(), le(`\u{1F4CF} Distancia ${d.toFixed(3)} m  \xB7  \u0394x ${(p[0] - r[0]).toFixed(3)}  \u0394y ${(p[1] - r[1]).toFixed(3)}  \u0394z ${(p[2] - r[2]).toFixed(3)}  \xB7  en planta ${w.toFixed(3)} m`);
      }
      C();
      return;
    }
    if (s === "fillarea") {
      const i = t.points.rawVal, l = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], r = /* @__PURE__ */ new Map(), p = (D, B) => {
        D !== B && ((r.get(D) ?? r.set(D, /* @__PURE__ */ new Set()).get(D)).add(B), (r.get(B) ?? r.set(B, /* @__PURE__ */ new Set()).get(B)).add(D));
      };
      for (const D of l) for (let B = 0; B + 1 < D.length; B++) p(D[B], D[B + 1]);
      const d = (D, B) => {
        var _a4;
        return !!((_a4 = r.get(D)) == null ? void 0 : _a4.has(B));
      }, w = /* @__PURE__ */ new Set(), f = [], m = [...r.keys()];
      for (const D of m) for (const B of r.get(D)) if (!(B < D)) {
        for (const W of r.get(B)) if (W !== D) for (const ne of r.get(W)) {
          if (ne === D || ne === B || !d(ne, D) || d(D, W) || d(B, ne)) continue;
          const ye = [D, B, W, ne].slice().sort((ke, st) => ke - st).join("-");
          w.has(ye) || (w.add(ye), f.push([D, B, W, ne]));
        }
      }
      for (const D of m) for (const B of r.get(D)) if (!(B < D)) for (const W of r.get(B)) {
        if (W === D || !d(W, D)) continue;
        const ne = [D, B, W].slice().sort((ye, ke) => ye - ke).join("-");
        w.has(ne) || (w.add(ne), f.push([D, B, W]));
      }
      const M = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", k = (D) => M === "xy" ? [D[0], D[1]] : M === "xz" ? [D[0], D[2]] : [D[1], D[2]], y = k([e.x, e.y, e.z]), u = (D, B) => {
        let W = false;
        for (let ne = 0, ye = B.length - 1; ne < B.length; ye = ne++) {
          const ke = B[ne][0], st = B[ne][1], Ge = B[ye][0], ot = B[ye][1];
          st > D[1] != ot > D[1] && D[0] < (Ge - ke) * (D[1] - st) / (ot - st) + ke && (W = !W);
        }
        return W;
      }, x = (D) => {
        let B = 0;
        for (let W = 0, ne = D.length - 1; W < D.length; ne = W++) B += (D[ne][0] + D[W][0]) * (D[ne][1] - D[W][1]);
        return Math.abs(B) / 2;
      };
      let b = null, F = 1 / 0;
      for (const D of f) {
        const B = D.map((ne) => k(i[ne]));
        if (!u(y, B)) continue;
        const W = x(B);
        W < F && (F = W, b = D);
      }
      if (!b) {
        le("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const S = b.slice().sort((D, B) => D - B).join("-"), A = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (A.some((D) => {
        const B = l[D] ?? [];
        return [...new Set(B)].sort((W, ne) => W - ne).join("-") === S;
      })) {
        le("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...l, [...b, b[0]]], t.areas.val = [...A, l.length], le(`\u2713 \xC1rea creada por relleno (${b.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        le("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Ke;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), le(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Ke = [];
      return;
    }
    if (s === "polyarea") {
      nt.push([e.x, e.y, e.z]), Ie.geometry.setFromPoints(nt.map((i) => new $(i[0], i[1], i[2]))), Ie.visible = nt.length >= 1, le(`\u25B0 \xC1rea libre \u2014 ${nt.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), C();
      return;
    }
    if (s === "plane3") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length < 3) {
        le(`\u25E3 Plano inclinado \u2014 punto ${Ke.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [i, l, r] = Ke, p = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, l, r);
      le(p ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ke = [];
      return;
    }
    if (s === "col") {
      Pt();
      const i = e.z, l = Ct && Ct > 0 ? Ct : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + l]];
      const r = t.polylines.rawVal, p = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [p - 2, p - 1], []], Ct = 0, le(`\u258C Columna creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        le("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [i, l] = Ke, r = Ct && Ct > 0 ? Ct : 3;
      Pt();
      const p = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [l[0], l[1], l[2]], [l[0], l[1], l[2] + r], [i[0], i[1], i[2] + r]];
      const d = t.polylines.rawVal;
      if (d.length - 1, t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [p, p + 1, p + 2, p + 3, p], []], t.areas) {
        const w = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, w];
      }
      le(`\u25A5 Pared Q4 creada \u2014 h=${r.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ke = [], Ct = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      Pt();
      const i = Ct && Ct > 0 ? Ct : 3, l = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, l], [e.x, e.y, l + i]];
      const r = t.polylines.rawVal, p = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [p - 2, p - 1], []], Ct = 0, le(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = Xo(e.x, e.y, e.z, i);
      if (!l) {
        le("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const r = t.polylines.rawVal, p = t.points.rawVal, d = r[l.polyIdx], w = p[d[l.segIdx]], f = p[d[l.segIdx + 1]];
      if (!w || !f) {
        le("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const m = Ct && Ct > 0 ? Ct : 3;
      Pt();
      const M = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [w[0], w[1], w[2]], [f[0], f[1], f[2]], [f[0], f[1], f[2] + m], [w[0], w[1], w[2] + m]];
      const k = t.polylines.rawVal;
      if (t.polylines.val = [...k.slice(0, -1), ...k[k.length - 1].length > 0 ? [k[k.length - 1]] : [], [M, M + 1, M + 2, M + 3, M], []], t.areas) {
        const y = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, y];
      }
      Ct = 0, le(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${m.toFixed(2)}m`);
      try {
        (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
      } catch {
      }
      return;
    }
    if (s === "auxp") {
      const i = window.__hekatanDrawingAuxPoints;
      if (i) {
        const l = i.rawVal ?? i.val ?? [];
        i.val = [...l, [e.x, e.y, e.z]];
      }
      le(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        le("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, l] = Ke, r = window.__hekatanDrawingAuxLines;
      if (r) {
        Pt();
        const m = r.rawVal ?? r.val ?? [];
        r.val = [...m, [i[0], i[1], i[2], l[0], l[1], l[2]]];
      }
      const p = l[0] - i[0], d = l[1] - i[1], w = l[2] - i[2], f = Math.sqrt(p * p + d * d + w * w);
      le(`\u2713 L\xEDnea auxiliar creada \u2014 L=${f.toFixed(2)}m (cyan, no FEM)`), Ke = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Ua(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "chaflan") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        le("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Ke, r = window.__hekatanChaflanR ?? 1, p = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, r, p, 6);
      const d = Math.abs(l[0] - i[0]).toFixed(1), w = Math.abs(l[1] - i[1]).toFixed(1);
      le(`\u2713 Losa con chaflanes dibujada \u2014 ${d}\xD7${w}m, r=${r}m, ${p} seg/chafl\xE1n`), Ke = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    Oe = false, Pt();
    const n = e.toArray(), a = t.points.rawVal;
    let c = a.findIndex((i) => Math.abs(i[0] - n[0]) < 1e-3 && Math.abs(i[1] - n[1]) < 1e-3 && Math.abs(i[2] - n[2]) < 1e-3);
    if (c < 0 && (t.points.val = [...a, n], c = t.points.rawVal.length - 1), t.polylines && s !== "node") {
      const i = t.polylines.rawVal, l = i.length ? i[i.length - 1] : [];
      l.length && l[l.length - 1] === c ? t.polylines.val = [...i, [c]] : t.polylines.val = [...i.slice(0, -1), [...l, c]];
    }
    if (t.polylines) {
      const i = t.polylines.rawVal, l = i.length - 1, r = i[l] ?? [];
      if (s === "line" && r.length >= 2) {
        le(`\uFF0F L\xEDnea \u2014 ${r.length - 1} tramo${r.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && r.length === 4) {
        t.polylines.val = [...i.slice(0, -1), [...r, r[0]], []], t.areas && (t.areas.val = [...t.areas.rawVal, l]), le("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") le(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
    else if (s === "line") le("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") le("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const i = ((_R = t.polylines) == null ? void 0 : _R.rawVal[t.polylines.rawVal.length - 1]) ?? [];
      le(`\u25A6 \xC1rea \u2014 click ${i.length}/4. Marc\xE1 ${4 - i.length} v\xE9rtice${4 - i.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  E.addEventListener("click", () => Wt()), E.addEventListener("contextmenu", (e) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && nt.length >= 3) {
      e.preventDefault();
      const s = Mo();
      le(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), E.addEventListener("pointermove", (e) => {
    var _a3, _b, _c;
    const o = Y(e);
    if (!o) return;
    V.setFromCamera(N, o);
    const s = Re();
    if (We.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (e.ctrlKey || e.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = i[i.length - 1] ?? [], r = t.points.rawVal ?? [];
        if (l.length > 0) {
          const p = r[l[l.length - 1]];
          if (p) {
            const d = !!window.__hekatanOrthoMode;
            let w = zt;
            if (!w && d) {
              const f = Math.abs(n.x - p[0]), m = Math.abs(n.y - p[1]), M = Math.abs(n.z - p[2]);
              w = f >= m && f >= M ? "x" : m >= M ? "y" : "z";
            }
            w === "x" ? n.set(n.x, p[1], p[2]) : w === "y" ? n.set(p[0], n.y, p[2]) : w === "z" && n.set(p[0], p[1], n.z);
          }
        }
      }
      const a = Ko(n), c = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: e.clientX, y: e.clientY });
      if (c) n.set(c.x, c.y, c.z);
      else {
        const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        i && l > 0 && (n.x = Math.round(n.x / l) * l, n.y = Math.round(n.y / l) * l, n.z = Math.round(n.z / l) * l);
      }
      We.geometry.setAttribute("position", new Lt(n.toArray(), 3));
    }
    C();
  }), E.addEventListener("pointermove", (e) => {
    var _a3;
    const o = Y(e);
    if (!o) return;
    V.setFromCamera(N, o);
    let s = false;
    const n = V.intersectObject(Ee), a = Re();
    if (n.length && a.length) {
      const c = new $(...t.points.rawVal[n[0].index]), i = new $(...a[0].point), l = c.sub(i), r = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      r.transformDirection(j.matrixWorld), Math.abs(l.dot(r)) < 1e-4 && (s = true);
    }
    We.visible = !s;
  });
  let ns = false, os;
  E.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Fn) return;
    const o = Y(e);
    if (!o) return;
    V.setFromCamera(N, o);
    let s = false;
    const n = V.intersectObject(Ee), a = Re();
    if (n.length && a.length) {
      const i = new $(...t.points.rawVal[n[0].index]), l = new $(...a[0].point), r = i.sub(l), p = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      p.transformDirection(j.matrixWorld), Math.abs(r.dot(p)) < 1e-4 && (s = true);
    }
    if (s && Fn < 5 && (ns = true, _.enabled = false, os = n[0].index), !ns || Fn % 2 !== 0) return;
    const c = [...t.points.rawVal];
    if (os !== void 0) {
      let i = a[0].point;
      (e.ctrlKey || e.metaKey) && (i = new $(Math.round(i.x), Math.round(i.y), Math.round(i.z))), c[os] = i.toArray();
    }
    t.points.val = c;
  }), E.addEventListener("pointerup", () => {
    _.enabled = true, ns = false;
  }), E.addEventListener("contextmenu", (e) => {
    var _a3;
    const o = Y(e);
    if (!o) return;
    V.setFromCamera(N, o);
    let s = false;
    const n = V.intersectObject(Ee), a = Re();
    if (n.length && a.length) {
      const l = new $(...t.points.rawVal[n[0].index]), r = new $(...a[0].point), p = l.sub(r), d = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      d.transformDirection(j.matrixWorld), Math.abs(p.dot(d)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const c = [...t.points.rawVal];
    if (c.splice(n[0].index, 1), t.points.val = c, !t.polylines) return;
    const i = t.polylines.rawVal.map((l) => l.filter((r) => r !== n[0].index)).map((l) => l.map((r) => r > n[0].index ? r - 1 : r)).filter((l) => l.length);
    i.push([]), t.polylines.val = i;
  });
}
function Ti(t, h, g) {
  const z = Math.round(14.999999999999998), P = { position: t.position.clone(), quaternion: t.quaternion.clone() }, E = setInterval(V, 1e3 / 30);
  let C = 0;
  function V() {
    C++;
    const N = C / z;
    t.position.lerpVectors(P.position, h.position, N), t.quaternion.slerpQuaternions(P.quaternion, h.quaternion, N), g && g(), C == z && clearInterval(E);
  }
}
function Ri(t, h, g, v) {
  const _ = hi(g, t.elements, v);
  return ue.derive(() => {
    _.visible = h.shellResults.val != "none";
  }), _;
}
const Bi = 6, hs = 10, Di = 0.012;
function Ni(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function Yi(t, h, g, v) {
  if (!g && !v) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && g) {
    const z = g[t];
    if (z && z.has(h)) return z.get(h);
  }
  return null;
}
function Xi(t, h, g, v) {
  const _ = new ut(), z = new xa();
  z.setColorMap("rainbow");
  const P = new an(), E = ue.state([]);
  return ue.derive(() => {
    var _a2, _b, _c;
    h.deformedShape.val;
    const C = g.val, V = ((_a2 = t.elements) == null ? void 0 : _a2.val) ?? [], N = Ni(h.frameResults.val);
    if (_.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), _.clear(), !N || V.length === 0 || C.length === 0) {
      E.val = [];
      return;
    }
    const Y = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, j = (_c = t.deformOutputs) == null ? void 0 : _c.val, X = [], he = [];
    for (let L = 0; L < V.length; L++) {
      if (V[L].length !== 2) continue;
      const de = Yi(N, L, Y, j);
      de && (X.push(de[0], de[1]), he.push({ idx: L, vals: de }));
    }
    if (X.length === 0) {
      E.val = [];
      return;
    }
    const Q = Math.min(...X), Z = Math.max(...X);
    z.setMin(Q), z.setMax(Z), E.val = X;
    const oe = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of C) for (let J = 0; J < 3; J++) oe[J] = Math.min(oe[J], L[J]), se[J] = Math.max(se[J], L[J]);
    const fe = Math.max(se[0] - oe[0], se[1] - oe[1], se[2] - oe[2], 1) * Di, me = [], re = [], G = [];
    let U = 0;
    for (const { idx: L, vals: J } of he) {
      const de = V[L], pe = C[de[0]], ce = C[de[1]];
      if (!pe || !ce) continue;
      const H = new $(ce[0] - pe[0], ce[1] - pe[1], ce[2] - pe[2]), Me = H.length();
      if (Me < 1e-10) continue;
      H.normalize();
      const ee = Math.abs(H.y) < 0.99 ? new $(0, 1, 0) : new $(1, 0, 0), $e = new $().crossVectors(H, ee).normalize(), xe = new $().crossVectors(H, $e).normalize(), ge = hs + 1, ve = Bi;
      for (let De = 0; De < ge; De++) {
        const ze = De / hs, et = pe[0] + H.x * Me * ze, at = pe[1] + H.y * Me * ze, Be = pe[2] + H.z * Me * ze, R = J[0] + (J[1] - J[0]) * ze, O = z.getColor(R) ?? new an(0, 0, 0);
        P.copy(O).convertSRGBToLinear();
        for (let ie = 0; ie < ve; ie++) {
          const ae = ie / ve * Math.PI * 2, be = Math.cos(ae), Se = Math.sin(ae);
          me.push(et + ($e.x * be + xe.x * Se) * fe, at + ($e.y * be + xe.y * Se) * fe, Be + ($e.z * be + xe.z * Se) * fe), re.push(P.r, P.g, P.b);
        }
      }
      for (let De = 0; De < hs; De++) for (let ze = 0; ze < ve; ze++) {
        const et = (ze + 1) % ve, at = U + De * ve + ze, Be = U + De * ve + et, R = U + (De + 1) * ve + ze, O = U + (De + 1) * ve + et;
        G.push(at, Be, O), G.push(at, O, R);
      }
      U += ge * ve;
    }
    if (me.length === 0) return;
    const I = new Ae();
    I.setAttribute("position", new Lt(me, 3)), I.setAttribute("color", new Lt(re, 3)), I.setIndex(G), I.computeVertexNormals();
    const K = new wt({ vertexColors: true, side: Vt }), q = new ct(I, K);
    q.frustumCulled = false, _.add(q);
  }), _.__colorMapValues = E, _;
}
function Zi() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ui = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, qi = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ki = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function At(t, h = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(h) : t.toFixed(h);
}
const Gi = 16755200, ra = 56831, Wi = 56831, Hi = 56831, Lo = 65382;
function Ji(t) {
  const h = new ut();
  h.name = "__hekatan_hover", h.renderOrder = 99;
  const g = new Hn(1, 16, 16), v = new wt({ color: Gi, transparent: true, opacity: 0.85, depthTest: false }), _ = new ct(g, v);
  _.visible = false, _.renderOrder = 100, h.add(_);
  const z = new Ae(), P = new ft({ color: ra, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), E = new Qt(z, P);
  E.visible = false, E.renderOrder = 100, h.add(E);
  const C = new wt({ color: ra, transparent: true, opacity: 0.7, depthTest: false }), V = new ct(new sa(1, 1, 1, 12), C);
  V.visible = false, V.renderOrder = 100, h.add(V);
  const N = new Ae(), Y = new wt({ color: Wi, transparent: true, opacity: 0.45, side: Vt, depthTest: false }), j = new ct(N, Y);
  j.visible = false, j.renderOrder = 100, h.add(j);
  const X = new Ae(), he = new ft({ color: Hi, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), Q = new Qt(X, he);
  Q.visible = false, Q.renderOrder = 100, h.add(Q);
  const Z = new wt({ color: Lo, transparent: true, opacity: 0.95, depthTest: false }), oe = new wt({ color: Lo, transparent: true, opacity: 0.85, depthTest: false }), se = new sa(1, 1, 1, 12), we = new wt({ color: Lo, transparent: true, opacity: 0.55, side: Vt, depthTest: false }), fe = new ft({ color: Lo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), me = [];
  window.__hekatanModelSelection = me;
  const re = new ut();
  re.renderOrder = 101, h.add(re);
  let G = null;
  const U = document.createElement("div");
  Object.assign(U.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), U.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(U);
  }, 0);
  function I(R) {
    const O = t.derivedNodes.rawVal;
    return !O || R < 0 || R >= O.length ? null : new $(O[R][0], O[R][1], O[R][2]);
  }
  function K(R, O) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    const ie = t.getActiveCamera();
    if (!ie || !t.mesh) return null;
    const ae = t.rendererElm.getBoundingClientRect(), be = R - ae.left, Se = O - ae.top, Re = t.derivedNodes.rawVal, Ee = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Re || !Ee) return null;
    const We = /* @__PURE__ */ new Map(), Ze = (Je) => {
      if (We.has(Je)) return We.get(Je);
      const Pe = I(Je);
      if (!Pe) return We.set(Je, null), null;
      const Le = Pe.clone().project(ie), Ue = (Le.x * 0.5 + 0.5) * ae.width, Ie = (-Le.y * 0.5 + 0.5) * ae.height, nt = { x: Ue, y: Ie, z: Le.z };
      return We.set(Je, nt), nt;
    }, _e = /* @__PURE__ */ new Set();
    for (const Je of Ee) if (Je) for (const Pe of Je) _e.add(Pe);
    const Te = 8;
    let Ne = -1, lt = Te;
    for (let Je = 0; Je < Re.length; Je++) {
      if (!_e.has(Je)) continue;
      const Pe = Ze(Je);
      if (!Pe || Pe.z < -1 || Pe.z > 1) continue;
      const Le = Pe.x - be, Ue = Pe.y - Se, Ie = Math.sqrt(Le * Le + Ue * Ue);
      Ie < lt && (lt = Ie, Ne = Je);
    }
    const Oe = Zi(), gt = qi[Oe.dispUnit] ?? 1e3, yt = Ui[Oe.forceUnit] ?? 1;
    if (Ne >= 0) {
      const Je = Re[Ne];
      let Pe = `Nodo ${Ne}
(${Je[0].toFixed(3)}, ${Je[1].toFixed(3)}, ${Je[2].toFixed(3)})`;
      const Le = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Le == null ? void 0 : Le.deformations) {
        const Ue = Le.deformations.get(Ne);
        if (Ue && (Pe += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Pe += `
Ux = ${At(Ue[0] * gt, 3)} ${Oe.dispUnit}`, Pe += `
Uy = ${At(Ue[1] * gt, 3)} ${Oe.dispUnit}`, Pe += `
Uz = ${At(Ue[2] * gt, 3)} ${Oe.dispUnit}`, (Math.abs(Ue[3]) > 1e-9 || Math.abs(Ue[4]) > 1e-9 || Math.abs(Ue[5]) > 1e-9) && (Pe += `
Rx = ${At(Ue[3] * 1e3, 3)} mrad`, Pe += `
Ry = ${At(Ue[4] * 1e3, 3)} mrad`, Pe += `
Rz = ${At(Ue[5] * 1e3, 3)} mrad`)), Le.reactions) {
          const Ie = Le.reactions.get(Ne);
          Ie && (Math.abs(Ie[0]) > 1e-9 || Math.abs(Ie[1]) > 1e-9 || Math.abs(Ie[2]) > 1e-9 || Math.abs(Ie[3]) > 1e-6 || Math.abs(Ie[4]) > 1e-6 || Math.abs(Ie[5]) > 1e-6) && (Pe += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Pe += `
Fx = ${At(Ie[0] * yt)} ${Oe.forceUnit}`, Pe += `
Fy = ${At(Ie[1] * yt)} ${Oe.forceUnit}`, Pe += `
Fz = ${At(Ie[2] * yt)} ${Oe.forceUnit}`, (Math.abs(Ie[3]) > 1e-6 || Math.abs(Ie[4]) > 1e-6 || Math.abs(Ie[5]) > 1e-6) && (Pe += `
Mx = ${At(Ie[3] * yt)} ${Oe.forceUnit}\xB7m`, Pe += `
My = ${At(Ie[4] * yt)} ${Oe.forceUnit}\xB7m`, Pe += `
Mz = ${At(Ie[5] * yt)} ${Oe.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ne, info: Pe };
    }
    const dn = 5;
    let _t = -1, Ve = dn, tt = "frame";
    for (let Je = 0; Je < Ee.length; Je++) {
      const Pe = Ee[Je];
      if (!(!Pe || Pe.length < 2)) {
        if (Pe.length === 2) {
          const Le = Ze(Pe[0]), Ue = Ze(Pe[1]);
          if (!Le || !Ue || Le.z < -1 || Le.z > 1 || Ue.z < -1 || Ue.z > 1) continue;
          const Ie = Oi(be, Se, Le.x, Le.y, Ue.x, Ue.y);
          Ie < Ve && (Ve = Ie, _t = Je, tt = "frame");
        } else if (Pe.length === 3 || Pe.length === 4) {
          const Le = [];
          let Ue = true;
          for (const Ie of Pe) {
            const nt = Ze(Ie);
            if (!nt || nt.z < -1 || nt.z > 1) {
              Ue = false;
              break;
            }
            Le.push(nt);
          }
          if (!Ue) continue;
          if (Qi(be, Se, Le)) {
            const nt = Le.reduce((it, pt) => it + pt.z, 0) / Le.length * 1e-3;
            nt < Ve && (Ve = nt, _t = Je, tt = "shell");
          }
        } else if (Pe.length === 8) {
          const Le = [];
          let Ue = true;
          for (const Qe of Pe) {
            const rt = Ze(Qe);
            if (!rt || rt.z < -1 || rt.z > 1) {
              Ue = false;
              break;
            }
            Le.push(rt);
          }
          if (!Ue) continue;
          const Ie = Math.min(...Le.map((Qe) => Qe.x)), nt = Math.max(...Le.map((Qe) => Qe.x)), it = Math.min(...Le.map((Qe) => Qe.y)), pt = Math.max(...Le.map((Qe) => Qe.y));
          if (be >= Ie && be <= nt && Se >= it && Se <= pt) {
            const rt = Le.reduce((kt, dt) => kt + dt.z, 0) / Le.length * 1e-3;
            rt < Ve && (Ve = rt, _t = Je, tt = "solid");
          }
        }
      }
    }
    if (_t >= 0) {
      const Je = Ee[_t];
      let Le = `${tt === "frame" ? "Frame" : tt === "shell" ? "Shell" : "Solid"} ${_t}`;
      const Ue = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Ie = (_g = (_f = Ue == null ? void 0 : Ue.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, _t);
      if (Ie) {
        Ie.name && (Le += `
  \u{1F4CB} ${Ie.name}`), Ie.shape && (Le += `
  Shape: ${Ie.shape}`);
        const nt = /concrete|hormig|rect.*sólida/i.test(Ie.shape || ""), it = nt ? 100 : 1e3, pt = nt ? "cm" : "mm", Qe = (kt) => {
          const dt = kt * it;
          return Math.abs(dt - Math.round(dt)) < 0.05 ? `${Math.round(dt)}` : `${dt.toFixed(1)}`;
        }, rt = [];
        if (Ie.D != null && rt.push(`D=${Qe(Ie.D)}`), Ie.B != null && rt.push(`B=${Qe(Ie.B)}`), Ie.TF != null && rt.push(`TF=${Qe(Ie.TF)}`), Ie.TW != null && rt.push(`TW=${Qe(Ie.TW)}`), Ie.t != null && rt.push(`t=${Qe(Ie.t)}`), rt.length && (Le += `
  Dim: ${rt.join(" ")} ${pt}`), Ie.material) {
          let kt = Ie.material;
          Ie.fillMaterial && (kt += ` + FILL "${Ie.fillMaterial}"`), Le += `
  Mat: ${kt}`;
        }
      } else {
        const nt = (_i2 = (_h = Ue == null ? void 0 : Ue.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, _t), it = (_k = (_j = Ue == null ? void 0 : Ue.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, _t);
        nt ? (Le += `
  ${nt}`, it && !nt.includes(it) && (Le += `  (${it})`)) : it && (Le += `
  Material: ${it}`);
      }
      if (Le += `
nodos: [${Je.join(", ")}]`, tt === "shell" && ((_l = t.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const nt = t.mesh.analyzeOutputs.rawVal, it = Ki[Oe.stressUnit] ?? 1, pt = [["bendingXX", "Mxx", yt, `${Oe.forceUnit}\xB7m/m`], ["bendingYY", "Myy", yt, `${Oe.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", yt, `${Oe.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", yt, `${Oe.forceUnit}/m`], ["membraneYY", "Nyy", yt, `${Oe.forceUnit}/m`], ["membraneXY", "Nxy", yt, `${Oe.forceUnit}/m`], ["shearX", "Qx", yt, `${Oe.forceUnit}/m`], ["shearY", "Qy", yt, `${Oe.forceUnit}/m`], ["vonMises", "\u03C3VM", it, Oe.stressUnit], ["pressure", "p", it, Oe.stressUnit]], Qe = [];
        for (const [rt, kt, dt, Ht] of pt) {
          const St = nt == null ? void 0 : nt[rt];
          if (St && St instanceof Map) {
            const Yt = St.get(_t);
            if (Yt != null) {
              if (typeof Yt == "number") Qe.push(`${kt} = ${At(Yt * dt, 3)} ${Ht}`);
              else if (Array.isArray(Yt)) {
                let It = Yt[0];
                for (const Jt of Yt) Math.abs(Jt) > Math.abs(It) && (It = Jt);
                Qe.push(`${kt} = ${At(It * dt, 3)} ${Ht}`);
              }
            }
          }
        }
        Qe.length > 0 && (Le += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Qe.slice(0, 8).join(`
`));
      }
      if (tt === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
        const nt = t.mesh.deformOutputs.rawVal, it = t.mesh.elementInputs.rawVal, pt = nt == null ? void 0 : nt.deformations;
        if (pt && Je.length === 2) {
          const Qe = pt.get(Je[0]), rt = pt.get(Je[1]), kt = Re[Je[0]], dt = Re[Je[1]];
          if (Qe && rt && kt && dt) {
            const Ht = dt[0] - kt[0], St = dt[1] - kt[1], Yt = dt[2] - kt[2], It = Math.sqrt(Ht * Ht + St * St + Yt * Yt);
            if (It > 1e-9) {
              const Jt = Ht / It, uo = St / It, Xt = Yt / It, Mn = (rt[0] - Qe[0]) * Jt + (rt[1] - Qe[1]) * uo + (rt[2] - Qe[2]) * Xt, un = ((_n = it.elasticities) == null ? void 0 : _n.get(_t)) ?? 0, Cn = ((_o = it.areas) == null ? void 0 : _o.get(_t)) ?? 0, An = ((_p = it.momentsOfInertiaY) == null ? void 0 : _p.get(_t)) ?? 0, Jn = ((_q = it.momentsOfInertiaZ) == null ? void 0 : _q.get(_t)) ?? 0, Yo = ((_r = it.torsionalConstants) == null ? void 0 : _r.get(_t)) ?? 0, Zt = ((_s = it.shearModuli) == null ? void 0 : _s.get(_t)) ?? un / 2.6, Bn = un * Cn * (Mn / It), Dn = (rt[3] - Qe[3]) * Jt + (rt[4] - Qe[4]) * uo + (rt[5] - Qe[5]) * Xt, En = Zt * Yo * (Dn / It), Nn = rt[4] - Qe[4], pn = rt[5] - Qe[5], Yn = un * An * Nn / It, Ut = un * Jn * pn / It;
              Le += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Le += `
L = ${At(It, 3)} m`, Le += `
\u0394L = ${At(Mn * gt, 3)} ${Oe.dispUnit}`, Le += `
\u03B5 = ${At(Mn / It, 6)}`, Math.abs(Bn) > 1e-6 && (Le += `
N \u2248 ${At(Bn * yt)} ${Oe.forceUnit}`), Math.abs(En) > 1e-6 && (Le += `
T \u2248 ${At(En * yt)} ${Oe.forceUnit}\xB7m`), Math.abs(Yn) > 1e-6 && (Le += `
My \u2248 ${At(Yn * yt)} ${Oe.forceUnit}\xB7m`), Math.abs(Ut) > 1e-6 && (Le += `
Mz \u2248 ${At(Ut * yt)} ${Oe.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: tt, idx: _t, info: Le };
    }
    return null;
  }
  function q(R, O, ie) {
    var _a2, _b, _c;
    if (_.visible = false, E.visible = false, V.visible = false, j.visible = false, Q.visible = false, !R || !t.mesh) {
      U.style.display = "none", t.render();
      return;
    }
    const ae = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (R.type === "node") {
      const Ee = I(R.idx);
      if (Ee) {
        const We = t.derivedNodes.rawVal ?? [];
        let Ze = 1;
        if (We.length >= 2) {
          let Ne = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Oe of We) for (let gt = 0; gt < 3; gt++) Oe[gt] < Ne[gt] && (Ne[gt] = Oe[gt]), Oe[gt] > lt[gt] && (lt[gt] = Oe[gt]);
          Ze = Math.max(lt[0] - Ne[0], lt[1] - Ne[1], lt[2] - Ne[2], 0.1);
        }
        const _e = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Te = 0.021 * Ze * _e;
        _.position.copy(Ee), _.scale.setScalar(Te), _.visible = true;
      }
    } else if (R.type === "frame" && ae) {
      const Ee = ae[R.idx], We = I(Ee[0]), Ze = I(Ee[1]);
      if (We && Ze) {
        const _e = We.clone().add(Ze).multiplyScalar(0.5), Te = Ze.clone().sub(We), Ne = Te.length(), lt = Math.max(1e-4, 3.5 * De(_e));
        V.position.copy(_e);
        const Oe = new $(0, 1, 0), gt = Oe.clone().cross(Te).normalize(), yt = Oe.angleTo(Te);
        V.quaternion.setFromAxisAngle(gt, yt), V.scale.set(lt, Ne, lt), V.visible = true;
      }
    } else if (R.type === "shell" && ae) {
      const Ee = ae[R.idx], We = [], Ze = [];
      for (const _e of Ee) {
        const Te = I(_e);
        if (!Te) return;
        We.push(Te.x, Te.y, Te.z);
      }
      Ee.length === 4 ? Ze.push(0, 1, 2, 0, 2, 3) : Ee.length === 3 && Ze.push(0, 1, 2), N.setAttribute("position", new Lt(We, 3)), N.setIndex(Ze), N.computeVertexNormals(), j.visible = true;
    } else if (R.type === "solid" && ae) {
      const Ee = ae[R.idx], We = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ze = [];
      for (const [_e, Te] of We) {
        const Ne = I(Ee[_e]), lt = I(Ee[Te]);
        Ne && lt && Ze.push(Ne.x, Ne.y, Ne.z, lt.x, lt.y, lt.z);
      }
      X.setAttribute("position", new Lt(Ze, 3)), Q.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      U.style.display = "none", t.render();
      return;
    }
    U.textContent = R.info, U.style.whiteSpace = "pre-line", U.style.display = "block";
    const Se = t.rendererElm.getBoundingClientRect(), Re = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Se;
    U.style.left = `${O - Re.left}px`, U.style.top = `${ie - Re.top}px`, t.render();
  }
  let L = "", J = 0, de = 0;
  const pe = window.__hekatanHoverDebug ?? false, ce = (R) => {
    J && cancelAnimationFrame(J), J = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const O = K(R.clientX, R.clientY);
      if (pe && de < 5) {
        const ae = t.derivedNodes.rawVal, be = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${R.clientX}, ${R.clientY}) nodes=${(ae == null ? void 0 : ae.length) ?? 0} elems=${(be == null ? void 0 : be.length) ?? 0} hover=`, O), de++;
      }
      const ie = O ? `${O.type}:${O.idx}` : "";
      if (ie !== L) L = ie, q(O, R.clientX, R.clientY);
      else if (O) {
        const ae = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        U.style.left = `${R.clientX - ae.left}px`, U.style.top = `${R.clientY - ae.top}px`;
      }
    });
  };
  let H = null;
  const Me = () => {
    L = "", _.visible = false, E.visible = false, V.visible = false, j.visible = false, Q.visible = false, U.style.display = "none", t.render();
  }, ee = (R) => {
    const O = t.rendererElm.getBoundingClientRect(), ie = R.clientX - O.left, ae = R.clientY - O.top;
    (ie < -2 || ae < -2 || ie > O.width + 2 || ae > O.height + 2) && (H && clearTimeout(H), H = window.setTimeout(Me, 200));
  }, $e = () => {
    H && (clearTimeout(H), H = null);
  };
  t.rendererElm.addEventListener("pointermove", ce), t.rendererElm.addEventListener("pointerleave", ee), t.rendererElm.addEventListener("pointerenter", $e);
  function xe() {
    var _a2, _b, _c;
    const R = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return R === "select" || R === "none" || !R;
  }
  let ge = null;
  t.rendererElm.addEventListener("pointerdown", (R) => {
    R.button === 0 && (ge = { x: R.clientX, y: R.clientY });
  }), t.rendererElm.addEventListener("pointerup", (R) => {
    if (R.button !== 0 || !ge) return;
    const O = R.clientX - ge.x, ie = R.clientY - ge.y;
    if (ge = null, O * O + ie * ie > 9 || !xe()) return;
    const ae = K(R.clientX, R.clientY);
    ae ? (at({ type: ae.type, idx: ae.idx }, R.shiftKey), et()) : Be();
  }), window.addEventListener("keydown", (R) => {
    if (R.key !== "Escape" || !me.length) return;
    const O = document.activeElement, ie = !!O && (O.id === "hk3-cmd-input" || O.id === "hk-dyn-input") && O.value === "";
    O && (O.tagName === "INPUT" || O.tagName === "TEXTAREA" || O.isContentEditable) && !ie || Be();
  }, { capture: true });
  function ve() {
    for (const R of re.children.slice()) {
      re.remove(R);
      const O = R.geometry;
      O && O !== g && O !== se && O.dispose();
    }
  }
  const De = (R) => {
    var _a2;
    const O = t.getActiveCamera(), ie = ((_a2 = t.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return O.isOrthographicCamera ? (O.top - O.bottom) / (O.zoom || 1) / ie : 2 * O.position.distanceTo(R) * Math.tan((O.fov || 50) * Math.PI / 180 / 2) / ie;
  };
  function ze(R, O) {
    var _a2, _b;
    const ie = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (R.type === "node") {
      const ae = I(R.idx);
      if (!ae) return;
      const be = new ct(g, Z);
      be.position.copy(ae), be.scale.setScalar(Math.max(1e-4, 7 * De(ae))), be.renderOrder = 101, re.add(be);
    } else if (R.type === "frame" && ie) {
      const ae = ie[R.idx], be = I(ae[0]), Se = I(ae[1]);
      if (!be || !Se) return;
      const Re = be.clone().add(Se).multiplyScalar(0.5), Ee = Se.clone().sub(be), We = Ee.length(), Ze = Math.max(1e-4, 4 * De(Re)), _e = new ct(se, oe);
      _e.position.copy(Re);
      const Te = new $(0, 1, 0);
      _e.quaternion.setFromAxisAngle(Te.clone().cross(Ee).normalize(), Te.angleTo(Ee)), _e.scale.set(Ze, We, Ze), _e.renderOrder = 101, re.add(_e);
    } else if (R.type === "shell" && ie) {
      const ae = ie[R.idx], be = [], Se = [];
      for (const We of ae) {
        const Ze = I(We);
        if (!Ze) return;
        be.push(Ze.x, Ze.y, Ze.z);
      }
      ae.length === 4 ? Se.push(0, 1, 2, 0, 2, 3) : ae.length === 3 && Se.push(0, 1, 2);
      const Re = new Ae();
      Re.setAttribute("position", new Lt(be, 3)), Re.setIndex(Se), Re.computeVertexNormals();
      const Ee = new ct(Re, we);
      Ee.renderOrder = 101, re.add(Ee);
    } else if (R.type === "solid" && ie) {
      const ae = ie[R.idx], be = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Se = [];
      for (const [We, Ze] of be) {
        const _e = I(ae[We]), Te = I(ae[Ze]);
        _e && Te && Se.push(_e.x, _e.y, _e.z, Te.x, Te.y, Te.z);
      }
      const Re = new Ae();
      Re.setAttribute("position", new Lt(Se, 3));
      const Ee = new Qt(Re, fe);
      Ee.renderOrder = 101, re.add(Ee);
    }
  }
  function et() {
    if (ve(), !me.length || !t.mesh) {
      t.render();
      return;
    }
    const R = t.derivedNodes.rawVal ?? [];
    if (R.length >= 2) {
      const O = [1 / 0, 1 / 0, 1 / 0], ie = [-1 / 0, -1 / 0, -1 / 0];
      for (const ae of R) for (let be = 0; be < 3; be++) ae[be] < O[be] && (O[be] = ae[be]), ae[be] > ie[be] && (ie[be] = ae[be]);
      Math.max(ie[0] - O[0], ie[1] - O[1], ie[2] - O[2], 0.1);
    }
    for (const O of me) ze(O);
    t.render();
  }
  function at(R, O) {
    const ie = me.findIndex((ae) => ae.type === R.type && ae.idx === R.idx);
    ie >= 0 ? me.splice(ie, 1) : O || me.push(R), G = me.length ? me[me.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: G } }));
  }
  function Be() {
    me.length = 0, G = null, et();
  }
  return ue.derive(() => {
    t.derivedNodes.val, me.length && et();
  }), h;
}
function Oi(t, h, g, v, _, z) {
  const P = _ - g, E = z - v, C = P * P + E * E;
  if (C < 1e-9) {
    const he = t - g, Q = h - v;
    return Math.sqrt(he * he + Q * Q);
  }
  let V = ((t - g) * P + (h - v) * E) / C;
  V = Math.max(0, Math.min(1, V));
  const N = g + V * P, Y = v + V * E, j = t - N, X = h - Y;
  return Math.sqrt(j * j + X * X);
}
function Qi(t, h, g) {
  let v = false;
  for (let _ = 0, z = g.length - 1; _ < g.length; z = _++) {
    const P = g[_].x, E = g[_].y, C = g[z].x, V = g[z].y;
    E > h != V > h && t < (C - P) * (h - E) / (V - E + 1e-12) + P && (v = !v);
  }
  return v;
}
const sn = (t) => {
  if (!isFinite(t) || t === 0) return "0";
  const h = Math.abs(t);
  return h >= 1e-3 && h < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
};
function ca(t, h) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], _ = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[h];
  if (!_ || _.length !== 2) throw new Error(`El elemento ${h} no es una barra (2 nudos).`);
  const z = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (ee) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = z[ee]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, h)) ?? 0;
  }, E = g[_[0]], C = g[_[1]], V = P("elasticities"), N = P("shearModuli"), Y = P("areas"), j = P("momentsOfInertiaZ"), X = P("momentsOfInertiaY"), he = P("torsionalConstants");
  let Q = P("shearAreasY"), Z = P("shearAreasZ");
  const oe = Math.hypot(C[0] - E[0], C[1] - E[1], C[2] - E[2]), se = Q < -1e-15, we = Z < -1e-15;
  !se && Q < 1e-15 && Y > 1e-15 && N > 1e-15 && (Q = 5 / 6 * Y), !we && Z < 1e-15 && Y > 1e-15 && N > 1e-15 && (Z = 5 / 6 * Y);
  const fe = !we && Z > 0 && N > 0 ? 12 * V * j / (N * Z * oe * oe) : 0, me = !se && Q > 0 && N > 0 ? 12 * V * X / (N * Q * oe * oe) : 0, re = V * Y / oe, G = N * he / oe, U = 12 * V * j / oe ** 3 / (1 + fe), I = 6 * V * j / oe ** 2 / (1 + fe), K = 4 * V * j / oe * (1 + fe / 4) / (1 + fe), q = 2 * V * j / oe * (1 - fe / 2) / (1 + fe), L = 12 * V * X / oe ** 3 / (1 + me), J = 6 * V * X / oe ** 2 / (1 + me), de = 4 * V * X / oe * (1 + me / 4) / (1 + me), pe = 2 * V * X / oe * (1 - me / 2) / (1 + me);
  let ce = [[re, 0, 0, 0, 0, 0, -re, 0, 0, 0, 0, 0], [0, U, 0, 0, 0, I, 0, -U, 0, 0, 0, I], [0, 0, L, 0, -J, 0, 0, 0, -L, 0, -J, 0], [0, 0, 0, G, 0, 0, 0, 0, 0, -G, 0, 0], [0, 0, -J, 0, de, 0, 0, 0, J, 0, pe, 0], [0, I, 0, 0, 0, K, 0, -I, 0, 0, 0, q], [-re, 0, 0, 0, 0, 0, re, 0, 0, 0, 0, 0], [0, -U, 0, 0, 0, -I, 0, U, 0, 0, 0, -I], [0, 0, -L, 0, J, 0, 0, 0, L, 0, J, 0], [0, 0, 0, -G, 0, 0, 0, 0, 0, G, 0, 0], [0, 0, -J, 0, pe, 0, 0, 0, J, 0, de, 0], [0, I, 0, 0, 0, q, 0, -I, 0, 0, 0, K]];
  const H = (_e = (_d = z.partialFixitySprings) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, h);
  if (H) for (let ee = 0; ee < Math.min(12, H.length); ee++) H[ee] > 1e-12 && (ce[ee][ee] += H[ee]);
  const Me = (_g = (_f = z.momentReleases) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, h);
  if (Me && Me.some(Boolean)) {
    const ee = Me.length >= 12 ? Me.slice(0, 12).map((ze, et) => ze ? et : -1).filter((ze) => ze >= 0) : Me.slice(0, 6).map((ze, et) => ze ? [3, 4, 5, 9, 10, 11][et] : -1).filter((ze) => ze >= 0), $e = [...Array(12).keys()].filter((ze) => !ee.includes(ze)), xe = ee.length, ge = ee.map((ze, et) => [...ee.map((at) => ce[ze][at]), ...ee.map((at, Be) => et === Be ? 1 : 0)]);
    for (let ze = 0; ze < xe; ze++) {
      let et = ze;
      for (let Be = ze + 1; Be < xe; Be++) Math.abs(ge[Be][ze]) > Math.abs(ge[et][ze]) && (et = Be);
      [ge[ze], ge[et]] = [ge[et], ge[ze]];
      const at = ge[ze][ze];
      for (let Be = 0; Be < 2 * xe; Be++) ge[ze][Be] /= at;
      for (let Be = 0; Be < xe; Be++) if (Be !== ze) {
        const R = ge[Be][ze];
        for (let O = 0; O < 2 * xe; O++) ge[Be][O] -= R * ge[ze][O];
      }
    }
    const ve = ge.map((ze) => ze.slice(xe)), De = Array.from({ length: 12 }, () => Array(12).fill(0));
    for (const ze of $e) for (const et of $e) {
      let at = 0;
      for (let Be = 0; Be < xe; Be++) for (let R = 0; R < xe; R++) at += ce[ze][ee[Be]] * ve[Be][R] * ce[ee[R]][et];
      De[ze][et] = ce[ze][et] - at;
    }
    ce = De;
  }
  return { K: ce, L: oe, phiZ: fe, phiY: me };
}
function da(t, h) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], _ = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[h];
  if (!_ || _.length !== 2) throw new Error(`El elemento ${h} no es una barra (2 nudos).`);
  const z = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (he, Q = 0) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = z[he]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, h)) ?? Q;
  }, E = g[_[0]], C = g[_[1]], V = (_e = (_d = z.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, h), N = (_g = (_f = z.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, h), Y = P("localAngles", 0), j = [], X = (he = "") => j.push(he);
  if (X("% ============================================================"), X(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${h + 1} (indice ${h} del motor)`), X("%  Generado por Hekatan Struct con los datos que recibe el motor."), X("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), X("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), X("% ============================================================"), X(), X("% --- Datos de la barra -------------------------------------------------"), X(`xi = [${E.map(sn).join(" ")}];      % nudo i (${_[0]})`), X(`xj = [${C.map(sn).join(" ")}];      % nudo j (${_[1]})`), X(`E  = ${sn(P("elasticities"))};      % modulo de elasticidad`), X(`G  = ${sn(P("shearModuli"))};      % modulo de cortante`), X(`A  = ${sn(P("areas"))};      % area`), X(`Iz = ${sn(P("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), X(`Iy = ${sn(P("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), X(`J  = ${sn(P("torsionalConstants"))};      % constante de torsion`), X(`AsY = ${sn(P("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), X(`AsZ = ${sn(P("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), Y && X(`% ang = ${sn(Y)} grados: gira la seccion en T, NO cambia esta matriz local.`), X(), X("L = sqrt(sum((xj - xi).^2));"), X(), X("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), X("bernY = AsY < 0;   bernZ = AsZ < 0;"), X("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), X("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), X("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), X("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), X(), X("EA_L = E*A/L;          % axial"), X("GJ_L = G*J/L;          % torsion"), X("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), X("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), X("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), X("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), X(), X("% --- Matriz local (misma disposicion que el C++) ----------------------"), X("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), X("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), X("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), X("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), X("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), X("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), X("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), X("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), X("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), X("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), X("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), X("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), N && N.some((he) => he > 1e-12) && (X(), X("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), X(`kres = [${N.slice(0, 12).map(sn).join(" ")}];`), X("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), V && V.some(Boolean)) {
    const he = V.length >= 12 ? V.slice(0, 12).map((Q, Z) => Q ? Z + 1 : 0).filter(Boolean) : V.slice(0, 6).map((Q, Z) => Q ? [4, 5, 6, 10, 11, 12][Z] : 0).filter(Boolean);
    X(), X("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), X(`f = [${he.join(" ")}];              % GDL liberados`), X("r = setdiff(1:12, f);                % GDL que quedan"), X("Kc = zeros(12);"), X("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), X("K = Kc;");
  }
  return X(), X("% --- Resultado ---------------------------------------------------------"), X(`fprintf('Barra ${h + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), X("disp('K local (12x12):');"), X("disp(K);"), { nombre: `K_local_barra_${h + 1}.m`, texto: j.join(`
`) + `
` };
}
const ji = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, el = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, zn = 1e-3;
function io(t, h) {
  return h === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : h === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function tl(t, h) {
  const g = Math.abs(h[0] - t[0]);
  return Math.abs(h[1] - t[1]) < zn ? { plano: "XZ", en: t[1] } : g < zn ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function nl(t, h) {
  var _a2, _b;
  let g = null, v = { plano: "XZ", en: 0 };
  const _ = () => {
    var _a3, _b2;
    const G = ((_a3 = h == null ? void 0 : h.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = h == null ? void 0 : h.frameResults) == null ? void 0 : _b2.val);
    return !G || G === "none" ? null : String(G).replace(/^contour:/, "");
  }, z = (G) => {
    var _a3, _b2;
    const U = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], I = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], K = /* @__PURE__ */ new Set();
    for (const q of I) {
      if (q.length !== 2) continue;
      const L = U[q[0]], J = U[q[1]];
      if (!L || !J) continue;
      const de = io(L, G), pe = io(J, G);
      Math.abs(de.fuera - pe.fuera) < zn && K.add(Math.round(de.fuera * 1e3) / 1e3);
    }
    return [...K].sort((q, L) => q - L);
  };
  function P(G) {
    var _a3, _b2;
    if (G == null ? void 0 : G.plano) v = { plano: G.plano, en: G.en ?? z(G.plano)[0] ?? 0 };
    else {
      const I = [...window.__hekatanModelSelection ?? []].reverse().find((L) => L.type === "frame"), K = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], q = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      I && q[I.idx] && K[q[I.idx][0]] && K[q[I.idx][1]] ? v = tl(K[q[I.idx][0]], K[q[I.idx][1]]) : v = { plano: "XZ", en: z("XZ")[0] ?? 0 };
    }
    g || E(), g.hidden = false, C();
  }
  function E() {
    if (g = document.createElement("div"), g.id = "hk-diagrama-2d", g.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), g.innerHTML = `
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
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(g), !document.getElementById("hk-d2-hidden-css")) {
      const L = document.createElement("style");
      L.id = "hk-d2-hidden-css", L.textContent = "#hk-diagrama-2d[hidden]{display:none !important;}", document.head.appendChild(L);
    }
    g.querySelector(".hk-d2-x").addEventListener("click", () => {
      g.hidden = true;
    });
    const G = g.querySelector(".hk-d2-plano"), U = g.querySelector(".hk-d2-en");
    G.addEventListener("change", () => {
      v = { plano: G.value, en: z(G.value)[0] ?? 0 }, C();
    }), U.addEventListener("change", () => {
      v.en = Number(U.value), C();
    });
    const I = (L) => {
      const J = z(v.plano), de = J.findIndex((ce) => Math.abs(ce - v.en) < zn), pe = Math.max(0, Math.min(J.length - 1, (de < 0 ? 0 : de) + L));
      J.length && (v.en = J[pe], C());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => I(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => I(1));
    const K = g.querySelector(".hk-d2-bar");
    let q = null;
    K.addEventListener("pointerdown", (L) => {
      if (L.target.closest("select,button")) return;
      const J = g.getBoundingClientRect();
      q = { x: L.clientX, y: L.clientY, l: J.left, t: J.top }, g.style.transform = "none", g.style.left = J.left + "px", g.style.top = J.top + "px";
    }), window.addEventListener("pointermove", (L) => {
      !q || !g || (g.style.left = q.l + L.clientX - q.x + "px", g.style.top = q.t + L.clientY - q.y + "px");
    }), window.addEventListener("pointerup", () => {
      q = null;
    }), new ResizeObserver(() => {
      g && !g.hidden && C();
    }).observe(g);
  }
  function C() {
    var _a3, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const G = new Set(Y && !Y.hidden && j >= 0 ? he(j) : []), U = g.querySelector(".hk-d2-svg"), I = g.querySelector(".hk-d2-tit"), K = g.querySelector(".hk-d2-pie"), q = g.querySelector(".hk-d2-plano"), L = g.querySelector(".hk-d2-en");
    q.value = v.plano;
    const J = z(v.plano), de = v.plano === "XZ" ? "y" : v.plano === "YZ" ? "x" : "z", pe = v.plano === "XY" ? "Planta" : "P\xF3rtico";
    L.innerHTML = J.map((Ve, tt) => `<option value="${Ve}" ${Math.abs(Ve - v.en) < zn ? "selected" : ""}>${pe} ${tt + 1} \xB7 ${de} = ${Ve.toFixed(2)} m</option>`).join("");
    const ce = _(), H = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], Me = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], ee = ce ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[ce] : null;
    U.innerHTML = "";
    const $e = U.clientWidth || 880, xe = U.clientHeight || 480, ge = [];
    if (Me.forEach((Ve, tt) => {
      if (Ve.length !== 2) return;
      const Je = H[Ve[0]], Pe = H[Ve[1]];
      if (!Je || !Pe) return;
      const Le = io(Je, v.plano), Ue = io(Pe, v.plano);
      Math.abs(Le.fuera - v.en) < zn && Math.abs(Ue.fuera - v.en) < zn && ge.push({ i: tt, a: Le, b: Ue });
    }), !ge.length) {
      K.textContent = "No hay barras en este plano.", I.textContent = "";
      return;
    }
    let ve = 1 / 0, De = -1 / 0, ze = 1 / 0, et = -1 / 0;
    for (const Ve of ge) for (const tt of [Ve.a, Ve.b]) ve = Math.min(ve, tt.u), De = Math.max(De, tt.u), ze = Math.min(ze, tt.v), et = Math.max(et, tt.v);
    const at = De - ve || 1, Be = et - ze || 1, R = 0.12 * Math.max(at, Be), O = 46, ie = Math.min(($e - 2 * O) / (at + 2 * R), (xe - 2 * O) / (Be + 2 * R)), ae = ($e - at * ie) / 2, be = (xe - Be * ie) / 2, Se = (Ve) => ae + (Ve - ve) * ie, Re = (Ve) => xe - (be + (Ve - ze) * ie), Ee = "http://www.w3.org/2000/svg", We = (Ve, tt, Je) => {
      const Pe = document.createElementNS(Ee, Ve);
      for (const Le in tt) Pe.setAttribute(Le, String(tt[Le]));
      return Je != null && (Pe.textContent = Je), U.appendChild(Pe), Pe;
    }, Ze = /* @__PURE__ */ new Map();
    for (const Ve of ge) {
      const tt = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Ve.i)) ?? 0, Je = io(_a(ce ?? "normals", va(H[Me[Ve.i][0]], H[Me[Ve.i][1]], tt)), v.plano), Pe = Math.hypot(Je.u, Je.v);
      Ze.set(Ve.i, Pe > 0.3 ? [Je.u / Pe, -Je.v / Pe] : null);
    }
    const _e = ge.filter((Ve) => !Ze.get(Ve.i)).length;
    let Te = 0;
    if (ee) for (const Ve of ge) {
      if (!Ze.get(Ve.i)) continue;
      const tt = ee instanceof Map ? ee.get(Ve.i) : ee[Ve.i];
      tt && (Te = Math.max(Te, Math.abs(tt[0] ?? 0), Math.abs(tt[1] ?? 0)));
    }
    const Ne = 0.12 * Math.max(at, Be) * ie, lt = Te > 0 ? Ne / Te : 0, Oe = ce === "bendingsY" || ce === "bendingsZ", gt = (Ve) => Math.abs(Ve) >= 100 ? Ve.toFixed(1) : Math.abs(Ve) >= 10 ? Ve.toFixed(2) : Ve.toFixed(3), yt = [];
    for (const Ve of ge) {
      const tt = Se(Ve.a.u), Je = Re(Ve.a.v), Pe = Se(Ve.b.u), Le = Re(Ve.b.v), Ue = Ze.get(Ve.i), [Ie, nt] = Ue ?? [0, 0], it = ee && Ue ? ee instanceof Map ? ee.get(Ve.i) : ee[Ve.i] : null, [pt, Qe] = it ? ws(ce, it) : [0, 0];
      if (it && lt > 0) {
        const Ht = [tt + Ie * pt * lt * 1, Je + nt * pt * lt * 1], St = [Pe + Ie * Qe * lt * 1, Le + nt * Qe * lt * 1], Jt = pt + Qe >= 0 ? "#3fa7d6" : "#d9534f";
        We("polygon", { points: `${tt},${Je} ${Ht[0]},${Ht[1]} ${St[0]},${St[1]} ${Pe},${Le}`, fill: Jt, "fill-opacity": 0.38, stroke: Jt, "stroke-width": 1.2 }), yt.push({ x: Ht[0] + Ie * 12, y: Ht[1] + nt * 12, t: gt(pt), peso: Math.abs(pt) }), yt.push({ x: St[0] + Ie * 12, y: St[1] + nt * 12, t: gt(Qe), peso: Math.abs(Qe) });
      }
      We("line", { x1: tt, y1: Je, x2: Pe, y2: Le, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), G.has(Ve.i) && We("line", { x1: tt, y1: Je, x2: Pe, y2: Le, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const rt = We("line", { x1: tt, y1: Je, x2: Pe, y2: Le, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      rt.addEventListener("click", () => Q(Ve.i));
      const kt = document.createElementNS(Ee, "title");
      kt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", rt.appendChild(kt);
    }
    for (const Ve of ge) for (const tt of [Ve.a, Ve.b]) v.plano !== "XY" && Math.abs(tt.v - ze) < zn && We("rect", { x: Se(tt.u) - 6, y: Re(tt.v), width: 12, height: 7, fill: "#b03a3a" });
    const dn = [];
    yt.sort((Ve, tt) => tt.peso - Ve.peso);
    for (const Ve of yt) Ve.peso < 0.02 * Te || dn.some((tt) => Math.hypot(tt.x - Ve.x, tt.y - Ve.y) < 34) || (dn.push(Ve), We("text", { x: Ve.x, y: Ve.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Ve.t));
    const _t = ce ? ji[ce] ?? ce : "sin resultado";
    I.textContent = `${_t} \xB7 ${v.plano === "XY" ? "planta" : "alzado"} ${v.plano} en ${de} = ${v.en.toFixed(2)} m`, K.textContent = ce ? `${ge.length} barras en el plano \xB7 m\xE1ximo ${gt(Te)} ${el[ce] ?? ""}` + (Oe ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (_e ? ` \xB7 ${_e} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const V = () => {
    try {
      C();
    } catch {
    }
  };
  (h == null ? void 0 : h.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    h.frameResults.val, V();
  }));
  let N = null;
  setInterval(() => {
    var _a3, _b2;
    const G = (_a3 = t.analyzeOutputs) == null ? void 0 : _a3.rawVal, U = (_b2 = h == null ? void 0 : h.frameResults) == null ? void 0 : _b2.rawVal, I = [G, U];
    if (!(N && N[0] === G && N[1] === U)) {
      N = I, V();
      try {
        oe();
      } catch {
      }
    }
  }, 400);
  let Y = null, j = -1, X = "12";
  function he(G) {
    var _a3, _b2;
    const U = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], I = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], K = /* @__PURE__ */ new Map();
    I.forEach((de, pe) => {
      if (de.length === 2) for (const ce of de) K.has(ce) || K.set(ce, []), K.get(ce).push(pe);
    });
    const q = (de) => {
      const pe = U[I[de][0]], ce = U[I[de][1]], H = [ce[0] - pe[0], ce[1] - pe[1], ce[2] - pe[2]], Me = Math.hypot(H[0], H[1], H[2]) || 1;
      return H.map((ee) => ee / Me);
    }, L = (de, pe) => {
      const ce = q(de), H = q(pe);
      return Math.abs(ce[0] * H[0] + ce[1] * H[1] + ce[2] * H[2]) > 0.9999;
    }, J = [G];
    for (const de of [0, 1]) {
      let pe = G, ce = I[G][de];
      for (let H = 0; H < 500; H++) {
        const Me = (K.get(ce) ?? []).filter(($e) => $e !== pe);
        if (Me.length !== 1 || !L(pe, Me[0])) break;
        const ee = Me[0];
        de === 0 ? J.unshift(ee) : J.push(ee), ce = I[ee][0] === ce ? I[ee][1] : I[ee][0], pe = ee;
      }
    }
    return J;
  }
  function Q(G) {
    if (G == null) {
      const I = [...window.__hekatanModelSelection ?? []].reverse().find((K) => K.type === "frame");
      if (!I) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      G = I.idx;
    }
    j = G, Y || (Y = document.createElement("div"), Y.id = "hk-diagrama-barra", Y.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), Y.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-k" title="Descarga un script MATLAB (Hekatan Lab / Octave) con la matriz de rigidez local 12\xD712 de esta barra" style="background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px;white-space:nowrap">\u{1F4C4} K local .m</button><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(Y), Y.querySelector(".hk-b-x").addEventListener("click", () => {
      Y.hidden = true, Z(), C();
    }), Y.querySelector(".hk-b-k").addEventListener("click", () => {
      j >= 0 && se(j);
    }), Y.querySelector(".hk-b-pl").addEventListener("change", (U) => {
      X = U.target.value, oe();
    })), Y.hidden = false, Z(), oe(), C();
  }
  function Z() {
    if (!g || !Y) return;
    const G = window.innerWidth, U = Math.min(560, Math.round(G * 0.4));
    Y.style.width = U + "px", !Y.hidden && !g.hidden ? (g.style.transform = "none", g.style.left = "12px", g.style.width = G - U - 36 + "px", Y.style.top = g.getBoundingClientRect().top + "px") : g.hidden || (g.style.left = "50%", g.style.transform = "translateX(-50%)", g.style.width = "min(900px,92vw)");
  }
  function oe() {
    var _a3, _b2, _c;
    if (!Y || Y.hidden || j < 0) return;
    const G = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], U = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], I = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!U[j]) return;
    const K = he(j), q = [];
    let L = 0, J = -1;
    K.forEach((De, ze) => {
      const [et, at] = U[De], Be = ze === 0 ? K.length > 1 && U[K[1]].includes(et) : et !== J, R = Be ? at : et, O = Be ? et : at, ie = Math.hypot(G[O][0] - G[R][0], G[O][1] - G[R][1], G[O][2] - G[R][2]);
      q.push({ x: L, e: De, fin: Be ? 1 : 0 }), L += ie, q.push({ x: L, e: De, fin: Be ? 0 : 1 }), J = O;
    });
    const de = L, pe = (De, ze) => {
      const et = I[De], at = et ? et instanceof Map ? et.get(ze.e) : et[ze.e] : null;
      return at ? ws(De, at)[ze.fin] : 0;
    }, ce = G[U[K[0]][0]], H = (De) => De.toFixed(2);
    Y.querySelector(".hk-b-tit").textContent = "L = " + de.toFixed(2) + " m \xB7 " + K.length + " tramo(s) \xB7 desde (" + H(ce[0]) + ", " + H(ce[1]) + ", " + H(ce[2]) + ")";
    const Me = X === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], ee = Y.querySelector(".hk-b-cuerpo");
    ee.innerHTML = "";
    const $e = Math.max(300, ee.clientWidth), xe = 124, ge = 46, ve = (xe - 14) / 2;
    for (const [De, ze, et, at] of Me) {
      const Be = q.map((Te) => pe(De, Te)), R = Math.max(...Be), O = Math.min(...Be), ie = Math.max(Math.abs(R), Math.abs(O)) || 1, ae = (Te) => ge + Te / (de || 1) * ($e - 2 * ge), be = (Te) => ve + (at ? 1 : -1) * (Te / ie) * (ve - 16), Se = (Te) => Math.abs(Te) >= 100 ? Te.toFixed(1) : Math.abs(Te) >= 10 ? Te.toFixed(2) : Te.toFixed(3);
      let Re = ae(0) + "," + ve + " ";
      q.forEach((Te, Ne) => {
        Re += ae(Te.x) + "," + be(Be[Ne]) + " ";
      }), Re += ae(de) + "," + ve;
      const Ee = Be.indexOf(R), We = Be.indexOf(O), Ze = (Te, Ne) => {
        const lt = be(Be[Te]) + (be(Be[Te]) < ve ? -5 : 13);
        return '<text x="' + ae(q[Te].x) + '" y="' + lt + '" text-anchor="middle" fill="' + Ne + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Se(Be[Te]) + "</text>";
      }, _e = at ? "#d9534f" : "#3fa7d6";
      ee.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + ze + ' <span style="color:#6f7d90;font-weight:400">(' + et + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Se(R) + " \xB7 m\xEDn " + Se(O) + (at ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + $e + '" height="' + xe + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + ge + '" y1="' + ve + '" x2="' + ($e - ge) + '" y2="' + ve + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Re + '" fill="' + _e + '" fill-opacity=".35" stroke="' + _e + '" stroke-width="1.4"/>' + Ze(0, "#f2f5fa") + Ze(q.length - 1, "#f2f5fa") + (Ee > 0 && Ee < q.length - 1 ? Ze(Ee, "#8fd3ff") : "") + (We > 0 && We < q.length - 1 && We !== Ee ? Ze(We, "#ff9f9a") : "") + '<text x="' + ge + '" y="' + (xe - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + ($e - ge) + '" y="' + (xe - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + de.toFixed(2) + " m</text></svg>");
    }
  }
  window.__hekatanDiagramaBarra = Q;
  function se(G) {
    const { nombre: U, texto: I } = da(t, G), K = URL.createObjectURL(new Blob([I], { type: "text/plain" })), q = document.createElement("a");
    q.href = K, q.download = U, document.body.appendChild(q), q.click(), setTimeout(() => {
      URL.revokeObjectURL(K), q.remove();
    }, 1e3);
  }
  window.__hekatanKLocalMatlab = (G, U = false) => {
    if (G == null) {
      const K = [...window.__hekatanModelSelection ?? []].reverse().find((q) => q.type === "frame");
      if (!K) return null;
      G = K.idx;
    }
    return U && se(G), da(t, G);
  };
  let we = null, fe = null, me = -1;
  function re(G) {
    if (me = G, !fe) {
      fe = document.createElement("div"), fe.id = "hk-klocal", fe.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(fe);
      const L = document.createElement("style");
      L.textContent = "#hk-klocal[hidden]{display:none!important}", document.head.appendChild(L);
    }
    let U;
    try {
      U = ca(t, G);
    } catch (L) {
      alert(String(L));
      return;
    }
    const I = (L) => Math.abs(L) < 1e-12 ? "0" : Math.abs(L) >= 1e5 || Math.abs(L) < 0.01 ? L.toExponential(4) : L.toPrecision(6), K = ["u1 i", "u2 i", "u3 i", "\u03B81 i", "\u03B82 i", "\u03B83 i", "u1 j", "u2 j", "u3 j", "\u03B81 j", "\u03B82 j", "\u03B83 j"], q = U.K.map((L, J) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${K[J]}</th>` + L.map((de) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(de) < 1e-12 ? "#4a5568" : de < 0 ? "#ff9f9a" : "#e6edf5"}">${I(de)}</td>`).join("") + "</tr>").join("");
    fe.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${G + 1}</b><span style="color:#9fb0c6">L = ${U.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${U.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${U.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${K.map((L) => `<th style="color:#9fb0c6;padding:2px 6px">${L}</th>`).join("")}</tr>${q}</table></div>`, fe.querySelector(".hk-k-x").addEventListener("click", () => {
      fe.hidden = true;
    }), fe.querySelector(".hk-k-m").addEventListener("click", () => se(me)), fe.hidden = false;
  }
  return window.addEventListener("hk:model-selection", (G) => {
    var _a3;
    const U = (_a3 = G.detail) == null ? void 0 : _a3.ultimo;
    we || (we = document.createElement("button"), we.id = "hk-klocal-chip", we.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(we), we.addEventListener("click", () => {
      const I = Number(we.dataset.idx);
      I >= 0 && re(I);
    })), U && U.type === "frame" ? (we.dataset.idx = String(U.idx), we.textContent = `\u{1F4D0} Ver K local \xB7 barra ${U.idx + 1}`, we.hidden = false, fe && !fe.hidden && re(U.idx)) : we.hidden = true;
  }), window.__hekatanKLocal = (G) => ca(t, G), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = P, { abrir: P, abrirBarra: Q };
}
function ua(t, h = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(h)), setTimeout(() => {
    ue.derive(() => {
      No.val, g.style.background = fi();
    });
  });
  const v = document.createElement("div");
  v.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(v), setTimeout(() => {
    ue.derive(() => {
      v.textContent = ys.val ? `[${ys.val}]` : "";
    });
  });
  const _ = Array.from({ length: h + 1 }, (C, V) => V / h).reverse();
  let z, P;
  _.forEach((C, V) => {
    z = document.createElement("div"), z.id = `marker-${V}`, z.className = "marker", z.style.marginTop = V == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", P = document.createElement("p"), P.id = `marker-text-${V}`, z.append(P), g.append(z);
  });
  const E = [];
  return g.querySelectorAll("p").forEach((C) => E.push(C)), setTimeout(() => {
    ue.derive(() => {
      _.forEach((C, V) => {
        const N = E[V];
        N && (N.innerText = ol(t.val, C).toString());
      });
    });
  }), g;
}
function ol(t, h) {
  const g = co.val;
  if (g) return pa(g[0] + h * (g[1] - g[0]));
  const v = t.filter((P) => Number.isFinite(P));
  if (v.length === 0) return "0";
  const [_, z] = xs(v);
  return pa(_ + h * (z - _));
}
function pa(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const h = Math.abs(t);
  return h < 1e-3 || h >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function ml({ mesh: t, settingsObj: h, drawingObj: g, objects3D: v, solids: _ }) {
  di.DEFAULT_UP = new $(0, 0, 1);
  const z = document.createElement("div"), P = new ii(), E = new li(45, 1, 0.1, 2 * 1e6), C = new ri(-10, 10, 10, -10, -1e3, 2e6);
  let V = E;
  const N = new ci({ antialias: true });
  N.localClippingEnabled = true;
  const Y = new aa(E, N.domElement);
  Y.enableDamping = true, Y.dampingFactor = 0.1, Y.screenSpacePanning = true, Y.zoomSpeed = 0.8, Y.panSpeed = 1.2, Y.rotateSpeed = 0.9, Y.keyPanSpeed = 12, Y.listenToKeyEvents(window), Y.touches = { ONE: $o.ROTATE, TWO: $o.DOLLY_PAN }, N.domElement.addEventListener("wheel", (R) => {
    if (!R.ctrlKey && Math.abs(R.deltaX) > Math.abs(R.deltaY) * 1.5) {
      R.preventDefault();
      const O = Y.target, ie = new $().subVectors(E.position, O), ae = new $();
      ae.crossVectors(E.up, ie).normalize();
      const Se = ie.length() * 1e-3 * Y.panSpeed;
      O.addScaledVector(ae, R.deltaX * Se), E.position.addScaledVector(ae, R.deltaX * Se), Y.update();
    }
  }, { passive: false });
  const j = new ds(new $(-1, 0, 0), 0), X = new ds(new $(0, -1, 0), 0), he = new ds(new $(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function Q() {
    const R = window.__hekatanClip, O = [];
    R.enableX && (j.normal.set(R.invertX ? 1 : -1, 0, 0), j.constant = R.invertX ? -R.posX : R.posX, O.push(j)), R.enableY && (X.normal.set(0, R.invertY ? 1 : -1, 0), X.constant = R.invertY ? -R.posY : R.posY, O.push(X)), R.enableZ && (he.normal.set(0, 0, R.invertZ ? 1 : -1), he.constant = R.invertZ ? -R.posZ : R.posZ, O.push(he)), N.clippingPlanes = O, P.traverse((ae) => {
      const be = ae;
      if (be.material) {
        const Se = Array.isArray(be.material) ? be.material : [be.material];
        for (const Re of Se) Re.clippingPlanes = O, Re.needsUpdate = true;
      }
    });
    const ie = window.__hekatanPanes ?? [];
    for (const ae of ie) try {
      ae && typeof ae.refresh == "function" && ae.refresh();
    } catch {
    }
    N.render(P, V);
  }
  Q(), window.__hekatanClipApply = Q;
  const Z = wi(h), oe = ue.derive(() => Math.pow(10, Z.displayScale.val / 10)), se = sl(t, Z), we = () => {
    const R = [];
    return Z.gridXY.rawVal && R.push("xy"), Z.gridXZ.rawVal && R.push("xz"), Z.gridYZ.rawVal && R.push("yz"), R;
  }, fe = () => {
    const R = Z.gridStep.rawVal, O = Math.max(R, Z.gridMajor.rawVal);
    return { planes: we(), majorStep: O, minorStep: R };
  };
  let me = ps(Z.gridSize.rawVal, fe());
  me.visible = Z.gridVisible.rawVal, window.__hekatanSnap2D = Z.cursorSnap.rawVal;
  const re = () => {
    const R = Math.max(0, Math.min(1, Z.gridOpacity.rawVal));
    me.traverse((O) => {
      const ie = O.material;
      if (!ie || !("opacity" in ie)) return;
      const ae = O.name ?? "";
      let be = 0.55;
      ae.includes("border") ? be = 1 : ae.includes("major") && (be = 0.95), ie.opacity = R * be;
    });
  };
  re(), z.appendChild(mi(Z, t, _)), z.setAttribute("id", "viewer"), z.appendChild(N.domElement), N.setPixelRatio(window.devicePixelRatio);
  const G = Rn();
  N.setClearColor(G.background, 1);
  const U = Z.gridSize.rawVal, I = U * 0.5 + U * 0.5 / Math.tan(45 * 0.5);
  E.position.set(0, 0, I), E.up.set(0, 1, 0), Y.target.set(0, 0, 0), Y.minDistance = 0.1, Y.maxDistance = 1e4, z.__settings = Z, Y.zoomSpeed = 1, Y._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, Y.update();
  let K = la(Z.gridSize.rawVal, Z.flipAxes.rawVal);
  P.add(me, K), ue.derive(() => {
    window.__hekatanGridPlaneXY = Z.gridXY.val, window.__hekatanGridPlaneXZ = Z.gridXZ.val, window.__hekatanGridPlaneYZ = Z.gridYZ.val;
  });
  let q = true;
  ue.derive(() => {
    const R = Z.gridVisible.val;
    if (q) {
      q = false;
      return;
    }
    me.visible = R, ee();
  });
  let L = true;
  ue.derive(() => {
    if (Z.gridOpacity.val, L) {
      L = false;
      return;
    }
    re(), ee();
  }), ue.derive(() => {
    const R = Z.cursorSnap.val;
    window.__hekatanSnap2D = R;
  });
  let J = true;
  ue.derive(() => {
    var _a2, _b, _c;
    const R = Z.gridSize.val, O = Z.flipAxes.val;
    if (Z.gridXY.val, Z.gridXZ.val, Z.gridYZ.val, Z.gridStep.val, Z.gridMajor.val, J) {
      J = false;
      return;
    }
    P.remove(me), (_a2 = me.traverse) == null ? void 0 : _a2.call(me, (Se) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Se.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), me = ps(R, fe()), me.visible = Z.gridVisible.rawVal, P.add(me), re(), P.remove(K), K.traverse((Se) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Se.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), K = la(R, O), P.add(K);
    const ie = R * 0.5 + R * 0.5 / Math.tan(45 * 0.5);
    E.position.distanceTo(Y.target);
    const ae = Math.abs(E.position.x) < 0.1 && Math.abs(E.position.y) < 0.1 && E.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ae ? E.position.set(0, 0, ie) : E.position.set(0.5 * R, -ie, 0.5 * R), Y.target.set(0, 0, 0)), Y.minDistance = Math.max(0.05, R * 0.01), Y.maxDistance = Math.max(50, R * 50), Y.update(), ee();
  }), new ResizeObserver((R) => {
    var _a2, _b;
    for (const O of R) {
      const ie = (_a2 = O.target) == null ? void 0 : _a2.clientWidth, ae = (_b = O.target) == null ? void 0 : _b.clientHeight;
      if (ie === 0 || ae === 0) continue;
      const Se = (pe ? ie / 2 : ie) / ae;
      E.aspect = Se, E.updateProjectionMatrix();
      const Re = C.top;
      if (C.left = -Re * Se, C.right = Re * Se, C.updateProjectionMatrix(), ce && ce.isPerspectiveCamera) ce.aspect = Se, ce.updateProjectionMatrix();
      else if (ce && ce.isOrthographicCamera) {
        const Ee = ce, We = Ee.top;
        Ee.left = -We * Se, Ee.right = We * Se, Ee.updateProjectionMatrix();
      }
      N.setSize(ie, ae), ee();
    }
  }).observe(z), Y.addEventListener("change", ee), ue.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, Z.displayScale.val, Z.nodes.val, Z.elements.val, (_g = Z.edges) == null ? void 0 : _g.val, Z.elemColumns.val, Z.elemBeams.val, Z.nodesIndexes.val, Z.elementsIndexes.val, Z.orientations.val, Z.sections.val, Z.secColumns.val, Z.secBeams.val, Z.secFloor.val, Z.supports.val, Z.loads.val, Z.deformedShape.val, Z.nodeResults.val, Z.frameResults.val, Z.shellResults.val, (_h = Z.solidResults) == null ? void 0 : _h.val, (_i2 = Z.extruded) == null ? void 0 : _i2.val, setTimeout(ee);
  });
  let pe = false, ce = null, H = null, Me = false;
  function ee() {
    const R = z.clientWidth || 1, O = z.clientHeight || 1;
    if (!pe || !ce) {
      N.setScissorTest(false), N.setViewport(0, 0, R, O), N.render(P, V);
      return;
    }
    const ie = R / 2;
    N.setScissorTest(true), N.setViewport(0, 0, ie, O), N.setScissor(0, 0, ie, O), N.render(P, V), N.setViewport(ie, 0, ie, O), N.setScissor(ie, 0, ie, O), N.render(P, ce), N.setScissorTest(false);
  }
  function $e(R) {
    V = R, Y.object = R, Y.update(), ee();
  }
  function xe(R, O) {
    pe = R, O && (ce = O);
    const ie = z.clientWidth || 1, ae = z.clientHeight || 1, Se = (R ? ie / 2 : ie) / ae;
    E.isPerspectiveCamera && (E.aspect = Se, E.updateProjectionMatrix());
    const Re = C.top;
    if (C.left = -Re * Se, C.right = Re * Se, C.updateProjectionMatrix(), R && ce) {
      if (H ? (H.object = ce, H.update()) : (H = new aa(ce, N.domElement), H.enableDamping = true, H.dampingFactor = 0.1, H.screenSpacePanning = true, H.zoomSpeed = 0.8, H.panSpeed = 1.2, H.rotateSpeed = 0.9, H.touches = { ONE: $o.ROTATE, TWO: $o.DOLLY_PAN }, H.target.copy(Y.target), H.addEventListener("change", ee), H.enabled = false), !Me) {
        const Ee = (We) => {
          if (!pe || !H) return;
          const Ze = N.domElement.getBoundingClientRect(), _e = We.clientX - Ze.left, Te = Ze.width / 2, Ne = _e >= Te;
          Y.enabled = !Ne, H.enabled = Ne;
        };
        N.domElement.addEventListener("pointerdown", Ee, true), N.domElement.addEventListener("wheel", Ee, { capture: true, passive: true }), Me = true;
      }
    } else R || (Y.enabled = true, H && (H.enabled = false));
    z.__splitMode = R, window.__hekatanSplitMode = R, window.__hekatanSplitCamera = R ? ce : null, ee();
  }
  if (t) {
    P.add(yi(Z, se, oe), ui(t, Z, se), bi(Z, se, oe), Mi(t, Z, se, oe), xi(t, Z, se, oe), gi(t, Z, se, oe), ki(t, Z, se, oe), Pi(t, Z, se, oe), Ei(t, Z, se), Li(t, Z, se, oe), Fi(t, Z, se, oe)), window.__hekatanDiagrama2D || (nl(t, Z), N.domElement.addEventListener("dblclick", () => {
      var _a2;
      const Ee = (_a2 = Z.frameResults) == null ? void 0 : _a2.rawVal;
      !Ee || Ee === "none" || !(window.__hekatanModelSelection ?? []).some((Ze) => Ze.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const R = Ji({ scene: P, rendererElm: N.domElement, getActiveCamera: () => V, derivedNodes: se, derivedDisplayScale: oe, mesh: t, settings: Z, render: ee });
    P.add(R);
    const O = dl(t, Z), ie = Ri(t, Z, se, O), ae = ua(O);
    P.add(ie), z.appendChild(ae);
    const be = Xi(t, Z, se);
    P.add(be);
    const Se = be.__colorMapValues, Re = ua(Se);
    Re.id = "frame-legend", z.appendChild(Re), ue.derive(() => {
      var _a2;
      const Ee = Z.shellResults.val != "none", We = (((_a2 = Z.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ze = Ee || We, _e = Z.frameResults.val.startsWith("contour:"), Te = O.val.some((Ne) => Number.isFinite(Ne));
      ae.hidden = !Ze || !Te, ie.visible = Ze, Re.hidden = !_e;
    });
  }
  if (_) {
    const R = new wa(16777215, 0.5);
    P.add(R);
    const O = new Bo(16777215, 0.5);
    O.position.set(30, 25, -10), O.shadow.mapSize.width = 1024, O.shadow.mapSize.height = 1024, P.add(O);
    const ie = 10;
    O.shadow.camera.left = -ie, O.shadow.camera.right = ie, O.shadow.camera.top = ie, O.shadow.camera.bottom = -ie, O.shadow.camera.far = 1e3;
    const ae = new Bo(16777215, 0.5);
    ae.color.setHSL(11, 43, 96), ae.position.set(-10, 0, 30), P.add(ae), ue.derive(() => {
      (_ == null ? void 0 : _.val.length) && (P.remove(..._.oldVal), P.add(..._.rawVal), ee());
    }), ue.derive(() => {
      _.rawVal.forEach((be) => be.visible = Z.solids.val), ee();
    });
  }
  if (v) {
    const R = [], O = (ae) => {
      var _a2;
      return ((_a2 = ae == null ? void 0 : ae.userData) == null ? void 0 : _a2.isCota) ? Z.showCotas.val : Z.custom3D.val;
    }, ie = () => {
      for (const ae of R) ae.visible = O(ae);
      ee();
    };
    ue.derive(() => {
      const ae = v.val;
      R.length && (P.remove(...R), R.length = 0), ae.length && (P.add(...ae), R.push(...ae), ie(), N.clippingPlanes.length && Q()), ee();
    }), ue.derive(() => {
      Z.custom3D.val, ie();
    }), ue.derive(() => {
      Z.showCotas.val, ie();
    });
  }
  g && Ii({ drawingObj: g, gridObj: me, scene: P, getActiveCamera: () => V, controls: Y, gridSize: U, derivedDisplayScale: oe, rendererElm: N.domElement, viewerRender: ee }), ha((R, O) => {
    var _a2;
    N.setClearColor(O.background, 1), P.remove(me), (_a2 = me.traverse) == null ? void 0 : _a2.call(me, (ie) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ie.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ie.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), me = ps(Z.gridSize.rawVal, { planes: we() }), P.add(me), z.style.setProperty("--awatif-legend-color", O.legendMarker), ee();
  });
  const ge = { scene: P, perspCamera: E, orthoCamera: C, get camera() {
    return V;
  }, controls: Y, renderer: N, rendererElm: N.domElement, render: ee, setActiveCamera: $e, setSplitMode: xe, get splitMode() {
    return pe;
  }, get splitCamera() {
    return ce;
  }, settings: Z };
  z.__ctx = ge;
  const ve = document.createElement("div");
  ve.id = "hk-nav-camara", ve.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const De = (R, O, ie) => {
    const ae = document.createElement("button");
    return ae.textContent = R, ae.title = O, ae.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ae.onmouseenter = () => {
      ae.style.background = "rgba(70,70,70,0.9)";
    }, ae.onmouseleave = () => {
      ae.style.background = "rgba(40,40,40,0.85)";
    }, ae.onclick = (be) => {
      be.preventDefault(), ie();
    }, ae;
  }, ze = (R, O) => {
    const ie = Y.target, ae = new $().subVectors(V.position, ie), be = ae.length(), Se = new $(), Re = new $();
    Se.crossVectors(V.up, ae).normalize(), Re.copy(V.up).normalize();
    const Ee = be * 0.05;
    ie.addScaledVector(Se, -R * Ee), ie.addScaledVector(Re, O * Ee), V.position.addScaledVector(Se, -R * Ee), V.position.addScaledVector(Re, O * Ee), Y.update(), ee();
  }, et = (R) => {
    const O = new $().subVectors(V.position, Y.target);
    O.multiplyScalar(R), V.position.copy(Y.target).add(O), Y.update(), ee();
  }, at = () => {
    const R = document.createElement("div");
    return R.style.cssText = "width:32px;height:32px;", R;
  };
  return ve.append(at()), ve.append(De("\u2191", "Pan arriba", () => ze(0, 1))), ve.append(De("\u2295", "Zoom in", () => et(0.85))), ve.append(De("\u2190", "Pan izquierda", () => ze(-1, 0))), ve.append(De("\u2302", "Reset vista", () => {
    Y.reset(), ee();
  })), ve.append(De("\u2192", "Pan derecha", () => ze(1, 0))), ve.append(De("\u2296", "Zoom out", () => et(1.18))), ve.append(De("\u2193", "Pan abajo", () => ze(0, -1))), ve.append(at()), getComputedStyle(z).position === "static" && (z.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && z.appendChild(ve), z;
}
function sl(t, h) {
  return ue.derive(() => {
    var _a2, _b, _c, _d;
    if (!h.deformedShape.val) return ((_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], v = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!v || g.length === 0) return g;
    const _ = h.deformScale.val, z = h.deformScale.val * h.deformScaleZ.val, P = Number.isFinite(_) ? _ : 1, E = Number.isFinite(z) ? z : 1;
    return g.map((C, V) => {
      var _a3;
      const N = ((_a3 = v.get(V)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], Y = Number.isFinite(N[0]) ? N[0] : 0, j = Number.isFinite(N[1]) ? N[1] : 0, X = Number.isFinite(N[2]) ? N[2] : 0;
      return [C[0] + Y * P, C[1] + j * P, C[2] + X * E];
    });
  });
}
const co = ue.state(null), ys = ue.state(""), al = ue.state("kN"), il = ue.state("mm"), ll = ue.state("kN/m\xB2"), rl = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, fa = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, cl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function dl(t, h) {
  const g = ue.state([]);
  let v;
  return ((_) => {
    _.bendingXX = "bendingXX", _.bendingYY = "bendingYY", _.bendingXY = "bendingXY", _.membraneXX = "membraneXX", _.membraneYY = "membraneYY", _.membraneXY = "membraneXY", _.tranverseShearX = "tranverseShearX", _.tranverseShearY = "tranverseShearY", _.membranePrincipalMax = "membranePrincipalMax", _.membranePrincipalMin = "membranePrincipalMin", _.bendingPrincipalMax = "bendingPrincipalMax", _.bendingPrincipalMin = "bendingPrincipalMin", _.transverseShearMax = "transverseShearMax", _.vonMises = "vonMises", _.pressure = "pressure", _.displacementX = "displacementX", _.displacementY = "displacementY", _.displacementZ = "displacementZ";
  })(v || (v = {})), ue.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const _ = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), he = (R, O) => {
      R == null ? void 0 : R.forEach((ie, ae) => {
        const be = t.elements.val[ae];
        if (be) for (let Se = 0; Se < be.length; Se++) O.set(be[Se], [ie[Se] ?? ie[0]]);
      });
    };
    he((_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, _), he((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, z), he((_f = (_e = t.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, P), he((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, E), he((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, C), he((_l = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, V), he((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, N), he((_p = (_o = t.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, Y), he((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, j), he((_t = (_s = t.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, X);
    const Q = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new Map(), fe = (R, O, ie, ae, be) => {
      R.forEach((Se, Re) => {
        var _a3, _b2;
        const Ee = Se[0] ?? 0, We = ((_a3 = O.get(Re)) == null ? void 0 : _a3[0]) ?? 0, Ze = ((_b2 = ie.get(Re)) == null ? void 0 : _b2[0]) ?? 0, _e2 = (Ee + We) / 2, Te = Math.hypot((Ee - We) / 2, Ze);
        ae.set(Re, [_e2 + Te]), be.set(Re, [_e2 - Te]);
      });
    };
    fe(E, C, V, Q, Z), fe(_, z, P, oe, se), N.forEach((R, O) => {
      var _a3;
      we.set(O, [Math.hypot(R[0] ?? 0, ((_a3 = Y.get(O)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const me = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, re = (_w = h.solidResults) == null ? void 0 : _w.val, U = re && re !== "none" ? re : h.shellResults.val, I = me == null ? void 0 : me[U], K = { bendingXX: [_, 0], bendingYY: [z, 0], bendingXY: [P, 0], membraneXX: [E, 0], membraneYY: [C, 0], membraneXY: [V, 0], tranverseShearX: [N, 0], tranverseShearY: [Y, 0], membranePrincipalMax: [Q, 0], membranePrincipalMin: [Z, 0], bendingPrincipalMax: [oe, 0], bendingPrincipalMin: [se, 0], transverseShearMax: [we, 0], vonMises: [j, 0], pressure: [X, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, q = h.shellResults.val, L = al.val, J = il.val, de = q === "displacementX" || q === "displacementY" || q === "displacementZ", pe = q === "bendingXX" || q === "bendingYY" || q === "bendingXY" || q === "bendingPrincipalMax" || q === "bendingPrincipalMin", ce = q === "membraneXX" || q === "membraneYY" || q === "membraneXY" || q === "membranePrincipalMax" || q === "membranePrincipalMin", H = q === "vonMises" || q === "pressure", Me = q === "tranverseShearX" || q === "tranverseShearY" || q === "transverseShearMax", ee = (_D = h.solidResults) == null ? void 0 : _D.val, $e = ee === "vonMises" || ee === "sigmaXX" || ee === "sigmaYY" || ee === "sigmaZZ" || ee === "tauXY" || ee === "tauYZ" || ee === "tauXZ", xe = ee === "ux" || ee === "uy" || ee === "uz", ge = ll.val, ve = $e ? cl[ge] : xe || de ? fa[J] : pe || ce || H || Me ? 1 / rl[L] : 1, De = $e ? ge : xe || de ? J : pe ? `${L}\xB7m/m` : ce ? `${L}/m\xB2` : H ? `${L}/m\xB2` : Me ? `${L}/m` : "";
    ys.val = De, co.val = Array.isArray(I) && I.length === 2 ? [I[0] * ve, I[1] * ve] : null;
    const ze = ba.val, at = ee && ee !== "none" ? [j, 0] : K[q], Be = [];
    if (t.nodes.val.forEach((R, O) => {
      const ie = at;
      if (!ie || !ie[0] || typeof ie[0].has != "function") return;
      if (!ie[0].has(O)) {
        Be.push(Number.NaN);
        return;
      }
      const ae = ie[0].get(O), be = ae ? ae[ie[1]] ?? 0 : 0;
      Be.push(be * ve);
    }), !co.val && ze !== "auto") {
      const R = t.nodes.val, O = /* @__PURE__ */ new Set(), ie = (be, Se) => {
        var _a3;
        const Re = (_a3 = R[be[0]]) == null ? void 0 : _a3[Se];
        return be.every((Ee) => {
          var _a4;
          return Math.abs((((_a4 = R[Ee]) == null ? void 0 : _a4[Se]) ?? NaN) - Re) < 1e-6;
        });
      };
      for (const be of t.elements.val) {
        if (be.length !== 4) continue;
        const Se = ie(be, 2), Re = !Se && ie(be, 0), Ee = !Se && ie(be, 1);
        if (ze === "losas" ? Se : ze === "muros" ? Re || Ee : ze === "murosX" ? Re : ze === "murosY" ? Ee : false) for (const _e2 of be) O.add(_e2);
      }
      const ae = [];
      for (const be of O) {
        const Se = Be[be];
        Number.isFinite(Se) && ae.push(Se);
      }
      ae.length && (co.val = xs(ae));
    }
    g.val = Be;
  }), g;
}
export {
  hi as a,
  ua as b,
  al as c,
  il as d,
  ll as e,
  ml as g
};
