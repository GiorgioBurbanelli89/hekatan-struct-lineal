import { u as rn, a6 as Xo, q as yi, v as ue, a7 as xi, D as Lt, M as ct, B as Le, F as It, a8 as gi, z as xt, a9 as bi, aa as Mi, h as ps, ab as fs, r as Xn, ac as Go, ad as Ko, a4 as Cs, _ as ut, b as ft, L as jt, y as As, c as vi, ae as _i, f as wt, V as F, $ as $n, af as Ma, K as Oo, d as Et, a as va, A as Es, t as Ho, J as ki, H as wo, I as Si, ag as Wo, w as _a, o as Pi, N as En, a2 as eo, E as hs, S as to, m as ho, ah as Sn, g as ms, i as ws, j as ys, P as yo, C as xs, W as zi, X as Ci, Y as Ai, Z as Ei, T as Uo, U as Fi } from "./theme-C-zoknmI.js";
import { T as Rt, O as gs } from "./Text-Cehu0nom.js";
import { P as Fs } from "./tweakpane-BXg6ZhiP.js";
import { e as $i } from "./styles-CqEyA8nI.js";
class $s {
  constructor(y, g = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(y, g);
  }
  set(y) {
    return y.isLut === true && this.copy(y), this;
  }
  setMin(y) {
    return this.minV = y, this;
  }
  setMax(y) {
    return this.maxV = y, this;
  }
  setColorMap(y, g = 32) {
    this.map = ka[y] || ka.rainbow, this.n = g;
    const k = 1 / this.n, S = new rn(), A = new rn();
    this.lut.length = 0, this.lut.push(new rn(this.map[0][1]));
    for (let z = 1; z < g; z++) {
      const $ = z * k;
      for (let P = 0; P < this.map.length - 1; P++) if ($ > this.map[P][0] && $ <= this.map[P + 1][0]) {
        const L = this.map[P][0], Y = this.map[P + 1][0];
        S.setHex(this.map[P][1], Xo), A.setHex(this.map[P + 1][1], Xo);
        const N = new rn().lerpColors(S, A, ($ - L) / (Y - L));
        this.lut.push(N);
      }
    }
    return this.lut.push(new rn(this.map[this.map.length - 1][1])), this;
  }
  copy(y) {
    return this.lut = y.lut, this.map = y.map, this.n = y.n, this.minV = y.minV, this.maxV = y.maxV, this;
  }
  getColor(y) {
    y = yi.clamp(y, this.minV, this.maxV), y = (y - this.minV) / (this.maxV - this.minV);
    const g = Math.round(y * this.n);
    return this.lut[g];
  }
  addColorMap(y, g) {
    return ka[y] = g, this;
  }
  createCanvas() {
    const y = document.createElement("canvas");
    return y.width = 1, y.height = this.n, this.updateCanvas(y), y;
  }
  updateCanvas(y) {
    const g = y.getContext("2d", { alpha: false }), k = g.getImageData(0, 0, 1, this.n), S = k.data;
    let A = 0;
    const z = 1 / this.n, $ = new rn(), P = new rn(), L = new rn();
    for (let Y = 1; Y >= 0; Y -= z) for (let N = this.map.length - 1; N >= 0; N--) if (Y < this.map[N][0] && Y >= this.map[N - 1][0]) {
      const ee = this.map[N - 1][0], U = this.map[N][0];
      $.setHex(this.map[N - 1][1], Xo), P.setHex(this.map[N][1], Xo), L.lerpColors($, P, (Y - ee) / (U - ee)), S[A * 4] = Math.round(L.r * 255), S[A * 4 + 1] = Math.round(L.g * 255), S[A * 4 + 2] = Math.round(L.b * 255), S[A * 4 + 3] = 255, A += 1;
    }
    return g.putImageData(k, 0, 0), y;
  }
}
const ka = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Vs = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Vi = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Vs, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Qo = ue.state("safe"), Ls = ue.state("auto");
function Is(t) {
  t = Math.max(0, Math.min(1, t));
  const y = Vi[Qo.val] ?? Vs;
  for (let k = 0; k < y.length - 1; k++) {
    const [S, A, z, $] = y[k], [P, L, Y, N] = y[k + 1];
    if (t <= P) {
      const ee = (t - S) / (P - S);
      return [A + (L - A) * ee, z + (Y - z) * ee, $ + (N - $) * ee];
    }
  }
  const g = y[y.length - 1];
  return [g[1], g[2], g[3]];
}
function bs() {
  const y = new Uint8Array(1024);
  for (let k = 0; k < 256; k++) {
    const S = k / 255, [A, z, $] = Is(S);
    y[k * 4 + 0] = A, y[k * 4 + 1] = z, y[k * 4 + 2] = $, y[k * 4 + 3] = 255;
  }
  const g = new bi(y, 256, 1, Mi);
  return g.minFilter = ps, g.magFilter = ps, g.wrapS = fs, g.wrapT = fs, g.needsUpdate = true, g;
}
function Li() {
  const y = [];
  for (let g = 0; g <= 12; g++) {
    const k = 1 - g / 12, [S, A, z] = Is(k);
    y.push(`rgb(${S | 0},${A | 0},${z | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${y.join(",")})`;
}
function Fa(t) {
  if (!t.length) return [0, 1];
  const y = [...t].sort((A, z) => A - z), g = (A) => y[Math.min(y.length - 1, Math.max(0, Math.round(A * (y.length - 1))))];
  let k = y.length >= 20 ? g(0.01) : y[0], S = y.length >= 20 ? g(0.99) : y[y.length - 1];
  return k >= 0 && S > 0 && (k = 0), S <= 0 && k < 0 && (S = 0), [k, S];
}
function Ii(t, y, g) {
  new $s();
  const k = bs(), S = new xi({ uniforms: { cmap: { value: k }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: Lt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  ue.derive(() => {
    var _a2;
    Qo.val;
    const z = S.uniforms.cmap.value;
    S.uniforms.cmap.value = bs(), (_a2 = z == null ? void 0 : z.dispose) == null ? void 0 : _a2.call(z);
  });
  const A = new ct(new Le(), S);
  return A.renderOrder = -1, A.frustumCulled = false, A.userData.isShellArea = true, A.name = "__hekatan_shell_colormap", ue.derive(() => {
    A.geometry.setAttribute("position", new It(t.val.flat(), 3));
    const z = [], $ = [], P = [];
    y.val.forEach((se, xe) => {
      se.length === 3 ? (z.push(se[0], se[1], se[2]), $.push(xe), P.push(0)) : se.length === 4 && (z.push(se[0], se[1], se[2]), z.push(se[0], se[2], se[3]), $.push(xe, xe), P.push(0, 1));
    }), A.geometry.setIndex(new gi(z, 1)), A.userData.faceToElem = $, A.userData.faceLocal = P;
    const L = g.val.filter((se) => Number.isFinite(se));
    let Y, N;
    const ee = go.val;
    if (ee ? (N = ee[0], Y = ee[1]) : [N, Y] = Fa(L), Y === N) {
      const se = Math.max(Math.abs(Y) * 1e-6, 1e-9);
      Y += se, N -= se;
    }
    const U = ee && ee[0] > ee[1], me = Math.min(N, Y), Q = Math.max(N, Y), q = Q - me, ae = new Float32Array(g.val.length);
    for (let se = 0; se < g.val.length; se++) {
      const xe = g.val[se];
      if (!Number.isFinite(xe)) {
        ae[se] = -1;
        continue;
      }
      const ye = ((U ? Q + me - xe : xe) - me) / q;
      ae[se] = Math.max(0, Math.min(1, ye));
    }
    A.geometry.setAttribute("scalar", new xt(ae, 1));
  }), A;
}
function Ri(t, y, g) {
  const k = document.createElement("div"), S = new Fs({ title: "Settings", expanded: true, container: k });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(S), k.setAttribute("id", "settings");
  const A = "hk_settingsPos";
  let z = null;
  try {
    const U = localStorage.getItem(A);
    U && (z = JSON.parse(U));
  } catch {
  }
  k.style.cssText = ["position:fixed", z ? `left:${z.left}px` : "left:8px", z ? `top:${z.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const $ = () => {
    const U = k.querySelector(".tp-rotv_b");
    if (!U) {
      setTimeout($, 200);
      return;
    }
    U.style.cursor = "move", U.style.userSelect = "none";
    let me = false, Q = 0, q = 0, ae = 0, se = 0;
    U.addEventListener("mousedown", (xe) => {
      me = true, Q = xe.clientX, q = xe.clientY;
      const he = k.getBoundingClientRect();
      ae = he.left, se = he.top, k.style.left = `${ae}px`, k.style.top = `${se}px`;
    }), window.addEventListener("mousemove", (xe) => {
      if (!me) return;
      const he = xe.clientX - Q, ye = xe.clientY - q, de = Math.max(0, Math.min(window.innerWidth - 40, ae + he)), K = Math.max(0, Math.min(window.innerHeight - 40, se + ye));
      k.style.left = `${de}px`, k.style.top = `${K}px`;
    }), window.addEventListener("mouseup", () => {
      if (me) {
        me = false;
        try {
          localStorage.setItem(A, JSON.stringify({ left: parseFloat(k.style.left), top: parseFloat(k.style.top) }));
        } catch {
        }
      }
    });
  };
  if ($(), y == null ? void 0 : y.nodes) {
    S.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const U = S.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    U.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), U.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), U.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), U.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const me = U.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    me.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), me.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), me.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), me.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), me.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const Q = S.addFolder({ title: "\u{1F441} Ver", expanded: false });
    Q.addBinding(t.nodes, "val", { label: "Nodes" }), Q.addBinding(t.elements, "val", { label: "Elements" }), Q.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), Q.addBinding(t.faces, "val", { label: "  Caras (fill)" }), Q.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), Q.addBinding(t.elemColumns, "val", { label: "    Columnas" }), Q.addBinding(t.elemBeams, "val", { label: "    Vigas" }), Q.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), Q.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), Q.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), Q.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), Q.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), Q.addBinding(t.orientations, "val", { label: "Orientations" }), Q.addBinding(t.sections, "val", { label: "Sections" }), Q.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), Q.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), Q.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), Q.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), Q.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((y == null ? void 0 : y.nodeInputs) || (y == null ? void 0 : y.elementInputs)) {
    const U = S.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    U.addBinding(t.supports, "val", { label: "Supports" }), U.addBinding(t.loads, "val", { label: "Loads" }), U.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), U.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((y == null ? void 0 : y.deformOutputs) || (y == null ? void 0 : y.analyzeOutputs)) {
    const U = S.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = U, U.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), U.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), U.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), U.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), U.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), U.addBinding(Qo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), U.addBinding(Ls, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), U.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), U.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), U.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), U.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && S.addBinding(t.solids, "val", { label: "Solids" });
  const P = S.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), L = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), Y = () => {
    const U = window.__hekatanClipApply;
    typeof U == "function" && U();
  };
  let N = [];
  const ee = (U, me) => {
    for (const q of N) try {
      q.dispose();
    } catch {
    }
    N = [];
    const Q = (q, ae) => {
      const se = Math.floor(Math.min(U[ae], -50)), xe = Math.ceil(Math.max(me[ae], 50)), he = xe - se > 400 ? 0.5 : 0.1;
      return L["pos" + q] = Math.max(se, Math.min(xe, L["pos" + q])), P.addBinding(L, "pos" + q, { min: se, max: xe, step: he, label: `  pos ${q} (m)` }).on("change", Y);
    };
    N.push(P.addBinding(L, "enableX", { label: "Cortar X" }).on("change", Y), Q("X", 0), P.addBinding(L, "invertX", { label: "  invertir X" }).on("change", Y), P.addBinding(L, "enableY", { label: "Cortar Y" }).on("change", Y), Q("Y", 1), P.addBinding(L, "invertY", { label: "  invertir Y" }).on("change", Y), P.addBinding(L, "enableZ", { label: "Cortar Z" }).on("change", Y), Q("Z", 2), P.addBinding(L, "invertZ", { label: "  invertir Z" }).on("change", Y));
  };
  return ee([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (U, me) => {
    ee(U, me);
  }, k;
}
function Ti(t) {
  return { gridSize: ue.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: ue.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: ue.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: ue.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: ue.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: ue.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: ue.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: ue.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: ue.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: ue.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: ue.state((t == null ? void 0 : t.nodes) ?? true), elements: ue.state((t == null ? void 0 : t.elements) ?? true), edges: ue.state((t == null ? void 0 : t.edges) ?? true), faces: ue.state((t == null ? void 0 : t.faces) ?? true), elemColumns: ue.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: ue.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: ue.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: ue.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: ue.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: ue.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: ue.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: ue.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: ue.state((t == null ? void 0 : t.orientations) ?? false), sections: ue.state((t == null ? void 0 : t.sections) ?? true), extruded: ue.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: ue.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: ue.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: ue.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: ue.state((t == null ? void 0 : t.secFloor) ?? -1), supports: ue.state((t == null ? void 0 : t.supports) ?? true), loads: ue.state((t == null ? void 0 : t.loads) ?? false), deformedShape: ue.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: ue.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: ue.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: ue.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: ue.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: ue.state((t == null ? void 0 : t.flipAxes) ?? false), solids: ue.state((t == null ? void 0 : t.solids) ?? true), custom3D: ue.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: ue.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: ue.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: ue.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function Di(t, y, g) {
  const k = Xn(), S = new Go(new Le(), new Ko({ color: k.nodePoint }));
  return Cs((A, z) => {
    S.material.color.setHex(z.nodePoint);
  }), S.frustumCulled = false, ue.derive(() => {
    t.nodes.val && S.geometry.setAttribute("position", new It(y.val.flat(), 3));
  }), ue.derive(() => {
    if (g.val, y.val, !t.nodes.rawVal) return;
    const A = y.rawVal ?? [];
    let z = t.gridSize.val * 0.5;
    if (A.length >= 2) {
      const P = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
      for (const Y of A) for (let N = 0; N < 3; N++) P[N] = Math.min(P[N], Y[N]), L[N] = Math.max(L[N], Y[N]);
      z = Math.max(L[0] - P[0], L[1] - P[1], L[2] - P[2], 0.1);
    }
    const $ = 0.03 * z;
    S.material.size = $ * g.rawVal;
  }), ue.derive(() => {
    S.visible = t.nodes.val;
  }), S;
}
function Sa(t, y) {
  const g = Xn(), k = new ut();
  k.name = "hekatan-grid";
  const S = (y == null ? void 0 : y.planes) ?? ["xy"];
  let A = (y == null ? void 0 : y.majorStep) ?? 1, z = (y == null ? void 0 : y.minorStep) ?? 0.1;
  for (A <= 0 && (A = 1), z <= 0 && (z = 0.1); t / z > 500; ) z *= 2;
  for (; t / A > 100; ) A *= 2;
  const $ = t / 2;
  A = Math.max(z, Math.round(A / z) * z);
  const L = new rn(g.grid).multiplyScalar(1.3), Y = new rn(g.grid).multiplyScalar(0.8), N = (Q, q, ae, se) => {
    const xe = [], he = Q === "xy" ? (R, G) => [R, G, 0] : Q === "xz" ? (R, G) => [R, 0, G] : (R, G) => [0, R, G], ye = Math.floor($ / q);
    for (let R = -ye; R <= ye; R++) {
      const G = R * q, X = he(G, -$), T = he(G, $);
      xe.push(...X, ...T);
    }
    for (let R = -ye; R <= ye; R++) {
      const G = R * q, X = he(-$, G), T = he($, G);
      xe.push(...X, ...T);
    }
    const de = new Le();
    de.setAttribute("position", new It(xe, 3));
    const K = new ft({ color: ae, transparent: true, opacity: se, depthWrite: false }), Z = new jt(de, K);
    return Z.name = `grid-${Q}-${q === z ? "minor" : "major"}`, Z;
  }, ee = (Q, q, ae) => {
    const se = Q === "xy" ? (Z, R) => [Z, R, 0] : Q === "xz" ? (Z, R) => [Z, 0, R] : (Z, R) => [0, Z, R], xe = [[-$, -$], [$, -$], [$, $], [-$, $]], he = [];
    for (const [Z, R] of xe) he.push(...se(Z, R));
    const ye = new Le();
    ye.setAttribute("position", new It(he, 3));
    const de = new ft({ color: q, transparent: true, opacity: ae, depthWrite: false }), K = new As(ye, de);
    return K.name = `grid-${Q}-border`, K.renderOrder = 1, K;
  }, U = (Q, q, ae) => {
    const se = Q === "xy" ? (de, K) => [de, K, 0] : Q === "xz" ? (de, K) => [de, 0, K] : (de, K) => [0, de, K], xe = q === "u" ? [...se(-$, 0), ...se($, 0)] : [...se(0, -$), ...se(0, $)], he = new Le();
    he.setAttribute("position", new It(xe, 3));
    const ye = new jt(he, new ft({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
    return ye.name = `grid-${Q}-eje-${q}`, ye.renderOrder = 1, ye;
  }, me = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const Q of S) {
    k.add(N(Q, z, Y, 0.12)), k.add(N(Q, A, L, 0.4));
    const [q, ae] = me[Q];
    k.add(U(Q, "u", q)), k.add(U(Q, "v", ae)), k.add(ee(Q, L, 0.55));
  }
  return k.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: A, minorStep: z, gridSize: t, planes: [...S] }, k;
}
function Bi(t, y, g, k) {
  const S = new ut(), A = new vi(0.5, 0.5, 0.5), z = new _i(0.45, 0.7, 4);
  z.rotateX(Math.PI / 2), z.translate(0, 0, -0.35);
  const $ = new wt({ color: 10166822 }), P = new wt({ color: 2792847 }), L = new wt({ color: 3835647 }), Y = () => {
    const U = g.rawVal ?? [];
    if (U.length < 2) return y.gridSize.val * 0.5;
    let me = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
    for (const q of U) for (let ae = 0; ae < 3; ae++) q[ae] < me[ae] && (me[ae] = q[ae]), q[ae] > Q[ae] && (Q[ae] = q[ae]);
    return Math.max(Q[0] - me[0], Q[1] - me[1], Q[2] - me[2], 0.1);
  }, N = () => 0.08 * Y(), ee = () => k.rawVal;
  return ue.derive(() => {
    var _a2, _b;
    if (y.deformedShape.val, !y.supports.val) return;
    S.clear();
    const U = N();
    (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((me, Q) => {
      const q = g.val[Q];
      if (!q) return;
      const ae = me ?? [], se = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), xe = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let he;
      se >= 3 && xe >= 3 ? he = new ct(A, $) : se >= 3 && xe === 0 ? he = new ct(z, P) : he = new ct(z, L), he.position.set(q[0], q[1], q[2]);
      const ye = U * ee();
      he.scale.set(ye, ye, ye), S.add(he);
    });
  }), ue.derive(() => {
    if (k.val, !y.supports.rawVal) return;
    const me = N() * ee();
    S.children.forEach((Q) => Q.scale.set(me, me, me));
  }), ue.derive(() => {
    S.visible = y.supports.val;
  }), S;
}
function Ni(t, y, g, k) {
  const S = new ut();
  S.name = "loadsGroup";
  function A($) {
    if ($.length < 2) return 0.12 * y.gridSize.rawVal;
    const P = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const N of $) for (let ee = 0; ee < 3; ee++) P[ee] = Math.min(P[ee], N[ee]), L[ee] = Math.max(L[ee], N[ee]);
    return 0.08 * Math.max(L[0] - P[0], L[1] - P[1], L[2] - P[2], 0.1);
  }
  ue.derive(() => {
    var _a2, _b, _c;
    if (y.deformedShape.val, !y.loads.val) return;
    S.children.forEach((Q) => {
      var _a3;
      return (_a3 = Q.dispose) == null ? void 0 : _a3.call(Q);
    }), S.clear();
    const $ = g.val, P = A($), L = 240, Y = [];
    (_c = (_b = (_a2 = t.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((Q, q) => {
      $[q] && Q.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && Y.push(q);
    });
    let N = Y;
    if (Y.length > L) {
      const Q = Y.map((T) => $[T][0]), q = Y.map((T) => $[T][1]), ae = Math.min(...Q), se = Math.max(...Q), xe = Math.min(...q), he = Math.max(...q), ye = Y.map((T) => $[T][2]), de = Math.max(1e-6, (Math.max(...ye) - Math.min(...ye)) / 40), K = (T) => Math.round(T / de), Z = new Set(ye.map(K)), R = Math.max(4, Math.floor(L / Math.max(1, Z.size))), G = Math.max(2, Math.round(Math.sqrt(R))), X = /* @__PURE__ */ new Map();
      for (const T of Y) {
        const H = se - ae < 1e-9 ? 0 : ($[T][0] - ae) / (se - ae), pe = he - xe < 1e-9 ? 0 : ($[T][1] - xe) / (he - xe), fe = Math.min(G - 1, Math.floor(H * G)), oe = Math.min(G - 1, Math.floor(pe * G)), W = `${fe},${oe},${K($[T][2])}`, Me = Math.hypot(H * G - (fe + 0.5), pe * G - (oe + 0.5)), te = X.get(W);
        (!te || Me < te.d) && X.set(W, { i: T, d: Me });
      }
      N = [...X.values()].map((T) => T.i);
    }
    let ee = 0;
    for (const Q of N) {
      const q = t.nodeInputs.val.loads.get(Q);
      for (let ae = 0; ae < 3; ae++) ee = Math.max(ee, Math.abs(q[ae]));
    }
    const U = N.length <= 60, me = (Q) => {
      const q = Math.abs(Q);
      return q >= 100 ? Q.toFixed(0) : q >= 10 ? Q.toFixed(1) : Q.toFixed(2);
    };
    for (const Q of N) {
      const q = t.nodeInputs.val.loads.get(Q), ae = $[Q];
      if (ae) for (let se = 0; se < 3; se++) {
        const xe = q[se];
        if (!(Math.abs(xe) > 1e-9 * (ee || 1))) continue;
        const he = new F(se === 0 ? Math.sign(xe) : 0, se === 1 ? Math.sign(xe) : 0, se === 2 ? Math.sign(xe) : 0), ye = 0.45 + 0.55 * (ee ? Math.abs(xe) / ee : 1), de = new $n(he, new F(...ae), 1, se === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (de.userData = { nudo: ae, dir: he, rel: ye }, S.add(de), U) {
          const K = new Rt(me(xe), se === 2 ? "#f5b642" : "#ff6b5e");
          K.userData = { nudo: ae, dir: he, rel: ye, texto: true }, S.add(K);
        }
      }
    }
    z(P * k.rawVal);
  });
  function z($) {
    S.children.forEach((P) => {
      const L = P.userData;
      if (!(L == null ? void 0 : L.dir)) return;
      const Y = $ * L.rel, N = new F(...L.nudo).addScaledVector(L.dir, -Y * (L.texto ? 1.12 : 1));
      P.position.copy(N), L.texto ? P.updateScale($ * 0.38) : P.scale.set(Y, Y, Y);
    });
  }
  return ue.derive(() => {
    k.val, y.loads.rawVal && z(A(g.rawVal) * k.rawVal);
  }), ue.derive(() => {
    S.visible = y.loads.val;
  }), S;
}
function Yi(t, y, g) {
  const k = new ut();
  return ue.derive(() => {
    if (!t.nodesIndexes.val) return;
    k.children.forEach((A) => A.dispose()), k.clear();
    const S = 0.05 * t.gridSize.val * 0.6;
    y.val.forEach((A, z) => {
      const $ = new Rt(`${z}`);
      $.position.set(...A), $.updateScale(S * g.rawVal), k.add($);
    });
  }), ue.derive(() => {
    if (g.val, !t.nodesIndexes.rawVal) return;
    const S = 0.05 * t.gridSize.val * 0.6;
    k.children.forEach((A) => A.updateScale(S * g.rawVal));
  }), ue.derive(() => {
    k.visible = t.nodesIndexes.val;
  }), k;
}
function Xi(t, y, g, k) {
  const S = new ut();
  return ue.derive(() => {
    var _a2;
    if (y.deformedShape.val, !y.elementsIndexes.val) return;
    S.children.forEach((z) => z.dispose()), S.clear();
    const A = 0.05 * y.gridSize.val * 0.6;
    (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((z, $) => {
      const P = new Rt(`${$}`, void 0, "#001219");
      P.position.set(...Ui(z.map((L) => g.rawVal[L]))), P.updateScale(A * k.rawVal), S.add(P);
    });
  }), ue.derive(() => {
    if (k.val, !y.elementsIndexes.rawVal) return;
    const A = 0.05 * y.gridSize.val * 0.6;
    S.children.forEach((z) => z.updateScale(A * k.rawVal));
  }), ue.derive(() => {
    S.visible = y.elementsIndexes.val;
  }), S;
}
function Ui(t) {
  const y = t.reduce((k, S) => [k[0] + S[0], k[1] + S[1], k[2] + S[2]], [0, 0, 0]), g = t.length;
  return [y[0] / g, y[1] / g, y[2] / g];
}
function Ms(t, y) {
  const g = new ut(), k = Math.min(0.05 * t, 0.6), S = Xn(), A = new Rt("X", "red", "transparent"), z = new Rt(y ? "Z" : "Y", "green", "transparent"), $ = new Rt(y ? "Y" : "Z", "blue", "transparent"), P = new $n(new F(1, 0, 0), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), L = new $n(new F(0, 1, 0), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), Y = new $n(new F(0, 0, 1), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2);
  return A.position.set(1.3 * k, 0, 0), z.position.set(0, 1.3 * k, 0), $.position.set(0, 0, 1.3 * k), A.updateScale(0.4 * k), z.updateScale(0.4 * k), $.updateScale(0.4 * k), P.scale.set(k, k, k), L.scale.set(k, k, k), Y.scale.set(k, k, k), g.add(P, L, Y, A, z, $), g;
}
function Jo(t, y) {
  const g = new F(...t), S = new F(...y).clone().sub(g), A = S.length(), z = S.dot(new F(1, 0, 0)) / A, $ = S.dot(new F(0, 1, 0)) / A, P = S.dot(new F(0, 0, 1)) / A, L = Math.sqrt(z ** 2 + $ ** 2);
  let Y = new Ma().fromArray([[z, $, P], [-$ / L, z / L, 0], [-z * P / L, -$ * P / L, L]].flat());
  return P === 1 && (Y = new Ma().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), P === -1 && (Y = new Ma().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Oo().setFromMatrix3(Y);
}
function Ca(t, y) {
  return t == null ? void 0 : t.map((g, k) => (9 * g + y[k]) / 10);
}
function xo(t) {
  const y = t.reduce((k, S) => [k[0] + S[0], k[1] + S[1], k[2] + S[2]], [0, 0, 0]), g = t.length;
  return [y[0] / g, y[1] / g, y[2] / g];
}
function Zi(t, y, g) {
  const k = xo([y, g]), S = xo([t, g]), A = xo([t, y]), z = new F(...k).sub(new F(...S)).normalize(), $ = new F(...g).sub(new F(...A)).normalize(), P = z.clone().cross($).normalize(), L = P.clone().cross(z).normalize();
  return new Oo().makeBasis(z, L, P);
}
function qi(t, y, g, k) {
  const S = new ut(), A = new Le(), z = new ft({ vertexColors: true }), $ = [0, 0, 0], P = [1, 0, 0], L = [0, 1, 0], Y = [0, 0, 1];
  A.setAttribute("position", new It([...$, ...P, ...$, ...L, ...$, ...Y], 3));
  const N = [255, 0, 0], ee = [0, 255, 0], U = [0, 0, 255];
  return A.setAttribute("color", new It([...N, ...N, ...ee, ...ee, ...U, ...U], 3)), ue.derive(() => {
    var _a2;
    y.deformedShape.val, y.orientations.val && (S.clear(), (_a2 = t.elements) == null ? void 0 : _a2.val.forEach((me) => {
      const Q = new jt(A, z), q = g.rawVal[me[0]], ae = g.rawVal[me[1]];
      if (me.length === 2 && (Q.position.set(...Ca(q, ae)), Q.rotation.setFromRotationMatrix(Jo(q, ae))), me.length === 3) {
        const he = g.rawVal[me[2]];
        Q.position.set(...xo([q, ae, he])), Q.rotation.setFromRotationMatrix(Zi(q, ae, he));
      }
      const xe = 0.05 * y.gridSize.rawVal * 0.75 * k.rawVal;
      Q.scale.set(xe, xe, xe), S.add(Q);
    }));
  }), ue.derive(() => {
    if (k.val, !y.orientations.rawVal) return;
    const Q = 0.05 * y.gridSize.val * 0.75 * k.rawVal;
    S.children.forEach((q) => q.scale.set(Q, Q, Q));
  }), ue.derive(() => {
    S.visible = y.orientations.val;
  }), S;
}
function Gi(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const y = (t.b * 100).toFixed(0), g = (t.h * 100).toFixed(0);
    return `${y}x${g}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function Ki(t, y, g, k) {
  const S = new ut(), A = new ut();
  S.add(A);
  function z(de, K) {
    const Z = de / 2, R = K / 2, G = new Float32Array([0, -Z, -R, 0, Z, -R, 0, Z, R, 0, -Z, -R, 0, Z, R, 0, -Z, R]), X = new Le();
    X.setAttribute("position", new xt(G, 3));
    const T = new Float32Array([0, -Z, -R, 0, Z, -R, 0, Z, R, 0, -Z, R, 0, -Z, -R]), H = new Le();
    return H.setAttribute("position", new xt(T, 3)), { fill: X, outline: H };
  }
  function $(de, K = 24) {
    const Z = de / 2, R = new Float32Array(K * 9);
    for (let H = 0; H < K; H++) {
      const pe = H / K * Math.PI * 2, fe = (H + 1) / K * Math.PI * 2;
      R[H * 9] = 0, R[H * 9 + 1] = 0, R[H * 9 + 2] = 0, R[H * 9 + 3] = 0, R[H * 9 + 4] = Z * Math.cos(pe), R[H * 9 + 5] = Z * Math.sin(pe), R[H * 9 + 6] = 0, R[H * 9 + 7] = Z * Math.cos(fe), R[H * 9 + 8] = Z * Math.sin(fe);
    }
    const G = new Le();
    G.setAttribute("position", new xt(R, 3));
    const X = new Float32Array((K + 1) * 3);
    for (let H = 0; H <= K; H++) {
      const pe = H / K * Math.PI * 2;
      X[H * 3] = 0, X[H * 3 + 1] = Z * Math.cos(pe), X[H * 3 + 2] = Z * Math.sin(pe);
    }
    const T = new Le();
    return T.setAttribute("position", new xt(X, 3)), { fill: G, outline: T };
  }
  function P(de, K, Z, R) {
    const G = Z ?? K * 0.08, X = R ?? de * 0.07, T = de / 2, H = K / 2, pe = H - G, fe = X / 2, oe = [];
    function W(ge, ve, Se, Xe) {
      oe.push(0, ge, ve, 0, Se, ve, 0, Se, Xe, 0, ge, ve, 0, Se, Xe, 0, ge, Xe);
    }
    W(-T, -H, T, -pe), W(-fe, -pe, fe, pe), W(-T, pe, T, H);
    const Me = new Le();
    Me.setAttribute("position", new xt(new Float32Array(oe), 3));
    const te = new Float32Array([0, -T, -H, 0, T, -H, 0, T, -pe, 0, fe, -pe, 0, fe, pe, 0, T, pe, 0, T, H, 0, -T, H, 0, -T, pe, 0, -fe, pe, 0, -fe, -pe, 0, -T, -pe, 0, -T, -H]), Re = new Le();
    return Re.setAttribute("position", new xt(te, 3)), { fill: Me, outline: Re };
  }
  function L(de, K, Z) {
    const R = de / 2, G = K / 2, X = R - Z, T = G - Z, H = [];
    function pe(Me, te, Re, ge) {
      H.push(0, Me, te, 0, Re, te, 0, Re, ge, 0, Me, te, 0, Re, ge, 0, Me, ge);
    }
    pe(-R, -G, R, -T), pe(-R, T, R, G), pe(-R, -T, -X, T), pe(X, -T, R, T);
    const fe = new Le();
    fe.setAttribute("position", new xt(new Float32Array(H), 3));
    const oe = new Float32Array([0, -R, -G, 0, R, -G, 0, R, -G, 0, R, G, 0, R, G, 0, -R, G, 0, -R, G, 0, -R, -G, 0, -X, -T, 0, X, -T, 0, X, -T, 0, X, T, 0, X, T, 0, -X, T, 0, -X, T, 0, -X, -T]), W = new Le();
    return W.setAttribute("position", new xt(oe, 3)), { fill: fe, outline: W };
  }
  function Y(de, K, Z) {
    const R = de / 2, G = K / 2, X = R - Z, T = G - Z, H = new Le(), pe = new Float32Array([0, -X, -T, 0, X, -T, 0, X, T, 0, -X, -T, 0, X, T, 0, -X, T]);
    H.setAttribute("position", new xt(pe, 3));
    const fe = [];
    function oe(Re, ge, ve, Se) {
      fe.push(0, Re, ge, 0, ve, ge, 0, ve, Se, 0, Re, ge, 0, ve, Se, 0, Re, Se);
    }
    oe(-R, -G, R, -T), oe(-R, T, R, G), oe(-R, -T, -X, T), oe(X, -T, R, T);
    const W = new Le();
    W.setAttribute("position", new xt(new Float32Array(fe), 3));
    const Me = new Float32Array([0, -R, -G, 0, R, -G, 0, R, -G, 0, R, G, 0, R, G, 0, -R, G, 0, -R, G, 0, -R, -G, 0, -X, -T, 0, X, -T, 0, X, -T, 0, X, T, 0, X, T, 0, -X, T, 0, -X, T, 0, -X, -T]), te = new Le();
    return te.setAttribute("position", new xt(Me, 3)), { concFill: H, steelFillGeom: W, outline: te };
  }
  function N(de, K, Z) {
    const R = [], G = [[0, -de / 2, -K / 2], [0, -de / 2 + Z, -K / 2], [0, -de / 2 + Z, K / 2 - Z], [0, de / 2, K / 2 - Z], [0, de / 2, K / 2], [0, -de / 2, K / 2]], X = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of X) R.push(...G[fe]);
    const T = new Le();
    T.setAttribute("position", new xt(new Float32Array(R), 3));
    const H = [];
    for (let fe = 0; fe < G.length; fe++) {
      const oe = (fe + 1) % G.length;
      H.push(...G[fe], ...G[oe]);
    }
    const pe = new Le();
    return pe.setAttribute("position", new xt(new Float32Array(H), 3)), { fill: T, outline: pe };
  }
  function ee(de, K, Z, R) {
    const G = R / 2, X = [], T = [[0, -de - G, -K / 2], [0, -Z - G, -K / 2], [0, -Z - G, K / 2 - Z], [0, -G, K / 2 - Z], [0, -G, K / 2], [0, -de - G, K / 2]], H = [[0, G, -K / 2], [0, G + Z, -K / 2], [0, G + Z, K / 2 - Z], [0, de + G, K / 2 - Z], [0, de + G, K / 2], [0, G, K / 2]], pe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const Me of pe) X.push(...T[Me]);
    for (const Me of pe) X.push(...H[Me]);
    const fe = new Le();
    fe.setAttribute("position", new xt(new Float32Array(X), 3));
    const oe = [];
    for (const Me of [T, H]) for (let te = 0; te < Me.length; te++) {
      const Re = (te + 1) % Me.length;
      oe.push(...Me[te], ...Me[Re]);
    }
    const W = new Le();
    return W.setAttribute("position", new xt(new Float32Array(oe), 3)), { fill: fe, outline: W };
  }
  function U(de, K, Z, R) {
    const G = K / 2, X = de, T = [[0, -X, -G], [0, -X, -G + Z], [0, -R, -G + Z], [0, -R, G - Z], [0, -X, G - Z], [0, -X, G], [0, 0, G], [0, 0, -G]], H = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], pe = [];
    for (const Me of H) pe.push(...T[Me]);
    const fe = new Le();
    fe.setAttribute("position", new xt(new Float32Array(pe), 3));
    const oe = [];
    for (let Me = 0; Me < T.length; Me++) {
      const te = (Me + 1) % T.length;
      oe.push(...T[Me], ...T[te]);
    }
    const W = new Le();
    return W.setAttribute("position", new xt(new Float32Array(oe), 3)), { fill: fe, outline: W };
  }
  function me(de, K, Z, R, G) {
    const X = K / 2, T = G / 2, H = [], pe = [[0, -de, -X], [0, -de, -X + Z], [0, -T - R, -X + Z], [0, -T - R, X - Z], [0, -de, X - Z], [0, -de, X], [0, -T, X], [0, -T, -X]], fe = pe.map((Re) => [Re[0], -Re[1], Re[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const Re of oe) H.push(...pe[Re]);
    for (const Re of oe) H.push(...fe[Re]);
    const W = new Le();
    W.setAttribute("position", new xt(new Float32Array(H), 3));
    const Me = [];
    for (const Re of [pe, fe]) for (let ge = 0; ge < Re.length; ge++) {
      const ve = (ge + 1) % Re.length;
      Me.push(...Re[ge], ...Re[ve]);
    }
    const te = new Le();
    return te.setAttribute("position", new xt(new Float32Array(Me), 3)), { fill: W, outline: te };
  }
  function Q(de, K, Z, R) {
    const G = de / 2, X = K / 2, T = R / 2, H = [[0, -T, -X], [0, T, -X], [0, T, X - Z], [0, G, X - Z], [0, G, X], [0, -G, X], [0, -G, X - Z], [0, -T, X - Z]], pe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], fe = [];
    for (const te of pe) fe.push(...H[te]);
    const oe = new Le();
    oe.setAttribute("position", new xt(new Float32Array(fe), 3));
    const W = [];
    for (let te = 0; te < H.length; te++) {
      const Re = (te + 1) % H.length;
      W.push(...H[te], ...H[Re]);
    }
    const Me = new Le();
    return Me.setAttribute("position", new xt(new Float32Array(W), 3)), { fill: oe, outline: Me };
  }
  function q(de, K, Z = 24) {
    const R = de / 2, G = R - K, X = [];
    for (let fe = 0; fe < Z; fe++) {
      const oe = fe / Z * Math.PI * 2, W = (fe + 1) / Z * Math.PI * 2, Me = Math.cos(oe), te = Math.sin(oe), Re = Math.cos(W), ge = Math.sin(W);
      X.push(0, R * Me, R * te, 0, R * Re, R * ge, 0, G * Re, G * ge), X.push(0, R * Me, R * te, 0, G * Re, G * ge, 0, G * Me, G * te);
    }
    const T = new Le();
    T.setAttribute("position", new xt(new Float32Array(X), 3));
    const H = [];
    for (let fe = 0; fe < Z; fe++) {
      const oe = fe / Z * Math.PI * 2, W = (fe + 1) / Z * Math.PI * 2;
      H.push(0, R * Math.cos(oe), R * Math.sin(oe), 0, R * Math.cos(W), R * Math.sin(W)), H.push(0, G * Math.cos(oe), G * Math.sin(oe), 0, G * Math.cos(W), G * Math.sin(W));
    }
    const pe = new Le();
    return pe.setAttribute("position", new xt(new Float32Array(H), 3)), { fill: T, outline: pe };
  }
  const ae = new wt({ color: 52479, transparent: true, opacity: 0.35, side: Lt, depthWrite: false }), se = new ft({ color: 52479 }), xe = new wt({ color: 16750848, transparent: true, opacity: 0.4, side: Lt, depthWrite: false }), he = new ft({ color: 16750848 });
  function ye(de, K) {
    const Z = Math.abs(K[0] - de[0]), R = Math.abs(K[1] - de[1]), G = Math.abs(K[2] - de[2]);
    return G > Z && G > R || R > Z && R > G;
  }
  return ue.derive(() => {
    var _a2, _b;
    y.deformedShape.val, y.secColumns.val, y.secBeams.val, y.secFloor.val;
    const de = y.secColumns.rawVal, K = y.secBeams.rawVal;
    if (!de && !K) {
      S.children.forEach((T) => {
        T instanceof Rt && T.dispose();
      }), S.clear();
      return;
    }
    S.children.forEach((T) => {
      T instanceof Rt && T.dispose();
    }), S.clear();
    const Z = (_a2 = t.elements) == null ? void 0 : _a2.val, R = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!Z || !R) return;
    const G = R.sectionShapes, X = y.secFloor.rawVal;
    Z.forEach((T, H) => {
      if (T.length !== 2) return;
      const pe = g.rawVal[T[0]], fe = g.rawVal[T[1]];
      if (!pe || !fe) return;
      const oe = ye(pe, fe);
      if (oe && !de || !oe && !K) return;
      if (X >= 0) {
        const ge = Math.min(pe[1], fe[1]);
        Math.max(pe[1], fe[1]);
        const ve = y.gridSize.rawVal || 3;
        if (Math.floor(ge / ve + 0.01) !== X) return;
      }
      const W = G == null ? void 0 : G.get(H);
      if (!W) return;
      const Me = [(pe[0] + fe[0]) / 2, (pe[1] + fe[1]) / 2, (pe[2] + fe[2]) / 2], te = Jo(pe, fe);
      if (W.type === "CFT") {
        const ge = Y(W.b, W.h, W.tw ?? W.b * 0.05), ve = new ct(ge.concFill, ae);
        ve.position.set(...Me), ve.rotation.setFromRotationMatrix(te), ve.userData.e = H, S.add(ve);
        const Se = new ct(ge.steelFillGeom, xe);
        Se.position.set(...Me), Se.rotation.setFromRotationMatrix(te), Se.userData.e = H, S.add(Se);
        const Xe = new Et(ge.outline, he);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = H, S.add(Xe);
      } else {
        let ge, ve, Se;
        switch (W.type) {
          case "rect":
            ge = z(W.b, W.h), ve = ae, Se = se;
            break;
          case "circ":
            ge = $(W.d), ve = ae, Se = se;
            break;
          case "I":
            ge = P(W.b, W.h, W.tf, W.tw), ve = xe, Se = he;
            break;
          case "HSS":
            ge = L(W.b, W.h, W.tw ?? W.b * 0.05), ve = xe, Se = he;
            break;
          case "CFT":
            ge = Y(W.b, W.h, W.tw ?? W.b * 0.05), ve = xe, Se = he;
            break;
          case "L":
            ge = N(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3), ve = xe, Se = he;
            break;
          case "2L":
            ge = ee(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3, W.dis ?? 0.01), ve = xe, Se = he;
            break;
          case "C":
          case "coldC":
            ge = U(W.b, W.h, W.tf ?? W.t ?? 3e-3, W.tw ?? W.t ?? 3e-3), ve = xe, Se = he;
            break;
          case "2C":
            ge = me(W.b, W.h, W.tf ?? 5e-3, W.tw ?? 5e-3, W.dis ?? 0.01), ve = xe, Se = he;
            break;
          case "T":
            ge = Q(W.b, W.h, W.tf ?? 0.01, W.tw ?? 6e-3), ve = xe, Se = he;
            break;
          case "pipe":
            ge = q(W.d, W.tw ?? W.d * 0.05), ve = xe, Se = he;
            break;
          default:
            return;
        }
        const Xe = new ct(ge.fill, ve);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = H, S.add(Xe);
        const Ae = new Et(ge.outline, Se);
        Ae.position.set(...Me), Ae.rotation.setFromRotationMatrix(te), Ae.userData.e = H, S.add(Ae);
      }
      const Re = Gi(W);
      if (Re) {
        const ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(W.type) ? "#ff9900" : "#00ccff", Se = new Rt(Re, ve, "transparent");
        Se.position.set(Me[0], Me[1], Me[2]);
        const Xe = 0.05 * y.gridSize.rawVal * 0.5;
        Se.updateScale(Xe * ((k == null ? void 0 : k.rawVal) ?? 1)), A.add(Se);
      }
    });
  }), ue.derive(() => {
    var _a2, _b;
    const de = g.val, K = (_a2 = t.elements) == null ? void 0 : _a2.rawVal;
    if (K) for (const Z of S.children) {
      const R = (_b = Z.userData) == null ? void 0 : _b.e;
      if (R === void 0) continue;
      const G = K[R], X = G && de[G[0]], T = G && de[G[1]];
      !X || !T || (Z.position.set((X[0] + T[0]) / 2, (X[1] + T[1]) / 2, (X[2] + T[2]) / 2), Z.rotation.setFromRotationMatrix(Jo(X, T)));
    }
  }), k && ue.derive(() => {
    if (k.val, !y.sections.rawVal) return;
    const de = 0.05 * y.gridSize.val * 0.5;
    A.children.forEach((K) => {
      K instanceof Rt && K.updateScale(de * k.rawVal);
    });
  }), ue.derive(() => {
    S.visible = y.sections.val;
  }), ue.derive(() => {
    A.visible = y.sectionLabels.val;
  }), S;
}
function Wi(t) {
  if (!t) return null;
  const y = t.type, g = (Y, N) => [Y, N], k = (Y, N) => [g(-Y / 2, -N / 2), g(Y / 2, -N / 2), g(Y / 2, N / 2), g(-Y / 2, N / 2)], S = (Y, N = 24) => {
    const ee = Y / 2, U = [];
    for (let me = 0; me < N; me++) {
      const Q = 2 * Math.PI * me / N;
      U.push(g(ee * Math.cos(Q), ee * Math.sin(Q)));
    }
    return U;
  }, A = t.b ?? 0, z = t.h ?? 0, $ = t.d ?? 0, P = t.tw ?? t.t ?? 0, L = t.tf ?? t.t ?? 0;
  switch (y) {
    case "rect":
      return A && z ? { contorno: k(A, z) } : null;
    case "circ":
      return $ ? { contorno: S($) } : null;
    case "pipe":
      return $ && P ? { contorno: S($), huecos: [S($ - 2 * P).reverse()] } : null;
    case "HSS":
      return A && z && P ? { contorno: k(A, z), huecos: [k(A - 2 * P, z - 2 * (L || P)).reverse()] } : null;
    case "CFT":
      return A && z ? { contorno: k(A, z) } : null;
    case "I":
      return A && z && P && L ? { contorno: [g(-A / 2, -z / 2), g(A / 2, -z / 2), g(A / 2, -z / 2 + L), g(P / 2, -z / 2 + L), g(P / 2, z / 2 - L), g(A / 2, z / 2 - L), g(A / 2, z / 2), g(-A / 2, z / 2), g(-A / 2, z / 2 - L), g(-P / 2, z / 2 - L), g(-P / 2, -z / 2 + L), g(-A / 2, -z / 2 + L)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return A && z && P && L ? { contorno: [g(-A / 2, -z / 2), g(A / 2, -z / 2), g(A / 2, -z / 2 + L), g(-A / 2 + P, -z / 2 + L), g(-A / 2 + P, z / 2 - L), g(A / 2, z / 2 - L), g(A / 2, z / 2), g(-A / 2, z / 2)] } : null;
    case "T":
      return A && z && P && L ? { contorno: [g(-P / 2, -z / 2), g(P / 2, -z / 2), g(P / 2, z / 2 - L), g(A / 2, z / 2 - L), g(A / 2, z / 2), g(-A / 2, z / 2), g(-A / 2, z / 2 - L), g(-P / 2, z / 2 - L)] } : null;
    case "L":
    case "2L":
      return A && z && P ? { contorno: [g(-A / 2, -z / 2), g(A / 2, -z / 2), g(A / 2, -z / 2 + P), g(-A / 2 + P, -z / 2 + P), g(-A / 2 + P, z / 2), g(-A / 2, z / 2)] } : null;
    default:
      return A && z ? { contorno: k(A, z) } : $ ? { contorno: S($) } : null;
  }
}
function Hi(t, y, g) {
  if (!t || t <= 0 || !y || !g || y <= 0 || g <= 0) return null;
  const k = Math.sqrt(Math.sqrt(g / y)), S = Math.sqrt(t / k), A = t / S;
  return !isFinite(S) || !isFinite(A) || S <= 0 || A <= 0 ? null : { contorno: [[-S / 2, -A / 2], [S / 2, -A / 2], [S / 2, A / 2], [-S / 2, A / 2]] };
}
function Ji(t) {
  const y = new wo();
  t.contorno.forEach(([g, k], S) => S ? y.lineTo(g, k) : y.moveTo(g, k)), y.closePath();
  for (const g of t.huecos ?? []) {
    const k = new Si();
    g.forEach(([S, A], z) => z ? k.lineTo(S, A) : k.moveTo(S, A)), k.closePath(), y.holes.push(k);
  }
  return y;
}
function Oi(t, y, g) {
  const k = new ut();
  k.name = "extrusion";
  const S = new va({ color: 8369151, transparent: true, opacity: 0.92, side: Lt }), A = new va({ color: 12623968, transparent: true, opacity: 0.85, side: Lt }), z = new va({ color: 11583173, transparent: true, opacity: 0.85, side: Lt }), $ = new ut();
  $.add(new Es(16777215, 0.55));
  const P = new Ho(16777215, 0.75);
  P.position.set(30, 25, 40);
  const L = new Ho(16777215, 0.35);
  L.position.set(-25, -20, 15), $.add(P, L);
  let Y = 0;
  return ue.derive(() => {
    var _a2, _b, _c, _d, _e;
    const N = ((_a2 = y.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++Y, on: N }, k.visible = N;
    for (const se of [...k.children]) se !== $ && (k.remove(se), (_c = (_b = se.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (k.children.includes($) || k.add($), !N) return;
    const ee = g.val ?? [], U = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], me = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, Q = me.sectionShapes ?? /* @__PURE__ */ new Map(), q = me.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      U.forEach((se, xe) => {
        var _a3, _b2, _c2;
        if (se.length === 2) {
          let he = Wi(Q.get(xe)), ye = true;
          if (he || (he = Hi((_a3 = me.areas) == null ? void 0 : _a3.get(xe), (_b2 = me.momentsOfInertiaY) == null ? void 0 : _b2.get(xe), (_c2 = me.momentsOfInertiaZ) == null ? void 0 : _c2.get(xe)), ye = false), !he) return;
          const de = ee[se[0]], K = ee[se[1]];
          if (!de || !K) return;
          const Z = Math.hypot(K[0] - de[0], K[1] - de[1], K[2] - de[2]);
          if (Z < 1e-9) return;
          const R = new ki(Ji(he), { depth: Z, bevelEnabled: false, curveSegments: 4 });
          R.applyMatrix4(new Oo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const G = new ct(R, ye ? S : A);
          G.position.set(de[0], de[1], de[2]), G.rotation.setFromRotationMatrix(Jo(de, K)), k.add(G);
          return;
        }
        if (se.length === 3 || se.length === 4) {
          const he = q.get(xe);
          if (!he || he <= 0) return;
          const ye = se.map((ge) => ee[ge]).filter(Boolean);
          if (ye.length < 3) return;
          const de = [ye[1][0] - ye[0][0], ye[1][1] - ye[0][1], ye[1][2] - ye[0][2]], K = [ye[2][0] - ye[0][0], ye[2][1] - ye[0][1], ye[2][2] - ye[0][2]], Z = de[1] * K[2] - de[2] * K[1], R = de[2] * K[0] - de[0] * K[2], G = de[0] * K[1] - de[1] * K[0], X = Math.hypot(Z, R, G);
          if (X < 1e-12) return;
          const T = [Z / X, R / X, G / X], H = [], pe = (ge) => ye.map((ve) => [ve[0] + T[0] * ge, ve[1] + T[1] * ge, ve[2] + T[2] * ge]), fe = Math.abs(T[2]) > 0.5, oe = T[2] > 0 ? -1 : 1, W = pe(fe ? 0 : +he / 2), Me = pe(fe ? oe * he : -he / 2), te = (ge, ve, Se) => H.push(...ge, ...ve, ...Se);
          for (const ge of [W, Me]) te(ge[0], ge[1], ge[2]), ge.length === 4 && te(ge[0], ge[2], ge[3]);
          for (let ge = 0; ge < ye.length; ge++) {
            const ve = (ge + 1) % ye.length;
            te(W[ge], Me[ge], Me[ve]), te(W[ge], Me[ve], W[ve]);
          }
          const Re = new Le();
          Re.setAttribute("position", new It(H, 3)), Re.computeVertexNormals(), k.add(new ct(Re, z));
        }
      });
    } catch (se) {
      ae = String((se == null ? void 0 : se.message) ?? se);
    }
    globalThis.__extrusionDebug = { corridas: Y, on: N, fallo: ae, nElementos: U.length, nFormas: Q.size, nEspesores: q.size, mallas: k.children.length - 1 };
  }), k;
}
function Rs(t, y, g = 0) {
  const k = [y[0] - t[0], y[1] - t[1], y[2] - t[2]], S = Math.hypot(k[0], k[1], k[2]) || 1, A = k[0] / S, z = k[1] / S, $ = k[2] / S, P = Math.sqrt(A * A + z * z);
  let L, Y, N;
  if (P < 1e-9) {
    const ee = $ > 0 ? 1 : -1;
    L = [0, 0, ee], Y = [1, 0, 0], N = [0, ee, 0];
  } else L = [A, z, $], Y = [-A * $ / P, -z * $ / P, P], N = [z / P, -A / P, 0];
  if (Math.abs(g) > 1e-12) {
    const ee = g * Math.PI / 180, U = Math.cos(ee), me = Math.sin(ee), Q = Y.map((ae, se) => U * ae + me * N[se]), q = N.map((ae, se) => -me * Y[se] + U * ae);
    Y = Q, N = q;
  }
  return { e1: L, e2: Y, e3: N };
}
function Aa(t, y) {
  if (!y) return [0, 0];
  const g = Number(y[0] ?? 0), k = Number(y[1] ?? 0);
  return t === "bendingsY" ? [g, -k] : [-g, k];
}
function Ts(t, y) {
  const g = (k) => k.map((S) => -S);
  switch (t) {
    case "bendingsZ":
      return g(y.e2);
    case "bendingsY":
      return g(y.e3);
    case "shearsZ":
      return y.e3;
    default:
      return y.e2;
  }
}
class Zo extends ut {
  constructor(y, g, k, S, A, z, $) {
    super();
    const P = new wo().moveTo(0, 0).lineTo(0, z[1]).lineTo(k, z[1]).lineTo(k, 0).lineTo(0, 0), L = P.getPoints(), Y = new Le().setFromPoints(L);
    this.lines = new Et(Y, new ft({ color: Xn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const N = new Wo(P), ee = new wt({ color: z[1] > 0 ? 24435 : 11411474, side: Lt });
    this.mesh = new ct(N, ee), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Rt(`${A[1].toFixed(4)}`), this.normalizedResult = z, this.textPosition = xo([y, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(S), this.add(this.text);
  }
  updateScale(y) {
    this.lines.scale.set(1, y * 2, 1), this.mesh.scale.set(1, y * 2, 1), this.text.updateScale(y * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * y);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Pa extends ut {
  constructor(y, g, k, S, A, z, $) {
    super();
    const P = A[0] * k / (A[0] + A[1]), L = A[0] * A[1] > 0;
    if (this.text = new Rt(`${A[0].toFixed(4)}`), this.text2 = new Rt(`${(A[1] * -1).toFixed(4)}`), this.normalizedResult = z, this.textPosition = Ca(y, g), this.text2Position = Ca(g, y), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(S), this.text2.rotation.setFromRotationMatrix(S), this.add(this.text, this.text2), L) {
      const Y = new wo().moveTo(0, 0).lineTo(0, z[0]).lineTo(P, 0).lineTo(0, 0), N = new wo().moveTo(P, 0).lineTo(k, -z[1]).lineTo(k, 0).lineTo(P, 0), ee = Y.getPoints(), U = N.getPoints(), me = new Le().setFromPoints(ee), Q = new Le().setFromPoints(U), q = new ft({ color: Xn().resultOutline });
      this.lines = new Et(me, q), this.lines2 = new Et(Q, q), this.lines.position.set(...y), this.lines2.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), this.lines2.rotation.setFromRotationMatrix(S), $ && this.lines.rotateX(Math.PI / 2), $ && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new Wo(Y), se = new Wo(N), xe = new wt({ color: z[0] > 0 ? 24435 : 11411474, side: Lt }), he = new wt({ color: -z[1] > 0 ? 24435 : 11411474, side: Lt });
      this.mesh = new ct(ae, xe), this.mesh2 = new ct(se, he), this.mesh.position.set(...y), this.mesh2.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), this.mesh2.rotation.setFromRotationMatrix(S), $ && this.mesh.rotateX(Math.PI / 2), $ && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const Y = new wo().moveTo(0, 0).lineTo(0, z[0]).lineTo(k, -z[1]).lineTo(k, 0).lineTo(0, 0), N = Y.getPoints(), ee = new Le().setFromPoints(N);
      this.lines = new Et(ee, new ft({ color: Xn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const U = new Wo(Y), me = new wt({ color: z[0] > 0 ? 24435 : 11411474, side: Lt });
      this.mesh = new ct(U, me), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(y) {
    var _a2, _b;
    this.lines.scale.set(1, y * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, y * 2, 1), this.mesh.scale.set(1, y * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, y * 2, 1), this.text.updateScale(y * 0.6), this.text2.updateScale(y * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * y), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * y);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Ds = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Ds || {});
function Qi(t, y, g, k) {
  const S = () => {
    const $ = g.rawVal;
    if (!($ == null ? void 0 : $.length)) return 0.05 * y.gridSize.rawVal;
    const P = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const N of $) for (let ee = 0; ee < 3; ee++) N[ee] < P[ee] && (P[ee] = N[ee]), N[ee] > L[ee] && (L[ee] = N[ee]);
    const Y = Math.hypot(L[0] - P[0], L[1] - P[1], L[2] - P[2]);
    return !isFinite(Y) || Y <= 0 ? 0.05 * y.gridSize.rawVal : 0.025 * Y;
  }, A = new ut(), z = { normals: Zo, shearsY: Zo, shearsZ: Zo, torsions: Zo, bendingsY: Pa, bendingsZ: Pa };
  return ue.derive(() => {
    var _a2, _b;
    if (y.deformedShape.val, g.val, y.frameResults.val == "none") return;
    A.children.forEach((P) => P.dispose()), A.clear();
    const $ = Ds[y.frameResults.rawVal];
    (_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal[$]) == null ? void 0 : _b.forEach((P, L) => {
      var _a3, _b2, _c, _d, _e, _f;
      const Y = ((_a3 = t.elements) == null ? void 0 : _a3.rawVal[L]) ?? [0, 1], N = g.rawVal[Y[0]], ee = g.rawVal[Y[1]];
      if (!N || !ee) return;
      const U = new F(...ee).distanceTo(new F(...N)), me = ji((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[$]), Q = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, L)) ?? 0, q = Rs(N, ee, Q), ae = Ts($, q), se = new F(...q.e1), xe = new F(...ae), he = new Oo().makeBasis(se, xe, se.clone().cross(xe)), [ye, de] = Aa($, P), K = z[$] === Pa ? [ye, -de] : [ye, de], Z = K.map((G) => G / (me === 0 ? 1 : me)), R = new z[$](N, ee, U, he, K, Z, false);
      R.updateScale(S() * k.rawVal), A.add(R);
    });
  }), ue.derive(() => {
    if (k.val, y.frameResults.rawVal == "none") return;
    y.gridSize.val;
    const $ = S();
    A.children.forEach((P) => P.updateScale($ * k.rawVal));
  }), ue.derive(() => {
    A.visible = y.frameResults.val != "none";
  }), A;
}
function ji(t) {
  let y = 0;
  return t == null ? void 0 : t.forEach((g) => {
    const k = Math.max(...(g ?? [0, 0]).map((S) => Math.abs(S)));
    k > y && (y = k);
  }), y;
}
class el extends ut {
  constructor(y, g, k) {
    super();
    const S = g === $a.reactions;
    k[0] && (this.xText1 = new Rt(`${S ? "Fx" : "Dx"}: ` + k[0].toFixed(4))), k[3] && (this.xText2 = new Rt(`${S ? "Mx" : "Rx"}: ` + k[3].toFixed(4))), k[1] && (this.yText1 = new Rt(`${S ? "Fy" : "Dy"}: ` + k[1].toFixed(4))), k[4] && (this.yText2 = new Rt(`${S ? "My" : "Ry"}: ` + k[4].toFixed(4))), k[2] && (this.zText1 = new Rt(`${S ? "Fz" : "Dz"}: ` + k[2].toFixed(4))), k[5] && (this.zText2 = new Rt(`${S ? "Mz" : "Rz"}: ` + k[5].toFixed(4))), (k[0] || k[3]) && (this.xArrow = new $n(new F(1, 0, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (k[1] || k[4]) && (this.yArrow = new $n(new F(0, 1, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (k[2] || k[5]) && (this.zArrow = new $n(new F(0, 0, 1), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...y), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(y) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(y, y, y), (_b = this.yArrow) == null ? void 0 : _b.scale.set(y, y, y), (_c = this.zArrow) == null ? void 0 : _c.scale.set(y, y, y), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * y, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * y, 0, 0.5 * y), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * y, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * y, 0.5 * y), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * y), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * y + 0.5 * y), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * y), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * y), (_l2 = this.yText1) == null ? void 0 : _l2.updateScale(0.4 * y), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * y), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * y), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * y);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var $a = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))($a || {});
function tl(t, y, g, k) {
  const S = new ut();
  return ue.derive(() => {
    var _a2, _b;
    if (y.deformedShape.val, y.nodeResults.val == "none") return;
    S.children.forEach(($) => $.dispose()), S.clear();
    const A = $a[y.nodeResults.rawVal], z = 0.05 * y.gridSize.val;
    (_b = (_a2 = t.deformOutputs) == null ? void 0 : _a2.val[A]) == null ? void 0 : _b.forEach(($, P) => {
      const L = new el(g.rawVal[P], A, $ ?? [0, 0, 0, 0, 0, 0]);
      L.updateScale(z * k.rawVal), S.add(L);
    });
  }), ue.derive(() => {
    if (k.val, y.nodeResults.rawVal == "none") return;
    const A = 0.05 * y.gridSize.val;
    S.children.forEach((z) => z.updateScale(A * k.rawVal));
  }), ue.derive(() => {
    S.visible = y.nodeResults.val != "none";
  }), S;
}
function nl({ drawingObj: t, gridObj: y, scene: g, getActiveCamera: k, controls: S, gridSize: A, derivedDisplayScale: z, rendererElm: $, viewerRender: P }) {
  var _a2;
  const L = new _a(), Y = new Pi(), N = (e) => {
    const o = $.getBoundingClientRect(), a = e.clientX - o.left, n = e.clientY - o.top, s = o.width || 1, r = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const i = s / 2;
      if (a >= i) return Y.x = (a - i) / i * 2 - 1, Y.y = -(n / r) * 2 + 1, window.__hekatanSplitCamera ?? k();
      Y.x = a / i * 2 - 1;
    } else Y.x = a / s * 2 - 1;
    return Y.y = -(n / r) * 2 + 1, k();
  }, ee = new ct(new En(1e4, 1e4), new wt({ side: Lt, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, g.add(ee);
  const U = (e, o, a) => {
    const n = new ct(new En(1e4, 1e4), new wt({ side: Lt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(e, o, a), n.visible = false, n.frustumCulled = false, g.add(n), n;
  }, me = U(Math.PI / 2, 0, 0), Q = U(0, Math.PI / 2, 0);
  let q = false, ae = null, se = null, xe = null;
  const he = new Et(new Le(), new ft({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  he.name = "ref-ifc-cadena", he.renderOrder = 1e3, he.frustumCulled = false, he.visible = false, g.add(he);
  const ye = (e, o, a) => Math.round(e * 1e3) + "," + Math.round(o * 1e3) + "," + Math.round(a * 1e3), de = (e) => {
    const o = /* @__PURE__ */ new Map();
    for (let a = 0; a + 0 < e.length / 6; a++) {
      const n = 6 * a;
      for (const s of [ye(e[n], e[n + 1], e[n + 2]), ye(e[n + 3], e[n + 4], e[n + 5])]) {
        const r = o.get(s);
        r ? r.push(a) : o.set(s, [a]);
      }
    }
    return o;
  }, K = (e) => {
    const { S: o, adj: a } = e, n = (x, M) => new F(o[6 * x + 3 * M], o[6 * x + 3 * M + 1], o[6 * x + 3 * M + 2]), s = /* @__PURE__ */ new Set([e.s]), r = (x, M) => {
      const E = [];
      let _ = x, C = M;
      for (let I = 0; I < 3e3; I++) {
        const j = (a.get(ye(C.x, C.y, C.z)) || []).filter((we) => !s.has(we));
        if (j.length !== 1) break;
        const V = j[0], B = n(V, 0), O = n(V, 1), le = B.distanceTo(C) < O.distanceTo(C) ? O : B, be = C.clone().sub(_).normalize(), $e = le.clone().sub(C).normalize();
        if (be.dot($e) < Math.cos(35 * Math.PI / 180)) break;
        s.add(V), E.push(le), _ = C, C = le;
      }
      return E;
    }, p = n(e.s, 0), i = n(e.s, 1), l = r(p, i), d = r(i, p), c = [...d.reverse(), p, i, ...l], m = d.length;
    if (c.length < 6) return c;
    const f = [], h = [];
    for (let x = 1; x < c.length; x++) f.push(c[x].distanceTo(c[x - 1]));
    for (let x = 1; x < c.length - 1; x++) {
      const M = c[x].clone().sub(c[x - 1]).normalize(), E = c[x + 1].clone().sub(c[x]).normalize();
      h.push(Math.acos(Math.max(-1, Math.min(1, M.dot(E)))) / Math.max(1e-6, (f[x - 1] + f[x]) / 2));
    }
    const b = h.map((x, M) => {
      let E = 0, _ = 0;
      for (let C = M - 1; C <= M + 1; C++) C >= 0 && C < h.length && (E += h[C], _++);
      return E / _;
    }), v = [];
    for (let x = 3; x < b.length - 3; x++) {
      const M = (b[x - 3] + b[x - 2] + b[x - 1]) / 3, E = (b[x + 1] + b[x + 2] + b[x + 3]) / 3, _ = Math.min(M, E), C = Math.max(M, E);
      C > 0.03 && C / Math.max(_, 1e-6) > 2.2 && Math.abs(b[x] - (M + E) / 2) < C && (!v.length || x - v[v.length - 1] > 3) && v.push(x + 1);
    }
    let w = 0, u = c.length - 1;
    for (const x of v) x <= m && x > w && (w = x), x > m && x < u && (u = x);
    return c.slice(w, u + 1);
  }, Z = (e) => {
    if (xe = e, !e || e.length < 2) {
      he.visible = false;
      return;
    }
    he.geometry.dispose(), he.geometry = new Le().setFromPoints(e), he.visible = true;
  }, R = (e) => {
    let o = 0;
    for (let m = 1; m < e.length - 1; m++) {
      const f = e[m].clone().sub(e[m - 1]).normalize(), h = e[m + 1].clone().sub(e[m]).normalize();
      o += Math.acos(Math.max(-1, Math.min(1, f.dot(h))));
    }
    const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (o < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const n = String(window.__hekatanArcModo ?? "angulo"), s = n === "x" ? 0 : n === "y" ? 1 : n === "z" ? 2 : -1, r = [0];
    for (let m = 1; m < e.length; m++) r.push(r[m - 1] + e[m].distanceTo(e[m - 1]));
    const p = (m, f) => {
      for (let h = 1; h < e.length; h++) {
        const b = m(e[h - 1], h - 1), v = m(e[h], h);
        if (b <= f && f <= v || v <= f && f <= b) {
          const w = Math.abs(v - b) < 1e-12 ? 0 : (f - b) / (v - b);
          return e[h - 1].clone().lerp(e[h], w);
        }
      }
      return e[e.length - 1].clone();
    }, i = [], l = s >= 0 ? e[0].getComponent(s) : 0, d = s >= 0 ? e[e.length - 1].getComponent(s) : 0, c = s >= 0 && Math.abs(d - l) > 1e-6 && e.every((m, f) => f === 0 || (m.getComponent(s) - e[f - 1].getComponent(s)) * (d - l) >= -1e-6);
    for (let m = 0; m <= a; m++) {
      const f = c ? p((h) => h.getComponent(s), l + (d - l) * m / a) : p((h, b) => r[b], r[r.length - 1] * m / a);
      i.push([f.x, f.y, f.z]);
    }
    return i[0] = e[0].toArray(), i[a] = e[e.length - 1].toArray(), i;
  };
  window.__hekatanCadenaIfc = () => (xe || []).map((e) => [e.x, e.y, e.z]);
  const G = /* @__PURE__ */ new Map(), X = (e) => {
    const o = G.get(e.id);
    if (o) return o;
    const a = e.geometry.getAttribute("position"), n = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(n * 9), r = new Float64Array(n * 3), p = new Int32Array(n * 3).fill(-1);
    if (a) {
      e.updateMatrixWorld();
      const l = new F();
      for (let b = 0; b < n * 3; b++) l.fromBufferAttribute(a, b).applyMatrix4(e.matrixWorld), s[3 * b] = l.x, s[3 * b + 1] = l.y, s[3 * b + 2] = l.z;
      const d = new F(), c = new F(), m = new F(), f = (b) => Math.round(s[3 * b] * 1e3) + "," + Math.round(s[3 * b + 1] * 1e3) + "," + Math.round(s[3 * b + 2] * 1e3), h = /* @__PURE__ */ new Map();
      for (let b = 0; b < n; b++) {
        const v = 3 * b;
        d.set(s[3 * (v + 1)] - s[3 * v], s[3 * (v + 1) + 1] - s[3 * v + 1], s[3 * (v + 1) + 2] - s[3 * v + 2]), c.set(s[3 * (v + 2)] - s[3 * v], s[3 * (v + 2) + 1] - s[3 * v + 1], s[3 * (v + 2) + 2] - s[3 * v + 2]), m.crossVectors(d, c).normalize(), r[3 * b] = m.x, r[3 * b + 1] = m.y, r[3 * b + 2] = m.z;
        for (let w = 0; w < 3; w++) {
          const u = f(v + w), x = f(v + (w + 1) % 3), M = u < x ? u + "|" + x : x + "|" + u, E = h.get(M);
          E ? E.push(b, w) : h.set(M, [b, w]);
        }
      }
      for (const b of h.values()) b.length === 4 && (p[3 * b[0] + b[1]] = b[2], p[3 * b[2] + b[3]] = b[0]);
    }
    const i = { V: s, N: r, vec: p, n };
    return G.set(e.id, i), i;
  }, T = new ct(new Le(), new wt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Lt }));
  T.name = "ref-ifc-cara", T.renderOrder = 999, T.frustumCulled = false, T.visible = false, g.add(T);
  let H = null;
  const pe = (e, o) => {
    const a = Math.cos(12 * Math.PI / 180), n = Math.cos(80 * Math.PI / 180), s = [e.N[3 * o], e.N[3 * o + 1], e.N[3 * o + 2]], r = new Uint8Array(e.n), p = [], i = [o];
    for (r[o] = 1; i.length && p.length < 4e4; ) {
      const l = i.pop();
      p.push(l);
      for (let d = 0; d < 3; d++) {
        const c = e.vec[3 * l + d];
        if (c < 0 || r[c]) continue;
        const m = e.N[3 * l] * e.N[3 * c] + e.N[3 * l + 1] * e.N[3 * c + 1] + e.N[3 * l + 2] * e.N[3 * c + 2], f = s[0] * e.N[3 * c] + s[1] * e.N[3 * c + 1] + s[2] * e.N[3 * c + 2];
        m >= a && f >= n && (r[c] = 1, i.push(c));
      }
    }
    return p;
  }, fe = (e, o, a) => {
    if (!e || o < 0 || !a) {
      H && (H = null, T.visible = false);
      return;
    }
    if (H && H.m === e && H.tris.indexOf(o) >= 0) {
      H.punto = a.clone();
      return;
    }
    const n = X(e), s = pe(n, o), r = new Float32Array(s.length * 9), p = new F();
    let i = true;
    s.forEach((l, d) => {
      for (let c = 0; c < 9; c++) r[9 * d + c] = n.V[9 * l + c];
      p.x += n.N[3 * l], p.y += n.N[3 * l + 1], p.z += n.N[3 * l + 2];
    }), p.normalize();
    for (const l of s) if (p.x * n.N[3 * l] + p.y * n.N[3 * l + 1] + p.z * n.N[3 * l + 2] < Math.cos(5 * Math.PI / 180)) {
      i = false;
      break;
    }
    T.geometry.dispose(), T.geometry = new Le(), T.geometry.setAttribute("position", new xt(r, 3)), T.material.color.set(i ? 3718648 : 16096779), T.visible = true, H = { m: e, t0: o, tris: s, normal: p, plana: i, punto: a.clone() };
  }, oe = (e, o) => {
    const a = new Uint8Array(e.n);
    for (const c of o) a[c] = 1;
    const n = (c) => Math.round(e.V[3 * c] * 1e3) + "," + Math.round(e.V[3 * c + 1] * 1e3) + "," + Math.round(e.V[3 * c + 2] * 1e3), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const c of o) for (let m = 0; m < 3; m++) {
      const f = e.vec[3 * c + m];
      if (f >= 0 && a[f]) continue;
      const h = 3 * c + m, b = 3 * c + (m + 1) % 3, v = n(h), w = n(b);
      r.set(v, new F(e.V[3 * h], e.V[3 * h + 1], e.V[3 * h + 2])), r.set(w, new F(e.V[3 * b], e.V[3 * b + 1], e.V[3 * b + 2])), (s.get(v) || s.set(v, []).get(v)).push(w), (s.get(w) || s.set(w, []).get(w)).push(v);
    }
    const p = /* @__PURE__ */ new Set();
    let i = [];
    for (const c of s.keys()) {
      if (p.has(c)) continue;
      const m = [c];
      p.add(c);
      let f = "", h = c;
      for (let b = 0; b < 1e5; b++) {
        const v = (s.get(h) || []).find((w) => w !== f && !p.has(w));
        if (!v) break;
        m.push(v), p.add(v), f = h, h = v;
      }
      m.length > i.length && (i = m);
    }
    const l = i.map((c) => r.get(c)), d = [];
    for (let c = 0; c < l.length; c++) {
      const m = l[(c + l.length - 1) % l.length], f = l[c], h = l[(c + 1) % l.length];
      if (f.distanceTo(m) < 1e-3) continue;
      const b = f.clone().sub(m).normalize(), v = h.clone().sub(f).normalize();
      b.dot(v) > Math.cos(3 * Math.PI / 180) || d.push(f);
    }
    return d;
  }, W = (e, o, a) => {
    const s = new _a(o.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
    return s.length ? s[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, o, a, n = 2) => {
    const s = new F(e[0], e[1], e[2]), r = new F(o[0], o[1], o[2]).normalize();
    let p = null;
    for (const i of [1, -1]) {
      const d = new _a(s, r.clone().multiplyScalar(i), 0, n).intersectObjects(a, false);
      d.length && (p == null || d[0].distance < p) && (p = d[0].distance);
    }
    return p;
  }, window.__hekatanCaraIfc = () => H ? { tris: H.tris.length, plana: H.plana, normal: H.normal.toArray(), punto: H.punto.toArray(), contorno: oe(X(H.m), H.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const Me = /* @__PURE__ */ new Map(), te = new jt(new Le(), new ft({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  te.name = "ref-ifc-bordes", te.frustumCulled = false, te.visible = false, g.add(te);
  const Re = 1, ge = (e, o, a) => Math.floor(e / Re) + "," + Math.floor(o / Re) + "," + Math.floor(a / Re), ve = (e) => {
    const o = Me.get(e.id);
    if (o) return o;
    const a = e.geometry.getAttribute("position"), n = [], s = /* @__PURE__ */ new Map();
    if (a) {
      e.updateMatrixWorld();
      const p = Math.floor(a.count / 3), i = new Float64Array(a.count * 3), l = new F();
      for (let w = 0; w < a.count; w++) l.fromBufferAttribute(a, w).applyMatrix4(e.matrixWorld), i[3 * w] = l.x, i[3 * w + 1] = l.y, i[3 * w + 2] = l.z;
      const d = (w) => Math.round(i[3 * w] * 1e3) + "," + Math.round(i[3 * w + 1] * 1e3) + "," + Math.round(i[3 * w + 2] * 1e3), c = new Float64Array(p * 3), m = new F(), f = new F(), h = new F();
      for (let w = 0; w < p; w++) {
        const u = 3 * w, x = 3 * w + 1, M = 3 * w + 2;
        m.set(i[3 * x] - i[3 * u], i[3 * x + 1] - i[3 * u + 1], i[3 * x + 2] - i[3 * u + 2]), f.set(i[3 * M] - i[3 * u], i[3 * M + 1] - i[3 * u + 1], i[3 * M + 2] - i[3 * u + 2]), h.crossVectors(m, f).normalize(), c[3 * w] = h.x, c[3 * w + 1] = h.y, c[3 * w + 2] = h.z;
      }
      const b = /* @__PURE__ */ new Map();
      for (let w = 0; w < p; w++) for (let u = 0; u < 3; u++) {
        const x = 3 * w + u, M = 3 * w + (u + 1) % 3, E = d(x), _ = d(M), C = E < _ ? E + "|" + _ : _ + "|" + E, I = b.get(C);
        I ? I.push(w) : b.set(C, [w, x, M]);
      }
      const v = Math.cos(25 * Math.PI / 180);
      for (const w of b.values()) {
        const u = w[0], x = w[1], M = w[2];
        let E = w.length === 3;
        if (!E && w.length === 4) {
          const C = w[3], I = c[3 * u] * c[3 * C] + c[3 * u + 1] * c[3 * C + 1] + c[3 * u + 2] * c[3 * C + 2];
          E = Math.abs(I) < v;
        }
        if (!E) continue;
        const _ = n.length / 6;
        n.push(i[3 * x], i[3 * x + 1], i[3 * x + 2], i[3 * M], i[3 * M + 1], i[3 * M + 2]);
        for (const [C, I, j] of [[i[3 * x], i[3 * x + 1], i[3 * x + 2]], [i[3 * M], i[3 * M + 1], i[3 * M + 2]], [(i[3 * x] + i[3 * M]) / 2, (i[3 * x + 1] + i[3 * M + 1]) / 2, (i[3 * x + 2] + i[3 * M + 2]) / 2]]) {
          const V = ge(C, I, j), B = s.get(V);
          B ? B[B.length - 1] !== _ && B.push(_) : s.set(V, [_]);
        }
      }
    }
    const r = { segs: new Float32Array(n), celdas: s };
    return Me.set(e.id, r), r;
  };
  let Se = "";
  const Xe = (e) => {
    const o = e.map((p) => p.id).join(",");
    if (o === Se) return;
    Se = o;
    const a = e.map((p) => ve(p).segs);
    let n = 0;
    for (const p of a) n += p.length;
    const s = new Float32Array(n);
    let r = 0;
    for (const p of a) s.set(p, r), r += p.length;
    te.geometry.dispose(), te.geometry = new Le(), te.geometry.setAttribute("position", new xt(s, 3)), te.visible = n > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    te.visible = Se !== "" && window.__hekatanRefIfcBordes !== false, P();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const o of Me.values()) e += o.segs.length / 6;
    return e;
  };
  const Ae = (e, o) => {
    const a = window.__hekatanCursorPx;
    if (!a) return null;
    const n = ve(e), s = n.segs, r = Math.floor(o.x / Re), p = Math.floor(o.y / Re), i = Math.floor(o.z / Re), l = /* @__PURE__ */ new Set();
    let d = Cn, c = null, m = Cn, f = null, h = -1;
    const b = new F(), v = new F();
    for (let w = -1; w <= 1; w++) for (let u = -1; u <= 1; u++) for (let x = -1; x <= 1; x++) {
      const M = n.celdas.get(r + w + "," + (p + u) + "," + (i + x));
      if (M) for (const E of M) {
        if (l.has(E)) continue;
        l.add(E);
        const _ = 6 * E;
        b.set(s[_], s[_ + 1], s[_ + 2]), v.set(s[_ + 3], s[_ + 4], s[_ + 5]);
        const C = Bn(b.x, b.y, b.z), I = Bn(v.x, v.y, v.z);
        if (!C || !I) continue;
        const j = Math.hypot(C.x - a.x, C.y - a.y), V = Math.hypot(I.x - a.x, I.y - a.y);
        j < d && (d = j, c = b.clone()), V < d && (d = V, c = v.clone());
        const B = I.x - C.x, O = I.y - C.y, le = B * B + O * O || 1e-9;
        let be = ((a.x - C.x) * B + (a.y - C.y) * O) / le;
        be = Math.max(0, Math.min(1, be));
        const $e = Math.hypot(a.x - (C.x + be * B), a.y - (C.y + be * O));
        $e < m && (m = $e, f = b.clone().lerp(v, be), h = E);
      }
    }
    return h >= 0 && (n.adj || (n.adj = de(n.segs)), se = { S: n.segs, adj: n.adj, s: h }), c ? { tipo: "ifcVert", punto: c } : f ? { tipo: "ifcEdge", punto: f } : null;
  }, nt = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((r) => {
      var _a4;
      ((_a4 = r.userData) == null ? void 0 : _a4.refIfc) && r.isMesh && e.push(r);
    }), !e.length) return te.visible = false, Se = "", null;
    Xe(e);
    const o = L.intersectObjects(e, false).filter((r) => {
      const p = r.object.material;
      return (p && p.clippingPlanes || []).every((l) => l.distanceToPoint(r.point) >= 0);
    });
    if (!o.length) return null;
    const a = o[0], n = o[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? fe(a.object, a.faceIndex ?? -1, a.point) : H && fe(null, -1, null);
    const s = Ae(a.object, a.point);
    if (s) return ae = { tipo: s.tipo }, [{ ...a, point: s.punto }];
    if (n && n.object === a.object && n.distance - a.distance <= 1.2) {
      const r = a.point.clone().add(n.point).multiplyScalar(0.5);
      return ae = { tipo: "ifcAxis" }, [{ ...a, point: r }];
    }
    return ae = { tipo: "ifc" }, [a];
  };
  let st = "", Ue = new Float32Array(0);
  const D = new jt(new Le(), new ft({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  D.name = "ref-ifc-seccion", D.renderOrder = 998, D.frustumCulled = false, D.visible = false, g.add(D);
  const J = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return D.visible = false, Ue = new Float32Array(0);
    const o = [];
    e.enableX && o.push([0, +e.posX]), e.enableY && o.push([1, +e.posY]), e.enableZ && o.push([2, +e.posZ]);
    const a = [];
    g.traverse((r) => {
      var _a3;
      ((_a3 = r.userData) == null ? void 0 : _a3.refIfc) && r.isMesh && a.push(r);
    });
    const n = JSON.stringify(o) + "|" + a.map((r) => r.id).join(",");
    if (n === st) return Ue;
    st = n;
    const s = [];
    if (o.length && a.length) {
      const r = [new F(), new F(), new F()];
      for (const p of a) {
        const i = p.geometry.getAttribute("position");
        if (i) {
          p.updateMatrixWorld();
          for (let l = 0; l + 2 < i.count; l += 3) {
            for (let d = 0; d < 3; d++) r[d].fromBufferAttribute(i, l + d).applyMatrix4(p.matrixWorld);
            for (const [d, c] of o) {
              const m = [r[0].getComponent(d) - c, r[1].getComponent(d) - c, r[2].getComponent(d) - c], f = [];
              for (let h = 0; h < 3; h++) {
                const b = r[h], v = r[(h + 1) % 3], w = m[h], u = m[(h + 1) % 3];
                (w < 0 && u >= 0 || w >= 0 && u < 0) && f.push(b.clone().lerp(v, w / (w - u)));
              }
              f.length === 2 && s.push(f[0].x, f[0].y, f[0].z, f[1].x, f[1].y, f[1].z);
            }
          }
        }
      }
    }
    return Ue = new Float32Array(s), D.geometry.dispose(), D.geometry = new Le(), D.geometry.setAttribute("position", new xt(Ue, 3)), D.visible = Ue.length > 0, Ue;
  };
  let re = null, ie = null;
  const _e = (e, o) => {
    const a = J();
    if (!a.length) return null;
    let n = Cn * 2, s = null, r = -1;
    const p = new F(), i = new F();
    for (let l = 0; l + 5 < a.length; l += 6) {
      p.set(a[l], a[l + 1], a[l + 2]), i.set(a[l + 3], a[l + 4], a[l + 5]);
      const d = Bn(p.x, p.y, p.z), c = Bn(i.x, i.y, i.z);
      if (!d || !c) continue;
      const m = c.x - d.x, f = c.y - d.y, h = m * m + f * f || 1e-9;
      let b = ((e - d.x) * m + (o - d.y) * f) / h;
      b = Math.max(0, Math.min(1, b));
      const v = Math.hypot(e - (d.x + b * m), o - (d.y + b * f));
      v < n && (n = v, s = p.clone().lerp(i, b), r = l / 6);
    }
    return r >= 0 && (ie !== a && (re = de(a), ie = a), se = { S: a, adj: re, s: r }), s;
  };
  let Ce = null;
  window.__hekatanSeccionIfc = () => J().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const o = J(), a = [], n = Math.max(1, Math.floor(o.length / 6 / e));
    for (let s = 0; s + 2 < o.length; s += 6 * n) a.push([o[s], o[s + 1], o[s + 2]]);
    return a;
  };
  const Ye = () => {
    ae = null;
    const e = nt();
    if (e) return e;
    if (q) return L.intersectObjects([ee], false);
    if (me.visible = !!window.__hekatanGridPlaneXZ, Q.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Zt.visible) {
      const n = L.intersectObjects([Zt, Wt, cn], false);
      if (n.length > 0) return n;
    }
    const a = [ee];
    return me.visible && a.push(me), Q.visible && a.push(Q), _n.visible && qn.length > 0 && a.push(...qn), L.intersectObjects(a, false);
  }, Ie = new Go(new Le(), new Ko()), Oe = new Go(new Le(), new Ko({ color: "gray", sizeAttenuation: false, size: 6 })), Ke = new Go(new Le(), new Ko({ color: "orange", sizeAttenuation: false, size: 5 }));
  g.add(Ke);
  const Pe = document.createElement("input");
  Pe.id = "hk-rubber-label", Pe.type = "text", Pe.spellcheck = false, Pe.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Pe.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(Pe);
  const Ne = document.createElement("div");
  Ne.id = "hk-rubber-angle", Ne.style.cssText = ["position:fixed", "z-index:99996", "pointer-events:none", "padding:2px 6px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px", "font-family:Consolas,monospace", "font-size:12px", "transform:translate(-50%,0)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ne);
  let Ze = null, lt = null, et = false;
  const gt = new F(), yt = (e, o, a, n, s, r) => {
    const p = n - e, i = s - o, l = r - a, d = Math.hypot(p, i, l);
    if (d < 0.01) {
      Pe.style.display = "none";
      return;
    }
    Ze = [e, o, a], lt = [p / d, i / d, l / d], gt.set((e + n) / 2, (o + s) / 2, (a + r) / 2), gt.project(k());
    const c = $.getBoundingClientRect(), m = c.left + (gt.x * 0.5 + 0.5) * c.width, f = c.top + (-gt.y * 0.5 + 0.5) * c.height;
    Pe.style.left = m + "px", Pe.style.top = f + "px", Pe.style.display = "block";
    const h = new F(e, o, a).project(k()), b = new F(n, s, r).project(k()), v = c.left + (h.x * 0.5 + 0.5) * c.width, w = c.top + (-h.y * 0.5 + 0.5) * c.height, u = c.left + (b.x * 0.5 + 0.5) * c.width, x = c.top + (-b.y * 0.5 + 0.5) * c.height;
    let M = Math.atan2(-(x - w), u - v) * 180 / Math.PI;
    if (M < 0 && (M += 360), Ne.textContent = `${Math.round(M) % 360}\xB0`, Ne.style.left = u + "px", Ne.style.top = x + 34 + "px", Ne.style.display = "block", !et) {
      if (Pe.value = `${d.toFixed(2)} m`, document.activeElement !== Pe) {
        const E = document.activeElement;
        E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA") && E !== Pe || Pe.focus({ preventScroll: true });
      }
      try {
        Pe.select();
      } catch {
      }
    }
  }, pn = () => {
    Pe.style.display = "none", Ne.style.display = "none", Ze = null, lt = null, et = false, document.activeElement === Pe && Pe.blur();
  }, _t = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      Nn = e, ce(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), Pe.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Je.length === 1) {
      const c = Je[0];
      Je = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, c[0], c[1], c[2], e), ce(`\u2713 C\xEDrculo r=${e} m en (${c[0].toFixed(2)}, ${c[1].toFixed(2)}, ${c[2].toFixed(2)}).`);
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
      Ct = e, ce(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), Pe.blur();
      return;
    }
    if (!Ze || !lt || !t.polylines) return;
    let a = lt[0], n = lt[1], s = lt[2];
    zt === "x" ? (a = Math.sign(a) || 1, n = 0, s = 0) : zt === "y" ? (a = 0, n = Math.sign(n) || 1, s = 0) : zt === "z" && (a = 0, n = 0, s = Math.sign(s) || 1);
    const r = Ze[0] + a * e, p = Ze[1] + n * e, i = Ze[2] + s * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [r, p, i]];
    const l = t.polylines.rawVal, d = l.length ? l[l.length - 1] : [];
    t.polylines.val = [...l.slice(0, -1), [...d, t.points.rawVal.length - 1]], Pe.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    P();
  }, Te = (e) => {
    let o = e.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const a = o.startsWith("@");
    if (a && (o = o.slice(1)), o.includes("<")) {
      const s = o.split("<").map((r) => parseFloat(r.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [r, p] = s;
        return a ? { kind: "relPolar", L: r, ang: p } : { kind: "absPolar", L: r, ang: p };
      }
      if (s.length === 3 && a) {
        const [r, p, i] = s;
        return { kind: "relSpherical", L: r, az: p, el: i };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((l) => parseFloat(l.trim()));
      if (s.some(isNaN)) return null;
      const [r, p, i = 0] = s;
      return a ? { kind: "relCart", dx: r, dy: p, dz: i } : { kind: "absCart", x: r, y: p, z: i };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, ot = (e) => {
    if (!e) return null;
    const o = window.__hekatanSCU ?? [0, 0, 0];
    if (e.kind === "absCart") return [o[0] + e.x, o[1] + e.y, o[2] + e.z];
    if (e.kind === "relCart") return Ze ? [Ze[0] + e.dx, Ze[1] + e.dy, Ze[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const a = e.ang * Math.PI / 180;
      return [o[0] + e.L * Math.cos(a), o[1] + e.L * Math.sin(a), o[2]];
    }
    if (e.kind === "relPolar") {
      if (!Ze) return null;
      const a = e.ang * Math.PI / 180;
      return [Ze[0] + e.L * Math.cos(a), Ze[1] + e.L * Math.sin(a), Ze[2]];
    }
    if (e.kind === "relSpherical") {
      if (!Ze) return null;
      const a = e.az * Math.PI / 180, n = e.el * Math.PI / 180, s = e.L * Math.cos(n);
      return [Ze[0] + s * Math.cos(a), Ze[1] + s * Math.sin(a), Ze[2] + e.L * Math.sin(n)];
    }
    return null;
  }, je = (e) => {
    var _a3, _b;
    wa(new F(e[0], e[1], e[2]), null), Ze = e, et = false;
    try {
      Pe.select();
    } catch {
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    P();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (e) => {
    var _a3;
    const o = Te(e);
    if (!o) return false;
    if (o.kind === "length") return _t(o.L), true;
    const a = ot(o);
    if (!a) return false;
    wa(new F(a[0], a[1], a[2]), null), Ze = a, Pe.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, Pe.addEventListener("keydown", (e) => {
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
      const a = Te(Pe.value);
      if (!a) return;
      if (et = false, a.kind === "length") _t(a.L), ce(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = ot(a);
        if (!n) return;
        je(n);
        const s = a.kind;
        ce(`\u270F ${s} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), et = false, Pe.blur();
      return;
    }
    const o = e.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!et && Pe.style.display === "block") try {
          Pe.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (et = true);
  }), window.addEventListener("keydown", (e) => {
    if (!Ze || !lt || document.activeElement === Pe) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (Pe.value = e.key, Pe.focus(), Pe.setSelectionRange(1, 1), e.preventDefault());
  });
  const Ee = document.createElement("div");
  Ee.id = "hk-coord-readout", Ee.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Ee.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Ee);
  const De = document.createElement("div");
  De.id = "hk-coord-fixed", De.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", De.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(De);
  const We = new Et(new Le().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new eo({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  We.frustumCulled = false, We.visible = false, We.name = "rubberBand", g.add(We), window.__hekatanRubberBand = We;
  const Be = new Et(new Le(), new ft({ color: 2282478, transparent: true, opacity: 0.9 }));
  Be.frustumCulled = false, Be.visible = false, g.add(Be);
  let at = [];
  const it = new Et(new Le(), new ft({ color: 16763904, transparent: true, opacity: 0.95 }));
  it.frustumCulled = false, it.visible = false, it.renderOrder = 999, g.add(it);
  let pt = [];
  const tt = document.createElement("div");
  tt.id = "hk-measure-label", tt.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(tt);
  const rt = (e) => {
    var _a3, _b;
    const o = N(e);
    if (!o) return null;
    L.setFromCamera(Y, o);
    let a = null, n = null;
    const s = L.intersectObjects(g.children, true).filter((f) => f.object.isMesh && f.object !== bt && f.object !== dt && f.object.visible !== false);
    if (s.length) {
      const f = s[0], h = f.point;
      a = [h.x, h.y, h.z];
      const v = (_b = (_a3 = f.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      v && f.face && (n = [f.face.a, f.face.b, f.face.c].map((w) => {
        const u = new F().fromBufferAttribute(v, w);
        return f.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const f = Ye();
      if (f.length) {
        const h = f[0].point;
        a = [h.x, h.y, h.z];
      }
    }
    if (!a) return null;
    const r = $.getBoundingClientRect(), p = (f) => {
      const h = new F(f[0], f[1], f[2]).project(o);
      return [r.left + (h.x * 0.5 + 0.5) * r.width, r.top + (-h.y * 0.5 + 0.5) * r.height];
    }, i = [e.clientX, e.clientY], l = 14;
    let d = a, c = l;
    const m = (f) => {
      const h = p(f), b = Math.hypot(h[0] - i[0], h[1] - i[1]);
      b < c && (c = b, d = f);
    };
    for (const f of n ?? []) m(f);
    for (const f of t.points.rawVal) m(f);
    return d;
  }, Ft = () => {
    if (pt.length < 1) {
      tt.style.display = "none";
      return;
    }
    const e = k(), o = pt[0], a = pt[1] ?? pt[0], s = new F((o[0] + a[0]) / 2, (o[1] + a[1]) / 2, (o[2] + a[2]) / 2).clone().project(e), r = $.getBoundingClientRect();
    tt.style.left = r.left + (s.x * 0.5 + 0.5) * r.width + "px", tt.style.top = r.top + (-s.y * 0.5 + 0.5) * r.height - 14 + "px", tt.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Ft, window.__hekatanClearMeasure = () => {
    pt = [], it.visible = false, tt.style.display = "none";
    try {
      P();
    } catch {
    }
  };
  try {
    (_a2 = S.addEventListener) == null ? void 0 : _a2.call(S, "change", Ft);
  } catch {
  }
  const dt = new ct(new Le(), new wt({ color: 16096779, transparent: true, opacity: 0.35, side: Lt, depthWrite: false }));
  dt.frustumCulled = false, dt.visible = false, dt.renderOrder = 998, dt.name = "hk-fill-preview", g.add(dt), $.addEventListener("pointerleave", () => {
    Ee.style.display = "none", dt.visible && (dt.visible = false, P());
  });
  const Kt = (e) => {
    var _a3, _b, _c, _d;
    const o = t.points.rawVal, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Map(), s = (w, u) => {
      w !== u && ((n.get(w) ?? n.set(w, /* @__PURE__ */ new Set()).get(w)).add(u), (n.get(u) ?? n.set(u, /* @__PURE__ */ new Set()).get(u)).add(w));
    };
    for (const w of a) for (let u = 0; u + 1 < w.length; u++) s(w[u], w[u + 1]);
    const r = (w, u) => {
      var _a4;
      return !!((_a4 = n.get(w)) == null ? void 0 : _a4.has(u));
    }, p = [], i = /* @__PURE__ */ new Set(), l = [...n.keys()];
    for (const w of l) for (const u of n.get(w)) if (!(u < w)) {
      for (const x of n.get(u)) if (x !== w) for (const M of n.get(x)) {
        if (M === w || M === u || !r(M, w) || r(w, x) || r(u, M)) continue;
        const E = [w, u, x, M].slice().sort((_, C) => _ - C).join("-");
        i.has(E) || (i.add(E), p.push([w, u, x, M]));
      }
    }
    for (const w of l) for (const u of n.get(w)) if (!(u < w)) for (const x of n.get(u)) {
      if (x === w || !r(x, w)) continue;
      const M = [w, u, x].slice().sort((E, _) => E - _).join("-");
      i.has(M) || (i.add(M), p.push([w, u, x]));
    }
    const d = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", c = (w) => d === "xy" ? [w[0], w[1]] : d === "xz" ? [w[0], w[2]] : [w[1], w[2]], m = c(e), f = (w, u) => {
      let x = false;
      for (let M = 0, E = u.length - 1; M < u.length; E = M++) {
        const _ = u[M][0], C = u[M][1], I = u[E][0], j = u[E][1];
        C > w[1] != j > w[1] && w[0] < (I - _) * (w[1] - C) / (j - C) + _ && (x = !x);
      }
      return x;
    }, h = (w) => {
      let u = 0;
      for (let x = 0, M = w.length - 1; x < w.length; M = x++) u += (w[M][0] + w[x][0]) * (w[M][1] - w[x][1]);
      return Math.abs(u) / 2;
    };
    let b = null, v = 1 / 0;
    for (const w of p) {
      const u = w.map((M) => c(o[M]));
      if (!f(m, u)) continue;
      const x = h(u);
      x < v && (v = x, b = w);
    }
    return b;
  }, kt = new ut(), Yt = new ct(new En(1, 1), new wt({ color: 2282478, transparent: true, opacity: 0.08, side: Lt, depthWrite: false })), en = new jt(new hs(new En(1, 1)), new ft({ color: 2282478, transparent: true, opacity: 0.85 })), Pt = new jt(new Le(), new ft({ color: 2282478, transparent: true, opacity: 0.3 })), bo = (e, o) => {
    const a = [], n = Math.ceil(e / o);
    for (let s = -n; s <= n; s++) {
      const r = s * o;
      a.push(-e, r, 0, e, r, 0), a.push(r, -e, 0, r, e, 0);
    }
    Pt.geometry.dispose(), Pt.geometry = new Le(), Pt.geometry.setAttribute("position", new It(a, 3));
  };
  kt.add(Yt, en, Pt), kt.visible = false, kt.frustumCulled = false, g.add(kt);
  const Xt = new ut();
  Xt.frustumCulled = false, Xt.visible = false, g.add(Xt);
  const Vn = (e) => {
    const o = new Le().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), a = new eo({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Et(o, a);
  }, bn = Vn(16711680), fn = Vn(65280), Ln = Vn(35071);
  Xt.add(bn, fn, Ln);
  const Un = [], jo = (e) => e.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Ut = Vn(16761856);
  Ut.material.dashSize = 0.28, Ut.material.gapSize = 0.16, Ut.material.opacity = 0.9, Ut.frustumCulled = false, Ut.visible = false, Ut.renderOrder = 98, g.add(Ut);
  const no = (e) => {
    const o = new Le().setFromPoints([new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0)]), a = new ft({ color: e, transparent: true, opacity: 0.2, depthTest: false }), n = new As(o, a);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, In = no(3462041), Zn = no(16724804), Rn = no(6333946), hn = new ut();
  hn.frustumCulled = false, hn.visible = false, g.add(hn), hn.add(In, Zn, Rn);
  const oo = (e) => {
    const o = new En(1, 1), a = new wt({ color: e, transparent: true, opacity: 0.06, side: Lt, depthWrite: false }), n = new ct(o, a);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Zt = oo(3462041), Wt = oo(16724804), cn = oo(6333946);
  hn.add(Zt, Wt, cn);
  const Mn = (e, o, a, n) => {
    e.scale.set(2 * n, 2 * n, 1), a === "xy" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, 0, 0)) : a === "xz" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, mn = document.createElement("div");
  mn.id = "hk-refplane-badge", mn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(mn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = e, hn.visible = e, e) {
      const o = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0], p = window.__hekatanOrthoExt ?? 8;
      vn(In, r, "xy", p), vn(Zn, r, "xz", p), vn(Rn, r, "yz", p), Mn(Zt, r, "xy", p), Mn(Wt, r, "xz", p), Mn(cn, r, "yz", p), Zt.material.opacity = 0.05, Wt.material.opacity = 0.05, cn.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    P();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a3;
    if (window.__hekatanOrthoExt = e, !hn.visible) {
      P();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0];
    vn(In, r, "xy", e), vn(Zn, r, "xz", e), vn(Rn, r, "yz", e), Mn(Zt, r, "xy", e), Mn(Wt, r, "xz", e), Mn(cn, r, "yz", e), P();
  };
  const Va = (e) => {
    if (Zt.material.opacity = e === "xy" ? 0.09 : 0.025, Wt.material.opacity = e === "xz" ? 0.09 : 0.025, cn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      mn.style.background = s.bg, mn.style.color = s.text, mn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, mn.style.display = "block";
    } else mn.style.display = "none";
  }, vn = (e, o, a, n) => {
    let s;
    a === "xy" ? s = [new F(o[0] - n, o[1] - n, o[2]), new F(o[0] + n, o[1] - n, o[2]), new F(o[0] + n, o[1] + n, o[2]), new F(o[0] - n, o[1] + n, o[2]), new F(o[0] - n, o[1] - n, o[2])] : a === "xz" ? s = [new F(o[0] - n, o[1], o[2] - n), new F(o[0] + n, o[1], o[2] - n), new F(o[0] + n, o[1], o[2] + n), new F(o[0] - n, o[1], o[2] + n), new F(o[0] - n, o[1], o[2] - n)] : s = [new F(o[0], o[1] - n, o[2] - n), new F(o[0], o[1] + n, o[2] - n), new F(o[0], o[1] + n, o[2] + n), new F(o[0], o[1] - n, o[2] + n), new F(o[0], o[1] - n, o[2] - n)], e.geometry.setFromPoints(s);
  };
  let zt = null;
  window.__hekatanAxisLock = () => zt;
  let Mo = null, Tt = null;
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
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== Pe) return;
    const a = e.key.toLowerCase(), n = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && n === "polyarea" && at.length >= 3) {
      const s = Eo();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") zt = zt === a ? null : a, La(), e.preventDefault();
    else if (e.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), as(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || To(), ce(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (Xt.visible = false), ce(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
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
  const vo = new F(), _o = new F(), Ia = new F(), Bs = (e) => {
    if (!zt) return null;
    const o = e[0], a = e[1], n = e[2];
    return zt === "x" ? (vo.set(o - 1e4, a, n), _o.set(o + 1e4, a, n)) : zt === "y" ? (vo.set(o, a - 1e4, n), _o.set(o, a + 1e4, n)) : (vo.set(o, a, n - 1e4), _o.set(o, a, n + 1e4)), L.ray.distanceSqToSegment(vo, _o, null, Ia), Ia;
  };
  window.__hekatanProjectOnAxis = Bs;
  const qt = new Et(new Le().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new ft({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  qt.renderOrder = 998, qt.frustumCulled = false, qt.visible = false, g.add(qt);
  let dn = -1, Pn = -1, zn = -1;
  const He = /* @__PURE__ */ new Set();
  window.__hekatanSelection = He;
  const wn = new Et(new Le().setFromPoints([new F(), new F()]), new ft({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  wn.renderOrder = 997, wn.frustumCulled = false, wn.visible = false, g.add(wn);
  const tn = new ct(new to(0.02, 12, 12), new wt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  tn.renderOrder = 998, tn.visible = false, g.add(tn);
  const ko = (e) => {
    const o = k();
    if (o.isOrthographicCamera) {
      const n = o, s = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(e);
    return Math.max(0.05, a / 10);
  }, Ra = () => {
    tn.visible && tn.scale.setScalar(ko(tn.position));
  }, yn = new ut();
  yn.frustumCulled = false, g.add(yn);
  const So = 2282478;
  let xn = null;
  const Ns = (e, o, a, n) => {
    if (!t.points) return -1;
    const s = t.points.rawVal;
    let r = -1, p = n;
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      if (!l) continue;
      const d = Math.hypot(e - l[0], o - l[1], a - l[2]);
      d < p && (p = d, r = i);
    }
    return r;
  }, nn = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; yn.children.length; ) {
      const p = yn.children.pop();
      (_b = (_a3 = p.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = p.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const p of He) {
      const [i, ...l] = p.split(":");
      if (i === "pt") {
        const d = e[+l[0]];
        if (!d) continue;
        const c = new ct(new to(0.025, 12, 12), new wt({ color: So, transparent: true, opacity: 0.9, depthTest: false }));
        c.position.set(d[0], d[1], d[2]), c.renderOrder = 999, c.__isSelectionPt = true, yn.add(c);
      } else if (i === "seg") {
        const d = o[+l[0]], c = e[d == null ? void 0 : d[+l[1]]], m = e[d == null ? void 0 : d[+l[1] + 1]];
        if (!c || !m) continue;
        const f = new Le().setFromPoints([new F(c[0], c[1], c[2]), new F(m[0], m[1], m[2])]), h = new Et(f, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        h.renderOrder = 999, yn.add(h);
      } else if (i === "poly") {
        const c = o[+l[0]].map((h) => {
          const b = e[h];
          return b ? new F(b[0], b[1], b[2]) : null;
        }).filter(Boolean);
        if (c.length < 2) continue;
        const m = new Le().setFromPoints(c), f = new Et(m, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, yn.add(f);
      } else if (i === "aux") {
        const d = n[+l[0]];
        if (!d || d.length !== 6) continue;
        const c = new Le().setFromPoints([new F(d[0], d[1], d[2]), new F(d[3], d[4], d[5])]), m = new Et(c, new ft({ color: So, transparent: true, opacity: 0.95, depthTest: false }));
        m.renderOrder = 999, yn.add(m);
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
    P();
  };
  window.__hekatanRefreshSelection = nn, window.__hekatanSelectIds = (e) => {
    var _a3;
    He.clear();
    for (const o of e) He.add(o);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return P(), He.size;
  }, window.__hekatanClearSelection = () => {
    He.clear(), nn();
  };
  const ao = (e, o, a, n, s, r, p, i, l) => {
    const d = p - n, c = i - s, m = l - r, f = d * d + c * c + m * m;
    if (f < 1e-12) return Math.hypot(e - n, o - s, a - r);
    let h = ((e - n) * d + (o - s) * c + (a - r) * m) / f;
    h = Math.max(0, Math.min(1, h));
    const b = n + h * d, v = s + h * c, w = r + h * m;
    return Math.hypot(e - b, o - v, a - w);
  }, ea = (e, o, a, n) => {
    if (!t.polylines) return null;
    const s = t.polylines.rawVal, r = t.points.rawVal;
    let p = -1, i = -1, l = n;
    for (let d = 0; d < s.length; d++) {
      const c = s[d];
      for (let m = 0; m < c.length - 1; m++) {
        const f = r[c[m]], h = r[c[m + 1]];
        if (!f || !h) continue;
        const b = ao(e, o, a, f[0], f[1], f[2], h[0], h[1], h[2]);
        b < l && (l = b, p = d, i = m);
      }
    }
    return p >= 0 ? { polyIdx: p, segIdx: i, dist: l } : null;
  }, Ta = (e, o, a, n) => {
    const s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let p = -1, i = n;
    for (let l = 0; l < r.length; l++) {
      const d = r[l];
      if (!d || d.length !== 6) continue;
      const c = ao(e, o, a, d[0], d[1], d[2], d[3], d[4], d[5]);
      c < i && (i = c, p = l);
    }
    return p;
  }, Ys = (e) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[e];
    if (!n || n.length !== 6) {
      qt.visible = false;
      return;
    }
    qt.geometry.setFromPoints([new F(n[0], n[1], n[2]), new F(n[3], n[4], n[5])]), qt.visible = true;
  }, Xs = (e, o = -1) => {
    var _a3, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal[e], n = t.points.rawVal;
    if (!a || a.length < 2) {
      qt.visible = false;
      return;
    }
    const s = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, r = [];
    if (s || o < 0 || o >= a.length - 1) for (const p of a) {
      const i = n[p];
      i && r.push(new F(i[0], i[1], i[2]));
    }
    else {
      const p = n[a[o]], i = n[a[o + 1]];
      p && r.push(new F(p[0], p[1], p[2])), i && r.push(new F(i[0], i[1], i[2]));
    }
    qt.geometry.setFromPoints(r), qt.visible = true;
  }, Po = (e) => {
    var _a3;
    if (!t.polylines) return;
    const o = t.polylines.rawVal;
    if (e < 0 || e >= o.length) return;
    const a = o.filter((l, d) => d !== e), n = /* @__PURE__ */ new Set();
    for (const l of a) for (const d of l) n.add(d);
    const s = t.points.rawVal, r = /* @__PURE__ */ new Map(), p = [];
    for (let l = 0; l < s.length; l++) n.has(l) && (r.set(l, p.length), p.push(s[l]));
    const i = a.map((l) => l.map((d) => r.get(d)).filter((d) => d !== void 0));
    t.points.val = p, t.polylines.val = i, t.areas && (t.areas.val = t.areas.rawVal.filter((l) => l !== e).map((l) => l > e ? l - 1 : l)), qt.visible = false, dn = -1, Pn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, Da = (e, o) => {
    var _a3, _b, _c;
    if (!t.polylines) return;
    const a = t.polylines.rawVal;
    if (e < 0 || e >= a.length) return;
    if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      Po(e);
      return;
    }
    const s = a[e];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      Po(e);
      return;
    }
    let r;
    o === 0 ? r = [s.slice(1)] : o === s.length - 2 ? r = [s.slice(0, -1)] : r = [s.slice(0, o + 1), s.slice(o + 1)];
    const p = [...a.slice(0, e), ...r, ...a.slice(e + 1)], i = /* @__PURE__ */ new Set();
    for (const f of p) for (const h of f) i.add(h);
    const l = t.points.rawVal, d = /* @__PURE__ */ new Map(), c = [];
    for (let f = 0; f < l.length; f++) i.has(f) && (d.set(f, c.length), c.push(l[f]));
    const m = p.map((f) => f.map((h) => d.get(h)).filter((h) => h !== void 0));
    if (t.points.val = c, t.polylines.val = m, t.areas) {
      const f = r.length - 1;
      t.areas.val = t.areas.rawVal.map((h) => h > e ? h + f : h);
    }
    qt.visible = false, dn = -1, Pn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Ie.geometry.setAttribute("position", new It(t.points.rawVal.flat(), 3)), Ie.geometry.computeBoundingSphere(), Ie.frustumCulled = false, Oe.frustumCulled = false, g.add(Oe), ee.position.set(0, 0, 0), ee.rotateX(Math.PI / 2), ee.geometry.rotateX(Math.PI / 2), ee.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, o, a) => {
    if (t.points.val = [...t.points.rawVal, [e, o, a]], t.polylines) {
      const n = t.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
      t.polylines.val = [...n.slice(0, -1), [...s, t.points.rawVal.length - 1]];
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
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = `${e.length}|${o.length}|${o.reduce((s, r) => s + r.length, 0)}`;
    if (a === Na) return Ba;
    Na = a;
    const n = [];
    for (const s of o) {
      const r = s.length;
      if (r < 6 || s[0] !== s[r - 1]) continue;
      const p = s.slice(0, r - 1).map((c) => e[c]).filter(Boolean);
      if (p.length < 5) continue;
      const i = [0, 1, 2].map((c) => p.reduce((m, f) => m + f[c], 0) / p.length), l = p.map((c) => Math.hypot(c[0] - i[0], c[1] - i[1], c[2] - i[2])), d = l.reduce((c, m) => c + m, 0) / l.length;
      d < 1e-9 || l.some((c) => Math.abs(c - d) > 5e-3 * d) || n.push({ c: i, r: d });
    }
    return Ba = n;
  };
  window.__hekatanCentrosDeducidos = Ya;
  const Co = () => !!window.__hekatanCurvasAux, Ao = (e, o) => {
    const a = window.__hekatanDrawingAuxLines;
    if (!a) return 0;
    St();
    const n = a.rawVal ?? a.val ?? [], s = [];
    for (let r = 0; r + 1 < e.length; r++) s.push([...e[r], ...e[r + 1]]);
    return o && e.length > 2 && s.push([...e[e.length - 1], ...e[0]]), a.val = [...n, ...s], s.length;
  };
  window.__hekatanDrawCircle = (e, o, a, n, s = window.__hekatanArcSegs ?? 12, r = "xy") => {
    var _a3;
    const p = Math.max(4, Math.round(s)), i = t.points.rawVal.length, l = [];
    for (let d = 0; d < p; d++) {
      const c = 2 * Math.PI * d / p, m = n * Math.cos(c), f = n * Math.sin(c);
      let h;
      r === "xy" ? h = [e + m, o + f, a] : r === "xz" ? h = [e + m, o, a + f] : h = [e, o + m, a + f], l.push(h);
    }
    if (zo.push({ c: [e, o, a], r: n }), Co()) {
      Ao(l, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...l], t.polylines) {
      const d = [...l.map((m, f) => i + f), i], c = t.polylines.rawVal;
      ((_a3 = c[c.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [...c, d, []] : t.polylines.val = [...c.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawArc = (e, o, a, n = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const s = Math.max(4, Math.round(n)), r = new F(...e), p = new F(...o), i = new F(...a), l = new F().subVectors(p, r), d = new F().subVectors(i, r), c = new F().crossVectors(l, d), m = 2 * c.lengthSq();
    let f;
    if (m < 1e-12) f = new F().addVectors(r, i).multiplyScalar(0.5);
    else {
      const le = d.clone().multiplyScalar(l.lengthSq()).sub(l.clone().multiplyScalar(d.lengthSq())), be = new F().crossVectors(le, c);
      f = r.clone().add(be.divideScalar(m));
    }
    const h = r.distanceTo(f), b = c.lengthSq() > 1e-12 ? c.clone().normalize() : new F(0, 1, 0), v = new F().subVectors(r, f).normalize(), w = new F().crossVectors(b, v).normalize(), u = (le) => {
      const be = new F().subVectors(le, f);
      return Math.atan2(be.dot(w), be.dot(v));
    }, x = (le) => {
      let be = le;
      for (; be < 0; ) be += 2 * Math.PI;
      for (; be >= 2 * Math.PI; ) be -= 2 * Math.PI;
      return be;
    }, M = x(u(p)), E = x(u(i)), _ = M <= E ? E : E - 2 * Math.PI, C = t.points.rawVal.length, I = [], j = (le) => {
      const be = v.clone().multiplyScalar(Math.cos(le)).add(w.clone().multiplyScalar(Math.sin(le)));
      return f.clone().add(be.multiplyScalar(h));
    }, V = String(window.__hekatanArcModo ?? "angulo"), B = V === "x" ? 0 : V === "y" ? 1 : V === "z" ? 2 : -1;
    let O = false;
    if (B >= 0) {
      const le = e[B], be = a[B], $e = 512;
      let we = Math.abs(be - le) > 1e-9, Ve = le;
      for (let ke = 1; ke <= $e && we; ke++) {
        const qe = j(_ * ke / $e).getComponent(B);
        (qe - Ve) * (be - le) < -1e-9 && (we = false), Ve = qe;
      }
      if (we) {
        O = true;
        for (let ke = 0; ke <= s; ke++) {
          const qe = le + (be - le) * ke / s;
          let Fe = 0, ze = _;
          for (let Qe = 0; Qe < 60; Qe++) {
            const mt = (Fe + ze) / 2;
            (j(mt).getComponent(B) - qe) * (be - le) < 0 ? Fe = mt : ze = mt;
          }
          const Ge = j((Fe + ze) / 2);
          I.push([Ge.x, Ge.y, Ge.z]);
        }
        I[0] = [e[0], e[1], e[2]], I[s] = [a[0], a[1], a[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${V.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!O) for (let le = 0; le <= s; le++) {
      const be = j(_ * (le / s));
      I.push([be.x, be.y, be.z]);
    }
    if (zo.push({ c: [f.x, f.y, f.z], r: h }), Co()) {
      Ao(I, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...I], t.polylines) {
      const le = I.map(($e, we) => C + we), be = t.polylines.rawVal;
      t.polylines.val = [...be.slice(0, -1), le, []];
    }
  };
  const Xa = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    for (let o = e.length - 1; o >= 0; o--) if (e[o] && e[o].length >= 2) return { i: o, pl: e[o] };
    return null;
  };
  window.__hekatanDividir = (e) => {
    var _a3;
    const o = Math.round(e);
    if (!(o >= 2)) return { ok: false, msg: "el n\xFAmero de partes va de 2 en adelante" };
    const a = Xa();
    if (!a) return { ok: false, msg: "no hay ninguna polil\xEDnea que dividir" };
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const n = [...t.points.rawVal], s = [a.pl[0]];
    let r = 0;
    for (let i = 0; i + 1 < a.pl.length; i++) {
      const l = n[a.pl[i]], d = n[a.pl[i + 1]];
      r += Math.hypot(d[0] - l[0], d[1] - l[1], d[2] - l[2]);
      for (let c = 1; c < o; c++) {
        const m = c / o;
        n.push([l[0] + (d[0] - l[0]) * m, l[1] + (d[1] - l[1]) * m, l[2] + (d[2] - l[2]) * m]), s.push(n.length - 1);
      }
      s.push(a.pl[i + 1]);
    }
    const p = [...t.polylines.rawVal];
    p[a.i] = s, t.points.val = n, t.polylines.val = p;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return P(), { ok: true, tramosAntes: a.pl.length - 1, tramosAhora: s.length - 1, nudosNuevos: s.length - a.pl.length, largo: +r.toFixed(4), tramoMedio: +(r / (s.length - 1)).toFixed(4) };
  }, window.__hekatanDesfasarCurva = (e) => {
    var _a3, _b, _c, _d;
    if (!isFinite(e) || Math.abs(e) < 1e-9) return { ok: false, msg: "la distancia no puede ser cero" };
    const o = Xa();
    if (!o) return { ok: false, msg: "no hay ninguna polil\xEDnea que desfasar" };
    const a = t.points.rawVal, n = o.pl.map((h) => new F(...a[h])), s = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), r = new F(...s === "xz" ? [0, 1, 0] : s === "yz" ? [1, 0, 0] : [0, 0, 1]), p = (h, b) => {
      const v = new F().subVectors(b, h), w = new F().crossVectors(r, v);
      return w.lengthSq() < 1e-18 ? null : w.normalize();
    }, i = n.map((h, b) => {
      const v = b > 0 ? p(n[b - 1], n[b]) : null, w = b + 1 < n.length ? p(n[b], n[b + 1]) : null;
      if (v && w) {
        const u = v.clone().add(w);
        if (u.lengthSq() < 1e-12) return v;
        u.normalize();
        const x = u.dot(v);
        return u.multiplyScalar(Math.abs(x) < 1e-6 ? 1 : 1 / x);
      }
      return v ?? w;
    });
    if (i.some((h) => h === null)) return { ok: false, msg: "la curva es perpendicular al plano de trabajo; cambie de plano" };
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const l = [...a], d = [];
    n.forEach((h, b) => {
      const v = h.clone().addScaledVector(i[b], e);
      l.push([v.x, v.y, v.z]), d.push(l.length - 1);
    });
    const c = [...t.polylines.rawVal];
    c.length && c[c.length - 1].length === 0 && c.pop(), c.push(d, []), t.points.val = l, t.polylines.val = c;
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    P();
    let m = 1 / 0, f = -1 / 0;
    for (let h = 0; h + 1 < n.length; h++) {
      const b = n[h], v = n[h + 1], w = p(b, v), u = new F(...l[d[h]]), x = Math.abs(new F().subVectors(u, b).dot(w));
      m = Math.min(m, x), f = Math.max(f, x);
    }
    return { ok: true, vertices: d.length, distancia: +e.toFixed(4), separacionMin: +m.toFixed(5), separacionMax: +f.toFixed(5) };
  }, window.__hekatanDrawCercha = (e) => {
    var _a3, _b;
    const o = e.luz, a = e.flecha, n = e.canto, s = Math.max(2, Math.round(e.panos)), r = e.tipo ?? "montantes", p = e.x0 ?? 0, i = e.y0 ?? 0, l = e.base ?? 0, d = Math.max(1, Math.round(e.copias ?? 1)), c = e.sep ?? 0;
    if (!(o > 0) || !(a > 0) || !(n > 0)) return { ok: false, msg: "luz, flecha y canto tienen que ser positivos" };
    const m = (o * o / 4 + a * a) / (2 * a);
    if (n >= m) return { ok: false, msg: `el canto (${n} m) no puede llegar al radio (${m.toFixed(3)} m)` };
    const f = 2 * Math.asin(Math.min(1, o / 2 / m)), h = l - (m - a), b = Math.atan2(l - h, p - (p + o / 2)), v = Math.atan2(l - h, p + o - (p + o / 2)), w = p + o / 2, u = (we, Ve, ke) => [w + Ve * Math.cos(we), ke, h + Ve * Math.sin(we)];
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const x = [...t.points.rawVal], M = [...((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []];
    M.length && M[M.length - 1].length === 0 && M.pop();
    const E = (we) => (x.push(we), x.length - 1), _ = (we, Ve) => {
      M.push([we, Ve]);
    }, C = [];
    let I = 0, j = 0;
    for (let we = 0; we < d; we++) {
      const Ve = i + we * c, ke = [], qe = [];
      for (let Fe = 0; Fe <= s; Fe++) {
        const ze = b + (v - b) * (Fe / s);
        ke.push(E(u(ze, m, Ve))), qe.push(E(u(ze, m - n, Ve)));
      }
      C.push(ke), M.push([...ke]), M.push([...qe]), _(ke[0], qe[0]), _(ke[s], qe[s]), j += 2;
      for (let Fe = 1; Fe < s; Fe++) if ((r === "montantes" || r === "howe") && (_(ke[Fe], qe[Fe]), j++), r === "warren") Fe % 2 === 1 && (_(qe[Fe - 1], ke[Fe]), _(ke[Fe], qe[Fe + 1]), I += 2);
      else if (r === "howe") {
        const ze = Fe < s / 2 ? 1 : -1;
        _(qe[Fe], ke[Fe + ze]), I++;
      }
    }
    if (e.correas && d > 1) for (let we = 0; we + 1 < d; we++) for (let Ve = 0; Ve <= s; Ve++) _(C[we][Ve], C[we + 1][Ve]);
    M.push([]), t.points.val = x, t.polylines && (t.polylines.val = M);
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    P();
    const V = (we, Ve) => u(b + (v - b) * (we / s), Ve, 0), B = (we, Ve) => Math.hypot(we[0] - Ve[0], we[1] - Ve[1], we[2] - Ve[2]), O = [], le = [], be = [];
    for (let we = 0; we < s; we++) {
      O.push(B(V(we, m), V(we + 1, m))), le.push(B(V(we, m - n), V(we + 1, m - n)));
      const Ve = [V(we + 1, m)[0] - V(we, m - n)[0], 0, V(we + 1, m)[2] - V(we, m - n)[2]];
      be.push(Math.atan2(Ve[2], Ve[0]) * 180 / Math.PI);
    }
    const $e = (we) => +we.toFixed(3);
    return { ok: true, luz: $e(o), flecha: $e(a), canto: $e(n), radio: $e(m), anguloAbarcado: $e(f * 180 / Math.PI), clave: $e(l + a), centro: [$e(w), $e(i), $e(h)], panos: s, tipo: r, cerchas: d, separacion: $e(c), desarrolloSup: $e(m * f), desarrolloInf: $e((m - n) * f), tramoSupMin: $e(Math.min(...O)), tramoSupMax: $e(Math.max(...O)), tramoInfMin: $e(Math.min(...le)), tramoInfMax: $e(Math.max(...le)), anguloDiagMin: $e(Math.min(...be)), anguloDiagMax: $e(Math.max(...be)), montantes: j, diagonales: I, nudosNuevos: 2 * (s + 1) * d };
  }, window.__hekatanDrawPolinomio = (e, o = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const a = e.length;
    if (a < 2) return { ok: false, msg: "faltan puntos" };
    const n = Math.max(a - 1, Math.round(o)), s = (_) => Math.max(...e.map((C) => C[_])) - Math.min(...e.map((C) => C[_])), r = [s(0), s(1), s(2)], p = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), i = p === "xy" ? 2 : p === "xz" ? 1 : p === "yz" ? 0 : -1, l = i >= 0 && r[i] < 1e-6 ? i : r[2] <= r[0] && r[2] <= r[1] ? 2 : r[1] <= r[0] ? 1 : 0, d = l === 2 ? "xy" : l === 1 ? "xz" : "yz", c = [0, 1, 2].filter((_) => _ !== l), [m, f] = r[c[0]] >= r[c[1]] ? c : [c[1], c[0]], h = e.map((_) => _[m]), b = e.map((_) => _[f]);
    for (let _ = 0; _ < a; _++) for (let C = _ + 1; C < a; C++) if (Math.abs(h[_] - h[C]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[m]} en ${d.toUpperCase()}): no hay polinomio que pase por los dos` };
    const v = (_) => {
      let C = 0;
      for (let I = 0; I < a; I++) {
        let j = 1;
        for (let V = 0; V < a; V++) V !== I && (j *= (_ - h[V]) / (h[I] - h[V]));
        C += b[I] * j;
      }
      return C;
    }, w = (() => {
      const _ = a, C = h.map((V) => Array.from({ length: _ }, (B, O) => V ** O)), I = b.slice();
      for (let V = 0; V < _; V++) {
        let B = V;
        for (let O = V + 1; O < _; O++) Math.abs(C[O][V]) > Math.abs(C[B][V]) && (B = O);
        [C[V], C[B]] = [C[B], C[V]], [I[V], I[B]] = [I[B], I[V]];
        for (let O = V + 1; O < _; O++) {
          const le = C[O][V] / C[V][V];
          for (let be = V; be < _; be++) C[O][be] -= le * C[V][be];
          I[O] -= le * I[V];
        }
      }
      const j = new Array(_).fill(0);
      for (let V = _ - 1; V >= 0; V--) {
        let B = I[V];
        for (let O = V + 1; O < _; O++) B -= C[V][O] * j[O];
        j[V] = B / C[V][V];
      }
      return j;
    })(), u = h[0], x = h[a - 1], M = t.points.rawVal.length, E = [];
    for (let _ = 0; _ <= n; _++) {
      const C = u + (x - u) * _ / n, I = [e[0][0], e[0][1], e[0][2]];
      I[m] = C, I[f] = v(C), I[l] = e[0][l], E.push(I);
    }
    if (E[0] = [e[0][0], e[0][1], e[0][2]], E[n] = [e[a - 1][0], e[a - 1][1], e[a - 1][2]], Co()) return Ao(E, false), { ok: true, plano: d, coef: w, ia: m, io: f };
    if (t.points.val = [...t.points.rawVal, ...E], t.polylines) {
      const _ = E.map((I, j) => M + j), C = t.polylines.rawVal;
      t.polylines.val = ((_d = C[C.length - 1]) == null ? void 0 : _d.length) > 0 ? [...C, _, []] : [...C.slice(0, -1), _, []];
    }
    return { ok: true, plano: d, coef: w, ia: m, io: f };
  };
  const Ua = () => {
    var _a3, _b;
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), n = window.__hekatanDrawingAuxLines, s = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? [], r = [], p = [], i = /* @__PURE__ */ new Set(), l = (d) => [e[d][0], e[d][1], e[d][2]];
    return [...He].forEach((d) => {
      const c = d.split(":");
      if (c[0] === "aux") {
        const f = s[+c[1]];
        f && f.length === 6 && (r.push([[f[0], f[1], f[2]], [f[3], f[4], f[5]]]), p.push(d));
        return;
      }
      const m = c[0] === "poly" || c[0] === "seg" ? +c[1] : -1;
      if (!(m < 0 || !o[m] || a.has(m))) if (c[0] === "poly") {
        if (i.has(m)) return;
        i.add(m);
        for (let f = 0; f + 1 < o[m].length; f++) r.push([l(o[m][f]), l(o[m][f + 1])]);
      } else {
        const f = o[m][+c[2]], h = o[m][+c[2] + 1];
        f != null && h != null && !i.has(m) && r.push([l(f), l(h)]);
      }
    }), { segs: r, auxIds: p };
  }, so = (e, o) => Math.abs(e[0] - o[0]) < 1e-6 && Math.abs(e[1] - o[1]) < 1e-6 && Math.abs(e[2] - o[2]) < 1e-6, Us = (e) => {
    const o = new Array(e.length).fill(false), a = [];
    for (let n = 0; n < e.length; n++) {
      if (o[n]) continue;
      o[n] = true;
      const s = [e[n][0], e[n][1]];
      let r = true;
      for (; r; ) {
        r = false;
        for (let i = 0; i < e.length; i++) {
          if (o[i]) continue;
          const [l, d] = e[i], c = s[s.length - 1], m = s[0];
          so(l, c) ? (s.push(d), o[i] = true, r = true) : so(d, c) ? (s.push(l), o[i] = true, r = true) : so(d, m) ? (s.unshift(l), o[i] = true, r = true) : so(l, m) && (s.unshift(d), o[i] = true, r = true);
        }
      }
      const p = s.length > 3 && so(s[0], s[s.length - 1]);
      p && s.pop(), a.push({ pts: s, cerrada: p });
    }
    return a;
  }, ta = (e, o) => {
    let a = e.findIndex((n) => Math.abs(n[0] - o[0]) < 1e-3 && Math.abs(n[1] - o[1]) < 1e-3 && Math.abs(n[2] - o[2]) < 1e-3);
    return a < 0 && (a = e.length, e.push(o)), a;
  }, Za = (e) => {
    if (!e.length) return 0;
    He.clear(), e.forEach((a) => He.add(a));
    const o = e.length;
    return ca(), He.clear(), o;
  };
  window.__hekatanRevolveSelection = (e, o, a, n = 360) => {
    var _a3, _b, _c;
    const s = Math.max(3, Math.round(a || 16)), r = Math.abs(n - 360) < 1e-9, p = s, i = r ? s : s + 1, { segs: l, auxIds: d } = Ua();
    if (!l.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (r && s % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    St();
    const c = t.points.rawVal, m = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], f = [...c];
    let h = m.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const b = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], v = /* @__PURE__ */ new Map(), w = (I) => I.map((j) => Math.round(j * 1e4)).join(","), u = (I) => Math.hypot(I[0] - e, I[1] - o) < 1e-6, x = (I) => {
      const j = w(I);
      let V = v.get(j);
      if (V) return V;
      if (u(I)) return V = [ta(f, I)], v.set(j, V), V;
      const B = Math.hypot(I[0] - e, I[1] - o), O = Math.atan2(I[1] - o, I[0] - e);
      V = [];
      for (let le = 0; le < i; le++) {
        const be = O + n * Math.PI / 180 * le / s;
        V.push(ta(f, le === 0 ? I : [e + B * Math.cos(be), o + B * Math.sin(be), I[2]]));
      }
      return v.set(j, V), V;
    };
    let M = 0, E = false;
    const _ = (I) => {
      b.push(h.length), h.push([...I, I[0]]), M++;
    };
    for (const [I, j] of l) {
      const V = x(I), B = x(j);
      if (!(V.length === 1 && B.length === 1)) {
        if (V.length === 1 || B.length === 1) {
          E = true;
          const O = V.length === 1 ? V[0] : B[0], le = V.length === 1 ? B : V;
          for (let be = 0; be + 2 <= p; be += 2) _([O, le[be % i], le[(be + 1) % i], le[(be + 2) % i]]);
          continue;
        }
        for (let O = 0; O < p; O++) _([V[O], B[O], B[(O + 1) % i], V[(O + 1) % i]]);
      }
    }
    h.push([]), t.points.val = f, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = b);
    const C = Za(d);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), { anillos: v.size, areas: M, polo: E, guias: C };
  }, window.__hekatanLoftSelection = (e, o) => {
    var _a3, _b, _c;
    const { segs: a, auxIds: n } = Ua(), s = Us(a), r = (B) => B.pts.every((O) => Math.abs(O[2] - B.pts[0][2]) < 1e-6), p = s.find((B) => B.cerrada && r(B)), i = s.find((B) => !B.cerrada && B.pts.length >= 2 && !r(B));
    if (!p) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!i) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const l = p.pts, d = l.length, c = i.pts.slice();
    c[c.length - 1][2] < c[0][2] && c.reverse();
    let m = 0;
    for (let B = 0; B < d; B++) {
      const O = l[B], le = l[(B + 1) % d];
      m += O[0] * le[1] - le[0] * O[1];
    }
    const f = m > 0 ? 1 : -1, h = (B) => {
      const O = l[(B - 1 + d) % d], le = l[B], be = l[(B + 1) % d], $e = [le[0] - O[0], le[1] - O[1]], we = [be[0] - le[0], be[1] - le[1]], Ve = Math.hypot($e[0], $e[1]) || 1, ke = Math.hypot(we[0], we[1]) || 1, qe = [f * $e[1] / Ve, -f * $e[0] / Ve], Fe = [f * we[1] / ke, -f * we[0] / ke], ze = 1 + (qe[0] * Fe[0] + qe[1] * Fe[1]);
      return [(qe[0] + Fe[0]) / Math.max(ze, 1e-6), (qe[1] + Fe[1]) / Math.max(ze, 1e-6)];
    }, b = l.map((B, O) => h(O)), v = c[0];
    let w = [0, 0], u = 0;
    for (const B of c) {
      const O = B[0] - v[0], le = B[1] - v[1], be = Math.hypot(O, le);
      be > u && (u = be, w = [O / be, le / be]);
    }
    if (u < 1e-9) {
      const B = v[0] - e, O = v[1] - o, le = Math.hypot(B, O) || 1;
      w = [B / le, O / le];
    }
    w[0] * (v[0] - e) + w[1] * (v[1] - o) < 0 && (w = [-w[0], -w[1]]), St();
    const x = t.points.rawVal, M = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], E = [...x];
    let _ = M.slice();
    _.length && _[_.length - 1].length === 0 && (_ = _.slice(0, -1));
    const C = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], I = c.map((B) => {
      const O = (B[0] - v[0]) * w[0] + (B[1] - v[1]) * w[1], le = B[2];
      return l.map((be, $e) => ta(E, [be[0] + b[$e][0] * O, be[1] + b[$e][1] * O, le]));
    });
    let j = 0;
    for (let B = 0; B + 1 < I.length; B++) for (let O = 0; O < d; O++) {
      const le = [I[B][O], I[B][(O + 1) % d], I[B + 1][(O + 1) % d], I[B + 1][O]];
      new Set(le).size < 4 || (C.push(_.length), _.push([...le, le[0]]), j++);
    }
    _.push([]), t.points.val = E, t.polylines && (t.polylines.val = _), t.areas && (t.areas.val = C);
    const V = Za(n);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), { contorno: d, perfil: c.length, areas: j, guias: V };
  }, window.__hekatanDrawSlabChaflan = (e, o, a = 1, n = 6, s = 6) => {
    const r = Math.min(e[0], o[0]), p = Math.max(e[0], o[0]), i = Math.min(e[1], o[1]), l = Math.max(e[1], o[1]), d = (e[2] + o[2]) / 2, c = p - r, m = l - i, f = Math.min(a, c / 2 - 0.01, m / 2 - 0.01);
    if (f <= 0) return;
    const h = t.points.rawVal.length, b = [], v = [], w = (u, x) => {
      b.push([u, x, d]), v.push(h + b.length - 1);
    };
    for (let u = 0; u <= s; u++) w(r + f + (c - 2 * f) * u / s, i);
    for (let u = 1; u <= n; u++) {
      const x = -Math.PI / 2 + Math.PI / 2 * u / n;
      w(p - f + f * Math.cos(x), i + f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) w(p, i + f + (m - 2 * f) * u / s);
    for (let u = 1; u <= n; u++) {
      const x = 0 + Math.PI / 2 * u / n;
      w(p - f + f * Math.cos(x), l - f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) w(p - f - (c - 2 * f) * u / s, l);
    for (let u = 1; u <= n; u++) {
      const x = Math.PI / 2 + Math.PI / 2 * u / n;
      w(r + f + f * Math.cos(x), l - f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) w(r, l - f - (m - 2 * f) * u / s);
    for (let u = 1; u < n; u++) {
      const x = Math.PI + Math.PI / 2 * u / n;
      w(r + f + f * Math.cos(x), i + f + f * Math.sin(x));
    }
    if (v.push(h), Co()) {
      Ao(b, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...b], t.polylines) {
      const u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), v, []];
    }
  }, window.__hekatanDrawRect = (e, o) => {
    const a = t.points.rawVal.length, n = e[0], s = e[1], r = e[2], p = o[0], i = o[1], l = o[2];
    let d;
    if (Math.abs(r - l) < 1e-6 ? d = [[n, s, r], [p, s, r], [p, i, r], [n, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[n, s, r], [p, s, r], [p, s, l], [n, s, l]] : d = [[n, s, r], [n, i, r], [n, i, l], [n, s, l]], t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = [a, a + 1, a + 2, a + 3, a], m = t.polylines.rawVal;
      t.polylines.val = [...m.slice(0, -1), c, []];
    }
  }, window.__hekatanDrawRectArea = (e, o) => {
    var _a3;
    const a = t.points.rawVal.length, n = e[0], s = e[1], r = e[2], p = o[0], i = o[1], l = o[2];
    let d;
    if (q && t.gridTarget) {
      const c = t.gridTarget.rawVal, m = new Sn(...c.rotation), f = new F(1, 0, 0).applyEuler(m), h = new F(0, 1, 0).applyEuler(m), b = new F(...c.position), v = new F(n, s, r), w = new F(p, i, l), u = v.clone().sub(b).dot(f), x = v.clone().sub(b).dot(h), M = w.clone().sub(b).dot(f), E = w.clone().sub(b).dot(h), _ = (C, I) => b.clone().addScaledVector(f, C).addScaledVector(h, I).toArray();
      d = [_(u, x), _(M, x), _(M, E), _(u, E)];
    } else Math.abs(r - l) < 1e-6 ? d = [[n, s, r], [p, s, r], [p, i, r], [n, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[n, s, r], [p, s, r], [p, s, l], [n, s, l]] : d = [[n, s, r], [n, i, r], [n, i, l], [n, s, l]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = t.polylines.rawVal, m = c.length - 1, f = [a, a + 1, a + 2, a + 3, a];
      t.polylines.val = [...c.slice(0, -1), f, []], t.areas && (t.areas.val = [...t.areas.rawVal, m]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    P();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = t.points.rawVal, a = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = (w) => w.map((u) => Math.round(u * 1e4) / 1e4).join(",");
    for (let w = 0; w < o.length; w++) {
      const u = s(o[w]), x = a.get(u);
      x === void 0 && a.set(u, w), n.set(w, x ?? w);
    }
    const r = e.map((w) => w.map((u) => n.get(u) ?? u)), p = /* @__PURE__ */ new Map(), i = (w, u) => {
      w !== u && ((p.get(w) ?? p.set(w, /* @__PURE__ */ new Set()).get(w)).add(u), (p.get(u) ?? p.set(u, /* @__PURE__ */ new Set()).get(u)).add(w));
    };
    for (const w of r) for (let u = 0; u + 1 < w.length; u++) i(w[u], w[u + 1]);
    const l = (w, u) => {
      var _a4;
      return !!((_a4 = p.get(w)) == null ? void 0 : _a4.has(u));
    }, d = /* @__PURE__ */ new Set(), c = [], m = [...p.keys()];
    for (const w of m) for (const u of p.get(w)) if (!(u < w)) {
      for (const x of p.get(u)) if (x !== w) for (const M of p.get(x)) {
        if (M === w || M === u || !l(M, w) || l(w, x) || l(u, M)) continue;
        const E = [w, u, x, M].slice().sort((_, C) => _ - C).join("-");
        d.has(E) || (d.add(E), c.push([w, u, x, M]));
      }
    }
    for (const w of m) for (const u of p.get(w)) if (!(u < w)) for (const x of p.get(u)) {
      if (x === w || !l(x, w)) continue;
      const M = [w, u, x].slice().sort((E, _) => E - _).join("-");
      d.has(M) || (d.add(M), c.push([w, u, x]));
    }
    if (!c.length) return 0;
    const f = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], h = new Set(f.map((w) => [...new Set(r[w] ?? [])].sort((u, x) => u - x).join("-"))), b = [...r];
    let v = 0;
    for (const w of c) {
      const u = w.slice().sort((x, M) => x - M).join("-");
      h.has(u) || (h.add(u), b.push([...w, w[0]]), f.push(b.length - 1), v++);
    }
    if (v) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = b, t.areas && (t.areas.val = f);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      P();
    }
    return v;
  }, window.__hekatanMeshPolyArea = (e, o) => {
    var _a3;
    const a = e.length;
    if (a < 3) return 0;
    let n = 0, s = 0, r = 0;
    for (let ze = 0; ze < a; ze++) {
      const Ge = e[ze], Qe = e[(ze + 1) % a];
      n += (Ge[1] - Qe[1]) * (Ge[2] + Qe[2]), s += (Ge[2] - Qe[2]) * (Ge[0] + Qe[0]), r += (Ge[0] - Qe[0]) * (Ge[1] + Qe[1]);
    }
    const p = Math.hypot(n, s, r) || 1;
    n /= p, s /= p, r /= p;
    let i = e[1][0] - e[0][0], l = e[1][1] - e[0][1], d = e[1][2] - e[0][2];
    const c = Math.hypot(i, l, d) || 1;
    i /= c, l /= c, d /= c;
    let m = s * d - r * l, f = r * i - n * d, h = n * l - s * i;
    const b = Math.hypot(m, f, h) || 1;
    m /= b, f /= b, h /= b;
    const v = e[0], w = (ze) => [(ze[0] - v[0]) * i + (ze[1] - v[1]) * l + (ze[2] - v[2]) * d, (ze[0] - v[0]) * m + (ze[1] - v[1]) * f + (ze[2] - v[2]) * h], u = (ze, Ge) => [v[0] + ze * i + Ge * m, v[1] + ze * l + Ge * f, v[2] + ze * d + Ge * h], x = e.map(w);
    let M = 1 / 0, E = -1 / 0, _ = 1 / 0, C = -1 / 0;
    for (const [ze, Ge] of x) ze < M && (M = ze), ze > E && (E = ze), Ge < _ && (_ = Ge), Ge > C && (C = Ge);
    const I = E - M, j = C - _;
    if (I < 1e-6 || j < 1e-6) return 0;
    let V = o && o > 0 ? o : 0.5;
    for (; I / V * (j / V) > 2500; ) V *= 2;
    V = Math.min(V, Math.min(I, j));
    const B = (ze, Ge) => {
      let Qe = false;
      for (let mt = 0, vt = x.length - 1; mt < x.length; vt = mt++) {
        const [Vt, sn] = x[mt], [jn, Yn] = x[vt];
        sn > Ge != Yn > Ge && ze < (jn - Vt) * (Ge - sn) / (Yn - sn) + Vt && (Qe = !Qe);
      }
      return Qe;
    }, O = Math.max(1, Math.round(I / V)), le = Math.max(1, Math.round(j / V)), be = I / O, $e = j / le, we = /* @__PURE__ */ new Map(), Ve = [], ke = t.points.rawVal.length, qe = (ze, Ge) => {
      const Qe = ze + "," + Ge, mt = we.get(Qe);
      if (mt !== void 0) return mt;
      const vt = ke + Ve.length;
      return Ve.push(u(M + ze * be, _ + Ge * $e)), we.set(Qe, vt), vt;
    }, Fe = [];
    for (let ze = 0; ze < O; ze++) for (let Ge = 0; Ge < le; Ge++) {
      if (!B(M + (ze + 0.5) * be, _ + (Ge + 0.5) * $e)) continue;
      const Qe = qe(ze, Ge), mt = qe(ze + 1, Ge), vt = qe(ze + 1, Ge + 1), Vt = qe(ze, Ge + 1);
      Fe.push([Qe, mt, vt, Vt]);
    }
    if (!Fe.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...Ve], t.polylines && t.areas) {
      let ze = t.polylines.rawVal.slice();
      ze.length && ze[ze.length - 1].length === 0 && (ze = ze.slice(0, -1));
      const Ge = [];
      for (const Qe of Fe) Ge.push(ze.length), ze.push([Qe[0], Qe[1], Qe[2], Qe[3], Qe[0]]);
      ze.push([]), t.polylines.val = ze, t.areas.val = [...t.areas.rawVal, ...Ge];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return P(), Fe.length;
  };
  const Eo = () => {
    if (at.length < 3) return at = [], Be.visible = false, P(), 0;
    const e = window.__hekatanMeshPolyArea(at.slice());
    return at = [], Be.visible = false, P(), e;
  };
  window.__hekatanFinalizePolyArea = Eo, window.__hekatanSetInclinedPlaneFrom3 = (e, o, a) => {
    var _a3;
    const n = new F(e[0], e[1], e[2]), s = new F(o[0], o[1], o[2]), r = new F(a[0], a[1], a[2]), p = new F().subVectors(s, n).cross(new F().subVectors(r, n));
    if (p.lengthSq() < 1e-9) return false;
    p.normalize();
    const i = new ho().setFromUnitVectors(new F(0, 0, 1), p), l = new Sn().setFromQuaternion(i);
    t.gridTarget && (t.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [l.x, l.y, l.z] }), q = true;
    const d = new F().addVectors(n, s).add(r).multiplyScalar(1 / 3), c = Math.max(n.distanceTo(s), n.distanceTo(r), s.distanceTo(r)) * 2.2 + 4, m = c / 2;
    Yt.geometry.dispose(), Yt.geometry = new En(c, c), en.geometry.dispose(), en.geometry = new hs(new En(c, c)), bo(m, 1), kt.position.copy(d), kt.quaternion.copy(i), kt.scale.set(1, 1, 1), kt.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return P(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), q = false, kt.visible = false, P();
  };
  const on = new ut();
  on.visible = false, g.add(on), window.__hekatanShowAxes = (e, o, a = 12, n = 2) => {
    var _a3, _b;
    for (; on.children.length; ) {
      const c = on.children.pop();
      (_a3 = c.geometry) == null ? void 0 : _a3.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !o.length) return;
    const s = Math.min(...o) - n, r = Math.max(...o) + n, p = Math.min(...e) - n, i = Math.max(...e) + n, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", d = (c, m, f, h, b) => {
      const v = document.createElement("canvas");
      v.width = 64, v.height = 32;
      const w = v.getContext("2d");
      w.fillStyle = b, w.font = "bold 22px sans-serif", w.textAlign = "center", w.fillText(c, 32, 26);
      const u = new ms(v), x = new ws({ map: u, transparent: true }), M = new ys(x);
      return M.position.set(m, f, h), M.scale.set(1.2, 0.6, 1), M;
    };
    e.forEach((c, m) => {
      const f = m < l.length ? l[m] : `X${m}`, h = new Le().setFromPoints([new F(c, s, 0), new F(c, r, 0), new F(c, s, 0), new F(c, s, a)]), b = new eo({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new jt(h, b);
      v.computeLineDistances(), on.add(v), on.add(d(f, c, s - 0.5, 0, "#60a5fa")), on.add(d(f, c, r + 0.5, 0, "#60a5fa"));
    }), o.forEach((c, m) => {
      const f = `${m + 1}`, h = new Le().setFromPoints([new F(p, c, 0), new F(i, c, 0), new F(p, c, 0), new F(p, c, a)]), b = new eo({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new jt(h, b);
      v.computeLineDistances(), on.add(v), on.add(d(f, p - 0.5, c, 0, "#fb7185")), on.add(d(f, i + 0.5, c, 0, "#fb7185"));
    }), on.visible = true, P();
  }, window.__hekatanHideAxes = () => {
    on.visible = false, P();
  };
  const _n = new ut();
  _n.visible = false, g.add(_n);
  let qn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], o = 20, a = 0, n = 0) => {
    var _a3, _b;
    for (; _n.children.length; ) {
      const r = _n.children.pop();
      (_a3 = r.geometry) == null ? void 0 : _a3.dispose(), (_b = r.material) == null ? void 0 : _b.dispose();
    }
    qn.forEach((r) => {
      g.remove(r), r.geometry.dispose(), r.material.dispose();
    }), qn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((r, p) => {
      const i = s[p % s.length], l = o / 2, d = [new F(a - l, n - l, r), new F(a + l, n - l, r), new F(a + l, n + l, r), new F(a - l, n + l, r), new F(a - l, n - l, r)], c = new Le().setFromPoints(d), m = new ft({ color: i, transparent: true, opacity: 0.55 });
      _n.add(new Et(c, m));
      const f = document.createElement("canvas");
      f.width = 128, f.height = 32;
      const h = f.getContext("2d");
      h.fillStyle = `#${i.toString(16).padStart(6, "0")}`, h.font = "bold 18px sans-serif", h.fillText(`Z = ${r} m`, 4, 22);
      const b = new ms(f), v = new ws({ map: b, transparent: true }), w = new ys(v);
      w.position.set(a - l - 1.5, n - l - 1.5, r), w.scale.set(2.5, 0.6, 1), _n.add(w);
      const u = new En(1e4, 1e4), x = new wt({ visible: false, side: Lt }), M = new ct(u, x);
      M.position.set(0, 0, r), M.frustumCulled = false, M.userData = { refPlaneZ: r }, g.add(M), qn.push(M);
    }), _n.visible = true, P();
  }, window.__hekatanHideRefPlanes = () => {
    _n.visible = false, qn.forEach((e) => {
      e.visible = false;
    }), P();
  };
  const io = new ut();
  io.frustumCulled = false, g.add(io);
  const Zs = () => {
    var _a3, _b, _c, _d;
    for (; io.children.length; ) {
      const a = io.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const n = new Le().setFromPoints([new F(a[0], a[1], a[2]), new F(a[3], a[4], a[5])]), s = new eo({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), r = new Et(n, s);
      r.computeLineDistances(), io.add(r);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Zs(), P());
  });
  const Gn = new ut();
  Gn.frustumCulled = false, g.add(Gn);
  const qa = () => {
    var _a3, _b, _c, _d;
    for (; Gn.children.length; ) {
      const a = Gn.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const n = new ct(new to(0.025, 12, 12), new wt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(a[0], a[1], a[2]), n.renderOrder = 996, n.scale.setScalar(ko(n.position)), Gn.add(n);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, qa(), P());
  }), S.addEventListener("change", () => {
    Gn.children.forEach((e) => {
      e.scale.setScalar(ko(e.position));
    });
  }), window.__hekatanRenderAuxPoints = qa;
  const bt = new ut(), qs = new ct(new to(0.01, 12, 12), new wt({ color: 16777215, transparent: true, opacity: 0.95 })), Ga = new ct(new to(0.015, 12, 12), new wt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Ga.visible = false, bt.add(qs, Ga);
  const Kn = 0.08, na = (e, o, a) => {
    const n = new Le().setFromPoints([new F(...e), new F(...o)]);
    return new Et(n, new ft({ color: a, transparent: true, opacity: 0.7 }));
  };
  bt.add(na([-Kn, 0, 0], [Kn, 0, 0], 16777215)), bt.add(na([0, -Kn, 0], [0, Kn, 0], 16777215)), bt.add(na([0, 0, -Kn], [0, 0, Kn], 16777215)), bt.visible = false, bt.frustumCulled = false, g.add(bt);
  let oa = 2;
  const Fo = (e) => {
    const o = k(), a = ($ == null ? void 0 : $.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(e) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, lo = () => {
    if (!bt.visible) return;
    const e = oa * Fo(bt.position) / 0.015;
    bt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let Cn = 10;
  const aa = (e) => Math.max(1e-4, Cn * Fo(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (Cn = e), Cn), window.__hekatanUpdateSnapScale = lo, window.__hekatanSnapMarker = bt, window.__hekatanMetrosPorPixel = Fo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (oa = e, lo(), P()), oa);
  const Ka = () => {
    yn.children.length !== 0 && yn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const o = e;
      o.scale.setScalar(ko(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Ka, S.addEventListener("change", () => {
    var _a3;
    lo(), tn.visible && Ra(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), Ka();
  }), window.__hekatanShowSnap = (e, o, a) => {
    bt.position.set(e, o, a), bt.visible = true, lo(), P();
  }, window.__hekatanHideSnap = () => {
    bt.visible = false, P();
  }, $.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const o = N(e);
    if (!o) return;
    L.setFromCamera(Y, o), se = null;
    const a = Ye();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && dt.visible && (dt.visible = false), a.length) {
      const n = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const h = Kt([n.x, n.y, n.z]);
        if (h) {
          const b = h.map((u) => t.points.rawVal[u]), v = [];
          for (let u = 1; u < b.length - 1; u++) v.push(b[0][0], b[0][1], b[0][2], b[u][0], b[u][1], b[u][2], b[u + 1][0], b[u + 1][1], b[u + 1][2]);
          const w = dt.geometry;
          w.setAttribute("position", new It(v, 3)), w.computeVertexNormals(), dt.visible = true;
        } else dt.visible = false;
      } else dt.visible && (dt.visible = false);
      const s = e.altKey;
      let r = false;
      const p = aa(n), i = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, n.x, n.y, n.z, p, { x: e.clientX, y: e.clientY });
      if (i) Ro(i.type, i.x, i.y, i.z), bt.position.set(i.x, i.y, i.z), bt.visible = true, n.set(i.x, i.y, i.z), Do(i.type, e.clientX, e.clientY);
      else if (!s && (Ce = _e(e.clientX, e.clientY))) r = true, n.copy(Ce), Ro("ifcSec", n.x, n.y, n.z), Do("ifcSec", e.clientX, e.clientY), bt.position.copy(n), bt.visible = true;
      else if (ae && !s) r = true, Ro(ae.tipo, n.x, n.y, n.z), Do(ae.tipo, e.clientX, e.clientY), bt.position.copy(n), bt.visible = true;
      else {
        Qs(), To();
        const f = !s && window.__hekatanSnapEnabled !== false, h = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        f && h > 0 && (n.x = Math.round(n.x / h) * h, n.y = Math.round(n.y / h) * h, n.z = Math.round(n.z / h) * h), bt.position.copy(n), bt.visible = true;
      }
      lo(), Z(se && !i && (r || ae) ? K(se) : null), Tt = { p: n.clone(), x: e.clientX, y: e.clientY };
      const l = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (l === "select" || !l) {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = Ns(n.x, n.y, n.z, f), b = ea(n.x, n.y, n.z, f), v = Ta(n.x, n.y, n.z, f);
        if (h >= 0) {
          const M = t.points.rawVal[h];
          tn.position.set(M[0], M[1], M[2]), tn.visible = true, Ra(), wn.visible = false, xn = { kind: "pt", a: h };
        } else if (b) {
          const M = t.points.rawVal, E = t.polylines.rawVal[b.polyIdx], _ = M[E[b.segIdx]], C = M[E[b.segIdx + 1]];
          wn.geometry.setFromPoints([new F(_[0], _[1], _[2]), new F(C[0], C[1], C[2])]), wn.visible = true, tn.visible = false, xn = ((_m = (_l2 = t.areas) == null ? void 0 : _l2.rawVal) == null ? void 0 : _m.includes(b.polyIdx)) ?? false ? { kind: "poly", a: b.polyIdx } : { kind: "seg", a: b.polyIdx, b: b.segIdx };
        } else if (v >= 0) {
          const E = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[v];
          E && (wn.geometry.setFromPoints([new F(E[0], E[1], E[2]), new F(E[3], E[4], E[5])]), wn.visible = true, tn.visible = false, xn = { kind: "aux", a: v });
        } else wn.visible = false, tn.visible = false, xn = null;
        Ee.style.left = e.clientX + "px", Ee.style.top = e.clientY + "px", Ee.style.display = "block";
        let w = n;
        if ((xn == null ? void 0 : xn.kind) === "pt") {
          const M = t.points.rawVal[xn.a];
          M && (w = new F(M[0], M[1], M[2]));
        }
        const u = `X=${w.x.toFixed(2)} Y=${w.y.toFixed(2)} Z=${w.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [w.x, w.y, w.z], xn) {
          const M = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Ee.textContent = `${u}  \xB7  \u{1F5B1} Click \u2192 ${M[xn.kind]}`;
        } else Ee.textContent = u;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = u), Tt = { p: w.clone(), x: e.clientX, y: e.clientY }, We.visible = false, Xt.visible = false, Ut.visible = false, P();
        return;
      }
      if (l === "delete" || l === "trim" || l === "extend" || l === "offset") {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = ea(n.x, n.y, n.z, f), b = Ta(n.x, n.y, n.z, f);
        let v = false;
        if (b >= 0) if (!h) v = true;
        else {
          const M = window.__hekatanDrawingAuxLines, _ = ((M == null ? void 0 : M.rawVal) ?? (M == null ? void 0 : M.val) ?? M ?? [])[b];
          ao(n.x, n.y, n.z, _[0], _[1], _[2], _[3], _[4], _[5]) < h.dist && (v = true);
        }
        v ? (zn = b, dn = -1, Pn = -1, Ys(b)) : h ? (dn = h.polyIdx, Pn = h.segIdx, zn = -1, Xs(h.polyIdx, h.segIdx)) : (dn = -1, Pn = -1, zn = -1, qt.visible = false), We.visible = false, Xt.visible = false, Ut.visible = false, pn(), Ee.style.left = e.clientX + "px", Ee.style.top = e.clientY + "px", Ee.style.display = "block";
        const w = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let u = "";
        v ? u = `\u{1F5D1} l\xEDnea aux #${zn + 1}` : h ? u = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(h.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${h.polyIdx + 1}` : `\u{1F5D1} seg ${h.segIdx + 1} / poly #${h.polyIdx + 1}` : u = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Ee.textContent = `${w}  \xB7  ${u}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = w), P();
        return;
      } else qt.visible = false, dn = -1, zn = -1;
      Ee.style.left = e.clientX + "px", Ee.style.top = e.clientY + "px", Ee.style.display = "block";
      const d = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], c = d[d.length - 1] ?? [], m = t.points.rawVal ?? [];
      if (c.length > 0 && m[c[c.length - 1]]) {
        const f = c[c.length - 1], h = m[f];
        let b = zt;
        Mo = null;
        const v = !!i || r;
        if (!b && !v && window.__hekatanAxisSnap !== false) {
          const we = $.getBoundingClientRect(), Ve = e.clientX, ke = e.clientY, qe = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Fe = new F(h[0], h[1], h[2]), ze = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], Ge = (mt) => {
            const vt = mt.clone().project(o);
            return { x: (vt.x * 0.5 + 0.5) * we.width + we.left, y: (-vt.y * 0.5 + 0.5) * we.height + we.top };
          };
          let Qe = null;
          for (const [mt, vt] of ze) {
            const Vt = Ge(Fe.clone().addScaledVector(vt, -qe)), sn = Ge(Fe.clone().addScaledVector(vt, qe)), jn = sn.x - Vt.x, Yn = sn.y - Vt.y, pi = Ve - Vt.x, fi = ke - Vt.y, hi = jn * jn + Yn * Yn || 1;
            let Yo = (pi * jn + fi * Yn) / hi;
            Yo = Math.max(0, Math.min(1, Yo));
            const rs = Math.hypot(Ve - (Vt.x + Yo * jn), ke - (Vt.y + Yo * Yn));
            if (Qe === null || rs < Qe.dpx) {
              const ga = L.ray, cs = Fe.clone().sub(ga.origin), ba = vt.dot(ga.direction), ds = vt.dot(cs), mi = ga.direction.dot(cs), us = 1 - ba * ba, wi = Math.abs(us) < 1e-6 ? -ds : (ba * mi - ds) / us;
              Qe = { axis: mt, dpx: rs, pt: Fe.clone().addScaledVector(vt, wi) };
            }
          }
          Qe && Qe.dpx <= 12 && (n.copy(Qe.pt), b = Qe.axis, Mo = Qe.pt.clone());
        }
        const w = !!window.__hekatanOrthoMode;
        if (!b && !v && w) {
          const we = Math.abs(n.x - h[0]), Ve = Math.abs(n.y - h[1]), ke = Math.abs(n.z - h[2]), qe = (_s2 = a[0]) == null ? void 0 : _s2.object;
          let Fe = null;
          qe === Zt ? Fe = "xy" : qe === Wt ? Fe = "xz" : qe === cn && (Fe = "yz"), Fe === "xy" ? b = we >= Ve ? "x" : "y" : Fe === "xz" ? b = we >= ke ? "x" : "z" : Fe === "yz" ? b = Ve >= ke ? "y" : "z" : b = we >= Ve && we >= ke ? "x" : Ve >= ke ? "y" : "z";
        }
        const u = window.__hekatanPolarTrack !== false;
        if (!b && !v && u) {
          const we = n.x - h[0], Ve = n.y - h[1], ke = n.z - h[2], qe = Math.hypot(we, Ve, ke);
          if (qe > 1e-3) {
            const ze = Math.tan(6 * Math.PI / 180) * qe, Ge = Math.hypot(Ve, ke), Qe = Math.hypot(we, ke), mt = Math.hypot(we, Ve), vt = [["x", Ge], ["y", Qe], ["z", mt]];
            vt.sort((Vt, sn) => Vt[1] - sn[1]), vt[0][1] <= ze && (b = vt[0][0]);
          }
        }
        if (b) {
          const we = h[0], Ve = h[1], ke = h[2];
          b === "x" ? n.set(n.x, Ve, ke) : b === "y" ? n.set(we, n.y, ke) : n.set(we, Ve, n.z);
          const qe = !!zt, ze = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[b];
          Dt.style.background = "rgba(15,23,42,0.92)", Dt.style.color = ze, Dt.style.border = `1.5px solid ${ze}`;
          const Ge = (_t2 = a[0]) == null ? void 0 : _t2.object;
          let Qe = null;
          Ge === Zt ? Qe = "xy" : Ge === Wt ? Qe = "xz" : Ge === cn && (Qe = "yz");
          const mt = Qe ? ` (plano ${Qe.toUpperCase()})` : "";
          Dt.textContent = qe ? `\u{1F512} LOCK ${b.toUpperCase()}${mt}` : `\u22A5 ORTO ${b.toUpperCase()}${mt}`, Dt.style.left = e.clientX + 20 + "px", Dt.style.top = e.clientY + 18 + "px", Dt.style.transform = "none", Dt.style.display = "block";
        } else zt || (Dt.style.display = "none");
        let x = null;
        if (!s && !v && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const we = t.points.rawVal, Ve = b ? [b] : ["z", "x", "y"], ke = { x: e.clientX, y: e.clientY };
          let qe = 1 / 0;
          for (const Fe of we) if (!(Math.abs(Fe[0] - h[0]) < 1e-9 && Math.abs(Fe[1] - h[1]) < 1e-9 && Math.abs(Fe[2] - h[2]) < 1e-9)) for (const ze of Ve) {
            const Ge = new F(ze === "x" ? Fe[0] : n.x, ze === "y" ? Fe[1] : n.y, ze === "z" ? Fe[2] : n.z), Qe = Bn(Ge.x, Ge.y, Ge.z);
            if (!Qe) continue;
            const mt = Math.hypot(Qe.x - ke.x, Qe.y - ke.y);
            mt < Cn && mt < qe && (qe = mt, x = { q: Fe, eje: ze });
          }
        }
        x ? (x.eje === "x" ? n.x = x.q[0] : x.eje === "y" ? n.y = x.q[1] : n.z = x.q[2], Ut.geometry.setFromPoints([new F(x.q[0], x.q[1], x.q[2]), new F(n.x, n.y, n.z)]), (_u = Ut.computeLineDistances) == null ? void 0 : _u.call(Ut), Ut.visible = true, bt.position.set(n.x, n.y, n.z), bt.visible = true, Do("track", e.clientX, e.clientY)) : Ut.visible = false, Tt = { p: n.clone(), x: e.clientX, y: e.clientY };
        const M = Math.hypot(n.x - h[0], n.y - h[1], n.z - h[2]), E = Math.atan2(n.y - h[1], n.x - h[0]) * 180 / Math.PI, _ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`, C = (E % 360 + 360) % 360;
        Ee.textContent = `L = ${M.toFixed(3)} m   \u2220 ${C.toFixed(1)}\xB0   \xB7   ${_}`;
        const I = document.getElementById("hk-coord-fixed");
        I && (I.textContent = _), We.geometry.setFromPoints([new F(h[0], h[1], h[2]), new F(n.x, n.y, n.z)]), (_v = We.computeLineDistances) == null ? void 0 : _v.call(We), We.visible = true, yt(h[0], h[1], h[2], n.x, n.y, n.z);
        const j = window.__hekatanOrthoExt ?? 8, V = window.__hekatanShowOrthoPlanes !== false;
        hn.visible = V, V || Va(null), V && (vn(In, h, "xy", j), vn(Zn, h, "xz", j), vn(Rn, h, "yz", j), Mn(Zt, h, "xy", j), Mn(Wt, h, "xz", j), Mn(cn, h, "yz", j));
        const B = V ? L.intersectObjects([Zt, Wt, cn], false) : [];
        let O = null;
        if (B.length > 0) {
          const we = B[0].object;
          we === Zt ? O = "xy" : we === Wt ? O = "xz" : we === cn && (O = "yz");
        }
        Va(O), O && (mn.style.left = e.clientX + "px", mn.style.top = e.clientY + "px"), bn.geometry.setFromPoints([new F(h[0] - j, h[1], h[2]), new F(h[0] + j, h[1], h[2])]), (_w = bn.computeLineDistances) == null ? void 0 : _w.call(bn), fn.geometry.setFromPoints([new F(h[0], h[1] - j, h[2]), new F(h[0], h[1] + j, h[2])]), (_x = fn.computeLineDistances) == null ? void 0 : _x.call(fn), Ln.geometry.setFromPoints([new F(h[0], h[1], h[2] - j), new F(h[0], h[1], h[2] + j)]), (_y = Ln.computeLineDistances) == null ? void 0 : _y.call(Ln), Xt.visible = true;
        const le = bn.material, be = fn.material, $e = Ln.material;
        bn.visible = b === "x", fn.visible = b === "y", Ln.visible = b === "z", le.opacity = 0.95, be.opacity = 0.95, $e.opacity = 0.95;
      } else {
        const f = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        Ee.textContent = f;
        const h = document.getElementById("hk-coord-fixed");
        if (h && (h.textContent = f), We.visible = false, Xt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(l)) {
          if (Ze = null, lt = null, Pe.style.left = e.clientX + 20 + "px", Pe.style.top = e.clientY - 28 + "px", Pe.style.display = "block", !et) {
            Pe.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const v = document.activeElement;
            !(v && (v.tagName === "INPUT" || v.tagName === "TEXTAREA") && v !== Pe) && document.activeElement !== Pe && Pe.focus({ preventScroll: true });
            try {
              Pe.select();
            } catch {
            }
          }
        } else pn();
      }
      P();
    } else To(), Ee.style.display = "none", bt.visible = false, We.visible = false, Xt.visible = false, pn(), P();
  }), ue.derive(() => {
    if (!t.gridTarget) return;
    const e = new ho().setFromEuler(new Sn(...t.gridTarget.val.rotation)), o = new ho().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2);
    ol(y, { position: new F(...t.gridTarget.val.position), quaternion: e.clone().multiply(o) }, P), Wa(t.gridTarget.val.position[2], Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3), ee.position.set(...t.gridTarget.val.position), ee.quaternion.setFromEuler(new Sn(...t.gridTarget.val.rotation)), ee.updateMatrixWorld();
    const a = new F(0, 0, 1).applyEuler(new Sn(...t.gridTarget.val.rotation));
    q = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  });
  function Wa(e, o, a) {
    var _a3, _b, _c, _d, _e2, _f, _g;
    {
      for (const n of Un) g.remove(n), jo(n);
      if (Un.length = 0, o) {
        const n = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = /* @__PURE__ */ new Set([0]);
        for (const i of n) s.add(+i[2].toFixed(3));
        const r = /* @__PURE__ */ new Set();
        for (const i of window.__hekatanLevels ?? []) isFinite(i == null ? void 0 : i.z) && (s.add(+i.z.toFixed(3)), r.add(+i.z.toFixed(3)));
        const p = [...s].sort((i, l) => i - l).slice(0, 24);
        for (const i of p) {
          if (Math.abs(i - e) < 1e-6) continue;
          const l = y.clone(true);
          l.name = `hekatan-grid-nivel-${i}`, l.traverse((d) => {
            d.material && (d.material = d.material.clone(), d.material.transparent = true, d.material.opacity = (d.material.opacity ?? 1) * (r.has(i) ? 0.65 : Math.abs(i) < 1e-6 ? 0.5 : 0.22));
          }), l.position.set(0, 0, i), l.quaternion.identity(), g.add(l), Un.push(l);
        }
      }
    }
    {
      const n = window.__hekatanPlanosAux ?? [], s = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", r = ((_g = (_f = (_e2 = window.__hekatanCadState) == null ? void 0 : _e2.get) == null ? void 0 : _f.call(_e2)) == null ? void 0 : _g[s === "xz" ? "workY" : s === "yz" ? "workX" : "workZ"]) ?? 0;
      for (const p of n.slice(0, 24)) {
        if (p.plano === "xy" || !isFinite(p.d) || p.plano === s && Math.abs(p.d - r) < 1e-6) continue;
        const i = y.clone(true);
        i.name = `hekatan-grid-${p.plano}-${p.d}`, i.traverse((l) => {
          l.material && (l.material = l.material.clone(), l.material.transparent = true, l.material.opacity = (l.material.opacity ?? 1) * 0.6);
        }), p.plano === "xz" ? (i.quaternion.setFromEuler(new Sn(Math.PI / 2, 0, 0)), i.position.set(0, p.d, 0)) : (i.quaternion.setFromEuler(new Sn(0, Math.PI / 2, 0)), i.position.set(p.d, 0, 0)), g.add(i), Un.push(i);
      }
    }
    P();
  }
  window.__hekatanGrillaAux = (e, o = "xy") => {
    var _a3, _b;
    if (!isFinite(e)) return [];
    const a = window;
    (_a3 = a.__hekatanPushUndo) == null ? void 0 : _a3.call(a);
    const n = a.__hekatanPlanosAux ?? [], s = n.findIndex((r) => r.plano === o && Math.abs(r.d - e) < 1e-6);
    if (s >= 0 ? n.splice(s, 1) : n.push({ plano: o, d: e }), a.__hekatanPlanosAux = n, o === "xy") {
      const r = a.__hekatanLevels ?? [], p = r.findIndex((i) => Math.abs(i.z - e) < 1e-6 && i.tipo !== "piso");
      s >= 0 ? p >= 0 && r.splice(p, 1) : p < 0 && r.push({ label: `N${e >= 0 ? "+" : ""}${e.toFixed(2)}`, z: e, tipo: "aux" }), a.__hekatanLevels = r;
    }
    return (_b = a.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(a), n;
  }, window.__hekatanQuitarGrillaAux = (e) => {
    var _a3;
    const a = (window.__hekatanLevels ?? []).filter((n) => !(Math.abs(n.z - e) < 1e-6 && n.tipo !== "piso"));
    return window.__hekatanLevels = a, (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), a.map((n) => n.z);
  };
  const un = document.createElement("input");
  un.id = "hk-grid-dist", un.type = "text", un.spellcheck = false, un.title = "Distancia del plano. Teclea un n\xFAmero y Enter para colocarlo exacto; Esc cancela.", un.style.cssText = ["position:fixed", "z-index:99997", "pointer-events:none", "display:none", "padding:3px 8px", "background:rgba(15,23,42,.94)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "width:104px", "text-align:center", "font:bold 13px Consolas,monospace", "transform:translate(14px,-28px)", "outline:none"].join(";") + ";", document.body.appendChild(un);
  let Wn = false, sa = 0, Ot = "";
  const Gs = (e) => e === "xz" ? new F(0, 1, 0) : e === "yz" ? new F(1, 0, 0) : new F(0, 0, 1), Ha = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", ro = () => {
    var _a3, _b, _c;
    return String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy");
  }, Hn = () => {
    var _a3, _b, _c;
    return Number(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c[Ha(ro())]) ?? 0);
  }, $o = (e) => {
    var _a3, _b;
    const o = ro(), a = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3);
    if (a && (a[Ha(o)] = e), !t.gridTarget) return;
    const n = window.__hekatanSCU ?? [0, 0, 0];
    t.gridTarget.val = o === "xy" ? { position: [n[0], n[1], e], rotation: [Math.PI / 2, 0, 0] } : o === "xz" ? { position: [n[0], e, n[2]], rotation: [0, 0, 0] } : { position: [e, n[1], n[2]], rotation: [0, 0, Math.PI / 2] };
  }, Ks = () => {
    const e = Gs(ro()), o = L.ray.origin, a = L.ray.direction, n = e.dot(a), s = 1 - n * n;
    if (Math.abs(s) < 1e-4) return null;
    const r = o.clone().negate(), p = e.dot(r), i = a.dot(r);
    return (n * i - p) / s;
  }, co = (e, o) => {
    e && (un.style.left = e.clientX + "px", un.style.top = e.clientY + "px");
    const a = ro() === "xz" ? "Y" : ro() === "yz" ? "X" : "Z";
    un.value = Ot !== "" ? `${a} = ${Ot}` : `${a} = ${o.toFixed(2)} m`, un.style.display = "block";
  }, Vo = (e, o) => {
    var _a3;
    Wn && (Wn = false, window.__hekatanMoviendoGrilla = false, un.style.display = "none", e ? typeof o == "number" && isFinite(o) && $o(o) : $o(sa), Ot = "", (_a3 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a3.call(window), P());
  };
  window.__hekatanMoverGrilla = (e = true) => e ? (sa = Hn(), Ot = "", Wn = true, window.__hekatanMoviendoGrilla = true, co(null, sa), true) : Vo(false), $.addEventListener("pointermove", (e) => {
    if (!Wn) return;
    N(e);
    const o = Ks();
    if (o === null) {
      co(e, Hn());
      return;
    }
    Ot === "" && $o(o), co(e, o);
  }, true), $.addEventListener("pointerdown", (e) => {
    Wn && (e.preventDefault(), e.stopPropagation(), Vo(true, Ot !== "" ? parseFloat(Ot) : Hn()));
  }, true), window.addEventListener("keydown", (e) => {
    if (Wn) {
      if (e.key === "Escape") return e.preventDefault(), Vo(false);
      if (e.key === "Enter") return e.preventDefault(), Vo(true, Ot !== "" ? parseFloat(Ot) : Hn());
      if (e.key === "Backspace") {
        e.preventDefault(), Ot = Ot.slice(0, -1), co(null, Hn());
        return;
      }
      if (/^[0-9.\-]$/.test(e.key)) {
        e.preventDefault(), Ot += e.key;
        const o = parseFloat(Ot);
        isFinite(o) && $o(o), co(null, isFinite(o) ? o : Hn());
      }
    }
  }, true);
  const kn = new ut();
  kn.name = "hekatan-scu", kn.visible = false, g.add(kn);
  const Ws = (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    for (; kn.children.length; ) {
      const i = kn.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e2 = i.dispose) == null ? void 0 : _e2.call(i);
    }
    const o = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), a = new F(...e), n = [[new F(1, 0, 0), 16735067], [new F(0, 1, 0), 6029194], [new F(0, 0, 1), 6990079]];
    for (const [i, l] of n) kn.add(new $n(i, a, o, l, o * 0.28, o * 0.16));
    const s = new Le().setFromPoints([new F(0, 0, 0), a]), r = new eo({ color: 2282478, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.8 }), p = new Et(s, r);
    p.computeLineDistances(), kn.add(p), kn.visible = true;
  };
  window.__hekatanPonerSCU = (e) => {
    var _a3;
    return window.__hekatanSCU = [e[0], e[1], e[2]], Ws(e), (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), P(), e;
  }, window.__hekatanQuitarSCU = () => {
    var _a3;
    return window.__hekatanSCU = [0, 0, 0], kn.visible = false, (_a3 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a3.call(window), P(), [0, 0, 0];
  };
  let ia = false;
  window.__hekatanElegirSCU = (e = true) => (ia = e, window.__hekatanColocandoSCU = e, e), $.addEventListener("pointerdown", (e) => {
    if (!ia) return;
    e.preventDefault(), e.stopPropagation(), ia = false, window.__hekatanColocandoSCU = false;
    const o = window.__hekatanOsnapUltimo;
    if (o) {
      window.__hekatanPonerSCU([o.x, o.y, o.z]);
      return;
    }
    N(e);
    const a = Ye();
    if (a.length) {
      const n = a[0].point;
      window.__hekatanPonerSCU([n.x, n.y, n.z]);
    }
  }, true), window.__hekatanRecentrarGrilla = () => {
    var _a3, _b, _c, _d, _e2;
    if (!t.gridTarget) return;
    const e = window.__hekatanSCU ?? [0, 0, 0], o = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy"), a = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d), n = Number((a == null ? void 0 : a[o === "xz" ? "workY" : o === "yz" ? "workX" : "workZ"]) ?? 0);
    t.gridTarget.val = o === "xy" ? { position: [e[0], e[1], n], rotation: [Math.PI / 2, 0, 0] } : o === "xz" ? { position: [e[0], n, e[2]], rotation: [0, 0, 0] } : { position: [n, e[1], e[2]], rotation: [0, 0, Math.PI / 2] };
  }, window.__hekatanLimpiarGrillasAux = () => {
    var _a3, _b, _c;
    const e = window, o = (e.__hekatanPlanosAux ?? []).length + (e.__hekatanLevels ?? []).filter((s) => (s == null ? void 0 : s.tipo) !== "piso").length;
    if (!o) return 0;
    (_a3 = e.__hekatanPushUndo) == null ? void 0 : _a3.call(e);
    const a = e.__hekatanPlanosAux;
    Array.isArray(a) ? a.length = 0 : e.__hekatanPlanosAux = [];
    const n = e.__hekatanLevels;
    if (Array.isArray(n)) {
      const s = n.filter((r) => (r == null ? void 0 : r.tipo) === "piso");
      n.length = 0, n.push(...s);
    }
    (_b = e.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(e);
    try {
      (_c = e.__hekatanRefreshLevels) == null ? void 0 : _c.call(e);
    } catch {
    }
    return o;
  }, window.__hekatanRefrescarGrillas = () => {
    if (!t.gridTarget) return;
    const e = t.gridTarget.rawVal.rotation, o = new ho().setFromEuler(new Sn(...e));
    new ho().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2), Wa(t.gridTarget.rawVal.position[2], Math.abs(o.x - Math.sin(Math.PI / 4)) < 1e-3);
  }, ue.derive(() => {
    Ie.geometry.setAttribute("position", new It(t.points.val.flat(), 3)), Ie.geometry.computeBoundingSphere();
  }), ue.derive(() => {
    const e = 0.05 * A * 0.5 * z.val;
    L.params.Points.threshold = 0.4 * e;
  }), ue.derive(() => {
    var _a3;
    const e = t.points.val ?? [], a = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], n = [];
    for (const r of a) {
      const [p, i, l] = e[r];
      n.push(p, i, l);
    }
    const s = new Le();
    s.setAttribute("position", new It(n, 3)), Ke.geometry.dispose(), Ke.geometry = s;
  });
  let la = false, Tn = 0;
  $.addEventListener("pointerdown", () => {
    la = true;
  }), $.addEventListener("pointerup", () => {
    la = false;
  }), $.addEventListener("pointermove", () => {
    la && Tn++;
  });
  const Nt = document.createElement("div");
  Nt.id = "hk-window-select", Nt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Nt);
  let an = null, uo = false, Ht = null;
  const ra = (e, o, a, n, s) => {
    s ? (Nt.style.borderColor = "#34d399", Nt.style.borderStyle = "dashed", Nt.style.background = "rgba(52, 211, 153, 0.10)") : (Nt.style.borderColor = "#22d3ee", Nt.style.borderStyle = "solid", Nt.style.background = "rgba(34, 211, 238, 0.10)"), Nt.style.left = Math.min(e, a) + "px", Nt.style.top = Math.min(o, n) + "px", Nt.style.width = Math.abs(a - e) + "px", Nt.style.height = Math.abs(n - o) + "px", Nt.style.display = "block";
  }, Ja = (e, o, a, n, s) => {
    var _a3, _b, _c, _d;
    const r = Math.min(e, a), p = Math.max(e, a), i = Math.min(o, n), l = Math.max(o, n), d = a < e, c = $.getBoundingClientRect(), m = k();
    m.updateMatrixWorld();
    const f = (C) => {
      const I = new F(C[0], C[1], C[2]);
      return I.project(m), { x: c.left + (I.x * 0.5 + 0.5) * c.width, y: c.top + (-I.y * 0.5 + 0.5) * c.height };
    }, h = (C) => C.x >= r && C.x <= p && C.y >= i && C.y <= l, b = (C, I) => !(C.x < r && I.x < r || C.x > p && I.x > p || C.y < i && I.y < i || C.y > l && I.y > l);
    s || He.clear();
    let v = 0;
    const w = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let C = 0; C < w.length; C++) {
      const I = w[C];
      I && h(f(I)) && (He.add(`pt:${C}`), v++);
    }
    const u = (C, I) => d ? h(C) || h(I) || b(C, I) : h(C) && h(I), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], M = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let C = 0; C < x.length; C++) {
      const I = x[C];
      if (M.includes(C)) {
        let V;
        if (!d) V = I.every((B) => {
          const O = w[B];
          return !!O && h(f(O));
        });
        else {
          V = false;
          for (let B = 0; B < I.length - 1; B++) {
            const O = w[I[B]], le = w[I[B + 1]];
            if (!(!O || !le) && u(f(O), f(le))) {
              V = true;
              break;
            }
          }
        }
        V && (He.add(`poly:${C}`), v++);
      } else for (let V = 0; V < I.length - 1; V++) {
        const B = w[I[V]], O = w[I[V + 1]];
        !B || !O || u(f(B), f(O)) && (He.add(`seg:${C}:${V}`), v++);
      }
    }
    const _ = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let C = 0; C < _.length; C++) {
      const I = _[C];
      if (!I || I.length !== 6) continue;
      const j = f([I[0], I[1], I[2]]), V = f([I[3], I[4], I[5]]);
      u(j, V) && (He.add(`aux:${C}`), v++);
    }
    nn(), ce(v === 0 && !d ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${d ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${v} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${He.size})`), Nt.style.display = "none";
  }, Lo = () => {
    Ht && (Ht = null, Nt.style.display = "none", ce("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Lo, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Ht && Lo();
  });
  const ca = () => {
    var _a3, _b, _c, _d;
    if (He.size === 0) return false;
    const e = [...He], o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? [], p = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const b of e) {
      const [v, ...w] = b.split(":");
      if (v === "pt") p.add(+w[0]);
      else if (v === "poly") i.add(+w[0]);
      else if (v === "seg") {
        const u = +w[0], x = +w[1];
        l.has(u) || l.set(u, /* @__PURE__ */ new Set()), l.get(u).add(x);
      } else v === "aux" && d.add(+w[0]);
    }
    let c = 0, m = [], f = [];
    const h = /* @__PURE__ */ new Map();
    for (let b = 0; b < a.length; b++) {
      if (i.has(b)) {
        c++;
        continue;
      }
      h.set(b, m.length);
      const v = l.get(b);
      if (v && v.size > 0) {
        let w = [];
        for (let u = 0; u < a[b].length; u++) w.push(a[b][u]), u < a[b].length - 1 && v.has(u) && (w.length >= 2 && m.push(w), w = [], c++);
        (w.length >= 2 || w.length === 1) && m.push(w);
      } else m.push([...a[b]]);
    }
    if (i.size > 0) {
      const b = /* @__PURE__ */ new Set();
      for (const v of m) for (const w of v) b.add(w);
      for (const v of i) for (const w of a[v] ?? []) b.has(w) || p.add(w);
    }
    if (p.size > 0) {
      const b = [], v = /* @__PURE__ */ new Map();
      for (let u = 0; u < o.length; u++) {
        if (p.has(u)) {
          c++;
          continue;
        }
        v.set(u, b.length), b.push([...o[u]]);
      }
      const w = [];
      for (const u of m) {
        let x = [];
        for (const M of u) {
          const E = v.get(M);
          E === void 0 ? (x.length >= 2 && w.push(x), x = []) : x.push(E);
        }
        x.length >= 2 && w.push(x);
      }
      m = w, t.points.val = b;
    }
    for (const b of n) {
      const v = h.get(b);
      v !== void 0 && v < m.length && f.push(v);
    }
    if (t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = f), d.size > 0 && s) {
      const b = r.filter((v, w) => !d.has(w));
      "val" in s ? s.val = b : window.__hekatanDrawingAuxLines = b, c += d.size;
    }
    He.clear(), nn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ce(`\u{1F5D1} ${c} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = ca, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const o = document.activeElement, a = !!o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input");
    if (He.size > 0) {
      if (o && !a && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable)) return;
      e.preventDefault(), a && (o.value = ""), ca();
      return;
    }
  });
  const Gt = document.createElement("div");
  Gt.id = "hk-properties-pane";
  const Oa = "hk-props-pane-pos";
  let po = null;
  try {
    const e = localStorage.getItem(Oa);
    e && (po = JSON.parse(e));
  } catch {
  }
  Gt.style.cssText = ["position:fixed", po ? `left:${po.left}px` : "left:14px", po ? `top:${po.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Gt);
  const Hs = () => {
    const e = Gt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let o = false, a = 0, n = 0, s = 0, r = 0;
    e.addEventListener("mousedown", (p) => {
      o = true, a = p.clientX, n = p.clientY;
      const i = Gt.getBoundingClientRect();
      s = i.left, r = i.top, Gt.style.transform = "none", Gt.style.left = `${s}px`, Gt.style.top = `${r}px`, p.preventDefault();
    }), window.addEventListener("mousemove", (p) => {
      if (!o) return;
      const i = p.clientX - a, l = p.clientY - n, d = Math.max(0, Math.min(window.innerWidth - 80, s + i)), c = Math.max(0, Math.min(window.innerHeight - 40, r + l));
      Gt.style.left = `${d}px`, Gt.style.top = `${c}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Oa, JSON.stringify({ left: parseFloat(Gt.style.left), top: parseFloat(Gt.style.top) }));
        } catch {
        }
      }
    });
  }, ne = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Mt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let ht = null;
  const $t = (e, o, a, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: o, prop: a, value: n } }));
  }, Js = () => {
    var _a3, _b;
    if (ht && (ht.dispose(), ht = null), He.size === 0) {
      Gt.style.display = "none";
      return;
    }
    const e = [...He], o = e.filter((m) => m.startsWith("pt:"));
    if (o.length === 1) {
      const m = +o[0].slice(3), h = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(m);
      h ? [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = h.map(Boolean) : ne.Ux = ne.Uy = ne.Uz = ne.Rx = ne.Ry = ne.Rz = false;
      const v = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(m);
      v ? [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz] = v : ne.Fx = ne.Fy = ne.Fz = ne.Mx = ne.My = ne.Mz = 0;
    }
    const a = e.filter((m) => m.startsWith("seg:")), n = e.filter((m) => m.startsWith("poly:")), s = e.filter((m) => m.startsWith("aux:")), r = o.length > 0, p = a.length > 0, i = n.length > 0, l = !r && !p && !i, d = [];
    o.length && d.push(`\u{1F535} ${o.length} nodo(s)`), a.length && d.push(`\u{1F4CF} ${a.length} segmento(s)`), n.length && d.push(`\u25AD ${n.length} \xE1rea(s)`), s.length && d.push(`\u250A ${s.length} aux`);
    const c = `\u{1F3AF} ${He.size} item(s) \u2014 ${d.join(", ")}`;
    ht = new Fs({ container: Gt, title: c });
    {
      const m = ht.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      m.addBinding(Mt, "dx", { label: "\u0394x (m)", step: 0.1 }), m.addBinding(Mt, "dy", { label: "\u0394y (m)", step: 0.1 }), m.addBinding(Mt, "dz", { label: "\u0394z (m)", step: 0.1 }), m.addBinding(Mt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), m.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        ce(v ? `\u29C9 Replicado \xD7${v} (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), m.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, Mt.copias);
        ce(v && (v.lineas || v.areas) ? `\u21D7 Extruido: ${v.lineas} barra(s), ${v.areas} pa\xF1o(s) (\u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m \xD7 ${Mt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const f = { vuelo: 1.5, losa: true, borde: true, ambos: true }, h = m.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      h.addBinding(f, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), h.addBinding(f, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), h.addBinding(f, "borde", { label: "con viga de borde" }), h.addBinding(f, "ambos", { label: "a los dos lados" }), h.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, f.vuelo, { losa: f.losa, vigaBorde: f.borde, lados: f.ambos ? "ambos" : "afuera" });
        ce(v ? `\u2310 Volado de ${f.vuelo} m en ${v} pa\xF1o(s)` + (f.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), m.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a4;
        const v = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, Mt.dx, Mt.dy, Mt.dz, 1);
        ce(v ? `\u2192 Copia desplazada \u0394 ${Mt.dx},${Mt.dy},${Mt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const b = m.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      b.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a4;
        return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
      }), b.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ce(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (r) {
      const m = ht.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      m.addBinding(ne, "Ux"), m.addBinding(ne, "Uy"), m.addBinding(ne, "Uz"), m.addBinding(ne, "Rx"), m.addBinding(ne, "Ry"), m.addBinding(ne, "Rz");
      const f = (u, x) => {
        [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = u;
        try {
          ht.refresh();
        } catch {
        }
        $t("nodes", o, "supports", u), ce(`\u2713 ${x}: ${o.length} nudo(s) apoyado(s) (${u.map((M, E) => M ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][E] : "").filter(Boolean).join(" ")}).`);
      };
      m.addButton({ title: `\u25B2 Empotrar los ${o.length} nudo(s) (6 GDL)` }).on("click", () => f([true, true, true, true, true, true], "Empotrado")), m.addButton({ title: `\u25B3 Articular los ${o.length} nudo(s) (Ux Uy Uz)` }).on("click", () => f([true, true, true, false, false, false], "Articulado"));
      const h = ht.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      h.addBinding(ne, "Kx", { label: "Kx", min: 0, step: 100 }), h.addBinding(ne, "Ky", { label: "Ky", min: 0, step: 100 }), h.addBinding(ne, "Kz", { label: "Kz", min: 0, step: 100 }), h.addBinding(ne, "Krx", { label: "Krx", min: 0, step: 1e3 }), h.addBinding(ne, "Kry", { label: "Kry", min: 0, step: 1e3 }), h.addBinding(ne, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const b = ht.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      b.addBinding(ne, "Fx", { step: 0.1 }), b.addBinding(ne, "Fy", { step: 0.1 }), b.addBinding(ne, "Fz", { step: 0.1 }), b.addBinding(ne, "Mx", { step: 0.1 }), b.addBinding(ne, "My", { step: 0.1 }), b.addBinding(ne, "Mz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ne, "mass", { label: "m", min: 0, step: 1 }), ht.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ne, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ht.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let u = 0;
        const x = [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz];
        x.some((_) => _) && ($t("nodes", o, "supports", x), u++);
        const M = [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz];
        M.some((_) => _ !== 0) && ($t("nodes", o, "loads", M), u++);
        const E = [ne.Kx, ne.Ky, ne.Kz, ne.Krx, ne.Kry, ne.Krz];
        if (E.some((_) => _ !== 0) && ($t("nodes", o, "springs", E), u++), ne.mass !== 0 && ($t("nodes", o, "mass", ne.mass), u++), ne.diaphragm !== "Ninguno" && ($t("nodes", o, "diaphragm", ne.diaphragm), u++), u === 0) {
          ce("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let _ = document.getElementById("hk-prop-toast");
          _ || (_ = document.createElement("div"), _.id = "hk-prop-toast", _.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(_)), _.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", _.style.background = "rgba(217,119,6,0.97)", _.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            _ && (_.style.opacity = "0");
          }, 3200);
        } else ce(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (p) {
      const m = ht.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      m.addBinding(ne, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), m.addBinding(ne, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const f = ht.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      f.addBinding(ne, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ht.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ne, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ht.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ne, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const v = ht.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      v.addBinding(ne, "relMxI", { label: "Mx I" }), v.addBinding(ne, "relMyI", { label: "My I" }), v.addBinding(ne, "relMzI", { label: "Mz I" });
      const w = ht.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      w.addBinding(ne, "relMxJ", { label: "Mx J" }), w.addBinding(ne, "relMyJ", { label: "My J" }), w.addBinding(ne, "relMzJ", { label: "Mz J" }), ht.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ne, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const x = ht.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      x.addBinding(ne, "LKx", { label: "LKx", min: 0, step: 100 }), x.addBinding(ne, "LKy", { label: "LKy", min: 0, step: 100 }), x.addBinding(ne, "LKz", { label: "LKz", min: 0, step: 100 });
      const M = ht.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      M.addBinding(ne, "qx", { step: 0.1 }), M.addBinding(ne, "qy", { step: 0.1 }), M.addBinding(ne, "qz", { step: 0.1 }), ht.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ne, "massPerM", { label: "m/L", min: 0, step: 1 }), ht.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        $t("segs", a, "section", ne.section), $t("segs", a, "material", ne.material_frame);
        const _ = { A: ne.A_mod, Iz: ne.Iz_mod, Iy: ne.Iy_mod, J: ne.J_mod };
        (_.A !== 1 || _.Iz !== 1 || _.Iy !== 1 || _.J !== 1) && $t("segs", a, "modifiers", _), ne.insertionPoint !== "10 \u2014 Centroid" && $t("segs", a, "insertionPoint", ne.insertionPoint), ne.beta !== 0 && $t("segs", a, "beta", ne.beta);
        const C = [ne.relMxI, ne.relMyI, ne.relMzI], I = [ne.relMxJ, ne.relMyJ, ne.relMzJ];
        (C.some((B) => B) || I.some((B) => B)) && $t("segs", a, "releases", { i: C, j: I }), ne.hinges !== "None" && $t("segs", a, "hinges", ne.hinges);
        const j = [ne.LKx, ne.LKy, ne.LKz];
        j.some((B) => B !== 0) && $t("segs", a, "lineSprings", j);
        const V = [ne.qx, ne.qy, ne.qz];
        V.some((B) => B !== 0) && $t("segs", a, "distLoad", V), ne.massPerM !== 0 && $t("segs", a, "massPerM", ne.massPerM), ce(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (i) {
      const m = ht.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      m.addBinding(ne, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), m.addBinding(ne, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), m.addBinding(ne, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ht.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ne, "surfLoad", { label: "q", step: 0.1 }), ht.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        $t("areas", n, "shellType", ne.shellType), $t("areas", n, "thickness", ne.thickness), $t("areas", n, "material", ne.material_shell), ne.surfLoad !== 0 && $t("areas", n, "surfLoad", ne.surfLoad), ce(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (l) {
      const m = ht.addFolder({ title: "\u2139 Selecci\xF3n" }), f = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      m.addBinding(f, "msg", { readonly: true, label: "" });
    }
    ht.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      He.clear(), nn();
    }), Gt.style.display = "block", Hs();
  };
  window.__hekatanRefreshPropsPane = Js;
  let Jn = null, Io = false;
  $.addEventListener("pointerdown", (e) => {
    e.button === 2 && (Jn = { x: e.clientX, y: e.clientY }, Io = false);
  }), $.addEventListener("pointermove", (e) => {
    if (Jn && e.buttons & 2 && !Io) {
      const o = e.clientX - Jn.x, a = e.clientY - Jn.y;
      Math.hypot(o, a) > 8 && (Io = true);
    }
  }), $.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const o = Jn !== null && !Io;
      Jn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (Ht ? Lo() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), He.size > 0 && (He.clear(), nn()), t.polylines) {
          const r = t.polylines.rawVal;
          (r[r.length - 1] ?? []).length > 0 && (t.polylines.val = [...r, []]);
        }
        const n = window.__hekatanCadState, s = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), ce(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ce("\u238B Cancelado (click derecho)");
      }
    }
  }), $.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), $.addEventListener("pointerdown", (e) => {
    var _a3, _b, _c;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (an = null, uo = false));
  }), $.addEventListener("pointermove", (e) => {
    if (Ht && e.buttons === 0) {
      const r = e.clientX < Ht.x;
      ra(Ht.x, Ht.y, e.clientX, e.clientY, r);
      return;
    }
    if (!an) return;
    const o = e.clientX - an.x, a = e.clientY - an.y, n = Math.hypot(o, a);
    if (!uo && n < 8) return;
    uo = true;
    const s = e.clientX < an.x;
    ra(an.x, an.y, e.clientX, e.clientY, s);
  }), $.addEventListener("pointerup", (e) => {
    if (!an) return;
    if (!uo) {
      an = null;
      return;
    }
    const o = e.ctrlKey || e.metaKey || e.shiftKey;
    Ja(an.x, an.y, e.clientX, e.clientY, o), an = null, uo = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Qt = new ut();
  Qt.visible = false, Qt.frustumCulled = false, g.add(Qt);
  const Qa = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, Ro = (e, o, a, n) => {
    var _a3, _b, _c, _d;
    for (window.__hekatanOsnapUltimo = { type: e, x: o, y: a, z: n }; Qt.children.length; ) {
      const p = Qt.children.pop();
      (_b = (_a3 = p.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = p.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Qa[e] ?? 16777215, r = new Le().setFromPoints([new F(-1, -1, 0), new F(1, -1, 0), new F(1, -1, 0), new F(1, 1, 0), new F(1, 1, 0), new F(-1, 1, 0), new F(-1, 1, 0), new F(-1, -1, 0)]);
    Qt.add(new jt(r, new ft({ color: s, linewidth: 2 }))), Qt.position.set(o, a, n), Qt.visible = true, ua();
  };
  let da = 4;
  const ua = () => {
    Qt.visible && Qt.scale.setScalar(da * Fo(Qt.position));
  };
  window.__hekatanOsnapMarkerRef = Qt, window.__hekatanUpdateOsnapScale = ua, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (da = e, ua(), P()), da);
  const To = () => {
    Qt.visible = false, window.__hekatanOsnapUltimo = null;
  }, Os = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, gn = document.createElement("div");
  gn.id = "hk-osnap-etiqueta", gn.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(gn);
  const Do = (e, o, a) => {
    const n = Os[e];
    if (!n) {
      gn.style.display = "none";
      return;
    }
    gn.textContent = n, gn.style.color = "#" + (Qa[e] ?? 16777215).toString(16).padStart(6, "0"), gn.style.left = o + 18 + "px", gn.style.top = a - 26 + "px", gn.style.display = "block";
  }, Qs = () => {
    gn.style.display = "none";
  }, Dn = new F(), Bn = (e, o, a) => {
    const n = k();
    if (!n) return null;
    const s = $.getBoundingClientRect();
    return Dn.set(e, o, a).project(n), !isFinite(Dn.x) || !isFinite(Dn.y) || Dn.z < -1 || Dn.z > 1 ? null : { x: s.left + (Dn.x * 0.5 + 0.5) * s.width, y: s.top + (-Dn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = Bn;
  const js = (e, o, a, n, s) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const r = window.__hekatanOsnap, p = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let l = null;
    const d = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, c = s, m = (u, x, M, E) => {
      let _;
      if (c) {
        const I = Bn(x, M, E);
        if (!I || (_ = Math.hypot(I.x - c.x, I.y - c.y), _ > Cn)) return;
      } else if (_ = Math.hypot(x - e, M - o, E - a), _ > n) return;
      const C = d[u] ?? 9;
      (!l || C < l.r || C === l.r && _ < l.d) && (l = { type: u, x, y: M, z: E, d: _, r: C });
    };
    if (r.ori !== false && m("ori", 0, 0, 0), r.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, x = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, M = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, E = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", _ = (I) => Math.round(I / x) * x, C = (I, j) => Math.abs(I) <= M + 1e-9 && Math.abs(j) <= M + 1e-9;
      if (E === "xz") {
        const I = _(e), j = _(a);
        C(I, j) && m("grid", I, o, j);
      } else if (E === "yz") {
        const I = _(o), j = _(a);
        C(I, j) && m("grid", e, I, j);
      } else {
        const I = _(e), j = _(o);
        C(I, j) && m("grid", I, j, a);
        const V = window.__hekatanPlanosAux ?? [];
        for (const O of V.slice(0, 24)) {
          if (O.plano === "xy" || !isFinite(O.d)) continue;
          const le = O.plano === "xz" ? new F(0, 1, 0) : new F(1, 0, 0), be = new yo(le, -O.d), $e = new F();
          if (L.ray.intersectPlane(be, $e)) if (O.plano === "xz") {
            const we = _($e.x), Ve = _($e.z);
            C(we, Ve) && m("grid", we, O.d, Ve);
          } else {
            const we = _($e.y), Ve = _($e.z);
            C(we, Ve) && m("grid", O.d, we, Ve);
          }
        }
        const B = window.__hekatanLevels ?? [];
        if (B.length) {
          const O = L.ray, le = new yo(), be = new F();
          for (const $e of B.slice(0, 24)) {
            if (!isFinite($e == null ? void 0 : $e.z) || Math.abs($e.z - a) < 1e-6 || (le.set(new F(0, 0, 1), -$e.z), !O.intersectPlane(le, be))) continue;
            const we = _(be.x), Ve = _(be.y);
            C(we, Ve) && m("grid", we, Ve, $e.z);
          }
        }
      }
    }
    (r.node || r.end) && p.forEach((u) => {
      r.node && m("node", u[0], u[1], u[2]);
    });
    for (const u of i) if (!(u.length < 2)) for (let x = 0; x < u.length - 1; x++) {
      const M = p[u[x]], E = p[u[x + 1]];
      if (!(!M || !E) && (r.end && (m("end", M[0], M[1], M[2]), m("end", E[0], E[1], E[2])), r.mid && m("mid", (M[0] + E[0]) / 2, (M[1] + E[1]) / 2, (M[2] + E[2]) / 2), r.nea || r.per)) {
        const _ = E[0] - M[0], C = E[1] - M[1], I = E[2] - M[2], j = _ * _ + C * C + I * I;
        if (j < 1e-12) continue;
        const V = Math.max(0, Math.min(1, ((e - M[0]) * _ + (o - M[1]) * C + (a - M[2]) * I) / j)), B = M[0] + V * _, O = M[1] + V * C, le = M[2] + V * I;
        r.nea && m("nea", B, O, le), r.per && m("per", B, O, le);
      }
    }
    if (r.cen) {
      const u = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const x of u) {
        const M = i[x];
        if (!M || M.length < 3) continue;
        const E = M[0] === M[M.length - 1] ? M.slice(0, -1) : M;
        let _ = 0, C = 0, I = 0, j = 0;
        for (const V of E) {
          const B = p[V];
          B && (_ += B[0], C += B[1], I += B[2], j++);
        }
        j >= 3 && m("cen", _ / j, C / j, I / j);
      }
    }
    if (r.cen) {
      const u = Ya(), x = [...zo];
      for (const M of u) x.some((E) => Math.hypot(E.c[0] - M.c[0], E.c[1] - M.c[1], E.c[2] - M.c[2]) < 1e-6 && Math.abs(E.r - M.r) < 1e-6) || x.push(M);
      for (const M of x) {
        if (!p.some((C) => Math.abs(Math.hypot(C[0] - M.c[0], C[1] - M.c[1], C[2] - M.c[2]) - M.r) < 1e-6)) continue;
        const _ = Math.hypot(e - M.c[0], o - M.c[1], a - M.c[2]);
        if (_ < n || Math.abs(_ - M.r) < n) {
          const C = Math.min(_, n * 0.5), I = 3;
          (!l || I < l.r || I === l.r && C < l.d) && (l = { type: "cen", x: M.c[0], y: M.c[1], z: M.c[2], d: C, r: I });
        }
      }
    }
    if (r.int) {
      const u = [];
      for (const x of i) for (let M = 0; M < x.length - 1; M++) {
        const E = p[x[M]], _ = p[x[M + 1]];
        if (!E || !_) continue;
        const C = _[0] - E[0], I = _[1] - E[1], j = _[2] - E[2], V = C * C + I * I + j * j;
        if (V < 1e-12) continue;
        const B = Math.max(0, Math.min(1, ((e - E[0]) * C + (o - E[1]) * I + (a - E[2]) * j) / V));
        Math.hypot(E[0] + B * C - e, E[1] + B * I - o, E[2] + B * j - a) < 3 * n && u.push([E, _]);
      }
      for (let x = 0; x < u.length; x++) for (let M = x + 1; M < u.length; M++) {
        const [E, _] = u[x], [C, I] = u[M], j = [_[0] - E[0], _[1] - E[1], _[2] - E[2]], V = [I[0] - C[0], I[1] - C[1], I[2] - C[2]], B = [E[0] - C[0], E[1] - C[1], E[2] - C[2]], O = j[0] * j[0] + j[1] * j[1] + j[2] * j[2], le = j[0] * V[0] + j[1] * V[1] + j[2] * V[2], be = V[0] * V[0] + V[1] * V[1] + V[2] * V[2], $e = j[0] * B[0] + j[1] * B[1] + j[2] * B[2], we = V[0] * B[0] + V[1] * B[1] + V[2] * B[2], Ve = O * be - le * le;
        if (Ve < 1e-12) continue;
        const ke = (le * we - be * $e) / Ve, qe = (O * we - le * $e) / Ve;
        if (ke < -1e-6 || ke > 1 + 1e-6 || qe < -1e-6 || qe > 1 + 1e-6) continue;
        const Fe = [E[0] + ke * j[0], E[1] + ke * j[1], E[2] + ke * j[2]], ze = [C[0] + qe * V[0], C[1] + qe * V[1], C[2] + qe * V[2]];
        if (Math.hypot(Fe[0] - ze[0], Fe[1] - ze[1], Fe[2] - ze[2]) > 1e-4) continue;
        [E, _, C, I].some((Qe) => Math.hypot(Qe[0] - Fe[0], Qe[1] - Fe[1], Qe[2] - Fe[2]) < 1e-6) || m("int", Fe[0], Fe[1], Fe[2]);
      }
    }
    const f = window.__hekatanAxisGrids ?? [], h = window.__hekatanLevels ?? [], b = f.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, x] of b) {
      r.end && (m("end", u[0], u[1], u[2]), m("end", x[0], x[1], x[2]));
      const M = x[0] - u[0], E = x[1] - u[1], _ = x[2] - u[2], C = M * M + E * E + _ * _;
      if (C < 1e-12) continue;
      const I = Math.max(0, Math.min(1, ((e - u[0]) * M + (o - u[1]) * E + (a - u[2]) * _) / C));
      if (r.nea && m("nea", u[0] + I * M, u[1] + I * E, u[2] + I * _), r.int && Math.abs(_) > 1e-9) for (const j of h) {
        const V = (j.z - u[2]) / _;
        V < -1e-6 || V > 1 + 1e-6 || m("int", u[0] + V * M, u[1] + V * E, j.z);
      }
    }
    if (r.int || r.node) for (let u = 0; u < b.length; u++) for (let x = u + 1; x < b.length; x++) {
      const [M, E] = b[u], [_, C] = b[x], I = E[0] - M[0], j = E[1] - M[1], V = C[0] - _[0], B = C[1] - _[1], O = I * B - j * V;
      if (Math.abs(O) < 1e-12) continue;
      const le = M[0] - _[0], be = M[1] - _[1], $e = (V * be - B * le) / O, we = (I * be - j * le) / O;
      if ($e < -1e-6 || $e > 1 + 1e-6 || we < -1e-6 || we > 1 + 1e-6) continue;
      const Ve = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      m("int", M[0] + $e * I, M[1] + $e * j, typeof Ve == "number" ? Ve : a);
    }
    const v = window.__hekatanDrawingAuxLines, w = (v == null ? void 0 : v.rawVal) ?? (v == null ? void 0 : v.val) ?? v ?? [];
    for (const u of w) {
      if (u.length !== 6) continue;
      const x = [u[0], u[1], u[2]], M = [u[3], u[4], u[5]];
      if (r.end && (m("end", x[0], x[1], x[2]), m("end", M[0], M[1], M[2])), r.mid && m("mid", (x[0] + M[0]) / 2, (x[1] + M[1]) / 2, (x[2] + M[2]) / 2), r.nea || r.per) {
        const E = M[0] - x[0], _ = M[1] - x[1], C = M[2] - x[2], I = E * E + _ * _ + C * C;
        if (I < 1e-12) continue;
        const j = Math.max(0, Math.min(1, ((e - x[0]) * E + (o - x[1]) * _ + (a - x[2]) * C) / I)), V = x[0] + j * E, B = x[1] + j * _, O = x[2] + j * C;
        r.nea && m("nea", V, B, O), r.per && m("per", V, B, O);
      }
    }
    return l ? { type: l.type, x: l.x, y: l.y, z: l.z } : null;
  }, On = new ut();
  On.frustumCulled = false, g.add(On);
  const ja = new ft({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let es = 0;
  const ts = () => {
    var _a3, _b;
    for (const e of On.children.slice()) On.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (e) => {
    var _a3, _b;
    ts();
    const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of e || []) {
      const r = String(s).split(":");
      let p = [];
      if (r[0] === "pt") {
        const d = o[+r[1]];
        d && (p = [d, [d[0] + 1e-3, d[1], d[2]]]);
      } else if (r[0] === "seg") {
        const d = a[+r[1]] || [], c = o[d[+r[2]]], m = o[d[+r[2] + 1]];
        c && m && (p = [c, m]);
      } else r[0] === "poly" && (p = (a[+r[1]] || []).map((c) => o[c]).filter(Boolean));
      if (p.length < 2) continue;
      const i = new Le().setFromPoints(p.map((d) => new F(d[0], d[1], d[2]))), l = new Et(i, ja);
      l.renderOrder = 1200, On.add(l);
    }
    if (!On.children.length) return;
    es = performance.now() + 900;
    const n = () => {
      const s = es - performance.now();
      if (s <= 0) {
        ts(), P();
        return;
      }
      ja.opacity = Math.min(1, s / 900) * 0.95, P(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a3;
    const o = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = js, window.__hekatanOsnapShow = Ro, window.__hekatanOsnapHide = To;
  let Je = [], Ct = 0, Nn = 0, Bt = null;
  const fo = document.createElement("div");
  fo.id = "hk-cad-status", fo.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", fo.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(fo);
  const ei = () => {
    var _a3, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), zt && e.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && e.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, ce = (e) => {
    var _a3;
    const o = e + ei();
    fo.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, ti = "Comando:", ni = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], n = Je.length, s = (r, p = []) => ({ txt: r, ops: p });
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
        return s(n ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${at.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return s("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return s(`REGLA ${pt.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
      case "rect":
        return s(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "parabola":
        return s(`PAR\xC1BOLA Precise punto ${n + 1} de 3 (pasa por los tres):`);
      case "cubica":
        return s(`C\xDABICA Precise punto ${n + 1} de 4 (pasa por los cuatro):`);
      case "revolve":
        return s("REVOLUCI\xD3N Precise un punto del eje vertical (Z) alrededor del que gira la selecci\xF3n:");
      case "loft":
        return s("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${Ct > 0 ? Ct : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${Ct > 0 ? Ct : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${n + 1} de 3:`);
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
        return s(n ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return s("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return s(n ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return s("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return He.size ? s(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return He.size ? s(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return He.size ? s(`SELECCI\xD3N ${He.size} objeto${He.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(ti);
    }
  }, Jt = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const e = ni(), o = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !o && !a ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, s, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Jt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", o = e.split("   |   ")[0] ?? e;
    ce(o);
  }, window.__hekatanCadResetPending = () => {
    Je = [], at = [], Be.visible = false, pa(), Bt = null, P(), ce("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Jt();
  };
  function pa() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((o) => o.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = pa;
  const Qn = [], Bo = [], oi = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, ai = () => JSON.parse(JSON.stringify(window.__hekatanAxisGrids ?? [])), si = () => JSON.parse(JSON.stringify(window.__hekatanLevels ?? [])), ii = () => JSON.parse(JSON.stringify(window.__hekatanPlanosAux ?? [])), fa = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])), x: oi(), e: ai(), n: si(), g: ii() };
  }, ns = (e) => {
    var _a3, _b, _c, _d;
    if (t.points.val = e.p, t.polylines && (t.polylines.val = e.l), t.areas && (t.areas.val = e.a), e.x) {
      const o = window.__hekatanDrawingAuxLines;
      o && "val" in o && (o.val = e.x);
    }
    if (e.e) {
      const o = window.__hekatanAxisGrids;
      Array.isArray(o) && (o.length = 0, o.push(...e.e));
    }
    if (e.n) {
      const o = window.__hekatanLevels;
      Array.isArray(o) && (o.length = 0, o.push(...e.n));
    }
    if (e.g) {
      const o = window.__hekatanPlanosAux;
      Array.isArray(o) ? (o.length = 0, o.push(...e.g)) : window.__hekatanPlanosAux = e.g;
    }
    try {
      (_a3 = window.__hekatanRefreshAxes) == null ? void 0 : _a3.call(window), (_b = window.__hekatanRefreshLevels) == null ? void 0 : _b.call(window);
    } catch {
    }
    try {
      (_c = window.__hekatanRefrescarGrillas) == null ? void 0 : _c.call(window);
    } catch {
    }
    Je = [], We.visible = false, Xt.visible = false, pn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    P(), Jt();
  }, St = () => {
    Qn.push(fa()), Qn.length > 100 && Qn.shift(), Bo.length = 0;
  }, No = () => {
    const e = Qn.pop();
    if (!e) {
      ce("\u21B6 Nada para deshacer");
      return;
    }
    Bo.push(fa()), ns(e), ce(`\u21B6 Deshacer \u2014 quedan ${Qn.length}`);
  }, os = () => {
    const e = Bo.pop();
    if (!e) {
      ce("\u21B7 Nada para rehacer");
      return;
    }
    Qn.push(fa()), ns(e), ce(`\u21B7 Rehacer \u2014 quedan ${Bo.length}`);
  };
  window.__hekatanPushUndo = St, window.__hekatanUndo = No, window.__hekatanRedo = os, document.addEventListener("keydown", (e) => {
    var _a3;
    const o = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (o === "y" || o === "z" && e.shiftKey))) return;
    const n = e.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a3 = n.value) == null ? void 0 : _a3.length) ?? 0) > 0 && n.__hkSucio || (e.preventDefault(), e.stopPropagation(), os());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a3, _b, _c, _d, _e2;
    const o = e.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const n = t.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (No(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ce("Cerrar necesita al menos tres puntos."), true;
      St(), t.polylines.val = [...n.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ha(), ce(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return No(), true;
      St();
      const r = s[s.length - 1], p = s.slice(0, -1), i = n.some((c, m) => m !== n.length - 1 && c.includes(r)) || p.includes(r);
      let l = t.points.rawVal, d = [...n.slice(0, -1), p];
      if (!i && r === l.length - 1 && (l = l.slice(0, -1), t.points.val = l), t.polylines.val = d, p.length) {
        const c = l[p[p.length - 1]];
        c && (Ze = [c[0], c[1], c[2]]);
      } else Ze = null, We.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return P(), ce(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${p.length}.`), Jt(), true;
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
      e.preventDefault(), e.stopPropagation(), No();
    }
  }, { capture: true });
  const ha = () => {
    Je = [], Bt = null, pa(), zt = null, La(), We.visible = false, Xt.visible = false, pn(), ce("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), P(), Jt();
  };
  window.__hekatanFinalizeDraw = ha;
  const as = () => {
    var _a3, _b, _c;
    Je = [], at = [], Be.visible = false;
    let e = false;
    He.size && (He.clear(), nn(), e = true), ha();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ce(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), P(), Jt();
  };
  window.__hekatanEscapeCancel = as;
  const ss = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return He.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (e[+a.slice(5)] || []).forEach((n) => o.add(n));
      else if (a.startsWith("seg:")) {
        const n = a.split(":"), s = e[+n[1]] || [], r = s[+n[2]], p = s[+n[2] + 1];
        r != null && o.add(r), p != null && o.add(p);
      }
    }), o;
  }, is = (e, o, a) => {
    var _a3;
    const n = ss();
    if (!n.size) return 0;
    St();
    const s = t.points.rawVal.map((r, p) => n.has(p) ? [r[0] + e, r[1] + o, r[2] + a] : r);
    t.points.val = s;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return nn(), P(), n.size;
  };
  window.__hekatanMoveSelection = is;
  const ls = (e, o) => {
    var _a3, _b, _c, _d, _e2;
    if (!He.size) {
      ce(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Jt();
      return;
    }
    if (Je.push(o), Je.length === 1) {
      Ze = o, ce(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Jt();
      return;
    }
    const [a, n] = Je, s = [n[0] - a[0], n[1] - a[1], n[2] - a[2]];
    Je = [], We.visible = false;
    let r = 0;
    e === "move" ? r = is(s[0], s[1], s[2]) : (r = ss().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ce(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${r} nudo${r === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (He.clear(), nn()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Jt();
  };
  window.__hekatanPasoMoverCopiar = ls;
  const li = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, An = (e, o) => Math.hypot(e[0] - o[0], e[1] - o[1], e[2] - o[2]), ma = (e, o, a, n, s, r) => {
    const p = [o[0] - e[0], o[1] - e[1], o[2] - e[2]], i = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], l = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], d = p[0] * p[0] + p[1] * p[1] + p[2] * p[2], c = p[0] * i[0] + p[1] * i[1] + p[2] * i[2], m = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], f = p[0] * l[0] + p[1] * l[1] + p[2] * l[2], h = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], b = d * m - c * c;
    if (b < 1e-12) return null;
    const v = (c * h - m * f) / b, w = (d * h - c * f) / b;
    if (!s && (v < -1e-6 || v > 1 + 1e-6) || !r && (w < -1e-6 || w > 1 + 1e-6)) return null;
    const u = [e[0] + v * p[0], e[1] + v * p[1], e[2] + v * p[2]], x = [a[0] + w * i[0], a[1] + w * i[1], a[2] + w * i[2]];
    return An(u, x) > 1e-4 ? null : u;
  }, ri = (e) => {
    var _a3;
    return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((o, a) => o + a.filter((n) => n === e).length, 0);
  }, ci = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, di = (e, o) => {
    var _a3, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal, n = t.points.rawVal, s = ci[e];
    if (!Bt) {
      if (dn < 0) {
        ce(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Bt = { poly: dn, seg: Math.max(0, Pn) }, ce(e === "offset" ? `DESFASE l\xEDnea #${Bt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Nn > 0 ? ` (${Nn} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Jt();
      return;
    }
    if (e === "offset") {
      const v = Bt.poly, w = a[v];
      if (!w || w.length < 2) {
        Bt = null, ce("DESFASE: esa polil\xEDnea no tiene tramos."), Jt();
        return;
      }
      const u = w.length > 2 && w[0] === w[w.length - 1], x = li(), M = [];
      for (let ke = 0; ke < w.length - 1; ke++) {
        const qe = n[w[ke]], Fe = n[w[ke + 1]], ze = [Fe[0] - qe[0], Fe[1] - qe[1], Fe[2] - qe[2]], Ge = Math.hypot(ze[0], ze[1], ze[2]) || 1, Qe = ze[0] / Ge, mt = ze[1] / Ge, vt = ze[2] / Ge, Vt = [x[1] * vt - x[2] * mt, x[2] * Qe - x[0] * vt, x[0] * mt - x[1] * Qe], sn = Math.hypot(Vt[0], Vt[1], Vt[2]) || 1;
        M.push({ a: qe, b: Fe, n: [Vt[0] / sn, Vt[1] / sn, Vt[2] / sn] });
      }
      let E = 0, _ = 1 / 0;
      M.forEach((ke, qe) => {
        const Fe = ao(o[0], o[1], o[2], ke.a[0], ke.a[1], ke.a[2], ke.b[0], ke.b[1], ke.b[2]);
        Fe < _ && (_ = Fe, E = qe);
      });
      const C = M[E], I = Math.sign((o[0] - C.a[0]) * C.n[0] + (o[1] - C.a[1]) * C.n[1] + (o[2] - C.a[2]) * C.n[2]) || 1, j = Nn > 0 ? Nn : _;
      if (j < 1e-6) {
        ce("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const V = M.map((ke) => ({ a: [ke.a[0] + I * j * ke.n[0], ke.a[1] + I * j * ke.n[1], ke.a[2] + I * j * ke.n[2]], b: [ke.b[0] + I * j * ke.n[0], ke.b[1] + I * j * ke.n[1], ke.b[2] + I * j * ke.n[2]] })), B = V.length, O = (ke) => {
        const qe = V[(ke - 1 + B) % B], Fe = V[ke % B];
        return ma(qe.a, qe.b, Fe.a, Fe.b, true, true) ?? Fe.a;
      }, le = [], be = u ? B : B + 1;
      for (let ke = 0; ke < be; ke++) !u && ke === 0 ? le.push(V[0].a) : !u && ke === B ? le.push(V[B - 1].b) : le.push(O(ke));
      St();
      const $e = n.length;
      t.points.val = [...n, ...le];
      const we = le.map((ke, qe) => $e + qe);
      u && we.push($e);
      let Ve = a.slice();
      Ve.length && Ve[Ve.length - 1].length === 0 && (Ve = Ve.slice(0, -1)), t.polylines.val = [...Ve, we, []], Bt = null, ce(`\u2713 Desfase a ${j.toFixed(2)} m \u2014 ${B} tramo${B === 1 ? "" : "s"} nuevo${B === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      P(), Jt();
      return;
    }
    let r = dn, p = Math.max(0, Pn);
    if (r < 0 || r === Bt.poly && p === Bt.seg) {
      let w = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (r = -1, a.forEach((u, x) => {
        for (let M = 0; M < u.length - 1; M++) {
          if (x === Bt.poly && M === Bt.seg) continue;
          const E = n[u[M]], _ = n[u[M + 1]];
          if (!E || !_) continue;
          const C = ao(o[0], o[1], o[2], E[0], E[1], E[2], _[0], _[1], _[2]);
          C < w && (w = C, r = x, p = M);
        }
      }), r < 0) {
        ce(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const i = a[Bt.poly], l = n[i[Bt.seg]], d = n[i[Bt.seg + 1]], c = a[r], m = c[p], f = c[p + 1];
    if (!l || !d || m == null || f == null) {
      ce(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const h = n[m], b = n[f];
    if (e === "trim") {
      const v = ma(h, b, l, d, false, false);
      if (!v) {
        ce("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      St();
      const w = n.length;
      t.points.val = [...n, v];
      const u = [...c.slice(0, p + 1), w, ...c.slice(p + 1)];
      t.polylines.val = a.map((M, E) => E === r ? u : M);
      const x = An(o, h) < An(o, b);
      Da(r, x ? p : p + 1), ce(`\u2713 Recortado en (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const v = ma(h, b, l, d, true, false);
      if (!v) {
        ce("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = An(o, h) < An(o, b) ? p : p + 1;
      if (u !== 0 && u !== c.length - 1) {
        ce("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = c[u];
      if (An(v, h) + An(v, b) < An(h, b) + 1e-6) {
        ce("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (St(), ri(x) > 1) {
        const E = n.length;
        t.points.val = [...n, v];
        const _ = c.slice();
        _[u] = E, t.polylines.val = a.map((C, I) => I === r ? _ : C);
      } else t.points.val = n.map((E, _) => _ === x ? v : E);
      ce(`\u2713 Alargada hasta (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    P(), Jt();
  };
  window.__hekatanSelectionSize = () => He.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let o = e.length - 1;
    for (; o >= 0 && (!e[o] || e[o].length < 2); ) o--;
    return He.clear(), o >= 0 && He.add(`poly:${o}`), nn(), ce(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), He.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    He.clear();
    const a = /* @__PURE__ */ new Set();
    return e.forEach((n, s) => {
      !n || n.length < 2 || (He.add(`poly:${s}`), n.forEach((r) => a.add(r)));
    }), o.forEach((n, s) => {
      a.has(s) || He.add(`pt:${s}`);
    }), nn(), ce(`SELECCI\xD3N ${He.size} objetos (todo el modelo) \xB7 Esc suelta`), He.size;
  }, window.__hekatanReplicateSelection = (e, o, a, n, s = 0) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), s = Math.max(0, Math.round(s || 0));
    const r = [...He], p = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), d = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), m = [];
    if (r.forEach((w) => {
      if (w.startsWith("pt:")) {
        const u = +w.slice(3);
        p[u] && d.add(u);
      } else if (w.startsWith("poly:")) {
        const u = +w.slice(5);
        if (!i[u] || i[u].length < 2) return;
        c.add(u), i[u].forEach((x) => d.add(x));
      } else if (w.startsWith("seg:")) {
        const u = w.split(":"), x = +u[1], M = +u[2], E = i[x] || [], _ = E[M], C = E[M + 1];
        _ != null && C != null && (m.push([_, C]), d.add(_), d.add(C));
      }
    }), !d.size) return 0;
    St();
    const f = [...p];
    let h = i.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const b = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], v = [...d];
    for (let w = 1; w <= n; w++) {
      const u = s + w, x = e * u, M = o * u, E = a * u, _ = /* @__PURE__ */ new Map();
      v.forEach((C) => {
        _.set(C, f.length), f.push([p[C][0] + x, p[C][1] + M, p[C][2] + E]);
      }), c.forEach((C) => {
        const I = i[C].map((V) => _.has(V) ? _.get(V) : V), j = h.length;
        h.push(I), l.has(C) && b.push(j);
      }), m.forEach(([C, I]) => {
        h.push([_.get(C), _.get(I)]);
      });
    }
    h.push([]), t.points.val = f, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = b);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return P(), n;
  }, window.__hekatanExtrudeSelection = (e, o, a, n) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1));
    const s = [...He], r = t.points.rawVal, p = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), l = /* @__PURE__ */ new Set(), d = [], c = /* @__PURE__ */ new Set();
    for (const x of p) for (const M of x) c.add(M);
    if (s.forEach((x) => {
      if (x.startsWith("poly:")) {
        const M = +x.slice(5);
        if (i.has(M)) return;
        const E = p[M] || [];
        for (let _ = 0; _ + 1 < E.length; _++) d.push([E[_], E[_ + 1]]), c.add(E[_]), c.add(E[_ + 1]);
      } else if (x.startsWith("seg:")) {
        const M = x.split(":"), E = +M[1], _ = +M[2], C = p[E] || [], I = C[_], j = C[_ + 1];
        I != null && j != null && (d.push([I, j]), c.add(I), c.add(j));
      }
    }), s.forEach((x) => {
      if (x.startsWith("pt:")) {
        const M = +x.slice(3);
        r[M] && !c.has(M) && l.add(M);
      }
    }), !l.size && !d.length) return { lineas: 0, areas: 0 };
    St();
    const m = [...r];
    let f = p.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const h = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], b = /* @__PURE__ */ new Map(), v = (x, M) => {
      if (M === 0) return x;
      const E = x + ":" + M;
      let _ = b.get(E);
      if (_ == null) {
        const C = [r[x][0] + e * M, r[x][1] + o * M, r[x][2] + a * M];
        _ = m.findIndex((I) => Math.abs(I[0] - C[0]) < 1e-3 && Math.abs(I[1] - C[1]) < 1e-3 && Math.abs(I[2] - C[2]) < 1e-3), _ < 0 && (_ = m.length, m.push(C)), b.set(E, _);
      }
      return _;
    };
    let w = 0, u = 0;
    l.forEach((x) => {
      const M = [x];
      for (let E = 1; E <= n; E++) M.push(v(x, E));
      f.push(M), w += n;
    }), d.forEach(([x, M]) => {
      for (let E = 1; E <= n; E++) {
        const _ = [v(x, E - 1), v(M, E - 1), v(M, E), v(x, E)];
        h.push(f.length), f.push([..._, _[0]]), u++;
      }
    }), f.push([]), t.points.val = m, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = h);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return P(), { lineas: w, areas: u };
  }, window.__hekatanVoladoSelection = (e, o = {}) => {
    var _a3, _b, _c;
    const a = Number(e);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const n = o.losa !== false, s = o.vigaBorde !== false, r = o.lados === "afuera" ? "afuera" : "ambos", p = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = [];
    if ([...He].forEach((v) => {
      if (v.startsWith("seg:")) {
        const w = v.split(":"), u = +w[1], x = +w[2], M = i[u] || [], E = M[x], _ = M[x + 1];
        E != null && _ != null && l.push([E, _]);
      } else if (v.startsWith("poly:")) {
        const w = i[+v.slice(5)] || [];
        for (let u = 0; u + 1 < w.length; u++) l.push([w[u], w[u + 1]]);
      }
    }), !l.length) return 0;
    let d = 0, c = 0;
    for (const v of p) d += v[0], c += v[1];
    d /= Math.max(1, p.length), c /= Math.max(1, p.length), St();
    const m = [...p];
    let f = i.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const h = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let b = 0;
    for (const [v, w] of l) {
      const u = p[v], x = p[w];
      if (!u || !x) continue;
      const M = x[0] - u[0], E = x[1] - u[1], _ = Math.hypot(M, E);
      if (_ < 1e-6) continue;
      let C = -E / _, I = M / _;
      const j = (u[0] + x[0]) / 2, V = (u[1] + x[1]) / 2;
      (j - d) * C + (V - c) * I < 0 && (C = -C, I = -I);
      const B = r === "ambos" ? [1, -1] : [1];
      for (const O of B) {
        const le = C * a * O, be = I * a * O, $e = m.length;
        m.push([u[0] + le, u[1] + be, u[2]]);
        const we = m.length;
        m.push([x[0] + le, x[1] + be, x[2]]), f.push([v, $e]), f.push([w, we]), s && f.push([$e, we]), n && (h.push(f.length), f.push([v, w, we, $e, v])), b++;
      }
    }
    if (!b) return 0;
    f.push([]), t.points.val = m, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = h);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), b;
  }, $.addEventListener("click", (e) => {
    var _a3, _b, _c;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Tn > 5) {
      Tn = 0;
      return;
    }
    Tn = 0;
    const o = N(e);
    if (!o) return;
    L.setFromCamera(Y, o);
    const a = !!(Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3), n = a ? [{ point: Tt.p.clone(), distance: o.position.distanceTo(Tt.p) }] : Ye();
    if (!n.length) return;
    if (!a) {
      const r = o.position.distanceTo(S.target) || 1, p = n[0].distance ?? o.position.distanceTo(n[0].point), i = n[0].point;
      if (!isFinite(i.x) || !isFinite(i.y) || !isFinite(i.z) || p > Math.max(r * 12, 300)) {
        ce("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let s = n[0].point;
    (e.ctrlKey || e.metaKey) && (s = new F(Math.round(n[0].point.x), Math.round(n[0].point.y), Math.round(n[0].point.z)));
    {
      const r = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], p = r[r.length - 1] ?? [], i = t.points.rawVal ?? [];
      if (p.length > 0) {
        const l = i[p[p.length - 1]];
        if (l) {
          const d = !!window.__hekatanOrthoMode;
          let c = zt;
          if (!c && d) {
            const m = Math.abs(s.x - l[0]), f = Math.abs(s.y - l[1]), h = Math.abs(s.z - l[2]);
            c = m >= f && m >= h ? "x" : f >= h ? "y" : "z";
          }
          c === "x" ? s = new F(s.x, l[1], l[2]) : c === "y" ? s = new F(l[0], s.y, l[2]) : c === "z" && (s = new F(l[0], l[1], s.z));
        }
      }
    }
    if (Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3) s = Tt.p.clone();
    else if (Mo) s = Mo.clone(), ce(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
    else {
      const r = aa(s), p = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, s.x, s.y, s.z, r, { x: e.clientX, y: e.clientY });
      if (p) s = new F(p.x, p.y, p.z), ce(`\u{1F3AF} Snap [${p.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        i && l > 0 && (s = new F(Math.round(s.x / l) * l, Math.round(s.y / l) * l, Math.round(s.z / l) * l));
      }
    }
    wa(s, e);
  });
  const ui = (e) => {
    var _a3;
    const o = (_a3 = t.gridTarget) == null ? void 0 : _a3.rawVal;
    if (!o) return true;
    const a = new F(0, 0, 1).applyEuler(new Sn(...o.rotation)).normalize(), n = L.ray.direction;
    return n.lengthSq() < 1e-12 ? true : Math.abs(n.clone().normalize().dot(a)) >= 0.026;
  }, wa = (e, o) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (!(a === "select" || a === "none" || !a || a === "medir" || a === "move" || a === "copy" || a === "delete" || a === "trim" || a === "extend") && !ui()) {
      ce(`\u2715 Est\xE1s mirando el plano de trabajo casi de canto, y ah\xED un p\xEDxel vale decenas de metros: el punto caer\xEDa en (${e.x.toFixed(1)}, ${e.y.toFixed(1)}, ${e.z.toFixed(1)}) m. Gira la vista, ponte en una ortogonal (Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`);
      return;
    }
    if (a === "select" || a === "none" || !a) {
      if (xn) {
        Ht && Lo();
        const { kind: i, a: l, b: d } = xn, c = d !== void 0 ? `${i}:${l}:${d}` : `${i}:${l}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || He.clear(), He.has(c) ? He.delete(c) : He.add(c), nn(), ce(`\u2713 Seleccionados ${He.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), l = (o == null ? void 0 : o.clientX) ?? 0, d = (o == null ? void 0 : o.clientY) ?? 0;
        Ht ? (Ja(Ht.x, Ht.y, l, d, i), Ht = null) : i || (Ht = { x: l, y: d }, ce("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), ra(l, d, l + 1, d + 1, false));
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
      ls(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "delete") {
      if (zn >= 0) {
        const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], d = zn;
        if (d >= 0 && d < l.length) {
          St();
          const c = l.slice(0, d).concat(l.slice(d + 1));
          i && typeof i == "object" && "val" in i ? i.val = c : window.__hekatanDrawingAuxLines = c, ce(`\u{1F5D1} L\xEDnea auxiliar #${d + 1} borrada`), zn = -1, qt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (dn >= 0) {
        const i = dn, l = Pn;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (Po(i), ce(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (Da(i, l), ce(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : (Po(i), ce(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else ce("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Je.push([e.x, e.y, e.z]), Je.length === 1) {
        ce("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, l] = Je, d = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), c = Math.abs(l[0] - i[0]), m = Math.abs(l[1] - i[1]), f = Math.abs(l[2] - i[2]), h = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), v = (h === "xy" ? f < 1e-3 : h === "xz" ? m < 1e-3 : h === "yz" ? c < 1e-3 : false) ? h : f < 1e-3 ? "xy" : m < 1e-3 ? "xz" : "yz", w = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], d, w, v), ce(`\u2713 C\xEDrculo dibujado en ${v.toUpperCase()} \u2014 r=${d.toFixed(2)}m, ${w} segmentos`), Je = [];
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
      let m = String(window.__hekatanIfcCaraPos ?? "auto"), f = false;
      try {
        const E = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        f = Math.round((E == null ? void 0 : E.matShell) ?? 0) === 1;
      } catch {
      }
      m === "auto" && (m = Math.abs(d.z) > 0.5 ? f ? "interior" : "exterior" : "media");
      const h = c ?? 0.2, b = m === "exterior" ? 0 : m === "interior" ? h : h / 2, v = l.map((E) => E.clone().addScaledVector(d, -b));
      St(), at = v.map((E) => [E.x, E.y, E.z]);
      const w = Eo();
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
      const M = m === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : m === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + h.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (h / 2).toFixed(2) + " m hacia dentro)";
      ce(`\u25A6 \xC1rea desde la cara del IFC: ${l.length} v\xE9rtices, ${w} shell(s). Espesor medido ${c ? c.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${M}; formulaci\xF3n ${x}, t = ${h.toFixed(2)} m.`), fe(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      P();
      return;
    }
    if (a === "ifcline") {
      if (!xe || xe.length < 2) {
        ce("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = R(xe);
      St();
      const l = t.points.rawVal, d = [], c = [];
      for (const f of i) {
        let h = l.findIndex((b) => Math.abs(b[0] - f[0]) < 1e-3 && Math.abs(b[1] - f[1]) < 1e-3 && Math.abs(b[2] - f[2]) < 1e-3);
        h < 0 && (h = l.length + c.length, c.push(f)), d.push(h);
      }
      if (t.points.val = [...l, ...c], t.polylines) {
        const f = t.polylines.rawVal, h = f.length && f[f.length - 1].length === 0 ? f.slice(0, -1) : f;
        t.polylines.val = [...h, d, []];
      }
      const m = xe.reduce((f, h, b) => b ? f + h.distanceTo(xe[b - 1]) : 0, 0);
      ce(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${m.toFixed(2)} m de desarrollo.`), Z(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      P();
      return;
    }
    if (a === "arc") {
      if (Je.push([e.x, e.y, e.z]), Je.length === 1) {
        ce("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Je.length === 2) {
        ce("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [i, l, d] = Je, c = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, l, d, c), ce(`\u2713 Arco dibujado \u2014 ${c} segmentos`), Je = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "parabola" || a === "cubica") {
      const i = a === "parabola" ? 3 : 4, l = a === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Je.push([e.x, e.y, e.z]), Je.length < i) {
        ce(`\u223F ${l} \u2014 punto ${Je.length}/${i} OK. Marc\xE1 el ${Je.length + 1}\xBA.`);
        return;
      }
      const d = window.__hekatanArcSegs ?? 12, c = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Je.slice(), d);
      if (!(c == null ? void 0 : c.ok)) {
        ce(`\u26A0 ${l}: ${(c == null ? void 0 : c.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Je = [];
        return;
      }
      const m = "xyz"[c.ia ?? 0], f = "xyz"[c.io ?? 2], h = (c.coef ?? []).map((b, v) => `${b >= 0 && v ? "+" : ""}${b.toFixed(3)}${v ? "\xB7" + m + (v > 1 ? "^" + v : "") : ""}`).join(" ");
      ce(`\u2713 ${l} dibujada en ${String(c.plano ?? "").toUpperCase()} \u2014 ${d} tramos a \u0394 igual de ${m} \xB7 ${f} = ${h}`), Je = [];
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
      if (Je.push([e.x, e.y, e.z]), Je.length === 1) {
        ce("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Je;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, l), ce(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Je = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const l = (Tt && Math.abs(Tt.x - o.clientX) < 3 && Math.abs(Tt.y - o.clientY) < 3 ? [Tt.p.x, Tt.p.y, Tt.p.z] : null) ?? rt(o);
      if (!l) return;
      if (pt.length >= 2 && (pt = []), pt.push(l), pt.length === 1) it.visible = false, Ft(), ce("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [d, c] = pt;
        it.geometry.setFromPoints([new F(d[0], d[1], d[2]), new F(c[0], c[1], c[2])]), it.visible = true;
        const m = Math.hypot(c[0] - d[0], c[1] - d[1], c[2] - d[2]), f = Math.hypot(c[0] - d[0], c[1] - d[1]);
        tt.textContent = `${m.toFixed(3)} m`, Ft(), ce(`\u{1F4CF} Distancia ${m.toFixed(3)} m  \xB7  \u0394x ${(c[0] - d[0]).toFixed(3)}  \u0394y ${(c[1] - d[1]).toFixed(3)}  \u0394z ${(c[2] - d[2]).toFixed(3)}  \xB7  en planta ${f.toFixed(3)} m`);
      }
      P();
      return;
    }
    if (a === "fillarea") {
      const i = t.points.rawVal, l = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], d = /* @__PURE__ */ new Map(), c = (V, B) => {
        V !== B && ((d.get(V) ?? d.set(V, /* @__PURE__ */ new Set()).get(V)).add(B), (d.get(B) ?? d.set(B, /* @__PURE__ */ new Set()).get(B)).add(V));
      };
      for (const V of l) for (let B = 0; B + 1 < V.length; B++) c(V[B], V[B + 1]);
      const m = (V, B) => {
        var _a4;
        return !!((_a4 = d.get(V)) == null ? void 0 : _a4.has(B));
      }, f = /* @__PURE__ */ new Set(), h = [], b = [...d.keys()];
      for (const V of b) for (const B of d.get(V)) if (!(B < V)) {
        for (const O of d.get(B)) if (O !== V) for (const le of d.get(O)) {
          if (le === V || le === B || !m(le, V) || m(V, O) || m(B, le)) continue;
          const be = [V, B, O, le].slice().sort(($e, we) => $e - we).join("-");
          f.has(be) || (f.add(be), h.push([V, B, O, le]));
        }
      }
      for (const V of b) for (const B of d.get(V)) if (!(B < V)) for (const O of d.get(B)) {
        if (O === V || !m(O, V)) continue;
        const le = [V, B, O].slice().sort((be, $e) => be - $e).join("-");
        f.has(le) || (f.add(le), h.push([V, B, O]));
      }
      const v = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", w = (V) => v === "xy" ? [V[0], V[1]] : v === "xz" ? [V[0], V[2]] : [V[1], V[2]], u = w([e.x, e.y, e.z]), x = (V, B) => {
        let O = false;
        for (let le = 0, be = B.length - 1; le < B.length; be = le++) {
          const $e = B[le][0], we = B[le][1], Ve = B[be][0], ke = B[be][1];
          we > V[1] != ke > V[1] && V[0] < (Ve - $e) * (V[1] - we) / (ke - we) + $e && (O = !O);
        }
        return O;
      }, M = (V) => {
        let B = 0;
        for (let O = 0, le = V.length - 1; O < V.length; le = O++) B += (V[le][0] + V[O][0]) * (V[le][1] - V[O][1]);
        return Math.abs(B) / 2;
      };
      let E = null, _ = 1 / 0;
      for (const V of h) {
        const B = V.map((le) => w(i[le]));
        if (!x(u, B)) continue;
        const O = M(B);
        O < _ && (_ = O, E = V);
      }
      if (!E) {
        ce("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const C = E.slice().sort((V, B) => V - B).join("-"), I = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (I.some((V) => {
        const B = l[V] ?? [];
        return [...new Set(B)].sort((O, le) => O - le).join("-") === C;
      })) {
        ce("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...l, [...E, E[0]]], t.areas.val = [...I, l.length], ce(`\u2713 \xC1rea creada por relleno (${E.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Je.push([e.x, e.y, e.z]), Je.length === 1) {
        ce("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Je;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), ce(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Je = [];
      return;
    }
    if (a === "polyarea") {
      at.push([e.x, e.y, e.z]), Be.geometry.setFromPoints(at.map((i) => new F(i[0], i[1], i[2]))), Be.visible = at.length >= 1, ce(`\u25B0 \xC1rea libre \u2014 ${at.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), P();
      return;
    }
    if (a === "plane3") {
      if (Je.push([e.x, e.y, e.z]), Je.length < 3) {
        ce(`\u25E3 Plano inclinado \u2014 punto ${Je.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [i, l, d] = Je, c = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, l, d);
      ce(c ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Je = [];
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
      if (Je.push([e.x, e.y, e.z]), Je.length === 1) {
        ce("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [i, l] = Je, d = Ct && Ct > 0 ? Ct : 3;
      St();
      const c = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [l[0], l[1], l[2]], [l[0], l[1], l[2] + d], [i[0], i[1], i[2] + d]];
      const m = t.polylines.rawVal;
      if (m.length - 1, t.polylines.val = [...m.slice(0, -1), ...m[m.length - 1].length > 0 ? [m[m.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], t.areas) {
        const f = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, f];
      }
      ce(`\u25A5 Pared Q4 creada \u2014 h=${d.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Je = [], Ct = 0;
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
      const d = t.polylines.rawVal, c = t.points.rawVal, m = d[l.polyIdx], f = c[m[l.segIdx]], h = c[m[l.segIdx + 1]];
      if (!f || !h) {
        ce("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const b = Ct && Ct > 0 ? Ct : 3;
      St();
      const v = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [f[0], f[1], f[2]], [h[0], h[1], h[2]], [h[0], h[1], h[2] + b], [f[0], f[1], f[2] + b]];
      const w = t.polylines.rawVal;
      if (t.polylines.val = [...w.slice(0, -1), ...w[w.length - 1].length > 0 ? [w[w.length - 1]] : [], [v, v + 1, v + 2, v + 3, v], []], t.areas) {
        const u = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, u];
      }
      Ct = 0, ce(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${b.toFixed(2)}m`);
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
      if (Je.push([e.x, e.y, e.z]), Je.length === 1) {
        ce("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, l] = Je, d = window.__hekatanDrawingAuxLines;
      if (d) {
        St();
        const b = d.rawVal ?? d.val ?? [];
        d.val = [...b, [i[0], i[1], i[2], l[0], l[1], l[2]]];
      }
      const c = l[0] - i[0], m = l[1] - i[1], f = l[2] - i[2], h = Math.sqrt(c * c + m * m + f * f);
      ce(`\u2713 L\xEDnea auxiliar creada \u2014 L=${h.toFixed(2)}m (cyan, no FEM)`), Je = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      di(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "chaflan") {
      if (Je.push([e.x, e.y, e.z]), Je.length === 1) {
        ce("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Je, d = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, d, c, 6);
      const m = Math.abs(l[0] - i[0]).toFixed(1), f = Math.abs(l[1] - i[1]).toFixed(1);
      ce(`\u2713 Losa con chaflanes dibujada \u2014 ${m}\xD7${f}m, r=${d}m, ${c} seg/chafl\xE1n`), Je = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    et = false, St();
    const s = e.toArray(), r = t.points.rawVal;
    let p = r.findIndex((i) => Math.abs(i[0] - s[0]) < 1e-3 && Math.abs(i[1] - s[1]) < 1e-3 && Math.abs(i[2] - s[2]) < 1e-3);
    if (p < 0 && (t.points.val = [...r, s], p = t.points.rawVal.length - 1), t.polylines && a !== "node") {
      const i = t.polylines.rawVal, l = i.length ? i[i.length - 1] : [];
      l.length && l[l.length - 1] === p ? t.polylines.val = [...i, [p]] : t.polylines.val = [...i.slice(0, -1), [...l, p]];
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
    const o = N(e);
    if (!o) return;
    L.setFromCamera(Y, o);
    const a = Ye();
    if (Oe.geometry.deleteAttribute("position"), a.length) {
      let n = a[0].point.clone();
      (e.ctrlKey || e.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const p = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = p[p.length - 1] ?? [], l = t.points.rawVal ?? [];
        if (i.length > 0) {
          const d = l[i[i.length - 1]];
          if (d) {
            const c = !!window.__hekatanOrthoMode;
            let m = zt;
            if (!m && c) {
              const f = Math.abs(n.x - d[0]), h = Math.abs(n.y - d[1]), b = Math.abs(n.z - d[2]);
              m = f >= h && f >= b ? "x" : h >= b ? "y" : "z";
            }
            m === "x" ? n.set(n.x, d[1], d[2]) : m === "y" ? n.set(d[0], n.y, d[2]) : m === "z" && n.set(d[0], d[1], n.z);
          }
        }
      }
      const s = aa(n), r = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s, { x: e.clientX, y: e.clientY });
      if (r) n.set(r.x, r.y, r.z);
      else {
        const p = window.__hekatanSnapEnabled !== false, i = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        p && i > 0 && (n.x = Math.round(n.x / i) * i, n.y = Math.round(n.y / i) * i, n.z = Math.round(n.z / i) * i);
      }
      Oe.geometry.setAttribute("position", new It(n.toArray(), 3));
    }
    P();
  }), $.addEventListener("pointermove", (e) => {
    var _a3;
    const o = N(e);
    if (!o) return;
    L.setFromCamera(Y, o);
    let a = false;
    const n = L.intersectObject(Ie), s = Ye();
    if (n.length && s.length) {
      const r = new F(...t.points.rawVal[n[0].index]), p = new F(...s[0].point), i = r.sub(p), l = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      l.transformDirection(ee.matrixWorld), Math.abs(i.dot(l)) < 1e-4 && (a = true);
    }
    Oe.visible = !a;
  });
  let ya = false, xa;
  $.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Tn) return;
    const o = N(e);
    if (!o) return;
    L.setFromCamera(Y, o);
    let a = false;
    const n = L.intersectObject(Ie), s = Ye();
    if (n.length && s.length) {
      const p = new F(...t.points.rawVal[n[0].index]), i = new F(...s[0].point), l = p.sub(i), d = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      d.transformDirection(ee.matrixWorld), Math.abs(l.dot(d)) < 1e-4 && (a = true);
    }
    if (a && Tn < 5 && (ya = true, S.enabled = false, xa = n[0].index), !ya || Tn % 2 !== 0) return;
    const r = [...t.points.rawVal];
    if (xa !== void 0) {
      let p = s[0].point;
      (e.ctrlKey || e.metaKey) && (p = new F(Math.round(p.x), Math.round(p.y), Math.round(p.z))), r[xa] = p.toArray();
    }
    t.points.val = r;
  }), $.addEventListener("pointerup", () => {
    S.enabled = true, ya = false;
  }), $.addEventListener("contextmenu", (e) => {
    var _a3;
    const o = N(e);
    if (!o) return;
    L.setFromCamera(Y, o);
    let a = false;
    const n = L.intersectObject(Ie), s = Ye();
    if (n.length && s.length) {
      const i = new F(...t.points.rawVal[n[0].index]), l = new F(...s[0].point), d = i.sub(l), c = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      c.transformDirection(ee.matrixWorld), Math.abs(d.dot(c)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const r = [...t.points.rawVal];
    if (r.splice(n[0].index, 1), t.points.val = r, !t.polylines) return;
    const p = t.polylines.rawVal.map((i) => i.filter((l) => l !== n[0].index)).map((i) => i.map((l) => l > n[0].index ? l - 1 : l)).filter((i) => i.length);
    p.push([]), t.polylines.val = p;
  });
}
function ol(t, y, g) {
  const A = Math.round(14.999999999999998), z = { position: t.position.clone(), quaternion: t.quaternion.clone() }, $ = setInterval(L, 1e3 / 30);
  let P = 0;
  function L() {
    P++;
    const Y = P / A;
    t.position.lerpVectors(z.position, y.position, Y), t.quaternion.slerpQuaternions(z.quaternion, y.quaternion, Y), g && g(), P == A && clearInterval($);
  }
}
function al(t, y, g, k) {
  const S = Ii(g, t.elements, k);
  return ue.derive(() => {
    S.visible = y.shellResults.val != "none";
  }), S;
}
const sl = 6, za = 10, il = 0.012;
function ll(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function rl(t, y, g, k) {
  if (!g && !k) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && g) {
    const A = g[t];
    if (A && A.has(y)) return A.get(y);
  }
  return null;
}
function cl(t, y, g, k) {
  const S = new ut(), A = new $s();
  A.setColorMap("rainbow");
  const z = new rn(), $ = ue.state([]);
  return ue.derive(() => {
    var _a2, _b, _c;
    y.deformedShape.val;
    const P = g.val, L = ((_a2 = t.elements) == null ? void 0 : _a2.val) ?? [], Y = ll(y.frameResults.val);
    if (S.children.forEach((T) => {
      T.geometry && T.geometry.dispose(), T.material && T.material.dispose();
    }), S.clear(), !Y || L.length === 0 || P.length === 0) {
      $.val = [];
      return;
    }
    const N = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, ee = (_c = t.deformOutputs) == null ? void 0 : _c.val, U = [], me = [];
    for (let T = 0; T < L.length; T++) {
      if (L[T].length !== 2) continue;
      const pe = rl(Y, T, N, ee);
      pe && (U.push(pe[0], pe[1]), me.push({ idx: T, vals: pe }));
    }
    if (U.length === 0) {
      $.val = [];
      return;
    }
    const Q = Math.min(...U), q = Math.max(...U);
    A.setMin(Q), A.setMax(q), $.val = U;
    const ae = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const T of P) for (let H = 0; H < 3; H++) ae[H] = Math.min(ae[H], T[H]), se[H] = Math.max(se[H], T[H]);
    const he = Math.max(se[0] - ae[0], se[1] - ae[1], se[2] - ae[2], 1) * il, ye = [], de = [], K = [];
    let Z = 0;
    for (const { idx: T, vals: H } of me) {
      const pe = L[T], fe = P[pe[0]], oe = P[pe[1]];
      if (!fe || !oe) continue;
      const W = new F(oe[0] - fe[0], oe[1] - fe[1], oe[2] - fe[2]), Me = W.length();
      if (Me < 1e-10) continue;
      W.normalize();
      const te = Math.abs(W.y) < 0.99 ? new F(0, 1, 0) : new F(1, 0, 0), Re = new F().crossVectors(W, te).normalize(), ge = new F().crossVectors(W, Re).normalize(), ve = za + 1, Se = sl;
      for (let Xe = 0; Xe < ve; Xe++) {
        const Ae = Xe / za, nt = fe[0] + W.x * Me * Ae, st = fe[1] + W.y * Me * Ae, Ue = fe[2] + W.z * Me * Ae, D = H[0] + (H[1] - H[0]) * Ae, J = A.getColor(D) ?? new rn(0, 0, 0);
        z.copy(J).convertSRGBToLinear();
        for (let re = 0; re < Se; re++) {
          const ie = re / Se * Math.PI * 2, _e = Math.cos(ie), Ce = Math.sin(ie);
          ye.push(nt + (Re.x * _e + ge.x * Ce) * he, st + (Re.y * _e + ge.y * Ce) * he, Ue + (Re.z * _e + ge.z * Ce) * he), de.push(z.r, z.g, z.b);
        }
      }
      for (let Xe = 0; Xe < za; Xe++) for (let Ae = 0; Ae < Se; Ae++) {
        const nt = (Ae + 1) % Se, st = Z + Xe * Se + Ae, Ue = Z + Xe * Se + nt, D = Z + (Xe + 1) * Se + Ae, J = Z + (Xe + 1) * Se + nt;
        K.push(st, Ue, J), K.push(st, J, D);
      }
      Z += ve * Se;
    }
    if (ye.length === 0) return;
    const R = new Le();
    R.setAttribute("position", new It(ye, 3)), R.setAttribute("color", new It(de, 3)), R.setIndex(K), R.computeVertexNormals();
    const G = new wt({ vertexColors: true, side: Lt }), X = new ct(R, G);
    X.frustumCulled = false, S.add(X);
  }), S.__colorMapValues = $, S;
}
function dl() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const ul = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, pl = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, fl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function At(t, y = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(y) : t.toFixed(y);
}
const hl = 16755200, vs = 56831, ml = 56831, wl = 56831, qo = 65382;
function yl(t) {
  const y = new ut();
  y.name = "__hekatan_hover", y.renderOrder = 99;
  const g = new to(1, 16, 16), k = new wt({ color: hl, transparent: true, opacity: 0.85, depthTest: false }), S = new ct(g, k);
  S.visible = false, S.renderOrder = 100, y.add(S);
  const A = new Le(), z = new ft({ color: vs, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), $ = new jt(A, z);
  $.visible = false, $.renderOrder = 100, y.add($);
  const P = new wt({ color: vs, transparent: true, opacity: 0.7, depthTest: false }), L = new ct(new xs(1, 1, 1, 12), P);
  L.visible = false, L.renderOrder = 100, y.add(L);
  const Y = new Le(), N = new wt({ color: ml, transparent: true, opacity: 0.45, side: Lt, depthTest: false }), ee = new ct(Y, N);
  ee.visible = false, ee.renderOrder = 100, y.add(ee);
  const U = new Le(), me = new ft({ color: wl, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), Q = new jt(U, me);
  Q.visible = false, Q.renderOrder = 100, y.add(Q);
  const q = new wt({ color: qo, transparent: true, opacity: 0.95, depthTest: false }), ae = new wt({ color: qo, transparent: true, opacity: 0.85, depthTest: false }), se = new xs(1, 1, 1, 12), xe = new wt({ color: qo, transparent: true, opacity: 0.55, side: Lt, depthTest: false }), he = new ft({ color: qo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), ye = [];
  window.__hekatanModelSelection = ye;
  const de = new ut();
  de.renderOrder = 101, y.add(de);
  let K = null;
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function R(D) {
    const J = t.derivedNodes.rawVal;
    return !J || D < 0 || D >= J.length ? null : new F(J[D][0], J[D][1], J[D][2]);
  }
  function G(D, J) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o, _p, _q, _r, _s2, _t2;
    const re = t.getActiveCamera();
    if (!re || !t.mesh) return null;
    const ie = t.rendererElm.getBoundingClientRect(), _e = D - ie.left, Ce = J - ie.top, Ye = t.derivedNodes.rawVal, Ie = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Ye || !Ie) return null;
    const Oe = /* @__PURE__ */ new Map(), Ke = (je) => {
      if (Oe.has(je)) return Oe.get(je);
      const Ee = R(je);
      if (!Ee) return Oe.set(je, null), null;
      const De = Ee.clone().project(re), We = (De.x * 0.5 + 0.5) * ie.width, Be = (-De.y * 0.5 + 0.5) * ie.height, at = { x: We, y: Be, z: De.z };
      return Oe.set(je, at), at;
    }, Pe = /* @__PURE__ */ new Set();
    for (const je of Ie) if (je) for (const Ee of je) Pe.add(Ee);
    const Ne = 8;
    let Ze = -1, lt = Ne;
    for (let je = 0; je < Ye.length; je++) {
      if (!Pe.has(je)) continue;
      const Ee = Ke(je);
      if (!Ee || Ee.z < -1 || Ee.z > 1) continue;
      const De = Ee.x - _e, We = Ee.y - Ce, Be = Math.sqrt(De * De + We * We);
      Be < lt && (lt = Be, Ze = je);
    }
    const et = dl(), gt = pl[et.dispUnit] ?? 1e3, yt = ul[et.forceUnit] ?? 1;
    if (Ze >= 0) {
      const je = Ye[Ze];
      let Ee = `Nodo ${Ze}
(${je[0].toFixed(3)}, ${je[1].toFixed(3)}, ${je[2].toFixed(3)})`;
      const De = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (De == null ? void 0 : De.deformations) {
        const We = De.deformations.get(Ze);
        if (We && (Ee += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ee += `
Ux = ${At(We[0] * gt, 3)} ${et.dispUnit}`, Ee += `
Uy = ${At(We[1] * gt, 3)} ${et.dispUnit}`, Ee += `
Uz = ${At(We[2] * gt, 3)} ${et.dispUnit}`, (Math.abs(We[3]) > 1e-9 || Math.abs(We[4]) > 1e-9 || Math.abs(We[5]) > 1e-9) && (Ee += `
Rx = ${At(We[3] * 1e3, 3)} mrad`, Ee += `
Ry = ${At(We[4] * 1e3, 3)} mrad`, Ee += `
Rz = ${At(We[5] * 1e3, 3)} mrad`)), De.reactions) {
          const Be = De.reactions.get(Ze);
          Be && (Math.abs(Be[0]) > 1e-9 || Math.abs(Be[1]) > 1e-9 || Math.abs(Be[2]) > 1e-9 || Math.abs(Be[3]) > 1e-6 || Math.abs(Be[4]) > 1e-6 || Math.abs(Be[5]) > 1e-6) && (Ee += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ee += `
Fx = ${At(Be[0] * yt)} ${et.forceUnit}`, Ee += `
Fy = ${At(Be[1] * yt)} ${et.forceUnit}`, Ee += `
Fz = ${At(Be[2] * yt)} ${et.forceUnit}`, (Math.abs(Be[3]) > 1e-6 || Math.abs(Be[4]) > 1e-6 || Math.abs(Be[5]) > 1e-6) && (Ee += `
Mx = ${At(Be[3] * yt)} ${et.forceUnit}\xB7m`, Ee += `
My = ${At(Be[4] * yt)} ${et.forceUnit}\xB7m`, Ee += `
Mz = ${At(Be[5] * yt)} ${et.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ze, info: Ee };
    }
    const pn = 5;
    let _t = -1, Te = pn, ot = "frame";
    for (let je = 0; je < Ie.length; je++) {
      const Ee = Ie[je];
      if (!(!Ee || Ee.length < 2)) {
        if (Ee.length === 2) {
          const De = Ke(Ee[0]), We = Ke(Ee[1]);
          if (!De || !We || De.z < -1 || De.z > 1 || We.z < -1 || We.z > 1) continue;
          const Be = xl(_e, Ce, De.x, De.y, We.x, We.y);
          Be < Te && (Te = Be, _t = je, ot = "frame");
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
          if (gl(_e, Ce, De)) {
            const at = De.reduce((it, pt) => it + pt.z, 0) / De.length * 1e-3;
            at < Te && (Te = at, _t = je, ot = "shell");
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
          const Be = Math.min(...De.map((tt) => tt.x)), at = Math.max(...De.map((tt) => tt.x)), it = Math.min(...De.map((tt) => tt.y)), pt = Math.max(...De.map((tt) => tt.y));
          if (_e >= Be && _e <= at && Ce >= it && Ce <= pt) {
            const rt = De.reduce((Ft, dt) => Ft + dt.z, 0) / De.length * 1e-3;
            rt < Te && (Te = rt, _t = je, ot = "solid");
          }
        }
      }
    }
    if (_t >= 0) {
      const je = Ie[_t];
      let De = `${ot === "frame" ? "Frame" : ot === "shell" ? "Shell" : "Solid"} ${_t}`;
      const We = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Be = (_g = (_f = We == null ? void 0 : We.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, _t);
      if (Be) {
        Be.name && (De += `
  \u{1F4CB} ${Be.name}`), Be.shape && (De += `
  Shape: ${Be.shape}`);
        const at = /concrete|hormig|rect.*sólida/i.test(Be.shape || ""), it = at ? 100 : 1e3, pt = at ? "cm" : "mm", tt = (Ft) => {
          const dt = Ft * it;
          return Math.abs(dt - Math.round(dt)) < 0.05 ? `${Math.round(dt)}` : `${dt.toFixed(1)}`;
        }, rt = [];
        if (Be.D != null && rt.push(`D=${tt(Be.D)}`), Be.B != null && rt.push(`B=${tt(Be.B)}`), Be.TF != null && rt.push(`TF=${tt(Be.TF)}`), Be.TW != null && rt.push(`TW=${tt(Be.TW)}`), Be.t != null && rt.push(`t=${tt(Be.t)}`), rt.length && (De += `
  Dim: ${rt.join(" ")} ${pt}`), Be.material) {
          let Ft = Be.material;
          Be.fillMaterial && (Ft += ` + FILL "${Be.fillMaterial}"`), De += `
  Mat: ${Ft}`;
        }
      } else {
        const at = (_i2 = (_h = We == null ? void 0 : We.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, _t), it = (_k = (_j = We == null ? void 0 : We.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, _t);
        at ? (De += `
  ${at}`, it && !at.includes(it) && (De += `  (${it})`)) : it && (De += `
  Material: ${it}`);
      }
      if (De += `
nodos: [${je.join(", ")}]`, ot === "shell" && ((_l2 = t.mesh) == null ? void 0 : _l2.analyzeOutputs)) {
        const at = t.mesh.analyzeOutputs.rawVal, it = fl[et.stressUnit] ?? 1, pt = [["bendingXX", "Mxx", yt, `${et.forceUnit}\xB7m/m`], ["bendingYY", "Myy", yt, `${et.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", yt, `${et.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", yt, `${et.forceUnit}/m`], ["membraneYY", "Nyy", yt, `${et.forceUnit}/m`], ["membraneXY", "Nxy", yt, `${et.forceUnit}/m`], ["shearX", "Qx", yt, `${et.forceUnit}/m`], ["shearY", "Qy", yt, `${et.forceUnit}/m`], ["vonMises", "\u03C3VM", it, et.stressUnit], ["pressure", "p", it, et.stressUnit]], tt = [];
        for (const [rt, Ft, dt, Kt] of pt) {
          const kt = at == null ? void 0 : at[rt];
          if (kt && kt instanceof Map) {
            const Yt = kt.get(_t);
            if (Yt != null) {
              if (typeof Yt == "number") tt.push(`${Ft} = ${At(Yt * dt, 3)} ${Kt}`);
              else if (Array.isArray(Yt)) {
                let en = Yt[0];
                for (const Pt of Yt) Math.abs(Pt) > Math.abs(en) && (en = Pt);
                tt.push(`${Ft} = ${At(en * dt, 3)} ${Kt}`);
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
        const at = t.mesh.deformOutputs.rawVal, it = t.mesh.elementInputs.rawVal, pt = at == null ? void 0 : at.deformations;
        if (pt && je.length === 2) {
          const tt = pt.get(je[0]), rt = pt.get(je[1]), Ft = ((_n = t.mesh.nodes) == null ? void 0 : _n.rawVal) ?? Ye, dt = Ft[je[0]], Kt = Ft[je[1]];
          if (tt && rt && dt && Kt) {
            const kt = Kt[0] - dt[0], Yt = Kt[1] - dt[1], en = Kt[2] - dt[2], Pt = Math.sqrt(kt * kt + Yt * Yt + en * en);
            if (Pt > 1e-9) {
              const bo = kt / Pt, Xt = Yt / Pt, Vn = en / Pt, bn = (rt[0] - tt[0]) * bo + (rt[1] - tt[1]) * Xt + (rt[2] - tt[2]) * Vn, fn = ((_o = it.elasticities) == null ? void 0 : _o.get(_t)) ?? 0, Ln = ((_p = it.areas) == null ? void 0 : _p.get(_t)) ?? 0, Un = ((_q = it.momentsOfInertiaY) == null ? void 0 : _q.get(_t)) ?? 0, jo = ((_r = it.momentsOfInertiaZ) == null ? void 0 : _r.get(_t)) ?? 0, Ut = ((_s2 = it.torsionalConstants) == null ? void 0 : _s2.get(_t)) ?? 0, no = ((_t2 = it.shearModuli) == null ? void 0 : _t2.get(_t)) ?? fn / 2.6, In = fn * Ln * (bn / Pt), Zn = (rt[3] - tt[3]) * bo + (rt[4] - tt[4]) * Xt + (rt[5] - tt[5]) * Vn, Rn = no * Ut * (Zn / Pt), hn = rt[4] - tt[4], oo = rt[5] - tt[5], Zt = fn * Un * hn / Pt, Wt = fn * jo * oo / Pt;
              De += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, De += `
L = ${At(Pt, 3)} m`, De += `
\u0394L = ${At(bn * gt, 3)} ${et.dispUnit}`, De += `
\u03B5 = ${At(bn / Pt, 6)}`, Math.abs(In) > 1e-6 && (De += `
N \u2248 ${At(In * yt)} ${et.forceUnit}`), Math.abs(Rn) > 1e-6 && (De += `
T \u2248 ${At(Rn * yt)} ${et.forceUnit}\xB7m`), Math.abs(Zt) > 1e-6 && (De += `
My \u2248 ${At(Zt * yt)} ${et.forceUnit}\xB7m`), Math.abs(Wt) > 1e-6 && (De += `
Mz \u2248 ${At(Wt * yt)} ${et.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: ot, idx: _t, info: De };
    }
    return null;
  }
  function X(D, J, re) {
    var _a2, _b, _c;
    if (S.visible = false, $.visible = false, L.visible = false, ee.visible = false, Q.visible = false, !D || !t.mesh) {
      Z.style.display = "none", t.render();
      return;
    }
    const ie = (_a2 = t.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (D.type === "node") {
      const Ie = R(D.idx);
      if (Ie) {
        const Oe = t.derivedNodes.rawVal ?? [];
        let Ke = 1;
        if (Oe.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const et of Oe) for (let gt = 0; gt < 3; gt++) et[gt] < Ze[gt] && (Ze[gt] = et[gt]), et[gt] > lt[gt] && (lt[gt] = et[gt]);
          Ke = Math.max(lt[0] - Ze[0], lt[1] - Ze[1], lt[2] - Ze[2], 0.1);
        }
        const Pe = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Ne = 0.021 * Ke * Pe;
        S.position.copy(Ie), S.scale.setScalar(Ne), S.visible = true;
      }
    } else if (D.type === "frame" && ie) {
      const Ie = ie[D.idx], Oe = R(Ie[0]), Ke = R(Ie[1]);
      if (Oe && Ke) {
        const Pe = Oe.clone().add(Ke).multiplyScalar(0.5), Ne = Ke.clone().sub(Oe), Ze = Ne.length(), lt = Math.max(1e-4, 3.5 * Xe(Pe));
        L.position.copy(Pe);
        const et = new F(0, 1, 0), gt = et.clone().cross(Ne).normalize(), yt = et.angleTo(Ne);
        L.quaternion.setFromAxisAngle(gt, yt), L.scale.set(lt, Ze, lt), L.visible = true;
      }
    } else if (D.type === "shell" && ie) {
      const Ie = ie[D.idx], Oe = [], Ke = [];
      for (const Pe of Ie) {
        const Ne = R(Pe);
        if (!Ne) return;
        Oe.push(Ne.x, Ne.y, Ne.z);
      }
      Ie.length === 4 ? Ke.push(0, 1, 2, 0, 2, 3) : Ie.length === 3 && Ke.push(0, 1, 2), Y.setAttribute("position", new It(Oe, 3)), Y.setIndex(Ke), Y.computeVertexNormals(), ee.visible = true;
    } else if (D.type === "solid" && ie) {
      const Ie = ie[D.idx], Oe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ke = [];
      for (const [Pe, Ne] of Oe) {
        const Ze = R(Ie[Pe]), lt = R(Ie[Ne]);
        Ze && lt && Ke.push(Ze.x, Ze.y, Ze.z, lt.x, lt.y, lt.z);
      }
      U.setAttribute("position", new It(Ke, 3)), Q.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", t.render();
      return;
    }
    Z.textContent = D.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const Ce = t.rendererElm.getBoundingClientRect(), Ye = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Ce;
    Z.style.left = `${J - Ye.left}px`, Z.style.top = `${re - Ye.top}px`, t.render();
  }
  let T = "", H = 0, pe = 0;
  const fe = window.__hekatanHoverDebug ?? false, oe = (D) => {
    H && cancelAnimationFrame(H), H = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const J = G(D.clientX, D.clientY);
      if (fe && pe < 5) {
        const ie = t.derivedNodes.rawVal, _e = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${D.clientX}, ${D.clientY}) nodes=${(ie == null ? void 0 : ie.length) ?? 0} elems=${(_e == null ? void 0 : _e.length) ?? 0} hover=`, J), pe++;
      }
      const re = J ? `${J.type}:${J.idx}` : "";
      if (re !== T) T = re, X(J, D.clientX, D.clientY);
      else if (J) {
        const ie = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        Z.style.left = `${D.clientX - ie.left}px`, Z.style.top = `${D.clientY - ie.top}px`;
      }
    });
  };
  let W = null;
  const Me = () => {
    T = "", S.visible = false, $.visible = false, L.visible = false, ee.visible = false, Q.visible = false, Z.style.display = "none", t.render();
  }, te = (D) => {
    const J = t.rendererElm.getBoundingClientRect(), re = D.clientX - J.left, ie = D.clientY - J.top;
    (re < -2 || ie < -2 || re > J.width + 2 || ie > J.height + 2) && (W && clearTimeout(W), W = window.setTimeout(Me, 200));
  }, Re = () => {
    W && (clearTimeout(W), W = null);
  };
  t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", te), t.rendererElm.addEventListener("pointerenter", Re);
  function ge() {
    var _a2, _b, _c;
    const D = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return D === "select" || D === "none" || !D;
  }
  let ve = null;
  t.rendererElm.addEventListener("pointerdown", (D) => {
    D.button === 0 && (ve = { x: D.clientX, y: D.clientY });
  }), t.rendererElm.addEventListener("pointerup", (D) => {
    if (D.button !== 0 || !ve) return;
    const J = D.clientX - ve.x, re = D.clientY - ve.y;
    if (ve = null, J * J + re * re > 9 || !ge()) return;
    const ie = G(D.clientX, D.clientY);
    ie ? (st({ type: ie.type, idx: ie.idx }, D.shiftKey), nt()) : Ue();
  }), window.addEventListener("keydown", (D) => {
    if (D.key !== "Escape" || !ye.length) return;
    const J = document.activeElement, re = !!J && (J.id === "hk3-cmd-input" || J.id === "hk-dyn-input") && J.value === "";
    J && (J.tagName === "INPUT" || J.tagName === "TEXTAREA" || J.isContentEditable) && !re || Ue();
  }, { capture: true });
  function Se() {
    for (const D of de.children.slice()) {
      de.remove(D);
      const J = D.geometry;
      J && J !== g && J !== se && J.dispose();
    }
  }
  const Xe = (D) => {
    var _a2;
    const J = t.getActiveCamera(), re = ((_a2 = t.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return J.isOrthographicCamera ? (J.top - J.bottom) / (J.zoom || 1) / re : 2 * J.position.distanceTo(D) * Math.tan((J.fov || 50) * Math.PI / 180 / 2) / re;
  };
  function Ae(D, J) {
    var _a2, _b;
    const re = (_b = (_a2 = t.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (D.type === "node") {
      const ie = R(D.idx);
      if (!ie) return;
      const _e = new ct(g, q);
      _e.position.copy(ie), _e.scale.setScalar(Math.max(1e-4, 7 * Xe(ie))), _e.renderOrder = 101, de.add(_e);
    } else if (D.type === "frame" && re) {
      const ie = re[D.idx], _e = R(ie[0]), Ce = R(ie[1]);
      if (!_e || !Ce) return;
      const Ye = _e.clone().add(Ce).multiplyScalar(0.5), Ie = Ce.clone().sub(_e), Oe = Ie.length(), Ke = Math.max(1e-4, 4 * Xe(Ye)), Pe = new ct(se, ae);
      Pe.position.copy(Ye);
      const Ne = new F(0, 1, 0);
      Pe.quaternion.setFromAxisAngle(Ne.clone().cross(Ie).normalize(), Ne.angleTo(Ie)), Pe.scale.set(Ke, Oe, Ke), Pe.renderOrder = 101, de.add(Pe);
    } else if (D.type === "shell" && re) {
      const ie = re[D.idx], _e = [], Ce = [];
      for (const Oe of ie) {
        const Ke = R(Oe);
        if (!Ke) return;
        _e.push(Ke.x, Ke.y, Ke.z);
      }
      ie.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : ie.length === 3 && Ce.push(0, 1, 2);
      const Ye = new Le();
      Ye.setAttribute("position", new It(_e, 3)), Ye.setIndex(Ce), Ye.computeVertexNormals();
      const Ie = new ct(Ye, xe);
      Ie.renderOrder = 101, de.add(Ie);
    } else if (D.type === "solid" && re) {
      const ie = re[D.idx], _e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Oe, Ke] of _e) {
        const Pe = R(ie[Oe]), Ne = R(ie[Ke]);
        Pe && Ne && Ce.push(Pe.x, Pe.y, Pe.z, Ne.x, Ne.y, Ne.z);
      }
      const Ye = new Le();
      Ye.setAttribute("position", new It(Ce, 3));
      const Ie = new jt(Ye, he);
      Ie.renderOrder = 101, de.add(Ie);
    }
  }
  function nt() {
    if (Se(), !ye.length || !t.mesh) {
      t.render();
      return;
    }
    const D = t.derivedNodes.rawVal ?? [];
    if (D.length >= 2) {
      const J = [1 / 0, 1 / 0, 1 / 0], re = [-1 / 0, -1 / 0, -1 / 0];
      for (const ie of D) for (let _e = 0; _e < 3; _e++) ie[_e] < J[_e] && (J[_e] = ie[_e]), ie[_e] > re[_e] && (re[_e] = ie[_e]);
      Math.max(re[0] - J[0], re[1] - J[1], re[2] - J[2], 0.1);
    }
    for (const J of ye) Ae(J);
    t.render();
  }
  function st(D, J) {
    const re = ye.findIndex((ie) => ie.type === D.type && ie.idx === D.idx);
    re >= 0 ? ye.splice(re, 1) : J || ye.push(D), K = ye.length ? ye[ye.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: K } }));
  }
  function Ue() {
    ye.length = 0, K = null, nt();
  }
  return ue.derive(() => {
    t.derivedNodes.val, ye.length && nt();
  }), y;
}
function xl(t, y, g, k, S, A) {
  const z = S - g, $ = A - k, P = z * z + $ * $;
  if (P < 1e-9) {
    const me = t - g, Q = y - k;
    return Math.sqrt(me * me + Q * Q);
  }
  let L = ((t - g) * z + (y - k) * $) / P;
  L = Math.max(0, Math.min(1, L));
  const Y = g + L * z, N = k + L * $, ee = t - Y, U = y - N;
  return Math.sqrt(ee * ee + U * U);
}
function gl(t, y, g) {
  let k = false;
  for (let S = 0, A = g.length - 1; S < g.length; A = S++) {
    const z = g[S].x, $ = g[S].y, P = g[A].x, L = g[A].y;
    $ > y != L > y && t < (P - z) * (y - $) / (L - $ + 1e-12) + z && (k = !k);
  }
  return k;
}
const ln = (t) => {
  if (!isFinite(t) || t === 0) return "0";
  const y = Math.abs(t);
  return y >= 1e-3 && y < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
};
function _s(t, y) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], S = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[y];
  if (!S || S.length !== 2) throw new Error(`El elemento ${y} no es una barra (2 nudos).`);
  const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, z = (te) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = A[te]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, y)) ?? 0;
  }, $ = g[S[0]], P = g[S[1]], L = z("elasticities"), Y = z("shearModuli"), N = z("areas"), ee = z("momentsOfInertiaZ"), U = z("momentsOfInertiaY"), me = z("torsionalConstants");
  let Q = z("shearAreasY"), q = z("shearAreasZ");
  const ae = Math.hypot(P[0] - $[0], P[1] - $[1], P[2] - $[2]), se = Q < -1e-15, xe = q < -1e-15;
  !se && Q < 1e-15 && N > 1e-15 && Y > 1e-15 && (Q = 5 / 6 * N), !xe && q < 1e-15 && N > 1e-15 && Y > 1e-15 && (q = 5 / 6 * N);
  const he = !xe && q > 0 && Y > 0 ? 12 * L * ee / (Y * q * ae * ae) : 0, ye = !se && Q > 0 && Y > 0 ? 12 * L * U / (Y * Q * ae * ae) : 0, de = L * N / ae, K = Y * me / ae, Z = 12 * L * ee / ae ** 3 / (1 + he), R = 6 * L * ee / ae ** 2 / (1 + he), G = 4 * L * ee / ae * (1 + he / 4) / (1 + he), X = 2 * L * ee / ae * (1 - he / 2) / (1 + he), T = 12 * L * U / ae ** 3 / (1 + ye), H = 6 * L * U / ae ** 2 / (1 + ye), pe = 4 * L * U / ae * (1 + ye / 4) / (1 + ye), fe = 2 * L * U / ae * (1 - ye / 2) / (1 + ye);
  let oe = [[de, 0, 0, 0, 0, 0, -de, 0, 0, 0, 0, 0], [0, Z, 0, 0, 0, R, 0, -Z, 0, 0, 0, R], [0, 0, T, 0, -H, 0, 0, 0, -T, 0, -H, 0], [0, 0, 0, K, 0, 0, 0, 0, 0, -K, 0, 0], [0, 0, -H, 0, pe, 0, 0, 0, H, 0, fe, 0], [0, R, 0, 0, 0, G, 0, -R, 0, 0, 0, X], [-de, 0, 0, 0, 0, 0, de, 0, 0, 0, 0, 0], [0, -Z, 0, 0, 0, -R, 0, Z, 0, 0, 0, -R], [0, 0, -T, 0, H, 0, 0, 0, T, 0, H, 0], [0, 0, 0, -K, 0, 0, 0, 0, 0, K, 0, 0], [0, 0, -H, 0, fe, 0, 0, 0, H, 0, pe, 0], [0, R, 0, 0, 0, X, 0, -R, 0, 0, 0, G]];
  const W = (_e = (_d = A.partialFixitySprings) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, y);
  if (W) for (let te = 0; te < Math.min(12, W.length); te++) W[te] > 1e-12 && (oe[te][te] += W[te]);
  const Me = (_g = (_f = A.momentReleases) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, y);
  if (Me && Me.some(Boolean)) {
    const te = Me.length >= 12 ? Me.slice(0, 12).map((Ae, nt) => Ae ? nt : -1).filter((Ae) => Ae >= 0) : Me.slice(0, 6).map((Ae, nt) => Ae ? [3, 4, 5, 9, 10, 11][nt] : -1).filter((Ae) => Ae >= 0), Re = [...Array(12).keys()].filter((Ae) => !te.includes(Ae)), ge = te.length, ve = te.map((Ae, nt) => [...te.map((st) => oe[Ae][st]), ...te.map((st, Ue) => nt === Ue ? 1 : 0)]);
    for (let Ae = 0; Ae < ge; Ae++) {
      let nt = Ae;
      for (let Ue = Ae + 1; Ue < ge; Ue++) Math.abs(ve[Ue][Ae]) > Math.abs(ve[nt][Ae]) && (nt = Ue);
      [ve[Ae], ve[nt]] = [ve[nt], ve[Ae]];
      const st = ve[Ae][Ae];
      for (let Ue = 0; Ue < 2 * ge; Ue++) ve[Ae][Ue] /= st;
      for (let Ue = 0; Ue < ge; Ue++) if (Ue !== Ae) {
        const D = ve[Ue][Ae];
        for (let J = 0; J < 2 * ge; J++) ve[Ue][J] -= D * ve[Ae][J];
      }
    }
    const Se = ve.map((Ae) => Ae.slice(ge)), Xe = Array.from({ length: 12 }, () => Array(12).fill(0));
    for (const Ae of Re) for (const nt of Re) {
      let st = 0;
      for (let Ue = 0; Ue < ge; Ue++) for (let D = 0; D < ge; D++) st += oe[Ae][te[Ue]] * Se[Ue][D] * oe[te[D]][nt];
      Xe[Ae][nt] = oe[Ae][nt] - st;
    }
    oe = Xe;
  }
  return { K: oe, L: ae, phiZ: he, phiY: ye };
}
function ks(t, y) {
  var _a2, _b, _c, _d, _e, _f, _g;
  const g = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], S = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[y];
  if (!S || S.length !== 2) throw new Error(`El elemento ${y} no es una barra (2 nudos).`);
  const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, z = (me, Q = 0) => {
    var _a3, _b2;
    return ((_b2 = (_a3 = A[me]) == null ? void 0 : _a3.get) == null ? void 0 : _b2.call(_a3, y)) ?? Q;
  }, $ = g[S[0]], P = g[S[1]], L = (_e = (_d = A.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, y), Y = (_g = (_f = A.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, y), N = z("localAngles", 0), ee = [], U = (me = "") => ee.push(me);
  if (U("% ============================================================"), U(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${y + 1} (indice ${y} del motor)`), U("%  Generado por Hekatan Struct con los datos que recibe el motor."), U("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), U("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), U("% ============================================================"), U(), U("% --- Datos de la barra -------------------------------------------------"), U(`xi = [${$.map(ln).join(" ")}];      % nudo i (${S[0]})`), U(`xj = [${P.map(ln).join(" ")}];      % nudo j (${S[1]})`), U(`E  = ${ln(z("elasticities"))};      % modulo de elasticidad`), U(`G  = ${ln(z("shearModuli"))};      % modulo de cortante`), U(`A  = ${ln(z("areas"))};      % area`), U(`Iz = ${ln(z("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), U(`Iy = ${ln(z("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), U(`J  = ${ln(z("torsionalConstants"))};      % constante de torsion`), U(`AsY = ${ln(z("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), U(`AsZ = ${ln(z("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), N && U(`% ang = ${ln(N)} grados: gira la seccion en T, NO cambia esta matriz local.`), U(), U("L = sqrt(sum((xj - xi).^2));"), U(), U("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), U("bernY = AsY < 0;   bernZ = AsZ < 0;"), U("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), U("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), U("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), U("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), U(), U("EA_L = E*A/L;          % axial"), U("GJ_L = G*J/L;          % torsion"), U("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), U("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), U("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), U("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), U(), U("% --- Matriz local (misma disposicion que el C++) ----------------------"), U("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), U("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), U("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), U("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), U("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), U("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), U("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), U("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), U("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), U("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), U("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), U("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), Y && Y.some((me) => me > 1e-12) && (U(), U("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), U(`kres = [${Y.slice(0, 12).map(ln).join(" ")}];`), U("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), L && L.some(Boolean)) {
    const me = L.length >= 12 ? L.slice(0, 12).map((Q, q) => Q ? q + 1 : 0).filter(Boolean) : L.slice(0, 6).map((Q, q) => Q ? [4, 5, 6, 10, 11, 12][q] : 0).filter(Boolean);
    U(), U("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), U(`f = [${me.join(" ")}];              % GDL liberados`), U("r = setdiff(1:12, f);                % GDL que quedan"), U("Kc = zeros(12);"), U("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), U("K = Kc;");
  }
  return U(), U("% --- Resultado ---------------------------------------------------------"), U(`fprintf('Barra ${y + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), U("disp('K local (12x12):');"), U("disp(K);"), { nombre: `K_local_barra_${y + 1}.m`, texto: ee.join(`
`) + `
` };
}
const bl = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Ml = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Fn = 1e-3;
function mo(t, y) {
  return y === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : y === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function vl(t, y) {
  const g = Math.abs(y[0] - t[0]);
  return Math.abs(y[1] - t[1]) < Fn ? { plano: "XZ", en: t[1] } : g < Fn ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function _l(t, y) {
  var _a2, _b;
  let g = null, k = { plano: "XZ", en: 0 };
  const S = () => {
    var _a3, _b2;
    const K = ((_a3 = y == null ? void 0 : y.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.val);
    return !K || K === "none" ? null : String(K).replace(/^contour:/, "");
  }, A = (K) => {
    var _a3, _b2;
    const Z = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], R = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Set();
    for (const X of R) {
      if (X.length !== 2) continue;
      const T = Z[X[0]], H = Z[X[1]];
      if (!T || !H) continue;
      const pe = mo(T, K), fe = mo(H, K);
      Math.abs(pe.fuera - fe.fuera) < Fn && G.add(Math.round(pe.fuera * 1e3) / 1e3);
    }
    return [...G].sort((X, T) => X - T);
  };
  function z(K) {
    var _a3, _b2;
    if (K == null ? void 0 : K.plano) k = { plano: K.plano, en: K.en ?? A(K.plano)[0] ?? 0 };
    else {
      const R = [...window.__hekatanModelSelection ?? []].reverse().find((T) => T.type === "frame"), G = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], X = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      R && X[R.idx] && G[X[R.idx][0]] && G[X[R.idx][1]] ? k = vl(G[X[R.idx][0]], G[X[R.idx][1]]) : k = { plano: "XZ", en: A("XZ")[0] ?? 0 };
    }
    g || $(), g.hidden = false, P();
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
      k = { plano: K.value, en: A(K.value)[0] ?? 0 }, P();
    }), Z.addEventListener("change", () => {
      k.en = Number(Z.value), P();
    });
    const R = (T) => {
      const H = A(k.plano), pe = H.findIndex((oe) => Math.abs(oe - k.en) < Fn), fe = Math.max(0, Math.min(H.length - 1, (pe < 0 ? 0 : pe) + T));
      H.length && (k.en = H[fe], P());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => R(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => R(1));
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
      g && !g.hidden && P();
    }).observe(g);
  }
  function P() {
    var _a3, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const K = new Set(N && !N.hidden && ee >= 0 ? me(ee) : []), Z = g.querySelector(".hk-d2-svg"), R = g.querySelector(".hk-d2-tit"), G = g.querySelector(".hk-d2-pie"), X = g.querySelector(".hk-d2-plano"), T = g.querySelector(".hk-d2-en");
    X.value = k.plano;
    const H = A(k.plano), pe = k.plano === "XZ" ? "y" : k.plano === "YZ" ? "x" : "z", fe = k.plano === "XY" ? "Planta" : "P\xF3rtico";
    T.innerHTML = H.map((Te, ot) => `<option value="${Te}" ${Math.abs(Te - k.en) < Fn ? "selected" : ""}>${fe} ${ot + 1} \xB7 ${pe} = ${Te.toFixed(2)} m</option>`).join("");
    const oe = S(), W = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], Me = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], te = oe ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[oe] : null;
    Z.innerHTML = "";
    const Re = Z.clientWidth || 880, ge = Z.clientHeight || 480, ve = [];
    if (Me.forEach((Te, ot) => {
      if (Te.length !== 2) return;
      const je = W[Te[0]], Ee = W[Te[1]];
      if (!je || !Ee) return;
      const De = mo(je, k.plano), We = mo(Ee, k.plano);
      Math.abs(De.fuera - k.en) < Fn && Math.abs(We.fuera - k.en) < Fn && ve.push({ i: ot, a: De, b: We });
    }), !ve.length) {
      G.textContent = "No hay barras en este plano.", R.textContent = "";
      return;
    }
    let Se = 1 / 0, Xe = -1 / 0, Ae = 1 / 0, nt = -1 / 0;
    for (const Te of ve) for (const ot of [Te.a, Te.b]) Se = Math.min(Se, ot.u), Xe = Math.max(Xe, ot.u), Ae = Math.min(Ae, ot.v), nt = Math.max(nt, ot.v);
    const st = Xe - Se || 1, Ue = nt - Ae || 1, D = 0.12 * Math.max(st, Ue), J = 46, re = Math.min((Re - 2 * J) / (st + 2 * D), (ge - 2 * J) / (Ue + 2 * D)), ie = (Re - st * re) / 2, _e = (ge - Ue * re) / 2, Ce = (Te) => ie + (Te - Se) * re, Ye = (Te) => ge - (_e + (Te - Ae) * re), Ie = "http://www.w3.org/2000/svg", Oe = (Te, ot, je) => {
      const Ee = document.createElementNS(Ie, Te);
      for (const De in ot) Ee.setAttribute(De, String(ot[De]));
      return je != null && (Ee.textContent = je), Z.appendChild(Ee), Ee;
    }, Ke = /* @__PURE__ */ new Map();
    for (const Te of ve) {
      const ot = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Te.i)) ?? 0, je = mo(Ts(oe ?? "normals", Rs(W[Me[Te.i][0]], W[Me[Te.i][1]], ot)), k.plano), Ee = Math.hypot(je.u, je.v);
      Ke.set(Te.i, Ee > 0.3 ? [je.u / Ee, -je.v / Ee] : null);
    }
    const Pe = ve.filter((Te) => !Ke.get(Te.i)).length;
    let Ne = 0;
    if (te) for (const Te of ve) {
      if (!Ke.get(Te.i)) continue;
      const ot = te instanceof Map ? te.get(Te.i) : te[Te.i];
      ot && (Ne = Math.max(Ne, Math.abs(ot[0] ?? 0), Math.abs(ot[1] ?? 0)));
    }
    const Ze = 0.12 * Math.max(st, Ue) * re, lt = Ne > 0 ? Ze / Ne : 0, et = oe === "bendingsY" || oe === "bendingsZ", gt = (Te) => Math.abs(Te) >= 100 ? Te.toFixed(1) : Math.abs(Te) >= 10 ? Te.toFixed(2) : Te.toFixed(3), yt = [];
    for (const Te of ve) {
      const ot = Ce(Te.a.u), je = Ye(Te.a.v), Ee = Ce(Te.b.u), De = Ye(Te.b.v), We = Ke.get(Te.i), [Be, at] = We ?? [0, 0], it = te && We ? te instanceof Map ? te.get(Te.i) : te[Te.i] : null, [pt, tt] = it ? Aa(oe, it) : [0, 0];
      if (it && lt > 0) {
        const Kt = [ot + Be * pt * lt * 1, je + at * pt * lt * 1], kt = [Ee + Be * tt * lt * 1, De + at * tt * lt * 1], Pt = pt + tt >= 0 ? "#3fa7d6" : "#d9534f";
        Oe("polygon", { points: `${ot},${je} ${Kt[0]},${Kt[1]} ${kt[0]},${kt[1]} ${Ee},${De}`, fill: Pt, "fill-opacity": 0.38, stroke: Pt, "stroke-width": 1.2 }), yt.push({ x: Kt[0] + Be * 12, y: Kt[1] + at * 12, t: gt(pt), peso: Math.abs(pt) }), yt.push({ x: kt[0] + Be * 12, y: kt[1] + at * 12, t: gt(tt), peso: Math.abs(tt) });
      }
      Oe("line", { x1: ot, y1: je, x2: Ee, y2: De, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), K.has(Te.i) && Oe("line", { x1: ot, y1: je, x2: Ee, y2: De, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const rt = Oe("line", { x1: ot, y1: je, x2: Ee, y2: De, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      rt.addEventListener("click", () => Q(Te.i));
      const Ft = document.createElementNS(Ie, "title");
      Ft.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", rt.appendChild(Ft);
    }
    for (const Te of ve) for (const ot of [Te.a, Te.b]) k.plano !== "XY" && Math.abs(ot.v - Ae) < Fn && Oe("rect", { x: Ce(ot.u) - 6, y: Ye(ot.v), width: 12, height: 7, fill: "#b03a3a" });
    const pn = [];
    yt.sort((Te, ot) => ot.peso - Te.peso);
    for (const Te of yt) Te.peso < 0.02 * Ne || pn.some((ot) => Math.hypot(ot.x - Te.x, ot.y - Te.y) < 34) || (pn.push(Te), Oe("text", { x: Te.x, y: Te.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Te.t));
    const _t = oe ? bl[oe] ?? oe : "sin resultado";
    R.textContent = `${_t} \xB7 ${k.plano === "XY" ? "planta" : "alzado"} ${k.plano} en ${pe} = ${k.en.toFixed(2)} m`, G.textContent = oe ? `${ve.length} barras en el plano \xB7 m\xE1ximo ${gt(Ne)} ${Ml[oe] ?? ""}` + (et ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (Pe ? ` \xB7 ${Pe} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const L = () => {
    try {
      P();
    } catch {
    }
  };
  (y == null ? void 0 : y.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    y.frameResults.val, L();
  }));
  let Y = null;
  setInterval(() => {
    var _a3, _b2;
    const K = (_a3 = t.analyzeOutputs) == null ? void 0 : _a3.rawVal, Z = (_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.rawVal, R = [K, Z];
    if (!(Y && Y[0] === K && Y[1] === Z)) {
      Y = R, L();
      try {
        ae();
      } catch {
      }
    }
  }, 400);
  let N = null, ee = -1, U = "12";
  function me(K) {
    var _a3, _b2;
    const Z = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], R = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Map();
    R.forEach((pe, fe) => {
      if (pe.length === 2) for (const oe of pe) G.has(oe) || G.set(oe, []), G.get(oe).push(fe);
    });
    const X = (pe) => {
      const fe = Z[R[pe][0]], oe = Z[R[pe][1]], W = [oe[0] - fe[0], oe[1] - fe[1], oe[2] - fe[2]], Me = Math.hypot(W[0], W[1], W[2]) || 1;
      return W.map((te) => te / Me);
    }, T = (pe, fe) => {
      const oe = X(pe), W = X(fe);
      return Math.abs(oe[0] * W[0] + oe[1] * W[1] + oe[2] * W[2]) > 0.9999;
    }, H = [K];
    for (const pe of [0, 1]) {
      let fe = K, oe = R[K][pe];
      for (let W = 0; W < 500; W++) {
        const Me = (G.get(oe) ?? []).filter((Re) => Re !== fe);
        if (Me.length !== 1 || !T(fe, Me[0])) break;
        const te = Me[0];
        pe === 0 ? H.unshift(te) : H.push(te), oe = R[te][0] === oe ? R[te][1] : R[te][0], fe = te;
      }
    }
    return H;
  }
  function Q(K) {
    if (K == null) {
      const R = [...window.__hekatanModelSelection ?? []].reverse().find((G) => G.type === "frame");
      if (!R) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      K = R.idx;
    }
    ee = K, N || (N = document.createElement("div"), N.id = "hk-diagrama-barra", N.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), N.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-k" title="Descarga un script MATLAB (Hekatan Lab / Octave) con la matriz de rigidez local 12\xD712 de esta barra" style="background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px;white-space:nowrap">\u{1F4C4} K local .m</button><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(N), N.querySelector(".hk-b-x").addEventListener("click", () => {
      N.hidden = true, q(), P();
    }), N.querySelector(".hk-b-k").addEventListener("click", () => {
      ee >= 0 && se(ee);
    }), N.querySelector(".hk-b-pl").addEventListener("change", (Z) => {
      U = Z.target.value, ae();
    })), N.hidden = false, q(), ae(), P();
  }
  function q() {
    if (!g || !N) return;
    const K = window.innerWidth, Z = Math.min(560, Math.round(K * 0.4));
    N.style.width = Z + "px", !N.hidden && !g.hidden ? (g.style.transform = "none", g.style.left = "12px", g.style.width = K - Z - 36 + "px", N.style.top = g.getBoundingClientRect().top + "px") : g.hidden || (g.style.left = "50%", g.style.transform = "translateX(-50%)", g.style.width = "min(900px,92vw)");
  }
  function ae() {
    var _a3, _b2, _c;
    if (!N || N.hidden || ee < 0) return;
    const K = ((_a3 = t.nodes) == null ? void 0 : _a3.rawVal) ?? [], Z = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], R = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!Z[ee]) return;
    const G = me(ee), X = [];
    let T = 0, H = -1;
    G.forEach((Xe, Ae) => {
      const [nt, st] = Z[Xe], Ue = Ae === 0 ? G.length > 1 && Z[G[1]].includes(nt) : nt !== H, D = Ue ? st : nt, J = Ue ? nt : st, re = Math.hypot(K[J][0] - K[D][0], K[J][1] - K[D][1], K[J][2] - K[D][2]);
      X.push({ x: T, e: Xe, fin: Ue ? 1 : 0 }), T += re, X.push({ x: T, e: Xe, fin: Ue ? 0 : 1 }), H = J;
    });
    const pe = T, fe = (Xe, Ae) => {
      const nt = R[Xe], st = nt ? nt instanceof Map ? nt.get(Ae.e) : nt[Ae.e] : null;
      return st ? Aa(Xe, st)[Ae.fin] : 0;
    }, oe = K[Z[G[0]][0]], W = (Xe) => Xe.toFixed(2);
    N.querySelector(".hk-b-tit").textContent = "L = " + pe.toFixed(2) + " m \xB7 " + G.length + " tramo(s) \xB7 desde (" + W(oe[0]) + ", " + W(oe[1]) + ", " + W(oe[2]) + ")";
    const Me = U === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], te = N.querySelector(".hk-b-cuerpo");
    te.innerHTML = "";
    const Re = Math.max(300, te.clientWidth), ge = 124, ve = 46, Se = (ge - 14) / 2;
    for (const [Xe, Ae, nt, st] of Me) {
      const Ue = X.map((Ne) => fe(Xe, Ne)), D = Math.max(...Ue), J = Math.min(...Ue), re = Math.max(Math.abs(D), Math.abs(J)) || 1, ie = (Ne) => ve + Ne / (pe || 1) * (Re - 2 * ve), _e = (Ne) => Se + (st ? 1 : -1) * (Ne / re) * (Se - 16), Ce = (Ne) => Math.abs(Ne) >= 100 ? Ne.toFixed(1) : Math.abs(Ne) >= 10 ? Ne.toFixed(2) : Ne.toFixed(3);
      let Ye = ie(0) + "," + Se + " ";
      X.forEach((Ne, Ze) => {
        Ye += ie(Ne.x) + "," + _e(Ue[Ze]) + " ";
      }), Ye += ie(pe) + "," + Se;
      const Ie = Ue.indexOf(D), Oe = Ue.indexOf(J), Ke = (Ne, Ze) => {
        const lt = _e(Ue[Ne]) + (_e(Ue[Ne]) < Se ? -5 : 13);
        return '<text x="' + ie(X[Ne].x) + '" y="' + lt + '" text-anchor="middle" fill="' + Ze + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Ce(Ue[Ne]) + "</text>";
      }, Pe = st ? "#d9534f" : "#3fa7d6";
      te.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Ae + ' <span style="color:#6f7d90;font-weight:400">(' + nt + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Ce(D) + " \xB7 m\xEDn " + Ce(J) + (st ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + Re + '" height="' + ge + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + ve + '" y1="' + Se + '" x2="' + (Re - ve) + '" y2="' + Se + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Ye + '" fill="' + Pe + '" fill-opacity=".35" stroke="' + Pe + '" stroke-width="1.4"/>' + Ke(0, "#f2f5fa") + Ke(X.length - 1, "#f2f5fa") + (Ie > 0 && Ie < X.length - 1 ? Ke(Ie, "#8fd3ff") : "") + (Oe > 0 && Oe < X.length - 1 && Oe !== Ie ? Ke(Oe, "#ff9f9a") : "") + '<text x="' + ve + '" y="' + (ge - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (Re - ve) + '" y="' + (ge - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + pe.toFixed(2) + " m</text></svg>");
    }
  }
  window.__hekatanDiagramaBarra = Q;
  function se(K) {
    const { nombre: Z, texto: R } = ks(t, K), G = URL.createObjectURL(new Blob([R], { type: "text/plain" })), X = document.createElement("a");
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
    return Z && se(K), ks(t, K);
  };
  let xe = null, he = null, ye = -1;
  function de(K) {
    var _a3, _b2, _c, _d, _e;
    if (ye = K, !he) {
      he = document.createElement("div"), he.id = "hk-klocal", he.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(he);
      const oe = document.createElement("style");
      oe.textContent = "#hk-klocal[hidden]{display:none!important}", document.head.appendChild(oe);
    }
    let Z;
    try {
      Z = _s(t, K);
    } catch (oe) {
      alert(String(oe));
      return;
    }
    const R = (oe) => Math.abs(oe) < 1e-12 ? "0" : Math.abs(oe) >= 1e5 || Math.abs(oe) < 0.01 ? oe.toExponential(4) : oe.toPrecision(6), G = ((_a3 = t.elementInputs) == null ? void 0 : _a3.rawVal) ?? {}, X = (_c = (_b2 = G.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, K), T = (_e = (_d = G.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, K), H = [X && (X[0] > 1e-12 || X[1] > 1e-12) ? `brazos r\xEDgidos ${X[0]}\xB7L / ${X[1]}\xB7L (se aplican en K global: R\u1D40\xB7K\xB7R)` : "", T ? `ang ${T}\xB0 (gira T, no esta K)` : ""].filter(Boolean).join(" \xB7 "), pe = ["u1 i", "u2 i", "u3 i", "\u03B81 i", "\u03B82 i", "\u03B83 i", "u1 j", "u2 j", "u3 j", "\u03B81 j", "\u03B82 j", "\u03B83 j"], fe = Z.K.map((oe, W) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${pe[W]}</th>` + oe.map((Me) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(Me) < 1e-12 ? "#4a5568" : Me < 0 ? "#ff9f9a" : "#e6edf5"}">${R(Me)}</td>`).join("") + "</tr>").join("");
    he.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${K + 1}</b><span style="color:#9fb0c6">L = ${Z.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${Z.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${Z.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${H ? ` \xB7 <b style="color:#f59e0b">${H}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${pe.map((oe) => `<th style="color:#9fb0c6;padding:2px 6px">${oe}</th>`).join("")}</tr>${fe}</table></div>`, he.querySelector(".hk-k-x").addEventListener("click", () => {
      he.hidden = true;
    }), he.querySelector(".hk-k-m").addEventListener("click", () => se(ye)), he.hidden = false;
  }
  return window.addEventListener("hk:model-selection", (K) => {
    var _a3;
    const Z = (_a3 = K.detail) == null ? void 0 : _a3.ultimo;
    xe || (xe = document.createElement("button"), xe.id = "hk-klocal-chip", xe.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(xe), xe.addEventListener("click", () => {
      const R = Number(xe.dataset.idx);
      R >= 0 && de(R);
    })), xe.hidden = true, Z && Z.type === "frame" && (xe.dataset.idx = String(Z.idx), xe.textContent = "\u{1F4D0} Ver K local \xB7 barra " + (Z.idx + 1), he && (he.hidden = true), xe.hidden = false);
  }), window.__hekatanKLocal = (K) => _s(t, K), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = z, { abrir: z, abrirBarra: Q };
}
function Ss(t, y = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(y)), setTimeout(() => {
    ue.derive(() => {
      Qo.val, g.style.background = Li();
    });
  });
  const k = document.createElement("div");
  k.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(k), setTimeout(() => {
    ue.derive(() => {
      k.textContent = Ea.val ? `[${Ea.val}]` : "";
    });
  });
  const S = Array.from({ length: y + 1 }, (P, L) => L / y).reverse();
  let A, z;
  S.forEach((P, L) => {
    A = document.createElement("div"), A.id = `marker-${L}`, A.className = "marker", A.style.marginTop = L == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", z = document.createElement("p"), z.id = `marker-text-${L}`, A.append(z), g.append(A);
  });
  const $ = [];
  return g.querySelectorAll("p").forEach((P) => $.push(P)), setTimeout(() => {
    ue.derive(() => {
      S.forEach((P, L) => {
        const Y = $[L];
        Y && (Y.innerText = kl(t.val, P).toString());
      });
    });
  }), g;
}
function kl(t, y) {
  const g = go.val;
  if (g) return Ps(g[0] + y * (g[1] - g[0]));
  const k = t.filter((z) => Number.isFinite(z));
  if (k.length === 0) return "0";
  const [S, A] = Fa(k);
  return Ps(S + y * (A - S));
}
function Ps(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const y = Math.abs(t);
  return y < 1e-3 || y >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function Rl({ mesh: t, settingsObj: y, drawingObj: g, objects3D: k, solids: S }) {
  Fi.DEFAULT_UP = new F(0, 0, 1);
  const A = document.createElement("div"), z = new zi(), $ = new Ci(45, 1, 0.1, 2 * 1e6), P = new Ai(-10, 10, 10, -10, -1e3, 2e6);
  let L = $;
  const Y = new Ei({ antialias: true });
  Y.localClippingEnabled = true;
  const N = new gs($, Y.domElement);
  N.enableDamping = true, N.dampingFactor = 0.1, N.screenSpacePanning = true, N.zoomSpeed = 0.8, N.panSpeed = 1.2, N.rotateSpeed = 0.9, N.keyPanSpeed = 12, N.listenToKeyEvents(window), N.touches = { ONE: Uo.ROTATE, TWO: Uo.DOLLY_PAN }, Y.domElement.addEventListener("wheel", (D) => {
    if (!D.ctrlKey && Math.abs(D.deltaX) > Math.abs(D.deltaY) * 1.5) {
      D.preventDefault();
      const J = N.target, re = new F().subVectors($.position, J), ie = new F();
      ie.crossVectors($.up, re).normalize();
      const Ce = re.length() * 1e-3 * N.panSpeed;
      J.addScaledVector(ie, D.deltaX * Ce), $.position.addScaledVector(ie, D.deltaX * Ce), N.update();
    }
  }, { passive: false });
  const ee = new yo(new F(-1, 0, 0), 0), U = new yo(new F(0, -1, 0), 0), me = new yo(new F(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function Q() {
    const D = window.__hekatanClip, J = [];
    D.enableX && (ee.normal.set(D.invertX ? 1 : -1, 0, 0), ee.constant = D.invertX ? -D.posX : D.posX, J.push(ee)), D.enableY && (U.normal.set(0, D.invertY ? 1 : -1, 0), U.constant = D.invertY ? -D.posY : D.posY, J.push(U)), D.enableZ && (me.normal.set(0, 0, D.invertZ ? 1 : -1), me.constant = D.invertZ ? -D.posZ : D.posZ, J.push(me)), Y.clippingPlanes = J, z.traverse((ie) => {
      const _e = ie;
      if (_e.material) {
        const Ce = Array.isArray(_e.material) ? _e.material : [_e.material];
        for (const Ye of Ce) Ye.clippingPlanes = J, Ye.needsUpdate = true;
      }
    });
    const re = window.__hekatanPanes ?? [];
    for (const ie of re) try {
      ie && typeof ie.refresh == "function" && ie.refresh();
    } catch {
    }
    Y.render(z, L);
  }
  Q(), window.__hekatanClipApply = Q;
  const q = Ti(y), ae = ue.derive(() => Math.pow(10, q.displayScale.val / 10)), se = Sl(t, q), xe = () => {
    const D = [];
    return q.gridXY.rawVal && D.push("xy"), q.gridXZ.rawVal && D.push("xz"), q.gridYZ.rawVal && D.push("yz"), D;
  }, he = () => {
    const D = q.gridStep.rawVal, J = Math.max(D, q.gridMajor.rawVal);
    return { planes: xe(), majorStep: J, minorStep: D };
  };
  let ye = Sa(q.gridSize.rawVal, he());
  ye.visible = q.gridVisible.rawVal, window.__hekatanSnap2D = q.cursorSnap.rawVal;
  const de = () => {
    const D = Math.max(0, Math.min(1, q.gridOpacity.rawVal));
    ye.traverse((J) => {
      const re = J.material;
      if (!re || !("opacity" in re)) return;
      const ie = J.name ?? "";
      let _e = 0.55;
      ie.includes("border") ? _e = 1 : ie.includes("major") && (_e = 0.95), re.opacity = D * _e;
    });
  };
  de(), A.appendChild(Ri(q, t, S)), A.setAttribute("id", "viewer"), A.appendChild(Y.domElement), Y.setPixelRatio(window.devicePixelRatio);
  const K = Xn();
  Y.setClearColor(K.background, 1);
  const Z = q.gridSize.rawVal, R = Z * 0.5 + Z * 0.5 / Math.tan(45 * 0.5);
  $.position.set(0, 0, R), $.up.set(0, 1, 0), N.target.set(0, 0, 0), N.minDistance = 0.1, N.maxDistance = 1e4, A.__settings = q, N.zoomSpeed = 1, N._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, N.update();
  let G = Ms(q.gridSize.rawVal, q.flipAxes.rawVal);
  z.add(ye, G), ue.derive(() => {
    window.__hekatanGridPlaneXY = q.gridXY.val, window.__hekatanGridPlaneXZ = q.gridXZ.val, window.__hekatanGridPlaneYZ = q.gridYZ.val;
  });
  let X = true;
  ue.derive(() => {
    const D = q.gridVisible.val;
    if (X) {
      X = false;
      return;
    }
    ye.visible = D, te();
  });
  let T = true;
  ue.derive(() => {
    if (q.gridOpacity.val, T) {
      T = false;
      return;
    }
    de(), te();
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
    z.remove(ye), (_a2 = ye.traverse) == null ? void 0 : _a2.call(ye, (Ce) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), ye = Sa(D, he()), ye.visible = q.gridVisible.rawVal, z.add(ye), de(), z.remove(G), G.traverse((Ce) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = Ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), G = Ms(D, J), z.add(G);
    const re = D * 0.5 + D * 0.5 / Math.tan(45 * 0.5);
    $.position.distanceTo(N.target);
    const ie = Math.abs($.position.x) < 0.1 && Math.abs($.position.y) < 0.1 && $.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ie ? $.position.set(0, 0, re) : $.position.set(0.5 * D, -re, 0.5 * D), N.target.set(0, 0, 0)), N.minDistance = Math.max(0.05, D * 0.01), N.maxDistance = Math.max(50, D * 50), N.update(), te();
  }), new ResizeObserver((D) => {
    var _a2, _b;
    for (const J of D) {
      const re = (_a2 = J.target) == null ? void 0 : _a2.clientWidth, ie = (_b = J.target) == null ? void 0 : _b.clientHeight;
      if (re === 0 || ie === 0) continue;
      const Ce = (fe ? re / 2 : re) / ie;
      $.aspect = Ce, $.updateProjectionMatrix();
      const Ye = P.top;
      if (P.left = -Ye * Ce, P.right = Ye * Ce, P.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = Ce, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Ie = oe, Oe = Ie.top;
        Ie.left = -Oe * Ce, Ie.right = Oe * Ce, Ie.updateProjectionMatrix();
      }
      Y.setSize(re, ie), te();
    }
  }).observe(A), N.addEventListener("change", te), ue.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, q.displayScale.val, q.nodes.val, q.elements.val, (_g = q.edges) == null ? void 0 : _g.val, q.elemColumns.val, q.elemBeams.val, q.nodesIndexes.val, q.elementsIndexes.val, q.orientations.val, q.sections.val, q.secColumns.val, q.secBeams.val, q.secFloor.val, q.supports.val, q.loads.val, q.deformedShape.val, q.nodeResults.val, q.frameResults.val, q.shellResults.val, (_h = q.solidResults) == null ? void 0 : _h.val, (_i2 = q.extruded) == null ? void 0 : _i2.val, setTimeout(te);
  });
  let fe = false, oe = null, W = null, Me = false;
  function te() {
    const D = A.clientWidth || 1, J = A.clientHeight || 1;
    if (!fe || !oe) {
      Y.setScissorTest(false), Y.setViewport(0, 0, D, J), Y.render(z, L);
      return;
    }
    const re = D / 2;
    Y.setScissorTest(true), Y.setViewport(0, 0, re, J), Y.setScissor(0, 0, re, J), Y.render(z, L), Y.setViewport(re, 0, re, J), Y.setScissor(re, 0, re, J), Y.render(z, oe), Y.setScissorTest(false);
  }
  function Re(D) {
    L = D, N.object = D, N.update(), te();
  }
  function ge(D, J) {
    fe = D, J && (oe = J);
    const re = A.clientWidth || 1, ie = A.clientHeight || 1, Ce = (D ? re / 2 : re) / ie;
    $.isPerspectiveCamera && ($.aspect = Ce, $.updateProjectionMatrix());
    const Ye = P.top;
    if (P.left = -Ye * Ce, P.right = Ye * Ce, P.updateProjectionMatrix(), D && oe) {
      if (W ? (W.object = oe, W.update()) : (W = new gs(oe, Y.domElement), W.enableDamping = true, W.dampingFactor = 0.1, W.screenSpacePanning = true, W.zoomSpeed = 0.8, W.panSpeed = 1.2, W.rotateSpeed = 0.9, W.touches = { ONE: Uo.ROTATE, TWO: Uo.DOLLY_PAN }, W.target.copy(N.target), W.addEventListener("change", te), W.enabled = false), !Me) {
        const Ie = (Oe) => {
          if (!fe || !W) return;
          const Ke = Y.domElement.getBoundingClientRect(), Pe = Oe.clientX - Ke.left, Ne = Ke.width / 2, Ze = Pe >= Ne;
          N.enabled = !Ze, W.enabled = Ze;
        };
        Y.domElement.addEventListener("pointerdown", Ie, true), Y.domElement.addEventListener("wheel", Ie, { capture: true, passive: true }), Me = true;
      }
    } else D || (N.enabled = true, W && (W.enabled = false));
    A.__splitMode = D, window.__hekatanSplitMode = D, window.__hekatanSplitCamera = D ? oe : null, te();
  }
  if (t) {
    z.add(Di(q, se, ae), $i(t, q, se), Yi(q, se, ae), Xi(t, q, se, ae), Bi(t, q, se, ae), Ni(t, q, se, ae), qi(t, q, se, ae), Ki(t, q, se, ae), Oi(t, q, se), tl(t, q, se, ae), Qi(t, q, se, ae)), window.__hekatanDiagrama2D || (_l(t, q), Y.domElement.addEventListener("dblclick", () => {
      var _a2;
      const Ie = (_a2 = q.frameResults) == null ? void 0 : _a2.rawVal;
      !Ie || Ie === "none" || !(window.__hekatanModelSelection ?? []).some((Ke) => Ke.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const D = yl({ scene: z, rendererElm: Y.domElement, getActiveCamera: () => L, derivedNodes: se, derivedDisplayScale: ae, mesh: t, settings: q, render: te });
    z.add(D);
    const J = Fl(t, q), re = al(t, q, se, J), ie = Ss(J);
    z.add(re), A.appendChild(ie);
    const _e = cl(t, q, se);
    z.add(_e);
    const Ce = _e.__colorMapValues, Ye = Ss(Ce);
    Ye.id = "frame-legend", A.appendChild(Ye), ue.derive(() => {
      var _a2;
      const Ie = q.shellResults.val != "none", Oe = (((_a2 = q.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ke = Ie || Oe, Pe = q.frameResults.val.startsWith("contour:"), Ne = J.val.some((Ze) => Number.isFinite(Ze));
      ie.hidden = !Ke || !Ne, re.visible = Ke, Ye.hidden = !Pe;
    });
  }
  if (S) {
    const D = new Es(16777215, 0.5);
    z.add(D);
    const J = new Ho(16777215, 0.5);
    J.position.set(30, 25, -10), J.shadow.mapSize.width = 1024, J.shadow.mapSize.height = 1024, z.add(J);
    const re = 10;
    J.shadow.camera.left = -re, J.shadow.camera.right = re, J.shadow.camera.top = re, J.shadow.camera.bottom = -re, J.shadow.camera.far = 1e3;
    const ie = new Ho(16777215, 0.5);
    ie.color.setHSL(11, 43, 96), ie.position.set(-10, 0, 30), z.add(ie), ue.derive(() => {
      (S == null ? void 0 : S.val.length) && (z.remove(...S.oldVal), z.add(...S.rawVal), te());
    }), ue.derive(() => {
      S.rawVal.forEach((_e) => _e.visible = q.solids.val), te();
    });
  }
  if (k) {
    const D = [], J = (ie) => {
      var _a2;
      return ((_a2 = ie == null ? void 0 : ie.userData) == null ? void 0 : _a2.isCota) ? q.showCotas.val : q.custom3D.val;
    }, re = () => {
      for (const ie of D) ie.visible = J(ie);
      te();
    };
    ue.derive(() => {
      const ie = k.val;
      D.length && (z.remove(...D), D.length = 0), ie.length && (z.add(...ie), D.push(...ie), re(), Y.clippingPlanes.length && Q()), te();
    }), ue.derive(() => {
      q.custom3D.val, re();
    }), ue.derive(() => {
      q.showCotas.val, re();
    });
  }
  g && nl({ drawingObj: g, gridObj: ye, scene: z, getActiveCamera: () => L, controls: N, gridSize: Z, derivedDisplayScale: ae, rendererElm: Y.domElement, viewerRender: te }), Cs((D, J) => {
    var _a2;
    Y.setClearColor(J.background, 1), z.remove(ye), (_a2 = ye.traverse) == null ? void 0 : _a2.call(ye, (re) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = re.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), ye = Sa(q.gridSize.rawVal, { planes: xe() }), z.add(ye), A.style.setProperty("--awatif-legend-color", J.legendMarker), te();
  });
  const ve = { scene: z, perspCamera: $, orthoCamera: P, get camera() {
    return L;
  }, controls: N, renderer: Y, rendererElm: Y.domElement, render: te, setActiveCamera: Re, setSplitMode: ge, get splitMode() {
    return fe;
  }, get splitCamera() {
    return oe;
  }, settings: q };
  A.__ctx = ve;
  const Se = document.createElement("div");
  Se.id = "hk-nav-camara", Se.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Xe = (D, J, re) => {
    const ie = document.createElement("button");
    return ie.textContent = D, ie.title = J, ie.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ie.onmouseenter = () => {
      ie.style.background = "rgba(70,70,70,0.9)";
    }, ie.onmouseleave = () => {
      ie.style.background = "rgba(40,40,40,0.85)";
    }, ie.onclick = (_e) => {
      _e.preventDefault(), re();
    }, ie;
  }, Ae = (D, J) => {
    const re = N.target, ie = new F().subVectors(L.position, re), _e = ie.length(), Ce = new F(), Ye = new F();
    Ce.crossVectors(L.up, ie).normalize(), Ye.copy(L.up).normalize();
    const Ie = _e * 0.05;
    re.addScaledVector(Ce, -D * Ie), re.addScaledVector(Ye, J * Ie), L.position.addScaledVector(Ce, -D * Ie), L.position.addScaledVector(Ye, J * Ie), N.update(), te();
  }, nt = (D) => {
    const J = new F().subVectors(L.position, N.target);
    J.multiplyScalar(D), L.position.copy(N.target).add(J), N.update(), te();
  }, st = () => {
    const D = document.createElement("div");
    return D.style.cssText = "width:32px;height:32px;", D;
  };
  return Se.append(st()), Se.append(Xe("\u2191", "Pan arriba", () => Ae(0, 1))), Se.append(Xe("\u2295", "Zoom in", () => nt(0.85))), Se.append(Xe("\u2190", "Pan izquierda", () => Ae(-1, 0))), Se.append(Xe("\u2302", "Reset vista", () => {
    N.reset(), te();
  })), Se.append(Xe("\u2192", "Pan derecha", () => Ae(1, 0))), Se.append(Xe("\u2296", "Zoom out", () => nt(1.18))), Se.append(Xe("\u2193", "Pan abajo", () => Ae(0, -1))), Se.append(st()), getComputedStyle(A).position === "static" && (A.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && A.appendChild(Se), A;
}
function Sl(t, y) {
  return ue.derive(() => {
    var _a2, _b, _c, _d;
    if (!y.deformedShape.val) return ((_a2 = t == null ? void 0 : t.nodes) == null ? void 0 : _a2.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], k = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!k || g.length === 0) return g;
    const S = y.deformScale.val, A = y.deformScale.val * y.deformScaleZ.val, z = Number.isFinite(S) ? S : 1, $ = Number.isFinite(A) ? A : 1;
    return g.map((P, L) => {
      var _a3;
      const Y = ((_a3 = k.get(L)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], N = Number.isFinite(Y[0]) ? Y[0] : 0, ee = Number.isFinite(Y[1]) ? Y[1] : 0, U = Number.isFinite(Y[2]) ? Y[2] : 0;
      return [P[0] + N * z, P[1] + ee * z, P[2] + U * $];
    });
  });
}
const go = ue.state(null), Ea = ue.state(""), Pl = ue.state("kN"), zl = ue.state("mm"), Cl = ue.state("kN/m\xB2"), Al = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, zs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, El = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Fl(t, y) {
  const g = ue.state([]);
  let k;
  return ((S) => {
    S.bendingXX = "bendingXX", S.bendingYY = "bendingYY", S.bendingXY = "bendingXY", S.membraneXX = "membraneXX", S.membraneYY = "membraneYY", S.membraneXY = "membraneXY", S.tranverseShearX = "tranverseShearX", S.tranverseShearY = "tranverseShearY", S.membranePrincipalMax = "membranePrincipalMax", S.membranePrincipalMin = "membranePrincipalMin", S.bendingPrincipalMax = "bendingPrincipalMax", S.bendingPrincipalMin = "bendingPrincipalMin", S.transverseShearMax = "transverseShearMax", S.vonMises = "vonMises", S.pressure = "pressure", S.displacementX = "displacementX", S.displacementY = "displacementY", S.displacementZ = "displacementZ";
  })(k || (k = {})), ue.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const S = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), me = (D, J) => {
      D == null ? void 0 : D.forEach((re, ie) => {
        const _e2 = t.elements.val[ie];
        if (_e2) for (let Ce = 0; Ce < _e2.length; Ce++) J.set(_e2[Ce], [re[Ce] ?? re[0]]);
      });
    };
    me((_b = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, S), me((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, A), me((_f = (_e = t.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, z), me((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, $), me((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, P), me((_l2 = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l2.membraneXY, L), me((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, Y), me((_p = (_o = t.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, N), me((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), me((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, U);
    const Q = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), he = (D, J, re, ie, _e2) => {
      D.forEach((Ce, Ye) => {
        var _a3, _b2;
        const Ie = Ce[0] ?? 0, Oe = ((_a3 = J.get(Ye)) == null ? void 0 : _a3[0]) ?? 0, Ke = ((_b2 = re.get(Ye)) == null ? void 0 : _b2[0]) ?? 0, Pe = (Ie + Oe) / 2, Ne = Math.hypot((Ie - Oe) / 2, Ke);
        ie.set(Ye, [Pe + Ne]), _e2.set(Ye, [Pe - Ne]);
      });
    };
    he($, P, L, Q, q), he(S, A, z, ae, se), Y.forEach((D, J) => {
      var _a3;
      xe.set(J, [Math.hypot(D[0] ?? 0, ((_a3 = N.get(J)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const ye = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, de = (_w = y.solidResults) == null ? void 0 : _w.val, Z = de && de !== "none" ? de : y.shellResults.val, R = ye == null ? void 0 : ye[Z], G = { bendingXX: [S, 0], bendingYY: [A, 0], bendingXY: [z, 0], membraneXX: [$, 0], membraneYY: [P, 0], membraneXY: [L, 0], tranverseShearX: [Y, 0], tranverseShearY: [N, 0], membranePrincipalMax: [Q, 0], membranePrincipalMin: [q, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [se, 0], transverseShearMax: [xe, 0], vonMises: [ee, 0], pressure: [U, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, X = y.shellResults.val, T = Pl.val, H = zl.val, pe = X === "displacementX" || X === "displacementY" || X === "displacementZ", fe = X === "bendingXX" || X === "bendingYY" || X === "bendingXY" || X === "bendingPrincipalMax" || X === "bendingPrincipalMin", oe = X === "membraneXX" || X === "membraneYY" || X === "membraneXY" || X === "membranePrincipalMax" || X === "membranePrincipalMin", W = X === "vonMises" || X === "pressure", Me = X === "tranverseShearX" || X === "tranverseShearY" || X === "transverseShearMax", te = (_D = y.solidResults) == null ? void 0 : _D.val, Re = te === "vonMises" || te === "sigmaXX" || te === "sigmaYY" || te === "sigmaZZ" || te === "tauXY" || te === "tauYZ" || te === "tauXZ", ge = te === "ux" || te === "uy" || te === "uz", ve = Cl.val, Se = Re ? El[ve] : ge || pe ? zs[H] : fe || oe || W || Me ? 1 / Al[T] : 1, Xe = Re ? ve : ge || pe ? H : fe ? `${T}\xB7m/m` : oe ? `${T}/m\xB2` : W ? `${T}/m\xB2` : Me ? `${T}/m` : "";
    Ea.val = Xe, go.val = Array.isArray(R) && R.length === 2 ? [R[0] * Se, R[1] * Se] : null;
    const Ae = Ls.val, st = te && te !== "none" ? [ee, 0] : G[X], Ue = [];
    if (t.nodes.val.forEach((D, J) => {
      const re = st;
      if (!re || !re[0] || typeof re[0].has != "function") return;
      if (!re[0].has(J)) {
        Ue.push(Number.NaN);
        return;
      }
      const ie = re[0].get(J), _e2 = ie ? ie[re[1]] ?? 0 : 0;
      Ue.push(_e2 * Se);
    }), !go.val && Ae !== "auto") {
      const D = t.nodes.val, J = /* @__PURE__ */ new Set(), re = (_e2, Ce) => {
        var _a3;
        const Ye = (_a3 = D[_e2[0]]) == null ? void 0 : _a3[Ce];
        return _e2.every((Ie) => {
          var _a4;
          return Math.abs((((_a4 = D[Ie]) == null ? void 0 : _a4[Ce]) ?? NaN) - Ye) < 1e-6;
        });
      };
      for (const _e2 of t.elements.val) {
        if (_e2.length !== 4) continue;
        const Ce = re(_e2, 2), Ye = !Ce && re(_e2, 0), Ie = !Ce && re(_e2, 1);
        if (Ae === "losas" ? Ce : Ae === "muros" ? Ye || Ie : Ae === "murosX" ? Ye : Ae === "murosY" ? Ie : false) for (const Pe of _e2) J.add(Pe);
      }
      const ie = [];
      for (const _e2 of J) {
        const Ce = Ue[_e2];
        Number.isFinite(Ce) && ie.push(Ce);
      }
      ie.length && (go.val = Fa(ie));
    }
    g.val = Ue;
  }), g;
}
export {
  Ii as a,
  Ss as b,
  Pl as c,
  zl as d,
  Cl as e,
  Rl as g
};
