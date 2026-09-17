import { u as rn, a6 as Xo, q as wi, v as ue, a7 as yi, D as Vt, M as ct, B as Ee, F as It, a8 as xi, z as xt, a9 as gi, aa as bi, h as us, ab as ps, r as Xn, ac as Go, ad as Ko, a4 as zs, _ as ut, b as ft, L as jt, y as Cs, c as Mi, ae as vi, f as wt, V as F, $ as $n, af as Ma, K as Oo, d as Et, a as va, A as As, t as Ho, J as _i, H as wo, I as ki, ag as Wo, w as _a, o as Si, N as An, a2 as eo, E as fs, S as to, m as ho, ah as En, g as hs, i as ms, j as ws, P as yo, C as ys, W as Pi, X as zi, Y as Ci, Z as Ai, T as Uo, U as Ei } from "./theme-C-zoknmI.js";
import { T as Tt, O as xs } from "./Text-Cehu0nom.js";
import { P as Es } from "./tweakpane-BXg6ZhiP.js";
import { e as Fi } from "./styles-CqEyA8nI.js";
class Fs {
  constructor(w, g = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(w, g);
  }
  set(w) {
    return w.isLut === true && this.copy(w), this;
  }
  setMin(w) {
    return this.minV = w, this;
  }
  setMax(w) {
    return this.maxV = w, this;
  }
  setColorMap(w, g = 32) {
    this.map = ka[w] || ka.rainbow, this.n = g;
    const _ = 1 / this.n, k = new rn(), C = new rn();
    this.lut.length = 0, this.lut.push(new rn(this.map[0][1]));
    for (let P = 1; P < g; P++) {
      const $ = P * _;
      for (let z = 0; z < this.map.length - 1; z++) if ($ > this.map[z][0] && $ <= this.map[z + 1][0]) {
        const L = this.map[z][0], Y = this.map[z + 1][0];
        k.setHex(this.map[z][1], Xo), C.setHex(this.map[z + 1][1], Xo);
        const B = new rn().lerpColors(k, C, ($ - L) / (Y - L));
        this.lut.push(B);
      }
    }
    return this.lut.push(new rn(this.map[this.map.length - 1][1])), this;
  }
  copy(w) {
    return this.lut = w.lut, this.map = w.map, this.n = w.n, this.minV = w.minV, this.maxV = w.maxV, this;
  }
  getColor(w) {
    w = wi.clamp(w, this.minV, this.maxV), w = (w - this.minV) / (this.maxV - this.minV);
    const g = Math.round(w * this.n);
    return this.lut[g];
  }
  addColorMap(w, g) {
    return ka[w] = g, this;
  }
  createCanvas() {
    const w = document.createElement("canvas");
    return w.width = 1, w.height = this.n, this.updateCanvas(w), w;
  }
  updateCanvas(w) {
    const g = w.getContext("2d", { alpha: false }), _ = g.getImageData(0, 0, 1, this.n), k = _.data;
    let C = 0;
    const P = 1 / this.n, $ = new rn(), z = new rn(), L = new rn();
    for (let Y = 1; Y >= 0; Y -= P) for (let B = this.map.length - 1; B >= 0; B--) if (Y < this.map[B][0] && Y >= this.map[B - 1][0]) {
      const j = this.map[B - 1][0], U = this.map[B][0];
      $.setHex(this.map[B - 1][1], Xo), z.setHex(this.map[B][1], Xo), L.lerpColors($, z, (Y - j) / (U - j)), k[C * 4] = Math.round(L.r * 255), k[C * 4 + 1] = Math.round(L.g * 255), k[C * 4 + 2] = Math.round(L.b * 255), k[C * 4 + 3] = 255, C += 1;
    }
    return g.putImageData(_, 0, 0), w;
  }
}
const ka = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, $s = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], $i = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: $s, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Qo = ue.state("safe"), Ls = ue.state("auto");
function Vs(t) {
  t = Math.max(0, Math.min(1, t));
  const w = $i[Qo.val] ?? $s;
  for (let _ = 0; _ < w.length - 1; _++) {
    const [k, C, P, $] = w[_], [z, L, Y, B] = w[_ + 1];
    if (t <= z) {
      const j = (t - k) / (z - k);
      return [C + (L - C) * j, P + (Y - P) * j, $ + (B - $) * j];
    }
  }
  const g = w[w.length - 1];
  return [g[1], g[2], g[3]];
}
function gs() {
  const w = new Uint8Array(1024);
  for (let _ = 0; _ < 256; _++) {
    const k = _ / 255, [C, P, $] = Vs(k);
    w[_ * 4 + 0] = C, w[_ * 4 + 1] = P, w[_ * 4 + 2] = $, w[_ * 4 + 3] = 255;
  }
  const g = new gi(w, 256, 1, bi);
  return g.minFilter = us, g.magFilter = us, g.wrapS = ps, g.wrapT = ps, g.needsUpdate = true, g;
}
function Li() {
  const w = [];
  for (let g = 0; g <= 12; g++) {
    const _ = 1 - g / 12, [k, C, P] = Vs(_);
    w.push(`rgb(${k | 0},${C | 0},${P | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${w.join(",")})`;
}
function Fa(t) {
  if (!t.length) return [0, 1];
  const w = [...t].sort((C, P) => C - P), g = (C) => w[Math.min(w.length - 1, Math.max(0, Math.round(C * (w.length - 1))))];
  let _ = w.length >= 20 ? g(0.01) : w[0], k = w.length >= 20 ? g(0.99) : w[w.length - 1];
  return _ >= 0 && k > 0 && (_ = 0), k <= 0 && _ < 0 && (k = 0), [_, k];
}
function Vi(t, w, g) {
  new Fs();
  const _ = gs(), k = new yi({ uniforms: { cmap: { value: _ }, ambient: { value: 0.95 } }, vertexShader: `
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
    Qo.val;
    const P = k.uniforms.cmap.value;
    k.uniforms.cmap.value = gs(), (_a2 = P == null ? void 0 : P.dispose) == null ? void 0 : _a2.call(P);
  });
  const C = new ct(new Ee(), k);
  return C.renderOrder = -1, C.frustumCulled = false, C.userData.isShellArea = true, C.name = "__hekatan_shell_colormap", ue.derive(() => {
    C.geometry.setAttribute("position", new It(t.val.flat(), 3));
    const P = [], $ = [], z = [];
    w.val.forEach((se, ye) => {
      se.length === 3 ? (P.push(se[0], se[1], se[2]), $.push(ye), z.push(0)) : se.length === 4 && (P.push(se[0], se[1], se[2]), P.push(se[0], se[2], se[3]), $.push(ye, ye), z.push(0, 1));
    }), C.geometry.setIndex(new xi(P, 1)), C.userData.faceToElem = $, C.userData.faceLocal = z;
    const L = g.val.filter((se) => Number.isFinite(se));
    let Y, B;
    const j = go.val;
    if (j ? (B = j[0], Y = j[1]) : [B, Y] = Fa(L), Y === B) {
      const se = Math.max(Math.abs(Y) * 1e-6, 1e-9);
      Y += se, B -= se;
    }
    const U = j && j[0] > j[1], me = Math.min(B, Y), O = Math.max(B, Y), q = O - me, ae = new Float32Array(g.val.length);
    for (let se = 0; se < g.val.length; se++) {
      const ye = g.val[se];
      if (!Number.isFinite(ye)) {
        ae[se] = -1;
        continue;
      }
      const we = ((U ? O + me - ye : ye) - me) / q;
      ae[se] = Math.max(0, Math.min(1, we));
    }
    C.geometry.setAttribute("scalar", new xt(ae, 1));
  }), C;
}
function Ii(t, w, g) {
  const _ = document.createElement("div"), k = new Es({ title: "Settings", expanded: true, container: _ });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(k), _.setAttribute("id", "settings");
  const C = "hk_settingsPos";
  let P = null;
  try {
    const U = localStorage.getItem(C);
    U && (P = JSON.parse(U));
  } catch {
  }
  _.style.cssText = ["position:fixed", P ? `left:${P.left}px` : "left:8px", P ? `top:${P.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const $ = () => {
    const U = _.querySelector(".tp-rotv_b");
    if (!U) {
      setTimeout($, 200);
      return;
    }
    U.style.cursor = "move", U.style.userSelect = "none";
    let me = false, O = 0, q = 0, ae = 0, se = 0;
    U.addEventListener("mousedown", (ye) => {
      me = true, O = ye.clientX, q = ye.clientY;
      const he = _.getBoundingClientRect();
      ae = he.left, se = he.top, _.style.left = `${ae}px`, _.style.top = `${se}px`;
    }), window.addEventListener("mousemove", (ye) => {
      if (!me) return;
      const he = ye.clientX - O, we = ye.clientY - q, de = Math.max(0, Math.min(window.innerWidth - 40, ae + he)), K = Math.max(0, Math.min(window.innerHeight - 40, se + we));
      _.style.left = `${de}px`, _.style.top = `${K}px`;
    }), window.addEventListener("mouseup", () => {
      if (me) {
        me = false;
        try {
          localStorage.setItem(C, JSON.stringify({ left: parseFloat(_.style.left), top: parseFloat(_.style.top) }));
        } catch {
        }
      }
    });
  };
  if ($(), w == null ? void 0 : w.nodes) {
    k.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const U = k.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    U.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), U.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), U.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), U.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const me = U.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    me.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), me.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), me.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), me.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), me.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const O = k.addFolder({ title: "\u{1F441} Ver", expanded: false });
    O.addBinding(t.nodes, "val", { label: "Nodes" }), O.addBinding(t.elements, "val", { label: "Elements" }), O.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), O.addBinding(t.faces, "val", { label: "  Caras (fill)" }), O.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), O.addBinding(t.elemColumns, "val", { label: "    Columnas" }), O.addBinding(t.elemBeams, "val", { label: "    Vigas" }), O.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), O.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), O.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), O.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), O.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), O.addBinding(t.orientations, "val", { label: "Orientations" }), O.addBinding(t.sections, "val", { label: "Sections" }), O.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), O.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), O.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), O.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), O.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((w == null ? void 0 : w.nodeInputs) || (w == null ? void 0 : w.elementInputs)) {
    const U = k.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    U.addBinding(t.supports, "val", { label: "Supports" }), U.addBinding(t.loads, "val", { label: "Loads" }), U.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), U.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((w == null ? void 0 : w.deformOutputs) || (w == null ? void 0 : w.analyzeOutputs)) {
    const U = k.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = U, U.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), U.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), U.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), U.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), U.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), U.addBinding(Qo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), U.addBinding(Ls, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), U.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), U.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), U.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), U.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && k.addBinding(t.solids, "val", { label: "Solids" });
  const z = k.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), L = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), Y = () => {
    const U = window.__hekatanClipApply;
    typeof U == "function" && U();
  };
  let B = [];
  const j = (U, me) => {
    for (const q of B) try {
      q.dispose();
    } catch {
    }
    B = [];
    const O = (q, ae) => {
      const se = Math.floor(Math.min(U[ae], -50)), ye = Math.ceil(Math.max(me[ae], 50)), he = ye - se > 400 ? 0.5 : 0.1;
      return L["pos" + q] = Math.max(se, Math.min(ye, L["pos" + q])), z.addBinding(L, "pos" + q, { min: se, max: ye, step: he, label: `  pos ${q} (m)` }).on("change", Y);
    };
    B.push(z.addBinding(L, "enableX", { label: "Cortar X" }).on("change", Y), O("X", 0), z.addBinding(L, "invertX", { label: "  invertir X" }).on("change", Y), z.addBinding(L, "enableY", { label: "Cortar Y" }).on("change", Y), O("Y", 1), z.addBinding(L, "invertY", { label: "  invertir Y" }).on("change", Y), z.addBinding(L, "enableZ", { label: "Cortar Z" }).on("change", Y), O("Z", 2), z.addBinding(L, "invertZ", { label: "  invertir Z" }).on("change", Y));
  };
  return j([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (U, me) => {
    j(U, me);
  }, _;
}
function Ti(t) {
  return { gridSize: ue.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: ue.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: ue.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: ue.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: ue.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: ue.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: ue.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: ue.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: ue.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: ue.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: ue.state((t == null ? void 0 : t.nodes) ?? true), elements: ue.state((t == null ? void 0 : t.elements) ?? true), edges: ue.state((t == null ? void 0 : t.edges) ?? true), faces: ue.state((t == null ? void 0 : t.faces) ?? true), elemColumns: ue.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: ue.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: ue.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: ue.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: ue.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: ue.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: ue.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: ue.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: ue.state((t == null ? void 0 : t.orientations) ?? false), sections: ue.state((t == null ? void 0 : t.sections) ?? true), extruded: ue.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: ue.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: ue.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: ue.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: ue.state((t == null ? void 0 : t.secFloor) ?? -1), supports: ue.state((t == null ? void 0 : t.supports) ?? true), loads: ue.state((t == null ? void 0 : t.loads) ?? false), deformedShape: ue.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: ue.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: ue.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: ue.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: ue.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: ue.state((t == null ? void 0 : t.flipAxes) ?? false), solids: ue.state((t == null ? void 0 : t.solids) ?? true), custom3D: ue.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: ue.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: ue.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: ue.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function Ri(t, w, g) {
  const _ = Xn(), k = new Go(new Ee(), new Ko({ color: _.nodePoint }));
  return zs((C, P) => {
    k.material.color.setHex(P.nodePoint);
  }), k.frustumCulled = false, ue.derive(() => {
    t.nodes.val && k.geometry.setAttribute("position", new It(w.val.flat(), 3));
  }), ue.derive(() => {
    if (g.val, w.val, !t.nodes.rawVal) return;
    const C = w.rawVal ?? [];
    let P = t.gridSize.val * 0.5;
    if (C.length >= 2) {
      const z = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
      for (const Y of C) for (let B = 0; B < 3; B++) z[B] = Math.min(z[B], Y[B]), L[B] = Math.max(L[B], Y[B]);
      P = Math.max(L[0] - z[0], L[1] - z[1], L[2] - z[2], 0.1);
    }
    const $ = 0.03 * P;
    k.material.size = $ * g.rawVal;
  }), ue.derive(() => {
    k.visible = t.nodes.val;
  }), k;
}
function Sa(t, w) {
  const g = Xn(), _ = new ut();
  _.name = "hekatan-grid";
  const k = (w == null ? void 0 : w.planes) ?? ["xy"];
  let C = (w == null ? void 0 : w.majorStep) ?? 1, P = (w == null ? void 0 : w.minorStep) ?? 0.1;
  for (C <= 0 && (C = 1), P <= 0 && (P = 0.1); t / P > 500; ) P *= 2;
  for (; t / C > 100; ) C *= 2;
  const $ = t / 2;
  C = Math.max(P, Math.round(C / P) * P);
  const L = new rn(g.grid).multiplyScalar(1.3), Y = new rn(g.grid).multiplyScalar(0.8), B = (O, q, ae, se) => {
    const ye = [], he = O === "xy" ? (I, G) => [I, G, 0] : O === "xz" ? (I, G) => [I, 0, G] : (I, G) => [0, I, G], we = Math.floor($ / q);
    for (let I = -we; I <= we; I++) {
      const G = I * q, X = he(G, -$), T = he(G, $);
      ye.push(...X, ...T);
    }
    for (let I = -we; I <= we; I++) {
      const G = I * q, X = he(-$, G), T = he($, G);
      ye.push(...X, ...T);
    }
    const de = new Ee();
    de.setAttribute("position", new It(ye, 3));
    const K = new ft({ color: ae, transparent: true, opacity: se, depthWrite: false }), Z = new jt(de, K);
    return Z.name = `grid-${O}-${q === P ? "minor" : "major"}`, Z;
  }, j = (O, q, ae) => {
    const se = O === "xy" ? (Z, I) => [Z, I, 0] : O === "xz" ? (Z, I) => [Z, 0, I] : (Z, I) => [0, Z, I], ye = [[-$, -$], [$, -$], [$, $], [-$, $]], he = [];
    for (const [Z, I] of ye) he.push(...se(Z, I));
    const we = new Ee();
    we.setAttribute("position", new It(he, 3));
    const de = new ft({ color: q, transparent: true, opacity: ae, depthWrite: false }), K = new Cs(we, de);
    return K.name = `grid-${O}-border`, K.renderOrder = 1, K;
  }, U = (O, q, ae) => {
    const se = O === "xy" ? (de, K) => [de, K, 0] : O === "xz" ? (de, K) => [de, 0, K] : (de, K) => [0, de, K], ye = q === "u" ? [...se(-$, 0), ...se($, 0)] : [...se(0, -$), ...se(0, $)], he = new Ee();
    he.setAttribute("position", new It(ye, 3));
    const we = new jt(he, new ft({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
    return we.name = `grid-${O}-eje-${q}`, we.renderOrder = 1, we;
  }, me = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const O of k) {
    _.add(B(O, P, Y, 0.12)), _.add(B(O, C, L, 0.4));
    const [q, ae] = me[O];
    _.add(U(O, "u", q)), _.add(U(O, "v", ae)), _.add(j(O, L, 0.55));
  }
  return _.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: C, minorStep: P, gridSize: t, planes: [...k] }, _;
}
function Di(t, w, g, _) {
  const k = new ut(), C = new Mi(0.5, 0.5, 0.5), P = new vi(0.45, 0.7, 4);
  P.rotateX(Math.PI / 2), P.translate(0, 0, -0.35);
  const $ = new wt({ color: 10166822 }), z = new wt({ color: 2792847 }), L = new wt({ color: 3835647 }), Y = () => {
    const U = g.rawVal ?? [];
    if (U.length < 2) return w.gridSize.val * 0.5;
    let me = [1 / 0, 1 / 0, 1 / 0], O = [-1 / 0, -1 / 0, -1 / 0];
    for (const q of U) for (let ae = 0; ae < 3; ae++) q[ae] < me[ae] && (me[ae] = q[ae]), q[ae] > O[ae] && (O[ae] = q[ae]);
    return Math.max(O[0] - me[0], O[1] - me[1], O[2] - me[2], 0.1);
  }, B = () => 0.08 * Y(), j = () => _.rawVal;
  return ue.derive(() => {
    var _a2, _b;
    if (w.deformedShape.val, !w.supports.val) return;
    k.clear();
    const U = B();
    (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((me, O) => {
      const q = g.val[O];
      if (!q) return;
      const ae = me ?? [], se = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), ye = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let he;
      se >= 3 && ye >= 3 ? he = new ct(C, $) : se >= 3 && ye === 0 ? he = new ct(P, z) : he = new ct(P, L), he.position.set(q[0], q[1], q[2]);
      const we = U * j();
      he.scale.set(we, we, we), k.add(he);
    });
  }), ue.derive(() => {
    if (_.val, !w.supports.rawVal) return;
    const me = B() * j();
    k.children.forEach((O) => O.scale.set(me, me, me));
  }), ue.derive(() => {
    k.visible = w.supports.val;
  }), k;
}
function Bi(t, w, g, _) {
  const k = new ut();
  k.name = "loadsGroup";
  function C($) {
    if ($.length < 2) return 0.12 * w.gridSize.rawVal;
    const z = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of $) for (let j = 0; j < 3; j++) z[j] = Math.min(z[j], B[j]), L[j] = Math.max(L[j], B[j]);
    return 0.08 * Math.max(L[0] - z[0], L[1] - z[1], L[2] - z[2], 0.1);
  }
  ue.derive(() => {
    var _a2, _b, _c;
    if (w.deformedShape.val, !w.loads.val) return;
    k.children.forEach((O) => {
      var _a3;
      return (_a3 = O.dispose) == null ? void 0 : _a3.call(O);
    }), k.clear();
    const $ = g.val, z = C($), L = 240, Y = [];
    (_c = (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((O, q) => {
      $[q] && O.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && Y.push(q);
    });
    let B = Y;
    if (Y.length > L) {
      const O = Y.map((T) => $[T][0]), q = Y.map((T) => $[T][1]), ae = Math.min(...O), se = Math.max(...O), ye = Math.min(...q), he = Math.max(...q), we = Y.map((T) => $[T][2]), de = Math.max(1e-6, (Math.max(...we) - Math.min(...we)) / 40), K = (T) => Math.round(T / de), Z = new Set(we.map(K)), I = Math.max(4, Math.floor(L / Math.max(1, Z.size))), G = Math.max(2, Math.round(Math.sqrt(I))), X = /* @__PURE__ */ new Map();
      for (const T of Y) {
        const H = se - ae < 1e-9 ? 0 : ($[T][0] - ae) / (se - ae), pe = he - ye < 1e-9 ? 0 : ($[T][1] - ye) / (he - ye), fe = Math.min(G - 1, Math.floor(H * G)), oe = Math.min(G - 1, Math.floor(pe * G)), W = `${fe},${oe},${K($[T][2])}`, ge = Math.hypot(H * G - (fe + 0.5), pe * G - (oe + 0.5)), ee = X.get(W);
        (!ee || ge < ee.d) && X.set(W, { i: T, d: ge });
      }
      B = [...X.values()].map((T) => T.i);
    }
    let j = 0;
    for (const O of B) {
      const q = t.nodeInputs.val.loads.get(O);
      for (let ae = 0; ae < 3; ae++) j = Math.max(j, Math.abs(q[ae]));
    }
    const U = B.length <= 60, me = (O) => {
      const q = Math.abs(O);
      return q >= 100 ? O.toFixed(0) : q >= 10 ? O.toFixed(1) : O.toFixed(2);
    };
    for (const O of B) {
      const q = t.nodeInputs.val.loads.get(O), ae = $[O];
      if (ae) for (let se = 0; se < 3; se++) {
        const ye = q[se];
        if (!(Math.abs(ye) > 1e-9 * (j || 1))) continue;
        const he = new F(se === 0 ? Math.sign(ye) : 0, se === 1 ? Math.sign(ye) : 0, se === 2 ? Math.sign(ye) : 0), we = 0.45 + 0.55 * (j ? Math.abs(ye) / j : 1), de = new $n(he, new F(...ae), 1, se === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (de.userData = { nudo: ae, dir: he, rel: we }, k.add(de), U) {
          const K = new Tt(me(ye), se === 2 ? "#f5b642" : "#ff6b5e");
          K.userData = { nudo: ae, dir: he, rel: we, texto: true }, k.add(K);
        }
      }
    }
    P(z * _.rawVal);
  });
  function P($) {
    k.children.forEach((z) => {
      const L = z.userData;
      if (!(L == null ? void 0 : L.dir)) return;
      const Y = $ * L.rel, B = new F(...L.nudo).addScaledVector(L.dir, -Y * (L.texto ? 1.12 : 1));
      z.position.copy(B), L.texto ? z.updateScale($ * 0.38) : z.scale.set(Y, Y, Y);
    });
  }
  return ue.derive(() => {
    _.val, w.loads.rawVal && P(C(g.rawVal) * _.rawVal);
  }), ue.derive(() => {
    k.visible = w.loads.val;
  }), k;
}
function Ni(t, w, g) {
  const _ = new ut();
  return ue.derive(() => {
    if (!t.nodesIndexes.val) return;
    _.children.forEach((C) => C.dispose()), _.clear();
    const k = 0.05 * t.gridSize.val * 0.6;
    w.val.forEach((C, P) => {
      const $ = new Tt(`${P}`);
      $.position.set(...C), $.updateScale(k * g.rawVal), _.add($);
    });
  }), ue.derive(() => {
    if (g.val, !t.nodesIndexes.rawVal) return;
    const k = 0.05 * t.gridSize.val * 0.6;
    _.children.forEach((C) => C.updateScale(k * g.rawVal));
  }), ue.derive(() => {
    _.visible = t.nodesIndexes.val;
  }), _;
}
function Yi(t, w, g, _) {
  const k = new ut();
  return ue.derive(() => {
    var _a2;
    if (w.deformedShape.val, !w.elementsIndexes.val) return;
    k.children.forEach((P) => P.dispose()), k.clear();
    const C = 0.05 * w.gridSize.val * 0.6;
    (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((P, $) => {
      const z = new Tt(`${$}`, void 0, "#001219");
      z.position.set(...Xi(P.map((L) => g.rawVal[L]))), z.updateScale(C * _.rawVal), k.add(z);
    });
  }), ue.derive(() => {
    if (_.val, !w.elementsIndexes.rawVal) return;
    const C = 0.05 * w.gridSize.val * 0.6;
    k.children.forEach((P) => P.updateScale(C * _.rawVal));
  }), ue.derive(() => {
    k.visible = w.elementsIndexes.val;
  }), k;
}
function Xi(t) {
  const w = t.reduce((_, k) => [_[0] + k[0], _[1] + k[1], _[2] + k[2]], [0, 0, 0]), g = t.length;
  return [w[0] / g, w[1] / g, w[2] / g];
}
function bs(t, w) {
  const g = new ut(), _ = Math.min(0.05 * t, 0.6), k = Xn(), C = new Tt("X", "red", "transparent"), P = new Tt(w ? "Z" : "Y", "green", "transparent"), $ = new Tt(w ? "Y" : "Z", "blue", "transparent"), z = new $n(new F(1, 0, 0), new F(0, 0, 0), 1, k.axisArrow, 0.2, 0.2), L = new $n(new F(0, 1, 0), new F(0, 0, 0), 1, k.axisArrow, 0.2, 0.2), Y = new $n(new F(0, 0, 1), new F(0, 0, 0), 1, k.axisArrow, 0.2, 0.2);
  return C.position.set(1.3 * _, 0, 0), P.position.set(0, 1.3 * _, 0), $.position.set(0, 0, 1.3 * _), C.updateScale(0.4 * _), P.updateScale(0.4 * _), $.updateScale(0.4 * _), z.scale.set(_, _, _), L.scale.set(_, _, _), Y.scale.set(_, _, _), g.add(z, L, Y, C, P, $), g;
}
function Jo(t, w) {
  const g = new F(...t), k = new F(...w).clone().sub(g), C = k.length(), P = k.dot(new F(1, 0, 0)) / C, $ = k.dot(new F(0, 1, 0)) / C, z = k.dot(new F(0, 0, 1)) / C, L = Math.sqrt(P ** 2 + $ ** 2);
  let Y = new Ma().fromArray([[P, $, z], [-$ / L, P / L, 0], [-P * z / L, -$ * z / L, L]].flat());
  return z === 1 && (Y = new Ma().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), z === -1 && (Y = new Ma().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Oo().setFromMatrix3(Y);
}
function Ca(t, w) {
  return t == null ? void 0 : t.map((g, _) => (9 * g + w[_]) / 10);
}
function xo(t) {
  const w = t.reduce((_, k) => [_[0] + k[0], _[1] + k[1], _[2] + k[2]], [0, 0, 0]), g = t.length;
  return [w[0] / g, w[1] / g, w[2] / g];
}
function Ui(t, w, g) {
  const _ = xo([w, g]), k = xo([t, g]), C = xo([t, w]), P = new F(..._).sub(new F(...k)).normalize(), $ = new F(...g).sub(new F(...C)).normalize(), z = P.clone().cross($).normalize(), L = z.clone().cross(P).normalize();
  return new Oo().makeBasis(P, L, z);
}
function Zi(t, w, g, _) {
  const k = new ut(), C = new Ee(), P = new ft({ vertexColors: true }), $ = [0, 0, 0], z = [1, 0, 0], L = [0, 1, 0], Y = [0, 0, 1];
  C.setAttribute("position", new It([...$, ...z, ...$, ...L, ...$, ...Y], 3));
  const B = [255, 0, 0], j = [0, 255, 0], U = [0, 0, 255];
  return C.setAttribute("color", new It([...B, ...B, ...j, ...j, ...U, ...U], 3)), ue.derive(() => {
    var _a2;
    w.deformedShape.val, w.orientations.val && (k.clear(), (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((me) => {
      const O = new jt(C, P), q = g.rawVal[me[0]], ae = g.rawVal[me[1]];
      if (me.length === 2 && (O.position.set(...Ca(q, ae)), O.rotation.setFromRotationMatrix(Jo(q, ae))), me.length === 3) {
        const he = g.rawVal[me[2]];
        O.position.set(...xo([q, ae, he])), O.rotation.setFromRotationMatrix(Ui(q, ae, he));
      }
      const ye = 0.05 * w.gridSize.rawVal * 0.75 * _.rawVal;
      O.scale.set(ye, ye, ye), k.add(O);
    }));
  }), ue.derive(() => {
    if (_.val, !w.orientations.rawVal) return;
    const O = 0.05 * w.gridSize.val * 0.75 * _.rawVal;
    k.children.forEach((q) => q.scale.set(O, O, O));
  }), ue.derive(() => {
    k.visible = w.orientations.val;
  }), k;
}
function qi(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const w = (t.b * 100).toFixed(0), g = (t.h * 100).toFixed(0);
    return `${w}x${g}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function Gi(t, w, g, _) {
  const k = new ut(), C = new ut();
  k.add(C);
  function P(de, K) {
    const Z = de / 2, I = K / 2, G = new Float32Array([0, -Z, -I, 0, Z, -I, 0, Z, I, 0, -Z, -I, 0, Z, I, 0, -Z, I]), X = new Ee();
    X.setAttribute("position", new xt(G, 3));
    const T = new Float32Array([0, -Z, -I, 0, Z, -I, 0, Z, I, 0, -Z, I, 0, -Z, -I]), H = new Ee();
    return H.setAttribute("position", new xt(T, 3)), { fill: X, outline: H };
  }
  function $(de, K = 24) {
    const Z = de / 2, I = new Float32Array(K * 9);
    for (let H = 0; H < K; H++) {
      const pe = H / K * Math.PI * 2, fe = (H + 1) / K * Math.PI * 2;
      I[H * 9] = 0, I[H * 9 + 1] = 0, I[H * 9 + 2] = 0, I[H * 9 + 3] = 0, I[H * 9 + 4] = Z * Math.cos(pe), I[H * 9 + 5] = Z * Math.sin(pe), I[H * 9 + 6] = 0, I[H * 9 + 7] = Z * Math.cos(fe), I[H * 9 + 8] = Z * Math.sin(fe);
    }
    const G = new Ee();
    G.setAttribute("position", new xt(I, 3));
    const X = new Float32Array((K + 1) * 3);
    for (let H = 0; H <= K; H++) {
      const pe = H / K * Math.PI * 2;
      X[H * 3] = 0, X[H * 3 + 1] = Z * Math.cos(pe), X[H * 3 + 2] = Z * Math.sin(pe);
    }
    const T = new Ee();
    return T.setAttribute("position", new xt(X, 3)), { fill: G, outline: T };
  }
  function z(de, K, Z, I) {
    const G = Z ?? K * 0.08, X = I ?? de * 0.07, T = de / 2, H = K / 2, pe = H - G, fe = X / 2, oe = [];
    function W(xe, be, _e, Be) {
      oe.push(0, xe, be, 0, _e, be, 0, _e, Be, 0, xe, be, 0, _e, Be, 0, xe, Be);
    }
    W(-T, -H, T, -pe), W(-fe, -pe, fe, pe), W(-T, pe, T, H);
    const ge = new Ee();
    ge.setAttribute("position", new xt(new Float32Array(oe), 3));
    const ee = new Float32Array([0, -T, -H, 0, T, -H, 0, T, -pe, 0, fe, -pe, 0, fe, pe, 0, T, pe, 0, T, H, 0, -T, H, 0, -T, pe, 0, -fe, pe, 0, -fe, -pe, 0, -T, -pe, 0, -T, -H]), $e = new Ee();
    return $e.setAttribute("position", new xt(ee, 3)), { fill: ge, outline: $e };
  }
  function L(de, K, Z) {
    const I = de / 2, G = K / 2, X = I - Z, T = G - Z, H = [];
    function pe(ge, ee, $e, xe) {
      H.push(0, ge, ee, 0, $e, ee, 0, $e, xe, 0, ge, ee, 0, $e, xe, 0, ge, xe);
    }
    pe(-I, -G, I, -T), pe(-I, T, I, G), pe(-I, -T, -X, T), pe(X, -T, I, T);
    const fe = new Ee();
    fe.setAttribute("position", new xt(new Float32Array(H), 3));
    const oe = new Float32Array([0, -I, -G, 0, I, -G, 0, I, -G, 0, I, G, 0, I, G, 0, -I, G, 0, -I, G, 0, -I, -G, 0, -X, -T, 0, X, -T, 0, X, -T, 0, X, T, 0, X, T, 0, -X, T, 0, -X, T, 0, -X, -T]), W = new Ee();
    return W.setAttribute("position", new xt(oe, 3)), { fill: fe, outline: W };
  }
  function Y(de, K, Z) {
    const I = de / 2, G = K / 2, X = I - Z, T = G - Z, H = new Ee(), pe = new Float32Array([0, -X, -T, 0, X, -T, 0, X, T, 0, -X, -T, 0, X, T, 0, -X, T]);
    H.setAttribute("position", new xt(pe, 3));
    const fe = [];
    function oe($e, xe, be, _e) {
      fe.push(0, $e, xe, 0, be, xe, 0, be, _e, 0, $e, xe, 0, be, _e, 0, $e, _e);
    }
    oe(-I, -G, I, -T), oe(-I, T, I, G), oe(-I, -T, -X, T), oe(X, -T, I, T);
    const W = new Ee();
    W.setAttribute("position", new xt(new Float32Array(fe), 3));
    const ge = new Float32Array([0, -I, -G, 0, I, -G, 0, I, -G, 0, I, G, 0, I, G, 0, -I, G, 0, -I, G, 0, -I, -G, 0, -X, -T, 0, X, -T, 0, X, -T, 0, X, T, 0, X, T, 0, -X, T, 0, -X, T, 0, -X, -T]), ee = new Ee();
    return ee.setAttribute("position", new xt(ge, 3)), { concFill: H, steelFillGeom: W, outline: ee };
  }
  function B(de, K, Z) {
    const I = [], G = [[0, -de / 2, -K / 2], [0, -de / 2 + Z, -K / 2], [0, -de / 2 + Z, K / 2 - Z], [0, de / 2, K / 2 - Z], [0, de / 2, K / 2], [0, -de / 2, K / 2]], X = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of X) I.push(...G[fe]);
    const T = new Ee();
    T.setAttribute("position", new xt(new Float32Array(I), 3));
    const H = [];
    for (let fe = 0; fe < G.length; fe++) {
      const oe = (fe + 1) % G.length;
      H.push(...G[fe], ...G[oe]);
    }
    const pe = new Ee();
    return pe.setAttribute("position", new xt(new Float32Array(H), 3)), { fill: T, outline: pe };
  }
  function j(de, K, Z, I) {
    const G = I / 2, X = [], T = [[0, -de - G, -K / 2], [0, -Z - G, -K / 2], [0, -Z - G, K / 2 - Z], [0, -G, K / 2 - Z], [0, -G, K / 2], [0, -de - G, K / 2]], H = [[0, G, -K / 2], [0, G + Z, -K / 2], [0, G + Z, K / 2 - Z], [0, de + G, K / 2 - Z], [0, de + G, K / 2], [0, G, K / 2]], pe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ge of pe) X.push(...T[ge]);
    for (const ge of pe) X.push(...H[ge]);
    const fe = new Ee();
    fe.setAttribute("position", new xt(new Float32Array(X), 3));
    const oe = [];
    for (const ge of [T, H]) for (let ee = 0; ee < ge.length; ee++) {
      const $e = (ee + 1) % ge.length;
      oe.push(...ge[ee], ...ge[$e]);
    }
    const W = new Ee();
    return W.setAttribute("position", new xt(new Float32Array(oe), 3)), { fill: fe, outline: W };
  }
  function U(de, K, Z, I) {
    const G = K / 2, X = de, T = [[0, -X, -G], [0, -X, -G + Z], [0, -I, -G + Z], [0, -I, G - Z], [0, -X, G - Z], [0, -X, G], [0, 0, G], [0, 0, -G]], H = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], pe = [];
    for (const ge of H) pe.push(...T[ge]);
    const fe = new Ee();
    fe.setAttribute("position", new xt(new Float32Array(pe), 3));
    const oe = [];
    for (let ge = 0; ge < T.length; ge++) {
      const ee = (ge + 1) % T.length;
      oe.push(...T[ge], ...T[ee]);
    }
    const W = new Ee();
    return W.setAttribute("position", new xt(new Float32Array(oe), 3)), { fill: fe, outline: W };
  }
  function me(de, K, Z, I, G) {
    const X = K / 2, T = G / 2, H = [], pe = [[0, -de, -X], [0, -de, -X + Z], [0, -T - I, -X + Z], [0, -T - I, X - Z], [0, -de, X - Z], [0, -de, X], [0, -T, X], [0, -T, -X]], fe = pe.map(($e) => [$e[0], -$e[1], $e[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const $e of oe) H.push(...pe[$e]);
    for (const $e of oe) H.push(...fe[$e]);
    const W = new Ee();
    W.setAttribute("position", new xt(new Float32Array(H), 3));
    const ge = [];
    for (const $e of [pe, fe]) for (let xe = 0; xe < $e.length; xe++) {
      const be = (xe + 1) % $e.length;
      ge.push(...$e[xe], ...$e[be]);
    }
    const ee = new Ee();
    return ee.setAttribute("position", new xt(new Float32Array(ge), 3)), { fill: W, outline: ee };
  }
  function O(de, K, Z, I) {
    const G = de / 2, X = K / 2, T = I / 2, H = [[0, -T, -X], [0, T, -X], [0, T, X - Z], [0, G, X - Z], [0, G, X], [0, -G, X], [0, -G, X - Z], [0, -T, X - Z]], pe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], fe = [];
    for (const ee of pe) fe.push(...H[ee]);
    const oe = new Ee();
    oe.setAttribute("position", new xt(new Float32Array(fe), 3));
    const W = [];
    for (let ee = 0; ee < H.length; ee++) {
      const $e = (ee + 1) % H.length;
      W.push(...H[ee], ...H[$e]);
    }
    const ge = new Ee();
    return ge.setAttribute("position", new xt(new Float32Array(W), 3)), { fill: oe, outline: ge };
  }
  function q(de, K, Z = 24) {
    const I = de / 2, G = I - K, X = [];
    for (let fe = 0; fe < Z; fe++) {
      const oe = fe / Z * Math.PI * 2, W = (fe + 1) / Z * Math.PI * 2, ge = Math.cos(oe), ee = Math.sin(oe), $e = Math.cos(W), xe = Math.sin(W);
      X.push(0, I * ge, I * ee, 0, I * $e, I * xe, 0, G * $e, G * xe), X.push(0, I * ge, I * ee, 0, G * $e, G * xe, 0, G * ge, G * ee);
    }
    const T = new Ee();
    T.setAttribute("position", new xt(new Float32Array(X), 3));
    const H = [];
    for (let fe = 0; fe < Z; fe++) {
      const oe = fe / Z * Math.PI * 2, W = (fe + 1) / Z * Math.PI * 2;
      H.push(0, I * Math.cos(oe), I * Math.sin(oe), 0, I * Math.cos(W), I * Math.sin(W)), H.push(0, G * Math.cos(oe), G * Math.sin(oe), 0, G * Math.cos(W), G * Math.sin(W));
    }
    const pe = new Ee();
    return pe.setAttribute("position", new xt(new Float32Array(H), 3)), { fill: T, outline: pe };
  }
  const ae = new wt({ color: 52479, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }), se = new ft({ color: 52479 }), ye = new wt({ color: 16750848, transparent: true, opacity: 0.4, side: Vt, depthWrite: false }), he = new ft({ color: 16750848 });
  function we(de, K) {
    const Z = Math.abs(K[0] - de[0]), I = Math.abs(K[1] - de[1]), G = Math.abs(K[2] - de[2]);
    return G > Z && G > I || I > Z && I > G;
  }
  return ue.derive(() => {
    var _a2, _b;
    w.deformedShape.val, w.secColumns.val, w.secBeams.val, w.secFloor.val;
    const de = w.secColumns.rawVal, K = w.secBeams.rawVal;
    if (!de && !K) {
      k.children.forEach((T) => {
        T instanceof Tt && T.dispose();
      }), k.clear();
      return;
    }
    k.children.forEach((T) => {
      T instanceof Tt && T.dispose();
    }), k.clear();
    const Z = (_a2 = t.elements) == null ? void 0 : _a2.val, I = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!Z || !I) return;
    const G = I.sectionShapes, X = w.secFloor.rawVal;
    Z.forEach((T, H) => {
      if (T.length !== 2) return;
      const pe = g.rawVal[T[0]], fe = g.rawVal[T[1]];
      if (!pe || !fe) return;
      const oe = we(pe, fe);
      if (oe && !de || !oe && !K) return;
      if (X >= 0) {
        const xe = Math.min(pe[1], fe[1]);
        Math.max(pe[1], fe[1]);
        const be = w.gridSize.rawVal || 3;
        if (Math.floor(xe / be + 0.01) !== X) return;
      }
      const W = G == null ? void 0 : G.get(H);
      if (!W) return;
      const ge = [(pe[0] + fe[0]) / 2, (pe[1] + fe[1]) / 2, (pe[2] + fe[2]) / 2], ee = Jo(pe, fe);
      if (W.type === "CFT") {
        const xe = Y(W.b, W.h, W.tw ?? W.b * 0.05), be = new ct(xe.concFill, ae);
        be.position.set(...ge), be.rotation.setFromRotationMatrix(ee), be.userData.e = H, k.add(be);
        const _e = new ct(xe.steelFillGeom, ye);
        _e.position.set(...ge), _e.rotation.setFromRotationMatrix(ee), _e.userData.e = H, k.add(_e);
        const Be = new Et(xe.outline, he);
        Be.position.set(...ge), Be.rotation.setFromRotationMatrix(ee), Be.userData.e = H, k.add(Be);
      } else {
        let xe, be, _e;
        switch (W.type) {
          case "rect":
            xe = P(W.b, W.h), be = ae, _e = se;
            break;
          case "circ":
            xe = $(W.d), be = ae, _e = se;
            break;
          case "I":
            xe = z(W.b, W.h, W.tf, W.tw), be = ye, _e = he;
            break;
          case "HSS":
            xe = L(W.b, W.h, W.tw ?? W.b * 0.05), be = ye, _e = he;
            break;
          case "CFT":
            xe = Y(W.b, W.h, W.tw ?? W.b * 0.05), be = ye, _e = he;
            break;
          case "L":
            xe = B(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3), be = ye, _e = he;
            break;
          case "2L":
            xe = j(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3, W.dis ?? 0.01), be = ye, _e = he;
            break;
          case "C":
          case "coldC":
            xe = U(W.b, W.h, W.tf ?? W.t ?? 3e-3, W.tw ?? W.t ?? 3e-3), be = ye, _e = he;
            break;
          case "2C":
            xe = me(W.b, W.h, W.tf ?? 5e-3, W.tw ?? 5e-3, W.dis ?? 0.01), be = ye, _e = he;
            break;
          case "T":
            xe = O(W.b, W.h, W.tf ?? 0.01, W.tw ?? 6e-3), be = ye, _e = he;
            break;
          case "pipe":
            xe = q(W.d, W.tw ?? W.d * 0.05), be = ye, _e = he;
            break;
          default:
            return;
        }
        const Be = new ct(xe.fill, be);
        Be.position.set(...ge), Be.rotation.setFromRotationMatrix(ee), Be.userData.e = H, k.add(Be);
        const Pe = new Et(xe.outline, _e);
        Pe.position.set(...ge), Pe.rotation.setFromRotationMatrix(ee), Pe.userData.e = H, k.add(Pe);
      }
      const $e = qi(W);
      if ($e) {
        const be = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(W.type) ? "#ff9900" : "#00ccff", _e = new Tt($e, be, "transparent");
        _e.position.set(ge[0], ge[1], ge[2]);
        const Be = 0.05 * w.gridSize.rawVal * 0.5;
        _e.updateScale(Be * ((_ == null ? void 0 : _.rawVal) ?? 1)), C.add(_e);
      }
    });
  }), ue.derive(() => {
    var _a2, _b;
    const de = g.val, K = (_a2 = t.elements) == null ? void 0 : _a2.rawVal;
    if (K) for (const Z of k.children) {
      const I = (_b = Z.userData) == null ? void 0 : _b.e;
      if (I === void 0) continue;
      const G = K[I], X = G && de[G[0]], T = G && de[G[1]];
      !X || !T || (Z.position.set((X[0] + T[0]) / 2, (X[1] + T[1]) / 2, (X[2] + T[2]) / 2), Z.rotation.setFromRotationMatrix(Jo(X, T)));
    }
  }), _ && ue.derive(() => {
    if (_.val, !w.sections.rawVal) return;
    const de = 0.05 * w.gridSize.val * 0.5;
    C.children.forEach((K) => {
      K instanceof Tt && K.updateScale(de * _.rawVal);
    });
  }), ue.derive(() => {
    k.visible = w.sections.val;
  }), ue.derive(() => {
    C.visible = w.sectionLabels.val;
  }), k;
}
function Ki(t) {
  if (!t) return null;
  const w = t.type, g = (Y, B) => [Y, B], _ = (Y, B) => [g(-Y / 2, -B / 2), g(Y / 2, -B / 2), g(Y / 2, B / 2), g(-Y / 2, B / 2)], k = (Y, B = 24) => {
    const j = Y / 2, U = [];
    for (let me = 0; me < B; me++) {
      const O = 2 * Math.PI * me / B;
      U.push(g(j * Math.cos(O), j * Math.sin(O)));
    }
    return U;
  }, C = t.b ?? 0, P = t.h ?? 0, $ = t.d ?? 0, z = t.tw ?? t.t ?? 0, L = t.tf ?? t.t ?? 0;
  switch (w) {
    case "rect":
      return C && P ? { contorno: _(C, P) } : null;
    case "circ":
      return $ ? { contorno: k($) } : null;
    case "pipe":
      return $ && z ? { contorno: k($), huecos: [k($ - 2 * z).reverse()] } : null;
    case "HSS":
      return C && P && z ? { contorno: _(C, P), huecos: [_(C - 2 * z, P - 2 * (L || z)).reverse()] } : null;
    case "CFT":
      return C && P ? { contorno: _(C, P) } : null;
    case "I":
      return C && P && z && L ? { contorno: [g(-C / 2, -P / 2), g(C / 2, -P / 2), g(C / 2, -P / 2 + L), g(z / 2, -P / 2 + L), g(z / 2, P / 2 - L), g(C / 2, P / 2 - L), g(C / 2, P / 2), g(-C / 2, P / 2), g(-C / 2, P / 2 - L), g(-z / 2, P / 2 - L), g(-z / 2, -P / 2 + L), g(-C / 2, -P / 2 + L)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return C && P && z && L ? { contorno: [g(-C / 2, -P / 2), g(C / 2, -P / 2), g(C / 2, -P / 2 + L), g(-C / 2 + z, -P / 2 + L), g(-C / 2 + z, P / 2 - L), g(C / 2, P / 2 - L), g(C / 2, P / 2), g(-C / 2, P / 2)] } : null;
    case "T":
      return C && P && z && L ? { contorno: [g(-z / 2, -P / 2), g(z / 2, -P / 2), g(z / 2, P / 2 - L), g(C / 2, P / 2 - L), g(C / 2, P / 2), g(-C / 2, P / 2), g(-C / 2, P / 2 - L), g(-z / 2, P / 2 - L)] } : null;
    case "L":
    case "2L":
      return C && P && z ? { contorno: [g(-C / 2, -P / 2), g(C / 2, -P / 2), g(C / 2, -P / 2 + z), g(-C / 2 + z, -P / 2 + z), g(-C / 2 + z, P / 2), g(-C / 2, P / 2)] } : null;
    default:
      return C && P ? { contorno: _(C, P) } : $ ? { contorno: k($) } : null;
  }
}
function Wi(t, w, g) {
  if (!t || t <= 0 || !w || !g || w <= 0 || g <= 0) return null;
  const _ = Math.sqrt(Math.sqrt(g / w)), k = Math.sqrt(t / _), C = t / k;
  return !isFinite(k) || !isFinite(C) || k <= 0 || C <= 0 ? null : { contorno: [[-k / 2, -C / 2], [k / 2, -C / 2], [k / 2, C / 2], [-k / 2, C / 2]] };
}
function Hi(t) {
  const w = new wo();
  t.contorno.forEach(([g, _], k) => k ? w.lineTo(g, _) : w.moveTo(g, _)), w.closePath();
  for (const g of t.huecos ?? []) {
    const _ = new ki();
    g.forEach(([k, C], P) => P ? _.lineTo(k, C) : _.moveTo(k, C)), _.closePath(), w.holes.push(_);
  }
  return w;
}
function Ji(t, w, g) {
  const _ = new ut();
  _.name = "extrusion";
  const k = new va({ color: 8369151, transparent: true, opacity: 0.92, side: Vt }), C = new va({ color: 12623968, transparent: true, opacity: 0.85, side: Vt }), P = new va({ color: 11583173, transparent: true, opacity: 0.85, side: Vt }), $ = new ut();
  $.add(new As(16777215, 0.55));
  const z = new Ho(16777215, 0.75);
  z.position.set(30, 25, 40);
  const L = new Ho(16777215, 0.35);
  L.position.set(-25, -20, 15), $.add(z, L);
  let Y = 0;
  return ue.derive(() => {
    var _a2, _b, _c, _d, _e;
    const B = ((_a2 = w.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++Y, on: B }, _.visible = B;
    for (const se of [..._.children]) se !== $ && (_.remove(se), (_c = (_b = se.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (_.children.includes($) || _.add($), !B) return;
    const j = g.val ?? [], U = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], me = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, O = me.sectionShapes ?? /* @__PURE__ */ new Map(), q = me.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      U.forEach((se, ye) => {
        var _a3, _b2, _c2;
        if (se.length === 2) {
          let he = Ki(O.get(ye)), we = true;
          if (he || (he = Wi((_a3 = me.areas) == null ? void 0 : _a3.get(ye), (_b2 = me.momentsOfInertiaY) == null ? void 0 : _b2.get(ye), (_c2 = me.momentsOfInertiaZ) == null ? void 0 : _c2.get(ye)), we = false), !he) return;
          const de = j[se[0]], K = j[se[1]];
          if (!de || !K) return;
          const Z = Math.hypot(K[0] - de[0], K[1] - de[1], K[2] - de[2]);
          if (Z < 1e-9) return;
          const I = new _i(Hi(he), { depth: Z, bevelEnabled: false, curveSegments: 4 });
          I.applyMatrix4(new Oo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const G = new ct(I, we ? k : C);
          G.position.set(de[0], de[1], de[2]), G.rotation.setFromRotationMatrix(Jo(de, K)), _.add(G);
          return;
        }
        if (se.length === 3 || se.length === 4) {
          const he = q.get(ye);
          if (!he || he <= 0) return;
          const we = se.map((xe) => j[xe]).filter(Boolean);
          if (we.length < 3) return;
          const de = [we[1][0] - we[0][0], we[1][1] - we[0][1], we[1][2] - we[0][2]], K = [we[2][0] - we[0][0], we[2][1] - we[0][1], we[2][2] - we[0][2]], Z = de[1] * K[2] - de[2] * K[1], I = de[2] * K[0] - de[0] * K[2], G = de[0] * K[1] - de[1] * K[0], X = Math.hypot(Z, I, G);
          if (X < 1e-12) return;
          const T = [Z / X, I / X, G / X], H = [], pe = (xe) => we.map((be) => [be[0] + T[0] * xe, be[1] + T[1] * xe, be[2] + T[2] * xe]), fe = Math.abs(T[2]) > 0.5, oe = T[2] > 0 ? -1 : 1, W = pe(fe ? 0 : +he / 2), ge = pe(fe ? oe * he : -he / 2), ee = (xe, be, _e2) => H.push(...xe, ...be, ..._e2);
          for (const xe of [W, ge]) ee(xe[0], xe[1], xe[2]), xe.length === 4 && ee(xe[0], xe[2], xe[3]);
          for (let xe = 0; xe < we.length; xe++) {
            const be = (xe + 1) % we.length;
            ee(W[xe], ge[xe], ge[be]), ee(W[xe], ge[be], W[be]);
          }
          const $e = new Ee();
          $e.setAttribute("position", new It(H, 3)), $e.computeVertexNormals(), _.add(new ct($e, P));
        }
      });
    } catch (se) {
      ae = String((se == null ? void 0 : se.message) ?? se);
    }
    globalThis.__extrusionDebug = { corridas: Y, on: B, fallo: ae, nElementos: U.length, nFormas: O.size, nEspesores: q.size, mallas: _.children.length - 1 };
  }), _;
}
function Is(t, w, g = 0) {
  const _ = [w[0] - t[0], w[1] - t[1], w[2] - t[2]], k = Math.hypot(_[0], _[1], _[2]) || 1, C = _[0] / k, P = _[1] / k, $ = _[2] / k, z = Math.sqrt(C * C + P * P);
  let L, Y, B;
  if (z < 1e-9) {
    const j = $ > 0 ? 1 : -1;
    L = [0, 0, j], Y = [1, 0, 0], B = [0, j, 0];
  } else L = [C, P, $], Y = [-C * $ / z, -P * $ / z, z], B = [P / z, -C / z, 0];
  if (Math.abs(g) > 1e-12) {
    const j = g * Math.PI / 180, U = Math.cos(j), me = Math.sin(j), O = Y.map((ae, se) => U * ae + me * B[se]), q = B.map((ae, se) => -me * Y[se] + U * ae);
    Y = O, B = q;
  }
  return { e1: L, e2: Y, e3: B };
}
function Aa(t, w) {
  if (!w) return [0, 0];
  const g = Number(w[0] ?? 0), _ = Number(w[1] ?? 0);
  return t === "bendingsY" ? [g, -_] : [-g, _];
}
function Ts(t, w) {
  const g = (_) => _.map((k) => -k);
  switch (t) {
    case "bendingsZ":
      return g(w.e2);
    case "bendingsY":
      return g(w.e3);
    case "shearsZ":
      return w.e3;
    default:
      return w.e2;
  }
}
class Zo extends ut {
  constructor(w, g, _, k, C, P, $) {
    super();
    const z = new wo().moveTo(0, 0).lineTo(0, P[1]).lineTo(_, P[1]).lineTo(_, 0).lineTo(0, 0), L = z.getPoints(), Y = new Ee().setFromPoints(L);
    this.lines = new Et(Y, new ft({ color: Xn().resultOutline })), this.lines.position.set(...w), this.lines.rotation.setFromRotationMatrix(k), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const B = new Wo(z), j = new wt({ color: P[1] > 0 ? 24435 : 11411474, side: Vt });
    this.mesh = new ct(B, j), this.mesh.position.set(...w), this.mesh.rotation.setFromRotationMatrix(k), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Tt(`${C[1].toFixed(4)}`), this.normalizedResult = P, this.textPosition = xo([w, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(k), this.add(this.text);
  }
  updateScale(w) {
    this.lines.scale.set(1, w * 2, 1), this.mesh.scale.set(1, w * 2, 1), this.text.updateScale(w * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * w);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Pa extends ut {
  constructor(w, g, _, k, C, P, $) {
    super();
    const z = C[0] * _ / (C[0] + C[1]), L = C[0] * C[1] > 0;
    if (this.text = new Tt(`${C[0].toFixed(4)}`), this.text2 = new Tt(`${(C[1] * -1).toFixed(4)}`), this.normalizedResult = P, this.textPosition = Ca(w, g), this.text2Position = Ca(g, w), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(k), this.text2.rotation.setFromRotationMatrix(k), this.add(this.text, this.text2), L) {
      const Y = new wo().moveTo(0, 0).lineTo(0, P[0]).lineTo(z, 0).lineTo(0, 0), B = new wo().moveTo(z, 0).lineTo(_, -P[1]).lineTo(_, 0).lineTo(z, 0), j = Y.getPoints(), U = B.getPoints(), me = new Ee().setFromPoints(j), O = new Ee().setFromPoints(U), q = new ft({ color: Xn().resultOutline });
      this.lines = new Et(me, q), this.lines2 = new Et(O, q), this.lines.position.set(...w), this.lines2.position.set(...w), this.lines.rotation.setFromRotationMatrix(k), this.lines2.rotation.setFromRotationMatrix(k), $ && this.lines.rotateX(Math.PI / 2), $ && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new Wo(Y), se = new Wo(B), ye = new wt({ color: P[0] > 0 ? 24435 : 11411474, side: Vt }), he = new wt({ color: -P[1] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new ct(ae, ye), this.mesh2 = new ct(se, he), this.mesh.position.set(...w), this.mesh2.position.set(...w), this.mesh.rotation.setFromRotationMatrix(k), this.mesh2.rotation.setFromRotationMatrix(k), $ && this.mesh.rotateX(Math.PI / 2), $ && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const Y = new wo().moveTo(0, 0).lineTo(0, P[0]).lineTo(_, -P[1]).lineTo(_, 0).lineTo(0, 0), B = Y.getPoints(), j = new Ee().setFromPoints(B);
      this.lines = new Et(j, new ft({ color: Xn().resultOutline })), this.lines.position.set(...w), this.lines.rotation.setFromRotationMatrix(k), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const U = new Wo(Y), me = new wt({ color: P[0] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new ct(U, me), this.mesh.position.set(...w), this.mesh.rotation.setFromRotationMatrix(k), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(w) {
    var _a2, _b;
    this.lines.scale.set(1, w * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, w * 2, 1), this.mesh.scale.set(1, w * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, w * 2, 1), this.text.updateScale(w * 0.6), this.text2.updateScale(w * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * w), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * w);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Rs = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Rs || {});
function Oi(t, w, g, _) {
  const k = () => {
    const $ = g.rawVal;
    if (!($ == null ? void 0 : $.length)) return 0.05 * w.gridSize.rawVal;
    const z = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of $) for (let j = 0; j < 3; j++) B[j] < z[j] && (z[j] = B[j]), B[j] > L[j] && (L[j] = B[j]);
    const Y = Math.hypot(L[0] - z[0], L[1] - z[1], L[2] - z[2]);
    return !isFinite(Y) || Y <= 0 ? 0.05 * w.gridSize.rawVal : 0.025 * Y;
  }, C = new ut(), P = { normals: Zo, shearsY: Zo, shearsZ: Zo, torsions: Zo, bendingsY: Pa, bendingsZ: Pa };
  return ue.derive(() => {
    var _a2, _b;
    if (w.deformedShape.val, g.val, w.frameResults.val == "none") return;
    C.children.forEach((z) => z.dispose()), C.clear();
    const $ = Rs[w.frameResults.rawVal];
    (_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal[$]) == null ? void 0 : _b.forEach((z, L) => {
      var _a3, _b2, _c, _d, _e, _f;
      const Y = ((_a3 = t.elements) == null ? void 0 : _a3.rawVal[L]) ?? [0, 1], B = g.rawVal[Y[0]], j = g.rawVal[Y[1]];
      if (!B || !j) return;
      const U = new F(...j).distanceTo(new F(...B)), me = Qi((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[$]), O = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, L)) ?? 0, q = Is(B, j, O), ae = Ts($, q), se = new F(...q.e1), ye = new F(...ae), he = new Oo().makeBasis(se, ye, se.clone().cross(ye)), [we, de] = Aa($, z), K = P[$] === Pa ? [we, -de] : [we, de], Z = K.map((G) => G / (me === 0 ? 1 : me)), I = new P[$](B, j, U, he, K, Z, false);
      I.updateScale(k() * _.rawVal), C.add(I);
    });
  }), ue.derive(() => {
    if (_.val, w.frameResults.rawVal == "none") return;
    w.gridSize.val;
    const $ = k();
    C.children.forEach((z) => z.updateScale($ * _.rawVal));
  }), ue.derive(() => {
    C.visible = w.frameResults.val != "none";
  }), C;
}
function Qi(t) {
  let w = 0;
  return t == null ? void 0 : t.forEach((g) => {
    const _ = Math.max(...(g ?? [0, 0]).map((k) => Math.abs(k)));
    _ > w && (w = _);
  }), w;
}
class ji extends ut {
  constructor(w, g, _) {
    super();
    const k = g === $a.reactions;
    _[0] && (this.xText1 = new Tt(`${k ? "Fx" : "Dx"}: ` + _[0].toFixed(4))), _[3] && (this.xText2 = new Tt(`${k ? "Mx" : "Rx"}: ` + _[3].toFixed(4))), _[1] && (this.yText1 = new Tt(`${k ? "Fy" : "Dy"}: ` + _[1].toFixed(4))), _[4] && (this.yText2 = new Tt(`${k ? "My" : "Ry"}: ` + _[4].toFixed(4))), _[2] && (this.zText1 = new Tt(`${k ? "Fz" : "Dz"}: ` + _[2].toFixed(4))), _[5] && (this.zText2 = new Tt(`${k ? "Mz" : "Rz"}: ` + _[5].toFixed(4))), (_[0] || _[3]) && (this.xArrow = new $n(new F(1, 0, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (_[1] || _[4]) && (this.yArrow = new $n(new F(0, 1, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (_[2] || _[5]) && (this.zArrow = new $n(new F(0, 0, 1), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...w), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(w) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(w, w, w), (_b = this.yArrow) == null ? void 0 : _b.scale.set(w, w, w), (_c = this.zArrow) == null ? void 0 : _c.scale.set(w, w, w), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * w, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * w, 0, 0.5 * w), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * w, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * w, 0.5 * w), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * w), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * w + 0.5 * w), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * w), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * w), (_l2 = this.yText1) == null ? void 0 : _l2.updateScale(0.4 * w), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * w), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * w), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * w);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var $a = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))($a || {});
function el(t, w, g, _) {
  const k = new ut();
  return ue.derive(() => {
    var _a2, _b;
    if (w.deformedShape.val, w.nodeResults.val == "none") return;
    k.children.forEach(($) => $.dispose()), k.clear();
    const C = $a[w.nodeResults.rawVal], P = 0.05 * w.gridSize.val;
    (_b = (_a2 = t.deformOutputs) == null ? void 0 : _a2.val[C]) == null ? void 0 : _b.forEach(($, z) => {
      const L = new ji(g.rawVal[z], C, $ ?? [0, 0, 0, 0, 0, 0]);
      L.updateScale(P * _.rawVal), k.add(L);
    });
  }), ue.derive(() => {
    if (_.val, w.nodeResults.rawVal == "none") return;
    const C = 0.05 * w.gridSize.val;
    k.children.forEach((P) => P.updateScale(C * _.rawVal));
  }), ue.derive(() => {
    k.visible = w.nodeResults.val != "none";
  }), k;
}
function tl({ drawingObj: t, gridObj: w, scene: g, getActiveCamera: _, controls: k, gridSize: C, derivedDisplayScale: P, rendererElm: $, viewerRender: z }) {
  var _a2;
  const L = new _a(), Y = new Si(), B = (e) => {
    const n = $.getBoundingClientRect(), a = e.clientX - n.left, o = e.clientY - n.top, s = n.width || 1, r = n.height || 1;
    if (!!window.__hekatanSplitMode) {
      const i = s / 2;
      if (a >= i) return Y.x = (a - i) / i * 2 - 1, Y.y = -(o / r) * 2 + 1, window.__hekatanSplitCamera ?? _();
      Y.x = a / i * 2 - 1;
    } else Y.x = a / s * 2 - 1;
    return Y.y = -(o / r) * 2 + 1, _();
  }, j = new ct(new An(1e4, 1e4), new wt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
  j.visible = true, j.frustumCulled = false, g.add(j);
  const U = (e, n, a) => {
    const o = new ct(new An(1e4, 1e4), new wt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
    return o.rotation.set(e, n, a), o.visible = false, o.frustumCulled = false, g.add(o), o;
  }, me = U(Math.PI / 2, 0, 0), O = U(0, Math.PI / 2, 0);
  let q = false, ae = null, se = null, ye = null;
  const he = new Et(new Ee(), new ft({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  he.name = "ref-ifc-cadena", he.renderOrder = 1e3, he.frustumCulled = false, he.visible = false, g.add(he);
  const we = (e, n, a) => Math.round(e * 1e3) + "," + Math.round(n * 1e3) + "," + Math.round(a * 1e3), de = (e) => {
    const n = /* @__PURE__ */ new Map();
    for (let a = 0; a + 0 < e.length / 6; a++) {
      const o = 6 * a;
      for (const s of [we(e[o], e[o + 1], e[o + 2]), we(e[o + 3], e[o + 4], e[o + 5])]) {
        const r = n.get(s);
        r ? r.push(a) : n.set(s, [a]);
      }
    }
    return n;
  }, K = (e) => {
    const { S: n, adj: a } = e, o = (x, b) => new F(n[6 * x + 3 * b], n[6 * x + 3 * b + 1], n[6 * x + 3 * b + 2]), s = /* @__PURE__ */ new Set([e.s]), r = (x, b) => {
      const E = [];
      let S = x, A = b;
      for (let R = 0; R < 3e3; R++) {
        const te = (a.get(we(A.x, A.y, A.z)) || []).filter((Ie) => !s.has(Ie));
        if (te.length !== 1) break;
        const V = te[0], N = o(V, 0), Q = o(V, 1), re = N.distanceTo(A) < Q.distanceTo(A) ? Q : N, ve = A.clone().sub(S).normalize(), Ge = re.clone().sub(A).normalize();
        if (ve.dot(Ge) < Math.cos(35 * Math.PI / 180)) break;
        s.add(V), E.push(re), S = A, A = re;
      }
      return E;
    }, f = o(e.s, 0), i = o(e.s, 1), l = r(f, i), d = r(i, f), c = [...d.reverse(), f, i, ...l], y = d.length;
    if (c.length < 6) return c;
    const p = [], h = [];
    for (let x = 1; x < c.length; x++) p.push(c[x].distanceTo(c[x - 1]));
    for (let x = 1; x < c.length - 1; x++) {
      const b = c[x].clone().sub(c[x - 1]).normalize(), E = c[x + 1].clone().sub(c[x]).normalize();
      h.push(Math.acos(Math.max(-1, Math.min(1, b.dot(E)))) / Math.max(1e-6, (p[x - 1] + p[x]) / 2));
    }
    const M = h.map((x, b) => {
      let E = 0, S = 0;
      for (let A = b - 1; A <= b + 1; A++) A >= 0 && A < h.length && (E += h[A], S++);
      return E / S;
    }), v = [];
    for (let x = 3; x < M.length - 3; x++) {
      const b = (M[x - 3] + M[x - 2] + M[x - 1]) / 3, E = (M[x + 1] + M[x + 2] + M[x + 3]) / 3, S = Math.min(b, E), A = Math.max(b, E);
      A > 0.03 && A / Math.max(S, 1e-6) > 2.2 && Math.abs(M[x] - (b + E) / 2) < A && (!v.length || x - v[v.length - 1] > 3) && v.push(x + 1);
    }
    let m = 0, u = c.length - 1;
    for (const x of v) x <= y && x > m && (m = x), x > y && x < u && (u = x);
    return c.slice(m, u + 1);
  }, Z = (e) => {
    if (ye = e, !e || e.length < 2) {
      he.visible = false;
      return;
    }
    he.geometry.dispose(), he.geometry = new Ee().setFromPoints(e), he.visible = true;
  }, I = (e) => {
    let n = 0;
    for (let y = 1; y < e.length - 1; y++) {
      const p = e[y].clone().sub(e[y - 1]).normalize(), h = e[y + 1].clone().sub(e[y]).normalize();
      n += Math.acos(Math.max(-1, Math.min(1, p.dot(h))));
    }
    const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (n < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const o = String(window.__hekatanArcModo ?? "angulo"), s = o === "x" ? 0 : o === "y" ? 1 : o === "z" ? 2 : -1, r = [0];
    for (let y = 1; y < e.length; y++) r.push(r[y - 1] + e[y].distanceTo(e[y - 1]));
    const f = (y, p) => {
      for (let h = 1; h < e.length; h++) {
        const M = y(e[h - 1], h - 1), v = y(e[h], h);
        if (M <= p && p <= v || v <= p && p <= M) {
          const m = Math.abs(v - M) < 1e-12 ? 0 : (p - M) / (v - M);
          return e[h - 1].clone().lerp(e[h], m);
        }
      }
      return e[e.length - 1].clone();
    }, i = [], l = s >= 0 ? e[0].getComponent(s) : 0, d = s >= 0 ? e[e.length - 1].getComponent(s) : 0, c = s >= 0 && Math.abs(d - l) > 1e-6 && e.every((y, p) => p === 0 || (y.getComponent(s) - e[p - 1].getComponent(s)) * (d - l) >= -1e-6);
    for (let y = 0; y <= a; y++) {
      const p = c ? f((h) => h.getComponent(s), l + (d - l) * y / a) : f((h, M) => r[M], r[r.length - 1] * y / a);
      i.push([p.x, p.y, p.z]);
    }
    return i[0] = e[0].toArray(), i[a] = e[e.length - 1].toArray(), i;
  };
  window.__hekatanCadenaIfc = () => (ye || []).map((e) => [e.x, e.y, e.z]);
  const G = /* @__PURE__ */ new Map(), X = (e) => {
    const n = G.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(o * 9), r = new Float64Array(o * 3), f = new Int32Array(o * 3).fill(-1);
    if (a) {
      e.updateMatrixWorld();
      const l = new F();
      for (let M = 0; M < o * 3; M++) l.fromBufferAttribute(a, M).applyMatrix4(e.matrixWorld), s[3 * M] = l.x, s[3 * M + 1] = l.y, s[3 * M + 2] = l.z;
      const d = new F(), c = new F(), y = new F(), p = (M) => Math.round(s[3 * M] * 1e3) + "," + Math.round(s[3 * M + 1] * 1e3) + "," + Math.round(s[3 * M + 2] * 1e3), h = /* @__PURE__ */ new Map();
      for (let M = 0; M < o; M++) {
        const v = 3 * M;
        d.set(s[3 * (v + 1)] - s[3 * v], s[3 * (v + 1) + 1] - s[3 * v + 1], s[3 * (v + 1) + 2] - s[3 * v + 2]), c.set(s[3 * (v + 2)] - s[3 * v], s[3 * (v + 2) + 1] - s[3 * v + 1], s[3 * (v + 2) + 2] - s[3 * v + 2]), y.crossVectors(d, c).normalize(), r[3 * M] = y.x, r[3 * M + 1] = y.y, r[3 * M + 2] = y.z;
        for (let m = 0; m < 3; m++) {
          const u = p(v + m), x = p(v + (m + 1) % 3), b = u < x ? u + "|" + x : x + "|" + u, E = h.get(b);
          E ? E.push(M, m) : h.set(b, [M, m]);
        }
      }
      for (const M of h.values()) M.length === 4 && (f[3 * M[0] + M[1]] = M[2], f[3 * M[2] + M[3]] = M[0]);
    }
    const i = { V: s, N: r, vec: f, n: o };
    return G.set(e.id, i), i;
  }, T = new ct(new Ee(), new wt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Vt }));
  T.name = "ref-ifc-cara", T.renderOrder = 999, T.frustumCulled = false, T.visible = false, g.add(T);
  let H = null;
  const pe = (e, n) => {
    const a = Math.cos(12 * Math.PI / 180), o = Math.cos(80 * Math.PI / 180), s = [e.N[3 * n], e.N[3 * n + 1], e.N[3 * n + 2]], r = new Uint8Array(e.n), f = [], i = [n];
    for (r[n] = 1; i.length && f.length < 4e4; ) {
      const l = i.pop();
      f.push(l);
      for (let d = 0; d < 3; d++) {
        const c = e.vec[3 * l + d];
        if (c < 0 || r[c]) continue;
        const y = e.N[3 * l] * e.N[3 * c] + e.N[3 * l + 1] * e.N[3 * c + 1] + e.N[3 * l + 2] * e.N[3 * c + 2], p = s[0] * e.N[3 * c] + s[1] * e.N[3 * c + 1] + s[2] * e.N[3 * c + 2];
        y >= a && p >= o && (r[c] = 1, i.push(c));
      }
    }
    return f;
  }, fe = (e, n, a) => {
    if (!e || n < 0 || !a) {
      H && (H = null, T.visible = false);
      return;
    }
    if (H && H.m === e && H.tris.indexOf(n) >= 0) {
      H.punto = a.clone();
      return;
    }
    const o = X(e), s = pe(o, n), r = new Float32Array(s.length * 9), f = new F();
    let i = true;
    s.forEach((l, d) => {
      for (let c = 0; c < 9; c++) r[9 * d + c] = o.V[9 * l + c];
      f.x += o.N[3 * l], f.y += o.N[3 * l + 1], f.z += o.N[3 * l + 2];
    }), f.normalize();
    for (const l of s) if (f.x * o.N[3 * l] + f.y * o.N[3 * l + 1] + f.z * o.N[3 * l + 2] < Math.cos(5 * Math.PI / 180)) {
      i = false;
      break;
    }
    T.geometry.dispose(), T.geometry = new Ee(), T.geometry.setAttribute("position", new xt(r, 3)), T.material.color.set(i ? 3718648 : 16096779), T.visible = true, H = { m: e, t0: n, tris: s, normal: f, plana: i, punto: a.clone() };
  }, oe = (e, n) => {
    const a = new Uint8Array(e.n);
    for (const c of n) a[c] = 1;
    const o = (c) => Math.round(e.V[3 * c] * 1e3) + "," + Math.round(e.V[3 * c + 1] * 1e3) + "," + Math.round(e.V[3 * c + 2] * 1e3), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const c of n) for (let y = 0; y < 3; y++) {
      const p = e.vec[3 * c + y];
      if (p >= 0 && a[p]) continue;
      const h = 3 * c + y, M = 3 * c + (y + 1) % 3, v = o(h), m = o(M);
      r.set(v, new F(e.V[3 * h], e.V[3 * h + 1], e.V[3 * h + 2])), r.set(m, new F(e.V[3 * M], e.V[3 * M + 1], e.V[3 * M + 2])), (s.get(v) || s.set(v, []).get(v)).push(m), (s.get(m) || s.set(m, []).get(m)).push(v);
    }
    const f = /* @__PURE__ */ new Set();
    let i = [];
    for (const c of s.keys()) {
      if (f.has(c)) continue;
      const y = [c];
      f.add(c);
      let p = "", h = c;
      for (let M = 0; M < 1e5; M++) {
        const v = (s.get(h) || []).find((m) => m !== p && !f.has(m));
        if (!v) break;
        y.push(v), f.add(v), p = h, h = v;
      }
      y.length > i.length && (i = y);
    }
    const l = i.map((c) => r.get(c)), d = [];
    for (let c = 0; c < l.length; c++) {
      const y = l[(c + l.length - 1) % l.length], p = l[c], h = l[(c + 1) % l.length];
      if (p.distanceTo(y) < 1e-3) continue;
      const M = p.clone().sub(y).normalize(), v = h.clone().sub(p).normalize();
      M.dot(v) > Math.cos(3 * Math.PI / 180) || d.push(p);
    }
    return d;
  }, W = (e, n, a) => {
    const s = new _a(n.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
    return s.length ? s[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, n, a, o = 2) => {
    const s = new F(e[0], e[1], e[2]), r = new F(n[0], n[1], n[2]).normalize();
    let f = null;
    for (const i of [1, -1]) {
      const d = new _a(s, r.clone().multiplyScalar(i), 0, o).intersectObjects(a, false);
      d.length && (f == null || d[0].distance < f) && (f = d[0].distance);
    }
    return f;
  }, window.__hekatanCaraIfc = () => H ? { tris: H.tris.length, plana: H.plana, normal: H.normal.toArray(), punto: H.punto.toArray(), contorno: oe(X(H.m), H.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const ge = /* @__PURE__ */ new Map(), ee = new jt(new Ee(), new ft({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  ee.name = "ref-ifc-bordes", ee.frustumCulled = false, ee.visible = false, g.add(ee);
  const $e = 1, xe = (e, n, a) => Math.floor(e / $e) + "," + Math.floor(n / $e) + "," + Math.floor(a / $e), be = (e) => {
    const n = ge.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = [], s = /* @__PURE__ */ new Map();
    if (a) {
      e.updateMatrixWorld();
      const f = Math.floor(a.count / 3), i = new Float64Array(a.count * 3), l = new F();
      for (let m = 0; m < a.count; m++) l.fromBufferAttribute(a, m).applyMatrix4(e.matrixWorld), i[3 * m] = l.x, i[3 * m + 1] = l.y, i[3 * m + 2] = l.z;
      const d = (m) => Math.round(i[3 * m] * 1e3) + "," + Math.round(i[3 * m + 1] * 1e3) + "," + Math.round(i[3 * m + 2] * 1e3), c = new Float64Array(f * 3), y = new F(), p = new F(), h = new F();
      for (let m = 0; m < f; m++) {
        const u = 3 * m, x = 3 * m + 1, b = 3 * m + 2;
        y.set(i[3 * x] - i[3 * u], i[3 * x + 1] - i[3 * u + 1], i[3 * x + 2] - i[3 * u + 2]), p.set(i[3 * b] - i[3 * u], i[3 * b + 1] - i[3 * u + 1], i[3 * b + 2] - i[3 * u + 2]), h.crossVectors(y, p).normalize(), c[3 * m] = h.x, c[3 * m + 1] = h.y, c[3 * m + 2] = h.z;
      }
      const M = /* @__PURE__ */ new Map();
      for (let m = 0; m < f; m++) for (let u = 0; u < 3; u++) {
        const x = 3 * m + u, b = 3 * m + (u + 1) % 3, E = d(x), S = d(b), A = E < S ? E + "|" + S : S + "|" + E, R = M.get(A);
        R ? R.push(m) : M.set(A, [m, x, b]);
      }
      const v = Math.cos(25 * Math.PI / 180);
      for (const m of M.values()) {
        const u = m[0], x = m[1], b = m[2];
        let E = m.length === 3;
        if (!E && m.length === 4) {
          const A = m[3], R = c[3 * u] * c[3 * A] + c[3 * u + 1] * c[3 * A + 1] + c[3 * u + 2] * c[3 * A + 2];
          E = Math.abs(R) < v;
        }
        if (!E) continue;
        const S = o.length / 6;
        o.push(i[3 * x], i[3 * x + 1], i[3 * x + 2], i[3 * b], i[3 * b + 1], i[3 * b + 2]);
        for (const [A, R, te] of [[i[3 * x], i[3 * x + 1], i[3 * x + 2]], [i[3 * b], i[3 * b + 1], i[3 * b + 2]], [(i[3 * x] + i[3 * b]) / 2, (i[3 * x + 1] + i[3 * b + 1]) / 2, (i[3 * x + 2] + i[3 * b + 2]) / 2]]) {
          const V = xe(A, R, te), N = s.get(V);
          N ? N[N.length - 1] !== S && N.push(S) : s.set(V, [S]);
        }
      }
    }
    const r = { segs: new Float32Array(o), celdas: s };
    return ge.set(e.id, r), r;
  };
  let _e = "";
  const Be = (e) => {
    const n = e.map((f) => f.id).join(",");
    if (n === _e) return;
    _e = n;
    const a = e.map((f) => be(f).segs);
    let o = 0;
    for (const f of a) o += f.length;
    const s = new Float32Array(o);
    let r = 0;
    for (const f of a) s.set(f, r), r += f.length;
    ee.geometry.dispose(), ee.geometry = new Ee(), ee.geometry.setAttribute("position", new xt(s, 3)), ee.visible = o > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    ee.visible = _e !== "" && window.__hekatanRefIfcBordes !== false, z();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const n of ge.values()) e += n.segs.length / 6;
    return e;
  };
  const Pe = (e, n) => {
    const a = window.__hekatanCursorPx;
    if (!a) return null;
    const o = be(e), s = o.segs, r = Math.floor(n.x / $e), f = Math.floor(n.y / $e), i = Math.floor(n.z / $e), l = /* @__PURE__ */ new Set();
    let d = zn, c = null, y = zn, p = null, h = -1;
    const M = new F(), v = new F();
    for (let m = -1; m <= 1; m++) for (let u = -1; u <= 1; u++) for (let x = -1; x <= 1; x++) {
      const b = o.celdas.get(r + m + "," + (f + u) + "," + (i + x));
      if (b) for (const E of b) {
        if (l.has(E)) continue;
        l.add(E);
        const S = 6 * E;
        M.set(s[S], s[S + 1], s[S + 2]), v.set(s[S + 3], s[S + 4], s[S + 5]);
        const A = Bn(M.x, M.y, M.z), R = Bn(v.x, v.y, v.z);
        if (!A || !R) continue;
        const te = Math.hypot(A.x - a.x, A.y - a.y), V = Math.hypot(R.x - a.x, R.y - a.y);
        te < d && (d = te, c = M.clone()), V < d && (d = V, c = v.clone());
        const N = R.x - A.x, Q = R.y - A.y, re = N * N + Q * Q || 1e-9;
        let ve = ((a.x - A.x) * N + (a.y - A.y) * Q) / re;
        ve = Math.max(0, Math.min(1, ve));
        const Ge = Math.hypot(a.x - (A.x + ve * N), a.y - (A.y + ve * Q));
        Ge < y && (y = Ge, p = M.clone().lerp(v, ve), h = E);
      }
    }
    return h >= 0 && (o.adj || (o.adj = de(o.segs)), se = { S: o.segs, adj: o.adj, s: h }), c ? { tipo: "ifcVert", punto: c } : p ? { tipo: "ifcEdge", punto: p } : null;
  }, nt = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((r) => {
      var _a4;
      ((_a4 = r.userData) == null ? void 0 : _a4.refIfc) && r.isMesh && e.push(r);
    }), !e.length) return ee.visible = false, _e = "", null;
    Be(e);
    const n = L.intersectObjects(e, false).filter((r) => {
      const f = r.object.material;
      return (f && f.clippingPlanes || []).every((l) => l.distanceToPoint(r.point) >= 0);
    });
    if (!n.length) return null;
    const a = n[0], o = n[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? fe(a.object, a.faceIndex ?? -1, a.point) : H && fe(null, -1, null);
    const s = Pe(a.object, a.point);
    if (s) return ae = { tipo: s.tipo }, [{ ...a, point: s.punto }];
    if (o && o.object === a.object && o.distance - a.distance <= 1.2) {
      const r = a.point.clone().add(o.point).multiplyScalar(0.5);
      return ae = { tipo: "ifcAxis" }, [{ ...a, point: r }];
    }
    return ae = { tipo: "ifc" }, [a];
  };
  let st = "", Ne = new Float32Array(0);
  const D = new jt(new Ee(), new ft({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  D.name = "ref-ifc-seccion", D.renderOrder = 998, D.frustumCulled = false, D.visible = false, g.add(D);
  const J = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return D.visible = false, Ne = new Float32Array(0);
    const n = [];
    e.enableX && n.push([0, +e.posX]), e.enableY && n.push([1, +e.posY]), e.enableZ && n.push([2, +e.posZ]);
    const a = [];
    g.traverse((r) => {
      var _a3;
      ((_a3 = r.userData) == null ? void 0 : _a3.refIfc) && r.isMesh && a.push(r);
    });
    const o = JSON.stringify(n) + "|" + a.map((r) => r.id).join(",");
    if (o === st) return Ne;
    st = o;
    const s = [];
    if (n.length && a.length) {
      const r = [new F(), new F(), new F()];
      for (const f of a) {
        const i = f.geometry.getAttribute("position");
        if (i) {
          f.updateMatrixWorld();
          for (let l = 0; l + 2 < i.count; l += 3) {
            for (let d = 0; d < 3; d++) r[d].fromBufferAttribute(i, l + d).applyMatrix4(f.matrixWorld);
            for (const [d, c] of n) {
              const y = [r[0].getComponent(d) - c, r[1].getComponent(d) - c, r[2].getComponent(d) - c], p = [];
              for (let h = 0; h < 3; h++) {
                const M = r[h], v = r[(h + 1) % 3], m = y[h], u = y[(h + 1) % 3];
                (m < 0 && u >= 0 || m >= 0 && u < 0) && p.push(M.clone().lerp(v, m / (m - u)));
              }
              p.length === 2 && s.push(p[0].x, p[0].y, p[0].z, p[1].x, p[1].y, p[1].z);
            }
          }
        }
      }
    }
    return Ne = new Float32Array(s), D.geometry.dispose(), D.geometry = new Ee(), D.geometry.setAttribute("position", new xt(Ne, 3)), D.visible = Ne.length > 0, Ne;
  };
  let le = null, ie = null;
  const Me = (e, n) => {
    const a = J();
    if (!a.length) return null;
    let o = zn * 2, s = null, r = -1;
    const f = new F(), i = new F();
    for (let l = 0; l + 5 < a.length; l += 6) {
      f.set(a[l], a[l + 1], a[l + 2]), i.set(a[l + 3], a[l + 4], a[l + 5]);
      const d = Bn(f.x, f.y, f.z), c = Bn(i.x, i.y, i.z);
      if (!d || !c) continue;
      const y = c.x - d.x, p = c.y - d.y, h = y * y + p * p || 1e-9;
      let M = ((e - d.x) * y + (n - d.y) * p) / h;
      M = Math.max(0, Math.min(1, M));
      const v = Math.hypot(e - (d.x + M * y), n - (d.y + M * p));
      v < o && (o = v, s = f.clone().lerp(i, M), r = l / 6);
    }
    return r >= 0 && (ie !== a && (le = de(a), ie = a), se = { S: a, adj: le, s: r }), s;
  };
  let Se = null;
  window.__hekatanSeccionIfc = () => J().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const n = J(), a = [], o = Math.max(1, Math.floor(n.length / 6 / e));
    for (let s = 0; s + 2 < n.length; s += 6 * o) a.push([n[s], n[s + 1], n[s + 2]]);
    return a;
  };
  const De = () => {
    ae = null;
    const e = nt();
    if (e) return e;
    if (q) return L.intersectObjects([j], false);
    if (me.visible = !!window.__hekatanGridPlaneXZ, O.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Zt.visible) {
      const o = L.intersectObjects([Zt, Wt, cn], false);
      if (o.length > 0) return o;
    }
    const a = [j];
    return me.visible && a.push(me), O.visible && a.push(O), _n.visible && qn.length > 0 && a.push(...qn), L.intersectObjects(a, false);
  }, Fe = new Go(new Ee(), new Ko()), He = new Go(new Ee(), new Ko({ color: "gray", sizeAttenuation: false, size: 6 })), Ze = new Go(new Ee(), new Ko({ color: "orange", sizeAttenuation: false, size: 5 }));
  g.add(Ze);
  const ke = document.createElement("input");
  ke.id = "hk-rubber-label", ke.type = "text", ke.spellcheck = false, ke.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, ke.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(ke);
  const Re = document.createElement("div");
  Re.id = "hk-rubber-angle", Re.style.cssText = ["position:fixed", "z-index:99996", "pointer-events:none", "padding:2px 6px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px", "font-family:Consolas,monospace", "font-size:12px", "transform:translate(-50%,0)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Re);
  let Ye = null, lt = null, je = false;
  const gt = new F(), yt = (e, n, a, o, s, r) => {
    const f = o - e, i = s - n, l = r - a, d = Math.hypot(f, i, l);
    if (d < 0.01) {
      ke.style.display = "none";
      return;
    }
    Ye = [e, n, a], lt = [f / d, i / d, l / d], gt.set((e + o) / 2, (n + s) / 2, (a + r) / 2), gt.project(_());
    const c = $.getBoundingClientRect(), y = c.left + (gt.x * 0.5 + 0.5) * c.width, p = c.top + (-gt.y * 0.5 + 0.5) * c.height;
    ke.style.left = y + "px", ke.style.top = p + "px", ke.style.display = "block";
    const h = new F(e, n, a).project(_()), M = new F(o, s, r).project(_()), v = c.left + (h.x * 0.5 + 0.5) * c.width, m = c.top + (-h.y * 0.5 + 0.5) * c.height, u = c.left + (M.x * 0.5 + 0.5) * c.width, x = c.top + (-M.y * 0.5 + 0.5) * c.height;
    let b = Math.atan2(-(x - m), u - v) * 180 / Math.PI;
    if (b < 0 && (b += 360), Re.textContent = `${Math.round(b) % 360}\xB0`, Re.style.left = u + "px", Re.style.top = x + 34 + "px", Re.style.display = "block", !je) {
      if (ke.value = `${d.toFixed(2)} m`, document.activeElement !== ke) {
        const E = document.activeElement;
        E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA") && E !== ke || ke.focus({ preventScroll: true });
      }
      try {
        ke.select();
      } catch {
      }
    }
  }, pn = () => {
    ke.style.display = "none", Re.style.display = "none", Ye = null, lt = null, je = false, document.activeElement === ke && ke.blur();
  }, _t = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (n === "offset") {
      Nn = e, ce(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), ke.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (n === "circle" && We.length === 1) {
      const c = We[0];
      We = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, c[0], c[1], c[2], e), ce(`\u2713 C\xEDrculo r=${e} m en (${c[0].toFixed(2)}, ${c[1].toFixed(2)}, ${c[2].toFixed(2)}).`);
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
    if (n === "col" || n === "wall" || n === "extp" || n === "extl") {
      Ct = e, ce(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[n]}.`), ke.blur();
      return;
    }
    if (!Ye || !lt || !t.polylines) return;
    let a = lt[0], o = lt[1], s = lt[2];
    zt === "x" ? (a = Math.sign(a) || 1, o = 0, s = 0) : zt === "y" ? (a = 0, o = Math.sign(o) || 1, s = 0) : zt === "z" && (a = 0, o = 0, s = Math.sign(s) || 1);
    const r = Ye[0] + a * e, f = Ye[1] + o * e, i = Ye[2] + s * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [r, f, i]];
    const l = t.polylines.rawVal, d = l.length ? l[l.length - 1] : [];
    t.polylines.val = [...l.slice(0, -1), [...d, t.points.rawVal.length - 1]], ke.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    z();
  }, Le = (e) => {
    let n = e.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!n) return null;
    const a = n.startsWith("@");
    if (a && (n = n.slice(1)), n.includes("<")) {
      const s = n.split("<").map((r) => parseFloat(r.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [r, f] = s;
        return a ? { kind: "relPolar", L: r, ang: f } : { kind: "absPolar", L: r, ang: f };
      }
      if (s.length === 3 && a) {
        const [r, f, i] = s;
        return { kind: "relSpherical", L: r, az: f, el: i };
      }
      return null;
    }
    if (n.includes(",")) {
      const s = n.split(",").map((l) => parseFloat(l.trim()));
      if (s.some(isNaN)) return null;
      const [r, f, i = 0] = s;
      return a ? { kind: "relCart", dx: r, dy: f, dz: i } : { kind: "absCart", x: r, y: f, z: i };
    }
    const o = parseFloat(n);
    return isNaN(o) || o <= 0 ? null : { kind: "length", L: o };
  }, ot = (e) => {
    if (!e) return null;
    const n = window.__hekatanSCU ?? [0, 0, 0];
    if (e.kind === "absCart") return [n[0] + e.x, n[1] + e.y, n[2] + e.z];
    if (e.kind === "relCart") return Ye ? [Ye[0] + e.dx, Ye[1] + e.dy, Ye[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const a = e.ang * Math.PI / 180;
      return [n[0] + e.L * Math.cos(a), n[1] + e.L * Math.sin(a), n[2]];
    }
    if (e.kind === "relPolar") {
      if (!Ye) return null;
      const a = e.ang * Math.PI / 180;
      return [Ye[0] + e.L * Math.cos(a), Ye[1] + e.L * Math.sin(a), Ye[2]];
    }
    if (e.kind === "relSpherical") {
      if (!Ye) return null;
      const a = e.az * Math.PI / 180, o = e.el * Math.PI / 180, s = e.L * Math.cos(o);
      return [Ye[0] + s * Math.cos(a), Ye[1] + s * Math.sin(a), Ye[2] + e.L * Math.sin(o)];
    }
    return null;
  }, Oe = (e) => {
    var _a3, _b;
    wa(new F(e[0], e[1], e[2]), null), Ye = e, je = false;
    try {
      ke.select();
    } catch {
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    z();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (e) => {
    var _a3;
    const n = Le(e);
    if (!n) return false;
    if (n.kind === "length") return _t(n.L), true;
    const a = ot(n);
    if (!a) return false;
    wa(new F(a[0], a[1], a[2]), null), Ye = a, ke.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, ke.addEventListener("keydown", (e) => {
    var _a3, _b, _c;
    if (e.key === "Enter") {
      if (e.preventDefault(), !je) {
        (_a3 = window.__hekatanFinalizeDraw) == null ? void 0 : _a3.call(window);
        try {
          (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c.call(_b, "select");
        } catch {
        }
        return;
      }
      const a = Le(ke.value);
      if (!a) return;
      if (je = false, a.kind === "length") _t(a.L), ce(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const o = ot(a);
        if (!o) return;
        Oe(o);
        const s = a.kind;
        ce(`\u270F ${s} \u2192 (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), je = false, ke.blur();
      return;
    }
    const n = e.key.toLowerCase();
    if (n === "x" || n === "y" || n === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!je && ke.style.display === "block") try {
          ke.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (je = true);
  }), window.addEventListener("keydown", (e) => {
    if (!Ye || !lt || document.activeElement === ke) return;
    const n = document.activeElement;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (ke.value = e.key, ke.focus(), ke.setSelectionRange(1, 1), e.preventDefault());
  });
  const ze = document.createElement("div");
  ze.id = "hk-coord-readout", ze.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ze.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ze);
  const Ve = document.createElement("div");
  Ve.id = "hk-coord-fixed", Ve.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Ve.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Ve);
  const qe = new Et(new Ee().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new eo({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  qe.frustumCulled = false, qe.visible = false, qe.name = "rubberBand", g.add(qe), window.__hekatanRubberBand = qe;
  const Te = new Et(new Ee(), new ft({ color: 2282478, transparent: true, opacity: 0.9 }));
  Te.frustumCulled = false, Te.visible = false, g.add(Te);
  let at = [];
  const it = new Et(new Ee(), new ft({ color: 16763904, transparent: true, opacity: 0.95 }));
  it.frustumCulled = false, it.visible = false, it.renderOrder = 999, g.add(it);
  let pt = [];
  const et = document.createElement("div");
  et.id = "hk-measure-label", et.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(et);
  const rt = (e) => {
    var _a3, _b;
    const n = B(e);
    if (!n) return null;
    L.setFromCamera(Y, n);
    let a = null, o = null;
    const s = L.intersectObjects(g.children, true).filter((p) => p.object.isMesh && p.object !== bt && p.object !== dt && p.object.visible !== false);
    if (s.length) {
      const p = s[0], h = p.point;
      a = [h.x, h.y, h.z];
      const v = (_b = (_a3 = p.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      v && p.face && (o = [p.face.a, p.face.b, p.face.c].map((m) => {
        const u = new F().fromBufferAttribute(v, m);
        return p.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const p = De();
      if (p.length) {
        const h = p[0].point;
        a = [h.x, h.y, h.z];
      }
    }
    if (!a) return null;
    const r = $.getBoundingClientRect(), f = (p) => {
      const h = new F(p[0], p[1], p[2]).project(n);
      return [r.left + (h.x * 0.5 + 0.5) * r.width, r.top + (-h.y * 0.5 + 0.5) * r.height];
    }, i = [e.clientX, e.clientY], l = 14;
    let d = a, c = l;
    const y = (p) => {
      const h = f(p), M = Math.hypot(h[0] - i[0], h[1] - i[1]);
      M < c && (c = M, d = p);
    };
    for (const p of o ?? []) y(p);
    for (const p of t.points.rawVal) y(p);
    return d;
  }, Ft = () => {
    if (pt.length < 1) {
      et.style.display = "none";
      return;
    }
    const e = _(), n = pt[0], a = pt[1] ?? pt[0], s = new F((n[0] + a[0]) / 2, (n[1] + a[1]) / 2, (n[2] + a[2]) / 2).clone().project(e), r = $.getBoundingClientRect();
    et.style.left = r.left + (s.x * 0.5 + 0.5) * r.width + "px", et.style.top = r.top + (-s.y * 0.5 + 0.5) * r.height - 14 + "px", et.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Ft, window.__hekatanClearMeasure = () => {
    pt = [], it.visible = false, et.style.display = "none";
    try {
      z();
    } catch {
    }
  };
  try {
    (_a2 = k.addEventListener) == null ? void 0 : _a2.call(k, "change", Ft);
  } catch {
  }
  const dt = new ct(new Ee(), new wt({ color: 16096779, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }));
  dt.frustumCulled = false, dt.visible = false, dt.renderOrder = 998, dt.name = "hk-fill-preview", g.add(dt), $.addEventListener("pointerleave", () => {
    ze.style.display = "none", dt.visible && (dt.visible = false, z());
  });
  const Kt = (e) => {
    var _a3, _b, _c, _d;
    const n = t.points.rawVal, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Map(), s = (m, u) => {
      m !== u && ((o.get(m) ?? o.set(m, /* @__PURE__ */ new Set()).get(m)).add(u), (o.get(u) ?? o.set(u, /* @__PURE__ */ new Set()).get(u)).add(m));
    };
    for (const m of a) for (let u = 0; u + 1 < m.length; u++) s(m[u], m[u + 1]);
    const r = (m, u) => {
      var _a4;
      return !!((_a4 = o.get(m)) == null ? void 0 : _a4.has(u));
    }, f = [], i = /* @__PURE__ */ new Set(), l = [...o.keys()];
    for (const m of l) for (const u of o.get(m)) if (!(u < m)) {
      for (const x of o.get(u)) if (x !== m) for (const b of o.get(x)) {
        if (b === m || b === u || !r(b, m) || r(m, x) || r(u, b)) continue;
        const E = [m, u, x, b].slice().sort((S, A) => S - A).join("-");
        i.has(E) || (i.add(E), f.push([m, u, x, b]));
      }
    }
    for (const m of l) for (const u of o.get(m)) if (!(u < m)) for (const x of o.get(u)) {
      if (x === m || !r(x, m)) continue;
      const b = [m, u, x].slice().sort((E, S) => E - S).join("-");
      i.has(b) || (i.add(b), f.push([m, u, x]));
    }
    const d = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", c = (m) => d === "xy" ? [m[0], m[1]] : d === "xz" ? [m[0], m[2]] : [m[1], m[2]], y = c(e), p = (m, u) => {
      let x = false;
      for (let b = 0, E = u.length - 1; b < u.length; E = b++) {
        const S = u[b][0], A = u[b][1], R = u[E][0], te = u[E][1];
        A > m[1] != te > m[1] && m[0] < (R - S) * (m[1] - A) / (te - A) + S && (x = !x);
      }
      return x;
    }, h = (m) => {
      let u = 0;
      for (let x = 0, b = m.length - 1; x < m.length; b = x++) u += (m[b][0] + m[x][0]) * (m[b][1] - m[x][1]);
      return Math.abs(u) / 2;
    };
    let M = null, v = 1 / 0;
    for (const m of f) {
      const u = m.map((b) => c(n[b]));
      if (!p(y, u)) continue;
      const x = h(u);
      x < v && (v = x, M = m);
    }
    return M;
  }, kt = new ut(), Yt = new ct(new An(1, 1), new wt({ color: 2282478, transparent: true, opacity: 0.08, side: Vt, depthWrite: false })), en = new jt(new fs(new An(1, 1)), new ft({ color: 2282478, transparent: true, opacity: 0.85 })), Pt = new jt(new Ee(), new ft({ color: 2282478, transparent: true, opacity: 0.3 })), bo = (e, n) => {
    const a = [], o = Math.ceil(e / n);
    for (let s = -o; s <= o; s++) {
      const r = s * n;
      a.push(-e, r, 0, e, r, 0), a.push(r, -e, 0, r, e, 0);
    }
    Pt.geometry.dispose(), Pt.geometry = new Ee(), Pt.geometry.setAttribute("position", new It(a, 3));
  };
  kt.add(Yt, en, Pt), kt.visible = false, kt.frustumCulled = false, g.add(kt);
  const Xt = new ut();
  Xt.frustumCulled = false, Xt.visible = false, g.add(Xt);
  const Ln = (e) => {
    const n = new Ee().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), a = new eo({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Et(n, a);
  }, bn = Ln(16711680), fn = Ln(65280), Vn = Ln(35071);
  Xt.add(bn, fn, Vn);
  const Un = [], jo = (e) => e.traverse((n) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = n.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Ut = Ln(16761856);
  Ut.material.dashSize = 0.28, Ut.material.gapSize = 0.16, Ut.material.opacity = 0.9, Ut.frustumCulled = false, Ut.visible = false, Ut.renderOrder = 98, g.add(Ut);
  const no = (e) => {
    const n = new Ee().setFromPoints([new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0)]), a = new ft({ color: e, transparent: true, opacity: 0.2, depthTest: false }), o = new Cs(n, a);
    return o.renderOrder = 997, o.frustumCulled = false, o;
  }, In = no(3462041), Zn = no(16724804), Tn = no(6333946), hn = new ut();
  hn.frustumCulled = false, hn.visible = false, g.add(hn), hn.add(In, Zn, Tn);
  const oo = (e) => {
    const n = new An(1, 1), a = new wt({ color: e, transparent: true, opacity: 0.06, side: Vt, depthWrite: false }), o = new ct(n, a);
    return o.frustumCulled = false, o.renderOrder = 996, o;
  }, Zt = oo(3462041), Wt = oo(16724804), cn = oo(6333946);
  hn.add(Zt, Wt, cn);
  const Mn = (e, n, a, o) => {
    e.scale.set(2 * o, 2 * o, 1), a === "xy" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, 0, 0)) : a === "xz" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, mn = document.createElement("div");
  mn.id = "hk-refplane-badge", mn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(mn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = e, hn.visible = e, e) {
      const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0], f = window.__hekatanOrthoExt ?? 8;
      vn(In, r, "xy", f), vn(Zn, r, "xz", f), vn(Tn, r, "yz", f), Mn(Zt, r, "xy", f), Mn(Wt, r, "xz", f), Mn(cn, r, "yz", f), Zt.material.opacity = 0.05, Wt.material.opacity = 0.05, cn.material.opacity = 0.05;
    } else {
      const n = document.getElementById("hk-refplane-badge");
      n && (n.style.display = "none");
    }
    z();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a3;
    if (window.__hekatanOrthoExt = e, !hn.visible) {
      z();
      return;
    }
    const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0];
    vn(In, r, "xy", e), vn(Zn, r, "xz", e), vn(Tn, r, "yz", e), Mn(Zt, r, "xy", e), Mn(Wt, r, "xz", e), Mn(cn, r, "yz", e), z();
  };
  const La = (e) => {
    if (Zt.material.opacity = e === "xy" ? 0.09 : 0.025, Wt.material.opacity = e === "xz" ? 0.09 : 0.025, cn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      mn.style.background = s.bg, mn.style.color = s.text, mn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, mn.style.display = "block";
    } else mn.style.display = "none";
  }, vn = (e, n, a, o) => {
    let s;
    a === "xy" ? s = [new F(n[0] - o, n[1] - o, n[2]), new F(n[0] + o, n[1] - o, n[2]), new F(n[0] + o, n[1] + o, n[2]), new F(n[0] - o, n[1] + o, n[2]), new F(n[0] - o, n[1] - o, n[2])] : a === "xz" ? s = [new F(n[0] - o, n[1], n[2] - o), new F(n[0] + o, n[1], n[2] - o), new F(n[0] + o, n[1], n[2] + o), new F(n[0] - o, n[1], n[2] + o), new F(n[0] - o, n[1], n[2] - o)] : s = [new F(n[0], n[1] - o, n[2] - o), new F(n[0], n[1] + o, n[2] - o), new F(n[0], n[1] + o, n[2] + o), new F(n[0], n[1] - o, n[2] + o), new F(n[0], n[1] - o, n[2] - o)], e.geometry.setFromPoints(s);
  };
  let zt = null;
  window.__hekatanAxisLock = () => zt;
  let Mo = null, Rt = null;
  const Dt = document.createElement("div");
  Dt.id = "hk-axis-lock-badge", Dt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Dt);
  const Va = () => {
    if (!zt) {
      Dt.style.display = "none";
      return;
    }
    const e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Dt.style.background = "rgba(15,23,42,0.92)", Dt.style.color = e[zt], Dt.style.border = `1.5px solid ${e[zt]}`, Dt.textContent = `\u{1F512} LOCK ${zt.toUpperCase()}`, Dt.style.display = "block";
  };
  window.addEventListener("keydown", (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    const n = document.activeElement;
    if (n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n !== ke) return;
    const a = e.key.toLowerCase(), o = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && o === "polyarea" && at.length >= 3) {
      const s = Eo();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") zt = zt === a ? null : a, Va(), e.preventDefault();
    else if (e.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), os(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || Ro(), ce(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (Xt.visible = false), ce(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a3;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const e = window.__hekatanOrthoMode;
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      let n = document.getElementById("hk-ortho-frame");
      n || (n = document.createElement("div"), n.id = "hk-ortho-frame", n.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(n)), n.style.display = e ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = e ? "block" : "none";
    }
  };
  const vo = new F(), _o = new F(), Ia = new F(), Ds = (e) => {
    if (!zt) return null;
    const n = e[0], a = e[1], o = e[2];
    return zt === "x" ? (vo.set(n - 1e4, a, o), _o.set(n + 1e4, a, o)) : zt === "y" ? (vo.set(n, a - 1e4, o), _o.set(n, a + 1e4, o)) : (vo.set(n, a, o - 1e4), _o.set(n, a, o + 1e4)), L.ray.distanceSqToSegment(vo, _o, null, Ia), Ia;
  };
  window.__hekatanProjectOnAxis = Ds;
  const qt = new Et(new Ee().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new ft({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  qt.renderOrder = 998, qt.frustumCulled = false, qt.visible = false, g.add(qt);
  let dn = -1, Sn = -1, Pn = -1;
  const Ke = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ke;
  const wn = new Et(new Ee().setFromPoints([new F(), new F()]), new ft({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  wn.renderOrder = 997, wn.frustumCulled = false, wn.visible = false, g.add(wn);
  const tn = new ct(new to(0.02, 12, 12), new wt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  tn.renderOrder = 998, tn.visible = false, g.add(tn);
  const ko = (e) => {
    const n = _();
    if (n.isOrthographicCamera) {
      const o = n, s = (o.top - o.bottom) / o.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = n.position.distanceTo(e);
    return Math.max(0.05, a / 10);
  }, Ta = () => {
    tn.visible && tn.scale.setScalar(ko(tn.position));
  }, yn = new ut();
  yn.frustumCulled = false, g.add(yn);
  const So = 2282478;
  let xn = null;
  const Bs = (e, n, a, o) => {
    if (!t.points) return -1;
    const s = t.points.rawVal;
    let r = -1, f = o;
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      if (!l) continue;
      const d = Math.hypot(e - l[0], n - l[1], a - l[2]);
      d < f && (f = d, r = i);
    }
    return r;
  }, nn = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; yn.children.length; ) {
      const f = yn.children.pop();
      (_b = (_a3 = f.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = f.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], n = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], o = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const f of Ke) {
      const [i, ...l] = f.split(":");
      if (i === "pt") {
        const d = e[+l[0]];
        if (!d) continue;
        const c = new ct(new to(0.025, 12, 12), new wt({ color: So, transparent: true, opacity: 0.9, depthTest: false }));
        c.position.set(d[0], d[1], d[2]), c.renderOrder = 999, c.__isSelectionPt = true, yn.add(c);
      } else if (i === "seg") {
        const d = n[+l[0]], c = e[d == null ? void 0 : d[+l[1]]], y = e[d == null ? void 0 : d[+l[1] + 1]];
        if (!c || !y) continue;
        const p = new Ee().setFromPoints([new F(c[0], c[1], c[2]), new F(y[0], y[1], y[2])]), h = new Et(p, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        h.renderOrder = 999, yn.add(h);
      } else if (i === "poly") {
        const c = n[+l[0]].map((h) => {
          const M = e[h];
          return M ? new F(M[0], M[1], M[2]) : null;
        }).filter(Boolean);
        if (c.length < 2) continue;
        const y = new Ee().setFromPoints(c), p = new Et(y, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        p.renderOrder = 999, yn.add(p);
      } else if (i === "aux") {
        const d = o[+l[0]];
        if (!d || d.length !== 6) continue;
        const c = new Ee().setFromPoints([new F(d[0], d[1], d[2]), new F(d[3], d[4], d[5])]), y = new Et(c, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        y.renderOrder = 999, yn.add(y);
      }
    }
    const s = window.__hekatanUpdateSelectionPtScale;
    s && s();
    const r = window.__hekatanRefreshPropsPane;
    r && r();
    try {
      (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
    } catch {
    }
    z();
  };
  window.__hekatanRefreshSelection = nn, window.__hekatanSelectIds = (e) => {
    var _a3;
    Ke.clear();
    for (const n of e) Ke.add(n);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), Ke.size;
  }, window.__hekatanClearSelection = () => {
    Ke.clear(), nn();
  };
  const ao = (e, n, a, o, s, r, f, i, l) => {
    const d = f - o, c = i - s, y = l - r, p = d * d + c * c + y * y;
    if (p < 1e-12) return Math.hypot(e - o, n - s, a - r);
    let h = ((e - o) * d + (n - s) * c + (a - r) * y) / p;
    h = Math.max(0, Math.min(1, h));
    const M = o + h * d, v = s + h * c, m = r + h * y;
    return Math.hypot(e - M, n - v, a - m);
  }, ea = (e, n, a, o) => {
    if (!t.polylines) return null;
    const s = t.polylines.rawVal, r = t.points.rawVal;
    let f = -1, i = -1, l = o;
    for (let d = 0; d < s.length; d++) {
      const c = s[d];
      for (let y = 0; y < c.length - 1; y++) {
        const p = r[c[y]], h = r[c[y + 1]];
        if (!p || !h) continue;
        const M = ao(e, n, a, p[0], p[1], p[2], h[0], h[1], h[2]);
        M < l && (l = M, f = d, i = y);
      }
    }
    return f >= 0 ? { polyIdx: f, segIdx: i, dist: l } : null;
  }, Ra = (e, n, a, o) => {
    const s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let f = -1, i = o;
    for (let l = 0; l < r.length; l++) {
      const d = r[l];
      if (!d || d.length !== 6) continue;
      const c = ao(e, n, a, d[0], d[1], d[2], d[3], d[4], d[5]);
      c < i && (i = c, f = l);
    }
    return f;
  }, Ns = (e) => {
    const n = window.__hekatanDrawingAuxLines, o = ((n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [])[e];
    if (!o || o.length !== 6) {
      qt.visible = false;
      return;
    }
    qt.geometry.setFromPoints([new F(o[0], o[1], o[2]), new F(o[3], o[4], o[5])]), qt.visible = true;
  }, Ys = (e, n = -1) => {
    var _a3, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal[e], o = t.points.rawVal;
    if (!a || a.length < 2) {
      qt.visible = false;
      return;
    }
    const s = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, r = [];
    if (s || n < 0 || n >= a.length - 1) for (const f of a) {
      const i = o[f];
      i && r.push(new F(i[0], i[1], i[2]));
    }
    else {
      const f = o[a[n]], i = o[a[n + 1]];
      f && r.push(new F(f[0], f[1], f[2])), i && r.push(new F(i[0], i[1], i[2]));
    }
    qt.geometry.setFromPoints(r), qt.visible = true;
  }, Po = (e) => {
    var _a3;
    if (!t.polylines) return;
    const n = t.polylines.rawVal;
    if (e < 0 || e >= n.length) return;
    const a = n.filter((l, d) => d !== e), o = /* @__PURE__ */ new Set();
    for (const l of a) for (const d of l) o.add(d);
    const s = t.points.rawVal, r = /* @__PURE__ */ new Map(), f = [];
    for (let l = 0; l < s.length; l++) o.has(l) && (r.set(l, f.length), f.push(s[l]));
    const i = a.map((l) => l.map((d) => r.get(d)).filter((d) => d !== void 0));
    t.points.val = f, t.polylines.val = i, t.areas && (t.areas.val = t.areas.rawVal.filter((l) => l !== e).map((l) => l > e ? l - 1 : l)), qt.visible = false, dn = -1, Sn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, Da = (e, n) => {
    var _a3, _b, _c;
    if (!t.polylines) return;
    const a = t.polylines.rawVal;
    if (e < 0 || e >= a.length) return;
    if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      Po(e);
      return;
    }
    const s = a[e];
    if (n < 0 || n >= s.length - 1) return;
    if (s.length === 2) {
      Po(e);
      return;
    }
    let r;
    n === 0 ? r = [s.slice(1)] : n === s.length - 2 ? r = [s.slice(0, -1)] : r = [s.slice(0, n + 1), s.slice(n + 1)];
    const f = [...a.slice(0, e), ...r, ...a.slice(e + 1)], i = /* @__PURE__ */ new Set();
    for (const p of f) for (const h of p) i.add(h);
    const l = t.points.rawVal, d = /* @__PURE__ */ new Map(), c = [];
    for (let p = 0; p < l.length; p++) i.has(p) && (d.set(p, c.length), c.push(l[p]));
    const y = f.map((p) => p.map((h) => d.get(h)).filter((h) => h !== void 0));
    if (t.points.val = c, t.polylines.val = y, t.areas) {
      const p = r.length - 1;
      t.areas.val = t.areas.rawVal.map((h) => h > e ? h + p : h);
    }
    qt.visible = false, dn = -1, Sn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Fe.geometry.setAttribute("position", new It(t.points.rawVal.flat(), 3)), Fe.geometry.computeBoundingSphere(), Fe.frustumCulled = false, He.frustumCulled = false, g.add(He), j.position.set(0, 0, 0), j.rotateX(Math.PI / 2), j.geometry.rotateX(Math.PI / 2), j.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, n, a) => {
    if (t.points.val = [...t.points.rawVal, [e, n, a]], t.polylines) {
      const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
      t.polylines.val = [...o.slice(0, -1), [...s, t.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a3;
    if (!t.polylines) return;
    const e = t.polylines.rawVal;
    ((_a3 = e[e.length - 1]) == null ? void 0 : _a3.length) !== 0 && (t.polylines.val = [...e, []]);
  };
  const zo = [];
  window.__hekatanCirculos = zo;
  let Ba = [], Na = "";
  const Ya = () => {
    var _a3;
    const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = `${e.length}|${n.length}|${n.reduce((s, r) => s + r.length, 0)}`;
    if (a === Na) return Ba;
    Na = a;
    const o = [];
    for (const s of n) {
      const r = s.length;
      if (r < 6 || s[0] !== s[r - 1]) continue;
      const f = s.slice(0, r - 1).map((c) => e[c]).filter(Boolean);
      if (f.length < 5) continue;
      const i = [0, 1, 2].map((c) => f.reduce((y, p) => y + p[c], 0) / f.length), l = f.map((c) => Math.hypot(c[0] - i[0], c[1] - i[1], c[2] - i[2])), d = l.reduce((c, y) => c + y, 0) / l.length;
      d < 1e-9 || l.some((c) => Math.abs(c - d) > 5e-3 * d) || o.push({ c: i, r: d });
    }
    return Ba = o;
  };
  window.__hekatanCentrosDeducidos = Ya;
  const Co = () => !!window.__hekatanCurvasAux, Ao = (e, n) => {
    const a = window.__hekatanDrawingAuxLines;
    if (!a) return 0;
    St();
    const o = a.rawVal ?? a.val ?? [], s = [];
    for (let r = 0; r + 1 < e.length; r++) s.push([...e[r], ...e[r + 1]]);
    return n && e.length > 2 && s.push([...e[e.length - 1], ...e[0]]), a.val = [...o, ...s], s.length;
  };
  window.__hekatanDrawCircle = (e, n, a, o, s = window.__hekatanArcSegs ?? 12, r = "xy") => {
    var _a3;
    const f = Math.max(4, Math.round(s)), i = t.points.rawVal.length, l = [];
    for (let d = 0; d < f; d++) {
      const c = 2 * Math.PI * d / f, y = o * Math.cos(c), p = o * Math.sin(c);
      let h;
      r === "xy" ? h = [e + y, n + p, a] : r === "xz" ? h = [e + y, n, a + p] : h = [e, n + y, a + p], l.push(h);
    }
    if (zo.push({ c: [e, n, a], r: o }), Co()) {
      Ao(l, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...l], t.polylines) {
      const d = [...l.map((y, p) => i + p), i], c = t.polylines.rawVal;
      ((_a3 = c[c.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [...c, d, []] : t.polylines.val = [...c.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawArc = (e, n, a, o = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const s = Math.max(4, Math.round(o)), r = new F(...e), f = new F(...n), i = new F(...a), l = new F().subVectors(f, r), d = new F().subVectors(i, r), c = new F().crossVectors(l, d), y = 2 * c.lengthSq();
    let p;
    if (y < 1e-12) p = new F().addVectors(r, i).multiplyScalar(0.5);
    else {
      const re = d.clone().multiplyScalar(l.lengthSq()).sub(l.clone().multiplyScalar(d.lengthSq())), ve = new F().crossVectors(re, c);
      p = r.clone().add(ve.divideScalar(y));
    }
    const h = r.distanceTo(p), M = c.lengthSq() > 1e-12 ? c.clone().normalize() : new F(0, 1, 0), v = new F().subVectors(r, p).normalize(), m = new F().crossVectors(M, v).normalize(), u = (re) => {
      const ve = new F().subVectors(re, p);
      return Math.atan2(ve.dot(m), ve.dot(v));
    }, x = (re) => {
      let ve = re;
      for (; ve < 0; ) ve += 2 * Math.PI;
      for (; ve >= 2 * Math.PI; ) ve -= 2 * Math.PI;
      return ve;
    }, b = x(u(f)), E = x(u(i)), S = b <= E ? E : E - 2 * Math.PI, A = t.points.rawVal.length, R = [], te = (re) => {
      const ve = v.clone().multiplyScalar(Math.cos(re)).add(m.clone().multiplyScalar(Math.sin(re)));
      return p.clone().add(ve.multiplyScalar(h));
    }, V = String(window.__hekatanArcModo ?? "angulo"), N = V === "x" ? 0 : V === "y" ? 1 : V === "z" ? 2 : -1;
    let Q = false;
    if (N >= 0) {
      const re = e[N], ve = a[N], Ge = 512;
      let Ie = Math.abs(ve - re) > 1e-9, Qe = re;
      for (let Ce = 1; Ce <= Ge && Ie; Ce++) {
        const tt = te(S * Ce / Ge).getComponent(N);
        (tt - Qe) * (ve - re) < -1e-9 && (Ie = false), Qe = tt;
      }
      if (Ie) {
        Q = true;
        for (let Ce = 0; Ce <= s; Ce++) {
          const tt = re + (ve - re) * Ce / s;
          let Xe = 0, Ae = S;
          for (let Je = 0; Je < 60; Je++) {
            const mt = (Xe + Ae) / 2;
            (te(mt).getComponent(N) - tt) * (ve - re) < 0 ? Xe = mt : Ae = mt;
          }
          const Ue = te((Xe + Ae) / 2);
          R.push([Ue.x, Ue.y, Ue.z]);
        }
        R[0] = [e[0], e[1], e[2]], R[s] = [a[0], a[1], a[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${V.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!Q) for (let re = 0; re <= s; re++) {
      const ve = te(S * (re / s));
      R.push([ve.x, ve.y, ve.z]);
    }
    if (zo.push({ c: [p.x, p.y, p.z], r: h }), Co()) {
      Ao(R, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...R], t.polylines) {
      const re = R.map((Ge, Ie) => A + Ie), ve = t.polylines.rawVal;
      t.polylines.val = [...ve.slice(0, -1), re, []];
    }
  }, window.__hekatanDrawPolinomio = (e, n = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const a = e.length;
    if (a < 2) return { ok: false, msg: "faltan puntos" };
    const o = Math.max(a - 1, Math.round(n)), s = (S) => Math.max(...e.map((A) => A[S])) - Math.min(...e.map((A) => A[S])), r = [s(0), s(1), s(2)], f = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), i = f === "xy" ? 2 : f === "xz" ? 1 : f === "yz" ? 0 : -1, l = i >= 0 && r[i] < 1e-6 ? i : r[2] <= r[0] && r[2] <= r[1] ? 2 : r[1] <= r[0] ? 1 : 0, d = l === 2 ? "xy" : l === 1 ? "xz" : "yz", c = [0, 1, 2].filter((S) => S !== l), [y, p] = r[c[0]] >= r[c[1]] ? c : [c[1], c[0]], h = e.map((S) => S[y]), M = e.map((S) => S[p]);
    for (let S = 0; S < a; S++) for (let A = S + 1; A < a; A++) if (Math.abs(h[S] - h[A]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[y]} en ${d.toUpperCase()}): no hay polinomio que pase por los dos` };
    const v = (S) => {
      let A = 0;
      for (let R = 0; R < a; R++) {
        let te = 1;
        for (let V = 0; V < a; V++) V !== R && (te *= (S - h[V]) / (h[R] - h[V]));
        A += M[R] * te;
      }
      return A;
    }, m = (() => {
      const S = a, A = h.map((V) => Array.from({ length: S }, (N, Q) => V ** Q)), R = M.slice();
      for (let V = 0; V < S; V++) {
        let N = V;
        for (let Q = V + 1; Q < S; Q++) Math.abs(A[Q][V]) > Math.abs(A[N][V]) && (N = Q);
        [A[V], A[N]] = [A[N], A[V]], [R[V], R[N]] = [R[N], R[V]];
        for (let Q = V + 1; Q < S; Q++) {
          const re = A[Q][V] / A[V][V];
          for (let ve = V; ve < S; ve++) A[Q][ve] -= re * A[V][ve];
          R[Q] -= re * R[V];
        }
      }
      const te = new Array(S).fill(0);
      for (let V = S - 1; V >= 0; V--) {
        let N = R[V];
        for (let Q = V + 1; Q < S; Q++) N -= A[V][Q] * te[Q];
        te[V] = N / A[V][V];
      }
      return te;
    })(), u = h[0], x = h[a - 1], b = t.points.rawVal.length, E = [];
    for (let S = 0; S <= o; S++) {
      const A = u + (x - u) * S / o, R = [e[0][0], e[0][1], e[0][2]];
      R[y] = A, R[p] = v(A), R[l] = e[0][l], E.push(R);
    }
    if (E[0] = [e[0][0], e[0][1], e[0][2]], E[o] = [e[a - 1][0], e[a - 1][1], e[a - 1][2]], Co()) return Ao(E, false), { ok: true, plano: d, coef: m, ia: y, io: p };
    if (t.points.val = [...t.points.rawVal, ...E], t.polylines) {
      const S = E.map((R, te) => b + te), A = t.polylines.rawVal;
      t.polylines.val = ((_d = A[A.length - 1]) == null ? void 0 : _d.length) > 0 ? [...A, S, []] : [...A.slice(0, -1), S, []];
    }
    return { ok: true, plano: d, coef: m, ia: y, io: p };
  };
  const Xa = () => {
    var _a3, _b;
    const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), o = window.__hekatanDrawingAuxLines, s = (o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? [], r = [], f = [], i = /* @__PURE__ */ new Set(), l = (d) => [e[d][0], e[d][1], e[d][2]];
    return [...Ke].forEach((d) => {
      const c = d.split(":");
      if (c[0] === "aux") {
        const p = s[+c[1]];
        p && p.length === 6 && (r.push([[p[0], p[1], p[2]], [p[3], p[4], p[5]]]), f.push(d));
        return;
      }
      const y = c[0] === "poly" || c[0] === "seg" ? +c[1] : -1;
      if (!(y < 0 || !n[y] || a.has(y))) if (c[0] === "poly") {
        if (i.has(y)) return;
        i.add(y);
        for (let p = 0; p + 1 < n[y].length; p++) r.push([l(n[y][p]), l(n[y][p + 1])]);
      } else {
        const p = n[y][+c[2]], h = n[y][+c[2] + 1];
        p != null && h != null && !i.has(y) && r.push([l(p), l(h)]);
      }
    }), { segs: r, auxIds: f };
  }, so = (e, n) => Math.abs(e[0] - n[0]) < 1e-6 && Math.abs(e[1] - n[1]) < 1e-6 && Math.abs(e[2] - n[2]) < 1e-6, Xs = (e) => {
    const n = new Array(e.length).fill(false), a = [];
    for (let o = 0; o < e.length; o++) {
      if (n[o]) continue;
      n[o] = true;
      const s = [e[o][0], e[o][1]];
      let r = true;
      for (; r; ) {
        r = false;
        for (let i = 0; i < e.length; i++) {
          if (n[i]) continue;
          const [l, d] = e[i], c = s[s.length - 1], y = s[0];
          so(l, c) ? (s.push(d), n[i] = true, r = true) : so(d, c) ? (s.push(l), n[i] = true, r = true) : so(d, y) ? (s.unshift(l), n[i] = true, r = true) : so(l, y) && (s.unshift(d), n[i] = true, r = true);
        }
      }
      const f = s.length > 3 && so(s[0], s[s.length - 1]);
      f && s.pop(), a.push({ pts: s, cerrada: f });
    }
    return a;
  }, ta = (e, n) => {
    let a = e.findIndex((o) => Math.abs(o[0] - n[0]) < 1e-3 && Math.abs(o[1] - n[1]) < 1e-3 && Math.abs(o[2] - n[2]) < 1e-3);
    return a < 0 && (a = e.length, e.push(n)), a;
  }, Ua = (e) => {
    if (!e.length) return 0;
    Ke.clear(), e.forEach((a) => Ke.add(a));
    const n = e.length;
    return ca(), Ke.clear(), n;
  };
  window.__hekatanRevolveSelection = (e, n, a, o = 360) => {
    var _a3, _b, _c;
    const s = Math.max(3, Math.round(a || 16)), r = Math.abs(o - 360) < 1e-9, f = s, i = r ? s : s + 1, { segs: l, auxIds: d } = Xa();
    if (!l.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (r && s % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    St();
    const c = t.points.rawVal, y = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], p = [...c];
    let h = y.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], v = /* @__PURE__ */ new Map(), m = (R) => R.map((te) => Math.round(te * 1e4)).join(","), u = (R) => Math.hypot(R[0] - e, R[1] - n) < 1e-6, x = (R) => {
      const te = m(R);
      let V = v.get(te);
      if (V) return V;
      if (u(R)) return V = [ta(p, R)], v.set(te, V), V;
      const N = Math.hypot(R[0] - e, R[1] - n), Q = Math.atan2(R[1] - n, R[0] - e);
      V = [];
      for (let re = 0; re < i; re++) {
        const ve = Q + o * Math.PI / 180 * re / s;
        V.push(ta(p, re === 0 ? R : [e + N * Math.cos(ve), n + N * Math.sin(ve), R[2]]));
      }
      return v.set(te, V), V;
    };
    let b = 0, E = false;
    const S = (R) => {
      M.push(h.length), h.push([...R, R[0]]), b++;
    };
    for (const [R, te] of l) {
      const V = x(R), N = x(te);
      if (!(V.length === 1 && N.length === 1)) {
        if (V.length === 1 || N.length === 1) {
          E = true;
          const Q = V.length === 1 ? V[0] : N[0], re = V.length === 1 ? N : V;
          for (let ve = 0; ve + 2 <= f; ve += 2) S([Q, re[ve % i], re[(ve + 1) % i], re[(ve + 2) % i]]);
          continue;
        }
        for (let Q = 0; Q < f; Q++) S([V[Q], N[Q], N[(Q + 1) % i], V[(Q + 1) % i]]);
      }
    }
    h.push([]), t.points.val = p, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    const A = Ua(d);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), { anillos: v.size, areas: b, polo: E, guias: A };
  }, window.__hekatanLoftSelection = (e, n) => {
    var _a3, _b, _c;
    const { segs: a, auxIds: o } = Xa(), s = Xs(a), r = (N) => N.pts.every((Q) => Math.abs(Q[2] - N.pts[0][2]) < 1e-6), f = s.find((N) => N.cerrada && r(N)), i = s.find((N) => !N.cerrada && N.pts.length >= 2 && !r(N));
    if (!f) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!i) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const l = f.pts, d = l.length, c = i.pts.slice();
    c[c.length - 1][2] < c[0][2] && c.reverse();
    let y = 0;
    for (let N = 0; N < d; N++) {
      const Q = l[N], re = l[(N + 1) % d];
      y += Q[0] * re[1] - re[0] * Q[1];
    }
    const p = y > 0 ? 1 : -1, h = (N) => {
      const Q = l[(N - 1 + d) % d], re = l[N], ve = l[(N + 1) % d], Ge = [re[0] - Q[0], re[1] - Q[1]], Ie = [ve[0] - re[0], ve[1] - re[1]], Qe = Math.hypot(Ge[0], Ge[1]) || 1, Ce = Math.hypot(Ie[0], Ie[1]) || 1, tt = [p * Ge[1] / Qe, -p * Ge[0] / Qe], Xe = [p * Ie[1] / Ce, -p * Ie[0] / Ce], Ae = 1 + (tt[0] * Xe[0] + tt[1] * Xe[1]);
      return [(tt[0] + Xe[0]) / Math.max(Ae, 1e-6), (tt[1] + Xe[1]) / Math.max(Ae, 1e-6)];
    }, M = l.map((N, Q) => h(Q)), v = c[0];
    let m = [0, 0], u = 0;
    for (const N of c) {
      const Q = N[0] - v[0], re = N[1] - v[1], ve = Math.hypot(Q, re);
      ve > u && (u = ve, m = [Q / ve, re / ve]);
    }
    if (u < 1e-9) {
      const N = v[0] - e, Q = v[1] - n, re = Math.hypot(N, Q) || 1;
      m = [N / re, Q / re];
    }
    m[0] * (v[0] - e) + m[1] * (v[1] - n) < 0 && (m = [-m[0], -m[1]]), St();
    const x = t.points.rawVal, b = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], E = [...x];
    let S = b.slice();
    S.length && S[S.length - 1].length === 0 && (S = S.slice(0, -1));
    const A = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], R = c.map((N) => {
      const Q = (N[0] - v[0]) * m[0] + (N[1] - v[1]) * m[1], re = N[2];
      return l.map((ve, Ge) => ta(E, [ve[0] + M[Ge][0] * Q, ve[1] + M[Ge][1] * Q, re]));
    });
    let te = 0;
    for (let N = 0; N + 1 < R.length; N++) for (let Q = 0; Q < d; Q++) {
      const re = [R[N][Q], R[N][(Q + 1) % d], R[N + 1][(Q + 1) % d], R[N + 1][Q]];
      new Set(re).size < 4 || (A.push(S.length), S.push([...re, re[0]]), te++);
    }
    S.push([]), t.points.val = E, t.polylines && (t.polylines.val = S), t.areas && (t.areas.val = A);
    const V = Ua(o);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), { contorno: d, perfil: c.length, areas: te, guias: V };
  }, window.__hekatanDrawSlabChaflan = (e, n, a = 1, o = 6, s = 6) => {
    const r = Math.min(e[0], n[0]), f = Math.max(e[0], n[0]), i = Math.min(e[1], n[1]), l = Math.max(e[1], n[1]), d = (e[2] + n[2]) / 2, c = f - r, y = l - i, p = Math.min(a, c / 2 - 0.01, y / 2 - 0.01);
    if (p <= 0) return;
    const h = t.points.rawVal.length, M = [], v = [], m = (u, x) => {
      M.push([u, x, d]), v.push(h + M.length - 1);
    };
    for (let u = 0; u <= s; u++) m(r + p + (c - 2 * p) * u / s, i);
    for (let u = 1; u <= o; u++) {
      const x = -Math.PI / 2 + Math.PI / 2 * u / o;
      m(f - p + p * Math.cos(x), i + p + p * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) m(f, i + p + (y - 2 * p) * u / s);
    for (let u = 1; u <= o; u++) {
      const x = 0 + Math.PI / 2 * u / o;
      m(f - p + p * Math.cos(x), l - p + p * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) m(f - p - (c - 2 * p) * u / s, l);
    for (let u = 1; u <= o; u++) {
      const x = Math.PI / 2 + Math.PI / 2 * u / o;
      m(r + p + p * Math.cos(x), l - p + p * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) m(r, l - p - (y - 2 * p) * u / s);
    for (let u = 1; u < o; u++) {
      const x = Math.PI + Math.PI / 2 * u / o;
      m(r + p + p * Math.cos(x), i + p + p * Math.sin(x));
    }
    if (v.push(h), Co()) {
      Ao(M, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...M], t.polylines) {
      const u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), v, []];
    }
  }, window.__hekatanDrawRect = (e, n) => {
    const a = t.points.rawVal.length, o = e[0], s = e[1], r = e[2], f = n[0], i = n[1], l = n[2];
    let d;
    if (Math.abs(r - l) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, i, r], [o, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, s, l], [o, s, l]] : d = [[o, s, r], [o, i, r], [o, i, l], [o, s, l]], t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = [a, a + 1, a + 2, a + 3, a], y = t.polylines.rawVal;
      t.polylines.val = [...y.slice(0, -1), c, []];
    }
  }, window.__hekatanDrawRectArea = (e, n) => {
    var _a3;
    const a = t.points.rawVal.length, o = e[0], s = e[1], r = e[2], f = n[0], i = n[1], l = n[2];
    let d;
    if (q && t.gridTarget) {
      const c = t.gridTarget.rawVal, y = new En(...c.rotation), p = new F(1, 0, 0).applyEuler(y), h = new F(0, 1, 0).applyEuler(y), M = new F(...c.position), v = new F(o, s, r), m = new F(f, i, l), u = v.clone().sub(M).dot(p), x = v.clone().sub(M).dot(h), b = m.clone().sub(M).dot(p), E = m.clone().sub(M).dot(h), S = (A, R) => M.clone().addScaledVector(p, A).addScaledVector(h, R).toArray();
      d = [S(u, x), S(b, x), S(b, E), S(u, E)];
    } else Math.abs(r - l) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, i, r], [o, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, s, l], [o, s, l]] : d = [[o, s, r], [o, i, r], [o, i, l], [o, s, l]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = t.polylines.rawVal, y = c.length - 1, p = [a, a + 1, a + 2, a + 3, a];
      t.polylines.val = [...c.slice(0, -1), p, []], t.areas && (t.areas.val = [...t.areas.rawVal, y]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    z();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = t.points.rawVal, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = (m) => m.map((u) => Math.round(u * 1e4) / 1e4).join(",");
    for (let m = 0; m < n.length; m++) {
      const u = s(n[m]), x = a.get(u);
      x === void 0 && a.set(u, m), o.set(m, x ?? m);
    }
    const r = e.map((m) => m.map((u) => o.get(u) ?? u)), f = /* @__PURE__ */ new Map(), i = (m, u) => {
      m !== u && ((f.get(m) ?? f.set(m, /* @__PURE__ */ new Set()).get(m)).add(u), (f.get(u) ?? f.set(u, /* @__PURE__ */ new Set()).get(u)).add(m));
    };
    for (const m of r) for (let u = 0; u + 1 < m.length; u++) i(m[u], m[u + 1]);
    const l = (m, u) => {
      var _a4;
      return !!((_a4 = f.get(m)) == null ? void 0 : _a4.has(u));
    }, d = /* @__PURE__ */ new Set(), c = [], y = [...f.keys()];
    for (const m of y) for (const u of f.get(m)) if (!(u < m)) {
      for (const x of f.get(u)) if (x !== m) for (const b of f.get(x)) {
        if (b === m || b === u || !l(b, m) || l(m, x) || l(u, b)) continue;
        const E = [m, u, x, b].slice().sort((S, A) => S - A).join("-");
        d.has(E) || (d.add(E), c.push([m, u, x, b]));
      }
    }
    for (const m of y) for (const u of f.get(m)) if (!(u < m)) for (const x of f.get(u)) {
      if (x === m || !l(x, m)) continue;
      const b = [m, u, x].slice().sort((E, S) => E - S).join("-");
      d.has(b) || (d.add(b), c.push([m, u, x]));
    }
    if (!c.length) return 0;
    const p = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], h = new Set(p.map((m) => [...new Set(r[m] ?? [])].sort((u, x) => u - x).join("-"))), M = [...r];
    let v = 0;
    for (const m of c) {
      const u = m.slice().sort((x, b) => x - b).join("-");
      h.has(u) || (h.add(u), M.push([...m, m[0]]), p.push(M.length - 1), v++);
    }
    if (v) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = M, t.areas && (t.areas.val = p);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      z();
    }
    return v;
  }, window.__hekatanMeshPolyArea = (e, n) => {
    var _a3;
    const a = e.length;
    if (a < 3) return 0;
    let o = 0, s = 0, r = 0;
    for (let Ae = 0; Ae < a; Ae++) {
      const Ue = e[Ae], Je = e[(Ae + 1) % a];
      o += (Ue[1] - Je[1]) * (Ue[2] + Je[2]), s += (Ue[2] - Je[2]) * (Ue[0] + Je[0]), r += (Ue[0] - Je[0]) * (Ue[1] + Je[1]);
    }
    const f = Math.hypot(o, s, r) || 1;
    o /= f, s /= f, r /= f;
    let i = e[1][0] - e[0][0], l = e[1][1] - e[0][1], d = e[1][2] - e[0][2];
    const c = Math.hypot(i, l, d) || 1;
    i /= c, l /= c, d /= c;
    let y = s * d - r * l, p = r * i - o * d, h = o * l - s * i;
    const M = Math.hypot(y, p, h) || 1;
    y /= M, p /= M, h /= M;
    const v = e[0], m = (Ae) => [(Ae[0] - v[0]) * i + (Ae[1] - v[1]) * l + (Ae[2] - v[2]) * d, (Ae[0] - v[0]) * y + (Ae[1] - v[1]) * p + (Ae[2] - v[2]) * h], u = (Ae, Ue) => [v[0] + Ae * i + Ue * y, v[1] + Ae * l + Ue * p, v[2] + Ae * d + Ue * h], x = e.map(m);
    let b = 1 / 0, E = -1 / 0, S = 1 / 0, A = -1 / 0;
    for (const [Ae, Ue] of x) Ae < b && (b = Ae), Ae > E && (E = Ae), Ue < S && (S = Ue), Ue > A && (A = Ue);
    const R = E - b, te = A - S;
    if (R < 1e-6 || te < 1e-6) return 0;
    let V = n && n > 0 ? n : 0.5;
    for (; R / V * (te / V) > 2500; ) V *= 2;
    V = Math.min(V, Math.min(R, te));
    const N = (Ae, Ue) => {
      let Je = false;
      for (let mt = 0, vt = x.length - 1; mt < x.length; vt = mt++) {
        const [Lt, sn] = x[mt], [jn, Yn] = x[vt];
        sn > Ue != Yn > Ue && Ae < (jn - Lt) * (Ue - sn) / (Yn - sn) + Lt && (Je = !Je);
      }
      return Je;
    }, Q = Math.max(1, Math.round(R / V)), re = Math.max(1, Math.round(te / V)), ve = R / Q, Ge = te / re, Ie = /* @__PURE__ */ new Map(), Qe = [], Ce = t.points.rawVal.length, tt = (Ae, Ue) => {
      const Je = Ae + "," + Ue, mt = Ie.get(Je);
      if (mt !== void 0) return mt;
      const vt = Ce + Qe.length;
      return Qe.push(u(b + Ae * ve, S + Ue * Ge)), Ie.set(Je, vt), vt;
    }, Xe = [];
    for (let Ae = 0; Ae < Q; Ae++) for (let Ue = 0; Ue < re; Ue++) {
      if (!N(b + (Ae + 0.5) * ve, S + (Ue + 0.5) * Ge)) continue;
      const Je = tt(Ae, Ue), mt = tt(Ae + 1, Ue), vt = tt(Ae + 1, Ue + 1), Lt = tt(Ae, Ue + 1);
      Xe.push([Je, mt, vt, Lt]);
    }
    if (!Xe.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...Qe], t.polylines && t.areas) {
      let Ae = t.polylines.rawVal.slice();
      Ae.length && Ae[Ae.length - 1].length === 0 && (Ae = Ae.slice(0, -1));
      const Ue = [];
      for (const Je of Xe) Ue.push(Ae.length), Ae.push([Je[0], Je[1], Je[2], Je[3], Je[0]]);
      Ae.push([]), t.polylines.val = Ae, t.areas.val = [...t.areas.rawVal, ...Ue];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), Xe.length;
  };
  const Eo = () => {
    if (at.length < 3) return at = [], Te.visible = false, z(), 0;
    const e = window.__hekatanMeshPolyArea(at.slice());
    return at = [], Te.visible = false, z(), e;
  };
  window.__hekatanFinalizePolyArea = Eo, window.__hekatanSetInclinedPlaneFrom3 = (e, n, a) => {
    var _a3;
    const o = new F(e[0], e[1], e[2]), s = new F(n[0], n[1], n[2]), r = new F(a[0], a[1], a[2]), f = new F().subVectors(s, o).cross(new F().subVectors(r, o));
    if (f.lengthSq() < 1e-9) return false;
    f.normalize();
    const i = new ho().setFromUnitVectors(new F(0, 0, 1), f), l = new En().setFromQuaternion(i);
    t.gridTarget && (t.gridTarget.val = { position: [o.x, o.y, o.z], rotation: [l.x, l.y, l.z] }), q = true;
    const d = new F().addVectors(o, s).add(r).multiplyScalar(1 / 3), c = Math.max(o.distanceTo(s), o.distanceTo(r), s.distanceTo(r)) * 2.2 + 4, y = c / 2;
    Yt.geometry.dispose(), Yt.geometry = new An(c, c), en.geometry.dispose(), en.geometry = new fs(new An(c, c)), bo(y, 1), kt.position.copy(d), kt.quaternion.copy(i), kt.scale.set(1, 1, 1), kt.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), q = false, kt.visible = false, z();
  };
  const on = new ut();
  on.visible = false, g.add(on), window.__hekatanShowAxes = (e, n, a = 12, o = 2) => {
    var _a3, _b;
    for (; on.children.length; ) {
      const c = on.children.pop();
      (_a3 = c.geometry) == null ? void 0 : _a3.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !n.length) return;
    const s = Math.min(...n) - o, r = Math.max(...n) + o, f = Math.min(...e) - o, i = Math.max(...e) + o, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", d = (c, y, p, h, M) => {
      const v = document.createElement("canvas");
      v.width = 64, v.height = 32;
      const m = v.getContext("2d");
      m.fillStyle = M, m.font = "bold 22px sans-serif", m.textAlign = "center", m.fillText(c, 32, 26);
      const u = new hs(v), x = new ms({ map: u, transparent: true }), b = new ws(x);
      return b.position.set(y, p, h), b.scale.set(1.2, 0.6, 1), b;
    };
    e.forEach((c, y) => {
      const p = y < l.length ? l[y] : `X${y}`, h = new Ee().setFromPoints([new F(c, s, 0), new F(c, r, 0), new F(c, s, 0), new F(c, s, a)]), M = new eo({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new jt(h, M);
      v.computeLineDistances(), on.add(v), on.add(d(p, c, s - 0.5, 0, "#60a5fa")), on.add(d(p, c, r + 0.5, 0, "#60a5fa"));
    }), n.forEach((c, y) => {
      const p = `${y + 1}`, h = new Ee().setFromPoints([new F(f, c, 0), new F(i, c, 0), new F(f, c, 0), new F(f, c, a)]), M = new eo({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new jt(h, M);
      v.computeLineDistances(), on.add(v), on.add(d(p, f - 0.5, c, 0, "#fb7185")), on.add(d(p, i + 0.5, c, 0, "#fb7185"));
    }), on.visible = true, z();
  }, window.__hekatanHideAxes = () => {
    on.visible = false, z();
  };
  const _n = new ut();
  _n.visible = false, g.add(_n);
  let qn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], n = 20, a = 0, o = 0) => {
    var _a3, _b;
    for (; _n.children.length; ) {
      const r = _n.children.pop();
      (_a3 = r.geometry) == null ? void 0 : _a3.dispose(), (_b = r.material) == null ? void 0 : _b.dispose();
    }
    qn.forEach((r) => {
      g.remove(r), r.geometry.dispose(), r.material.dispose();
    }), qn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((r, f) => {
      const i = s[f % s.length], l = n / 2, d = [new F(a - l, o - l, r), new F(a + l, o - l, r), new F(a + l, o + l, r), new F(a - l, o + l, r), new F(a - l, o - l, r)], c = new Ee().setFromPoints(d), y = new ft({ color: i, transparent: true, opacity: 0.55 });
      _n.add(new Et(c, y));
      const p = document.createElement("canvas");
      p.width = 128, p.height = 32;
      const h = p.getContext("2d");
      h.fillStyle = `#${i.toString(16).padStart(6, "0")}`, h.font = "bold 18px sans-serif", h.fillText(`Z = ${r} m`, 4, 22);
      const M = new hs(p), v = new ms({ map: M, transparent: true }), m = new ws(v);
      m.position.set(a - l - 1.5, o - l - 1.5, r), m.scale.set(2.5, 0.6, 1), _n.add(m);
      const u = new An(1e4, 1e4), x = new wt({ visible: false, side: Vt }), b = new ct(u, x);
      b.position.set(0, 0, r), b.frustumCulled = false, b.userData = { refPlaneZ: r }, g.add(b), qn.push(b);
    }), _n.visible = true, z();
  }, window.__hekatanHideRefPlanes = () => {
    _n.visible = false, qn.forEach((e) => {
      e.visible = false;
    }), z();
  };
  const io = new ut();
  io.frustumCulled = false, g.add(io);
  const Us = () => {
    var _a3, _b, _c, _d;
    for (; io.children.length; ) {
      const a = io.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of n) {
      if (a.length !== 6) continue;
      const o = new Ee().setFromPoints([new F(a[0], a[1], a[2]), new F(a[3], a[4], a[5])]), s = new eo({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), r = new Et(o, s);
      r.computeLineDistances(), io.add(r);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Us(), z());
  });
  const Gn = new ut();
  Gn.frustumCulled = false, g.add(Gn);
  const Za = () => {
    var _a3, _b, _c, _d;
    for (; Gn.children.length; ) {
      const a = Gn.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of n) {
      if (!a || a.length !== 3) continue;
      const o = new ct(new to(0.025, 12, 12), new wt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      o.position.set(a[0], a[1], a[2]), o.renderOrder = 996, o.scale.setScalar(ko(o.position)), Gn.add(o);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Za(), z());
  }), k.addEventListener("change", () => {
    Gn.children.forEach((e) => {
      e.scale.setScalar(ko(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Za;
  const bt = new ut(), Zs = new ct(new to(0.01, 12, 12), new wt({ color: 16777215, transparent: true, opacity: 0.95 })), qa = new ct(new to(0.015, 12, 12), new wt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  qa.visible = false, bt.add(Zs, qa);
  const Kn = 0.08, na = (e, n, a) => {
    const o = new Ee().setFromPoints([new F(...e), new F(...n)]);
    return new Et(o, new ft({ color: a, transparent: true, opacity: 0.7 }));
  };
  bt.add(na([-Kn, 0, 0], [Kn, 0, 0], 16777215)), bt.add(na([0, -Kn, 0], [0, Kn, 0], 16777215)), bt.add(na([0, 0, -Kn], [0, 0, Kn], 16777215)), bt.visible = false, bt.frustumCulled = false, g.add(bt);
  let oa = 2;
  const Fo = (e) => {
    const n = _(), a = ($ == null ? void 0 : $.clientHeight) || 700;
    return n.isOrthographicCamera ? (n.top - n.bottom) / (n.zoom || 1) / a : 2 * n.position.distanceTo(e) * Math.tan((n.fov || 50) * Math.PI / 180 / 2) / a;
  }, lo = () => {
    if (!bt.visible) return;
    const e = oa * Fo(bt.position) / 0.015;
    bt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let zn = 10;
  const aa = (e) => Math.max(1e-4, zn * Fo(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (zn = e), zn), window.__hekatanUpdateSnapScale = lo, window.__hekatanSnapMarker = bt, window.__hekatanMetrosPorPixel = Fo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (oa = e, lo(), z()), oa);
  const Ga = () => {
    yn.children.length !== 0 && yn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const n = e;
      n.scale.setScalar(ko(n.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Ga, k.addEventListener("change", () => {
    var _a3;
    lo(), tn.visible && Ta(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), Ga();
  }), window.__hekatanShowSnap = (e, n, a) => {
    bt.position.set(e, n, a), bt.visible = true, lo(), z();
  }, window.__hekatanHideSnap = () => {
    bt.visible = false, z();
  }, $.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const n = B(e);
    if (!n) return;
    L.setFromCamera(Y, n), se = null;
    const a = De();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && dt.visible && (dt.visible = false), a.length) {
      const o = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const h = Kt([o.x, o.y, o.z]);
        if (h) {
          const M = h.map((u) => t.points.rawVal[u]), v = [];
          for (let u = 1; u < M.length - 1; u++) v.push(M[0][0], M[0][1], M[0][2], M[u][0], M[u][1], M[u][2], M[u + 1][0], M[u + 1][1], M[u + 1][2]);
          const m = dt.geometry;
          m.setAttribute("position", new It(v, 3)), m.computeVertexNormals(), dt.visible = true;
        } else dt.visible = false;
      } else dt.visible && (dt.visible = false);
      const s = e.altKey;
      let r = false;
      const f = aa(o), i = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, o.x, o.y, o.z, f, { x: e.clientX, y: e.clientY });
      if (i) To(i.type, i.x, i.y, i.z), bt.position.set(i.x, i.y, i.z), bt.visible = true, o.set(i.x, i.y, i.z), Do(i.type, e.clientX, e.clientY);
      else if (!s && (Se = Me(e.clientX, e.clientY))) r = true, o.copy(Se), To("ifcSec", o.x, o.y, o.z), Do("ifcSec", e.clientX, e.clientY), bt.position.copy(o), bt.visible = true;
      else if (ae && !s) r = true, To(ae.tipo, o.x, o.y, o.z), Do(ae.tipo, e.clientX, e.clientY), bt.position.copy(o), bt.visible = true;
      else {
        Os(), Ro();
        const p = !s && window.__hekatanSnapEnabled !== false, h = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        p && h > 0 && (o.x = Math.round(o.x / h) * h, o.y = Math.round(o.y / h) * h, o.z = Math.round(o.z / h) * h), bt.position.copy(o), bt.visible = true;
      }
      lo(), Z(se && !i && (r || ae) ? K(se) : null), Rt = { p: o.clone(), x: e.clientX, y: e.clientY };
      const l = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (l === "select" || !l) {
        const p = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = Bs(o.x, o.y, o.z, p), M = ea(o.x, o.y, o.z, p), v = Ra(o.x, o.y, o.z, p);
        if (h >= 0) {
          const b = t.points.rawVal[h];
          tn.position.set(b[0], b[1], b[2]), tn.visible = true, Ta(), wn.visible = false, xn = { kind: "pt", a: h };
        } else if (M) {
          const b = t.points.rawVal, E = t.polylines.rawVal[M.polyIdx], S = b[E[M.segIdx]], A = b[E[M.segIdx + 1]];
          wn.geometry.setFromPoints([new F(S[0], S[1], S[2]), new F(A[0], A[1], A[2])]), wn.visible = true, tn.visible = false, xn = ((_m = (_l2 = t.areas) == null ? void 0 : _l2.rawVal) == null ? void 0 : _m.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (v >= 0) {
          const E = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[v];
          E && (wn.geometry.setFromPoints([new F(E[0], E[1], E[2]), new F(E[3], E[4], E[5])]), wn.visible = true, tn.visible = false, xn = { kind: "aux", a: v });
        } else wn.visible = false, tn.visible = false, xn = null;
        ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
        let m = o;
        if ((xn == null ? void 0 : xn.kind) === "pt") {
          const b = t.points.rawVal[xn.a];
          b && (m = new F(b[0], b[1], b[2]));
        }
        const u = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [m.x, m.y, m.z], xn) {
          const b = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ze.textContent = `${u}  \xB7  \u{1F5B1} Click \u2192 ${b[xn.kind]}`;
        } else ze.textContent = u;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = u), Rt = { p: m.clone(), x: e.clientX, y: e.clientY }, qe.visible = false, Xt.visible = false, Ut.visible = false, z();
        return;
      }
      if (l === "delete" || l === "trim" || l === "extend" || l === "offset") {
        const p = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = ea(o.x, o.y, o.z, p), M = Ra(o.x, o.y, o.z, p);
        let v = false;
        if (M >= 0) if (!h) v = true;
        else {
          const b = window.__hekatanDrawingAuxLines, S = ((b == null ? void 0 : b.rawVal) ?? (b == null ? void 0 : b.val) ?? b ?? [])[M];
          ao(o.x, o.y, o.z, S[0], S[1], S[2], S[3], S[4], S[5]) < h.dist && (v = true);
        }
        v ? (Pn = M, dn = -1, Sn = -1, Ns(M)) : h ? (dn = h.polyIdx, Sn = h.segIdx, Pn = -1, Ys(h.polyIdx, h.segIdx)) : (dn = -1, Sn = -1, Pn = -1, qt.visible = false), qe.visible = false, Xt.visible = false, Ut.visible = false, pn(), ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
        const m = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        let u = "";
        v ? u = `\u{1F5D1} l\xEDnea aux #${Pn + 1}` : h ? u = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(h.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${h.polyIdx + 1}` : `\u{1F5D1} seg ${h.segIdx + 1} / poly #${h.polyIdx + 1}` : u = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ze.textContent = `${m}  \xB7  ${u}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = m), z();
        return;
      } else qt.visible = false, dn = -1, Pn = -1;
      ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
      const d = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], c = d[d.length - 1] ?? [], y = t.points.rawVal ?? [];
      if (c.length > 0 && y[c[c.length - 1]]) {
        const p = c[c.length - 1], h = y[p];
        let M = zt;
        Mo = null;
        const v = !!i || r;
        if (!M && !v && window.__hekatanAxisSnap !== false) {
          const Ie = $.getBoundingClientRect(), Qe = e.clientX, Ce = e.clientY, tt = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Xe = new F(h[0], h[1], h[2]), Ae = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], Ue = (mt) => {
            const vt = mt.clone().project(n);
            return { x: (vt.x * 0.5 + 0.5) * Ie.width + Ie.left, y: (-vt.y * 0.5 + 0.5) * Ie.height + Ie.top };
          };
          let Je = null;
          for (const [mt, vt] of Ae) {
            const Lt = Ue(Xe.clone().addScaledVector(vt, -tt)), sn = Ue(Xe.clone().addScaledVector(vt, tt)), jn = sn.x - Lt.x, Yn = sn.y - Lt.y, ui = Qe - Lt.x, pi = Ce - Lt.y, fi = jn * jn + Yn * Yn || 1;
            let Yo = (ui * jn + pi * Yn) / fi;
            Yo = Math.max(0, Math.min(1, Yo));
            const ls = Math.hypot(Qe - (Lt.x + Yo * jn), Ce - (Lt.y + Yo * Yn));
            if (Je === null || ls < Je.dpx) {
              const ga = L.ray, rs = Xe.clone().sub(ga.origin), ba = vt.dot(ga.direction), cs = vt.dot(rs), hi = ga.direction.dot(rs), ds = 1 - ba * ba, mi = Math.abs(ds) < 1e-6 ? -cs : (ba * hi - cs) / ds;
              Je = { axis: mt, dpx: ls, pt: Xe.clone().addScaledVector(vt, mi) };
            }
          }
          Je && Je.dpx <= 12 && (o.copy(Je.pt), M = Je.axis, Mo = Je.pt.clone());
        }
        const m = !!window.__hekatanOrthoMode;
        if (!M && !v && m) {
          const Ie = Math.abs(o.x - h[0]), Qe = Math.abs(o.y - h[1]), Ce = Math.abs(o.z - h[2]), tt = (_s2 = a[0]) == null ? void 0 : _s2.object;
          let Xe = null;
          tt === Zt ? Xe = "xy" : tt === Wt ? Xe = "xz" : tt === cn && (Xe = "yz"), Xe === "xy" ? M = Ie >= Qe ? "x" : "y" : Xe === "xz" ? M = Ie >= Ce ? "x" : "z" : Xe === "yz" ? M = Qe >= Ce ? "y" : "z" : M = Ie >= Qe && Ie >= Ce ? "x" : Qe >= Ce ? "y" : "z";
        }
        const u = window.__hekatanPolarTrack !== false;
        if (!M && !v && u) {
          const Ie = o.x - h[0], Qe = o.y - h[1], Ce = o.z - h[2], tt = Math.hypot(Ie, Qe, Ce);
          if (tt > 1e-3) {
            const Ae = Math.tan(6 * Math.PI / 180) * tt, Ue = Math.hypot(Qe, Ce), Je = Math.hypot(Ie, Ce), mt = Math.hypot(Ie, Qe), vt = [["x", Ue], ["y", Je], ["z", mt]];
            vt.sort((Lt, sn) => Lt[1] - sn[1]), vt[0][1] <= Ae && (M = vt[0][0]);
          }
        }
        if (M) {
          const Ie = h[0], Qe = h[1], Ce = h[2];
          M === "x" ? o.set(o.x, Qe, Ce) : M === "y" ? o.set(Ie, o.y, Ce) : o.set(Ie, Qe, o.z);
          const tt = !!zt, Ae = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          Dt.style.background = "rgba(15,23,42,0.92)", Dt.style.color = Ae, Dt.style.border = `1.5px solid ${Ae}`;
          const Ue = (_t2 = a[0]) == null ? void 0 : _t2.object;
          let Je = null;
          Ue === Zt ? Je = "xy" : Ue === Wt ? Je = "xz" : Ue === cn && (Je = "yz");
          const mt = Je ? ` (plano ${Je.toUpperCase()})` : "";
          Dt.textContent = tt ? `\u{1F512} LOCK ${M.toUpperCase()}${mt}` : `\u22A5 ORTO ${M.toUpperCase()}${mt}`, Dt.style.left = e.clientX + 20 + "px", Dt.style.top = e.clientY + 18 + "px", Dt.style.transform = "none", Dt.style.display = "block";
        } else zt || (Dt.style.display = "none");
        let x = null;
        if (!s && !v && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ie = t.points.rawVal, Qe = M ? [M] : ["z", "x", "y"], Ce = { x: e.clientX, y: e.clientY };
          let tt = 1 / 0;
          for (const Xe of Ie) if (!(Math.abs(Xe[0] - h[0]) < 1e-9 && Math.abs(Xe[1] - h[1]) < 1e-9 && Math.abs(Xe[2] - h[2]) < 1e-9)) for (const Ae of Qe) {
            const Ue = new F(Ae === "x" ? Xe[0] : o.x, Ae === "y" ? Xe[1] : o.y, Ae === "z" ? Xe[2] : o.z), Je = Bn(Ue.x, Ue.y, Ue.z);
            if (!Je) continue;
            const mt = Math.hypot(Je.x - Ce.x, Je.y - Ce.y);
            mt < zn && mt < tt && (tt = mt, x = { q: Xe, eje: Ae });
          }
        }
        x ? (x.eje === "x" ? o.x = x.q[0] : x.eje === "y" ? o.y = x.q[1] : o.z = x.q[2], Ut.geometry.setFromPoints([new F(x.q[0], x.q[1], x.q[2]), new F(o.x, o.y, o.z)]), (_u = Ut.computeLineDistances) == null ? void 0 : _u.call(Ut), Ut.visible = true, bt.position.set(o.x, o.y, o.z), bt.visible = true, Do("track", e.clientX, e.clientY)) : Ut.visible = false, Rt = { p: o.clone(), x: e.clientX, y: e.clientY };
        const b = Math.hypot(o.x - h[0], o.y - h[1], o.z - h[2]), E = Math.atan2(o.y - h[1], o.x - h[0]) * 180 / Math.PI, S = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`, A = (E % 360 + 360) % 360;
        ze.textContent = `L = ${b.toFixed(3)} m   \u2220 ${A.toFixed(1)}\xB0   \xB7   ${S}`;
        const R = document.getElementById("hk-coord-fixed");
        R && (R.textContent = S), qe.geometry.setFromPoints([new F(h[0], h[1], h[2]), new F(o.x, o.y, o.z)]), (_v = qe.computeLineDistances) == null ? void 0 : _v.call(qe), qe.visible = true, yt(h[0], h[1], h[2], o.x, o.y, o.z);
        const te = window.__hekatanOrthoExt ?? 8, V = window.__hekatanShowOrthoPlanes !== false;
        hn.visible = V, V || La(null), V && (vn(In, h, "xy", te), vn(Zn, h, "xz", te), vn(Tn, h, "yz", te), Mn(Zt, h, "xy", te), Mn(Wt, h, "xz", te), Mn(cn, h, "yz", te));
        const N = V ? L.intersectObjects([Zt, Wt, cn], false) : [];
        let Q = null;
        if (N.length > 0) {
          const Ie = N[0].object;
          Ie === Zt ? Q = "xy" : Ie === Wt ? Q = "xz" : Ie === cn && (Q = "yz");
        }
        La(Q), Q && (mn.style.left = e.clientX + "px", mn.style.top = e.clientY + "px"), bn.geometry.setFromPoints([new F(h[0] - te, h[1], h[2]), new F(h[0] + te, h[1], h[2])]), (_w = bn.computeLineDistances) == null ? void 0 : _w.call(bn), fn.geometry.setFromPoints([new F(h[0], h[1] - te, h[2]), new F(h[0], h[1] + te, h[2])]), (_x = fn.computeLineDistances) == null ? void 0 : _x.call(fn), Vn.geometry.setFromPoints([new F(h[0], h[1], h[2] - te), new F(h[0], h[1], h[2] + te)]), (_y = Vn.computeLineDistances) == null ? void 0 : _y.call(Vn), Xt.visible = true;
        const re = bn.material, ve = fn.material, Ge = Vn.material;
        bn.visible = M === "x", fn.visible = M === "y", Vn.visible = M === "z", re.opacity = 0.95, ve.opacity = 0.95, Ge.opacity = 0.95;
      } else {
        const p = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        ze.textContent = p;
        const h = document.getElementById("hk-coord-fixed");
        if (h && (h.textContent = p), qe.visible = false, Xt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(l)) {
          if (Ye = null, lt = null, ke.style.left = e.clientX + 20 + "px", ke.style.top = e.clientY - 28 + "px", ke.style.display = "block", !je) {
            ke.value = `${o.x.toFixed(2)},${o.y.toFixed(2)},${o.z.toFixed(2)}`;
            const v = document.activeElement;
            !(v && (v.tagName === "INPUT" || v.tagName === "TEXTAREA") && v !== ke) && document.activeElement !== ke && ke.focus({ preventScroll: true });
            try {
              ke.select();
            } catch {
            }
          }
        } else pn();
      }
      z();
    } else Ro(), ze.style.display = "none", bt.visible = false, qe.visible = false, Xt.visible = false, pn(), z();
  }), ue.derive(() => {
    if (!t.gridTarget) return;
    const e = new ho().setFromEuler(new En(...t.gridTarget.val.rotation)), n = new ho().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2);
    nl(w, { position: new F(...t.gridTarget.val.position), quaternion: e.clone().multiply(n) }, z), Ka(t.gridTarget.val.position[2], Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3), j.position.set(...t.gridTarget.val.position), j.quaternion.setFromEuler(new En(...t.gridTarget.val.rotation)), j.updateMatrixWorld();
    const a = new F(0, 0, 1).applyEuler(new En(...t.gridTarget.val.rotation));
    q = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  });
  function Ka(e, n, a) {
    var _a3, _b, _c, _d, _e2, _f, _g;
    {
      for (const o of Un) g.remove(o), jo(o);
      if (Un.length = 0, n) {
        const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = /* @__PURE__ */ new Set([0]);
        for (const i of o) s.add(+i[2].toFixed(3));
        const r = /* @__PURE__ */ new Set();
        for (const i of window.__hekatanLevels ?? []) isFinite(i == null ? void 0 : i.z) && (s.add(+i.z.toFixed(3)), r.add(+i.z.toFixed(3)));
        const f = [...s].sort((i, l) => i - l).slice(0, 24);
        for (const i of f) {
          if (Math.abs(i - e) < 1e-6) continue;
          const l = w.clone(true);
          l.name = `hekatan-grid-nivel-${i}`, l.traverse((d) => {
            d.material && (d.material = d.material.clone(), d.material.transparent = true, d.material.opacity = (d.material.opacity ?? 1) * (r.has(i) ? 0.65 : Math.abs(i) < 1e-6 ? 0.5 : 0.22));
          }), l.position.set(0, 0, i), l.quaternion.identity(), g.add(l), Un.push(l);
        }
      }
    }
    {
      const o = window.__hekatanPlanosAux ?? [], s = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", r = ((_g = (_f = (_e2 = window.__hekatanCadState) == null ? void 0 : _e2.get) == null ? void 0 : _f.call(_e2)) == null ? void 0 : _g[s === "xz" ? "workY" : s === "yz" ? "workX" : "workZ"]) ?? 0;
      for (const f of o.slice(0, 24)) {
        if (f.plano === "xy" || !isFinite(f.d) || f.plano === s && Math.abs(f.d - r) < 1e-6) continue;
        const i = w.clone(true);
        i.name = `hekatan-grid-${f.plano}-${f.d}`, i.traverse((l) => {
          l.material && (l.material = l.material.clone(), l.material.transparent = true, l.material.opacity = (l.material.opacity ?? 1) * 0.6);
        }), f.plano === "xz" ? (i.quaternion.setFromEuler(new En(Math.PI / 2, 0, 0)), i.position.set(0, f.d, 0)) : (i.quaternion.setFromEuler(new En(0, Math.PI / 2, 0)), i.position.set(f.d, 0, 0)), g.add(i), Un.push(i);
      }
    }
    z();
  }
  window.__hekatanGrillaAux = (e, n = "xy") => {
    var _a3, _b;
    if (!isFinite(e)) return [];
    const a = window;
    (_a3 = a.__hekatanPushUndo) == null ? void 0 : _a3.call(a);
    const o = a.__hekatanPlanosAux ?? [], s = o.findIndex((r) => r.plano === n && Math.abs(r.d - e) < 1e-6);
    if (s >= 0 ? o.splice(s, 1) : o.push({ plano: n, d: e }), a.__hekatanPlanosAux = o, n === "xy") {
      const r = a.__hekatanLevels ?? [], f = r.findIndex((i) => Math.abs(i.z - e) < 1e-6 && i.tipo !== "piso");
      s >= 0 ? f >= 0 && r.splice(f, 1) : f < 0 && r.push({ label: `N${e >= 0 ? "+" : ""}${e.toFixed(2)}`, z: e, tipo: "aux" }), a.__hekatanLevels = r;
    }
    return (_b = a.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(a), o;
  }, window.__hekatanQuitarGrillaAux = (e) => {
    var _a3;
    const a = (window.__hekatanLevels ?? []).filter((o) => !(Math.abs(o.z - e) < 1e-6 && o.tipo !== "piso"));
    return window.__hekatanLevels = a, (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), a.map((o) => o.z);
  };
  const un = document.createElement("input");
  un.id = "hk-grid-dist", un.type = "text", un.spellcheck = false, un.title = "Distancia del plano. Teclea un n\xFAmero y Enter para colocarlo exacto; Esc cancela.", un.style.cssText = ["position:fixed", "z-index:99997", "pointer-events:none", "display:none", "padding:3px 8px", "background:rgba(15,23,42,.94)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "width:104px", "text-align:center", "font:bold 13px Consolas,monospace", "transform:translate(14px,-28px)", "outline:none"].join(";") + ";", document.body.appendChild(un);
  let Wn = false, sa = 0, Ot = "";
  const qs = (e) => e === "xz" ? new F(0, 1, 0) : e === "yz" ? new F(1, 0, 0) : new F(0, 0, 1), Wa = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", ro = () => {
    var _a3, _b, _c;
    return String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy");
  }, Hn = () => {
    var _a3, _b, _c;
    return Number(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c[Wa(ro())]) ?? 0);
  }, $o = (e) => {
    var _a3, _b;
    const n = ro(), a = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3);
    if (a && (a[Wa(n)] = e), !t.gridTarget) return;
    const o = window.__hekatanSCU ?? [0, 0, 0];
    t.gridTarget.val = n === "xy" ? { position: [o[0], o[1], e], rotation: [Math.PI / 2, 0, 0] } : n === "xz" ? { position: [o[0], e, o[2]], rotation: [0, 0, 0] } : { position: [e, o[1], o[2]], rotation: [0, 0, Math.PI / 2] };
  }, Gs = () => {
    const e = qs(ro()), n = L.ray.origin, a = L.ray.direction, o = e.dot(a), s = 1 - o * o;
    if (Math.abs(s) < 1e-4) return null;
    const r = n.clone().negate(), f = e.dot(r), i = a.dot(r);
    return (o * i - f) / s;
  }, co = (e, n) => {
    e && (un.style.left = e.clientX + "px", un.style.top = e.clientY + "px");
    const a = ro() === "xz" ? "Y" : ro() === "yz" ? "X" : "Z";
    un.value = Ot !== "" ? `${a} = ${Ot}` : `${a} = ${n.toFixed(2)} m`, un.style.display = "block";
  }, Lo = (e, n) => {
    var _a3;
    Wn && (Wn = false, window.__hekatanMoviendoGrilla = false, un.style.display = "none", e ? typeof n == "number" && isFinite(n) && $o(n) : $o(sa), Ot = "", (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), z());
  };
  window.__hekatanMoverGrilla = (e = true) => e ? (sa = Hn(), Ot = "", Wn = true, window.__hekatanMoviendoGrilla = true, co(null, sa), true) : Lo(false), $.addEventListener("pointermove", (e) => {
    if (!Wn) return;
    B(e);
    const n = Gs();
    if (n === null) {
      co(e, Hn());
      return;
    }
    Ot === "" && $o(n), co(e, n);
  }, true), $.addEventListener("pointerdown", (e) => {
    Wn && (e.preventDefault(), e.stopPropagation(), Lo(true, Ot !== "" ? parseFloat(Ot) : Hn()));
  }, true), window.addEventListener("keydown", (e) => {
    if (Wn) {
      if (e.key === "Escape") return e.preventDefault(), Lo(false);
      if (e.key === "Enter") return e.preventDefault(), Lo(true, Ot !== "" ? parseFloat(Ot) : Hn());
      if (e.key === "Backspace") {
        e.preventDefault(), Ot = Ot.slice(0, -1), co(null, Hn());
        return;
      }
      if (/^[0-9.\-]$/.test(e.key)) {
        e.preventDefault(), Ot += e.key;
        const n = parseFloat(Ot);
        isFinite(n) && $o(n), co(null, isFinite(n) ? n : Hn());
      }
    }
  }, true);
  const kn = new ut();
  kn.name = "hekatan-scu", kn.visible = false, g.add(kn);
  const Ks = (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    for (; kn.children.length; ) {
      const i = kn.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e2 = i.dispose) == null ? void 0 : _e2.call(i);
    }
    const n = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), a = new F(...e), o = [[new F(1, 0, 0), 16735067], [new F(0, 1, 0), 6029194], [new F(0, 0, 1), 6990079]];
    for (const [i, l] of o) kn.add(new $n(i, a, n, l, n * 0.28, n * 0.16));
    const s = new Ee().setFromPoints([new F(0, 0, 0), a]), r = new eo({ color: 2282478, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.8 }), f = new Et(s, r);
    f.computeLineDistances(), kn.add(f), kn.visible = true;
  };
  window.__hekatanPonerSCU = (e) => {
    var _a3;
    return window.__hekatanSCU = [e[0], e[1], e[2]], Ks(e), (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), z(), e;
  }, window.__hekatanQuitarSCU = () => {
    var _a3;
    return window.__hekatanSCU = [0, 0, 0], kn.visible = false, (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), z(), [0, 0, 0];
  };
  let ia = false;
  window.__hekatanElegirSCU = (e = true) => (ia = e, window.__hekatanColocandoSCU = e, e), $.addEventListener("pointerdown", (e) => {
    if (!ia) return;
    e.preventDefault(), e.stopPropagation(), ia = false, window.__hekatanColocandoSCU = false;
    const n = window.__hekatanOsnapUltimo;
    if (n) {
      window.__hekatanPonerSCU([n.x, n.y, n.z]);
      return;
    }
    B(e);
    const a = De();
    if (a.length) {
      const o = a[0].point;
      window.__hekatanPonerSCU([o.x, o.y, o.z]);
    }
  }, true), window.__hekatanRecentrarGrilla = () => {
    var _a3, _b, _c, _d, _e2;
    if (!t.gridTarget) return;
    const e = window.__hekatanSCU ?? [0, 0, 0], n = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), a = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d), o = Number((a == null ? void 0 : a[n === "xz" ? "workY" : n === "yz" ? "workX" : "workZ"]) ?? 0);
    t.gridTarget.val = n === "xy" ? { position: [e[0], e[1], o], rotation: [Math.PI / 2, 0, 0] } : n === "xz" ? { position: [e[0], o, e[2]], rotation: [0, 0, 0] } : { position: [o, e[1], e[2]], rotation: [0, 0, Math.PI / 2] };
  }, window.__hekatanLimpiarGrillasAux = () => {
    var _a3, _b, _c;
    const e = window, n = (e.__hekatanPlanosAux ?? []).length + (e.__hekatanLevels ?? []).filter((s) => (s == null ? void 0 : s.tipo) !== "piso").length;
    if (!n) return 0;
    (_a3 = e.__hekatanPushUndo) == null ? void 0 : _a3.call(e);
    const a = e.__hekatanPlanosAux;
    Array.isArray(a) ? a.length = 0 : e.__hekatanPlanosAux = [];
    const o = e.__hekatanLevels;
    if (Array.isArray(o)) {
      const s = o.filter((r) => (r == null ? void 0 : r.tipo) === "piso");
      o.length = 0, o.push(...s);
    }
    (_b = e.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(e);
    try {
      (_c = e.__hekatanRefreshLevels) == null ? void 0 : _c.call(e);
    } catch {
    }
    return n;
  }, window.__hekatanRefrescarGrillas = () => {
    if (!t.gridTarget) return;
    const e = t.gridTarget.rawVal.rotation, n = new ho().setFromEuler(new En(...e));
    new ho().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2), Ka(t.gridTarget.rawVal.position[2], Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3);
  }, ue.derive(() => {
    Fe.geometry.setAttribute("position", new It(t.points.val.flat(), 3)), Fe.geometry.computeBoundingSphere();
  }), ue.derive(() => {
    const e = 0.05 * C * 0.5 * P.val;
    L.params.Points.threshold = 0.4 * e;
  }), ue.derive(() => {
    var _a3;
    const e = t.points.val ?? [], a = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], o = [];
    for (const r of a) {
      const [f, i, l] = e[r];
      o.push(f, i, l);
    }
    const s = new Ee();
    s.setAttribute("position", new It(o, 3)), Ze.geometry.dispose(), Ze.geometry = s;
  });
  let la = false, Rn = 0;
  $.addEventListener("pointerdown", () => {
    la = true;
  }), $.addEventListener("pointerup", () => {
    la = false;
  }), $.addEventListener("pointermove", () => {
    la && Rn++;
  });
  const Nt = document.createElement("div");
  Nt.id = "hk-window-select", Nt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Nt);
  let an = null, uo = false, Ht = null;
  const ra = (e, n, a, o, s) => {
    s ? (Nt.style.borderColor = "#34d399", Nt.style.borderStyle = "dashed", Nt.style.background = "rgba(52, 211, 153, 0.10)") : (Nt.style.borderColor = "#22d3ee", Nt.style.borderStyle = "solid", Nt.style.background = "rgba(34, 211, 238, 0.10)"), Nt.style.left = Math.min(e, a) + "px", Nt.style.top = Math.min(n, o) + "px", Nt.style.width = Math.abs(a - e) + "px", Nt.style.height = Math.abs(o - n) + "px", Nt.style.display = "block";
  }, Ha = (e, n, a, o, s) => {
    var _a3, _b, _c, _d;
    const r = Math.min(e, a), f = Math.max(e, a), i = Math.min(n, o), l = Math.max(n, o), d = a < e, c = $.getBoundingClientRect(), y = _();
    y.updateMatrixWorld();
    const p = (A) => {
      const R = new F(A[0], A[1], A[2]);
      return R.project(y), { x: c.left + (R.x * 0.5 + 0.5) * c.width, y: c.top + (-R.y * 0.5 + 0.5) * c.height };
    }, h = (A) => A.x >= r && A.x <= f && A.y >= i && A.y <= l, M = (A, R) => !(A.x < r && R.x < r || A.x > f && R.x > f || A.y < i && R.y < i || A.y > l && R.y > l);
    s || Ke.clear();
    let v = 0;
    const m = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let A = 0; A < m.length; A++) {
      const R = m[A];
      R && h(p(R)) && (Ke.add(`pt:${A}`), v++);
    }
    const u = (A, R) => d ? h(A) || h(R) || M(A, R) : h(A) && h(R), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], b = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let A = 0; A < x.length; A++) {
      const R = x[A];
      if (b.includes(A)) {
        let V;
        if (!d) V = R.every((N) => {
          const Q = m[N];
          return !!Q && h(p(Q));
        });
        else {
          V = false;
          for (let N = 0; N < R.length - 1; N++) {
            const Q = m[R[N]], re = m[R[N + 1]];
            if (!(!Q || !re) && u(p(Q), p(re))) {
              V = true;
              break;
            }
          }
        }
        V && (Ke.add(`poly:${A}`), v++);
      } else for (let V = 0; V < R.length - 1; V++) {
        const N = m[R[V]], Q = m[R[V + 1]];
        !N || !Q || u(p(N), p(Q)) && (Ke.add(`seg:${A}:${V}`), v++);
      }
    }
    const S = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let A = 0; A < S.length; A++) {
      const R = S[A];
      if (!R || R.length !== 6) continue;
      const te = p([R[0], R[1], R[2]]), V = p([R[3], R[4], R[5]]);
      u(te, V) && (Ke.add(`aux:${A}`), v++);
    }
    nn(), ce(v === 0 && !d ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${d ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${v} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ke.size})`), Nt.style.display = "none";
  }, Vo = () => {
    Ht && (Ht = null, Nt.style.display = "none", ce("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Vo, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Ht && Vo();
  });
  const ca = () => {
    var _a3, _b, _c, _d;
    if (Ke.size === 0) return false;
    const e = [...Ke], n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], o = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? [], f = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const M of e) {
      const [v, ...m] = M.split(":");
      if (v === "pt") f.add(+m[0]);
      else if (v === "poly") i.add(+m[0]);
      else if (v === "seg") {
        const u = +m[0], x = +m[1];
        l.has(u) || l.set(u, /* @__PURE__ */ new Set()), l.get(u).add(x);
      } else v === "aux" && d.add(+m[0]);
    }
    let c = 0, y = [], p = [];
    const h = /* @__PURE__ */ new Map();
    for (let M = 0; M < a.length; M++) {
      if (i.has(M)) {
        c++;
        continue;
      }
      h.set(M, y.length);
      const v = l.get(M);
      if (v && v.size > 0) {
        let m = [];
        for (let u = 0; u < a[M].length; u++) m.push(a[M][u]), u < a[M].length - 1 && v.has(u) && (m.length >= 2 && y.push(m), m = [], c++);
        (m.length >= 2 || m.length === 1) && y.push(m);
      } else y.push([...a[M]]);
    }
    if (i.size > 0) {
      const M = /* @__PURE__ */ new Set();
      for (const v of y) for (const m of v) M.add(m);
      for (const v of i) for (const m of a[v] ?? []) M.has(m) || f.add(m);
    }
    if (f.size > 0) {
      const M = [], v = /* @__PURE__ */ new Map();
      for (let u = 0; u < n.length; u++) {
        if (f.has(u)) {
          c++;
          continue;
        }
        v.set(u, M.length), M.push([...n[u]]);
      }
      const m = [];
      for (const u of y) {
        let x = [];
        for (const b of u) {
          const E = v.get(b);
          E === void 0 ? (x.length >= 2 && m.push(x), x = []) : x.push(E);
        }
        x.length >= 2 && m.push(x);
      }
      y = m, t.points.val = M;
    }
    for (const M of o) {
      const v = h.get(M);
      v !== void 0 && v < y.length && p.push(v);
    }
    if (t.polylines && (t.polylines.val = y), t.areas && (t.areas.val = p), d.size > 0 && s) {
      const M = r.filter((v, m) => !d.has(m));
      "val" in s ? s.val = M : window.__hekatanDrawingAuxLines = M, c += d.size;
    }
    Ke.clear(), nn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ce(`\u{1F5D1} ${c} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = ca, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const n = document.activeElement, a = n && (n.id === "hk3-cmd-input" || n.id === "hk-dyn-input") && n.value === "";
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable) && !a || Ke.size !== 0 && (e.preventDefault(), ca());
  });
  const Gt = document.createElement("div");
  Gt.id = "hk-properties-pane";
  const Ja = "hk-props-pane-pos";
  let po = null;
  try {
    const e = localStorage.getItem(Ja);
    e && (po = JSON.parse(e));
  } catch {
  }
  Gt.style.cssText = ["position:fixed", po ? `left:${po.left}px` : "left:14px", po ? `top:${po.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Gt);
  const Ws = () => {
    const e = Gt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let n = false, a = 0, o = 0, s = 0, r = 0;
    e.addEventListener("mousedown", (f) => {
      n = true, a = f.clientX, o = f.clientY;
      const i = Gt.getBoundingClientRect();
      s = i.left, r = i.top, Gt.style.transform = "none", Gt.style.left = `${s}px`, Gt.style.top = `${r}px`, f.preventDefault();
    }), window.addEventListener("mousemove", (f) => {
      if (!n) return;
      const i = f.clientX - a, l = f.clientY - o, d = Math.max(0, Math.min(window.innerWidth - 80, s + i)), c = Math.max(0, Math.min(window.innerHeight - 40, r + l));
      Gt.style.left = `${d}px`, Gt.style.top = `${c}px`;
    }), window.addEventListener("mouseup", () => {
      if (n) {
        n = false;
        try {
          localStorage.setItem(Ja, JSON.stringify({ left: parseFloat(Gt.style.left), top: parseFloat(Gt.style.top) }));
        } catch {
        }
      }
    });
  }, ne = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Mt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ht = null;
  const $t = (e, n, a, o) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: n, prop: a, value: o } }));
  }, Hs = () => {
    var _a3, _b;
    if (ht && (ht.dispose(), ht = null), Ke.size === 0) {
      Gt.style.display = "none";
      return;
    }
    const e = [...Ke], n = e.filter((y) => y.startsWith("pt:"));
    if (n.length === 1) {
      const y = +n[0].slice(3), h = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(y);
      h ? [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = h.map(Boolean) : ne.Ux = ne.Uy = ne.Uz = ne.Rx = ne.Ry = ne.Rz = false;
      const v = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(y);
      v ? [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz] = v : ne.Fx = ne.Fy = ne.Fz = ne.Mx = ne.My = ne.Mz = 0;
    }
    const a = e.filter((y) => y.startsWith("seg:")), o = e.filter((y) => y.startsWith("poly:")), s = e.filter((y) => y.startsWith("aux:")), r = n.length > 0, f = a.length > 0, i = o.length > 0, l = !r && !f && !i, d = [];
    n.length && d.push(`\u{1F535} ${n.length} nodo(s)`), a.length && d.push(`\u{1F4CF} ${a.length} segmento(s)`), o.length && d.push(`\u25AD ${o.length} \xE1rea(s)`), s.length && d.push(`\u250A ${s.length} aux`);
    const c = `\u{1F3AF} ${Ke.size} item(s) \u2014 ${d.join(", ")}`;
    ht = new Es({ container: Gt, title: c });
    {
      const y = ht.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      y.addBinding(Mt, "dx", { label: "\u0394x (m)", step: 0.1 }), y.addBinding(Mt, "dy", { label: "\u0394y (m)", step: 0.1 }), y.addBinding(Mt, "dz", { label: "\u0394z (m)", step: 0.1 }), y.addBinding(Mt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), y.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        ce(v ? `\u29C9 Replicado \xD7${v} (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), y.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        ce(v && (v.lineas || v.areas) ? `\u21D7 Extruido: ${v.lineas} barra(s), ${v.areas} pa\xF1o(s) (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m \xD7 ${Mt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const p = { vuelo: 1.5, losa: true, borde: true, ambos: true }, h = y.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      h.addBinding(p, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), h.addBinding(p, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), h.addBinding(p, "borde", { label: "con viga de borde" }), h.addBinding(p, "ambos", { label: "a los dos lados" }), h.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, p.vuelo, { losa: p.losa, vigaBorde: p.borde, lados: p.ambos ? "ambos" : "afuera" });
        ce(v ? `\u2310 Volado de ${p.vuelo} m en ${v} pa\xF1o(s)` + (p.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), y.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, 1);
        ce(v ? `\u2192 Copia desplazada \u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const M = y.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      M.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a4;
        return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
      }), M.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ce(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (r) {
      const y = ht.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${n.length} nodo(s)` });
      y.addBinding(ne, "Ux"), y.addBinding(ne, "Uy"), y.addBinding(ne, "Uz"), y.addBinding(ne, "Rx"), y.addBinding(ne, "Ry"), y.addBinding(ne, "Rz");
      const p = (u, x) => {
        [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = u;
        try {
          ht.refresh();
        } catch {
        }
        $t("nodes", n, "supports", u), ce(`\u2713 ${x}: ${n.length} nudo(s) apoyado(s) (${u.map((b, E) => b ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][E] : "").filter(Boolean).join(" ")}).`);
      };
      y.addButton({ title: `\u25B2 Empotrar los ${n.length} nudo(s) (6 GDL)` }).on("click", () => p([true, true, true, true, true, true], "Empotrado")), y.addButton({ title: `\u25B3 Articular los ${n.length} nudo(s) (Ux Uy Uz)` }).on("click", () => p([true, true, true, false, false, false], "Articulado"));
      const h = ht.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      h.addBinding(ne, "Kx", { label: "Kx", min: 0, step: 100 }), h.addBinding(ne, "Ky", { label: "Ky", min: 0, step: 100 }), h.addBinding(ne, "Kz", { label: "Kz", min: 0, step: 100 }), h.addBinding(ne, "Krx", { label: "Krx", min: 0, step: 1e3 }), h.addBinding(ne, "Kry", { label: "Kry", min: 0, step: 1e3 }), h.addBinding(ne, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const M = ht.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      M.addBinding(ne, "Fx", { step: 0.1 }), M.addBinding(ne, "Fy", { step: 0.1 }), M.addBinding(ne, "Fz", { step: 0.1 }), M.addBinding(ne, "Mx", { step: 0.1 }), M.addBinding(ne, "My", { step: 0.1 }), M.addBinding(ne, "Mz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ne, "mass", { label: "m", min: 0, step: 1 }), ht.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ne, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ht.addButton({ title: `\u2713 Aplicar a ${n.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let u = 0;
        const x = [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz];
        x.some((S) => S) && ($t("nodes", n, "supports", x), u++);
        const b = [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz];
        b.some((S) => S !== 0) && ($t("nodes", n, "loads", b), u++);
        const E = [ne.Kx, ne.Ky, ne.Kz, ne.Krx, ne.Kry, ne.Krz];
        if (E.some((S) => S !== 0) && ($t("nodes", n, "springs", E), u++), ne.mass !== 0 && ($t("nodes", n, "mass", ne.mass), u++), ne.diaphragm !== "Ninguno" && ($t("nodes", n, "diaphragm", ne.diaphragm), u++), u === 0) {
          ce("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let S = document.getElementById("hk-prop-toast");
          S || (S = document.createElement("div"), S.id = "hk-prop-toast", S.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(S)), S.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", S.style.background = "rgba(217,119,6,0.97)", S.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            S && (S.style.opacity = "0");
          }, 3200);
        } else ce(`\u2713 Propiedades aplicadas a ${n.length} nodo(s)`);
      });
    }
    if (f) {
      const y = ht.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      y.addBinding(ne, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), y.addBinding(ne, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const p = ht.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      p.addBinding(ne, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), p.addBinding(ne, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), p.addBinding(ne, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), p.addBinding(ne, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ht.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ne, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ht.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ne, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const v = ht.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      v.addBinding(ne, "relMxI", { label: "Mx I" }), v.addBinding(ne, "relMyI", { label: "My I" }), v.addBinding(ne, "relMzI", { label: "Mz I" });
      const m = ht.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      m.addBinding(ne, "relMxJ", { label: "Mx J" }), m.addBinding(ne, "relMyJ", { label: "My J" }), m.addBinding(ne, "relMzJ", { label: "Mz J" }), ht.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ne, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const x = ht.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      x.addBinding(ne, "LKx", { label: "LKx", min: 0, step: 100 }), x.addBinding(ne, "LKy", { label: "LKy", min: 0, step: 100 }), x.addBinding(ne, "LKz", { label: "LKz", min: 0, step: 100 });
      const b = ht.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      b.addBinding(ne, "qx", { step: 0.1 }), b.addBinding(ne, "qy", { step: 0.1 }), b.addBinding(ne, "qz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ne, "massPerM", { label: "m/L", min: 0, step: 1 }), ht.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        $t("segs", a, "section", ne.section), $t("segs", a, "material", ne.material_frame);
        const S = { A: ne.A_mod, Iz: ne.Iz_mod, Iy: ne.Iy_mod, J: ne.J_mod };
        (S.A !== 1 || S.Iz !== 1 || S.Iy !== 1 || S.J !== 1) && $t("segs", a, "modifiers", S), ne.insertionPoint !== "10 \u2014 Centroid" && $t("segs", a, "insertionPoint", ne.insertionPoint), ne.beta !== 0 && $t("segs", a, "beta", ne.beta);
        const A = [ne.relMxI, ne.relMyI, ne.relMzI], R = [ne.relMxJ, ne.relMyJ, ne.relMzJ];
        (A.some((N) => N) || R.some((N) => N)) && $t("segs", a, "releases", { i: A, j: R }), ne.hinges !== "None" && $t("segs", a, "hinges", ne.hinges);
        const te = [ne.LKx, ne.LKy, ne.LKz];
        te.some((N) => N !== 0) && $t("segs", a, "lineSprings", te);
        const V = [ne.qx, ne.qy, ne.qz];
        V.some((N) => N !== 0) && $t("segs", a, "distLoad", V), ne.massPerM !== 0 && $t("segs", a, "massPerM", ne.massPerM), ce(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (i) {
      const y = ht.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${o.length}` });
      y.addBinding(ne, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), y.addBinding(ne, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), y.addBinding(ne, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ht.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ne, "surfLoad", { label: "q", step: 0.1 }), ht.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        $t("areas", o, "shellType", ne.shellType), $t("areas", o, "thickness", ne.thickness), $t("areas", o, "material", ne.material_shell), ne.surfLoad !== 0 && $t("areas", o, "surfLoad", ne.surfLoad), ce(`\u2713 Propiedades aplicadas a ${o.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (l) {
      const y = ht.addFolder({ title: "\u2139 Selecci\xF3n" }), p = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      y.addBinding(p, "msg", { readonly: true, label: "" });
    }
    ht.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ke.clear(), nn();
    }), Gt.style.display = "block", Ws();
  };
  window.__hekatanRefreshPropsPane = Hs;
  let Jn = null, Io = false;
  $.addEventListener("pointerdown", (e) => {
    e.button === 2 && (Jn = { x: e.clientX, y: e.clientY }, Io = false);
  }), $.addEventListener("pointermove", (e) => {
    if (Jn && e.buttons & 2 && !Io) {
      const n = e.clientX - Jn.x, a = e.clientY - Jn.y;
      Math.hypot(n, a) > 8 && (Io = true);
    }
  }), $.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const n = Jn !== null && !Io;
      Jn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (n) {
        if (Ht ? Vo() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ke.size > 0 && (Ke.clear(), nn()), t.polylines) {
          const r = t.polylines.rawVal;
          (r[r.length - 1] ?? []).length > 0 && (t.polylines.val = [...r, []]);
        }
        const o = window.__hekatanCadState, s = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"), ce(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ce("\u238B Cancelado (click derecho)");
      }
    }
  }), $.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), $.addEventListener("pointerdown", (e) => {
    var _a3, _b, _c;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    n !== "select" && n !== "none" && n || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (an = null, uo = false));
  }), $.addEventListener("pointermove", (e) => {
    if (Ht && e.buttons === 0) {
      const r = e.clientX < Ht.x;
      ra(Ht.x, Ht.y, e.clientX, e.clientY, r);
      return;
    }
    if (!an) return;
    const n = e.clientX - an.x, a = e.clientY - an.y, o = Math.hypot(n, a);
    if (!uo && o < 8) return;
    uo = true;
    const s = e.clientX < an.x;
    ra(an.x, an.y, e.clientX, e.clientY, s);
  }), $.addEventListener("pointerup", (e) => {
    if (!an) return;
    if (!uo) {
      an = null;
      return;
    }
    const n = e.ctrlKey || e.metaKey || e.shiftKey;
    Ha(an.x, an.y, e.clientX, e.clientY, n), an = null, uo = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Qt = new ut();
  Qt.visible = false, Qt.frustumCulled = false, g.add(Qt);
  const Oa = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, To = (e, n, a, o) => {
    var _a3, _b, _c, _d;
    for (window.__hekatanOsnapUltimo = { type: e, x: n, y: a, z: o }; Qt.children.length; ) {
      const f = Qt.children.pop();
      (_b = (_a3 = f.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = f.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Oa[e] ?? 16777215, r = new Ee().setFromPoints([new F(-1, -1, 0), new F(1, -1, 0), new F(1, -1, 0), new F(1, 1, 0), new F(1, 1, 0), new F(-1, 1, 0), new F(-1, 1, 0), new F(-1, -1, 0)]);
    Qt.add(new jt(r, new ft({ color: s, linewidth: 2 }))), Qt.position.set(n, a, o), Qt.visible = true, ua();
  };
  let da = 4;
  const ua = () => {
    Qt.visible && Qt.scale.setScalar(da * Fo(Qt.position));
  };
  window.__hekatanOsnapMarkerRef = Qt, window.__hekatanUpdateOsnapScale = ua, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (da = e, ua(), z()), da);
  const Ro = () => {
    Qt.visible = false, window.__hekatanOsnapUltimo = null;
  }, Js = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, gn = document.createElement("div");
  gn.id = "hk-osnap-etiqueta", gn.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(gn);
  const Do = (e, n, a) => {
    const o = Js[e];
    if (!o) {
      gn.style.display = "none";
      return;
    }
    gn.textContent = o, gn.style.color = "#" + (Oa[e] ?? 16777215).toString(16).padStart(6, "0"), gn.style.left = n + 18 + "px", gn.style.top = a - 26 + "px", gn.style.display = "block";
  }, Os = () => {
    gn.style.display = "none";
  }, Dn = new F(), Bn = (e, n, a) => {
    const o = _();
    if (!o) return null;
    const s = $.getBoundingClientRect();
    return Dn.set(e, n, a).project(o), !isFinite(Dn.x) || !isFinite(Dn.y) || Dn.z < -1 || Dn.z > 1 ? null : { x: s.left + (Dn.x * 0.5 + 0.5) * s.width, y: s.top + (-Dn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = Bn;
  const Qs = (e, n, a, o, s) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const r = window.__hekatanOsnap, f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let l = null;
    const d = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, c = s, y = (u, x, b, E) => {
      let S;
      if (c) {
        const R = Bn(x, b, E);
        if (!R || (S = Math.hypot(R.x - c.x, R.y - c.y), S > zn)) return;
      } else if (S = Math.hypot(x - e, b - n, E - a), S > o) return;
      const A = d[u] ?? 9;
      (!l || A < l.r || A === l.r && S < l.d) && (l = { type: u, x, y: b, z: E, d: S, r: A });
    };
    if (r.ori !== false && y("ori", 0, 0, 0), r.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, x = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, b = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, E = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", S = (R) => Math.round(R / x) * x, A = (R, te) => Math.abs(R) <= b + 1e-9 && Math.abs(te) <= b + 1e-9;
      if (E === "xz") {
        const R = S(e), te = S(a);
        A(R, te) && y("grid", R, n, te);
      } else if (E === "yz") {
        const R = S(n), te = S(a);
        A(R, te) && y("grid", e, R, te);
      } else {
        const R = S(e), te = S(n);
        A(R, te) && y("grid", R, te, a);
        const V = window.__hekatanPlanosAux ?? [];
        for (const Q of V.slice(0, 24)) {
          if (Q.plano === "xy" || !isFinite(Q.d)) continue;
          const re = Q.plano === "xz" ? new F(0, 1, 0) : new F(1, 0, 0), ve = new yo(re, -Q.d), Ge = new F();
          if (L.ray.intersectPlane(ve, Ge)) if (Q.plano === "xz") {
            const Ie = S(Ge.x), Qe = S(Ge.z);
            A(Ie, Qe) && y("grid", Ie, Q.d, Qe);
          } else {
            const Ie = S(Ge.y), Qe = S(Ge.z);
            A(Ie, Qe) && y("grid", Q.d, Ie, Qe);
          }
        }
        const N = window.__hekatanLevels ?? [];
        if (N.length) {
          const Q = L.ray, re = new yo(), ve = new F();
          for (const Ge of N.slice(0, 24)) {
            if (!isFinite(Ge == null ? void 0 : Ge.z) || Math.abs(Ge.z - a) < 1e-6 || (re.set(new F(0, 0, 1), -Ge.z), !Q.intersectPlane(re, ve))) continue;
            const Ie = S(ve.x), Qe = S(ve.y);
            A(Ie, Qe) && y("grid", Ie, Qe, Ge.z);
          }
        }
      }
    }
    (r.node || r.end) && f.forEach((u) => {
      r.node && y("node", u[0], u[1], u[2]);
    });
    for (const u of i) if (!(u.length < 2)) for (let x = 0; x < u.length - 1; x++) {
      const b = f[u[x]], E = f[u[x + 1]];
      if (!(!b || !E) && (r.end && (y("end", b[0], b[1], b[2]), y("end", E[0], E[1], E[2])), r.mid && y("mid", (b[0] + E[0]) / 2, (b[1] + E[1]) / 2, (b[2] + E[2]) / 2), r.nea || r.per)) {
        const S = E[0] - b[0], A = E[1] - b[1], R = E[2] - b[2], te = S * S + A * A + R * R;
        if (te < 1e-12) continue;
        const V = Math.max(0, Math.min(1, ((e - b[0]) * S + (n - b[1]) * A + (a - b[2]) * R) / te)), N = b[0] + V * S, Q = b[1] + V * A, re = b[2] + V * R;
        r.nea && y("nea", N, Q, re), r.per && y("per", N, Q, re);
      }
    }
    if (r.cen) {
      const u = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const x of u) {
        const b = i[x];
        if (!b || b.length < 3) continue;
        const E = b[0] === b[b.length - 1] ? b.slice(0, -1) : b;
        let S = 0, A = 0, R = 0, te = 0;
        for (const V of E) {
          const N = f[V];
          N && (S += N[0], A += N[1], R += N[2], te++);
        }
        te >= 3 && y("cen", S / te, A / te, R / te);
      }
    }
    if (r.cen) {
      const u = Ya(), x = [...zo];
      for (const b of u) x.some((E) => Math.hypot(E.c[0] - b.c[0], E.c[1] - b.c[1], E.c[2] - b.c[2]) < 1e-6 && Math.abs(E.r - b.r) < 1e-6) || x.push(b);
      for (const b of x) {
        if (!f.some((A) => Math.abs(Math.hypot(A[0] - b.c[0], A[1] - b.c[1], A[2] - b.c[2]) - b.r) < 1e-6)) continue;
        const S = Math.hypot(e - b.c[0], n - b.c[1], a - b.c[2]);
        if (S < o || Math.abs(S - b.r) < o) {
          const A = Math.min(S, o * 0.5), R = 3;
          (!l || R < l.r || R === l.r && A < l.d) && (l = { type: "cen", x: b.c[0], y: b.c[1], z: b.c[2], d: A, r: R });
        }
      }
    }
    if (r.int) {
      const u = [];
      for (const x of i) for (let b = 0; b < x.length - 1; b++) {
        const E = f[x[b]], S = f[x[b + 1]];
        if (!E || !S) continue;
        const A = S[0] - E[0], R = S[1] - E[1], te = S[2] - E[2], V = A * A + R * R + te * te;
        if (V < 1e-12) continue;
        const N = Math.max(0, Math.min(1, ((e - E[0]) * A + (n - E[1]) * R + (a - E[2]) * te) / V));
        Math.hypot(E[0] + N * A - e, E[1] + N * R - n, E[2] + N * te - a) < 3 * o && u.push([E, S]);
      }
      for (let x = 0; x < u.length; x++) for (let b = x + 1; b < u.length; b++) {
        const [E, S] = u[x], [A, R] = u[b], te = [S[0] - E[0], S[1] - E[1], S[2] - E[2]], V = [R[0] - A[0], R[1] - A[1], R[2] - A[2]], N = [E[0] - A[0], E[1] - A[1], E[2] - A[2]], Q = te[0] * te[0] + te[1] * te[1] + te[2] * te[2], re = te[0] * V[0] + te[1] * V[1] + te[2] * V[2], ve = V[0] * V[0] + V[1] * V[1] + V[2] * V[2], Ge = te[0] * N[0] + te[1] * N[1] + te[2] * N[2], Ie = V[0] * N[0] + V[1] * N[1] + V[2] * N[2], Qe = Q * ve - re * re;
        if (Qe < 1e-12) continue;
        const Ce = (re * Ie - ve * Ge) / Qe, tt = (Q * Ie - re * Ge) / Qe;
        if (Ce < -1e-6 || Ce > 1 + 1e-6 || tt < -1e-6 || tt > 1 + 1e-6) continue;
        const Xe = [E[0] + Ce * te[0], E[1] + Ce * te[1], E[2] + Ce * te[2]], Ae = [A[0] + tt * V[0], A[1] + tt * V[1], A[2] + tt * V[2]];
        if (Math.hypot(Xe[0] - Ae[0], Xe[1] - Ae[1], Xe[2] - Ae[2]) > 1e-4) continue;
        [E, S, A, R].some((Je) => Math.hypot(Je[0] - Xe[0], Je[1] - Xe[1], Je[2] - Xe[2]) < 1e-6) || y("int", Xe[0], Xe[1], Xe[2]);
      }
    }
    const p = window.__hekatanAxisGrids ?? [], h = window.__hekatanLevels ?? [], M = p.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, x] of M) {
      r.end && (y("end", u[0], u[1], u[2]), y("end", x[0], x[1], x[2]));
      const b = x[0] - u[0], E = x[1] - u[1], S = x[2] - u[2], A = b * b + E * E + S * S;
      if (A < 1e-12) continue;
      const R = Math.max(0, Math.min(1, ((e - u[0]) * b + (n - u[1]) * E + (a - u[2]) * S) / A));
      if (r.nea && y("nea", u[0] + R * b, u[1] + R * E, u[2] + R * S), r.int && Math.abs(S) > 1e-9) for (const te of h) {
        const V = (te.z - u[2]) / S;
        V < -1e-6 || V > 1 + 1e-6 || y("int", u[0] + V * b, u[1] + V * E, te.z);
      }
    }
    if (r.int || r.node) for (let u = 0; u < M.length; u++) for (let x = u + 1; x < M.length; x++) {
      const [b, E] = M[u], [S, A] = M[x], R = E[0] - b[0], te = E[1] - b[1], V = A[0] - S[0], N = A[1] - S[1], Q = R * N - te * V;
      if (Math.abs(Q) < 1e-12) continue;
      const re = b[0] - S[0], ve = b[1] - S[1], Ge = (V * ve - N * re) / Q, Ie = (R * ve - te * re) / Q;
      if (Ge < -1e-6 || Ge > 1 + 1e-6 || Ie < -1e-6 || Ie > 1 + 1e-6) continue;
      const Qe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      y("int", b[0] + Ge * R, b[1] + Ge * te, typeof Qe == "number" ? Qe : a);
    }
    const v = window.__hekatanDrawingAuxLines, m = (v == null ? void 0 : v.rawVal) ?? (v == null ? void 0 : v.val) ?? v ?? [];
    for (const u of m) {
      if (u.length !== 6) continue;
      const x = [u[0], u[1], u[2]], b = [u[3], u[4], u[5]];
      if (r.end && (y("end", x[0], x[1], x[2]), y("end", b[0], b[1], b[2])), r.mid && y("mid", (x[0] + b[0]) / 2, (x[1] + b[1]) / 2, (x[2] + b[2]) / 2), r.nea || r.per) {
        const E = b[0] - x[0], S = b[1] - x[1], A = b[2] - x[2], R = E * E + S * S + A * A;
        if (R < 1e-12) continue;
        const te = Math.max(0, Math.min(1, ((e - x[0]) * E + (n - x[1]) * S + (a - x[2]) * A) / R)), V = x[0] + te * E, N = x[1] + te * S, Q = x[2] + te * A;
        r.nea && y("nea", V, N, Q), r.per && y("per", V, N, Q);
      }
    }
    return l ? { type: l.type, x: l.x, y: l.y, z: l.z } : null;
  }, On = new ut();
  On.frustumCulled = false, g.add(On);
  const Qa = new ft({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let ja = 0;
  const es = () => {
    var _a3, _b;
    for (const e of On.children.slice()) On.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (e) => {
    var _a3, _b;
    es();
    const n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of e || []) {
      const r = String(s).split(":");
      let f = [];
      if (r[0] === "pt") {
        const d = n[+r[1]];
        d && (f = [d, [d[0] + 1e-3, d[1], d[2]]]);
      } else if (r[0] === "seg") {
        const d = a[+r[1]] || [], c = n[d[+r[2]]], y = n[d[+r[2] + 1]];
        c && y && (f = [c, y]);
      } else r[0] === "poly" && (f = (a[+r[1]] || []).map((c) => n[c]).filter(Boolean));
      if (f.length < 2) continue;
      const i = new Ee().setFromPoints(f.map((d) => new F(d[0], d[1], d[2]))), l = new Et(i, Qa);
      l.renderOrder = 1200, On.add(l);
    }
    if (!On.children.length) return;
    ja = performance.now() + 900;
    const o = () => {
      const s = ja - performance.now();
      if (s <= 0) {
        es(), z();
        return;
      }
      Qa.opacity = Math.min(1, s / 900) * 0.95, z(), requestAnimationFrame(o);
    };
    requestAnimationFrame(o);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a3;
    const n = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
    Array.isArray(n) && n.length && window.__hekatanDestello(n);
  }), window.__hekatanOsnapCompute = Qs, window.__hekatanOsnapShow = To, window.__hekatanOsnapHide = Ro;
  let We = [], Ct = 0, Nn = 0, Bt = null;
  const fo = document.createElement("div");
  fo.id = "hk-cad-status", fo.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", fo.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(fo);
  const js = () => {
    var _a3, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), zt && e.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && e.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, ce = (e) => {
    var _a3;
    const n = e + js();
    fo.textContent = n, window.__hekatanCadStatusText = n;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, ei = "Comando:", ti = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", n = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], a = n.length ? n[n.length - 1] : [], o = We.length, s = (r, f = []) => ({ txt: r, ops: f });
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
        return s(o ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${at.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return s("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return s(`REGLA ${pt.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
      case "rect":
        return s(o ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(o ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(o === 0 ? "ARCO Precise punto inicial:" : o === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "parabola":
        return s(`PAR\xC1BOLA Precise punto ${o + 1} de 3 (pasa por los tres):`);
      case "cubica":
        return s(`C\xDABICA Precise punto ${o + 1} de 4 (pasa por los cuatro):`);
      case "revolve":
        return s("REVOLUCI\xD3N Precise un punto del eje vertical (Z) alrededor del que gira la selecci\xF3n:");
      case "loft":
        return s("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${Ct > 0 ? Ct : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(o ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${Ct > 0 ? Ct : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${o + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(Bt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(Bt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(Bt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Nn > 0 ? ` (distancia ${Nn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
      case "axis":
        return s("EJE Precise el primer punto del eje:");
      case "aux":
        return s(o ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return s("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return s(o ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return s("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return Ke.size ? s(o ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ke.size ? s(o ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ke.size ? s(`SELECCI\xD3N ${Ke.size} objeto${Ke.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(ei);
    }
  }, Jt = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const e = ti(), n = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !n && !a ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, s, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Jt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", n = e.split("   |   ")[0] ?? e;
    ce(n);
  }, window.__hekatanCadResetPending = () => {
    We = [], at = [], Te.visible = false, pa(), Bt = null, z(), ce("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Jt();
  };
  function pa() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((n) => n.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = pa;
  const Qn = [], Bo = [], ni = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, oi = () => JSON.parse(JSON.stringify(window.__hekatanAxisGrids ?? [])), ai = () => JSON.parse(JSON.stringify(window.__hekatanLevels ?? [])), si = () => JSON.parse(JSON.stringify(window.__hekatanPlanosAux ?? [])), fa = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])), x: ni(), e: oi(), n: ai(), g: si() };
  }, ts = (e) => {
    var _a3, _b, _c, _d;
    if (t.points.val = e.p, t.polylines && (t.polylines.val = e.l), t.areas && (t.areas.val = e.a), e.x) {
      const n = window.__hekatanDrawingAuxLines;
      n && "val" in n && (n.val = e.x);
    }
    if (e.e) {
      const n = window.__hekatanAxisGrids;
      Array.isArray(n) && (n.length = 0, n.push(...e.e));
    }
    if (e.n) {
      const n = window.__hekatanLevels;
      Array.isArray(n) && (n.length = 0, n.push(...e.n));
    }
    if (e.g) {
      const n = window.__hekatanPlanosAux;
      Array.isArray(n) ? (n.length = 0, n.push(...e.g)) : window.__hekatanPlanosAux = e.g;
    }
    try {
      (_a3 = window.__hekatanRefreshAxes) == null ? void 0 : _a3.call(window), (_b = window.__hekatanRefreshLevels) == null ? void 0 : _b.call(window);
    } catch {
    }
    try {
      (_c = window.__hekatanRefrescarGrillas) == null ? void 0 : _c.call(window);
    } catch {
    }
    We = [], qe.visible = false, Xt.visible = false, pn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    z(), Jt();
  }, St = () => {
    Qn.push(fa()), Qn.length > 100 && Qn.shift(), Bo.length = 0;
  }, No = () => {
    const e = Qn.pop();
    if (!e) {
      ce("\u21B6 Nada para deshacer");
      return;
    }
    Bo.push(fa()), ts(e), ce(`\u21B6 Deshacer \u2014 quedan ${Qn.length}`);
  }, ns = () => {
    const e = Bo.pop();
    if (!e) {
      ce("\u21B7 Nada para rehacer");
      return;
    }
    Qn.push(fa()), ts(e), ce(`\u21B7 Rehacer \u2014 quedan ${Bo.length}`);
  };
  window.__hekatanPushUndo = St, window.__hekatanUndo = No, window.__hekatanRedo = ns, document.addEventListener("keydown", (e) => {
    var _a3;
    const n = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (n === "y" || n === "z" && e.shiftKey))) return;
    const o = e.target;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && (((_a3 = o.value) == null ? void 0 : _a3.length) ?? 0) > 0 && o.__hkSucio || (e.preventDefault(), e.stopPropagation(), ns());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a3, _b, _c, _d, _e2;
    const n = e.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    if (a !== "line" && a !== "polyline") return n === "u" || n === "deshacer" || n === "undo" ? (No(), true) : false;
    if (n === "c" || n === "cerrar" || n === "close") {
      if (s.length < 3) return ce("Cerrar necesita al menos tres puntos."), true;
      St(), t.polylines.val = [...o.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ha(), ce(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (n === "u" || n === "deshacer" || n === "undo") {
      if (!s.length) return No(), true;
      St();
      const r = s[s.length - 1], f = s.slice(0, -1), i = o.some((c, y) => y !== o.length - 1 && c.includes(r)) || f.includes(r);
      let l = t.points.rawVal, d = [...o.slice(0, -1), f];
      if (!i && r === l.length - 1 && (l = l.slice(0, -1), t.points.val = l), t.polylines.val = d, f.length) {
        const c = l[f[f.length - 1]];
        c && (Ye = [c[0], c[1], c[2]]);
      } else Ye = null, qe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return z(), ce(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${f.length}.`), Jt(), true;
    }
    return false;
  }, document.addEventListener("input", (e) => {
    const n = e.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && (n.__hkSucio = true);
  }, { capture: true }), document.addEventListener("focusout", (e) => {
    const n = e.target;
    n && (n.__hkSucio = false);
  }, { capture: true }), document.addEventListener("keydown", (e) => {
    var _a3;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
      const n = e.target, a = n == null ? void 0 : n.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && ((_a3 = n.value) == null ? void 0 : _a3.length) > 0 && !!n.__hkSucio) return;
      e.preventDefault(), e.stopPropagation(), No();
    }
  }, { capture: true });
  const ha = () => {
    We = [], Bt = null, pa(), zt = null, Va(), qe.visible = false, Xt.visible = false, pn(), ce("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), z(), Jt();
  };
  window.__hekatanFinalizeDraw = ha;
  const os = () => {
    var _a3, _b, _c;
    We = [], at = [], Te.visible = false;
    let e = false;
    Ke.size && (Ke.clear(), nn(), e = true), ha();
    try {
      const n = window.__hekatanCadState, a = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"));
    } catch {
    }
    ce(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), z(), Jt();
  };
  window.__hekatanEscapeCancel = os;
  const as = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Set();
    return Ke.forEach((a) => {
      if (a.startsWith("pt:")) n.add(+a.slice(3));
      else if (a.startsWith("poly:")) (e[+a.slice(5)] || []).forEach((o) => n.add(o));
      else if (a.startsWith("seg:")) {
        const o = a.split(":"), s = e[+o[1]] || [], r = s[+o[2]], f = s[+o[2] + 1];
        r != null && n.add(r), f != null && n.add(f);
      }
    }), n;
  }, ss = (e, n, a) => {
    var _a3;
    const o = as();
    if (!o.size) return 0;
    St();
    const s = t.points.rawVal.map((r, f) => o.has(f) ? [r[0] + e, r[1] + n, r[2] + a] : r);
    t.points.val = s;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return nn(), z(), o.size;
  };
  window.__hekatanMoveSelection = ss;
  const is = (e, n) => {
    var _a3, _b, _c, _d, _e2;
    if (!Ke.size) {
      ce(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Jt();
      return;
    }
    if (We.push(n), We.length === 1) {
      Ye = n, ce(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)}). Precise el segundo punto.`), Jt();
      return;
    }
    const [a, o] = We, s = [o[0] - a[0], o[1] - a[1], o[2] - a[2]];
    We = [], qe.visible = false;
    let r = 0;
    e === "move" ? r = ss(s[0], s[1], s[2]) : (r = as().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ce(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${r} nudo${r === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (Ke.clear(), nn()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Jt();
  };
  window.__hekatanPasoMoverCopiar = is;
  const ii = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Cn = (e, n) => Math.hypot(e[0] - n[0], e[1] - n[1], e[2] - n[2]), ma = (e, n, a, o, s, r) => {
    const f = [n[0] - e[0], n[1] - e[1], n[2] - e[2]], i = [o[0] - a[0], o[1] - a[1], o[2] - a[2]], l = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], d = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], c = f[0] * i[0] + f[1] * i[1] + f[2] * i[2], y = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], p = f[0] * l[0] + f[1] * l[1] + f[2] * l[2], h = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], M = d * y - c * c;
    if (M < 1e-12) return null;
    const v = (c * h - y * p) / M, m = (d * h - c * p) / M;
    if (!s && (v < -1e-6 || v > 1 + 1e-6) || !r && (m < -1e-6 || m > 1 + 1e-6)) return null;
    const u = [e[0] + v * f[0], e[1] + v * f[1], e[2] + v * f[2]], x = [a[0] + m * i[0], a[1] + m * i[1], a[2] + m * i[2]];
    return Cn(u, x) > 1e-4 ? null : u;
  }, li = (e) => {
    var _a3;
    return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((n, a) => n + a.filter((o) => o === e).length, 0);
  }, ri = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, ci = (e, n) => {
    var _a3, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal, o = t.points.rawVal, s = ri[e];
    if (!Bt) {
      if (dn < 0) {
        ce(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Bt = { poly: dn, seg: Math.max(0, Sn) }, ce(e === "offset" ? `DESFASE l\xEDnea #${Bt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Nn > 0 ? ` (${Nn} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Jt();
      return;
    }
    if (e === "offset") {
      const v = Bt.poly, m = a[v];
      if (!m || m.length < 2) {
        Bt = null, ce("DESFASE: esa polil\xEDnea no tiene tramos."), Jt();
        return;
      }
      const u = m.length > 2 && m[0] === m[m.length - 1], x = ii(), b = [];
      for (let Ce = 0; Ce < m.length - 1; Ce++) {
        const tt = o[m[Ce]], Xe = o[m[Ce + 1]], Ae = [Xe[0] - tt[0], Xe[1] - tt[1], Xe[2] - tt[2]], Ue = Math.hypot(Ae[0], Ae[1], Ae[2]) || 1, Je = Ae[0] / Ue, mt = Ae[1] / Ue, vt = Ae[2] / Ue, Lt = [x[1] * vt - x[2] * mt, x[2] * Je - x[0] * vt, x[0] * mt - x[1] * Je], sn = Math.hypot(Lt[0], Lt[1], Lt[2]) || 1;
        b.push({ a: tt, b: Xe, n: [Lt[0] / sn, Lt[1] / sn, Lt[2] / sn] });
      }
      let E = 0, S = 1 / 0;
      b.forEach((Ce, tt) => {
        const Xe = ao(n[0], n[1], n[2], Ce.a[0], Ce.a[1], Ce.a[2], Ce.b[0], Ce.b[1], Ce.b[2]);
        Xe < S && (S = Xe, E = tt);
      });
      const A = b[E], R = Math.sign((n[0] - A.a[0]) * A.n[0] + (n[1] - A.a[1]) * A.n[1] + (n[2] - A.a[2]) * A.n[2]) || 1, te = Nn > 0 ? Nn : S;
      if (te < 1e-6) {
        ce("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const V = b.map((Ce) => ({ a: [Ce.a[0] + R * te * Ce.n[0], Ce.a[1] + R * te * Ce.n[1], Ce.a[2] + R * te * Ce.n[2]], b: [Ce.b[0] + R * te * Ce.n[0], Ce.b[1] + R * te * Ce.n[1], Ce.b[2] + R * te * Ce.n[2]] })), N = V.length, Q = (Ce) => {
        const tt = V[(Ce - 1 + N) % N], Xe = V[Ce % N];
        return ma(tt.a, tt.b, Xe.a, Xe.b, true, true) ?? Xe.a;
      }, re = [], ve = u ? N : N + 1;
      for (let Ce = 0; Ce < ve; Ce++) !u && Ce === 0 ? re.push(V[0].a) : !u && Ce === N ? re.push(V[N - 1].b) : re.push(Q(Ce));
      St();
      const Ge = o.length;
      t.points.val = [...o, ...re];
      const Ie = re.map((Ce, tt) => Ge + tt);
      u && Ie.push(Ge);
      let Qe = a.slice();
      Qe.length && Qe[Qe.length - 1].length === 0 && (Qe = Qe.slice(0, -1)), t.polylines.val = [...Qe, Ie, []], Bt = null, ce(`\u2713 Desfase a ${te.toFixed(2)} m \u2014 ${N} tramo${N === 1 ? "" : "s"} nuevo${N === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      z(), Jt();
      return;
    }
    let r = dn, f = Math.max(0, Sn);
    if (r < 0 || r === Bt.poly && f === Bt.seg) {
      let m = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (r = -1, a.forEach((u, x) => {
        for (let b = 0; b < u.length - 1; b++) {
          if (x === Bt.poly && b === Bt.seg) continue;
          const E = o[u[b]], S = o[u[b + 1]];
          if (!E || !S) continue;
          const A = ao(n[0], n[1], n[2], E[0], E[1], E[2], S[0], S[1], S[2]);
          A < m && (m = A, r = x, f = b);
        }
      }), r < 0) {
        ce(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const i = a[Bt.poly], l = o[i[Bt.seg]], d = o[i[Bt.seg + 1]], c = a[r], y = c[f], p = c[f + 1];
    if (!l || !d || y == null || p == null) {
      ce(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const h = o[y], M = o[p];
    if (e === "trim") {
      const v = ma(h, M, l, d, false, false);
      if (!v) {
        ce("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      St();
      const m = o.length;
      t.points.val = [...o, v];
      const u = [...c.slice(0, f + 1), m, ...c.slice(f + 1)];
      t.polylines.val = a.map((b, E) => E === r ? u : b);
      const x = Cn(n, h) < Cn(n, M);
      Da(r, x ? f : f + 1), ce(`\u2713 Recortado en (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const v = ma(h, M, l, d, true, false);
      if (!v) {
        ce("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = Cn(n, h) < Cn(n, M) ? f : f + 1;
      if (u !== 0 && u !== c.length - 1) {
        ce("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = c[u];
      if (Cn(v, h) + Cn(v, M) < Cn(h, M) + 1e-6) {
        ce("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (St(), li(x) > 1) {
        const E = o.length;
        t.points.val = [...o, v];
        const S = c.slice();
        S[u] = E, t.polylines.val = a.map((A, R) => R === r ? S : A);
      } else t.points.val = o.map((E, S) => S === x ? v : E);
      ce(`\u2713 Alargada hasta (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    z(), Jt();
  };
  window.__hekatanSelectionSize = () => Ke.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let n = e.length - 1;
    for (; n >= 0 && (!e[n] || e[n].length < 2); ) n--;
    return Ke.clear(), n >= 0 && Ke.add(`poly:${n}`), nn(), ce(n >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ke.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    Ke.clear();
    const a = /* @__PURE__ */ new Set();
    return e.forEach((o, s) => {
      !o || o.length < 2 || (Ke.add(`poly:${s}`), o.forEach((r) => a.add(r)));
    }), n.forEach((o, s) => {
      a.has(s) || Ke.add(`pt:${s}`);
    }), nn(), ce(`SELECCI\xD3N ${Ke.size} objetos (todo el modelo) \xB7 Esc suelta`), Ke.size;
  }, window.__hekatanReplicateSelection = (e, n, a, o, s = 0) => {
    var _a3, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1)), s = Math.max(0, Math.round(s || 0));
    const r = [...Ke], f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), d = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), y = [];
    if (r.forEach((m) => {
      if (m.startsWith("pt:")) {
        const u = +m.slice(3);
        f[u] && d.add(u);
      } else if (m.startsWith("poly:")) {
        const u = +m.slice(5);
        if (!i[u] || i[u].length < 2) return;
        c.add(u), i[u].forEach((x) => d.add(x));
      } else if (m.startsWith("seg:")) {
        const u = m.split(":"), x = +u[1], b = +u[2], E = i[x] || [], S = E[b], A = E[b + 1];
        S != null && A != null && (y.push([S, A]), d.add(S), d.add(A));
      }
    }), !d.size) return 0;
    St();
    const p = [...f];
    let h = i.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], v = [...d];
    for (let m = 1; m <= o; m++) {
      const u = s + m, x = e * u, b = n * u, E = a * u, S = /* @__PURE__ */ new Map();
      v.forEach((A) => {
        S.set(A, p.length), p.push([f[A][0] + x, f[A][1] + b, f[A][2] + E]);
      }), c.forEach((A) => {
        const R = i[A].map((V) => S.has(V) ? S.get(V) : V), te = h.length;
        h.push(R), l.has(A) && M.push(te);
      }), y.forEach(([A, R]) => {
        h.push([S.get(A), S.get(R)]);
      });
    }
    h.push([]), t.points.val = p, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return z(), o;
  }, window.__hekatanExtrudeSelection = (e, n, a, o) => {
    var _a3, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1));
    const s = [...Ke], r = t.points.rawVal, f = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), l = /* @__PURE__ */ new Set(), d = [], c = /* @__PURE__ */ new Set();
    for (const x of f) for (const b of x) c.add(b);
    if (s.forEach((x) => {
      if (x.startsWith("poly:")) {
        const b = +x.slice(5);
        if (i.has(b)) return;
        const E = f[b] || [];
        for (let S = 0; S + 1 < E.length; S++) d.push([E[S], E[S + 1]]), c.add(E[S]), c.add(E[S + 1]);
      } else if (x.startsWith("seg:")) {
        const b = x.split(":"), E = +b[1], S = +b[2], A = f[E] || [], R = A[S], te = A[S + 1];
        R != null && te != null && (d.push([R, te]), c.add(R), c.add(te));
      }
    }), s.forEach((x) => {
      if (x.startsWith("pt:")) {
        const b = +x.slice(3);
        r[b] && !c.has(b) && l.add(b);
      }
    }), !l.size && !d.length) return { lineas: 0, areas: 0 };
    St();
    const y = [...r];
    let p = f.slice();
    p.length && p[p.length - 1].length === 0 && (p = p.slice(0, -1));
    const h = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], M = /* @__PURE__ */ new Map(), v = (x, b) => {
      if (b === 0) return x;
      const E = x + ":" + b;
      let S = M.get(E);
      if (S == null) {
        const A = [r[x][0] + e * b, r[x][1] + n * b, r[x][2] + a * b];
        S = y.findIndex((R) => Math.abs(R[0] - A[0]) < 1e-3 && Math.abs(R[1] - A[1]) < 1e-3 && Math.abs(R[2] - A[2]) < 1e-3), S < 0 && (S = y.length, y.push(A)), M.set(E, S);
      }
      return S;
    };
    let m = 0, u = 0;
    l.forEach((x) => {
      const b = [x];
      for (let E = 1; E <= o; E++) b.push(v(x, E));
      p.push(b), m += o;
    }), d.forEach(([x, b]) => {
      for (let E = 1; E <= o; E++) {
        const S = [v(x, E - 1), v(b, E - 1), v(b, E), v(x, E)];
        h.push(p.length), p.push([...S, S[0]]), u++;
      }
    }), p.push([]), t.points.val = y, t.polylines && (t.polylines.val = p), t.areas && (t.areas.val = h);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return z(), { lineas: m, areas: u };
  }, window.__hekatanVoladoSelection = (e, n = {}) => {
    var _a3, _b, _c;
    const a = Number(e);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const o = n.losa !== false, s = n.vigaBorde !== false, r = n.lados === "afuera" ? "afuera" : "ambos", f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = [];
    if ([...Ke].forEach((v) => {
      if (v.startsWith("seg:")) {
        const m = v.split(":"), u = +m[1], x = +m[2], b = i[u] || [], E = b[x], S = b[x + 1];
        E != null && S != null && l.push([E, S]);
      } else if (v.startsWith("poly:")) {
        const m = i[+v.slice(5)] || [];
        for (let u = 0; u + 1 < m.length; u++) l.push([m[u], m[u + 1]]);
      }
    }), !l.length) return 0;
    let d = 0, c = 0;
    for (const v of f) d += v[0], c += v[1];
    d /= Math.max(1, f.length), c /= Math.max(1, f.length), St();
    const y = [...f];
    let p = i.slice();
    p.length && p[p.length - 1].length === 0 && (p = p.slice(0, -1));
    const h = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let M = 0;
    for (const [v, m] of l) {
      const u = f[v], x = f[m];
      if (!u || !x) continue;
      const b = x[0] - u[0], E = x[1] - u[1], S = Math.hypot(b, E);
      if (S < 1e-6) continue;
      let A = -E / S, R = b / S;
      const te = (u[0] + x[0]) / 2, V = (u[1] + x[1]) / 2;
      (te - d) * A + (V - c) * R < 0 && (A = -A, R = -R);
      const N = r === "ambos" ? [1, -1] : [1];
      for (const Q of N) {
        const re = A * a * Q, ve = R * a * Q, Ge = y.length;
        y.push([u[0] + re, u[1] + ve, u[2]]);
        const Ie = y.length;
        y.push([x[0] + re, x[1] + ve, x[2]]), p.push([v, Ge]), p.push([m, Ie]), s && p.push([Ge, Ie]), o && (h.push(p.length), p.push([v, m, Ie, Ge, v])), M++;
      }
    }
    if (!M) return 0;
    p.push([]), t.points.val = y, t.polylines && (t.polylines.val = p), t.areas && (t.areas.val = h);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), M;
  }, $.addEventListener("click", (e) => {
    var _a3, _b, _c;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Rn > 5) {
      Rn = 0;
      return;
    }
    Rn = 0;
    const n = B(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    const a = !!(Rt && Math.abs(e.clientX - Rt.x) <= 3 && Math.abs(e.clientY - Rt.y) <= 3), o = a ? [{ point: Rt.p.clone(), distance: n.position.distanceTo(Rt.p) }] : De();
    if (!o.length) return;
    if (!a) {
      const r = n.position.distanceTo(k.target) || 1, f = o[0].distance ?? n.position.distanceTo(o[0].point), i = o[0].point;
      if (!isFinite(i.x) || !isFinite(i.y) || !isFinite(i.z) || f > Math.max(r * 12, 300)) {
        ce("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let s = o[0].point;
    (e.ctrlKey || e.metaKey) && (s = new F(Math.round(o[0].point.x), Math.round(o[0].point.y), Math.round(o[0].point.z)));
    {
      const r = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], f = r[r.length - 1] ?? [], i = t.points.rawVal ?? [];
      if (f.length > 0) {
        const l = i[f[f.length - 1]];
        if (l) {
          const d = !!window.__hekatanOrthoMode;
          let c = zt;
          if (!c && d) {
            const y = Math.abs(s.x - l[0]), p = Math.abs(s.y - l[1]), h = Math.abs(s.z - l[2]);
            c = y >= p && y >= h ? "x" : p >= h ? "y" : "z";
          }
          c === "x" ? s = new F(s.x, l[1], l[2]) : c === "y" ? s = new F(l[0], s.y, l[2]) : c === "z" && (s = new F(l[0], l[1], s.z));
        }
      }
    }
    if (Rt && Math.abs(e.clientX - Rt.x) <= 3 && Math.abs(e.clientY - Rt.y) <= 3) s = Rt.p.clone();
    else if (Mo) s = Mo.clone(), ce(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
    else {
      const r = aa(s), f = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, s.x, s.y, s.z, r, { x: e.clientX, y: e.clientY });
      if (f) s = new F(f.x, f.y, f.z), ce(`\u{1F3AF} Snap [${f.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        i && l > 0 && (s = new F(Math.round(s.x / l) * l, Math.round(s.y / l) * l, Math.round(s.z / l) * l));
      }
    }
    wa(s, e);
  });
  const di = (e) => {
    var _a3;
    const n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    let a = Math.max(50, 4 * (C || 20));
    if (n.length) {
      let o = 0;
      for (const s of n) o = Math.max(o, Math.abs(s[0]), Math.abs(s[1]), Math.abs(s[2]));
      a = Math.max(a, 2 * o + 4 * (C || 20));
    }
    return Math.abs(e.x) <= a && Math.abs(e.y) <= a && Math.abs(e.z) <= a;
  }, wa = (e, n) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (!(a === "select" || a === "none" || !a || a === "medir" || a === "move" || a === "copy" || a === "delete" || a === "trim" || a === "extend") && !di(e)) {
      ce(`\u2715 Ese punto cae en (${e.x.toFixed(1)}, ${e.y.toFixed(1)}, ${e.z.toFixed(1)}) m, fuera del modelo: el rayo llega al plano de trabajo casi de canto. Ponte en una vista ortogonal (Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`);
      return;
    }
    if (a === "select" || a === "none" || !a) {
      if (xn) {
        Ht && Vo();
        const { kind: i, a: l, b: d } = xn, c = d !== void 0 ? `${i}:${l}:${d}` : `${i}:${l}`;
        !!n && (n.ctrlKey || n.metaKey || n.shiftKey) || Ke.clear(), Ke.has(c) ? Ke.delete(c) : Ke.add(c), nn(), ce(`\u2713 Seleccionados ${Ke.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!n && (n.ctrlKey || n.metaKey || n.shiftKey), l = (n == null ? void 0 : n.clientX) ?? 0, d = (n == null ? void 0 : n.clientY) ?? 0;
        Ht ? (Ha(Ht.x, Ht.y, l, d, i), Ht = null) : i || (Ht = { x: l, y: d }, ce("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), ra(l, d, l + 1, d + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const i = window.__hekatanAxisDraw;
      if (!i) return;
      if (!i.pendingStart) {
        i.pendingStart = [e.x, e.y, e.z], ce(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const l = i.mode === "number", d = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, i.pendingStart, [e.x, e.y, e.z], l);
      ce(`\u2713 Eje "${d}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      is(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "delete") {
      if (Pn >= 0) {
        const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], d = Pn;
        if (d >= 0 && d < l.length) {
          St();
          const c = l.slice(0, d).concat(l.slice(d + 1));
          i && typeof i == "object" && "val" in i ? i.val = c : window.__hekatanDrawingAuxLines = c, ce(`\u{1F5D1} L\xEDnea auxiliar #${d + 1} borrada`), Pn = -1, qt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (dn >= 0) {
        const i = dn, l = Sn;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (Po(i), ce(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (Da(i, l), ce(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : (Po(i), ce(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else ce("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (We.push([e.x, e.y, e.z]), We.length === 1) {
        ce("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, l] = We, d = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), c = Math.abs(l[0] - i[0]), y = Math.abs(l[1] - i[1]), p = Math.abs(l[2] - i[2]), h = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), v = (h === "xy" ? p < 1e-3 : h === "xz" ? y < 1e-3 : h === "yz" ? c < 1e-3 : false) ? h : p < 1e-3 ? "xy" : y < 1e-3 ? "xz" : "yz", m = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], d, m, v), ce(`\u2713 C\xEDrculo dibujado en ${v.toUpperCase()} \u2014 r=${d.toFixed(2)}m, ${m} segmentos`), We = [];
      try {
        (_l2 = window.__hekatanRebuild) == null ? void 0 : _l2.call(window);
      } catch {
      }
      return;
    }
    if (a === "ifcface") {
      if (!H) {
        ce("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!H.plana) {
        ce("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const i = X(H.m), l = oe(i, H.tris);
      if (l.length < 3) {
        ce("\u25A6 No se pudo cerrar el contorno de la cara.");
        return;
      }
      const d = H.normal.clone(), c = W(H.m, H.punto, d);
      let y = String(window.__hekatanIfcCaraPos ?? "auto"), p = false;
      try {
        const E = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        p = Math.round((E == null ? void 0 : E.matShell) ?? 0) === 1;
      } catch {
      }
      y === "auto" && (y = Math.abs(d.z) > 0.5 ? p ? "interior" : "exterior" : "media");
      const h = c ?? 0.2, M = y === "exterior" ? 0 : y === "interior" ? h : h / 2, v = l.map((E) => E.clone().addScaledVector(d, -M));
      St(), at = v.map((E) => [E.x, E.y, E.z]);
      const m = Eo();
      try {
        const E = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        E && c && (E.tShell = Math.round(c * 100) / 100);
      } catch {
      }
      const u = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let x = "la de \xABSecci\xF3n shells\xBB";
      try {
        const E = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        E && E.formaPlaca != null && (x = u[Math.round(E.formaPlaca)] ?? x);
      } catch {
      }
      const b = y === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : y === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + h.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (h / 2).toFixed(2) + " m hacia dentro)";
      ce(`\u25A6 \xC1rea desde la cara del IFC: ${l.length} v\xE9rtices, ${m} shell(s). Espesor medido ${c ? c.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${b}; formulaci\xF3n ${x}, t = ${h.toFixed(2)} m.`), fe(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      z();
      return;
    }
    if (a === "ifcline") {
      if (!ye || ye.length < 2) {
        ce("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = I(ye);
      St();
      const l = t.points.rawVal, d = [], c = [];
      for (const p of i) {
        let h = l.findIndex((M) => Math.abs(M[0] - p[0]) < 1e-3 && Math.abs(M[1] - p[1]) < 1e-3 && Math.abs(M[2] - p[2]) < 1e-3);
        h < 0 && (h = l.length + c.length, c.push(p)), d.push(h);
      }
      if (t.points.val = [...l, ...c], t.polylines) {
        const p = t.polylines.rawVal, h = p.length && p[p.length - 1].length === 0 ? p.slice(0, -1) : p;
        t.polylines.val = [...h, d, []];
      }
      const y = ye.reduce((p, h, M) => M ? p + h.distanceTo(ye[M - 1]) : 0, 0);
      ce(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${y.toFixed(2)} m de desarrollo.`), Z(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      z();
      return;
    }
    if (a === "arc") {
      if (We.push([e.x, e.y, e.z]), We.length === 1) {
        ce("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (We.length === 2) {
        ce("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [i, l, d] = We, c = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, l, d, c), ce(`\u2713 Arco dibujado \u2014 ${c} segmentos`), We = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "parabola" || a === "cubica") {
      const i = a === "parabola" ? 3 : 4, l = a === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (We.push([e.x, e.y, e.z]), We.length < i) {
        ce(`\u223F ${l} \u2014 punto ${We.length}/${i} OK. Marc\xE1 el ${We.length + 1}\xBA.`);
        return;
      }
      const d = window.__hekatanArcSegs ?? 12, c = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, We.slice(), d);
      if (!(c == null ? void 0 : c.ok)) {
        ce(`\u26A0 ${l}: ${(c == null ? void 0 : c.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), We = [];
        return;
      }
      const y = "xyz"[c.ia ?? 0], p = "xyz"[c.io ?? 2], h = (c.coef ?? []).map((M, v) => `${M >= 0 && v ? "+" : ""}${M.toFixed(3)}${v ? "\xB7" + y + (v > 1 ? "^" + v : "") : ""}`).join(" ");
      ce(`\u2713 ${l} dibujada en ${String(c.plano ?? "").toUpperCase()} \u2014 ${d} tramos a \u0394 igual de ${y} \xB7 ${p} = ${h}`), We = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (a === "revolve") {
      const i = Math.round(window.__hekatanRevSectores ?? 16), l = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, i, 360);
      if (l == null ? void 0 : l.msg) {
        ce(`\u26A0 Revoluci\xF3n: ${l.msg}.`);
        return;
      }
      ce(`\u2713 Revoluci\xF3n: ${l.anillos} anillo(s) \xD7 ${i} sectores \u2192 ${l.areas} pa\xF1o(s) Q4${l.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${l.guias ? ` ${l.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (a === "loft") {
      const i = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, e.x, e.y);
      if (i == null ? void 0 : i.msg) {
        ce(`\u26A0 Barrido: ${i.msg}.`);
        return;
      }
      ce(`\u2713 Barrido: contorno de ${i.contorno} lados \xD7 perfil de ${i.perfil} puntos \u2192 ${i.areas} pa\xF1o(s) Q4. Eje por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${i.guias ? ` ${i.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (We.push([e.x, e.y, e.z]), We.length === 1) {
        ce("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = We;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, l), ce(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), We = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const l = (Rt && Math.abs(Rt.x - n.clientX) < 3 && Math.abs(Rt.y - n.clientY) < 3 ? [Rt.p.x, Rt.p.y, Rt.p.z] : null) ?? rt(n);
      if (!l) return;
      if (pt.length >= 2 && (pt = []), pt.push(l), pt.length === 1) it.visible = false, Ft(), ce("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [d, c] = pt;
        it.geometry.setFromPoints([new F(d[0], d[1], d[2]), new F(c[0], c[1], c[2])]), it.visible = true;
        const y = Math.hypot(c[0] - d[0], c[1] - d[1], c[2] - d[2]), p = Math.hypot(c[0] - d[0], c[1] - d[1]);
        et.textContent = `${y.toFixed(3)} m`, Ft(), ce(`\u{1F4CF} Distancia ${y.toFixed(3)} m  \xB7  \u0394x ${(c[0] - d[0]).toFixed(3)}  \u0394y ${(c[1] - d[1]).toFixed(3)}  \u0394z ${(c[2] - d[2]).toFixed(3)}  \xB7  en planta ${p.toFixed(3)} m`);
      }
      z();
      return;
    }
    if (a === "fillarea") {
      const i = t.points.rawVal, l = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], d = /* @__PURE__ */ new Map(), c = (V, N) => {
        V !== N && ((d.get(V) ?? d.set(V, /* @__PURE__ */ new Set()).get(V)).add(N), (d.get(N) ?? d.set(N, /* @__PURE__ */ new Set()).get(N)).add(V));
      };
      for (const V of l) for (let N = 0; N + 1 < V.length; N++) c(V[N], V[N + 1]);
      const y = (V, N) => {
        var _a4;
        return !!((_a4 = d.get(V)) == null ? void 0 : _a4.has(N));
      }, p = /* @__PURE__ */ new Set(), h = [], M = [...d.keys()];
      for (const V of M) for (const N of d.get(V)) if (!(N < V)) {
        for (const Q of d.get(N)) if (Q !== V) for (const re of d.get(Q)) {
          if (re === V || re === N || !y(re, V) || y(V, Q) || y(N, re)) continue;
          const ve = [V, N, Q, re].slice().sort((Ge, Ie) => Ge - Ie).join("-");
          p.has(ve) || (p.add(ve), h.push([V, N, Q, re]));
        }
      }
      for (const V of M) for (const N of d.get(V)) if (!(N < V)) for (const Q of d.get(N)) {
        if (Q === V || !y(Q, V)) continue;
        const re = [V, N, Q].slice().sort((ve, Ge) => ve - Ge).join("-");
        p.has(re) || (p.add(re), h.push([V, N, Q]));
      }
      const v = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", m = (V) => v === "xy" ? [V[0], V[1]] : v === "xz" ? [V[0], V[2]] : [V[1], V[2]], u = m([e.x, e.y, e.z]), x = (V, N) => {
        let Q = false;
        for (let re = 0, ve = N.length - 1; re < N.length; ve = re++) {
          const Ge = N[re][0], Ie = N[re][1], Qe = N[ve][0], Ce = N[ve][1];
          Ie > V[1] != Ce > V[1] && V[0] < (Qe - Ge) * (V[1] - Ie) / (Ce - Ie) + Ge && (Q = !Q);
        }
        return Q;
      }, b = (V) => {
        let N = 0;
        for (let Q = 0, re = V.length - 1; Q < V.length; re = Q++) N += (V[re][0] + V[Q][0]) * (V[re][1] - V[Q][1]);
        return Math.abs(N) / 2;
      };
      let E = null, S = 1 / 0;
      for (const V of h) {
        const N = V.map((re) => m(i[re]));
        if (!x(u, N)) continue;
        const Q = b(N);
        Q < S && (S = Q, E = V);
      }
      if (!E) {
        ce("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const A = E.slice().sort((V, N) => V - N).join("-"), R = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (R.some((V) => {
        const N = l[V] ?? [];
        return [...new Set(N)].sort((Q, re) => Q - re).join("-") === A;
      })) {
        ce("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...l, [...E, E[0]]], t.areas.val = [...R, l.length], ce(`\u2713 \xC1rea creada por relleno (${E.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (We.push([e.x, e.y, e.z]), We.length === 1) {
        ce("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = We;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), ce(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), We = [];
      return;
    }
    if (a === "polyarea") {
      at.push([e.x, e.y, e.z]), Te.geometry.setFromPoints(at.map((i) => new F(i[0], i[1], i[2]))), Te.visible = at.length >= 1, ce(`\u25B0 \xC1rea libre \u2014 ${at.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), z();
      return;
    }
    if (a === "plane3") {
      if (We.push([e.x, e.y, e.z]), We.length < 3) {
        ce(`\u25E3 Plano inclinado \u2014 punto ${We.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [i, l, d] = We, c = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, l, d);
      ce(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), We = [];
      return;
    }
    if (a === "col") {
      St();
      const i = e.z, l = Ct && Ct > 0 ? Ct : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + l]];
      const d = t.polylines.rawVal, c = t.points.rawVal.length;
      t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [c - 2, c - 1], []], Ct = 0, ce(`\u258C Columna creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (We.push([e.x, e.y, e.z]), We.length === 1) {
        ce("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [i, l] = We, d = Ct && Ct > 0 ? Ct : 3;
      St();
      const c = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [l[0], l[1], l[2]], [l[0], l[1], l[2] + d], [i[0], i[1], i[2] + d]];
      const y = t.polylines.rawVal;
      if (y.length - 1, t.polylines.val = [...y.slice(0, -1), ...y[y.length - 1].length > 0 ? [y[y.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], t.areas) {
        const p = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, p];
      }
      ce(`\u25A5 Pared Q4 creada \u2014 h=${d.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), We = [], Ct = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      St();
      const i = Ct && Ct > 0 ? Ct : 3, l = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, l], [e.x, e.y, l + i]];
      const d = t.polylines.rawVal, c = t.points.rawVal.length;
      t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [c - 2, c - 1], []], Ct = 0, ce(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = ea(e.x, e.y, e.z, i);
      if (!l) {
        ce("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const d = t.polylines.rawVal, c = t.points.rawVal, y = d[l.polyIdx], p = c[y[l.segIdx]], h = c[y[l.segIdx + 1]];
      if (!p || !h) {
        ce("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = Ct && Ct > 0 ? Ct : 3;
      St();
      const v = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [p[0], p[1], p[2]], [h[0], h[1], h[2]], [h[0], h[1], h[2] + M], [p[0], p[1], p[2] + M]];
      const m = t.polylines.rawVal;
      if (t.polylines.val = [...m.slice(0, -1), ...m[m.length - 1].length > 0 ? [m[m.length - 1]] : [], [v, v + 1, v + 2, v + 3, v], []], t.areas) {
        const u = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, u];
      }
      Ct = 0, ce(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
      try {
        (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
      } catch {
      }
      return;
    }
    if (a === "auxp") {
      const i = window.__hekatanDrawingAuxPoints;
      if (i) {
        const l = i.rawVal ?? i.val ?? [];
        i.val = [...l, [e.x, e.y, e.z]];
      }
      ce(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (We.push([e.x, e.y, e.z]), We.length === 1) {
        ce("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, l] = We, d = window.__hekatanDrawingAuxLines;
      if (d) {
        St();
        const M = d.rawVal ?? d.val ?? [];
        d.val = [...M, [i[0], i[1], i[2], l[0], l[1], l[2]]];
      }
      const c = l[0] - i[0], y = l[1] - i[1], p = l[2] - i[2], h = Math.sqrt(c * c + y * y + p * p);
      ce(`\u2713 L\xEDnea auxiliar creada \u2014 L=${h.toFixed(2)}m (cyan, no FEM)`), We = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      ci(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "chaflan") {
      if (We.push([e.x, e.y, e.z]), We.length === 1) {
        ce("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = We, d = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, d, c, 6);
      const y = Math.abs(l[0] - i[0]).toFixed(1), p = Math.abs(l[1] - i[1]).toFixed(1);
      ce(`\u2713 Losa con chaflanes dibujada \u2014 ${y}\xD7${p}m, r=${d}m, ${c} seg/chafl\xE1n`), We = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    je = false, St();
    const s = e.toArray(), r = t.points.rawVal;
    let f = r.findIndex((i) => Math.abs(i[0] - s[0]) < 1e-3 && Math.abs(i[1] - s[1]) < 1e-3 && Math.abs(i[2] - s[2]) < 1e-3);
    if (f < 0 && (t.points.val = [...r, s], f = t.points.rawVal.length - 1), t.polylines && a !== "node") {
      const i = t.polylines.rawVal, l = i.length ? i[i.length - 1] : [];
      l.length && l[l.length - 1] === f ? t.polylines.val = [...i, [f]] : t.polylines.val = [...i.slice(0, -1), [...l, f]];
    }
    if (t.polylines) {
      const i = t.polylines.rawVal, l = i.length - 1, d = i[l] ?? [];
      if (a === "line" && d.length >= 2) {
        ce(`\uFF0F L\xEDnea \u2014 ${d.length - 1} tramo${d.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && d.length === 4) {
        t.polylines.val = [...i.slice(0, -1), [...d, d[0]], []], t.areas && (t.areas.val = [...t.areas.rawVal, l]), ce("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") ce(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
    else if (a === "line") ce("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") ce("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const i = ((_R = t.polylines) == null ? void 0 : _R.rawVal[t.polylines.rawVal.length - 1]) ?? [];
      ce(`\u25A6 \xC1rea \u2014 click ${i.length}/4. Marc\xE1 ${4 - i.length} v\xE9rtice${4 - i.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  $.addEventListener("click", () => Jt()), $.addEventListener("contextmenu", (e) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && at.length >= 3) {
      e.preventDefault();
      const a = Eo();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), $.addEventListener("pointermove", (e) => {
    var _a3, _b, _c;
    const n = B(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    const a = De();
    if (He.geometry.deleteAttribute("position"), a.length) {
      let o = a[0].point.clone();
      (e.ctrlKey || e.metaKey) && o.set(Math.round(o.x), Math.round(o.y), Math.round(o.z));
      {
        const f = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = f[f.length - 1] ?? [], l = t.points.rawVal ?? [];
        if (i.length > 0) {
          const d = l[i[i.length - 1]];
          if (d) {
            const c = !!window.__hekatanOrthoMode;
            let y = zt;
            if (!y && c) {
              const p = Math.abs(o.x - d[0]), h = Math.abs(o.y - d[1]), M = Math.abs(o.z - d[2]);
              y = p >= h && p >= M ? "x" : h >= M ? "y" : "z";
            }
            y === "x" ? o.set(o.x, d[1], d[2]) : y === "y" ? o.set(d[0], o.y, d[2]) : y === "z" && o.set(d[0], d[1], o.z);
          }
        }
      }
      const s = aa(o), r = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, o.x, o.y, o.z, s, { x: e.clientX, y: e.clientY });
      if (r) o.set(r.x, r.y, r.z);
      else {
        const f = window.__hekatanSnapEnabled !== false, i = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        f && i > 0 && (o.x = Math.round(o.x / i) * i, o.y = Math.round(o.y / i) * i, o.z = Math.round(o.z / i) * i);
      }
      He.geometry.setAttribute("position", new It(o.toArray(), 3));
    }
    z();
  }), $.addEventListener("pointermove", (e) => {
    var _a3;
    const n = B(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Fe), s = De();
    if (o.length && s.length) {
      const r = new F(...t.points.rawVal[o[0].index]), f = new F(...s[0].point), i = r.sub(f), l = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      l.transformDirection(j.matrixWorld), Math.abs(i.dot(l)) < 1e-4 && (a = true);
    }
    He.visible = !a;
  });
  let ya = false, xa;
  $.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Rn) return;
    const n = B(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Fe), s = De();
    if (o.length && s.length) {
      const f = new F(...t.points.rawVal[o[0].index]), i = new F(...s[0].point), l = f.sub(i), d = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      d.transformDirection(j.matrixWorld), Math.abs(l.dot(d)) < 1e-4 && (a = true);
    }
    if (a && Rn < 5 && (ya = true, k.enabled = false, xa = o[0].index), !ya || Rn % 2 !== 0) return;
    const r = [...t.points.rawVal];
    if (xa !== void 0) {
      let f = s[0].point;
      (e.ctrlKey || e.metaKey) && (f = new F(Math.round(f.x), Math.round(f.y), Math.round(f.z))), r[xa] = f.toArray();
    }
    t.points.val = r;
  }), $.addEventListener("pointerup", () => {
    k.enabled = true, ya = false;
  }), $.addEventListener("contextmenu", (e) => {
    var _a3;
    const n = B(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Fe), s = De();
    if (o.length && s.length) {
      const i = new F(...t.points.rawVal[o[0].index]), l = new F(...s[0].point), d = i.sub(l), c = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      c.transformDirection(j.matrixWorld), Math.abs(d.dot(c)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const r = [...t.points.rawVal];
    if (r.splice(o[0].index, 1), t.points.val = r, !t.polylines) return;
    const f = t.polylines.rawVal.map((i) => i.filter((l) => l !== o[0].index)).map((i) => i.map((l) => l > o[0].index ? l - 1 : l)).filter((i) => i.length);
    f.push([]), t.polylines.val = f;
  });
}
function nl(t, w, g) {
  const C = Math.round(14.999999999999998), P = { position: t.position.clone(), quaternion: t.quaternion.clone() }, $ = setInterval(L, 1e3 / 30);
  let z = 0;
  function L() {
    z++;
    const Y = z / C;
    t.position.lerpVectors(P.position, w.position, Y), t.quaternion.slerpQuaternions(P.quaternion, w.quaternion, Y), g && g(), z == C && clearInterval($);
  }
}
function ol(t, w, g, _) {
  const k = Vi(g, t.elements, _);
  return ue.derive(() => {
    k.visible = w.shellResults.val != "none";
  }), k;
}
const al = 6, za = 10, sl = 0.012;
function il(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function ll(t, w, g, _) {
  if (!g && !_) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && g) {
    const C = g[t];
    if (C && C.has(w)) return C.get(w);
  }
  return null;
}
function rl(t, w, g, _) {
  const k = new ut(), C = new Fs();
  C.setColorMap("rainbow");
  const P = new rn(), $ = ue.state([]);
  return ue.derive(() => {
    var _a2, _b, _c;
    w.deformedShape.val;
    const z = g.val, L = ((_a2 = t.elements) == null ? void 0 : _a2.val) ?? [], Y = il(w.frameResults.val);
    if (k.children.forEach((T) => {
      T.geometry && T.geometry.dispose(), T.material && T.material.dispose();
    }), k.clear(), !Y || L.length === 0 || z.length === 0) {
      $.val = [];
      return;
    }
    const B = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, j = (_c = t.deformOutputs) == null ? void 0 : _c.val, U = [], me = [];
    for (let T = 0; T < L.length; T++) {
      if (L[T].length !== 2) continue;
      const pe = ll(Y, T, B, j);
      pe && (U.push(pe[0], pe[1]), me.push({ idx: T, vals: pe }));
    }
    if (U.length === 0) {
      $.val = [];
      return;
    }
    const O = Math.min(...U), q = Math.max(...U);
    C.setMin(O), C.setMax(q), $.val = U;
    const ae = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const T of z) for (let H = 0; H < 3; H++) ae[H] = Math.min(ae[H], T[H]), se[H] = Math.max(se[H], T[H]);
    const he = Math.max(se[0] - ae[0], se[1] - ae[1], se[2] - ae[2], 1) * sl, we = [], de = [], K = [];
    let Z = 0;
    for (const { idx: T, vals: H } of me) {
      const pe = L[T], fe = z[pe[0]], oe = z[pe[1]];
      if (!fe || !oe) continue;
      const W = new F(oe[0] - fe[0], oe[1] - fe[1], oe[2] - fe[2]), ge = W.length();
      if (ge < 1e-10) continue;
      W.normalize();
      const ee = Math.abs(W.y) < 0.99 ? new F(0, 1, 0) : new F(1, 0, 0), $e = new F().crossVectors(W, ee).normalize(), xe = new F().crossVectors(W, $e).normalize(), be = za + 1, _e = al;
      for (let Be = 0; Be < be; Be++) {
        const Pe = Be / za, nt = fe[0] + W.x * ge * Pe, st = fe[1] + W.y * ge * Pe, Ne = fe[2] + W.z * ge * Pe, D = H[0] + (H[1] - H[0]) * Pe, J = C.getColor(D) ?? new rn(0, 0, 0);
        P.copy(J).convertSRGBToLinear();
        for (let le = 0; le < _e; le++) {
          const ie = le / _e * Math.PI * 2, Me = Math.cos(ie), Se = Math.sin(ie);
          we.push(nt + ($e.x * Me + xe.x * Se) * he, st + ($e.y * Me + xe.y * Se) * he, Ne + ($e.z * Me + xe.z * Se) * he), de.push(P.r, P.g, P.b);
        }
      }
      for (let Be = 0; Be < za; Be++) for (let Pe = 0; Pe < _e; Pe++) {
        const nt = (Pe + 1) % _e, st = Z + Be * _e + Pe, Ne = Z + Be * _e + nt, D = Z + (Be + 1) * _e + Pe, J = Z + (Be + 1) * _e + nt;
        K.push(st, Ne, J), K.push(st, J, D);
      }
      Z += be * _e;
    }
    if (we.length === 0) return;
    const I = new Ee();
    I.setAttribute("position", new It(we, 3)), I.setAttribute("color", new It(de, 3)), I.setIndex(K), I.computeVertexNormals();
    const G = new wt({ vertexColors: true, side: Vt }), X = new ct(I, G);
    X.frustumCulled = false, k.add(X);
  }), k.__colorMapValues = $, k;
}
function cl() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const dl = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, ul = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, pl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function At(t, w = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(w) : t.toFixed(w);
}
const fl = 16755200, Ms = 56831, hl = 56831, ml = 56831, qo = 65382;
function wl(t) {
  const w = new ut();
  w.name = "__hekatan_hover", w.renderOrder = 99;
  const g = new to(1, 16, 16), _ = new wt({ color: fl, transparent: true, opacity: 0.85, depthTest: false }), k = new ct(g, _);
  k.visible = false, k.renderOrder = 100, w.add(k);
  const C = new Ee(), P = new ft({ color: Ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), $ = new jt(C, P);
  $.visible = false, $.renderOrder = 100, w.add($);
  const z = new wt({ color: Ms, transparent: true, opacity: 0.7, depthTest: false }), L = new ct(new ys(1, 1, 1, 12), z);
  L.visible = false, L.renderOrder = 100, w.add(L);
  const Y = new Ee(), B = new wt({ color: hl, transparent: true, opacity: 0.45, side: Vt, depthTest: false }), j = new ct(Y, B);
  j.visible = false, j.renderOrder = 100, w.add(j);
  const U = new Ee(), me = new ft({ color: ml, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), O = new jt(U, me);
  O.visible = false, O.renderOrder = 100, w.add(O);
  const q = new wt({ color: qo, transparent: true, opacity: 0.95, depthTest: false }), ae = new wt({ color: qo, transparent: true, opacity: 0.85, depthTest: false }), se = new ys(1, 1, 1, 12), ye = new wt({ color: qo, transparent: true, opacity: 0.55, side: Vt, depthTest: false }), he = new ft({ color: qo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), we = [];
  window.__hekatanModelSelection = we;
  const de = new ut();
  de.renderOrder = 101, w.add(de);
  let K = null;
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function I(D) {
    const J = t.derivedNodes.rawVal;
    return !J || D < 0 || D >= J.length ? null : new F(J[D][0], J[D][1], J[D][2]);
  }
  function G(D, J) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o, _p, _q, _r, _s2, _t2;
    const le = t.getActiveCamera();
    if (!le || !t.mesh) return null;
    const ie = t.rendererElm.getBoundingClientRect(), Me = D - ie.left, Se = J - ie.top, De = t.derivedNodes.rawVal, Fe = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!De || !Fe) return null;
    const He = /* @__PURE__ */ new Map(), Ze = (Oe) => {
      if (He.has(Oe)) return He.get(Oe);
      const ze = I(Oe);
      if (!ze) return He.set(Oe, null), null;
      const Ve = ze.clone().project(le), qe = (Ve.x * 0.5 + 0.5) * ie.width, Te = (-Ve.y * 0.5 + 0.5) * ie.height, at = { x: qe, y: Te, z: Ve.z };
      return He.set(Oe, at), at;
    }, ke = /* @__PURE__ */ new Set();
    for (const Oe of Fe) if (Oe) for (const ze of Oe) ke.add(ze);
    const Re = 8;
    let Ye = -1, lt = Re;
    for (let Oe = 0; Oe < De.length; Oe++) {
      if (!ke.has(Oe)) continue;
      const ze = Ze(Oe);
      if (!ze || ze.z < -1 || ze.z > 1) continue;
      const Ve = ze.x - Me, qe = ze.y - Se, Te = Math.sqrt(Ve * Ve + qe * qe);
      Te < lt && (lt = Te, Ye = Oe);
    }
    const je = cl(), gt = ul[je.dispUnit] ?? 1e3, yt = dl[je.forceUnit] ?? 1;
    if (Ye >= 0) {
      const Oe = De[Ye];
      let ze = `Nodo ${Ye}
(${Oe[0].toFixed(3)}, ${Oe[1].toFixed(3)}, ${Oe[2].toFixed(3)})`;
      const Ve = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ve == null ? void 0 : Ve.deformations) {
        const qe = Ve.deformations.get(Ye);
        if (qe && (ze += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, ze += `
Ux = ${At(qe[0] * gt, 3)} ${je.dispUnit}`, ze += `
Uy = ${At(qe[1] * gt, 3)} ${je.dispUnit}`, ze += `
Uz = ${At(qe[2] * gt, 3)} ${je.dispUnit}`, (Math.abs(qe[3]) > 1e-9 || Math.abs(qe[4]) > 1e-9 || Math.abs(qe[5]) > 1e-9) && (ze += `
Rx = ${At(qe[3] * 1e3, 3)} mrad`, ze += `
Ry = ${At(qe[4] * 1e3, 3)} mrad`, ze += `
Rz = ${At(qe[5] * 1e3, 3)} mrad`)), Ve.reactions) {
          const Te = Ve.reactions.get(Ye);
          Te && (Math.abs(Te[0]) > 1e-9 || Math.abs(Te[1]) > 1e-9 || Math.abs(Te[2]) > 1e-9 || Math.abs(Te[3]) > 1e-6 || Math.abs(Te[4]) > 1e-6 || Math.abs(Te[5]) > 1e-6) && (ze += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, ze += `
Fx = ${At(Te[0] * yt)} ${je.forceUnit}`, ze += `
Fy = ${At(Te[1] * yt)} ${je.forceUnit}`, ze += `
Fz = ${At(Te[2] * yt)} ${je.forceUnit}`, (Math.abs(Te[3]) > 1e-6 || Math.abs(Te[4]) > 1e-6 || Math.abs(Te[5]) > 1e-6) && (ze += `
Mx = ${At(Te[3] * yt)} ${je.forceUnit}\xB7m`, ze += `
My = ${At(Te[4] * yt)} ${je.forceUnit}\xB7m`, ze += `
Mz = ${At(Te[5] * yt)} ${je.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ye, info: ze };
    }
    const pn = 5;
    let _t = -1, Le = pn, ot = "frame";
    for (let Oe = 0; Oe < Fe.length; Oe++) {
      const ze = Fe[Oe];
      if (!(!ze || ze.length < 2)) {
        if (ze.length === 2) {
          const Ve = Ze(ze[0]), qe = Ze(ze[1]);
          if (!Ve || !qe || Ve.z < -1 || Ve.z > 1 || qe.z < -1 || qe.z > 1) continue;
          const Te = yl(Me, Se, Ve.x, Ve.y, qe.x, qe.y);
          Te < Le && (Le = Te, _t = Oe, ot = "frame");
        } else if (ze.length === 3 || ze.length === 4) {
          const Ve = [];
          let qe = true;
          for (const Te of ze) {
            const at = Ze(Te);
            if (!at || at.z < -1 || at.z > 1) {
              qe = false;
              break;
            }
            Ve.push(at);
          }
          if (!qe) continue;
          if (xl(Me, Se, Ve)) {
            const at = Ve.reduce((it, pt) => it + pt.z, 0) / Ve.length * 1e-3;
            at < Le && (Le = at, _t = Oe, ot = "shell");
          }
        } else if (ze.length === 8) {
          const Ve = [];
          let qe = true;
          for (const et of ze) {
            const rt = Ze(et);
            if (!rt || rt.z < -1 || rt.z > 1) {
              qe = false;
              break;
            }
            Ve.push(rt);
          }
          if (!qe) continue;
          const Te = Math.min(...Ve.map((et) => et.x)), at = Math.max(...Ve.map((et) => et.x)), it = Math.min(...Ve.map((et) => et.y)), pt = Math.max(...Ve.map((et) => et.y));
          if (Me >= Te && Me <= at && Se >= it && Se <= pt) {
            const rt = Ve.reduce((Ft, dt) => Ft + dt.z, 0) / Ve.length * 1e-3;
            rt < Le && (Le = rt, _t = Oe, ot = "solid");
          }
        }
      }
    }
    if (_t >= 0) {
      const Oe = Fe[_t];
      let Ve = `${ot === "frame" ? "Frame" : ot === "shell" ? "Shell" : "Solid"} ${_t}`;
      const qe = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Te = (_g = (_f = qe == null ? void 0 : qe.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, _t);
      if (Te) {
        Te.name && (Ve += `
  \u{1F4CB} ${Te.name}`), Te.shape && (Ve += `
  Shape: ${Te.shape}`);
        const at = /concrete|hormig|rect.*sólida/i.test(Te.shape || ""), it = at ? 100 : 1e3, pt = at ? "cm" : "mm", et = (Ft) => {
          const dt = Ft * it;
          return Math.abs(dt - Math.round(dt)) < 0.05 ? `${Math.round(dt)}` : `${dt.toFixed(1)}`;
        }, rt = [];
        if (Te.D != null && rt.push(`D=${et(Te.D)}`), Te.B != null && rt.push(`B=${et(Te.B)}`), Te.TF != null && rt.push(`TF=${et(Te.TF)}`), Te.TW != null && rt.push(`TW=${et(Te.TW)}`), Te.t != null && rt.push(`t=${et(Te.t)}`), rt.length && (Ve += `
  Dim: ${rt.join(" ")} ${pt}`), Te.material) {
          let Ft = Te.material;
          Te.fillMaterial && (Ft += ` + FILL "${Te.fillMaterial}"`), Ve += `
  Mat: ${Ft}`;
        }
      } else {
        const at = (_i2 = (_h = qe == null ? void 0 : qe.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, _t), it = (_k = (_j = qe == null ? void 0 : qe.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, _t);
        at ? (Ve += `
  ${at}`, it && !at.includes(it) && (Ve += `  (${it})`)) : it && (Ve += `
  Material: ${it}`);
      }
      if (Ve += `
nodos: [${Oe.join(", ")}]`, ot === "shell" && ((_l2 = t.mesh) == null ? void 0 : _l2.analyzeOutputs)) {
        const at = t.mesh.analyzeOutputs.rawVal, it = pl[je.stressUnit] ?? 1, pt = [["bendingXX", "Mxx", yt, `${je.forceUnit}\xB7m/m`], ["bendingYY", "Myy", yt, `${je.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", yt, `${je.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", yt, `${je.forceUnit}/m`], ["membraneYY", "Nyy", yt, `${je.forceUnit}/m`], ["membraneXY", "Nxy", yt, `${je.forceUnit}/m`], ["shearX", "Qx", yt, `${je.forceUnit}/m`], ["shearY", "Qy", yt, `${je.forceUnit}/m`], ["vonMises", "\u03C3VM", it, je.stressUnit], ["pressure", "p", it, je.stressUnit]], et = [];
        for (const [rt, Ft, dt, Kt] of pt) {
          const kt = at == null ? void 0 : at[rt];
          if (kt && kt instanceof Map) {
            const Yt = kt.get(_t);
            if (Yt != null) {
              if (typeof Yt == "number") et.push(`${Ft} = ${At(Yt * dt, 3)} ${Kt}`);
              else if (Array.isArray(Yt)) {
                let en = Yt[0];
                for (const Pt of Yt) Math.abs(Pt) > Math.abs(en) && (en = Pt);
                et.push(`${Ft} = ${At(en * dt, 3)} ${Kt}`);
              }
            }
          }
        }
        et.length > 0 && (Ve += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + et.slice(0, 8).join(`
`));
      }
      if (ot === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
        const at = t.mesh.deformOutputs.rawVal, it = t.mesh.elementInputs.rawVal, pt = at == null ? void 0 : at.deformations;
        if (pt && Oe.length === 2) {
          const et = pt.get(Oe[0]), rt = pt.get(Oe[1]), Ft = ((_n = t.mesh.nodes) == null ? void 0 : _n.rawVal) ?? De, dt = Ft[Oe[0]], Kt = Ft[Oe[1]];
          if (et && rt && dt && Kt) {
            const kt = Kt[0] - dt[0], Yt = Kt[1] - dt[1], en = Kt[2] - dt[2], Pt = Math.sqrt(kt * kt + Yt * Yt + en * en);
            if (Pt > 1e-9) {
              const bo = kt / Pt, Xt = Yt / Pt, Ln = en / Pt, bn = (rt[0] - et[0]) * bo + (rt[1] - et[1]) * Xt + (rt[2] - et[2]) * Ln, fn = ((_o = it.elasticities) == null ? void 0 : _o.get(_t)) ?? 0, Vn = ((_p = it.areas) == null ? void 0 : _p.get(_t)) ?? 0, Un = ((_q = it.momentsOfInertiaY) == null ? void 0 : _q.get(_t)) ?? 0, jo = ((_r = it.momentsOfInertiaZ) == null ? void 0 : _r.get(_t)) ?? 0, Ut = ((_s2 = it.torsionalConstants) == null ? void 0 : _s2.get(_t)) ?? 0, no = ((_t2 = it.shearModuli) == null ? void 0 : _t2.get(_t)) ?? fn / 2.6, In = fn * Vn * (bn / Pt), Zn = (rt[3] - et[3]) * bo + (rt[4] - et[4]) * Xt + (rt[5] - et[5]) * Ln, Tn = no * Ut * (Zn / Pt), hn = rt[4] - et[4], oo = rt[5] - et[5], Zt = fn * Un * hn / Pt, Wt = fn * jo * oo / Pt;
              Ve += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ve += `
L = ${At(Pt, 3)} m`, Ve += `
\u0394L = ${At(bn * gt, 3)} ${je.dispUnit}`, Ve += `
\u03B5 = ${At(bn / Pt, 6)}`, Math.abs(In) > 1e-6 && (Ve += `
N \u2248 ${At(In * yt)} ${je.forceUnit}`), Math.abs(Tn) > 1e-6 && (Ve += `
T \u2248 ${At(Tn * yt)} ${je.forceUnit}\xB7m`), Math.abs(Zt) > 1e-6 && (Ve += `
My \u2248 ${At(Zt * yt)} ${je.forceUnit}\xB7m`), Math.abs(Wt) > 1e-6 && (Ve += `
Mz \u2248 ${At(Wt * yt)} ${je.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: ot, idx: _t, info: Ve };
    }
    return null;
  }
  function X(D, J, le) {
    var _a2, _b, _c;
    if (k.visible = false, $.visible = false, L.visible = false, j.visible = false, O.visible = false, !D || !t.mesh) {
      Z.style.display = "none", t.render();
      return;
    }
    const ie = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (D.type === "node") {
      const Fe = I(D.idx);
      if (Fe) {
        const He = t.derivedNodes.rawVal ?? [];
        let Ze = 1;
        if (He.length >= 2) {
          let Ye = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const je of He) for (let gt = 0; gt < 3; gt++) je[gt] < Ye[gt] && (Ye[gt] = je[gt]), je[gt] > lt[gt] && (lt[gt] = je[gt]);
          Ze = Math.max(lt[0] - Ye[0], lt[1] - Ye[1], lt[2] - Ye[2], 0.1);
        }
        const ke = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Re = 0.021 * Ze * ke;
        k.position.copy(Fe), k.scale.setScalar(Re), k.visible = true;
      }
    } else if (D.type === "frame" && ie) {
      const Fe = ie[D.idx], He = I(Fe[0]), Ze = I(Fe[1]);
      if (He && Ze) {
        const ke = He.clone().add(Ze).multiplyScalar(0.5), Re = Ze.clone().sub(He), Ye = Re.length(), lt = Math.max(1e-4, 3.5 * Be(ke));
        L.position.copy(ke);
        const je = new F(0, 1, 0), gt = je.clone().cross(Re).normalize(), yt = je.angleTo(Re);
        L.quaternion.setFromAxisAngle(gt, yt), L.scale.set(lt, Ye, lt), L.visible = true;
      }
    } else if (D.type === "shell" && ie) {
      const Fe = ie[D.idx], He = [], Ze = [];
      for (const ke of Fe) {
        const Re = I(ke);
        if (!Re) return;
        He.push(Re.x, Re.y, Re.z);
      }
      Fe.length === 4 ? Ze.push(0, 1, 2, 0, 2, 3) : Fe.length === 3 && Ze.push(0, 1, 2), Y.setAttribute("position", new It(He, 3)), Y.setIndex(Ze), Y.computeVertexNormals(), j.visible = true;
    } else if (D.type === "solid" && ie) {
      const Fe = ie[D.idx], He = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ze = [];
      for (const [ke, Re] of He) {
        const Ye = I(Fe[ke]), lt = I(Fe[Re]);
        Ye && lt && Ze.push(Ye.x, Ye.y, Ye.z, lt.x, lt.y, lt.z);
      }
      U.setAttribute("position", new It(Ze, 3)), O.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", t.render();
      return;
    }
    Z.textContent = D.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const Se = t.rendererElm.getBoundingClientRect(), De = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Se;
    Z.style.left = `${J - De.left}px`, Z.style.top = `${le - De.top}px`, t.render();
  }
  let T = "", H = 0, pe = 0;
  const fe = window.__hekatanHoverDebug ?? false, oe = (D) => {
    H && cancelAnimationFrame(H), H = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const J = G(D.clientX, D.clientY);
      if (fe && pe < 5) {
        const ie = t.derivedNodes.rawVal, Me = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${D.clientX}, ${D.clientY}) nodes=${(ie == null ? void 0 : ie.length) ?? 0} elems=${(Me == null ? void 0 : Me.length) ?? 0} hover=`, J), pe++;
      }
      const le = J ? `${J.type}:${J.idx}` : "";
      if (le !== T) T = le, X(J, D.clientX, D.clientY);
      else if (J) {
        const ie = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        Z.style.left = `${D.clientX - ie.left}px`, Z.style.top = `${D.clientY - ie.top}px`;
      }
    });
  };
  let W = null;
  const ge = () => {
    T = "", k.visible = false, $.visible = false, L.visible = false, j.visible = false, O.visible = false, Z.style.display = "none", t.render();
  }, ee = (D) => {
    const J = t.rendererElm.getBoundingClientRect(), le = D.clientX - J.left, ie = D.clientY - J.top;
    (le < -2 || ie < -2 || le > J.width + 2 || ie > J.height + 2) && (W && clearTimeout(W), W = window.setTimeout(ge, 200));
  }, $e = () => {
    W && (clearTimeout(W), W = null);
  };
  t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", ee), t.rendererElm.addEventListener("pointerenter", $e);
  function xe() {
    var _a2, _b, _c;
    const D = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return D === "select" || D === "none" || !D;
  }
  let be = null;
  t.rendererElm.addEventListener("pointerdown", (D) => {
    D.button === 0 && (be = { x: D.clientX, y: D.clientY });
  }), t.rendererElm.addEventListener("pointerup", (D) => {
    if (D.button !== 0 || !be) return;
    const J = D.clientX - be.x, le = D.clientY - be.y;
    if (be = null, J * J + le * le > 9 || !xe()) return;
    const ie = G(D.clientX, D.clientY);
    ie ? (st({ type: ie.type, idx: ie.idx }, D.shiftKey), nt()) : Ne();
  }), window.addEventListener("keydown", (D) => {
    if (D.key !== "Escape" || !we.length) return;
    const J = document.activeElement, le = !!J && (J.id === "hk3-cmd-input" || J.id === "hk-dyn-input") && J.value === "";
    J && (J.tagName === "INPUT" || J.tagName === "TEXTAREA" || J.isContentEditable) && !le || Ne();
  }, { capture: true });
  function _e() {
    for (const D of de.children.slice()) {
      de.remove(D);
      const J = D.geometry;
      J && J !== g && J !== se && J.dispose();
    }
  }
  const Be = (D) => {
    var _a2;
    const J = t.getActiveCamera(), le = ((_a2 = t.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return J.isOrthographicCamera ? (J.top - J.bottom) / (J.zoom || 1) / le : 2 * J.position.distanceTo(D) * Math.tan((J.fov || 50) * Math.PI / 180 / 2) / le;
  };
  function Pe(D, J) {
    var _a2, _b;
    const le = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (D.type === "node") {
      const ie = I(D.idx);
      if (!ie) return;
      const Me = new ct(g, q);
      Me.position.copy(ie), Me.scale.setScalar(Math.max(1e-4, 7 * Be(ie))), Me.renderOrder = 101, de.add(Me);
    } else if (D.type === "frame" && le) {
      const ie = le[D.idx], Me = I(ie[0]), Se = I(ie[1]);
      if (!Me || !Se) return;
      const De = Me.clone().add(Se).multiplyScalar(0.5), Fe = Se.clone().sub(Me), He = Fe.length(), Ze = Math.max(1e-4, 4 * Be(De)), ke = new ct(se, ae);
      ke.position.copy(De);
      const Re = new F(0, 1, 0);
      ke.quaternion.setFromAxisAngle(Re.clone().cross(Fe).normalize(), Re.angleTo(Fe)), ke.scale.set(Ze, He, Ze), ke.renderOrder = 101, de.add(ke);
    } else if (D.type === "shell" && le) {
      const ie = le[D.idx], Me = [], Se = [];
      for (const He of ie) {
        const Ze = I(He);
        if (!Ze) return;
        Me.push(Ze.x, Ze.y, Ze.z);
      }
      ie.length === 4 ? Se.push(0, 1, 2, 0, 2, 3) : ie.length === 3 && Se.push(0, 1, 2);
      const De = new Ee();
      De.setAttribute("position", new It(Me, 3)), De.setIndex(Se), De.computeVertexNormals();
      const Fe = new ct(De, ye);
      Fe.renderOrder = 101, de.add(Fe);
    } else if (D.type === "solid" && le) {
      const ie = le[D.idx], Me = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Se = [];
      for (const [He, Ze] of Me) {
        const ke = I(ie[He]), Re = I(ie[Ze]);
        ke && Re && Se.push(ke.x, ke.y, ke.z, Re.x, Re.y, Re.z);
      }
      const De = new Ee();
      De.setAttribute("position", new It(Se, 3));
      const Fe = new jt(De, he);
      Fe.renderOrder = 101, de.add(Fe);
    }
  }
  function nt() {
    if (_e(), !we.length || !t.mesh) {
      t.render();
      return;
    }
    const D = t.derivedNodes.rawVal ?? [];
    if (D.length >= 2) {
      const J = [1 / 0, 1 / 0, 1 / 0], le = [-1 / 0, -1 / 0, -1 / 0];
      for (const ie of D) for (let Me = 0; Me < 3; Me++) ie[Me] < J[Me] && (J[Me] = ie[Me]), ie[Me] > le[Me] && (le[Me] = ie[Me]);
      Math.max(le[0] - J[0], le[1] - J[1], le[2] - J[2], 0.1);
    }
    for (const J of we) Pe(J);
    t.render();
  }
  function st(D, J) {
    const le = we.findIndex((ie) => ie.type === D.type && ie.idx === D.idx);
    le >= 0 ? we.splice(le, 1) : J || we.push(D), K = we.length ? we[we.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: K } }));
  }
  function Ne() {
    we.length = 0, K = null, nt();
  }
  return ue.derive(() => {
    t.derivedNodes.val, we.length && nt();
  }), w;
}
function yl(t, w, g, _, k, C) {
  const P = k - g, $ = C - _, z = P * P + $ * $;
  if (z < 1e-9) {
    const me = t - g, O = w - _;
    return Math.sqrt(me * me + O * O);
  }
  let L = ((t - g) * P + (w - _) * $) / z;
  L = Math.max(0, Math.min(1, L));
  const Y = g + L * P, B = _ + L * $, j = t - Y, U = w - B;
  return Math.sqrt(j * j + U * U);
}
function xl(t, w, g) {
  let _ = false;
  for (let k = 0, C = g.length - 1; k < g.length; C = k++) {
    const P = g[k].x, $ = g[k].y, z = g[C].x, L = g[C].y;
    $ > w != L > w && t < (z - P) * (w - $) / (L - $ + 1e-12) + P && (_ = !_);
  }
  return _;
}
const ln = (t) => {
  if (!isFinite(t) || t === 0) return "0";
  const w = Math.abs(t);
  return w >= 1e-3 && w < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
};
function vs(t, w) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], k = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[w];
  if (!k || k.length !== 2) throw new Error(`El elemento ${w} no es una barra (2 nudos).`);
  const C = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (ee) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = C[ee]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, w)) ?? 0;
  }, $ = g[k[0]], z = g[k[1]], L = P("elasticities"), Y = P("shearModuli"), B = P("areas"), j = P("momentsOfInertiaZ"), U = P("momentsOfInertiaY"), me = P("torsionalConstants");
  let O = P("shearAreasY"), q = P("shearAreasZ");
  const ae = Math.hypot(z[0] - $[0], z[1] - $[1], z[2] - $[2]), se = O < -1e-15, ye = q < -1e-15;
  !se && O < 1e-15 && B > 1e-15 && Y > 1e-15 && (O = 5 / 6 * B), !ye && q < 1e-15 && B > 1e-15 && Y > 1e-15 && (q = 5 / 6 * B);
  const he = !ye && q > 0 && Y > 0 ? 12 * L * j / (Y * q * ae * ae) : 0, we = !se && O > 0 && Y > 0 ? 12 * L * U / (Y * O * ae * ae) : 0, de = L * B / ae, K = Y * me / ae, Z = 12 * L * j / ae ** 3 / (1 + he), I = 6 * L * j / ae ** 2 / (1 + he), G = 4 * L * j / ae * (1 + he / 4) / (1 + he), X = 2 * L * j / ae * (1 - he / 2) / (1 + he), T = 12 * L * U / ae ** 3 / (1 + we), H = 6 * L * U / ae ** 2 / (1 + we), pe = 4 * L * U / ae * (1 + we / 4) / (1 + we), fe = 2 * L * U / ae * (1 - we / 2) / (1 + we);
  let oe = [[de, 0, 0, 0, 0, 0, -de, 0, 0, 0, 0, 0], [0, Z, 0, 0, 0, I, 0, -Z, 0, 0, 0, I], [0, 0, T, 0, -H, 0, 0, 0, -T, 0, -H, 0], [0, 0, 0, K, 0, 0, 0, 0, 0, -K, 0, 0], [0, 0, -H, 0, pe, 0, 0, 0, H, 0, fe, 0], [0, I, 0, 0, 0, G, 0, -I, 0, 0, 0, X], [-de, 0, 0, 0, 0, 0, de, 0, 0, 0, 0, 0], [0, -Z, 0, 0, 0, -I, 0, Z, 0, 0, 0, -I], [0, 0, -T, 0, H, 0, 0, 0, T, 0, H, 0], [0, 0, 0, -K, 0, 0, 0, 0, 0, K, 0, 0], [0, 0, -H, 0, fe, 0, 0, 0, H, 0, pe, 0], [0, I, 0, 0, 0, X, 0, -I, 0, 0, 0, G]];
  const W = (_e = (_d = C.partialFixitySprings) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, w);
  if (W) for (let ee = 0; ee < Math.min(12, W.length); ee++) W[ee] > 1e-12 && (oe[ee][ee] += W[ee]);
  const ge = (_g = (_f = C.momentReleases) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, w);
  if (ge && ge.some(Boolean)) {
    const ee = ge.length >= 12 ? ge.slice(0, 12).map((Pe, nt) => Pe ? nt : -1).filter((Pe) => Pe >= 0) : ge.slice(0, 6).map((Pe, nt) => Pe ? [3, 4, 5, 9, 10, 11][nt] : -1).filter((Pe) => Pe >= 0), $e = [...Array(12).keys()].filter((Pe) => !ee.includes(Pe)), xe = ee.length, be = ee.map((Pe, nt) => [...ee.map((st) => oe[Pe][st]), ...ee.map((st, Ne) => nt === Ne ? 1 : 0)]);
    for (let Pe = 0; Pe < xe; Pe++) {
      let nt = Pe;
      for (let Ne = Pe + 1; Ne < xe; Ne++) Math.abs(be[Ne][Pe]) > Math.abs(be[nt][Pe]) && (nt = Ne);
      [be[Pe], be[nt]] = [be[nt], be[Pe]];
      const st = be[Pe][Pe];
      for (let Ne = 0; Ne < 2 * xe; Ne++) be[Pe][Ne] /= st;
      for (let Ne = 0; Ne < xe; Ne++) if (Ne !== Pe) {
        const D = be[Ne][Pe];
        for (let J = 0; J < 2 * xe; J++) be[Ne][J] -= D * be[Pe][J];
      }
    }
    const _e2 = be.map((Pe) => Pe.slice(xe)), Be = Array.from({ length: 12 }, () => Array(12).fill(0));
    for (const Pe of $e) for (const nt of $e) {
      let st = 0;
      for (let Ne = 0; Ne < xe; Ne++) for (let D = 0; D < xe; D++) st += oe[Pe][ee[Ne]] * _e2[Ne][D] * oe[ee[D]][nt];
      Be[Pe][nt] = oe[Pe][nt] - st;
    }
    oe = Be;
  }
  return { K: oe, L: ae, phiZ: he, phiY: we };
}
function _s(t, w) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], k = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[w];
  if (!k || k.length !== 2) throw new Error(`El elemento ${w} no es una barra (2 nudos).`);
  const C = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (me, O = 0) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = C[me]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, w)) ?? O;
  }, $ = g[k[0]], z = g[k[1]], L = (_e = (_d = C.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, w), Y = (_g = (_f = C.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, w), B = P("localAngles", 0), j = [], U = (me = "") => j.push(me);
  if (U("% ============================================================"), U(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${w + 1} (indice ${w} del motor)`), U("%  Generado por Hekatan Struct con los datos que recibe el motor."), U("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), U("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), U("% ============================================================"), U(), U("% --- Datos de la barra -------------------------------------------------"), U(`xi = [${$.map(ln).join(" ")}];      % nudo i (${k[0]})`), U(`xj = [${z.map(ln).join(" ")}];      % nudo j (${k[1]})`), U(`E  = ${ln(P("elasticities"))};      % modulo de elasticidad`), U(`G  = ${ln(P("shearModuli"))};      % modulo de cortante`), U(`A  = ${ln(P("areas"))};      % area`), U(`Iz = ${ln(P("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), U(`Iy = ${ln(P("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), U(`J  = ${ln(P("torsionalConstants"))};      % constante de torsion`), U(`AsY = ${ln(P("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), U(`AsZ = ${ln(P("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), B && U(`% ang = ${ln(B)} grados: gira la seccion en T, NO cambia esta matriz local.`), U(), U("L = sqrt(sum((xj - xi).^2));"), U(), U("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), U("bernY = AsY < 0;   bernZ = AsZ < 0;"), U("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), U("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), U("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), U("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), U(), U("EA_L = E*A/L;          % axial"), U("GJ_L = G*J/L;          % torsion"), U("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), U("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), U("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), U("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), U(), U("% --- Matriz local (misma disposicion que el C++) ----------------------"), U("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), U("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), U("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), U("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), U("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), U("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), U("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), U("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), U("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), U("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), U("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), U("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), Y && Y.some((me) => me > 1e-12) && (U(), U("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), U(`kres = [${Y.slice(0, 12).map(ln).join(" ")}];`), U("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), L && L.some(Boolean)) {
    const me = L.length >= 12 ? L.slice(0, 12).map((O, q) => O ? q + 1 : 0).filter(Boolean) : L.slice(0, 6).map((O, q) => O ? [4, 5, 6, 10, 11, 12][q] : 0).filter(Boolean);
    U(), U("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), U(`f = [${me.join(" ")}];              % GDL liberados`), U("r = setdiff(1:12, f);                % GDL que quedan"), U("Kc = zeros(12);"), U("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), U("K = Kc;");
  }
  return U(), U("% --- Resultado ---------------------------------------------------------"), U(`fprintf('Barra ${w + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), U("disp('K local (12x12):');"), U("disp(K);"), { nombre: `K_local_barra_${w + 1}.m`, texto: j.join(`
`) + `
` };
}
const gl = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, bl = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Fn = 1e-3;
function mo(t, w) {
  return w === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : w === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function Ml(t, w) {
  const g = Math.abs(w[0] - t[0]);
  return Math.abs(w[1] - t[1]) < Fn ? { plano: "XZ", en: t[1] } : g < Fn ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function vl(t, w) {
  var _a2, _b;
  let g = null, _ = { plano: "XZ", en: 0 };
  const k = () => {
    var _a3, _b2;
    const K = ((_a3 = w == null ? void 0 : w.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = w == null ? void 0 : w.frameResults) == null ? void 0 : _b2.val);
    return !K || K === "none" ? null : String(K).replace(/^contour:/, "");
  }, C = (K) => {
    var _a3, _b2;
    const Z = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], I = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Set();
    for (const X of I) {
      if (X.length !== 2) continue;
      const T = Z[X[0]], H = Z[X[1]];
      if (!T || !H) continue;
      const pe = mo(T, K), fe = mo(H, K);
      Math.abs(pe.fuera - fe.fuera) < Fn && G.add(Math.round(pe.fuera * 1e3) / 1e3);
    }
    return [...G].sort((X, T) => X - T);
  };
  function P(K) {
    var _a3, _b2;
    if (K == null ? void 0 : K.plano) _ = { plano: K.plano, en: K.en ?? C(K.plano)[0] ?? 0 };
    else {
      const I = [...window.__hekatanModelSelection ?? []].reverse().find((T) => T.type === "frame"), G = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], X = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      I && X[I.idx] && G[X[I.idx][0]] && G[X[I.idx][1]] ? _ = Ml(G[X[I.idx][0]], G[X[I.idx][1]]) : _ = { plano: "XZ", en: C("XZ")[0] ?? 0 };
    }
    g || $(), g.hidden = false, z();
  }
  function $() {
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
      const T = document.createElement("style");
      T.id = "hk-d2-hidden-css", T.textContent = "#hk-diagrama-2d[hidden]{display:none !important;}", document.head.appendChild(T);
    }
    g.querySelector(".hk-d2-x").addEventListener("click", () => {
      g.hidden = true;
    });
    const K = g.querySelector(".hk-d2-plano"), Z = g.querySelector(".hk-d2-en");
    K.addEventListener("change", () => {
      _ = { plano: K.value, en: C(K.value)[0] ?? 0 }, z();
    }), Z.addEventListener("change", () => {
      _.en = Number(Z.value), z();
    });
    const I = (T) => {
      const H = C(_.plano), pe = H.findIndex((oe) => Math.abs(oe - _.en) < Fn), fe = Math.max(0, Math.min(H.length - 1, (pe < 0 ? 0 : pe) + T));
      H.length && (_.en = H[fe], z());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => I(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => I(1));
    const G = g.querySelector(".hk-d2-bar");
    let X = null;
    G.addEventListener("pointerdown", (T) => {
      if (T.target.closest("select,button")) return;
      const H = g.getBoundingClientRect();
      X = { x: T.clientX, y: T.clientY, l: H.left, t: H.top }, g.style.transform = "none", g.style.left = H.left + "px", g.style.top = H.top + "px";
    }), window.addEventListener("pointermove", (T) => {
      !X || !g || (g.style.left = X.l + T.clientX - X.x + "px", g.style.top = X.t + T.clientY - X.y + "px");
    }), window.addEventListener("pointerup", () => {
      X = null;
    }), new ResizeObserver(() => {
      g && !g.hidden && z();
    }).observe(g);
  }
  function z() {
    var _a3, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const K = new Set(B && !B.hidden && j >= 0 ? me(j) : []), Z = g.querySelector(".hk-d2-svg"), I = g.querySelector(".hk-d2-tit"), G = g.querySelector(".hk-d2-pie"), X = g.querySelector(".hk-d2-plano"), T = g.querySelector(".hk-d2-en");
    X.value = _.plano;
    const H = C(_.plano), pe = _.plano === "XZ" ? "y" : _.plano === "YZ" ? "x" : "z", fe = _.plano === "XY" ? "Planta" : "P\xF3rtico";
    T.innerHTML = H.map((Le, ot) => `<option value="${Le}" ${Math.abs(Le - _.en) < Fn ? "selected" : ""}>${fe} ${ot + 1} \xB7 ${pe} = ${Le.toFixed(2)} m</option>`).join("");
    const oe = k(), W = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], ge = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], ee = oe ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[oe] : null;
    Z.innerHTML = "";
    const $e = Z.clientWidth || 880, xe = Z.clientHeight || 480, be = [];
    if (ge.forEach((Le, ot) => {
      if (Le.length !== 2) return;
      const Oe = W[Le[0]], ze = W[Le[1]];
      if (!Oe || !ze) return;
      const Ve = mo(Oe, _.plano), qe = mo(ze, _.plano);
      Math.abs(Ve.fuera - _.en) < Fn && Math.abs(qe.fuera - _.en) < Fn && be.push({ i: ot, a: Ve, b: qe });
    }), !be.length) {
      G.textContent = "No hay barras en este plano.", I.textContent = "";
      return;
    }
    let _e = 1 / 0, Be = -1 / 0, Pe = 1 / 0, nt = -1 / 0;
    for (const Le of be) for (const ot of [Le.a, Le.b]) _e = Math.min(_e, ot.u), Be = Math.max(Be, ot.u), Pe = Math.min(Pe, ot.v), nt = Math.max(nt, ot.v);
    const st = Be - _e || 1, Ne = nt - Pe || 1, D = 0.12 * Math.max(st, Ne), J = 46, le = Math.min(($e - 2 * J) / (st + 2 * D), (xe - 2 * J) / (Ne + 2 * D)), ie = ($e - st * le) / 2, Me = (xe - Ne * le) / 2, Se = (Le) => ie + (Le - _e) * le, De = (Le) => xe - (Me + (Le - Pe) * le), Fe = "http://www.w3.org/2000/svg", He = (Le, ot, Oe) => {
      const ze = document.createElementNS(Fe, Le);
      for (const Ve in ot) ze.setAttribute(Ve, String(ot[Ve]));
      return Oe != null && (ze.textContent = Oe), Z.appendChild(ze), ze;
    }, Ze = /* @__PURE__ */ new Map();
    for (const Le of be) {
      const ot = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Le.i)) ?? 0, Oe = mo(Ts(oe ?? "normals", Is(W[ge[Le.i][0]], W[ge[Le.i][1]], ot)), _.plano), ze = Math.hypot(Oe.u, Oe.v);
      Ze.set(Le.i, ze > 0.3 ? [Oe.u / ze, -Oe.v / ze] : null);
    }
    const ke = be.filter((Le) => !Ze.get(Le.i)).length;
    let Re = 0;
    if (ee) for (const Le of be) {
      if (!Ze.get(Le.i)) continue;
      const ot = ee instanceof Map ? ee.get(Le.i) : ee[Le.i];
      ot && (Re = Math.max(Re, Math.abs(ot[0] ?? 0), Math.abs(ot[1] ?? 0)));
    }
    const Ye = 0.12 * Math.max(st, Ne) * le, lt = Re > 0 ? Ye / Re : 0, je = oe === "bendingsY" || oe === "bendingsZ", gt = (Le) => Math.abs(Le) >= 100 ? Le.toFixed(1) : Math.abs(Le) >= 10 ? Le.toFixed(2) : Le.toFixed(3), yt = [];
    for (const Le of be) {
      const ot = Se(Le.a.u), Oe = De(Le.a.v), ze = Se(Le.b.u), Ve = De(Le.b.v), qe = Ze.get(Le.i), [Te, at] = qe ?? [0, 0], it = ee && qe ? ee instanceof Map ? ee.get(Le.i) : ee[Le.i] : null, [pt, et] = it ? Aa(oe, it) : [0, 0];
      if (it && lt > 0) {
        const Kt = [ot + Te * pt * lt * 1, Oe + at * pt * lt * 1], kt = [ze + Te * et * lt * 1, Ve + at * et * lt * 1], Pt = pt + et >= 0 ? "#3fa7d6" : "#d9534f";
        He("polygon", { points: `${ot},${Oe} ${Kt[0]},${Kt[1]} ${kt[0]},${kt[1]} ${ze},${Ve}`, fill: Pt, "fill-opacity": 0.38, stroke: Pt, "stroke-width": 1.2 }), yt.push({ x: Kt[0] + Te * 12, y: Kt[1] + at * 12, t: gt(pt), peso: Math.abs(pt) }), yt.push({ x: kt[0] + Te * 12, y: kt[1] + at * 12, t: gt(et), peso: Math.abs(et) });
      }
      He("line", { x1: ot, y1: Oe, x2: ze, y2: Ve, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), K.has(Le.i) && He("line", { x1: ot, y1: Oe, x2: ze, y2: Ve, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const rt = He("line", { x1: ot, y1: Oe, x2: ze, y2: Ve, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      rt.addEventListener("click", () => O(Le.i));
      const Ft = document.createElementNS(Fe, "title");
      Ft.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", rt.appendChild(Ft);
    }
    for (const Le of be) for (const ot of [Le.a, Le.b]) _.plano !== "XY" && Math.abs(ot.v - Pe) < Fn && He("rect", { x: Se(ot.u) - 6, y: De(ot.v), width: 12, height: 7, fill: "#b03a3a" });
    const pn = [];
    yt.sort((Le, ot) => ot.peso - Le.peso);
    for (const Le of yt) Le.peso < 0.02 * Re || pn.some((ot) => Math.hypot(ot.x - Le.x, ot.y - Le.y) < 34) || (pn.push(Le), He("text", { x: Le.x, y: Le.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Le.t));
    const _t = oe ? gl[oe] ?? oe : "sin resultado";
    I.textContent = `${_t} \xB7 ${_.plano === "XY" ? "planta" : "alzado"} ${_.plano} en ${pe} = ${_.en.toFixed(2)} m`, G.textContent = oe ? `${be.length} barras en el plano \xB7 m\xE1ximo ${gt(Re)} ${bl[oe] ?? ""}` + (je ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ke ? ` \xB7 ${ke} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const L = () => {
    try {
      z();
    } catch {
    }
  };
  (w == null ? void 0 : w.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    w.frameResults.val, L();
  }));
  let Y = null;
  setInterval(() => {
    var _a3, _b2;
    const K = (_a3 = t.analyzeOutputs) == null ? void 0 : _a3.rawVal, Z = (_b2 = w == null ? void 0 : w.frameResults) == null ? void 0 : _b2.rawVal, I = [K, Z];
    if (!(Y && Y[0] === K && Y[1] === Z)) {
      Y = I, L();
      try {
        ae();
      } catch {
      }
    }
  }, 400);
  let B = null, j = -1, U = "12";
  function me(K) {
    var _a3, _b2;
    const Z = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], I = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Map();
    I.forEach((pe, fe) => {
      if (pe.length === 2) for (const oe of pe) G.has(oe) || G.set(oe, []), G.get(oe).push(fe);
    });
    const X = (pe) => {
      const fe = Z[I[pe][0]], oe = Z[I[pe][1]], W = [oe[0] - fe[0], oe[1] - fe[1], oe[2] - fe[2]], ge = Math.hypot(W[0], W[1], W[2]) || 1;
      return W.map((ee) => ee / ge);
    }, T = (pe, fe) => {
      const oe = X(pe), W = X(fe);
      return Math.abs(oe[0] * W[0] + oe[1] * W[1] + oe[2] * W[2]) > 0.9999;
    }, H = [K];
    for (const pe of [0, 1]) {
      let fe = K, oe = I[K][pe];
      for (let W = 0; W < 500; W++) {
        const ge = (G.get(oe) ?? []).filter(($e) => $e !== fe);
        if (ge.length !== 1 || !T(fe, ge[0])) break;
        const ee = ge[0];
        pe === 0 ? H.unshift(ee) : H.push(ee), oe = I[ee][0] === oe ? I[ee][1] : I[ee][0], fe = ee;
      }
    }
    return H;
  }
  function O(K) {
    if (K == null) {
      const I = [...window.__hekatanModelSelection ?? []].reverse().find((G) => G.type === "frame");
      if (!I) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      K = I.idx;
    }
    j = K, B || (B = document.createElement("div"), B.id = "hk-diagrama-barra", B.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), B.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-k" title="Descarga un script MATLAB (Hekatan Lab / Octave) con la matriz de rigidez local 12\xD712 de esta barra" style="background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px;white-space:nowrap">\u{1F4C4} K local .m</button><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(B), B.querySelector(".hk-b-x").addEventListener("click", () => {
      B.hidden = true, q(), z();
    }), B.querySelector(".hk-b-k").addEventListener("click", () => {
      j >= 0 && se(j);
    }), B.querySelector(".hk-b-pl").addEventListener("change", (Z) => {
      U = Z.target.value, ae();
    })), B.hidden = false, q(), ae(), z();
  }
  function q() {
    if (!g || !B) return;
    const K = window.innerWidth, Z = Math.min(560, Math.round(K * 0.4));
    B.style.width = Z + "px", !B.hidden && !g.hidden ? (g.style.transform = "none", g.style.left = "12px", g.style.width = K - Z - 36 + "px", B.style.top = g.getBoundingClientRect().top + "px") : g.hidden || (g.style.left = "50%", g.style.transform = "translateX(-50%)", g.style.width = "min(900px,92vw)");
  }
  function ae() {
    var _a3, _b2, _c;
    if (!B || B.hidden || j < 0) return;
    const K = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], Z = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], I = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!Z[j]) return;
    const G = me(j), X = [];
    let T = 0, H = -1;
    G.forEach((Be, Pe) => {
      const [nt, st] = Z[Be], Ne = Pe === 0 ? G.length > 1 && Z[G[1]].includes(nt) : nt !== H, D = Ne ? st : nt, J = Ne ? nt : st, le = Math.hypot(K[J][0] - K[D][0], K[J][1] - K[D][1], K[J][2] - K[D][2]);
      X.push({ x: T, e: Be, fin: Ne ? 1 : 0 }), T += le, X.push({ x: T, e: Be, fin: Ne ? 0 : 1 }), H = J;
    });
    const pe = T, fe = (Be, Pe) => {
      const nt = I[Be], st = nt ? nt instanceof Map ? nt.get(Pe.e) : nt[Pe.e] : null;
      return st ? Aa(Be, st)[Pe.fin] : 0;
    }, oe = K[Z[G[0]][0]], W = (Be) => Be.toFixed(2);
    B.querySelector(".hk-b-tit").textContent = "L = " + pe.toFixed(2) + " m \xB7 " + G.length + " tramo(s) \xB7 desde (" + W(oe[0]) + ", " + W(oe[1]) + ", " + W(oe[2]) + ")";
    const ge = U === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], ee = B.querySelector(".hk-b-cuerpo");
    ee.innerHTML = "";
    const $e = Math.max(300, ee.clientWidth), xe = 124, be = 46, _e = (xe - 14) / 2;
    for (const [Be, Pe, nt, st] of ge) {
      const Ne = X.map((Re) => fe(Be, Re)), D = Math.max(...Ne), J = Math.min(...Ne), le = Math.max(Math.abs(D), Math.abs(J)) || 1, ie = (Re) => be + Re / (pe || 1) * ($e - 2 * be), Me = (Re) => _e + (st ? 1 : -1) * (Re / le) * (_e - 16), Se = (Re) => Math.abs(Re) >= 100 ? Re.toFixed(1) : Math.abs(Re) >= 10 ? Re.toFixed(2) : Re.toFixed(3);
      let De = ie(0) + "," + _e + " ";
      X.forEach((Re, Ye) => {
        De += ie(Re.x) + "," + Me(Ne[Ye]) + " ";
      }), De += ie(pe) + "," + _e;
      const Fe = Ne.indexOf(D), He = Ne.indexOf(J), Ze = (Re, Ye) => {
        const lt = Me(Ne[Re]) + (Me(Ne[Re]) < _e ? -5 : 13);
        return '<text x="' + ie(X[Re].x) + '" y="' + lt + '" text-anchor="middle" fill="' + Ye + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Se(Ne[Re]) + "</text>";
      }, ke = st ? "#d9534f" : "#3fa7d6";
      ee.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Pe + ' <span style="color:#6f7d90;font-weight:400">(' + nt + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Se(D) + " \xB7 m\xEDn " + Se(J) + (st ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + $e + '" height="' + xe + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + be + '" y1="' + _e + '" x2="' + ($e - be) + '" y2="' + _e + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + De + '" fill="' + ke + '" fill-opacity=".35" stroke="' + ke + '" stroke-width="1.4"/>' + Ze(0, "#f2f5fa") + Ze(X.length - 1, "#f2f5fa") + (Fe > 0 && Fe < X.length - 1 ? Ze(Fe, "#8fd3ff") : "") + (He > 0 && He < X.length - 1 && He !== Fe ? Ze(He, "#ff9f9a") : "") + '<text x="' + be + '" y="' + (xe - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + ($e - be) + '" y="' + (xe - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + pe.toFixed(2) + " m</text></svg>");
    }
  }
  window.__hekatanDiagramaBarra = O;
  function se(K) {
    const { nombre: Z, texto: I } = _s(t, K), G = URL.createObjectURL(new Blob([I], { type: "text/plain" })), X = document.createElement("a");
    X.href = G, X.download = Z, document.body.appendChild(X), X.click(), setTimeout(() => {
      URL.revokeObjectURL(G), X.remove();
    }, 1e3);
  }
  window.__hekatanKLocalMatlab = (K, Z = false) => {
    if (K == null) {
      const G = [...window.__hekatanModelSelection ?? []].reverse().find((X) => X.type === "frame");
      if (!G) return null;
      K = G.idx;
    }
    return Z && se(K), _s(t, K);
  };
  let ye = null, he = null, we = -1;
  function de(K) {
    var _a3, _b2, _c, _d, _e;
    if (we = K, !he) {
      he = document.createElement("div"), he.id = "hk-klocal", he.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(he);
      const oe = document.createElement("style");
      oe.textContent = "#hk-klocal[hidden]{display:none!important}", document.head.appendChild(oe);
    }
    let Z;
    try {
      Z = vs(t, K);
    } catch (oe) {
      alert(String(oe));
      return;
    }
    const I = (oe) => Math.abs(oe) < 1e-12 ? "0" : Math.abs(oe) >= 1e5 || Math.abs(oe) < 0.01 ? oe.toExponential(4) : oe.toPrecision(6), G = ((_a3 = t.elementInputs) == null ? void 0 : _a3.rawVal) ?? {}, X = (_c = (_b2 = G.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, K), T = (_e = (_d = G.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, K), H = [X && (X[0] > 1e-12 || X[1] > 1e-12) ? `brazos r\xEDgidos ${X[0]}\xB7L / ${X[1]}\xB7L (se aplican en K global: R\u1D40\xB7K\xB7R)` : "", T ? `ang ${T}\xB0 (gira T, no esta K)` : ""].filter(Boolean).join(" \xB7 "), pe = ["u1 i", "u2 i", "u3 i", "\u03B81 i", "\u03B82 i", "\u03B83 i", "u1 j", "u2 j", "u3 j", "\u03B81 j", "\u03B82 j", "\u03B83 j"], fe = Z.K.map((oe, W) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${pe[W]}</th>` + oe.map((ge) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(ge) < 1e-12 ? "#4a5568" : ge < 0 ? "#ff9f9a" : "#e6edf5"}">${I(ge)}</td>`).join("") + "</tr>").join("");
    he.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${K + 1}</b><span style="color:#9fb0c6">L = ${Z.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${Z.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${Z.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${H ? ` \xB7 <b style="color:#f59e0b">${H}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${pe.map((oe) => `<th style="color:#9fb0c6;padding:2px 6px">${oe}</th>`).join("")}</tr>${fe}</table></div>`, he.querySelector(".hk-k-x").addEventListener("click", () => {
      he.hidden = true;
    }), he.querySelector(".hk-k-m").addEventListener("click", () => se(we)), he.hidden = false;
  }
  return window.addEventListener("hk:model-selection", (K) => {
    var _a3;
    const Z = (_a3 = K.detail) == null ? void 0 : _a3.ultimo;
    ye || (ye = document.createElement("button"), ye.id = "hk-klocal-chip", ye.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(ye), ye.addEventListener("click", () => {
      const I = Number(ye.dataset.idx);
      I >= 0 && de(I);
    })), ye.hidden = true, Z && Z.type === "frame" && (ye.dataset.idx = String(Z.idx), ye.textContent = "\u{1F4D0} Ver K local \xB7 barra " + (Z.idx + 1), he && (he.hidden = true), ye.hidden = false);
  }), window.__hekatanKLocal = (K) => vs(t, K), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = P, { abrir: P, abrirBarra: O };
}
function ks(t, w = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(w)), setTimeout(() => {
    ue.derive(() => {
      Qo.val, g.style.background = Li();
    });
  });
  const _ = document.createElement("div");
  _.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(_), setTimeout(() => {
    ue.derive(() => {
      _.textContent = Ea.val ? `[${Ea.val}]` : "";
    });
  });
  const k = Array.from({ length: w + 1 }, (z, L) => L / w).reverse();
  let C, P;
  k.forEach((z, L) => {
    C = document.createElement("div"), C.id = `marker-${L}`, C.className = "marker", C.style.marginTop = L == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", P = document.createElement("p"), P.id = `marker-text-${L}`, C.append(P), g.append(C);
  });
  const $ = [];
  return g.querySelectorAll("p").forEach((z) => $.push(z)), setTimeout(() => {
    ue.derive(() => {
      k.forEach((z, L) => {
        const Y = $[L];
        Y && (Y.innerText = _l(t.val, z).toString());
      });
    });
  }), g;
}
function _l(t, w) {
  const g = go.val;
  if (g) return Ss(g[0] + w * (g[1] - g[0]));
  const _ = t.filter((P) => Number.isFinite(P));
  if (_.length === 0) return "0";
  const [k, C] = Fa(_);
  return Ss(k + w * (C - k));
}
function Ss(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const w = Math.abs(t);
  return w < 1e-3 || w >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function Il({ mesh: t, settingsObj: w, drawingObj: g, objects3D: _, solids: k }) {
  Ei.DEFAULT_UP = new F(0, 0, 1);
  const C = document.createElement("div"), P = new Pi(), $ = new zi(45, 1, 0.1, 2 * 1e6), z = new Ci(-10, 10, 10, -10, -1e3, 2e6);
  let L = $;
  const Y = new Ai({ antialias: true });
  Y.localClippingEnabled = true;
  const B = new xs($, Y.domElement);
  B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.keyPanSpeed = 12, B.listenToKeyEvents(window), B.touches = { ONE: Uo.ROTATE, TWO: Uo.DOLLY_PAN }, Y.domElement.addEventListener("wheel", (D) => {
    if (!D.ctrlKey && Math.abs(D.deltaX) > Math.abs(D.deltaY) * 1.5) {
      D.preventDefault();
      const J = B.target, le = new F().subVectors($.position, J), ie = new F();
      ie.crossVectors($.up, le).normalize();
      const Se = le.length() * 1e-3 * B.panSpeed;
      J.addScaledVector(ie, D.deltaX * Se), $.position.addScaledVector(ie, D.deltaX * Se), B.update();
    }
  }, { passive: false });
  const j = new yo(new F(-1, 0, 0), 0), U = new yo(new F(0, -1, 0), 0), me = new yo(new F(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function O() {
    const D = window.__hekatanClip, J = [];
    D.enableX && (j.normal.set(D.invertX ? 1 : -1, 0, 0), j.constant = D.invertX ? -D.posX : D.posX, J.push(j)), D.enableY && (U.normal.set(0, D.invertY ? 1 : -1, 0), U.constant = D.invertY ? -D.posY : D.posY, J.push(U)), D.enableZ && (me.normal.set(0, 0, D.invertZ ? 1 : -1), me.constant = D.invertZ ? -D.posZ : D.posZ, J.push(me)), Y.clippingPlanes = J, P.traverse((ie) => {
      const Me = ie;
      if (Me.material) {
        const Se = Array.isArray(Me.material) ? Me.material : [Me.material];
        for (const De of Se) De.clippingPlanes = J, De.needsUpdate = true;
      }
    });
    const le = window.__hekatanPanes ?? [];
    for (const ie of le) try {
      ie && typeof ie.refresh == "function" && ie.refresh();
    } catch {
    }
    Y.render(P, L);
  }
  O(), window.__hekatanClipApply = O;
  const q = Ti(w), ae = ue.derive(() => Math.pow(10, q.displayScale.val / 10)), se = kl(t, q), ye = () => {
    const D = [];
    return q.gridXY.rawVal && D.push("xy"), q.gridXZ.rawVal && D.push("xz"), q.gridYZ.rawVal && D.push("yz"), D;
  }, he = () => {
    const D = q.gridStep.rawVal, J = Math.max(D, q.gridMajor.rawVal);
    return { planes: ye(), majorStep: J, minorStep: D };
  };
  let we = Sa(q.gridSize.rawVal, he());
  we.visible = q.gridVisible.rawVal, window.__hekatanSnap2D = q.cursorSnap.rawVal;
  const de = () => {
    const D = Math.max(0, Math.min(1, q.gridOpacity.rawVal));
    we.traverse((J) => {
      const le = J.material;
      if (!le || !("opacity" in le)) return;
      const ie = J.name ?? "";
      let Me = 0.55;
      ie.includes("border") ? Me = 1 : ie.includes("major") && (Me = 0.95), le.opacity = D * Me;
    });
  };
  de(), C.appendChild(Ii(q, t, k)), C.setAttribute("id", "viewer"), C.appendChild(Y.domElement), Y.setPixelRatio(window.devicePixelRatio);
  const K = Xn();
  Y.setClearColor(K.background, 1);
  const Z = q.gridSize.rawVal, I = Z * 0.5 + Z * 0.5 / Math.tan(45 * 0.5);
  $.position.set(0, 0, I), $.up.set(0, 1, 0), B.target.set(0, 0, 0), B.minDistance = 0.1, B.maxDistance = 1e4, C.__settings = q, B.zoomSpeed = 1, B._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, B.update();
  let G = bs(q.gridSize.rawVal, q.flipAxes.rawVal);
  P.add(we, G), ue.derive(() => {
    window.__hekatanGridPlaneXY = q.gridXY.val, window.__hekatanGridPlaneXZ = q.gridXZ.val, window.__hekatanGridPlaneYZ = q.gridYZ.val;
  });
  let X = true;
  ue.derive(() => {
    const D = q.gridVisible.val;
    if (X) {
      X = false;
      return;
    }
    we.visible = D, ee();
  });
  let T = true;
  ue.derive(() => {
    if (q.gridOpacity.val, T) {
      T = false;
      return;
    }
    de(), ee();
  }), ue.derive(() => {
    const D = q.cursorSnap.val;
    window.__hekatanSnap2D = D;
  });
  let H = true;
  ue.derive(() => {
    var _a2, _b, _c;
    const D = q.gridSize.val, J = q.flipAxes.val;
    if (q.gridXY.val, q.gridXZ.val, q.gridYZ.val, q.gridStep.val, q.gridMajor.val, H) {
      H = false;
      return;
    }
    P.remove(we), (_a2 = we.traverse) == null ? void 0 : _a2.call(we, (Se) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Se.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), we = Sa(D, he()), we.visible = q.gridVisible.rawVal, P.add(we), de(), P.remove(G), G.traverse((Se) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Se.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), G = bs(D, J), P.add(G);
    const le = D * 0.5 + D * 0.5 / Math.tan(45 * 0.5);
    $.position.distanceTo(B.target);
    const ie = Math.abs($.position.x) < 0.1 && Math.abs($.position.y) < 0.1 && $.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ie ? $.position.set(0, 0, le) : $.position.set(0.5 * D, -le, 0.5 * D), B.target.set(0, 0, 0)), B.minDistance = Math.max(0.05, D * 0.01), B.maxDistance = Math.max(50, D * 50), B.update(), ee();
  }), new ResizeObserver((D) => {
    var _a2, _b;
    for (const J of D) {
      const le = (_a2 = J.target) == null ? void 0 : _a2.clientWidth, ie = (_b = J.target) == null ? void 0 : _b.clientHeight;
      if (le === 0 || ie === 0) continue;
      const Se = (fe ? le / 2 : le) / ie;
      $.aspect = Se, $.updateProjectionMatrix();
      const De = z.top;
      if (z.left = -De * Se, z.right = De * Se, z.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = Se, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Fe = oe, He = Fe.top;
        Fe.left = -He * Se, Fe.right = He * Se, Fe.updateProjectionMatrix();
      }
      Y.setSize(le, ie), ee();
    }
  }).observe(C), B.addEventListener("change", ee), ue.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2;
    (_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e2 = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e2.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, q.displayScale.val, q.nodes.val, q.elements.val, (_g = q.edges) == null ? void 0 : _g.val, q.elemColumns.val, q.elemBeams.val, q.nodesIndexes.val, q.elementsIndexes.val, q.orientations.val, q.sections.val, q.secColumns.val, q.secBeams.val, q.secFloor.val, q.supports.val, q.loads.val, q.deformedShape.val, q.nodeResults.val, q.frameResults.val, q.shellResults.val, (_h = q.solidResults) == null ? void 0 : _h.val, (_i2 = q.extruded) == null ? void 0 : _i2.val, setTimeout(ee);
  });
  let fe = false, oe = null, W = null, ge = false;
  function ee() {
    const D = C.clientWidth || 1, J = C.clientHeight || 1;
    if (!fe || !oe) {
      Y.setScissorTest(false), Y.setViewport(0, 0, D, J), Y.render(P, L);
      return;
    }
    const le = D / 2;
    Y.setScissorTest(true), Y.setViewport(0, 0, le, J), Y.setScissor(0, 0, le, J), Y.render(P, L), Y.setViewport(le, 0, le, J), Y.setScissor(le, 0, le, J), Y.render(P, oe), Y.setScissorTest(false);
  }
  function $e(D) {
    L = D, B.object = D, B.update(), ee();
  }
  function xe(D, J) {
    fe = D, J && (oe = J);
    const le = C.clientWidth || 1, ie = C.clientHeight || 1, Se = (D ? le / 2 : le) / ie;
    $.isPerspectiveCamera && ($.aspect = Se, $.updateProjectionMatrix());
    const De = z.top;
    if (z.left = -De * Se, z.right = De * Se, z.updateProjectionMatrix(), D && oe) {
      if (W ? (W.object = oe, W.update()) : (W = new xs(oe, Y.domElement), W.enableDamping = true, W.dampingFactor = 0.1, W.screenSpacePanning = true, W.zoomSpeed = 0.8, W.panSpeed = 1.2, W.rotateSpeed = 0.9, W.touches = { ONE: Uo.ROTATE, TWO: Uo.DOLLY_PAN }, W.target.copy(B.target), W.addEventListener("change", ee), W.enabled = false), !ge) {
        const Fe = (He) => {
          if (!fe || !W) return;
          const Ze = Y.domElement.getBoundingClientRect(), ke = He.clientX - Ze.left, Re = Ze.width / 2, Ye = ke >= Re;
          B.enabled = !Ye, W.enabled = Ye;
        };
        Y.domElement.addEventListener("pointerdown", Fe, true), Y.domElement.addEventListener("wheel", Fe, { capture: true, passive: true }), ge = true;
      }
    } else D || (B.enabled = true, W && (W.enabled = false));
    C.__splitMode = D, window.__hekatanSplitMode = D, window.__hekatanSplitCamera = D ? oe : null, ee();
  }
  if (t) {
    P.add(Ri(q, se, ae), Fi(t, q, se), Ni(q, se, ae), Yi(t, q, se, ae), Di(t, q, se, ae), Bi(t, q, se, ae), Zi(t, q, se, ae), Gi(t, q, se, ae), Ji(t, q, se), el(t, q, se, ae), Oi(t, q, se, ae)), window.__hekatanDiagrama2D || (vl(t, q), Y.domElement.addEventListener("dblclick", () => {
      var _a2;
      const Fe = (_a2 = q.frameResults) == null ? void 0 : _a2.rawVal;
      !Fe || Fe === "none" || !(window.__hekatanModelSelection ?? []).some((Ze) => Ze.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const D = wl({ scene: P, rendererElm: Y.domElement, getActiveCamera: () => L, derivedNodes: se, derivedDisplayScale: ae, mesh: t, settings: q, render: ee });
    P.add(D);
    const J = El(t, q), le = ol(t, q, se, J), ie = ks(J);
    P.add(le), C.appendChild(ie);
    const Me = rl(t, q, se);
    P.add(Me);
    const Se = Me.__colorMapValues, De = ks(Se);
    De.id = "frame-legend", C.appendChild(De), ue.derive(() => {
      var _a2;
      const Fe = q.shellResults.val != "none", He = (((_a2 = q.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ze = Fe || He, ke = q.frameResults.val.startsWith("contour:"), Re = J.val.some((Ye) => Number.isFinite(Ye));
      ie.hidden = !Ze || !Re, le.visible = Ze, De.hidden = !ke;
    });
  }
  if (k) {
    const D = new As(16777215, 0.5);
    P.add(D);
    const J = new Ho(16777215, 0.5);
    J.position.set(30, 25, -10), J.shadow.mapSize.width = 1024, J.shadow.mapSize.height = 1024, P.add(J);
    const le = 10;
    J.shadow.camera.left = -le, J.shadow.camera.right = le, J.shadow.camera.top = le, J.shadow.camera.bottom = -le, J.shadow.camera.far = 1e3;
    const ie = new Ho(16777215, 0.5);
    ie.color.setHSL(11, 43, 96), ie.position.set(-10, 0, 30), P.add(ie), ue.derive(() => {
      (k == null ? void 0 : k.val.length) && (P.remove(...k.oldVal), P.add(...k.rawVal), ee());
    }), ue.derive(() => {
      k.rawVal.forEach((Me) => Me.visible = q.solids.val), ee();
    });
  }
  if (_) {
    const D = [], J = (ie) => {
      var _a2;
      return ((_a2 = ie == null ? void 0 : ie.userData) == null ? void 0 : _a2.isCota) ? q.showCotas.val : q.custom3D.val;
    }, le = () => {
      for (const ie of D) ie.visible = J(ie);
      ee();
    };
    ue.derive(() => {
      const ie = _.val;
      D.length && (P.remove(...D), D.length = 0), ie.length && (P.add(...ie), D.push(...ie), le(), Y.clippingPlanes.length && O()), ee();
    }), ue.derive(() => {
      q.custom3D.val, le();
    }), ue.derive(() => {
      q.showCotas.val, le();
    });
  }
  g && tl({ drawingObj: g, gridObj: we, scene: P, getActiveCamera: () => L, controls: B, gridSize: Z, derivedDisplayScale: ae, rendererElm: Y.domElement, viewerRender: ee }), zs((D, J) => {
    var _a2;
    Y.setClearColor(J.background, 1), P.remove(we), (_a2 = we.traverse) == null ? void 0 : _a2.call(we, (le) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = le.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = le.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), we = Sa(q.gridSize.rawVal, { planes: ye() }), P.add(we), C.style.setProperty("--awatif-legend-color", J.legendMarker), ee();
  });
  const be = { scene: P, perspCamera: $, orthoCamera: z, get camera() {
    return L;
  }, controls: B, renderer: Y, rendererElm: Y.domElement, render: ee, setActiveCamera: $e, setSplitMode: xe, get splitMode() {
    return fe;
  }, get splitCamera() {
    return oe;
  }, settings: q };
  C.__ctx = be;
  const _e = document.createElement("div");
  _e.id = "hk-nav-camara", _e.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Be = (D, J, le) => {
    const ie = document.createElement("button");
    return ie.textContent = D, ie.title = J, ie.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ie.onmouseenter = () => {
      ie.style.background = "rgba(70,70,70,0.9)";
    }, ie.onmouseleave = () => {
      ie.style.background = "rgba(40,40,40,0.85)";
    }, ie.onclick = (Me) => {
      Me.preventDefault(), le();
    }, ie;
  }, Pe = (D, J) => {
    const le = B.target, ie = new F().subVectors(L.position, le), Me = ie.length(), Se = new F(), De = new F();
    Se.crossVectors(L.up, ie).normalize(), De.copy(L.up).normalize();
    const Fe = Me * 0.05;
    le.addScaledVector(Se, -D * Fe), le.addScaledVector(De, J * Fe), L.position.addScaledVector(Se, -D * Fe), L.position.addScaledVector(De, J * Fe), B.update(), ee();
  }, nt = (D) => {
    const J = new F().subVectors(L.position, B.target);
    J.multiplyScalar(D), L.position.copy(B.target).add(J), B.update(), ee();
  }, st = () => {
    const D = document.createElement("div");
    return D.style.cssText = "width:32px;height:32px;", D;
  };
  return _e.append(st()), _e.append(Be("\u2191", "Pan arriba", () => Pe(0, 1))), _e.append(Be("\u2295", "Zoom in", () => nt(0.85))), _e.append(Be("\u2190", "Pan izquierda", () => Pe(-1, 0))), _e.append(Be("\u2302", "Reset vista", () => {
    B.reset(), ee();
  })), _e.append(Be("\u2192", "Pan derecha", () => Pe(1, 0))), _e.append(Be("\u2296", "Zoom out", () => nt(1.18))), _e.append(Be("\u2193", "Pan abajo", () => Pe(0, -1))), _e.append(st()), getComputedStyle(C).position === "static" && (C.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && C.appendChild(_e), C;
}
function kl(t, w) {
  return ue.derive(() => {
    var _a2, _b, _c, _d;
    if (!w.deformedShape.val) return ((_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], _ = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!_ || g.length === 0) return g;
    const k = w.deformScale.val, C = w.deformScale.val * w.deformScaleZ.val, P = Number.isFinite(k) ? k : 1, $ = Number.isFinite(C) ? C : 1;
    return g.map((z, L) => {
      var _a3;
      const Y = ((_a3 = _.get(L)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], B = Number.isFinite(Y[0]) ? Y[0] : 0, j = Number.isFinite(Y[1]) ? Y[1] : 0, U = Number.isFinite(Y[2]) ? Y[2] : 0;
      return [z[0] + B * P, z[1] + j * P, z[2] + U * $];
    });
  });
}
const go = ue.state(null), Ea = ue.state(""), Sl = ue.state("kN"), Pl = ue.state("mm"), zl = ue.state("kN/m\xB2"), Cl = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Ps = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Al = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function El(t, w) {
  const g = ue.state([]);
  let _;
  return ((k) => {
    k.bendingXX = "bendingXX", k.bendingYY = "bendingYY", k.bendingXY = "bendingXY", k.membraneXX = "membraneXX", k.membraneYY = "membraneYY", k.membraneXY = "membraneXY", k.tranverseShearX = "tranverseShearX", k.tranverseShearY = "tranverseShearY", k.membranePrincipalMax = "membranePrincipalMax", k.membranePrincipalMin = "membranePrincipalMin", k.bendingPrincipalMax = "bendingPrincipalMax", k.bendingPrincipalMin = "bendingPrincipalMin", k.transverseShearMax = "transverseShearMax", k.vonMises = "vonMises", k.pressure = "pressure", k.displacementX = "displacementX", k.displacementY = "displacementY", k.displacementZ = "displacementZ";
  })(_ || (_ = {})), ue.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const k = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), me = (D, J) => {
      D == null ? void 0 : D.forEach((le, ie) => {
        const Me = t.elements.val[ie];
        if (Me) for (let Se = 0; Se < Me.length; Se++) J.set(Me[Se], [le[Se] ?? le[0]]);
      });
    };
    me((_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, k), me((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, C), me((_f = (_e2 = t.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, P), me((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, $), me((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, z), me((_l2 = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l2.membraneXY, L), me((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, Y), me((_p = (_o = t.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, B), me((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, j), me((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, U);
    const O = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), he = (D, J, le, ie, Me) => {
      D.forEach((Se, De) => {
        var _a3, _b2;
        const Fe = Se[0] ?? 0, He = ((_a3 = J.get(De)) == null ? void 0 : _a3[0]) ?? 0, Ze = ((_b2 = le.get(De)) == null ? void 0 : _b2[0]) ?? 0, ke = (Fe + He) / 2, Re = Math.hypot((Fe - He) / 2, Ze);
        ie.set(De, [ke + Re]), Me.set(De, [ke - Re]);
      });
    };
    he($, z, L, O, q), he(k, C, P, ae, se), Y.forEach((D, J) => {
      var _a3;
      ye.set(J, [Math.hypot(D[0] ?? 0, ((_a3 = B.get(J)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const we = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, de = (_w = w.solidResults) == null ? void 0 : _w.val, Z = de && de !== "none" ? de : w.shellResults.val, I = we == null ? void 0 : we[Z], G = { bendingXX: [k, 0], bendingYY: [C, 0], bendingXY: [P, 0], membraneXX: [$, 0], membraneYY: [z, 0], membraneXY: [L, 0], tranverseShearX: [Y, 0], tranverseShearY: [B, 0], membranePrincipalMax: [O, 0], membranePrincipalMin: [q, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [se, 0], transverseShearMax: [ye, 0], vonMises: [j, 0], pressure: [U, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, X = w.shellResults.val, T = Sl.val, H = Pl.val, pe = X === "displacementX" || X === "displacementY" || X === "displacementZ", fe = X === "bendingXX" || X === "bendingYY" || X === "bendingXY" || X === "bendingPrincipalMax" || X === "bendingPrincipalMin", oe = X === "membraneXX" || X === "membraneYY" || X === "membraneXY" || X === "membranePrincipalMax" || X === "membranePrincipalMin", W = X === "vonMises" || X === "pressure", ge = X === "tranverseShearX" || X === "tranverseShearY" || X === "transverseShearMax", ee = (_D = w.solidResults) == null ? void 0 : _D.val, $e = ee === "vonMises" || ee === "sigmaXX" || ee === "sigmaYY" || ee === "sigmaZZ" || ee === "tauXY" || ee === "tauYZ" || ee === "tauXZ", xe = ee === "ux" || ee === "uy" || ee === "uz", be = zl.val, _e = $e ? Al[be] : xe || pe ? Ps[H] : fe || oe || W || ge ? 1 / Cl[T] : 1, Be = $e ? be : xe || pe ? H : fe ? `${T}\xB7m/m` : oe ? `${T}/m\xB2` : W ? `${T}/m\xB2` : ge ? `${T}/m` : "";
    Ea.val = Be, go.val = Array.isArray(I) && I.length === 2 ? [I[0] * _e, I[1] * _e] : null;
    const Pe = Ls.val, st = ee && ee !== "none" ? [j, 0] : G[X], Ne = [];
    if (t.nodes.val.forEach((D, J) => {
      const le = st;
      if (!le || !le[0] || typeof le[0].has != "function") return;
      if (!le[0].has(J)) {
        Ne.push(Number.NaN);
        return;
      }
      const ie = le[0].get(J), Me = ie ? ie[le[1]] ?? 0 : 0;
      Ne.push(Me * _e);
    }), !go.val && Pe !== "auto") {
      const D = t.nodes.val, J = /* @__PURE__ */ new Set(), le = (Me, Se) => {
        var _a3;
        const De = (_a3 = D[Me[0]]) == null ? void 0 : _a3[Se];
        return Me.every((Fe) => {
          var _a4;
          return Math.abs((((_a4 = D[Fe]) == null ? void 0 : _a4[Se]) ?? NaN) - De) < 1e-6;
        });
      };
      for (const Me of t.elements.val) {
        if (Me.length !== 4) continue;
        const Se = le(Me, 2), De = !Se && le(Me, 0), Fe = !Se && le(Me, 1);
        if (Pe === "losas" ? Se : Pe === "muros" ? De || Fe : Pe === "murosX" ? De : Pe === "murosY" ? Fe : false) for (const ke of Me) J.add(ke);
      }
      const ie = [];
      for (const Me of J) {
        const Se = Ne[Me];
        Number.isFinite(Se) && ie.push(Se);
      }
      ie.length && (go.val = Fa(ie));
    }
    g.val = Ne;
  }), g;
}
export {
  Vi as a,
  ks as b,
  Sl as c,
  Pl as d,
  zl as e,
  Il as g
};
