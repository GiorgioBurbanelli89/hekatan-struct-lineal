import { u as dn, a6 as qo, q as yi, v as ue, a7 as xi, D as Lt, M as dt, B as Ve, F as It, a8 as gi, z as bt, a9 as bi, aa as Mi, h as ms, ab as ws, r as qn, ac as Ho, ad as Jo, a4 as Es, _ as pt, b as wt, L as nn, y as $s, c as vi, ae as _i, f as xt, V as F, $ as In, af as ka, K as ea, d as Et, a as Sa, A as Vs, t as Qo, J as ki, H as Mo, I as Si, ag as Oo, w as Pa, o as Pi, N as Vn, a2 as ao, E as ys, S as so, m as go, ah as Cn, g as xs, i as gs, j as bs, P as vo, C as Ms, W as zi, X as Ci, Y as Ai, Z as Fi, T as Go, U as Ei } from "./theme-C-zoknmI.js";
import { T as Rt, O as vs } from "./Text-Cehu0nom.js";
import { P as Ls } from "./tweakpane-BXg6ZhiP.js";
import { e as $i } from "./styles-CqEyA8nI.js";
class Is {
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
    this.map = za[y] || za.rainbow, this.n = g;
    const k = 1 / this.n, S = new dn(), A = new dn();
    this.lut.length = 0, this.lut.push(new dn(this.map[0][1]));
    for (let z = 1; z < g; z++) {
      const $ = z * k;
      for (let P = 0; P < this.map.length - 1; P++) if ($ > this.map[P][0] && $ <= this.map[P + 1][0]) {
        const L = this.map[P][0], Y = this.map[P + 1][0];
        S.setHex(this.map[P][1], qo), A.setHex(this.map[P + 1][1], qo);
        const N = new dn().lerpColors(S, A, ($ - L) / (Y - L));
        this.lut.push(N);
      }
    }
    return this.lut.push(new dn(this.map[this.map.length - 1][1])), this;
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
    return za[y] = g, this;
  }
  createCanvas() {
    const y = document.createElement("canvas");
    return y.width = 1, y.height = this.n, this.updateCanvas(y), y;
  }
  updateCanvas(y) {
    const g = y.getContext("2d", { alpha: false }), k = g.getImageData(0, 0, 1, this.n), S = k.data;
    let A = 0;
    const z = 1 / this.n, $ = new dn(), P = new dn(), L = new dn();
    for (let Y = 1; Y >= 0; Y -= z) for (let N = this.map.length - 1; N >= 0; N--) if (Y < this.map[N][0] && Y >= this.map[N - 1][0]) {
      const ee = this.map[N - 1][0], U = this.map[N][0];
      $.setHex(this.map[N - 1][1], qo), P.setHex(this.map[N][1], qo), L.lerpColors($, P, (Y - ee) / (U - ee)), S[A * 4] = Math.round(L.r * 255), S[A * 4 + 1] = Math.round(L.g * 255), S[A * 4 + 2] = Math.round(L.b * 255), S[A * 4 + 3] = 255, A += 1;
    }
    return g.putImageData(k, 0, 0), y;
  }
}
const za = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Rs = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Vi = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Rs, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, ta = ue.state("safe"), Ts = ue.state("auto");
function Ds(t) {
  t = Math.max(0, Math.min(1, t));
  const y = Vi[ta.val] ?? Rs;
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
function _s() {
  const y = new Uint8Array(1024);
  for (let k = 0; k < 256; k++) {
    const S = k / 255, [A, z, $] = Ds(S);
    y[k * 4 + 0] = A, y[k * 4 + 1] = z, y[k * 4 + 2] = $, y[k * 4 + 3] = 255;
  }
  const g = new bi(y, 256, 1, Mi);
  return g.minFilter = ms, g.magFilter = ms, g.wrapS = ws, g.wrapT = ws, g.needsUpdate = true, g;
}
function Li() {
  const y = [];
  for (let g = 0; g <= 12; g++) {
    const k = 1 - g / 12, [S, A, z] = Ds(k);
    y.push(`rgb(${S | 0},${A | 0},${z | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${y.join(",")})`;
}
function La(t) {
  if (!t.length) return [0, 1];
  const y = [...t].sort((A, z) => A - z), g = (A) => y[Math.min(y.length - 1, Math.max(0, Math.round(A * (y.length - 1))))];
  let k = y.length >= 20 ? g(0.01) : y[0], S = y.length >= 20 ? g(0.99) : y[y.length - 1];
  return k >= 0 && S > 0 && (k = 0), S <= 0 && k < 0 && (S = 0), [k, S];
}
function Ii(t, y, g) {
  new Is();
  const k = _s(), S = new xi({ uniforms: { cmap: { value: k }, ambient: { value: 0.95 } }, vertexShader: `
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
    var _a;
    ta.val;
    const z = S.uniforms.cmap.value;
    S.uniforms.cmap.value = _s(), (_a = z == null ? void 0 : z.dispose) == null ? void 0 : _a.call(z);
  });
  const A = new dt(new Ve(), S);
  return A.renderOrder = -1, A.frustumCulled = false, A.userData.isShellArea = true, A.name = "__hekatan_shell_colormap", ue.derive(() => {
    A.geometry.setAttribute("position", new It(t.val.flat(), 3));
    const z = [], $ = [], P = [];
    y.val.forEach((se, xe) => {
      se.length === 3 ? (z.push(se[0], se[1], se[2]), $.push(xe), P.push(0)) : se.length === 4 && (z.push(se[0], se[1], se[2]), z.push(se[0], se[2], se[3]), $.push(xe, xe), P.push(0, 1));
    }), A.geometry.setIndex(new gi(z, 1)), A.userData.faceToElem = $, A.userData.faceLocal = P;
    const L = g.val.filter((se) => Number.isFinite(se));
    let Y, N;
    const ee = ko.val;
    if (ee ? (N = ee[0], Y = ee[1]) : [N, Y] = La(L), Y === N) {
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
    A.geometry.setAttribute("scalar", new bt(ae, 1));
  }), A;
}
function Ri(t, y, g) {
  const k = document.createElement("div"), S = new Ls({ title: "Settings", expanded: true, container: k });
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
      var _a;
      (_a = window.__hekatanDiagrama2D) == null ? void 0 : _a.call(window);
    }), U.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagramaBarra) == null ? void 0 : _a.call(window);
    }), U.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), U.addBinding(ta, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), U.addBinding(Ts, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), U.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), U.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), U.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), U.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
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
  const k = qn(), S = new Ho(new Ve(), new Jo({ color: k.nodePoint }));
  return Es((A, z) => {
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
function Ca(t, y) {
  const g = qn(), k = new pt();
  k.name = "hekatan-grid";
  const S = (y == null ? void 0 : y.planes) ?? ["xy"];
  let A = (y == null ? void 0 : y.majorStep) ?? 1, z = (y == null ? void 0 : y.minorStep) ?? 0.1;
  for (A <= 0 && (A = 1), z <= 0 && (z = 0.1); t / z > 500; ) z *= 2;
  for (; t / A > 100; ) A *= 2;
  const $ = t / 2;
  A = Math.max(z, Math.round(A / z) * z);
  const L = new dn(g.grid).multiplyScalar(1.3), Y = new dn(g.grid).multiplyScalar(0.8), N = (Q, q, ae, se) => {
    const xe = [], he = Q === "xy" ? (R, G) => [R, G, 0] : Q === "xz" ? (R, G) => [R, 0, G] : (R, G) => [0, R, G], ye = Math.floor($ / q);
    for (let R = -ye; R <= ye; R++) {
      const G = R * q, X = he(G, -$), T = he(G, $);
      xe.push(...X, ...T);
    }
    for (let R = -ye; R <= ye; R++) {
      const G = R * q, X = he(-$, G), T = he($, G);
      xe.push(...X, ...T);
    }
    const de = new Ve();
    de.setAttribute("position", new It(xe, 3));
    const K = new wt({ color: ae, transparent: true, opacity: se, depthWrite: false }), Z = new nn(de, K);
    return Z.name = `grid-${Q}-${q === z ? "minor" : "major"}`, Z;
  }, ee = (Q, q, ae) => {
    const se = Q === "xy" ? (Z, R) => [Z, R, 0] : Q === "xz" ? (Z, R) => [Z, 0, R] : (Z, R) => [0, Z, R], xe = [[-$, -$], [$, -$], [$, $], [-$, $]], he = [];
    for (const [Z, R] of xe) he.push(...se(Z, R));
    const ye = new Ve();
    ye.setAttribute("position", new It(he, 3));
    const de = new wt({ color: q, transparent: true, opacity: ae, depthWrite: false }), K = new $s(ye, de);
    return K.name = `grid-${Q}-border`, K.renderOrder = 1, K;
  }, U = (Q, q, ae) => {
    const se = Q === "xy" ? (de, K) => [de, K, 0] : Q === "xz" ? (de, K) => [de, 0, K] : (de, K) => [0, de, K], xe = q === "u" ? [...se(-$, 0), ...se($, 0)] : [...se(0, -$), ...se(0, $)], he = new Ve();
    he.setAttribute("position", new It(xe, 3));
    const ye = new nn(he, new wt({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
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
  const S = new pt(), A = new vi(0.5, 0.5, 0.5), z = new _i(0.45, 0.7, 4);
  z.rotateX(Math.PI / 2), z.translate(0, 0, -0.35);
  const $ = new xt({ color: 10166822 }), P = new xt({ color: 2792847 }), L = new xt({ color: 3835647 }), Y = () => {
    const U = g.rawVal ?? [];
    if (U.length < 2) return y.gridSize.val * 0.5;
    let me = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
    for (const q of U) for (let ae = 0; ae < 3; ae++) q[ae] < me[ae] && (me[ae] = q[ae]), q[ae] > Q[ae] && (Q[ae] = q[ae]);
    return Math.max(Q[0] - me[0], Q[1] - me[1], Q[2] - me[2], 0.1);
  }, N = () => 0.08 * Y(), ee = () => k.rawVal;
  return ue.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, !y.supports.val) return;
    S.clear();
    const U = N();
    (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((me, Q) => {
      const q = g.val[Q];
      if (!q) return;
      const ae = me ?? [], se = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), xe = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let he;
      se >= 3 && xe >= 3 ? he = new dt(A, $) : se >= 3 && xe === 0 ? he = new dt(z, P) : he = new dt(z, L), he.position.set(q[0], q[1], q[2]);
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
  const S = new pt();
  S.name = "loadsGroup";
  function A($) {
    if ($.length < 2) return 0.12 * y.gridSize.rawVal;
    const P = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const N of $) for (let ee = 0; ee < 3; ee++) P[ee] = Math.min(P[ee], N[ee]), L[ee] = Math.max(L[ee], N[ee]);
    return 0.08 * Math.max(L[0] - P[0], L[1] - P[1], L[2] - P[2], 0.1);
  }
  ue.derive(() => {
    var _a, _b, _c;
    if (y.deformedShape.val, !y.loads.val) return;
    S.children.forEach((Q) => {
      var _a2;
      return (_a2 = Q.dispose) == null ? void 0 : _a2.call(Q);
    }), S.clear();
    const $ = g.val, P = A($), L = 240, Y = [];
    (_c = (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((Q, q) => {
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
        const he = new F(se === 0 ? Math.sign(xe) : 0, se === 1 ? Math.sign(xe) : 0, se === 2 ? Math.sign(xe) : 0), ye = 0.45 + 0.55 * (ee ? Math.abs(xe) / ee : 1), de = new In(he, new F(...ae), 1, se === 2 ? 15637248 : 15022123, 0.3, 0.3);
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
  const k = new pt();
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
  const S = new pt();
  return ue.derive(() => {
    var _a;
    if (y.deformedShape.val, !y.elementsIndexes.val) return;
    S.children.forEach((z) => z.dispose()), S.clear();
    const A = 0.05 * y.gridSize.val * 0.6;
    (_a = t.elements) == null ? void 0 : _a.val.forEach((z, $) => {
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
function ks(t, y) {
  const g = new pt(), k = Math.min(0.05 * t, 0.6), S = qn(), A = new Rt("X", "red", "transparent"), z = new Rt(y ? "Z" : "Y", "green", "transparent"), $ = new Rt(y ? "Y" : "Z", "blue", "transparent"), P = new In(new F(1, 0, 0), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), L = new In(new F(0, 1, 0), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), Y = new In(new F(0, 0, 1), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2);
  return A.position.set(1.3 * k, 0, 0), z.position.set(0, 1.3 * k, 0), $.position.set(0, 0, 1.3 * k), A.updateScale(0.4 * k), z.updateScale(0.4 * k), $.updateScale(0.4 * k), P.scale.set(k, k, k), L.scale.set(k, k, k), Y.scale.set(k, k, k), g.add(P, L, Y, A, z, $), g;
}
function jo(t, y) {
  const g = new F(...t), S = new F(...y).clone().sub(g), A = S.length(), z = S.dot(new F(1, 0, 0)) / A, $ = S.dot(new F(0, 1, 0)) / A, P = S.dot(new F(0, 0, 1)) / A, L = Math.sqrt(z ** 2 + $ ** 2);
  let Y = new ka().fromArray([[z, $, P], [-$ / L, z / L, 0], [-z * P / L, -$ * P / L, L]].flat());
  return P === 1 && (Y = new ka().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), P === -1 && (Y = new ka().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new ea().setFromMatrix3(Y);
}
function Ea(t, y) {
  return t == null ? void 0 : t.map((g, k) => (9 * g + y[k]) / 10);
}
function _o(t) {
  const y = t.reduce((k, S) => [k[0] + S[0], k[1] + S[1], k[2] + S[2]], [0, 0, 0]), g = t.length;
  return [y[0] / g, y[1] / g, y[2] / g];
}
function Zi(t, y, g) {
  const k = _o([y, g]), S = _o([t, g]), A = _o([t, y]), z = new F(...k).sub(new F(...S)).normalize(), $ = new F(...g).sub(new F(...A)).normalize(), P = z.clone().cross($).normalize(), L = P.clone().cross(z).normalize();
  return new ea().makeBasis(z, L, P);
}
function qi(t, y, g, k) {
  const S = new pt(), A = new Ve(), z = new wt({ vertexColors: true }), $ = [0, 0, 0], P = [1, 0, 0], L = [0, 1, 0], Y = [0, 0, 1];
  A.setAttribute("position", new It([...$, ...P, ...$, ...L, ...$, ...Y], 3));
  const N = [255, 0, 0], ee = [0, 255, 0], U = [0, 0, 255];
  return A.setAttribute("color", new It([...N, ...N, ...ee, ...ee, ...U, ...U], 3)), ue.derive(() => {
    var _a;
    y.deformedShape.val, y.orientations.val && (S.clear(), (_a = t.elements) == null ? void 0 : _a.val.forEach((me) => {
      const Q = new nn(A, z), q = g.rawVal[me[0]], ae = g.rawVal[me[1]];
      if (me.length === 2 && (Q.position.set(...Ea(q, ae)), Q.rotation.setFromRotationMatrix(jo(q, ae))), me.length === 3) {
        const he = g.rawVal[me[2]];
        Q.position.set(..._o([q, ae, he])), Q.rotation.setFromRotationMatrix(Zi(q, ae, he));
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
  const S = new pt(), A = new pt();
  S.add(A);
  function z(de, K) {
    const Z = de / 2, R = K / 2, G = new Float32Array([0, -Z, -R, 0, Z, -R, 0, Z, R, 0, -Z, -R, 0, Z, R, 0, -Z, R]), X = new Ve();
    X.setAttribute("position", new bt(G, 3));
    const T = new Float32Array([0, -Z, -R, 0, Z, -R, 0, Z, R, 0, -Z, R, 0, -Z, -R]), H = new Ve();
    return H.setAttribute("position", new bt(T, 3)), { fill: X, outline: H };
  }
  function $(de, K = 24) {
    const Z = de / 2, R = new Float32Array(K * 9);
    for (let H = 0; H < K; H++) {
      const pe = H / K * Math.PI * 2, fe = (H + 1) / K * Math.PI * 2;
      R[H * 9] = 0, R[H * 9 + 1] = 0, R[H * 9 + 2] = 0, R[H * 9 + 3] = 0, R[H * 9 + 4] = Z * Math.cos(pe), R[H * 9 + 5] = Z * Math.sin(pe), R[H * 9 + 6] = 0, R[H * 9 + 7] = Z * Math.cos(fe), R[H * 9 + 8] = Z * Math.sin(fe);
    }
    const G = new Ve();
    G.setAttribute("position", new bt(R, 3));
    const X = new Float32Array((K + 1) * 3);
    for (let H = 0; H <= K; H++) {
      const pe = H / K * Math.PI * 2;
      X[H * 3] = 0, X[H * 3 + 1] = Z * Math.cos(pe), X[H * 3 + 2] = Z * Math.sin(pe);
    }
    const T = new Ve();
    return T.setAttribute("position", new bt(X, 3)), { fill: G, outline: T };
  }
  function P(de, K, Z, R) {
    const G = Z ?? K * 0.08, X = R ?? de * 0.07, T = de / 2, H = K / 2, pe = H - G, fe = X / 2, oe = [];
    function W(ge, ve, Pe, Xe) {
      oe.push(0, ge, ve, 0, Pe, ve, 0, Pe, Xe, 0, ge, ve, 0, Pe, Xe, 0, ge, Xe);
    }
    W(-T, -H, T, -pe), W(-fe, -pe, fe, pe), W(-T, pe, T, H);
    const Me = new Ve();
    Me.setAttribute("position", new bt(new Float32Array(oe), 3));
    const te = new Float32Array([0, -T, -H, 0, T, -H, 0, T, -pe, 0, fe, -pe, 0, fe, pe, 0, T, pe, 0, T, H, 0, -T, H, 0, -T, pe, 0, -fe, pe, 0, -fe, -pe, 0, -T, -pe, 0, -T, -H]), Ie = new Ve();
    return Ie.setAttribute("position", new bt(te, 3)), { fill: Me, outline: Ie };
  }
  function L(de, K, Z) {
    const R = de / 2, G = K / 2, X = R - Z, T = G - Z, H = [];
    function pe(Me, te, Ie, ge) {
      H.push(0, Me, te, 0, Ie, te, 0, Ie, ge, 0, Me, te, 0, Ie, ge, 0, Me, ge);
    }
    pe(-R, -G, R, -T), pe(-R, T, R, G), pe(-R, -T, -X, T), pe(X, -T, R, T);
    const fe = new Ve();
    fe.setAttribute("position", new bt(new Float32Array(H), 3));
    const oe = new Float32Array([0, -R, -G, 0, R, -G, 0, R, -G, 0, R, G, 0, R, G, 0, -R, G, 0, -R, G, 0, -R, -G, 0, -X, -T, 0, X, -T, 0, X, -T, 0, X, T, 0, X, T, 0, -X, T, 0, -X, T, 0, -X, -T]), W = new Ve();
    return W.setAttribute("position", new bt(oe, 3)), { fill: fe, outline: W };
  }
  function Y(de, K, Z) {
    const R = de / 2, G = K / 2, X = R - Z, T = G - Z, H = new Ve(), pe = new Float32Array([0, -X, -T, 0, X, -T, 0, X, T, 0, -X, -T, 0, X, T, 0, -X, T]);
    H.setAttribute("position", new bt(pe, 3));
    const fe = [];
    function oe(Ie, ge, ve, Pe) {
      fe.push(0, Ie, ge, 0, ve, ge, 0, ve, Pe, 0, Ie, ge, 0, ve, Pe, 0, Ie, Pe);
    }
    oe(-R, -G, R, -T), oe(-R, T, R, G), oe(-R, -T, -X, T), oe(X, -T, R, T);
    const W = new Ve();
    W.setAttribute("position", new bt(new Float32Array(fe), 3));
    const Me = new Float32Array([0, -R, -G, 0, R, -G, 0, R, -G, 0, R, G, 0, R, G, 0, -R, G, 0, -R, G, 0, -R, -G, 0, -X, -T, 0, X, -T, 0, X, -T, 0, X, T, 0, X, T, 0, -X, T, 0, -X, T, 0, -X, -T]), te = new Ve();
    return te.setAttribute("position", new bt(Me, 3)), { concFill: H, steelFillGeom: W, outline: te };
  }
  function N(de, K, Z) {
    const R = [], G = [[0, -de / 2, -K / 2], [0, -de / 2 + Z, -K / 2], [0, -de / 2 + Z, K / 2 - Z], [0, de / 2, K / 2 - Z], [0, de / 2, K / 2], [0, -de / 2, K / 2]], X = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of X) R.push(...G[fe]);
    const T = new Ve();
    T.setAttribute("position", new bt(new Float32Array(R), 3));
    const H = [];
    for (let fe = 0; fe < G.length; fe++) {
      const oe = (fe + 1) % G.length;
      H.push(...G[fe], ...G[oe]);
    }
    const pe = new Ve();
    return pe.setAttribute("position", new bt(new Float32Array(H), 3)), { fill: T, outline: pe };
  }
  function ee(de, K, Z, R) {
    const G = R / 2, X = [], T = [[0, -de - G, -K / 2], [0, -Z - G, -K / 2], [0, -Z - G, K / 2 - Z], [0, -G, K / 2 - Z], [0, -G, K / 2], [0, -de - G, K / 2]], H = [[0, G, -K / 2], [0, G + Z, -K / 2], [0, G + Z, K / 2 - Z], [0, de + G, K / 2 - Z], [0, de + G, K / 2], [0, G, K / 2]], pe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const Me of pe) X.push(...T[Me]);
    for (const Me of pe) X.push(...H[Me]);
    const fe = new Ve();
    fe.setAttribute("position", new bt(new Float32Array(X), 3));
    const oe = [];
    for (const Me of [T, H]) for (let te = 0; te < Me.length; te++) {
      const Ie = (te + 1) % Me.length;
      oe.push(...Me[te], ...Me[Ie]);
    }
    const W = new Ve();
    return W.setAttribute("position", new bt(new Float32Array(oe), 3)), { fill: fe, outline: W };
  }
  function U(de, K, Z, R) {
    const G = K / 2, X = de, T = [[0, -X, -G], [0, -X, -G + Z], [0, -R, -G + Z], [0, -R, G - Z], [0, -X, G - Z], [0, -X, G], [0, 0, G], [0, 0, -G]], H = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], pe = [];
    for (const Me of H) pe.push(...T[Me]);
    const fe = new Ve();
    fe.setAttribute("position", new bt(new Float32Array(pe), 3));
    const oe = [];
    for (let Me = 0; Me < T.length; Me++) {
      const te = (Me + 1) % T.length;
      oe.push(...T[Me], ...T[te]);
    }
    const W = new Ve();
    return W.setAttribute("position", new bt(new Float32Array(oe), 3)), { fill: fe, outline: W };
  }
  function me(de, K, Z, R, G) {
    const X = K / 2, T = G / 2, H = [], pe = [[0, -de, -X], [0, -de, -X + Z], [0, -T - R, -X + Z], [0, -T - R, X - Z], [0, -de, X - Z], [0, -de, X], [0, -T, X], [0, -T, -X]], fe = pe.map((Ie) => [Ie[0], -Ie[1], Ie[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const Ie of oe) H.push(...pe[Ie]);
    for (const Ie of oe) H.push(...fe[Ie]);
    const W = new Ve();
    W.setAttribute("position", new bt(new Float32Array(H), 3));
    const Me = [];
    for (const Ie of [pe, fe]) for (let ge = 0; ge < Ie.length; ge++) {
      const ve = (ge + 1) % Ie.length;
      Me.push(...Ie[ge], ...Ie[ve]);
    }
    const te = new Ve();
    return te.setAttribute("position", new bt(new Float32Array(Me), 3)), { fill: W, outline: te };
  }
  function Q(de, K, Z, R) {
    const G = de / 2, X = K / 2, T = R / 2, H = [[0, -T, -X], [0, T, -X], [0, T, X - Z], [0, G, X - Z], [0, G, X], [0, -G, X], [0, -G, X - Z], [0, -T, X - Z]], pe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], fe = [];
    for (const te of pe) fe.push(...H[te]);
    const oe = new Ve();
    oe.setAttribute("position", new bt(new Float32Array(fe), 3));
    const W = [];
    for (let te = 0; te < H.length; te++) {
      const Ie = (te + 1) % H.length;
      W.push(...H[te], ...H[Ie]);
    }
    const Me = new Ve();
    return Me.setAttribute("position", new bt(new Float32Array(W), 3)), { fill: oe, outline: Me };
  }
  function q(de, K, Z = 24) {
    const R = de / 2, G = R - K, X = [];
    for (let fe = 0; fe < Z; fe++) {
      const oe = fe / Z * Math.PI * 2, W = (fe + 1) / Z * Math.PI * 2, Me = Math.cos(oe), te = Math.sin(oe), Ie = Math.cos(W), ge = Math.sin(W);
      X.push(0, R * Me, R * te, 0, R * Ie, R * ge, 0, G * Ie, G * ge), X.push(0, R * Me, R * te, 0, G * Ie, G * ge, 0, G * Me, G * te);
    }
    const T = new Ve();
    T.setAttribute("position", new bt(new Float32Array(X), 3));
    const H = [];
    for (let fe = 0; fe < Z; fe++) {
      const oe = fe / Z * Math.PI * 2, W = (fe + 1) / Z * Math.PI * 2;
      H.push(0, R * Math.cos(oe), R * Math.sin(oe), 0, R * Math.cos(W), R * Math.sin(W)), H.push(0, G * Math.cos(oe), G * Math.sin(oe), 0, G * Math.cos(W), G * Math.sin(W));
    }
    const pe = new Ve();
    return pe.setAttribute("position", new bt(new Float32Array(H), 3)), { fill: T, outline: pe };
  }
  const ae = new xt({ color: 52479, transparent: true, opacity: 0.35, side: Lt, depthWrite: false }), se = new wt({ color: 52479 }), xe = new xt({ color: 16750848, transparent: true, opacity: 0.4, side: Lt, depthWrite: false }), he = new wt({ color: 16750848 });
  function ye(de, K) {
    const Z = Math.abs(K[0] - de[0]), R = Math.abs(K[1] - de[1]), G = Math.abs(K[2] - de[2]);
    return G > Z && G > R || R > Z && R > G;
  }
  return ue.derive(() => {
    var _a, _b;
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
    const Z = (_a = t.elements) == null ? void 0 : _a.val, R = (_b = t.elementInputs) == null ? void 0 : _b.val;
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
      const Me = [(pe[0] + fe[0]) / 2, (pe[1] + fe[1]) / 2, (pe[2] + fe[2]) / 2], te = jo(pe, fe);
      if (W.type === "CFT") {
        const ge = Y(W.b, W.h, W.tw ?? W.b * 0.05), ve = new dt(ge.concFill, ae);
        ve.position.set(...Me), ve.rotation.setFromRotationMatrix(te), ve.userData.e = H, S.add(ve);
        const Pe = new dt(ge.steelFillGeom, xe);
        Pe.position.set(...Me), Pe.rotation.setFromRotationMatrix(te), Pe.userData.e = H, S.add(Pe);
        const Xe = new Et(ge.outline, he);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = H, S.add(Xe);
      } else {
        let ge, ve, Pe;
        switch (W.type) {
          case "rect":
            ge = z(W.b, W.h), ve = ae, Pe = se;
            break;
          case "circ":
            ge = $(W.d), ve = ae, Pe = se;
            break;
          case "I":
            ge = P(W.b, W.h, W.tf, W.tw), ve = xe, Pe = he;
            break;
          case "HSS":
            ge = L(W.b, W.h, W.tw ?? W.b * 0.05), ve = xe, Pe = he;
            break;
          case "CFT":
            ge = Y(W.b, W.h, W.tw ?? W.b * 0.05), ve = xe, Pe = he;
            break;
          case "L":
            ge = N(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3), ve = xe, Pe = he;
            break;
          case "2L":
            ge = ee(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3, W.dis ?? 0.01), ve = xe, Pe = he;
            break;
          case "C":
          case "coldC":
            ge = U(W.b, W.h, W.tf ?? W.t ?? 3e-3, W.tw ?? W.t ?? 3e-3), ve = xe, Pe = he;
            break;
          case "2C":
            ge = me(W.b, W.h, W.tf ?? 5e-3, W.tw ?? 5e-3, W.dis ?? 0.01), ve = xe, Pe = he;
            break;
          case "T":
            ge = Q(W.b, W.h, W.tf ?? 0.01, W.tw ?? 6e-3), ve = xe, Pe = he;
            break;
          case "pipe":
            ge = q(W.d, W.tw ?? W.d * 0.05), ve = xe, Pe = he;
            break;
          default:
            return;
        }
        const Xe = new dt(ge.fill, ve);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = H, S.add(Xe);
        const Ae = new Et(ge.outline, Pe);
        Ae.position.set(...Me), Ae.rotation.setFromRotationMatrix(te), Ae.userData.e = H, S.add(Ae);
      }
      const Ie = Gi(W);
      if (Ie) {
        const ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(W.type) ? "#ff9900" : "#00ccff", Pe = new Rt(Ie, ve, "transparent");
        Pe.position.set(Me[0], Me[1], Me[2]);
        const Xe = 0.05 * y.gridSize.rawVal * 0.5;
        Pe.updateScale(Xe * ((k == null ? void 0 : k.rawVal) ?? 1)), A.add(Pe);
      }
    });
  }), ue.derive(() => {
    var _a, _b;
    const de = g.val, K = (_a = t.elements) == null ? void 0 : _a.rawVal;
    if (K) for (const Z of S.children) {
      const R = (_b = Z.userData) == null ? void 0 : _b.e;
      if (R === void 0) continue;
      const G = K[R], X = G && de[G[0]], T = G && de[G[1]];
      !X || !T || (Z.position.set((X[0] + T[0]) / 2, (X[1] + T[1]) / 2, (X[2] + T[2]) / 2), Z.rotation.setFromRotationMatrix(jo(X, T)));
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
  const y = new Mo();
  t.contorno.forEach(([g, k], S) => S ? y.lineTo(g, k) : y.moveTo(g, k)), y.closePath();
  for (const g of t.huecos ?? []) {
    const k = new Si();
    g.forEach(([S, A], z) => z ? k.lineTo(S, A) : k.moveTo(S, A)), k.closePath(), y.holes.push(k);
  }
  return y;
}
function Oi(t, y, g) {
  const k = new pt();
  k.name = "extrusion";
  const S = new Sa({ color: 8369151, transparent: true, opacity: 0.92, side: Lt }), A = new Sa({ color: 12623968, transparent: true, opacity: 0.85, side: Lt }), z = new Sa({ color: 11583173, transparent: true, opacity: 0.85, side: Lt }), $ = new pt();
  $.add(new Vs(16777215, 0.55));
  const P = new Qo(16777215, 0.75);
  P.position.set(30, 25, 40);
  const L = new Qo(16777215, 0.35);
  L.position.set(-25, -20, 15), $.add(P, L);
  let Y = 0;
  return ue.derive(() => {
    var _a, _b, _c, _d, _e;
    const N = ((_a = y.extruded) == null ? void 0 : _a.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++Y, on: N }, k.visible = N;
    for (const se of [...k.children]) se !== $ && (k.remove(se), (_c = (_b = se.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (k.children.includes($) || k.add($), !N) return;
    const ee = g.val ?? [], U = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], me = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, Q = me.sectionShapes ?? /* @__PURE__ */ new Map(), q = me.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      U.forEach((se, xe) => {
        var _a2, _b2, _c2;
        if (se.length === 2) {
          let he = Wi(Q.get(xe)), ye = true;
          if (he || (he = Hi((_a2 = me.areas) == null ? void 0 : _a2.get(xe), (_b2 = me.momentsOfInertiaY) == null ? void 0 : _b2.get(xe), (_c2 = me.momentsOfInertiaZ) == null ? void 0 : _c2.get(xe)), ye = false), !he) return;
          const de = ee[se[0]], K = ee[se[1]];
          if (!de || !K) return;
          const Z = Math.hypot(K[0] - de[0], K[1] - de[1], K[2] - de[2]);
          if (Z < 1e-9) return;
          const R = new ki(Ji(he), { depth: Z, bevelEnabled: false, curveSegments: 4 });
          R.applyMatrix4(new ea().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const G = new dt(R, ye ? S : A);
          G.position.set(de[0], de[1], de[2]), G.rotation.setFromRotationMatrix(jo(de, K)), k.add(G);
          return;
        }
        if (se.length === 3 || se.length === 4) {
          const he = q.get(xe);
          if (!he || he <= 0) return;
          const ye = se.map((ge) => ee[ge]).filter(Boolean);
          if (ye.length < 3) return;
          const de = [ye[1][0] - ye[0][0], ye[1][1] - ye[0][1], ye[1][2] - ye[0][2]], K = [ye[2][0] - ye[0][0], ye[2][1] - ye[0][1], ye[2][2] - ye[0][2]], Z = de[1] * K[2] - de[2] * K[1], R = de[2] * K[0] - de[0] * K[2], G = de[0] * K[1] - de[1] * K[0], X = Math.hypot(Z, R, G);
          if (X < 1e-12) return;
          const T = [Z / X, R / X, G / X], H = [], pe = (ge) => ye.map((ve) => [ve[0] + T[0] * ge, ve[1] + T[1] * ge, ve[2] + T[2] * ge]), fe = Math.abs(T[2]) > 0.5, oe = T[2] > 0 ? -1 : 1, W = pe(fe ? 0 : +he / 2), Me = pe(fe ? oe * he : -he / 2), te = (ge, ve, Pe) => H.push(...ge, ...ve, ...Pe);
          for (const ge of [W, Me]) te(ge[0], ge[1], ge[2]), ge.length === 4 && te(ge[0], ge[2], ge[3]);
          for (let ge = 0; ge < ye.length; ge++) {
            const ve = (ge + 1) % ye.length;
            te(W[ge], Me[ge], Me[ve]), te(W[ge], Me[ve], W[ve]);
          }
          const Ie = new Ve();
          Ie.setAttribute("position", new It(H, 3)), Ie.computeVertexNormals(), k.add(new dt(Ie, z));
        }
      });
    } catch (se) {
      ae = String((se == null ? void 0 : se.message) ?? se);
    }
    globalThis.__extrusionDebug = { corridas: Y, on: N, fallo: ae, nElementos: U.length, nFormas: Q.size, nEspesores: q.size, mallas: k.children.length - 1 };
  }), k;
}
function Bs(t, y, g = 0) {
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
function $a(t, y) {
  if (!y) return [0, 0];
  const g = Number(y[0] ?? 0), k = Number(y[1] ?? 0);
  return t === "bendingsY" ? [g, -k] : [-g, k];
}
function Ns(t, y) {
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
class Ko extends pt {
  constructor(y, g, k, S, A, z, $) {
    super();
    const P = new Mo().moveTo(0, 0).lineTo(0, z[1]).lineTo(k, z[1]).lineTo(k, 0).lineTo(0, 0), L = P.getPoints(), Y = new Ve().setFromPoints(L);
    this.lines = new Et(Y, new wt({ color: qn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const N = new Oo(P), ee = new xt({ color: z[1] > 0 ? 24435 : 11411474, side: Lt });
    this.mesh = new dt(N, ee), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Rt(`${A[1].toFixed(4)}`), this.normalizedResult = z, this.textPosition = _o([y, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(S), this.add(this.text);
  }
  updateScale(y) {
    this.lines.scale.set(1, y * 2, 1), this.mesh.scale.set(1, y * 2, 1), this.text.updateScale(y * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * y);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Aa extends pt {
  constructor(y, g, k, S, A, z, $) {
    super();
    const P = A[0] * k / (A[0] + A[1]), L = A[0] * A[1] > 0;
    if (this.text = new Rt(`${A[0].toFixed(4)}`), this.text2 = new Rt(`${(A[1] * -1).toFixed(4)}`), this.normalizedResult = z, this.textPosition = Ea(y, g), this.text2Position = Ea(g, y), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(S), this.text2.rotation.setFromRotationMatrix(S), this.add(this.text, this.text2), L) {
      const Y = new Mo().moveTo(0, 0).lineTo(0, z[0]).lineTo(P, 0).lineTo(0, 0), N = new Mo().moveTo(P, 0).lineTo(k, -z[1]).lineTo(k, 0).lineTo(P, 0), ee = Y.getPoints(), U = N.getPoints(), me = new Ve().setFromPoints(ee), Q = new Ve().setFromPoints(U), q = new wt({ color: qn().resultOutline });
      this.lines = new Et(me, q), this.lines2 = new Et(Q, q), this.lines.position.set(...y), this.lines2.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), this.lines2.rotation.setFromRotationMatrix(S), $ && this.lines.rotateX(Math.PI / 2), $ && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new Oo(Y), se = new Oo(N), xe = new xt({ color: z[0] > 0 ? 24435 : 11411474, side: Lt }), he = new xt({ color: -z[1] > 0 ? 24435 : 11411474, side: Lt });
      this.mesh = new dt(ae, xe), this.mesh2 = new dt(se, he), this.mesh.position.set(...y), this.mesh2.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), this.mesh2.rotation.setFromRotationMatrix(S), $ && this.mesh.rotateX(Math.PI / 2), $ && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const Y = new Mo().moveTo(0, 0).lineTo(0, z[0]).lineTo(k, -z[1]).lineTo(k, 0).lineTo(0, 0), N = Y.getPoints(), ee = new Ve().setFromPoints(N);
      this.lines = new Et(ee, new wt({ color: qn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), $ && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const U = new Oo(Y), me = new xt({ color: z[0] > 0 ? 24435 : 11411474, side: Lt });
      this.mesh = new dt(U, me), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), $ && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(y) {
    var _a, _b;
    this.lines.scale.set(1, y * 2, 1), (_a = this.lines2) == null ? void 0 : _a.scale.set(1, y * 2, 1), this.mesh.scale.set(1, y * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, y * 2, 1), this.text.updateScale(y * 0.6), this.text2.updateScale(y * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * y), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * y);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a = this.lines2) == null ? void 0 : _a.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Ys = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Ys || {});
function Qi(t, y, g, k) {
  const S = () => {
    const $ = g.rawVal;
    if (!($ == null ? void 0 : $.length)) return 0.05 * y.gridSize.rawVal;
    const P = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const N of $) for (let ee = 0; ee < 3; ee++) N[ee] < P[ee] && (P[ee] = N[ee]), N[ee] > L[ee] && (L[ee] = N[ee]);
    const Y = Math.hypot(L[0] - P[0], L[1] - P[1], L[2] - P[2]);
    return !isFinite(Y) || Y <= 0 ? 0.05 * y.gridSize.rawVal : 0.025 * Y;
  }, A = new pt(), z = { normals: Ko, shearsY: Ko, shearsZ: Ko, torsions: Ko, bendingsY: Aa, bendingsZ: Aa };
  return ue.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, g.val, y.frameResults.val == "none") return;
    A.children.forEach((P) => P.dispose()), A.clear();
    const $ = Ys[y.frameResults.rawVal];
    (_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.rawVal[$]) == null ? void 0 : _b.forEach((P, L) => {
      var _a2, _b2, _c, _d, _e, _f;
      const Y = ((_a2 = t.elements) == null ? void 0 : _a2.rawVal[L]) ?? [0, 1], N = g.rawVal[Y[0]], ee = g.rawVal[Y[1]];
      if (!N || !ee) return;
      const U = new F(...ee).distanceTo(new F(...N)), me = ji((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[$]), Q = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, L)) ?? 0, q = Bs(N, ee, Q), ae = Ns($, q), se = new F(...q.e1), xe = new F(...ae), he = new ea().makeBasis(se, xe, se.clone().cross(xe)), [ye, de] = $a($, P), K = z[$] === Aa ? [ye, -de] : [ye, de], Z = K.map((G) => G / (me === 0 ? 1 : me)), R = new z[$](N, ee, U, he, K, Z, false);
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
class el extends pt {
  constructor(y, g, k) {
    super();
    const S = g === Ia.reactions;
    k[0] && (this.xText1 = new Rt(`${S ? "Fx" : "Dx"}: ` + k[0].toFixed(4))), k[3] && (this.xText2 = new Rt(`${S ? "Mx" : "Rx"}: ` + k[3].toFixed(4))), k[1] && (this.yText1 = new Rt(`${S ? "Fy" : "Dy"}: ` + k[1].toFixed(4))), k[4] && (this.yText2 = new Rt(`${S ? "My" : "Ry"}: ` + k[4].toFixed(4))), k[2] && (this.zText1 = new Rt(`${S ? "Fz" : "Dz"}: ` + k[2].toFixed(4))), k[5] && (this.zText2 = new Rt(`${S ? "Mz" : "Rz"}: ` + k[5].toFixed(4))), (k[0] || k[3]) && (this.xArrow = new In(new F(1, 0, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (k[1] || k[4]) && (this.yArrow = new In(new F(0, 1, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (k[2] || k[5]) && (this.zArrow = new In(new F(0, 0, 1), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...y), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(y) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o2;
    (_a = this.xArrow) == null ? void 0 : _a.scale.set(y, y, y), (_b = this.yArrow) == null ? void 0 : _b.scale.set(y, y, y), (_c = this.zArrow) == null ? void 0 : _c.scale.set(y, y, y), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * y, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * y, 0, 0.5 * y), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * y, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * y, 0.5 * y), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * y), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * y + 0.5 * y), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * y), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * y), (_l2 = this.yText1) == null ? void 0 : _l2.updateScale(0.4 * y), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * y), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * y), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * y);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = this.xArrow) == null ? void 0 : _a.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var Ia = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(Ia || {});
function tl(t, y, g, k) {
  const S = new pt();
  return ue.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, y.nodeResults.val == "none") return;
    S.children.forEach(($) => $.dispose()), S.clear();
    const A = Ia[y.nodeResults.rawVal], z = 0.05 * y.gridSize.val;
    (_b = (_a = t.deformOutputs) == null ? void 0 : _a.val[A]) == null ? void 0 : _b.forEach(($, P) => {
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
  var _a;
  const L = new Pa(), Y = new Pi(), N = (e) => {
    const n = $.getBoundingClientRect(), a = e.clientX - n.left, o = e.clientY - n.top, s = n.width || 1, r = n.height || 1;
    if (!!window.__hekatanSplitMode) {
      const i = s / 2;
      if (a >= i) return Y.x = (a - i) / i * 2 - 1, Y.y = -(o / r) * 2 + 1, window.__hekatanSplitCamera ?? k();
      Y.x = a / i * 2 - 1;
    } else Y.x = a / s * 2 - 1;
    return Y.y = -(o / r) * 2 + 1, k();
  }, ee = new dt(new Vn(1e4, 1e4), new xt({ side: Lt, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, g.add(ee);
  const U = (e, n, a) => {
    const o = new dt(new Vn(1e4, 1e4), new xt({ side: Lt, transparent: true, opacity: 0, depthWrite: false }));
    return o.rotation.set(e, n, a), o.visible = false, o.frustumCulled = false, g.add(o), o;
  }, me = U(Math.PI / 2, 0, 0), Q = U(0, Math.PI / 2, 0);
  let q = false, ae = null, se = null, xe = null;
  const he = new Et(new Ve(), new wt({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  he.name = "ref-ifc-cadena", he.renderOrder = 1e3, he.frustumCulled = false, he.visible = false, g.add(he);
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
    const { S: n, adj: a } = e, o = (x, M) => new F(n[6 * x + 3 * M], n[6 * x + 3 * M + 1], n[6 * x + 3 * M + 2]), s = /* @__PURE__ */ new Set([e.s]), r = (x, M) => {
      const E = [];
      let _ = x, C = M;
      for (let I = 0; I < 3e3; I++) {
        const j = (a.get(ye(C.x, C.y, C.z)) || []).filter((we) => !s.has(we));
        if (j.length !== 1) break;
        const V = j[0], B = o(V, 0), O = o(V, 1), le = B.distanceTo(C) < O.distanceTo(C) ? O : B, be = C.clone().sub(_).normalize(), Ee = le.clone().sub(C).normalize();
        if (be.dot(Ee) < Math.cos(35 * Math.PI / 180)) break;
        s.add(V), E.push(le), _ = C, C = le;
      }
      return E;
    }, p = o(e.s, 0), i = o(e.s, 1), l = r(p, i), d = r(i, p), c = [...d.reverse(), p, i, ...l], m = d.length;
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
    he.geometry.dispose(), he.geometry = new Ve().setFromPoints(e), he.visible = true;
  }, R = (e) => {
    let n = 0;
    for (let m = 1; m < e.length - 1; m++) {
      const f = e[m].clone().sub(e[m - 1]).normalize(), h = e[m + 1].clone().sub(e[m]).normalize();
      n += Math.acos(Math.max(-1, Math.min(1, f.dot(h))));
    }
    const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (n < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const o = String(window.__hekatanArcModo ?? "angulo"), s = o === "x" ? 0 : o === "y" ? 1 : o === "z" ? 2 : -1, r = [0];
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
    const n = G.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(o * 9), r = new Float64Array(o * 3), p = new Int32Array(o * 3).fill(-1);
    if (a) {
      e.updateMatrixWorld();
      const l = new F();
      for (let b = 0; b < o * 3; b++) l.fromBufferAttribute(a, b).applyMatrix4(e.matrixWorld), s[3 * b] = l.x, s[3 * b + 1] = l.y, s[3 * b + 2] = l.z;
      const d = new F(), c = new F(), m = new F(), f = (b) => Math.round(s[3 * b] * 1e3) + "," + Math.round(s[3 * b + 1] * 1e3) + "," + Math.round(s[3 * b + 2] * 1e3), h = /* @__PURE__ */ new Map();
      for (let b = 0; b < o; b++) {
        const v = 3 * b;
        d.set(s[3 * (v + 1)] - s[3 * v], s[3 * (v + 1) + 1] - s[3 * v + 1], s[3 * (v + 1) + 2] - s[3 * v + 2]), c.set(s[3 * (v + 2)] - s[3 * v], s[3 * (v + 2) + 1] - s[3 * v + 1], s[3 * (v + 2) + 2] - s[3 * v + 2]), m.crossVectors(d, c).normalize(), r[3 * b] = m.x, r[3 * b + 1] = m.y, r[3 * b + 2] = m.z;
        for (let w = 0; w < 3; w++) {
          const u = f(v + w), x = f(v + (w + 1) % 3), M = u < x ? u + "|" + x : x + "|" + u, E = h.get(M);
          E ? E.push(b, w) : h.set(M, [b, w]);
        }
      }
      for (const b of h.values()) b.length === 4 && (p[3 * b[0] + b[1]] = b[2], p[3 * b[2] + b[3]] = b[0]);
    }
    const i = { V: s, N: r, vec: p, n: o };
    return G.set(e.id, i), i;
  }, T = new dt(new Ve(), new xt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Lt }));
  T.name = "ref-ifc-cara", T.renderOrder = 999, T.frustumCulled = false, T.visible = false, g.add(T);
  let H = null;
  const pe = (e, n) => {
    const a = Math.cos(12 * Math.PI / 180), o = Math.cos(80 * Math.PI / 180), s = [e.N[3 * n], e.N[3 * n + 1], e.N[3 * n + 2]], r = new Uint8Array(e.n), p = [], i = [n];
    for (r[n] = 1; i.length && p.length < 4e4; ) {
      const l = i.pop();
      p.push(l);
      for (let d = 0; d < 3; d++) {
        const c = e.vec[3 * l + d];
        if (c < 0 || r[c]) continue;
        const m = e.N[3 * l] * e.N[3 * c] + e.N[3 * l + 1] * e.N[3 * c + 1] + e.N[3 * l + 2] * e.N[3 * c + 2], f = s[0] * e.N[3 * c] + s[1] * e.N[3 * c + 1] + s[2] * e.N[3 * c + 2];
        m >= a && f >= o && (r[c] = 1, i.push(c));
      }
    }
    return p;
  }, fe = (e, n, a) => {
    if (!e || n < 0 || !a) {
      H && (H = null, T.visible = false);
      return;
    }
    if (H && H.m === e && H.tris.indexOf(n) >= 0) {
      H.punto = a.clone();
      return;
    }
    const o = X(e), s = pe(o, n), r = new Float32Array(s.length * 9), p = new F();
    let i = true;
    s.forEach((l, d) => {
      for (let c = 0; c < 9; c++) r[9 * d + c] = o.V[9 * l + c];
      p.x += o.N[3 * l], p.y += o.N[3 * l + 1], p.z += o.N[3 * l + 2];
    }), p.normalize();
    for (const l of s) if (p.x * o.N[3 * l] + p.y * o.N[3 * l + 1] + p.z * o.N[3 * l + 2] < Math.cos(5 * Math.PI / 180)) {
      i = false;
      break;
    }
    T.geometry.dispose(), T.geometry = new Ve(), T.geometry.setAttribute("position", new bt(r, 3)), T.material.color.set(i ? 3718648 : 16096779), T.visible = true, H = { m: e, t0: n, tris: s, normal: p, plana: i, punto: a.clone() };
  }, oe = (e, n) => {
    const a = new Uint8Array(e.n);
    for (const c of n) a[c] = 1;
    const o = (c) => Math.round(e.V[3 * c] * 1e3) + "," + Math.round(e.V[3 * c + 1] * 1e3) + "," + Math.round(e.V[3 * c + 2] * 1e3), s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const c of n) for (let m = 0; m < 3; m++) {
      const f = e.vec[3 * c + m];
      if (f >= 0 && a[f]) continue;
      const h = 3 * c + m, b = 3 * c + (m + 1) % 3, v = o(h), w = o(b);
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
  }, W = (e, n, a) => {
    const s = new Pa(n.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
    return s.length ? s[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, n, a, o = 2) => {
    const s = new F(e[0], e[1], e[2]), r = new F(n[0], n[1], n[2]).normalize();
    let p = null;
    for (const i of [1, -1]) {
      const d = new Pa(s, r.clone().multiplyScalar(i), 0, o).intersectObjects(a, false);
      d.length && (p == null || d[0].distance < p) && (p = d[0].distance);
    }
    return p;
  }, window.__hekatanCaraIfc = () => H ? { tris: H.tris.length, plana: H.plana, normal: H.normal.toArray(), punto: H.punto.toArray(), contorno: oe(X(H.m), H.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const Me = /* @__PURE__ */ new Map(), te = new nn(new Ve(), new wt({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  te.name = "ref-ifc-bordes", te.frustumCulled = false, te.visible = false, g.add(te);
  const Ie = 1, ge = (e, n, a) => Math.floor(e / Ie) + "," + Math.floor(n / Ie) + "," + Math.floor(a / Ie), ve = (e) => {
    const n = Me.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = [], s = /* @__PURE__ */ new Map();
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
        const _ = o.length / 6;
        o.push(i[3 * x], i[3 * x + 1], i[3 * x + 2], i[3 * M], i[3 * M + 1], i[3 * M + 2]);
        for (const [C, I, j] of [[i[3 * x], i[3 * x + 1], i[3 * x + 2]], [i[3 * M], i[3 * M + 1], i[3 * M + 2]], [(i[3 * x] + i[3 * M]) / 2, (i[3 * x + 1] + i[3 * M + 1]) / 2, (i[3 * x + 2] + i[3 * M + 2]) / 2]]) {
          const V = ge(C, I, j), B = s.get(V);
          B ? B[B.length - 1] !== _ && B.push(_) : s.set(V, [_]);
        }
      }
    }
    const r = { segs: new Float32Array(o), celdas: s };
    return Me.set(e.id, r), r;
  };
  let Pe = "";
  const Xe = (e) => {
    const n = e.map((p) => p.id).join(",");
    if (n === Pe) return;
    Pe = n;
    const a = e.map((p) => ve(p).segs);
    let o = 0;
    for (const p of a) o += p.length;
    const s = new Float32Array(o);
    let r = 0;
    for (const p of a) s.set(p, r), r += p.length;
    te.geometry.dispose(), te.geometry = new Ve(), te.geometry.setAttribute("position", new bt(s, 3)), te.visible = o > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    te.visible = Pe !== "" && window.__hekatanRefIfcBordes !== false, P();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const n of Me.values()) e += n.segs.length / 6;
    return e;
  };
  const Ae = (e, n) => {
    const a = window.__hekatanCursorPx;
    if (!a) return null;
    const o = ve(e), s = o.segs, r = Math.floor(n.x / Ie), p = Math.floor(n.y / Ie), i = Math.floor(n.z / Ie), l = /* @__PURE__ */ new Set();
    let d = En, c = null, m = En, f = null, h = -1;
    const b = new F(), v = new F();
    for (let w = -1; w <= 1; w++) for (let u = -1; u <= 1; u++) for (let x = -1; x <= 1; x++) {
      const M = o.celdas.get(r + w + "," + (p + u) + "," + (i + x));
      if (M) for (const E of M) {
        if (l.has(E)) continue;
        l.add(E);
        const _ = 6 * E;
        b.set(s[_], s[_ + 1], s[_ + 2]), v.set(s[_ + 3], s[_ + 4], s[_ + 5]);
        const C = Xn(b.x, b.y, b.z), I = Xn(v.x, v.y, v.z);
        if (!C || !I) continue;
        const j = Math.hypot(C.x - a.x, C.y - a.y), V = Math.hypot(I.x - a.x, I.y - a.y);
        j < d && (d = j, c = b.clone()), V < d && (d = V, c = v.clone());
        const B = I.x - C.x, O = I.y - C.y, le = B * B + O * O || 1e-9;
        let be = ((a.x - C.x) * B + (a.y - C.y) * O) / le;
        be = Math.max(0, Math.min(1, be));
        const Ee = Math.hypot(a.x - (C.x + be * B), a.y - (C.y + be * O));
        Ee < m && (m = Ee, f = b.clone().lerp(v, be), h = E);
      }
    }
    return h >= 0 && (o.adj || (o.adj = de(o.segs)), se = { S: o.segs, adj: o.adj, s: h }), c ? { tipo: "ifcVert", punto: c } : f ? { tipo: "ifcEdge", punto: f } : null;
  }, nt = () => {
    var _a2, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((r) => {
      var _a3;
      ((_a3 = r.userData) == null ? void 0 : _a3.refIfc) && r.isMesh && e.push(r);
    }), !e.length) return te.visible = false, Pe = "", null;
    Xe(e);
    const n = L.intersectObjects(e, false).filter((r) => {
      const p = r.object.material;
      return (p && p.clippingPlanes || []).every((l) => l.distanceToPoint(r.point) >= 0);
    });
    if (!n.length) return null;
    const a = n[0], o = n[1];
    ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "ifcface" ? fe(a.object, a.faceIndex ?? -1, a.point) : H && fe(null, -1, null);
    const s = Ae(a.object, a.point);
    if (s) return ae = { tipo: s.tipo }, [{ ...a, point: s.punto }];
    if (o && o.object === a.object && o.distance - a.distance <= 1.2) {
      const r = a.point.clone().add(o.point).multiplyScalar(0.5);
      return ae = { tipo: "ifcAxis" }, [{ ...a, point: r }];
    }
    return ae = { tipo: "ifc" }, [a];
  };
  let st = "", Ue = new Float32Array(0);
  const D = new nn(new Ve(), new wt({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  D.name = "ref-ifc-seccion", D.renderOrder = 998, D.frustumCulled = false, D.visible = false, g.add(D);
  const J = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return D.visible = false, Ue = new Float32Array(0);
    const n = [];
    e.enableX && n.push([0, +e.posX]), e.enableY && n.push([1, +e.posY]), e.enableZ && n.push([2, +e.posZ]);
    const a = [];
    g.traverse((r) => {
      var _a2;
      ((_a2 = r.userData) == null ? void 0 : _a2.refIfc) && r.isMesh && a.push(r);
    });
    const o = JSON.stringify(n) + "|" + a.map((r) => r.id).join(",");
    if (o === st) return Ue;
    st = o;
    const s = [];
    if (n.length && a.length) {
      const r = [new F(), new F(), new F()];
      for (const p of a) {
        const i = p.geometry.getAttribute("position");
        if (i) {
          p.updateMatrixWorld();
          for (let l = 0; l + 2 < i.count; l += 3) {
            for (let d = 0; d < 3; d++) r[d].fromBufferAttribute(i, l + d).applyMatrix4(p.matrixWorld);
            for (const [d, c] of n) {
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
    return Ue = new Float32Array(s), D.geometry.dispose(), D.geometry = new Ve(), D.geometry.setAttribute("position", new bt(Ue, 3)), D.visible = Ue.length > 0, Ue;
  };
  let re = null, ie = null;
  const _e = (e, n) => {
    const a = J();
    if (!a.length) return null;
    let o = En * 2, s = null, r = -1;
    const p = new F(), i = new F();
    for (let l = 0; l + 5 < a.length; l += 6) {
      p.set(a[l], a[l + 1], a[l + 2]), i.set(a[l + 3], a[l + 4], a[l + 5]);
      const d = Xn(p.x, p.y, p.z), c = Xn(i.x, i.y, i.z);
      if (!d || !c) continue;
      const m = c.x - d.x, f = c.y - d.y, h = m * m + f * f || 1e-9;
      let b = ((e - d.x) * m + (n - d.y) * f) / h;
      b = Math.max(0, Math.min(1, b));
      const v = Math.hypot(e - (d.x + b * m), n - (d.y + b * f));
      v < o && (o = v, s = p.clone().lerp(i, b), r = l / 6);
    }
    return r >= 0 && (ie !== a && (re = de(a), ie = a), se = { S: a, adj: re, s: r }), s;
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
    if (me.visible = !!window.__hekatanGridPlaneXZ, Q.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Wt.visible) {
      const o = L.intersectObjects([Wt, Ot, wn], false);
      if (o.length > 0) return o;
    }
    const a = [ee];
    return me.visible && a.push(me), Q.visible && a.push(Q), Pn.visible && Wn.length > 0 && a.push(...Wn), L.intersectObjects(a, false);
  }, Le = new Ho(new Ve(), new Jo()), Qe = new Ho(new Ve(), new Jo({ color: "gray", sizeAttenuation: false, size: 6 })), Ke = new Ho(new Ve(), new Jo({ color: "orange", sizeAttenuation: false, size: 5 }));
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
  let qe = null, rt = null, et = false;
  const Mt = new F(), gt = (e, n, a, o, s, r) => {
    const p = o - e, i = s - n, l = r - a, d = Math.hypot(p, i, l);
    if (d < 0.01) {
      ze.style.display = "none";
      return;
    }
    qe = [e, n, a], rt = [p / d, i / d, l / d], Mt.set((e + o) / 2, (n + s) / 2, (a + r) / 2), Mt.project(k());
    const c = $.getBoundingClientRect(), m = c.left + (Mt.x * 0.5 + 0.5) * c.width, f = c.top + (-Mt.y * 0.5 + 0.5) * c.height;
    ze.style.left = m + "px", ze.style.top = f + "px", ze.style.display = "block";
    const h = new F(e, n, a).project(k()), b = new F(o, s, r).project(k()), v = c.left + (h.x * 0.5 + 0.5) * c.width, w = c.top + (-h.y * 0.5 + 0.5) * c.height, u = c.left + (b.x * 0.5 + 0.5) * c.width, x = c.top + (-b.y * 0.5 + 0.5) * c.height;
    let M = Math.atan2(-(x - w), u - v) * 180 / Math.PI;
    if (M < 0 && (M += 360), Ne.textContent = `${Math.round(M) % 360}\xB0`, Ne.style.left = u + "px", Ne.style.top = x + 34 + "px", Ne.style.display = "block", !et) {
      if (ze.value = `${d.toFixed(2)} m`, document.activeElement !== ze) {
        const E = document.activeElement;
        E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA") && E !== ze || ze.focus({ preventScroll: true });
      }
      try {
        ze.select();
      } catch {
      }
    }
  }, fn = () => {
    ze.style.display = "none", Ne.style.display = "none", qe = null, rt = null, et = false, document.activeElement === ze && ze.blur();
  }, kt = (e) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (n === "offset") {
      Un = e, ce(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), ze.blur();
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
      At = e, ce(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[n]}.`), ze.blur();
      return;
    }
    if (!qe || !rt || !t.polylines) return;
    let a = rt[0], o = rt[1], s = rt[2];
    Ct === "x" ? (a = Math.sign(a) || 1, o = 0, s = 0) : Ct === "y" ? (a = 0, o = Math.sign(o) || 1, s = 0) : Ct === "z" && (a = 0, o = 0, s = Math.sign(s) || 1);
    const r = qe[0] + a * e, p = qe[1] + o * e, i = qe[2] + s * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [r, p, i]];
    const l = t.polylines.rawVal, d = l.length ? l[l.length - 1] : [];
    t.polylines.val = [...l.slice(0, -1), [...d, t.points.rawVal.length - 1]], ze.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    P();
  }, Te = (e) => {
    let n = e.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!n) return null;
    const a = n.startsWith("@");
    if (a && (n = n.slice(1)), n.includes("<")) {
      const s = n.split("<").map((r) => parseFloat(r.trim()));
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
    if (n.includes(",")) {
      const s = n.split(",").map((l) => parseFloat(l.trim()));
      if (s.some(isNaN)) return null;
      const [r, p, i = 0] = s;
      return a ? { kind: "relCart", dx: r, dy: p, dz: i } : { kind: "absCart", x: r, y: p, z: i };
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
    var _a2, _b;
    ga(new F(e[0], e[1], e[2]), null), qe = e, et = false;
    try {
      ze.select();
    } catch {
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    P();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (e) => {
    var _a2;
    const n = Te(e);
    if (!n) return false;
    if (n.kind === "length") return kt(n.L), true;
    const a = ot(n);
    if (!a) return false;
    ga(new F(a[0], a[1], a[2]), null), qe = a, ze.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, ze.addEventListener("keydown", (e) => {
    var _a2, _b, _c;
    if (e.key === "Enter") {
      if (e.preventDefault(), !et) {
        (_a2 = window.__hekatanFinalizeDraw) == null ? void 0 : _a2.call(window);
        try {
          (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c.call(_b, "select");
        } catch {
        }
        return;
      }
      const a = Te(ze.value);
      if (!a) return;
      if (et = false, a.kind === "length") kt(a.L), ce(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
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
    if (!qe || !rt || document.activeElement === ze) return;
    const n = document.activeElement;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (ze.value = e.key, ze.focus(), ze.setSelectionRange(1, 1), e.preventDefault());
  });
  const Fe = document.createElement("div");
  Fe.id = "hk-coord-readout", Fe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Fe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Fe);
  const De = document.createElement("div");
  De.id = "hk-coord-fixed", De.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", De.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(De);
  const We = new Et(new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new ao({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  We.frustumCulled = false, We.visible = false, We.name = "rubberBand", g.add(We), window.__hekatanRubberBand = We;
  const Be = new Et(new Ve(), new wt({ color: 2282478, transparent: true, opacity: 0.9 }));
  Be.frustumCulled = false, Be.visible = false, g.add(Be);
  let at = [];
  const lt = new Et(new Ve(), new wt({ color: 16763904, transparent: true, opacity: 0.95 }));
  lt.frustumCulled = false, lt.visible = false, lt.renderOrder = 999, g.add(lt);
  let ht = [];
  const tt = document.createElement("div");
  tt.id = "hk-measure-label", tt.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(tt);
  const ct = (e) => {
    var _a2, _b;
    const n = N(e);
    if (!n) return null;
    L.setFromCamera(Y, n);
    let a = null, o = null;
    const s = L.intersectObjects(g.children, true).filter((f) => f.object.isMesh && f.object !== vt && f.object !== ut && f.object.visible !== false);
    if (s.length) {
      const f = s[0], h = f.point;
      a = [h.x, h.y, h.z];
      const v = (_b = (_a2 = f.object.geometry) == null ? void 0 : _a2.attributes) == null ? void 0 : _b.position;
      v && f.face && (o = [f.face.a, f.face.b, f.face.c].map((w) => {
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
      const h = new F(f[0], f[1], f[2]).project(n);
      return [r.left + (h.x * 0.5 + 0.5) * r.width, r.top + (-h.y * 0.5 + 0.5) * r.height];
    }, i = [e.clientX, e.clientY], l = 14;
    let d = a, c = l;
    const m = (f) => {
      const h = p(f), b = Math.hypot(h[0] - i[0], h[1] - i[1]);
      b < c && (c = b, d = f);
    };
    for (const f of o ?? []) m(f);
    for (const f of t.points.rawVal) m(f);
    return d;
  }, $t = () => {
    if (ht.length < 1) {
      tt.style.display = "none";
      return;
    }
    const e = k(), n = ht[0], a = ht[1] ?? ht[0], s = new F((n[0] + a[0]) / 2, (n[1] + a[1]) / 2, (n[2] + a[2]) / 2).clone().project(e), r = $.getBoundingClientRect();
    tt.style.left = r.left + (s.x * 0.5 + 0.5) * r.width + "px", tt.style.top = r.top + (-s.y * 0.5 + 0.5) * r.height - 14 + "px", tt.style.display = "block";
  };
  window.__hekatanMeasureRefresh = $t, window.__hekatanClearMeasure = () => {
    ht = [], lt.visible = false, tt.style.display = "none";
    try {
      P();
    } catch {
    }
  };
  try {
    (_a = S.addEventListener) == null ? void 0 : _a.call(S, "change", $t);
  } catch {
  }
  const ut = new dt(new Ve(), new xt({ color: 16096779, transparent: true, opacity: 0.35, side: Lt, depthWrite: false }));
  ut.frustumCulled = false, ut.visible = false, ut.renderOrder = 998, ut.name = "hk-fill-preview", g.add(ut), $.addEventListener("pointerleave", () => {
    Fe.style.display = "none", ut.visible && (ut.visible = false, P());
  });
  const Kt = (e) => {
    var _a2, _b, _c, _d;
    const n = t.points.rawVal, a = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Map(), s = (w, u) => {
      w !== u && ((o.get(w) ?? o.set(w, /* @__PURE__ */ new Set()).get(w)).add(u), (o.get(u) ?? o.set(u, /* @__PURE__ */ new Set()).get(u)).add(w));
    };
    for (const w of a) for (let u = 0; u + 1 < w.length; u++) s(w[u], w[u + 1]);
    const r = (w, u) => {
      var _a3;
      return !!((_a3 = o.get(w)) == null ? void 0 : _a3.has(u));
    }, p = [], i = /* @__PURE__ */ new Set(), l = [...o.keys()];
    for (const w of l) for (const u of o.get(w)) if (!(u < w)) {
      for (const x of o.get(u)) if (x !== w) for (const M of o.get(x)) {
        if (M === w || M === u || !r(M, w) || r(w, x) || r(u, M)) continue;
        const E = [w, u, x, M].slice().sort((_, C) => _ - C).join("-");
        i.has(E) || (i.add(E), p.push([w, u, x, M]));
      }
    }
    for (const w of l) for (const u of o.get(w)) if (!(u < w)) for (const x of o.get(u)) {
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
      const u = w.map((M) => c(n[M]));
      if (!f(m, u)) continue;
      const x = h(u);
      x < v && (v = x, b = w);
    }
    return b;
  }, St = new pt(), Xt = new dt(new Vn(1, 1), new xt({ color: 2282478, transparent: true, opacity: 0.08, side: Lt, depthWrite: false })), on = new nn(new ys(new Vn(1, 1)), new wt({ color: 2282478, transparent: true, opacity: 0.85 })), zt = new nn(new Ve(), new wt({ color: 2282478, transparent: true, opacity: 0.3 })), So = (e, n) => {
    const a = [], o = Math.ceil(e / n);
    for (let s = -o; s <= o; s++) {
      const r = s * n;
      a.push(-e, r, 0, e, r, 0), a.push(r, -e, 0, r, e, 0);
    }
    zt.geometry.dispose(), zt.geometry = new Ve(), zt.geometry.setAttribute("position", new It(a, 3));
  };
  St.add(Xt, on, zt), St.visible = false, St.frustumCulled = false, g.add(St);
  const Ut = new pt();
  Ut.frustumCulled = false, Ut.visible = false, g.add(Ut);
  const Rn = (e) => {
    const n = new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), a = new ao({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Et(n, a);
  }, _n = Rn(16711680), hn = Rn(65280), Tn = Rn(35071);
  Ut.add(_n, hn, Tn);
  const Gn = [], na = (e) => e.traverse((n) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = n.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Zt = Rn(16761856);
  Zt.material.dashSize = 0.28, Zt.material.gapSize = 0.16, Zt.material.opacity = 0.9, Zt.frustumCulled = false, Zt.visible = false, Zt.renderOrder = 98, g.add(Zt);
  const io = (e) => {
    const n = new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0)]), a = new wt({ color: e, transparent: true, opacity: 0.2, depthTest: false }), o = new $s(n, a);
    return o.renderOrder = 997, o.frustumCulled = false, o;
  }, Dn = io(3462041), Kn = io(16724804), Bn = io(6333946), mn = new pt();
  mn.frustumCulled = false, mn.visible = false, g.add(mn), mn.add(Dn, Kn, Bn);
  const lo = (e) => {
    const n = new Vn(1, 1), a = new xt({ color: e, transparent: true, opacity: 0.06, side: Lt, depthWrite: false }), o = new dt(n, a);
    return o.frustumCulled = false, o.renderOrder = 996, o;
  }, Wt = lo(3462041), Ot = lo(16724804), wn = lo(6333946);
  mn.add(Wt, Ot, wn);
  const kn = (e, n, a, o) => {
    e.scale.set(2 * o, 2 * o, 1), a === "xy" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, 0, 0)) : a === "xz" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, yn = document.createElement("div");
  yn.id = "hk-refplane-badge", yn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(yn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = e, mn.visible = e, e) {
      const n = window.__hekatanOrthoAnchor, a = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0], p = window.__hekatanOrthoExt ?? 8;
      Sn(Dn, r, "xy", p), Sn(Kn, r, "xz", p), Sn(Bn, r, "yz", p), kn(Wt, r, "xy", p), kn(Ot, r, "xz", p), kn(wn, r, "yz", p), Wt.material.opacity = 0.05, Ot.material.opacity = 0.05, wn.material.opacity = 0.05;
    } else {
      const n = document.getElementById("hk-refplane-badge");
      n && (n.style.display = "none");
    }
    P();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a2;
    if (window.__hekatanOrthoExt = e, !mn.visible) {
      P();
      return;
    }
    const n = window.__hekatanOrthoAnchor, a = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], r = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0];
    Sn(Dn, r, "xy", e), Sn(Kn, r, "xz", e), Sn(Bn, r, "yz", e), kn(Wt, r, "xy", e), kn(Ot, r, "xz", e), kn(wn, r, "yz", e), P();
  };
  const Ra = (e) => {
    if (Wt.material.opacity = e === "xy" ? 0.09 : 0.025, Ot.material.opacity = e === "xz" ? 0.09 : 0.025, wn.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      yn.style.background = s.bg, yn.style.color = s.text, yn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, yn.style.display = "block";
    } else yn.style.display = "none";
  }, Sn = (e, n, a, o) => {
    let s;
    a === "xy" ? s = [new F(n[0] - o, n[1] - o, n[2]), new F(n[0] + o, n[1] - o, n[2]), new F(n[0] + o, n[1] + o, n[2]), new F(n[0] - o, n[1] + o, n[2]), new F(n[0] - o, n[1] - o, n[2])] : a === "xz" ? s = [new F(n[0] - o, n[1], n[2] - o), new F(n[0] + o, n[1], n[2] - o), new F(n[0] + o, n[1], n[2] + o), new F(n[0] - o, n[1], n[2] + o), new F(n[0] - o, n[1], n[2] - o)] : s = [new F(n[0], n[1] - o, n[2] - o), new F(n[0], n[1] + o, n[2] - o), new F(n[0], n[1] + o, n[2] + o), new F(n[0], n[1] - o, n[2] + o), new F(n[0], n[1] - o, n[2] - o)], e.geometry.setFromPoints(s);
  };
  let Ct = null;
  window.__hekatanAxisLock = () => Ct;
  let ro = null, Tt = null;
  const Dt = document.createElement("div");
  Dt.id = "hk-axis-lock-badge", Dt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Dt);
  const Ta = () => {
    if (!Ct) {
      Dt.style.display = "none";
      return;
    }
    const e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Dt.style.background = "rgba(15,23,42,0.92)", Dt.style.color = e[Ct], Dt.style.border = `1.5px solid ${e[Ct]}`, Dt.textContent = `\u{1F512} LOCK ${Ct.toUpperCase()}`, Dt.style.display = "block";
  };
  window.addEventListener("keydown", (e) => {
    var _a2, _b, _c, _d, _e2, _f;
    const n = document.activeElement;
    if (n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n !== ze) return;
    const a = e.key.toLowerCase(), o = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && o === "polyarea" && at.length >= 3) {
      const s = Lo();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Ct = Ct === a ? null : a, Ta(), e.preventDefault();
    else if (e.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), ls(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || Yo(), ce(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (Ut.visible = false), ce(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a2;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const e = window.__hekatanOrthoMode;
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
      let n = document.getElementById("hk-ortho-frame");
      n || (n = document.createElement("div"), n.id = "hk-ortho-frame", n.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(n)), n.style.display = e ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = e ? "block" : "none";
    }
  };
  const Po = new F(), zo = new F(), Da = new F(), Xs = (e) => {
    if (!Ct) return null;
    const n = e[0], a = e[1], o = e[2];
    return Ct === "x" ? (Po.set(n - 1e4, a, o), zo.set(n + 1e4, a, o)) : Ct === "y" ? (Po.set(n, a - 1e4, o), zo.set(n, a + 1e4, o)) : (Po.set(n, a, o - 1e4), zo.set(n, a, o + 1e4)), L.ray.distanceSqToSegment(Po, zo, null, Da), Da;
  };
  window.__hekatanProjectOnAxis = Xs;
  const qt = new Et(new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new wt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  qt.renderOrder = 998, qt.frustumCulled = false, qt.visible = false, g.add(qt);
  let un = -1, An = -1, Fn = -1;
  const Je = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Je;
  const xn = new Et(new Ve().setFromPoints([new F(), new F()]), new wt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  xn.renderOrder = 997, xn.frustumCulled = false, xn.visible = false, g.add(xn);
  const an = new dt(new so(0.02, 12, 12), new xt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  an.renderOrder = 998, an.visible = false, g.add(an);
  const Co = (e) => {
    const n = k();
    if (n.isOrthographicCamera) {
      const o = n, s = (o.top - o.bottom) / o.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = n.position.distanceTo(e);
    return Math.max(0.05, a / 10);
  }, Ba = () => {
    an.visible && an.scale.setScalar(Co(an.position));
  }, gn = new pt();
  gn.frustumCulled = false, g.add(gn);
  const Ao = 2282478;
  let bn = null;
  const Us = (e, n, a, o) => {
    if (!t.points) return -1;
    const s = t.points.rawVal;
    let r = -1, p = o;
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      if (!l) continue;
      const d = Math.hypot(e - l[0], n - l[1], a - l[2]);
      d < p && (p = d, r = i);
    }
    return r;
  }, sn = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; gn.children.length; ) {
      const p = gn.children.pop();
      (_b = (_a2 = p.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = p.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], n = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], o = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const p of Je) {
      const [i, ...l] = p.split(":");
      if (i === "pt") {
        const d = e[+l[0]];
        if (!d) continue;
        const c = new dt(new so(0.025, 12, 12), new xt({ color: Ao, transparent: true, opacity: 0.9, depthTest: false }));
        c.position.set(d[0], d[1], d[2]), c.renderOrder = 999, c.__isSelectionPt = true, gn.add(c);
      } else if (i === "seg") {
        const d = n[+l[0]], c = e[d == null ? void 0 : d[+l[1]]], m = e[d == null ? void 0 : d[+l[1] + 1]];
        if (!c || !m) continue;
        const f = new Ve().setFromPoints([new F(c[0], c[1], c[2]), new F(m[0], m[1], m[2])]), h = new Et(f, new wt({ color: Ao, transparent: true, opacity: 0.95, depthTest: false }));
        h.renderOrder = 999, gn.add(h);
      } else if (i === "poly") {
        const c = n[+l[0]].map((h) => {
          const b = e[h];
          return b ? new F(b[0], b[1], b[2]) : null;
        }).filter(Boolean);
        if (c.length < 2) continue;
        const m = new Ve().setFromPoints(c), f = new Et(m, new wt({ color: Ao, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, gn.add(f);
      } else if (i === "aux") {
        const d = o[+l[0]];
        if (!d || d.length !== 6) continue;
        const c = new Ve().setFromPoints([new F(d[0], d[1], d[2]), new F(d[3], d[4], d[5])]), m = new Et(c, new wt({ color: Ao, transparent: true, opacity: 0.95, depthTest: false }));
        m.renderOrder = 999, gn.add(m);
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
  window.__hekatanRefreshSelection = sn, window.__hekatanSelectIds = (e) => {
    var _a2;
    Je.clear();
    for (const n of e) Je.add(n);
    try {
      (_a2 = window.__hekatanRefreshSelection) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return P(), Je.size;
  }, window.__hekatanClearSelection = () => {
    Je.clear(), sn();
  };
  const co = (e, n, a, o, s, r, p, i, l) => {
    const d = p - o, c = i - s, m = l - r, f = d * d + c * c + m * m;
    if (f < 1e-12) return Math.hypot(e - o, n - s, a - r);
    let h = ((e - o) * d + (n - s) * c + (a - r) * m) / f;
    h = Math.max(0, Math.min(1, h));
    const b = o + h * d, v = s + h * c, w = r + h * m;
    return Math.hypot(e - b, n - v, a - w);
  }, oa = (e, n, a, o) => {
    if (!t.polylines) return null;
    const s = t.polylines.rawVal, r = t.points.rawVal;
    let p = -1, i = -1, l = o;
    for (let d = 0; d < s.length; d++) {
      const c = s[d];
      for (let m = 0; m < c.length - 1; m++) {
        const f = r[c[m]], h = r[c[m + 1]];
        if (!f || !h) continue;
        const b = co(e, n, a, f[0], f[1], f[2], h[0], h[1], h[2]);
        b < l && (l = b, p = d, i = m);
      }
    }
    return p >= 0 ? { polyIdx: p, segIdx: i, dist: l } : null;
  }, Na = (e, n, a, o) => {
    const s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let p = -1, i = o;
    for (let l = 0; l < r.length; l++) {
      const d = r[l];
      if (!d || d.length !== 6) continue;
      const c = co(e, n, a, d[0], d[1], d[2], d[3], d[4], d[5]);
      c < i && (i = c, p = l);
    }
    return p;
  }, Zs = (e) => {
    const n = window.__hekatanDrawingAuxLines, o = ((n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [])[e];
    if (!o || o.length !== 6) {
      qt.visible = false;
      return;
    }
    qt.geometry.setFromPoints([new F(o[0], o[1], o[2]), new F(o[3], o[4], o[5])]), qt.visible = true;
  }, qs = (e, n = -1) => {
    var _a2, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal[e], o = t.points.rawVal;
    if (!a || a.length < 2) {
      qt.visible = false;
      return;
    }
    const s = ((_b = (_a2 = t.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(e)) ?? false, r = [];
    if (s || n < 0 || n >= a.length - 1) for (const p of a) {
      const i = o[p];
      i && r.push(new F(i[0], i[1], i[2]));
    }
    else {
      const p = o[a[n]], i = o[a[n + 1]];
      p && r.push(new F(p[0], p[1], p[2])), i && r.push(new F(i[0], i[1], i[2]));
    }
    qt.geometry.setFromPoints(r), qt.visible = true;
  }, Fo = (e) => {
    var _a2;
    if (!t.polylines) return;
    const n = t.polylines.rawVal;
    if (e < 0 || e >= n.length) return;
    const a = n.filter((l, d) => d !== e), o = /* @__PURE__ */ new Set();
    for (const l of a) for (const d of l) o.add(d);
    const s = t.points.rawVal, r = /* @__PURE__ */ new Map(), p = [];
    for (let l = 0; l < s.length; l++) o.has(l) && (r.set(l, p.length), p.push(s[l]));
    const i = a.map((l) => l.map((d) => r.get(d)).filter((d) => d !== void 0));
    t.points.val = p, t.polylines.val = i, t.areas && (t.areas.val = t.areas.rawVal.filter((l) => l !== e).map((l) => l > e ? l - 1 : l)), qt.visible = false, un = -1, An = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, Ya = (e, n) => {
    var _a2, _b, _c;
    if (!t.polylines) return;
    const a = t.polylines.rawVal;
    if (e < 0 || e >= a.length) return;
    if (((_b = (_a2 = t.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      Fo(e);
      return;
    }
    const s = a[e];
    if (n < 0 || n >= s.length - 1) return;
    if (s.length === 2) {
      Fo(e);
      return;
    }
    let r;
    n === 0 ? r = [s.slice(1)] : n === s.length - 2 ? r = [s.slice(0, -1)] : r = [s.slice(0, n + 1), s.slice(n + 1)];
    const p = [...a.slice(0, e), ...r, ...a.slice(e + 1)], i = /* @__PURE__ */ new Set();
    for (const f of p) for (const h of f) i.add(h);
    const l = t.points.rawVal, d = /* @__PURE__ */ new Map(), c = [];
    for (let f = 0; f < l.length; f++) i.has(f) && (d.set(f, c.length), c.push(l[f]));
    const m = p.map((f) => f.map((h) => d.get(h)).filter((h) => h !== void 0));
    if (t.points.val = c, t.polylines.val = m, t.areas) {
      const f = r.length - 1;
      t.areas.val = t.areas.rawVal.map((h) => h > e ? h + f : h);
    }
    qt.visible = false, un = -1, An = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Le.geometry.setAttribute("position", new It(t.points.rawVal.flat(), 3)), Le.geometry.computeBoundingSphere(), Le.frustumCulled = false, Qe.frustumCulled = false, g.add(Qe), ee.position.set(0, 0, 0), ee.rotateX(Math.PI / 2), ee.geometry.rotateX(Math.PI / 2), ee.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, n, a) => {
    if (t.points.val = [...t.points.rawVal, [e, n, a]], t.polylines) {
      const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
      t.polylines.val = [...o.slice(0, -1), [...s, t.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a2;
    if (!t.polylines) return;
    const e = t.polylines.rawVal;
    ((_a2 = e[e.length - 1]) == null ? void 0 : _a2.length) !== 0 && (t.polylines.val = [...e, []]);
  };
  const Eo = [];
  window.__hekatanCirculos = Eo;
  let Xa = [], Ua = "";
  const Za = () => {
    var _a2;
    const e = t.points.rawVal, n = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${e.length}|${n.length}|${n.reduce((s, r) => s + r.length, 0)}`;
    if (a === Ua) return Xa;
    Ua = a;
    const o = [];
    for (const s of n) {
      const r = s.length;
      if (r < 6 || s[0] !== s[r - 1]) continue;
      const p = s.slice(0, r - 1).map((c) => e[c]).filter(Boolean);
      if (p.length < 5) continue;
      const i = [0, 1, 2].map((c) => p.reduce((m, f) => m + f[c], 0) / p.length), l = p.map((c) => Math.hypot(c[0] - i[0], c[1] - i[1], c[2] - i[2])), d = l.reduce((c, m) => c + m, 0) / l.length;
      d < 1e-9 || l.some((c) => Math.abs(c - d) > 5e-3 * d) || o.push({ c: i, r: d });
    }
    return Xa = o;
  };
  window.__hekatanCentrosDeducidos = Za;
  const $o = () => !!window.__hekatanCurvasAux, Vo = (e, n) => {
    const a = window.__hekatanDrawingAuxLines;
    if (!a) return 0;
    Pt();
    const o = a.rawVal ?? a.val ?? [], s = [];
    for (let r = 0; r + 1 < e.length; r++) s.push([...e[r], ...e[r + 1]]);
    return n && e.length > 2 && s.push([...e[e.length - 1], ...e[0]]), a.val = [...o, ...s], s.length;
  };
  window.__hekatanDrawCircle = (e, n, a, o, s = window.__hekatanArcSegs ?? 12, r = "xy") => {
    var _a2;
    const p = Math.max(4, Math.round(s)), i = t.points.rawVal.length, l = [];
    for (let d = 0; d < p; d++) {
      const c = 2 * Math.PI * d / p, m = o * Math.cos(c), f = o * Math.sin(c);
      let h;
      r === "xy" ? h = [e + m, n + f, a] : r === "xz" ? h = [e + m, n, a + f] : h = [e, n + m, a + f], l.push(h);
    }
    if (Eo.push({ c: [e, n, a], r: o }), $o()) {
      Vo(l, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...l], t.polylines) {
      const d = [...l.map((m, f) => i + f), i], c = t.polylines.rawVal;
      ((_a2 = c[c.length - 1]) == null ? void 0 : _a2.length) > 0 ? t.polylines.val = [...c, d, []] : t.polylines.val = [...c.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawArc = (e, n, a, o = window.__hekatanArcSegs ?? 12) => {
    var _a2;
    const s = Math.max(4, Math.round(o)), r = new F(...e), p = new F(...n), i = new F(...a), l = new F().subVectors(p, r), d = new F().subVectors(i, r), c = new F().crossVectors(l, d), m = 2 * c.lengthSq();
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
      const le = e[B], be = a[B], Ee = 512;
      let we = Math.abs(be - le) > 1e-9, $e = le;
      for (let ke = 1; ke <= Ee && we; ke++) {
        const Ge = j(_ * ke / Ee).getComponent(B);
        (Ge - $e) * (be - le) < -1e-9 && (we = false), $e = Ge;
      }
      if (we) {
        O = true;
        for (let ke = 0; ke <= s; ke++) {
          const Ge = le + (be - le) * ke / s;
          let Re = 0, Se = _;
          for (let He = 0; He < 60; He++) {
            const ft = (Re + Se) / 2;
            (j(ft).getComponent(B) - Ge) * (be - le) < 0 ? Re = ft : Se = ft;
          }
          const Ze = j((Re + Se) / 2);
          I.push([Ze.x, Ze.y, Ze.z]);
        }
        I[0] = [e[0], e[1], e[2]], I[s] = [a[0], a[1], a[2]];
      } else try {
        (_a2 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a2.call(window, `\u26A0 El arco no es mon\xF3tono en ${V.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!O) for (let le = 0; le <= s; le++) {
      const be = j(_ * (le / s));
      I.push([be.x, be.y, be.z]);
    }
    if (Eo.push({ c: [f.x, f.y, f.z], r: h }), $o()) {
      Vo(I, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...I], t.polylines) {
      const le = I.map((Ee, we) => C + we), be = t.polylines.rawVal;
      t.polylines.val = [...be.slice(0, -1), le, []];
    }
  };
  const qa = () => {
    var _a2;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    for (let n = e.length - 1; n >= 0; n--) if (e[n] && e[n].length >= 2) return { i: n, pl: e[n] };
    return null;
  };
  window.__hekatanDividir = (e) => {
    var _a2;
    const n = Math.round(e);
    if (!(n >= 2)) return { ok: false, msg: "el n\xFAmero de partes va de 2 en adelante" };
    const a = qa();
    if (!a) return { ok: false, msg: "no hay ninguna polil\xEDnea que dividir" };
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const o = [...t.points.rawVal], s = [a.pl[0]];
    let r = 0;
    for (let i = 0; i + 1 < a.pl.length; i++) {
      const l = o[a.pl[i]], d = o[a.pl[i + 1]];
      r += Math.hypot(d[0] - l[0], d[1] - l[1], d[2] - l[2]);
      for (let c = 1; c < n; c++) {
        const m = c / n;
        o.push([l[0] + (d[0] - l[0]) * m, l[1] + (d[1] - l[1]) * m, l[2] + (d[2] - l[2]) * m]), s.push(o.length - 1);
      }
      s.push(a.pl[i + 1]);
    }
    const p = [...t.polylines.rawVal];
    p[a.i] = s, t.points.val = o, t.polylines.val = p;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return P(), { ok: true, tramosAntes: a.pl.length - 1, tramosAhora: s.length - 1, nudosNuevos: s.length - a.pl.length, largo: +r.toFixed(4), tramoMedio: +(r / (s.length - 1)).toFixed(4) };
  }, window.__hekatanDesfasarCurva = (e) => {
    var _a2, _b, _c, _d;
    if (!isFinite(e) || Math.abs(e) < 1e-9) return { ok: false, msg: "la distancia no puede ser cero" };
    const n = qa();
    if (!n) return { ok: false, msg: "no hay ninguna polil\xEDnea que desfasar" };
    const a = t.points.rawVal, o = n.pl.map((h) => new F(...a[h])), s = String(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy"), r = new F(...s === "xz" ? [0, 1, 0] : s === "yz" ? [1, 0, 0] : [0, 0, 1]), p = (h, b) => {
      const v = new F().subVectors(b, h), w = new F().crossVectors(r, v);
      return w.lengthSq() < 1e-18 ? null : w.normalize();
    }, i = o.map((h, b) => {
      const v = b > 0 ? p(o[b - 1], o[b]) : null, w = b + 1 < o.length ? p(o[b], o[b + 1]) : null;
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
    o.forEach((h, b) => {
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
    for (let h = 0; h + 1 < o.length; h++) {
      const b = o[h], v = o[h + 1], w = p(b, v), u = new F(...l[d[h]]), x = Math.abs(new F().subVectors(u, b).dot(w));
      m = Math.min(m, x), f = Math.max(f, x);
    }
    return { ok: true, vertices: d.length, distancia: +e.toFixed(4), separacionMin: +m.toFixed(5), separacionMax: +f.toFixed(5) };
  }, window.__hekatanDrawCercha = (e) => {
    var _a2, _b;
    const n = e.luz, a = e.flecha, o = e.canto, s = Math.max(2, Math.round(e.panos)), r = e.tipo ?? "montantes", p = e.x0 ?? 0, i = e.y0 ?? 0, l = e.base ?? 0, d = Math.max(1, Math.round(e.copias ?? 1)), c = e.sep ?? 0;
    if (!(n > 0) || !(a > 0) || !(o > 0)) return { ok: false, msg: "luz, flecha y canto tienen que ser positivos" };
    const m = (n * n / 4 + a * a) / (2 * a);
    if (o >= m) return { ok: false, msg: `el canto (${o} m) no puede llegar al radio (${m.toFixed(3)} m)` };
    const f = 2 * Math.asin(Math.min(1, n / 2 / m)), h = l - (m - a), b = Math.atan2(l - h, p - (p + n / 2)), v = Math.atan2(l - h, p + n - (p + n / 2)), w = p + n / 2, u = (we, $e, ke) => [w + $e * Math.cos(we), ke, h + $e * Math.sin(we)];
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const x = [...t.points.rawVal], M = [...((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? []];
    M.length && M[M.length - 1].length === 0 && M.pop();
    const E = (we) => (x.push(we), x.length - 1), _ = (we, $e) => {
      M.push([we, $e]);
    }, C = [];
    let I = 0, j = 0;
    for (let we = 0; we < d; we++) {
      const $e = i + we * c, ke = [], Ge = [];
      for (let Re = 0; Re <= s; Re++) {
        const Se = b + (v - b) * (Re / s);
        ke.push(E(u(Se, m, $e))), Ge.push(E(u(Se, m - o, $e)));
      }
      C.push(ke), M.push([...ke]), M.push([...Ge]), _(ke[0], Ge[0]), _(ke[s], Ge[s]), j += 2;
      for (let Re = 1; Re < s; Re++) if ((r === "montantes" || r === "howe") && (_(ke[Re], Ge[Re]), j++), r === "warren") Re % 2 === 1 && (_(Ge[Re - 1], ke[Re]), _(ke[Re], Ge[Re + 1]), I += 2);
      else if (r === "howe") {
        const Se = Re < s / 2 ? 1 : -1;
        _(Ge[Re], ke[Re + Se]), I++;
      }
    }
    if (e.correas && d > 1) for (let we = 0; we + 1 < d; we++) for (let $e = 0; $e <= s; $e++) _(C[we][$e], C[we + 1][$e]);
    M.push([]), t.points.val = x, t.polylines && (t.polylines.val = M);
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    P();
    const V = (we, $e) => u(b + (v - b) * (we / s), $e, 0), B = (we, $e) => Math.hypot(we[0] - $e[0], we[1] - $e[1], we[2] - $e[2]), O = [], le = [], be = [];
    for (let we = 0; we < s; we++) {
      O.push(B(V(we, m), V(we + 1, m))), le.push(B(V(we, m - o), V(we + 1, m - o)));
      const $e = [V(we + 1, m)[0] - V(we, m - o)[0], 0, V(we + 1, m)[2] - V(we, m - o)[2]];
      be.push(Math.atan2($e[2], $e[0]) * 180 / Math.PI);
    }
    const Ee = (we) => +we.toFixed(3);
    return { ok: true, luz: Ee(n), flecha: Ee(a), canto: Ee(o), radio: Ee(m), anguloAbarcado: Ee(f * 180 / Math.PI), clave: Ee(l + a), centro: [Ee(w), Ee(i), Ee(h)], panos: s, tipo: r, cerchas: d, separacion: Ee(c), desarrolloSup: Ee(m * f), desarrolloInf: Ee((m - o) * f), tramoSupMin: Ee(Math.min(...O)), tramoSupMax: Ee(Math.max(...O)), tramoInfMin: Ee(Math.min(...le)), tramoInfMax: Ee(Math.max(...le)), anguloDiagMin: Ee(Math.min(...be)), anguloDiagMax: Ee(Math.max(...be)), montantes: j, diagonales: I, nudosNuevos: 2 * (s + 1) * d };
  }, window.__hekatanDrawPolinomio = (e, n = window.__hekatanArcSegs ?? 12) => {
    var _a2, _b, _c, _d;
    const a = e.length;
    if (a < 2) return { ok: false, msg: "faltan puntos" };
    const o = Math.max(a - 1, Math.round(n)), s = (_) => Math.max(...e.map((C) => C[_])) - Math.min(...e.map((C) => C[_])), r = [s(0), s(1), s(2)], p = String(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? ""), i = p === "xy" ? 2 : p === "xz" ? 1 : p === "yz" ? 0 : -1, l = i >= 0 && r[i] < 1e-6 ? i : r[2] <= r[0] && r[2] <= r[1] ? 2 : r[1] <= r[0] ? 1 : 0, d = l === 2 ? "xy" : l === 1 ? "xz" : "yz", c = [0, 1, 2].filter((_) => _ !== l), [m, f] = r[c[0]] >= r[c[1]] ? c : [c[1], c[0]], h = e.map((_) => _[m]), b = e.map((_) => _[f]);
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
    for (let _ = 0; _ <= o; _++) {
      const C = u + (x - u) * _ / o, I = [e[0][0], e[0][1], e[0][2]];
      I[m] = C, I[f] = v(C), I[l] = e[0][l], E.push(I);
    }
    if (E[0] = [e[0][0], e[0][1], e[0][2]], E[o] = [e[a - 1][0], e[a - 1][1], e[a - 1][2]], $o()) return Vo(E, false), { ok: true, plano: d, coef: w, ia: m, io: f };
    if (t.points.val = [...t.points.rawVal, ...E], t.polylines) {
      const _ = E.map((I, j) => M + j), C = t.polylines.rawVal;
      t.polylines.val = ((_d = C[C.length - 1]) == null ? void 0 : _d.length) > 0 ? [...C, _, []] : [...C.slice(0, -1), _, []];
    }
    return { ok: true, plano: d, coef: w, ia: m, io: f };
  };
  const Ga = () => {
    var _a2, _b;
    const e = t.points.rawVal, n = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), o = window.__hekatanDrawingAuxLines, s = (o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? [], r = [], p = [], i = /* @__PURE__ */ new Set(), l = (d) => [e[d][0], e[d][1], e[d][2]];
    return [...Je].forEach((d) => {
      const c = d.split(":");
      if (c[0] === "aux") {
        const f = s[+c[1]];
        f && f.length === 6 && (r.push([[f[0], f[1], f[2]], [f[3], f[4], f[5]]]), p.push(d));
        return;
      }
      const m = c[0] === "poly" || c[0] === "seg" ? +c[1] : -1;
      if (!(m < 0 || !n[m] || a.has(m))) if (c[0] === "poly") {
        if (i.has(m)) return;
        i.add(m);
        for (let f = 0; f + 1 < n[m].length; f++) r.push([l(n[m][f]), l(n[m][f + 1])]);
      } else {
        const f = n[m][+c[2]], h = n[m][+c[2] + 1];
        f != null && h != null && !i.has(m) && r.push([l(f), l(h)]);
      }
    }), { segs: r, auxIds: p };
  }, uo = (e, n) => Math.abs(e[0] - n[0]) < 1e-6 && Math.abs(e[1] - n[1]) < 1e-6 && Math.abs(e[2] - n[2]) < 1e-6, Gs = (e) => {
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
          const [l, d] = e[i], c = s[s.length - 1], m = s[0];
          uo(l, c) ? (s.push(d), n[i] = true, r = true) : uo(d, c) ? (s.push(l), n[i] = true, r = true) : uo(d, m) ? (s.unshift(l), n[i] = true, r = true) : uo(l, m) && (s.unshift(d), n[i] = true, r = true);
        }
      }
      const p = s.length > 3 && uo(s[0], s[s.length - 1]);
      p && s.pop(), a.push({ pts: s, cerrada: p });
    }
    return a;
  }, aa = (e, n) => {
    let a = e.findIndex((o) => Math.abs(o[0] - n[0]) < 1e-3 && Math.abs(o[1] - n[1]) < 1e-3 && Math.abs(o[2] - n[2]) < 1e-3);
    return a < 0 && (a = e.length, e.push(n)), a;
  }, Ka = (e) => {
    if (!e.length) return 0;
    Je.clear(), e.forEach((a) => Je.add(a));
    const n = e.length;
    return pa(), Je.clear(), n;
  };
  window.__hekatanRevolveSelection = (e, n, a, o = 360) => {
    var _a2, _b, _c;
    const s = Math.max(3, Math.round(a || 16)), r = Math.abs(o - 360) < 1e-9, p = s, i = r ? s : s + 1, { segs: l, auxIds: d } = Ga();
    if (!l.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (r && s % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    Pt();
    const c = t.points.rawVal, m = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = [...c];
    let h = m.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const b = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], v = /* @__PURE__ */ new Map(), w = (I) => I.map((j) => Math.round(j * 1e4)).join(","), u = (I) => Math.hypot(I[0] - e, I[1] - n) < 1e-6, x = (I) => {
      const j = w(I);
      let V = v.get(j);
      if (V) return V;
      if (u(I)) return V = [aa(f, I)], v.set(j, V), V;
      const B = Math.hypot(I[0] - e, I[1] - n), O = Math.atan2(I[1] - n, I[0] - e);
      V = [];
      for (let le = 0; le < i; le++) {
        const be = O + o * Math.PI / 180 * le / s;
        V.push(aa(f, le === 0 ? I : [e + B * Math.cos(be), n + B * Math.sin(be), I[2]]));
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
    const C = Ka(d);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), { anillos: v.size, areas: M, polo: E, guias: C };
  }, window.__hekatanLoftSelection = (e, n) => {
    var _a2, _b, _c;
    const { segs: a, auxIds: o } = Ga(), s = Gs(a), r = (B) => B.pts.every((O) => Math.abs(O[2] - B.pts[0][2]) < 1e-6), p = s.find((B) => B.cerrada && r(B)), i = s.find((B) => !B.cerrada && B.pts.length >= 2 && !r(B));
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
      const O = l[(B - 1 + d) % d], le = l[B], be = l[(B + 1) % d], Ee = [le[0] - O[0], le[1] - O[1]], we = [be[0] - le[0], be[1] - le[1]], $e = Math.hypot(Ee[0], Ee[1]) || 1, ke = Math.hypot(we[0], we[1]) || 1, Ge = [f * Ee[1] / $e, -f * Ee[0] / $e], Re = [f * we[1] / ke, -f * we[0] / ke], Se = 1 + (Ge[0] * Re[0] + Ge[1] * Re[1]);
      return [(Ge[0] + Re[0]) / Math.max(Se, 1e-6), (Ge[1] + Re[1]) / Math.max(Se, 1e-6)];
    }, b = l.map((B, O) => h(O)), v = c[0];
    let w = [0, 0], u = 0;
    for (const B of c) {
      const O = B[0] - v[0], le = B[1] - v[1], be = Math.hypot(O, le);
      be > u && (u = be, w = [O / be, le / be]);
    }
    if (u < 1e-9) {
      const B = v[0] - e, O = v[1] - n, le = Math.hypot(B, O) || 1;
      w = [B / le, O / le];
    }
    w[0] * (v[0] - e) + w[1] * (v[1] - n) < 0 && (w = [-w[0], -w[1]]), Pt();
    const x = t.points.rawVal, M = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], E = [...x];
    let _ = M.slice();
    _.length && _[_.length - 1].length === 0 && (_ = _.slice(0, -1));
    const C = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], I = c.map((B) => {
      const O = (B[0] - v[0]) * w[0] + (B[1] - v[1]) * w[1], le = B[2];
      return l.map((be, Ee) => aa(E, [be[0] + b[Ee][0] * O, be[1] + b[Ee][1] * O, le]));
    });
    let j = 0;
    for (let B = 0; B + 1 < I.length; B++) for (let O = 0; O < d; O++) {
      const le = [I[B][O], I[B][(O + 1) % d], I[B + 1][(O + 1) % d], I[B + 1][O]];
      new Set(le).size < 4 || (C.push(_.length), _.push([...le, le[0]]), j++);
    }
    _.push([]), t.points.val = E, t.polylines && (t.polylines.val = _), t.areas && (t.areas.val = C);
    const V = Ka(o);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), { contorno: d, perfil: c.length, areas: j, guias: V };
  }, window.__hekatanDrawSlabChaflan = (e, n, a = 1, o = 6, s = 6) => {
    const r = Math.min(e[0], n[0]), p = Math.max(e[0], n[0]), i = Math.min(e[1], n[1]), l = Math.max(e[1], n[1]), d = (e[2] + n[2]) / 2, c = p - r, m = l - i, f = Math.min(a, c / 2 - 0.01, m / 2 - 0.01);
    if (f <= 0) return;
    const h = t.points.rawVal.length, b = [], v = [], w = (u, x) => {
      b.push([u, x, d]), v.push(h + b.length - 1);
    };
    for (let u = 0; u <= s; u++) w(r + f + (c - 2 * f) * u / s, i);
    for (let u = 1; u <= o; u++) {
      const x = -Math.PI / 2 + Math.PI / 2 * u / o;
      w(p - f + f * Math.cos(x), i + f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) w(p, i + f + (m - 2 * f) * u / s);
    for (let u = 1; u <= o; u++) {
      const x = 0 + Math.PI / 2 * u / o;
      w(p - f + f * Math.cos(x), l - f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) w(p - f - (c - 2 * f) * u / s, l);
    for (let u = 1; u <= o; u++) {
      const x = Math.PI / 2 + Math.PI / 2 * u / o;
      w(r + f + f * Math.cos(x), l - f + f * Math.sin(x));
    }
    for (let u = 1; u <= s; u++) w(r, l - f - (m - 2 * f) * u / s);
    for (let u = 1; u < o; u++) {
      const x = Math.PI + Math.PI / 2 * u / o;
      w(r + f + f * Math.cos(x), i + f + f * Math.sin(x));
    }
    if (v.push(h), $o()) {
      Vo(b, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...b], t.polylines) {
      const u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), v, []];
    }
  }, window.__hekatanDrawRect = (e, n) => {
    const a = t.points.rawVal.length, o = e[0], s = e[1], r = e[2], p = n[0], i = n[1], l = n[2];
    let d;
    if (Math.abs(r - l) < 1e-6 ? d = [[o, s, r], [p, s, r], [p, i, r], [o, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[o, s, r], [p, s, r], [p, s, l], [o, s, l]] : d = [[o, s, r], [o, i, r], [o, i, l], [o, s, l]], t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = [a, a + 1, a + 2, a + 3, a], m = t.polylines.rawVal;
      t.polylines.val = [...m.slice(0, -1), c, []];
    }
  }, window.__hekatanDrawRectArea = (e, n) => {
    var _a2;
    const a = t.points.rawVal.length, o = e[0], s = e[1], r = e[2], p = n[0], i = n[1], l = n[2];
    let d;
    if (q && t.gridTarget) {
      const c = t.gridTarget.rawVal, m = new Cn(...c.rotation), f = new F(1, 0, 0).applyEuler(m), h = new F(0, 1, 0).applyEuler(m), b = new F(...c.position), v = new F(o, s, r), w = new F(p, i, l), u = v.clone().sub(b).dot(f), x = v.clone().sub(b).dot(h), M = w.clone().sub(b).dot(f), E = w.clone().sub(b).dot(h), _ = (C, I) => b.clone().addScaledVector(f, C).addScaledVector(h, I).toArray();
      d = [_(u, x), _(M, x), _(M, E), _(u, E)];
    } else Math.abs(r - l) < 1e-6 ? d = [[o, s, r], [p, s, r], [p, i, r], [o, i, r]] : Math.abs(s - i) < 1e-6 ? d = [[o, s, r], [p, s, r], [p, s, l], [o, s, l]] : d = [[o, s, r], [o, i, r], [o, i, l], [o, s, l]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...d], t.polylines) {
      const c = t.polylines.rawVal, m = c.length - 1, f = [a, a + 1, a + 2, a + 3, a];
      t.polylines.val = [...c.slice(0, -1), f, []], t.areas && (t.areas.val = [...t.areas.rawVal, m]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    P();
  }, window.__hekatanFillClosedAreas = () => {
    var _a2, _b, _c;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = t.points.rawVal, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = (w) => w.map((u) => Math.round(u * 1e4) / 1e4).join(",");
    for (let w = 0; w < n.length; w++) {
      const u = s(n[w]), x = a.get(u);
      x === void 0 && a.set(u, w), o.set(w, x ?? w);
    }
    const r = e.map((w) => w.map((u) => o.get(u) ?? u)), p = /* @__PURE__ */ new Map(), i = (w, u) => {
      w !== u && ((p.get(w) ?? p.set(w, /* @__PURE__ */ new Set()).get(w)).add(u), (p.get(u) ?? p.set(u, /* @__PURE__ */ new Set()).get(u)).add(w));
    };
    for (const w of r) for (let u = 0; u + 1 < w.length; u++) i(w[u], w[u + 1]);
    const l = (w, u) => {
      var _a3;
      return !!((_a3 = p.get(w)) == null ? void 0 : _a3.has(u));
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
  }, window.__hekatanMeshPolyArea = (e, n) => {
    var _a2;
    const a = e.length;
    if (a < 3) return 0;
    let o = 0, s = 0, r = 0;
    for (let Se = 0; Se < a; Se++) {
      const Ze = e[Se], He = e[(Se + 1) % a];
      o += (Ze[1] - He[1]) * (Ze[2] + He[2]), s += (Ze[2] - He[2]) * (Ze[0] + He[0]), r += (Ze[0] - He[0]) * (Ze[1] + He[1]);
    }
    const p = Math.hypot(o, s, r) || 1;
    o /= p, s /= p, r /= p;
    let i = e[1][0] - e[0][0], l = e[1][1] - e[0][1], d = e[1][2] - e[0][2];
    const c = Math.hypot(i, l, d) || 1;
    i /= c, l /= c, d /= c;
    let m = s * d - r * l, f = r * i - o * d, h = o * l - s * i;
    const b = Math.hypot(m, f, h) || 1;
    m /= b, f /= b, h /= b;
    const v = e[0], w = (Se) => [(Se[0] - v[0]) * i + (Se[1] - v[1]) * l + (Se[2] - v[2]) * d, (Se[0] - v[0]) * m + (Se[1] - v[1]) * f + (Se[2] - v[2]) * h], u = (Se, Ze) => [v[0] + Se * i + Ze * m, v[1] + Se * l + Ze * f, v[2] + Se * d + Ze * h], x = e.map(w);
    let M = 1 / 0, E = -1 / 0, _ = 1 / 0, C = -1 / 0;
    for (const [Se, Ze] of x) Se < M && (M = Se), Se > E && (E = Se), Ze < _ && (_ = Ze), Ze > C && (C = Ze);
    const I = E - M, j = C - _;
    if (I < 1e-6 || j < 1e-6) return 0;
    let V = n && n > 0 ? n : 0.5;
    for (; I / V * (j / V) > 2500; ) V *= 2;
    V = Math.min(V, Math.min(I, j));
    const B = (Se, Ze) => {
      let He = false;
      for (let ft = 0, it = x.length - 1; ft < x.length; it = ft++) {
        const [mt, Nt] = x[ft], [en, tn] = x[it];
        Nt > Ze != tn > Ze && Se < (en - mt) * (Ze - Nt) / (tn - Nt) + mt && (He = !He);
      }
      return He;
    }, O = Math.max(1, Math.round(I / V)), le = Math.max(1, Math.round(j / V)), be = I / O, Ee = j / le, we = /* @__PURE__ */ new Map(), $e = [], ke = t.points.rawVal.length, Ge = (Se, Ze) => {
      const He = Se + "," + Ze, ft = we.get(He);
      if (ft !== void 0) return ft;
      const it = ke + $e.length;
      return $e.push(u(M + Se * be, _ + Ze * Ee)), we.set(He, it), it;
    }, Re = [];
    for (let Se = 0; Se < O; Se++) for (let Ze = 0; Ze < le; Ze++) {
      if (!B(M + (Se + 0.5) * be, _ + (Ze + 0.5) * Ee)) continue;
      const He = Ge(Se, Ze), ft = Ge(Se + 1, Ze), it = Ge(Se + 1, Ze + 1), mt = Ge(Se, Ze + 1);
      Re.push([He, ft, it, mt]);
    }
    if (!Re.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...$e], t.polylines && t.areas) {
      let Se = t.polylines.rawVal.slice();
      Se.length && Se[Se.length - 1].length === 0 && (Se = Se.slice(0, -1));
      const Ze = [];
      for (const He of Re) Ze.push(Se.length), Se.push([He[0], He[1], He[2], He[3], He[0]]);
      Se.push([]), t.polylines.val = Se, t.areas.val = [...t.areas.rawVal, ...Ze];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return P(), Re.length;
  };
  const Lo = () => {
    if (at.length < 3) return at = [], Be.visible = false, P(), 0;
    const e = window.__hekatanMeshPolyArea(at.slice());
    return at = [], Be.visible = false, P(), e;
  };
  window.__hekatanFinalizePolyArea = Lo, window.__hekatanSetInclinedPlaneFrom3 = (e, n, a) => {
    var _a2;
    const o = new F(e[0], e[1], e[2]), s = new F(n[0], n[1], n[2]), r = new F(a[0], a[1], a[2]), p = new F().subVectors(s, o).cross(new F().subVectors(r, o));
    if (p.lengthSq() < 1e-9) return false;
    p.normalize();
    const i = new go().setFromUnitVectors(new F(0, 0, 1), p), l = new Cn().setFromQuaternion(i);
    t.gridTarget && (t.gridTarget.val = { position: [o.x, o.y, o.z], rotation: [l.x, l.y, l.z] }), q = true;
    const d = new F().addVectors(o, s).add(r).multiplyScalar(1 / 3), c = Math.max(o.distanceTo(s), o.distanceTo(r), s.distanceTo(r)) * 2.2 + 4, m = c / 2;
    Xt.geometry.dispose(), Xt.geometry = new Vn(c, c), on.geometry.dispose(), on.geometry = new ys(new Vn(c, c)), So(m, 1), St.position.copy(d), St.quaternion.copy(i), St.scale.set(1, 1, 1), St.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return P(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), q = false, St.visible = false, P();
  };
  const ln = new pt();
  ln.visible = false, g.add(ln), window.__hekatanShowAxes = (e, n, a = 12, o = 2) => {
    var _a2, _b;
    for (; ln.children.length; ) {
      const c = ln.children.pop();
      (_a2 = c.geometry) == null ? void 0 : _a2.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !n.length) return;
    const s = Math.min(...n) - o, r = Math.max(...n) + o, p = Math.min(...e) - o, i = Math.max(...e) + o, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", d = (c, m, f, h, b) => {
      const v = document.createElement("canvas");
      v.width = 64, v.height = 32;
      const w = v.getContext("2d");
      w.fillStyle = b, w.font = "bold 22px sans-serif", w.textAlign = "center", w.fillText(c, 32, 26);
      const u = new xs(v), x = new gs({ map: u, transparent: true }), M = new bs(x);
      return M.position.set(m, f, h), M.scale.set(1.2, 0.6, 1), M;
    };
    e.forEach((c, m) => {
      const f = m < l.length ? l[m] : `X${m}`, h = new Ve().setFromPoints([new F(c, s, 0), new F(c, r, 0), new F(c, s, 0), new F(c, s, a)]), b = new ao({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new nn(h, b);
      v.computeLineDistances(), ln.add(v), ln.add(d(f, c, s - 0.5, 0, "#60a5fa")), ln.add(d(f, c, r + 0.5, 0, "#60a5fa"));
    }), n.forEach((c, m) => {
      const f = `${m + 1}`, h = new Ve().setFromPoints([new F(p, c, 0), new F(i, c, 0), new F(p, c, 0), new F(p, c, a)]), b = new ao({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new nn(h, b);
      v.computeLineDistances(), ln.add(v), ln.add(d(f, p - 0.5, c, 0, "#fb7185")), ln.add(d(f, i + 0.5, c, 0, "#fb7185"));
    }), ln.visible = true, P();
  }, window.__hekatanHideAxes = () => {
    ln.visible = false, P();
  };
  const Pn = new pt();
  Pn.visible = false, g.add(Pn);
  let Wn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], n = 20, a = 0, o = 0) => {
    var _a2, _b;
    for (; Pn.children.length; ) {
      const r = Pn.children.pop();
      (_a2 = r.geometry) == null ? void 0 : _a2.dispose(), (_b = r.material) == null ? void 0 : _b.dispose();
    }
    Wn.forEach((r) => {
      g.remove(r), r.geometry.dispose(), r.material.dispose();
    }), Wn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((r, p) => {
      const i = s[p % s.length], l = n / 2, d = [new F(a - l, o - l, r), new F(a + l, o - l, r), new F(a + l, o + l, r), new F(a - l, o + l, r), new F(a - l, o - l, r)], c = new Ve().setFromPoints(d), m = new wt({ color: i, transparent: true, opacity: 0.55 });
      Pn.add(new Et(c, m));
      const f = document.createElement("canvas");
      f.width = 128, f.height = 32;
      const h = f.getContext("2d");
      h.fillStyle = `#${i.toString(16).padStart(6, "0")}`, h.font = "bold 18px sans-serif", h.fillText(`Z = ${r} m`, 4, 22);
      const b = new xs(f), v = new gs({ map: b, transparent: true }), w = new bs(v);
      w.position.set(a - l - 1.5, o - l - 1.5, r), w.scale.set(2.5, 0.6, 1), Pn.add(w);
      const u = new Vn(1e4, 1e4), x = new xt({ visible: false, side: Lt }), M = new dt(u, x);
      M.position.set(0, 0, r), M.frustumCulled = false, M.userData = { refPlaneZ: r }, g.add(M), Wn.push(M);
    }), Pn.visible = true, P();
  }, window.__hekatanHideRefPlanes = () => {
    Pn.visible = false, Wn.forEach((e) => {
      e.visible = false;
    }), P();
  };
  const po = new pt();
  po.frustumCulled = false, g.add(po);
  const Ks = () => {
    var _a2, _b, _c, _d;
    for (; po.children.length; ) {
      const a = po.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of n) {
      if (a.length !== 6) continue;
      const o = new Ve().setFromPoints([new F(a[0], a[1], a[2]), new F(a[3], a[4], a[5])]), s = new ao({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), r = new Et(o, s);
      r.computeLineDistances(), po.add(r);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Ks(), P());
  });
  const Hn = new pt();
  Hn.frustumCulled = false, g.add(Hn);
  const Wa = () => {
    var _a2, _b, _c, _d;
    for (; Hn.children.length; ) {
      const a = Hn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of n) {
      if (!a || a.length !== 3) continue;
      const o = new dt(new so(0.025, 12, 12), new xt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      o.position.set(a[0], a[1], a[2]), o.renderOrder = 996, o.scale.setScalar(Co(o.position)), Hn.add(o);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Wa(), P());
  }), S.addEventListener("change", () => {
    Hn.children.forEach((e) => {
      e.scale.setScalar(Co(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Wa;
  const vt = new pt(), Ws = new dt(new so(0.01, 12, 12), new xt({ color: 16777215, transparent: true, opacity: 0.95 })), Ha = new dt(new so(0.015, 12, 12), new xt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Ha.visible = false, vt.add(Ws, Ha);
  const Jn = 0.08, sa = (e, n, a) => {
    const o = new Ve().setFromPoints([new F(...e), new F(...n)]);
    return new Et(o, new wt({ color: a, transparent: true, opacity: 0.7 }));
  };
  vt.add(sa([-Jn, 0, 0], [Jn, 0, 0], 16777215)), vt.add(sa([0, -Jn, 0], [0, Jn, 0], 16777215)), vt.add(sa([0, 0, -Jn], [0, 0, Jn], 16777215)), vt.visible = false, vt.frustumCulled = false, g.add(vt);
  let ia = 2;
  const Io = (e) => {
    const n = k(), a = ($ == null ? void 0 : $.clientHeight) || 700;
    return n.isOrthographicCamera ? (n.top - n.bottom) / (n.zoom || 1) / a : 2 * n.position.distanceTo(e) * Math.tan((n.fov || 50) * Math.PI / 180 / 2) / a;
  }, fo = () => {
    if (!vt.visible) return;
    const e = ia * Io(vt.position) / 0.015;
    vt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let En = 10;
  const la = (e) => Math.max(1e-4, En * Io(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (En = e), En), window.__hekatanUpdateSnapScale = fo, window.__hekatanSnapMarker = vt, window.__hekatanMetrosPorPixel = Io, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (ia = e, fo(), P()), ia);
  const Ja = () => {
    gn.children.length !== 0 && gn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const n = e;
      n.scale.setScalar(Co(n.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Ja, S.addEventListener("change", () => {
    var _a2;
    fo(), an.visible && Ba(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Ja();
  }), window.__hekatanShowSnap = (e, n, a) => {
    vt.position.set(e, n, a), vt.visible = true, fo(), P();
  }, window.__hekatanHideSnap = () => {
    vt.visible = false, P();
  }, $.addEventListener("pointermove", (e) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n), se = null;
    const a = Ye();
    if ((!a.length || ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) !== "fillarea") && ut.visible && (ut.visible = false), a.length) {
      const o = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const h = Kt([o.x, o.y, o.z]);
        if (h) {
          const b = h.map((u) => t.points.rawVal[u]), v = [];
          for (let u = 1; u < b.length - 1; u++) v.push(b[0][0], b[0][1], b[0][2], b[u][0], b[u][1], b[u][2], b[u + 1][0], b[u + 1][1], b[u + 1][2]);
          const w = ut.geometry;
          w.setAttribute("position", new It(v, 3)), w.computeVertexNormals(), ut.visible = true;
        } else ut.visible = false;
      } else ut.visible && (ut.visible = false);
      const s = e.altKey;
      let r = false;
      const p = la(o), i = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, o.x, o.y, o.z, p, { x: e.clientX, y: e.clientY });
      if (i) No(i.type, i.x, i.y, i.z), vt.position.set(i.x, i.y, i.z), vt.visible = true, o.set(i.x, i.y, i.z), Xo(i.type, e.clientX, e.clientY);
      else if (!s && (Ce = _e(e.clientX, e.clientY))) r = true, o.copy(Ce), No("ifcSec", o.x, o.y, o.z), Xo("ifcSec", e.clientX, e.clientY), vt.position.copy(o), vt.visible = true;
      else if (ae && !s) r = true, No(ae.tipo, o.x, o.y, o.z), Xo(ae.tipo, e.clientX, e.clientY), vt.position.copy(o), vt.visible = true;
      else {
        ti(), Yo();
        const f = !s && window.__hekatanSnapEnabled !== false, h = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        f && h > 0 && (o.x = Math.round(o.x / h) * h, o.y = Math.round(o.y / h) * h, o.z = Math.round(o.z / h) * h), vt.position.copy(o), vt.visible = true;
      }
      fo(), Z(se && !i && (r || ae) ? K(se) : null), Tt = { p: o.clone(), x: e.clientX, y: e.clientY };
      const l = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (l === "select" || !l) {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = Us(o.x, o.y, o.z, f), b = oa(o.x, o.y, o.z, f), v = Na(o.x, o.y, o.z, f);
        if (h >= 0) {
          const M = t.points.rawVal[h];
          an.position.set(M[0], M[1], M[2]), an.visible = true, Ba(), xn.visible = false, bn = { kind: "pt", a: h };
        } else if (b) {
          const M = t.points.rawVal, E = t.polylines.rawVal[b.polyIdx], _ = M[E[b.segIdx]], C = M[E[b.segIdx + 1]];
          xn.geometry.setFromPoints([new F(_[0], _[1], _[2]), new F(C[0], C[1], C[2])]), xn.visible = true, an.visible = false, bn = ((_m = (_l2 = t.areas) == null ? void 0 : _l2.rawVal) == null ? void 0 : _m.includes(b.polyIdx)) ?? false ? { kind: "poly", a: b.polyIdx } : { kind: "seg", a: b.polyIdx, b: b.segIdx };
        } else if (v >= 0) {
          const E = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[v];
          E && (xn.geometry.setFromPoints([new F(E[0], E[1], E[2]), new F(E[3], E[4], E[5])]), xn.visible = true, an.visible = false, bn = { kind: "aux", a: v });
        } else xn.visible = false, an.visible = false, bn = null;
        Fe.style.left = e.clientX + "px", Fe.style.top = e.clientY + "px", Fe.style.display = "block";
        let w = o;
        if ((bn == null ? void 0 : bn.kind) === "pt") {
          const M = t.points.rawVal[bn.a];
          M && (w = new F(M[0], M[1], M[2]));
        }
        const u = `X=${w.x.toFixed(2)} Y=${w.y.toFixed(2)} Z=${w.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [w.x, w.y, w.z], bn) {
          const M = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Fe.textContent = `${u}  \xB7  \u{1F5B1} Click \u2192 ${M[bn.kind]}`;
        } else Fe.textContent = u;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = u), Tt = { p: w.clone(), x: e.clientX, y: e.clientY }, We.visible = false, Ut.visible = false, Zt.visible = false, P();
        return;
      }
      if (l === "delete" || l === "trim" || l === "extend" || l === "offset") {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = oa(o.x, o.y, o.z, f), b = Na(o.x, o.y, o.z, f);
        let v = false;
        if (b >= 0) if (!h) v = true;
        else {
          const M = window.__hekatanDrawingAuxLines, _ = ((M == null ? void 0 : M.rawVal) ?? (M == null ? void 0 : M.val) ?? M ?? [])[b];
          co(o.x, o.y, o.z, _[0], _[1], _[2], _[3], _[4], _[5]) < h.dist && (v = true);
        }
        v ? (Fn = b, un = -1, An = -1, Zs(b)) : h ? (un = h.polyIdx, An = h.segIdx, Fn = -1, qs(h.polyIdx, h.segIdx)) : (un = -1, An = -1, Fn = -1, qt.visible = false), We.visible = false, Ut.visible = false, Zt.visible = false, fn(), Fe.style.left = e.clientX + "px", Fe.style.top = e.clientY + "px", Fe.style.display = "block";
        const w = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        let u = "";
        v ? u = `\u{1F5D1} l\xEDnea aux #${Fn + 1}` : h ? u = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(h.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${h.polyIdx + 1}` : `\u{1F5D1} seg ${h.segIdx + 1} / poly #${h.polyIdx + 1}` : u = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Fe.textContent = `${w}  \xB7  ${u}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = w), P();
        return;
      } else qt.visible = false, un = -1, Fn = -1;
      Fe.style.left = e.clientX + "px", Fe.style.top = e.clientY + "px", Fe.style.display = "block";
      const d = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], c = d[d.length - 1] ?? [], m = t.points.rawVal ?? [];
      if (c.length > 0 && m[c[c.length - 1]]) {
        const f = c[c.length - 1], h = m[f];
        let b = Ct;
        ro = null;
        const v = !!i || r;
        if (!b && !v && window.__hekatanAxisSnap !== false) {
          const we = $.getBoundingClientRect(), $e = e.clientX, ke = e.clientY, Ge = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Re = new F(h[0], h[1], h[2]), Se = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], Ze = (ft) => {
            const it = ft.clone().project(n);
            return { x: (it.x * 0.5 + 0.5) * we.width + we.left, y: (-it.y * 0.5 + 0.5) * we.height + we.top };
          };
          let He = null;
          for (const [ft, it] of Se) {
            const mt = Ze(Re.clone().addScaledVector(it, -Ge)), Nt = Ze(Re.clone().addScaledVector(it, Ge)), en = Nt.x - mt.x, tn = Nt.y - mt.y, no = $e - mt.x, Zn = ke - mt.y, oo = en * en + tn * tn || 1;
            let vn = (no * en + Zn * tn) / oo;
            vn = Math.max(0, Math.min(1, vn));
            const us = Math.hypot($e - (mt.x + vn * en), ke - (mt.y + vn * tn));
            if (He === null || us < He.dpx) {
              const va = L.ray, ps = Re.clone().sub(va.origin), _a3 = it.dot(va.direction), fs = it.dot(ps), mi = va.direction.dot(ps), hs = 1 - _a3 * _a3, wi = Math.abs(hs) < 1e-6 ? -fs : (_a3 * mi - fs) / hs;
              He = { axis: ft, dpx: us, pt: Re.clone().addScaledVector(it, wi) };
            }
          }
          He && He.dpx <= 12 && (o.copy(He.pt), b = He.axis, ro = He.pt.clone());
        }
        const w = !!window.__hekatanOrthoMode;
        if (!b && !v && w) {
          const we = $.getBoundingClientRect(), $e = new F(h[0], h[1], h[2]), ke = (it) => {
            const mt = it.clone().project(n);
            return { x: (mt.x * 0.5 + 0.5) * we.width + we.left, y: (-mt.y * 0.5 + 0.5) * we.height + we.top };
          }, Ge = ke($e), Re = e.clientX - Ge.x, Se = e.clientY - Ge.y, Ze = Math.hypot(Re, Se), He = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], ft = Math.max(1, ((_s2 = settings.gridSize) == null ? void 0 : _s2.rawVal) ?? 10) * 0.5;
          if (Ze > 4) {
            let it = null;
            for (const [mt, Nt] of He) {
              const en = ke($e.clone().addScaledVector(Nt, ft)), tn = en.x - Ge.x, no = en.y - Ge.y, Zn = Math.hypot(tn, no);
              if (Zn < 6) continue;
              const oo = Math.abs((Re * tn + Se * no) / (Ze * Zn));
              (!it || oo > it.cos) && (it = { axis: mt, cos: oo, u: Nt });
            }
            if (it) {
              b = it.axis;
              const mt = L.ray, Nt = $e.clone().sub(mt.origin), en = it.u.dot(mt.direction), tn = it.u.dot(Nt), no = mt.direction.dot(Nt), Zn = 1 - en * en, oo = Math.abs(Zn) < 1e-6 ? -tn : (en * no - tn) / Zn, vn = $e.clone().addScaledVector(it.u, oo);
              isFinite(vn.x) && isFinite(vn.y) && isFinite(vn.z) && (o.copy(vn), ro = vn.clone());
            }
          }
        }
        const u = window.__hekatanPolarTrack !== false;
        if (!b && !v && u) {
          const we = o.x - h[0], $e = o.y - h[1], ke = o.z - h[2], Ge = Math.hypot(we, $e, ke);
          if (Ge > 1e-3) {
            const Se = Math.tan(6 * Math.PI / 180) * Ge, Ze = Math.hypot($e, ke), He = Math.hypot(we, ke), ft = Math.hypot(we, $e), it = [["x", Ze], ["y", He], ["z", ft]];
            it.sort((mt, Nt) => mt[1] - Nt[1]), it[0][1] <= Se && (b = it[0][0]);
          }
        }
        if (b) {
          const we = h[0], $e = h[1], ke = h[2];
          b === "x" ? o.set(o.x, $e, ke) : b === "y" ? o.set(we, o.y, ke) : o.set(we, $e, o.z);
          const Ge = !!Ct, Se = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[b];
          Dt.style.background = "rgba(15,23,42,0.92)", Dt.style.color = Se, Dt.style.border = `1.5px solid ${Se}`;
          const Ze = (_t2 = a[0]) == null ? void 0 : _t2.object;
          let He = null;
          Ze === Wt ? He = "xy" : Ze === Ot ? He = "xz" : Ze === wn && (He = "yz");
          const ft = He ? ` (plano ${He.toUpperCase()})` : "";
          Dt.textContent = Ge ? `\u{1F512} LOCK ${b.toUpperCase()}${ft}` : `\u22A5 ORTO ${b.toUpperCase()}${ft}`, Dt.style.left = e.clientX + 20 + "px", Dt.style.top = e.clientY + 18 + "px", Dt.style.transform = "none", Dt.style.display = "block";
        } else Ct || (Dt.style.display = "none");
        let x = null;
        if (!s && !v && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const we = t.points.rawVal, $e = b ? [b] : ["z", "x", "y"], ke = { x: e.clientX, y: e.clientY };
          let Ge = 1 / 0;
          for (const Re of we) if (!(Math.abs(Re[0] - h[0]) < 1e-9 && Math.abs(Re[1] - h[1]) < 1e-9 && Math.abs(Re[2] - h[2]) < 1e-9)) for (const Se of $e) {
            const Ze = new F(Se === "x" ? Re[0] : o.x, Se === "y" ? Re[1] : o.y, Se === "z" ? Re[2] : o.z), He = Xn(Ze.x, Ze.y, Ze.z);
            if (!He) continue;
            const ft = Math.hypot(He.x - ke.x, He.y - ke.y);
            ft < En && ft < Ge && (Ge = ft, x = { q: Re, eje: Se });
          }
        }
        x ? (x.eje === "x" ? o.x = x.q[0] : x.eje === "y" ? o.y = x.q[1] : o.z = x.q[2], Zt.geometry.setFromPoints([new F(x.q[0], x.q[1], x.q[2]), new F(o.x, o.y, o.z)]), (_u = Zt.computeLineDistances) == null ? void 0 : _u.call(Zt), Zt.visible = true, vt.position.set(o.x, o.y, o.z), vt.visible = true, Xo("track", e.clientX, e.clientY)) : Zt.visible = false, Tt = { p: o.clone(), x: e.clientX, y: e.clientY };
        const M = Math.hypot(o.x - h[0], o.y - h[1], o.z - h[2]), E = Math.atan2(o.y - h[1], o.x - h[0]) * 180 / Math.PI, _ = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`, C = (E % 360 + 360) % 360;
        Fe.textContent = `L = ${M.toFixed(3)} m   \u2220 ${C.toFixed(1)}\xB0   \xB7   ${_}`;
        const I = document.getElementById("hk-coord-fixed");
        I && (I.textContent = _), We.geometry.setFromPoints([new F(h[0], h[1], h[2]), new F(o.x, o.y, o.z)]), (_v = We.computeLineDistances) == null ? void 0 : _v.call(We), We.visible = true, gt(h[0], h[1], h[2], o.x, o.y, o.z);
        const j = window.__hekatanOrthoExt ?? 8, V = window.__hekatanShowOrthoPlanes !== false;
        mn.visible = V, V || Ra(null), V && (Sn(Dn, h, "xy", j), Sn(Kn, h, "xz", j), Sn(Bn, h, "yz", j), kn(Wt, h, "xy", j), kn(Ot, h, "xz", j), kn(wn, h, "yz", j));
        const B = V ? L.intersectObjects([Wt, Ot, wn], false) : [];
        let O = null;
        if (B.length > 0) {
          const we = B[0].object;
          we === Wt ? O = "xy" : we === Ot ? O = "xz" : we === wn && (O = "yz");
        }
        Ra(O), O && (yn.style.left = e.clientX + "px", yn.style.top = e.clientY + "px"), _n.geometry.setFromPoints([new F(h[0] - j, h[1], h[2]), new F(h[0] + j, h[1], h[2])]), (_w = _n.computeLineDistances) == null ? void 0 : _w.call(_n), hn.geometry.setFromPoints([new F(h[0], h[1] - j, h[2]), new F(h[0], h[1] + j, h[2])]), (_x = hn.computeLineDistances) == null ? void 0 : _x.call(hn), Tn.geometry.setFromPoints([new F(h[0], h[1], h[2] - j), new F(h[0], h[1], h[2] + j)]), (_y = Tn.computeLineDistances) == null ? void 0 : _y.call(Tn), Ut.visible = true;
        const le = _n.material, be = hn.material, Ee = Tn.material;
        _n.visible = b === "x", hn.visible = b === "y", Tn.visible = b === "z", le.opacity = 0.95, be.opacity = 0.95, Ee.opacity = 0.95;
      } else {
        const f = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        Fe.textContent = f;
        const h = document.getElementById("hk-coord-fixed");
        if (h && (h.textContent = f), We.visible = false, Ut.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(l)) {
          if (qe = null, rt = null, ze.style.left = e.clientX + 20 + "px", ze.style.top = e.clientY - 28 + "px", ze.style.display = "block", !et) {
            ze.value = `${o.x.toFixed(2)},${o.y.toFixed(2)},${o.z.toFixed(2)}`;
            const v = document.activeElement;
            !(v && (v.tagName === "INPUT" || v.tagName === "TEXTAREA") && v !== ze) && document.activeElement !== ze && ze.focus({ preventScroll: true });
            try {
              ze.select();
            } catch {
            }
          }
        } else fn();
      }
      P();
    } else Yo(), Fe.style.display = "none", vt.visible = false, We.visible = false, Ut.visible = false, fn(), P();
  }), ue.derive(() => {
    if (!t.gridTarget) return;
    const e = new go().setFromEuler(new Cn(...t.gridTarget.val.rotation)), n = new go().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2);
    ol(y, { position: new F(...t.gridTarget.val.position), quaternion: e.clone().multiply(n) }, P), Oa(t.gridTarget.val.position[2], Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3), ee.position.set(...t.gridTarget.val.position), ee.quaternion.setFromEuler(new Cn(...t.gridTarget.val.rotation)), ee.updateMatrixWorld();
    const a = new F(0, 0, 1).applyEuler(new Cn(...t.gridTarget.val.rotation));
    q = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  });
  function Oa(e, n, a) {
    var _a2, _b, _c, _d, _e2, _f, _g;
    {
      for (const o of Gn) g.remove(o), na(o);
      if (Gn.length = 0, n) {
        const o = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], s = /* @__PURE__ */ new Set([0]);
        for (const i of o) s.add(+i[2].toFixed(3));
        const r = /* @__PURE__ */ new Set();
        for (const i of window.__hekatanLevels ?? []) isFinite(i == null ? void 0 : i.z) && (s.add(+i.z.toFixed(3)), r.add(+i.z.toFixed(3)));
        const p = [...s].sort((i, l) => i - l).slice(0, 24);
        for (const i of p) {
          if (Math.abs(i - e) < 1e-6) continue;
          const l = y.clone(true);
          l.name = `hekatan-grid-nivel-${i}`, l.traverse((d) => {
            d.material && (d.material = d.material.clone(), d.material.transparent = true, d.material.opacity = (d.material.opacity ?? 1) * (r.has(i) ? 0.65 : Math.abs(i) < 1e-6 ? 0.5 : 0.22));
          }), l.position.set(0, 0, i), l.quaternion.identity(), g.add(l), Gn.push(l);
        }
      }
    }
    {
      const o = window.__hekatanPlanosAux ?? [], s = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", r = ((_g = (_f = (_e2 = window.__hekatanCadState) == null ? void 0 : _e2.get) == null ? void 0 : _f.call(_e2)) == null ? void 0 : _g[s === "xz" ? "workY" : s === "yz" ? "workX" : "workZ"]) ?? 0;
      for (const p of o.slice(0, 24)) {
        if (p.plano === "xy" || !isFinite(p.d) || p.plano === s && Math.abs(p.d - r) < 1e-6) continue;
        const i = y.clone(true);
        i.name = `hekatan-grid-${p.plano}-${p.d}`, i.traverse((l) => {
          l.material && (l.material = l.material.clone(), l.material.transparent = true, l.material.opacity = (l.material.opacity ?? 1) * 0.6);
        }), p.plano === "xz" ? (i.quaternion.setFromEuler(new Cn(Math.PI / 2, 0, 0)), i.position.set(0, p.d, 0)) : (i.quaternion.setFromEuler(new Cn(0, Math.PI / 2, 0)), i.position.set(p.d, 0, 0)), g.add(i), Gn.push(i);
      }
    }
    P();
  }
  window.__hekatanGrillaAux = (e, n = "xy") => {
    var _a2, _b;
    if (!isFinite(e)) return [];
    const a = window;
    (_a2 = a.__hekatanPushUndo) == null ? void 0 : _a2.call(a);
    const o = a.__hekatanPlanosAux ?? [], s = o.findIndex((r) => r.plano === n && Math.abs(r.d - e) < 1e-6);
    if (s >= 0 ? o.splice(s, 1) : o.push({ plano: n, d: e }), a.__hekatanPlanosAux = o, n === "xy") {
      const r = a.__hekatanLevels ?? [], p = r.findIndex((i) => Math.abs(i.z - e) < 1e-6 && i.tipo !== "piso");
      s >= 0 ? p >= 0 && r.splice(p, 1) : p < 0 && r.push({ label: `N${e >= 0 ? "+" : ""}${e.toFixed(2)}`, z: e, tipo: "aux" }), a.__hekatanLevels = r;
    }
    return (_b = a.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(a), o;
  }, window.__hekatanQuitarGrillaAux = (e) => {
    var _a2;
    const a = (window.__hekatanLevels ?? []).filter((o) => !(Math.abs(o.z - e) < 1e-6 && o.tipo !== "piso"));
    return window.__hekatanLevels = a, (_a2 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a2.call(window), a.map((o) => o.z);
  };
  const pn = document.createElement("input");
  pn.id = "hk-grid-dist", pn.type = "text", pn.spellcheck = false, pn.title = "Distancia del plano. Teclea un n\xFAmero y Enter para colocarlo exacto; Esc cancela.", pn.style.cssText = ["position:fixed", "z-index:99997", "pointer-events:none", "display:none", "padding:3px 8px", "background:rgba(15,23,42,.94)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "width:104px", "text-align:center", "font:bold 13px Consolas,monospace", "transform:translate(14px,-28px)", "outline:none"].join(";") + ";", document.body.appendChild(pn);
  let On = false, ra = 0, Qt = "";
  const Hs = (e) => e === "xz" ? new F(0, 1, 0) : e === "yz" ? new F(1, 0, 0) : new F(0, 0, 1), Qa = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", ho = () => {
    var _a2, _b, _c;
    return String(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy");
  }, Qn = () => {
    var _a2, _b, _c;
    return Number(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c[Qa(ho())]) ?? 0);
  }, Ro = (e) => {
    var _a2, _b;
    const n = ho(), a = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2);
    if (a && (a[Qa(n)] = e), !t.gridTarget) return;
    const o = window.__hekatanSCU ?? [0, 0, 0];
    t.gridTarget.val = n === "xy" ? { position: [o[0], o[1], e], rotation: [Math.PI / 2, 0, 0] } : n === "xz" ? { position: [o[0], e, o[2]], rotation: [0, 0, 0] } : { position: [e, o[1], o[2]], rotation: [0, 0, Math.PI / 2] };
  }, Js = () => {
    const e = Hs(ho()), n = L.ray.origin, a = L.ray.direction, o = e.dot(a), s = 1 - o * o;
    if (Math.abs(s) < 1e-4) return null;
    const r = n.clone().negate(), p = e.dot(r), i = a.dot(r);
    return (o * i - p) / s;
  }, mo = (e, n) => {
    e && (pn.style.left = e.clientX + "px", pn.style.top = e.clientY + "px");
    const a = ho() === "xz" ? "Y" : ho() === "yz" ? "X" : "Z";
    pn.value = Qt !== "" ? `${a} = ${Qt}` : `${a} = ${n.toFixed(2)} m`, pn.style.display = "block";
  }, To = (e, n) => {
    var _a2;
    On && (On = false, window.__hekatanMoviendoGrilla = false, pn.style.display = "none", e ? typeof n == "number" && isFinite(n) && Ro(n) : Ro(ra), Qt = "", (_a2 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a2.call(window), P());
  };
  window.__hekatanMoverGrilla = (e = true) => e ? (ra = Qn(), Qt = "", On = true, window.__hekatanMoviendoGrilla = true, mo(null, ra), true) : To(false), $.addEventListener("pointermove", (e) => {
    if (!On) return;
    N(e);
    const n = Js();
    if (n === null) {
      mo(e, Qn());
      return;
    }
    Qt === "" && Ro(n), mo(e, n);
  }, true), $.addEventListener("pointerdown", (e) => {
    On && (e.preventDefault(), e.stopPropagation(), To(true, Qt !== "" ? parseFloat(Qt) : Qn()));
  }, true), window.addEventListener("keydown", (e) => {
    if (On) {
      if (e.key === "Escape") return e.preventDefault(), To(false);
      if (e.key === "Enter") return e.preventDefault(), To(true, Qt !== "" ? parseFloat(Qt) : Qn());
      if (e.key === "Backspace") {
        e.preventDefault(), Qt = Qt.slice(0, -1), mo(null, Qn());
        return;
      }
      if (/^[0-9.\-]$/.test(e.key)) {
        e.preventDefault(), Qt += e.key;
        const n = parseFloat(Qt);
        isFinite(n) && Ro(n), mo(null, isFinite(n) ? n : Qn());
      }
    }
  }, true);
  const zn = new pt();
  zn.name = "hekatan-scu", zn.visible = false, g.add(zn);
  const Os = (e) => {
    var _a2, _b, _c, _d, _e2, _f;
    for (; zn.children.length; ) {
      const i = zn.children.pop();
      (_b = (_a2 = i.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e2 = i.dispose) == null ? void 0 : _e2.call(i);
    }
    const n = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), a = new F(...e), o = [[new F(1, 0, 0), 16735067], [new F(0, 1, 0), 6029194], [new F(0, 0, 1), 6990079]];
    for (const [i, l] of o) zn.add(new In(i, a, n, l, n * 0.28, n * 0.16));
    const s = new Ve().setFromPoints([new F(0, 0, 0), a]), r = new ao({ color: 2282478, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.8 }), p = new Et(s, r);
    p.computeLineDistances(), zn.add(p), zn.visible = true;
  };
  window.__hekatanPonerSCU = (e) => {
    var _a2;
    return window.__hekatanSCU = [e[0], e[1], e[2]], Os(e), (_a2 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a2.call(window), P(), e;
  }, window.__hekatanQuitarSCU = () => {
    var _a2;
    return window.__hekatanSCU = [0, 0, 0], zn.visible = false, (_a2 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a2.call(window), P(), [0, 0, 0];
  };
  let ca = false;
  window.__hekatanElegirSCU = (e = true) => (ca = e, window.__hekatanColocandoSCU = e, e), $.addEventListener("pointerdown", (e) => {
    if (!ca) return;
    e.preventDefault(), e.stopPropagation(), ca = false, window.__hekatanColocandoSCU = false;
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
    var _a2, _b, _c, _d, _e2;
    if (!t.gridTarget) return;
    const e = window.__hekatanSCU ?? [0, 0, 0], n = String(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy"), a = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d), o = Number((a == null ? void 0 : a[n === "xz" ? "workY" : n === "yz" ? "workX" : "workZ"]) ?? 0);
    t.gridTarget.val = n === "xy" ? { position: [e[0], e[1], o], rotation: [Math.PI / 2, 0, 0] } : n === "xz" ? { position: [e[0], o, e[2]], rotation: [0, 0, 0] } : { position: [o, e[1], e[2]], rotation: [0, 0, Math.PI / 2] };
  }, window.__hekatanLimpiarGrillasAux = () => {
    var _a2, _b, _c;
    const e = window, n = (e.__hekatanPlanosAux ?? []).length + (e.__hekatanLevels ?? []).filter((s) => (s == null ? void 0 : s.tipo) !== "piso").length;
    if (!n) return 0;
    (_a2 = e.__hekatanPushUndo) == null ? void 0 : _a2.call(e);
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
    const e = t.gridTarget.rawVal.rotation, n = new go().setFromEuler(new Cn(...e));
    new go().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2), Oa(t.gridTarget.rawVal.position[2], Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3);
  }, ue.derive(() => {
    Le.geometry.setAttribute("position", new It(t.points.val.flat(), 3)), Le.geometry.computeBoundingSphere();
  }), ue.derive(() => {
    const e = 0.05 * A * 0.5 * z.val;
    L.params.Points.threshold = 0.4 * e;
  }), ue.derive(() => {
    var _a2;
    const e = t.points.val ?? [], a = (((_a2 = t.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], o = [];
    for (const r of a) {
      const [p, i, l] = e[r];
      o.push(p, i, l);
    }
    const s = new Ve();
    s.setAttribute("position", new It(o, 3)), Ke.geometry.dispose(), Ke.geometry = s;
  });
  let da = false, Nn = 0;
  $.addEventListener("pointerdown", () => {
    da = true;
  }), $.addEventListener("pointerup", () => {
    da = false;
  }), $.addEventListener("pointermove", () => {
    da && Nn++;
  });
  const Yt = document.createElement("div");
  Yt.id = "hk-window-select", Yt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Yt);
  let rn = null, wo = false, Ht = null;
  const ua = (e, n, a, o, s) => {
    s ? (Yt.style.borderColor = "#34d399", Yt.style.borderStyle = "dashed", Yt.style.background = "rgba(52, 211, 153, 0.10)") : (Yt.style.borderColor = "#22d3ee", Yt.style.borderStyle = "solid", Yt.style.background = "rgba(34, 211, 238, 0.10)"), Yt.style.left = Math.min(e, a) + "px", Yt.style.top = Math.min(n, o) + "px", Yt.style.width = Math.abs(a - e) + "px", Yt.style.height = Math.abs(o - n) + "px", Yt.style.display = "block";
  }, ja = (e, n, a, o, s) => {
    var _a2, _b, _c, _d;
    const r = Math.min(e, a), p = Math.max(e, a), i = Math.min(n, o), l = Math.max(n, o), d = a < e, c = $.getBoundingClientRect(), m = k();
    m.updateMatrixWorld();
    const f = (C) => {
      const I = new F(C[0], C[1], C[2]);
      return I.project(m), { x: c.left + (I.x * 0.5 + 0.5) * c.width, y: c.top + (-I.y * 0.5 + 0.5) * c.height };
    }, h = (C) => C.x >= r && C.x <= p && C.y >= i && C.y <= l, b = (C, I) => !(C.x < r && I.x < r || C.x > p && I.x > p || C.y < i && I.y < i || C.y > l && I.y > l);
    s || Je.clear();
    let v = 0;
    const w = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let C = 0; C < w.length; C++) {
      const I = w[C];
      I && h(f(I)) && (Je.add(`pt:${C}`), v++);
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
        V && (Je.add(`poly:${C}`), v++);
      } else for (let V = 0; V < I.length - 1; V++) {
        const B = w[I[V]], O = w[I[V + 1]];
        !B || !O || u(f(B), f(O)) && (Je.add(`seg:${C}:${V}`), v++);
      }
    }
    const _ = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let C = 0; C < _.length; C++) {
      const I = _[C];
      if (!I || I.length !== 6) continue;
      const j = f([I[0], I[1], I[2]]), V = f([I[3], I[4], I[5]]);
      u(j, V) && (Je.add(`aux:${C}`), v++);
    }
    sn(), ce(v === 0 && !d ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${d ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${v} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Je.size})`), Yt.style.display = "none";
  }, Do = () => {
    Ht && (Ht = null, Yt.style.display = "none", ce("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Do, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Ht && Do();
  });
  const pa = () => {
    var _a2, _b, _c, _d;
    if (Je.size === 0) return false;
    const e = [...Je], n = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], o = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, r = (s == null ? void 0 : s.rawVal) ?? [], p = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
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
      for (let u = 0; u < n.length; u++) {
        if (p.has(u)) {
          c++;
          continue;
        }
        v.set(u, b.length), b.push([...n[u]]);
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
    for (const b of o) {
      const v = h.get(b);
      v !== void 0 && v < m.length && f.push(v);
    }
    if (t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = f), d.size > 0 && s) {
      const b = r.filter((v, w) => !d.has(w));
      "val" in s ? s.val = b : window.__hekatanDrawingAuxLines = b, c += d.size;
    }
    Je.clear(), sn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ce(`\u{1F5D1} ${c} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = pa, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const n = document.activeElement, a = !!n && (n.id === "hk3-cmd-input" || n.id === "hk-dyn-input");
    if (Je.size > 0) {
      if (n && !a && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable)) return;
      e.preventDefault(), a && (n.value = ""), pa();
      return;
    }
  });
  const Gt = document.createElement("div");
  Gt.id = "hk-properties-pane";
  const es = "hk-props-pane-pos";
  let yo = null;
  try {
    const e = localStorage.getItem(es);
    e && (yo = JSON.parse(e));
  } catch {
  }
  Gt.style.cssText = ["position:fixed", yo ? `left:${yo.left}px` : "left:14px", yo ? `top:${yo.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Gt);
  const Qs = () => {
    const e = Gt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let n = false, a = 0, o = 0, s = 0, r = 0;
    e.addEventListener("mousedown", (p) => {
      n = true, a = p.clientX, o = p.clientY;
      const i = Gt.getBoundingClientRect();
      s = i.left, r = i.top, Gt.style.transform = "none", Gt.style.left = `${s}px`, Gt.style.top = `${r}px`, p.preventDefault();
    }), window.addEventListener("mousemove", (p) => {
      if (!n) return;
      const i = p.clientX - a, l = p.clientY - o, d = Math.max(0, Math.min(window.innerWidth - 80, s + i)), c = Math.max(0, Math.min(window.innerHeight - 40, r + l));
      Gt.style.left = `${d}px`, Gt.style.top = `${c}px`;
    }), window.addEventListener("mouseup", () => {
      if (n) {
        n = false;
        try {
          localStorage.setItem(es, JSON.stringify({ left: parseFloat(Gt.style.left), top: parseFloat(Gt.style.top) }));
        } catch {
        }
      }
    });
  }, ne = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, _t = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let yt = null;
  const Vt = (e, n, a, o) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: n, prop: a, value: o } }));
  }, js = () => {
    var _a2, _b;
    if (yt && (yt.dispose(), yt = null), Je.size === 0) {
      Gt.style.display = "none";
      return;
    }
    const e = [...Je], n = e.filter((m) => m.startsWith("pt:"));
    if (n.length === 1) {
      const m = +n[0].slice(3), h = (_a2 = window.__hekatanManualSupports) == null ? void 0 : _a2.get(m);
      h ? [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = h.map(Boolean) : ne.Ux = ne.Uy = ne.Uz = ne.Rx = ne.Ry = ne.Rz = false;
      const v = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(m);
      v ? [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz] = v : ne.Fx = ne.Fy = ne.Fz = ne.Mx = ne.My = ne.Mz = 0;
    }
    const a = e.filter((m) => m.startsWith("seg:")), o = e.filter((m) => m.startsWith("poly:")), s = e.filter((m) => m.startsWith("aux:")), r = n.length > 0, p = a.length > 0, i = o.length > 0, l = !r && !p && !i, d = [];
    n.length && d.push(`\u{1F535} ${n.length} nodo(s)`), a.length && d.push(`\u{1F4CF} ${a.length} segmento(s)`), o.length && d.push(`\u25AD ${o.length} \xE1rea(s)`), s.length && d.push(`\u250A ${s.length} aux`);
    const c = `\u{1F3AF} ${Je.size} item(s) \u2014 ${d.join(", ")}`;
    yt = new Ls({ container: Gt, title: c });
    {
      const m = yt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      m.addBinding(_t, "dx", { label: "\u0394x (m)", step: 0.1 }), m.addBinding(_t, "dy", { label: "\u0394y (m)", step: 0.1 }), m.addBinding(_t, "dz", { label: "\u0394z (m)", step: 0.1 }), m.addBinding(_t, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), m.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, _t.dx, _t.dy, _t.dz, _t.copias);
        ce(v ? `\u29C9 Replicado \xD7${v} (\u0394 ${_t.dx},${_t.dy},${_t.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), m.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanExtrudeSelection) == null ? void 0 : _a3.call(window, _t.dx, _t.dy, _t.dz, _t.copias);
        ce(v && (v.lineas || v.areas) ? `\u21D7 Extruido: ${v.lineas} barra(s), ${v.areas} pa\xF1o(s) (\u0394 ${_t.dx},${_t.dy},${_t.dz} m \xD7 ${_t.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const f = { vuelo: 1.5, losa: true, borde: true, ambos: true }, h = m.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      h.addBinding(f, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), h.addBinding(f, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), h.addBinding(f, "borde", { label: "con viga de borde" }), h.addBinding(f, "ambos", { label: "a los dos lados" }), h.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanVoladoSelection) == null ? void 0 : _a3.call(window, f.vuelo, { losa: f.losa, vigaBorde: f.borde, lados: f.ambos ? "ambos" : "afuera" });
        ce(v ? `\u2310 Volado de ${f.vuelo} m en ${v} pa\xF1o(s)` + (f.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), m.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, _t.dx, _t.dy, _t.dz, 1);
        ce(v ? `\u2192 Copia desplazada \u0394 ${_t.dx},${_t.dy},${_t.dz} m` : "\u26A0 Nada seleccionado");
      });
      const b = m.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      b.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a3;
        return (_a3 = window.__hekatanToggleSnap) == null ? void 0 : _a3.call(window);
      }), b.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ce(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (r) {
      const m = yt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${n.length} nodo(s)` });
      m.addBinding(ne, "Ux"), m.addBinding(ne, "Uy"), m.addBinding(ne, "Uz"), m.addBinding(ne, "Rx"), m.addBinding(ne, "Ry"), m.addBinding(ne, "Rz");
      const f = (u, x) => {
        [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = u;
        try {
          yt.refresh();
        } catch {
        }
        Vt("nodes", n, "supports", u), ce(`\u2713 ${x}: ${n.length} nudo(s) apoyado(s) (${u.map((M, E) => M ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][E] : "").filter(Boolean).join(" ")}).`);
      };
      m.addButton({ title: `\u25B2 Empotrar los ${n.length} nudo(s) (6 GDL)` }).on("click", () => f([true, true, true, true, true, true], "Empotrado")), m.addButton({ title: `\u25B3 Articular los ${n.length} nudo(s) (Ux Uy Uz)` }).on("click", () => f([true, true, true, false, false, false], "Articulado"));
      const h = yt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      h.addBinding(ne, "Kx", { label: "Kx", min: 0, step: 100 }), h.addBinding(ne, "Ky", { label: "Ky", min: 0, step: 100 }), h.addBinding(ne, "Kz", { label: "Kz", min: 0, step: 100 }), h.addBinding(ne, "Krx", { label: "Krx", min: 0, step: 1e3 }), h.addBinding(ne, "Kry", { label: "Kry", min: 0, step: 1e3 }), h.addBinding(ne, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const b = yt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      b.addBinding(ne, "Fx", { step: 0.1 }), b.addBinding(ne, "Fy", { step: 0.1 }), b.addBinding(ne, "Fz", { step: 0.1 }), b.addBinding(ne, "Mx", { step: 0.1 }), b.addBinding(ne, "My", { step: 0.1 }), b.addBinding(ne, "Mz", { step: 0.1 }), yt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ne, "mass", { label: "m", min: 0, step: 1 }), yt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ne, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), yt.addButton({ title: `\u2713 Aplicar a ${n.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let u = 0;
        const x = [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz];
        x.some((_) => _) && (Vt("nodes", n, "supports", x), u++);
        const M = [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz];
        M.some((_) => _ !== 0) && (Vt("nodes", n, "loads", M), u++);
        const E = [ne.Kx, ne.Ky, ne.Kz, ne.Krx, ne.Kry, ne.Krz];
        if (E.some((_) => _ !== 0) && (Vt("nodes", n, "springs", E), u++), ne.mass !== 0 && (Vt("nodes", n, "mass", ne.mass), u++), ne.diaphragm !== "Ninguno" && (Vt("nodes", n, "diaphragm", ne.diaphragm), u++), u === 0) {
          ce("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let _ = document.getElementById("hk-prop-toast");
          _ || (_ = document.createElement("div"), _.id = "hk-prop-toast", _.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(_)), _.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", _.style.background = "rgba(217,119,6,0.97)", _.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            _ && (_.style.opacity = "0");
          }, 3200);
        } else ce(`\u2713 Propiedades aplicadas a ${n.length} nodo(s)`);
      });
    }
    if (p) {
      const m = yt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      m.addBinding(ne, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), m.addBinding(ne, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const f = yt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      f.addBinding(ne, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), f.addBinding(ne, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), yt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ne, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), yt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ne, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const v = yt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      v.addBinding(ne, "relMxI", { label: "Mx I" }), v.addBinding(ne, "relMyI", { label: "My I" }), v.addBinding(ne, "relMzI", { label: "Mz I" });
      const w = yt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      w.addBinding(ne, "relMxJ", { label: "Mx J" }), w.addBinding(ne, "relMyJ", { label: "My J" }), w.addBinding(ne, "relMzJ", { label: "Mz J" }), yt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ne, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const x = yt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      x.addBinding(ne, "LKx", { label: "LKx", min: 0, step: 100 }), x.addBinding(ne, "LKy", { label: "LKy", min: 0, step: 100 }), x.addBinding(ne, "LKz", { label: "LKz", min: 0, step: 100 });
      const M = yt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      M.addBinding(ne, "qx", { step: 0.1 }), M.addBinding(ne, "qy", { step: 0.1 }), M.addBinding(ne, "qz", { step: 0.1 }), yt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ne, "massPerM", { label: "m/L", min: 0, step: 1 }), yt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Vt("segs", a, "section", ne.section), Vt("segs", a, "material", ne.material_frame);
        const _ = { A: ne.A_mod, Iz: ne.Iz_mod, Iy: ne.Iy_mod, J: ne.J_mod };
        (_.A !== 1 || _.Iz !== 1 || _.Iy !== 1 || _.J !== 1) && Vt("segs", a, "modifiers", _), ne.insertionPoint !== "10 \u2014 Centroid" && Vt("segs", a, "insertionPoint", ne.insertionPoint), ne.beta !== 0 && Vt("segs", a, "beta", ne.beta);
        const C = [ne.relMxI, ne.relMyI, ne.relMzI], I = [ne.relMxJ, ne.relMyJ, ne.relMzJ];
        (C.some((B) => B) || I.some((B) => B)) && Vt("segs", a, "releases", { i: C, j: I }), ne.hinges !== "None" && Vt("segs", a, "hinges", ne.hinges);
        const j = [ne.LKx, ne.LKy, ne.LKz];
        j.some((B) => B !== 0) && Vt("segs", a, "lineSprings", j);
        const V = [ne.qx, ne.qy, ne.qz];
        V.some((B) => B !== 0) && Vt("segs", a, "distLoad", V), ne.massPerM !== 0 && Vt("segs", a, "massPerM", ne.massPerM), ce(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (i) {
      const m = yt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${o.length}` });
      m.addBinding(ne, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), m.addBinding(ne, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), m.addBinding(ne, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), yt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ne, "surfLoad", { label: "q", step: 0.1 }), yt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Vt("areas", o, "shellType", ne.shellType), Vt("areas", o, "thickness", ne.thickness), Vt("areas", o, "material", ne.material_shell), ne.surfLoad !== 0 && Vt("areas", o, "surfLoad", ne.surfLoad), ce(`\u2713 Propiedades aplicadas a ${o.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (l) {
      const m = yt.addFolder({ title: "\u2139 Selecci\xF3n" }), f = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      m.addBinding(f, "msg", { readonly: true, label: "" });
    }
    yt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Je.clear(), sn();
    }), Gt.style.display = "block", Qs();
  };
  window.__hekatanRefreshPropsPane = js;
  let jn = null, Bo = false;
  $.addEventListener("pointerdown", (e) => {
    e.button === 2 && (jn = { x: e.clientX, y: e.clientY }, Bo = false);
  }), $.addEventListener("pointermove", (e) => {
    if (jn && e.buttons & 2 && !Bo) {
      const n = e.clientX - jn.x, a = e.clientY - jn.y;
      Math.hypot(n, a) > 8 && (Bo = true);
    }
  }), $.addEventListener("pointerup", (e) => {
    var _a2, _b, _c;
    if (e.button === 2) {
      const n = jn !== null && !Bo;
      jn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (n) {
        if (Ht ? Do() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Je.size > 0 && (Je.clear(), sn()), t.polylines) {
          const r = t.polylines.rawVal;
          (r[r.length - 1] ?? []).length > 0 && (t.polylines.val = [...r, []]);
        }
        const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"), ce(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ce("\u238B Cancelado (click derecho)");
      }
    }
  }), $.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), $.addEventListener("pointerdown", (e) => {
    var _a2, _b, _c;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    n !== "select" && n !== "none" && n || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (rn = null, wo = false));
  }), $.addEventListener("pointermove", (e) => {
    if (Ht && e.buttons === 0) {
      const r = e.clientX < Ht.x;
      ua(Ht.x, Ht.y, e.clientX, e.clientY, r);
      return;
    }
    if (!rn) return;
    const n = e.clientX - rn.x, a = e.clientY - rn.y, o = Math.hypot(n, a);
    if (!wo && o < 8) return;
    wo = true;
    const s = e.clientX < rn.x;
    ua(rn.x, rn.y, e.clientX, e.clientY, s);
  }), $.addEventListener("pointerup", (e) => {
    if (!rn) return;
    if (!wo) {
      rn = null;
      return;
    }
    const n = e.ctrlKey || e.metaKey || e.shiftKey;
    ja(rn.x, rn.y, e.clientX, e.clientY, n), rn = null, wo = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const jt = new pt();
  jt.visible = false, jt.frustumCulled = false, g.add(jt);
  const ts = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, No = (e, n, a, o) => {
    var _a2, _b, _c, _d;
    for (window.__hekatanOsnapUltimo = { type: e, x: n, y: a, z: o }; jt.children.length; ) {
      const p = jt.children.pop();
      (_b = (_a2 = p.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = p.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = ts[e] ?? 16777215, r = new Ve().setFromPoints([new F(-1, -1, 0), new F(1, -1, 0), new F(1, -1, 0), new F(1, 1, 0), new F(1, 1, 0), new F(-1, 1, 0), new F(-1, 1, 0), new F(-1, -1, 0)]);
    jt.add(new nn(r, new wt({ color: s, linewidth: 2 }))), jt.position.set(n, a, o), jt.visible = true, ha();
  };
  let fa = 4;
  const ha = () => {
    jt.visible && jt.scale.setScalar(fa * Io(jt.position));
  };
  window.__hekatanOsnapMarkerRef = jt, window.__hekatanUpdateOsnapScale = ha, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (fa = e, ha(), P()), fa);
  const Yo = () => {
    jt.visible = false, window.__hekatanOsnapUltimo = null;
  }, ei = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, Mn = document.createElement("div");
  Mn.id = "hk-osnap-etiqueta", Mn.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Mn);
  const Xo = (e, n, a) => {
    const o = ei[e];
    if (!o) {
      Mn.style.display = "none";
      return;
    }
    Mn.textContent = o, Mn.style.color = "#" + (ts[e] ?? 16777215).toString(16).padStart(6, "0"), Mn.style.left = n + 18 + "px", Mn.style.top = a - 26 + "px", Mn.style.display = "block";
  }, ti = () => {
    Mn.style.display = "none";
  }, Yn = new F(), Xn = (e, n, a) => {
    const o = k();
    if (!o) return null;
    const s = $.getBoundingClientRect();
    return Yn.set(e, n, a).project(o), !isFinite(Yn.x) || !isFinite(Yn.y) || Yn.z < -1 || Yn.z > 1 ? null : { x: s.left + (Yn.x * 0.5 + 0.5) * s.width, y: s.top + (-Yn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = Xn;
  const ni = (e, n, a, o, s) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const r = window.__hekatanOsnap, p = t.points.rawVal, i = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let l = null;
    const d = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, c = s, m = (u, x, M, E) => {
      let _;
      if (c) {
        const I = Xn(x, M, E);
        if (!I || (_ = Math.hypot(I.x - c.x, I.y - c.y), _ > En)) return;
      } else if (_ = Math.hypot(x - e, M - n, E - a), _ > o) return;
      const C = d[u] ?? 9;
      (!l || C < l.r || C === l.r && _ < l.d) && (l = { type: u, x, y: M, z: E, d: _, r: C });
    };
    if (r.ori !== false && m("ori", 0, 0, 0), r.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, x = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, M = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, E = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", _ = (I) => Math.round(I / x) * x, C = (I, j) => Math.abs(I) <= M + 1e-9 && Math.abs(j) <= M + 1e-9;
      if (E === "xz") {
        const I = _(e), j = _(a);
        C(I, j) && m("grid", I, n, j);
      } else if (E === "yz") {
        const I = _(n), j = _(a);
        C(I, j) && m("grid", e, I, j);
      } else {
        const I = _(e), j = _(n);
        C(I, j) && m("grid", I, j, a);
        const V = window.__hekatanPlanosAux ?? [];
        for (const O of V.slice(0, 24)) {
          if (O.plano === "xy" || !isFinite(O.d)) continue;
          const le = O.plano === "xz" ? new F(0, 1, 0) : new F(1, 0, 0), be = new vo(le, -O.d), Ee = new F();
          if (L.ray.intersectPlane(be, Ee)) if (O.plano === "xz") {
            const we = _(Ee.x), $e = _(Ee.z);
            C(we, $e) && m("grid", we, O.d, $e);
          } else {
            const we = _(Ee.y), $e = _(Ee.z);
            C(we, $e) && m("grid", O.d, we, $e);
          }
        }
        const B = window.__hekatanLevels ?? [];
        if (B.length) {
          const O = L.ray, le = new vo(), be = new F();
          for (const Ee of B.slice(0, 24)) {
            if (!isFinite(Ee == null ? void 0 : Ee.z) || Math.abs(Ee.z - a) < 1e-6 || (le.set(new F(0, 0, 1), -Ee.z), !O.intersectPlane(le, be))) continue;
            const we = _(be.x), $e = _(be.y);
            C(we, $e) && m("grid", we, $e, Ee.z);
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
        const V = Math.max(0, Math.min(1, ((e - M[0]) * _ + (n - M[1]) * C + (a - M[2]) * I) / j)), B = M[0] + V * _, O = M[1] + V * C, le = M[2] + V * I;
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
      const u = Za(), x = [...Eo];
      for (const M of u) x.some((E) => Math.hypot(E.c[0] - M.c[0], E.c[1] - M.c[1], E.c[2] - M.c[2]) < 1e-6 && Math.abs(E.r - M.r) < 1e-6) || x.push(M);
      for (const M of x) {
        if (!p.some((C) => Math.abs(Math.hypot(C[0] - M.c[0], C[1] - M.c[1], C[2] - M.c[2]) - M.r) < 1e-6)) continue;
        const _ = Math.hypot(e - M.c[0], n - M.c[1], a - M.c[2]);
        if (_ < o || Math.abs(_ - M.r) < o) {
          const C = Math.min(_, o * 0.5), I = 3;
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
        const B = Math.max(0, Math.min(1, ((e - E[0]) * C + (n - E[1]) * I + (a - E[2]) * j) / V));
        Math.hypot(E[0] + B * C - e, E[1] + B * I - n, E[2] + B * j - a) < 3 * o && u.push([E, _]);
      }
      for (let x = 0; x < u.length; x++) for (let M = x + 1; M < u.length; M++) {
        const [E, _] = u[x], [C, I] = u[M], j = [_[0] - E[0], _[1] - E[1], _[2] - E[2]], V = [I[0] - C[0], I[1] - C[1], I[2] - C[2]], B = [E[0] - C[0], E[1] - C[1], E[2] - C[2]], O = j[0] * j[0] + j[1] * j[1] + j[2] * j[2], le = j[0] * V[0] + j[1] * V[1] + j[2] * V[2], be = V[0] * V[0] + V[1] * V[1] + V[2] * V[2], Ee = j[0] * B[0] + j[1] * B[1] + j[2] * B[2], we = V[0] * B[0] + V[1] * B[1] + V[2] * B[2], $e = O * be - le * le;
        if ($e < 1e-12) continue;
        const ke = (le * we - be * Ee) / $e, Ge = (O * we - le * Ee) / $e;
        if (ke < -1e-6 || ke > 1 + 1e-6 || Ge < -1e-6 || Ge > 1 + 1e-6) continue;
        const Re = [E[0] + ke * j[0], E[1] + ke * j[1], E[2] + ke * j[2]], Se = [C[0] + Ge * V[0], C[1] + Ge * V[1], C[2] + Ge * V[2]];
        if (Math.hypot(Re[0] - Se[0], Re[1] - Se[1], Re[2] - Se[2]) > 1e-4) continue;
        [E, _, C, I].some((He) => Math.hypot(He[0] - Re[0], He[1] - Re[1], He[2] - Re[2]) < 1e-6) || m("int", Re[0], Re[1], Re[2]);
      }
    }
    const f = window.__hekatanAxisGrids ?? [], h = window.__hekatanLevels ?? [], b = f.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, x] of b) {
      r.end && (m("end", u[0], u[1], u[2]), m("end", x[0], x[1], x[2]));
      const M = x[0] - u[0], E = x[1] - u[1], _ = x[2] - u[2], C = M * M + E * E + _ * _;
      if (C < 1e-12) continue;
      const I = Math.max(0, Math.min(1, ((e - u[0]) * M + (n - u[1]) * E + (a - u[2]) * _) / C));
      if (r.nea && m("nea", u[0] + I * M, u[1] + I * E, u[2] + I * _), r.int && Math.abs(_) > 1e-9) for (const j of h) {
        const V = (j.z - u[2]) / _;
        V < -1e-6 || V > 1 + 1e-6 || m("int", u[0] + V * M, u[1] + V * E, j.z);
      }
    }
    if (r.int || r.node) for (let u = 0; u < b.length; u++) for (let x = u + 1; x < b.length; x++) {
      const [M, E] = b[u], [_, C] = b[x], I = E[0] - M[0], j = E[1] - M[1], V = C[0] - _[0], B = C[1] - _[1], O = I * B - j * V;
      if (Math.abs(O) < 1e-12) continue;
      const le = M[0] - _[0], be = M[1] - _[1], Ee = (V * be - B * le) / O, we = (I * be - j * le) / O;
      if (Ee < -1e-6 || Ee > 1 + 1e-6 || we < -1e-6 || we > 1 + 1e-6) continue;
      const $e = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      m("int", M[0] + Ee * I, M[1] + Ee * j, typeof $e == "number" ? $e : a);
    }
    const v = window.__hekatanDrawingAuxLines, w = (v == null ? void 0 : v.rawVal) ?? (v == null ? void 0 : v.val) ?? v ?? [];
    for (const u of w) {
      if (u.length !== 6) continue;
      const x = [u[0], u[1], u[2]], M = [u[3], u[4], u[5]];
      if (r.end && (m("end", x[0], x[1], x[2]), m("end", M[0], M[1], M[2])), r.mid && m("mid", (x[0] + M[0]) / 2, (x[1] + M[1]) / 2, (x[2] + M[2]) / 2), r.nea || r.per) {
        const E = M[0] - x[0], _ = M[1] - x[1], C = M[2] - x[2], I = E * E + _ * _ + C * C;
        if (I < 1e-12) continue;
        const j = Math.max(0, Math.min(1, ((e - x[0]) * E + (n - x[1]) * _ + (a - x[2]) * C) / I)), V = x[0] + j * E, B = x[1] + j * _, O = x[2] + j * C;
        r.nea && m("nea", V, B, O), r.per && m("per", V, B, O);
      }
    }
    return l ? { type: l.type, x: l.x, y: l.y, z: l.z } : null;
  }, eo = new pt();
  eo.frustumCulled = false, g.add(eo);
  const ns = new wt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let os = 0;
  const as = () => {
    var _a2, _b;
    for (const e of eo.children.slice()) eo.remove(e), (_b = (_a2 = e.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (e) => {
    var _a2, _b;
    as();
    const n = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of e || []) {
      const r = String(s).split(":");
      let p = [];
      if (r[0] === "pt") {
        const d = n[+r[1]];
        d && (p = [d, [d[0] + 1e-3, d[1], d[2]]]);
      } else if (r[0] === "seg") {
        const d = a[+r[1]] || [], c = n[d[+r[2]]], m = n[d[+r[2] + 1]];
        c && m && (p = [c, m]);
      } else r[0] === "poly" && (p = (a[+r[1]] || []).map((c) => n[c]).filter(Boolean));
      if (p.length < 2) continue;
      const i = new Ve().setFromPoints(p.map((d) => new F(d[0], d[1], d[2]))), l = new Et(i, ns);
      l.renderOrder = 1200, eo.add(l);
    }
    if (!eo.children.length) return;
    os = performance.now() + 900;
    const o = () => {
      const s = os - performance.now();
      if (s <= 0) {
        as(), P();
        return;
      }
      ns.opacity = Math.min(1, s / 900) * 0.95, P(), requestAnimationFrame(o);
    };
    requestAnimationFrame(o);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a2;
    const n = (_a2 = e == null ? void 0 : e.detail) == null ? void 0 : _a2.ids;
    Array.isArray(n) && n.length && window.__hekatanDestello(n);
  }), window.__hekatanOsnapCompute = ni, window.__hekatanOsnapShow = No, window.__hekatanOsnapHide = Yo;
  let Oe = [], At = 0, Un = 0, Bt = null;
  const xo = document.createElement("div");
  xo.id = "hk-cad-status", xo.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", xo.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(xo);
  const oi = () => {
    var _a2, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), Ct && e.push(`\u{1F512} LOCK ${Ct.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && e.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, ce = (e) => {
    var _a2;
    const n = e + oi();
    xo.textContent = n, window.__hekatanCadStatusText = n;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, e);
    } catch {
    }
  }, ai = "Comando:", si = () => {
    var _a2, _b, _c, _d;
    const e = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", n = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], a = n.length ? n[n.length - 1] : [], o = Oe.length, s = (r, p = []) => ({ txt: r, ops: p });
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
        return s(`REGLA ${ht.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
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
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${At > 0 ? At : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(o ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${At > 0 ? At : 3} m; teclee otra + Enter):`);
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
        return s(Bt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Un > 0 ? ` (distancia ${Un} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return s(ai);
    }
  }, Jt = () => {
    var _a2, _b, _c, _d, _e2;
    try {
      const e = si(), n = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !n && !a ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, s, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Jt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", n = e.split("   |   ")[0] ?? e;
    ce(n);
  }, window.__hekatanCadResetPending = () => {
    Oe = [], at = [], Be.visible = false, ma(), Bt = null, P(), ce("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Jt();
  };
  function ma() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((n) => n.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = ma;
  const to = [], Uo = [], ii = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, li = () => JSON.parse(JSON.stringify(window.__hekatanAxisGrids ?? [])), ri = () => JSON.parse(JSON.stringify(window.__hekatanLevels ?? [])), ci = () => JSON.parse(JSON.stringify(window.__hekatanPlanosAux ?? [])), wa = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])), x: ii(), e: li(), n: ri(), g: ci() };
  }, ss = (e) => {
    var _a2, _b, _c, _d;
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
      (_a2 = window.__hekatanRefreshAxes) == null ? void 0 : _a2.call(window), (_b = window.__hekatanRefreshLevels) == null ? void 0 : _b.call(window);
    } catch {
    }
    try {
      (_c = window.__hekatanRefrescarGrillas) == null ? void 0 : _c.call(window);
    } catch {
    }
    Oe = [], We.visible = false, Ut.visible = false, fn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    P(), Jt();
  }, Pt = () => {
    to.push(wa()), to.length > 100 && to.shift(), Uo.length = 0;
  }, Zo = () => {
    const e = to.pop();
    if (!e) {
      ce("\u21B6 Nada para deshacer");
      return;
    }
    Uo.push(wa()), ss(e), ce(`\u21B6 Deshacer \u2014 quedan ${to.length}`);
  }, is = () => {
    const e = Uo.pop();
    if (!e) {
      ce("\u21B7 Nada para rehacer");
      return;
    }
    to.push(wa()), ss(e), ce(`\u21B7 Rehacer \u2014 quedan ${Uo.length}`);
  };
  window.__hekatanPushUndo = Pt, window.__hekatanUndo = Zo, window.__hekatanRedo = is, document.addEventListener("keydown", (e) => {
    var _a2;
    const n = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (n === "y" || n === "z" && e.shiftKey))) return;
    const o = e.target;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && (((_a2 = o.value) == null ? void 0 : _a2.length) ?? 0) > 0 && o.__hkSucio || (e.preventDefault(), e.stopPropagation(), is());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a2, _b, _c, _d, _e2;
    const n = e.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    if (a !== "line" && a !== "polyline") return n === "u" || n === "deshacer" || n === "undo" ? (Zo(), true) : false;
    if (n === "c" || n === "cerrar" || n === "close") {
      if (s.length < 3) return ce("Cerrar necesita al menos tres puntos."), true;
      Pt(), t.polylines.val = [...o.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ya(), ce(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (n === "u" || n === "deshacer" || n === "undo") {
      if (!s.length) return Zo(), true;
      Pt();
      const r = s[s.length - 1], p = s.slice(0, -1), i = o.some((c, m) => m !== o.length - 1 && c.includes(r)) || p.includes(r);
      let l = t.points.rawVal, d = [...o.slice(0, -1), p];
      if (!i && r === l.length - 1 && (l = l.slice(0, -1), t.points.val = l), t.polylines.val = d, p.length) {
        const c = l[p[p.length - 1]];
        c && (qe = [c[0], c[1], c[2]]);
      } else qe = null, We.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return P(), ce(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${p.length}.`), Jt(), true;
    }
    return false;
  }, document.addEventListener("input", (e) => {
    const n = e.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && (n.__hkSucio = true);
  }, { capture: true }), document.addEventListener("focusout", (e) => {
    const n = e.target;
    n && (n.__hkSucio = false);
  }, { capture: true }), document.addEventListener("keydown", (e) => {
    var _a2;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
      const n = e.target, a = n == null ? void 0 : n.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && ((_a2 = n.value) == null ? void 0 : _a2.length) > 0 && !!n.__hkSucio) return;
      e.preventDefault(), e.stopPropagation(), Zo();
    }
  }, { capture: true });
  const ya = () => {
    Oe = [], Bt = null, ma(), Ct = null, Ta(), We.visible = false, Ut.visible = false, fn(), ce("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), P(), Jt();
  };
  window.__hekatanFinalizeDraw = ya;
  const ls = () => {
    var _a2, _b, _c;
    Oe = [], at = [], Be.visible = false;
    let e = false;
    Je.size && (Je.clear(), sn(), e = true), ya();
    try {
      const n = window.__hekatanCadState, a = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"));
    } catch {
    }
    ce(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), P(), Jt();
  };
  window.__hekatanEscapeCancel = ls;
  const rs = () => {
    var _a2;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = /* @__PURE__ */ new Set();
    return Je.forEach((a) => {
      if (a.startsWith("pt:")) n.add(+a.slice(3));
      else if (a.startsWith("poly:")) (e[+a.slice(5)] || []).forEach((o) => n.add(o));
      else if (a.startsWith("seg:")) {
        const o = a.split(":"), s = e[+o[1]] || [], r = s[+o[2]], p = s[+o[2] + 1];
        r != null && n.add(r), p != null && n.add(p);
      }
    }), n;
  }, cs = (e, n, a) => {
    var _a2;
    const o = rs();
    if (!o.size) return 0;
    Pt();
    const s = t.points.rawVal.map((r, p) => o.has(p) ? [r[0] + e, r[1] + n, r[2] + a] : r);
    t.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return sn(), P(), o.size;
  };
  window.__hekatanMoveSelection = cs;
  const ds = (e, n) => {
    var _a2, _b, _c, _d, _e2;
    if (!Je.size) {
      ce(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Jt();
      return;
    }
    if (Oe.push(n), Oe.length === 1) {
      qe = n, ce(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)}). Precise el segundo punto.`), Jt();
      return;
    }
    const [a, o] = Oe, s = [o[0] - a[0], o[1] - a[1], o[2] - a[2]];
    Oe = [], We.visible = false;
    let r = 0;
    e === "move" ? r = cs(s[0], s[1], s[2]) : (r = rs().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ce(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${r} nudo${r === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (Je.clear(), sn()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Jt();
  };
  window.__hekatanPasoMoverCopiar = ds;
  const di = () => {
    var _a2, _b, _c;
    const e = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, $n = (e, n) => Math.hypot(e[0] - n[0], e[1] - n[1], e[2] - n[2]), xa = (e, n, a, o, s, r) => {
    const p = [n[0] - e[0], n[1] - e[1], n[2] - e[2]], i = [o[0] - a[0], o[1] - a[1], o[2] - a[2]], l = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], d = p[0] * p[0] + p[1] * p[1] + p[2] * p[2], c = p[0] * i[0] + p[1] * i[1] + p[2] * i[2], m = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], f = p[0] * l[0] + p[1] * l[1] + p[2] * l[2], h = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], b = d * m - c * c;
    if (b < 1e-12) return null;
    const v = (c * h - m * f) / b, w = (d * h - c * f) / b;
    if (!s && (v < -1e-6 || v > 1 + 1e-6) || !r && (w < -1e-6 || w > 1 + 1e-6)) return null;
    const u = [e[0] + v * p[0], e[1] + v * p[1], e[2] + v * p[2]], x = [a[0] + w * i[0], a[1] + w * i[1], a[2] + w * i[2]];
    return $n(u, x) > 1e-4 ? null : u;
  }, ui = (e) => {
    var _a2;
    return (((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((n, a) => n + a.filter((o) => o === e).length, 0);
  }, pi = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, fi = (e, n) => {
    var _a2, _b;
    if (!t.polylines) return;
    const a = t.polylines.rawVal, o = t.points.rawVal, s = pi[e];
    if (!Bt) {
      if (un < 0) {
        ce(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Bt = { poly: un, seg: Math.max(0, An) }, ce(e === "offset" ? `DESFASE l\xEDnea #${Bt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Un > 0 ? ` (${Un} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Jt();
      return;
    }
    if (e === "offset") {
      const v = Bt.poly, w = a[v];
      if (!w || w.length < 2) {
        Bt = null, ce("DESFASE: esa polil\xEDnea no tiene tramos."), Jt();
        return;
      }
      const u = w.length > 2 && w[0] === w[w.length - 1], x = di(), M = [];
      for (let ke = 0; ke < w.length - 1; ke++) {
        const Ge = o[w[ke]], Re = o[w[ke + 1]], Se = [Re[0] - Ge[0], Re[1] - Ge[1], Re[2] - Ge[2]], Ze = Math.hypot(Se[0], Se[1], Se[2]) || 1, He = Se[0] / Ze, ft = Se[1] / Ze, it = Se[2] / Ze, mt = [x[1] * it - x[2] * ft, x[2] * He - x[0] * it, x[0] * ft - x[1] * He], Nt = Math.hypot(mt[0], mt[1], mt[2]) || 1;
        M.push({ a: Ge, b: Re, n: [mt[0] / Nt, mt[1] / Nt, mt[2] / Nt] });
      }
      let E = 0, _ = 1 / 0;
      M.forEach((ke, Ge) => {
        const Re = co(n[0], n[1], n[2], ke.a[0], ke.a[1], ke.a[2], ke.b[0], ke.b[1], ke.b[2]);
        Re < _ && (_ = Re, E = Ge);
      });
      const C = M[E], I = Math.sign((n[0] - C.a[0]) * C.n[0] + (n[1] - C.a[1]) * C.n[1] + (n[2] - C.a[2]) * C.n[2]) || 1, j = Un > 0 ? Un : _;
      if (j < 1e-6) {
        ce("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const V = M.map((ke) => ({ a: [ke.a[0] + I * j * ke.n[0], ke.a[1] + I * j * ke.n[1], ke.a[2] + I * j * ke.n[2]], b: [ke.b[0] + I * j * ke.n[0], ke.b[1] + I * j * ke.n[1], ke.b[2] + I * j * ke.n[2]] })), B = V.length, O = (ke) => {
        const Ge = V[(ke - 1 + B) % B], Re = V[ke % B];
        return xa(Ge.a, Ge.b, Re.a, Re.b, true, true) ?? Re.a;
      }, le = [], be = u ? B : B + 1;
      for (let ke = 0; ke < be; ke++) !u && ke === 0 ? le.push(V[0].a) : !u && ke === B ? le.push(V[B - 1].b) : le.push(O(ke));
      Pt();
      const Ee = o.length;
      t.points.val = [...o, ...le];
      const we = le.map((ke, Ge) => Ee + Ge);
      u && we.push(Ee);
      let $e = a.slice();
      $e.length && $e[$e.length - 1].length === 0 && ($e = $e.slice(0, -1)), t.polylines.val = [...$e, we, []], Bt = null, ce(`\u2713 Desfase a ${j.toFixed(2)} m \u2014 ${B} tramo${B === 1 ? "" : "s"} nuevo${B === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      P(), Jt();
      return;
    }
    let r = un, p = Math.max(0, An);
    if (r < 0 || r === Bt.poly && p === Bt.seg) {
      let w = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (r = -1, a.forEach((u, x) => {
        for (let M = 0; M < u.length - 1; M++) {
          if (x === Bt.poly && M === Bt.seg) continue;
          const E = o[u[M]], _ = o[u[M + 1]];
          if (!E || !_) continue;
          const C = co(n[0], n[1], n[2], E[0], E[1], E[2], _[0], _[1], _[2]);
          C < w && (w = C, r = x, p = M);
        }
      }), r < 0) {
        ce(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const i = a[Bt.poly], l = o[i[Bt.seg]], d = o[i[Bt.seg + 1]], c = a[r], m = c[p], f = c[p + 1];
    if (!l || !d || m == null || f == null) {
      ce(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const h = o[m], b = o[f];
    if (e === "trim") {
      const v = xa(h, b, l, d, false, false);
      if (!v) {
        ce("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Pt();
      const w = o.length;
      t.points.val = [...o, v];
      const u = [...c.slice(0, p + 1), w, ...c.slice(p + 1)];
      t.polylines.val = a.map((M, E) => E === r ? u : M);
      const x = $n(n, h) < $n(n, b);
      Ya(r, x ? p : p + 1), ce(`\u2713 Recortado en (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const v = xa(h, b, l, d, true, false);
      if (!v) {
        ce("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = $n(n, h) < $n(n, b) ? p : p + 1;
      if (u !== 0 && u !== c.length - 1) {
        ce("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = c[u];
      if ($n(v, h) + $n(v, b) < $n(h, b) + 1e-6) {
        ce("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Pt(), ui(x) > 1) {
        const E = o.length;
        t.points.val = [...o, v];
        const _ = c.slice();
        _[u] = E, t.polylines.val = a.map((C, I) => I === r ? _ : C);
      } else t.points.val = o.map((E, _) => _ === x ? v : E);
      ce(`\u2713 Alargada hasta (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    P(), Jt();
  };
  window.__hekatanSelectionSize = () => Je.size, window.__hekatanSelectLast = () => {
    var _a2;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let n = e.length - 1;
    for (; n >= 0 && (!e[n] || e[n].length < 2); ) n--;
    return Je.clear(), n >= 0 && Je.add(`poly:${n}`), sn(), ce(n >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Je.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    Je.clear();
    const a = /* @__PURE__ */ new Set();
    return e.forEach((o, s) => {
      !o || o.length < 2 || (Je.add(`poly:${s}`), o.forEach((r) => a.add(r)));
    }), n.forEach((o, s) => {
      a.has(s) || Je.add(`pt:${s}`);
    }), sn(), ce(`SELECCI\xD3N ${Je.size} objetos (todo el modelo) \xB7 Esc suelta`), Je.size;
  }, window.__hekatanReplicateSelection = (e, n, a, o, s = 0) => {
    var _a2, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1)), s = Math.max(0, Math.round(s || 0));
    const r = [...Je], p = t.points.rawVal, i = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), d = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), m = [];
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
    Pt();
    const f = [...p];
    let h = i.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const b = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], v = [...d];
    for (let w = 1; w <= o; w++) {
      const u = s + w, x = e * u, M = n * u, E = a * u, _ = /* @__PURE__ */ new Map();
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
    return P(), o;
  }, window.__hekatanExtrudeSelection = (e, n, a, o) => {
    var _a2, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1));
    const s = [...Je], r = t.points.rawVal, p = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), l = /* @__PURE__ */ new Set(), d = [], c = /* @__PURE__ */ new Set();
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
    Pt();
    const m = [...r];
    let f = p.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const h = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], b = /* @__PURE__ */ new Map(), v = (x, M) => {
      if (M === 0) return x;
      const E = x + ":" + M;
      let _ = b.get(E);
      if (_ == null) {
        const C = [r[x][0] + e * M, r[x][1] + n * M, r[x][2] + a * M];
        _ = m.findIndex((I) => Math.abs(I[0] - C[0]) < 1e-3 && Math.abs(I[1] - C[1]) < 1e-3 && Math.abs(I[2] - C[2]) < 1e-3), _ < 0 && (_ = m.length, m.push(C)), b.set(E, _);
      }
      return _;
    };
    let w = 0, u = 0;
    l.forEach((x) => {
      const M = [x];
      for (let E = 1; E <= o; E++) M.push(v(x, E));
      f.push(M), w += o;
    }), d.forEach(([x, M]) => {
      for (let E = 1; E <= o; E++) {
        const _ = [v(x, E - 1), v(M, E - 1), v(M, E), v(x, E)];
        h.push(f.length), f.push([..._, _[0]]), u++;
      }
    }), f.push([]), t.points.val = m, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = h);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return P(), { lineas: w, areas: u };
  }, window.__hekatanVoladoSelection = (e, n = {}) => {
    var _a2, _b, _c;
    const a = Number(e);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const o = n.losa !== false, s = n.vigaBorde !== false, r = n.lados === "afuera" ? "afuera" : "ambos", p = t.points.rawVal, i = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], l = [];
    if ([...Je].forEach((v) => {
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
    d /= Math.max(1, p.length), c /= Math.max(1, p.length), Pt();
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
        const le = C * a * O, be = I * a * O, Ee = m.length;
        m.push([u[0] + le, u[1] + be, u[2]]);
        const we = m.length;
        m.push([x[0] + le, x[1] + be, x[2]]), f.push([v, Ee]), f.push([w, we]), s && f.push([Ee, we]), o && (h.push(f.length), f.push([v, w, we, Ee, v])), b++;
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
    var _a2, _b, _c;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Nn > 5) {
      Nn = 0;
      return;
    }
    Nn = 0;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    const a = !!(Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3), o = a ? [{ point: Tt.p.clone(), distance: n.position.distanceTo(Tt.p) }] : Ye();
    if (!o.length) return;
    if (!a) {
      const r = n.position.distanceTo(S.target) || 1, p = o[0].distance ?? n.position.distanceTo(o[0].point), i = o[0].point;
      if (!isFinite(i.x) || !isFinite(i.y) || !isFinite(i.z) || p > Math.max(r * 12, 300)) {
        ce("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let s = o[0].point;
    (e.ctrlKey || e.metaKey) && (s = new F(Math.round(o[0].point.x), Math.round(o[0].point.y), Math.round(o[0].point.z)));
    {
      const r = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], p = r[r.length - 1] ?? [], i = t.points.rawVal ?? [];
      if (p.length > 0) {
        const l = i[p[p.length - 1]];
        if (l) {
          const d = !!window.__hekatanOrthoMode;
          let c = Ct;
          if (!c && d) {
            const m = Math.abs(s.x - l[0]), f = Math.abs(s.y - l[1]), h = Math.abs(s.z - l[2]);
            c = m >= f && m >= h ? "x" : f >= h ? "y" : "z";
          }
          c === "x" ? s = new F(s.x, l[1], l[2]) : c === "y" ? s = new F(l[0], s.y, l[2]) : c === "z" && (s = new F(l[0], l[1], s.z));
        }
      }
    }
    if (Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3) s = Tt.p.clone();
    else if (ro) s = ro.clone(), ce(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
    else {
      const r = la(s), p = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, s.x, s.y, s.z, r, { x: e.clientX, y: e.clientY });
      if (p) s = new F(p.x, p.y, p.z), ce(`\u{1F3AF} Snap [${p.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        i && l > 0 && (s = new F(Math.round(s.x / l) * l, Math.round(s.y / l) * l, Math.round(s.z / l) * l));
      }
    }
    ga(s, e);
  });
  const hi = (e) => {
    var _a2;
    const n = (_a2 = t.gridTarget) == null ? void 0 : _a2.rawVal;
    if (!n) return true;
    const a = new F(0, 0, 1).applyEuler(new Cn(...n.rotation)).normalize(), o = L.ray.direction;
    return o.lengthSq() < 1e-12 ? true : Math.abs(o.clone().normalize().dot(a)) >= 0.026;
  }, ga = (e, n) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (!(a === "select" || a === "none" || !a || a === "medir" || a === "move" || a === "copy" || a === "delete" || a === "trim" || a === "extend") && !hi()) {
      ce(`\u2715 Est\xE1s mirando el plano de trabajo casi de canto, y ah\xED un p\xEDxel vale decenas de metros: el punto caer\xEDa en (${e.x.toFixed(1)}, ${e.y.toFixed(1)}, ${e.z.toFixed(1)}) m. Gira la vista, ponte en una ortogonal (Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`);
      return;
    }
    if (a === "select" || a === "none" || !a) {
      if (bn) {
        Ht && Do();
        const { kind: i, a: l, b: d } = bn, c = d !== void 0 ? `${i}:${l}:${d}` : `${i}:${l}`;
        !!n && (n.ctrlKey || n.metaKey || n.shiftKey) || Je.clear(), Je.has(c) ? Je.delete(c) : Je.add(c), sn(), ce(`\u2713 Seleccionados ${Je.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!n && (n.ctrlKey || n.metaKey || n.shiftKey), l = (n == null ? void 0 : n.clientX) ?? 0, d = (n == null ? void 0 : n.clientY) ?? 0;
        Ht ? (ja(Ht.x, Ht.y, l, d, i), Ht = null) : i || (Ht = { x: l, y: d }, ce("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), ua(l, d, l + 1, d + 1, false));
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
      ds(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "delete") {
      if (Fn >= 0) {
        const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], d = Fn;
        if (d >= 0 && d < l.length) {
          Pt();
          const c = l.slice(0, d).concat(l.slice(d + 1));
          i && typeof i == "object" && "val" in i ? i.val = c : window.__hekatanDrawingAuxLines = c, ce(`\u{1F5D1} L\xEDnea auxiliar #${d + 1} borrada`), Fn = -1, qt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (un >= 0) {
        const i = un, l = An;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (Fo(i), ce(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (Ya(i, l), ce(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : (Fo(i), ce(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else ce("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, l] = Oe, d = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), c = Math.abs(l[0] - i[0]), m = Math.abs(l[1] - i[1]), f = Math.abs(l[2] - i[2]), h = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), v = (h === "xy" ? f < 1e-3 : h === "xz" ? m < 1e-3 : h === "yz" ? c < 1e-3 : false) ? h : f < 1e-3 ? "xy" : m < 1e-3 ? "xz" : "yz", w = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], d, w, v), ce(`\u2713 C\xEDrculo dibujado en ${v.toUpperCase()} \u2014 r=${d.toFixed(2)}m, ${w} segmentos`), Oe = [];
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
      Pt(), at = v.map((E) => [E.x, E.y, E.z]);
      const w = Lo();
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
      Pt();
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
      const m = "xyz"[c.ia ?? 0], f = "xyz"[c.io ?? 2], h = (c.coef ?? []).map((b, v) => `${b >= 0 && v ? "+" : ""}${b.toFixed(3)}${v ? "\xB7" + m + (v > 1 ? "^" + v : "") : ""}`).join(" ");
      ce(`\u2713 ${l} dibujada en ${String(c.plano ?? "").toUpperCase()} \u2014 ${d} tramos a \u0394 igual de ${m} \xB7 ${f} = ${h}`), Oe = [];
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
      const l = (Tt && Math.abs(Tt.x - n.clientX) < 3 && Math.abs(Tt.y - n.clientY) < 3 ? [Tt.p.x, Tt.p.y, Tt.p.z] : null) ?? ct(n);
      if (!l) return;
      if (ht.length >= 2 && (ht = []), ht.push(l), ht.length === 1) lt.visible = false, $t(), ce("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [d, c] = ht;
        lt.geometry.setFromPoints([new F(d[0], d[1], d[2]), new F(c[0], c[1], c[2])]), lt.visible = true;
        const m = Math.hypot(c[0] - d[0], c[1] - d[1], c[2] - d[2]), f = Math.hypot(c[0] - d[0], c[1] - d[1]);
        tt.textContent = `${m.toFixed(3)} m`, $t(), ce(`\u{1F4CF} Distancia ${m.toFixed(3)} m  \xB7  \u0394x ${(c[0] - d[0]).toFixed(3)}  \u0394y ${(c[1] - d[1]).toFixed(3)}  \u0394z ${(c[2] - d[2]).toFixed(3)}  \xB7  en planta ${f.toFixed(3)} m`);
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
        var _a3;
        return !!((_a3 = d.get(V)) == null ? void 0 : _a3.has(B));
      }, f = /* @__PURE__ */ new Set(), h = [], b = [...d.keys()];
      for (const V of b) for (const B of d.get(V)) if (!(B < V)) {
        for (const O of d.get(B)) if (O !== V) for (const le of d.get(O)) {
          if (le === V || le === B || !m(le, V) || m(V, O) || m(B, le)) continue;
          const be = [V, B, O, le].slice().sort((Ee, we) => Ee - we).join("-");
          f.has(be) || (f.add(be), h.push([V, B, O, le]));
        }
      }
      for (const V of b) for (const B of d.get(V)) if (!(B < V)) for (const O of d.get(B)) {
        if (O === V || !m(O, V)) continue;
        const le = [V, B, O].slice().sort((be, Ee) => be - Ee).join("-");
        f.has(le) || (f.add(le), h.push([V, B, O]));
      }
      const v = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", w = (V) => v === "xy" ? [V[0], V[1]] : v === "xz" ? [V[0], V[2]] : [V[1], V[2]], u = w([e.x, e.y, e.z]), x = (V, B) => {
        let O = false;
        for (let le = 0, be = B.length - 1; le < B.length; be = le++) {
          const Ee = B[le][0], we = B[le][1], $e = B[be][0], ke = B[be][1];
          we > V[1] != ke > V[1] && V[0] < ($e - Ee) * (V[1] - we) / (ke - we) + Ee && (O = !O);
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
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Oe;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), ce(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Oe = [];
      return;
    }
    if (a === "polyarea") {
      at.push([e.x, e.y, e.z]), Be.geometry.setFromPoints(at.map((i) => new F(i[0], i[1], i[2]))), Be.visible = at.length >= 1, ce(`\u25B0 \xC1rea libre \u2014 ${at.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), P();
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
      Pt();
      const i = e.z, l = At && At > 0 ? At : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + l]];
      const d = t.polylines.rawVal, c = t.points.rawVal.length;
      t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [c - 2, c - 1], []], At = 0, ce(`\u258C Columna creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
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
      const [i, l] = Oe, d = At && At > 0 ? At : 3;
      Pt();
      const c = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [l[0], l[1], l[2]], [l[0], l[1], l[2] + d], [i[0], i[1], i[2] + d]];
      const m = t.polylines.rawVal;
      if (m.length - 1, t.polylines.val = [...m.slice(0, -1), ...m[m.length - 1].length > 0 ? [m[m.length - 1]] : [], [c, c + 1, c + 2, c + 3, c], []], t.areas) {
        const f = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, f];
      }
      ce(`\u25A5 Pared Q4 creada \u2014 h=${d.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Oe = [], At = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Pt();
      const i = At && At > 0 ? At : 3, l = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, l], [e.x, e.y, l + i]];
      const d = t.polylines.rawVal, c = t.points.rawVal.length;
      t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [c - 2, c - 1], []], At = 0, ce(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = oa(e.x, e.y, e.z, i);
      if (!l) {
        ce("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const d = t.polylines.rawVal, c = t.points.rawVal, m = d[l.polyIdx], f = c[m[l.segIdx]], h = c[m[l.segIdx + 1]];
      if (!f || !h) {
        ce("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const b = At && At > 0 ? At : 3;
      Pt();
      const v = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [f[0], f[1], f[2]], [h[0], h[1], h[2]], [h[0], h[1], h[2] + b], [f[0], f[1], f[2] + b]];
      const w = t.polylines.rawVal;
      if (t.polylines.val = [...w.slice(0, -1), ...w[w.length - 1].length > 0 ? [w[w.length - 1]] : [], [v, v + 1, v + 2, v + 3, v], []], t.areas) {
        const u = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, u];
      }
      At = 0, ce(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${b.toFixed(2)}m`);
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
        Pt();
        const b = d.rawVal ?? d.val ?? [];
        d.val = [...b, [i[0], i[1], i[2], l[0], l[1], l[2]]];
      }
      const c = l[0] - i[0], m = l[1] - i[1], f = l[2] - i[2], h = Math.sqrt(c * c + m * m + f * f);
      ce(`\u2713 L\xEDnea auxiliar creada \u2014 L=${h.toFixed(2)}m (cyan, no FEM)`), Oe = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      fi(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "chaflan") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Oe, d = window.__hekatanChaflanR ?? 1, c = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, d, c, 6);
      const m = Math.abs(l[0] - i[0]).toFixed(1), f = Math.abs(l[1] - i[1]).toFixed(1);
      ce(`\u2713 Losa con chaflanes dibujada \u2014 ${m}\xD7${f}m, r=${d}m, ${c} seg/chafl\xE1n`), Oe = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    et = false, Pt();
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
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && at.length >= 3) {
      e.preventDefault();
      const a = Lo();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), $.addEventListener("pointermove", (e) => {
    var _a2, _b, _c;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    const a = Ye();
    if (Qe.geometry.deleteAttribute("position"), a.length) {
      let o = a[0].point.clone();
      (e.ctrlKey || e.metaKey) && o.set(Math.round(o.x), Math.round(o.y), Math.round(o.z));
      {
        const p = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = p[p.length - 1] ?? [], l = t.points.rawVal ?? [];
        if (i.length > 0) {
          const d = l[i[i.length - 1]];
          if (d) {
            const c = !!window.__hekatanOrthoMode;
            let m = Ct;
            if (!m && c) {
              const f = Math.abs(o.x - d[0]), h = Math.abs(o.y - d[1]), b = Math.abs(o.z - d[2]);
              m = f >= h && f >= b ? "x" : h >= b ? "y" : "z";
            }
            m === "x" ? o.set(o.x, d[1], d[2]) : m === "y" ? o.set(d[0], o.y, d[2]) : m === "z" && o.set(d[0], d[1], o.z);
          }
        }
      }
      const s = la(o), r = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, o.x, o.y, o.z, s, { x: e.clientX, y: e.clientY });
      if (r) o.set(r.x, r.y, r.z);
      else {
        const p = window.__hekatanSnapEnabled !== false, i = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        p && i > 0 && (o.x = Math.round(o.x / i) * i, o.y = Math.round(o.y / i) * i, o.z = Math.round(o.z / i) * i);
      }
      Qe.geometry.setAttribute("position", new It(o.toArray(), 3));
    }
    P();
  }), $.addEventListener("pointermove", (e) => {
    var _a2;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const r = new F(...t.points.rawVal[o[0].index]), p = new F(...s[0].point), i = r.sub(p), l = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      l.transformDirection(ee.matrixWorld), Math.abs(i.dot(l)) < 1e-4 && (a = true);
    }
    Qe.visible = !a;
  });
  let ba = false, Ma;
  $.addEventListener("pointermove", (e) => {
    var _a2;
    if (!Nn) return;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const p = new F(...t.points.rawVal[o[0].index]), i = new F(...s[0].point), l = p.sub(i), d = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      d.transformDirection(ee.matrixWorld), Math.abs(l.dot(d)) < 1e-4 && (a = true);
    }
    if (a && Nn < 5 && (ba = true, S.enabled = false, Ma = o[0].index), !ba || Nn % 2 !== 0) return;
    const r = [...t.points.rawVal];
    if (Ma !== void 0) {
      let p = s[0].point;
      (e.ctrlKey || e.metaKey) && (p = new F(Math.round(p.x), Math.round(p.y), Math.round(p.z))), r[Ma] = p.toArray();
    }
    t.points.val = r;
  }), $.addEventListener("pointerup", () => {
    S.enabled = true, ba = false;
  }), $.addEventListener("contextmenu", (e) => {
    var _a2;
    const n = N(e);
    if (!n) return;
    L.setFromCamera(Y, n);
    let a = false;
    const o = L.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const i = new F(...t.points.rawVal[o[0].index]), l = new F(...s[0].point), d = i.sub(l), c = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      c.transformDirection(ee.matrixWorld), Math.abs(d.dot(c)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const r = [...t.points.rawVal];
    if (r.splice(o[0].index, 1), t.points.val = r, !t.polylines) return;
    const p = t.polylines.rawVal.map((i) => i.filter((l) => l !== o[0].index)).map((i) => i.map((l) => l > o[0].index ? l - 1 : l)).filter((i) => i.length);
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
const sl = 6, Fa = 10, il = 0.012;
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
  const S = new pt(), A = new Is();
  A.setColorMap("rainbow");
  const z = new dn(), $ = ue.state([]);
  return ue.derive(() => {
    var _a, _b, _c;
    y.deformedShape.val;
    const P = g.val, L = ((_a = t.elements) == null ? void 0 : _a.val) ?? [], Y = ll(y.frameResults.val);
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
      const te = Math.abs(W.y) < 0.99 ? new F(0, 1, 0) : new F(1, 0, 0), Ie = new F().crossVectors(W, te).normalize(), ge = new F().crossVectors(W, Ie).normalize(), ve = Fa + 1, Pe = sl;
      for (let Xe = 0; Xe < ve; Xe++) {
        const Ae = Xe / Fa, nt = fe[0] + W.x * Me * Ae, st = fe[1] + W.y * Me * Ae, Ue = fe[2] + W.z * Me * Ae, D = H[0] + (H[1] - H[0]) * Ae, J = A.getColor(D) ?? new dn(0, 0, 0);
        z.copy(J).convertSRGBToLinear();
        for (let re = 0; re < Pe; re++) {
          const ie = re / Pe * Math.PI * 2, _e = Math.cos(ie), Ce = Math.sin(ie);
          ye.push(nt + (Ie.x * _e + ge.x * Ce) * he, st + (Ie.y * _e + ge.y * Ce) * he, Ue + (Ie.z * _e + ge.z * Ce) * he), de.push(z.r, z.g, z.b);
        }
      }
      for (let Xe = 0; Xe < Fa; Xe++) for (let Ae = 0; Ae < Pe; Ae++) {
        const nt = (Ae + 1) % Pe, st = Z + Xe * Pe + Ae, Ue = Z + Xe * Pe + nt, D = Z + (Xe + 1) * Pe + Ae, J = Z + (Xe + 1) * Pe + nt;
        K.push(st, Ue, J), K.push(st, J, D);
      }
      Z += ve * Pe;
    }
    if (ye.length === 0) return;
    const R = new Ve();
    R.setAttribute("position", new It(ye, 3)), R.setAttribute("color", new It(de, 3)), R.setIndex(K), R.computeVertexNormals();
    const G = new xt({ vertexColors: true, side: Lt }), X = new dt(R, G);
    X.frustumCulled = false, S.add(X);
  }), S.__colorMapValues = $, S;
}
function dl() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const ul = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, pl = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, fl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Ft(t, y = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(y) : t.toFixed(y);
}
const hl = 16755200, Ss = 56831, ml = 56831, wl = 56831, Wo = 65382;
function yl(t) {
  const y = new pt();
  y.name = "__hekatan_hover", y.renderOrder = 99;
  const g = new so(1, 16, 16), k = new xt({ color: hl, transparent: true, opacity: 0.85, depthTest: false }), S = new dt(g, k);
  S.visible = false, S.renderOrder = 100, y.add(S);
  const A = new Ve(), z = new wt({ color: Ss, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), $ = new nn(A, z);
  $.visible = false, $.renderOrder = 100, y.add($);
  const P = new xt({ color: Ss, transparent: true, opacity: 0.7, depthTest: false }), L = new dt(new Ms(1, 1, 1, 12), P);
  L.visible = false, L.renderOrder = 100, y.add(L);
  const Y = new Ve(), N = new xt({ color: ml, transparent: true, opacity: 0.45, side: Lt, depthTest: false }), ee = new dt(Y, N);
  ee.visible = false, ee.renderOrder = 100, y.add(ee);
  const U = new Ve(), me = new wt({ color: wl, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), Q = new nn(U, me);
  Q.visible = false, Q.renderOrder = 100, y.add(Q);
  const q = new xt({ color: Wo, transparent: true, opacity: 0.95, depthTest: false }), ae = new xt({ color: Wo, transparent: true, opacity: 0.85, depthTest: false }), se = new Ms(1, 1, 1, 12), xe = new xt({ color: Wo, transparent: true, opacity: 0.55, side: Lt, depthTest: false }), he = new wt({ color: Wo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), ye = [];
  window.__hekatanModelSelection = ye;
  const de = new pt();
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
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o2, _p, _q, _r, _s2, _t;
    const re = t.getActiveCamera();
    if (!re || !t.mesh) return null;
    const ie = t.rendererElm.getBoundingClientRect(), _e = D - ie.left, Ce = J - ie.top, Ye = t.derivedNodes.rawVal, Le = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (!Ye || !Le) return null;
    const Qe = /* @__PURE__ */ new Map(), Ke = (je) => {
      if (Qe.has(je)) return Qe.get(je);
      const Fe = R(je);
      if (!Fe) return Qe.set(je, null), null;
      const De = Fe.clone().project(re), We = (De.x * 0.5 + 0.5) * ie.width, Be = (-De.y * 0.5 + 0.5) * ie.height, at = { x: We, y: Be, z: De.z };
      return Qe.set(je, at), at;
    }, ze = /* @__PURE__ */ new Set();
    for (const je of Le) if (je) for (const Fe of je) ze.add(Fe);
    const Ne = 8;
    let qe = -1, rt = Ne;
    for (let je = 0; je < Ye.length; je++) {
      if (!ze.has(je)) continue;
      const Fe = Ke(je);
      if (!Fe || Fe.z < -1 || Fe.z > 1) continue;
      const De = Fe.x - _e, We = Fe.y - Ce, Be = Math.sqrt(De * De + We * We);
      Be < rt && (rt = Be, qe = je);
    }
    const et = dl(), Mt = pl[et.dispUnit] ?? 1e3, gt = ul[et.forceUnit] ?? 1;
    if (qe >= 0) {
      const je = Ye[qe];
      let Fe = `Nodo ${qe}
(${je[0].toFixed(3)}, ${je[1].toFixed(3)}, ${je[2].toFixed(3)})`;
      const De = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (De == null ? void 0 : De.deformations) {
        const We = De.deformations.get(qe);
        if (We && (Fe += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Fe += `
Ux = ${Ft(We[0] * Mt, 3)} ${et.dispUnit}`, Fe += `
Uy = ${Ft(We[1] * Mt, 3)} ${et.dispUnit}`, Fe += `
Uz = ${Ft(We[2] * Mt, 3)} ${et.dispUnit}`, (Math.abs(We[3]) > 1e-9 || Math.abs(We[4]) > 1e-9 || Math.abs(We[5]) > 1e-9) && (Fe += `
Rx = ${Ft(We[3] * 1e3, 3)} mrad`, Fe += `
Ry = ${Ft(We[4] * 1e3, 3)} mrad`, Fe += `
Rz = ${Ft(We[5] * 1e3, 3)} mrad`)), De.reactions) {
          const Be = De.reactions.get(qe);
          Be && (Math.abs(Be[0]) > 1e-9 || Math.abs(Be[1]) > 1e-9 || Math.abs(Be[2]) > 1e-9 || Math.abs(Be[3]) > 1e-6 || Math.abs(Be[4]) > 1e-6 || Math.abs(Be[5]) > 1e-6) && (Fe += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Fe += `
Fx = ${Ft(Be[0] * gt)} ${et.forceUnit}`, Fe += `
Fy = ${Ft(Be[1] * gt)} ${et.forceUnit}`, Fe += `
Fz = ${Ft(Be[2] * gt)} ${et.forceUnit}`, (Math.abs(Be[3]) > 1e-6 || Math.abs(Be[4]) > 1e-6 || Math.abs(Be[5]) > 1e-6) && (Fe += `
Mx = ${Ft(Be[3] * gt)} ${et.forceUnit}\xB7m`, Fe += `
My = ${Ft(Be[4] * gt)} ${et.forceUnit}\xB7m`, Fe += `
Mz = ${Ft(Be[5] * gt)} ${et.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: qe, info: Fe };
    }
    const fn = 5;
    let kt = -1, Te = fn, ot = "frame";
    for (let je = 0; je < Le.length; je++) {
      const Fe = Le[je];
      if (!(!Fe || Fe.length < 2)) {
        if (Fe.length === 2) {
          const De = Ke(Fe[0]), We = Ke(Fe[1]);
          if (!De || !We || De.z < -1 || De.z > 1 || We.z < -1 || We.z > 1) continue;
          const Be = xl(_e, Ce, De.x, De.y, We.x, We.y);
          Be < Te && (Te = Be, kt = je, ot = "frame");
        } else if (Fe.length === 3 || Fe.length === 4) {
          const De = [];
          let We = true;
          for (const Be of Fe) {
            const at = Ke(Be);
            if (!at || at.z < -1 || at.z > 1) {
              We = false;
              break;
            }
            De.push(at);
          }
          if (!We) continue;
          if (gl(_e, Ce, De)) {
            const at = De.reduce((lt, ht) => lt + ht.z, 0) / De.length * 1e-3;
            at < Te && (Te = at, kt = je, ot = "shell");
          }
        } else if (Fe.length === 8) {
          const De = [];
          let We = true;
          for (const tt of Fe) {
            const ct = Ke(tt);
            if (!ct || ct.z < -1 || ct.z > 1) {
              We = false;
              break;
            }
            De.push(ct);
          }
          if (!We) continue;
          const Be = Math.min(...De.map((tt) => tt.x)), at = Math.max(...De.map((tt) => tt.x)), lt = Math.min(...De.map((tt) => tt.y)), ht = Math.max(...De.map((tt) => tt.y));
          if (_e >= Be && _e <= at && Ce >= lt && Ce <= ht) {
            const ct = De.reduce(($t, ut) => $t + ut.z, 0) / De.length * 1e-3;
            ct < Te && (Te = ct, kt = je, ot = "solid");
          }
        }
      }
    }
    if (kt >= 0) {
      const je = Le[kt];
      let De = `${ot === "frame" ? "Frame" : ot === "shell" ? "Shell" : "Solid"} ${kt}`;
      const We = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Be = (_g = (_f = We == null ? void 0 : We.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, kt);
      if (Be) {
        Be.name && (De += `
  \u{1F4CB} ${Be.name}`), Be.shape && (De += `
  Shape: ${Be.shape}`);
        const at = /concrete|hormig|rect.*sólida/i.test(Be.shape || ""), lt = at ? 100 : 1e3, ht = at ? "cm" : "mm", tt = ($t) => {
          const ut = $t * lt;
          return Math.abs(ut - Math.round(ut)) < 0.05 ? `${Math.round(ut)}` : `${ut.toFixed(1)}`;
        }, ct = [];
        if (Be.D != null && ct.push(`D=${tt(Be.D)}`), Be.B != null && ct.push(`B=${tt(Be.B)}`), Be.TF != null && ct.push(`TF=${tt(Be.TF)}`), Be.TW != null && ct.push(`TW=${tt(Be.TW)}`), Be.t != null && ct.push(`t=${tt(Be.t)}`), ct.length && (De += `
  Dim: ${ct.join(" ")} ${ht}`), Be.material) {
          let $t = Be.material;
          Be.fillMaterial && ($t += ` + FILL "${Be.fillMaterial}"`), De += `
  Mat: ${$t}`;
        }
      } else {
        const at = (_i2 = (_h = We == null ? void 0 : We.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, kt), lt = (_k = (_j = We == null ? void 0 : We.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, kt);
        at ? (De += `
  ${at}`, lt && !at.includes(lt) && (De += `  (${lt})`)) : lt && (De += `
  Material: ${lt}`);
      }
      if (De += `
nodos: [${je.join(", ")}]`, ot === "shell" && ((_l2 = t.mesh) == null ? void 0 : _l2.analyzeOutputs)) {
        const at = t.mesh.analyzeOutputs.rawVal, lt = fl[et.stressUnit] ?? 1, ht = [["bendingXX", "Mxx", gt, `${et.forceUnit}\xB7m/m`], ["bendingYY", "Myy", gt, `${et.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", gt, `${et.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", gt, `${et.forceUnit}/m`], ["membraneYY", "Nyy", gt, `${et.forceUnit}/m`], ["membraneXY", "Nxy", gt, `${et.forceUnit}/m`], ["shearX", "Qx", gt, `${et.forceUnit}/m`], ["shearY", "Qy", gt, `${et.forceUnit}/m`], ["vonMises", "\u03C3VM", lt, et.stressUnit], ["pressure", "p", lt, et.stressUnit]], tt = [];
        for (const [ct, $t, ut, Kt] of ht) {
          const St = at == null ? void 0 : at[ct];
          if (St && St instanceof Map) {
            const Xt = St.get(kt);
            if (Xt != null) {
              if (typeof Xt == "number") tt.push(`${$t} = ${Ft(Xt * ut, 3)} ${Kt}`);
              else if (Array.isArray(Xt)) {
                let on = Xt[0];
                for (const zt of Xt) Math.abs(zt) > Math.abs(on) && (on = zt);
                tt.push(`${$t} = ${Ft(on * ut, 3)} ${Kt}`);
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
        const at = t.mesh.deformOutputs.rawVal, lt = t.mesh.elementInputs.rawVal, ht = at == null ? void 0 : at.deformations;
        if (ht && je.length === 2) {
          const tt = ht.get(je[0]), ct = ht.get(je[1]), $t = ((_n = t.mesh.nodes) == null ? void 0 : _n.rawVal) ?? Ye, ut = $t[je[0]], Kt = $t[je[1]];
          if (tt && ct && ut && Kt) {
            const St = Kt[0] - ut[0], Xt = Kt[1] - ut[1], on = Kt[2] - ut[2], zt = Math.sqrt(St * St + Xt * Xt + on * on);
            if (zt > 1e-9) {
              const So = St / zt, Ut = Xt / zt, Rn = on / zt, _n2 = (ct[0] - tt[0]) * So + (ct[1] - tt[1]) * Ut + (ct[2] - tt[2]) * Rn, hn = ((_o2 = lt.elasticities) == null ? void 0 : _o2.get(kt)) ?? 0, Tn = ((_p = lt.areas) == null ? void 0 : _p.get(kt)) ?? 0, Gn = ((_q = lt.momentsOfInertiaY) == null ? void 0 : _q.get(kt)) ?? 0, na = ((_r = lt.momentsOfInertiaZ) == null ? void 0 : _r.get(kt)) ?? 0, Zt = ((_s2 = lt.torsionalConstants) == null ? void 0 : _s2.get(kt)) ?? 0, io = ((_t = lt.shearModuli) == null ? void 0 : _t.get(kt)) ?? hn / 2.6, Dn = hn * Tn * (_n2 / zt), Kn = (ct[3] - tt[3]) * So + (ct[4] - tt[4]) * Ut + (ct[5] - tt[5]) * Rn, Bn = io * Zt * (Kn / zt), mn = ct[4] - tt[4], lo = ct[5] - tt[5], Wt = hn * Gn * mn / zt, Ot = hn * na * lo / zt;
              De += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, De += `
L = ${Ft(zt, 3)} m`, De += `
\u0394L = ${Ft(_n2 * Mt, 3)} ${et.dispUnit}`, De += `
\u03B5 = ${Ft(_n2 / zt, 6)}`, Math.abs(Dn) > 1e-6 && (De += `
N \u2248 ${Ft(Dn * gt)} ${et.forceUnit}`), Math.abs(Bn) > 1e-6 && (De += `
T \u2248 ${Ft(Bn * gt)} ${et.forceUnit}\xB7m`), Math.abs(Wt) > 1e-6 && (De += `
My \u2248 ${Ft(Wt * gt)} ${et.forceUnit}\xB7m`), Math.abs(Ot) > 1e-6 && (De += `
Mz \u2248 ${Ft(Ot * gt)} ${et.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: ot, idx: kt, info: De };
    }
    return null;
  }
  function X(D, J, re) {
    var _a, _b, _c;
    if (S.visible = false, $.visible = false, L.visible = false, ee.visible = false, Q.visible = false, !D || !t.mesh) {
      Z.style.display = "none", t.render();
      return;
    }
    const ie = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (D.type === "node") {
      const Le = R(D.idx);
      if (Le) {
        const Qe = t.derivedNodes.rawVal ?? [];
        let Ke = 1;
        if (Qe.length >= 2) {
          let qe = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const et of Qe) for (let Mt = 0; Mt < 3; Mt++) et[Mt] < qe[Mt] && (qe[Mt] = et[Mt]), et[Mt] > rt[Mt] && (rt[Mt] = et[Mt]);
          Ke = Math.max(rt[0] - qe[0], rt[1] - qe[1], rt[2] - qe[2], 0.1);
        }
        const ze = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Ne = 0.021 * Ke * ze;
        S.position.copy(Le), S.scale.setScalar(Ne), S.visible = true;
      }
    } else if (D.type === "frame" && ie) {
      const Le = ie[D.idx], Qe = R(Le[0]), Ke = R(Le[1]);
      if (Qe && Ke) {
        const ze = Qe.clone().add(Ke).multiplyScalar(0.5), Ne = Ke.clone().sub(Qe), qe = Ne.length(), rt = Math.max(1e-4, 3.5 * Xe(ze));
        L.position.copy(ze);
        const et = new F(0, 1, 0), Mt = et.clone().cross(Ne).normalize(), gt = et.angleTo(Ne);
        L.quaternion.setFromAxisAngle(Mt, gt), L.scale.set(rt, qe, rt), L.visible = true;
      }
    } else if (D.type === "shell" && ie) {
      const Le = ie[D.idx], Qe = [], Ke = [];
      for (const ze of Le) {
        const Ne = R(ze);
        if (!Ne) return;
        Qe.push(Ne.x, Ne.y, Ne.z);
      }
      Le.length === 4 ? Ke.push(0, 1, 2, 0, 2, 3) : Le.length === 3 && Ke.push(0, 1, 2), Y.setAttribute("position", new It(Qe, 3)), Y.setIndex(Ke), Y.computeVertexNormals(), ee.visible = true;
    } else if (D.type === "solid" && ie) {
      const Le = ie[D.idx], Qe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ke = [];
      for (const [ze, Ne] of Qe) {
        const qe = R(Le[ze]), rt = R(Le[Ne]);
        qe && rt && Ke.push(qe.x, qe.y, qe.z, rt.x, rt.y, rt.z);
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
      var _a, _b, _c;
      const J = G(D.clientX, D.clientY);
      if (fe && pe < 5) {
        const ie = t.derivedNodes.rawVal, _e = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
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
  }, Ie = () => {
    W && (clearTimeout(W), W = null);
  };
  t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", te), t.rendererElm.addEventListener("pointerenter", Ie);
  function ge() {
    var _a, _b, _c;
    const D = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
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
  function Pe() {
    for (const D of de.children.slice()) {
      de.remove(D);
      const J = D.geometry;
      J && J !== g && J !== se && J.dispose();
    }
  }
  const Xe = (D) => {
    var _a;
    const J = t.getActiveCamera(), re = ((_a = t.rendererElm) == null ? void 0 : _a.clientHeight) || 700;
    return J.isOrthographicCamera ? (J.top - J.bottom) / (J.zoom || 1) / re : 2 * J.position.distanceTo(D) * Math.tan((J.fov || 50) * Math.PI / 180 / 2) / re;
  };
  function Ae(D, J) {
    var _a, _b;
    const re = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
    if (D.type === "node") {
      const ie = R(D.idx);
      if (!ie) return;
      const _e = new dt(g, q);
      _e.position.copy(ie), _e.scale.setScalar(Math.max(1e-4, 7 * Xe(ie))), _e.renderOrder = 101, de.add(_e);
    } else if (D.type === "frame" && re) {
      const ie = re[D.idx], _e = R(ie[0]), Ce = R(ie[1]);
      if (!_e || !Ce) return;
      const Ye = _e.clone().add(Ce).multiplyScalar(0.5), Le = Ce.clone().sub(_e), Qe = Le.length(), Ke = Math.max(1e-4, 4 * Xe(Ye)), ze = new dt(se, ae);
      ze.position.copy(Ye);
      const Ne = new F(0, 1, 0);
      ze.quaternion.setFromAxisAngle(Ne.clone().cross(Le).normalize(), Ne.angleTo(Le)), ze.scale.set(Ke, Qe, Ke), ze.renderOrder = 101, de.add(ze);
    } else if (D.type === "shell" && re) {
      const ie = re[D.idx], _e = [], Ce = [];
      for (const Qe of ie) {
        const Ke = R(Qe);
        if (!Ke) return;
        _e.push(Ke.x, Ke.y, Ke.z);
      }
      ie.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : ie.length === 3 && Ce.push(0, 1, 2);
      const Ye = new Ve();
      Ye.setAttribute("position", new It(_e, 3)), Ye.setIndex(Ce), Ye.computeVertexNormals();
      const Le = new dt(Ye, xe);
      Le.renderOrder = 101, de.add(Le);
    } else if (D.type === "solid" && re) {
      const ie = re[D.idx], _e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Qe, Ke] of _e) {
        const ze = R(ie[Qe]), Ne = R(ie[Ke]);
        ze && Ne && Ce.push(ze.x, ze.y, ze.z, Ne.x, Ne.y, Ne.z);
      }
      const Ye = new Ve();
      Ye.setAttribute("position", new It(Ce, 3));
      const Le = new nn(Ye, he);
      Le.renderOrder = 101, de.add(Le);
    }
  }
  function nt() {
    if (Pe(), !ye.length || !t.mesh) {
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
const cn = (t) => {
  if (!isFinite(t) || t === 0) return "0";
  const y = Math.abs(t);
  return y >= 1e-3 && y < 1e7 ? String(+t.toPrecision(15)) : t.toExponential(14);
};
function Ps(t, y) {
  var _a, _b, _c, _d, _e, _f, _g;
  const g = ((_a = t.nodes) == null ? void 0 : _a.rawVal) ?? [], S = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[y];
  if (!S || S.length !== 2) throw new Error(`El elemento ${y} no es una barra (2 nudos).`);
  const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, z = (te) => {
    var _a2, _b2;
    return ((_b2 = (_a2 = A[te]) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, y)) ?? 0;
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
    const te = Me.length >= 12 ? Me.slice(0, 12).map((Ae, nt) => Ae ? nt : -1).filter((Ae) => Ae >= 0) : Me.slice(0, 6).map((Ae, nt) => Ae ? [3, 4, 5, 9, 10, 11][nt] : -1).filter((Ae) => Ae >= 0), Ie = [...Array(12).keys()].filter((Ae) => !te.includes(Ae)), ge = te.length, ve = te.map((Ae, nt) => [...te.map((st) => oe[Ae][st]), ...te.map((st, Ue) => nt === Ue ? 1 : 0)]);
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
    const Pe = ve.map((Ae) => Ae.slice(ge)), Xe = Array.from({ length: 12 }, () => Array(12).fill(0));
    for (const Ae of Ie) for (const nt of Ie) {
      let st = 0;
      for (let Ue = 0; Ue < ge; Ue++) for (let D = 0; D < ge; D++) st += oe[Ae][te[Ue]] * Pe[Ue][D] * oe[te[D]][nt];
      Xe[Ae][nt] = oe[Ae][nt] - st;
    }
    oe = Xe;
  }
  return { K: oe, L: ae, phiZ: he, phiY: ye };
}
function zs(t, y) {
  var _a, _b, _c, _d, _e, _f, _g;
  const g = ((_a = t.nodes) == null ? void 0 : _a.rawVal) ?? [], S = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[y];
  if (!S || S.length !== 2) throw new Error(`El elemento ${y} no es una barra (2 nudos).`);
  const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, z = (me, Q = 0) => {
    var _a2, _b2;
    return ((_b2 = (_a2 = A[me]) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, y)) ?? Q;
  }, $ = g[S[0]], P = g[S[1]], L = (_e = (_d = A.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, y), Y = (_g = (_f = A.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, y), N = z("localAngles", 0), ee = [], U = (me = "") => ee.push(me);
  if (U("% ============================================================"), U(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${y + 1} (indice ${y} del motor)`), U("%  Generado por Hekatan Struct con los datos que recibe el motor."), U("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), U("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), U("% ============================================================"), U(), U("% --- Datos de la barra -------------------------------------------------"), U(`xi = [${$.map(cn).join(" ")}];      % nudo i (${S[0]})`), U(`xj = [${P.map(cn).join(" ")}];      % nudo j (${S[1]})`), U(`E  = ${cn(z("elasticities"))};      % modulo de elasticidad`), U(`G  = ${cn(z("shearModuli"))};      % modulo de cortante`), U(`A  = ${cn(z("areas"))};      % area`), U(`Iz = ${cn(z("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), U(`Iy = ${cn(z("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), U(`J  = ${cn(z("torsionalConstants"))};      % constante de torsion`), U(`AsY = ${cn(z("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), U(`AsZ = ${cn(z("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), N && U(`% ang = ${cn(N)} grados: gira la seccion en T, NO cambia esta matriz local.`), U(), U("L = sqrt(sum((xj - xi).^2));"), U(), U("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), U("bernY = AsY < 0;   bernZ = AsZ < 0;"), U("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), U("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), U("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), U("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), U(), U("EA_L = E*A/L;          % axial"), U("GJ_L = G*J/L;          % torsion"), U("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), U("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), U("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), U("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), U(), U("% --- Matriz local (misma disposicion que el C++) ----------------------"), U("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), U("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), U("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), U("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), U("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), U("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), U("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), U("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), U("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), U("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), U("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), U("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), Y && Y.some((me) => me > 1e-12) && (U(), U("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), U(`kres = [${Y.slice(0, 12).map(cn).join(" ")}];`), U("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), L && L.some(Boolean)) {
    const me = L.length >= 12 ? L.slice(0, 12).map((Q, q) => Q ? q + 1 : 0).filter(Boolean) : L.slice(0, 6).map((Q, q) => Q ? [4, 5, 6, 10, 11, 12][q] : 0).filter(Boolean);
    U(), U("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), U(`f = [${me.join(" ")}];              % GDL liberados`), U("r = setdiff(1:12, f);                % GDL que quedan"), U("Kc = zeros(12);"), U("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), U("K = Kc;");
  }
  return U(), U("% --- Resultado ---------------------------------------------------------"), U(`fprintf('Barra ${y + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), U("disp('K local (12x12):');"), U("disp(K);"), { nombre: `K_local_barra_${y + 1}.m`, texto: ee.join(`
`) + `
` };
}
const bl = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Ml = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Ln = 1e-3;
function bo(t, y) {
  return y === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : y === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function vl(t, y) {
  const g = Math.abs(y[0] - t[0]);
  return Math.abs(y[1] - t[1]) < Ln ? { plano: "XZ", en: t[1] } : g < Ln ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function _l(t, y) {
  var _a, _b;
  let g = null, k = { plano: "XZ", en: 0 };
  const S = () => {
    var _a2, _b2;
    const K = ((_a2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _a2.rawVal) ?? ((_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.val);
    return !K || K === "none" ? null : String(K).replace(/^contour:/, "");
  }, A = (K) => {
    var _a2, _b2;
    const Z = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], R = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Set();
    for (const X of R) {
      if (X.length !== 2) continue;
      const T = Z[X[0]], H = Z[X[1]];
      if (!T || !H) continue;
      const pe = bo(T, K), fe = bo(H, K);
      Math.abs(pe.fuera - fe.fuera) < Ln && G.add(Math.round(pe.fuera * 1e3) / 1e3);
    }
    return [...G].sort((X, T) => X - T);
  };
  function z(K) {
    var _a2, _b2;
    if (K == null ? void 0 : K.plano) k = { plano: K.plano, en: K.en ?? A(K.plano)[0] ?? 0 };
    else {
      const R = [...window.__hekatanModelSelection ?? []].reverse().find((T) => T.type === "frame"), G = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], X = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
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
      const H = A(k.plano), pe = H.findIndex((oe) => Math.abs(oe - k.en) < Ln), fe = Math.max(0, Math.min(H.length - 1, (pe < 0 ? 0 : pe) + T));
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
    var _a2, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const K = new Set(N && !N.hidden && ee >= 0 ? me(ee) : []), Z = g.querySelector(".hk-d2-svg"), R = g.querySelector(".hk-d2-tit"), G = g.querySelector(".hk-d2-pie"), X = g.querySelector(".hk-d2-plano"), T = g.querySelector(".hk-d2-en");
    X.value = k.plano;
    const H = A(k.plano), pe = k.plano === "XZ" ? "y" : k.plano === "YZ" ? "x" : "z", fe = k.plano === "XY" ? "Planta" : "P\xF3rtico";
    T.innerHTML = H.map((Te, ot) => `<option value="${Te}" ${Math.abs(Te - k.en) < Ln ? "selected" : ""}>${fe} ${ot + 1} \xB7 ${pe} = ${Te.toFixed(2)} m</option>`).join("");
    const oe = S(), W = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], Me = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], te = oe ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[oe] : null;
    Z.innerHTML = "";
    const Ie = Z.clientWidth || 880, ge = Z.clientHeight || 480, ve = [];
    if (Me.forEach((Te, ot) => {
      if (Te.length !== 2) return;
      const je = W[Te[0]], Fe = W[Te[1]];
      if (!je || !Fe) return;
      const De = bo(je, k.plano), We = bo(Fe, k.plano);
      Math.abs(De.fuera - k.en) < Ln && Math.abs(We.fuera - k.en) < Ln && ve.push({ i: ot, a: De, b: We });
    }), !ve.length) {
      G.textContent = "No hay barras en este plano.", R.textContent = "";
      return;
    }
    let Pe = 1 / 0, Xe = -1 / 0, Ae = 1 / 0, nt = -1 / 0;
    for (const Te of ve) for (const ot of [Te.a, Te.b]) Pe = Math.min(Pe, ot.u), Xe = Math.max(Xe, ot.u), Ae = Math.min(Ae, ot.v), nt = Math.max(nt, ot.v);
    const st = Xe - Pe || 1, Ue = nt - Ae || 1, D = 0.12 * Math.max(st, Ue), J = 46, re = Math.min((Ie - 2 * J) / (st + 2 * D), (ge - 2 * J) / (Ue + 2 * D)), ie = (Ie - st * re) / 2, _e = (ge - Ue * re) / 2, Ce = (Te) => ie + (Te - Pe) * re, Ye = (Te) => ge - (_e + (Te - Ae) * re), Le = "http://www.w3.org/2000/svg", Qe = (Te, ot, je) => {
      const Fe = document.createElementNS(Le, Te);
      for (const De in ot) Fe.setAttribute(De, String(ot[De]));
      return je != null && (Fe.textContent = je), Z.appendChild(Fe), Fe;
    }, Ke = /* @__PURE__ */ new Map();
    for (const Te of ve) {
      const ot = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Te.i)) ?? 0, je = bo(Ns(oe ?? "normals", Bs(W[Me[Te.i][0]], W[Me[Te.i][1]], ot)), k.plano), Fe = Math.hypot(je.u, je.v);
      Ke.set(Te.i, Fe > 0.3 ? [je.u / Fe, -je.v / Fe] : null);
    }
    const ze = ve.filter((Te) => !Ke.get(Te.i)).length;
    let Ne = 0;
    if (te) for (const Te of ve) {
      if (!Ke.get(Te.i)) continue;
      const ot = te instanceof Map ? te.get(Te.i) : te[Te.i];
      ot && (Ne = Math.max(Ne, Math.abs(ot[0] ?? 0), Math.abs(ot[1] ?? 0)));
    }
    const qe = 0.12 * Math.max(st, Ue) * re, rt = Ne > 0 ? qe / Ne : 0, et = oe === "bendingsY" || oe === "bendingsZ", Mt = (Te) => Math.abs(Te) >= 100 ? Te.toFixed(1) : Math.abs(Te) >= 10 ? Te.toFixed(2) : Te.toFixed(3), gt = [];
    for (const Te of ve) {
      const ot = Ce(Te.a.u), je = Ye(Te.a.v), Fe = Ce(Te.b.u), De = Ye(Te.b.v), We = Ke.get(Te.i), [Be, at] = We ?? [0, 0], lt = te && We ? te instanceof Map ? te.get(Te.i) : te[Te.i] : null, [ht, tt] = lt ? $a(oe, lt) : [0, 0];
      if (lt && rt > 0) {
        const Kt = [ot + Be * ht * rt * 1, je + at * ht * rt * 1], St = [Fe + Be * tt * rt * 1, De + at * tt * rt * 1], zt = ht + tt >= 0 ? "#3fa7d6" : "#d9534f";
        Qe("polygon", { points: `${ot},${je} ${Kt[0]},${Kt[1]} ${St[0]},${St[1]} ${Fe},${De}`, fill: zt, "fill-opacity": 0.38, stroke: zt, "stroke-width": 1.2 }), gt.push({ x: Kt[0] + Be * 12, y: Kt[1] + at * 12, t: Mt(ht), peso: Math.abs(ht) }), gt.push({ x: St[0] + Be * 12, y: St[1] + at * 12, t: Mt(tt), peso: Math.abs(tt) });
      }
      Qe("line", { x1: ot, y1: je, x2: Fe, y2: De, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), K.has(Te.i) && Qe("line", { x1: ot, y1: je, x2: Fe, y2: De, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const ct = Qe("line", { x1: ot, y1: je, x2: Fe, y2: De, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      ct.addEventListener("click", () => Q(Te.i));
      const $t = document.createElementNS(Le, "title");
      $t.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", ct.appendChild($t);
    }
    for (const Te of ve) for (const ot of [Te.a, Te.b]) k.plano !== "XY" && Math.abs(ot.v - Ae) < Ln && Qe("rect", { x: Ce(ot.u) - 6, y: Ye(ot.v), width: 12, height: 7, fill: "#b03a3a" });
    const fn = [];
    gt.sort((Te, ot) => ot.peso - Te.peso);
    for (const Te of gt) Te.peso < 0.02 * Ne || fn.some((ot) => Math.hypot(ot.x - Te.x, ot.y - Te.y) < 34) || (fn.push(Te), Qe("text", { x: Te.x, y: Te.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Te.t));
    const kt = oe ? bl[oe] ?? oe : "sin resultado";
    R.textContent = `${kt} \xB7 ${k.plano === "XY" ? "planta" : "alzado"} ${k.plano} en ${pe} = ${k.en.toFixed(2)} m`, G.textContent = oe ? `${ve.length} barras en el plano \xB7 m\xE1ximo ${Mt(Ne)} ${Ml[oe] ?? ""}` + (et ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ze ? ` \xB7 ${ze} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const L = () => {
    try {
      P();
    } catch {
    }
  };
  (y == null ? void 0 : y.frameResults) && ((_b = (_a = window.van) == null ? void 0 : _a.derive) == null ? void 0 : _b.call(_a, () => {
    y.frameResults.val, L();
  }));
  let Y = null;
  setInterval(() => {
    var _a2, _b2;
    const K = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal, Z = (_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.rawVal, R = [K, Z];
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
    var _a2, _b2;
    const Z = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], R = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], G = /* @__PURE__ */ new Map();
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
        const Me = (G.get(oe) ?? []).filter((Ie) => Ie !== fe);
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
    var _a2, _b2, _c;
    if (!N || N.hidden || ee < 0) return;
    const K = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], Z = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], R = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!Z[ee]) return;
    const G = me(ee), X = [];
    let T = 0, H = -1;
    G.forEach((Xe, Ae) => {
      const [nt, st] = Z[Xe], Ue = Ae === 0 ? G.length > 1 && Z[G[1]].includes(nt) : nt !== H, D = Ue ? st : nt, J = Ue ? nt : st, re = Math.hypot(K[J][0] - K[D][0], K[J][1] - K[D][1], K[J][2] - K[D][2]);
      X.push({ x: T, e: Xe, fin: Ue ? 1 : 0 }), T += re, X.push({ x: T, e: Xe, fin: Ue ? 0 : 1 }), H = J;
    });
    const pe = T, fe = (Xe, Ae) => {
      const nt = R[Xe], st = nt ? nt instanceof Map ? nt.get(Ae.e) : nt[Ae.e] : null;
      return st ? $a(Xe, st)[Ae.fin] : 0;
    }, oe = K[Z[G[0]][0]], W = (Xe) => Xe.toFixed(2);
    N.querySelector(".hk-b-tit").textContent = "L = " + pe.toFixed(2) + " m \xB7 " + G.length + " tramo(s) \xB7 desde (" + W(oe[0]) + ", " + W(oe[1]) + ", " + W(oe[2]) + ")";
    const Me = U === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], te = N.querySelector(".hk-b-cuerpo");
    te.innerHTML = "";
    const Ie = Math.max(300, te.clientWidth), ge = 124, ve = 46, Pe = (ge - 14) / 2;
    for (const [Xe, Ae, nt, st] of Me) {
      const Ue = X.map((Ne) => fe(Xe, Ne)), D = Math.max(...Ue), J = Math.min(...Ue), re = Math.max(Math.abs(D), Math.abs(J)) || 1, ie = (Ne) => ve + Ne / (pe || 1) * (Ie - 2 * ve), _e = (Ne) => Pe + (st ? 1 : -1) * (Ne / re) * (Pe - 16), Ce = (Ne) => Math.abs(Ne) >= 100 ? Ne.toFixed(1) : Math.abs(Ne) >= 10 ? Ne.toFixed(2) : Ne.toFixed(3);
      let Ye = ie(0) + "," + Pe + " ";
      X.forEach((Ne, qe) => {
        Ye += ie(Ne.x) + "," + _e(Ue[qe]) + " ";
      }), Ye += ie(pe) + "," + Pe;
      const Le = Ue.indexOf(D), Qe = Ue.indexOf(J), Ke = (Ne, qe) => {
        const rt = _e(Ue[Ne]) + (_e(Ue[Ne]) < Pe ? -5 : 13);
        return '<text x="' + ie(X[Ne].x) + '" y="' + rt + '" text-anchor="middle" fill="' + qe + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Ce(Ue[Ne]) + "</text>";
      }, ze = st ? "#d9534f" : "#3fa7d6";
      te.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Ae + ' <span style="color:#6f7d90;font-weight:400">(' + nt + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Ce(D) + " \xB7 m\xEDn " + Ce(J) + (st ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + Ie + '" height="' + ge + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + ve + '" y1="' + Pe + '" x2="' + (Ie - ve) + '" y2="' + Pe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Ye + '" fill="' + ze + '" fill-opacity=".35" stroke="' + ze + '" stroke-width="1.4"/>' + Ke(0, "#f2f5fa") + Ke(X.length - 1, "#f2f5fa") + (Le > 0 && Le < X.length - 1 ? Ke(Le, "#8fd3ff") : "") + (Qe > 0 && Qe < X.length - 1 && Qe !== Le ? Ke(Qe, "#ff9f9a") : "") + '<text x="' + ve + '" y="' + (ge - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (Ie - ve) + '" y="' + (ge - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + pe.toFixed(2) + " m</text></svg>");
    }
  }
  window.__hekatanDiagramaBarra = Q;
  function se(K) {
    const { nombre: Z, texto: R } = zs(t, K), G = URL.createObjectURL(new Blob([R], { type: "text/plain" })), X = document.createElement("a");
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
    return Z && se(K), zs(t, K);
  };
  let xe = null, he = null, ye = -1;
  function de(K) {
    var _a2, _b2, _c, _d, _e;
    if (ye = K, !he) {
      he = document.createElement("div"), he.id = "hk-klocal", he.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(he);
      const oe = document.createElement("style");
      oe.textContent = "#hk-klocal[hidden]{display:none!important}", document.head.appendChild(oe);
    }
    let Z;
    try {
      Z = Ps(t, K);
    } catch (oe) {
      alert(String(oe));
      return;
    }
    const R = (oe) => Math.abs(oe) < 1e-12 ? "0" : Math.abs(oe) >= 1e5 || Math.abs(oe) < 0.01 ? oe.toExponential(4) : oe.toPrecision(6), G = ((_a2 = t.elementInputs) == null ? void 0 : _a2.rawVal) ?? {}, X = (_c = (_b2 = G.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, K), T = (_e = (_d = G.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, K), H = [X && (X[0] > 1e-12 || X[1] > 1e-12) ? `brazos r\xEDgidos ${X[0]}\xB7L / ${X[1]}\xB7L (se aplican en K global: R\u1D40\xB7K\xB7R)` : "", T ? `ang ${T}\xB0 (gira T, no esta K)` : ""].filter(Boolean).join(" \xB7 "), pe = ["u1 i", "u2 i", "u3 i", "\u03B81 i", "\u03B82 i", "\u03B83 i", "u1 j", "u2 j", "u3 j", "\u03B81 j", "\u03B82 j", "\u03B83 j"], fe = Z.K.map((oe, W) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${pe[W]}</th>` + oe.map((Me) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(Me) < 1e-12 ? "#4a5568" : Me < 0 ? "#ff9f9a" : "#e6edf5"}">${R(Me)}</td>`).join("") + "</tr>").join("");
    he.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${K + 1}</b><span style="color:#9fb0c6">L = ${Z.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${Z.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${Z.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${H ? ` \xB7 <b style="color:#f59e0b">${H}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${pe.map((oe) => `<th style="color:#9fb0c6;padding:2px 6px">${oe}</th>`).join("")}</tr>${fe}</table></div>`, he.querySelector(".hk-k-x").addEventListener("click", () => {
      he.hidden = true;
    }), he.querySelector(".hk-k-m").addEventListener("click", () => se(ye)), he.hidden = false;
  }
  return window.addEventListener("hk:model-selection", (K) => {
    var _a2;
    const Z = (_a2 = K.detail) == null ? void 0 : _a2.ultimo;
    xe || (xe = document.createElement("button"), xe.id = "hk-klocal-chip", xe.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(xe), xe.addEventListener("click", () => {
      const R = Number(xe.dataset.idx);
      R >= 0 && de(R);
    })), xe.hidden = true, Z && Z.type === "frame" && (xe.dataset.idx = String(Z.idx), xe.textContent = "\u{1F4D0} Ver K local \xB7 barra " + (Z.idx + 1), he && (he.hidden = true), xe.hidden = false);
  }), window.__hekatanKLocal = (K) => Ps(t, K), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = z, { abrir: z, abrirBarra: Q };
}
function Cs(t, y = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(y)), setTimeout(() => {
    ue.derive(() => {
      ta.val, g.style.background = Li();
    });
  });
  const k = document.createElement("div");
  k.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(k), setTimeout(() => {
    ue.derive(() => {
      k.textContent = Va.val ? `[${Va.val}]` : "";
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
  const g = ko.val;
  if (g) return As(g[0] + y * (g[1] - g[0]));
  const k = t.filter((z) => Number.isFinite(z));
  if (k.length === 0) return "0";
  const [S, A] = La(k);
  return As(S + y * (A - S));
}
function As(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const y = Math.abs(t);
  return y < 1e-3 || y >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function Rl({ mesh: t, settingsObj: y, drawingObj: g, objects3D: k, solids: S }) {
  Ei.DEFAULT_UP = new F(0, 0, 1);
  const A = document.createElement("div"), z = new zi(), $ = new Ci(45, 1, 0.1, 2 * 1e6), P = new Ai(-10, 10, 10, -10, -1e3, 2e6);
  let L = $;
  const Y = new Fi({ antialias: true });
  Y.localClippingEnabled = true;
  const N = new vs($, Y.domElement);
  N.enableDamping = true, N.dampingFactor = 0.1, N.screenSpacePanning = true, N.zoomSpeed = 0.8, N.panSpeed = 1.2, N.rotateSpeed = 0.9, N.keyPanSpeed = 12, N.listenToKeyEvents(window), N.touches = { ONE: Go.ROTATE, TWO: Go.DOLLY_PAN }, Y.domElement.addEventListener("wheel", (D) => {
    if (!D.ctrlKey && Math.abs(D.deltaX) > Math.abs(D.deltaY) * 1.5) {
      D.preventDefault();
      const J = N.target, re = new F().subVectors($.position, J), ie = new F();
      ie.crossVectors($.up, re).normalize();
      const Ce = re.length() * 1e-3 * N.panSpeed;
      J.addScaledVector(ie, D.deltaX * Ce), $.position.addScaledVector(ie, D.deltaX * Ce), N.update();
    }
  }, { passive: false });
  const ee = new vo(new F(-1, 0, 0), 0), U = new vo(new F(0, -1, 0), 0), me = new vo(new F(0, 0, -1), 0);
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
  let ye = Ca(q.gridSize.rawVal, he());
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
  const K = qn();
  Y.setClearColor(K.background, 1);
  const Z = q.gridSize.rawVal, R = Z * 0.5 + Z * 0.5 / Math.tan(45 * 0.5);
  $.position.set(0, 0, R), $.up.set(0, 1, 0), N.target.set(0, 0, 0), N.minDistance = 0.1, N.maxDistance = 1e4, A.__settings = q, N.zoomSpeed = 1, N._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, N.update();
  let G = ks(q.gridSize.rawVal, q.flipAxes.rawVal);
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
    var _a, _b, _c;
    const D = q.gridSize.val, J = q.flipAxes.val;
    if (q.gridXY.val, q.gridXZ.val, q.gridYZ.val, q.gridStep.val, q.gridMajor.val, H) {
      H = false;
      return;
    }
    z.remove(ye), (_a = ye.traverse) == null ? void 0 : _a.call(ye, (Ce) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Ce.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), ye = Ca(D, he()), ye.visible = q.gridVisible.rawVal, z.add(ye), de(), z.remove(G), G.traverse((Ce) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Ce.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), G = ks(D, J), z.add(G);
    const re = D * 0.5 + D * 0.5 / Math.tan(45 * 0.5);
    $.position.distanceTo(N.target);
    const ie = Math.abs($.position.x) < 0.1 && Math.abs($.position.y) < 0.1 && $.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ie ? $.position.set(0, 0, re) : $.position.set(0.5 * D, -re, 0.5 * D), N.target.set(0, 0, 0)), N.minDistance = Math.max(0.05, D * 0.01), N.maxDistance = Math.max(50, D * 50), N.update(), te();
  }), new ResizeObserver((D) => {
    var _a, _b;
    for (const J of D) {
      const re = (_a = J.target) == null ? void 0 : _a.clientWidth, ie = (_b = J.target) == null ? void 0 : _b.clientHeight;
      if (re === 0 || ie === 0) continue;
      const Ce = (fe ? re / 2 : re) / ie;
      $.aspect = Ce, $.updateProjectionMatrix();
      const Ye = P.top;
      if (P.left = -Ye * Ce, P.right = Ye * Ce, P.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = Ce, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Le = oe, Qe = Le.top;
        Le.left = -Qe * Ce, Le.right = Qe * Ce, Le.updateProjectionMatrix();
      }
      Y.setSize(re, ie), te();
    }
  }).observe(A), N.addEventListener("change", te), ue.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, q.displayScale.val, q.nodes.val, q.elements.val, (_g = q.edges) == null ? void 0 : _g.val, q.elemColumns.val, q.elemBeams.val, q.nodesIndexes.val, q.elementsIndexes.val, q.orientations.val, q.sections.val, q.secColumns.val, q.secBeams.val, q.secFloor.val, q.supports.val, q.loads.val, q.deformedShape.val, q.nodeResults.val, q.frameResults.val, q.shellResults.val, (_h = q.solidResults) == null ? void 0 : _h.val, (_i2 = q.extruded) == null ? void 0 : _i2.val, setTimeout(te);
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
  function Ie(D) {
    L = D, N.object = D, N.update(), te();
  }
  function ge(D, J) {
    fe = D, J && (oe = J);
    const re = A.clientWidth || 1, ie = A.clientHeight || 1, Ce = (D ? re / 2 : re) / ie;
    $.isPerspectiveCamera && ($.aspect = Ce, $.updateProjectionMatrix());
    const Ye = P.top;
    if (P.left = -Ye * Ce, P.right = Ye * Ce, P.updateProjectionMatrix(), D && oe) {
      if (W ? (W.object = oe, W.update()) : (W = new vs(oe, Y.domElement), W.enableDamping = true, W.dampingFactor = 0.1, W.screenSpacePanning = true, W.zoomSpeed = 0.8, W.panSpeed = 1.2, W.rotateSpeed = 0.9, W.touches = { ONE: Go.ROTATE, TWO: Go.DOLLY_PAN }, W.target.copy(N.target), W.addEventListener("change", te), W.enabled = false), !Me) {
        const Le = (Qe) => {
          if (!fe || !W) return;
          const Ke = Y.domElement.getBoundingClientRect(), ze = Qe.clientX - Ke.left, Ne = Ke.width / 2, qe = ze >= Ne;
          N.enabled = !qe, W.enabled = qe;
        };
        Y.domElement.addEventListener("pointerdown", Le, true), Y.domElement.addEventListener("wheel", Le, { capture: true, passive: true }), Me = true;
      }
    } else D || (N.enabled = true, W && (W.enabled = false));
    A.__splitMode = D, window.__hekatanSplitMode = D, window.__hekatanSplitCamera = D ? oe : null, te();
  }
  if (t) {
    z.add(Di(q, se, ae), $i(t, q, se), Yi(q, se, ae), Xi(t, q, se, ae), Bi(t, q, se, ae), Ni(t, q, se, ae), qi(t, q, se, ae), Ki(t, q, se, ae), Oi(t, q, se), tl(t, q, se, ae), Qi(t, q, se, ae)), window.__hekatanDiagrama2D || (_l(t, q), Y.domElement.addEventListener("dblclick", () => {
      var _a;
      const Le = (_a = q.frameResults) == null ? void 0 : _a.rawVal;
      !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((Ke) => Ke.type === "frame") || setTimeout(() => {
        var _a2;
        return (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }, 60);
    }));
    const D = yl({ scene: z, rendererElm: Y.domElement, getActiveCamera: () => L, derivedNodes: se, derivedDisplayScale: ae, mesh: t, settings: q, render: te });
    z.add(D);
    const J = El(t, q), re = al(t, q, se, J), ie = Cs(J);
    z.add(re), A.appendChild(ie);
    const _e = cl(t, q, se);
    z.add(_e);
    const Ce = _e.__colorMapValues, Ye = Cs(Ce);
    Ye.id = "frame-legend", A.appendChild(Ye), ue.derive(() => {
      var _a;
      const Le = q.shellResults.val != "none", Qe = (((_a = q.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", Ke = Le || Qe, ze = q.frameResults.val.startsWith("contour:"), Ne = J.val.some((qe) => Number.isFinite(qe));
      ie.hidden = !Ke || !Ne, re.visible = Ke, Ye.hidden = !ze;
    });
  }
  if (S) {
    const D = new Vs(16777215, 0.5);
    z.add(D);
    const J = new Qo(16777215, 0.5);
    J.position.set(30, 25, -10), J.shadow.mapSize.width = 1024, J.shadow.mapSize.height = 1024, z.add(J);
    const re = 10;
    J.shadow.camera.left = -re, J.shadow.camera.right = re, J.shadow.camera.top = re, J.shadow.camera.bottom = -re, J.shadow.camera.far = 1e3;
    const ie = new Qo(16777215, 0.5);
    ie.color.setHSL(11, 43, 96), ie.position.set(-10, 0, 30), z.add(ie), ue.derive(() => {
      (S == null ? void 0 : S.val.length) && (z.remove(...S.oldVal), z.add(...S.rawVal), te());
    }), ue.derive(() => {
      S.rawVal.forEach((_e) => _e.visible = q.solids.val), te();
    });
  }
  if (k) {
    const D = [], J = (ie) => {
      var _a;
      return ((_a = ie == null ? void 0 : ie.userData) == null ? void 0 : _a.isCota) ? q.showCotas.val : q.custom3D.val;
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
  g && nl({ drawingObj: g, gridObj: ye, scene: z, getActiveCamera: () => L, controls: N, gridSize: Z, derivedDisplayScale: ae, rendererElm: Y.domElement, viewerRender: te }), Es((D, J) => {
    var _a;
    Y.setClearColor(J.background, 1), z.remove(ye), (_a = ye.traverse) == null ? void 0 : _a.call(ye, (re) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = re.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), ye = Ca(q.gridSize.rawVal, { planes: xe() }), z.add(ye), A.style.setProperty("--awatif-legend-color", J.legendMarker), te();
  });
  const ve = { scene: z, perspCamera: $, orthoCamera: P, get camera() {
    return L;
  }, controls: N, renderer: Y, rendererElm: Y.domElement, render: te, setActiveCamera: Ie, setSplitMode: ge, get splitMode() {
    return fe;
  }, get splitCamera() {
    return oe;
  }, settings: q };
  A.__ctx = ve;
  const Pe = document.createElement("div");
  Pe.id = "hk-nav-camara", Pe.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
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
    const Le = _e * 0.05;
    re.addScaledVector(Ce, -D * Le), re.addScaledVector(Ye, J * Le), L.position.addScaledVector(Ce, -D * Le), L.position.addScaledVector(Ye, J * Le), N.update(), te();
  }, nt = (D) => {
    const J = new F().subVectors(L.position, N.target);
    J.multiplyScalar(D), L.position.copy(N.target).add(J), N.update(), te();
  }, st = () => {
    const D = document.createElement("div");
    return D.style.cssText = "width:32px;height:32px;", D;
  };
  return Pe.append(st()), Pe.append(Xe("\u2191", "Pan arriba", () => Ae(0, 1))), Pe.append(Xe("\u2295", "Zoom in", () => nt(0.85))), Pe.append(Xe("\u2190", "Pan izquierda", () => Ae(-1, 0))), Pe.append(Xe("\u2302", "Reset vista", () => {
    N.reset(), te();
  })), Pe.append(Xe("\u2192", "Pan derecha", () => Ae(1, 0))), Pe.append(Xe("\u2296", "Zoom out", () => nt(1.18))), Pe.append(Xe("\u2193", "Pan abajo", () => Ae(0, -1))), Pe.append(st()), getComputedStyle(A).position === "static" && (A.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && A.appendChild(Pe), A;
}
function Sl(t, y) {
  return ue.derive(() => {
    var _a, _b, _c, _d;
    if (!y.deformedShape.val) return ((_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], k = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!k || g.length === 0) return g;
    const S = y.deformScale.val, A = y.deformScale.val * y.deformScaleZ.val, z = Number.isFinite(S) ? S : 1, $ = Number.isFinite(A) ? A : 1;
    return g.map((P, L) => {
      var _a2;
      const Y = ((_a2 = k.get(L)) == null ? void 0 : _a2.slice(0, 3)) ?? [0, 0, 0], N = Number.isFinite(Y[0]) ? Y[0] : 0, ee = Number.isFinite(Y[1]) ? Y[1] : 0, U = Number.isFinite(Y[2]) ? Y[2] : 0;
      return [P[0] + N * z, P[1] + ee * z, P[2] + U * $];
    });
  });
}
const ko = ue.state(null), Va = ue.state(""), Pl = ue.state("kN"), zl = ue.state("mm"), Cl = ue.state("kN/m\xB2"), Al = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Fs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Fl = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function El(t, y) {
  const g = ue.state([]);
  let k;
  return ((S) => {
    S.bendingXX = "bendingXX", S.bendingYY = "bendingYY", S.bendingXY = "bendingXY", S.membraneXX = "membraneXX", S.membraneYY = "membraneYY", S.membraneXY = "membraneXY", S.tranverseShearX = "tranverseShearX", S.tranverseShearY = "tranverseShearY", S.membranePrincipalMax = "membranePrincipalMax", S.membranePrincipalMin = "membranePrincipalMin", S.bendingPrincipalMax = "bendingPrincipalMax", S.bendingPrincipalMin = "bendingPrincipalMin", S.transverseShearMax = "transverseShearMax", S.vonMises = "vonMises", S.pressure = "pressure", S.displacementX = "displacementX", S.displacementY = "displacementY", S.displacementZ = "displacementZ";
  })(k || (k = {})), ue.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o2, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const S = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), me = (D, J) => {
      D == null ? void 0 : D.forEach((re, ie) => {
        const _e2 = t.elements.val[ie];
        if (_e2) for (let Ce = 0; Ce < _e2.length; Ce++) J.set(_e2[Ce], [re[Ce] ?? re[0]]);
      });
    };
    me((_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, S), me((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, A), me((_f = (_e = t.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, z), me((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, $), me((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, P), me((_l2 = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l2.membraneXY, L), me((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, Y), me((_p = (_o2 = t.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, N), me((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), me((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, U);
    const Q = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), he = (D, J, re, ie, _e2) => {
      D.forEach((Ce, Ye) => {
        var _a2, _b2;
        const Le = Ce[0] ?? 0, Qe = ((_a2 = J.get(Ye)) == null ? void 0 : _a2[0]) ?? 0, Ke = ((_b2 = re.get(Ye)) == null ? void 0 : _b2[0]) ?? 0, ze = (Le + Qe) / 2, Ne = Math.hypot((Le - Qe) / 2, Ke);
        ie.set(Ye, [ze + Ne]), _e2.set(Ye, [ze - Ne]);
      });
    };
    he($, P, L, Q, q), he(S, A, z, ae, se), Y.forEach((D, J) => {
      var _a2;
      xe.set(J, [Math.hypot(D[0] ?? 0, ((_a2 = N.get(J)) == null ? void 0 : _a2[0]) ?? 0)]);
    });
    const ye = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, de = (_w = y.solidResults) == null ? void 0 : _w.val, Z = de && de !== "none" ? de : y.shellResults.val, R = ye == null ? void 0 : ye[Z], G = { bendingXX: [S, 0], bendingYY: [A, 0], bendingXY: [z, 0], membraneXX: [$, 0], membraneYY: [P, 0], membraneXY: [L, 0], tranverseShearX: [Y, 0], tranverseShearY: [N, 0], membranePrincipalMax: [Q, 0], membranePrincipalMin: [q, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [se, 0], transverseShearMax: [xe, 0], vonMises: [ee, 0], pressure: [U, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, X = y.shellResults.val, T = Pl.val, H = zl.val, pe = X === "displacementX" || X === "displacementY" || X === "displacementZ", fe = X === "bendingXX" || X === "bendingYY" || X === "bendingXY" || X === "bendingPrincipalMax" || X === "bendingPrincipalMin", oe = X === "membraneXX" || X === "membraneYY" || X === "membraneXY" || X === "membranePrincipalMax" || X === "membranePrincipalMin", W = X === "vonMises" || X === "pressure", Me = X === "tranverseShearX" || X === "tranverseShearY" || X === "transverseShearMax", te = (_D = y.solidResults) == null ? void 0 : _D.val, Ie = te === "vonMises" || te === "sigmaXX" || te === "sigmaYY" || te === "sigmaZZ" || te === "tauXY" || te === "tauYZ" || te === "tauXZ", ge = te === "ux" || te === "uy" || te === "uz", ve = Cl.val, Pe = Ie ? Fl[ve] : ge || pe ? Fs[H] : fe || oe || W || Me ? 1 / Al[T] : 1, Xe = Ie ? ve : ge || pe ? H : fe ? `${T}\xB7m/m` : oe ? `${T}/m\xB2` : W ? `${T}/m\xB2` : Me ? `${T}/m` : "";
    Va.val = Xe, ko.val = Array.isArray(R) && R.length === 2 ? [R[0] * Pe, R[1] * Pe] : null;
    const Ae = Ts.val, st = te && te !== "none" ? [ee, 0] : G[X], Ue = [];
    if (t.nodes.val.forEach((D, J) => {
      const re = st;
      if (!re || !re[0] || typeof re[0].has != "function") return;
      if (!re[0].has(J)) {
        Ue.push(Number.NaN);
        return;
      }
      const ie = re[0].get(J), _e2 = ie ? ie[re[1]] ?? 0 : 0;
      Ue.push(_e2 * Pe);
    }), !ko.val && Ae !== "auto") {
      const D = t.nodes.val, J = /* @__PURE__ */ new Set(), re = (_e2, Ce) => {
        var _a2;
        const Ye = (_a2 = D[_e2[0]]) == null ? void 0 : _a2[Ce];
        return _e2.every((Le) => {
          var _a3;
          return Math.abs((((_a3 = D[Le]) == null ? void 0 : _a3[Ce]) ?? NaN) - Ye) < 1e-6;
        });
      };
      for (const _e2 of t.elements.val) {
        if (_e2.length !== 4) continue;
        const Ce = re(_e2, 2), Ye = !Ce && re(_e2, 0), Le = !Ce && re(_e2, 1);
        if (Ae === "losas" ? Ce : Ae === "muros" ? Ye || Le : Ae === "murosX" ? Ye : Ae === "murosY" ? Le : false) for (const ze of _e2) J.add(ze);
      }
      const ie = [];
      for (const _e2 of J) {
        const Ce = Ue[_e2];
        Number.isFinite(Ce) && ie.push(Ce);
      }
      ie.length && (ko.val = La(ie));
    }
    g.val = Ue;
  }), g;
}
export {
  Ii as a,
  Cs as b,
  Pl as c,
  zl as d,
  Cl as e,
  Rl as g
};
