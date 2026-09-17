import { u as un, a6 as Ko, q as xi, v as ue, a7 as gi, D as Rt, M as ct, B as Ve, F as Dt, a8 as bi, z as bt, a9 as Mi, aa as vi, h as ms, ab as ws, r as Hn, ac as Oo, ad as Qo, a4 as $s, _ as ut, b as mt, L as on, y as Vs, c as _i, ae as ki, f as xt, V as E, $ as Bn, af as Pa, K as na, d as Vt, a as za, A as Ls, t as ea, J as Si, H as _o, I as Pi, ag as jo, w as Ca, o as zi, N as Rn, a2 as lo, E as ys, S as ro, m as Mo, ah as $n, g as xs, i as gs, j as bs, P as ko, C as Ms, W as Ci, X as Ai, Y as Ei, Z as Fi, l as vs, T as Wo, U as $i } from "./theme-C-zoknmI.js";
import { T as Bt, O as _s } from "./Text-Cehu0nom.js";
import { P as Is } from "./tweakpane-BXg6ZhiP.js";
import { e as Vi } from "./styles-CqEyA8nI.js";
class Ts {
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
    this.map = Aa[w] || Aa.rainbow, this.n = g;
    const v = 1 / this.n, k = new un(), F = new un();
    this.lut.length = 0, this.lut.push(new un(this.map[0][1]));
    for (let A = 1; A < g; A++) {
      const $ = A * v;
      for (let z = 0; z < this.map.length - 1; z++) if ($ > this.map[z][0] && $ <= this.map[z + 1][0]) {
        const L = this.map[z][0], Y = this.map[z + 1][0];
        k.setHex(this.map[z][1], Ko), F.setHex(this.map[z + 1][1], Ko);
        const N = new un().lerpColors(k, F, ($ - L) / (Y - L));
        this.lut.push(N);
      }
    }
    return this.lut.push(new un(this.map[this.map.length - 1][1])), this;
  }
  copy(w) {
    return this.lut = w.lut, this.map = w.map, this.n = w.n, this.minV = w.minV, this.maxV = w.maxV, this;
  }
  getColor(w) {
    w = xi.clamp(w, this.minV, this.maxV), w = (w - this.minV) / (this.maxV - this.minV);
    const g = Math.round(w * this.n);
    return this.lut[g];
  }
  addColorMap(w, g) {
    return Aa[w] = g, this;
  }
  createCanvas() {
    const w = document.createElement("canvas");
    return w.width = 1, w.height = this.n, this.updateCanvas(w), w;
  }
  updateCanvas(w) {
    const g = w.getContext("2d", { alpha: false }), v = g.getImageData(0, 0, 1, this.n), k = v.data;
    let F = 0;
    const A = 1 / this.n, $ = new un(), z = new un(), L = new un();
    for (let Y = 1; Y >= 0; Y -= A) for (let N = this.map.length - 1; N >= 0; N--) if (Y < this.map[N][0] && Y >= this.map[N - 1][0]) {
      const ee = this.map[N - 1][0], U = this.map[N][0];
      $.setHex(this.map[N - 1][1], Ko), z.setHex(this.map[N][1], Ko), L.lerpColors($, z, (Y - ee) / (U - ee)), k[F * 4] = Math.round(L.r * 255), k[F * 4 + 1] = Math.round(L.g * 255), k[F * 4 + 2] = Math.round(L.b * 255), k[F * 4 + 3] = 255, F += 1;
    }
    return g.putImageData(v, 0, 0), w;
  }
}
const Aa = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Rs = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Li = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Rs, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, oa = ue.state("safe"), Ds = ue.state("auto");
function Bs(t) {
  t = Math.max(0, Math.min(1, t));
  const w = Li[oa.val] ?? Rs;
  for (let v = 0; v < w.length - 1; v++) {
    const [k, F, A, $] = w[v], [z, L, Y, N] = w[v + 1];
    if (t <= z) {
      const ee = (t - k) / (z - k);
      return [F + (L - F) * ee, A + (Y - A) * ee, $ + (N - $) * ee];
    }
  }
  const g = w[w.length - 1];
  return [g[1], g[2], g[3]];
}
function ks() {
  const w = new Uint8Array(1024);
  for (let v = 0; v < 256; v++) {
    const k = v / 255, [F, A, $] = Bs(k);
    w[v * 4 + 0] = F, w[v * 4 + 1] = A, w[v * 4 + 2] = $, w[v * 4 + 3] = 255;
  }
  const g = new Mi(w, 256, 1, vi);
  return g.minFilter = ms, g.magFilter = ms, g.wrapS = ws, g.wrapT = ws, g.needsUpdate = true, g;
}
function Ii() {
  const w = [];
  for (let g = 0; g <= 12; g++) {
    const v = 1 - g / 12, [k, F, A] = Bs(v);
    w.push(`rgb(${k | 0},${F | 0},${A | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${w.join(",")})`;
}
function Ta(t) {
  if (!t.length) return [0, 1];
  const w = [...t].sort((F, A) => F - A), g = (F) => w[Math.min(w.length - 1, Math.max(0, Math.round(F * (w.length - 1))))];
  let v = w.length >= 20 ? g(0.01) : w[0], k = w.length >= 20 ? g(0.99) : w[w.length - 1];
  return v >= 0 && k > 0 && (v = 0), k <= 0 && v < 0 && (k = 0), [v, k];
}
function Ti(t, w, g) {
  new Ts();
  const v = ks(), k = new gi({ uniforms: { cmap: { value: v }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: Rt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  ue.derive(() => {
    var _a;
    oa.val;
    const A = k.uniforms.cmap.value;
    k.uniforms.cmap.value = ks(), (_a = A == null ? void 0 : A.dispose) == null ? void 0 : _a.call(A);
  });
  const F = new ct(new Ve(), k);
  return F.renderOrder = -1, F.frustumCulled = false, F.userData.isShellArea = true, F.name = "__hekatan_shell_colormap", ue.derive(() => {
    F.geometry.setAttribute("position", new Dt(t.val.flat(), 3));
    const A = [], $ = [], z = [];
    w.val.forEach((ie, xe) => {
      ie.length === 3 ? (A.push(ie[0], ie[1], ie[2]), $.push(xe), z.push(0)) : ie.length === 4 && (A.push(ie[0], ie[1], ie[2]), A.push(ie[0], ie[2], ie[3]), $.push(xe, xe), z.push(0, 1));
    }), F.geometry.setIndex(new bi(A, 1)), F.userData.faceToElem = $, F.userData.faceLocal = z;
    const L = g.val.filter((ie) => Number.isFinite(ie));
    let Y, N;
    const ee = Po.val;
    if (ee ? (N = ee[0], Y = ee[1]) : [N, Y] = Ta(L), Y === N) {
      const ie = Math.max(Math.abs(Y) * 1e-6, 1e-9);
      Y += ie, N -= ie;
    }
    const U = ee && ee[0] > ee[1], we = Math.min(N, Y), j = Math.max(N, Y), q = j - we, ae = new Float32Array(g.val.length);
    for (let ie = 0; ie < g.val.length; ie++) {
      const xe = g.val[ie];
      if (!Number.isFinite(xe)) {
        ae[ie] = -1;
        continue;
      }
      const ye = ((U ? j + we - xe : xe) - we) / q;
      ae[ie] = Math.max(0, Math.min(1, ye));
    }
    F.geometry.setAttribute("scalar", new bt(ae, 1));
  }), F;
}
function Ri(t, w, g) {
  const v = document.createElement("div"), k = new Is({ title: "Settings", expanded: true, container: v });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(k), v.setAttribute("id", "settings");
  const F = "hk_settingsPos";
  let A = null;
  try {
    const U = localStorage.getItem(F);
    U && (A = JSON.parse(U));
  } catch {
  }
  v.style.cssText = ["position:fixed", A ? `left:${A.left}px` : "left:8px", A ? `top:${A.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const $ = () => {
    const U = v.querySelector(".tp-rotv_b");
    if (!U) {
      setTimeout($, 200);
      return;
    }
    U.style.cursor = "move", U.style.userSelect = "none";
    let we = false, j = 0, q = 0, ae = 0, ie = 0;
    U.addEventListener("mousedown", (xe) => {
      we = true, j = xe.clientX, q = xe.clientY;
      const me = v.getBoundingClientRect();
      ae = me.left, ie = me.top, v.style.left = `${ae}px`, v.style.top = `${ie}px`;
    }), window.addEventListener("mousemove", (xe) => {
      if (!we) return;
      const me = xe.clientX - j, ye = xe.clientY - q, de = Math.max(0, Math.min(window.innerWidth - 40, ae + me)), K = Math.max(0, Math.min(window.innerHeight - 40, ie + ye));
      v.style.left = `${de}px`, v.style.top = `${K}px`;
    }), window.addEventListener("mouseup", () => {
      if (we) {
        we = false;
        try {
          localStorage.setItem(F, JSON.stringify({ left: parseFloat(v.style.left), top: parseFloat(v.style.top) }));
        } catch {
        }
      }
    });
  };
  if ($(), w == null ? void 0 : w.nodes) {
    k.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const U = k.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    U.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), U.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), U.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), U.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const we = U.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    we.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), we.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), we.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const j = k.addFolder({ title: "\u{1F441} Ver", expanded: false });
    j.addBinding(t.nodes, "val", { label: "Nodes" }), j.addBinding(t.elements, "val", { label: "Elements" }), j.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), j.addBinding(t.faces, "val", { label: "  Caras (fill)" }), j.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), j.addBinding(t.elemColumns, "val", { label: "    Columnas" }), j.addBinding(t.elemBeams, "val", { label: "    Vigas" }), j.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), j.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), j.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), j.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), j.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), j.addBinding(t.orientations, "val", { label: "Orientations" }), j.addBinding(t.sections, "val", { label: "Sections" }), j.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), j.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), j.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), j.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), j.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((w == null ? void 0 : w.nodeInputs) || (w == null ? void 0 : w.elementInputs)) {
    const U = k.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    U.addBinding(t.supports, "val", { label: "Supports" }), U.addBinding(t.loads, "val", { label: "Loads" }), U.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), U.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((w == null ? void 0 : w.deformOutputs) || (w == null ? void 0 : w.analyzeOutputs)) {
    const U = k.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = U, U.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), U.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), U.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagrama2D) == null ? void 0 : _a.call(window);
    }), U.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagramaBarra) == null ? void 0 : _a.call(window);
    }), U.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), U.addBinding(oa, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), U.addBinding(Ds, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), U.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), U.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), U.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), U.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && k.addBinding(t.solids, "val", { label: "Solids" });
  const z = k.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), L = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), Y = () => {
    const U = window.__hekatanClipApply;
    typeof U == "function" && U();
  };
  let N = [];
  const ee = (U, we) => {
    for (const q of N) try {
      q.dispose();
    } catch {
    }
    N = [];
    const j = (q, ae) => {
      const ie = Math.floor(Math.min(U[ae], -50)), xe = Math.ceil(Math.max(we[ae], 50)), me = xe - ie > 400 ? 0.5 : 0.1;
      return L["pos" + q] = Math.max(ie, Math.min(xe, L["pos" + q])), z.addBinding(L, "pos" + q, { min: ie, max: xe, step: me, label: `  pos ${q} (m)` }).on("change", Y);
    };
    N.push(z.addBinding(L, "enableX", { label: "Cortar X" }).on("change", Y), j("X", 0), z.addBinding(L, "invertX", { label: "  invertir X" }).on("change", Y), z.addBinding(L, "enableY", { label: "Cortar Y" }).on("change", Y), j("Y", 1), z.addBinding(L, "invertY", { label: "  invertir Y" }).on("change", Y), z.addBinding(L, "enableZ", { label: "Cortar Z" }).on("change", Y), j("Z", 2), z.addBinding(L, "invertZ", { label: "  invertir Z" }).on("change", Y));
  };
  return ee([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (U, we) => {
    ee(U, we);
  }, v;
}
function Di(t) {
  return { gridSize: ue.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: ue.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: ue.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: ue.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: ue.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: ue.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: ue.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: ue.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: ue.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: ue.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: ue.state((t == null ? void 0 : t.nodes) ?? true), elements: ue.state((t == null ? void 0 : t.elements) ?? true), edges: ue.state((t == null ? void 0 : t.edges) ?? true), faces: ue.state((t == null ? void 0 : t.faces) ?? true), elemColumns: ue.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: ue.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: ue.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: ue.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: ue.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: ue.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: ue.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: ue.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: ue.state((t == null ? void 0 : t.orientations) ?? false), sections: ue.state((t == null ? void 0 : t.sections) ?? true), extruded: ue.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: ue.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: ue.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: ue.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: ue.state((t == null ? void 0 : t.secFloor) ?? -1), supports: ue.state((t == null ? void 0 : t.supports) ?? true), loads: ue.state((t == null ? void 0 : t.loads) ?? false), deformedShape: ue.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: ue.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: ue.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: ue.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: ue.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: ue.state((t == null ? void 0 : t.flipAxes) ?? false), solids: ue.state((t == null ? void 0 : t.solids) ?? true), custom3D: ue.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: ue.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: ue.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: ue.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function Bi(t, w, g) {
  const v = Hn(), k = new Oo(new Ve(), new Qo({ color: v.nodePoint }));
  return $s((F, A) => {
    k.material.color.setHex(A.nodePoint);
  }), k.frustumCulled = false, ue.derive(() => {
    t.nodes.val && k.geometry.setAttribute("position", new Dt(w.val.flat(), 3));
  }), ue.derive(() => {
    if (g.val, w.val, !t.nodes.rawVal) return;
    const F = w.rawVal ?? [];
    let A = t.gridSize.val * 0.5;
    if (F.length >= 2) {
      const z = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
      for (const Y of F) for (let N = 0; N < 3; N++) z[N] = Math.min(z[N], Y[N]), L[N] = Math.max(L[N], Y[N]);
      A = Math.max(L[0] - z[0], L[1] - z[1], L[2] - z[2], 0.1);
    }
    const $ = 0.03 * A;
    k.material.size = $ * g.rawVal;
  }), ue.derive(() => {
    k.visible = t.nodes.val;
  }), k;
}
function Ea(t, w) {
  const g = Hn(), v = new ut();
  v.name = "hekatan-grid";
  const k = (w == null ? void 0 : w.planes) ?? ["xy"];
  let F = (w == null ? void 0 : w.majorStep) ?? 1, A = (w == null ? void 0 : w.minorStep) ?? 0.1;
  for (F <= 0 && (F = 1), A <= 0 && (A = 0.1); t / A > 500; ) A *= 2;
  for (; t / F > 100; ) F *= 2;
  const $ = t / 2;
  F = Math.max(A, Math.round(F / A) * A);
  const L = new un(g.grid).multiplyScalar(1.3), Y = new un(g.grid).multiplyScalar(0.8), N = (j, q, ae, ie) => {
    const xe = [], me = j === "xy" ? (T, G) => [T, G, 0] : j === "xz" ? (T, G) => [T, 0, G] : (T, G) => [0, T, G], ye = Math.floor($ / q);
    for (let T = -ye; T <= ye; T++) {
      const G = T * q, X = me(G, -$), D = me(G, $);
      xe.push(...X, ...D);
    }
    for (let T = -ye; T <= ye; T++) {
      const G = T * q, X = me(-$, G), D = me($, G);
      xe.push(...X, ...D);
    }
    const de = new Ve();
    de.setAttribute("position", new Dt(xe, 3));
    const K = new mt({ color: ae, transparent: true, opacity: ie, depthWrite: false }), Z = new on(de, K);
    return Z.name = `grid-${j}-${q === A ? "minor" : "major"}`, Z;
  }, ee = (j, q, ae) => {
    const ie = j === "xy" ? (Z, T) => [Z, T, 0] : j === "xz" ? (Z, T) => [Z, 0, T] : (Z, T) => [0, Z, T], xe = [[-$, -$], [$, -$], [$, $], [-$, $]], me = [];
    for (const [Z, T] of xe) me.push(...ie(Z, T));
    const ye = new Ve();
    ye.setAttribute("position", new Dt(me, 3));
    const de = new mt({ color: q, transparent: true, opacity: ae, depthWrite: false }), K = new Vs(ye, de);
    return K.name = `grid-${j}-border`, K.renderOrder = 1, K;
  }, U = (j, q, ae) => {
    const ie = j === "xy" ? (de, K) => [de, K, 0] : j === "xz" ? (de, K) => [de, 0, K] : (de, K) => [0, de, K], xe = q === "u" ? [...ie(-$, 0), ...ie($, 0)] : [...ie(0, -$), ...ie(0, $)], me = new Ve();
    me.setAttribute("position", new Dt(xe, 3));
    const ye = new on(me, new mt({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
    return ye.name = `grid-${j}-eje-${q}`, ye.renderOrder = 1, ye;
  }, we = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const j of k) {
    v.add(N(j, A, Y, 0.12)), v.add(N(j, F, L, 0.4));
    const [q, ae] = we[j];
    v.add(U(j, "u", q)), v.add(U(j, "v", ae)), v.add(ee(j, L, 0.55));
  }
  return v.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: F, minorStep: A, gridSize: t, planes: [...k] }, v;
}
function Ni(t, w, g, v) {
  const k = new ut(), F = new _i(0.5, 0.5, 0.5), A = new ki(0.45, 0.7, 4);
  A.rotateX(Math.PI / 2), A.translate(0, 0, -0.35);
  const $ = new xt({ color: 10166822 }), z = new xt({ color: 2792847 }), L = new xt({ color: 3835647 }), Y = () => {
    const U = g.rawVal ?? [];
    if (U.length < 2) return w.gridSize.val * 0.5;
    let we = [1 / 0, 1 / 0, 1 / 0], j = [-1 / 0, -1 / 0, -1 / 0];
    for (const q of U) for (let ae = 0; ae < 3; ae++) q[ae] < we[ae] && (we[ae] = q[ae]), q[ae] > j[ae] && (j[ae] = q[ae]);
    return Math.max(j[0] - we[0], j[1] - we[1], j[2] - we[2], 0.1);
  }, N = () => 0.08 * Y(), ee = () => v.rawVal;
  return ue.derive(() => {
    var _a, _b;
    if (w.deformedShape.val, !w.supports.val) return;
    k.clear();
    const U = N();
    (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((we, j) => {
      const q = g.val[j];
      if (!q) return;
      const ae = we ?? [], ie = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), xe = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let me;
      ie >= 3 && xe >= 3 ? me = new ct(F, $) : ie >= 3 && xe === 0 ? me = new ct(A, z) : me = new ct(A, L), me.position.set(q[0], q[1], q[2]);
      const ye = U * ee();
      me.scale.set(ye, ye, ye), k.add(me);
    });
  }), ue.derive(() => {
    if (v.val, !w.supports.rawVal) return;
    const we = N() * ee();
    k.children.forEach((j) => j.scale.set(we, we, we));
  }), ue.derive(() => {
    k.visible = w.supports.val;
  }), k;
}
function Yi(t, w, g, v) {
  const k = new ut();
  k.name = "loadsGroup";
  function F($) {
    if ($.length < 2) return 0.12 * w.gridSize.rawVal;
    const z = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const N of $) for (let ee = 0; ee < 3; ee++) z[ee] = Math.min(z[ee], N[ee]), L[ee] = Math.max(L[ee], N[ee]);
    return 0.08 * Math.max(L[0] - z[0], L[1] - z[1], L[2] - z[2], 0.1);
  }
  ue.derive(() => {
    var _a, _b, _c;
    if (w.deformedShape.val, !w.loads.val) return;
    k.children.forEach((j) => {
      var _a2;
      return (_a2 = j.dispose) == null ? void 0 : _a2.call(j);
    }), k.clear();
    const $ = g.val, z = F($), L = 240, Y = [];
    (_c = (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((j, q) => {
      $[q] && j.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && Y.push(q);
    });
    let N = Y;
    if (Y.length > L) {
      const j = Y.map((D) => $[D][0]), q = Y.map((D) => $[D][1]), ae = Math.min(...j), ie = Math.max(...j), xe = Math.min(...q), me = Math.max(...q), ye = Y.map((D) => $[D][2]), de = Math.max(1e-6, (Math.max(...ye) - Math.min(...ye)) / 40), K = (D) => Math.round(D / de), Z = new Set(ye.map(K)), T = Math.max(4, Math.floor(L / Math.max(1, Z.size))), G = Math.max(2, Math.round(Math.sqrt(T))), X = /* @__PURE__ */ new Map();
      for (const D of Y) {
        const H = ie - ae < 1e-9 ? 0 : ($[D][0] - ae) / (ie - ae), fe = me - xe < 1e-9 ? 0 : ($[D][1] - xe) / (me - xe), he = Math.min(G - 1, Math.floor(H * G)), oe = Math.min(G - 1, Math.floor(fe * G)), W = `${he},${oe},${K($[D][2])}`, Me = Math.hypot(H * G - (he + 0.5), fe * G - (oe + 0.5)), te = X.get(W);
        (!te || Me < te.d) && X.set(W, { i: D, d: Me });
      }
      N = [...X.values()].map((D) => D.i);
    }
    let ee = 0;
    for (const j of N) {
      const q = t.nodeInputs.val.loads.get(j);
      for (let ae = 0; ae < 3; ae++) ee = Math.max(ee, Math.abs(q[ae]));
    }
    const U = N.length <= 60, we = (j) => {
      const q = Math.abs(j);
      return q >= 100 ? j.toFixed(0) : q >= 10 ? j.toFixed(1) : j.toFixed(2);
    };
    for (const j of N) {
      const q = t.nodeInputs.val.loads.get(j), ae = $[j];
      if (ae) for (let ie = 0; ie < 3; ie++) {
        const xe = q[ie];
        if (!(Math.abs(xe) > 1e-9 * (ee || 1))) continue;
        const me = new E(ie === 0 ? Math.sign(xe) : 0, ie === 1 ? Math.sign(xe) : 0, ie === 2 ? Math.sign(xe) : 0), ye = 0.45 + 0.55 * (ee ? Math.abs(xe) / ee : 1), de = new Bn(me, new E(...ae), 1, ie === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (de.userData = { nudo: ae, dir: me, rel: ye }, k.add(de), U) {
          const K = new Bt(we(xe), ie === 2 ? "#f5b642" : "#ff6b5e");
          K.userData = { nudo: ae, dir: me, rel: ye, texto: true }, k.add(K);
        }
      }
    }
    A(z * v.rawVal);
  });
  function A($) {
    k.children.forEach((z) => {
      const L = z.userData;
      if (!(L == null ? void 0 : L.dir)) return;
      const Y = $ * L.rel, N = new E(...L.nudo).addScaledVector(L.dir, -Y * (L.texto ? 1.12 : 1));
      z.position.copy(N), L.texto ? z.updateScale($ * 0.38) : z.scale.set(Y, Y, Y);
    });
  }
  return ue.derive(() => {
    v.val, w.loads.rawVal && A(F(g.rawVal) * v.rawVal);
  }), ue.derive(() => {
    k.visible = w.loads.val;
  }), k;
}
function Xi(t, w, g) {
  const v = new ut();
  return ue.derive(() => {
    if (!t.nodesIndexes.val) return;
    v.children.forEach((F) => F.dispose()), v.clear();
    const k = 0.05 * t.gridSize.val * 0.6;
    w.val.forEach((F, A) => {
      const $ = new Bt(`${A}`);
      $.position.set(...F), $.updateScale(k * g.rawVal), v.add($);
    });
  }), ue.derive(() => {
    if (g.val, !t.nodesIndexes.rawVal) return;
    const k = 0.05 * t.gridSize.val * 0.6;
    v.children.forEach((F) => F.updateScale(k * g.rawVal));
  }), ue.derive(() => {
    v.visible = t.nodesIndexes.val;
  }), v;
}
function Ui(t, w, g, v) {
  const k = new ut();
  return ue.derive(() => {
    var _a;
    if (w.deformedShape.val, !w.elementsIndexes.val) return;
    k.children.forEach((A) => A.dispose()), k.clear();
    const F = 0.05 * w.gridSize.val * 0.6;
    (_a = t.elements) == null ? void 0 : _a.val.forEach((A, $) => {
      const z = new Bt(`${$}`, void 0, "#001219");
      z.position.set(...Zi(A.map((L) => g.rawVal[L]))), z.updateScale(F * v.rawVal), k.add(z);
    });
  }), ue.derive(() => {
    if (v.val, !w.elementsIndexes.rawVal) return;
    const F = 0.05 * w.gridSize.val * 0.6;
    k.children.forEach((A) => A.updateScale(F * v.rawVal));
  }), ue.derive(() => {
    k.visible = w.elementsIndexes.val;
  }), k;
}
function Zi(t) {
  const w = t.reduce((v, k) => [v[0] + k[0], v[1] + k[1], v[2] + k[2]], [0, 0, 0]), g = t.length;
  return [w[0] / g, w[1] / g, w[2] / g];
}
function Ss(t, w) {
  const g = new ut(), v = Math.min(0.05 * t, 0.6), k = Hn(), F = new Bt("X", "red", "transparent"), A = new Bt(w ? "Z" : "Y", "green", "transparent"), $ = new Bt(w ? "Y" : "Z", "blue", "transparent"), z = new Bn(new E(1, 0, 0), new E(0, 0, 0), 1, k.axisArrow, 0.2, 0.2), L = new Bn(new E(0, 1, 0), new E(0, 0, 0), 1, k.axisArrow, 0.2, 0.2), Y = new Bn(new E(0, 0, 1), new E(0, 0, 0), 1, k.axisArrow, 0.2, 0.2);
  return F.position.set(1.3 * v, 0, 0), A.position.set(0, 1.3 * v, 0), $.position.set(0, 0, 1.3 * v), F.updateScale(0.4 * v), A.updateScale(0.4 * v), $.updateScale(0.4 * v), z.scale.set(v, v, v), L.scale.set(v, v, v), Y.scale.set(v, v, v), g.add(z, L, Y, F, A, $), g;
}
function ta(t, w) {
  const g = new E(...t), k = new E(...w).clone().sub(g), F = k.length(), A = k.dot(new E(1, 0, 0)) / F, $ = k.dot(new E(0, 1, 0)) / F, z = k.dot(new E(0, 0, 1)) / F, L = Math.sqrt(A ** 2 + $ ** 2);
  let Y = new Pa().fromArray([[A, $, z], [-$ / L, A / L, 0], [-A * z / L, -$ * z / L, L]].flat());
  return z === 1 && (Y = new Pa().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), z === -1 && (Y = new Pa().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new na().setFromMatrix3(Y);
}
function Va(t, w) {
  return t == null ? void 0 : t.map((g, v) => (9 * g + w[v]) / 10);
}
function So(t) {
  const w = t.reduce((v, k) => [v[0] + k[0], v[1] + k[1], v[2] + k[2]], [0, 0, 0]), g = t.length;
  return [w[0] / g, w[1] / g, w[2] / g];
}
function qi(t, w, g) {
  const v = So([w, g]), k = So([t, g]), F = So([t, w]), A = new E(...v).sub(new E(...k)).normalize(), $ = new E(...g).sub(new E(...F)).normalize(), z = A.clone().cross($).normalize(), L = z.clone().cross(A).normalize();
  return new na().makeBasis(A, L, z);
}
function Gi(t, w, g, v) {
  const k = new ut(), F = new Ve(), A = new mt({ vertexColors: true }), $ = [0, 0, 0], z = [1, 0, 0], L = [0, 1, 0], Y = [0, 0, 1];
  F.setAttribute("position", new Dt([...$, ...z, ...$, ...L, ...$, ...Y], 3));
  const N = [255, 0, 0], ee = [0, 255, 0], U = [0, 0, 255];
  return F.setAttribute("color", new Dt([...N, ...N, ...ee, ...ee, ...U, ...U], 3)), ue.derive(() => {
    var _a;
    w.deformedShape.val, w.orientations.val && (k.clear(), (_a = t.elements) == null ? void 0 : _a.val.forEach((we) => {
      const j = new on(F, A), q = g.rawVal[we[0]], ae = g.rawVal[we[1]];
      if (we.length === 2 && (j.position.set(...Va(q, ae)), j.rotation.setFromRotationMatrix(ta(q, ae))), we.length === 3) {
        const me = g.rawVal[we[2]];
        j.position.set(...So([q, ae, me])), j.rotation.setFromRotationMatrix(qi(q, ae, me));
      }
      const xe = 0.05 * w.gridSize.rawVal * 0.75 * v.rawVal;
      j.scale.set(xe, xe, xe), k.add(j);
    }));
  }), ue.derive(() => {
    if (v.val, !w.orientations.rawVal) return;
    const j = 0.05 * w.gridSize.val * 0.75 * v.rawVal;
    k.children.forEach((q) => q.scale.set(j, j, j));
  }), ue.derive(() => {
    k.visible = w.orientations.val;
  }), k;
}
function Ki(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const w = (t.b * 100).toFixed(0), g = (t.h * 100).toFixed(0);
    return `${w}x${g}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function Wi(t, w, g, v) {
  const k = new ut(), F = new ut();
  k.add(F);
  function A(de, K) {
    const Z = de / 2, T = K / 2, G = new Float32Array([0, -Z, -T, 0, Z, -T, 0, Z, T, 0, -Z, -T, 0, Z, T, 0, -Z, T]), X = new Ve();
    X.setAttribute("position", new bt(G, 3));
    const D = new Float32Array([0, -Z, -T, 0, Z, -T, 0, Z, T, 0, -Z, T, 0, -Z, -T]), H = new Ve();
    return H.setAttribute("position", new bt(D, 3)), { fill: X, outline: H };
  }
  function $(de, K = 24) {
    const Z = de / 2, T = new Float32Array(K * 9);
    for (let H = 0; H < K; H++) {
      const fe = H / K * Math.PI * 2, he = (H + 1) / K * Math.PI * 2;
      T[H * 9] = 0, T[H * 9 + 1] = 0, T[H * 9 + 2] = 0, T[H * 9 + 3] = 0, T[H * 9 + 4] = Z * Math.cos(fe), T[H * 9 + 5] = Z * Math.sin(fe), T[H * 9 + 6] = 0, T[H * 9 + 7] = Z * Math.cos(he), T[H * 9 + 8] = Z * Math.sin(he);
    }
    const G = new Ve();
    G.setAttribute("position", new bt(T, 3));
    const X = new Float32Array((K + 1) * 3);
    for (let H = 0; H <= K; H++) {
      const fe = H / K * Math.PI * 2;
      X[H * 3] = 0, X[H * 3 + 1] = Z * Math.cos(fe), X[H * 3 + 2] = Z * Math.sin(fe);
    }
    const D = new Ve();
    return D.setAttribute("position", new bt(X, 3)), { fill: G, outline: D };
  }
  function z(de, K, Z, T) {
    const G = Z ?? K * 0.08, X = T ?? de * 0.07, D = de / 2, H = K / 2, fe = H - G, he = X / 2, oe = [];
    function W(ge, ve, Pe, Xe) {
      oe.push(0, ge, ve, 0, Pe, ve, 0, Pe, Xe, 0, ge, ve, 0, Pe, Xe, 0, ge, Xe);
    }
    W(-D, -H, D, -fe), W(-he, -fe, he, fe), W(-D, fe, D, H);
    const Me = new Ve();
    Me.setAttribute("position", new bt(new Float32Array(oe), 3));
    const te = new Float32Array([0, -D, -H, 0, D, -H, 0, D, -fe, 0, he, -fe, 0, he, fe, 0, D, fe, 0, D, H, 0, -D, H, 0, -D, fe, 0, -he, fe, 0, -he, -fe, 0, -D, -fe, 0, -D, -H]), Ie = new Ve();
    return Ie.setAttribute("position", new bt(te, 3)), { fill: Me, outline: Ie };
  }
  function L(de, K, Z) {
    const T = de / 2, G = K / 2, X = T - Z, D = G - Z, H = [];
    function fe(Me, te, Ie, ge) {
      H.push(0, Me, te, 0, Ie, te, 0, Ie, ge, 0, Me, te, 0, Ie, ge, 0, Me, ge);
    }
    fe(-T, -G, T, -D), fe(-T, D, T, G), fe(-T, -D, -X, D), fe(X, -D, T, D);
    const he = new Ve();
    he.setAttribute("position", new bt(new Float32Array(H), 3));
    const oe = new Float32Array([0, -T, -G, 0, T, -G, 0, T, -G, 0, T, G, 0, T, G, 0, -T, G, 0, -T, G, 0, -T, -G, 0, -X, -D, 0, X, -D, 0, X, -D, 0, X, D, 0, X, D, 0, -X, D, 0, -X, D, 0, -X, -D]), W = new Ve();
    return W.setAttribute("position", new bt(oe, 3)), { fill: he, outline: W };
  }
  function Y(de, K, Z) {
    const T = de / 2, G = K / 2, X = T - Z, D = G - Z, H = new Ve(), fe = new Float32Array([0, -X, -D, 0, X, -D, 0, X, D, 0, -X, -D, 0, X, D, 0, -X, D]);
    H.setAttribute("position", new bt(fe, 3));
    const he = [];
    function oe(Ie, ge, ve, Pe) {
      he.push(0, Ie, ge, 0, ve, ge, 0, ve, Pe, 0, Ie, ge, 0, ve, Pe, 0, Ie, Pe);
    }
    oe(-T, -G, T, -D), oe(-T, D, T, G), oe(-T, -D, -X, D), oe(X, -D, T, D);
    const W = new Ve();
    W.setAttribute("position", new bt(new Float32Array(he), 3));
    const Me = new Float32Array([0, -T, -G, 0, T, -G, 0, T, -G, 0, T, G, 0, T, G, 0, -T, G, 0, -T, G, 0, -T, -G, 0, -X, -D, 0, X, -D, 0, X, -D, 0, X, D, 0, X, D, 0, -X, D, 0, -X, D, 0, -X, -D]), te = new Ve();
    return te.setAttribute("position", new bt(Me, 3)), { concFill: H, steelFillGeom: W, outline: te };
  }
  function N(de, K, Z) {
    const T = [], G = [[0, -de / 2, -K / 2], [0, -de / 2 + Z, -K / 2], [0, -de / 2 + Z, K / 2 - Z], [0, de / 2, K / 2 - Z], [0, de / 2, K / 2], [0, -de / 2, K / 2]], X = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const he of X) T.push(...G[he]);
    const D = new Ve();
    D.setAttribute("position", new bt(new Float32Array(T), 3));
    const H = [];
    for (let he = 0; he < G.length; he++) {
      const oe = (he + 1) % G.length;
      H.push(...G[he], ...G[oe]);
    }
    const fe = new Ve();
    return fe.setAttribute("position", new bt(new Float32Array(H), 3)), { fill: D, outline: fe };
  }
  function ee(de, K, Z, T) {
    const G = T / 2, X = [], D = [[0, -de - G, -K / 2], [0, -Z - G, -K / 2], [0, -Z - G, K / 2 - Z], [0, -G, K / 2 - Z], [0, -G, K / 2], [0, -de - G, K / 2]], H = [[0, G, -K / 2], [0, G + Z, -K / 2], [0, G + Z, K / 2 - Z], [0, de + G, K / 2 - Z], [0, de + G, K / 2], [0, G, K / 2]], fe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const Me of fe) X.push(...D[Me]);
    for (const Me of fe) X.push(...H[Me]);
    const he = new Ve();
    he.setAttribute("position", new bt(new Float32Array(X), 3));
    const oe = [];
    for (const Me of [D, H]) for (let te = 0; te < Me.length; te++) {
      const Ie = (te + 1) % Me.length;
      oe.push(...Me[te], ...Me[Ie]);
    }
    const W = new Ve();
    return W.setAttribute("position", new bt(new Float32Array(oe), 3)), { fill: he, outline: W };
  }
  function U(de, K, Z, T) {
    const G = K / 2, X = de, D = [[0, -X, -G], [0, -X, -G + Z], [0, -T, -G + Z], [0, -T, G - Z], [0, -X, G - Z], [0, -X, G], [0, 0, G], [0, 0, -G]], H = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], fe = [];
    for (const Me of H) fe.push(...D[Me]);
    const he = new Ve();
    he.setAttribute("position", new bt(new Float32Array(fe), 3));
    const oe = [];
    for (let Me = 0; Me < D.length; Me++) {
      const te = (Me + 1) % D.length;
      oe.push(...D[Me], ...D[te]);
    }
    const W = new Ve();
    return W.setAttribute("position", new bt(new Float32Array(oe), 3)), { fill: he, outline: W };
  }
  function we(de, K, Z, T, G) {
    const X = K / 2, D = G / 2, H = [], fe = [[0, -de, -X], [0, -de, -X + Z], [0, -D - T, -X + Z], [0, -D - T, X - Z], [0, -de, X - Z], [0, -de, X], [0, -D, X], [0, -D, -X]], he = fe.map((Ie) => [Ie[0], -Ie[1], Ie[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const Ie of oe) H.push(...fe[Ie]);
    for (const Ie of oe) H.push(...he[Ie]);
    const W = new Ve();
    W.setAttribute("position", new bt(new Float32Array(H), 3));
    const Me = [];
    for (const Ie of [fe, he]) for (let ge = 0; ge < Ie.length; ge++) {
      const ve = (ge + 1) % Ie.length;
      Me.push(...Ie[ge], ...Ie[ve]);
    }
    const te = new Ve();
    return te.setAttribute("position", new bt(new Float32Array(Me), 3)), { fill: W, outline: te };
  }
  function j(de, K, Z, T) {
    const G = de / 2, X = K / 2, D = T / 2, H = [[0, -D, -X], [0, D, -X], [0, D, X - Z], [0, G, X - Z], [0, G, X], [0, -G, X], [0, -G, X - Z], [0, -D, X - Z]], fe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], he = [];
    for (const te of fe) he.push(...H[te]);
    const oe = new Ve();
    oe.setAttribute("position", new bt(new Float32Array(he), 3));
    const W = [];
    for (let te = 0; te < H.length; te++) {
      const Ie = (te + 1) % H.length;
      W.push(...H[te], ...H[Ie]);
    }
    const Me = new Ve();
    return Me.setAttribute("position", new bt(new Float32Array(W), 3)), { fill: oe, outline: Me };
  }
  function q(de, K, Z = 24) {
    const T = de / 2, G = T - K, X = [];
    for (let he = 0; he < Z; he++) {
      const oe = he / Z * Math.PI * 2, W = (he + 1) / Z * Math.PI * 2, Me = Math.cos(oe), te = Math.sin(oe), Ie = Math.cos(W), ge = Math.sin(W);
      X.push(0, T * Me, T * te, 0, T * Ie, T * ge, 0, G * Ie, G * ge), X.push(0, T * Me, T * te, 0, G * Ie, G * ge, 0, G * Me, G * te);
    }
    const D = new Ve();
    D.setAttribute("position", new bt(new Float32Array(X), 3));
    const H = [];
    for (let he = 0; he < Z; he++) {
      const oe = he / Z * Math.PI * 2, W = (he + 1) / Z * Math.PI * 2;
      H.push(0, T * Math.cos(oe), T * Math.sin(oe), 0, T * Math.cos(W), T * Math.sin(W)), H.push(0, G * Math.cos(oe), G * Math.sin(oe), 0, G * Math.cos(W), G * Math.sin(W));
    }
    const fe = new Ve();
    return fe.setAttribute("position", new bt(new Float32Array(H), 3)), { fill: D, outline: fe };
  }
  const ae = new xt({ color: 52479, transparent: true, opacity: 0.35, side: Rt, depthWrite: false }), ie = new mt({ color: 52479 }), xe = new xt({ color: 16750848, transparent: true, opacity: 0.4, side: Rt, depthWrite: false }), me = new mt({ color: 16750848 });
  function ye(de, K) {
    const Z = Math.abs(K[0] - de[0]), T = Math.abs(K[1] - de[1]), G = Math.abs(K[2] - de[2]);
    return G > Z && G > T || T > Z && T > G;
  }
  return ue.derive(() => {
    var _a, _b;
    w.deformedShape.val, w.secColumns.val, w.secBeams.val, w.secFloor.val;
    const de = w.secColumns.rawVal, K = w.secBeams.rawVal;
    if (!de && !K) {
      k.children.forEach((D) => {
        D instanceof Bt && D.dispose();
      }), k.clear();
      return;
    }
    k.children.forEach((D) => {
      D instanceof Bt && D.dispose();
    }), k.clear();
    const Z = (_a = t.elements) == null ? void 0 : _a.val, T = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!Z || !T) return;
    const G = T.sectionShapes, X = w.secFloor.rawVal;
    Z.forEach((D, H) => {
      if (D.length !== 2) return;
      const fe = g.rawVal[D[0]], he = g.rawVal[D[1]];
      if (!fe || !he) return;
      const oe = ye(fe, he);
      if (oe && !de || !oe && !K) return;
      if (X >= 0) {
        const ge = Math.min(fe[1], he[1]);
        Math.max(fe[1], he[1]);
        const ve = w.gridSize.rawVal || 3;
        if (Math.floor(ge / ve + 0.01) !== X) return;
      }
      const W = G == null ? void 0 : G.get(H);
      if (!W) return;
      const Me = [(fe[0] + he[0]) / 2, (fe[1] + he[1]) / 2, (fe[2] + he[2]) / 2], te = ta(fe, he);
      if (W.type === "CFT") {
        const ge = Y(W.b, W.h, W.tw ?? W.b * 0.05), ve = new ct(ge.concFill, ae);
        ve.position.set(...Me), ve.rotation.setFromRotationMatrix(te), ve.userData.e = H, k.add(ve);
        const Pe = new ct(ge.steelFillGeom, xe);
        Pe.position.set(...Me), Pe.rotation.setFromRotationMatrix(te), Pe.userData.e = H, k.add(Pe);
        const Xe = new Vt(ge.outline, me);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = H, k.add(Xe);
      } else {
        let ge, ve, Pe;
        switch (W.type) {
          case "rect":
            ge = A(W.b, W.h), ve = ae, Pe = ie;
            break;
          case "circ":
            ge = $(W.d), ve = ae, Pe = ie;
            break;
          case "I":
            ge = z(W.b, W.h, W.tf, W.tw), ve = xe, Pe = me;
            break;
          case "HSS":
            ge = L(W.b, W.h, W.tw ?? W.b * 0.05), ve = xe, Pe = me;
            break;
          case "CFT":
            ge = Y(W.b, W.h, W.tw ?? W.b * 0.05), ve = xe, Pe = me;
            break;
          case "L":
            ge = N(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3), ve = xe, Pe = me;
            break;
          case "2L":
            ge = ee(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3, W.dis ?? 0.01), ve = xe, Pe = me;
            break;
          case "C":
          case "coldC":
            ge = U(W.b, W.h, W.tf ?? W.t ?? 3e-3, W.tw ?? W.t ?? 3e-3), ve = xe, Pe = me;
            break;
          case "2C":
            ge = we(W.b, W.h, W.tf ?? 5e-3, W.tw ?? 5e-3, W.dis ?? 0.01), ve = xe, Pe = me;
            break;
          case "T":
            ge = j(W.b, W.h, W.tf ?? 0.01, W.tw ?? 6e-3), ve = xe, Pe = me;
            break;
          case "pipe":
            ge = q(W.d, W.tw ?? W.d * 0.05), ve = xe, Pe = me;
            break;
          default:
            return;
        }
        const Xe = new ct(ge.fill, ve);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = H, k.add(Xe);
        const Ae = new Vt(ge.outline, Pe);
        Ae.position.set(...Me), Ae.rotation.setFromRotationMatrix(te), Ae.userData.e = H, k.add(Ae);
      }
      const Ie = Ki(W);
      if (Ie) {
        const ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(W.type) ? "#ff9900" : "#00ccff", Pe = new Bt(Ie, ve, "transparent");
        Pe.position.set(Me[0], Me[1], Me[2]);
        const Xe = 0.05 * w.gridSize.rawVal * 0.5;
        Pe.updateScale(Xe * ((v == null ? void 0 : v.rawVal) ?? 1)), F.add(Pe);
      }
    });
  }), ue.derive(() => {
    var _a, _b;
    const de = g.val, K = (_a = t.elements) == null ? void 0 : _a.rawVal;
    if (K) for (const Z of k.children) {
      const T = (_b = Z.userData) == null ? void 0 : _b.e;
      if (T === void 0) continue;
      const G = K[T], X = G && de[G[0]], D = G && de[G[1]];
      !X || !D || (Z.position.set((X[0] + D[0]) / 2, (X[1] + D[1]) / 2, (X[2] + D[2]) / 2), Z.rotation.setFromRotationMatrix(ta(X, D)));
    }
  }), v && ue.derive(() => {
    if (v.val, !w.sections.rawVal) return;
    const de = 0.05 * w.gridSize.val * 0.5;
    F.children.forEach((K) => {
      K instanceof Bt && K.updateScale(de * v.rawVal);
    });
  }), ue.derive(() => {
    k.visible = w.sections.val;
  }), ue.derive(() => {
    F.visible = w.sectionLabels.val;
  }), k;
}
function Hi(t) {
  if (!t) return null;
  const w = t.type, g = (Y, N) => [Y, N], v = (Y, N) => [g(-Y / 2, -N / 2), g(Y / 2, -N / 2), g(Y / 2, N / 2), g(-Y / 2, N / 2)], k = (Y, N = 24) => {
    const ee = Y / 2, U = [];
    for (let we = 0; we < N; we++) {
      const j = 2 * Math.PI * we / N;
      U.push(g(ee * Math.cos(j), ee * Math.sin(j)));
    }
    return U;
  }, F = t.b ?? 0, A = t.h ?? 0, $ = t.d ?? 0, z = t.tw ?? t.t ?? 0, L = t.tf ?? t.t ?? 0;
  switch (w) {
    case "rect":
      return F && A ? { contorno: v(F, A) } : null;
    case "circ":
      return $ ? { contorno: k($) } : null;
    case "pipe":
      return $ && z ? { contorno: k($), huecos: [k($ - 2 * z).reverse()] } : null;
    case "HSS":
      return F && A && z ? { contorno: v(F, A), huecos: [v(F - 2 * z, A - 2 * (L || z)).reverse()] } : null;
    case "CFT":
      return F && A ? { contorno: v(F, A) } : null;
    case "I":
      return F && A && z && L ? { contorno: [g(-F / 2, -A / 2), g(F / 2, -A / 2), g(F / 2, -A / 2 + L), g(z / 2, -A / 2 + L), g(z / 2, A / 2 - L), g(F / 2, A / 2 - L), g(F / 2, A / 2), g(-F / 2, A / 2), g(-F / 2, A / 2 - L), g(-z / 2, A / 2 - L), g(-z / 2, -A / 2 + L), g(-F / 2, -A / 2 + L)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return F && A && z && L ? { contorno: [g(-F / 2, -A / 2), g(F / 2, -A / 2), g(F / 2, -A / 2 + L), g(-F / 2 + z, -A / 2 + L), g(-F / 2 + z, A / 2 - L), g(F / 2, A / 2 - L), g(F / 2, A / 2), g(-F / 2, A / 2)] } : null;
    case "T":
      return F && A && z && L ? { contorno: [g(-z / 2, -A / 2), g(z / 2, -A / 2), g(z / 2, A / 2 - L), g(F / 2, A / 2 - L), g(F / 2, A / 2), g(-F / 2, A / 2), g(-F / 2, A / 2 - L), g(-z / 2, A / 2 - L)] } : null;
    case "L":
    case "2L":
      return F && A && z ? { contorno: [g(-F / 2, -A / 2), g(F / 2, -A / 2), g(F / 2, -A / 2 + z), g(-F / 2 + z, -A / 2 + z), g(-F / 2 + z, A / 2), g(-F / 2, A / 2)] } : null;
    default:
      return F && A ? { contorno: v(F, A) } : $ ? { contorno: k($) } : null;
  }
}
function Ji(t, w, g) {
  if (!t || t <= 0 || !w || !g || w <= 0 || g <= 0) return null;
  const v = Math.sqrt(Math.sqrt(g / w)), k = Math.sqrt(t / v), F = t / k;
  return !isFinite(k) || !isFinite(F) || k <= 0 || F <= 0 ? null : { contorno: [[-k / 2, -F / 2], [k / 2, -F / 2], [k / 2, F / 2], [-k / 2, F / 2]] };
}
function Oi(t) {
  const w = new _o();
  t.contorno.forEach(([g, v], k) => k ? w.lineTo(g, v) : w.moveTo(g, v)), w.closePath();
  for (const g of t.huecos ?? []) {
    const v = new Pi();
    g.forEach(([k, F], A) => A ? v.lineTo(k, F) : v.moveTo(k, F)), v.closePath(), w.holes.push(v);
  }
  return w;
}
function Qi(t, w, g) {
  const v = new ut();
  v.name = "extrusion";
  const k = new za({ color: 8369151, transparent: true, opacity: 0.92, side: Rt }), F = new za({ color: 12623968, transparent: true, opacity: 0.85, side: Rt }), A = new za({ color: 11583173, transparent: true, opacity: 0.85, side: Rt }), $ = new ut();
  $.add(new Ls(16777215, 0.55));
  const z = new ea(16777215, 0.75);
  z.position.set(30, 25, 40);
  const L = new ea(16777215, 0.35);
  L.position.set(-25, -20, 15), $.add(z, L);
  let Y = 0;
  return ue.derive(() => {
    var _a, _b, _c, _d, _e;
    const N = ((_a = w.extruded) == null ? void 0 : _a.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++Y, on: N }, v.visible = N;
    for (const ie of [...v.children]) ie !== $ && (v.remove(ie), (_c = (_b = ie.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (v.children.includes($) || v.add($), !N) return;
    const ee = g.val ?? [], U = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], we = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, j = we.sectionShapes ?? /* @__PURE__ */ new Map(), q = we.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      U.forEach((ie, xe) => {
        var _a2, _b2, _c2;
        if (ie.length === 2) {
          let me = Hi(j.get(xe)), ye = true;
          if (me || (me = Ji((_a2 = we.areas) == null ? void 0 : _a2.get(xe), (_b2 = we.momentsOfInertiaY) == null ? void 0 : _b2.get(xe), (_c2 = we.momentsOfInertiaZ) == null ? void 0 : _c2.get(xe)), ye = false), !me) return;
          const de = ee[ie[0]], K = ee[ie[1]];
          if (!de || !K) return;
          const Z = Math.hypot(K[0] - de[0], K[1] - de[1], K[2] - de[2]);
          if (Z < 1e-9) return;
          const T = new Si(Oi(me), { depth: Z, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new na().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const G = new ct(T, ye ? k : F);
          G.position.set(de[0], de[1], de[2]), G.rotation.setFromRotationMatrix(ta(de, K)), v.add(G);
          return;
        }
        if (ie.length === 3 || ie.length === 4) {
          const me = q.get(xe);
          if (!me || me <= 0) return;
          const ye = ie.map((ge) => ee[ge]).filter(Boolean);
          if (ye.length < 3) return;
          const de = [ye[1][0] - ye[0][0], ye[1][1] - ye[0][1], ye[1][2] - ye[0][2]], K = [ye[2][0] - ye[0][0], ye[2][1] - ye[0][1], ye[2][2] - ye[0][2]], Z = de[1] * K[2] - de[2] * K[1], T = de[2] * K[0] - de[0] * K[2], G = de[0] * K[1] - de[1] * K[0], X = Math.hypot(Z, T, G);
          if (X < 1e-12) return;
          const D = [Z / X, T / X, G / X], H = [], fe = (ge) => ye.map((ve) => [ve[0] + D[0] * ge, ve[1] + D[1] * ge, ve[2] + D[2] * ge]), he = Math.abs(D[2]) > 0.5, oe = D[2] > 0 ? -1 : 1, W = fe(he ? 0 : +me / 2), Me = fe(he ? oe * me : -me / 2), te = (ge, ve, Pe) => H.push(...ge, ...ve, ...Pe);
          for (const ge of [W, Me]) te(ge[0], ge[1], ge[2]), ge.length === 4 && te(ge[0], ge[2], ge[3]);
          for (let ge = 0; ge < ye.length; ge++) {
            const ve = (ge + 1) % ye.length;
            te(W[ge], Me[ge], Me[ve]), te(W[ge], Me[ve], W[ve]);
          }
          const Ie = new Ve();
          Ie.setAttribute("position", new Dt(H, 3)), Ie.computeVertexNormals(), v.add(new ct(Ie, A));
        }
      });
    } catch (ie) {
      ae = String((ie == null ? void 0 : ie.message) ?? ie);
    }
    globalThis.__extrusionDebug = { corridas: Y, on: N, fallo: ae, nElementos: U.length, nFormas: j.size, nEspesores: q.size, mallas: v.children.length - 1 };
  }), v;
}
function Ns(t, w, g = 0) {
  const v = [w[0] - t[0], w[1] - t[1], w[2] - t[2]], k = Math.hypot(v[0], v[1], v[2]) || 1, F = v[0] / k, A = v[1] / k, $ = v[2] / k, z = Math.sqrt(F * F + A * A);
  let L, Y, N;
  if (z < 1e-9) {
    const ee = $ > 0 ? 1 : -1;
    L = [0, 0, ee], Y = [1, 0, 0], N = [0, ee, 0];
  } else L = [F, A, $], Y = [-F * $ / z, -A * $ / z, z], N = [A / z, -F / z, 0];
  if (Math.abs(g) > 1e-12) {
    const ee = g * Math.PI / 180, U = Math.cos(ee), we = Math.sin(ee), j = Y.map((ae, ie) => U * ae + we * N[ie]), q = N.map((ae, ie) => -we * Y[ie] + U * ae);
    Y = j, N = q;
  }
  return { e1: L, e2: Y, e3: N };
}
function La(t, w) {
  if (!w) return [0, 0];
  const g = Number(w[0] ?? 0), v = Number(w[1] ?? 0);
  return t === "bendingsY" ? [g, -v] : [-g, v];
}
function Ys(t, w) {
  const g = (v) => v.map((k) => -k);
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
class Ho extends ut {
  constructor(w, g, v, k, F, A, $) {
    super();
    const z = new _o().moveTo(0, 0).lineTo(0, A[1]).lineTo(v, A[1]).lineTo(v, 0).lineTo(0, 0), L = z.getPoints(), Y = new Ve().setFromPoints(L);
    this.lines = new Vt(Y, new mt({ color: Hn().resultOutline })), this.lines.position.set(...w), this.lines.rotation.setFromRotationMatrix(k), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const N = new jo(z), ee = new xt({ color: A[1] > 0 ? 24435 : 11411474, side: Rt });
    this.mesh = new ct(N, ee), this.mesh.position.set(...w), this.mesh.rotation.setFromRotationMatrix(k), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Bt(`${F[1].toFixed(4)}`), this.normalizedResult = A, this.textPosition = So([w, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(k), this.add(this.text);
  }
  updateScale(w) {
    this.lines.scale.set(1, w * 2, 1), this.mesh.scale.set(1, w * 2, 1), this.text.updateScale(w * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * w);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Fa extends ut {
  constructor(w, g, v, k, F, A, $) {
    super();
    const z = F[0] * v / (F[0] + F[1]), L = F[0] * F[1] > 0;
    if (this.text = new Bt(`${F[0].toFixed(4)}`), this.text2 = new Bt(`${(F[1] * -1).toFixed(4)}`), this.normalizedResult = A, this.textPosition = Va(w, g), this.text2Position = Va(g, w), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(k), this.text2.rotation.setFromRotationMatrix(k), this.add(this.text, this.text2), L) {
      const Y = new _o().moveTo(0, 0).lineTo(0, A[0]).lineTo(z, 0).lineTo(0, 0), N = new _o().moveTo(z, 0).lineTo(v, -A[1]).lineTo(v, 0).lineTo(z, 0), ee = Y.getPoints(), U = N.getPoints(), we = new Ve().setFromPoints(ee), j = new Ve().setFromPoints(U), q = new mt({ color: Hn().resultOutline });
      this.lines = new Vt(we, q), this.lines2 = new Vt(j, q), this.lines.position.set(...w), this.lines2.position.set(...w), this.lines.rotation.setFromRotationMatrix(k), this.lines2.rotation.setFromRotationMatrix(k), $ && this.lines.rotateX(Math.PI / 2), $ && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new jo(Y), ie = new jo(N), xe = new xt({ color: A[0] > 0 ? 24435 : 11411474, side: Rt }), me = new xt({ color: -A[1] > 0 ? 24435 : 11411474, side: Rt });
      this.mesh = new ct(ae, xe), this.mesh2 = new ct(ie, me), this.mesh.position.set(...w), this.mesh2.position.set(...w), this.mesh.rotation.setFromRotationMatrix(k), this.mesh2.rotation.setFromRotationMatrix(k), $ && this.mesh.rotateX(Math.PI / 2), $ && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const Y = new _o().moveTo(0, 0).lineTo(0, A[0]).lineTo(v, -A[1]).lineTo(v, 0).lineTo(0, 0), N = Y.getPoints(), ee = new Ve().setFromPoints(N);
      this.lines = new Vt(ee, new mt({ color: Hn().resultOutline })), this.lines.position.set(...w), this.lines.rotation.setFromRotationMatrix(k), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const U = new jo(Y), we = new xt({ color: A[0] > 0 ? 24435 : 11411474, side: Rt });
      this.mesh = new ct(U, we), this.mesh.position.set(...w), this.mesh.rotation.setFromRotationMatrix(k), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(w) {
    var _a, _b;
    this.lines.scale.set(1, w * 2, 1), (_a = this.lines2) == null ? void 0 : _a.scale.set(1, w * 2, 1), this.mesh.scale.set(1, w * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, w * 2, 1), this.text.updateScale(w * 0.6), this.text2.updateScale(w * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * w), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * w);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a = this.lines2) == null ? void 0 : _a.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Xs = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Xs || {});
function ji(t, w, g, v) {
  const k = () => {
    const $ = g.rawVal;
    if (!($ == null ? void 0 : $.length)) return 0.05 * w.gridSize.rawVal;
    const z = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const N of $) for (let ee = 0; ee < 3; ee++) N[ee] < z[ee] && (z[ee] = N[ee]), N[ee] > L[ee] && (L[ee] = N[ee]);
    const Y = Math.hypot(L[0] - z[0], L[1] - z[1], L[2] - z[2]);
    return !isFinite(Y) || Y <= 0 ? 0.05 * w.gridSize.rawVal : 0.025 * Y;
  }, F = new ut(), A = { normals: Ho, shearsY: Ho, shearsZ: Ho, torsions: Ho, bendingsY: Fa, bendingsZ: Fa };
  return ue.derive(() => {
    var _a, _b;
    if (w.deformedShape.val, g.val, w.frameResults.val == "none") return;
    F.children.forEach((z) => z.dispose()), F.clear();
    const $ = Xs[w.frameResults.rawVal];
    (_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.rawVal[$]) == null ? void 0 : _b.forEach((z, L) => {
      var _a2, _b2, _c, _d, _e, _f;
      const Y = ((_a2 = t.elements) == null ? void 0 : _a2.rawVal[L]) ?? [0, 1], N = g.rawVal[Y[0]], ee = g.rawVal[Y[1]];
      if (!N || !ee) return;
      const U = new E(...ee).distanceTo(new E(...N)), we = el((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[$]), j = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, L)) ?? 0, q = Ns(N, ee, j), ae = Ys($, q), ie = new E(...q.e1), xe = new E(...ae), me = new na().makeBasis(ie, xe, ie.clone().cross(xe)), [ye, de] = La($, z), K = A[$] === Fa ? [ye, -de] : [ye, de], Z = K.map((G) => G / (we === 0 ? 1 : we)), T = new A[$](N, ee, U, me, K, Z, false);
      T.updateScale(k() * v.rawVal), F.add(T);
    });
  }), ue.derive(() => {
    if (v.val, w.frameResults.rawVal == "none") return;
    w.gridSize.val;
    const $ = k();
    F.children.forEach((z) => z.updateScale($ * v.rawVal));
  }), ue.derive(() => {
    F.visible = w.frameResults.val != "none";
  }), F;
}
function el(t) {
  let w = 0;
  return t == null ? void 0 : t.forEach((g) => {
    const v = Math.max(...(g ?? [0, 0]).map((k) => Math.abs(k)));
    v > w && (w = v);
  }), w;
}
class tl extends ut {
  constructor(w, g, v) {
    super();
    const k = g === Ra.reactions;
    v[0] && (this.xText1 = new Bt(`${k ? "Fx" : "Dx"}: ` + v[0].toFixed(4))), v[3] && (this.xText2 = new Bt(`${k ? "Mx" : "Rx"}: ` + v[3].toFixed(4))), v[1] && (this.yText1 = new Bt(`${k ? "Fy" : "Dy"}: ` + v[1].toFixed(4))), v[4] && (this.yText2 = new Bt(`${k ? "My" : "Ry"}: ` + v[4].toFixed(4))), v[2] && (this.zText1 = new Bt(`${k ? "Fz" : "Dz"}: ` + v[2].toFixed(4))), v[5] && (this.zText2 = new Bt(`${k ? "Mz" : "Rz"}: ` + v[5].toFixed(4))), (v[0] || v[3]) && (this.xArrow = new Bn(new E(1, 0, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (v[1] || v[4]) && (this.yArrow = new Bn(new E(0, 1, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (v[2] || v[5]) && (this.zArrow = new Bn(new E(0, 0, 1), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...w), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(w) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o2;
    (_a = this.xArrow) == null ? void 0 : _a.scale.set(w, w, w), (_b = this.yArrow) == null ? void 0 : _b.scale.set(w, w, w), (_c = this.zArrow) == null ? void 0 : _c.scale.set(w, w, w), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * w, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * w, 0, 0.5 * w), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * w, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * w, 0.5 * w), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * w), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * w + 0.5 * w), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * w), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * w), (_l2 = this.yText1) == null ? void 0 : _l2.updateScale(0.4 * w), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * w), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * w), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * w);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = this.xArrow) == null ? void 0 : _a.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var Ra = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(Ra || {});
function nl(t, w, g, v) {
  const k = new ut();
  return ue.derive(() => {
    var _a, _b;
    if (w.deformedShape.val, w.nodeResults.val == "none") return;
    k.children.forEach(($) => $.dispose()), k.clear();
    const F = Ra[w.nodeResults.rawVal], A = 0.05 * w.gridSize.val;
    (_b = (_a = t.deformOutputs) == null ? void 0 : _a.val[F]) == null ? void 0 : _b.forEach(($, z) => {
      const L = new tl(g.rawVal[z], F, $ ?? [0, 0, 0, 0, 0, 0]);
      L.updateScale(A * v.rawVal), k.add(L);
    });
  }), ue.derive(() => {
    if (v.val, w.nodeResults.rawVal == "none") return;
    const F = 0.05 * w.gridSize.val;
    k.children.forEach((A) => A.updateScale(F * v.rawVal));
  }), ue.derive(() => {
    k.visible = w.nodeResults.val != "none";
  }), k;
}
function ol({ drawingObj: t, gridObj: w, scene: g, getActiveCamera: v, controls: k, gridSize: F, derivedDisplayScale: A, rendererElm: $, viewerRender: z }) {
  var _a2;
  const L = new Ca(), Y = new zi(), N = (e) => {
    const n = $.getBoundingClientRect(), a = e.clientX - n.left, o = e.clientY - n.top, s = n.width || 1, r = n.height || 1;
    if (!!window.__hekatanSplitMode) {
      const i = s / 2;
      if (a >= i) return Y.x = (a - i) / i * 2 - 1, Y.y = -(o / r) * 2 + 1, window.__hekatanSplitCamera ?? v();
      Y.x = a / i * 2 - 1;
    } else Y.x = a / s * 2 - 1;
    return Y.y = -(o / r) * 2 + 1, v();
  }, ee = new ct(new Rn(1e4, 1e4), new xt({ side: Rt, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, g.add(ee);
  const U = (e, n, a) => {
    const o = new ct(new Rn(1e4, 1e4), new xt({ side: Rt, transparent: true, opacity: 0, depthWrite: false }));
    return o.rotation.set(e, n, a), o.visible = false, o.frustumCulled = false, g.add(o), o;
  }, we = U(Math.PI / 2, 0, 0), j = U(0, Math.PI / 2, 0);
  let q = false, ae = null, ie = null, xe = null;
  const me = new Vt(new Ve(), new mt({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  me.name = "ref-ifc-cadena", me.renderOrder = 1e3, me.frustumCulled = false, me.visible = false, g.add(me);
  const ye = (e, n, a) => Math.round(e * 1e3) + "," + Math.round(n * 1e3) + "," + Math.round(a * 1e3), de = (e) => {
    const n = /* @__PURE__ */ new Map();
    for (let a = 0; a + 0 < e.length / 6; a++) {
      const o = 6 * a;
      for (const s of [ye(e[o], e[o + 1], e[o + 2]), ye(e[o + 3], e[o + 4], e[o + 5])]) {
        const r = n.get(s);
        r ? r.push(a) : n.set(s, [a]);
      }
    }
    return n;
  }, K = (e) => {
    const { S: n, adj: a } = e, o = (y, b) => new E(n[6 * y + 3 * b], n[6 * y + 3 * b + 1], n[6 * y + 3 * b + 2]), s = /* @__PURE__ */ new Set([e.s]), r = (y, b) => {
      const S = [];
      let C = y, P = b;
      for (let I = 0; I < 3e3; I++) {
        const Q = (a.get(ye(P.x, P.y, P.z)) || []).filter((pe) => !s.has(pe));
        if (Q.length !== 1) break;
        const V = Q[0], R = o(V, 0), O = o(V, 1), se = R.distanceTo(P) < O.distanceTo(P) ? O : R, be = P.clone().sub(C).normalize(), Fe = se.clone().sub(P).normalize();
        if (be.dot(Fe) < Math.cos(35 * Math.PI / 180)) break;
        s.add(V), S.push(se), C = P, P = se;
      }
      return S;
    }, f = o(e.s, 0), i = o(e.s, 1), l = r(f, i), d = r(i, f), c = [...d.reverse(), f, i, ...l], x = d.length;
    if (c.length < 6) return c;
    const m = [], h = [];
    for (let y = 1; y < c.length; y++) m.push(c[y].distanceTo(c[y - 1]));
    for (let y = 1; y < c.length - 1; y++) {
      const b = c[y].clone().sub(c[y - 1]).normalize(), S = c[y + 1].clone().sub(c[y]).normalize();
      h.push(Math.acos(Math.max(-1, Math.min(1, b.dot(S)))) / Math.max(1e-6, (m[y - 1] + m[y]) / 2));
    }
    const M = h.map((y, b) => {
      let S = 0, C = 0;
      for (let P = b - 1; P <= b + 1; P++) P >= 0 && P < h.length && (S += h[P], C++);
      return S / C;
    }), _ = [];
    for (let y = 3; y < M.length - 3; y++) {
      const b = (M[y - 3] + M[y - 2] + M[y - 1]) / 3, S = (M[y + 1] + M[y + 2] + M[y + 3]) / 3, C = Math.min(b, S), P = Math.max(b, S);
      P > 0.03 && P / Math.max(C, 1e-6) > 2.2 && Math.abs(M[y] - (b + S) / 2) < P && (!_.length || y - _[_.length - 1] > 3) && _.push(y + 1);
    }
    let u = 0, p = c.length - 1;
    for (const y of _) y <= x && y > u && (u = y), y > x && y < p && (p = y);
    return c.slice(u, p + 1);
  }, Z = (e) => {
    if (xe = e, !e || e.length < 2) {
      me.visible = false;
      return;
    }
    me.geometry.dispose(), me.geometry = new Ve().setFromPoints(e), me.visible = true;
  }, T = (e) => {
    let n = 0;
    for (let x = 1; x < e.length - 1; x++) {
      const m = e[x].clone().sub(e[x - 1]).normalize(), h = e[x + 1].clone().sub(e[x]).normalize();
      n += Math.acos(Math.max(-1, Math.min(1, m.dot(h))));
    }
    const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (n < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const o = String(window.__hekatanArcModo ?? "angulo"), s = o === "x" ? 0 : o === "y" ? 1 : o === "z" ? 2 : -1, r = [0];
    for (let x = 1; x < e.length; x++) r.push(r[x - 1] + e[x].distanceTo(e[x - 1]));
    const f = (x, m) => {
      for (let h = 1; h < e.length; h++) {
        const M = x(e[h - 1], h - 1), _ = x(e[h], h);
        if (M <= m && m <= _ || _ <= m && m <= M) {
          const u = Math.abs(_ - M) < 1e-12 ? 0 : (m - M) / (_ - M);
          return e[h - 1].clone().lerp(e[h], u);
        }
      }
      return e[e.length - 1].clone();
    }, i = [], l = s >= 0 ? e[0].getComponent(s) : 0, d = s >= 0 ? e[e.length - 1].getComponent(s) : 0, c = s >= 0 && Math.abs(d - l) > 1e-6 && e.every((x, m) => m === 0 || (x.getComponent(s) - e[m - 1].getComponent(s)) * (d - l) >= -1e-6);
    for (let x = 0; x <= a; x++) {
      const m = c ? f((h) => h.getComponent(s), l + (d - l) * x / a) : f((h, M) => r[M], r[r.length - 1] * x / a);
      i.push([m.x, m.y, m.z]);
    }
    return i[0] = e[0].toArray(), i[a] = e[e.length - 1].toArray(), i;
  };
  window.__hekatanCadenaIfc = () => (xe || []).map((e) => [e.x, e.y, e.z]);
  const G = /* @__PURE__ */ new Map(), X = (e) => {
    const n = G.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(o * 9), r = new Float64Array(o * 3), f = new Int32Array(o * 3).fill(-1);
    if (a) {
      e.updateMatrixWorld();
      const l = new E();
      for (let M = 0; M < o * 3; M++) l.fromBufferAttribute(a, M).applyMatrix4(e.matrixWorld), s[3 * M] = l.x, s[3 * M + 1] = l.y, s[3 * M + 2] = l.z;
      const d = new E(), c = new E(), x = new E(), m = (M) => Math.round(s[3 * M] * 1e3) + "," + Math.round(s[3 * M + 1] * 1e3) + "," + Math.round(s[3 * M + 2] * 1e3), h = /* @__PURE__ */ new Map();
      for (let M = 0; M < o; M++) {
        const _ = 3 * M;
        d.set(s[3 * (_ + 1)] - s[3 * _], s[3 * (_ + 1) + 1] - s[3 * _ + 1], s[3 * (_ + 1) + 2] - s[3 * _ + 2]), c.set(s[3 * (_ + 2)] - s[3 * _], s[3 * (_ + 2) + 1] - s[3 * _ + 1], s[3 * (_ + 2) + 2] - s[3 * _ + 2]), x.crossVectors(d, c).normalize(), r[3 * M] = x.x, r[3 * M + 1] = x.y, r[3 * M + 2] = x.z;
        for (let u = 0; u < 3; u++) {
          const p = m(_ + u), y = m(_ + (u + 1) % 3), b = p < y ? p + "|" + y : y + "|" + p, S = h.get(b);
          S ? S.push(M, u) : h.set(b, [M, u]);
        }
      }
      for (const M of h.values()) M.length === 4 && (f[3 * M[0] + M[1]] = M[2], f[3 * M[2] + M[3]] = M[0]);
    }
    const i = { V: s, N: r, vec: f, n: o };
    return G.set(e.id, i), i;
  }, D = new ct(new Ve(), new xt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Rt }));
  D.name = "ref-ifc-cara", D.renderOrder = 999, D.frustumCulled = false, D.visible = false, g.add(D);
  let H = null;
  const fe = (e, n) => {
    const a = Math.cos(12 * Math.PI / 180), o = Math.cos(80 * Math.PI / 180), s = [e.N[3 * n], e.N[3 * n + 1], e.N[3 * n + 2]], r = new Uint8Array(e.n), f = [], i = [n];
    for (r[n] = 1; i.length && f.length < 4e4; ) {
      const l = i.pop();
      f.push(l);
      for (let d = 0; d < 3; d++) {
        const c = e.vec[3 * l + d];
        if (c < 0 || r[c]) continue;
        const x = e.N[3 * l] * e.N[3 * c] + e.N[3 * l + 1] * e.N[3 * c + 1] + e.N[3 * l + 2] * e.N[3 * c + 2], m = s[0] * e.N[3 * c] + s[1] * e.N[3 * c + 1] + s[2] * e.N[3 * c + 2];
        x >= a && m >= o && (r[c] = 1, i.push(c));
      }
    }
    return f;
  }, he = (e, n, a) => {
    if (!e || n < 0 || !a) {
      H && (H = null, D.visible = false);
      return;
    }
    if (H && H.m === e && H.tris.indexOf(n) >= 0) {
      H.punto = a.clone();
      return;
    }
    const o = X(e), s = fe(o, n), r = new Float32Array(s.length * 9), f = new E();
    let i = true;
    s.forEach((l, d) => {
      for (let c = 0; c < 9; c++) r[9 * d + c] = o.V[9 * l + c];
      f.x += o.N[3 * l], f.y += o.N[3 * l + 1], f.z += o.N[3 * l + 2];
    }), f.normalize();
    for (const l of s) if (f.x * o.N[3 * l] + f.y * o.N[3 * l + 1] + f.z * o.N[3 * l + 2] < Math.cos(5 * Math.PI / 180)) {
      i = false;
      break;
    }
    D.geometry.dispose(), D.geometry = new Ve(), D.geometry.setAttribute("position", new bt(r, 3)), D.material.color.set(i ? 3718648 : 16096779), D.visible = true, H = { m: e, t0: n, tris: s, normal: f, plana: i, punto: a.clone() };
  }, oe = (e, n) => {
    const a = new Uint8Array(e.n);
    for (const c of n) a[c] = 1;
    const o = (c) => Math.round(e.V[3 * c] * 1e3) + "," + Math.round(e.V[3 * c + 1] * 1e3) + "," + Math.round(e.V[3 * c + 2] * 1e3), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const c of n) for (let x = 0; x < 3; x++) {
      const m = e.vec[3 * c + x];
      if (m >= 0 && a[m]) continue;
      const h = 3 * c + x, M = 3 * c + (x + 1) % 3, _ = o(h), u = o(M);
      r.set(_, new E(e.V[3 * h], e.V[3 * h + 1], e.V[3 * h + 2])), r.set(u, new E(e.V[3 * M], e.V[3 * M + 1], e.V[3 * M + 2])), (s.get(_) || s.set(_, []).get(_)).push(u), (s.get(u) || s.set(u, []).get(u)).push(_);
    }
    const f = /* @__PURE__ */ new Set();
    let i = [];
    for (const c of s.keys()) {
      if (f.has(c)) continue;
      const x = [c];
      f.add(c);
      let m = "", h = c;
      for (let M = 0; M < 1e5; M++) {
        const _ = (s.get(h) || []).find((u) => u !== m && !f.has(u));
        if (!_) break;
        x.push(_), f.add(_), m = h, h = _;
      }
      x.length > i.length && (i = x);
    }
    const l = i.map((c) => r.get(c)), d = [];
    for (let c = 0; c < l.length; c++) {
      const x = l[(c + l.length - 1) % l.length], m = l[c], h = l[(c + 1) % l.length];
      if (m.distanceTo(x) < 1e-3) continue;
      const M = m.clone().sub(x).normalize(), _ = h.clone().sub(m).normalize();
      M.dot(_) > Math.cos(3 * Math.PI / 180) || d.push(m);
    }
    return d;
  }, W = (e, n, a) => {
    const s = new Ca(n.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
    return s.length ? s[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, n, a, o = 2) => {
    const s = new E(e[0], e[1], e[2]), r = new E(n[0], n[1], n[2]).normalize();
    let f = null;
    for (const i of [1, -1]) {
      const d = new Ca(s, r.clone().multiplyScalar(i), 0, o).intersectObjects(a, false);
      d.length && (f == null || d[0].distance < f) && (f = d[0].distance);
    }
    return f;
  }, window.__hekatanCaraIfc = () => H ? { tris: H.tris.length, plana: H.plana, normal: H.normal.toArray(), punto: H.punto.toArray(), contorno: oe(X(H.m), H.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const Me = /* @__PURE__ */ new Map(), te = new on(new Ve(), new mt({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  te.name = "ref-ifc-bordes", te.frustumCulled = false, te.visible = false, g.add(te);
  const Ie = 1, ge = (e, n, a) => Math.floor(e / Ie) + "," + Math.floor(n / Ie) + "," + Math.floor(a / Ie), ve = (e) => {
    const n = Me.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = [], s = /* @__PURE__ */ new Map();
    if (a) {
      e.updateMatrixWorld();
      const f = Math.floor(a.count / 3), i = new Float64Array(a.count * 3), l = new E();
      for (let u = 0; u < a.count; u++) l.fromBufferAttribute(a, u).applyMatrix4(e.matrixWorld), i[3 * u] = l.x, i[3 * u + 1] = l.y, i[3 * u + 2] = l.z;
      const d = (u) => Math.round(i[3 * u] * 1e3) + "," + Math.round(i[3 * u + 1] * 1e3) + "," + Math.round(i[3 * u + 2] * 1e3), c = new Float64Array(f * 3), x = new E(), m = new E(), h = new E();
      for (let u = 0; u < f; u++) {
        const p = 3 * u, y = 3 * u + 1, b = 3 * u + 2;
        x.set(i[3 * y] - i[3 * p], i[3 * y + 1] - i[3 * p + 1], i[3 * y + 2] - i[3 * p + 2]), m.set(i[3 * b] - i[3 * p], i[3 * b + 1] - i[3 * p + 1], i[3 * b + 2] - i[3 * p + 2]), h.crossVectors(x, m).normalize(), c[3 * u] = h.x, c[3 * u + 1] = h.y, c[3 * u + 2] = h.z;
      }
      const M = /* @__PURE__ */ new Map();
      for (let u = 0; u < f; u++) for (let p = 0; p < 3; p++) {
        const y = 3 * u + p, b = 3 * u + (p + 1) % 3, S = d(y), C = d(b), P = S < C ? S + "|" + C : C + "|" + S, I = M.get(P);
        I ? I.push(u) : M.set(P, [u, y, b]);
      }
      const _ = Math.cos(25 * Math.PI / 180);
      for (const u of M.values()) {
        const p = u[0], y = u[1], b = u[2];
        let S = u.length === 3;
        if (!S && u.length === 4) {
          const P = u[3], I = c[3 * p] * c[3 * P] + c[3 * p + 1] * c[3 * P + 1] + c[3 * p + 2] * c[3 * P + 2];
          S = Math.abs(I) < _;
        }
        if (!S) continue;
        const C = o.length / 6;
        o.push(i[3 * y], i[3 * y + 1], i[3 * y + 2], i[3 * b], i[3 * b + 1], i[3 * b + 2]);
        for (const [P, I, Q] of [[i[3 * y], i[3 * y + 1], i[3 * y + 2]], [i[3 * b], i[3 * b + 1], i[3 * b + 2]], [(i[3 * y] + i[3 * b]) / 2, (i[3 * y + 1] + i[3 * b + 1]) / 2, (i[3 * y + 2] + i[3 * b + 2]) / 2]]) {
          const V = ge(P, I, Q), R = s.get(V);
          R ? R[R.length - 1] !== C && R.push(C) : s.set(V, [C]);
        }
      }
    }
    const r = { segs: new Float32Array(o), celdas: s };
    return Me.set(e.id, r), r;
  };
  let Pe = "";
  const Xe = (e) => {
    const n = e.map((f) => f.id).join(",");
    if (n === Pe) return;
    Pe = n;
    const a = e.map((f) => ve(f).segs);
    let o = 0;
    for (const f of a) o += f.length;
    const s = new Float32Array(o);
    let r = 0;
    for (const f of a) s.set(f, r), r += f.length;
    te.geometry.dispose(), te.geometry = new Ve(), te.geometry.setAttribute("position", new bt(s, 3)), te.visible = o > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    te.visible = Pe !== "" && window.__hekatanRefIfcBordes !== false, z();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const n of Me.values()) e += n.segs.length / 6;
    return e;
  };
  const Ae = (e, n) => {
    const a = window.__hekatanCursorPx;
    if (!a) return null;
    const o = ve(e), s = o.segs, r = Math.floor(n.x / Ie), f = Math.floor(n.y / Ie), i = Math.floor(n.z / Ie), l = /* @__PURE__ */ new Set();
    let d = In, c = null, x = In, m = null, h = -1;
    const M = new E(), _ = new E();
    for (let u = -1; u <= 1; u++) for (let p = -1; p <= 1; p++) for (let y = -1; y <= 1; y++) {
      const b = o.celdas.get(r + u + "," + (f + p) + "," + (i + y));
      if (b) for (const S of b) {
        if (l.has(S)) continue;
        l.add(S);
        const C = 6 * S;
        M.set(s[C], s[C + 1], s[C + 2]), _.set(s[C + 3], s[C + 4], s[C + 5]);
        const P = Gn(M.x, M.y, M.z), I = Gn(_.x, _.y, _.z);
        if (!P || !I) continue;
        const Q = Math.hypot(P.x - a.x, P.y - a.y), V = Math.hypot(I.x - a.x, I.y - a.y);
        Q < d && (d = Q, c = M.clone()), V < d && (d = V, c = _.clone());
        const R = I.x - P.x, O = I.y - P.y, se = R * R + O * O || 1e-9;
        let be = ((a.x - P.x) * R + (a.y - P.y) * O) / se;
        be = Math.max(0, Math.min(1, be));
        const Fe = Math.hypot(a.x - (P.x + be * R), a.y - (P.y + be * O));
        Fe < x && (x = Fe, m = M.clone().lerp(_, be), h = S);
      }
    }
    return h >= 0 && (o.adj || (o.adj = de(o.segs)), ie = { S: o.segs, adj: o.adj, s: h }), c ? { tipo: "ifcVert", punto: c } : m ? { tipo: "ifcEdge", punto: m } : null;
  }, nt = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((r) => {
      var _a4;
      ((_a4 = r.userData) == null ? void 0 : _a4.refIfc) && r.isMesh && e.push(r);
    }), !e.length) return te.visible = false, Pe = "", null;
    Xe(e);
    const n = L.intersectObjects(e, false).filter((r) => {
      const f = r.object.material;
      return (f && f.clippingPlanes || []).every((l) => l.distanceToPoint(r.point) >= 0);
    });
    if (!n.length) return null;
    const a = n[0], o = n[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? he(a.object, a.faceIndex ?? -1, a.point) : H && he(null, -1, null);
    const s = Ae(a.object, a.point);
    if (s) return ae = { tipo: s.tipo }, [{ ...a, point: s.punto }];
    if (o && o.object === a.object && o.distance - a.distance <= 1.2) {
      const r = a.point.clone().add(o.point).multiplyScalar(0.5);
      return ae = { tipo: "ifcAxis" }, [{ ...a, point: r }];
    }
    return ae = { tipo: "ifc" }, [a];
  };
  let st = "", Ue = new Float32Array(0);
  const B = new on(new Ve(), new mt({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  B.name = "ref-ifc-seccion", B.renderOrder = 998, B.frustumCulled = false, B.visible = false, g.add(B);
  const J = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return B.visible = false, Ue = new Float32Array(0);
    const n = [];
    e.enableX && n.push([0, +e.posX]), e.enableY && n.push([1, +e.posY]), e.enableZ && n.push([2, +e.posZ]);
    const a = [];
    g.traverse((r) => {
      var _a3;
      ((_a3 = r.userData) == null ? void 0 : _a3.refIfc) && r.isMesh && a.push(r);
    });
    const o = JSON.stringify(n) + "|" + a.map((r) => r.id).join(",");
    if (o === st) return Ue;
    st = o;
    const s = [];
    if (n.length && a.length) {
      const r = [new E(), new E(), new E()];
      for (const f of a) {
        const i = f.geometry.getAttribute("position");
        if (i) {
          f.updateMatrixWorld();
          for (let l = 0; l + 2 < i.count; l += 3) {
            for (let d = 0; d < 3; d++) r[d].fromBufferAttribute(i, l + d).applyMatrix4(f.matrixWorld);
            for (const [d, c] of n) {
              const x = [r[0].getComponent(d) - c, r[1].getComponent(d) - c, r[2].getComponent(d) - c], m = [];
              for (let h = 0; h < 3; h++) {
                const M = r[h], _ = r[(h + 1) % 3], u = x[h], p = x[(h + 1) % 3];
                (u < 0 && p >= 0 || u >= 0 && p < 0) && m.push(M.clone().lerp(_, u / (u - p)));
              }
              m.length === 2 && s.push(m[0].x, m[0].y, m[0].z, m[1].x, m[1].y, m[1].z);
            }
          }
        }
      }
    }
    return Ue = new Float32Array(s), B.geometry.dispose(), B.geometry = new Ve(), B.geometry.setAttribute("position", new bt(Ue, 3)), B.visible = Ue.length > 0, Ue;
  };
  let re = null, le = null;
  const _e = (e, n) => {
    const a = J();
    if (!a.length) return null;
    let o = In * 2, s = null, r = -1;
    const f = new E(), i = new E();
    for (let l = 0; l + 5 < a.length; l += 6) {
      f.set(a[l], a[l + 1], a[l + 2]), i.set(a[l + 3], a[l + 4], a[l + 5]);
      const d = Gn(f.x, f.y, f.z), c = Gn(i.x, i.y, i.z);
      if (!d || !c) continue;
      const x = c.x - d.x, m = c.y - d.y, h = x * x + m * m || 1e-9;
      let M = ((e - d.x) * x + (n - d.y) * m) / h;
      M = Math.max(0, Math.min(1, M));
      const _ = Math.hypot(e - (d.x + M * x), n - (d.y + M * m));
      _ < o && (o = _, s = f.clone().lerp(i, M), r = l / 6);
    }
    return r >= 0 && (le !== a && (re = de(a), le = a), ie = { S: a, adj: re, s: r }), s;
  };
  let Ce = null;
  window.__hekatanSeccionIfc = () => J().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const n = J(), a = [], o = Math.max(1, Math.floor(n.length / 6 / e));
    for (let s = 0; s + 2 < n.length; s += 6 * o) a.push([n[s], n[s + 1], n[s + 2]]);
    return a;
  };
  const Ye = () => {
    ae = null;
    const e = nt();
    if (e) return e;
    if (q) return L.intersectObjects([ee], false);
    if (we.visible = !!window.__hekatanGridPlaneXZ, j.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Jt.visible) {
      const o = L.intersectObjects([Jt, jt, xn], false);
      if (o.length > 0) return o;
    }
    const a = [ee];
    return we.visible && a.push(we), j.visible && a.push(j), An.visible && jn.length > 0 && a.push(...jn), L.intersectObjects(a, false);
  }, Le = new Oo(new Ve(), new Qo()), Qe = new Oo(new Ve(), new Qo({ color: "gray", sizeAttenuation: false, size: 6 })), Ke = new Oo(new Ve(), new Qo({ color: "orange", sizeAttenuation: false, size: 5 }));
  g.add(Ke);
  const ze = document.createElement("input");
  ze.id = "hk-rubber-label", ze.type = "text", ze.spellcheck = false, ze.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, ze.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(ze);
  const Ne = document.createElement("div");
  Ne.id = "hk-rubber-angle", Ne.style.cssText = ["position:fixed", "z-index:99996", "pointer-events:none", "padding:2px 6px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px", "font-family:Consolas,monospace", "font-size:12px", "transform:translate(-50%,0)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ne);
  let qe = null, lt = null, et = false;
  const Mt = new E(), gt = (e, n, a, o, s, r) => {
    const f = o - e, i = s - n, l = r - a, d = Math.hypot(f, i, l);
    if (d < 0.01) {
      ze.style.display = "none";
      return;
    }
    qe = [e, n, a], lt = [f / d, i / d, l / d], Mt.set((e + o) / 2, (n + s) / 2, (a + r) / 2), Mt.project(v());
    const c = $.getBoundingClientRect(), x = c.left + (Mt.x * 0.5 + 0.5) * c.width, m = c.top + (-Mt.y * 0.5 + 0.5) * c.height;
    ze.style.left = x + "px", ze.style.top = m + "px", ze.style.display = "block";
    const h = new E(e, n, a).project(v()), M = new E(o, s, r).project(v()), _ = c.left + (h.x * 0.5 + 0.5) * c.width, u = c.top + (-h.y * 0.5 + 0.5) * c.height, p = c.left + (M.x * 0.5 + 0.5) * c.width, y = c.top + (-M.y * 0.5 + 0.5) * c.height;
    let b = Math.atan2(-(y - u), p - _) * 180 / Math.PI;
    if (b < 0 && (b += 360), Ne.textContent = `${Math.round(b) % 360}\xB0`, Ne.style.left = p + "px", Ne.style.top = y + 34 + "px", Ne.style.display = "block", !et) {
      if (ze.value = `${d.toFixed(2)} m`, document.activeElement !== ze) {
        const S = document.activeElement;
        S && (S.tagName === "INPUT" || S.tagName === "TEXTAREA") && S !== ze || ze.focus({ preventScroll: true });
      }
      try {
        ze.select();
      } catch {
      }
    }
  }, mn = () => {
    ze.style.display = "none", Ne.style.display = "none", qe = null, lt = null, et = false, document.activeElement === ze && ze.blur();
  }, St = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (n === "offset") {
      Kn = e, ce(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), ze.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (n === "circle" && Oe.length === 1) {
      const c = Oe[0];
      Oe = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, c[0], c[1], c[2], e), ce(`\u2713 C\xEDrculo r=${e} m en (${c[0].toFixed(2)}, ${c[1].toFixed(2)}, ${c[2].toFixed(2)}).`);
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
      Et = e, ce(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[n]}.`), ze.blur();
      return;
    }
    if (!qe || !lt || !t.polylines) return;
    let a = lt[0], o = lt[1], s = lt[2];
    At === "x" ? (a = Math.sign(a) || 1, o = 0, s = 0) : At === "y" ? (a = 0, o = Math.sign(o) || 1, s = 0) : At === "z" && (a = 0, o = 0, s = Math.sign(s) || 1);
    const r = qe[0] + a * e, f = qe[1] + o * e, i = qe[2] + s * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [r, f, i]];
    const l = t.polylines.rawVal, d = l.length ? l[l.length - 1] : [];
    t.polylines.val = [...l.slice(0, -1), [...d, t.points.rawVal.length - 1]], ze.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    z();
  }, Re = (e) => {
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
    if (e.kind === "relCart") return qe ? [qe[0] + e.dx, qe[1] + e.dy, qe[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const a = e.ang * Math.PI / 180;
      return [n[0] + e.L * Math.cos(a), n[1] + e.L * Math.sin(a), n[2]];
    }
    if (e.kind === "relPolar") {
      if (!qe) return null;
      const a = e.ang * Math.PI / 180;
      return [qe[0] + e.L * Math.cos(a), qe[1] + e.L * Math.sin(a), qe[2]];
    }
    if (e.kind === "relSpherical") {
      if (!qe) return null;
      const a = e.az * Math.PI / 180, o = e.el * Math.PI / 180, s = e.L * Math.cos(o);
      return [qe[0] + s * Math.cos(a), qe[1] + s * Math.sin(a), qe[2] + e.L * Math.sin(o)];
    }
    return null;
  }, je = (e) => {
    var _a3, _b;
    va(new E(e[0], e[1], e[2]), null), qe = e, et = false;
    try {
      ze.select();
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
    const n = Re(e);
    if (!n) return false;
    if (n.kind === "length") return St(n.L), true;
    const a = ot(n);
    if (!a) return false;
    va(new E(a[0], a[1], a[2]), null), qe = a, ze.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, ze.addEventListener("keydown", (e) => {
    var _a3, _b, _c;
    if (e.key === "Enter") {
      if (e.preventDefault(), !et) {
        (_a3 = window.__hekatanFinalizeDraw) == null ? void 0 : _a3.call(window);
        try {
          (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c.call(_b, "select");
        } catch {
        }
        return;
      }
      const a = Re(ze.value);
      if (!a) return;
      if (et = false, a.kind === "length") St(a.L), ce(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const o = ot(a);
        if (!o) return;
        je(o);
        const s = a.kind;
        ce(`\u270F ${s} \u2192 (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), et = false, ze.blur();
      return;
    }
    const n = e.key.toLowerCase();
    if (n === "x" || n === "y" || n === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!et && ze.style.display === "block") try {
          ze.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (et = true);
  }), window.addEventListener("keydown", (e) => {
    if (!qe || !lt || document.activeElement === ze) return;
    const n = document.activeElement;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (ze.value = e.key, ze.focus(), ze.setSelectionRange(1, 1), e.preventDefault());
  });
  const Ee = document.createElement("div");
  Ee.id = "hk-coord-readout", Ee.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Ee.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Ee);
  const De = document.createElement("div");
  De.id = "hk-coord-fixed", De.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", De.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(De);
  const We = new Vt(new Ve().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new lo({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  We.frustumCulled = false, We.visible = false, We.name = "rubberBand", g.add(We), window.__hekatanRubberBand = We;
  const Be = new Vt(new Ve(), new mt({ color: 2282478, transparent: true, opacity: 0.9 }));
  Be.frustumCulled = false, Be.visible = false, g.add(Be);
  let at = [];
  const it = new Vt(new Ve(), new mt({ color: 16763904, transparent: true, opacity: 0.95 }));
  it.frustumCulled = false, it.visible = false, it.renderOrder = 999, g.add(it);
  let ft = [];
  const tt = document.createElement("div");
  tt.id = "hk-measure-label", tt.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(tt);
  const rt = (e) => {
    var _a3, _b;
    const n = N(e);
    if (!n) return null;
    L.setFromCamera(Y, n);
    let a = null, o = null;
    const s = L.intersectObjects(g.children, true).filter((m) => m.object.isMesh && m.object !== vt && m.object !== dt && m.object.visible !== false);
    if (s.length) {
      const m = s[0], h = m.point;
      a = [h.x, h.y, h.z];
      const _ = (_b = (_a3 = m.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      _ && m.face && (o = [m.face.a, m.face.b, m.face.c].map((u) => {
        const p = new E().fromBufferAttribute(_, u);
        return m.object.localToWorld(p), [p.x, p.y, p.z];
      }));
    } else {
      const m = Ye();
      if (m.length) {
        const h = m[0].point;
        a = [h.x, h.y, h.z];
      }
    }
    if (!a) return null;
    const r = $.getBoundingClientRect(), f = (m) => {
      const h = new E(m[0], m[1], m[2]).project(n);
      return [r.left + (h.x * 0.5 + 0.5) * r.width, r.top + (-h.y * 0.5 + 0.5) * r.height];
    }, i = [e.clientX, e.clientY], l = 14;
    let d = a, c = l;
    const x = (m) => {
      const h = f(m), M = Math.hypot(h[0] - i[0], h[1] - i[1]);
      M < c && (c = M, d = m);
    };
    for (const m of o ?? []) x(m);
    for (const m of t.points.rawVal) x(m);
    return d;
  }, Lt = () => {
    if (ft.length < 1) {
      tt.style.display = "none";
      return;
    }
    const e = v(), n = ft[0], a = ft[1] ?? ft[0], s = new E((n[0] + a[0]) / 2, (n[1] + a[1]) / 2, (n[2] + a[2]) / 2).clone().project(e), r = $.getBoundingClientRect();
    tt.style.left = r.left + (s.x * 0.5 + 0.5) * r.width + "px", tt.style.top = r.top + (-s.y * 0.5 + 0.5) * r.height - 14 + "px", tt.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Lt, window.__hekatanClearMeasure = () => {
    ft = [], it.visible = false, tt.style.display = "none";
    try {
      z();
    } catch {
    }
  };
  try {
    (_a2 = k.addEventListener) == null ? void 0 : _a2.call(k, "change", Lt);
  } catch {
  }
  const dt = new ct(new Ve(), new xt({ color: 16096779, transparent: true, opacity: 0.35, side: Rt, depthWrite: false }));
  dt.frustumCulled = false, dt.visible = false, dt.renderOrder = 998, dt.name = "hk-fill-preview", g.add(dt), $.addEventListener("pointerleave", () => {
    Ee.style.display = "none", dt.visible && (dt.visible = false, z());
  });
  const Ht = (e) => {
    var _a3, _b, _c, _d;
    const n = t.points.rawVal, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Map(), s = (u, p) => {
      u !== p && ((o.get(u) ?? o.set(u, /* @__PURE__ */ new Set()).get(u)).add(p), (o.get(p) ?? o.set(p, /* @__PURE__ */ new Set()).get(p)).add(u));
    };
    for (const u of a) for (let p = 0; p + 1 < u.length; p++) s(u[p], u[p + 1]);
    const r = (u, p) => {
      var _a4;
      return !!((_a4 = o.get(u)) == null ? void 0 : _a4.has(p));
    }, f = [], i = /* @__PURE__ */ new Set(), l = [...o.keys()];
    for (const u of l) for (const p of o.get(u)) if (!(p < u)) {
      for (const y of o.get(p)) if (y !== u) for (const b of o.get(y)) {
        if (b === u || b === p || !r(b, u) || r(u, y) || r(p, b)) continue;
        const S = [u, p, y, b].slice().sort((C, P) => C - P).join("-");
        i.has(S) || (i.add(S), f.push([u, p, y, b]));
      }
    }
    for (const u of l) for (const p of o.get(u)) if (!(p < u)) for (const y of o.get(p)) {
      if (y === u || !r(y, u)) continue;
      const b = [u, p, y].slice().sort((S, C) => S - C).join("-");
      i.has(b) || (i.add(b), f.push([u, p, y]));
    }
    const d = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", c = (u) => d === "xy" ? [u[0], u[1]] : d === "xz" ? [u[0], u[2]] : [u[1], u[2]], x = c(e), m = (u, p) => {
      let y = false;
      for (let b = 0, S = p.length - 1; b < p.length; S = b++) {
        const C = p[b][0], P = p[b][1], I = p[S][0], Q = p[S][1];
        P > u[1] != Q > u[1] && u[0] < (I - C) * (u[1] - P) / (Q - P) + C && (y = !y);
      }
      return y;
    }, h = (u) => {
      let p = 0;
      for (let y = 0, b = u.length - 1; y < u.length; b = y++) p += (u[b][0] + u[y][0]) * (u[b][1] - u[y][1]);
      return Math.abs(p) / 2;
    };
    let M = null, _ = 1 / 0;
    for (const u of f) {
      const p = u.map((b) => c(n[b]));
      if (!m(x, p)) continue;
      const y = h(p);
      y < _ && (_ = y, M = u);
    }
    return M;
  }, Pt = new ut(), Zt = new ct(new Rn(1, 1), new xt({ color: 2282478, transparent: true, opacity: 0.08, side: Rt, depthWrite: false })), an = new on(new ys(new Rn(1, 1)), new mt({ color: 2282478, transparent: true, opacity: 0.85 })), Ct = new on(new Ve(), new mt({ color: 2282478, transparent: true, opacity: 0.3 })), zo = (e, n) => {
    const a = [], o = Math.ceil(e / n);
    for (let s = -o; s <= o; s++) {
      const r = s * n;
      a.push(-e, r, 0, e, r, 0), a.push(r, -e, 0, r, e, 0);
    }
    Ct.geometry.dispose(), Ct.geometry = new Ve(), Ct.geometry.setAttribute("position", new Dt(a, 3));
  };
  Pt.add(Zt, an, Ct), Pt.visible = false, Pt.frustumCulled = false, g.add(Pt);
  const qt = new ut();
  qt.frustumCulled = false, qt.visible = false, g.add(qt);
  const Nn = (e) => {
    const n = new Ve().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), a = new lo({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Vt(n, a);
  }, Pn = Nn(16711680), wn = Nn(65280), Yn = Nn(35071);
  qt.add(Pn, wn, Yn);
  const Jn = [], aa = (e) => e.traverse((n) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = n.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Gt = Nn(16761856);
  Gt.material.dashSize = 0.28, Gt.material.gapSize = 0.16, Gt.material.opacity = 0.9, Gt.frustumCulled = false, Gt.visible = false, Gt.renderOrder = 98, g.add(Gt);
  const co = (e) => {
    const n = new Ve().setFromPoints([new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0)]), a = new mt({ color: e, transparent: true, opacity: 0.2, depthTest: false }), o = new Vs(n, a);
    return o.renderOrder = 997, o.frustumCulled = false, o;
  }, Xn = co(3462041), On = co(16724804), Un = co(6333946), yn = new ut();
  yn.frustumCulled = false, yn.visible = false, g.add(yn), yn.add(Xn, On, Un);
  const uo = (e) => {
    const n = new Rn(1, 1), a = new xt({ color: e, transparent: true, opacity: 0.06, side: Rt, depthWrite: false }), o = new ct(n, a);
    return o.frustumCulled = false, o.renderOrder = 996, o;
  }, Jt = uo(3462041), jt = uo(16724804), xn = uo(6333946);
  yn.add(Jt, jt, xn);
  const zn = (e, n, a, o) => {
    e.scale.set(2 * o, 2 * o, 1), a === "xy" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, 0, 0)) : a === "xz" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, gn = document.createElement("div");
  gn.id = "hk-refplane-badge", gn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(gn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = e, yn.visible = e, e) {
      const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0], f = window.__hekatanOrthoExt ?? 8;
      Cn(Xn, r, "xy", f), Cn(On, r, "xz", f), Cn(Un, r, "yz", f), zn(Jt, r, "xy", f), zn(jt, r, "xz", f), zn(xn, r, "yz", f), Jt.material.opacity = 0.05, jt.material.opacity = 0.05, xn.material.opacity = 0.05;
    } else {
      const n = document.getElementById("hk-refplane-badge");
      n && (n.style.display = "none");
    }
    z();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a3;
    if (window.__hekatanOrthoExt = e, !yn.visible) {
      z();
      return;
    }
    const n = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0];
    Cn(Xn, r, "xy", e), Cn(On, r, "xz", e), Cn(Un, r, "yz", e), zn(Jt, r, "xy", e), zn(jt, r, "xz", e), zn(xn, r, "yz", e), z();
  };
  const Da = (e) => {
    if (Jt.material.opacity = e === "xy" ? 0.09 : 0.025, jt.material.opacity = e === "xz" ? 0.09 : 0.025, xn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      gn.style.background = s.bg, gn.style.color = s.text, gn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, gn.style.display = "block";
    } else gn.style.display = "none";
  }, Cn = (e, n, a, o) => {
    let s;
    a === "xy" ? s = [new E(n[0] - o, n[1] - o, n[2]), new E(n[0] + o, n[1] - o, n[2]), new E(n[0] + o, n[1] + o, n[2]), new E(n[0] - o, n[1] + o, n[2]), new E(n[0] - o, n[1] - o, n[2])] : a === "xz" ? s = [new E(n[0] - o, n[1], n[2] - o), new E(n[0] + o, n[1], n[2] - o), new E(n[0] + o, n[1], n[2] + o), new E(n[0] - o, n[1], n[2] + o), new E(n[0] - o, n[1], n[2] - o)] : s = [new E(n[0], n[1] - o, n[2] - o), new E(n[0], n[1] + o, n[2] - o), new E(n[0], n[1] + o, n[2] + o), new E(n[0], n[1] - o, n[2] + o), new E(n[0], n[1] - o, n[2] - o)], e.geometry.setFromPoints(s);
  };
  let At = null;
  window.__hekatanAxisLock = () => At;
  let Qn = null, Nt = null;
  const Yt = document.createElement("div");
  Yt.id = "hk-axis-lock-badge", Yt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Yt);
  const Ba = () => {
    if (!At) {
      Yt.style.display = "none";
      return;
    }
    const e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Yt.style.background = "rgba(15,23,42,0.92)", Yt.style.color = e[At], Yt.style.border = `1.5px solid ${e[At]}`, Yt.textContent = `\u{1F512} LOCK ${At.toUpperCase()}`, Yt.style.display = "block";
  };
  window.addEventListener("keydown", (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    const n = document.activeElement;
    if (n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n !== ze) return;
    const a = e.key.toLowerCase(), o = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && o === "polyarea" && at.length >= 3) {
      const s = To();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") At = At === a ? null : a, Ba(), e.preventDefault();
    else if (e.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), ba(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || Uo(), ce(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (qt.visible = false), ce(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
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
  const Co = new E(), Ao = new E(), Na = new E(), Us = (e) => {
    if (!At) return null;
    const n = e[0], a = e[1], o = e[2];
    return At === "x" ? (Co.set(n - 1e4, a, o), Ao.set(n + 1e4, a, o)) : At === "y" ? (Co.set(n, a - 1e4, o), Ao.set(n, a + 1e4, o)) : (Co.set(n, a, o - 1e4), Ao.set(n, a, o + 1e4)), L.ray.distanceSqToSegment(Co, Ao, null, Na), Na;
  };
  window.__hekatanProjectOnAxis = Us;
  const Kt = new Vt(new Ve().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new mt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Kt.renderOrder = 998, Kt.frustumCulled = false, Kt.visible = false, g.add(Kt);
  let pn = -1, Vn = -1, Ln = -1;
  const Je = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Je;
  const bn = new Vt(new Ve().setFromPoints([new E(), new E()]), new mt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  bn.renderOrder = 997, bn.frustumCulled = false, bn.visible = false, g.add(bn);
  const sn = new ct(new ro(0.02, 12, 12), new xt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  sn.renderOrder = 998, sn.visible = false, g.add(sn);
  const Eo = (e) => {
    const n = v();
    if (n.isOrthographicCamera) {
      const o = n, s = (o.top - o.bottom) / o.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = n.position.distanceTo(e);
    return Math.max(0.05, a / 10);
  }, Ya = () => {
    sn.visible && sn.scale.setScalar(Eo(sn.position));
  }, Mn = new ut();
  Mn.frustumCulled = false, g.add(Mn);
  const Fo = 2282478;
  let vn = null;
  const Zs = (e, n, a, o) => {
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
  }, ln = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; Mn.children.length; ) {
      const f = Mn.children.pop();
      (_b = (_a3 = f.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = f.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], n = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], o = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const f of Je) {
      const [i, ...l] = f.split(":");
      if (i === "pt") {
        const d = e[+l[0]];
        if (!d) continue;
        const c = new ct(new ro(0.025, 12, 12), new xt({ color: Fo, transparent: true, opacity: 0.9, depthTest: false }));
        c.position.set(d[0], d[1], d[2]), c.renderOrder = 999, c.__isSelectionPt = true, Mn.add(c);
      } else if (i === "seg") {
        const d = n[+l[0]], c = e[d == null ? void 0 : d[+l[1]]], x = e[d == null ? void 0 : d[+l[1] + 1]];
        if (!c || !x) continue;
        const m = new Ve().setFromPoints([new E(c[0], c[1], c[2]), new E(x[0], x[1], x[2])]), h = new Vt(m, new mt({ color: Fo, transparent: true, opacity: 0.95, depthTest: false }));
        h.renderOrder = 999, Mn.add(h);
      } else if (i === "poly") {
        const c = n[+l[0]].map((h) => {
          const M = e[h];
          return M ? new E(M[0], M[1], M[2]) : null;
        }).filter(Boolean);
        if (c.length < 2) continue;
        const x = new Ve().setFromPoints(c), m = new Vt(x, new mt({ color: Fo, transparent: true, opacity: 0.95, depthTest: false }));
        m.renderOrder = 999, Mn.add(m);
      } else if (i === "aux") {
        const d = o[+l[0]];
        if (!d || d.length !== 6) continue;
        const c = new Ve().setFromPoints([new E(d[0], d[1], d[2]), new E(d[3], d[4], d[5])]), x = new Vt(c, new mt({ color: Fo, transparent: true, opacity: 0.95, depthTest: false }));
        x.renderOrder = 999, Mn.add(x);
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
  window.__hekatanRefreshSelection = ln, window.__hekatanSelectIds = (e) => {
    var _a3;
    Je.clear();
    for (const n of e) Je.add(n);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), Je.size;
  }, window.__hekatanClearSelection = () => {
    Je.clear(), ln();
  };
  const po = (e, n, a, o, s, r, f, i, l) => {
    const d = f - o, c = i - s, x = l - r, m = d * d + c * c + x * x;
    if (m < 1e-12) return Math.hypot(e - o, n - s, a - r);
    let h = ((e - o) * d + (n - s) * c + (a - r) * x) / m;
    h = Math.max(0, Math.min(1, h));
    const M = o + h * d, _ = s + h * c, u = r + h * x;
    return Math.hypot(e - M, n - _, a - u);
  }, sa = (e, n, a, o) => {
    if (!t.polylines) return null;
    const s = t.polylines.rawVal, r = t.points.rawVal;
    let f = -1, i = -1, l = o;
    for (let d = 0; d < s.length; d++) {
      const c = s[d];
      for (let x = 0; x < c.length - 1; x++) {
        const m = r[c[x]], h = r[c[x + 1]];
        if (!m || !h) continue;
        const M = po(e, n, a, m[0], m[1], m[2], h[0], h[1], h[2]);
        M < l && (l = M, f = d, i = x);
      }
    }
    return f >= 0 ? { polyIdx: f, segIdx: i, dist: l } : null;
  }, Xa = (e, n, a, o) => {
    const s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let f = -1, i = o;
    for (let l = 0; l < r.length; l++) {
      const d = r[l];
      if (!d || d.length !== 6) continue;
      const c = po(e, n, a, d[0], d[1], d[2], d[3], d[4], d[5]);
      c < i && (i = c, f = l);
    }
    return f;
  }, qs = (e) => {
    const n = window.__hekatanDrawingAuxLines, o = ((n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [])[e];
    if (!o || o.length !== 6) {
      Kt.visible = false;
      return;
    }
    Kt.geometry.setFromPoints([new E(o[0], o[1], o[2]), new E(o[3], o[4], o[5])]), Kt.visible = true;
  }, Gs = (e, n = -1) => {
    var _a3, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal[e], o = t.points.rawVal;
    if (!a || a.length < 2) {
      Kt.visible = false;
      return;
    }
    const s = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, r = [];
    if (s || n < 0 || n >= a.length - 1) for (const f of a) {
      const i = o[f];
      i && r.push(new E(i[0], i[1], i[2]));
    }
    else {
      const f = o[a[n]], i = o[a[n + 1]];
      f && r.push(new E(f[0], f[1], f[2])), i && r.push(new E(i[0], i[1], i[2]));
    }
    Kt.geometry.setFromPoints(r), Kt.visible = true;
  }, $o = (e) => {
    var _a3;
    if (!t.polylines) return;
    const n = t.polylines.rawVal;
    if (e < 0 || e >= n.length) return;
    const a = n.filter((l, d) => d !== e), o = /* @__PURE__ */ new Set();
    for (const l of a) for (const d of l) o.add(d);
    const s = t.points.rawVal, r = /* @__PURE__ */ new Map(), f = [];
    for (let l = 0; l < s.length; l++) o.has(l) && (r.set(l, f.length), f.push(s[l]));
    const i = a.map((l) => l.map((d) => r.get(d)).filter((d) => d !== void 0));
    t.points.val = f, t.polylines.val = i, t.areas && (t.areas.val = t.areas.rawVal.filter((l) => l !== e).map((l) => l > e ? l - 1 : l)), Kt.visible = false, pn = -1, Vn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, Ua = (e, n) => {
    var _a3, _b, _c;
    if (!t.polylines) return;
    const a = t.polylines.rawVal;
    if (e < 0 || e >= a.length) return;
    if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      $o(e);
      return;
    }
    const s = a[e];
    if (n < 0 || n >= s.length - 1) return;
    if (s.length === 2) {
      $o(e);
      return;
    }
    let r;
    n === 0 ? r = [s.slice(1)] : n === s.length - 2 ? r = [s.slice(0, -1)] : r = [s.slice(0, n + 1), s.slice(n + 1)];
    const f = [...a.slice(0, e), ...r, ...a.slice(e + 1)], i = /* @__PURE__ */ new Set();
    for (const m of f) for (const h of m) i.add(h);
    const l = t.points.rawVal, d = /* @__PURE__ */ new Map(), c = [];
    for (let m = 0; m < l.length; m++) i.has(m) && (d.set(m, c.length), c.push(l[m]));
    const x = f.map((m) => m.map((h) => d.get(h)).filter((h) => h !== void 0));
    if (t.points.val = c, t.polylines.val = x, t.areas) {
      const m = r.length - 1;
      t.areas.val = t.areas.rawVal.map((h) => h > e ? h + m : h);
    }
    Kt.visible = false, pn = -1, Vn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Le.geometry.setAttribute("position", new Dt(t.points.rawVal.flat(), 3)), Le.geometry.computeBoundingSphere(), Le.frustumCulled = false, Qe.frustumCulled = false, g.add(Qe), ee.position.set(0, 0, 0), ee.rotateX(Math.PI / 2), ee.geometry.rotateX(Math.PI / 2), ee.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, n, a) => {
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
  const Vo = [];
  window.__hekatanCirculos = Vo;
  let Za = [], qa = "";
  const Ga = () => {
    var _a3;
    const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = `${e.length}|${n.length}|${n.reduce((s, r) => s + r.length, 0)}`;
    if (a === qa) return Za;
    qa = a;
    const o = [];
    for (const s of n) {
      const r = s.length;
      if (r < 6 || s[0] !== s[r - 1]) continue;
      const f = s.slice(0, r - 1).map((c) => e[c]).filter(Boolean);
      if (f.length < 5) continue;
      const i = [0, 1, 2].map((c) => f.reduce((x, m) => x + m[c], 0) / f.length), l = f.map((c) => Math.hypot(c[0] - i[0], c[1] - i[1], c[2] - i[2])), d = l.reduce((c, x) => c + x, 0) / l.length;
      d < 1e-9 || l.some((c) => Math.abs(c - d) > 5e-3 * d) || o.push({ c: i, r: d });
    }
    return Za = o;
  };
  window.__hekatanCentrosDeducidos = Ga;
  const Lo = () => !!window.__hekatanCurvasAux, Io = (e, n) => {
    const a = window.__hekatanDrawingAuxLines;
    if (!a) return 0;
    zt();
    const o = a.rawVal ?? a.val ?? [], s = [];
    for (let r = 0; r + 1 < e.length; r++) s.push([...e[r], ...e[r + 1]]);
    return n && e.length > 2 && s.push([...e[e.length - 1], ...e[0]]), a.val = [...o, ...s], s.length;
  };
  window.__hekatanDrawCircle = (e, n, a, o, s = window.__hekatanArcSegs ?? 12, r = "xy") => {
    var _a3;
    const f = Math.max(4, Math.round(s)), i = t.points.rawVal.length, l = [];
    for (let d = 0; d < f; d++) {
      const c = 2 * Math.PI * d / f, x = o * Math.cos(c), m = o * Math.sin(c);
      let h;
      r === "xy" ? h = [e + x, n + m, a] : r === "xz" ? h = [e + x, n, a + m] : h = [e, n + x, a + m], l.push(h);
    }
    if (Vo.push({ c: [e, n, a], r: o }), Lo()) {
      Io(l, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...l], t.polylines) {
      const d = [...l.map((x, m) => i + m), i], c = t.polylines.rawVal;
      ((_a3 = c[c.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [...c, d, []] : t.polylines.val = [...c.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawArc = (e, n, a, o = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const s = Math.max(4, Math.round(o)), r = new E(...e), f = new E(...n), i = new E(...a), l = new E().subVectors(f, r), d = new E().subVectors(i, r), c = new E().crossVectors(l, d), x = 2 * c.lengthSq();
    let m;
    if (x < 1e-12) m = new E().addVectors(r, i).multiplyScalar(0.5);
    else {
      const se = d.clone().multiplyScalar(l.lengthSq()).sub(l.clone().multiplyScalar(d.lengthSq())), be = new E().crossVectors(se, c);
      m = r.clone().add(be.divideScalar(x));
    }
    const h = r.distanceTo(m), M = c.lengthSq() > 1e-12 ? c.clone().normalize() : new E(0, 1, 0), _ = new E().subVectors(r, m).normalize(), u = new E().crossVectors(M, _).normalize(), p = (se) => {
      const be = new E().subVectors(se, m);
      return Math.atan2(be.dot(u), be.dot(_));
    }, y = (se) => {
      let be = se;
      for (; be < 0; ) be += 2 * Math.PI;
      for (; be >= 2 * Math.PI; ) be -= 2 * Math.PI;
      return be;
    }, b = y(p(f)), S = y(p(i)), C = b <= S ? S : S - 2 * Math.PI, P = t.points.rawVal.length, I = [], Q = (se) => {
      const be = _.clone().multiplyScalar(Math.cos(se)).add(u.clone().multiplyScalar(Math.sin(se)));
      return m.clone().add(be.multiplyScalar(h));
    }, V = String(window.__hekatanArcModo ?? "angulo"), R = V === "x" ? 0 : V === "y" ? 1 : V === "z" ? 2 : -1;
    let O = false;
    if (R >= 0) {
      const se = e[R], be = a[R], Fe = 512;
      let pe = Math.abs(be - se) > 1e-9, $e = se;
      for (let ke = 1; ke <= Fe && pe; ke++) {
        const Ge = Q(C * ke / Fe).getComponent(R);
        (Ge - $e) * (be - se) < -1e-9 && (pe = false), $e = Ge;
      }
      if (pe) {
        O = true;
        for (let ke = 0; ke <= s; ke++) {
          const Ge = se + (be - se) * ke / s;
          let Te = 0, Se = C;
          for (let He = 0; He < 60; He++) {
            const pt = (Te + Se) / 2;
            (Q(pt).getComponent(R) - Ge) * (be - se) < 0 ? Te = pt : Se = pt;
          }
          const Ze = Q((Te + Se) / 2);
          I.push([Ze.x, Ze.y, Ze.z]);
        }
        I[0] = [e[0], e[1], e[2]], I[s] = [a[0], a[1], a[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${V.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!O) for (let se = 0; se <= s; se++) {
      const be = Q(C * (se / s));
      I.push([be.x, be.y, be.z]);
    }
    if (Vo.push({ c: [m.x, m.y, m.z], r: h }), Lo()) {
      Io(I, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...I], t.polylines) {
      const se = I.map((Fe, pe) => P + pe), be = t.polylines.rawVal;
      t.polylines.val = [...be.slice(0, -1), se, []];
    }
  };
  const Ka = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    for (let n = e.length - 1; n >= 0; n--) if (e[n] && e[n].length >= 2) return { i: n, pl: e[n] };
    return null;
  };
  window.__hekatanDividir = (e) => {
    var _a3;
    const n = Math.round(e);
    if (!(n >= 2)) return { ok: false, msg: "el n\xFAmero de partes va de 2 en adelante" };
    const a = Ka();
    if (!a) return { ok: false, msg: "no hay ninguna polil\xEDnea que dividir" };
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const o = [...t.points.rawVal], s = [a.pl[0]];
    let r = 0;
    for (let i = 0; i + 1 < a.pl.length; i++) {
      const l = o[a.pl[i]], d = o[a.pl[i + 1]];
      r += Math.hypot(d[0] - l[0], d[1] - l[1], d[2] - l[2]);
      for (let c = 1; c < n; c++) {
        const x = c / n;
        o.push([l[0] + (d[0] - l[0]) * x, l[1] + (d[1] - l[1]) * x, l[2] + (d[2] - l[2]) * x]), s.push(o.length - 1);
      }
      s.push(a.pl[i + 1]);
    }
    const f = [...t.polylines.rawVal];
    f[a.i] = s, t.points.val = o, t.polylines.val = f;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), { ok: true, tramosAntes: a.pl.length - 1, tramosAhora: s.length - 1, nudosNuevos: s.length - a.pl.length, largo: +r.toFixed(4), tramoMedio: +(r / (s.length - 1)).toFixed(4) };
  }, window.__hekatanDesfasarCurva = (e) => {
    var _a3, _b, _c, _d;
    if (!isFinite(e) || Math.abs(e) < 1e-9) return { ok: false, msg: "la distancia no puede ser cero" };
    const n = Ka();
    if (!n) return { ok: false, msg: "no hay ninguna polil\xEDnea que desfasar" };
    const a = t.points.rawVal, o = n.pl.map((h) => new E(...a[h])), s = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), r = new E(...s === "xz" ? [0, 1, 0] : s === "yz" ? [1, 0, 0] : [0, 0, 1]), f = (h, M) => {
      const _ = new E().subVectors(M, h), u = new E().crossVectors(r, _);
      return u.lengthSq() < 1e-18 ? null : u.normalize();
    }, i = o.map((h, M) => {
      const _ = M > 0 ? f(o[M - 1], o[M]) : null, u = M + 1 < o.length ? f(o[M], o[M + 1]) : null;
      if (_ && u) {
        const p = _.clone().add(u);
        if (p.lengthSq() < 1e-12) return _;
        p.normalize();
        const y = p.dot(_);
        return p.multiplyScalar(Math.abs(y) < 1e-6 ? 1 : 1 / y);
      }
      return _ ?? u;
    });
    if (i.some((h) => h === null)) return { ok: false, msg: "la curva es perpendicular al plano de trabajo; cambie de plano" };
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const l = [...a], d = [];
    o.forEach((h, M) => {
      const _ = h.clone().addScaledVector(i[M], e);
      l.push([_.x, _.y, _.z]), d.push(l.length - 1);
    });
    const c = [...t.polylines.rawVal];
    c.length && c[c.length - 1].length === 0 && c.pop(), c.push(d, []), t.points.val = l, t.polylines.val = c;
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    z();
    let x = 1 / 0, m = -1 / 0;
    for (let h = 0; h + 1 < o.length; h++) {
      const M = o[h], _ = o[h + 1], u = f(M, _), p = new E(...l[d[h]]), y = Math.abs(new E().subVectors(p, M).dot(u));
      x = Math.min(x, y), m = Math.max(m, y);
    }
    return { ok: true, vertices: d.length, distancia: +e.toFixed(4), separacionMin: +x.toFixed(5), separacionMax: +m.toFixed(5) };
  }, window.__hekatanDrawCercha = (e) => {
    var _a3, _b;
    const n = e.luz, a = e.flecha, o = e.canto, s = Math.max(2, Math.round(e.panos)), r = e.tipo ?? "montantes", f = e.x0 ?? 0, i = e.y0 ?? 0, l = e.base ?? 0, d = Math.max(1, Math.round(e.copias ?? 1)), c = e.sep ?? 0;
    if (!(n > 0) || !(a > 0) || !(o > 0)) return { ok: false, msg: "luz, flecha y canto tienen que ser positivos" };
    const x = (n * n / 4 + a * a) / (2 * a);
    if (o >= x) return { ok: false, msg: `el canto (${o} m) no puede llegar al radio (${x.toFixed(3)} m)` };
    const m = 2 * Math.asin(Math.min(1, n / 2 / x)), h = l - (x - a), M = Math.atan2(l - h, f - (f + n / 2)), _ = Math.atan2(l - h, f + n - (f + n / 2)), u = f + n / 2, p = (pe, $e, ke) => [u + $e * Math.cos(pe), ke, h + $e * Math.sin(pe)];
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const y = [...t.points.rawVal], b = [...((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []];
    b.length && b[b.length - 1].length === 0 && b.pop();
    const S = (pe) => (y.push(pe), y.length - 1), C = (pe, $e) => {
      b.push([pe, $e]);
    }, P = [];
    let I = 0, Q = 0;
    for (let pe = 0; pe < d; pe++) {
      const $e = i + pe * c, ke = [], Ge = [];
      for (let Te = 0; Te <= s; Te++) {
        const Se = M + (_ - M) * (Te / s);
        ke.push(S(p(Se, x, $e))), Ge.push(S(p(Se, x - o, $e)));
      }
      P.push(ke), b.push([...ke]), b.push([...Ge]), C(ke[0], Ge[0]), C(ke[s], Ge[s]), Q += 2;
      for (let Te = 1; Te < s; Te++) if ((r === "montantes" || r === "howe") && (C(ke[Te], Ge[Te]), Q++), r === "warren") Te % 2 === 1 && (C(Ge[Te - 1], ke[Te]), C(ke[Te], Ge[Te + 1]), I += 2);
      else if (r === "howe") {
        const Se = Te < s / 2 ? 1 : -1;
        C(Ge[Te], ke[Te + Se]), I++;
      }
    }
    if (e.correas && d > 1) for (let pe = 0; pe + 1 < d; pe++) for (let $e = 0; $e <= s; $e++) C(P[pe][$e], P[pe + 1][$e]);
    b.push([]), t.points.val = y, t.polylines && (t.polylines.val = b);
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    z();
    const V = (pe, $e) => p(M + (_ - M) * (pe / s), $e, 0), R = (pe, $e) => Math.hypot(pe[0] - $e[0], pe[1] - $e[1], pe[2] - $e[2]), O = [], se = [], be = [];
    for (let pe = 0; pe < s; pe++) {
      O.push(R(V(pe, x), V(pe + 1, x))), se.push(R(V(pe, x - o), V(pe + 1, x - o)));
      const $e = [V(pe + 1, x)[0] - V(pe, x - o)[0], 0, V(pe + 1, x)[2] - V(pe, x - o)[2]];
      be.push(Math.atan2($e[2], $e[0]) * 180 / Math.PI);
    }
    const Fe = (pe) => +pe.toFixed(3);
    return { ok: true, luz: Fe(n), flecha: Fe(a), canto: Fe(o), radio: Fe(x), anguloAbarcado: Fe(m * 180 / Math.PI), clave: Fe(l + a), centro: [Fe(u), Fe(i), Fe(h)], panos: s, tipo: r, cerchas: d, separacion: Fe(c), desarrolloSup: Fe(x * m), desarrolloInf: Fe((x - o) * m), tramoSupMin: Fe(Math.min(...O)), tramoSupMax: Fe(Math.max(...O)), tramoInfMin: Fe(Math.min(...se)), tramoInfMax: Fe(Math.max(...se)), anguloDiagMin: Fe(Math.min(...be)), anguloDiagMax: Fe(Math.max(...be)), montantes: Q, diagonales: I, nudosNuevos: 2 * (s + 1) * d };
  }, window.__hekatanDrawPolinomio = (e, n = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const a = e.length;
    if (a < 2) return { ok: false, msg: "faltan puntos" };
    const o = Math.max(a - 1, Math.round(n)), s = (C) => Math.max(...e.map((P) => P[C])) - Math.min(...e.map((P) => P[C])), r = [s(0), s(1), s(2)], f = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), i = f === "xy" ? 2 : f === "xz" ? 1 : f === "yz" ? 0 : -1, l = i >= 0 && r[i] < 1e-6 ? i : r[2] <= r[0] && r[2] <= r[1] ? 2 : r[1] <= r[0] ? 1 : 0, d = l === 2 ? "xy" : l === 1 ? "xz" : "yz", c = [0, 1, 2].filter((C) => C !== l), [x, m] = r[c[0]] >= r[c[1]] ? c : [c[1], c[0]], h = e.map((C) => C[x]), M = e.map((C) => C[m]);
    for (let C = 0; C < a; C++) for (let P = C + 1; P < a; P++) if (Math.abs(h[C] - h[P]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[x]} en ${d.toUpperCase()}): no hay polinomio que pase por los dos` };
    const _ = (C) => {
      let P = 0;
      for (let I = 0; I < a; I++) {
        let Q = 1;
        for (let V = 0; V < a; V++) V !== I && (Q *= (C - h[V]) / (h[I] - h[V]));
        P += M[I] * Q;
      }
      return P;
    }, u = (() => {
      const C = a, P = h.map((V) => Array.from({ length: C }, (R, O) => V ** O)), I = M.slice();
      for (let V = 0; V < C; V++) {
        let R = V;
        for (let O = V + 1; O < C; O++) Math.abs(P[O][V]) > Math.abs(P[R][V]) && (R = O);
        [P[V], P[R]] = [P[R], P[V]], [I[V], I[R]] = [I[R], I[V]];
        for (let O = V + 1; O < C; O++) {
          const se = P[O][V] / P[V][V];
          for (let be = V; be < C; be++) P[O][be] -= se * P[V][be];
          I[O] -= se * I[V];
        }
      }
      const Q = new Array(C).fill(0);
      for (let V = C - 1; V >= 0; V--) {
        let R = I[V];
        for (let O = V + 1; O < C; O++) R -= P[V][O] * Q[O];
        Q[V] = R / P[V][V];
      }
      return Q;
    })(), p = h[0], y = h[a - 1], b = t.points.rawVal.length, S = [];
    for (let C = 0; C <= o; C++) {
      const P = p + (y - p) * C / o, I = [e[0][0], e[0][1], e[0][2]];
      I[x] = P, I[m] = _(P), I[l] = e[0][l], S.push(I);
    }
    if (S[0] = [e[0][0], e[0][1], e[0][2]], S[o] = [e[a - 1][0], e[a - 1][1], e[a - 1][2]], Lo()) return Io(S, false), { ok: true, plano: d, coef: u, ia: x, io: m };
    if (t.points.val = [...t.points.rawVal, ...S], t.polylines) {
      const C = S.map((I, Q) => b + Q), P = t.polylines.rawVal;
      t.polylines.val = ((_d = P[P.length - 1]) == null ? void 0 : _d.length) > 0 ? [...P, C, []] : [...P.slice(0, -1), C, []];
    }
    return { ok: true, plano: d, coef: u, ia: x, io: m };
  };
  const Wa = () => {
    var _a3, _b;
    const e = t.points.rawVal, n = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), o = window.__hekatanDrawingAuxLines, s = (o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? [], r = [], f = [], i = /* @__PURE__ */ new Set(), l = (d) => [e[d][0], e[d][1], e[d][2]];
    return [...Je].forEach((d) => {
      const c = d.split(":");
      if (c[0] === "aux") {
        const m = s[+c[1]];
        m && m.length === 6 && (r.push([[m[0], m[1], m[2]], [m[3], m[4], m[5]]]), f.push(d));
        return;
      }
      const x = c[0] === "poly" || c[0] === "seg" ? +c[1] : -1;
      if (!(x < 0 || !n[x] || a.has(x))) if (c[0] === "poly") {
        if (i.has(x)) return;
        i.add(x);
        for (let m = 0; m + 1 < n[x].length; m++) r.push([l(n[x][m]), l(n[x][m + 1])]);
      } else {
        const m = n[x][+c[2]], h = n[x][+c[2] + 1];
        m != null && h != null && !i.has(x) && r.push([l(m), l(h)]);
      }
    }), { segs: r, auxIds: f };
  }, fo = (e, n) => Math.abs(e[0] - n[0]) < 1e-6 && Math.abs(e[1] - n[1]) < 1e-6 && Math.abs(e[2] - n[2]) < 1e-6, Ks = (e) => {
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
          const [l, d] = e[i], c = s[s.length - 1], x = s[0];
          fo(l, c) ? (s.push(d), n[i] = true, r = true) : fo(d, c) ? (s.push(l), n[i] = true, r = true) : fo(d, x) ? (s.unshift(l), n[i] = true, r = true) : fo(l, x) && (s.unshift(d), n[i] = true, r = true);
        }
      }
      const f = s.length > 3 && fo(s[0], s[s.length - 1]);
      f && s.pop(), a.push({ pts: s, cerrada: f });
    }
    return a;
  }, ia = (e, n) => {
    let a = e.findIndex((o) => Math.abs(o[0] - n[0]) < 1e-3 && Math.abs(o[1] - n[1]) < 1e-3 && Math.abs(o[2] - n[2]) < 1e-3);
    return a < 0 && (a = e.length, e.push(n)), a;
  }, Ha = (e) => {
    if (!e.length) return 0;
    Je.clear(), e.forEach((a) => Je.add(a));
    const n = e.length;
    return ha(), Je.clear(), n;
  };
  window.__hekatanRevolveSelection = (e, n, a, o = 360) => {
    var _a3, _b, _c;
    const s = Math.max(3, Math.round(a || 16)), r = Math.abs(o - 360) < 1e-9, f = s, i = r ? s : s + 1, { segs: l, auxIds: d } = Wa();
    if (!l.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (r && s % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    zt();
    const c = t.points.rawVal, x = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = [...c];
    let h = x.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], _ = /* @__PURE__ */ new Map(), u = (I) => I.map((Q) => Math.round(Q * 1e4)).join(","), p = (I) => Math.hypot(I[0] - e, I[1] - n) < 1e-6, y = (I) => {
      const Q = u(I);
      let V = _.get(Q);
      if (V) return V;
      if (p(I)) return V = [ia(m, I)], _.set(Q, V), V;
      const R = Math.hypot(I[0] - e, I[1] - n), O = Math.atan2(I[1] - n, I[0] - e);
      V = [];
      for (let se = 0; se < i; se++) {
        const be = O + o * Math.PI / 180 * se / s;
        V.push(ia(m, se === 0 ? I : [e + R * Math.cos(be), n + R * Math.sin(be), I[2]]));
      }
      return _.set(Q, V), V;
    };
    let b = 0, S = false;
    const C = (I) => {
      M.push(h.length), h.push([...I, I[0]]), b++;
    };
    for (const [I, Q] of l) {
      const V = y(I), R = y(Q);
      if (!(V.length === 1 && R.length === 1)) {
        if (V.length === 1 || R.length === 1) {
          S = true;
          const O = V.length === 1 ? V[0] : R[0], se = V.length === 1 ? R : V;
          for (let be = 0; be + 2 <= f; be += 2) C([O, se[be % i], se[(be + 1) % i], se[(be + 2) % i]]);
          continue;
        }
        for (let O = 0; O < f; O++) C([V[O], R[O], R[(O + 1) % i], V[(O + 1) % i]]);
      }
    }
    h.push([]), t.points.val = m, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    const P = Ha(d);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), { anillos: _.size, areas: b, polo: S, guias: P };
  }, window.__hekatanLoftSelection = (e, n) => {
    var _a3, _b, _c;
    const { segs: a, auxIds: o } = Wa(), s = Ks(a), r = (R) => R.pts.every((O) => Math.abs(O[2] - R.pts[0][2]) < 1e-6), f = s.find((R) => R.cerrada && r(R)), i = s.find((R) => !R.cerrada && R.pts.length >= 2 && !r(R));
    if (!f) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!i) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const l = f.pts, d = l.length, c = i.pts.slice();
    c[c.length - 1][2] < c[0][2] && c.reverse();
    let x = 0;
    for (let R = 0; R < d; R++) {
      const O = l[R], se = l[(R + 1) % d];
      x += O[0] * se[1] - se[0] * O[1];
    }
    const m = x > 0 ? 1 : -1, h = (R) => {
      const O = l[(R - 1 + d) % d], se = l[R], be = l[(R + 1) % d], Fe = [se[0] - O[0], se[1] - O[1]], pe = [be[0] - se[0], be[1] - se[1]], $e = Math.hypot(Fe[0], Fe[1]) || 1, ke = Math.hypot(pe[0], pe[1]) || 1, Ge = [m * Fe[1] / $e, -m * Fe[0] / $e], Te = [m * pe[1] / ke, -m * pe[0] / ke], Se = 1 + (Ge[0] * Te[0] + Ge[1] * Te[1]);
      return [(Ge[0] + Te[0]) / Math.max(Se, 1e-6), (Ge[1] + Te[1]) / Math.max(Se, 1e-6)];
    }, M = l.map((R, O) => h(O)), _ = c[0];
    let u = [0, 0], p = 0;
    for (const R of c) {
      const O = R[0] - _[0], se = R[1] - _[1], be = Math.hypot(O, se);
      be > p && (p = be, u = [O / be, se / be]);
    }
    if (p < 1e-9) {
      const R = _[0] - e, O = _[1] - n, se = Math.hypot(R, O) || 1;
      u = [R / se, O / se];
    }
    u[0] * (_[0] - e) + u[1] * (_[1] - n) < 0 && (u = [-u[0], -u[1]]), zt();
    const y = t.points.rawVal, b = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], S = [...y];
    let C = b.slice();
    C.length && C[C.length - 1].length === 0 && (C = C.slice(0, -1));
    const P = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], I = c.map((R) => {
      const O = (R[0] - _[0]) * u[0] + (R[1] - _[1]) * u[1], se = R[2];
      return l.map((be, Fe) => ia(S, [be[0] + M[Fe][0] * O, be[1] + M[Fe][1] * O, se]));
    });
    let Q = 0;
    for (let R = 0; R + 1 < I.length; R++) for (let O = 0; O < d; O++) {
      const se = [I[R][O], I[R][(O + 1) % d], I[R + 1][(O + 1) % d], I[R + 1][O]];
      new Set(se).size < 4 || (P.push(C.length), C.push([...se, se[0]]), Q++);
    }
    C.push([]), t.points.val = S, t.polylines && (t.polylines.val = C), t.areas && (t.areas.val = P);
    const V = Ha(o);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), { contorno: d, perfil: c.length, areas: Q, guias: V };
  }, window.__hekatanDrawSlabChaflan = (e, n, a = 1, o = 6, s = 6) => {
    const r = Math.min(e[0], n[0]), f = Math.max(e[0], n[0]), i = Math.min(e[1], n[1]), l = Math.max(e[1], n[1]), d = (e[2] + n[2]) / 2, c = f - r, x = l - i, m = Math.min(a, c / 2 - 0.01, x / 2 - 0.01);
    if (m <= 0) return;
    const h = t.points.rawVal.length, M = [], _ = [], u = (p, y) => {
      M.push([p, y, d]), _.push(h + M.length - 1);
    };
    for (let p = 0; p <= s; p++) u(r + m + (c - 2 * m) * p / s, i);
    for (let p = 1; p <= o; p++) {
      const y = -Math.PI / 2 + Math.PI / 2 * p / o;
      u(f - m + m * Math.cos(y), i + m + m * Math.sin(y));
    }
    for (let p = 1; p <= s; p++) u(f, i + m + (x - 2 * m) * p / s);
    for (let p = 1; p <= o; p++) {
      const y = 0 + Math.PI / 2 * p / o;
      u(f - m + m * Math.cos(y), l - m + m * Math.sin(y));
    }
    for (let p = 1; p <= s; p++) u(f - m - (c - 2 * m) * p / s, l);
    for (let p = 1; p <= o; p++) {
      const y = Math.PI / 2 + Math.PI / 2 * p / o;
      u(r + m + m * Math.cos(y), l - m + m * Math.sin(y));
    }
    for (let p = 1; p <= s; p++) u(r, l - m - (x - 2 * m) * p / s);
    for (let p = 1; p < o; p++) {
      const y = Math.PI + Math.PI / 2 * p / o;
      u(r + m + m * Math.cos(y), i + m + m * Math.sin(y));
    }
    if (_.push(h), Lo()) {
      Io(M, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...M], t.polylines) {
      const p = t.polylines.rawVal;
      t.polylines.val = [...p.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRect = (e, n) => {
    const a = t.points.rawVal.length, o = e[0], s = e[1], r = e[2], f = n[0], i = n[1], l = n[2];
    let d;
    if (Math.abs(r - l) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, i, r], [o, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, s, l], [o, s, l]] : d = [[o, s, r], [o, i, r], [o, i, l], [o, s, l]], t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = [a, a + 1, a + 2, a + 3, a], x = t.polylines.rawVal;
      t.polylines.val = [...x.slice(0, -1), c, []];
    }
  }, window.__hekatanDrawRectArea = (e, n) => {
    var _a3;
    const a = t.points.rawVal.length, o = e[0], s = e[1], r = e[2], f = n[0], i = n[1], l = n[2];
    let d;
    if (q && t.gridTarget) {
      const c = t.gridTarget.rawVal, x = new $n(...c.rotation), m = new E(1, 0, 0).applyEuler(x), h = new E(0, 1, 0).applyEuler(x), M = new E(...c.position), _ = new E(o, s, r), u = new E(f, i, l), p = _.clone().sub(M).dot(m), y = _.clone().sub(M).dot(h), b = u.clone().sub(M).dot(m), S = u.clone().sub(M).dot(h), C = (P, I) => M.clone().addScaledVector(m, P).addScaledVector(h, I).toArray();
      d = [C(p, y), C(b, y), C(b, S), C(p, S)];
    } else Math.abs(r - l) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, i, r], [o, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[o, s, r], [f, s, r], [f, s, l], [o, s, l]] : d = [[o, s, r], [o, i, r], [o, i, l], [o, s, l]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = t.polylines.rawVal, x = c.length - 1, m = [a, a + 1, a + 2, a + 3, a];
      t.polylines.val = [...c.slice(0, -1), m, []], t.areas && (t.areas.val = [...t.areas.rawVal, x]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    z();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = t.points.rawVal, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = (u) => u.map((p) => Math.round(p * 1e4) / 1e4).join(",");
    for (let u = 0; u < n.length; u++) {
      const p = s(n[u]), y = a.get(p);
      y === void 0 && a.set(p, u), o.set(u, y ?? u);
    }
    const r = e.map((u) => u.map((p) => o.get(p) ?? p)), f = /* @__PURE__ */ new Map(), i = (u, p) => {
      u !== p && ((f.get(u) ?? f.set(u, /* @__PURE__ */ new Set()).get(u)).add(p), (f.get(p) ?? f.set(p, /* @__PURE__ */ new Set()).get(p)).add(u));
    };
    for (const u of r) for (let p = 0; p + 1 < u.length; p++) i(u[p], u[p + 1]);
    const l = (u, p) => {
      var _a4;
      return !!((_a4 = f.get(u)) == null ? void 0 : _a4.has(p));
    }, d = /* @__PURE__ */ new Set(), c = [], x = [...f.keys()];
    for (const u of x) for (const p of f.get(u)) if (!(p < u)) {
      for (const y of f.get(p)) if (y !== u) for (const b of f.get(y)) {
        if (b === u || b === p || !l(b, u) || l(u, y) || l(p, b)) continue;
        const S = [u, p, y, b].slice().sort((C, P) => C - P).join("-");
        d.has(S) || (d.add(S), c.push([u, p, y, b]));
      }
    }
    for (const u of x) for (const p of f.get(u)) if (!(p < u)) for (const y of f.get(p)) {
      if (y === u || !l(y, u)) continue;
      const b = [u, p, y].slice().sort((S, C) => S - C).join("-");
      d.has(b) || (d.add(b), c.push([u, p, y]));
    }
    if (!c.length) return 0;
    const m = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], h = new Set(m.map((u) => [...new Set(r[u] ?? [])].sort((p, y) => p - y).join("-"))), M = [...r];
    let _ = 0;
    for (const u of c) {
      const p = u.slice().sort((y, b) => y - b).join("-");
      h.has(p) || (h.add(p), M.push([...u, u[0]]), m.push(M.length - 1), _++);
    }
    if (_) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = M, t.areas && (t.areas.val = m);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      z();
    }
    return _;
  }, window.__hekatanMeshPolyArea = (e, n) => {
    var _a3;
    const a = e.length;
    if (a < 3) return 0;
    let o = 0, s = 0, r = 0;
    for (let Se = 0; Se < a; Se++) {
      const Ze = e[Se], He = e[(Se + 1) % a];
      o += (Ze[1] - He[1]) * (Ze[2] + He[2]), s += (Ze[2] - He[2]) * (Ze[0] + He[0]), r += (Ze[0] - He[0]) * (Ze[1] + He[1]);
    }
    const f = Math.hypot(o, s, r) || 1;
    o /= f, s /= f, r /= f;
    let i = e[1][0] - e[0][0], l = e[1][1] - e[0][1], d = e[1][2] - e[0][2];
    const c = Math.hypot(i, l, d) || 1;
    i /= c, l /= c, d /= c;
    let x = s * d - r * l, m = r * i - o * d, h = o * l - s * i;
    const M = Math.hypot(x, m, h) || 1;
    x /= M, m /= M, h /= M;
    const _ = e[0], u = (Se) => [(Se[0] - _[0]) * i + (Se[1] - _[1]) * l + (Se[2] - _[2]) * d, (Se[0] - _[0]) * x + (Se[1] - _[1]) * m + (Se[2] - _[2]) * h], p = (Se, Ze) => [_[0] + Se * i + Ze * x, _[1] + Se * l + Ze * m, _[2] + Se * d + Ze * h], y = e.map(u);
    let b = 1 / 0, S = -1 / 0, C = 1 / 0, P = -1 / 0;
    for (const [Se, Ze] of y) Se < b && (b = Se), Se > S && (S = Se), Ze < C && (C = Ze), Ze > P && (P = Ze);
    const I = S - b, Q = P - C;
    if (I < 1e-6 || Q < 1e-6) return 0;
    let V = n && n > 0 ? n : 0.5;
    for (; I / V * (Q / V) > 2500; ) V *= 2;
    V = Math.min(V, Math.min(I, Q));
    const R = (Se, Ze) => {
      let He = false;
      for (let pt = 0, ht = y.length - 1; pt < y.length; ht = pt++) {
        const [kt, yt] = y[pt], [Tt, Ft] = y[ht];
        yt > Ze != Ft > Ze && Se < (Tt - kt) * (Ze - yt) / (Ft - yt) + kt && (He = !He);
      }
      return He;
    }, O = Math.max(1, Math.round(I / V)), se = Math.max(1, Math.round(Q / V)), be = I / O, Fe = Q / se, pe = /* @__PURE__ */ new Map(), $e = [], ke = t.points.rawVal.length, Ge = (Se, Ze) => {
      const He = Se + "," + Ze, pt = pe.get(He);
      if (pt !== void 0) return pt;
      const ht = ke + $e.length;
      return $e.push(p(b + Se * be, C + Ze * Fe)), pe.set(He, ht), ht;
    }, Te = [];
    for (let Se = 0; Se < O; Se++) for (let Ze = 0; Ze < se; Ze++) {
      if (!R(b + (Se + 0.5) * be, C + (Ze + 0.5) * Fe)) continue;
      const He = Ge(Se, Ze), pt = Ge(Se + 1, Ze), ht = Ge(Se + 1, Ze + 1), kt = Ge(Se, Ze + 1);
      Te.push([He, pt, ht, kt]);
    }
    if (!Te.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...$e], t.polylines && t.areas) {
      let Se = t.polylines.rawVal.slice();
      Se.length && Se[Se.length - 1].length === 0 && (Se = Se.slice(0, -1));
      const Ze = [];
      for (const He of Te) Ze.push(Se.length), Se.push([He[0], He[1], He[2], He[3], He[0]]);
      Se.push([]), t.polylines.val = Se, t.areas.val = [...t.areas.rawVal, ...Ze];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), Te.length;
  };
  const To = () => {
    if (at.length < 3) return at = [], Be.visible = false, z(), 0;
    const e = window.__hekatanMeshPolyArea(at.slice());
    return at = [], Be.visible = false, z(), e;
  };
  window.__hekatanFinalizePolyArea = To, window.__hekatanSetInclinedPlaneFrom3 = (e, n, a) => {
    var _a3;
    const o = new E(e[0], e[1], e[2]), s = new E(n[0], n[1], n[2]), r = new E(a[0], a[1], a[2]), f = new E().subVectors(s, o).cross(new E().subVectors(r, o));
    if (f.lengthSq() < 1e-9) return false;
    f.normalize();
    const i = new Mo().setFromUnitVectors(new E(0, 0, 1), f), l = new $n().setFromQuaternion(i);
    t.gridTarget && (t.gridTarget.val = { position: [o.x, o.y, o.z], rotation: [l.x, l.y, l.z] }), q = true;
    const d = new E().addVectors(o, s).add(r).multiplyScalar(1 / 3), c = Math.max(o.distanceTo(s), o.distanceTo(r), s.distanceTo(r)) * 2.2 + 4, x = c / 2;
    Zt.geometry.dispose(), Zt.geometry = new Rn(c, c), an.geometry.dispose(), an.geometry = new ys(new Rn(c, c)), zo(x, 1), Pt.position.copy(d), Pt.quaternion.copy(i), Pt.scale.set(1, 1, 1), Pt.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return z(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), q = false, Pt.visible = false, z();
  };
  const rn = new ut();
  rn.visible = false, g.add(rn), window.__hekatanShowAxes = (e, n, a = 12, o = 2) => {
    var _a3, _b;
    for (; rn.children.length; ) {
      const c = rn.children.pop();
      (_a3 = c.geometry) == null ? void 0 : _a3.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !n.length) return;
    const s = Math.min(...n) - o, r = Math.max(...n) + o, f = Math.min(...e) - o, i = Math.max(...e) + o, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", d = (c, x, m, h, M) => {
      const _ = document.createElement("canvas");
      _.width = 64, _.height = 32;
      const u = _.getContext("2d");
      u.fillStyle = M, u.font = "bold 22px sans-serif", u.textAlign = "center", u.fillText(c, 32, 26);
      const p = new xs(_), y = new gs({ map: p, transparent: true }), b = new bs(y);
      return b.position.set(x, m, h), b.scale.set(1.2, 0.6, 1), b;
    };
    e.forEach((c, x) => {
      const m = x < l.length ? l[x] : `X${x}`, h = new Ve().setFromPoints([new E(c, s, 0), new E(c, r, 0), new E(c, s, 0), new E(c, s, a)]), M = new lo({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), _ = new on(h, M);
      _.computeLineDistances(), rn.add(_), rn.add(d(m, c, s - 0.5, 0, "#60a5fa")), rn.add(d(m, c, r + 0.5, 0, "#60a5fa"));
    }), n.forEach((c, x) => {
      const m = `${x + 1}`, h = new Ve().setFromPoints([new E(f, c, 0), new E(i, c, 0), new E(f, c, 0), new E(f, c, a)]), M = new lo({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), _ = new on(h, M);
      _.computeLineDistances(), rn.add(_), rn.add(d(m, f - 0.5, c, 0, "#fb7185")), rn.add(d(m, i + 0.5, c, 0, "#fb7185"));
    }), rn.visible = true, z();
  }, window.__hekatanHideAxes = () => {
    rn.visible = false, z();
  };
  const An = new ut();
  An.visible = false, g.add(An);
  let jn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], n = 20, a = 0, o = 0) => {
    var _a3, _b;
    for (; An.children.length; ) {
      const r = An.children.pop();
      (_a3 = r.geometry) == null ? void 0 : _a3.dispose(), (_b = r.material) == null ? void 0 : _b.dispose();
    }
    jn.forEach((r) => {
      g.remove(r), r.geometry.dispose(), r.material.dispose();
    }), jn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((r, f) => {
      const i = s[f % s.length], l = n / 2, d = [new E(a - l, o - l, r), new E(a + l, o - l, r), new E(a + l, o + l, r), new E(a - l, o + l, r), new E(a - l, o - l, r)], c = new Ve().setFromPoints(d), x = new mt({ color: i, transparent: true, opacity: 0.55 });
      An.add(new Vt(c, x));
      const m = document.createElement("canvas");
      m.width = 128, m.height = 32;
      const h = m.getContext("2d");
      h.fillStyle = `#${i.toString(16).padStart(6, "0")}`, h.font = "bold 18px sans-serif", h.fillText(`Z = ${r} m`, 4, 22);
      const M = new xs(m), _ = new gs({ map: M, transparent: true }), u = new bs(_);
      u.position.set(a - l - 1.5, o - l - 1.5, r), u.scale.set(2.5, 0.6, 1), An.add(u);
      const p = new Rn(1e4, 1e4), y = new xt({ visible: false, side: Rt }), b = new ct(p, y);
      b.position.set(0, 0, r), b.frustumCulled = false, b.userData = { refPlaneZ: r }, g.add(b), jn.push(b);
    }), An.visible = true, z();
  }, window.__hekatanHideRefPlanes = () => {
    An.visible = false, jn.forEach((e) => {
      e.visible = false;
    }), z();
  };
  const ho = new ut();
  ho.frustumCulled = false, g.add(ho);
  const Ws = () => {
    var _a3, _b, _c, _d;
    for (; ho.children.length; ) {
      const a = ho.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of n) {
      if (a.length !== 6) continue;
      const o = new Ve().setFromPoints([new E(a[0], a[1], a[2]), new E(a[3], a[4], a[5])]), s = new lo({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), r = new Vt(o, s);
      r.computeLineDistances(), ho.add(r);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Ws(), z());
  });
  const eo = new ut();
  eo.frustumCulled = false, g.add(eo);
  const Ja = () => {
    var _a3, _b, _c, _d;
    for (; eo.children.length; ) {
      const a = eo.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of n) {
      if (!a || a.length !== 3) continue;
      const o = new ct(new ro(0.025, 12, 12), new xt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      o.position.set(a[0], a[1], a[2]), o.renderOrder = 996, o.scale.setScalar(Eo(o.position)), eo.add(o);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Ja(), z());
  }), k.addEventListener("change", () => {
    eo.children.forEach((e) => {
      e.scale.setScalar(Eo(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Ja;
  const vt = new ut(), Hs = new ct(new ro(0.01, 12, 12), new xt({ color: 16777215, transparent: true, opacity: 0.95 })), Oa = new ct(new ro(0.015, 12, 12), new xt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Oa.visible = false, vt.add(Hs, Oa);
  const to = 0.08, la = (e, n, a) => {
    const o = new Ve().setFromPoints([new E(...e), new E(...n)]);
    return new Vt(o, new mt({ color: a, transparent: true, opacity: 0.7 }));
  };
  vt.add(la([-to, 0, 0], [to, 0, 0], 16777215)), vt.add(la([0, -to, 0], [0, to, 0], 16777215)), vt.add(la([0, 0, -to], [0, 0, to], 16777215)), vt.visible = false, vt.frustumCulled = false, g.add(vt);
  let ra = 2;
  const Ro = (e) => {
    const n = v(), a = ($ == null ? void 0 : $.clientHeight) || 700;
    return n.isOrthographicCamera ? (n.top - n.bottom) / (n.zoom || 1) / a : 2 * n.position.distanceTo(e) * Math.tan((n.fov || 50) * Math.PI / 180 / 2) / a;
  }, mo = () => {
    if (!vt.visible) return;
    const e = ra * Ro(vt.position) / 0.015;
    vt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let In = 10;
  const ca = (e) => Math.max(1e-4, In * Ro(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (In = e), In), window.__hekatanUpdateSnapScale = mo, window.__hekatanSnapMarker = vt, window.__hekatanMetrosPorPixel = Ro, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (ra = e, mo(), z()), ra);
  const Qa = () => {
    Mn.children.length !== 0 && Mn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const n = e;
      n.scale.setScalar(Eo(n.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Qa, k.addEventListener("change", () => {
    var _a3;
    mo(), sn.visible && Ya(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), Qa();
  }), window.__hekatanShowSnap = (e, n, a) => {
    vt.position.set(e, n, a), vt.visible = true, mo(), z();
  }, window.__hekatanHideSnap = () => {
    vt.visible = false, z();
  }, $.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n), ie = null;
    const a = Ye();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && dt.visible && (dt.visible = false), a.length) {
      const o = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const h = Ht([o.x, o.y, o.z]);
        if (h) {
          const M = h.map((p) => t.points.rawVal[p]), _ = [];
          for (let p = 1; p < M.length - 1; p++) _.push(M[0][0], M[0][1], M[0][2], M[p][0], M[p][1], M[p][2], M[p + 1][0], M[p + 1][1], M[p + 1][2]);
          const u = dt.geometry;
          u.setAttribute("position", new Dt(_, 3)), u.computeVertexNormals(), dt.visible = true;
        } else dt.visible = false;
      } else dt.visible && (dt.visible = false);
      const s = e.altKey;
      let r = false;
      const f = ca(o), i = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, o.x, o.y, o.z, f, { x: e.clientX, y: e.clientY });
      if (i) Xo(i.type, i.x, i.y, i.z), vt.position.set(i.x, i.y, i.z), vt.visible = true, o.set(i.x, i.y, i.z), Zo(i.type, e.clientX, e.clientY);
      else if (!s && (Ce = _e(e.clientX, e.clientY))) r = true, o.copy(Ce), Xo("ifcSec", o.x, o.y, o.z), Zo("ifcSec", e.clientX, e.clientY), vt.position.copy(o), vt.visible = true;
      else if (ae && !s) r = true, Xo(ae.tipo, o.x, o.y, o.z), Zo(ae.tipo, e.clientX, e.clientY), vt.position.copy(o), vt.visible = true;
      else {
        ni(), Uo();
        const m = !s && window.__hekatanSnapEnabled !== false, h = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        m && h > 0 && (o.x = Math.round(o.x / h) * h, o.y = Math.round(o.y / h) * h, o.z = Math.round(o.z / h) * h), vt.position.copy(o), vt.visible = true;
      }
      mo(), Z(ie && !i && (r || ae) ? K(ie) : null), Nt = { p: o.clone(), x: e.clientX, y: e.clientY };
      const l = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (l === "select" || !l) {
        const m = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = Zs(o.x, o.y, o.z, m), M = sa(o.x, o.y, o.z, m), _ = Xa(o.x, o.y, o.z, m);
        if (h >= 0) {
          const b = t.points.rawVal[h];
          sn.position.set(b[0], b[1], b[2]), sn.visible = true, Ya(), bn.visible = false, vn = { kind: "pt", a: h };
        } else if (M) {
          const b = t.points.rawVal, S = t.polylines.rawVal[M.polyIdx], C = b[S[M.segIdx]], P = b[S[M.segIdx + 1]];
          bn.geometry.setFromPoints([new E(C[0], C[1], C[2]), new E(P[0], P[1], P[2])]), bn.visible = true, sn.visible = false, vn = ((_m = (_l2 = t.areas) == null ? void 0 : _l2.rawVal) == null ? void 0 : _m.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (_ >= 0) {
          const S = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[_];
          S && (bn.geometry.setFromPoints([new E(S[0], S[1], S[2]), new E(S[3], S[4], S[5])]), bn.visible = true, sn.visible = false, vn = { kind: "aux", a: _ });
        } else bn.visible = false, sn.visible = false, vn = null;
        Ee.style.left = e.clientX + "px", Ee.style.top = e.clientY + "px", Ee.style.display = "block";
        let u = o;
        if ((vn == null ? void 0 : vn.kind) === "pt") {
          const b = t.points.rawVal[vn.a];
          b && (u = new E(b[0], b[1], b[2]));
        }
        const p = `X=${u.x.toFixed(2)} Y=${u.y.toFixed(2)} Z=${u.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [u.x, u.y, u.z], vn) {
          const b = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Ee.textContent = `${p}  \xB7  \u{1F5B1} Click \u2192 ${b[vn.kind]}`;
        } else Ee.textContent = p;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = p), Nt = { p: u.clone(), x: e.clientX, y: e.clientY }, We.visible = false, qt.visible = false, Gt.visible = false, z();
        return;
      }
      if (l === "delete" || l === "trim" || l === "extend" || l === "offset") {
        const m = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = sa(o.x, o.y, o.z, m), M = Xa(o.x, o.y, o.z, m);
        let _ = false;
        if (M >= 0) if (!h) _ = true;
        else {
          const b = window.__hekatanDrawingAuxLines, C = ((b == null ? void 0 : b.rawVal) ?? (b == null ? void 0 : b.val) ?? b ?? [])[M];
          po(o.x, o.y, o.z, C[0], C[1], C[2], C[3], C[4], C[5]) < h.dist && (_ = true);
        }
        _ ? (Ln = M, pn = -1, Vn = -1, qs(M)) : h ? (pn = h.polyIdx, Vn = h.segIdx, Ln = -1, Gs(h.polyIdx, h.segIdx)) : (pn = -1, Vn = -1, Ln = -1, Kt.visible = false), We.visible = false, qt.visible = false, Gt.visible = false, mn(), Ee.style.left = e.clientX + "px", Ee.style.top = e.clientY + "px", Ee.style.display = "block";
        const u = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        let p = "";
        _ ? p = `\u{1F5D1} l\xEDnea aux #${Ln + 1}` : h ? p = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(h.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${h.polyIdx + 1}` : `\u{1F5D1} seg ${h.segIdx + 1} / poly #${h.polyIdx + 1}` : p = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Ee.textContent = `${u}  \xB7  ${p}`;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = u), z();
        return;
      } else Kt.visible = false, pn = -1, Ln = -1;
      Ee.style.left = e.clientX + "px", Ee.style.top = e.clientY + "px", Ee.style.display = "block";
      const d = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], c = d[d.length - 1] ?? [], x = t.points.rawVal ?? [];
      if (c.length > 0 && x[c[c.length - 1]]) {
        const m = c[c.length - 1], h = x[m];
        let M = At;
        Qn = null;
        const _ = !!i || r;
        if (!M && !_ && window.__hekatanAxisSnap !== false) {
          const pe = $.getBoundingClientRect(), $e = e.clientX, ke = e.clientY, Ge = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Te = new E(h[0], h[1], h[2]), Se = [["x", new E(1, 0, 0)], ["y", new E(0, 1, 0)], ["z", new E(0, 0, 1)]], Ze = (pt) => {
            const ht = pt.clone().project(n);
            return { x: (ht.x * 0.5 + 0.5) * pe.width + pe.left, y: (-ht.y * 0.5 + 0.5) * pe.height + pe.top };
          };
          let He = null;
          for (const [pt, ht] of Se) {
            const kt = Ze(Te.clone().addScaledVector(ht, -Ge)), yt = Ze(Te.clone().addScaledVector(ht, Ge)), Tt = yt.x - kt.x, Ft = yt.y - kt.y, kn = $e - kt.x, nn = ke - kt.y, Fn = Tt * Tt + Ft * Ft || 1;
            let Sn = (kn * Tt + nn * Ft) / Fn;
            Sn = Math.max(0, Math.min(1, Sn));
            const Wn = Math.hypot($e - (kt.x + Sn * Tt), ke - (kt.y + Sn * Ft));
            if (He === null || Wn < He.dpx) {
              const hn = L.ray, ps = Te.clone().sub(hn.origin), Sa = ht.dot(hn.direction), fs = ht.dot(ps), wi = hn.direction.dot(ps), hs = 1 - Sa * Sa, yi = Math.abs(hs) < 1e-6 ? -fs : (Sa * wi - fs) / hs;
              He = { axis: pt, dpx: Wn, pt: Te.clone().addScaledVector(ht, yi) };
            }
          }
          He && He.dpx <= 12 && (o.copy(He.pt), M = He.axis, Qn = He.pt.clone());
        }
        const u = !!window.__hekatanOrthoMode;
        if (!M && !_ && u) {
          const pe = $.getBoundingClientRect(), $e = new E(h[0], h[1], h[2]), ke = (yt) => {
            const Tt = yt.clone().project(n);
            return { x: (Tt.x * 0.5 + 0.5) * pe.width + pe.left, y: (-Tt.y * 0.5 + 0.5) * pe.height + pe.top };
          }, Ge = ke($e), Te = e.clientX - Ge.x, Se = e.clientY - Ge.y, Ze = Math.hypot(Te, Se), He = [["x", new E(1, 0, 0)], ["y", new E(0, 1, 0)], ["z", new E(0, 0, 1)]], pt = Math.max(1, ((_s2 = settings.gridSize) == null ? void 0 : _s2.rawVal) ?? 10) * 0.5, ht = Number(window.__hekatanPolarInc) || 0, kt = He.map(([yt, Tt]) => ({ rotulo: yt.toUpperCase(), u: Tt }));
          if (ht > 0 && ht < 90) {
            const yt = [["XY", new E(1, 0, 0), new E(0, 1, 0)], ["XZ", new E(1, 0, 0), new E(0, 0, 1)], ["YZ", new E(0, 1, 0), new E(0, 0, 1)]];
            for (const [Tt, Ft, kn] of yt) for (let nn = ht; nn < 360; nn += ht) {
              if (nn % 90 === 0) continue;
              const Fn = nn * Math.PI / 180;
              kt.push({ rotulo: `${nn}\xB0 ${Tt}`, u: Ft.clone().multiplyScalar(Math.cos(Fn)).addScaledVector(kn, Math.sin(Fn)).normalize() });
            }
          }
          if (Ze > 4) {
            let yt = null;
            for (const Tt of kt) {
              const Ft = Tt.u, kn = ke($e.clone().addScaledVector(Ft, pt)), nn = kn.x - Ge.x, Fn = kn.y - Ge.y, Sn = Math.hypot(nn, Fn);
              if (Sn < 6) continue;
              const Wn = Math.abs((Te * nn + Se * Fn) / (Ze * Sn)), hn = Math.abs(Ft.x) >= Math.abs(Ft.y) && Math.abs(Ft.x) >= Math.abs(Ft.z) ? "x" : Math.abs(Ft.y) >= Math.abs(Ft.z) ? "y" : "z";
              (!yt || Wn > yt.cos) && (yt = { axis: hn, rotulo: Tt.rotulo, cos: Wn, u: Ft });
            }
            if (yt) {
              M = yt.axis, yt.rotulo;
              const Tt = L.ray, Ft = $e.clone().sub(Tt.origin), kn = yt.u.dot(Tt.direction), nn = yt.u.dot(Ft), Fn = Tt.direction.dot(Ft), Sn = 1 - kn * kn, Wn = Math.abs(Sn) < 1e-6 ? -nn : (kn * Fn - nn) / Sn, hn = $e.clone().addScaledVector(yt.u, Wn);
              isFinite(hn.x) && isFinite(hn.y) && isFinite(hn.z) && (o.copy(hn), Qn = hn.clone());
            }
          }
        }
        const p = window.__hekatanPolarTrack !== false;
        if (!M && !_ && p) {
          const pe = o.x - h[0], $e = o.y - h[1], ke = o.z - h[2], Ge = Math.hypot(pe, $e, ke);
          if (Ge > 1e-3) {
            const Se = Math.tan(6 * Math.PI / 180) * Ge, Ze = Math.hypot($e, ke), He = Math.hypot(pe, ke), pt = Math.hypot(pe, $e), ht = [["x", Ze], ["y", He], ["z", pt]];
            ht.sort((kt, yt) => kt[1] - yt[1]), ht[0][1] <= Se && (M = ht[0][0]);
          }
        }
        if (M) {
          const pe = h[0], $e = h[1], ke = h[2];
          M === "x" ? o.set(o.x, $e, ke) : M === "y" ? o.set(pe, o.y, ke) : o.set(pe, $e, o.z);
          const Ge = !!At, Se = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          Yt.style.background = "rgba(15,23,42,0.92)", Yt.style.color = Se, Yt.style.border = `1.5px solid ${Se}`;
          const Ze = (_t2 = a[0]) == null ? void 0 : _t2.object;
          let He = null;
          Ze === Jt ? He = "xy" : Ze === jt ? He = "xz" : Ze === xn && (He = "yz");
          const pt = He ? ` (plano ${He.toUpperCase()})` : "";
          Yt.textContent = Ge ? `\u{1F512} LOCK ${M.toUpperCase()}${pt}` : `\u22A5 ORTO ${M.toUpperCase()}${pt}`, Yt.style.left = e.clientX + 20 + "px", Yt.style.top = e.clientY + 18 + "px", Yt.style.transform = "none", Yt.style.display = "block";
        } else At || (Yt.style.display = "none");
        let y = null;
        if (!s && !_ && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const pe = t.points.rawVal, $e = M ? [M] : ["z", "x", "y"], ke = { x: e.clientX, y: e.clientY };
          let Ge = 1 / 0;
          for (const Te of pe) if (!(Math.abs(Te[0] - h[0]) < 1e-9 && Math.abs(Te[1] - h[1]) < 1e-9 && Math.abs(Te[2] - h[2]) < 1e-9)) for (const Se of $e) {
            const Ze = new E(Se === "x" ? Te[0] : o.x, Se === "y" ? Te[1] : o.y, Se === "z" ? Te[2] : o.z), He = Gn(Ze.x, Ze.y, Ze.z);
            if (!He) continue;
            const pt = Math.hypot(He.x - ke.x, He.y - ke.y);
            pt < In && pt < Ge && (Ge = pt, y = { q: Te, eje: Se });
          }
        }
        y ? (y.eje === "x" ? o.x = y.q[0] : y.eje === "y" ? o.y = y.q[1] : o.z = y.q[2], Gt.geometry.setFromPoints([new E(y.q[0], y.q[1], y.q[2]), new E(o.x, o.y, o.z)]), (_u = Gt.computeLineDistances) == null ? void 0 : _u.call(Gt), Gt.visible = true, vt.position.set(o.x, o.y, o.z), vt.visible = true, Zo("track", e.clientX, e.clientY)) : Gt.visible = false, Nt = { p: o.clone(), x: e.clientX, y: e.clientY };
        const b = Math.hypot(o.x - h[0], o.y - h[1], o.z - h[2]), S = Math.atan2(o.y - h[1], o.x - h[0]) * 180 / Math.PI, C = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`, P = (S % 360 + 360) % 360;
        Ee.textContent = `L = ${b.toFixed(3)} m   \u2220 ${P.toFixed(1)}\xB0   \xB7   ${C}`;
        const I = document.getElementById("hk-coord-fixed");
        I && (I.textContent = C), We.geometry.setFromPoints([new E(h[0], h[1], h[2]), new E(o.x, o.y, o.z)]), (_v = We.computeLineDistances) == null ? void 0 : _v.call(We), We.visible = true, gt(h[0], h[1], h[2], o.x, o.y, o.z);
        const Q = window.__hekatanOrthoExt ?? 8, V = window.__hekatanShowOrthoPlanes !== false;
        yn.visible = V, V || Da(null), V && (Cn(Xn, h, "xy", Q), Cn(On, h, "xz", Q), Cn(Un, h, "yz", Q), zn(Jt, h, "xy", Q), zn(jt, h, "xz", Q), zn(xn, h, "yz", Q));
        const R = V ? L.intersectObjects([Jt, jt, xn], false) : [];
        let O = null;
        if (R.length > 0) {
          const pe = R[0].object;
          pe === Jt ? O = "xy" : pe === jt ? O = "xz" : pe === xn && (O = "yz");
        }
        Da(O), O && (gn.style.left = e.clientX + "px", gn.style.top = e.clientY + "px"), Pn.geometry.setFromPoints([new E(h[0] - Q, h[1], h[2]), new E(h[0] + Q, h[1], h[2])]), (_w = Pn.computeLineDistances) == null ? void 0 : _w.call(Pn), wn.geometry.setFromPoints([new E(h[0], h[1] - Q, h[2]), new E(h[0], h[1] + Q, h[2])]), (_x = wn.computeLineDistances) == null ? void 0 : _x.call(wn), Yn.geometry.setFromPoints([new E(h[0], h[1], h[2] - Q), new E(h[0], h[1], h[2] + Q)]), (_y = Yn.computeLineDistances) == null ? void 0 : _y.call(Yn), qt.visible = true;
        const se = Pn.material, be = wn.material, Fe = Yn.material;
        Pn.visible = M === "x", wn.visible = M === "y", Yn.visible = M === "z", se.opacity = 0.95, be.opacity = 0.95, Fe.opacity = 0.95;
      } else {
        const m = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        Ee.textContent = m;
        const h = document.getElementById("hk-coord-fixed");
        if (h && (h.textContent = m), We.visible = false, qt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(l)) {
          if (qe = null, lt = null, ze.style.left = e.clientX + 20 + "px", ze.style.top = e.clientY - 28 + "px", ze.style.display = "block", !et) {
            ze.value = `${o.x.toFixed(2)},${o.y.toFixed(2)},${o.z.toFixed(2)}`;
            const _ = document.activeElement;
            !(_ && (_.tagName === "INPUT" || _.tagName === "TEXTAREA") && _ !== ze) && document.activeElement !== ze && ze.focus({ preventScroll: true });
            try {
              ze.select();
            } catch {
            }
          }
        } else mn();
      }
      z();
    } else Uo(), Ee.style.display = "none", vt.visible = false, We.visible = false, qt.visible = false, mn(), z();
  }), ue.derive(() => {
    if (!t.gridTarget) return;
    const e = new Mo().setFromEuler(new $n(...t.gridTarget.val.rotation)), n = new Mo().setFromAxisAngle(new E(1, 0, 0), Math.PI / 2);
    al(w, { position: new E(...t.gridTarget.val.position), quaternion: e.clone().multiply(n) }, z), ja(t.gridTarget.val.position[2], Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3), ee.position.set(...t.gridTarget.val.position), ee.quaternion.setFromEuler(new $n(...t.gridTarget.val.rotation)), ee.updateMatrixWorld();
    const a = new E(0, 0, 1).applyEuler(new $n(...t.gridTarget.val.rotation));
    q = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  });
  function ja(e, n, a) {
    var _a3, _b, _c, _d, _e2, _f, _g;
    {
      for (const o of Jn) g.remove(o), aa(o);
      if (Jn.length = 0, n) {
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
          }), l.position.set(0, 0, i), l.quaternion.identity(), g.add(l), Jn.push(l);
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
        }), f.plano === "xz" ? (i.quaternion.setFromEuler(new $n(Math.PI / 2, 0, 0)), i.position.set(0, f.d, 0)) : (i.quaternion.setFromEuler(new $n(0, Math.PI / 2, 0)), i.position.set(f.d, 0, 0)), g.add(i), Jn.push(i);
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
  const fn = document.createElement("input");
  fn.id = "hk-grid-dist", fn.type = "text", fn.spellcheck = false, fn.title = "Distancia del plano. Teclea un n\xFAmero y Enter para colocarlo exacto; Esc cancela.", fn.style.cssText = ["position:fixed", "z-index:99997", "pointer-events:none", "display:none", "padding:3px 8px", "background:rgba(15,23,42,.94)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "width:104px", "text-align:center", "font:bold 13px Consolas,monospace", "transform:translate(14px,-28px)", "outline:none"].join(";") + ";", document.body.appendChild(fn);
  let no = false, da = 0, en = "";
  const Js = (e) => e === "xz" ? new E(0, 1, 0) : e === "yz" ? new E(1, 0, 0) : new E(0, 0, 1), es = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", wo = () => {
    var _a3, _b, _c;
    return String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy");
  }, oo = () => {
    var _a3, _b, _c;
    return Number(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c[es(wo())]) ?? 0);
  }, Do = (e) => {
    var _a3, _b;
    const n = wo(), a = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3);
    if (a && (a[es(n)] = e), !t.gridTarget) return;
    const o = window.__hekatanSCU ?? [0, 0, 0];
    t.gridTarget.val = n === "xy" ? { position: [o[0], o[1], e], rotation: [Math.PI / 2, 0, 0] } : n === "xz" ? { position: [o[0], e, o[2]], rotation: [0, 0, 0] } : { position: [e, o[1], o[2]], rotation: [0, 0, Math.PI / 2] };
  }, Os = () => {
    const e = Js(wo()), n = L.ray.origin, a = L.ray.direction, o = e.dot(a), s = 1 - o * o;
    if (Math.abs(s) < 1e-4) return null;
    const r = n.clone().negate(), f = e.dot(r), i = a.dot(r);
    return (o * i - f) / s;
  }, yo = (e, n) => {
    e && (fn.style.left = e.clientX + "px", fn.style.top = e.clientY + "px");
    const a = wo() === "xz" ? "Y" : wo() === "yz" ? "X" : "Z";
    fn.value = en !== "" ? `${a} = ${en}` : `${a} = ${n.toFixed(2)} m`, fn.style.display = "block";
  }, Bo = (e, n) => {
    var _a3;
    no && (no = false, window.__hekatanMoviendoGrilla = false, fn.style.display = "none", e ? typeof n == "number" && isFinite(n) && Do(n) : Do(da), en = "", (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), z());
  };
  window.__hekatanMoverGrilla = (e = true) => e ? (da = oo(), en = "", no = true, window.__hekatanMoviendoGrilla = true, yo(null, da), true) : Bo(false), $.addEventListener("pointermove", (e) => {
    if (!no) return;
    N(e);
    const n = Os();
    if (n === null) {
      yo(e, oo());
      return;
    }
    en === "" && Do(n), yo(e, n);
  }, true), $.addEventListener("pointerdown", (e) => {
    no && (e.preventDefault(), e.stopPropagation(), Bo(true, en !== "" ? parseFloat(en) : oo()));
  }, true), window.addEventListener("keydown", (e) => {
    if (no) {
      if (e.key === "Escape") return e.preventDefault(), Bo(false);
      if (e.key === "Enter") return e.preventDefault(), Bo(true, en !== "" ? parseFloat(en) : oo());
      if (e.key === "Backspace") {
        e.preventDefault(), en = en.slice(0, -1), yo(null, oo());
        return;
      }
      if (/^[0-9.\-]$/.test(e.key)) {
        e.preventDefault(), en += e.key;
        const n = parseFloat(en);
        isFinite(n) && Do(n), yo(null, isFinite(n) ? n : oo());
      }
    }
  }, true);
  const En = new ut();
  En.name = "hekatan-scu", En.visible = false, g.add(En);
  const Qs = (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    for (; En.children.length; ) {
      const i = En.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e2 = i.dispose) == null ? void 0 : _e2.call(i);
    }
    const n = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), a = new E(...e), o = [[new E(1, 0, 0), 16735067], [new E(0, 1, 0), 6029194], [new E(0, 0, 1), 6990079]];
    for (const [i, l] of o) En.add(new Bn(i, a, n, l, n * 0.28, n * 0.16));
    const s = new Ve().setFromPoints([new E(0, 0, 0), a]), r = new lo({ color: 2282478, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.8 }), f = new Vt(s, r);
    f.computeLineDistances(), En.add(f), En.visible = true;
  };
  window.__hekatanPonerSCU = (e) => {
    var _a3;
    return window.__hekatanSCU = [e[0], e[1], e[2]], Qs(e), (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), z(), e;
  }, window.__hekatanQuitarSCU = () => {
    var _a3;
    return window.__hekatanSCU = [0, 0, 0], En.visible = false, (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), z(), [0, 0, 0];
  };
  let ua = false;
  window.__hekatanElegirSCU = (e = true) => (ua = e, window.__hekatanColocandoSCU = e, e), $.addEventListener("pointerdown", (e) => {
    if (!ua) return;
    e.preventDefault(), e.stopPropagation(), ua = false, window.__hekatanColocandoSCU = false;
    const n = window.__hekatanOsnapUltimo;
    if (n) {
      window.__hekatanPonerSCU([n.x, n.y, n.z]);
      return;
    }
    N(e);
    const a = Ye();
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
    const e = t.gridTarget.rawVal.rotation, n = new Mo().setFromEuler(new $n(...e));
    new Mo().setFromAxisAngle(new E(1, 0, 0), Math.PI / 2), ja(t.gridTarget.rawVal.position[2], Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3);
  }, ue.derive(() => {
    Le.geometry.setAttribute("position", new Dt(t.points.val.flat(), 3)), Le.geometry.computeBoundingSphere();
  }), ue.derive(() => {
    const e = 0.05 * F * 0.5 * A.val;
    L.params.Points.threshold = 0.4 * e;
  }), ue.derive(() => {
    var _a3;
    const e = t.points.val ?? [], a = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], o = [];
    for (const r of a) {
      const [f, i, l] = e[r];
      o.push(f, i, l);
    }
    const s = new Ve();
    s.setAttribute("position", new Dt(o, 3)), Ke.geometry.dispose(), Ke.geometry = s;
  });
  let pa = false, Zn = 0;
  $.addEventListener("pointerdown", () => {
    pa = true;
  }), $.addEventListener("pointerup", () => {
    pa = false;
  }), $.addEventListener("pointermove", () => {
    pa && Zn++;
  });
  const Ut = document.createElement("div");
  Ut.id = "hk-window-select", Ut.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Ut);
  let cn = null, xo = false, Ot = null;
  const fa = (e, n, a, o, s) => {
    s ? (Ut.style.borderColor = "#3faf46", Ut.style.borderStyle = "dashed", Ut.style.background = "rgba(63, 175, 70, 0.25)") : (Ut.style.borderColor = "#3f77c4", Ut.style.borderStyle = "solid", Ut.style.background = "rgba(63, 119, 196, 0.25)"), Ut.style.left = Math.min(e, a) + "px", Ut.style.top = Math.min(n, o) + "px", Ut.style.width = Math.abs(a - e) + "px", Ut.style.height = Math.abs(o - n) + "px", Ut.style.display = "block";
  }, ts = (e, n, a, o, s) => {
    var _a3, _b, _c, _d;
    const r = Math.min(e, a), f = Math.max(e, a), i = Math.min(n, o), l = Math.max(n, o), d = a < e, c = $.getBoundingClientRect(), x = v();
    x.updateMatrixWorld();
    const m = (P) => {
      const I = new E(P[0], P[1], P[2]);
      return I.project(x), { x: c.left + (I.x * 0.5 + 0.5) * c.width, y: c.top + (-I.y * 0.5 + 0.5) * c.height };
    }, h = (P) => P.x >= r && P.x <= f && P.y >= i && P.y <= l, M = (P, I) => !(P.x < r && I.x < r || P.x > f && I.x > f || P.y < i && I.y < i || P.y > l && I.y > l);
    s || Je.clear();
    let _ = 0;
    const u = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let P = 0; P < u.length; P++) {
      const I = u[P];
      I && h(m(I)) && (Je.add(`pt:${P}`), _++);
    }
    const p = (P, I) => d ? h(P) || h(I) || M(P, I) : h(P) && h(I), y = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], b = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let P = 0; P < y.length; P++) {
      const I = y[P];
      if (b.includes(P)) {
        let V;
        if (!d) V = I.every((R) => {
          const O = u[R];
          return !!O && h(m(O));
        });
        else {
          V = false;
          for (let R = 0; R < I.length - 1; R++) {
            const O = u[I[R]], se = u[I[R + 1]];
            if (!(!O || !se) && p(m(O), m(se))) {
              V = true;
              break;
            }
          }
        }
        V && (Je.add(`poly:${P}`), _++);
      } else for (let V = 0; V < I.length - 1; V++) {
        const R = u[I[V]], O = u[I[V + 1]];
        !R || !O || p(m(R), m(O)) && (Je.add(`seg:${P}:${V}`), _++);
      }
    }
    const C = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let P = 0; P < C.length; P++) {
      const I = C[P];
      if (!I || I.length !== 6) continue;
      const Q = m([I[0], I[1], I[2]]), V = m([I[3], I[4], I[5]]);
      p(Q, V) && (Je.add(`aux:${P}`), _++);
    }
    ln(), ce(_ === 0 && !d ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${d ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${_} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Je.size})`), Ut.style.display = "none";
  }, No = () => {
    Ot && (Ot = null, Ut.style.display = "none", ce("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = No, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Ot && No();
  });
  const ha = () => {
    var _a3, _b, _c, _d;
    if (Je.size === 0) return false;
    const e = [...Je], n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], o = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? [], f = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const M of e) {
      const [_, ...u] = M.split(":");
      if (_ === "pt") f.add(+u[0]);
      else if (_ === "poly") i.add(+u[0]);
      else if (_ === "seg") {
        const p = +u[0], y = +u[1];
        l.has(p) || l.set(p, /* @__PURE__ */ new Set()), l.get(p).add(y);
      } else _ === "aux" && d.add(+u[0]);
    }
    let c = 0, x = [], m = [];
    const h = /* @__PURE__ */ new Map();
    for (let M = 0; M < a.length; M++) {
      if (i.has(M)) {
        c++;
        continue;
      }
      h.set(M, x.length);
      const _ = l.get(M);
      if (_ && _.size > 0) {
        let u = [];
        for (let p = 0; p < a[M].length; p++) u.push(a[M][p]), p < a[M].length - 1 && _.has(p) && (u.length >= 2 && x.push(u), u = [], c++);
        (u.length >= 2 || u.length === 1) && x.push(u);
      } else x.push([...a[M]]);
    }
    if (i.size > 0) {
      const M = /* @__PURE__ */ new Set();
      for (const _ of x) for (const u of _) M.add(u);
      for (const _ of i) for (const u of a[_] ?? []) M.has(u) || f.add(u);
    }
    if (f.size > 0) {
      const M = [], _ = /* @__PURE__ */ new Map();
      for (let p = 0; p < n.length; p++) {
        if (f.has(p)) {
          c++;
          continue;
        }
        _.set(p, M.length), M.push([...n[p]]);
      }
      const u = [];
      for (const p of x) {
        let y = [];
        for (const b of p) {
          const S = _.get(b);
          S === void 0 ? (y.length >= 2 && u.push(y), y = []) : y.push(S);
        }
        y.length >= 2 && u.push(y);
      }
      x = u, t.points.val = M;
    }
    for (const M of o) {
      const _ = h.get(M);
      _ !== void 0 && _ < x.length && m.push(_);
    }
    if (t.polylines && (t.polylines.val = x), t.areas && (t.areas.val = m), d.size > 0 && s) {
      const M = r.filter((_, u) => !d.has(u));
      "val" in s ? s.val = M : window.__hekatanDrawingAuxLines = M, c += d.size;
    }
    Je.clear(), ln();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ce(`\u{1F5D1} ${c} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = ha, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const n = document.activeElement, a = !!n && (n.id === "hk3-cmd-input" || n.id === "hk-dyn-input");
    if (Je.size > 0) {
      if (n && !a && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable)) return;
      e.preventDefault(), a && (n.value = ""), ha();
      return;
    }
  });
  const Wt = document.createElement("div");
  Wt.id = "hk-properties-pane";
  const ns = "hk-props-pane-pos";
  let go = null;
  try {
    const e = localStorage.getItem(ns);
    e && (go = JSON.parse(e));
  } catch {
  }
  Wt.style.cssText = ["position:fixed", go ? `left:${go.left}px` : "left:14px", go ? `top:${go.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Wt);
  const js = () => {
    const e = Wt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let n = false, a = 0, o = 0, s = 0, r = 0;
    e.addEventListener("mousedown", (f) => {
      n = true, a = f.clientX, o = f.clientY;
      const i = Wt.getBoundingClientRect();
      s = i.left, r = i.top, Wt.style.transform = "none", Wt.style.left = `${s}px`, Wt.style.top = `${r}px`, f.preventDefault();
    }), window.addEventListener("mousemove", (f) => {
      if (!n) return;
      const i = f.clientX - a, l = f.clientY - o, d = Math.max(0, Math.min(window.innerWidth - 80, s + i)), c = Math.max(0, Math.min(window.innerHeight - 40, r + l));
      Wt.style.left = `${d}px`, Wt.style.top = `${c}px`;
    }), window.addEventListener("mouseup", () => {
      if (n) {
        n = false;
        try {
          localStorage.setItem(ns, JSON.stringify({ left: parseFloat(Wt.style.left), top: parseFloat(Wt.style.top) }));
        } catch {
        }
      }
    });
  }, ne = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, _t = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let wt = null;
  const It = (e, n, a, o) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: n, prop: a, value: o } }));
  }, ei = () => {
    var _a3, _b, _c;
    if (wt && (wt.dispose(), wt = null), Je.size === 0) {
      Wt.style.display = "none";
      return;
    }
    const e = [...Je], n = e.filter((u) => u.startsWith("pt:"));
    if (n.length === 1) {
      const u = +n[0].slice(3), y = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(u);
      y ? [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = y.map(Boolean) : ne.Ux = ne.Uy = ne.Uz = ne.Rx = ne.Ry = ne.Rz = false;
      const S = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(u);
      S ? [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz] = S : ne.Fx = ne.Fy = ne.Fz = ne.Mx = ne.My = ne.Mz = 0;
    }
    const a = e.filter((u) => u.startsWith("seg:")), o = new Set(((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []), s = (u) => o.has(+u.split(":")[1]), r = e.filter((u) => u.startsWith("poly:")), f = r.filter(s), i = r.filter((u) => !s(u)), l = e.filter((u) => u.startsWith("aux:")), d = n.length > 0, c = a.length > 0, x = f.length > 0, m = i.length > 0, h = !d && !c && !x && !m, M = [];
    n.length && M.push(`\u{1F535} ${n.length} nodo(s)`), a.length && M.push(`\u{1F4CF} ${a.length} segmento(s)`), f.length && M.push(`\u25AD ${f.length} \xE1rea(s)`), i.length && M.push(`\uFF0F ${i.length} l\xEDnea(s)`), l.length && M.push(`\u250A ${l.length} aux`);
    const _ = `\u{1F3AF} ${Je.size} item(s) \u2014 ${M.join(", ")}`;
    wt = new Is({ container: Wt, title: _ });
    {
      const u = wt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      u.addBinding(_t, "dx", { label: "\u0394x (m)", step: 0.1 }), u.addBinding(_t, "dy", { label: "\u0394y (m)", step: 0.1 }), u.addBinding(_t, "dz", { label: "\u0394z (m)", step: 0.1 }), u.addBinding(_t, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), u.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a4;
        const S = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, _t.dx, _t.dy, _t.dz, _t.copias);
        ce(S ? `\u29C9 Replicado \xD7${S} (\u0394 ${_t.dx},${_t.dy},${_t.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), u.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a4;
        const S = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, _t.dx, _t.dy, _t.dz, _t.copias);
        ce(S && (S.lineas || S.areas) ? `\u21D7 Extruido: ${S.lineas} barra(s), ${S.areas} pa\xF1o(s) (\u0394 ${_t.dx},${_t.dy},${_t.dz} m \xD7 ${_t.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const p = { vuelo: 1.5, losa: true, borde: true, ambos: true }, y = u.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      y.addBinding(p, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), y.addBinding(p, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), y.addBinding(p, "borde", { label: "con viga de borde" }), y.addBinding(p, "ambos", { label: "a los dos lados" }), y.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a4;
        const S = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, p.vuelo, { losa: p.losa, vigaBorde: p.borde, lados: p.ambos ? "ambos" : "afuera" });
        ce(S ? `\u2310 Volado de ${p.vuelo} m en ${S} pa\xF1o(s)` + (p.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), u.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a4;
        const S = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, _t.dx, _t.dy, _t.dz, 1);
        ce(S ? `\u2192 Copia desplazada \u0394 ${_t.dx},${_t.dy},${_t.dz} m` : "\u26A0 Nada seleccionado");
      });
      const b = u.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      b.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a4;
        return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
      }), b.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ce(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (d) {
      const u = wt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${n.length} nodo(s)` });
      u.addBinding(ne, "Ux"), u.addBinding(ne, "Uy"), u.addBinding(ne, "Uz"), u.addBinding(ne, "Rx"), u.addBinding(ne, "Ry"), u.addBinding(ne, "Rz");
      const p = (P, I) => {
        [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = P;
        try {
          wt.refresh();
        } catch {
        }
        It("nodes", n, "supports", P), ce(`\u2713 ${I}: ${n.length} nudo(s) apoyado(s) (${P.map((Q, V) => Q ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][V] : "").filter(Boolean).join(" ")}).`);
      };
      u.addButton({ title: `\u25B2 Empotrar los ${n.length} nudo(s) (6 GDL)` }).on("click", () => p([true, true, true, true, true, true], "Empotrado")), u.addButton({ title: `\u25B3 Articular los ${n.length} nudo(s) (Ux Uy Uz)` }).on("click", () => p([true, true, true, false, false, false], "Articulado"));
      const y = wt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      y.addBinding(ne, "Kx", { label: "Kx", min: 0, step: 100 }), y.addBinding(ne, "Ky", { label: "Ky", min: 0, step: 100 }), y.addBinding(ne, "Kz", { label: "Kz", min: 0, step: 100 }), y.addBinding(ne, "Krx", { label: "Krx", min: 0, step: 1e3 }), y.addBinding(ne, "Kry", { label: "Kry", min: 0, step: 1e3 }), y.addBinding(ne, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const b = wt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      b.addBinding(ne, "Fx", { step: 0.1 }), b.addBinding(ne, "Fy", { step: 0.1 }), b.addBinding(ne, "Fz", { step: 0.1 }), b.addBinding(ne, "Mx", { step: 0.1 }), b.addBinding(ne, "My", { step: 0.1 }), b.addBinding(ne, "Mz", { step: 0.1 }), wt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ne, "mass", { label: "m", min: 0, step: 1 }), wt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ne, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), wt.addButton({ title: `\u2713 Aplicar a ${n.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let P = 0;
        const I = [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz];
        I.some((R) => R) && (It("nodes", n, "supports", I), P++);
        const Q = [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz];
        Q.some((R) => R !== 0) && (It("nodes", n, "loads", Q), P++);
        const V = [ne.Kx, ne.Ky, ne.Kz, ne.Krx, ne.Kry, ne.Krz];
        if (V.some((R) => R !== 0) && (It("nodes", n, "springs", V), P++), ne.mass !== 0 && (It("nodes", n, "mass", ne.mass), P++), ne.diaphragm !== "Ninguno" && (It("nodes", n, "diaphragm", ne.diaphragm), P++), P === 0) {
          ce("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let R = document.getElementById("hk-prop-toast");
          R || (R = document.createElement("div"), R.id = "hk-prop-toast", R.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(R)), R.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", R.style.background = "rgba(217,119,6,0.97)", R.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            R && (R.style.opacity = "0");
          }, 3200);
        } else ce(`\u2713 Propiedades aplicadas a ${n.length} nodo(s)`);
      });
    }
    if (c) {
      const u = wt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      u.addBinding(ne, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), u.addBinding(ne, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const p = wt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      p.addBinding(ne, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), p.addBinding(ne, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), p.addBinding(ne, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), p.addBinding(ne, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), wt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ne, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), wt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ne, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const S = wt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      S.addBinding(ne, "relMxI", { label: "Mx I" }), S.addBinding(ne, "relMyI", { label: "My I" }), S.addBinding(ne, "relMzI", { label: "Mz I" });
      const C = wt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      C.addBinding(ne, "relMxJ", { label: "Mx J" }), C.addBinding(ne, "relMyJ", { label: "My J" }), C.addBinding(ne, "relMzJ", { label: "Mz J" }), wt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ne, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const I = wt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      I.addBinding(ne, "LKx", { label: "LKx", min: 0, step: 100 }), I.addBinding(ne, "LKy", { label: "LKy", min: 0, step: 100 }), I.addBinding(ne, "LKz", { label: "LKz", min: 0, step: 100 });
      const Q = wt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      Q.addBinding(ne, "qx", { step: 0.1 }), Q.addBinding(ne, "qy", { step: 0.1 }), Q.addBinding(ne, "qz", { step: 0.1 }), wt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ne, "massPerM", { label: "m/L", min: 0, step: 1 }), wt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        It("segs", a, "section", ne.section), It("segs", a, "material", ne.material_frame);
        const R = { A: ne.A_mod, Iz: ne.Iz_mod, Iy: ne.Iy_mod, J: ne.J_mod };
        (R.A !== 1 || R.Iz !== 1 || R.Iy !== 1 || R.J !== 1) && It("segs", a, "modifiers", R), ne.insertionPoint !== "10 \u2014 Centroid" && It("segs", a, "insertionPoint", ne.insertionPoint), ne.beta !== 0 && It("segs", a, "beta", ne.beta);
        const O = [ne.relMxI, ne.relMyI, ne.relMzI], se = [ne.relMxJ, ne.relMyJ, ne.relMzJ];
        (O.some((pe) => pe) || se.some((pe) => pe)) && It("segs", a, "releases", { i: O, j: se }), ne.hinges !== "None" && It("segs", a, "hinges", ne.hinges);
        const be = [ne.LKx, ne.LKy, ne.LKz];
        be.some((pe) => pe !== 0) && It("segs", a, "lineSprings", be);
        const Fe = [ne.qx, ne.qy, ne.qz];
        Fe.some((pe) => pe !== 0) && It("segs", a, "distLoad", Fe), ne.massPerM !== 0 && It("segs", a, "massPerM", ne.massPerM), ce(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (x) {
      const u = wt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${f.length}` });
      u.addBinding(ne, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), u.addBinding(ne, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), u.addBinding(ne, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), wt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ne, "surfLoad", { label: "q", step: 0.1 }), wt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        It("areas", f, "shellType", ne.shellType), It("areas", f, "thickness", ne.thickness), It("areas", f, "material", ne.material_shell), ne.surfLoad !== 0 && It("areas", f, "surfLoad", ne.surfLoad), ce(`\u2713 Propiedades aplicadas a ${f.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (h) {
      const u = wt.addFolder({ title: "\u2139 Selecci\xF3n" }), p = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      u.addBinding(p, "msg", { readonly: true, label: "" });
    }
    wt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Je.clear(), ln();
    }), Wt.style.display = "block", js();
  };
  window.__hekatanRefreshPropsPane = ei;
  let ao = null, Yo = false;
  $.addEventListener("pointerdown", (e) => {
    e.button === 2 && (ao = { x: e.clientX, y: e.clientY }, Yo = false);
  }), $.addEventListener("pointermove", (e) => {
    if (ao && e.buttons & 2 && !Yo) {
      const n = e.clientX - ao.x, a = e.clientY - ao.y;
      Math.hypot(n, a) > 8 && (Yo = true);
    }
  }), $.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const n = ao !== null && !Yo;
      ao = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (n) {
        if (Ot ? No() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Je.size > 0 && (Je.clear(), ln()), t.polylines) {
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
    n !== "select" && n !== "none" && n || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (cn = { x: e.clientX, y: e.clientY }, xo = false));
  }), $.addEventListener("pointermove", (e) => {
    if (Ot && e.buttons === 0) {
      const r = e.clientX < Ot.x;
      fa(Ot.x, Ot.y, e.clientX, e.clientY, r);
      return;
    }
    if (!cn) return;
    const n = e.clientX - cn.x, a = e.clientY - cn.y, o = Math.hypot(n, a);
    if (!xo && o < 8) return;
    xo = true;
    const s = e.clientX < cn.x;
    fa(cn.x, cn.y, e.clientX, e.clientY, s);
  }), $.addEventListener("pointerup", (e) => {
    if (!cn) return;
    if (!xo) {
      cn = null;
      return;
    }
    const n = e.ctrlKey || e.metaKey || e.shiftKey;
    ts(cn.x, cn.y, e.clientX, e.clientY, n), cn = null, xo = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const tn = new ut();
  tn.visible = false, tn.frustumCulled = false, g.add(tn);
  const os = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, Xo = (e, n, a, o) => {
    var _a3, _b, _c, _d;
    for (window.__hekatanOsnapUltimo = { type: e, x: n, y: a, z: o }; tn.children.length; ) {
      const f = tn.children.pop();
      (_b = (_a3 = f.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = f.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = os[e] ?? 16777215, r = new Ve().setFromPoints([new E(-1, -1, 0), new E(1, -1, 0), new E(1, -1, 0), new E(1, 1, 0), new E(1, 1, 0), new E(-1, 1, 0), new E(-1, 1, 0), new E(-1, -1, 0)]);
    tn.add(new on(r, new mt({ color: s, linewidth: 2 }))), tn.position.set(n, a, o), tn.visible = true, wa();
  };
  let ma = 4;
  const wa = () => {
    tn.visible && tn.scale.setScalar(ma * Ro(tn.position));
  };
  window.__hekatanOsnapMarkerRef = tn, window.__hekatanUpdateOsnapScale = wa, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (ma = e, wa(), z()), ma);
  const Uo = () => {
    tn.visible = false, window.__hekatanOsnapUltimo = null;
  }, ti = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, _n = document.createElement("div");
  _n.id = "hk-osnap-etiqueta", _n.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(_n);
  const Zo = (e, n, a) => {
    const o = ti[e];
    if (!o) {
      _n.style.display = "none";
      return;
    }
    _n.textContent = o, _n.style.color = "#" + (os[e] ?? 16777215).toString(16).padStart(6, "0"), _n.style.left = n + 18 + "px", _n.style.top = a - 26 + "px", _n.style.display = "block";
  }, ni = () => {
    _n.style.display = "none";
  }, qn = new E(), Gn = (e, n, a) => {
    const o = v();
    if (!o) return null;
    const s = $.getBoundingClientRect();
    return qn.set(e, n, a).project(o), !isFinite(qn.x) || !isFinite(qn.y) || qn.z < -1 || qn.z > 1 ? null : { x: s.left + (qn.x * 0.5 + 0.5) * s.width, y: s.top + (-qn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = Gn;
  const oi = (e, n, a, o, s) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const r = window.__hekatanOsnap, f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let l = null;
    const d = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, c = s, x = (p, y, b, S) => {
      let C;
      if (c) {
        const I = Gn(y, b, S);
        if (!I || (C = Math.hypot(I.x - c.x, I.y - c.y), C > In)) return;
      } else if (C = Math.hypot(y - e, b - n, S - a), C > o) return;
      const P = d[p] ?? 9;
      (!l || P < l.r || P === l.r && C < l.d) && (l = { type: p, x: y, y: b, z: S, d: C, r: P });
    };
    if (r.ori !== false && x("ori", 0, 0, 0), r.grid !== false && window.__hekatanSnapEnabled === true) {
      const p = window.__hekatanGridConfig, y = (p == null ? void 0 : p.minorStep) && p.minorStep > 0 ? p.minorStep : 1, b = ((p == null ? void 0 : p.gridSize) ?? 30) / 2, S = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", C = (I) => Math.round(I / y) * y, P = (I, Q) => Math.abs(I) <= b + 1e-9 && Math.abs(Q) <= b + 1e-9;
      if (S === "xz") {
        const I = C(e), Q = C(a);
        P(I, Q) && x("grid", I, n, Q);
      } else if (S === "yz") {
        const I = C(n), Q = C(a);
        P(I, Q) && x("grid", e, I, Q);
      } else {
        const I = C(e), Q = C(n);
        P(I, Q) && x("grid", I, Q, a);
        const V = window.__hekatanPlanosAux ?? [];
        for (const O of V.slice(0, 24)) {
          if (O.plano === "xy" || !isFinite(O.d)) continue;
          const se = O.plano === "xz" ? new E(0, 1, 0) : new E(1, 0, 0), be = new ko(se, -O.d), Fe = new E();
          if (L.ray.intersectPlane(be, Fe)) if (O.plano === "xz") {
            const pe = C(Fe.x), $e = C(Fe.z);
            P(pe, $e) && x("grid", pe, O.d, $e);
          } else {
            const pe = C(Fe.y), $e = C(Fe.z);
            P(pe, $e) && x("grid", O.d, pe, $e);
          }
        }
        const R = window.__hekatanLevels ?? [];
        if (R.length) {
          const O = L.ray, se = new ko(), be = new E();
          for (const Fe of R.slice(0, 24)) {
            if (!isFinite(Fe == null ? void 0 : Fe.z) || Math.abs(Fe.z - a) < 1e-6 || (se.set(new E(0, 0, 1), -Fe.z), !O.intersectPlane(se, be))) continue;
            const pe = C(be.x), $e = C(be.y);
            P(pe, $e) && x("grid", pe, $e, Fe.z);
          }
        }
      }
    }
    (r.node || r.end) && f.forEach((p) => {
      r.node && x("node", p[0], p[1], p[2]);
    });
    for (const p of i) if (!(p.length < 2)) for (let y = 0; y < p.length - 1; y++) {
      const b = f[p[y]], S = f[p[y + 1]];
      if (!(!b || !S) && (r.end && (x("end", b[0], b[1], b[2]), x("end", S[0], S[1], S[2])), r.mid && x("mid", (b[0] + S[0]) / 2, (b[1] + S[1]) / 2, (b[2] + S[2]) / 2), r.nea || r.per)) {
        const C = S[0] - b[0], P = S[1] - b[1], I = S[2] - b[2], Q = C * C + P * P + I * I;
        if (Q < 1e-12) continue;
        const V = Math.max(0, Math.min(1, ((e - b[0]) * C + (n - b[1]) * P + (a - b[2]) * I) / Q)), R = b[0] + V * C, O = b[1] + V * P, se = b[2] + V * I;
        r.nea && x("nea", R, O, se), r.per && x("per", R, O, se);
      }
    }
    if (r.cen) {
      const p = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const y of p) {
        const b = i[y];
        if (!b || b.length < 3) continue;
        const S = b[0] === b[b.length - 1] ? b.slice(0, -1) : b;
        let C = 0, P = 0, I = 0, Q = 0;
        for (const V of S) {
          const R = f[V];
          R && (C += R[0], P += R[1], I += R[2], Q++);
        }
        Q >= 3 && x("cen", C / Q, P / Q, I / Q);
      }
    }
    if (r.cen) {
      const p = Ga(), y = [...Vo];
      for (const b of p) y.some((S) => Math.hypot(S.c[0] - b.c[0], S.c[1] - b.c[1], S.c[2] - b.c[2]) < 1e-6 && Math.abs(S.r - b.r) < 1e-6) || y.push(b);
      for (const b of y) {
        if (!f.some((P) => Math.abs(Math.hypot(P[0] - b.c[0], P[1] - b.c[1], P[2] - b.c[2]) - b.r) < 1e-6)) continue;
        const C = Math.hypot(e - b.c[0], n - b.c[1], a - b.c[2]);
        if (C < o || Math.abs(C - b.r) < o) {
          const P = Math.min(C, o * 0.5), I = 3;
          (!l || I < l.r || I === l.r && P < l.d) && (l = { type: "cen", x: b.c[0], y: b.c[1], z: b.c[2], d: P, r: I });
        }
      }
    }
    if (r.int) {
      const p = [];
      for (const y of i) for (let b = 0; b < y.length - 1; b++) {
        const S = f[y[b]], C = f[y[b + 1]];
        if (!S || !C) continue;
        const P = C[0] - S[0], I = C[1] - S[1], Q = C[2] - S[2], V = P * P + I * I + Q * Q;
        if (V < 1e-12) continue;
        const R = Math.max(0, Math.min(1, ((e - S[0]) * P + (n - S[1]) * I + (a - S[2]) * Q) / V));
        Math.hypot(S[0] + R * P - e, S[1] + R * I - n, S[2] + R * Q - a) < 3 * o && p.push([S, C]);
      }
      for (let y = 0; y < p.length; y++) for (let b = y + 1; b < p.length; b++) {
        const [S, C] = p[y], [P, I] = p[b], Q = [C[0] - S[0], C[1] - S[1], C[2] - S[2]], V = [I[0] - P[0], I[1] - P[1], I[2] - P[2]], R = [S[0] - P[0], S[1] - P[1], S[2] - P[2]], O = Q[0] * Q[0] + Q[1] * Q[1] + Q[2] * Q[2], se = Q[0] * V[0] + Q[1] * V[1] + Q[2] * V[2], be = V[0] * V[0] + V[1] * V[1] + V[2] * V[2], Fe = Q[0] * R[0] + Q[1] * R[1] + Q[2] * R[2], pe = V[0] * R[0] + V[1] * R[1] + V[2] * R[2], $e = O * be - se * se;
        if ($e < 1e-12) continue;
        const ke = (se * pe - be * Fe) / $e, Ge = (O * pe - se * Fe) / $e;
        if (ke < -1e-6 || ke > 1 + 1e-6 || Ge < -1e-6 || Ge > 1 + 1e-6) continue;
        const Te = [S[0] + ke * Q[0], S[1] + ke * Q[1], S[2] + ke * Q[2]], Se = [P[0] + Ge * V[0], P[1] + Ge * V[1], P[2] + Ge * V[2]];
        if (Math.hypot(Te[0] - Se[0], Te[1] - Se[1], Te[2] - Se[2]) > 1e-4) continue;
        [S, C, P, I].some((He) => Math.hypot(He[0] - Te[0], He[1] - Te[1], He[2] - Te[2]) < 1e-6) || x("int", Te[0], Te[1], Te[2]);
      }
    }
    const m = window.__hekatanAxisGrids ?? [], h = window.__hekatanLevels ?? [], M = m.filter((p) => p && p.start && p.end).map((p) => [p.start, p.end]);
    for (const [p, y] of M) {
      r.end && (x("end", p[0], p[1], p[2]), x("end", y[0], y[1], y[2]));
      const b = y[0] - p[0], S = y[1] - p[1], C = y[2] - p[2], P = b * b + S * S + C * C;
      if (P < 1e-12) continue;
      const I = Math.max(0, Math.min(1, ((e - p[0]) * b + (n - p[1]) * S + (a - p[2]) * C) / P));
      if (r.nea && x("nea", p[0] + I * b, p[1] + I * S, p[2] + I * C), r.int && Math.abs(C) > 1e-9) for (const Q of h) {
        const V = (Q.z - p[2]) / C;
        V < -1e-6 || V > 1 + 1e-6 || x("int", p[0] + V * b, p[1] + V * S, Q.z);
      }
    }
    if (r.int || r.node) for (let p = 0; p < M.length; p++) for (let y = p + 1; y < M.length; y++) {
      const [b, S] = M[p], [C, P] = M[y], I = S[0] - b[0], Q = S[1] - b[1], V = P[0] - C[0], R = P[1] - C[1], O = I * R - Q * V;
      if (Math.abs(O) < 1e-12) continue;
      const se = b[0] - C[0], be = b[1] - C[1], Fe = (V * be - R * se) / O, pe = (I * be - Q * se) / O;
      if (Fe < -1e-6 || Fe > 1 + 1e-6 || pe < -1e-6 || pe > 1 + 1e-6) continue;
      const $e = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      x("int", b[0] + Fe * I, b[1] + Fe * Q, typeof $e == "number" ? $e : a);
    }
    const _ = window.__hekatanDrawingAuxLines, u = (_ == null ? void 0 : _.rawVal) ?? (_ == null ? void 0 : _.val) ?? _ ?? [];
    for (const p of u) {
      if (p.length !== 6) continue;
      const y = [p[0], p[1], p[2]], b = [p[3], p[4], p[5]];
      if (r.end && (x("end", y[0], y[1], y[2]), x("end", b[0], b[1], b[2])), r.mid && x("mid", (y[0] + b[0]) / 2, (y[1] + b[1]) / 2, (y[2] + b[2]) / 2), r.nea || r.per) {
        const S = b[0] - y[0], C = b[1] - y[1], P = b[2] - y[2], I = S * S + C * C + P * P;
        if (I < 1e-12) continue;
        const Q = Math.max(0, Math.min(1, ((e - y[0]) * S + (n - y[1]) * C + (a - y[2]) * P) / I)), V = y[0] + Q * S, R = y[1] + Q * C, O = y[2] + Q * P;
        r.nea && x("nea", V, R, O), r.per && x("per", V, R, O);
      }
    }
    return l ? { type: l.type, x: l.x, y: l.y, z: l.z } : null;
  }, so = new ut();
  so.frustumCulled = false, g.add(so);
  const as = new mt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let ss = 0;
  const is = () => {
    var _a3, _b;
    for (const e of so.children.slice()) so.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (e) => {
    var _a3, _b;
    is();
    const n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of e || []) {
      const r = String(s).split(":");
      let f = [];
      if (r[0] === "pt") {
        const d = n[+r[1]];
        d && (f = [d, [d[0] + 1e-3, d[1], d[2]]]);
      } else if (r[0] === "seg") {
        const d = a[+r[1]] || [], c = n[d[+r[2]]], x = n[d[+r[2] + 1]];
        c && x && (f = [c, x]);
      } else r[0] === "poly" && (f = (a[+r[1]] || []).map((c) => n[c]).filter(Boolean));
      if (f.length < 2) continue;
      const i = new Ve().setFromPoints(f.map((d) => new E(d[0], d[1], d[2]))), l = new Vt(i, as);
      l.renderOrder = 1200, so.add(l);
    }
    if (!so.children.length) return;
    ss = performance.now() + 900;
    const o = () => {
      const s = ss - performance.now();
      if (s <= 0) {
        is(), z();
        return;
      }
      as.opacity = Math.min(1, s / 900) * 0.95, z(), requestAnimationFrame(o);
    };
    requestAnimationFrame(o);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a3;
    const n = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
    Array.isArray(n) && n.length && window.__hekatanDestello(n);
  }), window.__hekatanOsnapCompute = oi, window.__hekatanOsnapShow = Xo, window.__hekatanOsnapHide = Uo;
  let Oe = [], Et = 0, Kn = 0, Xt = null;
  const bo = document.createElement("div");
  bo.id = "hk-cad-status", bo.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", bo.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(bo);
  const ai = () => {
    var _a3, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), At && e.push(`\u{1F512} LOCK ${At.toUpperCase()}`);
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && e.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, ce = (e) => {
    var _a3;
    const n = e + ai();
    bo.textContent = n, window.__hekatanCadStatusText = n;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, si = "Comando:", ii = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", n = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], a = n.length ? n[n.length - 1] : [], o = Oe.length, s = (r, f = []) => ({ txt: r, ops: f });
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
        return s(`REGLA ${ft.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
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
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${Et > 0 ? Et : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(o ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${Et > 0 ? Et : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${o + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(Xt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(Xt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(Xt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Kn > 0 ? ` (distancia ${Kn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Je.size ? s(o ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Je.size ? s(o ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Je.size ? s(`SELECCI\xD3N ${Je.size} objeto${Je.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(si);
    }
  }, Qt = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const e = ii(), n = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !n && !a ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, s, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Qt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", n = e.split("   |   ")[0] ?? e;
    ce(n);
  }, window.__hekatanCadResetPending = () => {
    Oe = [], at = [], Be.visible = false, ya(), Xt = null, z(), ce("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Qt();
  };
  function ya() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((n) => n.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = ya;
  const io = [], qo = [], li = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, ri = () => JSON.parse(JSON.stringify(window.__hekatanAxisGrids ?? [])), ci = () => JSON.parse(JSON.stringify(window.__hekatanLevels ?? [])), di = () => JSON.parse(JSON.stringify(window.__hekatanPlanosAux ?? [])), xa = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])), x: li(), e: ri(), n: ci(), g: di() };
  }, ls = (e) => {
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
    Oe = [], We.visible = false, qt.visible = false, mn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    z(), Qt();
  }, zt = () => {
    io.push(xa()), io.length > 100 && io.shift(), qo.length = 0;
  }, Go = () => {
    const e = io.pop();
    if (!e) {
      ce("\u21B6 Nada para deshacer");
      return;
    }
    qo.push(xa()), ls(e), ce(`\u21B6 Deshacer \u2014 quedan ${io.length}`);
  }, rs = () => {
    const e = qo.pop();
    if (!e) {
      ce("\u21B7 Nada para rehacer");
      return;
    }
    io.push(xa()), ls(e), ce(`\u21B7 Rehacer \u2014 quedan ${qo.length}`);
  };
  window.__hekatanPushUndo = zt, window.__hekatanUndo = Go, window.__hekatanRedo = rs, document.addEventListener("keydown", (e) => {
    var _a3;
    const n = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (n === "y" || n === "z" && e.shiftKey))) return;
    const o = e.target;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && (((_a3 = o.value) == null ? void 0 : _a3.length) ?? 0) > 0 && o.__hkSucio || (e.preventDefault(), e.stopPropagation(), rs());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a3, _b, _c, _d, _e2;
    const n = e.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    if (a !== "line" && a !== "polyline") return n === "u" || n === "deshacer" || n === "undo" ? (Go(), true) : false;
    if (n === "c" || n === "cerrar" || n === "close") {
      if (s.length < 3) return ce("Cerrar necesita al menos tres puntos."), true;
      zt(), t.polylines.val = [...o.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ga(), ce(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (n === "u" || n === "deshacer" || n === "undo") {
      if (!s.length) return Go(), true;
      zt();
      const r = s[s.length - 1], f = s.slice(0, -1), i = o.some((c, x) => x !== o.length - 1 && c.includes(r)) || f.includes(r);
      let l = t.points.rawVal, d = [...o.slice(0, -1), f];
      if (!i && r === l.length - 1 && (l = l.slice(0, -1), t.points.val = l), t.polylines.val = d, f.length) {
        const c = l[f[f.length - 1]];
        c && (qe = [c[0], c[1], c[2]]);
      } else qe = null, We.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return z(), ce(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${f.length}.`), Qt(), true;
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
      e.preventDefault(), e.stopPropagation(), Go();
    }
  }, { capture: true });
  const ga = () => {
    Oe = [], Xt = null, ya(), At = null, Ba(), We.visible = false, qt.visible = false, mn(), ce("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), z(), Qt();
  };
  window.__hekatanFinalizeDraw = ga, window.__hekatanCancelarTodo = () => (ba(), true);
  const ba = () => {
    var _a3, _b, _c;
    Oe = [], at = [], Be.visible = false;
    let e = false;
    Je.size && (Je.clear(), ln(), e = true), ga();
    try {
      const n = window.__hekatanCadState, a = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"));
    } catch {
    }
    ce(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), z(), Qt();
  };
  window.__hekatanEscapeCancel = ba;
  const cs = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Set();
    return Je.forEach((a) => {
      if (a.startsWith("pt:")) n.add(+a.slice(3));
      else if (a.startsWith("poly:")) (e[+a.slice(5)] || []).forEach((o) => n.add(o));
      else if (a.startsWith("seg:")) {
        const o = a.split(":"), s = e[+o[1]] || [], r = s[+o[2]], f = s[+o[2] + 1];
        r != null && n.add(r), f != null && n.add(f);
      }
    }), n;
  }, ds = (e, n, a) => {
    var _a3;
    const o = cs();
    if (!o.size) return 0;
    zt();
    const s = t.points.rawVal.map((r, f) => o.has(f) ? [r[0] + e, r[1] + n, r[2] + a] : r);
    t.points.val = s;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return ln(), z(), o.size;
  };
  window.__hekatanMoveSelection = ds;
  const us = (e, n) => {
    var _a3, _b, _c, _d, _e2;
    if (!Je.size) {
      ce(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Qt();
      return;
    }
    if (Oe.push(n), Oe.length === 1) {
      qe = n, ce(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)}). Precise el segundo punto.`), Qt();
      return;
    }
    const [a, o] = Oe, s = [o[0] - a[0], o[1] - a[1], o[2] - a[2]];
    Oe = [], We.visible = false;
    let r = 0;
    e === "move" ? r = ds(s[0], s[1], s[2]) : (r = cs().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ce(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${r} nudo${r === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (Je.clear(), ln()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Qt();
  };
  window.__hekatanPasoMoverCopiar = us;
  const ui = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Tn = (e, n) => Math.hypot(e[0] - n[0], e[1] - n[1], e[2] - n[2]), Ma = (e, n, a, o, s, r) => {
    const f = [n[0] - e[0], n[1] - e[1], n[2] - e[2]], i = [o[0] - a[0], o[1] - a[1], o[2] - a[2]], l = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], d = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], c = f[0] * i[0] + f[1] * i[1] + f[2] * i[2], x = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], m = f[0] * l[0] + f[1] * l[1] + f[2] * l[2], h = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], M = d * x - c * c;
    if (M < 1e-12) return null;
    const _ = (c * h - x * m) / M, u = (d * h - c * m) / M;
    if (!s && (_ < -1e-6 || _ > 1 + 1e-6) || !r && (u < -1e-6 || u > 1 + 1e-6)) return null;
    const p = [e[0] + _ * f[0], e[1] + _ * f[1], e[2] + _ * f[2]], y = [a[0] + u * i[0], a[1] + u * i[1], a[2] + u * i[2]];
    return Tn(p, y) > 1e-4 ? null : p;
  }, pi = (e) => {
    var _a3;
    return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((n, a) => n + a.filter((o) => o === e).length, 0);
  }, fi = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, hi = (e, n) => {
    var _a3, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal, o = t.points.rawVal, s = fi[e];
    if (!Xt) {
      if (pn < 0) {
        ce(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Xt = { poly: pn, seg: Math.max(0, Vn) }, ce(e === "offset" ? `DESFASE l\xEDnea #${Xt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Kn > 0 ? ` (${Kn} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Qt();
      return;
    }
    if (e === "offset") {
      const _ = Xt.poly, u = a[_];
      if (!u || u.length < 2) {
        Xt = null, ce("DESFASE: esa polil\xEDnea no tiene tramos."), Qt();
        return;
      }
      const p = u.length > 2 && u[0] === u[u.length - 1], y = ui(), b = [];
      for (let ke = 0; ke < u.length - 1; ke++) {
        const Ge = o[u[ke]], Te = o[u[ke + 1]], Se = [Te[0] - Ge[0], Te[1] - Ge[1], Te[2] - Ge[2]], Ze = Math.hypot(Se[0], Se[1], Se[2]) || 1, He = Se[0] / Ze, pt = Se[1] / Ze, ht = Se[2] / Ze, kt = [y[1] * ht - y[2] * pt, y[2] * He - y[0] * ht, y[0] * pt - y[1] * He], yt = Math.hypot(kt[0], kt[1], kt[2]) || 1;
        b.push({ a: Ge, b: Te, n: [kt[0] / yt, kt[1] / yt, kt[2] / yt] });
      }
      let S = 0, C = 1 / 0;
      b.forEach((ke, Ge) => {
        const Te = po(n[0], n[1], n[2], ke.a[0], ke.a[1], ke.a[2], ke.b[0], ke.b[1], ke.b[2]);
        Te < C && (C = Te, S = Ge);
      });
      const P = b[S], I = Math.sign((n[0] - P.a[0]) * P.n[0] + (n[1] - P.a[1]) * P.n[1] + (n[2] - P.a[2]) * P.n[2]) || 1, Q = Kn > 0 ? Kn : C;
      if (Q < 1e-6) {
        ce("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const V = b.map((ke) => ({ a: [ke.a[0] + I * Q * ke.n[0], ke.a[1] + I * Q * ke.n[1], ke.a[2] + I * Q * ke.n[2]], b: [ke.b[0] + I * Q * ke.n[0], ke.b[1] + I * Q * ke.n[1], ke.b[2] + I * Q * ke.n[2]] })), R = V.length, O = (ke) => {
        const Ge = V[(ke - 1 + R) % R], Te = V[ke % R];
        return Ma(Ge.a, Ge.b, Te.a, Te.b, true, true) ?? Te.a;
      }, se = [], be = p ? R : R + 1;
      for (let ke = 0; ke < be; ke++) !p && ke === 0 ? se.push(V[0].a) : !p && ke === R ? se.push(V[R - 1].b) : se.push(O(ke));
      zt();
      const Fe = o.length;
      t.points.val = [...o, ...se];
      const pe = se.map((ke, Ge) => Fe + Ge);
      p && pe.push(Fe);
      let $e = a.slice();
      $e.length && $e[$e.length - 1].length === 0 && ($e = $e.slice(0, -1)), t.polylines.val = [...$e, pe, []], Xt = null, ce(`\u2713 Desfase a ${Q.toFixed(2)} m \u2014 ${R} tramo${R === 1 ? "" : "s"} nuevo${R === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      z(), Qt();
      return;
    }
    let r = pn, f = Math.max(0, Vn);
    if (r < 0 || r === Xt.poly && f === Xt.seg) {
      let u = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (r = -1, a.forEach((p, y) => {
        for (let b = 0; b < p.length - 1; b++) {
          if (y === Xt.poly && b === Xt.seg) continue;
          const S = o[p[b]], C = o[p[b + 1]];
          if (!S || !C) continue;
          const P = po(n[0], n[1], n[2], S[0], S[1], S[2], C[0], C[1], C[2]);
          P < u && (u = P, r = y, f = b);
        }
      }), r < 0) {
        ce(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const i = a[Xt.poly], l = o[i[Xt.seg]], d = o[i[Xt.seg + 1]], c = a[r], x = c[f], m = c[f + 1];
    if (!l || !d || x == null || m == null) {
      ce(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const h = o[x], M = o[m];
    if (e === "trim") {
      const _ = Ma(h, M, l, d, false, false);
      if (!_) {
        ce("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      zt();
      const u = o.length;
      t.points.val = [...o, _];
      const p = [...c.slice(0, f + 1), u, ...c.slice(f + 1)];
      t.polylines.val = a.map((b, S) => S === r ? p : b);
      const y = Tn(n, h) < Tn(n, M);
      Ua(r, y ? f : f + 1), ce(`\u2713 Recortado en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const _ = Ma(h, M, l, d, true, false);
      if (!_) {
        ce("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const p = Tn(n, h) < Tn(n, M) ? f : f + 1;
      if (p !== 0 && p !== c.length - 1) {
        ce("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const y = c[p];
      if (Tn(_, h) + Tn(_, M) < Tn(h, M) + 1e-6) {
        ce("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (zt(), pi(y) > 1) {
        const S = o.length;
        t.points.val = [...o, _];
        const C = c.slice();
        C[p] = S, t.polylines.val = a.map((P, I) => I === r ? C : P);
      } else t.points.val = o.map((S, C) => C === y ? _ : S);
      ce(`\u2713 Alargada hasta (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    z(), Qt();
  };
  window.__hekatanSelectionSize = () => Je.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let n = e.length - 1;
    for (; n >= 0 && (!e[n] || e[n].length < 2); ) n--;
    return Je.clear(), n >= 0 && Je.add(`poly:${n}`), ln(), ce(n >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Je.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    Je.clear();
    const a = /* @__PURE__ */ new Set();
    return e.forEach((o, s) => {
      !o || o.length < 2 || (Je.add(`poly:${s}`), o.forEach((r) => a.add(r)));
    }), n.forEach((o, s) => {
      a.has(s) || Je.add(`pt:${s}`);
    }), ln(), ce(`SELECCI\xD3N ${Je.size} objetos (todo el modelo) \xB7 Esc suelta`), Je.size;
  }, window.__hekatanReplicateSelection = (e, n, a, o, s = 0) => {
    var _a3, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1)), s = Math.max(0, Math.round(s || 0));
    const r = [...Je], f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), d = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), x = [];
    if (r.forEach((u) => {
      if (u.startsWith("pt:")) {
        const p = +u.slice(3);
        f[p] && d.add(p);
      } else if (u.startsWith("poly:")) {
        const p = +u.slice(5);
        if (!i[p] || i[p].length < 2) return;
        c.add(p), i[p].forEach((y) => d.add(y));
      } else if (u.startsWith("seg:")) {
        const p = u.split(":"), y = +p[1], b = +p[2], S = i[y] || [], C = S[b], P = S[b + 1];
        C != null && P != null && (x.push([C, P]), d.add(C), d.add(P));
      }
    }), !d.size) return 0;
    zt();
    const m = [...f];
    let h = i.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], _ = [...d];
    for (let u = 1; u <= o; u++) {
      const p = s + u, y = e * p, b = n * p, S = a * p, C = /* @__PURE__ */ new Map();
      _.forEach((P) => {
        C.set(P, m.length), m.push([f[P][0] + y, f[P][1] + b, f[P][2] + S]);
      }), c.forEach((P) => {
        const I = i[P].map((V) => C.has(V) ? C.get(V) : V), Q = h.length;
        h.push(I), l.has(P) && M.push(Q);
      }), x.forEach(([P, I]) => {
        h.push([C.get(P), C.get(I)]);
      });
    }
    h.push([]), t.points.val = m, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return z(), o;
  }, window.__hekatanExtrudeSelection = (e, n, a, o) => {
    var _a3, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1));
    const s = [...Je], r = t.points.rawVal, f = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), l = /* @__PURE__ */ new Set(), d = [], c = /* @__PURE__ */ new Set();
    for (const y of f) for (const b of y) c.add(b);
    if (s.forEach((y) => {
      if (y.startsWith("poly:")) {
        const b = +y.slice(5);
        if (i.has(b)) return;
        const S = f[b] || [];
        for (let C = 0; C + 1 < S.length; C++) d.push([S[C], S[C + 1]]), c.add(S[C]), c.add(S[C + 1]);
      } else if (y.startsWith("seg:")) {
        const b = y.split(":"), S = +b[1], C = +b[2], P = f[S] || [], I = P[C], Q = P[C + 1];
        I != null && Q != null && (d.push([I, Q]), c.add(I), c.add(Q));
      }
    }), s.forEach((y) => {
      if (y.startsWith("pt:")) {
        const b = +y.slice(3);
        r[b] && !c.has(b) && l.add(b);
      }
    }), !l.size && !d.length) return { lineas: 0, areas: 0 };
    zt();
    const x = [...r];
    let m = f.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const h = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], M = /* @__PURE__ */ new Map(), _ = (y, b) => {
      if (b === 0) return y;
      const S = y + ":" + b;
      let C = M.get(S);
      if (C == null) {
        const P = [r[y][0] + e * b, r[y][1] + n * b, r[y][2] + a * b];
        C = x.findIndex((I) => Math.abs(I[0] - P[0]) < 1e-3 && Math.abs(I[1] - P[1]) < 1e-3 && Math.abs(I[2] - P[2]) < 1e-3), C < 0 && (C = x.length, x.push(P)), M.set(S, C);
      }
      return C;
    };
    let u = 0, p = 0;
    l.forEach((y) => {
      const b = [y];
      for (let S = 1; S <= o; S++) b.push(_(y, S));
      m.push(b), u += o;
    }), d.forEach(([y, b]) => {
      for (let S = 1; S <= o; S++) {
        const C = [_(y, S - 1), _(b, S - 1), _(b, S), _(y, S)];
        h.push(m.length), m.push([...C, C[0]]), p++;
      }
    }), m.push([]), t.points.val = x, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = h);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return z(), { lineas: u, areas: p };
  }, window.__hekatanVoladoSelection = (e, n = {}) => {
    var _a3, _b, _c;
    const a = Number(e);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const o = n.losa !== false, s = n.vigaBorde !== false, r = n.lados === "afuera" ? "afuera" : "ambos", f = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = [];
    if ([...Je].forEach((_) => {
      if (_.startsWith("seg:")) {
        const u = _.split(":"), p = +u[1], y = +u[2], b = i[p] || [], S = b[y], C = b[y + 1];
        S != null && C != null && l.push([S, C]);
      } else if (_.startsWith("poly:")) {
        const u = i[+_.slice(5)] || [];
        for (let p = 0; p + 1 < u.length; p++) l.push([u[p], u[p + 1]]);
      }
    }), !l.length) return 0;
    let d = 0, c = 0;
    for (const _ of f) d += _[0], c += _[1];
    d /= Math.max(1, f.length), c /= Math.max(1, f.length), zt();
    const x = [...f];
    let m = i.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const h = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let M = 0;
    for (const [_, u] of l) {
      const p = f[_], y = f[u];
      if (!p || !y) continue;
      const b = y[0] - p[0], S = y[1] - p[1], C = Math.hypot(b, S);
      if (C < 1e-6) continue;
      let P = -S / C, I = b / C;
      const Q = (p[0] + y[0]) / 2, V = (p[1] + y[1]) / 2;
      (Q - d) * P + (V - c) * I < 0 && (P = -P, I = -I);
      const R = r === "ambos" ? [1, -1] : [1];
      for (const O of R) {
        const se = P * a * O, be = I * a * O, Fe = x.length;
        x.push([p[0] + se, p[1] + be, p[2]]);
        const pe = x.length;
        x.push([y[0] + se, y[1] + be, y[2]]), m.push([_, Fe]), m.push([u, pe]), s && m.push([Fe, pe]), o && (h.push(m.length), m.push([_, u, pe, Fe, _])), M++;
      }
    }
    if (!M) return 0;
    m.push([]), t.points.val = x, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = h);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return z(), M;
  }, $.addEventListener("click", (e) => {
    var _a3, _b, _c;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Zn > 5) {
      Zn = 0;
      return;
    }
    Zn = 0;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    const a = !!(Nt && Math.abs(e.clientX - Nt.x) <= 3 && Math.abs(e.clientY - Nt.y) <= 3), o = a ? [{ point: Nt.p.clone(), distance: n.position.distanceTo(Nt.p) }] : Ye();
    if (!o.length) return;
    if (!a) {
      const r = n.position.distanceTo(k.target) || 1, f = o[0].distance ?? n.position.distanceTo(o[0].point), i = o[0].point;
      if (!isFinite(i.x) || !isFinite(i.y) || !isFinite(i.z) || f > Math.max(r * 12, 300)) {
        ce("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let s = o[0].point;
    (e.ctrlKey || e.metaKey) && (s = new E(Math.round(o[0].point.x), Math.round(o[0].point.y), Math.round(o[0].point.z)));
    {
      const r = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], f = r[r.length - 1] ?? [], i = t.points.rawVal ?? [];
      if (f.length > 0) {
        const l = i[f[f.length - 1]];
        if (l) {
          const d = !!window.__hekatanOrthoMode;
          let c = At;
          if (!c && d) {
            const x = Math.abs(s.x - l[0]), m = Math.abs(s.y - l[1]), h = Math.abs(s.z - l[2]);
            c = x >= m && x >= h ? "x" : m >= h ? "y" : "z";
          }
          c === "x" ? s = new E(s.x, l[1], l[2]) : c === "y" ? s = new E(l[0], s.y, l[2]) : c === "z" && (s = new E(l[0], l[1], s.z));
        }
      }
    }
    if (Nt && Math.abs(e.clientX - Nt.x) <= 3 && Math.abs(e.clientY - Nt.y) <= 3) s = Nt.p.clone();
    else if (Qn) s = Qn.clone(), ce(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
    else {
      const r = ca(s), f = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, s.x, s.y, s.z, r, { x: e.clientX, y: e.clientY });
      if (f) s = new E(f.x, f.y, f.z), ce(`\u{1F3AF} Snap [${f.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        i && l > 0 && (s = new E(Math.round(s.x / l) * l, Math.round(s.y / l) * l, Math.round(s.z / l) * l));
      }
    }
    va(s, e);
  });
  const mi = (e) => {
    var _a3;
    const n = (_a3 = t.gridTarget) == null ? void 0 : _a3.rawVal;
    if (!n) return true;
    const a = new E(0, 0, 1).applyEuler(new $n(...n.rotation)).normalize(), o = L.ray.direction;
    return o.lengthSq() < 1e-12 ? true : Math.abs(o.clone().normalize().dot(a)) >= 0.026;
  }, va = (e, n) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (n && !(a === "select" || a === "none" || !a || a === "medir" || a === "move" || a === "copy" || a === "delete" || a === "trim" || a === "extend") && !Qn && !mi() && ce(`\u26A0 Est\xE1s mirando el plano de trabajo casi de canto, y ah\xED un p\xEDxel vale decenas de metros: el punto ha ca\xEDdo en (${e.x.toFixed(1)}, ${e.y.toFixed(1)}, ${e.z.toFixed(1)}) m. Si no era eso, deshaz (Ctrl+Z) y ponte en una vista ortogonal (Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`), a === "select" || a === "none" || !a) {
      if (vn) {
        Ot && No();
        const { kind: i, a: l, b: d } = vn, c = d !== void 0 ? `${i}:${l}:${d}` : `${i}:${l}`;
        !!n && (n.ctrlKey || n.metaKey || n.shiftKey) || Je.clear(), Je.has(c) ? Je.delete(c) : Je.add(c), ln(), ce(`\u2713 Seleccionados ${Je.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!n && (n.ctrlKey || n.metaKey || n.shiftKey), l = (n == null ? void 0 : n.clientX) ?? 0, d = (n == null ? void 0 : n.clientY) ?? 0;
        Ot ? (ts(Ot.x, Ot.y, l, d, i), Ot = null) : i || (Ot = { x: l, y: d }, ce("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), fa(l, d, l + 1, d + 1, false));
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
      us(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "delete") {
      if (Ln >= 0) {
        const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], d = Ln;
        if (d >= 0 && d < l.length) {
          zt();
          const c = l.slice(0, d).concat(l.slice(d + 1));
          i && typeof i == "object" && "val" in i ? i.val = c : window.__hekatanDrawingAuxLines = c, ce(`\u{1F5D1} L\xEDnea auxiliar #${d + 1} borrada`), Ln = -1, Kt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (pn >= 0) {
        const i = pn, l = Vn;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? ($o(i), ce(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (Ua(i, l), ce(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : ($o(i), ce(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else ce("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, l] = Oe, d = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), c = Math.abs(l[0] - i[0]), x = Math.abs(l[1] - i[1]), m = Math.abs(l[2] - i[2]), h = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), _ = (h === "xy" ? m < 1e-3 : h === "xz" ? x < 1e-3 : h === "yz" ? c < 1e-3 : false) ? h : m < 1e-3 ? "xy" : x < 1e-3 ? "xz" : "yz", u = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], d, u, _), ce(`\u2713 C\xEDrculo dibujado en ${_.toUpperCase()} \u2014 r=${d.toFixed(2)}m, ${u} segmentos`), Oe = [];
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
      let x = String(window.__hekatanIfcCaraPos ?? "auto"), m = false;
      try {
        const S = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        m = Math.round((S == null ? void 0 : S.matShell) ?? 0) === 1;
      } catch {
      }
      x === "auto" && (x = Math.abs(d.z) > 0.5 ? m ? "interior" : "exterior" : "media");
      const h = c ?? 0.2, M = x === "exterior" ? 0 : x === "interior" ? h : h / 2, _ = l.map((S) => S.clone().addScaledVector(d, -M));
      zt(), at = _.map((S) => [S.x, S.y, S.z]);
      const u = To();
      try {
        const S = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        S && c && (S.tShell = Math.round(c * 100) / 100);
      } catch {
      }
      const p = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let y = "la de \xABSecci\xF3n shells\xBB";
      try {
        const S = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        S && S.formaPlaca != null && (y = p[Math.round(S.formaPlaca)] ?? y);
      } catch {
      }
      const b = x === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : x === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + h.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (h / 2).toFixed(2) + " m hacia dentro)";
      ce(`\u25A6 \xC1rea desde la cara del IFC: ${l.length} v\xE9rtices, ${u} shell(s). Espesor medido ${c ? c.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${b}; formulaci\xF3n ${y}, t = ${h.toFixed(2)} m.`), he(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      z();
      return;
    }
    if (a === "ifcline") {
      if (!xe || xe.length < 2) {
        ce("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = T(xe);
      zt();
      const l = t.points.rawVal, d = [], c = [];
      for (const m of i) {
        let h = l.findIndex((M) => Math.abs(M[0] - m[0]) < 1e-3 && Math.abs(M[1] - m[1]) < 1e-3 && Math.abs(M[2] - m[2]) < 1e-3);
        h < 0 && (h = l.length + c.length, c.push(m)), d.push(h);
      }
      if (t.points.val = [...l, ...c], t.polylines) {
        const m = t.polylines.rawVal, h = m.length && m[m.length - 1].length === 0 ? m.slice(0, -1) : m;
        t.polylines.val = [...h, d, []];
      }
      const x = xe.reduce((m, h, M) => M ? m + h.distanceTo(xe[M - 1]) : 0, 0);
      ce(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${x.toFixed(2)} m de desarrollo.`), Z(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      z();
      return;
    }
    if (a === "arc") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Oe.length === 2) {
        ce("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [i, l, d] = Oe, c = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, l, d, c), ce(`\u2713 Arco dibujado \u2014 ${c} segmentos`), Oe = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "parabola" || a === "cubica") {
      const i = a === "parabola" ? 3 : 4, l = a === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Oe.push([e.x, e.y, e.z]), Oe.length < i) {
        ce(`\u223F ${l} \u2014 punto ${Oe.length}/${i} OK. Marc\xE1 el ${Oe.length + 1}\xBA.`);
        return;
      }
      const d = window.__hekatanArcSegs ?? 12, c = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Oe.slice(), d);
      if (!(c == null ? void 0 : c.ok)) {
        ce(`\u26A0 ${l}: ${(c == null ? void 0 : c.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Oe = [];
        return;
      }
      const x = "xyz"[c.ia ?? 0], m = "xyz"[c.io ?? 2], h = (c.coef ?? []).map((M, _) => `${M >= 0 && _ ? "+" : ""}${M.toFixed(3)}${_ ? "\xB7" + x + (_ > 1 ? "^" + _ : "") : ""}`).join(" ");
      ce(`\u2713 ${l} dibujada en ${String(c.plano ?? "").toUpperCase()} \u2014 ${d} tramos a \u0394 igual de ${x} \xB7 ${m} = ${h}`), Oe = [];
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
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Oe;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, l), ce(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Oe = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const l = (Nt && Math.abs(Nt.x - n.clientX) < 3 && Math.abs(Nt.y - n.clientY) < 3 ? [Nt.p.x, Nt.p.y, Nt.p.z] : null) ?? rt(n);
      if (!l) return;
      if (ft.length >= 2 && (ft = []), ft.push(l), ft.length === 1) it.visible = false, Lt(), ce("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [d, c] = ft;
        it.geometry.setFromPoints([new E(d[0], d[1], d[2]), new E(c[0], c[1], c[2])]), it.visible = true;
        const x = Math.hypot(c[0] - d[0], c[1] - d[1], c[2] - d[2]), m = Math.hypot(c[0] - d[0], c[1] - d[1]);
        tt.textContent = `${x.toFixed(3)} m`, Lt(), ce(`\u{1F4CF} Distancia ${x.toFixed(3)} m  \xB7  \u0394x ${(c[0] - d[0]).toFixed(3)}  \u0394y ${(c[1] - d[1]).toFixed(3)}  \u0394z ${(c[2] - d[2]).toFixed(3)}  \xB7  en planta ${m.toFixed(3)} m`);
      }
      z();
      return;
    }
    if (a === "fillarea") {
      const i = t.points.rawVal, l = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], d = /* @__PURE__ */ new Map(), c = (V, R) => {
        V !== R && ((d.get(V) ?? d.set(V, /* @__PURE__ */ new Set()).get(V)).add(R), (d.get(R) ?? d.set(R, /* @__PURE__ */ new Set()).get(R)).add(V));
      };
      for (const V of l) for (let R = 0; R + 1 < V.length; R++) c(V[R], V[R + 1]);
      const x = (V, R) => {
        var _a4;
        return !!((_a4 = d.get(V)) == null ? void 0 : _a4.has(R));
      }, m = /* @__PURE__ */ new Set(), h = [], M = [...d.keys()];
      for (const V of M) for (const R of d.get(V)) if (!(R < V)) {
        for (const O of d.get(R)) if (O !== V) for (const se of d.get(O)) {
          if (se === V || se === R || !x(se, V) || x(V, O) || x(R, se)) continue;
          const be = [V, R, O, se].slice().sort((Fe, pe) => Fe - pe).join("-");
          m.has(be) || (m.add(be), h.push([V, R, O, se]));
        }
      }
      for (const V of M) for (const R of d.get(V)) if (!(R < V)) for (const O of d.get(R)) {
        if (O === V || !x(O, V)) continue;
        const se = [V, R, O].slice().sort((be, Fe) => be - Fe).join("-");
        m.has(se) || (m.add(se), h.push([V, R, O]));
      }
      const _ = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", u = (V) => _ === "xy" ? [V[0], V[1]] : _ === "xz" ? [V[0], V[2]] : [V[1], V[2]], p = u([e.x, e.y, e.z]), y = (V, R) => {
        let O = false;
        for (let se = 0, be = R.length - 1; se < R.length; be = se++) {
          const Fe = R[se][0], pe = R[se][1], $e = R[be][0], ke = R[be][1];
          pe > V[1] != ke > V[1] && V[0] < ($e - Fe) * (V[1] - pe) / (ke - pe) + Fe && (O = !O);
        }
        return O;
      }, b = (V) => {
        let R = 0;
        for (let O = 0, se = V.length - 1; O < V.length; se = O++) R += (V[se][0] + V[O][0]) * (V[se][1] - V[O][1]);
        return Math.abs(R) / 2;
      };
      let S = null, C = 1 / 0;
      for (const V of h) {
        const R = V.map((se) => u(i[se]));
        if (!y(p, R)) continue;
        const O = b(R);
        O < C && (C = O, S = V);
      }
      if (!S) {
        ce("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const P = S.slice().sort((V, R) => V - R).join("-"), I = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (I.some((V) => {
        const R = l[V] ?? [];
        return [...new Set(R)].sort((O, se) => O - se).join("-") === P;
      })) {
        ce("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...l, [...S, S[0]]], t.areas.val = [...I, l.length], ce(`\u2713 \xC1rea creada por relleno (${S.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Oe;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), ce(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Oe = [];
      return;
    }
    if (a === "polyarea") {
      at.push([e.x, e.y, e.z]), Be.geometry.setFromPoints(at.map((i) => new E(i[0], i[1], i[2]))), Be.visible = at.length >= 1, ce(`\u25B0 \xC1rea libre \u2014 ${at.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), z();
      return;
    }
    if (a === "plane3") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length < 3) {
        ce(`\u25E3 Plano inclinado \u2014 punto ${Oe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [i, l, d] = Oe, c = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, l, d);
      ce(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Oe = [];
      return;
    }
    if (a === "col") {
      zt();
      const i = e.z, l = Et && Et > 0 ? Et : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + l]];
      const d = t.polylines.rawVal, c = t.points.rawVal.length;
      t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [c - 2, c - 1], []], Et = 0, ce(`\u258C Columna creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [i, l] = Oe, d = Et && Et > 0 ? Et : 3;
      zt();
      const c = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [l[0], l[1], l[2]], [l[0], l[1], l[2] + d], [i[0], i[1], i[2] + d]];
      const x = t.polylines.rawVal;
      if (x.length - 1, t.polylines.val = [...x.slice(0, -1), ...x[x.length - 1].length > 0 ? [x[x.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], t.areas) {
        const m = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, m];
      }
      ce(`\u25A5 Pared Q4 creada \u2014 h=${d.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Oe = [], Et = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      zt();
      const i = Et && Et > 0 ? Et : 3, l = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, l], [e.x, e.y, l + i]];
      const d = t.polylines.rawVal, c = t.points.rawVal.length;
      t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [c - 2, c - 1], []], Et = 0, ce(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = sa(e.x, e.y, e.z, i);
      if (!l) {
        ce("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const d = t.polylines.rawVal, c = t.points.rawVal, x = d[l.polyIdx], m = c[x[l.segIdx]], h = c[x[l.segIdx + 1]];
      if (!m || !h) {
        ce("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const M = Et && Et > 0 ? Et : 3;
      zt();
      const _ = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [m[0], m[1], m[2]], [h[0], h[1], h[2]], [h[0], h[1], h[2] + M], [m[0], m[1], m[2] + M]];
      const u = t.polylines.rawVal;
      if (t.polylines.val = [...u.slice(0, -1), ...u[u.length - 1].length > 0 ? [u[u.length - 1]] : [], [_, _ + 1, _ + 2, _ + 3, _], []], t.areas) {
        const p = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, p];
      }
      Et = 0, ce(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${M.toFixed(2)}m`);
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
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, l] = Oe, d = window.__hekatanDrawingAuxLines;
      if (d) {
        zt();
        const M = d.rawVal ?? d.val ?? [];
        d.val = [...M, [i[0], i[1], i[2], l[0], l[1], l[2]]];
      }
      const c = l[0] - i[0], x = l[1] - i[1], m = l[2] - i[2], h = Math.sqrt(c * c + x * x + m * m);
      ce(`\u2713 L\xEDnea auxiliar creada \u2014 L=${h.toFixed(2)}m (cyan, no FEM)`), Oe = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      hi(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "chaflan") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Oe, d = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, d, c, 6);
      const x = Math.abs(l[0] - i[0]).toFixed(1), m = Math.abs(l[1] - i[1]).toFixed(1);
      ce(`\u2713 Losa con chaflanes dibujada \u2014 ${x}\xD7${m}m, r=${d}m, ${c} seg/chafl\xE1n`), Oe = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    et = false, zt();
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
  $.addEventListener("click", () => Qt()), $.addEventListener("contextmenu", (e) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && at.length >= 3) {
      e.preventDefault();
      const a = To();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), $.addEventListener("pointermove", (e) => {
    var _a3, _b, _c;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    const a = Ye();
    if (Qe.geometry.deleteAttribute("position"), a.length) {
      let o = a[0].point.clone();
      (e.ctrlKey || e.metaKey) && o.set(Math.round(o.x), Math.round(o.y), Math.round(o.z));
      {
        const f = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = f[f.length - 1] ?? [], l = t.points.rawVal ?? [];
        if (i.length > 0) {
          const d = l[i[i.length - 1]];
          if (d) {
            const c = !!window.__hekatanOrthoMode;
            let x = At;
            if (!x && c) {
              const m = Math.abs(o.x - d[0]), h = Math.abs(o.y - d[1]), M = Math.abs(o.z - d[2]);
              x = m >= h && m >= M ? "x" : h >= M ? "y" : "z";
            }
            x === "x" ? o.set(o.x, d[1], d[2]) : x === "y" ? o.set(d[0], o.y, d[2]) : x === "z" && o.set(d[0], d[1], o.z);
          }
        }
      }
      const s = ca(o), r = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, o.x, o.y, o.z, s, { x: e.clientX, y: e.clientY });
      if (r) o.set(r.x, r.y, r.z);
      else {
        const f = window.__hekatanSnapEnabled !== false, i = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        f && i > 0 && (o.x = Math.round(o.x / i) * i, o.y = Math.round(o.y / i) * i, o.z = Math.round(o.z / i) * i);
      }
      Qe.geometry.setAttribute("position", new Dt(o.toArray(), 3));
    }
    z();
  }), $.addEventListener("pointermove", (e) => {
    var _a3;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const r = new E(...t.points.rawVal[o[0].index]), f = new E(...s[0].point), i = r.sub(f), l = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      l.transformDirection(ee.matrixWorld), Math.abs(i.dot(l)) < 1e-4 && (a = true);
    }
    Qe.visible = !a;
  });
  let _a = false, ka;
  $.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Zn) return;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const f = new E(...t.points.rawVal[o[0].index]), i = new E(...s[0].point), l = f.sub(i), d = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      d.transformDirection(ee.matrixWorld), Math.abs(l.dot(d)) < 1e-4 && (a = true);
    }
    if (a && Zn < 5 && (_a = true, k.enabled = false, ka = o[0].index), !_a || Zn % 2 !== 0) return;
    const r = [...t.points.rawVal];
    if (ka !== void 0) {
      let f = s[0].point;
      (e.ctrlKey || e.metaKey) && (f = new E(Math.round(f.x), Math.round(f.y), Math.round(f.z))), r[ka] = f.toArray();
    }
    t.points.val = r;
  }), $.addEventListener("pointerup", () => {
    k.enabled = true, _a = false;
  }), $.addEventListener("contextmenu", (e) => {
    var _a3;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const i = new E(...t.points.rawVal[o[0].index]), l = new E(...s[0].point), d = i.sub(l), c = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      c.transformDirection(ee.matrixWorld), Math.abs(d.dot(c)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const r = [...t.points.rawVal];
    if (r.splice(o[0].index, 1), t.points.val = r, !t.polylines) return;
    const f = t.polylines.rawVal.map((i) => i.filter((l) => l !== o[0].index)).map((i) => i.map((l) => l > o[0].index ? l - 1 : l)).filter((i) => i.length);
    f.push([]), t.polylines.val = f;
  });
}
function al(t, w, g) {
  const F = Math.round(14.999999999999998), A = { position: t.position.clone(), quaternion: t.quaternion.clone() }, $ = setInterval(L, 1e3 / 30);
  let z = 0;
  function L() {
    z++;
    const Y = z / F;
    t.position.lerpVectors(A.position, w.position, Y), t.quaternion.slerpQuaternions(A.quaternion, w.quaternion, Y), g && g(), z == F && clearInterval($);
  }
}
function sl(t, w, g, v) {
  const k = Ti(g, t.elements, v);
  return ue.derive(() => {
    k.visible = w.shellResults.val != "none";
  }), k;
}
const il = 6, $a = 10, ll = 0.012;
function rl(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function cl(t, w, g, v) {
  if (!g && !v) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && g) {
    const F = g[t];
    if (F && F.has(w)) return F.get(w);
  }
  return null;
}
function dl(t, w, g, v) {
  const k = new ut(), F = new Ts();
  F.setColorMap("rainbow");
  const A = new un(), $ = ue.state([]);
  return ue.derive(() => {
    var _a, _b, _c;
    w.deformedShape.val;
    const z = g.val, L = ((_a = t.elements) == null ? void 0 : _a.val) ?? [], Y = rl(w.frameResults.val);
    if (k.children.forEach((D) => {
      D.geometry && D.geometry.dispose(), D.material && D.material.dispose();
    }), k.clear(), !Y || L.length === 0 || z.length === 0) {
      $.val = [];
      return;
    }
    const N = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, ee = (_c = t.deformOutputs) == null ? void 0 : _c.val, U = [], we = [];
    for (let D = 0; D < L.length; D++) {
      if (L[D].length !== 2) continue;
      const fe = cl(Y, D, N, ee);
      fe && (U.push(fe[0], fe[1]), we.push({ idx: D, vals: fe }));
    }
    if (U.length === 0) {
      $.val = [];
      return;
    }
    const j = Math.min(...U), q = Math.max(...U);
    F.setMin(j), F.setMax(q), $.val = U;
    const ae = [1 / 0, 1 / 0, 1 / 0], ie = [-1 / 0, -1 / 0, -1 / 0];
    for (const D of z) for (let H = 0; H < 3; H++) ae[H] = Math.min(ae[H], D[H]), ie[H] = Math.max(ie[H], D[H]);
    const me = Math.max(ie[0] - ae[0], ie[1] - ae[1], ie[2] - ae[2], 1) * ll, ye = [], de = [], K = [];
    let Z = 0;
    for (const { idx: D, vals: H } of we) {
      const fe = L[D], he = z[fe[0]], oe = z[fe[1]];
      if (!he || !oe) continue;
      const W = new E(oe[0] - he[0], oe[1] - he[1], oe[2] - he[2]), Me = W.length();
      if (Me < 1e-10) continue;
      W.normalize();
      const te = Math.abs(W.y) < 0.99 ? new E(0, 1, 0) : new E(1, 0, 0), Ie = new E().crossVectors(W, te).normalize(), ge = new E().crossVectors(W, Ie).normalize(), ve = $a + 1, Pe = il;
      for (let Xe = 0; Xe < ve; Xe++) {
        const Ae = Xe / $a, nt = he[0] + W.x * Me * Ae, st = he[1] + W.y * Me * Ae, Ue = he[2] + W.z * Me * Ae, B = H[0] + (H[1] - H[0]) * Ae, J = F.getColor(B) ?? new un(0, 0, 0);
        A.copy(J).convertSRGBToLinear();
        for (let re = 0; re < Pe; re++) {
          const le = re / Pe * Math.PI * 2, _e = Math.cos(le), Ce = Math.sin(le);
          ye.push(nt + (Ie.x * _e + ge.x * Ce) * me, st + (Ie.y * _e + ge.y * Ce) * me, Ue + (Ie.z * _e + ge.z * Ce) * me), de.push(A.r, A.g, A.b);
        }
      }
      for (let Xe = 0; Xe < $a; Xe++) for (let Ae = 0; Ae < Pe; Ae++) {
        const nt = (Ae + 1) % Pe, st = Z + Xe * Pe + Ae, Ue = Z + Xe * Pe + nt, B = Z + (Xe + 1) * Pe + Ae, J = Z + (Xe + 1) * Pe + nt;
        K.push(st, Ue, J), K.push(st, J, B);
      }
      Z += ve * Pe;
    }
    if (ye.length === 0) return;
    const T = new Ve();
    T.setAttribute("position", new Dt(ye, 3)), T.setAttribute("color", new Dt(de, 3)), T.setIndex(K), T.computeVertexNormals();
    const G = new xt({ vertexColors: true, side: Rt }), X = new ct(T, G);
    X.frustumCulled = false, k.add(X);
  }), k.__colorMapValues = $, k;
}
function ul() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const pl = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, fl = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, hl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function $t(t, w = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(w) : t.toFixed(w);
}
const ml = 16755200, Ps = 56831, wl = 56831, yl = 56831, Jo = 65382;
function xl(t) {
  const w = new ut();
  w.name = "__hekatan_hover", w.renderOrder = 99;
  const g = new ro(1, 16, 16), v = new xt({ color: ml, transparent: true, opacity: 0.85, depthTest: false }), k = new ct(g, v);
  k.visible = false, k.renderOrder = 100, w.add(k);
  const F = new Ve(), A = new mt({ color: Ps, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), $ = new on(F, A);
  $.visible = false, $.renderOrder = 100, w.add($);
  const z = new xt({ color: Ps, transparent: true, opacity: 0.7, depthTest: false }), L = new ct(new Ms(1, 1, 1, 12), z);
  L.visible = false, L.renderOrder = 100, w.add(L);
  const Y = new Ve(), N = new xt({ color: wl, transparent: true, opacity: 0.45, side: Rt, depthTest: false }), ee = new ct(Y, N);
  ee.visible = false, ee.renderOrder = 100, w.add(ee);
  const U = new Ve(), we = new mt({ color: yl, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), j = new on(U, we);
  j.visible = false, j.renderOrder = 100, w.add(j);
  const q = new xt({ color: Jo, transparent: true, opacity: 0.95, depthTest: false }), ae = new xt({ color: Jo, transparent: true, opacity: 0.85, depthTest: false }), ie = new Ms(1, 1, 1, 12), xe = new xt({ color: Jo, transparent: true, opacity: 0.55, side: Rt, depthTest: false }), me = new mt({ color: Jo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), ye = [];
  window.__hekatanModelSelection = ye;
  const de = new ut();
  de.renderOrder = 101, w.add(de);
  let K = null;
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function T(B) {
    const J = t.derivedNodes.rawVal;
    return !J || B < 0 || B >= J.length ? null : new E(J[B][0], J[B][1], J[B][2]);
  }
  function G(B, J) {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o2, _p, _q, _r, _s2, _t;
    const re = t.getActiveCamera();
    if (!re || !t.mesh) return null;
    const le = t.rendererElm.getBoundingClientRect(), _e = B - le.left, Ce = J - le.top, Ye = t.derivedNodes.rawVal, Le = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (!Ye || !Le) return null;
    const Qe = /* @__PURE__ */ new Map(), Ke = (je) => {
      if (Qe.has(je)) return Qe.get(je);
      const Ee = T(je);
      if (!Ee) return Qe.set(je, null), null;
      const De = Ee.clone().project(re), We = (De.x * 0.5 + 0.5) * le.width, Be = (-De.y * 0.5 + 0.5) * le.height, at = { x: We, y: Be, z: De.z };
      return Qe.set(je, at), at;
    }, ze = /* @__PURE__ */ new Set();
    for (const je of Le) if (je) for (const Ee of je) ze.add(Ee);
    const Ne = 8;
    let qe = -1, lt = Ne;
    for (let je = 0; je < Ye.length; je++) {
      if (!ze.has(je)) continue;
      const Ee = Ke(je);
      if (!Ee || Ee.z < -1 || Ee.z > 1) continue;
      const De = Ee.x - _e, We = Ee.y - Ce, Be = Math.sqrt(De * De + We * We);
      Be < lt && (lt = Be, qe = je);
    }
    const et = ul(), Mt = fl[et.dispUnit] ?? 1e3, gt = pl[et.forceUnit] ?? 1;
    if (qe >= 0) {
      const je = Ye[qe];
      let Ee = `Nodo ${qe}
(${je[0].toFixed(3)}, ${je[1].toFixed(3)}, ${je[2].toFixed(3)})`;
      const De = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (De == null ? void 0 : De.deformations) {
        const We = De.deformations.get(qe);
        if (We && (Ee += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ee += `
Ux = ${$t(We[0] * Mt, 3)} ${et.dispUnit}`, Ee += `
Uy = ${$t(We[1] * Mt, 3)} ${et.dispUnit}`, Ee += `
Uz = ${$t(We[2] * Mt, 3)} ${et.dispUnit}`, (Math.abs(We[3]) > 1e-9 || Math.abs(We[4]) > 1e-9 || Math.abs(We[5]) > 1e-9) && (Ee += `
Rx = ${$t(We[3] * 1e3, 3)} mrad`, Ee += `
Ry = ${$t(We[4] * 1e3, 3)} mrad`, Ee += `
Rz = ${$t(We[5] * 1e3, 3)} mrad`)), De.reactions) {
          const Be = De.reactions.get(qe);
          Be && (Math.abs(Be[0]) > 1e-9 || Math.abs(Be[1]) > 1e-9 || Math.abs(Be[2]) > 1e-9 || Math.abs(Be[3]) > 1e-6 || Math.abs(Be[4]) > 1e-6 || Math.abs(Be[5]) > 1e-6) && (Ee += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ee += `
Fx = ${$t(Be[0] * gt)} ${et.forceUnit}`, Ee += `
Fy = ${$t(Be[1] * gt)} ${et.forceUnit}`, Ee += `
Fz = ${$t(Be[2] * gt)} ${et.forceUnit}`, (Math.abs(Be[3]) > 1e-6 || Math.abs(Be[4]) > 1e-6 || Math.abs(Be[5]) > 1e-6) && (Ee += `
Mx = ${$t(Be[3] * gt)} ${et.forceUnit}\xB7m`, Ee += `
My = ${$t(Be[4] * gt)} ${et.forceUnit}\xB7m`, Ee += `
Mz = ${$t(Be[5] * gt)} ${et.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: qe, info: Ee };
    }
    const mn = 5;
    let St = -1, Re = mn, ot = "frame";
    for (let je = 0; je < Le.length; je++) {
      const Ee = Le[je];
      if (!(!Ee || Ee.length < 2)) {
        if (Ee.length === 2) {
          const De = Ke(Ee[0]), We = Ke(Ee[1]);
          if (!De || !We || De.z < -1 || De.z > 1 || We.z < -1 || We.z > 1) continue;
          const Be = gl(_e, Ce, De.x, De.y, We.x, We.y);
          Be < Re && (Re = Be, St = je, ot = "frame");
        } else if (Ee.length === 3 || Ee.length === 4) {
          const De = [];
          let We = true;
          for (const Be of Ee) {
            const at = Ke(Be);
            if (!at || at.z < -1 || at.z > 1) {
              We = false;
              break;
            }
            De.push(at);
          }
          if (!We) continue;
          if (bl(_e, Ce, De)) {
            const at = De.reduce((it, ft) => it + ft.z, 0) / De.length * 1e-3;
            at < Re && (Re = at, St = je, ot = "shell");
          }
        } else if (Ee.length === 8) {
          const De = [];
          let We = true;
          for (const tt of Ee) {
            const rt = Ke(tt);
            if (!rt || rt.z < -1 || rt.z > 1) {
              We = false;
              break;
            }
            De.push(rt);
          }
          if (!We) continue;
          const Be = Math.min(...De.map((tt) => tt.x)), at = Math.max(...De.map((tt) => tt.x)), it = Math.min(...De.map((tt) => tt.y)), ft = Math.max(...De.map((tt) => tt.y));
          if (_e >= Be && _e <= at && Ce >= it && Ce <= ft) {
            const rt = De.reduce((Lt, dt) => Lt + dt.z, 0) / De.length * 1e-3;
            rt < Re && (Re = rt, St = je, ot = "solid");
          }
        }
      }
    }
    if (St >= 0) {
      const je = Le[St];
      let De = `${ot === "frame" ? "Frame" : ot === "shell" ? "Shell" : "Solid"} ${St}`;
      const We = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Be = (_g = (_f = We == null ? void 0 : We.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, St);
      if (Be) {
        Be.name && (De += `
  \u{1F4CB} ${Be.name}`), Be.shape && (De += `
  Shape: ${Be.shape}`);
        const at = /concrete|hormig|rect.*sólida/i.test(Be.shape || ""), it = at ? 100 : 1e3, ft = at ? "cm" : "mm", tt = (Lt) => {
          const dt = Lt * it;
          return Math.abs(dt - Math.round(dt)) < 0.05 ? `${Math.round(dt)}` : `${dt.toFixed(1)}`;
        }, rt = [];
        if (Be.D != null && rt.push(`D=${tt(Be.D)}`), Be.B != null && rt.push(`B=${tt(Be.B)}`), Be.TF != null && rt.push(`TF=${tt(Be.TF)}`), Be.TW != null && rt.push(`TW=${tt(Be.TW)}`), Be.t != null && rt.push(`t=${tt(Be.t)}`), rt.length && (De += `
  Dim: ${rt.join(" ")} ${ft}`), Be.material) {
          let Lt = Be.material;
          Be.fillMaterial && (Lt += ` + FILL "${Be.fillMaterial}"`), De += `
  Mat: ${Lt}`;
        }
      } else {
        const at = (_i2 = (_h = We == null ? void 0 : We.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, St), it = (_k = (_j = We == null ? void 0 : We.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, St);
        at ? (De += `
  ${at}`, it && !at.includes(it) && (De += `  (${it})`)) : it && (De += `
  Material: ${it}`);
      }
      if (De += `
nodos: [${je.join(", ")}]`, ot === "shell" && ((_l2 = t.mesh) == null ? void 0 : _l2.analyzeOutputs)) {
        const at = t.mesh.analyzeOutputs.rawVal, it = hl[et.stressUnit] ?? 1, ft = [["bendingXX", "Mxx", gt, `${et.forceUnit}\xB7m/m`], ["bendingYY", "Myy", gt, `${et.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", gt, `${et.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", gt, `${et.forceUnit}/m`], ["membraneYY", "Nyy", gt, `${et.forceUnit}/m`], ["membraneXY", "Nxy", gt, `${et.forceUnit}/m`], ["shearX", "Qx", gt, `${et.forceUnit}/m`], ["shearY", "Qy", gt, `${et.forceUnit}/m`], ["vonMises", "\u03C3VM", it, et.stressUnit], ["pressure", "p", it, et.stressUnit]], tt = [];
        for (const [rt, Lt, dt, Ht] of ft) {
          const Pt = at == null ? void 0 : at[rt];
          if (Pt && Pt instanceof Map) {
            const Zt = Pt.get(St);
            if (Zt != null) {
              if (typeof Zt == "number") tt.push(`${Lt} = ${$t(Zt * dt, 3)} ${Ht}`);
              else if (Array.isArray(Zt)) {
                let an = Zt[0];
                for (const Ct of Zt) Math.abs(Ct) > Math.abs(an) && (an = Ct);
                tt.push(`${Lt} = ${$t(an * dt, 3)} ${Ht}`);
              }
            }
          }
        }
        tt.length > 0 && (De += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + tt.slice(0, 8).join(`
`));
      }
      if (ot === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
        const at = t.mesh.deformOutputs.rawVal, it = t.mesh.elementInputs.rawVal, ft = at == null ? void 0 : at.deformations;
        if (ft && je.length === 2) {
          const tt = ft.get(je[0]), rt = ft.get(je[1]), Lt = ((_n = t.mesh.nodes) == null ? void 0 : _n.rawVal) ?? Ye, dt = Lt[je[0]], Ht = Lt[je[1]];
          if (tt && rt && dt && Ht) {
            const Pt = Ht[0] - dt[0], Zt = Ht[1] - dt[1], an = Ht[2] - dt[2], Ct = Math.sqrt(Pt * Pt + Zt * Zt + an * an);
            if (Ct > 1e-9) {
              const zo = Pt / Ct, qt = Zt / Ct, Nn = an / Ct, Pn = (rt[0] - tt[0]) * zo + (rt[1] - tt[1]) * qt + (rt[2] - tt[2]) * Nn, wn = ((_o2 = it.elasticities) == null ? void 0 : _o2.get(St)) ?? 0, Yn = ((_p = it.areas) == null ? void 0 : _p.get(St)) ?? 0, Jn = ((_q = it.momentsOfInertiaY) == null ? void 0 : _q.get(St)) ?? 0, aa = ((_r = it.momentsOfInertiaZ) == null ? void 0 : _r.get(St)) ?? 0, Gt = ((_s2 = it.torsionalConstants) == null ? void 0 : _s2.get(St)) ?? 0, co = ((_t = it.shearModuli) == null ? void 0 : _t.get(St)) ?? wn / 2.6, Xn = wn * Yn * (Pn / Ct), On = (rt[3] - tt[3]) * zo + (rt[4] - tt[4]) * qt + (rt[5] - tt[5]) * Nn, Un = co * Gt * (On / Ct), yn = rt[4] - tt[4], uo = rt[5] - tt[5], Jt = wn * Jn * yn / Ct, jt = wn * aa * uo / Ct;
              De += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, De += `
L = ${$t(Ct, 3)} m`, De += `
\u0394L = ${$t(Pn * Mt, 3)} ${et.dispUnit}`, De += `
\u03B5 = ${$t(Pn / Ct, 6)}`, Math.abs(Xn) > 1e-6 && (De += `
N \u2248 ${$t(Xn * gt)} ${et.forceUnit}`), Math.abs(Un) > 1e-6 && (De += `
T \u2248 ${$t(Un * gt)} ${et.forceUnit}\xB7m`), Math.abs(Jt) > 1e-6 && (De += `
My \u2248 ${$t(Jt * gt)} ${et.forceUnit}\xB7m`), Math.abs(jt) > 1e-6 && (De += `
Mz \u2248 ${$t(jt * gt)} ${et.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: ot, idx: St, info: De };
    }
    return null;
  }
  function X(B, J, re) {
    var _a, _b, _c;
    if (k.visible = false, $.visible = false, L.visible = false, ee.visible = false, j.visible = false, !B || !t.mesh) {
      Z.style.display = "none", t.render();
      return;
    }
    const le = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (B.type === "node") {
      const Le = T(B.idx);
      if (Le) {
        const Qe = t.derivedNodes.rawVal ?? [];
        let Ke = 1;
        if (Qe.length >= 2) {
          let qe = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const et of Qe) for (let Mt = 0; Mt < 3; Mt++) et[Mt] < qe[Mt] && (qe[Mt] = et[Mt]), et[Mt] > lt[Mt] && (lt[Mt] = et[Mt]);
          Ke = Math.max(lt[0] - qe[0], lt[1] - qe[1], lt[2] - qe[2], 0.1);
        }
        const ze = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Ne = 0.021 * Ke * ze;
        k.position.copy(Le), k.scale.setScalar(Ne), k.visible = true;
      }
    } else if (B.type === "frame" && le) {
      const Le = le[B.idx], Qe = T(Le[0]), Ke = T(Le[1]);
      if (Qe && Ke) {
        const ze = Qe.clone().add(Ke).multiplyScalar(0.5), Ne = Ke.clone().sub(Qe), qe = Ne.length(), lt = Math.max(1e-4, 3.5 * Xe(ze));
        L.position.copy(ze);
        const et = new E(0, 1, 0), Mt = et.clone().cross(Ne).normalize(), gt = et.angleTo(Ne);
        L.quaternion.setFromAxisAngle(Mt, gt), L.scale.set(lt, qe, lt), L.visible = true;
      }
    } else if (B.type === "shell" && le) {
      const Le = le[B.idx], Qe = [], Ke = [];
      for (const ze of Le) {
        const Ne = T(ze);
        if (!Ne) return;
        Qe.push(Ne.x, Ne.y, Ne.z);
      }
      Le.length === 4 ? Ke.push(0, 1, 2, 0, 2, 3) : Le.length === 3 && Ke.push(0, 1, 2), Y.setAttribute("position", new Dt(Qe, 3)), Y.setIndex(Ke), Y.computeVertexNormals(), ee.visible = true;
    } else if (B.type === "solid" && le) {
      const Le = le[B.idx], Qe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ke = [];
      for (const [ze, Ne] of Qe) {
        const qe = T(Le[ze]), lt = T(Le[Ne]);
        qe && lt && Ke.push(qe.x, qe.y, qe.z, lt.x, lt.y, lt.z);
      }
      U.setAttribute("position", new Dt(Ke, 3)), j.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", t.render();
      return;
    }
    Z.textContent = B.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const Ce = t.rendererElm.getBoundingClientRect(), Ye = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Ce;
    Z.style.left = `${J - Ye.left}px`, Z.style.top = `${re - Ye.top}px`, t.render();
  }
  let D = "", H = 0, fe = 0;
  const he = window.__hekatanHoverDebug ?? false, oe = (B) => {
    H && cancelAnimationFrame(H), H = requestAnimationFrame(() => {
      var _a, _b, _c;
      const J = G(B.clientX, B.clientY);
      if (he && fe < 5) {
        const le = t.derivedNodes.rawVal, _e = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${B.clientX}, ${B.clientY}) nodes=${(le == null ? void 0 : le.length) ?? 0} elems=${(_e == null ? void 0 : _e.length) ?? 0} hover=`, J), fe++;
      }
      const re = J ? `${J.type}:${J.idx}` : "";
      if (re !== D) D = re, X(J, B.clientX, B.clientY);
      else if (J) {
        const le = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        Z.style.left = `${B.clientX - le.left}px`, Z.style.top = `${B.clientY - le.top}px`;
      }
    });
  };
  let W = null;
  const Me = () => {
    D = "", k.visible = false, $.visible = false, L.visible = false, ee.visible = false, j.visible = false, Z.style.display = "none", t.render();
  }, te = (B) => {
    const J = t.rendererElm.getBoundingClientRect(), re = B.clientX - J.left, le = B.clientY - J.top;
    (re < -2 || le < -2 || re > J.width + 2 || le > J.height + 2) && (W && clearTimeout(W), W = window.setTimeout(Me, 200));
  }, Ie = () => {
    W && (clearTimeout(W), W = null);
  };
  t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", te), t.rendererElm.addEventListener("pointerenter", Ie);
  function ge() {
    var _a, _b, _c;
    const B = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    return B === "select" || B === "none" || !B;
  }
  let ve = null;
  t.rendererElm.addEventListener("pointerdown", (B) => {
    B.button === 0 && (ve = { x: B.clientX, y: B.clientY });
  }), t.rendererElm.addEventListener("pointerup", (B) => {
    if (B.button !== 0 || !ve) return;
    const J = B.clientX - ve.x, re = B.clientY - ve.y;
    if (ve = null, J * J + re * re > 9 || !ge()) return;
    const le = G(B.clientX, B.clientY);
    le ? (st({ type: le.type, idx: le.idx }, B.shiftKey), nt()) : Ue();
  }), window.addEventListener("keydown", (B) => {
    if (B.key !== "Escape" || !ye.length) return;
    const J = document.activeElement, re = !!J && (J.id === "hk3-cmd-input" || J.id === "hk-dyn-input") && J.value === "";
    J && (J.tagName === "INPUT" || J.tagName === "TEXTAREA" || J.isContentEditable) && !re || Ue();
  }, { capture: true });
  function Pe() {
    for (const B of de.children.slice()) {
      de.remove(B);
      const J = B.geometry;
      J && J !== g && J !== ie && J.dispose();
    }
  }
  const Xe = (B) => {
    var _a;
    const J = t.getActiveCamera(), re = ((_a = t.rendererElm) == null ? void 0 : _a.clientHeight) || 700;
    return J.isOrthographicCamera ? (J.top - J.bottom) / (J.zoom || 1) / re : 2 * J.position.distanceTo(B) * Math.tan((J.fov || 50) * Math.PI / 180 / 2) / re;
  };
  function Ae(B, J) {
    var _a, _b;
    const re = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
    if (B.type === "node") {
      const le = T(B.idx);
      if (!le) return;
      const _e = new ct(g, q);
      _e.position.copy(le), _e.scale.setScalar(Math.max(1e-4, 7 * Xe(le))), _e.renderOrder = 101, de.add(_e);
    } else if (B.type === "frame" && re) {
      const le = re[B.idx], _e = T(le[0]), Ce = T(le[1]);
      if (!_e || !Ce) return;
      const Ye = _e.clone().add(Ce).multiplyScalar(0.5), Le = Ce.clone().sub(_e), Qe = Le.length(), Ke = Math.max(1e-4, 4 * Xe(Ye)), ze = new ct(ie, ae);
      ze.position.copy(Ye);
      const Ne = new E(0, 1, 0);
      ze.quaternion.setFromAxisAngle(Ne.clone().cross(Le).normalize(), Ne.angleTo(Le)), ze.scale.set(Ke, Qe, Ke), ze.renderOrder = 101, de.add(ze);
    } else if (B.type === "shell" && re) {
      const le = re[B.idx], _e = [], Ce = [];
      for (const Qe of le) {
        const Ke = T(Qe);
        if (!Ke) return;
        _e.push(Ke.x, Ke.y, Ke.z);
      }
      le.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : le.length === 3 && Ce.push(0, 1, 2);
      const Ye = new Ve();
      Ye.setAttribute("position", new Dt(_e, 3)), Ye.setIndex(Ce), Ye.computeVertexNormals();
      const Le = new ct(Ye, xe);
      Le.renderOrder = 101, de.add(Le);
    } else if (B.type === "solid" && re) {
      const le = re[B.idx], _e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Qe, Ke] of _e) {
        const ze = T(le[Qe]), Ne = T(le[Ke]);
        ze && Ne && Ce.push(ze.x, ze.y, ze.z, Ne.x, Ne.y, Ne.z);
      }
      const Ye = new Ve();
      Ye.setAttribute("position", new Dt(Ce, 3));
      const Le = new on(Ye, me);
      Le.renderOrder = 101, de.add(Le);
    }
  }
  function nt() {
    if (Pe(), !ye.length || !t.mesh) {
      t.render();
      return;
    }
    const B = t.derivedNodes.rawVal ?? [];
    if (B.length >= 2) {
      const J = [1 / 0, 1 / 0, 1 / 0], re = [-1 / 0, -1 / 0, -1 / 0];
      for (const le of B) for (let _e = 0; _e < 3; _e++) le[_e] < J[_e] && (J[_e] = le[_e]), le[_e] > re[_e] && (re[_e] = le[_e]);
      Math.max(re[0] - J[0], re[1] - J[1], re[2] - J[2], 0.1);
    }
    for (const J of ye) Ae(J);
    t.render();
  }
  function st(B, J) {
    const re = ye.findIndex((le) => le.type === B.type && le.idx === B.idx);
    re >= 0 ? ye.splice(re, 1) : J || ye.push(B), K = ye.length ? ye[ye.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: K } }));
  }
  function Ue() {
    ye.length = 0, K = null, nt();
  }
  return ue.derive(() => {
    t.derivedNodes.val, ye.length && nt();
  }), w;
}
function gl(t, w, g, v, k, F) {
  const A = k - g, $ = F - v, z = A * A + $ * $;
  if (z < 1e-9) {
    const we = t - g, j = w - v;
    return Math.sqrt(we * we + j * j);
  }
  let L = ((t - g) * A + (w - v) * $) / z;
  L = Math.max(0, Math.min(1, L));
  const Y = g + L * A, N = v + L * $, ee = t - Y, U = w - N;
  return Math.sqrt(ee * ee + U * U);
}
function bl(t, w, g) {
  let v = false;
  for (let k = 0, F = g.length - 1; k < g.length; F = k++) {
    const A = g[k].x, $ = g[k].y, z = g[F].x, L = g[F].y;
    $ > w != L > w && t < (z - A) * (w - $) / (L - $ + 1e-12) + A && (v = !v);
  }
  return v;
}
const dn = (t) => {
  if (!isFinite(t) || t === 0) return "0";
  const w = Math.abs(t);
  return w >= 1e-3 && w < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
};
function zs(t, w) {
  var _a, _b, _c, _d, _e, _f, _g;
  const g = ((_a = t.nodes) == null ? void 0 : _a.rawVal) ?? [], k = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[w];
  if (!k || k.length !== 2) throw new Error(`El elemento ${w} no es una barra (2 nudos).`);
  const F = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, A = (te) => {
    var _a2, _b2;
    return ((_b2 = (_a2 = F[te]) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, w)) ?? 0;
  }, $ = g[k[0]], z = g[k[1]], L = A("elasticities"), Y = A("shearModuli"), N = A("areas"), ee = A("momentsOfInertiaZ"), U = A("momentsOfInertiaY"), we = A("torsionalConstants");
  let j = A("shearAreasY"), q = A("shearAreasZ");
  const ae = Math.hypot(z[0] - $[0], z[1] - $[1], z[2] - $[2]), ie = j < -1e-15, xe = q < -1e-15;
  !ie && j < 1e-15 && N > 1e-15 && Y > 1e-15 && (j = 5 / 6 * N), !xe && q < 1e-15 && N > 1e-15 && Y > 1e-15 && (q = 5 / 6 * N);
  const me = !xe && q > 0 && Y > 0 ? 12 * L * ee / (Y * q * ae * ae) : 0, ye = !ie && j > 0 && Y > 0 ? 12 * L * U / (Y * j * ae * ae) : 0, de = L * N / ae, K = Y * we / ae, Z = 12 * L * ee / ae ** 3 / (1 + me), T = 6 * L * ee / ae ** 2 / (1 + me), G = 4 * L * ee / ae * (1 + me / 4) / (1 + me), X = 2 * L * ee / ae * (1 - me / 2) / (1 + me), D = 12 * L * U / ae ** 3 / (1 + ye), H = 6 * L * U / ae ** 2 / (1 + ye), fe = 4 * L * U / ae * (1 + ye / 4) / (1 + ye), he = 2 * L * U / ae * (1 - ye / 2) / (1 + ye);
  let oe = [[de, 0, 0, 0, 0, 0, -de, 0, 0, 0, 0, 0], [0, Z, 0, 0, 0, T, 0, -Z, 0, 0, 0, T], [0, 0, D, 0, -H, 0, 0, 0, -D, 0, -H, 0], [0, 0, 0, K, 0, 0, 0, 0, 0, -K, 0, 0], [0, 0, -H, 0, fe, 0, 0, 0, H, 0, he, 0], [0, T, 0, 0, 0, G, 0, -T, 0, 0, 0, X], [-de, 0, 0, 0, 0, 0, de, 0, 0, 0, 0, 0], [0, -Z, 0, 0, 0, -T, 0, Z, 0, 0, 0, -T], [0, 0, -D, 0, H, 0, 0, 0, D, 0, H, 0], [0, 0, 0, -K, 0, 0, 0, 0, 0, K, 0, 0], [0, 0, -H, 0, he, 0, 0, 0, H, 0, fe, 0], [0, T, 0, 0, 0, X, 0, -T, 0, 0, 0, G]];
  const W = (_e = (_d = F.partialFixitySprings) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, w);
  if (W) for (let te = 0; te < Math.min(12, W.length); te++) W[te] > 1e-12 && (oe[te][te] += W[te]);
  const Me = (_g = (_f = F.momentReleases) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, w);
  if (Me && Me.some(Boolean)) {
    const te = Me.length >= 12 ? Me.slice(0, 12).map((Ae, nt) => Ae ? nt : -1).filter((Ae) => Ae >= 0) : Me.slice(0, 6).map((Ae, nt) => Ae ? [3, 4, 5, 9, 10, 11][nt] : -1).filter((Ae) => Ae >= 0), Ie = [...Array(12).keys()].filter((Ae) => !te.includes(Ae)), ge = te.length, ve = te.map((Ae, nt) => [...te.map((st) => oe[Ae][st]), ...te.map((st, Ue) => nt === Ue ? 1 : 0)]);
    for (let Ae = 0; Ae < ge; Ae++) {
      let nt = Ae;
      for (let Ue = Ae + 1; Ue < ge; Ue++) Math.abs(ve[Ue][Ae]) > Math.abs(ve[nt][Ae]) && (nt = Ue);
      [ve[Ae], ve[nt]] = [ve[nt], ve[Ae]];
      const st = ve[Ae][Ae];
      for (let Ue = 0; Ue < 2 * ge; Ue++) ve[Ae][Ue] /= st;
      for (let Ue = 0; Ue < ge; Ue++) if (Ue !== Ae) {
        const B = ve[Ue][Ae];
        for (let J = 0; J < 2 * ge; J++) ve[Ue][J] -= B * ve[Ae][J];
      }
    }
    const Pe = ve.map((Ae) => Ae.slice(ge)), Xe = Array.from({ length: 12 }, () => Array(12).fill(0));
    for (const Ae of Ie) for (const nt of Ie) {
      let st = 0;
      for (let Ue = 0; Ue < ge; Ue++) for (let B = 0; B < ge; B++) st += oe[Ae][te[Ue]] * Pe[Ue][B] * oe[te[B]][nt];
      Xe[Ae][nt] = oe[Ae][nt] - st;
    }
    oe = Xe;
  }
  return { K: oe, L: ae, phiZ: me, phiY: ye };
}
function Cs(t, w) {
  var _a, _b, _c, _d, _e, _f, _g;
  const g = ((_a = t.nodes) == null ? void 0 : _a.rawVal) ?? [], k = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[w];
  if (!k || k.length !== 2) throw new Error(`El elemento ${w} no es una barra (2 nudos).`);
  const F = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, A = (we, j = 0) => {
    var _a2, _b2;
    return ((_b2 = (_a2 = F[we]) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, w)) ?? j;
  }, $ = g[k[0]], z = g[k[1]], L = (_e = (_d = F.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, w), Y = (_g = (_f = F.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, w), N = A("localAngles", 0), ee = [], U = (we = "") => ee.push(we);
  if (U("% ============================================================"), U(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${w + 1} (indice ${w} del motor)`), U("%  Generado por Hekatan Struct con los datos que recibe el motor."), U("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), U("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), U("% ============================================================"), U(), U("% --- Datos de la barra -------------------------------------------------"), U(`xi = [${$.map(dn).join(" ")}];      % nudo i (${k[0]})`), U(`xj = [${z.map(dn).join(" ")}];      % nudo j (${k[1]})`), U(`E  = ${dn(A("elasticities"))};      % modulo de elasticidad`), U(`G  = ${dn(A("shearModuli"))};      % modulo de cortante`), U(`A  = ${dn(A("areas"))};      % area`), U(`Iz = ${dn(A("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), U(`Iy = ${dn(A("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), U(`J  = ${dn(A("torsionalConstants"))};      % constante de torsion`), U(`AsY = ${dn(A("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), U(`AsZ = ${dn(A("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), N && U(`% ang = ${dn(N)} grados: gira la seccion en T, NO cambia esta matriz local.`), U(), U("L = sqrt(sum((xj - xi).^2));"), U(), U("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), U("bernY = AsY < 0;   bernZ = AsZ < 0;"), U("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), U("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), U("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), U("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), U(), U("EA_L = E*A/L;          % axial"), U("GJ_L = G*J/L;          % torsion"), U("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), U("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), U("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), U("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), U(), U("% --- Matriz local (misma disposicion que el C++) ----------------------"), U("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), U("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), U("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), U("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), U("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), U("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), U("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), U("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), U("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), U("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), U("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), U("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), Y && Y.some((we) => we > 1e-12) && (U(), U("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), U(`kres = [${Y.slice(0, 12).map(dn).join(" ")}];`), U("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), L && L.some(Boolean)) {
    const we = L.length >= 12 ? L.slice(0, 12).map((j, q) => j ? q + 1 : 0).filter(Boolean) : L.slice(0, 6).map((j, q) => j ? [4, 5, 6, 10, 11, 12][q] : 0).filter(Boolean);
    U(), U("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), U(`f = [${we.join(" ")}];              % GDL liberados`), U("r = setdiff(1:12, f);                % GDL que quedan"), U("Kc = zeros(12);"), U("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), U("K = Kc;");
  }
  return U(), U("% --- Resultado ---------------------------------------------------------"), U(`fprintf('Barra ${w + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), U("disp('K local (12x12):');"), U("disp(K);"), { nombre: `K_local_barra_${w + 1}.m`, texto: ee.join(`
`) + `
` };
}
const Ml = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, vl = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Dn = 1e-3;
function vo(t, w) {
  return w === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : w === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function _l(t, w) {
  const g = Math.abs(w[0] - t[0]);
  return Math.abs(w[1] - t[1]) < Dn ? { plano: "XZ", en: t[1] } : g < Dn ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function kl(t, w) {
  var _a, _b;
  let g = null, v = { plano: "XZ", en: 0 };
  const k = () => {
    var _a2, _b2;
    const K = ((_a2 = w == null ? void 0 : w.frameResults) == null ? void 0 : _a2.rawVal) ?? ((_b2 = w == null ? void 0 : w.frameResults) == null ? void 0 : _b2.val);
    return !K || K === "none" ? null : String(K).replace(/^contour:/, "");
  }, F = (K) => {
    var _a2, _b2;
    const Z = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], T = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Set();
    for (const X of T) {
      if (X.length !== 2) continue;
      const D = Z[X[0]], H = Z[X[1]];
      if (!D || !H) continue;
      const fe = vo(D, K), he = vo(H, K);
      Math.abs(fe.fuera - he.fuera) < Dn && G.add(Math.round(fe.fuera * 1e3) / 1e3);
    }
    return [...G].sort((X, D) => X - D);
  };
  function A(K) {
    var _a2, _b2;
    if (K == null ? void 0 : K.plano) v = { plano: K.plano, en: K.en ?? F(K.plano)[0] ?? 0 };
    else {
      const T = [...window.__hekatanModelSelection ?? []].reverse().find((D) => D.type === "frame"), G = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], X = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      T && X[T.idx] && G[X[T.idx][0]] && G[X[T.idx][1]] ? v = _l(G[X[T.idx][0]], G[X[T.idx][1]]) : v = { plano: "XZ", en: F("XZ")[0] ?? 0 };
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
      const D = document.createElement("style");
      D.id = "hk-d2-hidden-css", D.textContent = "#hk-diagrama-2d[hidden]{display:none !important;}", document.head.appendChild(D);
    }
    g.querySelector(".hk-d2-x").addEventListener("click", () => {
      g.hidden = true;
    });
    const K = g.querySelector(".hk-d2-plano"), Z = g.querySelector(".hk-d2-en");
    K.addEventListener("change", () => {
      v = { plano: K.value, en: F(K.value)[0] ?? 0 }, z();
    }), Z.addEventListener("change", () => {
      v.en = Number(Z.value), z();
    });
    const T = (D) => {
      const H = F(v.plano), fe = H.findIndex((oe) => Math.abs(oe - v.en) < Dn), he = Math.max(0, Math.min(H.length - 1, (fe < 0 ? 0 : fe) + D));
      H.length && (v.en = H[he], z());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => T(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => T(1));
    const G = g.querySelector(".hk-d2-bar");
    let X = null;
    G.addEventListener("pointerdown", (D) => {
      if (D.target.closest("select,button")) return;
      const H = g.getBoundingClientRect();
      X = { x: D.clientX, y: D.clientY, l: H.left, t: H.top }, g.style.transform = "none", g.style.left = H.left + "px", g.style.top = H.top + "px";
    }), window.addEventListener("pointermove", (D) => {
      !X || !g || (g.style.left = X.l + D.clientX - X.x + "px", g.style.top = X.t + D.clientY - X.y + "px");
    }), window.addEventListener("pointerup", () => {
      X = null;
    }), new ResizeObserver(() => {
      g && !g.hidden && z();
    }).observe(g);
  }
  function z() {
    var _a2, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const K = new Set(N && !N.hidden && ee >= 0 ? we(ee) : []), Z = g.querySelector(".hk-d2-svg"), T = g.querySelector(".hk-d2-tit"), G = g.querySelector(".hk-d2-pie"), X = g.querySelector(".hk-d2-plano"), D = g.querySelector(".hk-d2-en");
    X.value = v.plano;
    const H = F(v.plano), fe = v.plano === "XZ" ? "y" : v.plano === "YZ" ? "x" : "z", he = v.plano === "XY" ? "Planta" : "P\xF3rtico";
    D.innerHTML = H.map((Re, ot) => `<option value="${Re}" ${Math.abs(Re - v.en) < Dn ? "selected" : ""}>${he} ${ot + 1} \xB7 ${fe} = ${Re.toFixed(2)} m</option>`).join("");
    const oe = k(), W = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], Me = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], te = oe ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[oe] : null;
    Z.innerHTML = "";
    const Ie = Z.clientWidth || 880, ge = Z.clientHeight || 480, ve = [];
    if (Me.forEach((Re, ot) => {
      if (Re.length !== 2) return;
      const je = W[Re[0]], Ee = W[Re[1]];
      if (!je || !Ee) return;
      const De = vo(je, v.plano), We = vo(Ee, v.plano);
      Math.abs(De.fuera - v.en) < Dn && Math.abs(We.fuera - v.en) < Dn && ve.push({ i: ot, a: De, b: We });
    }), !ve.length) {
      G.textContent = "No hay barras en este plano.", T.textContent = "";
      return;
    }
    let Pe = 1 / 0, Xe = -1 / 0, Ae = 1 / 0, nt = -1 / 0;
    for (const Re of ve) for (const ot of [Re.a, Re.b]) Pe = Math.min(Pe, ot.u), Xe = Math.max(Xe, ot.u), Ae = Math.min(Ae, ot.v), nt = Math.max(nt, ot.v);
    const st = Xe - Pe || 1, Ue = nt - Ae || 1, B = 0.12 * Math.max(st, Ue), J = 46, re = Math.min((Ie - 2 * J) / (st + 2 * B), (ge - 2 * J) / (Ue + 2 * B)), le = (Ie - st * re) / 2, _e = (ge - Ue * re) / 2, Ce = (Re) => le + (Re - Pe) * re, Ye = (Re) => ge - (_e + (Re - Ae) * re), Le = "http://www.w3.org/2000/svg", Qe = (Re, ot, je) => {
      const Ee = document.createElementNS(Le, Re);
      for (const De in ot) Ee.setAttribute(De, String(ot[De]));
      return je != null && (Ee.textContent = je), Z.appendChild(Ee), Ee;
    }, Ke = /* @__PURE__ */ new Map();
    for (const Re of ve) {
      const ot = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Re.i)) ?? 0, je = vo(Ys(oe ?? "normals", Ns(W[Me[Re.i][0]], W[Me[Re.i][1]], ot)), v.plano), Ee = Math.hypot(je.u, je.v);
      Ke.set(Re.i, Ee > 0.3 ? [je.u / Ee, -je.v / Ee] : null);
    }
    const ze = ve.filter((Re) => !Ke.get(Re.i)).length;
    let Ne = 0;
    if (te) for (const Re of ve) {
      if (!Ke.get(Re.i)) continue;
      const ot = te instanceof Map ? te.get(Re.i) : te[Re.i];
      ot && (Ne = Math.max(Ne, Math.abs(ot[0] ?? 0), Math.abs(ot[1] ?? 0)));
    }
    const qe = 0.12 * Math.max(st, Ue) * re, lt = Ne > 0 ? qe / Ne : 0, et = oe === "bendingsY" || oe === "bendingsZ", Mt = (Re) => Math.abs(Re) >= 100 ? Re.toFixed(1) : Math.abs(Re) >= 10 ? Re.toFixed(2) : Re.toFixed(3), gt = [];
    for (const Re of ve) {
      const ot = Ce(Re.a.u), je = Ye(Re.a.v), Ee = Ce(Re.b.u), De = Ye(Re.b.v), We = Ke.get(Re.i), [Be, at] = We ?? [0, 0], it = te && We ? te instanceof Map ? te.get(Re.i) : te[Re.i] : null, [ft, tt] = it ? La(oe, it) : [0, 0];
      if (it && lt > 0) {
        const Ht = [ot + Be * ft * lt * 1, je + at * ft * lt * 1], Pt = [Ee + Be * tt * lt * 1, De + at * tt * lt * 1], Ct = ft + tt >= 0 ? "#3fa7d6" : "#d9534f";
        Qe("polygon", { points: `${ot},${je} ${Ht[0]},${Ht[1]} ${Pt[0]},${Pt[1]} ${Ee},${De}`, fill: Ct, "fill-opacity": 0.38, stroke: Ct, "stroke-width": 1.2 }), gt.push({ x: Ht[0] + Be * 12, y: Ht[1] + at * 12, t: Mt(ft), peso: Math.abs(ft) }), gt.push({ x: Pt[0] + Be * 12, y: Pt[1] + at * 12, t: Mt(tt), peso: Math.abs(tt) });
      }
      Qe("line", { x1: ot, y1: je, x2: Ee, y2: De, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), K.has(Re.i) && Qe("line", { x1: ot, y1: je, x2: Ee, y2: De, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const rt = Qe("line", { x1: ot, y1: je, x2: Ee, y2: De, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      rt.addEventListener("click", () => j(Re.i));
      const Lt = document.createElementNS(Le, "title");
      Lt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", rt.appendChild(Lt);
    }
    for (const Re of ve) for (const ot of [Re.a, Re.b]) v.plano !== "XY" && Math.abs(ot.v - Ae) < Dn && Qe("rect", { x: Ce(ot.u) - 6, y: Ye(ot.v), width: 12, height: 7, fill: "#b03a3a" });
    const mn = [];
    gt.sort((Re, ot) => ot.peso - Re.peso);
    for (const Re of gt) Re.peso < 0.02 * Ne || mn.some((ot) => Math.hypot(ot.x - Re.x, ot.y - Re.y) < 34) || (mn.push(Re), Qe("text", { x: Re.x, y: Re.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Re.t));
    const St = oe ? Ml[oe] ?? oe : "sin resultado";
    T.textContent = `${St} \xB7 ${v.plano === "XY" ? "planta" : "alzado"} ${v.plano} en ${fe} = ${v.en.toFixed(2)} m`, G.textContent = oe ? `${ve.length} barras en el plano \xB7 m\xE1ximo ${Mt(Ne)} ${vl[oe] ?? ""}` + (et ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ze ? ` \xB7 ${ze} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const L = () => {
    try {
      z();
    } catch {
    }
  };
  (w == null ? void 0 : w.frameResults) && ((_b = (_a = window.van) == null ? void 0 : _a.derive) == null ? void 0 : _b.call(_a, () => {
    w.frameResults.val, L();
  }));
  let Y = null;
  setInterval(() => {
    var _a2, _b2;
    const K = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal, Z = (_b2 = w == null ? void 0 : w.frameResults) == null ? void 0 : _b2.rawVal, T = [K, Z];
    if (!(Y && Y[0] === K && Y[1] === Z)) {
      Y = T, L();
      try {
        ae();
      } catch {
      }
    }
  }, 400);
  let N = null, ee = -1, U = "12";
  function we(K) {
    var _a2, _b2;
    const Z = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], T = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Map();
    T.forEach((fe, he) => {
      if (fe.length === 2) for (const oe of fe) G.has(oe) || G.set(oe, []), G.get(oe).push(he);
    });
    const X = (fe) => {
      const he = Z[T[fe][0]], oe = Z[T[fe][1]], W = [oe[0] - he[0], oe[1] - he[1], oe[2] - he[2]], Me = Math.hypot(W[0], W[1], W[2]) || 1;
      return W.map((te) => te / Me);
    }, D = (fe, he) => {
      const oe = X(fe), W = X(he);
      return Math.abs(oe[0] * W[0] + oe[1] * W[1] + oe[2] * W[2]) > 0.9999;
    }, H = [K];
    for (const fe of [0, 1]) {
      let he = K, oe = T[K][fe];
      for (let W = 0; W < 500; W++) {
        const Me = (G.get(oe) ?? []).filter((Ie) => Ie !== he);
        if (Me.length !== 1 || !D(he, Me[0])) break;
        const te = Me[0];
        fe === 0 ? H.unshift(te) : H.push(te), oe = T[te][0] === oe ? T[te][1] : T[te][0], he = te;
      }
    }
    return H;
  }
  function j(K) {
    if (K == null) {
      const T = [...window.__hekatanModelSelection ?? []].reverse().find((G) => G.type === "frame");
      if (!T) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      K = T.idx;
    }
    ee = K, N || (N = document.createElement("div"), N.id = "hk-diagrama-barra", N.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), N.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-k" title="Descarga un script MATLAB (Hekatan Lab / Octave) con la matriz de rigidez local 12\xD712 de esta barra" style="background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px;white-space:nowrap">\u{1F4C4} K local .m</button><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(N), N.querySelector(".hk-b-x").addEventListener("click", () => {
      N.hidden = true, q(), z();
    }), N.querySelector(".hk-b-k").addEventListener("click", () => {
      ee >= 0 && ie(ee);
    }), N.querySelector(".hk-b-pl").addEventListener("change", (Z) => {
      U = Z.target.value, ae();
    })), N.hidden = false, q(), ae(), z();
  }
  function q() {
    if (!g || !N) return;
    const K = window.innerWidth, Z = Math.min(560, Math.round(K * 0.4));
    N.style.width = Z + "px", !N.hidden && !g.hidden ? (g.style.transform = "none", g.style.left = "12px", g.style.width = K - Z - 36 + "px", N.style.top = g.getBoundingClientRect().top + "px") : g.hidden || (g.style.left = "50%", g.style.transform = "translateX(-50%)", g.style.width = "min(900px,92vw)");
  }
  function ae() {
    var _a2, _b2, _c;
    if (!N || N.hidden || ee < 0) return;
    const K = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], Z = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], T = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!Z[ee]) return;
    const G = we(ee), X = [];
    let D = 0, H = -1;
    G.forEach((Xe, Ae) => {
      const [nt, st] = Z[Xe], Ue = Ae === 0 ? G.length > 1 && Z[G[1]].includes(nt) : nt !== H, B = Ue ? st : nt, J = Ue ? nt : st, re = Math.hypot(K[J][0] - K[B][0], K[J][1] - K[B][1], K[J][2] - K[B][2]);
      X.push({ x: D, e: Xe, fin: Ue ? 1 : 0 }), D += re, X.push({ x: D, e: Xe, fin: Ue ? 0 : 1 }), H = J;
    });
    const fe = D, he = (Xe, Ae) => {
      const nt = T[Xe], st = nt ? nt instanceof Map ? nt.get(Ae.e) : nt[Ae.e] : null;
      return st ? La(Xe, st)[Ae.fin] : 0;
    }, oe = K[Z[G[0]][0]], W = (Xe) => Xe.toFixed(2);
    N.querySelector(".hk-b-tit").textContent = "L = " + fe.toFixed(2) + " m \xB7 " + G.length + " tramo(s) \xB7 desde (" + W(oe[0]) + ", " + W(oe[1]) + ", " + W(oe[2]) + ")";
    const Me = U === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], te = N.querySelector(".hk-b-cuerpo");
    te.innerHTML = "";
    const Ie = Math.max(300, te.clientWidth), ge = 124, ve = 46, Pe = (ge - 14) / 2;
    for (const [Xe, Ae, nt, st] of Me) {
      const Ue = X.map((Ne) => he(Xe, Ne)), B = Math.max(...Ue), J = Math.min(...Ue), re = Math.max(Math.abs(B), Math.abs(J)) || 1, le = (Ne) => ve + Ne / (fe || 1) * (Ie - 2 * ve), _e = (Ne) => Pe + (st ? 1 : -1) * (Ne / re) * (Pe - 16), Ce = (Ne) => Math.abs(Ne) >= 100 ? Ne.toFixed(1) : Math.abs(Ne) >= 10 ? Ne.toFixed(2) : Ne.toFixed(3);
      let Ye = le(0) + "," + Pe + " ";
      X.forEach((Ne, qe) => {
        Ye += le(Ne.x) + "," + _e(Ue[qe]) + " ";
      }), Ye += le(fe) + "," + Pe;
      const Le = Ue.indexOf(B), Qe = Ue.indexOf(J), Ke = (Ne, qe) => {
        const lt = _e(Ue[Ne]) + (_e(Ue[Ne]) < Pe ? -5 : 13);
        return '<text x="' + le(X[Ne].x) + '" y="' + lt + '" text-anchor="middle" fill="' + qe + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Ce(Ue[Ne]) + "</text>";
      }, ze = st ? "#d9534f" : "#3fa7d6";
      te.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Ae + ' <span style="color:#6f7d90;font-weight:400">(' + nt + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Ce(B) + " \xB7 m\xEDn " + Ce(J) + (st ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + Ie + '" height="' + ge + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + ve + '" y1="' + Pe + '" x2="' + (Ie - ve) + '" y2="' + Pe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Ye + '" fill="' + ze + '" fill-opacity=".35" stroke="' + ze + '" stroke-width="1.4"/>' + Ke(0, "#f2f5fa") + Ke(X.length - 1, "#f2f5fa") + (Le > 0 && Le < X.length - 1 ? Ke(Le, "#8fd3ff") : "") + (Qe > 0 && Qe < X.length - 1 && Qe !== Le ? Ke(Qe, "#ff9f9a") : "") + '<text x="' + ve + '" y="' + (ge - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (Ie - ve) + '" y="' + (ge - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + fe.toFixed(2) + " m</text></svg>");
    }
  }
  window.__hekatanDiagramaBarra = j;
  function ie(K) {
    const { nombre: Z, texto: T } = Cs(t, K), G = URL.createObjectURL(new Blob([T], { type: "text/plain" })), X = document.createElement("a");
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
    return Z && ie(K), Cs(t, K);
  };
  let xe = null, me = null, ye = -1;
  function de(K) {
    var _a2, _b2, _c, _d, _e;
    if (ye = K, !me) {
      me = document.createElement("div"), me.id = "hk-klocal", me.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(me);
      const oe = document.createElement("style");
      oe.textContent = "#hk-klocal[hidden]{display:none!important}", document.head.appendChild(oe);
    }
    let Z;
    try {
      Z = zs(t, K);
    } catch (oe) {
      alert(String(oe));
      return;
    }
    const T = (oe) => Math.abs(oe) < 1e-12 ? "0" : Math.abs(oe) >= 1e5 || Math.abs(oe) < 0.01 ? oe.toExponential(4) : oe.toPrecision(6), G = ((_a2 = t.elementInputs) == null ? void 0 : _a2.rawVal) ?? {}, X = (_c = (_b2 = G.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, K), D = (_e = (_d = G.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, K), H = [X && (X[0] > 1e-12 || X[1] > 1e-12) ? `brazos r\xEDgidos ${X[0]}\xB7L / ${X[1]}\xB7L (se aplican en K global: R\u1D40\xB7K\xB7R)` : "", D ? `ang ${D}\xB0 (gira T, no esta K)` : ""].filter(Boolean).join(" \xB7 "), fe = ["u1 i", "u2 i", "u3 i", "\u03B81 i", "\u03B82 i", "\u03B83 i", "u1 j", "u2 j", "u3 j", "\u03B81 j", "\u03B82 j", "\u03B83 j"], he = Z.K.map((oe, W) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${fe[W]}</th>` + oe.map((Me) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(Me) < 1e-12 ? "#4a5568" : Me < 0 ? "#ff9f9a" : "#e6edf5"}">${T(Me)}</td>`).join("") + "</tr>").join("");
    me.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${K + 1}</b><span style="color:#9fb0c6">L = ${Z.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${Z.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${Z.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${H ? ` \xB7 <b style="color:#f59e0b">${H}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${fe.map((oe) => `<th style="color:#9fb0c6;padding:2px 6px">${oe}</th>`).join("")}</tr>${he}</table></div>`, me.querySelector(".hk-k-x").addEventListener("click", () => {
      me.hidden = true;
    }), me.querySelector(".hk-k-m").addEventListener("click", () => ie(ye)), me.hidden = false;
  }
  return window.addEventListener("hk:model-selection", (K) => {
    var _a2;
    const Z = (_a2 = K.detail) == null ? void 0 : _a2.ultimo;
    xe || (xe = document.createElement("button"), xe.id = "hk-klocal-chip", xe.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(xe), xe.addEventListener("click", () => {
      const T = Number(xe.dataset.idx);
      T >= 0 && de(T);
    })), xe.hidden = true, Z && Z.type === "frame" && (xe.dataset.idx = String(Z.idx), xe.textContent = "\u{1F4D0} Ver K local \xB7 barra " + (Z.idx + 1), me && (me.hidden = true), xe.hidden = false);
  }), window.__hekatanKLocal = (K) => zs(t, K), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = A, { abrir: A, abrirBarra: j };
}
function As(t, w = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(w)), setTimeout(() => {
    ue.derive(() => {
      oa.val, g.style.background = Ii();
    });
  });
  const v = document.createElement("div");
  v.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(v), setTimeout(() => {
    ue.derive(() => {
      v.textContent = Ia.val ? `[${Ia.val}]` : "";
    });
  });
  const k = Array.from({ length: w + 1 }, (z, L) => L / w).reverse();
  let F, A;
  k.forEach((z, L) => {
    F = document.createElement("div"), F.id = `marker-${L}`, F.className = "marker", F.style.marginTop = L == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", A = document.createElement("p"), A.id = `marker-text-${L}`, F.append(A), g.append(F);
  });
  const $ = [];
  return g.querySelectorAll("p").forEach((z) => $.push(z)), setTimeout(() => {
    ue.derive(() => {
      k.forEach((z, L) => {
        const Y = $[L];
        Y && (Y.innerText = Sl(t.val, z).toString());
      });
    });
  }), g;
}
function Sl(t, w) {
  const g = Po.val;
  if (g) return Es(g[0] + w * (g[1] - g[0]));
  const v = t.filter((A) => Number.isFinite(A));
  if (v.length === 0) return "0";
  const [k, F] = Ta(v);
  return Es(k + w * (F - k));
}
function Es(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const w = Math.abs(t);
  return w < 1e-3 || w >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function Rl({ mesh: t, settingsObj: w, drawingObj: g, objects3D: v, solids: k }) {
  $i.DEFAULT_UP = new E(0, 0, 1);
  const F = document.createElement("div"), A = new Ci(), $ = new Ai(45, 1, 0.1, 2 * 1e6), z = new Ei(-10, 10, 10, -10, -1e3, 2e6);
  let L = $;
  const Y = new Fi({ antialias: true });
  Y.localClippingEnabled = true;
  const N = new _s($, Y.domElement);
  N.enableDamping = true, N.dampingFactor = 0.1, N.screenSpacePanning = true, N.zoomSpeed = 0.8, N.panSpeed = 1.2, N.rotateSpeed = 0.9, N.keyPanSpeed = 12, N.listenToKeyEvents(window), N.mouseButtons = { LEFT: null, MIDDLE: vs.ROTATE, RIGHT: vs.PAN }, N.touches = { ONE: Wo.ROTATE, TWO: Wo.DOLLY_PAN }, Y.domElement.addEventListener("wheel", (B) => {
    if (!B.ctrlKey && Math.abs(B.deltaX) > Math.abs(B.deltaY) * 1.5) {
      B.preventDefault();
      const J = N.target, re = new E().subVectors($.position, J), le = new E();
      le.crossVectors($.up, re).normalize();
      const Ce = re.length() * 1e-3 * N.panSpeed;
      J.addScaledVector(le, B.deltaX * Ce), $.position.addScaledVector(le, B.deltaX * Ce), N.update();
    }
  }, { passive: false });
  const ee = new ko(new E(-1, 0, 0), 0), U = new ko(new E(0, -1, 0), 0), we = new ko(new E(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function j() {
    const B = window.__hekatanClip, J = [];
    B.enableX && (ee.normal.set(B.invertX ? 1 : -1, 0, 0), ee.constant = B.invertX ? -B.posX : B.posX, J.push(ee)), B.enableY && (U.normal.set(0, B.invertY ? 1 : -1, 0), U.constant = B.invertY ? -B.posY : B.posY, J.push(U)), B.enableZ && (we.normal.set(0, 0, B.invertZ ? 1 : -1), we.constant = B.invertZ ? -B.posZ : B.posZ, J.push(we)), Y.clippingPlanes = J, A.traverse((le) => {
      const _e = le;
      if (_e.material) {
        const Ce = Array.isArray(_e.material) ? _e.material : [_e.material];
        for (const Ye of Ce) Ye.clippingPlanes = J, Ye.needsUpdate = true;
      }
    });
    const re = window.__hekatanPanes ?? [];
    for (const le of re) try {
      le && typeof le.refresh == "function" && le.refresh();
    } catch {
    }
    Y.render(A, L);
  }
  j(), window.__hekatanClipApply = j;
  const q = Di(w), ae = ue.derive(() => Math.pow(10, q.displayScale.val / 10)), ie = Pl(t, q), xe = () => {
    const B = [];
    return q.gridXY.rawVal && B.push("xy"), q.gridXZ.rawVal && B.push("xz"), q.gridYZ.rawVal && B.push("yz"), B;
  }, me = () => {
    const B = q.gridStep.rawVal, J = Math.max(B, q.gridMajor.rawVal);
    return { planes: xe(), majorStep: J, minorStep: B };
  };
  let ye = Ea(q.gridSize.rawVal, me());
  ye.visible = q.gridVisible.rawVal, window.__hekatanSnap2D = q.cursorSnap.rawVal;
  const de = () => {
    const B = Math.max(0, Math.min(1, q.gridOpacity.rawVal));
    ye.traverse((J) => {
      const re = J.material;
      if (!re || !("opacity" in re)) return;
      const le = J.name ?? "";
      let _e = 0.55;
      le.includes("border") ? _e = 1 : le.includes("major") && (_e = 0.95), re.opacity = B * _e;
    });
  };
  de(), F.appendChild(Ri(q, t, k)), F.setAttribute("id", "viewer"), F.appendChild(Y.domElement), Y.setPixelRatio(window.devicePixelRatio);
  const K = Hn();
  Y.setClearColor(K.background, 1);
  const Z = q.gridSize.rawVal, T = Z * 0.5 + Z * 0.5 / Math.tan(45 * 0.5);
  $.position.set(0, 0, T), $.up.set(0, 1, 0), N.target.set(0, 0, 0), N.minDistance = 0.1, N.maxDistance = 1e4, F.__settings = q, N.zoomSpeed = 1, N._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, N.update();
  let G = Ss(q.gridSize.rawVal, q.flipAxes.rawVal);
  A.add(ye, G), ue.derive(() => {
    window.__hekatanGridPlaneXY = q.gridXY.val, window.__hekatanGridPlaneXZ = q.gridXZ.val, window.__hekatanGridPlaneYZ = q.gridYZ.val;
  });
  let X = true;
  ue.derive(() => {
    const B = q.gridVisible.val;
    if (X) {
      X = false;
      return;
    }
    ye.visible = B, te();
  });
  let D = true;
  ue.derive(() => {
    if (q.gridOpacity.val, D) {
      D = false;
      return;
    }
    de(), te();
  }), ue.derive(() => {
    const B = q.cursorSnap.val;
    window.__hekatanSnap2D = B;
  });
  let H = true;
  ue.derive(() => {
    var _a, _b, _c;
    const B = q.gridSize.val, J = q.flipAxes.val;
    if (q.gridXY.val, q.gridXZ.val, q.gridYZ.val, q.gridStep.val, q.gridMajor.val, H) {
      H = false;
      return;
    }
    A.remove(ye), (_a = ye.traverse) == null ? void 0 : _a.call(ye, (Ce) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Ce.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), ye = Ea(B, me()), ye.visible = q.gridVisible.rawVal, A.add(ye), de(), A.remove(G), G.traverse((Ce) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Ce.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), G = Ss(B, J), A.add(G);
    const re = B * 0.5 + B * 0.5 / Math.tan(45 * 0.5);
    $.position.distanceTo(N.target);
    const le = Math.abs($.position.x) < 0.1 && Math.abs($.position.y) < 0.1 && $.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (le ? $.position.set(0, 0, re) : $.position.set(0.5 * B, -re, 0.5 * B), N.target.set(0, 0, 0)), N.minDistance = Math.max(0.05, B * 0.01), N.maxDistance = Math.max(50, B * 50), N.update(), te();
  }), new ResizeObserver((B) => {
    var _a, _b;
    for (const J of B) {
      const re = (_a = J.target) == null ? void 0 : _a.clientWidth, le = (_b = J.target) == null ? void 0 : _b.clientHeight;
      if (re === 0 || le === 0) continue;
      const Ce = (he ? re / 2 : re) / le;
      $.aspect = Ce, $.updateProjectionMatrix();
      const Ye = z.top;
      if (z.left = -Ye * Ce, z.right = Ye * Ce, z.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = Ce, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Le = oe, Qe = Le.top;
        Le.left = -Qe * Ce, Le.right = Qe * Ce, Le.updateProjectionMatrix();
      }
      Y.setSize(re, le), te();
    }
  }).observe(F), N.addEventListener("change", te), ue.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, q.displayScale.val, q.nodes.val, q.elements.val, (_g = q.edges) == null ? void 0 : _g.val, q.elemColumns.val, q.elemBeams.val, q.nodesIndexes.val, q.elementsIndexes.val, q.orientations.val, q.sections.val, q.secColumns.val, q.secBeams.val, q.secFloor.val, q.supports.val, q.loads.val, q.deformedShape.val, q.nodeResults.val, q.frameResults.val, q.shellResults.val, (_h = q.solidResults) == null ? void 0 : _h.val, (_i2 = q.extruded) == null ? void 0 : _i2.val, setTimeout(te);
  });
  let he = false, oe = null, W = null, Me = false;
  function te() {
    const B = F.clientWidth || 1, J = F.clientHeight || 1;
    if (!he || !oe) {
      Y.setScissorTest(false), Y.setViewport(0, 0, B, J), Y.render(A, L);
      return;
    }
    const re = B / 2;
    Y.setScissorTest(true), Y.setViewport(0, 0, re, J), Y.setScissor(0, 0, re, J), Y.render(A, L), Y.setViewport(re, 0, re, J), Y.setScissor(re, 0, re, J), Y.render(A, oe), Y.setScissorTest(false);
  }
  function Ie(B) {
    L = B, N.object = B, N.update(), te();
  }
  function ge(B, J) {
    he = B, J && (oe = J);
    const re = F.clientWidth || 1, le = F.clientHeight || 1, Ce = (B ? re / 2 : re) / le;
    $.isPerspectiveCamera && ($.aspect = Ce, $.updateProjectionMatrix());
    const Ye = z.top;
    if (z.left = -Ye * Ce, z.right = Ye * Ce, z.updateProjectionMatrix(), B && oe) {
      if (W ? (W.object = oe, W.update()) : (W = new _s(oe, Y.domElement), W.enableDamping = true, W.dampingFactor = 0.1, W.screenSpacePanning = true, W.zoomSpeed = 0.8, W.panSpeed = 1.2, W.rotateSpeed = 0.9, W.touches = { ONE: Wo.ROTATE, TWO: Wo.DOLLY_PAN }, W.target.copy(N.target), W.addEventListener("change", te), W.enabled = false), !Me) {
        const Le = (Qe) => {
          if (!he || !W) return;
          const Ke = Y.domElement.getBoundingClientRect(), ze = Qe.clientX - Ke.left, Ne = Ke.width / 2, qe = ze >= Ne;
          N.enabled = !qe, W.enabled = qe;
        };
        Y.domElement.addEventListener("pointerdown", Le, true), Y.domElement.addEventListener("wheel", Le, { capture: true, passive: true }), Me = true;
      }
    } else B || (N.enabled = true, W && (W.enabled = false));
    F.__splitMode = B, window.__hekatanSplitMode = B, window.__hekatanSplitCamera = B ? oe : null, te();
  }
  if (t) {
    A.add(Bi(q, ie, ae), Vi(t, q, ie), Xi(q, ie, ae), Ui(t, q, ie, ae), Ni(t, q, ie, ae), Yi(t, q, ie, ae), Gi(t, q, ie, ae), Wi(t, q, ie, ae), Qi(t, q, ie), nl(t, q, ie, ae), ji(t, q, ie, ae)), window.__hekatanDiagrama2D || (kl(t, q), Y.domElement.addEventListener("dblclick", () => {
      var _a;
      const Le = (_a = q.frameResults) == null ? void 0 : _a.rawVal;
      !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((Ke) => Ke.type === "frame") || setTimeout(() => {
        var _a2;
        return (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }, 60);
    }));
    const B = xl({ scene: A, rendererElm: Y.domElement, getActiveCamera: () => L, derivedNodes: ie, derivedDisplayScale: ae, mesh: t, settings: q, render: te });
    A.add(B);
    const J = $l(t, q), re = sl(t, q, ie, J), le = As(J);
    A.add(re), F.appendChild(le);
    const _e = dl(t, q, ie);
    A.add(_e);
    const Ce = _e.__colorMapValues, Ye = As(Ce);
    Ye.id = "frame-legend", F.appendChild(Ye), ue.derive(() => {
      var _a;
      const Le = q.shellResults.val != "none", Qe = (((_a = q.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", Ke = Le || Qe, ze = q.frameResults.val.startsWith("contour:"), Ne = J.val.some((qe) => Number.isFinite(qe));
      le.hidden = !Ke || !Ne, re.visible = Ke, Ye.hidden = !ze;
    });
  }
  if (k) {
    const B = new Ls(16777215, 0.5);
    A.add(B);
    const J = new ea(16777215, 0.5);
    J.position.set(30, 25, -10), J.shadow.mapSize.width = 1024, J.shadow.mapSize.height = 1024, A.add(J);
    const re = 10;
    J.shadow.camera.left = -re, J.shadow.camera.right = re, J.shadow.camera.top = re, J.shadow.camera.bottom = -re, J.shadow.camera.far = 1e3;
    const le = new ea(16777215, 0.5);
    le.color.setHSL(11, 43, 96), le.position.set(-10, 0, 30), A.add(le), ue.derive(() => {
      (k == null ? void 0 : k.val.length) && (A.remove(...k.oldVal), A.add(...k.rawVal), te());
    }), ue.derive(() => {
      k.rawVal.forEach((_e) => _e.visible = q.solids.val), te();
    });
  }
  if (v) {
    const B = [], J = (le) => {
      var _a;
      return ((_a = le == null ? void 0 : le.userData) == null ? void 0 : _a.isCota) ? q.showCotas.val : q.custom3D.val;
    }, re = () => {
      for (const le of B) le.visible = J(le);
      te();
    };
    ue.derive(() => {
      const le = v.val;
      B.length && (A.remove(...B), B.length = 0), le.length && (A.add(...le), B.push(...le), re(), Y.clippingPlanes.length && j()), te();
    }), ue.derive(() => {
      q.custom3D.val, re();
    }), ue.derive(() => {
      q.showCotas.val, re();
    });
  }
  g && ol({ drawingObj: g, gridObj: ye, scene: A, getActiveCamera: () => L, controls: N, gridSize: Z, derivedDisplayScale: ae, rendererElm: Y.domElement, viewerRender: te }), $s((B, J) => {
    var _a;
    Y.setClearColor(J.background, 1), A.remove(ye), (_a = ye.traverse) == null ? void 0 : _a.call(ye, (re) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = re.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), ye = Ea(q.gridSize.rawVal, { planes: xe() }), A.add(ye), F.style.setProperty("--awatif-legend-color", J.legendMarker), te();
  });
  const ve = { scene: A, perspCamera: $, orthoCamera: z, get camera() {
    return L;
  }, controls: N, renderer: Y, rendererElm: Y.domElement, render: te, setActiveCamera: Ie, setSplitMode: ge, get splitMode() {
    return he;
  }, get splitCamera() {
    return oe;
  }, settings: q };
  F.__ctx = ve;
  const Pe = document.createElement("div");
  Pe.id = "hk-nav-camara", Pe.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Xe = (B, J, re) => {
    const le = document.createElement("button");
    return le.textContent = B, le.title = J, le.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), le.onmouseenter = () => {
      le.style.background = "rgba(70,70,70,0.9)";
    }, le.onmouseleave = () => {
      le.style.background = "rgba(40,40,40,0.85)";
    }, le.onclick = (_e) => {
      _e.preventDefault(), re();
    }, le;
  }, Ae = (B, J) => {
    const re = N.target, le = new E().subVectors(L.position, re), _e = le.length(), Ce = new E(), Ye = new E();
    Ce.crossVectors(L.up, le).normalize(), Ye.copy(L.up).normalize();
    const Le = _e * 0.05;
    re.addScaledVector(Ce, -B * Le), re.addScaledVector(Ye, J * Le), L.position.addScaledVector(Ce, -B * Le), L.position.addScaledVector(Ye, J * Le), N.update(), te();
  }, nt = (B) => {
    const J = new E().subVectors(L.position, N.target);
    J.multiplyScalar(B), L.position.copy(N.target).add(J), N.update(), te();
  }, st = () => {
    const B = document.createElement("div");
    return B.style.cssText = "width:32px;height:32px;", B;
  };
  return Pe.append(st()), Pe.append(Xe("\u2191", "Pan arriba", () => Ae(0, 1))), Pe.append(Xe("\u2295", "Zoom in", () => nt(0.85))), Pe.append(Xe("\u2190", "Pan izquierda", () => Ae(-1, 0))), Pe.append(Xe("\u2302", "Reset vista", () => {
    N.reset(), te();
  })), Pe.append(Xe("\u2192", "Pan derecha", () => Ae(1, 0))), Pe.append(Xe("\u2296", "Zoom out", () => nt(1.18))), Pe.append(Xe("\u2193", "Pan abajo", () => Ae(0, -1))), Pe.append(st()), getComputedStyle(F).position === "static" && (F.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && F.appendChild(Pe), F;
}
function Pl(t, w) {
  return ue.derive(() => {
    var _a, _b, _c, _d;
    if (!w.deformedShape.val) return ((_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], v = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!v || g.length === 0) return g;
    const k = w.deformScale.val, F = w.deformScale.val * w.deformScaleZ.val, A = Number.isFinite(k) ? k : 1, $ = Number.isFinite(F) ? F : 1;
    return g.map((z, L) => {
      var _a2;
      const Y = ((_a2 = v.get(L)) == null ? void 0 : _a2.slice(0, 3)) ?? [0, 0, 0], N = Number.isFinite(Y[0]) ? Y[0] : 0, ee = Number.isFinite(Y[1]) ? Y[1] : 0, U = Number.isFinite(Y[2]) ? Y[2] : 0;
      return [z[0] + N * A, z[1] + ee * A, z[2] + U * $];
    });
  });
}
const Po = ue.state(null), Ia = ue.state(""), zl = ue.state("kN"), Cl = ue.state("mm"), Al = ue.state("kN/m\xB2"), El = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Fs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Fl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function $l(t, w) {
  const g = ue.state([]);
  let v;
  return ((k) => {
    k.bendingXX = "bendingXX", k.bendingYY = "bendingYY", k.bendingXY = "bendingXY", k.membraneXX = "membraneXX", k.membraneYY = "membraneYY", k.membraneXY = "membraneXY", k.tranverseShearX = "tranverseShearX", k.tranverseShearY = "tranverseShearY", k.membranePrincipalMax = "membranePrincipalMax", k.membranePrincipalMin = "membranePrincipalMin", k.bendingPrincipalMax = "bendingPrincipalMax", k.bendingPrincipalMin = "bendingPrincipalMin", k.transverseShearMax = "transverseShearMax", k.vonMises = "vonMises", k.pressure = "pressure", k.displacementX = "displacementX", k.displacementY = "displacementY", k.displacementZ = "displacementZ";
  })(v || (v = {})), ue.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o2, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const k = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), we = (B, J) => {
      B == null ? void 0 : B.forEach((re, le) => {
        const _e2 = t.elements.val[le];
        if (_e2) for (let Ce = 0; Ce < _e2.length; Ce++) J.set(_e2[Ce], [re[Ce] ?? re[0]]);
      });
    };
    we((_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, k), we((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, F), we((_f = (_e = t.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, A), we((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, $), we((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, z), we((_l2 = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l2.membraneXY, L), we((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, Y), we((_p = (_o2 = t.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, N), we((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), we((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, U);
    const j = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), me = (B, J, re, le, _e2) => {
      B.forEach((Ce, Ye) => {
        var _a2, _b2;
        const Le = Ce[0] ?? 0, Qe = ((_a2 = J.get(Ye)) == null ? void 0 : _a2[0]) ?? 0, Ke = ((_b2 = re.get(Ye)) == null ? void 0 : _b2[0]) ?? 0, ze = (Le + Qe) / 2, Ne = Math.hypot((Le - Qe) / 2, Ke);
        le.set(Ye, [ze + Ne]), _e2.set(Ye, [ze - Ne]);
      });
    };
    me($, z, L, j, q), me(k, F, A, ae, ie), Y.forEach((B, J) => {
      var _a2;
      xe.set(J, [Math.hypot(B[0] ?? 0, ((_a2 = N.get(J)) == null ? void 0 : _a2[0]) ?? 0)]);
    });
    const ye = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, de = (_w = w.solidResults) == null ? void 0 : _w.val, Z = de && de !== "none" ? de : w.shellResults.val, T = ye == null ? void 0 : ye[Z], G = { bendingXX: [k, 0], bendingYY: [F, 0], bendingXY: [A, 0], membraneXX: [$, 0], membraneYY: [z, 0], membraneXY: [L, 0], tranverseShearX: [Y, 0], tranverseShearY: [N, 0], membranePrincipalMax: [j, 0], membranePrincipalMin: [q, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [ie, 0], transverseShearMax: [xe, 0], vonMises: [ee, 0], pressure: [U, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, X = w.shellResults.val, D = zl.val, H = Cl.val, fe = X === "displacementX" || X === "displacementY" || X === "displacementZ", he = X === "bendingXX" || X === "bendingYY" || X === "bendingXY" || X === "bendingPrincipalMax" || X === "bendingPrincipalMin", oe = X === "membraneXX" || X === "membraneYY" || X === "membraneXY" || X === "membranePrincipalMax" || X === "membranePrincipalMin", W = X === "vonMises" || X === "pressure", Me = X === "tranverseShearX" || X === "tranverseShearY" || X === "transverseShearMax", te = (_D = w.solidResults) == null ? void 0 : _D.val, Ie = te === "vonMises" || te === "sigmaXX" || te === "sigmaYY" || te === "sigmaZZ" || te === "tauXY" || te === "tauYZ" || te === "tauXZ", ge = te === "ux" || te === "uy" || te === "uz", ve = Al.val, Pe = Ie ? Fl[ve] : ge || fe ? Fs[H] : he || oe || W || Me ? 1 / El[D] : 1, Xe = Ie ? ve : ge || fe ? H : he ? `${D}\xB7m/m` : oe ? `${D}/m\xB2` : W ? `${D}/m\xB2` : Me ? `${D}/m` : "";
    Ia.val = Xe, Po.val = Array.isArray(T) && T.length === 2 ? [T[0] * Pe, T[1] * Pe] : null;
    const Ae = Ds.val, st = te && te !== "none" ? [ee, 0] : G[X], Ue = [];
    if (t.nodes.val.forEach((B, J) => {
      const re = st;
      if (!re || !re[0] || typeof re[0].has != "function") return;
      if (!re[0].has(J)) {
        Ue.push(Number.NaN);
        return;
      }
      const le = re[0].get(J), _e2 = le ? le[re[1]] ?? 0 : 0;
      Ue.push(_e2 * Pe);
    }), !Po.val && Ae !== "auto") {
      const B = t.nodes.val, J = /* @__PURE__ */ new Set(), re = (_e2, Ce) => {
        var _a2;
        const Ye = (_a2 = B[_e2[0]]) == null ? void 0 : _a2[Ce];
        return _e2.every((Le) => {
          var _a3;
          return Math.abs((((_a3 = B[Le]) == null ? void 0 : _a3[Ce]) ?? NaN) - Ye) < 1e-6;
        });
      };
      for (const _e2 of t.elements.val) {
        if (_e2.length !== 4) continue;
        const Ce = re(_e2, 2), Ye = !Ce && re(_e2, 0), Le = !Ce && re(_e2, 1);
        if (Ae === "losas" ? Ce : Ae === "muros" ? Ye || Le : Ae === "murosX" ? Ye : Ae === "murosY" ? Le : false) for (const ze of _e2) J.add(ze);
      }
      const le = [];
      for (const _e2 of J) {
        const Ce = Ue[_e2];
        Number.isFinite(Ce) && le.push(Ce);
      }
      le.length && (Po.val = Ta(le));
    }
    g.val = Ue;
  }), g;
}
export {
  Ti as a,
  As as b,
  zl as c,
  Cl as d,
  Al as e,
  Rl as g
};
