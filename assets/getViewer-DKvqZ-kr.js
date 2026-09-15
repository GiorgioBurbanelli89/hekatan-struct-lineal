import { u as nn, a6 as Fo, q as Ga, v as ce, a7 as Wa, D as Vt, M as lt, B as Ee, F as $t, a8 as Ha, z as ft, a9 as Ja, aa as Qa, h as Qs, ab as Os, r as Tn, ac as Io, ad as Lo, a4 as ua, _ as rt, b as ct, L as Ht, y as pa, c as Oa, ae as ja, f as pt, V, $ as Ln, af as as, K as Do, d as Et, a as is, A as fa, t as Ro, J as ei, H as io, I as ti, ag as To, w as ls, o as ni, N as _n, a2 as oo, E as js, S as Gn, m as rs, ah as so, g as ea, i as ta, j as na, C as oa, W as oi, X as si, Y as ai, Z as ii, T as Eo, P as cs, U as li } from "./theme-C-zoknmI.js";
import { T as It, O as sa } from "./Text-Cehu0nom.js";
import { P as ha } from "./tweakpane-BXg6ZhiP.js";
import { e as ri } from "./styles-CqEyA8nI.js";
class ma {
  constructor(y, v = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(y, v);
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
  setColorMap(y, v = 32) {
    this.map = ds[y] || ds.rainbow, this.n = v;
    const b = 1 / this.n, S = new nn(), z = new nn();
    this.lut.length = 0, this.lut.push(new nn(this.map[0][1]));
    for (let A = 1; A < v; A++) {
      const E = A * b;
      for (let C = 0; C < this.map.length - 1; C++) if (E > this.map[C][0] && E <= this.map[C + 1][0]) {
        const L = this.map[C][0], N = this.map[C + 1][0];
        S.setHex(this.map[C][1], Fo), z.setHex(this.map[C + 1][1], Fo);
        const B = new nn().lerpColors(S, z, (E - L) / (N - L));
        this.lut.push(B);
      }
    }
    return this.lut.push(new nn(this.map[this.map.length - 1][1])), this;
  }
  copy(y) {
    return this.lut = y.lut, this.map = y.map, this.n = y.n, this.minV = y.minV, this.maxV = y.maxV, this;
  }
  getColor(y) {
    y = Ga.clamp(y, this.minV, this.maxV), y = (y - this.minV) / (this.maxV - this.minV);
    const v = Math.round(y * this.n);
    return this.lut[v];
  }
  addColorMap(y, v) {
    return ds[y] = v, this;
  }
  createCanvas() {
    const y = document.createElement("canvas");
    return y.width = 1, y.height = this.n, this.updateCanvas(y), y;
  }
  updateCanvas(y) {
    const v = y.getContext("2d", { alpha: false }), b = v.getImageData(0, 0, 1, this.n), S = b.data;
    let z = 0;
    const A = 1 / this.n, E = new nn(), C = new nn(), L = new nn();
    for (let N = 1; N >= 0; N -= A) for (let B = this.map.length - 1; B >= 0; B--) if (N < this.map[B][0] && N >= this.map[B - 1][0]) {
      const ne = this.map[B - 1][0], pe = this.map[B][0];
      E.setHex(this.map[B - 1][1], Fo), C.setHex(this.map[B][1], Fo), L.lerpColors(E, C, (N - ne) / (pe - ne)), S[z * 4] = Math.round(L.r * 255), S[z * 4 + 1] = Math.round(L.g * 255), S[z * 4 + 2] = Math.round(L.b * 255), S[z * 4 + 3] = 255, z += 1;
    }
    return v.putImageData(b, 0, 0), y;
  }
}
const ds = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, wa = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], ci = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: wa, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Bo = ce.state("safe"), ya = ce.state("auto");
function xa(t) {
  t = Math.max(0, Math.min(1, t));
  const y = ci[Bo.val] ?? wa;
  for (let b = 0; b < y.length - 1; b++) {
    const [S, z, A, E] = y[b], [C, L, N, B] = y[b + 1];
    if (t <= C) {
      const ne = (t - S) / (C - S);
      return [z + (L - z) * ne, A + (N - A) * ne, E + (B - E) * ne];
    }
  }
  const v = y[y.length - 1];
  return [v[1], v[2], v[3]];
}
function aa() {
  const y = new Uint8Array(1024);
  for (let b = 0; b < 256; b++) {
    const S = b / 255, [z, A, E] = xa(S);
    y[b * 4 + 0] = z, y[b * 4 + 1] = A, y[b * 4 + 2] = E, y[b * 4 + 3] = 255;
  }
  const v = new Ja(y, 256, 1, Qa);
  return v.minFilter = Qs, v.magFilter = Qs, v.wrapS = Os, v.wrapT = Os, v.needsUpdate = true, v;
}
function di() {
  const y = [];
  for (let v = 0; v <= 12; v++) {
    const b = 1 - v / 12, [S, z, A] = xa(b);
    y.push(`rgb(${S | 0},${z | 0},${A | 0}) ${(v / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${y.join(",")})`;
}
function ys(t) {
  if (!t.length) return [0, 1];
  const y = [...t].sort((z, A) => z - A), v = (z) => y[Math.min(y.length - 1, Math.max(0, Math.round(z * (y.length - 1))))];
  let b = y.length >= 20 ? v(0.01) : y[0], S = y.length >= 20 ? v(0.99) : y[y.length - 1];
  return b >= 0 && S > 0 && (b = 0), S <= 0 && b < 0 && (S = 0), [b, S];
}
function ui(t, y, v) {
  new ma();
  const b = aa(), S = new Wa({ uniforms: { cmap: { value: b }, ambient: { value: 0.95 } }, vertexShader: `
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
  ce.derive(() => {
    var _a;
    Bo.val;
    const A = S.uniforms.cmap.value;
    S.uniforms.cmap.value = aa(), (_a = A == null ? void 0 : A.dispose) == null ? void 0 : _a.call(A);
  });
  const z = new lt(new Ee(), S);
  return z.renderOrder = -1, z.frustumCulled = false, z.userData.isShellArea = true, z.name = "__hekatan_shell_colormap", ce.derive(() => {
    z.geometry.setAttribute("position", new $t(t.val.flat(), 3));
    const A = [], E = [], C = [];
    y.val.forEach((Z, re) => {
      Z.length === 3 ? (A.push(Z[0], Z[1], Z[2]), E.push(re), C.push(0)) : Z.length === 4 && (A.push(Z[0], Z[1], Z[2]), A.push(Z[0], Z[2], Z[3]), E.push(re, re), C.push(0, 1));
    }), z.geometry.setIndex(new Ha(A, 1)), z.userData.faceToElem = E, z.userData.faceLocal = C;
    const L = v.val.filter((Z) => Number.isFinite(Z));
    let N, B;
    const ne = ro.val;
    if (ne ? (B = ne[0], N = ne[1]) : [B, N] = ys(L), N === B) {
      const Z = Math.max(Math.abs(N) * 1e-6, 1e-9);
      N += Z, B -= Z;
    }
    const pe = ne && ne[0] > ne[1], we = Math.min(B, N), j = Math.max(B, N), U = j - we, de = new Float32Array(v.val.length);
    for (let Z = 0; Z < v.val.length; Z++) {
      const re = v.val[Z];
      if (!Number.isFinite(re)) {
        de[Z] = -1;
        continue;
      }
      const se = ((pe ? j + we - re : re) - we) / U;
      de[Z] = Math.max(0, Math.min(1, se));
    }
    z.geometry.setAttribute("scalar", new ft(de, 1));
  }), z;
}
function pi(t, y, v) {
  const b = document.createElement("div"), S = new ha({ title: "Settings", expanded: true, container: b });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(S), b.setAttribute("id", "settings");
  const z = "hk_settingsPos";
  let A = null;
  try {
    const pe = localStorage.getItem(z);
    pe && (A = JSON.parse(pe));
  } catch {
  }
  b.style.cssText = ["position:fixed", A ? `left:${A.left}px` : "left:8px", A ? `top:${A.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const E = () => {
    const pe = b.querySelector(".tp-rotv_b");
    if (!pe) {
      setTimeout(E, 200);
      return;
    }
    pe.style.cursor = "move", pe.style.userSelect = "none";
    let we = false, j = 0, U = 0, de = 0, Z = 0;
    pe.addEventListener("mousedown", (re) => {
      we = true, j = re.clientX, U = re.clientY;
      const ae = b.getBoundingClientRect();
      de = ae.left, Z = ae.top, b.style.left = `${de}px`, b.style.top = `${Z}px`;
    }), window.addEventListener("mousemove", (re) => {
      if (!we) return;
      const ae = re.clientX - j, se = re.clientY - U, J = Math.max(0, Math.min(window.innerWidth - 40, de + ae)), H = Math.max(0, Math.min(window.innerHeight - 40, Z + se));
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
  if (E(), y == null ? void 0 : y.nodes) {
    S.addBinding(t.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const pe = S.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    pe.addBinding(t.gridVisible, "val", { label: "Mostrar la rejilla" }), pe.addBinding(t.gridXY, "val", { label: "Plano XY (planta)" }), pe.addBinding(t.gridXZ, "val", { label: "Plano XZ (frontal)" }), pe.addBinding(t.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const we = pe.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    we.addBinding(t.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), we.addBinding(t.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), we.addBinding(t.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), we.addBinding(t.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const j = S.addFolder({ title: "\u{1F441} Ver", expanded: false });
    j.addBinding(t.nodes, "val", { label: "Nodes" }), j.addBinding(t.elements, "val", { label: "Elements" }), j.addBinding(t.edges, "val", { label: "  Edges (delim.)" }), j.addBinding(t.faces, "val", { label: "  Caras (fill)" }), j.addBinding(t.elemFrames, "val", { label: "  Frames (todos)" }), j.addBinding(t.elemColumns, "val", { label: "    Columnas" }), j.addBinding(t.elemBeams, "val", { label: "    Vigas" }), j.addBinding(t.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), j.addBinding(t.elemLosas, "val", { label: "  Losas (shells z>0)" }), j.addBinding(t.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), j.addBinding(t.nodesIndexes, "val", { label: "Nodes indexes" }), j.addBinding(t.elementsIndexes, "val", { label: "Elements indexes" }), j.addBinding(t.orientations, "val", { label: "Orientations" }), j.addBinding(t.sections, "val", { label: "Sections" }), j.addBinding(t.extruded, "val", { label: "Extruido (3D)" }), j.addBinding(t.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), j.addBinding(t.secColumns, "val", { label: "  Sec. Columnas" }), j.addBinding(t.secBeams, "val", { label: "  Sec. Vigas" }), j.addBinding(t.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((y == null ? void 0 : y.nodeInputs) || (y == null ? void 0 : y.elementInputs)) {
    const pe = S.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    pe.addBinding(t.supports, "val", { label: "Supports" }), pe.addBinding(t.loads, "val", { label: "Loads" }), pe.addBinding(t.custom3D, "val", { label: "Resortes (Winkler)" }), pe.addBinding(t.showCotas, "val", { label: "Cotas" });
  }
  if ((y == null ? void 0 : y.deformOutputs) || (y == null ? void 0 : y.analyzeOutputs)) {
    const pe = S.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = pe, pe.addBinding(t.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), pe.addBinding(t.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), pe.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagrama2D) == null ? void 0 : _a.call(window);
    }), pe.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a;
      (_a = window.__hekatanDiagramaBarra) == null ? void 0 : _a.call(window);
    }), pe.addBinding(t.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), pe.addBinding(Bo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), pe.addBinding(ya, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), pe.addBinding(t.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), pe.addBinding(t.deformedShape, "val", { label: "Deformed shape" }), pe.addBinding(t.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), pe.addBinding(t.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  v && S.addBinding(t.solids, "val", { label: "Solids" });
  const C = S.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), L = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), N = () => {
    const pe = window.__hekatanClipApply;
    typeof pe == "function" && pe();
  };
  let B = [];
  const ne = (pe, we) => {
    for (const U of B) try {
      U.dispose();
    } catch {
    }
    B = [];
    const j = (U, de) => {
      const Z = Math.floor(Math.min(pe[de], -50)), re = Math.ceil(Math.max(we[de], 50)), ae = re - Z > 400 ? 0.5 : 0.1;
      return L["pos" + U] = Math.max(Z, Math.min(re, L["pos" + U])), C.addBinding(L, "pos" + U, { min: Z, max: re, step: ae, label: `  pos ${U} (m)` }).on("change", N);
    };
    B.push(C.addBinding(L, "enableX", { label: "Cortar X" }).on("change", N), j("X", 0), C.addBinding(L, "invertX", { label: "  invertir X" }).on("change", N), C.addBinding(L, "enableY", { label: "Cortar Y" }).on("change", N), j("Y", 1), C.addBinding(L, "invertY", { label: "  invertir Y" }).on("change", N), C.addBinding(L, "enableZ", { label: "Cortar Z" }).on("change", N), j("Z", 2), C.addBinding(L, "invertZ", { label: "  invertir Z" }).on("change", N));
  };
  return ne([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (pe, we) => {
    ne(pe, we);
  }, b;
}
function fi(t) {
  return { gridSize: ce.state((t == null ? void 0 : t.gridSize) ?? 30), gridVisible: ce.state((t == null ? void 0 : t.gridVisible) ?? true), gridOpacity: ce.state((t == null ? void 0 : t.gridOpacity) ?? 1), gridStep: ce.state((t == null ? void 0 : t.gridStep) ?? 1), gridMajor: ce.state((t == null ? void 0 : t.gridMajor) ?? 5), cursorSnap: ce.state((t == null ? void 0 : t.cursorSnap) ?? 0.5), gridXY: ce.state((t == null ? void 0 : t.gridXY) ?? true), gridXZ: ce.state((t == null ? void 0 : t.gridXZ) ?? false), gridYZ: ce.state((t == null ? void 0 : t.gridYZ) ?? false), displayScale: ce.state((t == null ? void 0 : t.displayScale) ?? 1), nodes: ce.state((t == null ? void 0 : t.nodes) ?? true), elements: ce.state((t == null ? void 0 : t.elements) ?? true), edges: ce.state((t == null ? void 0 : t.edges) ?? true), faces: ce.state((t == null ? void 0 : t.faces) ?? true), elemColumns: ce.state((t == null ? void 0 : t.elemColumns) ?? true), elemBeams: ce.state((t == null ? void 0 : t.elemBeams) ?? true), elemFrames: ce.state((t == null ? void 0 : t.elemFrames) ?? true), elemZapatas: ce.state((t == null ? void 0 : t.elemZapatas) ?? true), elemLosas: ce.state((t == null ? void 0 : t.elemLosas) ?? true), colorByType: ce.state((t == null ? void 0 : t.colorByType) ?? false), nodesIndexes: ce.state((t == null ? void 0 : t.nodesIndexes) ?? false), elementsIndexes: ce.state((t == null ? void 0 : t.elementsIndexes) ?? false), orientations: ce.state((t == null ? void 0 : t.orientations) ?? false), sections: ce.state((t == null ? void 0 : t.sections) ?? true), extruded: ce.state((t == null ? void 0 : t.extruded) ?? false), sectionLabels: ce.state((t == null ? void 0 : t.sectionLabels) ?? true), secColumns: ce.state((t == null ? void 0 : t.secColumns) ?? true), secBeams: ce.state((t == null ? void 0 : t.secBeams) ?? true), secFloor: ce.state((t == null ? void 0 : t.secFloor) ?? -1), supports: ce.state((t == null ? void 0 : t.supports) ?? true), loads: ce.state((t == null ? void 0 : t.loads) ?? false), deformedShape: ce.state((t == null ? void 0 : t.deformedShape) ?? false), nodeResults: ce.state((t == null ? void 0 : t.nodeResults) ?? "none"), frameResults: ce.state((t == null ? void 0 : t.frameResults) ?? "none"), shellResults: ce.state((t == null ? void 0 : t.shellResults) ?? "none"), solidResults: ce.state((t == null ? void 0 : t.solidResults) ?? "none"), flipAxes: ce.state((t == null ? void 0 : t.flipAxes) ?? false), solids: ce.state((t == null ? void 0 : t.solids) ?? true), custom3D: ce.state((t == null ? void 0 : t.custom3D) ?? true), showCotas: ce.state((t == null ? void 0 : t.showCotas) ?? true), deformScale: ce.state((t == null ? void 0 : t.deformScale) ?? 1), deformScaleZ: ce.state((t == null ? void 0 : t.deformScaleZ) ?? 1) };
}
function hi(t, y, v) {
  const b = Tn(), S = new Io(new Ee(), new Lo({ color: b.nodePoint }));
  return ua((z, A) => {
    S.material.color.setHex(A.nodePoint);
  }), S.frustumCulled = false, ce.derive(() => {
    t.nodes.val && S.geometry.setAttribute("position", new $t(y.val.flat(), 3));
  }), ce.derive(() => {
    if (v.val, y.val, !t.nodes.rawVal) return;
    const z = y.rawVal ?? [];
    let A = t.gridSize.val * 0.5;
    if (z.length >= 2) {
      const C = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
      for (const N of z) for (let B = 0; B < 3; B++) C[B] = Math.min(C[B], N[B]), L[B] = Math.max(L[B], N[B]);
      A = Math.max(L[0] - C[0], L[1] - C[1], L[2] - C[2], 0.1);
    }
    const E = 0.03 * A;
    S.material.size = E * v.rawVal;
  }), ce.derive(() => {
    S.visible = t.nodes.val;
  }), S;
}
function us(t, y) {
  const v = Tn(), b = new rt();
  b.name = "hekatan-grid";
  const S = (y == null ? void 0 : y.planes) ?? ["xy"];
  let z = (y == null ? void 0 : y.majorStep) ?? 1, A = (y == null ? void 0 : y.minorStep) ?? 0.1;
  for (z <= 0 && (z = 1), A <= 0 && (A = 0.1); t / A > 500; ) A *= 2;
  for (; t / z > 100; ) z *= 2;
  const E = t / 2;
  z = Math.max(A, Math.round(z / A) * A);
  const L = new nn(v.grid).multiplyScalar(1.3), N = new nn(v.grid).multiplyScalar(0.8), B = (j, U, de, Z) => {
    const re = [], ae = j === "xy" ? (X, K) => [X, K, 0] : j === "xz" ? (X, K) => [X, 0, K] : (X, K) => [0, X, K], se = Math.floor(E / U);
    for (let X = -se; X <= se; X++) {
      const K = X * U, q = ae(K, -E), R = ae(K, E);
      re.push(...q, ...R);
    }
    for (let X = -se; X <= se; X++) {
      const K = X * U, q = ae(-E, K), R = ae(E, K);
      re.push(...q, ...R);
    }
    const J = new Ee();
    J.setAttribute("position", new $t(re, 3));
    const H = new ct({ color: de, transparent: true, opacity: Z, depthWrite: false }), W = new Ht(J, H);
    return W.name = `grid-${j}-${U === A ? "minor" : "major"}`, W;
  }, ne = (j, U, de) => {
    const Z = j === "xy" ? (W, X) => [W, X, 0] : j === "xz" ? (W, X) => [W, 0, X] : (W, X) => [0, W, X], re = [[-E, -E], [E, -E], [E, E], [-E, E]], ae = [];
    for (const [W, X] of re) ae.push(...Z(W, X));
    const se = new Ee();
    se.setAttribute("position", new $t(ae, 3));
    const J = new ct({ color: U, transparent: true, opacity: de, depthWrite: false }), H = new pa(se, J);
    return H.name = `grid-${j}-border`, H.renderOrder = 1, H;
  }, pe = (j, U, de) => {
    const Z = j === "xy" ? (J, H) => [J, H, 0] : j === "xz" ? (J, H) => [J, 0, H] : (J, H) => [0, J, H], re = U === "u" ? [...Z(-E, 0), ...Z(E, 0)] : [...Z(0, -E), ...Z(0, E)], ae = new Ee();
    ae.setAttribute("position", new $t(re, 3));
    const se = new Ht(ae, new ct({ color: de, transparent: true, opacity: 0.45, depthWrite: false }));
    return se.name = `grid-${j}-eje-${U}`, se.renderOrder = 1, se;
  }, we = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const j of S) {
    b.add(B(j, A, N, 0.12)), b.add(B(j, z, L, 0.4));
    const [U, de] = we[j];
    b.add(pe(j, "u", U)), b.add(pe(j, "v", de)), b.add(ne(j, L, 0.55));
  }
  return b.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: z, minorStep: A, gridSize: t, planes: [...S] }, b;
}
function mi(t, y, v, b) {
  const S = new rt(), z = new Oa(0.5, 0.5, 0.5), A = new ja(0.45, 0.7, 4);
  A.rotateX(Math.PI / 2), A.translate(0, 0, -0.35);
  const E = new pt({ color: 10166822 }), C = new pt({ color: 2792847 }), L = new pt({ color: 3835647 }), N = () => {
    const pe = v.rawVal ?? [];
    if (pe.length < 2) return y.gridSize.val * 0.5;
    let we = [1 / 0, 1 / 0, 1 / 0], j = [-1 / 0, -1 / 0, -1 / 0];
    for (const U of pe) for (let de = 0; de < 3; de++) U[de] < we[de] && (we[de] = U[de]), U[de] > j[de] && (j[de] = U[de]);
    return Math.max(j[0] - we[0], j[1] - we[1], j[2] - we[2], 0.1);
  }, B = () => 0.08 * N(), ne = () => b.rawVal;
  return ce.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, !y.supports.val) return;
    S.clear();
    const pe = B();
    (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val.supports) == null ? void 0 : _b.forEach((we, j) => {
      const U = v.val[j];
      if (!U) return;
      const de = we ?? [], Z = (de[0] ? 1 : 0) + (de[1] ? 1 : 0) + (de[2] ? 1 : 0), re = (de[3] ? 1 : 0) + (de[4] ? 1 : 0) + (de[5] ? 1 : 0);
      let ae;
      Z >= 3 && re >= 3 ? ae = new lt(z, E) : Z >= 3 && re === 0 ? ae = new lt(A, C) : ae = new lt(A, L), ae.position.set(U[0], U[1], U[2]);
      const se = pe * ne();
      ae.scale.set(se, se, se), S.add(ae);
    });
  }), ce.derive(() => {
    if (b.val, !y.supports.rawVal) return;
    const we = B() * ne();
    S.children.forEach((j) => j.scale.set(we, we, we));
  }), ce.derive(() => {
    S.visible = y.supports.val;
  }), S;
}
function wi(t, y, v, b) {
  const S = new rt();
  S.name = "loadsGroup";
  function z(E) {
    if (E.length < 2) return 0.12 * y.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of E) for (let ne = 0; ne < 3; ne++) C[ne] = Math.min(C[ne], B[ne]), L[ne] = Math.max(L[ne], B[ne]);
    return 0.08 * Math.max(L[0] - C[0], L[1] - C[1], L[2] - C[2], 0.1);
  }
  ce.derive(() => {
    var _a, _b, _c;
    if (y.deformedShape.val, !y.loads.val) return;
    S.children.forEach((j) => {
      var _a2;
      return (_a2 = j.dispose) == null ? void 0 : _a2.call(j);
    }), S.clear();
    const E = v.val, C = z(E), L = 240, N = [];
    (_c = (_b = (_a = t.nodeInputs) == null ? void 0 : _a.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((j, U) => {
      E[U] && j.slice(0, 3).some((de) => Math.abs(de) > 1e-15) && N.push(U);
    });
    let B = N;
    if (N.length > L) {
      const j = N.map((R) => E[R][0]), U = N.map((R) => E[R][1]), de = Math.min(...j), Z = Math.max(...j), re = Math.min(...U), ae = Math.max(...U), se = N.map((R) => E[R][2]), J = Math.max(1e-6, (Math.max(...se) - Math.min(...se)) / 40), H = (R) => Math.round(R / J), W = new Set(se.map(H)), X = Math.max(4, Math.floor(L / Math.max(1, W.size))), K = Math.max(2, Math.round(Math.sqrt(X))), q = /* @__PURE__ */ new Map();
      for (const R of N) {
        const O = Z - de < 1e-9 ? 0 : (E[R][0] - de) / (Z - de), fe = ae - re < 1e-9 ? 0 : (E[R][1] - re) / (ae - re), ye = Math.min(K - 1, Math.floor(O * K)), be = Math.min(K - 1, Math.floor(fe * K)), G = `${ye},${be},${H(E[R][2])}`, _e = Math.hypot(O * K - (ye + 0.5), fe * K - (be + 0.5)), ue = q.get(G);
        (!ue || _e < ue.d) && q.set(G, { i: R, d: _e });
      }
      B = [...q.values()].map((R) => R.i);
    }
    let ne = 0;
    for (const j of B) {
      const U = t.nodeInputs.val.loads.get(j);
      for (let de = 0; de < 3; de++) ne = Math.max(ne, Math.abs(U[de]));
    }
    const pe = B.length <= 60, we = (j) => {
      const U = Math.abs(j);
      return U >= 100 ? j.toFixed(0) : U >= 10 ? j.toFixed(1) : j.toFixed(2);
    };
    for (const j of B) {
      const U = t.nodeInputs.val.loads.get(j), de = E[j];
      if (de) for (let Z = 0; Z < 3; Z++) {
        const re = U[Z];
        if (!(Math.abs(re) > 1e-9 * (ne || 1))) continue;
        const ae = new V(Z === 0 ? Math.sign(re) : 0, Z === 1 ? Math.sign(re) : 0, Z === 2 ? Math.sign(re) : 0), se = 0.45 + 0.55 * (ne ? Math.abs(re) / ne : 1), J = new Ln(ae, new V(...de), 1, Z === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (J.userData = { nudo: de, dir: ae, rel: se }, S.add(J), pe) {
          const H = new It(we(re), Z === 2 ? "#f5b642" : "#ff6b5e");
          H.userData = { nudo: de, dir: ae, rel: se, texto: true }, S.add(H);
        }
      }
    }
    A(C * b.rawVal);
  });
  function A(E) {
    S.children.forEach((C) => {
      const L = C.userData;
      if (!(L == null ? void 0 : L.dir)) return;
      const N = E * L.rel, B = new V(...L.nudo).addScaledVector(L.dir, -N * (L.texto ? 1.12 : 1));
      C.position.copy(B), L.texto ? C.updateScale(E * 0.38) : C.scale.set(N, N, N);
    });
  }
  return ce.derive(() => {
    b.val, y.loads.rawVal && A(z(v.rawVal) * b.rawVal);
  }), ce.derive(() => {
    S.visible = y.loads.val;
  }), S;
}
function yi(t, y, v) {
  const b = new rt();
  return ce.derive(() => {
    if (!t.nodesIndexes.val) return;
    b.children.forEach((z) => z.dispose()), b.clear();
    const S = 0.05 * t.gridSize.val * 0.6;
    y.val.forEach((z, A) => {
      const E = new It(`${A}`);
      E.position.set(...z), E.updateScale(S * v.rawVal), b.add(E);
    });
  }), ce.derive(() => {
    if (v.val, !t.nodesIndexes.rawVal) return;
    const S = 0.05 * t.gridSize.val * 0.6;
    b.children.forEach((z) => z.updateScale(S * v.rawVal));
  }), ce.derive(() => {
    b.visible = t.nodesIndexes.val;
  }), b;
}
function xi(t, y, v, b) {
  const S = new rt();
  return ce.derive(() => {
    var _a;
    if (y.deformedShape.val, !y.elementsIndexes.val) return;
    S.children.forEach((A) => A.dispose()), S.clear();
    const z = 0.05 * y.gridSize.val * 0.6;
    (_a = t.elements) == null ? void 0 : _a.val.forEach((A, E) => {
      const C = new It(`${E}`, void 0, "#001219");
      C.position.set(...gi(A.map((L) => v.rawVal[L]))), C.updateScale(z * b.rawVal), S.add(C);
    });
  }), ce.derive(() => {
    if (b.val, !y.elementsIndexes.rawVal) return;
    const z = 0.05 * y.gridSize.val * 0.6;
    S.children.forEach((A) => A.updateScale(z * b.rawVal));
  }), ce.derive(() => {
    S.visible = y.elementsIndexes.val;
  }), S;
}
function gi(t) {
  const y = t.reduce((b, S) => [b[0] + S[0], b[1] + S[1], b[2] + S[2]], [0, 0, 0]), v = t.length;
  return [y[0] / v, y[1] / v, y[2] / v];
}
function ia(t, y) {
  const v = new rt(), b = Math.min(0.05 * t, 0.6), S = Tn(), z = new It("X", "red", "transparent"), A = new It(y ? "Z" : "Y", "green", "transparent"), E = new It(y ? "Y" : "Z", "blue", "transparent"), C = new Ln(new V(1, 0, 0), new V(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), L = new Ln(new V(0, 1, 0), new V(0, 0, 0), 1, S.axisArrow, 0.2, 0.2), N = new Ln(new V(0, 0, 1), new V(0, 0, 0), 1, S.axisArrow, 0.2, 0.2);
  return z.position.set(1.3 * b, 0, 0), A.position.set(0, 1.3 * b, 0), E.position.set(0, 0, 1.3 * b), z.updateScale(0.4 * b), A.updateScale(0.4 * b), E.updateScale(0.4 * b), C.scale.set(b, b, b), L.scale.set(b, b, b), N.scale.set(b, b, b), v.add(C, L, N, z, A, E), v;
}
function xs(t, y) {
  const v = new V(...t), S = new V(...y).clone().sub(v), z = S.length(), A = S.dot(new V(1, 0, 0)) / z, E = S.dot(new V(0, 1, 0)) / z, C = S.dot(new V(0, 0, 1)) / z, L = Math.sqrt(A ** 2 + E ** 2);
  let N = new as().fromArray([[A, E, C], [-E / L, A / L, 0], [-A * C / L, -E * C / L, L]].flat());
  return C === 1 && (N = new as().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), C === -1 && (N = new as().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Do().setFromMatrix3(N);
}
function hs(t, y) {
  return t == null ? void 0 : t.map((v, b) => (9 * v + y[b]) / 10);
}
function lo(t) {
  const y = t.reduce((b, S) => [b[0] + S[0], b[1] + S[1], b[2] + S[2]], [0, 0, 0]), v = t.length;
  return [y[0] / v, y[1] / v, y[2] / v];
}
function vi(t, y, v) {
  const b = lo([y, v]), S = lo([t, v]), z = lo([t, y]), A = new V(...b).sub(new V(...S)).normalize(), E = new V(...v).sub(new V(...z)).normalize(), C = A.clone().cross(E).normalize(), L = C.clone().cross(A).normalize();
  return new Do().makeBasis(A, L, C);
}
function Mi(t, y, v, b) {
  const S = new rt(), z = new Ee(), A = new ct({ vertexColors: true }), E = [0, 0, 0], C = [1, 0, 0], L = [0, 1, 0], N = [0, 0, 1];
  z.setAttribute("position", new $t([...E, ...C, ...E, ...L, ...E, ...N], 3));
  const B = [255, 0, 0], ne = [0, 255, 0], pe = [0, 0, 255];
  return z.setAttribute("color", new $t([...B, ...B, ...ne, ...ne, ...pe, ...pe], 3)), ce.derive(() => {
    var _a;
    y.deformedShape.val, y.orientations.val && (S.clear(), (_a = t.elements) == null ? void 0 : _a.val.forEach((we) => {
      const j = new Ht(z, A), U = v.rawVal[we[0]], de = v.rawVal[we[1]];
      if (we.length === 2 && (j.position.set(...hs(U, de)), j.rotation.setFromRotationMatrix(xs(U, de))), we.length === 3) {
        const ae = v.rawVal[we[2]];
        j.position.set(...lo([U, de, ae])), j.rotation.setFromRotationMatrix(vi(U, de, ae));
      }
      const re = 0.05 * y.gridSize.rawVal * 0.75 * b.rawVal;
      j.scale.set(re, re, re), S.add(j);
    }));
  }), ce.derive(() => {
    if (b.val, !y.orientations.rawVal) return;
    const j = 0.05 * y.gridSize.val * 0.75 * b.rawVal;
    S.children.forEach((U) => U.scale.set(j, j, j));
  }), ce.derive(() => {
    S.visible = y.orientations.val;
  }), S;
}
function bi(t) {
  if (t.name) return t.name;
  if (t.type === "rect") {
    const y = (t.b * 100).toFixed(0), v = (t.h * 100).toFixed(0);
    return `${y}x${v}`;
  }
  return t.type === "circ" ? `D${(t.d * 100).toFixed(0)}` : "";
}
function _i(t, y, v, b) {
  const S = new rt(), z = new rt();
  S.add(z);
  function A(J, H) {
    const W = J / 2, X = H / 2, K = new Float32Array([0, -W, -X, 0, W, -X, 0, W, X, 0, -W, -X, 0, W, X, 0, -W, X]), q = new Ee();
    q.setAttribute("position", new ft(K, 3));
    const R = new Float32Array([0, -W, -X, 0, W, -X, 0, W, X, 0, -W, X, 0, -W, -X]), O = new Ee();
    return O.setAttribute("position", new ft(R, 3)), { fill: q, outline: O };
  }
  function E(J, H = 24) {
    const W = J / 2, X = new Float32Array(H * 9);
    for (let O = 0; O < H; O++) {
      const fe = O / H * Math.PI * 2, ye = (O + 1) / H * Math.PI * 2;
      X[O * 9] = 0, X[O * 9 + 1] = 0, X[O * 9 + 2] = 0, X[O * 9 + 3] = 0, X[O * 9 + 4] = W * Math.cos(fe), X[O * 9 + 5] = W * Math.sin(fe), X[O * 9 + 6] = 0, X[O * 9 + 7] = W * Math.cos(ye), X[O * 9 + 8] = W * Math.sin(ye);
    }
    const K = new Ee();
    K.setAttribute("position", new ft(X, 3));
    const q = new Float32Array((H + 1) * 3);
    for (let O = 0; O <= H; O++) {
      const fe = O / H * Math.PI * 2;
      q[O * 3] = 0, q[O * 3 + 1] = W * Math.cos(fe), q[O * 3 + 2] = W * Math.sin(fe);
    }
    const R = new Ee();
    return R.setAttribute("position", new ft(q, 3)), { fill: K, outline: R };
  }
  function C(J, H, W, X) {
    const K = W ?? H * 0.08, q = X ?? J * 0.07, R = J / 2, O = H / 2, fe = O - K, ye = q / 2, be = [];
    function G(he, Ie, ve, qe) {
      be.push(0, he, Ie, 0, ve, Ie, 0, ve, qe, 0, he, Ie, 0, ve, qe, 0, he, qe);
    }
    G(-R, -O, R, -fe), G(-ye, -fe, ye, fe), G(-R, fe, R, O);
    const _e = new Ee();
    _e.setAttribute("position", new ft(new Float32Array(be), 3));
    const ue = new Float32Array([0, -R, -O, 0, R, -O, 0, R, -fe, 0, ye, -fe, 0, ye, fe, 0, R, fe, 0, R, O, 0, -R, O, 0, -R, fe, 0, -ye, fe, 0, -ye, -fe, 0, -R, -fe, 0, -R, -O]), Ve = new Ee();
    return Ve.setAttribute("position", new ft(ue, 3)), { fill: _e, outline: Ve };
  }
  function L(J, H, W) {
    const X = J / 2, K = H / 2, q = X - W, R = K - W, O = [];
    function fe(_e, ue, Ve, he) {
      O.push(0, _e, ue, 0, Ve, ue, 0, Ve, he, 0, _e, ue, 0, Ve, he, 0, _e, he);
    }
    fe(-X, -K, X, -R), fe(-X, R, X, K), fe(-X, -R, -q, R), fe(q, -R, X, R);
    const ye = new Ee();
    ye.setAttribute("position", new ft(new Float32Array(O), 3));
    const be = new Float32Array([0, -X, -K, 0, X, -K, 0, X, -K, 0, X, K, 0, X, K, 0, -X, K, 0, -X, K, 0, -X, -K, 0, -q, -R, 0, q, -R, 0, q, -R, 0, q, R, 0, q, R, 0, -q, R, 0, -q, R, 0, -q, -R]), G = new Ee();
    return G.setAttribute("position", new ft(be, 3)), { fill: ye, outline: G };
  }
  function N(J, H, W) {
    const X = J / 2, K = H / 2, q = X - W, R = K - W, O = new Ee(), fe = new Float32Array([0, -q, -R, 0, q, -R, 0, q, R, 0, -q, -R, 0, q, R, 0, -q, R]);
    O.setAttribute("position", new ft(fe, 3));
    const ye = [];
    function be(Ve, he, Ie, ve) {
      ye.push(0, Ve, he, 0, Ie, he, 0, Ie, ve, 0, Ve, he, 0, Ie, ve, 0, Ve, ve);
    }
    be(-X, -K, X, -R), be(-X, R, X, K), be(-X, -R, -q, R), be(q, -R, X, R);
    const G = new Ee();
    G.setAttribute("position", new ft(new Float32Array(ye), 3));
    const _e = new Float32Array([0, -X, -K, 0, X, -K, 0, X, -K, 0, X, K, 0, X, K, 0, -X, K, 0, -X, K, 0, -X, -K, 0, -q, -R, 0, q, -R, 0, q, -R, 0, q, R, 0, q, R, 0, -q, R, 0, -q, R, 0, -q, -R]), ue = new Ee();
    return ue.setAttribute("position", new ft(_e, 3)), { concFill: O, steelFillGeom: G, outline: ue };
  }
  function B(J, H, W) {
    const X = [], K = [[0, -J / 2, -H / 2], [0, -J / 2 + W, -H / 2], [0, -J / 2 + W, H / 2 - W], [0, J / 2, H / 2 - W], [0, J / 2, H / 2], [0, -J / 2, H / 2]], q = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ye of q) X.push(...K[ye]);
    const R = new Ee();
    R.setAttribute("position", new ft(new Float32Array(X), 3));
    const O = [];
    for (let ye = 0; ye < K.length; ye++) {
      const be = (ye + 1) % K.length;
      O.push(...K[ye], ...K[be]);
    }
    const fe = new Ee();
    return fe.setAttribute("position", new ft(new Float32Array(O), 3)), { fill: R, outline: fe };
  }
  function ne(J, H, W, X) {
    const K = X / 2, q = [], R = [[0, -J - K, -H / 2], [0, -W - K, -H / 2], [0, -W - K, H / 2 - W], [0, -K, H / 2 - W], [0, -K, H / 2], [0, -J - K, H / 2]], O = [[0, K, -H / 2], [0, K + W, -H / 2], [0, K + W, H / 2 - W], [0, J + K, H / 2 - W], [0, J + K, H / 2], [0, K, H / 2]], fe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const _e of fe) q.push(...R[_e]);
    for (const _e of fe) q.push(...O[_e]);
    const ye = new Ee();
    ye.setAttribute("position", new ft(new Float32Array(q), 3));
    const be = [];
    for (const _e of [R, O]) for (let ue = 0; ue < _e.length; ue++) {
      const Ve = (ue + 1) % _e.length;
      be.push(..._e[ue], ..._e[Ve]);
    }
    const G = new Ee();
    return G.setAttribute("position", new ft(new Float32Array(be), 3)), { fill: ye, outline: G };
  }
  function pe(J, H, W, X) {
    const K = H / 2, q = J, R = [[0, -q, -K], [0, -q, -K + W], [0, -X, -K + W], [0, -X, K - W], [0, -q, K - W], [0, -q, K], [0, 0, K], [0, 0, -K]], O = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], fe = [];
    for (const _e of O) fe.push(...R[_e]);
    const ye = new Ee();
    ye.setAttribute("position", new ft(new Float32Array(fe), 3));
    const be = [];
    for (let _e = 0; _e < R.length; _e++) {
      const ue = (_e + 1) % R.length;
      be.push(...R[_e], ...R[ue]);
    }
    const G = new Ee();
    return G.setAttribute("position", new ft(new Float32Array(be), 3)), { fill: ye, outline: G };
  }
  function we(J, H, W, X, K) {
    const q = H / 2, R = K / 2, O = [], fe = [[0, -J, -q], [0, -J, -q + W], [0, -R - X, -q + W], [0, -R - X, q - W], [0, -J, q - W], [0, -J, q], [0, -R, q], [0, -R, -q]], ye = fe.map((Ve) => [Ve[0], -Ve[1], Ve[2]]), be = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const Ve of be) O.push(...fe[Ve]);
    for (const Ve of be) O.push(...ye[Ve]);
    const G = new Ee();
    G.setAttribute("position", new ft(new Float32Array(O), 3));
    const _e = [];
    for (const Ve of [fe, ye]) for (let he = 0; he < Ve.length; he++) {
      const Ie = (he + 1) % Ve.length;
      _e.push(...Ve[he], ...Ve[Ie]);
    }
    const ue = new Ee();
    return ue.setAttribute("position", new ft(new Float32Array(_e), 3)), { fill: G, outline: ue };
  }
  function j(J, H, W, X) {
    const K = J / 2, q = H / 2, R = X / 2, O = [[0, -R, -q], [0, R, -q], [0, R, q - W], [0, K, q - W], [0, K, q], [0, -K, q], [0, -K, q - W], [0, -R, q - W]], fe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], ye = [];
    for (const ue of fe) ye.push(...O[ue]);
    const be = new Ee();
    be.setAttribute("position", new ft(new Float32Array(ye), 3));
    const G = [];
    for (let ue = 0; ue < O.length; ue++) {
      const Ve = (ue + 1) % O.length;
      G.push(...O[ue], ...O[Ve]);
    }
    const _e = new Ee();
    return _e.setAttribute("position", new ft(new Float32Array(G), 3)), { fill: be, outline: _e };
  }
  function U(J, H, W = 24) {
    const X = J / 2, K = X - H, q = [];
    for (let ye = 0; ye < W; ye++) {
      const be = ye / W * Math.PI * 2, G = (ye + 1) / W * Math.PI * 2, _e = Math.cos(be), ue = Math.sin(be), Ve = Math.cos(G), he = Math.sin(G);
      q.push(0, X * _e, X * ue, 0, X * Ve, X * he, 0, K * Ve, K * he), q.push(0, X * _e, X * ue, 0, K * Ve, K * he, 0, K * _e, K * ue);
    }
    const R = new Ee();
    R.setAttribute("position", new ft(new Float32Array(q), 3));
    const O = [];
    for (let ye = 0; ye < W; ye++) {
      const be = ye / W * Math.PI * 2, G = (ye + 1) / W * Math.PI * 2;
      O.push(0, X * Math.cos(be), X * Math.sin(be), 0, X * Math.cos(G), X * Math.sin(G)), O.push(0, K * Math.cos(be), K * Math.sin(be), 0, K * Math.cos(G), K * Math.sin(G));
    }
    const fe = new Ee();
    return fe.setAttribute("position", new ft(new Float32Array(O), 3)), { fill: R, outline: fe };
  }
  const de = new pt({ color: 52479, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }), Z = new ct({ color: 52479 }), re = new pt({ color: 16750848, transparent: true, opacity: 0.4, side: Vt, depthWrite: false }), ae = new ct({ color: 16750848 });
  function se(J, H) {
    const W = Math.abs(H[0] - J[0]), X = Math.abs(H[1] - J[1]), K = Math.abs(H[2] - J[2]);
    return K > W && K > X || X > W && X > K;
  }
  return ce.derive(() => {
    var _a, _b;
    y.deformedShape.val, y.secColumns.val, y.secBeams.val, y.secFloor.val;
    const J = y.secColumns.rawVal, H = y.secBeams.rawVal;
    if (!J && !H) {
      S.children.forEach((R) => {
        R instanceof It && R.dispose();
      }), S.clear();
      return;
    }
    S.children.forEach((R) => {
      R instanceof It && R.dispose();
    }), S.clear();
    const W = (_a = t.elements) == null ? void 0 : _a.val, X = (_b = t.elementInputs) == null ? void 0 : _b.val;
    if (!W || !X) return;
    const K = X.sectionShapes, q = y.secFloor.rawVal;
    W.forEach((R, O) => {
      if (R.length !== 2) return;
      const fe = v.rawVal[R[0]], ye = v.rawVal[R[1]];
      if (!fe || !ye) return;
      const be = se(fe, ye);
      if (be && !J || !be && !H) return;
      if (q >= 0) {
        const he = Math.min(fe[1], ye[1]);
        Math.max(fe[1], ye[1]);
        const Ie = y.gridSize.rawVal || 3;
        if (Math.floor(he / Ie + 0.01) !== q) return;
      }
      const G = K == null ? void 0 : K.get(O);
      if (!G) return;
      const _e = [(fe[0] + ye[0]) / 2, (fe[1] + ye[1]) / 2, (fe[2] + ye[2]) / 2], ue = xs(fe, ye);
      if (G.type === "CFT") {
        const he = N(G.b, G.h, G.tw ?? G.b * 0.05), Ie = new lt(he.concFill, de);
        Ie.position.set(..._e), Ie.rotation.setFromRotationMatrix(ue), S.add(Ie);
        const ve = new lt(he.steelFillGeom, re);
        ve.position.set(..._e), ve.rotation.setFromRotationMatrix(ue), S.add(ve);
        const qe = new Et(he.outline, ae);
        qe.position.set(..._e), qe.rotation.setFromRotationMatrix(ue), S.add(qe);
      } else {
        let he, Ie, ve;
        switch (G.type) {
          case "rect":
            he = A(G.b, G.h), Ie = de, ve = Z;
            break;
          case "circ":
            he = E(G.d), Ie = de, ve = Z;
            break;
          case "I":
            he = C(G.b, G.h, G.tf, G.tw), Ie = re, ve = ae;
            break;
          case "HSS":
            he = L(G.b, G.h, G.tw ?? G.b * 0.05), Ie = re, ve = ae;
            break;
          case "CFT":
            he = N(G.b, G.h, G.tw ?? G.b * 0.05), Ie = re, ve = ae;
            break;
          case "L":
            he = B(G.b ?? G.h, G.h, G.t ?? G.tw ?? 3e-3), Ie = re, ve = ae;
            break;
          case "2L":
            he = ne(G.b ?? G.h, G.h, G.t ?? G.tw ?? 3e-3, G.dis ?? 0.01), Ie = re, ve = ae;
            break;
          case "C":
          case "coldC":
            he = pe(G.b, G.h, G.tf ?? G.t ?? 3e-3, G.tw ?? G.t ?? 3e-3), Ie = re, ve = ae;
            break;
          case "2C":
            he = we(G.b, G.h, G.tf ?? 5e-3, G.tw ?? 5e-3, G.dis ?? 0.01), Ie = re, ve = ae;
            break;
          case "T":
            he = j(G.b, G.h, G.tf ?? 0.01, G.tw ?? 6e-3), Ie = re, ve = ae;
            break;
          case "pipe":
            he = U(G.d, G.tw ?? G.d * 0.05), Ie = re, ve = ae;
            break;
          default:
            return;
        }
        const qe = new lt(he.fill, Ie);
        qe.position.set(..._e), qe.rotation.setFromRotationMatrix(ue), S.add(qe);
        const Je = new Et(he.outline, ve);
        Je.position.set(..._e), Je.rotation.setFromRotationMatrix(ue), S.add(Je);
      }
      const Ve = bi(G);
      if (Ve) {
        const Ie = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(G.type) ? "#ff9900" : "#00ccff", ve = new It(Ve, Ie, "transparent");
        ve.position.set(_e[0], _e[1], _e[2]);
        const qe = 0.05 * y.gridSize.rawVal * 0.5;
        ve.updateScale(qe * ((b == null ? void 0 : b.rawVal) ?? 1)), z.add(ve);
      }
    });
  }), b && ce.derive(() => {
    if (b.val, !y.sections.rawVal) return;
    const J = 0.05 * y.gridSize.val * 0.5;
    z.children.forEach((H) => {
      H instanceof It && H.updateScale(J * b.rawVal);
    });
  }), ce.derive(() => {
    S.visible = y.sections.val;
  }), ce.derive(() => {
    z.visible = y.sectionLabels.val;
  }), S;
}
function ki(t) {
  if (!t) return null;
  const y = t.type, v = (N, B) => [N, B], b = (N, B) => [v(-N / 2, -B / 2), v(N / 2, -B / 2), v(N / 2, B / 2), v(-N / 2, B / 2)], S = (N, B = 24) => {
    const ne = N / 2, pe = [];
    for (let we = 0; we < B; we++) {
      const j = 2 * Math.PI * we / B;
      pe.push(v(ne * Math.cos(j), ne * Math.sin(j)));
    }
    return pe;
  }, z = t.b ?? 0, A = t.h ?? 0, E = t.d ?? 0, C = t.tw ?? t.t ?? 0, L = t.tf ?? t.t ?? 0;
  switch (y) {
    case "rect":
      return z && A ? { contorno: b(z, A) } : null;
    case "circ":
      return E ? { contorno: S(E) } : null;
    case "pipe":
      return E && C ? { contorno: S(E), huecos: [S(E - 2 * C).reverse()] } : null;
    case "HSS":
      return z && A && C ? { contorno: b(z, A), huecos: [b(z - 2 * C, A - 2 * (L || C)).reverse()] } : null;
    case "CFT":
      return z && A ? { contorno: b(z, A) } : null;
    case "I":
      return z && A && C && L ? { contorno: [v(-z / 2, -A / 2), v(z / 2, -A / 2), v(z / 2, -A / 2 + L), v(C / 2, -A / 2 + L), v(C / 2, A / 2 - L), v(z / 2, A / 2 - L), v(z / 2, A / 2), v(-z / 2, A / 2), v(-z / 2, A / 2 - L), v(-C / 2, A / 2 - L), v(-C / 2, -A / 2 + L), v(-z / 2, -A / 2 + L)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return z && A && C && L ? { contorno: [v(-z / 2, -A / 2), v(z / 2, -A / 2), v(z / 2, -A / 2 + L), v(-z / 2 + C, -A / 2 + L), v(-z / 2 + C, A / 2 - L), v(z / 2, A / 2 - L), v(z / 2, A / 2), v(-z / 2, A / 2)] } : null;
    case "T":
      return z && A && C && L ? { contorno: [v(-C / 2, -A / 2), v(C / 2, -A / 2), v(C / 2, A / 2 - L), v(z / 2, A / 2 - L), v(z / 2, A / 2), v(-z / 2, A / 2), v(-z / 2, A / 2 - L), v(-C / 2, A / 2 - L)] } : null;
    case "L":
    case "2L":
      return z && A && C ? { contorno: [v(-z / 2, -A / 2), v(z / 2, -A / 2), v(z / 2, -A / 2 + C), v(-z / 2 + C, -A / 2 + C), v(-z / 2 + C, A / 2), v(-z / 2, A / 2)] } : null;
    default:
      return z && A ? { contorno: b(z, A) } : E ? { contorno: S(E) } : null;
  }
}
function Si(t, y, v) {
  if (!t || t <= 0 || !y || !v || y <= 0 || v <= 0) return null;
  const b = Math.sqrt(Math.sqrt(v / y)), S = Math.sqrt(t / b), z = t / S;
  return !isFinite(S) || !isFinite(z) || S <= 0 || z <= 0 ? null : { contorno: [[-S / 2, -z / 2], [S / 2, -z / 2], [S / 2, z / 2], [-S / 2, z / 2]] };
}
function Pi(t) {
  const y = new io();
  t.contorno.forEach(([v, b], S) => S ? y.lineTo(v, b) : y.moveTo(v, b)), y.closePath();
  for (const v of t.huecos ?? []) {
    const b = new ti();
    v.forEach(([S, z], A) => A ? b.lineTo(S, z) : b.moveTo(S, z)), b.closePath(), y.holes.push(b);
  }
  return y;
}
function Ci(t, y, v) {
  const b = new rt();
  b.name = "extrusion";
  const S = new is({ color: 8369151, transparent: true, opacity: 0.92, side: Vt }), z = new is({ color: 12623968, transparent: true, opacity: 0.85, side: Vt }), A = new is({ color: 11583173, transparent: true, opacity: 0.85, side: Vt }), E = new rt();
  E.add(new fa(16777215, 0.55));
  const C = new Ro(16777215, 0.75);
  C.position.set(30, 25, 40);
  const L = new Ro(16777215, 0.35);
  L.position.set(-25, -20, 15), E.add(C, L);
  let N = 0;
  return ce.derive(() => {
    var _a, _b, _c, _d, _e;
    const B = ((_a = y.extruded) == null ? void 0 : _a.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++N, on: B }, b.visible = B;
    for (const Z of [...b.children]) Z !== E && (b.remove(Z), (_c = (_b = Z.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (b.children.includes(E) || b.add(E), !B) return;
    const ne = v.val ?? [], pe = ((_d = t.elements) == null ? void 0 : _d.val) ?? [], we = ((_e = t.elementInputs) == null ? void 0 : _e.val) ?? {}, j = we.sectionShapes ?? /* @__PURE__ */ new Map(), U = we.thicknesses ?? /* @__PURE__ */ new Map();
    let de = "";
    try {
      pe.forEach((Z, re) => {
        var _a2, _b2, _c2;
        if (Z.length === 2) {
          let ae = ki(j.get(re)), se = true;
          if (ae || (ae = Si((_a2 = we.areas) == null ? void 0 : _a2.get(re), (_b2 = we.momentsOfInertiaY) == null ? void 0 : _b2.get(re), (_c2 = we.momentsOfInertiaZ) == null ? void 0 : _c2.get(re)), se = false), !ae) return;
          const J = ne[Z[0]], H = ne[Z[1]];
          if (!J || !H) return;
          const W = Math.hypot(H[0] - J[0], H[1] - J[1], H[2] - J[2]);
          if (W < 1e-9) return;
          const X = new ei(Pi(ae), { depth: W, bevelEnabled: false, curveSegments: 4 });
          X.applyMatrix4(new Do().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const K = new lt(X, se ? S : z);
          K.position.set(J[0], J[1], J[2]), K.rotation.setFromRotationMatrix(xs(J, H)), b.add(K);
          return;
        }
        if (Z.length === 3 || Z.length === 4) {
          const ae = U.get(re);
          if (!ae || ae <= 0) return;
          const se = Z.map((he) => ne[he]).filter(Boolean);
          if (se.length < 3) return;
          const J = [se[1][0] - se[0][0], se[1][1] - se[0][1], se[1][2] - se[0][2]], H = [se[2][0] - se[0][0], se[2][1] - se[0][1], se[2][2] - se[0][2]], W = J[1] * H[2] - J[2] * H[1], X = J[2] * H[0] - J[0] * H[2], K = J[0] * H[1] - J[1] * H[0], q = Math.hypot(W, X, K);
          if (q < 1e-12) return;
          const R = [W / q, X / q, K / q], O = [], fe = (he) => se.map((Ie) => [Ie[0] + R[0] * he, Ie[1] + R[1] * he, Ie[2] + R[2] * he]), ye = Math.abs(R[2]) > 0.5, be = R[2] > 0 ? -1 : 1, G = fe(ye ? 0 : +ae / 2), _e2 = fe(ye ? be * ae : -ae / 2), ue = (he, Ie, ve) => O.push(...he, ...Ie, ...ve);
          for (const he of [G, _e2]) ue(he[0], he[1], he[2]), he.length === 4 && ue(he[0], he[2], he[3]);
          for (let he = 0; he < se.length; he++) {
            const Ie = (he + 1) % se.length;
            ue(G[he], _e2[he], _e2[Ie]), ue(G[he], _e2[Ie], G[Ie]);
          }
          const Ve = new Ee();
          Ve.setAttribute("position", new $t(O, 3)), Ve.computeVertexNormals(), b.add(new lt(Ve, A));
        }
      });
    } catch (Z) {
      de = String((Z == null ? void 0 : Z.message) ?? Z);
    }
    globalThis.__extrusionDebug = { corridas: N, on: B, fallo: de, nElementos: pe.length, nFormas: j.size, nEspesores: U.size, mallas: b.children.length - 1 };
  }), b;
}
function ga(t, y, v = 0) {
  const b = [y[0] - t[0], y[1] - t[1], y[2] - t[2]], S = Math.hypot(b[0], b[1], b[2]) || 1, z = b[0] / S, A = b[1] / S, E = b[2] / S, C = Math.sqrt(z * z + A * A);
  let L, N, B;
  if (C < 1e-9) {
    const ne = E > 0 ? 1 : -1;
    L = [0, 0, ne], N = [1, 0, 0], B = [0, ne, 0];
  } else L = [z, A, E], N = [-z * E / C, -A * E / C, C], B = [A / C, -z / C, 0];
  if (Math.abs(v) > 1e-12) {
    const ne = v * Math.PI / 180, pe = Math.cos(ne), we = Math.sin(ne), j = N.map((de, Z) => pe * de + we * B[Z]), U = B.map((de, Z) => -we * N[Z] + pe * de);
    N = j, B = U;
  }
  return { e1: L, e2: N, e3: B };
}
function ms(t, y) {
  if (!y) return [0, 0];
  const v = Number(y[0] ?? 0), b = Number(y[1] ?? 0);
  return t === "bendingsY" ? [v, -b] : [-v, b];
}
function va(t, y) {
  const v = (b) => b.map((S) => -S);
  switch (t) {
    case "bendingsZ":
      return v(y.e2);
    case "bendingsY":
      return v(y.e3);
    case "shearsZ":
      return y.e3;
    default:
      return y.e2;
  }
}
class Vo extends rt {
  constructor(y, v, b, S, z, A, E) {
    super();
    const C = new io().moveTo(0, 0).lineTo(0, A[1]).lineTo(b, A[1]).lineTo(b, 0).lineTo(0, 0), L = C.getPoints(), N = new Ee().setFromPoints(L);
    this.lines = new Et(N, new ct({ color: Tn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const B = new To(C), ne = new pt({ color: A[1] > 0 ? 24435 : 11411474, side: Vt });
    this.mesh = new lt(B, ne), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new It(`${z[1].toFixed(4)}`), this.normalizedResult = A, this.textPosition = lo([y, v]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(S), this.add(this.text);
  }
  updateScale(y) {
    this.lines.scale.set(1, y * 2, 1), this.mesh.scale.set(1, y * 2, 1), this.text.updateScale(y * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * y);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class ps extends rt {
  constructor(y, v, b, S, z, A, E) {
    super();
    const C = z[0] * b / (z[0] + z[1]), L = z[0] * z[1] > 0;
    if (this.text = new It(`${z[0].toFixed(4)}`), this.text2 = new It(`${(z[1] * -1).toFixed(4)}`), this.normalizedResult = A, this.textPosition = hs(y, v), this.text2Position = hs(v, y), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(S), this.text2.rotation.setFromRotationMatrix(S), this.add(this.text, this.text2), L) {
      const N = new io().moveTo(0, 0).lineTo(0, A[0]).lineTo(C, 0).lineTo(0, 0), B = new io().moveTo(C, 0).lineTo(b, -A[1]).lineTo(b, 0).lineTo(C, 0), ne = N.getPoints(), pe = B.getPoints(), we = new Ee().setFromPoints(ne), j = new Ee().setFromPoints(pe), U = new ct({ color: Tn().resultOutline });
      this.lines = new Et(we, U), this.lines2 = new Et(j, U), this.lines.position.set(...y), this.lines2.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), this.lines2.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), E && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const de = new To(N), Z = new To(B), re = new pt({ color: A[0] > 0 ? 24435 : 11411474, side: Vt }), ae = new pt({ color: -A[1] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new lt(de, re), this.mesh2 = new lt(Z, ae), this.mesh.position.set(...y), this.mesh2.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), this.mesh2.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), E && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const N = new io().moveTo(0, 0).lineTo(0, A[0]).lineTo(b, -A[1]).lineTo(b, 0).lineTo(0, 0), B = N.getPoints(), ne = new Ee().setFromPoints(B);
      this.lines = new Et(ne, new ct({ color: Tn().resultOutline })), this.lines.position.set(...y), this.lines.rotation.setFromRotationMatrix(S), E && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const pe = new To(N), we = new pt({ color: A[0] > 0 ? 24435 : 11411474, side: Vt });
      this.mesh = new lt(pe, we), this.mesh.position.set(...y), this.mesh.rotation.setFromRotationMatrix(S), E && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var Ma = ((t) => (t.normals = "normals", t.shearsY = "shearsY", t.shearsZ = "shearsZ", t.torsions = "torsions", t.bendingsY = "bendingsY", t.bendingsZ = "bendingsZ", t))(Ma || {});
function zi(t, y, v, b) {
  const S = () => {
    const E = v.rawVal;
    if (!(E == null ? void 0 : E.length)) return 0.05 * y.gridSize.rawVal;
    const C = [1 / 0, 1 / 0, 1 / 0], L = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of E) for (let ne = 0; ne < 3; ne++) B[ne] < C[ne] && (C[ne] = B[ne]), B[ne] > L[ne] && (L[ne] = B[ne]);
    const N = Math.hypot(L[0] - C[0], L[1] - C[1], L[2] - C[2]);
    return !isFinite(N) || N <= 0 ? 0.05 * y.gridSize.rawVal : 0.025 * N;
  }, z = new rt(), A = { normals: Vo, shearsY: Vo, shearsZ: Vo, torsions: Vo, bendingsY: ps, bendingsZ: ps };
  return ce.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, v.val, y.frameResults.val == "none") return;
    z.children.forEach((C) => C.dispose()), z.clear();
    const E = Ma[y.frameResults.rawVal];
    (_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.rawVal[E]) == null ? void 0 : _b.forEach((C, L) => {
      var _a2, _b2, _c, _d, _e, _f;
      const N = ((_a2 = t.elements) == null ? void 0 : _a2.rawVal[L]) ?? [0, 1], B = v.rawVal[N[0]], ne = v.rawVal[N[1]];
      if (!B || !ne) return;
      const pe = new V(...ne).distanceTo(new V(...B)), we = Ai((_b2 = t.analyzeOutputs) == null ? void 0 : _b2.rawVal[E]), j = ((_f = (_e = (_d = (_c = t.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, L)) ?? 0, U = ga(B, ne, j), de = va(E, U), Z = new V(...U.e1), re = new V(...de), ae = new Do().makeBasis(Z, re, Z.clone().cross(re)), [se, J] = ms(E, C), H = A[E] === ps ? [se, -J] : [se, J], W = H.map((K) => K / (we === 0 ? 1 : we)), X = new A[E](B, ne, pe, ae, H, W, false);
      X.updateScale(S() * b.rawVal), z.add(X);
    });
  }), ce.derive(() => {
    if (b.val, y.frameResults.rawVal == "none") return;
    y.gridSize.val;
    const E = S();
    z.children.forEach((C) => C.updateScale(E * b.rawVal));
  }), ce.derive(() => {
    z.visible = y.frameResults.val != "none";
  }), z;
}
function Ai(t) {
  let y = 0;
  return t == null ? void 0 : t.forEach((v) => {
    const b = Math.max(...(v ?? [0, 0]).map((S) => Math.abs(S)));
    b > y && (y = b);
  }), y;
}
class Fi extends rt {
  constructor(y, v, b) {
    super();
    const S = v === gs.reactions;
    b[0] && (this.xText1 = new It(`${S ? "Fx" : "Dx"}: ` + b[0].toFixed(4))), b[3] && (this.xText2 = new It(`${S ? "Mx" : "Rx"}: ` + b[3].toFixed(4))), b[1] && (this.yText1 = new It(`${S ? "Fy" : "Dy"}: ` + b[1].toFixed(4))), b[4] && (this.yText2 = new It(`${S ? "My" : "Ry"}: ` + b[4].toFixed(4))), b[2] && (this.zText1 = new It(`${S ? "Fz" : "Dz"}: ` + b[2].toFixed(4))), b[5] && (this.zText2 = new It(`${S ? "Mz" : "Rz"}: ` + b[5].toFixed(4))), (b[0] || b[3]) && (this.xArrow = new Ln(new V(1, 0, 0), new V(0, 0, 0), 1, 15637248, 0.3, 0.3)), (b[1] || b[4]) && (this.yArrow = new Ln(new V(0, 1, 0), new V(0, 0, 0), 1, 15637248, 0.3, 0.3)), (b[2] || b[5]) && (this.zArrow = new Ln(new V(0, 0, 1), new V(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...y), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(y) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o;
    (_a = this.xArrow) == null ? void 0 : _a.scale.set(y, y, y), (_b = this.yArrow) == null ? void 0 : _b.scale.set(y, y, y), (_c = this.zArrow) == null ? void 0 : _c.scale.set(y, y, y), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * y, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * y, 0, 0.5 * y), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * y, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * y, 0.5 * y), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * y), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * y + 0.5 * y), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * y), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * y), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * y), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * y), (_n2 = this.zText1) == null ? void 0 : _n2.updateScale(0.4 * y), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * y);
  }
  dispose() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i2;
    (_a = this.xArrow) == null ? void 0 : _a.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
  }
}
var gs = ((t) => (t.deformations = "deformations", t.reactions = "reactions", t))(gs || {});
function Ei(t, y, v, b) {
  const S = new rt();
  return ce.derive(() => {
    var _a, _b;
    if (y.deformedShape.val, y.nodeResults.val == "none") return;
    S.children.forEach((E) => E.dispose()), S.clear();
    const z = gs[y.nodeResults.rawVal], A = 0.05 * y.gridSize.val;
    (_b = (_a = t.deformOutputs) == null ? void 0 : _a.val[z]) == null ? void 0 : _b.forEach((E, C) => {
      const L = new Fi(v.rawVal[C], z, E ?? [0, 0, 0, 0, 0, 0]);
      L.updateScale(A * b.rawVal), S.add(L);
    });
  }), ce.derive(() => {
    if (b.val, y.nodeResults.rawVal == "none") return;
    const z = 0.05 * y.gridSize.val;
    S.children.forEach((A) => A.updateScale(z * b.rawVal));
  }), ce.derive(() => {
    S.visible = y.nodeResults.val != "none";
  }), S;
}
function Vi({ drawingObj: t, gridObj: y, scene: v, getActiveCamera: b, controls: S, gridSize: z, derivedDisplayScale: A, rendererElm: E, viewerRender: C }) {
  var _a2;
  const L = new ls(), N = new ni(), B = (e) => {
    const o = E.getBoundingClientRect(), s = e.clientX - o.left, n = e.clientY - o.top, a = o.width || 1, c = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const l = a / 2;
      if (s >= l) return N.x = (s - l) / l * 2 - 1, N.y = -(n / c) * 2 + 1, window.__hekatanSplitCamera ?? b();
      N.x = s / l * 2 - 1;
    } else N.x = s / a * 2 - 1;
    return N.y = -(n / c) * 2 + 1, b();
  }, ne = new lt(new _n(1e4, 1e4), new pt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
  ne.visible = true, ne.frustumCulled = false, v.add(ne);
  const pe = (e, o, s) => {
    const n = new lt(new _n(1e4, 1e4), new pt({ side: Vt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(e, o, s), n.visible = false, n.frustumCulled = false, v.add(n), n;
  }, we = pe(Math.PI / 2, 0, 0), j = pe(0, Math.PI / 2, 0);
  let U = false, de = null, Z = null, re = null;
  const ae = new Et(new Ee(), new ct({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  ae.name = "ref-ifc-cadena", ae.renderOrder = 1e3, ae.frustumCulled = false, ae.visible = false, v.add(ae);
  const se = (e, o, s) => Math.round(e * 1e3) + "," + Math.round(o * 1e3) + "," + Math.round(s * 1e3), J = (e) => {
    const o = /* @__PURE__ */ new Map();
    for (let s = 0; s + 0 < e.length / 6; s++) {
      const n = 6 * s;
      for (const a of [se(e[n], e[n + 1], e[n + 2]), se(e[n + 3], e[n + 4], e[n + 5])]) {
        const c = o.get(a);
        c ? c.push(s) : o.set(a, [s]);
      }
    }
    return o;
  }, H = (e) => {
    const { S: o, adj: s } = e, n = (x, g) => new V(o[6 * x + 3 * g], o[6 * x + 3 * g + 1], o[6 * x + 3 * g + 2]), a = /* @__PURE__ */ new Set([e.s]), c = (x, g) => {
      const F = [];
      let k = x, P = g;
      for (let $ = 0; $ < 3e3; $++) {
        const T = (s.get(se(P.x, P.y, P.z)) || []).filter((Ye) => !a.has(Ye));
        if (T.length !== 1) break;
        const I = T[0], Y = n(I, 0), te = n(I, 1), me = Y.distanceTo(P) < te.distanceTo(P) ? te : Y, ke = P.clone().sub(k).normalize(), et = me.clone().sub(P).normalize();
        if (ke.dot(et) < Math.cos(35 * Math.PI / 180)) break;
        a.add(I), F.push(me), k = P, P = me;
      }
      return F;
    }, i = n(e.s, 0), l = n(e.s, 1), r = c(i, l), p = c(l, i), d = [...p.reverse(), i, l, ...r], m = p.length;
    if (d.length < 6) return d;
    const f = [], h = [];
    for (let x = 1; x < d.length; x++) f.push(d[x].distanceTo(d[x - 1]));
    for (let x = 1; x < d.length - 1; x++) {
      const g = d[x].clone().sub(d[x - 1]).normalize(), F = d[x + 1].clone().sub(d[x]).normalize();
      h.push(Math.acos(Math.max(-1, Math.min(1, g.dot(F)))) / Math.max(1e-6, (f[x - 1] + f[x]) / 2));
    }
    const M = h.map((x, g) => {
      let F = 0, k = 0;
      for (let P = g - 1; P <= g + 1; P++) P >= 0 && P < h.length && (F += h[P], k++);
      return F / k;
    }), _ = [];
    for (let x = 3; x < M.length - 3; x++) {
      const g = (M[x - 3] + M[x - 2] + M[x - 1]) / 3, F = (M[x + 1] + M[x + 2] + M[x + 3]) / 3, k = Math.min(g, F), P = Math.max(g, F);
      P > 0.03 && P / Math.max(k, 1e-6) > 2.2 && Math.abs(M[x] - (g + F) / 2) < P && (!_.length || x - _[_.length - 1] > 3) && _.push(x + 1);
    }
    let w = 0, u = d.length - 1;
    for (const x of _) x <= m && x > w && (w = x), x > m && x < u && (u = x);
    return d.slice(w, u + 1);
  }, W = (e) => {
    if (re = e, !e || e.length < 2) {
      ae.visible = false;
      return;
    }
    ae.geometry.dispose(), ae.geometry = new Ee().setFromPoints(e), ae.visible = true;
  }, X = (e) => {
    let o = 0;
    for (let m = 1; m < e.length - 1; m++) {
      const f = e[m].clone().sub(e[m - 1]).normalize(), h = e[m + 1].clone().sub(e[m]).normalize();
      o += Math.acos(Math.max(-1, Math.min(1, f.dot(h))));
    }
    const s = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (o < 3 * Math.PI / 180) return [e[0].toArray(), e[e.length - 1].toArray()];
    const n = String(window.__hekatanArcModo ?? "angulo"), a = n === "x" ? 0 : n === "y" ? 1 : n === "z" ? 2 : -1, c = [0];
    for (let m = 1; m < e.length; m++) c.push(c[m - 1] + e[m].distanceTo(e[m - 1]));
    const i = (m, f) => {
      for (let h = 1; h < e.length; h++) {
        const M = m(e[h - 1], h - 1), _ = m(e[h], h);
        if (M <= f && f <= _ || _ <= f && f <= M) {
          const w = Math.abs(_ - M) < 1e-12 ? 0 : (f - M) / (_ - M);
          return e[h - 1].clone().lerp(e[h], w);
        }
      }
      return e[e.length - 1].clone();
    }, l = [], r = a >= 0 ? e[0].getComponent(a) : 0, p = a >= 0 ? e[e.length - 1].getComponent(a) : 0, d = a >= 0 && Math.abs(p - r) > 1e-6 && e.every((m, f) => f === 0 || (m.getComponent(a) - e[f - 1].getComponent(a)) * (p - r) >= -1e-6);
    for (let m = 0; m <= s; m++) {
      const f = d ? i((h) => h.getComponent(a), r + (p - r) * m / s) : i((h, M) => c[M], c[c.length - 1] * m / s);
      l.push([f.x, f.y, f.z]);
    }
    return l[0] = e[0].toArray(), l[s] = e[e.length - 1].toArray(), l;
  };
  window.__hekatanCadenaIfc = () => (re || []).map((e) => [e.x, e.y, e.z]);
  const K = /* @__PURE__ */ new Map(), q = (e) => {
    const o = K.get(e.id);
    if (o) return o;
    const s = e.geometry.getAttribute("position"), n = s ? Math.floor(s.count / 3) : 0, a = new Float64Array(n * 9), c = new Float64Array(n * 3), i = new Int32Array(n * 3).fill(-1);
    if (s) {
      e.updateMatrixWorld();
      const r = new V();
      for (let M = 0; M < n * 3; M++) r.fromBufferAttribute(s, M).applyMatrix4(e.matrixWorld), a[3 * M] = r.x, a[3 * M + 1] = r.y, a[3 * M + 2] = r.z;
      const p = new V(), d = new V(), m = new V(), f = (M) => Math.round(a[3 * M] * 1e3) + "," + Math.round(a[3 * M + 1] * 1e3) + "," + Math.round(a[3 * M + 2] * 1e3), h = /* @__PURE__ */ new Map();
      for (let M = 0; M < n; M++) {
        const _ = 3 * M;
        p.set(a[3 * (_ + 1)] - a[3 * _], a[3 * (_ + 1) + 1] - a[3 * _ + 1], a[3 * (_ + 1) + 2] - a[3 * _ + 2]), d.set(a[3 * (_ + 2)] - a[3 * _], a[3 * (_ + 2) + 1] - a[3 * _ + 1], a[3 * (_ + 2) + 2] - a[3 * _ + 2]), m.crossVectors(p, d).normalize(), c[3 * M] = m.x, c[3 * M + 1] = m.y, c[3 * M + 2] = m.z;
        for (let w = 0; w < 3; w++) {
          const u = f(_ + w), x = f(_ + (w + 1) % 3), g = u < x ? u + "|" + x : x + "|" + u, F = h.get(g);
          F ? F.push(M, w) : h.set(g, [M, w]);
        }
      }
      for (const M of h.values()) M.length === 4 && (i[3 * M[0] + M[1]] = M[2], i[3 * M[2] + M[3]] = M[0]);
    }
    const l = { V: a, N: c, vec: i, n };
    return K.set(e.id, l), l;
  }, R = new lt(new Ee(), new pt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Vt }));
  R.name = "ref-ifc-cara", R.renderOrder = 999, R.frustumCulled = false, R.visible = false, v.add(R);
  let O = null;
  const fe = (e, o) => {
    const s = Math.cos(12 * Math.PI / 180), n = Math.cos(80 * Math.PI / 180), a = [e.N[3 * o], e.N[3 * o + 1], e.N[3 * o + 2]], c = new Uint8Array(e.n), i = [], l = [o];
    for (c[o] = 1; l.length && i.length < 4e4; ) {
      const r = l.pop();
      i.push(r);
      for (let p = 0; p < 3; p++) {
        const d = e.vec[3 * r + p];
        if (d < 0 || c[d]) continue;
        const m = e.N[3 * r] * e.N[3 * d] + e.N[3 * r + 1] * e.N[3 * d + 1] + e.N[3 * r + 2] * e.N[3 * d + 2], f = a[0] * e.N[3 * d] + a[1] * e.N[3 * d + 1] + a[2] * e.N[3 * d + 2];
        m >= s && f >= n && (c[d] = 1, l.push(d));
      }
    }
    return i;
  }, ye = (e, o, s) => {
    if (!e || o < 0 || !s) {
      O && (O = null, R.visible = false);
      return;
    }
    if (O && O.m === e && O.tris.indexOf(o) >= 0) {
      O.punto = s.clone();
      return;
    }
    const n = q(e), a = fe(n, o), c = new Float32Array(a.length * 9), i = new V();
    let l = true;
    a.forEach((r, p) => {
      for (let d = 0; d < 9; d++) c[9 * p + d] = n.V[9 * r + d];
      i.x += n.N[3 * r], i.y += n.N[3 * r + 1], i.z += n.N[3 * r + 2];
    }), i.normalize();
    for (const r of a) if (i.x * n.N[3 * r] + i.y * n.N[3 * r + 1] + i.z * n.N[3 * r + 2] < Math.cos(5 * Math.PI / 180)) {
      l = false;
      break;
    }
    R.geometry.dispose(), R.geometry = new Ee(), R.geometry.setAttribute("position", new ft(c, 3)), R.material.color.set(l ? 3718648 : 16096779), R.visible = true, O = { m: e, t0: o, tris: a, normal: i, plana: l, punto: s.clone() };
  }, be = (e, o) => {
    const s = new Uint8Array(e.n);
    for (const d of o) s[d] = 1;
    const n = (d) => Math.round(e.V[3 * d] * 1e3) + "," + Math.round(e.V[3 * d + 1] * 1e3) + "," + Math.round(e.V[3 * d + 2] * 1e3), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
    for (const d of o) for (let m = 0; m < 3; m++) {
      const f = e.vec[3 * d + m];
      if (f >= 0 && s[f]) continue;
      const h = 3 * d + m, M = 3 * d + (m + 1) % 3, _ = n(h), w = n(M);
      c.set(_, new V(e.V[3 * h], e.V[3 * h + 1], e.V[3 * h + 2])), c.set(w, new V(e.V[3 * M], e.V[3 * M + 1], e.V[3 * M + 2])), (a.get(_) || a.set(_, []).get(_)).push(w), (a.get(w) || a.set(w, []).get(w)).push(_);
    }
    const i = /* @__PURE__ */ new Set();
    let l = [];
    for (const d of a.keys()) {
      if (i.has(d)) continue;
      const m = [d];
      i.add(d);
      let f = "", h = d;
      for (let M = 0; M < 1e5; M++) {
        const _ = (a.get(h) || []).find((w) => w !== f && !i.has(w));
        if (!_) break;
        m.push(_), i.add(_), f = h, h = _;
      }
      m.length > l.length && (l = m);
    }
    const r = l.map((d) => c.get(d)), p = [];
    for (let d = 0; d < r.length; d++) {
      const m = r[(d + r.length - 1) % r.length], f = r[d], h = r[(d + 1) % r.length];
      if (f.distanceTo(m) < 1e-3) continue;
      const M = f.clone().sub(m).normalize(), _ = h.clone().sub(f).normalize();
      M.dot(_) > Math.cos(3 * Math.PI / 180) || p.push(f);
    }
    return p;
  }, G = (e, o, s) => {
    const a = new ls(o.clone().addScaledVector(s, -2e-3), s.clone().negate(), 0, 3).intersectObject(e, false);
    return a.length ? a[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (e, o, s, n = 2) => {
    const a = new V(e[0], e[1], e[2]), c = new V(o[0], o[1], o[2]).normalize();
    let i = null;
    for (const l of [1, -1]) {
      const p = new ls(a, c.clone().multiplyScalar(l), 0, n).intersectObjects(s, false);
      p.length && (i == null || p[0].distance < i) && (i = p[0].distance);
    }
    return i;
  }, window.__hekatanCaraIfc = () => O ? { tris: O.tris.length, plana: O.plana, normal: O.normal.toArray(), punto: O.punto.toArray(), contorno: be(q(O.m), O.tris).map((e) => [e.x, e.y, e.z]) } : null;
  const _e = /* @__PURE__ */ new Map(), ue = new Ht(new Ee(), new ct({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  ue.name = "ref-ifc-bordes", ue.frustumCulled = false, ue.visible = false, v.add(ue);
  const Ve = 1, he = (e, o, s) => Math.floor(e / Ve) + "," + Math.floor(o / Ve) + "," + Math.floor(s / Ve), Ie = (e) => {
    const o = _e.get(e.id);
    if (o) return o;
    const s = e.geometry.getAttribute("position"), n = [], a = /* @__PURE__ */ new Map();
    if (s) {
      e.updateMatrixWorld();
      const i = Math.floor(s.count / 3), l = new Float64Array(s.count * 3), r = new V();
      for (let w = 0; w < s.count; w++) r.fromBufferAttribute(s, w).applyMatrix4(e.matrixWorld), l[3 * w] = r.x, l[3 * w + 1] = r.y, l[3 * w + 2] = r.z;
      const p = (w) => Math.round(l[3 * w] * 1e3) + "," + Math.round(l[3 * w + 1] * 1e3) + "," + Math.round(l[3 * w + 2] * 1e3), d = new Float64Array(i * 3), m = new V(), f = new V(), h = new V();
      for (let w = 0; w < i; w++) {
        const u = 3 * w, x = 3 * w + 1, g = 3 * w + 2;
        m.set(l[3 * x] - l[3 * u], l[3 * x + 1] - l[3 * u + 1], l[3 * x + 2] - l[3 * u + 2]), f.set(l[3 * g] - l[3 * u], l[3 * g + 1] - l[3 * u + 1], l[3 * g + 2] - l[3 * u + 2]), h.crossVectors(m, f).normalize(), d[3 * w] = h.x, d[3 * w + 1] = h.y, d[3 * w + 2] = h.z;
      }
      const M = /* @__PURE__ */ new Map();
      for (let w = 0; w < i; w++) for (let u = 0; u < 3; u++) {
        const x = 3 * w + u, g = 3 * w + (u + 1) % 3, F = p(x), k = p(g), P = F < k ? F + "|" + k : k + "|" + F, $ = M.get(P);
        $ ? $.push(w) : M.set(P, [w, x, g]);
      }
      const _ = Math.cos(25 * Math.PI / 180);
      for (const w of M.values()) {
        const u = w[0], x = w[1], g = w[2];
        let F = w.length === 3;
        if (!F && w.length === 4) {
          const P = w[3], $ = d[3 * u] * d[3 * P] + d[3 * u + 1] * d[3 * P + 1] + d[3 * u + 2] * d[3 * P + 2];
          F = Math.abs($) < _;
        }
        if (!F) continue;
        const k = n.length / 6;
        n.push(l[3 * x], l[3 * x + 1], l[3 * x + 2], l[3 * g], l[3 * g + 1], l[3 * g + 2]);
        for (const [P, $, T] of [[l[3 * x], l[3 * x + 1], l[3 * x + 2]], [l[3 * g], l[3 * g + 1], l[3 * g + 2]], [(l[3 * x] + l[3 * g]) / 2, (l[3 * x + 1] + l[3 * g + 1]) / 2, (l[3 * x + 2] + l[3 * g + 2]) / 2]]) {
          const I = he(P, $, T), Y = a.get(I);
          Y ? Y[Y.length - 1] !== k && Y.push(k) : a.set(I, [k]);
        }
      }
    }
    const c = { segs: new Float32Array(n), celdas: a };
    return _e.set(e.id, c), c;
  };
  let ve = "";
  const qe = (e) => {
    const o = e.map((i) => i.id).join(",");
    if (o === ve) return;
    ve = o;
    const s = e.map((i) => Ie(i).segs);
    let n = 0;
    for (const i of s) n += i.length;
    const a = new Float32Array(n);
    let c = 0;
    for (const i of s) a.set(i, c), c += i.length;
    ue.geometry.dispose(), ue.geometry = new Ee(), ue.geometry.setAttribute("position", new ft(a, 3)), ue.visible = n > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    ue.visible = ve !== "" && window.__hekatanRefIfcBordes !== false, C();
  }, window.__hekatanBordesIfc = () => {
    let e = 0;
    for (const o of _e.values()) e += o.segs.length / 6;
    return e;
  };
  const Je = (e, o) => {
    const s = window.__hekatanCursorPx;
    if (!s) return null;
    const n = Ie(e), a = n.segs, c = Math.floor(o.x / Ve), i = Math.floor(o.y / Ve), l = Math.floor(o.z / Ve), r = /* @__PURE__ */ new Set();
    let p = Mn, d = null, m = Mn, f = null, h = -1;
    const M = new V(), _ = new V();
    for (let w = -1; w <= 1; w++) for (let u = -1; u <= 1; u++) for (let x = -1; x <= 1; x++) {
      const g = n.celdas.get(c + w + "," + (i + u) + "," + (l + x));
      if (g) for (const F of g) {
        if (r.has(F)) continue;
        r.add(F);
        const k = 6 * F;
        M.set(a[k], a[k + 1], a[k + 2]), _.set(a[k + 3], a[k + 4], a[k + 5]);
        const P = Vn(M.x, M.y, M.z), $ = Vn(_.x, _.y, _.z);
        if (!P || !$) continue;
        const T = Math.hypot(P.x - s.x, P.y - s.y), I = Math.hypot($.x - s.x, $.y - s.y);
        T < p && (p = T, d = M.clone()), I < p && (p = I, d = _.clone());
        const Y = $.x - P.x, te = $.y - P.y, me = Y * Y + te * te || 1e-9;
        let ke = ((s.x - P.x) * Y + (s.y - P.y) * te) / me;
        ke = Math.max(0, Math.min(1, ke));
        const et = Math.hypot(s.x - (P.x + ke * Y), s.y - (P.y + ke * te));
        et < m && (m = et, f = M.clone().lerp(_, ke), h = F);
      }
    }
    return h >= 0 && (n.adj || (n.adj = J(n.segs)), Z = { S: n.segs, adj: n.adj, s: h }), d ? { tipo: "ifcVert", punto: d } : f ? { tipo: "ifcEdge", punto: f } : null;
  }, xt = () => {
    var _a3, _b, _c;
    if (window.__hekatanRefIfcSnap === false) return null;
    const e = [];
    if (v.traverse((c) => {
      var _a4;
      ((_a4 = c.userData) == null ? void 0 : _a4.refIfc) && c.isMesh && e.push(c);
    }), !e.length) return ue.visible = false, ve = "", null;
    qe(e);
    const o = L.intersectObjects(e, false).filter((c) => {
      const i = c.object.material;
      return (i && i.clippingPlanes || []).every((r) => r.distanceToPoint(c.point) >= 0);
    });
    if (!o.length) return null;
    const s = o[0], n = o[1];
    ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "ifcface" ? ye(s.object, s.faceIndex ?? -1, s.point) : O && ye(null, -1, null);
    const a = Je(s.object, s.point);
    if (a) return de = { tipo: a.tipo }, [{ ...s, point: a.punto }];
    if (n && n.object === s.object && n.distance - s.distance <= 1.2) {
      const c = s.point.clone().add(n.point).multiplyScalar(0.5);
      return de = { tipo: "ifcAxis" }, [{ ...s, point: c }];
    }
    return de = { tipo: "ifc" }, [s];
  };
  let gt = "", xe = new Float32Array(0);
  const D = new Ht(new Ee(), new ct({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  D.name = "ref-ifc-seccion", D.renderOrder = 998, D.frustumCulled = false, D.visible = false, v.add(D);
  const oe = () => {
    const e = window.__hekatanClip;
    if (!e || window.__hekatanRefIfcSnap === false) return D.visible = false, xe = new Float32Array(0);
    const o = [];
    e.enableX && o.push([0, +e.posX]), e.enableY && o.push([1, +e.posY]), e.enableZ && o.push([2, +e.posZ]);
    const s = [];
    v.traverse((c) => {
      var _a3;
      ((_a3 = c.userData) == null ? void 0 : _a3.refIfc) && c.isMesh && s.push(c);
    });
    const n = JSON.stringify(o) + "|" + s.map((c) => c.id).join(",");
    if (n === gt) return xe;
    gt = n;
    const a = [];
    if (o.length && s.length) {
      const c = [new V(), new V(), new V()];
      for (const i of s) {
        const l = i.geometry.getAttribute("position");
        if (l) {
          i.updateMatrixWorld();
          for (let r = 0; r + 2 < l.count; r += 3) {
            for (let p = 0; p < 3; p++) c[p].fromBufferAttribute(l, r + p).applyMatrix4(i.matrixWorld);
            for (const [p, d] of o) {
              const m = [c[0].getComponent(p) - d, c[1].getComponent(p) - d, c[2].getComponent(p) - d], f = [];
              for (let h = 0; h < 3; h++) {
                const M = c[h], _ = c[(h + 1) % 3], w = m[h], u = m[(h + 1) % 3];
                (w < 0 && u >= 0 || w >= 0 && u < 0) && f.push(M.clone().lerp(_, w / (w - u)));
              }
              f.length === 2 && a.push(f[0].x, f[0].y, f[0].z, f[1].x, f[1].y, f[1].z);
            }
          }
        }
      }
    }
    return xe = new Float32Array(a), D.geometry.dispose(), D.geometry = new Ee(), D.geometry.setAttribute("position", new ft(xe, 3)), D.visible = xe.length > 0, xe;
  };
  let ee = null, ie = null;
  const Ce = (e, o) => {
    const s = oe();
    if (!s.length) return null;
    let n = Mn * 2, a = null, c = -1;
    const i = new V(), l = new V();
    for (let r = 0; r + 5 < s.length; r += 6) {
      i.set(s[r], s[r + 1], s[r + 2]), l.set(s[r + 3], s[r + 4], s[r + 5]);
      const p = Vn(i.x, i.y, i.z), d = Vn(l.x, l.y, l.z);
      if (!p || !d) continue;
      const m = d.x - p.x, f = d.y - p.y, h = m * m + f * f || 1e-9;
      let M = ((e - p.x) * m + (o - p.y) * f) / h;
      M = Math.max(0, Math.min(1, M));
      const _ = Math.hypot(e - (p.x + M * m), o - (p.y + M * f));
      _ < n && (n = _, a = i.clone().lerp(l, M), c = r / 6);
    }
    return c >= 0 && (ie !== s && (ee = J(s), ie = s), Z = { S: s, adj: ee, s: c }), a;
  };
  let Se = null;
  window.__hekatanSeccionIfc = () => oe().length / 6, window.__hekatanSeccionIfcPuntos = (e = 200) => {
    const o = oe(), s = [], n = Math.max(1, Math.floor(o.length / 6 / e));
    for (let a = 0; a + 2 < o.length; a += 6 * n) s.push([o[a], o[a + 1], o[a + 2]]);
    return s;
  };
  const ge = () => {
    de = null;
    const e = xt();
    if (e) return e;
    if (U) return L.intersectObjects([ne], false);
    if (we.visible = !!window.__hekatanGridPlaneXZ, j.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Jt.visible) {
      const n = L.intersectObjects([Jt, sn, an], false);
      if (n.length > 0) return n;
    }
    const s = [ne];
    return we.visible && s.push(we), j.visible && s.push(j), xn.visible && Nn.length > 0 && s.push(...Nn), L.intersectObjects(s, false);
  }, Le = new Io(new Ee(), new Lo()), De = new Io(new Ee(), new Lo({ color: "gray", sizeAttenuation: false, size: 6 })), ot = new Io(new Ee(), new Lo({ color: "orange", sizeAttenuation: false, size: 5 }));
  v.add(ot);
  const Pe = document.createElement("input");
  Pe.id = "hk-rubber-label", Pe.type = "text", Pe.spellcheck = false, Pe.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Pe.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(Pe);
  const tt = document.createElement("div");
  tt.id = "hk-rubber-angle", tt.style.cssText = ["position:fixed", "z-index:99996", "pointer-events:none", "padding:2px 6px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px", "font-family:Consolas,monospace", "font-size:12px", "transform:translate(-50%,0)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(tt);
  let Ze = null, We = null, Me = false;
  const Te = new V(), Pt = (e, o, s, n, a, c) => {
    const i = n - e, l = a - o, r = c - s, p = Math.hypot(i, l, r);
    if (p < 0.01) {
      Pe.style.display = "none";
      return;
    }
    Ze = [e, o, s], We = [i / p, l / p, r / p], Te.set((e + n) / 2, (o + a) / 2, (s + c) / 2), Te.project(b());
    const d = E.getBoundingClientRect(), m = d.left + (Te.x * 0.5 + 0.5) * d.width, f = d.top + (-Te.y * 0.5 + 0.5) * d.height;
    Pe.style.left = m + "px", Pe.style.top = f + "px", Pe.style.display = "block";
    const h = new V(e, o, s).project(b()), M = new V(n, a, c).project(b()), _ = d.left + (h.x * 0.5 + 0.5) * d.width, w = d.top + (-h.y * 0.5 + 0.5) * d.height, u = d.left + (M.x * 0.5 + 0.5) * d.width, x = d.top + (-M.y * 0.5 + 0.5) * d.height;
    let g = Math.atan2(-(x - w), u - _) * 180 / Math.PI;
    if (g < 0 && (g += 360), tt.textContent = `${Math.round(g) % 360}\xB0`, tt.style.left = u + "px", tt.style.top = x + 34 + "px", tt.style.display = "block", !Me) {
      if (Pe.value = `${p.toFixed(2)} m`, document.activeElement !== Pe) {
        const F = document.activeElement;
        F && (F.tagName === "INPUT" || F.tagName === "TEXTAREA") && F !== Pe || Pe.focus({ preventScroll: true });
      }
      try {
        Pe.select();
      } catch {
      }
    }
  }, nt = () => {
    Pe.style.display = "none", tt.style.display = "none", Ze = null, We = null, Me = false, document.activeElement === Pe && Pe.blur();
  }, Mt = (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      $n = e, le(`\u21C9 DESFASE distancia ${e} m \u2014 designe la l\xEDnea y luego el lado.`), Pe.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Xe.length === 1) {
      const d = Xe[0];
      Xe = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, d[0], d[1], d[2], e), le(`\u2713 C\xEDrculo r=${e} m en (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}).`);
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
      kt = e, le(`\u{1F4D0} Altura ${e}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), Pe.blur();
      return;
    }
    if (!Ze || !We || !t.polylines) return;
    let s = We[0], n = We[1], a = We[2];
    _t === "x" ? (s = Math.sign(s) || 1, n = 0, a = 0) : _t === "y" ? (s = 0, n = Math.sign(n) || 1, a = 0) : _t === "z" && (s = 0, n = 0, a = Math.sign(a) || 1);
    const c = Ze[0] + s * e, i = Ze[1] + n * e, l = Ze[2] + a * e;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, [c, i, l]];
    const r = t.polylines.rawVal, p = r.length ? r[r.length - 1] : [];
    t.polylines.val = [...r.slice(0, -1), [...p, t.points.rawVal.length - 1]], Pe.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    C();
  }, Bt = (e) => {
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
  }, st = (e) => {
    if (!e) return null;
    if (e.kind === "absCart") return [e.x, e.y, e.z];
    if (e.kind === "relCart") return Ze ? [Ze[0] + e.dx, Ze[1] + e.dy, Ze[2] + e.dz] : null;
    if (e.kind === "absPolar") {
      const o = e.ang * Math.PI / 180;
      return [e.L * Math.cos(o), e.L * Math.sin(o), 0];
    }
    if (e.kind === "relPolar") {
      if (!Ze) return null;
      const o = e.ang * Math.PI / 180;
      return [Ze[0] + e.L * Math.cos(o), Ze[1] + e.L * Math.sin(o), Ze[2]];
    }
    if (e.kind === "relSpherical") {
      if (!Ze) return null;
      const o = e.az * Math.PI / 180, s = e.el * Math.PI / 180, n = e.L * Math.cos(s);
      return [Ze[0] + n * Math.cos(o), Ze[1] + n * Math.sin(o), Ze[2] + e.L * Math.sin(s)];
    }
    return null;
  }, He = (e) => {
    var _a3, _b;
    if (!t.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, e];
    const o = t.polylines.rawVal, s = o.length ? o[o.length - 1] : [];
    t.polylines.val = [...o.slice(0, -1), [...s, t.points.rawVal.length - 1]], Ze = e, Pe.blur();
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
    const o = Bt(e);
    if (!o) return false;
    if (o.kind === "length") return Mt(o.L), true;
    const s = st(o);
    if (!s) return false;
    Ks(new V(s[0], s[1], s[2]), null), Ze = s, Pe.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, Pe.addEventListener("keydown", (e) => {
    var _a3, _b, _c;
    if (e.key === "Enter") {
      if (e.preventDefault(), !Me) {
        (_a3 = window.__hekatanFinalizeDraw) == null ? void 0 : _a3.call(window);
        try {
          (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c.call(_b, "select");
        } catch {
        }
        return;
      }
      const s = Bt(Pe.value);
      if (!s) return;
      if (Me = false, s.kind === "length") Mt(s.L), le(`\u270F DDE ${s.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = st(s);
        if (!n) return;
        He(n);
        const a = s.kind;
        le(`\u270F ${a} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault(), Me = false, Pe.blur();
      return;
    }
    const o = e.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      e.preventDefault(), setTimeout(() => {
        if (!Me && Pe.style.display === "block") try {
          Pe.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") && (Me = true);
  }), window.addEventListener("keydown", (e) => {
    if (!Ze || !We || document.activeElement === Pe) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(e.key) && (Pe.value = e.key, Pe.focus(), Pe.setSelectionRange(1, 1), e.preventDefault());
  });
  const ze = document.createElement("div");
  ze.id = "hk-coord-readout", ze.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ze.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ze);
  const Oe = document.createElement("div");
  Oe.id = "hk-coord-fixed", Oe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Oe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Oe);
  const Fe = new Et(new Ee().setFromPoints([new V(0, 0, 0), new V(0, 0, 0)]), new oo({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  Fe.frustumCulled = false, Fe.visible = false, Fe.name = "rubberBand", v.add(Fe), window.__hekatanRubberBand = Fe;
  const it = new Et(new Ee(), new ct({ color: 2282478, transparent: true, opacity: 0.9 }));
  it.frustumCulled = false, it.visible = false, v.add(it);
  let at = [];
  const bt = new Et(new Ee(), new ct({ color: 16763904, transparent: true, opacity: 0.95 }));
  bt.frustumCulled = false, bt.visible = false, bt.renderOrder = 999, v.add(bt);
  let Ke = [];
  const je = document.createElement("div");
  je.id = "hk-measure-label", je.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(je);
  const Nt = (e) => {
    var _a3, _b;
    const o = B(e);
    if (!o) return null;
    L.setFromCamera(N, o);
    let s = null, n = null;
    const a = L.intersectObjects(v.children, true).filter((f) => f.object.isMesh && f.object !== ht && f.object !== mt && f.object.visible !== false);
    if (a.length) {
      const f = a[0], h = f.point;
      s = [h.x, h.y, h.z];
      const _ = (_b = (_a3 = f.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      _ && f.face && (n = [f.face.a, f.face.b, f.face.c].map((w) => {
        const u = new V().fromBufferAttribute(_, w);
        return f.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const f = ge();
      if (f.length) {
        const h = f[0].point;
        s = [h.x, h.y, h.z];
      }
    }
    if (!s) return null;
    const c = E.getBoundingClientRect(), i = (f) => {
      const h = new V(f[0], f[1], f[2]).project(o);
      return [c.left + (h.x * 0.5 + 0.5) * c.width, c.top + (-h.y * 0.5 + 0.5) * c.height];
    }, l = [e.clientX, e.clientY], r = 14;
    let p = s, d = r;
    const m = (f) => {
      const h = i(f), M = Math.hypot(h[0] - l[0], h[1] - l[1]);
      M < d && (d = M, p = f);
    };
    for (const f of n ?? []) m(f);
    for (const f of t.points.rawVal) m(f);
    return p;
  }, Ct = () => {
    if (Ke.length < 1) {
      je.style.display = "none";
      return;
    }
    const e = b(), o = Ke[0], s = Ke[1] ?? Ke[0], a = new V((o[0] + s[0]) / 2, (o[1] + s[1]) / 2, (o[2] + s[2]) / 2).clone().project(e), c = E.getBoundingClientRect();
    je.style.left = c.left + (a.x * 0.5 + 0.5) * c.width + "px", je.style.top = c.top + (-a.y * 0.5 + 0.5) * c.height - 14 + "px", je.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Ct, window.__hekatanClearMeasure = () => {
    Ke = [], bt.visible = false, je.style.display = "none";
    try {
      C();
    } catch {
    }
  };
  try {
    (_a2 = S.addEventListener) == null ? void 0 : _a2.call(S, "change", Ct);
  } catch {
  }
  const mt = new lt(new Ee(), new pt({ color: 16096779, transparent: true, opacity: 0.35, side: Vt, depthWrite: false }));
  mt.frustumCulled = false, mt.visible = false, mt.renderOrder = 998, mt.name = "hk-fill-preview", v.add(mt), E.addEventListener("pointerleave", () => {
    ze.style.display = "none", mt.visible && (mt.visible = false, C());
  });
  const fn = (e) => {
    var _a3, _b, _c, _d;
    const o = t.points.rawVal, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = /* @__PURE__ */ new Map(), a = (w, u) => {
      w !== u && ((n.get(w) ?? n.set(w, /* @__PURE__ */ new Set()).get(w)).add(u), (n.get(u) ?? n.set(u, /* @__PURE__ */ new Set()).get(u)).add(w));
    };
    for (const w of s) for (let u = 0; u + 1 < w.length; u++) a(w[u], w[u + 1]);
    const c = (w, u) => {
      var _a4;
      return !!((_a4 = n.get(w)) == null ? void 0 : _a4.has(u));
    }, i = [], l = /* @__PURE__ */ new Set(), r = [...n.keys()];
    for (const w of r) for (const u of n.get(w)) if (!(u < w)) {
      for (const x of n.get(u)) if (x !== w) for (const g of n.get(x)) {
        if (g === w || g === u || !c(g, w) || c(w, x) || c(u, g)) continue;
        const F = [w, u, x, g].slice().sort((k, P) => k - P).join("-");
        l.has(F) || (l.add(F), i.push([w, u, x, g]));
      }
    }
    for (const w of r) for (const u of n.get(w)) if (!(u < w)) for (const x of n.get(u)) {
      if (x === w || !c(x, w)) continue;
      const g = [w, u, x].slice().sort((F, k) => F - k).join("-");
      l.has(g) || (l.add(g), i.push([w, u, x]));
    }
    const p = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", d = (w) => p === "xy" ? [w[0], w[1]] : p === "xz" ? [w[0], w[2]] : [w[1], w[2]], m = d(e), f = (w, u) => {
      let x = false;
      for (let g = 0, F = u.length - 1; g < u.length; F = g++) {
        const k = u[g][0], P = u[g][1], $ = u[F][0], T = u[F][1];
        P > w[1] != T > w[1] && w[0] < ($ - k) * (w[1] - P) / (T - P) + k && (x = !x);
      }
      return x;
    }, h = (w) => {
      let u = 0;
      for (let x = 0, g = w.length - 1; x < w.length; g = x++) u += (w[g][0] + w[x][0]) * (w[g][1] - w[x][1]);
      return Math.abs(u) / 2;
    };
    let M = null, _ = 1 / 0;
    for (const w of i) {
      const u = w.map((g) => d(o[g]));
      if (!f(m, u)) continue;
      const x = h(u);
      x < _ && (_ = x, M = w);
    }
    return M;
  }, zt = new rt(), Lt = new lt(new _n(1, 1), new pt({ color: 2282478, transparent: true, opacity: 0.08, side: Vt, depthWrite: false })), hn = new Ht(new js(new _n(1, 1)), new ct({ color: 2282478, transparent: true, opacity: 0.85 })), Sn = new Ht(new Ee(), new ct({ color: 2282478, transparent: true, opacity: 0.3 })), co = (e, o) => {
    const s = [], n = Math.ceil(e / o);
    for (let a = -n; a <= n; a++) {
      const c = a * o;
      s.push(-e, c, 0, e, c, 0), s.push(c, -e, 0, c, e, 0);
    }
    Sn.geometry.dispose(), Sn.geometry = new Ee(), Sn.geometry.setAttribute("position", new $t(s, 3));
  };
  zt.add(Lt, hn, Sn), zt.visible = false, zt.frustumCulled = false, v.add(zt);
  const Xt = new rt();
  Xt.frustumCulled = false, Xt.visible = false, v.add(Xt);
  const mn = (e) => {
    const o = new Ee().setFromPoints([new V(0, 0, 0), new V(0, 0, 0)]), s = new oo({ color: e, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Et(o, s);
  }, Pn = mn(16711680), Cn = mn(65280), zn = mn(35071);
  Xt.add(Pn, Cn, zn);
  const Wn = [], No = (e) => e.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Yt = mn(16761856);
  Yt.material.dashSize = 0.28, Yt.material.gapSize = 0.16, Yt.material.opacity = 0.9, Yt.frustumCulled = false, Yt.visible = false, Yt.renderOrder = 98, v.add(Yt);
  const Hn = (e) => {
    const o = new Ee().setFromPoints([new V(0, 0, 0), new V(0, 0, 0), new V(0, 0, 0), new V(0, 0, 0)]), s = new ct({ color: e, transparent: true, opacity: 0.2, depthTest: false }), n = new pa(o, s);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, An = Hn(3462041), Rn = Hn(16724804), Dn = Hn(6333946), on = new rt();
  on.frustumCulled = false, on.visible = false, v.add(on), on.add(An, Rn, Dn);
  const Bn = (e) => {
    const o = new _n(1, 1), s = new pt({ color: e, transparent: true, opacity: 0.06, side: Vt, depthWrite: false }), n = new lt(o, s);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Jt = Bn(3462041), sn = Bn(16724804), an = Bn(6333946);
  on.add(Jt, sn, an);
  const wn = (e, o, s, n) => {
    e.scale.set(2 * n, 2 * n, 1), s === "xy" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, 0, 0)) : s === "xz" ? (e.position.set(o[0], o[1], o[2]), e.rotation.set(Math.PI / 2, 0, 0)) : (e.position.set(o[0], o[1], o[2]), e.rotation.set(0, Math.PI / 2, 0));
  }, rn = document.createElement("div");
  rn.id = "hk-refplane-badge", rn.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(rn), window.__hekatanSetOrthoPlanes = (e) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = e, on.visible = e, e) {
      const o = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], c = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0], i = window.__hekatanOrthoExt ?? 8;
      yn(An, c, "xy", i), yn(Rn, c, "xz", i), yn(Dn, c, "yz", i), wn(Jt, c, "xy", i), wn(sn, c, "xz", i), wn(an, c, "yz", i), Jt.material.opacity = 0.05, sn.material.opacity = 0.05, an.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    C();
  }, window.__hekatanSetOrthoExt = (e) => {
    var _a3;
    if (window.__hekatanOrthoExt = e, !on.visible) {
      C();
      return;
    }
    const o = window.__hekatanOrthoAnchor, s = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], n = s[s.length - 1] ?? [], a = t.points.rawVal ?? [], c = o && o.length === 3 ? o : n.length > 0 && a[n[n.length - 1]] ? a[n[n.length - 1]] : [0, 0, 0];
    yn(An, c, "xy", e), yn(Rn, c, "xz", e), yn(Dn, c, "yz", e), wn(Jt, c, "xy", e), wn(sn, c, "xz", e), wn(an, c, "yz", e), C();
  };
  const vs = (e) => {
    if (Jt.material.opacity = e === "xy" ? 0.09 : 0.025, sn.material.opacity = e === "xz" ? 0.09 : 0.025, an.material.opacity = e === "yz" ? 0.09 : 0.025, e) {
      const a = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[e];
      rn.style.background = a.bg, rn.style.color = a.text, rn.textContent = `\u25A6 Plano ${e.toUpperCase()}`, rn.style.display = "block";
    } else rn.style.display = "none";
  }, yn = (e, o, s, n) => {
    let a;
    s === "xy" ? a = [new V(o[0] - n, o[1] - n, o[2]), new V(o[0] + n, o[1] - n, o[2]), new V(o[0] + n, o[1] + n, o[2]), new V(o[0] - n, o[1] + n, o[2]), new V(o[0] - n, o[1] - n, o[2])] : s === "xz" ? a = [new V(o[0] - n, o[1], o[2] - n), new V(o[0] + n, o[1], o[2] - n), new V(o[0] + n, o[1], o[2] + n), new V(o[0] - n, o[1], o[2] + n), new V(o[0] - n, o[1], o[2] - n)] : a = [new V(o[0], o[1] - n, o[2] - n), new V(o[0], o[1] + n, o[2] - n), new V(o[0], o[1] + n, o[2] + n), new V(o[0], o[1] - n, o[2] + n), new V(o[0], o[1] - n, o[2] - n)], e.geometry.setFromPoints(a);
  };
  let _t = null;
  window.__hekatanAxisLock = () => _t;
  let uo = null, Tt = null;
  const Rt = document.createElement("div");
  Rt.id = "hk-axis-lock-badge", Rt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Rt);
  const Ms = () => {
    if (!_t) {
      Rt.style.display = "none";
      return;
    }
    const e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Rt.style.background = "rgba(15,23,42,0.92)", Rt.style.color = e[_t], Rt.style.border = `1.5px solid ${e[_t]}`, Rt.textContent = `\u{1F512} LOCK ${_t.toUpperCase()}`, Rt.style.display = "block";
  };
  window.addEventListener("keydown", (e) => {
    var _a3, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== Pe) return;
    const s = e.key.toLowerCase(), n = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (e.key === "Enter" && n === "polyarea" && at.length >= 3) {
      const a = vo();
      le(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`), e.preventDefault();
      return;
    }
    if (s === "x" || s === "y" || s === "z") _t = _t === s ? null : s, Ms(), e.preventDefault();
    else if (e.key === "Escape") {
      const a = document.activeElement;
      a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") && a.blur(), Ys(), e.preventDefault();
    } else e.key === "F3" ? (e.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : e.key === "F10" ? (e.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : e.key === "F8" && (e.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const e = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = e, e || So(), le(`\u{1F9F2} OSNAP ${e ? "ON" : "OFF"} (F3)`);
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
  const po = new V(), fo = new V(), bs = new V(), ba = (e) => {
    if (!_t) return null;
    const o = e[0], s = e[1], n = e[2];
    return _t === "x" ? (po.set(o - 1e4, s, n), fo.set(o + 1e4, s, n)) : _t === "y" ? (po.set(o, s - 1e4, n), fo.set(o, s + 1e4, n)) : (po.set(o, s, n - 1e4), fo.set(o, s, n + 1e4)), L.ray.distanceSqToSegment(po, fo, null, bs), bs;
  };
  window.__hekatanProjectOnAxis = ba;
  const Zt = new Et(new Ee().setFromPoints([new V(0, 0, 0), new V(0, 0, 0)]), new ct({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Zt.renderOrder = 998, Zt.frustumCulled = false, Zt.visible = false, v.add(Zt);
  let ln = -1, gn = -1, vn = -1;
  const Ne = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ne;
  const cn = new Et(new Ee().setFromPoints([new V(), new V()]), new ct({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  cn.renderOrder = 997, cn.frustumCulled = false, cn.visible = false, v.add(cn);
  const Qt = new lt(new Gn(0.02, 12, 12), new pt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Qt.renderOrder = 998, Qt.visible = false, v.add(Qt);
  const ho = (e) => {
    const o = b();
    if (o.isOrthographicCamera) {
      const n = o, a = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, a * 6e-3);
    }
    const s = o.position.distanceTo(e);
    return Math.max(0.05, s / 10);
  }, _s = () => {
    Qt.visible && Qt.scale.setScalar(ho(Qt.position));
  }, dn = new rt();
  dn.frustumCulled = false, v.add(dn);
  const mo = 2282478;
  let un = null;
  const _a = (e, o, s, n) => {
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
  }, Ot = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; dn.children.length; ) {
      const i = dn.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = ((_e2 = t.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = t.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const i of Ne) {
      const [l, ...r] = i.split(":");
      if (l === "pt") {
        const p = e[+r[0]];
        if (!p) continue;
        const d = new lt(new Gn(0.025, 12, 12), new pt({ color: mo, transparent: true, opacity: 0.9, depthTest: false }));
        d.position.set(p[0], p[1], p[2]), d.renderOrder = 999, d.__isSelectionPt = true, dn.add(d);
      } else if (l === "seg") {
        const p = o[+r[0]], d = e[p == null ? void 0 : p[+r[1]]], m = e[p == null ? void 0 : p[+r[1] + 1]];
        if (!d || !m) continue;
        const f = new Ee().setFromPoints([new V(d[0], d[1], d[2]), new V(m[0], m[1], m[2])]), h = new Et(f, new ct({ color: mo, transparent: true, opacity: 0.95, depthTest: false }));
        h.renderOrder = 999, dn.add(h);
      } else if (l === "poly") {
        const d = o[+r[0]].map((h) => {
          const M = e[h];
          return M ? new V(M[0], M[1], M[2]) : null;
        }).filter(Boolean);
        if (d.length < 2) continue;
        const m = new Ee().setFromPoints(d), f = new Et(m, new ct({ color: mo, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, dn.add(f);
      } else if (l === "aux") {
        const p = n[+r[0]];
        if (!p || p.length !== 6) continue;
        const d = new Ee().setFromPoints([new V(p[0], p[1], p[2]), new V(p[3], p[4], p[5])]), m = new Et(d, new ct({ color: mo, transparent: true, opacity: 0.95, depthTest: false }));
        m.renderOrder = 999, dn.add(m);
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
    Ne.clear();
    for (const o of e) Ne.add(o);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), Ne.size;
  }, window.__hekatanClearSelection = () => {
    Ne.clear(), Ot();
  };
  const Jn = (e, o, s, n, a, c, i, l, r) => {
    const p = i - n, d = l - a, m = r - c, f = p * p + d * d + m * m;
    if (f < 1e-12) return Math.hypot(e - n, o - a, s - c);
    let h = ((e - n) * p + (o - a) * d + (s - c) * m) / f;
    h = Math.max(0, Math.min(1, h));
    const M = n + h * p, _ = a + h * d, w = c + h * m;
    return Math.hypot(e - M, o - _, s - w);
  }, Xo = (e, o, s, n) => {
    if (!t.polylines) return null;
    const a = t.polylines.rawVal, c = t.points.rawVal;
    let i = -1, l = -1, r = n;
    for (let p = 0; p < a.length; p++) {
      const d = a[p];
      for (let m = 0; m < d.length - 1; m++) {
        const f = c[d[m]], h = c[d[m + 1]];
        if (!f || !h) continue;
        const M = Jn(e, o, s, f[0], f[1], f[2], h[0], h[1], h[2]);
        M < r && (r = M, i = p, l = m);
      }
    }
    return i >= 0 ? { polyIdx: i, segIdx: l, dist: r } : null;
  }, ks = (e, o, s, n) => {
    const a = window.__hekatanDrawingAuxLines, c = (a == null ? void 0 : a.rawVal) ?? (a == null ? void 0 : a.val) ?? a ?? [];
    let i = -1, l = n;
    for (let r = 0; r < c.length; r++) {
      const p = c[r];
      if (!p || p.length !== 6) continue;
      const d = Jn(e, o, s, p[0], p[1], p[2], p[3], p[4], p[5]);
      d < l && (l = d, i = r);
    }
    return i;
  }, ka = (e) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[e];
    if (!n || n.length !== 6) {
      Zt.visible = false;
      return;
    }
    Zt.geometry.setFromPoints([new V(n[0], n[1], n[2]), new V(n[3], n[4], n[5])]), Zt.visible = true;
  }, Sa = (e, o = -1) => {
    var _a3, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal[e], n = t.points.rawVal;
    if (!s || s.length < 2) {
      Zt.visible = false;
      return;
    }
    const a = ((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false, c = [];
    if (a || o < 0 || o >= s.length - 1) for (const i of s) {
      const l = n[i];
      l && c.push(new V(l[0], l[1], l[2]));
    }
    else {
      const i = n[s[o]], l = n[s[o + 1]];
      i && c.push(new V(i[0], i[1], i[2])), l && c.push(new V(l[0], l[1], l[2]));
    }
    Zt.geometry.setFromPoints(c), Zt.visible = true;
  }, wo = (e) => {
    var _a3;
    if (!t.polylines) return;
    const o = t.polylines.rawVal;
    if (e < 0 || e >= o.length) return;
    const s = o.filter((r, p) => p !== e), n = /* @__PURE__ */ new Set();
    for (const r of s) for (const p of r) n.add(p);
    const a = t.points.rawVal, c = /* @__PURE__ */ new Map(), i = [];
    for (let r = 0; r < a.length; r++) n.has(r) && (c.set(r, i.length), i.push(a[r]));
    const l = s.map((r) => r.map((p) => c.get(p)).filter((p) => p !== void 0));
    t.points.val = i, t.polylines.val = l, t.areas && (t.areas.val = t.areas.rawVal.filter((r) => r !== e).map((r) => r > e ? r - 1 : r)), Zt.visible = false, ln = -1, gn = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, Ss = (e, o) => {
    var _a3, _b, _c;
    if (!t.polylines) return;
    const s = t.polylines.rawVal;
    if (e < 0 || e >= s.length) return;
    if (((_b = (_a3 = t.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(e)) ?? false) {
      wo(e);
      return;
    }
    const a = s[e];
    if (o < 0 || o >= a.length - 1) return;
    if (a.length === 2) {
      wo(e);
      return;
    }
    let c;
    o === 0 ? c = [a.slice(1)] : o === a.length - 2 ? c = [a.slice(0, -1)] : c = [a.slice(0, o + 1), a.slice(o + 1)];
    const i = [...s.slice(0, e), ...c, ...s.slice(e + 1)], l = /* @__PURE__ */ new Set();
    for (const f of i) for (const h of f) l.add(h);
    const r = t.points.rawVal, p = /* @__PURE__ */ new Map(), d = [];
    for (let f = 0; f < r.length; f++) l.has(f) && (p.set(f, d.length), d.push(r[f]));
    const m = i.map((f) => f.map((h) => p.get(h)).filter((h) => h !== void 0));
    if (t.points.val = d, t.polylines.val = m, t.areas) {
      const f = c.length - 1;
      t.areas.val = t.areas.rawVal.map((h) => h > e ? h + f : h);
    }
    Zt.visible = false, ln = -1, gn = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  Le.geometry.setAttribute("position", new $t(t.points.rawVal.flat(), 3)), Le.geometry.computeBoundingSphere(), Le.frustumCulled = false, De.frustumCulled = false, v.add(De), ne.position.set(0, 0, 0), ne.rotateX(Math.PI / 2), ne.geometry.rotateX(Math.PI / 2), ne.updateMatrixWorld(), t.polylines && (t.polylines.val = [...t.polylines.rawVal, []]), window.__hekatanDrawAt = (e, o, s) => {
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
  const yo = [];
  window.__hekatanCirculos = yo;
  let Ps = [], Cs = "";
  const zs = () => {
    var _a3;
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = `${e.length}|${o.length}|${o.reduce((a, c) => a + c.length, 0)}`;
    if (s === Cs) return Ps;
    Cs = s;
    const n = [];
    for (const a of o) {
      const c = a.length;
      if (c < 6 || a[0] !== a[c - 1]) continue;
      const i = a.slice(0, c - 1).map((d) => e[d]).filter(Boolean);
      if (i.length < 5) continue;
      const l = [0, 1, 2].map((d) => i.reduce((m, f) => m + f[d], 0) / i.length), r = i.map((d) => Math.hypot(d[0] - l[0], d[1] - l[1], d[2] - l[2])), p = r.reduce((d, m) => d + m, 0) / r.length;
      p < 1e-9 || r.some((d) => Math.abs(d - p) > 5e-3 * p) || n.push({ c: l, r: p });
    }
    return Ps = n;
  };
  window.__hekatanCentrosDeducidos = zs;
  const xo = () => !!window.__hekatanCurvasAux, go = (e, o) => {
    const s = window.__hekatanDrawingAuxLines;
    if (!s) return 0;
    vt();
    const n = s.rawVal ?? s.val ?? [], a = [];
    for (let c = 0; c + 1 < e.length; c++) a.push([...e[c], ...e[c + 1]]);
    return o && e.length > 2 && a.push([...e[e.length - 1], ...e[0]]), s.val = [...n, ...a], a.length;
  };
  window.__hekatanDrawCircle = (e, o, s, n, a = window.__hekatanArcSegs ?? 12, c = "xy") => {
    var _a3;
    const i = Math.max(4, Math.round(a)), l = t.points.rawVal.length, r = [];
    for (let p = 0; p < i; p++) {
      const d = 2 * Math.PI * p / i, m = n * Math.cos(d), f = n * Math.sin(d);
      let h;
      c === "xy" ? h = [e + m, o + f, s] : c === "xz" ? h = [e + m, o, s + f] : h = [e, o + m, s + f], r.push(h);
    }
    if (yo.push({ c: [e, o, s], r: n }), xo()) {
      go(r, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...r], t.polylines) {
      const p = [...r.map((m, f) => l + f), l], d = t.polylines.rawVal;
      ((_a3 = d[d.length - 1]) == null ? void 0 : _a3.length) > 0 ? t.polylines.val = [...d, p, []] : t.polylines.val = [...d.slice(0, -1), p, []];
    }
  }, window.__hekatanDrawArc = (e, o, s, n = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const a = Math.max(4, Math.round(n)), c = new V(...e), i = new V(...o), l = new V(...s), r = new V().subVectors(i, c), p = new V().subVectors(l, c), d = new V().crossVectors(r, p), m = 2 * d.lengthSq();
    let f;
    if (m < 1e-12) f = new V().addVectors(c, l).multiplyScalar(0.5);
    else {
      const me = p.clone().multiplyScalar(r.lengthSq()).sub(r.clone().multiplyScalar(p.lengthSq())), ke = new V().crossVectors(me, d);
      f = c.clone().add(ke.divideScalar(m));
    }
    const h = c.distanceTo(f), M = d.lengthSq() > 1e-12 ? d.clone().normalize() : new V(0, 1, 0), _ = new V().subVectors(c, f).normalize(), w = new V().crossVectors(M, _).normalize(), u = (me) => {
      const ke = new V().subVectors(me, f);
      return Math.atan2(ke.dot(w), ke.dot(_));
    }, x = (me) => {
      let ke = me;
      for (; ke < 0; ) ke += 2 * Math.PI;
      for (; ke >= 2 * Math.PI; ) ke -= 2 * Math.PI;
      return ke;
    }, g = x(u(i)), F = x(u(l)), k = g <= F ? F : F - 2 * Math.PI, P = t.points.rawVal.length, $ = [], T = (me) => {
      const ke = _.clone().multiplyScalar(Math.cos(me)).add(w.clone().multiplyScalar(Math.sin(me)));
      return f.clone().add(ke.multiplyScalar(h));
    }, I = String(window.__hekatanArcModo ?? "angulo"), Y = I === "x" ? 0 : I === "y" ? 1 : I === "z" ? 2 : -1;
    let te = false;
    if (Y >= 0) {
      const me = e[Y], ke = s[Y], et = 512;
      let Ye = Math.abs(ke - me) > 1e-9, Qe = me;
      for (let $e = 1; $e <= et && Ye; $e++) {
        const Ge = T(k * $e / et).getComponent(Y);
        (Ge - Qe) * (ke - me) < -1e-9 && (Ye = false), Qe = Ge;
      }
      if (Ye) {
        te = true;
        for (let $e = 0; $e <= a; $e++) {
          const Ge = me + (ke - me) * $e / a;
          let Re = 0, Ae = k;
          for (let Ue = 0; Ue < 60; Ue++) {
            const ut = (Re + Ae) / 2;
            (T(ut).getComponent(Y) - Ge) * (ke - me) < 0 ? Re = ut : Ae = ut;
          }
          const Be = T((Re + Ae) / 2);
          $.push([Be.x, Be.y, Be.z]);
        }
        $[0] = [e[0], e[1], e[2]], $[a] = [s[0], s[1], s[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${I.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!te) for (let me = 0; me <= a; me++) {
      const ke = T(k * (me / a));
      $.push([ke.x, ke.y, ke.z]);
    }
    if (yo.push({ c: [f.x, f.y, f.z], r: h }), xo()) {
      go($, false);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...$], t.polylines) {
      const me = $.map((et, Ye) => P + Ye), ke = t.polylines.rawVal;
      t.polylines.val = [...ke.slice(0, -1), me, []];
    }
  }, window.__hekatanDrawPolinomio = (e, o = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c, _d;
    const s = e.length;
    if (s < 2) return { ok: false, msg: "faltan puntos" };
    const n = Math.max(s - 1, Math.round(o)), a = (k) => Math.max(...e.map((P) => P[k])) - Math.min(...e.map((P) => P[k])), c = [a(0), a(1), a(2)], i = String(((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? ""), l = i === "xy" ? 2 : i === "xz" ? 1 : i === "yz" ? 0 : -1, r = l >= 0 && c[l] < 1e-6 ? l : c[2] <= c[0] && c[2] <= c[1] ? 2 : c[1] <= c[0] ? 1 : 0, p = r === 2 ? "xy" : r === 1 ? "xz" : "yz", d = [0, 1, 2].filter((k) => k !== r), [m, f] = c[d[0]] >= c[d[1]] ? d : [d[1], d[0]], h = e.map((k) => k[m]), M = e.map((k) => k[f]);
    for (let k = 0; k < s; k++) for (let P = k + 1; P < s; P++) if (Math.abs(h[k] - h[P]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[m]} en ${p.toUpperCase()}): no hay polinomio que pase por los dos` };
    const _ = (k) => {
      let P = 0;
      for (let $ = 0; $ < s; $++) {
        let T = 1;
        for (let I = 0; I < s; I++) I !== $ && (T *= (k - h[I]) / (h[$] - h[I]));
        P += M[$] * T;
      }
      return P;
    }, w = (() => {
      const k = s, P = h.map((I) => Array.from({ length: k }, (Y, te) => I ** te)), $ = M.slice();
      for (let I = 0; I < k; I++) {
        let Y = I;
        for (let te = I + 1; te < k; te++) Math.abs(P[te][I]) > Math.abs(P[Y][I]) && (Y = te);
        [P[I], P[Y]] = [P[Y], P[I]], [$[I], $[Y]] = [$[Y], $[I]];
        for (let te = I + 1; te < k; te++) {
          const me = P[te][I] / P[I][I];
          for (let ke = I; ke < k; ke++) P[te][ke] -= me * P[I][ke];
          $[te] -= me * $[I];
        }
      }
      const T = new Array(k).fill(0);
      for (let I = k - 1; I >= 0; I--) {
        let Y = $[I];
        for (let te = I + 1; te < k; te++) Y -= P[I][te] * T[te];
        T[I] = Y / P[I][I];
      }
      return T;
    })(), u = h[0], x = h[s - 1], g = t.points.rawVal.length, F = [];
    for (let k = 0; k <= n; k++) {
      const P = u + (x - u) * k / n, $ = [e[0][0], e[0][1], e[0][2]];
      $[m] = P, $[f] = _(P), $[r] = e[0][r], F.push($);
    }
    if (F[0] = [e[0][0], e[0][1], e[0][2]], F[n] = [e[s - 1][0], e[s - 1][1], e[s - 1][2]], xo()) return go(F, false), { ok: true, plano: p, coef: w, ia: m, io: f };
    if (t.points.val = [...t.points.rawVal, ...F], t.polylines) {
      const k = F.map(($, T) => g + T), P = t.polylines.rawVal;
      t.polylines.val = ((_d = P[P.length - 1]) == null ? void 0 : _d.length) > 0 ? [...P, k, []] : [...P.slice(0, -1), k, []];
    }
    return { ok: true, plano: p, coef: w, ia: m, io: f };
  };
  const As = () => {
    var _a3, _b;
    const e = t.points.rawVal, o = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], s = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), n = window.__hekatanDrawingAuxLines, a = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? [], c = [], i = [], l = /* @__PURE__ */ new Set(), r = (p) => [e[p][0], e[p][1], e[p][2]];
    return [...Ne].forEach((p) => {
      const d = p.split(":");
      if (d[0] === "aux") {
        const f = a[+d[1]];
        f && f.length === 6 && (c.push([[f[0], f[1], f[2]], [f[3], f[4], f[5]]]), i.push(p));
        return;
      }
      const m = d[0] === "poly" || d[0] === "seg" ? +d[1] : -1;
      if (!(m < 0 || !o[m] || s.has(m))) if (d[0] === "poly") {
        if (l.has(m)) return;
        l.add(m);
        for (let f = 0; f + 1 < o[m].length; f++) c.push([r(o[m][f]), r(o[m][f + 1])]);
      } else {
        const f = o[m][+d[2]], h = o[m][+d[2] + 1];
        f != null && h != null && !l.has(m) && c.push([r(f), r(h)]);
      }
    }), { segs: c, auxIds: i };
  }, Qn = (e, o) => Math.abs(e[0] - o[0]) < 1e-6 && Math.abs(e[1] - o[1]) < 1e-6 && Math.abs(e[2] - o[2]) < 1e-6, Pa = (e) => {
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
          const [r, p] = e[l], d = a[a.length - 1], m = a[0];
          Qn(r, d) ? (a.push(p), o[l] = true, c = true) : Qn(p, d) ? (a.push(r), o[l] = true, c = true) : Qn(p, m) ? (a.unshift(r), o[l] = true, c = true) : Qn(r, m) && (a.unshift(p), o[l] = true, c = true);
        }
      }
      const i = a.length > 3 && Qn(a[0], a[a.length - 1]);
      i && a.pop(), s.push({ pts: a, cerrada: i });
    }
    return s;
  }, Yo = (e, o) => {
    let s = e.findIndex((n) => Math.abs(n[0] - o[0]) < 1e-3 && Math.abs(n[1] - o[1]) < 1e-3 && Math.abs(n[2] - o[2]) < 1e-3);
    return s < 0 && (s = e.length, e.push(o)), s;
  }, Fs = (e) => {
    if (!e.length) return 0;
    Ne.clear(), e.forEach((s) => Ne.add(s));
    const o = e.length;
    return Wo(), Ne.clear(), o;
  };
  window.__hekatanRevolveSelection = (e, o, s, n = 360) => {
    var _a3, _b, _c;
    const a = Math.max(3, Math.round(s || 16)), c = Math.abs(n - 360) < 1e-9, i = a, l = c ? a : a + 1, { segs: r, auxIds: p } = As();
    if (!r.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (c && a % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    vt();
    const d = t.points.rawVal, m = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], f = [...d];
    let h = m.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], _ = /* @__PURE__ */ new Map(), w = ($) => $.map((T) => Math.round(T * 1e4)).join(","), u = ($) => Math.hypot($[0] - e, $[1] - o) < 1e-6, x = ($) => {
      const T = w($);
      let I = _.get(T);
      if (I) return I;
      if (u($)) return I = [Yo(f, $)], _.set(T, I), I;
      const Y = Math.hypot($[0] - e, $[1] - o), te = Math.atan2($[1] - o, $[0] - e);
      I = [];
      for (let me = 0; me < l; me++) {
        const ke = te + n * Math.PI / 180 * me / a;
        I.push(Yo(f, me === 0 ? $ : [e + Y * Math.cos(ke), o + Y * Math.sin(ke), $[2]]));
      }
      return _.set(T, I), I;
    };
    let g = 0, F = false;
    const k = ($) => {
      M.push(h.length), h.push([...$, $[0]]), g++;
    };
    for (const [$, T] of r) {
      const I = x($), Y = x(T);
      if (!(I.length === 1 && Y.length === 1)) {
        if (I.length === 1 || Y.length === 1) {
          F = true;
          const te = I.length === 1 ? I[0] : Y[0], me = I.length === 1 ? Y : I;
          for (let ke = 0; ke + 2 <= i; ke += 2) k([te, me[ke % l], me[(ke + 1) % l], me[(ke + 2) % l]]);
          continue;
        }
        for (let te = 0; te < i; te++) k([I[te], Y[te], Y[(te + 1) % l], I[(te + 1) % l]]);
      }
    }
    h.push([]), t.points.val = f, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    const P = Fs(p);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { anillos: _.size, areas: g, polo: F, guias: P };
  }, window.__hekatanLoftSelection = (e, o) => {
    var _a3, _b, _c;
    const { segs: s, auxIds: n } = As(), a = Pa(s), c = (Y) => Y.pts.every((te) => Math.abs(te[2] - Y.pts[0][2]) < 1e-6), i = a.find((Y) => Y.cerrada && c(Y)), l = a.find((Y) => !Y.cerrada && Y.pts.length >= 2 && !c(Y));
    if (!i) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!l) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const r = i.pts, p = r.length, d = l.pts.slice();
    d[d.length - 1][2] < d[0][2] && d.reverse();
    let m = 0;
    for (let Y = 0; Y < p; Y++) {
      const te = r[Y], me = r[(Y + 1) % p];
      m += te[0] * me[1] - me[0] * te[1];
    }
    const f = m > 0 ? 1 : -1, h = (Y) => {
      const te = r[(Y - 1 + p) % p], me = r[Y], ke = r[(Y + 1) % p], et = [me[0] - te[0], me[1] - te[1]], Ye = [ke[0] - me[0], ke[1] - me[1]], Qe = Math.hypot(et[0], et[1]) || 1, $e = Math.hypot(Ye[0], Ye[1]) || 1, Ge = [f * et[1] / Qe, -f * et[0] / Qe], Re = [f * Ye[1] / $e, -f * Ye[0] / $e], Ae = 1 + (Ge[0] * Re[0] + Ge[1] * Re[1]);
      return [(Ge[0] + Re[0]) / Math.max(Ae, 1e-6), (Ge[1] + Re[1]) / Math.max(Ae, 1e-6)];
    }, M = r.map((Y, te) => h(te)), _ = d[0];
    let w = [0, 0], u = 0;
    for (const Y of d) {
      const te = Y[0] - _[0], me = Y[1] - _[1], ke = Math.hypot(te, me);
      ke > u && (u = ke, w = [te / ke, me / ke]);
    }
    if (u < 1e-9) {
      const Y = _[0] - e, te = _[1] - o, me = Math.hypot(Y, te) || 1;
      w = [Y / me, te / me];
    }
    w[0] * (_[0] - e) + w[1] * (_[1] - o) < 0 && (w = [-w[0], -w[1]]), vt();
    const x = t.points.rawVal, g = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], F = [...x];
    let k = g.slice();
    k.length && k[k.length - 1].length === 0 && (k = k.slice(0, -1));
    const P = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], $ = d.map((Y) => {
      const te = (Y[0] - _[0]) * w[0] + (Y[1] - _[1]) * w[1], me = Y[2];
      return r.map((ke, et) => Yo(F, [ke[0] + M[et][0] * te, ke[1] + M[et][1] * te, me]));
    });
    let T = 0;
    for (let Y = 0; Y + 1 < $.length; Y++) for (let te = 0; te < p; te++) {
      const me = [$[Y][te], $[Y][(te + 1) % p], $[Y + 1][(te + 1) % p], $[Y + 1][te]];
      new Set(me).size < 4 || (P.push(k.length), k.push([...me, me[0]]), T++);
    }
    k.push([]), t.points.val = F, t.polylines && (t.polylines.val = k), t.areas && (t.areas.val = P);
    const I = Fs(n);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return C(), { contorno: p, perfil: d.length, areas: T, guias: I };
  }, window.__hekatanDrawSlabChaflan = (e, o, s = 1, n = 6, a = 6) => {
    const c = Math.min(e[0], o[0]), i = Math.max(e[0], o[0]), l = Math.min(e[1], o[1]), r = Math.max(e[1], o[1]), p = (e[2] + o[2]) / 2, d = i - c, m = r - l, f = Math.min(s, d / 2 - 0.01, m / 2 - 0.01);
    if (f <= 0) return;
    const h = t.points.rawVal.length, M = [], _ = [], w = (u, x) => {
      M.push([u, x, p]), _.push(h + M.length - 1);
    };
    for (let u = 0; u <= a; u++) w(c + f + (d - 2 * f) * u / a, l);
    for (let u = 1; u <= n; u++) {
      const x = -Math.PI / 2 + Math.PI / 2 * u / n;
      w(i - f + f * Math.cos(x), l + f + f * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) w(i, l + f + (m - 2 * f) * u / a);
    for (let u = 1; u <= n; u++) {
      const x = 0 + Math.PI / 2 * u / n;
      w(i - f + f * Math.cos(x), r - f + f * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) w(i - f - (d - 2 * f) * u / a, r);
    for (let u = 1; u <= n; u++) {
      const x = Math.PI / 2 + Math.PI / 2 * u / n;
      w(c + f + f * Math.cos(x), r - f + f * Math.sin(x));
    }
    for (let u = 1; u <= a; u++) w(c, r - f - (m - 2 * f) * u / a);
    for (let u = 1; u < n; u++) {
      const x = Math.PI + Math.PI / 2 * u / n;
      w(c + f + f * Math.cos(x), l + f + f * Math.sin(x));
    }
    if (_.push(h), xo()) {
      go(M, true);
      return;
    }
    if (t.points.val = [...t.points.rawVal, ...M], t.polylines) {
      const u = t.polylines.rawVal;
      t.polylines.val = [...u.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRect = (e, o) => {
    const s = t.points.rawVal.length, n = e[0], a = e[1], c = e[2], i = o[0], l = o[1], r = o[2];
    let p;
    if (Math.abs(c - r) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, l, c], [n, l, c]] : Math.abs(a - l) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, a, r], [n, a, r]] : p = [[n, a, c], [n, l, c], [n, l, r], [n, a, r]], t.points.val = [...t.points.rawVal, ...p], t.polylines) {
      const d = [s, s + 1, s + 2, s + 3, s], m = t.polylines.rawVal;
      t.polylines.val = [...m.slice(0, -1), d, []];
    }
  }, window.__hekatanDrawRectArea = (e, o) => {
    var _a3;
    const s = t.points.rawVal.length, n = e[0], a = e[1], c = e[2], i = o[0], l = o[1], r = o[2];
    let p;
    if (U && t.gridTarget) {
      const d = t.gridTarget.rawVal, m = new so(...d.rotation), f = new V(1, 0, 0).applyEuler(m), h = new V(0, 1, 0).applyEuler(m), M = new V(...d.position), _ = new V(n, a, c), w = new V(i, l, r), u = _.clone().sub(M).dot(f), x = _.clone().sub(M).dot(h), g = w.clone().sub(M).dot(f), F = w.clone().sub(M).dot(h), k = (P, $) => M.clone().addScaledVector(f, P).addScaledVector(h, $).toArray();
      p = [k(u, x), k(g, x), k(g, F), k(u, F)];
    } else Math.abs(c - r) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, l, c], [n, l, c]] : Math.abs(a - l) < 1e-6 ? p = [[n, a, c], [i, a, c], [i, a, r], [n, a, r]] : p = [[n, a, c], [n, l, c], [n, l, r], [n, a, r]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...p], t.polylines) {
      const d = t.polylines.rawVal, m = d.length - 1, f = [s, s + 1, s + 2, s + 3, s];
      t.polylines.val = [...d.slice(0, -1), f, []], t.areas && (t.areas.val = [...t.areas.rawVal, m]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = t.points.rawVal, s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = (w) => w.map((u) => Math.round(u * 1e4) / 1e4).join(",");
    for (let w = 0; w < o.length; w++) {
      const u = a(o[w]), x = s.get(u);
      x === void 0 && s.set(u, w), n.set(w, x ?? w);
    }
    const c = e.map((w) => w.map((u) => n.get(u) ?? u)), i = /* @__PURE__ */ new Map(), l = (w, u) => {
      w !== u && ((i.get(w) ?? i.set(w, /* @__PURE__ */ new Set()).get(w)).add(u), (i.get(u) ?? i.set(u, /* @__PURE__ */ new Set()).get(u)).add(w));
    };
    for (const w of c) for (let u = 0; u + 1 < w.length; u++) l(w[u], w[u + 1]);
    const r = (w, u) => {
      var _a4;
      return !!((_a4 = i.get(w)) == null ? void 0 : _a4.has(u));
    }, p = /* @__PURE__ */ new Set(), d = [], m = [...i.keys()];
    for (const w of m) for (const u of i.get(w)) if (!(u < w)) {
      for (const x of i.get(u)) if (x !== w) for (const g of i.get(x)) {
        if (g === w || g === u || !r(g, w) || r(w, x) || r(u, g)) continue;
        const F = [w, u, x, g].slice().sort((k, P) => k - P).join("-");
        p.has(F) || (p.add(F), d.push([w, u, x, g]));
      }
    }
    for (const w of m) for (const u of i.get(w)) if (!(u < w)) for (const x of i.get(u)) {
      if (x === w || !r(x, w)) continue;
      const g = [w, u, x].slice().sort((F, k) => F - k).join("-");
      p.has(g) || (p.add(g), d.push([w, u, x]));
    }
    if (!d.length) return 0;
    const f = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []], h = new Set(f.map((w) => [...new Set(c[w] ?? [])].sort((u, x) => u - x).join("-"))), M = [...c];
    let _ = 0;
    for (const w of d) {
      const u = w.slice().sort((x, g) => x - g).join("-");
      h.has(u) || (h.add(u), M.push([...w, w[0]]), f.push(M.length - 1), _++);
    }
    if (_) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), t.polylines.val = M, t.areas && (t.areas.val = f);
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
    for (let Ae = 0; Ae < s; Ae++) {
      const Be = e[Ae], Ue = e[(Ae + 1) % s];
      n += (Be[1] - Ue[1]) * (Be[2] + Ue[2]), a += (Be[2] - Ue[2]) * (Be[0] + Ue[0]), c += (Be[0] - Ue[0]) * (Be[1] + Ue[1]);
    }
    const i = Math.hypot(n, a, c) || 1;
    n /= i, a /= i, c /= i;
    let l = e[1][0] - e[0][0], r = e[1][1] - e[0][1], p = e[1][2] - e[0][2];
    const d = Math.hypot(l, r, p) || 1;
    l /= d, r /= d, p /= d;
    let m = a * p - c * r, f = c * l - n * p, h = n * r - a * l;
    const M = Math.hypot(m, f, h) || 1;
    m /= M, f /= M, h /= M;
    const _ = e[0], w = (Ae) => [(Ae[0] - _[0]) * l + (Ae[1] - _[1]) * r + (Ae[2] - _[2]) * p, (Ae[0] - _[0]) * m + (Ae[1] - _[1]) * f + (Ae[2] - _[2]) * h], u = (Ae, Be) => [_[0] + Ae * l + Be * m, _[1] + Ae * r + Be * f, _[2] + Ae * p + Be * h], x = e.map(w);
    let g = 1 / 0, F = -1 / 0, k = 1 / 0, P = -1 / 0;
    for (const [Ae, Be] of x) Ae < g && (g = Ae), Ae > F && (F = Ae), Be < k && (k = Be), Be > P && (P = Be);
    const $ = F - g, T = P - k;
    if ($ < 1e-6 || T < 1e-6) return 0;
    let I = o && o > 0 ? o : 0.5;
    for (; $ / I * (T / I) > 2500; ) I *= 2;
    I = Math.min(I, Math.min($, T));
    const Y = (Ae, Be) => {
      let Ue = false;
      for (let ut = 0, yt = x.length - 1; ut < x.length; yt = ut++) {
        const [Ft, tn] = x[ut], [Kn, In] = x[yt];
        tn > Be != In > Be && Ae < (Kn - Ft) * (Be - tn) / (In - tn) + Ft && (Ue = !Ue);
      }
      return Ue;
    }, te = Math.max(1, Math.round($ / I)), me = Math.max(1, Math.round(T / I)), ke = $ / te, et = T / me, Ye = /* @__PURE__ */ new Map(), Qe = [], $e = t.points.rawVal.length, Ge = (Ae, Be) => {
      const Ue = Ae + "," + Be, ut = Ye.get(Ue);
      if (ut !== void 0) return ut;
      const yt = $e + Qe.length;
      return Qe.push(u(g + Ae * ke, k + Be * et)), Ye.set(Ue, yt), yt;
    }, Re = [];
    for (let Ae = 0; Ae < te; Ae++) for (let Be = 0; Be < me; Be++) {
      if (!Y(g + (Ae + 0.5) * ke, k + (Be + 0.5) * et)) continue;
      const Ue = Ge(Ae, Be), ut = Ge(Ae + 1, Be), yt = Ge(Ae + 1, Be + 1), Ft = Ge(Ae, Be + 1);
      Re.push([Ue, ut, yt, Ft]);
    }
    if (!Re.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), t.points.val = [...t.points.rawVal, ...Qe], t.polylines && t.areas) {
      let Ae = t.polylines.rawVal.slice();
      Ae.length && Ae[Ae.length - 1].length === 0 && (Ae = Ae.slice(0, -1));
      const Be = [];
      for (const Ue of Re) Be.push(Ae.length), Ae.push([Ue[0], Ue[1], Ue[2], Ue[3], Ue[0]]);
      Ae.push([]), t.polylines.val = Ae, t.areas.val = [...t.areas.rawVal, ...Be];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), Re.length;
  };
  const vo = () => {
    if (at.length < 3) return at = [], it.visible = false, C(), 0;
    const e = window.__hekatanMeshPolyArea(at.slice());
    return at = [], it.visible = false, C(), e;
  };
  window.__hekatanFinalizePolyArea = vo, window.__hekatanSetInclinedPlaneFrom3 = (e, o, s) => {
    var _a3;
    const n = new V(e[0], e[1], e[2]), a = new V(o[0], o[1], o[2]), c = new V(s[0], s[1], s[2]), i = new V().subVectors(a, n).cross(new V().subVectors(c, n));
    if (i.lengthSq() < 1e-9) return false;
    i.normalize();
    const l = new rs().setFromUnitVectors(new V(0, 0, 1), i), r = new so().setFromQuaternion(l);
    t.gridTarget && (t.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [r.x, r.y, r.z] }), U = true;
    const p = new V().addVectors(n, a).add(c).multiplyScalar(1 / 3), d = Math.max(n.distanceTo(a), n.distanceTo(c), a.distanceTo(c)) * 2.2 + 4, m = d / 2;
    Lt.geometry.dispose(), Lt.geometry = new _n(d, d), hn.geometry.dispose(), hn.geometry = new js(new _n(d, d)), co(m, 1), zt.position.copy(p), zt.quaternion.copy(l), zt.scale.set(1, 1, 1), zt.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return C(), true;
  }, window.__hekatanResetPlaneXY = () => {
    t.gridTarget && (t.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), U = false, zt.visible = false, C();
  };
  const jt = new rt();
  jt.visible = false, v.add(jt), window.__hekatanShowAxes = (e, o, s = 12, n = 2) => {
    var _a3, _b;
    for (; jt.children.length; ) {
      const d = jt.children.pop();
      (_a3 = d.geometry) == null ? void 0 : _a3.dispose(), (_b = d.material) == null ? void 0 : _b.dispose();
    }
    if (!e.length || !o.length) return;
    const a = Math.min(...o) - n, c = Math.max(...o) + n, i = Math.min(...e) - n, l = Math.max(...e) + n, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", p = (d, m, f, h, M) => {
      const _ = document.createElement("canvas");
      _.width = 64, _.height = 32;
      const w = _.getContext("2d");
      w.fillStyle = M, w.font = "bold 22px sans-serif", w.textAlign = "center", w.fillText(d, 32, 26);
      const u = new ea(_), x = new ta({ map: u, transparent: true }), g = new na(x);
      return g.position.set(m, f, h), g.scale.set(1.2, 0.6, 1), g;
    };
    e.forEach((d, m) => {
      const f = m < r.length ? r[m] : `X${m}`, h = new Ee().setFromPoints([new V(d, a, 0), new V(d, c, 0), new V(d, a, 0), new V(d, a, s)]), M = new oo({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), _ = new Ht(h, M);
      _.computeLineDistances(), jt.add(_), jt.add(p(f, d, a - 0.5, 0, "#60a5fa")), jt.add(p(f, d, c + 0.5, 0, "#60a5fa"));
    }), o.forEach((d, m) => {
      const f = `${m + 1}`, h = new Ee().setFromPoints([new V(i, d, 0), new V(l, d, 0), new V(i, d, 0), new V(i, d, s)]), M = new oo({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), _ = new Ht(h, M);
      _.computeLineDistances(), jt.add(_), jt.add(p(f, i - 0.5, d, 0, "#fb7185")), jt.add(p(f, l + 0.5, d, 0, "#fb7185"));
    }), jt.visible = true, C();
  }, window.__hekatanHideAxes = () => {
    jt.visible = false, C();
  };
  const xn = new rt();
  xn.visible = false, v.add(xn);
  let Nn = [];
  window.__hekatanShowRefPlanes = (e = [0, 3, 6, 9, 12], o = 20, s = 0, n = 0) => {
    var _a3, _b;
    for (; xn.children.length; ) {
      const c = xn.children.pop();
      (_a3 = c.geometry) == null ? void 0 : _a3.dispose(), (_b = c.material) == null ? void 0 : _b.dispose();
    }
    Nn.forEach((c) => {
      v.remove(c), c.geometry.dispose(), c.material.dispose();
    }), Nn = [];
    const a = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    e.forEach((c, i) => {
      const l = a[i % a.length], r = o / 2, p = [new V(s - r, n - r, c), new V(s + r, n - r, c), new V(s + r, n + r, c), new V(s - r, n + r, c), new V(s - r, n - r, c)], d = new Ee().setFromPoints(p), m = new ct({ color: l, transparent: true, opacity: 0.55 });
      xn.add(new Et(d, m));
      const f = document.createElement("canvas");
      f.width = 128, f.height = 32;
      const h = f.getContext("2d");
      h.fillStyle = `#${l.toString(16).padStart(6, "0")}`, h.font = "bold 18px sans-serif", h.fillText(`Z = ${c} m`, 4, 22);
      const M = new ea(f), _ = new ta({ map: M, transparent: true }), w = new na(_);
      w.position.set(s - r - 1.5, n - r - 1.5, c), w.scale.set(2.5, 0.6, 1), xn.add(w);
      const u = new _n(1e4, 1e4), x = new pt({ visible: false, side: Vt }), g = new lt(u, x);
      g.position.set(0, 0, c), g.frustumCulled = false, g.userData = { refPlaneZ: c }, v.add(g), Nn.push(g);
    }), xn.visible = true, C();
  }, window.__hekatanHideRefPlanes = () => {
    xn.visible = false, Nn.forEach((e) => {
      e.visible = false;
    }), C();
  };
  const On = new rt();
  On.frustumCulled = false, v.add(On);
  const Ca = () => {
    var _a3, _b, _c, _d;
    for (; On.children.length; ) {
      const s = On.children.pop();
      (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxLines, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (s.length !== 6) continue;
      const n = new Ee().setFromPoints([new V(s[0], s[1], s[2]), new V(s[3], s[4], s[5])]), a = new oo({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), c = new Et(n, a);
      c.computeLineDistances(), On.add(c);
    }
  };
  ce.derive(() => {
    const e = window.__hekatanDrawingAuxLines;
    (e == null ? void 0 : e.val) && (e.val, Ca(), C());
  });
  const Xn = new rt();
  Xn.frustumCulled = false, v.add(Xn);
  const Es = () => {
    var _a3, _b, _c, _d;
    for (; Xn.children.length; ) {
      const s = Xn.children.pop();
      (_b = (_a3 = s.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = s.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const e = window.__hekatanDrawingAuxPoints, o = (e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? e ?? [];
    for (const s of o) {
      if (!s || s.length !== 3) continue;
      const n = new lt(new Gn(0.025, 12, 12), new pt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(s[0], s[1], s[2]), n.renderOrder = 996, n.scale.setScalar(ho(n.position)), Xn.add(n);
    }
  };
  ce.derive(() => {
    const e = window.__hekatanDrawingAuxPoints;
    (e == null ? void 0 : e.val) !== void 0 && (e.val, Es(), C());
  }), S.addEventListener("change", () => {
    Xn.children.forEach((e) => {
      e.scale.setScalar(ho(e.position));
    });
  }), window.__hekatanRenderAuxPoints = Es;
  const ht = new rt(), za = new lt(new Gn(0.01, 12, 12), new pt({ color: 16777215, transparent: true, opacity: 0.95 })), Vs = new lt(new Gn(0.015, 12, 12), new pt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Vs.visible = false, ht.add(za, Vs);
  const Yn = 0.08, Uo = (e, o, s) => {
    const n = new Ee().setFromPoints([new V(...e), new V(...o)]);
    return new Et(n, new ct({ color: s, transparent: true, opacity: 0.7 }));
  };
  ht.add(Uo([-Yn, 0, 0], [Yn, 0, 0], 16777215)), ht.add(Uo([0, -Yn, 0], [0, Yn, 0], 16777215)), ht.add(Uo([0, 0, -Yn], [0, 0, Yn], 16777215)), ht.visible = false, ht.frustumCulled = false, v.add(ht);
  let Zo = 2;
  const Mo = (e) => {
    const o = b(), s = (E == null ? void 0 : E.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / s : 2 * o.position.distanceTo(e) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / s;
  }, jn = () => {
    if (!ht.visible) return;
    const e = Zo * Mo(ht.position) / 0.015;
    ht.scale.setScalar(Math.max(1e-4, Math.min(1e5, e)));
  };
  let Mn = 10;
  const qo = (e) => Math.max(1e-4, Mn * Mo(e));
  window.__hekatanAperturaPx = (e) => (typeof e == "number" && e > 0 && (Mn = e), Mn), window.__hekatanUpdateSnapScale = jn, window.__hekatanSnapMarker = ht, window.__hekatanMetrosPorPixel = Mo, window.__hekatanSnapPx = (e) => (typeof e == "number" && e > 0 && (Zo = e, jn(), C()), Zo);
  const $s = () => {
    dn.children.length !== 0 && dn.children.forEach((e) => {
      if (!e.__isSelectionPt) return;
      const o = e;
      o.scale.setScalar(ho(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = $s, S.addEventListener("change", () => {
    var _a3;
    jn(), Qt.visible && _s(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), $s();
  }), window.__hekatanShowSnap = (e, o, s) => {
    ht.position.set(e, o, s), ht.visible = true, jn(), C();
  }, window.__hekatanHideSnap = () => {
    ht.visible = false, C();
  }, E.addEventListener("pointermove", (e) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y;
    window.__hekatanCursorPx = { x: e.clientX, y: e.clientY };
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o), Z = null;
    const s = ge();
    if ((!s.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && mt.visible && (mt.visible = false), s.length) {
      const n = s[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const h = fn([n.x, n.y, n.z]);
        if (h) {
          const M = h.map((u) => t.points.rawVal[u]), _ = [];
          for (let u = 1; u < M.length - 1; u++) _.push(M[0][0], M[0][1], M[0][2], M[u][0], M[u][1], M[u][2], M[u + 1][0], M[u + 1][1], M[u + 1][2]);
          const w = mt.geometry;
          w.setAttribute("position", new $t(_, 3)), w.computeVertexNormals(), mt.visible = true;
        } else mt.visible = false;
      } else mt.visible && (mt.visible = false);
      const a = e.altKey;
      let c = false;
      const i = qo(n), l = a ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, n.x, n.y, n.z, i, { x: e.clientX, y: e.clientY });
      if (l) ko(l.type, l.x, l.y, l.z), ht.position.set(l.x, l.y, l.z), ht.visible = true, n.set(l.x, l.y, l.z), Po(l.type, e.clientX, e.clientY);
      else if (!a && (Se = Ce(e.clientX, e.clientY))) c = true, n.copy(Se), ko("ifcSec", n.x, n.y, n.z), Po("ifcSec", e.clientX, e.clientY), ht.position.copy(n), ht.visible = true;
      else if (de && !a) c = true, ko(de.tipo, n.x, n.y, n.z), Po(de.tipo, e.clientX, e.clientY), ht.position.copy(n), ht.visible = true;
      else {
        Va(), So();
        const f = !a && window.__hekatanSnapEnabled !== false, h = ((_h = window.__hekatanGridConfig) == null ? void 0 : _h.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        f && h > 0 && (n.x = Math.round(n.x / h) * h, n.y = Math.round(n.y / h) * h, n.z = Math.round(n.z / h) * h), ht.position.copy(n), ht.visible = true;
      }
      jn(), W(Z && !l && (c || de) ? H(Z) : null), Tt = { p: n.clone(), x: e.clientX, y: e.clientY };
      const r = ((_k = (_j = (_i2 = window.__hekatanCadState) == null ? void 0 : _i2.get) == null ? void 0 : _j.call(_i2)) == null ? void 0 : _k.tool) ?? "select";
      if (r === "select" || !r) {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = _a(n.x, n.y, n.z, f), M = Xo(n.x, n.y, n.z, f), _ = ks(n.x, n.y, n.z, f);
        if (h >= 0) {
          const g = t.points.rawVal[h];
          Qt.position.set(g[0], g[1], g[2]), Qt.visible = true, _s(), cn.visible = false, un = { kind: "pt", a: h };
        } else if (M) {
          const g = t.points.rawVal, F = t.polylines.rawVal[M.polyIdx], k = g[F[M.segIdx]], P = g[F[M.segIdx + 1]];
          cn.geometry.setFromPoints([new V(k[0], k[1], k[2]), new V(P[0], P[1], P[2])]), cn.visible = true, Qt.visible = false, un = ((_m = (_l = t.areas) == null ? void 0 : _l.rawVal) == null ? void 0 : _m.includes(M.polyIdx)) ?? false ? { kind: "poly", a: M.polyIdx } : { kind: "seg", a: M.polyIdx, b: M.segIdx };
        } else if (_ >= 0) {
          const F = (((_n2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _n2.rawVal) ?? [])[_];
          F && (cn.geometry.setFromPoints([new V(F[0], F[1], F[2]), new V(F[3], F[4], F[5])]), cn.visible = true, Qt.visible = false, un = { kind: "aux", a: _ });
        } else cn.visible = false, Qt.visible = false, un = null;
        ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
        let w = n;
        if ((un == null ? void 0 : un.kind) === "pt") {
          const g = t.points.rawVal[un.a];
          g && (w = new V(g[0], g[1], g[2]));
        }
        const u = `X=${w.x.toFixed(2)} Y=${w.y.toFixed(2)} Z=${w.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [w.x, w.y, w.z], un) {
          const g = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ze.textContent = `${u}  \xB7  \u{1F5B1} Click \u2192 ${g[un.kind]}`;
        } else ze.textContent = u;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = u), Tt = { p: w.clone(), x: e.clientX, y: e.clientY }, Fe.visible = false, Xt.visible = false, Yt.visible = false, C();
        return;
      }
      if (r === "delete" || r === "trim" || r === "extend" || r === "offset") {
        const f = (window.__hekatanSnap2D ?? 0.5) * 1.5, h = Xo(n.x, n.y, n.z, f), M = ks(n.x, n.y, n.z, f);
        let _ = false;
        if (M >= 0) if (!h) _ = true;
        else {
          const g = window.__hekatanDrawingAuxLines, k = ((g == null ? void 0 : g.rawVal) ?? (g == null ? void 0 : g.val) ?? g ?? [])[M];
          Jn(n.x, n.y, n.z, k[0], k[1], k[2], k[3], k[4], k[5]) < h.dist && (_ = true);
        }
        _ ? (vn = M, ln = -1, gn = -1, ka(M)) : h ? (ln = h.polyIdx, gn = h.segIdx, vn = -1, Sa(h.polyIdx, h.segIdx)) : (ln = -1, gn = -1, vn = -1, Zt.visible = false), Fe.visible = false, Xt.visible = false, Yt.visible = false, nt(), ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
        const w = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let u = "";
        _ ? u = `\u{1F5D1} l\xEDnea aux #${vn + 1}` : h ? u = ((_p = (_o2 = t.areas) == null ? void 0 : _o2.rawVal) == null ? void 0 : _p.includes(h.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${h.polyIdx + 1}` : `\u{1F5D1} seg ${h.segIdx + 1} / poly #${h.polyIdx + 1}` : u = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ze.textContent = `${w}  \xB7  ${u}`;
        const x = document.getElementById("hk-coord-fixed");
        x && (x.textContent = w), C();
        return;
      } else Zt.visible = false, ln = -1, vn = -1;
      ze.style.left = e.clientX + "px", ze.style.top = e.clientY + "px", ze.style.display = "block";
      const p = ((_q = t.polylines) == null ? void 0 : _q.rawVal) ?? [], d = p[p.length - 1] ?? [], m = t.points.rawVal ?? [];
      if (d.length > 0 && m[d[d.length - 1]]) {
        const f = d[d.length - 1], h = m[f];
        let M = _t;
        uo = null;
        const _ = !!l || c;
        if (!M && !_ && window.__hekatanAxisSnap !== false) {
          const Ye = E.getBoundingClientRect(), Qe = e.clientX, $e = e.clientY, Ge = ((_r = settings.gridSize) == null ? void 0 : _r.rawVal) ?? 10, Re = new V(h[0], h[1], h[2]), Ae = [["x", new V(1, 0, 0)], ["y", new V(0, 1, 0)], ["z", new V(0, 0, 1)]], Be = (ut) => {
            const yt = ut.clone().project(o);
            return { x: (yt.x * 0.5 + 0.5) * Ye.width + Ye.left, y: (-yt.y * 0.5 + 0.5) * Ye.height + Ye.top };
          };
          let Ue = null;
          for (const [ut, yt] of Ae) {
            const Ft = Be(Re.clone().addScaledVector(yt, -Ge)), tn = Be(Re.clone().addScaledVector(yt, Ge)), Kn = tn.x - Ft.x, In = tn.y - Ft.y, Ya = Qe - Ft.x, Ua = $e - Ft.y, Za = Kn * Kn + In * In || 1;
            let Ao = (Ya * Kn + Ua * In) / Za;
            Ao = Math.max(0, Math.min(1, Ao));
            const Gs = Math.hypot(Qe - (Ft.x + Ao * Kn), $e - (Ft.y + Ao * In));
            if (Ue === null || Gs < Ue.dpx) {
              const os = L.ray, Ws = Re.clone().sub(os.origin), ss = yt.dot(os.direction), Hs = yt.dot(Ws), qa = os.direction.dot(Ws), Js = 1 - ss * ss, Ka = Math.abs(Js) < 1e-6 ? -Hs : (ss * qa - Hs) / Js;
              Ue = { axis: ut, dpx: Gs, pt: Re.clone().addScaledVector(yt, Ka) };
            }
          }
          Ue && Ue.dpx <= 12 && (n.copy(Ue.pt), M = Ue.axis, uo = Ue.pt.clone());
        }
        const w = !!window.__hekatanOrthoMode;
        if (!M && !_ && w) {
          const Ye = Math.abs(n.x - h[0]), Qe = Math.abs(n.y - h[1]), $e = Math.abs(n.z - h[2]), Ge = (_s2 = s[0]) == null ? void 0 : _s2.object;
          let Re = null;
          Ge === Jt ? Re = "xy" : Ge === sn ? Re = "xz" : Ge === an && (Re = "yz"), Re === "xy" ? M = Ye >= Qe ? "x" : "y" : Re === "xz" ? M = Ye >= $e ? "x" : "z" : Re === "yz" ? M = Qe >= $e ? "y" : "z" : M = Ye >= Qe && Ye >= $e ? "x" : Qe >= $e ? "y" : "z";
        }
        const u = window.__hekatanPolarTrack !== false;
        if (!M && !_ && u) {
          const Ye = n.x - h[0], Qe = n.y - h[1], $e = n.z - h[2], Ge = Math.hypot(Ye, Qe, $e);
          if (Ge > 1e-3) {
            const Ae = Math.tan(6 * Math.PI / 180) * Ge, Be = Math.hypot(Qe, $e), Ue = Math.hypot(Ye, $e), ut = Math.hypot(Ye, Qe), yt = [["x", Be], ["y", Ue], ["z", ut]];
            yt.sort((Ft, tn) => Ft[1] - tn[1]), yt[0][1] <= Ae && (M = yt[0][0]);
          }
        }
        if (M) {
          const Ye = h[0], Qe = h[1], $e = h[2];
          M === "x" ? n.set(n.x, Qe, $e) : M === "y" ? n.set(Ye, n.y, $e) : n.set(Ye, Qe, n.z);
          const Ge = !!_t, Ae = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[M];
          Rt.style.background = "rgba(15,23,42,0.92)", Rt.style.color = Ae, Rt.style.border = `1.5px solid ${Ae}`;
          const Be = (_t2 = s[0]) == null ? void 0 : _t2.object;
          let Ue = null;
          Be === Jt ? Ue = "xy" : Be === sn ? Ue = "xz" : Be === an && (Ue = "yz");
          const ut = Ue ? ` (plano ${Ue.toUpperCase()})` : "";
          Rt.textContent = Ge ? `\u{1F512} LOCK ${M.toUpperCase()}${ut}` : `\u22A5 ORTO ${M.toUpperCase()}${ut}`, Rt.style.left = e.clientX + 20 + "px", Rt.style.top = e.clientY + 18 + "px", Rt.style.transform = "none", Rt.style.display = "block";
        } else _t || (Rt.style.display = "none");
        let x = null;
        if (!a && !_ && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Ye = t.points.rawVal, Qe = M ? [M] : ["z", "x", "y"], $e = { x: e.clientX, y: e.clientY };
          let Ge = 1 / 0;
          for (const Re of Ye) if (!(Math.abs(Re[0] - h[0]) < 1e-9 && Math.abs(Re[1] - h[1]) < 1e-9 && Math.abs(Re[2] - h[2]) < 1e-9)) for (const Ae of Qe) {
            const Be = new V(Ae === "x" ? Re[0] : n.x, Ae === "y" ? Re[1] : n.y, Ae === "z" ? Re[2] : n.z), Ue = Vn(Be.x, Be.y, Be.z);
            if (!Ue) continue;
            const ut = Math.hypot(Ue.x - $e.x, Ue.y - $e.y);
            ut < Mn && ut < Ge && (Ge = ut, x = { q: Re, eje: Ae });
          }
        }
        x ? (x.eje === "x" ? n.x = x.q[0] : x.eje === "y" ? n.y = x.q[1] : n.z = x.q[2], Yt.geometry.setFromPoints([new V(x.q[0], x.q[1], x.q[2]), new V(n.x, n.y, n.z)]), (_u = Yt.computeLineDistances) == null ? void 0 : _u.call(Yt), Yt.visible = true, ht.position.set(n.x, n.y, n.z), ht.visible = true, Po("track", e.clientX, e.clientY)) : Yt.visible = false, Tt = { p: n.clone(), x: e.clientX, y: e.clientY };
        const g = Math.hypot(n.x - h[0], n.y - h[1], n.z - h[2]), F = Math.atan2(n.y - h[1], n.x - h[0]) * 180 / Math.PI, k = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`, P = (F % 360 + 360) % 360;
        ze.textContent = `L = ${g.toFixed(3)} m   \u2220 ${P.toFixed(1)}\xB0   \xB7   ${k}`;
        const $ = document.getElementById("hk-coord-fixed");
        $ && ($.textContent = k), Fe.geometry.setFromPoints([new V(h[0], h[1], h[2]), new V(n.x, n.y, n.z)]), (_v = Fe.computeLineDistances) == null ? void 0 : _v.call(Fe), Fe.visible = true, Pt(h[0], h[1], h[2], n.x, n.y, n.z);
        const T = window.__hekatanOrthoExt ?? 8, I = window.__hekatanShowOrthoPlanes !== false;
        on.visible = I, I || vs(null), I && (yn(An, h, "xy", T), yn(Rn, h, "xz", T), yn(Dn, h, "yz", T), wn(Jt, h, "xy", T), wn(sn, h, "xz", T), wn(an, h, "yz", T));
        const Y = I ? L.intersectObjects([Jt, sn, an], false) : [];
        let te = null;
        if (Y.length > 0) {
          const Ye = Y[0].object;
          Ye === Jt ? te = "xy" : Ye === sn ? te = "xz" : Ye === an && (te = "yz");
        }
        vs(te), te && (rn.style.left = e.clientX + "px", rn.style.top = e.clientY + "px"), Pn.geometry.setFromPoints([new V(h[0] - T, h[1], h[2]), new V(h[0] + T, h[1], h[2])]), (_w = Pn.computeLineDistances) == null ? void 0 : _w.call(Pn), Cn.geometry.setFromPoints([new V(h[0], h[1] - T, h[2]), new V(h[0], h[1] + T, h[2])]), (_x = Cn.computeLineDistances) == null ? void 0 : _x.call(Cn), zn.geometry.setFromPoints([new V(h[0], h[1], h[2] - T), new V(h[0], h[1], h[2] + T)]), (_y = zn.computeLineDistances) == null ? void 0 : _y.call(zn), Xt.visible = true;
        const me = Pn.material, ke = Cn.material, et = zn.material;
        Pn.visible = M === "x", Cn.visible = M === "y", zn.visible = M === "z", me.opacity = 0.95, ke.opacity = 0.95, et.opacity = 0.95;
      } else {
        const f = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ze.textContent = f;
        const h = document.getElementById("hk-coord-fixed");
        if (h && (h.textContent = f), Fe.visible = false, Xt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(r)) {
          if (Ze = null, We = null, Pe.style.left = e.clientX + 20 + "px", Pe.style.top = e.clientY - 28 + "px", Pe.style.display = "block", !Me) {
            Pe.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const _ = document.activeElement;
            !(_ && (_.tagName === "INPUT" || _.tagName === "TEXTAREA") && _ !== Pe) && document.activeElement !== Pe && Pe.focus({ preventScroll: true });
            try {
              Pe.select();
            } catch {
            }
          }
        } else nt();
      }
      C();
    } else So(), ze.style.display = "none", ht.visible = false, Fe.visible = false, Xt.visible = false, nt(), C();
  }), ce.derive(() => {
    var _a3;
    if (!t.gridTarget) return;
    const e = new rs().setFromEuler(new so(...t.gridTarget.val.rotation)), o = new rs().setFromAxisAngle(new V(1, 0, 0), Math.PI / 2);
    $i(y, { position: new V(...t.gridTarget.val.position), quaternion: e.clone().multiply(o) }, C);
    {
      const n = t.gridTarget.val.position[2], a = Math.abs(e.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const c of Wn) v.remove(c), No(c);
      if (Wn.length = 0, a) {
        const c = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], i = /* @__PURE__ */ new Set([0]);
        for (const r of c) i.add(+r[2].toFixed(3));
        for (const r of window.__hekatanLevels ?? []) isFinite(r == null ? void 0 : r.z) && i.add(+r.z.toFixed(3));
        const l = [...i].sort((r, p) => r - p).slice(0, 24);
        for (const r of l) {
          if (Math.abs(r - n) < 1e-6) continue;
          const p = y.clone(true);
          p.name = `hekatan-grid-nivel-${r}`, p.traverse((d) => {
            d.material && (d.material = d.material.clone(), d.material.transparent = true, d.material.opacity = (d.material.opacity ?? 1) * (Math.abs(r) < 1e-6 ? 0.5 : 0.22));
          }), p.position.set(0, 0, r), p.quaternion.copy(o), v.add(p), Wn.push(p);
        }
      }
    }
    ne.position.set(...t.gridTarget.val.position), ne.quaternion.setFromEuler(new so(...t.gridTarget.val.rotation)), ne.updateMatrixWorld();
    const s = new V(0, 0, 1).applyEuler(new so(...t.gridTarget.val.rotation));
    U = !(Math.abs(s.x) > 0.999 || Math.abs(s.y) > 0.999 || Math.abs(s.z) > 0.999);
  }), ce.derive(() => {
    Le.geometry.setAttribute("position", new $t(t.points.val.flat(), 3)), Le.geometry.computeBoundingSphere();
  }), ce.derive(() => {
    const e = 0.05 * z * 0.5 * A.val;
    L.params.Points.threshold = 0.4 * e;
  }), ce.derive(() => {
    var _a3;
    const e = t.points.val ?? [], s = (((_a3 = t.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], n = [];
    for (const c of s) {
      const [i, l, r] = e[c];
      n.push(i, l, r);
    }
    const a = new Ee();
    a.setAttribute("position", new $t(n, 3)), ot.geometry.dispose(), ot.geometry = a;
  });
  let Ko = false, Fn = 0;
  E.addEventListener("pointerdown", () => {
    Ko = true;
  }), E.addEventListener("pointerup", () => {
    Ko = false;
  }), E.addEventListener("pointermove", () => {
    Ko && Fn++;
  });
  const Ut = document.createElement("div");
  Ut.id = "hk-window-select", Ut.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Ut);
  let en = null, eo = false, Kt = null;
  const Go = (e, o, s, n, a) => {
    a ? (Ut.style.borderColor = "#34d399", Ut.style.borderStyle = "dashed", Ut.style.background = "rgba(52, 211, 153, 0.10)") : (Ut.style.borderColor = "#22d3ee", Ut.style.borderStyle = "solid", Ut.style.background = "rgba(34, 211, 238, 0.10)"), Ut.style.left = Math.min(e, s) + "px", Ut.style.top = Math.min(o, n) + "px", Ut.style.width = Math.abs(s - e) + "px", Ut.style.height = Math.abs(n - o) + "px", Ut.style.display = "block";
  }, Is = (e, o, s, n, a) => {
    var _a3, _b, _c, _d;
    const c = Math.min(e, s), i = Math.max(e, s), l = Math.min(o, n), r = Math.max(o, n), p = s < e, d = E.getBoundingClientRect(), m = b();
    m.updateMatrixWorld();
    const f = (P) => {
      const $ = new V(P[0], P[1], P[2]);
      return $.project(m), { x: d.left + ($.x * 0.5 + 0.5) * d.width, y: d.top + (-$.y * 0.5 + 0.5) * d.height };
    }, h = (P) => P.x >= c && P.x <= i && P.y >= l && P.y <= r, M = (P, $) => !(P.x < c && $.x < c || P.x > i && $.x > i || P.y < l && $.y < l || P.y > r && $.y > r);
    a || Ne.clear();
    let _ = 0;
    const w = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let P = 0; P < w.length; P++) {
      const $ = w[P];
      $ && h(f($)) && (Ne.add(`pt:${P}`), _++);
    }
    const u = (P, $) => p ? h(P) || h($) || M(P, $) : h(P) && h($), x = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], g = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let P = 0; P < x.length; P++) {
      const $ = x[P];
      if (g.includes(P)) {
        let I;
        if (!p) I = $.every((Y) => {
          const te = w[Y];
          return !!te && h(f(te));
        });
        else {
          I = false;
          for (let Y = 0; Y < $.length - 1; Y++) {
            const te = w[$[Y]], me = w[$[Y + 1]];
            if (!(!te || !me) && u(f(te), f(me))) {
              I = true;
              break;
            }
          }
        }
        I && (Ne.add(`poly:${P}`), _++);
      } else for (let I = 0; I < $.length - 1; I++) {
        const Y = w[$[I]], te = w[$[I + 1]];
        !Y || !te || u(f(Y), f(te)) && (Ne.add(`seg:${P}:${I}`), _++);
      }
    }
    const k = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let P = 0; P < k.length; P++) {
      const $ = k[P];
      if (!$ || $.length !== 6) continue;
      const T = f([$[0], $[1], $[2]]), I = f([$[3], $[4], $[5]]);
      u(T, I) && (Ne.add(`aux:${P}`), _++);
    }
    Ot(), le(_ === 0 && !p ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${p ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${_} item(s) ${a ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ne.size})`), Ut.style.display = "none";
  }, bo = () => {
    Kt && (Kt = null, Ut.style.display = "none", le("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = bo, window.addEventListener("keydown", (e) => {
    e.key === "Escape" && Kt && bo();
  });
  const Wo = () => {
    var _a3, _b, _c, _d;
    if (Ne.size === 0) return false;
    const e = [...Ne], o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = t.areas) == null ? void 0 : _c.rawVal) ?? [], a = window.__hekatanDrawingAuxLines, c = (a == null ? void 0 : a.rawVal) ?? [], i = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
    for (const M of e) {
      const [_, ...w] = M.split(":");
      if (_ === "pt") i.add(+w[0]);
      else if (_ === "poly") l.add(+w[0]);
      else if (_ === "seg") {
        const u = +w[0], x = +w[1];
        r.has(u) || r.set(u, /* @__PURE__ */ new Set()), r.get(u).add(x);
      } else _ === "aux" && p.add(+w[0]);
    }
    let d = 0, m = [], f = [];
    const h = /* @__PURE__ */ new Map();
    for (let M = 0; M < s.length; M++) {
      if (l.has(M)) {
        d++;
        continue;
      }
      h.set(M, m.length);
      const _ = r.get(M);
      if (_ && _.size > 0) {
        let w = [];
        for (let u = 0; u < s[M].length; u++) w.push(s[M][u]), u < s[M].length - 1 && _.has(u) && (w.length >= 2 && m.push(w), w = [], d++);
        (w.length >= 2 || w.length === 1) && m.push(w);
      } else m.push([...s[M]]);
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
      const w = [];
      for (const u of m) {
        let x = [];
        for (const g of u) {
          const F = _.get(g);
          F === void 0 ? (x.length >= 2 && w.push(x), x = []) : x.push(F);
        }
        x.length >= 2 && w.push(x);
      }
      m = w, t.points.val = M;
    }
    for (const M of n) {
      const _ = h.get(M);
      _ !== void 0 && _ < m.length && f.push(_);
    }
    if (t.polylines && (t.polylines.val = m), t.areas && (t.areas.val = f), p.size > 0 && a) {
      const M = c.filter((_, w) => !p.has(w));
      "val" in a ? a.val = M : window.__hekatanDrawingAuxLines = M, d += p.size;
    }
    Ne.clear(), Ot();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return le(`\u{1F5D1} ${d} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Wo, window.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    const o = document.activeElement, s = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !s || Ne.size !== 0 && (e.preventDefault(), Wo());
  });
  const qt = document.createElement("div");
  qt.id = "hk-properties-pane";
  const Ls = "hk-props-pane-pos";
  let to = null;
  try {
    const e = localStorage.getItem(Ls);
    e && (to = JSON.parse(e));
  } catch {
  }
  qt.style.cssText = ["position:fixed", to ? `left:${to.left}px` : "left:14px", to ? `top:${to.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(qt);
  const Aa = () => {
    const e = qt.querySelector(".tp-rotv_b");
    if (!e || e.__hkDragWired) return;
    e.__hkDragWired = true, e.style.cursor = "move", e.style.userSelect = "none";
    let o = false, s = 0, n = 0, a = 0, c = 0;
    e.addEventListener("mousedown", (i) => {
      o = true, s = i.clientX, n = i.clientY;
      const l = qt.getBoundingClientRect();
      a = l.left, c = l.top, qt.style.transform = "none", qt.style.left = `${a}px`, qt.style.top = `${c}px`, i.preventDefault();
    }), window.addEventListener("mousemove", (i) => {
      if (!o) return;
      const l = i.clientX - s, r = i.clientY - n, p = Math.max(0, Math.min(window.innerWidth - 80, a + l)), d = Math.max(0, Math.min(window.innerHeight - 40, c + r));
      qt.style.left = `${p}px`, qt.style.top = `${d}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Ls, JSON.stringify({ left: parseFloat(qt.style.left), top: parseFloat(qt.style.top) }));
        } catch {
        }
      }
    });
  }, Q = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, wt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let dt = null;
  const At = (e, o, s, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: e, ids: o, prop: s, value: n } }));
  }, Fa = () => {
    var _a3, _b;
    if (dt && (dt.dispose(), dt = null), Ne.size === 0) {
      qt.style.display = "none";
      return;
    }
    const e = [...Ne], o = e.filter((m) => m.startsWith("pt:"));
    if (o.length === 1) {
      const m = +o[0].slice(3), h = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(m);
      h ? [Q.Ux, Q.Uy, Q.Uz, Q.Rx, Q.Ry, Q.Rz] = h.map(Boolean) : Q.Ux = Q.Uy = Q.Uz = Q.Rx = Q.Ry = Q.Rz = false;
      const _ = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(m);
      _ ? [Q.Fx, Q.Fy, Q.Fz, Q.Mx, Q.My, Q.Mz] = _ : Q.Fx = Q.Fy = Q.Fz = Q.Mx = Q.My = Q.Mz = 0;
    }
    const s = e.filter((m) => m.startsWith("seg:")), n = e.filter((m) => m.startsWith("poly:")), a = e.filter((m) => m.startsWith("aux:")), c = o.length > 0, i = s.length > 0, l = n.length > 0, r = !c && !i && !l, p = [];
    o.length && p.push(`\u{1F535} ${o.length} nodo(s)`), s.length && p.push(`\u{1F4CF} ${s.length} segmento(s)`), n.length && p.push(`\u25AD ${n.length} \xE1rea(s)`), a.length && p.push(`\u250A ${a.length} aux`);
    const d = `\u{1F3AF} ${Ne.size} item(s) \u2014 ${p.join(", ")}`;
    dt = new ha({ container: qt, title: d });
    {
      const m = dt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      m.addBinding(wt, "dx", { label: "\u0394x (m)", step: 0.1 }), m.addBinding(wt, "dy", { label: "\u0394y (m)", step: 0.1 }), m.addBinding(wt, "dz", { label: "\u0394z (m)", step: 0.1 }), m.addBinding(wt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), m.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a4;
        const _ = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, wt.dx, wt.dy, wt.dz, wt.copias);
        le(_ ? `\u29C9 Replicado \xD7${_} (\u0394 ${wt.dx},${wt.dy},${wt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), m.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a4;
        const _ = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, wt.dx, wt.dy, wt.dz, wt.copias);
        le(_ && (_.lineas || _.areas) ? `\u21D7 Extruido: ${_.lineas} barra(s), ${_.areas} pa\xF1o(s) (\u0394 ${wt.dx},${wt.dy},${wt.dz} m \xD7 ${wt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const f = { vuelo: 1.5, losa: true, borde: true, ambos: true }, h = m.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      h.addBinding(f, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), h.addBinding(f, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), h.addBinding(f, "borde", { label: "con viga de borde" }), h.addBinding(f, "ambos", { label: "a los dos lados" }), h.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a4;
        const _ = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, f.vuelo, { losa: f.losa, vigaBorde: f.borde, lados: f.ambos ? "ambos" : "afuera" });
        le(_ ? `\u2310 Volado de ${f.vuelo} m en ${_} pa\xF1o(s)` + (f.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), m.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a4;
        const _ = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, wt.dx, wt.dy, wt.dz, 1);
        le(_ ? `\u2192 Copia desplazada \u0394 ${wt.dx},${wt.dy},${wt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const M = m.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      M.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a4;
        return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
      }), M.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), le(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (c) {
      const m = dt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      m.addBinding(Q, "Ux"), m.addBinding(Q, "Uy"), m.addBinding(Q, "Uz"), m.addBinding(Q, "Rx"), m.addBinding(Q, "Ry"), m.addBinding(Q, "Rz");
      const f = (u, x) => {
        [Q.Ux, Q.Uy, Q.Uz, Q.Rx, Q.Ry, Q.Rz] = u;
        try {
          dt.refresh();
        } catch {
        }
        At("nodes", o, "supports", u), le(`\u2713 ${x}: ${o.length} nudo(s) apoyado(s) (${u.map((g, F) => g ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][F] : "").filter(Boolean).join(" ")}).`);
      };
      m.addButton({ title: `\u25B2 Empotrar los ${o.length} nudo(s) (6 GDL)` }).on("click", () => f([true, true, true, true, true, true], "Empotrado")), m.addButton({ title: `\u25B3 Articular los ${o.length} nudo(s) (Ux Uy Uz)` }).on("click", () => f([true, true, true, false, false, false], "Articulado"));
      const h = dt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      h.addBinding(Q, "Kx", { label: "Kx", min: 0, step: 100 }), h.addBinding(Q, "Ky", { label: "Ky", min: 0, step: 100 }), h.addBinding(Q, "Kz", { label: "Kz", min: 0, step: 100 }), h.addBinding(Q, "Krx", { label: "Krx", min: 0, step: 1e3 }), h.addBinding(Q, "Kry", { label: "Kry", min: 0, step: 1e3 }), h.addBinding(Q, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const M = dt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      M.addBinding(Q, "Fx", { step: 0.1 }), M.addBinding(Q, "Fy", { step: 0.1 }), M.addBinding(Q, "Fz", { step: 0.1 }), M.addBinding(Q, "Mx", { step: 0.1 }), M.addBinding(Q, "My", { step: 0.1 }), M.addBinding(Q, "Mz", { step: 0.1 }), dt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(Q, "mass", { label: "m", min: 0, step: 1 }), dt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(Q, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), dt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let u = 0;
        const x = [Q.Ux, Q.Uy, Q.Uz, Q.Rx, Q.Ry, Q.Rz];
        x.some((k) => k) && (At("nodes", o, "supports", x), u++);
        const g = [Q.Fx, Q.Fy, Q.Fz, Q.Mx, Q.My, Q.Mz];
        g.some((k) => k !== 0) && (At("nodes", o, "loads", g), u++);
        const F = [Q.Kx, Q.Ky, Q.Kz, Q.Krx, Q.Kry, Q.Krz];
        if (F.some((k) => k !== 0) && (At("nodes", o, "springs", F), u++), Q.mass !== 0 && (At("nodes", o, "mass", Q.mass), u++), Q.diaphragm !== "Ninguno" && (At("nodes", o, "diaphragm", Q.diaphragm), u++), u === 0) {
          le("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let k = document.getElementById("hk-prop-toast");
          k || (k = document.createElement("div"), k.id = "hk-prop-toast", k.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(k)), k.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", k.style.background = "rgba(217,119,6,0.97)", k.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            k && (k.style.opacity = "0");
          }, 3200);
        } else le(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (i) {
      const m = dt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${s.length} seg(s)` });
      m.addBinding(Q, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), m.addBinding(Q, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const f = dt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      f.addBinding(Q, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), f.addBinding(Q, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), f.addBinding(Q, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), f.addBinding(Q, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), dt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(Q, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), dt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(Q, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const _ = dt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      _.addBinding(Q, "relMxI", { label: "Mx I" }), _.addBinding(Q, "relMyI", { label: "My I" }), _.addBinding(Q, "relMzI", { label: "Mz I" });
      const w = dt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      w.addBinding(Q, "relMxJ", { label: "Mx J" }), w.addBinding(Q, "relMyJ", { label: "My J" }), w.addBinding(Q, "relMzJ", { label: "Mz J" }), dt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(Q, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const x = dt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      x.addBinding(Q, "LKx", { label: "LKx", min: 0, step: 100 }), x.addBinding(Q, "LKy", { label: "LKy", min: 0, step: 100 }), x.addBinding(Q, "LKz", { label: "LKz", min: 0, step: 100 });
      const g = dt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      g.addBinding(Q, "qx", { step: 0.1 }), g.addBinding(Q, "qy", { step: 0.1 }), g.addBinding(Q, "qz", { step: 0.1 }), dt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(Q, "massPerM", { label: "m/L", min: 0, step: 1 }), dt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        At("segs", s, "section", Q.section), At("segs", s, "material", Q.material_frame);
        const k = { A: Q.A_mod, Iz: Q.Iz_mod, Iy: Q.Iy_mod, J: Q.J_mod };
        (k.A !== 1 || k.Iz !== 1 || k.Iy !== 1 || k.J !== 1) && At("segs", s, "modifiers", k), Q.insertionPoint !== "10 \u2014 Centroid" && At("segs", s, "insertionPoint", Q.insertionPoint), Q.beta !== 0 && At("segs", s, "beta", Q.beta);
        const P = [Q.relMxI, Q.relMyI, Q.relMzI], $ = [Q.relMxJ, Q.relMyJ, Q.relMzJ];
        (P.some((Y) => Y) || $.some((Y) => Y)) && At("segs", s, "releases", { i: P, j: $ }), Q.hinges !== "None" && At("segs", s, "hinges", Q.hinges);
        const T = [Q.LKx, Q.LKy, Q.LKz];
        T.some((Y) => Y !== 0) && At("segs", s, "lineSprings", T);
        const I = [Q.qx, Q.qy, Q.qz];
        I.some((Y) => Y !== 0) && At("segs", s, "distLoad", I), Q.massPerM !== 0 && At("segs", s, "massPerM", Q.massPerM), le(`\u2713 Propiedades aplicadas a ${s.length} segmento(s)`);
      });
    }
    if (l) {
      const m = dt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      m.addBinding(Q, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), m.addBinding(Q, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), m.addBinding(Q, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), dt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(Q, "surfLoad", { label: "q", step: 0.1 }), dt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        At("areas", n, "shellType", Q.shellType), At("areas", n, "thickness", Q.thickness), At("areas", n, "material", Q.material_shell), Q.surfLoad !== 0 && At("areas", n, "surfLoad", Q.surfLoad), le(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (r) {
      const m = dt.addFolder({ title: "\u2139 Selecci\xF3n" }), f = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      m.addBinding(f, "msg", { readonly: true, label: "" });
    }
    dt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ne.clear(), Ot();
    }), qt.style.display = "block", Aa();
  };
  window.__hekatanRefreshPropsPane = Fa;
  let Un = null, _o = false;
  E.addEventListener("pointerdown", (e) => {
    e.button === 2 && (Un = { x: e.clientX, y: e.clientY }, _o = false);
  }), E.addEventListener("pointermove", (e) => {
    if (Un && e.buttons & 2 && !_o) {
      const o = e.clientX - Un.x, s = e.clientY - Un.y;
      Math.hypot(o, s) > 8 && (_o = true);
    }
  }), E.addEventListener("pointerup", (e) => {
    var _a3, _b, _c;
    if (e.button === 2) {
      const o = Un !== null && !_o;
      Un = null;
      const s = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, s) return;
      if (o) {
        if (Kt ? bo() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ne.size > 0 && (Ne.clear(), Ot()), t.polylines) {
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
    o !== "select" && o !== "none" && o || e.button === 0 && (window.__hekatanBloquearVentana || e.pointerType !== "touch" && (en = null, eo = false));
  }), E.addEventListener("pointermove", (e) => {
    if (Kt && e.buttons === 0) {
      const c = e.clientX < Kt.x;
      Go(Kt.x, Kt.y, e.clientX, e.clientY, c);
      return;
    }
    if (!en) return;
    const o = e.clientX - en.x, s = e.clientY - en.y, n = Math.hypot(o, s);
    if (!eo && n < 8) return;
    eo = true;
    const a = e.clientX < en.x;
    Go(en.x, en.y, e.clientX, e.clientY, a);
  }), E.addEventListener("pointerup", (e) => {
    if (!en) return;
    if (!eo) {
      en = null;
      return;
    }
    const o = e.ctrlKey || e.metaKey || e.shiftKey;
    Is(en.x, en.y, e.clientX, e.clientY, o), en = null, eo = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Wt = new rt();
  Wt.visible = false, Wt.frustumCulled = false, v.add(Wt);
  const Ts = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, ko = (e, o, s, n) => {
    var _a3, _b, _c, _d;
    for (; Wt.children.length; ) {
      const i = Wt.children.pop();
      (_b = (_a3 = i.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = i.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const a = Ts[e] ?? 16777215, c = new Ee().setFromPoints([new V(-1, -1, 0), new V(1, -1, 0), new V(1, -1, 0), new V(1, 1, 0), new V(1, 1, 0), new V(-1, 1, 0), new V(-1, 1, 0), new V(-1, -1, 0)]);
    Wt.add(new Ht(c, new ct({ color: a, linewidth: 2 }))), Wt.position.set(o, s, n), Wt.visible = true, Jo();
  };
  let Ho = 4;
  const Jo = () => {
    Wt.visible && Wt.scale.setScalar(Ho * Mo(Wt.position));
  };
  window.__hekatanOsnapMarkerRef = Wt, window.__hekatanUpdateOsnapScale = Jo, window.__hekatanOsnapPx = (e) => (typeof e == "number" && e > 0 && (Ho = e, Jo(), C()), Ho);
  const So = () => {
    Wt.visible = false;
  }, Ea = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, pn = document.createElement("div");
  pn.id = "hk-osnap-etiqueta", pn.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(pn);
  const Po = (e, o, s) => {
    const n = Ea[e];
    if (!n) {
      pn.style.display = "none";
      return;
    }
    pn.textContent = n, pn.style.color = "#" + (Ts[e] ?? 16777215).toString(16).padStart(6, "0"), pn.style.left = o + 18 + "px", pn.style.top = s - 26 + "px", pn.style.display = "block";
  }, Va = () => {
    pn.style.display = "none";
  }, En = new V(), Vn = (e, o, s) => {
    const n = b();
    if (!n) return null;
    const a = E.getBoundingClientRect();
    return En.set(e, o, s).project(n), !isFinite(En.x) || !isFinite(En.y) || En.z < -1 || En.z > 1 ? null : { x: a.left + (En.x * 0.5 + 0.5) * a.width, y: a.top + (-En.y * 0.5 + 0.5) * a.height };
  };
  window.__hekatanAPixeles = Vn;
  const $a = (e, o, s, n, a) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const c = window.__hekatanOsnap, i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let r = null;
    const p = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, d = a, m = (u, x, g, F) => {
      let k;
      if (d) {
        const $ = Vn(x, g, F);
        if (!$ || (k = Math.hypot($.x - d.x, $.y - d.y), k > Mn)) return;
      } else if (k = Math.hypot(x - e, g - o, F - s), k > n) return;
      const P = p[u] ?? 9;
      (!r || P < r.r || P === r.r && k < r.d) && (r = { type: u, x, y: g, z: F, d: k, r: P });
    };
    if (c.ori !== false && m("ori", 0, 0, 0), c.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, x = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, g = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, F = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", k = ($) => Math.round($ / x) * x, P = ($, T) => Math.abs($) <= g + 1e-9 && Math.abs(T) <= g + 1e-9;
      if (F === "xz") {
        const $ = k(e), T = k(s);
        P($, T) && m("grid", $, o, T);
      } else if (F === "yz") {
        const $ = k(o), T = k(s);
        P($, T) && m("grid", e, $, T);
      } else {
        const $ = k(e), T = k(o);
        P($, T) && m("grid", $, T, s);
      }
    }
    (c.node || c.end) && i.forEach((u) => {
      c.node && m("node", u[0], u[1], u[2]);
    });
    for (const u of l) if (!(u.length < 2)) for (let x = 0; x < u.length - 1; x++) {
      const g = i[u[x]], F = i[u[x + 1]];
      if (!(!g || !F) && (c.end && (m("end", g[0], g[1], g[2]), m("end", F[0], F[1], F[2])), c.mid && m("mid", (g[0] + F[0]) / 2, (g[1] + F[1]) / 2, (g[2] + F[2]) / 2), c.nea || c.per)) {
        const k = F[0] - g[0], P = F[1] - g[1], $ = F[2] - g[2], T = k * k + P * P + $ * $;
        if (T < 1e-12) continue;
        const I = Math.max(0, Math.min(1, ((e - g[0]) * k + (o - g[1]) * P + (s - g[2]) * $) / T)), Y = g[0] + I * k, te = g[1] + I * P, me = g[2] + I * $;
        c.nea && m("nea", Y, te, me), c.per && m("per", Y, te, me);
      }
    }
    if (c.cen) {
      const u = ((_e2 = t.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const x of u) {
        const g = l[x];
        if (!g || g.length < 3) continue;
        const F = g[0] === g[g.length - 1] ? g.slice(0, -1) : g;
        let k = 0, P = 0, $ = 0, T = 0;
        for (const I of F) {
          const Y = i[I];
          Y && (k += Y[0], P += Y[1], $ += Y[2], T++);
        }
        T >= 3 && m("cen", k / T, P / T, $ / T);
      }
    }
    if (c.cen) {
      const u = zs(), x = [...yo];
      for (const g of u) x.some((F) => Math.hypot(F.c[0] - g.c[0], F.c[1] - g.c[1], F.c[2] - g.c[2]) < 1e-6 && Math.abs(F.r - g.r) < 1e-6) || x.push(g);
      for (const g of x) {
        if (!i.some((P) => Math.abs(Math.hypot(P[0] - g.c[0], P[1] - g.c[1], P[2] - g.c[2]) - g.r) < 1e-6)) continue;
        const k = Math.hypot(e - g.c[0], o - g.c[1], s - g.c[2]);
        if (k < n || Math.abs(k - g.r) < n) {
          const P = Math.min(k, n * 0.5), $ = 3;
          (!r || $ < r.r || $ === r.r && P < r.d) && (r = { type: "cen", x: g.c[0], y: g.c[1], z: g.c[2], d: P, r: $ });
        }
      }
    }
    if (c.int) {
      const u = [];
      for (const x of l) for (let g = 0; g < x.length - 1; g++) {
        const F = i[x[g]], k = i[x[g + 1]];
        if (!F || !k) continue;
        const P = k[0] - F[0], $ = k[1] - F[1], T = k[2] - F[2], I = P * P + $ * $ + T * T;
        if (I < 1e-12) continue;
        const Y = Math.max(0, Math.min(1, ((e - F[0]) * P + (o - F[1]) * $ + (s - F[2]) * T) / I));
        Math.hypot(F[0] + Y * P - e, F[1] + Y * $ - o, F[2] + Y * T - s) < 3 * n && u.push([F, k]);
      }
      for (let x = 0; x < u.length; x++) for (let g = x + 1; g < u.length; g++) {
        const [F, k] = u[x], [P, $] = u[g], T = [k[0] - F[0], k[1] - F[1], k[2] - F[2]], I = [$[0] - P[0], $[1] - P[1], $[2] - P[2]], Y = [F[0] - P[0], F[1] - P[1], F[2] - P[2]], te = T[0] * T[0] + T[1] * T[1] + T[2] * T[2], me = T[0] * I[0] + T[1] * I[1] + T[2] * I[2], ke = I[0] * I[0] + I[1] * I[1] + I[2] * I[2], et = T[0] * Y[0] + T[1] * Y[1] + T[2] * Y[2], Ye = I[0] * Y[0] + I[1] * Y[1] + I[2] * Y[2], Qe = te * ke - me * me;
        if (Qe < 1e-12) continue;
        const $e = (me * Ye - ke * et) / Qe, Ge = (te * Ye - me * et) / Qe;
        if ($e < -1e-6 || $e > 1 + 1e-6 || Ge < -1e-6 || Ge > 1 + 1e-6) continue;
        const Re = [F[0] + $e * T[0], F[1] + $e * T[1], F[2] + $e * T[2]], Ae = [P[0] + Ge * I[0], P[1] + Ge * I[1], P[2] + Ge * I[2]];
        if (Math.hypot(Re[0] - Ae[0], Re[1] - Ae[1], Re[2] - Ae[2]) > 1e-4) continue;
        [F, k, P, $].some((Ue) => Math.hypot(Ue[0] - Re[0], Ue[1] - Re[1], Ue[2] - Re[2]) < 1e-6) || m("int", Re[0], Re[1], Re[2]);
      }
    }
    const f = window.__hekatanAxisGrids ?? [], h = window.__hekatanLevels ?? [], M = f.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, x] of M) {
      c.end && (m("end", u[0], u[1], u[2]), m("end", x[0], x[1], x[2]));
      const g = x[0] - u[0], F = x[1] - u[1], k = x[2] - u[2], P = g * g + F * F + k * k;
      if (P < 1e-12) continue;
      const $ = Math.max(0, Math.min(1, ((e - u[0]) * g + (o - u[1]) * F + (s - u[2]) * k) / P));
      if (c.nea && m("nea", u[0] + $ * g, u[1] + $ * F, u[2] + $ * k), c.int && Math.abs(k) > 1e-9) for (const T of h) {
        const I = (T.z - u[2]) / k;
        I < -1e-6 || I > 1 + 1e-6 || m("int", u[0] + I * g, u[1] + I * F, T.z);
      }
    }
    if (c.int || c.node) for (let u = 0; u < M.length; u++) for (let x = u + 1; x < M.length; x++) {
      const [g, F] = M[u], [k, P] = M[x], $ = F[0] - g[0], T = F[1] - g[1], I = P[0] - k[0], Y = P[1] - k[1], te = $ * Y - T * I;
      if (Math.abs(te) < 1e-12) continue;
      const me = g[0] - k[0], ke = g[1] - k[1], et = (I * ke - Y * me) / te, Ye = ($ * ke - T * me) / te;
      if (et < -1e-6 || et > 1 + 1e-6 || Ye < -1e-6 || Ye > 1 + 1e-6) continue;
      const Qe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      m("int", g[0] + et * $, g[1] + et * T, typeof Qe == "number" ? Qe : s);
    }
    const _ = window.__hekatanDrawingAuxLines, w = (_ == null ? void 0 : _.rawVal) ?? (_ == null ? void 0 : _.val) ?? _ ?? [];
    for (const u of w) {
      if (u.length !== 6) continue;
      const x = [u[0], u[1], u[2]], g = [u[3], u[4], u[5]];
      if (c.end && (m("end", x[0], x[1], x[2]), m("end", g[0], g[1], g[2])), c.mid && m("mid", (x[0] + g[0]) / 2, (x[1] + g[1]) / 2, (x[2] + g[2]) / 2), c.nea || c.per) {
        const F = g[0] - x[0], k = g[1] - x[1], P = g[2] - x[2], $ = F * F + k * k + P * P;
        if ($ < 1e-12) continue;
        const T = Math.max(0, Math.min(1, ((e - x[0]) * F + (o - x[1]) * k + (s - x[2]) * P) / $)), I = x[0] + T * F, Y = x[1] + T * k, te = x[2] + T * P;
        c.nea && m("nea", I, Y, te), c.per && m("per", I, Y, te);
      }
    }
    return r ? { type: r.type, x: r.x, y: r.y, z: r.z } : null;
  }, Zn = new rt();
  Zn.frustumCulled = false, v.add(Zn);
  const Rs = new ct({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Ds = 0;
  const Bs = () => {
    var _a3, _b;
    for (const e of Zn.children.slice()) Zn.remove(e), (_b = (_a3 = e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (e) => {
    var _a3, _b;
    Bs();
    const o = ((_a3 = t.points) == null ? void 0 : _a3.rawVal) ?? [], s = ((_b = t.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const a of e || []) {
      const c = String(a).split(":");
      let i = [];
      if (c[0] === "pt") {
        const p = o[+c[1]];
        p && (i = [p, [p[0] + 1e-3, p[1], p[2]]]);
      } else if (c[0] === "seg") {
        const p = s[+c[1]] || [], d = o[p[+c[2]]], m = o[p[+c[2] + 1]];
        d && m && (i = [d, m]);
      } else c[0] === "poly" && (i = (s[+c[1]] || []).map((d) => o[d]).filter(Boolean));
      if (i.length < 2) continue;
      const l = new Ee().setFromPoints(i.map((p) => new V(p[0], p[1], p[2]))), r = new Et(l, Rs);
      r.renderOrder = 1200, Zn.add(r);
    }
    if (!Zn.children.length) return;
    Ds = performance.now() + 900;
    const n = () => {
      const a = Ds - performance.now();
      if (a <= 0) {
        Bs(), C();
        return;
      }
      Rs.opacity = Math.min(1, a / 900) * 0.95, C(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (e) => {
    var _a3;
    const o = (_a3 = e == null ? void 0 : e.detail) == null ? void 0 : _a3.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = $a, window.__hekatanOsnapShow = ko, window.__hekatanOsnapHide = So;
  let Xe = [], kt = 0, $n = 0, Dt = null;
  const no = document.createElement("div");
  no.id = "hk-cad-status", no.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", no.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(no);
  const Ia = () => {
    var _a3, _b, _c;
    const e = [];
    window.__hekatanOrthoMode && e.push("\u22A5 ORTO ON (F8)"), _t && e.push(`\u{1F512} LOCK ${_t.toUpperCase()}`);
    const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(s) > 1e-3 && e.push(`Cota Z=${s}m`), window.__hekatanShowOrthoPlanes !== false && e.push("\u25A6 Planos XY/XZ/YZ"), e.length > 0 ? `   |   ${e.join("  \xB7  ")}` : "";
  }, le = (e) => {
    var _a3;
    const o = e + Ia();
    no.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, e);
    } catch {
    }
  }, La = "Comando:", Ta = () => {
    var _a3, _b, _c, _d;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = t.polylines) == null ? void 0 : _d.rawVal) ?? [], s = o.length ? o[o.length - 1] : [], n = Xe.length, a = (c, i = []) => ({ txt: c, ops: i });
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
        return a(`\xC1REA LIBRE Precise v\xE9rtice ${at.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return a("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return a(`REGLA ${Ke.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
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
        return a(`COLUMNA Precise punto de inserci\xF3n (altura ${kt > 0 ? kt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return a(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${kt > 0 ? kt : 3} m; teclee otra + Enter):`);
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
        return a(Dt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${$n > 0 ? ` (distancia ${$n} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Ne.size ? a(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : a("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ne.size ? a(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : a("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ne.size ? a(`SELECCI\xD3N ${Ne.size} objeto${Ne.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : a("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return a(La);
    }
  }, Gt = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const e = Ta(), o = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, s = (((_d = t.points) == null ? void 0 : _d.rawVal) ?? []).length, a = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(e.txt) && !o && !s ? `${e.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : e.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, a, e.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Gt, window.__hekatanRefreshStatus = () => {
    const e = window.__hekatanCadStatusText ?? "", o = e.split("   |   ")[0] ?? e;
    le(o);
  }, window.__hekatanCadResetPending = () => {
    Xe = [], at = [], it.visible = false, Qo(), Dt = null, C(), le("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Gt();
  };
  function Qo() {
    if (!t.polylines) return;
    const e = t.polylines.rawVal.filter((o) => o.length >= 2);
    t.polylines.val = [...e, []];
  }
  window.__hekatanCerrarPolilinea = Qo;
  const qn = [], Co = [], Ra = () => {
    const e = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((e == null ? void 0 : e.rawVal) ?? (e == null ? void 0 : e.val) ?? []));
  }, Oo = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(t.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? [])), x: Ra() };
  }, Ns = (e) => {
    var _a3;
    if (t.points.val = e.p, t.polylines && (t.polylines.val = e.l), t.areas && (t.areas.val = e.a), e.x) {
      const o = window.__hekatanDrawingAuxLines;
      o && "val" in o && (o.val = e.x);
    }
    Xe = [], Fe.visible = false, Xt.visible = false, nt();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    C(), Gt();
  }, vt = () => {
    qn.push(Oo()), qn.length > 100 && qn.shift(), Co.length = 0;
  }, zo = () => {
    const e = qn.pop();
    if (!e) {
      le("\u21B6 Nada para deshacer");
      return;
    }
    Co.push(Oo()), Ns(e), le(`\u21B6 Deshacer \u2014 quedan ${qn.length}`);
  }, Xs = () => {
    const e = Co.pop();
    if (!e) {
      le("\u21B7 Nada para rehacer");
      return;
    }
    qn.push(Oo()), Ns(e), le(`\u21B7 Rehacer \u2014 quedan ${Co.length}`);
  };
  window.__hekatanPushUndo = vt, window.__hekatanUndo = zo, window.__hekatanRedo = Xs, document.addEventListener("keydown", (e) => {
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
    if (s !== "line" && s !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (zo(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (a.length < 3) return le("Cerrar necesita al menos tres puntos."), true;
      vt(), t.polylines.val = [...n.slice(0, -1), [...a, a[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return jo(), le(`\u2713 Polil\xEDnea cerrada \u2014 ${a.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!a.length) return zo(), true;
      vt();
      const c = a[a.length - 1], i = a.slice(0, -1), l = n.some((d, m) => m !== n.length - 1 && d.includes(c)) || i.includes(c);
      let r = t.points.rawVal, p = [...n.slice(0, -1), i];
      if (!l && c === r.length - 1 && (r = r.slice(0, -1), t.points.val = r), t.polylines.val = p, i.length) {
        const d = r[i[i.length - 1]];
        d && (Ze = [d[0], d[1], d[2]]);
      } else Ze = null, Fe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return C(), le(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${i.length}.`), Gt(), true;
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
      e.preventDefault(), e.stopPropagation(), zo();
    }
  }, { capture: true });
  const jo = () => {
    Xe = [], Dt = null, Qo(), _t = null, Ms(), Fe.visible = false, Xt.visible = false, nt(), le("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), C(), Gt();
  };
  window.__hekatanFinalizeDraw = jo;
  const Ys = () => {
    var _a3, _b, _c;
    Xe = [], at = [], it.visible = false;
    let e = false;
    Ne.size && (Ne.clear(), Ot(), e = true), jo();
    try {
      const o = window.__hekatanCadState, s = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
      s && s !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    le(e ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), C(), Gt();
  };
  window.__hekatanEscapeCancel = Ys;
  const Us = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ne.forEach((s) => {
      if (s.startsWith("pt:")) o.add(+s.slice(3));
      else if (s.startsWith("poly:")) (e[+s.slice(5)] || []).forEach((n) => o.add(n));
      else if (s.startsWith("seg:")) {
        const n = s.split(":"), a = e[+n[1]] || [], c = a[+n[2]], i = a[+n[2] + 1];
        c != null && o.add(c), i != null && o.add(i);
      }
    }), o;
  }, Zs = (e, o, s) => {
    var _a3;
    const n = Us();
    if (!n.size) return 0;
    vt();
    const a = t.points.rawVal.map((c, i) => n.has(i) ? [c[0] + e, c[1] + o, c[2] + s] : c);
    t.points.val = a;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return Ot(), C(), n.size;
  };
  window.__hekatanMoveSelection = Zs;
  const qs = (e, o) => {
    var _a3, _b, _c, _d, _e2;
    if (!Ne.size) {
      le(`${e === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Gt();
      return;
    }
    if (Xe.push(o), Xe.length === 1) {
      Ze = o, le(`${e === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Gt();
      return;
    }
    const [s, n] = Xe, a = [n[0] - s[0], n[1] - s[1], n[2] - s[2]];
    Xe = [], Fe.visible = false;
    let c = 0;
    e === "move" ? c = Zs(a[0], a[1], a[2]) : (c = Us().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, a[0], a[1], a[2], 1)), le(`\u2713 ${e === "move" ? "Movidos" : "Copiados"} ${c} nudo${c === 1 ? "" : "s"} \u2014 \u0394 (${a[0].toFixed(2)}, ${a[1].toFixed(2)}, ${a[2].toFixed(2)}) m.`), e === "move" && (Ne.clear(), Ot()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Gt();
  };
  window.__hekatanPasoMoverCopiar = qs;
  const Da = () => {
    var _a3, _b, _c;
    const e = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return e === "xz" ? [0, 1, 0] : e === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, bn = (e, o) => Math.hypot(e[0] - o[0], e[1] - o[1], e[2] - o[2]), es = (e, o, s, n, a, c) => {
    const i = [o[0] - e[0], o[1] - e[1], o[2] - e[2]], l = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], r = [e[0] - s[0], e[1] - s[1], e[2] - s[2]], p = i[0] * i[0] + i[1] * i[1] + i[2] * i[2], d = i[0] * l[0] + i[1] * l[1] + i[2] * l[2], m = l[0] * l[0] + l[1] * l[1] + l[2] * l[2], f = i[0] * r[0] + i[1] * r[1] + i[2] * r[2], h = l[0] * r[0] + l[1] * r[1] + l[2] * r[2], M = p * m - d * d;
    if (M < 1e-12) return null;
    const _ = (d * h - m * f) / M, w = (p * h - d * f) / M;
    if (!a && (_ < -1e-6 || _ > 1 + 1e-6) || !c && (w < -1e-6 || w > 1 + 1e-6)) return null;
    const u = [e[0] + _ * i[0], e[1] + _ * i[1], e[2] + _ * i[2]], x = [s[0] + w * l[0], s[1] + w * l[1], s[2] + w * l[2]];
    return bn(u, x) > 1e-4 ? null : u;
  }, Ba = (e) => {
    var _a3;
    return (((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((o, s) => o + s.filter((n) => n === e).length, 0);
  }, Na = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Xa = (e, o) => {
    var _a3, _b;
    if (!t.polylines) return;
    const s = t.polylines.rawVal, n = t.points.rawVal, a = Na[e];
    if (!Dt) {
      if (ln < 0) {
        le(`${a}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Dt = { poly: ln, seg: Math.max(0, gn) }, le(e === "offset" ? `DESFASE l\xEDnea #${Dt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${$n > 0 ? ` (${$n} m)` : ""}.` : e === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Gt();
      return;
    }
    if (e === "offset") {
      const _ = Dt.poly, w = s[_];
      if (!w || w.length < 2) {
        Dt = null, le("DESFASE: esa polil\xEDnea no tiene tramos."), Gt();
        return;
      }
      const u = w.length > 2 && w[0] === w[w.length - 1], x = Da(), g = [];
      for (let $e = 0; $e < w.length - 1; $e++) {
        const Ge = n[w[$e]], Re = n[w[$e + 1]], Ae = [Re[0] - Ge[0], Re[1] - Ge[1], Re[2] - Ge[2]], Be = Math.hypot(Ae[0], Ae[1], Ae[2]) || 1, Ue = Ae[0] / Be, ut = Ae[1] / Be, yt = Ae[2] / Be, Ft = [x[1] * yt - x[2] * ut, x[2] * Ue - x[0] * yt, x[0] * ut - x[1] * Ue], tn = Math.hypot(Ft[0], Ft[1], Ft[2]) || 1;
        g.push({ a: Ge, b: Re, n: [Ft[0] / tn, Ft[1] / tn, Ft[2] / tn] });
      }
      let F = 0, k = 1 / 0;
      g.forEach(($e, Ge) => {
        const Re = Jn(o[0], o[1], o[2], $e.a[0], $e.a[1], $e.a[2], $e.b[0], $e.b[1], $e.b[2]);
        Re < k && (k = Re, F = Ge);
      });
      const P = g[F], $ = Math.sign((o[0] - P.a[0]) * P.n[0] + (o[1] - P.a[1]) * P.n[1] + (o[2] - P.a[2]) * P.n[2]) || 1, T = $n > 0 ? $n : k;
      if (T < 1e-6) {
        le("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const I = g.map(($e) => ({ a: [$e.a[0] + $ * T * $e.n[0], $e.a[1] + $ * T * $e.n[1], $e.a[2] + $ * T * $e.n[2]], b: [$e.b[0] + $ * T * $e.n[0], $e.b[1] + $ * T * $e.n[1], $e.b[2] + $ * T * $e.n[2]] })), Y = I.length, te = ($e) => {
        const Ge = I[($e - 1 + Y) % Y], Re = I[$e % Y];
        return es(Ge.a, Ge.b, Re.a, Re.b, true, true) ?? Re.a;
      }, me = [], ke = u ? Y : Y + 1;
      for (let $e = 0; $e < ke; $e++) !u && $e === 0 ? me.push(I[0].a) : !u && $e === Y ? me.push(I[Y - 1].b) : me.push(te($e));
      vt();
      const et = n.length;
      t.points.val = [...n, ...me];
      const Ye = me.map(($e, Ge) => et + Ge);
      u && Ye.push(et);
      let Qe = s.slice();
      Qe.length && Qe[Qe.length - 1].length === 0 && (Qe = Qe.slice(0, -1)), t.polylines.val = [...Qe, Ye, []], Dt = null, le(`\u2713 Desfase a ${T.toFixed(2)} m \u2014 ${Y} tramo${Y === 1 ? "" : "s"} nuevo${Y === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      C(), Gt();
      return;
    }
    let c = ln, i = Math.max(0, gn);
    if (c < 0 || c === Dt.poly && i === Dt.seg) {
      let w = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (c = -1, s.forEach((u, x) => {
        for (let g = 0; g < u.length - 1; g++) {
          if (x === Dt.poly && g === Dt.seg) continue;
          const F = n[u[g]], k = n[u[g + 1]];
          if (!F || !k) continue;
          const P = Jn(o[0], o[1], o[2], F[0], F[1], F[2], k[0], k[1], k[2]);
          P < w && (w = P, c = x, i = g);
        }
      }), c < 0) {
        le(`${a}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const l = s[Dt.poly], r = n[l[Dt.seg]], p = n[l[Dt.seg + 1]], d = s[c], m = d[i], f = d[i + 1];
    if (!r || !p || m == null || f == null) {
      le(`${a}: no se pudo leer el tramo.`);
      return;
    }
    const h = n[m], M = n[f];
    if (e === "trim") {
      const _ = es(h, M, r, p, false, false);
      if (!_) {
        le("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      vt();
      const w = n.length;
      t.points.val = [...n, _];
      const u = [...d.slice(0, i + 1), w, ...d.slice(i + 1)];
      t.polylines.val = s.map((g, F) => F === c ? u : g);
      const x = bn(o, h) < bn(o, M);
      Ss(c, x ? i : i + 1), le(`\u2713 Recortado en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const _ = es(h, M, r, p, true, false);
      if (!_) {
        le("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = bn(o, h) < bn(o, M) ? i : i + 1;
      if (u !== 0 && u !== d.length - 1) {
        le("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const x = d[u];
      if (bn(_, h) + bn(_, M) < bn(h, M) + 1e-6) {
        le("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (vt(), Ba(x) > 1) {
        const F = n.length;
        t.points.val = [...n, _];
        const k = d.slice();
        k[u] = F, t.polylines.val = s.map((P, $) => $ === c ? k : P);
      } else t.points.val = n.map((F, k) => k === x ? _ : F);
      le(`\u2713 Alargada hasta (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    C(), Gt();
  };
  window.__hekatanSelectionSize = () => Ne.size, window.__hekatanSelectLast = () => {
    var _a3;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let o = e.length - 1;
    for (; o >= 0 && (!e[o] || e[o].length < 2); ) o--;
    return Ne.clear(), o >= 0 && Ne.add(`poly:${o}`), Ot(), le(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ne.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const e = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = ((_b = t.points) == null ? void 0 : _b.rawVal) ?? [];
    Ne.clear();
    const s = /* @__PURE__ */ new Set();
    return e.forEach((n, a) => {
      !n || n.length < 2 || (Ne.add(`poly:${a}`), n.forEach((c) => s.add(c)));
    }), o.forEach((n, a) => {
      s.has(a) || Ne.add(`pt:${a}`);
    }), Ot(), le(`SELECCI\xD3N ${Ne.size} objetos (todo el modelo) \xB7 Esc suelta`), Ne.size;
  }, window.__hekatanReplicateSelection = (e, o, s, n, a = 0) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), a = Math.max(0, Math.round(a || 0));
    const c = [...Ne], i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), p = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), m = [];
    if (c.forEach((w) => {
      if (w.startsWith("pt:")) {
        const u = +w.slice(3);
        i[u] && p.add(u);
      } else if (w.startsWith("poly:")) {
        const u = +w.slice(5);
        if (!l[u] || l[u].length < 2) return;
        d.add(u), l[u].forEach((x) => p.add(x));
      } else if (w.startsWith("seg:")) {
        const u = w.split(":"), x = +u[1], g = +u[2], F = l[x] || [], k = F[g], P = F[g + 1];
        k != null && P != null && (m.push([k, P]), p.add(k), p.add(P));
      }
    }), !p.size) return 0;
    vt();
    const f = [...i];
    let h = l.slice();
    h.length && h[h.length - 1].length === 0 && (h = h.slice(0, -1));
    const M = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], _ = [...p];
    for (let w = 1; w <= n; w++) {
      const u = a + w, x = e * u, g = o * u, F = s * u, k = /* @__PURE__ */ new Map();
      _.forEach((P) => {
        k.set(P, f.length), f.push([i[P][0] + x, i[P][1] + g, i[P][2] + F]);
      }), d.forEach((P) => {
        const $ = l[P].map((I) => k.has(I) ? k.get(I) : I), T = h.length;
        h.push($), r.has(P) && M.push(T);
      }), m.forEach(([P, $]) => {
        h.push([k.get(P), k.get($)]);
      });
    }
    h.push([]), t.points.val = f, t.polylines && (t.polylines.val = h), t.areas && (t.areas.val = M);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), n;
  }, window.__hekatanExtrudeSelection = (e, o, s, n) => {
    var _a3, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1));
    const a = [...Ne], c = t.points.rawVal, i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = new Set(((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []), r = /* @__PURE__ */ new Set(), p = [], d = /* @__PURE__ */ new Set();
    for (const x of i) for (const g of x) d.add(g);
    if (a.forEach((x) => {
      if (x.startsWith("poly:")) {
        const g = +x.slice(5);
        if (l.has(g)) return;
        const F = i[g] || [];
        for (let k = 0; k + 1 < F.length; k++) p.push([F[k], F[k + 1]]), d.add(F[k]), d.add(F[k + 1]);
      } else if (x.startsWith("seg:")) {
        const g = x.split(":"), F = +g[1], k = +g[2], P = i[F] || [], $ = P[k], T = P[k + 1];
        $ != null && T != null && (p.push([$, T]), d.add($), d.add(T));
      }
    }), a.forEach((x) => {
      if (x.startsWith("pt:")) {
        const g = +x.slice(3);
        c[g] && !d.has(g) && r.add(g);
      }
    }), !r.size && !p.length) return { lineas: 0, areas: 0 };
    vt();
    const m = [...c];
    let f = i.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const h = [...((_c = t.areas) == null ? void 0 : _c.rawVal) ?? []], M = /* @__PURE__ */ new Map(), _ = (x, g) => {
      if (g === 0) return x;
      const F = x + ":" + g;
      let k = M.get(F);
      if (k == null) {
        const P = [c[x][0] + e * g, c[x][1] + o * g, c[x][2] + s * g];
        k = m.findIndex(($) => Math.abs($[0] - P[0]) < 1e-3 && Math.abs($[1] - P[1]) < 1e-3 && Math.abs($[2] - P[2]) < 1e-3), k < 0 && (k = m.length, m.push(P)), M.set(F, k);
      }
      return k;
    };
    let w = 0, u = 0;
    r.forEach((x) => {
      const g = [x];
      for (let F = 1; F <= n; F++) g.push(_(x, F));
      f.push(g), w += n;
    }), p.forEach(([x, g]) => {
      for (let F = 1; F <= n; F++) {
        const k = [_(x, F - 1), _(g, F - 1), _(g, F), _(x, F)];
        h.push(f.length), f.push([...k, k[0]]), u++;
      }
    }), f.push([]), t.points.val = m, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = h);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return C(), { lineas: w, areas: u };
  }, window.__hekatanVoladoSelection = (e, o = {}) => {
    var _a3, _b, _c;
    const s = Number(e);
    if (!Number.isFinite(s) || Math.abs(s) < 1e-6) return 0;
    const n = o.losa !== false, a = o.vigaBorde !== false, c = o.lados === "afuera" ? "afuera" : "ambos", i = t.points.rawVal, l = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], r = [];
    if ([...Ne].forEach((_) => {
      if (_.startsWith("seg:")) {
        const w = _.split(":"), u = +w[1], x = +w[2], g = l[u] || [], F = g[x], k = g[x + 1];
        F != null && k != null && r.push([F, k]);
      } else if (_.startsWith("poly:")) {
        const w = l[+_.slice(5)] || [];
        for (let u = 0; u + 1 < w.length; u++) r.push([w[u], w[u + 1]]);
      }
    }), !r.length) return 0;
    let p = 0, d = 0;
    for (const _ of i) p += _[0], d += _[1];
    p /= Math.max(1, i.length), d /= Math.max(1, i.length), vt();
    const m = [...i];
    let f = l.slice();
    f.length && f[f.length - 1].length === 0 && (f = f.slice(0, -1));
    const h = [...((_b = t.areas) == null ? void 0 : _b.rawVal) ?? []];
    let M = 0;
    for (const [_, w] of r) {
      const u = i[_], x = i[w];
      if (!u || !x) continue;
      const g = x[0] - u[0], F = x[1] - u[1], k = Math.hypot(g, F);
      if (k < 1e-6) continue;
      let P = -F / k, $ = g / k;
      const T = (u[0] + x[0]) / 2, I = (u[1] + x[1]) / 2;
      (T - p) * P + (I - d) * $ < 0 && (P = -P, $ = -$);
      const Y = c === "ambos" ? [1, -1] : [1];
      for (const te of Y) {
        const me = P * s * te, ke = $ * s * te, et = m.length;
        m.push([u[0] + me, u[1] + ke, u[2]]);
        const Ye = m.length;
        m.push([x[0] + me, x[1] + ke, x[2]]), f.push([_, et]), f.push([w, Ye]), a && f.push([et, Ye]), n && (h.push(f.length), f.push([_, w, Ye, et, _])), M++;
      }
    }
    if (!M) return 0;
    f.push([]), t.points.val = m, t.polylines && (t.polylines.val = f), t.areas && (t.areas.val = h);
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
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    const s = !!(Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3), n = s ? [{ point: Tt.p.clone(), distance: o.position.distanceTo(Tt.p) }] : ge();
    if (!n.length) return;
    if (!s) {
      const c = o.position.distanceTo(S.target) || 1, i = n[0].distance ?? o.position.distanceTo(n[0].point), l = n[0].point;
      if (!isFinite(l.x) || !isFinite(l.y) || !isFinite(l.z) || i > Math.max(c * 12, 300)) {
        le("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let a = n[0].point;
    (e.ctrlKey || e.metaKey) && (a = new V(Math.round(n[0].point.x), Math.round(n[0].point.y), Math.round(n[0].point.z)));
    {
      const c = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = c[c.length - 1] ?? [], l = t.points.rawVal ?? [];
      if (i.length > 0) {
        const r = l[i[i.length - 1]];
        if (r) {
          const p = !!window.__hekatanOrthoMode;
          let d = _t;
          if (!d && p) {
            const m = Math.abs(a.x - r[0]), f = Math.abs(a.y - r[1]), h = Math.abs(a.z - r[2]);
            d = m >= f && m >= h ? "x" : f >= h ? "y" : "z";
          }
          d === "x" ? a = new V(a.x, r[1], r[2]) : d === "y" ? a = new V(r[0], a.y, r[2]) : d === "z" && (a = new V(r[0], r[1], a.z));
        }
      }
    }
    if (Tt && Math.abs(e.clientX - Tt.x) <= 3 && Math.abs(e.clientY - Tt.y) <= 3) a = Tt.p.clone();
    else if (uo) a = uo.clone(), le(`\u{1F4D0} Eje \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
    else {
      const c = qo(a), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, a.x, a.y, a.z, c, { x: e.clientX, y: e.clientY });
      if (i) a = new V(i.x, i.y, i.z), le(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`);
      else {
        const l = window.__hekatanSnapEnabled !== false, r = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0);
        l && r > 0 && (a = new V(Math.round(a.x / r) * r, Math.round(a.y / r) * r, Math.round(a.z / r) * r));
      }
    }
    Ks(a, e);
  });
  const Ks = (e, o) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const s = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (s === "select" || s === "none" || !s) {
      if (un) {
        Kt && bo();
        const { kind: i, a: l, b: r } = un, p = r !== void 0 ? `${i}:${l}:${r}` : `${i}:${l}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ne.clear(), Ne.has(p) ? Ne.delete(p) : Ne.add(p), Ot(), le(`\u2713 Seleccionados ${Ne.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const i = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), l = (o == null ? void 0 : o.clientX) ?? 0, r = (o == null ? void 0 : o.clientY) ?? 0;
        Kt ? (Is(Kt.x, Kt.y, l, r, i), Kt = null) : i || (Kt = { x: l, y: r }, le("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Go(l, r, l + 1, r + 1, false));
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
      qs(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "delete") {
      if (vn >= 0) {
        const i = window.__hekatanDrawingAuxLines, l = (i == null ? void 0 : i.rawVal) ?? (i == null ? void 0 : i.val) ?? i ?? [], r = vn;
        if (r >= 0 && r < l.length) {
          vt();
          const p = l.slice(0, r).concat(l.slice(r + 1));
          i && typeof i == "object" && "val" in i ? i.val = p : window.__hekatanDrawingAuxLines = p, le(`\u{1F5D1} L\xEDnea auxiliar #${r + 1} borrada`), vn = -1, Zt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (ln >= 0) {
        const i = ln, l = gn;
        ((_g = (_f = t.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(i)) ?? false ? (wo(i), le(`\u{1F5D1} \xC1rea #${i + 1} (shell Q4) borrada`)) : l >= 0 ? (Ss(i, l), le(`\u{1F5D1} Segmento ${l + 1} de polil\xEDnea #${i + 1} borrado`)) : (wo(i), le(`\u{1F5D1} Polil\xEDnea #${i + 1} borrada`));
      } else le("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (s === "circle") {
      if (Xe.push([e.x, e.y, e.z]), Xe.length === 1) {
        le("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [i, l] = Xe, r = Math.hypot(l[0] - i[0], l[1] - i[1], l[2] - i[2]), p = Math.abs(l[0] - i[0]), d = Math.abs(l[1] - i[1]), m = Math.abs(l[2] - i[2]), f = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), M = (f === "xy" ? m < 1e-3 : f === "xz" ? d < 1e-3 : f === "yz" ? p < 1e-3 : false) ? f : m < 1e-3 ? "xy" : d < 1e-3 ? "xz" : "yz", _ = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, i[0], i[1], i[2], r, _, M), le(`\u2713 C\xEDrculo dibujado en ${M.toUpperCase()} \u2014 r=${r.toFixed(2)}m, ${_} segmentos`), Xe = [];
      try {
        (_l = window.__hekatanRebuild) == null ? void 0 : _l.call(window);
      } catch {
      }
      return;
    }
    if (s === "ifcface") {
      if (!O) {
        le("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!O.plana) {
        le("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const i = q(O.m), l = be(i, O.tris);
      if (l.length < 3) {
        le("\u25A6 No se pudo cerrar el contorno de la cara.");
        return;
      }
      const r = O.normal.clone(), p = G(O.m, O.punto, r);
      let d = String(window.__hekatanIfcCaraPos ?? "auto"), m = false;
      try {
        const g = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        m = Math.round((g == null ? void 0 : g.matShell) ?? 0) === 1;
      } catch {
      }
      d === "auto" && (d = Math.abs(r.z) > 0.5 ? m ? "interior" : "exterior" : "media");
      const f = p ?? 0.2, h = d === "exterior" ? 0 : d === "interior" ? f : f / 2, M = l.map((g) => g.clone().addScaledVector(r, -h));
      vt(), at = M.map((g) => [g.x, g.y, g.z]);
      const _ = vo();
      try {
        const g = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        g && p && (g.tShell = Math.round(p * 100) / 100);
      } catch {
      }
      const w = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let u = "la de \xABSecci\xF3n shells\xBB";
      try {
        const g = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        g && g.formaPlaca != null && (u = w[Math.round(g.formaPlaca)] ?? u);
      } catch {
      }
      const x = d === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : d === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + f.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (f / 2).toFixed(2) + " m hacia dentro)";
      le(`\u25A6 \xC1rea desde la cara del IFC: ${l.length} v\xE9rtices, ${_} shell(s). Espesor medido ${p ? p.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${x}; formulaci\xF3n ${u}, t = ${f.toFixed(2)} m.`), ye(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      C();
      return;
    }
    if (s === "ifcline") {
      if (!re || re.length < 2) {
        le("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const i = X(re);
      vt();
      const l = t.points.rawVal, r = [], p = [];
      for (const m of i) {
        let f = l.findIndex((h) => Math.abs(h[0] - m[0]) < 1e-3 && Math.abs(h[1] - m[1]) < 1e-3 && Math.abs(h[2] - m[2]) < 1e-3);
        f < 0 && (f = l.length + p.length, p.push(m)), r.push(f);
      }
      if (t.points.val = [...l, ...p], t.polylines) {
        const m = t.polylines.rawVal, f = m.length && m[m.length - 1].length === 0 ? m.slice(0, -1) : m;
        t.polylines.val = [...f, r, []];
      }
      const d = re.reduce((m, f, h) => h ? m + f.distanceTo(re[h - 1]) : 0, 0);
      le(`\u27CB L\xEDnea del IFC copiada: ${i.length - 1} tramo(s), ${d.toFixed(2)} m de desarrollo.`), W(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      C();
      return;
    }
    if (s === "arc") {
      if (Xe.push([e.x, e.y, e.z]), Xe.length === 1) {
        le("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Xe.length === 2) {
        le("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [i, l, r] = Xe, p = window.__hekatanArcSegs ?? 12;
      (_r = window.__hekatanDrawArc) == null ? void 0 : _r.call(window, i, l, r, p), le(`\u2713 Arco dibujado \u2014 ${p} segmentos`), Xe = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (s === "parabola" || s === "cubica") {
      const i = s === "parabola" ? 3 : 4, l = s === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (Xe.push([e.x, e.y, e.z]), Xe.length < i) {
        le(`\u223F ${l} \u2014 punto ${Xe.length}/${i} OK. Marc\xE1 el ${Xe.length + 1}\xBA.`);
        return;
      }
      const r = window.__hekatanArcSegs ?? 12, p = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, Xe.slice(), r);
      if (!(p == null ? void 0 : p.ok)) {
        le(`\u26A0 ${l}: ${(p == null ? void 0 : p.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), Xe = [];
        return;
      }
      const d = "xyz"[p.ia ?? 0], m = "xyz"[p.io ?? 2], f = (p.coef ?? []).map((h, M) => `${h >= 0 && M ? "+" : ""}${h.toFixed(3)}${M ? "\xB7" + d + (M > 1 ? "^" + M : "") : ""}`).join(" ");
      le(`\u2713 ${l} dibujada en ${String(p.plano ?? "").toUpperCase()} \u2014 ${r} tramos a \u0394 igual de ${d} \xB7 ${m} = ${f}`), Xe = [];
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
      if (Xe.push([e.x, e.y, e.z]), Xe.length === 1) {
        le("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Xe;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, i, l), le(`\u2713 Rect\xE1ngulo dibujado \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Xe = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (s === "medir") {
      const l = (Tt && Math.abs(Tt.x - o.clientX) < 3 && Math.abs(Tt.y - o.clientY) < 3 ? [Tt.p.x, Tt.p.y, Tt.p.z] : null) ?? Nt(o);
      if (!l) return;
      if (Ke.length >= 2 && (Ke = []), Ke.push(l), Ke.length === 1) bt.visible = false, Ct(), le("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [r, p] = Ke;
        bt.geometry.setFromPoints([new V(r[0], r[1], r[2]), new V(p[0], p[1], p[2])]), bt.visible = true;
        const d = Math.hypot(p[0] - r[0], p[1] - r[1], p[2] - r[2]), m = Math.hypot(p[0] - r[0], p[1] - r[1]);
        je.textContent = `${d.toFixed(3)} m`, Ct(), le(`\u{1F4CF} Distancia ${d.toFixed(3)} m  \xB7  \u0394x ${(p[0] - r[0]).toFixed(3)}  \u0394y ${(p[1] - r[1]).toFixed(3)}  \u0394z ${(p[2] - r[2]).toFixed(3)}  \xB7  en planta ${m.toFixed(3)} m`);
      }
      C();
      return;
    }
    if (s === "fillarea") {
      const i = t.points.rawVal, l = ((_B = t.polylines) == null ? void 0 : _B.rawVal) ?? [], r = /* @__PURE__ */ new Map(), p = (T, I) => {
        T !== I && ((r.get(T) ?? r.set(T, /* @__PURE__ */ new Set()).get(T)).add(I), (r.get(I) ?? r.set(I, /* @__PURE__ */ new Set()).get(I)).add(T));
      };
      for (const T of l) for (let I = 0; I + 1 < T.length; I++) p(T[I], T[I + 1]);
      const d = (T, I) => {
        var _a4;
        return !!((_a4 = r.get(T)) == null ? void 0 : _a4.has(I));
      }, m = /* @__PURE__ */ new Set(), f = [], h = [...r.keys()];
      for (const T of h) for (const I of r.get(T)) if (!(I < T)) {
        for (const Y of r.get(I)) if (Y !== T) for (const te of r.get(Y)) {
          if (te === T || te === I || !d(te, T) || d(T, Y) || d(I, te)) continue;
          const me = [T, I, Y, te].slice().sort((ke, et) => ke - et).join("-");
          m.has(me) || (m.add(me), f.push([T, I, Y, te]));
        }
      }
      for (const T of h) for (const I of r.get(T)) if (!(I < T)) for (const Y of r.get(I)) {
        if (Y === T || !d(Y, T)) continue;
        const te = [T, I, Y].slice().sort((me, ke) => me - ke).join("-");
        m.has(te) || (m.add(te), f.push([T, I, Y]));
      }
      const M = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", _ = (T) => M === "xy" ? [T[0], T[1]] : M === "xz" ? [T[0], T[2]] : [T[1], T[2]], w = _([e.x, e.y, e.z]), u = (T, I) => {
        let Y = false;
        for (let te = 0, me = I.length - 1; te < I.length; me = te++) {
          const ke = I[te][0], et = I[te][1], Ye = I[me][0], Qe = I[me][1];
          et > T[1] != Qe > T[1] && T[0] < (Ye - ke) * (T[1] - et) / (Qe - et) + ke && (Y = !Y);
        }
        return Y;
      }, x = (T) => {
        let I = 0;
        for (let Y = 0, te = T.length - 1; Y < T.length; te = Y++) I += (T[te][0] + T[Y][0]) * (T[te][1] - T[Y][1]);
        return Math.abs(I) / 2;
      };
      let g = null, F = 1 / 0;
      for (const T of f) {
        const I = T.map((te) => _(i[te]));
        if (!u(w, I)) continue;
        const Y = x(I);
        Y < F && (F = Y, g = T);
      }
      if (!g) {
        le("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const k = g.slice().sort((T, I) => T - I).join("-"), P = ((_F = t.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (P.some((T) => {
        const I = l[T] ?? [];
        return [...new Set(I)].sort((Y, te) => Y - te).join("-") === k;
      })) {
        le("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      t.polylines.val = [...l, [...g, g[0]]], t.areas.val = [...P, l.length], le(`\u2713 \xC1rea creada por relleno (${g.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (s === "rectarea") {
      if (Xe.push([e.x, e.y, e.z]), Xe.length === 1) {
        le("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Xe;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, i, l), le(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${i[0].toFixed(1)},${i[1].toFixed(1)}) \u2192 (${l[0].toFixed(1)},${l[1].toFixed(1)})`), Xe = [];
      return;
    }
    if (s === "polyarea") {
      at.push([e.x, e.y, e.z]), it.geometry.setFromPoints(at.map((i) => new V(i[0], i[1], i[2]))), it.visible = at.length >= 1, le(`\u25B0 \xC1rea libre \u2014 ${at.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), C();
      return;
    }
    if (s === "plane3") {
      if (Xe.push([e.x, e.y, e.z]), Xe.length < 3) {
        le(`\u25E3 Plano inclinado \u2014 punto ${Xe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [i, l, r] = Xe, p = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, i, l, r);
      le(p ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Xe = [];
      return;
    }
    if (s === "col") {
      vt();
      const i = e.z, l = kt && kt > 0 ? kt : 3;
      t.points.val = [...t.points.rawVal, [e.x, e.y, i], [e.x, e.y, i + l]];
      const r = t.polylines.rawVal, p = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [p - 2, p - 1], []], kt = 0, le(`\u258C Columna creada \u2014 h=${l.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (s === "wall") {
      if (Xe.push([e.x, e.y, e.z]), Xe.length === 1) {
        le("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [i, l] = Xe, r = kt && kt > 0 ? kt : 3;
      vt();
      const p = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [i[0], i[1], i[2]], [l[0], l[1], l[2]], [l[0], l[1], l[2] + r], [i[0], i[1], i[2] + r]];
      const d = t.polylines.rawVal;
      if (d.length - 1, t.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [p, p + 1, p + 2, p + 3, p], []], t.areas) {
        const m = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, m];
      }
      le(`\u25A5 Pared Q4 creada \u2014 h=${r.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Xe = [], kt = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (s === "extp") {
      vt();
      const i = kt && kt > 0 ? kt : 3, l = e.z;
      t.points.val = [...t.points.rawVal, [e.x, e.y, l], [e.x, e.y, l + i]];
      const r = t.polylines.rawVal, p = t.points.rawVal.length;
      t.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [p - 2, p - 1], []], kt = 0, le(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${i.toFixed(2)}m`);
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
      const r = t.polylines.rawVal, p = t.points.rawVal, d = r[l.polyIdx], m = p[d[l.segIdx]], f = p[d[l.segIdx + 1]];
      if (!m || !f) {
        le("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const h = kt && kt > 0 ? kt : 3;
      vt();
      const M = t.points.rawVal.length;
      t.points.val = [...t.points.rawVal, [m[0], m[1], m[2]], [f[0], f[1], f[2]], [f[0], f[1], f[2] + h], [m[0], m[1], m[2] + h]];
      const _ = t.polylines.rawVal;
      if (t.polylines.val = [..._.slice(0, -1), ..._[_.length - 1].length > 0 ? [_[_.length - 1]] : [], [M, M + 1, M + 2, M + 3, M], []], t.areas) {
        const w = t.polylines.rawVal.length - 2;
        t.areas.val = [...t.areas.rawVal, w];
      }
      kt = 0, le(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${h.toFixed(2)}m`);
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
      if (Xe.push([e.x, e.y, e.z]), Xe.length === 1) {
        le("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [i, l] = Xe, r = window.__hekatanDrawingAuxLines;
      if (r) {
        vt();
        const h = r.rawVal ?? r.val ?? [];
        r.val = [...h, [i[0], i[1], i[2], l[0], l[1], l[2]]];
      }
      const p = l[0] - i[0], d = l[1] - i[1], m = l[2] - i[2], f = Math.sqrt(p * p + d * d + m * m);
      le(`\u2713 L\xEDnea auxiliar creada \u2014 L=${f.toFixed(2)}m (cyan, no FEM)`), Xe = [];
      return;
    }
    if (s === "extend" || s === "trim" || s === "offset") {
      Xa(s, [e.x, e.y, e.z]);
      return;
    }
    if (s === "chaflan") {
      if (Xe.push([e.x, e.y, e.z]), Xe.length === 1) {
        le("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [i, l] = Xe, r = window.__hekatanChaflanR ?? 1, p = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, i, l, r, p, 6);
      const d = Math.abs(l[0] - i[0]).toFixed(1), m = Math.abs(l[1] - i[1]).toFixed(1);
      le(`\u2713 Losa con chaflanes dibujada \u2014 ${d}\xD7${m}m, r=${r}m, ${p} seg/chafl\xE1n`), Xe = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    Me = false, vt();
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
  E.addEventListener("click", () => Gt()), E.addEventListener("contextmenu", (e) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && at.length >= 3) {
      e.preventDefault();
      const s = vo();
      le(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`);
      return;
    }
    !t.polylines || t.polylines.rawVal[t.polylines.rawVal.length - 1].length === 0 || (t.polylines.val = [...t.polylines.rawVal, []]);
  }), E.addEventListener("pointermove", (e) => {
    var _a3, _b, _c;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    const s = ge();
    if (De.geometry.deleteAttribute("position"), s.length) {
      let n = s[0].point.clone();
      (e.ctrlKey || e.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const i = ((_a3 = t.polylines) == null ? void 0 : _a3.rawVal) ?? [], l = i[i.length - 1] ?? [], r = t.points.rawVal ?? [];
        if (l.length > 0) {
          const p = r[l[l.length - 1]];
          if (p) {
            const d = !!window.__hekatanOrthoMode;
            let m = _t;
            if (!m && d) {
              const f = Math.abs(n.x - p[0]), h = Math.abs(n.y - p[1]), M = Math.abs(n.z - p[2]);
              m = f >= h && f >= M ? "x" : h >= M ? "y" : "z";
            }
            m === "x" ? n.set(n.x, p[1], p[2]) : m === "y" ? n.set(p[0], n.y, p[2]) : m === "z" && n.set(p[0], p[1], n.z);
          }
        }
      }
      const a = qo(n), c = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, a, { x: e.clientX, y: e.clientY });
      if (c) n.set(c.x, c.y, c.z);
      else {
        const i = window.__hekatanSnapEnabled !== false, l = ((_c = window.__hekatanGridConfig) == null ? void 0 : _c.minorStep) || (window.__hekatanSnap2D ?? 0.5);
        i && l > 0 && (n.x = Math.round(n.x / l) * l, n.y = Math.round(n.y / l) * l, n.z = Math.round(n.z / l) * l);
      }
      De.geometry.setAttribute("position", new $t(n.toArray(), 3));
    }
    C();
  }), E.addEventListener("pointermove", (e) => {
    var _a3;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    let s = false;
    const n = L.intersectObject(Le), a = ge();
    if (n.length && a.length) {
      const c = new V(...t.points.rawVal[n[0].index]), i = new V(...a[0].point), l = c.sub(i), r = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      r.transformDirection(ne.matrixWorld), Math.abs(l.dot(r)) < 1e-4 && (s = true);
    }
    De.visible = !s;
  });
  let ts = false, ns;
  E.addEventListener("pointermove", (e) => {
    var _a3;
    if (!Fn) return;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    let s = false;
    const n = L.intersectObject(Le), a = ge();
    if (n.length && a.length) {
      const i = new V(...t.points.rawVal[n[0].index]), l = new V(...a[0].point), r = i.sub(l), p = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      p.transformDirection(ne.matrixWorld), Math.abs(r.dot(p)) < 1e-4 && (s = true);
    }
    if (s && Fn < 5 && (ts = true, S.enabled = false, ns = n[0].index), !ts || Fn % 2 !== 0) return;
    const c = [...t.points.rawVal];
    if (ns !== void 0) {
      let i = a[0].point;
      (e.ctrlKey || e.metaKey) && (i = new V(Math.round(i.x), Math.round(i.y), Math.round(i.z))), c[ns] = i.toArray();
    }
    t.points.val = c;
  }), E.addEventListener("pointerup", () => {
    S.enabled = true, ts = false;
  }), E.addEventListener("contextmenu", (e) => {
    var _a3;
    const o = B(e);
    if (!o) return;
    L.setFromCamera(N, o);
    let s = false;
    const n = L.intersectObject(Le), a = ge();
    if (n.length && a.length) {
      const l = new V(...t.points.rawVal[n[0].index]), r = new V(...a[0].point), p = l.sub(r), d = (_a3 = a[0].face) == null ? void 0 : _a3.normal;
      d.transformDirection(ne.matrixWorld), Math.abs(p.dot(d)) < 1e-4 && (s = true);
    }
    if (!s) return;
    const c = [...t.points.rawVal];
    if (c.splice(n[0].index, 1), t.points.val = c, !t.polylines) return;
    const i = t.polylines.rawVal.map((l) => l.filter((r) => r !== n[0].index)).map((l) => l.map((r) => r > n[0].index ? r - 1 : r)).filter((l) => l.length);
    i.push([]), t.polylines.val = i;
  });
}
function $i(t, y, v) {
  const z = Math.round(14.999999999999998), A = { position: t.position.clone(), quaternion: t.quaternion.clone() }, E = setInterval(L, 1e3 / 30);
  let C = 0;
  function L() {
    C++;
    const N = C / z;
    t.position.lerpVectors(A.position, y.position, N), t.quaternion.slerpQuaternions(A.quaternion, y.quaternion, N), v && v(), C == z && clearInterval(E);
  }
}
function Ii(t, y, v, b) {
  const S = ui(v, t.elements, b);
  return ce.derive(() => {
    S.visible = y.shellResults.val != "none";
  }), S;
}
const Li = 6, fs = 10, Ti = 0.012;
function Ri(t) {
  return t.startsWith("contour:") ? t.slice(8) : null;
}
function Di(t, y, v, b) {
  if (!v && !b) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(t) && v) {
    const z = v[t];
    if (z && z.has(y)) return z.get(y);
  }
  return null;
}
function Bi(t, y, v, b) {
  const S = new rt(), z = new ma();
  z.setColorMap("rainbow");
  const A = new nn(), E = ce.state([]);
  return ce.derive(() => {
    var _a, _b, _c;
    y.deformedShape.val;
    const C = v.val, L = ((_a = t.elements) == null ? void 0 : _a.val) ?? [], N = Ri(y.frameResults.val);
    if (S.children.forEach((R) => {
      R.geometry && R.geometry.dispose(), R.material && R.material.dispose();
    }), S.clear(), !N || L.length === 0 || C.length === 0) {
      E.val = [];
      return;
    }
    const B = (_b = t.analyzeOutputs) == null ? void 0 : _b.val, ne = (_c = t.deformOutputs) == null ? void 0 : _c.val, pe = [], we = [];
    for (let R = 0; R < L.length; R++) {
      if (L[R].length !== 2) continue;
      const fe = Di(N, R, B, ne);
      fe && (pe.push(fe[0], fe[1]), we.push({ idx: R, vals: fe }));
    }
    if (pe.length === 0) {
      E.val = [];
      return;
    }
    const j = Math.min(...pe), U = Math.max(...pe);
    z.setMin(j), z.setMax(U), E.val = pe;
    const de = [1 / 0, 1 / 0, 1 / 0], Z = [-1 / 0, -1 / 0, -1 / 0];
    for (const R of C) for (let O = 0; O < 3; O++) de[O] = Math.min(de[O], R[O]), Z[O] = Math.max(Z[O], R[O]);
    const ae = Math.max(Z[0] - de[0], Z[1] - de[1], Z[2] - de[2], 1) * Ti, se = [], J = [], H = [];
    let W = 0;
    for (const { idx: R, vals: O } of we) {
      const fe = L[R], ye = C[fe[0]], be = C[fe[1]];
      if (!ye || !be) continue;
      const G = new V(be[0] - ye[0], be[1] - ye[1], be[2] - ye[2]), _e = G.length();
      if (_e < 1e-10) continue;
      G.normalize();
      const ue = Math.abs(G.y) < 0.99 ? new V(0, 1, 0) : new V(1, 0, 0), Ve = new V().crossVectors(G, ue).normalize(), he = new V().crossVectors(G, Ve).normalize(), Ie = fs + 1, ve = Li;
      for (let qe = 0; qe < Ie; qe++) {
        const Je = qe / fs, xt = ye[0] + G.x * _e * Je, gt = ye[1] + G.y * _e * Je, xe = ye[2] + G.z * _e * Je, D = O[0] + (O[1] - O[0]) * Je, oe = z.getColor(D) ?? new nn(0, 0, 0);
        A.copy(oe).convertSRGBToLinear();
        for (let ee = 0; ee < ve; ee++) {
          const ie = ee / ve * Math.PI * 2, Ce = Math.cos(ie), Se = Math.sin(ie);
          se.push(xt + (Ve.x * Ce + he.x * Se) * ae, gt + (Ve.y * Ce + he.y * Se) * ae, xe + (Ve.z * Ce + he.z * Se) * ae), J.push(A.r, A.g, A.b);
        }
      }
      for (let qe = 0; qe < fs; qe++) for (let Je = 0; Je < ve; Je++) {
        const xt = (Je + 1) % ve, gt = W + qe * ve + Je, xe = W + qe * ve + xt, D = W + (qe + 1) * ve + Je, oe = W + (qe + 1) * ve + xt;
        H.push(gt, xe, oe), H.push(gt, oe, D);
      }
      W += Ie * ve;
    }
    if (se.length === 0) return;
    const X = new Ee();
    X.setAttribute("position", new $t(se, 3)), X.setAttribute("color", new $t(J, 3)), X.setIndex(H), X.computeVertexNormals();
    const K = new pt({ vertexColors: true, side: Vt }), q = new lt(X, K);
    q.frustumCulled = false, S.add(q);
  }), S.__colorMapValues = E, S;
}
function Ni() {
  const t = window;
  return { forceUnit: t.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: t.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: t.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Xi = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Yi = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ui = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function St(t, y = 4) {
  return t == null || !isFinite(t) ? "\u2014" : t === 0 ? "0" : Math.abs(t) < 1e-3 || Math.abs(t) > 1e5 ? t.toExponential(y) : t.toFixed(y);
}
const Zi = 16755200, la = 56831, qi = 56831, Ki = 56831, $o = 65382;
function Gi(t) {
  const y = new rt();
  y.name = "__hekatan_hover", y.renderOrder = 99;
  const v = new Gn(1, 16, 16), b = new pt({ color: Zi, transparent: true, opacity: 0.85, depthTest: false }), S = new lt(v, b);
  S.visible = false, S.renderOrder = 100, y.add(S);
  const z = new Ee(), A = new ct({ color: la, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), E = new Ht(z, A);
  E.visible = false, E.renderOrder = 100, y.add(E);
  const C = new pt({ color: la, transparent: true, opacity: 0.7, depthTest: false }), L = new lt(new oa(1, 1, 1, 12), C);
  L.visible = false, L.renderOrder = 100, y.add(L);
  const N = new Ee(), B = new pt({ color: qi, transparent: true, opacity: 0.45, side: Vt, depthTest: false }), ne = new lt(N, B);
  ne.visible = false, ne.renderOrder = 100, y.add(ne);
  const pe = new Ee(), we = new ct({ color: Ki, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), j = new Ht(pe, we);
  j.visible = false, j.renderOrder = 100, y.add(j);
  const U = new pt({ color: $o, transparent: true, opacity: 0.95, depthTest: false }), de = new pt({ color: $o, transparent: true, opacity: 0.85, depthTest: false }), Z = new oa(1, 1, 1, 12), re = new pt({ color: $o, transparent: true, opacity: 0.55, side: Vt, depthTest: false }), ae = new ct({ color: $o, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), se = [];
  window.__hekatanModelSelection = se;
  const J = new rt();
  J.renderOrder = 101, y.add(J);
  const H = document.createElement("div");
  Object.assign(H.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), H.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    t.rendererElm.parentElement && t.rendererElm.parentElement.appendChild(H);
  }, 0);
  function W(xe) {
    const D = t.derivedNodes.rawVal;
    return !D || xe < 0 || xe >= D.length ? null : new V(D[xe][0], D[xe][1], D[xe][2]);
  }
  function X(xe, D) {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s;
    const oe = t.getActiveCamera();
    if (!oe || !t.mesh) return null;
    const ee = t.rendererElm.getBoundingClientRect(), ie = xe - ee.left, Ce = D - ee.top, Se = t.derivedNodes.rawVal, ge = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (!Se || !ge) return null;
    const Le = /* @__PURE__ */ new Map(), De = (st) => {
      if (Le.has(st)) return Le.get(st);
      const He = W(st);
      if (!He) return Le.set(st, null), null;
      const ze = He.clone().project(oe), Oe = (ze.x * 0.5 + 0.5) * ee.width, Fe = (-ze.y * 0.5 + 0.5) * ee.height, it = { x: Oe, y: Fe, z: ze.z };
      return Le.set(st, it), it;
    }, ot = /* @__PURE__ */ new Set();
    for (const st of ge) if (st) for (const He of st) ot.add(He);
    const Pe = 8;
    let tt = -1, Ze = Pe;
    for (let st = 0; st < Se.length; st++) {
      if (!ot.has(st)) continue;
      const He = De(st);
      if (!He || He.z < -1 || He.z > 1) continue;
      const ze = He.x - ie, Oe = He.y - Ce, Fe = Math.sqrt(ze * ze + Oe * Oe);
      Fe < Ze && (Ze = Fe, tt = st);
    }
    const We = Ni(), Me = Yi[We.dispUnit] ?? 1e3, Te = Xi[We.forceUnit] ?? 1;
    if (tt >= 0) {
      const st = Se[tt];
      let He = `Nodo ${tt}
(${st[0].toFixed(3)}, ${st[1].toFixed(3)}, ${st[2].toFixed(3)})`;
      const ze = (_c = (_b = t.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (ze == null ? void 0 : ze.deformations) {
        const Oe = ze.deformations.get(tt);
        if (Oe && (He += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, He += `
Ux = ${St(Oe[0] * Me, 3)} ${We.dispUnit}`, He += `
Uy = ${St(Oe[1] * Me, 3)} ${We.dispUnit}`, He += `
Uz = ${St(Oe[2] * Me, 3)} ${We.dispUnit}`, (Math.abs(Oe[3]) > 1e-9 || Math.abs(Oe[4]) > 1e-9 || Math.abs(Oe[5]) > 1e-9) && (He += `
Rx = ${St(Oe[3] * 1e3, 3)} mrad`, He += `
Ry = ${St(Oe[4] * 1e3, 3)} mrad`, He += `
Rz = ${St(Oe[5] * 1e3, 3)} mrad`)), ze.reactions) {
          const Fe = ze.reactions.get(tt);
          Fe && (Math.abs(Fe[0]) > 1e-9 || Math.abs(Fe[1]) > 1e-9 || Math.abs(Fe[2]) > 1e-9 || Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (He += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, He += `
Fx = ${St(Fe[0] * Te)} ${We.forceUnit}`, He += `
Fy = ${St(Fe[1] * Te)} ${We.forceUnit}`, He += `
Fz = ${St(Fe[2] * Te)} ${We.forceUnit}`, (Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (He += `
Mx = ${St(Fe[3] * Te)} ${We.forceUnit}\xB7m`, He += `
My = ${St(Fe[4] * Te)} ${We.forceUnit}\xB7m`, He += `
Mz = ${St(Fe[5] * Te)} ${We.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: tt, info: He };
    }
    const Pt = 5;
    let nt = -1, Mt = Pt, Bt = "frame";
    for (let st = 0; st < ge.length; st++) {
      const He = ge[st];
      if (!(!He || He.length < 2)) {
        if (He.length === 2) {
          const ze = De(He[0]), Oe = De(He[1]);
          if (!ze || !Oe || ze.z < -1 || ze.z > 1 || Oe.z < -1 || Oe.z > 1) continue;
          const Fe = Wi(ie, Ce, ze.x, ze.y, Oe.x, Oe.y);
          Fe < Mt && (Mt = Fe, nt = st, Bt = "frame");
        } else if (He.length === 3 || He.length === 4) {
          const ze = [];
          let Oe = true;
          for (const Fe of He) {
            const it = De(Fe);
            if (!it || it.z < -1 || it.z > 1) {
              Oe = false;
              break;
            }
            ze.push(it);
          }
          if (!Oe) continue;
          if (Hi(ie, Ce, ze)) {
            const it = ze.reduce((at, bt) => at + bt.z, 0) / ze.length * 1e-3;
            it < Mt && (Mt = it, nt = st, Bt = "shell");
          }
        } else if (He.length === 8) {
          const ze = [];
          let Oe = true;
          for (const Ke of He) {
            const je = De(Ke);
            if (!je || je.z < -1 || je.z > 1) {
              Oe = false;
              break;
            }
            ze.push(je);
          }
          if (!Oe) continue;
          const Fe = Math.min(...ze.map((Ke) => Ke.x)), it = Math.max(...ze.map((Ke) => Ke.x)), at = Math.min(...ze.map((Ke) => Ke.y)), bt = Math.max(...ze.map((Ke) => Ke.y));
          if (ie >= Fe && ie <= it && Ce >= at && Ce <= bt) {
            const je = ze.reduce((Nt, Ct) => Nt + Ct.z, 0) / ze.length * 1e-3;
            je < Mt && (Mt = je, nt = st, Bt = "solid");
          }
        }
      }
    }
    if (nt >= 0) {
      const st = ge[nt];
      let ze = `${Bt === "frame" ? "Frame" : Bt === "shell" ? "Shell" : "Solid"} ${nt}`;
      const Oe = (_e2 = (_d = t.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Fe = (_g = (_f = Oe == null ? void 0 : Oe.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, nt);
      if (Fe) {
        Fe.name && (ze += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (ze += `
  Shape: ${Fe.shape}`);
        const it = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), at = it ? 100 : 1e3, bt = it ? "cm" : "mm", Ke = (Nt) => {
          const Ct = Nt * at;
          return Math.abs(Ct - Math.round(Ct)) < 0.05 ? `${Math.round(Ct)}` : `${Ct.toFixed(1)}`;
        }, je = [];
        if (Fe.D != null && je.push(`D=${Ke(Fe.D)}`), Fe.B != null && je.push(`B=${Ke(Fe.B)}`), Fe.TF != null && je.push(`TF=${Ke(Fe.TF)}`), Fe.TW != null && je.push(`TW=${Ke(Fe.TW)}`), Fe.t != null && je.push(`t=${Ke(Fe.t)}`), je.length && (ze += `
  Dim: ${je.join(" ")} ${bt}`), Fe.material) {
          let Nt = Fe.material;
          Fe.fillMaterial && (Nt += ` + FILL "${Fe.fillMaterial}"`), ze += `
  Mat: ${Nt}`;
        }
      } else {
        const it = (_i2 = (_h = Oe == null ? void 0 : Oe.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, nt), at = (_k = (_j = Oe == null ? void 0 : Oe.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, nt);
        it ? (ze += `
  ${it}`, at && !it.includes(at) && (ze += `  (${at})`)) : at && (ze += `
  Material: ${at}`);
      }
      if (ze += `
nodos: [${st.join(", ")}]`, Bt === "shell" && ((_l = t.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const it = t.mesh.analyzeOutputs.rawVal, at = Ui[We.stressUnit] ?? 1, bt = [["bendingXX", "Mxx", Te, `${We.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Te, `${We.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Te, `${We.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Te, `${We.forceUnit}/m`], ["membraneYY", "Nyy", Te, `${We.forceUnit}/m`], ["membraneXY", "Nxy", Te, `${We.forceUnit}/m`], ["shearX", "Qx", Te, `${We.forceUnit}/m`], ["shearY", "Qy", Te, `${We.forceUnit}/m`], ["vonMises", "\u03C3VM", at, We.stressUnit], ["pressure", "p", at, We.stressUnit]], Ke = [];
        for (const [je, Nt, Ct, mt] of bt) {
          const fn = it == null ? void 0 : it[je];
          if (fn && fn instanceof Map) {
            const zt = fn.get(nt);
            if (zt != null) {
              if (typeof zt == "number") Ke.push(`${Nt} = ${St(zt * Ct, 3)} ${mt}`);
              else if (Array.isArray(zt)) {
                let Lt = zt[0];
                for (const hn of zt) Math.abs(hn) > Math.abs(Lt) && (Lt = hn);
                Ke.push(`${Nt} = ${St(Lt * Ct, 3)} ${mt}`);
              }
            }
          }
        }
        Ke.length > 0 && (ze += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ke.slice(0, 8).join(`
`));
      }
      if (Bt === "frame" && ((_m = t.mesh) == null ? void 0 : _m.deformOutputs) && t.mesh.elementInputs) {
        const it = t.mesh.deformOutputs.rawVal, at = t.mesh.elementInputs.rawVal, bt = it == null ? void 0 : it.deformations;
        if (bt && st.length === 2) {
          const Ke = bt.get(st[0]), je = bt.get(st[1]), Nt = Se[st[0]], Ct = Se[st[1]];
          if (Ke && je && Nt && Ct) {
            const mt = Ct[0] - Nt[0], fn = Ct[1] - Nt[1], zt = Ct[2] - Nt[2], Lt = Math.sqrt(mt * mt + fn * fn + zt * zt);
            if (Lt > 1e-9) {
              const hn = mt / Lt, Sn = fn / Lt, co = zt / Lt, Xt = (je[0] - Ke[0]) * hn + (je[1] - Ke[1]) * Sn + (je[2] - Ke[2]) * co, mn = ((_n2 = at.elasticities) == null ? void 0 : _n2.get(nt)) ?? 0, Pn = ((_o = at.areas) == null ? void 0 : _o.get(nt)) ?? 0, Cn = ((_p = at.momentsOfInertiaY) == null ? void 0 : _p.get(nt)) ?? 0, zn = ((_q = at.momentsOfInertiaZ) == null ? void 0 : _q.get(nt)) ?? 0, Wn = ((_r = at.torsionalConstants) == null ? void 0 : _r.get(nt)) ?? 0, No = ((_s = at.shearModuli) == null ? void 0 : _s.get(nt)) ?? mn / 2.6, Yt = mn * Pn * (Xt / Lt), Hn = (je[3] - Ke[3]) * hn + (je[4] - Ke[4]) * Sn + (je[5] - Ke[5]) * co, An = No * Wn * (Hn / Lt), Rn = je[4] - Ke[4], Dn = je[5] - Ke[5], on = mn * Cn * Rn / Lt, Bn = mn * zn * Dn / Lt;
              ze += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, ze += `
L = ${St(Lt, 3)} m`, ze += `
\u0394L = ${St(Xt * Me, 3)} ${We.dispUnit}`, ze += `
\u03B5 = ${St(Xt / Lt, 6)}`, Math.abs(Yt) > 1e-6 && (ze += `
N \u2248 ${St(Yt * Te)} ${We.forceUnit}`), Math.abs(An) > 1e-6 && (ze += `
T \u2248 ${St(An * Te)} ${We.forceUnit}\xB7m`), Math.abs(on) > 1e-6 && (ze += `
My \u2248 ${St(on * Te)} ${We.forceUnit}\xB7m`), Math.abs(Bn) > 1e-6 && (ze += `
Mz \u2248 ${St(Bn * Te)} ${We.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Bt, idx: nt, info: ze };
    }
    return null;
  }
  function K(xe, D, oe) {
    var _a, _b, _c;
    if (S.visible = false, E.visible = false, L.visible = false, ne.visible = false, j.visible = false, !xe || !t.mesh) {
      H.style.display = "none", t.render();
      return;
    }
    const ee = (_a = t.mesh.elements) == null ? void 0 : _a.rawVal;
    if (xe.type === "node") {
      const ge = W(xe.idx);
      if (ge) {
        const Le = t.derivedNodes.rawVal ?? [];
        let De = 1;
        if (Le.length >= 2) {
          let tt = [1 / 0, 1 / 0, 1 / 0], Ze = [-1 / 0, -1 / 0, -1 / 0];
          for (const We of Le) for (let Me = 0; Me < 3; Me++) We[Me] < tt[Me] && (tt[Me] = We[Me]), We[Me] > Ze[Me] && (Ze[Me] = We[Me]);
          De = Math.max(Ze[0] - tt[0], Ze[1] - tt[1], Ze[2] - tt[2], 0.1);
        }
        const ot = ((_b = t.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Pe = 0.021 * De * ot;
        S.position.copy(ge), S.scale.setScalar(Pe), S.visible = true;
      }
    } else if (xe.type === "frame" && ee) {
      const ge = ee[xe.idx], Le = W(ge[0]), De = W(ge[1]);
      if (Le && De) {
        const ot = Le.clone().add(De).multiplyScalar(0.5), Pe = De.clone().sub(Le), tt = Pe.length(), Ze = Math.max(1e-4, 3.5 * ve(ot));
        L.position.copy(ot);
        const We = new V(0, 1, 0), Me = We.clone().cross(Pe).normalize(), Te = We.angleTo(Pe);
        L.quaternion.setFromAxisAngle(Me, Te), L.scale.set(Ze, tt, Ze), L.visible = true;
      }
    } else if (xe.type === "shell" && ee) {
      const ge = ee[xe.idx], Le = [], De = [];
      for (const ot of ge) {
        const Pe = W(ot);
        if (!Pe) return;
        Le.push(Pe.x, Pe.y, Pe.z);
      }
      ge.length === 4 ? De.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && De.push(0, 1, 2), N.setAttribute("position", new $t(Le, 3)), N.setIndex(De), N.computeVertexNormals(), ne.visible = true;
    } else if (xe.type === "solid" && ee) {
      const ge = ee[xe.idx], Le = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], De = [];
      for (const [ot, Pe] of Le) {
        const tt = W(ge[ot]), Ze = W(ge[Pe]);
        tt && Ze && De.push(tt.x, tt.y, tt.z, Ze.x, Ze.y, Ze.z);
      }
      pe.setAttribute("position", new $t(De, 3)), j.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      H.style.display = "none", t.render();
      return;
    }
    H.textContent = xe.info, H.style.whiteSpace = "pre-line", H.style.display = "block";
    const Ce = t.rendererElm.getBoundingClientRect(), Se = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? Ce;
    H.style.left = `${D - Se.left}px`, H.style.top = `${oe - Se.top}px`, t.render();
  }
  let q = "", R = 0, O = 0;
  const fe = window.__hekatanHoverDebug ?? false, ye = (xe) => {
    R && cancelAnimationFrame(R), R = requestAnimationFrame(() => {
      var _a, _b, _c;
      const D = X(xe.clientX, xe.clientY);
      if (fe && O < 5) {
        const ee = t.derivedNodes.rawVal, ie = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${xe.clientX}, ${xe.clientY}) nodes=${(ee == null ? void 0 : ee.length) ?? 0} elems=${(ie == null ? void 0 : ie.length) ?? 0} hover=`, D), O++;
      }
      const oe = D ? `${D.type}:${D.idx}` : "";
      if (oe !== q) q = oe, K(D, xe.clientX, xe.clientY);
      else if (D) {
        const ee = ((_c = t.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? t.rendererElm.getBoundingClientRect();
        H.style.left = `${xe.clientX - ee.left}px`, H.style.top = `${xe.clientY - ee.top}px`;
      }
    });
  };
  let be = null;
  const G = () => {
    q = "", S.visible = false, E.visible = false, L.visible = false, ne.visible = false, j.visible = false, H.style.display = "none", t.render();
  }, _e = (xe) => {
    const D = t.rendererElm.getBoundingClientRect(), oe = xe.clientX - D.left, ee = xe.clientY - D.top;
    (oe < -2 || ee < -2 || oe > D.width + 2 || ee > D.height + 2) && (be && clearTimeout(be), be = window.setTimeout(G, 200));
  }, ue = () => {
    be && (clearTimeout(be), be = null);
  };
  t.rendererElm.addEventListener("pointermove", ye), t.rendererElm.addEventListener("pointerleave", _e), t.rendererElm.addEventListener("pointerenter", ue);
  function Ve() {
    var _a, _b, _c;
    const xe = ((_c = (_b = (_a = window.__hekatanCadState) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.tool) ?? "select";
    return xe === "select" || xe === "none" || !xe;
  }
  let he = null;
  t.rendererElm.addEventListener("pointerdown", (xe) => {
    xe.button === 0 && (he = { x: xe.clientX, y: xe.clientY });
  }), t.rendererElm.addEventListener("pointerup", (xe) => {
    if (xe.button !== 0 || !he) return;
    const D = xe.clientX - he.x, oe = xe.clientY - he.y;
    if (he = null, D * D + oe * oe > 9 || !Ve()) return;
    const ee = X(xe.clientX, xe.clientY);
    ee ? (xt({ type: ee.type, idx: ee.idx }, xe.shiftKey), Je()) : gt();
  }), window.addEventListener("keydown", (xe) => {
    if (xe.key !== "Escape" || !se.length) return;
    const D = document.activeElement, oe = !!D && (D.id === "hk3-cmd-input" || D.id === "hk-dyn-input") && D.value === "";
    D && (D.tagName === "INPUT" || D.tagName === "TEXTAREA" || D.isContentEditable) && !oe || gt();
  }, { capture: true });
  function Ie() {
    for (const xe of J.children.slice()) {
      J.remove(xe);
      const D = xe.geometry;
      D && D !== v && D !== Z && D.dispose();
    }
  }
  const ve = (xe) => {
    var _a;
    const D = t.getActiveCamera(), oe = ((_a = t.rendererElm) == null ? void 0 : _a.clientHeight) || 700;
    return D.isOrthographicCamera ? (D.top - D.bottom) / (D.zoom || 1) / oe : 2 * D.position.distanceTo(xe) * Math.tan((D.fov || 50) * Math.PI / 180 / 2) / oe;
  };
  function qe(xe, D) {
    var _a, _b;
    const oe = (_b = (_a = t.mesh) == null ? void 0 : _a.elements) == null ? void 0 : _b.rawVal;
    if (xe.type === "node") {
      const ee = W(xe.idx);
      if (!ee) return;
      const ie = new lt(v, U);
      ie.position.copy(ee), ie.scale.setScalar(Math.max(1e-4, 7 * ve(ee))), ie.renderOrder = 101, J.add(ie);
    } else if (xe.type === "frame" && oe) {
      const ee = oe[xe.idx], ie = W(ee[0]), Ce = W(ee[1]);
      if (!ie || !Ce) return;
      const Se = ie.clone().add(Ce).multiplyScalar(0.5), ge = Ce.clone().sub(ie), Le = ge.length(), De = Math.max(1e-4, 4 * ve(Se)), ot = new lt(Z, de);
      ot.position.copy(Se);
      const Pe = new V(0, 1, 0);
      ot.quaternion.setFromAxisAngle(Pe.clone().cross(ge).normalize(), Pe.angleTo(ge)), ot.scale.set(De, Le, De), ot.renderOrder = 101, J.add(ot);
    } else if (xe.type === "shell" && oe) {
      const ee = oe[xe.idx], ie = [], Ce = [];
      for (const Le of ee) {
        const De = W(Le);
        if (!De) return;
        ie.push(De.x, De.y, De.z);
      }
      ee.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : ee.length === 3 && Ce.push(0, 1, 2);
      const Se = new Ee();
      Se.setAttribute("position", new $t(ie, 3)), Se.setIndex(Ce), Se.computeVertexNormals();
      const ge = new lt(Se, re);
      ge.renderOrder = 101, J.add(ge);
    } else if (xe.type === "solid" && oe) {
      const ee = oe[xe.idx], ie = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Le, De] of ie) {
        const ot = W(ee[Le]), Pe = W(ee[De]);
        ot && Pe && Ce.push(ot.x, ot.y, ot.z, Pe.x, Pe.y, Pe.z);
      }
      const Se = new Ee();
      Se.setAttribute("position", new $t(Ce, 3));
      const ge = new Ht(Se, ae);
      ge.renderOrder = 101, J.add(ge);
    }
  }
  function Je() {
    if (Ie(), !se.length || !t.mesh) {
      t.render();
      return;
    }
    const xe = t.derivedNodes.rawVal ?? [];
    if (xe.length >= 2) {
      const D = [1 / 0, 1 / 0, 1 / 0], oe = [-1 / 0, -1 / 0, -1 / 0];
      for (const ee of xe) for (let ie = 0; ie < 3; ie++) ee[ie] < D[ie] && (D[ie] = ee[ie]), ee[ie] > oe[ie] && (oe[ie] = ee[ie]);
      Math.max(oe[0] - D[0], oe[1] - D[1], oe[2] - D[2], 0.1);
    }
    for (const D of se) qe(D);
    t.render();
  }
  function xt(xe, D) {
    const oe = se.findIndex((ee) => ee.type === xe.type && ee.idx === xe.idx);
    oe >= 0 ? se.splice(oe, 1) : D || se.push(xe), se.length && se[se.length - 1];
  }
  function gt() {
    se.length = 0, Je();
  }
  return ce.derive(() => {
    t.derivedNodes.val, se.length && Je();
  }), y;
}
function Wi(t, y, v, b, S, z) {
  const A = S - v, E = z - b, C = A * A + E * E;
  if (C < 1e-9) {
    const we = t - v, j = y - b;
    return Math.sqrt(we * we + j * j);
  }
  let L = ((t - v) * A + (y - b) * E) / C;
  L = Math.max(0, Math.min(1, L));
  const N = v + L * A, B = b + L * E, ne = t - N, pe = y - B;
  return Math.sqrt(ne * ne + pe * pe);
}
function Hi(t, y, v) {
  let b = false;
  for (let S = 0, z = v.length - 1; S < v.length; z = S++) {
    const A = v[S].x, E = v[S].y, C = v[z].x, L = v[z].y;
    E > y != L > y && t < (C - A) * (y - E) / (L - E + 1e-12) + A && (b = !b);
  }
  return b;
}
const Ji = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Qi = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, kn = 1e-3;
function ao(t, y) {
  return y === "XZ" ? { u: t[0], v: t[2], fuera: t[1] } : y === "YZ" ? { u: t[1], v: t[2], fuera: t[0] } : { u: t[0], v: t[1], fuera: t[2] };
}
function Oi(t, y) {
  const v = Math.abs(y[0] - t[0]);
  return Math.abs(y[1] - t[1]) < kn ? { plano: "XZ", en: t[1] } : v < kn ? { plano: "YZ", en: t[0] } : { plano: "XY", en: t[2] };
}
function ji(t, y) {
  var _a, _b;
  let v = null, b = { plano: "XZ", en: 0 };
  const S = () => {
    var _a2, _b2;
    const Z = ((_a2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _a2.rawVal) ?? ((_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.val);
    return !Z || Z === "none" ? null : String(Z).replace(/^contour:/, "");
  }, z = (Z) => {
    var _a2, _b2;
    const re = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], ae = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], se = /* @__PURE__ */ new Set();
    for (const J of ae) {
      if (J.length !== 2) continue;
      const H = re[J[0]], W = re[J[1]];
      if (!H || !W) continue;
      const X = ao(H, Z), K = ao(W, Z);
      Math.abs(X.fuera - K.fuera) < kn && se.add(Math.round(X.fuera * 1e3) / 1e3);
    }
    return [...se].sort((J, H) => J - H);
  };
  function A(Z) {
    var _a2, _b2;
    if (Z == null ? void 0 : Z.plano) b = { plano: Z.plano, en: Z.en ?? z(Z.plano)[0] ?? 0 };
    else {
      const ae = [...window.__hekatanModelSelection ?? []].reverse().find((H) => H.type === "frame"), se = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], J = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [];
      ae && J[ae.idx] && se[J[ae.idx][0]] && se[J[ae.idx][1]] ? b = Oi(se[J[ae.idx][0]], se[J[ae.idx][1]]) : b = { plano: "XZ", en: z("XZ")[0] ?? 0 };
    }
    v || E(), v.hidden = false, C();
  }
  function E() {
    v = document.createElement("div"), v.id = "hk-diagrama-2d", v.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), v.innerHTML = `
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
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(v), v.querySelector(".hk-d2-x").addEventListener("click", () => {
      v.hidden = true;
    });
    const Z = v.querySelector(".hk-d2-plano"), re = v.querySelector(".hk-d2-en");
    Z.addEventListener("change", () => {
      b = { plano: Z.value, en: z(Z.value)[0] ?? 0 }, C();
    }), re.addEventListener("change", () => {
      b.en = Number(re.value), C();
    });
    const ae = (H) => {
      const W = z(b.plano), X = W.findIndex((q) => Math.abs(q - b.en) < kn), K = Math.max(0, Math.min(W.length - 1, (X < 0 ? 0 : X) + H));
      W.length && (b.en = W[K], C());
    };
    v.querySelector(".hk-d2-ant").addEventListener("click", () => ae(-1)), v.querySelector(".hk-d2-sig").addEventListener("click", () => ae(1));
    const se = v.querySelector(".hk-d2-bar");
    let J = null;
    se.addEventListener("pointerdown", (H) => {
      if (H.target.closest("select,button")) return;
      const W = v.getBoundingClientRect();
      J = { x: H.clientX, y: H.clientY, l: W.left, t: W.top }, v.style.transform = "none", v.style.left = W.left + "px", v.style.top = W.top + "px";
    }), window.addEventListener("pointermove", (H) => {
      !J || !v || (v.style.left = J.l + H.clientX - J.x + "px", v.style.top = J.t + H.clientY - J.y + "px");
    }), window.addEventListener("pointerup", () => {
      J = null;
    }), new ResizeObserver(() => {
      v && !v.hidden && C();
    }).observe(v);
  }
  function C() {
    var _a2, _b2, _c, _d, _e2, _f, _g, _h;
    if (!v || v.hidden) return;
    const Z = new Set(B && !B.hidden && ne >= 0 ? we(ne) : []), re = v.querySelector(".hk-d2-svg"), ae = v.querySelector(".hk-d2-tit"), se = v.querySelector(".hk-d2-pie"), J = v.querySelector(".hk-d2-plano"), H = v.querySelector(".hk-d2-en");
    J.value = b.plano;
    const W = z(b.plano), X = b.plano === "XZ" ? "y" : b.plano === "YZ" ? "x" : "z", K = b.plano === "XY" ? "Planta" : "P\xF3rtico";
    H.innerHTML = W.map((Me, Te) => `<option value="${Me}" ${Math.abs(Me - b.en) < kn ? "selected" : ""}>${K} ${Te + 1} \xB7 ${X} = ${Me.toFixed(2)} m</option>`).join("");
    const q = S(), R = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], O = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], fe = q ? (_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[q] : null;
    re.innerHTML = "";
    const ye = re.clientWidth || 880, be = re.clientHeight || 480, G = [];
    if (O.forEach((Me, Te) => {
      if (Me.length !== 2) return;
      const Pt = R[Me[0]], nt = R[Me[1]];
      if (!Pt || !nt) return;
      const Mt = ao(Pt, b.plano), Bt = ao(nt, b.plano);
      Math.abs(Mt.fuera - b.en) < kn && Math.abs(Bt.fuera - b.en) < kn && G.push({ i: Te, a: Mt, b: Bt });
    }), !G.length) {
      se.textContent = "No hay barras en este plano.", ae.textContent = "";
      return;
    }
    let _e = 1 / 0, ue = -1 / 0, Ve = 1 / 0, he = -1 / 0;
    for (const Me of G) for (const Te of [Me.a, Me.b]) _e = Math.min(_e, Te.u), ue = Math.max(ue, Te.u), Ve = Math.min(Ve, Te.v), he = Math.max(he, Te.v);
    const Ie = ue - _e || 1, ve = he - Ve || 1, qe = 0.12 * Math.max(Ie, ve), Je = 46, xt = Math.min((ye - 2 * Je) / (Ie + 2 * qe), (be - 2 * Je) / (ve + 2 * qe)), gt = (ye - Ie * xt) / 2, xe = (be - ve * xt) / 2, D = (Me) => gt + (Me - _e) * xt, oe = (Me) => be - (xe + (Me - Ve) * xt), ee = "http://www.w3.org/2000/svg", ie = (Me, Te, Pt) => {
      const nt = document.createElementNS(ee, Me);
      for (const Mt in Te) nt.setAttribute(Mt, String(Te[Mt]));
      return Pt != null && (nt.textContent = Pt), re.appendChild(nt), nt;
    }, Ce = /* @__PURE__ */ new Map();
    for (const Me of G) {
      const Te = ((_h = (_g = (_f = (_e2 = t.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Me.i)) ?? 0, Pt = ao(va(q ?? "normals", ga(R[O[Me.i][0]], R[O[Me.i][1]], Te)), b.plano), nt = Math.hypot(Pt.u, Pt.v);
      Ce.set(Me.i, nt > 0.3 ? [Pt.u / nt, -Pt.v / nt] : null);
    }
    const Se = G.filter((Me) => !Ce.get(Me.i)).length;
    let ge = 0;
    if (fe) for (const Me of G) {
      if (!Ce.get(Me.i)) continue;
      const Te = fe instanceof Map ? fe.get(Me.i) : fe[Me.i];
      Te && (ge = Math.max(ge, Math.abs(Te[0] ?? 0), Math.abs(Te[1] ?? 0)));
    }
    const Le = 0.12 * Math.max(Ie, ve) * xt, De = ge > 0 ? Le / ge : 0, ot = q === "bendingsY" || q === "bendingsZ", Pe = (Me) => Math.abs(Me) >= 100 ? Me.toFixed(1) : Math.abs(Me) >= 10 ? Me.toFixed(2) : Me.toFixed(3), tt = [];
    for (const Me of G) {
      const Te = D(Me.a.u), Pt = oe(Me.a.v), nt = D(Me.b.u), Mt = oe(Me.b.v), Bt = Ce.get(Me.i), [st, He] = Bt ?? [0, 0], ze = fe && Bt ? fe instanceof Map ? fe.get(Me.i) : fe[Me.i] : null, [Oe, Fe] = ze ? ms(q, ze) : [0, 0];
      if (ze && De > 0) {
        const Ke = [Te + st * Oe * De * 1, Pt + He * Oe * De * 1], je = [nt + st * Fe * De * 1, Mt + He * Fe * De * 1], mt = Oe + Fe >= 0 ? "#3fa7d6" : "#d9534f";
        ie("polygon", { points: `${Te},${Pt} ${Ke[0]},${Ke[1]} ${je[0]},${je[1]} ${nt},${Mt}`, fill: mt, "fill-opacity": 0.38, stroke: mt, "stroke-width": 1.2 }), tt.push({ x: Ke[0] + st * 12, y: Ke[1] + He * 12, t: Pe(Oe), peso: Math.abs(Oe) }), tt.push({ x: je[0] + st * 12, y: je[1] + He * 12, t: Pe(Fe), peso: Math.abs(Fe) });
      }
      ie("line", { x1: Te, y1: Pt, x2: nt, y2: Mt, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), Z.has(Me.i) && ie("line", { x1: Te, y1: Pt, x2: nt, y2: Mt, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const it = ie("line", { x1: Te, y1: Pt, x2: nt, y2: Mt, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      it.addEventListener("click", () => j(Me.i));
      const at = document.createElementNS(ee, "title");
      at.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", it.appendChild(at);
    }
    for (const Me of G) for (const Te of [Me.a, Me.b]) b.plano !== "XY" && Math.abs(Te.v - Ve) < kn && ie("rect", { x: D(Te.u) - 6, y: oe(Te.v), width: 12, height: 7, fill: "#b03a3a" });
    const Ze = [];
    tt.sort((Me, Te) => Te.peso - Me.peso);
    for (const Me of tt) Me.peso < 0.02 * ge || Ze.some((Te) => Math.hypot(Te.x - Me.x, Te.y - Me.y) < 34) || (Ze.push(Me), ie("text", { x: Me.x, y: Me.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Me.t));
    const We = q ? Ji[q] ?? q : "sin resultado";
    ae.textContent = `${We} \xB7 ${b.plano === "XY" ? "planta" : "alzado"} ${b.plano} en ${X} = ${b.en.toFixed(2)} m`, se.textContent = q ? `${G.length} barras en el plano \xB7 m\xE1ximo ${Pe(ge)} ${Qi[q] ?? ""}` + (ot ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (Se ? ` \xB7 ${Se} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
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
    const Z = (_a2 = t.analyzeOutputs) == null ? void 0 : _a2.rawVal, re = (_b2 = y == null ? void 0 : y.frameResults) == null ? void 0 : _b2.rawVal, ae = [Z, re];
    if (!(N && N[0] === Z && N[1] === re)) {
      N = ae, L();
      try {
        de();
      } catch {
      }
    }
  }, 400);
  let B = null, ne = -1, pe = "12";
  function we(Z) {
    var _a2, _b2;
    const re = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], ae = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], se = /* @__PURE__ */ new Map();
    ae.forEach((X, K) => {
      if (X.length === 2) for (const q of X) se.has(q) || se.set(q, []), se.get(q).push(K);
    });
    const J = (X) => {
      const K = re[ae[X][0]], q = re[ae[X][1]], R = [q[0] - K[0], q[1] - K[1], q[2] - K[2]], O = Math.hypot(R[0], R[1], R[2]) || 1;
      return R.map((fe) => fe / O);
    }, H = (X, K) => {
      const q = J(X), R = J(K);
      return Math.abs(q[0] * R[0] + q[1] * R[1] + q[2] * R[2]) > 0.9999;
    }, W = [Z];
    for (const X of [0, 1]) {
      let K = Z, q = ae[Z][X];
      for (let R = 0; R < 500; R++) {
        const O = (se.get(q) ?? []).filter((ye) => ye !== K);
        if (O.length !== 1 || !H(K, O[0])) break;
        const fe = O[0];
        X === 0 ? W.unshift(fe) : W.push(fe), q = ae[fe][0] === q ? ae[fe][1] : ae[fe][0], K = fe;
      }
    }
    return W;
  }
  function j(Z) {
    if (Z == null) {
      const ae = [...window.__hekatanModelSelection ?? []].reverse().find((se) => se.type === "frame");
      if (!ae) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      Z = ae.idx;
    }
    ne = Z, B || (B = document.createElement("div"), B.id = "hk-diagrama-barra", B.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), B.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(B), B.querySelector(".hk-b-x").addEventListener("click", () => {
      B.hidden = true, U(), C();
    }), B.querySelector(".hk-b-pl").addEventListener("change", (re) => {
      pe = re.target.value, de();
    })), B.hidden = false, U(), de(), C();
  }
  function U() {
    if (!v || !B) return;
    const Z = window.innerWidth, re = Math.min(560, Math.round(Z * 0.4));
    B.style.width = re + "px", !B.hidden && !v.hidden ? (v.style.transform = "none", v.style.left = "12px", v.style.width = Z - re - 36 + "px", B.style.top = v.getBoundingClientRect().top + "px") : v.hidden || (v.style.left = "50%", v.style.transform = "translateX(-50%)", v.style.width = "min(900px,92vw)");
  }
  function de() {
    var _a2, _b2, _c;
    if (!B || B.hidden || ne < 0) return;
    const Z = ((_a2 = t.nodes) == null ? void 0 : _a2.rawVal) ?? [], re = ((_b2 = t.elements) == null ? void 0 : _b2.rawVal) ?? [], ae = ((_c = t.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!re[ne]) return;
    const se = we(ne), J = [];
    let H = 0, W = -1;
    se.forEach((ue, Ve) => {
      const [he, Ie] = re[ue], ve = Ve === 0 ? se.length > 1 && re[se[1]].includes(he) : he !== W, qe = ve ? Ie : he, Je = ve ? he : Ie, xt = Math.hypot(Z[Je][0] - Z[qe][0], Z[Je][1] - Z[qe][1], Z[Je][2] - Z[qe][2]);
      J.push({ x: H, e: ue, fin: ve ? 1 : 0 }), H += xt, J.push({ x: H, e: ue, fin: ve ? 0 : 1 }), W = Je;
    });
    const X = H, K = (ue, Ve) => {
      const he = ae[ue], Ie = he ? he instanceof Map ? he.get(Ve.e) : he[Ve.e] : null;
      return Ie ? ms(ue, Ie)[Ve.fin] : 0;
    }, q = Z[re[se[0]][0]], R = (ue) => ue.toFixed(2);
    B.querySelector(".hk-b-tit").textContent = "L = " + X.toFixed(2) + " m \xB7 " + se.length + " tramo(s) \xB7 desde (" + R(q[0]) + ", " + R(q[1]) + ", " + R(q[2]) + ")";
    const O = pe === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], fe = B.querySelector(".hk-b-cuerpo");
    fe.innerHTML = "";
    const ye = Math.max(300, fe.clientWidth), be = 124, G = 46, _e = (be - 14) / 2;
    for (const [ue, Ve, he, Ie] of O) {
      const ve = J.map((ge) => K(ue, ge)), qe = Math.max(...ve), Je = Math.min(...ve), xt = Math.max(Math.abs(qe), Math.abs(Je)) || 1, gt = (ge) => G + ge / (X || 1) * (ye - 2 * G), xe = (ge) => _e + (Ie ? 1 : -1) * (ge / xt) * (_e - 16), D = (ge) => Math.abs(ge) >= 100 ? ge.toFixed(1) : Math.abs(ge) >= 10 ? ge.toFixed(2) : ge.toFixed(3);
      let oe = gt(0) + "," + _e + " ";
      J.forEach((ge, Le) => {
        oe += gt(ge.x) + "," + xe(ve[Le]) + " ";
      }), oe += gt(X) + "," + _e;
      const ee = ve.indexOf(qe), ie = ve.indexOf(Je), Ce = (ge, Le) => {
        const De = xe(ve[ge]) + (xe(ve[ge]) < _e ? -5 : 13);
        return '<text x="' + gt(J[ge].x) + '" y="' + De + '" text-anchor="middle" fill="' + Le + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + D(ve[ge]) + "</text>";
      }, Se = Ie ? "#d9534f" : "#3fa7d6";
      fe.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + Ve + ' <span style="color:#6f7d90;font-weight:400">(' + he + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + D(qe) + " \xB7 m\xEDn " + D(Je) + (Ie ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + ye + '" height="' + be + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + G + '" y1="' + _e + '" x2="' + (ye - G) + '" y2="' + _e + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + oe + '" fill="' + Se + '" fill-opacity=".35" stroke="' + Se + '" stroke-width="1.4"/>' + Ce(0, "#f2f5fa") + Ce(J.length - 1, "#f2f5fa") + (ee > 0 && ee < J.length - 1 ? Ce(ee, "#8fd3ff") : "") + (ie > 0 && ie < J.length - 1 && ie !== ee ? Ce(ie, "#ff9f9a") : "") + '<text x="' + G + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (ye - G) + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + X.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = j, window.__hekatanDiagrama2D = A, { abrir: A, abrirBarra: j };
}
function ra(t, y = 8) {
  const v = document.createElement("div");
  v.id = "legend", v.style.setProperty("--legend-n", String(y)), setTimeout(() => {
    ce.derive(() => {
      Bo.val, v.style.background = di();
    });
  });
  const b = document.createElement("div");
  b.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", v.appendChild(b), setTimeout(() => {
    ce.derive(() => {
      b.textContent = ws.val ? `[${ws.val}]` : "";
    });
  });
  const S = Array.from({ length: y + 1 }, (C, L) => L / y).reverse();
  let z, A;
  S.forEach((C, L) => {
    z = document.createElement("div"), z.id = `marker-${L}`, z.className = "marker", z.style.marginTop = L == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", A = document.createElement("p"), A.id = `marker-text-${L}`, z.append(A), v.append(z);
  });
  const E = [];
  return v.querySelectorAll("p").forEach((C) => E.push(C)), setTimeout(() => {
    ce.derive(() => {
      S.forEach((C, L) => {
        const N = E[L];
        N && (N.innerText = el(t.val, C).toString());
      });
    });
  }), v;
}
function el(t, y) {
  const v = ro.val;
  if (v) return ca(v[0] + y * (v[1] - v[0]));
  const b = t.filter((A) => Number.isFinite(A));
  if (b.length === 0) return "0";
  const [S, z] = ys(b);
  return ca(S + y * (z - S));
}
function ca(t) {
  if (!Number.isFinite(t)) return "\u2014";
  if (t === 0) return "0";
  const y = Math.abs(t);
  return y < 1e-3 || y >= 1e5 ? t.toExponential(2) : t.toPrecision(3);
}
function pl({ mesh: t, settingsObj: y, drawingObj: v, objects3D: b, solids: S }) {
  li.DEFAULT_UP = new V(0, 0, 1);
  const z = document.createElement("div"), A = new oi(), E = new si(45, 1, 0.1, 2 * 1e6), C = new ai(-10, 10, 10, -10, -1e3, 2e6);
  let L = E;
  const N = new ii({ antialias: true });
  N.localClippingEnabled = true;
  const B = new sa(E, N.domElement);
  B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.keyPanSpeed = 12, B.listenToKeyEvents(window), B.touches = { ONE: Eo.ROTATE, TWO: Eo.DOLLY_PAN }, N.domElement.addEventListener("wheel", (D) => {
    if (!D.ctrlKey && Math.abs(D.deltaX) > Math.abs(D.deltaY) * 1.5) {
      D.preventDefault();
      const oe = B.target, ee = new V().subVectors(E.position, oe), ie = new V();
      ie.crossVectors(E.up, ee).normalize();
      const Se = ee.length() * 1e-3 * B.panSpeed;
      oe.addScaledVector(ie, D.deltaX * Se), E.position.addScaledVector(ie, D.deltaX * Se), B.update();
    }
  }, { passive: false });
  const ne = new cs(new V(-1, 0, 0), 0), pe = new cs(new V(0, -1, 0), 0), we = new cs(new V(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function j() {
    const D = window.__hekatanClip, oe = [];
    D.enableX && (ne.normal.set(D.invertX ? 1 : -1, 0, 0), ne.constant = D.invertX ? -D.posX : D.posX, oe.push(ne)), D.enableY && (pe.normal.set(0, D.invertY ? 1 : -1, 0), pe.constant = D.invertY ? -D.posY : D.posY, oe.push(pe)), D.enableZ && (we.normal.set(0, 0, D.invertZ ? 1 : -1), we.constant = D.invertZ ? -D.posZ : D.posZ, oe.push(we)), N.clippingPlanes = oe, A.traverse((ie) => {
      const Ce = ie;
      if (Ce.material) {
        const Se = Array.isArray(Ce.material) ? Ce.material : [Ce.material];
        for (const ge of Se) ge.clippingPlanes = oe, ge.needsUpdate = true;
      }
    });
    const ee = window.__hekatanPanes ?? [];
    for (const ie of ee) try {
      ie && typeof ie.refresh == "function" && ie.refresh();
    } catch {
    }
    N.render(A, L);
  }
  j(), window.__hekatanClipApply = j;
  const U = fi(y), de = ce.derive(() => Math.pow(10, U.displayScale.val / 10)), Z = tl(t, U), re = () => {
    const D = [];
    return U.gridXY.rawVal && D.push("xy"), U.gridXZ.rawVal && D.push("xz"), U.gridYZ.rawVal && D.push("yz"), D;
  }, ae = () => {
    const D = U.gridStep.rawVal, oe = Math.max(D, U.gridMajor.rawVal);
    return { planes: re(), majorStep: oe, minorStep: D };
  };
  let se = us(U.gridSize.rawVal, ae());
  se.visible = U.gridVisible.rawVal, window.__hekatanSnap2D = U.cursorSnap.rawVal;
  const J = () => {
    const D = Math.max(0, Math.min(1, U.gridOpacity.rawVal));
    se.traverse((oe) => {
      const ee = oe.material;
      if (!ee || !("opacity" in ee)) return;
      const ie = oe.name ?? "";
      let Ce = 0.55;
      ie.includes("border") ? Ce = 1 : ie.includes("major") && (Ce = 0.95), ee.opacity = D * Ce;
    });
  };
  J(), z.appendChild(pi(U, t, S)), z.setAttribute("id", "viewer"), z.appendChild(N.domElement), N.setPixelRatio(window.devicePixelRatio);
  const H = Tn();
  N.setClearColor(H.background, 1);
  const W = U.gridSize.rawVal, X = W * 0.5 + W * 0.5 / Math.tan(45 * 0.5);
  E.position.set(0, 0, X), E.up.set(0, 1, 0), B.target.set(0, 0, 0), B.minDistance = 0.1, B.maxDistance = 1e4, z.__settings = U, B.zoomSpeed = 1, B._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, B.update();
  let K = ia(U.gridSize.rawVal, U.flipAxes.rawVal);
  A.add(se, K), ce.derive(() => {
    window.__hekatanGridPlaneXY = U.gridXY.val, window.__hekatanGridPlaneXZ = U.gridXZ.val, window.__hekatanGridPlaneYZ = U.gridYZ.val;
  });
  let q = true;
  ce.derive(() => {
    const D = U.gridVisible.val;
    if (q) {
      q = false;
      return;
    }
    se.visible = D, ue();
  });
  let R = true;
  ce.derive(() => {
    if (U.gridOpacity.val, R) {
      R = false;
      return;
    }
    J(), ue();
  }), ce.derive(() => {
    const D = U.cursorSnap.val;
    window.__hekatanSnap2D = D;
  });
  let O = true;
  ce.derive(() => {
    var _a, _b, _c;
    const D = U.gridSize.val, oe = U.flipAxes.val;
    if (U.gridXY.val, U.gridXZ.val, U.gridYZ.val, U.gridStep.val, U.gridMajor.val, O) {
      O = false;
      return;
    }
    A.remove(se), (_a = se.traverse) == null ? void 0 : _a.call(se, (Se) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), se = us(D, ae()), se.visible = U.gridVisible.rawVal, A.add(se), J(), A.remove(K), K.traverse((Se) => {
      var _a2, _b2, _c2, _d;
      (_b2 = (_a2 = Se.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b2.call(_a2), (_d = (_c2 = Se.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), K = ia(D, oe), A.add(K);
    const ee = D * 0.5 + D * 0.5 / Math.tan(45 * 0.5);
    E.position.distanceTo(B.target);
    const ie = Math.abs(E.position.x) < 0.1 && Math.abs(E.position.y) < 0.1 && E.position.z > 0;
    (((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = t == null ? void 0 : t.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ie ? E.position.set(0, 0, ee) : E.position.set(0.5 * D, -ee, 0.5 * D), B.target.set(0, 0, 0)), B.minDistance = Math.max(0.05, D * 0.01), B.maxDistance = Math.max(50, D * 50), B.update(), ue();
  }), new ResizeObserver((D) => {
    var _a, _b;
    for (const oe of D) {
      const ee = (_a = oe.target) == null ? void 0 : _a.clientWidth, ie = (_b = oe.target) == null ? void 0 : _b.clientHeight;
      if (ee === 0 || ie === 0) continue;
      const Se = (ye ? ee / 2 : ee) / ie;
      E.aspect = Se, E.updateProjectionMatrix();
      const ge = C.top;
      if (C.left = -ge * Se, C.right = ge * Se, C.updateProjectionMatrix(), be && be.isPerspectiveCamera) be.aspect = Se, be.updateProjectionMatrix();
      else if (be && be.isOrthographicCamera) {
        const Le = be, De = Le.top;
        Le.left = -De * Se, Le.right = De * Se, Le.updateProjectionMatrix();
      }
      N.setSize(ee, ie), ue();
    }
  }).observe(z), B.addEventListener("change", ue), ce.derive(() => {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2;
    (_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val, (_b = t == null ? void 0 : t.elements) == null ? void 0 : _b.val, (_c = t == null ? void 0 : t.nodeInputs) == null ? void 0 : _c.val, (_d = t == null ? void 0 : t.elementInputs) == null ? void 0 : _d.val, (_e2 = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _e2.val, (_f = t == null ? void 0 : t.analyzeOutputs) == null ? void 0 : _f.val, U.displayScale.val, U.nodes.val, U.elements.val, (_g = U.edges) == null ? void 0 : _g.val, U.elemColumns.val, U.elemBeams.val, U.nodesIndexes.val, U.elementsIndexes.val, U.orientations.val, U.sections.val, U.secColumns.val, U.secBeams.val, U.secFloor.val, U.supports.val, U.loads.val, U.deformedShape.val, U.nodeResults.val, U.frameResults.val, U.shellResults.val, (_h = U.solidResults) == null ? void 0 : _h.val, (_i2 = U.extruded) == null ? void 0 : _i2.val, setTimeout(ue);
  });
  let ye = false, be = null, G = null, _e = false;
  function ue() {
    const D = z.clientWidth || 1, oe = z.clientHeight || 1;
    if (!ye || !be) {
      N.setScissorTest(false), N.setViewport(0, 0, D, oe), N.render(A, L);
      return;
    }
    const ee = D / 2;
    N.setScissorTest(true), N.setViewport(0, 0, ee, oe), N.setScissor(0, 0, ee, oe), N.render(A, L), N.setViewport(ee, 0, ee, oe), N.setScissor(ee, 0, ee, oe), N.render(A, be), N.setScissorTest(false);
  }
  function Ve(D) {
    L = D, B.object = D, B.update(), ue();
  }
  function he(D, oe) {
    ye = D, oe && (be = oe);
    const ee = z.clientWidth || 1, ie = z.clientHeight || 1, Se = (D ? ee / 2 : ee) / ie;
    E.isPerspectiveCamera && (E.aspect = Se, E.updateProjectionMatrix());
    const ge = C.top;
    if (C.left = -ge * Se, C.right = ge * Se, C.updateProjectionMatrix(), D && be) {
      if (G ? (G.object = be, G.update()) : (G = new sa(be, N.domElement), G.enableDamping = true, G.dampingFactor = 0.1, G.screenSpacePanning = true, G.zoomSpeed = 0.8, G.panSpeed = 1.2, G.rotateSpeed = 0.9, G.touches = { ONE: Eo.ROTATE, TWO: Eo.DOLLY_PAN }, G.target.copy(B.target), G.addEventListener("change", ue), G.enabled = false), !_e) {
        const Le = (De) => {
          if (!ye || !G) return;
          const ot = N.domElement.getBoundingClientRect(), Pe = De.clientX - ot.left, tt = ot.width / 2, Ze = Pe >= tt;
          B.enabled = !Ze, G.enabled = Ze;
        };
        N.domElement.addEventListener("pointerdown", Le, true), N.domElement.addEventListener("wheel", Le, { capture: true, passive: true }), _e = true;
      }
    } else D || (B.enabled = true, G && (G.enabled = false));
    z.__splitMode = D, window.__hekatanSplitMode = D, window.__hekatanSplitCamera = D ? be : null, ue();
  }
  if (t) {
    A.add(hi(U, Z, de), ri(t, U, Z), yi(U, Z, de), xi(t, U, Z, de), mi(t, U, Z, de), wi(t, U, Z, de), Mi(t, U, Z, de), _i(t, U, Z, de), Ci(t, U, Z), Ei(t, U, Z, de), zi(t, U, Z, de)), window.__hekatanDiagrama2D || (ji(t, U), N.domElement.addEventListener("dblclick", () => {
      var _a;
      const Le = (_a = U.frameResults) == null ? void 0 : _a.rawVal;
      !Le || Le === "none" || !(window.__hekatanModelSelection ?? []).some((ot) => ot.type === "frame") || setTimeout(() => {
        var _a2;
        return (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }, 60);
    }));
    const D = Gi({ scene: A, rendererElm: N.domElement, getActiveCamera: () => L, derivedNodes: Z, derivedDisplayScale: de, mesh: t, settings: U, render: ue });
    A.add(D);
    const oe = ll(t, U), ee = Ii(t, U, Z, oe), ie = ra(oe);
    A.add(ee), z.appendChild(ie);
    const Ce = Bi(t, U, Z);
    A.add(Ce);
    const Se = Ce.__colorMapValues, ge = ra(Se);
    ge.id = "frame-legend", z.appendChild(ge), ce.derive(() => {
      var _a;
      const Le = U.shellResults.val != "none", De = (((_a = U.solidResults) == null ? void 0 : _a.val) ?? "none") !== "none", ot = Le || De, Pe = U.frameResults.val.startsWith("contour:"), tt = oe.val.some((Ze) => Number.isFinite(Ze));
      ie.hidden = !ot || !tt, ee.visible = ot, ge.hidden = !Pe;
    });
  }
  if (S) {
    const D = new fa(16777215, 0.5);
    A.add(D);
    const oe = new Ro(16777215, 0.5);
    oe.position.set(30, 25, -10), oe.shadow.mapSize.width = 1024, oe.shadow.mapSize.height = 1024, A.add(oe);
    const ee = 10;
    oe.shadow.camera.left = -ee, oe.shadow.camera.right = ee, oe.shadow.camera.top = ee, oe.shadow.camera.bottom = -ee, oe.shadow.camera.far = 1e3;
    const ie = new Ro(16777215, 0.5);
    ie.color.setHSL(11, 43, 96), ie.position.set(-10, 0, 30), A.add(ie), ce.derive(() => {
      (S == null ? void 0 : S.val.length) && (A.remove(...S.oldVal), A.add(...S.rawVal), ue());
    }), ce.derive(() => {
      S.rawVal.forEach((Ce) => Ce.visible = U.solids.val), ue();
    });
  }
  if (b) {
    const D = [], oe = (ie) => {
      var _a;
      return ((_a = ie == null ? void 0 : ie.userData) == null ? void 0 : _a.isCota) ? U.showCotas.val : U.custom3D.val;
    }, ee = () => {
      for (const ie of D) ie.visible = oe(ie);
      ue();
    };
    ce.derive(() => {
      const ie = b.val;
      D.length && (A.remove(...D), D.length = 0), ie.length && (A.add(...ie), D.push(...ie), ee(), N.clippingPlanes.length && j()), ue();
    }), ce.derive(() => {
      U.custom3D.val, ee();
    }), ce.derive(() => {
      U.showCotas.val, ee();
    });
  }
  v && Vi({ drawingObj: v, gridObj: se, scene: A, getActiveCamera: () => L, controls: B, gridSize: W, derivedDisplayScale: de, rendererElm: N.domElement, viewerRender: ue }), ua((D, oe) => {
    var _a;
    N.setClearColor(oe.background, 1), A.remove(se), (_a = se.traverse) == null ? void 0 : _a.call(se, (ee) => {
      var _a2, _b, _c, _d;
      (_b = (_a2 = ee.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = ee.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), se = us(U.gridSize.rawVal, { planes: re() }), A.add(se), z.style.setProperty("--awatif-legend-color", oe.legendMarker), ue();
  });
  const Ie = { scene: A, perspCamera: E, orthoCamera: C, get camera() {
    return L;
  }, controls: B, renderer: N, rendererElm: N.domElement, render: ue, setActiveCamera: Ve, setSplitMode: he, get splitMode() {
    return ye;
  }, get splitCamera() {
    return be;
  }, settings: U };
  z.__ctx = Ie;
  const ve = document.createElement("div");
  ve.id = "hk-nav-camara", ve.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const qe = (D, oe, ee) => {
    const ie = document.createElement("button");
    return ie.textContent = D, ie.title = oe, ie.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ie.onmouseenter = () => {
      ie.style.background = "rgba(70,70,70,0.9)";
    }, ie.onmouseleave = () => {
      ie.style.background = "rgba(40,40,40,0.85)";
    }, ie.onclick = (Ce) => {
      Ce.preventDefault(), ee();
    }, ie;
  }, Je = (D, oe) => {
    const ee = B.target, ie = new V().subVectors(L.position, ee), Ce = ie.length(), Se = new V(), ge = new V();
    Se.crossVectors(L.up, ie).normalize(), ge.copy(L.up).normalize();
    const Le = Ce * 0.05;
    ee.addScaledVector(Se, -D * Le), ee.addScaledVector(ge, oe * Le), L.position.addScaledVector(Se, -D * Le), L.position.addScaledVector(ge, oe * Le), B.update(), ue();
  }, xt = (D) => {
    const oe = new V().subVectors(L.position, B.target);
    oe.multiplyScalar(D), L.position.copy(B.target).add(oe), B.update(), ue();
  }, gt = () => {
    const D = document.createElement("div");
    return D.style.cssText = "width:32px;height:32px;", D;
  };
  return ve.append(gt()), ve.append(qe("\u2191", "Pan arriba", () => Je(0, 1))), ve.append(qe("\u2295", "Zoom in", () => xt(0.85))), ve.append(qe("\u2190", "Pan izquierda", () => Je(-1, 0))), ve.append(qe("\u2302", "Reset vista", () => {
    B.reset(), ue();
  })), ve.append(qe("\u2192", "Pan derecha", () => Je(1, 0))), ve.append(qe("\u2296", "Zoom out", () => xt(1.18))), ve.append(qe("\u2193", "Pan abajo", () => Je(0, -1))), ve.append(gt()), getComputedStyle(z).position === "static" && (z.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && z.appendChild(ve), z;
}
function tl(t, y) {
  return ce.derive(() => {
    var _a, _b, _c, _d;
    if (!y.deformedShape.val) return ((_a = t == null ? void 0 : t.nodes) == null ? void 0 : _a.val) ?? [];
    const v = ((_b = t == null ? void 0 : t.nodes) == null ? void 0 : _b.val) ?? [], b = (_d = (_c = t == null ? void 0 : t.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!b || v.length === 0) return v;
    const S = y.deformScale.val, z = y.deformScale.val * y.deformScaleZ.val, A = Number.isFinite(S) ? S : 1, E = Number.isFinite(z) ? z : 1;
    return v.map((C, L) => {
      var _a2;
      const N = ((_a2 = b.get(L)) == null ? void 0 : _a2.slice(0, 3)) ?? [0, 0, 0], B = Number.isFinite(N[0]) ? N[0] : 0, ne = Number.isFinite(N[1]) ? N[1] : 0, pe = Number.isFinite(N[2]) ? N[2] : 0;
      return [C[0] + B * A, C[1] + ne * A, C[2] + pe * E];
    });
  });
}
const ro = ce.state(null), ws = ce.state(""), nl = ce.state("kN"), ol = ce.state("mm"), sl = ce.state("kN/m\xB2"), al = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, da = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, il = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ll(t, y) {
  const v = ce.state([]);
  let b;
  return ((S) => {
    S.bendingXX = "bendingXX", S.bendingYY = "bendingYY", S.bendingXY = "bendingXY", S.membraneXX = "membraneXX", S.membraneYY = "membraneYY", S.membraneXY = "membraneXY", S.tranverseShearX = "tranverseShearX", S.tranverseShearY = "tranverseShearY", S.membranePrincipalMax = "membranePrincipalMax", S.membranePrincipalMin = "membranePrincipalMin", S.bendingPrincipalMax = "bendingPrincipalMax", S.bendingPrincipalMin = "bendingPrincipalMin", S.transverseShearMax = "transverseShearMax", S.vonMises = "vonMises", S.pressure = "pressure", S.displacementX = "displacementX", S.displacementY = "displacementY", S.displacementZ = "displacementZ";
  })(b || (b = {})), ce.derive(() => {
    var _a, _b, _c, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const S = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), we = (D, oe) => {
      D == null ? void 0 : D.forEach((ee, ie) => {
        const Ce = t.elements.val[ie];
        if (Ce) for (let Se = 0; Se < Ce.length; Se++) oe.set(Ce[Se], [ee[Se] ?? ee[0]]);
      });
    };
    we((_b = (_a = t.analyzeOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.bendingXX, S), we((_d = (_c = t.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, z), we((_f = (_e2 = t.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, A), we((_h = (_g = t.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, E), we((_j = (_i2 = t.analyzeOutputs) == null ? void 0 : _i2.val) == null ? void 0 : _j.membraneYY, C), we((_l = (_k = t.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, L), we((_n2 = (_m = t.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n2.tranverseShearX, N), we((_p = (_o = t.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, B), we((_r = (_q = t.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, ne), we((_t = (_s = t.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t.pressure, pe);
    const j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), ae = (D, oe, ee, ie, Ce) => {
      D.forEach((Se, ge) => {
        var _a2, _b2;
        const Le = Se[0] ?? 0, De = ((_a2 = oe.get(ge)) == null ? void 0 : _a2[0]) ?? 0, ot = ((_b2 = ee.get(ge)) == null ? void 0 : _b2[0]) ?? 0, Pe = (Le + De) / 2, tt = Math.hypot((Le - De) / 2, ot);
        ie.set(ge, [Pe + tt]), Ce.set(ge, [Pe - tt]);
      });
    };
    ae(E, C, L, j, U), ae(S, z, A, de, Z), N.forEach((D, oe) => {
      var _a2;
      re.set(oe, [Math.hypot(D[0] ?? 0, ((_a2 = B.get(oe)) == null ? void 0 : _a2[0]) ?? 0)]);
    });
    const se = (_v = (_u = t.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, J = (_w = y.solidResults) == null ? void 0 : _w.val, W = J && J !== "none" ? J : y.shellResults.val, X = se == null ? void 0 : se[W], K = { bendingXX: [S, 0], bendingYY: [z, 0], bendingXY: [A, 0], membraneXX: [E, 0], membraneYY: [C, 0], membraneXY: [L, 0], tranverseShearX: [N, 0], tranverseShearY: [B, 0], membranePrincipalMax: [j, 0], membranePrincipalMin: [U, 0], bendingPrincipalMax: [de, 0], bendingPrincipalMin: [Z, 0], transverseShearMax: [re, 0], vonMises: [ne, 0], pressure: [pe, 0], displacementX: [(_y = (_x = t.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = t.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = t.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, q = y.shellResults.val, R = nl.val, O = ol.val, fe = q === "displacementX" || q === "displacementY" || q === "displacementZ", ye = q === "bendingXX" || q === "bendingYY" || q === "bendingXY" || q === "bendingPrincipalMax" || q === "bendingPrincipalMin", be = q === "membraneXX" || q === "membraneYY" || q === "membraneXY" || q === "membranePrincipalMax" || q === "membranePrincipalMin", G = q === "vonMises" || q === "pressure", _e = q === "tranverseShearX" || q === "tranverseShearY" || q === "transverseShearMax", ue = (_D = y.solidResults) == null ? void 0 : _D.val, Ve = ue === "vonMises" || ue === "sigmaXX" || ue === "sigmaYY" || ue === "sigmaZZ" || ue === "tauXY" || ue === "tauYZ" || ue === "tauXZ", he = ue === "ux" || ue === "uy" || ue === "uz", Ie = sl.val, ve = Ve ? il[Ie] : he || fe ? da[O] : ye || be || G || _e ? 1 / al[R] : 1, qe = Ve ? Ie : he || fe ? O : ye ? `${R}\xB7m/m` : be ? `${R}/m\xB2` : G ? `${R}/m\xB2` : _e ? `${R}/m` : "";
    ws.val = qe, ro.val = Array.isArray(X) && X.length === 2 ? [X[0] * ve, X[1] * ve] : null;
    const Je = ya.val, gt = ue && ue !== "none" ? [ne, 0] : K[q], xe = [];
    if (t.nodes.val.forEach((D, oe) => {
      const ee = gt;
      if (!ee || !ee[0] || typeof ee[0].has != "function") return;
      if (!ee[0].has(oe)) {
        xe.push(Number.NaN);
        return;
      }
      const ie = ee[0].get(oe), Ce = ie ? ie[ee[1]] ?? 0 : 0;
      xe.push(Ce * ve);
    }), !ro.val && Je !== "auto") {
      const D = t.nodes.val, oe = /* @__PURE__ */ new Set(), ee = (Ce, Se) => {
        var _a2;
        const ge = (_a2 = D[Ce[0]]) == null ? void 0 : _a2[Se];
        return Ce.every((Le) => {
          var _a3;
          return Math.abs((((_a3 = D[Le]) == null ? void 0 : _a3[Se]) ?? NaN) - ge) < 1e-6;
        });
      };
      for (const Ce of t.elements.val) {
        if (Ce.length !== 4) continue;
        const Se = ee(Ce, 2), ge = !Se && ee(Ce, 0), Le = !Se && ee(Ce, 1);
        if (Je === "losas" ? Se : Je === "muros" ? ge || Le : Je === "murosX" ? ge : Je === "murosY" ? Le : false) for (const Pe of Ce) oe.add(Pe);
      }
      const ie = [];
      for (const Ce of oe) {
        const Se = xe[Ce];
        Number.isFinite(Se) && ie.push(Se);
      }
      ie.length && (ro.val = ys(ie));
    }
    v.val = xe;
  }), v;
}
export {
  ui as a,
  ra as b,
  nl as c,
  ol as d,
  sl as e,
  pl as g
};
