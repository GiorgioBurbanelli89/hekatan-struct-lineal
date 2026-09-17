import { u as rn, a6 as Xo, q as mi, v as de, a7 as wi, D as Vt, M as ct, B as Ae, F as It, a8 as yi, z as xt, a9 as xi, aa as gi, h as us, ab as ps, r as Xn, ac as Go, ad as Ko, a4 as zs, _ as ut, b as ft, L as jt, y as Cs, c as bi, ae as Mi, f as wt, V as E, $ as $n, af as ba, K as Oo, d as Et, a as Ma, A as As, t as Ho, J as vi, H as wo, I as _i, ag as Wo, w as va, o as ki, N as An, a2 as eo, E as fs, S as to, m as ho, ah as En, g as hs, i as ms, j as ws, P as yo, C as ys, W as Si, X as Pi, Y as zi, Z as Ci, T as Uo, U as Ai } from "./theme-C-zoknmI.js";
import { T as Tt, O as xs } from "./Text-Cehu0nom.js";
import { P as Es } from "./tweakpane-BXg6ZhiP.js";
import { e as Ei } from "./styles-CqEyA8nI.js";
class Fs {
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
    this.map = _a[h] || _a.rainbow, this.n = g;
    const v = 1 / this.n, _ = new rn(), C = new rn();
    this.lut.length = 0, this.lut.push(new rn(this.map[0][1]));
    for (let P = 1; P < g; P++) {
      const F = P * v;
      for (let z = 0; z < this.map.length - 1; z++) if (F > this.map[z][0] && F <= this.map[z + 1][0]) {
        const $ = this.map[z][0], Y = this.map[z + 1][0];
        _.setHex(this.map[z][1], Xo), C.setHex(this.map[z + 1][1], Xo);
        const B = new rn().lerpColors(_, C, (F - $) / (Y - $));
        this.lut.push(B);
      }
    }
    return this.lut.push(new rn(this.map[this.map.length - 1][1])), this;
  }
  copy(h) {
    return this.lut = h.lut, this.map = h.map, this.n = h.n, this.minV = h.minV, this.maxV = h.maxV, this;
  }
  getColor(h) {
    h = mi.clamp(h, this.minV, this.maxV), h = (h - this.minV) / (this.maxV - this.minV);
    const g = Math.round(h * this.n);
    return this.lut[g];
  }
  addColorMap(h, g) {
    return _a[h] = g, this;
  }
  createCanvas() {
    const h = document.createElement("canvas");
    return h.width = 1, h.height = this.n, this.updateCanvas(h), h;
  }
  updateCanvas(h) {
    const g = h.getContext("2d", { alpha: false }), v = g.getImageData(0, 0, 1, this.n), _ = v.data;
    let C = 0;
    const P = 1 / this.n, F = new rn(), z = new rn(), $ = new rn();
    for (let Y = 1; Y >= 0; Y -= P) for (let B = this.map.length - 1; B >= 0; B--) if (Y < this.map[B][0] && Y >= this.map[B - 1][0]) {
      const ee = this.map[B - 1][0], U = this.map[B][0];
      F.setHex(this.map[B - 1][1], Xo), z.setHex(this.map[B][1], Xo), $.lerpColors(F, z, (Y - ee) / (U - ee)), _[C * 4] = Math.round($.r * 255), _[C * 4 + 1] = Math.round($.g * 255), _[C * 4 + 2] = Math.round($.b * 255), _[C * 4 + 3] = 255, C += 1;
    }
    return g.putImageData(v, 0, 0), h;
  }
}
const _a = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, $s = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Fi = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: $s, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Qo = de.state("safe"), Ls = de.state("auto");
function Vs(t) {
  t = Math.max(0, Math.min(1, t));
  const h = Fi[Qo.val] ?? $s;
  for (let v = 0; v < h.length - 1; v++) {
    const [_, C, P, F] = h[v], [z, $, Y, B] = h[v + 1];
    if (t <= z) {
      const ee = (t - _) / (z - _);
      return [C + ($ - C) * ee, P + (Y - P) * ee, F + (B - F) * ee];
    }
  }
  const g = h[h.length - 1];
  return [g[1], g[2], g[3]];
}
function gs() {
  const h = new Uint8Array(1024);
  for (let v = 0; v < 256; v++) {
    const _ = v / 255, [C, P, F] = Vs(_);
    h[v * 4 + 0] = C, h[v * 4 + 1] = P, h[v * 4 + 2] = F, h[v * 4 + 3] = 255;
  }
  const g = new xi(h, 256, 1, gi);
  return g.minFilter = us, g.magFilter = us, g.wrapS = ps, g.wrapT = ps, g.needsUpdate = true, g;
}
function $i() {
  const h = [];
  for (let g = 0; g <= 12; g++) {
    const v = 1 - g / 12, [_, C, P] = Vs(v);
    h.push(`rgb(${_ | 0},${C | 0},${P | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${h.join(",")})`;
}
function Ea(t) {
  if (!t.length) return [0, 1];
  const h = [...t].sort((C, P) => C - P), g = (C) => h[Math.min(h.length - 1, Math.max(0, Math.round(C * (h.length - 1))))];
  let v = h.length >= 20 ? g(0.01) : h[0], _ = h.length >= 20 ? g(0.99) : h[h.length - 1];
  return v >= 0 && _ > 0 && (v = 0), _ <= 0 && v < 0 && (_ = 0), [v, _];
}
function Li(t, h, g) {
  new Fs();
  const v = gs(), _ = new wi({ uniforms: { cmap: { value: v }, ambient: { value: 0.95 } }, vertexShader: `
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
  de.derive(() => {
    var _a2;
    Qo.val;
    const P = _.uniforms.cmap.value;
    _.uniforms.cmap.value = gs(), (_a2 = P == null ? void 0 : P.dispose) == null ? void 0 : _a2.call(P);
  });
  const C = new ct(new Ae(), _);
  return C.renderOrder = -1, C.frustumCulled = false, C.userData.isShellArea = true, C.name = "__hekatan_shell_colormap", de.derive(() => {
    C.geometry.setAttribute("position", new It(t.val.flat(), 3));
    const P = [], F = [], z = [];
    h.val.forEach((se, ye) => {
      se.length === 3 ? (P.push(se[0], se[1], se[2]), F.push(ye), z.push(0)) : se.length === 4 && (P.push(se[0], se[1], se[2]), P.push(se[0], se[2], se[3]), F.push(ye, ye), z.push(0, 1));
    }), C.geometry.setIndex(new yi(P, 1)), C.userData.faceToElem = F, C.userData.faceLocal = z;
    const $ = g.val.filter((se) => Number.isFinite(se));
    let Y, B;
    const ee = go.val;
    if (ee ? (B = ee[0], Y = ee[1]) : [B, Y] = Ea($), Y === B) {
      const se = Math.max(Math.abs(Y) * 1e-6, 1e-9);
      Y += se, B -= se;
    }
    const U = ee && ee[0] > ee[1], he = Math.min(B, Y), Q = Math.max(B, Y), q = Q - he, ae = new Float32Array(g.val.length);
    for (let se = 0; se < g.val.length; se++) {
      const ye = g.val[se];
      if (!Number.isFinite(ye)) {
        ae[se] = -1;
        continue;
      }
      const we = ((U ? Q + he - ye : ye) - he) / q;
      ae[se] = Math.max(0, Math.min(1, we));
    }
    C.geometry.setAttribute("scalar", new xt(ae, 1));
  }), C;
}
function Vi(t, h, g) {
  const v = document.createElement("div"), _ = new Es({ title: "Settings", expanded: true, container: v });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(_), v.setAttribute("id", "settings");
  const C = "hk_settingsPos";
  let P = null;
  try {
    const U = localStorage.getItem(C);
    U && (P = JSON.parse(U));
  } catch {
  }
  v.style.cssText = ["position:fixed", P ? `left:${P.left}px` : "left:8px", P ? `top:${P.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const F = () => {
    const U = v.querySelector(".tp-rotv_b");
    if (!U) {
      setTimeout(F, 200);
      return;
    }
    U.style.cursor = "move", U.style.userSelect = "none";
    let he = false, Q = 0, q = 0, ae = 0, se = 0;
    U.addEventListener("mousedown", (ye) => {
      he = true, Q = ye.clientX, q = ye.clientY;
      const fe = v.getBoundingClientRect();
      ae = fe.left, se = fe.top, v.style.left = `${ae}px`, v.style.top = `${se}px`;
    }), window.addEventListener("mousemove", (ye) => {
      if (!he) return;
      const fe = ye.clientX - Q, we = ye.clientY - q, ce = Math.max(0, Math.min(window.innerWidth - 40, ae + fe)), K = Math.max(0, Math.min(window.innerHeight - 40, se + we));
      v.style.left = `${ce}px`, v.style.top = `${K}px`;
    }), window.addEventListener("mouseup", () => {
      if (he) {
        he = false;
        try {
          localStorage.setItem(C, JSON.stringify({ left: parseFloat(v.style.left), top: parseFloat(v.style.top) }));
        } catch {
        }
      }
    });
  };
  if (F(), h == null ? void 0 : h.nodes) {
    _.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const U = _.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    U.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), U.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), U.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), U.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const he = U.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    he.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), he.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), he.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), he.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), he.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const Q = _.addFolder({ title: "\u{1F441} Ver", expanded: false });
    Q.addBinding(t.nodes, "val", { label: "Nodes" }), Q.addBinding(t.elements, "val", { label: "Elements" }), Q.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), Q.addBinding(t.faces, "val", { label: "  Caras (fill)" }), Q.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), Q.addBinding(t.elemColumns, "val", { label: "    Columnas" }), Q.addBinding(t.elemBeams, "val", { label: "    Vigas" }), Q.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), Q.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), Q.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), Q.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), Q.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), Q.addBinding(t.orientations, "val", { label: "Orientations" }), Q.addBinding(t.sections, "val", { label: "Sections" }), Q.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), Q.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), Q.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), Q.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), Q.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((h == null ? void 0 : h.nodeInputs) || (h == null ? void 0 : h.elementInputs)) {
    const U = _.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    U.addBinding(t.supports, "val", { label: "Supports" }), U.addBinding(t.loads, "val", { label: "Loads" }), U.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), U.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((h == null ? void 0 : h.deformOutputs) || (h == null ? void 0 : h.analyzeOutputs)) {
    const U = _.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = U, U.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), U.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), U.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), U.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), U.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), U.addBinding(Qo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), U.addBinding(Ls, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), U.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), U.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), U.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), U.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && _.addBinding(t.solids, "val", { label: "Solids" });
  const z = _.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), $ = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), Y = () => {
    const U = window.__hekatanClipApply;
    typeof U == "function" && U();
  };
  let B = [];
  const ee = (U, he) => {
    for (const q of B) try {
      q.dispose();
    } catch {
    }
    B = [];
    const Q = (q, ae) => {
      const se = Math.floor(Math.min(U[ae], -50)), ye = Math.ceil(Math.max(he[ae], 50)), fe = ye - se > 400 ? 0.5 : 0.1;
      return $["pos" + q] = Math.max(se, Math.min(ye, $["pos" + q])), z.addBinding($, "pos" + q, { min: se, max: ye, step: fe, label: `  pos ${q} (m)` }).on("change", Y);
    };
    B.push(z.addBinding($, "enableX", { label: "Cortar X" }).on("change", Y), Q("X", 0), z.addBinding($, "invertX", { label: "  invertir X" }).on("change", Y), z.addBinding($, "enableY", { label: "Cortar Y" }).on("change", Y), Q("Y", 1), z.addBinding($, "invertY", { label: "  invertir Y" }).on("change", Y), z.addBinding($, "enableZ", { label: "Cortar Z" }).on("change", Y), Q("Z", 2), z.addBinding($, "invertZ", { label: "  invertir Z" }).on("change", Y));
  };
  return ee([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (U, he) => {
    ee(U, he);
  }, v;
}
function Ii(t) {
  return { gridSize: de.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: de.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: de.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: de.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: de.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: de.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: de.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: de.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: de.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: de.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: de.state((t == null ? void 0 : t.nodes) ?? true), elements: de.state((t == null ? void 0 : t.elements) ?? true), edges: de.state((t == null ? void 0 : t.edges) ?? true), faces: de.state((t == null ? void 0 : t.faces) ?? true), elemColumns: de.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: de.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: de.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: de.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: de.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: de.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: de.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: de.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: de.state((t == null ? void 0 : t.orientations) ?? false), sections: de.state((t == null ? void 0 : t.sections) ?? true), extruded: de.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: de.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: de.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: de.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: de.state((t == null ? void 0 : t.secFloor) ?? -1), supports: de.state((t == null ? void 0 : t.supports) ?? true), loads: de.state((t == null ? void 0 : t.loads) ?? false), deformedShape: de.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: de.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: de.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: de.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: de.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: de.state((t == null ? void 0 : t.flipAxes) ?? false), solids: de.state((t == null ? void 0 : t.solids) ?? true), custom3D: de.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: de.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: de.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: de.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function Ti(t, h, g) {
  const v = Xn(), _ = new Go(new Ae(), new Ko({ color: v.nodePoint }));
  return zs((C, P) => {
    _.material.color.setHex(P.nodePoint);
  }), _.frustumCulled = false, de.derive(() => {
    t.nodes.val && _.geometry.setAttribute("position", new It(h.val.flat(), 3));
  }), de.derive(() => {
    if (g.val, h.val, !t.nodes.rawVal) return;
    const C = h.rawVal ?? [];
    let P = t.gridSize.val * 0.5;
    if (C.length >= 2) {
      const z = [1 / 0, 1 / 0, 1 / 0], $ = [-1 / 0, -1 / 0, -1 / 0];
      for (const Y of C) for (let B = 0; B < 3; B++) z[B] = Math.min(z[B], Y[B]), $[B] = Math.max($[B], Y[B]);
      P = Math.max($[0] - z[0], $[1] - z[1], $[2] - z[2], 0.1);
    }
    const F = 0.03 * P;
    _.material.size = F * g.rawVal;
  }), de.derive(() => {
    _.visible = t.nodes.val;
  }), _;
}
function ka(t, h) {
  const g = Xn(), v = new ut();
  v.name = "hekatan-grid";
  const _ = (h == null ? void 0 : h.planes) ?? ["xy"];
  let C = (h == null ? void 0 : h.majorStep) ?? 1, P = (h == null ? void 0 : h.minorStep) ?? 0.1;
  for (C <= 0 && (C = 1), P <= 0 && (P = 0.1); t / P > 500; ) P *= 2;
  for (; t / C > 100; ) C *= 2;
  const F = t / 2;
  C = Math.max(P, Math.round(C / P) * P);
  const $ = new rn(g.grid).multiplyScalar(1.3), Y = new rn(g.grid).multiplyScalar(0.8), B = (Q, q, ae, se) => {
    const ye = [], fe = Q === "xy" ? (V, G) => [V, G, 0] : Q === "xz" ? (V, G) => [V, 0, G] : (V, G) => [0, V, G], we = Math.floor(F / q);
    for (let V = -we; V <= we; V++) {
      const G = V * q, X = fe(G, -F), I = fe(G, F);
      ye.push(...X, ...I);
    }
    for (let V = -we; V <= we; V++) {
      const G = V * q, X = fe(-F, G), I = fe(F, G);
      ye.push(...X, ...I);
    }
    const ce = new Ae();
    ce.setAttribute("position", new It(ye, 3));
    const K = new ft({ color: ae, transparent: true, opacity: se, depthWrite: false }), Z = new jt(ce, K);
    return Z.name = `grid-${Q}-${q === P ? "minor" : "major"}`, Z;
  }, ee = (Q, q, ae) => {
    const se = Q === "xy" ? (Z, V) => [Z, V, 0] : Q === "xz" ? (Z, V) => [Z, 0, V] : (Z, V) => [0, Z, V], ye = [[-F, -F], [F, -F], [F, F], [-F, F]], fe = [];
    for (const [Z, V] of ye) fe.push(...se(Z, V));
    const we = new Ae();
    we.setAttribute("position", new It(fe, 3));
    const ce = new ft({ color: q, transparent: true, opacity: ae, depthWrite: false }), K = new Cs(we, ce);
    return K.name = `grid-${Q}-border`, K.renderOrder = 1, K;
  }, U = (Q, q, ae) => {
    const se = Q === "xy" ? (ce, K) => [ce, K, 0] : Q === "xz" ? (ce, K) => [ce, 0, K] : (ce, K) => [0, ce, K], ye = q === "u" ? [...se(-F, 0), ...se(F, 0)] : [...se(0, -F), ...se(0, F)], fe = new Ae();
    fe.setAttribute("position", new It(ye, 3));
    const we = new jt(fe, new ft({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
    return we.name = `grid-${Q}-eje-${q}`, we.renderOrder = 1, we;
  }, he = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const Q of _) {
    v.add(B(Q, P, Y, 0.12)), v.add(B(Q, C, $, 0.4));
    const [q, ae] = he[Q];
    v.add(U(Q, "u", q)), v.add(U(Q, "v", ae)), v.add(ee(Q, $, 0.55));
  }
  return v.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: C, minorStep: P, gridSize: t, planes: [..._] }, v;
}
function Ri(t, h, g, v) {
  const _ = new ut(), C = new bi(0.5, 0.5, 0.5), P = new Mi(0.45, 0.7, 4);
  P.rotateX(Math.PI / 2), P.translate(0, 0, -0.35);
  const F = new wt({ color: 10166822 }), z = new wt({ color: 2792847 }), $ = new wt({ color: 3835647 }), Y = () => {
    const U = g.rawVal ?? [];
    if (U.length < 2) return h.gridSize.val * 0.5;
    let he = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
    for (const q of U) for (let ae = 0; ae < 3; ae++) q[ae] < he[ae] && (he[ae] = q[ae]), q[ae] > Q[ae] && (Q[ae] = q[ae]);
    return Math.max(Q[0] - he[0], Q[1] - he[1], Q[2] - he[2], 0.1);
  }, B = () => 0.08 * Y(), ee = () => v.rawVal;
  return de.derive(() => {
    var _a2, _b;
    if (h.deformedShape.val, !h.supports.val) return;
    _.clear();
    const U = B();
    (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((he, Q) => {
      const q = g.val[Q];
      if (!q) return;
      const ae = he ?? [], se = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), ye = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let fe;
      se >= 3 && ye >= 3 ? fe = new ct(C, F) : se >= 3 && ye === 0 ? fe = new ct(P, z) : fe = new ct(P, $), fe.position.set(q[0], q[1], q[2]);
      const we = U * ee();
      fe.scale.set(we, we, we), _.add(fe);
    });
  }), de.derive(() => {
    if (v.val, !h.supports.rawVal) return;
    const he = B() * ee();
    _.children.forEach((Q) => Q.scale.set(he, he, he));
  }), de.derive(() => {
    _.visible = h.supports.val;
  }), _;
}
function Di(t, h, g, v) {
  const _ = new ut();
  _.name = "loadsGroup";
  function C(F) {
    if (F.length < 2) return 0.12 * h.gridSize.rawVal;
    const z = [1 / 0, 1 / 0, 1 / 0], $ = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of F) for (let ee = 0; ee < 3; ee++) z[ee] = Math.min(z[ee], B[ee]), $[ee] = Math.max($[ee], B[ee]);
    return 0.08 * Math.max($[0] - z[0], $[1] - z[1], $[2] - z[2], 0.1);
  }
  de.derive(() => {
    var _a2, _b, _c;
    if (h.deformedShape.val, !h.loads.val) return;
    _.children.forEach((Q) => {
      var _a3;
      return (_a3 = Q.dispose) == null ? void 0 : _a3.call(Q);
    }), _.clear();
    const F = g.val, z = C(F), $ = 240, Y = [];
    (_c = (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((Q, q) => {
      F[q] && Q.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && Y.push(q);
    });
    let B = Y;
    if (Y.length > $) {
      const Q = Y.map((I) => F[I][0]), q = Y.map((I) => F[I][1]), ae = Math.min(...Q), se = Math.max(...Q), ye = Math.min(...q), fe = Math.max(...q), we = Y.map((I) => F[I][2]), ce = Math.max(1e-6, (Math.max(...we) - Math.min(...we)) / 40), K = (I) => Math.round(I / ce), Z = new Set(we.map(K)), V = Math.max(4, Math.floor($ / Math.max(1, Z.size))), G = Math.max(2, Math.round(Math.sqrt(V))), X = /* @__PURE__ */ new Map();
      for (const I of Y) {
        const J = se - ae < 1e-9 ? 0 : (F[I][0] - ae) / (se - ae), ue = fe - ye < 1e-9 ? 0 : (F[I][1] - ye) / (fe - ye), pe = Math.min(G - 1, Math.floor(J * G)), oe = Math.min(G - 1, Math.floor(ue * G)), H = `${pe},${oe},${K(F[I][2])}`, ge = Math.hypot(J * G - (pe + 0.5), ue * G - (oe + 0.5)), te = X.get(H);
        (!te || ge < te.d) && X.set(H, { i: I, d: ge });
      }
      B = [...X.values()].map((I) => I.i);
    }
    let ee = 0;
    for (const Q of B) {
      const q = t.nodeInputs.val.loads.get(Q);
      for (let ae = 0; ae < 3; ae++) ee = Math.max(ee, Math.abs(q[ae]));
    }
    const U = B.length <= 60, he = (Q) => {
      const q = Math.abs(Q);
      return q >= 100 ? Q.toFixed(0) : q >= 10 ? Q.toFixed(1) : Q.toFixed(2);
    };
    for (const Q of B) {
      const q = t.nodeInputs.val.loads.get(Q), ae = F[Q];
      if (ae) for (let se = 0; se < 3; se++) {
        const ye = q[se];
        if (!(Math.abs(ye) > 1e-9 * (ee || 1))) continue;
        const fe = new E(se === 0 ? Math.sign(ye) : 0, se === 1 ? Math.sign(ye) : 0, se === 2 ? Math.sign(ye) : 0), we = 0.45 + 0.55 * (ee ? Math.abs(ye) / ee : 1), ce = new $n(fe, new E(...ae), 1, se === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (ce.userData = { nudo: ae, dir: fe, rel: we }, _.add(ce), U) {
          const K = new Tt(he(ye), se === 2 ? "#f5b642" : "#ff6b5e");
          K.userData = { nudo: ae, dir: fe, rel: we, texto: true }, _.add(K);
        }
      }
    }
    P(z * v.rawVal);
  });
  function P(F) {
    _.children.forEach((z) => {
      const $ = z.userData;
      if (!($ == null ? void 0 : $.dir)) return;
      const Y = F * $.rel, B = new E(...$.nudo).addScaledVector($.dir, -Y * ($.texto ? 1.12 : 1));
      z.position.copy(B), $.texto ? z.updateScale(F * 0.38) : z.scale.set(Y, Y, Y);
    });
  }
  return de.derive(() => {
    v.val, h.loads.rawVal && P(C(g.rawVal) * v.rawVal);
  }), de.derive(() => {
    _.visible = h.loads.val;
  }), _;
}
function Bi(t, h, g) {
  const v = new ut();
  return de.derive(() => {
    if (!t.nodesIndexes.val) return;
    v.children.forEach((C) => C.dispose()), v.clear();
    const _ = 0.05 * t.gridSize.val * 0.6;
    h.val.forEach((C, P) => {
      const F = new Tt(`${P}`);
      F.position.set(...C), F.updateScale(_ * g.rawVal), v.add(F);
    });
  }), de.derive(() => {
    if (g.val, !t.nodesIndexes.rawVal) return;
    const _ = 0.05 * t.gridSize.val * 0.6;
    v.children.forEach((C) => C.updateScale(_ * g.rawVal));
  }), de.derive(() => {
    v.visible = t.nodesIndexes.val;
  }), v;
}
function Ni(t, h, g, v) {
  const _ = new ut();
  return de.derive(() => {
    var _a2;
    if (h.deformedShape.val, !h.elementsIndexes.val) return;
    _.children.forEach((P) => P.dispose()), _.clear();
    const C = 0.05 * h.gridSize.val * 0.6;
    (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((P, F) => {
      const z = new Tt(`${F}`, void 0, "#001219");
      z.position.set(...Yi(P.map(($) => g.rawVal[$]))), z.updateScale(C * v.rawVal), _.add(z);
    });
  }), de.derive(() => {
    if (v.val, !h.elementsIndexes.rawVal) return;
    const C = 0.05 * h.gridSize.val * 0.6;
    _.children.forEach((P) => P.updateScale(C * v.rawVal));
  }), de.derive(() => {
    _.visible = h.elementsIndexes.val;
  }), _;
}
function Yi(t) {
  const h = t.reduce((v, _) => [v[0] + _[0], v[1] + _[1], v[2] + _[2]], [0, 0, 0]), g = t.length;
  return [h[0] / g, h[1] / g, h[2] / g];
}
function bs(t, h) {
  const g = new ut(), v = Math.min(0.05 * t, 0.6), _ = Xn(), C = new Tt("X", "red", "transparent"), P = new Tt(h ? "Z" : "Y", "green", "transparent"), F = new Tt(h ? "Y" : "Z", "blue", "transparent"), z = new $n(new E(1, 0, 0), new E(0, 0, 0), 1, _.axisArrow, 0.2, 0.2), $ = new $n(new E(0, 1, 0), new E(0, 0, 0), 1, _.axisArrow, 0.2, 0.2), Y = new $n(new E(0, 0, 1), new E(0, 0, 0), 1, _.axisArrow, 0.2, 0.2);
  return C.position.set(1.3 * v, 0, 0), P.position.set(0, 1.3 * v, 0), F.position.set(0, 0, 1.3 * v), C.updateScale(0.4 * v), P.updateScale(0.4 * v), F.updateScale(0.4 * v), z.scale.set(v, v, v), $.scale.set(v, v, v), Y.scale.set(v, v, v), g.add(z, $, Y, C, P, F), g;
}
function Jo(t, h) {
  const g = new E(...t), _ = new E(...h).clone().sub(g), C = _.length(), P = _.dot(new E(1, 0, 0)) / C, F = _.dot(new E(0, 1, 0)) / C, z = _.dot(new E(0, 0, 1)) / C, $ = Math.sqrt(P ** 2 + F ** 2);
  let Y = new ba().fromArray([[P, F, z], [-F / $, P / $, 0], [-P * z / $, -F * z / $, $]].flat());
  return z === 1 && (Y = new ba().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), z === -1 && (Y = new ba().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Oo().setFromMatrix3(Y);
}
function za(t, h) {
  return t == null ? void 0 : t.map((g, v) => (9 * g + h[v]) / 10);
}
function xo(t) {
  const h = t.reduce((v, _) => [v[0] + _[0], v[1] + _[1], v[2] + _[2]], [0, 0, 0]), g = t.length;
  return [h[0] / g, h[1] / g, h[2] / g];
}
function Xi(t, h, g) {
  const v = xo([h, g]), _ = xo([t, g]), C = xo([t, h]), P = new E(...v).sub(new E(..._)).normalize(), F = new E(...g).sub(new E(...C)).normalize(), z = P.clone().cross(F).normalize(), $ = z.clone().cross(P).normalize();
  return new Oo().makeBasis(P, $, z);
}
function Ui(t, h, g, v) {
  const _ = new ut(), C = new Ae(), P = new ft({ vertexColors: true }), F = [0, 0, 0], z = [1, 0, 0], $ = [0, 1, 0], Y = [0, 0, 1];
  C.setAttribute("position", new It([...F, ...z, ...F, ...$, ...F, ...Y], 3));
  const B = [255, 0, 0], ee = [0, 255, 0], U = [0, 0, 255];
  return C.setAttribute("color", new It([...B, ...B, ...ee, ...ee, ...U, ...U], 3)), de.derive(() => {
    var _a2;
    h.deformedShape.val, h.orientations.val && (_.clear(), (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((he) => {
      const Q = new jt(C, P), q = g.rawVal[he[0]], ae = g.rawVal[he[1]];
      if (he.length === 2 && (Q.position.set(...za(q, ae)), Q.rotation.setFromRotationMatrix(Jo(q, ae))), he.length === 3) {
        const fe = g.rawVal[he[2]];
        Q.position.set(...xo([q, ae, fe])), Q.rotation.setFromRotationMatrix(Xi(q, ae, fe));
      }
      const ye = 0.05 * h.gridSize.rawVal * 0.75 * v.rawVal;
      Q.scale.set(ye, ye, ye), _.add(Q);
    }));
  }), de.derive(() => {
    if (v.val, !h.orientations.rawVal) return;
    const Q = 0.05 * h.gridSize.val * 0.75 * v.rawVal;
    _.children.forEach((q) => q.scale.set(Q, Q, Q));
  }), de.derive(() => {
    _.visible = h.orientations.val;
  }), _;
}
function Zi(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const h = (t.b * 100).toFixed(0), g = (t.h * 100).toFixed(0);
    return `${h}x${g}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function qi(t, h, g, v) {
  const _ = new ut(), C = new ut();
  _.add(C);
  function P(ce, K) {
    const Z = ce / 2, V = K / 2, G = new Float32Array([0, -Z, -V, 0, Z, -V, 0, Z, V, 0, -Z, -V, 0, Z, V, 0, -Z, V]), X = new Ae();
    X.setAttribute("position", new xt(G, 3));
    const I = new Float32Array([0, -Z, -V, 0, Z, -V, 0, Z, V, 0, -Z, V, 0, -Z, -V]), J = new Ae();
    return J.setAttribute("position", new xt(I, 3)), { fill: X, outline: J };
  }
  function F(ce, K = 24) {
    const Z = ce / 2, V = new Float32Array(K * 9);
    for (let J = 0; J < K; J++) {
      const ue = J / K * Math.PI * 2, pe = (J + 1) / K * Math.PI * 2;
      V[J * 9] = 0, V[J * 9 + 1] = 0, V[J * 9 + 2] = 0, V[J * 9 + 3] = 0, V[J * 9 + 4] = Z * Math.cos(ue), V[J * 9 + 5] = Z * Math.sin(ue), V[J * 9 + 6] = 0, V[J * 9 + 7] = Z * Math.cos(pe), V[J * 9 + 8] = Z * Math.sin(pe);
    }
    const G = new Ae();
    G.setAttribute("position", new xt(V, 3));
    const X = new Float32Array((K + 1) * 3);
    for (let J = 0; J <= K; J++) {
      const ue = J / K * Math.PI * 2;
      X[J * 3] = 0, X[J * 3 + 1] = Z * Math.cos(ue), X[J * 3 + 2] = Z * Math.sin(ue);
    }
    const I = new Ae();
    return I.setAttribute("position", new xt(X, 3)), { fill: G, outline: I };
  }
  function z(ce, K, Z, V) {
    const G = Z ?? K * 0.08, X = V ?? ce * 0.07, I = ce / 2, J = K / 2, ue = J - G, pe = X / 2, oe = [];
    function H(xe, be, _e, Be) {
      oe.push(0, xe, be, 0, _e, be, 0, _e, Be, 0, xe, be, 0, _e, Be, 0, xe, Be);
    }
    H(-I, -J, I, -ue), H(-pe, -ue, pe, ue), H(-I, ue, I, J);
    const ge = new Ae();
    ge.setAttribute("position", new xt(new Float32Array(oe), 3));
    const te = new Float32Array([0, -I, -J, 0, I, -J, 0, I, -ue, 0, pe, -ue, 0, pe, ue, 0, I, ue, 0, I, J, 0, -I, J, 0, -I, ue, 0, -pe, ue, 0, -pe, -ue, 0, -I, -ue, 0, -I, -J]), $e = new Ae();
    return $e.setAttribute("position", new xt(te, 3)), { fill: ge, outline: $e };
  }
  function $(ce, K, Z) {
    const V = ce / 2, G = K / 2, X = V - Z, I = G - Z, J = [];
    function ue(ge, te, $e, xe) {
      J.push(0, ge, te, 0, $e, te, 0, $e, xe, 0, ge, te, 0, $e, xe, 0, ge, xe);
    }
    ue(-V, -G, V, -I), ue(-V, I, V, G), ue(-V, -I, -X, I), ue(X, -I, V, I);
    const pe = new Ae();
    pe.setAttribute("position", new xt(new Float32Array(J), 3));
    const oe = new Float32Array([0, -V, -G, 0, V, -G, 0, V, -G, 0, V, G, 0, V, G, 0, -V, G, 0, -V, G, 0, -V, -G, 0, -X, -I, 0, X, -I, 0, X, -I, 0, X, I, 0, X, I, 0, -X, I, 0, -X, I, 0, -X, -I]), H = new Ae();
    return H.setAttribute("position", new xt(oe, 3)), { fill: pe, outline: H };
  }
  function Y(ce, K, Z) {
    const V = ce / 2, G = K / 2, X = V - Z, I = G - Z, J = new Ae(), ue = new Float32Array([0, -X, -I, 0, X, -I, 0, X, I, 0, -X, -I, 0, X, I, 0, -X, I]);
    J.setAttribute("position", new xt(ue, 3));
    const pe = [];
    function oe($e, xe, be, _e) {
      pe.push(0, $e, xe, 0, be, xe, 0, be, _e, 0, $e, xe, 0, be, _e, 0, $e, _e);
    }
    oe(-V, -G, V, -I), oe(-V, I, V, G), oe(-V, -I, -X, I), oe(X, -I, V, I);
    const H = new Ae();
    H.setAttribute("position", new xt(new Float32Array(pe), 3));
    const ge = new Float32Array([0, -V, -G, 0, V, -G, 0, V, -G, 0, V, G, 0, V, G, 0, -V, G, 0, -V, G, 0, -V, -G, 0, -X, -I, 0, X, -I, 0, X, -I, 0, X, I, 0, X, I, 0, -X, I, 0, -X, I, 0, -X, -I]), te = new Ae();
    return te.setAttribute("position", new xt(ge, 3)), { concFill: J, steelFillGeom: H, outline: te };
  }
  function B(ce, K, Z) {
    const V = [], G = [[0, -ce / 2, -K / 2], [0, -ce / 2 + Z, -K / 2], [0, -ce / 2 + Z, K / 2 - Z], [0, ce / 2, K / 2 - Z], [0, ce / 2, K / 2], [0, -ce / 2, K / 2]], X = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of X) V.push(...G[pe]);
    const I = new Ae();
    I.setAttribute("position", new xt(new Float32Array(V), 3));
    const J = [];
    for (let pe = 0; pe < G.length; pe++) {
      const oe = (pe + 1) % G.length;
      J.push(...G[pe], ...G[oe]);
    }
    const ue = new Ae();
    return ue.setAttribute("position", new xt(new Float32Array(J), 3)), { fill: I, outline: ue };
  }
  function ee(ce, K, Z, V) {
    const G = V / 2, X = [], I = [[0, -ce - G, -K / 2], [0, -Z - G, -K / 2], [0, -Z - G, K / 2 - Z], [0, -G, K / 2 - Z], [0, -G, K / 2], [0, -ce - G, K / 2]], J = [[0, G, -K / 2], [0, G + Z, -K / 2], [0, G + Z, K / 2 - Z], [0, ce + G, K / 2 - Z], [0, ce + G, K / 2], [0, G, K / 2]], ue = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ge of ue) X.push(...I[ge]);
    for (const ge of ue) X.push(...J[ge]);
    const pe = new Ae();
    pe.setAttribute("position", new xt(new Float32Array(X), 3));
    const oe = [];
    for (const ge of [I, J]) for (let te = 0; te < ge.length; te++) {
      const $e = (te + 1) % ge.length;
      oe.push(...ge[te], ...ge[$e]);
    }
    const H = new Ae();
    return H.setAttribute("position", new xt(new Float32Array(oe), 3)), { fill: pe, outline: H };
  }
  function U(ce, K, Z, V) {
    const G = K / 2, X = ce, I = [[0, -X, -G], [0, -X, -G + Z], [0, -V, -G + Z], [0, -V, G - Z], [0, -X, G - Z], [0, -X, G], [0, 0, G], [0, 0, -G]], J = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ue = [];
    for (const ge of J) ue.push(...I[ge]);
    const pe = new Ae();
    pe.setAttribute("position", new xt(new Float32Array(ue), 3));
    const oe = [];
    for (let ge = 0; ge < I.length; ge++) {
      const te = (ge + 1) % I.length;
      oe.push(...I[ge], ...I[te]);
    }
    const H = new Ae();
    return H.setAttribute("position", new xt(new Float32Array(oe), 3)), { fill: pe, outline: H };
  }
  function he(ce, K, Z, V, G) {
    const X = K / 2, I = G / 2, J = [], ue = [[0, -ce, -X], [0, -ce, -X + Z], [0, -I - V, -X + Z], [0, -I - V, X - Z], [0, -ce, X - Z], [0, -ce, X], [0, -I, X], [0, -I, -X]], pe = ue.map(($e) => [$e[0], -$e[1], $e[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const $e of oe) J.push(...ue[$e]);
    for (const $e of oe) J.push(...pe[$e]);
    const H = new Ae();
    H.setAttribute("position", new xt(new Float32Array(J), 3));
    const ge = [];
    for (const $e of [ue, pe]) for (let xe = 0; xe < $e.length; xe++) {
      const be = (xe + 1) % $e.length;
      ge.push(...$e[xe], ...$e[be]);
    }
    const te = new Ae();
    return te.setAttribute("position", new xt(new Float32Array(ge), 3)), { fill: H, outline: te };
  }
  function Q(ce, K, Z, V) {
    const G = ce / 2, X = K / 2, I = V / 2, J = [[0, -I, -X], [0, I, -X], [0, I, X - Z], [0, G, X - Z], [0, G, X], [0, -G, X], [0, -G, X - Z], [0, -I, X - Z]], ue = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], pe = [];
    for (const te of ue) pe.push(...J[te]);
    const oe = new Ae();
    oe.setAttribute("position", new xt(new Float32Array(pe), 3));
    const H = [];
    for (let te = 0; te < J.length; te++) {
      const $e = (te + 1) % J.length;
      H.push(...J[te], ...J[$e]);
    }
    const ge = new Ae();
    return ge.setAttribute("position", new xt(new Float32Array(H), 3)), { fill: oe, outline: ge };
  }
  function q(ce, K, Z = 24) {
    const V = ce / 2, G = V - K, X = [];
    for (let pe = 0; pe < Z; pe++) {
      const oe = pe / Z * Math.PI * 2, H = (pe + 1) / Z * Math.PI * 2, ge = Math.cos(oe), te = Math.sin(oe), $e = Math.cos(H), xe = Math.sin(H);
      X.push(0, V * ge, V * te, 0, V * $e, V * xe, 0, G * $e, G * xe), X.push(0, V * ge, V * te, 0, G * $e, G * xe, 0, G * ge, G * te);
    }
    const I = new Ae();
    I.setAttribute("position", new xt(new Float32Array(X), 3));
    const J = [];
    for (let pe = 0; pe < Z; pe++) {
      const oe = pe / Z * Math.PI * 2, H = (pe + 1) / Z * Math.PI * 2;
      J.push(0, V * Math.cos(oe), V * Math.sin(oe), 0, V * Math.cos(H), V * Math.sin(H)), J.push(0, G * Math.cos(oe), G * Math.sin(oe), 0, G * Math.cos(H), G * Math.sin(H));
    }
    const ue = new Ae();
    return ue.setAttribute("position", new xt(new Float32Array(J), 3)), { fill: I, outline: ue };
  }
  const ae = new wt({ color: 52479, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }), se = new ft({ color: 52479 }), ye = new wt({ color: 16750848, transparent: true, opacity: 0.4, side: Vt, depthWrite: false }), fe = new ft({ color: 16750848 });
  function we(ce, K) {
    const Z = Math.abs(K[0] - ce[0]), V = Math.abs(K[1] - ce[1]), G = Math.abs(K[2] - ce[2]);
    return G > Z && G > V || V > Z && V > G;
  }
  return de.derive(() => {
    var _a2, _b;
    h.deformedShape.val, h.secColumns.val, h.secBeams.val, h.secFloor.val;
    const ce = h.secColumns.rawVal, K = h.secBeams.rawVal;
    if (!ce && !K) {
      _.children.forEach((I) => {
        I instanceof Tt && I.dispose();
      }), _.clear();
      return;
    }
    _.children.forEach((I) => {
      I instanceof Tt && I.dispose();
    }), _.clear();
    const Z = (_a2 = t.elements) == null ? void 0 : _a2.val, V = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!Z || !V) return;
    const G = V.sectionShapes, X = h.secFloor.rawVal;
    Z.forEach((I, J) => {
      if (I.length !== 2) return;
      const ue = g.rawVal[I[0]], pe = g.rawVal[I[1]];
      if (!ue || !pe) return;
      const oe = we(ue, pe);
      if (oe && !ce || !oe && !K) return;
      if (X >= 0) {
        const xe = Math.min(ue[1], pe[1]);
        Math.max(ue[1], pe[1]);
        const be = h.gridSize.rawVal || 3;
        if (Math.floor(xe / be + 0.01) !== X) return;
      }
      const H = G == null ? void 0 : G.get(J);
      if (!H) return;
      const ge = [(ue[0] + pe[0]) / 2, (ue[1] + pe[1]) / 2, (ue[2] + pe[2]) / 2], te = Jo(ue, pe);
      if (H.type === "CFT") {
        const xe = Y(H.b, H.h, H.tw ?? H.b * 0.05), be = new ct(xe.concFill, ae);
        be.position.set(...ge), be.rotation.setFromRotationMatrix(te), be.userData.e = J, _.add(be);
        const _e = new ct(xe.steelFillGeom, ye);
        _e.position.set(...ge), _e.rotation.setFromRotationMatrix(te), _e.userData.e = J, _.add(_e);
        const Be = new Et(xe.outline, fe);
        Be.position.set(...ge), Be.rotation.setFromRotationMatrix(te), Be.userData.e = J, _.add(Be);
      } else {
        let xe, be, _e;
        switch (H.type) {
          case "rect":
            xe = P(H.b, H.h), be = ae, _e = se;
            break;
          case "circ":
            xe = F(H.d), be = ae, _e = se;
            break;
          case "I":
            xe = z(H.b, H.h, H.tf, H.tw), be = ye, _e = fe;
            break;
          case "HSS":
            xe = $(H.b, H.h, H.tw ?? H.b * 0.05), be = ye, _e = fe;
            break;
          case "CFT":
            xe = Y(H.b, H.h, H.tw ?? H.b * 0.05), be = ye, _e = fe;
            break;
          case "L":
            xe = B(H.b ?? H.h, H.h, H.t ?? H.tw ?? 3e-3), be = ye, _e = fe;
            break;
          case "2L":
            xe = ee(H.b ?? H.h, H.h, H.t ?? H.tw ?? 3e-3, H.dis ?? 0.01), be = ye, _e = fe;
            break;
          case "C":
          case "coldC":
            xe = U(H.b, H.h, H.tf ?? H.t ?? 3e-3, H.tw ?? H.t ?? 3e-3), be = ye, _e = fe;
            break;
          case "2C":
            xe = he(H.b, H.h, H.tf ?? 5e-3, H.tw ?? 5e-3, H.dis ?? 0.01), be = ye, _e = fe;
            break;
          case "T":
            xe = Q(H.b, H.h, H.tf ?? 0.01, H.tw ?? 6e-3), be = ye, _e = fe;
            break;
          case "pipe":
            xe = q(H.d, H.tw ?? H.d * 0.05), be = ye, _e = fe;
            break;
          default:
            return;
        }
        const Be = new ct(xe.fill, be);
        Be.position.set(...ge), Be.rotation.setFromRotationMatrix(te), Be.userData.e = J, _.add(Be);
        const Pe = new Et(xe.outline, _e);
        Pe.position.set(...ge), Pe.rotation.setFromRotationMatrix(te), Pe.userData.e = J, _.add(Pe);
      }
      const $e = Zi(H);
      if ($e) {
        const be = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(H.type) ? "#ff9900" : "#00ccff", _e = new Tt($e, be, "transparent");
        _e.position.set(ge[0], ge[1], ge[2]);
        const Be = 0.05 * h.gridSize.rawVal * 0.5;
        _e.updateScale(Be * ((v == null ? void 0 : v.rawVal) ?? 1)), C.add(_e);
      }
    });
  }), de.derive(() => {
    var _a2, _b;
    const ce = g.val, K = (_a2 = t.elements) == null ? void 0 : _a2.rawVal;
    if (K) for (const Z of _.children) {
      const V = (_b = Z.userData) == null ? void 0 : _b.e;
      if (V === void 0) continue;
      const G = K[V], X = G && ce[G[0]], I = G && ce[G[1]];
      !X || !I || (Z.position.set((X[0] + I[0]) / 2, (X[1] + I[1]) / 2, (X[2] + I[2]) / 2), Z.rotation.setFromRotationMatrix(Jo(X, I)));
    }
  }), v && de.derive(() => {
    if (v.val, !h.sections.rawVal) return;
    const ce = 0.05 * h.gridSize.val * 0.5;
    C.children.forEach((K) => {
      K instanceof Tt && K.updateScale(ce * v.rawVal);
    });
  }), de.derive(() => {
    _.visible = h.sections.val;
  }), de.derive(() => {
    C.visible = h.sectionLabels.val;
  }), _;
}
function Gi(t) {
  if (!t) return null;
  const h = t.type, g = (Y, B) => [Y, B], v = (Y, B) => [g(-Y / 2, -B / 2), g(Y / 2, -B / 2), g(Y / 2, B / 2), g(-Y / 2, B / 2)], _ = (Y, B = 24) => {
    const ee = Y / 2, U = [];
    for (let he = 0; he < B; he++) {
      const Q = 2 * Math.PI * he / B;
      U.push(g(ee * Math.cos(Q), ee * Math.sin(Q)));
    }
    return U;
  }, C = t.b ?? 0, P = t.h ?? 0, F = t.d ?? 0, z = t.tw ?? t.t ?? 0, $ = t.tf ?? t.t ?? 0;
  switch (h) {
    case "rect":
      return C && P ? { contorno: v(C, P) } : null;
    case "circ":
      return F ? { contorno: _(F) } : null;
    case "pipe":
      return F && z ? { contorno: _(F), huecos: [_(F - 2 * z).reverse()] } : null;
    case "HSS":
      return C && P && z ? { contorno: v(C, P), huecos: [v(C - 2 * z, P - 2 * ($ || z)).reverse()] } : null;
    case "CFT":
      return C && P ? { contorno: v(C, P) } : null;
    case "I":
      return C && P && z && $ ? { contorno: [g(-C / 2, -P / 2), g(C / 2, -P / 2), g(C / 2, -P / 2 + $), g(z / 2, -P / 2 + $), g(z / 2, P / 2 - $), g(C / 2, P / 2 - $), g(C / 2, P / 2), g(-C / 2, P / 2), g(-C / 2, P / 2 - $), g(-z / 2, P / 2 - $), g(-z / 2, -P / 2 + $), g(-C / 2, -P / 2 + $)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return C && P && z && $ ? { contorno: [g(-C / 2, -P / 2), g(C / 2, -P / 2), g(C / 2, -P / 2 + $), g(-C / 2 + z, -P / 2 + $), g(-C / 2 + z, P / 2 - $), g(C / 2, P / 2 - $), g(C / 2, P / 2), g(-C / 2, P / 2)] } : null;
    case "T":
      return C && P && z && $ ? { contorno: [g(-z / 2, -P / 2), g(z / 2, -P / 2), g(z / 2, P / 2 - $), g(C / 2, P / 2 - $), g(C / 2, P / 2), g(-C / 2, P / 2), g(-C / 2, P / 2 - $), g(-z / 2, P / 2 - $)] } : null;
    case "L":
    case "2L":
      return C && P && z ? { contorno: [g(-C / 2, -P / 2), g(C / 2, -P / 2), g(C / 2, -P / 2 + z), g(-C / 2 + z, -P / 2 + z), g(-C / 2 + z, P / 2), g(-C / 2, P / 2)] } : null;
    default:
      return C && P ? { contorno: v(C, P) } : F ? { contorno: _(F) } : null;
  }
}
function Ki(t, h, g) {
  if (!t || t <= 0 || !h || !g || h <= 0 || g <= 0) return null;
  const v = Math.sqrt(Math.sqrt(g / h)), _ = Math.sqrt(t / v), C = t / _;
  return !isFinite(_) || !isFinite(C) || _ <= 0 || C <= 0 ? null : { contorno: [[-_ / 2, -C / 2], [_ / 2, -C / 2], [_ / 2, C / 2], [-_ / 2, C / 2]] };
}
function Wi(t) {
  const h = new wo();
  t.contorno.forEach(([g, v], _) => _ ? h.lineTo(g, v) : h.moveTo(g, v)), h.closePath();
  for (const g of t.huecos ?? []) {
    const v = new _i();
    g.forEach(([_, C], P) => P ? v.lineTo(_, C) : v.moveTo(_, C)), v.closePath(), h.holes.push(v);
  }
  return h;
}
function Hi(t, h, g) {
  const v = new ut();
  v.name = "extrusion";
  const _ = new Ma({ color: 8369151, transparent: true, opacity: 0.92, side: Vt }), C = new Ma({ color: 12623968, transparent: true, opacity: 0.85, side: Vt }), P = new Ma({ color: 11583173, transparent: true, opacity: 0.85, side: Vt }), F = new ut();
  F.add(new As(16777215, 0.55));
  const z = new Ho(16777215, 0.75);
  z.position.set(30, 25, 40);
  const $ = new Ho(16777215, 0.35);
  $.position.set(-25, -20, 15), F.add(z, $);
  let Y = 0;
  return de.derive(() => {
    var _a2, _b, _c, _d, _e;
    const B = ((_a2 = h.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++Y, on: B }, v.visible = B;
    for (const se of [...v.children]) se !== F && (v.remove(se), (_c = (_b = se.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (v.children.includes(F) || v.add(F), !B) return;
    const ee = g.val ?? [], U = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], he = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, Q = he.sectionShapes ?? /* @__PURE__ */ new Map(), q = he.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      U.forEach((se, ye) => {
        var _a3, _b2, _c2;
        if (se.length === 2) {
          let fe = Gi(Q.get(ye)), we = true;
          if (fe || (fe = Ki((_a3 = he.areas) == null ? void 0 : _a3.get(ye), (_b2 = he.momentsOfInertiaY) == null ? void 0 : _b2.get(ye), (_c2 = he.momentsOfInertiaZ) == null ? void 0 : _c2.get(ye)), we = false), !fe) return;
          const ce = ee[se[0]], K = ee[se[1]];
          if (!ce || !K) return;
          const Z = Math.hypot(K[0] - ce[0], K[1] - ce[1], K[2] - ce[2]);
          if (Z < 1e-9) return;
          const V = new vi(Wi(fe), { depth: Z, bevelEnabled: false, curveSegments: 4 });
          V.applyMatrix4(new Oo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const G = new ct(V, we ? _ : C);
          G.position.set(ce[0], ce[1], ce[2]), G.rotation.setFromRotationMatrix(Jo(ce, K)), v.add(G);
          return;
        }
        if (se.length === 3 || se.length === 4) {
          const fe = q.get(ye);
          if (!fe || fe <= 0) return;
          const we = se.map((xe) => ee[xe]).filter(Boolean);
          if (we.length < 3) return;
          const ce = [we[1][0] - we[0][0], we[1][1] - we[0][1], we[1][2] - we[0][2]], K = [we[2][0] - we[0][0], we[2][1] - we[0][1], we[2][2] - we[0][2]], Z = ce[1] * K[2] - ce[2] * K[1], V = ce[2] * K[0] - ce[0] * K[2], G = ce[0] * K[1] - ce[1] * K[0], X = Math.hypot(Z, V, G);
          if (X < 1e-12) return;
          const I = [Z / X, V / X, G / X], J = [], ue = (xe) => we.map((be) => [be[0] + I[0] * xe, be[1] + I[1] * xe, be[2] + I[2] * xe]), pe = Math.abs(I[2]) > 0.5, oe = I[2] > 0 ? -1 : 1, H = ue(pe ? 0 : +fe / 2), ge = ue(pe ? oe * fe : -fe / 2), te = (xe, be, _e2) => J.push(...xe, ...be, ..._e2);
          for (const xe of [H, ge]) te(xe[0], xe[1], xe[2]), xe.length === 4 && te(xe[0], xe[2], xe[3]);
          for (let xe = 0; xe < we.length; xe++) {
            const be = (xe + 1) % we.length;
            te(H[xe], ge[xe], ge[be]), te(H[xe], ge[be], H[be]);
          }
          const $e = new Ae();
          $e.setAttribute("position", new It(J, 3)), $e.computeVertexNormals(), v.add(new ct($e, P));
        }
      });
    } catch (se) {
      ae = String((se == null ? void 0 : se.message) ?? se);
    }
    globalThis.__extrusionDebug = { corridas: Y, on: B, fallo: ae, nElementos: U.length, nFormas: Q.size, nEspesores: q.size, mallas: v.children.length - 1 };
  }), v;
}
function Is(t, h, g = 0) {
  const v = [h[0] - t[0], h[1] - t[1], h[2] - t[2]], _ = Math.hypot(v[0], v[1], v[2]) || 1, C = v[0] / _, P = v[1] / _, F = v[2] / _, z = Math.sqrt(C * C + P * P);
  let $, Y, B;
  if (z < 1e-9) {
    const ee = F > 0 ? 1 : -1;
    $ = [0, 0, ee], Y = [1, 0, 0], B = [0, ee, 0];
  } else $ = [C, P, F], Y = [-C * F / z, -P * F / z, z], B = [P / z, -C / z, 0];
  if (Math.abs(g) > 1e-12) {
    const ee = g * Math.PI / 180, U = Math.cos(ee), he = Math.sin(ee), Q = Y.map((ae, se) => U * ae + he * B[se]), q = B.map((ae, se) => -he * Y[se] + U * ae);
    Y = Q, B = q;
  }
  return { e1: $, e2: Y, e3: B };
}
function Ca(t, h) {
  if (!h) return [0, 0];
  const g = Number(h[0] ?? 0), v = Number(h[1] ?? 0);
  return t === "bendingsY" ? [g, -v] : [-g, v];
}
function Ts(t, h) {
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
class Zo extends ut {
  constructor(h, g, v, _, C, P, F) {
    super();
    const z = new wo().moveTo(0, 0).lineTo(0, P[1]).lineTo(v, P[1]).lineTo(v, 0).lineTo(0, 0), $ = z.getPoints(), Y = new Ae().setFromPoints($);
    this.lines = new Et(Y, new ft({ color: Xn().resultOutline })), this.lines.position.set(...h), this.lines.rotation.setFromRotationMatrix(_), F && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const B = new Wo(z), ee = new wt({ color: P[1] > 0 ? 24435 : 11411474, side: Vt });
    this.mesh = new ct(B, ee), this.mesh.position.set(...h), this.mesh.rotation.setFromRotationMatrix(_), F && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Tt(`${C[1].toFixed(4)}`), this.normalizedResult = P, this.textPosition = xo([h, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(_), this.add(this.text);
  }
  updateScale(h) {
    this.lines.scale.set(1, h * 2, 1), this.mesh.scale.set(1, h * 2, 1), this.text.updateScale(h * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * h);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Sa extends ut {
  constructor(h, g, v, _, C, P, F) {
    super();
    const z = C[0] * v / (C[0] + C[1]), $ = C[0] * C[1] > 0;
    if (this.text = new Tt(`${C[0].toFixed(4)}`), this.text2 = new Tt(`${(C[1] * -1).toFixed(4)}`), this.normalizedResult = P, this.textPosition = za(h, g), this.text2Position = za(g, h), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(_), this.text2.rotation.setFromRotationMatrix(_), this.add(this.text, this.text2), $) {
      const Y = new wo().moveTo(0, 0).lineTo(0, P[0]).lineTo(z, 0).lineTo(0, 0), B = new wo().moveTo(z, 0).lineTo(v, -P[1]).lineTo(v, 0).lineTo(z, 0), ee = Y.getPoints(), U = B.getPoints(), he = new Ae().setFromPoints(ee), Q = new Ae().setFromPoints(U), q = new ft({ color: Xn().resultOutline });
      this.lines = new Et(he, q), this.lines2 = new Et(Q, q), this.lines.position.set(...h), this.lines2.position.set(...h), this.lines.rotation.setFromRotationMatrix(_), this.lines2.rotation.setFromRotationMatrix(_), F && this.lines.rotateX(Math.PI / 2), F && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new Wo(Y), se = new Wo(B), ye = new wt({ color: P[0] > 0 ? 24435 : 11411474, side: Vt }), fe = new wt({ color: -P[1] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new ct(ae, ye), this.mesh2 = new ct(se, fe), this.mesh.position.set(...h), this.mesh2.position.set(...h), this.mesh.rotation.setFromRotationMatrix(_), this.mesh2.rotation.setFromRotationMatrix(_), F && this.mesh.rotateX(Math.PI / 2), F && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const Y = new wo().moveTo(0, 0).lineTo(0, P[0]).lineTo(v, -P[1]).lineTo(v, 0).lineTo(0, 0), B = Y.getPoints(), ee = new Ae().setFromPoints(B);
      this.lines = new Et(ee, new ft({ color: Xn().resultOutline })), this.lines.position.set(...h), this.lines.rotation.setFromRotationMatrix(_), F && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const U = new Wo(Y), he = new wt({ color: P[0] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new ct(U, he), this.mesh.position.set(...h), this.mesh.rotation.setFromRotationMatrix(_), F && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var Rs = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Rs || {});
function Ji(t, h, g, v) {
  const _ = () => {
    const F = g.rawVal;
    if (!(F == null ? void 0 : F.length)) return 0.05 * h.gridSize.rawVal;
    const z = [1 / 0, 1 / 0, 1 / 0], $ = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of F) for (let ee = 0; ee < 3; ee++) B[ee] < z[ee] && (z[ee] = B[ee]), B[ee] > $[ee] && ($[ee] = B[ee]);
    const Y = Math.hypot($[0] - z[0], $[1] - z[1], $[2] - z[2]);
    return !isFinite(Y) || Y <= 0 ? 0.05 * h.gridSize.rawVal : 0.025 * Y;
  }, C = new ut(), P = { normals: Zo, shearsY: Zo, shearsZ: Zo, torsions: Zo, bendingsY: Sa, bendingsZ: Sa };
  return de.derive(() => {
    var _a2, _b;
    if (h.deformedShape.val, g.val, h.frameResults.val == "none") return;
    C.children.forEach((z) => z.dispose()), C.clear();
    const F = Rs[h.frameResults.rawVal];
    (_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal[F]) == null ? void 0 : _b.forEach((z, $) => {
      var _a3, _b2, _c, _d, _e, _f;
      const Y = ((_a3 = t.elements) == null ? void 0 : _a3.rawVal[$]) ?? [0, 1], B = g.rawVal[Y[0]], ee = g.rawVal[Y[1]];
      if (!B || !ee) return;
      const U = new E(...ee).distanceTo(new E(...B)), he = Oi((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[F]), Q = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, $)) ?? 0, q = Is(B, ee, Q), ae = Ts(F, q), se = new E(...q.e1), ye = new E(...ae), fe = new Oo().makeBasis(se, ye, se.clone().cross(ye)), [we, ce] = Ca(F, z), K = P[F] === Sa ? [we, -ce] : [we, ce], Z = K.map((G) => G / (he === 0 ? 1 : he)), V = new P[F](B, ee, U, fe, K, Z, false);
      V.updateScale(_() * v.rawVal), C.add(V);
    });
  }), de.derive(() => {
    if (v.val, h.frameResults.rawVal == "none") return;
    h.gridSize.val;
    const F = _();
    C.children.forEach((z) => z.updateScale(F * v.rawVal));
  }), de.derive(() => {
    C.visible = h.frameResults.val != "none";
  }), C;
}
function Oi(t) {
  let h = 0;
  return t == null ? void 0 : t.forEach((g) => {
    const v = Math.max(...(g ?? [0, 0]).map((_) => Math.abs(_)));
    v > h && (h = v);
  }), h;
}
class Qi extends ut {
  constructor(h, g, v) {
    super();
    const _ = g === Fa.reactions;
    v[0] && (this.xText1 = new Tt(`${_ ? "Fx" : "Dx"}: ` + v[0].toFixed(4))), v[3] && (this.xText2 = new Tt(`${_ ? "Mx" : "Rx"}: ` + v[3].toFixed(4))), v[1] && (this.yText1 = new Tt(`${_ ? "Fy" : "Dy"}: ` + v[1].toFixed(4))), v[4] && (this.yText2 = new Tt(`${_ ? "My" : "Ry"}: ` + v[4].toFixed(4))), v[2] && (this.zText1 = new Tt(`${_ ? "Fz" : "Dz"}: ` + v[2].toFixed(4))), v[5] && (this.zText2 = new Tt(`${_ ? "Mz" : "Rz"}: ` + v[5].toFixed(4))), (v[0] || v[3]) && (this.xArrow = new $n(new E(1, 0, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (v[1] || v[4]) && (this.yArrow = new $n(new E(0, 1, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (v[2] || v[5]) && (this.zArrow = new $n(new E(0, 0, 1), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...h), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(h) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(h, h, h), (_b = this.yArrow) == null ? void 0 : _b.scale.set(h, h, h), (_c = this.zArrow) == null ? void 0 : _c.scale.set(h, h, h), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * h, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * h, 0, 0.5 * h), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * h, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * h, 0.5 * h), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * h), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * h + 0.5 * h), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * h), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * h), (_l2 = this.yText1) == null ? void 0 : _l2.updateScale(0.4 * h), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * h), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * h), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * h);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var Fa = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(Fa || {});
function ji(t, h, g, v) {
  const _ = new ut();
  return de.derive(() => {
    var _a2, _b;
    if (h.deformedShape.val, h.nodeResults.val == "none") return;
    _.children.forEach((F) => F.dispose()), _.clear();
    const C = Fa[h.nodeResults.rawVal], P = 0.05 * h.gridSize.val;
    (_b = (_a2 = t.deformOutputs) == null ? void 0 : _a2.val[C]) == null ? void 0 : _b.forEach((F, z) => {
      const $ = new Qi(g.rawVal[z], C, F ?? [0, 0, 0, 0, 0, 0]);
      $.updateScale(P * v.rawVal), _.add($);
    });
  }), de.derive(() => {
    if (v.val, h.nodeResults.rawVal == "none") return;
    const C = 0.05 * h.gridSize.val;
    _.children.forEach((P) => P.updateScale(C * v.rawVal));
  }), de.derive(() => {
    _.visible = h.nodeResults.val != "none";
  }), _;
}
function el({ drawingObj: t, gridObj: h, scene: g, getActiveCamera: v, controls: _, gridSize: C, derivedDisplayScale: P, rendererElm: F, viewerRender: z }) {
  var _a2;
  const $ = new va(), Y = new ki(), B = (e) => {
    const n = F.getBoundingClientRect(), a = e.clientX - n.left, o = e.clientY - n.top, s = n.width || 1, c = n.height || 1;
    if (!!window.__hekatanSplitMode) {
      const l = s / 2;
      if (a >= l) return Y.x = (a - l) / l * 2 - 1, Y.y = -(o / c) * 2 + 1, window.__hekatanSplitCamera ?? v();
      Y.x = a / l * 2 - 1;
    } else Y.x = a / s * 2 - 1;
    return Y.y = -(o / c) * 2 + 1, v();
  }, ee = new ct(new An(1e4, 1e4), new wt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, g.add(ee);
  const U = (e, n, a) => {
    const o = new ct(new An(1e4, 1e4), new wt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
    return o.rotation.set(e, n, a), o.visible = false, o.frustumCulled = false, g.add(o), o;
  }, he = U(Math.PI / 2, 0, 0), Q = U(0, Math.PI / 2, 0);
  let q = false, ae = null, se = null, ye = null;
  const fe = new Et(new Ae(), new ft({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  fe.name = "ref-ifc-cadena", fe.renderOrder = 1e3, fe.frustumCulled = false, fe.visible = false, g.add(fe);
  const we = (e, n, a) => Math.round(e * 1e3) + "," + Math.round(n * 1e3) + "," + Math.round(a * 1e3), ce = (e) => {
    const n = /* @__PURE__ */ new Map();
    for (let a = 0; a + 0 < e.length / 6; a++) {
      const o = 6 * a;
      for (const s of [we(e[o], e[o + 1], e[o + 2]), we(e[o + 3], e[o + 4], e[o + 5])]) {
        const c = n.get(s);
        c ? c.push(a) : n.set(s, [a]);
      }
    }
    return n;
  }, K = (e) => {
    const { S: n, adj: a } = e, o = (x, b) => new E(n[6 * x + 3 * b], n[6 * x + 3 * b + 1], n[6 * x + 3 * b + 2]), s = /* @__PURE__ */ new Set([e.s]), c = (x, b) => {
      const L = [];
      let S = x, A = b;
      for (let T = 0; T < 3e3; T++) {
        const N = (a.get(we(A.x, A.y, A.z)) || []).filter((De) => !s.has(De));
        if (N.length !== 1) break;
        const D = N[0], W = o(D, 0), j = o(D, 1), me = W.distanceTo(A) < j.distanceTo(A) ? j : W, ve = A.clone().sub(S).normalize(), We = me.clone().sub(A).normalize();
        if (ve.dot(We) < Math.cos(35 * Math.PI / 180)) break;
        s.add(D), L.push(me), S = A, A = me;
      }
      return L;
    }, i = o(e.s, 0), l = o(e.s, 1), r = c(i, l), p = c(l, i), d = [...p.reverse(), i, l, ...r], w = p.length;
    if (d.length < 6) return d;
    const f = [], m = [];
    for (let x = 1; x < d.length; x++) f.push(d[x].distanceTo(d[x - 1]));
    for (let x = 1; x < d.length - 1; x++) {
      const b = d[x].clone().sub(d[x - 1]).normalize(), L = d[x + 1].clone().sub(d[x]).normalize();
      m.push(Math.acos(Math.max(-1, Math.min(1, b.dot(L)))) / Math.max(1e-6, (f[x - 1] + f[x]) / 2));
    }
    const M = m.map((x, b) => {
      let L = 0, S = 0;
      for (let A = b - 1; A <= b + 1; A++) A >= 0 && A < m.length && (L += m[A], S++);
      return L / S;
    }), k = [];
    for (let x = 3; x < M.length - 3; x++) {
      const b = (M[x - 3] + M[x - 2] + M[x - 1]) / 3, L = (M[x + 1] + M[x + 2] + M[x + 3]) / 3, S = Math.min(b, L), A = Math.max(b, L);
      A > 0.03 && A / Math.max(S, 1e-6) > 2.2 && Math.abs(M[x] - (b + L) / 2) < A && (!k.length || x - k[k.length - 1] > 3) && k.push(x + 1);
    }
    let y = 0, u = d.length - 1;
    for (const x of k) x <= w && x > y && (y = x), x > w && x < u && (u = x);
    return d.slice(y, u + 1);
  }, Z = (e) => {
    if (ye = e, !e || e.length < 2) {
      fe.visible = false;
      return;
    }
    fe.geometry.dispose(), fe.geometry = new Ae().setFromPoints(e), fe.visible = true;
  }, V = (e) => {
    let n = 0;
    for (let w = 1; w < e.length - 1; w++) {
      const f = e[w].clone().sub(e[w - 1]).normalize(), m = e[w + 1].clone().sub(e[w]).normalize();
      n += Math.acos(Math.max(-1, Math.min(1, f.dot(m))));
    }
    const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (n < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const o = String(window.__hekatanArcModo ?? "angulo"), s = o === "x" ? 0 : o === "y" ? 1 : o === "z" ? 2 : -1, c = [0];
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
    }, l = [], r = s >= 0 ? e[0].getComponent(s) : 0, p = s >= 0 ? e[e.length - 1].getComponent(s) : 0, d = s >= 0 && Math.abs(p - r) > 1e-6 && e.every((w, f) => f === 0 || (w.getComponent(s) - e[f - 1].getComponent(s)) * (p - r) >= -1e-6);
    for (let w = 0; w <= a; w++) {
      const f = d ? i((m) => m.getComponent(s), r + (p - r) * w / a) : i((m, M) => c[M], c[c.length - 1] * w / a);
      l.push([f.x, f.y, f.z]);
    }
    return l[0] = e[0].toArray(), l[a] = e[e.length - 1].toArray(), l;
  };
  window.__hekatanCadenaIfc = () => (ye || []).map((e) => [e.x, e.y, e.z]);
  const G = /* @__PURE__ */ new Map(), X = (e) => {
    const n = G.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(o * 9), c = new Float64Array(o * 3), i = new Int32Array(o * 3).fill(-1);
    if (a) {
      e.updateMatrixWorld();
      const r = new E();
      for (let M = 0; M < o * 3; M++) r.fromBufferAttribute(a, M).applyMatrix4(e.matrixWorld), s[3 * M] = r.x, s[3 * M + 1] = r.y, s[3 * M + 2] = r.z;
      const p = new E(), d = new E(), w = new E(), f = (M) => Math.round(s[3 * M] * 1e3) + "," + Math.round(s[3 * M + 1] * 1e3) + "," + Math.round(s[3 * M + 2] * 1e3), m = /* @__PURE__ */ new Map();
      for (let M = 0; M < o; M++) {
        const k = 3 * M;
        p.set(s[3 * (k + 1)] - s[3 * k], s[3 * (k + 1) + 1] - s[3 * k + 1], s[3 * (k + 1) + 2] - s[3 * k + 2]), d.set(s[3 * (k + 2)] - s[3 * k], s[3 * (k + 2) + 1] - s[3 * k + 1], s[3 * (k + 2) + 2] - s[3 * k + 2]), w.crossVectors(p, d).normalize(), c[3 * M] = w.x, c[3 * M + 1] = w.y, c[3 * M + 2] = w.z;
        for (let y = 0; y < 3; y++) {
          const u = f(k + y), x = f(k + (y + 1) % 3), b = u < x ? u + "|" + x : x + "|" + u, L = m.get(b);
          L ? L.push(M, y) : m.set(b, [M, y]);
        }
      }
      for (const M of m.values()) M.length === 4 && (i[3 * M[0] + M[1]] = M[2], i[3 * M[2] + M[3]] = M[0]);
    }
    const l = { V: s, N: c, vec: i, n: o };
    return G.set(e.id, l), l;
  }, I = new ct(new Ae(), new wt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Vt }));
  I.name = "ref-ifc-cara", I.renderOrder = 999, I.frustumCulled = false, I.visible = false, g.add(I);
  let J = null;
  const ue = (e, n) => {
    const a = Math.cos(12 * Math.PI / 180), o = Math.cos(80 * Math.PI / 180), s = [e.N[3 * n], e.N[3 * n + 1], e.N[3 * n + 2]], c = new Uint8Array(e.n), i = [], l = [n];
    for (c[n] = 1; l.length && i.length < 4e4; ) {
      const r = l.pop();
      i.push(r);
      for (let p = 0; p < 3; p++) {
        const d = e.vec[3 * r + p];
        if (d < 0 || c[d]) continue;
        const w = e.N[3 * r] * e.N[3 * d] + e.N[3 * r + 1] * e.N[3 * d + 1] + e.N[3 * r + 2] * e.N[3 * d + 2], f = s[0] * e.N[3 * d] + s[1] * e.N[3 * d + 1] + s[2] * e.N[3 * d + 2];
        w >= a && f >= o && (c[d] = 1, l.push(d));
      }
    }
    return i;
  }, pe = (e, n, a) => {
    if (!e || n < 0 || !a) {
      J && (J = null, I.visible = false);
      return;
    }
    if (J && J.m === e && J.tris.indexOf(n) >= 0) {
      J.punto = a.clone();
      return;
    }
    const o = X(e), s = ue(o, n), c = new Float32Array(s.length * 9), i = new E();
    let l = true;
    s.forEach((r, p) => {
      for (let d = 0; d < 9; d++) c[9 * p + d] = o.V[9 * r + d];
      i.x += o.N[3 * r], i.y += o.N[3 * r + 1], i.z += o.N[3 * r + 2];
    }), i.normalize();
    for (const r of s) if (i.x * o.N[3 * r] + i.y * o.N[3 * r + 1] + i.z * o.N[3 * r + 2] < Math.cos(5 * Math.PI / 180)) {
      l = false;
      break;
    }
    I.geometry.dispose(), I.geometry = new Ae(), I.geometry.setAttribute("position", new xt(c, 3)), I.material.color.set(l ? 3718648 : 16096779), I.visible = true, J = { m: e, t0: n, tris: s, normal: i, plana: l, punto: a.clone() };
  }, oe = (e, n) => {
    const a = new Uint8Array(e.n);
    for (const d of n) a[d] = 1;
    const o = (d) => Math.round(e.V[3 * d] * 1e3) + "," + Math.round(e.V[3 * d + 1] * 1e3) + "," + Math.round(e.V[3 * d + 2] * 1e3), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
    for (const d of n) for (let w = 0; w < 3; w++) {
      const f = e.vec[3 * d + w];
      if (f >= 0 && a[f]) continue;
      const m = 3 * d + w, M = 3 * d + (w + 1) % 3, k = o(m), y = o(M);
      c.set(k, new E(e.V[3 * m], e.V[3 * m + 1], e.V[3 * m + 2])), c.set(y, new E(e.V[3 * M], e.V[3 * M + 1], e.V[3 * M + 2])), (s.get(k) || s.set(k, []).get(k)).push(y), (s.get(y) || s.set(y, []).get(y)).push(k);
    }
    const i = /* @__PURE__ */ new Set();
    let l = [];
    for (const d of s.keys()) {
      if (i.has(d)) continue;
      const w = [d];
      i.add(d);
      let f = "", m = d;
      for (let M = 0; M < 1e5; M++) {
        const k = (s.get(m) || []).find((y) => y !== f && !i.has(y));
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
  }, H = (e, n, a) => {
    const s = new va(n.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
    return s.length ? s[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, n, a, o = 2) => {
    const s = new E(e[0], e[1], e[2]), c = new E(n[0], n[1], n[2]).normalize();
    let i = null;
    for (const l of [1, -1]) {
      const p = new va(s, c.clone().multiplyScalar(l), 0, o).intersectObjects(a, false);
      p.length && (i == null || p[0].distance < i) && (i = p[0].distance);
    }
    return i;
  }, window.__hekatanCaraIfc = () => J ? { tris: J.tris.length, plana: J.plana, normal: J.normal.toArray(), punto: J.punto.toArray(), contorno: oe(X(J.m), J.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const ge = /* @__PURE__ */ new Map(), te = new jt(new Ae(), new ft({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  te.name = "ref-ifc-bordes", te.frustumCulled = false, te.visible = false, g.add(te);
  const $e = 1, xe = (e, n, a) => Math.floor(e / $e) + "," + Math.floor(n / $e) + "," + Math.floor(a / $e), be = (e) => {
    const n = ge.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = [], s = /* @__PURE__ */ new Map();
    if (a) {
      e.updateMatrixWorld();
      const i = Math.floor(a.count / 3), l = new Float64Array(a.count * 3), r = new E();
      for (let y = 0; y < a.count; y++) r.fromBufferAttribute(a, y).applyMatrix4(e.matrixWorld), l[3 * y] = r.x, l[3 * y + 1] = r.y, l[3 * y + 2] = r.z;
      const p = (y) => Math.round(l[3 * y] * 1e3) + "," + Math.round(l[3 * y + 1] * 1e3) + "," + Math.round(l[3 * y + 2] * 1e3), d = new Float64Array(i * 3), w = new E(), f = new E(), m = new E();
      for (let y = 0; y < i; y++) {
        const u = 3 * y, x = 3 * y + 1, b = 3 * y + 2;
        w.set(l[3 * x] - l[3 * u], l[3 * x + 1] - l[3 * u + 1], l[3 * x + 2] - l[3 * u + 2]), f.set(l[3 * b] - l[3 * u], l[3 * b + 1] - l[3 * u + 1], l[3 * b + 2] - l[3 * u + 2]), m.crossVectors(w, f).normalize(), d[3 * y] = m.x, d[3 * y + 1] = m.y, d[3 * y + 2] = m.z;
      }
      const M = /* @__PURE__ */ new Map();
      for (let y = 0; y < i; y++) for (let u = 0; u < 3; u++) {
        const x = 3 * y + u, b = 3 * y + (u + 1) % 3, L = p(x), S = p(b), A = L < S ? L + "|" + S : S + "|" + L, T = M.get(A);
        T ? T.push(y) : M.set(A, [y, x, b]);
      }
      const k = Math.cos(25 * Math.PI / 180);
      for (const y of M.values()) {
        const u = y[0], x = y[1], b = y[2];
        let L = y.length === 3;
        if (!L && y.length === 4) {
          const A = y[3], T = d[3 * u] * d[3 * A] + d[3 * u + 1] * d[3 * A + 1] + d[3 * u + 2] * d[3 * A + 2];
          L = Math.abs(T) < k;
        }
        if (!L) continue;
        const S = o.length / 6;
        o.push(l[3 * x], l[3 * x + 1], l[3 * x + 2], l[3 * b], l[3 * b + 1], l[3 * b + 2]);
        for (const [A, T, N] of [[l[3 * x], l[3 * x + 1], l[3 * x + 2]], [l[3 * b], l[3 * b + 1], l[3 * b + 2]], [(l[3 * x] + l[3 * b]) / 2, (l[3 * x + 1] + l[3 * b + 1]) / 2, (l[3 * x + 2] + l[3 * b + 2]) / 2]]) {
          const D = xe(A, T, N), W = s.get(D);
          W ? W[W.length - 1] !== S && W.push(S) : s.set(D, [S]);
        }
      }
    }
    const c = { segs: new Float32Array(o), celdas: s };
    return ge.set(e.id, c), c;
  };
  let _e = "";
  const Be = (e) => {
    const n = e.map((i) => i.id).join(",");
    if (n === _e) return;
    _e = n;
    const a = e.map((i) => be(i).segs);
    let o = 0;
    for (const i of a) o += i.length;
    const s = new Float32Array(o);
    let c = 0;
    for (const i of a) s.set(i, c), c += i.length;
    te.geometry.dispose(), te.geometry = new Ae(), te.geometry.setAttribute("position", new xt(s, 3)), te.visible = o > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    te.visible = _e !== "" && window.__hekatanRefIfcBordes !== false, z();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const n of ge.values()) e += n.segs.length / 6;
    return e;
  };
  const Pe = (e, n) => {
    const a = window.__hekatanCursorPx;
    if (!a) return null;
    const o = be(e), s = o.segs, c = Math.floor(n.x / $e), i = Math.floor(n.y / $e), l = Math.floor(n.z / $e), r = /* @__PURE__ */ new Set();
    let p = zn, d = null, w = zn, f = null, m = -1;
    const M = new E(), k = new E();
    for (let y = -1; y <= 1; y++) for (let u = -1; u <= 1; u++) for (let x = -1; x <= 1; x++) {
      const b = o.celdas.get(c + y + "," + (i + u) + "," + (l + x));
      if (b) for (const L of b) {
        if (r.has(L)) continue;
        r.add(L);
        const S = 6 * L;
        M.set(s[S], s[S + 1], s[S + 2]), k.set(s[S + 3], s[S + 4], s[S + 5]);
        const A = Bn(M.x, M.y, M.z), T = Bn(k.x, k.y, k.z);
        if (!A || !T) continue;
        const N = Math.hypot(A.x - a.x, A.y - a.y), D = Math.hypot(T.x - a.x, T.y - a.y);
        N < p && (p = N, d = M.clone()), D < p && (p = D, d = k.clone());
        const W = T.x - A.x, j = T.y - A.y, me = W * W + j * j || 1e-9;
        let ve = ((a.x - A.x) * W + (a.y - A.y) * j) / me;
        ve = Math.max(0, Math.min(1, ve));
        const We = Math.hypot(a.x - (A.x + ve * W), a.y - (A.y + ve * j));
        We < w && (w = We, f = M.clone().lerp(k, ve), m = L);
      }
    }
    return m >= 0 && (o.adj || (o.adj = ce(o.segs)), se = { S: o.segs, adj: o.adj, s: m }), d ? { tipo: "ifcVert", punto: d } : f ? { tipo: "ifcEdge", punto: f } : null;
  }, nt = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((c) => {
      var _a4;
      ((_a4 = c.userData) == null ? void 0 : _a4.refIfc) && c.isMesh && e.push(c);
    }), !e.length) return te.visible = false, _e = "", null;
    Be(e);
    const n = $.intersectObjects(e, false).filter((c) => {
      const i = c.object.material;
      return (i && i.clippingPlanes || []).every((r) => r.distanceToPoint(c.point) >= 0);
    });
    if (!n.length) return null;
    const a = n[0], o = n[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? pe(a.object, a.faceIndex ?? -1, a.point) : J && pe(null, -1, null);
    const s = Pe(a.object, a.point);
    if (s) return ae = { tipo: s.tipo }, [{ ...a, point: s.punto }];
    if (o && o.object === a.object && o.distance - a.distance <= 1.2) {
      const c = a.point.clone().add(o.point).multiplyScalar(0.5);
      return ae = { tipo: "ifcAxis" }, [{ ...a, point: c }];
    }
    return ae = { tipo: "ifc" }, [a];
  };
  let st = "", Ne = new Float32Array(0);
  const R = new jt(new Ae(), new ft({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  R.name = "ref-ifc-seccion", R.renderOrder = 998, R.frustumCulled = false, R.visible = false, g.add(R);
  const O = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return R.visible = false, Ne = new Float32Array(0);
    const n = [];
    e.enableX && n.push([0, +e.posX]), e.enableY && n.push([1, +e.posY]), e.enableZ && n.push([2, +e.posZ]);
    const a = [];
    g.traverse((c) => {
      var _a3;
      ((_a3 = c.userData) == null ? void 0 : _a3.refIfc) && c.isMesh && a.push(c);
    });
    const o = JSON.stringify(n) + "|" + a.map((c) => c.id).join(",");
    if (o === st) return Ne;
    st = o;
    const s = [];
    if (n.length && a.length) {
      const c = [new E(), new E(), new E()];
      for (const i of a) {
        const l = i.geometry.getAttribute("position");
        if (l) {
          i.updateMatrixWorld();
          for (let r = 0; r + 2 < l.count; r += 3) {
            for (let p = 0; p < 3; p++) c[p].fromBufferAttribute(l, r + p).applyMatrix4(i.matrixWorld);
            for (const [p, d] of n) {
              const w = [c[0].getComponent(p) - d, c[1].getComponent(p) - d, c[2].getComponent(p) - d], f = [];
              for (let m = 0; m < 3; m++) {
                const M = c[m], k = c[(m + 1) % 3], y = w[m], u = w[(m + 1) % 3];
                (y < 0 && u >= 0 || y >= 0 && u < 0) && f.push(M.clone().lerp(k, y / (y - u)));
              }
              f.length === 2 && s.push(f[0].x, f[0].y, f[0].z, f[1].x, f[1].y, f[1].z);
            }
          }
        }
      }
    }
    return Ne = new Float32Array(s), R.geometry.dispose(), R.geometry = new Ae(), R.geometry.setAttribute("position", new xt(Ne, 3)), R.visible = Ne.length > 0, Ne;
  };
  let le = null, ie = null;
  const Me = (e, n) => {
    const a = O();
    if (!a.length) return null;
    let o = zn * 2, s = null, c = -1;
    const i = new E(), l = new E();
    for (let r = 0; r + 5 < a.length; r += 6) {
      i.set(a[r], a[r + 1], a[r + 2]), l.set(a[r + 3], a[r + 4], a[r + 5]);
      const p = Bn(i.x, i.y, i.z), d = Bn(l.x, l.y, l.z);
      if (!p || !d) continue;
      const w = d.x - p.x, f = d.y - p.y, m = w * w + f * f || 1e-9;
      let M = ((e - p.x) * w + (n - p.y) * f) / m;
      M = Math.max(0, Math.min(1, M));
      const k = Math.hypot(e - (p.x + M * w), n - (p.y + M * f));
      k < o && (o = k, s = i.clone().lerp(l, M), c = r / 6);
    }
    return c >= 0 && (ie !== a && (le = ce(a), ie = a), se = { S: a, adj: le, s: c }), s;
  };
  let Se = null;
  window.__hekatanSeccionIfc = () => O().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const n = O(), a = [], o = Math.max(1, Math.floor(n.length / 6 / e));
    for (let s = 0; s + 2 < n.length; s += 6 * o) a.push([n[s], n[s + 1], n[s + 2]]);
    return a;
  };
  const Re = () => {
    ae = null;
    const e = nt();
    if (e) return e;
    if (q) return $.intersectObjects([ee], false);
    if (he.visible = !!window.__hekatanGridPlaneXZ, Q.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Zt.visible) {
      const o = $.intersectObjects([Zt, Wt, cn], false);
      if (o.length > 0) return o;
    }
    const a = [ee];
    return he.visible && a.push(he), Q.visible && a.push(Q), _n.visible && qn.length > 0 && a.push(...qn), $.intersectObjects(a, false);
  }, Ee = new Go(new Ae(), new Ko()), He = new Go(new Ae(), new Ko({ color: "gray", sizeAttenuation: false, size: 6 })), Ze = new Go(new Ae(), new Ko({ color: "orange", sizeAttenuation: false, size: 5 }));
  g.add(Ze);
  const ke = document.createElement("input");
  ke.id = "hk-rubber-label", ke.type = "text", ke.spellcheck = false, ke.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, ke.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(ke);
  const Te = document.createElement("div");
  Te.id = "hk-rubber-angle", Te.style.cssText = ["position:fixed", "z-index:99996", "pointer-events:none", "padding:2px 6px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px", "font-family:Consolas,monospace", "font-size:12px", "transform:translate(-50%,0)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Te);
  let Ye = null, lt = null, je = false;
  const gt = new E(), yt = (e, n, a, o, s, c) => {
    const i = o - e, l = s - n, r = c - a, p = Math.hypot(i, l, r);
    if (p < 0.01) {
      ke.style.display = "none";
      return;
    }
    Ye = [e, n, a], lt = [i / p, l / p, r / p], gt.set((e + o) / 2, (n + s) / 2, (a + c) / 2), gt.project(v());
    const d = F.getBoundingClientRect(), w = d.left + (gt.x * 0.5 + 0.5) * d.width, f = d.top + (-gt.y * 0.5 + 0.5) * d.height;
    ke.style.left = w + "px", ke.style.top = f + "px", ke.style.display = "block";
    const m = new E(e, n, a).project(v()), M = new E(o, s, c).project(v()), k = d.left + (m.x * 0.5 + 0.5) * d.width, y = d.top + (-m.y * 0.5 + 0.5) * d.height, u = d.left + (M.x * 0.5 + 0.5) * d.width, x = d.top + (-M.y * 0.5 + 0.5) * d.height;
    let b = Math.atan2(-(x - y), u - k) * 180 / Math.PI;
    if (b < 0 && (b += 360), Te.textContent = `${Math.round(b) % 360}\xB0`, Te.style.left = u + "px", Te.style.top = x + 34 + "px", Te.style.display = "block", !je) {
      if (ke.value = `${p.toFixed(2)} m`, document.activeElement !== ke) {
        const L = document.activeElement;
        L && (L.tagName === "INPUT" || L.tagName === "TEXTAREA") && L !== ke || ke.focus({ preventScroll: true });
      }
      try {
        ke.select();
      } catch {
      }
    }
  }, pn = () => {
    ke.style.display = "none", Te.style.display = "none", Ye = null, lt = null, je = false, document.activeElement === ke && ke.blur();
  }, _t = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (n === "offset") {
      Nn = e, re(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), ke.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (n === "circle" && Ke.length === 1) {
      const d = Ke[0];
      Ke = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, d[0], d[1], d[2], e), re(`\u2713 C\xEDrculo r=${e} m en (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}).`);
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
      Ct = e, re(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[n]}.`), ke.blur();
      return;
    }
    if (!Ye || !lt || !t.polylines) return;
    let a = lt[0], o = lt[1], s = lt[2];
    zt === "x" ? (a = Math.sign(a) || 1, o = 0, s = 0) : zt === "y" ? (a = 0, o = Math.sign(o) || 1, s = 0) : zt === "z" && (a = 0, o = 0, s = Math.sign(s) || 1);
    const c = Ye[0] + a * e, i = Ye[1] + o * e, l = Ye[2] + s * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [c, i, l]];
    const r = t.polylines.rawVal, p = r.length ? r[r.length - 1] : [];
    t.polylines.val = [...r.slice(0, -1), [...p, t.points.rawVal.length - 1]], ke.blur();
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
      const s = n.split("<").map((c) => parseFloat(c.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [c, i] = s;
        return a ? { kind: "relPolar", L: c, ang: i } : { kind: "absPolar", L: c, ang: i };
      }
      if (s.length === 3 && a) {
        const [c, i, l] = s;
        return { kind: "relSpherical", L: c, az: i, el: l };
      }
      return null;
    }
    if (n.includes(",")) {
      const s = n.split(",").map((r) => parseFloat(r.trim()));
      if (s.some(isNaN)) return null;
      const [c, i, l = 0] = s;
      return a ? { kind: "relCart", dx: c, dy: i, dz: l } : { kind: "absCart", x: c, y: i, z: l };
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
  }, Qe = (e) => {
    var _a3, _b;
    if (!t.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, e];
    const n = t.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    t.polylines.val = [...n.slice(0, -1), [...a, t.points.rawVal.length - 1]], Ye = e, ke.blur();
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
    is(new E(a[0], a[1], a[2]), null), Ye = a, ke.blur();
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
      if (je = false, a.kind === "length") _t(a.L), re(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const o = ot(a);
        if (!o) return;
        Qe(o);
        const s = a.kind;
        re(`\u270F ${s} \u2192 (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)})`);
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
  const qe = new Et(new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new eo({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  qe.frustumCulled = false, qe.visible = false, qe.name = "rubberBand", g.add(qe), window.__hekatanRubberBand = qe;
  const Ie = new Et(new Ae(), new ft({ color: 2282478, transparent: true, opacity: 0.9 }));
  Ie.frustumCulled = false, Ie.visible = false, g.add(Ie);
  let at = [];
  const it = new Et(new Ae(), new ft({ color: 16763904, transparent: true, opacity: 0.95 }));
  it.frustumCulled = false, it.visible = false, it.renderOrder = 999, g.add(it);
  let pt = [];
  const et = document.createElement("div");
  et.id = "hk-measure-label", et.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(et);
  const rt = (e) => {
    var _a3, _b;
    const n = B(e);
    if (!n) return null;
    $.setFromCamera(Y, n);
    let a = null, o = null;
    const s = $.intersectObjects(g.children, true).filter((f) => f.object.isMesh && f.object !== bt && f.object !== dt && f.object.visible !== false);
    if (s.length) {
      const f = s[0], m = f.point;
      a = [m.x, m.y, m.z];
      const k = (_b = (_a3 = f.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      k && f.face && (o = [f.face.a, f.face.b, f.face.c].map((y) => {
        const u = new E().fromBufferAttribute(k, y);
        return f.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const f = Re();
      if (f.length) {
        const m = f[0].point;
        a = [m.x, m.y, m.z];
      }
    }
    if (!a) return null;
    const c = F.getBoundingClientRect(), i = (f) => {
      const m = new E(f[0], f[1], f[2]).project(n);
      return [c.left + (m.x * 0.5 + 0.5) * c.width, c.top + (-m.y * 0.5 + 0.5) * c.height];
    }, l = [e.clientX, e.clientY], r = 14;
    let p = a, d = r;
    const w = (f) => {
      const m = i(f), M = Math.hypot(m[0] - l[0], m[1] - l[1]);
      M < d && (d = M, p = f);
    };
    for (const f of o ?? []) w(f);
    for (const f of t.points.rawVal) w(f);
    return p;
  }, Ft = () => {
    if (pt.length < 1) {
      et.style.display = "none";
      return;
    }
    const e = v(), n = pt[0], a = pt[1] ?? pt[0], s = new E((n[0] + a[0]) / 2, (n[1] + a[1]) / 2, (n[2] + a[2]) / 2).clone().project(e), c = F.getBoundingClientRect();
    et.style.left = c.left + (s.x * 0.5 + 0.5) * c.width + "px", et.style.top = c.top + (-s.y * 0.5 + 0.5) * c.height - 14 + "px", et.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Ft, window.__hekatanClearMeasure = () => {
    pt = [], it.visible = false, et.style.display = "none";
    try {
      z();
    } catch {
    }
  };
  try {
    (_a2 = _.addEventListener) == null ? void 0 : _a2.call(_, "change", Ft);
  } catch {
  }
  const dt = new ct(new Ae(), new wt({ color: 16096779, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }));
  dt.frustumCulled = false, dt.visible = false, dt.renderOrder = 998, dt.name = "hk-fill-preview", g.add(dt), F.addEventListener("pointerleave", () => {
    ze.style.display = "none", dt.visible && (dt.visible = false, z());
  });
  const Kt = (e) => {
    var _a3, _b, _c, _d;
    const n = t.points.rawVal, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Map(), s = (y, u) => {
      y !== u && ((o.get(y) ?? o.set(y, /* @__PURE__ */ new Set()).get(y)).add(u), (o.get(u) ?? o.set(u, /* @__PURE__ */ new Set()).get(u)).add(y));
    };
    for (const y of a) for (let u = 0; u + 1 < y.length; u++) s(y[u], y[u + 1]);
    const c = (y, u) => {
      var _a4;
      return !!((_a4 = o.get(y)) == null ? void 0 : _a4.has(u));
    }, i = [], l = /* @__PURE__ */ new Set(), r = [...o.keys()];
    for (const y of r) for (const u of o.get(y)) if (!(u < y)) {
      for (const x of o.get(u)) if (x !== y) for (const b of o.get(x)) {
        if (b === y || b === u || !c(b, y) || c(y, x) || c(u, b)) continue;
        const L = [y, u, x, b].slice().sort((S, A) => S - A).join("-");
        l.has(L) || (l.add(L), i.push([y, u, x, b]));
      }
    }
    for (const y of r) for (const u of o.get(y)) if (!(u < y)) for (const x of o.get(u)) {
      if (x === y || !c(x, y)) continue;
      const b = [y, u, x].slice().sort((L, S) => L - S).join("-");
      l.has(b) || (l.add(b), i.push([y, u, x]));
    }
    const p = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", d = (y) => p === "xy" ? [y[0], y[1]] : p === "xz" ? [y[0], y[2]] : [y[1], y[2]], w = d(e), f = (y, u) => {
      let x = false;
      for (let b = 0, L = u.length - 1; b < u.length; L = b++) {
        const S = u[b][0], A = u[b][1], T = u[L][0], N = u[L][1];
        A > y[1] != N > y[1] && y[0] < (T - S) * (y[1] - A) / (N - A) + S && (x = !x);
      }
      return x;
    }, m = (y) => {
      let u = 0;
      for (let x = 0, b = y.length - 1; x < y.length; b = x++) u += (y[b][0] + y[x][0]) * (y[b][1] - y[x][1]);
      return Math.abs(u) / 2;
    };
    let M = null, k = 1 / 0;
    for (const y of i) {
      const u = y.map((b) => d(n[b]));
      if (!f(w, u)) continue;
      const x = m(u);
      x < k && (k = x, M = y);
    }
    return M;
  }, kt = new ut(), Yt = new ct(new An(1, 1), new wt({ color: 2282478, transparent: true, opacity: 0.08, side: Vt, depthWrite: false })), en = new jt(new fs(new An(1, 1)), new ft({ color: 2282478, transparent: true, opacity: 0.85 })), Pt = new jt(new Ae(), new ft({ color: 2282478, transparent: true, opacity: 0.3 })), bo = (e, n) => {
    const a = [], o = Math.ceil(e / n);
    for (let s = -o; s <= o; s++) {
      const c = s * n;
      a.push(-e, c, 0, e, c, 0), a.push(c, -e, 0, c, e, 0);
    }
    Pt.geometry.dispose(), Pt.geometry = new Ae(), Pt.geometry.setAttribute("position", new It(a, 3));
  };
  kt.add(Yt, en, Pt), kt.visible = false, kt.frustumCulled = false, g.add(kt);
  const Xt = new ut();
  Xt.frustumCulled = false, Xt.visible = false, g.add(Xt);
  const Ln = (e) => {
    const n = new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), a = new eo({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Et(n, a);
  }, bn = Ln(16711680), fn = Ln(65280), Vn = Ln(35071);
  Xt.add(bn, fn, Vn);
  const Un = [], jo = (e) => e.traverse((n) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = n.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Ut = Ln(16761856);
  Ut.material.dashSize = 0.28, Ut.material.gapSize = 0.16, Ut.material.opacity = 0.9, Ut.frustumCulled = false, Ut.visible = false, Ut.renderOrder = 98, g.add(Ut);
  const no = (e) => {
    const n = new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0)]), a = new ft({ color: e, transparent: true, opacity: 0.2, depthTest: false }), o = new Cs(n, a);
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
      const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], c = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0], i = window.__hekatanOrthoExt ?? 8;
      vn(In, c, "xy", i), vn(Zn, c, "xz", i), vn(Tn, c, "yz", i), Mn(Zt, c, "xy", i), Mn(Wt, c, "xz", i), Mn(cn, c, "yz", i), Zt.material.opacity = 0.05, Wt.material.opacity = 0.05, cn.material.opacity = 0.05;
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
    const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], c = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0];
    vn(In, c, "xy", e), vn(Zn, c, "xz", e), vn(Tn, c, "yz", e), Mn(Zt, c, "xy", e), Mn(Wt, c, "xz", e), Mn(cn, c, "yz", e), z();
  };
  const $a = (e) => {
    if (Zt.material.opacity = e === "xy" ? 0.09 : 0.025, Wt.material.opacity = e === "xz" ? 0.09 : 0.025, cn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      mn.style.background = s.bg, mn.style.color = s.text, mn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, mn.style.display = "block";
    } else mn.style.display = "none";
  }, vn = (e, n, a, o) => {
    let s;
    a === "xy" ? s = [new E(n[0] - o, n[1] - o, n[2]), new E(n[0] + o, n[1] - o, n[2]), new E(n[0] + o, n[1] + o, n[2]), new E(n[0] - o, n[1] + o, n[2]), new E(n[0] - o, n[1] - o, n[2])] : a === "xz" ? s = [new E(n[0] - o, n[1], n[2] - o), new E(n[0] + o, n[1], n[2] - o), new E(n[0] + o, n[1], n[2] + o), new E(n[0] - o, n[1], n[2] + o), new E(n[0] - o, n[1], n[2] - o)] : s = [new E(n[0], n[1] - o, n[2] - o), new E(n[0], n[1] + o, n[2] - o), new E(n[0], n[1] + o, n[2] + o), new E(n[0], n[1] - o, n[2] + o), new E(n[0], n[1] - o, n[2] - o)], e.geometry.setFromPoints(s);
  };
  let zt = null;
  window.__hekatanAxisLock = () => zt;
  let Mo = null, Rt = null;
  const Dt = document.createElement("div");
  Dt.id = "hk-axis-lock-badge", Dt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Dt);
  const La = () => {
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
      re(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") zt = zt === a ? null : a, La(), e.preventDefault();
    else if (e.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), ns(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || Ro(), re(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (Xt.visible = false), re(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
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
  const vo = new E(), _o = new E(), Va = new E(), Ds = (e) => {
    if (!zt) return null;
    const n = e[0], a = e[1], o = e[2];
    return zt === "x" ? (vo.set(n - 1e4, a, o), _o.set(n + 1e4, a, o)) : zt === "y" ? (vo.set(n, a - 1e4, o), _o.set(n, a + 1e4, o)) : (vo.set(n, a, o - 1e4), _o.set(n, a, o + 1e4)), $.ray.distanceSqToSegment(vo, _o, null, Va), Va;
  };
  window.__hekatanProjectOnAxis = Ds;
  const qt = new Et(new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new ft({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  qt.renderOrder = 998, qt.frustumCulled = false, qt.visible = false, g.add(qt);
  let dn = -1, Sn = -1, Pn = -1;
  const Ge = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ge;
  const wn = new Et(new Ae().setFromPoints([new E(), new E()]), new ft({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  wn.renderOrder = 997, wn.frustumCulled = false, wn.visible = false, g.add(wn);
  const tn = new ct(new to(0.02, 12, 12), new wt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  tn.renderOrder = 998, tn.visible = false, g.add(tn);
  const ko = (e) => {
    const n = v();
    if (n.isOrthographicCamera) {
      const o = n, s = (o.top - o.bottom) / o.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = n.position.distanceTo(e);
    return Math.max(0.05, a / 10);
  }, Ia = () => {
    tn.visible && tn.scale.setScalar(ko(tn.position));
  }, yn = new ut();
  yn.frustumCulled = false, g.add(yn);
  const So = 2282478;
  let xn = null;
  const Bs = (e, n, a, o) => {
    if (!t.points) return -1;
    const s = t.points.rawVal;
    let c = -1, i = o;
    for (let l = 0; l < s.length; l++) {
      const r = s[l];
      if (!r) continue;
      const p = Math.hypot(e - r[0], n - r[1], a - r[2]);
      p < i && (i = p, c = l);
    }
    return c;
  }, nn = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; yn.children.length; ) {
      const i = yn.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], n = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], o = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const i of Ge) {
      const [l, ...r] = i.split(":");
      if (l === "pt") {
        const p = e[+r[0]];
        if (!p) continue;
        const d = new ct(new to(0.025, 12, 12), new wt({ color: So, transparent: true, opacity: 0.9, depthTest: false }));
        d.position.set(p[0], p[1], p[2]), d.renderOrder = 999, d.__isSelectionPt = true, yn.add(d);
      } else if (l === "seg") {
        const p = n[+r[0]], d = e[p == null ? void 0 : p[+r[1]]], w = e[p == null ? void 0 : p[+r[1] + 1]];
        if (!d || !w) continue;
        const f = new Ae().setFromPoints([new E(d[0], d[1], d[2]), new E(w[0], w[1], w[2])]), m = new Et(f, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        m.renderOrder = 999, yn.add(m);
      } else if (l === "poly") {
        const d = n[+r[0]].map((m) => {
          const M = e[m];
          return M ? new E(M[0], M[1], M[2]) : null;
        }).filter(Boolean);
        if (d.length < 2) continue;
        const w = new Ae().setFromPoints(d), f = new Et(w, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, yn.add(f);
      } else if (l === "aux") {
        const p = o[+r[0]];
        if (!p || p.length !== 6) continue;
        const d = new Ae().setFromPoints([new E(p[0], p[1], p[2]), new E(p[3], p[4], p[5])]), w = new Et(d, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        w.renderOrder = 999, yn.add(w);
      }
    }
    const s = window.__hekatanUpdateSelectionPtScale;
    s && s();
    const c = window.__hekatanRefreshPropsPane;
    c && c();
    try {
      (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
    } catch {
    }
    z();
  };
  window.__hekatanRefreshSelection = nn, window.__hekatanSelectIds = (e) => {
    var _a3;
    Ge.clear();
    for (const n of e) Ge.add(n);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), Ge.size;
  }, window.__hekatanClearSelection = () => {
    Ge.clear(), nn();
  };
  const ao = (e, n, a, o, s, c, i, l, r) => {
    const p = i - o, d = l - s, w = r - c, f = p * p + d * d + w * w;
    if (f < 1e-12) return Math.hypot(e - o, n - s, a - c);
    let m = ((e - o) * p + (n - s) * d + (a - c) * w) / f;
    m = Math.max(0, Math.min(1, m));
    const M = o + m * p, k = s + m * d, y = c + m * w;
    return Math.hypot(e - M, n - k, a - y);
  }, ea = (e, n, a, o) => {
    if (!t.polylines) return null;
    const s = t.polylines.rawVal, c = t.points.rawVal;
    let i = -1, l = -1, r = o;
    for (let p = 0; p < s.length; p++) {
      const d = s[p];
      for (let w = 0; w < d.length - 1; w++) {
        const f = c[d[w]], m = c[d[w + 1]];
        if (!f || !m) continue;
        const M = ao(e, n, a, f[0], f[1], f[2], m[0], m[1], m[2]);
        M < r && (r = M, i = p, l = w);
      }
    }
    return i >= 0 ? { polyIdx: i, segIdx: l, dist: r } : null;
  }, Ta = (e, n, a, o) => {
    const s = window.__hekatanDrawingAuxLines, c = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let i = -1, l = o;
    for (let r = 0; r < c.length; r++) {
      const p = c[r];
      if (!p || p.length !== 6) continue;
      const d = ao(e, n, a, p[0], p[1], p[2], p[3], p[4], p[5]);
      d < l && (l = d, i = r);
    }
    return i;
  }, Ns = (e) => {
    const n = window.__hekatanDrawingAuxLines, o = ((n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [])[e];
    if (!o || o.length !== 6) {
      qt.visible = false;
      return;
    }
    qt.geometry.setFromPoints([new E(o[0], o[1], o[2]), new E(o[3], o[4], o[5])]), qt.visible = true;
  }, Ys = (e, n = -1) => {
    var _a3, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal[e], o = t.points.rawVal;
    if (!a || a.length < 2) {
      qt.visible = false;
      return;
    }
    const s = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, c = [];
    if (s || n < 0 || n >= a.length - 1) for (const i of a) {
      const l = o[i];
      l && c.push(new E(l[0], l[1], l[2]));
    }
    else {
      const i = o[a[n]], l = o[a[n + 1]];
      i && c.push(new E(i[0], i[1], i[2])), l && c.push(new E(l[0], l[1], l[2]));
    }
    qt.geometry.setFromPoints(c), qt.visible = true;
  }, Po = (e) => {
    var _a3;
    if (!t.polylines) return;
    const n = t.polylines.rawVal;
    if (e < 0 || e >= n.length) return;
    const a = n.filter((r, p) => p !== e), o = /* @__PURE__ */ new Set();
    for (const r of a) for (const p of r) o.add(p);
    const s = t.points.rawVal, c = /* @__PURE__ */ new Map(), i = [];
    for (let r = 0; r < s.length; r++) o.has(r) && (c.set(r, i.length), i.push(s[r]));
    const l = a.map((r) => r.map((p) => c.get(p)).filter((p) => p !== void 0));
    t.points.val = i, t.polylines.val = l, t.areas && (t.areas.val = t.areas.rawVal.filter((r) => r !== e).map((r) => r > e ? r - 1 : r)), qt.visible = false, dn = -1, Sn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, Ra = (e, n) => {
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
    let c;
    n === 0 ? c = [s.slice(1)] : n === s.length - 2 ? c = [s.slice(0, -1)] : c = [s.slice(0, n + 1), s.slice(n + 1)];
    const i = [...a.slice(0, e), ...c, ...a.slice(e + 1)], l = /* @__PURE__ */ new Set();
    for (const f of i) for (const m of f) l.add(m);
    const r = t.points.rawVal, p = /* @__PURE__ */ new Map(), d = [];
    for (let f = 0; f < r.length; f++) l.has(f) && (p.set(f, d.length), d.push(r[f]));
    const w = i.map((f) => f.map((m) => p.get(m)).filter((m) => m !== void 0));
    if (t.points.val = d, t.polylines.val = w, t.areas) {
      const f = c.length - 1;
      t.areas.val = t.areas.rawVal.map((m) => m > e ? m + f : m);
    }
    qt.visible = false, dn = -1, Sn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Ee.geometry.setAttribute("position", new It(t.points.rawVal.flat(), 3)), Ee.geometry.computeBoundingSphere(), Ee.frustumCulled = false, He.frustumCulled = false, g.add(He), ee.position.set(0, 0, 0), ee.rotateX(Math.PI / 2), ee.geometry.rotateX(Math.PI / 2), ee.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, n, a) => {
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
  let Da = [], Ba = "";
  const Na = () => {
    var _a3;
    const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = `${e.length}|${n.length}|${n.reduce((s, c) => s + c.length, 0)}`;
    if (a === Ba) return Da;
    Ba = a;
    const o = [];
    for (const s of n) {
      const c = s.length;
      if (c < 6 || s[0] !== s[c - 1]) continue;
      const i = s.slice(0, c - 1).map((d) => e[d]).filter(Boolean);
      if (i.length < 5) continue;
      const l = [0, 1, 2].map((d) => i.reduce((w, f) => w + f[d], 0) / i.length), r = i.map((d) => Math.hypot(d[0] - l[0], d[1] - l[1], d[2] - l[2])), p = r.reduce((d, w) => d + w, 0) / r.length;
      p < 1e-9 || r.some((d) => Math.abs(d - p) > 5e-3 * p) || o.push({ c: l, r: p });
    }
    return Da = o;
  };
  window.__hekatanCentrosDeducidos = Na;
  const Co = () => !!window.__hekatanCurvasAux, Ao = (e, n) => {
    const a = window.__hekatanDrawingAuxLines;
    if (!a) return 0;
    St();
    const o = a.rawVal ?? a.val ?? [], s = [];
    for (let c = 0; c + 1 < e.length; c++) s.push([...e[c], ...e[c + 1]]);
    return n && e.length > 2 && s.push([...e[e.length - 1], ...e[0]]), a.val = [...o, ...s], s.length;
  };
  window.__hekatanDrawCircle = (e, n, a, o, s = window.__hekatanArcSegs ?? 12, c = "xy") => {
    var _a3;
    const i = Math.max(4, Math.round(s)), l = t.points.rawVal.length, r = [];
    for (let p = 0; p < i; p++) {
      const d = 2 * Math.PI * p / i, w = o * Math.cos(d), f = o * Math.sin(d);
      let m;
      c === "xy" ? m = [e + w, n + f, a] : c === "xz" ? m = [e + w, n, a + f] : m = [e, n + w, a + f], r.push(m);
    }
    if (zo.push({ c: [e, n, a], r: o }), Co()) {
      Ao(r, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...r], t.polylines) {
      const p = [...r.map((w, f) => l + f), l], d = t.polylines.rawVal;
      ((_a3 = d[d.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [...d, p, []] : t.polylines.val = [...d.slice(0, -1), p, []];
    }
  }, window.__hekatanDrawArc = (e, n, a, o = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const s = Math.max(4, Math.round(o)), c = new E(...e), i = new E(...n), l = new E(...a), r = new E().subVectors(i, c), p = new E().subVectors(l, c), d = new E().crossVectors(r, p), w = 2 * d.lengthSq();
    let f;
    if (w < 1e-12) f = new E().addVectors(c, l).multiplyScalar(0.5);
    else {
      const me = p.clone().multiplyScalar(r.lengthSq()).sub(r.clone().multiplyScalar(p.lengthSq())), ve = new E().crossVectors(me, d);
      f = c.clone().add(ve.divideScalar(w));
    }
    const m = c.distanceTo(f), M = d.lengthSq() > 1e-12 ? d.clone().normalize() : new E(0, 1, 0), k = new E().subVectors(c, f).normalize(), y = new E().crossVectors(M, k).normalize(), u = (me) => {
      const ve = new E().subVectors(me, f);
      return Math.atan2(ve.dot(y), ve.dot(k));
    }, x = (me) => {
      let ve = me;
      for (; ve < 0; ) ve += 2 * Math.PI;
      for (; ve >= 2 * Math.PI; ) ve -= 2 * Math.PI;
      return ve;
    }, b = x(u(i)), L = x(u(l)), S = b <= L ? L : L - 2 * Math.PI, A = t.points.rawVal.length, T = [], N = (me) => {
      const ve = k.clone().multiplyScalar(Math.cos(me)).add(y.clone().multiplyScalar(Math.sin(me)));
      return f.clone().add(ve.multiplyScalar(m));
    }, D = String(window.__hekatanArcModo ?? "angulo"), W = D === "x" ? 0 : D === "y" ? 1 : D === "z" ? 2 : -1;
    let j = false;
    if (W >= 0) {
      const me = e[W], ve = a[W], We = 512;
      let De = Math.abs(ve - me) > 1e-9, Je = me;
      for (let Fe = 1; Fe <= We && De; Fe++) {
        const tt = N(S * Fe / We).getComponent(W);
        (tt - Je) * (ve - me) < -1e-9 && (De = false), Je = tt;
      }
      if (De) {
        j = true;
        for (let Fe = 0; Fe <= s; Fe++) {
          const tt = me + (ve - me) * Fe / s;
          let Xe = 0, Ce = S;
          for (let Oe = 0; Oe < 60; Oe++) {
            const mt = (Xe + Ce) / 2;
            (N(mt).getComponent(W) - tt) * (ve - me) < 0 ? Xe = mt : Ce = mt;
          }
          const Ue = N((Xe + Ce) / 2);
          T.push([Ue.x, Ue.y, Ue.z]);
        }
        T[0] = [e[0], e[1], e[2]], T[s] = [a[0], a[1], a[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${D.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!j) for (let me = 0; me <= s; me++) {
      const ve = N(S * (me / s));
      T.push([ve.x, ve.y, ve.z]);
    }
    if (zo.push({ c: [f.x, f.y, f.z], r: m }), Co()) {
      Ao(T, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...T], t.polylines) {
      const me = T.map((We, De) => A + De), ve = t.polylines.rawVal;
      t.polylines.val = [...ve.slice(0, -1), me, []];
    }
  }, window.__hekatanDrawPolinomio = (e, n = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const a = e.length;
    if (a < 2) return { ok: false, msg: "faltan puntos" };
    const o = Math.max(a - 1, Math.round(n)), s = (S) => Math.max(...e.map((A) => A[S])) - Math.min(...e.map((A) => A[S])), c = [s(0), s(1), s(2)], i = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), l = i === "xy" ? 2 : i === "xz" ? 1 : i === "yz" ? 0 : -1, r = l >= 0 && c[l] < 1e-6 ? l : c[2] <= c[0] && c[2] <= c[1] ? 2 : c[1] <= c[0] ? 1 : 0, p = r === 2 ? "xy" : r === 1 ? "xz" : "yz", d = [0, 1, 2].filter((S) => S !== r), [w, f] = c[d[0]] >= c[d[1]] ? d : [d[1], d[0]], m = e.map((S) => S[w]), M = e.map((S) => S[f]);
    for (let S = 0; S < a; S++) for (let A = S + 1; A < a; A++) if (Math.abs(m[S] - m[A]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[w]} en ${p.toUpperCase()}): no hay polinomio que pase por los dos` };
    const k = (S) => {
      let A = 0;
      for (let T = 0; T < a; T++) {
        let N = 1;
        for (let D = 0; D < a; D++) D !== T && (N *= (S - m[D]) / (m[T] - m[D]));
        A += M[T] * N;
      }
      return A;
    }, y = (() => {
      const S = a, A = m.map((D) => Array.from({ length: S }, (W, j) => D ** j)), T = M.slice();
      for (let D = 0; D < S; D++) {
        let W = D;
        for (let j = D + 1; j < S; j++) Math.abs(A[j][D]) > Math.abs(A[W][D]) && (W = j);
        [A[D], A[W]] = [A[W], A[D]], [T[D], T[W]] = [T[W], T[D]];
        for (let j = D + 1; j < S; j++) {
          const me = A[j][D] / A[D][D];
          for (let ve = D; ve < S; ve++) A[j][ve] -= me * A[D][ve];
          T[j] -= me * T[D];
        }
      }
      const N = new Array(S).fill(0);
      for (let D = S - 1; D >= 0; D--) {
        let W = T[D];
        for (let j = D + 1; j < S; j++) W -= A[D][j] * N[j];
        N[D] = W / A[D][D];
      }
      return N;
    })(), u = m[0], x = m[a - 1], b = t.points.rawVal.length, L = [];
    for (let S = 0; S <= o; S++) {
      const A = u + (x - u) * S / o, T = [e[0][0], e[0][1], e[0][2]];
      T[w] = A, T[f] = k(A), T[r] = e[0][r], L.push(T);
    }
    if (L[0] = [e[0][0], e[0][1], e[0][2]], L[o] = [e[a - 1][0], e[a - 1][1], e[a - 1][2]], Co()) return Ao(L, false), { ok: true, plano: p, coef: y, ia: w, io: f };
    if (t.points.val = [...t.points.rawVal, ...L], t.polylines) {
      const S = L.map((T, N) => b + N), A = t.polylines.rawVal;
      t.polylines.val = ((_d = A[A.length - 1]) == null ? void 0 : _d.length) > 0 ? [...A, S, []] : [...A.slice(0, -1), S, []];
    }
    return { ok: true, plano: p, coef: y, ia: w, io: f };
  };
  const Ya = () => {
    var _a3, _b;
    const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), o = window.__hekatanDrawingAuxLines, s = (o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? [], c = [], i = [], l = /* @__PURE__ */ new Set(), r = (p) => [e[p][0], e[p][1], e[p][2]];
    return [...Ge].forEach((p) => {
      const d = p.split(":");
      if (d[0] === "aux") {
        const f = s[+d[1]];
        f && f.length === 6 && (c.push([[f[0], f[1], f[2]], [f[3], f[4], f[5]]]), i.push(p));
        return;
      }
      const w = d[0] === "poly" || d[0] === "seg" ? +d[1] : -1;
      if (!(w < 0 || !n[w] || a.has(w))) if (d[0] === "poly") {
        if (l.has(w)) return;
        l.add(w);
        for (let f = 0; f + 1 < n[w].length; f++) c.push([r(n[w][f]), r(n[w][f + 1])]);
      } else {
        const f = n[w][+d[2]], m = n[w][+d[2] + 1];
        f != null && m != null && !l.has(w) && c.push([r(f), r(m)]);
      }
    }), { segs: c, auxIds: i };
  }, so = (e, n) => Math.abs(e[0] - n[0]) < 1e-6 && Math.abs(e[1] - n[1]) < 1e-6 && Math.abs(e[2] - n[2]) < 1e-6, Xs = (e) => {
    const n = new Array(e.length).fill(false), a = [];
    for (let o = 0; o < e.length; o++) {
      if (n[o]) continue;
      n[o] = true;
      const s = [e[o][0], e[o][1]];
      let c = true;
      for (; c; ) {
        c = false;
        for (let l = 0; l < e.length; l++) {
          if (n[l]) continue;
          const [r, p] = e[l], d = s[s.length - 1], w = s[0];
          so(r, d) ? (s.push(p), n[l] = true, c = true) : so(p, d) ? (s.push(r), n[l] = true, c = true) : so(p, w) ? (s.unshift(r), n[l] = true, c = true) : so(r, w) && (s.unshift(p), n[l] = true, c = true);
        }
      }
      const i = s.length > 3 && so(s[0], s[s.length - 1]);
      i && s.pop(), a.push({ pts: s, cerrada: i });
    }
    return a;
  }, ta = (e, n) => {
    let a = e.findIndex((o) => Math.abs(o[0] - n[0]) < 1e-3 && Math.abs(o[1] - n[1]) < 1e-3 && Math.abs(o[2] - n[2]) < 1e-3);
    return a < 0 && (a = e.length, e.push(n)), a;
  }, Xa = (e) => {
    if (!e.length) return 0;
    Ge.clear(), e.forEach((a) => Ge.add(a));
    const n = e.length;
    return ca(), Ge.clear(), n;
  };
  window.__hekatanRevolveSelection = (e, n, a, o = 360) => {
    var _a3, _b, _c;
    const s = Math.max(3, Math.round(a || 16)), c = Math.abs(o - 360) < 1e-9, i = s, l = c ? s : s + 1, { segs: r, auxIds: p } = Ya();
    if (!r.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (c && s % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    St();
    const d = t.points.rawVal, w = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], f = [...d];
    let m = w.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const M = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], k = /* @__PURE__ */ new Map(), y = (T) => T.map((N) => Math.round(N * 1e4)).join(","), u = (T) => Math.hypot(T[0] - e, T[1] - n) < 1e-6, x = (T) => {
      const N = y(T);
      let D = k.get(N);
      if (D) return D;
      if (u(T)) return D = [ta(f, T)], k.set(N, D), D;
      const W = Math.hypot(T[0] - e, T[1] - n), j = Math.atan2(T[1] - n, T[0] - e);
      D = [];
      for (let me = 0; me < l; me++) {
        const ve = j + o * Math.PI / 180 * me / s;
        D.push(ta(f, me === 0 ? T : [e + W * Math.cos(ve), n + W * Math.sin(ve), T[2]]));
      }
      return k.set(N, D), D;
    };
    let b = 0, L = false;
    const S = (T) => {
      M.push(m.length), m.push([...T, T[0]]), b++;
    };
    for (const [T, N] of r) {
      const D = x(T), W = x(N);
      if (!(D.length === 1 && W.length === 1)) {
        if (D.length === 1 || W.length === 1) {
          L = true;
          const j = D.length === 1 ? D[0] : W[0], me = D.length === 1 ? W : D;
          for (let ve = 0; ve + 2 <= i; ve += 2) S([j, me[ve % l], me[(ve + 1) % l], me[(ve + 2) % l]]);
          continue;
        }
        for (let j = 0; j < i; j++) S([D[j], W[j], W[(j + 1) % l], D[(j + 1) % l]]);
      }
    }
    m.push([]), t.points.val = f, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = M);
    const A = Xa(p);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), { anillos: k.size, areas: b, polo: L, guias: A };
  }, window.__hekatanLoftSelection = (e, n) => {
    var _a3, _b, _c;
    const { segs: a, auxIds: o } = Ya(), s = Xs(a), c = (W) => W.pts.every((j) => Math.abs(j[2] - W.pts[0][2]) < 1e-6), i = s.find((W) => W.cerrada && c(W)), l = s.find((W) => !W.cerrada && W.pts.length >= 2 && !c(W));
    if (!i) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!l) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const r = i.pts, p = r.length, d = l.pts.slice();
    d[d.length - 1][2] < d[0][2] && d.reverse();
    let w = 0;
    for (let W = 0; W < p; W++) {
      const j = r[W], me = r[(W + 1) % p];
      w += j[0] * me[1] - me[0] * j[1];
    }
    const f = w > 0 ? 1 : -1, m = (W) => {
      const j = r[(W - 1 + p) % p], me = r[W], ve = r[(W + 1) % p], We = [me[0] - j[0], me[1] - j[1]], De = [ve[0] - me[0], ve[1] - me[1]], Je = Math.hypot(We[0], We[1]) || 1, Fe = Math.hypot(De[0], De[1]) || 1, tt = [f * We[1] / Je, -f * We[0] / Je], Xe = [f * De[1] / Fe, -f * De[0] / Fe], Ce = 1 + (tt[0] * Xe[0] + tt[1] * Xe[1]);
      return [(tt[0] + Xe[0]) / Math.max(Ce, 1e-6), (tt[1] + Xe[1]) / Math.max(Ce, 1e-6)];
    }, M = r.map((W, j) => m(j)), k = d[0];
    let y = [0, 0], u = 0;
    for (const W of d) {
      const j = W[0] - k[0], me = W[1] - k[1], ve = Math.hypot(j, me);
      ve > u && (u = ve, y = [j / ve, me / ve]);
    }
    if (u < 1e-9) {
      const W = k[0] - e, j = k[1] - n, me = Math.hypot(W, j) || 1;
      y = [W / me, j / me];
    }
    y[0] * (k[0] - e) + y[1] * (k[1] - n) < 0 && (y = [-y[0], -y[1]]), St();
    const x = t.points.rawVal, b = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], L = [...x];
    let S = b.slice();
    S.length && S[S.length - 1].length === 0 && (S = S.slice(0, -1));
    const A = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], T = d.map((W) => {
      const j = (W[0] - k[0]) * y[0] + (W[1] - k[1]) * y[1], me = W[2];
      return r.map((ve, We) => ta(L, [ve[0] + M[We][0] * j, ve[1] + M[We][1] * j, me]));
    });
    let N = 0;
    for (let W = 0; W + 1 < T.length; W++) for (let j = 0; j < p; j++) {
      const me = [T[W][j], T[W][(j + 1) % p], T[W + 1][(j + 1) % p], T[W + 1][j]];
      new Set(me).size < 4 || (A.push(S.length), S.push([...me, me[0]]), N++);
    }
    S.push([]), t.points.val = L, t.polylines && (t.polylines.val = S), t.areas && (t.areas.val = A);
    const D = Xa(o);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), { contorno: p, perfil: d.length, areas: N, guias: D };
  }, window.__hekatanDrawSlabChaflan = (e, n, a = 1, o = 6, s = 6) => {
    const c = Math.min(e[0], n[0]), i = Math.max(e[0], n[0]), l = Math.min(e[1], n[1]), r = Math.max(e[1], n[1]), p = (e[2] + n[2]) / 2, d = i - c, w = r - l, f = Math.min(a, d / 2 - 0.01, w / 2 - 0.01);
    if (f <= 0) return;
    const m = t.points.rawVal.length, M = [], k = [], y = (u, x) => {
      M.push([u, x, p]), k.push(m + M.length - 1);
    };
    for (let u = 0; u <= s; u++) y(c + f + (d - 2 * f) * u / s, l);
    for (let u = 1; u <= o; u++) {
      const x = -Math.PI / 2 + Math.PI / 2 * u / o;
      y(i - f + f * Math.cos(x), l + f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) y(i, l + f + (w - 2 * f) * u / s);
    for (let u = 1; u <= o; u++) {
      const x = 0 + Math.PI / 2 * u / o;
      y(i - f + f * Math.cos(x), r - f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) y(i - f - (d - 2 * f) * u / s, r);
    for (let u = 1; u <= o; u++) {
      const x = Math.PI / 2 + Math.PI / 2 * u / o;
      y(c + f + f * Math.cos(x), r - f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) y(c, r - f - (w - 2 * f) * u / s);
    for (let u = 1; u < o; u++) {
      const x = Math.PI + Math.PI / 2 * u / o;
      y(c + f + f * Math.cos(x), l + f + f * Math.sin(x));
    }
    if (k.push(m), Co()) {
      Ao(M, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...M], t.polylines) {
      const u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), k, []];
    }
  }, window.__hekatanDrawRect = (e, n) => {
    const a = t.points.rawVal.length, o = e[0], s = e[1], c = e[2], i = n[0], l = n[1], r = n[2];
    let p;
    if (Math.abs(c - r) < 1e-6 ? p = [[o, s, c], [i, s, c], [i, l, c], [o, l, c]] : Math.abs(s - l) < 1e-6 ? p = [[o, s, c], [i, s, c], [i, s, r], [o, s, r]] : p = [[o, s, c], [o, l, c], [o, l, r], [o, s, r]], t.points.val = [...t.points.rawVal, ...p], t.polylines) {
      const d = [a, a + 1, a + 2, a + 3, a], w = t.polylines.rawVal;
      t.polylines.val = [...w.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawRectArea = (e, n) => {
    var _a3;
    const a = t.points.rawVal.length, o = e[0], s = e[1], c = e[2], i = n[0], l = n[1], r = n[2];
    let p;
    if (q && t.gridTarget) {
      const d = t.gridTarget.rawVal, w = new En(...d.rotation), f = new E(1, 0, 0).applyEuler(w), m = new E(0, 1, 0).applyEuler(w), M = new E(...d.position), k = new E(o, s, c), y = new E(i, l, r), u = k.clone().sub(M).dot(f), x = k.clone().sub(M).dot(m), b = y.clone().sub(M).dot(f), L = y.clone().sub(M).dot(m), S = (A, T) => M.clone().addScaledVector(f, A).addScaledVector(m, T).toArray();
      p = [S(u, x), S(b, x), S(b, L), S(u, L)];
    } else Math.abs(c - r) < 1e-6 ? p = [[o, s, c], [i, s, c], [i, l, c], [o, l, c]] : Math.abs(s - l) < 1e-6 ? p = [[o, s, c], [i, s, c], [i, s, r], [o, s, r]] : p = [[o, s, c], [o, l, c], [o, l, r], [o, s, r]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...p], t.polylines) {
      const d = t.polylines.rawVal, w = d.length - 1, f = [a, a + 1, a + 2, a + 3, a];
      t.polylines.val = [...d.slice(0, -1), f, []], t.areas && (t.areas.val = [...t.areas.rawVal, w]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    z();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = t.points.rawVal, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = (y) => y.map((u) => Math.round(u * 1e4) / 1e4).join(",");
    for (let y = 0; y < n.length; y++) {
      const u = s(n[y]), x = a.get(u);
      x === void 0 && a.set(u, y), o.set(y, x ?? y);
    }
    const c = e.map((y) => y.map((u) => o.get(u) ?? u)), i = /* @__PURE__ */ new Map(), l = (y, u) => {
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
        const L = [y, u, x, b].slice().sort((S, A) => S - A).join("-");
        p.has(L) || (p.add(L), d.push([y, u, x, b]));
      }
    }
    for (const y of w) for (const u of i.get(y)) if (!(u < y)) for (const x of i.get(u)) {
      if (x === y || !r(x, y)) continue;
      const b = [y, u, x].slice().sort((L, S) => L - S).join("-");
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
      z();
    }
    return k;
  }, window.__hekatanMeshPolyArea = (e, n) => {
    var _a3;
    const a = e.length;
    if (a < 3) return 0;
    let o = 0, s = 0, c = 0;
    for (let Ce = 0; Ce < a; Ce++) {
      const Ue = e[Ce], Oe = e[(Ce + 1) % a];
      o += (Ue[1] - Oe[1]) * (Ue[2] + Oe[2]), s += (Ue[2] - Oe[2]) * (Ue[0] + Oe[0]), c += (Ue[0] - Oe[0]) * (Ue[1] + Oe[1]);
    }
    const i = Math.hypot(o, s, c) || 1;
    o /= i, s /= i, c /= i;
    let l = e[1][0] - e[0][0], r = e[1][1] - e[0][1], p = e[1][2] - e[0][2];
    const d = Math.hypot(l, r, p) || 1;
    l /= d, r /= d, p /= d;
    let w = s * p - c * r, f = c * l - o * p, m = o * r - s * l;
    const M = Math.hypot(w, f, m) || 1;
    w /= M, f /= M, m /= M;
    const k = e[0], y = (Ce) => [(Ce[0] - k[0]) * l + (Ce[1] - k[1]) * r + (Ce[2] - k[2]) * p, (Ce[0] - k[0]) * w + (Ce[1] - k[1]) * f + (Ce[2] - k[2]) * m], u = (Ce, Ue) => [k[0] + Ce * l + Ue * w, k[1] + Ce * r + Ue * f, k[2] + Ce * p + Ue * m], x = e.map(y);
    let b = 1 / 0, L = -1 / 0, S = 1 / 0, A = -1 / 0;
    for (const [Ce, Ue] of x) Ce < b && (b = Ce), Ce > L && (L = Ce), Ue < S && (S = Ue), Ue > A && (A = Ue);
    const T = L - b, N = A - S;
    if (T < 1e-6 || N < 1e-6) return 0;
    let D = n && n > 0 ? n : 0.5;
    for (; T / D * (N / D) > 2500; ) D *= 2;
    D = Math.min(D, Math.min(T, N));
    const W = (Ce, Ue) => {
      let Oe = false;
      for (let mt = 0, vt = x.length - 1; mt < x.length; vt = mt++) {
        const [Lt, sn] = x[mt], [jn, Yn] = x[vt];
        sn > Ue != Yn > Ue && Ce < (jn - Lt) * (Ue - sn) / (Yn - sn) + Lt && (Oe = !Oe);
      }
      return Oe;
    }, j = Math.max(1, Math.round(T / D)), me = Math.max(1, Math.round(N / D)), ve = T / j, We = N / me, De = /* @__PURE__ */ new Map(), Je = [], Fe = t.points.rawVal.length, tt = (Ce, Ue) => {
      const Oe = Ce + "," + Ue, mt = De.get(Oe);
      if (mt !== void 0) return mt;
      const vt = Fe + Je.length;
      return Je.push(u(b + Ce * ve, S + Ue * We)), De.set(Oe, vt), vt;
    }, Xe = [];
    for (let Ce = 0; Ce < j; Ce++) for (let Ue = 0; Ue < me; Ue++) {
      if (!W(b + (Ce + 0.5) * ve, S + (Ue + 0.5) * We)) continue;
      const Oe = tt(Ce, Ue), mt = tt(Ce + 1, Ue), vt = tt(Ce + 1, Ue + 1), Lt = tt(Ce, Ue + 1);
      Xe.push([Oe, mt, vt, Lt]);
    }
    if (!Xe.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...Je], t.polylines && t.areas) {
      let Ce = t.polylines.rawVal.slice();
      Ce.length && Ce[Ce.length - 1].length === 0 && (Ce = Ce.slice(0, -1));
      const Ue = [];
      for (const Oe of Xe) Ue.push(Ce.length), Ce.push([Oe[0], Oe[1], Oe[2], Oe[3], Oe[0]]);
      Ce.push([]), t.polylines.val = Ce, t.areas.val = [...t.areas.rawVal, ...Ue];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), Xe.length;
  };
  const Eo = () => {
    if (at.length < 3) return at = [], Ie.visible = false, z(), 0;
    const e = window.__hekatanMeshPolyArea(at.slice());
    return at = [], Ie.visible = false, z(), e;
  };
  window.__hekatanFinalizePolyArea = Eo, window.__hekatanSetInclinedPlaneFrom3 = (e, n, a) => {
    var _a3;
    const o = new E(e[0], e[1], e[2]), s = new E(n[0], n[1], n[2]), c = new E(a[0], a[1], a[2]), i = new E().subVectors(s, o).cross(new E().subVectors(c, o));
    if (i.lengthSq() < 1e-9) return false;
    i.normalize();
    const l = new ho().setFromUnitVectors(new E(0, 0, 1), i), r = new En().setFromQuaternion(l);
    t.gridTarget && (t.gridTarget.val = { position: [o.x, o.y, o.z], rotation: [r.x, r.y, r.z] }), q = true;
    const p = new E().addVectors(o, s).add(c).multiplyScalar(1 / 3), d = Math.max(o.distanceTo(s), o.distanceTo(c), s.distanceTo(c)) * 2.2 + 4, w = d / 2;
    Yt.geometry.dispose(), Yt.geometry = new An(d, d), en.geometry.dispose(), en.geometry = new fs(new An(d, d)), bo(w, 1), kt.position.copy(p), kt.quaternion.copy(l), kt.scale.set(1, 1, 1), kt.visible = true;
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
      const d = on.children.pop();
      (_a3 = d.geometry) == null ? void 0 : _a3.dispose(), (_b = d.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !n.length) return;
    const s = Math.min(...n) - o, c = Math.max(...n) + o, i = Math.min(...e) - o, l = Math.max(...e) + o, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", p = (d, w, f, m, M) => {
      const k = document.createElement("canvas");
      k.width = 64, k.height = 32;
      const y = k.getContext("2d");
      y.fillStyle = M, y.font = "bold 22px sans-serif", y.textAlign = "center", y.fillText(d, 32, 26);
      const u = new hs(k), x = new ms({ map: u, transparent: true }), b = new ws(x);
      return b.position.set(w, f, m), b.scale.set(1.2, 0.6, 1), b;
    };
    e.forEach((d, w) => {
      const f = w < r.length ? r[w] : `X${w}`, m = new Ae().setFromPoints([new E(d, s, 0), new E(d, c, 0), new E(d, s, 0), new E(d, s, a)]), M = new eo({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new jt(m, M);
      k.computeLineDistances(), on.add(k), on.add(p(f, d, s - 0.5, 0, "#60a5fa")), on.add(p(f, d, c + 0.5, 0, "#60a5fa"));
    }), n.forEach((d, w) => {
      const f = `${w + 1}`, m = new Ae().setFromPoints([new E(i, d, 0), new E(l, d, 0), new E(i, d, 0), new E(i, d, a)]), M = new eo({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), k = new jt(m, M);
      k.computeLineDistances(), on.add(k), on.add(p(f, i - 0.5, d, 0, "#fb7185")), on.add(p(f, l + 0.5, d, 0, "#fb7185"));
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
      const c = _n.children.pop();
      (_a3 = c.geometry) == null ? void 0 : _a3.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    qn.forEach((c) => {
      g.remove(c), c.geometry.dispose(), c.material.dispose();
    }), qn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((c, i) => {
      const l = s[i % s.length], r = n / 2, p = [new E(a - r, o - r, c), new E(a + r, o - r, c), new E(a + r, o + r, c), new E(a - r, o + r, c), new E(a - r, o - r, c)], d = new Ae().setFromPoints(p), w = new ft({ color: l, transparent: true, opacity: 0.55 });
      _n.add(new Et(d, w));
      const f = document.createElement("canvas");
      f.width = 128, f.height = 32;
      const m = f.getContext("2d");
      m.fillStyle = `#${l.toString(16).padStart(6, "0")}`, m.font = "bold 18px sans-serif", m.fillText(`Z = ${c} m`, 4, 22);
      const M = new hs(f), k = new ms({ map: M, transparent: true }), y = new ws(k);
      y.position.set(a - r - 1.5, o - r - 1.5, c), y.scale.set(2.5, 0.6, 1), _n.add(y);
      const u = new An(1e4, 1e4), x = new wt({ visible: false, side: Vt }), b = new ct(u, x);
      b.position.set(0, 0, c), b.frustumCulled = false, b.userData = { refPlaneZ: c }, g.add(b), qn.push(b);
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
      const o = new Ae().setFromPoints([new E(a[0], a[1], a[2]), new E(a[3], a[4], a[5])]), s = new eo({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), c = new Et(o, s);
      c.computeLineDistances(), io.add(c);
    }
  };
  de.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Us(), z());
  });
  const Gn = new ut();
  Gn.frustumCulled = false, g.add(Gn);
  const Ua = () => {
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
  de.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Ua(), z());
  }), _.addEventListener("change", () => {
    Gn.children.forEach((e) => {
      e.scale.setScalar(ko(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Ua;
  const bt = new ut(), Zs = new ct(new to(0.01, 12, 12), new wt({ color: 16777215, transparent: true, opacity: 0.95 })), Za = new ct(new to(0.015, 12, 12), new wt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Za.visible = false, bt.add(Zs, Za);
  const Kn = 0.08, na = (e, n, a) => {
    const o = new Ae().setFromPoints([new E(...e), new E(...n)]);
    return new Et(o, new ft({ color: a, transparent: true, opacity: 0.7 }));
  };
  bt.add(na([-Kn, 0, 0], [Kn, 0, 0], 16777215)), bt.add(na([0, -Kn, 0], [0, Kn, 0], 16777215)), bt.add(na([0, 0, -Kn], [0, 0, Kn], 16777215)), bt.visible = false, bt.frustumCulled = false, g.add(bt);
  let oa = 2;
  const Fo = (e) => {
    const n = v(), a = (F == null ? void 0 : F.clientHeight) || 700;
    return n.isOrthographicCamera ? (n.top - n.bottom) / (n.zoom || 1) / a : 2 * n.position.distanceTo(e) * Math.tan((n.fov || 50) * Math.PI / 180 / 2) / a;
  }, lo = () => {
    if (!bt.visible) return;
    const e = oa * Fo(bt.position) / 0.015;
    bt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let zn = 10;
  const aa = (e) => Math.max(1e-4, zn * Fo(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (zn = e), zn), window.__hekatanUpdateSnapScale = lo, window.__hekatanSnapMarker = bt, window.__hekatanMetrosPorPixel = Fo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (oa = e, lo(), z()), oa);
  const qa = () => {
    yn.children.length !== 0 && yn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const n = e;
      n.scale.setScalar(ko(n.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = qa, _.addEventListener("change", () => {
    var _a3;
    lo(), tn.visible && Ia(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), qa();
  }), window.__hekatanShowSnap = (e, n, a) => {
    bt.position.set(e, n, a), bt.visible = true, lo(), z();
  }, window.__hekatanHideSnap = () => {
    bt.visible = false, z();
  }, F.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const n = B(e);
    if (!n) return;
    $.setFromCamera(Y, n), se = null;
    const a = Re();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && dt.visible && (dt.visible = false), a.length) {
      const o = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const m = Kt([o.x, o.y, o.z]);
        if (m) {
          const M = m.map((u) => t.points.rawVal[u]), k = [];
          for (let u = 1; u < M.length - 1; u++) k.push(M[0][0], M[0][1], M[0][2], M[u][0], M[u][1], M[u][2], M[u + 1][0], M[u + 1][1], M[u + 1][2]);
          const y = dt.geometry;
          y.setAttribute("position", new It(k, 3)), y.computeVertexNormals(), dt.visible = true;
        } else dt.visible = false;
      } else dt.visible && (dt.visible = false);
      const s = e.altKey;
      let c = false;
      const i = aa(o), l = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, o.x, o.y, o.z, i, { x: e.clientX, y: e.clientY });
      if (l) To(l.type, l.x, l.y, l.z), bt.position.set(l.x, l.y, l.z), bt.visible = true, o.set(l.x, l.y, l.z), Do(l.type, e.clientX, e.clientY);
      else if (!s && (Se = Me(e.clientX, e.clientY))) c = true, o.copy(Se), To("ifcSec", o.x, o.y, o.z), Do("ifcSec", e.clientX, e.clientY), bt.position.copy(o), bt.visible = true;
      else if (ae && !s) c = true, To(ae.tipo, o.x, o.y, o.z), Do(ae.tipo, e.clientX, e.clientY), bt.position.copy(o), bt.visible = true;
      else {
        Os(), Ro();
        const f = !s && window.__hekatanSnapEnabled !== false, m = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        f && m > 0 && (o.x = Math.round(o.x / m) * m, o.y = Math.round(o.y / m) * m, o.z = Math.round(o.z / m) * m), bt.position.copy(o), bt.visible = true;
      }
      lo(), Z(se && !l && (c || ae) ? K(se) : null), Rt = { p: o.clone(), x: e.clientX, y: e.clientY };
      const r = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (r === "select" || !r) {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, m = Bs(o.x, o.y, o.z, f), M = ea(o.x, o.y, o.z, f), k = Ta(o.x, o.y, o.z, f);
        if (m >= 0) {
          const b = t.points.rawVal[m];
          tn.position.set(b[0], b[1], b[2]), tn.visible = true, Ia(), wn.visible = false, xn = { kind: "pt", a: m };
        } else if (M) {
          const b = t.points.rawVal, L = t.polylines.rawVal[M.polyIdx], S = b[L[M.segIdx]], A = b[L[M.segIdx + 1]];
          wn.geometry.setFromPoints([new E(S[0], S[1], S[2]), new E(A[0], A[1], A[2])]), wn.visible = true, tn.visible = false, xn = ((_m = (_l2 = t.areas) == null ? void 0 : _l2.rawVal) == null ? void 0 : _m.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (k >= 0) {
          const L = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[k];
          L && (wn.geometry.setFromPoints([new E(L[0], L[1], L[2]), new E(L[3], L[4], L[5])]), wn.visible = true, tn.visible = false, xn = { kind: "aux", a: k });
        } else wn.visible = false, tn.visible = false, xn = null;
        ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
        let y = o;
        if ((xn == null ? void 0 : xn.kind) === "pt") {
          const b = t.points.rawVal[xn.a];
          b && (y = new E(b[0], b[1], b[2]));
        }
        const u = `X=${y.x.toFixed(2)} Y=${y.y.toFixed(2)} Z=${y.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [y.x, y.y, y.z], xn) {
          const b = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ze.textContent = `${u}  \xB7  \u{1F5B1} Click \u2192 ${b[xn.kind]}`;
        } else ze.textContent = u;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = u), Rt = { p: y.clone(), x: e.clientX, y: e.clientY }, qe.visible = false, Xt.visible = false, Ut.visible = false, z();
        return;
      }
      if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, m = ea(o.x, o.y, o.z, f), M = Ta(o.x, o.y, o.z, f);
        let k = false;
        if (M >= 0) if (!m) k = true;
        else {
          const b = window.__hekatanDrawingAuxLines, S = ((b == null ? void 0 : b.rawVal) ?? (b == null ? void 0 : b.val) ?? b ?? [])[M];
          ao(o.x, o.y, o.z, S[0], S[1], S[2], S[3], S[4], S[5]) < m.dist && (k = true);
        }
        k ? (Pn = M, dn = -1, Sn = -1, Ns(M)) : m ? (dn = m.polyIdx, Sn = m.segIdx, Pn = -1, Ys(m.polyIdx, m.segIdx)) : (dn = -1, Sn = -1, Pn = -1, qt.visible = false), qe.visible = false, Xt.visible = false, Ut.visible = false, pn(), ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
        const y = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        let u = "";
        k ? u = `\u{1F5D1} l\xEDnea aux #${Pn + 1}` : m ? u = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(m.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${m.polyIdx + 1}` : `\u{1F5D1} seg ${m.segIdx + 1} / poly #${m.polyIdx + 1}` : u = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ze.textContent = `${y}  \xB7  ${u}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = y), z();
        return;
      } else qt.visible = false, dn = -1, Pn = -1;
      ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
      const p = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], d = p[p.length - 1] ?? [], w = t.points.rawVal ?? [];
      if (d.length > 0 && w[d[d.length - 1]]) {
        const f = d[d.length - 1], m = w[f];
        let M = zt;
        Mo = null;
        const k = !!l || c;
        if (!M && !k && window.__hekatanAxisSnap !== false) {
          const De = F.getBoundingClientRect(), Je = e.clientX, Fe = e.clientY, tt = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Xe = new E(m[0], m[1], m[2]), Ce = [["x", new E(1, 0, 0)], ["y", new E(0, 1, 0)], ["z", new E(0, 0, 1)]], Ue = (mt) => {
            const vt = mt.clone().project(n);
            return { x: (vt.x * 0.5 + 0.5) * De.width + De.left, y: (-vt.y * 0.5 + 0.5) * De.height + De.top };
          };
          let Oe = null;
          for (const [mt, vt] of Ce) {
            const Lt = Ue(Xe.clone().addScaledVector(vt, -tt)), sn = Ue(Xe.clone().addScaledVector(vt, tt)), jn = sn.x - Lt.x, Yn = sn.y - Lt.y, di = Je - Lt.x, ui = Fe - Lt.y, pi = jn * jn + Yn * Yn || 1;
            let Yo = (di * jn + ui * Yn) / pi;
            Yo = Math.max(0, Math.min(1, Yo));
            const ls = Math.hypot(Je - (Lt.x + Yo * jn), Fe - (Lt.y + Yo * Yn));
            if (Oe === null || ls < Oe.dpx) {
              const xa = $.ray, rs = Xe.clone().sub(xa.origin), ga = vt.dot(xa.direction), cs = vt.dot(rs), fi = xa.direction.dot(rs), ds = 1 - ga * ga, hi = Math.abs(ds) < 1e-6 ? -cs : (ga * fi - cs) / ds;
              Oe = { axis: mt, dpx: ls, pt: Xe.clone().addScaledVector(vt, hi) };
            }
          }
          Oe && Oe.dpx <= 12 && (o.copy(Oe.pt), M = Oe.axis, Mo = Oe.pt.clone());
        }
        const y = !!window.__hekatanOrthoMode;
        if (!M && !k && y) {
          const De = Math.abs(o.x - m[0]), Je = Math.abs(o.y - m[1]), Fe = Math.abs(o.z - m[2]), tt = (_s2 = a[0]) == null ? void 0 : _s2.object;
          let Xe = null;
          tt === Zt ? Xe = "xy" : tt === Wt ? Xe = "xz" : tt === cn && (Xe = "yz"), Xe === "xy" ? M = De >= Je ? "x" : "y" : Xe === "xz" ? M = De >= Fe ? "x" : "z" : Xe === "yz" ? M = Je >= Fe ? "y" : "z" : M = De >= Je && De >= Fe ? "x" : Je >= Fe ? "y" : "z";
        }
        const u = window.__hekatanPolarTrack !== false;
        if (!M && !k && u) {
          const De = o.x - m[0], Je = o.y - m[1], Fe = o.z - m[2], tt = Math.hypot(De, Je, Fe);
          if (tt > 1e-3) {
            const Ce = Math.tan(6 * Math.PI / 180) * tt, Ue = Math.hypot(Je, Fe), Oe = Math.hypot(De, Fe), mt = Math.hypot(De, Je), vt = [["x", Ue], ["y", Oe], ["z", mt]];
            vt.sort((Lt, sn) => Lt[1] - sn[1]), vt[0][1] <= Ce && (M = vt[0][0]);
          }
        }
        if (M) {
          const De = m[0], Je = m[1], Fe = m[2];
          M === "x" ? o.set(o.x, Je, Fe) : M === "y" ? o.set(De, o.y, Fe) : o.set(De, Je, o.z);
          const tt = !!zt, Ce = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          Dt.style.background = "rgba(15,23,42,0.92)", Dt.style.color = Ce, Dt.style.border = `1.5px solid ${Ce}`;
          const Ue = (_t2 = a[0]) == null ? void 0 : _t2.object;
          let Oe = null;
          Ue === Zt ? Oe = "xy" : Ue === Wt ? Oe = "xz" : Ue === cn && (Oe = "yz");
          const mt = Oe ? ` (plano ${Oe.toUpperCase()})` : "";
          Dt.textContent = tt ? `\u{1F512} LOCK ${M.toUpperCase()}${mt}` : `\u22A5 ORTO ${M.toUpperCase()}${mt}`, Dt.style.left = e.clientX + 20 + "px", Dt.style.top = e.clientY + 18 + "px", Dt.style.transform = "none", Dt.style.display = "block";
        } else zt || (Dt.style.display = "none");
        let x = null;
        if (!s && !k && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const De = t.points.rawVal, Je = M ? [M] : ["z", "x", "y"], Fe = { x: e.clientX, y: e.clientY };
          let tt = 1 / 0;
          for (const Xe of De) if (!(Math.abs(Xe[0] - m[0]) < 1e-9 && Math.abs(Xe[1] - m[1]) < 1e-9 && Math.abs(Xe[2] - m[2]) < 1e-9)) for (const Ce of Je) {
            const Ue = new E(Ce === "x" ? Xe[0] : o.x, Ce === "y" ? Xe[1] : o.y, Ce === "z" ? Xe[2] : o.z), Oe = Bn(Ue.x, Ue.y, Ue.z);
            if (!Oe) continue;
            const mt = Math.hypot(Oe.x - Fe.x, Oe.y - Fe.y);
            mt < zn && mt < tt && (tt = mt, x = { q: Xe, eje: Ce });
          }
        }
        x ? (x.eje === "x" ? o.x = x.q[0] : x.eje === "y" ? o.y = x.q[1] : o.z = x.q[2], Ut.geometry.setFromPoints([new E(x.q[0], x.q[1], x.q[2]), new E(o.x, o.y, o.z)]), (_u = Ut.computeLineDistances) == null ? void 0 : _u.call(Ut), Ut.visible = true, bt.position.set(o.x, o.y, o.z), bt.visible = true, Do("track", e.clientX, e.clientY)) : Ut.visible = false, Rt = { p: o.clone(), x: e.clientX, y: e.clientY };
        const b = Math.hypot(o.x - m[0], o.y - m[1], o.z - m[2]), L = Math.atan2(o.y - m[1], o.x - m[0]) * 180 / Math.PI, S = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`, A = (L % 360 + 360) % 360;
        ze.textContent = `L = ${b.toFixed(3)} m   \u2220 ${A.toFixed(1)}\xB0   \xB7   ${S}`;
        const T = document.getElementById("hk-coord-fixed");
        T && (T.textContent = S), qe.geometry.setFromPoints([new E(m[0], m[1], m[2]), new E(o.x, o.y, o.z)]), (_v = qe.computeLineDistances) == null ? void 0 : _v.call(qe), qe.visible = true, yt(m[0], m[1], m[2], o.x, o.y, o.z);
        const N = window.__hekatanOrthoExt ?? 8, D = window.__hekatanShowOrthoPlanes !== false;
        hn.visible = D, D || $a(null), D && (vn(In, m, "xy", N), vn(Zn, m, "xz", N), vn(Tn, m, "yz", N), Mn(Zt, m, "xy", N), Mn(Wt, m, "xz", N), Mn(cn, m, "yz", N));
        const W = D ? $.intersectObjects([Zt, Wt, cn], false) : [];
        let j = null;
        if (W.length > 0) {
          const De = W[0].object;
          De === Zt ? j = "xy" : De === Wt ? j = "xz" : De === cn && (j = "yz");
        }
        $a(j), j && (mn.style.left = e.clientX + "px", mn.style.top = e.clientY + "px"), bn.geometry.setFromPoints([new E(m[0] - N, m[1], m[2]), new E(m[0] + N, m[1], m[2])]), (_w = bn.computeLineDistances) == null ? void 0 : _w.call(bn), fn.geometry.setFromPoints([new E(m[0], m[1] - N, m[2]), new E(m[0], m[1] + N, m[2])]), (_x = fn.computeLineDistances) == null ? void 0 : _x.call(fn), Vn.geometry.setFromPoints([new E(m[0], m[1], m[2] - N), new E(m[0], m[1], m[2] + N)]), (_y = Vn.computeLineDistances) == null ? void 0 : _y.call(Vn), Xt.visible = true;
        const me = bn.material, ve = fn.material, We = Vn.material;
        bn.visible = M === "x", fn.visible = M === "y", Vn.visible = M === "z", me.opacity = 0.95, ve.opacity = 0.95, We.opacity = 0.95;
      } else {
        const f = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        ze.textContent = f;
        const m = document.getElementById("hk-coord-fixed");
        if (m && (m.textContent = f), qe.visible = false, Xt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if (Ye = null, lt = null, ke.style.left = e.clientX + 20 + "px", ke.style.top = e.clientY - 28 + "px", ke.style.display = "block", !je) {
            ke.value = `${o.x.toFixed(2)},${o.y.toFixed(2)},${o.z.toFixed(2)}`;
            const k = document.activeElement;
            !(k && (k.tagName === "INPUT" || k.tagName === "TEXTAREA") && k !== ke) && document.activeElement !== ke && ke.focus({ preventScroll: true });
            try {
              ke.select();
            } catch {
            }
          }
        } else pn();
      }
      z();
    } else Ro(), ze.style.display = "none", bt.visible = false, qe.visible = false, Xt.visible = false, pn(), z();
  }), de.derive(() => {
    if (!t.gridTarget) return;
    const e = new ho().setFromEuler(new En(...t.gridTarget.val.rotation)), n = new ho().setFromAxisAngle(new E(1, 0, 0), Math.PI / 2);
    tl(h, { position: new E(...t.gridTarget.val.position), quaternion: e.clone().multiply(n) }, z), Ga(t.gridTarget.val.position[2], Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3), ee.position.set(...t.gridTarget.val.position), ee.quaternion.setFromEuler(new En(...t.gridTarget.val.rotation)), ee.updateMatrixWorld();
    const a = new E(0, 0, 1).applyEuler(new En(...t.gridTarget.val.rotation));
    q = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  });
  function Ga(e, n, a) {
    var _a3, _b, _c, _d, _e2, _f, _g;
    {
      for (const o of Un) g.remove(o), jo(o);
      if (Un.length = 0, n) {
        const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = /* @__PURE__ */ new Set([0]);
        for (const l of o) s.add(+l[2].toFixed(3));
        const c = /* @__PURE__ */ new Set();
        for (const l of window.__hekatanLevels ?? []) isFinite(l == null ? void 0 : l.z) && (s.add(+l.z.toFixed(3)), c.add(+l.z.toFixed(3)));
        const i = [...s].sort((l, r) => l - r).slice(0, 24);
        for (const l of i) {
          if (Math.abs(l - e) < 1e-6) continue;
          const r = h.clone(true);
          r.name = `hekatan-grid-nivel-${l}`, r.traverse((p) => {
            p.material && (p.material = p.material.clone(), p.material.transparent = true, p.material.opacity = (p.material.opacity ?? 1) * (c.has(l) ? 0.65 : Math.abs(l) < 1e-6 ? 0.5 : 0.22));
          }), r.position.set(0, 0, l), r.quaternion.identity(), g.add(r), Un.push(r);
        }
      }
    }
    {
      const o = window.__hekatanPlanosAux ?? [], s = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", c = ((_g = (_f = (_e2 = window.__hekatanCadState) == null ? void 0 : _e2.get) == null ? void 0 : _f.call(_e2)) == null ? void 0 : _g[s === "xz" ? "workY" : s === "yz" ? "workX" : "workZ"]) ?? 0;
      for (const i of o.slice(0, 24)) {
        if (i.plano === "xy" || !isFinite(i.d) || i.plano === s && Math.abs(i.d - c) < 1e-6) continue;
        const l = h.clone(true);
        l.name = `hekatan-grid-${i.plano}-${i.d}`, l.traverse((r) => {
          r.material && (r.material = r.material.clone(), r.material.transparent = true, r.material.opacity = (r.material.opacity ?? 1) * 0.6);
        }), i.plano === "xz" ? (l.quaternion.setFromEuler(new En(Math.PI / 2, 0, 0)), l.position.set(0, i.d, 0)) : (l.quaternion.setFromEuler(new En(0, Math.PI / 2, 0)), l.position.set(i.d, 0, 0)), g.add(l), Un.push(l);
      }
    }
    z();
  }
  window.__hekatanGrillaAux = (e, n = "xy") => {
    var _a3, _b;
    if (!isFinite(e)) return [];
    const a = window;
    (_a3 = a.__hekatanPushUndo) == null ? void 0 : _a3.call(a);
    const o = a.__hekatanPlanosAux ?? [], s = o.findIndex((c) => c.plano === n && Math.abs(c.d - e) < 1e-6);
    if (s >= 0 ? o.splice(s, 1) : o.push({ plano: n, d: e }), a.__hekatanPlanosAux = o, n === "xy") {
      const c = a.__hekatanLevels ?? [], i = c.findIndex((l) => Math.abs(l.z - e) < 1e-6 && l.tipo !== "piso");
      s >= 0 ? i >= 0 && c.splice(i, 1) : i < 0 && c.push({ label: `N${e >= 0 ? "+" : ""}${e.toFixed(2)}`, z: e, tipo: "aux" }), a.__hekatanLevels = c;
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
  const qs = (e) => e === "xz" ? new E(0, 1, 0) : e === "yz" ? new E(1, 0, 0) : new E(0, 0, 1), Ka = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", ro = () => {
    var _a3, _b, _c;
    return String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy");
  }, Hn = () => {
    var _a3, _b, _c;
    return Number(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c[Ka(ro())]) ?? 0);
  }, $o = (e) => {
    var _a3, _b;
    const n = ro(), a = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3);
    if (a && (a[Ka(n)] = e), !t.gridTarget) return;
    const o = window.__hekatanSCU ?? [0, 0, 0];
    t.gridTarget.val = n === "xy" ? { position: [o[0], o[1], e], rotation: [Math.PI / 2, 0, 0] } : n === "xz" ? { position: [o[0], e, o[2]], rotation: [0, 0, 0] } : { position: [e, o[1], o[2]], rotation: [0, 0, Math.PI / 2] };
  }, Gs = () => {
    const e = qs(ro()), n = $.ray.origin, a = $.ray.direction, o = e.dot(a), s = 1 - o * o;
    if (Math.abs(s) < 1e-4) return null;
    const c = n.clone().negate(), i = e.dot(c), l = a.dot(c);
    return (o * l - i) / s;
  }, co = (e, n) => {
    e && (un.style.left = e.clientX + "px", un.style.top = e.clientY + "px");
    const a = ro() === "xz" ? "Y" : ro() === "yz" ? "X" : "Z";
    un.value = Ot !== "" ? `${a} = ${Ot}` : `${a} = ${n.toFixed(2)} m`, un.style.display = "block";
  }, Lo = (e, n) => {
    var _a3;
    Wn && (Wn = false, window.__hekatanMoviendoGrilla = false, un.style.display = "none", e ? typeof n == "number" && isFinite(n) && $o(n) : $o(sa), Ot = "", (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), z());
  };
  window.__hekatanMoverGrilla = (e = true) => e ? (sa = Hn(), Ot = "", Wn = true, window.__hekatanMoviendoGrilla = true, co(null, sa), true) : Lo(false), F.addEventListener("pointermove", (e) => {
    if (!Wn) return;
    B(e);
    const n = Gs();
    if (n === null) {
      co(e, Hn());
      return;
    }
    Ot === "" && $o(n), co(e, n);
  }, true), F.addEventListener("pointerdown", (e) => {
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
      const l = kn.children.pop();
      (_b = (_a3 = l.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = l.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e2 = l.dispose) == null ? void 0 : _e2.call(l);
    }
    const n = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), a = new E(...e), o = [[new E(1, 0, 0), 16735067], [new E(0, 1, 0), 6029194], [new E(0, 0, 1), 6990079]];
    for (const [l, r] of o) kn.add(new $n(l, a, n, r, n * 0.28, n * 0.16));
    const s = new Ae().setFromPoints([new E(0, 0, 0), a]), c = new eo({ color: 2282478, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.8 }), i = new Et(s, c);
    i.computeLineDistances(), kn.add(i), kn.visible = true;
  };
  window.__hekatanPonerSCU = (e) => {
    var _a3;
    return window.__hekatanSCU = [e[0], e[1], e[2]], Ks(e), (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), z(), e;
  }, window.__hekatanQuitarSCU = () => {
    var _a3;
    return window.__hekatanSCU = [0, 0, 0], kn.visible = false, (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), z(), [0, 0, 0];
  };
  let ia = false;
  window.__hekatanElegirSCU = (e = true) => (ia = e, window.__hekatanColocandoSCU = e, e), F.addEventListener("pointerdown", (e) => {
    if (!ia) return;
    e.preventDefault(), e.stopPropagation(), ia = false, window.__hekatanColocandoSCU = false;
    const n = window.__hekatanOsnapUltimo;
    if (n) {
      window.__hekatanPonerSCU([n.x, n.y, n.z]);
      return;
    }
    B(e);
    const a = Re();
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
      const s = o.filter((c) => (c == null ? void 0 : c.tipo) === "piso");
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
    new ho().setFromAxisAngle(new E(1, 0, 0), Math.PI / 2), Ga(t.gridTarget.rawVal.position[2], Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3);
  }, de.derive(() => {
    Ee.geometry.setAttribute("position", new It(t.points.val.flat(), 3)), Ee.geometry.computeBoundingSphere();
  }), de.derive(() => {
    const e = 0.05 * C * 0.5 * P.val;
    $.params.Points.threshold = 0.4 * e;
  }), de.derive(() => {
    var _a3;
    const e = t.points.val ?? [], a = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], o = [];
    for (const c of a) {
      const [i, l, r] = e[c];
      o.push(i, l, r);
    }
    const s = new Ae();
    s.setAttribute("position", new It(o, 3)), Ze.geometry.dispose(), Ze.geometry = s;
  });
  let la = false, Rn = 0;
  F.addEventListener("pointerdown", () => {
    la = true;
  }), F.addEventListener("pointerup", () => {
    la = false;
  }), F.addEventListener("pointermove", () => {
    la && Rn++;
  });
  const Nt = document.createElement("div");
  Nt.id = "hk-window-select", Nt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Nt);
  let an = null, uo = false, Ht = null;
  const ra = (e, n, a, o, s) => {
    s ? (Nt.style.borderColor = "#34d399", Nt.style.borderStyle = "dashed", Nt.style.background = "rgba(52, 211, 153, 0.10)") : (Nt.style.borderColor = "#22d3ee", Nt.style.borderStyle = "solid", Nt.style.background = "rgba(34, 211, 238, 0.10)"), Nt.style.left = Math.min(e, a) + "px", Nt.style.top = Math.min(n, o) + "px", Nt.style.width = Math.abs(a - e) + "px", Nt.style.height = Math.abs(o - n) + "px", Nt.style.display = "block";
  }, Wa = (e, n, a, o, s) => {
    var _a3, _b, _c, _d;
    const c = Math.min(e, a), i = Math.max(e, a), l = Math.min(n, o), r = Math.max(n, o), p = a < e, d = F.getBoundingClientRect(), w = v();
    w.updateMatrixWorld();
    const f = (A) => {
      const T = new E(A[0], A[1], A[2]);
      return T.project(w), { x: d.left + (T.x * 0.5 + 0.5) * d.width, y: d.top + (-T.y * 0.5 + 0.5) * d.height };
    }, m = (A) => A.x >= c && A.x <= i && A.y >= l && A.y <= r, M = (A, T) => !(A.x < c && T.x < c || A.x > i && T.x > i || A.y < l && T.y < l || A.y > r && T.y > r);
    s || Ge.clear();
    let k = 0;
    const y = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let A = 0; A < y.length; A++) {
      const T = y[A];
      T && m(f(T)) && (Ge.add(`pt:${A}`), k++);
    }
    const u = (A, T) => p ? m(A) || m(T) || M(A, T) : m(A) && m(T), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], b = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let A = 0; A < x.length; A++) {
      const T = x[A];
      if (b.includes(A)) {
        let D;
        if (!p) D = T.every((W) => {
          const j = y[W];
          return !!j && m(f(j));
        });
        else {
          D = false;
          for (let W = 0; W < T.length - 1; W++) {
            const j = y[T[W]], me = y[T[W + 1]];
            if (!(!j || !me) && u(f(j), f(me))) {
              D = true;
              break;
            }
          }
        }
        D && (Ge.add(`poly:${A}`), k++);
      } else for (let D = 0; D < T.length - 1; D++) {
        const W = y[T[D]], j = y[T[D + 1]];
        !W || !j || u(f(W), f(j)) && (Ge.add(`seg:${A}:${D}`), k++);
      }
    }
    const S = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let A = 0; A < S.length; A++) {
      const T = S[A];
      if (!T || T.length !== 6) continue;
      const N = f([T[0], T[1], T[2]]), D = f([T[3], T[4], T[5]]);
      u(N, D) && (Ge.add(`aux:${A}`), k++);
    }
    nn(), re(k === 0 && !p ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${p ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${k} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ge.size})`), Nt.style.display = "none";
  }, Vo = () => {
    Ht && (Ht = null, Nt.style.display = "none", re("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Vo, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Ht && Vo();
  });
  const ca = () => {
    var _a3, _b, _c, _d;
    if (Ge.size === 0) return false;
    const e = [...Ge], n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], o = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, c = (s == null ? void 0 : s.rawVal) ?? [], i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
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
    for (let M = 0; M < a.length; M++) {
      if (l.has(M)) {
        d++;
        continue;
      }
      m.set(M, w.length);
      const k = r.get(M);
      if (k && k.size > 0) {
        let y = [];
        for (let u = 0; u < a[M].length; u++) y.push(a[M][u]), u < a[M].length - 1 && k.has(u) && (y.length >= 2 && w.push(y), y = [], d++);
        (y.length >= 2 || y.length === 1) && w.push(y);
      } else w.push([...a[M]]);
    }
    if (i.size > 0) {
      const M = [], k = /* @__PURE__ */ new Map();
      for (let u = 0; u < n.length; u++) {
        if (i.has(u)) {
          d++;
          continue;
        }
        k.set(u, M.length), M.push([...n[u]]);
      }
      const y = [];
      for (const u of w) {
        let x = [];
        for (const b of u) {
          const L = k.get(b);
          L === void 0 ? (x.length >= 2 && y.push(x), x = []) : x.push(L);
        }
        x.length >= 2 && y.push(x);
      }
      w = y, t.points.val = M;
    }
    for (const M of o) {
      const k = m.get(M);
      k !== void 0 && k < w.length && f.push(k);
    }
    if (t.polylines && (t.polylines.val = w), t.areas && (t.areas.val = f), p.size > 0 && s) {
      const M = c.filter((k, y) => !p.has(y));
      "val" in s ? s.val = M : window.__hekatanDrawingAuxLines = M, d += p.size;
    }
    Ge.clear(), nn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return re(`\u{1F5D1} ${d} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = ca, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const n = document.activeElement, a = n && (n.id === "hk3-cmd-input" || n.id === "hk-dyn-input") && n.value === "";
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable) && !a || Ge.size !== 0 && (e.preventDefault(), ca());
  });
  const Gt = document.createElement("div");
  Gt.id = "hk-properties-pane";
  const Ha = "hk-props-pane-pos";
  let po = null;
  try {
    const e = localStorage.getItem(Ha);
    e && (po = JSON.parse(e));
  } catch {
  }
  Gt.style.cssText = ["position:fixed", po ? `left:${po.left}px` : "left:14px", po ? `top:${po.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Gt);
  const Ws = () => {
    const e = Gt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let n = false, a = 0, o = 0, s = 0, c = 0;
    e.addEventListener("mousedown", (i) => {
      n = true, a = i.clientX, o = i.clientY;
      const l = Gt.getBoundingClientRect();
      s = l.left, c = l.top, Gt.style.transform = "none", Gt.style.left = `${s}px`, Gt.style.top = `${c}px`, i.preventDefault();
    }), window.addEventListener("mousemove", (i) => {
      if (!n) return;
      const l = i.clientX - a, r = i.clientY - o, p = Math.max(0, Math.min(window.innerWidth - 80, s + l)), d = Math.max(0, Math.min(window.innerHeight - 40, c + r));
      Gt.style.left = `${p}px`, Gt.style.top = `${d}px`;
    }), window.addEventListener("mouseup", () => {
      if (n) {
        n = false;
        try {
          localStorage.setItem(Ha, JSON.stringify({ left: parseFloat(Gt.style.left), top: parseFloat(Gt.style.top) }));
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
    if (ht && (ht.dispose(), ht = null), Ge.size === 0) {
      Gt.style.display = "none";
      return;
    }
    const e = [...Ge], n = e.filter((w) => w.startsWith("pt:"));
    if (n.length === 1) {
      const w = +n[0].slice(3), m = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(w);
      m ? [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = m.map(Boolean) : ne.Ux = ne.Uy = ne.Uz = ne.Rx = ne.Ry = ne.Rz = false;
      const k = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(w);
      k ? [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz] = k : ne.Fx = ne.Fy = ne.Fz = ne.Mx = ne.My = ne.Mz = 0;
    }
    const a = e.filter((w) => w.startsWith("seg:")), o = e.filter((w) => w.startsWith("poly:")), s = e.filter((w) => w.startsWith("aux:")), c = n.length > 0, i = a.length > 0, l = o.length > 0, r = !c && !i && !l, p = [];
    n.length && p.push(`\u{1F535} ${n.length} nodo(s)`), a.length && p.push(`\u{1F4CF} ${a.length} segmento(s)`), o.length && p.push(`\u25AD ${o.length} \xE1rea(s)`), s.length && p.push(`\u250A ${s.length} aux`);
    const d = `\u{1F3AF} ${Ge.size} item(s) \u2014 ${p.join(", ")}`;
    ht = new Es({ container: Gt, title: d });
    {
      const w = ht.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      w.addBinding(Mt, "dx", { label: "\u0394x (m)", step: 0.1 }), w.addBinding(Mt, "dy", { label: "\u0394y (m)", step: 0.1 }), w.addBinding(Mt, "dz", { label: "\u0394z (m)", step: 0.1 }), w.addBinding(Mt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), w.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        re(k ? `\u29C9 Replicado \xD7${k} (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), w.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        re(k && (k.lineas || k.areas) ? `\u21D7 Extruido: ${k.lineas} barra(s), ${k.areas} pa\xF1o(s) (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m \xD7 ${Mt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const f = { vuelo: 1.5, losa: true, borde: true, ambos: true }, m = w.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      m.addBinding(f, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), m.addBinding(f, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), m.addBinding(f, "borde", { label: "con viga de borde" }), m.addBinding(f, "ambos", { label: "a los dos lados" }), m.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, f.vuelo, { losa: f.losa, vigaBorde: f.borde, lados: f.ambos ? "ambos" : "afuera" });
        re(k ? `\u2310 Volado de ${f.vuelo} m en ${k} pa\xF1o(s)` + (f.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), w.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a4;
        const k = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, 1);
        re(k ? `\u2192 Copia desplazada \u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const M = w.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      M.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a4;
        return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
      }), M.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), re(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (c) {
      const w = ht.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${n.length} nodo(s)` });
      w.addBinding(ne, "Ux"), w.addBinding(ne, "Uy"), w.addBinding(ne, "Uz"), w.addBinding(ne, "Rx"), w.addBinding(ne, "Ry"), w.addBinding(ne, "Rz");
      const f = (u, x) => {
        [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = u;
        try {
          ht.refresh();
        } catch {
        }
        $t("nodes", n, "supports", u), re(`\u2713 ${x}: ${n.length} nudo(s) apoyado(s) (${u.map((b, L) => b ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][L] : "").filter(Boolean).join(" ")}).`);
      };
      w.addButton({ title: `\u25B2 Empotrar los ${n.length} nudo(s) (6 GDL)` }).on("click", () => f([true, true, true, true, true, true], "Empotrado")), w.addButton({ title: `\u25B3 Articular los ${n.length} nudo(s) (Ux Uy Uz)` }).on("click", () => f([true, true, true, false, false, false], "Articulado"));
      const m = ht.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      m.addBinding(ne, "Kx", { label: "Kx", min: 0, step: 100 }), m.addBinding(ne, "Ky", { label: "Ky", min: 0, step: 100 }), m.addBinding(ne, "Kz", { label: "Kz", min: 0, step: 100 }), m.addBinding(ne, "Krx", { label: "Krx", min: 0, step: 1e3 }), m.addBinding(ne, "Kry", { label: "Kry", min: 0, step: 1e3 }), m.addBinding(ne, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const M = ht.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      M.addBinding(ne, "Fx", { step: 0.1 }), M.addBinding(ne, "Fy", { step: 0.1 }), M.addBinding(ne, "Fz", { step: 0.1 }), M.addBinding(ne, "Mx", { step: 0.1 }), M.addBinding(ne, "My", { step: 0.1 }), M.addBinding(ne, "Mz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ne, "mass", { label: "m", min: 0, step: 1 }), ht.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ne, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ht.addButton({ title: `\u2713 Aplicar a ${n.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let u = 0;
        const x = [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz];
        x.some((S) => S) && ($t("nodes", n, "supports", x), u++);
        const b = [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz];
        b.some((S) => S !== 0) && ($t("nodes", n, "loads", b), u++);
        const L = [ne.Kx, ne.Ky, ne.Kz, ne.Krx, ne.Kry, ne.Krz];
        if (L.some((S) => S !== 0) && ($t("nodes", n, "springs", L), u++), ne.mass !== 0 && ($t("nodes", n, "mass", ne.mass), u++), ne.diaphragm !== "Ninguno" && ($t("nodes", n, "diaphragm", ne.diaphragm), u++), u === 0) {
          re("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let S = document.getElementById("hk-prop-toast");
          S || (S = document.createElement("div"), S.id = "hk-prop-toast", S.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(S)), S.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", S.style.background = "rgba(217,119,6,0.97)", S.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            S && (S.style.opacity = "0");
          }, 3200);
        } else re(`\u2713 Propiedades aplicadas a ${n.length} nodo(s)`);
      });
    }
    if (i) {
      const w = ht.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      w.addBinding(ne, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), w.addBinding(ne, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const f = ht.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      f.addBinding(ne, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ht.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ne, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ht.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ne, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const k = ht.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      k.addBinding(ne, "relMxI", { label: "Mx I" }), k.addBinding(ne, "relMyI", { label: "My I" }), k.addBinding(ne, "relMzI", { label: "Mz I" });
      const y = ht.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      y.addBinding(ne, "relMxJ", { label: "Mx J" }), y.addBinding(ne, "relMyJ", { label: "My J" }), y.addBinding(ne, "relMzJ", { label: "Mz J" }), ht.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ne, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const x = ht.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      x.addBinding(ne, "LKx", { label: "LKx", min: 0, step: 100 }), x.addBinding(ne, "LKy", { label: "LKy", min: 0, step: 100 }), x.addBinding(ne, "LKz", { label: "LKz", min: 0, step: 100 });
      const b = ht.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      b.addBinding(ne, "qx", { step: 0.1 }), b.addBinding(ne, "qy", { step: 0.1 }), b.addBinding(ne, "qz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ne, "massPerM", { label: "m/L", min: 0, step: 1 }), ht.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        $t("segs", a, "section", ne.section), $t("segs", a, "material", ne.material_frame);
        const S = { A: ne.A_mod, Iz: ne.Iz_mod, Iy: ne.Iy_mod, J: ne.J_mod };
        (S.A !== 1 || S.Iz !== 1 || S.Iy !== 1 || S.J !== 1) && $t("segs", a, "modifiers", S), ne.insertionPoint !== "10 \u2014 Centroid" && $t("segs", a, "insertionPoint", ne.insertionPoint), ne.beta !== 0 && $t("segs", a, "beta", ne.beta);
        const A = [ne.relMxI, ne.relMyI, ne.relMzI], T = [ne.relMxJ, ne.relMyJ, ne.relMzJ];
        (A.some((W) => W) || T.some((W) => W)) && $t("segs", a, "releases", { i: A, j: T }), ne.hinges !== "None" && $t("segs", a, "hinges", ne.hinges);
        const N = [ne.LKx, ne.LKy, ne.LKz];
        N.some((W) => W !== 0) && $t("segs", a, "lineSprings", N);
        const D = [ne.qx, ne.qy, ne.qz];
        D.some((W) => W !== 0) && $t("segs", a, "distLoad", D), ne.massPerM !== 0 && $t("segs", a, "massPerM", ne.massPerM), re(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (l) {
      const w = ht.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${o.length}` });
      w.addBinding(ne, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), w.addBinding(ne, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), w.addBinding(ne, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ht.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ne, "surfLoad", { label: "q", step: 0.1 }), ht.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        $t("areas", o, "shellType", ne.shellType), $t("areas", o, "thickness", ne.thickness), $t("areas", o, "material", ne.material_shell), ne.surfLoad !== 0 && $t("areas", o, "surfLoad", ne.surfLoad), re(`\u2713 Propiedades aplicadas a ${o.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (r) {
      const w = ht.addFolder({ title: "\u2139 Selecci\xF3n" }), f = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      w.addBinding(f, "msg", { readonly: true, label: "" });
    }
    ht.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ge.clear(), nn();
    }), Gt.style.display = "block", Ws();
  };
  window.__hekatanRefreshPropsPane = Hs;
  let Jn = null, Io = false;
  F.addEventListener("pointerdown", (e) => {
    e.button === 2 && (Jn = { x: e.clientX, y: e.clientY }, Io = false);
  }), F.addEventListener("pointermove", (e) => {
    if (Jn && e.buttons & 2 && !Io) {
      const n = e.clientX - Jn.x, a = e.clientY - Jn.y;
      Math.hypot(n, a) > 8 && (Io = true);
    }
  }), F.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const n = Jn !== null && !Io;
      Jn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (n) {
        if (Ht ? Vo() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ge.size > 0 && (Ge.clear(), nn()), t.polylines) {
          const c = t.polylines.rawVal;
          (c[c.length - 1] ?? []).length > 0 && (t.polylines.val = [...c, []]);
        }
        const o = window.__hekatanCadState, s = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"), re(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : re("\u238B Cancelado (click derecho)");
      }
    }
  }), F.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), F.addEventListener("pointerdown", (e) => {
    var _a3, _b, _c;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    n !== "select" && n !== "none" && n || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (an = null, uo = false));
  }), F.addEventListener("pointermove", (e) => {
    if (Ht && e.buttons === 0) {
      const c = e.clientX < Ht.x;
      ra(Ht.x, Ht.y, e.clientX, e.clientY, c);
      return;
    }
    if (!an) return;
    const n = e.clientX - an.x, a = e.clientY - an.y, o = Math.hypot(n, a);
    if (!uo && o < 8) return;
    uo = true;
    const s = e.clientX < an.x;
    ra(an.x, an.y, e.clientX, e.clientY, s);
  }), F.addEventListener("pointerup", (e) => {
    if (!an) return;
    if (!uo) {
      an = null;
      return;
    }
    const n = e.ctrlKey || e.metaKey || e.shiftKey;
    Wa(an.x, an.y, e.clientX, e.clientY, n), an = null, uo = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Qt = new ut();
  Qt.visible = false, Qt.frustumCulled = false, g.add(Qt);
  const Ja = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, To = (e, n, a, o) => {
    var _a3, _b, _c, _d;
    for (window.__hekatanOsnapUltimo = { type: e, x: n, y: a, z: o }; Qt.children.length; ) {
      const i = Qt.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Ja[e] ?? 16777215, c = new Ae().setFromPoints([new E(-1, -1, 0), new E(1, -1, 0), new E(1, -1, 0), new E(1, 1, 0), new E(1, 1, 0), new E(-1, 1, 0), new E(-1, 1, 0), new E(-1, -1, 0)]);
    Qt.add(new jt(c, new ft({ color: s, linewidth: 2 }))), Qt.position.set(n, a, o), Qt.visible = true, ua();
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
    gn.textContent = o, gn.style.color = "#" + (Ja[e] ?? 16777215).toString(16).padStart(6, "0"), gn.style.left = n + 18 + "px", gn.style.top = a - 26 + "px", gn.style.display = "block";
  }, Os = () => {
    gn.style.display = "none";
  }, Dn = new E(), Bn = (e, n, a) => {
    const o = v();
    if (!o) return null;
    const s = F.getBoundingClientRect();
    return Dn.set(e, n, a).project(o), !isFinite(Dn.x) || !isFinite(Dn.y) || Dn.z < -1 || Dn.z > 1 ? null : { x: s.left + (Dn.x * 0.5 + 0.5) * s.width, y: s.top + (-Dn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = Bn;
  const Qs = (e, n, a, o, s) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const c = window.__hekatanOsnap, i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let r = null;
    const p = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, d = s, w = (u, x, b, L) => {
      let S;
      if (d) {
        const T = Bn(x, b, L);
        if (!T || (S = Math.hypot(T.x - d.x, T.y - d.y), S > zn)) return;
      } else if (S = Math.hypot(x - e, b - n, L - a), S > o) return;
      const A = p[u] ?? 9;
      (!r || A < r.r || A === r.r && S < r.d) && (r = { type: u, x, y: b, z: L, d: S, r: A });
    };
    if (c.ori !== false && w("ori", 0, 0, 0), c.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, x = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, b = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, L = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", S = (T) => Math.round(T / x) * x, A = (T, N) => Math.abs(T) <= b + 1e-9 && Math.abs(N) <= b + 1e-9;
      if (L === "xz") {
        const T = S(e), N = S(a);
        A(T, N) && w("grid", T, n, N);
      } else if (L === "yz") {
        const T = S(n), N = S(a);
        A(T, N) && w("grid", e, T, N);
      } else {
        const T = S(e), N = S(n);
        A(T, N) && w("grid", T, N, a);
        const D = window.__hekatanPlanosAux ?? [];
        for (const j of D.slice(0, 24)) {
          if (j.plano === "xy" || !isFinite(j.d)) continue;
          const me = j.plano === "xz" ? new E(0, 1, 0) : new E(1, 0, 0), ve = new yo(me, -j.d), We = new E();
          if ($.ray.intersectPlane(ve, We)) if (j.plano === "xz") {
            const De = S(We.x), Je = S(We.z);
            A(De, Je) && w("grid", De, j.d, Je);
          } else {
            const De = S(We.y), Je = S(We.z);
            A(De, Je) && w("grid", j.d, De, Je);
          }
        }
        const W = window.__hekatanLevels ?? [];
        if (W.length) {
          const j = $.ray, me = new yo(), ve = new E();
          for (const We of W.slice(0, 24)) {
            if (!isFinite(We == null ? void 0 : We.z) || Math.abs(We.z - a) < 1e-6 || (me.set(new E(0, 0, 1), -We.z), !j.intersectPlane(me, ve))) continue;
            const De = S(ve.x), Je = S(ve.y);
            A(De, Je) && w("grid", De, Je, We.z);
          }
        }
      }
    }
    (c.node || c.end) && i.forEach((u) => {
      c.node && w("node", u[0], u[1], u[2]);
    });
    for (const u of l) if (!(u.length < 2)) for (let x = 0; x < u.length - 1; x++) {
      const b = i[u[x]], L = i[u[x + 1]];
      if (!(!b || !L) && (c.end && (w("end", b[0], b[1], b[2]), w("end", L[0], L[1], L[2])), c.mid && w("mid", (b[0] + L[0]) / 2, (b[1] + L[1]) / 2, (b[2] + L[2]) / 2), c.nea || c.per)) {
        const S = L[0] - b[0], A = L[1] - b[1], T = L[2] - b[2], N = S * S + A * A + T * T;
        if (N < 1e-12) continue;
        const D = Math.max(0, Math.min(1, ((e - b[0]) * S + (n - b[1]) * A + (a - b[2]) * T) / N)), W = b[0] + D * S, j = b[1] + D * A, me = b[2] + D * T;
        c.nea && w("nea", W, j, me), c.per && w("per", W, j, me);
      }
    }
    if (c.cen) {
      const u = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const x of u) {
        const b = l[x];
        if (!b || b.length < 3) continue;
        const L = b[0] === b[b.length - 1] ? b.slice(0, -1) : b;
        let S = 0, A = 0, T = 0, N = 0;
        for (const D of L) {
          const W = i[D];
          W && (S += W[0], A += W[1], T += W[2], N++);
        }
        N >= 3 && w("cen", S / N, A / N, T / N);
      }
    }
    if (c.cen) {
      const u = Na(), x = [...zo];
      for (const b of u) x.some((L) => Math.hypot(L.c[0] - b.c[0], L.c[1] - b.c[1], L.c[2] - b.c[2]) < 1e-6 && Math.abs(L.r - b.r) < 1e-6) || x.push(b);
      for (const b of x) {
        if (!i.some((A) => Math.abs(Math.hypot(A[0] - b.c[0], A[1] - b.c[1], A[2] - b.c[2]) - b.r) < 1e-6)) continue;
        const S = Math.hypot(e - b.c[0], n - b.c[1], a - b.c[2]);
        if (S < o || Math.abs(S - b.r) < o) {
          const A = Math.min(S, o * 0.5), T = 3;
          (!r || T < r.r || T === r.r && A < r.d) && (r = { type: "cen", x: b.c[0], y: b.c[1], z: b.c[2], d: A, r: T });
        }
      }
    }
    if (c.int) {
      const u = [];
      for (const x of l) for (let b = 0; b < x.length - 1; b++) {
        const L = i[x[b]], S = i[x[b + 1]];
        if (!L || !S) continue;
        const A = S[0] - L[0], T = S[1] - L[1], N = S[2] - L[2], D = A * A + T * T + N * N;
        if (D < 1e-12) continue;
        const W = Math.max(0, Math.min(1, ((e - L[0]) * A + (n - L[1]) * T + (a - L[2]) * N) / D));
        Math.hypot(L[0] + W * A - e, L[1] + W * T - n, L[2] + W * N - a) < 3 * o && u.push([L, S]);
      }
      for (let x = 0; x < u.length; x++) for (let b = x + 1; b < u.length; b++) {
        const [L, S] = u[x], [A, T] = u[b], N = [S[0] - L[0], S[1] - L[1], S[2] - L[2]], D = [T[0] - A[0], T[1] - A[1], T[2] - A[2]], W = [L[0] - A[0], L[1] - A[1], L[2] - A[2]], j = N[0] * N[0] + N[1] * N[1] + N[2] * N[2], me = N[0] * D[0] + N[1] * D[1] + N[2] * D[2], ve = D[0] * D[0] + D[1] * D[1] + D[2] * D[2], We = N[0] * W[0] + N[1] * W[1] + N[2] * W[2], De = D[0] * W[0] + D[1] * W[1] + D[2] * W[2], Je = j * ve - me * me;
        if (Je < 1e-12) continue;
        const Fe = (me * De - ve * We) / Je, tt = (j * De - me * We) / Je;
        if (Fe < -1e-6 || Fe > 1 + 1e-6 || tt < -1e-6 || tt > 1 + 1e-6) continue;
        const Xe = [L[0] + Fe * N[0], L[1] + Fe * N[1], L[2] + Fe * N[2]], Ce = [A[0] + tt * D[0], A[1] + tt * D[1], A[2] + tt * D[2]];
        if (Math.hypot(Xe[0] - Ce[0], Xe[1] - Ce[1], Xe[2] - Ce[2]) > 1e-4) continue;
        [L, S, A, T].some((Oe) => Math.hypot(Oe[0] - Xe[0], Oe[1] - Xe[1], Oe[2] - Xe[2]) < 1e-6) || w("int", Xe[0], Xe[1], Xe[2]);
      }
    }
    const f = window.__hekatanAxisGrids ?? [], m = window.__hekatanLevels ?? [], M = f.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, x] of M) {
      c.end && (w("end", u[0], u[1], u[2]), w("end", x[0], x[1], x[2]));
      const b = x[0] - u[0], L = x[1] - u[1], S = x[2] - u[2], A = b * b + L * L + S * S;
      if (A < 1e-12) continue;
      const T = Math.max(0, Math.min(1, ((e - u[0]) * b + (n - u[1]) * L + (a - u[2]) * S) / A));
      if (c.nea && w("nea", u[0] + T * b, u[1] + T * L, u[2] + T * S), c.int && Math.abs(S) > 1e-9) for (const N of m) {
        const D = (N.z - u[2]) / S;
        D < -1e-6 || D > 1 + 1e-6 || w("int", u[0] + D * b, u[1] + D * L, N.z);
      }
    }
    if (c.int || c.node) for (let u = 0; u < M.length; u++) for (let x = u + 1; x < M.length; x++) {
      const [b, L] = M[u], [S, A] = M[x], T = L[0] - b[0], N = L[1] - b[1], D = A[0] - S[0], W = A[1] - S[1], j = T * W - N * D;
      if (Math.abs(j) < 1e-12) continue;
      const me = b[0] - S[0], ve = b[1] - S[1], We = (D * ve - W * me) / j, De = (T * ve - N * me) / j;
      if (We < -1e-6 || We > 1 + 1e-6 || De < -1e-6 || De > 1 + 1e-6) continue;
      const Je = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      w("int", b[0] + We * T, b[1] + We * N, typeof Je == "number" ? Je : a);
    }
    const k = window.__hekatanDrawingAuxLines, y = (k == null ? void 0 : k.rawVal) ?? (k == null ? void 0 : k.val) ?? k ?? [];
    for (const u of y) {
      if (u.length !== 6) continue;
      const x = [u[0], u[1], u[2]], b = [u[3], u[4], u[5]];
      if (c.end && (w("end", x[0], x[1], x[2]), w("end", b[0], b[1], b[2])), c.mid && w("mid", (x[0] + b[0]) / 2, (x[1] + b[1]) / 2, (x[2] + b[2]) / 2), c.nea || c.per) {
        const L = b[0] - x[0], S = b[1] - x[1], A = b[2] - x[2], T = L * L + S * S + A * A;
        if (T < 1e-12) continue;
        const N = Math.max(0, Math.min(1, ((e - x[0]) * L + (n - x[1]) * S + (a - x[2]) * A) / T)), D = x[0] + N * L, W = x[1] + N * S, j = x[2] + N * A;
        c.nea && w("nea", D, W, j), c.per && w("per", D, W, j);
      }
    }
    return r ? { type: r.type, x: r.x, y: r.y, z: r.z } : null;
  }, On = new ut();
  On.frustumCulled = false, g.add(On);
  const Oa = new ft({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Qa = 0;
  const ja = () => {
    var _a3, _b;
    for (const e of On.children.slice()) On.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (e) => {
    var _a3, _b;
    ja();
    const n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of e || []) {
      const c = String(s).split(":");
      let i = [];
      if (c[0] === "pt") {
        const p = n[+c[1]];
        p && (i = [p, [p[0] + 1e-3, p[1], p[2]]]);
      } else if (c[0] === "seg") {
        const p = a[+c[1]] || [], d = n[p[+c[2]]], w = n[p[+c[2] + 1]];
        d && w && (i = [d, w]);
      } else c[0] === "poly" && (i = (a[+c[1]] || []).map((d) => n[d]).filter(Boolean));
      if (i.length < 2) continue;
      const l = new Ae().setFromPoints(i.map((p) => new E(p[0], p[1], p[2]))), r = new Et(l, Oa);
      r.renderOrder = 1200, On.add(r);
    }
    if (!On.children.length) return;
    Qa = performance.now() + 900;
    const o = () => {
      const s = Qa - performance.now();
      if (s <= 0) {
        ja(), z();
        return;
      }
      Oa.opacity = Math.min(1, s / 900) * 0.95, z(), requestAnimationFrame(o);
    };
    requestAnimationFrame(o);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a3;
    const n = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
    Array.isArray(n) && n.length && window.__hekatanDestello(n);
  }), window.__hekatanOsnapCompute = Qs, window.__hekatanOsnapShow = To, window.__hekatanOsnapHide = Ro;
  let Ke = [], Ct = 0, Nn = 0, Bt = null;
  const fo = document.createElement("div");
  fo.id = "hk-cad-status", fo.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", fo.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(fo);
  const js = () => {
    var _a3, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), zt && e.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && e.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, re = (e) => {
    var _a3;
    const n = e + js();
    fo.textContent = n, window.__hekatanCadStatusText = n;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, ei = "Comando:", ti = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", n = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], a = n.length ? n[n.length - 1] : [], o = Ke.length, s = (c, i = []) => ({ txt: c, ops: i });
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
        return Ge.size ? s(o ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ge.size ? s(o ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ge.size ? s(`SELECCI\xD3N ${Ge.size} objeto${Ge.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
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
    re(n);
  }, window.__hekatanCadResetPending = () => {
    Ke = [], at = [], Ie.visible = false, pa(), Bt = null, z(), re("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Jt();
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
  }, es = (e) => {
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
    Ke = [], qe.visible = false, Xt.visible = false, pn();
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
      re("\u21B6 Nada para deshacer");
      return;
    }
    Bo.push(fa()), es(e), re(`\u21B6 Deshacer \u2014 quedan ${Qn.length}`);
  }, ts = () => {
    const e = Bo.pop();
    if (!e) {
      re("\u21B7 Nada para rehacer");
      return;
    }
    Qn.push(fa()), es(e), re(`\u21B7 Rehacer \u2014 quedan ${Bo.length}`);
  };
  window.__hekatanPushUndo = St, window.__hekatanUndo = No, window.__hekatanRedo = ts, document.addEventListener("keydown", (e) => {
    var _a3;
    const n = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (n === "y" || n === "z" && e.shiftKey))) return;
    const o = e.target;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && (((_a3 = o.value) == null ? void 0 : _a3.length) ?? 0) > 0 && o.__hkSucio || (e.preventDefault(), e.stopPropagation(), ts());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a3, _b, _c, _d, _e2;
    const n = e.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    if (a !== "line" && a !== "polyline") return n === "u" || n === "deshacer" || n === "undo" ? (No(), true) : false;
    if (n === "c" || n === "cerrar" || n === "close") {
      if (s.length < 3) return re("Cerrar necesita al menos tres puntos."), true;
      St(), t.polylines.val = [...o.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ha(), re(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (n === "u" || n === "deshacer" || n === "undo") {
      if (!s.length) return No(), true;
      St();
      const c = s[s.length - 1], i = s.slice(0, -1), l = o.some((d, w) => w !== o.length - 1 && d.includes(c)) || i.includes(c);
      let r = t.points.rawVal, p = [...o.slice(0, -1), i];
      if (!l && c === r.length - 1 && (r = r.slice(0, -1), t.points.val = r), t.polylines.val = p, i.length) {
        const d = r[i[i.length - 1]];
        d && (Ye = [d[0], d[1], d[2]]);
      } else Ye = null, qe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return z(), re(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${i.length}.`), Jt(), true;
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
    Ke = [], Bt = null, pa(), zt = null, La(), qe.visible = false, Xt.visible = false, pn(), re("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), z(), Jt();
  };
  window.__hekatanFinalizeDraw = ha;
  const ns = () => {
    var _a3, _b, _c;
    Ke = [], at = [], Ie.visible = false;
    let e = false;
    Ge.size && (Ge.clear(), nn(), e = true), ha();
    try {
      const n = window.__hekatanCadState, a = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"));
    } catch {
    }
    re(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), z(), Jt();
  };
  window.__hekatanEscapeCancel = ns;
  const os = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Set();
    return Ge.forEach((a) => {
      if (a.startsWith("pt:")) n.add(+a.slice(3));
      else if (a.startsWith("poly:")) (e[+a.slice(5)] || []).forEach((o) => n.add(o));
      else if (a.startsWith("seg:")) {
        const o = a.split(":"), s = e[+o[1]] || [], c = s[+o[2]], i = s[+o[2] + 1];
        c != null && n.add(c), i != null && n.add(i);
      }
    }), n;
  }, as = (e, n, a) => {
    var _a3;
    const o = os();
    if (!o.size) return 0;
    St();
    const s = t.points.rawVal.map((c, i) => o.has(i) ? [c[0] + e, c[1] + n, c[2] + a] : c);
    t.points.val = s;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return nn(), z(), o.size;
  };
  window.__hekatanMoveSelection = as;
  const ss = (e, n) => {
    var _a3, _b, _c, _d, _e2;
    if (!Ge.size) {
      re(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Jt();
      return;
    }
    if (Ke.push(n), Ke.length === 1) {
      Ye = n, re(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)}). Precise el segundo punto.`), Jt();
      return;
    }
    const [a, o] = Ke, s = [o[0] - a[0], o[1] - a[1], o[2] - a[2]];
    Ke = [], qe.visible = false;
    let c = 0;
    e === "move" ? c = as(s[0], s[1], s[2]) : (c = os().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), re(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${c} nudo${c === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (Ge.clear(), nn()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Jt();
  };
  window.__hekatanPasoMoverCopiar = ss;
  const ii = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Cn = (e, n) => Math.hypot(e[0] - n[0], e[1] - n[1], e[2] - n[2]), ma = (e, n, a, o, s, c) => {
    const i = [n[0] - e[0], n[1] - e[1], n[2] - e[2]], l = [o[0] - a[0], o[1] - a[1], o[2] - a[2]], r = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], p = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], d = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], w = l[0] * l[0] + l[1] * l[1] + l[2] * l[2], f = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], m = l[0] * r[0] + l[1] * r[1] + l[2] * r[2], M = p * w - d * d;
    if (M < 1e-12) return null;
    const k = (d * m - w * f) / M, y = (p * m - d * f) / M;
    if (!s && (k < -1e-6 || k > 1 + 1e-6) || !c && (y < -1e-6 || y > 1 + 1e-6)) return null;
    const u = [e[0] + k * i[0], e[1] + k * i[1], e[2] + k * i[2]], x = [a[0] + y * l[0], a[1] + y * l[1], a[2] + y * l[2]];
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
        re(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Bt = { poly: dn, seg: Math.max(0, Sn) }, re(e === "offset" ? `DESFASE l\xEDnea #${Bt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Nn > 0 ? ` (${Nn} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Jt();
      return;
    }
    if (e === "offset") {
      const k = Bt.poly, y = a[k];
      if (!y || y.length < 2) {
        Bt = null, re("DESFASE: esa polil\xEDnea no tiene tramos."), Jt();
        return;
      }
      const u = y.length > 2 && y[0] === y[y.length - 1], x = ii(), b = [];
      for (let Fe = 0; Fe < y.length - 1; Fe++) {
        const tt = o[y[Fe]], Xe = o[y[Fe + 1]], Ce = [Xe[0] - tt[0], Xe[1] - tt[1], Xe[2] - tt[2]], Ue = Math.hypot(Ce[0], Ce[1], Ce[2]) || 1, Oe = Ce[0] / Ue, mt = Ce[1] / Ue, vt = Ce[2] / Ue, Lt = [x[1] * vt - x[2] * mt, x[2] * Oe - x[0] * vt, x[0] * mt - x[1] * Oe], sn = Math.hypot(Lt[0], Lt[1], Lt[2]) || 1;
        b.push({ a: tt, b: Xe, n: [Lt[0] / sn, Lt[1] / sn, Lt[2] / sn] });
      }
      let L = 0, S = 1 / 0;
      b.forEach((Fe, tt) => {
        const Xe = ao(n[0], n[1], n[2], Fe.a[0], Fe.a[1], Fe.a[2], Fe.b[0], Fe.b[1], Fe.b[2]);
        Xe < S && (S = Xe, L = tt);
      });
      const A = b[L], T = Math.sign((n[0] - A.a[0]) * A.n[0] + (n[1] - A.a[1]) * A.n[1] + (n[2] - A.a[2]) * A.n[2]) || 1, N = Nn > 0 ? Nn : S;
      if (N < 1e-6) {
        re("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const D = b.map((Fe) => ({ a: [Fe.a[0] + T * N * Fe.n[0], Fe.a[1] + T * N * Fe.n[1], Fe.a[2] + T * N * Fe.n[2]], b: [Fe.b[0] + T * N * Fe.n[0], Fe.b[1] + T * N * Fe.n[1], Fe.b[2] + T * N * Fe.n[2]] })), W = D.length, j = (Fe) => {
        const tt = D[(Fe - 1 + W) % W], Xe = D[Fe % W];
        return ma(tt.a, tt.b, Xe.a, Xe.b, true, true) ?? Xe.a;
      }, me = [], ve = u ? W : W + 1;
      for (let Fe = 0; Fe < ve; Fe++) !u && Fe === 0 ? me.push(D[0].a) : !u && Fe === W ? me.push(D[W - 1].b) : me.push(j(Fe));
      St();
      const We = o.length;
      t.points.val = [...o, ...me];
      const De = me.map((Fe, tt) => We + tt);
      u && De.push(We);
      let Je = a.slice();
      Je.length && Je[Je.length - 1].length === 0 && (Je = Je.slice(0, -1)), t.polylines.val = [...Je, De, []], Bt = null, re(`\u2713 Desfase a ${N.toFixed(2)} m \u2014 ${W} tramo${W === 1 ? "" : "s"} nuevo${W === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      z(), Jt();
      return;
    }
    let c = dn, i = Math.max(0, Sn);
    if (c < 0 || c === Bt.poly && i === Bt.seg) {
      let y = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (c = -1, a.forEach((u, x) => {
        for (let b = 0; b < u.length - 1; b++) {
          if (x === Bt.poly && b === Bt.seg) continue;
          const L = o[u[b]], S = o[u[b + 1]];
          if (!L || !S) continue;
          const A = ao(n[0], n[1], n[2], L[0], L[1], L[2], S[0], S[1], S[2]);
          A < y && (y = A, c = x, i = b);
        }
      }), c < 0) {
        re(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const l = a[Bt.poly], r = o[l[Bt.seg]], p = o[l[Bt.seg + 1]], d = a[c], w = d[i], f = d[i + 1];
    if (!r || !p || w == null || f == null) {
      re(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const m = o[w], M = o[f];
    if (e === "trim") {
      const k = ma(m, M, r, p, false, false);
      if (!k) {
        re("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      St();
      const y = o.length;
      t.points.val = [...o, k];
      const u = [...d.slice(0, i + 1), y, ...d.slice(i + 1)];
      t.polylines.val = a.map((b, L) => L === c ? u : b);
      const x = Cn(n, m) < Cn(n, M);
      Ra(c, x ? i : i + 1), re(`\u2713 Recortado en (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const k = ma(m, M, r, p, true, false);
      if (!k) {
        re("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = Cn(n, m) < Cn(n, M) ? i : i + 1;
      if (u !== 0 && u !== d.length - 1) {
        re("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = d[u];
      if (Cn(k, m) + Cn(k, M) < Cn(m, M) + 1e-6) {
        re("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (St(), li(x) > 1) {
        const L = o.length;
        t.points.val = [...o, k];
        const S = d.slice();
        S[u] = L, t.polylines.val = a.map((A, T) => T === c ? S : A);
      } else t.points.val = o.map((L, S) => S === x ? k : L);
      re(`\u2713 Alargada hasta (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    z(), Jt();
  };
  window.__hekatanSelectionSize = () => Ge.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let n = e.length - 1;
    for (; n >= 0 && (!e[n] || e[n].length < 2); ) n--;
    return Ge.clear(), n >= 0 && Ge.add(`poly:${n}`), nn(), re(n >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ge.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    Ge.clear();
    const a = /* @__PURE__ */ new Set();
    return e.forEach((o, s) => {
      !o || o.length < 2 || (Ge.add(`poly:${s}`), o.forEach((c) => a.add(c)));
    }), n.forEach((o, s) => {
      a.has(s) || Ge.add(`pt:${s}`);
    }), nn(), re(`SELECCI\xD3N ${Ge.size} objetos (todo el modelo) \xB7 Esc suelta`), Ge.size;
  }, window.__hekatanReplicateSelection = (e, n, a, o, s = 0) => {
    var _a3, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1)), s = Math.max(0, Math.round(s || 0));
    const c = [...Ge], i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), p = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), w = [];
    if (c.forEach((y) => {
      if (y.startsWith("pt:")) {
        const u = +y.slice(3);
        i[u] && p.add(u);
      } else if (y.startsWith("poly:")) {
        const u = +y.slice(5);
        if (!l[u] || l[u].length < 2) return;
        d.add(u), l[u].forEach((x) => p.add(x));
      } else if (y.startsWith("seg:")) {
        const u = y.split(":"), x = +u[1], b = +u[2], L = l[x] || [], S = L[b], A = L[b + 1];
        S != null && A != null && (w.push([S, A]), p.add(S), p.add(A));
      }
    }), !p.size) return 0;
    St();
    const f = [...i];
    let m = l.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const M = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], k = [...p];
    for (let y = 1; y <= o; y++) {
      const u = s + y, x = e * u, b = n * u, L = a * u, S = /* @__PURE__ */ new Map();
      k.forEach((A) => {
        S.set(A, f.length), f.push([i[A][0] + x, i[A][1] + b, i[A][2] + L]);
      }), d.forEach((A) => {
        const T = l[A].map((D) => S.has(D) ? S.get(D) : D), N = m.length;
        m.push(T), r.has(A) && M.push(N);
      }), w.forEach(([A, T]) => {
        m.push([S.get(A), S.get(T)]);
      });
    }
    m.push([]), t.points.val = f, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = M);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return z(), o;
  }, window.__hekatanExtrudeSelection = (e, n, a, o) => {
    var _a3, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1));
    const s = [...Ge], c = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), r = /* @__PURE__ */ new Set(), p = [], d = /* @__PURE__ */ new Set();
    for (const x of i) for (const b of x) d.add(b);
    if (s.forEach((x) => {
      if (x.startsWith("poly:")) {
        const b = +x.slice(5);
        if (l.has(b)) return;
        const L = i[b] || [];
        for (let S = 0; S + 1 < L.length; S++) p.push([L[S], L[S + 1]]), d.add(L[S]), d.add(L[S + 1]);
      } else if (x.startsWith("seg:")) {
        const b = x.split(":"), L = +b[1], S = +b[2], A = i[L] || [], T = A[S], N = A[S + 1];
        T != null && N != null && (p.push([T, N]), d.add(T), d.add(N));
      }
    }), s.forEach((x) => {
      if (x.startsWith("pt:")) {
        const b = +x.slice(3);
        c[b] && !d.has(b) && r.add(b);
      }
    }), !r.size && !p.length) return { lineas: 0, areas: 0 };
    St();
    const w = [...c];
    let f = i.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const m = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], M = /* @__PURE__ */ new Map(), k = (x, b) => {
      if (b === 0) return x;
      const L = x + ":" + b;
      let S = M.get(L);
      if (S == null) {
        const A = [c[x][0] + e * b, c[x][1] + n * b, c[x][2] + a * b];
        S = w.findIndex((T) => Math.abs(T[0] - A[0]) < 1e-3 && Math.abs(T[1] - A[1]) < 1e-3 && Math.abs(T[2] - A[2]) < 1e-3), S < 0 && (S = w.length, w.push(A)), M.set(L, S);
      }
      return S;
    };
    let y = 0, u = 0;
    r.forEach((x) => {
      const b = [x];
      for (let L = 1; L <= o; L++) b.push(k(x, L));
      f.push(b), y += o;
    }), p.forEach(([x, b]) => {
      for (let L = 1; L <= o; L++) {
        const S = [k(x, L - 1), k(b, L - 1), k(b, L), k(x, L)];
        m.push(f.length), f.push([...S, S[0]]), u++;
      }
    }), f.push([]), t.points.val = w, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = m);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return z(), { lineas: y, areas: u };
  }, window.__hekatanVoladoSelection = (e, n = {}) => {
    var _a3, _b, _c;
    const a = Number(e);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const o = n.losa !== false, s = n.vigaBorde !== false, c = n.lados === "afuera" ? "afuera" : "ambos", i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = [];
    if ([...Ge].forEach((k) => {
      if (k.startsWith("seg:")) {
        const y = k.split(":"), u = +y[1], x = +y[2], b = l[u] || [], L = b[x], S = b[x + 1];
        L != null && S != null && r.push([L, S]);
      } else if (k.startsWith("poly:")) {
        const y = l[+k.slice(5)] || [];
        for (let u = 0; u + 1 < y.length; u++) r.push([y[u], y[u + 1]]);
      }
    }), !r.length) return 0;
    let p = 0, d = 0;
    for (const k of i) p += k[0], d += k[1];
    p /= Math.max(1, i.length), d /= Math.max(1, i.length), St();
    const w = [...i];
    let f = l.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const m = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let M = 0;
    for (const [k, y] of r) {
      const u = i[k], x = i[y];
      if (!u || !x) continue;
      const b = x[0] - u[0], L = x[1] - u[1], S = Math.hypot(b, L);
      if (S < 1e-6) continue;
      let A = -L / S, T = b / S;
      const N = (u[0] + x[0]) / 2, D = (u[1] + x[1]) / 2;
      (N - p) * A + (D - d) * T < 0 && (A = -A, T = -T);
      const W = c === "ambos" ? [1, -1] : [1];
      for (const j of W) {
        const me = A * a * j, ve = T * a * j, We = w.length;
        w.push([u[0] + me, u[1] + ve, u[2]]);
        const De = w.length;
        w.push([x[0] + me, x[1] + ve, x[2]]), f.push([k, We]), f.push([y, De]), s && f.push([We, De]), o && (m.push(f.length), f.push([k, y, De, We, k])), M++;
      }
    }
    if (!M) return 0;
    f.push([]), t.points.val = w, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = m);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), M;
  }, F.addEventListener("click", (e) => {
    var _a3, _b, _c;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Rn > 5) {
      Rn = 0;
      return;
    }
    Rn = 0;
    const n = B(e);
    if (!n) return;
    $.setFromCamera(Y, n);
    const a = !!(Rt && Math.abs(e.clientX - Rt.x) <= 3 && Math.abs(e.clientY - Rt.y) <= 3), o = a ? [{ point: Rt.p.clone(), distance: n.position.distanceTo(Rt.p) }] : Re();
    if (!o.length) return;
    if (!a) {
      const c = n.position.distanceTo(_.target) || 1, i = o[0].distance ?? n.position.distanceTo(o[0].point), l = o[0].point;
      if (!isFinite(l.x) || !isFinite(l.y) || !isFinite(l.z) || i > Math.max(c * 12, 300)) {
        re("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let s = o[0].point;
    (e.ctrlKey || e.metaKey) && (s = new E(Math.round(o[0].point.x), Math.round(o[0].point.y), Math.round(o[0].point.z)));
    {
      const c = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = c[c.length - 1] ?? [], l = t.points.rawVal ?? [];
      if (i.length > 0) {
        const r = l[i[i.length - 1]];
        if (r) {
          const p = !!window.__hekatanOrthoMode;
          let d = zt;
          if (!d && p) {
            const w = Math.abs(s.x - r[0]), f = Math.abs(s.y - r[1]), m = Math.abs(s.z - r[2]);
            d = w >= f && w >= m ? "x" : f >= m ? "y" : "z";
          }
          d === "x" ? s = new E(s.x, r[1], r[2]) : d === "y" ? s = new E(r[0], s.y, r[2]) : d === "z" && (s = new E(r[0], r[1], s.z));
        }
      }
    }
    if (Rt && Math.abs(e.clientX - Rt.x) <= 3 && Math.abs(e.clientY - Rt.y) <= 3) s = Rt.p.clone();
    else if (Mo) s = Mo.clone(), re(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
    else {
      const c = aa(s), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, s.x, s.y, s.z, c, { x: e.clientX, y: e.clientY });
      if (i) s = new E(i.x, i.y, i.z), re(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const l = window.__hekatanSnapEnabled !== false, r = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        l && r > 0 && (s = new E(Math.round(s.x / r) * r, Math.round(s.y / r) * r, Math.round(s.z / r) * r));
      }
    }
    is(s, e);
  });
  const is = (e, n) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (xn) {
        Ht && Vo();
        const { kind: i, a: l, b: r } = xn, p = r !== void 0 ? `${i}:${l}:${r}` : `${i}:${l}`;
        !!n && (n.ctrlKey || n.metaKey || n.shiftKey) || Ge.clear(), Ge.has(p) ? Ge.delete(p) : Ge.add(p), nn(), re(`\u2713 Seleccionados ${Ge.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!n && (n.ctrlKey || n.metaKey || n.shiftKey), l = (n == null ? void 0 : n.clientX) ?? 0, r = (n == null ? void 0 : n.clientY) ?? 0;
        Ht ? (Wa(Ht.x, Ht.y, l, r, i), Ht = null) : i || (Ht = { x: l, y: r }, re("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), ra(l, r, l + 1, r + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const i = window.__hekatanAxisDraw;
      if (!i) return;
      if (!i.pendingStart) {
        i.pendingStart = [e.x, e.y, e.z], re(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const l = i.mode === "number", r = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, i.pendingStart, [e.x, e.y, e.z], l);
      re(`\u2713 Eje "${r}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      ss(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "delete") {
      if (Pn >= 0) {
        const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], r = Pn;
        if (r >= 0 && r < l.length) {
          St();
          const p = l.slice(0, r).concat(l.slice(r + 1));
          i && typeof i == "object" && "val" in i ? i.val = p : window.__hekatanDrawingAuxLines = p, re(`\u{1F5D1} L\xEDnea auxiliar #${r + 1} borrada`), Pn = -1, qt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (dn >= 0) {
        const i = dn, l = Sn;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (Po(i), re(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (Ra(i, l), re(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : (Po(i), re(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else re("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        re("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, l] = Ke, r = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), p = Math.abs(l[0] - i[0]), d = Math.abs(l[1] - i[1]), w = Math.abs(l[2] - i[2]), f = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), M = (f === "xy" ? w < 1e-3 : f === "xz" ? d < 1e-3 : f === "yz" ? p < 1e-3 : false) ? f : w < 1e-3 ? "xy" : d < 1e-3 ? "xz" : "yz", k = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], r, k, M), re(`\u2713 C\xEDrculo dibujado en ${M.toUpperCase()} \u2014 r=${r.toFixed(2)}m, ${k} segmentos`), Ke = [];
      try {
        (_l2 = window.__hekatanRebuild) == null ? void 0 : _l2.call(window);
      } catch {
      }
      return;
    }
    if (a === "ifcface") {
      if (!J) {
        re("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!J.plana) {
        re("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const i = X(J.m), l = oe(i, J.tris);
      if (l.length < 3) {
        re("\u25A6 No se pudo cerrar el contorno de la cara.");
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
      St(), at = M.map((b) => [b.x, b.y, b.z]);
      const k = Eo();
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
      re(`\u25A6 \xC1rea desde la cara del IFC: ${l.length} v\xE9rtices, ${k} shell(s). Espesor medido ${p ? p.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${x}; formulaci\xF3n ${u}, t = ${f.toFixed(2)} m.`), pe(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      z();
      return;
    }
    if (a === "ifcline") {
      if (!ye || ye.length < 2) {
        re("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = V(ye);
      St();
      const l = t.points.rawVal, r = [], p = [];
      for (const w of i) {
        let f = l.findIndex((m) => Math.abs(m[0] - w[0]) < 1e-3 && Math.abs(m[1] - w[1]) < 1e-3 && Math.abs(m[2] - w[2]) < 1e-3);
        f < 0 && (f = l.length + p.length, p.push(w)), r.push(f);
      }
      if (t.points.val = [...l, ...p], t.polylines) {
        const w = t.polylines.rawVal, f = w.length && w[w.length - 1].length === 0 ? w.slice(0, -1) : w;
        t.polylines.val = [...f, r, []];
      }
      const d = ye.reduce((w, f, m) => m ? w + f.distanceTo(ye[m - 1]) : 0, 0);
      re(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${d.toFixed(2)} m de desarrollo.`), Z(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      z();
      return;
    }
    if (a === "arc") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        re("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ke.length === 2) {
        re("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [i, l, r] = Ke, p = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, l, r, p), re(`\u2713 Arco dibujado \u2014 ${p} segmentos`), Ke = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "parabola" || a === "cubica") {
      const i = a === "parabola" ? 3 : 4, l = a === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Ke.push([e.x, e.y, e.z]), Ke.length < i) {
        re(`\u223F ${l} \u2014 punto ${Ke.length}/${i} OK. Marc\xE1 el ${Ke.length + 1}\xBA.`);
        return;
      }
      const r = window.__hekatanArcSegs ?? 12, p = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Ke.slice(), r);
      if (!(p == null ? void 0 : p.ok)) {
        re(`\u26A0 ${l}: ${(p == null ? void 0 : p.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Ke = [];
        return;
      }
      const d = "xyz"[p.ia ?? 0], w = "xyz"[p.io ?? 2], f = (p.coef ?? []).map((m, M) => `${m >= 0 && M ? "+" : ""}${m.toFixed(3)}${M ? "\xB7" + d + (M > 1 ? "^" + M : "") : ""}`).join(" ");
      re(`\u2713 ${l} dibujada en ${String(p.plano ?? "").toUpperCase()} \u2014 ${r} tramos a \u0394 igual de ${d} \xB7 ${w} = ${f}`), Ke = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (a === "revolve") {
      const i = Math.round(window.__hekatanRevSectores ?? 16), l = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, i, 360);
      if (l == null ? void 0 : l.msg) {
        re(`\u26A0 Revoluci\xF3n: ${l.msg}.`);
        return;
      }
      re(`\u2713 Revoluci\xF3n: ${l.anillos} anillo(s) \xD7 ${i} sectores \u2192 ${l.areas} pa\xF1o(s) Q4${l.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${l.guias ? ` ${l.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (a === "loft") {
      const i = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, e.x, e.y);
      if (i == null ? void 0 : i.msg) {
        re(`\u26A0 Barrido: ${i.msg}.`);
        return;
      }
      re(`\u2713 Barrido: contorno de ${i.contorno} lados \xD7 perfil de ${i.perfil} puntos \u2192 ${i.areas} pa\xF1o(s) Q4. Eje por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${i.guias ? ` ${i.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        re("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Ke;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, l), re(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Ke = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const l = (Rt && Math.abs(Rt.x - n.clientX) < 3 && Math.abs(Rt.y - n.clientY) < 3 ? [Rt.p.x, Rt.p.y, Rt.p.z] : null) ?? rt(n);
      if (!l) return;
      if (pt.length >= 2 && (pt = []), pt.push(l), pt.length === 1) it.visible = false, Ft(), re("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [r, p] = pt;
        it.geometry.setFromPoints([new E(r[0], r[1], r[2]), new E(p[0], p[1], p[2])]), it.visible = true;
        const d = Math.hypot(p[0] - r[0], p[1] - r[1], p[2] - r[2]), w = Math.hypot(p[0] - r[0], p[1] - r[1]);
        et.textContent = `${d.toFixed(3)} m`, Ft(), re(`\u{1F4CF} Distancia ${d.toFixed(3)} m  \xB7  \u0394x ${(p[0] - r[0]).toFixed(3)}  \u0394y ${(p[1] - r[1]).toFixed(3)}  \u0394z ${(p[2] - r[2]).toFixed(3)}  \xB7  en planta ${w.toFixed(3)} m`);
      }
      z();
      return;
    }
    if (a === "fillarea") {
      const i = t.points.rawVal, l = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], r = /* @__PURE__ */ new Map(), p = (N, D) => {
        N !== D && ((r.get(N) ?? r.set(N, /* @__PURE__ */ new Set()).get(N)).add(D), (r.get(D) ?? r.set(D, /* @__PURE__ */ new Set()).get(D)).add(N));
      };
      for (const N of l) for (let D = 0; D + 1 < N.length; D++) p(N[D], N[D + 1]);
      const d = (N, D) => {
        var _a4;
        return !!((_a4 = r.get(N)) == null ? void 0 : _a4.has(D));
      }, w = /* @__PURE__ */ new Set(), f = [], m = [...r.keys()];
      for (const N of m) for (const D of r.get(N)) if (!(D < N)) {
        for (const W of r.get(D)) if (W !== N) for (const j of r.get(W)) {
          if (j === N || j === D || !d(j, N) || d(N, W) || d(D, j)) continue;
          const me = [N, D, W, j].slice().sort((ve, We) => ve - We).join("-");
          w.has(me) || (w.add(me), f.push([N, D, W, j]));
        }
      }
      for (const N of m) for (const D of r.get(N)) if (!(D < N)) for (const W of r.get(D)) {
        if (W === N || !d(W, N)) continue;
        const j = [N, D, W].slice().sort((me, ve) => me - ve).join("-");
        w.has(j) || (w.add(j), f.push([N, D, W]));
      }
      const M = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", k = (N) => M === "xy" ? [N[0], N[1]] : M === "xz" ? [N[0], N[2]] : [N[1], N[2]], y = k([e.x, e.y, e.z]), u = (N, D) => {
        let W = false;
        for (let j = 0, me = D.length - 1; j < D.length; me = j++) {
          const ve = D[j][0], We = D[j][1], De = D[me][0], Je = D[me][1];
          We > N[1] != Je > N[1] && N[0] < (De - ve) * (N[1] - We) / (Je - We) + ve && (W = !W);
        }
        return W;
      }, x = (N) => {
        let D = 0;
        for (let W = 0, j = N.length - 1; W < N.length; j = W++) D += (N[j][0] + N[W][0]) * (N[j][1] - N[W][1]);
        return Math.abs(D) / 2;
      };
      let b = null, L = 1 / 0;
      for (const N of f) {
        const D = N.map((j) => k(i[j]));
        if (!u(y, D)) continue;
        const W = x(D);
        W < L && (L = W, b = N);
      }
      if (!b) {
        re("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const S = b.slice().sort((N, D) => N - D).join("-"), A = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (A.some((N) => {
        const D = l[N] ?? [];
        return [...new Set(D)].sort((W, j) => W - j).join("-") === S;
      })) {
        re("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...l, [...b, b[0]]], t.areas.val = [...A, l.length], re(`\u2713 \xC1rea creada por relleno (${b.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        re("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Ke;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), re(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Ke = [];
      return;
    }
    if (a === "polyarea") {
      at.push([e.x, e.y, e.z]), Ie.geometry.setFromPoints(at.map((i) => new E(i[0], i[1], i[2]))), Ie.visible = at.length >= 1, re(`\u25B0 \xC1rea libre \u2014 ${at.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), z();
      return;
    }
    if (a === "plane3") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length < 3) {
        re(`\u25E3 Plano inclinado \u2014 punto ${Ke.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [i, l, r] = Ke, p = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, l, r);
      re(p ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ke = [];
      return;
    }
    if (a === "col") {
      St();
      const i = e.z, l = Ct && Ct > 0 ? Ct : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + l]];
      const r = t.polylines.rawVal, p = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [p - 2, p - 1], []], Ct = 0, re(`\u258C Columna creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        re("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [i, l] = Ke, r = Ct && Ct > 0 ? Ct : 3;
      St();
      const p = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [l[0], l[1], l[2]], [l[0], l[1], l[2] + r], [i[0], i[1], i[2] + r]];
      const d = t.polylines.rawVal;
      if (d.length - 1, t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [p, p + 1, p + 2, p + 3, p], []], t.areas) {
        const w = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, w];
      }
      re(`\u25A5 Pared Q4 creada \u2014 h=${r.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ke = [], Ct = 0;
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
      const r = t.polylines.rawVal, p = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [p - 2, p - 1], []], Ct = 0, re(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = ea(e.x, e.y, e.z, i);
      if (!l) {
        re("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const r = t.polylines.rawVal, p = t.points.rawVal, d = r[l.polyIdx], w = p[d[l.segIdx]], f = p[d[l.segIdx + 1]];
      if (!w || !f) {
        re("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const m = Ct && Ct > 0 ? Ct : 3;
      St();
      const M = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [w[0], w[1], w[2]], [f[0], f[1], f[2]], [f[0], f[1], f[2] + m], [w[0], w[1], w[2] + m]];
      const k = t.polylines.rawVal;
      if (t.polylines.val = [...k.slice(0, -1), ...k[k.length - 1].length > 0 ? [k[k.length - 1]] : [], [M, M + 1, M + 2, M + 3, M], []], t.areas) {
        const y = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, y];
      }
      Ct = 0, re(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${m.toFixed(2)}m`);
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
      re(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        re("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, l] = Ke, r = window.__hekatanDrawingAuxLines;
      if (r) {
        St();
        const m = r.rawVal ?? r.val ?? [];
        r.val = [...m, [i[0], i[1], i[2], l[0], l[1], l[2]]];
      }
      const p = l[0] - i[0], d = l[1] - i[1], w = l[2] - i[2], f = Math.sqrt(p * p + d * d + w * w);
      re(`\u2713 L\xEDnea auxiliar creada \u2014 L=${f.toFixed(2)}m (cyan, no FEM)`), Ke = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      ci(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "chaflan") {
      if (Ke.push([e.x, e.y, e.z]), Ke.length === 1) {
        re("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Ke, r = window.__hekatanChaflanR ?? 1, p = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, r, p, 6);
      const d = Math.abs(l[0] - i[0]).toFixed(1), w = Math.abs(l[1] - i[1]).toFixed(1);
      re(`\u2713 Losa con chaflanes dibujada \u2014 ${d}\xD7${w}m, r=${r}m, ${p} seg/chafl\xE1n`), Ke = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    je = false, St();
    const o = e.toArray(), s = t.points.rawVal;
    let c = s.findIndex((i) => Math.abs(i[0] - o[0]) < 1e-3 && Math.abs(i[1] - o[1]) < 1e-3 && Math.abs(i[2] - o[2]) < 1e-3);
    if (c < 0 && (t.points.val = [...s, o], c = t.points.rawVal.length - 1), t.polylines && a !== "node") {
      const i = t.polylines.rawVal, l = i.length ? i[i.length - 1] : [];
      l.length && l[l.length - 1] === c ? t.polylines.val = [...i, [c]] : t.polylines.val = [...i.slice(0, -1), [...l, c]];
    }
    if (t.polylines) {
      const i = t.polylines.rawVal, l = i.length - 1, r = i[l] ?? [];
      if (a === "line" && r.length >= 2) {
        re(`\uFF0F L\xEDnea \u2014 ${r.length - 1} tramo${r.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && r.length === 4) {
        t.polylines.val = [...i.slice(0, -1), [...r, r[0]], []], t.areas && (t.areas.val = [...t.areas.rawVal, l]), re("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") re(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
    else if (a === "line") re("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") re("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const i = ((_R = t.polylines) == null ? void 0 : _R.rawVal[t.polylines.rawVal.length - 1]) ?? [];
      re(`\u25A6 \xC1rea \u2014 click ${i.length}/4. Marc\xE1 ${4 - i.length} v\xE9rtice${4 - i.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  F.addEventListener("click", () => Jt()), F.addEventListener("contextmenu", (e) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && at.length >= 3) {
      e.preventDefault();
      const a = Eo();
      re(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), F.addEventListener("pointermove", (e) => {
    var _a3, _b, _c;
    const n = B(e);
    if (!n) return;
    $.setFromCamera(Y, n);
    const a = Re();
    if (He.geometry.deleteAttribute("position"), a.length) {
      let o = a[0].point.clone();
      (e.ctrlKey || e.metaKey) && o.set(Math.round(o.x), Math.round(o.y), Math.round(o.z));
      {
        const i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = i[i.length - 1] ?? [], r = t.points.rawVal ?? [];
        if (l.length > 0) {
          const p = r[l[l.length - 1]];
          if (p) {
            const d = !!window.__hekatanOrthoMode;
            let w = zt;
            if (!w && d) {
              const f = Math.abs(o.x - p[0]), m = Math.abs(o.y - p[1]), M = Math.abs(o.z - p[2]);
              w = f >= m && f >= M ? "x" : m >= M ? "y" : "z";
            }
            w === "x" ? o.set(o.x, p[1], p[2]) : w === "y" ? o.set(p[0], o.y, p[2]) : w === "z" && o.set(p[0], p[1], o.z);
          }
        }
      }
      const s = aa(o), c = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, o.x, o.y, o.z, s, { x: e.clientX, y: e.clientY });
      if (c) o.set(c.x, c.y, c.z);
      else {
        const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        i && l > 0 && (o.x = Math.round(o.x / l) * l, o.y = Math.round(o.y / l) * l, o.z = Math.round(o.z / l) * l);
      }
      He.geometry.setAttribute("position", new It(o.toArray(), 3));
    }
    z();
  }), F.addEventListener("pointermove", (e) => {
    var _a3;
    const n = B(e);
    if (!n) return;
    $.setFromCamera(Y, n);
    let a = false;
    const o = $.intersectObject(Ee), s = Re();
    if (o.length && s.length) {
      const c = new E(...t.points.rawVal[o[0].index]), i = new E(...s[0].point), l = c.sub(i), r = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      r.transformDirection(ee.matrixWorld), Math.abs(l.dot(r)) < 1e-4 && (a = true);
    }
    He.visible = !a;
  });
  let wa = false, ya;
  F.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Rn) return;
    const n = B(e);
    if (!n) return;
    $.setFromCamera(Y, n);
    let a = false;
    const o = $.intersectObject(Ee), s = Re();
    if (o.length && s.length) {
      const i = new E(...t.points.rawVal[o[0].index]), l = new E(...s[0].point), r = i.sub(l), p = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      p.transformDirection(ee.matrixWorld), Math.abs(r.dot(p)) < 1e-4 && (a = true);
    }
    if (a && Rn < 5 && (wa = true, _.enabled = false, ya = o[0].index), !wa || Rn % 2 !== 0) return;
    const c = [...t.points.rawVal];
    if (ya !== void 0) {
      let i = s[0].point;
      (e.ctrlKey || e.metaKey) && (i = new E(Math.round(i.x), Math.round(i.y), Math.round(i.z))), c[ya] = i.toArray();
    }
    t.points.val = c;
  }), F.addEventListener("pointerup", () => {
    _.enabled = true, wa = false;
  }), F.addEventListener("contextmenu", (e) => {
    var _a3;
    const n = B(e);
    if (!n) return;
    $.setFromCamera(Y, n);
    let a = false;
    const o = $.intersectObject(Ee), s = Re();
    if (o.length && s.length) {
      const l = new E(...t.points.rawVal[o[0].index]), r = new E(...s[0].point), p = l.sub(r), d = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      d.transformDirection(ee.matrixWorld), Math.abs(p.dot(d)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const c = [...t.points.rawVal];
    if (c.splice(o[0].index, 1), t.points.val = c, !t.polylines) return;
    const i = t.polylines.rawVal.map((l) => l.filter((r) => r !== o[0].index)).map((l) => l.map((r) => r > o[0].index ? r - 1 : r)).filter((l) => l.length);
    i.push([]), t.polylines.val = i;
  });
}
function tl(t, h, g) {
  const C = Math.round(14.999999999999998), P = { position: t.position.clone(), quaternion: t.quaternion.clone() }, F = setInterval($, 1e3 / 30);
  let z = 0;
  function $() {
    z++;
    const Y = z / C;
    t.position.lerpVectors(P.position, h.position, Y), t.quaternion.slerpQuaternions(P.quaternion, h.quaternion, Y), g && g(), z == C && clearInterval(F);
  }
}
function nl(t, h, g, v) {
  const _ = Li(g, t.elements, v);
  return de.derive(() => {
    _.visible = h.shellResults.val != "none";
  }), _;
}
const ol = 6, Pa = 10, al = 0.012;
function sl(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function il(t, h, g, v) {
  if (!g && !v) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && g) {
    const C = g[t];
    if (C && C.has(h)) return C.get(h);
  }
  return null;
}
function ll(t, h, g, v) {
  const _ = new ut(), C = new Fs();
  C.setColorMap("rainbow");
  const P = new rn(), F = de.state([]);
  return de.derive(() => {
    var _a2, _b, _c;
    h.deformedShape.val;
    const z = g.val, $ = ((_a2 = t.elements) == null ? void 0 : _a2.val) ?? [], Y = sl(h.frameResults.val);
    if (_.children.forEach((I) => {
      I.geometry && I.geometry.dispose(), I.material && I.material.dispose();
    }), _.clear(), !Y || $.length === 0 || z.length === 0) {
      F.val = [];
      return;
    }
    const B = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, ee = (_c = t.deformOutputs) == null ? void 0 : _c.val, U = [], he = [];
    for (let I = 0; I < $.length; I++) {
      if ($[I].length !== 2) continue;
      const ue = il(Y, I, B, ee);
      ue && (U.push(ue[0], ue[1]), he.push({ idx: I, vals: ue }));
    }
    if (U.length === 0) {
      F.val = [];
      return;
    }
    const Q = Math.min(...U), q = Math.max(...U);
    C.setMin(Q), C.setMax(q), F.val = U;
    const ae = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const I of z) for (let J = 0; J < 3; J++) ae[J] = Math.min(ae[J], I[J]), se[J] = Math.max(se[J], I[J]);
    const fe = Math.max(se[0] - ae[0], se[1] - ae[1], se[2] - ae[2], 1) * al, we = [], ce = [], K = [];
    let Z = 0;
    for (const { idx: I, vals: J } of he) {
      const ue = $[I], pe = z[ue[0]], oe = z[ue[1]];
      if (!pe || !oe) continue;
      const H = new E(oe[0] - pe[0], oe[1] - pe[1], oe[2] - pe[2]), ge = H.length();
      if (ge < 1e-10) continue;
      H.normalize();
      const te = Math.abs(H.y) < 0.99 ? new E(0, 1, 0) : new E(1, 0, 0), $e = new E().crossVectors(H, te).normalize(), xe = new E().crossVectors(H, $e).normalize(), be = Pa + 1, _e = ol;
      for (let Be = 0; Be < be; Be++) {
        const Pe = Be / Pa, nt = pe[0] + H.x * ge * Pe, st = pe[1] + H.y * ge * Pe, Ne = pe[2] + H.z * ge * Pe, R = J[0] + (J[1] - J[0]) * Pe, O = C.getColor(R) ?? new rn(0, 0, 0);
        P.copy(O).convertSRGBToLinear();
        for (let le = 0; le < _e; le++) {
          const ie = le / _e * Math.PI * 2, Me = Math.cos(ie), Se = Math.sin(ie);
          we.push(nt + ($e.x * Me + xe.x * Se) * fe, st + ($e.y * Me + xe.y * Se) * fe, Ne + ($e.z * Me + xe.z * Se) * fe), ce.push(P.r, P.g, P.b);
        }
      }
      for (let Be = 0; Be < Pa; Be++) for (let Pe = 0; Pe < _e; Pe++) {
        const nt = (Pe + 1) % _e, st = Z + Be * _e + Pe, Ne = Z + Be * _e + nt, R = Z + (Be + 1) * _e + Pe, O = Z + (Be + 1) * _e + nt;
        K.push(st, Ne, O), K.push(st, O, R);
      }
      Z += be * _e;
    }
    if (we.length === 0) return;
    const V = new Ae();
    V.setAttribute("position", new It(we, 3)), V.setAttribute("color", new It(ce, 3)), V.setIndex(K), V.computeVertexNormals();
    const G = new wt({ vertexColors: true, side: Vt }), X = new ct(V, G);
    X.frustumCulled = false, _.add(X);
  }), _.__colorMapValues = F, _;
}
function rl() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const cl = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, dl = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, ul = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function At(t, h = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(h) : t.toFixed(h);
}
const pl = 16755200, Ms = 56831, fl = 56831, hl = 56831, qo = 65382;
function ml(t) {
  const h = new ut();
  h.name = "__hekatan_hover", h.renderOrder = 99;
  const g = new to(1, 16, 16), v = new wt({ color: pl, transparent: true, opacity: 0.85, depthTest: false }), _ = new ct(g, v);
  _.visible = false, _.renderOrder = 100, h.add(_);
  const C = new Ae(), P = new ft({ color: Ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), F = new jt(C, P);
  F.visible = false, F.renderOrder = 100, h.add(F);
  const z = new wt({ color: Ms, transparent: true, opacity: 0.7, depthTest: false }), $ = new ct(new ys(1, 1, 1, 12), z);
  $.visible = false, $.renderOrder = 100, h.add($);
  const Y = new Ae(), B = new wt({ color: fl, transparent: true, opacity: 0.45, side: Vt, depthTest: false }), ee = new ct(Y, B);
  ee.visible = false, ee.renderOrder = 100, h.add(ee);
  const U = new Ae(), he = new ft({ color: hl, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), Q = new jt(U, he);
  Q.visible = false, Q.renderOrder = 100, h.add(Q);
  const q = new wt({ color: qo, transparent: true, opacity: 0.95, depthTest: false }), ae = new wt({ color: qo, transparent: true, opacity: 0.85, depthTest: false }), se = new ys(1, 1, 1, 12), ye = new wt({ color: qo, transparent: true, opacity: 0.55, side: Vt, depthTest: false }), fe = new ft({ color: qo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), we = [];
  window.__hekatanModelSelection = we;
  const ce = new ut();
  ce.renderOrder = 101, h.add(ce);
  let K = null;
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function V(R) {
    const O = t.derivedNodes.rawVal;
    return !O || R < 0 || R >= O.length ? null : new E(O[R][0], O[R][1], O[R][2]);
  }
  function G(R, O) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o, _p, _q, _r, _s2, _t2;
    const le = t.getActiveCamera();
    if (!le || !t.mesh) return null;
    const ie = t.rendererElm.getBoundingClientRect(), Me = R - ie.left, Se = O - ie.top, Re = t.derivedNodes.rawVal, Ee = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Re || !Ee) return null;
    const He = /* @__PURE__ */ new Map(), Ze = (Qe) => {
      if (He.has(Qe)) return He.get(Qe);
      const ze = V(Qe);
      if (!ze) return He.set(Qe, null), null;
      const Ve = ze.clone().project(le), qe = (Ve.x * 0.5 + 0.5) * ie.width, Ie = (-Ve.y * 0.5 + 0.5) * ie.height, at = { x: qe, y: Ie, z: Ve.z };
      return He.set(Qe, at), at;
    }, ke = /* @__PURE__ */ new Set();
    for (const Qe of Ee) if (Qe) for (const ze of Qe) ke.add(ze);
    const Te = 8;
    let Ye = -1, lt = Te;
    for (let Qe = 0; Qe < Re.length; Qe++) {
      if (!ke.has(Qe)) continue;
      const ze = Ze(Qe);
      if (!ze || ze.z < -1 || ze.z > 1) continue;
      const Ve = ze.x - Me, qe = ze.y - Se, Ie = Math.sqrt(Ve * Ve + qe * qe);
      Ie < lt && (lt = Ie, Ye = Qe);
    }
    const je = rl(), gt = dl[je.dispUnit] ?? 1e3, yt = cl[je.forceUnit] ?? 1;
    if (Ye >= 0) {
      const Qe = Re[Ye];
      let ze = `Nodo ${Ye}
(${Qe[0].toFixed(3)}, ${Qe[1].toFixed(3)}, ${Qe[2].toFixed(3)})`;
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
          const Ie = Ve.reactions.get(Ye);
          Ie && (Math.abs(Ie[0]) > 1e-9 || Math.abs(Ie[1]) > 1e-9 || Math.abs(Ie[2]) > 1e-9 || Math.abs(Ie[3]) > 1e-6 || Math.abs(Ie[4]) > 1e-6 || Math.abs(Ie[5]) > 1e-6) && (ze += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, ze += `
Fx = ${At(Ie[0] * yt)} ${je.forceUnit}`, ze += `
Fy = ${At(Ie[1] * yt)} ${je.forceUnit}`, ze += `
Fz = ${At(Ie[2] * yt)} ${je.forceUnit}`, (Math.abs(Ie[3]) > 1e-6 || Math.abs(Ie[4]) > 1e-6 || Math.abs(Ie[5]) > 1e-6) && (ze += `
Mx = ${At(Ie[3] * yt)} ${je.forceUnit}\xB7m`, ze += `
My = ${At(Ie[4] * yt)} ${je.forceUnit}\xB7m`, ze += `
Mz = ${At(Ie[5] * yt)} ${je.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ye, info: ze };
    }
    const pn = 5;
    let _t = -1, Le = pn, ot = "frame";
    for (let Qe = 0; Qe < Ee.length; Qe++) {
      const ze = Ee[Qe];
      if (!(!ze || ze.length < 2)) {
        if (ze.length === 2) {
          const Ve = Ze(ze[0]), qe = Ze(ze[1]);
          if (!Ve || !qe || Ve.z < -1 || Ve.z > 1 || qe.z < -1 || qe.z > 1) continue;
          const Ie = wl(Me, Se, Ve.x, Ve.y, qe.x, qe.y);
          Ie < Le && (Le = Ie, _t = Qe, ot = "frame");
        } else if (ze.length === 3 || ze.length === 4) {
          const Ve = [];
          let qe = true;
          for (const Ie of ze) {
            const at = Ze(Ie);
            if (!at || at.z < -1 || at.z > 1) {
              qe = false;
              break;
            }
            Ve.push(at);
          }
          if (!qe) continue;
          if (yl(Me, Se, Ve)) {
            const at = Ve.reduce((it, pt) => it + pt.z, 0) / Ve.length * 1e-3;
            at < Le && (Le = at, _t = Qe, ot = "shell");
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
          const Ie = Math.min(...Ve.map((et) => et.x)), at = Math.max(...Ve.map((et) => et.x)), it = Math.min(...Ve.map((et) => et.y)), pt = Math.max(...Ve.map((et) => et.y));
          if (Me >= Ie && Me <= at && Se >= it && Se <= pt) {
            const rt = Ve.reduce((Ft, dt) => Ft + dt.z, 0) / Ve.length * 1e-3;
            rt < Le && (Le = rt, _t = Qe, ot = "solid");
          }
        }
      }
    }
    if (_t >= 0) {
      const Qe = Ee[_t];
      let Ve = `${ot === "frame" ? "Frame" : ot === "shell" ? "Shell" : "Solid"} ${_t}`;
      const qe = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Ie = (_g = (_f = qe == null ? void 0 : qe.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, _t);
      if (Ie) {
        Ie.name && (Ve += `
  \u{1F4CB} ${Ie.name}`), Ie.shape && (Ve += `
  Shape: ${Ie.shape}`);
        const at = /concrete|hormig|rect.*sólida/i.test(Ie.shape || ""), it = at ? 100 : 1e3, pt = at ? "cm" : "mm", et = (Ft) => {
          const dt = Ft * it;
          return Math.abs(dt - Math.round(dt)) < 0.05 ? `${Math.round(dt)}` : `${dt.toFixed(1)}`;
        }, rt = [];
        if (Ie.D != null && rt.push(`D=${et(Ie.D)}`), Ie.B != null && rt.push(`B=${et(Ie.B)}`), Ie.TF != null && rt.push(`TF=${et(Ie.TF)}`), Ie.TW != null && rt.push(`TW=${et(Ie.TW)}`), Ie.t != null && rt.push(`t=${et(Ie.t)}`), rt.length && (Ve += `
  Dim: ${rt.join(" ")} ${pt}`), Ie.material) {
          let Ft = Ie.material;
          Ie.fillMaterial && (Ft += ` + FILL "${Ie.fillMaterial}"`), Ve += `
  Mat: ${Ft}`;
        }
      } else {
        const at = (_i2 = (_h = qe == null ? void 0 : qe.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, _t), it = (_k = (_j = qe == null ? void 0 : qe.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, _t);
        at ? (Ve += `
  ${at}`, it && !at.includes(it) && (Ve += `  (${it})`)) : it && (Ve += `
  Material: ${it}`);
      }
      if (Ve += `
nodos: [${Qe.join(", ")}]`, ot === "shell" && ((_l2 = t.mesh) == null ? void 0 : _l2.analyzeOutputs)) {
        const at = t.mesh.analyzeOutputs.rawVal, it = ul[je.stressUnit] ?? 1, pt = [["bendingXX", "Mxx", yt, `${je.forceUnit}\xB7m/m`], ["bendingYY", "Myy", yt, `${je.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", yt, `${je.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", yt, `${je.forceUnit}/m`], ["membraneYY", "Nyy", yt, `${je.forceUnit}/m`], ["membraneXY", "Nxy", yt, `${je.forceUnit}/m`], ["shearX", "Qx", yt, `${je.forceUnit}/m`], ["shearY", "Qy", yt, `${je.forceUnit}/m`], ["vonMises", "\u03C3VM", it, je.stressUnit], ["pressure", "p", it, je.stressUnit]], et = [];
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
        if (pt && Qe.length === 2) {
          const et = pt.get(Qe[0]), rt = pt.get(Qe[1]), Ft = ((_n = t.mesh.nodes) == null ? void 0 : _n.rawVal) ?? Re, dt = Ft[Qe[0]], Kt = Ft[Qe[1]];
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
  function X(R, O, le) {
    var _a2, _b, _c;
    if (_.visible = false, F.visible = false, $.visible = false, ee.visible = false, Q.visible = false, !R || !t.mesh) {
      Z.style.display = "none", t.render();
      return;
    }
    const ie = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (R.type === "node") {
      const Ee = V(R.idx);
      if (Ee) {
        const He = t.derivedNodes.rawVal ?? [];
        let Ze = 1;
        if (He.length >= 2) {
          let Ye = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const je of He) for (let gt = 0; gt < 3; gt++) je[gt] < Ye[gt] && (Ye[gt] = je[gt]), je[gt] > lt[gt] && (lt[gt] = je[gt]);
          Ze = Math.max(lt[0] - Ye[0], lt[1] - Ye[1], lt[2] - Ye[2], 0.1);
        }
        const ke = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Te = 0.021 * Ze * ke;
        _.position.copy(Ee), _.scale.setScalar(Te), _.visible = true;
      }
    } else if (R.type === "frame" && ie) {
      const Ee = ie[R.idx], He = V(Ee[0]), Ze = V(Ee[1]);
      if (He && Ze) {
        const ke = He.clone().add(Ze).multiplyScalar(0.5), Te = Ze.clone().sub(He), Ye = Te.length(), lt = Math.max(1e-4, 3.5 * Be(ke));
        $.position.copy(ke);
        const je = new E(0, 1, 0), gt = je.clone().cross(Te).normalize(), yt = je.angleTo(Te);
        $.quaternion.setFromAxisAngle(gt, yt), $.scale.set(lt, Ye, lt), $.visible = true;
      }
    } else if (R.type === "shell" && ie) {
      const Ee = ie[R.idx], He = [], Ze = [];
      for (const ke of Ee) {
        const Te = V(ke);
        if (!Te) return;
        He.push(Te.x, Te.y, Te.z);
      }
      Ee.length === 4 ? Ze.push(0, 1, 2, 0, 2, 3) : Ee.length === 3 && Ze.push(0, 1, 2), Y.setAttribute("position", new It(He, 3)), Y.setIndex(Ze), Y.computeVertexNormals(), ee.visible = true;
    } else if (R.type === "solid" && ie) {
      const Ee = ie[R.idx], He = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ze = [];
      for (const [ke, Te] of He) {
        const Ye = V(Ee[ke]), lt = V(Ee[Te]);
        Ye && lt && Ze.push(Ye.x, Ye.y, Ye.z, lt.x, lt.y, lt.z);
      }
      U.setAttribute("position", new It(Ze, 3)), Q.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", t.render();
      return;
    }
    Z.textContent = R.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const Se = t.rendererElm.getBoundingClientRect(), Re = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Se;
    Z.style.left = `${O - Re.left}px`, Z.style.top = `${le - Re.top}px`, t.render();
  }
  let I = "", J = 0, ue = 0;
  const pe = window.__hekatanHoverDebug ?? false, oe = (R) => {
    J && cancelAnimationFrame(J), J = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const O = G(R.clientX, R.clientY);
      if (pe && ue < 5) {
        const ie = t.derivedNodes.rawVal, Me = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${R.clientX}, ${R.clientY}) nodes=${(ie == null ? void 0 : ie.length) ?? 0} elems=${(Me == null ? void 0 : Me.length) ?? 0} hover=`, O), ue++;
      }
      const le = O ? `${O.type}:${O.idx}` : "";
      if (le !== I) I = le, X(O, R.clientX, R.clientY);
      else if (O) {
        const ie = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        Z.style.left = `${R.clientX - ie.left}px`, Z.style.top = `${R.clientY - ie.top}px`;
      }
    });
  };
  let H = null;
  const ge = () => {
    I = "", _.visible = false, F.visible = false, $.visible = false, ee.visible = false, Q.visible = false, Z.style.display = "none", t.render();
  }, te = (R) => {
    const O = t.rendererElm.getBoundingClientRect(), le = R.clientX - O.left, ie = R.clientY - O.top;
    (le < -2 || ie < -2 || le > O.width + 2 || ie > O.height + 2) && (H && clearTimeout(H), H = window.setTimeout(ge, 200));
  }, $e = () => {
    H && (clearTimeout(H), H = null);
  };
  t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", te), t.rendererElm.addEventListener("pointerenter", $e);
  function xe() {
    var _a2, _b, _c;
    const R = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return R === "select" || R === "none" || !R;
  }
  let be = null;
  t.rendererElm.addEventListener("pointerdown", (R) => {
    R.button === 0 && (be = { x: R.clientX, y: R.clientY });
  }), t.rendererElm.addEventListener("pointerup", (R) => {
    if (R.button !== 0 || !be) return;
    const O = R.clientX - be.x, le = R.clientY - be.y;
    if (be = null, O * O + le * le > 9 || !xe()) return;
    const ie = G(R.clientX, R.clientY);
    ie ? (st({ type: ie.type, idx: ie.idx }, R.shiftKey), nt()) : Ne();
  }), window.addEventListener("keydown", (R) => {
    if (R.key !== "Escape" || !we.length) return;
    const O = document.activeElement, le = !!O && (O.id === "hk3-cmd-input" || O.id === "hk-dyn-input") && O.value === "";
    O && (O.tagName === "INPUT" || O.tagName === "TEXTAREA" || O.isContentEditable) && !le || Ne();
  }, { capture: true });
  function _e() {
    for (const R of ce.children.slice()) {
      ce.remove(R);
      const O = R.geometry;
      O && O !== g && O !== se && O.dispose();
    }
  }
  const Be = (R) => {
    var _a2;
    const O = t.getActiveCamera(), le = ((_a2 = t.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return O.isOrthographicCamera ? (O.top - O.bottom) / (O.zoom || 1) / le : 2 * O.position.distanceTo(R) * Math.tan((O.fov || 50) * Math.PI / 180 / 2) / le;
  };
  function Pe(R, O) {
    var _a2, _b;
    const le = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (R.type === "node") {
      const ie = V(R.idx);
      if (!ie) return;
      const Me = new ct(g, q);
      Me.position.copy(ie), Me.scale.setScalar(Math.max(1e-4, 7 * Be(ie))), Me.renderOrder = 101, ce.add(Me);
    } else if (R.type === "frame" && le) {
      const ie = le[R.idx], Me = V(ie[0]), Se = V(ie[1]);
      if (!Me || !Se) return;
      const Re = Me.clone().add(Se).multiplyScalar(0.5), Ee = Se.clone().sub(Me), He = Ee.length(), Ze = Math.max(1e-4, 4 * Be(Re)), ke = new ct(se, ae);
      ke.position.copy(Re);
      const Te = new E(0, 1, 0);
      ke.quaternion.setFromAxisAngle(Te.clone().cross(Ee).normalize(), Te.angleTo(Ee)), ke.scale.set(Ze, He, Ze), ke.renderOrder = 101, ce.add(ke);
    } else if (R.type === "shell" && le) {
      const ie = le[R.idx], Me = [], Se = [];
      for (const He of ie) {
        const Ze = V(He);
        if (!Ze) return;
        Me.push(Ze.x, Ze.y, Ze.z);
      }
      ie.length === 4 ? Se.push(0, 1, 2, 0, 2, 3) : ie.length === 3 && Se.push(0, 1, 2);
      const Re = new Ae();
      Re.setAttribute("position", new It(Me, 3)), Re.setIndex(Se), Re.computeVertexNormals();
      const Ee = new ct(Re, ye);
      Ee.renderOrder = 101, ce.add(Ee);
    } else if (R.type === "solid" && le) {
      const ie = le[R.idx], Me = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Se = [];
      for (const [He, Ze] of Me) {
        const ke = V(ie[He]), Te = V(ie[Ze]);
        ke && Te && Se.push(ke.x, ke.y, ke.z, Te.x, Te.y, Te.z);
      }
      const Re = new Ae();
      Re.setAttribute("position", new It(Se, 3));
      const Ee = new jt(Re, fe);
      Ee.renderOrder = 101, ce.add(Ee);
    }
  }
  function nt() {
    if (_e(), !we.length || !t.mesh) {
      t.render();
      return;
    }
    const R = t.derivedNodes.rawVal ?? [];
    if (R.length >= 2) {
      const O = [1 / 0, 1 / 0, 1 / 0], le = [-1 / 0, -1 / 0, -1 / 0];
      for (const ie of R) for (let Me = 0; Me < 3; Me++) ie[Me] < O[Me] && (O[Me] = ie[Me]), ie[Me] > le[Me] && (le[Me] = ie[Me]);
      Math.max(le[0] - O[0], le[1] - O[1], le[2] - O[2], 0.1);
    }
    for (const O of we) Pe(O);
    t.render();
  }
  function st(R, O) {
    const le = we.findIndex((ie) => ie.type === R.type && ie.idx === R.idx);
    le >= 0 ? we.splice(le, 1) : O || we.push(R), K = we.length ? we[we.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: K } }));
  }
  function Ne() {
    we.length = 0, K = null, nt();
  }
  return de.derive(() => {
    t.derivedNodes.val, we.length && nt();
  }), h;
}
function wl(t, h, g, v, _, C) {
  const P = _ - g, F = C - v, z = P * P + F * F;
  if (z < 1e-9) {
    const he = t - g, Q = h - v;
    return Math.sqrt(he * he + Q * Q);
  }
  let $ = ((t - g) * P + (h - v) * F) / z;
  $ = Math.max(0, Math.min(1, $));
  const Y = g + $ * P, B = v + $ * F, ee = t - Y, U = h - B;
  return Math.sqrt(ee * ee + U * U);
}
function yl(t, h, g) {
  let v = false;
  for (let _ = 0, C = g.length - 1; _ < g.length; C = _++) {
    const P = g[_].x, F = g[_].y, z = g[C].x, $ = g[C].y;
    F > h != $ > h && t < (z - P) * (h - F) / ($ - F + 1e-12) + P && (v = !v);
  }
  return v;
}
const ln = (t) => {
  if (!isFinite(t) || t === 0) return "0";
  const h = Math.abs(t);
  return h >= 1e-3 && h < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
};
function vs(t, h) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], _ = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[h];
  if (!_ || _.length !== 2) throw new Error(`El elemento ${h} no es una barra (2 nudos).`);
  const C = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (te) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = C[te]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, h)) ?? 0;
  }, F = g[_[0]], z = g[_[1]], $ = P("elasticities"), Y = P("shearModuli"), B = P("areas"), ee = P("momentsOfInertiaZ"), U = P("momentsOfInertiaY"), he = P("torsionalConstants");
  let Q = P("shearAreasY"), q = P("shearAreasZ");
  const ae = Math.hypot(z[0] - F[0], z[1] - F[1], z[2] - F[2]), se = Q < -1e-15, ye = q < -1e-15;
  !se && Q < 1e-15 && B > 1e-15 && Y > 1e-15 && (Q = 5 / 6 * B), !ye && q < 1e-15 && B > 1e-15 && Y > 1e-15 && (q = 5 / 6 * B);
  const fe = !ye && q > 0 && Y > 0 ? 12 * $ * ee / (Y * q * ae * ae) : 0, we = !se && Q > 0 && Y > 0 ? 12 * $ * U / (Y * Q * ae * ae) : 0, ce = $ * B / ae, K = Y * he / ae, Z = 12 * $ * ee / ae ** 3 / (1 + fe), V = 6 * $ * ee / ae ** 2 / (1 + fe), G = 4 * $ * ee / ae * (1 + fe / 4) / (1 + fe), X = 2 * $ * ee / ae * (1 - fe / 2) / (1 + fe), I = 12 * $ * U / ae ** 3 / (1 + we), J = 6 * $ * U / ae ** 2 / (1 + we), ue = 4 * $ * U / ae * (1 + we / 4) / (1 + we), pe = 2 * $ * U / ae * (1 - we / 2) / (1 + we);
  let oe = [[ce, 0, 0, 0, 0, 0, -ce, 0, 0, 0, 0, 0], [0, Z, 0, 0, 0, V, 0, -Z, 0, 0, 0, V], [0, 0, I, 0, -J, 0, 0, 0, -I, 0, -J, 0], [0, 0, 0, K, 0, 0, 0, 0, 0, -K, 0, 0], [0, 0, -J, 0, ue, 0, 0, 0, J, 0, pe, 0], [0, V, 0, 0, 0, G, 0, -V, 0, 0, 0, X], [-ce, 0, 0, 0, 0, 0, ce, 0, 0, 0, 0, 0], [0, -Z, 0, 0, 0, -V, 0, Z, 0, 0, 0, -V], [0, 0, -I, 0, J, 0, 0, 0, I, 0, J, 0], [0, 0, 0, -K, 0, 0, 0, 0, 0, K, 0, 0], [0, 0, -J, 0, pe, 0, 0, 0, J, 0, ue, 0], [0, V, 0, 0, 0, X, 0, -V, 0, 0, 0, G]];
  const H = (_e = (_d = C.partialFixitySprings) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, h);
  if (H) for (let te = 0; te < Math.min(12, H.length); te++) H[te] > 1e-12 && (oe[te][te] += H[te]);
  const ge = (_g = (_f = C.momentReleases) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, h);
  if (ge && ge.some(Boolean)) {
    const te = ge.length >= 12 ? ge.slice(0, 12).map((Pe, nt) => Pe ? nt : -1).filter((Pe) => Pe >= 0) : ge.slice(0, 6).map((Pe, nt) => Pe ? [3, 4, 5, 9, 10, 11][nt] : -1).filter((Pe) => Pe >= 0), $e = [...Array(12).keys()].filter((Pe) => !te.includes(Pe)), xe = te.length, be = te.map((Pe, nt) => [...te.map((st) => oe[Pe][st]), ...te.map((st, Ne) => nt === Ne ? 1 : 0)]);
    for (let Pe = 0; Pe < xe; Pe++) {
      let nt = Pe;
      for (let Ne = Pe + 1; Ne < xe; Ne++) Math.abs(be[Ne][Pe]) > Math.abs(be[nt][Pe]) && (nt = Ne);
      [be[Pe], be[nt]] = [be[nt], be[Pe]];
      const st = be[Pe][Pe];
      for (let Ne = 0; Ne < 2 * xe; Ne++) be[Pe][Ne] /= st;
      for (let Ne = 0; Ne < xe; Ne++) if (Ne !== Pe) {
        const R = be[Ne][Pe];
        for (let O = 0; O < 2 * xe; O++) be[Ne][O] -= R * be[Pe][O];
      }
    }
    const _e2 = be.map((Pe) => Pe.slice(xe)), Be = Array.from({ length: 12 }, () => Array(12).fill(0));
    for (const Pe of $e) for (const nt of $e) {
      let st = 0;
      for (let Ne = 0; Ne < xe; Ne++) for (let R = 0; R < xe; R++) st += oe[Pe][te[Ne]] * _e2[Ne][R] * oe[te[R]][nt];
      Be[Pe][nt] = oe[Pe][nt] - st;
    }
    oe = Be;
  }
  return { K: oe, L: ae, phiZ: fe, phiY: we };
}
function _s(t, h) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], _ = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[h];
  if (!_ || _.length !== 2) throw new Error(`El elemento ${h} no es una barra (2 nudos).`);
  const C = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, P = (he, Q = 0) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = C[he]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, h)) ?? Q;
  }, F = g[_[0]], z = g[_[1]], $ = (_e = (_d = C.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, h), Y = (_g = (_f = C.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, h), B = P("localAngles", 0), ee = [], U = (he = "") => ee.push(he);
  if (U("% ============================================================"), U(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${h + 1} (indice ${h} del motor)`), U("%  Generado por Hekatan Struct con los datos que recibe el motor."), U("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), U("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), U("% ============================================================"), U(), U("% --- Datos de la barra -------------------------------------------------"), U(`xi = [${F.map(ln).join(" ")}];      % nudo i (${_[0]})`), U(`xj = [${z.map(ln).join(" ")}];      % nudo j (${_[1]})`), U(`E  = ${ln(P("elasticities"))};      % modulo de elasticidad`), U(`G  = ${ln(P("shearModuli"))};      % modulo de cortante`), U(`A  = ${ln(P("areas"))};      % area`), U(`Iz = ${ln(P("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), U(`Iy = ${ln(P("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), U(`J  = ${ln(P("torsionalConstants"))};      % constante de torsion`), U(`AsY = ${ln(P("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), U(`AsZ = ${ln(P("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), B && U(`% ang = ${ln(B)} grados: gira la seccion en T, NO cambia esta matriz local.`), U(), U("L = sqrt(sum((xj - xi).^2));"), U(), U("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), U("bernY = AsY < 0;   bernZ = AsZ < 0;"), U("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), U("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), U("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), U("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), U(), U("EA_L = E*A/L;          % axial"), U("GJ_L = G*J/L;          % torsion"), U("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), U("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), U("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), U("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), U(), U("% --- Matriz local (misma disposicion que el C++) ----------------------"), U("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), U("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), U("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), U("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), U("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), U("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), U("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), U("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), U("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), U("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), U("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), U("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), Y && Y.some((he) => he > 1e-12) && (U(), U("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), U(`kres = [${Y.slice(0, 12).map(ln).join(" ")}];`), U("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), $ && $.some(Boolean)) {
    const he = $.length >= 12 ? $.slice(0, 12).map((Q, q) => Q ? q + 1 : 0).filter(Boolean) : $.slice(0, 6).map((Q, q) => Q ? [4, 5, 6, 10, 11, 12][q] : 0).filter(Boolean);
    U(), U("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), U(`f = [${he.join(" ")}];              % GDL liberados`), U("r = setdiff(1:12, f);                % GDL que quedan"), U("Kc = zeros(12);"), U("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), U("K = Kc;");
  }
  return U(), U("% --- Resultado ---------------------------------------------------------"), U(`fprintf('Barra ${h + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), U("disp('K local (12x12):');"), U("disp(K);"), { nombre: `K_local_barra_${h + 1}.m`, texto: ee.join(`
`) + `
` };
}
const xl = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, gl = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Fn = 1e-3;
function mo(t, h) {
  return h === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : h === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function bl(t, h) {
  const g = Math.abs(h[0] - t[0]);
  return Math.abs(h[1] - t[1]) < Fn ? { plano: "XZ", en: t[1] } : g < Fn ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function Ml(t, h) {
  var _a2, _b;
  let g = null, v = { plano: "XZ", en: 0 };
  const _ = () => {
    var _a3, _b2;
    const K = ((_a3 = h == null ? void 0 : h.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = h == null ? void 0 : h.frameResults) == null ? void 0 : _b2.val);
    return !K || K === "none" ? null : String(K).replace(/^contour:/, "");
  }, C = (K) => {
    var _a3, _b2;
    const Z = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], V = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Set();
    for (const X of V) {
      if (X.length !== 2) continue;
      const I = Z[X[0]], J = Z[X[1]];
      if (!I || !J) continue;
      const ue = mo(I, K), pe = mo(J, K);
      Math.abs(ue.fuera - pe.fuera) < Fn && G.add(Math.round(ue.fuera * 1e3) / 1e3);
    }
    return [...G].sort((X, I) => X - I);
  };
  function P(K) {
    var _a3, _b2;
    if (K == null ? void 0 : K.plano) v = { plano: K.plano, en: K.en ?? C(K.plano)[0] ?? 0 };
    else {
      const V = [...window.__hekatanModelSelection ?? []].reverse().find((I) => I.type === "frame"), G = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], X = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      V && X[V.idx] && G[X[V.idx][0]] && G[X[V.idx][1]] ? v = bl(G[X[V.idx][0]], G[X[V.idx][1]]) : v = { plano: "XZ", en: C("XZ")[0] ?? 0 };
    }
    g || F(), g.hidden = false, z();
  }
  function F() {
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
      const I = document.createElement("style");
      I.id = "hk-d2-hidden-css", I.textContent = "#hk-diagrama-2d[hidden]{display:none !important;}", document.head.appendChild(I);
    }
    g.querySelector(".hk-d2-x").addEventListener("click", () => {
      g.hidden = true;
    });
    const K = g.querySelector(".hk-d2-plano"), Z = g.querySelector(".hk-d2-en");
    K.addEventListener("change", () => {
      v = { plano: K.value, en: C(K.value)[0] ?? 0 }, z();
    }), Z.addEventListener("change", () => {
      v.en = Number(Z.value), z();
    });
    const V = (I) => {
      const J = C(v.plano), ue = J.findIndex((oe) => Math.abs(oe - v.en) < Fn), pe = Math.max(0, Math.min(J.length - 1, (ue < 0 ? 0 : ue) + I));
      J.length && (v.en = J[pe], z());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => V(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => V(1));
    const G = g.querySelector(".hk-d2-bar");
    let X = null;
    G.addEventListener("pointerdown", (I) => {
      if (I.target.closest("select,button")) return;
      const J = g.getBoundingClientRect();
      X = { x: I.clientX, y: I.clientY, l: J.left, t: J.top }, g.style.transform = "none", g.style.left = J.left + "px", g.style.top = J.top + "px";
    }), window.addEventListener("pointermove", (I) => {
      !X || !g || (g.style.left = X.l + I.clientX - X.x + "px", g.style.top = X.t + I.clientY - X.y + "px");
    }), window.addEventListener("pointerup", () => {
      X = null;
    }), new ResizeObserver(() => {
      g && !g.hidden && z();
    }).observe(g);
  }
  function z() {
    var _a3, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const K = new Set(B && !B.hidden && ee >= 0 ? he(ee) : []), Z = g.querySelector(".hk-d2-svg"), V = g.querySelector(".hk-d2-tit"), G = g.querySelector(".hk-d2-pie"), X = g.querySelector(".hk-d2-plano"), I = g.querySelector(".hk-d2-en");
    X.value = v.plano;
    const J = C(v.plano), ue = v.plano === "XZ" ? "y" : v.plano === "YZ" ? "x" : "z", pe = v.plano === "XY" ? "Planta" : "P\xF3rtico";
    I.innerHTML = J.map((Le, ot) => `<option value="${Le}" ${Math.abs(Le - v.en) < Fn ? "selected" : ""}>${pe} ${ot + 1} \xB7 ${ue} = ${Le.toFixed(2)} m</option>`).join("");
    const oe = _(), H = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], ge = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], te = oe ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[oe] : null;
    Z.innerHTML = "";
    const $e = Z.clientWidth || 880, xe = Z.clientHeight || 480, be = [];
    if (ge.forEach((Le, ot) => {
      if (Le.length !== 2) return;
      const Qe = H[Le[0]], ze = H[Le[1]];
      if (!Qe || !ze) return;
      const Ve = mo(Qe, v.plano), qe = mo(ze, v.plano);
      Math.abs(Ve.fuera - v.en) < Fn && Math.abs(qe.fuera - v.en) < Fn && be.push({ i: ot, a: Ve, b: qe });
    }), !be.length) {
      G.textContent = "No hay barras en este plano.", V.textContent = "";
      return;
    }
    let _e = 1 / 0, Be = -1 / 0, Pe = 1 / 0, nt = -1 / 0;
    for (const Le of be) for (const ot of [Le.a, Le.b]) _e = Math.min(_e, ot.u), Be = Math.max(Be, ot.u), Pe = Math.min(Pe, ot.v), nt = Math.max(nt, ot.v);
    const st = Be - _e || 1, Ne = nt - Pe || 1, R = 0.12 * Math.max(st, Ne), O = 46, le = Math.min(($e - 2 * O) / (st + 2 * R), (xe - 2 * O) / (Ne + 2 * R)), ie = ($e - st * le) / 2, Me = (xe - Ne * le) / 2, Se = (Le) => ie + (Le - _e) * le, Re = (Le) => xe - (Me + (Le - Pe) * le), Ee = "http://www.w3.org/2000/svg", He = (Le, ot, Qe) => {
      const ze = document.createElementNS(Ee, Le);
      for (const Ve in ot) ze.setAttribute(Ve, String(ot[Ve]));
      return Qe != null && (ze.textContent = Qe), Z.appendChild(ze), ze;
    }, Ze = /* @__PURE__ */ new Map();
    for (const Le of be) {
      const ot = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Le.i)) ?? 0, Qe = mo(Ts(oe ?? "normals", Is(H[ge[Le.i][0]], H[ge[Le.i][1]], ot)), v.plano), ze = Math.hypot(Qe.u, Qe.v);
      Ze.set(Le.i, ze > 0.3 ? [Qe.u / ze, -Qe.v / ze] : null);
    }
    const ke = be.filter((Le) => !Ze.get(Le.i)).length;
    let Te = 0;
    if (te) for (const Le of be) {
      if (!Ze.get(Le.i)) continue;
      const ot = te instanceof Map ? te.get(Le.i) : te[Le.i];
      ot && (Te = Math.max(Te, Math.abs(ot[0] ?? 0), Math.abs(ot[1] ?? 0)));
    }
    const Ye = 0.12 * Math.max(st, Ne) * le, lt = Te > 0 ? Ye / Te : 0, je = oe === "bendingsY" || oe === "bendingsZ", gt = (Le) => Math.abs(Le) >= 100 ? Le.toFixed(1) : Math.abs(Le) >= 10 ? Le.toFixed(2) : Le.toFixed(3), yt = [];
    for (const Le of be) {
      const ot = Se(Le.a.u), Qe = Re(Le.a.v), ze = Se(Le.b.u), Ve = Re(Le.b.v), qe = Ze.get(Le.i), [Ie, at] = qe ?? [0, 0], it = te && qe ? te instanceof Map ? te.get(Le.i) : te[Le.i] : null, [pt, et] = it ? Ca(oe, it) : [0, 0];
      if (it && lt > 0) {
        const Kt = [ot + Ie * pt * lt * 1, Qe + at * pt * lt * 1], kt = [ze + Ie * et * lt * 1, Ve + at * et * lt * 1], Pt = pt + et >= 0 ? "#3fa7d6" : "#d9534f";
        He("polygon", { points: `${ot},${Qe} ${Kt[0]},${Kt[1]} ${kt[0]},${kt[1]} ${ze},${Ve}`, fill: Pt, "fill-opacity": 0.38, stroke: Pt, "stroke-width": 1.2 }), yt.push({ x: Kt[0] + Ie * 12, y: Kt[1] + at * 12, t: gt(pt), peso: Math.abs(pt) }), yt.push({ x: kt[0] + Ie * 12, y: kt[1] + at * 12, t: gt(et), peso: Math.abs(et) });
      }
      He("line", { x1: ot, y1: Qe, x2: ze, y2: Ve, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), K.has(Le.i) && He("line", { x1: ot, y1: Qe, x2: ze, y2: Ve, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const rt = He("line", { x1: ot, y1: Qe, x2: ze, y2: Ve, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      rt.addEventListener("click", () => Q(Le.i));
      const Ft = document.createElementNS(Ee, "title");
      Ft.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", rt.appendChild(Ft);
    }
    for (const Le of be) for (const ot of [Le.a, Le.b]) v.plano !== "XY" && Math.abs(ot.v - Pe) < Fn && He("rect", { x: Se(ot.u) - 6, y: Re(ot.v), width: 12, height: 7, fill: "#b03a3a" });
    const pn = [];
    yt.sort((Le, ot) => ot.peso - Le.peso);
    for (const Le of yt) Le.peso < 0.02 * Te || pn.some((ot) => Math.hypot(ot.x - Le.x, ot.y - Le.y) < 34) || (pn.push(Le), He("text", { x: Le.x, y: Le.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Le.t));
    const _t = oe ? xl[oe] ?? oe : "sin resultado";
    V.textContent = `${_t} \xB7 ${v.plano === "XY" ? "planta" : "alzado"} ${v.plano} en ${ue} = ${v.en.toFixed(2)} m`, G.textContent = oe ? `${be.length} barras en el plano \xB7 m\xE1ximo ${gt(Te)} ${gl[oe] ?? ""}` + (je ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ke ? ` \xB7 ${ke} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const $ = () => {
    try {
      z();
    } catch {
    }
  };
  (h == null ? void 0 : h.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    h.frameResults.val, $();
  }));
  let Y = null;
  setInterval(() => {
    var _a3, _b2;
    const K = (_a3 = t.analyzeOutputs) == null ? void 0 : _a3.rawVal, Z = (_b2 = h == null ? void 0 : h.frameResults) == null ? void 0 : _b2.rawVal, V = [K, Z];
    if (!(Y && Y[0] === K && Y[1] === Z)) {
      Y = V, $();
      try {
        ae();
      } catch {
      }
    }
  }, 400);
  let B = null, ee = -1, U = "12";
  function he(K) {
    var _a3, _b2;
    const Z = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], V = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Map();
    V.forEach((ue, pe) => {
      if (ue.length === 2) for (const oe of ue) G.has(oe) || G.set(oe, []), G.get(oe).push(pe);
    });
    const X = (ue) => {
      const pe = Z[V[ue][0]], oe = Z[V[ue][1]], H = [oe[0] - pe[0], oe[1] - pe[1], oe[2] - pe[2]], ge = Math.hypot(H[0], H[1], H[2]) || 1;
      return H.map((te) => te / ge);
    }, I = (ue, pe) => {
      const oe = X(ue), H = X(pe);
      return Math.abs(oe[0] * H[0] + oe[1] * H[1] + oe[2] * H[2]) > 0.9999;
    }, J = [K];
    for (const ue of [0, 1]) {
      let pe = K, oe = V[K][ue];
      for (let H = 0; H < 500; H++) {
        const ge = (G.get(oe) ?? []).filter(($e) => $e !== pe);
        if (ge.length !== 1 || !I(pe, ge[0])) break;
        const te = ge[0];
        ue === 0 ? J.unshift(te) : J.push(te), oe = V[te][0] === oe ? V[te][1] : V[te][0], pe = te;
      }
    }
    return J;
  }
  function Q(K) {
    if (K == null) {
      const V = [...window.__hekatanModelSelection ?? []].reverse().find((G) => G.type === "frame");
      if (!V) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      K = V.idx;
    }
    ee = K, B || (B = document.createElement("div"), B.id = "hk-diagrama-barra", B.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), B.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-k" title="Descarga un script MATLAB (Hekatan Lab / Octave) con la matriz de rigidez local 12\xD712 de esta barra" style="background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px;white-space:nowrap">\u{1F4C4} K local .m</button><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(B), B.querySelector(".hk-b-x").addEventListener("click", () => {
      B.hidden = true, q(), z();
    }), B.querySelector(".hk-b-k").addEventListener("click", () => {
      ee >= 0 && se(ee);
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
    if (!B || B.hidden || ee < 0) return;
    const K = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], Z = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], V = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!Z[ee]) return;
    const G = he(ee), X = [];
    let I = 0, J = -1;
    G.forEach((Be, Pe) => {
      const [nt, st] = Z[Be], Ne = Pe === 0 ? G.length > 1 && Z[G[1]].includes(nt) : nt !== J, R = Ne ? st : nt, O = Ne ? nt : st, le = Math.hypot(K[O][0] - K[R][0], K[O][1] - K[R][1], K[O][2] - K[R][2]);
      X.push({ x: I, e: Be, fin: Ne ? 1 : 0 }), I += le, X.push({ x: I, e: Be, fin: Ne ? 0 : 1 }), J = O;
    });
    const ue = I, pe = (Be, Pe) => {
      const nt = V[Be], st = nt ? nt instanceof Map ? nt.get(Pe.e) : nt[Pe.e] : null;
      return st ? Ca(Be, st)[Pe.fin] : 0;
    }, oe = K[Z[G[0]][0]], H = (Be) => Be.toFixed(2);
    B.querySelector(".hk-b-tit").textContent = "L = " + ue.toFixed(2) + " m \xB7 " + G.length + " tramo(s) \xB7 desde (" + H(oe[0]) + ", " + H(oe[1]) + ", " + H(oe[2]) + ")";
    const ge = U === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], te = B.querySelector(".hk-b-cuerpo");
    te.innerHTML = "";
    const $e = Math.max(300, te.clientWidth), xe = 124, be = 46, _e = (xe - 14) / 2;
    for (const [Be, Pe, nt, st] of ge) {
      const Ne = X.map((Te) => pe(Be, Te)), R = Math.max(...Ne), O = Math.min(...Ne), le = Math.max(Math.abs(R), Math.abs(O)) || 1, ie = (Te) => be + Te / (ue || 1) * ($e - 2 * be), Me = (Te) => _e + (st ? 1 : -1) * (Te / le) * (_e - 16), Se = (Te) => Math.abs(Te) >= 100 ? Te.toFixed(1) : Math.abs(Te) >= 10 ? Te.toFixed(2) : Te.toFixed(3);
      let Re = ie(0) + "," + _e + " ";
      X.forEach((Te, Ye) => {
        Re += ie(Te.x) + "," + Me(Ne[Ye]) + " ";
      }), Re += ie(ue) + "," + _e;
      const Ee = Ne.indexOf(R), He = Ne.indexOf(O), Ze = (Te, Ye) => {
        const lt = Me(Ne[Te]) + (Me(Ne[Te]) < _e ? -5 : 13);
        return '<text x="' + ie(X[Te].x) + '" y="' + lt + '" text-anchor="middle" fill="' + Ye + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Se(Ne[Te]) + "</text>";
      }, ke = st ? "#d9534f" : "#3fa7d6";
      te.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Pe + ' <span style="color:#6f7d90;font-weight:400">(' + nt + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Se(R) + " \xB7 m\xEDn " + Se(O) + (st ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + $e + '" height="' + xe + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + be + '" y1="' + _e + '" x2="' + ($e - be) + '" y2="' + _e + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Re + '" fill="' + ke + '" fill-opacity=".35" stroke="' + ke + '" stroke-width="1.4"/>' + Ze(0, "#f2f5fa") + Ze(X.length - 1, "#f2f5fa") + (Ee > 0 && Ee < X.length - 1 ? Ze(Ee, "#8fd3ff") : "") + (He > 0 && He < X.length - 1 && He !== Ee ? Ze(He, "#ff9f9a") : "") + '<text x="' + be + '" y="' + (xe - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + ($e - be) + '" y="' + (xe - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + ue.toFixed(2) + " m</text></svg>");
    }
  }
  window.__hekatanDiagramaBarra = Q;
  function se(K) {
    const { nombre: Z, texto: V } = _s(t, K), G = URL.createObjectURL(new Blob([V], { type: "text/plain" })), X = document.createElement("a");
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
  let ye = null, fe = null, we = -1;
  function ce(K) {
    var _a3, _b2, _c, _d, _e;
    if (we = K, !fe) {
      fe = document.createElement("div"), fe.id = "hk-klocal", fe.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(fe);
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
    const V = (oe) => Math.abs(oe) < 1e-12 ? "0" : Math.abs(oe) >= 1e5 || Math.abs(oe) < 0.01 ? oe.toExponential(4) : oe.toPrecision(6), G = ((_a3 = t.elementInputs) == null ? void 0 : _a3.rawVal) ?? {}, X = (_c = (_b2 = G.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, K), I = (_e = (_d = G.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, K), J = [X && (X[0] > 1e-12 || X[1] > 1e-12) ? `brazos r\xEDgidos ${X[0]}\xB7L / ${X[1]}\xB7L (se aplican en K global: R\u1D40\xB7K\xB7R)` : "", I ? `ang ${I}\xB0 (gira T, no esta K)` : ""].filter(Boolean).join(" \xB7 "), ue = ["u1 i", "u2 i", "u3 i", "\u03B81 i", "\u03B82 i", "\u03B83 i", "u1 j", "u2 j", "u3 j", "\u03B81 j", "\u03B82 j", "\u03B83 j"], pe = Z.K.map((oe, H) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${ue[H]}</th>` + oe.map((ge) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(ge) < 1e-12 ? "#4a5568" : ge < 0 ? "#ff9f9a" : "#e6edf5"}">${V(ge)}</td>`).join("") + "</tr>").join("");
    fe.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${K + 1}</b><span style="color:#9fb0c6">L = ${Z.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${Z.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${Z.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${J ? ` \xB7 <b style="color:#f59e0b">${J}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${ue.map((oe) => `<th style="color:#9fb0c6;padding:2px 6px">${oe}</th>`).join("")}</tr>${pe}</table></div>`, fe.querySelector(".hk-k-x").addEventListener("click", () => {
      fe.hidden = true;
    }), fe.querySelector(".hk-k-m").addEventListener("click", () => se(we)), fe.hidden = false;
  }
  return window.addEventListener("hk:model-selection", (K) => {
    var _a3;
    const Z = (_a3 = K.detail) == null ? void 0 : _a3.ultimo;
    ye || (ye = document.createElement("button"), ye.id = "hk-klocal-chip", ye.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(ye), ye.addEventListener("click", () => {
      const V = Number(ye.dataset.idx);
      V >= 0 && ce(V);
    })), ye.hidden = true, Z && Z.type === "frame" && (ye.dataset.idx = String(Z.idx), ye.textContent = "\u{1F4D0} Ver K local \xB7 barra " + (Z.idx + 1), fe && (fe.hidden = true), ye.hidden = false);
  }), window.__hekatanKLocal = (K) => vs(t, K), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = P, { abrir: P, abrirBarra: Q };
}
function ks(t, h = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(h)), setTimeout(() => {
    de.derive(() => {
      Qo.val, g.style.background = $i();
    });
  });
  const v = document.createElement("div");
  v.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(v), setTimeout(() => {
    de.derive(() => {
      v.textContent = Aa.val ? `[${Aa.val}]` : "";
    });
  });
  const _ = Array.from({ length: h + 1 }, (z, $) => $ / h).reverse();
  let C, P;
  _.forEach((z, $) => {
    C = document.createElement("div"), C.id = `marker-${$}`, C.className = "marker", C.style.marginTop = $ == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", P = document.createElement("p"), P.id = `marker-text-${$}`, C.append(P), g.append(C);
  });
  const F = [];
  return g.querySelectorAll("p").forEach((z) => F.push(z)), setTimeout(() => {
    de.derive(() => {
      _.forEach((z, $) => {
        const Y = F[$];
        Y && (Y.innerText = vl(t.val, z).toString());
      });
    });
  }), g;
}
function vl(t, h) {
  const g = go.val;
  if (g) return Ss(g[0] + h * (g[1] - g[0]));
  const v = t.filter((P) => Number.isFinite(P));
  if (v.length === 0) return "0";
  const [_, C] = Ea(v);
  return Ss(_ + h * (C - _));
}
function Ss(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const h = Math.abs(t);
  return h < 1e-3 || h >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function Vl({ mesh: t, settingsObj: h, drawingObj: g, objects3D: v, solids: _ }) {
  Ai.DEFAULT_UP = new E(0, 0, 1);
  const C = document.createElement("div"), P = new Si(), F = new Pi(45, 1, 0.1, 2 * 1e6), z = new zi(-10, 10, 10, -10, -1e3, 2e6);
  let $ = F;
  const Y = new Ci({ antialias: true });
  Y.localClippingEnabled = true;
  const B = new xs(F, Y.domElement);
  B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.keyPanSpeed = 12, B.listenToKeyEvents(window), B.touches = { ONE: Uo.ROTATE, TWO: Uo.DOLLY_PAN }, Y.domElement.addEventListener("wheel", (R) => {
    if (!R.ctrlKey && Math.abs(R.deltaX) > Math.abs(R.deltaY) * 1.5) {
      R.preventDefault();
      const O = B.target, le = new E().subVectors(F.position, O), ie = new E();
      ie.crossVectors(F.up, le).normalize();
      const Se = le.length() * 1e-3 * B.panSpeed;
      O.addScaledVector(ie, R.deltaX * Se), F.position.addScaledVector(ie, R.deltaX * Se), B.update();
    }
  }, { passive: false });
  const ee = new yo(new E(-1, 0, 0), 0), U = new yo(new E(0, -1, 0), 0), he = new yo(new E(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function Q() {
    const R = window.__hekatanClip, O = [];
    R.enableX && (ee.normal.set(R.invertX ? 1 : -1, 0, 0), ee.constant = R.invertX ? -R.posX : R.posX, O.push(ee)), R.enableY && (U.normal.set(0, R.invertY ? 1 : -1, 0), U.constant = R.invertY ? -R.posY : R.posY, O.push(U)), R.enableZ && (he.normal.set(0, 0, R.invertZ ? 1 : -1), he.constant = R.invertZ ? -R.posZ : R.posZ, O.push(he)), Y.clippingPlanes = O, P.traverse((ie) => {
      const Me = ie;
      if (Me.material) {
        const Se = Array.isArray(Me.material) ? Me.material : [Me.material];
        for (const Re of Se) Re.clippingPlanes = O, Re.needsUpdate = true;
      }
    });
    const le = window.__hekatanPanes ?? [];
    for (const ie of le) try {
      ie && typeof ie.refresh == "function" && ie.refresh();
    } catch {
    }
    Y.render(P, $);
  }
  Q(), window.__hekatanClipApply = Q;
  const q = Ii(h), ae = de.derive(() => Math.pow(10, q.displayScale.val / 10)), se = _l(t, q), ye = () => {
    const R = [];
    return q.gridXY.rawVal && R.push("xy"), q.gridXZ.rawVal && R.push("xz"), q.gridYZ.rawVal && R.push("yz"), R;
  }, fe = () => {
    const R = q.gridStep.rawVal, O = Math.max(R, q.gridMajor.rawVal);
    return { planes: ye(), majorStep: O, minorStep: R };
  };
  let we = ka(q.gridSize.rawVal, fe());
  we.visible = q.gridVisible.rawVal, window.__hekatanSnap2D = q.cursorSnap.rawVal;
  const ce = () => {
    const R = Math.max(0, Math.min(1, q.gridOpacity.rawVal));
    we.traverse((O) => {
      const le = O.material;
      if (!le || !("opacity" in le)) return;
      const ie = O.name ?? "";
      let Me = 0.55;
      ie.includes("border") ? Me = 1 : ie.includes("major") && (Me = 0.95), le.opacity = R * Me;
    });
  };
  ce(), C.appendChild(Vi(q, t, _)), C.setAttribute("id", "viewer"), C.appendChild(Y.domElement), Y.setPixelRatio(window.devicePixelRatio);
  const K = Xn();
  Y.setClearColor(K.background, 1);
  const Z = q.gridSize.rawVal, V = Z * 0.5 + Z * 0.5 / Math.tan(45 * 0.5);
  F.position.set(0, 0, V), F.up.set(0, 1, 0), B.target.set(0, 0, 0), B.minDistance = 0.1, B.maxDistance = 1e4, C.__settings = q, B.zoomSpeed = 1, B._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, B.update();
  let G = bs(q.gridSize.rawVal, q.flipAxes.rawVal);
  P.add(we, G), de.derive(() => {
    window.__hekatanGridPlaneXY = q.gridXY.val, window.__hekatanGridPlaneXZ = q.gridXZ.val, window.__hekatanGridPlaneYZ = q.gridYZ.val;
  });
  let X = true;
  de.derive(() => {
    const R = q.gridVisible.val;
    if (X) {
      X = false;
      return;
    }
    we.visible = R, te();
  });
  let I = true;
  de.derive(() => {
    if (q.gridOpacity.val, I) {
      I = false;
      return;
    }
    ce(), te();
  }), de.derive(() => {
    const R = q.cursorSnap.val;
    window.__hekatanSnap2D = R;
  });
  let J = true;
  de.derive(() => {
    var _a2, _b, _c;
    const R = q.gridSize.val, O = q.flipAxes.val;
    if (q.gridXY.val, q.gridXZ.val, q.gridYZ.val, q.gridStep.val, q.gridMajor.val, J) {
      J = false;
      return;
    }
    P.remove(we), (_a2 = we.traverse) == null ? void 0 : _a2.call(we, (Se) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Se.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), we = ka(R, fe()), we.visible = q.gridVisible.rawVal, P.add(we), ce(), P.remove(G), G.traverse((Se) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Se.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), G = bs(R, O), P.add(G);
    const le = R * 0.5 + R * 0.5 / Math.tan(45 * 0.5);
    F.position.distanceTo(B.target);
    const ie = Math.abs(F.position.x) < 0.1 && Math.abs(F.position.y) < 0.1 && F.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ie ? F.position.set(0, 0, le) : F.position.set(0.5 * R, -le, 0.5 * R), B.target.set(0, 0, 0)), B.minDistance = Math.max(0.05, R * 0.01), B.maxDistance = Math.max(50, R * 50), B.update(), te();
  }), new ResizeObserver((R) => {
    var _a2, _b;
    for (const O of R) {
      const le = (_a2 = O.target) == null ? void 0 : _a2.clientWidth, ie = (_b = O.target) == null ? void 0 : _b.clientHeight;
      if (le === 0 || ie === 0) continue;
      const Se = (pe ? le / 2 : le) / ie;
      F.aspect = Se, F.updateProjectionMatrix();
      const Re = z.top;
      if (z.left = -Re * Se, z.right = Re * Se, z.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = Se, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Ee = oe, He = Ee.top;
        Ee.left = -He * Se, Ee.right = He * Se, Ee.updateProjectionMatrix();
      }
      Y.setSize(le, ie), te();
    }
  }).observe(C), B.addEventListener("change", te), de.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2;
    (_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e2 = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e2.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, q.displayScale.val, q.nodes.val, q.elements.val, (_g = q.edges) == null ? void 0 : _g.val, q.elemColumns.val, q.elemBeams.val, q.nodesIndexes.val, q.elementsIndexes.val, q.orientations.val, q.sections.val, q.secColumns.val, q.secBeams.val, q.secFloor.val, q.supports.val, q.loads.val, q.deformedShape.val, q.nodeResults.val, q.frameResults.val, q.shellResults.val, (_h = q.solidResults) == null ? void 0 : _h.val, (_i2 = q.extruded) == null ? void 0 : _i2.val, setTimeout(te);
  });
  let pe = false, oe = null, H = null, ge = false;
  function te() {
    const R = C.clientWidth || 1, O = C.clientHeight || 1;
    if (!pe || !oe) {
      Y.setScissorTest(false), Y.setViewport(0, 0, R, O), Y.render(P, $);
      return;
    }
    const le = R / 2;
    Y.setScissorTest(true), Y.setViewport(0, 0, le, O), Y.setScissor(0, 0, le, O), Y.render(P, $), Y.setViewport(le, 0, le, O), Y.setScissor(le, 0, le, O), Y.render(P, oe), Y.setScissorTest(false);
  }
  function $e(R) {
    $ = R, B.object = R, B.update(), te();
  }
  function xe(R, O) {
    pe = R, O && (oe = O);
    const le = C.clientWidth || 1, ie = C.clientHeight || 1, Se = (R ? le / 2 : le) / ie;
    F.isPerspectiveCamera && (F.aspect = Se, F.updateProjectionMatrix());
    const Re = z.top;
    if (z.left = -Re * Se, z.right = Re * Se, z.updateProjectionMatrix(), R && oe) {
      if (H ? (H.object = oe, H.update()) : (H = new xs(oe, Y.domElement), H.enableDamping = true, H.dampingFactor = 0.1, H.screenSpacePanning = true, H.zoomSpeed = 0.8, H.panSpeed = 1.2, H.rotateSpeed = 0.9, H.touches = { ONE: Uo.ROTATE, TWO: Uo.DOLLY_PAN }, H.target.copy(B.target), H.addEventListener("change", te), H.enabled = false), !ge) {
        const Ee = (He) => {
          if (!pe || !H) return;
          const Ze = Y.domElement.getBoundingClientRect(), ke = He.clientX - Ze.left, Te = Ze.width / 2, Ye = ke >= Te;
          B.enabled = !Ye, H.enabled = Ye;
        };
        Y.domElement.addEventListener("pointerdown", Ee, true), Y.domElement.addEventListener("wheel", Ee, { capture: true, passive: true }), ge = true;
      }
    } else R || (B.enabled = true, H && (H.enabled = false));
    C.__splitMode = R, window.__hekatanSplitMode = R, window.__hekatanSplitCamera = R ? oe : null, te();
  }
  if (t) {
    P.add(Ti(q, se, ae), Ei(t, q, se), Bi(q, se, ae), Ni(t, q, se, ae), Ri(t, q, se, ae), Di(t, q, se, ae), Ui(t, q, se, ae), qi(t, q, se, ae), Hi(t, q, se), ji(t, q, se, ae), Ji(t, q, se, ae)), window.__hekatanDiagrama2D || (Ml(t, q), Y.domElement.addEventListener("dblclick", () => {
      var _a2;
      const Ee = (_a2 = q.frameResults) == null ? void 0 : _a2.rawVal;
      !Ee || Ee === "none" || !(window.__hekatanModelSelection ?? []).some((Ze) => Ze.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const R = ml({ scene: P, rendererElm: Y.domElement, getActiveCamera: () => $, derivedNodes: se, derivedDisplayScale: ae, mesh: t, settings: q, render: te });
    P.add(R);
    const O = Al(t, q), le = nl(t, q, se, O), ie = ks(O);
    P.add(le), C.appendChild(ie);
    const Me = ll(t, q, se);
    P.add(Me);
    const Se = Me.__colorMapValues, Re = ks(Se);
    Re.id = "frame-legend", C.appendChild(Re), de.derive(() => {
      var _a2;
      const Ee = q.shellResults.val != "none", He = (((_a2 = q.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ze = Ee || He, ke = q.frameResults.val.startsWith("contour:"), Te = O.val.some((Ye) => Number.isFinite(Ye));
      ie.hidden = !Ze || !Te, le.visible = Ze, Re.hidden = !ke;
    });
  }
  if (_) {
    const R = new As(16777215, 0.5);
    P.add(R);
    const O = new Ho(16777215, 0.5);
    O.position.set(30, 25, -10), O.shadow.mapSize.width = 1024, O.shadow.mapSize.height = 1024, P.add(O);
    const le = 10;
    O.shadow.camera.left = -le, O.shadow.camera.right = le, O.shadow.camera.top = le, O.shadow.camera.bottom = -le, O.shadow.camera.far = 1e3;
    const ie = new Ho(16777215, 0.5);
    ie.color.setHSL(11, 43, 96), ie.position.set(-10, 0, 30), P.add(ie), de.derive(() => {
      (_ == null ? void 0 : _.val.length) && (P.remove(..._.oldVal), P.add(..._.rawVal), te());
    }), de.derive(() => {
      _.rawVal.forEach((Me) => Me.visible = q.solids.val), te();
    });
  }
  if (v) {
    const R = [], O = (ie) => {
      var _a2;
      return ((_a2 = ie == null ? void 0 : ie.userData) == null ? void 0 : _a2.isCota) ? q.showCotas.val : q.custom3D.val;
    }, le = () => {
      for (const ie of R) ie.visible = O(ie);
      te();
    };
    de.derive(() => {
      const ie = v.val;
      R.length && (P.remove(...R), R.length = 0), ie.length && (P.add(...ie), R.push(...ie), le(), Y.clippingPlanes.length && Q()), te();
    }), de.derive(() => {
      q.custom3D.val, le();
    }), de.derive(() => {
      q.showCotas.val, le();
    });
  }
  g && el({ drawingObj: g, gridObj: we, scene: P, getActiveCamera: () => $, controls: B, gridSize: Z, derivedDisplayScale: ae, rendererElm: Y.domElement, viewerRender: te }), zs((R, O) => {
    var _a2;
    Y.setClearColor(O.background, 1), P.remove(we), (_a2 = we.traverse) == null ? void 0 : _a2.call(we, (le) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = le.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = le.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), we = ka(q.gridSize.rawVal, { planes: ye() }), P.add(we), C.style.setProperty("--awatif-legend-color", O.legendMarker), te();
  });
  const be = { scene: P, perspCamera: F, orthoCamera: z, get camera() {
    return $;
  }, controls: B, renderer: Y, rendererElm: Y.domElement, render: te, setActiveCamera: $e, setSplitMode: xe, get splitMode() {
    return pe;
  }, get splitCamera() {
    return oe;
  }, settings: q };
  C.__ctx = be;
  const _e = document.createElement("div");
  _e.id = "hk-nav-camara", _e.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Be = (R, O, le) => {
    const ie = document.createElement("button");
    return ie.textContent = R, ie.title = O, ie.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ie.onmouseenter = () => {
      ie.style.background = "rgba(70,70,70,0.9)";
    }, ie.onmouseleave = () => {
      ie.style.background = "rgba(40,40,40,0.85)";
    }, ie.onclick = (Me) => {
      Me.preventDefault(), le();
    }, ie;
  }, Pe = (R, O) => {
    const le = B.target, ie = new E().subVectors($.position, le), Me = ie.length(), Se = new E(), Re = new E();
    Se.crossVectors($.up, ie).normalize(), Re.copy($.up).normalize();
    const Ee = Me * 0.05;
    le.addScaledVector(Se, -R * Ee), le.addScaledVector(Re, O * Ee), $.position.addScaledVector(Se, -R * Ee), $.position.addScaledVector(Re, O * Ee), B.update(), te();
  }, nt = (R) => {
    const O = new E().subVectors($.position, B.target);
    O.multiplyScalar(R), $.position.copy(B.target).add(O), B.update(), te();
  }, st = () => {
    const R = document.createElement("div");
    return R.style.cssText = "width:32px;height:32px;", R;
  };
  return _e.append(st()), _e.append(Be("\u2191", "Pan arriba", () => Pe(0, 1))), _e.append(Be("\u2295", "Zoom in", () => nt(0.85))), _e.append(Be("\u2190", "Pan izquierda", () => Pe(-1, 0))), _e.append(Be("\u2302", "Reset vista", () => {
    B.reset(), te();
  })), _e.append(Be("\u2192", "Pan derecha", () => Pe(1, 0))), _e.append(Be("\u2296", "Zoom out", () => nt(1.18))), _e.append(Be("\u2193", "Pan abajo", () => Pe(0, -1))), _e.append(st()), getComputedStyle(C).position === "static" && (C.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && C.appendChild(_e), C;
}
function _l(t, h) {
  return de.derive(() => {
    var _a2, _b, _c, _d;
    if (!h.deformedShape.val) return ((_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], v = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!v || g.length === 0) return g;
    const _ = h.deformScale.val, C = h.deformScale.val * h.deformScaleZ.val, P = Number.isFinite(_) ? _ : 1, F = Number.isFinite(C) ? C : 1;
    return g.map((z, $) => {
      var _a3;
      const Y = ((_a3 = v.get($)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], B = Number.isFinite(Y[0]) ? Y[0] : 0, ee = Number.isFinite(Y[1]) ? Y[1] : 0, U = Number.isFinite(Y[2]) ? Y[2] : 0;
      return [z[0] + B * P, z[1] + ee * P, z[2] + U * F];
    });
  });
}
const go = de.state(null), Aa = de.state(""), kl = de.state("kN"), Sl = de.state("mm"), Pl = de.state("kN/m\xB2"), zl = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Ps = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Cl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Al(t, h) {
  const g = de.state([]);
  let v;
  return ((_) => {
    _.bendingXX = "bendingXX", _.bendingYY = "bendingYY", _.bendingXY = "bendingXY", _.membraneXX = "membraneXX", _.membraneYY = "membraneYY", _.membraneXY = "membraneXY", _.tranverseShearX = "tranverseShearX", _.tranverseShearY = "tranverseShearY", _.membranePrincipalMax = "membranePrincipalMax", _.membranePrincipalMin = "membranePrincipalMin", _.bendingPrincipalMax = "bendingPrincipalMax", _.bendingPrincipalMin = "bendingPrincipalMin", _.transverseShearMax = "transverseShearMax", _.vonMises = "vonMises", _.pressure = "pressure", _.displacementX = "displacementX", _.displacementY = "displacementY", _.displacementZ = "displacementZ";
  })(v || (v = {})), de.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const _ = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), he = (R, O) => {
      R == null ? void 0 : R.forEach((le, ie) => {
        const Me = t.elements.val[ie];
        if (Me) for (let Se = 0; Se < Me.length; Se++) O.set(Me[Se], [le[Se] ?? le[0]]);
      });
    };
    he((_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, _), he((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, C), he((_f = (_e2 = t.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, P), he((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, F), he((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, z), he((_l2 = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l2.membraneXY, $), he((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, Y), he((_p = (_o = t.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, B), he((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), he((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, U);
    const Q = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), fe = (R, O, le, ie, Me) => {
      R.forEach((Se, Re) => {
        var _a3, _b2;
        const Ee = Se[0] ?? 0, He = ((_a3 = O.get(Re)) == null ? void 0 : _a3[0]) ?? 0, Ze = ((_b2 = le.get(Re)) == null ? void 0 : _b2[0]) ?? 0, ke = (Ee + He) / 2, Te = Math.hypot((Ee - He) / 2, Ze);
        ie.set(Re, [ke + Te]), Me.set(Re, [ke - Te]);
      });
    };
    fe(F, z, $, Q, q), fe(_, C, P, ae, se), Y.forEach((R, O) => {
      var _a3;
      ye.set(O, [Math.hypot(R[0] ?? 0, ((_a3 = B.get(O)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const we = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, ce = (_w = h.solidResults) == null ? void 0 : _w.val, Z = ce && ce !== "none" ? ce : h.shellResults.val, V = we == null ? void 0 : we[Z], G = { bendingXX: [_, 0], bendingYY: [C, 0], bendingXY: [P, 0], membraneXX: [F, 0], membraneYY: [z, 0], membraneXY: [$, 0], tranverseShearX: [Y, 0], tranverseShearY: [B, 0], membranePrincipalMax: [Q, 0], membranePrincipalMin: [q, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [se, 0], transverseShearMax: [ye, 0], vonMises: [ee, 0], pressure: [U, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, X = h.shellResults.val, I = kl.val, J = Sl.val, ue = X === "displacementX" || X === "displacementY" || X === "displacementZ", pe = X === "bendingXX" || X === "bendingYY" || X === "bendingXY" || X === "bendingPrincipalMax" || X === "bendingPrincipalMin", oe = X === "membraneXX" || X === "membraneYY" || X === "membraneXY" || X === "membranePrincipalMax" || X === "membranePrincipalMin", H = X === "vonMises" || X === "pressure", ge = X === "tranverseShearX" || X === "tranverseShearY" || X === "transverseShearMax", te = (_D = h.solidResults) == null ? void 0 : _D.val, $e = te === "vonMises" || te === "sigmaXX" || te === "sigmaYY" || te === "sigmaZZ" || te === "tauXY" || te === "tauYZ" || te === "tauXZ", xe = te === "ux" || te === "uy" || te === "uz", be = Pl.val, _e = $e ? Cl[be] : xe || ue ? Ps[J] : pe || oe || H || ge ? 1 / zl[I] : 1, Be = $e ? be : xe || ue ? J : pe ? `${I}\xB7m/m` : oe ? `${I}/m\xB2` : H ? `${I}/m\xB2` : ge ? `${I}/m` : "";
    Aa.val = Be, go.val = Array.isArray(V) && V.length === 2 ? [V[0] * _e, V[1] * _e] : null;
    const Pe = Ls.val, st = te && te !== "none" ? [ee, 0] : G[X], Ne = [];
    if (t.nodes.val.forEach((R, O) => {
      const le = st;
      if (!le || !le[0] || typeof le[0].has != "function") return;
      if (!le[0].has(O)) {
        Ne.push(Number.NaN);
        return;
      }
      const ie = le[0].get(O), Me = ie ? ie[le[1]] ?? 0 : 0;
      Ne.push(Me * _e);
    }), !go.val && Pe !== "auto") {
      const R = t.nodes.val, O = /* @__PURE__ */ new Set(), le = (Me, Se) => {
        var _a3;
        const Re = (_a3 = R[Me[0]]) == null ? void 0 : _a3[Se];
        return Me.every((Ee) => {
          var _a4;
          return Math.abs((((_a4 = R[Ee]) == null ? void 0 : _a4[Se]) ?? NaN) - Re) < 1e-6;
        });
      };
      for (const Me of t.elements.val) {
        if (Me.length !== 4) continue;
        const Se = le(Me, 2), Re = !Se && le(Me, 0), Ee = !Se && le(Me, 1);
        if (Pe === "losas" ? Se : Pe === "muros" ? Re || Ee : Pe === "murosX" ? Re : Pe === "murosY" ? Ee : false) for (const ke of Me) O.add(ke);
      }
      const ie = [];
      for (const Me of O) {
        const Se = Ne[Me];
        Number.isFinite(Se) && ie.push(Se);
      }
      ie.length && (go.val = Ea(ie));
    }
    g.val = Ne;
  }), g;
}
export {
  Li as a,
  ks as b,
  kl as c,
  Sl as d,
  Pl as e,
  Vl as g
};
