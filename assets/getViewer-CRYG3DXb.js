import { u as nn, a6 as Ao, q as Ka, v as le, a7 as Wa, D as Et, M as it, B as Ae, F as Vt, a8 as Ga, z as ht, a9 as Ha, aa as Ja, h as Hs, ab as Js, r as $n, ac as $o, ad as Io, a4 as ca, _ as ct, b as dt, L as Jt, y as da, c as Qa, ae as Oa, f as ft, V, $ as Vn, af as ss, K as Ro, d as Ft, a as as, A as ua, t as To, J as ja, H as ao, I as ei, ag as Lo, w as is, o as ti, N as kn, a2 as no, E as Qs, S as Wn, m as ls, ah as oo, g as Os, i as js, j as ea, C as ta, W as ni, X as oi, Y as si, Z as ai, T as Fo, P as rs, U as ii } from "./theme-C-zoknmI.js";
import { T as $t, O as na } from "./Text-Cehu0nom.js";
import { P as pa } from "./tweakpane-BXg6ZhiP.js";
import { e as li } from "./styles-C2dy99Y1.js";
class fa {
  constructor(m, g = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(m, g);
  }
  set(m) {
    return m.isLut === true && this.copy(m), this;
  }
  setMin(m) {
    return this.minV = m, this;
  }
  setMax(m) {
    return this.maxV = m, this;
  }
  setColorMap(m, g = 32) {
    this.map = cs[m] || cs.rainbow, this.n = g;
    const _ = 1 / this.n, S = new nn(), z = new nn();
    this.lut.length = 0, this.lut.push(new nn(this.map[0][1]));
    for (let F = 1; F < g; F++) {
      const E = F * _;
      for (let C = 0; C < this.map.length - 1; C++) if (E > this.map[C][0] && E <= this.map[C + 1][0]) {
        const I = this.map[C][0], D = this.map[C + 1][0];
        S.setHex(this.map[C][1], Ao), z.setHex(this.map[C + 1][1], Ao);
        const R = new nn().lerpColors(S, z, (E - I) / (D - I));
        this.lut.push(R);
      }
    }
    return this.lut.push(new nn(this.map[this.map.length - 1][1])), this;
  }
  copy(m) {
    return this.lut = m.lut, this.map = m.map, this.n = m.n, this.minV = m.minV, this.maxV = m.maxV, this;
  }
  getColor(m) {
    m = Ka.clamp(m, this.minV, this.maxV), m = (m - this.minV) / (this.maxV - this.minV);
    const g = Math.round(m * this.n);
    return this.lut[g];
  }
  addColorMap(m, g) {
    return cs[m] = g, this;
  }
  createCanvas() {
    const m = document.createElement("canvas");
    return m.width = 1, m.height = this.n, this.updateCanvas(m), m;
  }
  updateCanvas(m) {
    const g = m.getContext("2d", { alpha: false }), _ = g.getImageData(0, 0, 1, this.n), S = _.data;
    let z = 0;
    const F = 1 / this.n, E = new nn(), C = new nn(), I = new nn();
    for (let D = 1; D >= 0; D -= F) for (let R = this.map.length - 1; R >= 0; R--) if (D < this.map[R][0] && D >= this.map[R - 1][0]) {
      const ee = this.map[R - 1][0], pe = this.map[R][0];
      E.setHex(this.map[R - 1][1], Ao), C.setHex(this.map[R][1], Ao), I.lerpColors(E, C, (D - ee) / (pe - ee)), S[z * 4] = Math.round(I.r * 255), S[z * 4 + 1] = Math.round(I.g * 255), S[z * 4 + 2] = Math.round(I.b * 255), S[z * 4 + 3] = 255, z += 1;
    }
    return g.putImageData(_, 0, 0), m;
  }
}
const cs = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ha = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], ri = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ha, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Do = le.state("safe"), ma = le.state("auto");
function wa(n) {
  n = Math.max(0, Math.min(1, n));
  const m = ri[Do.val] ?? ha;
  for (let _ = 0; _ < m.length - 1; _++) {
    const [S, z, F, E] = m[_], [C, I, D, R] = m[_ + 1];
    if (n <= C) {
      const ee = (n - S) / (C - S);
      return [z + (I - z) * ee, F + (D - F) * ee, E + (R - E) * ee];
    }
  }
  const g = m[m.length - 1];
  return [g[1], g[2], g[3]];
}
function oa() {
  const m = new Uint8Array(1024);
  for (let _ = 0; _ < 256; _++) {
    const S = _ / 255, [z, F, E] = wa(S);
    m[_ * 4 + 0] = z, m[_ * 4 + 1] = F, m[_ * 4 + 2] = E, m[_ * 4 + 3] = 255;
  }
  const g = new Ha(m, 256, 1, Ja);
  return g.minFilter = Hs, g.magFilter = Hs, g.wrapS = Js, g.wrapT = Js, g.needsUpdate = true, g;
}
function ci() {
  const m = [];
  for (let g = 0; g <= 12; g++) {
    const _ = 1 - g / 12, [S, z, F] = wa(_);
    m.push(`rgb(${S | 0},${z | 0},${F | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${m.join(",")})`;
}
function ws(n) {
  if (!n.length) return [0, 1];
  const m = [...n].sort((z, F) => z - F), g = (z) => m[Math.min(m.length - 1, Math.max(0, Math.round(z * (m.length - 1))))];
  let _ = m.length >= 20 ? g(0.01) : m[0], S = m.length >= 20 ? g(0.99) : m[m.length - 1];
  return _ >= 0 && S > 0 && (_ = 0), S <= 0 && _ < 0 && (S = 0), [_, S];
}
function di(n, m, g) {
  new fa();
  const _ = oa(), S = new Wa({ uniforms: { cmap: { value: _ }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: Et, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  le.derive(() => {
    var _a;
    Do.val;
    const F = S.uniforms.cmap.value;
    S.uniforms.cmap.value = oa(), (_a = F == null ? void 0 : F.dispose) == null ? void 0 : _a.call(F);
  });
  const z = new it(new Ae(), S);
  return z.renderOrder = -1, z.frustumCulled = false, z.userData.isShellArea = true, z.name = "__hekatan_shell_colormap", le.derive(() => {
    z.geometry.setAttribute("position", new Vt(n.val.flat(), 3));
    const F = [], E = [], C = [];
    m.val.forEach((Y, ie) => {
      Y.length === 3 ? (F.push(Y[0], Y[1], Y[2]), E.push(ie), C.push(0)) : Y.length === 4 && (F.push(Y[0], Y[1], Y[2]), F.push(Y[0], Y[2], Y[3]), E.push(ie, ie), C.push(0, 1));
    }), z.geometry.setIndex(new Ga(F, 1)), z.userData.faceToElem = E, z.userData.faceLocal = C;
    const I = g.val.filter((Y) => Number.isFinite(Y));
    let D, R;
    const ee = lo.val;
    if (ee ? (R = ee[0], D = ee[1]) : [R, D] = ws(I), D === R) {
      const Y = Math.max(Math.abs(D) * 1e-6, 1e-9);
      D += Y, R -= Y;
    }
    const pe = ee && ee[0] > ee[1], me = Math.min(R, D), O = Math.max(R, D), N = O - me, re = new Float32Array(g.val.length);
    for (let Y = 0; Y < g.val.length; Y++) {
      const ie = g.val[Y];
      if (!Number.isFinite(ie)) {
        re[Y] = -1;
        continue;
      }
      const ne = ((pe ? O + me - ie : ie) - me) / N;
      re[Y] = Math.max(0, Math.min(1, ne));
    }
    z.geometry.setAttribute("scalar", new ht(re, 1));
  }), z;
}
function ui(n, m, g) {
  const _ = document.createElement("div"), S = new pa({ title: "Settings", expanded: true, container: _ });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(S), _.setAttribute("id", "settings");
  const z = "hk_settingsPos";
  let F = null;
  try {
    const pe = localStorage.getItem(z);
    pe && (F = JSON.parse(pe));
  } catch {
  }
  _.style.cssText = ["position:fixed", F ? `left:${F.left}px` : "left:8px", F ? `top:${F.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const E = () => {
    const pe = _.querySelector(".tp-rotv_b");
    if (!pe) {
      setTimeout(E, 200);
      return;
    }
    pe.style.cursor = "move", pe.style.userSelect = "none";
    let me = false, O = 0, N = 0, re = 0, Y = 0;
    pe.addEventListener("mousedown", (ie) => {
      me = true, O = ie.clientX, N = ie.clientY;
      const oe = _.getBoundingClientRect();
      re = oe.left, Y = oe.top, _.style.left = `${re}px`, _.style.top = `${Y}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!me) return;
      const oe = ie.clientX - O, ne = ie.clientY - N, J = Math.max(0, Math.min(window.innerWidth - 40, re + oe)), H = Math.max(0, Math.min(window.innerHeight - 40, Y + ne));
      _.style.left = `${J}px`, _.style.top = `${H}px`;
    }), window.addEventListener("mouseup", () => {
      if (me) {
        me = false;
        try {
          localStorage.setItem(z, JSON.stringify({ left: parseFloat(_.style.left), top: parseFloat(_.style.top) }));
        } catch {
        }
      }
    });
  };
  if (E(), m == null ? void 0 : m.nodes) {
    S.addBinding(n.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const pe = S.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    pe.addBinding(n.gridVisible, "val", { label: "Mostrar la rejilla" }), pe.addBinding(n.gridXY, "val", { label: "Plano XY (planta)" }), pe.addBinding(n.gridXZ, "val", { label: "Plano XZ (frontal)" }), pe.addBinding(n.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const me = pe.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    me.addBinding(n.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), me.addBinding(n.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), me.addBinding(n.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), me.addBinding(n.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), me.addBinding(n.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const O = S.addFolder({ title: "\u{1F441} Ver", expanded: false });
    O.addBinding(n.nodes, "val", { label: "Nodes" }), O.addBinding(n.elements, "val", { label: "Elements" }), O.addBinding(n.edges, "val", { label: "  Edges (delim.)" }), O.addBinding(n.faces, "val", { label: "  Caras (fill)" }), O.addBinding(n.elemFrames, "val", { label: "  Frames (todos)" }), O.addBinding(n.elemColumns, "val", { label: "    Columnas" }), O.addBinding(n.elemBeams, "val", { label: "    Vigas" }), O.addBinding(n.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), O.addBinding(n.elemLosas, "val", { label: "  Losas (shells z>0)" }), O.addBinding(n.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), O.addBinding(n.nodesIndexes, "val", { label: "Nodes indexes" }), O.addBinding(n.elementsIndexes, "val", { label: "Elements indexes" }), O.addBinding(n.orientations, "val", { label: "Orientations" }), O.addBinding(n.sections, "val", { label: "Sections" }), O.addBinding(n.extruded, "val", { label: "Extruido (3D)" }), O.addBinding(n.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), O.addBinding(n.secColumns, "val", { label: "  Sec. Columnas" }), O.addBinding(n.secBeams, "val", { label: "  Sec. Vigas" }), O.addBinding(n.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((m == null ? void 0 : m.nodeInputs) || (m == null ? void 0 : m.elementInputs)) {
    const pe = S.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    pe.addBinding(n.supports, "val", { label: "Supports" }), pe.addBinding(n.loads, "val", { label: "Loads" }), pe.addBinding(n.custom3D, "val", { label: "Resortes (Winkler)" }), pe.addBinding(n.showCotas, "val", { label: "Cotas" });
  }
  if ((m == null ? void 0 : m.deformOutputs) || (m == null ? void 0 : m.analyzeOutputs)) {
    const pe = S.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = pe, pe.addBinding(n.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), pe.addBinding(n.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), pe.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagrama2D) == null ? void 0 : _a.call(window);
    }), pe.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagramaBarra) == null ? void 0 : _a.call(window);
    }), pe.addBinding(n.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), pe.addBinding(Do, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), pe.addBinding(ma, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), pe.addBinding(n.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), pe.addBinding(n.deformedShape, "val", { label: "Deformed shape" }), pe.addBinding(n.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), pe.addBinding(n.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && S.addBinding(n.solids, "val", { label: "Solids" });
  const C = S.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), I = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), D = () => {
    const pe = window.__hekatanClipApply;
    typeof pe == "function" && pe();
  };
  let R = [];
  const ee = (pe, me) => {
    for (const N of R) try {
      N.dispose();
    } catch {
    }
    R = [];
    const O = (N, re) => {
      const Y = Math.floor(Math.min(pe[re], -50)), ie = Math.ceil(Math.max(me[re], 50)), oe = ie - Y > 400 ? 0.5 : 0.1;
      return I["pos" + N] = Math.max(Y, Math.min(ie, I["pos" + N])), C.addBinding(I, "pos" + N, { min: Y, max: ie, step: oe, label: `  pos ${N} (m)` }).on("change", D);
    };
    R.push(C.addBinding(I, "enableX", { label: "Cortar X" }).on("change", D), O("X", 0), C.addBinding(I, "invertX", { label: "  invertir X" }).on("change", D), C.addBinding(I, "enableY", { label: "Cortar Y" }).on("change", D), O("Y", 1), C.addBinding(I, "invertY", { label: "  invertir Y" }).on("change", D), C.addBinding(I, "enableZ", { label: "Cortar Z" }).on("change", D), O("Z", 2), C.addBinding(I, "invertZ", { label: "  invertir Z" }).on("change", D));
  };
  return ee([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (pe, me) => {
    ee(pe, me);
  }, _;
}
function pi(n) {
  return { gridSize: le.state((n == null ? void 0 : n.gridSize) ?? 30), gridVisible: le.state((n == null ? void 0 : n.gridVisible) ?? true), gridOpacity: le.state((n == null ? void 0 : n.gridOpacity) ?? 1), gridStep: le.state((n == null ? void 0 : n.gridStep) ?? 1), gridMajor: le.state((n == null ? void 0 : n.gridMajor) ?? 5), cursorSnap: le.state((n == null ? void 0 : n.cursorSnap) ?? 0.5), gridXY: le.state((n == null ? void 0 : n.gridXY) ?? true), gridXZ: le.state((n == null ? void 0 : n.gridXZ) ?? false), gridYZ: le.state((n == null ? void 0 : n.gridYZ) ?? false), displayScale: le.state((n == null ? void 0 : n.displayScale) ?? 1), nodes: le.state((n == null ? void 0 : n.nodes) ?? true), elements: le.state((n == null ? void 0 : n.elements) ?? true), edges: le.state((n == null ? void 0 : n.edges) ?? true), faces: le.state((n == null ? void 0 : n.faces) ?? true), elemColumns: le.state((n == null ? void 0 : n.elemColumns) ?? true), elemBeams: le.state((n == null ? void 0 : n.elemBeams) ?? true), elemFrames: le.state((n == null ? void 0 : n.elemFrames) ?? true), elemZapatas: le.state((n == null ? void 0 : n.elemZapatas) ?? true), elemLosas: le.state((n == null ? void 0 : n.elemLosas) ?? true), colorByType: le.state((n == null ? void 0 : n.colorByType) ?? false), nodesIndexes: le.state((n == null ? void 0 : n.nodesIndexes) ?? false), elementsIndexes: le.state((n == null ? void 0 : n.elementsIndexes) ?? false), orientations: le.state((n == null ? void 0 : n.orientations) ?? false), sections: le.state((n == null ? void 0 : n.sections) ?? true), extruded: le.state((n == null ? void 0 : n.extruded) ?? false), sectionLabels: le.state((n == null ? void 0 : n.sectionLabels) ?? true), secColumns: le.state((n == null ? void 0 : n.secColumns) ?? true), secBeams: le.state((n == null ? void 0 : n.secBeams) ?? true), secFloor: le.state((n == null ? void 0 : n.secFloor) ?? -1), supports: le.state((n == null ? void 0 : n.supports) ?? true), loads: le.state((n == null ? void 0 : n.loads) ?? false), deformedShape: le.state((n == null ? void 0 : n.deformedShape) ?? false), nodeResults: le.state((n == null ? void 0 : n.nodeResults) ?? "none"), frameResults: le.state((n == null ? void 0 : n.frameResults) ?? "none"), shellResults: le.state((n == null ? void 0 : n.shellResults) ?? "none"), solidResults: le.state((n == null ? void 0 : n.solidResults) ?? "none"), flipAxes: le.state((n == null ? void 0 : n.flipAxes) ?? false), solids: le.state((n == null ? void 0 : n.solids) ?? true), custom3D: le.state((n == null ? void 0 : n.custom3D) ?? true), showCotas: le.state((n == null ? void 0 : n.showCotas) ?? true), deformScale: le.state((n == null ? void 0 : n.deformScale) ?? 1), deformScaleZ: le.state((n == null ? void 0 : n.deformScaleZ) ?? 1) };
}
function fi(n, m, g) {
  const _ = $n(), S = new $o(new Ae(), new Io({ color: _.nodePoint }));
  return ca((z, F) => {
    S.material.color.setHex(F.nodePoint);
  }), S.frustumCulled = false, le.derive(() => {
    n.nodes.val && S.geometry.setAttribute("position", new Vt(m.val.flat(), 3));
  }), le.derive(() => {
    if (g.val, m.val, !n.nodes.rawVal) return;
    const z = m.rawVal ?? [];
    let F = n.gridSize.val * 0.5;
    if (z.length >= 2) {
      const C = [1 / 0, 1 / 0, 1 / 0], I = [-1 / 0, -1 / 0, -1 / 0];
      for (const D of z) for (let R = 0; R < 3; R++) C[R] = Math.min(C[R], D[R]), I[R] = Math.max(I[R], D[R]);
      F = Math.max(I[0] - C[0], I[1] - C[1], I[2] - C[2], 0.1);
    }
    const E = 0.03 * F;
    S.material.size = E * g.rawVal;
  }), le.derive(() => {
    S.visible = n.nodes.val;
  }), S;
}
function ds(n, m) {
  const g = $n(), _ = new ct();
  _.name = "hekatan-grid";
  const S = (m == null ? void 0 : m.planes) ?? ["xy"];
  let z = (m == null ? void 0 : m.majorStep) ?? 1, F = (m == null ? void 0 : m.minorStep) ?? 0.1;
  for (z <= 0 && (z = 1), F <= 0 && (F = 0.1); n / F > 500; ) F *= 2;
  for (; n / z > 100; ) z *= 2;
  const E = n / 2;
  z = Math.max(F, Math.round(z / F) * F);
  const I = new nn(g.grid).multiplyScalar(1.3), D = new nn(g.grid).multiplyScalar(0.8), R = (O, N, re, Y) => {
    const ie = [], oe = O === "xy" ? (B, q) => [B, q, 0] : O === "xz" ? (B, q) => [B, 0, q] : (B, q) => [0, B, q], ne = Math.floor(E / N);
    for (let B = -ne; B <= ne; B++) {
      const q = B * N, U = oe(q, -E), L = oe(q, E);
      ie.push(...U, ...L);
    }
    for (let B = -ne; B <= ne; B++) {
      const q = B * N, U = oe(-E, q), L = oe(E, q);
      ie.push(...U, ...L);
    }
    const J = new Ae();
    J.setAttribute("position", new Vt(ie, 3));
    const H = new dt({ color: re, transparent: true, opacity: Y, depthWrite: false }), G = new Jt(J, H);
    return G.name = `grid-${O}-${N === F ? "minor" : "major"}`, G;
  }, ee = (O, N, re) => {
    const Y = O === "xy" ? (G, B) => [G, B, 0] : O === "xz" ? (G, B) => [G, 0, B] : (G, B) => [0, G, B], ie = [[-E, -E], [E, -E], [E, E], [-E, E]], oe = [];
    for (const [G, B] of ie) oe.push(...Y(G, B));
    const ne = new Ae();
    ne.setAttribute("position", new Vt(oe, 3));
    const J = new dt({ color: N, transparent: true, opacity: re, depthWrite: false }), H = new da(ne, J);
    return H.name = `grid-${O}-border`, H.renderOrder = 1, H;
  }, pe = (O, N, re) => {
    const Y = O === "xy" ? (J, H) => [J, H, 0] : O === "xz" ? (J, H) => [J, 0, H] : (J, H) => [0, J, H], ie = N === "u" ? [...Y(-E, 0), ...Y(E, 0)] : [...Y(0, -E), ...Y(0, E)], oe = new Ae();
    oe.setAttribute("position", new Vt(ie, 3));
    const ne = new Jt(oe, new dt({ color: re, transparent: true, opacity: 0.45, depthWrite: false }));
    return ne.name = `grid-${O}-eje-${N}`, ne.renderOrder = 1, ne;
  }, me = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const O of S) {
    _.add(R(O, F, D, 0.12)), _.add(R(O, z, I, 0.4));
    const [N, re] = me[O];
    _.add(pe(O, "u", N)), _.add(pe(O, "v", re)), _.add(ee(O, I, 0.55));
  }
  return _.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: z, minorStep: F, gridSize: n, planes: [...S] }, _;
}
function hi(n, m, g, _) {
  const S = new ct(), z = new Qa(0.5, 0.5, 0.5), F = new Oa(0.45, 0.7, 4);
  F.rotateX(Math.PI / 2), F.translate(0, 0, -0.35);
  const E = new ft({ color: 10166822 }), C = new ft({ color: 2792847 }), I = new ft({ color: 3835647 }), D = () => {
    const pe = g.rawVal ?? [];
    if (pe.length < 2) return m.gridSize.val * 0.5;
    let me = [1 / 0, 1 / 0, 1 / 0], O = [-1 / 0, -1 / 0, -1 / 0];
    for (const N of pe) for (let re = 0; re < 3; re++) N[re] < me[re] && (me[re] = N[re]), N[re] > O[re] && (O[re] = N[re]);
    return Math.max(O[0] - me[0], O[1] - me[1], O[2] - me[2], 0.1);
  }, R = () => 0.08 * D(), ee = () => _.rawVal;
  return le.derive(() => {
    var _a, _b;
    if (m.deformedShape.val, !m.supports.val) return;
    S.clear();
    const pe = R();
    (_b = (_a = n.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((me, O) => {
      const N = g.val[O];
      if (!N) return;
      const re = me ?? [], Y = (re[0] ? 1 : 0) + (re[1] ? 1 : 0) + (re[2] ? 1 : 0), ie = (re[3] ? 1 : 0) + (re[4] ? 1 : 0) + (re[5] ? 1 : 0);
      let oe;
      Y >= 3 && ie >= 3 ? oe = new it(z, E) : Y >= 3 && ie === 0 ? oe = new it(F, C) : oe = new it(F, I), oe.position.set(N[0], N[1], N[2]);
      const ne = pe * ee();
      oe.scale.set(ne, ne, ne), S.add(oe);
    });
  }), le.derive(() => {
    if (_.val, !m.supports.rawVal) return;
    const me = R() * ee();
    S.children.forEach((O) => O.scale.set(me, me, me));
  }), le.derive(() => {
    S.visible = m.supports.val;
  }), S;
}
function mi(n, m, g, _) {
  const S = new ct();
  S.name = "loadsGroup";
  function z(E) {
    if (E.length < 2) return 0.12 * m.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], I = [-1 / 0, -1 / 0, -1 / 0];
    for (const R of E) for (let ee = 0; ee < 3; ee++) C[ee] = Math.min(C[ee], R[ee]), I[ee] = Math.max(I[ee], R[ee]);
    return 0.08 * Math.max(I[0] - C[0], I[1] - C[1], I[2] - C[2], 0.1);
  }
  le.derive(() => {
    var _a, _b, _c;
    if (m.deformedShape.val, !m.loads.val) return;
    S.children.forEach((O) => {
      var _a2;
      return (_a2 = O.dispose) == null ? void 0 : _a2.call(O);
    }), S.clear();
    const E = g.val, C = z(E), I = 240, D = [];
    (_c = (_b = (_a = n.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((O, N) => {
      E[N] && O.slice(0, 3).some((re) => Math.abs(re) > 1e-15) && D.push(N);
    });
    let R = D;
    if (D.length > I) {
      const O = D.map((L) => E[L][0]), N = D.map((L) => E[L][1]), re = Math.min(...O), Y = Math.max(...O), ie = Math.min(...N), oe = Math.max(...N), ne = D.map((L) => E[L][2]), J = Math.max(1e-6, (Math.max(...ne) - Math.min(...ne)) / 40), H = (L) => Math.round(L / J), G = new Set(ne.map(H)), B = Math.max(4, Math.floor(I / Math.max(1, G.size))), q = Math.max(2, Math.round(Math.sqrt(B))), U = /* @__PURE__ */ new Map();
      for (const L of D) {
        const Q = Y - re < 1e-9 ? 0 : (E[L][0] - re) / (Y - re), fe = oe - ie < 1e-9 ? 0 : (E[L][1] - ie) / (oe - ie), we = Math.min(q - 1, Math.floor(Q * q)), Me = Math.min(q - 1, Math.floor(fe * q)), W = `${we},${Me},${H(E[L][2])}`, be = Math.hypot(Q * q - (we + 0.5), fe * q - (Me + 0.5)), ce = U.get(W);
        (!ce || be < ce.d) && U.set(W, { i: L, d: be });
      }
      R = [...U.values()].map((L) => L.i);
    }
    let ee = 0;
    for (const O of R) {
      const N = n.nodeInputs.val.loads.get(O);
      for (let re = 0; re < 3; re++) ee = Math.max(ee, Math.abs(N[re]));
    }
    const pe = R.length <= 60, me = (O) => {
      const N = Math.abs(O);
      return N >= 100 ? O.toFixed(0) : N >= 10 ? O.toFixed(1) : O.toFixed(2);
    };
    for (const O of R) {
      const N = n.nodeInputs.val.loads.get(O), re = E[O];
      if (re) for (let Y = 0; Y < 3; Y++) {
        const ie = N[Y];
        if (!(Math.abs(ie) > 1e-9 * (ee || 1))) continue;
        const oe = new V(Y === 0 ? Math.sign(ie) : 0, Y === 1 ? Math.sign(ie) : 0, Y === 2 ? Math.sign(ie) : 0), ne = 0.45 + 0.55 * (ee ? Math.abs(ie) / ee : 1), J = new Vn(oe, new V(...re), 1, Y === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (J.userData = { nudo: re, dir: oe, rel: ne }, S.add(J), pe) {
          const H = new $t(me(ie), Y === 2 ? "#f5b642" : "#ff6b5e");
          H.userData = { nudo: re, dir: oe, rel: ne, texto: true }, S.add(H);
        }
      }
    }
    F(C * _.rawVal);
  });
  function F(E) {
    S.children.forEach((C) => {
      const I = C.userData;
      if (!(I == null ? void 0 : I.dir)) return;
      const D = E * I.rel, R = new V(...I.nudo).addScaledVector(I.dir, -D * (I.texto ? 1.12 : 1));
      C.position.copy(R), I.texto ? C.updateScale(E * 0.38) : C.scale.set(D, D, D);
    });
  }
  return le.derive(() => {
    _.val, m.loads.rawVal && F(z(g.rawVal) * _.rawVal);
  }), le.derive(() => {
    S.visible = m.loads.val;
  }), S;
}
function wi(n, m, g) {
  const _ = new ct();
  return le.derive(() => {
    if (!n.nodesIndexes.val) return;
    _.children.forEach((z) => z.dispose()), _.clear();
    const S = 0.05 * n.gridSize.val * 0.6;
    m.val.forEach((z, F) => {
      const E = new $t(`${F}`);
      E.position.set(...z), E.updateScale(S * g.rawVal), _.add(E);
    });
  }), le.derive(() => {
    if (g.val, !n.nodesIndexes.rawVal) return;
    const S = 0.05 * n.gridSize.val * 0.6;
    _.children.forEach((z) => z.updateScale(S * g.rawVal));
  }), le.derive(() => {
    _.visible = n.nodesIndexes.val;
  }), _;
}
function yi(n, m, g, _) {
  const S = new ct();
  return le.derive(() => {
    var _a;
    if (m.deformedShape.val, !m.elementsIndexes.val) return;
    S.children.forEach((F) => F.dispose()), S.clear();
    const z = 0.05 * m.gridSize.val * 0.6;
    (_a = n.elements) == null ? void 0 : _a.val.forEach((F, E) => {
      const C = new $t(`${E}`, void 0, "#001219");
      C.position.set(...xi(F.map((I) => g.rawVal[I]))), C.updateScale(z * _.rawVal), S.add(C);
    });
  }), le.derive(() => {
    if (_.val, !m.elementsIndexes.rawVal) return;
    const z = 0.05 * m.gridSize.val * 0.6;
    S.children.forEach((F) => F.updateScale(z * _.rawVal));
  }), le.derive(() => {
    S.visible = m.elementsIndexes.val;
  }), S;
}
function xi(n) {
  const m = n.reduce((_, S) => [_[0] + S[0], _[1] + S[1], _[2] + S[2]], [0, 0, 0]), g = n.length;
  return [m[0] / g, m[1] / g, m[2] / g];
}
function sa(n, m) {
  const g = new ct(), _ = Math.min(0.05 * n, 0.6), S = $n(), z = new $t("X", "red", "transparent"), F = new $t(m ? "Z" : "Y", "green", "transparent"), E = new $t(m ? "Y" : "Z", "blue", "transparent"), C = new Vn(new V(1, 0, 0), new V(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), I = new Vn(new V(0, 1, 0), new V(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), D = new Vn(new V(0, 0, 1), new V(0, 0, 0), 1, S.axisArrow, 0.2, 0.2);
  return z.position.set(1.3 * _, 0, 0), F.position.set(0, 1.3 * _, 0), E.position.set(0, 0, 1.3 * _), z.updateScale(0.4 * _), F.updateScale(0.4 * _), E.updateScale(0.4 * _), C.scale.set(_, _, _), I.scale.set(_, _, _), D.scale.set(_, _, _), g.add(C, I, D, z, F, E), g;
}
function ys(n, m) {
  const g = new V(...n), S = new V(...m).clone().sub(g), z = S.length(), F = S.dot(new V(1, 0, 0)) / z, E = S.dot(new V(0, 1, 0)) / z, C = S.dot(new V(0, 0, 1)) / z, I = Math.sqrt(F ** 2 + E ** 2);
  let D = new ss().fromArray([[F, E, C], [-E / I, F / I, 0], [-F * C / I, -E * C / I, I]].flat());
  return C === 1 && (D = new ss().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), C === -1 && (D = new ss().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Ro().setFromMatrix3(D);
}
function fs(n, m) {
  return n == null ? void 0 : n.map((g, _) => (9 * g + m[_]) / 10);
}
function io(n) {
  const m = n.reduce((_, S) => [_[0] + S[0], _[1] + S[1], _[2] + S[2]], [0, 0, 0]), g = n.length;
  return [m[0] / g, m[1] / g, m[2] / g];
}
function gi(n, m, g) {
  const _ = io([m, g]), S = io([n, g]), z = io([n, m]), F = new V(..._).sub(new V(...S)).normalize(), E = new V(...g).sub(new V(...z)).normalize(), C = F.clone().cross(E).normalize(), I = C.clone().cross(F).normalize();
  return new Ro().makeBasis(F, I, C);
}
function vi(n, m, g, _) {
  const S = new ct(), z = new Ae(), F = new dt({ vertexColors: true }), E = [0, 0, 0], C = [1, 0, 0], I = [0, 1, 0], D = [0, 0, 1];
  z.setAttribute("position", new Vt([...E, ...C, ...E, ...I, ...E, ...D], 3));
  const R = [255, 0, 0], ee = [0, 255, 0], pe = [0, 0, 255];
  return z.setAttribute("color", new Vt([...R, ...R, ...ee, ...ee, ...pe, ...pe], 3)), le.derive(() => {
    var _a;
    m.deformedShape.val, m.orientations.val && (S.clear(), (_a = n.elements) == null ? void 0 : _a.val.forEach((me) => {
      const O = new Jt(z, F), N = g.rawVal[me[0]], re = g.rawVal[me[1]];
      if (me.length === 2 && (O.position.set(...fs(N, re)), O.rotation.setFromRotationMatrix(ys(N, re))), me.length === 3) {
        const oe = g.rawVal[me[2]];
        O.position.set(...io([N, re, oe])), O.rotation.setFromRotationMatrix(gi(N, re, oe));
      }
      const ie = 0.05 * m.gridSize.rawVal * 0.75 * _.rawVal;
      O.scale.set(ie, ie, ie), S.add(O);
    }));
  }), le.derive(() => {
    if (_.val, !m.orientations.rawVal) return;
    const O = 0.05 * m.gridSize.val * 0.75 * _.rawVal;
    S.children.forEach((N) => N.scale.set(O, O, O));
  }), le.derive(() => {
    S.visible = m.orientations.val;
  }), S;
}
function Mi(n) {
  if (n.name) return n.name;
  if (n.type === "rect") {
    const m = (n.b * 100).toFixed(0), g = (n.h * 100).toFixed(0);
    return `${m}x${g}`;
  }
  return n.type === "circ" ? `D${(n.d * 100).toFixed(0)}` : "";
}
function bi(n, m, g, _) {
  const S = new ct(), z = new ct();
  S.add(z);
  function F(J, H) {
    const G = J / 2, B = H / 2, q = new Float32Array([0, -G, -B, 0, G, -B, 0, G, B, 0, -G, -B, 0, G, B, 0, -G, B]), U = new Ae();
    U.setAttribute("position", new ht(q, 3));
    const L = new Float32Array([0, -G, -B, 0, G, -B, 0, G, B, 0, -G, B, 0, -G, -B]), Q = new Ae();
    return Q.setAttribute("position", new ht(L, 3)), { fill: U, outline: Q };
  }
  function E(J, H = 24) {
    const G = J / 2, B = new Float32Array(H * 9);
    for (let Q = 0; Q < H; Q++) {
      const fe = Q / H * Math.PI * 2, we = (Q + 1) / H * Math.PI * 2;
      B[Q * 9] = 0, B[Q * 9 + 1] = 0, B[Q * 9 + 2] = 0, B[Q * 9 + 3] = 0, B[Q * 9 + 4] = G * Math.cos(fe), B[Q * 9 + 5] = G * Math.sin(fe), B[Q * 9 + 6] = 0, B[Q * 9 + 7] = G * Math.cos(we), B[Q * 9 + 8] = G * Math.sin(we);
    }
    const q = new Ae();
    q.setAttribute("position", new ht(B, 3));
    const U = new Float32Array((H + 1) * 3);
    for (let Q = 0; Q <= H; Q++) {
      const fe = Q / H * Math.PI * 2;
      U[Q * 3] = 0, U[Q * 3 + 1] = G * Math.cos(fe), U[Q * 3 + 2] = G * Math.sin(fe);
    }
    const L = new Ae();
    return L.setAttribute("position", new ht(U, 3)), { fill: q, outline: L };
  }
  function C(J, H, G, B) {
    const q = G ?? H * 0.08, U = B ?? J * 0.07, L = J / 2, Q = H / 2, fe = Q - q, we = U / 2, Me = [];
    function W(he, Ve, ve, We) {
      Me.push(0, he, Ve, 0, ve, Ve, 0, ve, We, 0, he, Ve, 0, ve, We, 0, he, We);
    }
    W(-L, -Q, L, -fe), W(-we, -fe, we, fe), W(-L, fe, L, Q);
    const be = new Ae();
    be.setAttribute("position", new ht(new Float32Array(Me), 3));
    const ce = new Float32Array([0, -L, -Q, 0, L, -Q, 0, L, -fe, 0, we, -fe, 0, we, fe, 0, L, fe, 0, L, Q, 0, -L, Q, 0, -L, fe, 0, -we, fe, 0, -we, -fe, 0, -L, -fe, 0, -L, -Q]), Fe = new Ae();
    return Fe.setAttribute("position", new ht(ce, 3)), { fill: be, outline: Fe };
  }
  function I(J, H, G) {
    const B = J / 2, q = H / 2, U = B - G, L = q - G, Q = [];
    function fe(be, ce, Fe, he) {
      Q.push(0, be, ce, 0, Fe, ce, 0, Fe, he, 0, be, ce, 0, Fe, he, 0, be, he);
    }
    fe(-B, -q, B, -L), fe(-B, L, B, q), fe(-B, -L, -U, L), fe(U, -L, B, L);
    const we = new Ae();
    we.setAttribute("position", new ht(new Float32Array(Q), 3));
    const Me = new Float32Array([0, -B, -q, 0, B, -q, 0, B, -q, 0, B, q, 0, B, q, 0, -B, q, 0, -B, q, 0, -B, -q, 0, -U, -L, 0, U, -L, 0, U, -L, 0, U, L, 0, U, L, 0, -U, L, 0, -U, L, 0, -U, -L]), W = new Ae();
    return W.setAttribute("position", new ht(Me, 3)), { fill: we, outline: W };
  }
  function D(J, H, G) {
    const B = J / 2, q = H / 2, U = B - G, L = q - G, Q = new Ae(), fe = new Float32Array([0, -U, -L, 0, U, -L, 0, U, L, 0, -U, -L, 0, U, L, 0, -U, L]);
    Q.setAttribute("position", new ht(fe, 3));
    const we = [];
    function Me(Fe, he, Ve, ve) {
      we.push(0, Fe, he, 0, Ve, he, 0, Ve, ve, 0, Fe, he, 0, Ve, ve, 0, Fe, ve);
    }
    Me(-B, -q, B, -L), Me(-B, L, B, q), Me(-B, -L, -U, L), Me(U, -L, B, L);
    const W = new Ae();
    W.setAttribute("position", new ht(new Float32Array(we), 3));
    const be = new Float32Array([0, -B, -q, 0, B, -q, 0, B, -q, 0, B, q, 0, B, q, 0, -B, q, 0, -B, q, 0, -B, -q, 0, -U, -L, 0, U, -L, 0, U, -L, 0, U, L, 0, U, L, 0, -U, L, 0, -U, L, 0, -U, -L]), ce = new Ae();
    return ce.setAttribute("position", new ht(be, 3)), { concFill: Q, steelFillGeom: W, outline: ce };
  }
  function R(J, H, G) {
    const B = [], q = [[0, -J / 2, -H / 2], [0, -J / 2 + G, -H / 2], [0, -J / 2 + G, H / 2 - G], [0, J / 2, H / 2 - G], [0, J / 2, H / 2], [0, -J / 2, H / 2]], U = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const we of U) B.push(...q[we]);
    const L = new Ae();
    L.setAttribute("position", new ht(new Float32Array(B), 3));
    const Q = [];
    for (let we = 0; we < q.length; we++) {
      const Me = (we + 1) % q.length;
      Q.push(...q[we], ...q[Me]);
    }
    const fe = new Ae();
    return fe.setAttribute("position", new ht(new Float32Array(Q), 3)), { fill: L, outline: fe };
  }
  function ee(J, H, G, B) {
    const q = B / 2, U = [], L = [[0, -J - q, -H / 2], [0, -G - q, -H / 2], [0, -G - q, H / 2 - G], [0, -q, H / 2 - G], [0, -q, H / 2], [0, -J - q, H / 2]], Q = [[0, q, -H / 2], [0, q + G, -H / 2], [0, q + G, H / 2 - G], [0, J + q, H / 2 - G], [0, J + q, H / 2], [0, q, H / 2]], fe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const be of fe) U.push(...L[be]);
    for (const be of fe) U.push(...Q[be]);
    const we = new Ae();
    we.setAttribute("position", new ht(new Float32Array(U), 3));
    const Me = [];
    for (const be of [L, Q]) for (let ce = 0; ce < be.length; ce++) {
      const Fe = (ce + 1) % be.length;
      Me.push(...be[ce], ...be[Fe]);
    }
    const W = new Ae();
    return W.setAttribute("position", new ht(new Float32Array(Me), 3)), { fill: we, outline: W };
  }
  function pe(J, H, G, B) {
    const q = H / 2, U = J, L = [[0, -U, -q], [0, -U, -q + G], [0, -B, -q + G], [0, -B, q - G], [0, -U, q - G], [0, -U, q], [0, 0, q], [0, 0, -q]], Q = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], fe = [];
    for (const be of Q) fe.push(...L[be]);
    const we = new Ae();
    we.setAttribute("position", new ht(new Float32Array(fe), 3));
    const Me = [];
    for (let be = 0; be < L.length; be++) {
      const ce = (be + 1) % L.length;
      Me.push(...L[be], ...L[ce]);
    }
    const W = new Ae();
    return W.setAttribute("position", new ht(new Float32Array(Me), 3)), { fill: we, outline: W };
  }
  function me(J, H, G, B, q) {
    const U = H / 2, L = q / 2, Q = [], fe = [[0, -J, -U], [0, -J, -U + G], [0, -L - B, -U + G], [0, -L - B, U - G], [0, -J, U - G], [0, -J, U], [0, -L, U], [0, -L, -U]], we = fe.map((Fe) => [Fe[0], -Fe[1], Fe[2]]), Me = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const Fe of Me) Q.push(...fe[Fe]);
    for (const Fe of Me) Q.push(...we[Fe]);
    const W = new Ae();
    W.setAttribute("position", new ht(new Float32Array(Q), 3));
    const be = [];
    for (const Fe of [fe, we]) for (let he = 0; he < Fe.length; he++) {
      const Ve = (he + 1) % Fe.length;
      be.push(...Fe[he], ...Fe[Ve]);
    }
    const ce = new Ae();
    return ce.setAttribute("position", new ht(new Float32Array(be), 3)), { fill: W, outline: ce };
  }
  function O(J, H, G, B) {
    const q = J / 2, U = H / 2, L = B / 2, Q = [[0, -L, -U], [0, L, -U], [0, L, U - G], [0, q, U - G], [0, q, U], [0, -q, U], [0, -q, U - G], [0, -L, U - G]], fe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], we = [];
    for (const ce of fe) we.push(...Q[ce]);
    const Me = new Ae();
    Me.setAttribute("position", new ht(new Float32Array(we), 3));
    const W = [];
    for (let ce = 0; ce < Q.length; ce++) {
      const Fe = (ce + 1) % Q.length;
      W.push(...Q[ce], ...Q[Fe]);
    }
    const be = new Ae();
    return be.setAttribute("position", new ht(new Float32Array(W), 3)), { fill: Me, outline: be };
  }
  function N(J, H, G = 24) {
    const B = J / 2, q = B - H, U = [];
    for (let we = 0; we < G; we++) {
      const Me = we / G * Math.PI * 2, W = (we + 1) / G * Math.PI * 2, be = Math.cos(Me), ce = Math.sin(Me), Fe = Math.cos(W), he = Math.sin(W);
      U.push(0, B * be, B * ce, 0, B * Fe, B * he, 0, q * Fe, q * he), U.push(0, B * be, B * ce, 0, q * Fe, q * he, 0, q * be, q * ce);
    }
    const L = new Ae();
    L.setAttribute("position", new ht(new Float32Array(U), 3));
    const Q = [];
    for (let we = 0; we < G; we++) {
      const Me = we / G * Math.PI * 2, W = (we + 1) / G * Math.PI * 2;
      Q.push(0, B * Math.cos(Me), B * Math.sin(Me), 0, B * Math.cos(W), B * Math.sin(W)), Q.push(0, q * Math.cos(Me), q * Math.sin(Me), 0, q * Math.cos(W), q * Math.sin(W));
    }
    const fe = new Ae();
    return fe.setAttribute("position", new ht(new Float32Array(Q), 3)), { fill: L, outline: fe };
  }
  const re = new ft({ color: 52479, transparent: true, opacity: 0.35, side: Et, depthWrite: false }), Y = new dt({ color: 52479 }), ie = new ft({ color: 16750848, transparent: true, opacity: 0.4, side: Et, depthWrite: false }), oe = new dt({ color: 16750848 });
  function ne(J, H) {
    const G = Math.abs(H[0] - J[0]), B = Math.abs(H[1] - J[1]), q = Math.abs(H[2] - J[2]);
    return q > G && q > B || B > G && B > q;
  }
  return le.derive(() => {
    var _a, _b;
    m.deformedShape.val, m.secColumns.val, m.secBeams.val, m.secFloor.val;
    const J = m.secColumns.rawVal, H = m.secBeams.rawVal;
    if (!J && !H) {
      S.children.forEach((L) => {
        L instanceof $t && L.dispose();
      }), S.clear();
      return;
    }
    S.children.forEach((L) => {
      L instanceof $t && L.dispose();
    }), S.clear();
    const G = (_a = n.elements) == null ? void 0 : _a.val, B = (_b = n.elementInputs) == null ? void 0 : _b.val;
    if (!G || !B) return;
    const q = B.sectionShapes, U = m.secFloor.rawVal;
    G.forEach((L, Q) => {
      if (L.length !== 2) return;
      const fe = g.rawVal[L[0]], we = g.rawVal[L[1]];
      if (!fe || !we) return;
      const Me = ne(fe, we);
      if (Me && !J || !Me && !H) return;
      if (U >= 0) {
        const he = Math.min(fe[1], we[1]);
        Math.max(fe[1], we[1]);
        const Ve = m.gridSize.rawVal || 3;
        if (Math.floor(he / Ve + 0.01) !== U) return;
      }
      const W = q == null ? void 0 : q.get(Q);
      if (!W) return;
      const be = [(fe[0] + we[0]) / 2, (fe[1] + we[1]) / 2, (fe[2] + we[2]) / 2], ce = ys(fe, we);
      if (W.type === "CFT") {
        const he = D(W.b, W.h, W.tw ?? W.b * 0.05), Ve = new it(he.concFill, re);
        Ve.position.set(...be), Ve.rotation.setFromRotationMatrix(ce), S.add(Ve);
        const ve = new it(he.steelFillGeom, ie);
        ve.position.set(...be), ve.rotation.setFromRotationMatrix(ce), S.add(ve);
        const We = new Ft(he.outline, oe);
        We.position.set(...be), We.rotation.setFromRotationMatrix(ce), S.add(We);
      } else {
        let he, Ve, ve;
        switch (W.type) {
          case "rect":
            he = F(W.b, W.h), Ve = re, ve = Y;
            break;
          case "circ":
            he = E(W.d), Ve = re, ve = Y;
            break;
          case "I":
            he = C(W.b, W.h, W.tf, W.tw), Ve = ie, ve = oe;
            break;
          case "HSS":
            he = I(W.b, W.h, W.tw ?? W.b * 0.05), Ve = ie, ve = oe;
            break;
          case "CFT":
            he = D(W.b, W.h, W.tw ?? W.b * 0.05), Ve = ie, ve = oe;
            break;
          case "L":
            he = R(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3), Ve = ie, ve = oe;
            break;
          case "2L":
            he = ee(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3, W.dis ?? 0.01), Ve = ie, ve = oe;
            break;
          case "C":
          case "coldC":
            he = pe(W.b, W.h, W.tf ?? W.t ?? 3e-3, W.tw ?? W.t ?? 3e-3), Ve = ie, ve = oe;
            break;
          case "2C":
            he = me(W.b, W.h, W.tf ?? 5e-3, W.tw ?? 5e-3, W.dis ?? 0.01), Ve = ie, ve = oe;
            break;
          case "T":
            he = O(W.b, W.h, W.tf ?? 0.01, W.tw ?? 6e-3), Ve = ie, ve = oe;
            break;
          case "pipe":
            he = N(W.d, W.tw ?? W.d * 0.05), Ve = ie, ve = oe;
            break;
          default:
            return;
        }
        const We = new it(he.fill, Ve);
        We.position.set(...be), We.rotation.setFromRotationMatrix(ce), S.add(We);
        const Qe = new Ft(he.outline, ve);
        Qe.position.set(...be), Qe.rotation.setFromRotationMatrix(ce), S.add(Qe);
      }
      const Fe = Mi(W);
      if (Fe) {
        const Ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(W.type) ? "#ff9900" : "#00ccff", ve = new $t(Fe, Ve, "transparent");
        ve.position.set(be[0], be[1], be[2]);
        const We = 0.05 * m.gridSize.rawVal * 0.5;
        ve.updateScale(We * ((_ == null ? void 0 : _.rawVal) ?? 1)), z.add(ve);
      }
    });
  }), _ && le.derive(() => {
    if (_.val, !m.sections.rawVal) return;
    const J = 0.05 * m.gridSize.val * 0.5;
    z.children.forEach((H) => {
      H instanceof $t && H.updateScale(J * _.rawVal);
    });
  }), le.derive(() => {
    S.visible = m.sections.val;
  }), le.derive(() => {
    z.visible = m.sectionLabels.val;
  }), S;
}
function _i(n) {
  if (!n) return null;
  const m = n.type, g = (D, R) => [D, R], _ = (D, R) => [g(-D / 2, -R / 2), g(D / 2, -R / 2), g(D / 2, R / 2), g(-D / 2, R / 2)], S = (D, R = 24) => {
    const ee = D / 2, pe = [];
    for (let me = 0; me < R; me++) {
      const O = 2 * Math.PI * me / R;
      pe.push(g(ee * Math.cos(O), ee * Math.sin(O)));
    }
    return pe;
  }, z = n.b ?? 0, F = n.h ?? 0, E = n.d ?? 0, C = n.tw ?? n.t ?? 0, I = n.tf ?? n.t ?? 0;
  switch (m) {
    case "rect":
      return z && F ? { contorno: _(z, F) } : null;
    case "circ":
      return E ? { contorno: S(E) } : null;
    case "pipe":
      return E && C ? { contorno: S(E), huecos: [S(E - 2 * C).reverse()] } : null;
    case "HSS":
      return z && F && C ? { contorno: _(z, F), huecos: [_(z - 2 * C, F - 2 * (I || C)).reverse()] } : null;
    case "CFT":
      return z && F ? { contorno: _(z, F) } : null;
    case "I":
      return z && F && C && I ? { contorno: [g(-z / 2, -F / 2), g(z / 2, -F / 2), g(z / 2, -F / 2 + I), g(C / 2, -F / 2 + I), g(C / 2, F / 2 - I), g(z / 2, F / 2 - I), g(z / 2, F / 2), g(-z / 2, F / 2), g(-z / 2, F / 2 - I), g(-C / 2, F / 2 - I), g(-C / 2, -F / 2 + I), g(-z / 2, -F / 2 + I)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return z && F && C && I ? { contorno: [g(-z / 2, -F / 2), g(z / 2, -F / 2), g(z / 2, -F / 2 + I), g(-z / 2 + C, -F / 2 + I), g(-z / 2 + C, F / 2 - I), g(z / 2, F / 2 - I), g(z / 2, F / 2), g(-z / 2, F / 2)] } : null;
    case "T":
      return z && F && C && I ? { contorno: [g(-C / 2, -F / 2), g(C / 2, -F / 2), g(C / 2, F / 2 - I), g(z / 2, F / 2 - I), g(z / 2, F / 2), g(-z / 2, F / 2), g(-z / 2, F / 2 - I), g(-C / 2, F / 2 - I)] } : null;
    case "L":
    case "2L":
      return z && F && C ? { contorno: [g(-z / 2, -F / 2), g(z / 2, -F / 2), g(z / 2, -F / 2 + C), g(-z / 2 + C, -F / 2 + C), g(-z / 2 + C, F / 2), g(-z / 2, F / 2)] } : null;
    default:
      return z && F ? { contorno: _(z, F) } : E ? { contorno: S(E) } : null;
  }
}
function ki(n, m, g) {
  if (!n || n <= 0 || !m || !g || m <= 0 || g <= 0) return null;
  const _ = Math.sqrt(Math.sqrt(g / m)), S = Math.sqrt(n / _), z = n / S;
  return !isFinite(S) || !isFinite(z) || S <= 0 || z <= 0 ? null : { contorno: [[-S / 2, -z / 2], [S / 2, -z / 2], [S / 2, z / 2], [-S / 2, z / 2]] };
}
function Si(n) {
  const m = new ao();
  n.contorno.forEach(([g, _], S) => S ? m.lineTo(g, _) : m.moveTo(g, _)), m.closePath();
  for (const g of n.huecos ?? []) {
    const _ = new ei();
    g.forEach(([S, z], F) => F ? _.lineTo(S, z) : _.moveTo(S, z)), _.closePath(), m.holes.push(_);
  }
  return m;
}
function Pi(n, m, g) {
  const _ = new ct();
  _.name = "extrusion";
  const S = new as({ color: 8369151, transparent: true, opacity: 0.92, side: Et }), z = new as({ color: 12623968, transparent: true, opacity: 0.85, side: Et }), F = new as({ color: 11583173, transparent: true, opacity: 0.85, side: Et }), E = new ct();
  E.add(new ua(16777215, 0.55));
  const C = new To(16777215, 0.75);
  C.position.set(30, 25, 40);
  const I = new To(16777215, 0.35);
  I.position.set(-25, -20, 15), E.add(C, I);
  let D = 0;
  return le.derive(() => {
    var _a, _b, _c, _d, _e;
    const R = ((_a = m.extruded) == null ? void 0 : _a.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++D, on: R }, _.visible = R;
    for (const Y of [..._.children]) Y !== E && (_.remove(Y), (_c = (_b = Y.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (_.children.includes(E) || _.add(E), !R) return;
    const ee = g.val ?? [], pe = ((_d = n.elements) == null ? void 0 : _d.val) ?? [], me = ((_e = n.elementInputs) == null ? void 0 : _e.val) ?? {}, O = me.sectionShapes ?? /* @__PURE__ */ new Map(), N = me.thicknesses ?? /* @__PURE__ */ new Map();
    let re = "";
    try {
      pe.forEach((Y, ie) => {
        var _a2, _b2, _c2;
        if (Y.length === 2) {
          let oe = _i(O.get(ie)), ne = true;
          if (oe || (oe = ki((_a2 = me.areas) == null ? void 0 : _a2.get(ie), (_b2 = me.momentsOfInertiaY) == null ? void 0 : _b2.get(ie), (_c2 = me.momentsOfInertiaZ) == null ? void 0 : _c2.get(ie)), ne = false), !oe) return;
          const J = ee[Y[0]], H = ee[Y[1]];
          if (!J || !H) return;
          const G = Math.hypot(H[0] - J[0], H[1] - J[1], H[2] - J[2]);
          if (G < 1e-9) return;
          const B = new ja(Si(oe), { depth: G, bevelEnabled: false, curveSegments: 4 });
          B.applyMatrix4(new Ro().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const q = new it(B, ne ? S : z);
          q.position.set(J[0], J[1], J[2]), q.rotation.setFromRotationMatrix(ys(J, H)), _.add(q);
          return;
        }
        if (Y.length === 3 || Y.length === 4) {
          const oe = N.get(ie);
          if (!oe || oe <= 0) return;
          const ne = Y.map((he) => ee[he]).filter(Boolean);
          if (ne.length < 3) return;
          const J = [ne[1][0] - ne[0][0], ne[1][1] - ne[0][1], ne[1][2] - ne[0][2]], H = [ne[2][0] - ne[0][0], ne[2][1] - ne[0][1], ne[2][2] - ne[0][2]], G = J[1] * H[2] - J[2] * H[1], B = J[2] * H[0] - J[0] * H[2], q = J[0] * H[1] - J[1] * H[0], U = Math.hypot(G, B, q);
          if (U < 1e-12) return;
          const L = [G / U, B / U, q / U], Q = [], fe = (he) => ne.map((Ve) => [Ve[0] + L[0] * he, Ve[1] + L[1] * he, Ve[2] + L[2] * he]), we = Math.abs(L[2]) > 0.5, Me = L[2] > 0 ? -1 : 1, W = fe(we ? 0 : +oe / 2), be = fe(we ? Me * oe : -oe / 2), ce = (he, Ve, ve) => Q.push(...he, ...Ve, ...ve);
          for (const he of [W, be]) ce(he[0], he[1], he[2]), he.length === 4 && ce(he[0], he[2], he[3]);
          for (let he = 0; he < ne.length; he++) {
            const Ve = (he + 1) % ne.length;
            ce(W[he], be[he], be[Ve]), ce(W[he], be[Ve], W[Ve]);
          }
          const Fe = new Ae();
          Fe.setAttribute("position", new Vt(Q, 3)), Fe.computeVertexNormals(), _.add(new it(Fe, F));
        }
      });
    } catch (Y) {
      re = String((Y == null ? void 0 : Y.message) ?? Y);
    }
    globalThis.__extrusionDebug = { corridas: D, on: R, fallo: re, nElementos: pe.length, nFormas: O.size, nEspesores: N.size, mallas: _.children.length - 1 };
  }), _;
}
function ya(n, m, g = 0) {
  const _ = [m[0] - n[0], m[1] - n[1], m[2] - n[2]], S = Math.hypot(_[0], _[1], _[2]) || 1, z = _[0] / S, F = _[1] / S, E = _[2] / S, C = Math.sqrt(z * z + F * F);
  let I, D, R;
  if (C < 1e-9) {
    const ee = E > 0 ? 1 : -1;
    I = [0, 0, ee], D = [1, 0, 0], R = [0, ee, 0];
  } else I = [z, F, E], D = [-z * E / C, -F * E / C, C], R = [F / C, -z / C, 0];
  if (Math.abs(g) > 1e-12) {
    const ee = g * Math.PI / 180, pe = Math.cos(ee), me = Math.sin(ee), O = D.map((re, Y) => pe * re + me * R[Y]), N = R.map((re, Y) => -me * D[Y] + pe * re);
    D = O, R = N;
  }
  return { e1: I, e2: D, e3: R };
}
function hs(n, m) {
  if (!m) return [0, 0];
  const g = Number(m[0] ?? 0), _ = Number(m[1] ?? 0);
  return n === "bendingsY" ? [g, -_] : [-g, _];
}
function xa(n, m) {
  const g = (_) => _.map((S) => -S);
  switch (n) {
    case "bendingsZ":
      return g(m.e2);
    case "bendingsY":
      return g(m.e3);
    case "shearsZ":
      return m.e3;
    default:
      return m.e2;
  }
}
class Eo extends ct {
  constructor(m, g, _, S, z, F, E) {
    super();
    const C = new ao().moveTo(0, 0).lineTo(0, F[1]).lineTo(_, F[1]).lineTo(_, 0).lineTo(0, 0), I = C.getPoints(), D = new Ae().setFromPoints(I);
    this.lines = new Ft(D, new dt({ color: $n().resultOutline })), this.lines.position.set(...m), this.lines.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const R = new Lo(C), ee = new ft({ color: F[1] > 0 ? 24435 : 11411474, side: Et });
    this.mesh = new it(R, ee), this.mesh.position.set(...m), this.mesh.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new $t(`${z[1].toFixed(4)}`), this.normalizedResult = F, this.textPosition = io([m, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(S), this.add(this.text);
  }
  updateScale(m) {
    this.lines.scale.set(1, m * 2, 1), this.mesh.scale.set(1, m * 2, 1), this.text.updateScale(m * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * m);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class us extends ct {
  constructor(m, g, _, S, z, F, E) {
    super();
    const C = z[0] * _ / (z[0] + z[1]), I = z[0] * z[1] > 0;
    if (this.text = new $t(`${z[0].toFixed(4)}`), this.text2 = new $t(`${(z[1] * -1).toFixed(4)}`), this.normalizedResult = F, this.textPosition = fs(m, g), this.text2Position = fs(g, m), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(S), this.text2.rotation.setFromRotationMatrix(S), this.add(this.text, this.text2), I) {
      const D = new ao().moveTo(0, 0).lineTo(0, F[0]).lineTo(C, 0).lineTo(0, 0), R = new ao().moveTo(C, 0).lineTo(_, -F[1]).lineTo(_, 0).lineTo(C, 0), ee = D.getPoints(), pe = R.getPoints(), me = new Ae().setFromPoints(ee), O = new Ae().setFromPoints(pe), N = new dt({ color: $n().resultOutline });
      this.lines = new Ft(me, N), this.lines2 = new Ft(O, N), this.lines.position.set(...m), this.lines2.position.set(...m), this.lines.rotation.setFromRotationMatrix(S), this.lines2.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), E && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const re = new Lo(D), Y = new Lo(R), ie = new ft({ color: F[0] > 0 ? 24435 : 11411474, side: Et }), oe = new ft({ color: -F[1] > 0 ? 24435 : 11411474, side: Et });
      this.mesh = new it(re, ie), this.mesh2 = new it(Y, oe), this.mesh.position.set(...m), this.mesh2.position.set(...m), this.mesh.rotation.setFromRotationMatrix(S), this.mesh2.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), E && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const D = new ao().moveTo(0, 0).lineTo(0, F[0]).lineTo(_, -F[1]).lineTo(_, 0).lineTo(0, 0), R = D.getPoints(), ee = new Ae().setFromPoints(R);
      this.lines = new Ft(ee, new dt({ color: $n().resultOutline })), this.lines.position.set(...m), this.lines.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const pe = new Lo(D), me = new ft({ color: F[0] > 0 ? 24435 : 11411474, side: Et });
      this.mesh = new it(pe, me), this.mesh.position.set(...m), this.mesh.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(m) {
    var _a, _b;
    this.lines.scale.set(1, m * 2, 1), (_a = this.lines2) == null ? void 0 : _a.scale.set(1, m * 2, 1), this.mesh.scale.set(1, m * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, m * 2, 1), this.text.updateScale(m * 0.6), this.text2.updateScale(m * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * m), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * m);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a = this.lines2) == null ? void 0 : _a.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var ga = ((n) => (n.normals = "normals", n.shearsY = "shearsY", n.shearsZ = "shearsZ", n.torsions = "torsions", n.bendingsY = "bendingsY", n.bendingsZ = "bendingsZ", n))(ga || {});
function Ci(n, m, g, _) {
  const S = () => {
    const E = g.rawVal;
    if (!(E == null ? void 0 : E.length)) return 0.05 * m.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], I = [-1 / 0, -1 / 0, -1 / 0];
    for (const R of E) for (let ee = 0; ee < 3; ee++) R[ee] < C[ee] && (C[ee] = R[ee]), R[ee] > I[ee] && (I[ee] = R[ee]);
    const D = Math.hypot(I[0] - C[0], I[1] - C[1], I[2] - C[2]);
    return !isFinite(D) || D <= 0 ? 0.05 * m.gridSize.rawVal : 0.025 * D;
  }, z = new ct(), F = { normals: Eo, shearsY: Eo, shearsZ: Eo, torsions: Eo, bendingsY: us, bendingsZ: us };
  return le.derive(() => {
    var _a, _b;
    if (m.deformedShape.val, g.val, m.frameResults.val == "none") return;
    z.children.forEach((C) => C.dispose()), z.clear();
    const E = ga[m.frameResults.rawVal];
    (_b = (_a = n.analyzeOutputs) == null ? void 0 : _a.rawVal[E]) == null ? void 0 : _b.forEach((C, I) => {
      var _a2, _b2, _c, _d, _e, _f;
      const D = ((_a2 = n.elements) == null ? void 0 : _a2.rawVal[I]) ?? [0, 1], R = g.rawVal[D[0]], ee = g.rawVal[D[1]];
      if (!R || !ee) return;
      const pe = new V(...ee).distanceTo(new V(...R)), me = zi((_b2 = n.analyzeOutputs) == null ? void 0 : _b2.rawVal[E]), O = ((_f = (_e = (_d = (_c = n.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, I)) ?? 0, N = ya(R, ee, O), re = xa(E, N), Y = new V(...N.e1), ie = new V(...re), oe = new Ro().makeBasis(Y, ie, Y.clone().cross(ie)), [ne, J] = hs(E, C), H = F[E] === us ? [ne, -J] : [ne, J], G = H.map((q) => q / (me === 0 ? 1 : me)), B = new F[E](R, ee, pe, oe, H, G, false);
      B.updateScale(S() * _.rawVal), z.add(B);
    });
  }), le.derive(() => {
    if (_.val, m.frameResults.rawVal == "none") return;
    m.gridSize.val;
    const E = S();
    z.children.forEach((C) => C.updateScale(E * _.rawVal));
  }), le.derive(() => {
    z.visible = m.frameResults.val != "none";
  }), z;
}
function zi(n) {
  let m = 0;
  return n == null ? void 0 : n.forEach((g) => {
    const _ = Math.max(...(g ?? [0, 0]).map((S) => Math.abs(S)));
    _ > m && (m = _);
  }), m;
}
class Ai extends ct {
  constructor(m, g, _) {
    super();
    const S = g === xs.reactions;
    _[0] && (this.xText1 = new $t(`${S ? "Fx" : "Dx"}: ` + _[0].toFixed(4))), _[3] && (this.xText2 = new $t(`${S ? "Mx" : "Rx"}: ` + _[3].toFixed(4))), _[1] && (this.yText1 = new $t(`${S ? "Fy" : "Dy"}: ` + _[1].toFixed(4))), _[4] && (this.yText2 = new $t(`${S ? "My" : "Ry"}: ` + _[4].toFixed(4))), _[2] && (this.zText1 = new $t(`${S ? "Fz" : "Dz"}: ` + _[2].toFixed(4))), _[5] && (this.zText2 = new $t(`${S ? "Mz" : "Rz"}: ` + _[5].toFixed(4))), (_[0] || _[3]) && (this.xArrow = new Vn(new V(1, 0, 0), new V(0, 0, 0), 1, 15637248, 0.3, 0.3)), (_[1] || _[4]) && (this.yArrow = new Vn(new V(0, 1, 0), new V(0, 0, 0), 1, 15637248, 0.3, 0.3)), (_[2] || _[5]) && (this.zArrow = new Vn(new V(0, 0, 1), new V(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...m), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(m) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o;
    (_a = this.xArrow) == null ? void 0 : _a.scale.set(m, m, m), (_b = this.yArrow) == null ? void 0 : _b.scale.set(m, m, m), (_c = this.zArrow) == null ? void 0 : _c.scale.set(m, m, m), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * m, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * m, 0, 0.5 * m), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * m, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * m, 0.5 * m), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * m), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * m + 0.5 * m), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * m), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * m), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * m), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * m), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * m), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * m);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = this.xArrow) == null ? void 0 : _a.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var xs = ((n) => (n.deformations = "deformations", n.reactions = "reactions", n))(xs || {});
function Fi(n, m, g, _) {
  const S = new ct();
  return le.derive(() => {
    var _a, _b;
    if (m.deformedShape.val, m.nodeResults.val == "none") return;
    S.children.forEach((E) => E.dispose()), S.clear();
    const z = xs[m.nodeResults.rawVal], F = 0.05 * m.gridSize.val;
    (_b = (_a = n.deformOutputs) == null ? void 0 : _a.val[z]) == null ? void 0 : _b.forEach((E, C) => {
      const I = new Ai(g.rawVal[C], z, E ?? [0, 0, 0, 0, 0, 0]);
      I.updateScale(F * _.rawVal), S.add(I);
    });
  }), le.derive(() => {
    if (_.val, m.nodeResults.rawVal == "none") return;
    const z = 0.05 * m.gridSize.val;
    S.children.forEach((F) => F.updateScale(z * _.rawVal));
  }), le.derive(() => {
    S.visible = m.nodeResults.val != "none";
  }), S;
}
function Ei({ drawingObj: n, gridObj: m, scene: g, getActiveCamera: _, controls: S, gridSize: z, derivedDisplayScale: F, rendererElm: E, viewerRender: C }) {
  var _a2;
  const I = new is(), D = new ti(), R = (e) => {
    const o = E.getBoundingClientRect(), a = e.clientX - o.left, t = e.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const c = s / 2;
      if (a >= c) return D.x = (a - c) / c * 2 - 1, D.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? _();
      D.x = a / c * 2 - 1;
    } else D.x = a / s * 2 - 1;
    return D.y = -(t / i) * 2 + 1, _();
  }, ee = new it(new kn(1e4, 1e4), new ft({ side: Et, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, g.add(ee);
  const pe = (e, o, a) => {
    const t = new it(new kn(1e4, 1e4), new ft({ side: Et, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(e, o, a), t.visible = false, t.frustumCulled = false, g.add(t), t;
  }, me = pe(Math.PI / 2, 0, 0), O = pe(0, Math.PI / 2, 0);
  let N = false, re = null, Y = null, ie = null;
  const oe = new Ft(new Ae(), new dt({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  oe.name = "ref-ifc-cadena", oe.renderOrder = 1e3, oe.frustumCulled = false, oe.visible = false, g.add(oe);
  const ne = (e, o, a) => Math.round(e * 1e3) + "," + Math.round(o * 1e3) + "," + Math.round(a * 1e3), J = (e) => {
    const o = /* @__PURE__ */ new Map();
    for (let a = 0; a + 0 < e.length / 6; a++) {
      const t = 6 * a;
      for (const s of [ne(e[t], e[t + 1], e[t + 2]), ne(e[t + 3], e[t + 4], e[t + 5])]) {
        const i = o.get(s);
        i ? i.push(a) : o.set(s, [a]);
      }
    }
    return o;
  }, H = (e) => {
    const { S: o, adj: a } = e, t = (y, M) => new V(o[6 * y + 3 * M], o[6 * y + 3 * M + 1], o[6 * y + 3 * M + 2]), s = /* @__PURE__ */ new Set([e.s]), i = (y, M) => {
      const $ = [];
      let x = y, b = M;
      for (let A = 0; A < 3e3; A++) {
        const Z = (a.get(ne(b.x, b.y, b.z)) || []).filter((Ke) => !s.has(Ke));
        if (Z.length !== 1) break;
        const X = Z[0], K = t(X, 0), de = t(X, 1), ye = K.distanceTo(b) < de.distanceTo(b) ? de : K, ke = b.clone().sub(x).normalize(), ot = ye.clone().sub(b).normalize();
        if (ke.dot(ot) < Math.cos(35 * Math.PI / 180)) break;
        s.add(X), $.push(ye), x = b, b = ye;
      }
      return $;
    }, l = t(e.s, 0), c = t(e.s, 1), r = i(l, c), h = i(c, l), u = [...h.reverse(), l, c, ...r], v = h.length;
    if (u.length < 6) return u;
    const f = [], w = [];
    for (let y = 1; y < u.length; y++) f.push(u[y].distanceTo(u[y - 1]));
    for (let y = 1; y < u.length - 1; y++) {
      const M = u[y].clone().sub(u[y - 1]).normalize(), $ = u[y + 1].clone().sub(u[y]).normalize();
      w.push(Math.acos(Math.max(-1, Math.min(1, M.dot($)))) / Math.max(1e-6, (f[y - 1] + f[y]) / 2));
    }
    const k = w.map((y, M) => {
      let $ = 0, x = 0;
      for (let b = M - 1; b <= M + 1; b++) b >= 0 && b < w.length && ($ += w[b], x++);
      return $ / x;
    }), P = [];
    for (let y = 3; y < k.length - 3; y++) {
      const M = (k[y - 3] + k[y - 2] + k[y - 1]) / 3, $ = (k[y + 1] + k[y + 2] + k[y + 3]) / 3, x = Math.min(M, $), b = Math.max(M, $);
      b > 0.03 && b / Math.max(x, 1e-6) > 2.2 && Math.abs(k[y] - (M + $) / 2) < b && (!P.length || y - P[P.length - 1] > 3) && P.push(y + 1);
    }
    let p = 0, d = u.length - 1;
    for (const y of P) y <= v && y > p && (p = y), y > v && y < d && (d = y);
    return u.slice(p, d + 1);
  }, G = (e) => {
    if (ie = e, !e || e.length < 2) {
      oe.visible = false;
      return;
    }
    oe.geometry.dispose(), oe.geometry = new Ae().setFromPoints(e), oe.visible = true;
  }, B = (e) => {
    let o = 0;
    for (let v = 1; v < e.length - 1; v++) {
      const f = e[v].clone().sub(e[v - 1]).normalize(), w = e[v + 1].clone().sub(e[v]).normalize();
      o += Math.acos(Math.max(-1, Math.min(1, f.dot(w))));
    }
    const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (o < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const t = String(window.__hekatanArcModo ?? "angulo"), s = t === "x" ? 0 : t === "y" ? 1 : t === "z" ? 2 : -1, i = [0];
    for (let v = 1; v < e.length; v++) i.push(i[v - 1] + e[v].distanceTo(e[v - 1]));
    const l = (v, f) => {
      for (let w = 1; w < e.length; w++) {
        const k = v(e[w - 1], w - 1), P = v(e[w], w);
        if (k <= f && f <= P || P <= f && f <= k) {
          const p = Math.abs(P - k) < 1e-12 ? 0 : (f - k) / (P - k);
          return e[w - 1].clone().lerp(e[w], p);
        }
      }
      return e[e.length - 1].clone();
    }, c = [], r = s >= 0 ? e[0].getComponent(s) : 0, h = s >= 0 ? e[e.length - 1].getComponent(s) : 0, u = s >= 0 && Math.abs(h - r) > 1e-6 && e.every((v, f) => f === 0 || (v.getComponent(s) - e[f - 1].getComponent(s)) * (h - r) >= -1e-6);
    for (let v = 0; v <= a; v++) {
      const f = u ? l((w) => w.getComponent(s), r + (h - r) * v / a) : l((w, k) => i[k], i[i.length - 1] * v / a);
      c.push([f.x, f.y, f.z]);
    }
    return c[0] = e[0].toArray(), c[a] = e[e.length - 1].toArray(), c;
  };
  window.__hekatanCadenaIfc = () => (ie || []).map((e) => [e.x, e.y, e.z]);
  const q = /* @__PURE__ */ new Map(), U = (e) => {
    const o = q.get(e.id);
    if (o) return o;
    const a = e.geometry.getAttribute("position"), t = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(t * 9), i = new Float64Array(t * 3), l = new Int32Array(t * 3).fill(-1);
    if (a) {
      e.updateMatrixWorld();
      const r = new V();
      for (let k = 0; k < t * 3; k++) r.fromBufferAttribute(a, k).applyMatrix4(e.matrixWorld), s[3 * k] = r.x, s[3 * k + 1] = r.y, s[3 * k + 2] = r.z;
      const h = new V(), u = new V(), v = new V(), f = (k) => Math.round(s[3 * k] * 1e3) + "," + Math.round(s[3 * k + 1] * 1e3) + "," + Math.round(s[3 * k + 2] * 1e3), w = /* @__PURE__ */ new Map();
      for (let k = 0; k < t; k++) {
        const P = 3 * k;
        h.set(s[3 * (P + 1)] - s[3 * P], s[3 * (P + 1) + 1] - s[3 * P + 1], s[3 * (P + 1) + 2] - s[3 * P + 2]), u.set(s[3 * (P + 2)] - s[3 * P], s[3 * (P + 2) + 1] - s[3 * P + 1], s[3 * (P + 2) + 2] - s[3 * P + 2]), v.crossVectors(h, u).normalize(), i[3 * k] = v.x, i[3 * k + 1] = v.y, i[3 * k + 2] = v.z;
        for (let p = 0; p < 3; p++) {
          const d = f(P + p), y = f(P + (p + 1) % 3), M = d < y ? d + "|" + y : y + "|" + d, $ = w.get(M);
          $ ? $.push(k, p) : w.set(M, [k, p]);
        }
      }
      for (const k of w.values()) k.length === 4 && (l[3 * k[0] + k[1]] = k[2], l[3 * k[2] + k[3]] = k[0]);
    }
    const c = { V: s, N: i, vec: l, n: t };
    return q.set(e.id, c), c;
  }, L = new it(new Ae(), new ft({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Et }));
  L.name = "ref-ifc-cara", L.renderOrder = 999, L.frustumCulled = false, L.visible = false, g.add(L);
  let Q = null;
  const fe = (e, o) => {
    const a = Math.cos(12 * Math.PI / 180), t = Math.cos(80 * Math.PI / 180), s = [e.N[3 * o], e.N[3 * o + 1], e.N[3 * o + 2]], i = new Uint8Array(e.n), l = [], c = [o];
    for (i[o] = 1; c.length && l.length < 4e4; ) {
      const r = c.pop();
      l.push(r);
      for (let h = 0; h < 3; h++) {
        const u = e.vec[3 * r + h];
        if (u < 0 || i[u]) continue;
        const v = e.N[3 * r] * e.N[3 * u] + e.N[3 * r + 1] * e.N[3 * u + 1] + e.N[3 * r + 2] * e.N[3 * u + 2], f = s[0] * e.N[3 * u] + s[1] * e.N[3 * u + 1] + s[2] * e.N[3 * u + 2];
        v >= a && f >= t && (i[u] = 1, c.push(u));
      }
    }
    return l;
  }, we = (e, o, a) => {
    if (!e || o < 0 || !a) {
      Q && (Q = null, L.visible = false);
      return;
    }
    if (Q && Q.m === e && Q.tris.indexOf(o) >= 0) {
      Q.punto = a.clone();
      return;
    }
    const t = U(e), s = fe(t, o), i = new Float32Array(s.length * 9), l = new V();
    let c = true;
    s.forEach((r, h) => {
      for (let u = 0; u < 9; u++) i[9 * h + u] = t.V[9 * r + u];
      l.x += t.N[3 * r], l.y += t.N[3 * r + 1], l.z += t.N[3 * r + 2];
    }), l.normalize();
    for (const r of s) if (l.x * t.N[3 * r] + l.y * t.N[3 * r + 1] + l.z * t.N[3 * r + 2] < Math.cos(5 * Math.PI / 180)) {
      c = false;
      break;
    }
    L.geometry.dispose(), L.geometry = new Ae(), L.geometry.setAttribute("position", new ht(i, 3)), L.material.color.set(c ? 3718648 : 16096779), L.visible = true, Q = { m: e, t0: o, tris: s, normal: l, plana: c, punto: a.clone() };
  }, Me = (e, o) => {
    const a = new Uint8Array(e.n);
    for (const u of o) a[u] = 1;
    const t = (u) => Math.round(e.V[3 * u] * 1e3) + "," + Math.round(e.V[3 * u + 1] * 1e3) + "," + Math.round(e.V[3 * u + 2] * 1e3), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    for (const u of o) for (let v = 0; v < 3; v++) {
      const f = e.vec[3 * u + v];
      if (f >= 0 && a[f]) continue;
      const w = 3 * u + v, k = 3 * u + (v + 1) % 3, P = t(w), p = t(k);
      i.set(P, new V(e.V[3 * w], e.V[3 * w + 1], e.V[3 * w + 2])), i.set(p, new V(e.V[3 * k], e.V[3 * k + 1], e.V[3 * k + 2])), (s.get(P) || s.set(P, []).get(P)).push(p), (s.get(p) || s.set(p, []).get(p)).push(P);
    }
    const l = /* @__PURE__ */ new Set();
    let c = [];
    for (const u of s.keys()) {
      if (l.has(u)) continue;
      const v = [u];
      l.add(u);
      let f = "", w = u;
      for (let k = 0; k < 1e5; k++) {
        const P = (s.get(w) || []).find((p) => p !== f && !l.has(p));
        if (!P) break;
        v.push(P), l.add(P), f = w, w = P;
      }
      v.length > c.length && (c = v);
    }
    const r = c.map((u) => i.get(u)), h = [];
    for (let u = 0; u < r.length; u++) {
      const v = r[(u + r.length - 1) % r.length], f = r[u], w = r[(u + 1) % r.length];
      if (f.distanceTo(v) < 1e-3) continue;
      const k = f.clone().sub(v).normalize(), P = w.clone().sub(f).normalize();
      k.dot(P) > Math.cos(3 * Math.PI / 180) || h.push(f);
    }
    return h;
  }, W = (e, o, a) => {
    const s = new is(o.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
    return s.length ? s[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, o, a, t = 2) => {
    const s = new V(e[0], e[1], e[2]), i = new V(o[0], o[1], o[2]).normalize();
    let l = null;
    for (const c of [1, -1]) {
      const h = new is(s, i.clone().multiplyScalar(c), 0, t).intersectObjects(a, false);
      h.length && (l == null || h[0].distance < l) && (l = h[0].distance);
    }
    return l;
  }, window.__hekatanCaraIfc = () => Q ? { tris: Q.tris.length, plana: Q.plana, normal: Q.normal.toArray(), punto: Q.punto.toArray(), contorno: Me(U(Q.m), Q.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const be = /* @__PURE__ */ new Map(), ce = new Jt(new Ae(), new dt({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  ce.name = "ref-ifc-bordes", ce.frustumCulled = false, ce.visible = false, g.add(ce);
  const Fe = 1, he = (e, o, a) => Math.floor(e / Fe) + "," + Math.floor(o / Fe) + "," + Math.floor(a / Fe), Ve = (e) => {
    const o = be.get(e.id);
    if (o) return o;
    const a = e.geometry.getAttribute("position"), t = [], s = /* @__PURE__ */ new Map();
    if (a) {
      e.updateMatrixWorld();
      const l = Math.floor(a.count / 3), c = new Float64Array(a.count * 3), r = new V();
      for (let p = 0; p < a.count; p++) r.fromBufferAttribute(a, p).applyMatrix4(e.matrixWorld), c[3 * p] = r.x, c[3 * p + 1] = r.y, c[3 * p + 2] = r.z;
      const h = (p) => Math.round(c[3 * p] * 1e3) + "," + Math.round(c[3 * p + 1] * 1e3) + "," + Math.round(c[3 * p + 2] * 1e3), u = new Float64Array(l * 3), v = new V(), f = new V(), w = new V();
      for (let p = 0; p < l; p++) {
        const d = 3 * p, y = 3 * p + 1, M = 3 * p + 2;
        v.set(c[3 * y] - c[3 * d], c[3 * y + 1] - c[3 * d + 1], c[3 * y + 2] - c[3 * d + 2]), f.set(c[3 * M] - c[3 * d], c[3 * M + 1] - c[3 * d + 1], c[3 * M + 2] - c[3 * d + 2]), w.crossVectors(v, f).normalize(), u[3 * p] = w.x, u[3 * p + 1] = w.y, u[3 * p + 2] = w.z;
      }
      const k = /* @__PURE__ */ new Map();
      for (let p = 0; p < l; p++) for (let d = 0; d < 3; d++) {
        const y = 3 * p + d, M = 3 * p + (d + 1) % 3, $ = h(y), x = h(M), b = $ < x ? $ + "|" + x : x + "|" + $, A = k.get(b);
        A ? A.push(p) : k.set(b, [p, y, M]);
      }
      const P = Math.cos(25 * Math.PI / 180);
      for (const p of k.values()) {
        const d = p[0], y = p[1], M = p[2];
        let $ = p.length === 3;
        if (!$ && p.length === 4) {
          const b = p[3], A = u[3 * d] * u[3 * b] + u[3 * d + 1] * u[3 * b + 1] + u[3 * d + 2] * u[3 * b + 2];
          $ = Math.abs(A) < P;
        }
        if (!$) continue;
        const x = t.length / 6;
        t.push(c[3 * y], c[3 * y + 1], c[3 * y + 2], c[3 * M], c[3 * M + 1], c[3 * M + 2]);
        for (const [b, A, Z] of [[c[3 * y], c[3 * y + 1], c[3 * y + 2]], [c[3 * M], c[3 * M + 1], c[3 * M + 2]], [(c[3 * y] + c[3 * M]) / 2, (c[3 * y + 1] + c[3 * M + 1]) / 2, (c[3 * y + 2] + c[3 * M + 2]) / 2]]) {
          const X = he(b, A, Z), K = s.get(X);
          K ? K[K.length - 1] !== x && K.push(x) : s.set(X, [x]);
        }
      }
    }
    const i = { segs: new Float32Array(t), celdas: s };
    return be.set(e.id, i), i;
  };
  let ve = "";
  const We = (e) => {
    const o = e.map((l) => l.id).join(",");
    if (o === ve) return;
    ve = o;
    const a = e.map((l) => Ve(l).segs);
    let t = 0;
    for (const l of a) t += l.length;
    const s = new Float32Array(t);
    let i = 0;
    for (const l of a) s.set(l, i), i += l.length;
    ce.geometry.dispose(), ce.geometry = new Ae(), ce.geometry.setAttribute("position", new ht(s, 3)), ce.visible = t > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    ce.visible = ve !== "" && window.__hekatanRefIfcBordes !== false, C();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const o of be.values()) e += o.segs.length / 6;
    return e;
  };
  const Qe = (e, o) => {
    const a = window.__hekatanCursorPx;
    if (!a) return null;
    const t = Ve(e), s = t.segs, i = Math.floor(o.x / Fe), l = Math.floor(o.y / Fe), c = Math.floor(o.z / Fe), r = /* @__PURE__ */ new Set();
    let h = bn, u = null, v = bn, f = null, w = -1;
    const k = new V(), P = new V();
    for (let p = -1; p <= 1; p++) for (let d = -1; d <= 1; d++) for (let y = -1; y <= 1; y++) {
      const M = t.celdas.get(i + p + "," + (l + d) + "," + (c + y));
      if (M) for (const $ of M) {
        if (r.has($)) continue;
        r.add($);
        const x = 6 * $;
        k.set(s[x], s[x + 1], s[x + 2]), P.set(s[x + 3], s[x + 4], s[x + 5]);
        const b = An(k.x, k.y, k.z), A = An(P.x, P.y, P.z);
        if (!b || !A) continue;
        const Z = Math.hypot(b.x - a.x, b.y - a.y), X = Math.hypot(A.x - a.x, A.y - a.y);
        Z < h && (h = Z, u = k.clone()), X < h && (h = X, u = P.clone());
        const K = A.x - b.x, de = A.y - b.y, ye = K * K + de * de || 1e-9;
        let ke = ((a.x - b.x) * K + (a.y - b.y) * de) / ye;
        ke = Math.max(0, Math.min(1, ke));
        const ot = Math.hypot(a.x - (b.x + ke * K), a.y - (b.y + ke * de));
        ot < v && (v = ot, f = k.clone().lerp(P, ke), w = $);
      }
    }
    return w >= 0 && (t.adj || (t.adj = J(t.segs)), Y = { S: t.segs, adj: t.adj, s: w }), u ? { tipo: "ifcVert", punto: u } : f ? { tipo: "ifcEdge", punto: f } : null;
  }, vt = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((i) => {
      var _a4;
      ((_a4 = i.userData) == null ? void 0 : _a4.refIfc) && i.isMesh && e.push(i);
    }), !e.length) return ce.visible = false, ve = "", null;
    We(e);
    const o = I.intersectObjects(e, false).filter((i) => {
      const l = i.object.material;
      return (l && l.clippingPlanes || []).every((r) => r.distanceToPoint(i.point) >= 0);
    });
    if (!o.length) return null;
    const a = o[0], t = o[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? we(a.object, a.faceIndex ?? -1, a.point) : Q && we(null, -1, null);
    const s = Qe(a.object, a.point);
    if (s) return re = { tipo: s.tipo }, [{ ...a, point: s.punto }];
    if (t && t.object === a.object && t.distance - a.distance <= 1.2) {
      const i = a.point.clone().add(t.point).multiplyScalar(0.5);
      return re = { tipo: "ifcAxis" }, [{ ...a, point: i }];
    }
    return re = { tipo: "ifc" }, [a];
  };
  let Mt = "", xe = new Float32Array(0);
  const T = new Jt(new Ae(), new dt({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  T.name = "ref-ifc-seccion", T.renderOrder = 998, T.frustumCulled = false, T.visible = false, g.add(T);
  const te = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return T.visible = false, xe = new Float32Array(0);
    const o = [];
    e.enableX && o.push([0, +e.posX]), e.enableY && o.push([1, +e.posY]), e.enableZ && o.push([2, +e.posZ]);
    const a = [];
    g.traverse((i) => {
      var _a3;
      ((_a3 = i.userData) == null ? void 0 : _a3.refIfc) && i.isMesh && a.push(i);
    });
    const t = JSON.stringify(o) + "|" + a.map((i) => i.id).join(",");
    if (t === Mt) return xe;
    Mt = t;
    const s = [];
    if (o.length && a.length) {
      const i = [new V(), new V(), new V()];
      for (const l of a) {
        const c = l.geometry.getAttribute("position");
        if (c) {
          l.updateMatrixWorld();
          for (let r = 0; r + 2 < c.count; r += 3) {
            for (let h = 0; h < 3; h++) i[h].fromBufferAttribute(c, r + h).applyMatrix4(l.matrixWorld);
            for (const [h, u] of o) {
              const v = [i[0].getComponent(h) - u, i[1].getComponent(h) - u, i[2].getComponent(h) - u], f = [];
              for (let w = 0; w < 3; w++) {
                const k = i[w], P = i[(w + 1) % 3], p = v[w], d = v[(w + 1) % 3];
                (p < 0 && d >= 0 || p >= 0 && d < 0) && f.push(k.clone().lerp(P, p / (p - d)));
              }
              f.length === 2 && s.push(f[0].x, f[0].y, f[0].z, f[1].x, f[1].y, f[1].z);
            }
          }
        }
      }
    }
    return xe = new Float32Array(s), T.geometry.dispose(), T.geometry = new Ae(), T.geometry.setAttribute("position", new ht(xe, 3)), T.visible = xe.length > 0, xe;
  };
  let j = null, se = null;
  const Ce = (e, o) => {
    const a = te();
    if (!a.length) return null;
    let t = bn * 2, s = null, i = -1;
    const l = new V(), c = new V();
    for (let r = 0; r + 5 < a.length; r += 6) {
      l.set(a[r], a[r + 1], a[r + 2]), c.set(a[r + 3], a[r + 4], a[r + 5]);
      const h = An(l.x, l.y, l.z), u = An(c.x, c.y, c.z);
      if (!h || !u) continue;
      const v = u.x - h.x, f = u.y - h.y, w = v * v + f * f || 1e-9;
      let k = ((e - h.x) * v + (o - h.y) * f) / w;
      k = Math.max(0, Math.min(1, k));
      const P = Math.hypot(e - (h.x + k * v), o - (h.y + k * f));
      P < t && (t = P, s = l.clone().lerp(c, k), i = r / 6);
    }
    return i >= 0 && (se !== a && (j = J(a), se = a), Y = { S: a, adj: j, s: i }), s;
  };
  let Se = null;
  window.__hekatanSeccionIfc = () => te().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const o = te(), a = [], t = Math.max(1, Math.floor(o.length / 6 / e));
    for (let s = 0; s + 2 < o.length; s += 6 * t) a.push([o[s], o[s + 1], o[s + 2]]);
    return a;
  };
  const ge = () => {
    re = null;
    const e = vt();
    if (e) return e;
    if (N) return I.intersectObjects([ee], false);
    if (me.visible = !!window.__hekatanGridPlaneXZ, O.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ut.visible) {
      const t = I.intersectObjects([Ut, sn, an], false);
      if (t.length > 0) return t;
    }
    const a = [ee];
    return me.visible && a.push(me), O.visible && a.push(O), xn.visible && Nn.length > 0 && a.push(...Nn), I.intersectObjects(a, false);
  }, Le = new $o(new Ae(), new Io()), Ne = new $o(new Ae(), new Io({ color: "gray", sizeAttenuation: false, size: 6 })), je = new $o(new Ae(), new Io({ color: "orange", sizeAttenuation: false, size: 5 }));
  g.add(je);
  const Pe = document.createElement("input");
  Pe.id = "hk-rubber-label", Pe.type = "text", Pe.spellcheck = false, Pe.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Pe.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(Pe);
  let Te = null, lt = null, Je = false;
  const _e = new V(), Be = (e, o, a, t, s, i) => {
    const l = t - e, c = s - o, r = i - a, h = Math.hypot(l, c, r);
    if (h < 0.01) {
      Pe.style.display = "none";
      return;
    }
    Te = [e, o, a], lt = [l / h, c / h, r / h], _e.set((e + t) / 2, (o + s) / 2, (a + i) / 2), _e.project(_());
    const u = E.getBoundingClientRect(), v = u.left + (_e.x * 0.5 + 0.5) * u.width, f = u.top + (-_e.y * 0.5 + 0.5) * u.height;
    if (Pe.style.left = v + "px", Pe.style.top = f + "px", Pe.style.display = "block", !Je) {
      if (Pe.value = `${h.toFixed(2)} m`, document.activeElement !== Pe) {
        const w = document.activeElement;
        w && (w.tagName === "INPUT" || w.tagName === "TEXTAREA") && w !== Pe || Pe.focus({ preventScroll: true });
      }
      try {
        Pe.select();
      } catch {
      }
    }
  }, mt = () => {
    Pe.style.display = "none", Te = null, lt = null, Je = false, document.activeElement === Pe && Pe.blur();
  }, et = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      Fn = e, ae(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), Pe.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ze.length === 1) {
      const u = Ze[0];
      Ze = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, u[0], u[1], u[2], e), ae(`\u2713 C\xEDrculo r=${e} m en (${u[0].toFixed(2)}, ${u[1].toFixed(2)}, ${u[2].toFixed(2)}).`);
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
      St = e, ae(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), Pe.blur();
      return;
    }
    if (!Te || !lt || !n.polylines) return;
    let a = lt[0], t = lt[1], s = lt[2];
    kt === "x" ? (a = Math.sign(a) || 1, t = 0, s = 0) : kt === "y" ? (a = 0, t = Math.sign(t) || 1, s = 0) : kt === "z" && (a = 0, t = 0, s = Math.sign(s) || 1);
    const i = Te[0] + a * e, l = Te[1] + t * e, c = Te[2] + s * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), n.points.val = [...n.points.rawVal, [i, l, c]];
    const r = n.polylines.rawVal, h = r.length ? r[r.length - 1] : [];
    n.polylines.val = [...r.slice(0, -1), [...h, n.points.rawVal.length - 1]], Pe.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    C();
  }, _t = (e) => {
    let o = e.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const a = o.startsWith("@");
    if (a && (o = o.slice(1)), o.includes("<")) {
      const s = o.split("<").map((i) => parseFloat(i.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [i, l] = s;
        return a ? { kind: "relPolar", L: i, ang: l } : { kind: "absPolar", L: i, ang: l };
      }
      if (s.length === 3 && a) {
        const [i, l, c] = s;
        return { kind: "relSpherical", L: i, az: l, el: c };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((r) => parseFloat(r.trim()));
      if (s.some(isNaN)) return null;
      const [i, l, c = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: l, dz: c } : { kind: "absCart", x: i, y: l, z: c };
    }
    const t = parseFloat(o);
    return isNaN(t) || t <= 0 ? null : { kind: "length", L: t };
  }, Dt = (e) => {
    if (!e) return null;
    if (e.kind === "absCart") return [e.x, e.y, e.z];
    if (e.kind === "relCart") return Te ? [Te[0] + e.dx, Te[1] + e.dy, Te[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const o = e.ang * Math.PI / 180;
      return [e.L * Math.cos(o), e.L * Math.sin(o), 0];
    }
    if (e.kind === "relPolar") {
      if (!Te) return null;
      const o = e.ang * Math.PI / 180;
      return [Te[0] + e.L * Math.cos(o), Te[1] + e.L * Math.sin(o), Te[2]];
    }
    if (e.kind === "relSpherical") {
      if (!Te) return null;
      const o = e.az * Math.PI / 180, a = e.el * Math.PI / 180, t = e.L * Math.cos(a);
      return [Te[0] + t * Math.cos(o), Te[1] + t * Math.sin(o), Te[2] + e.L * Math.sin(a)];
    }
    return null;
  }, nt = (e) => {
    var _a3, _b;
    if (!n.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), n.points.val = [...n.points.rawVal, e];
    const o = n.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    n.polylines.val = [...o.slice(0, -1), [...a, n.points.rawVal.length - 1]], Te = e, Pe.blur();
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
    const o = _t(e);
    if (!o) return false;
    if (o.kind === "length") return et(o.L), true;
    const a = Dt(o);
    if (!a) return false;
    Zs(new V(a[0], a[1], a[2]), null), Te = a, Pe.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, Pe.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const a = _t(Pe.value);
      if (!a) return;
      if (Je = false, a.kind === "length") et(a.L), ae(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = Dt(a);
        if (!t) return;
        nt(t);
        const s = a.kind;
        ae(`\u270F ${s} \u2192 (${t[0].toFixed(2)}, ${t[1].toFixed(2)}, ${t[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), Je = false, Pe.blur();
      return;
    }
    const o = e.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!Je && Pe.style.display === "block") try {
          Pe.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (Je = true);
  }), window.addEventListener("keydown", (e) => {
    if (!Te || !lt || document.activeElement === Pe) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (Pe.value = e.key, Pe.focus(), Pe.setSelectionRange(1, 1), e.preventDefault());
  });
  const Ie = document.createElement("div");
  Ie.id = "hk-coord-readout", Ie.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Ie.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Ie);
  const Re = document.createElement("div");
  Re.id = "hk-coord-fixed", Re.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Re.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Re);
  const Ye = new Ft(new Ae().setFromPoints([new V(0, 0, 0), new V(0, 0, 0)]), new no({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  Ye.frustumCulled = false, Ye.visible = false, Ye.name = "rubberBand", g.add(Ye), window.__hekatanRubberBand = Ye;
  const $e = new Ft(new Ae(), new dt({ color: 2282478, transparent: true, opacity: 0.9 }));
  $e.frustumCulled = false, $e.visible = false, g.add($e);
  let Oe = [];
  const at = new Ft(new Ae(), new dt({ color: 16763904, transparent: true, opacity: 0.95 }));
  at.frustumCulled = false, at.visible = false, at.renderOrder = 999, g.add(at);
  let xt = [];
  const He = document.createElement("div");
  He.id = "hk-measure-label", He.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(He);
  const st = (e) => {
    var _a3, _b;
    const o = R(e);
    if (!o) return null;
    I.setFromCamera(D, o);
    let a = null, t = null;
    const s = I.intersectObjects(g.children, true).filter((f) => f.object.isMesh && f.object !== wt && f.object !== rt && f.object.visible !== false);
    if (s.length) {
      const f = s[0], w = f.point;
      a = [w.x, w.y, w.z];
      const P = (_b = (_a3 = f.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      P && f.face && (t = [f.face.a, f.face.b, f.face.c].map((p) => {
        const d = new V().fromBufferAttribute(P, p);
        return f.object.localToWorld(d), [d.x, d.y, d.z];
      }));
    } else {
      const f = ge();
      if (f.length) {
        const w = f[0].point;
        a = [w.x, w.y, w.z];
      }
    }
    if (!a) return null;
    const i = E.getBoundingClientRect(), l = (f) => {
      const w = new V(f[0], f[1], f[2]).project(o);
      return [i.left + (w.x * 0.5 + 0.5) * i.width, i.top + (-w.y * 0.5 + 0.5) * i.height];
    }, c = [e.clientX, e.clientY], r = 14;
    let h = a, u = r;
    const v = (f) => {
      const w = l(f), k = Math.hypot(w[0] - c[0], w[1] - c[1]);
      k < u && (u = k, h = f);
    };
    for (const f of t ?? []) v(f);
    for (const f of n.points.rawVal) v(f);
    return h;
  }, Ct = () => {
    if (xt.length < 1) {
      He.style.display = "none";
      return;
    }
    const e = _(), o = xt[0], a = xt[1] ?? xt[0], s = new V((o[0] + a[0]) / 2, (o[1] + a[1]) / 2, (o[2] + a[2]) / 2).clone().project(e), i = E.getBoundingClientRect();
    He.style.left = i.left + (s.x * 0.5 + 0.5) * i.width + "px", He.style.top = i.top + (-s.y * 0.5 + 0.5) * i.height - 14 + "px", He.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Ct, window.__hekatanClearMeasure = () => {
    xt = [], at.visible = false, He.style.display = "none";
    try {
      C();
    } catch {
    }
  };
  try {
    (_a2 = S.addEventListener) == null ? void 0 : _a2.call(S, "change", Ct);
  } catch {
  }
  const rt = new it(new Ae(), new ft({ color: 16096779, transparent: true, opacity: 0.35, side: Et, depthWrite: false }));
  rt.frustumCulled = false, rt.visible = false, rt.renderOrder = 998, rt.name = "hk-fill-preview", g.add(rt), E.addEventListener("pointerleave", () => {
    Ie.style.display = "none", rt.visible && (rt.visible = false, C());
  });
  const on = (e) => {
    var _a3, _b, _c, _d;
    const o = n.points.rawVal, a = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = /* @__PURE__ */ new Map(), s = (p, d) => {
      p !== d && ((t.get(p) ?? t.set(p, /* @__PURE__ */ new Set()).get(p)).add(d), (t.get(d) ?? t.set(d, /* @__PURE__ */ new Set()).get(d)).add(p));
    };
    for (const p of a) for (let d = 0; d + 1 < p.length; d++) s(p[d], p[d + 1]);
    const i = (p, d) => {
      var _a4;
      return !!((_a4 = t.get(p)) == null ? void 0 : _a4.has(d));
    }, l = [], c = /* @__PURE__ */ new Set(), r = [...t.keys()];
    for (const p of r) for (const d of t.get(p)) if (!(d < p)) {
      for (const y of t.get(d)) if (y !== p) for (const M of t.get(y)) {
        if (M === p || M === d || !i(M, p) || i(p, y) || i(d, M)) continue;
        const $ = [p, d, y, M].slice().sort((x, b) => x - b).join("-");
        c.has($) || (c.add($), l.push([p, d, y, M]));
      }
    }
    for (const p of r) for (const d of t.get(p)) if (!(d < p)) for (const y of t.get(d)) {
      if (y === p || !i(y, p)) continue;
      const M = [p, d, y].slice().sort(($, x) => $ - x).join("-");
      c.has(M) || (c.add(M), l.push([p, d, y]));
    }
    const h = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", u = (p) => h === "xy" ? [p[0], p[1]] : h === "xz" ? [p[0], p[2]] : [p[1], p[2]], v = u(e), f = (p, d) => {
      let y = false;
      for (let M = 0, $ = d.length - 1; M < d.length; $ = M++) {
        const x = d[M][0], b = d[M][1], A = d[$][0], Z = d[$][1];
        b > p[1] != Z > p[1] && p[0] < (A - x) * (p[1] - b) / (Z - b) + x && (y = !y);
      }
      return y;
    }, w = (p) => {
      let d = 0;
      for (let y = 0, M = p.length - 1; y < p.length; M = y++) d += (p[M][0] + p[y][0]) * (p[M][1] - p[y][1]);
      return Math.abs(d) / 2;
    };
    let k = null, P = 1 / 0;
    for (const p of l) {
      const d = p.map((M) => u(o[M]));
      if (!f(v, d)) continue;
      const y = w(d);
      y < P && (P = y, k = p);
    }
    return k;
  }, Bt = new ct(), Kt = new it(new kn(1, 1), new ft({ color: 2282478, transparent: true, opacity: 0.08, side: Et, depthWrite: false })), It = new Jt(new Qs(new kn(1, 1)), new dt({ color: 2282478, transparent: true, opacity: 0.85 })), rn = new Jt(new Ae(), new dt({ color: 2282478, transparent: true, opacity: 0.3 })), ro = (e, o) => {
    const a = [], t = Math.ceil(e / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-e, i, 0, e, i, 0), a.push(i, -e, 0, i, e, 0);
    }
    rn.geometry.dispose(), rn.geometry = new Ae(), rn.geometry.setAttribute("position", new Vt(a, 3));
  };
  Bt.add(Kt, It, rn), Bt.visible = false, Bt.frustumCulled = false, g.add(Bt);
  const Xt = new ct();
  Xt.frustumCulled = false, Xt.visible = false, g.add(Xt);
  const gn = (e) => {
    const o = new Ae().setFromPoints([new V(0, 0, 0), new V(0, 0, 0)]), a = new no({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Ft(o, a);
  }, mn = gn(16711680), In = gn(65280), Ln = gn(35071);
  Xt.add(mn, In, Ln);
  const Gn = [], Bo = (e) => e.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Yt = gn(16761856);
  Yt.material.dashSize = 0.28, Yt.material.gapSize = 0.16, Yt.material.opacity = 0.9, Yt.frustumCulled = false, Yt.visible = false, Yt.renderOrder = 98, g.add(Yt);
  const Tn = (e) => {
    const o = new Ae().setFromPoints([new V(0, 0, 0), new V(0, 0, 0), new V(0, 0, 0), new V(0, 0, 0)]), a = new dt({ color: e, transparent: true, opacity: 0.2, depthTest: false }), t = new da(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, Rn = Tn(3462041), Pn = Tn(16724804), Dn = Tn(6333946), cn = new ct();
  cn.frustumCulled = false, cn.visible = false, g.add(cn), cn.add(Rn, Pn, Dn);
  const Bn = (e) => {
    const o = new kn(1, 1), a = new ft({ color: e, transparent: true, opacity: 0.06, side: Et, depthWrite: false }), t = new it(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, Ut = Bn(3462041), sn = Bn(16724804), an = Bn(6333946);
  cn.add(Ut, sn, an);
  const wn = (e, o, a, t) => {
    e.scale.set(2 * t, 2 * t, 1), a === "xy" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, 0, 0)) : a === "xz" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, dn = document.createElement("div");
  dn.id = "hk-refplane-badge", dn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(dn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = e, cn.visible = e, e) {
      const o = window.__hekatanOrthoAnchor, a = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = a[a.length - 1] ?? [], s = n.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], l = window.__hekatanOrthoExt ?? 8;
      yn(Rn, i, "xy", l), yn(Pn, i, "xz", l), yn(Dn, i, "yz", l), wn(Ut, i, "xy", l), wn(sn, i, "xz", l), wn(an, i, "yz", l), Ut.material.opacity = 0.05, sn.material.opacity = 0.05, an.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    C();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a3;
    if (window.__hekatanOrthoExt = e, !cn.visible) {
      C();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = a[a.length - 1] ?? [], s = n.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0];
    yn(Rn, i, "xy", e), yn(Pn, i, "xz", e), yn(Dn, i, "yz", e), wn(Ut, i, "xy", e), wn(sn, i, "xz", e), wn(an, i, "yz", e), C();
  };
  const gs = (e) => {
    if (Ut.material.opacity = e === "xy" ? 0.09 : 0.025, sn.material.opacity = e === "xz" ? 0.09 : 0.025, an.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      dn.style.background = s.bg, dn.style.color = s.text, dn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, dn.style.display = "block";
    } else dn.style.display = "none";
  }, yn = (e, o, a, t) => {
    let s;
    a === "xy" ? s = [new V(o[0] - t, o[1] - t, o[2]), new V(o[0] + t, o[1] - t, o[2]), new V(o[0] + t, o[1] + t, o[2]), new V(o[0] - t, o[1] + t, o[2]), new V(o[0] - t, o[1] - t, o[2])] : a === "xz" ? s = [new V(o[0] - t, o[1], o[2] - t), new V(o[0] + t, o[1], o[2] - t), new V(o[0] + t, o[1], o[2] + t), new V(o[0] - t, o[1], o[2] + t), new V(o[0] - t, o[1], o[2] - t)] : s = [new V(o[0], o[1] - t, o[2] - t), new V(o[0], o[1] + t, o[2] - t), new V(o[0], o[1] + t, o[2] + t), new V(o[0], o[1] - t, o[2] + t), new V(o[0], o[1] - t, o[2] - t)], e.geometry.setFromPoints(s);
  };
  let kt = null;
  window.__hekatanAxisLock = () => kt;
  let co = null, Lt = null;
  const Tt = document.createElement("div");
  Tt.id = "hk-axis-lock-badge", Tt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Tt);
  const vs = () => {
    if (!kt) {
      Tt.style.display = "none";
      return;
    }
    const e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Tt.style.background = "rgba(15,23,42,0.92)", Tt.style.color = e[kt], Tt.style.border = `1.5px solid ${e[kt]}`, Tt.textContent = `\u{1F512} LOCK ${kt.toUpperCase()}`, Tt.style.display = "block";
  };
  window.addEventListener("keydown", (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== Pe) return;
    const a = e.key.toLowerCase(), t = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && t === "polyarea" && Oe.length >= 3) {
      const s = go();
      ae(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") kt = kt === a ? null : a, vs(), e.preventDefault();
    else if (e.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Ns(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || ko(), ae(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (Xt.visible = false), ae(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a3;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const e = window.__hekatanOrthoMode;
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = e ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = e ? "block" : "none";
    }
  };
  const uo = new V(), po = new V(), Ms = new V(), va = (e) => {
    if (!kt) return null;
    const o = e[0], a = e[1], t = e[2];
    return kt === "x" ? (uo.set(o - 1e4, a, t), po.set(o + 1e4, a, t)) : kt === "y" ? (uo.set(o, a - 1e4, t), po.set(o, a + 1e4, t)) : (uo.set(o, a, t - 1e4), po.set(o, a, t + 1e4)), I.ray.distanceSqToSegment(uo, po, null, Ms), Ms;
  };
  window.__hekatanProjectOnAxis = va;
  const Zt = new Ft(new Ae().setFromPoints([new V(0, 0, 0), new V(0, 0, 0)]), new dt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Zt.renderOrder = 998, Zt.frustumCulled = false, Zt.visible = false, g.add(Zt);
  let ln = -1, vn = -1, Mn = -1;
  const Ue = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ue;
  const un = new Ft(new Ae().setFromPoints([new V(), new V()]), new dt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  un.renderOrder = 997, un.frustumCulled = false, un.visible = false, g.add(un);
  const Qt = new it(new Wn(0.02, 12, 12), new ft({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Qt.renderOrder = 998, Qt.visible = false, g.add(Qt);
  const fo = (e) => {
    const o = _();
    if (o.isOrthographicCamera) {
      const t = o, s = (t.top - t.bottom) / t.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(e);
    return Math.max(0.05, a / 10);
  }, bs = () => {
    Qt.visible && Qt.scale.setScalar(fo(Qt.position));
  }, pn = new ct();
  pn.frustumCulled = false, g.add(pn);
  const ho = 2282478;
  let fn = null;
  const Ma = (e, o, a, t) => {
    if (!n.points) return -1;
    const s = n.points.rawVal;
    let i = -1, l = t;
    for (let c = 0; c < s.length; c++) {
      const r = s[c];
      if (!r) continue;
      const h = Math.hypot(e - r[0], o - r[1], a - r[2]);
      h < l && (l = h, i = c);
    }
    return i;
  }, Ot = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; pn.children.length; ) {
      const l = pn.children.pop();
      (_b = (_a3 = l.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = l.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = n.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = n.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const l of Ue) {
      const [c, ...r] = l.split(":");
      if (c === "pt") {
        const h = e[+r[0]];
        if (!h) continue;
        const u = new it(new Wn(0.025, 12, 12), new ft({ color: ho, transparent: true, opacity: 0.9, depthTest: false }));
        u.position.set(h[0], h[1], h[2]), u.renderOrder = 999, u.__isSelectionPt = true, pn.add(u);
      } else if (c === "seg") {
        const h = o[+r[0]], u = e[h == null ? void 0 : h[+r[1]]], v = e[h == null ? void 0 : h[+r[1] + 1]];
        if (!u || !v) continue;
        const f = new Ae().setFromPoints([new V(u[0], u[1], u[2]), new V(v[0], v[1], v[2])]), w = new Ft(f, new dt({ color: ho, transparent: true, opacity: 0.95, depthTest: false }));
        w.renderOrder = 999, pn.add(w);
      } else if (c === "poly") {
        const u = o[+r[0]].map((w) => {
          const k = e[w];
          return k ? new V(k[0], k[1], k[2]) : null;
        }).filter(Boolean);
        if (u.length < 2) continue;
        const v = new Ae().setFromPoints(u), f = new Ft(v, new dt({ color: ho, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, pn.add(f);
      } else if (c === "aux") {
        const h = t[+r[0]];
        if (!h || h.length !== 6) continue;
        const u = new Ae().setFromPoints([new V(h[0], h[1], h[2]), new V(h[3], h[4], h[5])]), v = new Ft(u, new dt({ color: ho, transparent: true, opacity: 0.95, depthTest: false }));
        v.renderOrder = 999, pn.add(v);
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
    C();
  };
  window.__hekatanRefreshSelection = Ot, window.__hekatanSelectIds = (e) => {
    var _a3;
    Ue.clear();
    for (const o of e) Ue.add(o);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), Ue.size;
  }, window.__hekatanClearSelection = () => {
    Ue.clear(), Ot();
  };
  const Hn = (e, o, a, t, s, i, l, c, r) => {
    const h = l - t, u = c - s, v = r - i, f = h * h + u * u + v * v;
    if (f < 1e-12) return Math.hypot(e - t, o - s, a - i);
    let w = ((e - t) * h + (o - s) * u + (a - i) * v) / f;
    w = Math.max(0, Math.min(1, w));
    const k = t + w * h, P = s + w * u, p = i + w * v;
    return Math.hypot(e - k, o - P, a - p);
  }, No = (e, o, a, t) => {
    if (!n.polylines) return null;
    const s = n.polylines.rawVal, i = n.points.rawVal;
    let l = -1, c = -1, r = t;
    for (let h = 0; h < s.length; h++) {
      const u = s[h];
      for (let v = 0; v < u.length - 1; v++) {
        const f = i[u[v]], w = i[u[v + 1]];
        if (!f || !w) continue;
        const k = Hn(e, o, a, f[0], f[1], f[2], w[0], w[1], w[2]);
        k < r && (r = k, l = h, c = v);
      }
    }
    return l >= 0 ? { polyIdx: l, segIdx: c, dist: r } : null;
  }, _s = (e, o, a, t) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let l = -1, c = t;
    for (let r = 0; r < i.length; r++) {
      const h = i[r];
      if (!h || h.length !== 6) continue;
      const u = Hn(e, o, a, h[0], h[1], h[2], h[3], h[4], h[5]);
      u < c && (c = u, l = r);
    }
    return l;
  }, ba = (e) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[e];
    if (!t || t.length !== 6) {
      Zt.visible = false;
      return;
    }
    Zt.geometry.setFromPoints([new V(t[0], t[1], t[2]), new V(t[3], t[4], t[5])]), Zt.visible = true;
  }, _a = (e, o = -1) => {
    var _a3, _b;
    if (!n.polylines) return;
    const a = n.polylines.rawVal[e], t = n.points.rawVal;
    if (!a || a.length < 2) {
      Zt.visible = false;
      return;
    }
    const s = ((_b = (_a3 = n.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const l of a) {
      const c = t[l];
      c && i.push(new V(c[0], c[1], c[2]));
    }
    else {
      const l = t[a[o]], c = t[a[o + 1]];
      l && i.push(new V(l[0], l[1], l[2])), c && i.push(new V(c[0], c[1], c[2]));
    }
    Zt.geometry.setFromPoints(i), Zt.visible = true;
  }, mo = (e) => {
    var _a3;
    if (!n.polylines) return;
    const o = n.polylines.rawVal;
    if (e < 0 || e >= o.length) return;
    const a = o.filter((r, h) => h !== e), t = /* @__PURE__ */ new Set();
    for (const r of a) for (const h of r) t.add(h);
    const s = n.points.rawVal, i = /* @__PURE__ */ new Map(), l = [];
    for (let r = 0; r < s.length; r++) t.has(r) && (i.set(r, l.length), l.push(s[r]));
    const c = a.map((r) => r.map((h) => i.get(h)).filter((h) => h !== void 0));
    n.points.val = l, n.polylines.val = c, n.areas && (n.areas.val = n.areas.rawVal.filter((r) => r !== e).map((r) => r > e ? r - 1 : r)), Zt.visible = false, ln = -1, vn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, ks = (e, o) => {
    var _a3, _b, _c;
    if (!n.polylines) return;
    const a = n.polylines.rawVal;
    if (e < 0 || e >= a.length) return;
    if (((_b = (_a3 = n.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      mo(e);
      return;
    }
    const s = a[e];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      mo(e);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const l = [...a.slice(0, e), ...i, ...a.slice(e + 1)], c = /* @__PURE__ */ new Set();
    for (const f of l) for (const w of f) c.add(w);
    const r = n.points.rawVal, h = /* @__PURE__ */ new Map(), u = [];
    for (let f = 0; f < r.length; f++) c.has(f) && (h.set(f, u.length), u.push(r[f]));
    const v = l.map((f) => f.map((w) => h.get(w)).filter((w) => w !== void 0));
    if (n.points.val = u, n.polylines.val = v, n.areas) {
      const f = i.length - 1;
      n.areas.val = n.areas.rawVal.map((w) => w > e ? w + f : w);
    }
    Zt.visible = false, ln = -1, vn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Le.geometry.setAttribute("position", new Vt(n.points.rawVal.flat(), 3)), Le.geometry.computeBoundingSphere(), Le.frustumCulled = false, Ne.frustumCulled = false, g.add(Ne), ee.position.set(0, 0, 0), ee.rotateX(Math.PI / 2), ee.geometry.rotateX(Math.PI / 2), ee.updateMatrixWorld(), n.polylines && (n.polylines.val = [...n.polylines.rawVal, []]), window.__hekatanDrawAt = (e, o, a) => {
    if (n.points.val = [...n.points.rawVal, [e, o, a]], n.polylines) {
      const t = n.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
      n.polylines.val = [...t.slice(0, -1), [...s, n.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a3;
    if (!n.polylines) return;
    const e = n.polylines.rawVal;
    ((_a3 = e[e.length - 1]) == null ? void 0 : _a3.length) !== 0 && (n.polylines.val = [...e, []]);
  };
  const wo = [];
  window.__hekatanCirculos = wo;
  let Ss = [], Ps = "";
  const Cs = () => {
    var _a3;
    const e = n.points.rawVal, o = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = `${e.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === Ps) return Ss;
    Ps = a;
    const t = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const l = s.slice(0, i - 1).map((u) => e[u]).filter(Boolean);
      if (l.length < 5) continue;
      const c = [0, 1, 2].map((u) => l.reduce((v, f) => v + f[u], 0) / l.length), r = l.map((u) => Math.hypot(u[0] - c[0], u[1] - c[1], u[2] - c[2])), h = r.reduce((u, v) => u + v, 0) / r.length;
      h < 1e-9 || r.some((u) => Math.abs(u - h) > 5e-3 * h) || t.push({ c, r: h });
    }
    return Ss = t;
  };
  window.__hekatanCentrosDeducidos = Cs;
  const yo = () => !!window.__hekatanCurvasAux, xo = (e, o) => {
    const a = window.__hekatanDrawingAuxLines;
    if (!a) return 0;
    bt();
    const t = a.rawVal ?? a.val ?? [], s = [];
    for (let i = 0; i + 1 < e.length; i++) s.push([...e[i], ...e[i + 1]]);
    return o && e.length > 2 && s.push([...e[e.length - 1], ...e[0]]), a.val = [...t, ...s], s.length;
  };
  window.__hekatanDrawCircle = (e, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a3;
    const l = Math.max(4, Math.round(s)), c = n.points.rawVal.length, r = [];
    for (let h = 0; h < l; h++) {
      const u = 2 * Math.PI * h / l, v = t * Math.cos(u), f = t * Math.sin(u);
      let w;
      i === "xy" ? w = [e + v, o + f, a] : i === "xz" ? w = [e + v, o, a + f] : w = [e, o + v, a + f], r.push(w);
    }
    if (wo.push({ c: [e, o, a], r: t }), yo()) {
      xo(r, true);
      return;
    }
    if (n.points.val = [...n.points.rawVal, ...r], n.polylines) {
      const h = [...r.map((v, f) => c + f), c], u = n.polylines.rawVal;
      ((_a3 = u[u.length - 1]) == null ? void 0 : _a3.length) > 0 ? n.polylines.val = [...u, h, []] : n.polylines.val = [...u.slice(0, -1), h, []];
    }
  }, window.__hekatanDrawArc = (e, o, a, t = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const s = Math.max(4, Math.round(t)), i = new V(...e), l = new V(...o), c = new V(...a), r = new V().subVectors(l, i), h = new V().subVectors(c, i), u = new V().crossVectors(r, h), v = 2 * u.lengthSq();
    let f;
    if (v < 1e-12) f = new V().addVectors(i, c).multiplyScalar(0.5);
    else {
      const ye = h.clone().multiplyScalar(r.lengthSq()).sub(r.clone().multiplyScalar(h.lengthSq())), ke = new V().crossVectors(ye, u);
      f = i.clone().add(ke.divideScalar(v));
    }
    const w = i.distanceTo(f), k = u.lengthSq() > 1e-12 ? u.clone().normalize() : new V(0, 1, 0), P = new V().subVectors(i, f).normalize(), p = new V().crossVectors(k, P).normalize(), d = (ye) => {
      const ke = new V().subVectors(ye, f);
      return Math.atan2(ke.dot(p), ke.dot(P));
    }, y = (ye) => {
      let ke = ye;
      for (; ke < 0; ) ke += 2 * Math.PI;
      for (; ke >= 2 * Math.PI; ) ke -= 2 * Math.PI;
      return ke;
    }, M = y(d(l)), $ = y(d(c)), x = M <= $ ? $ : $ - 2 * Math.PI, b = n.points.rawVal.length, A = [], Z = (ye) => {
      const ke = P.clone().multiplyScalar(Math.cos(ye)).add(p.clone().multiplyScalar(Math.sin(ye)));
      return f.clone().add(ke.multiplyScalar(w));
    }, X = String(window.__hekatanArcModo ?? "angulo"), K = X === "x" ? 0 : X === "y" ? 1 : X === "z" ? 2 : -1;
    let de = false;
    if (K >= 0) {
      const ye = e[K], ke = a[K], ot = 512;
      let Ke = Math.abs(ke - ye) > 1e-9, tt = ye;
      for (let Ee = 1; Ee <= ot && Ke; Ee++) {
        const Ge = Z(x * Ee / ot).getComponent(K);
        (Ge - tt) * (ke - ye) < -1e-9 && (Ke = false), tt = Ge;
      }
      if (Ke) {
        de = true;
        for (let Ee = 0; Ee <= s; Ee++) {
          const Ge = ye + (ke - ye) * Ee / s;
          let De = 0, ze = x;
          for (let qe = 0; qe < 60; qe++) {
            const pt = (De + ze) / 2;
            (Z(pt).getComponent(K) - Ge) * (ke - ye) < 0 ? De = pt : ze = pt;
          }
          const Xe = Z((De + ze) / 2);
          A.push([Xe.x, Xe.y, Xe.z]);
        }
        A[0] = [e[0], e[1], e[2]], A[s] = [a[0], a[1], a[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${X.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!de) for (let ye = 0; ye <= s; ye++) {
      const ke = Z(x * (ye / s));
      A.push([ke.x, ke.y, ke.z]);
    }
    if (wo.push({ c: [f.x, f.y, f.z], r: w }), yo()) {
      xo(A, false);
      return;
    }
    if (n.points.val = [...n.points.rawVal, ...A], n.polylines) {
      const ye = A.map((ot, Ke) => b + Ke), ke = n.polylines.rawVal;
      n.polylines.val = [...ke.slice(0, -1), ye, []];
    }
  }, window.__hekatanDrawPolinomio = (e, o = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const a = e.length;
    if (a < 2) return { ok: false, msg: "faltan puntos" };
    const t = Math.max(a - 1, Math.round(o)), s = (x) => Math.max(...e.map((b) => b[x])) - Math.min(...e.map((b) => b[x])), i = [s(0), s(1), s(2)], l = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), c = l === "xy" ? 2 : l === "xz" ? 1 : l === "yz" ? 0 : -1, r = c >= 0 && i[c] < 1e-6 ? c : i[2] <= i[0] && i[2] <= i[1] ? 2 : i[1] <= i[0] ? 1 : 0, h = r === 2 ? "xy" : r === 1 ? "xz" : "yz", u = [0, 1, 2].filter((x) => x !== r), [v, f] = i[u[0]] >= i[u[1]] ? u : [u[1], u[0]], w = e.map((x) => x[v]), k = e.map((x) => x[f]);
    for (let x = 0; x < a; x++) for (let b = x + 1; b < a; b++) if (Math.abs(w[x] - w[b]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[v]} en ${h.toUpperCase()}): no hay polinomio que pase por los dos` };
    const P = (x) => {
      let b = 0;
      for (let A = 0; A < a; A++) {
        let Z = 1;
        for (let X = 0; X < a; X++) X !== A && (Z *= (x - w[X]) / (w[A] - w[X]));
        b += k[A] * Z;
      }
      return b;
    }, p = (() => {
      const x = a, b = w.map((X) => Array.from({ length: x }, (K, de) => X ** de)), A = k.slice();
      for (let X = 0; X < x; X++) {
        let K = X;
        for (let de = X + 1; de < x; de++) Math.abs(b[de][X]) > Math.abs(b[K][X]) && (K = de);
        [b[X], b[K]] = [b[K], b[X]], [A[X], A[K]] = [A[K], A[X]];
        for (let de = X + 1; de < x; de++) {
          const ye = b[de][X] / b[X][X];
          for (let ke = X; ke < x; ke++) b[de][ke] -= ye * b[X][ke];
          A[de] -= ye * A[X];
        }
      }
      const Z = new Array(x).fill(0);
      for (let X = x - 1; X >= 0; X--) {
        let K = A[X];
        for (let de = X + 1; de < x; de++) K -= b[X][de] * Z[de];
        Z[X] = K / b[X][X];
      }
      return Z;
    })(), d = w[0], y = w[a - 1], M = n.points.rawVal.length, $ = [];
    for (let x = 0; x <= t; x++) {
      const b = d + (y - d) * x / t, A = [e[0][0], e[0][1], e[0][2]];
      A[v] = b, A[f] = P(b), A[r] = e[0][r], $.push(A);
    }
    if ($[0] = [e[0][0], e[0][1], e[0][2]], $[t] = [e[a - 1][0], e[a - 1][1], e[a - 1][2]], yo()) return xo($, false), { ok: true, plano: h, coef: p, ia: v, io: f };
    if (n.points.val = [...n.points.rawVal, ...$], n.polylines) {
      const x = $.map((A, Z) => M + Z), b = n.polylines.rawVal;
      n.polylines.val = ((_d = b[b.length - 1]) == null ? void 0 : _d.length) > 0 ? [...b, x, []] : [...b.slice(0, -1), x, []];
    }
    return { ok: true, plano: h, coef: p, ia: v, io: f };
  };
  const zs = () => {
    var _a3, _b;
    const e = n.points.rawVal, o = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = new Set(((_b = n.areas) == null ? void 0 : _b.rawVal) ?? []), t = window.__hekatanDrawingAuxLines, s = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? [], i = [], l = [], c = /* @__PURE__ */ new Set(), r = (h) => [e[h][0], e[h][1], e[h][2]];
    return [...Ue].forEach((h) => {
      const u = h.split(":");
      if (u[0] === "aux") {
        const f = s[+u[1]];
        f && f.length === 6 && (i.push([[f[0], f[1], f[2]], [f[3], f[4], f[5]]]), l.push(h));
        return;
      }
      const v = u[0] === "poly" || u[0] === "seg" ? +u[1] : -1;
      if (!(v < 0 || !o[v] || a.has(v))) if (u[0] === "poly") {
        if (c.has(v)) return;
        c.add(v);
        for (let f = 0; f + 1 < o[v].length; f++) i.push([r(o[v][f]), r(o[v][f + 1])]);
      } else {
        const f = o[v][+u[2]], w = o[v][+u[2] + 1];
        f != null && w != null && !c.has(v) && i.push([r(f), r(w)]);
      }
    }), { segs: i, auxIds: l };
  }, Jn = (e, o) => Math.abs(e[0] - o[0]) < 1e-6 && Math.abs(e[1] - o[1]) < 1e-6 && Math.abs(e[2] - o[2]) < 1e-6, ka = (e) => {
    const o = new Array(e.length).fill(false), a = [];
    for (let t = 0; t < e.length; t++) {
      if (o[t]) continue;
      o[t] = true;
      const s = [e[t][0], e[t][1]];
      let i = true;
      for (; i; ) {
        i = false;
        for (let c = 0; c < e.length; c++) {
          if (o[c]) continue;
          const [r, h] = e[c], u = s[s.length - 1], v = s[0];
          Jn(r, u) ? (s.push(h), o[c] = true, i = true) : Jn(h, u) ? (s.push(r), o[c] = true, i = true) : Jn(h, v) ? (s.unshift(r), o[c] = true, i = true) : Jn(r, v) && (s.unshift(h), o[c] = true, i = true);
        }
      }
      const l = s.length > 3 && Jn(s[0], s[s.length - 1]);
      l && s.pop(), a.push({ pts: s, cerrada: l });
    }
    return a;
  }, Xo = (e, o) => {
    let a = e.findIndex((t) => Math.abs(t[0] - o[0]) < 1e-3 && Math.abs(t[1] - o[1]) < 1e-3 && Math.abs(t[2] - o[2]) < 1e-3);
    return a < 0 && (a = e.length, e.push(o)), a;
  }, As = (e) => {
    if (!e.length) return 0;
    Ue.clear(), e.forEach((a) => Ue.add(a));
    const o = e.length;
    return Wo(), Ue.clear(), o;
  };
  window.__hekatanRevolveSelection = (e, o, a, t = 360) => {
    var _a3, _b, _c;
    const s = Math.max(3, Math.round(a || 16)), i = Math.abs(t - 360) < 1e-9, l = s, c = i ? s : s + 1, { segs: r, auxIds: h } = zs();
    if (!r.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (i && s % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    bt();
    const u = n.points.rawVal, v = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], f = [...u];
    let w = v.slice();
    w.length && w[w.length - 1].length === 0 && (w = w.slice(0, -1));
    const k = [...((_b = n.areas) == null ? void 0 : _b.rawVal) ?? []], P = /* @__PURE__ */ new Map(), p = (A) => A.map((Z) => Math.round(Z * 1e4)).join(","), d = (A) => Math.hypot(A[0] - e, A[1] - o) < 1e-6, y = (A) => {
      const Z = p(A);
      let X = P.get(Z);
      if (X) return X;
      if (d(A)) return X = [Xo(f, A)], P.set(Z, X), X;
      const K = Math.hypot(A[0] - e, A[1] - o), de = Math.atan2(A[1] - o, A[0] - e);
      X = [];
      for (let ye = 0; ye < c; ye++) {
        const ke = de + t * Math.PI / 180 * ye / s;
        X.push(Xo(f, ye === 0 ? A : [e + K * Math.cos(ke), o + K * Math.sin(ke), A[2]]));
      }
      return P.set(Z, X), X;
    };
    let M = 0, $ = false;
    const x = (A) => {
      k.push(w.length), w.push([...A, A[0]]), M++;
    };
    for (const [A, Z] of r) {
      const X = y(A), K = y(Z);
      if (!(X.length === 1 && K.length === 1)) {
        if (X.length === 1 || K.length === 1) {
          $ = true;
          const de = X.length === 1 ? X[0] : K[0], ye = X.length === 1 ? K : X;
          for (let ke = 0; ke + 2 <= l; ke += 2) x([de, ye[ke % c], ye[(ke + 1) % c], ye[(ke + 2) % c]]);
          continue;
        }
        for (let de = 0; de < l; de++) x([X[de], K[de], K[(de + 1) % c], X[(de + 1) % c]]);
      }
    }
    w.push([]), n.points.val = f, n.polylines && (n.polylines.val = w), n.areas && (n.areas.val = k);
    const b = As(h);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { anillos: P.size, areas: M, polo: $, guias: b };
  }, window.__hekatanLoftSelection = (e, o) => {
    var _a3, _b, _c;
    const { segs: a, auxIds: t } = zs(), s = ka(a), i = (K) => K.pts.every((de) => Math.abs(de[2] - K.pts[0][2]) < 1e-6), l = s.find((K) => K.cerrada && i(K)), c = s.find((K) => !K.cerrada && K.pts.length >= 2 && !i(K));
    if (!l) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!c) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const r = l.pts, h = r.length, u = c.pts.slice();
    u[u.length - 1][2] < u[0][2] && u.reverse();
    let v = 0;
    for (let K = 0; K < h; K++) {
      const de = r[K], ye = r[(K + 1) % h];
      v += de[0] * ye[1] - ye[0] * de[1];
    }
    const f = v > 0 ? 1 : -1, w = (K) => {
      const de = r[(K - 1 + h) % h], ye = r[K], ke = r[(K + 1) % h], ot = [ye[0] - de[0], ye[1] - de[1]], Ke = [ke[0] - ye[0], ke[1] - ye[1]], tt = Math.hypot(ot[0], ot[1]) || 1, Ee = Math.hypot(Ke[0], Ke[1]) || 1, Ge = [f * ot[1] / tt, -f * ot[0] / tt], De = [f * Ke[1] / Ee, -f * Ke[0] / Ee], ze = 1 + (Ge[0] * De[0] + Ge[1] * De[1]);
      return [(Ge[0] + De[0]) / Math.max(ze, 1e-6), (Ge[1] + De[1]) / Math.max(ze, 1e-6)];
    }, k = r.map((K, de) => w(de)), P = u[0];
    let p = [0, 0], d = 0;
    for (const K of u) {
      const de = K[0] - P[0], ye = K[1] - P[1], ke = Math.hypot(de, ye);
      ke > d && (d = ke, p = [de / ke, ye / ke]);
    }
    if (d < 1e-9) {
      const K = P[0] - e, de = P[1] - o, ye = Math.hypot(K, de) || 1;
      p = [K / ye, de / ye];
    }
    p[0] * (P[0] - e) + p[1] * (P[1] - o) < 0 && (p = [-p[0], -p[1]]), bt();
    const y = n.points.rawVal, M = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], $ = [...y];
    let x = M.slice();
    x.length && x[x.length - 1].length === 0 && (x = x.slice(0, -1));
    const b = [...((_b = n.areas) == null ? void 0 : _b.rawVal) ?? []], A = u.map((K) => {
      const de = (K[0] - P[0]) * p[0] + (K[1] - P[1]) * p[1], ye = K[2];
      return r.map((ke, ot) => Xo($, [ke[0] + k[ot][0] * de, ke[1] + k[ot][1] * de, ye]));
    });
    let Z = 0;
    for (let K = 0; K + 1 < A.length; K++) for (let de = 0; de < h; de++) {
      const ye = [A[K][de], A[K][(de + 1) % h], A[K + 1][(de + 1) % h], A[K + 1][de]];
      new Set(ye).size < 4 || (b.push(x.length), x.push([...ye, ye[0]]), Z++);
    }
    x.push([]), n.points.val = $, n.polylines && (n.polylines.val = x), n.areas && (n.areas.val = b);
    const X = As(t);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { contorno: h, perfil: u.length, areas: Z, guias: X };
  }, window.__hekatanDrawSlabChaflan = (e, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(e[0], o[0]), l = Math.max(e[0], o[0]), c = Math.min(e[1], o[1]), r = Math.max(e[1], o[1]), h = (e[2] + o[2]) / 2, u = l - i, v = r - c, f = Math.min(a, u / 2 - 0.01, v / 2 - 0.01);
    if (f <= 0) return;
    const w = n.points.rawVal.length, k = [], P = [], p = (d, y) => {
      k.push([d, y, h]), P.push(w + k.length - 1);
    };
    for (let d = 0; d <= s; d++) p(i + f + (u - 2 * f) * d / s, c);
    for (let d = 1; d <= t; d++) {
      const y = -Math.PI / 2 + Math.PI / 2 * d / t;
      p(l - f + f * Math.cos(y), c + f + f * Math.sin(y));
    }
    for (let d = 1; d <= s; d++) p(l, c + f + (v - 2 * f) * d / s);
    for (let d = 1; d <= t; d++) {
      const y = 0 + Math.PI / 2 * d / t;
      p(l - f + f * Math.cos(y), r - f + f * Math.sin(y));
    }
    for (let d = 1; d <= s; d++) p(l - f - (u - 2 * f) * d / s, r);
    for (let d = 1; d <= t; d++) {
      const y = Math.PI / 2 + Math.PI / 2 * d / t;
      p(i + f + f * Math.cos(y), r - f + f * Math.sin(y));
    }
    for (let d = 1; d <= s; d++) p(i, r - f - (v - 2 * f) * d / s);
    for (let d = 1; d < t; d++) {
      const y = Math.PI + Math.PI / 2 * d / t;
      p(i + f + f * Math.cos(y), c + f + f * Math.sin(y));
    }
    if (P.push(w), yo()) {
      xo(k, true);
      return;
    }
    if (n.points.val = [...n.points.rawVal, ...k], n.polylines) {
      const d = n.polylines.rawVal;
      n.polylines.val = [...d.slice(0, -1), P, []];
    }
  }, window.__hekatanDrawRect = (e, o) => {
    const a = n.points.rawVal.length, t = e[0], s = e[1], i = e[2], l = o[0], c = o[1], r = o[2];
    let h;
    if (Math.abs(i - r) < 1e-6 ? h = [[t, s, i], [l, s, i], [l, c, i], [t, c, i]] : Math.abs(s - c) < 1e-6 ? h = [[t, s, i], [l, s, i], [l, s, r], [t, s, r]] : h = [[t, s, i], [t, c, i], [t, c, r], [t, s, r]], n.points.val = [...n.points.rawVal, ...h], n.polylines) {
      const u = [a, a + 1, a + 2, a + 3, a], v = n.polylines.rawVal;
      n.polylines.val = [...v.slice(0, -1), u, []];
    }
  }, window.__hekatanDrawRectArea = (e, o) => {
    var _a3;
    const a = n.points.rawVal.length, t = e[0], s = e[1], i = e[2], l = o[0], c = o[1], r = o[2];
    let h;
    if (N && n.gridTarget) {
      const u = n.gridTarget.rawVal, v = new oo(...u.rotation), f = new V(1, 0, 0).applyEuler(v), w = new V(0, 1, 0).applyEuler(v), k = new V(...u.position), P = new V(t, s, i), p = new V(l, c, r), d = P.clone().sub(k).dot(f), y = P.clone().sub(k).dot(w), M = p.clone().sub(k).dot(f), $ = p.clone().sub(k).dot(w), x = (b, A) => k.clone().addScaledVector(f, b).addScaledVector(w, A).toArray();
      h = [x(d, y), x(M, y), x(M, $), x(d, $)];
    } else Math.abs(i - r) < 1e-6 ? h = [[t, s, i], [l, s, i], [l, c, i], [t, c, i]] : Math.abs(s - c) < 1e-6 ? h = [[t, s, i], [l, s, i], [l, s, r], [t, s, r]] : h = [[t, s, i], [t, c, i], [t, c, r], [t, s, r]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), n.points.val = [...n.points.rawVal, ...h], n.polylines) {
      const u = n.polylines.rawVal, v = u.length - 1, f = [a, a + 1, a + 2, a + 3, a];
      n.polylines.val = [...u.slice(0, -1), f, []], n.areas && (n.areas.val = [...n.areas.rawVal, v]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = n.points.rawVal, a = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), s = (p) => p.map((d) => Math.round(d * 1e4) / 1e4).join(",");
    for (let p = 0; p < o.length; p++) {
      const d = s(o[p]), y = a.get(d);
      y === void 0 && a.set(d, p), t.set(p, y ?? p);
    }
    const i = e.map((p) => p.map((d) => t.get(d) ?? d)), l = /* @__PURE__ */ new Map(), c = (p, d) => {
      p !== d && ((l.get(p) ?? l.set(p, /* @__PURE__ */ new Set()).get(p)).add(d), (l.get(d) ?? l.set(d, /* @__PURE__ */ new Set()).get(d)).add(p));
    };
    for (const p of i) for (let d = 0; d + 1 < p.length; d++) c(p[d], p[d + 1]);
    const r = (p, d) => {
      var _a4;
      return !!((_a4 = l.get(p)) == null ? void 0 : _a4.has(d));
    }, h = /* @__PURE__ */ new Set(), u = [], v = [...l.keys()];
    for (const p of v) for (const d of l.get(p)) if (!(d < p)) {
      for (const y of l.get(d)) if (y !== p) for (const M of l.get(y)) {
        if (M === p || M === d || !r(M, p) || r(p, y) || r(d, M)) continue;
        const $ = [p, d, y, M].slice().sort((x, b) => x - b).join("-");
        h.has($) || (h.add($), u.push([p, d, y, M]));
      }
    }
    for (const p of v) for (const d of l.get(p)) if (!(d < p)) for (const y of l.get(d)) {
      if (y === p || !r(y, p)) continue;
      const M = [p, d, y].slice().sort(($, x) => $ - x).join("-");
      h.has(M) || (h.add(M), u.push([p, d, y]));
    }
    if (!u.length) return 0;
    const f = [...((_b = n.areas) == null ? void 0 : _b.rawVal) ?? []], w = new Set(f.map((p) => [...new Set(i[p] ?? [])].sort((d, y) => d - y).join("-"))), k = [...i];
    let P = 0;
    for (const p of u) {
      const d = p.slice().sort((y, M) => y - M).join("-");
      w.has(d) || (w.add(d), k.push([...p, p[0]]), f.push(k.length - 1), P++);
    }
    if (P) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), n.polylines.val = k, n.areas && (n.areas.val = f);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      C();
    }
    return P;
  }, window.__hekatanMeshPolyArea = (e, o) => {
    var _a3;
    const a = e.length;
    if (a < 3) return 0;
    let t = 0, s = 0, i = 0;
    for (let ze = 0; ze < a; ze++) {
      const Xe = e[ze], qe = e[(ze + 1) % a];
      t += (Xe[1] - qe[1]) * (Xe[2] + qe[2]), s += (Xe[2] - qe[2]) * (Xe[0] + qe[0]), i += (Xe[0] - qe[0]) * (Xe[1] + qe[1]);
    }
    const l = Math.hypot(t, s, i) || 1;
    t /= l, s /= l, i /= l;
    let c = e[1][0] - e[0][0], r = e[1][1] - e[0][1], h = e[1][2] - e[0][2];
    const u = Math.hypot(c, r, h) || 1;
    c /= u, r /= u, h /= u;
    let v = s * h - i * r, f = i * c - t * h, w = t * r - s * c;
    const k = Math.hypot(v, f, w) || 1;
    v /= k, f /= k, w /= k;
    const P = e[0], p = (ze) => [(ze[0] - P[0]) * c + (ze[1] - P[1]) * r + (ze[2] - P[2]) * h, (ze[0] - P[0]) * v + (ze[1] - P[1]) * f + (ze[2] - P[2]) * w], d = (ze, Xe) => [P[0] + ze * c + Xe * v, P[1] + ze * r + Xe * f, P[2] + ze * h + Xe * w], y = e.map(p);
    let M = 1 / 0, $ = -1 / 0, x = 1 / 0, b = -1 / 0;
    for (const [ze, Xe] of y) ze < M && (M = ze), ze > $ && ($ = ze), Xe < x && (x = Xe), Xe > b && (b = Xe);
    const A = $ - M, Z = b - x;
    if (A < 1e-6 || Z < 1e-6) return 0;
    let X = o && o > 0 ? o : 0.5;
    for (; A / X * (Z / X) > 2500; ) X *= 2;
    X = Math.min(X, Math.min(A, Z));
    const K = (ze, Xe) => {
      let qe = false;
      for (let pt = 0, gt = y.length - 1; pt < y.length; gt = pt++) {
        const [At, tn] = y[pt], [Kn, En] = y[gt];
        tn > Xe != En > Xe && ze < (Kn - At) * (Xe - tn) / (En - tn) + At && (qe = !qe);
      }
      return qe;
    }, de = Math.max(1, Math.round(A / X)), ye = Math.max(1, Math.round(Z / X)), ke = A / de, ot = Z / ye, Ke = /* @__PURE__ */ new Map(), tt = [], Ee = n.points.rawVal.length, Ge = (ze, Xe) => {
      const qe = ze + "," + Xe, pt = Ke.get(qe);
      if (pt !== void 0) return pt;
      const gt = Ee + tt.length;
      return tt.push(d(M + ze * ke, x + Xe * ot)), Ke.set(qe, gt), gt;
    }, De = [];
    for (let ze = 0; ze < de; ze++) for (let Xe = 0; Xe < ye; Xe++) {
      if (!K(M + (ze + 0.5) * ke, x + (Xe + 0.5) * ot)) continue;
      const qe = Ge(ze, Xe), pt = Ge(ze + 1, Xe), gt = Ge(ze + 1, Xe + 1), At = Ge(ze, Xe + 1);
      De.push([qe, pt, gt, At]);
    }
    if (!De.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), n.points.val = [...n.points.rawVal, ...tt], n.polylines && n.areas) {
      let ze = n.polylines.rawVal.slice();
      ze.length && ze[ze.length - 1].length === 0 && (ze = ze.slice(0, -1));
      const Xe = [];
      for (const qe of De) Xe.push(ze.length), ze.push([qe[0], qe[1], qe[2], qe[3], qe[0]]);
      ze.push([]), n.polylines.val = ze, n.areas.val = [...n.areas.rawVal, ...Xe];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), De.length;
  };
  const go = () => {
    if (Oe.length < 3) return Oe = [], $e.visible = false, C(), 0;
    const e = window.__hekatanMeshPolyArea(Oe.slice());
    return Oe = [], $e.visible = false, C(), e;
  };
  window.__hekatanFinalizePolyArea = go, window.__hekatanSetInclinedPlaneFrom3 = (e, o, a) => {
    var _a3;
    const t = new V(e[0], e[1], e[2]), s = new V(o[0], o[1], o[2]), i = new V(a[0], a[1], a[2]), l = new V().subVectors(s, t).cross(new V().subVectors(i, t));
    if (l.lengthSq() < 1e-9) return false;
    l.normalize();
    const c = new ls().setFromUnitVectors(new V(0, 0, 1), l), r = new oo().setFromQuaternion(c);
    n.gridTarget && (n.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [r.x, r.y, r.z] }), N = true;
    const h = new V().addVectors(t, s).add(i).multiplyScalar(1 / 3), u = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, v = u / 2;
    Kt.geometry.dispose(), Kt.geometry = new kn(u, u), It.geometry.dispose(), It.geometry = new Qs(new kn(u, u)), ro(v, 1), Bt.position.copy(h), Bt.quaternion.copy(c), Bt.scale.set(1, 1, 1), Bt.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), true;
  }, window.__hekatanResetPlaneXY = () => {
    n.gridTarget && (n.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), N = false, Bt.visible = false, C();
  };
  const jt = new ct();
  jt.visible = false, g.add(jt), window.__hekatanShowAxes = (e, o, a = 12, t = 2) => {
    var _a3, _b;
    for (; jt.children.length; ) {
      const u = jt.children.pop();
      (_a3 = u.geometry) == null ? void 0 : _a3.dispose(), (_b = u.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, l = Math.min(...e) - t, c = Math.max(...e) + t, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", h = (u, v, f, w, k) => {
      const P = document.createElement("canvas");
      P.width = 64, P.height = 32;
      const p = P.getContext("2d");
      p.fillStyle = k, p.font = "bold 22px sans-serif", p.textAlign = "center", p.fillText(u, 32, 26);
      const d = new Os(P), y = new js({ map: d, transparent: true }), M = new ea(y);
      return M.position.set(v, f, w), M.scale.set(1.2, 0.6, 1), M;
    };
    e.forEach((u, v) => {
      const f = v < r.length ? r[v] : `X${v}`, w = new Ae().setFromPoints([new V(u, s, 0), new V(u, i, 0), new V(u, s, 0), new V(u, s, a)]), k = new no({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), P = new Jt(w, k);
      P.computeLineDistances(), jt.add(P), jt.add(h(f, u, s - 0.5, 0, "#60a5fa")), jt.add(h(f, u, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((u, v) => {
      const f = `${v + 1}`, w = new Ae().setFromPoints([new V(l, u, 0), new V(c, u, 0), new V(l, u, 0), new V(l, u, a)]), k = new no({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), P = new Jt(w, k);
      P.computeLineDistances(), jt.add(P), jt.add(h(f, l - 0.5, u, 0, "#fb7185")), jt.add(h(f, c + 0.5, u, 0, "#fb7185"));
    }), jt.visible = true, C();
  }, window.__hekatanHideAxes = () => {
    jt.visible = false, C();
  };
  const xn = new ct();
  xn.visible = false, g.add(xn);
  let Nn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], o = 20, a = 0, t = 0) => {
    var _a3, _b;
    for (; xn.children.length; ) {
      const i = xn.children.pop();
      (_a3 = i.geometry) == null ? void 0 : _a3.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    Nn.forEach((i) => {
      g.remove(i), i.geometry.dispose(), i.material.dispose();
    }), Nn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((i, l) => {
      const c = s[l % s.length], r = o / 2, h = [new V(a - r, t - r, i), new V(a + r, t - r, i), new V(a + r, t + r, i), new V(a - r, t + r, i), new V(a - r, t - r, i)], u = new Ae().setFromPoints(h), v = new dt({ color: c, transparent: true, opacity: 0.55 });
      xn.add(new Ft(u, v));
      const f = document.createElement("canvas");
      f.width = 128, f.height = 32;
      const w = f.getContext("2d");
      w.fillStyle = `#${c.toString(16).padStart(6, "0")}`, w.font = "bold 18px sans-serif", w.fillText(`Z = ${i} m`, 4, 22);
      const k = new Os(f), P = new js({ map: k, transparent: true }), p = new ea(P);
      p.position.set(a - r - 1.5, t - r - 1.5, i), p.scale.set(2.5, 0.6, 1), xn.add(p);
      const d = new kn(1e4, 1e4), y = new ft({ visible: false, side: Et }), M = new it(d, y);
      M.position.set(0, 0, i), M.frustumCulled = false, M.userData = { refPlaneZ: i }, g.add(M), Nn.push(M);
    }), xn.visible = true, C();
  }, window.__hekatanHideRefPlanes = () => {
    xn.visible = false, Nn.forEach((e) => {
      e.visible = false;
    }), C();
  };
  const Qn = new ct();
  Qn.frustumCulled = false, g.add(Qn);
  const Sa = () => {
    var _a3, _b, _c, _d;
    for (; Qn.children.length; ) {
      const a = Qn.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const t = new Ae().setFromPoints([new V(a[0], a[1], a[2]), new V(a[3], a[4], a[5])]), s = new no({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Ft(t, s);
      i.computeLineDistances(), Qn.add(i);
    }
  };
  le.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Sa(), C());
  });
  const Xn = new ct();
  Xn.frustumCulled = false, g.add(Xn);
  const Fs = () => {
    var _a3, _b, _c, _d;
    for (; Xn.children.length; ) {
      const a = Xn.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const t = new it(new Wn(0.025, 12, 12), new ft({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      t.position.set(a[0], a[1], a[2]), t.renderOrder = 996, t.scale.setScalar(fo(t.position)), Xn.add(t);
    }
  };
  le.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Fs(), C());
  }), S.addEventListener("change", () => {
    Xn.children.forEach((e) => {
      e.scale.setScalar(fo(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Fs;
  const wt = new ct(), Pa = new it(new Wn(0.01, 12, 12), new ft({ color: 16724804, transparent: true, opacity: 0.95 })), Ca = new it(new Wn(0.015, 12, 12), new ft({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  wt.add(Pa, Ca);
  const Yn = 0.08, Yo = (e, o, a) => {
    const t = new Ae().setFromPoints([new V(...e), new V(...o)]);
    return new Ft(t, new dt({ color: a, transparent: true, opacity: 0.7 }));
  };
  wt.add(Yo([-Yn, 0, 0], [Yn, 0, 0], 16711680)), wt.add(Yo([0, -Yn, 0], [0, Yn, 0], 65280)), wt.add(Yo([0, 0, -Yn], [0, 0, Yn], 35071)), wt.visible = false, wt.frustumCulled = false, g.add(wt);
  let Uo = 2;
  const vo = (e) => {
    const o = _(), a = (E == null ? void 0 : E.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(e) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, On = () => {
    if (!wt.visible) return;
    const e = Uo * vo(wt.position) / 0.015;
    wt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let bn = 10;
  const Zo = (e) => Math.max(1e-4, bn * vo(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (bn = e), bn), window.__hekatanUpdateSnapScale = On, window.__hekatanSnapMarker = wt, window.__hekatanMetrosPorPixel = vo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (Uo = e, On(), C()), Uo);
  const Es = () => {
    pn.children.length !== 0 && pn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const o = e;
      o.scale.setScalar(fo(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Es, S.addEventListener("change", () => {
    var _a3;
    On(), Qt.visible && bs(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), Es();
  }), window.__hekatanShowSnap = (e, o, a) => {
    wt.position.set(e, o, a), wt.visible = true, On(), C();
  }, window.__hekatanHideSnap = () => {
    wt.visible = false, C();
  }, E.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const o = R(e);
    if (!o) return;
    I.setFromCamera(D, o), Y = null;
    const a = ge();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && rt.visible && (rt.visible = false), a.length) {
      const t = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const w = on([t.x, t.y, t.z]);
        if (w) {
          const k = w.map((d) => n.points.rawVal[d]), P = [];
          for (let d = 1; d < k.length - 1; d++) P.push(k[0][0], k[0][1], k[0][2], k[d][0], k[d][1], k[d][2], k[d + 1][0], k[d + 1][1], k[d + 1][2]);
          const p = rt.geometry;
          p.setAttribute("position", new Vt(P, 3)), p.computeVertexNormals(), rt.visible = true;
        } else rt.visible = false;
      } else rt.visible && (rt.visible = false);
      const s = e.altKey;
      let i = false;
      const l = Zo(t), c = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, t.x, t.y, t.z, l, { x: e.clientX, y: e.clientY });
      if (c) _o(c.type, c.x, c.y, c.z), wt.position.set(c.x, c.y, c.z), wt.visible = true, t.set(c.x, c.y, c.z), So(c.type, e.clientX, e.clientY);
      else if (!s && (Se = Ce(e.clientX, e.clientY))) i = true, t.copy(Se), _o("ifcSec", t.x, t.y, t.z), So("ifcSec", e.clientX, e.clientY), wt.position.copy(t), wt.visible = true;
      else if (re && !s) i = true, _o(re.tipo, t.x, t.y, t.z), So(re.tipo, e.clientX, e.clientY), wt.position.copy(t), wt.visible = true;
      else {
        Ea(), ko();
        const f = !s && window.__hekatanSnapEnabled !== false, w = window.__hekatanSnap2D ?? 0.5;
        f && w > 0 && (t.x = Math.round(t.x / w) * w, t.y = Math.round(t.y / w) * w, t.z = Math.round(t.z / w) * w), wt.position.copy(t), wt.visible = true;
      }
      On(), G(Y && !c && (i || re) ? H(Y) : null), Lt = { p: t.clone(), x: e.clientX, y: e.clientY };
      const r = ((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.tool) ?? "select";
      if (r === "select" || !r) {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, w = Ma(t.x, t.y, t.z, f), k = No(t.x, t.y, t.z, f), P = _s(t.x, t.y, t.z, f);
        if (w >= 0) {
          const M = n.points.rawVal[w];
          Qt.position.set(M[0], M[1], M[2]), Qt.visible = true, bs(), un.visible = false, fn = { kind: "pt", a: w };
        } else if (k) {
          const M = n.points.rawVal, $ = n.polylines.rawVal[k.polyIdx], x = M[$[k.segIdx]], b = M[$[k.segIdx + 1]];
          un.geometry.setFromPoints([new V(x[0], x[1], x[2]), new V(b[0], b[1], b[2])]), un.visible = true, Qt.visible = false, fn = ((_l = (_k = n.areas) == null ? void 0 : _k.rawVal) == null ? void 0 : _l.includes(k.polyIdx)) ?? false ? { kind: "poly", a: k.polyIdx } : { kind: "seg", a: k.polyIdx, b: k.segIdx };
        } else if (P >= 0) {
          const $ = (((_m = window.__hekatanDrawingAuxLines) == null ? void 0 : _m.rawVal) ?? [])[P];
          $ && (un.geometry.setFromPoints([new V($[0], $[1], $[2]), new V($[3], $[4], $[5])]), un.visible = true, Qt.visible = false, fn = { kind: "aux", a: P });
        } else un.visible = false, Qt.visible = false, fn = null;
        Ie.style.left = e.clientX + "px", Ie.style.top = e.clientY + "px", Ie.style.display = "block";
        let p = t;
        if ((fn == null ? void 0 : fn.kind) === "pt") {
          const M = n.points.rawVal[fn.a];
          M && (p = new V(M[0], M[1], M[2]));
        }
        const d = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [p.x, p.y, p.z], fn) {
          const M = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Ie.textContent = `${d}  \xB7  \u{1F5B1} Click \u2192 ${M[fn.kind]}`;
        } else Ie.textContent = d;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = d), Lt = { p: p.clone(), x: e.clientX, y: e.clientY }, Ye.visible = false, Xt.visible = false, Yt.visible = false, C();
        return;
      }
      if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, w = No(t.x, t.y, t.z, f), k = _s(t.x, t.y, t.z, f);
        let P = false;
        if (k >= 0) if (!w) P = true;
        else {
          const M = window.__hekatanDrawingAuxLines, x = ((M == null ? void 0 : M.rawVal) ?? (M == null ? void 0 : M.val) ?? M ?? [])[k];
          Hn(t.x, t.y, t.z, x[0], x[1], x[2], x[3], x[4], x[5]) < w.dist && (P = true);
        }
        P ? (Mn = k, ln = -1, vn = -1, ba(k)) : w ? (ln = w.polyIdx, vn = w.segIdx, Mn = -1, _a(w.polyIdx, w.segIdx)) : (ln = -1, vn = -1, Mn = -1, Zt.visible = false), Ye.visible = false, Xt.visible = false, Yt.visible = false, mt(), Ie.style.left = e.clientX + "px", Ie.style.top = e.clientY + "px", Ie.style.display = "block";
        const p = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let d = "";
        P ? d = `\u{1F5D1} l\xEDnea aux #${Mn + 1}` : w ? d = ((_o2 = (_n2 = n.areas) == null ? void 0 : _n2.rawVal) == null ? void 0 : _o2.includes(w.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${w.polyIdx + 1}` : `\u{1F5D1} seg ${w.segIdx + 1} / poly #${w.polyIdx + 1}` : d = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Ie.textContent = `${p}  \xB7  ${d}`;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = p), C();
        return;
      } else Zt.visible = false, ln = -1, Mn = -1;
      Ie.style.left = e.clientX + "px", Ie.style.top = e.clientY + "px", Ie.style.display = "block";
      const h = ((_p = n.polylines) == null ? void 0 : _p.rawVal) ?? [], u = h[h.length - 1] ?? [], v = n.points.rawVal ?? [];
      if (u.length > 0 && v[u[u.length - 1]]) {
        const f = u[u.length - 1], w = v[f];
        let k = kt;
        co = null;
        const P = !!c || i;
        if (!k && !P && window.__hekatanAxisSnap !== false) {
          const Ke = E.getBoundingClientRect(), tt = e.clientX, Ee = e.clientY, Ge = ((_q = settings.gridSize) == null ? void 0 : _q.rawVal) ?? 10, De = new V(w[0], w[1], w[2]), ze = [["x", new V(1, 0, 0)], ["y", new V(0, 1, 0)], ["z", new V(0, 0, 1)]], Xe = (pt) => {
            const gt = pt.clone().project(o);
            return { x: (gt.x * 0.5 + 0.5) * Ke.width + Ke.left, y: (-gt.y * 0.5 + 0.5) * Ke.height + Ke.top };
          };
          let qe = null;
          for (const [pt, gt] of ze) {
            const At = Xe(De.clone().addScaledVector(gt, -Ge)), tn = Xe(De.clone().addScaledVector(gt, Ge)), Kn = tn.x - At.x, En = tn.y - At.y, Xa = tt - At.x, Ya = Ee - At.y, Ua = Kn * Kn + En * En || 1;
            let zo = (Xa * Kn + Ya * En) / Ua;
            zo = Math.max(0, Math.min(1, zo));
            const qs = Math.hypot(tt - (At.x + zo * Kn), Ee - (At.y + zo * En));
            if (qe === null || qs < qe.dpx) {
              const ns = I.ray, Ks = De.clone().sub(ns.origin), os = gt.dot(ns.direction), Ws = gt.dot(Ks), Za = ns.direction.dot(Ks), Gs = 1 - os * os, qa = Math.abs(Gs) < 1e-6 ? -Ws : (os * Za - Ws) / Gs;
              qe = { axis: pt, dpx: qs, pt: De.clone().addScaledVector(gt, qa) };
            }
          }
          qe && qe.dpx <= 12 && (t.copy(qe.pt), k = qe.axis, co = qe.pt.clone());
        }
        const p = !!window.__hekatanOrthoMode;
        if (!k && !P && p) {
          const Ke = Math.abs(t.x - w[0]), tt = Math.abs(t.y - w[1]), Ee = Math.abs(t.z - w[2]), Ge = (_r = a[0]) == null ? void 0 : _r.object;
          let De = null;
          Ge === Ut ? De = "xy" : Ge === sn ? De = "xz" : Ge === an && (De = "yz"), De === "xy" ? k = Ke >= tt ? "x" : "y" : De === "xz" ? k = Ke >= Ee ? "x" : "z" : De === "yz" ? k = tt >= Ee ? "y" : "z" : k = Ke >= tt && Ke >= Ee ? "x" : tt >= Ee ? "y" : "z";
        }
        const d = window.__hekatanPolarTrack !== false;
        if (!k && !P && d) {
          const Ke = t.x - w[0], tt = t.y - w[1], Ee = t.z - w[2], Ge = Math.hypot(Ke, tt, Ee);
          if (Ge > 1e-3) {
            const ze = Math.tan(6 * Math.PI / 180) * Ge, Xe = Math.hypot(tt, Ee), qe = Math.hypot(Ke, Ee), pt = Math.hypot(Ke, tt), gt = [["x", Xe], ["y", qe], ["z", pt]];
            gt.sort((At, tn) => At[1] - tn[1]), gt[0][1] <= ze && (k = gt[0][0]);
          }
        }
        if (k) {
          const Ke = w[0], tt = w[1], Ee = w[2];
          k === "x" ? t.set(t.x, tt, Ee) : k === "y" ? t.set(Ke, t.y, Ee) : t.set(Ke, tt, t.z);
          const Ge = !!kt, ze = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[k];
          Tt.style.background = "rgba(15,23,42,0.92)", Tt.style.color = ze, Tt.style.border = `1.5px solid ${ze}`;
          const Xe = (_s2 = a[0]) == null ? void 0 : _s2.object;
          let qe = null;
          Xe === Ut ? qe = "xy" : Xe === sn ? qe = "xz" : Xe === an && (qe = "yz");
          const pt = qe ? ` (plano ${qe.toUpperCase()})` : "";
          Tt.textContent = Ge ? `\u{1F512} LOCK ${k.toUpperCase()}${pt}` : `\u22A5 ORTO ${k.toUpperCase()}${pt}`, Tt.style.left = e.clientX + 20 + "px", Tt.style.top = e.clientY + 18 + "px", Tt.style.transform = "none", Tt.style.display = "block";
        } else kt || (Tt.style.display = "none");
        let y = null;
        if (!s && !P && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ke = n.points.rawVal, tt = k ? [k] : ["z", "x", "y"], Ee = { x: e.clientX, y: e.clientY };
          let Ge = 1 / 0;
          for (const De of Ke) if (!(Math.abs(De[0] - w[0]) < 1e-9 && Math.abs(De[1] - w[1]) < 1e-9 && Math.abs(De[2] - w[2]) < 1e-9)) for (const ze of tt) {
            const Xe = new V(ze === "x" ? De[0] : t.x, ze === "y" ? De[1] : t.y, ze === "z" ? De[2] : t.z), qe = An(Xe.x, Xe.y, Xe.z);
            if (!qe) continue;
            const pt = Math.hypot(qe.x - Ee.x, qe.y - Ee.y);
            pt < bn && pt < Ge && (Ge = pt, y = { q: De, eje: ze });
          }
        }
        y ? (y.eje === "x" ? t.x = y.q[0] : y.eje === "y" ? t.y = y.q[1] : t.z = y.q[2], Yt.geometry.setFromPoints([new V(y.q[0], y.q[1], y.q[2]), new V(t.x, t.y, t.z)]), (_t2 = Yt.computeLineDistances) == null ? void 0 : _t2.call(Yt), Yt.visible = true, wt.position.set(t.x, t.y, t.z), wt.visible = true, So("track", e.clientX, e.clientY)) : Yt.visible = false, Lt = { p: t.clone(), x: e.clientX, y: e.clientY };
        const M = Math.hypot(t.x - w[0], t.y - w[1], t.z - w[2]), $ = Math.atan2(t.y - w[1], t.x - w[0]) * 180 / Math.PI, x = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`, b = ($ % 360 + 360) % 360;
        Ie.textContent = `L = ${M.toFixed(3)} m   \u2220 ${b.toFixed(1)}\xB0   \xB7   ${x}`;
        const A = document.getElementById("hk-coord-fixed");
        A && (A.textContent = x), Ye.geometry.setFromPoints([new V(w[0], w[1], w[2]), new V(t.x, t.y, t.z)]), (_u = Ye.computeLineDistances) == null ? void 0 : _u.call(Ye), Ye.visible = true, Be(w[0], w[1], w[2], t.x, t.y, t.z);
        const Z = window.__hekatanOrthoExt ?? 8, X = window.__hekatanShowOrthoPlanes !== false;
        cn.visible = X, X || gs(null), X && (yn(Rn, w, "xy", Z), yn(Pn, w, "xz", Z), yn(Dn, w, "yz", Z), wn(Ut, w, "xy", Z), wn(sn, w, "xz", Z), wn(an, w, "yz", Z));
        const K = X ? I.intersectObjects([Ut, sn, an], false) : [];
        let de = null;
        if (K.length > 0) {
          const Ke = K[0].object;
          Ke === Ut ? de = "xy" : Ke === sn ? de = "xz" : Ke === an && (de = "yz");
        }
        gs(de), de && (dn.style.left = e.clientX + "px", dn.style.top = e.clientY + "px"), mn.geometry.setFromPoints([new V(w[0] - Z, w[1], w[2]), new V(w[0] + Z, w[1], w[2])]), (_v = mn.computeLineDistances) == null ? void 0 : _v.call(mn), In.geometry.setFromPoints([new V(w[0], w[1] - Z, w[2]), new V(w[0], w[1] + Z, w[2])]), (_w = In.computeLineDistances) == null ? void 0 : _w.call(In), Ln.geometry.setFromPoints([new V(w[0], w[1], w[2] - Z), new V(w[0], w[1], w[2] + Z)]), (_x = Ln.computeLineDistances) == null ? void 0 : _x.call(Ln), Xt.visible = true;
        const ye = mn.material, ke = In.material, ot = Ln.material;
        k === "x" ? (ye.opacity = 0.95, ke.opacity = 0.1, ot.opacity = 0.1) : k === "y" ? (ye.opacity = 0.1, ke.opacity = 0.95, ot.opacity = 0.1) : k === "z" ? (ye.opacity = 0.1, ke.opacity = 0.1, ot.opacity = 0.95) : (ye.opacity = 0.5, ke.opacity = 0.5, ot.opacity = 0.5);
      } else {
        const f = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        Ie.textContent = f;
        const w = document.getElementById("hk-coord-fixed");
        if (w && (w.textContent = f), Ye.visible = false, Xt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if (Te = null, lt = null, Pe.style.left = e.clientX + 20 + "px", Pe.style.top = e.clientY - 28 + "px", Pe.style.display = "block", !Je) {
            Pe.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const P = document.activeElement;
            !(P && (P.tagName === "INPUT" || P.tagName === "TEXTAREA") && P !== Pe) && document.activeElement !== Pe && Pe.focus({ preventScroll: true });
            try {
              Pe.select();
            } catch {
            }
          }
        } else mt();
      }
      C();
    } else ko(), Ie.style.display = "none", wt.visible = false, Ye.visible = false, Xt.visible = false, mt(), C();
  }), le.derive(() => {
    var _a3;
    if (!n.gridTarget) return;
    const e = new ls().setFromEuler(new oo(...n.gridTarget.val.rotation)), o = new ls().setFromAxisAngle(new V(1, 0, 0), Math.PI / 2);
    Vi(m, { position: new V(...n.gridTarget.val.position), quaternion: e.clone().multiply(o) }, C);
    {
      const t = n.gridTarget.val.position[2], s = Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of Gn) g.remove(i), Bo(i);
      if (Gn.length = 0, s) {
        const i = ((_a3 = n.points) == null ? void 0 : _a3.rawVal) ?? [], l = /* @__PURE__ */ new Set([0]);
        for (const r of i) l.add(+r[2].toFixed(3));
        for (const r of window.__hekatanLevels ?? []) isFinite(r == null ? void 0 : r.z) && l.add(+r.z.toFixed(3));
        const c = [...l].sort((r, h) => r - h).slice(0, 24);
        for (const r of c) {
          if (Math.abs(r - t) < 1e-6) continue;
          const h = m.clone(true);
          h.name = `hekatan-grid-nivel-${r}`, h.traverse((u) => {
            u.material && (u.material = u.material.clone(), u.material.transparent = true, u.material.opacity = (u.material.opacity ?? 1) * (Math.abs(r) < 1e-6 ? 0.5 : 0.22));
          }), h.position.set(0, 0, r), h.quaternion.copy(o), g.add(h), Gn.push(h);
        }
      }
    }
    ee.position.set(...n.gridTarget.val.position), ee.quaternion.setFromEuler(new oo(...n.gridTarget.val.rotation)), ee.updateMatrixWorld();
    const a = new V(0, 0, 1).applyEuler(new oo(...n.gridTarget.val.rotation));
    N = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  }), le.derive(() => {
    Le.geometry.setAttribute("position", new Vt(n.points.val.flat(), 3)), Le.geometry.computeBoundingSphere();
  }), le.derive(() => {
    const e = 0.05 * z * 0.5 * F.val;
    I.params.Points.threshold = 0.4 * e;
  }), le.derive(() => {
    var _a3;
    const e = n.points.val ?? [], a = (((_a3 = n.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], t = [];
    for (const i of a) {
      const [l, c, r] = e[i];
      t.push(l, c, r);
    }
    const s = new Ae();
    s.setAttribute("position", new Vt(t, 3)), je.geometry.dispose(), je.geometry = s;
  });
  let qo = false, Cn = 0;
  E.addEventListener("pointerdown", () => {
    qo = true;
  }), E.addEventListener("pointerup", () => {
    qo = false;
  }), E.addEventListener("pointermove", () => {
    qo && Cn++;
  });
  const Nt = document.createElement("div");
  Nt.id = "hk-window-select", Nt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Nt);
  let en = null, jn = false, Wt = null;
  const Ko = (e, o, a, t, s) => {
    s ? (Nt.style.borderColor = "#34d399", Nt.style.borderStyle = "dashed", Nt.style.background = "rgba(52, 211, 153, 0.10)") : (Nt.style.borderColor = "#22d3ee", Nt.style.borderStyle = "solid", Nt.style.background = "rgba(34, 211, 238, 0.10)"), Nt.style.left = Math.min(e, a) + "px", Nt.style.top = Math.min(o, t) + "px", Nt.style.width = Math.abs(a - e) + "px", Nt.style.height = Math.abs(t - o) + "px", Nt.style.display = "block";
  }, Vs = (e, o, a, t, s) => {
    var _a3, _b, _c, _d;
    const i = Math.min(e, a), l = Math.max(e, a), c = Math.min(o, t), r = Math.max(o, t), h = a < e, u = E.getBoundingClientRect(), v = _();
    v.updateMatrixWorld();
    const f = (b) => {
      const A = new V(b[0], b[1], b[2]);
      return A.project(v), { x: u.left + (A.x * 0.5 + 0.5) * u.width, y: u.top + (-A.y * 0.5 + 0.5) * u.height };
    }, w = (b) => b.x >= i && b.x <= l && b.y >= c && b.y <= r, k = (b, A) => !(b.x < i && A.x < i || b.x > l && A.x > l || b.y < c && A.y < c || b.y > r && A.y > r);
    s || Ue.clear();
    let P = 0;
    const p = ((_a3 = n.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let b = 0; b < p.length; b++) {
      const A = p[b];
      A && w(f(A)) && (Ue.add(`pt:${b}`), P++);
    }
    const d = (b, A) => h ? w(b) || w(A) || k(b, A) : w(b) && w(A), y = ((_b = n.polylines) == null ? void 0 : _b.rawVal) ?? [], M = ((_c = n.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let b = 0; b < y.length; b++) {
      const A = y[b];
      if (M.includes(b)) {
        let X;
        if (!h) X = A.every((K) => {
          const de = p[K];
          return !!de && w(f(de));
        });
        else {
          X = false;
          for (let K = 0; K < A.length - 1; K++) {
            const de = p[A[K]], ye = p[A[K + 1]];
            if (!(!de || !ye) && d(f(de), f(ye))) {
              X = true;
              break;
            }
          }
        }
        X && (Ue.add(`poly:${b}`), P++);
      } else for (let X = 0; X < A.length - 1; X++) {
        const K = p[A[X]], de = p[A[X + 1]];
        !K || !de || d(f(K), f(de)) && (Ue.add(`seg:${b}:${X}`), P++);
      }
    }
    const x = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let b = 0; b < x.length; b++) {
      const A = x[b];
      if (!A || A.length !== 6) continue;
      const Z = f([A[0], A[1], A[2]]), X = f([A[3], A[4], A[5]]);
      d(Z, X) && (Ue.add(`aux:${b}`), P++);
    }
    Ot(), ae(P === 0 && !h ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${h ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${P} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ue.size})`), Nt.style.display = "none";
  }, Mo = () => {
    Wt && (Wt = null, Nt.style.display = "none", ae("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Mo, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Wt && Mo();
  });
  const Wo = () => {
    var _a3, _b, _c, _d;
    if (Ue.size === 0) return false;
    const e = [...Ue], o = ((_a3 = n.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = n.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = n.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], l = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set();
    for (const k of e) {
      const [P, ...p] = k.split(":");
      if (P === "pt") l.add(+p[0]);
      else if (P === "poly") c.add(+p[0]);
      else if (P === "seg") {
        const d = +p[0], y = +p[1];
        r.has(d) || r.set(d, /* @__PURE__ */ new Set()), r.get(d).add(y);
      } else P === "aux" && h.add(+p[0]);
    }
    let u = 0, v = [], f = [];
    const w = /* @__PURE__ */ new Map();
    for (let k = 0; k < a.length; k++) {
      if (c.has(k)) {
        u++;
        continue;
      }
      w.set(k, v.length);
      const P = r.get(k);
      if (P && P.size > 0) {
        let p = [];
        for (let d = 0; d < a[k].length; d++) p.push(a[k][d]), d < a[k].length - 1 && P.has(d) && (p.length >= 2 && v.push(p), p = [], u++);
        (p.length >= 2 || p.length === 1) && v.push(p);
      } else v.push([...a[k]]);
    }
    if (l.size > 0) {
      const k = [], P = /* @__PURE__ */ new Map();
      for (let d = 0; d < o.length; d++) {
        if (l.has(d)) {
          u++;
          continue;
        }
        P.set(d, k.length), k.push([...o[d]]);
      }
      const p = [];
      for (const d of v) {
        let y = [];
        for (const M of d) {
          const $ = P.get(M);
          $ === void 0 ? (y.length >= 2 && p.push(y), y = []) : y.push($);
        }
        y.length >= 2 && p.push(y);
      }
      v = p, n.points.val = k;
    }
    for (const k of t) {
      const P = w.get(k);
      P !== void 0 && P < v.length && f.push(P);
    }
    if (n.polylines && (n.polylines.val = v), n.areas && (n.areas.val = f), h.size > 0 && s) {
      const k = i.filter((P, p) => !h.has(p));
      "val" in s ? s.val = k : window.__hekatanDrawingAuxLines = k, u += h.size;
    }
    Ue.clear(), Ot();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ae(`\u{1F5D1} ${u} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Wo, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || Ue.size !== 0 && (e.preventDefault(), Wo());
  });
  const qt = document.createElement("div");
  qt.id = "hk-properties-pane";
  const $s = "hk-props-pane-pos";
  let eo = null;
  try {
    const e = localStorage.getItem($s);
    e && (eo = JSON.parse(e));
  } catch {
  }
  qt.style.cssText = ["position:fixed", eo ? `left:${eo.left}px` : "left:14px", eo ? `top:${eo.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(qt);
  const za = () => {
    const e = qt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let o = false, a = 0, t = 0, s = 0, i = 0;
    e.addEventListener("mousedown", (l) => {
      o = true, a = l.clientX, t = l.clientY;
      const c = qt.getBoundingClientRect();
      s = c.left, i = c.top, qt.style.transform = "none", qt.style.left = `${s}px`, qt.style.top = `${i}px`, l.preventDefault();
    }), window.addEventListener("mousemove", (l) => {
      if (!o) return;
      const c = l.clientX - a, r = l.clientY - t, h = Math.max(0, Math.min(window.innerWidth - 80, s + c)), u = Math.max(0, Math.min(window.innerHeight - 40, i + r));
      qt.style.left = `${h}px`, qt.style.top = `${u}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem($s, JSON.stringify({ left: parseFloat(qt.style.left), top: parseFloat(qt.style.top) }));
        } catch {
        }
      }
    });
  }, ue = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, yt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ut = null;
  const zt = (e, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: o, prop: a, value: t } }));
  }, Aa = () => {
    if (ut && (ut.dispose(), ut = null), Ue.size === 0) {
      qt.style.display = "none";
      return;
    }
    const e = [...Ue], o = e.filter((v) => v.startsWith("pt:")), a = e.filter((v) => v.startsWith("seg:")), t = e.filter((v) => v.startsWith("poly:")), s = e.filter((v) => v.startsWith("aux:")), i = o.length > 0, l = a.length > 0, c = t.length > 0, r = !i && !l && !c, h = [];
    o.length && h.push(`\u{1F535} ${o.length} nodo(s)`), a.length && h.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && h.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && h.push(`\u250A ${s.length} aux`);
    const u = `\u{1F3AF} ${Ue.size} item(s) \u2014 ${h.join(", ")}`;
    ut = new pa({ container: qt, title: u });
    {
      const v = ut.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      v.addBinding(yt, "dx", { label: "\u0394x (m)", step: 0.1 }), v.addBinding(yt, "dy", { label: "\u0394y (m)", step: 0.1 }), v.addBinding(yt, "dz", { label: "\u0394z (m)", step: 0.1 }), v.addBinding(yt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), v.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a3;
        const P = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, yt.dx, yt.dy, yt.dz, yt.copias);
        ae(P ? `\u29C9 Replicado \xD7${P} (\u0394 ${yt.dx},${yt.dy},${yt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), v.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a3;
        const P = (_a3 = window.__hekatanExtrudeSelection) == null ? void 0 : _a3.call(window, yt.dx, yt.dy, yt.dz, yt.copias);
        ae(P && (P.lineas || P.areas) ? `\u21D7 Extruido: ${P.lineas} barra(s), ${P.areas} pa\xF1o(s) (\u0394 ${yt.dx},${yt.dy},${yt.dz} m \xD7 ${yt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const f = { vuelo: 1.5, losa: true, borde: true, ambos: true }, w = v.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      w.addBinding(f, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), w.addBinding(f, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), w.addBinding(f, "borde", { label: "con viga de borde" }), w.addBinding(f, "ambos", { label: "a los dos lados" }), w.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a3;
        const P = (_a3 = window.__hekatanVoladoSelection) == null ? void 0 : _a3.call(window, f.vuelo, { losa: f.losa, vigaBorde: f.borde, lados: f.ambos ? "ambos" : "afuera" });
        ae(P ? `\u2310 Volado de ${f.vuelo} m en ${P} pa\xF1o(s)` + (f.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), v.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a3;
        const P = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, yt.dx, yt.dy, yt.dz, 1);
        ae(P ? `\u2192 Copia desplazada \u0394 ${yt.dx},${yt.dy},${yt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const k = v.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      k.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a3;
        return (_a3 = window.__hekatanToggleSnap) == null ? void 0 : _a3.call(window);
      }), k.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ae(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const v = ut.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      v.addBinding(ue, "Ux"), v.addBinding(ue, "Uy"), v.addBinding(ue, "Uz"), v.addBinding(ue, "Rx"), v.addBinding(ue, "Ry"), v.addBinding(ue, "Rz");
      const f = (d, y) => {
        [ue.Ux, ue.Uy, ue.Uz, ue.Rx, ue.Ry, ue.Rz] = d;
        try {
          ut.refresh();
        } catch {
        }
        zt("nodes", o, "supports", d), ae(`\u2713 ${y}: ${o.length} nudo(s) apoyado(s) (${d.map((M, $) => M ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][$] : "").filter(Boolean).join(" ")}).`);
      };
      v.addButton({ title: `\u25B2 Empotrar los ${o.length} nudo(s) (6 GDL)` }).on("click", () => f([true, true, true, true, true, true], "Empotrado")), v.addButton({ title: `\u25B3 Articular los ${o.length} nudo(s) (Ux Uy Uz)` }).on("click", () => f([true, true, true, false, false, false], "Articulado"));
      const w = ut.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      w.addBinding(ue, "Kx", { label: "Kx", min: 0, step: 100 }), w.addBinding(ue, "Ky", { label: "Ky", min: 0, step: 100 }), w.addBinding(ue, "Kz", { label: "Kz", min: 0, step: 100 }), w.addBinding(ue, "Krx", { label: "Krx", min: 0, step: 1e3 }), w.addBinding(ue, "Kry", { label: "Kry", min: 0, step: 1e3 }), w.addBinding(ue, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const k = ut.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      k.addBinding(ue, "Fx", { step: 0.1 }), k.addBinding(ue, "Fy", { step: 0.1 }), k.addBinding(ue, "Fz", { step: 0.1 }), k.addBinding(ue, "Mx", { step: 0.1 }), k.addBinding(ue, "My", { step: 0.1 }), k.addBinding(ue, "Mz", { step: 0.1 }), ut.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ue, "mass", { label: "m", min: 0, step: 1 }), ut.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ue, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ut.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let d = 0;
        const y = [ue.Ux, ue.Uy, ue.Uz, ue.Rx, ue.Ry, ue.Rz];
        y.some((x) => x) && (zt("nodes", o, "supports", y), d++);
        const M = [ue.Fx, ue.Fy, ue.Fz, ue.Mx, ue.My, ue.Mz];
        M.some((x) => x !== 0) && (zt("nodes", o, "loads", M), d++);
        const $ = [ue.Kx, ue.Ky, ue.Kz, ue.Krx, ue.Kry, ue.Krz];
        if ($.some((x) => x !== 0) && (zt("nodes", o, "springs", $), d++), ue.mass !== 0 && (zt("nodes", o, "mass", ue.mass), d++), ue.diaphragm !== "Ninguno" && (zt("nodes", o, "diaphragm", ue.diaphragm), d++), d === 0) {
          ae("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let x = document.getElementById("hk-prop-toast");
          x || (x = document.createElement("div"), x.id = "hk-prop-toast", x.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(x)), x.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", x.style.background = "rgba(217,119,6,0.97)", x.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            x && (x.style.opacity = "0");
          }, 3200);
        } else ae(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (l) {
      const v = ut.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      v.addBinding(ue, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), v.addBinding(ue, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const f = ut.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      f.addBinding(ue, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), f.addBinding(ue, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), f.addBinding(ue, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), f.addBinding(ue, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ut.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ue, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ut.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ue, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const P = ut.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      P.addBinding(ue, "relMxI", { label: "Mx I" }), P.addBinding(ue, "relMyI", { label: "My I" }), P.addBinding(ue, "relMzI", { label: "Mz I" });
      const p = ut.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      p.addBinding(ue, "relMxJ", { label: "Mx J" }), p.addBinding(ue, "relMyJ", { label: "My J" }), p.addBinding(ue, "relMzJ", { label: "Mz J" }), ut.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ue, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const y = ut.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      y.addBinding(ue, "LKx", { label: "LKx", min: 0, step: 100 }), y.addBinding(ue, "LKy", { label: "LKy", min: 0, step: 100 }), y.addBinding(ue, "LKz", { label: "LKz", min: 0, step: 100 });
      const M = ut.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      M.addBinding(ue, "qx", { step: 0.1 }), M.addBinding(ue, "qy", { step: 0.1 }), M.addBinding(ue, "qz", { step: 0.1 }), ut.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ue, "massPerM", { label: "m/L", min: 0, step: 1 }), ut.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        zt("segs", a, "section", ue.section), zt("segs", a, "material", ue.material_frame);
        const x = { A: ue.A_mod, Iz: ue.Iz_mod, Iy: ue.Iy_mod, J: ue.J_mod };
        (x.A !== 1 || x.Iz !== 1 || x.Iy !== 1 || x.J !== 1) && zt("segs", a, "modifiers", x), ue.insertionPoint !== "10 \u2014 Centroid" && zt("segs", a, "insertionPoint", ue.insertionPoint), ue.beta !== 0 && zt("segs", a, "beta", ue.beta);
        const b = [ue.relMxI, ue.relMyI, ue.relMzI], A = [ue.relMxJ, ue.relMyJ, ue.relMzJ];
        (b.some((K) => K) || A.some((K) => K)) && zt("segs", a, "releases", { i: b, j: A }), ue.hinges !== "None" && zt("segs", a, "hinges", ue.hinges);
        const Z = [ue.LKx, ue.LKy, ue.LKz];
        Z.some((K) => K !== 0) && zt("segs", a, "lineSprings", Z);
        const X = [ue.qx, ue.qy, ue.qz];
        X.some((K) => K !== 0) && zt("segs", a, "distLoad", X), ue.massPerM !== 0 && zt("segs", a, "massPerM", ue.massPerM), ae(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (c) {
      const v = ut.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      v.addBinding(ue, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), v.addBinding(ue, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), v.addBinding(ue, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ut.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ue, "surfLoad", { label: "q", step: 0.1 }), ut.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        zt("areas", t, "shellType", ue.shellType), zt("areas", t, "thickness", ue.thickness), zt("areas", t, "material", ue.material_shell), ue.surfLoad !== 0 && zt("areas", t, "surfLoad", ue.surfLoad), ae(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (r) {
      const v = ut.addFolder({ title: "\u2139 Selecci\xF3n" }), f = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      v.addBinding(f, "msg", { readonly: true, label: "" });
    }
    ut.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ue.clear(), Ot();
    }), qt.style.display = "block", za();
  };
  window.__hekatanRefreshPropsPane = Aa;
  let Un = null, bo = false;
  E.addEventListener("pointerdown", (e) => {
    e.button === 2 && (Un = { x: e.clientX, y: e.clientY }, bo = false);
  }), E.addEventListener("pointermove", (e) => {
    if (Un && e.buttons & 2 && !bo) {
      const o = e.clientX - Un.x, a = e.clientY - Un.y;
      Math.hypot(o, a) > 8 && (bo = true);
    }
  }), E.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const o = Un !== null && !bo;
      Un = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (Wt ? Mo() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ue.size > 0 && (Ue.clear(), Ot()), n.polylines) {
          const i = n.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (n.polylines.val = [...i, []]);
        }
        const t = window.__hekatanCadState, s = (_b = (_a3 = t == null ? void 0 : t.get) == null ? void 0 : _a3.call(t)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = t == null ? void 0 : t.setTool) == null ? void 0 : _c.call(t, "select"), ae(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ae("\u238B Cancelado (click derecho)");
      }
    }
  }), E.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), E.addEventListener("pointerdown", (e) => {
    var _a3, _b, _c;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (en = null, jn = false));
  }), E.addEventListener("pointermove", (e) => {
    if (Wt && e.buttons === 0) {
      const i = e.clientX < Wt.x;
      Ko(Wt.x, Wt.y, e.clientX, e.clientY, i);
      return;
    }
    if (!en) return;
    const o = e.clientX - en.x, a = e.clientY - en.y, t = Math.hypot(o, a);
    if (!jn && t < 8) return;
    jn = true;
    const s = e.clientX < en.x;
    Ko(en.x, en.y, e.clientX, e.clientY, s);
  }), E.addEventListener("pointerup", (e) => {
    if (!en) return;
    if (!jn) {
      en = null;
      return;
    }
    const o = e.ctrlKey || e.metaKey || e.shiftKey;
    Vs(en.x, en.y, e.clientX, e.clientY, o), en = null, jn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Ht = new ct();
  Ht.visible = false, Ht.frustumCulled = false, g.add(Ht);
  const Is = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, _o = (e, o, a, t) => {
    var _a3, _b, _c, _d;
    for (; Ht.children.length; ) {
      const l = Ht.children.pop();
      (_b = (_a3 = l.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = l.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Is[e] ?? 16777215, i = new Ae().setFromPoints([new V(-1, -1, 0), new V(1, -1, 0), new V(1, -1, 0), new V(1, 1, 0), new V(1, 1, 0), new V(-1, 1, 0), new V(-1, 1, 0), new V(-1, -1, 0)]);
    Ht.add(new Jt(i, new dt({ color: s, linewidth: 2 }))), Ht.position.set(o, a, t), Ht.visible = true, Ho();
  };
  let Go = 4;
  const Ho = () => {
    Ht.visible && Ht.scale.setScalar(Go * vo(Ht.position));
  };
  window.__hekatanOsnapMarkerRef = Ht, window.__hekatanUpdateOsnapScale = Ho, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (Go = e, Ho(), C()), Go);
  const ko = () => {
    Ht.visible = false;
  }, Fa = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, hn = document.createElement("div");
  hn.id = "hk-osnap-etiqueta", hn.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(hn);
  const So = (e, o, a) => {
    const t = Fa[e];
    if (!t) {
      hn.style.display = "none";
      return;
    }
    hn.textContent = t, hn.style.color = "#" + (Is[e] ?? 16777215).toString(16).padStart(6, "0"), hn.style.left = o + 18 + "px", hn.style.top = a - 26 + "px", hn.style.display = "block";
  }, Ea = () => {
    hn.style.display = "none";
  }, zn = new V(), An = (e, o, a) => {
    const t = _();
    if (!t) return null;
    const s = E.getBoundingClientRect();
    return zn.set(e, o, a).project(t), !isFinite(zn.x) || !isFinite(zn.y) || zn.z < -1 || zn.z > 1 ? null : { x: s.left + (zn.x * 0.5 + 0.5) * s.width, y: s.top + (-zn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = An;
  const Va = (e, o, a, t, s) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, l = n.points.rawVal, c = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let r = null;
    const h = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, u = s, v = (d, y, M, $) => {
      let x;
      if (u) {
        const A = An(y, M, $);
        if (!A || (x = Math.hypot(A.x - u.x, A.y - u.y), x > bn)) return;
      } else if (x = Math.hypot(y - e, M - o, $ - a), x > t) return;
      const b = h[d] ?? 9;
      (!r || b < r.r || b === r.r && x < r.d) && (r = { type: d, x: y, y: M, z: $, d: x, r: b });
    };
    if (i.ori !== false && v("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const d = window.__hekatanGridConfig, y = (d == null ? void 0 : d.minorStep) && d.minorStep > 0 ? d.minorStep : 1, M = ((d == null ? void 0 : d.gridSize) ?? 30) / 2, $ = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", x = (A) => Math.round(A / y) * y, b = (A, Z) => Math.abs(A) <= M + 1e-9 && Math.abs(Z) <= M + 1e-9;
      if ($ === "xz") {
        const A = x(e), Z = x(a);
        b(A, Z) && v("grid", A, o, Z);
      } else if ($ === "yz") {
        const A = x(o), Z = x(a);
        b(A, Z) && v("grid", e, A, Z);
      } else {
        const A = x(e), Z = x(o);
        b(A, Z) && v("grid", A, Z, a);
      }
    }
    (i.node || i.end) && l.forEach((d) => {
      i.node && v("node", d[0], d[1], d[2]);
    });
    for (const d of c) if (!(d.length < 2)) for (let y = 0; y < d.length - 1; y++) {
      const M = l[d[y]], $ = l[d[y + 1]];
      if (!(!M || !$) && (i.end && (v("end", M[0], M[1], M[2]), v("end", $[0], $[1], $[2])), i.mid && v("mid", (M[0] + $[0]) / 2, (M[1] + $[1]) / 2, (M[2] + $[2]) / 2), i.nea || i.per)) {
        const x = $[0] - M[0], b = $[1] - M[1], A = $[2] - M[2], Z = x * x + b * b + A * A;
        if (Z < 1e-12) continue;
        const X = Math.max(0, Math.min(1, ((e - M[0]) * x + (o - M[1]) * b + (a - M[2]) * A) / Z)), K = M[0] + X * x, de = M[1] + X * b, ye = M[2] + X * A;
        i.nea && v("nea", K, de, ye), i.per && v("per", K, de, ye);
      }
    }
    if (i.cen) {
      const d = ((_e2 = n.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const y of d) {
        const M = c[y];
        if (!M || M.length < 3) continue;
        const $ = M[0] === M[M.length - 1] ? M.slice(0, -1) : M;
        let x = 0, b = 0, A = 0, Z = 0;
        for (const X of $) {
          const K = l[X];
          K && (x += K[0], b += K[1], A += K[2], Z++);
        }
        Z >= 3 && v("cen", x / Z, b / Z, A / Z);
      }
    }
    if (i.cen) {
      const d = Cs(), y = [...wo];
      for (const M of d) y.some(($) => Math.hypot($.c[0] - M.c[0], $.c[1] - M.c[1], $.c[2] - M.c[2]) < 1e-6 && Math.abs($.r - M.r) < 1e-6) || y.push(M);
      for (const M of y) {
        if (!l.some((b) => Math.abs(Math.hypot(b[0] - M.c[0], b[1] - M.c[1], b[2] - M.c[2]) - M.r) < 1e-6)) continue;
        const x = Math.hypot(e - M.c[0], o - M.c[1], a - M.c[2]);
        if (x < t || Math.abs(x - M.r) < t) {
          const b = Math.min(x, t * 0.5), A = 3;
          (!r || A < r.r || A === r.r && b < r.d) && (r = { type: "cen", x: M.c[0], y: M.c[1], z: M.c[2], d: b, r: A });
        }
      }
    }
    if (i.int) {
      const d = [];
      for (const y of c) for (let M = 0; M < y.length - 1; M++) {
        const $ = l[y[M]], x = l[y[M + 1]];
        if (!$ || !x) continue;
        const b = x[0] - $[0], A = x[1] - $[1], Z = x[2] - $[2], X = b * b + A * A + Z * Z;
        if (X < 1e-12) continue;
        const K = Math.max(0, Math.min(1, ((e - $[0]) * b + (o - $[1]) * A + (a - $[2]) * Z) / X));
        Math.hypot($[0] + K * b - e, $[1] + K * A - o, $[2] + K * Z - a) < 3 * t && d.push([$, x]);
      }
      for (let y = 0; y < d.length; y++) for (let M = y + 1; M < d.length; M++) {
        const [$, x] = d[y], [b, A] = d[M], Z = [x[0] - $[0], x[1] - $[1], x[2] - $[2]], X = [A[0] - b[0], A[1] - b[1], A[2] - b[2]], K = [$[0] - b[0], $[1] - b[1], $[2] - b[2]], de = Z[0] * Z[0] + Z[1] * Z[1] + Z[2] * Z[2], ye = Z[0] * X[0] + Z[1] * X[1] + Z[2] * X[2], ke = X[0] * X[0] + X[1] * X[1] + X[2] * X[2], ot = Z[0] * K[0] + Z[1] * K[1] + Z[2] * K[2], Ke = X[0] * K[0] + X[1] * K[1] + X[2] * K[2], tt = de * ke - ye * ye;
        if (tt < 1e-12) continue;
        const Ee = (ye * Ke - ke * ot) / tt, Ge = (de * Ke - ye * ot) / tt;
        if (Ee < -1e-6 || Ee > 1 + 1e-6 || Ge < -1e-6 || Ge > 1 + 1e-6) continue;
        const De = [$[0] + Ee * Z[0], $[1] + Ee * Z[1], $[2] + Ee * Z[2]], ze = [b[0] + Ge * X[0], b[1] + Ge * X[1], b[2] + Ge * X[2]];
        if (Math.hypot(De[0] - ze[0], De[1] - ze[1], De[2] - ze[2]) > 1e-4) continue;
        [$, x, b, A].some((qe) => Math.hypot(qe[0] - De[0], qe[1] - De[1], qe[2] - De[2]) < 1e-6) || v("int", De[0], De[1], De[2]);
      }
    }
    const f = window.__hekatanAxisGrids ?? [], w = window.__hekatanLevels ?? [], k = f.filter((d) => d && d.start && d.end).map((d) => [d.start, d.end]);
    for (const [d, y] of k) {
      i.end && (v("end", d[0], d[1], d[2]), v("end", y[0], y[1], y[2]));
      const M = y[0] - d[0], $ = y[1] - d[1], x = y[2] - d[2], b = M * M + $ * $ + x * x;
      if (b < 1e-12) continue;
      const A = Math.max(0, Math.min(1, ((e - d[0]) * M + (o - d[1]) * $ + (a - d[2]) * x) / b));
      if (i.nea && v("nea", d[0] + A * M, d[1] + A * $, d[2] + A * x), i.int && Math.abs(x) > 1e-9) for (const Z of w) {
        const X = (Z.z - d[2]) / x;
        X < -1e-6 || X > 1 + 1e-6 || v("int", d[0] + X * M, d[1] + X * $, Z.z);
      }
    }
    if (i.int || i.node) for (let d = 0; d < k.length; d++) for (let y = d + 1; y < k.length; y++) {
      const [M, $] = k[d], [x, b] = k[y], A = $[0] - M[0], Z = $[1] - M[1], X = b[0] - x[0], K = b[1] - x[1], de = A * K - Z * X;
      if (Math.abs(de) < 1e-12) continue;
      const ye = M[0] - x[0], ke = M[1] - x[1], ot = (X * ke - K * ye) / de, Ke = (A * ke - Z * ye) / de;
      if (ot < -1e-6 || ot > 1 + 1e-6 || Ke < -1e-6 || Ke > 1 + 1e-6) continue;
      const tt = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      v("int", M[0] + ot * A, M[1] + ot * Z, typeof tt == "number" ? tt : a);
    }
    const P = window.__hekatanDrawingAuxLines, p = (P == null ? void 0 : P.rawVal) ?? (P == null ? void 0 : P.val) ?? P ?? [];
    for (const d of p) {
      if (d.length !== 6) continue;
      const y = [d[0], d[1], d[2]], M = [d[3], d[4], d[5]];
      if (i.end && (v("end", y[0], y[1], y[2]), v("end", M[0], M[1], M[2])), i.mid && v("mid", (y[0] + M[0]) / 2, (y[1] + M[1]) / 2, (y[2] + M[2]) / 2), i.nea || i.per) {
        const $ = M[0] - y[0], x = M[1] - y[1], b = M[2] - y[2], A = $ * $ + x * x + b * b;
        if (A < 1e-12) continue;
        const Z = Math.max(0, Math.min(1, ((e - y[0]) * $ + (o - y[1]) * x + (a - y[2]) * b) / A)), X = y[0] + Z * $, K = y[1] + Z * x, de = y[2] + Z * b;
        i.nea && v("nea", X, K, de), i.per && v("per", X, K, de);
      }
    }
    return r ? { type: r.type, x: r.x, y: r.y, z: r.z } : null;
  }, Zn = new ct();
  Zn.frustumCulled = false, g.add(Zn);
  const Ls = new dt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Ts = 0;
  const Rs = () => {
    var _a3, _b;
    for (const e of Zn.children.slice()) Zn.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (e) => {
    var _a3, _b;
    Rs();
    const o = ((_a3 = n.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = n.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of e || []) {
      const i = String(s).split(":");
      let l = [];
      if (i[0] === "pt") {
        const h = o[+i[1]];
        h && (l = [h, [h[0] + 1e-3, h[1], h[2]]]);
      } else if (i[0] === "seg") {
        const h = a[+i[1]] || [], u = o[h[+i[2]]], v = o[h[+i[2] + 1]];
        u && v && (l = [u, v]);
      } else i[0] === "poly" && (l = (a[+i[1]] || []).map((u) => o[u]).filter(Boolean));
      if (l.length < 2) continue;
      const c = new Ae().setFromPoints(l.map((h) => new V(h[0], h[1], h[2]))), r = new Ft(c, Ls);
      r.renderOrder = 1200, Zn.add(r);
    }
    if (!Zn.children.length) return;
    Ts = performance.now() + 900;
    const t = () => {
      const s = Ts - performance.now();
      if (s <= 0) {
        Rs(), C();
        return;
      }
      Ls.opacity = Math.min(1, s / 900) * 0.95, C(), requestAnimationFrame(t);
    };
    requestAnimationFrame(t);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a3;
    const o = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Va, window.__hekatanOsnapShow = _o, window.__hekatanOsnapHide = ko;
  let Ze = [], St = 0, Fn = 0, Rt = null;
  const to = document.createElement("div");
  to.id = "hk-cad-status", to.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", to.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(to);
  const $a = () => {
    var _a3, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), kt && e.push(`\u{1F512} LOCK ${kt.toUpperCase()}`);
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && e.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, ae = (e) => {
    var _a3;
    const o = e + $a();
    to.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, Ia = "Comando:", La = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = n.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], t = Ze.length, s = (i, l = []) => ({ txt: i, ops: l });
    switch (e) {
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${Oe.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return s("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return s(`REGLA ${xt.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
      case "rect":
        return s(t ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(t ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(t === 0 ? "ARCO Precise punto inicial:" : t === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "parabola":
        return s(`PAR\xC1BOLA Precise punto ${t + 1} de 3 (pasa por los tres):`);
      case "cubica":
        return s(`C\xDABICA Precise punto ${t + 1} de 4 (pasa por los cuatro):`);
      case "revolve":
        return s("REVOLUCI\xD3N Precise un punto del eje vertical (Z) alrededor del que gira la selecci\xF3n:");
      case "loft":
        return s("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${St > 0 ? St : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(t ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${St > 0 ? St : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${t + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(Rt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(Rt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(Rt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Fn > 0 ? ` (distancia ${Fn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Ue.size ? s(t ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ue.size ? s(t ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ue.size ? s(`SELECCI\xD3N ${Ue.size} objeto${Ue.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(Ia);
    }
  }, Gt = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const e = La(), o = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = n.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !o && !a ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, s, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Gt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", o = e.split("   |   ")[0] ?? e;
    ae(o);
  }, window.__hekatanCadResetPending = () => {
    Ze = [], Oe = [], $e.visible = false, Jo(), Rt = null, C(), ae("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Gt();
  };
  function Jo() {
    if (!n.polylines) return;
    const e = n.polylines.rawVal.filter((o) => o.length >= 2);
    n.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = Jo;
  const qn = [], Po = [], Ta = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, Qo = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(n.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = n.areas) == null ? void 0 : _b.rawVal) ?? [])), x: Ta() };
  }, Ds = (e) => {
    var _a3;
    if (n.points.val = e.p, n.polylines && (n.polylines.val = e.l), n.areas && (n.areas.val = e.a), e.x) {
      const o = window.__hekatanDrawingAuxLines;
      o && "val" in o && (o.val = e.x);
    }
    Ze = [], Ye.visible = false, Xt.visible = false, mt();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C(), Gt();
  }, bt = () => {
    qn.push(Qo()), qn.length > 100 && qn.shift(), Po.length = 0;
  }, Co = () => {
    const e = qn.pop();
    if (!e) {
      ae("\u21B6 Nada para deshacer");
      return;
    }
    Po.push(Qo()), Ds(e), ae(`\u21B6 Deshacer \u2014 quedan ${qn.length}`);
  }, Bs = () => {
    const e = Po.pop();
    if (!e) {
      ae("\u21B7 Nada para rehacer");
      return;
    }
    qn.push(Qo()), Ds(e), ae(`\u21B7 Rehacer \u2014 quedan ${Po.length}`);
  };
  window.__hekatanPushUndo = bt, window.__hekatanUndo = Co, window.__hekatanRedo = Bs, document.addEventListener("keydown", (e) => {
    var _a3;
    const o = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (o === "y" || o === "z" && e.shiftKey))) return;
    const t = e.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a3 = t.value) == null ? void 0 : _a3.length) ?? 0) > 0 && t.__hkSucio || (e.preventDefault(), e.stopPropagation(), Bs());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a3, _b, _c, _d, _e2;
    const o = e.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!n.polylines) return false;
    const t = n.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Co(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ae("Cerrar necesita al menos tres puntos."), true;
      bt(), n.polylines.val = [...t.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return Oo(), ae(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Co(), true;
      bt();
      const i = s[s.length - 1], l = s.slice(0, -1), c = t.some((u, v) => v !== t.length - 1 && u.includes(i)) || l.includes(i);
      let r = n.points.rawVal, h = [...t.slice(0, -1), l];
      if (!c && i === r.length - 1 && (r = r.slice(0, -1), n.points.val = r), n.polylines.val = h, l.length) {
        const u = r[l[l.length - 1]];
        u && (Te = [u[0], u[1], u[2]]);
      } else Te = null, Ye.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return C(), ae(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${l.length}.`), Gt(), true;
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
      const o = e.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a3 = o.value) == null ? void 0 : _a3.length) > 0 && !!o.__hkSucio) return;
      e.preventDefault(), e.stopPropagation(), Co();
    }
  }, { capture: true });
  const Oo = () => {
    Ze = [], Rt = null, Jo(), kt = null, vs(), Ye.visible = false, Xt.visible = false, mt(), ae("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), C(), Gt();
  };
  window.__hekatanFinalizeDraw = Oo;
  const Ns = () => {
    var _a3, _b, _c;
    Ze = [], Oe = [], $e.visible = false;
    let e = false;
    Ue.size && (Ue.clear(), Ot(), e = true), Oo();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ae(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), C(), Gt();
  };
  window.__hekatanEscapeCancel = Ns;
  const Xs = () => {
    var _a3;
    const e = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ue.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (e[+a.slice(5)] || []).forEach((t) => o.add(t));
      else if (a.startsWith("seg:")) {
        const t = a.split(":"), s = e[+t[1]] || [], i = s[+t[2]], l = s[+t[2] + 1];
        i != null && o.add(i), l != null && o.add(l);
      }
    }), o;
  }, Ys = (e, o, a) => {
    var _a3;
    const t = Xs();
    if (!t.size) return 0;
    bt();
    const s = n.points.rawVal.map((i, l) => t.has(l) ? [i[0] + e, i[1] + o, i[2] + a] : i);
    n.points.val = s;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return Ot(), C(), t.size;
  };
  window.__hekatanMoveSelection = Ys;
  const Us = (e, o) => {
    var _a3, _b, _c, _d, _e2;
    if (!Ue.size) {
      ae(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Gt();
      return;
    }
    if (Ze.push(o), Ze.length === 1) {
      Te = o, ae(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Gt();
      return;
    }
    const [a, t] = Ze, s = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    Ze = [], Ye.visible = false;
    let i = 0;
    e === "move" ? i = Ys(s[0], s[1], s[2]) : (i = Xs().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ae(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (Ue.clear(), Ot()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Gt();
  };
  window.__hekatanPasoMoverCopiar = Us;
  const Ra = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, _n = (e, o) => Math.hypot(e[0] - o[0], e[1] - o[1], e[2] - o[2]), jo = (e, o, a, t, s, i) => {
    const l = [o[0] - e[0], o[1] - e[1], o[2] - e[2]], c = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], r = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], h = l[0] * l[0] + l[1] * l[1] + l[2] * l[2], u = l[0] * c[0] + l[1] * c[1] + l[2] * c[2], v = c[0] * c[0] + c[1] * c[1] + c[2] * c[2], f = l[0] * r[0] + l[1] * r[1] + l[2] * r[2], w = c[0] * r[0] + c[1] * r[1] + c[2] * r[2], k = h * v - u * u;
    if (k < 1e-12) return null;
    const P = (u * w - v * f) / k, p = (h * w - u * f) / k;
    if (!s && (P < -1e-6 || P > 1 + 1e-6) || !i && (p < -1e-6 || p > 1 + 1e-6)) return null;
    const d = [e[0] + P * l[0], e[1] + P * l[1], e[2] + P * l[2]], y = [a[0] + p * c[0], a[1] + p * c[1], a[2] + p * c[2]];
    return _n(d, y) > 1e-4 ? null : d;
  }, Da = (e) => {
    var _a3;
    return (((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((o, a) => o + a.filter((t) => t === e).length, 0);
  }, Ba = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Na = (e, o) => {
    var _a3, _b;
    if (!n.polylines) return;
    const a = n.polylines.rawVal, t = n.points.rawVal, s = Ba[e];
    if (!Rt) {
      if (ln < 0) {
        ae(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Rt = { poly: ln, seg: Math.max(0, vn) }, ae(e === "offset" ? `DESFASE l\xEDnea #${Rt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Fn > 0 ? ` (${Fn} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Gt();
      return;
    }
    if (e === "offset") {
      const P = Rt.poly, p = a[P];
      if (!p || p.length < 2) {
        Rt = null, ae("DESFASE: esa polil\xEDnea no tiene tramos."), Gt();
        return;
      }
      const d = p.length > 2 && p[0] === p[p.length - 1], y = Ra(), M = [];
      for (let Ee = 0; Ee < p.length - 1; Ee++) {
        const Ge = t[p[Ee]], De = t[p[Ee + 1]], ze = [De[0] - Ge[0], De[1] - Ge[1], De[2] - Ge[2]], Xe = Math.hypot(ze[0], ze[1], ze[2]) || 1, qe = ze[0] / Xe, pt = ze[1] / Xe, gt = ze[2] / Xe, At = [y[1] * gt - y[2] * pt, y[2] * qe - y[0] * gt, y[0] * pt - y[1] * qe], tn = Math.hypot(At[0], At[1], At[2]) || 1;
        M.push({ a: Ge, b: De, n: [At[0] / tn, At[1] / tn, At[2] / tn] });
      }
      let $ = 0, x = 1 / 0;
      M.forEach((Ee, Ge) => {
        const De = Hn(o[0], o[1], o[2], Ee.a[0], Ee.a[1], Ee.a[2], Ee.b[0], Ee.b[1], Ee.b[2]);
        De < x && (x = De, $ = Ge);
      });
      const b = M[$], A = Math.sign((o[0] - b.a[0]) * b.n[0] + (o[1] - b.a[1]) * b.n[1] + (o[2] - b.a[2]) * b.n[2]) || 1, Z = Fn > 0 ? Fn : x;
      if (Z < 1e-6) {
        ae("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const X = M.map((Ee) => ({ a: [Ee.a[0] + A * Z * Ee.n[0], Ee.a[1] + A * Z * Ee.n[1], Ee.a[2] + A * Z * Ee.n[2]], b: [Ee.b[0] + A * Z * Ee.n[0], Ee.b[1] + A * Z * Ee.n[1], Ee.b[2] + A * Z * Ee.n[2]] })), K = X.length, de = (Ee) => {
        const Ge = X[(Ee - 1 + K) % K], De = X[Ee % K];
        return jo(Ge.a, Ge.b, De.a, De.b, true, true) ?? De.a;
      }, ye = [], ke = d ? K : K + 1;
      for (let Ee = 0; Ee < ke; Ee++) !d && Ee === 0 ? ye.push(X[0].a) : !d && Ee === K ? ye.push(X[K - 1].b) : ye.push(de(Ee));
      bt();
      const ot = t.length;
      n.points.val = [...t, ...ye];
      const Ke = ye.map((Ee, Ge) => ot + Ge);
      d && Ke.push(ot);
      let tt = a.slice();
      tt.length && tt[tt.length - 1].length === 0 && (tt = tt.slice(0, -1)), n.polylines.val = [...tt, Ke, []], Rt = null, ae(`\u2713 Desfase a ${Z.toFixed(2)} m \u2014 ${K} tramo${K === 1 ? "" : "s"} nuevo${K === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      C(), Gt();
      return;
    }
    let i = ln, l = Math.max(0, vn);
    if (i < 0 || i === Rt.poly && l === Rt.seg) {
      let p = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((d, y) => {
        for (let M = 0; M < d.length - 1; M++) {
          if (y === Rt.poly && M === Rt.seg) continue;
          const $ = t[d[M]], x = t[d[M + 1]];
          if (!$ || !x) continue;
          const b = Hn(o[0], o[1], o[2], $[0], $[1], $[2], x[0], x[1], x[2]);
          b < p && (p = b, i = y, l = M);
        }
      }), i < 0) {
        ae(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const c = a[Rt.poly], r = t[c[Rt.seg]], h = t[c[Rt.seg + 1]], u = a[i], v = u[l], f = u[l + 1];
    if (!r || !h || v == null || f == null) {
      ae(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const w = t[v], k = t[f];
    if (e === "trim") {
      const P = jo(w, k, r, h, false, false);
      if (!P) {
        ae("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      bt();
      const p = t.length;
      n.points.val = [...t, P];
      const d = [...u.slice(0, l + 1), p, ...u.slice(l + 1)];
      n.polylines.val = a.map((M, $) => $ === i ? d : M);
      const y = _n(o, w) < _n(o, k);
      ks(i, y ? l : l + 1), ae(`\u2713 Recortado en (${P[0].toFixed(2)}, ${P[1].toFixed(2)}, ${P[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const P = jo(w, k, r, h, true, false);
      if (!P) {
        ae("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const d = _n(o, w) < _n(o, k) ? l : l + 1;
      if (d !== 0 && d !== u.length - 1) {
        ae("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const y = u[d];
      if (_n(P, w) + _n(P, k) < _n(w, k) + 1e-6) {
        ae("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (bt(), Da(y) > 1) {
        const $ = t.length;
        n.points.val = [...t, P];
        const x = u.slice();
        x[d] = $, n.polylines.val = a.map((b, A) => A === i ? x : b);
      } else n.points.val = t.map(($, x) => x === y ? P : $);
      ae(`\u2713 Alargada hasta (${P[0].toFixed(2)}, ${P[1].toFixed(2)}, ${P[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    C(), Gt();
  };
  window.__hekatanSelectionSize = () => Ue.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let o = e.length - 1;
    for (; o >= 0 && (!e[o] || e[o].length < 2); ) o--;
    return Ue.clear(), o >= 0 && Ue.add(`poly:${o}`), Ot(), ae(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ue.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = ((_b = n.points) == null ? void 0 : _b.rawVal) ?? [];
    Ue.clear();
    const a = /* @__PURE__ */ new Set();
    return e.forEach((t, s) => {
      !t || t.length < 2 || (Ue.add(`poly:${s}`), t.forEach((i) => a.add(i)));
    }), o.forEach((t, s) => {
      a.has(s) || Ue.add(`pt:${s}`);
    }), Ot(), ae(`SELECCI\xD3N ${Ue.size} objetos (todo el modelo) \xB7 Esc suelta`), Ue.size;
  }, window.__hekatanReplicateSelection = (e, o, a, t, s = 0) => {
    var _a3, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...Ue], l = n.points.rawVal, c = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = new Set(((_b = n.areas) == null ? void 0 : _b.rawVal) ?? []), h = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), v = [];
    if (i.forEach((p) => {
      if (p.startsWith("pt:")) {
        const d = +p.slice(3);
        l[d] && h.add(d);
      } else if (p.startsWith("poly:")) {
        const d = +p.slice(5);
        if (!c[d] || c[d].length < 2) return;
        u.add(d), c[d].forEach((y) => h.add(y));
      } else if (p.startsWith("seg:")) {
        const d = p.split(":"), y = +d[1], M = +d[2], $ = c[y] || [], x = $[M], b = $[M + 1];
        x != null && b != null && (v.push([x, b]), h.add(x), h.add(b));
      }
    }), !h.size) return 0;
    bt();
    const f = [...l];
    let w = c.slice();
    w.length && w[w.length - 1].length === 0 && (w = w.slice(0, -1));
    const k = [...((_c = n.areas) == null ? void 0 : _c.rawVal) ?? []], P = [...h];
    for (let p = 1; p <= t; p++) {
      const d = s + p, y = e * d, M = o * d, $ = a * d, x = /* @__PURE__ */ new Map();
      P.forEach((b) => {
        x.set(b, f.length), f.push([l[b][0] + y, l[b][1] + M, l[b][2] + $]);
      }), u.forEach((b) => {
        const A = c[b].map((X) => x.has(X) ? x.get(X) : X), Z = w.length;
        w.push(A), r.has(b) && k.push(Z);
      }), v.forEach(([b, A]) => {
        w.push([x.get(b), x.get(A)]);
      });
    }
    w.push([]), n.points.val = f, n.polylines && (n.polylines.val = w), n.areas && (n.areas.val = k);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), t;
  }, window.__hekatanExtrudeSelection = (e, o, a, t) => {
    var _a3, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1));
    const s = [...Ue], i = n.points.rawVal, l = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], c = new Set(((_b = n.areas) == null ? void 0 : _b.rawVal) ?? []), r = /* @__PURE__ */ new Set(), h = [], u = /* @__PURE__ */ new Set();
    for (const y of l) for (const M of y) u.add(M);
    if (s.forEach((y) => {
      if (y.startsWith("poly:")) {
        const M = +y.slice(5);
        if (c.has(M)) return;
        const $ = l[M] || [];
        for (let x = 0; x + 1 < $.length; x++) h.push([$[x], $[x + 1]]), u.add($[x]), u.add($[x + 1]);
      } else if (y.startsWith("seg:")) {
        const M = y.split(":"), $ = +M[1], x = +M[2], b = l[$] || [], A = b[x], Z = b[x + 1];
        A != null && Z != null && (h.push([A, Z]), u.add(A), u.add(Z));
      }
    }), s.forEach((y) => {
      if (y.startsWith("pt:")) {
        const M = +y.slice(3);
        i[M] && !u.has(M) && r.add(M);
      }
    }), !r.size && !h.length) return { lineas: 0, areas: 0 };
    bt();
    const v = [...i];
    let f = l.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const w = [...((_c = n.areas) == null ? void 0 : _c.rawVal) ?? []], k = /* @__PURE__ */ new Map(), P = (y, M) => {
      if (M === 0) return y;
      const $ = y + ":" + M;
      let x = k.get($);
      if (x == null) {
        const b = [i[y][0] + e * M, i[y][1] + o * M, i[y][2] + a * M];
        x = v.findIndex((A) => Math.abs(A[0] - b[0]) < 1e-3 && Math.abs(A[1] - b[1]) < 1e-3 && Math.abs(A[2] - b[2]) < 1e-3), x < 0 && (x = v.length, v.push(b)), k.set($, x);
      }
      return x;
    };
    let p = 0, d = 0;
    r.forEach((y) => {
      const M = [y];
      for (let $ = 1; $ <= t; $++) M.push(P(y, $));
      f.push(M), p += t;
    }), h.forEach(([y, M]) => {
      for (let $ = 1; $ <= t; $++) {
        const x = [P(y, $ - 1), P(M, $ - 1), P(M, $), P(y, $)];
        w.push(f.length), f.push([...x, x[0]]), d++;
      }
    }), f.push([]), n.points.val = v, n.polylines && (n.polylines.val = f), n.areas && (n.areas.val = w);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), { lineas: p, areas: d };
  }, window.__hekatanVoladoSelection = (e, o = {}) => {
    var _a3, _b, _c;
    const a = Number(e);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const t = o.losa !== false, s = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", l = n.points.rawVal, c = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = [];
    if ([...Ue].forEach((P) => {
      if (P.startsWith("seg:")) {
        const p = P.split(":"), d = +p[1], y = +p[2], M = c[d] || [], $ = M[y], x = M[y + 1];
        $ != null && x != null && r.push([$, x]);
      } else if (P.startsWith("poly:")) {
        const p = c[+P.slice(5)] || [];
        for (let d = 0; d + 1 < p.length; d++) r.push([p[d], p[d + 1]]);
      }
    }), !r.length) return 0;
    let h = 0, u = 0;
    for (const P of l) h += P[0], u += P[1];
    h /= Math.max(1, l.length), u /= Math.max(1, l.length), bt();
    const v = [...l];
    let f = c.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const w = [...((_b = n.areas) == null ? void 0 : _b.rawVal) ?? []];
    let k = 0;
    for (const [P, p] of r) {
      const d = l[P], y = l[p];
      if (!d || !y) continue;
      const M = y[0] - d[0], $ = y[1] - d[1], x = Math.hypot(M, $);
      if (x < 1e-6) continue;
      let b = -$ / x, A = M / x;
      const Z = (d[0] + y[0]) / 2, X = (d[1] + y[1]) / 2;
      (Z - h) * b + (X - u) * A < 0 && (b = -b, A = -A);
      const K = i === "ambos" ? [1, -1] : [1];
      for (const de of K) {
        const ye = b * a * de, ke = A * a * de, ot = v.length;
        v.push([d[0] + ye, d[1] + ke, d[2]]);
        const Ke = v.length;
        v.push([y[0] + ye, y[1] + ke, y[2]]), f.push([P, ot]), f.push([p, Ke]), s && f.push([ot, Ke]), t && (w.push(f.length), f.push([P, p, Ke, ot, P])), k++;
      }
    }
    if (!k) return 0;
    f.push([]), n.points.val = v, n.polylines && (n.polylines.val = f), n.areas && (n.areas.val = w);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), k;
  }, E.addEventListener("click", (e) => {
    var _a3, _b;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Cn > 5) {
      Cn = 0;
      return;
    }
    Cn = 0;
    const o = R(e);
    if (!o) return;
    I.setFromCamera(D, o);
    const a = !!(Lt && Math.abs(e.clientX - Lt.x) <= 3 && Math.abs(e.clientY - Lt.y) <= 3), t = a ? [{ point: Lt.p.clone(), distance: o.position.distanceTo(Lt.p) }] : ge();
    if (!t.length) return;
    if (!a) {
      const i = o.position.distanceTo(S.target) || 1, l = t[0].distance ?? o.position.distanceTo(t[0].point), c = t[0].point;
      if (!isFinite(c.x) || !isFinite(c.y) || !isFinite(c.z) || l > Math.max(i * 12, 300)) {
        ae("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let s = t[0].point;
    (e.ctrlKey || e.metaKey) && (s = new V(Math.round(t[0].point.x), Math.round(t[0].point.y), Math.round(t[0].point.z)));
    {
      const i = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = i[i.length - 1] ?? [], c = n.points.rawVal ?? [];
      if (l.length > 0) {
        const r = c[l[l.length - 1]];
        if (r) {
          const h = !!window.__hekatanOrthoMode;
          let u = kt;
          if (!u && h) {
            const v = Math.abs(s.x - r[0]), f = Math.abs(s.y - r[1]), w = Math.abs(s.z - r[2]);
            u = v >= f && v >= w ? "x" : f >= w ? "y" : "z";
          }
          u === "x" ? s = new V(s.x, r[1], r[2]) : u === "y" ? s = new V(r[0], s.y, r[2]) : u === "z" && (s = new V(r[0], r[1], s.z));
        }
      }
    }
    if (Lt && Math.abs(e.clientX - Lt.x) <= 3 && Math.abs(e.clientY - Lt.y) <= 3) s = Lt.p.clone();
    else if (co) s = co.clone(), ae(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
    else {
      const i = Zo(s), l = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, s.x, s.y, s.z, i, { x: e.clientX, y: e.clientY });
      if (l) s = new V(l.x, l.y, l.z), ae(`\u{1F3AF} Snap [${l.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const c = window.__hekatanSnapEnabled !== false, r = window.__hekatanSnap2D ?? 0;
        c && r > 0 && (s = new V(Math.round(s.x / r) * r, Math.round(s.y / r) * r, Math.round(s.z / r) * r));
      }
    }
    Zs(s, e);
  });
  const Zs = (e, o) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (fn) {
        Wt && Mo();
        const { kind: t, a: s, b: i } = fn, l = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ue.clear(), Ue.has(l) ? Ue.delete(l) : Ue.add(l), Ot(), ae(`\u2713 Seleccionados ${Ue.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const t = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Wt ? (Vs(Wt.x, Wt.y, s, i, t), Wt = null) : t || (Wt = { x: s, y: i }, ae("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Ko(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const t = window.__hekatanAxisDraw;
      if (!t) return;
      if (!t.pendingStart) {
        t.pendingStart = [e.x, e.y, e.z], ae(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = t.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, t.pendingStart, [e.x, e.y, e.z], s);
      ae(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      Us(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "delete") {
      if (Mn >= 0) {
        const t = window.__hekatanDrawingAuxLines, s = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [], i = Mn;
        if (i >= 0 && i < s.length) {
          bt();
          const l = s.slice(0, i).concat(s.slice(i + 1));
          t && typeof t == "object" && "val" in t ? t.val = l : window.__hekatanDrawingAuxLines = l, ae(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Mn = -1, Zt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (ln >= 0) {
        const t = ln, s = vn;
        ((_g = (_f = n.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(t)) ?? false ? (mo(t), ae(`\u{1F5D1} \xC1rea #${t + 1} (shell Q4) borrada`)) : s >= 0 ? (ks(t, s), ae(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${t + 1} borrado`)) : (mo(t), ae(`\u{1F5D1} Polil\xEDnea #${t + 1} borrada`));
      } else ae("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ae("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [t, s] = Ze, i = Math.hypot(s[0] - t[0], s[1] - t[1], s[2] - t[2]), l = Math.abs(s[0] - t[0]), c = Math.abs(s[1] - t[1]), r = Math.abs(s[2] - t[2]), h = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), v = (h === "xy" ? r < 1e-3 : h === "xz" ? c < 1e-3 : h === "yz" ? l < 1e-3 : false) ? h : r < 1e-3 ? "xy" : c < 1e-3 ? "xz" : "yz", f = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, t[0], t[1], t[2], i, f, v), ae(`\u2713 C\xEDrculo dibujado en ${v.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${f} segmentos`), Ze = [];
      try {
        (_l = window.__hekatanRebuild) == null ? void 0 : _l.call(window);
      } catch {
      }
      return;
    }
    if (a === "ifcface") {
      if (!Q) {
        ae("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!Q.plana) {
        ae("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const t = U(Q.m), s = Me(t, Q.tris);
      if (s.length < 3) {
        ae("\u25A6 No se pudo cerrar el contorno de la cara.");
        return;
      }
      const i = Q.normal.clone(), l = W(Q.m, Q.punto, i);
      let c = String(window.__hekatanIfcCaraPos ?? "auto"), r = false;
      try {
        const p = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        r = Math.round((p == null ? void 0 : p.matShell) ?? 0) === 1;
      } catch {
      }
      c === "auto" && (c = Math.abs(i.z) > 0.5 ? r ? "interior" : "exterior" : "media");
      const h = l ?? 0.2, u = c === "exterior" ? 0 : c === "interior" ? h : h / 2, v = s.map((p) => p.clone().addScaledVector(i, -u));
      bt(), Oe = v.map((p) => [p.x, p.y, p.z]);
      const f = go();
      try {
        const p = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        p && l && (p.tShell = Math.round(l * 100) / 100);
      } catch {
      }
      const w = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let k = "la de \xABSecci\xF3n shells\xBB";
      try {
        const p = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        p && p.formaPlaca != null && (k = w[Math.round(p.formaPlaca)] ?? k);
      } catch {
      }
      const P = c === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : c === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + h.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (h / 2).toFixed(2) + " m hacia dentro)";
      ae(`\u25A6 \xC1rea desde la cara del IFC: ${s.length} v\xE9rtices, ${f} shell(s). Espesor medido ${l ? l.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${P}; formulaci\xF3n ${k}, t = ${h.toFixed(2)} m.`), we(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      C();
      return;
    }
    if (a === "ifcline") {
      if (!ie || ie.length < 2) {
        ae("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const t = B(ie);
      bt();
      const s = n.points.rawVal, i = [], l = [];
      for (const r of t) {
        let h = s.findIndex((u) => Math.abs(u[0] - r[0]) < 1e-3 && Math.abs(u[1] - r[1]) < 1e-3 && Math.abs(u[2] - r[2]) < 1e-3);
        h < 0 && (h = s.length + l.length, l.push(r)), i.push(h);
      }
      if (n.points.val = [...s, ...l], n.polylines) {
        const r = n.polylines.rawVal, h = r.length && r[r.length - 1].length === 0 ? r.slice(0, -1) : r;
        n.polylines.val = [...h, i, []];
      }
      const c = ie.reduce((r, h, u) => u ? r + h.distanceTo(ie[u - 1]) : 0, 0);
      ae(`\u27CB L\xEDnea del IFC copiada: ${t.length - 1} tramo(s), ${c.toFixed(2)} m de desarrollo.`), G(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      C();
      return;
    }
    if (a === "arc") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ae("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ze.length === 2) {
        ae("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [t, s, i] = Ze, l = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, t, s, i, l), ae(`\u2713 Arco dibujado \u2014 ${l} segmentos`), Ze = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "parabola" || a === "cubica") {
      const t = a === "parabola" ? 3 : 4, s = a === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Ze.push([e.x, e.y, e.z]), Ze.length < t) {
        ae(`\u223F ${s} \u2014 punto ${Ze.length}/${t} OK. Marc\xE1 el ${Ze.length + 1}\xBA.`);
        return;
      }
      const i = window.__hekatanArcSegs ?? 12, l = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Ze.slice(), i);
      if (!(l == null ? void 0 : l.ok)) {
        ae(`\u26A0 ${s}: ${(l == null ? void 0 : l.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Ze = [];
        return;
      }
      const c = "xyz"[l.ia ?? 0], r = "xyz"[l.io ?? 2], h = (l.coef ?? []).map((u, v) => `${u >= 0 && v ? "+" : ""}${u.toFixed(3)}${v ? "\xB7" + c + (v > 1 ? "^" + v : "") : ""}`).join(" ");
      ae(`\u2713 ${s} dibujada en ${String(l.plano ?? "").toUpperCase()} \u2014 ${i} tramos a \u0394 igual de ${c} \xB7 ${r} = ${h}`), Ze = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (a === "revolve") {
      const t = Math.round(window.__hekatanRevSectores ?? 16), s = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, t, 360);
      if (s == null ? void 0 : s.msg) {
        ae(`\u26A0 Revoluci\xF3n: ${s.msg}.`);
        return;
      }
      ae(`\u2713 Revoluci\xF3n: ${s.anillos} anillo(s) \xD7 ${t} sectores \u2192 ${s.areas} pa\xF1o(s) Q4${s.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${s.guias ? ` ${s.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (a === "loft") {
      const t = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, e.x, e.y);
      if (t == null ? void 0 : t.msg) {
        ae(`\u26A0 Barrido: ${t.msg}.`);
        return;
      }
      ae(`\u2713 Barrido: contorno de ${t.contorno} lados \xD7 perfil de ${t.perfil} puntos \u2192 ${t.areas} pa\xF1o(s) Q4. Eje por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${t.guias ? ` ${t.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ae("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Ze;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, t, s), ae(`\u2713 Rect\xE1ngulo dibujado \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ze = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const s = (Lt && Math.abs(Lt.x - o.clientX) < 3 && Math.abs(Lt.y - o.clientY) < 3 ? [Lt.p.x, Lt.p.y, Lt.p.z] : null) ?? st(o);
      if (!s) return;
      if (xt.length >= 2 && (xt = []), xt.push(s), xt.length === 1) at.visible = false, Ct(), ae("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [i, l] = xt;
        at.geometry.setFromPoints([new V(i[0], i[1], i[2]), new V(l[0], l[1], l[2])]), at.visible = true;
        const c = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), r = Math.hypot(l[0] - i[0], l[1] - i[1]);
        He.textContent = `${c.toFixed(3)} m`, Ct(), ae(`\u{1F4CF} Distancia ${c.toFixed(3)} m  \xB7  \u0394x ${(l[0] - i[0]).toFixed(3)}  \u0394y ${(l[1] - i[1]).toFixed(3)}  \u0394z ${(l[2] - i[2]).toFixed(3)}  \xB7  en planta ${r.toFixed(3)} m`);
      }
      C();
      return;
    }
    if (a === "fillarea") {
      const t = n.points.rawVal, s = ((_B = n.polylines) == null ? void 0 : _B.rawVal) ?? [], i = /* @__PURE__ */ new Map(), l = (x, b) => {
        x !== b && ((i.get(x) ?? i.set(x, /* @__PURE__ */ new Set()).get(x)).add(b), (i.get(b) ?? i.set(b, /* @__PURE__ */ new Set()).get(b)).add(x));
      };
      for (const x of s) for (let b = 0; b + 1 < x.length; b++) l(x[b], x[b + 1]);
      const c = (x, b) => {
        var _a4;
        return !!((_a4 = i.get(x)) == null ? void 0 : _a4.has(b));
      }, r = /* @__PURE__ */ new Set(), h = [], u = [...i.keys()];
      for (const x of u) for (const b of i.get(x)) if (!(b < x)) {
        for (const A of i.get(b)) if (A !== x) for (const Z of i.get(A)) {
          if (Z === x || Z === b || !c(Z, x) || c(x, A) || c(b, Z)) continue;
          const X = [x, b, A, Z].slice().sort((K, de) => K - de).join("-");
          r.has(X) || (r.add(X), h.push([x, b, A, Z]));
        }
      }
      for (const x of u) for (const b of i.get(x)) if (!(b < x)) for (const A of i.get(b)) {
        if (A === x || !c(A, x)) continue;
        const Z = [x, b, A].slice().sort((X, K) => X - K).join("-");
        r.has(Z) || (r.add(Z), h.push([x, b, A]));
      }
      const v = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", f = (x) => v === "xy" ? [x[0], x[1]] : v === "xz" ? [x[0], x[2]] : [x[1], x[2]], w = f([e.x, e.y, e.z]), k = (x, b) => {
        let A = false;
        for (let Z = 0, X = b.length - 1; Z < b.length; X = Z++) {
          const K = b[Z][0], de = b[Z][1], ye = b[X][0], ke = b[X][1];
          de > x[1] != ke > x[1] && x[0] < (ye - K) * (x[1] - de) / (ke - de) + K && (A = !A);
        }
        return A;
      }, P = (x) => {
        let b = 0;
        for (let A = 0, Z = x.length - 1; A < x.length; Z = A++) b += (x[Z][0] + x[A][0]) * (x[Z][1] - x[A][1]);
        return Math.abs(b) / 2;
      };
      let p = null, d = 1 / 0;
      for (const x of h) {
        const b = x.map((Z) => f(t[Z]));
        if (!k(w, b)) continue;
        const A = P(b);
        A < d && (d = A, p = x);
      }
      if (!p) {
        ae("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const y = p.slice().sort((x, b) => x - b).join("-"), M = ((_F = n.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (M.some((x) => {
        const b = s[x] ?? [];
        return [...new Set(b)].sort((A, Z) => A - Z).join("-") === y;
      })) {
        ae("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      n.polylines.val = [...s, [...p, p[0]]], n.areas.val = [...M, s.length], ae(`\u2713 \xC1rea creada por relleno (${p.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ae("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Ze;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, t, s), ae(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ze = [];
      return;
    }
    if (a === "polyarea") {
      Oe.push([e.x, e.y, e.z]), $e.geometry.setFromPoints(Oe.map((t) => new V(t[0], t[1], t[2]))), $e.visible = Oe.length >= 1, ae(`\u25B0 \xC1rea libre \u2014 ${Oe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), C();
      return;
    }
    if (a === "plane3") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length < 3) {
        ae(`\u25E3 Plano inclinado \u2014 punto ${Ze.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [t, s, i] = Ze, l = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, t, s, i);
      ae(l ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ze = [];
      return;
    }
    if (a === "col") {
      bt();
      const t = e.z, s = St && St > 0 ? St : 3;
      n.points.val = [...n.points.rawVal, [e.x, e.y, t], [e.x, e.y, t + s]];
      const i = n.polylines.rawVal, l = n.points.rawVal.length;
      n.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [l - 2, l - 1], []], St = 0, ae(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ae("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [t, s] = Ze, i = St && St > 0 ? St : 3;
      bt();
      const l = n.points.rawVal.length;
      n.points.val = [...n.points.rawVal, [t[0], t[1], t[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [t[0], t[1], t[2] + i]];
      const c = n.polylines.rawVal;
      if (c.length - 1, n.polylines.val = [...c.slice(0, -1), ...c[c.length - 1].length > 0 ? [c[c.length - 1]] : [], [l, l + 1, l + 2, l + 3, l], []], n.areas) {
        const r = n.polylines.rawVal.length - 2;
        n.areas.val = [...n.areas.rawVal, r];
      }
      ae(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ze = [], St = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      bt();
      const t = St && St > 0 ? St : 3, s = e.z;
      n.points.val = [...n.points.rawVal, [e.x, e.y, s], [e.x, e.y, s + t]];
      const i = n.polylines.rawVal, l = n.points.rawVal.length;
      n.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [l - 2, l - 1], []], St = 0, ae(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${t.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const t = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = No(e.x, e.y, e.z, t);
      if (!s) {
        ae("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = n.polylines.rawVal, l = n.points.rawVal, c = i[s.polyIdx], r = l[c[s.segIdx]], h = l[c[s.segIdx + 1]];
      if (!r || !h) {
        ae("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const u = St && St > 0 ? St : 3;
      bt();
      const v = n.points.rawVal.length;
      n.points.val = [...n.points.rawVal, [r[0], r[1], r[2]], [h[0], h[1], h[2]], [h[0], h[1], h[2] + u], [r[0], r[1], r[2] + u]];
      const f = n.polylines.rawVal;
      if (n.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [v, v + 1, v + 2, v + 3, v], []], n.areas) {
        const w = n.polylines.rawVal.length - 2;
        n.areas.val = [...n.areas.rawVal, w];
      }
      St = 0, ae(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${u.toFixed(2)}m`);
      try {
        (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
      } catch {
      }
      return;
    }
    if (a === "auxp") {
      const t = window.__hekatanDrawingAuxPoints;
      if (t) {
        const s = t.rawVal ?? t.val ?? [];
        t.val = [...s, [e.x, e.y, e.z]];
      }
      ae(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ae("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [t, s] = Ze, i = window.__hekatanDrawingAuxLines;
      if (i) {
        bt();
        const u = i.rawVal ?? i.val ?? [];
        i.val = [...u, [t[0], t[1], t[2], s[0], s[1], s[2]]];
      }
      const l = s[0] - t[0], c = s[1] - t[1], r = s[2] - t[2], h = Math.sqrt(l * l + c * c + r * r);
      ae(`\u2713 L\xEDnea auxiliar creada \u2014 L=${h.toFixed(2)}m (cyan, no FEM)`), Ze = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      Na(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "chaflan") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ae("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = Ze, i = window.__hekatanChaflanR ?? 1, l = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, t, s, i, l, 6);
      const c = Math.abs(s[0] - t[0]).toFixed(1), r = Math.abs(s[1] - t[1]).toFixed(1);
      ae(`\u2713 Losa con chaflanes dibujada \u2014 ${c}\xD7${r}m, r=${i}m, ${l} seg/chafl\xE1n`), Ze = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    if (Je = false, bt(), n.points.val = [...n.points.rawVal, e.toArray()], n.polylines && a !== "node" && (n.polylines.val = [...n.polylines.rawVal.slice(0, -1), [...n.polylines.rawVal.length ? n.polylines.rawVal.pop() : [], n.points.rawVal.length - 1]]), n.polylines) {
      const t = n.polylines.rawVal, s = t.length - 1, i = t[s] ?? [];
      if (a === "line" && i.length >= 2) {
        ae(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        n.polylines.val = [...t.slice(0, -1), [...i, i[0]], []], n.areas && (n.areas.val = [...n.areas.rawVal, s]), ae("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") ae(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
    else if (a === "line") ae("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") ae("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const t = ((_R = n.polylines) == null ? void 0 : _R.rawVal[n.polylines.rawVal.length - 1]) ?? [];
      ae(`\u25A6 \xC1rea \u2014 click ${t.length}/4. Marc\xE1 ${4 - t.length} v\xE9rtice${4 - t.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  E.addEventListener("click", () => Gt()), E.addEventListener("contextmenu", (e) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && Oe.length >= 3) {
      e.preventDefault();
      const a = go();
      ae(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !n.polylines || n.polylines.rawVal[n.polylines.rawVal.length - 1].length === 0 || (n.polylines.val = [...n.polylines.rawVal, []]);
  }), E.addEventListener("pointermove", (e) => {
    var _a3, _b;
    const o = R(e);
    if (!o) return;
    I.setFromCamera(D, o);
    const a = ge();
    if (Ne.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (e.ctrlKey || e.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const l = ((_a3 = n.polylines) == null ? void 0 : _a3.rawVal) ?? [], c = l[l.length - 1] ?? [], r = n.points.rawVal ?? [];
        if (c.length > 0) {
          const h = r[c[c.length - 1]];
          if (h) {
            const u = !!window.__hekatanOrthoMode;
            let v = kt;
            if (!v && u) {
              const f = Math.abs(t.x - h[0]), w = Math.abs(t.y - h[1]), k = Math.abs(t.z - h[2]);
              v = f >= w && f >= k ? "x" : w >= k ? "y" : "z";
            }
            v === "x" ? t.set(t.x, h[1], h[2]) : v === "y" ? t.set(h[0], t.y, h[2]) : v === "z" && t.set(h[0], h[1], t.z);
          }
        }
      }
      const s = Zo(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s, { x: e.clientX, y: e.clientY });
      if (i) t.set(i.x, i.y, i.z);
      else {
        const l = window.__hekatanSnapEnabled !== false, c = window.__hekatanSnap2D ?? 0.5;
        l && c > 0 && (t.x = Math.round(t.x / c) * c, t.y = Math.round(t.y / c) * c, t.z = Math.round(t.z / c) * c);
      }
      Ne.geometry.setAttribute("position", new Vt(t.toArray(), 3));
    }
    C();
  }), E.addEventListener("pointermove", (e) => {
    var _a3;
    const o = R(e);
    if (!o) return;
    I.setFromCamera(D, o);
    let a = false;
    const t = I.intersectObject(Le), s = ge();
    if (t.length && s.length) {
      const i = new V(...n.points.rawVal[t[0].index]), l = new V(...s[0].point), c = i.sub(l), r = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      r.transformDirection(ee.matrixWorld), Math.abs(c.dot(r)) < 1e-4 && (a = true);
    }
    Ne.visible = !a;
  });
  let es = false, ts;
  E.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Cn) return;
    const o = R(e);
    if (!o) return;
    I.setFromCamera(D, o);
    let a = false;
    const t = I.intersectObject(Le), s = ge();
    if (t.length && s.length) {
      const l = new V(...n.points.rawVal[t[0].index]), c = new V(...s[0].point), r = l.sub(c), h = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      h.transformDirection(ee.matrixWorld), Math.abs(r.dot(h)) < 1e-4 && (a = true);
    }
    if (a && Cn < 5 && (es = true, S.enabled = false, ts = t[0].index), !es || Cn % 2 !== 0) return;
    const i = [...n.points.rawVal];
    if (ts !== void 0) {
      let l = s[0].point;
      (e.ctrlKey || e.metaKey) && (l = new V(Math.round(l.x), Math.round(l.y), Math.round(l.z))), i[ts] = l.toArray();
    }
    n.points.val = i;
  }), E.addEventListener("pointerup", () => {
    S.enabled = true, es = false;
  }), E.addEventListener("contextmenu", (e) => {
    var _a3;
    const o = R(e);
    if (!o) return;
    I.setFromCamera(D, o);
    let a = false;
    const t = I.intersectObject(Le), s = ge();
    if (t.length && s.length) {
      const c = new V(...n.points.rawVal[t[0].index]), r = new V(...s[0].point), h = c.sub(r), u = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      u.transformDirection(ee.matrixWorld), Math.abs(h.dot(u)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...n.points.rawVal];
    if (i.splice(t[0].index, 1), n.points.val = i, !n.polylines) return;
    const l = n.polylines.rawVal.map((c) => c.filter((r) => r !== t[0].index)).map((c) => c.map((r) => r > t[0].index ? r - 1 : r)).filter((c) => c.length);
    l.push([]), n.polylines.val = l;
  });
}
function Vi(n, m, g) {
  const z = Math.round(14.999999999999998), F = { position: n.position.clone(), quaternion: n.quaternion.clone() }, E = setInterval(I, 1e3 / 30);
  let C = 0;
  function I() {
    C++;
    const D = C / z;
    n.position.lerpVectors(F.position, m.position, D), n.quaternion.slerpQuaternions(F.quaternion, m.quaternion, D), g && g(), C == z && clearInterval(E);
  }
}
function $i(n, m, g, _) {
  const S = di(g, n.elements, _);
  return le.derive(() => {
    S.visible = m.shellResults.val != "none";
  }), S;
}
const Ii = 6, ps = 10, Li = 0.012;
function Ti(n) {
  return n.startsWith("contour:") ? n.slice(8) : null;
}
function Ri(n, m, g, _) {
  if (!g && !_) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(n) && g) {
    const z = g[n];
    if (z && z.has(m)) return z.get(m);
  }
  return null;
}
function Di(n, m, g, _) {
  const S = new ct(), z = new fa();
  z.setColorMap("rainbow");
  const F = new nn(), E = le.state([]);
  return le.derive(() => {
    var _a, _b, _c;
    m.deformedShape.val;
    const C = g.val, I = ((_a = n.elements) == null ? void 0 : _a.val) ?? [], D = Ti(m.frameResults.val);
    if (S.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), S.clear(), !D || I.length === 0 || C.length === 0) {
      E.val = [];
      return;
    }
    const R = (_b = n.analyzeOutputs) == null ? void 0 : _b.val, ee = (_c = n.deformOutputs) == null ? void 0 : _c.val, pe = [], me = [];
    for (let L = 0; L < I.length; L++) {
      if (I[L].length !== 2) continue;
      const fe = Ri(D, L, R, ee);
      fe && (pe.push(fe[0], fe[1]), me.push({ idx: L, vals: fe }));
    }
    if (pe.length === 0) {
      E.val = [];
      return;
    }
    const O = Math.min(...pe), N = Math.max(...pe);
    z.setMin(O), z.setMax(N), E.val = pe;
    const re = [1 / 0, 1 / 0, 1 / 0], Y = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of C) for (let Q = 0; Q < 3; Q++) re[Q] = Math.min(re[Q], L[Q]), Y[Q] = Math.max(Y[Q], L[Q]);
    const oe = Math.max(Y[0] - re[0], Y[1] - re[1], Y[2] - re[2], 1) * Li, ne = [], J = [], H = [];
    let G = 0;
    for (const { idx: L, vals: Q } of me) {
      const fe = I[L], we = C[fe[0]], Me = C[fe[1]];
      if (!we || !Me) continue;
      const W = new V(Me[0] - we[0], Me[1] - we[1], Me[2] - we[2]), be = W.length();
      if (be < 1e-10) continue;
      W.normalize();
      const ce = Math.abs(W.y) < 0.99 ? new V(0, 1, 0) : new V(1, 0, 0), Fe = new V().crossVectors(W, ce).normalize(), he = new V().crossVectors(W, Fe).normalize(), Ve = ps + 1, ve = Ii;
      for (let We = 0; We < Ve; We++) {
        const Qe = We / ps, vt = we[0] + W.x * be * Qe, Mt = we[1] + W.y * be * Qe, xe = we[2] + W.z * be * Qe, T = Q[0] + (Q[1] - Q[0]) * Qe, te = z.getColor(T) ?? new nn(0, 0, 0);
        F.copy(te).convertSRGBToLinear();
        for (let j = 0; j < ve; j++) {
          const se = j / ve * Math.PI * 2, Ce = Math.cos(se), Se = Math.sin(se);
          ne.push(vt + (Fe.x * Ce + he.x * Se) * oe, Mt + (Fe.y * Ce + he.y * Se) * oe, xe + (Fe.z * Ce + he.z * Se) * oe), J.push(F.r, F.g, F.b);
        }
      }
      for (let We = 0; We < ps; We++) for (let Qe = 0; Qe < ve; Qe++) {
        const vt = (Qe + 1) % ve, Mt = G + We * ve + Qe, xe = G + We * ve + vt, T = G + (We + 1) * ve + Qe, te = G + (We + 1) * ve + vt;
        H.push(Mt, xe, te), H.push(Mt, te, T);
      }
      G += Ve * ve;
    }
    if (ne.length === 0) return;
    const B = new Ae();
    B.setAttribute("position", new Vt(ne, 3)), B.setAttribute("color", new Vt(J, 3)), B.setIndex(H), B.computeVertexNormals();
    const q = new ft({ vertexColors: true, side: Et }), U = new it(B, q);
    U.frustumCulled = false, S.add(U);
  }), S.__colorMapValues = E, S;
}
function Bi() {
  const n = window;
  return { forceUnit: n.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: n.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: n.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ni = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Xi = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Yi = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Pt(n, m = 4) {
  return n == null || !isFinite(n) ? "\u2014" : n === 0 ? "0" : Math.abs(n) < 1e-3 || Math.abs(n) > 1e5 ? n.toExponential(m) : n.toFixed(m);
}
const Ui = 16755200, aa = 56831, Zi = 56831, qi = 56831, Vo = 65382;
function Ki(n) {
  const m = new ct();
  m.name = "__hekatan_hover", m.renderOrder = 99;
  const g = new Wn(1, 16, 16), _ = new ft({ color: Ui, transparent: true, opacity: 0.85, depthTest: false }), S = new it(g, _);
  S.visible = false, S.renderOrder = 100, m.add(S);
  const z = new Ae(), F = new dt({ color: aa, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), E = new Jt(z, F);
  E.visible = false, E.renderOrder = 100, m.add(E);
  const C = new ft({ color: aa, transparent: true, opacity: 0.7, depthTest: false }), I = new it(new ta(1, 1, 1, 12), C);
  I.visible = false, I.renderOrder = 100, m.add(I);
  const D = new Ae(), R = new ft({ color: Zi, transparent: true, opacity: 0.45, side: Et, depthTest: false }), ee = new it(D, R);
  ee.visible = false, ee.renderOrder = 100, m.add(ee);
  const pe = new Ae(), me = new dt({ color: qi, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), O = new Jt(pe, me);
  O.visible = false, O.renderOrder = 100, m.add(O);
  const N = new ft({ color: Vo, transparent: true, opacity: 0.95, depthTest: false }), re = new ft({ color: Vo, transparent: true, opacity: 0.85, depthTest: false }), Y = new ta(1, 1, 1, 12), ie = new ft({ color: Vo, transparent: true, opacity: 0.55, side: Et, depthTest: false }), oe = new dt({ color: Vo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), ne = [];
  window.__hekatanModelSelection = ne;
  const J = new ct();
  J.renderOrder = 101, m.add(J);
  const H = document.createElement("div");
  Object.assign(H.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), H.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    n.rendererElm.parentElement && n.rendererElm.parentElement.appendChild(H);
  }, 0);
  function G(xe) {
    const T = n.derivedNodes.rawVal;
    return !T || xe < 0 || xe >= T.length ? null : new V(T[xe][0], T[xe][1], T[xe][2]);
  }
  function B(xe, T) {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    const te = n.getActiveCamera();
    if (!te || !n.mesh) return null;
    const j = n.rendererElm.getBoundingClientRect(), se = xe - j.left, Ce = T - j.top, Se = n.derivedNodes.rawVal, ge = (_a = n.mesh.elements) == null ? void 0 : _a.rawVal;
    if (!Se || !ge) return null;
    const Le = /* @__PURE__ */ new Map(), Ne = (nt) => {
      if (Le.has(nt)) return Le.get(nt);
      const Ie = G(nt);
      if (!Ie) return Le.set(nt, null), null;
      const Re = Ie.clone().project(te), Ye = (Re.x * 0.5 + 0.5) * j.width, $e = (-Re.y * 0.5 + 0.5) * j.height, Oe = { x: Ye, y: $e, z: Re.z };
      return Le.set(nt, Oe), Oe;
    }, je = /* @__PURE__ */ new Set();
    for (const nt of ge) if (nt) for (const Ie of nt) je.add(Ie);
    const Pe = 8;
    let Te = -1, lt = Pe;
    for (let nt = 0; nt < Se.length; nt++) {
      if (!je.has(nt)) continue;
      const Ie = Ne(nt);
      if (!Ie || Ie.z < -1 || Ie.z > 1) continue;
      const Re = Ie.x - se, Ye = Ie.y - Ce, $e = Math.sqrt(Re * Re + Ye * Ye);
      $e < lt && (lt = $e, Te = nt);
    }
    const Je = Bi(), _e = Xi[Je.dispUnit] ?? 1e3, Be = Ni[Je.forceUnit] ?? 1;
    if (Te >= 0) {
      const nt = Se[Te];
      let Ie = `Nodo ${Te}
(${nt[0].toFixed(3)}, ${nt[1].toFixed(3)}, ${nt[2].toFixed(3)})`;
      const Re = (_c = (_b = n.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Re == null ? void 0 : Re.deformations) {
        const Ye = Re.deformations.get(Te);
        if (Ye && (Ie += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ie += `
Ux = ${Pt(Ye[0] * _e, 3)} ${Je.dispUnit}`, Ie += `
Uy = ${Pt(Ye[1] * _e, 3)} ${Je.dispUnit}`, Ie += `
Uz = ${Pt(Ye[2] * _e, 3)} ${Je.dispUnit}`, (Math.abs(Ye[3]) > 1e-9 || Math.abs(Ye[4]) > 1e-9 || Math.abs(Ye[5]) > 1e-9) && (Ie += `
Rx = ${Pt(Ye[3] * 1e3, 3)} mrad`, Ie += `
Ry = ${Pt(Ye[4] * 1e3, 3)} mrad`, Ie += `
Rz = ${Pt(Ye[5] * 1e3, 3)} mrad`)), Re.reactions) {
          const $e = Re.reactions.get(Te);
          $e && (Math.abs($e[0]) > 1e-9 || Math.abs($e[1]) > 1e-9 || Math.abs($e[2]) > 1e-9 || Math.abs($e[3]) > 1e-6 || Math.abs($e[4]) > 1e-6 || Math.abs($e[5]) > 1e-6) && (Ie += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ie += `
Fx = ${Pt($e[0] * Be)} ${Je.forceUnit}`, Ie += `
Fy = ${Pt($e[1] * Be)} ${Je.forceUnit}`, Ie += `
Fz = ${Pt($e[2] * Be)} ${Je.forceUnit}`, (Math.abs($e[3]) > 1e-6 || Math.abs($e[4]) > 1e-6 || Math.abs($e[5]) > 1e-6) && (Ie += `
Mx = ${Pt($e[3] * Be)} ${Je.forceUnit}\xB7m`, Ie += `
My = ${Pt($e[4] * Be)} ${Je.forceUnit}\xB7m`, Ie += `
Mz = ${Pt($e[5] * Be)} ${Je.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Te, info: Ie };
    }
    const mt = 5;
    let et = -1, _t = mt, Dt = "frame";
    for (let nt = 0; nt < ge.length; nt++) {
      const Ie = ge[nt];
      if (!(!Ie || Ie.length < 2)) {
        if (Ie.length === 2) {
          const Re = Ne(Ie[0]), Ye = Ne(Ie[1]);
          if (!Re || !Ye || Re.z < -1 || Re.z > 1 || Ye.z < -1 || Ye.z > 1) continue;
          const $e = Wi(se, Ce, Re.x, Re.y, Ye.x, Ye.y);
          $e < _t && (_t = $e, et = nt, Dt = "frame");
        } else if (Ie.length === 3 || Ie.length === 4) {
          const Re = [];
          let Ye = true;
          for (const $e of Ie) {
            const Oe = Ne($e);
            if (!Oe || Oe.z < -1 || Oe.z > 1) {
              Ye = false;
              break;
            }
            Re.push(Oe);
          }
          if (!Ye) continue;
          if (Gi(se, Ce, Re)) {
            const Oe = Re.reduce((at, xt) => at + xt.z, 0) / Re.length * 1e-3;
            Oe < _t && (_t = Oe, et = nt, Dt = "shell");
          }
        } else if (Ie.length === 8) {
          const Re = [];
          let Ye = true;
          for (const He of Ie) {
            const st = Ne(He);
            if (!st || st.z < -1 || st.z > 1) {
              Ye = false;
              break;
            }
            Re.push(st);
          }
          if (!Ye) continue;
          const $e = Math.min(...Re.map((He) => He.x)), Oe = Math.max(...Re.map((He) => He.x)), at = Math.min(...Re.map((He) => He.y)), xt = Math.max(...Re.map((He) => He.y));
          if (se >= $e && se <= Oe && Ce >= at && Ce <= xt) {
            const st = Re.reduce((Ct, rt) => Ct + rt.z, 0) / Re.length * 1e-3;
            st < _t && (_t = st, et = nt, Dt = "solid");
          }
        }
      }
    }
    if (et >= 0) {
      const nt = ge[et];
      let Re = `${Dt === "frame" ? "Frame" : Dt === "shell" ? "Shell" : "Solid"} ${et}`;
      const Ye = (_e2 = (_d = n.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, $e = (_g = (_f = Ye == null ? void 0 : Ye.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, et);
      if ($e) {
        $e.name && (Re += `
  \u{1F4CB} ${$e.name}`), $e.shape && (Re += `
  Shape: ${$e.shape}`);
        const Oe = /concrete|hormig|rect.*sólida/i.test($e.shape || ""), at = Oe ? 100 : 1e3, xt = Oe ? "cm" : "mm", He = (Ct) => {
          const rt = Ct * at;
          return Math.abs(rt - Math.round(rt)) < 0.05 ? `${Math.round(rt)}` : `${rt.toFixed(1)}`;
        }, st = [];
        if ($e.D != null && st.push(`D=${He($e.D)}`), $e.B != null && st.push(`B=${He($e.B)}`), $e.TF != null && st.push(`TF=${He($e.TF)}`), $e.TW != null && st.push(`TW=${He($e.TW)}`), $e.t != null && st.push(`t=${He($e.t)}`), st.length && (Re += `
  Dim: ${st.join(" ")} ${xt}`), $e.material) {
          let Ct = $e.material;
          $e.fillMaterial && (Ct += ` + FILL "${$e.fillMaterial}"`), Re += `
  Mat: ${Ct}`;
        }
      } else {
        const Oe = (_i2 = (_h = Ye == null ? void 0 : Ye.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, et), at = (_k = (_j = Ye == null ? void 0 : Ye.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, et);
        Oe ? (Re += `
  ${Oe}`, at && !Oe.includes(at) && (Re += `  (${at})`)) : at && (Re += `
  Material: ${at}`);
      }
      if (Re += `
nodos: [${nt.join(", ")}]`, Dt === "shell" && ((_l = n.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Oe = n.mesh.analyzeOutputs.rawVal, at = Yi[Je.stressUnit] ?? 1, xt = [["bendingXX", "Mxx", Be, `${Je.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Be, `${Je.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Be, `${Je.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Be, `${Je.forceUnit}/m`], ["membraneYY", "Nyy", Be, `${Je.forceUnit}/m`], ["membraneXY", "Nxy", Be, `${Je.forceUnit}/m`], ["shearX", "Qx", Be, `${Je.forceUnit}/m`], ["shearY", "Qy", Be, `${Je.forceUnit}/m`], ["vonMises", "\u03C3VM", at, Je.stressUnit], ["pressure", "p", at, Je.stressUnit]], He = [];
        for (const [st, Ct, rt, on] of xt) {
          const Bt = Oe == null ? void 0 : Oe[st];
          if (Bt && Bt instanceof Map) {
            const Kt = Bt.get(et);
            if (Kt != null) {
              if (typeof Kt == "number") He.push(`${Ct} = ${Pt(Kt * rt, 3)} ${on}`);
              else if (Array.isArray(Kt)) {
                let It = Kt[0];
                for (const rn of Kt) Math.abs(rn) > Math.abs(It) && (It = rn);
                He.push(`${Ct} = ${Pt(It * rt, 3)} ${on}`);
              }
            }
          }
        }
        He.length > 0 && (Re += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + He.slice(0, 8).join(`
`));
      }
      if (Dt === "frame" && ((_m = n.mesh) == null ? void 0 : _m.deformOutputs) && n.mesh.elementInputs) {
        const Oe = n.mesh.deformOutputs.rawVal, at = n.mesh.elementInputs.rawVal, xt = Oe == null ? void 0 : Oe.deformations;
        if (xt && nt.length === 2) {
          const He = xt.get(nt[0]), st = xt.get(nt[1]), Ct = Se[nt[0]], rt = Se[nt[1]];
          if (He && st && Ct && rt) {
            const on = rt[0] - Ct[0], Bt = rt[1] - Ct[1], Kt = rt[2] - Ct[2], It = Math.sqrt(on * on + Bt * Bt + Kt * Kt);
            if (It > 1e-9) {
              const rn = on / It, ro = Bt / It, Xt = Kt / It, gn = (st[0] - He[0]) * rn + (st[1] - He[1]) * ro + (st[2] - He[2]) * Xt, mn = ((_n = at.elasticities) == null ? void 0 : _n.get(et)) ?? 0, In = ((_o = at.areas) == null ? void 0 : _o.get(et)) ?? 0, Ln = ((_p = at.momentsOfInertiaY) == null ? void 0 : _p.get(et)) ?? 0, Gn = ((_q = at.momentsOfInertiaZ) == null ? void 0 : _q.get(et)) ?? 0, Bo = ((_r = at.torsionalConstants) == null ? void 0 : _r.get(et)) ?? 0, Yt = ((_s = at.shearModuli) == null ? void 0 : _s.get(et)) ?? mn / 2.6, Tn = mn * In * (gn / It), Rn = (st[3] - He[3]) * rn + (st[4] - He[4]) * ro + (st[5] - He[5]) * Xt, Pn = Yt * Bo * (Rn / It), Dn = st[4] - He[4], cn = st[5] - He[5], Bn = mn * Ln * Dn / It, Ut = mn * Gn * cn / It;
              Re += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Re += `
L = ${Pt(It, 3)} m`, Re += `
\u0394L = ${Pt(gn * _e, 3)} ${Je.dispUnit}`, Re += `
\u03B5 = ${Pt(gn / It, 6)}`, Math.abs(Tn) > 1e-6 && (Re += `
N \u2248 ${Pt(Tn * Be)} ${Je.forceUnit}`), Math.abs(Pn) > 1e-6 && (Re += `
T \u2248 ${Pt(Pn * Be)} ${Je.forceUnit}\xB7m`), Math.abs(Bn) > 1e-6 && (Re += `
My \u2248 ${Pt(Bn * Be)} ${Je.forceUnit}\xB7m`), Math.abs(Ut) > 1e-6 && (Re += `
Mz \u2248 ${Pt(Ut * Be)} ${Je.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Dt, idx: et, info: Re };
    }
    return null;
  }
  function q(xe, T, te) {
    var _a, _b, _c;
    if (S.visible = false, E.visible = false, I.visible = false, ee.visible = false, O.visible = false, !xe || !n.mesh) {
      H.style.display = "none", n.render();
      return;
    }
    const j = (_a = n.mesh.elements) == null ? void 0 : _a.rawVal;
    if (xe.type === "node") {
      const ge = G(xe.idx);
      if (ge) {
        const Le = n.derivedNodes.rawVal ?? [];
        let Ne = 1;
        if (Le.length >= 2) {
          let Te = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Je of Le) for (let _e = 0; _e < 3; _e++) Je[_e] < Te[_e] && (Te[_e] = Je[_e]), Je[_e] > lt[_e] && (lt[_e] = Je[_e]);
          Ne = Math.max(lt[0] - Te[0], lt[1] - Te[1], lt[2] - Te[2], 0.1);
        }
        const je = ((_b = n.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Pe = 0.021 * Ne * je;
        S.position.copy(ge), S.scale.setScalar(Pe), S.visible = true;
      }
    } else if (xe.type === "frame" && j) {
      const ge = j[xe.idx], Le = G(ge[0]), Ne = G(ge[1]);
      if (Le && Ne) {
        const je = Le.clone().add(Ne).multiplyScalar(0.5), Pe = Ne.clone().sub(Le), Te = Pe.length(), _e = n.getActiveCamera().position.distanceTo(je) * 35e-4;
        I.position.copy(je);
        const Be = new V(0, 1, 0), mt = Be.clone().cross(Pe).normalize(), et = Be.angleTo(Pe);
        I.quaternion.setFromAxisAngle(mt, et), I.scale.set(_e, Te, _e), I.visible = true;
      }
    } else if (xe.type === "shell" && j) {
      const ge = j[xe.idx], Le = [], Ne = [];
      for (const je of ge) {
        const Pe = G(je);
        if (!Pe) return;
        Le.push(Pe.x, Pe.y, Pe.z);
      }
      ge.length === 4 ? Ne.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && Ne.push(0, 1, 2), D.setAttribute("position", new Vt(Le, 3)), D.setIndex(Ne), D.computeVertexNormals(), ee.visible = true;
    } else if (xe.type === "solid" && j) {
      const ge = j[xe.idx], Le = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ne = [];
      for (const [je, Pe] of Le) {
        const Te = G(ge[je]), lt = G(ge[Pe]);
        Te && lt && Ne.push(Te.x, Te.y, Te.z, lt.x, lt.y, lt.z);
      }
      pe.setAttribute("position", new Vt(Ne, 3)), O.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      H.style.display = "none", n.render();
      return;
    }
    H.textContent = xe.info, H.style.whiteSpace = "pre-line", H.style.display = "block";
    const Ce = n.rendererElm.getBoundingClientRect(), Se = ((_c = n.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Ce;
    H.style.left = `${T - Se.left}px`, H.style.top = `${te - Se.top}px`, n.render();
  }
  let U = "", L = 0, Q = 0;
  const fe = window.__hekatanHoverDebug ?? false, we = (xe) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a, _b, _c;
      const T = B(xe.clientX, xe.clientY);
      if (fe && Q < 5) {
        const j = n.derivedNodes.rawVal, se = (_b = (_a = n.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${xe.clientX}, ${xe.clientY}) nodes=${(j == null ? void 0 : j.length) ?? 0} elems=${(se == null ? void 0 : se.length) ?? 0} hover=`, T), Q++;
      }
      const te = T ? `${T.type}:${T.idx}` : "";
      if (te !== U) U = te, q(T, xe.clientX, xe.clientY);
      else if (T) {
        const j = ((_c = n.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? n.rendererElm.getBoundingClientRect();
        H.style.left = `${xe.clientX - j.left}px`, H.style.top = `${xe.clientY - j.top}px`;
      }
    });
  };
  let Me = null;
  const W = () => {
    U = "", S.visible = false, E.visible = false, I.visible = false, ee.visible = false, O.visible = false, H.style.display = "none", n.render();
  }, be = (xe) => {
    const T = n.rendererElm.getBoundingClientRect(), te = xe.clientX - T.left, j = xe.clientY - T.top;
    (te < -2 || j < -2 || te > T.width + 2 || j > T.height + 2) && (Me && clearTimeout(Me), Me = window.setTimeout(W, 200));
  }, ce = () => {
    Me && (clearTimeout(Me), Me = null);
  };
  n.rendererElm.addEventListener("pointermove", we), n.rendererElm.addEventListener("pointerleave", be), n.rendererElm.addEventListener("pointerenter", ce);
  function Fe() {
    var _a, _b, _c;
    const xe = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    return xe === "select" || xe === "none" || !xe;
  }
  let he = null;
  n.rendererElm.addEventListener("pointerdown", (xe) => {
    xe.button === 0 && (he = { x: xe.clientX, y: xe.clientY });
  }), n.rendererElm.addEventListener("pointerup", (xe) => {
    if (xe.button !== 0 || !he) return;
    const T = xe.clientX - he.x, te = xe.clientY - he.y;
    if (he = null, T * T + te * te > 9 || !Fe()) return;
    const j = B(xe.clientX, xe.clientY);
    j ? (vt({ type: j.type, idx: j.idx }, xe.shiftKey), Qe()) : Mt();
  }), window.addEventListener("keydown", (xe) => {
    if (xe.key !== "Escape" || !ne.length) return;
    const T = document.activeElement, te = !!T && (T.id === "hk3-cmd-input" || T.id === "hk-dyn-input") && T.value === "";
    T && (T.tagName === "INPUT" || T.tagName === "TEXTAREA" || T.isContentEditable) && !te || Mt();
  }, { capture: true });
  function Ve() {
    for (const xe of J.children.slice()) {
      J.remove(xe);
      const T = xe.geometry;
      T && T !== g && T !== Y && T.dispose();
    }
  }
  const ve = (xe) => {
    var _a;
    const T = n.getActiveCamera(), te = ((_a = n.rendererElm) == null ? void 0 : _a.clientHeight) || 700;
    return T.isOrthographicCamera ? (T.top - T.bottom) / (T.zoom || 1) / te : 2 * T.position.distanceTo(xe) * Math.tan((T.fov || 50) * Math.PI / 180 / 2) / te;
  };
  function We(xe, T) {
    var _a, _b;
    const te = (_b = (_a = n.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
    if (xe.type === "node") {
      const j = G(xe.idx);
      if (!j) return;
      const se = new it(g, N);
      se.position.copy(j), se.scale.setScalar(Math.max(1e-4, 7 * ve(j))), se.renderOrder = 101, J.add(se);
    } else if (xe.type === "frame" && te) {
      const j = te[xe.idx], se = G(j[0]), Ce = G(j[1]);
      if (!se || !Ce) return;
      const Se = se.clone().add(Ce).multiplyScalar(0.5), ge = Ce.clone().sub(se), Le = ge.length(), Ne = n.getActiveCamera().position.distanceTo(Se), je = new it(Y, re);
      je.position.copy(Se);
      const Pe = new V(0, 1, 0);
      je.quaternion.setFromAxisAngle(Pe.clone().cross(ge).normalize(), Pe.angleTo(ge)), je.scale.set(Ne * 35e-4, Le, Ne * 35e-4), je.renderOrder = 101, J.add(je);
    } else if (xe.type === "shell" && te) {
      const j = te[xe.idx], se = [], Ce = [];
      for (const Le of j) {
        const Ne = G(Le);
        if (!Ne) return;
        se.push(Ne.x, Ne.y, Ne.z);
      }
      j.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : j.length === 3 && Ce.push(0, 1, 2);
      const Se = new Ae();
      Se.setAttribute("position", new Vt(se, 3)), Se.setIndex(Ce), Se.computeVertexNormals();
      const ge = new it(Se, ie);
      ge.renderOrder = 101, J.add(ge);
    } else if (xe.type === "solid" && te) {
      const j = te[xe.idx], se = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Le, Ne] of se) {
        const je = G(j[Le]), Pe = G(j[Ne]);
        je && Pe && Ce.push(je.x, je.y, je.z, Pe.x, Pe.y, Pe.z);
      }
      const Se = new Ae();
      Se.setAttribute("position", new Vt(Ce, 3));
      const ge = new Jt(Se, oe);
      ge.renderOrder = 101, J.add(ge);
    }
  }
  function Qe() {
    if (Ve(), !ne.length || !n.mesh) {
      n.render();
      return;
    }
    const xe = n.derivedNodes.rawVal ?? [];
    if (xe.length >= 2) {
      const T = [1 / 0, 1 / 0, 1 / 0], te = [-1 / 0, -1 / 0, -1 / 0];
      for (const j of xe) for (let se = 0; se < 3; se++) j[se] < T[se] && (T[se] = j[se]), j[se] > te[se] && (te[se] = j[se]);
      Math.max(te[0] - T[0], te[1] - T[1], te[2] - T[2], 0.1);
    }
    for (const T of ne) We(T);
    n.render();
  }
  function vt(xe, T) {
    const te = ne.findIndex((j) => j.type === xe.type && j.idx === xe.idx);
    te >= 0 ? ne.splice(te, 1) : T || ne.push(xe), ne.length && ne[ne.length - 1];
  }
  function Mt() {
    ne.length = 0, Qe();
  }
  return le.derive(() => {
    n.derivedNodes.val, ne.length && Qe();
  }), m;
}
function Wi(n, m, g, _, S, z) {
  const F = S - g, E = z - _, C = F * F + E * E;
  if (C < 1e-9) {
    const me = n - g, O = m - _;
    return Math.sqrt(me * me + O * O);
  }
  let I = ((n - g) * F + (m - _) * E) / C;
  I = Math.max(0, Math.min(1, I));
  const D = g + I * F, R = _ + I * E, ee = n - D, pe = m - R;
  return Math.sqrt(ee * ee + pe * pe);
}
function Gi(n, m, g) {
  let _ = false;
  for (let S = 0, z = g.length - 1; S < g.length; z = S++) {
    const F = g[S].x, E = g[S].y, C = g[z].x, I = g[z].y;
    E > m != I > m && n < (C - F) * (m - E) / (I - E + 1e-12) + F && (_ = !_);
  }
  return _;
}
const Hi = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Ji = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Sn = 1e-3;
function so(n, m) {
  return m === "XZ" ? { u: n[0], v: n[2], fuera: n[1] } : m === "YZ" ? { u: n[1], v: n[2], fuera: n[0] } : { u: n[0], v: n[1], fuera: n[2] };
}
function Qi(n, m) {
  const g = Math.abs(m[0] - n[0]);
  return Math.abs(m[1] - n[1]) < Sn ? { plano: "XZ", en: n[1] } : g < Sn ? { plano: "YZ", en: n[0] } : { plano: "XY", en: n[2] };
}
function Oi(n, m) {
  var _a, _b;
  let g = null, _ = { plano: "XZ", en: 0 };
  const S = () => {
    var _a2, _b2;
    const Y = ((_a2 = m == null ? void 0 : m.frameResults) == null ? void 0 : _a2.rawVal) ?? ((_b2 = m == null ? void 0 : m.frameResults) == null ? void 0 : _b2.val);
    return !Y || Y === "none" ? null : String(Y).replace(/^contour:/, "");
  }, z = (Y) => {
    var _a2, _b2;
    const ie = ((_a2 = n.nodes) == null ? void 0 : _a2.rawVal) ?? [], oe = ((_b2 = n.elements) == null ? void 0 : _b2.rawVal) ?? [], ne = /* @__PURE__ */ new Set();
    for (const J of oe) {
      if (J.length !== 2) continue;
      const H = ie[J[0]], G = ie[J[1]];
      if (!H || !G) continue;
      const B = so(H, Y), q = so(G, Y);
      Math.abs(B.fuera - q.fuera) < Sn && ne.add(Math.round(B.fuera * 1e3) / 1e3);
    }
    return [...ne].sort((J, H) => J - H);
  };
  function F(Y) {
    var _a2, _b2;
    if (Y == null ? void 0 : Y.plano) _ = { plano: Y.plano, en: Y.en ?? z(Y.plano)[0] ?? 0 };
    else {
      const oe = [...window.__hekatanModelSelection ?? []].reverse().find((H) => H.type === "frame"), ne = ((_a2 = n.nodes) == null ? void 0 : _a2.rawVal) ?? [], J = ((_b2 = n.elements) == null ? void 0 : _b2.rawVal) ?? [];
      oe && J[oe.idx] && ne[J[oe.idx][0]] && ne[J[oe.idx][1]] ? _ = Qi(ne[J[oe.idx][0]], ne[J[oe.idx][1]]) : _ = { plano: "XZ", en: z("XZ")[0] ?? 0 };
    }
    g || E(), g.hidden = false, C();
  }
  function E() {
    g = document.createElement("div"), g.id = "hk-diagrama-2d", g.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), g.innerHTML = `
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
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(g), g.querySelector(".hk-d2-x").addEventListener("click", () => {
      g.hidden = true;
    });
    const Y = g.querySelector(".hk-d2-plano"), ie = g.querySelector(".hk-d2-en");
    Y.addEventListener("change", () => {
      _ = { plano: Y.value, en: z(Y.value)[0] ?? 0 }, C();
    }), ie.addEventListener("change", () => {
      _.en = Number(ie.value), C();
    });
    const oe = (H) => {
      const G = z(_.plano), B = G.findIndex((U) => Math.abs(U - _.en) < Sn), q = Math.max(0, Math.min(G.length - 1, (B < 0 ? 0 : B) + H));
      G.length && (_.en = G[q], C());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => oe(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => oe(1));
    const ne = g.querySelector(".hk-d2-bar");
    let J = null;
    ne.addEventListener("pointerdown", (H) => {
      if (H.target.closest("select,button")) return;
      const G = g.getBoundingClientRect();
      J = { x: H.clientX, y: H.clientY, l: G.left, t: G.top }, g.style.transform = "none", g.style.left = G.left + "px", g.style.top = G.top + "px";
    }), window.addEventListener("pointermove", (H) => {
      !J || !g || (g.style.left = J.l + H.clientX - J.x + "px", g.style.top = J.t + H.clientY - J.y + "px");
    }), window.addEventListener("pointerup", () => {
      J = null;
    }), new ResizeObserver(() => {
      g && !g.hidden && C();
    }).observe(g);
  }
  function C() {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (!g || g.hidden) return;
    const Y = new Set(R && !R.hidden && ee >= 0 ? me(ee) : []), ie = g.querySelector(".hk-d2-svg"), oe = g.querySelector(".hk-d2-tit"), ne = g.querySelector(".hk-d2-pie"), J = g.querySelector(".hk-d2-plano"), H = g.querySelector(".hk-d2-en");
    J.value = _.plano;
    const G = z(_.plano), B = _.plano === "XZ" ? "y" : _.plano === "YZ" ? "x" : "z", q = _.plano === "XY" ? "Planta" : "P\xF3rtico";
    H.innerHTML = G.map((_e2, Be) => `<option value="${_e2}" ${Math.abs(_e2 - _.en) < Sn ? "selected" : ""}>${q} ${Be + 1} \xB7 ${B} = ${_e2.toFixed(2)} m</option>`).join("");
    const U = S(), L = ((_a2 = n.nodes) == null ? void 0 : _a2.rawVal) ?? [], Q = ((_b2 = n.elements) == null ? void 0 : _b2.rawVal) ?? [], fe = U ? (_d = (_c = n.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[U] : null;
    ie.innerHTML = "";
    const we = ie.clientWidth || 880, Me = ie.clientHeight || 480, W = [];
    if (Q.forEach((_e2, Be) => {
      if (_e2.length !== 2) return;
      const mt = L[_e2[0]], et = L[_e2[1]];
      if (!mt || !et) return;
      const _t = so(mt, _.plano), Dt = so(et, _.plano);
      Math.abs(_t.fuera - _.en) < Sn && Math.abs(Dt.fuera - _.en) < Sn && W.push({ i: Be, a: _t, b: Dt });
    }), !W.length) {
      ne.textContent = "No hay barras en este plano.", oe.textContent = "";
      return;
    }
    let be = 1 / 0, ce = -1 / 0, Fe = 1 / 0, he = -1 / 0;
    for (const _e2 of W) for (const Be of [_e2.a, _e2.b]) be = Math.min(be, Be.u), ce = Math.max(ce, Be.u), Fe = Math.min(Fe, Be.v), he = Math.max(he, Be.v);
    const Ve = ce - be || 1, ve = he - Fe || 1, We = 0.12 * Math.max(Ve, ve), Qe = 46, vt = Math.min((we - 2 * Qe) / (Ve + 2 * We), (Me - 2 * Qe) / (ve + 2 * We)), Mt = (we - Ve * vt) / 2, xe = (Me - ve * vt) / 2, T = (_e2) => Mt + (_e2 - be) * vt, te = (_e2) => Me - (xe + (_e2 - Fe) * vt), j = "http://www.w3.org/2000/svg", se = (_e2, Be, mt) => {
      const et = document.createElementNS(j, _e2);
      for (const _t in Be) et.setAttribute(_t, String(Be[_t]));
      return mt != null && (et.textContent = mt), ie.appendChild(et), et;
    }, Ce = /* @__PURE__ */ new Map();
    for (const _e2 of W) {
      const Be = ((_h = (_g = (_f = (_e = n.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, _e2.i)) ?? 0, mt = so(xa(U ?? "normals", ya(L[Q[_e2.i][0]], L[Q[_e2.i][1]], Be)), _.plano), et = Math.hypot(mt.u, mt.v);
      Ce.set(_e2.i, et > 0.3 ? [mt.u / et, -mt.v / et] : null);
    }
    const Se = W.filter((_e2) => !Ce.get(_e2.i)).length;
    let ge = 0;
    if (fe) for (const _e2 of W) {
      if (!Ce.get(_e2.i)) continue;
      const Be = fe instanceof Map ? fe.get(_e2.i) : fe[_e2.i];
      Be && (ge = Math.max(ge, Math.abs(Be[0] ?? 0), Math.abs(Be[1] ?? 0)));
    }
    const Le = 0.12 * Math.max(Ve, ve) * vt, Ne = ge > 0 ? Le / ge : 0, je = U === "bendingsY" || U === "bendingsZ", Pe = (_e2) => Math.abs(_e2) >= 100 ? _e2.toFixed(1) : Math.abs(_e2) >= 10 ? _e2.toFixed(2) : _e2.toFixed(3), Te = [];
    for (const _e2 of W) {
      const Be = T(_e2.a.u), mt = te(_e2.a.v), et = T(_e2.b.u), _t = te(_e2.b.v), Dt = Ce.get(_e2.i), [nt, Ie] = Dt ?? [0, 0], Re = fe && Dt ? fe instanceof Map ? fe.get(_e2.i) : fe[_e2.i] : null, [Ye, $e] = Re ? hs(U, Re) : [0, 0];
      if (Re && Ne > 0) {
        const He = [Be + nt * Ye * Ne * 1, mt + Ie * Ye * Ne * 1], st = [et + nt * $e * Ne * 1, _t + Ie * $e * Ne * 1], on = Ye + $e >= 0 ? "#3fa7d6" : "#d9534f";
        se("polygon", { points: `${Be},${mt} ${He[0]},${He[1]} ${st[0]},${st[1]} ${et},${_t}`, fill: on, "fill-opacity": 0.38, stroke: on, "stroke-width": 1.2 }), Te.push({ x: He[0] + nt * 12, y: He[1] + Ie * 12, t: Pe(Ye), peso: Math.abs(Ye) }), Te.push({ x: st[0] + nt * 12, y: st[1] + Ie * 12, t: Pe($e), peso: Math.abs($e) });
      }
      se("line", { x1: Be, y1: mt, x2: et, y2: _t, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), Y.has(_e2.i) && se("line", { x1: Be, y1: mt, x2: et, y2: _t, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const Oe = se("line", { x1: Be, y1: mt, x2: et, y2: _t, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      Oe.addEventListener("click", () => O(_e2.i));
      const at = document.createElementNS(j, "title");
      at.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Oe.appendChild(at);
    }
    for (const _e2 of W) for (const Be of [_e2.a, _e2.b]) _.plano !== "XY" && Math.abs(Be.v - Fe) < Sn && se("rect", { x: T(Be.u) - 6, y: te(Be.v), width: 12, height: 7, fill: "#b03a3a" });
    const lt = [];
    Te.sort((_e2, Be) => Be.peso - _e2.peso);
    for (const _e2 of Te) _e2.peso < 0.02 * ge || lt.some((Be) => Math.hypot(Be.x - _e2.x, Be.y - _e2.y) < 34) || (lt.push(_e2), se("text", { x: _e2.x, y: _e2.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, _e2.t));
    const Je = U ? Hi[U] ?? U : "sin resultado";
    oe.textContent = `${Je} \xB7 ${_.plano === "XY" ? "planta" : "alzado"} ${_.plano} en ${B} = ${_.en.toFixed(2)} m`, ne.textContent = U ? `${W.length} barras en el plano \xB7 m\xE1ximo ${Pe(ge)} ${Ji[U] ?? ""}` + (je ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (Se ? ` \xB7 ${Se} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const I = () => {
    try {
      C();
    } catch {
    }
  };
  (m == null ? void 0 : m.frameResults) && ((_b = (_a = window.van) == null ? void 0 : _a.derive) == null ? void 0 : _b.call(_a, () => {
    m.frameResults.val, I();
  }));
  let D = null;
  setInterval(() => {
    var _a2, _b2;
    const Y = (_a2 = n.analyzeOutputs) == null ? void 0 : _a2.rawVal, ie = (_b2 = m == null ? void 0 : m.frameResults) == null ? void 0 : _b2.rawVal, oe = [Y, ie];
    if (!(D && D[0] === Y && D[1] === ie)) {
      D = oe, I();
      try {
        re();
      } catch {
      }
    }
  }, 400);
  let R = null, ee = -1, pe = "12";
  function me(Y) {
    var _a2, _b2;
    const ie = ((_a2 = n.nodes) == null ? void 0 : _a2.rawVal) ?? [], oe = ((_b2 = n.elements) == null ? void 0 : _b2.rawVal) ?? [], ne = /* @__PURE__ */ new Map();
    oe.forEach((B, q) => {
      if (B.length === 2) for (const U of B) ne.has(U) || ne.set(U, []), ne.get(U).push(q);
    });
    const J = (B) => {
      const q = ie[oe[B][0]], U = ie[oe[B][1]], L = [U[0] - q[0], U[1] - q[1], U[2] - q[2]], Q = Math.hypot(L[0], L[1], L[2]) || 1;
      return L.map((fe) => fe / Q);
    }, H = (B, q) => {
      const U = J(B), L = J(q);
      return Math.abs(U[0] * L[0] + U[1] * L[1] + U[2] * L[2]) > 0.9999;
    }, G = [Y];
    for (const B of [0, 1]) {
      let q = Y, U = oe[Y][B];
      for (let L = 0; L < 500; L++) {
        const Q = (ne.get(U) ?? []).filter((we) => we !== q);
        if (Q.length !== 1 || !H(q, Q[0])) break;
        const fe = Q[0];
        B === 0 ? G.unshift(fe) : G.push(fe), U = oe[fe][0] === U ? oe[fe][1] : oe[fe][0], q = fe;
      }
    }
    return G;
  }
  function O(Y) {
    if (Y == null) {
      const oe = [...window.__hekatanModelSelection ?? []].reverse().find((ne) => ne.type === "frame");
      if (!oe) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      Y = oe.idx;
    }
    ee = Y, R || (R = document.createElement("div"), R.id = "hk-diagrama-barra", R.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), R.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(R), R.querySelector(".hk-b-x").addEventListener("click", () => {
      R.hidden = true, N(), C();
    }), R.querySelector(".hk-b-pl").addEventListener("change", (ie) => {
      pe = ie.target.value, re();
    })), R.hidden = false, N(), re(), C();
  }
  function N() {
    if (!g || !R) return;
    const Y = window.innerWidth, ie = Math.min(560, Math.round(Y * 0.4));
    R.style.width = ie + "px", !R.hidden && !g.hidden ? (g.style.transform = "none", g.style.left = "12px", g.style.width = Y - ie - 36 + "px", R.style.top = g.getBoundingClientRect().top + "px") : g.hidden || (g.style.left = "50%", g.style.transform = "translateX(-50%)", g.style.width = "min(900px,92vw)");
  }
  function re() {
    var _a2, _b2, _c;
    if (!R || R.hidden || ee < 0) return;
    const Y = ((_a2 = n.nodes) == null ? void 0 : _a2.rawVal) ?? [], ie = ((_b2 = n.elements) == null ? void 0 : _b2.rawVal) ?? [], oe = ((_c = n.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!ie[ee]) return;
    const ne = me(ee), J = [];
    let H = 0, G = -1;
    ne.forEach((ce, Fe) => {
      const [he, Ve] = ie[ce], ve = Fe === 0 ? ne.length > 1 && ie[ne[1]].includes(he) : he !== G, We = ve ? Ve : he, Qe = ve ? he : Ve, vt = Math.hypot(Y[Qe][0] - Y[We][0], Y[Qe][1] - Y[We][1], Y[Qe][2] - Y[We][2]);
      J.push({ x: H, e: ce, fin: ve ? 1 : 0 }), H += vt, J.push({ x: H, e: ce, fin: ve ? 0 : 1 }), G = Qe;
    });
    const B = H, q = (ce, Fe) => {
      const he = oe[ce], Ve = he ? he instanceof Map ? he.get(Fe.e) : he[Fe.e] : null;
      return Ve ? hs(ce, Ve)[Fe.fin] : 0;
    }, U = Y[ie[ne[0]][0]], L = (ce) => ce.toFixed(2);
    R.querySelector(".hk-b-tit").textContent = "L = " + B.toFixed(2) + " m \xB7 " + ne.length + " tramo(s) \xB7 desde (" + L(U[0]) + ", " + L(U[1]) + ", " + L(U[2]) + ")";
    const Q = pe === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], fe = R.querySelector(".hk-b-cuerpo");
    fe.innerHTML = "";
    const we = Math.max(300, fe.clientWidth), Me = 124, W = 46, be = (Me - 14) / 2;
    for (const [ce, Fe, he, Ve] of Q) {
      const ve = J.map((ge) => q(ce, ge)), We = Math.max(...ve), Qe = Math.min(...ve), vt = Math.max(Math.abs(We), Math.abs(Qe)) || 1, Mt = (ge) => W + ge / (B || 1) * (we - 2 * W), xe = (ge) => be + (Ve ? 1 : -1) * (ge / vt) * (be - 16), T = (ge) => Math.abs(ge) >= 100 ? ge.toFixed(1) : Math.abs(ge) >= 10 ? ge.toFixed(2) : ge.toFixed(3);
      let te = Mt(0) + "," + be + " ";
      J.forEach((ge, Le) => {
        te += Mt(ge.x) + "," + xe(ve[Le]) + " ";
      }), te += Mt(B) + "," + be;
      const j = ve.indexOf(We), se = ve.indexOf(Qe), Ce = (ge, Le) => {
        const Ne = xe(ve[ge]) + (xe(ve[ge]) < be ? -5 : 13);
        return '<text x="' + Mt(J[ge].x) + '" y="' + Ne + '" text-anchor="middle" fill="' + Le + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + T(ve[ge]) + "</text>";
      }, Se = Ve ? "#d9534f" : "#3fa7d6";
      fe.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Fe + ' <span style="color:#6f7d90;font-weight:400">(' + he + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + T(We) + " \xB7 m\xEDn " + T(Qe) + (Ve ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + we + '" height="' + Me + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + W + '" y1="' + be + '" x2="' + (we - W) + '" y2="' + be + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + te + '" fill="' + Se + '" fill-opacity=".35" stroke="' + Se + '" stroke-width="1.4"/>' + Ce(0, "#f2f5fa") + Ce(J.length - 1, "#f2f5fa") + (j > 0 && j < J.length - 1 ? Ce(j, "#8fd3ff") : "") + (se > 0 && se < J.length - 1 && se !== j ? Ce(se, "#ff9f9a") : "") + '<text x="' + W + '" y="' + (Me - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (we - W) + '" y="' + (Me - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + B.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = O, window.__hekatanDiagrama2D = F, { abrir: F, abrirBarra: O };
}
function ia(n, m = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(m)), setTimeout(() => {
    le.derive(() => {
      Do.val, g.style.background = ci();
    });
  });
  const _ = document.createElement("div");
  _.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(_), setTimeout(() => {
    le.derive(() => {
      _.textContent = ms.val ? `[${ms.val}]` : "";
    });
  });
  const S = Array.from({ length: m + 1 }, (C, I) => I / m).reverse();
  let z, F;
  S.forEach((C, I) => {
    z = document.createElement("div"), z.id = `marker-${I}`, z.className = "marker", z.style.marginTop = I == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", F = document.createElement("p"), F.id = `marker-text-${I}`, z.append(F), g.append(z);
  });
  const E = [];
  return g.querySelectorAll("p").forEach((C) => E.push(C)), setTimeout(() => {
    le.derive(() => {
      S.forEach((C, I) => {
        const D = E[I];
        D && (D.innerText = ji(n.val, C).toString());
      });
    });
  }), g;
}
function ji(n, m) {
  const g = lo.val;
  if (g) return la(g[0] + m * (g[1] - g[0]));
  const _ = n.filter((F) => Number.isFinite(F));
  if (_.length === 0) return "0";
  const [S, z] = ws(_);
  return la(S + m * (z - S));
}
function la(n) {
  if (!Number.isFinite(n)) return "\u2014";
  if (n === 0) return "0";
  const m = Math.abs(n);
  return m < 1e-3 || m >= 1e5 ? n.toExponential(2) : n.toPrecision(3);
}
function ul({ mesh: n, settingsObj: m, drawingObj: g, objects3D: _, solids: S }) {
  ii.DEFAULT_UP = new V(0, 0, 1);
  const z = document.createElement("div"), F = new ni(), E = new oi(45, 1, 0.1, 2 * 1e6), C = new si(-10, 10, 10, -10, -1e3, 2e6);
  let I = E;
  const D = new ai({ antialias: true });
  D.localClippingEnabled = true;
  const R = new na(E, D.domElement);
  R.enableDamping = true, R.dampingFactor = 0.1, R.screenSpacePanning = true, R.zoomSpeed = 0.8, R.panSpeed = 1.2, R.rotateSpeed = 0.9, R.keyPanSpeed = 12, R.listenToKeyEvents(window), R.touches = { ONE: Fo.ROTATE, TWO: Fo.DOLLY_PAN }, D.domElement.addEventListener("wheel", (T) => {
    if (!T.ctrlKey && Math.abs(T.deltaX) > Math.abs(T.deltaY) * 1.5) {
      T.preventDefault();
      const te = R.target, j = new V().subVectors(E.position, te), se = new V();
      se.crossVectors(E.up, j).normalize();
      const Se = j.length() * 1e-3 * R.panSpeed;
      te.addScaledVector(se, T.deltaX * Se), E.position.addScaledVector(se, T.deltaX * Se), R.update();
    }
  }, { passive: false });
  const ee = new rs(new V(-1, 0, 0), 0), pe = new rs(new V(0, -1, 0), 0), me = new rs(new V(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function O() {
    const T = window.__hekatanClip, te = [];
    T.enableX && (ee.normal.set(T.invertX ? 1 : -1, 0, 0), ee.constant = T.invertX ? -T.posX : T.posX, te.push(ee)), T.enableY && (pe.normal.set(0, T.invertY ? 1 : -1, 0), pe.constant = T.invertY ? -T.posY : T.posY, te.push(pe)), T.enableZ && (me.normal.set(0, 0, T.invertZ ? 1 : -1), me.constant = T.invertZ ? -T.posZ : T.posZ, te.push(me)), D.clippingPlanes = te, F.traverse((se) => {
      const Ce = se;
      if (Ce.material) {
        const Se = Array.isArray(Ce.material) ? Ce.material : [Ce.material];
        for (const ge of Se) ge.clippingPlanes = te, ge.needsUpdate = true;
      }
    });
    const j = window.__hekatanPanes ?? [];
    for (const se of j) try {
      se && typeof se.refresh == "function" && se.refresh();
    } catch {
    }
    D.render(F, I);
  }
  O(), window.__hekatanClipApply = O;
  const N = pi(m), re = le.derive(() => Math.pow(10, N.displayScale.val / 10)), Y = el(n, N), ie = () => {
    const T = [];
    return N.gridXY.rawVal && T.push("xy"), N.gridXZ.rawVal && T.push("xz"), N.gridYZ.rawVal && T.push("yz"), T;
  }, oe = () => {
    const T = N.gridStep.rawVal, te = Math.max(T, N.gridMajor.rawVal);
    return { planes: ie(), majorStep: te, minorStep: T };
  };
  let ne = ds(N.gridSize.rawVal, oe());
  ne.visible = N.gridVisible.rawVal, window.__hekatanSnap2D = N.cursorSnap.rawVal;
  const J = () => {
    const T = Math.max(0, Math.min(1, N.gridOpacity.rawVal));
    ne.traverse((te) => {
      const j = te.material;
      if (!j || !("opacity" in j)) return;
      const se = te.name ?? "";
      let Ce = 0.55;
      se.includes("border") ? Ce = 1 : se.includes("major") && (Ce = 0.95), j.opacity = T * Ce;
    });
  };
  J(), z.appendChild(ui(N, n, S)), z.setAttribute("id", "viewer"), z.appendChild(D.domElement), D.setPixelRatio(window.devicePixelRatio);
  const H = $n();
  D.setClearColor(H.background, 1);
  const G = N.gridSize.rawVal, B = G * 0.5 + G * 0.5 / Math.tan(45 * 0.5);
  E.position.set(0, 0, B), E.up.set(0, 1, 0), R.target.set(0, 0, 0), R.minDistance = 0.1, R.maxDistance = 1e4, z.__settings = N, R.zoomSpeed = 1, R._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, R.update();
  let q = sa(N.gridSize.rawVal, N.flipAxes.rawVal);
  F.add(ne, q), le.derive(() => {
    window.__hekatanGridPlaneXY = N.gridXY.val, window.__hekatanGridPlaneXZ = N.gridXZ.val, window.__hekatanGridPlaneYZ = N.gridYZ.val;
  });
  let U = true;
  le.derive(() => {
    const T = N.gridVisible.val;
    if (U) {
      U = false;
      return;
    }
    ne.visible = T, ce();
  });
  let L = true;
  le.derive(() => {
    if (N.gridOpacity.val, L) {
      L = false;
      return;
    }
    J(), ce();
  }), le.derive(() => {
    const T = N.cursorSnap.val;
    window.__hekatanSnap2D = T;
  });
  let Q = true;
  le.derive(() => {
    var _a, _b, _c;
    const T = N.gridSize.val, te = N.flipAxes.val;
    if (N.gridXY.val, N.gridXZ.val, N.gridYZ.val, N.gridStep.val, N.gridMajor.val, Q) {
      Q = false;
      return;
    }
    F.remove(ne), (_a = ne.traverse) == null ? void 0 : _a.call(ne, (Se) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), ne = ds(T, oe()), ne.visible = N.gridVisible.rawVal, F.add(ne), J(), F.remove(q), q.traverse((Se) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), q = sa(T, te), F.add(q);
    const j = T * 0.5 + T * 0.5 / Math.tan(45 * 0.5);
    E.position.distanceTo(R.target);
    const se = Math.abs(E.position.x) < 0.1 && Math.abs(E.position.y) < 0.1 && E.position.z > 0;
    (((_b = n == null ? void 0 : n.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = n == null ? void 0 : n.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (se ? E.position.set(0, 0, j) : E.position.set(0.5 * T, -j, 0.5 * T), R.target.set(0, 0, 0)), R.minDistance = Math.max(0.05, T * 0.01), R.maxDistance = Math.max(50, T * 50), R.update(), ce();
  }), new ResizeObserver((T) => {
    var _a, _b;
    for (const te of T) {
      const j = (_a = te.target) == null ? void 0 : _a.clientWidth, se = (_b = te.target) == null ? void 0 : _b.clientHeight;
      if (j === 0 || se === 0) continue;
      const Se = (we ? j / 2 : j) / se;
      E.aspect = Se, E.updateProjectionMatrix();
      const ge = C.top;
      if (C.left = -ge * Se, C.right = ge * Se, C.updateProjectionMatrix(), Me && Me.isPerspectiveCamera) Me.aspect = Se, Me.updateProjectionMatrix();
      else if (Me && Me.isOrthographicCamera) {
        const Le = Me, Ne = Le.top;
        Le.left = -Ne * Se, Le.right = Ne * Se, Le.updateProjectionMatrix();
      }
      D.setSize(j, se), ce();
    }
  }).observe(z), R.addEventListener("change", ce), le.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = n == null ? void 0 : n.nodes) == null ? void 0 : _a.val, (_b = n == null ? void 0 : n.elements) == null ? void 0 : _b.val, (_c = n == null ? void 0 : n.nodeInputs) == null ? void 0 : _c.val, (_d = n == null ? void 0 : n.elementInputs) == null ? void 0 : _d.val, (_e = n == null ? void 0 : n.deformOutputs) == null ? void 0 : _e.val, (_f = n == null ? void 0 : n.analyzeOutputs) == null ? void 0 : _f.val, N.displayScale.val, N.nodes.val, N.elements.val, (_g = N.edges) == null ? void 0 : _g.val, N.elemColumns.val, N.elemBeams.val, N.nodesIndexes.val, N.elementsIndexes.val, N.orientations.val, N.sections.val, N.secColumns.val, N.secBeams.val, N.secFloor.val, N.supports.val, N.loads.val, N.deformedShape.val, N.nodeResults.val, N.frameResults.val, N.shellResults.val, (_h = N.solidResults) == null ? void 0 : _h.val, (_i2 = N.extruded) == null ? void 0 : _i2.val, setTimeout(ce);
  });
  let we = false, Me = null, W = null, be = false;
  function ce() {
    const T = z.clientWidth || 1, te = z.clientHeight || 1;
    if (!we || !Me) {
      D.setScissorTest(false), D.setViewport(0, 0, T, te), D.render(F, I);
      return;
    }
    const j = T / 2;
    D.setScissorTest(true), D.setViewport(0, 0, j, te), D.setScissor(0, 0, j, te), D.render(F, I), D.setViewport(j, 0, j, te), D.setScissor(j, 0, j, te), D.render(F, Me), D.setScissorTest(false);
  }
  function Fe(T) {
    I = T, R.object = T, R.update(), ce();
  }
  function he(T, te) {
    we = T, te && (Me = te);
    const j = z.clientWidth || 1, se = z.clientHeight || 1, Se = (T ? j / 2 : j) / se;
    E.isPerspectiveCamera && (E.aspect = Se, E.updateProjectionMatrix());
    const ge = C.top;
    if (C.left = -ge * Se, C.right = ge * Se, C.updateProjectionMatrix(), T && Me) {
      if (W ? (W.object = Me, W.update()) : (W = new na(Me, D.domElement), W.enableDamping = true, W.dampingFactor = 0.1, W.screenSpacePanning = true, W.zoomSpeed = 0.8, W.panSpeed = 1.2, W.rotateSpeed = 0.9, W.touches = { ONE: Fo.ROTATE, TWO: Fo.DOLLY_PAN }, W.target.copy(R.target), W.addEventListener("change", ce), W.enabled = false), !be) {
        const Le = (Ne) => {
          if (!we || !W) return;
          const je = D.domElement.getBoundingClientRect(), Pe = Ne.clientX - je.left, Te = je.width / 2, lt = Pe >= Te;
          R.enabled = !lt, W.enabled = lt;
        };
        D.domElement.addEventListener("pointerdown", Le, true), D.domElement.addEventListener("wheel", Le, { capture: true, passive: true }), be = true;
      }
    } else T || (R.enabled = true, W && (W.enabled = false));
    z.__splitMode = T, window.__hekatanSplitMode = T, window.__hekatanSplitCamera = T ? Me : null, ce();
  }
  if (n) {
    F.add(fi(N, Y, re), li(n, N, Y), wi(N, Y, re), yi(n, N, Y, re), hi(n, N, Y, re), mi(n, N, Y, re), vi(n, N, Y, re), bi(n, N, Y, re), Pi(n, N, Y), Fi(n, N, Y, re), Ci(n, N, Y, re)), window.__hekatanDiagrama2D || (Oi(n, N), D.domElement.addEventListener("dblclick", () => {
      var _a;
      const Le = (_a = N.frameResults) == null ? void 0 : _a.rawVal;
      !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((je) => je.type === "frame") || setTimeout(() => {
        var _a2;
        return (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }, 60);
    }));
    const T = Ki({ scene: F, rendererElm: D.domElement, getActiveCamera: () => I, derivedNodes: Y, derivedDisplayScale: re, mesh: n, settings: N, render: ce });
    F.add(T);
    const te = il(n, N), j = $i(n, N, Y, te), se = ia(te);
    F.add(j), z.appendChild(se);
    const Ce = Di(n, N, Y);
    F.add(Ce);
    const Se = Ce.__colorMapValues, ge = ia(Se);
    ge.id = "frame-legend", z.appendChild(ge), le.derive(() => {
      var _a;
      const Le = N.shellResults.val != "none", Ne = (((_a = N.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", je = Le || Ne, Pe = N.frameResults.val.startsWith("contour:"), Te = te.val.some((lt) => Number.isFinite(lt));
      se.hidden = !je || !Te, j.visible = je, ge.hidden = !Pe;
    });
  }
  if (S) {
    const T = new ua(16777215, 0.5);
    F.add(T);
    const te = new To(16777215, 0.5);
    te.position.set(30, 25, -10), te.shadow.mapSize.width = 1024, te.shadow.mapSize.height = 1024, F.add(te);
    const j = 10;
    te.shadow.camera.left = -j, te.shadow.camera.right = j, te.shadow.camera.top = j, te.shadow.camera.bottom = -j, te.shadow.camera.far = 1e3;
    const se = new To(16777215, 0.5);
    se.color.setHSL(11, 43, 96), se.position.set(-10, 0, 30), F.add(se), le.derive(() => {
      (S == null ? void 0 : S.val.length) && (F.remove(...S.oldVal), F.add(...S.rawVal), ce());
    }), le.derive(() => {
      S.rawVal.forEach((Ce) => Ce.visible = N.solids.val), ce();
    });
  }
  if (_) {
    const T = [], te = (se) => {
      var _a;
      return ((_a = se == null ? void 0 : se.userData) == null ? void 0 : _a.isCota) ? N.showCotas.val : N.custom3D.val;
    }, j = () => {
      for (const se of T) se.visible = te(se);
      ce();
    };
    le.derive(() => {
      const se = _.val;
      T.length && (F.remove(...T), T.length = 0), se.length && (F.add(...se), T.push(...se), j(), D.clippingPlanes.length && O()), ce();
    }), le.derive(() => {
      N.custom3D.val, j();
    }), le.derive(() => {
      N.showCotas.val, j();
    });
  }
  g && Ei({ drawingObj: g, gridObj: ne, scene: F, getActiveCamera: () => I, controls: R, gridSize: G, derivedDisplayScale: re, rendererElm: D.domElement, viewerRender: ce }), ca((T, te) => {
    var _a;
    D.setClearColor(te.background, 1), F.remove(ne), (_a = ne.traverse) == null ? void 0 : _a.call(ne, (j) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = j.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = j.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), ne = ds(N.gridSize.rawVal, { planes: ie() }), F.add(ne), z.style.setProperty("--awatif-legend-color", te.legendMarker), ce();
  });
  const Ve = { scene: F, perspCamera: E, orthoCamera: C, get camera() {
    return I;
  }, controls: R, renderer: D, rendererElm: D.domElement, render: ce, setActiveCamera: Fe, setSplitMode: he, get splitMode() {
    return we;
  }, get splitCamera() {
    return Me;
  }, settings: N };
  z.__ctx = Ve;
  const ve = document.createElement("div");
  ve.id = "hk-nav-camara", ve.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const We = (T, te, j) => {
    const se = document.createElement("button");
    return se.textContent = T, se.title = te, se.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), se.onmouseenter = () => {
      se.style.background = "rgba(70,70,70,0.9)";
    }, se.onmouseleave = () => {
      se.style.background = "rgba(40,40,40,0.85)";
    }, se.onclick = (Ce) => {
      Ce.preventDefault(), j();
    }, se;
  }, Qe = (T, te) => {
    const j = R.target, se = new V().subVectors(I.position, j), Ce = se.length(), Se = new V(), ge = new V();
    Se.crossVectors(I.up, se).normalize(), ge.copy(I.up).normalize();
    const Le = Ce * 0.05;
    j.addScaledVector(Se, -T * Le), j.addScaledVector(ge, te * Le), I.position.addScaledVector(Se, -T * Le), I.position.addScaledVector(ge, te * Le), R.update(), ce();
  }, vt = (T) => {
    const te = new V().subVectors(I.position, R.target);
    te.multiplyScalar(T), I.position.copy(R.target).add(te), R.update(), ce();
  }, Mt = () => {
    const T = document.createElement("div");
    return T.style.cssText = "width:32px;height:32px;", T;
  };
  return ve.append(Mt()), ve.append(We("\u2191", "Pan arriba", () => Qe(0, 1))), ve.append(We("\u2295", "Zoom in", () => vt(0.85))), ve.append(We("\u2190", "Pan izquierda", () => Qe(-1, 0))), ve.append(We("\u2302", "Reset vista", () => {
    R.reset(), ce();
  })), ve.append(We("\u2192", "Pan derecha", () => Qe(1, 0))), ve.append(We("\u2296", "Zoom out", () => vt(1.18))), ve.append(We("\u2193", "Pan abajo", () => Qe(0, -1))), ve.append(Mt()), getComputedStyle(z).position === "static" && (z.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && z.appendChild(ve), z;
}
function el(n, m) {
  return le.derive(() => {
    var _a, _b, _c, _d;
    if (!m.deformedShape.val) return ((_a = n == null ? void 0 : n.nodes) == null ? void 0 : _a.val) ?? [];
    const g = ((_b = n == null ? void 0 : n.nodes) == null ? void 0 : _b.val) ?? [], _ = (_d = (_c = n == null ? void 0 : n.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!_ || g.length === 0) return g;
    const S = m.deformScale.val, z = m.deformScale.val * m.deformScaleZ.val, F = Number.isFinite(S) ? S : 1, E = Number.isFinite(z) ? z : 1;
    return g.map((C, I) => {
      var _a2;
      const D = ((_a2 = _.get(I)) == null ? void 0 : _a2.slice(0, 3)) ?? [0, 0, 0], R = Number.isFinite(D[0]) ? D[0] : 0, ee = Number.isFinite(D[1]) ? D[1] : 0, pe = Number.isFinite(D[2]) ? D[2] : 0;
      return [C[0] + R * F, C[1] + ee * F, C[2] + pe * E];
    });
  });
}
const lo = le.state(null), ms = le.state(""), tl = le.state("kN"), nl = le.state("mm"), ol = le.state("kN/m\xB2"), sl = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, ra = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, al = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function il(n, m) {
  const g = le.state([]);
  let _;
  return ((S) => {
    S.bendingXX = "bendingXX", S.bendingYY = "bendingYY", S.bendingXY = "bendingXY", S.membraneXX = "membraneXX", S.membraneYY = "membraneYY", S.membraneXY = "membraneXY", S.tranverseShearX = "tranverseShearX", S.tranverseShearY = "tranverseShearY", S.membranePrincipalMax = "membranePrincipalMax", S.membranePrincipalMin = "membranePrincipalMin", S.bendingPrincipalMax = "bendingPrincipalMax", S.bendingPrincipalMin = "bendingPrincipalMin", S.transverseShearMax = "transverseShearMax", S.vonMises = "vonMises", S.pressure = "pressure", S.displacementX = "displacementX", S.displacementY = "displacementY", S.displacementZ = "displacementZ";
  })(_ || (_ = {})), le.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const S = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), me = (T, te) => {
      T == null ? void 0 : T.forEach((j, se) => {
        const Ce = n.elements.val[se];
        if (Ce) for (let Se = 0; Se < Ce.length; Se++) te.set(Ce[Se], [j[Se] ?? j[0]]);
      });
    };
    me((_b = (_a = n.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, S), me((_d = (_c = n.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, z), me((_f = (_e = n.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, F), me((_h = (_g = n.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, E), me((_j = (_i2 = n.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, C), me((_l = (_k = n.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, I), me((_n = (_m = n.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, D), me((_p = (_o = n.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, R), me((_r = (_q = n.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), me((_t = (_s = n.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, pe);
    const O = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), oe = (T, te, j, se, Ce) => {
      T.forEach((Se, ge) => {
        var _a2, _b2;
        const Le = Se[0] ?? 0, Ne = ((_a2 = te.get(ge)) == null ? void 0 : _a2[0]) ?? 0, je = ((_b2 = j.get(ge)) == null ? void 0 : _b2[0]) ?? 0, Pe = (Le + Ne) / 2, Te = Math.hypot((Le - Ne) / 2, je);
        se.set(ge, [Pe + Te]), Ce.set(ge, [Pe - Te]);
      });
    };
    oe(E, C, I, O, N), oe(S, z, F, re, Y), D.forEach((T, te) => {
      var _a2;
      ie.set(te, [Math.hypot(T[0] ?? 0, ((_a2 = R.get(te)) == null ? void 0 : _a2[0]) ?? 0)]);
    });
    const ne = (_v = (_u = n.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, J = (_w = m.solidResults) == null ? void 0 : _w.val, G = J && J !== "none" ? J : m.shellResults.val, B = ne == null ? void 0 : ne[G], q = { bendingXX: [S, 0], bendingYY: [z, 0], bendingXY: [F, 0], membraneXX: [E, 0], membraneYY: [C, 0], membraneXY: [I, 0], tranverseShearX: [D, 0], tranverseShearY: [R, 0], membranePrincipalMax: [O, 0], membranePrincipalMin: [N, 0], bendingPrincipalMax: [re, 0], bendingPrincipalMin: [Y, 0], transverseShearMax: [ie, 0], vonMises: [ee, 0], pressure: [pe, 0], displacementX: [(_y = (_x = n.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = n.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = n.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, U = m.shellResults.val, L = tl.val, Q = nl.val, fe = U === "displacementX" || U === "displacementY" || U === "displacementZ", we = U === "bendingXX" || U === "bendingYY" || U === "bendingXY" || U === "bendingPrincipalMax" || U === "bendingPrincipalMin", Me = U === "membraneXX" || U === "membraneYY" || U === "membraneXY" || U === "membranePrincipalMax" || U === "membranePrincipalMin", W = U === "vonMises" || U === "pressure", be = U === "tranverseShearX" || U === "tranverseShearY" || U === "transverseShearMax", ce = (_D = m.solidResults) == null ? void 0 : _D.val, Fe = ce === "vonMises" || ce === "sigmaXX" || ce === "sigmaYY" || ce === "sigmaZZ" || ce === "tauXY" || ce === "tauYZ" || ce === "tauXZ", he = ce === "ux" || ce === "uy" || ce === "uz", Ve = ol.val, ve = Fe ? al[Ve] : he || fe ? ra[Q] : we || Me || W || be ? 1 / sl[L] : 1, We = Fe ? Ve : he || fe ? Q : we ? `${L}\xB7m/m` : Me ? `${L}/m\xB2` : W ? `${L}/m\xB2` : be ? `${L}/m` : "";
    ms.val = We, lo.val = Array.isArray(B) && B.length === 2 ? [B[0] * ve, B[1] * ve] : null;
    const Qe = ma.val, Mt = ce && ce !== "none" ? [ee, 0] : q[U], xe = [];
    if (n.nodes.val.forEach((T, te) => {
      const j = Mt;
      if (!j || !j[0] || typeof j[0].has != "function") return;
      if (!j[0].has(te)) {
        xe.push(Number.NaN);
        return;
      }
      const se = j[0].get(te), Ce = se ? se[j[1]] ?? 0 : 0;
      xe.push(Ce * ve);
    }), !lo.val && Qe !== "auto") {
      const T = n.nodes.val, te = /* @__PURE__ */ new Set(), j = (Ce, Se) => {
        var _a2;
        const ge = (_a2 = T[Ce[0]]) == null ? void 0 : _a2[Se];
        return Ce.every((Le) => {
          var _a3;
          return Math.abs((((_a3 = T[Le]) == null ? void 0 : _a3[Se]) ?? NaN) - ge) < 1e-6;
        });
      };
      for (const Ce of n.elements.val) {
        if (Ce.length !== 4) continue;
        const Se = j(Ce, 2), ge = !Se && j(Ce, 0), Le = !Se && j(Ce, 1);
        if (Qe === "losas" ? Se : Qe === "muros" ? ge || Le : Qe === "murosX" ? ge : Qe === "murosY" ? Le : false) for (const Pe of Ce) te.add(Pe);
      }
      const se = [];
      for (const Ce of te) {
        const Se = xe[Ce];
        Number.isFinite(Se) && se.push(Se);
      }
      se.length && (lo.val = ws(se));
    }
    g.val = xe;
  }), g;
}
export {
  di as a,
  ia as b,
  tl as c,
  nl as d,
  ol as e,
  ul as g
};
