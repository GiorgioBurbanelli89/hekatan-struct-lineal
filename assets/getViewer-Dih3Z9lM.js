import { u as nn, a6 as Ao, q as Ka, v as re, a7 as Wa, D as Et, M as it, B as Ae, F as Vt, a8 as Ga, z as ht, a9 as Ha, aa as Ja, h as Hs, ab as Js, r as $n, ac as $o, ad as Io, a4 as ca, _ as ct, b as dt, L as Jt, y as da, c as Qa, ae as Oa, f as pt, V as E, $ as Vn, af as ss, K as Ro, d as Ft, a as as, A as ua, t as To, J as ja, H as ao, I as ei, ag as Lo, w as is, o as ti, N as kn, a2 as no, E as Qs, S as Wn, m as ls, ah as oo, g as Os, i as js, j as ea, C as ta, W as ni, X as oi, Y as si, Z as ai, T as Fo, P as rs, U as ii } from "./theme-C-zoknmI.js";
import { T as $t, O as na } from "./Text-Cehu0nom.js";
import { P as fa } from "./tweakpane-BXg6ZhiP.js";
import { e as li } from "./styles-DjYKrbEd.js";
class pa {
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
    this.map = cs[y] || cs.rainbow, this.n = g;
    const b = 1 / this.n, S = new nn(), z = new nn();
    this.lut.length = 0, this.lut.push(new nn(this.map[0][1]));
    for (let A = 1; A < g; A++) {
      const F = A * b;
      for (let C = 0; C < this.map.length - 1; C++) if (F > this.map[C][0] && F <= this.map[C + 1][0]) {
        const L = this.map[C][0], N = this.map[C + 1][0];
        S.setHex(this.map[C][1], Ao), z.setHex(this.map[C + 1][1], Ao);
        const B = new nn().lerpColors(S, z, (F - L) / (N - L));
        this.lut.push(B);
      }
    }
    return this.lut.push(new nn(this.map[this.map.length - 1][1])), this;
  }
  copy(y) {
    return this.lut = y.lut, this.map = y.map, this.n = y.n, this.minV = y.minV, this.maxV = y.maxV, this;
  }
  getColor(y) {
    y = Ka.clamp(y, this.minV, this.maxV), y = (y - this.minV) / (this.maxV - this.minV);
    const g = Math.round(y * this.n);
    return this.lut[g];
  }
  addColorMap(y, g) {
    return cs[y] = g, this;
  }
  createCanvas() {
    const y = document.createElement("canvas");
    return y.width = 1, y.height = this.n, this.updateCanvas(y), y;
  }
  updateCanvas(y) {
    const g = y.getContext("2d", { alpha: false }), b = g.getImageData(0, 0, 1, this.n), S = b.data;
    let z = 0;
    const A = 1 / this.n, F = new nn(), C = new nn(), L = new nn();
    for (let N = 1; N >= 0; N -= A) for (let B = this.map.length - 1; B >= 0; B--) if (N < this.map[B][0] && N >= this.map[B - 1][0]) {
      const te = this.map[B - 1][0], fe = this.map[B][0];
      F.setHex(this.map[B - 1][1], Ao), C.setHex(this.map[B][1], Ao), L.lerpColors(F, C, (N - te) / (fe - te)), S[z * 4] = Math.round(L.r * 255), S[z * 4 + 1] = Math.round(L.g * 255), S[z * 4 + 2] = Math.round(L.b * 255), S[z * 4 + 3] = 255, z += 1;
    }
    return g.putImageData(b, 0, 0), y;
  }
}
const cs = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ha = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], ri = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ha, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Do = re.state("safe"), ma = re.state("auto");
function wa(t) {
  t = Math.max(0, Math.min(1, t));
  const y = ri[Do.val] ?? ha;
  for (let b = 0; b < y.length - 1; b++) {
    const [S, z, A, F] = y[b], [C, L, N, B] = y[b + 1];
    if (t <= C) {
      const te = (t - S) / (C - S);
      return [z + (L - z) * te, A + (N - A) * te, F + (B - F) * te];
    }
  }
  const g = y[y.length - 1];
  return [g[1], g[2], g[3]];
}
function oa() {
  const y = new Uint8Array(1024);
  for (let b = 0; b < 256; b++) {
    const S = b / 255, [z, A, F] = wa(S);
    y[b * 4 + 0] = z, y[b * 4 + 1] = A, y[b * 4 + 2] = F, y[b * 4 + 3] = 255;
  }
  const g = new Ha(y, 256, 1, Ja);
  return g.minFilter = Hs, g.magFilter = Hs, g.wrapS = Js, g.wrapT = Js, g.needsUpdate = true, g;
}
function ci() {
  const y = [];
  for (let g = 0; g <= 12; g++) {
    const b = 1 - g / 12, [S, z, A] = wa(b);
    y.push(`rgb(${S | 0},${z | 0},${A | 0}) ${(g / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${y.join(",")})`;
}
function ws(t) {
  if (!t.length) return [0, 1];
  const y = [...t].sort((z, A) => z - A), g = (z) => y[Math.min(y.length - 1, Math.max(0, Math.round(z * (y.length - 1))))];
  let b = y.length >= 20 ? g(0.01) : y[0], S = y.length >= 20 ? g(0.99) : y[y.length - 1];
  return b >= 0 && S > 0 && (b = 0), S <= 0 && b < 0 && (S = 0), [b, S];
}
function di(t, y, g) {
  new pa();
  const b = oa(), S = new Wa({ uniforms: { cmap: { value: b }, ambient: { value: 0.95 } }, vertexShader: `
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
  re.derive(() => {
    var _a;
    Do.val;
    const A = S.uniforms.cmap.value;
    S.uniforms.cmap.value = oa(), (_a = A == null ? void 0 : A.dispose) == null ? void 0 : _a.call(A);
  });
  const z = new it(new Ae(), S);
  return z.renderOrder = -1, z.frustumCulled = false, z.userData.isShellArea = true, z.name = "__hekatan_shell_colormap", re.derive(() => {
    z.geometry.setAttribute("position", new Vt(t.val.flat(), 3));
    const A = [], F = [], C = [];
    y.val.forEach((Z, le) => {
      Z.length === 3 ? (A.push(Z[0], Z[1], Z[2]), F.push(le), C.push(0)) : Z.length === 4 && (A.push(Z[0], Z[1], Z[2]), A.push(Z[0], Z[2], Z[3]), F.push(le, le), C.push(0, 1));
    }), z.geometry.setIndex(new Ga(A, 1)), z.userData.faceToElem = F, z.userData.faceLocal = C;
    const L = g.val.filter((Z) => Number.isFinite(Z));
    let N, B;
    const te = lo.val;
    if (te ? (B = te[0], N = te[1]) : [B, N] = ws(L), N === B) {
      const Z = Math.max(Math.abs(N) * 1e-6, 1e-9);
      N += Z, B -= Z;
    }
    const fe = te && te[0] > te[1], we = Math.min(B, N), O = Math.max(B, N), U = O - we, ce = new Float32Array(g.val.length);
    for (let Z = 0; Z < g.val.length; Z++) {
      const le = g.val[Z];
      if (!Number.isFinite(le)) {
        ce[Z] = -1;
        continue;
      }
      const oe = ((fe ? O + we - le : le) - we) / U;
      ce[Z] = Math.max(0, Math.min(1, oe));
    }
    z.geometry.setAttribute("scalar", new ht(ce, 1));
  }), z;
}
function ui(t, y, g) {
  const b = document.createElement("div"), S = new fa({ title: "Settings", expanded: true, container: b });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(S), b.setAttribute("id", "settings");
  const z = "hk_settingsPos";
  let A = null;
  try {
    const fe = localStorage.getItem(z);
    fe && (A = JSON.parse(fe));
  } catch {
  }
  b.style.cssText = ["position:fixed", A ? `left:${A.left}px` : "left:8px", A ? `top:${A.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const F = () => {
    const fe = b.querySelector(".tp-rotv_b");
    if (!fe) {
      setTimeout(F, 200);
      return;
    }
    fe.style.cursor = "move", fe.style.userSelect = "none";
    let we = false, O = 0, U = 0, ce = 0, Z = 0;
    fe.addEventListener("mousedown", (le) => {
      we = true, O = le.clientX, U = le.clientY;
      const se = b.getBoundingClientRect();
      ce = se.left, Z = se.top, b.style.left = `${ce}px`, b.style.top = `${Z}px`;
    }), window.addEventListener("mousemove", (le) => {
      if (!we) return;
      const se = le.clientX - O, oe = le.clientY - U, J = Math.max(0, Math.min(window.innerWidth - 40, ce + se)), H = Math.max(0, Math.min(window.innerHeight - 40, Z + oe));
      b.style.left = `${J}px`, b.style.top = `${H}px`;
    }), window.addEventListener("mouseup", () => {
      if (we) {
        we = false;
        try {
          localStorage.setItem(z, JSON.stringify({ left: parseFloat(b.style.left), top: parseFloat(b.style.top) }));
        } catch {
        }
      }
    });
  };
  if (F(), y == null ? void 0 : y.nodes) {
    S.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const fe = S.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    fe.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), fe.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), fe.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), fe.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const we = fe.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    we.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), we.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), we.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const O = S.addFolder({ title: "\u{1F441} Ver", expanded: false });
    O.addBinding(t.nodes, "val", { label: "Nodes" }), O.addBinding(t.elements, "val", { label: "Elements" }), O.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), O.addBinding(t.faces, "val", { label: "  Caras (fill)" }), O.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), O.addBinding(t.elemColumns, "val", { label: "    Columnas" }), O.addBinding(t.elemBeams, "val", { label: "    Vigas" }), O.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), O.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), O.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), O.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), O.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), O.addBinding(t.orientations, "val", { label: "Orientations" }), O.addBinding(t.sections, "val", { label: "Sections" }), O.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), O.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), O.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), O.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), O.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((y == null ? void 0 : y.nodeInputs) || (y == null ? void 0 : y.elementInputs)) {
    const fe = S.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    fe.addBinding(t.supports, "val", { label: "Supports" }), fe.addBinding(t.loads, "val", { label: "Loads" }), fe.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), fe.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((y == null ? void 0 : y.deformOutputs) || (y == null ? void 0 : y.analyzeOutputs)) {
    const fe = S.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = fe, fe.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), fe.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), fe.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagrama2D) == null ? void 0 : _a.call(window);
    }), fe.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagramaBarra) == null ? void 0 : _a.call(window);
    }), fe.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), fe.addBinding(Do, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), fe.addBinding(ma, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), fe.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), fe.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), fe.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), fe.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  g && S.addBinding(t.solids, "val", { label: "Solids" });
  const C = S.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), L = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), N = () => {
    const fe = window.__hekatanClipApply;
    typeof fe == "function" && fe();
  };
  let B = [];
  const te = (fe, we) => {
    for (const U of B) try {
      U.dispose();
    } catch {
    }
    B = [];
    const O = (U, ce) => {
      const Z = Math.floor(Math.min(fe[ce], -50)), le = Math.ceil(Math.max(we[ce], 50)), se = le - Z > 400 ? 0.5 : 0.1;
      return L["pos" + U] = Math.max(Z, Math.min(le, L["pos" + U])), C.addBinding(L, "pos" + U, { min: Z, max: le, step: se, label: `  pos ${U} (m)` }).on("change", N);
    };
    B.push(C.addBinding(L, "enableX", { label: "Cortar X" }).on("change", N), O("X", 0), C.addBinding(L, "invertX", { label: "  invertir X" }).on("change", N), C.addBinding(L, "enableY", { label: "Cortar Y" }).on("change", N), O("Y", 1), C.addBinding(L, "invertY", { label: "  invertir Y" }).on("change", N), C.addBinding(L, "enableZ", { label: "Cortar Z" }).on("change", N), O("Z", 2), C.addBinding(L, "invertZ", { label: "  invertir Z" }).on("change", N));
  };
  return te([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (fe, we) => {
    te(fe, we);
  }, b;
}
function fi(t) {
  return { gridSize: re.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: re.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: re.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: re.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: re.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: re.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: re.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: re.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: re.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: re.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: re.state((t == null ? void 0 : t.nodes) ?? true), elements: re.state((t == null ? void 0 : t.elements) ?? true), edges: re.state((t == null ? void 0 : t.edges) ?? true), faces: re.state((t == null ? void 0 : t.faces) ?? true), elemColumns: re.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: re.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: re.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: re.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: re.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: re.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: re.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: re.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: re.state((t == null ? void 0 : t.orientations) ?? false), sections: re.state((t == null ? void 0 : t.sections) ?? true), extruded: re.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: re.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: re.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: re.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: re.state((t == null ? void 0 : t.secFloor) ?? -1), supports: re.state((t == null ? void 0 : t.supports) ?? true), loads: re.state((t == null ? void 0 : t.loads) ?? false), deformedShape: re.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: re.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: re.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: re.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: re.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: re.state((t == null ? void 0 : t.flipAxes) ?? false), solids: re.state((t == null ? void 0 : t.solids) ?? true), custom3D: re.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: re.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: re.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: re.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function pi(t, y, g) {
  const b = $n(), S = new $o(new Ae(), new Io({ color: b.nodePoint }));
  return ca((z, A) => {
    S.material.color.setHex(A.nodePoint);
  }), S.frustumCulled = false, re.derive(() => {
    t.nodes.val && S.geometry.setAttribute("position", new Vt(y.val.flat(), 3));
  }), re.derive(() => {
    if (g.val, y.val, !t.nodes.rawVal) return;
    const z = y.rawVal ?? [];
    let A = t.gridSize.val * 0.5;
    if (z.length >= 2) {
      const C = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
      for (const N of z) for (let B = 0; B < 3; B++) C[B] = Math.min(C[B], N[B]), L[B] = Math.max(L[B], N[B]);
      A = Math.max(L[0] - C[0], L[1] - C[1], L[2] - C[2], 0.1);
    }
    const F = 0.03 * A;
    S.material.size = F * g.rawVal;
  }), re.derive(() => {
    S.visible = t.nodes.val;
  }), S;
}
function ds(t, y) {
  const g = $n(), b = new ct();
  b.name = "hekatan-grid";
  const S = (y == null ? void 0 : y.planes) ?? ["xy"];
  let z = (y == null ? void 0 : y.majorStep) ?? 1, A = (y == null ? void 0 : y.minorStep) ?? 0.1;
  for (z <= 0 && (z = 1), A <= 0 && (A = 0.1); t / A > 500; ) A *= 2;
  for (; t / z > 100; ) z *= 2;
  const F = t / 2;
  z = Math.max(A, Math.round(z / A) * A);
  const L = new nn(g.grid).multiplyScalar(1.3), N = new nn(g.grid).multiplyScalar(0.8), B = (O, U, ce, Z) => {
    const le = [], se = O === "xy" ? (X, K) => [X, K, 0] : O === "xz" ? (X, K) => [X, 0, K] : (X, K) => [0, X, K], oe = Math.floor(F / U);
    for (let X = -oe; X <= oe; X++) {
      const K = X * U, q = se(K, -F), R = se(K, F);
      le.push(...q, ...R);
    }
    for (let X = -oe; X <= oe; X++) {
      const K = X * U, q = se(-F, K), R = se(F, K);
      le.push(...q, ...R);
    }
    const J = new Ae();
    J.setAttribute("position", new Vt(le, 3));
    const H = new dt({ color: ce, transparent: true, opacity: Z, depthWrite: false }), G = new Jt(J, H);
    return G.name = `grid-${O}-${U === A ? "minor" : "major"}`, G;
  }, te = (O, U, ce) => {
    const Z = O === "xy" ? (G, X) => [G, X, 0] : O === "xz" ? (G, X) => [G, 0, X] : (G, X) => [0, G, X], le = [[-F, -F], [F, -F], [F, F], [-F, F]], se = [];
    for (const [G, X] of le) se.push(...Z(G, X));
    const oe = new Ae();
    oe.setAttribute("position", new Vt(se, 3));
    const J = new dt({ color: U, transparent: true, opacity: ce, depthWrite: false }), H = new da(oe, J);
    return H.name = `grid-${O}-border`, H.renderOrder = 1, H;
  }, fe = (O, U, ce) => {
    const Z = O === "xy" ? (J, H) => [J, H, 0] : O === "xz" ? (J, H) => [J, 0, H] : (J, H) => [0, J, H], le = U === "u" ? [...Z(-F, 0), ...Z(F, 0)] : [...Z(0, -F), ...Z(0, F)], se = new Ae();
    se.setAttribute("position", new Vt(le, 3));
    const oe = new Jt(se, new dt({ color: ce, transparent: true, opacity: 0.45, depthWrite: false }));
    return oe.name = `grid-${O}-eje-${U}`, oe.renderOrder = 1, oe;
  }, we = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const O of S) {
    b.add(B(O, A, N, 0.12)), b.add(B(O, z, L, 0.4));
    const [U, ce] = we[O];
    b.add(fe(O, "u", U)), b.add(fe(O, "v", ce)), b.add(te(O, L, 0.55));
  }
  return b.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: z, minorStep: A, gridSize: t, planes: [...S] }, b;
}
function hi(t, y, g, b) {
  const S = new ct(), z = new Qa(0.5, 0.5, 0.5), A = new Oa(0.45, 0.7, 4);
  A.rotateX(Math.PI / 2), A.translate(0, 0, -0.35);
  const F = new pt({ color: 10166822 }), C = new pt({ color: 2792847 }), L = new pt({ color: 3835647 }), N = () => {
    const fe = g.rawVal ?? [];
    if (fe.length < 2) return y.gridSize.val * 0.5;
    let we = [1 / 0, 1 / 0, 1 / 0], O = [-1 / 0, -1 / 0, -1 / 0];
    for (const U of fe) for (let ce = 0; ce < 3; ce++) U[ce] < we[ce] && (we[ce] = U[ce]), U[ce] > O[ce] && (O[ce] = U[ce]);
    return Math.max(O[0] - we[0], O[1] - we[1], O[2] - we[2], 0.1);
  }, B = () => 0.08 * N(), te = () => b.rawVal;
  return re.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, !y.supports.val) return;
    S.clear();
    const fe = B();
    (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((we, O) => {
      const U = g.val[O];
      if (!U) return;
      const ce = we ?? [], Z = (ce[0] ? 1 : 0) + (ce[1] ? 1 : 0) + (ce[2] ? 1 : 0), le = (ce[3] ? 1 : 0) + (ce[4] ? 1 : 0) + (ce[5] ? 1 : 0);
      let se;
      Z >= 3 && le >= 3 ? se = new it(z, F) : Z >= 3 && le === 0 ? se = new it(A, C) : se = new it(A, L), se.position.set(U[0], U[1], U[2]);
      const oe = fe * te();
      se.scale.set(oe, oe, oe), S.add(se);
    });
  }), re.derive(() => {
    if (b.val, !y.supports.rawVal) return;
    const we = B() * te();
    S.children.forEach((O) => O.scale.set(we, we, we));
  }), re.derive(() => {
    S.visible = y.supports.val;
  }), S;
}
function mi(t, y, g, b) {
  const S = new ct();
  S.name = "loadsGroup";
  function z(F) {
    if (F.length < 2) return 0.12 * y.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of F) for (let te = 0; te < 3; te++) C[te] = Math.min(C[te], B[te]), L[te] = Math.max(L[te], B[te]);
    return 0.08 * Math.max(L[0] - C[0], L[1] - C[1], L[2] - C[2], 0.1);
  }
  re.derive(() => {
    var _a, _b, _c;
    if (y.deformedShape.val, !y.loads.val) return;
    S.children.forEach((O) => {
      var _a2;
      return (_a2 = O.dispose) == null ? void 0 : _a2.call(O);
    }), S.clear();
    const F = g.val, C = z(F), L = 240, N = [];
    (_c = (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((O, U) => {
      F[U] && O.slice(0, 3).some((ce) => Math.abs(ce) > 1e-15) && N.push(U);
    });
    let B = N;
    if (N.length > L) {
      const O = N.map((R) => F[R][0]), U = N.map((R) => F[R][1]), ce = Math.min(...O), Z = Math.max(...O), le = Math.min(...U), se = Math.max(...U), oe = N.map((R) => F[R][2]), J = Math.max(1e-6, (Math.max(...oe) - Math.min(...oe)) / 40), H = (R) => Math.round(R / J), G = new Set(oe.map(H)), X = Math.max(4, Math.floor(L / Math.max(1, G.size))), K = Math.max(2, Math.round(Math.sqrt(X))), q = /* @__PURE__ */ new Map();
      for (const R of N) {
        const Q = Z - ce < 1e-9 ? 0 : (F[R][0] - ce) / (Z - ce), he = se - le < 1e-9 ? 0 : (F[R][1] - le) / (se - le), ye = Math.min(K - 1, Math.floor(Q * K)), Me = Math.min(K - 1, Math.floor(he * K)), W = `${ye},${Me},${H(F[R][2])}`, _e = Math.hypot(Q * K - (ye + 0.5), he * K - (Me + 0.5)), de = q.get(W);
        (!de || _e < de.d) && q.set(W, { i: R, d: _e });
      }
      B = [...q.values()].map((R) => R.i);
    }
    let te = 0;
    for (const O of B) {
      const U = t.nodeInputs.val.loads.get(O);
      for (let ce = 0; ce < 3; ce++) te = Math.max(te, Math.abs(U[ce]));
    }
    const fe = B.length <= 60, we = (O) => {
      const U = Math.abs(O);
      return U >= 100 ? O.toFixed(0) : U >= 10 ? O.toFixed(1) : O.toFixed(2);
    };
    for (const O of B) {
      const U = t.nodeInputs.val.loads.get(O), ce = F[O];
      if (ce) for (let Z = 0; Z < 3; Z++) {
        const le = U[Z];
        if (!(Math.abs(le) > 1e-9 * (te || 1))) continue;
        const se = new E(Z === 0 ? Math.sign(le) : 0, Z === 1 ? Math.sign(le) : 0, Z === 2 ? Math.sign(le) : 0), oe = 0.45 + 0.55 * (te ? Math.abs(le) / te : 1), J = new Vn(se, new E(...ce), 1, Z === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (J.userData = { nudo: ce, dir: se, rel: oe }, S.add(J), fe) {
          const H = new $t(we(le), Z === 2 ? "#f5b642" : "#ff6b5e");
          H.userData = { nudo: ce, dir: se, rel: oe, texto: true }, S.add(H);
        }
      }
    }
    A(C * b.rawVal);
  });
  function A(F) {
    S.children.forEach((C) => {
      const L = C.userData;
      if (!(L == null ? void 0 : L.dir)) return;
      const N = F * L.rel, B = new E(...L.nudo).addScaledVector(L.dir, -N * (L.texto ? 1.12 : 1));
      C.position.copy(B), L.texto ? C.updateScale(F * 0.38) : C.scale.set(N, N, N);
    });
  }
  return re.derive(() => {
    b.val, y.loads.rawVal && A(z(g.rawVal) * b.rawVal);
  }), re.derive(() => {
    S.visible = y.loads.val;
  }), S;
}
function wi(t, y, g) {
  const b = new ct();
  return re.derive(() => {
    if (!t.nodesIndexes.val) return;
    b.children.forEach((z) => z.dispose()), b.clear();
    const S = 0.05 * t.gridSize.val * 0.6;
    y.val.forEach((z, A) => {
      const F = new $t(`${A}`);
      F.position.set(...z), F.updateScale(S * g.rawVal), b.add(F);
    });
  }), re.derive(() => {
    if (g.val, !t.nodesIndexes.rawVal) return;
    const S = 0.05 * t.gridSize.val * 0.6;
    b.children.forEach((z) => z.updateScale(S * g.rawVal));
  }), re.derive(() => {
    b.visible = t.nodesIndexes.val;
  }), b;
}
function yi(t, y, g, b) {
  const S = new ct();
  return re.derive(() => {
    var _a;
    if (y.deformedShape.val, !y.elementsIndexes.val) return;
    S.children.forEach((A) => A.dispose()), S.clear();
    const z = 0.05 * y.gridSize.val * 0.6;
    (_a = t.elements) == null ? void 0 : _a.val.forEach((A, F) => {
      const C = new $t(`${F}`, void 0, "#001219");
      C.position.set(...xi(A.map((L) => g.rawVal[L]))), C.updateScale(z * b.rawVal), S.add(C);
    });
  }), re.derive(() => {
    if (b.val, !y.elementsIndexes.rawVal) return;
    const z = 0.05 * y.gridSize.val * 0.6;
    S.children.forEach((A) => A.updateScale(z * b.rawVal));
  }), re.derive(() => {
    S.visible = y.elementsIndexes.val;
  }), S;
}
function xi(t) {
  const y = t.reduce((b, S) => [b[0] + S[0], b[1] + S[1], b[2] + S[2]], [0, 0, 0]), g = t.length;
  return [y[0] / g, y[1] / g, y[2] / g];
}
function sa(t, y) {
  const g = new ct(), b = Math.min(0.05 * t, 0.6), S = $n(), z = new $t("X", "red", "transparent"), A = new $t(y ? "Z" : "Y", "green", "transparent"), F = new $t(y ? "Y" : "Z", "blue", "transparent"), C = new Vn(new E(1, 0, 0), new E(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), L = new Vn(new E(0, 1, 0), new E(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), N = new Vn(new E(0, 0, 1), new E(0, 0, 0), 1, S.axisArrow, 0.2, 0.2);
  return z.position.set(1.3 * b, 0, 0), A.position.set(0, 1.3 * b, 0), F.position.set(0, 0, 1.3 * b), z.updateScale(0.4 * b), A.updateScale(0.4 * b), F.updateScale(0.4 * b), C.scale.set(b, b, b), L.scale.set(b, b, b), N.scale.set(b, b, b), g.add(C, L, N, z, A, F), g;
}
function ys(t, y) {
  const g = new E(...t), S = new E(...y).clone().sub(g), z = S.length(), A = S.dot(new E(1, 0, 0)) / z, F = S.dot(new E(0, 1, 0)) / z, C = S.dot(new E(0, 0, 1)) / z, L = Math.sqrt(A ** 2 + F ** 2);
  let N = new ss().fromArray([[A, F, C], [-F / L, A / L, 0], [-A * C / L, -F * C / L, L]].flat());
  return C === 1 && (N = new ss().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), C === -1 && (N = new ss().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Ro().setFromMatrix3(N);
}
function ps(t, y) {
  return t == null ? void 0 : t.map((g, b) => (9 * g + y[b]) / 10);
}
function io(t) {
  const y = t.reduce((b, S) => [b[0] + S[0], b[1] + S[1], b[2] + S[2]], [0, 0, 0]), g = t.length;
  return [y[0] / g, y[1] / g, y[2] / g];
}
function gi(t, y, g) {
  const b = io([y, g]), S = io([t, g]), z = io([t, y]), A = new E(...b).sub(new E(...S)).normalize(), F = new E(...g).sub(new E(...z)).normalize(), C = A.clone().cross(F).normalize(), L = C.clone().cross(A).normalize();
  return new Ro().makeBasis(A, L, C);
}
function vi(t, y, g, b) {
  const S = new ct(), z = new Ae(), A = new dt({ vertexColors: true }), F = [0, 0, 0], C = [1, 0, 0], L = [0, 1, 0], N = [0, 0, 1];
  z.setAttribute("position", new Vt([...F, ...C, ...F, ...L, ...F, ...N], 3));
  const B = [255, 0, 0], te = [0, 255, 0], fe = [0, 0, 255];
  return z.setAttribute("color", new Vt([...B, ...B, ...te, ...te, ...fe, ...fe], 3)), re.derive(() => {
    var _a;
    y.deformedShape.val, y.orientations.val && (S.clear(), (_a = t.elements) == null ? void 0 : _a.val.forEach((we) => {
      const O = new Jt(z, A), U = g.rawVal[we[0]], ce = g.rawVal[we[1]];
      if (we.length === 2 && (O.position.set(...ps(U, ce)), O.rotation.setFromRotationMatrix(ys(U, ce))), we.length === 3) {
        const se = g.rawVal[we[2]];
        O.position.set(...io([U, ce, se])), O.rotation.setFromRotationMatrix(gi(U, ce, se));
      }
      const le = 0.05 * y.gridSize.rawVal * 0.75 * b.rawVal;
      O.scale.set(le, le, le), S.add(O);
    }));
  }), re.derive(() => {
    if (b.val, !y.orientations.rawVal) return;
    const O = 0.05 * y.gridSize.val * 0.75 * b.rawVal;
    S.children.forEach((U) => U.scale.set(O, O, O));
  }), re.derive(() => {
    S.visible = y.orientations.val;
  }), S;
}
function Mi(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const y = (t.b * 100).toFixed(0), g = (t.h * 100).toFixed(0);
    return `${y}x${g}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function bi(t, y, g, b) {
  const S = new ct(), z = new ct();
  S.add(z);
  function A(J, H) {
    const G = J / 2, X = H / 2, K = new Float32Array([0, -G, -X, 0, G, -X, 0, G, X, 0, -G, -X, 0, G, X, 0, -G, X]), q = new Ae();
    q.setAttribute("position", new ht(K, 3));
    const R = new Float32Array([0, -G, -X, 0, G, -X, 0, G, X, 0, -G, X, 0, -G, -X]), Q = new Ae();
    return Q.setAttribute("position", new ht(R, 3)), { fill: q, outline: Q };
  }
  function F(J, H = 24) {
    const G = J / 2, X = new Float32Array(H * 9);
    for (let Q = 0; Q < H; Q++) {
      const he = Q / H * Math.PI * 2, ye = (Q + 1) / H * Math.PI * 2;
      X[Q * 9] = 0, X[Q * 9 + 1] = 0, X[Q * 9 + 2] = 0, X[Q * 9 + 3] = 0, X[Q * 9 + 4] = G * Math.cos(he), X[Q * 9 + 5] = G * Math.sin(he), X[Q * 9 + 6] = 0, X[Q * 9 + 7] = G * Math.cos(ye), X[Q * 9 + 8] = G * Math.sin(ye);
    }
    const K = new Ae();
    K.setAttribute("position", new ht(X, 3));
    const q = new Float32Array((H + 1) * 3);
    for (let Q = 0; Q <= H; Q++) {
      const he = Q / H * Math.PI * 2;
      q[Q * 3] = 0, q[Q * 3 + 1] = G * Math.cos(he), q[Q * 3 + 2] = G * Math.sin(he);
    }
    const R = new Ae();
    return R.setAttribute("position", new ht(q, 3)), { fill: K, outline: R };
  }
  function C(J, H, G, X) {
    const K = G ?? H * 0.08, q = X ?? J * 0.07, R = J / 2, Q = H / 2, he = Q - K, ye = q / 2, Me = [];
    function W(me, Ve, ve, We) {
      Me.push(0, me, Ve, 0, ve, Ve, 0, ve, We, 0, me, Ve, 0, ve, We, 0, me, We);
    }
    W(-R, -Q, R, -he), W(-ye, -he, ye, he), W(-R, he, R, Q);
    const _e = new Ae();
    _e.setAttribute("position", new ht(new Float32Array(Me), 3));
    const de = new Float32Array([0, -R, -Q, 0, R, -Q, 0, R, -he, 0, ye, -he, 0, ye, he, 0, R, he, 0, R, Q, 0, -R, Q, 0, -R, he, 0, -ye, he, 0, -ye, -he, 0, -R, -he, 0, -R, -Q]), Fe = new Ae();
    return Fe.setAttribute("position", new ht(de, 3)), { fill: _e, outline: Fe };
  }
  function L(J, H, G) {
    const X = J / 2, K = H / 2, q = X - G, R = K - G, Q = [];
    function he(_e, de, Fe, me) {
      Q.push(0, _e, de, 0, Fe, de, 0, Fe, me, 0, _e, de, 0, Fe, me, 0, _e, me);
    }
    he(-X, -K, X, -R), he(-X, R, X, K), he(-X, -R, -q, R), he(q, -R, X, R);
    const ye = new Ae();
    ye.setAttribute("position", new ht(new Float32Array(Q), 3));
    const Me = new Float32Array([0, -X, -K, 0, X, -K, 0, X, -K, 0, X, K, 0, X, K, 0, -X, K, 0, -X, K, 0, -X, -K, 0, -q, -R, 0, q, -R, 0, q, -R, 0, q, R, 0, q, R, 0, -q, R, 0, -q, R, 0, -q, -R]), W = new Ae();
    return W.setAttribute("position", new ht(Me, 3)), { fill: ye, outline: W };
  }
  function N(J, H, G) {
    const X = J / 2, K = H / 2, q = X - G, R = K - G, Q = new Ae(), he = new Float32Array([0, -q, -R, 0, q, -R, 0, q, R, 0, -q, -R, 0, q, R, 0, -q, R]);
    Q.setAttribute("position", new ht(he, 3));
    const ye = [];
    function Me(Fe, me, Ve, ve) {
      ye.push(0, Fe, me, 0, Ve, me, 0, Ve, ve, 0, Fe, me, 0, Ve, ve, 0, Fe, ve);
    }
    Me(-X, -K, X, -R), Me(-X, R, X, K), Me(-X, -R, -q, R), Me(q, -R, X, R);
    const W = new Ae();
    W.setAttribute("position", new ht(new Float32Array(ye), 3));
    const _e = new Float32Array([0, -X, -K, 0, X, -K, 0, X, -K, 0, X, K, 0, X, K, 0, -X, K, 0, -X, K, 0, -X, -K, 0, -q, -R, 0, q, -R, 0, q, -R, 0, q, R, 0, q, R, 0, -q, R, 0, -q, R, 0, -q, -R]), de = new Ae();
    return de.setAttribute("position", new ht(_e, 3)), { concFill: Q, steelFillGeom: W, outline: de };
  }
  function B(J, H, G) {
    const X = [], K = [[0, -J / 2, -H / 2], [0, -J / 2 + G, -H / 2], [0, -J / 2 + G, H / 2 - G], [0, J / 2, H / 2 - G], [0, J / 2, H / 2], [0, -J / 2, H / 2]], q = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ye of q) X.push(...K[ye]);
    const R = new Ae();
    R.setAttribute("position", new ht(new Float32Array(X), 3));
    const Q = [];
    for (let ye = 0; ye < K.length; ye++) {
      const Me = (ye + 1) % K.length;
      Q.push(...K[ye], ...K[Me]);
    }
    const he = new Ae();
    return he.setAttribute("position", new ht(new Float32Array(Q), 3)), { fill: R, outline: he };
  }
  function te(J, H, G, X) {
    const K = X / 2, q = [], R = [[0, -J - K, -H / 2], [0, -G - K, -H / 2], [0, -G - K, H / 2 - G], [0, -K, H / 2 - G], [0, -K, H / 2], [0, -J - K, H / 2]], Q = [[0, K, -H / 2], [0, K + G, -H / 2], [0, K + G, H / 2 - G], [0, J + K, H / 2 - G], [0, J + K, H / 2], [0, K, H / 2]], he = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const _e of he) q.push(...R[_e]);
    for (const _e of he) q.push(...Q[_e]);
    const ye = new Ae();
    ye.setAttribute("position", new ht(new Float32Array(q), 3));
    const Me = [];
    for (const _e of [R, Q]) for (let de = 0; de < _e.length; de++) {
      const Fe = (de + 1) % _e.length;
      Me.push(..._e[de], ..._e[Fe]);
    }
    const W = new Ae();
    return W.setAttribute("position", new ht(new Float32Array(Me), 3)), { fill: ye, outline: W };
  }
  function fe(J, H, G, X) {
    const K = H / 2, q = J, R = [[0, -q, -K], [0, -q, -K + G], [0, -X, -K + G], [0, -X, K - G], [0, -q, K - G], [0, -q, K], [0, 0, K], [0, 0, -K]], Q = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], he = [];
    for (const _e of Q) he.push(...R[_e]);
    const ye = new Ae();
    ye.setAttribute("position", new ht(new Float32Array(he), 3));
    const Me = [];
    for (let _e = 0; _e < R.length; _e++) {
      const de = (_e + 1) % R.length;
      Me.push(...R[_e], ...R[de]);
    }
    const W = new Ae();
    return W.setAttribute("position", new ht(new Float32Array(Me), 3)), { fill: ye, outline: W };
  }
  function we(J, H, G, X, K) {
    const q = H / 2, R = K / 2, Q = [], he = [[0, -J, -q], [0, -J, -q + G], [0, -R - X, -q + G], [0, -R - X, q - G], [0, -J, q - G], [0, -J, q], [0, -R, q], [0, -R, -q]], ye = he.map((Fe) => [Fe[0], -Fe[1], Fe[2]]), Me = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const Fe of Me) Q.push(...he[Fe]);
    for (const Fe of Me) Q.push(...ye[Fe]);
    const W = new Ae();
    W.setAttribute("position", new ht(new Float32Array(Q), 3));
    const _e = [];
    for (const Fe of [he, ye]) for (let me = 0; me < Fe.length; me++) {
      const Ve = (me + 1) % Fe.length;
      _e.push(...Fe[me], ...Fe[Ve]);
    }
    const de = new Ae();
    return de.setAttribute("position", new ht(new Float32Array(_e), 3)), { fill: W, outline: de };
  }
  function O(J, H, G, X) {
    const K = J / 2, q = H / 2, R = X / 2, Q = [[0, -R, -q], [0, R, -q], [0, R, q - G], [0, K, q - G], [0, K, q], [0, -K, q], [0, -K, q - G], [0, -R, q - G]], he = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], ye = [];
    for (const de of he) ye.push(...Q[de]);
    const Me = new Ae();
    Me.setAttribute("position", new ht(new Float32Array(ye), 3));
    const W = [];
    for (let de = 0; de < Q.length; de++) {
      const Fe = (de + 1) % Q.length;
      W.push(...Q[de], ...Q[Fe]);
    }
    const _e = new Ae();
    return _e.setAttribute("position", new ht(new Float32Array(W), 3)), { fill: Me, outline: _e };
  }
  function U(J, H, G = 24) {
    const X = J / 2, K = X - H, q = [];
    for (let ye = 0; ye < G; ye++) {
      const Me = ye / G * Math.PI * 2, W = (ye + 1) / G * Math.PI * 2, _e = Math.cos(Me), de = Math.sin(Me), Fe = Math.cos(W), me = Math.sin(W);
      q.push(0, X * _e, X * de, 0, X * Fe, X * me, 0, K * Fe, K * me), q.push(0, X * _e, X * de, 0, K * Fe, K * me, 0, K * _e, K * de);
    }
    const R = new Ae();
    R.setAttribute("position", new ht(new Float32Array(q), 3));
    const Q = [];
    for (let ye = 0; ye < G; ye++) {
      const Me = ye / G * Math.PI * 2, W = (ye + 1) / G * Math.PI * 2;
      Q.push(0, X * Math.cos(Me), X * Math.sin(Me), 0, X * Math.cos(W), X * Math.sin(W)), Q.push(0, K * Math.cos(Me), K * Math.sin(Me), 0, K * Math.cos(W), K * Math.sin(W));
    }
    const he = new Ae();
    return he.setAttribute("position", new ht(new Float32Array(Q), 3)), { fill: R, outline: he };
  }
  const ce = new pt({ color: 52479, transparent: true, opacity: 0.35, side: Et, depthWrite: false }), Z = new dt({ color: 52479 }), le = new pt({ color: 16750848, transparent: true, opacity: 0.4, side: Et, depthWrite: false }), se = new dt({ color: 16750848 });
  function oe(J, H) {
    const G = Math.abs(H[0] - J[0]), X = Math.abs(H[1] - J[1]), K = Math.abs(H[2] - J[2]);
    return K > G && K > X || X > G && X > K;
  }
  return re.derive(() => {
    var _a, _b;
    y.deformedShape.val, y.secColumns.val, y.secBeams.val, y.secFloor.val;
    const J = y.secColumns.rawVal, H = y.secBeams.rawVal;
    if (!J && !H) {
      S.children.forEach((R) => {
        R instanceof $t && R.dispose();
      }), S.clear();
      return;
    }
    S.children.forEach((R) => {
      R instanceof $t && R.dispose();
    }), S.clear();
    const G = (_a = t.elements) == null ? void 0 : _a.val, X = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!G || !X) return;
    const K = X.sectionShapes, q = y.secFloor.rawVal;
    G.forEach((R, Q) => {
      if (R.length !== 2) return;
      const he = g.rawVal[R[0]], ye = g.rawVal[R[1]];
      if (!he || !ye) return;
      const Me = oe(he, ye);
      if (Me && !J || !Me && !H) return;
      if (q >= 0) {
        const me = Math.min(he[1], ye[1]);
        Math.max(he[1], ye[1]);
        const Ve = y.gridSize.rawVal || 3;
        if (Math.floor(me / Ve + 0.01) !== q) return;
      }
      const W = K == null ? void 0 : K.get(Q);
      if (!W) return;
      const _e = [(he[0] + ye[0]) / 2, (he[1] + ye[1]) / 2, (he[2] + ye[2]) / 2], de = ys(he, ye);
      if (W.type === "CFT") {
        const me = N(W.b, W.h, W.tw ?? W.b * 0.05), Ve = new it(me.concFill, ce);
        Ve.position.set(..._e), Ve.rotation.setFromRotationMatrix(de), S.add(Ve);
        const ve = new it(me.steelFillGeom, le);
        ve.position.set(..._e), ve.rotation.setFromRotationMatrix(de), S.add(ve);
        const We = new Ft(me.outline, se);
        We.position.set(..._e), We.rotation.setFromRotationMatrix(de), S.add(We);
      } else {
        let me, Ve, ve;
        switch (W.type) {
          case "rect":
            me = A(W.b, W.h), Ve = ce, ve = Z;
            break;
          case "circ":
            me = F(W.d), Ve = ce, ve = Z;
            break;
          case "I":
            me = C(W.b, W.h, W.tf, W.tw), Ve = le, ve = se;
            break;
          case "HSS":
            me = L(W.b, W.h, W.tw ?? W.b * 0.05), Ve = le, ve = se;
            break;
          case "CFT":
            me = N(W.b, W.h, W.tw ?? W.b * 0.05), Ve = le, ve = se;
            break;
          case "L":
            me = B(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3), Ve = le, ve = se;
            break;
          case "2L":
            me = te(W.b ?? W.h, W.h, W.t ?? W.tw ?? 3e-3, W.dis ?? 0.01), Ve = le, ve = se;
            break;
          case "C":
          case "coldC":
            me = fe(W.b, W.h, W.tf ?? W.t ?? 3e-3, W.tw ?? W.t ?? 3e-3), Ve = le, ve = se;
            break;
          case "2C":
            me = we(W.b, W.h, W.tf ?? 5e-3, W.tw ?? 5e-3, W.dis ?? 0.01), Ve = le, ve = se;
            break;
          case "T":
            me = O(W.b, W.h, W.tf ?? 0.01, W.tw ?? 6e-3), Ve = le, ve = se;
            break;
          case "pipe":
            me = U(W.d, W.tw ?? W.d * 0.05), Ve = le, ve = se;
            break;
          default:
            return;
        }
        const We = new it(me.fill, Ve);
        We.position.set(..._e), We.rotation.setFromRotationMatrix(de), S.add(We);
        const Oe = new Ft(me.outline, ve);
        Oe.position.set(..._e), Oe.rotation.setFromRotationMatrix(de), S.add(Oe);
      }
      const Fe = Mi(W);
      if (Fe) {
        const Ve = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(W.type) ? "#ff9900" : "#00ccff", ve = new $t(Fe, Ve, "transparent");
        ve.position.set(_e[0], _e[1], _e[2]);
        const We = 0.05 * y.gridSize.rawVal * 0.5;
        ve.updateScale(We * ((b == null ? void 0 : b.rawVal) ?? 1)), z.add(ve);
      }
    });
  }), b && re.derive(() => {
    if (b.val, !y.sections.rawVal) return;
    const J = 0.05 * y.gridSize.val * 0.5;
    z.children.forEach((H) => {
      H instanceof $t && H.updateScale(J * b.rawVal);
    });
  }), re.derive(() => {
    S.visible = y.sections.val;
  }), re.derive(() => {
    z.visible = y.sectionLabels.val;
  }), S;
}
function _i(t) {
  if (!t) return null;
  const y = t.type, g = (N, B) => [N, B], b = (N, B) => [g(-N / 2, -B / 2), g(N / 2, -B / 2), g(N / 2, B / 2), g(-N / 2, B / 2)], S = (N, B = 24) => {
    const te = N / 2, fe = [];
    for (let we = 0; we < B; we++) {
      const O = 2 * Math.PI * we / B;
      fe.push(g(te * Math.cos(O), te * Math.sin(O)));
    }
    return fe;
  }, z = t.b ?? 0, A = t.h ?? 0, F = t.d ?? 0, C = t.tw ?? t.t ?? 0, L = t.tf ?? t.t ?? 0;
  switch (y) {
    case "rect":
      return z && A ? { contorno: b(z, A) } : null;
    case "circ":
      return F ? { contorno: S(F) } : null;
    case "pipe":
      return F && C ? { contorno: S(F), huecos: [S(F - 2 * C).reverse()] } : null;
    case "HSS":
      return z && A && C ? { contorno: b(z, A), huecos: [b(z - 2 * C, A - 2 * (L || C)).reverse()] } : null;
    case "CFT":
      return z && A ? { contorno: b(z, A) } : null;
    case "I":
      return z && A && C && L ? { contorno: [g(-z / 2, -A / 2), g(z / 2, -A / 2), g(z / 2, -A / 2 + L), g(C / 2, -A / 2 + L), g(C / 2, A / 2 - L), g(z / 2, A / 2 - L), g(z / 2, A / 2), g(-z / 2, A / 2), g(-z / 2, A / 2 - L), g(-C / 2, A / 2 - L), g(-C / 2, -A / 2 + L), g(-z / 2, -A / 2 + L)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return z && A && C && L ? { contorno: [g(-z / 2, -A / 2), g(z / 2, -A / 2), g(z / 2, -A / 2 + L), g(-z / 2 + C, -A / 2 + L), g(-z / 2 + C, A / 2 - L), g(z / 2, A / 2 - L), g(z / 2, A / 2), g(-z / 2, A / 2)] } : null;
    case "T":
      return z && A && C && L ? { contorno: [g(-C / 2, -A / 2), g(C / 2, -A / 2), g(C / 2, A / 2 - L), g(z / 2, A / 2 - L), g(z / 2, A / 2), g(-z / 2, A / 2), g(-z / 2, A / 2 - L), g(-C / 2, A / 2 - L)] } : null;
    case "L":
    case "2L":
      return z && A && C ? { contorno: [g(-z / 2, -A / 2), g(z / 2, -A / 2), g(z / 2, -A / 2 + C), g(-z / 2 + C, -A / 2 + C), g(-z / 2 + C, A / 2), g(-z / 2, A / 2)] } : null;
    default:
      return z && A ? { contorno: b(z, A) } : F ? { contorno: S(F) } : null;
  }
}
function ki(t, y, g) {
  if (!t || t <= 0 || !y || !g || y <= 0 || g <= 0) return null;
  const b = Math.sqrt(Math.sqrt(g / y)), S = Math.sqrt(t / b), z = t / S;
  return !isFinite(S) || !isFinite(z) || S <= 0 || z <= 0 ? null : { contorno: [[-S / 2, -z / 2], [S / 2, -z / 2], [S / 2, z / 2], [-S / 2, z / 2]] };
}
function Si(t) {
  const y = new ao();
  t.contorno.forEach(([g, b], S) => S ? y.lineTo(g, b) : y.moveTo(g, b)), y.closePath();
  for (const g of t.huecos ?? []) {
    const b = new ei();
    g.forEach(([S, z], A) => A ? b.lineTo(S, z) : b.moveTo(S, z)), b.closePath(), y.holes.push(b);
  }
  return y;
}
function Pi(t, y, g) {
  const b = new ct();
  b.name = "extrusion";
  const S = new as({ color: 8369151, transparent: true, opacity: 0.92, side: Et }), z = new as({ color: 12623968, transparent: true, opacity: 0.85, side: Et }), A = new as({ color: 11583173, transparent: true, opacity: 0.85, side: Et }), F = new ct();
  F.add(new ua(16777215, 0.55));
  const C = new To(16777215, 0.75);
  C.position.set(30, 25, 40);
  const L = new To(16777215, 0.35);
  L.position.set(-25, -20, 15), F.add(C, L);
  let N = 0;
  return re.derive(() => {
    var _a, _b, _c, _d, _e;
    const B = ((_a = y.extruded) == null ? void 0 : _a.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++N, on: B }, b.visible = B;
    for (const Z of [...b.children]) Z !== F && (b.remove(Z), (_c = (_b = Z.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (b.children.includes(F) || b.add(F), !B) return;
    const te = g.val ?? [], fe = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], we = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, O = we.sectionShapes ?? /* @__PURE__ */ new Map(), U = we.thicknesses ?? /* @__PURE__ */ new Map();
    let ce = "";
    try {
      fe.forEach((Z, le) => {
        var _a2, _b2, _c2;
        if (Z.length === 2) {
          let se = _i(O.get(le)), oe = true;
          if (se || (se = ki((_a2 = we.areas) == null ? void 0 : _a2.get(le), (_b2 = we.momentsOfInertiaY) == null ? void 0 : _b2.get(le), (_c2 = we.momentsOfInertiaZ) == null ? void 0 : _c2.get(le)), oe = false), !se) return;
          const J = te[Z[0]], H = te[Z[1]];
          if (!J || !H) return;
          const G = Math.hypot(H[0] - J[0], H[1] - J[1], H[2] - J[2]);
          if (G < 1e-9) return;
          const X = new ja(Si(se), { depth: G, bevelEnabled: false, curveSegments: 4 });
          X.applyMatrix4(new Ro().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const K = new it(X, oe ? S : z);
          K.position.set(J[0], J[1], J[2]), K.rotation.setFromRotationMatrix(ys(J, H)), b.add(K);
          return;
        }
        if (Z.length === 3 || Z.length === 4) {
          const se = U.get(le);
          if (!se || se <= 0) return;
          const oe = Z.map((me) => te[me]).filter(Boolean);
          if (oe.length < 3) return;
          const J = [oe[1][0] - oe[0][0], oe[1][1] - oe[0][1], oe[1][2] - oe[0][2]], H = [oe[2][0] - oe[0][0], oe[2][1] - oe[0][1], oe[2][2] - oe[0][2]], G = J[1] * H[2] - J[2] * H[1], X = J[2] * H[0] - J[0] * H[2], K = J[0] * H[1] - J[1] * H[0], q = Math.hypot(G, X, K);
          if (q < 1e-12) return;
          const R = [G / q, X / q, K / q], Q = [], he = (me) => oe.map((Ve) => [Ve[0] + R[0] * me, Ve[1] + R[1] * me, Ve[2] + R[2] * me]), ye = Math.abs(R[2]) > 0.5, Me = R[2] > 0 ? -1 : 1, W = he(ye ? 0 : +se / 2), _e2 = he(ye ? Me * se : -se / 2), de = (me, Ve, ve) => Q.push(...me, ...Ve, ...ve);
          for (const me of [W, _e2]) de(me[0], me[1], me[2]), me.length === 4 && de(me[0], me[2], me[3]);
          for (let me = 0; me < oe.length; me++) {
            const Ve = (me + 1) % oe.length;
            de(W[me], _e2[me], _e2[Ve]), de(W[me], _e2[Ve], W[Ve]);
          }
          const Fe = new Ae();
          Fe.setAttribute("position", new Vt(Q, 3)), Fe.computeVertexNormals(), b.add(new it(Fe, A));
        }
      });
    } catch (Z) {
      ce = String((Z == null ? void 0 : Z.message) ?? Z);
    }
    globalThis.__extrusionDebug = { corridas: N, on: B, fallo: ce, nElementos: fe.length, nFormas: O.size, nEspesores: U.size, mallas: b.children.length - 1 };
  }), b;
}
function ya(t, y, g = 0) {
  const b = [y[0] - t[0], y[1] - t[1], y[2] - t[2]], S = Math.hypot(b[0], b[1], b[2]) || 1, z = b[0] / S, A = b[1] / S, F = b[2] / S, C = Math.sqrt(z * z + A * A);
  let L, N, B;
  if (C < 1e-9) {
    const te = F > 0 ? 1 : -1;
    L = [0, 0, te], N = [1, 0, 0], B = [0, te, 0];
  } else L = [z, A, F], N = [-z * F / C, -A * F / C, C], B = [A / C, -z / C, 0];
  if (Math.abs(g) > 1e-12) {
    const te = g * Math.PI / 180, fe = Math.cos(te), we = Math.sin(te), O = N.map((ce, Z) => fe * ce + we * B[Z]), U = B.map((ce, Z) => -we * N[Z] + fe * ce);
    N = O, B = U;
  }
  return { e1: L, e2: N, e3: B };
}
function hs(t, y) {
  if (!y) return [0, 0];
  const g = Number(y[0] ?? 0), b = Number(y[1] ?? 0);
  return t === "bendingsY" ? [g, -b] : [-g, b];
}
function xa(t, y) {
  const g = (b) => b.map((S) => -S);
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
class Eo extends ct {
  constructor(y, g, b, S, z, A, F) {
    super();
    const C = new ao().moveTo(0, 0).lineTo(0, A[1]).lineTo(b, A[1]).lineTo(b, 0).lineTo(0, 0), L = C.getPoints(), N = new Ae().setFromPoints(L);
    this.lines = new Ft(N, new dt({ color: $n().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), F && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const B = new Lo(C), te = new pt({ color: A[1] > 0 ? 24435 : 11411474, side: Et });
    this.mesh = new it(B, te), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), F && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new $t(`${z[1].toFixed(4)}`), this.normalizedResult = A, this.textPosition = io([y, g]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(S), this.add(this.text);
  }
  updateScale(y) {
    this.lines.scale.set(1, y * 2, 1), this.mesh.scale.set(1, y * 2, 1), this.text.updateScale(y * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * y);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class us extends ct {
  constructor(y, g, b, S, z, A, F) {
    super();
    const C = z[0] * b / (z[0] + z[1]), L = z[0] * z[1] > 0;
    if (this.text = new $t(`${z[0].toFixed(4)}`), this.text2 = new $t(`${(z[1] * -1).toFixed(4)}`), this.normalizedResult = A, this.textPosition = ps(y, g), this.text2Position = ps(g, y), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(S), this.text2.rotation.setFromRotationMatrix(S), this.add(this.text, this.text2), L) {
      const N = new ao().moveTo(0, 0).lineTo(0, A[0]).lineTo(C, 0).lineTo(0, 0), B = new ao().moveTo(C, 0).lineTo(b, -A[1]).lineTo(b, 0).lineTo(C, 0), te = N.getPoints(), fe = B.getPoints(), we = new Ae().setFromPoints(te), O = new Ae().setFromPoints(fe), U = new dt({ color: $n().resultOutline });
      this.lines = new Ft(we, U), this.lines2 = new Ft(O, U), this.lines.position.set(...y), this.lines2.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), this.lines2.rotation.setFromRotationMatrix(S), F && this.lines.rotateX(Math.PI / 2), F && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ce = new Lo(N), Z = new Lo(B), le = new pt({ color: A[0] > 0 ? 24435 : 11411474, side: Et }), se = new pt({ color: -A[1] > 0 ? 24435 : 11411474, side: Et });
      this.mesh = new it(ce, le), this.mesh2 = new it(Z, se), this.mesh.position.set(...y), this.mesh2.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), this.mesh2.rotation.setFromRotationMatrix(S), F && this.mesh.rotateX(Math.PI / 2), F && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const N = new ao().moveTo(0, 0).lineTo(0, A[0]).lineTo(b, -A[1]).lineTo(b, 0).lineTo(0, 0), B = N.getPoints(), te = new Ae().setFromPoints(B);
      this.lines = new Ft(te, new dt({ color: $n().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), F && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const fe = new Lo(N), we = new pt({ color: A[0] > 0 ? 24435 : 11411474, side: Et });
      this.mesh = new it(fe, we), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), F && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var ga = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(ga || {});
function Ci(t, y, g, b) {
  const S = () => {
    const F = g.rawVal;
    if (!(F == null ? void 0 : F.length)) return 0.05 * y.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of F) for (let te = 0; te < 3; te++) B[te] < C[te] && (C[te] = B[te]), B[te] > L[te] && (L[te] = B[te]);
    const N = Math.hypot(L[0] - C[0], L[1] - C[1], L[2] - C[2]);
    return !isFinite(N) || N <= 0 ? 0.05 * y.gridSize.rawVal : 0.025 * N;
  }, z = new ct(), A = { normals: Eo, shearsY: Eo, shearsZ: Eo, torsions: Eo, bendingsY: us, bendingsZ: us };
  return re.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, g.val, y.frameResults.val == "none") return;
    z.children.forEach((C) => C.dispose()), z.clear();
    const F = ga[y.frameResults.rawVal];
    (_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.rawVal[F]) == null ? void 0 : _b.forEach((C, L) => {
      var _a2, _b2, _c, _d, _e, _f;
      const N = ((_a2 = t.elements) == null ? void 0 : _a2.rawVal[L]) ?? [0, 1], B = g.rawVal[N[0]], te = g.rawVal[N[1]];
      if (!B || !te) return;
      const fe = new E(...te).distanceTo(new E(...B)), we = zi((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[F]), O = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, L)) ?? 0, U = ya(B, te, O), ce = xa(F, U), Z = new E(...U.e1), le = new E(...ce), se = new Ro().makeBasis(Z, le, Z.clone().cross(le)), [oe, J] = hs(F, C), H = A[F] === us ? [oe, -J] : [oe, J], G = H.map((K) => K / (we === 0 ? 1 : we)), X = new A[F](B, te, fe, se, H, G, false);
      X.updateScale(S() * b.rawVal), z.add(X);
    });
  }), re.derive(() => {
    if (b.val, y.frameResults.rawVal == "none") return;
    y.gridSize.val;
    const F = S();
    z.children.forEach((C) => C.updateScale(F * b.rawVal));
  }), re.derive(() => {
    z.visible = y.frameResults.val != "none";
  }), z;
}
function zi(t) {
  let y = 0;
  return t == null ? void 0 : t.forEach((g) => {
    const b = Math.max(...(g ?? [0, 0]).map((S) => Math.abs(S)));
    b > y && (y = b);
  }), y;
}
class Ai extends ct {
  constructor(y, g, b) {
    super();
    const S = g === xs.reactions;
    b[0] && (this.xText1 = new $t(`${S ? "Fx" : "Dx"}: ` + b[0].toFixed(4))), b[3] && (this.xText2 = new $t(`${S ? "Mx" : "Rx"}: ` + b[3].toFixed(4))), b[1] && (this.yText1 = new $t(`${S ? "Fy" : "Dy"}: ` + b[1].toFixed(4))), b[4] && (this.yText2 = new $t(`${S ? "My" : "Ry"}: ` + b[4].toFixed(4))), b[2] && (this.zText1 = new $t(`${S ? "Fz" : "Dz"}: ` + b[2].toFixed(4))), b[5] && (this.zText2 = new $t(`${S ? "Mz" : "Rz"}: ` + b[5].toFixed(4))), (b[0] || b[3]) && (this.xArrow = new Vn(new E(1, 0, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (b[1] || b[4]) && (this.yArrow = new Vn(new E(0, 1, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (b[2] || b[5]) && (this.zArrow = new Vn(new E(0, 0, 1), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...y), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(y) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o;
    (_a = this.xArrow) == null ? void 0 : _a.scale.set(y, y, y), (_b = this.yArrow) == null ? void 0 : _b.scale.set(y, y, y), (_c = this.zArrow) == null ? void 0 : _c.scale.set(y, y, y), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * y, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * y, 0, 0.5 * y), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * y, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * y, 0.5 * y), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * y), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * y + 0.5 * y), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * y), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * y), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * y), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * y), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * y), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * y);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = this.xArrow) == null ? void 0 : _a.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var xs = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(xs || {});
function Fi(t, y, g, b) {
  const S = new ct();
  return re.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, y.nodeResults.val == "none") return;
    S.children.forEach((F) => F.dispose()), S.clear();
    const z = xs[y.nodeResults.rawVal], A = 0.05 * y.gridSize.val;
    (_b = (_a = t.deformOutputs) == null ? void 0 : _a.val[z]) == null ? void 0 : _b.forEach((F, C) => {
      const L = new Ai(g.rawVal[C], z, F ?? [0, 0, 0, 0, 0, 0]);
      L.updateScale(A * b.rawVal), S.add(L);
    });
  }), re.derive(() => {
    if (b.val, y.nodeResults.rawVal == "none") return;
    const z = 0.05 * y.gridSize.val;
    S.children.forEach((A) => A.updateScale(z * b.rawVal));
  }), re.derive(() => {
    S.visible = y.nodeResults.val != "none";
  }), S;
}
function Ei({ drawingObj: t, gridObj: y, scene: g, getActiveCamera: b, controls: S, gridSize: z, derivedDisplayScale: A, rendererElm: F, viewerRender: C }) {
  var _a2;
  const L = new is(), N = new ti(), B = (e) => {
    const o = F.getBoundingClientRect(), s = e.clientX - o.left, n = e.clientY - o.top, a = o.width || 1, c = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const r = a / 2;
      if (s >= r) return N.x = (s - r) / r * 2 - 1, N.y = -(n / c) * 2 + 1, window.__hekatanSplitCamera ?? b();
      N.x = s / r * 2 - 1;
    } else N.x = s / a * 2 - 1;
    return N.y = -(n / c) * 2 + 1, b();
  }, te = new it(new kn(1e4, 1e4), new pt({ side: Et, transparent: true, opacity: 0, depthWrite: false }));
  te.visible = true, te.frustumCulled = false, g.add(te);
  const fe = (e, o, s) => {
    const n = new it(new kn(1e4, 1e4), new pt({ side: Et, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(e, o, s), n.visible = false, n.frustumCulled = false, g.add(n), n;
  }, we = fe(Math.PI / 2, 0, 0), O = fe(0, Math.PI / 2, 0);
  let U = false, ce = null, Z = null, le = null;
  const se = new Ft(new Ae(), new dt({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  se.name = "ref-ifc-cadena", se.renderOrder = 1e3, se.frustumCulled = false, se.visible = false, g.add(se);
  const oe = (e, o, s) => Math.round(e * 1e3) + "," + Math.round(o * 1e3) + "," + Math.round(s * 1e3), J = (e) => {
    const o = /* @__PURE__ */ new Map();
    for (let s = 0; s + 0 < e.length / 6; s++) {
      const n = 6 * s;
      for (const a of [oe(e[n], e[n + 1], e[n + 2]), oe(e[n + 3], e[n + 4], e[n + 5])]) {
        const c = o.get(a);
        c ? c.push(s) : o.set(a, [s]);
      }
    }
    return o;
  }, H = (e) => {
    const { S: o, adj: s } = e, n = (x, v) => new E(o[6 * x + 3 * v], o[6 * x + 3 * v + 1], o[6 * x + 3 * v + 2]), a = /* @__PURE__ */ new Set([e.s]), c = (x, v) => {
      const V = [];
      let k = x, P = v;
      for (let $ = 0; $ < 3e3; $++) {
        const T = (s.get(oe(P.x, P.y, P.z)) || []).filter((qe) => !a.has(qe));
        if (T.length !== 1) break;
        const I = T[0], Y = n(I, 0), ee = n(I, 1), pe = Y.distanceTo(P) < ee.distanceTo(P) ? ee : Y, be = P.clone().sub(k).normalize(), Je = pe.clone().sub(P).normalize();
        if (be.dot(Je) < Math.cos(35 * Math.PI / 180)) break;
        a.add(I), V.push(pe), k = P, P = pe;
      }
      return V;
    }, i = n(e.s, 0), r = n(e.s, 1), l = c(i, r), f = c(r, i), d = [...f.reverse(), i, r, ...l], w = f.length;
    if (d.length < 6) return d;
    const p = [], h = [];
    for (let x = 1; x < d.length; x++) p.push(d[x].distanceTo(d[x - 1]));
    for (let x = 1; x < d.length - 1; x++) {
      const v = d[x].clone().sub(d[x - 1]).normalize(), V = d[x + 1].clone().sub(d[x]).normalize();
      h.push(Math.acos(Math.max(-1, Math.min(1, v.dot(V)))) / Math.max(1e-6, (p[x - 1] + p[x]) / 2));
    }
    const M = h.map((x, v) => {
      let V = 0, k = 0;
      for (let P = v - 1; P <= v + 1; P++) P >= 0 && P < h.length && (V += h[P], k++);
      return V / k;
    }), _ = [];
    for (let x = 3; x < M.length - 3; x++) {
      const v = (M[x - 3] + M[x - 2] + M[x - 1]) / 3, V = (M[x + 1] + M[x + 2] + M[x + 3]) / 3, k = Math.min(v, V), P = Math.max(v, V);
      P > 0.03 && P / Math.max(k, 1e-6) > 2.2 && Math.abs(M[x] - (v + V) / 2) < P && (!_.length || x - _[_.length - 1] > 3) && _.push(x + 1);
    }
    let m = 0, u = d.length - 1;
    for (const x of _) x <= w && x > m && (m = x), x > w && x < u && (u = x);
    return d.slice(m, u + 1);
  }, G = (e) => {
    if (le = e, !e || e.length < 2) {
      se.visible = false;
      return;
    }
    se.geometry.dispose(), se.geometry = new Ae().setFromPoints(e), se.visible = true;
  }, X = (e) => {
    let o = 0;
    for (let w = 1; w < e.length - 1; w++) {
      const p = e[w].clone().sub(e[w - 1]).normalize(), h = e[w + 1].clone().sub(e[w]).normalize();
      o += Math.acos(Math.max(-1, Math.min(1, p.dot(h))));
    }
    const s = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (o < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const n = String(window.__hekatanArcModo ?? "angulo"), a = n === "x" ? 0 : n === "y" ? 1 : n === "z" ? 2 : -1, c = [0];
    for (let w = 1; w < e.length; w++) c.push(c[w - 1] + e[w].distanceTo(e[w - 1]));
    const i = (w, p) => {
      for (let h = 1; h < e.length; h++) {
        const M = w(e[h - 1], h - 1), _ = w(e[h], h);
        if (M <= p && p <= _ || _ <= p && p <= M) {
          const m = Math.abs(_ - M) < 1e-12 ? 0 : (p - M) / (_ - M);
          return e[h - 1].clone().lerp(e[h], m);
        }
      }
      return e[e.length - 1].clone();
    }, r = [], l = a >= 0 ? e[0].getComponent(a) : 0, f = a >= 0 ? e[e.length - 1].getComponent(a) : 0, d = a >= 0 && Math.abs(f - l) > 1e-6 && e.every((w, p) => p === 0 || (w.getComponent(a) - e[p - 1].getComponent(a)) * (f - l) >= -1e-6);
    for (let w = 0; w <= s; w++) {
      const p = d ? i((h) => h.getComponent(a), l + (f - l) * w / s) : i((h, M) => c[M], c[c.length - 1] * w / s);
      r.push([p.x, p.y, p.z]);
    }
    return r[0] = e[0].toArray(), r[s] = e[e.length - 1].toArray(), r;
  };
  window.__hekatanCadenaIfc = () => (le || []).map((e) => [e.x, e.y, e.z]);
  const K = /* @__PURE__ */ new Map(), q = (e) => {
    const o = K.get(e.id);
    if (o) return o;
    const s = e.geometry.getAttribute("position"), n = s ? Math.floor(s.count / 3) : 0, a = new Float64Array(n * 9), c = new Float64Array(n * 3), i = new Int32Array(n * 3).fill(-1);
    if (s) {
      e.updateMatrixWorld();
      const l = new E();
      for (let M = 0; M < n * 3; M++) l.fromBufferAttribute(s, M).applyMatrix4(e.matrixWorld), a[3 * M] = l.x, a[3 * M + 1] = l.y, a[3 * M + 2] = l.z;
      const f = new E(), d = new E(), w = new E(), p = (M) => Math.round(a[3 * M] * 1e3) + "," + Math.round(a[3 * M + 1] * 1e3) + "," + Math.round(a[3 * M + 2] * 1e3), h = /* @__PURE__ */ new Map();
      for (let M = 0; M < n; M++) {
        const _ = 3 * M;
        f.set(a[3 * (_ + 1)] - a[3 * _], a[3 * (_ + 1) + 1] - a[3 * _ + 1], a[3 * (_ + 1) + 2] - a[3 * _ + 2]), d.set(a[3 * (_ + 2)] - a[3 * _], a[3 * (_ + 2) + 1] - a[3 * _ + 1], a[3 * (_ + 2) + 2] - a[3 * _ + 2]), w.crossVectors(f, d).normalize(), c[3 * M] = w.x, c[3 * M + 1] = w.y, c[3 * M + 2] = w.z;
        for (let m = 0; m < 3; m++) {
          const u = p(_ + m), x = p(_ + (m + 1) % 3), v = u < x ? u + "|" + x : x + "|" + u, V = h.get(v);
          V ? V.push(M, m) : h.set(v, [M, m]);
        }
      }
      for (const M of h.values()) M.length === 4 && (i[3 * M[0] + M[1]] = M[2], i[3 * M[2] + M[3]] = M[0]);
    }
    const r = { V: a, N: c, vec: i, n };
    return K.set(e.id, r), r;
  }, R = new it(new Ae(), new pt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Et }));
  R.name = "ref-ifc-cara", R.renderOrder = 999, R.frustumCulled = false, R.visible = false, g.add(R);
  let Q = null;
  const he = (e, o) => {
    const s = Math.cos(12 * Math.PI / 180), n = Math.cos(80 * Math.PI / 180), a = [e.N[3 * o], e.N[3 * o + 1], e.N[3 * o + 2]], c = new Uint8Array(e.n), i = [], r = [o];
    for (c[o] = 1; r.length && i.length < 4e4; ) {
      const l = r.pop();
      i.push(l);
      for (let f = 0; f < 3; f++) {
        const d = e.vec[3 * l + f];
        if (d < 0 || c[d]) continue;
        const w = e.N[3 * l] * e.N[3 * d] + e.N[3 * l + 1] * e.N[3 * d + 1] + e.N[3 * l + 2] * e.N[3 * d + 2], p = a[0] * e.N[3 * d] + a[1] * e.N[3 * d + 1] + a[2] * e.N[3 * d + 2];
        w >= s && p >= n && (c[d] = 1, r.push(d));
      }
    }
    return i;
  }, ye = (e, o, s) => {
    if (!e || o < 0 || !s) {
      Q && (Q = null, R.visible = false);
      return;
    }
    if (Q && Q.m === e && Q.tris.indexOf(o) >= 0) {
      Q.punto = s.clone();
      return;
    }
    const n = q(e), a = he(n, o), c = new Float32Array(a.length * 9), i = new E();
    let r = true;
    a.forEach((l, f) => {
      for (let d = 0; d < 9; d++) c[9 * f + d] = n.V[9 * l + d];
      i.x += n.N[3 * l], i.y += n.N[3 * l + 1], i.z += n.N[3 * l + 2];
    }), i.normalize();
    for (const l of a) if (i.x * n.N[3 * l] + i.y * n.N[3 * l + 1] + i.z * n.N[3 * l + 2] < Math.cos(5 * Math.PI / 180)) {
      r = false;
      break;
    }
    R.geometry.dispose(), R.geometry = new Ae(), R.geometry.setAttribute("position", new ht(c, 3)), R.material.color.set(r ? 3718648 : 16096779), R.visible = true, Q = { m: e, t0: o, tris: a, normal: i, plana: r, punto: s.clone() };
  }, Me = (e, o) => {
    const s = new Uint8Array(e.n);
    for (const d of o) s[d] = 1;
    const n = (d) => Math.round(e.V[3 * d] * 1e3) + "," + Math.round(e.V[3 * d + 1] * 1e3) + "," + Math.round(e.V[3 * d + 2] * 1e3), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
    for (const d of o) for (let w = 0; w < 3; w++) {
      const p = e.vec[3 * d + w];
      if (p >= 0 && s[p]) continue;
      const h = 3 * d + w, M = 3 * d + (w + 1) % 3, _ = n(h), m = n(M);
      c.set(_, new E(e.V[3 * h], e.V[3 * h + 1], e.V[3 * h + 2])), c.set(m, new E(e.V[3 * M], e.V[3 * M + 1], e.V[3 * M + 2])), (a.get(_) || a.set(_, []).get(_)).push(m), (a.get(m) || a.set(m, []).get(m)).push(_);
    }
    const i = /* @__PURE__ */ new Set();
    let r = [];
    for (const d of a.keys()) {
      if (i.has(d)) continue;
      const w = [d];
      i.add(d);
      let p = "", h = d;
      for (let M = 0; M < 1e5; M++) {
        const _ = (a.get(h) || []).find((m) => m !== p && !i.has(m));
        if (!_) break;
        w.push(_), i.add(_), p = h, h = _;
      }
      w.length > r.length && (r = w);
    }
    const l = r.map((d) => c.get(d)), f = [];
    for (let d = 0; d < l.length; d++) {
      const w = l[(d + l.length - 1) % l.length], p = l[d], h = l[(d + 1) % l.length];
      if (p.distanceTo(w) < 1e-3) continue;
      const M = p.clone().sub(w).normalize(), _ = h.clone().sub(p).normalize();
      M.dot(_) > Math.cos(3 * Math.PI / 180) || f.push(p);
    }
    return f;
  }, W = (e, o, s) => {
    const a = new is(o.clone().addScaledVector(s, -2e-3), s.clone().negate(), 0, 3).intersectObject(e, false);
    return a.length ? a[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, o, s, n = 2) => {
    const a = new E(e[0], e[1], e[2]), c = new E(o[0], o[1], o[2]).normalize();
    let i = null;
    for (const r of [1, -1]) {
      const f = new is(a, c.clone().multiplyScalar(r), 0, n).intersectObjects(s, false);
      f.length && (i == null || f[0].distance < i) && (i = f[0].distance);
    }
    return i;
  }, window.__hekatanCaraIfc = () => Q ? { tris: Q.tris.length, plana: Q.plana, normal: Q.normal.toArray(), punto: Q.punto.toArray(), contorno: Me(q(Q.m), Q.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const _e = /* @__PURE__ */ new Map(), de = new Jt(new Ae(), new dt({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  de.name = "ref-ifc-bordes", de.frustumCulled = false, de.visible = false, g.add(de);
  const Fe = 1, me = (e, o, s) => Math.floor(e / Fe) + "," + Math.floor(o / Fe) + "," + Math.floor(s / Fe), Ve = (e) => {
    const o = _e.get(e.id);
    if (o) return o;
    const s = e.geometry.getAttribute("position"), n = [], a = /* @__PURE__ */ new Map();
    if (s) {
      e.updateMatrixWorld();
      const i = Math.floor(s.count / 3), r = new Float64Array(s.count * 3), l = new E();
      for (let m = 0; m < s.count; m++) l.fromBufferAttribute(s, m).applyMatrix4(e.matrixWorld), r[3 * m] = l.x, r[3 * m + 1] = l.y, r[3 * m + 2] = l.z;
      const f = (m) => Math.round(r[3 * m] * 1e3) + "," + Math.round(r[3 * m + 1] * 1e3) + "," + Math.round(r[3 * m + 2] * 1e3), d = new Float64Array(i * 3), w = new E(), p = new E(), h = new E();
      for (let m = 0; m < i; m++) {
        const u = 3 * m, x = 3 * m + 1, v = 3 * m + 2;
        w.set(r[3 * x] - r[3 * u], r[3 * x + 1] - r[3 * u + 1], r[3 * x + 2] - r[3 * u + 2]), p.set(r[3 * v] - r[3 * u], r[3 * v + 1] - r[3 * u + 1], r[3 * v + 2] - r[3 * u + 2]), h.crossVectors(w, p).normalize(), d[3 * m] = h.x, d[3 * m + 1] = h.y, d[3 * m + 2] = h.z;
      }
      const M = /* @__PURE__ */ new Map();
      for (let m = 0; m < i; m++) for (let u = 0; u < 3; u++) {
        const x = 3 * m + u, v = 3 * m + (u + 1) % 3, V = f(x), k = f(v), P = V < k ? V + "|" + k : k + "|" + V, $ = M.get(P);
        $ ? $.push(m) : M.set(P, [m, x, v]);
      }
      const _ = Math.cos(25 * Math.PI / 180);
      for (const m of M.values()) {
        const u = m[0], x = m[1], v = m[2];
        let V = m.length === 3;
        if (!V && m.length === 4) {
          const P = m[3], $ = d[3 * u] * d[3 * P] + d[3 * u + 1] * d[3 * P + 1] + d[3 * u + 2] * d[3 * P + 2];
          V = Math.abs($) < _;
        }
        if (!V) continue;
        const k = n.length / 6;
        n.push(r[3 * x], r[3 * x + 1], r[3 * x + 2], r[3 * v], r[3 * v + 1], r[3 * v + 2]);
        for (const [P, $, T] of [[r[3 * x], r[3 * x + 1], r[3 * x + 2]], [r[3 * v], r[3 * v + 1], r[3 * v + 2]], [(r[3 * x] + r[3 * v]) / 2, (r[3 * x + 1] + r[3 * v + 1]) / 2, (r[3 * x + 2] + r[3 * v + 2]) / 2]]) {
          const I = me(P, $, T), Y = a.get(I);
          Y ? Y[Y.length - 1] !== k && Y.push(k) : a.set(I, [k]);
        }
      }
    }
    const c = { segs: new Float32Array(n), celdas: a };
    return _e.set(e.id, c), c;
  };
  let ve = "";
  const We = (e) => {
    const o = e.map((i) => i.id).join(",");
    if (o === ve) return;
    ve = o;
    const s = e.map((i) => Ve(i).segs);
    let n = 0;
    for (const i of s) n += i.length;
    const a = new Float32Array(n);
    let c = 0;
    for (const i of s) a.set(i, c), c += i.length;
    de.geometry.dispose(), de.geometry = new Ae(), de.geometry.setAttribute("position", new ht(a, 3)), de.visible = n > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    de.visible = ve !== "" && window.__hekatanRefIfcBordes !== false, C();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const o of _e.values()) e += o.segs.length / 6;
    return e;
  };
  const Oe = (e, o) => {
    const s = window.__hekatanCursorPx;
    if (!s) return null;
    const n = Ve(e), a = n.segs, c = Math.floor(o.x / Fe), i = Math.floor(o.y / Fe), r = Math.floor(o.z / Fe), l = /* @__PURE__ */ new Set();
    let f = bn, d = null, w = bn, p = null, h = -1;
    const M = new E(), _ = new E();
    for (let m = -1; m <= 1; m++) for (let u = -1; u <= 1; u++) for (let x = -1; x <= 1; x++) {
      const v = n.celdas.get(c + m + "," + (i + u) + "," + (r + x));
      if (v) for (const V of v) {
        if (l.has(V)) continue;
        l.add(V);
        const k = 6 * V;
        M.set(a[k], a[k + 1], a[k + 2]), _.set(a[k + 3], a[k + 4], a[k + 5]);
        const P = An(M.x, M.y, M.z), $ = An(_.x, _.y, _.z);
        if (!P || !$) continue;
        const T = Math.hypot(P.x - s.x, P.y - s.y), I = Math.hypot($.x - s.x, $.y - s.y);
        T < f && (f = T, d = M.clone()), I < f && (f = I, d = _.clone());
        const Y = $.x - P.x, ee = $.y - P.y, pe = Y * Y + ee * ee || 1e-9;
        let be = ((s.x - P.x) * Y + (s.y - P.y) * ee) / pe;
        be = Math.max(0, Math.min(1, be));
        const Je = Math.hypot(s.x - (P.x + be * Y), s.y - (P.y + be * ee));
        Je < w && (w = Je, p = M.clone().lerp(_, be), h = V);
      }
    }
    return h >= 0 && (n.adj || (n.adj = J(n.segs)), Z = { S: n.segs, adj: n.adj, s: h }), d ? { tipo: "ifcVert", punto: d } : p ? { tipo: "ifcEdge", punto: p } : null;
  }, vt = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (g.traverse((c) => {
      var _a4;
      ((_a4 = c.userData) == null ? void 0 : _a4.refIfc) && c.isMesh && e.push(c);
    }), !e.length) return de.visible = false, ve = "", null;
    We(e);
    const o = L.intersectObjects(e, false).filter((c) => {
      const i = c.object.material;
      return (i && i.clippingPlanes || []).every((l) => l.distanceToPoint(c.point) >= 0);
    });
    if (!o.length) return null;
    const s = o[0], n = o[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? ye(s.object, s.faceIndex ?? -1, s.point) : Q && ye(null, -1, null);
    const a = Oe(s.object, s.point);
    if (a) return ce = { tipo: a.tipo }, [{ ...s, point: a.punto }];
    if (n && n.object === s.object && n.distance - s.distance <= 1.2) {
      const c = s.point.clone().add(n.point).multiplyScalar(0.5);
      return ce = { tipo: "ifcAxis" }, [{ ...s, point: c }];
    }
    return ce = { tipo: "ifc" }, [s];
  };
  let Mt = "", xe = new Float32Array(0);
  const D = new Jt(new Ae(), new dt({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  D.name = "ref-ifc-seccion", D.renderOrder = 998, D.frustumCulled = false, D.visible = false, g.add(D);
  const ne = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return D.visible = false, xe = new Float32Array(0);
    const o = [];
    e.enableX && o.push([0, +e.posX]), e.enableY && o.push([1, +e.posY]), e.enableZ && o.push([2, +e.posZ]);
    const s = [];
    g.traverse((c) => {
      var _a3;
      ((_a3 = c.userData) == null ? void 0 : _a3.refIfc) && c.isMesh && s.push(c);
    });
    const n = JSON.stringify(o) + "|" + s.map((c) => c.id).join(",");
    if (n === Mt) return xe;
    Mt = n;
    const a = [];
    if (o.length && s.length) {
      const c = [new E(), new E(), new E()];
      for (const i of s) {
        const r = i.geometry.getAttribute("position");
        if (r) {
          i.updateMatrixWorld();
          for (let l = 0; l + 2 < r.count; l += 3) {
            for (let f = 0; f < 3; f++) c[f].fromBufferAttribute(r, l + f).applyMatrix4(i.matrixWorld);
            for (const [f, d] of o) {
              const w = [c[0].getComponent(f) - d, c[1].getComponent(f) - d, c[2].getComponent(f) - d], p = [];
              for (let h = 0; h < 3; h++) {
                const M = c[h], _ = c[(h + 1) % 3], m = w[h], u = w[(h + 1) % 3];
                (m < 0 && u >= 0 || m >= 0 && u < 0) && p.push(M.clone().lerp(_, m / (m - u)));
              }
              p.length === 2 && a.push(p[0].x, p[0].y, p[0].z, p[1].x, p[1].y, p[1].z);
            }
          }
        }
      }
    }
    return xe = new Float32Array(a), D.geometry.dispose(), D.geometry = new Ae(), D.geometry.setAttribute("position", new ht(xe, 3)), D.visible = xe.length > 0, xe;
  };
  let j = null, ae = null;
  const Ce = (e, o) => {
    const s = ne();
    if (!s.length) return null;
    let n = bn * 2, a = null, c = -1;
    const i = new E(), r = new E();
    for (let l = 0; l + 5 < s.length; l += 6) {
      i.set(s[l], s[l + 1], s[l + 2]), r.set(s[l + 3], s[l + 4], s[l + 5]);
      const f = An(i.x, i.y, i.z), d = An(r.x, r.y, r.z);
      if (!f || !d) continue;
      const w = d.x - f.x, p = d.y - f.y, h = w * w + p * p || 1e-9;
      let M = ((e - f.x) * w + (o - f.y) * p) / h;
      M = Math.max(0, Math.min(1, M));
      const _ = Math.hypot(e - (f.x + M * w), o - (f.y + M * p));
      _ < n && (n = _, a = i.clone().lerp(r, M), c = l / 6);
    }
    return c >= 0 && (ae !== s && (j = J(s), ae = s), Z = { S: s, adj: j, s: c }), a;
  };
  let Se = null;
  window.__hekatanSeccionIfc = () => ne().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const o = ne(), s = [], n = Math.max(1, Math.floor(o.length / 6 / e));
    for (let a = 0; a + 2 < o.length; a += 6 * n) s.push([o[a], o[a + 1], o[a + 2]]);
    return s;
  };
  const ge = () => {
    ce = null;
    const e = vt();
    if (e) return e;
    if (U) return L.intersectObjects([te], false);
    if (we.visible = !!window.__hekatanGridPlaneXZ, O.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ut.visible) {
      const n = L.intersectObjects([Ut, sn, an], false);
      if (n.length > 0) return n;
    }
    const s = [te];
    return we.visible && s.push(we), O.visible && s.push(O), xn.visible && Nn.length > 0 && s.push(...Nn), L.intersectObjects(s, false);
  }, Le = new $o(new Ae(), new Io()), Ne = new $o(new Ae(), new Io({ color: "gray", sizeAttenuation: false, size: 6 })), tt = new $o(new Ae(), new Io({ color: "orange", sizeAttenuation: false, size: 5 }));
  g.add(tt);
  const Pe = document.createElement("input");
  Pe.id = "hk-rubber-label", Pe.type = "text", Pe.spellcheck = false, Pe.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Pe.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(Pe);
  let Te = null, lt = null, Qe = false;
  const ke = new E(), Be = (e, o, s, n, a, c) => {
    const i = n - e, r = a - o, l = c - s, f = Math.hypot(i, r, l);
    if (f < 0.01) {
      Pe.style.display = "none";
      return;
    }
    Te = [e, o, s], lt = [i / f, r / f, l / f], ke.set((e + n) / 2, (o + a) / 2, (s + c) / 2), ke.project(b());
    const d = F.getBoundingClientRect(), w = d.left + (ke.x * 0.5 + 0.5) * d.width, p = d.top + (-ke.y * 0.5 + 0.5) * d.height;
    if (Pe.style.left = w + "px", Pe.style.top = p + "px", Pe.style.display = "block", !Qe) {
      if (Pe.value = `${f.toFixed(2)} m`, document.activeElement !== Pe) {
        const h = document.activeElement;
        h && (h.tagName === "INPUT" || h.tagName === "TEXTAREA") && h !== Pe || Pe.focus({ preventScroll: true });
      }
      try {
        Pe.select();
      } catch {
      }
    }
  }, mt = () => {
    Pe.style.display = "none", Te = null, lt = null, Qe = false, document.activeElement === Pe && Pe.blur();
  }, nt = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      Fn = e, ie(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), Pe.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ze.length === 1) {
      const d = Ze[0];
      Ze = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, d[0], d[1], d[2], e), ie(`\u2713 C\xEDrculo r=${e} m en (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}).`);
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
      St = e, ie(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), Pe.blur();
      return;
    }
    if (!Te || !lt || !t.polylines) return;
    let s = lt[0], n = lt[1], a = lt[2];
    kt === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : kt === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : kt === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const c = Te[0] + s * e, i = Te[1] + n * e, r = Te[2] + a * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [c, i, r]];
    const l = t.polylines.rawVal, f = l.length ? l[l.length - 1] : [];
    t.polylines.val = [...l.slice(0, -1), [...f, t.points.rawVal.length - 1]], Pe.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    C();
  }, _t = (e) => {
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
        const [c, i, r] = a;
        return { kind: "relSpherical", L: c, az: i, el: r };
      }
      return null;
    }
    if (o.includes(",")) {
      const a = o.split(",").map((l) => parseFloat(l.trim()));
      if (a.some(isNaN)) return null;
      const [c, i, r = 0] = a;
      return s ? { kind: "relCart", dx: c, dy: i, dz: r } : { kind: "absCart", x: c, y: i, z: r };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
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
      const o = e.az * Math.PI / 180, s = e.el * Math.PI / 180, n = e.L * Math.cos(s);
      return [Te[0] + n * Math.cos(o), Te[1] + n * Math.sin(o), Te[2] + e.L * Math.sin(s)];
    }
    return null;
  }, ot = (e) => {
    var _a3, _b;
    if (!t.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, e];
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    t.polylines.val = [...o.slice(0, -1), [...s, t.points.rawVal.length - 1]], Te = e, Pe.blur();
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
    if (o.kind === "length") return nt(o.L), true;
    const s = Dt(o);
    if (!s) return false;
    Zs(new E(s[0], s[1], s[2]), null), Te = s, Pe.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, Pe.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const s = _t(Pe.value);
      if (!s) return;
      if (Qe = false, s.kind === "length") nt(s.L), ie(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = Dt(s);
        if (!n) return;
        ot(n);
        const a = s.kind;
        ie(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), Qe = false, Pe.blur();
      return;
    }
    const o = e.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!Qe && Pe.style.display === "block") try {
          Pe.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (Qe = true);
  }), window.addEventListener("keydown", (e) => {
    if (!Te || !lt || document.activeElement === Pe) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (Pe.value = e.key, Pe.focus(), Pe.setSelectionRange(1, 1), e.preventDefault());
  });
  const Ie = document.createElement("div");
  Ie.id = "hk-coord-readout", Ie.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Ie.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Ie);
  const Re = document.createElement("div");
  Re.id = "hk-coord-fixed", Re.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Re.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Re);
  const Ye = new Ft(new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new no({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  Ye.frustumCulled = false, Ye.visible = false, Ye.name = "rubberBand", g.add(Ye), window.__hekatanRubberBand = Ye;
  const $e = new Ft(new Ae(), new dt({ color: 2282478, transparent: true, opacity: 0.9 }));
  $e.frustumCulled = false, $e.visible = false, g.add($e);
  let et = [];
  const at = new Ft(new Ae(), new dt({ color: 16763904, transparent: true, opacity: 0.95 }));
  at.frustumCulled = false, at.visible = false, at.renderOrder = 999, g.add(at);
  let xt = [];
  const He = document.createElement("div");
  He.id = "hk-measure-label", He.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(He);
  const st = (e) => {
    var _a3, _b;
    const o = B(e);
    if (!o) return null;
    L.setFromCamera(N, o);
    let s = null, n = null;
    const a = L.intersectObjects(g.children, true).filter((p) => p.object.isMesh && p.object !== wt && p.object !== rt && p.object.visible !== false);
    if (a.length) {
      const p = a[0], h = p.point;
      s = [h.x, h.y, h.z];
      const _ = (_b = (_a3 = p.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      _ && p.face && (n = [p.face.a, p.face.b, p.face.c].map((m) => {
        const u = new E().fromBufferAttribute(_, m);
        return p.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const p = ge();
      if (p.length) {
        const h = p[0].point;
        s = [h.x, h.y, h.z];
      }
    }
    if (!s) return null;
    const c = F.getBoundingClientRect(), i = (p) => {
      const h = new E(p[0], p[1], p[2]).project(o);
      return [c.left + (h.x * 0.5 + 0.5) * c.width, c.top + (-h.y * 0.5 + 0.5) * c.height];
    }, r = [e.clientX, e.clientY], l = 14;
    let f = s, d = l;
    const w = (p) => {
      const h = i(p), M = Math.hypot(h[0] - r[0], h[1] - r[1]);
      M < d && (d = M, f = p);
    };
    for (const p of n ?? []) w(p);
    for (const p of t.points.rawVal) w(p);
    return f;
  }, Ct = () => {
    if (xt.length < 1) {
      He.style.display = "none";
      return;
    }
    const e = b(), o = xt[0], s = xt[1] ?? xt[0], a = new E((o[0] + s[0]) / 2, (o[1] + s[1]) / 2, (o[2] + s[2]) / 2).clone().project(e), c = F.getBoundingClientRect();
    He.style.left = c.left + (a.x * 0.5 + 0.5) * c.width + "px", He.style.top = c.top + (-a.y * 0.5 + 0.5) * c.height - 14 + "px", He.style.display = "block";
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
  const rt = new it(new Ae(), new pt({ color: 16096779, transparent: true, opacity: 0.35, side: Et, depthWrite: false }));
  rt.frustumCulled = false, rt.visible = false, rt.renderOrder = 998, rt.name = "hk-fill-preview", g.add(rt), F.addEventListener("pointerleave", () => {
    Ie.style.display = "none", rt.visible && (rt.visible = false, C());
  });
  const on = (e) => {
    var _a3, _b, _c, _d;
    const o = t.points.rawVal, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Map(), a = (m, u) => {
      m !== u && ((n.get(m) ?? n.set(m, /* @__PURE__ */ new Set()).get(m)).add(u), (n.get(u) ?? n.set(u, /* @__PURE__ */ new Set()).get(u)).add(m));
    };
    for (const m of s) for (let u = 0; u + 1 < m.length; u++) a(m[u], m[u + 1]);
    const c = (m, u) => {
      var _a4;
      return !!((_a4 = n.get(m)) == null ? void 0 : _a4.has(u));
    }, i = [], r = /* @__PURE__ */ new Set(), l = [...n.keys()];
    for (const m of l) for (const u of n.get(m)) if (!(u < m)) {
      for (const x of n.get(u)) if (x !== m) for (const v of n.get(x)) {
        if (v === m || v === u || !c(v, m) || c(m, x) || c(u, v)) continue;
        const V = [m, u, x, v].slice().sort((k, P) => k - P).join("-");
        r.has(V) || (r.add(V), i.push([m, u, x, v]));
      }
    }
    for (const m of l) for (const u of n.get(m)) if (!(u < m)) for (const x of n.get(u)) {
      if (x === m || !c(x, m)) continue;
      const v = [m, u, x].slice().sort((V, k) => V - k).join("-");
      r.has(v) || (r.add(v), i.push([m, u, x]));
    }
    const f = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", d = (m) => f === "xy" ? [m[0], m[1]] : f === "xz" ? [m[0], m[2]] : [m[1], m[2]], w = d(e), p = (m, u) => {
      let x = false;
      for (let v = 0, V = u.length - 1; v < u.length; V = v++) {
        const k = u[v][0], P = u[v][1], $ = u[V][0], T = u[V][1];
        P > m[1] != T > m[1] && m[0] < ($ - k) * (m[1] - P) / (T - P) + k && (x = !x);
      }
      return x;
    }, h = (m) => {
      let u = 0;
      for (let x = 0, v = m.length - 1; x < m.length; v = x++) u += (m[v][0] + m[x][0]) * (m[v][1] - m[x][1]);
      return Math.abs(u) / 2;
    };
    let M = null, _ = 1 / 0;
    for (const m of i) {
      const u = m.map((v) => d(o[v]));
      if (!p(w, u)) continue;
      const x = h(u);
      x < _ && (_ = x, M = m);
    }
    return M;
  }, Bt = new ct(), Kt = new it(new kn(1, 1), new pt({ color: 2282478, transparent: true, opacity: 0.08, side: Et, depthWrite: false })), It = new Jt(new Qs(new kn(1, 1)), new dt({ color: 2282478, transparent: true, opacity: 0.85 })), rn = new Jt(new Ae(), new dt({ color: 2282478, transparent: true, opacity: 0.3 })), ro = (e, o) => {
    const s = [], n = Math.ceil(e / o);
    for (let a = -n; a <= n; a++) {
      const c = a * o;
      s.push(-e, c, 0, e, c, 0), s.push(c, -e, 0, c, e, 0);
    }
    rn.geometry.dispose(), rn.geometry = new Ae(), rn.geometry.setAttribute("position", new Vt(s, 3));
  };
  Bt.add(Kt, It, rn), Bt.visible = false, Bt.frustumCulled = false, g.add(Bt);
  const Xt = new ct();
  Xt.frustumCulled = false, Xt.visible = false, g.add(Xt);
  const gn = (e) => {
    const o = new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), s = new no({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Ft(o, s);
  }, mn = gn(16711680), In = gn(65280), Ln = gn(35071);
  Xt.add(mn, In, Ln);
  const Gn = [], Bo = (e) => e.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Yt = gn(16761856);
  Yt.material.dashSize = 0.28, Yt.material.gapSize = 0.16, Yt.material.opacity = 0.9, Yt.frustumCulled = false, Yt.visible = false, Yt.renderOrder = 98, g.add(Yt);
  const Tn = (e) => {
    const o = new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0)]), s = new dt({ color: e, transparent: true, opacity: 0.2, depthTest: false }), n = new da(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, Rn = Tn(3462041), Pn = Tn(16724804), Dn = Tn(6333946), cn = new ct();
  cn.frustumCulled = false, cn.visible = false, g.add(cn), cn.add(Rn, Pn, Dn);
  const Bn = (e) => {
    const o = new kn(1, 1), s = new pt({ color: e, transparent: true, opacity: 0.06, side: Et, depthWrite: false }), n = new it(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ut = Bn(3462041), sn = Bn(16724804), an = Bn(6333946);
  cn.add(Ut, sn, an);
  const wn = (e, o, s, n) => {
    e.scale.set(2 * n, 2 * n, 1), s === "xy" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, 0, 0)) : s === "xz" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, dn = document.createElement("div");
  dn.id = "hk-refplane-badge", dn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(dn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = e, cn.visible = e, e) {
      const o = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], c = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], i = window.__hekatanOrthoExt ?? 8;
      yn(Rn, c, "xy", i), yn(Pn, c, "xz", i), yn(Dn, c, "yz", i), wn(Ut, c, "xy", i), wn(sn, c, "xz", i), wn(an, c, "yz", i), Ut.material.opacity = 0.05, sn.material.opacity = 0.05, an.material.opacity = 0.05;
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
    const o = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], c = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    yn(Rn, c, "xy", e), yn(Pn, c, "xz", e), yn(Dn, c, "yz", e), wn(Ut, c, "xy", e), wn(sn, c, "xz", e), wn(an, c, "yz", e), C();
  };
  const gs = (e) => {
    if (Ut.material.opacity = e === "xy" ? 0.09 : 0.025, sn.material.opacity = e === "xz" ? 0.09 : 0.025, an.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      dn.style.background = a.bg, dn.style.color = a.text, dn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, dn.style.display = "block";
    } else dn.style.display = "none";
  }, yn = (e, o, s, n) => {
    let a;
    s === "xy" ? a = [new E(o[0] - n, o[1] - n, o[2]), new E(o[0] + n, o[1] - n, o[2]), new E(o[0] + n, o[1] + n, o[2]), new E(o[0] - n, o[1] + n, o[2]), new E(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new E(o[0] - n, o[1], o[2] - n), new E(o[0] + n, o[1], o[2] - n), new E(o[0] + n, o[1], o[2] + n), new E(o[0] - n, o[1], o[2] + n), new E(o[0] - n, o[1], o[2] - n)] : a = [new E(o[0], o[1] - n, o[2] - n), new E(o[0], o[1] + n, o[2] - n), new E(o[0], o[1] + n, o[2] + n), new E(o[0], o[1] - n, o[2] + n), new E(o[0], o[1] - n, o[2] - n)], e.geometry.setFromPoints(a);
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
    const s = e.key.toLowerCase(), n = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && n === "polyarea" && et.length >= 3) {
      const a = go();
      ie(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") kt = kt === s ? null : s, vs(), e.preventDefault();
    else if (e.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Ns(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || ko(), ie(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const e = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = e, e || (Xt.visible = false), ie(`\u25C8 POLAR ${e ? "ON" : "OFF"} (F10)`);
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
  const uo = new E(), fo = new E(), Ms = new E(), va = (e) => {
    if (!kt) return null;
    const o = e[0], s = e[1], n = e[2];
    return kt === "x" ? (uo.set(o - 1e4, s, n), fo.set(o + 1e4, s, n)) : kt === "y" ? (uo.set(o, s - 1e4, n), fo.set(o, s + 1e4, n)) : (uo.set(o, s, n - 1e4), fo.set(o, s, n + 1e4)), L.ray.distanceSqToSegment(uo, fo, null, Ms), Ms;
  };
  window.__hekatanProjectOnAxis = va;
  const Zt = new Ft(new Ae().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new dt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Zt.renderOrder = 998, Zt.frustumCulled = false, Zt.visible = false, g.add(Zt);
  let ln = -1, vn = -1, Mn = -1;
  const Ue = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ue;
  const un = new Ft(new Ae().setFromPoints([new E(), new E()]), new dt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  un.renderOrder = 997, un.frustumCulled = false, un.visible = false, g.add(un);
  const Qt = new it(new Wn(0.02, 12, 12), new pt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Qt.renderOrder = 998, Qt.visible = false, g.add(Qt);
  const po = (e) => {
    const o = b();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(e);
    return Math.max(0.05, s / 10);
  }, bs = () => {
    Qt.visible && Qt.scale.setScalar(po(Qt.position));
  }, fn = new ct();
  fn.frustumCulled = false, g.add(fn);
  const ho = 2282478;
  let pn = null;
  const Ma = (e, o, s, n) => {
    if (!t.points) return -1;
    const a = t.points.rawVal;
    let c = -1, i = n;
    for (let r = 0; r < a.length; r++) {
      const l = a[r];
      if (!l) continue;
      const f = Math.hypot(e - l[0], o - l[1], s - l[2]);
      f < i && (i = f, c = r);
    }
    return c;
  }, Ot = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; fn.children.length; ) {
      const i = fn.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const i of Ue) {
      const [r, ...l] = i.split(":");
      if (r === "pt") {
        const f = e[+l[0]];
        if (!f) continue;
        const d = new it(new Wn(0.025, 12, 12), new pt({ color: ho, transparent: true, opacity: 0.9, depthTest: false }));
        d.position.set(f[0], f[1], f[2]), d.renderOrder = 999, d.__isSelectionPt = true, fn.add(d);
      } else if (r === "seg") {
        const f = o[+l[0]], d = e[f == null ? void 0 : f[+l[1]]], w = e[f == null ? void 0 : f[+l[1] + 1]];
        if (!d || !w) continue;
        const p = new Ae().setFromPoints([new E(d[0], d[1], d[2]), new E(w[0], w[1], w[2])]), h = new Ft(p, new dt({ color: ho, transparent: true, opacity: 0.95, depthTest: false }));
        h.renderOrder = 999, fn.add(h);
      } else if (r === "poly") {
        const d = o[+l[0]].map((h) => {
          const M = e[h];
          return M ? new E(M[0], M[1], M[2]) : null;
        }).filter(Boolean);
        if (d.length < 2) continue;
        const w = new Ae().setFromPoints(d), p = new Ft(w, new dt({ color: ho, transparent: true, opacity: 0.95, depthTest: false }));
        p.renderOrder = 999, fn.add(p);
      } else if (r === "aux") {
        const f = n[+l[0]];
        if (!f || f.length !== 6) continue;
        const d = new Ae().setFromPoints([new E(f[0], f[1], f[2]), new E(f[3], f[4], f[5])]), w = new Ft(d, new dt({ color: ho, transparent: true, opacity: 0.95, depthTest: false }));
        w.renderOrder = 999, fn.add(w);
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
  const Hn = (e, o, s, n, a, c, i, r, l) => {
    const f = i - n, d = r - a, w = l - c, p = f * f + d * d + w * w;
    if (p < 1e-12) return Math.hypot(e - n, o - a, s - c);
    let h = ((e - n) * f + (o - a) * d + (s - c) * w) / p;
    h = Math.max(0, Math.min(1, h));
    const M = n + h * f, _ = a + h * d, m = c + h * w;
    return Math.hypot(e - M, o - _, s - m);
  }, No = (e, o, s, n) => {
    if (!t.polylines) return null;
    const a = t.polylines.rawVal, c = t.points.rawVal;
    let i = -1, r = -1, l = n;
    for (let f = 0; f < a.length; f++) {
      const d = a[f];
      for (let w = 0; w < d.length - 1; w++) {
        const p = c[d[w]], h = c[d[w + 1]];
        if (!p || !h) continue;
        const M = Hn(e, o, s, p[0], p[1], p[2], h[0], h[1], h[2]);
        M < l && (l = M, i = f, r = w);
      }
    }
    return i >= 0 ? { polyIdx: i, segIdx: r, dist: l } : null;
  }, _s = (e, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, c = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let i = -1, r = n;
    for (let l = 0; l < c.length; l++) {
      const f = c[l];
      if (!f || f.length !== 6) continue;
      const d = Hn(e, o, s, f[0], f[1], f[2], f[3], f[4], f[5]);
      d < r && (r = d, i = l);
    }
    return i;
  }, ba = (e) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[e];
    if (!n || n.length !== 6) {
      Zt.visible = false;
      return;
    }
    Zt.geometry.setFromPoints([new E(n[0], n[1], n[2]), new E(n[3], n[4], n[5])]), Zt.visible = true;
  }, _a = (e, o = -1) => {
    var _a3, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal[e], n = t.points.rawVal;
    if (!s || s.length < 2) {
      Zt.visible = false;
      return;
    }
    const a = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, c = [];
    if (a || o < 0 || o >= s.length - 1) for (const i of s) {
      const r = n[i];
      r && c.push(new E(r[0], r[1], r[2]));
    }
    else {
      const i = n[s[o]], r = n[s[o + 1]];
      i && c.push(new E(i[0], i[1], i[2])), r && c.push(new E(r[0], r[1], r[2]));
    }
    Zt.geometry.setFromPoints(c), Zt.visible = true;
  }, mo = (e) => {
    var _a3;
    if (!t.polylines) return;
    const o = t.polylines.rawVal;
    if (e < 0 || e >= o.length) return;
    const s = o.filter((l, f) => f !== e), n = /* @__PURE__ */ new Set();
    for (const l of s) for (const f of l) n.add(f);
    const a = t.points.rawVal, c = /* @__PURE__ */ new Map(), i = [];
    for (let l = 0; l < a.length; l++) n.has(l) && (c.set(l, i.length), i.push(a[l]));
    const r = s.map((l) => l.map((f) => c.get(f)).filter((f) => f !== void 0));
    t.points.val = i, t.polylines.val = r, t.areas && (t.areas.val = t.areas.rawVal.filter((l) => l !== e).map((l) => l > e ? l - 1 : l)), Zt.visible = false, ln = -1, vn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, ks = (e, o) => {
    var _a3, _b, _c;
    if (!t.polylines) return;
    const s = t.polylines.rawVal;
    if (e < 0 || e >= s.length) return;
    if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      mo(e);
      return;
    }
    const a = s[e];
    if (o < 0 || o >= a.length - 1) return;
    if (a.length === 2) {
      mo(e);
      return;
    }
    let c;
    o === 0 ? c = [a.slice(1)] : o === a.length - 2 ? c = [a.slice(0, -1)] : c = [a.slice(0, o + 1), a.slice(o + 1)];
    const i = [...s.slice(0, e), ...c, ...s.slice(e + 1)], r = /* @__PURE__ */ new Set();
    for (const p of i) for (const h of p) r.add(h);
    const l = t.points.rawVal, f = /* @__PURE__ */ new Map(), d = [];
    for (let p = 0; p < l.length; p++) r.has(p) && (f.set(p, d.length), d.push(l[p]));
    const w = i.map((p) => p.map((h) => f.get(h)).filter((h) => h !== void 0));
    if (t.points.val = d, t.polylines.val = w, t.areas) {
      const p = c.length - 1;
      t.areas.val = t.areas.rawVal.map((h) => h > e ? h + p : h);
    }
    Zt.visible = false, ln = -1, vn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Le.geometry.setAttribute("position", new Vt(t.points.rawVal.flat(), 3)), Le.geometry.computeBoundingSphere(), Le.frustumCulled = false, Ne.frustumCulled = false, g.add(Ne), te.position.set(0, 0, 0), te.rotateX(Math.PI / 2), te.geometry.rotateX(Math.PI / 2), te.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, o, s) => {
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
  const wo = [];
  window.__hekatanCirculos = wo;
  let Ss = [], Ps = "";
  const Cs = () => {
    var _a3;
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = `${e.length}|${o.length}|${o.reduce((a, c) => a + c.length, 0)}`;
    if (s === Ps) return Ss;
    Ps = s;
    const n = [];
    for (const a of o) {
      const c = a.length;
      if (c < 6 || a[0] !== a[c - 1]) continue;
      const i = a.slice(0, c - 1).map((d) => e[d]).filter(Boolean);
      if (i.length < 5) continue;
      const r = [0, 1, 2].map((d) => i.reduce((w, p) => w + p[d], 0) / i.length), l = i.map((d) => Math.hypot(d[0] - r[0], d[1] - r[1], d[2] - r[2])), f = l.reduce((d, w) => d + w, 0) / l.length;
      f < 1e-9 || l.some((d) => Math.abs(d - f) > 5e-3 * f) || n.push({ c: r, r: f });
    }
    return Ss = n;
  };
  window.__hekatanCentrosDeducidos = Cs;
  const yo = () => !!window.__hekatanCurvasAux, xo = (e, o) => {
    const s = window.__hekatanDrawingAuxLines;
    if (!s) return 0;
    bt();
    const n = s.rawVal ?? s.val ?? [], a = [];
    for (let c = 0; c + 1 < e.length; c++) a.push([...e[c], ...e[c + 1]]);
    return o && e.length > 2 && a.push([...e[e.length - 1], ...e[0]]), s.val = [...n, ...a], a.length;
  };
  window.__hekatanDrawCircle = (e, o, s, n, a = window.__hekatanArcSegs ?? 12, c = "xy") => {
    var _a3;
    const i = Math.max(4, Math.round(a)), r = t.points.rawVal.length, l = [];
    for (let f = 0; f < i; f++) {
      const d = 2 * Math.PI * f / i, w = n * Math.cos(d), p = n * Math.sin(d);
      let h;
      c === "xy" ? h = [e + w, o + p, s] : c === "xz" ? h = [e + w, o, s + p] : h = [e, o + w, s + p], l.push(h);
    }
    if (wo.push({ c: [e, o, s], r: n }), yo()) {
      xo(l, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...l], t.polylines) {
      const f = [...l.map((w, p) => r + p), r], d = t.polylines.rawVal;
      ((_a3 = d[d.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [...d, f, []] : t.polylines.val = [...d.slice(0, -1), f, []];
    }
  }, window.__hekatanDrawArc = (e, o, s, n = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const a = Math.max(4, Math.round(n)), c = new E(...e), i = new E(...o), r = new E(...s), l = new E().subVectors(i, c), f = new E().subVectors(r, c), d = new E().crossVectors(l, f), w = 2 * d.lengthSq();
    let p;
    if (w < 1e-12) p = new E().addVectors(c, r).multiplyScalar(0.5);
    else {
      const pe = f.clone().multiplyScalar(l.lengthSq()).sub(l.clone().multiplyScalar(f.lengthSq())), be = new E().crossVectors(pe, d);
      p = c.clone().add(be.divideScalar(w));
    }
    const h = c.distanceTo(p), M = d.lengthSq() > 1e-12 ? d.clone().normalize() : new E(0, 1, 0), _ = new E().subVectors(c, p).normalize(), m = new E().crossVectors(M, _).normalize(), u = (pe) => {
      const be = new E().subVectors(pe, p);
      return Math.atan2(be.dot(m), be.dot(_));
    }, x = (pe) => {
      let be = pe;
      for (; be < 0; ) be += 2 * Math.PI;
      for (; be >= 2 * Math.PI; ) be -= 2 * Math.PI;
      return be;
    }, v = x(u(i)), V = x(u(r)), k = v <= V ? V : V - 2 * Math.PI, P = t.points.rawVal.length, $ = [], T = (pe) => {
      const be = _.clone().multiplyScalar(Math.cos(pe)).add(m.clone().multiplyScalar(Math.sin(pe)));
      return p.clone().add(be.multiplyScalar(h));
    }, I = String(window.__hekatanArcModo ?? "angulo"), Y = I === "x" ? 0 : I === "y" ? 1 : I === "z" ? 2 : -1;
    let ee = false;
    if (Y >= 0) {
      const pe = e[Y], be = s[Y], Je = 512;
      let qe = Math.abs(be - pe) > 1e-9, je = pe;
      for (let Ee = 1; Ee <= Je && qe; Ee++) {
        const Ge = T(k * Ee / Je).getComponent(Y);
        (Ge - je) * (be - pe) < -1e-9 && (qe = false), je = Ge;
      }
      if (qe) {
        ee = true;
        for (let Ee = 0; Ee <= a; Ee++) {
          const Ge = pe + (be - pe) * Ee / a;
          let De = 0, ze = k;
          for (let Ke = 0; Ke < 60; Ke++) {
            const ft = (De + ze) / 2;
            (T(ft).getComponent(Y) - Ge) * (be - pe) < 0 ? De = ft : ze = ft;
          }
          const Xe = T((De + ze) / 2);
          $.push([Xe.x, Xe.y, Xe.z]);
        }
        $[0] = [e[0], e[1], e[2]], $[a] = [s[0], s[1], s[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${I.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!ee) for (let pe = 0; pe <= a; pe++) {
      const be = T(k * (pe / a));
      $.push([be.x, be.y, be.z]);
    }
    if (wo.push({ c: [p.x, p.y, p.z], r: h }), yo()) {
      xo($, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...$], t.polylines) {
      const pe = $.map((Je, qe) => P + qe), be = t.polylines.rawVal;
      t.polylines.val = [...be.slice(0, -1), pe, []];
    }
  }, window.__hekatanDrawPolinomio = (e, o = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const s = e.length;
    if (s < 2) return { ok: false, msg: "faltan puntos" };
    const n = Math.max(s - 1, Math.round(o)), a = (k) => Math.max(...e.map((P) => P[k])) - Math.min(...e.map((P) => P[k])), c = [a(0), a(1), a(2)], i = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), r = i === "xy" ? 2 : i === "xz" ? 1 : i === "yz" ? 0 : -1, l = r >= 0 && c[r] < 1e-6 ? r : c[2] <= c[0] && c[2] <= c[1] ? 2 : c[1] <= c[0] ? 1 : 0, f = l === 2 ? "xy" : l === 1 ? "xz" : "yz", d = [0, 1, 2].filter((k) => k !== l), [w, p] = c[d[0]] >= c[d[1]] ? d : [d[1], d[0]], h = e.map((k) => k[w]), M = e.map((k) => k[p]);
    for (let k = 0; k < s; k++) for (let P = k + 1; P < s; P++) if (Math.abs(h[k] - h[P]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[w]} en ${f.toUpperCase()}): no hay polinomio que pase por los dos` };
    const _ = (k) => {
      let P = 0;
      for (let $ = 0; $ < s; $++) {
        let T = 1;
        for (let I = 0; I < s; I++) I !== $ && (T *= (k - h[I]) / (h[$] - h[I]));
        P += M[$] * T;
      }
      return P;
    }, m = (() => {
      const k = s, P = h.map((I) => Array.from({ length: k }, (Y, ee) => I ** ee)), $ = M.slice();
      for (let I = 0; I < k; I++) {
        let Y = I;
        for (let ee = I + 1; ee < k; ee++) Math.abs(P[ee][I]) > Math.abs(P[Y][I]) && (Y = ee);
        [P[I], P[Y]] = [P[Y], P[I]], [$[I], $[Y]] = [$[Y], $[I]];
        for (let ee = I + 1; ee < k; ee++) {
          const pe = P[ee][I] / P[I][I];
          for (let be = I; be < k; be++) P[ee][be] -= pe * P[I][be];
          $[ee] -= pe * $[I];
        }
      }
      const T = new Array(k).fill(0);
      for (let I = k - 1; I >= 0; I--) {
        let Y = $[I];
        for (let ee = I + 1; ee < k; ee++) Y -= P[I][ee] * T[ee];
        T[I] = Y / P[I][I];
      }
      return T;
    })(), u = h[0], x = h[s - 1], v = t.points.rawVal.length, V = [];
    for (let k = 0; k <= n; k++) {
      const P = u + (x - u) * k / n, $ = [e[0][0], e[0][1], e[0][2]];
      $[w] = P, $[p] = _(P), $[l] = e[0][l], V.push($);
    }
    if (V[0] = [e[0][0], e[0][1], e[0][2]], V[n] = [e[s - 1][0], e[s - 1][1], e[s - 1][2]], yo()) return xo(V, false), { ok: true, plano: f, coef: m, ia: w, io: p };
    if (t.points.val = [...t.points.rawVal, ...V], t.polylines) {
      const k = V.map(($, T) => v + T), P = t.polylines.rawVal;
      t.polylines.val = ((_d = P[P.length - 1]) == null ? void 0 : _d.length) > 0 ? [...P, k, []] : [...P.slice(0, -1), k, []];
    }
    return { ok: true, plano: f, coef: m, ia: w, io: p };
  };
  const zs = () => {
    var _a3, _b;
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? [], c = [], i = [], r = /* @__PURE__ */ new Set(), l = (f) => [e[f][0], e[f][1], e[f][2]];
    return [...Ue].forEach((f) => {
      const d = f.split(":");
      if (d[0] === "aux") {
        const p = a[+d[1]];
        p && p.length === 6 && (c.push([[p[0], p[1], p[2]], [p[3], p[4], p[5]]]), i.push(f));
        return;
      }
      const w = d[0] === "poly" || d[0] === "seg" ? +d[1] : -1;
      if (!(w < 0 || !o[w] || s.has(w))) if (d[0] === "poly") {
        if (r.has(w)) return;
        r.add(w);
        for (let p = 0; p + 1 < o[w].length; p++) c.push([l(o[w][p]), l(o[w][p + 1])]);
      } else {
        const p = o[w][+d[2]], h = o[w][+d[2] + 1];
        p != null && h != null && !r.has(w) && c.push([l(p), l(h)]);
      }
    }), { segs: c, auxIds: i };
  }, Jn = (e, o) => Math.abs(e[0] - o[0]) < 1e-6 && Math.abs(e[1] - o[1]) < 1e-6 && Math.abs(e[2] - o[2]) < 1e-6, ka = (e) => {
    const o = new Array(e.length).fill(false), s = [];
    for (let n = 0; n < e.length; n++) {
      if (o[n]) continue;
      o[n] = true;
      const a = [e[n][0], e[n][1]];
      let c = true;
      for (; c; ) {
        c = false;
        for (let r = 0; r < e.length; r++) {
          if (o[r]) continue;
          const [l, f] = e[r], d = a[a.length - 1], w = a[0];
          Jn(l, d) ? (a.push(f), o[r] = true, c = true) : Jn(f, d) ? (a.push(l), o[r] = true, c = true) : Jn(f, w) ? (a.unshift(l), o[r] = true, c = true) : Jn(l, w) && (a.unshift(f), o[r] = true, c = true);
        }
      }
      const i = a.length > 3 && Jn(a[0], a[a.length - 1]);
      i && a.pop(), s.push({ pts: a, cerrada: i });
    }
    return s;
  }, Xo = (e, o) => {
    let s = e.findIndex((n) => Math.abs(n[0] - o[0]) < 1e-3 && Math.abs(n[1] - o[1]) < 1e-3 && Math.abs(n[2] - o[2]) < 1e-3);
    return s < 0 && (s = e.length, e.push(o)), s;
  }, As = (e) => {
    if (!e.length) return 0;
    Ue.clear(), e.forEach((s) => Ue.add(s));
    const o = e.length;
    return Wo(), Ue.clear(), o;
  };
  window.__hekatanRevolveSelection = (e, o, s, n = 360) => {
    var _a3, _b, _c;
    const a = Math.max(3, Math.round(s || 16)), c = Math.abs(n - 360) < 1e-9, i = a, r = c ? a : a + 1, { segs: l, auxIds: f } = zs();
    if (!l.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (c && a % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    bt();
    const d = t.points.rawVal, w = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], p = [...d];
    let h = w.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], _ = /* @__PURE__ */ new Map(), m = ($) => $.map((T) => Math.round(T * 1e4)).join(","), u = ($) => Math.hypot($[0] - e, $[1] - o) < 1e-6, x = ($) => {
      const T = m($);
      let I = _.get(T);
      if (I) return I;
      if (u($)) return I = [Xo(p, $)], _.set(T, I), I;
      const Y = Math.hypot($[0] - e, $[1] - o), ee = Math.atan2($[1] - o, $[0] - e);
      I = [];
      for (let pe = 0; pe < r; pe++) {
        const be = ee + n * Math.PI / 180 * pe / a;
        I.push(Xo(p, pe === 0 ? $ : [e + Y * Math.cos(be), o + Y * Math.sin(be), $[2]]));
      }
      return _.set(T, I), I;
    };
    let v = 0, V = false;
    const k = ($) => {
      M.push(h.length), h.push([...$, $[0]]), v++;
    };
    for (const [$, T] of l) {
      const I = x($), Y = x(T);
      if (!(I.length === 1 && Y.length === 1)) {
        if (I.length === 1 || Y.length === 1) {
          V = true;
          const ee = I.length === 1 ? I[0] : Y[0], pe = I.length === 1 ? Y : I;
          for (let be = 0; be + 2 <= i; be += 2) k([ee, pe[be % r], pe[(be + 1) % r], pe[(be + 2) % r]]);
          continue;
        }
        for (let ee = 0; ee < i; ee++) k([I[ee], Y[ee], Y[(ee + 1) % r], I[(ee + 1) % r]]);
      }
    }
    h.push([]), t.points.val = p, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    const P = As(f);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { anillos: _.size, areas: v, polo: V, guias: P };
  }, window.__hekatanLoftSelection = (e, o) => {
    var _a3, _b, _c;
    const { segs: s, auxIds: n } = zs(), a = ka(s), c = (Y) => Y.pts.every((ee) => Math.abs(ee[2] - Y.pts[0][2]) < 1e-6), i = a.find((Y) => Y.cerrada && c(Y)), r = a.find((Y) => !Y.cerrada && Y.pts.length >= 2 && !c(Y));
    if (!i) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!r) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const l = i.pts, f = l.length, d = r.pts.slice();
    d[d.length - 1][2] < d[0][2] && d.reverse();
    let w = 0;
    for (let Y = 0; Y < f; Y++) {
      const ee = l[Y], pe = l[(Y + 1) % f];
      w += ee[0] * pe[1] - pe[0] * ee[1];
    }
    const p = w > 0 ? 1 : -1, h = (Y) => {
      const ee = l[(Y - 1 + f) % f], pe = l[Y], be = l[(Y + 1) % f], Je = [pe[0] - ee[0], pe[1] - ee[1]], qe = [be[0] - pe[0], be[1] - pe[1]], je = Math.hypot(Je[0], Je[1]) || 1, Ee = Math.hypot(qe[0], qe[1]) || 1, Ge = [p * Je[1] / je, -p * Je[0] / je], De = [p * qe[1] / Ee, -p * qe[0] / Ee], ze = 1 + (Ge[0] * De[0] + Ge[1] * De[1]);
      return [(Ge[0] + De[0]) / Math.max(ze, 1e-6), (Ge[1] + De[1]) / Math.max(ze, 1e-6)];
    }, M = l.map((Y, ee) => h(ee)), _ = d[0];
    let m = [0, 0], u = 0;
    for (const Y of d) {
      const ee = Y[0] - _[0], pe = Y[1] - _[1], be = Math.hypot(ee, pe);
      be > u && (u = be, m = [ee / be, pe / be]);
    }
    if (u < 1e-9) {
      const Y = _[0] - e, ee = _[1] - o, pe = Math.hypot(Y, ee) || 1;
      m = [Y / pe, ee / pe];
    }
    m[0] * (_[0] - e) + m[1] * (_[1] - o) < 0 && (m = [-m[0], -m[1]]), bt();
    const x = t.points.rawVal, v = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], V = [...x];
    let k = v.slice();
    k.length && k[k.length - 1].length === 0 && (k = k.slice(0, -1));
    const P = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], $ = d.map((Y) => {
      const ee = (Y[0] - _[0]) * m[0] + (Y[1] - _[1]) * m[1], pe = Y[2];
      return l.map((be, Je) => Xo(V, [be[0] + M[Je][0] * ee, be[1] + M[Je][1] * ee, pe]));
    });
    let T = 0;
    for (let Y = 0; Y + 1 < $.length; Y++) for (let ee = 0; ee < f; ee++) {
      const pe = [$[Y][ee], $[Y][(ee + 1) % f], $[Y + 1][(ee + 1) % f], $[Y + 1][ee]];
      new Set(pe).size < 4 || (P.push(k.length), k.push([...pe, pe[0]]), T++);
    }
    k.push([]), t.points.val = V, t.polylines && (t.polylines.val = k), t.areas && (t.areas.val = P);
    const I = As(n);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { contorno: f, perfil: d.length, areas: T, guias: I };
  }, window.__hekatanDrawSlabChaflan = (e, o, s = 1, n = 6, a = 6) => {
    const c = Math.min(e[0], o[0]), i = Math.max(e[0], o[0]), r = Math.min(e[1], o[1]), l = Math.max(e[1], o[1]), f = (e[2] + o[2]) / 2, d = i - c, w = l - r, p = Math.min(s, d / 2 - 0.01, w / 2 - 0.01);
    if (p <= 0) return;
    const h = t.points.rawVal.length, M = [], _ = [], m = (u, x) => {
      M.push([u, x, f]), _.push(h + M.length - 1);
    };
    for (let u = 0; u <= a; u++) m(c + p + (d - 2 * p) * u / a, r);
    for (let u = 1; u <= n; u++) {
      const x = -Math.PI / 2 + Math.PI / 2 * u / n;
      m(i - p + p * Math.cos(x), r + p + p * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) m(i, r + p + (w - 2 * p) * u / a);
    for (let u = 1; u <= n; u++) {
      const x = 0 + Math.PI / 2 * u / n;
      m(i - p + p * Math.cos(x), l - p + p * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) m(i - p - (d - 2 * p) * u / a, l);
    for (let u = 1; u <= n; u++) {
      const x = Math.PI / 2 + Math.PI / 2 * u / n;
      m(c + p + p * Math.cos(x), l - p + p * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) m(c, l - p - (w - 2 * p) * u / a);
    for (let u = 1; u < n; u++) {
      const x = Math.PI + Math.PI / 2 * u / n;
      m(c + p + p * Math.cos(x), r + p + p * Math.sin(x));
    }
    if (_.push(h), yo()) {
      xo(M, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...M], t.polylines) {
      const u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRect = (e, o) => {
    const s = t.points.rawVal.length, n = e[0], a = e[1], c = e[2], i = o[0], r = o[1], l = o[2];
    let f;
    if (Math.abs(c - l) < 1e-6 ? f = [[n, a, c], [i, a, c], [i, r, c], [n, r, c]] : Math.abs(a - r) < 1e-6 ? f = [[n, a, c], [i, a, c], [i, a, l], [n, a, l]] : f = [[n, a, c], [n, r, c], [n, r, l], [n, a, l]], t.points.val = [...t.points.rawVal, ...f], t.polylines) {
      const d = [s, s + 1, s + 2, s + 3, s], w = t.polylines.rawVal;
      t.polylines.val = [...w.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawRectArea = (e, o) => {
    var _a3;
    const s = t.points.rawVal.length, n = e[0], a = e[1], c = e[2], i = o[0], r = o[1], l = o[2];
    let f;
    if (U && t.gridTarget) {
      const d = t.gridTarget.rawVal, w = new oo(...d.rotation), p = new E(1, 0, 0).applyEuler(w), h = new E(0, 1, 0).applyEuler(w), M = new E(...d.position), _ = new E(n, a, c), m = new E(i, r, l), u = _.clone().sub(M).dot(p), x = _.clone().sub(M).dot(h), v = m.clone().sub(M).dot(p), V = m.clone().sub(M).dot(h), k = (P, $) => M.clone().addScaledVector(p, P).addScaledVector(h, $).toArray();
      f = [k(u, x), k(v, x), k(v, V), k(u, V)];
    } else Math.abs(c - l) < 1e-6 ? f = [[n, a, c], [i, a, c], [i, r, c], [n, r, c]] : Math.abs(a - r) < 1e-6 ? f = [[n, a, c], [i, a, c], [i, a, l], [n, a, l]] : f = [[n, a, c], [n, r, c], [n, r, l], [n, a, l]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...f], t.polylines) {
      const d = t.polylines.rawVal, w = d.length - 1, p = [s, s + 1, s + 2, s + 3, s];
      t.polylines.val = [...d.slice(0, -1), p, []], t.areas && (t.areas.val = [...t.areas.rawVal, w]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = t.points.rawVal, s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = (m) => m.map((u) => Math.round(u * 1e4) / 1e4).join(",");
    for (let m = 0; m < o.length; m++) {
      const u = a(o[m]), x = s.get(u);
      x === void 0 && s.set(u, m), n.set(m, x ?? m);
    }
    const c = e.map((m) => m.map((u) => n.get(u) ?? u)), i = /* @__PURE__ */ new Map(), r = (m, u) => {
      m !== u && ((i.get(m) ?? i.set(m, /* @__PURE__ */ new Set()).get(m)).add(u), (i.get(u) ?? i.set(u, /* @__PURE__ */ new Set()).get(u)).add(m));
    };
    for (const m of c) for (let u = 0; u + 1 < m.length; u++) r(m[u], m[u + 1]);
    const l = (m, u) => {
      var _a4;
      return !!((_a4 = i.get(m)) == null ? void 0 : _a4.has(u));
    }, f = /* @__PURE__ */ new Set(), d = [], w = [...i.keys()];
    for (const m of w) for (const u of i.get(m)) if (!(u < m)) {
      for (const x of i.get(u)) if (x !== m) for (const v of i.get(x)) {
        if (v === m || v === u || !l(v, m) || l(m, x) || l(u, v)) continue;
        const V = [m, u, x, v].slice().sort((k, P) => k - P).join("-");
        f.has(V) || (f.add(V), d.push([m, u, x, v]));
      }
    }
    for (const m of w) for (const u of i.get(m)) if (!(u < m)) for (const x of i.get(u)) {
      if (x === m || !l(x, m)) continue;
      const v = [m, u, x].slice().sort((V, k) => V - k).join("-");
      f.has(v) || (f.add(v), d.push([m, u, x]));
    }
    if (!d.length) return 0;
    const p = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], h = new Set(p.map((m) => [...new Set(c[m] ?? [])].sort((u, x) => u - x).join("-"))), M = [...c];
    let _ = 0;
    for (const m of d) {
      const u = m.slice().sort((x, v) => x - v).join("-");
      h.has(u) || (h.add(u), M.push([...m, m[0]]), p.push(M.length - 1), _++);
    }
    if (_) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = M, t.areas && (t.areas.val = p);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      C();
    }
    return _;
  }, window.__hekatanMeshPolyArea = (e, o) => {
    var _a3;
    const s = e.length;
    if (s < 3) return 0;
    let n = 0, a = 0, c = 0;
    for (let ze = 0; ze < s; ze++) {
      const Xe = e[ze], Ke = e[(ze + 1) % s];
      n += (Xe[1] - Ke[1]) * (Xe[2] + Ke[2]), a += (Xe[2] - Ke[2]) * (Xe[0] + Ke[0]), c += (Xe[0] - Ke[0]) * (Xe[1] + Ke[1]);
    }
    const i = Math.hypot(n, a, c) || 1;
    n /= i, a /= i, c /= i;
    let r = e[1][0] - e[0][0], l = e[1][1] - e[0][1], f = e[1][2] - e[0][2];
    const d = Math.hypot(r, l, f) || 1;
    r /= d, l /= d, f /= d;
    let w = a * f - c * l, p = c * r - n * f, h = n * l - a * r;
    const M = Math.hypot(w, p, h) || 1;
    w /= M, p /= M, h /= M;
    const _ = e[0], m = (ze) => [(ze[0] - _[0]) * r + (ze[1] - _[1]) * l + (ze[2] - _[2]) * f, (ze[0] - _[0]) * w + (ze[1] - _[1]) * p + (ze[2] - _[2]) * h], u = (ze, Xe) => [_[0] + ze * r + Xe * w, _[1] + ze * l + Xe * p, _[2] + ze * f + Xe * h], x = e.map(m);
    let v = 1 / 0, V = -1 / 0, k = 1 / 0, P = -1 / 0;
    for (const [ze, Xe] of x) ze < v && (v = ze), ze > V && (V = ze), Xe < k && (k = Xe), Xe > P && (P = Xe);
    const $ = V - v, T = P - k;
    if ($ < 1e-6 || T < 1e-6) return 0;
    let I = o && o > 0 ? o : 0.5;
    for (; $ / I * (T / I) > 2500; ) I *= 2;
    I = Math.min(I, Math.min($, T));
    const Y = (ze, Xe) => {
      let Ke = false;
      for (let ft = 0, gt = x.length - 1; ft < x.length; gt = ft++) {
        const [At, tn] = x[ft], [Kn, En] = x[gt];
        tn > Xe != En > Xe && ze < (Kn - At) * (Xe - tn) / (En - tn) + At && (Ke = !Ke);
      }
      return Ke;
    }, ee = Math.max(1, Math.round($ / I)), pe = Math.max(1, Math.round(T / I)), be = $ / ee, Je = T / pe, qe = /* @__PURE__ */ new Map(), je = [], Ee = t.points.rawVal.length, Ge = (ze, Xe) => {
      const Ke = ze + "," + Xe, ft = qe.get(Ke);
      if (ft !== void 0) return ft;
      const gt = Ee + je.length;
      return je.push(u(v + ze * be, k + Xe * Je)), qe.set(Ke, gt), gt;
    }, De = [];
    for (let ze = 0; ze < ee; ze++) for (let Xe = 0; Xe < pe; Xe++) {
      if (!Y(v + (ze + 0.5) * be, k + (Xe + 0.5) * Je)) continue;
      const Ke = Ge(ze, Xe), ft = Ge(ze + 1, Xe), gt = Ge(ze + 1, Xe + 1), At = Ge(ze, Xe + 1);
      De.push([Ke, ft, gt, At]);
    }
    if (!De.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...je], t.polylines && t.areas) {
      let ze = t.polylines.rawVal.slice();
      ze.length && ze[ze.length - 1].length === 0 && (ze = ze.slice(0, -1));
      const Xe = [];
      for (const Ke of De) Xe.push(ze.length), ze.push([Ke[0], Ke[1], Ke[2], Ke[3], Ke[0]]);
      ze.push([]), t.polylines.val = ze, t.areas.val = [...t.areas.rawVal, ...Xe];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), De.length;
  };
  const go = () => {
    if (et.length < 3) return et = [], $e.visible = false, C(), 0;
    const e = window.__hekatanMeshPolyArea(et.slice());
    return et = [], $e.visible = false, C(), e;
  };
  window.__hekatanFinalizePolyArea = go, window.__hekatanSetInclinedPlaneFrom3 = (e, o, s) => {
    var _a3;
    const n = new E(e[0], e[1], e[2]), a = new E(o[0], o[1], o[2]), c = new E(s[0], s[1], s[2]), i = new E().subVectors(a, n).cross(new E().subVectors(c, n));
    if (i.lengthSq() < 1e-9) return false;
    i.normalize();
    const r = new ls().setFromUnitVectors(new E(0, 0, 1), i), l = new oo().setFromQuaternion(r);
    t.gridTarget && (t.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [l.x, l.y, l.z] }), U = true;
    const f = new E().addVectors(n, a).add(c).multiplyScalar(1 / 3), d = Math.max(n.distanceTo(a), n.distanceTo(c), a.distanceTo(c)) * 2.2 + 4, w = d / 2;
    Kt.geometry.dispose(), Kt.geometry = new kn(d, d), It.geometry.dispose(), It.geometry = new Qs(new kn(d, d)), ro(w, 1), Bt.position.copy(f), Bt.quaternion.copy(r), Bt.scale.set(1, 1, 1), Bt.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), U = false, Bt.visible = false, C();
  };
  const jt = new ct();
  jt.visible = false, g.add(jt), window.__hekatanShowAxes = (e, o, s = 12, n = 2) => {
    var _a3, _b;
    for (; jt.children.length; ) {
      const d = jt.children.pop();
      (_a3 = d.geometry) == null ? void 0 : _a3.dispose(), (_b = d.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !o.length) return;
    const a = Math.min(...o) - n, c = Math.max(...o) + n, i = Math.min(...e) - n, r = Math.max(...e) + n, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", f = (d, w, p, h, M) => {
      const _ = document.createElement("canvas");
      _.width = 64, _.height = 32;
      const m = _.getContext("2d");
      m.fillStyle = M, m.font = "bold 22px sans-serif", m.textAlign = "center", m.fillText(d, 32, 26);
      const u = new Os(_), x = new js({ map: u, transparent: true }), v = new ea(x);
      return v.position.set(w, p, h), v.scale.set(1.2, 0.6, 1), v;
    };
    e.forEach((d, w) => {
      const p = w < l.length ? l[w] : `X${w}`, h = new Ae().setFromPoints([new E(d, a, 0), new E(d, c, 0), new E(d, a, 0), new E(d, a, s)]), M = new no({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), _ = new Jt(h, M);
      _.computeLineDistances(), jt.add(_), jt.add(f(p, d, a - 0.5, 0, "#60a5fa")), jt.add(f(p, d, c + 0.5, 0, "#60a5fa"));
    }), o.forEach((d, w) => {
      const p = `${w + 1}`, h = new Ae().setFromPoints([new E(i, d, 0), new E(r, d, 0), new E(i, d, 0), new E(i, d, s)]), M = new no({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), _ = new Jt(h, M);
      _.computeLineDistances(), jt.add(_), jt.add(f(p, i - 0.5, d, 0, "#fb7185")), jt.add(f(p, r + 0.5, d, 0, "#fb7185"));
    }), jt.visible = true, C();
  }, window.__hekatanHideAxes = () => {
    jt.visible = false, C();
  };
  const xn = new ct();
  xn.visible = false, g.add(xn);
  let Nn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a3, _b;
    for (; xn.children.length; ) {
      const c = xn.children.pop();
      (_a3 = c.geometry) == null ? void 0 : _a3.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    Nn.forEach((c) => {
      g.remove(c), c.geometry.dispose(), c.material.dispose();
    }), Nn = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((c, i) => {
      const r = a[i % a.length], l = o / 2, f = [new E(s - l, n - l, c), new E(s + l, n - l, c), new E(s + l, n + l, c), new E(s - l, n + l, c), new E(s - l, n - l, c)], d = new Ae().setFromPoints(f), w = new dt({ color: r, transparent: true, opacity: 0.55 });
      xn.add(new Ft(d, w));
      const p = document.createElement("canvas");
      p.width = 128, p.height = 32;
      const h = p.getContext("2d");
      h.fillStyle = `#${r.toString(16).padStart(6, "0")}`, h.font = "bold 18px sans-serif", h.fillText(`Z = ${c} m`, 4, 22);
      const M = new Os(p), _ = new js({ map: M, transparent: true }), m = new ea(_);
      m.position.set(s - l - 1.5, n - l - 1.5, c), m.scale.set(2.5, 0.6, 1), xn.add(m);
      const u = new kn(1e4, 1e4), x = new pt({ visible: false, side: Et }), v = new it(u, x);
      v.position.set(0, 0, c), v.frustumCulled = false, v.userData = { refPlaneZ: c }, g.add(v), Nn.push(v);
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
      const s = Qn.children.pop();
      (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new Ae().setFromPoints([new E(s[0], s[1], s[2]), new E(s[3], s[4], s[5])]), a = new no({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), c = new Ft(n, a);
      c.computeLineDistances(), Qn.add(c);
    }
  };
  re.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Sa(), C());
  });
  const Xn = new ct();
  Xn.frustumCulled = false, g.add(Xn);
  const Fs = () => {
    var _a3, _b, _c, _d;
    for (; Xn.children.length; ) {
      const s = Xn.children.pop();
      (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new it(new Wn(0.025, 12, 12), new pt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(po(n.position)), Xn.add(n);
    }
  };
  re.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Fs(), C());
  }), S.addEventListener("change", () => {
    Xn.children.forEach((e) => {
      e.scale.setScalar(po(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Fs;
  const wt = new ct(), Pa = new it(new Wn(0.01, 12, 12), new pt({ color: 16724804, transparent: true, opacity: 0.95 })), Ca = new it(new Wn(0.015, 12, 12), new pt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  wt.add(Pa, Ca);
  const Yn = 0.08, Yo = (e, o, s) => {
    const n = new Ae().setFromPoints([new E(...e), new E(...o)]);
    return new Ft(n, new dt({ color: s, transparent: true, opacity: 0.7 }));
  };
  wt.add(Yo([-Yn, 0, 0], [Yn, 0, 0], 16711680)), wt.add(Yo([0, -Yn, 0], [0, Yn, 0], 65280)), wt.add(Yo([0, 0, -Yn], [0, 0, Yn], 35071)), wt.visible = false, wt.frustumCulled = false, g.add(wt);
  let Uo = 2;
  const vo = (e) => {
    const o = b(), s = (F == null ? void 0 : F.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(e) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, On = () => {
    if (!wt.visible) return;
    const e = Uo * vo(wt.position) / 0.015;
    wt.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let bn = 10;
  const Zo = (e) => Math.max(1e-4, bn * vo(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (bn = e), bn), window.__hekatanUpdateSnapScale = On, window.__hekatanSnapMarker = wt, window.__hekatanMetrosPorPixel = vo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (Uo = e, On(), C()), Uo);
  const Es = () => {
    fn.children.length !== 0 && fn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const o = e;
      o.scale.setScalar(po(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Es, S.addEventListener("change", () => {
    var _a3;
    On(), Qt.visible && bs(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), Es();
  }), window.__hekatanShowSnap = (e, o, s) => {
    wt.position.set(e, o, s), wt.visible = true, On(), C();
  }, window.__hekatanHideSnap = () => {
    wt.visible = false, C();
  }, F.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o), Z = null;
    const s = ge();
    if ((!s.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && rt.visible && (rt.visible = false), s.length) {
      const n = s[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const h = on([n.x, n.y, n.z]);
        if (h) {
          const M = h.map((u) => t.points.rawVal[u]), _ = [];
          for (let u = 1; u < M.length - 1; u++) _.push(M[0][0], M[0][1], M[0][2], M[u][0], M[u][1], M[u][2], M[u + 1][0], M[u + 1][1], M[u + 1][2]);
          const m = rt.geometry;
          m.setAttribute("position", new Vt(_, 3)), m.computeVertexNormals(), rt.visible = true;
        } else rt.visible = false;
      } else rt.visible && (rt.visible = false);
      const a = e.altKey;
      let c = false;
      const i = Zo(n), r = a ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, n.x, n.y, n.z, i, { x: e.clientX, y: e.clientY });
      if (r) _o(r.type, r.x, r.y, r.z), wt.position.set(r.x, r.y, r.z), wt.visible = true, n.set(r.x, r.y, r.z), So(r.type, e.clientX, e.clientY);
      else if (!a && (Se = Ce(e.clientX, e.clientY))) c = true, n.copy(Se), _o("ifcSec", n.x, n.y, n.z), So("ifcSec", e.clientX, e.clientY), wt.position.copy(n), wt.visible = true;
      else if (ce && !a) c = true, _o(ce.tipo, n.x, n.y, n.z), So(ce.tipo, e.clientX, e.clientY), wt.position.copy(n), wt.visible = true;
      else {
        Ea(), ko();
        const p = !a && window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0.5;
        p && h > 0 && (n.x = Math.round(n.x / h) * h, n.y = Math.round(n.y / h) * h, n.z = Math.round(n.z / h) * h), wt.position.copy(n), wt.visible = true;
      }
      On(), G(Z && !r && (c || ce) ? H(Z) : null), Lt = { p: n.clone(), x: e.clientX, y: e.clientY };
      const l = ((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.tool) ?? "select";
      if (l === "select" || !l) {
        const p = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = Ma(n.x, n.y, n.z, p), M = No(n.x, n.y, n.z, p), _ = _s(n.x, n.y, n.z, p);
        if (h >= 0) {
          const v = t.points.rawVal[h];
          Qt.position.set(v[0], v[1], v[2]), Qt.visible = true, bs(), un.visible = false, pn = { kind: "pt", a: h };
        } else if (M) {
          const v = t.points.rawVal, V = t.polylines.rawVal[M.polyIdx], k = v[V[M.segIdx]], P = v[V[M.segIdx + 1]];
          un.geometry.setFromPoints([new E(k[0], k[1], k[2]), new E(P[0], P[1], P[2])]), un.visible = true, Qt.visible = false, pn = ((_l = (_k = t.areas) == null ? void 0 : _k.rawVal) == null ? void 0 : _l.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (_ >= 0) {
          const V = (((_m = window.__hekatanDrawingAuxLines) == null ? void 0 : _m.rawVal) ?? [])[_];
          V && (un.geometry.setFromPoints([new E(V[0], V[1], V[2]), new E(V[3], V[4], V[5])]), un.visible = true, Qt.visible = false, pn = { kind: "aux", a: _ });
        } else un.visible = false, Qt.visible = false, pn = null;
        Ie.style.left = e.clientX + "px", Ie.style.top = e.clientY + "px", Ie.style.display = "block";
        let m = n;
        if ((pn == null ? void 0 : pn.kind) === "pt") {
          const v = t.points.rawVal[pn.a];
          v && (m = new E(v[0], v[1], v[2]));
        }
        const u = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [m.x, m.y, m.z], pn) {
          const v = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Ie.textContent = `${u}  \xB7  \u{1F5B1} Click \u2192 ${v[pn.kind]}`;
        } else Ie.textContent = u;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = u), Lt = { p: m.clone(), x: e.clientX, y: e.clientY }, Ye.visible = false, Xt.visible = false, Yt.visible = false, C();
        return;
      }
      if (l === "delete" || l === "trim" || l === "extend" || l === "offset") {
        const p = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = No(n.x, n.y, n.z, p), M = _s(n.x, n.y, n.z, p);
        let _ = false;
        if (M >= 0) if (!h) _ = true;
        else {
          const v = window.__hekatanDrawingAuxLines, k = ((v == null ? void 0 : v.rawVal) ?? (v == null ? void 0 : v.val) ?? v ?? [])[M];
          Hn(n.x, n.y, n.z, k[0], k[1], k[2], k[3], k[4], k[5]) < h.dist && (_ = true);
        }
        _ ? (Mn = M, ln = -1, vn = -1, ba(M)) : h ? (ln = h.polyIdx, vn = h.segIdx, Mn = -1, _a(h.polyIdx, h.segIdx)) : (ln = -1, vn = -1, Mn = -1, Zt.visible = false), Ye.visible = false, Xt.visible = false, Yt.visible = false, mt(), Ie.style.left = e.clientX + "px", Ie.style.top = e.clientY + "px", Ie.style.display = "block";
        const m = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let u = "";
        _ ? u = `\u{1F5D1} l\xEDnea aux #${Mn + 1}` : h ? u = ((_o2 = (_n2 = t.areas) == null ? void 0 : _n2.rawVal) == null ? void 0 : _o2.includes(h.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${h.polyIdx + 1}` : `\u{1F5D1} seg ${h.segIdx + 1} / poly #${h.polyIdx + 1}` : u = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Ie.textContent = `${m}  \xB7  ${u}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = m), C();
        return;
      } else Zt.visible = false, ln = -1, Mn = -1;
      Ie.style.left = e.clientX + "px", Ie.style.top = e.clientY + "px", Ie.style.display = "block";
      const f = ((_p = t.polylines) == null ? void 0 : _p.rawVal) ?? [], d = f[f.length - 1] ?? [], w = t.points.rawVal ?? [];
      if (d.length > 0 && w[d[d.length - 1]]) {
        const p = d[d.length - 1], h = w[p];
        let M = kt;
        co = null;
        const _ = !!r || c;
        if (!M && !_ && window.__hekatanAxisSnap !== false) {
          const qe = F.getBoundingClientRect(), je = e.clientX, Ee = e.clientY, Ge = ((_q = settings.gridSize) == null ? void 0 : _q.rawVal) ?? 10, De = new E(h[0], h[1], h[2]), ze = [["x", new E(1, 0, 0)], ["y", new E(0, 1, 0)], ["z", new E(0, 0, 1)]], Xe = (ft) => {
            const gt = ft.clone().project(o);
            return { x: (gt.x * 0.5 + 0.5) * qe.width + qe.left, y: (-gt.y * 0.5 + 0.5) * qe.height + qe.top };
          };
          let Ke = null;
          for (const [ft, gt] of ze) {
            const At = Xe(De.clone().addScaledVector(gt, -Ge)), tn = Xe(De.clone().addScaledVector(gt, Ge)), Kn = tn.x - At.x, En = tn.y - At.y, Xa = je - At.x, Ya = Ee - At.y, Ua = Kn * Kn + En * En || 1;
            let zo = (Xa * Kn + Ya * En) / Ua;
            zo = Math.max(0, Math.min(1, zo));
            const qs = Math.hypot(je - (At.x + zo * Kn), Ee - (At.y + zo * En));
            if (Ke === null || qs < Ke.dpx) {
              const ns = L.ray, Ks = De.clone().sub(ns.origin), os = gt.dot(ns.direction), Ws = gt.dot(Ks), Za = ns.direction.dot(Ks), Gs = 1 - os * os, qa = Math.abs(Gs) < 1e-6 ? -Ws : (os * Za - Ws) / Gs;
              Ke = { axis: ft, dpx: qs, pt: De.clone().addScaledVector(gt, qa) };
            }
          }
          Ke && Ke.dpx <= 12 && (n.copy(Ke.pt), M = Ke.axis, co = Ke.pt.clone());
        }
        const m = !!window.__hekatanOrthoMode;
        if (!M && !_ && m) {
          const qe = Math.abs(n.x - h[0]), je = Math.abs(n.y - h[1]), Ee = Math.abs(n.z - h[2]), Ge = (_r = s[0]) == null ? void 0 : _r.object;
          let De = null;
          Ge === Ut ? De = "xy" : Ge === sn ? De = "xz" : Ge === an && (De = "yz"), De === "xy" ? M = qe >= je ? "x" : "y" : De === "xz" ? M = qe >= Ee ? "x" : "z" : De === "yz" ? M = je >= Ee ? "y" : "z" : M = qe >= je && qe >= Ee ? "x" : je >= Ee ? "y" : "z";
        }
        const u = window.__hekatanPolarTrack !== false;
        if (!M && !_ && u) {
          const qe = n.x - h[0], je = n.y - h[1], Ee = n.z - h[2], Ge = Math.hypot(qe, je, Ee);
          if (Ge > 1e-3) {
            const ze = Math.tan(6 * Math.PI / 180) * Ge, Xe = Math.hypot(je, Ee), Ke = Math.hypot(qe, Ee), ft = Math.hypot(qe, je), gt = [["x", Xe], ["y", Ke], ["z", ft]];
            gt.sort((At, tn) => At[1] - tn[1]), gt[0][1] <= ze && (M = gt[0][0]);
          }
        }
        if (M) {
          const qe = h[0], je = h[1], Ee = h[2];
          M === "x" ? n.set(n.x, je, Ee) : M === "y" ? n.set(qe, n.y, Ee) : n.set(qe, je, n.z);
          const Ge = !!kt, ze = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          Tt.style.background = "rgba(15,23,42,0.92)", Tt.style.color = ze, Tt.style.border = `1.5px solid ${ze}`;
          const Xe = (_s2 = s[0]) == null ? void 0 : _s2.object;
          let Ke = null;
          Xe === Ut ? Ke = "xy" : Xe === sn ? Ke = "xz" : Xe === an && (Ke = "yz");
          const ft = Ke ? ` (plano ${Ke.toUpperCase()})` : "";
          Tt.textContent = Ge ? `\u{1F512} LOCK ${M.toUpperCase()}${ft}` : `\u22A5 ORTO ${M.toUpperCase()}${ft}`, Tt.style.left = e.clientX + 20 + "px", Tt.style.top = e.clientY + 18 + "px", Tt.style.transform = "none", Tt.style.display = "block";
        } else kt || (Tt.style.display = "none");
        let x = null;
        if (!a && !_ && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const qe = t.points.rawVal, je = M ? [M] : ["z", "x", "y"], Ee = { x: e.clientX, y: e.clientY };
          let Ge = 1 / 0;
          for (const De of qe) if (!(Math.abs(De[0] - h[0]) < 1e-9 && Math.abs(De[1] - h[1]) < 1e-9 && Math.abs(De[2] - h[2]) < 1e-9)) for (const ze of je) {
            const Xe = new E(ze === "x" ? De[0] : n.x, ze === "y" ? De[1] : n.y, ze === "z" ? De[2] : n.z), Ke = An(Xe.x, Xe.y, Xe.z);
            if (!Ke) continue;
            const ft = Math.hypot(Ke.x - Ee.x, Ke.y - Ee.y);
            ft < bn && ft < Ge && (Ge = ft, x = { q: De, eje: ze });
          }
        }
        x ? (x.eje === "x" ? n.x = x.q[0] : x.eje === "y" ? n.y = x.q[1] : n.z = x.q[2], Yt.geometry.setFromPoints([new E(x.q[0], x.q[1], x.q[2]), new E(n.x, n.y, n.z)]), (_t2 = Yt.computeLineDistances) == null ? void 0 : _t2.call(Yt), Yt.visible = true, wt.position.set(n.x, n.y, n.z), wt.visible = true, So("track", e.clientX, e.clientY)) : Yt.visible = false, Lt = { p: n.clone(), x: e.clientX, y: e.clientY };
        const v = Math.hypot(n.x - h[0], n.y - h[1], n.z - h[2]), V = Math.atan2(n.y - h[1], n.x - h[0]) * 180 / Math.PI, k = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`, P = (V % 360 + 360) % 360;
        Ie.textContent = `L = ${v.toFixed(3)} m   \u2220 ${P.toFixed(1)}\xB0   \xB7   ${k}`;
        const $ = document.getElementById("hk-coord-fixed");
        $ && ($.textContent = k), Ye.geometry.setFromPoints([new E(h[0], h[1], h[2]), new E(n.x, n.y, n.z)]), (_u = Ye.computeLineDistances) == null ? void 0 : _u.call(Ye), Ye.visible = true, Be(h[0], h[1], h[2], n.x, n.y, n.z);
        const T = window.__hekatanOrthoExt ?? 8, I = window.__hekatanShowOrthoPlanes !== false;
        cn.visible = I, I || gs(null), I && (yn(Rn, h, "xy", T), yn(Pn, h, "xz", T), yn(Dn, h, "yz", T), wn(Ut, h, "xy", T), wn(sn, h, "xz", T), wn(an, h, "yz", T));
        const Y = I ? L.intersectObjects([Ut, sn, an], false) : [];
        let ee = null;
        if (Y.length > 0) {
          const qe = Y[0].object;
          qe === Ut ? ee = "xy" : qe === sn ? ee = "xz" : qe === an && (ee = "yz");
        }
        gs(ee), ee && (dn.style.left = e.clientX + "px", dn.style.top = e.clientY + "px"), mn.geometry.setFromPoints([new E(h[0] - T, h[1], h[2]), new E(h[0] + T, h[1], h[2])]), (_v = mn.computeLineDistances) == null ? void 0 : _v.call(mn), In.geometry.setFromPoints([new E(h[0], h[1] - T, h[2]), new E(h[0], h[1] + T, h[2])]), (_w = In.computeLineDistances) == null ? void 0 : _w.call(In), Ln.geometry.setFromPoints([new E(h[0], h[1], h[2] - T), new E(h[0], h[1], h[2] + T)]), (_x = Ln.computeLineDistances) == null ? void 0 : _x.call(Ln), Xt.visible = true;
        const pe = mn.material, be = In.material, Je = Ln.material;
        M === "x" ? (pe.opacity = 0.95, be.opacity = 0.1, Je.opacity = 0.1) : M === "y" ? (pe.opacity = 0.1, be.opacity = 0.95, Je.opacity = 0.1) : M === "z" ? (pe.opacity = 0.1, be.opacity = 0.1, Je.opacity = 0.95) : (pe.opacity = 0.5, be.opacity = 0.5, Je.opacity = 0.5);
      } else {
        const p = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        Ie.textContent = p;
        const h = document.getElementById("hk-coord-fixed");
        if (h && (h.textContent = p), Ye.visible = false, Xt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(l)) {
          if (Te = null, lt = null, Pe.style.left = e.clientX + 20 + "px", Pe.style.top = e.clientY - 28 + "px", Pe.style.display = "block", !Qe) {
            Pe.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const _ = document.activeElement;
            !(_ && (_.tagName === "INPUT" || _.tagName === "TEXTAREA") && _ !== Pe) && document.activeElement !== Pe && Pe.focus({ preventScroll: true });
            try {
              Pe.select();
            } catch {
            }
          }
        } else mt();
      }
      C();
    } else ko(), Ie.style.display = "none", wt.visible = false, Ye.visible = false, Xt.visible = false, mt(), C();
  }), re.derive(() => {
    var _a3;
    if (!t.gridTarget) return;
    const e = new ls().setFromEuler(new oo(...t.gridTarget.val.rotation)), o = new ls().setFromAxisAngle(new E(1, 0, 0), Math.PI / 2);
    Vi(y, { position: new E(...t.gridTarget.val.position), quaternion: e.clone().multiply(o) }, C);
    {
      const n = t.gridTarget.val.position[2], a = Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const c of Gn) g.remove(c), Bo(c);
      if (Gn.length = 0, a) {
        const c = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], i = /* @__PURE__ */ new Set([0]);
        for (const l of c) i.add(+l[2].toFixed(3));
        for (const l of window.__hekatanLevels ?? []) isFinite(l == null ? void 0 : l.z) && i.add(+l.z.toFixed(3));
        const r = [...i].sort((l, f) => l - f).slice(0, 24);
        for (const l of r) {
          if (Math.abs(l - n) < 1e-6) continue;
          const f = y.clone(true);
          f.name = `hekatan-grid-nivel-${l}`, f.traverse((d) => {
            d.material && (d.material = d.material.clone(), d.material.transparent = true, d.material.opacity = (d.material.opacity ?? 1) * (Math.abs(l) < 1e-6 ? 0.5 : 0.22));
          }), f.position.set(0, 0, l), f.quaternion.copy(o), g.add(f), Gn.push(f);
        }
      }
    }
    te.position.set(...t.gridTarget.val.position), te.quaternion.setFromEuler(new oo(...t.gridTarget.val.rotation)), te.updateMatrixWorld();
    const s = new E(0, 0, 1).applyEuler(new oo(...t.gridTarget.val.rotation));
    U = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), re.derive(() => {
    Le.geometry.setAttribute("position", new Vt(t.points.val.flat(), 3)), Le.geometry.computeBoundingSphere();
  }), re.derive(() => {
    const e = 0.05 * z * 0.5 * A.val;
    L.params.Points.threshold = 0.4 * e;
  }), re.derive(() => {
    var _a3;
    const e = t.points.val ?? [], s = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], n = [];
    for (const c of s) {
      const [i, r, l] = e[c];
      n.push(i, r, l);
    }
    const a = new Ae();
    a.setAttribute("position", new Vt(n, 3)), tt.geometry.dispose(), tt.geometry = a;
  });
  let qo = false, Cn = 0;
  F.addEventListener("pointerdown", () => {
    qo = true;
  }), F.addEventListener("pointerup", () => {
    qo = false;
  }), F.addEventListener("pointermove", () => {
    qo && Cn++;
  });
  const Nt = document.createElement("div");
  Nt.id = "hk-window-select", Nt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Nt);
  let en = null, jn = false, Wt = null;
  const Ko = (e, o, s, n, a) => {
    a ? (Nt.style.borderColor = "#34d399", Nt.style.borderStyle = "dashed", Nt.style.background = "rgba(52, 211, 153, 0.10)") : (Nt.style.borderColor = "#22d3ee", Nt.style.borderStyle = "solid", Nt.style.background = "rgba(34, 211, 238, 0.10)"), Nt.style.left = Math.min(e, s) + "px", Nt.style.top = Math.min(o, n) + "px", Nt.style.width = Math.abs(s - e) + "px", Nt.style.height = Math.abs(n - o) + "px", Nt.style.display = "block";
  }, Vs = (e, o, s, n, a) => {
    var _a3, _b, _c, _d;
    const c = Math.min(e, s), i = Math.max(e, s), r = Math.min(o, n), l = Math.max(o, n), f = s < e, d = F.getBoundingClientRect(), w = b();
    w.updateMatrixWorld();
    const p = (P) => {
      const $ = new E(P[0], P[1], P[2]);
      return $.project(w), { x: d.left + ($.x * 0.5 + 0.5) * d.width, y: d.top + (-$.y * 0.5 + 0.5) * d.height };
    }, h = (P) => P.x >= c && P.x <= i && P.y >= r && P.y <= l, M = (P, $) => !(P.x < c && $.x < c || P.x > i && $.x > i || P.y < r && $.y < r || P.y > l && $.y > l);
    a || Ue.clear();
    let _ = 0;
    const m = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let P = 0; P < m.length; P++) {
      const $ = m[P];
      $ && h(p($)) && (Ue.add(`pt:${P}`), _++);
    }
    const u = (P, $) => f ? h(P) || h($) || M(P, $) : h(P) && h($), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], v = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let P = 0; P < x.length; P++) {
      const $ = x[P];
      if (v.includes(P)) {
        let I;
        if (!f) I = $.every((Y) => {
          const ee = m[Y];
          return !!ee && h(p(ee));
        });
        else {
          I = false;
          for (let Y = 0; Y < $.length - 1; Y++) {
            const ee = m[$[Y]], pe = m[$[Y + 1]];
            if (!(!ee || !pe) && u(p(ee), p(pe))) {
              I = true;
              break;
            }
          }
        }
        I && (Ue.add(`poly:${P}`), _++);
      } else for (let I = 0; I < $.length - 1; I++) {
        const Y = m[$[I]], ee = m[$[I + 1]];
        !Y || !ee || u(p(Y), p(ee)) && (Ue.add(`seg:${P}:${I}`), _++);
      }
    }
    const k = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let P = 0; P < k.length; P++) {
      const $ = k[P];
      if (!$ || $.length !== 6) continue;
      const T = p([$[0], $[1], $[2]]), I = p([$[3], $[4], $[5]]);
      u(T, I) && (Ue.add(`aux:${P}`), _++);
    }
    Ot(), ie(_ === 0 && !f ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${f ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${_} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ue.size})`), Nt.style.display = "none";
  }, Mo = () => {
    Wt && (Wt = null, Nt.style.display = "none", ie("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Mo, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Wt && Mo();
  });
  const Wo = () => {
    var _a3, _b, _c, _d;
    if (Ue.size === 0) return false;
    const e = [...Ue], o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, c = (a == null ? void 0 : a.rawVal) ?? [], i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set();
    for (const M of e) {
      const [_, ...m] = M.split(":");
      if (_ === "pt") i.add(+m[0]);
      else if (_ === "poly") r.add(+m[0]);
      else if (_ === "seg") {
        const u = +m[0], x = +m[1];
        l.has(u) || l.set(u, /* @__PURE__ */ new Set()), l.get(u).add(x);
      } else _ === "aux" && f.add(+m[0]);
    }
    let d = 0, w = [], p = [];
    const h = /* @__PURE__ */ new Map();
    for (let M = 0; M < s.length; M++) {
      if (r.has(M)) {
        d++;
        continue;
      }
      h.set(M, w.length);
      const _ = l.get(M);
      if (_ && _.size > 0) {
        let m = [];
        for (let u = 0; u < s[M].length; u++) m.push(s[M][u]), u < s[M].length - 1 && _.has(u) && (m.length >= 2 && w.push(m), m = [], d++);
        (m.length >= 2 || m.length === 1) && w.push(m);
      } else w.push([...s[M]]);
    }
    if (i.size > 0) {
      const M = [], _ = /* @__PURE__ */ new Map();
      for (let u = 0; u < o.length; u++) {
        if (i.has(u)) {
          d++;
          continue;
        }
        _.set(u, M.length), M.push([...o[u]]);
      }
      const m = [];
      for (const u of w) {
        let x = [];
        for (const v of u) {
          const V = _.get(v);
          V === void 0 ? (x.length >= 2 && m.push(x), x = []) : x.push(V);
        }
        x.length >= 2 && m.push(x);
      }
      w = m, t.points.val = M;
    }
    for (const M of n) {
      const _ = h.get(M);
      _ !== void 0 && _ < w.length && p.push(_);
    }
    if (t.polylines && (t.polylines.val = w), t.areas && (t.areas.val = p), f.size > 0 && a) {
      const M = c.filter((_, m) => !f.has(m));
      "val" in a ? a.val = M : window.__hekatanDrawingAuxLines = M, d += f.size;
    }
    Ue.clear(), Ot();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ie(`\u{1F5D1} ${d} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Wo, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || Ue.size !== 0 && (e.preventDefault(), Wo());
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
    let o = false, s = 0, n = 0, a = 0, c = 0;
    e.addEventListener("mousedown", (i) => {
      o = true, s = i.clientX, n = i.clientY;
      const r = qt.getBoundingClientRect();
      a = r.left, c = r.top, qt.style.transform = "none", qt.style.left = `${a}px`, qt.style.top = `${c}px`, i.preventDefault();
    }), window.addEventListener("mousemove", (i) => {
      if (!o) return;
      const r = i.clientX - s, l = i.clientY - n, f = Math.max(0, Math.min(window.innerWidth - 80, a + r)), d = Math.max(0, Math.min(window.innerHeight - 40, c + l));
      qt.style.left = `${f}px`, qt.style.top = `${d}px`;
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
  const zt = (e, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: o, prop: s, value: n } }));
  }, Aa = () => {
    if (ut && (ut.dispose(), ut = null), Ue.size === 0) {
      qt.style.display = "none";
      return;
    }
    const e = [...Ue], o = e.filter((w) => w.startsWith("pt:")), s = e.filter((w) => w.startsWith("seg:")), n = e.filter((w) => w.startsWith("poly:")), a = e.filter((w) => w.startsWith("aux:")), c = o.length > 0, i = s.length > 0, r = n.length > 0, l = !c && !i && !r, f = [];
    o.length && f.push(`\u{1F535} ${o.length} nodo(s)`), s.length && f.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && f.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && f.push(`\u250A ${a.length} aux`);
    const d = `\u{1F3AF} ${Ue.size} item(s) \u2014 ${f.join(", ")}`;
    ut = new fa({ container: qt, title: d });
    {
      const w = ut.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      w.addBinding(yt, "dx", { label: "\u0394x (m)", step: 0.1 }), w.addBinding(yt, "dy", { label: "\u0394y (m)", step: 0.1 }), w.addBinding(yt, "dz", { label: "\u0394z (m)", step: 0.1 }), w.addBinding(yt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), w.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a3;
        const _ = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, yt.dx, yt.dy, yt.dz, yt.copias);
        ie(_ ? `\u29C9 Replicado \xD7${_} (\u0394 ${yt.dx},${yt.dy},${yt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), w.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a3;
        const _ = (_a3 = window.__hekatanExtrudeSelection) == null ? void 0 : _a3.call(window, yt.dx, yt.dy, yt.dz, yt.copias);
        ie(_ && (_.lineas || _.areas) ? `\u21D7 Extruido: ${_.lineas} barra(s), ${_.areas} pa\xF1o(s) (\u0394 ${yt.dx},${yt.dy},${yt.dz} m \xD7 ${yt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const p = { vuelo: 1.5, losa: true, borde: true, ambos: true }, h = w.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      h.addBinding(p, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), h.addBinding(p, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), h.addBinding(p, "borde", { label: "con viga de borde" }), h.addBinding(p, "ambos", { label: "a los dos lados" }), h.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a3;
        const _ = (_a3 = window.__hekatanVoladoSelection) == null ? void 0 : _a3.call(window, p.vuelo, { losa: p.losa, vigaBorde: p.borde, lados: p.ambos ? "ambos" : "afuera" });
        ie(_ ? `\u2310 Volado de ${p.vuelo} m en ${_} pa\xF1o(s)` + (p.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), w.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a3;
        const _ = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, yt.dx, yt.dy, yt.dz, 1);
        ie(_ ? `\u2192 Copia desplazada \u0394 ${yt.dx},${yt.dy},${yt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const M = w.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      M.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a3;
        return (_a3 = window.__hekatanToggleSnap) == null ? void 0 : _a3.call(window);
      }), M.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ie(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (c) {
      const w = ut.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      w.addBinding(ue, "Ux"), w.addBinding(ue, "Uy"), w.addBinding(ue, "Uz"), w.addBinding(ue, "Rx"), w.addBinding(ue, "Ry"), w.addBinding(ue, "Rz");
      const p = (u, x) => {
        [ue.Ux, ue.Uy, ue.Uz, ue.Rx, ue.Ry, ue.Rz] = u;
        try {
          ut.refresh();
        } catch {
        }
        zt("nodes", o, "supports", u), ie(`\u2713 ${x}: ${o.length} nudo(s) apoyado(s) (${u.map((v, V) => v ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][V] : "").filter(Boolean).join(" ")}).`);
      };
      w.addButton({ title: `\u25B2 Empotrar los ${o.length} nudo(s) (6 GDL)` }).on("click", () => p([true, true, true, true, true, true], "Empotrado")), w.addButton({ title: `\u25B3 Articular los ${o.length} nudo(s) (Ux Uy Uz)` }).on("click", () => p([true, true, true, false, false, false], "Articulado"));
      const h = ut.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      h.addBinding(ue, "Kx", { label: "Kx", min: 0, step: 100 }), h.addBinding(ue, "Ky", { label: "Ky", min: 0, step: 100 }), h.addBinding(ue, "Kz", { label: "Kz", min: 0, step: 100 }), h.addBinding(ue, "Krx", { label: "Krx", min: 0, step: 1e3 }), h.addBinding(ue, "Kry", { label: "Kry", min: 0, step: 1e3 }), h.addBinding(ue, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const M = ut.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      M.addBinding(ue, "Fx", { step: 0.1 }), M.addBinding(ue, "Fy", { step: 0.1 }), M.addBinding(ue, "Fz", { step: 0.1 }), M.addBinding(ue, "Mx", { step: 0.1 }), M.addBinding(ue, "My", { step: 0.1 }), M.addBinding(ue, "Mz", { step: 0.1 }), ut.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ue, "mass", { label: "m", min: 0, step: 1 }), ut.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ue, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), ut.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let u = 0;
        const x = [ue.Ux, ue.Uy, ue.Uz, ue.Rx, ue.Ry, ue.Rz];
        x.some((k) => k) && (zt("nodes", o, "supports", x), u++);
        const v = [ue.Fx, ue.Fy, ue.Fz, ue.Mx, ue.My, ue.Mz];
        v.some((k) => k !== 0) && (zt("nodes", o, "loads", v), u++);
        const V = [ue.Kx, ue.Ky, ue.Kz, ue.Krx, ue.Kry, ue.Krz];
        if (V.some((k) => k !== 0) && (zt("nodes", o, "springs", V), u++), ue.mass !== 0 && (zt("nodes", o, "mass", ue.mass), u++), ue.diaphragm !== "Ninguno" && (zt("nodes", o, "diaphragm", ue.diaphragm), u++), u === 0) {
          ie("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let k = document.getElementById("hk-prop-toast");
          k || (k = document.createElement("div"), k.id = "hk-prop-toast", k.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(k)), k.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", k.style.background = "rgba(217,119,6,0.97)", k.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            k && (k.style.opacity = "0");
          }, 3200);
        } else ie(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (i) {
      const w = ut.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      w.addBinding(ue, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), w.addBinding(ue, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const p = ut.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      p.addBinding(ue, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), p.addBinding(ue, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), p.addBinding(ue, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), p.addBinding(ue, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), ut.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ue, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), ut.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ue, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const _ = ut.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      _.addBinding(ue, "relMxI", { label: "Mx I" }), _.addBinding(ue, "relMyI", { label: "My I" }), _.addBinding(ue, "relMzI", { label: "Mz I" });
      const m = ut.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      m.addBinding(ue, "relMxJ", { label: "Mx J" }), m.addBinding(ue, "relMyJ", { label: "My J" }), m.addBinding(ue, "relMzJ", { label: "Mz J" }), ut.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ue, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const x = ut.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      x.addBinding(ue, "LKx", { label: "LKx", min: 0, step: 100 }), x.addBinding(ue, "LKy", { label: "LKy", min: 0, step: 100 }), x.addBinding(ue, "LKz", { label: "LKz", min: 0, step: 100 });
      const v = ut.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      v.addBinding(ue, "qx", { step: 0.1 }), v.addBinding(ue, "qy", { step: 0.1 }), v.addBinding(ue, "qz", { step: 0.1 }), ut.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ue, "massPerM", { label: "m/L", min: 0, step: 1 }), ut.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        zt("segs", s, "section", ue.section), zt("segs", s, "material", ue.material_frame);
        const k = { A: ue.A_mod, Iz: ue.Iz_mod, Iy: ue.Iy_mod, J: ue.J_mod };
        (k.A !== 1 || k.Iz !== 1 || k.Iy !== 1 || k.J !== 1) && zt("segs", s, "modifiers", k), ue.insertionPoint !== "10 \u2014 Centroid" && zt("segs", s, "insertionPoint", ue.insertionPoint), ue.beta !== 0 && zt("segs", s, "beta", ue.beta);
        const P = [ue.relMxI, ue.relMyI, ue.relMzI], $ = [ue.relMxJ, ue.relMyJ, ue.relMzJ];
        (P.some((Y) => Y) || $.some((Y) => Y)) && zt("segs", s, "releases", { i: P, j: $ }), ue.hinges !== "None" && zt("segs", s, "hinges", ue.hinges);
        const T = [ue.LKx, ue.LKy, ue.LKz];
        T.some((Y) => Y !== 0) && zt("segs", s, "lineSprings", T);
        const I = [ue.qx, ue.qy, ue.qz];
        I.some((Y) => Y !== 0) && zt("segs", s, "distLoad", I), ue.massPerM !== 0 && zt("segs", s, "massPerM", ue.massPerM), ie(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (r) {
      const w = ut.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      w.addBinding(ue, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), w.addBinding(ue, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), w.addBinding(ue, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), ut.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ue, "surfLoad", { label: "q", step: 0.1 }), ut.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        zt("areas", n, "shellType", ue.shellType), zt("areas", n, "thickness", ue.thickness), zt("areas", n, "material", ue.material_shell), ue.surfLoad !== 0 && zt("areas", n, "surfLoad", ue.surfLoad), ie(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (l) {
      const w = ut.addFolder({ title: "\u2139 Selecci\xF3n" }), p = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      w.addBinding(p, "msg", { readonly: true, label: "" });
    }
    ut.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ue.clear(), Ot();
    }), qt.style.display = "block", za();
  };
  window.__hekatanRefreshPropsPane = Aa;
  let Un = null, bo = false;
  F.addEventListener("pointerdown", (e) => {
    e.button === 2 && (Un = { x: e.clientX, y: e.clientY }, bo = false);
  }), F.addEventListener("pointermove", (e) => {
    if (Un && e.buttons & 2 && !bo) {
      const o = e.clientX - Un.x, s = e.clientY - Un.y;
      Math.hypot(o, s) > 8 && (bo = true);
    }
  }), F.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const o = Un !== null && !bo;
      Un = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Wt ? Mo() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ue.size > 0 && (Ue.clear(), Ot()), t.polylines) {
          const c = t.polylines.rawVal;
          (c[c.length - 1] ?? []).length > 0 && (t.polylines.val = [...c, []]);
        }
        const n = window.__hekatanCadState, a = (_b = (_a3 = n == null ? void 0 : n.get) == null ? void 0 : _a3.call(n)) == null ? void 0 : _b.tool;
        a && a !== "select" && a !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), ie(`\u238B Cancelado \u2014 tool '${a}' cerrado, volv\xE9s a Seleccionar`)) : ie("\u238B Cancelado (click derecho)");
      }
    }
  }), F.addEventListener("contextmenu", (e) => {
    e.preventDefault(), e.stopPropagation();
  }, { capture: true }), F.addEventListener("pointerdown", (e) => {
    var _a3, _b, _c;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (en = null, jn = false));
  }), F.addEventListener("pointermove", (e) => {
    if (Wt && e.buttons === 0) {
      const c = e.clientX < Wt.x;
      Ko(Wt.x, Wt.y, e.clientX, e.clientY, c);
      return;
    }
    if (!en) return;
    const o = e.clientX - en.x, s = e.clientY - en.y, n = Math.hypot(o, s);
    if (!jn && n < 8) return;
    jn = true;
    const a = e.clientX < en.x;
    Ko(en.x, en.y, e.clientX, e.clientY, a);
  }), F.addEventListener("pointerup", (e) => {
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
  const Is = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, _o = (e, o, s, n) => {
    var _a3, _b, _c, _d;
    for (; Ht.children.length; ) {
      const i = Ht.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Is[e] ?? 16777215, c = new Ae().setFromPoints([new E(-1, -1, 0), new E(1, -1, 0), new E(1, -1, 0), new E(1, 1, 0), new E(1, 1, 0), new E(-1, 1, 0), new E(-1, 1, 0), new E(-1, -1, 0)]);
    Ht.add(new Jt(c, new dt({ color: a, linewidth: 2 }))), Ht.position.set(o, s, n), Ht.visible = true, Ho();
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
  const So = (e, o, s) => {
    const n = Fa[e];
    if (!n) {
      hn.style.display = "none";
      return;
    }
    hn.textContent = n, hn.style.color = "#" + (Is[e] ?? 16777215).toString(16).padStart(6, "0"), hn.style.left = o + 18 + "px", hn.style.top = s - 26 + "px", hn.style.display = "block";
  }, Ea = () => {
    hn.style.display = "none";
  }, zn = new E(), An = (e, o, s) => {
    const n = b();
    if (!n) return null;
    const a = F.getBoundingClientRect();
    return zn.set(e, o, s).project(n), !isFinite(zn.x) || !isFinite(zn.y) || zn.z < -1 || zn.z > 1 ? null : { x: a.left + (zn.x * 0.5 + 0.5) * a.width, y: a.top + (-zn.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = An;
  const Va = (e, o, s, n, a) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const c = window.__hekatanOsnap, i = t.points.rawVal, r = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let l = null;
    const f = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, d = a, w = (u, x, v, V) => {
      let k;
      if (d) {
        const $ = An(x, v, V);
        if (!$ || (k = Math.hypot($.x - d.x, $.y - d.y), k > bn)) return;
      } else if (k = Math.hypot(x - e, v - o, V - s), k > n) return;
      const P = f[u] ?? 9;
      (!l || P < l.r || P === l.r && k < l.d) && (l = { type: u, x, y: v, z: V, d: k, r: P });
    };
    if (c.ori !== false && w("ori", 0, 0, 0), c.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, x = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, v = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, V = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", k = ($) => Math.round($ / x) * x, P = ($, T) => Math.abs($) <= v + 1e-9 && Math.abs(T) <= v + 1e-9;
      if (V === "xz") {
        const $ = k(e), T = k(s);
        P($, T) && w("grid", $, o, T);
      } else if (V === "yz") {
        const $ = k(o), T = k(s);
        P($, T) && w("grid", e, $, T);
      } else {
        const $ = k(e), T = k(o);
        P($, T) && w("grid", $, T, s);
      }
    }
    (c.node || c.end) && i.forEach((u) => {
      c.node && w("node", u[0], u[1], u[2]);
    });
    for (const u of r) if (!(u.length < 2)) for (let x = 0; x < u.length - 1; x++) {
      const v = i[u[x]], V = i[u[x + 1]];
      if (!(!v || !V) && (c.end && (w("end", v[0], v[1], v[2]), w("end", V[0], V[1], V[2])), c.mid && w("mid", (v[0] + V[0]) / 2, (v[1] + V[1]) / 2, (v[2] + V[2]) / 2), c.nea || c.per)) {
        const k = V[0] - v[0], P = V[1] - v[1], $ = V[2] - v[2], T = k * k + P * P + $ * $;
        if (T < 1e-12) continue;
        const I = Math.max(0, Math.min(1, ((e - v[0]) * k + (o - v[1]) * P + (s - v[2]) * $) / T)), Y = v[0] + I * k, ee = v[1] + I * P, pe = v[2] + I * $;
        c.nea && w("nea", Y, ee, pe), c.per && w("per", Y, ee, pe);
      }
    }
    if (c.cen) {
      const u = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const x of u) {
        const v = r[x];
        if (!v || v.length < 3) continue;
        const V = v[0] === v[v.length - 1] ? v.slice(0, -1) : v;
        let k = 0, P = 0, $ = 0, T = 0;
        for (const I of V) {
          const Y = i[I];
          Y && (k += Y[0], P += Y[1], $ += Y[2], T++);
        }
        T >= 3 && w("cen", k / T, P / T, $ / T);
      }
    }
    if (c.cen) {
      const u = Cs(), x = [...wo];
      for (const v of u) x.some((V) => Math.hypot(V.c[0] - v.c[0], V.c[1] - v.c[1], V.c[2] - v.c[2]) < 1e-6 && Math.abs(V.r - v.r) < 1e-6) || x.push(v);
      for (const v of x) {
        if (!i.some((P) => Math.abs(Math.hypot(P[0] - v.c[0], P[1] - v.c[1], P[2] - v.c[2]) - v.r) < 1e-6)) continue;
        const k = Math.hypot(e - v.c[0], o - v.c[1], s - v.c[2]);
        if (k < n || Math.abs(k - v.r) < n) {
          const P = Math.min(k, n * 0.5), $ = 3;
          (!l || $ < l.r || $ === l.r && P < l.d) && (l = { type: "cen", x: v.c[0], y: v.c[1], z: v.c[2], d: P, r: $ });
        }
      }
    }
    if (c.int) {
      const u = [];
      for (const x of r) for (let v = 0; v < x.length - 1; v++) {
        const V = i[x[v]], k = i[x[v + 1]];
        if (!V || !k) continue;
        const P = k[0] - V[0], $ = k[1] - V[1], T = k[2] - V[2], I = P * P + $ * $ + T * T;
        if (I < 1e-12) continue;
        const Y = Math.max(0, Math.min(1, ((e - V[0]) * P + (o - V[1]) * $ + (s - V[2]) * T) / I));
        Math.hypot(V[0] + Y * P - e, V[1] + Y * $ - o, V[2] + Y * T - s) < 3 * n && u.push([V, k]);
      }
      for (let x = 0; x < u.length; x++) for (let v = x + 1; v < u.length; v++) {
        const [V, k] = u[x], [P, $] = u[v], T = [k[0] - V[0], k[1] - V[1], k[2] - V[2]], I = [$[0] - P[0], $[1] - P[1], $[2] - P[2]], Y = [V[0] - P[0], V[1] - P[1], V[2] - P[2]], ee = T[0] * T[0] + T[1] * T[1] + T[2] * T[2], pe = T[0] * I[0] + T[1] * I[1] + T[2] * I[2], be = I[0] * I[0] + I[1] * I[1] + I[2] * I[2], Je = T[0] * Y[0] + T[1] * Y[1] + T[2] * Y[2], qe = I[0] * Y[0] + I[1] * Y[1] + I[2] * Y[2], je = ee * be - pe * pe;
        if (je < 1e-12) continue;
        const Ee = (pe * qe - be * Je) / je, Ge = (ee * qe - pe * Je) / je;
        if (Ee < -1e-6 || Ee > 1 + 1e-6 || Ge < -1e-6 || Ge > 1 + 1e-6) continue;
        const De = [V[0] + Ee * T[0], V[1] + Ee * T[1], V[2] + Ee * T[2]], ze = [P[0] + Ge * I[0], P[1] + Ge * I[1], P[2] + Ge * I[2]];
        if (Math.hypot(De[0] - ze[0], De[1] - ze[1], De[2] - ze[2]) > 1e-4) continue;
        [V, k, P, $].some((Ke) => Math.hypot(Ke[0] - De[0], Ke[1] - De[1], Ke[2] - De[2]) < 1e-6) || w("int", De[0], De[1], De[2]);
      }
    }
    const p = window.__hekatanAxisGrids ?? [], h = window.__hekatanLevels ?? [], M = p.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, x] of M) {
      c.end && (w("end", u[0], u[1], u[2]), w("end", x[0], x[1], x[2]));
      const v = x[0] - u[0], V = x[1] - u[1], k = x[2] - u[2], P = v * v + V * V + k * k;
      if (P < 1e-12) continue;
      const $ = Math.max(0, Math.min(1, ((e - u[0]) * v + (o - u[1]) * V + (s - u[2]) * k) / P));
      if (c.nea && w("nea", u[0] + $ * v, u[1] + $ * V, u[2] + $ * k), c.int && Math.abs(k) > 1e-9) for (const T of h) {
        const I = (T.z - u[2]) / k;
        I < -1e-6 || I > 1 + 1e-6 || w("int", u[0] + I * v, u[1] + I * V, T.z);
      }
    }
    if (c.int || c.node) for (let u = 0; u < M.length; u++) for (let x = u + 1; x < M.length; x++) {
      const [v, V] = M[u], [k, P] = M[x], $ = V[0] - v[0], T = V[1] - v[1], I = P[0] - k[0], Y = P[1] - k[1], ee = $ * Y - T * I;
      if (Math.abs(ee) < 1e-12) continue;
      const pe = v[0] - k[0], be = v[1] - k[1], Je = (I * be - Y * pe) / ee, qe = ($ * be - T * pe) / ee;
      if (Je < -1e-6 || Je > 1 + 1e-6 || qe < -1e-6 || qe > 1 + 1e-6) continue;
      const je = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      w("int", v[0] + Je * $, v[1] + Je * T, typeof je == "number" ? je : s);
    }
    const _ = window.__hekatanDrawingAuxLines, m = (_ == null ? void 0 : _.rawVal) ?? (_ == null ? void 0 : _.val) ?? _ ?? [];
    for (const u of m) {
      if (u.length !== 6) continue;
      const x = [u[0], u[1], u[2]], v = [u[3], u[4], u[5]];
      if (c.end && (w("end", x[0], x[1], x[2]), w("end", v[0], v[1], v[2])), c.mid && w("mid", (x[0] + v[0]) / 2, (x[1] + v[1]) / 2, (x[2] + v[2]) / 2), c.nea || c.per) {
        const V = v[0] - x[0], k = v[1] - x[1], P = v[2] - x[2], $ = V * V + k * k + P * P;
        if ($ < 1e-12) continue;
        const T = Math.max(0, Math.min(1, ((e - x[0]) * V + (o - x[1]) * k + (s - x[2]) * P) / $)), I = x[0] + T * V, Y = x[1] + T * k, ee = x[2] + T * P;
        c.nea && w("nea", I, Y, ee), c.per && w("per", I, Y, ee);
      }
    }
    return l ? { type: l.type, x: l.x, y: l.y, z: l.z } : null;
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
    const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of e || []) {
      const c = String(a).split(":");
      let i = [];
      if (c[0] === "pt") {
        const f = o[+c[1]];
        f && (i = [f, [f[0] + 1e-3, f[1], f[2]]]);
      } else if (c[0] === "seg") {
        const f = s[+c[1]] || [], d = o[f[+c[2]]], w = o[f[+c[2] + 1]];
        d && w && (i = [d, w]);
      } else c[0] === "poly" && (i = (s[+c[1]] || []).map((d) => o[d]).filter(Boolean));
      if (i.length < 2) continue;
      const r = new Ae().setFromPoints(i.map((f) => new E(f[0], f[1], f[2]))), l = new Ft(r, Ls);
      l.renderOrder = 1200, Zn.add(l);
    }
    if (!Zn.children.length) return;
    Ts = performance.now() + 900;
    const n = () => {
      const a = Ts - performance.now();
      if (a <= 0) {
        Rs(), C();
        return;
      }
      Ls.opacity = Math.min(1, a / 900) * 0.95, C(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
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
    const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && e.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, ie = (e) => {
    var _a3;
    const o = e + $a();
    to.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, Ia = "Comando:", La = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Ze.length, a = (c, i = []) => ({ txt: c, ops: i });
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
        return a(`\xC1REA LIBRE Precise v\xE9rtice ${et.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return a("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return a(`REGLA ${xt.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
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
        return a(`COLUMNA Precise punto de inserci\xF3n (altura ${St > 0 ? St : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return a(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${St > 0 ? St : 3} m; teclee otra + Enter):`);
      case "plane3":
        return a(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return a("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return a("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return a(Rt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return a(Rt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return a(Rt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Fn > 0 ? ` (distancia ${Fn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Ue.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ue.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ue.size ? a(`SELECCI\xD3N ${Ue.size} objeto${Ue.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(Ia);
    }
  }, Gt = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const e = La(), o = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !o && !s ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Gt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", o = e.split("   |   ")[0] ?? e;
    ie(o);
  }, window.__hekatanCadResetPending = () => {
    Ze = [], et = [], $e.visible = false, Jo(), Rt = null, C(), ie("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Gt();
  };
  function Jo() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((o) => o.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = Jo;
  const qn = [], Po = [], Ta = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, Qo = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])), x: Ta() };
  }, Ds = (e) => {
    var _a3;
    if (t.points.val = e.p, t.polylines && (t.polylines.val = e.l), t.areas && (t.areas.val = e.a), e.x) {
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
      ie("\u21B6 Nada para deshacer");
      return;
    }
    Po.push(Qo()), Ds(e), ie(`\u21B6 Deshacer \u2014 quedan ${qn.length}`);
  }, Bs = () => {
    const e = Po.pop();
    if (!e) {
      ie("\u21B7 Nada para rehacer");
      return;
    }
    qn.push(Qo()), Ds(e), ie(`\u21B7 Rehacer \u2014 quedan ${Po.length}`);
  };
  window.__hekatanPushUndo = bt, window.__hekatanUndo = Co, window.__hekatanRedo = Bs, document.addEventListener("keydown", (e) => {
    var _a3;
    const o = e.key.toLowerCase();
    if (!((e.ctrlKey || e.metaKey) && (o === "y" || o === "z" && e.shiftKey))) return;
    const n = e.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a3 = n.value) == null ? void 0 : _a3.length) ?? 0) > 0 && n.__hkSucio || (e.preventDefault(), e.stopPropagation(), Bs());
  }, { capture: true }), window.__hekatanCadOption = (e) => {
    var _a3, _b, _c, _d, _e2;
    const o = e.trim().toLowerCase(), s = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!t.polylines) return false;
    const n = t.polylines.rawVal, a = n.length ? n[n.length - 1] : [];
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Co(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return ie("Cerrar necesita al menos tres puntos."), true;
      bt(), t.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return Oo(), ie(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return Co(), true;
      bt();
      const c = a[a.length - 1], i = a.slice(0, -1), r = n.some((d, w) => w !== n.length - 1 && d.includes(c)) || i.includes(c);
      let l = t.points.rawVal, f = [...n.slice(0, -1), i];
      if (!r && c === l.length - 1 && (l = l.slice(0, -1), t.points.val = l), t.polylines.val = f, i.length) {
        const d = l[i[i.length - 1]];
        d && (Te = [d[0], d[1], d[2]]);
      } else Te = null, Ye.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return C(), ie(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${i.length}.`), Gt(), true;
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
      e.preventDefault(), e.stopPropagation(), Co();
    }
  }, { capture: true });
  const Oo = () => {
    Ze = [], Rt = null, Jo(), kt = null, vs(), Ye.visible = false, Xt.visible = false, mt(), ie("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), C(), Gt();
  };
  window.__hekatanFinalizeDraw = Oo;
  const Ns = () => {
    var _a3, _b, _c;
    Ze = [], et = [], $e.visible = false;
    let e = false;
    Ue.size && (Ue.clear(), Ot(), e = true), Oo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ie(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), C(), Gt();
  };
  window.__hekatanEscapeCancel = Ns;
  const Xs = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ue.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (e[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = e[+n[1]] || [], c = a[+n[2]], i = a[+n[2] + 1];
        c != null && o.add(c), i != null && o.add(i);
      }
    }), o;
  }, Ys = (e, o, s) => {
    var _a3;
    const n = Xs();
    if (!n.size) return 0;
    bt();
    const a = t.points.rawVal.map((c, i) => n.has(i) ? [c[0] + e, c[1] + o, c[2] + s] : c);
    t.points.val = a;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return Ot(), C(), n.size;
  };
  window.__hekatanMoveSelection = Ys;
  const Us = (e, o) => {
    var _a3, _b, _c, _d, _e2;
    if (!Ue.size) {
      ie(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Gt();
      return;
    }
    if (Ze.push(o), Ze.length === 1) {
      Te = o, ie(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Gt();
      return;
    }
    const [s, n] = Ze, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Ze = [], Ye.visible = false;
    let c = 0;
    e === "move" ? c = Ys(a[0], a[1], a[2]) : (c = Xs().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), ie(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${c} nudo${c === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), e === "move" && (Ue.clear(), Ot()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Gt();
  };
  window.__hekatanPasoMoverCopiar = Us;
  const Ra = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, _n = (e, o) => Math.hypot(e[0] - o[0], e[1] - o[1], e[2] - o[2]), jo = (e, o, s, n, a, c) => {
    const i = [o[0] - e[0], o[1] - e[1], o[2] - e[2]], r = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], l = [e[0] - s[0], e[1] - s[1], e[2] - s[2]], f = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], d = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], w = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], p = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], h = r[0] * l[0] + r[1] * l[1] + r[2] * l[2], M = f * w - d * d;
    if (M < 1e-12) return null;
    const _ = (d * h - w * p) / M, m = (f * h - d * p) / M;
    if (!a && (_ < -1e-6 || _ > 1 + 1e-6) || !c && (m < -1e-6 || m > 1 + 1e-6)) return null;
    const u = [e[0] + _ * i[0], e[1] + _ * i[1], e[2] + _ * i[2]], x = [s[0] + m * r[0], s[1] + m * r[1], s[2] + m * r[2]];
    return _n(u, x) > 1e-4 ? null : u;
  }, Da = (e) => {
    var _a3;
    return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === e).length, 0);
  }, Ba = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Na = (e, o) => {
    var _a3, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal, n = t.points.rawVal, a = Ba[e];
    if (!Rt) {
      if (ln < 0) {
        ie(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Rt = { poly: ln, seg: Math.max(0, vn) }, ie(e === "offset" ? `DESFASE l\xEDnea #${Rt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Fn > 0 ? ` (${Fn} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Gt();
      return;
    }
    if (e === "offset") {
      const _ = Rt.poly, m = s[_];
      if (!m || m.length < 2) {
        Rt = null, ie("DESFASE: esa polil\xEDnea no tiene tramos."), Gt();
        return;
      }
      const u = m.length > 2 && m[0] === m[m.length - 1], x = Ra(), v = [];
      for (let Ee = 0; Ee < m.length - 1; Ee++) {
        const Ge = n[m[Ee]], De = n[m[Ee + 1]], ze = [De[0] - Ge[0], De[1] - Ge[1], De[2] - Ge[2]], Xe = Math.hypot(ze[0], ze[1], ze[2]) || 1, Ke = ze[0] / Xe, ft = ze[1] / Xe, gt = ze[2] / Xe, At = [x[1] * gt - x[2] * ft, x[2] * Ke - x[0] * gt, x[0] * ft - x[1] * Ke], tn = Math.hypot(At[0], At[1], At[2]) || 1;
        v.push({ a: Ge, b: De, n: [At[0] / tn, At[1] / tn, At[2] / tn] });
      }
      let V = 0, k = 1 / 0;
      v.forEach((Ee, Ge) => {
        const De = Hn(o[0], o[1], o[2], Ee.a[0], Ee.a[1], Ee.a[2], Ee.b[0], Ee.b[1], Ee.b[2]);
        De < k && (k = De, V = Ge);
      });
      const P = v[V], $ = Math.sign((o[0] - P.a[0]) * P.n[0] + (o[1] - P.a[1]) * P.n[1] + (o[2] - P.a[2]) * P.n[2]) || 1, T = Fn > 0 ? Fn : k;
      if (T < 1e-6) {
        ie("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const I = v.map((Ee) => ({ a: [Ee.a[0] + $ * T * Ee.n[0], Ee.a[1] + $ * T * Ee.n[1], Ee.a[2] + $ * T * Ee.n[2]], b: [Ee.b[0] + $ * T * Ee.n[0], Ee.b[1] + $ * T * Ee.n[1], Ee.b[2] + $ * T * Ee.n[2]] })), Y = I.length, ee = (Ee) => {
        const Ge = I[(Ee - 1 + Y) % Y], De = I[Ee % Y];
        return jo(Ge.a, Ge.b, De.a, De.b, true, true) ?? De.a;
      }, pe = [], be = u ? Y : Y + 1;
      for (let Ee = 0; Ee < be; Ee++) !u && Ee === 0 ? pe.push(I[0].a) : !u && Ee === Y ? pe.push(I[Y - 1].b) : pe.push(ee(Ee));
      bt();
      const Je = n.length;
      t.points.val = [...n, ...pe];
      const qe = pe.map((Ee, Ge) => Je + Ge);
      u && qe.push(Je);
      let je = s.slice();
      je.length && je[je.length - 1].length === 0 && (je = je.slice(0, -1)), t.polylines.val = [...je, qe, []], Rt = null, ie(`\u2713 Desfase a ${T.toFixed(2)} m \u2014 ${Y} tramo${Y === 1 ? "" : "s"} nuevo${Y === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      C(), Gt();
      return;
    }
    let c = ln, i = Math.max(0, vn);
    if (c < 0 || c === Rt.poly && i === Rt.seg) {
      let m = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (c = -1, s.forEach((u, x) => {
        for (let v = 0; v < u.length - 1; v++) {
          if (x === Rt.poly && v === Rt.seg) continue;
          const V = n[u[v]], k = n[u[v + 1]];
          if (!V || !k) continue;
          const P = Hn(o[0], o[1], o[2], V[0], V[1], V[2], k[0], k[1], k[2]);
          P < m && (m = P, c = x, i = v);
        }
      }), c < 0) {
        ie(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const r = s[Rt.poly], l = n[r[Rt.seg]], f = n[r[Rt.seg + 1]], d = s[c], w = d[i], p = d[i + 1];
    if (!l || !f || w == null || p == null) {
      ie(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const h = n[w], M = n[p];
    if (e === "trim") {
      const _ = jo(h, M, l, f, false, false);
      if (!_) {
        ie("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      bt();
      const m = n.length;
      t.points.val = [...n, _];
      const u = [...d.slice(0, i + 1), m, ...d.slice(i + 1)];
      t.polylines.val = s.map((v, V) => V === c ? u : v);
      const x = _n(o, h) < _n(o, M);
      ks(c, x ? i : i + 1), ie(`\u2713 Recortado en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const _ = jo(h, M, l, f, true, false);
      if (!_) {
        ie("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = _n(o, h) < _n(o, M) ? i : i + 1;
      if (u !== 0 && u !== d.length - 1) {
        ie("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = d[u];
      if (_n(_, h) + _n(_, M) < _n(h, M) + 1e-6) {
        ie("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (bt(), Da(x) > 1) {
        const V = n.length;
        t.points.val = [...n, _];
        const k = d.slice();
        k[u] = V, t.polylines.val = s.map((P, $) => $ === c ? k : P);
      } else t.points.val = n.map((V, k) => k === x ? _ : V);
      ie(`\u2713 Alargada hasta (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    C(), Gt();
  };
  window.__hekatanSelectionSize = () => Ue.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let o = e.length - 1;
    for (; o >= 0 && (!e[o] || e[o].length < 2); ) o--;
    return Ue.clear(), o >= 0 && Ue.add(`poly:${o}`), Ot(), ie(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ue.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    Ue.clear();
    const s = /* @__PURE__ */ new Set();
    return e.forEach((n, a) => {
      !n || n.length < 2 || (Ue.add(`poly:${a}`), n.forEach((c) => s.add(c)));
    }), o.forEach((n, a) => {
      s.has(a) || Ue.add(`pt:${a}`);
    }), Ot(), ie(`SELECCI\xD3N ${Ue.size} objetos (todo el modelo) \xB7 Esc suelta`), Ue.size;
  }, window.__hekatanReplicateSelection = (e, o, s, n, a = 0) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const c = [...Ue], i = t.points.rawVal, r = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), f = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), w = [];
    if (c.forEach((m) => {
      if (m.startsWith("pt:")) {
        const u = +m.slice(3);
        i[u] && f.add(u);
      } else if (m.startsWith("poly:")) {
        const u = +m.slice(5);
        if (!r[u] || r[u].length < 2) return;
        d.add(u), r[u].forEach((x) => f.add(x));
      } else if (m.startsWith("seg:")) {
        const u = m.split(":"), x = +u[1], v = +u[2], V = r[x] || [], k = V[v], P = V[v + 1];
        k != null && P != null && (w.push([k, P]), f.add(k), f.add(P));
      }
    }), !f.size) return 0;
    bt();
    const p = [...i];
    let h = r.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], _ = [...f];
    for (let m = 1; m <= n; m++) {
      const u = a + m, x = e * u, v = o * u, V = s * u, k = /* @__PURE__ */ new Map();
      _.forEach((P) => {
        k.set(P, p.length), p.push([i[P][0] + x, i[P][1] + v, i[P][2] + V]);
      }), d.forEach((P) => {
        const $ = r[P].map((I) => k.has(I) ? k.get(I) : I), T = h.length;
        h.push($), l.has(P) && M.push(T);
      }), w.forEach(([P, $]) => {
        h.push([k.get(P), k.get($)]);
      });
    }
    h.push([]), t.points.val = p, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), n;
  }, window.__hekatanExtrudeSelection = (e, o, s, n) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1));
    const a = [...Ue], c = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), l = /* @__PURE__ */ new Set(), f = [], d = /* @__PURE__ */ new Set();
    for (const x of i) for (const v of x) d.add(v);
    if (a.forEach((x) => {
      if (x.startsWith("poly:")) {
        const v = +x.slice(5);
        if (r.has(v)) return;
        const V = i[v] || [];
        for (let k = 0; k + 1 < V.length; k++) f.push([V[k], V[k + 1]]), d.add(V[k]), d.add(V[k + 1]);
      } else if (x.startsWith("seg:")) {
        const v = x.split(":"), V = +v[1], k = +v[2], P = i[V] || [], $ = P[k], T = P[k + 1];
        $ != null && T != null && (f.push([$, T]), d.add($), d.add(T));
      }
    }), a.forEach((x) => {
      if (x.startsWith("pt:")) {
        const v = +x.slice(3);
        c[v] && !d.has(v) && l.add(v);
      }
    }), !l.size && !f.length) return { lineas: 0, areas: 0 };
    bt();
    const w = [...c];
    let p = i.slice();
    p.length && p[p.length - 1].length === 0 && (p = p.slice(0, -1));
    const h = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], M = /* @__PURE__ */ new Map(), _ = (x, v) => {
      if (v === 0) return x;
      const V = x + ":" + v;
      let k = M.get(V);
      if (k == null) {
        const P = [c[x][0] + e * v, c[x][1] + o * v, c[x][2] + s * v];
        k = w.findIndex(($) => Math.abs($[0] - P[0]) < 1e-3 && Math.abs($[1] - P[1]) < 1e-3 && Math.abs($[2] - P[2]) < 1e-3), k < 0 && (k = w.length, w.push(P)), M.set(V, k);
      }
      return k;
    };
    let m = 0, u = 0;
    l.forEach((x) => {
      const v = [x];
      for (let V = 1; V <= n; V++) v.push(_(x, V));
      p.push(v), m += n;
    }), f.forEach(([x, v]) => {
      for (let V = 1; V <= n; V++) {
        const k = [_(x, V - 1), _(v, V - 1), _(v, V), _(x, V)];
        h.push(p.length), p.push([...k, k[0]]), u++;
      }
    }), p.push([]), t.points.val = w, t.polylines && (t.polylines.val = p), t.areas && (t.areas.val = h);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), { lineas: m, areas: u };
  }, window.__hekatanVoladoSelection = (e, o = {}) => {
    var _a3, _b, _c;
    const s = Number(e);
    if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
    const n = o.losa !== false, a = o.vigaBorde !== false, c = o.lados === "afuera" ? "afuera" : "ambos", i = t.points.rawVal, r = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = [];
    if ([...Ue].forEach((_) => {
      if (_.startsWith("seg:")) {
        const m = _.split(":"), u = +m[1], x = +m[2], v = r[u] || [], V = v[x], k = v[x + 1];
        V != null && k != null && l.push([V, k]);
      } else if (_.startsWith("poly:")) {
        const m = r[+_.slice(5)] || [];
        for (let u = 0; u + 1 < m.length; u++) l.push([m[u], m[u + 1]]);
      }
    }), !l.length) return 0;
    let f = 0, d = 0;
    for (const _ of i) f += _[0], d += _[1];
    f /= Math.max(1, i.length), d /= Math.max(1, i.length), bt();
    const w = [...i];
    let p = r.slice();
    p.length && p[p.length - 1].length === 0 && (p = p.slice(0, -1));
    const h = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let M = 0;
    for (const [_, m] of l) {
      const u = i[_], x = i[m];
      if (!u || !x) continue;
      const v = x[0] - u[0], V = x[1] - u[1], k = Math.hypot(v, V);
      if (k < 1e-6) continue;
      let P = -V / k, $ = v / k;
      const T = (u[0] + x[0]) / 2, I = (u[1] + x[1]) / 2;
      (T - f) * P + (I - d) * $ < 0 && (P = -P, $ = -$);
      const Y = c === "ambos" ? [1, -1] : [1];
      for (const ee of Y) {
        const pe = P * s * ee, be = $ * s * ee, Je = w.length;
        w.push([u[0] + pe, u[1] + be, u[2]]);
        const qe = w.length;
        w.push([x[0] + pe, x[1] + be, x[2]]), p.push([_, Je]), p.push([m, qe]), a && p.push([Je, qe]), n && (h.push(p.length), p.push([_, m, qe, Je, _])), M++;
      }
    }
    if (!M) return 0;
    p.push([]), t.points.val = w, t.polylines && (t.polylines.val = p), t.areas && (t.areas.val = h);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), M;
  }, F.addEventListener("click", (e) => {
    var _a3, _b;
    if (window.__hekatanCursorPx = { x: e.clientX, y: e.clientY }, Cn > 5) {
      Cn = 0;
      return;
    }
    Cn = 0;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    const s = !!(Lt && Math.abs(e.clientX - Lt.x) <= 3 && Math.abs(e.clientY - Lt.y) <= 3), n = s ? [{ point: Lt.p.clone(), distance: o.position.distanceTo(Lt.p) }] : ge();
    if (!n.length) return;
    if (!s) {
      const c = o.position.distanceTo(S.target) || 1, i = n[0].distance ?? o.position.distanceTo(n[0].point), r = n[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(c * 12, 300)) {
        ie("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let a = n[0].point;
    (e.ctrlKey || e.metaKey) && (a = new E(Math.round(n[0].point.x), Math.round(n[0].point.y), Math.round(n[0].point.z)));
    {
      const c = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = c[c.length - 1] ?? [], r = t.points.rawVal ?? [];
      if (i.length > 0) {
        const l = r[i[i.length - 1]];
        if (l) {
          const f = !!window.__hekatanOrthoMode;
          let d = kt;
          if (!d && f) {
            const w = Math.abs(a.x - l[0]), p = Math.abs(a.y - l[1]), h = Math.abs(a.z - l[2]);
            d = w >= p && w >= h ? "x" : p >= h ? "y" : "z";
          }
          d === "x" ? a = new E(a.x, l[1], l[2]) : d === "y" ? a = new E(l[0], a.y, l[2]) : d === "z" && (a = new E(l[0], l[1], a.z));
        }
      }
    }
    if (Lt && Math.abs(e.clientX - Lt.x) <= 3 && Math.abs(e.clientY - Lt.y) <= 3) a = Lt.p.clone();
    else if (co) a = co.clone(), ie(`\u{1F4D0} Eje \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
    else {
      const c = Zo(a), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, a.x, a.y, a.z, c, { x: e.clientX, y: e.clientY });
      if (i) a = new E(i.x, i.y, i.z), ie(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, l = window.__hekatanSnap2D ?? 0;
        r && l > 0 && (a = new E(Math.round(a.x / l) * l, Math.round(a.y / l) * l, Math.round(a.z / l) * l));
      }
    }
    Zs(a, e);
  });
  const Zs = (e, o) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (pn) {
        Wt && Mo();
        const { kind: i, a: r, b: l } = pn, f = l !== void 0 ? `${i}:${r}:${l}` : `${i}:${r}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ue.clear(), Ue.has(f) ? Ue.delete(f) : Ue.add(f), Ot(), ie(`\u2713 Seleccionados ${Ue.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), r = (o == null ? void 0 : o.clientX) ?? 0, l = (o == null ? void 0 : o.clientY) ?? 0;
        Wt ? (Vs(Wt.x, Wt.y, r, l, i), Wt = null) : i || (Wt = { x: r, y: l }, ie("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Ko(r, l, r + 1, l + 1, false));
      }
      return;
    }
    if (s === "axis") {
      const i = window.__hekatanAxisDraw;
      if (!i) return;
      if (!i.pendingStart) {
        i.pendingStart = [e.x, e.y, e.z], ie(`\u{1F4CD} Eje \u2014 click 1 OK en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const r = i.mode === "number", l = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, i.pendingStart, [e.x, e.y, e.z], r);
      ie(`\u2713 Eje "${l}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (s === "move" || s === "copy") {
      Us(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "delete") {
      if (Mn >= 0) {
        const i = window.__hekatanDrawingAuxLines, r = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], l = Mn;
        if (l >= 0 && l < r.length) {
          bt();
          const f = r.slice(0, l).concat(r.slice(l + 1));
          i && typeof i == "object" && "val" in i ? i.val = f : window.__hekatanDrawingAuxLines = f, ie(`\u{1F5D1} L\xEDnea auxiliar #${l + 1} borrada`), Mn = -1, Zt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (ln >= 0) {
        const i = ln, r = vn;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (mo(i), ie(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : r >= 0 ? (ks(i, r), ie(`\u{1F5D1} Segmento ${r + 1} de polil\xEDnea #${i + 1} borrado`)) : (mo(i), ie(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else ie("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ie("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, r] = Ze, l = Math.hypot(r[0] - i[0], r[1] - i[1], r[2] - i[2]), f = Math.abs(r[0] - i[0]), d = Math.abs(r[1] - i[1]), w = Math.abs(r[2] - i[2]), p = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), M = (p === "xy" ? w < 1e-3 : p === "xz" ? d < 1e-3 : p === "yz" ? f < 1e-3 : false) ? p : w < 1e-3 ? "xy" : d < 1e-3 ? "xz" : "yz", _ = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], l, _, M), ie(`\u2713 C\xEDrculo dibujado en ${M.toUpperCase()} \u2014 r=${l.toFixed(2)}m, ${_} segmentos`), Ze = [];
      try {
        (_l = window.__hekatanRebuild) == null ? void 0 : _l.call(window);
      } catch {
      }
      return;
    }
    if (s === "ifcface") {
      if (!Q) {
        ie("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!Q.plana) {
        ie("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const i = q(Q.m), r = Me(i, Q.tris);
      if (r.length < 3) {
        ie("\u25A6 No se pudo cerrar el contorno de la cara.");
        return;
      }
      const l = Q.normal.clone(), f = W(Q.m, Q.punto, l);
      let d = String(window.__hekatanIfcCaraPos ?? "auto"), w = false;
      try {
        const v = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        w = Math.round((v == null ? void 0 : v.matShell) ?? 0) === 1;
      } catch {
      }
      d === "auto" && (d = Math.abs(l.z) > 0.5 ? w ? "interior" : "exterior" : "media");
      const p = f ?? 0.2, h = d === "exterior" ? 0 : d === "interior" ? p : p / 2, M = r.map((v) => v.clone().addScaledVector(l, -h));
      bt(), et = M.map((v) => [v.x, v.y, v.z]);
      const _ = go();
      try {
        const v = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        v && f && (v.tShell = Math.round(f * 100) / 100);
      } catch {
      }
      const m = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let u = "la de \xABSecci\xF3n shells\xBB";
      try {
        const v = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        v && v.formaPlaca != null && (u = m[Math.round(v.formaPlaca)] ?? u);
      } catch {
      }
      const x = d === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : d === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + p.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (p / 2).toFixed(2) + " m hacia dentro)";
      ie(`\u25A6 \xC1rea desde la cara del IFC: ${r.length} v\xE9rtices, ${_} shell(s). Espesor medido ${f ? f.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${x}; formulaci\xF3n ${u}, t = ${p.toFixed(2)} m.`), ye(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      C();
      return;
    }
    if (s === "ifcline") {
      if (!le || le.length < 2) {
        ie("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = X(le);
      bt();
      const r = t.points.rawVal, l = [], f = [];
      for (const w of i) {
        let p = r.findIndex((h) => Math.abs(h[0] - w[0]) < 1e-3 && Math.abs(h[1] - w[1]) < 1e-3 && Math.abs(h[2] - w[2]) < 1e-3);
        p < 0 && (p = r.length + f.length, f.push(w)), l.push(p);
      }
      if (t.points.val = [...r, ...f], t.polylines) {
        const w = t.polylines.rawVal, p = w.length && w[w.length - 1].length === 0 ? w.slice(0, -1) : w;
        t.polylines.val = [...p, l, []];
      }
      const d = le.reduce((w, p, h) => h ? w + p.distanceTo(le[h - 1]) : 0, 0);
      ie(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${d.toFixed(2)} m de desarrollo.`), G(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      C();
      return;
    }
    if (s === "arc") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ie("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ze.length === 2) {
        ie("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [i, r, l] = Ze, f = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, r, l, f), ie(`\u2713 Arco dibujado \u2014 ${f} segmentos`), Ze = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (s === "parabola" || s === "cubica") {
      const i = s === "parabola" ? 3 : 4, r = s === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Ze.push([e.x, e.y, e.z]), Ze.length < i) {
        ie(`\u223F ${r} \u2014 punto ${Ze.length}/${i} OK. Marc\xE1 el ${Ze.length + 1}\xBA.`);
        return;
      }
      const l = window.__hekatanArcSegs ?? 12, f = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Ze.slice(), l);
      if (!(f == null ? void 0 : f.ok)) {
        ie(`\u26A0 ${r}: ${(f == null ? void 0 : f.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Ze = [];
        return;
      }
      const d = "xyz"[f.ia ?? 0], w = "xyz"[f.io ?? 2], p = (f.coef ?? []).map((h, M) => `${h >= 0 && M ? "+" : ""}${h.toFixed(3)}${M ? "\xB7" + d + (M > 1 ? "^" + M : "") : ""}`).join(" ");
      ie(`\u2713 ${r} dibujada en ${String(f.plano ?? "").toUpperCase()} \u2014 ${l} tramos a \u0394 igual de ${d} \xB7 ${w} = ${p}`), Ze = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (s === "revolve") {
      const i = Math.round(window.__hekatanRevSectores ?? 16), r = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, e.x, e.y, i, 360);
      if (r == null ? void 0 : r.msg) {
        ie(`\u26A0 Revoluci\xF3n: ${r.msg}.`);
        return;
      }
      ie(`\u2713 Revoluci\xF3n: ${r.anillos} anillo(s) \xD7 ${i} sectores \u2192 ${r.areas} pa\xF1o(s) Q4${r.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${r.guias ? ` ${r.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (s === "loft") {
      const i = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, e.x, e.y);
      if (i == null ? void 0 : i.msg) {
        ie(`\u26A0 Barrido: ${i.msg}.`);
        return;
      }
      ie(`\u2713 Barrido: contorno de ${i.contorno} lados \xD7 perfil de ${i.perfil} puntos \u2192 ${i.areas} pa\xF1o(s) Q4. Eje por (${e.x.toFixed(2)}, ${e.y.toFixed(2)}).${i.guias ? ` ${i.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
      } catch {
      }
      return;
    }
    if (s === "rect") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ie("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, r] = Ze;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, r), ie(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${r[0].toFixed(1)},${r[1].toFixed(1)})`), Ze = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (s === "medir") {
      const r = (Lt && Math.abs(Lt.x - o.clientX) < 3 && Math.abs(Lt.y - o.clientY) < 3 ? [Lt.p.x, Lt.p.y, Lt.p.z] : null) ?? st(o);
      if (!r) return;
      if (xt.length >= 2 && (xt = []), xt.push(r), xt.length === 1) at.visible = false, Ct(), ie("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [l, f] = xt;
        at.geometry.setFromPoints([new E(l[0], l[1], l[2]), new E(f[0], f[1], f[2])]), at.visible = true;
        const d = Math.hypot(f[0] - l[0], f[1] - l[1], f[2] - l[2]), w = Math.hypot(f[0] - l[0], f[1] - l[1]);
        He.textContent = `${d.toFixed(3)} m`, Ct(), ie(`\u{1F4CF} Distancia ${d.toFixed(3)} m  \xB7  \u0394x ${(f[0] - l[0]).toFixed(3)}  \u0394y ${(f[1] - l[1]).toFixed(3)}  \u0394z ${(f[2] - l[2]).toFixed(3)}  \xB7  en planta ${w.toFixed(3)} m`);
      }
      C();
      return;
    }
    if (s === "fillarea") {
      const i = t.points.rawVal, r = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], l = /* @__PURE__ */ new Map(), f = (T, I) => {
        T !== I && ((l.get(T) ?? l.set(T, /* @__PURE__ */ new Set()).get(T)).add(I), (l.get(I) ?? l.set(I, /* @__PURE__ */ new Set()).get(I)).add(T));
      };
      for (const T of r) for (let I = 0; I + 1 < T.length; I++) f(T[I], T[I + 1]);
      const d = (T, I) => {
        var _a4;
        return !!((_a4 = l.get(T)) == null ? void 0 : _a4.has(I));
      }, w = /* @__PURE__ */ new Set(), p = [], h = [...l.keys()];
      for (const T of h) for (const I of l.get(T)) if (!(I < T)) {
        for (const Y of l.get(I)) if (Y !== T) for (const ee of l.get(Y)) {
          if (ee === T || ee === I || !d(ee, T) || d(T, Y) || d(I, ee)) continue;
          const pe = [T, I, Y, ee].slice().sort((be, Je) => be - Je).join("-");
          w.has(pe) || (w.add(pe), p.push([T, I, Y, ee]));
        }
      }
      for (const T of h) for (const I of l.get(T)) if (!(I < T)) for (const Y of l.get(I)) {
        if (Y === T || !d(Y, T)) continue;
        const ee = [T, I, Y].slice().sort((pe, be) => pe - be).join("-");
        w.has(ee) || (w.add(ee), p.push([T, I, Y]));
      }
      const M = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", _ = (T) => M === "xy" ? [T[0], T[1]] : M === "xz" ? [T[0], T[2]] : [T[1], T[2]], m = _([e.x, e.y, e.z]), u = (T, I) => {
        let Y = false;
        for (let ee = 0, pe = I.length - 1; ee < I.length; pe = ee++) {
          const be = I[ee][0], Je = I[ee][1], qe = I[pe][0], je = I[pe][1];
          Je > T[1] != je > T[1] && T[0] < (qe - be) * (T[1] - Je) / (je - Je) + be && (Y = !Y);
        }
        return Y;
      }, x = (T) => {
        let I = 0;
        for (let Y = 0, ee = T.length - 1; Y < T.length; ee = Y++) I += (T[ee][0] + T[Y][0]) * (T[ee][1] - T[Y][1]);
        return Math.abs(I) / 2;
      };
      let v = null, V = 1 / 0;
      for (const T of p) {
        const I = T.map((ee) => _(i[ee]));
        if (!u(m, I)) continue;
        const Y = x(I);
        Y < V && (V = Y, v = T);
      }
      if (!v) {
        ie("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const k = v.slice().sort((T, I) => T - I).join("-"), P = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (P.some((T) => {
        const I = r[T] ?? [];
        return [...new Set(I)].sort((Y, ee) => Y - ee).join("-") === k;
      })) {
        ie("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...r, [...v, v[0]]], t.areas.val = [...P, r.length], ie(`\u2713 \xC1rea creada por relleno (${v.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ie("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, r] = Ze;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, r), ie(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${r[0].toFixed(1)},${r[1].toFixed(1)})`), Ze = [];
      return;
    }
    if (s === "polyarea") {
      et.push([e.x, e.y, e.z]), $e.geometry.setFromPoints(et.map((i) => new E(i[0], i[1], i[2]))), $e.visible = et.length >= 1, ie(`\u25B0 \xC1rea libre \u2014 ${et.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), C();
      return;
    }
    if (s === "plane3") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length < 3) {
        ie(`\u25E3 Plano inclinado \u2014 punto ${Ze.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [i, r, l] = Ze, f = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, r, l);
      ie(f ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ze = [];
      return;
    }
    if (s === "col") {
      bt();
      const i = e.z, r = St && St > 0 ? St : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + r]];
      const l = t.polylines.rawVal, f = t.points.rawVal.length;
      t.polylines.val = [...l.slice(0, -1), ...l[l.length - 1].length > 0 ? [l[l.length - 1]] : [], [f - 2, f - 1], []], St = 0, ie(`\u258C Columna creada \u2014 h=${r.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ie("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [i, r] = Ze, l = St && St > 0 ? St : 3;
      bt();
      const f = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [r[0], r[1], r[2]], [r[0], r[1], r[2] + l], [i[0], i[1], i[2] + l]];
      const d = t.polylines.rawVal;
      if (d.length - 1, t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [f, f + 1, f + 2, f + 3, f], []], t.areas) {
        const w = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, w];
      }
      ie(`\u25A5 Pared Q4 creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ze = [], St = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      bt();
      const i = St && St > 0 ? St : 3, r = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, r], [e.x, e.y, r + i]];
      const l = t.polylines.rawVal, f = t.points.rawVal.length;
      t.polylines.val = [...l.slice(0, -1), ...l[l.length - 1].length > 0 ? [l[l.length - 1]] : [], [f - 2, f - 1], []], St = 0, ie(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (s === "extl") {
      const i = (window.__hekatanSnap2D ?? 0.5) * 1.5, r = No(e.x, e.y, e.z, i);
      if (!r) {
        ie("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const l = t.polylines.rawVal, f = t.points.rawVal, d = l[r.polyIdx], w = f[d[r.segIdx]], p = f[d[r.segIdx + 1]];
      if (!w || !p) {
        ie("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const h = St && St > 0 ? St : 3;
      bt();
      const M = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [w[0], w[1], w[2]], [p[0], p[1], p[2]], [p[0], p[1], p[2] + h], [w[0], w[1], w[2] + h]];
      const _ = t.polylines.rawVal;
      if (t.polylines.val = [..._.slice(0, -1), ..._[_.length - 1].length > 0 ? [_[_.length - 1]] : [], [M, M + 1, M + 2, M + 3, M], []], t.areas) {
        const m = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, m];
      }
      St = 0, ie(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${h.toFixed(2)}m`);
      try {
        (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
      } catch {
      }
      return;
    }
    if (s === "auxp") {
      const i = window.__hekatanDrawingAuxPoints;
      if (i) {
        const r = i.rawVal ?? i.val ?? [];
        i.val = [...r, [e.x, e.y, e.z]];
      }
      ie(`\u2726 Punto auxiliar agregado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
      return;
    }
    if (s === "aux") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ie("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, r] = Ze, l = window.__hekatanDrawingAuxLines;
      if (l) {
        bt();
        const h = l.rawVal ?? l.val ?? [];
        l.val = [...h, [i[0], i[1], i[2], r[0], r[1], r[2]]];
      }
      const f = r[0] - i[0], d = r[1] - i[1], w = r[2] - i[2], p = Math.sqrt(f * f + d * d + w * w);
      ie(`\u2713 L\xEDnea auxiliar creada \u2014 L=${p.toFixed(2)}m (cyan, no FEM)`), Ze = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Na(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "chaflan") {
      if (Ze.push([e.x, e.y, e.z]), Ze.length === 1) {
        ie("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, r] = Ze, l = window.__hekatanChaflanR ?? 1, f = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, r, l, f, 6);
      const d = Math.abs(r[0] - i[0]).toFixed(1), w = Math.abs(r[1] - i[1]).toFixed(1);
      ie(`\u2713 Losa con chaflanes dibujada \u2014 ${d}\xD7${w}m, r=${l}m, ${f} seg/chafl\xE1n`), Ze = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    Qe = false, bt();
    const n = e.toArray(), a = t.points.rawVal;
    let c = a.findIndex((i) => Math.abs(i[0] - n[0]) < 1e-3 && Math.abs(i[1] - n[1]) < 1e-3 && Math.abs(i[2] - n[2]) < 1e-3);
    if (c < 0 && (t.points.val = [...a, n], c = t.points.rawVal.length - 1), t.polylines && s !== "node") {
      const i = t.polylines.rawVal, r = i.length ? i[i.length - 1] : [], l = r[r.length - 1] === c ? r : [...r, c];
      t.polylines.val = [...i.slice(0, -1), l];
    }
    if (t.polylines) {
      const i = t.polylines.rawVal, r = i.length - 1, l = i[r] ?? [];
      if (s === "line" && l.length >= 2) {
        ie(`\uFF0F L\xEDnea \u2014 ${l.length - 1} tramo${l.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
        } catch {
        }
        return;
      }
      if (s === "area" && l.length === 4) {
        t.polylines.val = [...i.slice(0, -1), [...l, l[0]], []], t.areas && (t.areas.val = [...t.areas.rawVal, r]), ie("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
        } catch {
        }
        return;
      }
    }
    if (s === "node") ie(`\u25CF Nodo creado en (${e.x.toFixed(2)}, ${e.y.toFixed(2)}, ${e.z.toFixed(2)})`);
    else if (s === "line") ie("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (s === "polyline") ie("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (s === "area") {
      const i = ((_R = t.polylines) == null ? void 0 : _R.rawVal[t.polylines.rawVal.length - 1]) ?? [];
      ie(`\u25A6 \xC1rea \u2014 click ${i.length}/4. Marc\xE1 ${4 - i.length} v\xE9rtice${4 - i.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  F.addEventListener("click", () => Gt()), F.addEventListener("contextmenu", (e) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && et.length >= 3) {
      e.preventDefault();
      const s = go();
      ie(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), F.addEventListener("pointermove", (e) => {
    var _a3, _b;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    const s = ge();
    if (Ne.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (e.ctrlKey || e.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = i[i.length - 1] ?? [], l = t.points.rawVal ?? [];
        if (r.length > 0) {
          const f = l[r[r.length - 1]];
          if (f) {
            const d = !!window.__hekatanOrthoMode;
            let w = kt;
            if (!w && d) {
              const p = Math.abs(n.x - f[0]), h = Math.abs(n.y - f[1]), M = Math.abs(n.z - f[2]);
              w = p >= h && p >= M ? "x" : h >= M ? "y" : "z";
            }
            w === "x" ? n.set(n.x, f[1], f[2]) : w === "y" ? n.set(f[0], n.y, f[2]) : w === "z" && n.set(f[0], f[1], n.z);
          }
        }
      }
      const a = Zo(n), c = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: e.clientX, y: e.clientY });
      if (c) n.set(c.x, c.y, c.z);
      else {
        const i = window.__hekatanSnapEnabled !== false, r = window.__hekatanSnap2D ?? 0.5;
        i && r > 0 && (n.x = Math.round(n.x / r) * r, n.y = Math.round(n.y / r) * r, n.z = Math.round(n.z / r) * r);
      }
      Ne.geometry.setAttribute("position", new Vt(n.toArray(), 3));
    }
    C();
  }), F.addEventListener("pointermove", (e) => {
    var _a3;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    let s = false;
    const n = L.intersectObject(Le), a = ge();
    if (n.length && a.length) {
      const c = new E(...t.points.rawVal[n[0].index]), i = new E(...a[0].point), r = c.sub(i), l = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      l.transformDirection(te.matrixWorld), Math.abs(r.dot(l)) < 1e-4 && (s = true);
    }
    Ne.visible = !s;
  });
  let es = false, ts;
  F.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Cn) return;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    let s = false;
    const n = L.intersectObject(Le), a = ge();
    if (n.length && a.length) {
      const i = new E(...t.points.rawVal[n[0].index]), r = new E(...a[0].point), l = i.sub(r), f = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      f.transformDirection(te.matrixWorld), Math.abs(l.dot(f)) < 1e-4 && (s = true);
    }
    if (s && Cn < 5 && (es = true, S.enabled = false, ts = n[0].index), !es || Cn % 2 !== 0) return;
    const c = [...t.points.rawVal];
    if (ts !== void 0) {
      let i = a[0].point;
      (e.ctrlKey || e.metaKey) && (i = new E(Math.round(i.x), Math.round(i.y), Math.round(i.z))), c[ts] = i.toArray();
    }
    t.points.val = c;
  }), F.addEventListener("pointerup", () => {
    S.enabled = true, es = false;
  }), F.addEventListener("contextmenu", (e) => {
    var _a3;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    let s = false;
    const n = L.intersectObject(Le), a = ge();
    if (n.length && a.length) {
      const r = new E(...t.points.rawVal[n[0].index]), l = new E(...a[0].point), f = r.sub(l), d = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      d.transformDirection(te.matrixWorld), Math.abs(f.dot(d)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const c = [...t.points.rawVal];
    if (c.splice(n[0].index, 1), t.points.val = c, !t.polylines) return;
    const i = t.polylines.rawVal.map((r) => r.filter((l) => l !== n[0].index)).map((r) => r.map((l) => l > n[0].index ? l - 1 : l)).filter((r) => r.length);
    i.push([]), t.polylines.val = i;
  });
}
function Vi(t, y, g) {
  const z = Math.round(14.999999999999998), A = { position: t.position.clone(), quaternion: t.quaternion.clone() }, F = setInterval(L, 1e3 / 30);
  let C = 0;
  function L() {
    C++;
    const N = C / z;
    t.position.lerpVectors(A.position, y.position, N), t.quaternion.slerpQuaternions(A.quaternion, y.quaternion, N), g && g(), C == z && clearInterval(F);
  }
}
function $i(t, y, g, b) {
  const S = di(g, t.elements, b);
  return re.derive(() => {
    S.visible = y.shellResults.val != "none";
  }), S;
}
const Ii = 6, fs = 10, Li = 0.012;
function Ti(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function Ri(t, y, g, b) {
  if (!g && !b) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && g) {
    const z = g[t];
    if (z && z.has(y)) return z.get(y);
  }
  return null;
}
function Di(t, y, g, b) {
  const S = new ct(), z = new pa();
  z.setColorMap("rainbow");
  const A = new nn(), F = re.state([]);
  return re.derive(() => {
    var _a, _b, _c;
    y.deformedShape.val;
    const C = g.val, L = ((_a = t.elements) == null ? void 0 : _a.val) ?? [], N = Ti(y.frameResults.val);
    if (S.children.forEach((R) => {
      R.geometry && R.geometry.dispose(), R.material && R.material.dispose();
    }), S.clear(), !N || L.length === 0 || C.length === 0) {
      F.val = [];
      return;
    }
    const B = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, te = (_c = t.deformOutputs) == null ? void 0 : _c.val, fe = [], we = [];
    for (let R = 0; R < L.length; R++) {
      if (L[R].length !== 2) continue;
      const he = Ri(N, R, B, te);
      he && (fe.push(he[0], he[1]), we.push({ idx: R, vals: he }));
    }
    if (fe.length === 0) {
      F.val = [];
      return;
    }
    const O = Math.min(...fe), U = Math.max(...fe);
    z.setMin(O), z.setMax(U), F.val = fe;
    const ce = [1 / 0, 1 / 0, 1 / 0], Z = [-1 / 0, -1 / 0, -1 / 0];
    for (const R of C) for (let Q = 0; Q < 3; Q++) ce[Q] = Math.min(ce[Q], R[Q]), Z[Q] = Math.max(Z[Q], R[Q]);
    const se = Math.max(Z[0] - ce[0], Z[1] - ce[1], Z[2] - ce[2], 1) * Li, oe = [], J = [], H = [];
    let G = 0;
    for (const { idx: R, vals: Q } of we) {
      const he = L[R], ye = C[he[0]], Me = C[he[1]];
      if (!ye || !Me) continue;
      const W = new E(Me[0] - ye[0], Me[1] - ye[1], Me[2] - ye[2]), _e = W.length();
      if (_e < 1e-10) continue;
      W.normalize();
      const de = Math.abs(W.y) < 0.99 ? new E(0, 1, 0) : new E(1, 0, 0), Fe = new E().crossVectors(W, de).normalize(), me = new E().crossVectors(W, Fe).normalize(), Ve = fs + 1, ve = Ii;
      for (let We = 0; We < Ve; We++) {
        const Oe = We / fs, vt = ye[0] + W.x * _e * Oe, Mt = ye[1] + W.y * _e * Oe, xe = ye[2] + W.z * _e * Oe, D = Q[0] + (Q[1] - Q[0]) * Oe, ne = z.getColor(D) ?? new nn(0, 0, 0);
        A.copy(ne).convertSRGBToLinear();
        for (let j = 0; j < ve; j++) {
          const ae = j / ve * Math.PI * 2, Ce = Math.cos(ae), Se = Math.sin(ae);
          oe.push(vt + (Fe.x * Ce + me.x * Se) * se, Mt + (Fe.y * Ce + me.y * Se) * se, xe + (Fe.z * Ce + me.z * Se) * se), J.push(A.r, A.g, A.b);
        }
      }
      for (let We = 0; We < fs; We++) for (let Oe = 0; Oe < ve; Oe++) {
        const vt = (Oe + 1) % ve, Mt = G + We * ve + Oe, xe = G + We * ve + vt, D = G + (We + 1) * ve + Oe, ne = G + (We + 1) * ve + vt;
        H.push(Mt, xe, ne), H.push(Mt, ne, D);
      }
      G += Ve * ve;
    }
    if (oe.length === 0) return;
    const X = new Ae();
    X.setAttribute("position", new Vt(oe, 3)), X.setAttribute("color", new Vt(J, 3)), X.setIndex(H), X.computeVertexNormals();
    const K = new pt({ vertexColors: true, side: Et }), q = new it(X, K);
    q.frustumCulled = false, S.add(q);
  }), S.__colorMapValues = F, S;
}
function Bi() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ni = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Xi = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Yi = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Pt(t, y = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(y) : t.toFixed(y);
}
const Ui = 16755200, aa = 56831, Zi = 56831, qi = 56831, Vo = 65382;
function Ki(t) {
  const y = new ct();
  y.name = "__hekatan_hover", y.renderOrder = 99;
  const g = new Wn(1, 16, 16), b = new pt({ color: Ui, transparent: true, opacity: 0.85, depthTest: false }), S = new it(g, b);
  S.visible = false, S.renderOrder = 100, y.add(S);
  const z = new Ae(), A = new dt({ color: aa, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), F = new Jt(z, A);
  F.visible = false, F.renderOrder = 100, y.add(F);
  const C = new pt({ color: aa, transparent: true, opacity: 0.7, depthTest: false }), L = new it(new ta(1, 1, 1, 12), C);
  L.visible = false, L.renderOrder = 100, y.add(L);
  const N = new Ae(), B = new pt({ color: Zi, transparent: true, opacity: 0.45, side: Et, depthTest: false }), te = new it(N, B);
  te.visible = false, te.renderOrder = 100, y.add(te);
  const fe = new Ae(), we = new dt({ color: qi, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), O = new Jt(fe, we);
  O.visible = false, O.renderOrder = 100, y.add(O);
  const U = new pt({ color: Vo, transparent: true, opacity: 0.95, depthTest: false }), ce = new pt({ color: Vo, transparent: true, opacity: 0.85, depthTest: false }), Z = new ta(1, 1, 1, 12), le = new pt({ color: Vo, transparent: true, opacity: 0.55, side: Et, depthTest: false }), se = new dt({ color: Vo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), oe = [];
  window.__hekatanModelSelection = oe;
  const J = new ct();
  J.renderOrder = 101, y.add(J);
  const H = document.createElement("div");
  Object.assign(H.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), H.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(H);
  }, 0);
  function G(xe) {
    const D = t.derivedNodes.rawVal;
    return !D || xe < 0 || xe >= D.length ? null : new E(D[xe][0], D[xe][1], D[xe][2]);
  }
  function X(xe, D) {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    const ne = t.getActiveCamera();
    if (!ne || !t.mesh) return null;
    const j = t.rendererElm.getBoundingClientRect(), ae = xe - j.left, Ce = D - j.top, Se = t.derivedNodes.rawVal, ge = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (!Se || !ge) return null;
    const Le = /* @__PURE__ */ new Map(), Ne = (ot) => {
      if (Le.has(ot)) return Le.get(ot);
      const Ie = G(ot);
      if (!Ie) return Le.set(ot, null), null;
      const Re = Ie.clone().project(ne), Ye = (Re.x * 0.5 + 0.5) * j.width, $e = (-Re.y * 0.5 + 0.5) * j.height, et = { x: Ye, y: $e, z: Re.z };
      return Le.set(ot, et), et;
    }, tt = /* @__PURE__ */ new Set();
    for (const ot of ge) if (ot) for (const Ie of ot) tt.add(Ie);
    const Pe = 8;
    let Te = -1, lt = Pe;
    for (let ot = 0; ot < Se.length; ot++) {
      if (!tt.has(ot)) continue;
      const Ie = Ne(ot);
      if (!Ie || Ie.z < -1 || Ie.z > 1) continue;
      const Re = Ie.x - ae, Ye = Ie.y - Ce, $e = Math.sqrt(Re * Re + Ye * Ye);
      $e < lt && (lt = $e, Te = ot);
    }
    const Qe = Bi(), ke = Xi[Qe.dispUnit] ?? 1e3, Be = Ni[Qe.forceUnit] ?? 1;
    if (Te >= 0) {
      const ot = Se[Te];
      let Ie = `Nodo ${Te}
(${ot[0].toFixed(3)}, ${ot[1].toFixed(3)}, ${ot[2].toFixed(3)})`;
      const Re = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Re == null ? void 0 : Re.deformations) {
        const Ye = Re.deformations.get(Te);
        if (Ye && (Ie += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ie += `
Ux = ${Pt(Ye[0] * ke, 3)} ${Qe.dispUnit}`, Ie += `
Uy = ${Pt(Ye[1] * ke, 3)} ${Qe.dispUnit}`, Ie += `
Uz = ${Pt(Ye[2] * ke, 3)} ${Qe.dispUnit}`, (Math.abs(Ye[3]) > 1e-9 || Math.abs(Ye[4]) > 1e-9 || Math.abs(Ye[5]) > 1e-9) && (Ie += `
Rx = ${Pt(Ye[3] * 1e3, 3)} mrad`, Ie += `
Ry = ${Pt(Ye[4] * 1e3, 3)} mrad`, Ie += `
Rz = ${Pt(Ye[5] * 1e3, 3)} mrad`)), Re.reactions) {
          const $e = Re.reactions.get(Te);
          $e && (Math.abs($e[0]) > 1e-9 || Math.abs($e[1]) > 1e-9 || Math.abs($e[2]) > 1e-9 || Math.abs($e[3]) > 1e-6 || Math.abs($e[4]) > 1e-6 || Math.abs($e[5]) > 1e-6) && (Ie += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ie += `
Fx = ${Pt($e[0] * Be)} ${Qe.forceUnit}`, Ie += `
Fy = ${Pt($e[1] * Be)} ${Qe.forceUnit}`, Ie += `
Fz = ${Pt($e[2] * Be)} ${Qe.forceUnit}`, (Math.abs($e[3]) > 1e-6 || Math.abs($e[4]) > 1e-6 || Math.abs($e[5]) > 1e-6) && (Ie += `
Mx = ${Pt($e[3] * Be)} ${Qe.forceUnit}\xB7m`, Ie += `
My = ${Pt($e[4] * Be)} ${Qe.forceUnit}\xB7m`, Ie += `
Mz = ${Pt($e[5] * Be)} ${Qe.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Te, info: Ie };
    }
    const mt = 5;
    let nt = -1, _t = mt, Dt = "frame";
    for (let ot = 0; ot < ge.length; ot++) {
      const Ie = ge[ot];
      if (!(!Ie || Ie.length < 2)) {
        if (Ie.length === 2) {
          const Re = Ne(Ie[0]), Ye = Ne(Ie[1]);
          if (!Re || !Ye || Re.z < -1 || Re.z > 1 || Ye.z < -1 || Ye.z > 1) continue;
          const $e = Wi(ae, Ce, Re.x, Re.y, Ye.x, Ye.y);
          $e < _t && (_t = $e, nt = ot, Dt = "frame");
        } else if (Ie.length === 3 || Ie.length === 4) {
          const Re = [];
          let Ye = true;
          for (const $e of Ie) {
            const et = Ne($e);
            if (!et || et.z < -1 || et.z > 1) {
              Ye = false;
              break;
            }
            Re.push(et);
          }
          if (!Ye) continue;
          if (Gi(ae, Ce, Re)) {
            const et = Re.reduce((at, xt) => at + xt.z, 0) / Re.length * 1e-3;
            et < _t && (_t = et, nt = ot, Dt = "shell");
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
          const $e = Math.min(...Re.map((He) => He.x)), et = Math.max(...Re.map((He) => He.x)), at = Math.min(...Re.map((He) => He.y)), xt = Math.max(...Re.map((He) => He.y));
          if (ae >= $e && ae <= et && Ce >= at && Ce <= xt) {
            const st = Re.reduce((Ct, rt) => Ct + rt.z, 0) / Re.length * 1e-3;
            st < _t && (_t = st, nt = ot, Dt = "solid");
          }
        }
      }
    }
    if (nt >= 0) {
      const ot = ge[nt];
      let Re = `${Dt === "frame" ? "Frame" : Dt === "shell" ? "Shell" : "Solid"} ${nt}`;
      const Ye = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, $e = (_g = (_f = Ye == null ? void 0 : Ye.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, nt);
      if ($e) {
        $e.name && (Re += `
  \u{1F4CB} ${$e.name}`), $e.shape && (Re += `
  Shape: ${$e.shape}`);
        const et = /concrete|hormig|rect.*sólida/i.test($e.shape || ""), at = et ? 100 : 1e3, xt = et ? "cm" : "mm", He = (Ct) => {
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
        const et = (_i2 = (_h = Ye == null ? void 0 : Ye.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, nt), at = (_k = (_j = Ye == null ? void 0 : Ye.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, nt);
        et ? (Re += `
  ${et}`, at && !et.includes(at) && (Re += `  (${at})`)) : at && (Re += `
  Material: ${at}`);
      }
      if (Re += `
nodos: [${ot.join(", ")}]`, Dt === "shell" && ((_l = t.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const et = t.mesh.analyzeOutputs.rawVal, at = Yi[Qe.stressUnit] ?? 1, xt = [["bendingXX", "Mxx", Be, `${Qe.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Be, `${Qe.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Be, `${Qe.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Be, `${Qe.forceUnit}/m`], ["membraneYY", "Nyy", Be, `${Qe.forceUnit}/m`], ["membraneXY", "Nxy", Be, `${Qe.forceUnit}/m`], ["shearX", "Qx", Be, `${Qe.forceUnit}/m`], ["shearY", "Qy", Be, `${Qe.forceUnit}/m`], ["vonMises", "\u03C3VM", at, Qe.stressUnit], ["pressure", "p", at, Qe.stressUnit]], He = [];
        for (const [st, Ct, rt, on] of xt) {
          const Bt = et == null ? void 0 : et[st];
          if (Bt && Bt instanceof Map) {
            const Kt = Bt.get(nt);
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
      if (Dt === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
        const et = t.mesh.deformOutputs.rawVal, at = t.mesh.elementInputs.rawVal, xt = et == null ? void 0 : et.deformations;
        if (xt && ot.length === 2) {
          const He = xt.get(ot[0]), st = xt.get(ot[1]), Ct = Se[ot[0]], rt = Se[ot[1]];
          if (He && st && Ct && rt) {
            const on = rt[0] - Ct[0], Bt = rt[1] - Ct[1], Kt = rt[2] - Ct[2], It = Math.sqrt(on * on + Bt * Bt + Kt * Kt);
            if (It > 1e-9) {
              const rn = on / It, ro = Bt / It, Xt = Kt / It, gn = (st[0] - He[0]) * rn + (st[1] - He[1]) * ro + (st[2] - He[2]) * Xt, mn = ((_n = at.elasticities) == null ? void 0 : _n.get(nt)) ?? 0, In = ((_o = at.areas) == null ? void 0 : _o.get(nt)) ?? 0, Ln = ((_p = at.momentsOfInertiaY) == null ? void 0 : _p.get(nt)) ?? 0, Gn = ((_q = at.momentsOfInertiaZ) == null ? void 0 : _q.get(nt)) ?? 0, Bo = ((_r = at.torsionalConstants) == null ? void 0 : _r.get(nt)) ?? 0, Yt = ((_s = at.shearModuli) == null ? void 0 : _s.get(nt)) ?? mn / 2.6, Tn = mn * In * (gn / It), Rn = (st[3] - He[3]) * rn + (st[4] - He[4]) * ro + (st[5] - He[5]) * Xt, Pn = Yt * Bo * (Rn / It), Dn = st[4] - He[4], cn = st[5] - He[5], Bn = mn * Ln * Dn / It, Ut = mn * Gn * cn / It;
              Re += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Re += `
L = ${Pt(It, 3)} m`, Re += `
\u0394L = ${Pt(gn * ke, 3)} ${Qe.dispUnit}`, Re += `
\u03B5 = ${Pt(gn / It, 6)}`, Math.abs(Tn) > 1e-6 && (Re += `
N \u2248 ${Pt(Tn * Be)} ${Qe.forceUnit}`), Math.abs(Pn) > 1e-6 && (Re += `
T \u2248 ${Pt(Pn * Be)} ${Qe.forceUnit}\xB7m`), Math.abs(Bn) > 1e-6 && (Re += `
My \u2248 ${Pt(Bn * Be)} ${Qe.forceUnit}\xB7m`), Math.abs(Ut) > 1e-6 && (Re += `
Mz \u2248 ${Pt(Ut * Be)} ${Qe.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Dt, idx: nt, info: Re };
    }
    return null;
  }
  function K(xe, D, ne) {
    var _a, _b, _c;
    if (S.visible = false, F.visible = false, L.visible = false, te.visible = false, O.visible = false, !xe || !t.mesh) {
      H.style.display = "none", t.render();
      return;
    }
    const j = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (xe.type === "node") {
      const ge = G(xe.idx);
      if (ge) {
        const Le = t.derivedNodes.rawVal ?? [];
        let Ne = 1;
        if (Le.length >= 2) {
          let Te = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Qe of Le) for (let ke = 0; ke < 3; ke++) Qe[ke] < Te[ke] && (Te[ke] = Qe[ke]), Qe[ke] > lt[ke] && (lt[ke] = Qe[ke]);
          Ne = Math.max(lt[0] - Te[0], lt[1] - Te[1], lt[2] - Te[2], 0.1);
        }
        const tt = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Pe = 0.021 * Ne * tt;
        S.position.copy(ge), S.scale.setScalar(Pe), S.visible = true;
      }
    } else if (xe.type === "frame" && j) {
      const ge = j[xe.idx], Le = G(ge[0]), Ne = G(ge[1]);
      if (Le && Ne) {
        const tt = Le.clone().add(Ne).multiplyScalar(0.5), Pe = Ne.clone().sub(Le), Te = Pe.length(), ke = t.getActiveCamera().position.distanceTo(tt) * 35e-4;
        L.position.copy(tt);
        const Be = new E(0, 1, 0), mt = Be.clone().cross(Pe).normalize(), nt = Be.angleTo(Pe);
        L.quaternion.setFromAxisAngle(mt, nt), L.scale.set(ke, Te, ke), L.visible = true;
      }
    } else if (xe.type === "shell" && j) {
      const ge = j[xe.idx], Le = [], Ne = [];
      for (const tt of ge) {
        const Pe = G(tt);
        if (!Pe) return;
        Le.push(Pe.x, Pe.y, Pe.z);
      }
      ge.length === 4 ? Ne.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && Ne.push(0, 1, 2), N.setAttribute("position", new Vt(Le, 3)), N.setIndex(Ne), N.computeVertexNormals(), te.visible = true;
    } else if (xe.type === "solid" && j) {
      const ge = j[xe.idx], Le = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ne = [];
      for (const [tt, Pe] of Le) {
        const Te = G(ge[tt]), lt = G(ge[Pe]);
        Te && lt && Ne.push(Te.x, Te.y, Te.z, lt.x, lt.y, lt.z);
      }
      fe.setAttribute("position", new Vt(Ne, 3)), O.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      H.style.display = "none", t.render();
      return;
    }
    H.textContent = xe.info, H.style.whiteSpace = "pre-line", H.style.display = "block";
    const Ce = t.rendererElm.getBoundingClientRect(), Se = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Ce;
    H.style.left = `${D - Se.left}px`, H.style.top = `${ne - Se.top}px`, t.render();
  }
  let q = "", R = 0, Q = 0;
  const he = window.__hekatanHoverDebug ?? false, ye = (xe) => {
    R && cancelAnimationFrame(R), R = requestAnimationFrame(() => {
      var _a, _b, _c;
      const D = X(xe.clientX, xe.clientY);
      if (he && Q < 5) {
        const j = t.derivedNodes.rawVal, ae = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${xe.clientX}, ${xe.clientY}) nodes=${(j == null ? void 0 : j.length) ?? 0} elems=${(ae == null ? void 0 : ae.length) ?? 0} hover=`, D), Q++;
      }
      const ne = D ? `${D.type}:${D.idx}` : "";
      if (ne !== q) q = ne, K(D, xe.clientX, xe.clientY);
      else if (D) {
        const j = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        H.style.left = `${xe.clientX - j.left}px`, H.style.top = `${xe.clientY - j.top}px`;
      }
    });
  };
  let Me = null;
  const W = () => {
    q = "", S.visible = false, F.visible = false, L.visible = false, te.visible = false, O.visible = false, H.style.display = "none", t.render();
  }, _e = (xe) => {
    const D = t.rendererElm.getBoundingClientRect(), ne = xe.clientX - D.left, j = xe.clientY - D.top;
    (ne < -2 || j < -2 || ne > D.width + 2 || j > D.height + 2) && (Me && clearTimeout(Me), Me = window.setTimeout(W, 200));
  }, de = () => {
    Me && (clearTimeout(Me), Me = null);
  };
  t.rendererElm.addEventListener("pointermove", ye), t.rendererElm.addEventListener("pointerleave", _e), t.rendererElm.addEventListener("pointerenter", de);
  function Fe() {
    var _a, _b, _c;
    const xe = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    return xe === "select" || xe === "none" || !xe;
  }
  let me = null;
  t.rendererElm.addEventListener("pointerdown", (xe) => {
    xe.button === 0 && (me = { x: xe.clientX, y: xe.clientY });
  }), t.rendererElm.addEventListener("pointerup", (xe) => {
    if (xe.button !== 0 || !me) return;
    const D = xe.clientX - me.x, ne = xe.clientY - me.y;
    if (me = null, D * D + ne * ne > 9 || !Fe()) return;
    const j = X(xe.clientX, xe.clientY);
    j ? (vt({ type: j.type, idx: j.idx }, xe.shiftKey), Oe()) : Mt();
  }), window.addEventListener("keydown", (xe) => {
    if (xe.key !== "Escape" || !oe.length) return;
    const D = document.activeElement, ne = !!D && (D.id === "hk3-cmd-input" || D.id === "hk-dyn-input") && D.value === "";
    D && (D.tagName === "INPUT" || D.tagName === "TEXTAREA" || D.isContentEditable) && !ne || Mt();
  }, { capture: true });
  function Ve() {
    for (const xe of J.children.slice()) {
      J.remove(xe);
      const D = xe.geometry;
      D && D !== g && D !== Z && D.dispose();
    }
  }
  const ve = (xe) => {
    var _a;
    const D = t.getActiveCamera(), ne = ((_a = t.rendererElm) == null ? void 0 : _a.clientHeight) || 700;
    return D.isOrthographicCamera ? (D.top - D.bottom) / (D.zoom || 1) / ne : 2 * D.position.distanceTo(xe) * Math.tan((D.fov || 50) * Math.PI / 180 / 2) / ne;
  };
  function We(xe, D) {
    var _a, _b;
    const ne = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
    if (xe.type === "node") {
      const j = G(xe.idx);
      if (!j) return;
      const ae = new it(g, U);
      ae.position.copy(j), ae.scale.setScalar(Math.max(1e-4, 7 * ve(j))), ae.renderOrder = 101, J.add(ae);
    } else if (xe.type === "frame" && ne) {
      const j = ne[xe.idx], ae = G(j[0]), Ce = G(j[1]);
      if (!ae || !Ce) return;
      const Se = ae.clone().add(Ce).multiplyScalar(0.5), ge = Ce.clone().sub(ae), Le = ge.length(), Ne = t.getActiveCamera().position.distanceTo(Se), tt = new it(Z, ce);
      tt.position.copy(Se);
      const Pe = new E(0, 1, 0);
      tt.quaternion.setFromAxisAngle(Pe.clone().cross(ge).normalize(), Pe.angleTo(ge)), tt.scale.set(Ne * 35e-4, Le, Ne * 35e-4), tt.renderOrder = 101, J.add(tt);
    } else if (xe.type === "shell" && ne) {
      const j = ne[xe.idx], ae = [], Ce = [];
      for (const Le of j) {
        const Ne = G(Le);
        if (!Ne) return;
        ae.push(Ne.x, Ne.y, Ne.z);
      }
      j.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : j.length === 3 && Ce.push(0, 1, 2);
      const Se = new Ae();
      Se.setAttribute("position", new Vt(ae, 3)), Se.setIndex(Ce), Se.computeVertexNormals();
      const ge = new it(Se, le);
      ge.renderOrder = 101, J.add(ge);
    } else if (xe.type === "solid" && ne) {
      const j = ne[xe.idx], ae = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Le, Ne] of ae) {
        const tt = G(j[Le]), Pe = G(j[Ne]);
        tt && Pe && Ce.push(tt.x, tt.y, tt.z, Pe.x, Pe.y, Pe.z);
      }
      const Se = new Ae();
      Se.setAttribute("position", new Vt(Ce, 3));
      const ge = new Jt(Se, se);
      ge.renderOrder = 101, J.add(ge);
    }
  }
  function Oe() {
    if (Ve(), !oe.length || !t.mesh) {
      t.render();
      return;
    }
    const xe = t.derivedNodes.rawVal ?? [];
    if (xe.length >= 2) {
      const D = [1 / 0, 1 / 0, 1 / 0], ne = [-1 / 0, -1 / 0, -1 / 0];
      for (const j of xe) for (let ae = 0; ae < 3; ae++) j[ae] < D[ae] && (D[ae] = j[ae]), j[ae] > ne[ae] && (ne[ae] = j[ae]);
      Math.max(ne[0] - D[0], ne[1] - D[1], ne[2] - D[2], 0.1);
    }
    for (const D of oe) We(D);
    t.render();
  }
  function vt(xe, D) {
    const ne = oe.findIndex((j) => j.type === xe.type && j.idx === xe.idx);
    ne >= 0 ? oe.splice(ne, 1) : D || oe.push(xe), oe.length && oe[oe.length - 1];
  }
  function Mt() {
    oe.length = 0, Oe();
  }
  return re.derive(() => {
    t.derivedNodes.val, oe.length && Oe();
  }), y;
}
function Wi(t, y, g, b, S, z) {
  const A = S - g, F = z - b, C = A * A + F * F;
  if (C < 1e-9) {
    const we = t - g, O = y - b;
    return Math.sqrt(we * we + O * O);
  }
  let L = ((t - g) * A + (y - b) * F) / C;
  L = Math.max(0, Math.min(1, L));
  const N = g + L * A, B = b + L * F, te = t - N, fe = y - B;
  return Math.sqrt(te * te + fe * fe);
}
function Gi(t, y, g) {
  let b = false;
  for (let S = 0, z = g.length - 1; S < g.length; z = S++) {
    const A = g[S].x, F = g[S].y, C = g[z].x, L = g[z].y;
    F > y != L > y && t < (C - A) * (y - F) / (L - F + 1e-12) + A && (b = !b);
  }
  return b;
}
const Hi = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Ji = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Sn = 1e-3;
function so(t, y) {
  return y === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : y === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function Qi(t, y) {
  const g = Math.abs(y[0] - t[0]);
  return Math.abs(y[1] - t[1]) < Sn ? { plano: "XZ", en: t[1] } : g < Sn ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function Oi(t, y) {
  var _a, _b;
  let g = null, b = { plano: "XZ", en: 0 };
  const S = () => {
    var _a2, _b2;
    const Z = ((_a2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _a2.rawVal) ?? ((_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.val);
    return !Z || Z === "none" ? null : String(Z).replace(/^contour:/, "");
  }, z = (Z) => {
    var _a2, _b2;
    const le = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], se = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], oe = /* @__PURE__ */ new Set();
    for (const J of se) {
      if (J.length !== 2) continue;
      const H = le[J[0]], G = le[J[1]];
      if (!H || !G) continue;
      const X = so(H, Z), K = so(G, Z);
      Math.abs(X.fuera - K.fuera) < Sn && oe.add(Math.round(X.fuera * 1e3) / 1e3);
    }
    return [...oe].sort((J, H) => J - H);
  };
  function A(Z) {
    var _a2, _b2;
    if (Z == null ? void 0 : Z.plano) b = { plano: Z.plano, en: Z.en ?? z(Z.plano)[0] ?? 0 };
    else {
      const se = [...window.__hekatanModelSelection ?? []].reverse().find((H) => H.type === "frame"), oe = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], J = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      se && J[se.idx] && oe[J[se.idx][0]] && oe[J[se.idx][1]] ? b = Qi(oe[J[se.idx][0]], oe[J[se.idx][1]]) : b = { plano: "XZ", en: z("XZ")[0] ?? 0 };
    }
    g || F(), g.hidden = false, C();
  }
  function F() {
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
    const Z = g.querySelector(".hk-d2-plano"), le = g.querySelector(".hk-d2-en");
    Z.addEventListener("change", () => {
      b = { plano: Z.value, en: z(Z.value)[0] ?? 0 }, C();
    }), le.addEventListener("change", () => {
      b.en = Number(le.value), C();
    });
    const se = (H) => {
      const G = z(b.plano), X = G.findIndex((q) => Math.abs(q - b.en) < Sn), K = Math.max(0, Math.min(G.length - 1, (X < 0 ? 0 : X) + H));
      G.length && (b.en = G[K], C());
    };
    g.querySelector(".hk-d2-ant").addEventListener("click", () => se(-1)), g.querySelector(".hk-d2-sig").addEventListener("click", () => se(1));
    const oe = g.querySelector(".hk-d2-bar");
    let J = null;
    oe.addEventListener("pointerdown", (H) => {
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
    var _a2, _b2, _c, _d, _e2, _f, _g, _h;
    if (!g || g.hidden) return;
    const Z = new Set(B && !B.hidden && te >= 0 ? we(te) : []), le = g.querySelector(".hk-d2-svg"), se = g.querySelector(".hk-d2-tit"), oe = g.querySelector(".hk-d2-pie"), J = g.querySelector(".hk-d2-plano"), H = g.querySelector(".hk-d2-en");
    J.value = b.plano;
    const G = z(b.plano), X = b.plano === "XZ" ? "y" : b.plano === "YZ" ? "x" : "z", K = b.plano === "XY" ? "Planta" : "P\xF3rtico";
    H.innerHTML = G.map((ke, Be) => `<option value="${ke}" ${Math.abs(ke - b.en) < Sn ? "selected" : ""}>${K} ${Be + 1} \xB7 ${X} = ${ke.toFixed(2)} m</option>`).join("");
    const q = S(), R = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], Q = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], he = q ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[q] : null;
    le.innerHTML = "";
    const ye = le.clientWidth || 880, Me = le.clientHeight || 480, W = [];
    if (Q.forEach((ke, Be) => {
      if (ke.length !== 2) return;
      const mt = R[ke[0]], nt = R[ke[1]];
      if (!mt || !nt) return;
      const _t = so(mt, b.plano), Dt = so(nt, b.plano);
      Math.abs(_t.fuera - b.en) < Sn && Math.abs(Dt.fuera - b.en) < Sn && W.push({ i: Be, a: _t, b: Dt });
    }), !W.length) {
      oe.textContent = "No hay barras en este plano.", se.textContent = "";
      return;
    }
    let _e = 1 / 0, de = -1 / 0, Fe = 1 / 0, me = -1 / 0;
    for (const ke of W) for (const Be of [ke.a, ke.b]) _e = Math.min(_e, Be.u), de = Math.max(de, Be.u), Fe = Math.min(Fe, Be.v), me = Math.max(me, Be.v);
    const Ve = de - _e || 1, ve = me - Fe || 1, We = 0.12 * Math.max(Ve, ve), Oe = 46, vt = Math.min((ye - 2 * Oe) / (Ve + 2 * We), (Me - 2 * Oe) / (ve + 2 * We)), Mt = (ye - Ve * vt) / 2, xe = (Me - ve * vt) / 2, D = (ke) => Mt + (ke - _e) * vt, ne = (ke) => Me - (xe + (ke - Fe) * vt), j = "http://www.w3.org/2000/svg", ae = (ke, Be, mt) => {
      const nt = document.createElementNS(j, ke);
      for (const _t in Be) nt.setAttribute(_t, String(Be[_t]));
      return mt != null && (nt.textContent = mt), le.appendChild(nt), nt;
    }, Ce = /* @__PURE__ */ new Map();
    for (const ke of W) {
      const Be = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, ke.i)) ?? 0, mt = so(xa(q ?? "normals", ya(R[Q[ke.i][0]], R[Q[ke.i][1]], Be)), b.plano), nt = Math.hypot(mt.u, mt.v);
      Ce.set(ke.i, nt > 0.3 ? [mt.u / nt, -mt.v / nt] : null);
    }
    const Se = W.filter((ke) => !Ce.get(ke.i)).length;
    let ge = 0;
    if (he) for (const ke of W) {
      if (!Ce.get(ke.i)) continue;
      const Be = he instanceof Map ? he.get(ke.i) : he[ke.i];
      Be && (ge = Math.max(ge, Math.abs(Be[0] ?? 0), Math.abs(Be[1] ?? 0)));
    }
    const Le = 0.12 * Math.max(Ve, ve) * vt, Ne = ge > 0 ? Le / ge : 0, tt = q === "bendingsY" || q === "bendingsZ", Pe = (ke) => Math.abs(ke) >= 100 ? ke.toFixed(1) : Math.abs(ke) >= 10 ? ke.toFixed(2) : ke.toFixed(3), Te = [];
    for (const ke of W) {
      const Be = D(ke.a.u), mt = ne(ke.a.v), nt = D(ke.b.u), _t = ne(ke.b.v), Dt = Ce.get(ke.i), [ot, Ie] = Dt ?? [0, 0], Re = he && Dt ? he instanceof Map ? he.get(ke.i) : he[ke.i] : null, [Ye, $e] = Re ? hs(q, Re) : [0, 0];
      if (Re && Ne > 0) {
        const He = [Be + ot * Ye * Ne * 1, mt + Ie * Ye * Ne * 1], st = [nt + ot * $e * Ne * 1, _t + Ie * $e * Ne * 1], on = Ye + $e >= 0 ? "#3fa7d6" : "#d9534f";
        ae("polygon", { points: `${Be},${mt} ${He[0]},${He[1]} ${st[0]},${st[1]} ${nt},${_t}`, fill: on, "fill-opacity": 0.38, stroke: on, "stroke-width": 1.2 }), Te.push({ x: He[0] + ot * 12, y: He[1] + Ie * 12, t: Pe(Ye), peso: Math.abs(Ye) }), Te.push({ x: st[0] + ot * 12, y: st[1] + Ie * 12, t: Pe($e), peso: Math.abs($e) });
      }
      ae("line", { x1: Be, y1: mt, x2: nt, y2: _t, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), Z.has(ke.i) && ae("line", { x1: Be, y1: mt, x2: nt, y2: _t, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const et = ae("line", { x1: Be, y1: mt, x2: nt, y2: _t, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      et.addEventListener("click", () => O(ke.i));
      const at = document.createElementNS(j, "title");
      at.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", et.appendChild(at);
    }
    for (const ke of W) for (const Be of [ke.a, ke.b]) b.plano !== "XY" && Math.abs(Be.v - Fe) < Sn && ae("rect", { x: D(Be.u) - 6, y: ne(Be.v), width: 12, height: 7, fill: "#b03a3a" });
    const lt = [];
    Te.sort((ke, Be) => Be.peso - ke.peso);
    for (const ke of Te) ke.peso < 0.02 * ge || lt.some((Be) => Math.hypot(Be.x - ke.x, Be.y - ke.y) < 34) || (lt.push(ke), ae("text", { x: ke.x, y: ke.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, ke.t));
    const Qe = q ? Hi[q] ?? q : "sin resultado";
    se.textContent = `${Qe} \xB7 ${b.plano === "XY" ? "planta" : "alzado"} ${b.plano} en ${X} = ${b.en.toFixed(2)} m`, oe.textContent = q ? `${W.length} barras en el plano \xB7 m\xE1ximo ${Pe(ge)} ${Ji[q] ?? ""}` + (tt ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (Se ? ` \xB7 ${Se} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const L = () => {
    try {
      C();
    } catch {
    }
  };
  (y == null ? void 0 : y.frameResults) && ((_b = (_a = window.van) == null ? void 0 : _a.derive) == null ? void 0 : _b.call(_a, () => {
    y.frameResults.val, L();
  }));
  let N = null;
  setInterval(() => {
    var _a2, _b2;
    const Z = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal, le = (_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.rawVal, se = [Z, le];
    if (!(N && N[0] === Z && N[1] === le)) {
      N = se, L();
      try {
        ce();
      } catch {
      }
    }
  }, 400);
  let B = null, te = -1, fe = "12";
  function we(Z) {
    var _a2, _b2;
    const le = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], se = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], oe = /* @__PURE__ */ new Map();
    se.forEach((X, K) => {
      if (X.length === 2) for (const q of X) oe.has(q) || oe.set(q, []), oe.get(q).push(K);
    });
    const J = (X) => {
      const K = le[se[X][0]], q = le[se[X][1]], R = [q[0] - K[0], q[1] - K[1], q[2] - K[2]], Q = Math.hypot(R[0], R[1], R[2]) || 1;
      return R.map((he) => he / Q);
    }, H = (X, K) => {
      const q = J(X), R = J(K);
      return Math.abs(q[0] * R[0] + q[1] * R[1] + q[2] * R[2]) > 0.9999;
    }, G = [Z];
    for (const X of [0, 1]) {
      let K = Z, q = se[Z][X];
      for (let R = 0; R < 500; R++) {
        const Q = (oe.get(q) ?? []).filter((ye) => ye !== K);
        if (Q.length !== 1 || !H(K, Q[0])) break;
        const he = Q[0];
        X === 0 ? G.unshift(he) : G.push(he), q = se[he][0] === q ? se[he][1] : se[he][0], K = he;
      }
    }
    return G;
  }
  function O(Z) {
    if (Z == null) {
      const se = [...window.__hekatanModelSelection ?? []].reverse().find((oe) => oe.type === "frame");
      if (!se) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      Z = se.idx;
    }
    te = Z, B || (B = document.createElement("div"), B.id = "hk-diagrama-barra", B.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), B.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(B), B.querySelector(".hk-b-x").addEventListener("click", () => {
      B.hidden = true, U(), C();
    }), B.querySelector(".hk-b-pl").addEventListener("change", (le) => {
      fe = le.target.value, ce();
    })), B.hidden = false, U(), ce(), C();
  }
  function U() {
    if (!g || !B) return;
    const Z = window.innerWidth, le = Math.min(560, Math.round(Z * 0.4));
    B.style.width = le + "px", !B.hidden && !g.hidden ? (g.style.transform = "none", g.style.left = "12px", g.style.width = Z - le - 36 + "px", B.style.top = g.getBoundingClientRect().top + "px") : g.hidden || (g.style.left = "50%", g.style.transform = "translateX(-50%)", g.style.width = "min(900px,92vw)");
  }
  function ce() {
    var _a2, _b2, _c;
    if (!B || B.hidden || te < 0) return;
    const Z = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], le = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], se = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!le[te]) return;
    const oe = we(te), J = [];
    let H = 0, G = -1;
    oe.forEach((de, Fe) => {
      const [me, Ve] = le[de], ve = Fe === 0 ? oe.length > 1 && le[oe[1]].includes(me) : me !== G, We = ve ? Ve : me, Oe = ve ? me : Ve, vt = Math.hypot(Z[Oe][0] - Z[We][0], Z[Oe][1] - Z[We][1], Z[Oe][2] - Z[We][2]);
      J.push({ x: H, e: de, fin: ve ? 1 : 0 }), H += vt, J.push({ x: H, e: de, fin: ve ? 0 : 1 }), G = Oe;
    });
    const X = H, K = (de, Fe) => {
      const me = se[de], Ve = me ? me instanceof Map ? me.get(Fe.e) : me[Fe.e] : null;
      return Ve ? hs(de, Ve)[Fe.fin] : 0;
    }, q = Z[le[oe[0]][0]], R = (de) => de.toFixed(2);
    B.querySelector(".hk-b-tit").textContent = "L = " + X.toFixed(2) + " m \xB7 " + oe.length + " tramo(s) \xB7 desde (" + R(q[0]) + ", " + R(q[1]) + ", " + R(q[2]) + ")";
    const Q = fe === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], he = B.querySelector(".hk-b-cuerpo");
    he.innerHTML = "";
    const ye = Math.max(300, he.clientWidth), Me = 124, W = 46, _e = (Me - 14) / 2;
    for (const [de, Fe, me, Ve] of Q) {
      const ve = J.map((ge) => K(de, ge)), We = Math.max(...ve), Oe = Math.min(...ve), vt = Math.max(Math.abs(We), Math.abs(Oe)) || 1, Mt = (ge) => W + ge / (X || 1) * (ye - 2 * W), xe = (ge) => _e + (Ve ? 1 : -1) * (ge / vt) * (_e - 16), D = (ge) => Math.abs(ge) >= 100 ? ge.toFixed(1) : Math.abs(ge) >= 10 ? ge.toFixed(2) : ge.toFixed(3);
      let ne = Mt(0) + "," + _e + " ";
      J.forEach((ge, Le) => {
        ne += Mt(ge.x) + "," + xe(ve[Le]) + " ";
      }), ne += Mt(X) + "," + _e;
      const j = ve.indexOf(We), ae = ve.indexOf(Oe), Ce = (ge, Le) => {
        const Ne = xe(ve[ge]) + (xe(ve[ge]) < _e ? -5 : 13);
        return '<text x="' + Mt(J[ge].x) + '" y="' + Ne + '" text-anchor="middle" fill="' + Le + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + D(ve[ge]) + "</text>";
      }, Se = Ve ? "#d9534f" : "#3fa7d6";
      he.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Fe + ' <span style="color:#6f7d90;font-weight:400">(' + me + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + D(We) + " \xB7 m\xEDn " + D(Oe) + (Ve ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + ye + '" height="' + Me + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + W + '" y1="' + _e + '" x2="' + (ye - W) + '" y2="' + _e + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + ne + '" fill="' + Se + '" fill-opacity=".35" stroke="' + Se + '" stroke-width="1.4"/>' + Ce(0, "#f2f5fa") + Ce(J.length - 1, "#f2f5fa") + (j > 0 && j < J.length - 1 ? Ce(j, "#8fd3ff") : "") + (ae > 0 && ae < J.length - 1 && ae !== j ? Ce(ae, "#ff9f9a") : "") + '<text x="' + W + '" y="' + (Me - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (ye - W) + '" y="' + (Me - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + X.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = O, window.__hekatanDiagrama2D = A, { abrir: A, abrirBarra: O };
}
function ia(t, y = 8) {
  const g = document.createElement("div");
  g.id = "legend", g.style.setProperty("--legend-n", String(y)), setTimeout(() => {
    re.derive(() => {
      Do.val, g.style.background = ci();
    });
  });
  const b = document.createElement("div");
  b.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", g.appendChild(b), setTimeout(() => {
    re.derive(() => {
      b.textContent = ms.val ? `[${ms.val}]` : "";
    });
  });
  const S = Array.from({ length: y + 1 }, (C, L) => L / y).reverse();
  let z, A;
  S.forEach((C, L) => {
    z = document.createElement("div"), z.id = `marker-${L}`, z.className = "marker", z.style.marginTop = L == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", A = document.createElement("p"), A.id = `marker-text-${L}`, z.append(A), g.append(z);
  });
  const F = [];
  return g.querySelectorAll("p").forEach((C) => F.push(C)), setTimeout(() => {
    re.derive(() => {
      S.forEach((C, L) => {
        const N = F[L];
        N && (N.innerText = ji(t.val, C).toString());
      });
    });
  }), g;
}
function ji(t, y) {
  const g = lo.val;
  if (g) return la(g[0] + y * (g[1] - g[0]));
  const b = t.filter((A) => Number.isFinite(A));
  if (b.length === 0) return "0";
  const [S, z] = ws(b);
  return la(S + y * (z - S));
}
function la(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const y = Math.abs(t);
  return y < 1e-3 || y >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function ul({ mesh: t, settingsObj: y, drawingObj: g, objects3D: b, solids: S }) {
  ii.DEFAULT_UP = new E(0, 0, 1);
  const z = document.createElement("div"), A = new ni(), F = new oi(45, 1, 0.1, 2 * 1e6), C = new si(-10, 10, 10, -10, -1e3, 2e6);
  let L = F;
  const N = new ai({ antialias: true });
  N.localClippingEnabled = true;
  const B = new na(F, N.domElement);
  B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.keyPanSpeed = 12, B.listenToKeyEvents(window), B.touches = { ONE: Fo.ROTATE, TWO: Fo.DOLLY_PAN }, N.domElement.addEventListener("wheel", (D) => {
    if (!D.ctrlKey && Math.abs(D.deltaX) > Math.abs(D.deltaY) * 1.5) {
      D.preventDefault();
      const ne = B.target, j = new E().subVectors(F.position, ne), ae = new E();
      ae.crossVectors(F.up, j).normalize();
      const Se = j.length() * 1e-3 * B.panSpeed;
      ne.addScaledVector(ae, D.deltaX * Se), F.position.addScaledVector(ae, D.deltaX * Se), B.update();
    }
  }, { passive: false });
  const te = new rs(new E(-1, 0, 0), 0), fe = new rs(new E(0, -1, 0), 0), we = new rs(new E(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function O() {
    const D = window.__hekatanClip, ne = [];
    D.enableX && (te.normal.set(D.invertX ? 1 : -1, 0, 0), te.constant = D.invertX ? -D.posX : D.posX, ne.push(te)), D.enableY && (fe.normal.set(0, D.invertY ? 1 : -1, 0), fe.constant = D.invertY ? -D.posY : D.posY, ne.push(fe)), D.enableZ && (we.normal.set(0, 0, D.invertZ ? 1 : -1), we.constant = D.invertZ ? -D.posZ : D.posZ, ne.push(we)), N.clippingPlanes = ne, A.traverse((ae) => {
      const Ce = ae;
      if (Ce.material) {
        const Se = Array.isArray(Ce.material) ? Ce.material : [Ce.material];
        for (const ge of Se) ge.clippingPlanes = ne, ge.needsUpdate = true;
      }
    });
    const j = window.__hekatanPanes ?? [];
    for (const ae of j) try {
      ae && typeof ae.refresh == "function" && ae.refresh();
    } catch {
    }
    N.render(A, L);
  }
  O(), window.__hekatanClipApply = O;
  const U = fi(y), ce = re.derive(() => Math.pow(10, U.displayScale.val / 10)), Z = el(t, U), le = () => {
    const D = [];
    return U.gridXY.rawVal && D.push("xy"), U.gridXZ.rawVal && D.push("xz"), U.gridYZ.rawVal && D.push("yz"), D;
  }, se = () => {
    const D = U.gridStep.rawVal, ne = Math.max(D, U.gridMajor.rawVal);
    return { planes: le(), majorStep: ne, minorStep: D };
  };
  let oe = ds(U.gridSize.rawVal, se());
  oe.visible = U.gridVisible.rawVal, window.__hekatanSnap2D = U.cursorSnap.rawVal;
  const J = () => {
    const D = Math.max(0, Math.min(1, U.gridOpacity.rawVal));
    oe.traverse((ne) => {
      const j = ne.material;
      if (!j || !("opacity" in j)) return;
      const ae = ne.name ?? "";
      let Ce = 0.55;
      ae.includes("border") ? Ce = 1 : ae.includes("major") && (Ce = 0.95), j.opacity = D * Ce;
    });
  };
  J(), z.appendChild(ui(U, t, S)), z.setAttribute("id", "viewer"), z.appendChild(N.domElement), N.setPixelRatio(window.devicePixelRatio);
  const H = $n();
  N.setClearColor(H.background, 1);
  const G = U.gridSize.rawVal, X = G * 0.5 + G * 0.5 / Math.tan(45 * 0.5);
  F.position.set(0, 0, X), F.up.set(0, 1, 0), B.target.set(0, 0, 0), B.minDistance = 0.1, B.maxDistance = 1e4, z.__settings = U, B.zoomSpeed = 1, B._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, B.update();
  let K = sa(U.gridSize.rawVal, U.flipAxes.rawVal);
  A.add(oe, K), re.derive(() => {
    window.__hekatanGridPlaneXY = U.gridXY.val, window.__hekatanGridPlaneXZ = U.gridXZ.val, window.__hekatanGridPlaneYZ = U.gridYZ.val;
  });
  let q = true;
  re.derive(() => {
    const D = U.gridVisible.val;
    if (q) {
      q = false;
      return;
    }
    oe.visible = D, de();
  });
  let R = true;
  re.derive(() => {
    if (U.gridOpacity.val, R) {
      R = false;
      return;
    }
    J(), de();
  }), re.derive(() => {
    const D = U.cursorSnap.val;
    window.__hekatanSnap2D = D;
  });
  let Q = true;
  re.derive(() => {
    var _a, _b, _c;
    const D = U.gridSize.val, ne = U.flipAxes.val;
    if (U.gridXY.val, U.gridXZ.val, U.gridYZ.val, U.gridStep.val, U.gridMajor.val, Q) {
      Q = false;
      return;
    }
    A.remove(oe), (_a = oe.traverse) == null ? void 0 : _a.call(oe, (Se) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), oe = ds(D, se()), oe.visible = U.gridVisible.rawVal, A.add(oe), J(), A.remove(K), K.traverse((Se) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), K = sa(D, ne), A.add(K);
    const j = D * 0.5 + D * 0.5 / Math.tan(45 * 0.5);
    F.position.distanceTo(B.target);
    const ae = Math.abs(F.position.x) < 0.1 && Math.abs(F.position.y) < 0.1 && F.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ae ? F.position.set(0, 0, j) : F.position.set(0.5 * D, -j, 0.5 * D), B.target.set(0, 0, 0)), B.minDistance = Math.max(0.05, D * 0.01), B.maxDistance = Math.max(50, D * 50), B.update(), de();
  }), new ResizeObserver((D) => {
    var _a, _b;
    for (const ne of D) {
      const j = (_a = ne.target) == null ? void 0 : _a.clientWidth, ae = (_b = ne.target) == null ? void 0 : _b.clientHeight;
      if (j === 0 || ae === 0) continue;
      const Se = (ye ? j / 2 : j) / ae;
      F.aspect = Se, F.updateProjectionMatrix();
      const ge = C.top;
      if (C.left = -ge * Se, C.right = ge * Se, C.updateProjectionMatrix(), Me && Me.isPerspectiveCamera) Me.aspect = Se, Me.updateProjectionMatrix();
      else if (Me && Me.isOrthographicCamera) {
        const Le = Me, Ne = Le.top;
        Le.left = -Ne * Se, Le.right = Ne * Se, Le.updateProjectionMatrix();
      }
      N.setSize(j, ae), de();
    }
  }).observe(z), B.addEventListener("change", de), re.derive(() => {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2;
    (_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e2 = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e2.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, U.displayScale.val, U.nodes.val, U.elements.val, (_g = U.edges) == null ? void 0 : _g.val, U.elemColumns.val, U.elemBeams.val, U.nodesIndexes.val, U.elementsIndexes.val, U.orientations.val, U.sections.val, U.secColumns.val, U.secBeams.val, U.secFloor.val, U.supports.val, U.loads.val, U.deformedShape.val, U.nodeResults.val, U.frameResults.val, U.shellResults.val, (_h = U.solidResults) == null ? void 0 : _h.val, (_i2 = U.extruded) == null ? void 0 : _i2.val, setTimeout(de);
  });
  let ye = false, Me = null, W = null, _e = false;
  function de() {
    const D = z.clientWidth || 1, ne = z.clientHeight || 1;
    if (!ye || !Me) {
      N.setScissorTest(false), N.setViewport(0, 0, D, ne), N.render(A, L);
      return;
    }
    const j = D / 2;
    N.setScissorTest(true), N.setViewport(0, 0, j, ne), N.setScissor(0, 0, j, ne), N.render(A, L), N.setViewport(j, 0, j, ne), N.setScissor(j, 0, j, ne), N.render(A, Me), N.setScissorTest(false);
  }
  function Fe(D) {
    L = D, B.object = D, B.update(), de();
  }
  function me(D, ne) {
    ye = D, ne && (Me = ne);
    const j = z.clientWidth || 1, ae = z.clientHeight || 1, Se = (D ? j / 2 : j) / ae;
    F.isPerspectiveCamera && (F.aspect = Se, F.updateProjectionMatrix());
    const ge = C.top;
    if (C.left = -ge * Se, C.right = ge * Se, C.updateProjectionMatrix(), D && Me) {
      if (W ? (W.object = Me, W.update()) : (W = new na(Me, N.domElement), W.enableDamping = true, W.dampingFactor = 0.1, W.screenSpacePanning = true, W.zoomSpeed = 0.8, W.panSpeed = 1.2, W.rotateSpeed = 0.9, W.touches = { ONE: Fo.ROTATE, TWO: Fo.DOLLY_PAN }, W.target.copy(B.target), W.addEventListener("change", de), W.enabled = false), !_e) {
        const Le = (Ne) => {
          if (!ye || !W) return;
          const tt = N.domElement.getBoundingClientRect(), Pe = Ne.clientX - tt.left, Te = tt.width / 2, lt = Pe >= Te;
          B.enabled = !lt, W.enabled = lt;
        };
        N.domElement.addEventListener("pointerdown", Le, true), N.domElement.addEventListener("wheel", Le, { capture: true, passive: true }), _e = true;
      }
    } else D || (B.enabled = true, W && (W.enabled = false));
    z.__splitMode = D, window.__hekatanSplitMode = D, window.__hekatanSplitCamera = D ? Me : null, de();
  }
  if (t) {
    A.add(pi(U, Z, ce), li(t, U, Z), wi(U, Z, ce), yi(t, U, Z, ce), hi(t, U, Z, ce), mi(t, U, Z, ce), vi(t, U, Z, ce), bi(t, U, Z, ce), Pi(t, U, Z), Fi(t, U, Z, ce), Ci(t, U, Z, ce)), window.__hekatanDiagrama2D || (Oi(t, U), N.domElement.addEventListener("dblclick", () => {
      var _a;
      const Le = (_a = U.frameResults) == null ? void 0 : _a.rawVal;
      !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((tt) => tt.type === "frame") || setTimeout(() => {
        var _a2;
        return (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }, 60);
    }));
    const D = Ki({ scene: A, rendererElm: N.domElement, getActiveCamera: () => L, derivedNodes: Z, derivedDisplayScale: ce, mesh: t, settings: U, render: de });
    A.add(D);
    const ne = il(t, U), j = $i(t, U, Z, ne), ae = ia(ne);
    A.add(j), z.appendChild(ae);
    const Ce = Di(t, U, Z);
    A.add(Ce);
    const Se = Ce.__colorMapValues, ge = ia(Se);
    ge.id = "frame-legend", z.appendChild(ge), re.derive(() => {
      var _a;
      const Le = U.shellResults.val != "none", Ne = (((_a = U.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", tt = Le || Ne, Pe = U.frameResults.val.startsWith("contour:"), Te = ne.val.some((lt) => Number.isFinite(lt));
      ae.hidden = !tt || !Te, j.visible = tt, ge.hidden = !Pe;
    });
  }
  if (S) {
    const D = new ua(16777215, 0.5);
    A.add(D);
    const ne = new To(16777215, 0.5);
    ne.position.set(30, 25, -10), ne.shadow.mapSize.width = 1024, ne.shadow.mapSize.height = 1024, A.add(ne);
    const j = 10;
    ne.shadow.camera.left = -j, ne.shadow.camera.right = j, ne.shadow.camera.top = j, ne.shadow.camera.bottom = -j, ne.shadow.camera.far = 1e3;
    const ae = new To(16777215, 0.5);
    ae.color.setHSL(11, 43, 96), ae.position.set(-10, 0, 30), A.add(ae), re.derive(() => {
      (S == null ? void 0 : S.val.length) && (A.remove(...S.oldVal), A.add(...S.rawVal), de());
    }), re.derive(() => {
      S.rawVal.forEach((Ce) => Ce.visible = U.solids.val), de();
    });
  }
  if (b) {
    const D = [], ne = (ae) => {
      var _a;
      return ((_a = ae == null ? void 0 : ae.userData) == null ? void 0 : _a.isCota) ? U.showCotas.val : U.custom3D.val;
    }, j = () => {
      for (const ae of D) ae.visible = ne(ae);
      de();
    };
    re.derive(() => {
      const ae = b.val;
      D.length && (A.remove(...D), D.length = 0), ae.length && (A.add(...ae), D.push(...ae), j(), N.clippingPlanes.length && O()), de();
    }), re.derive(() => {
      U.custom3D.val, j();
    }), re.derive(() => {
      U.showCotas.val, j();
    });
  }
  g && Ei({ drawingObj: g, gridObj: oe, scene: A, getActiveCamera: () => L, controls: B, gridSize: G, derivedDisplayScale: ce, rendererElm: N.domElement, viewerRender: de }), ca((D, ne) => {
    var _a;
    N.setClearColor(ne.background, 1), A.remove(oe), (_a = oe.traverse) == null ? void 0 : _a.call(oe, (j) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = j.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = j.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), oe = ds(U.gridSize.rawVal, { planes: le() }), A.add(oe), z.style.setProperty("--awatif-legend-color", ne.legendMarker), de();
  });
  const Ve = { scene: A, perspCamera: F, orthoCamera: C, get camera() {
    return L;
  }, controls: B, renderer: N, rendererElm: N.domElement, render: de, setActiveCamera: Fe, setSplitMode: me, get splitMode() {
    return ye;
  }, get splitCamera() {
    return Me;
  }, settings: U };
  z.__ctx = Ve;
  const ve = document.createElement("div");
  ve.id = "hk-nav-camara", ve.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const We = (D, ne, j) => {
    const ae = document.createElement("button");
    return ae.textContent = D, ae.title = ne, ae.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ae.onmouseenter = () => {
      ae.style.background = "rgba(70,70,70,0.9)";
    }, ae.onmouseleave = () => {
      ae.style.background = "rgba(40,40,40,0.85)";
    }, ae.onclick = (Ce) => {
      Ce.preventDefault(), j();
    }, ae;
  }, Oe = (D, ne) => {
    const j = B.target, ae = new E().subVectors(L.position, j), Ce = ae.length(), Se = new E(), ge = new E();
    Se.crossVectors(L.up, ae).normalize(), ge.copy(L.up).normalize();
    const Le = Ce * 0.05;
    j.addScaledVector(Se, -D * Le), j.addScaledVector(ge, ne * Le), L.position.addScaledVector(Se, -D * Le), L.position.addScaledVector(ge, ne * Le), B.update(), de();
  }, vt = (D) => {
    const ne = new E().subVectors(L.position, B.target);
    ne.multiplyScalar(D), L.position.copy(B.target).add(ne), B.update(), de();
  }, Mt = () => {
    const D = document.createElement("div");
    return D.style.cssText = "width:32px;height:32px;", D;
  };
  return ve.append(Mt()), ve.append(We("\u2191", "Pan arriba", () => Oe(0, 1))), ve.append(We("\u2295", "Zoom in", () => vt(0.85))), ve.append(We("\u2190", "Pan izquierda", () => Oe(-1, 0))), ve.append(We("\u2302", "Reset vista", () => {
    B.reset(), de();
  })), ve.append(We("\u2192", "Pan derecha", () => Oe(1, 0))), ve.append(We("\u2296", "Zoom out", () => vt(1.18))), ve.append(We("\u2193", "Pan abajo", () => Oe(0, -1))), ve.append(Mt()), getComputedStyle(z).position === "static" && (z.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && z.appendChild(ve), z;
}
function el(t, y) {
  return re.derive(() => {
    var _a, _b, _c, _d;
    if (!y.deformedShape.val) return ((_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val) ?? [];
    const g = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], b = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!b || g.length === 0) return g;
    const S = y.deformScale.val, z = y.deformScale.val * y.deformScaleZ.val, A = Number.isFinite(S) ? S : 1, F = Number.isFinite(z) ? z : 1;
    return g.map((C, L) => {
      var _a2;
      const N = ((_a2 = b.get(L)) == null ? void 0 : _a2.slice(0, 3)) ?? [0, 0, 0], B = Number.isFinite(N[0]) ? N[0] : 0, te = Number.isFinite(N[1]) ? N[1] : 0, fe = Number.isFinite(N[2]) ? N[2] : 0;
      return [C[0] + B * A, C[1] + te * A, C[2] + fe * F];
    });
  });
}
const lo = re.state(null), ms = re.state(""), tl = re.state("kN"), nl = re.state("mm"), ol = re.state("kN/m\xB2"), sl = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, ra = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, al = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function il(t, y) {
  const g = re.state([]);
  let b;
  return ((S) => {
    S.bendingXX = "bendingXX", S.bendingYY = "bendingYY", S.bendingXY = "bendingXY", S.membraneXX = "membraneXX", S.membraneYY = "membraneYY", S.membraneXY = "membraneXY", S.tranverseShearX = "tranverseShearX", S.tranverseShearY = "tranverseShearY", S.membranePrincipalMax = "membranePrincipalMax", S.membranePrincipalMin = "membranePrincipalMin", S.bendingPrincipalMax = "bendingPrincipalMax", S.bendingPrincipalMin = "bendingPrincipalMin", S.transverseShearMax = "transverseShearMax", S.vonMises = "vonMises", S.pressure = "pressure", S.displacementX = "displacementX", S.displacementY = "displacementY", S.displacementZ = "displacementZ";
  })(b || (b = {})), re.derive(() => {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const S = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Map(), we = (D, ne) => {
      D == null ? void 0 : D.forEach((j, ae) => {
        const Ce = t.elements.val[ae];
        if (Ce) for (let Se = 0; Se < Ce.length; Se++) ne.set(Ce[Se], [j[Se] ?? j[0]]);
      });
    };
    we((_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, S), we((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, z), we((_f = (_e2 = t.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, A), we((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, F), we((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, C), we((_l = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, L), we((_n = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, N), we((_p = (_o = t.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, B), we((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, te), we((_t = (_s = t.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, fe);
    const O = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), se = (D, ne, j, ae, Ce) => {
      D.forEach((Se, ge) => {
        var _a2, _b2;
        const Le = Se[0] ?? 0, Ne = ((_a2 = ne.get(ge)) == null ? void 0 : _a2[0]) ?? 0, tt = ((_b2 = j.get(ge)) == null ? void 0 : _b2[0]) ?? 0, Pe = (Le + Ne) / 2, Te = Math.hypot((Le - Ne) / 2, tt);
        ae.set(ge, [Pe + Te]), Ce.set(ge, [Pe - Te]);
      });
    };
    se(F, C, L, O, U), se(S, z, A, ce, Z), N.forEach((D, ne) => {
      var _a2;
      le.set(ne, [Math.hypot(D[0] ?? 0, ((_a2 = B.get(ne)) == null ? void 0 : _a2[0]) ?? 0)]);
    });
    const oe = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, J = (_w = y.solidResults) == null ? void 0 : _w.val, G = J && J !== "none" ? J : y.shellResults.val, X = oe == null ? void 0 : oe[G], K = { bendingXX: [S, 0], bendingYY: [z, 0], bendingXY: [A, 0], membraneXX: [F, 0], membraneYY: [C, 0], membraneXY: [L, 0], tranverseShearX: [N, 0], tranverseShearY: [B, 0], membranePrincipalMax: [O, 0], membranePrincipalMin: [U, 0], bendingPrincipalMax: [ce, 0], bendingPrincipalMin: [Z, 0], transverseShearMax: [le, 0], vonMises: [te, 0], pressure: [fe, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, q = y.shellResults.val, R = tl.val, Q = nl.val, he = q === "displacementX" || q === "displacementY" || q === "displacementZ", ye = q === "bendingXX" || q === "bendingYY" || q === "bendingXY" || q === "bendingPrincipalMax" || q === "bendingPrincipalMin", Me = q === "membraneXX" || q === "membraneYY" || q === "membraneXY" || q === "membranePrincipalMax" || q === "membranePrincipalMin", W = q === "vonMises" || q === "pressure", _e = q === "tranverseShearX" || q === "tranverseShearY" || q === "transverseShearMax", de = (_D = y.solidResults) == null ? void 0 : _D.val, Fe = de === "vonMises" || de === "sigmaXX" || de === "sigmaYY" || de === "sigmaZZ" || de === "tauXY" || de === "tauYZ" || de === "tauXZ", me = de === "ux" || de === "uy" || de === "uz", Ve = ol.val, ve = Fe ? al[Ve] : me || he ? ra[Q] : ye || Me || W || _e ? 1 / sl[R] : 1, We = Fe ? Ve : me || he ? Q : ye ? `${R}\xB7m/m` : Me ? `${R}/m\xB2` : W ? `${R}/m\xB2` : _e ? `${R}/m` : "";
    ms.val = We, lo.val = Array.isArray(X) && X.length === 2 ? [X[0] * ve, X[1] * ve] : null;
    const Oe = ma.val, Mt = de && de !== "none" ? [te, 0] : K[q], xe = [];
    if (t.nodes.val.forEach((D, ne) => {
      const j = Mt;
      if (!j || !j[0] || typeof j[0].has != "function") return;
      if (!j[0].has(ne)) {
        xe.push(Number.NaN);
        return;
      }
      const ae = j[0].get(ne), Ce = ae ? ae[j[1]] ?? 0 : 0;
      xe.push(Ce * ve);
    }), !lo.val && Oe !== "auto") {
      const D = t.nodes.val, ne = /* @__PURE__ */ new Set(), j = (Ce, Se) => {
        var _a2;
        const ge = (_a2 = D[Ce[0]]) == null ? void 0 : _a2[Se];
        return Ce.every((Le) => {
          var _a3;
          return Math.abs((((_a3 = D[Le]) == null ? void 0 : _a3[Se]) ?? NaN) - ge) < 1e-6;
        });
      };
      for (const Ce of t.elements.val) {
        if (Ce.length !== 4) continue;
        const Se = j(Ce, 2), ge = !Se && j(Ce, 0), Le = !Se && j(Ce, 1);
        if (Oe === "losas" ? Se : Oe === "muros" ? ge || Le : Oe === "murosX" ? ge : Oe === "murosY" ? Le : false) for (const Pe of Ce) ne.add(Pe);
      }
      const ae = [];
      for (const Ce of ne) {
        const Se = xe[Ce];
        Number.isFinite(Se) && ae.push(Se);
      }
      ae.length && (lo.val = ws(ae));
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
