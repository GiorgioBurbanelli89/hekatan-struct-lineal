import { u as dn, a6 as qo, q as yi, v as ue, a7 as xi, D as Lt, M as dt, B as Ve, F as It, a8 as gi, z as bt, a9 as bi, aa as Mi, h as ms, ab as ws, r as qn, ac as Ho, ad as Jo, a4 as Es, _ as pt, b as wt, L as nn, y as $s, c as vi, ae as _i, f as xt, V as F, $ as In, af as ka, K as ea, d as Et, a as Sa, A as Vs, t as Qo, J as ki, H as Mo, I as Si, ag as Oo, w as Pa, o as Pi, N as Vn, a2 as so, E as ys, S as io, m as go, ah as Cn, g as xs, i as gs, j as bs, P as vo, C as Ms, W as zi, X as Ci, Y as Ai, Z as Fi, T as Go, U as Ei } from "./theme-C-zoknmI.js";
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
      const E = z * k;
      for (let P = 0; P < this.map.length - 1; P++) if (E > this.map[P][0] && E <= this.map[P + 1][0]) {
        const V = this.map[P][0], N = this.map[P + 1][0];
        S.setHex(this.map[P][1], qo), A.setHex(this.map[P + 1][1], qo);
        const B = new dn().lerpColors(S, A, (E - V) / (N - V));
        this.lut.push(B);
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
    const z = 1 / this.n, E = new dn(), P = new dn(), V = new dn();
    for (let N = 1; N >= 0; N -= z) for (let B = this.map.length - 1; B >= 0; B--) if (N < this.map[B][0] && N >= this.map[B - 1][0]) {
      const ee = this.map[B - 1][0], X = this.map[B][0];
      E.setHex(this.map[B - 1][1], qo), P.setHex(this.map[B][1], qo), V.lerpColors(E, P, (N - ee) / (X - ee)), S[A * 4] = Math.round(V.r * 255), S[A * 4 + 1] = Math.round(V.g * 255), S[A * 4 + 2] = Math.round(V.b * 255), S[A * 4 + 3] = 255, A += 1;
    }
    return g.putImageData(k, 0, 0), y;
  }
}
const za = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Rs = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Vi = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Rs, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, ta = ue.state("safe"), Ts = ue.state("auto");
function Ds(t) {
  t = Math.max(0, Math.min(1, t));
  const y = Vi[ta.val] ?? Rs;
  for (let k = 0; k < y.length - 1; k++) {
    const [S, A, z, E] = y[k], [P, V, N, B] = y[k + 1];
    if (t <= P) {
      const ee = (t - S) / (P - S);
      return [A + (V - A) * ee, z + (N - z) * ee, E + (B - E) * ee];
    }
  }
  const g = y[y.length - 1];
  return [g[1], g[2], g[3]];
}
function _s() {
  const y = new Uint8Array(1024);
  for (let k = 0; k < 256; k++) {
    const S = k / 255, [A, z, E] = Ds(S);
    y[k * 4 + 0] = A, y[k * 4 + 1] = z, y[k * 4 + 2] = E, y[k * 4 + 3] = 255;
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
    const z = [], E = [], P = [];
    y.val.forEach((se, ge) => {
      se.length === 3 ? (z.push(se[0], se[1], se[2]), E.push(ge), P.push(0)) : se.length === 4 && (z.push(se[0], se[1], se[2]), z.push(se[0], se[2], se[3]), E.push(ge, ge), P.push(0, 1));
    }), A.geometry.setIndex(new gi(z, 1)), A.userData.faceToElem = E, A.userData.faceLocal = P;
    const V = g.val.filter((se) => Number.isFinite(se));
    let N, B;
    const ee = ko.val;
    if (ee ? (B = ee[0], N = ee[1]) : [B, N] = La(V), N === B) {
      const se = Math.max(Math.abs(N) * 1e-6, 1e-9);
      N += se, B -= se;
    }
    const X = ee && ee[0] > ee[1], we = Math.min(B, N), Q = Math.max(B, N), Z = Q - we, ae = new Float32Array(g.val.length);
    for (let se = 0; se < g.val.length; se++) {
      const ge = g.val[se];
      if (!Number.isFinite(ge)) {
        ae[se] = -1;
        continue;
      }
      const xe = ((X ? Q + we - ge : ge) - we) / Z;
      ae[se] = Math.max(0, Math.min(1, xe));
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
    const X = localStorage.getItem(A);
    X && (z = JSON.parse(X));
  } catch {
  }
  k.style.cssText = ["position:fixed", z ? `left:${z.left}px` : "left:8px", z ? `top:${z.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const E = () => {
    const X = k.querySelector(".tp-rotv_b");
    if (!X) {
      setTimeout(E, 200);
      return;
    }
    X.style.cursor = "move", X.style.userSelect = "none";
    let we = false, Q = 0, Z = 0, ae = 0, se = 0;
    X.addEventListener("mousedown", (ge) => {
      we = true, Q = ge.clientX, Z = ge.clientY;
      const me = k.getBoundingClientRect();
      ae = me.left, se = me.top, k.style.left = `${ae}px`, k.style.top = `${se}px`;
    }), window.addEventListener("mousemove", (ge) => {
      if (!we) return;
      const me = ge.clientX - Q, xe = ge.clientY - Z, de = Math.max(0, Math.min(window.innerWidth - 40, ae + me)), G = Math.max(0, Math.min(window.innerHeight - 40, se + xe));
      k.style.left = `${de}px`, k.style.top = `${G}px`;
    }), window.addEventListener("mouseup", () => {
      if (we) {
        we = false;
        try {
          localStorage.setItem(A, JSON.stringify({ left: parseFloat(k.style.left), top: parseFloat(k.style.top) }));
        } catch {
        }
      }
    });
  };
  if (E(), y == null ? void 0 : y.nodes) {
    S.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const X = S.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    X.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), X.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), X.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), X.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const we = X.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    we.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), we.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), we.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const Q = S.addFolder({ title: "\u{1F441} Ver", expanded: false });
    Q.addBinding(t.nodes, "val", { label: "Nodes" }), Q.addBinding(t.elements, "val", { label: "Elements" }), Q.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), Q.addBinding(t.faces, "val", { label: "  Caras (fill)" }), Q.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), Q.addBinding(t.elemColumns, "val", { label: "    Columnas" }), Q.addBinding(t.elemBeams, "val", { label: "    Vigas" }), Q.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), Q.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), Q.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), Q.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), Q.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), Q.addBinding(t.orientations, "val", { label: "Orientations" }), Q.addBinding(t.sections, "val", { label: "Sections" }), Q.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), Q.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), Q.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), Q.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), Q.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((y == null ? void 0 : y.nodeInputs) || (y == null ? void 0 : y.elementInputs)) {
    const X = S.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    X.addBinding(t.supports, "val", { label: "Supports" }), X.addBinding(t.loads, "val", { label: "Loads" }), X.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), X.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((y == null ? void 0 : y.deformOutputs) || (y == null ? void 0 : y.analyzeOutputs)) {
    const X = S.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = X, X.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), X.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), X.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagrama2D) == null ? void 0 : _a.call(window);
    }), X.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagramaBarra) == null ? void 0 : _a.call(window);
    }), X.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), X.addBinding(ta, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), X.addBinding(Ts, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), X.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), X.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), X.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), X.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && S.addBinding(t.solids, "val", { label: "Solids" });
  const P = S.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), V = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), N = () => {
    const X = window.__hekatanClipApply;
    typeof X == "function" && X();
  };
  let B = [];
  const ee = (X, we) => {
    for (const Z of B) try {
      Z.dispose();
    } catch {
    }
    B = [];
    const Q = (Z, ae) => {
      const se = Math.floor(Math.min(X[ae], -50)), ge = Math.ceil(Math.max(we[ae], 50)), me = ge - se > 400 ? 0.5 : 0.1;
      return V["pos" + Z] = Math.max(se, Math.min(ge, V["pos" + Z])), P.addBinding(V, "pos" + Z, { min: se, max: ge, step: me, label: `  pos ${Z} (m)` }).on("change", N);
    };
    B.push(P.addBinding(V, "enableX", { label: "Cortar X" }).on("change", N), Q("X", 0), P.addBinding(V, "invertX", { label: "  invertir X" }).on("change", N), P.addBinding(V, "enableY", { label: "Cortar Y" }).on("change", N), Q("Y", 1), P.addBinding(V, "invertY", { label: "  invertir Y" }).on("change", N), P.addBinding(V, "enableZ", { label: "Cortar Z" }).on("change", N), Q("Z", 2), P.addBinding(V, "invertZ", { label: "  invertir Z" }).on("change", N));
  };
  return ee([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (X, we) => {
    ee(X, we);
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
      const P = [1 / 0, 1 / 0, 1 / 0], V = [-1 / 0, -1 / 0, -1 / 0];
      for (const N of A) for (let B = 0; B < 3; B++) P[B] = Math.min(P[B], N[B]), V[B] = Math.max(V[B], N[B]);
      z = Math.max(V[0] - P[0], V[1] - P[1], V[2] - P[2], 0.1);
    }
    const E = 0.03 * z;
    S.material.size = E * g.rawVal;
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
  const E = t / 2;
  A = Math.max(z, Math.round(A / z) * z);
  const V = new dn(g.grid).multiplyScalar(1.3), N = new dn(g.grid).multiplyScalar(0.8), B = (Q, Z, ae, se) => {
    const ge = [], me = Q === "xy" ? (I, q) => [I, q, 0] : Q === "xz" ? (I, q) => [I, 0, q] : (I, q) => [0, I, q], xe = Math.floor(E / Z);
    for (let I = -xe; I <= xe; I++) {
      const q = I * Z, Y = me(q, -E), R = me(q, E);
      ge.push(...Y, ...R);
    }
    for (let I = -xe; I <= xe; I++) {
      const q = I * Z, Y = me(-E, q), R = me(E, q);
      ge.push(...Y, ...R);
    }
    const de = new Ve();
    de.setAttribute("position", new It(ge, 3));
    const G = new wt({ color: ae, transparent: true, opacity: se, depthWrite: false }), U = new nn(de, G);
    return U.name = `grid-${Q}-${Z === z ? "minor" : "major"}`, U;
  }, ee = (Q, Z, ae) => {
    const se = Q === "xy" ? (U, I) => [U, I, 0] : Q === "xz" ? (U, I) => [U, 0, I] : (U, I) => [0, U, I], ge = [[-E, -E], [E, -E], [E, E], [-E, E]], me = [];
    for (const [U, I] of ge) me.push(...se(U, I));
    const xe = new Ve();
    xe.setAttribute("position", new It(me, 3));
    const de = new wt({ color: Z, transparent: true, opacity: ae, depthWrite: false }), G = new $s(xe, de);
    return G.name = `grid-${Q}-border`, G.renderOrder = 1, G;
  }, X = (Q, Z, ae) => {
    const se = Q === "xy" ? (de, G) => [de, G, 0] : Q === "xz" ? (de, G) => [de, 0, G] : (de, G) => [0, de, G], ge = Z === "u" ? [...se(-E, 0), ...se(E, 0)] : [...se(0, -E), ...se(0, E)], me = new Ve();
    me.setAttribute("position", new It(ge, 3));
    const xe = new nn(me, new wt({ color: ae, transparent: true, opacity: 0.45, depthWrite: false }));
    return xe.name = `grid-${Q}-eje-${Z}`, xe.renderOrder = 1, xe;
  }, we = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const Q of S) {
    k.add(B(Q, z, N, 0.12)), k.add(B(Q, A, V, 0.4));
    const [Z, ae] = we[Q];
    k.add(X(Q, "u", Z)), k.add(X(Q, "v", ae)), k.add(ee(Q, V, 0.55));
  }
  return k.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: A, minorStep: z, gridSize: t, planes: [...S] }, k;
}
function Bi(t, y, g, k) {
  const S = new pt(), A = new vi(0.5, 0.5, 0.5), z = new _i(0.45, 0.7, 4);
  z.rotateX(Math.PI / 2), z.translate(0, 0, -0.35);
  const E = new xt({ color: 10166822 }), P = new xt({ color: 2792847 }), V = new xt({ color: 3835647 }), N = () => {
    const X = g.rawVal ?? [];
    if (X.length < 2) return y.gridSize.val * 0.5;
    let we = [1 / 0, 1 / 0, 1 / 0], Q = [-1 / 0, -1 / 0, -1 / 0];
    for (const Z of X) for (let ae = 0; ae < 3; ae++) Z[ae] < we[ae] && (we[ae] = Z[ae]), Z[ae] > Q[ae] && (Q[ae] = Z[ae]);
    return Math.max(Q[0] - we[0], Q[1] - we[1], Q[2] - we[2], 0.1);
  }, B = () => 0.08 * N(), ee = () => k.rawVal;
  return ue.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, !y.supports.val) return;
    S.clear();
    const X = B();
    (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((we, Q) => {
      const Z = g.val[Q];
      if (!Z) return;
      const ae = we ?? [], se = (ae[0] ? 1 : 0) + (ae[1] ? 1 : 0) + (ae[2] ? 1 : 0), ge = (ae[3] ? 1 : 0) + (ae[4] ? 1 : 0) + (ae[5] ? 1 : 0);
      let me;
      se >= 3 && ge >= 3 ? me = new dt(A, E) : se >= 3 && ge === 0 ? me = new dt(z, P) : me = new dt(z, V), me.position.set(Z[0], Z[1], Z[2]);
      const xe = X * ee();
      me.scale.set(xe, xe, xe), S.add(me);
    });
  }), ue.derive(() => {
    if (k.val, !y.supports.rawVal) return;
    const we = B() * ee();
    S.children.forEach((Q) => Q.scale.set(we, we, we));
  }), ue.derive(() => {
    S.visible = y.supports.val;
  }), S;
}
function Ni(t, y, g, k) {
  const S = new pt();
  S.name = "loadsGroup";
  function A(E) {
    if (E.length < 2) return 0.12 * y.gridSize.rawVal;
    const P = [1 / 0, 1 / 0, 1 / 0], V = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of E) for (let ee = 0; ee < 3; ee++) P[ee] = Math.min(P[ee], B[ee]), V[ee] = Math.max(V[ee], B[ee]);
    return 0.08 * Math.max(V[0] - P[0], V[1] - P[1], V[2] - P[2], 0.1);
  }
  ue.derive(() => {
    var _a, _b, _c;
    if (y.deformedShape.val, !y.loads.val) return;
    S.children.forEach((Q) => {
      var _a2;
      return (_a2 = Q.dispose) == null ? void 0 : _a2.call(Q);
    }), S.clear();
    const E = g.val, P = A(E), V = 240, N = [];
    (_c = (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((Q, Z) => {
      E[Z] && Q.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && N.push(Z);
    });
    let B = N;
    if (N.length > V) {
      const Q = N.map((R) => E[R][0]), Z = N.map((R) => E[R][1]), ae = Math.min(...Q), se = Math.max(...Q), ge = Math.min(...Z), me = Math.max(...Z), xe = N.map((R) => E[R][2]), de = Math.max(1e-6, (Math.max(...xe) - Math.min(...xe)) / 40), G = (R) => Math.round(R / de), U = new Set(xe.map(G)), I = Math.max(4, Math.floor(V / Math.max(1, U.size))), q = Math.max(2, Math.round(Math.sqrt(I))), Y = /* @__PURE__ */ new Map();
      for (const R of N) {
        const J = se - ae < 1e-9 ? 0 : (E[R][0] - ae) / (se - ae), pe = me - ge < 1e-9 ? 0 : (E[R][1] - ge) / (me - ge), fe = Math.min(q - 1, Math.floor(J * q)), oe = Math.min(q - 1, Math.floor(pe * q)), K = `${fe},${oe},${G(E[R][2])}`, Me = Math.hypot(J * q - (fe + 0.5), pe * q - (oe + 0.5)), te = Y.get(K);
        (!te || Me < te.d) && Y.set(K, { i: R, d: Me });
      }
      B = [...Y.values()].map((R) => R.i);
    }
    let ee = 0;
    for (const Q of B) {
      const Z = t.nodeInputs.val.loads.get(Q);
      for (let ae = 0; ae < 3; ae++) ee = Math.max(ee, Math.abs(Z[ae]));
    }
    const X = B.length <= 60, we = (Q) => {
      const Z = Math.abs(Q);
      return Z >= 100 ? Q.toFixed(0) : Z >= 10 ? Q.toFixed(1) : Q.toFixed(2);
    };
    for (const Q of B) {
      const Z = t.nodeInputs.val.loads.get(Q), ae = E[Q];
      if (ae) for (let se = 0; se < 3; se++) {
        const ge = Z[se];
        if (!(Math.abs(ge) > 1e-9 * (ee || 1))) continue;
        const me = new F(se === 0 ? Math.sign(ge) : 0, se === 1 ? Math.sign(ge) : 0, se === 2 ? Math.sign(ge) : 0), xe = 0.45 + 0.55 * (ee ? Math.abs(ge) / ee : 1), de = new In(me, new F(...ae), 1, se === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (de.userData = { nudo: ae, dir: me, rel: xe }, S.add(de), X) {
          const G = new Rt(we(ge), se === 2 ? "#f5b642" : "#ff6b5e");
          G.userData = { nudo: ae, dir: me, rel: xe, texto: true }, S.add(G);
        }
      }
    }
    z(P * k.rawVal);
  });
  function z(E) {
    S.children.forEach((P) => {
      const V = P.userData;
      if (!(V == null ? void 0 : V.dir)) return;
      const N = E * V.rel, B = new F(...V.nudo).addScaledVector(V.dir, -N * (V.texto ? 1.12 : 1));
      P.position.copy(B), V.texto ? P.updateScale(E * 0.38) : P.scale.set(N, N, N);
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
      const E = new Rt(`${z}`);
      E.position.set(...A), E.updateScale(S * g.rawVal), k.add(E);
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
    (_a = t.elements) == null ? void 0 : _a.val.forEach((z, E) => {
      const P = new Rt(`${E}`, void 0, "#001219");
      P.position.set(...Ui(z.map((V) => g.rawVal[V]))), P.updateScale(A * k.rawVal), S.add(P);
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
  const g = new pt(), k = Math.min(0.05 * t, 0.6), S = qn(), A = new Rt("X", "red", "transparent"), z = new Rt(y ? "Z" : "Y", "green", "transparent"), E = new Rt(y ? "Y" : "Z", "blue", "transparent"), P = new In(new F(1, 0, 0), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), V = new In(new F(0, 1, 0), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), N = new In(new F(0, 0, 1), new F(0, 0, 0), 1, S.axisArrow, 0.2, 0.2);
  return A.position.set(1.3 * k, 0, 0), z.position.set(0, 1.3 * k, 0), E.position.set(0, 0, 1.3 * k), A.updateScale(0.4 * k), z.updateScale(0.4 * k), E.updateScale(0.4 * k), P.scale.set(k, k, k), V.scale.set(k, k, k), N.scale.set(k, k, k), g.add(P, V, N, A, z, E), g;
}
function jo(t, y) {
  const g = new F(...t), S = new F(...y).clone().sub(g), A = S.length(), z = S.dot(new F(1, 0, 0)) / A, E = S.dot(new F(0, 1, 0)) / A, P = S.dot(new F(0, 0, 1)) / A, V = Math.sqrt(z ** 2 + E ** 2);
  let N = new ka().fromArray([[z, E, P], [-E / V, z / V, 0], [-z * P / V, -E * P / V, V]].flat());
  return P === 1 && (N = new ka().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), P === -1 && (N = new ka().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new ea().setFromMatrix3(N);
}
function Ea(t, y) {
  return t == null ? void 0 : t.map((g, k) => (9 * g + y[k]) / 10);
}
function _o(t) {
  const y = t.reduce((k, S) => [k[0] + S[0], k[1] + S[1], k[2] + S[2]], [0, 0, 0]), g = t.length;
  return [y[0] / g, y[1] / g, y[2] / g];
}
function Zi(t, y, g) {
  const k = _o([y, g]), S = _o([t, g]), A = _o([t, y]), z = new F(...k).sub(new F(...S)).normalize(), E = new F(...g).sub(new F(...A)).normalize(), P = z.clone().cross(E).normalize(), V = P.clone().cross(z).normalize();
  return new ea().makeBasis(z, V, P);
}
function qi(t, y, g, k) {
  const S = new pt(), A = new Ve(), z = new wt({ vertexColors: true }), E = [0, 0, 0], P = [1, 0, 0], V = [0, 1, 0], N = [0, 0, 1];
  A.setAttribute("position", new It([...E, ...P, ...E, ...V, ...E, ...N], 3));
  const B = [255, 0, 0], ee = [0, 255, 0], X = [0, 0, 255];
  return A.setAttribute("color", new It([...B, ...B, ...ee, ...ee, ...X, ...X], 3)), ue.derive(() => {
    var _a;
    y.deformedShape.val, y.orientations.val && (S.clear(), (_a = t.elements) == null ? void 0 : _a.val.forEach((we) => {
      const Q = new nn(A, z), Z = g.rawVal[we[0]], ae = g.rawVal[we[1]];
      if (we.length === 2 && (Q.position.set(...Ea(Z, ae)), Q.rotation.setFromRotationMatrix(jo(Z, ae))), we.length === 3) {
        const me = g.rawVal[we[2]];
        Q.position.set(..._o([Z, ae, me])), Q.rotation.setFromRotationMatrix(Zi(Z, ae, me));
      }
      const ge = 0.05 * y.gridSize.rawVal * 0.75 * k.rawVal;
      Q.scale.set(ge, ge, ge), S.add(Q);
    }));
  }), ue.derive(() => {
    if (k.val, !y.orientations.rawVal) return;
    const Q = 0.05 * y.gridSize.val * 0.75 * k.rawVal;
    S.children.forEach((Z) => Z.scale.set(Q, Q, Q));
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
  function z(de, G) {
    const U = de / 2, I = G / 2, q = new Float32Array([0, -U, -I, 0, U, -I, 0, U, I, 0, -U, -I, 0, U, I, 0, -U, I]), Y = new Ve();
    Y.setAttribute("position", new bt(q, 3));
    const R = new Float32Array([0, -U, -I, 0, U, -I, 0, U, I, 0, -U, I, 0, -U, -I]), J = new Ve();
    return J.setAttribute("position", new bt(R, 3)), { fill: Y, outline: J };
  }
  function E(de, G = 24) {
    const U = de / 2, I = new Float32Array(G * 9);
    for (let J = 0; J < G; J++) {
      const pe = J / G * Math.PI * 2, fe = (J + 1) / G * Math.PI * 2;
      I[J * 9] = 0, I[J * 9 + 1] = 0, I[J * 9 + 2] = 0, I[J * 9 + 3] = 0, I[J * 9 + 4] = U * Math.cos(pe), I[J * 9 + 5] = U * Math.sin(pe), I[J * 9 + 6] = 0, I[J * 9 + 7] = U * Math.cos(fe), I[J * 9 + 8] = U * Math.sin(fe);
    }
    const q = new Ve();
    q.setAttribute("position", new bt(I, 3));
    const Y = new Float32Array((G + 1) * 3);
    for (let J = 0; J <= G; J++) {
      const pe = J / G * Math.PI * 2;
      Y[J * 3] = 0, Y[J * 3 + 1] = U * Math.cos(pe), Y[J * 3 + 2] = U * Math.sin(pe);
    }
    const R = new Ve();
    return R.setAttribute("position", new bt(Y, 3)), { fill: q, outline: R };
  }
  function P(de, G, U, I) {
    const q = U ?? G * 0.08, Y = I ?? de * 0.07, R = de / 2, J = G / 2, pe = J - q, fe = Y / 2, oe = [];
    function K(be, ve, Pe, Xe) {
      oe.push(0, be, ve, 0, Pe, ve, 0, Pe, Xe, 0, be, ve, 0, Pe, Xe, 0, be, Xe);
    }
    K(-R, -J, R, -pe), K(-fe, -pe, fe, pe), K(-R, pe, R, J);
    const Me = new Ve();
    Me.setAttribute("position", new bt(new Float32Array(oe), 3));
    const te = new Float32Array([0, -R, -J, 0, R, -J, 0, R, -pe, 0, fe, -pe, 0, fe, pe, 0, R, pe, 0, R, J, 0, -R, J, 0, -R, pe, 0, -fe, pe, 0, -fe, -pe, 0, -R, -pe, 0, -R, -J]), Ie = new Ve();
    return Ie.setAttribute("position", new bt(te, 3)), { fill: Me, outline: Ie };
  }
  function V(de, G, U) {
    const I = de / 2, q = G / 2, Y = I - U, R = q - U, J = [];
    function pe(Me, te, Ie, be) {
      J.push(0, Me, te, 0, Ie, te, 0, Ie, be, 0, Me, te, 0, Ie, be, 0, Me, be);
    }
    pe(-I, -q, I, -R), pe(-I, R, I, q), pe(-I, -R, -Y, R), pe(Y, -R, I, R);
    const fe = new Ve();
    fe.setAttribute("position", new bt(new Float32Array(J), 3));
    const oe = new Float32Array([0, -I, -q, 0, I, -q, 0, I, -q, 0, I, q, 0, I, q, 0, -I, q, 0, -I, q, 0, -I, -q, 0, -Y, -R, 0, Y, -R, 0, Y, -R, 0, Y, R, 0, Y, R, 0, -Y, R, 0, -Y, R, 0, -Y, -R]), K = new Ve();
    return K.setAttribute("position", new bt(oe, 3)), { fill: fe, outline: K };
  }
  function N(de, G, U) {
    const I = de / 2, q = G / 2, Y = I - U, R = q - U, J = new Ve(), pe = new Float32Array([0, -Y, -R, 0, Y, -R, 0, Y, R, 0, -Y, -R, 0, Y, R, 0, -Y, R]);
    J.setAttribute("position", new bt(pe, 3));
    const fe = [];
    function oe(Ie, be, ve, Pe) {
      fe.push(0, Ie, be, 0, ve, be, 0, ve, Pe, 0, Ie, be, 0, ve, Pe, 0, Ie, Pe);
    }
    oe(-I, -q, I, -R), oe(-I, R, I, q), oe(-I, -R, -Y, R), oe(Y, -R, I, R);
    const K = new Ve();
    K.setAttribute("position", new bt(new Float32Array(fe), 3));
    const Me = new Float32Array([0, -I, -q, 0, I, -q, 0, I, -q, 0, I, q, 0, I, q, 0, -I, q, 0, -I, q, 0, -I, -q, 0, -Y, -R, 0, Y, -R, 0, Y, -R, 0, Y, R, 0, Y, R, 0, -Y, R, 0, -Y, R, 0, -Y, -R]), te = new Ve();
    return te.setAttribute("position", new bt(Me, 3)), { concFill: J, steelFillGeom: K, outline: te };
  }
  function B(de, G, U) {
    const I = [], q = [[0, -de / 2, -G / 2], [0, -de / 2 + U, -G / 2], [0, -de / 2 + U, G / 2 - U], [0, de / 2, G / 2 - U], [0, de / 2, G / 2], [0, -de / 2, G / 2]], Y = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of Y) I.push(...q[fe]);
    const R = new Ve();
    R.setAttribute("position", new bt(new Float32Array(I), 3));
    const J = [];
    for (let fe = 0; fe < q.length; fe++) {
      const oe = (fe + 1) % q.length;
      J.push(...q[fe], ...q[oe]);
    }
    const pe = new Ve();
    return pe.setAttribute("position", new bt(new Float32Array(J), 3)), { fill: R, outline: pe };
  }
  function ee(de, G, U, I) {
    const q = I / 2, Y = [], R = [[0, -de - q, -G / 2], [0, -U - q, -G / 2], [0, -U - q, G / 2 - U], [0, -q, G / 2 - U], [0, -q, G / 2], [0, -de - q, G / 2]], J = [[0, q, -G / 2], [0, q + U, -G / 2], [0, q + U, G / 2 - U], [0, de + q, G / 2 - U], [0, de + q, G / 2], [0, q, G / 2]], pe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const Me of pe) Y.push(...R[Me]);
    for (const Me of pe) Y.push(...J[Me]);
    const fe = new Ve();
    fe.setAttribute("position", new bt(new Float32Array(Y), 3));
    const oe = [];
    for (const Me of [R, J]) for (let te = 0; te < Me.length; te++) {
      const Ie = (te + 1) % Me.length;
      oe.push(...Me[te], ...Me[Ie]);
    }
    const K = new Ve();
    return K.setAttribute("position", new bt(new Float32Array(oe), 3)), { fill: fe, outline: K };
  }
  function X(de, G, U, I) {
    const q = G / 2, Y = de, R = [[0, -Y, -q], [0, -Y, -q + U], [0, -I, -q + U], [0, -I, q - U], [0, -Y, q - U], [0, -Y, q], [0, 0, q], [0, 0, -q]], J = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], pe = [];
    for (const Me of J) pe.push(...R[Me]);
    const fe = new Ve();
    fe.setAttribute("position", new bt(new Float32Array(pe), 3));
    const oe = [];
    for (let Me = 0; Me < R.length; Me++) {
      const te = (Me + 1) % R.length;
      oe.push(...R[Me], ...R[te]);
    }
    const K = new Ve();
    return K.setAttribute("position", new bt(new Float32Array(oe), 3)), { fill: fe, outline: K };
  }
  function we(de, G, U, I, q) {
    const Y = G / 2, R = q / 2, J = [], pe = [[0, -de, -Y], [0, -de, -Y + U], [0, -R - I, -Y + U], [0, -R - I, Y - U], [0, -de, Y - U], [0, -de, Y], [0, -R, Y], [0, -R, -Y]], fe = pe.map((Ie) => [Ie[0], -Ie[1], Ie[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const Ie of oe) J.push(...pe[Ie]);
    for (const Ie of oe) J.push(...fe[Ie]);
    const K = new Ve();
    K.setAttribute("position", new bt(new Float32Array(J), 3));
    const Me = [];
    for (const Ie of [pe, fe]) for (let be = 0; be < Ie.length; be++) {
      const ve = (be + 1) % Ie.length;
      Me.push(...Ie[be], ...Ie[ve]);
    }
    const te = new Ve();
    return te.setAttribute("position", new bt(new Float32Array(Me), 3)), { fill: K, outline: te };
  }
  function Q(de, G, U, I) {
    const q = de / 2, Y = G / 2, R = I / 2, J = [[0, -R, -Y], [0, R, -Y], [0, R, Y - U], [0, q, Y - U], [0, q, Y], [0, -q, Y], [0, -q, Y - U], [0, -R, Y - U]], pe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], fe = [];
    for (const te of pe) fe.push(...J[te]);
    const oe = new Ve();
    oe.setAttribute("position", new bt(new Float32Array(fe), 3));
    const K = [];
    for (let te = 0; te < J.length; te++) {
      const Ie = (te + 1) % J.length;
      K.push(...J[te], ...J[Ie]);
    }
    const Me = new Ve();
    return Me.setAttribute("position", new bt(new Float32Array(K), 3)), { fill: oe, outline: Me };
  }
  function Z(de, G, U = 24) {
    const I = de / 2, q = I - G, Y = [];
    for (let fe = 0; fe < U; fe++) {
      const oe = fe / U * Math.PI * 2, K = (fe + 1) / U * Math.PI * 2, Me = Math.cos(oe), te = Math.sin(oe), Ie = Math.cos(K), be = Math.sin(K);
      Y.push(0, I * Me, I * te, 0, I * Ie, I * be, 0, q * Ie, q * be), Y.push(0, I * Me, I * te, 0, q * Ie, q * be, 0, q * Me, q * te);
    }
    const R = new Ve();
    R.setAttribute("position", new bt(new Float32Array(Y), 3));
    const J = [];
    for (let fe = 0; fe < U; fe++) {
      const oe = fe / U * Math.PI * 2, K = (fe + 1) / U * Math.PI * 2;
      J.push(0, I * Math.cos(oe), I * Math.sin(oe), 0, I * Math.cos(K), I * Math.sin(K)), J.push(0, q * Math.cos(oe), q * Math.sin(oe), 0, q * Math.cos(K), q * Math.sin(K));
    }
    const pe = new Ve();
    return pe.setAttribute("position", new bt(new Float32Array(J), 3)), { fill: R, outline: pe };
  }
  const ae = new xt({ color: 52479, transparent: true, opacity: 0.35, side: Lt, depthWrite: false }), se = new wt({ color: 52479 }), ge = new xt({ color: 16750848, transparent: true, opacity: 0.4, side: Lt, depthWrite: false }), me = new wt({ color: 16750848 });
  function xe(de, G) {
    const U = Math.abs(G[0] - de[0]), I = Math.abs(G[1] - de[1]), q = Math.abs(G[2] - de[2]);
    return q > U && q > I || I > U && I > q;
  }
  return ue.derive(() => {
    var _a, _b;
    y.deformedShape.val, y.secColumns.val, y.secBeams.val, y.secFloor.val;
    const de = y.secColumns.rawVal, G = y.secBeams.rawVal;
    if (!de && !G) {
      S.children.forEach((R) => {
        R instanceof Rt && R.dispose();
      }), S.clear();
      return;
    }
    S.children.forEach((R) => {
      R instanceof Rt && R.dispose();
    }), S.clear();
    const U = (_a = t.elements) == null ? void 0 : _a.val, I = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!U || !I) return;
    const q = I.sectionShapes, Y = y.secFloor.rawVal;
    U.forEach((R, J) => {
      if (R.length !== 2) return;
      const pe = g.rawVal[R[0]], fe = g.rawVal[R[1]];
      if (!pe || !fe) return;
      const oe = xe(pe, fe);
      if (oe && !de || !oe && !G) return;
      if (Y >= 0) {
        const be = Math.min(pe[1], fe[1]);
        Math.max(pe[1], fe[1]);
        const ve = y.gridSize.rawVal || 3;
        if (Math.floor(be / ve + 0.01) !== Y) return;
      }
      const K = q == null ? void 0 : q.get(J);
      if (!K) return;
      const Me = [(pe[0] + fe[0]) / 2, (pe[1] + fe[1]) / 2, (pe[2] + fe[2]) / 2], te = jo(pe, fe);
      if (K.type === "CFT") {
        const be = N(K.b, K.h, K.tw ?? K.b * 0.05), ve = new dt(be.concFill, ae);
        ve.position.set(...Me), ve.rotation.setFromRotationMatrix(te), ve.userData.e = J, S.add(ve);
        const Pe = new dt(be.steelFillGeom, ge);
        Pe.position.set(...Me), Pe.rotation.setFromRotationMatrix(te), Pe.userData.e = J, S.add(Pe);
        const Xe = new Et(be.outline, me);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = J, S.add(Xe);
      } else {
        let be, ve, Pe;
        switch (K.type) {
          case "rect":
            be = z(K.b, K.h), ve = ae, Pe = se;
            break;
          case "circ":
            be = E(K.d), ve = ae, Pe = se;
            break;
          case "I":
            be = P(K.b, K.h, K.tf, K.tw), ve = ge, Pe = me;
            break;
          case "HSS":
            be = V(K.b, K.h, K.tw ?? K.b * 0.05), ve = ge, Pe = me;
            break;
          case "CFT":
            be = N(K.b, K.h, K.tw ?? K.b * 0.05), ve = ge, Pe = me;
            break;
          case "L":
            be = B(K.b ?? K.h, K.h, K.t ?? K.tw ?? 3e-3), ve = ge, Pe = me;
            break;
          case "2L":
            be = ee(K.b ?? K.h, K.h, K.t ?? K.tw ?? 3e-3, K.dis ?? 0.01), ve = ge, Pe = me;
            break;
          case "C":
          case "coldC":
            be = X(K.b, K.h, K.tf ?? K.t ?? 3e-3, K.tw ?? K.t ?? 3e-3), ve = ge, Pe = me;
            break;
          case "2C":
            be = we(K.b, K.h, K.tf ?? 5e-3, K.tw ?? 5e-3, K.dis ?? 0.01), ve = ge, Pe = me;
            break;
          case "T":
            be = Q(K.b, K.h, K.tf ?? 0.01, K.tw ?? 6e-3), ve = ge, Pe = me;
            break;
          case "pipe":
            be = Z(K.d, K.tw ?? K.d * 0.05), ve = ge, Pe = me;
            break;
          default:
            return;
        }
        const Xe = new dt(be.fill, ve);
        Xe.position.set(...Me), Xe.rotation.setFromRotationMatrix(te), Xe.userData.e = J, S.add(Xe);
        const Ae = new Et(be.outline, Pe);
        Ae.position.set(...Me), Ae.rotation.setFromRotationMatrix(te), Ae.userData.e = J, S.add(Ae);
      }
      const Ie = Gi(K);
      if (Ie) {
        const ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(K.type) ? "#ff9900" : "#00ccff", Pe = new Rt(Ie, ve, "transparent");
        Pe.position.set(Me[0], Me[1], Me[2]);
        const Xe = 0.05 * y.gridSize.rawVal * 0.5;
        Pe.updateScale(Xe * ((k == null ? void 0 : k.rawVal) ?? 1)), A.add(Pe);
      }
    });
  }), ue.derive(() => {
    var _a, _b;
    const de = g.val, G = (_a = t.elements) == null ? void 0 : _a.rawVal;
    if (G) for (const U of S.children) {
      const I = (_b = U.userData) == null ? void 0 : _b.e;
      if (I === void 0) continue;
      const q = G[I], Y = q && de[q[0]], R = q && de[q[1]];
      !Y || !R || (U.position.set((Y[0] + R[0]) / 2, (Y[1] + R[1]) / 2, (Y[2] + R[2]) / 2), U.rotation.setFromRotationMatrix(jo(Y, R)));
    }
  }), k && ue.derive(() => {
    if (k.val, !y.sections.rawVal) return;
    const de = 0.05 * y.gridSize.val * 0.5;
    A.children.forEach((G) => {
      G instanceof Rt && G.updateScale(de * k.rawVal);
    });
  }), ue.derive(() => {
    S.visible = y.sections.val;
  }), ue.derive(() => {
    A.visible = y.sectionLabels.val;
  }), S;
}
function Wi(t) {
  if (!t) return null;
  const y = t.type, g = (N, B) => [N, B], k = (N, B) => [g(-N / 2, -B / 2), g(N / 2, -B / 2), g(N / 2, B / 2), g(-N / 2, B / 2)], S = (N, B = 24) => {
    const ee = N / 2, X = [];
    for (let we = 0; we < B; we++) {
      const Q = 2 * Math.PI * we / B;
      X.push(g(ee * Math.cos(Q), ee * Math.sin(Q)));
    }
    return X;
  }, A = t.b ?? 0, z = t.h ?? 0, E = t.d ?? 0, P = t.tw ?? t.t ?? 0, V = t.tf ?? t.t ?? 0;
  switch (y) {
    case "rect":
      return A && z ? { contorno: k(A, z) } : null;
    case "circ":
      return E ? { contorno: S(E) } : null;
    case "pipe":
      return E && P ? { contorno: S(E), huecos: [S(E - 2 * P).reverse()] } : null;
    case "HSS":
      return A && z && P ? { contorno: k(A, z), huecos: [k(A - 2 * P, z - 2 * (V || P)).reverse()] } : null;
    case "CFT":
      return A && z ? { contorno: k(A, z) } : null;
    case "I":
      return A && z && P && V ? { contorno: [g(-A / 2, -z / 2), g(A / 2, -z / 2), g(A / 2, -z / 2 + V), g(P / 2, -z / 2 + V), g(P / 2, z / 2 - V), g(A / 2, z / 2 - V), g(A / 2, z / 2), g(-A / 2, z / 2), g(-A / 2, z / 2 - V), g(-P / 2, z / 2 - V), g(-P / 2, -z / 2 + V), g(-A / 2, -z / 2 + V)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return A && z && P && V ? { contorno: [g(-A / 2, -z / 2), g(A / 2, -z / 2), g(A / 2, -z / 2 + V), g(-A / 2 + P, -z / 2 + V), g(-A / 2 + P, z / 2 - V), g(A / 2, z / 2 - V), g(A / 2, z / 2), g(-A / 2, z / 2)] } : null;
    case "T":
      return A && z && P && V ? { contorno: [g(-P / 2, -z / 2), g(P / 2, -z / 2), g(P / 2, z / 2 - V), g(A / 2, z / 2 - V), g(A / 2, z / 2), g(-A / 2, z / 2), g(-A / 2, z / 2 - V), g(-P / 2, z / 2 - V)] } : null;
    case "L":
    case "2L":
      return A && z && P ? { contorno: [g(-A / 2, -z / 2), g(A / 2, -z / 2), g(A / 2, -z / 2 + P), g(-A / 2 + P, -z / 2 + P), g(-A / 2 + P, z / 2), g(-A / 2, z / 2)] } : null;
    default:
      return A && z ? { contorno: k(A, z) } : E ? { contorno: S(E) } : null;
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
  const S = new Sa({ color: 8369151, transparent: true, opacity: 0.92, side: Lt }), A = new Sa({ color: 12623968, transparent: true, opacity: 0.85, side: Lt }), z = new Sa({ color: 11583173, transparent: true, opacity: 0.85, side: Lt }), E = new pt();
  E.add(new Vs(16777215, 0.55));
  const P = new Qo(16777215, 0.75);
  P.position.set(30, 25, 40);
  const V = new Qo(16777215, 0.35);
  V.position.set(-25, -20, 15), E.add(P, V);
  let N = 0;
  return ue.derive(() => {
    var _a, _b, _c, _d, _e;
    const B = ((_a = y.extruded) == null ? void 0 : _a.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++N, on: B }, k.visible = B;
    for (const se of [...k.children]) se !== E && (k.remove(se), (_c = (_b = se.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (k.children.includes(E) || k.add(E), !B) return;
    const ee = g.val ?? [], X = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], we = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, Q = we.sectionShapes ?? /* @__PURE__ */ new Map(), Z = we.thicknesses ?? /* @__PURE__ */ new Map();
    let ae = "";
    try {
      X.forEach((se, ge) => {
        var _a2, _b2, _c2;
        if (se.length === 2) {
          let me = Wi(Q.get(ge)), xe = true;
          if (me || (me = Hi((_a2 = we.areas) == null ? void 0 : _a2.get(ge), (_b2 = we.momentsOfInertiaY) == null ? void 0 : _b2.get(ge), (_c2 = we.momentsOfInertiaZ) == null ? void 0 : _c2.get(ge)), xe = false), !me) return;
          const de = ee[se[0]], G = ee[se[1]];
          if (!de || !G) return;
          const U = Math.hypot(G[0] - de[0], G[1] - de[1], G[2] - de[2]);
          if (U < 1e-9) return;
          const I = new ki(Ji(me), { depth: U, bevelEnabled: false, curveSegments: 4 });
          I.applyMatrix4(new ea().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const q = new dt(I, xe ? S : A);
          q.position.set(de[0], de[1], de[2]), q.rotation.setFromRotationMatrix(jo(de, G)), k.add(q);
          return;
        }
        if (se.length === 3 || se.length === 4) {
          const me = Z.get(ge);
          if (!me || me <= 0) return;
          const xe = se.map((be) => ee[be]).filter(Boolean);
          if (xe.length < 3) return;
          const de = [xe[1][0] - xe[0][0], xe[1][1] - xe[0][1], xe[1][2] - xe[0][2]], G = [xe[2][0] - xe[0][0], xe[2][1] - xe[0][1], xe[2][2] - xe[0][2]], U = de[1] * G[2] - de[2] * G[1], I = de[2] * G[0] - de[0] * G[2], q = de[0] * G[1] - de[1] * G[0], Y = Math.hypot(U, I, q);
          if (Y < 1e-12) return;
          const R = [U / Y, I / Y, q / Y], J = [], pe = (be) => xe.map((ve) => [ve[0] + R[0] * be, ve[1] + R[1] * be, ve[2] + R[2] * be]), fe = Math.abs(R[2]) > 0.5, oe = R[2] > 0 ? -1 : 1, K = pe(fe ? 0 : +me / 2), Me = pe(fe ? oe * me : -me / 2), te = (be, ve, Pe) => J.push(...be, ...ve, ...Pe);
          for (const be of [K, Me]) te(be[0], be[1], be[2]), be.length === 4 && te(be[0], be[2], be[3]);
          for (let be = 0; be < xe.length; be++) {
            const ve = (be + 1) % xe.length;
            te(K[be], Me[be], Me[ve]), te(K[be], Me[ve], K[ve]);
          }
          const Ie = new Ve();
          Ie.setAttribute("position", new It(J, 3)), Ie.computeVertexNormals(), k.add(new dt(Ie, z));
        }
      });
    } catch (se) {
      ae = String((se == null ? void 0 : se.message) ?? se);
    }
    globalThis.__extrusionDebug = { corridas: N, on: B, fallo: ae, nElementos: X.length, nFormas: Q.size, nEspesores: Z.size, mallas: k.children.length - 1 };
  }), k;
}
function Bs(t, y, g = 0) {
  const k = [y[0] - t[0], y[1] - t[1], y[2] - t[2]], S = Math.hypot(k[0], k[1], k[2]) || 1, A = k[0] / S, z = k[1] / S, E = k[2] / S, P = Math.sqrt(A * A + z * z);
  let V, N, B;
  if (P < 1e-9) {
    const ee = E > 0 ? 1 : -1;
    V = [0, 0, ee], N = [1, 0, 0], B = [0, ee, 0];
  } else V = [A, z, E], N = [-A * E / P, -z * E / P, P], B = [z / P, -A / P, 0];
  if (Math.abs(g) > 1e-12) {
    const ee = g * Math.PI / 180, X = Math.cos(ee), we = Math.sin(ee), Q = N.map((ae, se) => X * ae + we * B[se]), Z = B.map((ae, se) => -we * N[se] + X * ae);
    N = Q, B = Z;
  }
  return { e1: V, e2: N, e3: B };
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
  constructor(y, g, k, S, A, z, E) {
    super();
    const P = new Mo().moveTo(0, 0).lineTo(0, z[1]).lineTo(k, z[1]).lineTo(k, 0).lineTo(0, 0), V = P.getPoints(), N = new Ve().setFromPoints(V);
    this.lines = new Et(N, new wt({ color: qn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const B = new Oo(P), ee = new xt({ color: z[1] > 0 ? 24435 : 11411474, side: Lt });
    this.mesh = new dt(B, ee), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Rt(`${A[1].toFixed(4)}`), this.normalizedResult = z, this.textPosition = _o([y, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(S), this.add(this.text);
  }
  updateScale(y) {
    this.lines.scale.set(1, y * 2, 1), this.mesh.scale.set(1, y * 2, 1), this.text.updateScale(y * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * y);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Aa extends pt {
  constructor(y, g, k, S, A, z, E) {
    super();
    const P = A[0] * k / (A[0] + A[1]), V = A[0] * A[1] > 0;
    if (this.text = new Rt(`${A[0].toFixed(4)}`), this.text2 = new Rt(`${(A[1] * -1).toFixed(4)}`), this.normalizedResult = z, this.textPosition = Ea(y, g), this.text2Position = Ea(g, y), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(S), this.text2.rotation.setFromRotationMatrix(S), this.add(this.text, this.text2), V) {
      const N = new Mo().moveTo(0, 0).lineTo(0, z[0]).lineTo(P, 0).lineTo(0, 0), B = new Mo().moveTo(P, 0).lineTo(k, -z[1]).lineTo(k, 0).lineTo(P, 0), ee = N.getPoints(), X = B.getPoints(), we = new Ve().setFromPoints(ee), Q = new Ve().setFromPoints(X), Z = new wt({ color: qn().resultOutline });
      this.lines = new Et(we, Z), this.lines2 = new Et(Q, Z), this.lines.position.set(...y), this.lines2.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), this.lines2.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), E && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ae = new Oo(N), se = new Oo(B), ge = new xt({ color: z[0] > 0 ? 24435 : 11411474, side: Lt }), me = new xt({ color: -z[1] > 0 ? 24435 : 11411474, side: Lt });
      this.mesh = new dt(ae, ge), this.mesh2 = new dt(se, me), this.mesh.position.set(...y), this.mesh2.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), this.mesh2.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), E && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const N = new Mo().moveTo(0, 0).lineTo(0, z[0]).lineTo(k, -z[1]).lineTo(k, 0).lineTo(0, 0), B = N.getPoints(), ee = new Ve().setFromPoints(B);
      this.lines = new Et(ee, new wt({ color: qn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const X = new Oo(N), we = new xt({ color: z[0] > 0 ? 24435 : 11411474, side: Lt });
      this.mesh = new dt(X, we), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
    const E = g.rawVal;
    if (!(E == null ? void 0 : E.length)) return 0.05 * y.gridSize.rawVal;
    const P = [1 / 0, 1 / 0, 1 / 0], V = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of E) for (let ee = 0; ee < 3; ee++) B[ee] < P[ee] && (P[ee] = B[ee]), B[ee] > V[ee] && (V[ee] = B[ee]);
    const N = Math.hypot(V[0] - P[0], V[1] - P[1], V[2] - P[2]);
    return !isFinite(N) || N <= 0 ? 0.05 * y.gridSize.rawVal : 0.025 * N;
  }, A = new pt(), z = { normals: Ko, shearsY: Ko, shearsZ: Ko, torsions: Ko, bendingsY: Aa, bendingsZ: Aa };
  return ue.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, g.val, y.frameResults.val == "none") return;
    A.children.forEach((P) => P.dispose()), A.clear();
    const E = Ys[y.frameResults.rawVal];
    (_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.rawVal[E]) == null ? void 0 : _b.forEach((P, V) => {
      var _a2, _b2, _c, _d, _e, _f;
      const N = ((_a2 = t.elements) == null ? void 0 : _a2.rawVal[V]) ?? [0, 1], B = g.rawVal[N[0]], ee = g.rawVal[N[1]];
      if (!B || !ee) return;
      const X = new F(...ee).distanceTo(new F(...B)), we = ji((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[E]), Q = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, V)) ?? 0, Z = Bs(B, ee, Q), ae = Ns(E, Z), se = new F(...Z.e1), ge = new F(...ae), me = new ea().makeBasis(se, ge, se.clone().cross(ge)), [xe, de] = $a(E, P), G = z[E] === Aa ? [xe, -de] : [xe, de], U = G.map((q) => q / (we === 0 ? 1 : we)), I = new z[E](B, ee, X, me, G, U, false);
      I.updateScale(S() * k.rawVal), A.add(I);
    });
  }), ue.derive(() => {
    if (k.val, y.frameResults.rawVal == "none") return;
    y.gridSize.val;
    const E = S();
    A.children.forEach((P) => P.updateScale(E * k.rawVal));
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
    S.children.forEach((E) => E.dispose()), S.clear();
    const A = Ia[y.nodeResults.rawVal], z = 0.05 * y.gridSize.val;
    (_b = (_a = t.deformOutputs) == null ? void 0 : _a.val[A]) == null ? void 0 : _b.forEach((E, P) => {
      const V = new el(g.rawVal[P], A, E ?? [0, 0, 0, 0, 0, 0]);
      V.updateScale(z * k.rawVal), S.add(V);
    });
  }), ue.derive(() => {
    if (k.val, y.nodeResults.rawVal == "none") return;
    const A = 0.05 * y.gridSize.val;
    S.children.forEach((z) => z.updateScale(A * k.rawVal));
  }), ue.derive(() => {
    S.visible = y.nodeResults.val != "none";
  }), S;
}
function nl({ drawingObj: t, gridObj: y, scene: g, getActiveCamera: k, controls: S, gridSize: A, derivedDisplayScale: z, rendererElm: E, viewerRender: P }) {
  var _a;
  const V = new Pa(), N = new Pi(), B = (e) => {
    const n = E.getBoundingClientRect(), a = e.clientX - n.left, o = e.clientY - n.top, s = n.width || 1, l = n.height || 1;
    if (!!window.__hekatanSplitMode) {
      const p = s / 2;
      if (a >= p) return N.x = (a - p) / p * 2 - 1, N.y = -(o / l) * 2 + 1, window.__hekatanSplitCamera ?? k();
      N.x = a / p * 2 - 1;
    } else N.x = a / s * 2 - 1;
    return N.y = -(o / l) * 2 + 1, k();
  }, ee = new dt(new Vn(1e4, 1e4), new xt({ side: Lt, transparent: true, opacity: 0, depthWrite: false }));
  ee.visible = true, ee.frustumCulled = false, g.add(ee);
  const X = (e, n, a) => {
    const o = new dt(new Vn(1e4, 1e4), new xt({ side: Lt, transparent: true, opacity: 0, depthWrite: false }));
    return o.rotation.set(e, n, a), o.visible = false, o.frustumCulled = false, g.add(o), o;
  }, we = X(Math.PI / 2, 0, 0), Q = X(0, Math.PI / 2, 0);
  let Z = false, ae = null, se = null, ge = null;
  const me = new Et(new Ve(), new wt({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  me.name = "ref-ifc-cadena", me.renderOrder = 1e3, me.frustumCulled = false, me.visible = false, g.add(me);
  const xe = (e, n, a) => Math.round(e * 1e3) + "," + Math.round(n * 1e3) + "," + Math.round(a * 1e3), de = (e) => {
    const n = /* @__PURE__ */ new Map();
    for (let a = 0; a + 0 < e.length / 6; a++) {
      const o = 6 * a;
      for (const s of [xe(e[o], e[o + 1], e[o + 2]), xe(e[o + 3], e[o + 4], e[o + 5])]) {
        const l = n.get(s);
        l ? l.push(a) : n.set(s, [a]);
      }
    }
    return n;
  }, G = (e) => {
    const { S: n, adj: a } = e, o = (x, M) => new F(n[6 * x + 3 * M], n[6 * x + 3 * M + 1], n[6 * x + 3 * M + 2]), s = /* @__PURE__ */ new Set([e.s]), l = (x, M) => {
      const $ = [];
      let _ = x, C = M;
      for (let L = 0; L < 3e3; L++) {
        const j = (a.get(xe(C.x, C.y, C.z)) || []).filter((ye) => !s.has(ye));
        if (j.length !== 1) break;
        const W = j[0], T = o(W, 0), H = o(W, 1), le = T.distanceTo(C) < H.distanceTo(C) ? H : T, he = C.clone().sub(_).normalize(), $e = le.clone().sub(C).normalize();
        if (he.dot($e) < Math.cos(35 * Math.PI / 180)) break;
        s.add(W), $.push(le), _ = C, C = le;
      }
      return $;
    }, h = o(e.s, 0), p = o(e.s, 1), i = l(h, p), c = l(p, h), r = [...c.reverse(), h, p, ...i], u = c.length;
    if (r.length < 6) return r;
    const m = [], f = [];
    for (let x = 1; x < r.length; x++) m.push(r[x].distanceTo(r[x - 1]));
    for (let x = 1; x < r.length - 1; x++) {
      const M = r[x].clone().sub(r[x - 1]).normalize(), $ = r[x + 1].clone().sub(r[x]).normalize();
      f.push(Math.acos(Math.max(-1, Math.min(1, M.dot($)))) / Math.max(1e-6, (m[x - 1] + m[x]) / 2));
    }
    const b = f.map((x, M) => {
      let $ = 0, _ = 0;
      for (let C = M - 1; C <= M + 1; C++) C >= 0 && C < f.length && ($ += f[C], _++);
      return $ / _;
    }), v = [];
    for (let x = 3; x < b.length - 3; x++) {
      const M = (b[x - 3] + b[x - 2] + b[x - 1]) / 3, $ = (b[x + 1] + b[x + 2] + b[x + 3]) / 3, _ = Math.min(M, $), C = Math.max(M, $);
      C > 0.03 && C / Math.max(_, 1e-6) > 2.2 && Math.abs(b[x] - (M + $) / 2) < C && (!v.length || x - v[v.length - 1] > 3) && v.push(x + 1);
    }
    let w = 0, d = r.length - 1;
    for (const x of v) x <= u && x > w && (w = x), x > u && x < d && (d = x);
    return r.slice(w, d + 1);
  }, U = (e) => {
    if (ge = e, !e || e.length < 2) {
      me.visible = false;
      return;
    }
    me.geometry.dispose(), me.geometry = new Ve().setFromPoints(e), me.visible = true;
  }, I = (e) => {
    let n = 0;
    for (let u = 1; u < e.length - 1; u++) {
      const m = e[u].clone().sub(e[u - 1]).normalize(), f = e[u + 1].clone().sub(e[u]).normalize();
      n += Math.acos(Math.max(-1, Math.min(1, m.dot(f))));
    }
    const a = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (n < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const o = String(window.__hekatanArcModo ?? "angulo"), s = o === "x" ? 0 : o === "y" ? 1 : o === "z" ? 2 : -1, l = [0];
    for (let u = 1; u < e.length; u++) l.push(l[u - 1] + e[u].distanceTo(e[u - 1]));
    const h = (u, m) => {
      for (let f = 1; f < e.length; f++) {
        const b = u(e[f - 1], f - 1), v = u(e[f], f);
        if (b <= m && m <= v || v <= m && m <= b) {
          const w = Math.abs(v - b) < 1e-12 ? 0 : (m - b) / (v - b);
          return e[f - 1].clone().lerp(e[f], w);
        }
      }
      return e[e.length - 1].clone();
    }, p = [], i = s >= 0 ? e[0].getComponent(s) : 0, c = s >= 0 ? e[e.length - 1].getComponent(s) : 0, r = s >= 0 && Math.abs(c - i) > 1e-6 && e.every((u, m) => m === 0 || (u.getComponent(s) - e[m - 1].getComponent(s)) * (c - i) >= -1e-6);
    for (let u = 0; u <= a; u++) {
      const m = r ? h((f) => f.getComponent(s), i + (c - i) * u / a) : h((f, b) => l[b], l[l.length - 1] * u / a);
      p.push([m.x, m.y, m.z]);
    }
    return p[0] = e[0].toArray(), p[a] = e[e.length - 1].toArray(), p;
  };
  window.__hekatanCadenaIfc = () => (ge || []).map((e) => [e.x, e.y, e.z]);
  const q = /* @__PURE__ */ new Map(), Y = (e) => {
    const n = q.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = a ? Math.floor(a.count / 3) : 0, s = new Float64Array(o * 9), l = new Float64Array(o * 3), h = new Int32Array(o * 3).fill(-1);
    if (a) {
      e.updateMatrixWorld();
      const i = new F();
      for (let b = 0; b < o * 3; b++) i.fromBufferAttribute(a, b).applyMatrix4(e.matrixWorld), s[3 * b] = i.x, s[3 * b + 1] = i.y, s[3 * b + 2] = i.z;
      const c = new F(), r = new F(), u = new F(), m = (b) => Math.round(s[3 * b] * 1e3) + "," + Math.round(s[3 * b + 1] * 1e3) + "," + Math.round(s[3 * b + 2] * 1e3), f = /* @__PURE__ */ new Map();
      for (let b = 0; b < o; b++) {
        const v = 3 * b;
        c.set(s[3 * (v + 1)] - s[3 * v], s[3 * (v + 1) + 1] - s[3 * v + 1], s[3 * (v + 1) + 2] - s[3 * v + 2]), r.set(s[3 * (v + 2)] - s[3 * v], s[3 * (v + 2) + 1] - s[3 * v + 1], s[3 * (v + 2) + 2] - s[3 * v + 2]), u.crossVectors(c, r).normalize(), l[3 * b] = u.x, l[3 * b + 1] = u.y, l[3 * b + 2] = u.z;
        for (let w = 0; w < 3; w++) {
          const d = m(v + w), x = m(v + (w + 1) % 3), M = d < x ? d + "|" + x : x + "|" + d, $ = f.get(M);
          $ ? $.push(b, w) : f.set(M, [b, w]);
        }
      }
      for (const b of f.values()) b.length === 4 && (h[3 * b[0] + b[1]] = b[2], h[3 * b[2] + b[3]] = b[0]);
    }
    const p = { V: s, N: l, vec: h, n: o };
    return q.set(e.id, p), p;
  }, R = new dt(new Ve(), new xt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Lt }));
  R.name = "ref-ifc-cara", R.renderOrder = 999, R.frustumCulled = false, R.visible = false, g.add(R);
  let J = null;
  const pe = (e, n) => {
    const a = Math.cos(12 * Math.PI / 180), o = Math.cos(80 * Math.PI / 180), s = [e.N[3 * n], e.N[3 * n + 1], e.N[3 * n + 2]], l = new Uint8Array(e.n), h = [], p = [n];
    for (l[n] = 1; p.length && h.length < 4e4; ) {
      const i = p.pop();
      h.push(i);
      for (let c = 0; c < 3; c++) {
        const r = e.vec[3 * i + c];
        if (r < 0 || l[r]) continue;
        const u = e.N[3 * i] * e.N[3 * r] + e.N[3 * i + 1] * e.N[3 * r + 1] + e.N[3 * i + 2] * e.N[3 * r + 2], m = s[0] * e.N[3 * r] + s[1] * e.N[3 * r + 1] + s[2] * e.N[3 * r + 2];
        u >= a && m >= o && (l[r] = 1, p.push(r));
      }
    }
    return h;
  }, fe = (e, n, a) => {
    if (!e || n < 0 || !a) {
      J && (J = null, R.visible = false);
      return;
    }
    if (J && J.m === e && J.tris.indexOf(n) >= 0) {
      J.punto = a.clone();
      return;
    }
    const o = Y(e), s = pe(o, n), l = new Float32Array(s.length * 9), h = new F();
    let p = true;
    s.forEach((i, c) => {
      for (let r = 0; r < 9; r++) l[9 * c + r] = o.V[9 * i + r];
      h.x += o.N[3 * i], h.y += o.N[3 * i + 1], h.z += o.N[3 * i + 2];
    }), h.normalize();
    for (const i of s) if (h.x * o.N[3 * i] + h.y * o.N[3 * i + 1] + h.z * o.N[3 * i + 2] < Math.cos(5 * Math.PI / 180)) {
      p = false;
      break;
    }
    R.geometry.dispose(), R.geometry = new Ve(), R.geometry.setAttribute("position", new bt(l, 3)), R.material.color.set(p ? 3718648 : 16096779), R.visible = true, J = { m: e, t0: n, tris: s, normal: h, plana: p, punto: a.clone() };
  }, oe = (e, n) => {
    const a = new Uint8Array(e.n);
    for (const r of n) a[r] = 1;
    const o = (r) => Math.round(e.V[3 * r] * 1e3) + "," + Math.round(e.V[3 * r + 1] * 1e3) + "," + Math.round(e.V[3 * r + 2] * 1e3), s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
    for (const r of n) for (let u = 0; u < 3; u++) {
      const m = e.vec[3 * r + u];
      if (m >= 0 && a[m]) continue;
      const f = 3 * r + u, b = 3 * r + (u + 1) % 3, v = o(f), w = o(b);
      l.set(v, new F(e.V[3 * f], e.V[3 * f + 1], e.V[3 * f + 2])), l.set(w, new F(e.V[3 * b], e.V[3 * b + 1], e.V[3 * b + 2])), (s.get(v) || s.set(v, []).get(v)).push(w), (s.get(w) || s.set(w, []).get(w)).push(v);
    }
    const h = /* @__PURE__ */ new Set();
    let p = [];
    for (const r of s.keys()) {
      if (h.has(r)) continue;
      const u = [r];
      h.add(r);
      let m = "", f = r;
      for (let b = 0; b < 1e5; b++) {
        const v = (s.get(f) || []).find((w) => w !== m && !h.has(w));
        if (!v) break;
        u.push(v), h.add(v), m = f, f = v;
      }
      u.length > p.length && (p = u);
    }
    const i = p.map((r) => l.get(r)), c = [];
    for (let r = 0; r < i.length; r++) {
      const u = i[(r + i.length - 1) % i.length], m = i[r], f = i[(r + 1) % i.length];
      if (m.distanceTo(u) < 1e-3) continue;
      const b = m.clone().sub(u).normalize(), v = f.clone().sub(m).normalize();
      b.dot(v) > Math.cos(3 * Math.PI / 180) || c.push(m);
    }
    return c;
  }, K = (e, n, a) => {
    const s = new Pa(n.clone().addScaledVector(a, -2e-3), a.clone().negate(), 0, 3).intersectObject(e, false);
    return s.length ? s[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, n, a, o = 2) => {
    const s = new F(e[0], e[1], e[2]), l = new F(n[0], n[1], n[2]).normalize();
    let h = null;
    for (const p of [1, -1]) {
      const c = new Pa(s, l.clone().multiplyScalar(p), 0, o).intersectObjects(a, false);
      c.length && (h == null || c[0].distance < h) && (h = c[0].distance);
    }
    return h;
  }, window.__hekatanCaraIfc = () => J ? { tris: J.tris.length, plana: J.plana, normal: J.normal.toArray(), punto: J.punto.toArray(), contorno: oe(Y(J.m), J.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const Me = /* @__PURE__ */ new Map(), te = new nn(new Ve(), new wt({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  te.name = "ref-ifc-bordes", te.frustumCulled = false, te.visible = false, g.add(te);
  const Ie = 1, be = (e, n, a) => Math.floor(e / Ie) + "," + Math.floor(n / Ie) + "," + Math.floor(a / Ie), ve = (e) => {
    const n = Me.get(e.id);
    if (n) return n;
    const a = e.geometry.getAttribute("position"), o = [], s = /* @__PURE__ */ new Map();
    if (a) {
      e.updateMatrixWorld();
      const h = Math.floor(a.count / 3), p = new Float64Array(a.count * 3), i = new F();
      for (let w = 0; w < a.count; w++) i.fromBufferAttribute(a, w).applyMatrix4(e.matrixWorld), p[3 * w] = i.x, p[3 * w + 1] = i.y, p[3 * w + 2] = i.z;
      const c = (w) => Math.round(p[3 * w] * 1e3) + "," + Math.round(p[3 * w + 1] * 1e3) + "," + Math.round(p[3 * w + 2] * 1e3), r = new Float64Array(h * 3), u = new F(), m = new F(), f = new F();
      for (let w = 0; w < h; w++) {
        const d = 3 * w, x = 3 * w + 1, M = 3 * w + 2;
        u.set(p[3 * x] - p[3 * d], p[3 * x + 1] - p[3 * d + 1], p[3 * x + 2] - p[3 * d + 2]), m.set(p[3 * M] - p[3 * d], p[3 * M + 1] - p[3 * d + 1], p[3 * M + 2] - p[3 * d + 2]), f.crossVectors(u, m).normalize(), r[3 * w] = f.x, r[3 * w + 1] = f.y, r[3 * w + 2] = f.z;
      }
      const b = /* @__PURE__ */ new Map();
      for (let w = 0; w < h; w++) for (let d = 0; d < 3; d++) {
        const x = 3 * w + d, M = 3 * w + (d + 1) % 3, $ = c(x), _ = c(M), C = $ < _ ? $ + "|" + _ : _ + "|" + $, L = b.get(C);
        L ? L.push(w) : b.set(C, [w, x, M]);
      }
      const v = Math.cos(25 * Math.PI / 180);
      for (const w of b.values()) {
        const d = w[0], x = w[1], M = w[2];
        let $ = w.length === 3;
        if (!$ && w.length === 4) {
          const C = w[3], L = r[3 * d] * r[3 * C] + r[3 * d + 1] * r[3 * C + 1] + r[3 * d + 2] * r[3 * C + 2];
          $ = Math.abs(L) < v;
        }
        if (!$) continue;
        const _ = o.length / 6;
        o.push(p[3 * x], p[3 * x + 1], p[3 * x + 2], p[3 * M], p[3 * M + 1], p[3 * M + 2]);
        for (const [C, L, j] of [[p[3 * x], p[3 * x + 1], p[3 * x + 2]], [p[3 * M], p[3 * M + 1], p[3 * M + 2]], [(p[3 * x] + p[3 * M]) / 2, (p[3 * x + 1] + p[3 * M + 1]) / 2, (p[3 * x + 2] + p[3 * M + 2]) / 2]]) {
          const W = be(C, L, j), T = s.get(W);
          T ? T[T.length - 1] !== _ && T.push(_) : s.set(W, [_]);
        }
      }
    }
    const l = { segs: new Float32Array(o), celdas: s };
    return Me.set(e.id, l), l;
  };
  let Pe = "";
  const Xe = (e) => {
    const n = e.map((h) => h.id).join(",");
    if (n === Pe) return;
    Pe = n;
    const a = e.map((h) => ve(h).segs);
    let o = 0;
    for (const h of a) o += h.length;
    const s = new Float32Array(o);
    let l = 0;
    for (const h of a) s.set(h, l), l += h.length;
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
    const o = ve(e), s = o.segs, l = Math.floor(n.x / Ie), h = Math.floor(n.y / Ie), p = Math.floor(n.z / Ie), i = /* @__PURE__ */ new Set();
    let c = En, r = null, u = En, m = null, f = -1;
    const b = new F(), v = new F();
    for (let w = -1; w <= 1; w++) for (let d = -1; d <= 1; d++) for (let x = -1; x <= 1; x++) {
      const M = o.celdas.get(l + w + "," + (h + d) + "," + (p + x));
      if (M) for (const $ of M) {
        if (i.has($)) continue;
        i.add($);
        const _ = 6 * $;
        b.set(s[_], s[_ + 1], s[_ + 2]), v.set(s[_ + 3], s[_ + 4], s[_ + 5]);
        const C = Xn(b.x, b.y, b.z), L = Xn(v.x, v.y, v.z);
        if (!C || !L) continue;
        const j = Math.hypot(C.x - a.x, C.y - a.y), W = Math.hypot(L.x - a.x, L.y - a.y);
        j < c && (c = j, r = b.clone()), W < c && (c = W, r = v.clone());
        const T = L.x - C.x, H = L.y - C.y, le = T * T + H * H || 1e-9;
        let he = ((a.x - C.x) * T + (a.y - C.y) * H) / le;
        he = Math.max(0, Math.min(1, he));
        const $e = Math.hypot(a.x - (C.x + he * T), a.y - (C.y + he * H));
        $e < u && (u = $e, m = b.clone().lerp(v, he), f = $);
      }
    }
    return f >= 0 && (o.adj || (o.adj = de(o.segs)), se = { S: o.segs, adj: o.adj, s: f }), r ? { tipo: "ifcVert", punto: r } : m ? { tipo: "ifcEdge", punto: m } : null;
  }, nt = () => {
    var _a2, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((l) => {
      var _a3;
      ((_a3 = l.userData) == null ? void 0 : _a3.refIfc) && l.isMesh && e.push(l);
    }), !e.length) return te.visible = false, Pe = "", null;
    Xe(e);
    const n = V.intersectObjects(e, false).filter((l) => {
      const h = l.object.material;
      return (h && h.clippingPlanes || []).every((i) => i.distanceToPoint(l.point) >= 0);
    });
    if (!n.length) return null;
    const a = n[0], o = n[1];
    ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "ifcface" ? fe(a.object, a.faceIndex ?? -1, a.point) : J && fe(null, -1, null);
    const s = Ae(a.object, a.point);
    if (s) return ae = { tipo: s.tipo }, [{ ...a, point: s.punto }];
    if (o && o.object === a.object && o.distance - a.distance <= 1.2) {
      const l = a.point.clone().add(o.point).multiplyScalar(0.5);
      return ae = { tipo: "ifcAxis" }, [{ ...a, point: l }];
    }
    return ae = { tipo: "ifc" }, [a];
  };
  let st = "", Ue = new Float32Array(0);
  const D = new nn(new Ve(), new wt({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  D.name = "ref-ifc-seccion", D.renderOrder = 998, D.frustumCulled = false, D.visible = false, g.add(D);
  const O = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return D.visible = false, Ue = new Float32Array(0);
    const n = [];
    e.enableX && n.push([0, +e.posX]), e.enableY && n.push([1, +e.posY]), e.enableZ && n.push([2, +e.posZ]);
    const a = [];
    g.traverse((l) => {
      var _a2;
      ((_a2 = l.userData) == null ? void 0 : _a2.refIfc) && l.isMesh && a.push(l);
    });
    const o = JSON.stringify(n) + "|" + a.map((l) => l.id).join(",");
    if (o === st) return Ue;
    st = o;
    const s = [];
    if (n.length && a.length) {
      const l = [new F(), new F(), new F()];
      for (const h of a) {
        const p = h.geometry.getAttribute("position");
        if (p) {
          h.updateMatrixWorld();
          for (let i = 0; i + 2 < p.count; i += 3) {
            for (let c = 0; c < 3; c++) l[c].fromBufferAttribute(p, i + c).applyMatrix4(h.matrixWorld);
            for (const [c, r] of n) {
              const u = [l[0].getComponent(c) - r, l[1].getComponent(c) - r, l[2].getComponent(c) - r], m = [];
              for (let f = 0; f < 3; f++) {
                const b = l[f], v = l[(f + 1) % 3], w = u[f], d = u[(f + 1) % 3];
                (w < 0 && d >= 0 || w >= 0 && d < 0) && m.push(b.clone().lerp(v, w / (w - d)));
              }
              m.length === 2 && s.push(m[0].x, m[0].y, m[0].z, m[1].x, m[1].y, m[1].z);
            }
          }
        }
      }
    }
    return Ue = new Float32Array(s), D.geometry.dispose(), D.geometry = new Ve(), D.geometry.setAttribute("position", new bt(Ue, 3)), D.visible = Ue.length > 0, Ue;
  };
  let re = null, ie = null;
  const _e = (e, n) => {
    const a = O();
    if (!a.length) return null;
    let o = En * 2, s = null, l = -1;
    const h = new F(), p = new F();
    for (let i = 0; i + 5 < a.length; i += 6) {
      h.set(a[i], a[i + 1], a[i + 2]), p.set(a[i + 3], a[i + 4], a[i + 5]);
      const c = Xn(h.x, h.y, h.z), r = Xn(p.x, p.y, p.z);
      if (!c || !r) continue;
      const u = r.x - c.x, m = r.y - c.y, f = u * u + m * m || 1e-9;
      let b = ((e - c.x) * u + (n - c.y) * m) / f;
      b = Math.max(0, Math.min(1, b));
      const v = Math.hypot(e - (c.x + b * u), n - (c.y + b * m));
      v < o && (o = v, s = h.clone().lerp(p, b), l = i / 6);
    }
    return l >= 0 && (ie !== a && (re = de(a), ie = a), se = { S: a, adj: re, s: l }), s;
  };
  let Ce = null;
  window.__hekatanSeccionIfc = () => O().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const n = O(), a = [], o = Math.max(1, Math.floor(n.length / 6 / e));
    for (let s = 0; s + 2 < n.length; s += 6 * o) a.push([n[s], n[s + 1], n[s + 2]]);
    return a;
  };
  const Ye = () => {
    ae = null;
    const e = nt();
    if (e) return e;
    if (Z) return V.intersectObjects([ee], false);
    if (we.visible = !!window.__hekatanGridPlaneXZ, Q.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Wt.visible) {
      const o = V.intersectObjects([Wt, Ot, wn], false);
      if (o.length > 0) return o;
    }
    const a = [ee];
    return we.visible && a.push(we), Q.visible && a.push(Q), Pn.visible && Hn.length > 0 && a.push(...Hn), V.intersectObjects(a, false);
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
  let Ge = null, rt = null, et = false;
  const Mt = new F(), gt = (e, n, a, o, s, l) => {
    const h = o - e, p = s - n, i = l - a, c = Math.hypot(h, p, i);
    if (c < 0.01) {
      ze.style.display = "none";
      return;
    }
    Ge = [e, n, a], rt = [h / c, p / c, i / c], Mt.set((e + o) / 2, (n + s) / 2, (a + l) / 2), Mt.project(k());
    const r = E.getBoundingClientRect(), u = r.left + (Mt.x * 0.5 + 0.5) * r.width, m = r.top + (-Mt.y * 0.5 + 0.5) * r.height;
    ze.style.left = u + "px", ze.style.top = m + "px", ze.style.display = "block";
    const f = new F(e, n, a).project(k()), b = new F(o, s, l).project(k()), v = r.left + (f.x * 0.5 + 0.5) * r.width, w = r.top + (-f.y * 0.5 + 0.5) * r.height, d = r.left + (b.x * 0.5 + 0.5) * r.width, x = r.top + (-b.y * 0.5 + 0.5) * r.height;
    let M = Math.atan2(-(x - w), d - v) * 180 / Math.PI;
    if (M < 0 && (M += 360), Ne.textContent = `${Math.round(M) % 360}\xB0`, Ne.style.left = d + "px", Ne.style.top = x + 34 + "px", Ne.style.display = "block", !et) {
      if (ze.value = `${c.toFixed(2)} m`, document.activeElement !== ze) {
        const $ = document.activeElement;
        $ && ($.tagName === "INPUT" || $.tagName === "TEXTAREA") && $ !== ze || ze.focus({ preventScroll: true });
      }
      try {
        ze.select();
      } catch {
      }
    }
  }, fn = () => {
    ze.style.display = "none", Ne.style.display = "none", Ge = null, rt = null, et = false, document.activeElement === ze && ze.blur();
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
      const r = Oe[0];
      Oe = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, r[0], r[1], r[2], e), ce(`\u2713 C\xEDrculo r=${e} m en (${r[0].toFixed(2)}, ${r[1].toFixed(2)}, ${r[2].toFixed(2)}).`);
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
    if (!Ge || !rt || !t.polylines) return;
    let a = rt[0], o = rt[1], s = rt[2];
    Ct === "x" ? (a = Math.sign(a) || 1, o = 0, s = 0) : Ct === "y" ? (a = 0, o = Math.sign(o) || 1, s = 0) : Ct === "z" && (a = 0, o = 0, s = Math.sign(s) || 1);
    const l = Ge[0] + a * e, h = Ge[1] + o * e, p = Ge[2] + s * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [l, h, p]];
    const i = t.polylines.rawVal, c = i.length ? i[i.length - 1] : [];
    t.polylines.val = [...i.slice(0, -1), [...c, t.points.rawVal.length - 1]], ze.blur();
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
      const s = n.split("<").map((l) => parseFloat(l.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [l, h] = s;
        return a ? { kind: "relPolar", L: l, ang: h } : { kind: "absPolar", L: l, ang: h };
      }
      if (s.length === 3 && a) {
        const [l, h, p] = s;
        return { kind: "relSpherical", L: l, az: h, el: p };
      }
      return null;
    }
    if (n.includes(",")) {
      const s = n.split(",").map((i) => parseFloat(i.trim()));
      if (s.some(isNaN)) return null;
      const [l, h, p = 0] = s;
      return a ? { kind: "relCart", dx: l, dy: h, dz: p } : { kind: "absCart", x: l, y: h, z: p };
    }
    const o = parseFloat(n);
    return isNaN(o) || o <= 0 ? null : { kind: "length", L: o };
  }, ot = (e) => {
    if (!e) return null;
    const n = window.__hekatanSCU ?? [0, 0, 0];
    if (e.kind === "absCart") return [n[0] + e.x, n[1] + e.y, n[2] + e.z];
    if (e.kind === "relCart") return Ge ? [Ge[0] + e.dx, Ge[1] + e.dy, Ge[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const a = e.ang * Math.PI / 180;
      return [n[0] + e.L * Math.cos(a), n[1] + e.L * Math.sin(a), n[2]];
    }
    if (e.kind === "relPolar") {
      if (!Ge) return null;
      const a = e.ang * Math.PI / 180;
      return [Ge[0] + e.L * Math.cos(a), Ge[1] + e.L * Math.sin(a), Ge[2]];
    }
    if (e.kind === "relSpherical") {
      if (!Ge) return null;
      const a = e.az * Math.PI / 180, o = e.el * Math.PI / 180, s = e.L * Math.cos(o);
      return [Ge[0] + s * Math.cos(a), Ge[1] + s * Math.sin(a), Ge[2] + e.L * Math.sin(o)];
    }
    return null;
  }, je = (e) => {
    var _a2, _b;
    ga(new F(e[0], e[1], e[2]), null), Ge = e, et = false;
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
    ga(new F(a[0], a[1], a[2]), null), Ge = a, ze.blur();
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
    if (!Ge || !rt || document.activeElement === ze) return;
    const n = document.activeElement;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (ze.value = e.key, ze.focus(), ze.setSelectionRange(1, 1), e.preventDefault());
  });
  const Fe = document.createElement("div");
  Fe.id = "hk-coord-readout", Fe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Fe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Fe);
  const De = document.createElement("div");
  De.id = "hk-coord-fixed", De.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", De.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(De);
  const We = new Et(new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new so({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
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
    const n = B(e);
    if (!n) return null;
    V.setFromCamera(N, n);
    let a = null, o = null;
    const s = V.intersectObjects(g.children, true).filter((m) => m.object.isMesh && m.object !== vt && m.object !== ut && m.object.visible !== false);
    if (s.length) {
      const m = s[0], f = m.point;
      a = [f.x, f.y, f.z];
      const v = (_b = (_a2 = m.object.geometry) == null ? void 0 : _a2.attributes) == null ? void 0 : _b.position;
      v && m.face && (o = [m.face.a, m.face.b, m.face.c].map((w) => {
        const d = new F().fromBufferAttribute(v, w);
        return m.object.localToWorld(d), [d.x, d.y, d.z];
      }));
    } else {
      const m = Ye();
      if (m.length) {
        const f = m[0].point;
        a = [f.x, f.y, f.z];
      }
    }
    if (!a) return null;
    const l = E.getBoundingClientRect(), h = (m) => {
      const f = new F(m[0], m[1], m[2]).project(n);
      return [l.left + (f.x * 0.5 + 0.5) * l.width, l.top + (-f.y * 0.5 + 0.5) * l.height];
    }, p = [e.clientX, e.clientY], i = 14;
    let c = a, r = i;
    const u = (m) => {
      const f = h(m), b = Math.hypot(f[0] - p[0], f[1] - p[1]);
      b < r && (r = b, c = m);
    };
    for (const m of o ?? []) u(m);
    for (const m of t.points.rawVal) u(m);
    return c;
  }, $t = () => {
    if (ht.length < 1) {
      tt.style.display = "none";
      return;
    }
    const e = k(), n = ht[0], a = ht[1] ?? ht[0], s = new F((n[0] + a[0]) / 2, (n[1] + a[1]) / 2, (n[2] + a[2]) / 2).clone().project(e), l = E.getBoundingClientRect();
    tt.style.left = l.left + (s.x * 0.5 + 0.5) * l.width + "px", tt.style.top = l.top + (-s.y * 0.5 + 0.5) * l.height - 14 + "px", tt.style.display = "block";
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
  ut.frustumCulled = false, ut.visible = false, ut.renderOrder = 998, ut.name = "hk-fill-preview", g.add(ut), E.addEventListener("pointerleave", () => {
    Fe.style.display = "none", ut.visible && (ut.visible = false, P());
  });
  const Kt = (e) => {
    var _a2, _b, _c, _d;
    const n = t.points.rawVal, a = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Map(), s = (w, d) => {
      w !== d && ((o.get(w) ?? o.set(w, /* @__PURE__ */ new Set()).get(w)).add(d), (o.get(d) ?? o.set(d, /* @__PURE__ */ new Set()).get(d)).add(w));
    };
    for (const w of a) for (let d = 0; d + 1 < w.length; d++) s(w[d], w[d + 1]);
    const l = (w, d) => {
      var _a3;
      return !!((_a3 = o.get(w)) == null ? void 0 : _a3.has(d));
    }, h = [], p = /* @__PURE__ */ new Set(), i = [...o.keys()];
    for (const w of i) for (const d of o.get(w)) if (!(d < w)) {
      for (const x of o.get(d)) if (x !== w) for (const M of o.get(x)) {
        if (M === w || M === d || !l(M, w) || l(w, x) || l(d, M)) continue;
        const $ = [w, d, x, M].slice().sort((_, C) => _ - C).join("-");
        p.has($) || (p.add($), h.push([w, d, x, M]));
      }
    }
    for (const w of i) for (const d of o.get(w)) if (!(d < w)) for (const x of o.get(d)) {
      if (x === w || !l(x, w)) continue;
      const M = [w, d, x].slice().sort(($, _) => $ - _).join("-");
      p.has(M) || (p.add(M), h.push([w, d, x]));
    }
    const c = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", r = (w) => c === "xy" ? [w[0], w[1]] : c === "xz" ? [w[0], w[2]] : [w[1], w[2]], u = r(e), m = (w, d) => {
      let x = false;
      for (let M = 0, $ = d.length - 1; M < d.length; $ = M++) {
        const _ = d[M][0], C = d[M][1], L = d[$][0], j = d[$][1];
        C > w[1] != j > w[1] && w[0] < (L - _) * (w[1] - C) / (j - C) + _ && (x = !x);
      }
      return x;
    }, f = (w) => {
      let d = 0;
      for (let x = 0, M = w.length - 1; x < w.length; M = x++) d += (w[M][0] + w[x][0]) * (w[M][1] - w[x][1]);
      return Math.abs(d) / 2;
    };
    let b = null, v = 1 / 0;
    for (const w of h) {
      const d = w.map((M) => r(n[M]));
      if (!m(u, d)) continue;
      const x = f(d);
      x < v && (v = x, b = w);
    }
    return b;
  }, St = new pt(), Xt = new dt(new Vn(1, 1), new xt({ color: 2282478, transparent: true, opacity: 0.08, side: Lt, depthWrite: false })), on = new nn(new ys(new Vn(1, 1)), new wt({ color: 2282478, transparent: true, opacity: 0.85 })), zt = new nn(new Ve(), new wt({ color: 2282478, transparent: true, opacity: 0.3 })), So = (e, n) => {
    const a = [], o = Math.ceil(e / n);
    for (let s = -o; s <= o; s++) {
      const l = s * n;
      a.push(-e, l, 0, e, l, 0), a.push(l, -e, 0, l, e, 0);
    }
    zt.geometry.dispose(), zt.geometry = new Ve(), zt.geometry.setAttribute("position", new It(a, 3));
  };
  St.add(Xt, on, zt), St.visible = false, St.frustumCulled = false, g.add(St);
  const Ut = new pt();
  Ut.frustumCulled = false, Ut.visible = false, g.add(Ut);
  const Rn = (e) => {
    const n = new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), a = new so({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Et(n, a);
  }, _n = Rn(16711680), hn = Rn(65280), Tn = Rn(35071);
  Ut.add(_n, hn, Tn);
  const Gn = [], na = (e) => e.traverse((n) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = n.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = n.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Zt = Rn(16761856);
  Zt.material.dashSize = 0.28, Zt.material.gapSize = 0.16, Zt.material.opacity = 0.9, Zt.frustumCulled = false, Zt.visible = false, Zt.renderOrder = 98, g.add(Zt);
  const lo = (e) => {
    const n = new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0)]), a = new wt({ color: e, transparent: true, opacity: 0.2, depthTest: false }), o = new $s(n, a);
    return o.renderOrder = 997, o.frustumCulled = false, o;
  }, Dn = lo(3462041), Kn = lo(16724804), Bn = lo(6333946), mn = new pt();
  mn.frustumCulled = false, mn.visible = false, g.add(mn), mn.add(Dn, Kn, Bn);
  const ro = (e) => {
    const n = new Vn(1, 1), a = new xt({ color: e, transparent: true, opacity: 0.06, side: Lt, depthWrite: false }), o = new dt(n, a);
    return o.frustumCulled = false, o.renderOrder = 996, o;
  }, Wt = ro(3462041), Ot = ro(16724804), wn = ro(6333946);
  mn.add(Wt, Ot, wn);
  const kn = (e, n, a, o) => {
    e.scale.set(2 * o, 2 * o, 1), a === "xy" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, 0, 0)) : a === "xz" ? (e.position.set(n[0], n[1], n[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(n[0], n[1], n[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, yn = document.createElement("div");
  yn.id = "hk-refplane-badge", yn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(yn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = e, mn.visible = e, e) {
      const n = window.__hekatanOrthoAnchor, a = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], l = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0], h = window.__hekatanOrthoExt ?? 8;
      Sn(Dn, l, "xy", h), Sn(Kn, l, "xz", h), Sn(Bn, l, "yz", h), kn(Wt, l, "xy", h), kn(Ot, l, "xz", h), kn(wn, l, "yz", h), Wt.material.opacity = 0.05, Ot.material.opacity = 0.05, wn.material.opacity = 0.05;
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
    const n = window.__hekatanOrthoAnchor, a = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = a[a.length - 1] ?? [], s = t.points.rawVal ?? [], l = n && n.length === 3 ? n : o.length > 0 && s[o[o.length - 1]] ? s[o[o.length - 1]] : [0, 0, 0];
    Sn(Dn, l, "xy", e), Sn(Kn, l, "xz", e), Sn(Bn, l, "yz", e), kn(Wt, l, "xy", e), kn(Ot, l, "xz", e), kn(wn, l, "yz", e), P();
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
  let Wn = null, Tt = null;
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
    return Ct === "x" ? (Po.set(n - 1e4, a, o), zo.set(n + 1e4, a, o)) : Ct === "y" ? (Po.set(n, a - 1e4, o), zo.set(n, a + 1e4, o)) : (Po.set(n, a, o - 1e4), zo.set(n, a, o + 1e4)), V.ray.distanceSqToSegment(Po, zo, null, Da), Da;
  };
  window.__hekatanProjectOnAxis = Xs;
  const qt = new Et(new Ve().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new wt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  qt.renderOrder = 998, qt.frustumCulled = false, qt.visible = false, g.add(qt);
  let un = -1, An = -1, Fn = -1;
  const Je = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Je;
  const xn = new Et(new Ve().setFromPoints([new F(), new F()]), new wt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  xn.renderOrder = 997, xn.frustumCulled = false, xn.visible = false, g.add(xn);
  const an = new dt(new io(0.02, 12, 12), new xt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
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
    let l = -1, h = o;
    for (let p = 0; p < s.length; p++) {
      const i = s[p];
      if (!i) continue;
      const c = Math.hypot(e - i[0], n - i[1], a - i[2]);
      c < h && (h = c, l = p);
    }
    return l;
  }, sn = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; gn.children.length; ) {
      const h = gn.children.pop();
      (_b = (_a2 = h.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = h.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], n = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], o = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const h of Je) {
      const [p, ...i] = h.split(":");
      if (p === "pt") {
        const c = e[+i[0]];
        if (!c) continue;
        const r = new dt(new io(0.025, 12, 12), new xt({ color: Ao, transparent: true, opacity: 0.9, depthTest: false }));
        r.position.set(c[0], c[1], c[2]), r.renderOrder = 999, r.__isSelectionPt = true, gn.add(r);
      } else if (p === "seg") {
        const c = n[+i[0]], r = e[c == null ? void 0 : c[+i[1]]], u = e[c == null ? void 0 : c[+i[1] + 1]];
        if (!r || !u) continue;
        const m = new Ve().setFromPoints([new F(r[0], r[1], r[2]), new F(u[0], u[1], u[2])]), f = new Et(m, new wt({ color: Ao, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, gn.add(f);
      } else if (p === "poly") {
        const r = n[+i[0]].map((f) => {
          const b = e[f];
          return b ? new F(b[0], b[1], b[2]) : null;
        }).filter(Boolean);
        if (r.length < 2) continue;
        const u = new Ve().setFromPoints(r), m = new Et(u, new wt({ color: Ao, transparent: true, opacity: 0.95, depthTest: false }));
        m.renderOrder = 999, gn.add(m);
      } else if (p === "aux") {
        const c = o[+i[0]];
        if (!c || c.length !== 6) continue;
        const r = new Ve().setFromPoints([new F(c[0], c[1], c[2]), new F(c[3], c[4], c[5])]), u = new Et(r, new wt({ color: Ao, transparent: true, opacity: 0.95, depthTest: false }));
        u.renderOrder = 999, gn.add(u);
      }
    }
    const s = window.__hekatanUpdateSelectionPtScale;
    s && s();
    const l = window.__hekatanRefreshPropsPane;
    l && l();
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
  const co = (e, n, a, o, s, l, h, p, i) => {
    const c = h - o, r = p - s, u = i - l, m = c * c + r * r + u * u;
    if (m < 1e-12) return Math.hypot(e - o, n - s, a - l);
    let f = ((e - o) * c + (n - s) * r + (a - l) * u) / m;
    f = Math.max(0, Math.min(1, f));
    const b = o + f * c, v = s + f * r, w = l + f * u;
    return Math.hypot(e - b, n - v, a - w);
  }, oa = (e, n, a, o) => {
    if (!t.polylines) return null;
    const s = t.polylines.rawVal, l = t.points.rawVal;
    let h = -1, p = -1, i = o;
    for (let c = 0; c < s.length; c++) {
      const r = s[c];
      for (let u = 0; u < r.length - 1; u++) {
        const m = l[r[u]], f = l[r[u + 1]];
        if (!m || !f) continue;
        const b = co(e, n, a, m[0], m[1], m[2], f[0], f[1], f[2]);
        b < i && (i = b, h = c, p = u);
      }
    }
    return h >= 0 ? { polyIdx: h, segIdx: p, dist: i } : null;
  }, Na = (e, n, a, o) => {
    const s = window.__hekatanDrawingAuxLines, l = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let h = -1, p = o;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (!c || c.length !== 6) continue;
      const r = co(e, n, a, c[0], c[1], c[2], c[3], c[4], c[5]);
      r < p && (p = r, h = i);
    }
    return h;
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
    const s = ((_b = (_a2 = t.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(e)) ?? false, l = [];
    if (s || n < 0 || n >= a.length - 1) for (const h of a) {
      const p = o[h];
      p && l.push(new F(p[0], p[1], p[2]));
    }
    else {
      const h = o[a[n]], p = o[a[n + 1]];
      h && l.push(new F(h[0], h[1], h[2])), p && l.push(new F(p[0], p[1], p[2]));
    }
    qt.geometry.setFromPoints(l), qt.visible = true;
  }, Fo = (e) => {
    var _a2;
    if (!t.polylines) return;
    const n = t.polylines.rawVal;
    if (e < 0 || e >= n.length) return;
    const a = n.filter((i, c) => c !== e), o = /* @__PURE__ */ new Set();
    for (const i of a) for (const c of i) o.add(c);
    const s = t.points.rawVal, l = /* @__PURE__ */ new Map(), h = [];
    for (let i = 0; i < s.length; i++) o.has(i) && (l.set(i, h.length), h.push(s[i]));
    const p = a.map((i) => i.map((c) => l.get(c)).filter((c) => c !== void 0));
    t.points.val = h, t.polylines.val = p, t.areas && (t.areas.val = t.areas.rawVal.filter((i) => i !== e).map((i) => i > e ? i - 1 : i)), qt.visible = false, un = -1, An = -1;
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
    let l;
    n === 0 ? l = [s.slice(1)] : n === s.length - 2 ? l = [s.slice(0, -1)] : l = [s.slice(0, n + 1), s.slice(n + 1)];
    const h = [...a.slice(0, e), ...l, ...a.slice(e + 1)], p = /* @__PURE__ */ new Set();
    for (const m of h) for (const f of m) p.add(f);
    const i = t.points.rawVal, c = /* @__PURE__ */ new Map(), r = [];
    for (let m = 0; m < i.length; m++) p.has(m) && (c.set(m, r.length), r.push(i[m]));
    const u = h.map((m) => m.map((f) => c.get(f)).filter((f) => f !== void 0));
    if (t.points.val = r, t.polylines.val = u, t.areas) {
      const m = l.length - 1;
      t.areas.val = t.areas.rawVal.map((f) => f > e ? f + m : f);
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
    const e = t.points.rawVal, n = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${e.length}|${n.length}|${n.reduce((s, l) => s + l.length, 0)}`;
    if (a === Ua) return Xa;
    Ua = a;
    const o = [];
    for (const s of n) {
      const l = s.length;
      if (l < 6 || s[0] !== s[l - 1]) continue;
      const h = s.slice(0, l - 1).map((r) => e[r]).filter(Boolean);
      if (h.length < 5) continue;
      const p = [0, 1, 2].map((r) => h.reduce((u, m) => u + m[r], 0) / h.length), i = h.map((r) => Math.hypot(r[0] - p[0], r[1] - p[1], r[2] - p[2])), c = i.reduce((r, u) => r + u, 0) / i.length;
      c < 1e-9 || i.some((r) => Math.abs(r - c) > 5e-3 * c) || o.push({ c: p, r: c });
    }
    return Xa = o;
  };
  window.__hekatanCentrosDeducidos = Za;
  const $o = () => !!window.__hekatanCurvasAux, Vo = (e, n) => {
    const a = window.__hekatanDrawingAuxLines;
    if (!a) return 0;
    Pt();
    const o = a.rawVal ?? a.val ?? [], s = [];
    for (let l = 0; l + 1 < e.length; l++) s.push([...e[l], ...e[l + 1]]);
    return n && e.length > 2 && s.push([...e[e.length - 1], ...e[0]]), a.val = [...o, ...s], s.length;
  };
  window.__hekatanDrawCircle = (e, n, a, o, s = window.__hekatanArcSegs ?? 12, l = "xy") => {
    var _a2;
    const h = Math.max(4, Math.round(s)), p = t.points.rawVal.length, i = [];
    for (let c = 0; c < h; c++) {
      const r = 2 * Math.PI * c / h, u = o * Math.cos(r), m = o * Math.sin(r);
      let f;
      l === "xy" ? f = [e + u, n + m, a] : l === "xz" ? f = [e + u, n, a + m] : f = [e, n + u, a + m], i.push(f);
    }
    if (Eo.push({ c: [e, n, a], r: o }), $o()) {
      Vo(i, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...i], t.polylines) {
      const c = [...i.map((u, m) => p + m), p], r = t.polylines.rawVal;
      ((_a2 = r[r.length - 1]) == null ? void 0 : _a2.length) > 0 ? t.polylines.val = [...r, c, []] : t.polylines.val = [...r.slice(0, -1), c, []];
    }
  }, window.__hekatanDrawArc = (e, n, a, o = window.__hekatanArcSegs ?? 12) => {
    var _a2;
    const s = Math.max(4, Math.round(o)), l = new F(...e), h = new F(...n), p = new F(...a), i = new F().subVectors(h, l), c = new F().subVectors(p, l), r = new F().crossVectors(i, c), u = 2 * r.lengthSq();
    let m;
    if (u < 1e-12) m = new F().addVectors(l, p).multiplyScalar(0.5);
    else {
      const le = c.clone().multiplyScalar(i.lengthSq()).sub(i.clone().multiplyScalar(c.lengthSq())), he = new F().crossVectors(le, r);
      m = l.clone().add(he.divideScalar(u));
    }
    const f = l.distanceTo(m), b = r.lengthSq() > 1e-12 ? r.clone().normalize() : new F(0, 1, 0), v = new F().subVectors(l, m).normalize(), w = new F().crossVectors(b, v).normalize(), d = (le) => {
      const he = new F().subVectors(le, m);
      return Math.atan2(he.dot(w), he.dot(v));
    }, x = (le) => {
      let he = le;
      for (; he < 0; ) he += 2 * Math.PI;
      for (; he >= 2 * Math.PI; ) he -= 2 * Math.PI;
      return he;
    }, M = x(d(h)), $ = x(d(p)), _ = M <= $ ? $ : $ - 2 * Math.PI, C = t.points.rawVal.length, L = [], j = (le) => {
      const he = v.clone().multiplyScalar(Math.cos(le)).add(w.clone().multiplyScalar(Math.sin(le)));
      return m.clone().add(he.multiplyScalar(f));
    }, W = String(window.__hekatanArcModo ?? "angulo"), T = W === "x" ? 0 : W === "y" ? 1 : W === "z" ? 2 : -1;
    let H = false;
    if (T >= 0) {
      const le = e[T], he = a[T], $e = 512;
      let ye = Math.abs(he - le) > 1e-9, Ee = le;
      for (let ke = 1; ke <= $e && ye; ke++) {
        const Ze = j(_ * ke / $e).getComponent(T);
        (Ze - Ee) * (he - le) < -1e-9 && (ye = false), Ee = Ze;
      }
      if (ye) {
        H = true;
        for (let ke = 0; ke <= s; ke++) {
          const Ze = le + (he - le) * ke / s;
          let Re = 0, Se = _;
          for (let He = 0; He < 60; He++) {
            const ft = (Re + Se) / 2;
            (j(ft).getComponent(T) - Ze) * (he - le) < 0 ? Re = ft : Se = ft;
          }
          const qe = j((Re + Se) / 2);
          L.push([qe.x, qe.y, qe.z]);
        }
        L[0] = [e[0], e[1], e[2]], L[s] = [a[0], a[1], a[2]];
      } else try {
        (_a2 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a2.call(window, `\u26A0 El arco no es mon\xF3tono en ${W.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!H) for (let le = 0; le <= s; le++) {
      const he = j(_ * (le / s));
      L.push([he.x, he.y, he.z]);
    }
    if (Eo.push({ c: [m.x, m.y, m.z], r: f }), $o()) {
      Vo(L, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...L], t.polylines) {
      const le = L.map(($e, ye) => C + ye), he = t.polylines.rawVal;
      t.polylines.val = [...he.slice(0, -1), le, []];
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
    let l = 0;
    for (let p = 0; p + 1 < a.pl.length; p++) {
      const i = o[a.pl[p]], c = o[a.pl[p + 1]];
      l += Math.hypot(c[0] - i[0], c[1] - i[1], c[2] - i[2]);
      for (let r = 1; r < n; r++) {
        const u = r / n;
        o.push([i[0] + (c[0] - i[0]) * u, i[1] + (c[1] - i[1]) * u, i[2] + (c[2] - i[2]) * u]), s.push(o.length - 1);
      }
      s.push(a.pl[p + 1]);
    }
    const h = [...t.polylines.rawVal];
    h[a.i] = s, t.points.val = o, t.polylines.val = h;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return P(), { ok: true, tramosAntes: a.pl.length - 1, tramosAhora: s.length - 1, nudosNuevos: s.length - a.pl.length, largo: +l.toFixed(4), tramoMedio: +(l / (s.length - 1)).toFixed(4) };
  }, window.__hekatanDesfasarCurva = (e) => {
    var _a2, _b, _c, _d;
    if (!isFinite(e) || Math.abs(e) < 1e-9) return { ok: false, msg: "la distancia no puede ser cero" };
    const n = qa();
    if (!n) return { ok: false, msg: "no hay ninguna polil\xEDnea que desfasar" };
    const a = t.points.rawVal, o = n.pl.map((f) => new F(...a[f])), s = String(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy"), l = new F(...s === "xz" ? [0, 1, 0] : s === "yz" ? [1, 0, 0] : [0, 0, 1]), h = (f, b) => {
      const v = new F().subVectors(b, f), w = new F().crossVectors(l, v);
      return w.lengthSq() < 1e-18 ? null : w.normalize();
    }, p = o.map((f, b) => {
      const v = b > 0 ? h(o[b - 1], o[b]) : null, w = b + 1 < o.length ? h(o[b], o[b + 1]) : null;
      if (v && w) {
        const d = v.clone().add(w);
        if (d.lengthSq() < 1e-12) return v;
        d.normalize();
        const x = d.dot(v);
        return d.multiplyScalar(Math.abs(x) < 1e-6 ? 1 : 1 / x);
      }
      return v ?? w;
    });
    if (p.some((f) => f === null)) return { ok: false, msg: "la curva es perpendicular al plano de trabajo; cambie de plano" };
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const i = [...a], c = [];
    o.forEach((f, b) => {
      const v = f.clone().addScaledVector(p[b], e);
      i.push([v.x, v.y, v.z]), c.push(i.length - 1);
    });
    const r = [...t.polylines.rawVal];
    r.length && r[r.length - 1].length === 0 && r.pop(), r.push(c, []), t.points.val = i, t.polylines.val = r;
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    P();
    let u = 1 / 0, m = -1 / 0;
    for (let f = 0; f + 1 < o.length; f++) {
      const b = o[f], v = o[f + 1], w = h(b, v), d = new F(...i[c[f]]), x = Math.abs(new F().subVectors(d, b).dot(w));
      u = Math.min(u, x), m = Math.max(m, x);
    }
    return { ok: true, vertices: c.length, distancia: +e.toFixed(4), separacionMin: +u.toFixed(5), separacionMax: +m.toFixed(5) };
  }, window.__hekatanDrawCercha = (e) => {
    var _a2, _b;
    const n = e.luz, a = e.flecha, o = e.canto, s = Math.max(2, Math.round(e.panos)), l = e.tipo ?? "montantes", h = e.x0 ?? 0, p = e.y0 ?? 0, i = e.base ?? 0, c = Math.max(1, Math.round(e.copias ?? 1)), r = e.sep ?? 0;
    if (!(n > 0) || !(a > 0) || !(o > 0)) return { ok: false, msg: "luz, flecha y canto tienen que ser positivos" };
    const u = (n * n / 4 + a * a) / (2 * a);
    if (o >= u) return { ok: false, msg: `el canto (${o} m) no puede llegar al radio (${u.toFixed(3)} m)` };
    const m = 2 * Math.asin(Math.min(1, n / 2 / u)), f = i - (u - a), b = Math.atan2(i - f, h - (h + n / 2)), v = Math.atan2(i - f, h + n - (h + n / 2)), w = h + n / 2, d = (ye, Ee, ke) => [w + Ee * Math.cos(ye), ke, f + Ee * Math.sin(ye)];
    window.__hekatanPushUndo && window.__hekatanPushUndo();
    const x = [...t.points.rawVal], M = [...((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? []];
    M.length && M[M.length - 1].length === 0 && M.pop();
    const $ = (ye) => (x.push(ye), x.length - 1), _ = (ye, Ee) => {
      M.push([ye, Ee]);
    }, C = [];
    let L = 0, j = 0;
    for (let ye = 0; ye < c; ye++) {
      const Ee = p + ye * r, ke = [], Ze = [];
      for (let Re = 0; Re <= s; Re++) {
        const Se = b + (v - b) * (Re / s);
        ke.push($(d(Se, u, Ee))), Ze.push($(d(Se, u - o, Ee)));
      }
      C.push(ke), M.push([...ke]), M.push([...Ze]), _(ke[0], Ze[0]), _(ke[s], Ze[s]), j += 2;
      for (let Re = 1; Re < s; Re++) if ((l === "montantes" || l === "howe") && (_(ke[Re], Ze[Re]), j++), l === "warren") Re % 2 === 1 && (_(Ze[Re - 1], ke[Re]), _(ke[Re], Ze[Re + 1]), L += 2);
      else if (l === "howe") {
        const Se = Re < s / 2 ? 1 : -1;
        _(Ze[Re], ke[Re + Se]), L++;
      }
    }
    if (e.correas && c > 1) for (let ye = 0; ye + 1 < c; ye++) for (let Ee = 0; Ee <= s; Ee++) _(C[ye][Ee], C[ye + 1][Ee]);
    M.push([]), t.points.val = x, t.polylines && (t.polylines.val = M);
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    P();
    const W = (ye, Ee) => d(b + (v - b) * (ye / s), Ee, 0), T = (ye, Ee) => Math.hypot(ye[0] - Ee[0], ye[1] - Ee[1], ye[2] - Ee[2]), H = [], le = [], he = [];
    for (let ye = 0; ye < s; ye++) {
      H.push(T(W(ye, u), W(ye + 1, u))), le.push(T(W(ye, u - o), W(ye + 1, u - o)));
      const Ee = [W(ye + 1, u)[0] - W(ye, u - o)[0], 0, W(ye + 1, u)[2] - W(ye, u - o)[2]];
      he.push(Math.atan2(Ee[2], Ee[0]) * 180 / Math.PI);
    }
    const $e = (ye) => +ye.toFixed(3);
    return { ok: true, luz: $e(n), flecha: $e(a), canto: $e(o), radio: $e(u), anguloAbarcado: $e(m * 180 / Math.PI), clave: $e(i + a), centro: [$e(w), $e(p), $e(f)], panos: s, tipo: l, cerchas: c, separacion: $e(r), desarrolloSup: $e(u * m), desarrolloInf: $e((u - o) * m), tramoSupMin: $e(Math.min(...H)), tramoSupMax: $e(Math.max(...H)), tramoInfMin: $e(Math.min(...le)), tramoInfMax: $e(Math.max(...le)), anguloDiagMin: $e(Math.min(...he)), anguloDiagMax: $e(Math.max(...he)), montantes: j, diagonales: L, nudosNuevos: 2 * (s + 1) * c };
  }, window.__hekatanDrawPolinomio = (e, n = window.__hekatanArcSegs ?? 12) => {
    var _a2, _b, _c, _d;
    const a = e.length;
    if (a < 2) return { ok: false, msg: "faltan puntos" };
    const o = Math.max(a - 1, Math.round(n)), s = (_) => Math.max(...e.map((C) => C[_])) - Math.min(...e.map((C) => C[_])), l = [s(0), s(1), s(2)], h = String(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? ""), p = h === "xy" ? 2 : h === "xz" ? 1 : h === "yz" ? 0 : -1, i = p >= 0 && l[p] < 1e-6 ? p : l[2] <= l[0] && l[2] <= l[1] ? 2 : l[1] <= l[0] ? 1 : 0, c = i === 2 ? "xy" : i === 1 ? "xz" : "yz", r = [0, 1, 2].filter((_) => _ !== i), [u, m] = l[r[0]] >= l[r[1]] ? r : [r[1], r[0]], f = e.map((_) => _[u]), b = e.map((_) => _[m]);
    for (let _ = 0; _ < a; _++) for (let C = _ + 1; C < a; C++) if (Math.abs(f[_] - f[C]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[u]} en ${c.toUpperCase()}): no hay polinomio que pase por los dos` };
    const v = (_) => {
      let C = 0;
      for (let L = 0; L < a; L++) {
        let j = 1;
        for (let W = 0; W < a; W++) W !== L && (j *= (_ - f[W]) / (f[L] - f[W]));
        C += b[L] * j;
      }
      return C;
    }, w = (() => {
      const _ = a, C = f.map((W) => Array.from({ length: _ }, (T, H) => W ** H)), L = b.slice();
      for (let W = 0; W < _; W++) {
        let T = W;
        for (let H = W + 1; H < _; H++) Math.abs(C[H][W]) > Math.abs(C[T][W]) && (T = H);
        [C[W], C[T]] = [C[T], C[W]], [L[W], L[T]] = [L[T], L[W]];
        for (let H = W + 1; H < _; H++) {
          const le = C[H][W] / C[W][W];
          for (let he = W; he < _; he++) C[H][he] -= le * C[W][he];
          L[H] -= le * L[W];
        }
      }
      const j = new Array(_).fill(0);
      for (let W = _ - 1; W >= 0; W--) {
        let T = L[W];
        for (let H = W + 1; H < _; H++) T -= C[W][H] * j[H];
        j[W] = T / C[W][W];
      }
      return j;
    })(), d = f[0], x = f[a - 1], M = t.points.rawVal.length, $ = [];
    for (let _ = 0; _ <= o; _++) {
      const C = d + (x - d) * _ / o, L = [e[0][0], e[0][1], e[0][2]];
      L[u] = C, L[m] = v(C), L[i] = e[0][i], $.push(L);
    }
    if ($[0] = [e[0][0], e[0][1], e[0][2]], $[o] = [e[a - 1][0], e[a - 1][1], e[a - 1][2]], $o()) return Vo($, false), { ok: true, plano: c, coef: w, ia: u, io: m };
    if (t.points.val = [...t.points.rawVal, ...$], t.polylines) {
      const _ = $.map((L, j) => M + j), C = t.polylines.rawVal;
      t.polylines.val = ((_d = C[C.length - 1]) == null ? void 0 : _d.length) > 0 ? [...C, _, []] : [...C.slice(0, -1), _, []];
    }
    return { ok: true, plano: c, coef: w, ia: u, io: m };
  };
  const Ga = () => {
    var _a2, _b;
    const e = t.points.rawVal, n = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), o = window.__hekatanDrawingAuxLines, s = (o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? [], l = [], h = [], p = /* @__PURE__ */ new Set(), i = (c) => [e[c][0], e[c][1], e[c][2]];
    return [...Je].forEach((c) => {
      const r = c.split(":");
      if (r[0] === "aux") {
        const m = s[+r[1]];
        m && m.length === 6 && (l.push([[m[0], m[1], m[2]], [m[3], m[4], m[5]]]), h.push(c));
        return;
      }
      const u = r[0] === "poly" || r[0] === "seg" ? +r[1] : -1;
      if (!(u < 0 || !n[u] || a.has(u))) if (r[0] === "poly") {
        if (p.has(u)) return;
        p.add(u);
        for (let m = 0; m + 1 < n[u].length; m++) l.push([i(n[u][m]), i(n[u][m + 1])]);
      } else {
        const m = n[u][+r[2]], f = n[u][+r[2] + 1];
        m != null && f != null && !p.has(u) && l.push([i(m), i(f)]);
      }
    }), { segs: l, auxIds: h };
  }, uo = (e, n) => Math.abs(e[0] - n[0]) < 1e-6 && Math.abs(e[1] - n[1]) < 1e-6 && Math.abs(e[2] - n[2]) < 1e-6, Gs = (e) => {
    const n = new Array(e.length).fill(false), a = [];
    for (let o = 0; o < e.length; o++) {
      if (n[o]) continue;
      n[o] = true;
      const s = [e[o][0], e[o][1]];
      let l = true;
      for (; l; ) {
        l = false;
        for (let p = 0; p < e.length; p++) {
          if (n[p]) continue;
          const [i, c] = e[p], r = s[s.length - 1], u = s[0];
          uo(i, r) ? (s.push(c), n[p] = true, l = true) : uo(c, r) ? (s.push(i), n[p] = true, l = true) : uo(c, u) ? (s.unshift(i), n[p] = true, l = true) : uo(i, u) && (s.unshift(c), n[p] = true, l = true);
        }
      }
      const h = s.length > 3 && uo(s[0], s[s.length - 1]);
      h && s.pop(), a.push({ pts: s, cerrada: h });
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
    const s = Math.max(3, Math.round(a || 16)), l = Math.abs(o - 360) < 1e-9, h = s, p = l ? s : s + 1, { segs: i, auxIds: c } = Ga();
    if (!i.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (l && s % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    Pt();
    const r = t.points.rawVal, u = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], m = [...r];
    let f = u.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const b = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], v = /* @__PURE__ */ new Map(), w = (L) => L.map((j) => Math.round(j * 1e4)).join(","), d = (L) => Math.hypot(L[0] - e, L[1] - n) < 1e-6, x = (L) => {
      const j = w(L);
      let W = v.get(j);
      if (W) return W;
      if (d(L)) return W = [aa(m, L)], v.set(j, W), W;
      const T = Math.hypot(L[0] - e, L[1] - n), H = Math.atan2(L[1] - n, L[0] - e);
      W = [];
      for (let le = 0; le < p; le++) {
        const he = H + o * Math.PI / 180 * le / s;
        W.push(aa(m, le === 0 ? L : [e + T * Math.cos(he), n + T * Math.sin(he), L[2]]));
      }
      return v.set(j, W), W;
    };
    let M = 0, $ = false;
    const _ = (L) => {
      b.push(f.length), f.push([...L, L[0]]), M++;
    };
    for (const [L, j] of i) {
      const W = x(L), T = x(j);
      if (!(W.length === 1 && T.length === 1)) {
        if (W.length === 1 || T.length === 1) {
          $ = true;
          const H = W.length === 1 ? W[0] : T[0], le = W.length === 1 ? T : W;
          for (let he = 0; he + 2 <= h; he += 2) _([H, le[he % p], le[(he + 1) % p], le[(he + 2) % p]]);
          continue;
        }
        for (let H = 0; H < h; H++) _([W[H], T[H], T[(H + 1) % p], W[(H + 1) % p]]);
      }
    }
    f.push([]), t.points.val = m, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = b);
    const C = Ka(c);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), { anillos: v.size, areas: M, polo: $, guias: C };
  }, window.__hekatanLoftSelection = (e, n) => {
    var _a2, _b, _c;
    const { segs: a, auxIds: o } = Ga(), s = Gs(a), l = (T) => T.pts.every((H) => Math.abs(H[2] - T.pts[0][2]) < 1e-6), h = s.find((T) => T.cerrada && l(T)), p = s.find((T) => !T.cerrada && T.pts.length >= 2 && !l(T));
    if (!h) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!p) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const i = h.pts, c = i.length, r = p.pts.slice();
    r[r.length - 1][2] < r[0][2] && r.reverse();
    let u = 0;
    for (let T = 0; T < c; T++) {
      const H = i[T], le = i[(T + 1) % c];
      u += H[0] * le[1] - le[0] * H[1];
    }
    const m = u > 0 ? 1 : -1, f = (T) => {
      const H = i[(T - 1 + c) % c], le = i[T], he = i[(T + 1) % c], $e = [le[0] - H[0], le[1] - H[1]], ye = [he[0] - le[0], he[1] - le[1]], Ee = Math.hypot($e[0], $e[1]) || 1, ke = Math.hypot(ye[0], ye[1]) || 1, Ze = [m * $e[1] / Ee, -m * $e[0] / Ee], Re = [m * ye[1] / ke, -m * ye[0] / ke], Se = 1 + (Ze[0] * Re[0] + Ze[1] * Re[1]);
      return [(Ze[0] + Re[0]) / Math.max(Se, 1e-6), (Ze[1] + Re[1]) / Math.max(Se, 1e-6)];
    }, b = i.map((T, H) => f(H)), v = r[0];
    let w = [0, 0], d = 0;
    for (const T of r) {
      const H = T[0] - v[0], le = T[1] - v[1], he = Math.hypot(H, le);
      he > d && (d = he, w = [H / he, le / he]);
    }
    if (d < 1e-9) {
      const T = v[0] - e, H = v[1] - n, le = Math.hypot(T, H) || 1;
      w = [T / le, H / le];
    }
    w[0] * (v[0] - e) + w[1] * (v[1] - n) < 0 && (w = [-w[0], -w[1]]), Pt();
    const x = t.points.rawVal, M = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], $ = [...x];
    let _ = M.slice();
    _.length && _[_.length - 1].length === 0 && (_ = _.slice(0, -1));
    const C = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], L = r.map((T) => {
      const H = (T[0] - v[0]) * w[0] + (T[1] - v[1]) * w[1], le = T[2];
      return i.map((he, $e) => aa($, [he[0] + b[$e][0] * H, he[1] + b[$e][1] * H, le]));
    });
    let j = 0;
    for (let T = 0; T + 1 < L.length; T++) for (let H = 0; H < c; H++) {
      const le = [L[T][H], L[T][(H + 1) % c], L[T + 1][(H + 1) % c], L[T + 1][H]];
      new Set(le).size < 4 || (C.push(_.length), _.push([...le, le[0]]), j++);
    }
    _.push([]), t.points.val = $, t.polylines && (t.polylines.val = _), t.areas && (t.areas.val = C);
    const W = Ka(o);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), { contorno: c, perfil: r.length, areas: j, guias: W };
  }, window.__hekatanDrawSlabChaflan = (e, n, a = 1, o = 6, s = 6) => {
    const l = Math.min(e[0], n[0]), h = Math.max(e[0], n[0]), p = Math.min(e[1], n[1]), i = Math.max(e[1], n[1]), c = (e[2] + n[2]) / 2, r = h - l, u = i - p, m = Math.min(a, r / 2 - 0.01, u / 2 - 0.01);
    if (m <= 0) return;
    const f = t.points.rawVal.length, b = [], v = [], w = (d, x) => {
      b.push([d, x, c]), v.push(f + b.length - 1);
    };
    for (let d = 0; d <= s; d++) w(l + m + (r - 2 * m) * d / s, p);
    for (let d = 1; d <= o; d++) {
      const x = -Math.PI / 2 + Math.PI / 2 * d / o;
      w(h - m + m * Math.cos(x), p + m + m * Math.sin(x));
    }
    for (let d = 1; d <= s; d++) w(h, p + m + (u - 2 * m) * d / s);
    for (let d = 1; d <= o; d++) {
      const x = 0 + Math.PI / 2 * d / o;
      w(h - m + m * Math.cos(x), i - m + m * Math.sin(x));
    }
    for (let d = 1; d <= s; d++) w(h - m - (r - 2 * m) * d / s, i);
    for (let d = 1; d <= o; d++) {
      const x = Math.PI / 2 + Math.PI / 2 * d / o;
      w(l + m + m * Math.cos(x), i - m + m * Math.sin(x));
    }
    for (let d = 1; d <= s; d++) w(l, i - m - (u - 2 * m) * d / s);
    for (let d = 1; d < o; d++) {
      const x = Math.PI + Math.PI / 2 * d / o;
      w(l + m + m * Math.cos(x), p + m + m * Math.sin(x));
    }
    if (v.push(f), $o()) {
      Vo(b, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...b], t.polylines) {
      const d = t.polylines.rawVal;
      t.polylines.val = [...d.slice(0, -1), v, []];
    }
  }, window.__hekatanDrawRect = (e, n) => {
    const a = t.points.rawVal.length, o = e[0], s = e[1], l = e[2], h = n[0], p = n[1], i = n[2];
    let c;
    if (Math.abs(l - i) < 1e-6 ? c = [[o, s, l], [h, s, l], [h, p, l], [o, p, l]] : Math.abs(s - p) < 1e-6 ? c = [[o, s, l], [h, s, l], [h, s, i], [o, s, i]] : c = [[o, s, l], [o, p, l], [o, p, i], [o, s, i]], t.points.val = [...t.points.rawVal, ...c], t.polylines) {
      const r = [a, a + 1, a + 2, a + 3, a], u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), r, []];
    }
  }, window.__hekatanDrawRectArea = (e, n) => {
    var _a2;
    const a = t.points.rawVal.length, o = e[0], s = e[1], l = e[2], h = n[0], p = n[1], i = n[2];
    let c;
    if (Z && t.gridTarget) {
      const r = t.gridTarget.rawVal, u = new Cn(...r.rotation), m = new F(1, 0, 0).applyEuler(u), f = new F(0, 1, 0).applyEuler(u), b = new F(...r.position), v = new F(o, s, l), w = new F(h, p, i), d = v.clone().sub(b).dot(m), x = v.clone().sub(b).dot(f), M = w.clone().sub(b).dot(m), $ = w.clone().sub(b).dot(f), _ = (C, L) => b.clone().addScaledVector(m, C).addScaledVector(f, L).toArray();
      c = [_(d, x), _(M, x), _(M, $), _(d, $)];
    } else Math.abs(l - i) < 1e-6 ? c = [[o, s, l], [h, s, l], [h, p, l], [o, p, l]] : Math.abs(s - p) < 1e-6 ? c = [[o, s, l], [h, s, l], [h, s, i], [o, s, i]] : c = [[o, s, l], [o, p, l], [o, p, i], [o, s, i]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...c], t.polylines) {
      const r = t.polylines.rawVal, u = r.length - 1, m = [a, a + 1, a + 2, a + 3, a];
      t.polylines.val = [...r.slice(0, -1), m, []], t.areas && (t.areas.val = [...t.areas.rawVal, u]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    P();
  }, window.__hekatanFillClosedAreas = () => {
    var _a2, _b, _c;
    const e = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = t.points.rawVal, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = (w) => w.map((d) => Math.round(d * 1e4) / 1e4).join(",");
    for (let w = 0; w < n.length; w++) {
      const d = s(n[w]), x = a.get(d);
      x === void 0 && a.set(d, w), o.set(w, x ?? w);
    }
    const l = e.map((w) => w.map((d) => o.get(d) ?? d)), h = /* @__PURE__ */ new Map(), p = (w, d) => {
      w !== d && ((h.get(w) ?? h.set(w, /* @__PURE__ */ new Set()).get(w)).add(d), (h.get(d) ?? h.set(d, /* @__PURE__ */ new Set()).get(d)).add(w));
    };
    for (const w of l) for (let d = 0; d + 1 < w.length; d++) p(w[d], w[d + 1]);
    const i = (w, d) => {
      var _a3;
      return !!((_a3 = h.get(w)) == null ? void 0 : _a3.has(d));
    }, c = /* @__PURE__ */ new Set(), r = [], u = [...h.keys()];
    for (const w of u) for (const d of h.get(w)) if (!(d < w)) {
      for (const x of h.get(d)) if (x !== w) for (const M of h.get(x)) {
        if (M === w || M === d || !i(M, w) || i(w, x) || i(d, M)) continue;
        const $ = [w, d, x, M].slice().sort((_, C) => _ - C).join("-");
        c.has($) || (c.add($), r.push([w, d, x, M]));
      }
    }
    for (const w of u) for (const d of h.get(w)) if (!(d < w)) for (const x of h.get(d)) {
      if (x === w || !i(x, w)) continue;
      const M = [w, d, x].slice().sort(($, _) => $ - _).join("-");
      c.has(M) || (c.add(M), r.push([w, d, x]));
    }
    if (!r.length) return 0;
    const m = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], f = new Set(m.map((w) => [...new Set(l[w] ?? [])].sort((d, x) => d - x).join("-"))), b = [...l];
    let v = 0;
    for (const w of r) {
      const d = w.slice().sort((x, M) => x - M).join("-");
      f.has(d) || (f.add(d), b.push([...w, w[0]]), m.push(b.length - 1), v++);
    }
    if (v) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = b, t.areas && (t.areas.val = m);
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
    let o = 0, s = 0, l = 0;
    for (let Se = 0; Se < a; Se++) {
      const qe = e[Se], He = e[(Se + 1) % a];
      o += (qe[1] - He[1]) * (qe[2] + He[2]), s += (qe[2] - He[2]) * (qe[0] + He[0]), l += (qe[0] - He[0]) * (qe[1] + He[1]);
    }
    const h = Math.hypot(o, s, l) || 1;
    o /= h, s /= h, l /= h;
    let p = e[1][0] - e[0][0], i = e[1][1] - e[0][1], c = e[1][2] - e[0][2];
    const r = Math.hypot(p, i, c) || 1;
    p /= r, i /= r, c /= r;
    let u = s * c - l * i, m = l * p - o * c, f = o * i - s * p;
    const b = Math.hypot(u, m, f) || 1;
    u /= b, m /= b, f /= b;
    const v = e[0], w = (Se) => [(Se[0] - v[0]) * p + (Se[1] - v[1]) * i + (Se[2] - v[2]) * c, (Se[0] - v[0]) * u + (Se[1] - v[1]) * m + (Se[2] - v[2]) * f], d = (Se, qe) => [v[0] + Se * p + qe * u, v[1] + Se * i + qe * m, v[2] + Se * c + qe * f], x = e.map(w);
    let M = 1 / 0, $ = -1 / 0, _ = 1 / 0, C = -1 / 0;
    for (const [Se, qe] of x) Se < M && (M = Se), Se > $ && ($ = Se), qe < _ && (_ = qe), qe > C && (C = qe);
    const L = $ - M, j = C - _;
    if (L < 1e-6 || j < 1e-6) return 0;
    let W = n && n > 0 ? n : 0.5;
    for (; L / W * (j / W) > 2500; ) W *= 2;
    W = Math.min(W, Math.min(L, j));
    const T = (Se, qe) => {
      let He = false;
      for (let ft = 0, it = x.length - 1; ft < x.length; it = ft++) {
        const [mt, Nt] = x[ft], [en, tn] = x[it];
        Nt > qe != tn > qe && Se < (en - mt) * (qe - Nt) / (tn - Nt) + mt && (He = !He);
      }
      return He;
    }, H = Math.max(1, Math.round(L / W)), le = Math.max(1, Math.round(j / W)), he = L / H, $e = j / le, ye = /* @__PURE__ */ new Map(), Ee = [], ke = t.points.rawVal.length, Ze = (Se, qe) => {
      const He = Se + "," + qe, ft = ye.get(He);
      if (ft !== void 0) return ft;
      const it = ke + Ee.length;
      return Ee.push(d(M + Se * he, _ + qe * $e)), ye.set(He, it), it;
    }, Re = [];
    for (let Se = 0; Se < H; Se++) for (let qe = 0; qe < le; qe++) {
      if (!T(M + (Se + 0.5) * he, _ + (qe + 0.5) * $e)) continue;
      const He = Ze(Se, qe), ft = Ze(Se + 1, qe), it = Ze(Se + 1, qe + 1), mt = Ze(Se, qe + 1);
      Re.push([He, ft, it, mt]);
    }
    if (!Re.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...Ee], t.polylines && t.areas) {
      let Se = t.polylines.rawVal.slice();
      Se.length && Se[Se.length - 1].length === 0 && (Se = Se.slice(0, -1));
      const qe = [];
      for (const He of Re) qe.push(Se.length), Se.push([He[0], He[1], He[2], He[3], He[0]]);
      Se.push([]), t.polylines.val = Se, t.areas.val = [...t.areas.rawVal, ...qe];
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
    const o = new F(e[0], e[1], e[2]), s = new F(n[0], n[1], n[2]), l = new F(a[0], a[1], a[2]), h = new F().subVectors(s, o).cross(new F().subVectors(l, o));
    if (h.lengthSq() < 1e-9) return false;
    h.normalize();
    const p = new go().setFromUnitVectors(new F(0, 0, 1), h), i = new Cn().setFromQuaternion(p);
    t.gridTarget && (t.gridTarget.val = { position: [o.x, o.y, o.z], rotation: [i.x, i.y, i.z] }), Z = true;
    const c = new F().addVectors(o, s).add(l).multiplyScalar(1 / 3), r = Math.max(o.distanceTo(s), o.distanceTo(l), s.distanceTo(l)) * 2.2 + 4, u = r / 2;
    Xt.geometry.dispose(), Xt.geometry = new Vn(r, r), on.geometry.dispose(), on.geometry = new ys(new Vn(r, r)), So(u, 1), St.position.copy(c), St.quaternion.copy(p), St.scale.set(1, 1, 1), St.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return P(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), Z = false, St.visible = false, P();
  };
  const ln = new pt();
  ln.visible = false, g.add(ln), window.__hekatanShowAxes = (e, n, a = 12, o = 2) => {
    var _a2, _b;
    for (; ln.children.length; ) {
      const r = ln.children.pop();
      (_a2 = r.geometry) == null ? void 0 : _a2.dispose(), (_b = r.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !n.length) return;
    const s = Math.min(...n) - o, l = Math.max(...n) + o, h = Math.min(...e) - o, p = Math.max(...e) + o, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", c = (r, u, m, f, b) => {
      const v = document.createElement("canvas");
      v.width = 64, v.height = 32;
      const w = v.getContext("2d");
      w.fillStyle = b, w.font = "bold 22px sans-serif", w.textAlign = "center", w.fillText(r, 32, 26);
      const d = new xs(v), x = new gs({ map: d, transparent: true }), M = new bs(x);
      return M.position.set(u, m, f), M.scale.set(1.2, 0.6, 1), M;
    };
    e.forEach((r, u) => {
      const m = u < i.length ? i[u] : `X${u}`, f = new Ve().setFromPoints([new F(r, s, 0), new F(r, l, 0), new F(r, s, 0), new F(r, s, a)]), b = new so({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new nn(f, b);
      v.computeLineDistances(), ln.add(v), ln.add(c(m, r, s - 0.5, 0, "#60a5fa")), ln.add(c(m, r, l + 0.5, 0, "#60a5fa"));
    }), n.forEach((r, u) => {
      const m = `${u + 1}`, f = new Ve().setFromPoints([new F(h, r, 0), new F(p, r, 0), new F(h, r, 0), new F(h, r, a)]), b = new so({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), v = new nn(f, b);
      v.computeLineDistances(), ln.add(v), ln.add(c(m, h - 0.5, r, 0, "#fb7185")), ln.add(c(m, p + 0.5, r, 0, "#fb7185"));
    }), ln.visible = true, P();
  }, window.__hekatanHideAxes = () => {
    ln.visible = false, P();
  };
  const Pn = new pt();
  Pn.visible = false, g.add(Pn);
  let Hn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], n = 20, a = 0, o = 0) => {
    var _a2, _b;
    for (; Pn.children.length; ) {
      const l = Pn.children.pop();
      (_a2 = l.geometry) == null ? void 0 : _a2.dispose(), (_b = l.material) == null ? void 0 : _b.dispose();
    }
    Hn.forEach((l) => {
      g.remove(l), l.geometry.dispose(), l.material.dispose();
    }), Hn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((l, h) => {
      const p = s[h % s.length], i = n / 2, c = [new F(a - i, o - i, l), new F(a + i, o - i, l), new F(a + i, o + i, l), new F(a - i, o + i, l), new F(a - i, o - i, l)], r = new Ve().setFromPoints(c), u = new wt({ color: p, transparent: true, opacity: 0.55 });
      Pn.add(new Et(r, u));
      const m = document.createElement("canvas");
      m.width = 128, m.height = 32;
      const f = m.getContext("2d");
      f.fillStyle = `#${p.toString(16).padStart(6, "0")}`, f.font = "bold 18px sans-serif", f.fillText(`Z = ${l} m`, 4, 22);
      const b = new xs(m), v = new gs({ map: b, transparent: true }), w = new bs(v);
      w.position.set(a - i - 1.5, o - i - 1.5, l), w.scale.set(2.5, 0.6, 1), Pn.add(w);
      const d = new Vn(1e4, 1e4), x = new xt({ visible: false, side: Lt }), M = new dt(d, x);
      M.position.set(0, 0, l), M.frustumCulled = false, M.userData = { refPlaneZ: l }, g.add(M), Hn.push(M);
    }), Pn.visible = true, P();
  }, window.__hekatanHideRefPlanes = () => {
    Pn.visible = false, Hn.forEach((e) => {
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
      const o = new Ve().setFromPoints([new F(a[0], a[1], a[2]), new F(a[3], a[4], a[5])]), s = new so({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), l = new Et(o, s);
      l.computeLineDistances(), po.add(l);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Ks(), P());
  });
  const Jn = new pt();
  Jn.frustumCulled = false, g.add(Jn);
  const Wa = () => {
    var _a2, _b, _c, _d;
    for (; Jn.children.length; ) {
      const a = Jn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, n = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const a of n) {
      if (!a || a.length !== 3) continue;
      const o = new dt(new io(0.025, 12, 12), new xt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      o.position.set(a[0], a[1], a[2]), o.renderOrder = 996, o.scale.setScalar(Co(o.position)), Jn.add(o);
    }
  };
  ue.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Wa(), P());
  }), S.addEventListener("change", () => {
    Jn.children.forEach((e) => {
      e.scale.setScalar(Co(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Wa;
  const vt = new pt(), Ws = new dt(new io(0.01, 12, 12), new xt({ color: 16777215, transparent: true, opacity: 0.95 })), Ha = new dt(new io(0.015, 12, 12), new xt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Ha.visible = false, vt.add(Ws, Ha);
  const On = 0.08, sa = (e, n, a) => {
    const o = new Ve().setFromPoints([new F(...e), new F(...n)]);
    return new Et(o, new wt({ color: a, transparent: true, opacity: 0.7 }));
  };
  vt.add(sa([-On, 0, 0], [On, 0, 0], 16777215)), vt.add(sa([0, -On, 0], [0, On, 0], 16777215)), vt.add(sa([0, 0, -On], [0, 0, On], 16777215)), vt.visible = false, vt.frustumCulled = false, g.add(vt);
  let ia = 2;
  const Io = (e) => {
    const n = k(), a = (E == null ? void 0 : E.clientHeight) || 700;
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
  }, E.addEventListener("pointermove", (e) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const n = B(e);
    if (!n) return;
    V.setFromCamera(N, n), se = null;
    const a = Ye();
    if ((!a.length || ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) !== "fillarea") && ut.visible && (ut.visible = false), a.length) {
      const o = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const f = Kt([o.x, o.y, o.z]);
        if (f) {
          const b = f.map((d) => t.points.rawVal[d]), v = [];
          for (let d = 1; d < b.length - 1; d++) v.push(b[0][0], b[0][1], b[0][2], b[d][0], b[d][1], b[d][2], b[d + 1][0], b[d + 1][1], b[d + 1][2]);
          const w = ut.geometry;
          w.setAttribute("position", new It(v, 3)), w.computeVertexNormals(), ut.visible = true;
        } else ut.visible = false;
      } else ut.visible && (ut.visible = false);
      const s = e.altKey;
      let l = false;
      const h = la(o), p = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, o.x, o.y, o.z, h, { x: e.clientX, y: e.clientY });
      if (p) No(p.type, p.x, p.y, p.z), vt.position.set(p.x, p.y, p.z), vt.visible = true, o.set(p.x, p.y, p.z), Xo(p.type, e.clientX, e.clientY);
      else if (!s && (Ce = _e(e.clientX, e.clientY))) l = true, o.copy(Ce), No("ifcSec", o.x, o.y, o.z), Xo("ifcSec", e.clientX, e.clientY), vt.position.copy(o), vt.visible = true;
      else if (ae && !s) l = true, No(ae.tipo, o.x, o.y, o.z), Xo(ae.tipo, e.clientX, e.clientY), vt.position.copy(o), vt.visible = true;
      else {
        ti(), Yo();
        const m = !s && window.__hekatanSnapEnabled !== false, f = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        m && f > 0 && (o.x = Math.round(o.x / f) * f, o.y = Math.round(o.y / f) * f, o.z = Math.round(o.z / f) * f), vt.position.copy(o), vt.visible = true;
      }
      fo(), U(se && !p && (l || ae) ? G(se) : null), Tt = { p: o.clone(), x: e.clientX, y: e.clientY };
      const i = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (i === "select" || !i) {
        const m = (window.__hekatanSnap2D ?? 0.5) * 1.5, f = Us(o.x, o.y, o.z, m), b = oa(o.x, o.y, o.z, m), v = Na(o.x, o.y, o.z, m);
        if (f >= 0) {
          const M = t.points.rawVal[f];
          an.position.set(M[0], M[1], M[2]), an.visible = true, Ba(), xn.visible = false, bn = { kind: "pt", a: f };
        } else if (b) {
          const M = t.points.rawVal, $ = t.polylines.rawVal[b.polyIdx], _ = M[$[b.segIdx]], C = M[$[b.segIdx + 1]];
          xn.geometry.setFromPoints([new F(_[0], _[1], _[2]), new F(C[0], C[1], C[2])]), xn.visible = true, an.visible = false, bn = ((_m = (_l2 = t.areas) == null ? void 0 : _l2.rawVal) == null ? void 0 : _m.includes(b.polyIdx)) ?? false ? { kind: "poly", a: b.polyIdx } : { kind: "seg", a: b.polyIdx, b: b.segIdx };
        } else if (v >= 0) {
          const $ = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[v];
          $ && (xn.geometry.setFromPoints([new F($[0], $[1], $[2]), new F($[3], $[4], $[5])]), xn.visible = true, an.visible = false, bn = { kind: "aux", a: v });
        } else xn.visible = false, an.visible = false, bn = null;
        Fe.style.left = e.clientX + "px", Fe.style.top = e.clientY + "px", Fe.style.display = "block";
        let w = o;
        if ((bn == null ? void 0 : bn.kind) === "pt") {
          const M = t.points.rawVal[bn.a];
          M && (w = new F(M[0], M[1], M[2]));
        }
        const d = `X=${w.x.toFixed(2)} Y=${w.y.toFixed(2)} Z=${w.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [w.x, w.y, w.z], bn) {
          const M = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Fe.textContent = `${d}  \xB7  \u{1F5B1} Click \u2192 ${M[bn.kind]}`;
        } else Fe.textContent = d;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = d), Tt = { p: w.clone(), x: e.clientX, y: e.clientY }, We.visible = false, Ut.visible = false, Zt.visible = false, P();
        return;
      }
      if (i === "delete" || i === "trim" || i === "extend" || i === "offset") {
        const m = (window.__hekatanSnap2D ?? 0.5) * 1.5, f = oa(o.x, o.y, o.z, m), b = Na(o.x, o.y, o.z, m);
        let v = false;
        if (b >= 0) if (!f) v = true;
        else {
          const M = window.__hekatanDrawingAuxLines, _ = ((M == null ? void 0 : M.rawVal) ?? (M == null ? void 0 : M.val) ?? M ?? [])[b];
          co(o.x, o.y, o.z, _[0], _[1], _[2], _[3], _[4], _[5]) < f.dist && (v = true);
        }
        v ? (Fn = b, un = -1, An = -1, Zs(b)) : f ? (un = f.polyIdx, An = f.segIdx, Fn = -1, qs(f.polyIdx, f.segIdx)) : (un = -1, An = -1, Fn = -1, qt.visible = false), We.visible = false, Ut.visible = false, Zt.visible = false, fn(), Fe.style.left = e.clientX + "px", Fe.style.top = e.clientY + "px", Fe.style.display = "block";
        const w = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        let d = "";
        v ? d = `\u{1F5D1} l\xEDnea aux #${Fn + 1}` : f ? d = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(f.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${f.polyIdx + 1}` : `\u{1F5D1} seg ${f.segIdx + 1} / poly #${f.polyIdx + 1}` : d = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Fe.textContent = `${w}  \xB7  ${d}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = w), P();
        return;
      } else qt.visible = false, un = -1, Fn = -1;
      Fe.style.left = e.clientX + "px", Fe.style.top = e.clientY + "px", Fe.style.display = "block";
      const c = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], r = c[c.length - 1] ?? [], u = t.points.rawVal ?? [];
      if (r.length > 0 && u[r[r.length - 1]]) {
        const m = r[r.length - 1], f = u[m];
        let b = Ct;
        Wn = null;
        const v = !!p || l;
        if (!b && !v && window.__hekatanAxisSnap !== false) {
          const ye = E.getBoundingClientRect(), Ee = e.clientX, ke = e.clientY, Ze = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Re = new F(f[0], f[1], f[2]), Se = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], qe = (ft) => {
            const it = ft.clone().project(n);
            return { x: (it.x * 0.5 + 0.5) * ye.width + ye.left, y: (-it.y * 0.5 + 0.5) * ye.height + ye.top };
          };
          let He = null;
          for (const [ft, it] of Se) {
            const mt = qe(Re.clone().addScaledVector(it, -Ze)), Nt = qe(Re.clone().addScaledVector(it, Ze)), en = Nt.x - mt.x, tn = Nt.y - mt.y, oo = Ee - mt.x, Zn = ke - mt.y, ao = en * en + tn * tn || 1;
            let vn = (oo * en + Zn * tn) / ao;
            vn = Math.max(0, Math.min(1, vn));
            const us = Math.hypot(Ee - (mt.x + vn * en), ke - (mt.y + vn * tn));
            if (He === null || us < He.dpx) {
              const va = V.ray, ps = Re.clone().sub(va.origin), _a3 = it.dot(va.direction), fs = it.dot(ps), mi = va.direction.dot(ps), hs = 1 - _a3 * _a3, wi = Math.abs(hs) < 1e-6 ? -fs : (_a3 * mi - fs) / hs;
              He = { axis: ft, dpx: us, pt: Re.clone().addScaledVector(it, wi) };
            }
          }
          He && He.dpx <= 12 && (o.copy(He.pt), b = He.axis, Wn = He.pt.clone());
        }
        const w = !!window.__hekatanOrthoMode;
        if (!b && !v && w) {
          const ye = E.getBoundingClientRect(), Ee = new F(f[0], f[1], f[2]), ke = (it) => {
            const mt = it.clone().project(n);
            return { x: (mt.x * 0.5 + 0.5) * ye.width + ye.left, y: (-mt.y * 0.5 + 0.5) * ye.height + ye.top };
          }, Ze = ke(Ee), Re = e.clientX - Ze.x, Se = e.clientY - Ze.y, qe = Math.hypot(Re, Se), He = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], ft = Math.max(1, ((_s2 = settings.gridSize) == null ? void 0 : _s2.rawVal) ?? 10) * 0.5;
          if (qe > 4) {
            let it = null;
            for (const [mt, Nt] of He) {
              const en = ke(Ee.clone().addScaledVector(Nt, ft)), tn = en.x - Ze.x, oo = en.y - Ze.y, Zn = Math.hypot(tn, oo);
              if (Zn < 6) continue;
              const ao = Math.abs((Re * tn + Se * oo) / (qe * Zn));
              (!it || ao > it.cos) && (it = { axis: mt, cos: ao, u: Nt });
            }
            if (it) {
              b = it.axis;
              const mt = V.ray, Nt = Ee.clone().sub(mt.origin), en = it.u.dot(mt.direction), tn = it.u.dot(Nt), oo = mt.direction.dot(Nt), Zn = 1 - en * en, ao = Math.abs(Zn) < 1e-6 ? -tn : (en * oo - tn) / Zn, vn = Ee.clone().addScaledVector(it.u, ao);
              isFinite(vn.x) && isFinite(vn.y) && isFinite(vn.z) && (o.copy(vn), Wn = vn.clone());
            }
          }
        }
        const d = window.__hekatanPolarTrack !== false;
        if (!b && !v && d) {
          const ye = o.x - f[0], Ee = o.y - f[1], ke = o.z - f[2], Ze = Math.hypot(ye, Ee, ke);
          if (Ze > 1e-3) {
            const Se = Math.tan(6 * Math.PI / 180) * Ze, qe = Math.hypot(Ee, ke), He = Math.hypot(ye, ke), ft = Math.hypot(ye, Ee), it = [["x", qe], ["y", He], ["z", ft]];
            it.sort((mt, Nt) => mt[1] - Nt[1]), it[0][1] <= Se && (b = it[0][0]);
          }
        }
        if (b) {
          const ye = f[0], Ee = f[1], ke = f[2];
          b === "x" ? o.set(o.x, Ee, ke) : b === "y" ? o.set(ye, o.y, ke) : o.set(ye, Ee, o.z);
          const Ze = !!Ct, Se = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[b];
          Dt.style.background = "rgba(15,23,42,0.92)", Dt.style.color = Se, Dt.style.border = `1.5px solid ${Se}`;
          const qe = (_t2 = a[0]) == null ? void 0 : _t2.object;
          let He = null;
          qe === Wt ? He = "xy" : qe === Ot ? He = "xz" : qe === wn && (He = "yz");
          const ft = He ? ` (plano ${He.toUpperCase()})` : "";
          Dt.textContent = Ze ? `\u{1F512} LOCK ${b.toUpperCase()}${ft}` : `\u22A5 ORTO ${b.toUpperCase()}${ft}`, Dt.style.left = e.clientX + 20 + "px", Dt.style.top = e.clientY + 18 + "px", Dt.style.transform = "none", Dt.style.display = "block";
        } else Ct || (Dt.style.display = "none");
        let x = null;
        if (!s && !v && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const ye = t.points.rawVal, Ee = b ? [b] : ["z", "x", "y"], ke = { x: e.clientX, y: e.clientY };
          let Ze = 1 / 0;
          for (const Re of ye) if (!(Math.abs(Re[0] - f[0]) < 1e-9 && Math.abs(Re[1] - f[1]) < 1e-9 && Math.abs(Re[2] - f[2]) < 1e-9)) for (const Se of Ee) {
            const qe = new F(Se === "x" ? Re[0] : o.x, Se === "y" ? Re[1] : o.y, Se === "z" ? Re[2] : o.z), He = Xn(qe.x, qe.y, qe.z);
            if (!He) continue;
            const ft = Math.hypot(He.x - ke.x, He.y - ke.y);
            ft < En && ft < Ze && (Ze = ft, x = { q: Re, eje: Se });
          }
        }
        x ? (x.eje === "x" ? o.x = x.q[0] : x.eje === "y" ? o.y = x.q[1] : o.z = x.q[2], Zt.geometry.setFromPoints([new F(x.q[0], x.q[1], x.q[2]), new F(o.x, o.y, o.z)]), (_u = Zt.computeLineDistances) == null ? void 0 : _u.call(Zt), Zt.visible = true, vt.position.set(o.x, o.y, o.z), vt.visible = true, Xo("track", e.clientX, e.clientY)) : Zt.visible = false, Tt = { p: o.clone(), x: e.clientX, y: e.clientY };
        const M = Math.hypot(o.x - f[0], o.y - f[1], o.z - f[2]), $ = Math.atan2(o.y - f[1], o.x - f[0]) * 180 / Math.PI, _ = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`, C = ($ % 360 + 360) % 360;
        Fe.textContent = `L = ${M.toFixed(3)} m   \u2220 ${C.toFixed(1)}\xB0   \xB7   ${_}`;
        const L = document.getElementById("hk-coord-fixed");
        L && (L.textContent = _), We.geometry.setFromPoints([new F(f[0], f[1], f[2]), new F(o.x, o.y, o.z)]), (_v = We.computeLineDistances) == null ? void 0 : _v.call(We), We.visible = true, gt(f[0], f[1], f[2], o.x, o.y, o.z);
        const j = window.__hekatanOrthoExt ?? 8, W = window.__hekatanShowOrthoPlanes !== false;
        mn.visible = W, W || Ra(null), W && (Sn(Dn, f, "xy", j), Sn(Kn, f, "xz", j), Sn(Bn, f, "yz", j), kn(Wt, f, "xy", j), kn(Ot, f, "xz", j), kn(wn, f, "yz", j));
        const T = W ? V.intersectObjects([Wt, Ot, wn], false) : [];
        let H = null;
        if (T.length > 0) {
          const ye = T[0].object;
          ye === Wt ? H = "xy" : ye === Ot ? H = "xz" : ye === wn && (H = "yz");
        }
        Ra(H), H && (yn.style.left = e.clientX + "px", yn.style.top = e.clientY + "px"), _n.geometry.setFromPoints([new F(f[0] - j, f[1], f[2]), new F(f[0] + j, f[1], f[2])]), (_w = _n.computeLineDistances) == null ? void 0 : _w.call(_n), hn.geometry.setFromPoints([new F(f[0], f[1] - j, f[2]), new F(f[0], f[1] + j, f[2])]), (_x = hn.computeLineDistances) == null ? void 0 : _x.call(hn), Tn.geometry.setFromPoints([new F(f[0], f[1], f[2] - j), new F(f[0], f[1], f[2] + j)]), (_y = Tn.computeLineDistances) == null ? void 0 : _y.call(Tn), Ut.visible = true;
        const le = _n.material, he = hn.material, $e = Tn.material;
        _n.visible = b === "x", hn.visible = b === "y", Tn.visible = b === "z", le.opacity = 0.95, he.opacity = 0.95, $e.opacity = 0.95;
      } else {
        const m = `X=${o.x.toFixed(2)} Y=${o.y.toFixed(2)} Z=${o.z.toFixed(2)}`;
        Fe.textContent = m;
        const f = document.getElementById("hk-coord-fixed");
        if (f && (f.textContent = m), We.visible = false, Ut.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(i)) {
          if (Ge = null, rt = null, ze.style.left = e.clientX + 20 + "px", ze.style.top = e.clientY - 28 + "px", ze.style.display = "block", !et) {
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
    Z = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  });
  function Oa(e, n, a) {
    var _a2, _b, _c, _d, _e2, _f, _g;
    {
      for (const o of Gn) g.remove(o), na(o);
      if (Gn.length = 0, n) {
        const o = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], s = /* @__PURE__ */ new Set([0]);
        for (const p of o) s.add(+p[2].toFixed(3));
        const l = /* @__PURE__ */ new Set();
        for (const p of window.__hekatanLevels ?? []) isFinite(p == null ? void 0 : p.z) && (s.add(+p.z.toFixed(3)), l.add(+p.z.toFixed(3)));
        const h = [...s].sort((p, i) => p - i).slice(0, 24);
        for (const p of h) {
          if (Math.abs(p - e) < 1e-6) continue;
          const i = y.clone(true);
          i.name = `hekatan-grid-nivel-${p}`, i.traverse((c) => {
            c.material && (c.material = c.material.clone(), c.material.transparent = true, c.material.opacity = (c.material.opacity ?? 1) * (l.has(p) ? 0.65 : Math.abs(p) < 1e-6 ? 0.5 : 0.22));
          }), i.position.set(0, 0, p), i.quaternion.identity(), g.add(i), Gn.push(i);
        }
      }
    }
    {
      const o = window.__hekatanPlanosAux ?? [], s = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", l = ((_g = (_f = (_e2 = window.__hekatanCadState) == null ? void 0 : _e2.get) == null ? void 0 : _f.call(_e2)) == null ? void 0 : _g[s === "xz" ? "workY" : s === "yz" ? "workX" : "workZ"]) ?? 0;
      for (const h of o.slice(0, 24)) {
        if (h.plano === "xy" || !isFinite(h.d) || h.plano === s && Math.abs(h.d - l) < 1e-6) continue;
        const p = y.clone(true);
        p.name = `hekatan-grid-${h.plano}-${h.d}`, p.traverse((i) => {
          i.material && (i.material = i.material.clone(), i.material.transparent = true, i.material.opacity = (i.material.opacity ?? 1) * 0.6);
        }), h.plano === "xz" ? (p.quaternion.setFromEuler(new Cn(Math.PI / 2, 0, 0)), p.position.set(0, h.d, 0)) : (p.quaternion.setFromEuler(new Cn(0, Math.PI / 2, 0)), p.position.set(h.d, 0, 0)), g.add(p), Gn.push(p);
      }
    }
    P();
  }
  window.__hekatanGrillaAux = (e, n = "xy") => {
    var _a2, _b;
    if (!isFinite(e)) return [];
    const a = window;
    (_a2 = a.__hekatanPushUndo) == null ? void 0 : _a2.call(a);
    const o = a.__hekatanPlanosAux ?? [], s = o.findIndex((l) => l.plano === n && Math.abs(l.d - e) < 1e-6);
    if (s >= 0 ? o.splice(s, 1) : o.push({ plano: n, d: e }), a.__hekatanPlanosAux = o, n === "xy") {
      const l = a.__hekatanLevels ?? [], h = l.findIndex((p) => Math.abs(p.z - e) < 1e-6 && p.tipo !== "piso");
      s >= 0 ? h >= 0 && l.splice(h, 1) : h < 0 && l.push({ label: `N${e >= 0 ? "+" : ""}${e.toFixed(2)}`, z: e, tipo: "aux" }), a.__hekatanLevels = l;
    }
    return (_b = a.__hekatanRefrescarGrillas) == null ? void 0 : _b.call(a), o;
  }, window.__hekatanQuitarGrillaAux = (e) => {
    var _a2;
    const a = (window.__hekatanLevels ?? []).filter((o) => !(Math.abs(o.z - e) < 1e-6 && o.tipo !== "piso"));
    return window.__hekatanLevels = a, (_a2 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a2.call(window), a.map((o) => o.z);
  };
  const pn = document.createElement("input");
  pn.id = "hk-grid-dist", pn.type = "text", pn.spellcheck = false, pn.title = "Distancia del plano. Teclea un n\xFAmero y Enter para colocarlo exacto; Esc cancela.", pn.style.cssText = ["position:fixed", "z-index:99997", "pointer-events:none", "display:none", "padding:3px 8px", "background:rgba(15,23,42,.94)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "width:104px", "text-align:center", "font:bold 13px Consolas,monospace", "transform:translate(14px,-28px)", "outline:none"].join(";") + ";", document.body.appendChild(pn);
  let Qn = false, ra = 0, Qt = "";
  const Hs = (e) => e === "xz" ? new F(0, 1, 0) : e === "yz" ? new F(1, 0, 0) : new F(0, 0, 1), Qa = (e) => e === "xz" ? "workY" : e === "yz" ? "workX" : "workZ", ho = () => {
    var _a2, _b, _c;
    return String(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy");
  }, jn = () => {
    var _a2, _b, _c;
    return Number(((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c[Qa(ho())]) ?? 0);
  }, Ro = (e) => {
    var _a2, _b;
    const n = ho(), a = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2);
    if (a && (a[Qa(n)] = e), !t.gridTarget) return;
    const o = window.__hekatanSCU ?? [0, 0, 0];
    t.gridTarget.val = n === "xy" ? { position: [o[0], o[1], e], rotation: [Math.PI / 2, 0, 0] } : n === "xz" ? { position: [o[0], e, o[2]], rotation: [0, 0, 0] } : { position: [e, o[1], o[2]], rotation: [0, 0, Math.PI / 2] };
  }, Js = () => {
    const e = Hs(ho()), n = V.ray.origin, a = V.ray.direction, o = e.dot(a), s = 1 - o * o;
    if (Math.abs(s) < 1e-4) return null;
    const l = n.clone().negate(), h = e.dot(l), p = a.dot(l);
    return (o * p - h) / s;
  }, mo = (e, n) => {
    e && (pn.style.left = e.clientX + "px", pn.style.top = e.clientY + "px");
    const a = ho() === "xz" ? "Y" : ho() === "yz" ? "X" : "Z";
    pn.value = Qt !== "" ? `${a} = ${Qt}` : `${a} = ${n.toFixed(2)} m`, pn.style.display = "block";
  }, To = (e, n) => {
    var _a2;
    Qn && (Qn = false, window.__hekatanMoviendoGrilla = false, pn.style.display = "none", e ? typeof n == "number" && isFinite(n) && Ro(n) : Ro(ra), Qt = "", (_a2 = window.__hekatanRefrescarGrillas) == null ? void 0 : _a2.call(window), P());
  };
  window.__hekatanMoverGrilla = (e = true) => e ? (ra = jn(), Qt = "", Qn = true, window.__hekatanMoviendoGrilla = true, mo(null, ra), true) : To(false), E.addEventListener("pointermove", (e) => {
    if (!Qn) return;
    B(e);
    const n = Js();
    if (n === null) {
      mo(e, jn());
      return;
    }
    Qt === "" && Ro(n), mo(e, n);
  }, true), E.addEventListener("pointerdown", (e) => {
    Qn && (e.preventDefault(), e.stopPropagation(), To(true, Qt !== "" ? parseFloat(Qt) : jn()));
  }, true), window.addEventListener("keydown", (e) => {
    if (Qn) {
      if (e.key === "Escape") return e.preventDefault(), To(false);
      if (e.key === "Enter") return e.preventDefault(), To(true, Qt !== "" ? parseFloat(Qt) : jn());
      if (e.key === "Backspace") {
        e.preventDefault(), Qt = Qt.slice(0, -1), mo(null, jn());
        return;
      }
      if (/^[0-9.\-]$/.test(e.key)) {
        e.preventDefault(), Qt += e.key;
        const n = parseFloat(Qt);
        isFinite(n) && Ro(n), mo(null, isFinite(n) ? n : jn());
      }
    }
  }, true);
  const zn = new pt();
  zn.name = "hekatan-scu", zn.visible = false, g.add(zn);
  const Os = (e) => {
    var _a2, _b, _c, _d, _e2, _f;
    for (; zn.children.length; ) {
      const p = zn.children.pop();
      (_b = (_a2 = p.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = p.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c), (_e2 = p.dispose) == null ? void 0 : _e2.call(p);
    }
    const n = Math.max(0.8, (((_f = window.__hekatanGridConfig) == null ? void 0 : _f.minorStep) ?? 1) * 2), a = new F(...e), o = [[new F(1, 0, 0), 16735067], [new F(0, 1, 0), 6029194], [new F(0, 0, 1), 6990079]];
    for (const [p, i] of o) zn.add(new In(p, a, n, i, n * 0.28, n * 0.16));
    const s = new Ve().setFromPoints([new F(0, 0, 0), a]), l = new so({ color: 2282478, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.8 }), h = new Et(s, l);
    h.computeLineDistances(), zn.add(h), zn.visible = true;
  };
  window.__hekatanPonerSCU = (e) => {
    var _a2;
    return window.__hekatanSCU = [e[0], e[1], e[2]], Os(e), (_a2 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a2.call(window), P(), e;
  }, window.__hekatanQuitarSCU = () => {
    var _a2;
    return window.__hekatanSCU = [0, 0, 0], zn.visible = false, (_a2 = window.__hekatanRecentrarGrilla) == null ? void 0 : _a2.call(window), P(), [0, 0, 0];
  };
  let ca = false;
  window.__hekatanElegirSCU = (e = true) => (ca = e, window.__hekatanColocandoSCU = e, e), E.addEventListener("pointerdown", (e) => {
    if (!ca) return;
    e.preventDefault(), e.stopPropagation(), ca = false, window.__hekatanColocandoSCU = false;
    const n = window.__hekatanOsnapUltimo;
    if (n) {
      window.__hekatanPonerSCU([n.x, n.y, n.z]);
      return;
    }
    B(e);
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
      const s = o.filter((l) => (l == null ? void 0 : l.tipo) === "piso");
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
    V.params.Points.threshold = 0.4 * e;
  }), ue.derive(() => {
    var _a2;
    const e = t.points.val ?? [], a = (((_a2 = t.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], o = [];
    for (const l of a) {
      const [h, p, i] = e[l];
      o.push(h, p, i);
    }
    const s = new Ve();
    s.setAttribute("position", new It(o, 3)), Ke.geometry.dispose(), Ke.geometry = s;
  });
  let da = false, Nn = 0;
  E.addEventListener("pointerdown", () => {
    da = true;
  }), E.addEventListener("pointerup", () => {
    da = false;
  }), E.addEventListener("pointermove", () => {
    da && Nn++;
  });
  const Yt = document.createElement("div");
  Yt.id = "hk-window-select", Yt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Yt);
  let rn = null, wo = false, Ht = null;
  const ua = (e, n, a, o, s) => {
    s ? (Yt.style.borderColor = "#34d399", Yt.style.borderStyle = "dashed", Yt.style.background = "rgba(52, 211, 153, 0.10)") : (Yt.style.borderColor = "#22d3ee", Yt.style.borderStyle = "solid", Yt.style.background = "rgba(34, 211, 238, 0.10)"), Yt.style.left = Math.min(e, a) + "px", Yt.style.top = Math.min(n, o) + "px", Yt.style.width = Math.abs(a - e) + "px", Yt.style.height = Math.abs(o - n) + "px", Yt.style.display = "block";
  }, ja = (e, n, a, o, s) => {
    var _a2, _b, _c, _d;
    const l = Math.min(e, a), h = Math.max(e, a), p = Math.min(n, o), i = Math.max(n, o), c = a < e, r = E.getBoundingClientRect(), u = k();
    u.updateMatrixWorld();
    const m = (C) => {
      const L = new F(C[0], C[1], C[2]);
      return L.project(u), { x: r.left + (L.x * 0.5 + 0.5) * r.width, y: r.top + (-L.y * 0.5 + 0.5) * r.height };
    }, f = (C) => C.x >= l && C.x <= h && C.y >= p && C.y <= i, b = (C, L) => !(C.x < l && L.x < l || C.x > h && L.x > h || C.y < p && L.y < p || C.y > i && L.y > i);
    s || Je.clear();
    let v = 0;
    const w = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let C = 0; C < w.length; C++) {
      const L = w[C];
      L && f(m(L)) && (Je.add(`pt:${C}`), v++);
    }
    const d = (C, L) => c ? f(C) || f(L) || b(C, L) : f(C) && f(L), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], M = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let C = 0; C < x.length; C++) {
      const L = x[C];
      if (M.includes(C)) {
        let W;
        if (!c) W = L.every((T) => {
          const H = w[T];
          return !!H && f(m(H));
        });
        else {
          W = false;
          for (let T = 0; T < L.length - 1; T++) {
            const H = w[L[T]], le = w[L[T + 1]];
            if (!(!H || !le) && d(m(H), m(le))) {
              W = true;
              break;
            }
          }
        }
        W && (Je.add(`poly:${C}`), v++);
      } else for (let W = 0; W < L.length - 1; W++) {
        const T = w[L[W]], H = w[L[W + 1]];
        !T || !H || d(m(T), m(H)) && (Je.add(`seg:${C}:${W}`), v++);
      }
    }
    const _ = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let C = 0; C < _.length; C++) {
      const L = _[C];
      if (!L || L.length !== 6) continue;
      const j = m([L[0], L[1], L[2]]), W = m([L[3], L[4], L[5]]);
      d(j, W) && (Je.add(`aux:${C}`), v++);
    }
    sn(), ce(v === 0 && !c ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${c ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${v} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Je.size})`), Yt.style.display = "none";
  }, Do = () => {
    Ht && (Ht = null, Yt.style.display = "none", ce("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Do, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Ht && Do();
  });
  const pa = () => {
    var _a2, _b, _c, _d;
    if (Je.size === 0) return false;
    const e = [...Je], n = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], o = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, l = (s == null ? void 0 : s.rawVal) ?? [], h = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
    for (const b of e) {
      const [v, ...w] = b.split(":");
      if (v === "pt") h.add(+w[0]);
      else if (v === "poly") p.add(+w[0]);
      else if (v === "seg") {
        const d = +w[0], x = +w[1];
        i.has(d) || i.set(d, /* @__PURE__ */ new Set()), i.get(d).add(x);
      } else v === "aux" && c.add(+w[0]);
    }
    let r = 0, u = [], m = [];
    const f = /* @__PURE__ */ new Map();
    for (let b = 0; b < a.length; b++) {
      if (p.has(b)) {
        r++;
        continue;
      }
      f.set(b, u.length);
      const v = i.get(b);
      if (v && v.size > 0) {
        let w = [];
        for (let d = 0; d < a[b].length; d++) w.push(a[b][d]), d < a[b].length - 1 && v.has(d) && (w.length >= 2 && u.push(w), w = [], r++);
        (w.length >= 2 || w.length === 1) && u.push(w);
      } else u.push([...a[b]]);
    }
    if (p.size > 0) {
      const b = /* @__PURE__ */ new Set();
      for (const v of u) for (const w of v) b.add(w);
      for (const v of p) for (const w of a[v] ?? []) b.has(w) || h.add(w);
    }
    if (h.size > 0) {
      const b = [], v = /* @__PURE__ */ new Map();
      for (let d = 0; d < n.length; d++) {
        if (h.has(d)) {
          r++;
          continue;
        }
        v.set(d, b.length), b.push([...n[d]]);
      }
      const w = [];
      for (const d of u) {
        let x = [];
        for (const M of d) {
          const $ = v.get(M);
          $ === void 0 ? (x.length >= 2 && w.push(x), x = []) : x.push($);
        }
        x.length >= 2 && w.push(x);
      }
      u = w, t.points.val = b;
    }
    for (const b of o) {
      const v = f.get(b);
      v !== void 0 && v < u.length && m.push(v);
    }
    if (t.polylines && (t.polylines.val = u), t.areas && (t.areas.val = m), c.size > 0 && s) {
      const b = l.filter((v, w) => !c.has(w));
      "val" in s ? s.val = b : window.__hekatanDrawingAuxLines = b, r += c.size;
    }
    Je.clear(), sn();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ce(`\u{1F5D1} ${r} item(s) borrado(s)`), true;
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
    let n = false, a = 0, o = 0, s = 0, l = 0;
    e.addEventListener("mousedown", (h) => {
      n = true, a = h.clientX, o = h.clientY;
      const p = Gt.getBoundingClientRect();
      s = p.left, l = p.top, Gt.style.transform = "none", Gt.style.left = `${s}px`, Gt.style.top = `${l}px`, h.preventDefault();
    }), window.addEventListener("mousemove", (h) => {
      if (!n) return;
      const p = h.clientX - a, i = h.clientY - o, c = Math.max(0, Math.min(window.innerWidth - 80, s + p)), r = Math.max(0, Math.min(window.innerHeight - 40, l + i));
      Gt.style.left = `${c}px`, Gt.style.top = `${r}px`;
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
    const e = [...Je], n = e.filter((u) => u.startsWith("pt:"));
    if (n.length === 1) {
      const u = +n[0].slice(3), f = (_a2 = window.__hekatanManualSupports) == null ? void 0 : _a2.get(u);
      f ? [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = f.map(Boolean) : ne.Ux = ne.Uy = ne.Uz = ne.Rx = ne.Ry = ne.Rz = false;
      const v = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(u);
      v ? [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz] = v : ne.Fx = ne.Fy = ne.Fz = ne.Mx = ne.My = ne.Mz = 0;
    }
    const a = e.filter((u) => u.startsWith("seg:")), o = e.filter((u) => u.startsWith("poly:")), s = e.filter((u) => u.startsWith("aux:")), l = n.length > 0, h = a.length > 0, p = o.length > 0, i = !l && !h && !p, c = [];
    n.length && c.push(`\u{1F535} ${n.length} nodo(s)`), a.length && c.push(`\u{1F4CF} ${a.length} segmento(s)`), o.length && c.push(`\u25AD ${o.length} \xE1rea(s)`), s.length && c.push(`\u250A ${s.length} aux`);
    const r = `\u{1F3AF} ${Je.size} item(s) \u2014 ${c.join(", ")}`;
    yt = new Ls({ container: Gt, title: r });
    {
      const u = yt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      u.addBinding(_t, "dx", { label: "\u0394x (m)", step: 0.1 }), u.addBinding(_t, "dy", { label: "\u0394y (m)", step: 0.1 }), u.addBinding(_t, "dz", { label: "\u0394z (m)", step: 0.1 }), u.addBinding(_t, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), u.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, _t.dx, _t.dy, _t.dz, _t.copias);
        ce(v ? `\u29C9 Replicado \xD7${v} (\u0394 ${_t.dx},${_t.dy},${_t.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), u.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanExtrudeSelection) == null ? void 0 : _a3.call(window, _t.dx, _t.dy, _t.dz, _t.copias);
        ce(v && (v.lineas || v.areas) ? `\u21D7 Extruido: ${v.lineas} barra(s), ${v.areas} pa\xF1o(s) (\u0394 ${_t.dx},${_t.dy},${_t.dz} m \xD7 ${_t.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const m = { vuelo: 1.5, losa: true, borde: true, ambos: true }, f = u.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      f.addBinding(m, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), f.addBinding(m, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), f.addBinding(m, "borde", { label: "con viga de borde" }), f.addBinding(m, "ambos", { label: "a los dos lados" }), f.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanVoladoSelection) == null ? void 0 : _a3.call(window, m.vuelo, { losa: m.losa, vigaBorde: m.borde, lados: m.ambos ? "ambos" : "afuera" });
        ce(v ? `\u2310 Volado de ${m.vuelo} m en ${v} pa\xF1o(s)` + (m.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), u.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a3;
        const v = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, _t.dx, _t.dy, _t.dz, 1);
        ce(v ? `\u2192 Copia desplazada \u0394 ${_t.dx},${_t.dy},${_t.dz} m` : "\u26A0 Nada seleccionado");
      });
      const b = u.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      b.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a3;
        return (_a3 = window.__hekatanToggleSnap) == null ? void 0 : _a3.call(window);
      }), b.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ce(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (l) {
      const u = yt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${n.length} nodo(s)` });
      u.addBinding(ne, "Ux"), u.addBinding(ne, "Uy"), u.addBinding(ne, "Uz"), u.addBinding(ne, "Rx"), u.addBinding(ne, "Ry"), u.addBinding(ne, "Rz");
      const m = (d, x) => {
        [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz] = d;
        try {
          yt.refresh();
        } catch {
        }
        Vt("nodes", n, "supports", d), ce(`\u2713 ${x}: ${n.length} nudo(s) apoyado(s) (${d.map((M, $) => M ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][$] : "").filter(Boolean).join(" ")}).`);
      };
      u.addButton({ title: `\u25B2 Empotrar los ${n.length} nudo(s) (6 GDL)` }).on("click", () => m([true, true, true, true, true, true], "Empotrado")), u.addButton({ title: `\u25B3 Articular los ${n.length} nudo(s) (Ux Uy Uz)` }).on("click", () => m([true, true, true, false, false, false], "Articulado"));
      const f = yt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      f.addBinding(ne, "Kx", { label: "Kx", min: 0, step: 100 }), f.addBinding(ne, "Ky", { label: "Ky", min: 0, step: 100 }), f.addBinding(ne, "Kz", { label: "Kz", min: 0, step: 100 }), f.addBinding(ne, "Krx", { label: "Krx", min: 0, step: 1e3 }), f.addBinding(ne, "Kry", { label: "Kry", min: 0, step: 1e3 }), f.addBinding(ne, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const b = yt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      b.addBinding(ne, "Fx", { step: 0.1 }), b.addBinding(ne, "Fy", { step: 0.1 }), b.addBinding(ne, "Fz", { step: 0.1 }), b.addBinding(ne, "Mx", { step: 0.1 }), b.addBinding(ne, "My", { step: 0.1 }), b.addBinding(ne, "Mz", { step: 0.1 }), yt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ne, "mass", { label: "m", min: 0, step: 1 }), yt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ne, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), yt.addButton({ title: `\u2713 Aplicar a ${n.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let d = 0;
        const x = [ne.Ux, ne.Uy, ne.Uz, ne.Rx, ne.Ry, ne.Rz];
        x.some((_) => _) && (Vt("nodes", n, "supports", x), d++);
        const M = [ne.Fx, ne.Fy, ne.Fz, ne.Mx, ne.My, ne.Mz];
        M.some((_) => _ !== 0) && (Vt("nodes", n, "loads", M), d++);
        const $ = [ne.Kx, ne.Ky, ne.Kz, ne.Krx, ne.Kry, ne.Krz];
        if ($.some((_) => _ !== 0) && (Vt("nodes", n, "springs", $), d++), ne.mass !== 0 && (Vt("nodes", n, "mass", ne.mass), d++), ne.diaphragm !== "Ninguno" && (Vt("nodes", n, "diaphragm", ne.diaphragm), d++), d === 0) {
          ce("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let _ = document.getElementById("hk-prop-toast");
          _ || (_ = document.createElement("div"), _.id = "hk-prop-toast", _.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(_)), _.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", _.style.background = "rgba(217,119,6,0.97)", _.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            _ && (_.style.opacity = "0");
          }, 3200);
        } else ce(`\u2713 Propiedades aplicadas a ${n.length} nodo(s)`);
      });
    }
    if (h) {
      const u = yt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      u.addBinding(ne, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), u.addBinding(ne, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const m = yt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      m.addBinding(ne, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), m.addBinding(ne, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), m.addBinding(ne, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), m.addBinding(ne, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), yt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ne, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), yt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ne, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
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
        const C = [ne.relMxI, ne.relMyI, ne.relMzI], L = [ne.relMxJ, ne.relMyJ, ne.relMzJ];
        (C.some((T) => T) || L.some((T) => T)) && Vt("segs", a, "releases", { i: C, j: L }), ne.hinges !== "None" && Vt("segs", a, "hinges", ne.hinges);
        const j = [ne.LKx, ne.LKy, ne.LKz];
        j.some((T) => T !== 0) && Vt("segs", a, "lineSprings", j);
        const W = [ne.qx, ne.qy, ne.qz];
        W.some((T) => T !== 0) && Vt("segs", a, "distLoad", W), ne.massPerM !== 0 && Vt("segs", a, "massPerM", ne.massPerM), ce(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (p) {
      const u = yt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${o.length}` });
      u.addBinding(ne, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), u.addBinding(ne, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), u.addBinding(ne, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), yt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ne, "surfLoad", { label: "q", step: 0.1 }), yt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Vt("areas", o, "shellType", ne.shellType), Vt("areas", o, "thickness", ne.thickness), Vt("areas", o, "material", ne.material_shell), ne.surfLoad !== 0 && Vt("areas", o, "surfLoad", ne.surfLoad), ce(`\u2713 Propiedades aplicadas a ${o.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (i) {
      const u = yt.addFolder({ title: "\u2139 Selecci\xF3n" }), m = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      u.addBinding(m, "msg", { readonly: true, label: "" });
    }
    yt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Je.clear(), sn();
    }), Gt.style.display = "block", Qs();
  };
  window.__hekatanRefreshPropsPane = js;
  let eo = null, Bo = false;
  E.addEventListener("pointerdown", (e) => {
    e.button === 2 && (eo = { x: e.clientX, y: e.clientY }, Bo = false);
  }), E.addEventListener("pointermove", (e) => {
    if (eo && e.buttons & 2 && !Bo) {
      const n = e.clientX - eo.x, a = e.clientY - eo.y;
      Math.hypot(n, a) > 8 && (Bo = true);
    }
  }), E.addEventListener("pointerup", (e) => {
    var _a2, _b, _c;
    if (e.button === 2) {
      const n = eo !== null && !Bo;
      eo = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (n) {
        if (Ht ? Do() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Je.size > 0 && (Je.clear(), sn()), t.polylines) {
          const l = t.polylines.rawVal;
          (l[l.length - 1] ?? []).length > 0 && (t.polylines.val = [...l, []]);
        }
        const o = window.__hekatanCadState, s = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"), ce(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ce("\u238B Cancelado (click derecho)");
      }
    }
  }), E.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), E.addEventListener("pointerdown", (e) => {
    var _a2, _b, _c;
    const n = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    n !== "select" && n !== "none" && n || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (rn = null, wo = false));
  }), E.addEventListener("pointermove", (e) => {
    if (Ht && e.buttons === 0) {
      const l = e.clientX < Ht.x;
      ua(Ht.x, Ht.y, e.clientX, e.clientY, l);
      return;
    }
    if (!rn) return;
    const n = e.clientX - rn.x, a = e.clientY - rn.y, o = Math.hypot(n, a);
    if (!wo && o < 8) return;
    wo = true;
    const s = e.clientX < rn.x;
    ua(rn.x, rn.y, e.clientX, e.clientY, s);
  }), E.addEventListener("pointerup", (e) => {
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
      const h = jt.children.pop();
      (_b = (_a2 = h.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = h.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = ts[e] ?? 16777215, l = new Ve().setFromPoints([new F(-1, -1, 0), new F(1, -1, 0), new F(1, -1, 0), new F(1, 1, 0), new F(1, 1, 0), new F(-1, 1, 0), new F(-1, 1, 0), new F(-1, -1, 0)]);
    jt.add(new nn(l, new wt({ color: s, linewidth: 2 }))), jt.position.set(n, a, o), jt.visible = true, ha();
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
    const s = E.getBoundingClientRect();
    return Yn.set(e, n, a).project(o), !isFinite(Yn.x) || !isFinite(Yn.y) || Yn.z < -1 || Yn.z > 1 ? null : { x: s.left + (Yn.x * 0.5 + 0.5) * s.width, y: s.top + (-Yn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = Xn;
  const ni = (e, n, a, o, s) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const l = window.__hekatanOsnap, h = t.points.rawVal, p = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let i = null;
    const c = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, r = s, u = (d, x, M, $) => {
      let _;
      if (r) {
        const L = Xn(x, M, $);
        if (!L || (_ = Math.hypot(L.x - r.x, L.y - r.y), _ > En)) return;
      } else if (_ = Math.hypot(x - e, M - n, $ - a), _ > o) return;
      const C = c[d] ?? 9;
      (!i || C < i.r || C === i.r && _ < i.d) && (i = { type: d, x, y: M, z: $, d: _, r: C });
    };
    if (l.ori !== false && u("ori", 0, 0, 0), l.grid !== false && window.__hekatanSnapEnabled === true) {
      const d = window.__hekatanGridConfig, x = (d == null ? void 0 : d.minorStep) && d.minorStep > 0 ? d.minorStep : 1, M = ((d == null ? void 0 : d.gridSize) ?? 30) / 2, $ = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", _ = (L) => Math.round(L / x) * x, C = (L, j) => Math.abs(L) <= M + 1e-9 && Math.abs(j) <= M + 1e-9;
      if ($ === "xz") {
        const L = _(e), j = _(a);
        C(L, j) && u("grid", L, n, j);
      } else if ($ === "yz") {
        const L = _(n), j = _(a);
        C(L, j) && u("grid", e, L, j);
      } else {
        const L = _(e), j = _(n);
        C(L, j) && u("grid", L, j, a);
        const W = window.__hekatanPlanosAux ?? [];
        for (const H of W.slice(0, 24)) {
          if (H.plano === "xy" || !isFinite(H.d)) continue;
          const le = H.plano === "xz" ? new F(0, 1, 0) : new F(1, 0, 0), he = new vo(le, -H.d), $e = new F();
          if (V.ray.intersectPlane(he, $e)) if (H.plano === "xz") {
            const ye = _($e.x), Ee = _($e.z);
            C(ye, Ee) && u("grid", ye, H.d, Ee);
          } else {
            const ye = _($e.y), Ee = _($e.z);
            C(ye, Ee) && u("grid", H.d, ye, Ee);
          }
        }
        const T = window.__hekatanLevels ?? [];
        if (T.length) {
          const H = V.ray, le = new vo(), he = new F();
          for (const $e of T.slice(0, 24)) {
            if (!isFinite($e == null ? void 0 : $e.z) || Math.abs($e.z - a) < 1e-6 || (le.set(new F(0, 0, 1), -$e.z), !H.intersectPlane(le, he))) continue;
            const ye = _(he.x), Ee = _(he.y);
            C(ye, Ee) && u("grid", ye, Ee, $e.z);
          }
        }
      }
    }
    (l.node || l.end) && h.forEach((d) => {
      l.node && u("node", d[0], d[1], d[2]);
    });
    for (const d of p) if (!(d.length < 2)) for (let x = 0; x < d.length - 1; x++) {
      const M = h[d[x]], $ = h[d[x + 1]];
      if (!(!M || !$) && (l.end && (u("end", M[0], M[1], M[2]), u("end", $[0], $[1], $[2])), l.mid && u("mid", (M[0] + $[0]) / 2, (M[1] + $[1]) / 2, (M[2] + $[2]) / 2), l.nea || l.per)) {
        const _ = $[0] - M[0], C = $[1] - M[1], L = $[2] - M[2], j = _ * _ + C * C + L * L;
        if (j < 1e-12) continue;
        const W = Math.max(0, Math.min(1, ((e - M[0]) * _ + (n - M[1]) * C + (a - M[2]) * L) / j)), T = M[0] + W * _, H = M[1] + W * C, le = M[2] + W * L;
        l.nea && u("nea", T, H, le), l.per && u("per", T, H, le);
      }
    }
    if (l.cen) {
      const d = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const x of d) {
        const M = p[x];
        if (!M || M.length < 3) continue;
        const $ = M[0] === M[M.length - 1] ? M.slice(0, -1) : M;
        let _ = 0, C = 0, L = 0, j = 0;
        for (const W of $) {
          const T = h[W];
          T && (_ += T[0], C += T[1], L += T[2], j++);
        }
        j >= 3 && u("cen", _ / j, C / j, L / j);
      }
    }
    if (l.cen) {
      const d = Za(), x = [...Eo];
      for (const M of d) x.some(($) => Math.hypot($.c[0] - M.c[0], $.c[1] - M.c[1], $.c[2] - M.c[2]) < 1e-6 && Math.abs($.r - M.r) < 1e-6) || x.push(M);
      for (const M of x) {
        if (!h.some((C) => Math.abs(Math.hypot(C[0] - M.c[0], C[1] - M.c[1], C[2] - M.c[2]) - M.r) < 1e-6)) continue;
        const _ = Math.hypot(e - M.c[0], n - M.c[1], a - M.c[2]);
        if (_ < o || Math.abs(_ - M.r) < o) {
          const C = Math.min(_, o * 0.5), L = 3;
          (!i || L < i.r || L === i.r && C < i.d) && (i = { type: "cen", x: M.c[0], y: M.c[1], z: M.c[2], d: C, r: L });
        }
      }
    }
    if (l.int) {
      const d = [];
      for (const x of p) for (let M = 0; M < x.length - 1; M++) {
        const $ = h[x[M]], _ = h[x[M + 1]];
        if (!$ || !_) continue;
        const C = _[0] - $[0], L = _[1] - $[1], j = _[2] - $[2], W = C * C + L * L + j * j;
        if (W < 1e-12) continue;
        const T = Math.max(0, Math.min(1, ((e - $[0]) * C + (n - $[1]) * L + (a - $[2]) * j) / W));
        Math.hypot($[0] + T * C - e, $[1] + T * L - n, $[2] + T * j - a) < 3 * o && d.push([$, _]);
      }
      for (let x = 0; x < d.length; x++) for (let M = x + 1; M < d.length; M++) {
        const [$, _] = d[x], [C, L] = d[M], j = [_[0] - $[0], _[1] - $[1], _[2] - $[2]], W = [L[0] - C[0], L[1] - C[1], L[2] - C[2]], T = [$[0] - C[0], $[1] - C[1], $[2] - C[2]], H = j[0] * j[0] + j[1] * j[1] + j[2] * j[2], le = j[0] * W[0] + j[1] * W[1] + j[2] * W[2], he = W[0] * W[0] + W[1] * W[1] + W[2] * W[2], $e = j[0] * T[0] + j[1] * T[1] + j[2] * T[2], ye = W[0] * T[0] + W[1] * T[1] + W[2] * T[2], Ee = H * he - le * le;
        if (Ee < 1e-12) continue;
        const ke = (le * ye - he * $e) / Ee, Ze = (H * ye - le * $e) / Ee;
        if (ke < -1e-6 || ke > 1 + 1e-6 || Ze < -1e-6 || Ze > 1 + 1e-6) continue;
        const Re = [$[0] + ke * j[0], $[1] + ke * j[1], $[2] + ke * j[2]], Se = [C[0] + Ze * W[0], C[1] + Ze * W[1], C[2] + Ze * W[2]];
        if (Math.hypot(Re[0] - Se[0], Re[1] - Se[1], Re[2] - Se[2]) > 1e-4) continue;
        [$, _, C, L].some((He) => Math.hypot(He[0] - Re[0], He[1] - Re[1], He[2] - Re[2]) < 1e-6) || u("int", Re[0], Re[1], Re[2]);
      }
    }
    const m = window.__hekatanAxisGrids ?? [], f = window.__hekatanLevels ?? [], b = m.filter((d) => d && d.start && d.end).map((d) => [d.start, d.end]);
    for (const [d, x] of b) {
      l.end && (u("end", d[0], d[1], d[2]), u("end", x[0], x[1], x[2]));
      const M = x[0] - d[0], $ = x[1] - d[1], _ = x[2] - d[2], C = M * M + $ * $ + _ * _;
      if (C < 1e-12) continue;
      const L = Math.max(0, Math.min(1, ((e - d[0]) * M + (n - d[1]) * $ + (a - d[2]) * _) / C));
      if (l.nea && u("nea", d[0] + L * M, d[1] + L * $, d[2] + L * _), l.int && Math.abs(_) > 1e-9) for (const j of f) {
        const W = (j.z - d[2]) / _;
        W < -1e-6 || W > 1 + 1e-6 || u("int", d[0] + W * M, d[1] + W * $, j.z);
      }
    }
    if (l.int || l.node) for (let d = 0; d < b.length; d++) for (let x = d + 1; x < b.length; x++) {
      const [M, $] = b[d], [_, C] = b[x], L = $[0] - M[0], j = $[1] - M[1], W = C[0] - _[0], T = C[1] - _[1], H = L * T - j * W;
      if (Math.abs(H) < 1e-12) continue;
      const le = M[0] - _[0], he = M[1] - _[1], $e = (W * he - T * le) / H, ye = (L * he - j * le) / H;
      if ($e < -1e-6 || $e > 1 + 1e-6 || ye < -1e-6 || ye > 1 + 1e-6) continue;
      const Ee = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      u("int", M[0] + $e * L, M[1] + $e * j, typeof Ee == "number" ? Ee : a);
    }
    const v = window.__hekatanDrawingAuxLines, w = (v == null ? void 0 : v.rawVal) ?? (v == null ? void 0 : v.val) ?? v ?? [];
    for (const d of w) {
      if (d.length !== 6) continue;
      const x = [d[0], d[1], d[2]], M = [d[3], d[4], d[5]];
      if (l.end && (u("end", x[0], x[1], x[2]), u("end", M[0], M[1], M[2])), l.mid && u("mid", (x[0] + M[0]) / 2, (x[1] + M[1]) / 2, (x[2] + M[2]) / 2), l.nea || l.per) {
        const $ = M[0] - x[0], _ = M[1] - x[1], C = M[2] - x[2], L = $ * $ + _ * _ + C * C;
        if (L < 1e-12) continue;
        const j = Math.max(0, Math.min(1, ((e - x[0]) * $ + (n - x[1]) * _ + (a - x[2]) * C) / L)), W = x[0] + j * $, T = x[1] + j * _, H = x[2] + j * C;
        l.nea && u("nea", W, T, H), l.per && u("per", W, T, H);
      }
    }
    return i ? { type: i.type, x: i.x, y: i.y, z: i.z } : null;
  }, to = new pt();
  to.frustumCulled = false, g.add(to);
  const ns = new wt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let os = 0;
  const as = () => {
    var _a2, _b;
    for (const e of to.children.slice()) to.remove(e), (_b = (_a2 = e.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (e) => {
    var _a2, _b;
    as();
    const n = ((_a2 = t.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of e || []) {
      const l = String(s).split(":");
      let h = [];
      if (l[0] === "pt") {
        const c = n[+l[1]];
        c && (h = [c, [c[0] + 1e-3, c[1], c[2]]]);
      } else if (l[0] === "seg") {
        const c = a[+l[1]] || [], r = n[c[+l[2]]], u = n[c[+l[2] + 1]];
        r && u && (h = [r, u]);
      } else l[0] === "poly" && (h = (a[+l[1]] || []).map((r) => n[r]).filter(Boolean));
      if (h.length < 2) continue;
      const p = new Ve().setFromPoints(h.map((c) => new F(c[0], c[1], c[2]))), i = new Et(p, ns);
      i.renderOrder = 1200, to.add(i);
    }
    if (!to.children.length) return;
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
    const e = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", n = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], a = n.length ? n[n.length - 1] : [], o = Oe.length, s = (l, h = []) => ({ txt: l, ops: h });
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
  const no = [], Uo = [], ii = () => {
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
    no.push(wa()), no.length > 100 && no.shift(), Uo.length = 0;
  }, Zo = () => {
    const e = no.pop();
    if (!e) {
      ce("\u21B6 Nada para deshacer");
      return;
    }
    Uo.push(wa()), ss(e), ce(`\u21B6 Deshacer \u2014 quedan ${no.length}`);
  }, is = () => {
    const e = Uo.pop();
    if (!e) {
      ce("\u21B7 Nada para rehacer");
      return;
    }
    no.push(wa()), ss(e), ce(`\u21B7 Rehacer \u2014 quedan ${Uo.length}`);
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
      const l = s[s.length - 1], h = s.slice(0, -1), p = o.some((r, u) => u !== o.length - 1 && r.includes(l)) || h.includes(l);
      let i = t.points.rawVal, c = [...o.slice(0, -1), h];
      if (!p && l === i.length - 1 && (i = i.slice(0, -1), t.points.val = i), t.polylines.val = c, h.length) {
        const r = i[h[h.length - 1]];
        r && (Ge = [r[0], r[1], r[2]]);
      } else Ge = null, We.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return P(), ce(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${h.length}.`), Jt(), true;
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
        const o = a.split(":"), s = e[+o[1]] || [], l = s[+o[2]], h = s[+o[2] + 1];
        l != null && n.add(l), h != null && n.add(h);
      }
    }), n;
  }, cs = (e, n, a) => {
    var _a2;
    const o = rs();
    if (!o.size) return 0;
    Pt();
    const s = t.points.rawVal.map((l, h) => o.has(h) ? [l[0] + e, l[1] + n, l[2] + a] : l);
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
      Ge = n, ce(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)}). Precise el segundo punto.`), Jt();
      return;
    }
    const [a, o] = Oe, s = [o[0] - a[0], o[1] - a[1], o[2] - a[2]];
    Oe = [], We.visible = false;
    let l = 0;
    e === "move" ? l = cs(s[0], s[1], s[2]) : (l = rs().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ce(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${l} nudo${l === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), e === "move" && (Je.clear(), sn()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Jt();
  };
  window.__hekatanPasoMoverCopiar = ds;
  const di = () => {
    var _a2, _b, _c;
    const e = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, $n = (e, n) => Math.hypot(e[0] - n[0], e[1] - n[1], e[2] - n[2]), xa = (e, n, a, o, s, l) => {
    const h = [n[0] - e[0], n[1] - e[1], n[2] - e[2]], p = [o[0] - a[0], o[1] - a[1], o[2] - a[2]], i = [e[0] - a[0], e[1] - a[1], e[2] - a[2]], c = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], r = h[0] * p[0] + h[1] * p[1] + h[2] * p[2], u = p[0] * p[0] + p[1] * p[1] + p[2] * p[2], m = h[0] * i[0] + h[1] * i[1] + h[2] * i[2], f = p[0] * i[0] + p[1] * i[1] + p[2] * i[2], b = c * u - r * r;
    if (b < 1e-12) return null;
    const v = (r * f - u * m) / b, w = (c * f - r * m) / b;
    if (!s && (v < -1e-6 || v > 1 + 1e-6) || !l && (w < -1e-6 || w > 1 + 1e-6)) return null;
    const d = [e[0] + v * h[0], e[1] + v * h[1], e[2] + v * h[2]], x = [a[0] + w * p[0], a[1] + w * p[1], a[2] + w * p[2]];
    return $n(d, x) > 1e-4 ? null : d;
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
      const d = w.length > 2 && w[0] === w[w.length - 1], x = di(), M = [];
      for (let ke = 0; ke < w.length - 1; ke++) {
        const Ze = o[w[ke]], Re = o[w[ke + 1]], Se = [Re[0] - Ze[0], Re[1] - Ze[1], Re[2] - Ze[2]], qe = Math.hypot(Se[0], Se[1], Se[2]) || 1, He = Se[0] / qe, ft = Se[1] / qe, it = Se[2] / qe, mt = [x[1] * it - x[2] * ft, x[2] * He - x[0] * it, x[0] * ft - x[1] * He], Nt = Math.hypot(mt[0], mt[1], mt[2]) || 1;
        M.push({ a: Ze, b: Re, n: [mt[0] / Nt, mt[1] / Nt, mt[2] / Nt] });
      }
      let $ = 0, _ = 1 / 0;
      M.forEach((ke, Ze) => {
        const Re = co(n[0], n[1], n[2], ke.a[0], ke.a[1], ke.a[2], ke.b[0], ke.b[1], ke.b[2]);
        Re < _ && (_ = Re, $ = Ze);
      });
      const C = M[$], L = Math.sign((n[0] - C.a[0]) * C.n[0] + (n[1] - C.a[1]) * C.n[1] + (n[2] - C.a[2]) * C.n[2]) || 1, j = Un > 0 ? Un : _;
      if (j < 1e-6) {
        ce("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const W = M.map((ke) => ({ a: [ke.a[0] + L * j * ke.n[0], ke.a[1] + L * j * ke.n[1], ke.a[2] + L * j * ke.n[2]], b: [ke.b[0] + L * j * ke.n[0], ke.b[1] + L * j * ke.n[1], ke.b[2] + L * j * ke.n[2]] })), T = W.length, H = (ke) => {
        const Ze = W[(ke - 1 + T) % T], Re = W[ke % T];
        return xa(Ze.a, Ze.b, Re.a, Re.b, true, true) ?? Re.a;
      }, le = [], he = d ? T : T + 1;
      for (let ke = 0; ke < he; ke++) !d && ke === 0 ? le.push(W[0].a) : !d && ke === T ? le.push(W[T - 1].b) : le.push(H(ke));
      Pt();
      const $e = o.length;
      t.points.val = [...o, ...le];
      const ye = le.map((ke, Ze) => $e + Ze);
      d && ye.push($e);
      let Ee = a.slice();
      Ee.length && Ee[Ee.length - 1].length === 0 && (Ee = Ee.slice(0, -1)), t.polylines.val = [...Ee, ye, []], Bt = null, ce(`\u2713 Desfase a ${j.toFixed(2)} m \u2014 ${T} tramo${T === 1 ? "" : "s"} nuevo${T === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      P(), Jt();
      return;
    }
    let l = un, h = Math.max(0, An);
    if (l < 0 || l === Bt.poly && h === Bt.seg) {
      let w = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (l = -1, a.forEach((d, x) => {
        for (let M = 0; M < d.length - 1; M++) {
          if (x === Bt.poly && M === Bt.seg) continue;
          const $ = o[d[M]], _ = o[d[M + 1]];
          if (!$ || !_) continue;
          const C = co(n[0], n[1], n[2], $[0], $[1], $[2], _[0], _[1], _[2]);
          C < w && (w = C, l = x, h = M);
        }
      }), l < 0) {
        ce(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const p = a[Bt.poly], i = o[p[Bt.seg]], c = o[p[Bt.seg + 1]], r = a[l], u = r[h], m = r[h + 1];
    if (!i || !c || u == null || m == null) {
      ce(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const f = o[u], b = o[m];
    if (e === "trim") {
      const v = xa(f, b, i, c, false, false);
      if (!v) {
        ce("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Pt();
      const w = o.length;
      t.points.val = [...o, v];
      const d = [...r.slice(0, h + 1), w, ...r.slice(h + 1)];
      t.polylines.val = a.map((M, $) => $ === l ? d : M);
      const x = $n(n, f) < $n(n, b);
      Ya(l, x ? h : h + 1), ce(`\u2713 Recortado en (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const v = xa(f, b, i, c, true, false);
      if (!v) {
        ce("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const d = $n(n, f) < $n(n, b) ? h : h + 1;
      if (d !== 0 && d !== r.length - 1) {
        ce("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = r[d];
      if ($n(v, f) + $n(v, b) < $n(f, b) + 1e-6) {
        ce("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Pt(), ui(x) > 1) {
        const $ = o.length;
        t.points.val = [...o, v];
        const _ = r.slice();
        _[d] = $, t.polylines.val = a.map((C, L) => L === l ? _ : C);
      } else t.points.val = o.map(($, _) => _ === x ? v : $);
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
      !o || o.length < 2 || (Je.add(`poly:${s}`), o.forEach((l) => a.add(l)));
    }), n.forEach((o, s) => {
      a.has(s) || Je.add(`pt:${s}`);
    }), sn(), ce(`SELECCI\xD3N ${Je.size} objetos (todo el modelo) \xB7 Esc suelta`), Je.size;
  }, window.__hekatanReplicateSelection = (e, n, a, o, s = 0) => {
    var _a2, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1)), s = Math.max(0, Math.round(s || 0));
    const l = [...Je], h = t.points.rawVal, p = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), c = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), u = [];
    if (l.forEach((w) => {
      if (w.startsWith("pt:")) {
        const d = +w.slice(3);
        h[d] && c.add(d);
      } else if (w.startsWith("poly:")) {
        const d = +w.slice(5);
        if (!p[d] || p[d].length < 2) return;
        r.add(d), p[d].forEach((x) => c.add(x));
      } else if (w.startsWith("seg:")) {
        const d = w.split(":"), x = +d[1], M = +d[2], $ = p[x] || [], _ = $[M], C = $[M + 1];
        _ != null && C != null && (u.push([_, C]), c.add(_), c.add(C));
      }
    }), !c.size) return 0;
    Pt();
    const m = [...h];
    let f = p.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const b = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], v = [...c];
    for (let w = 1; w <= o; w++) {
      const d = s + w, x = e * d, M = n * d, $ = a * d, _ = /* @__PURE__ */ new Map();
      v.forEach((C) => {
        _.set(C, m.length), m.push([h[C][0] + x, h[C][1] + M, h[C][2] + $]);
      }), r.forEach((C) => {
        const L = p[C].map((W) => _.has(W) ? _.get(W) : W), j = f.length;
        f.push(L), i.has(C) && b.push(j);
      }), u.forEach(([C, L]) => {
        f.push([_.get(C), _.get(L)]);
      });
    }
    f.push([]), t.points.val = m, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = b);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return P(), o;
  }, window.__hekatanExtrudeSelection = (e, n, a, o) => {
    var _a2, _b, _c, _d;
    o = Math.max(1, Math.round(o || 1));
    const s = [...Je], l = t.points.rawVal, h = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], p = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), i = /* @__PURE__ */ new Set(), c = [], r = /* @__PURE__ */ new Set();
    for (const x of h) for (const M of x) r.add(M);
    if (s.forEach((x) => {
      if (x.startsWith("poly:")) {
        const M = +x.slice(5);
        if (p.has(M)) return;
        const $ = h[M] || [];
        for (let _ = 0; _ + 1 < $.length; _++) c.push([$[_], $[_ + 1]]), r.add($[_]), r.add($[_ + 1]);
      } else if (x.startsWith("seg:")) {
        const M = x.split(":"), $ = +M[1], _ = +M[2], C = h[$] || [], L = C[_], j = C[_ + 1];
        L != null && j != null && (c.push([L, j]), r.add(L), r.add(j));
      }
    }), s.forEach((x) => {
      if (x.startsWith("pt:")) {
        const M = +x.slice(3);
        l[M] && !r.has(M) && i.add(M);
      }
    }), !i.size && !c.length) return { lineas: 0, areas: 0 };
    Pt();
    const u = [...l];
    let m = h.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const f = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], b = /* @__PURE__ */ new Map(), v = (x, M) => {
      if (M === 0) return x;
      const $ = x + ":" + M;
      let _ = b.get($);
      if (_ == null) {
        const C = [l[x][0] + e * M, l[x][1] + n * M, l[x][2] + a * M];
        _ = u.findIndex((L) => Math.abs(L[0] - C[0]) < 1e-3 && Math.abs(L[1] - C[1]) < 1e-3 && Math.abs(L[2] - C[2]) < 1e-3), _ < 0 && (_ = u.length, u.push(C)), b.set($, _);
      }
      return _;
    };
    let w = 0, d = 0;
    i.forEach((x) => {
      const M = [x];
      for (let $ = 1; $ <= o; $++) M.push(v(x, $));
      m.push(M), w += o;
    }), c.forEach(([x, M]) => {
      for (let $ = 1; $ <= o; $++) {
        const _ = [v(x, $ - 1), v(M, $ - 1), v(M, $), v(x, $)];
        f.push(m.length), m.push([..._, _[0]]), d++;
      }
    }), m.push([]), t.points.val = u, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = f);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return P(), { lineas: w, areas: d };
  }, window.__hekatanVoladoSelection = (e, n = {}) => {
    var _a2, _b, _c;
    const a = Number(e);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const o = n.losa !== false, s = n.vigaBorde !== false, l = n.lados === "afuera" ? "afuera" : "ambos", h = t.points.rawVal, p = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = [];
    if ([...Je].forEach((v) => {
      if (v.startsWith("seg:")) {
        const w = v.split(":"), d = +w[1], x = +w[2], M = p[d] || [], $ = M[x], _ = M[x + 1];
        $ != null && _ != null && i.push([$, _]);
      } else if (v.startsWith("poly:")) {
        const w = p[+v.slice(5)] || [];
        for (let d = 0; d + 1 < w.length; d++) i.push([w[d], w[d + 1]]);
      }
    }), !i.length) return 0;
    let c = 0, r = 0;
    for (const v of h) c += v[0], r += v[1];
    c /= Math.max(1, h.length), r /= Math.max(1, h.length), Pt();
    const u = [...h];
    let m = p.slice();
    m.length && m[m.length - 1].length === 0 && (m = m.slice(0, -1));
    const f = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let b = 0;
    for (const [v, w] of i) {
      const d = h[v], x = h[w];
      if (!d || !x) continue;
      const M = x[0] - d[0], $ = x[1] - d[1], _ = Math.hypot(M, $);
      if (_ < 1e-6) continue;
      let C = -$ / _, L = M / _;
      const j = (d[0] + x[0]) / 2, W = (d[1] + x[1]) / 2;
      (j - c) * C + (W - r) * L < 0 && (C = -C, L = -L);
      const T = l === "ambos" ? [1, -1] : [1];
      for (const H of T) {
        const le = C * a * H, he = L * a * H, $e = u.length;
        u.push([d[0] + le, d[1] + he, d[2]]);
        const ye = u.length;
        u.push([x[0] + le, x[1] + he, x[2]]), m.push([v, $e]), m.push([w, ye]), s && m.push([$e, ye]), o && (f.push(m.length), m.push([v, w, ye, $e, v])), b++;
      }
    }
    if (!b) return 0;
    m.push([]), t.points.val = u, t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = f);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return P(), b;
  }, E.addEventListener("click", (e) => {
    var _a2, _b, _c;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Nn > 5) {
      Nn = 0;
      return;
    }
    Nn = 0;
    const n = B(e);
    if (!n) return;
    V.setFromCamera(N, n);
    const a = !!(Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3), o = a ? [{ point: Tt.p.clone(), distance: n.position.distanceTo(Tt.p) }] : Ye();
    if (!o.length) return;
    if (!a) {
      const l = n.position.distanceTo(S.target) || 1, h = o[0].distance ?? n.position.distanceTo(o[0].point), p = o[0].point;
      if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.z) || h > Math.max(l * 12, 300)) {
        ce("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let s = o[0].point;
    (e.ctrlKey || e.metaKey) && (s = new F(Math.round(o[0].point.x), Math.round(o[0].point.y), Math.round(o[0].point.z)));
    {
      const l = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], h = l[l.length - 1] ?? [], p = t.points.rawVal ?? [];
      if (h.length > 0) {
        const i = p[h[h.length - 1]];
        if (i) {
          const c = !!window.__hekatanOrthoMode;
          let r = Ct;
          if (!r && c) {
            const u = Math.abs(s.x - i[0]), m = Math.abs(s.y - i[1]), f = Math.abs(s.z - i[2]);
            r = u >= m && u >= f ? "x" : m >= f ? "y" : "z";
          }
          r === "x" ? s = new F(s.x, i[1], i[2]) : r === "y" ? s = new F(i[0], s.y, i[2]) : r === "z" && (s = new F(i[0], i[1], s.z));
        }
      }
    }
    if (Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3) s = Tt.p.clone();
    else if (Wn) s = Wn.clone(), ce(`\u{1F4D0} Eje \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
    else {
      const l = la(s), h = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, s.x, s.y, s.z, l, { x: e.clientX, y: e.clientY });
      if (h) s = new F(h.x, h.y, h.z), ce(`\u{1F3AF} Snap [${h.type.toUpperCase()}] \u2192 (${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`);
      else {
        const p = window.__hekatanSnapEnabled !== false, i = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        p && i > 0 && (s = new F(Math.round(s.x / i) * i, Math.round(s.y / i) * i, Math.round(s.z / i) * i));
      }
    }
    ga(s, e);
  });
  const hi = (e) => {
    var _a2;
    const n = (_a2 = t.gridTarget) == null ? void 0 : _a2.rawVal;
    if (!n) return true;
    const a = new F(0, 0, 1).applyEuler(new Cn(...n.rotation)).normalize(), o = V.ray.direction;
    return o.lengthSq() < 1e-12 ? true : Math.abs(o.clone().normalize().dot(a)) >= 0.026;
  }, ga = (e, n) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (!(a === "select" || a === "none" || !a || a === "medir" || a === "move" || a === "copy" || a === "delete" || a === "trim" || a === "extend") && !!!Wn && !hi()) {
      ce(`\u2715 Est\xE1s mirando el plano de trabajo casi de canto, y ah\xED un p\xEDxel vale decenas de metros: el punto caer\xEDa en (${e.x.toFixed(1)}, ${e.y.toFixed(1)}, ${e.z.toFixed(1)}) m. Gira la vista, ponte en una ortogonal (Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`);
      return;
    }
    if (a === "select" || a === "none" || !a) {
      if (bn) {
        Ht && Do();
        const { kind: i, a: c, b: r } = bn, u = r !== void 0 ? `${i}:${c}:${r}` : `${i}:${c}`;
        !!n && (n.ctrlKey || n.metaKey || n.shiftKey) || Je.clear(), Je.has(u) ? Je.delete(u) : Je.add(u), sn(), ce(`\u2713 Seleccionados ${Je.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!n && (n.ctrlKey || n.metaKey || n.shiftKey), c = (n == null ? void 0 : n.clientX) ?? 0, r = (n == null ? void 0 : n.clientY) ?? 0;
        Ht ? (ja(Ht.x, Ht.y, c, r, i), Ht = null) : i || (Ht = { x: c, y: r }, ce("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), ua(c, r, c + 1, r + 1, false));
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
      const c = i.mode === "number", r = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, i.pendingStart, [e.x, e.y, e.z], c);
      ce(`\u2713 Eje "${r}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      ds(a, [e.x, e.y, e.z]);
      return;
    }
    if (a === "delete") {
      if (Fn >= 0) {
        const i = window.__hekatanDrawingAuxLines, c = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], r = Fn;
        if (r >= 0 && r < c.length) {
          Pt();
          const u = c.slice(0, r).concat(c.slice(r + 1));
          i && typeof i == "object" && "val" in i ? i.val = u : window.__hekatanDrawingAuxLines = u, ce(`\u{1F5D1} L\xEDnea auxiliar #${r + 1} borrada`), Fn = -1, qt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (un >= 0) {
        const i = un, c = An;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (Fo(i), ce(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : c >= 0 ? (Ya(i, c), ce(`\u{1F5D1} Segmento ${c + 1} de polil\xEDnea #${i + 1} borrado`)) : (Fo(i), ce(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else ce("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, c] = Oe, r = Math.hypot(c[0] - i[0], c[1] - i[1], c[2] - i[2]), u = Math.abs(c[0] - i[0]), m = Math.abs(c[1] - i[1]), f = Math.abs(c[2] - i[2]), b = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), w = (b === "xy" ? f < 1e-3 : b === "xz" ? m < 1e-3 : b === "yz" ? u < 1e-3 : false) ? b : f < 1e-3 ? "xy" : m < 1e-3 ? "xz" : "yz", d = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], r, d, w), ce(`\u2713 C\xEDrculo dibujado en ${w.toUpperCase()} \u2014 r=${r.toFixed(2)}m, ${d} segmentos`), Oe = [];
      try {
        (_l2 = window.__hekatanRebuild) == null ? void 0 : _l2.call(window);
      } catch {
      }
      return;
    }
    if (a === "ifcface") {
      if (!J) {
        ce("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!J.plana) {
        ce("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const i = Y(J.m), c = oe(i, J.tris);
      if (c.length < 3) {
        ce("\u25A6 No se pudo cerrar el contorno de la cara.");
        return;
      }
      const r = J.normal.clone(), u = K(J.m, J.punto, r);
      let m = String(window.__hekatanIfcCaraPos ?? "auto"), f = false;
      try {
        const _ = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        f = Math.round((_ == null ? void 0 : _.matShell) ?? 0) === 1;
      } catch {
      }
      m === "auto" && (m = Math.abs(r.z) > 0.5 ? f ? "interior" : "exterior" : "media");
      const b = u ?? 0.2, v = m === "exterior" ? 0 : m === "interior" ? b : b / 2, w = c.map((_) => _.clone().addScaledVector(r, -v));
      Pt(), at = w.map((_) => [_.x, _.y, _.z]);
      const d = Lo();
      try {
        const _ = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        _ && u && (_.tShell = Math.round(u * 100) / 100);
      } catch {
      }
      const x = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let M = "la de \xABSecci\xF3n shells\xBB";
      try {
        const _ = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        _ && _.formaPlaca != null && (M = x[Math.round(_.formaPlaca)] ?? M);
      } catch {
      }
      const $ = m === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : m === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + b.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (b / 2).toFixed(2) + " m hacia dentro)";
      ce(`\u25A6 \xC1rea desde la cara del IFC: ${c.length} v\xE9rtices, ${d} shell(s). Espesor medido ${u ? u.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${$}; formulaci\xF3n ${M}, t = ${b.toFixed(2)} m.`), fe(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      P();
      return;
    }
    if (a === "ifcline") {
      if (!ge || ge.length < 2) {
        ce("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = I(ge);
      Pt();
      const c = t.points.rawVal, r = [], u = [];
      for (const f of i) {
        let b = c.findIndex((v) => Math.abs(v[0] - f[0]) < 1e-3 && Math.abs(v[1] - f[1]) < 1e-3 && Math.abs(v[2] - f[2]) < 1e-3);
        b < 0 && (b = c.length + u.length, u.push(f)), r.push(b);
      }
      if (t.points.val = [...c, ...u], t.polylines) {
        const f = t.polylines.rawVal, b = f.length && f[f.length - 1].length === 0 ? f.slice(0, -1) : f;
        t.polylines.val = [...b, r, []];
      }
      const m = ge.reduce((f, b, v) => v ? f + b.distanceTo(ge[v - 1]) : 0, 0);
      ce(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${m.toFixed(2)} m de desarrollo.`), U(null);
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
      const [i, c, r] = Oe, u = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, c, r, u), ce(`\u2713 Arco dibujado \u2014 ${u} segmentos`), Oe = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "parabola" || a === "cubica") {
      const i = a === "parabola" ? 3 : 4, c = a === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Oe.push([e.x, e.y, e.z]), Oe.length < i) {
        ce(`\u223F ${c} \u2014 punto ${Oe.length}/${i} OK. Marc\xE1 el ${Oe.length + 1}\xBA.`);
        return;
      }
      const r = window.__hekatanArcSegs ?? 12, u = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Oe.slice(), r);
      if (!(u == null ? void 0 : u.ok)) {
        ce(`\u26A0 ${c}: ${(u == null ? void 0 : u.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Oe = [];
        return;
      }
      const m = "xyz"[u.ia ?? 0], f = "xyz"[u.io ?? 2], b = (u.coef ?? []).map((v, w) => `${v >= 0 && w ? "+" : ""}${v.toFixed(3)}${w ? "\xB7" + m + (w > 1 ? "^" + w : "") : ""}`).join(" ");
      ce(`\u2713 ${c} dibujada en ${String(u.plano ?? "").toUpperCase()} \u2014 ${r} tramos a \u0394 igual de ${m} \xB7 ${f} = ${b}`), Oe = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (a === "revolve") {
      const i = Math.round(window.__hekatanRevSectores ?? 16), c = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, i, 360);
      if (c == null ? void 0 : c.msg) {
        ce(`\u26A0 Revoluci\xF3n: ${c.msg}.`);
        return;
      }
      ce(`\u2713 Revoluci\xF3n: ${c.anillos} anillo(s) \xD7 ${i} sectores \u2192 ${c.areas} pa\xF1o(s) Q4${c.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${c.guias ? ` ${c.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
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
      const [i, c] = Oe;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, c), ce(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${c[0].toFixed(1)},${c[1].toFixed(1)})`), Oe = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const c = (Tt && Math.abs(Tt.x - n.clientX) < 3 && Math.abs(Tt.y - n.clientY) < 3 ? [Tt.p.x, Tt.p.y, Tt.p.z] : null) ?? ct(n);
      if (!c) return;
      if (ht.length >= 2 && (ht = []), ht.push(c), ht.length === 1) lt.visible = false, $t(), ce("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [r, u] = ht;
        lt.geometry.setFromPoints([new F(r[0], r[1], r[2]), new F(u[0], u[1], u[2])]), lt.visible = true;
        const m = Math.hypot(u[0] - r[0], u[1] - r[1], u[2] - r[2]), f = Math.hypot(u[0] - r[0], u[1] - r[1]);
        tt.textContent = `${m.toFixed(3)} m`, $t(), ce(`\u{1F4CF} Distancia ${m.toFixed(3)} m  \xB7  \u0394x ${(u[0] - r[0]).toFixed(3)}  \u0394y ${(u[1] - r[1]).toFixed(3)}  \u0394z ${(u[2] - r[2]).toFixed(3)}  \xB7  en planta ${f.toFixed(3)} m`);
      }
      P();
      return;
    }
    if (a === "fillarea") {
      const i = t.points.rawVal, c = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], r = /* @__PURE__ */ new Map(), u = (T, H) => {
        T !== H && ((r.get(T) ?? r.set(T, /* @__PURE__ */ new Set()).get(T)).add(H), (r.get(H) ?? r.set(H, /* @__PURE__ */ new Set()).get(H)).add(T));
      };
      for (const T of c) for (let H = 0; H + 1 < T.length; H++) u(T[H], T[H + 1]);
      const m = (T, H) => {
        var _a3;
        return !!((_a3 = r.get(T)) == null ? void 0 : _a3.has(H));
      }, f = /* @__PURE__ */ new Set(), b = [], v = [...r.keys()];
      for (const T of v) for (const H of r.get(T)) if (!(H < T)) {
        for (const le of r.get(H)) if (le !== T) for (const he of r.get(le)) {
          if (he === T || he === H || !m(he, T) || m(T, le) || m(H, he)) continue;
          const $e = [T, H, le, he].slice().sort((ye, Ee) => ye - Ee).join("-");
          f.has($e) || (f.add($e), b.push([T, H, le, he]));
        }
      }
      for (const T of v) for (const H of r.get(T)) if (!(H < T)) for (const le of r.get(H)) {
        if (le === T || !m(le, T)) continue;
        const he = [T, H, le].slice().sort(($e, ye) => $e - ye).join("-");
        f.has(he) || (f.add(he), b.push([T, H, le]));
      }
      const w = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", d = (T) => w === "xy" ? [T[0], T[1]] : w === "xz" ? [T[0], T[2]] : [T[1], T[2]], x = d([e.x, e.y, e.z]), M = (T, H) => {
        let le = false;
        for (let he = 0, $e = H.length - 1; he < H.length; $e = he++) {
          const ye = H[he][0], Ee = H[he][1], ke = H[$e][0], Ze = H[$e][1];
          Ee > T[1] != Ze > T[1] && T[0] < (ke - ye) * (T[1] - Ee) / (Ze - Ee) + ye && (le = !le);
        }
        return le;
      }, $ = (T) => {
        let H = 0;
        for (let le = 0, he = T.length - 1; le < T.length; he = le++) H += (T[he][0] + T[le][0]) * (T[he][1] - T[le][1]);
        return Math.abs(H) / 2;
      };
      let _ = null, C = 1 / 0;
      for (const T of b) {
        const H = T.map((he) => d(i[he]));
        if (!M(x, H)) continue;
        const le = $(H);
        le < C && (C = le, _ = T);
      }
      if (!_) {
        ce("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const L = _.slice().sort((T, H) => T - H).join("-"), j = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (j.some((T) => {
        const H = c[T] ?? [];
        return [...new Set(H)].sort((le, he) => le - he).join("-") === L;
      })) {
        ce("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...c, [..._, _[0]]], t.areas.val = [...j, c.length], ce(`\u2713 \xC1rea creada por relleno (${_.length} lados).`);
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
      const [i, c] = Oe;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, c), ce(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${c[0].toFixed(1)},${c[1].toFixed(1)})`), Oe = [];
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
      const [i, c, r] = Oe, u = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, c, r);
      ce(u ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Oe = [];
      return;
    }
    if (a === "col") {
      Pt();
      const i = e.z, c = At && At > 0 ? At : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + c]];
      const r = t.polylines.rawVal, u = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [u - 2, u - 1], []], At = 0, ce(`\u258C Columna creada \u2014 h=${c.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
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
      const [i, c] = Oe, r = At && At > 0 ? At : 3;
      Pt();
      const u = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [c[0], c[1], c[2]], [c[0], c[1], c[2] + r], [i[0], i[1], i[2] + r]];
      const m = t.polylines.rawVal;
      if (m.length - 1, t.polylines.val = [...m.slice(0, -1), ...m[m.length - 1].length > 0 ? [m[m.length - 1]] : [], [u, u + 1, u + 2, u + 3, u], []], t.areas) {
        const f = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, f];
      }
      ce(`\u25A5 Pared Q4 creada \u2014 h=${r.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Oe = [], At = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Pt();
      const i = At && At > 0 ? At : 3, c = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, c], [e.x, e.y, c + i]];
      const r = t.polylines.rawVal, u = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [u - 2, u - 1], []], At = 0, ce(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, c = oa(e.x, e.y, e.z, i);
      if (!c) {
        ce("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const r = t.polylines.rawVal, u = t.points.rawVal, m = r[c.polyIdx], f = u[m[c.segIdx]], b = u[m[c.segIdx + 1]];
      if (!f || !b) {
        ce("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const v = At && At > 0 ? At : 3;
      Pt();
      const w = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [f[0], f[1], f[2]], [b[0], b[1], b[2]], [b[0], b[1], b[2] + v], [f[0], f[1], f[2] + v]];
      const d = t.polylines.rawVal;
      if (t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [w, w + 1, w + 2, w + 3, w], []], t.areas) {
        const x = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, x];
      }
      At = 0, ce(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${v.toFixed(2)}m`);
      try {
        (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
      } catch {
      }
      return;
    }
    if (a === "auxp") {
      const i = window.__hekatanDrawingAuxPoints;
      if (i) {
        const c = i.rawVal ?? i.val ?? [];
        i.val = [...c, [e.x, e.y, e.z]];
      }
      ce(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Oe.push([e.x, e.y, e.z]), Oe.length === 1) {
        ce("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, c] = Oe, r = window.__hekatanDrawingAuxLines;
      if (r) {
        Pt();
        const v = r.rawVal ?? r.val ?? [];
        r.val = [...v, [i[0], i[1], i[2], c[0], c[1], c[2]]];
      }
      const u = c[0] - i[0], m = c[1] - i[1], f = c[2] - i[2], b = Math.sqrt(u * u + m * m + f * f);
      ce(`\u2713 L\xEDnea auxiliar creada \u2014 L=${b.toFixed(2)}m (cyan, no FEM)`), Oe = [];
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
      const [i, c] = Oe, r = window.__hekatanChaflanR ?? 1, u = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, c, r, u, 6);
      const m = Math.abs(c[0] - i[0]).toFixed(1), f = Math.abs(c[1] - i[1]).toFixed(1);
      ce(`\u2713 Losa con chaflanes dibujada \u2014 ${m}\xD7${f}m, r=${r}m, ${u} seg/chafl\xE1n`), Oe = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    et = false, Pt();
    const l = e.toArray(), h = t.points.rawVal;
    let p = h.findIndex((i) => Math.abs(i[0] - l[0]) < 1e-3 && Math.abs(i[1] - l[1]) < 1e-3 && Math.abs(i[2] - l[2]) < 1e-3);
    if (p < 0 && (t.points.val = [...h, l], p = t.points.rawVal.length - 1), t.polylines && a !== "node") {
      const i = t.polylines.rawVal, c = i.length ? i[i.length - 1] : [];
      c.length && c[c.length - 1] === p ? t.polylines.val = [...i, [p]] : t.polylines.val = [...i.slice(0, -1), [...c, p]];
    }
    if (t.polylines) {
      const i = t.polylines.rawVal, c = i.length - 1, r = i[c] ?? [];
      if (a === "line" && r.length >= 2) {
        ce(`\uFF0F L\xEDnea \u2014 ${r.length - 1} tramo${r.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && r.length === 4) {
        t.polylines.val = [...i.slice(0, -1), [...r, r[0]], []], t.areas && (t.areas.val = [...t.areas.rawVal, c]), ce("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
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
  E.addEventListener("click", () => Jt()), E.addEventListener("contextmenu", (e) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && at.length >= 3) {
      e.preventDefault();
      const a = Lo();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), E.addEventListener("pointermove", (e) => {
    var _a2, _b, _c;
    const n = B(e);
    if (!n) return;
    V.setFromCamera(N, n);
    const a = Ye();
    if (Qe.geometry.deleteAttribute("position"), a.length) {
      let o = a[0].point.clone();
      (e.ctrlKey || e.metaKey) && o.set(Math.round(o.x), Math.round(o.y), Math.round(o.z));
      {
        const h = ((_a2 = t.polylines) == null ? void 0 : _a2.rawVal) ?? [], p = h[h.length - 1] ?? [], i = t.points.rawVal ?? [];
        if (p.length > 0) {
          const c = i[p[p.length - 1]];
          if (c) {
            const r = !!window.__hekatanOrthoMode;
            let u = Ct;
            if (!u && r) {
              const m = Math.abs(o.x - c[0]), f = Math.abs(o.y - c[1]), b = Math.abs(o.z - c[2]);
              u = m >= f && m >= b ? "x" : f >= b ? "y" : "z";
            }
            u === "x" ? o.set(o.x, c[1], c[2]) : u === "y" ? o.set(c[0], o.y, c[2]) : u === "z" && o.set(c[0], c[1], o.z);
          }
        }
      }
      const s = la(o), l = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, o.x, o.y, o.z, s, { x: e.clientX, y: e.clientY });
      if (l) o.set(l.x, l.y, l.z);
      else {
        const h = window.__hekatanSnapEnabled !== false, p = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        h && p > 0 && (o.x = Math.round(o.x / p) * p, o.y = Math.round(o.y / p) * p, o.z = Math.round(o.z / p) * p);
      }
      Qe.geometry.setAttribute("position", new It(o.toArray(), 3));
    }
    P();
  }), E.addEventListener("pointermove", (e) => {
    var _a2;
    const n = B(e);
    if (!n) return;
    V.setFromCamera(N, n);
    let a = false;
    const o = V.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const l = new F(...t.points.rawVal[o[0].index]), h = new F(...s[0].point), p = l.sub(h), i = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      i.transformDirection(ee.matrixWorld), Math.abs(p.dot(i)) < 1e-4 && (a = true);
    }
    Qe.visible = !a;
  });
  let ba = false, Ma;
  E.addEventListener("pointermove", (e) => {
    var _a2;
    if (!Nn) return;
    const n = B(e);
    if (!n) return;
    V.setFromCamera(N, n);
    let a = false;
    const o = V.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const h = new F(...t.points.rawVal[o[0].index]), p = new F(...s[0].point), i = h.sub(p), c = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      c.transformDirection(ee.matrixWorld), Math.abs(i.dot(c)) < 1e-4 && (a = true);
    }
    if (a && Nn < 5 && (ba = true, S.enabled = false, Ma = o[0].index), !ba || Nn % 2 !== 0) return;
    const l = [...t.points.rawVal];
    if (Ma !== void 0) {
      let h = s[0].point;
      (e.ctrlKey || e.metaKey) && (h = new F(Math.round(h.x), Math.round(h.y), Math.round(h.z))), l[Ma] = h.toArray();
    }
    t.points.val = l;
  }), E.addEventListener("pointerup", () => {
    S.enabled = true, ba = false;
  }), E.addEventListener("contextmenu", (e) => {
    var _a2;
    const n = B(e);
    if (!n) return;
    V.setFromCamera(N, n);
    let a = false;
    const o = V.intersectObject(Le), s = Ye();
    if (o.length && s.length) {
      const p = new F(...t.points.rawVal[o[0].index]), i = new F(...s[0].point), c = p.sub(i), r = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      r.transformDirection(ee.matrixWorld), Math.abs(c.dot(r)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const l = [...t.points.rawVal];
    if (l.splice(o[0].index, 1), t.points.val = l, !t.polylines) return;
    const h = t.polylines.rawVal.map((p) => p.filter((i) => i !== o[0].index)).map((p) => p.map((i) => i > o[0].index ? i - 1 : i)).filter((p) => p.length);
    h.push([]), t.polylines.val = h;
  });
}
function ol(t, y, g) {
  const A = Math.round(14.999999999999998), z = { position: t.position.clone(), quaternion: t.quaternion.clone() }, E = setInterval(V, 1e3 / 30);
  let P = 0;
  function V() {
    P++;
    const N = P / A;
    t.position.lerpVectors(z.position, y.position, N), t.quaternion.slerpQuaternions(z.quaternion, y.quaternion, N), g && g(), P == A && clearInterval(E);
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
  const z = new dn(), E = ue.state([]);
  return ue.derive(() => {
    var _a, _b, _c;
    y.deformedShape.val;
    const P = g.val, V = ((_a = t.elements) == null ? void 0 : _a.val) ?? [], N = ll(y.frameResults.val);
    if (S.children.forEach((R) => {
      R.geometry && R.geometry.dispose(), R.material && R.material.dispose();
    }), S.clear(), !N || V.length === 0 || P.length === 0) {
      E.val = [];
      return;
    }
    const B = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, ee = (_c = t.deformOutputs) == null ? void 0 : _c.val, X = [], we = [];
    for (let R = 0; R < V.length; R++) {
      if (V[R].length !== 2) continue;
      const pe = rl(N, R, B, ee);
      pe && (X.push(pe[0], pe[1]), we.push({ idx: R, vals: pe }));
    }
    if (X.length === 0) {
      E.val = [];
      return;
    }
    const Q = Math.min(...X), Z = Math.max(...X);
    A.setMin(Q), A.setMax(Z), E.val = X;
    const ae = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const R of P) for (let J = 0; J < 3; J++) ae[J] = Math.min(ae[J], R[J]), se[J] = Math.max(se[J], R[J]);
    const me = Math.max(se[0] - ae[0], se[1] - ae[1], se[2] - ae[2], 1) * il, xe = [], de = [], G = [];
    let U = 0;
    for (const { idx: R, vals: J } of we) {
      const pe = V[R], fe = P[pe[0]], oe = P[pe[1]];
      if (!fe || !oe) continue;
      const K = new F(oe[0] - fe[0], oe[1] - fe[1], oe[2] - fe[2]), Me = K.length();
      if (Me < 1e-10) continue;
      K.normalize();
      const te = Math.abs(K.y) < 0.99 ? new F(0, 1, 0) : new F(1, 0, 0), Ie = new F().crossVectors(K, te).normalize(), be = new F().crossVectors(K, Ie).normalize(), ve = Fa + 1, Pe = sl;
      for (let Xe = 0; Xe < ve; Xe++) {
        const Ae = Xe / Fa, nt = fe[0] + K.x * Me * Ae, st = fe[1] + K.y * Me * Ae, Ue = fe[2] + K.z * Me * Ae, D = J[0] + (J[1] - J[0]) * Ae, O = A.getColor(D) ?? new dn(0, 0, 0);
        z.copy(O).convertSRGBToLinear();
        for (let re = 0; re < Pe; re++) {
          const ie = re / Pe * Math.PI * 2, _e = Math.cos(ie), Ce = Math.sin(ie);
          xe.push(nt + (Ie.x * _e + be.x * Ce) * me, st + (Ie.y * _e + be.y * Ce) * me, Ue + (Ie.z * _e + be.z * Ce) * me), de.push(z.r, z.g, z.b);
        }
      }
      for (let Xe = 0; Xe < Fa; Xe++) for (let Ae = 0; Ae < Pe; Ae++) {
        const nt = (Ae + 1) % Pe, st = U + Xe * Pe + Ae, Ue = U + Xe * Pe + nt, D = U + (Xe + 1) * Pe + Ae, O = U + (Xe + 1) * Pe + nt;
        G.push(st, Ue, O), G.push(st, O, D);
      }
      U += ve * Pe;
    }
    if (xe.length === 0) return;
    const I = new Ve();
    I.setAttribute("position", new It(xe, 3)), I.setAttribute("color", new It(de, 3)), I.setIndex(G), I.computeVertexNormals();
    const q = new xt({ vertexColors: true, side: Lt }), Y = new dt(I, q);
    Y.frustumCulled = false, S.add(Y);
  }), S.__colorMapValues = E, S;
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
  const g = new io(1, 16, 16), k = new xt({ color: hl, transparent: true, opacity: 0.85, depthTest: false }), S = new dt(g, k);
  S.visible = false, S.renderOrder = 100, y.add(S);
  const A = new Ve(), z = new wt({ color: Ss, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), E = new nn(A, z);
  E.visible = false, E.renderOrder = 100, y.add(E);
  const P = new xt({ color: Ss, transparent: true, opacity: 0.7, depthTest: false }), V = new dt(new Ms(1, 1, 1, 12), P);
  V.visible = false, V.renderOrder = 100, y.add(V);
  const N = new Ve(), B = new xt({ color: ml, transparent: true, opacity: 0.45, side: Lt, depthTest: false }), ee = new dt(N, B);
  ee.visible = false, ee.renderOrder = 100, y.add(ee);
  const X = new Ve(), we = new wt({ color: wl, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), Q = new nn(X, we);
  Q.visible = false, Q.renderOrder = 100, y.add(Q);
  const Z = new xt({ color: Wo, transparent: true, opacity: 0.95, depthTest: false }), ae = new xt({ color: Wo, transparent: true, opacity: 0.85, depthTest: false }), se = new Ms(1, 1, 1, 12), ge = new xt({ color: Wo, transparent: true, opacity: 0.55, side: Lt, depthTest: false }), me = new wt({ color: Wo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), xe = [];
  window.__hekatanModelSelection = xe;
  const de = new pt();
  de.renderOrder = 101, y.add(de);
  let G = null;
  const U = document.createElement("div");
  Object.assign(U.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), U.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(U);
  }, 0);
  function I(D) {
    const O = t.derivedNodes.rawVal;
    return !O || D < 0 || D >= O.length ? null : new F(O[D][0], O[D][1], O[D][2]);
  }
  function q(D, O) {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n, _o2, _p, _q, _r, _s2, _t;
    const re = t.getActiveCamera();
    if (!re || !t.mesh) return null;
    const ie = t.rendererElm.getBoundingClientRect(), _e = D - ie.left, Ce = O - ie.top, Ye = t.derivedNodes.rawVal, Le = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (!Ye || !Le) return null;
    const Qe = /* @__PURE__ */ new Map(), Ke = (je) => {
      if (Qe.has(je)) return Qe.get(je);
      const Fe = I(je);
      if (!Fe) return Qe.set(je, null), null;
      const De = Fe.clone().project(re), We = (De.x * 0.5 + 0.5) * ie.width, Be = (-De.y * 0.5 + 0.5) * ie.height, at = { x: We, y: Be, z: De.z };
      return Qe.set(je, at), at;
    }, ze = /* @__PURE__ */ new Set();
    for (const je of Le) if (je) for (const Fe of je) ze.add(Fe);
    const Ne = 8;
    let Ge = -1, rt = Ne;
    for (let je = 0; je < Ye.length; je++) {
      if (!ze.has(je)) continue;
      const Fe = Ke(je);
      if (!Fe || Fe.z < -1 || Fe.z > 1) continue;
      const De = Fe.x - _e, We = Fe.y - Ce, Be = Math.sqrt(De * De + We * We);
      Be < rt && (rt = Be, Ge = je);
    }
    const et = dl(), Mt = pl[et.dispUnit] ?? 1e3, gt = ul[et.forceUnit] ?? 1;
    if (Ge >= 0) {
      const je = Ye[Ge];
      let Fe = `Nodo ${Ge}
(${je[0].toFixed(3)}, ${je[1].toFixed(3)}, ${je[2].toFixed(3)})`;
      const De = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (De == null ? void 0 : De.deformations) {
        const We = De.deformations.get(Ge);
        if (We && (Fe += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Fe += `
Ux = ${Ft(We[0] * Mt, 3)} ${et.dispUnit}`, Fe += `
Uy = ${Ft(We[1] * Mt, 3)} ${et.dispUnit}`, Fe += `
Uz = ${Ft(We[2] * Mt, 3)} ${et.dispUnit}`, (Math.abs(We[3]) > 1e-9 || Math.abs(We[4]) > 1e-9 || Math.abs(We[5]) > 1e-9) && (Fe += `
Rx = ${Ft(We[3] * 1e3, 3)} mrad`, Fe += `
Ry = ${Ft(We[4] * 1e3, 3)} mrad`, Fe += `
Rz = ${Ft(We[5] * 1e3, 3)} mrad`)), De.reactions) {
          const Be = De.reactions.get(Ge);
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
      return { type: "node", idx: Ge, info: Fe };
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
              const So = St / zt, Ut = Xt / zt, Rn = on / zt, _n2 = (ct[0] - tt[0]) * So + (ct[1] - tt[1]) * Ut + (ct[2] - tt[2]) * Rn, hn = ((_o2 = lt.elasticities) == null ? void 0 : _o2.get(kt)) ?? 0, Tn = ((_p = lt.areas) == null ? void 0 : _p.get(kt)) ?? 0, Gn = ((_q = lt.momentsOfInertiaY) == null ? void 0 : _q.get(kt)) ?? 0, na = ((_r = lt.momentsOfInertiaZ) == null ? void 0 : _r.get(kt)) ?? 0, Zt = ((_s2 = lt.torsionalConstants) == null ? void 0 : _s2.get(kt)) ?? 0, lo = ((_t = lt.shearModuli) == null ? void 0 : _t.get(kt)) ?? hn / 2.6, Dn = hn * Tn * (_n2 / zt), Kn = (ct[3] - tt[3]) * So + (ct[4] - tt[4]) * Ut + (ct[5] - tt[5]) * Rn, Bn = lo * Zt * (Kn / zt), mn = ct[4] - tt[4], ro = ct[5] - tt[5], Wt = hn * Gn * mn / zt, Ot = hn * na * ro / zt;
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
  function Y(D, O, re) {
    var _a, _b, _c;
    if (S.visible = false, E.visible = false, V.visible = false, ee.visible = false, Q.visible = false, !D || !t.mesh) {
      U.style.display = "none", t.render();
      return;
    }
    const ie = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (D.type === "node") {
      const Le = I(D.idx);
      if (Le) {
        const Qe = t.derivedNodes.rawVal ?? [];
        let Ke = 1;
        if (Qe.length >= 2) {
          let Ge = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const et of Qe) for (let Mt = 0; Mt < 3; Mt++) et[Mt] < Ge[Mt] && (Ge[Mt] = et[Mt]), et[Mt] > rt[Mt] && (rt[Mt] = et[Mt]);
          Ke = Math.max(rt[0] - Ge[0], rt[1] - Ge[1], rt[2] - Ge[2], 0.1);
        }
        const ze = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Ne = 0.021 * Ke * ze;
        S.position.copy(Le), S.scale.setScalar(Ne), S.visible = true;
      }
    } else if (D.type === "frame" && ie) {
      const Le = ie[D.idx], Qe = I(Le[0]), Ke = I(Le[1]);
      if (Qe && Ke) {
        const ze = Qe.clone().add(Ke).multiplyScalar(0.5), Ne = Ke.clone().sub(Qe), Ge = Ne.length(), rt = Math.max(1e-4, 3.5 * Xe(ze));
        V.position.copy(ze);
        const et = new F(0, 1, 0), Mt = et.clone().cross(Ne).normalize(), gt = et.angleTo(Ne);
        V.quaternion.setFromAxisAngle(Mt, gt), V.scale.set(rt, Ge, rt), V.visible = true;
      }
    } else if (D.type === "shell" && ie) {
      const Le = ie[D.idx], Qe = [], Ke = [];
      for (const ze of Le) {
        const Ne = I(ze);
        if (!Ne) return;
        Qe.push(Ne.x, Ne.y, Ne.z);
      }
      Le.length === 4 ? Ke.push(0, 1, 2, 0, 2, 3) : Le.length === 3 && Ke.push(0, 1, 2), N.setAttribute("position", new It(Qe, 3)), N.setIndex(Ke), N.computeVertexNormals(), ee.visible = true;
    } else if (D.type === "solid" && ie) {
      const Le = ie[D.idx], Qe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ke = [];
      for (const [ze, Ne] of Qe) {
        const Ge = I(Le[ze]), rt = I(Le[Ne]);
        Ge && rt && Ke.push(Ge.x, Ge.y, Ge.z, rt.x, rt.y, rt.z);
      }
      X.setAttribute("position", new It(Ke, 3)), Q.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      U.style.display = "none", t.render();
      return;
    }
    U.textContent = D.info, U.style.whiteSpace = "pre-line", U.style.display = "block";
    const Ce = t.rendererElm.getBoundingClientRect(), Ye = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Ce;
    U.style.left = `${O - Ye.left}px`, U.style.top = `${re - Ye.top}px`, t.render();
  }
  let R = "", J = 0, pe = 0;
  const fe = window.__hekatanHoverDebug ?? false, oe = (D) => {
    J && cancelAnimationFrame(J), J = requestAnimationFrame(() => {
      var _a, _b, _c;
      const O = q(D.clientX, D.clientY);
      if (fe && pe < 5) {
        const ie = t.derivedNodes.rawVal, _e = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${D.clientX}, ${D.clientY}) nodes=${(ie == null ? void 0 : ie.length) ?? 0} elems=${(_e == null ? void 0 : _e.length) ?? 0} hover=`, O), pe++;
      }
      const re = O ? `${O.type}:${O.idx}` : "";
      if (re !== R) R = re, Y(O, D.clientX, D.clientY);
      else if (O) {
        const ie = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        U.style.left = `${D.clientX - ie.left}px`, U.style.top = `${D.clientY - ie.top}px`;
      }
    });
  };
  let K = null;
  const Me = () => {
    R = "", S.visible = false, E.visible = false, V.visible = false, ee.visible = false, Q.visible = false, U.style.display = "none", t.render();
  }, te = (D) => {
    const O = t.rendererElm.getBoundingClientRect(), re = D.clientX - O.left, ie = D.clientY - O.top;
    (re < -2 || ie < -2 || re > O.width + 2 || ie > O.height + 2) && (K && clearTimeout(K), K = window.setTimeout(Me, 200));
  }, Ie = () => {
    K && (clearTimeout(K), K = null);
  };
  t.rendererElm.addEventListener("pointermove", oe), t.rendererElm.addEventListener("pointerleave", te), t.rendererElm.addEventListener("pointerenter", Ie);
  function be() {
    var _a, _b, _c;
    const D = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    return D === "select" || D === "none" || !D;
  }
  let ve = null;
  t.rendererElm.addEventListener("pointerdown", (D) => {
    D.button === 0 && (ve = { x: D.clientX, y: D.clientY });
  }), t.rendererElm.addEventListener("pointerup", (D) => {
    if (D.button !== 0 || !ve) return;
    const O = D.clientX - ve.x, re = D.clientY - ve.y;
    if (ve = null, O * O + re * re > 9 || !be()) return;
    const ie = q(D.clientX, D.clientY);
    ie ? (st({ type: ie.type, idx: ie.idx }, D.shiftKey), nt()) : Ue();
  }), window.addEventListener("keydown", (D) => {
    if (D.key !== "Escape" || !xe.length) return;
    const O = document.activeElement, re = !!O && (O.id === "hk3-cmd-input" || O.id === "hk-dyn-input") && O.value === "";
    O && (O.tagName === "INPUT" || O.tagName === "TEXTAREA" || O.isContentEditable) && !re || Ue();
  }, { capture: true });
  function Pe() {
    for (const D of de.children.slice()) {
      de.remove(D);
      const O = D.geometry;
      O && O !== g && O !== se && O.dispose();
    }
  }
  const Xe = (D) => {
    var _a;
    const O = t.getActiveCamera(), re = ((_a = t.rendererElm) == null ? void 0 : _a.clientHeight) || 700;
    return O.isOrthographicCamera ? (O.top - O.bottom) / (O.zoom || 1) / re : 2 * O.position.distanceTo(D) * Math.tan((O.fov || 50) * Math.PI / 180 / 2) / re;
  };
  function Ae(D, O) {
    var _a, _b;
    const re = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
    if (D.type === "node") {
      const ie = I(D.idx);
      if (!ie) return;
      const _e = new dt(g, Z);
      _e.position.copy(ie), _e.scale.setScalar(Math.max(1e-4, 7 * Xe(ie))), _e.renderOrder = 101, de.add(_e);
    } else if (D.type === "frame" && re) {
      const ie = re[D.idx], _e = I(ie[0]), Ce = I(ie[1]);
      if (!_e || !Ce) return;
      const Ye = _e.clone().add(Ce).multiplyScalar(0.5), Le = Ce.clone().sub(_e), Qe = Le.length(), Ke = Math.max(1e-4, 4 * Xe(Ye)), ze = new dt(se, ae);
      ze.position.copy(Ye);
      const Ne = new F(0, 1, 0);
      ze.quaternion.setFromAxisAngle(Ne.clone().cross(Le).normalize(), Ne.angleTo(Le)), ze.scale.set(Ke, Qe, Ke), ze.renderOrder = 101, de.add(ze);
    } else if (D.type === "shell" && re) {
      const ie = re[D.idx], _e = [], Ce = [];
      for (const Qe of ie) {
        const Ke = I(Qe);
        if (!Ke) return;
        _e.push(Ke.x, Ke.y, Ke.z);
      }
      ie.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : ie.length === 3 && Ce.push(0, 1, 2);
      const Ye = new Ve();
      Ye.setAttribute("position", new It(_e, 3)), Ye.setIndex(Ce), Ye.computeVertexNormals();
      const Le = new dt(Ye, ge);
      Le.renderOrder = 101, de.add(Le);
    } else if (D.type === "solid" && re) {
      const ie = re[D.idx], _e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Qe, Ke] of _e) {
        const ze = I(ie[Qe]), Ne = I(ie[Ke]);
        ze && Ne && Ce.push(ze.x, ze.y, ze.z, Ne.x, Ne.y, Ne.z);
      }
      const Ye = new Ve();
      Ye.setAttribute("position", new It(Ce, 3));
      const Le = new nn(Ye, me);
      Le.renderOrder = 101, de.add(Le);
    }
  }
  function nt() {
    if (Pe(), !xe.length || !t.mesh) {
      t.render();
      return;
    }
    const D = t.derivedNodes.rawVal ?? [];
    if (D.length >= 2) {
      const O = [1 / 0, 1 / 0, 1 / 0], re = [-1 / 0, -1 / 0, -1 / 0];
      for (const ie of D) for (let _e = 0; _e < 3; _e++) ie[_e] < O[_e] && (O[_e] = ie[_e]), ie[_e] > re[_e] && (re[_e] = ie[_e]);
      Math.max(re[0] - O[0], re[1] - O[1], re[2] - O[2], 0.1);
    }
    for (const O of xe) Ae(O);
    t.render();
  }
  function st(D, O) {
    const re = xe.findIndex((ie) => ie.type === D.type && ie.idx === D.idx);
    re >= 0 ? xe.splice(re, 1) : O || xe.push(D), G = xe.length ? xe[xe.length - 1] : null, window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: G } }));
  }
  function Ue() {
    xe.length = 0, G = null, nt();
  }
  return ue.derive(() => {
    t.derivedNodes.val, xe.length && nt();
  }), y;
}
function xl(t, y, g, k, S, A) {
  const z = S - g, E = A - k, P = z * z + E * E;
  if (P < 1e-9) {
    const we = t - g, Q = y - k;
    return Math.sqrt(we * we + Q * Q);
  }
  let V = ((t - g) * z + (y - k) * E) / P;
  V = Math.max(0, Math.min(1, V));
  const N = g + V * z, B = k + V * E, ee = t - N, X = y - B;
  return Math.sqrt(ee * ee + X * X);
}
function gl(t, y, g) {
  let k = false;
  for (let S = 0, A = g.length - 1; S < g.length; A = S++) {
    const z = g[S].x, E = g[S].y, P = g[A].x, V = g[A].y;
    E > y != V > y && t < (P - z) * (y - E) / (V - E + 1e-12) + z && (k = !k);
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
  }, E = g[S[0]], P = g[S[1]], V = z("elasticities"), N = z("shearModuli"), B = z("areas"), ee = z("momentsOfInertiaZ"), X = z("momentsOfInertiaY"), we = z("torsionalConstants");
  let Q = z("shearAreasY"), Z = z("shearAreasZ");
  const ae = Math.hypot(P[0] - E[0], P[1] - E[1], P[2] - E[2]), se = Q < -1e-15, ge = Z < -1e-15;
  !se && Q < 1e-15 && B > 1e-15 && N > 1e-15 && (Q = 5 / 6 * B), !ge && Z < 1e-15 && B > 1e-15 && N > 1e-15 && (Z = 5 / 6 * B);
  const me = !ge && Z > 0 && N > 0 ? 12 * V * ee / (N * Z * ae * ae) : 0, xe = !se && Q > 0 && N > 0 ? 12 * V * X / (N * Q * ae * ae) : 0, de = V * B / ae, G = N * we / ae, U = 12 * V * ee / ae ** 3 / (1 + me), I = 6 * V * ee / ae ** 2 / (1 + me), q = 4 * V * ee / ae * (1 + me / 4) / (1 + me), Y = 2 * V * ee / ae * (1 - me / 2) / (1 + me), R = 12 * V * X / ae ** 3 / (1 + xe), J = 6 * V * X / ae ** 2 / (1 + xe), pe = 4 * V * X / ae * (1 + xe / 4) / (1 + xe), fe = 2 * V * X / ae * (1 - xe / 2) / (1 + xe);
  let oe = [[de, 0, 0, 0, 0, 0, -de, 0, 0, 0, 0, 0], [0, U, 0, 0, 0, I, 0, -U, 0, 0, 0, I], [0, 0, R, 0, -J, 0, 0, 0, -R, 0, -J, 0], [0, 0, 0, G, 0, 0, 0, 0, 0, -G, 0, 0], [0, 0, -J, 0, pe, 0, 0, 0, J, 0, fe, 0], [0, I, 0, 0, 0, q, 0, -I, 0, 0, 0, Y], [-de, 0, 0, 0, 0, 0, de, 0, 0, 0, 0, 0], [0, -U, 0, 0, 0, -I, 0, U, 0, 0, 0, -I], [0, 0, -R, 0, J, 0, 0, 0, R, 0, J, 0], [0, 0, 0, -G, 0, 0, 0, 0, 0, G, 0, 0], [0, 0, -J, 0, fe, 0, 0, 0, J, 0, pe, 0], [0, I, 0, 0, 0, Y, 0, -I, 0, 0, 0, q]];
  const K = (_e = (_d = A.partialFixitySprings) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, y);
  if (K) for (let te = 0; te < Math.min(12, K.length); te++) K[te] > 1e-12 && (oe[te][te] += K[te]);
  const Me = (_g = (_f = A.momentReleases) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, y);
  if (Me && Me.some(Boolean)) {
    const te = Me.length >= 12 ? Me.slice(0, 12).map((Ae, nt) => Ae ? nt : -1).filter((Ae) => Ae >= 0) : Me.slice(0, 6).map((Ae, nt) => Ae ? [3, 4, 5, 9, 10, 11][nt] : -1).filter((Ae) => Ae >= 0), Ie = [...Array(12).keys()].filter((Ae) => !te.includes(Ae)), be = te.length, ve = te.map((Ae, nt) => [...te.map((st) => oe[Ae][st]), ...te.map((st, Ue) => nt === Ue ? 1 : 0)]);
    for (let Ae = 0; Ae < be; Ae++) {
      let nt = Ae;
      for (let Ue = Ae + 1; Ue < be; Ue++) Math.abs(ve[Ue][Ae]) > Math.abs(ve[nt][Ae]) && (nt = Ue);
      [ve[Ae], ve[nt]] = [ve[nt], ve[Ae]];
      const st = ve[Ae][Ae];
      for (let Ue = 0; Ue < 2 * be; Ue++) ve[Ae][Ue] /= st;
      for (let Ue = 0; Ue < be; Ue++) if (Ue !== Ae) {
        const D = ve[Ue][Ae];
        for (let O = 0; O < 2 * be; O++) ve[Ue][O] -= D * ve[Ae][O];
      }
    }
    const Pe = ve.map((Ae) => Ae.slice(be)), Xe = Array.from({ length: 12 }, () => Array(12).fill(0));
    for (const Ae of Ie) for (const nt of Ie) {
      let st = 0;
      for (let Ue = 0; Ue < be; Ue++) for (let D = 0; D < be; D++) st += oe[Ae][te[Ue]] * Pe[Ue][D] * oe[te[D]][nt];
      Xe[Ae][nt] = oe[Ae][nt] - st;
    }
    oe = Xe;
  }
  return { K: oe, L: ae, phiZ: me, phiY: xe };
}
function zs(t, y) {
  var _a, _b, _c, _d, _e, _f, _g;
  const g = ((_a = t.nodes) == null ? void 0 : _a.rawVal) ?? [], S = (((_b = t.elements) == null ? void 0 : _b.rawVal) ?? [])[y];
  if (!S || S.length !== 2) throw new Error(`El elemento ${y} no es una barra (2 nudos).`);
  const A = ((_c = t.elementInputs) == null ? void 0 : _c.rawVal) ?? {}, z = (we, Q = 0) => {
    var _a2, _b2;
    return ((_b2 = (_a2 = A[we]) == null ? void 0 : _a2.get) == null ? void 0 : _b2.call(_a2, y)) ?? Q;
  }, E = g[S[0]], P = g[S[1]], V = (_e = (_d = A.momentReleases) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, y), N = (_g = (_f = A.partialFixitySprings) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, y), B = z("localAngles", 0), ee = [], X = (we = "") => ee.push(we);
  if (X("% ============================================================"), X(`%  MATRIZ DE RIGIDEZ LOCAL 12x12 - barra ${y + 1} (indice ${y} del motor)`), X("%  Generado por Hekatan Struct con los datos que recibe el motor."), X("%  Formula = hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"), X("%  GDL: 1-6 nudo i [u1 u2 u3 t1 t2 t3], 7-12 nudo j. Unidades del modelo (kN, m)."), X("% ============================================================"), X(), X("% --- Datos de la barra -------------------------------------------------"), X(`xi = [${E.map(cn).join(" ")}];      % nudo i (${S[0]})`), X(`xj = [${P.map(cn).join(" ")}];      % nudo j (${S[1]})`), X(`E  = ${cn(z("elasticities"))};      % modulo de elasticidad`), X(`G  = ${cn(z("shearModuli"))};      % modulo de cortante`), X(`A  = ${cn(z("areas"))};      % area`), X(`Iz = ${cn(z("momentsOfInertiaZ"))};      % I33: flexion en el plano 1-2 (V2, M3)`), X(`Iy = ${cn(z("momentsOfInertiaY"))};      % I22: flexion en el plano 1-3 (V3, M2)`), X(`J  = ${cn(z("torsionalConstants"))};      % constante de torsion`), X(`AsY = ${cn(z("shearAreasY"))};     % area de cortante asociada a Iy (0 = 5/6*A, <0 = Bernoulli)`), X(`AsZ = ${cn(z("shearAreasZ"))};     % area de cortante asociada a Iz (0 = 5/6*A, <0 = Bernoulli)`), B && X(`% ang = ${cn(B)} grados: gira la seccion en T, NO cambia esta matriz local.`), X(), X("L = sqrt(sum((xj - xi).^2));"), X(), X("% --- Timoshenko: phi = 12EI/(G*As*L^2) --------------------------------"), X("bernY = AsY < 0;   bernZ = AsZ < 0;"), X("if ~bernY && AsY < 1e-15 && A > 1e-15 && G > 1e-15, AsY = 5/6*A; end"), X("if ~bernZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15, AsZ = 5/6*A; end"), X("phiZ = 0;  if ~bernZ && AsZ > 0 && G > 0, phiZ = 12*E*Iz/(G*AsZ*L^2); end"), X("phiY = 0;  if ~bernY && AsY > 0 && G > 0, phiY = 12*E*Iy/(G*AsY*L^2); end"), X(), X("EA_L = E*A/L;          % axial"), X("GJ_L = G*J/L;          % torsion"), X("tz = (12*E*Iz/L^3)/(1+phiZ);             bz = (6*E*Iz/L^2)/(1+phiZ);"), X("kz = (4*E*Iz/L)*(1+phiZ/4)/(1+phiZ);     az = (2*E*Iz/L)*(1-phiZ/2)/(1+phiZ);"), X("ty = (12*E*Iy/L^3)/(1+phiY);             by = (6*E*Iy/L^2)/(1+phiY);"), X("ky = (4*E*Iy/L)*(1+phiY/4)/(1+phiY);     ay = (2*E*Iy/L)*(1-phiY/2)/(1+phiY);"), X(), X("% --- Matriz local (misma disposicion que el C++) ----------------------"), X("K = [ EA_L   0    0    0     0    0   -EA_L   0    0    0     0    0 ;"), X("       0    tz   0    0     0   bz     0   -tz   0    0     0   bz ;"), X("       0    0   ty    0   -by    0     0    0  -ty    0   -by    0 ;"), X("       0    0    0  GJ_L    0    0     0    0    0 -GJ_L    0    0 ;"), X("       0    0  -by    0    ky    0     0    0   by    0    ay    0 ;"), X("       0   bz    0    0     0   kz     0  -bz    0    0     0   az ;"), X("     -EA_L  0    0    0     0    0    EA_L   0    0    0     0    0 ;"), X("       0  -tz    0    0     0  -bz     0   tz    0    0     0  -bz ;"), X("       0    0  -ty    0    by    0     0    0   ty    0    by    0 ;"), X("       0    0    0 -GJ_L    0    0     0    0    0  GJ_L    0    0 ;"), X("       0    0  -by    0    ay    0     0    0   by    0    ky    0 ;"), X("       0   bz    0    0     0   az     0  -bz    0    0     0   kz ];"), N && N.some((we) => we > 1e-12) && (X(), X("% --- Muelles de empotramiento parcial (se suman a la diagonal) --------"), X(`kres = [${N.slice(0, 12).map(cn).join(" ")}];`), X("for i = 1:numel(kres), if kres(i) > 1e-12, K(i,i) = K(i,i) + kres(i); end, end")), V && V.some(Boolean)) {
    const we = V.length >= 12 ? V.slice(0, 12).map((Q, Z) => Q ? Z + 1 : 0).filter(Boolean) : V.slice(0, 6).map((Q, Z) => Q ? [4, 5, 6, 10, 11, 12][Z] : 0).filter(Boolean);
    X(), X("% --- Liberaciones: condensacion estatica  Kc = Krr - Krf*inv(Kff)*Kfr --"), X(`f = [${we.join(" ")}];              % GDL liberados`), X("r = setdiff(1:12, f);                % GDL que quedan"), X("Kc = zeros(12);"), X("Kc(r,r) = K(r,r) - K(r,f) * inv(K(f,f)) * K(f,r);"), X("K = Kc;");
  }
  return X(), X("% --- Resultado ---------------------------------------------------------"), X(`fprintf('Barra ${y + 1}:  L = %.4f   phiZ = %.6f   phiY = %.6f\\n', L, phiZ, phiY);`), X("disp('K local (12x12):');"), X("disp(K);"), { nombre: `K_local_barra_${y + 1}.m`, texto: ee.join(`
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
    const G = ((_a2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _a2.rawVal) ?? ((_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.val);
    return !G || G === "none" ? null : String(G).replace(/^contour:/, "");
  }, A = (G) => {
    var _a2, _b2;
    const U = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], I = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Set();
    for (const Y of I) {
      if (Y.length !== 2) continue;
      const R = U[Y[0]], J = U[Y[1]];
      if (!R || !J) continue;
      const pe = bo(R, G), fe = bo(J, G);
      Math.abs(pe.fuera - fe.fuera) < Ln && q.add(Math.round(pe.fuera * 1e3) / 1e3);
    }
    return [...q].sort((Y, R) => Y - R);
  };
  function z(G) {
    var _a2, _b2;
    if (G == null ? void 0 : G.plano) k = { plano: G.plano, en: G.en ?? A(G.plano)[0] ?? 0 };
    else {
      const I = [...window.__hekatanModelSelection ?? []].reverse().find((R) => R.type === "frame"), q = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], Y = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      I && Y[I.idx] && q[Y[I.idx][0]] && q[Y[I.idx][1]] ? k = vl(q[Y[I.idx][0]], q[Y[I.idx][1]]) : k = { plano: "XZ", en: A("XZ")[0] ?? 0 };
    }
    g || E(), g.hidden = false, P();
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
      const R = document.createElement("style");
      R.id = "hk-d2-hidden-css", R.textContent = "#hk-diagrama-2d[hidden]{display:none !important;}", document.head.appendChild(R);
    }
    g.querySelector(".hk-d2-x").addEventListener("click", () => {
      g.hidden = true;
    });
    const G = g.querySelector(".hk-d2-plano"), U = g.querySelector(".hk-d2-en");
    G.addEventListener("change", () => {
      k = { plano: G.value, en: A(G.value)[0] ?? 0 }, P();
    }), U.addEventListener("change", () => {
      k.en = Number(U.value), P();
    });
    const I = (R) => {
      const J = A(k.plano), pe = J.findIndex((oe) => Math.abs(oe - k.en) < Ln), fe = Math.max(0, Math.min(J.length - 1, (pe < 0 ? 0 : pe) + R));
      J.length && (k.en = J[fe], P());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => I(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => I(1));
    const q = g.querySelector(".hk-d2-bar");
    let Y = null;
    q.addEventListener("pointerdown", (R) => {
      if (R.target.closest("select,button")) return;
      const J = g.getBoundingClientRect();
      Y = { x: R.clientX, y: R.clientY, l: J.left, t: J.top }, g.style.transform = "none", g.style.left = J.left + "px", g.style.top = J.top + "px";
    }), window.addEventListener("pointermove", (R) => {
      !Y || !g || (g.style.left = Y.l + R.clientX - Y.x + "px", g.style.top = Y.t + R.clientY - Y.y + "px");
    }), window.addEventListener("pointerup", () => {
      Y = null;
    }), new ResizeObserver(() => {
      g && !g.hidden && P();
    }).observe(g);
  }
  function P() {
    var _a2, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const G = new Set(B && !B.hidden && ee >= 0 ? we(ee) : []), U = g.querySelector(".hk-d2-svg"), I = g.querySelector(".hk-d2-tit"), q = g.querySelector(".hk-d2-pie"), Y = g.querySelector(".hk-d2-plano"), R = g.querySelector(".hk-d2-en");
    Y.value = k.plano;
    const J = A(k.plano), pe = k.plano === "XZ" ? "y" : k.plano === "YZ" ? "x" : "z", fe = k.plano === "XY" ? "Planta" : "P\xF3rtico";
    R.innerHTML = J.map((Te, ot) => `<option value="${Te}" ${Math.abs(Te - k.en) < Ln ? "selected" : ""}>${fe} ${ot + 1} \xB7 ${pe} = ${Te.toFixed(2)} m</option>`).join("");
    const oe = S(), K = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], Me = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], te = oe ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[oe] : null;
    U.innerHTML = "";
    const Ie = U.clientWidth || 880, be = U.clientHeight || 480, ve = [];
    if (Me.forEach((Te, ot) => {
      if (Te.length !== 2) return;
      const je = K[Te[0]], Fe = K[Te[1]];
      if (!je || !Fe) return;
      const De = bo(je, k.plano), We = bo(Fe, k.plano);
      Math.abs(De.fuera - k.en) < Ln && Math.abs(We.fuera - k.en) < Ln && ve.push({ i: ot, a: De, b: We });
    }), !ve.length) {
      q.textContent = "No hay barras en este plano.", I.textContent = "";
      return;
    }
    let Pe = 1 / 0, Xe = -1 / 0, Ae = 1 / 0, nt = -1 / 0;
    for (const Te of ve) for (const ot of [Te.a, Te.b]) Pe = Math.min(Pe, ot.u), Xe = Math.max(Xe, ot.u), Ae = Math.min(Ae, ot.v), nt = Math.max(nt, ot.v);
    const st = Xe - Pe || 1, Ue = nt - Ae || 1, D = 0.12 * Math.max(st, Ue), O = 46, re = Math.min((Ie - 2 * O) / (st + 2 * D), (be - 2 * O) / (Ue + 2 * D)), ie = (Ie - st * re) / 2, _e = (be - Ue * re) / 2, Ce = (Te) => ie + (Te - Pe) * re, Ye = (Te) => be - (_e + (Te - Ae) * re), Le = "http://www.w3.org/2000/svg", Qe = (Te, ot, je) => {
      const Fe = document.createElementNS(Le, Te);
      for (const De in ot) Fe.setAttribute(De, String(ot[De]));
      return je != null && (Fe.textContent = je), U.appendChild(Fe), Fe;
    }, Ke = /* @__PURE__ */ new Map();
    for (const Te of ve) {
      const ot = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Te.i)) ?? 0, je = bo(Ns(oe ?? "normals", Bs(K[Me[Te.i][0]], K[Me[Te.i][1]], ot)), k.plano), Fe = Math.hypot(je.u, je.v);
      Ke.set(Te.i, Fe > 0.3 ? [je.u / Fe, -je.v / Fe] : null);
    }
    const ze = ve.filter((Te) => !Ke.get(Te.i)).length;
    let Ne = 0;
    if (te) for (const Te of ve) {
      if (!Ke.get(Te.i)) continue;
      const ot = te instanceof Map ? te.get(Te.i) : te[Te.i];
      ot && (Ne = Math.max(Ne, Math.abs(ot[0] ?? 0), Math.abs(ot[1] ?? 0)));
    }
    const Ge = 0.12 * Math.max(st, Ue) * re, rt = Ne > 0 ? Ge / Ne : 0, et = oe === "bendingsY" || oe === "bendingsZ", Mt = (Te) => Math.abs(Te) >= 100 ? Te.toFixed(1) : Math.abs(Te) >= 10 ? Te.toFixed(2) : Te.toFixed(3), gt = [];
    for (const Te of ve) {
      const ot = Ce(Te.a.u), je = Ye(Te.a.v), Fe = Ce(Te.b.u), De = Ye(Te.b.v), We = Ke.get(Te.i), [Be, at] = We ?? [0, 0], lt = te && We ? te instanceof Map ? te.get(Te.i) : te[Te.i] : null, [ht, tt] = lt ? $a(oe, lt) : [0, 0];
      if (lt && rt > 0) {
        const Kt = [ot + Be * ht * rt * 1, je + at * ht * rt * 1], St = [Fe + Be * tt * rt * 1, De + at * tt * rt * 1], zt = ht + tt >= 0 ? "#3fa7d6" : "#d9534f";
        Qe("polygon", { points: `${ot},${je} ${Kt[0]},${Kt[1]} ${St[0]},${St[1]} ${Fe},${De}`, fill: zt, "fill-opacity": 0.38, stroke: zt, "stroke-width": 1.2 }), gt.push({ x: Kt[0] + Be * 12, y: Kt[1] + at * 12, t: Mt(ht), peso: Math.abs(ht) }), gt.push({ x: St[0] + Be * 12, y: St[1] + at * 12, t: Mt(tt), peso: Math.abs(tt) });
      }
      Qe("line", { x1: ot, y1: je, x2: Fe, y2: De, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), G.has(Te.i) && Qe("line", { x1: ot, y1: je, x2: Fe, y2: De, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
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
    I.textContent = `${kt} \xB7 ${k.plano === "XY" ? "planta" : "alzado"} ${k.plano} en ${pe} = ${k.en.toFixed(2)} m`, q.textContent = oe ? `${ve.length} barras en el plano \xB7 m\xE1ximo ${Mt(Ne)} ${Ml[oe] ?? ""}` + (et ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ze ? ` \xB7 ${ze} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const V = () => {
    try {
      P();
    } catch {
    }
  };
  (y == null ? void 0 : y.frameResults) && ((_b = (_a = window.van) == null ? void 0 : _a.derive) == null ? void 0 : _b.call(_a, () => {
    y.frameResults.val, V();
  }));
  let N = null;
  setInterval(() => {
    var _a2, _b2;
    const G = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal, U = (_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.rawVal, I = [G, U];
    if (!(N && N[0] === G && N[1] === U)) {
      N = I, V();
      try {
        ae();
      } catch {
      }
    }
  }, 400);
  let B = null, ee = -1, X = "12";
  function we(G) {
    var _a2, _b2;
    const U = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], I = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Map();
    I.forEach((pe, fe) => {
      if (pe.length === 2) for (const oe of pe) q.has(oe) || q.set(oe, []), q.get(oe).push(fe);
    });
    const Y = (pe) => {
      const fe = U[I[pe][0]], oe = U[I[pe][1]], K = [oe[0] - fe[0], oe[1] - fe[1], oe[2] - fe[2]], Me = Math.hypot(K[0], K[1], K[2]) || 1;
      return K.map((te) => te / Me);
    }, R = (pe, fe) => {
      const oe = Y(pe), K = Y(fe);
      return Math.abs(oe[0] * K[0] + oe[1] * K[1] + oe[2] * K[2]) > 0.9999;
    }, J = [G];
    for (const pe of [0, 1]) {
      let fe = G, oe = I[G][pe];
      for (let K = 0; K < 500; K++) {
        const Me = (q.get(oe) ?? []).filter((Ie) => Ie !== fe);
        if (Me.length !== 1 || !R(fe, Me[0])) break;
        const te = Me[0];
        pe === 0 ? J.unshift(te) : J.push(te), oe = I[te][0] === oe ? I[te][1] : I[te][0], fe = te;
      }
    }
    return J;
  }
  function Q(G) {
    if (G == null) {
      const I = [...window.__hekatanModelSelection ?? []].reverse().find((q) => q.type === "frame");
      if (!I) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      G = I.idx;
    }
    ee = G, B || (B = document.createElement("div"), B.id = "hk-diagrama-barra", B.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), B.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-k" title="Descarga un script MATLAB (Hekatan Lab / Octave) con la matriz de rigidez local 12\xD712 de esta barra" style="background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px;white-space:nowrap">\u{1F4C4} K local .m</button><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(B), B.querySelector(".hk-b-x").addEventListener("click", () => {
      B.hidden = true, Z(), P();
    }), B.querySelector(".hk-b-k").addEventListener("click", () => {
      ee >= 0 && se(ee);
    }), B.querySelector(".hk-b-pl").addEventListener("change", (U) => {
      X = U.target.value, ae();
    })), B.hidden = false, Z(), ae(), P();
  }
  function Z() {
    if (!g || !B) return;
    const G = window.innerWidth, U = Math.min(560, Math.round(G * 0.4));
    B.style.width = U + "px", !B.hidden && !g.hidden ? (g.style.transform = "none", g.style.left = "12px", g.style.width = G - U - 36 + "px", B.style.top = g.getBoundingClientRect().top + "px") : g.hidden || (g.style.left = "50%", g.style.transform = "translateX(-50%)", g.style.width = "min(900px,92vw)");
  }
  function ae() {
    var _a2, _b2, _c;
    if (!B || B.hidden || ee < 0) return;
    const G = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], U = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], I = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!U[ee]) return;
    const q = we(ee), Y = [];
    let R = 0, J = -1;
    q.forEach((Xe, Ae) => {
      const [nt, st] = U[Xe], Ue = Ae === 0 ? q.length > 1 && U[q[1]].includes(nt) : nt !== J, D = Ue ? st : nt, O = Ue ? nt : st, re = Math.hypot(G[O][0] - G[D][0], G[O][1] - G[D][1], G[O][2] - G[D][2]);
      Y.push({ x: R, e: Xe, fin: Ue ? 1 : 0 }), R += re, Y.push({ x: R, e: Xe, fin: Ue ? 0 : 1 }), J = O;
    });
    const pe = R, fe = (Xe, Ae) => {
      const nt = I[Xe], st = nt ? nt instanceof Map ? nt.get(Ae.e) : nt[Ae.e] : null;
      return st ? $a(Xe, st)[Ae.fin] : 0;
    }, oe = G[U[q[0]][0]], K = (Xe) => Xe.toFixed(2);
    B.querySelector(".hk-b-tit").textContent = "L = " + pe.toFixed(2) + " m \xB7 " + q.length + " tramo(s) \xB7 desde (" + K(oe[0]) + ", " + K(oe[1]) + ", " + K(oe[2]) + ")";
    const Me = X === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], te = B.querySelector(".hk-b-cuerpo");
    te.innerHTML = "";
    const Ie = Math.max(300, te.clientWidth), be = 124, ve = 46, Pe = (be - 14) / 2;
    for (const [Xe, Ae, nt, st] of Me) {
      const Ue = Y.map((Ne) => fe(Xe, Ne)), D = Math.max(...Ue), O = Math.min(...Ue), re = Math.max(Math.abs(D), Math.abs(O)) || 1, ie = (Ne) => ve + Ne / (pe || 1) * (Ie - 2 * ve), _e = (Ne) => Pe + (st ? 1 : -1) * (Ne / re) * (Pe - 16), Ce = (Ne) => Math.abs(Ne) >= 100 ? Ne.toFixed(1) : Math.abs(Ne) >= 10 ? Ne.toFixed(2) : Ne.toFixed(3);
      let Ye = ie(0) + "," + Pe + " ";
      Y.forEach((Ne, Ge) => {
        Ye += ie(Ne.x) + "," + _e(Ue[Ge]) + " ";
      }), Ye += ie(pe) + "," + Pe;
      const Le = Ue.indexOf(D), Qe = Ue.indexOf(O), Ke = (Ne, Ge) => {
        const rt = _e(Ue[Ne]) + (_e(Ue[Ne]) < Pe ? -5 : 13);
        return '<text x="' + ie(Y[Ne].x) + '" y="' + rt + '" text-anchor="middle" fill="' + Ge + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + Ce(Ue[Ne]) + "</text>";
      }, ze = st ? "#d9534f" : "#3fa7d6";
      te.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Ae + ' <span style="color:#6f7d90;font-weight:400">(' + nt + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + Ce(D) + " \xB7 m\xEDn " + Ce(O) + (st ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + Ie + '" height="' + be + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + ve + '" y1="' + Pe + '" x2="' + (Ie - ve) + '" y2="' + Pe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + Ye + '" fill="' + ze + '" fill-opacity=".35" stroke="' + ze + '" stroke-width="1.4"/>' + Ke(0, "#f2f5fa") + Ke(Y.length - 1, "#f2f5fa") + (Le > 0 && Le < Y.length - 1 ? Ke(Le, "#8fd3ff") : "") + (Qe > 0 && Qe < Y.length - 1 && Qe !== Le ? Ke(Qe, "#ff9f9a") : "") + '<text x="' + ve + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (Ie - ve) + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + pe.toFixed(2) + " m</text></svg>");
    }
  }
  window.__hekatanDiagramaBarra = Q;
  function se(G) {
    const { nombre: U, texto: I } = zs(t, G), q = URL.createObjectURL(new Blob([I], { type: "text/plain" })), Y = document.createElement("a");
    Y.href = q, Y.download = U, document.body.appendChild(Y), Y.click(), setTimeout(() => {
      URL.revokeObjectURL(q), Y.remove();
    }, 1e3);
  }
  window.__hekatanKLocalMatlab = (G, U = false) => {
    if (G == null) {
      const q = [...window.__hekatanModelSelection ?? []].reverse().find((Y) => Y.type === "frame");
      if (!q) return null;
      G = q.idx;
    }
    return U && se(G), zs(t, G);
  };
  let ge = null, me = null, xe = -1;
  function de(G) {
    var _a2, _b2, _c, _d, _e;
    if (xe = G, !me) {
      me = document.createElement("div"), me.id = "hk-klocal", me.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);width:min(1100px,96vw);max-height:80vh;overflow:auto;z-index:9992;background:#0b0e14;border:1px solid #2f3b50;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:12px 'Segoe UI',system-ui,sans-serif;color:#c9d3e0", document.body.appendChild(me);
      const oe = document.createElement("style");
      oe.textContent = "#hk-klocal[hidden]{display:none!important}", document.head.appendChild(oe);
    }
    let U;
    try {
      U = Ps(t, G);
    } catch (oe) {
      alert(String(oe));
      return;
    }
    const I = (oe) => Math.abs(oe) < 1e-12 ? "0" : Math.abs(oe) >= 1e5 || Math.abs(oe) < 0.01 ? oe.toExponential(4) : oe.toPrecision(6), q = ((_a2 = t.elementInputs) == null ? void 0 : _a2.rawVal) ?? {}, Y = (_c = (_b2 = q.rigidOffsets) == null ? void 0 : _b2.get) == null ? void 0 : _c.call(_b2, G), R = (_e = (_d = q.localAngles) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d, G), J = [Y && (Y[0] > 1e-12 || Y[1] > 1e-12) ? `brazos r\xEDgidos ${Y[0]}\xB7L / ${Y[1]}\xB7L (se aplican en K global: R\u1D40\xB7K\xB7R)` : "", R ? `ang ${R}\xB0 (gira T, no esta K)` : ""].filter(Boolean).join(" \xB7 "), pe = ["u1 i", "u2 i", "u3 i", "\u03B81 i", "\u03B82 i", "\u03B83 i", "u1 j", "u2 j", "u3 j", "\u03B81 j", "\u03B82 j", "\u03B83 j"], fe = U.K.map((oe, K) => `<tr><th style="color:#9fb0c6;padding:2px 6px;text-align:right">${pe[K]}</th>` + oe.map((Me) => `<td style="padding:2px 6px;text-align:right;color:${Math.abs(Me) < 1e-12 ? "#4a5568" : Me < 0 ? "#ff9f9a" : "#e6edf5"}">${I(Me)}</td>`).join("") + "</tr>").join("");
    me.innerHTML = `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463">K local \xB7 barra ${G + 1}</b><span style="color:#9fb0c6">L = ${U.L.toFixed(3)} m \xB7 \u03C6\u2082 = ${U.phiZ.toFixed(5)} \xB7 \u03C6\u2083 = ${U.phiY.toFixed(5)} \xB7 getLocalStiffnessMatrix (motor)${J ? ` \xB7 <b style="color:#f59e0b">${J}</b>` : ""}</span><button class="hk-k-m" style="margin-left:auto;background:#1b2230;color:#e6c463;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:2px 8px">\u{1F4C4} Script MATLAB (.m)</button><button class="hk-k-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div style="overflow-x:auto;padding:8px"><table style="border-collapse:collapse;font-family:Consolas,monospace;font-size:11px"><tr><th></th>${pe.map((oe) => `<th style="color:#9fb0c6;padding:2px 6px">${oe}</th>`).join("")}</tr>${fe}</table></div>`, me.querySelector(".hk-k-x").addEventListener("click", () => {
      me.hidden = true;
    }), me.querySelector(".hk-k-m").addEventListener("click", () => se(xe)), me.hidden = false;
  }
  return window.addEventListener("hk:model-selection", (G) => {
    var _a2;
    const U = (_a2 = G.detail) == null ? void 0 : _a2.ultimo;
    ge || (ge = document.createElement("button"), ge.id = "hk-klocal-chip", ge.style.cssText = "position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:9989;background:#141a24;color:#e6c463;border:1px solid #e6c463;border-radius:16px;padding:5px 14px;font:600 12px 'Segoe UI',system-ui;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)", document.body.appendChild(ge), ge.addEventListener("click", () => {
      const I = Number(ge.dataset.idx);
      I >= 0 && de(I);
    })), ge.hidden = true, U && U.type === "frame" && (ge.dataset.idx = String(U.idx), ge.textContent = "\u{1F4D0} Ver K local \xB7 barra " + (U.idx + 1), me && (me.hidden = true), ge.hidden = false);
  }), window.__hekatanKLocal = (G) => Ps(t, G), window.__hekatanMallaK = t, window.__hekatanDiagrama2D = z, { abrir: z, abrirBarra: Q };
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
  const S = Array.from({ length: y + 1 }, (P, V) => V / y).reverse();
  let A, z;
  S.forEach((P, V) => {
    A = document.createElement("div"), A.id = `marker-${V}`, A.className = "marker", A.style.marginTop = V == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", z = document.createElement("p"), z.id = `marker-text-${V}`, A.append(z), g.append(A);
  });
  const E = [];
  return g.querySelectorAll("p").forEach((P) => E.push(P)), setTimeout(() => {
    ue.derive(() => {
      S.forEach((P, V) => {
        const N = E[V];
        N && (N.innerText = kl(t.val, P).toString());
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
  const A = document.createElement("div"), z = new zi(), E = new Ci(45, 1, 0.1, 2 * 1e6), P = new Ai(-10, 10, 10, -10, -1e3, 2e6);
  let V = E;
  const N = new Fi({ antialias: true });
  N.localClippingEnabled = true;
  const B = new vs(E, N.domElement);
  B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.keyPanSpeed = 12, B.listenToKeyEvents(window), B.touches = { ONE: Go.ROTATE, TWO: Go.DOLLY_PAN }, N.domElement.addEventListener("wheel", (D) => {
    if (!D.ctrlKey && Math.abs(D.deltaX) > Math.abs(D.deltaY) * 1.5) {
      D.preventDefault();
      const O = B.target, re = new F().subVectors(E.position, O), ie = new F();
      ie.crossVectors(E.up, re).normalize();
      const Ce = re.length() * 1e-3 * B.panSpeed;
      O.addScaledVector(ie, D.deltaX * Ce), E.position.addScaledVector(ie, D.deltaX * Ce), B.update();
    }
  }, { passive: false });
  const ee = new vo(new F(-1, 0, 0), 0), X = new vo(new F(0, -1, 0), 0), we = new vo(new F(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function Q() {
    const D = window.__hekatanClip, O = [];
    D.enableX && (ee.normal.set(D.invertX ? 1 : -1, 0, 0), ee.constant = D.invertX ? -D.posX : D.posX, O.push(ee)), D.enableY && (X.normal.set(0, D.invertY ? 1 : -1, 0), X.constant = D.invertY ? -D.posY : D.posY, O.push(X)), D.enableZ && (we.normal.set(0, 0, D.invertZ ? 1 : -1), we.constant = D.invertZ ? -D.posZ : D.posZ, O.push(we)), N.clippingPlanes = O, z.traverse((ie) => {
      const _e = ie;
      if (_e.material) {
        const Ce = Array.isArray(_e.material) ? _e.material : [_e.material];
        for (const Ye of Ce) Ye.clippingPlanes = O, Ye.needsUpdate = true;
      }
    });
    const re = window.__hekatanPanes ?? [];
    for (const ie of re) try {
      ie && typeof ie.refresh == "function" && ie.refresh();
    } catch {
    }
    N.render(z, V);
  }
  Q(), window.__hekatanClipApply = Q;
  const Z = Ti(y), ae = ue.derive(() => Math.pow(10, Z.displayScale.val / 10)), se = Sl(t, Z), ge = () => {
    const D = [];
    return Z.gridXY.rawVal && D.push("xy"), Z.gridXZ.rawVal && D.push("xz"), Z.gridYZ.rawVal && D.push("yz"), D;
  }, me = () => {
    const D = Z.gridStep.rawVal, O = Math.max(D, Z.gridMajor.rawVal);
    return { planes: ge(), majorStep: O, minorStep: D };
  };
  let xe = Ca(Z.gridSize.rawVal, me());
  xe.visible = Z.gridVisible.rawVal, window.__hekatanSnap2D = Z.cursorSnap.rawVal;
  const de = () => {
    const D = Math.max(0, Math.min(1, Z.gridOpacity.rawVal));
    xe.traverse((O) => {
      const re = O.material;
      if (!re || !("opacity" in re)) return;
      const ie = O.name ?? "";
      let _e = 0.55;
      ie.includes("border") ? _e = 1 : ie.includes("major") && (_e = 0.95), re.opacity = D * _e;
    });
  };
  de(), A.appendChild(Ri(Z, t, S)), A.setAttribute("id", "viewer"), A.appendChild(N.domElement), N.setPixelRatio(window.devicePixelRatio);
  const G = qn();
  N.setClearColor(G.background, 1);
  const U = Z.gridSize.rawVal, I = U * 0.5 + U * 0.5 / Math.tan(45 * 0.5);
  E.position.set(0, 0, I), E.up.set(0, 1, 0), B.target.set(0, 0, 0), B.minDistance = 0.1, B.maxDistance = 1e4, A.__settings = Z, B.zoomSpeed = 1, B._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, B.update();
  let q = ks(Z.gridSize.rawVal, Z.flipAxes.rawVal);
  z.add(xe, q), ue.derive(() => {
    window.__hekatanGridPlaneXY = Z.gridXY.val, window.__hekatanGridPlaneXZ = Z.gridXZ.val, window.__hekatanGridPlaneYZ = Z.gridYZ.val;
  });
  let Y = true;
  ue.derive(() => {
    const D = Z.gridVisible.val;
    if (Y) {
      Y = false;
      return;
    }
    xe.visible = D, te();
  });
  let R = true;
  ue.derive(() => {
    if (Z.gridOpacity.val, R) {
      R = false;
      return;
    }
    de(), te();
  }), ue.derive(() => {
    const D = Z.cursorSnap.val;
    window.__hekatanSnap2D = D;
  });
  let J = true;
  ue.derive(() => {
    var _a, _b, _c;
    const D = Z.gridSize.val, O = Z.flipAxes.val;
    if (Z.gridXY.val, Z.gridXZ.val, Z.gridYZ.val, Z.gridStep.val, Z.gridMajor.val, J) {
      J = false;
      return;
    }
    z.remove(xe), (_a = xe.traverse) == null ? void 0 : _a.call(xe, (Ce) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Ce.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), xe = Ca(D, me()), xe.visible = Z.gridVisible.rawVal, z.add(xe), de(), z.remove(q), q.traverse((Ce) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Ce.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Ce.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), q = ks(D, O), z.add(q);
    const re = D * 0.5 + D * 0.5 / Math.tan(45 * 0.5);
    E.position.distanceTo(B.target);
    const ie = Math.abs(E.position.x) < 0.1 && Math.abs(E.position.y) < 0.1 && E.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ie ? E.position.set(0, 0, re) : E.position.set(0.5 * D, -re, 0.5 * D), B.target.set(0, 0, 0)), B.minDistance = Math.max(0.05, D * 0.01), B.maxDistance = Math.max(50, D * 50), B.update(), te();
  }), new ResizeObserver((D) => {
    var _a, _b;
    for (const O of D) {
      const re = (_a = O.target) == null ? void 0 : _a.clientWidth, ie = (_b = O.target) == null ? void 0 : _b.clientHeight;
      if (re === 0 || ie === 0) continue;
      const Ce = (fe ? re / 2 : re) / ie;
      E.aspect = Ce, E.updateProjectionMatrix();
      const Ye = P.top;
      if (P.left = -Ye * Ce, P.right = Ye * Ce, P.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = Ce, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const Le = oe, Qe = Le.top;
        Le.left = -Qe * Ce, Le.right = Qe * Ce, Le.updateProjectionMatrix();
      }
      N.setSize(re, ie), te();
    }
  }).observe(A), B.addEventListener("change", te), ue.derive(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, Z.displayScale.val, Z.nodes.val, Z.elements.val, (_g = Z.edges) == null ? void 0 : _g.val, Z.elemColumns.val, Z.elemBeams.val, Z.nodesIndexes.val, Z.elementsIndexes.val, Z.orientations.val, Z.sections.val, Z.secColumns.val, Z.secBeams.val, Z.secFloor.val, Z.supports.val, Z.loads.val, Z.deformedShape.val, Z.nodeResults.val, Z.frameResults.val, Z.shellResults.val, (_h = Z.solidResults) == null ? void 0 : _h.val, (_i2 = Z.extruded) == null ? void 0 : _i2.val, setTimeout(te);
  });
  let fe = false, oe = null, K = null, Me = false;
  function te() {
    const D = A.clientWidth || 1, O = A.clientHeight || 1;
    if (!fe || !oe) {
      N.setScissorTest(false), N.setViewport(0, 0, D, O), N.render(z, V);
      return;
    }
    const re = D / 2;
    N.setScissorTest(true), N.setViewport(0, 0, re, O), N.setScissor(0, 0, re, O), N.render(z, V), N.setViewport(re, 0, re, O), N.setScissor(re, 0, re, O), N.render(z, oe), N.setScissorTest(false);
  }
  function Ie(D) {
    V = D, B.object = D, B.update(), te();
  }
  function be(D, O) {
    fe = D, O && (oe = O);
    const re = A.clientWidth || 1, ie = A.clientHeight || 1, Ce = (D ? re / 2 : re) / ie;
    E.isPerspectiveCamera && (E.aspect = Ce, E.updateProjectionMatrix());
    const Ye = P.top;
    if (P.left = -Ye * Ce, P.right = Ye * Ce, P.updateProjectionMatrix(), D && oe) {
      if (K ? (K.object = oe, K.update()) : (K = new vs(oe, N.domElement), K.enableDamping = true, K.dampingFactor = 0.1, K.screenSpacePanning = true, K.zoomSpeed = 0.8, K.panSpeed = 1.2, K.rotateSpeed = 0.9, K.touches = { ONE: Go.ROTATE, TWO: Go.DOLLY_PAN }, K.target.copy(B.target), K.addEventListener("change", te), K.enabled = false), !Me) {
        const Le = (Qe) => {
          if (!fe || !K) return;
          const Ke = N.domElement.getBoundingClientRect(), ze = Qe.clientX - Ke.left, Ne = Ke.width / 2, Ge = ze >= Ne;
          B.enabled = !Ge, K.enabled = Ge;
        };
        N.domElement.addEventListener("pointerdown", Le, true), N.domElement.addEventListener("wheel", Le, { capture: true, passive: true }), Me = true;
      }
    } else D || (B.enabled = true, K && (K.enabled = false));
    A.__splitMode = D, window.__hekatanSplitMode = D, window.__hekatanSplitCamera = D ? oe : null, te();
  }
  if (t) {
    z.add(Di(Z, se, ae), $i(t, Z, se), Yi(Z, se, ae), Xi(t, Z, se, ae), Bi(t, Z, se, ae), Ni(t, Z, se, ae), qi(t, Z, se, ae), Ki(t, Z, se, ae), Oi(t, Z, se), tl(t, Z, se, ae), Qi(t, Z, se, ae)), window.__hekatanDiagrama2D || (_l(t, Z), N.domElement.addEventListener("dblclick", () => {
      var _a;
      const Le = (_a = Z.frameResults) == null ? void 0 : _a.rawVal;
      !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((Ke) => Ke.type === "frame") || setTimeout(() => {
        var _a2;
        return (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }, 60);
    }));
    const D = yl({ scene: z, rendererElm: N.domElement, getActiveCamera: () => V, derivedNodes: se, derivedDisplayScale: ae, mesh: t, settings: Z, render: te });
    z.add(D);
    const O = El(t, Z), re = al(t, Z, se, O), ie = Cs(O);
    z.add(re), A.appendChild(ie);
    const _e = cl(t, Z, se);
    z.add(_e);
    const Ce = _e.__colorMapValues, Ye = Cs(Ce);
    Ye.id = "frame-legend", A.appendChild(Ye), ue.derive(() => {
      var _a;
      const Le = Z.shellResults.val != "none", Qe = (((_a = Z.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", Ke = Le || Qe, ze = Z.frameResults.val.startsWith("contour:"), Ne = O.val.some((Ge) => Number.isFinite(Ge));
      ie.hidden = !Ke || !Ne, re.visible = Ke, Ye.hidden = !ze;
    });
  }
  if (S) {
    const D = new Vs(16777215, 0.5);
    z.add(D);
    const O = new Qo(16777215, 0.5);
    O.position.set(30, 25, -10), O.shadow.mapSize.width = 1024, O.shadow.mapSize.height = 1024, z.add(O);
    const re = 10;
    O.shadow.camera.left = -re, O.shadow.camera.right = re, O.shadow.camera.top = re, O.shadow.camera.bottom = -re, O.shadow.camera.far = 1e3;
    const ie = new Qo(16777215, 0.5);
    ie.color.setHSL(11, 43, 96), ie.position.set(-10, 0, 30), z.add(ie), ue.derive(() => {
      (S == null ? void 0 : S.val.length) && (z.remove(...S.oldVal), z.add(...S.rawVal), te());
    }), ue.derive(() => {
      S.rawVal.forEach((_e) => _e.visible = Z.solids.val), te();
    });
  }
  if (k) {
    const D = [], O = (ie) => {
      var _a;
      return ((_a = ie == null ? void 0 : ie.userData) == null ? void 0 : _a.isCota) ? Z.showCotas.val : Z.custom3D.val;
    }, re = () => {
      for (const ie of D) ie.visible = O(ie);
      te();
    };
    ue.derive(() => {
      const ie = k.val;
      D.length && (z.remove(...D), D.length = 0), ie.length && (z.add(...ie), D.push(...ie), re(), N.clippingPlanes.length && Q()), te();
    }), ue.derive(() => {
      Z.custom3D.val, re();
    }), ue.derive(() => {
      Z.showCotas.val, re();
    });
  }
  g && nl({ drawingObj: g, gridObj: xe, scene: z, getActiveCamera: () => V, controls: B, gridSize: U, derivedDisplayScale: ae, rendererElm: N.domElement, viewerRender: te }), Es((D, O) => {
    var _a;
    N.setClearColor(O.background, 1), z.remove(xe), (_a = xe.traverse) == null ? void 0 : _a.call(xe, (re) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = re.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = re.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), xe = Ca(Z.gridSize.rawVal, { planes: ge() }), z.add(xe), A.style.setProperty("--awatif-legend-color", O.legendMarker), te();
  });
  const ve = { scene: z, perspCamera: E, orthoCamera: P, get camera() {
    return V;
  }, controls: B, renderer: N, rendererElm: N.domElement, render: te, setActiveCamera: Ie, setSplitMode: be, get splitMode() {
    return fe;
  }, get splitCamera() {
    return oe;
  }, settings: Z };
  A.__ctx = ve;
  const Pe = document.createElement("div");
  Pe.id = "hk-nav-camara", Pe.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Xe = (D, O, re) => {
    const ie = document.createElement("button");
    return ie.textContent = D, ie.title = O, ie.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ie.onmouseenter = () => {
      ie.style.background = "rgba(70,70,70,0.9)";
    }, ie.onmouseleave = () => {
      ie.style.background = "rgba(40,40,40,0.85)";
    }, ie.onclick = (_e) => {
      _e.preventDefault(), re();
    }, ie;
  }, Ae = (D, O) => {
    const re = B.target, ie = new F().subVectors(V.position, re), _e = ie.length(), Ce = new F(), Ye = new F();
    Ce.crossVectors(V.up, ie).normalize(), Ye.copy(V.up).normalize();
    const Le = _e * 0.05;
    re.addScaledVector(Ce, -D * Le), re.addScaledVector(Ye, O * Le), V.position.addScaledVector(Ce, -D * Le), V.position.addScaledVector(Ye, O * Le), B.update(), te();
  }, nt = (D) => {
    const O = new F().subVectors(V.position, B.target);
    O.multiplyScalar(D), V.position.copy(B.target).add(O), B.update(), te();
  }, st = () => {
    const D = document.createElement("div");
    return D.style.cssText = "width:32px;height:32px;", D;
  };
  return Pe.append(st()), Pe.append(Xe("\u2191", "Pan arriba", () => Ae(0, 1))), Pe.append(Xe("\u2295", "Zoom in", () => nt(0.85))), Pe.append(Xe("\u2190", "Pan izquierda", () => Ae(-1, 0))), Pe.append(Xe("\u2302", "Reset vista", () => {
    B.reset(), te();
  })), Pe.append(Xe("\u2192", "Pan derecha", () => Ae(1, 0))), Pe.append(Xe("\u2296", "Zoom out", () => nt(1.18))), Pe.append(Xe("\u2193", "Pan abajo", () => Ae(0, -1))), Pe.append(st()), getComputedStyle(A).position === "static" && (A.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && A.appendChild(Pe), A;
}
function Sl(t, y) {
  return ue.derive(() => {
    var _a, _b, _c, _d;
    if (!y.deformedShape.val) return ((_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], k = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!k || g.length === 0) return g;
    const S = y.deformScale.val, A = y.deformScale.val * y.deformScaleZ.val, z = Number.isFinite(S) ? S : 1, E = Number.isFinite(A) ? A : 1;
    return g.map((P, V) => {
      var _a2;
      const N = ((_a2 = k.get(V)) == null ? void 0 : _a2.slice(0, 3)) ?? [0, 0, 0], B = Number.isFinite(N[0]) ? N[0] : 0, ee = Number.isFinite(N[1]) ? N[1] : 0, X = Number.isFinite(N[2]) ? N[2] : 0;
      return [P[0] + B * z, P[1] + ee * z, P[2] + X * E];
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
    const S = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), we = (D, O) => {
      D == null ? void 0 : D.forEach((re, ie) => {
        const _e2 = t.elements.val[ie];
        if (_e2) for (let Ce = 0; Ce < _e2.length; Ce++) O.set(_e2[Ce], [re[Ce] ?? re[0]]);
      });
    };
    we((_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, S), we((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, A), we((_f = (_e = t.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, z), we((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, E), we((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, P), we((_l2 = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l2.membraneXY, V), we((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, N), we((_p = (_o2 = t.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, B), we((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ee), we((_t = (_s2 = t.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, X);
    const Q = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map(), me = (D, O, re, ie, _e2) => {
      D.forEach((Ce, Ye) => {
        var _a2, _b2;
        const Le = Ce[0] ?? 0, Qe = ((_a2 = O.get(Ye)) == null ? void 0 : _a2[0]) ?? 0, Ke = ((_b2 = re.get(Ye)) == null ? void 0 : _b2[0]) ?? 0, ze = (Le + Qe) / 2, Ne = Math.hypot((Le - Qe) / 2, Ke);
        ie.set(Ye, [ze + Ne]), _e2.set(Ye, [ze - Ne]);
      });
    };
    me(E, P, V, Q, Z), me(S, A, z, ae, se), N.forEach((D, O) => {
      var _a2;
      ge.set(O, [Math.hypot(D[0] ?? 0, ((_a2 = B.get(O)) == null ? void 0 : _a2[0]) ?? 0)]);
    });
    const xe = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, de = (_w = y.solidResults) == null ? void 0 : _w.val, U = de && de !== "none" ? de : y.shellResults.val, I = xe == null ? void 0 : xe[U], q = { bendingXX: [S, 0], bendingYY: [A, 0], bendingXY: [z, 0], membraneXX: [E, 0], membraneYY: [P, 0], membraneXY: [V, 0], tranverseShearX: [N, 0], tranverseShearY: [B, 0], membranePrincipalMax: [Q, 0], membranePrincipalMin: [Z, 0], bendingPrincipalMax: [ae, 0], bendingPrincipalMin: [se, 0], transverseShearMax: [ge, 0], vonMises: [ee, 0], pressure: [X, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, Y = y.shellResults.val, R = Pl.val, J = zl.val, pe = Y === "displacementX" || Y === "displacementY" || Y === "displacementZ", fe = Y === "bendingXX" || Y === "bendingYY" || Y === "bendingXY" || Y === "bendingPrincipalMax" || Y === "bendingPrincipalMin", oe = Y === "membraneXX" || Y === "membraneYY" || Y === "membraneXY" || Y === "membranePrincipalMax" || Y === "membranePrincipalMin", K = Y === "vonMises" || Y === "pressure", Me = Y === "tranverseShearX" || Y === "tranverseShearY" || Y === "transverseShearMax", te = (_D = y.solidResults) == null ? void 0 : _D.val, Ie = te === "vonMises" || te === "sigmaXX" || te === "sigmaYY" || te === "sigmaZZ" || te === "tauXY" || te === "tauYZ" || te === "tauXZ", be = te === "ux" || te === "uy" || te === "uz", ve = Cl.val, Pe = Ie ? Fl[ve] : be || pe ? Fs[J] : fe || oe || K || Me ? 1 / Al[R] : 1, Xe = Ie ? ve : be || pe ? J : fe ? `${R}\xB7m/m` : oe ? `${R}/m\xB2` : K ? `${R}/m\xB2` : Me ? `${R}/m` : "";
    Va.val = Xe, ko.val = Array.isArray(I) && I.length === 2 ? [I[0] * Pe, I[1] * Pe] : null;
    const Ae = Ts.val, st = te && te !== "none" ? [ee, 0] : q[Y], Ue = [];
    if (t.nodes.val.forEach((D, O) => {
      const re = st;
      if (!re || !re[0] || typeof re[0].has != "function") return;
      if (!re[0].has(O)) {
        Ue.push(Number.NaN);
        return;
      }
      const ie = re[0].get(O), _e2 = ie ? ie[re[1]] ?? 0 : 0;
      Ue.push(_e2 * Pe);
    }), !ko.val && Ae !== "auto") {
      const D = t.nodes.val, O = /* @__PURE__ */ new Set(), re = (_e2, Ce) => {
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
        if (Ae === "losas" ? Ce : Ae === "muros" ? Ye || Le : Ae === "murosX" ? Ye : Ae === "murosY" ? Le : false) for (const ze of _e2) O.add(ze);
      }
      const ie = [];
      for (const _e2 of O) {
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
