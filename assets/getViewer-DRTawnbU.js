import { N as Zt, a6 as Dn, q as Es, v as K, a7 as Ts, D as kt, M as et, B as Me, F as vt, a8 as Vs, x as pt, a9 as $s, aa as Ls, h as qo, ab as Ko, r as an, ac as Yn, ad as Un, a4 as is, _ as je, a as ct, L as Kt, w as ls, b as Is, ae as Rs, f as it, V as _, $ as sn, af as fo, H as bo, d as _t, c as ho, Y as rs, Z as qn, G as Ds, z as Pn, A as Bs, ag as Zn, t as Xs, o as Ns, I as en, a2 as Sn, E as Go, S as xn, m as mo, ah as kn, g as Ho, i as Wo, j as Jo, C as Oo, K as Ys, U as Us, W as Zs, X as qs, T as Bn, P as wo, O as Ks } from "./theme-U-6D_qyI.js";
import { T as St, O as Qo } from "./Text-CUW6lNkV.js";
import { P as cs } from "./tweakpane-BXg6ZhiP.js";
import { e as Gs } from "./styles-SbI03m7S.js";
class ds {
  constructor(l, u = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, u);
  }
  set(l) {
    return l.isLut === true && this.copy(l), this;
  }
  setMin(l) {
    return this.minV = l, this;
  }
  setMax(l) {
    return this.maxV = l, this;
  }
  setColorMap(l, u = 32) {
    this.map = yo[l] || yo.rainbow, this.n = u;
    const h = 1 / this.n, c = new Zt(), m = new Zt();
    this.lut.length = 0, this.lut.push(new Zt(this.map[0][1]));
    for (let p = 1; p < u; p++) {
      const g = p * h;
      for (let x = 0; x < this.map.length - 1; x++) if (g > this.map[x][0] && g <= this.map[x + 1][0]) {
        const P = this.map[x][0], A = this.map[x + 1][0];
        c.setHex(this.map[x][1], Dn), m.setHex(this.map[x + 1][1], Dn);
        const M = new Zt().lerpColors(c, m, (g - P) / (A - P));
        this.lut.push(M);
      }
    }
    return this.lut.push(new Zt(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Es.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const u = Math.round(l * this.n);
    return this.lut[u];
  }
  addColorMap(l, u) {
    return yo[l] = u, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const u = l.getContext("2d", { alpha: false }), h = u.getImageData(0, 0, 1, this.n), c = h.data;
    let m = 0;
    const p = 1 / this.n, g = new Zt(), x = new Zt(), P = new Zt();
    for (let A = 1; A >= 0; A -= p) for (let M = this.map.length - 1; M >= 0; M--) if (A < this.map[M][0] && A >= this.map[M - 1][0]) {
      const te = this.map[M - 1][0], ae = this.map[M][0];
      g.setHex(this.map[M - 1][1], Dn), x.setHex(this.map[M][1], Dn), P.lerpColors(g, x, (A - te) / (ae - te)), c[m * 4] = Math.round(P.r * 255), c[m * 4 + 1] = Math.round(P.g * 255), c[m * 4 + 2] = Math.round(P.b * 255), c[m * 4 + 3] = 255, m += 1;
    }
    return u.putImageData(h, 0, 0), l;
  }
}
const yo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ps = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Hs = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ps, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Kn = K.state("safe"), us = K.state("auto");
function fs(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Hs[Kn.val] ?? ps;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, m, p, g] = l[h], [x, P, A, M] = l[h + 1];
    if (e <= x) {
      const te = (e - c) / (x - c);
      return [m + (P - m) * te, p + (A - p) * te, g + (M - g) * te];
    }
  }
  const u = l[l.length - 1];
  return [u[1], u[2], u[3]];
}
function jo() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [m, p, g] = fs(c);
    l[h * 4 + 0] = m, l[h * 4 + 1] = p, l[h * 4 + 2] = g, l[h * 4 + 3] = 255;
  }
  const u = new $s(l, 256, 1, Ls);
  return u.minFilter = qo, u.magFilter = qo, u.wrapS = Ko, u.wrapT = Ko, u.needsUpdate = true, u;
}
function Ws() {
  const l = [];
  for (let u = 0; u <= 12; u++) {
    const h = 1 - u / 12, [c, m, p] = fs(h);
    l.push(`rgb(${c | 0},${m | 0},${p | 0}) ${(u / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function _o(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((m, p) => m - p), u = (m) => l[Math.min(l.length - 1, Math.max(0, Math.round(m * (l.length - 1))))];
  let h = l.length >= 20 ? u(0.01) : l[0], c = l.length >= 20 ? u(0.99) : l[l.length - 1];
  return h >= 0 && c > 0 && (h = 0), c <= 0 && h < 0 && (c = 0), [h, c];
}
function Js(e, l, u) {
  new ds();
  const h = jo(), c = new Ts({ uniforms: { cmap: { value: h }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: kt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  K.derive(() => {
    var _a2;
    Kn.val;
    const p = c.uniforms.cmap.value;
    c.uniforms.cmap.value = jo(), (_a2 = p == null ? void 0 : p.dispose) == null ? void 0 : _a2.call(p);
  });
  const m = new et(new Me(), c);
  return m.renderOrder = -1, m.frustumCulled = false, m.userData.isShellArea = true, m.name = "__hekatan_shell_colormap", K.derive(() => {
    m.geometry.setAttribute("position", new vt(e.val.flat(), 3));
    const p = [], g = [], x = [];
    l.val.forEach((J, be) => {
      J.length === 3 ? (p.push(J[0], J[1], J[2]), g.push(be), x.push(0)) : J.length === 4 && (p.push(J[0], J[1], J[2]), p.push(J[0], J[2], J[3]), g.push(be, be), x.push(0, 1));
    }), m.geometry.setIndex(new Vs(p, 1)), m.userData.faceToElem = g, m.userData.faceLocal = x;
    const P = u.val.filter((J) => Number.isFinite(J));
    let A, M;
    const te = zn.val;
    if (te ? (M = te[0], A = te[1]) : [M, A] = _o(P), A === M) {
      const J = Math.max(Math.abs(A) * 1e-6, 1e-9);
      A += J, M -= J;
    }
    const ae = te && te[0] > te[1], de = Math.min(M, A), se = Math.max(M, A), E = se - de, ie = new Float32Array(u.val.length);
    for (let J = 0; J < u.val.length; J++) {
      const be = u.val[J];
      if (!Number.isFinite(be)) {
        ie[J] = -1;
        continue;
      }
      const Y = ((ae ? se + de - be : be) - de) / E;
      ie[J] = Math.max(0, Math.min(1, Y));
    }
    m.geometry.setAttribute("scalar", new pt(ie, 1));
  }), m;
}
function Os(e, l, u) {
  const h = document.createElement("div"), c = new cs({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const m = "hk_settingsPos";
  let p = null;
  try {
    const M = localStorage.getItem(m);
    M && (p = JSON.parse(M));
  } catch {
  }
  h.style.cssText = ["position:fixed", p ? `left:${p.left}px` : "left:8px", p ? `top:${p.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const g = () => {
    const M = h.querySelector(".tp-rotv_b");
    if (!M) {
      setTimeout(g, 200);
      return;
    }
    M.style.cursor = "move", M.style.userSelect = "none";
    let te = false, ae = 0, de = 0, se = 0, E = 0;
    M.addEventListener("mousedown", (ie) => {
      te = true, ae = ie.clientX, de = ie.clientY;
      const J = h.getBoundingClientRect();
      se = J.left, E = J.top, h.style.left = `${se}px`, h.style.top = `${E}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!te) return;
      const J = ie.clientX - ae, be = ie.clientY - de, ye = Math.max(0, Math.min(window.innerWidth - 40, se + J)), Y = Math.max(0, Math.min(window.innerHeight - 40, E + be));
      h.style.left = `${ye}px`, h.style.top = `${Y}px`;
    }), window.addEventListener("mouseup", () => {
      if (te) {
        te = false;
        try {
          localStorage.setItem(m, JSON.stringify({ left: parseFloat(h.style.left), top: parseFloat(h.style.top) }));
        } catch {
        }
      }
    });
  };
  if (g(), l == null ? void 0 : l.nodes) {
    c.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const M = c.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    M.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), M.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), M.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), M.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const te = M.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    te.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), te.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), te.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), te.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), te.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ae = c.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ae.addBinding(e.nodes, "val", { label: "Nodes" }), ae.addBinding(e.elements, "val", { label: "Elements" }), ae.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ae.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ae.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ae.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ae.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ae.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ae.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ae.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ae.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ae.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ae.addBinding(e.orientations, "val", { label: "Orientations" }), ae.addBinding(e.sections, "val", { label: "Sections" }), ae.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ae.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ae.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ae.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ae.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const M = c.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    M.addBinding(e.supports, "val", { label: "Supports" }), M.addBinding(e.loads, "val", { label: "Loads" }), M.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), M.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const M = c.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = M, M.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), M.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), M.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), M.addBinding(Kn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), M.addBinding(us, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), M.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), M.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), M.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), M.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  u && c.addBinding(e.solids, "val", { label: "Solids" });
  const x = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), P = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), A = () => {
    const M = window.__hekatanClipApply;
    typeof M == "function" && M();
  };
  return x.addBinding(P, "enableX", { label: "Cortar X" }).on("change", A), x.addBinding(P, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", A), x.addBinding(P, "invertX", { label: "  invertir X" }).on("change", A), x.addBinding(P, "enableY", { label: "Cortar Y" }).on("change", A), x.addBinding(P, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", A), x.addBinding(P, "invertY", { label: "  invertir Y" }).on("change", A), x.addBinding(P, "enableZ", { label: "Cortar Z" }).on("change", A), x.addBinding(P, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", A), x.addBinding(P, "invertZ", { label: "  invertir Z" }).on("change", A), h;
}
function Qs(e) {
  return { gridSize: K.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: K.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: K.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: K.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: K.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: K.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: K.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: K.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: K.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: K.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: K.state((e == null ? void 0 : e.nodes) ?? true), elements: K.state((e == null ? void 0 : e.elements) ?? true), edges: K.state((e == null ? void 0 : e.edges) ?? true), faces: K.state((e == null ? void 0 : e.faces) ?? true), elemColumns: K.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: K.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: K.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: K.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: K.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: K.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: K.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: K.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: K.state((e == null ? void 0 : e.orientations) ?? false), sections: K.state((e == null ? void 0 : e.sections) ?? true), extruded: K.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: K.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: K.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: K.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: K.state((e == null ? void 0 : e.secFloor) ?? -1), supports: K.state((e == null ? void 0 : e.supports) ?? true), loads: K.state((e == null ? void 0 : e.loads) ?? false), deformedShape: K.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: K.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: K.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: K.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: K.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: K.state((e == null ? void 0 : e.flipAxes) ?? false), solids: K.state((e == null ? void 0 : e.solids) ?? true), custom3D: K.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: K.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: K.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: K.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function js(e, l, u) {
  const h = an(), c = new Yn(new Me(), new Un({ color: h.nodePoint }));
  return is((m, p) => {
    c.material.color.setHex(p.nodePoint);
  }), c.frustumCulled = false, K.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new vt(l.val.flat(), 3));
  }), K.derive(() => {
    if (u.val, l.val, !e.nodes.rawVal) return;
    const m = l.rawVal ?? [];
    let p = e.gridSize.val * 0.5;
    if (m.length >= 2) {
      const x = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
      for (const A of m) for (let M = 0; M < 3; M++) x[M] = Math.min(x[M], A[M]), P[M] = Math.max(P[M], A[M]);
      p = Math.max(P[0] - x[0], P[1] - x[1], P[2] - x[2], 0.1);
    }
    const g = 0.03 * p;
    c.material.size = g * u.rawVal;
  }), K.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function xo(e, l) {
  const u = an(), h = new je();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let m = (l == null ? void 0 : l.majorStep) ?? 1, p = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (m <= 0 && (m = 1), p <= 0 && (p = 0.1); e / p > 500; ) p *= 2;
  for (; e / m > 100; ) m *= 2;
  const g = e / 2;
  m = Math.max(p, Math.round(m / p) * p);
  const P = new Zt(u.grid), A = new Zt(u.grid).multiplyScalar(0.45), M = (se, E, ie, J) => {
    const be = [], ye = se === "xy" ? (T, U) => [T, U, 0] : se === "xz" ? (T, U) => [T, 0, U] : (T, U) => [0, T, U], Y = Math.floor(g / E);
    for (let T = -Y; T <= Y; T++) {
      const U = T * E, X = ye(U, -g), L = ye(U, g);
      be.push(...X, ...L);
    }
    for (let T = -Y; T <= Y; T++) {
      const U = T * E, X = ye(-g, U), L = ye(g, U);
      be.push(...X, ...L);
    }
    const B = new Me();
    B.setAttribute("position", new vt(be, 3));
    const Z = new ct({ color: ie, transparent: true, opacity: J, depthWrite: false }), $ = new Kt(B, Z);
    return $.name = `grid-${se}-${E === p ? "minor" : "major"}`, $;
  }, te = (se, E, ie) => {
    const J = se === "xy" ? ($, T) => [$, T, 0] : se === "xz" ? ($, T) => [$, 0, T] : ($, T) => [0, $, T], be = [[-g, -g], [g, -g], [g, g], [-g, g]], ye = [];
    for (const [$, T] of be) ye.push(...J($, T));
    const Y = new Me();
    Y.setAttribute("position", new vt(ye, 3));
    const B = new ct({ color: E, transparent: true, opacity: ie, depthWrite: false }), Z = new ls(Y, B);
    return Z.name = `grid-${se}-border`, Z.renderOrder = 1, Z;
  }, ae = (se, E, ie) => {
    const J = se === "xy" ? (B, Z) => [B, Z, 0] : se === "xz" ? (B, Z) => [B, 0, Z] : (B, Z) => [0, B, Z], be = E === "u" ? [...J(-g, 0), ...J(g, 0)] : [...J(0, -g), ...J(0, g)], ye = new Me();
    ye.setAttribute("position", new vt(be, 3));
    const Y = new Kt(ye, new ct({ color: ie, transparent: true, opacity: 0.45, depthWrite: false }));
    return Y.name = `grid-${se}-eje-${E}`, Y.renderOrder = 1, Y;
  }, de = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of c) {
    h.add(M(se, p, A, 0.12)), h.add(M(se, m, P, 0.4));
    const [E, ie] = de[se];
    h.add(ae(se, "u", E)), h.add(ae(se, "v", ie)), h.add(te(se, P, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: m, minorStep: p, gridSize: e, planes: [...c] }, h;
}
function ea(e, l, u, h) {
  const c = new je(), m = new Is(0.5, 0.5, 0.5), p = new Rs(0.45, 0.7, 4);
  p.rotateX(Math.PI / 2), p.translate(0, 0, -0.35);
  const g = new it({ color: 10166822 }), x = new it({ color: 2792847 }), P = new it({ color: 3835647 }), A = () => {
    const ae = u.rawVal ?? [];
    if (ae.length < 2) return l.gridSize.val * 0.5;
    let de = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of ae) for (let ie = 0; ie < 3; ie++) E[ie] < de[ie] && (de[ie] = E[ie]), E[ie] > se[ie] && (se[ie] = E[ie]);
    return Math.max(se[0] - de[0], se[1] - de[1], se[2] - de[2], 0.1);
  }, M = () => 0.08 * A(), te = () => h.rawVal;
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const ae = M();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((de, se) => {
      const E = u.val[se];
      if (!E) return;
      const ie = de ?? [], J = (ie[0] ? 1 : 0) + (ie[1] ? 1 : 0) + (ie[2] ? 1 : 0), be = (ie[3] ? 1 : 0) + (ie[4] ? 1 : 0) + (ie[5] ? 1 : 0);
      let ye;
      J >= 3 && be >= 3 ? ye = new et(m, g) : J >= 3 && be === 0 ? ye = new et(p, x) : ye = new et(p, P), ye.position.set(E[0], E[1], E[2]);
      const Y = ae * te();
      ye.scale.set(Y, Y, Y), c.add(ye);
    });
  }), K.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const de = M() * te();
    c.children.forEach((se) => se.scale.set(de, de, de));
  }), K.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function ta(e, l, u, h) {
  const c = new je();
  c.name = "loadsGroup";
  function m(p) {
    if (p.length < 2) return 0.12 * l.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], x = [-1 / 0, -1 / 0, -1 / 0];
    for (const A of p) for (let M = 0; M < 3; M++) g[M] = Math.min(g[M], A[M]), x[M] = Math.max(x[M], A[M]);
    return 0.08 * Math.max(x[0] - g[0], x[1] - g[1], x[2] - g[2], 0.1);
  }
  return K.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((M) => M.dispose()), c.clear();
    const p = u.val, g = m(p), x = 240, P = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((M, te) => {
      p[te] && M.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && P.push(te);
    });
    let A = P;
    if (P.length > x) {
      const M = P.map(($) => p[$][0]), te = P.map(($) => p[$][1]), ae = Math.min(...M), de = Math.max(...M), se = Math.min(...te), E = Math.max(...te), ie = P.map(($) => p[$][2]), J = Math.max(1e-6, (Math.max(...ie) - Math.min(...ie)) / 40), be = ($) => Math.round($ / J), ye = new Set(ie.map(be)), Y = Math.max(4, Math.floor(x / Math.max(1, ye.size))), B = Math.max(2, Math.round(Math.sqrt(Y))), Z = /* @__PURE__ */ new Map();
      for (const $ of P) {
        const T = de - ae < 1e-9 ? 0 : (p[$][0] - ae) / (de - ae), U = E - se < 1e-9 ? 0 : (p[$][1] - se) / (E - se), X = Math.min(B - 1, Math.floor(T * B)), L = Math.min(B - 1, Math.floor(U * B)), j = `${X},${L},${be(p[$][2])}`, ue = Math.hypot(T * B - (X + 0.5), U * B - (L + 0.5)), re = Z.get(j);
        (!re || ue < re.d) && Z.set(j, { i: $, d: ue });
      }
      A = [...Z.values()].map(($) => $.i);
    }
    for (const M of A) {
      const te = e.nodeInputs.val.loads.get(M), ae = p[M];
      if (!ae) continue;
      const de = new _(...te.slice(0, 3));
      if (de.lengthSq() < 1e-30) continue;
      de.normalize();
      const se = new sn(de, new _(...ae), 1, 15637248, 0.3, 0.3), E = g * h.rawVal;
      se.scale.set(E, E, E), c.add(se);
    }
  }), K.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const g = m(u.rawVal) * h.rawVal;
    c.children.forEach((x) => x.scale.set(g, g, g));
  }), K.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function na(e, l, u) {
  const h = new je();
  return K.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((m) => m.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((m, p) => {
      const g = new St(`${p}`);
      g.position.set(...m), g.updateScale(c * u.rawVal), h.add(g);
    });
  }), K.derive(() => {
    if (u.val, !e.nodesIndexes.rawVal) return;
    const c = 0.05 * e.gridSize.val * 0.6;
    h.children.forEach((m) => m.updateScale(c * u.rawVal));
  }), K.derive(() => {
    h.visible = e.nodesIndexes.val;
  }), h;
}
function oa(e, l, u, h) {
  const c = new je();
  return K.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((p) => p.dispose()), c.clear();
    const m = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((p, g) => {
      const x = new St(`${g}`, void 0, "#001219");
      x.position.set(...sa(p.map((P) => u.rawVal[P]))), x.updateScale(m * h.rawVal), c.add(x);
    });
  }), K.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const m = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((p) => p.updateScale(m * h.rawVal));
  }), K.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function sa(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), u = e.length;
  return [l[0] / u, l[1] / u, l[2] / u];
}
function es(e, l) {
  const u = new je(), h = Math.min(0.05 * e, 0.6), c = an(), m = new St("X", "red", "transparent"), p = new St(l ? "Z" : "Y", "green", "transparent"), g = new St(l ? "Y" : "Z", "blue", "transparent"), x = new sn(new _(1, 0, 0), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), P = new sn(new _(0, 1, 0), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), A = new sn(new _(0, 0, 1), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return m.position.set(1.3 * h, 0, 0), p.position.set(0, 1.3 * h, 0), g.position.set(0, 0, 1.3 * h), m.updateScale(0.4 * h), p.updateScale(0.4 * h), g.updateScale(0.4 * h), x.scale.set(h, h, h), P.scale.set(h, h, h), A.scale.set(h, h, h), u.add(x, P, A, m, p, g), u;
}
function Gn(e, l) {
  const u = new _(...e), c = new _(...l).clone().sub(u), m = c.length(), p = c.dot(new _(1, 0, 0)) / m, g = c.dot(new _(0, 1, 0)) / m, x = c.dot(new _(0, 0, 1)) / m, P = Math.sqrt(p ** 2 + g ** 2);
  let A = new fo().fromArray([[p, g, x], [-g / P, p / P, 0], [-p * x / P, -g * x / P, P]].flat());
  return x === 1 && (A = new fo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), x === -1 && (A = new fo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new bo().setFromMatrix3(A);
}
function vo(e, l) {
  return e == null ? void 0 : e.map((u, h) => (9 * u + l[h]) / 10);
}
function Cn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), u = e.length;
  return [l[0] / u, l[1] / u, l[2] / u];
}
function aa(e, l, u) {
  const h = Cn([l, u]), c = Cn([e, u]), m = Cn([e, l]), p = new _(...h).sub(new _(...c)).normalize(), g = new _(...u).sub(new _(...m)).normalize(), x = p.clone().cross(g).normalize(), P = x.clone().cross(p).normalize();
  return new bo().makeBasis(p, P, x);
}
function ia(e, l, u, h) {
  const c = new je(), m = new Me(), p = new ct({ vertexColors: true }), g = [0, 0, 0], x = [1, 0, 0], P = [0, 1, 0], A = [0, 0, 1];
  m.setAttribute("position", new vt([...g, ...x, ...g, ...P, ...g, ...A], 3));
  const M = [255, 0, 0], te = [0, 255, 0], ae = [0, 0, 255];
  return m.setAttribute("color", new vt([...M, ...M, ...te, ...te, ...ae, ...ae], 3)), K.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((de) => {
      const se = new Kt(m, p), E = u.rawVal[de[0]], ie = u.rawVal[de[1]];
      if (de.length === 2 && (se.position.set(...vo(E, ie)), se.rotation.setFromRotationMatrix(Gn(E, ie))), de.length === 3) {
        const ye = u.rawVal[de[2]];
        se.position.set(...Cn([E, ie, ye])), se.rotation.setFromRotationMatrix(aa(E, ie, ye));
      }
      const be = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      se.scale.set(be, be, be), c.add(se);
    }));
  }), K.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((E) => E.scale.set(se, se, se));
  }), K.derive(() => {
    c.visible = l.orientations.val;
  }), c;
}
function la(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), u = (e.h * 100).toFixed(0);
    return `${l}x${u}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ra(e, l, u, h) {
  const c = new je(), m = new je();
  c.add(m);
  function p(B, Z) {
    const $ = B / 2, T = Z / 2, U = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, -T, 0, $, T, 0, -$, T]), X = new Me();
    X.setAttribute("position", new pt(U, 3));
    const L = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, T, 0, -$, -T]), j = new Me();
    return j.setAttribute("position", new pt(L, 3)), { fill: X, outline: j };
  }
  function g(B, Z = 24) {
    const $ = B / 2, T = new Float32Array(Z * 9);
    for (let j = 0; j < Z; j++) {
      const ue = j / Z * Math.PI * 2, re = (j + 1) / Z * Math.PI * 2;
      T[j * 9] = 0, T[j * 9 + 1] = 0, T[j * 9 + 2] = 0, T[j * 9 + 3] = 0, T[j * 9 + 4] = $ * Math.cos(ue), T[j * 9 + 5] = $ * Math.sin(ue), T[j * 9 + 6] = 0, T[j * 9 + 7] = $ * Math.cos(re), T[j * 9 + 8] = $ * Math.sin(re);
    }
    const U = new Me();
    U.setAttribute("position", new pt(T, 3));
    const X = new Float32Array((Z + 1) * 3);
    for (let j = 0; j <= Z; j++) {
      const ue = j / Z * Math.PI * 2;
      X[j * 3] = 0, X[j * 3 + 1] = $ * Math.cos(ue), X[j * 3 + 2] = $ * Math.sin(ue);
    }
    const L = new Me();
    return L.setAttribute("position", new pt(X, 3)), { fill: U, outline: L };
  }
  function x(B, Z, $, T) {
    const U = $ ?? Z * 0.08, X = T ?? B * 0.07, L = B / 2, j = Z / 2, ue = j - U, re = X / 2, oe = [];
    function R(he, $e, _e, Be) {
      oe.push(0, he, $e, 0, _e, $e, 0, _e, Be, 0, he, $e, 0, _e, Be, 0, he, Be);
    }
    R(-L, -j, L, -ue), R(-re, -ue, re, ue), R(-L, ue, L, j);
    const pe = new Me();
    pe.setAttribute("position", new pt(new Float32Array(oe), 3));
    const G = new Float32Array([0, -L, -j, 0, L, -j, 0, L, -ue, 0, re, -ue, 0, re, ue, 0, L, ue, 0, L, j, 0, -L, j, 0, -L, ue, 0, -re, ue, 0, -re, -ue, 0, -L, -ue, 0, -L, -j]), fe = new Me();
    return fe.setAttribute("position", new pt(G, 3)), { fill: pe, outline: fe };
  }
  function P(B, Z, $) {
    const T = B / 2, U = Z / 2, X = T - $, L = U - $, j = [];
    function ue(pe, G, fe, he) {
      j.push(0, pe, G, 0, fe, G, 0, fe, he, 0, pe, G, 0, fe, he, 0, pe, he);
    }
    ue(-T, -U, T, -L), ue(-T, L, T, U), ue(-T, -L, -X, L), ue(X, -L, T, L);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(j), 3));
    const oe = new Float32Array([0, -T, -U, 0, T, -U, 0, T, -U, 0, T, U, 0, T, U, 0, -T, U, 0, -T, U, 0, -T, -U, 0, -X, -L, 0, X, -L, 0, X, -L, 0, X, L, 0, X, L, 0, -X, L, 0, -X, L, 0, -X, -L]), R = new Me();
    return R.setAttribute("position", new pt(oe, 3)), { fill: re, outline: R };
  }
  function A(B, Z, $) {
    const T = B / 2, U = Z / 2, X = T - $, L = U - $, j = new Me(), ue = new Float32Array([0, -X, -L, 0, X, -L, 0, X, L, 0, -X, -L, 0, X, L, 0, -X, L]);
    j.setAttribute("position", new pt(ue, 3));
    const re = [];
    function oe(fe, he, $e, _e) {
      re.push(0, fe, he, 0, $e, he, 0, $e, _e, 0, fe, he, 0, $e, _e, 0, fe, _e);
    }
    oe(-T, -U, T, -L), oe(-T, L, T, U), oe(-T, -L, -X, L), oe(X, -L, T, L);
    const R = new Me();
    R.setAttribute("position", new pt(new Float32Array(re), 3));
    const pe = new Float32Array([0, -T, -U, 0, T, -U, 0, T, -U, 0, T, U, 0, T, U, 0, -T, U, 0, -T, U, 0, -T, -U, 0, -X, -L, 0, X, -L, 0, X, -L, 0, X, L, 0, X, L, 0, -X, L, 0, -X, L, 0, -X, -L]), G = new Me();
    return G.setAttribute("position", new pt(pe, 3)), { concFill: j, steelFillGeom: R, outline: G };
  }
  function M(B, Z, $) {
    const T = [], U = [[0, -B / 2, -Z / 2], [0, -B / 2 + $, -Z / 2], [0, -B / 2 + $, Z / 2 - $], [0, B / 2, Z / 2 - $], [0, B / 2, Z / 2], [0, -B / 2, Z / 2]], X = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const re of X) T.push(...U[re]);
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(T), 3));
    const j = [];
    for (let re = 0; re < U.length; re++) {
      const oe = (re + 1) % U.length;
      j.push(...U[re], ...U[oe]);
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(j), 3)), { fill: L, outline: ue };
  }
  function te(B, Z, $, T) {
    const U = T / 2, X = [], L = [[0, -B - U, -Z / 2], [0, -$ - U, -Z / 2], [0, -$ - U, Z / 2 - $], [0, -U, Z / 2 - $], [0, -U, Z / 2], [0, -B - U, Z / 2]], j = [[0, U, -Z / 2], [0, U + $, -Z / 2], [0, U + $, Z / 2 - $], [0, B + U, Z / 2 - $], [0, B + U, Z / 2], [0, U, Z / 2]], ue = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of ue) X.push(...L[pe]);
    for (const pe of ue) X.push(...j[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(X), 3));
    const oe = [];
    for (const pe of [L, j]) for (let G = 0; G < pe.length; G++) {
      const fe = (G + 1) % pe.length;
      oe.push(...pe[G], ...pe[fe]);
    }
    const R = new Me();
    return R.setAttribute("position", new pt(new Float32Array(oe), 3)), { fill: re, outline: R };
  }
  function ae(B, Z, $, T) {
    const U = Z / 2, X = B, L = [[0, -X, -U], [0, -X, -U + $], [0, -T, -U + $], [0, -T, U - $], [0, -X, U - $], [0, -X, U], [0, 0, U], [0, 0, -U]], j = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ue = [];
    for (const pe of j) ue.push(...L[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(ue), 3));
    const oe = [];
    for (let pe = 0; pe < L.length; pe++) {
      const G = (pe + 1) % L.length;
      oe.push(...L[pe], ...L[G]);
    }
    const R = new Me();
    return R.setAttribute("position", new pt(new Float32Array(oe), 3)), { fill: re, outline: R };
  }
  function de(B, Z, $, T, U) {
    const X = Z / 2, L = U / 2, j = [], ue = [[0, -B, -X], [0, -B, -X + $], [0, -L - T, -X + $], [0, -L - T, X - $], [0, -B, X - $], [0, -B, X], [0, -L, X], [0, -L, -X]], re = ue.map((fe) => [fe[0], -fe[1], fe[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const fe of oe) j.push(...ue[fe]);
    for (const fe of oe) j.push(...re[fe]);
    const R = new Me();
    R.setAttribute("position", new pt(new Float32Array(j), 3));
    const pe = [];
    for (const fe of [ue, re]) for (let he = 0; he < fe.length; he++) {
      const $e = (he + 1) % fe.length;
      pe.push(...fe[he], ...fe[$e]);
    }
    const G = new Me();
    return G.setAttribute("position", new pt(new Float32Array(pe), 3)), { fill: R, outline: G };
  }
  function se(B, Z, $, T) {
    const U = B / 2, X = Z / 2, L = T / 2, j = [[0, -L, -X], [0, L, -X], [0, L, X - $], [0, U, X - $], [0, U, X], [0, -U, X], [0, -U, X - $], [0, -L, X - $]], ue = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], re = [];
    for (const G of ue) re.push(...j[G]);
    const oe = new Me();
    oe.setAttribute("position", new pt(new Float32Array(re), 3));
    const R = [];
    for (let G = 0; G < j.length; G++) {
      const fe = (G + 1) % j.length;
      R.push(...j[G], ...j[fe]);
    }
    const pe = new Me();
    return pe.setAttribute("position", new pt(new Float32Array(R), 3)), { fill: oe, outline: pe };
  }
  function E(B, Z, $ = 24) {
    const T = B / 2, U = T - Z, X = [];
    for (let re = 0; re < $; re++) {
      const oe = re / $ * Math.PI * 2, R = (re + 1) / $ * Math.PI * 2, pe = Math.cos(oe), G = Math.sin(oe), fe = Math.cos(R), he = Math.sin(R);
      X.push(0, T * pe, T * G, 0, T * fe, T * he, 0, U * fe, U * he), X.push(0, T * pe, T * G, 0, U * fe, U * he, 0, U * pe, U * G);
    }
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(X), 3));
    const j = [];
    for (let re = 0; re < $; re++) {
      const oe = re / $ * Math.PI * 2, R = (re + 1) / $ * Math.PI * 2;
      j.push(0, T * Math.cos(oe), T * Math.sin(oe), 0, T * Math.cos(R), T * Math.sin(R)), j.push(0, U * Math.cos(oe), U * Math.sin(oe), 0, U * Math.cos(R), U * Math.sin(R));
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(j), 3)), { fill: L, outline: ue };
  }
  const ie = new it({ color: 52479, transparent: true, opacity: 0.35, side: kt, depthWrite: false }), J = new ct({ color: 52479 }), be = new it({ color: 16750848, transparent: true, opacity: 0.4, side: kt, depthWrite: false }), ye = new ct({ color: 16750848 });
  function Y(B, Z) {
    const $ = Math.abs(Z[0] - B[0]), T = Math.abs(Z[1] - B[1]), U = Math.abs(Z[2] - B[2]);
    return U > $ && U > T || T > $ && T > U;
  }
  return K.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const B = l.secColumns.rawVal, Z = l.secBeams.rawVal;
    if (!B && !Z) {
      c.children.forEach((L) => {
        L instanceof St && L.dispose();
      }), c.clear();
      return;
    }
    c.children.forEach((L) => {
      L instanceof St && L.dispose();
    }), c.clear();
    const $ = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!$ || !T) return;
    const U = T.sectionShapes, X = l.secFloor.rawVal;
    $.forEach((L, j) => {
      if (L.length !== 2) return;
      const ue = u.rawVal[L[0]], re = u.rawVal[L[1]];
      if (!ue || !re) return;
      const oe = Y(ue, re);
      if (oe && !B || !oe && !Z) return;
      if (X >= 0) {
        const he = Math.min(ue[1], re[1]);
        Math.max(ue[1], re[1]);
        const $e = l.gridSize.rawVal || 3;
        if (Math.floor(he / $e + 0.01) !== X) return;
      }
      const R = U == null ? void 0 : U.get(j);
      if (!R) return;
      const pe = [(ue[0] + re[0]) / 2, (ue[1] + re[1]) / 2, (ue[2] + re[2]) / 2], G = Gn(ue, re);
      if (R.type === "CFT") {
        const he = A(R.b, R.h, R.tw ?? R.b * 0.05), $e = new et(he.concFill, ie);
        $e.position.set(...pe), $e.rotation.setFromRotationMatrix(G), c.add($e);
        const _e = new et(he.steelFillGeom, be);
        _e.position.set(...pe), _e.rotation.setFromRotationMatrix(G), c.add(_e);
        const Be = new _t(he.outline, ye);
        Be.position.set(...pe), Be.rotation.setFromRotationMatrix(G), c.add(Be);
      } else {
        let he, $e, _e;
        switch (R.type) {
          case "rect":
            he = p(R.b, R.h), $e = ie, _e = J;
            break;
          case "circ":
            he = g(R.d), $e = ie, _e = J;
            break;
          case "I":
            he = x(R.b, R.h, R.tf, R.tw), $e = be, _e = ye;
            break;
          case "HSS":
            he = P(R.b, R.h, R.tw ?? R.b * 0.05), $e = be, _e = ye;
            break;
          case "CFT":
            he = A(R.b, R.h, R.tw ?? R.b * 0.05), $e = be, _e = ye;
            break;
          case "L":
            he = M(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3), $e = be, _e = ye;
            break;
          case "2L":
            he = te(R.b ?? R.h, R.h, R.t ?? R.tw ?? 3e-3, R.dis ?? 0.01), $e = be, _e = ye;
            break;
          case "C":
          case "coldC":
            he = ae(R.b, R.h, R.tf ?? R.t ?? 3e-3, R.tw ?? R.t ?? 3e-3), $e = be, _e = ye;
            break;
          case "2C":
            he = de(R.b, R.h, R.tf ?? 5e-3, R.tw ?? 5e-3, R.dis ?? 0.01), $e = be, _e = ye;
            break;
          case "T":
            he = se(R.b, R.h, R.tf ?? 0.01, R.tw ?? 6e-3), $e = be, _e = ye;
            break;
          case "pipe":
            he = E(R.d, R.tw ?? R.d * 0.05), $e = be, _e = ye;
            break;
          default:
            return;
        }
        const Be = new et(he.fill, $e);
        Be.position.set(...pe), Be.rotation.setFromRotationMatrix(G), c.add(Be);
        const Oe = new _t(he.outline, _e);
        Oe.position.set(...pe), Oe.rotation.setFromRotationMatrix(G), c.add(Oe);
      }
      const fe = la(R);
      if (fe) {
        const $e = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(R.type) ? "#ff9900" : "#00ccff", _e = new St(fe, $e, "transparent");
        _e.position.set(pe[0], pe[1], pe[2]);
        const Be = 0.05 * l.gridSize.rawVal * 0.5;
        _e.updateScale(Be * ((h == null ? void 0 : h.rawVal) ?? 1)), m.add(_e);
      }
    });
  }), h && K.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const B = 0.05 * l.gridSize.val * 0.5;
    m.children.forEach((Z) => {
      Z instanceof St && Z.updateScale(B * h.rawVal);
    });
  }), K.derive(() => {
    c.visible = l.sections.val;
  }), K.derive(() => {
    m.visible = l.sectionLabels.val;
  }), c;
}
function ca(e) {
  if (!e) return null;
  const l = e.type, u = (A, M) => [A, M], h = (A, M) => [u(-A / 2, -M / 2), u(A / 2, -M / 2), u(A / 2, M / 2), u(-A / 2, M / 2)], c = (A, M = 24) => {
    const te = A / 2, ae = [];
    for (let de = 0; de < M; de++) {
      const se = 2 * Math.PI * de / M;
      ae.push(u(te * Math.cos(se), te * Math.sin(se)));
    }
    return ae;
  }, m = e.b ?? 0, p = e.h ?? 0, g = e.d ?? 0, x = e.tw ?? e.t ?? 0, P = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return m && p ? { contorno: h(m, p) } : null;
    case "circ":
      return g ? { contorno: c(g) } : null;
    case "pipe":
      return g && x ? { contorno: c(g), huecos: [c(g - 2 * x).reverse()] } : null;
    case "HSS":
      return m && p && x ? { contorno: h(m, p), huecos: [h(m - 2 * x, p - 2 * (P || x)).reverse()] } : null;
    case "CFT":
      return m && p ? { contorno: h(m, p) } : null;
    case "I":
      return m && p && x && P ? { contorno: [u(-m / 2, -p / 2), u(m / 2, -p / 2), u(m / 2, -p / 2 + P), u(x / 2, -p / 2 + P), u(x / 2, p / 2 - P), u(m / 2, p / 2 - P), u(m / 2, p / 2), u(-m / 2, p / 2), u(-m / 2, p / 2 - P), u(-x / 2, p / 2 - P), u(-x / 2, -p / 2 + P), u(-m / 2, -p / 2 + P)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return m && p && x && P ? { contorno: [u(-m / 2, -p / 2), u(m / 2, -p / 2), u(m / 2, -p / 2 + P), u(-m / 2 + x, -p / 2 + P), u(-m / 2 + x, p / 2 - P), u(m / 2, p / 2 - P), u(m / 2, p / 2), u(-m / 2, p / 2)] } : null;
    case "T":
      return m && p && x && P ? { contorno: [u(-x / 2, -p / 2), u(x / 2, -p / 2), u(x / 2, p / 2 - P), u(m / 2, p / 2 - P), u(m / 2, p / 2), u(-m / 2, p / 2), u(-m / 2, p / 2 - P), u(-x / 2, p / 2 - P)] } : null;
    case "L":
    case "2L":
      return m && p && x ? { contorno: [u(-m / 2, -p / 2), u(m / 2, -p / 2), u(m / 2, -p / 2 + x), u(-m / 2 + x, -p / 2 + x), u(-m / 2 + x, p / 2), u(-m / 2, p / 2)] } : null;
    default:
      return m && p ? { contorno: h(m, p) } : g ? { contorno: c(g) } : null;
  }
}
function da(e, l, u) {
  if (!e || e <= 0 || !l || !u || l <= 0 || u <= 0) return null;
  const h = Math.sqrt(Math.sqrt(u / l)), c = Math.sqrt(e / h), m = e / c;
  return !isFinite(c) || !isFinite(m) || c <= 0 || m <= 0 ? null : { contorno: [[-c / 2, -m / 2], [c / 2, -m / 2], [c / 2, m / 2], [-c / 2, m / 2]] };
}
function pa(e) {
  const l = new Pn();
  e.contorno.forEach(([u, h], c) => c ? l.lineTo(u, h) : l.moveTo(u, h)), l.closePath();
  for (const u of e.huecos ?? []) {
    const h = new Bs();
    u.forEach(([c, m], p) => p ? h.lineTo(c, m) : h.moveTo(c, m)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function ua(e, l, u) {
  const h = new je();
  h.name = "extrusion";
  const c = new ho({ color: 8369151, transparent: true, opacity: 0.92, side: kt }), m = new ho({ color: 12623968, transparent: true, opacity: 0.85, side: kt }), p = new ho({ color: 11583173, transparent: true, opacity: 0.85, side: kt }), g = new je();
  g.add(new rs(16777215, 0.55));
  const x = new qn(16777215, 0.75);
  x.position.set(30, 25, 40);
  const P = new qn(16777215, 0.35);
  P.position.set(-25, -20, 15), g.add(x, P);
  let A = 0;
  return K.derive(() => {
    var _a2, _b, _c, _d, _e;
    const M = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++A, on: M }, h.visible = M;
    for (const J of [...h.children]) J !== g && (h.remove(J), (_c = (_b = J.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(g) || h.add(g), !M) return;
    const te = u.val ?? [], ae = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], de = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = de.sectionShapes ?? /* @__PURE__ */ new Map(), E = de.thicknesses ?? /* @__PURE__ */ new Map();
    let ie = "";
    try {
      ae.forEach((J, be) => {
        var _a3, _b2, _c2;
        if (J.length === 2) {
          let ye = ca(se.get(be)), Y = true;
          if (ye || (ye = da((_a3 = de.areas) == null ? void 0 : _a3.get(be), (_b2 = de.momentsOfInertiaY) == null ? void 0 : _b2.get(be), (_c2 = de.momentsOfInertiaZ) == null ? void 0 : _c2.get(be)), Y = false), !ye) return;
          const B = te[J[0]], Z = te[J[1]];
          if (!B || !Z) return;
          const $ = Math.hypot(Z[0] - B[0], Z[1] - B[1], Z[2] - B[2]);
          if ($ < 1e-9) return;
          const T = new Ds(pa(ye), { depth: $, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new bo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const U = new et(T, Y ? c : m);
          U.position.set(B[0], B[1], B[2]), U.rotation.setFromRotationMatrix(Gn(B, Z)), h.add(U);
          return;
        }
        if (J.length === 3 || J.length === 4) {
          const ye = E.get(be);
          if (!ye || ye <= 0) return;
          const Y = J.map((G) => te[G]).filter(Boolean);
          if (Y.length < 3) return;
          const B = [Y[1][0] - Y[0][0], Y[1][1] - Y[0][1], Y[1][2] - Y[0][2]], Z = [Y[2][0] - Y[0][0], Y[2][1] - Y[0][1], Y[2][2] - Y[0][2]], $ = B[1] * Z[2] - B[2] * Z[1], T = B[2] * Z[0] - B[0] * Z[2], U = B[0] * Z[1] - B[1] * Z[0], X = Math.hypot($, T, U);
          if (X < 1e-12) return;
          const L = [$ / X, T / X, U / X], j = [], ue = (G) => Y.map((fe) => [fe[0] + L[0] * G, fe[1] + L[1] * G, fe[2] + L[2] * G]), re = ue(+ye / 2), oe = ue(-ye / 2), R = (G, fe, he) => j.push(...G, ...fe, ...he);
          for (const G of [re, oe]) R(G[0], G[1], G[2]), G.length === 4 && R(G[0], G[2], G[3]);
          for (let G = 0; G < Y.length; G++) {
            const fe = (G + 1) % Y.length;
            R(re[G], oe[G], oe[fe]), R(re[G], oe[fe], re[fe]);
          }
          const pe = new Me();
          pe.setAttribute("position", new vt(j, 3)), pe.computeVertexNormals(), h.add(new et(pe, p));
        }
      });
    } catch (J) {
      ie = String((J == null ? void 0 : J.message) ?? J);
    }
    globalThis.__extrusionDebug = { corridas: A, on: M, fallo: ie, nElementos: ae.length, nFormas: se.size, nEspesores: E.size, mallas: h.children.length - 1 };
  }), h;
}
class Xn extends je {
  constructor(l, u, h, c, m, p, g) {
    super();
    const x = new Pn().moveTo(0, 0).lineTo(0, p[1]).lineTo(h, p[1]).lineTo(h, 0).lineTo(0, 0), P = x.getPoints(), A = new Me().setFromPoints(P);
    this.lines = new _t(A, new ct({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const M = new Zn(x), te = new it({ color: p[1] > 0 ? 24435 : 11411474, side: kt });
    this.mesh = new et(M, te), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new St(`${m[1].toFixed(4)}`), this.normalizedResult = p, this.textPosition = Cn([l, u]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class ts extends je {
  constructor(l, u, h, c, m, p, g) {
    super();
    const x = m[0] * h / (m[0] + m[1]), P = m[0] * m[1] > 0;
    if (this.text = new St(`${m[0].toFixed(4)}`), this.text2 = new St(`${(m[1] * -1).toFixed(4)}`), this.normalizedResult = p, this.textPosition = vo(l, u), this.text2Position = vo(u, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), P) {
      const A = new Pn().moveTo(0, 0).lineTo(0, p[0]).lineTo(x, 0).lineTo(0, 0), M = new Pn().moveTo(x, 0).lineTo(h, -p[1]).lineTo(h, 0).lineTo(x, 0), te = A.getPoints(), ae = M.getPoints(), de = new Me().setFromPoints(te), se = new Me().setFromPoints(ae), E = new ct({ color: an().resultOutline });
      this.lines = new _t(de, E), this.lines2 = new _t(se, E), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), g && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ie = new Zn(A), J = new Zn(M), be = new it({ color: p[0] > 0 ? 24435 : 11411474, side: kt }), ye = new it({ color: -p[1] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(ie, be), this.mesh2 = new et(J, ye), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), g && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const A = new Pn().moveTo(0, 0).lineTo(0, p[0]).lineTo(h, -p[1]).lineTo(h, 0).lineTo(0, 0), M = A.getPoints(), te = new Me().setFromPoints(M);
      this.lines = new _t(te, new ct({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ae = new Zn(A), de = new it({ color: p[0] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(ae, de), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(l) {
    var _a2, _b;
    this.lines.scale.set(1, l * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text2.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * l), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var hs = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(hs || {});
function fa(e, l, u, h) {
  const c = new je(), m = { normals: Xn, shearsY: Xn, shearsZ: Xn, torsions: Xn, bendingsY: ts, bendingsZ: ts };
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, u.val, l.frameResults.val == "none") return;
    c.children.forEach((g) => g.dispose()), c.clear();
    const p = hs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[p]) == null ? void 0 : _b.forEach((g, x) => {
      var _a3, _b2;
      const P = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[x]) ?? [0, 1], A = u.rawVal[P[0]], M = u.rawVal[P[1]];
      if (!A || !M) return;
      const te = new _(...M).distanceTo(new _(...A)), ae = ha((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[p]), de = g == null ? void 0 : g.map((J) => J / (ae === 0 ? 1 : ae)), se = Gn(A, M), E = new m[p](A, M, te, se, g ?? [0, 0], de ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(p)), ie = 0.05 * l.gridSize.rawVal;
      E.updateScale(ie * h.rawVal), c.add(E);
    });
  }), K.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    const p = 0.05 * l.gridSize.val;
    c.children.forEach((g) => g.updateScale(p * h.rawVal));
  }), K.derive(() => {
    c.visible = l.frameResults.val != "none";
  }), c;
}
function ha(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((u) => {
    const h = Math.max(...u ?? [0, 0]);
    h > l && (l = h);
  }), l;
}
class ma extends je {
  constructor(l, u, h) {
    super();
    const c = u === So.reactions;
    h[0] && (this.xText1 = new St(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new St(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new St(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new St(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new St(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new St(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new sn(new _(1, 0, 0), new _(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new sn(new _(0, 1, 0), new _(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new sn(new _(0, 0, 1), new _(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(l) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(l, l, l), (_b = this.yArrow) == null ? void 0 : _b.scale.set(l, l, l), (_c = this.zArrow) == null ? void 0 : _c.scale.set(l, l, l), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * l, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * l, 0, 0.5 * l), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * l, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * l, 0.5 * l), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * l), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * l + 0.5 * l), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * l), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * l), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * l), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * l), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * l), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var So = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(So || {});
function wa(e, l, u, h) {
  const c = new je();
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((g) => g.dispose()), c.clear();
    const m = So[l.nodeResults.rawVal], p = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[m]) == null ? void 0 : _b.forEach((g, x) => {
      const P = new ma(u.rawVal[x], m, g ?? [0, 0, 0, 0, 0, 0]);
      P.updateScale(p * h.rawVal), c.add(P);
    });
  }), K.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const m = 0.05 * l.gridSize.val;
    c.children.forEach((p) => p.updateScale(m * h.rawVal));
  }), K.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function ya({ drawingObj: e, gridObj: l, scene: u, getActiveCamera: h, controls: c, gridSize: m, derivedDisplayScale: p, rendererElm: g, viewerRender: x }) {
  const P = new Xs(), A = new Ns(), M = (t) => {
    const o = g.getBoundingClientRect(), a = t.clientX - o.left, n = t.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = s / 2;
      if (a >= f) return A.x = (a - f) / f * 2 - 1, A.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      A.x = a / f * 2 - 1;
    } else A.x = a / s * 2 - 1;
    return A.y = -(n / i) * 2 + 1, h();
  }, te = new et(new en(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
  te.visible = true, te.frustumCulled = false, u.add(te);
  const ae = (t, o, a) => {
    const n = new et(new en(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, a), n.visible = false, n.frustumCulled = false, u.add(n), n;
  }, de = ae(Math.PI / 2, 0, 0), se = ae(0, Math.PI / 2, 0);
  let E = false;
  const ie = () => {
    if (E) return P.intersectObjects([te], false);
    if (de.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ce.visible) {
      const a = P.intersectObjects([Ce, Ne, Le], false);
      if (a.length > 0) return a;
    }
    const o = [te];
    return de.visible && o.push(de), se.visible && o.push(se), qt.visible && Ht.length > 0 && o.push(...Ht), P.intersectObjects(o, false);
  }, J = new Yn(new Me(), new Un()), be = new Yn(new Me(), new Un({ color: "gray", sizeAttenuation: false, size: 6 })), ye = new Yn(new Me(), new Un({ color: "orange", sizeAttenuation: false, size: 5 }));
  u.add(ye);
  const Y = document.createElement("input");
  Y.id = "hk-rubber-label", Y.type = "text", Y.spellcheck = false, Y.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Y.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(Y);
  let B = null, Z = null, $ = false;
  const T = new _(), U = (t, o, a, n, s, i) => {
    const r = n - t, f = s - o, y = i - a, w = Math.hypot(r, f, y);
    if (w < 0.01) {
      Y.style.display = "none";
      return;
    }
    B = [t, o, a], Z = [r / w, f / w, y / w], T.set((t + n) / 2, (o + s) / 2, (a + i) / 2), T.project(h());
    const b = g.getBoundingClientRect(), C = b.left + (T.x * 0.5 + 0.5) * b.width, d = b.top + (-T.y * 0.5 + 0.5) * b.height;
    if (Y.style.left = C + "px", Y.style.top = d + "px", Y.style.display = "block", !$) {
      if (Y.value = `${w.toFixed(2)} m`, document.activeElement !== Y) {
        const V = document.activeElement;
        V && (V.tagName === "INPUT" || V.tagName === "TEXTAREA") && V !== Y || Y.focus({ preventScroll: true });
      }
      try {
        Y.select();
      } catch {
      }
    }
  }, X = () => {
    Y.style.display = "none", B = null, Z = null, $ = false, document.activeElement === Y && Y.blur();
  }, L = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      nn = t, ne(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), Y.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Te.length === 1) {
      const b = Te[0];
      Te = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, b[0], b[1], b[2], t), ne(`\u2713 C\xEDrculo r=${t} m en (${b[0].toFixed(2)}, ${b[1].toFixed(2)}, ${b[2].toFixed(2)}).`);
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
      mt = t, ne(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), Y.blur();
      return;
    }
    if (!B || !Z || !e.polylines) return;
    let a = Z[0], n = Z[1], s = Z[2];
    Ie === "x" ? (a = Math.sign(a) || 1, n = 0, s = 0) : Ie === "y" ? (a = 0, n = Math.sign(n) || 1, s = 0) : Ie === "z" && (a = 0, n = 0, s = Math.sign(s) || 1);
    const i = B[0] + a * t, r = B[1] + n * t, f = B[2] + s * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, f]];
    const y = e.polylines.rawVal, w = y.length ? y[y.length - 1] : [];
    e.polylines.val = [...y.slice(0, -1), [...w, e.points.rawVal.length - 1]], Y.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    x();
  }, j = (t) => {
    let o = t.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const a = o.startsWith("@");
    if (a && (o = o.slice(1)), o.includes("<")) {
      const s = o.split("<").map((i) => parseFloat(i.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [i, r] = s;
        return a ? { kind: "relPolar", L: i, ang: r } : { kind: "absPolar", L: i, ang: r };
      }
      if (s.length === 3 && a) {
        const [i, r, f] = s;
        return { kind: "relSpherical", L: i, az: r, el: f };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((y) => parseFloat(y.trim()));
      if (s.some(isNaN)) return null;
      const [i, r, f = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: r, dz: f } : { kind: "absCart", x: i, y: r, z: f };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, ue = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return B ? [B[0] + t.dx, B[1] + t.dy, B[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!B) return null;
      const o = t.ang * Math.PI / 180;
      return [B[0] + t.L * Math.cos(o), B[1] + t.L * Math.sin(o), B[2]];
    }
    if (t.kind === "relSpherical") {
      if (!B) return null;
      const o = t.az * Math.PI / 180, a = t.el * Math.PI / 180, n = t.L * Math.cos(a);
      return [B[0] + n * Math.cos(o), B[1] + n * Math.sin(o), B[2] + t.L * Math.sin(a)];
    }
    return null;
  }, re = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], B = t, Y.blur();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (t) => {
    var _a2;
    const o = j(t);
    if (!o) return false;
    if (o.kind === "length") return L(o.L), true;
    const a = ue(o);
    if (!a) return false;
    Xo(new _(a[0], a[1], a[2]), null), B = a, Y.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, Y.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const a = j(Y.value);
      if (!a) return;
      if ($ = false, a.kind === "length") L(a.L), ne(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = ue(a);
        if (!n) return;
        re(n);
        const s = a.kind;
        ne(`\u270F ${s} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), $ = false, Y.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!$ && Y.style.display === "block") try {
          Y.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && ($ = true);
  }), window.addEventListener("keydown", (t) => {
    if (!B || !Z || document.activeElement === Y) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (Y.value = t.key, Y.focus(), Y.setSelectionRange(1, 1), t.preventDefault());
  });
  const oe = document.createElement("div");
  oe.id = "hk-coord-readout", oe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", oe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(oe);
  const R = document.createElement("div");
  R.id = "hk-coord-fixed", R.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", R.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(R);
  const pe = new _t(new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), new Sn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", u.add(pe), window.__hekatanRubberBand = pe;
  const G = new _t(new Me(), new ct({ color: 2282478, transparent: true, opacity: 0.9 }));
  G.frustumCulled = false, G.visible = false, u.add(G);
  let fe = [];
  const he = new je(), $e = new et(new en(1, 1), new it({ color: 2282478, transparent: true, opacity: 0.08, side: kt, depthWrite: false })), _e = new Kt(new Go(new en(1, 1)), new ct({ color: 2282478, transparent: true, opacity: 0.85 })), Be = new Kt(new Me(), new ct({ color: 2282478, transparent: true, opacity: 0.3 })), Oe = (t, o) => {
    const a = [], n = Math.ceil(t / o);
    for (let s = -n; s <= n; s++) {
      const i = s * o;
      a.push(-t, i, 0, t, i, 0), a.push(i, -t, 0, i, t, 0);
    }
    Be.geometry.dispose(), Be.geometry = new Me(), Be.geometry.setAttribute("position", new vt(a, 3));
  };
  he.add($e, _e, Be), he.visible = false, he.frustumCulled = false, u.add(he);
  const ut = new je();
  ut.frustumCulled = false, ut.visible = false, u.add(ut);
  const Ft = (t) => {
    const o = new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), a = new Sn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new _t(o, a);
  }, k = Ft(16711680), I = Ft(65280), H = Ft(35071);
  ut.add(k, I, H);
  const N = (t) => {
    const o = new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0), new _(0, 0, 0), new _(0, 0, 0)]), a = new ct({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new ls(o, a);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, ce = N(3462041), me = N(16724804), xe = N(6333946), ge = new je();
  ge.frustumCulled = false, ge.visible = false, u.add(ge), ge.add(ce, me, xe);
  const Xe = (t) => {
    const o = new en(1, 1), a = new it({ color: t, transparent: true, opacity: 0.06, side: kt, depthWrite: false }), n = new et(o, a);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ce = Xe(3462041), Ne = Xe(16724804), Le = Xe(6333946);
  ge.add(Ce, Ne, Le);
  const Ze = (t, o, a, n) => {
    t.scale.set(2 * n, 2 * n, 1), a === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : a === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, lt = document.createElement("div");
  lt.id = "hk-refplane-badge", lt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(lt), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, ge.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      ot(ce, i, "xy", r), ot(me, i, "xz", r), ot(xe, i, "yz", r), Ze(Ce, i, "xy", r), Ze(Ne, i, "xz", r), Ze(Le, i, "yz", r), Ce.material.opacity = 0.05, Ne.material.opacity = 0.05, Le.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    x();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !ge.visible) {
      x();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0];
    ot(ce, i, "xy", t), ot(me, i, "xz", t), ot(xe, i, "yz", t), Ze(Ce, i, "xy", t), Ze(Ne, i, "xz", t), Ze(Le, i, "yz", t), x();
  };
  const We = (t) => {
    if (Ce.material.opacity = t === "xy" ? 0.09 : 0.025, Ne.material.opacity = t === "xz" ? 0.09 : 0.025, Le.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      lt.style.background = s.bg, lt.style.color = s.text, lt.textContent = `\u25A6 Plano ${t.toUpperCase()}`, lt.style.display = "block";
    } else lt.style.display = "none";
  }, ot = (t, o, a, n) => {
    let s;
    a === "xy" ? s = [new _(o[0] - n, o[1] - n, o[2]), new _(o[0] + n, o[1] - n, o[2]), new _(o[0] + n, o[1] + n, o[2]), new _(o[0] - n, o[1] + n, o[2]), new _(o[0] - n, o[1] - n, o[2])] : a === "xz" ? s = [new _(o[0] - n, o[1], o[2] - n), new _(o[0] + n, o[1], o[2] - n), new _(o[0] + n, o[1], o[2] + n), new _(o[0] - n, o[1], o[2] + n), new _(o[0] - n, o[1], o[2] - n)] : s = [new _(o[0], o[1] - n, o[2] - n), new _(o[0], o[1] + n, o[2] - n), new _(o[0], o[1] + n, o[2] + n), new _(o[0], o[1] - n, o[2] + n), new _(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(s);
  };
  let Ie = null;
  window.__hekatanAxisLock = () => Ie;
  let Jt = null;
  const qe = document.createElement("div");
  qe.id = "hk-axis-lock-badge", qe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(qe);
  const Gt = () => {
    if (!Ie) {
      qe.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    qe.style.background = "rgba(15,23,42,0.92)", qe.style.color = t[Ie], qe.style.border = `1.5px solid ${t[Ie]}`, qe.textContent = `\u{1F512} LOCK ${Ie.toUpperCase()}`, qe.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== Y) return;
    const a = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && fe.length >= 3) {
      const s = un();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Ie = Ie === a ? null : a, Gt(), t.preventDefault();
    else if (t.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Io(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Ln(), ne(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (ut.visible = false), ne(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a2;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const t = window.__hekatanOrthoMode;
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = t ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = t ? "block" : "none";
    }
  };
  const Bt = new _(), Ge = new _(), Ye = new _(), ze = (t) => {
    if (!Ie) return null;
    const o = t[0], a = t[1], n = t[2];
    return Ie === "x" ? (Bt.set(o - 1e4, a, n), Ge.set(o + 1e4, a, n)) : Ie === "y" ? (Bt.set(o, a - 1e4, n), Ge.set(o, a + 1e4, n)) : (Bt.set(o, a, n - 1e4), Ge.set(o, a, n + 1e4)), P.ray.distanceSqToSegment(Bt, Ge, null, Ye), Ye;
  };
  window.__hekatanProjectOnAxis = ze;
  const Ae = new _t(new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), new ct({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Ae.renderOrder = 998, Ae.frustumCulled = false, Ae.visible = false, u.add(Ae);
  let ve = -1, Je = -1, Qe = -1;
  const Se = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Se;
  const De = new _t(new Me().setFromPoints([new _(), new _()]), new ct({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  De.renderOrder = 997, De.frustumCulled = false, De.visible = false, u.add(De);
  const Ue = new et(new xn(0.02, 12, 12), new it({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Ue.renderOrder = 998, Ue.visible = false, u.add(Ue);
  const yt = (t) => {
    const o = h();
    if (o.isOrthographicCamera) {
      const n = o, s = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(t);
    return Math.max(0.05, a / 10);
  }, Pt = () => {
    Ue.visible && Ue.scale.setScalar(yt(Ue.position));
  }, Ct = new je();
  Ct.frustumCulled = false, u.add(Ct);
  const Yt = 2282478;
  let ht = null;
  const At = (t, o, a, n) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, r = n;
    for (let f = 0; f < s.length; f++) {
      const y = s[f];
      if (!y) continue;
      const w = Math.hypot(t - y[0], o - y[1], a - y[2]);
      w < r && (r = w, i = f);
    }
    return i;
  }, Mt = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Ct.children.length; ) {
      const r = Ct.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of Se) {
      const [f, ...y] = r.split(":");
      if (f === "pt") {
        const w = t[+y[0]];
        if (!w) continue;
        const b = new et(new xn(0.025, 12, 12), new it({ color: Yt, transparent: true, opacity: 0.9, depthTest: false }));
        b.position.set(w[0], w[1], w[2]), b.renderOrder = 999, b.__isSelectionPt = true, Ct.add(b);
      } else if (f === "seg") {
        const w = o[+y[0]], b = t[w == null ? void 0 : w[+y[1]]], C = t[w == null ? void 0 : w[+y[1] + 1]];
        if (!b || !C) continue;
        const d = new Me().setFromPoints([new _(b[0], b[1], b[2]), new _(C[0], C[1], C[2])]), V = new _t(d, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        V.renderOrder = 999, Ct.add(V);
      } else if (f === "poly") {
        const b = o[+y[0]].map((V) => {
          const ee = t[V];
          return ee ? new _(ee[0], ee[1], ee[2]) : null;
        }).filter(Boolean);
        if (b.length < 2) continue;
        const C = new Me().setFromPoints(b), d = new _t(C, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        d.renderOrder = 999, Ct.add(d);
      } else if (f === "aux") {
        const w = n[+y[0]];
        if (!w || w.length !== 6) continue;
        const b = new Me().setFromPoints([new _(w[0], w[1], w[2]), new _(w[3], w[4], w[5])]), C = new _t(b, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        C.renderOrder = 999, Ct.add(C);
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
    x();
  };
  window.__hekatanRefreshSelection = Mt, window.__hekatanClearSelection = () => {
    Se.clear(), Mt();
  };
  const Ot = (t, o, a, n, s, i, r, f, y) => {
    const w = r - n, b = f - s, C = y - i, d = w * w + b * b + C * C;
    if (d < 1e-12) return Math.hypot(t - n, o - s, a - i);
    let V = ((t - n) * w + (o - s) * b + (a - i) * C) / d;
    V = Math.max(0, Math.min(1, V));
    const ee = n + V * w, S = s + V * b, z = i + V * C;
    return Math.hypot(t - ee, o - S, a - z);
  }, ln = (t, o, a, n) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, f = -1, y = n;
    for (let w = 0; w < s.length; w++) {
      const b = s[w];
      for (let C = 0; C < b.length - 1; C++) {
        const d = i[b[C]], V = i[b[C + 1]];
        if (!d || !V) continue;
        const ee = Ot(t, o, a, d[0], d[1], d[2], V[0], V[1], V[2]);
        ee < y && (y = ee, r = w, f = C);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: f, dist: y } : null;
  }, rn = (t, o, a, n) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let r = -1, f = n;
    for (let y = 0; y < i.length; y++) {
      const w = i[y];
      if (!w || w.length !== 6) continue;
      const b = Ot(t, o, a, w[0], w[1], w[2], w[3], w[4], w[5]);
      b < f && (f = b, r = y);
    }
    return r;
  }, cn = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      Ae.visible = false;
      return;
    }
    Ae.geometry.setFromPoints([new _(n[0], n[1], n[2]), new _(n[3], n[4], n[5])]), Ae.visible = true;
  }, Hn = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!a || a.length < 2) {
      Ae.visible = false;
      return;
    }
    const s = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const r of a) {
      const f = n[r];
      f && i.push(new _(f[0], f[1], f[2]));
    }
    else {
      const r = n[a[o]], f = n[a[o + 1]];
      r && i.push(new _(r[0], r[1], r[2])), f && i.push(new _(f[0], f[1], f[2]));
    }
    Ae.geometry.setFromPoints(i), Ae.visible = true;
  }, dn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const a = o.filter((y, w) => w !== t), n = /* @__PURE__ */ new Set();
    for (const y of a) for (const w of y) n.add(w);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let y = 0; y < s.length; y++) n.has(y) && (i.set(y, r.length), r.push(s[y]));
    const f = a.map((y) => y.map((w) => i.get(w)).filter((w) => w !== void 0));
    e.points.val = r, e.polylines.val = f, e.areas && (e.areas.val = e.areas.rawVal.filter((y) => y !== t).map((y) => y > t ? y - 1 : y)), Ae.visible = false, ve = -1, Je = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, Fn = (t, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (t < 0 || t >= a.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false) {
      dn(t);
      return;
    }
    const s = a[t];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      dn(t);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const r = [...a.slice(0, t), ...i, ...a.slice(t + 1)], f = /* @__PURE__ */ new Set();
    for (const d of r) for (const V of d) f.add(V);
    const y = e.points.rawVal, w = /* @__PURE__ */ new Map(), b = [];
    for (let d = 0; d < y.length; d++) f.has(d) && (w.set(d, b.length), b.push(y[d]));
    const C = r.map((d) => d.map((V) => w.get(V)).filter((V) => V !== void 0));
    if (e.points.val = b, e.polylines.val = C, e.areas) {
      const d = i.length - 1;
      e.areas.val = e.areas.rawVal.map((V) => V > t ? V + d : V);
    }
    Ae.visible = false, ve = -1, Je = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  J.geometry.setAttribute("position", new vt(e.points.rawVal.flat(), 3)), J.geometry.computeBoundingSphere(), J.frustumCulled = false, be.frustumCulled = false, u.add(be), te.position.set(0, 0, 0), te.rotateX(Math.PI / 2), te.geometry.rotateX(Math.PI / 2), te.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, a) => {
    if (e.points.val = [...e.points.rawVal, [t, o, a]], e.polylines) {
      const n = e.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
      e.polylines.val = [...n.slice(0, -1), [...s, e.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a2;
    if (!e.polylines) return;
    const t = e.polylines.rawVal;
    ((_a2 = t[t.length - 1]) == null ? void 0 : _a2.length) !== 0 && (e.polylines.val = [...t, []]);
  };
  const pn = [];
  window.__hekatanCirculos = pn;
  let An = [], gn = "";
  const En = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${t.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === gn) return An;
    gn = a;
    const n = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const r = s.slice(0, i - 1).map((b) => t[b]).filter(Boolean);
      if (r.length < 5) continue;
      const f = [0, 1, 2].map((b) => r.reduce((C, d) => C + d[b], 0) / r.length), y = r.map((b) => Math.hypot(b[0] - f[0], b[1] - f[1], b[2] - f[2])), w = y.reduce((b, C) => b + C, 0) / y.length;
      w < 1e-9 || y.some((b) => Math.abs(b - w) > 5e-3 * w) || n.push({ c: f, r: w });
    }
    return An = n;
  };
  window.__hekatanCentrosDeducidos = En, window.__hekatanDrawCircle = (t, o, a, n, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(s)), f = e.points.rawVal.length, y = [];
    for (let w = 0; w < r; w++) {
      const b = 2 * Math.PI * w / r, C = n * Math.cos(b), d = n * Math.sin(b);
      let V;
      i === "xy" ? V = [t + C, o + d, a] : i === "xz" ? V = [t + C, o, a + d] : V = [t, o + C, a + d], y.push(V);
    }
    if (e.points.val = [...e.points.rawVal, ...y], pn.push({ c: [t, o, a], r: n }), e.polylines) {
      const w = [...y.map((C, d) => f + d), f], b = e.polylines.rawVal;
      ((_a2 = b[b.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...b, w, []] : e.polylines.val = [...b.slice(0, -1), w, []];
    }
  }, window.__hekatanDrawArc = (t, o, a, n = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(n)), i = new _(...t), r = new _(...o), f = new _(...a), y = new _().subVectors(r, i), w = new _().subVectors(f, i), b = new _().crossVectors(y, w).normalize(), C = new _().addVectors(i, r).multiplyScalar(0.5), d = new _().addVectors(r, f).multiplyScalar(0.5), V = new _().crossVectors(y, b).normalize(), ee = new _().crossVectors(new _().subVectors(f, r), b).normalize(), S = new _().subVectors(d, C), z = V.x * ee.y - V.y * ee.x;
    let v;
    if (Math.abs(z) > 1e-9) {
      const ke = (S.x * ee.y - S.y * ee.x) / z;
      v = new _().addVectors(C, V.clone().multiplyScalar(ke));
    } else v = C.clone();
    const F = i.distanceTo(v), q = new _().subVectors(i, v), D = new _().subVectors(f, v), le = Math.acos(Math.max(-1, Math.min(1, q.dot(D) / (F * F)))), Q = e.points.rawVal.length, W = [], Ee = b.clone();
    for (let ke = 0; ke <= s; ke++) {
      const Fe = ke / s, Re = le * Fe, Ke = new mo().setFromAxisAngle(Ee, Re), tt = q.clone().applyQuaternion(Ke).add(v);
      W.push([tt.x, tt.y, tt.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...W], pn.push({ c: [v.x, v.y, v.z], r: F }), e.polylines) {
      const ke = W.map((Re, Ke) => Q + Ke), Fe = e.polylines.rawVal;
      e.polylines.val = [...Fe.slice(0, -1), ke, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, a = 1, n = 6, s = 6) => {
    const i = Math.min(t[0], o[0]), r = Math.max(t[0], o[0]), f = Math.min(t[1], o[1]), y = Math.max(t[1], o[1]), w = (t[2] + o[2]) / 2, b = r - i, C = y - f, d = Math.min(a, b / 2 - 0.01, C / 2 - 0.01);
    if (d <= 0) return;
    const V = e.points.rawVal.length, ee = [], S = [], z = (v, F) => {
      ee.push([v, F, w]), S.push(V + ee.length - 1);
    };
    for (let v = 0; v <= s; v++) z(i + d + (b - 2 * d) * v / s, f);
    for (let v = 1; v <= n; v++) {
      const F = -Math.PI / 2 + Math.PI / 2 * v / n;
      z(r - d + d * Math.cos(F), f + d + d * Math.sin(F));
    }
    for (let v = 1; v <= s; v++) z(r, f + d + (C - 2 * d) * v / s);
    for (let v = 1; v <= n; v++) {
      const F = 0 + Math.PI / 2 * v / n;
      z(r - d + d * Math.cos(F), y - d + d * Math.sin(F));
    }
    for (let v = 1; v <= s; v++) z(r - d - (b - 2 * d) * v / s, y);
    for (let v = 1; v <= n; v++) {
      const F = Math.PI / 2 + Math.PI / 2 * v / n;
      z(i + d + d * Math.cos(F), y - d + d * Math.sin(F));
    }
    for (let v = 1; v <= s; v++) z(i, y - d - (C - 2 * d) * v / s);
    for (let v = 1; v <= n; v++) {
      const F = Math.PI + Math.PI / 2 * v / n;
      z(i + d + d * Math.cos(F), f + d + d * Math.sin(F));
    }
    if (S.push(V), e.points.val = [...e.points.rawVal, ...ee], e.polylines) {
      const v = e.polylines.rawVal;
      e.polylines.val = [...v.slice(0, -1), S, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], f = o[1], y = o[2];
    let w;
    if (Math.abs(i - y) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, f, i], [n, f, i]] : Math.abs(s - f) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, s, y], [n, s, y]] : w = [[n, s, i], [n, f, i], [n, f, y], [n, s, y]], e.points.val = [...e.points.rawVal, ...w], e.polylines) {
      const b = [a, a + 1, a + 2, a + 3, a], C = e.polylines.rawVal;
      e.polylines.val = [...C.slice(0, -1), b, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], f = o[1], y = o[2];
    let w;
    if (E && e.gridTarget) {
      const b = e.gridTarget.rawVal, C = new kn(...b.rotation), d = new _(1, 0, 0).applyEuler(C), V = new _(0, 1, 0).applyEuler(C), ee = new _(...b.position), S = new _(n, s, i), z = new _(r, f, y), v = S.clone().sub(ee).dot(d), F = S.clone().sub(ee).dot(V), q = z.clone().sub(ee).dot(d), D = z.clone().sub(ee).dot(V), le = (Q, W) => ee.clone().addScaledVector(d, Q).addScaledVector(V, W).toArray();
      w = [le(v, F), le(q, F), le(q, D), le(v, D)];
    } else Math.abs(i - y) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, f, i], [n, f, i]] : Math.abs(s - f) < 1e-6 ? w = [[n, s, i], [r, s, i], [r, s, y], [n, s, y]] : w = [[n, s, i], [n, f, i], [n, f, y], [n, s, y]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...w], e.polylines) {
      const b = e.polylines.rawVal, C = b.length - 1, d = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [...b.slice(0, -1), d, []], e.areas && (e.areas.val = [...e.areas.rawVal, C]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x();
  }, window.__hekatanMeshPolyArea = (t, o) => {
    var _a2;
    const a = t.length;
    if (a < 3) return 0;
    let n = 0, s = 0, i = 0;
    for (let we = 0; we < a; we++) {
      const Ve = t[we], nt = t[(we + 1) % a];
      n += (Ve[1] - nt[1]) * (Ve[2] + nt[2]), s += (Ve[2] - nt[2]) * (Ve[0] + nt[0]), i += (Ve[0] - nt[0]) * (Ve[1] + nt[1]);
    }
    const r = Math.hypot(n, s, i) || 1;
    n /= r, s /= r, i /= r;
    let f = t[1][0] - t[0][0], y = t[1][1] - t[0][1], w = t[1][2] - t[0][2];
    const b = Math.hypot(f, y, w) || 1;
    f /= b, y /= b, w /= b;
    let C = s * w - i * y, d = i * f - n * w, V = n * y - s * f;
    const ee = Math.hypot(C, d, V) || 1;
    C /= ee, d /= ee, V /= ee;
    const S = t[0], z = (we) => [(we[0] - S[0]) * f + (we[1] - S[1]) * y + (we[2] - S[2]) * w, (we[0] - S[0]) * C + (we[1] - S[1]) * d + (we[2] - S[2]) * V], v = (we, Ve) => [S[0] + we * f + Ve * C, S[1] + we * y + Ve * d, S[2] + we * w + Ve * V], F = t.map(z);
    let q = 1 / 0, D = -1 / 0, le = 1 / 0, Q = -1 / 0;
    for (const [we, Ve] of F) we < q && (q = we), we > D && (D = we), Ve < le && (le = Ve), Ve > Q && (Q = Ve);
    const W = D - q, Ee = Q - le;
    if (W < 1e-6 || Ee < 1e-6) return 0;
    let ke = o && o > 0 ? o : 0.5;
    for (; W / ke * (Ee / ke) > 2500; ) ke *= 2;
    ke = Math.min(ke, Math.min(W, Ee));
    const Fe = (we, Ve) => {
      let nt = false;
      for (let Tt = 0, $t = F.length - 1; Tt < F.length; $t = Tt++) {
        const [Nt, Wt] = F[Tt], [co, on] = F[$t];
        Wt > Ve != on > Ve && we < (co - Nt) * (Ve - Wt) / (on - Wt) + Nt && (nt = !nt);
      }
      return nt;
    }, Re = Math.max(1, Math.round(W / ke)), Ke = Math.max(1, Math.round(Ee / ke)), tt = W / Re, dt = Ee / Ke, rt = /* @__PURE__ */ new Map(), ft = [], Pe = e.points.rawVal.length, He = (we, Ve) => {
      const nt = we + "," + Ve, Tt = rt.get(nt);
      if (Tt !== void 0) return Tt;
      const $t = Pe + ft.length;
      return ft.push(v(q + we * tt, le + Ve * dt)), rt.set(nt, $t), $t;
    }, at = [];
    for (let we = 0; we < Re; we++) for (let Ve = 0; Ve < Ke; Ve++) {
      if (!Fe(q + (we + 0.5) * tt, le + (Ve + 0.5) * dt)) continue;
      const nt = He(we, Ve), Tt = He(we + 1, Ve), $t = He(we + 1, Ve + 1), Nt = He(we, Ve + 1);
      at.push([nt, Tt, $t, Nt]);
    }
    if (!at.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...ft], e.polylines && e.areas) {
      let we = e.polylines.rawVal.slice();
      we.length && we[we.length - 1].length === 0 && (we = we.slice(0, -1));
      const Ve = [];
      for (const nt of at) Ve.push(we.length), we.push([nt[0], nt[1], nt[2], nt[3], nt[0]]);
      we.push([]), e.polylines.val = we, e.areas.val = [...e.areas.rawVal, ...Ve];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), at.length;
  };
  const un = () => {
    if (fe.length < 3) return fe = [], G.visible = false, x(), 0;
    const t = window.__hekatanMeshPolyArea(fe.slice());
    return fe = [], G.visible = false, x(), t;
  };
  window.__hekatanFinalizePolyArea = un, window.__hekatanSetInclinedPlaneFrom3 = (t, o, a) => {
    var _a2;
    const n = new _(t[0], t[1], t[2]), s = new _(o[0], o[1], o[2]), i = new _(a[0], a[1], a[2]), r = new _().subVectors(s, n).cross(new _().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const f = new mo().setFromUnitVectors(new _(0, 0, 1), r), y = new kn().setFromQuaternion(f);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [y.x, y.y, y.z] }), E = true;
    const w = new _().addVectors(n, s).add(i).multiplyScalar(1 / 3), b = Math.max(n.distanceTo(s), n.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, C = b / 2;
    $e.geometry.dispose(), $e.geometry = new en(b, b), _e.geometry.dispose(), _e.geometry = new Go(new en(b, b)), Oe(C, 1), he.position.copy(w), he.quaternion.copy(f), he.scale.set(1, 1, 1), he.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] }), E = false, he.visible = false, x();
  };
  const Lt = new je();
  Lt.visible = false, u.add(Lt), window.__hekatanShowAxes = (t, o, a = 12, n = 2) => {
    var _a2, _b;
    for (; Lt.children.length; ) {
      const b = Lt.children.pop();
      (_a2 = b.geometry) == null ? void 0 : _a2.dispose(), (_b = b.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const s = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...t) - n, f = Math.max(...t) + n, y = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", w = (b, C, d, V, ee) => {
      const S = document.createElement("canvas");
      S.width = 64, S.height = 32;
      const z = S.getContext("2d");
      z.fillStyle = ee, z.font = "bold 22px sans-serif", z.textAlign = "center", z.fillText(b, 32, 26);
      const v = new Ho(S), F = new Wo({ map: v, transparent: true }), q = new Jo(F);
      return q.position.set(C, d, V), q.scale.set(1.2, 0.6, 1), q;
    };
    t.forEach((b, C) => {
      const d = C < y.length ? y[C] : `X${C}`, V = new Me().setFromPoints([new _(b, s, 0), new _(b, i, 0), new _(b, s, 0), new _(b, s, a)]), ee = new Sn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), S = new Kt(V, ee);
      S.computeLineDistances(), Lt.add(S), Lt.add(w(d, b, s - 0.5, 0, "#60a5fa")), Lt.add(w(d, b, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((b, C) => {
      const d = `${C + 1}`, V = new Me().setFromPoints([new _(r, b, 0), new _(f, b, 0), new _(r, b, 0), new _(r, b, a)]), ee = new Sn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), S = new Kt(V, ee);
      S.computeLineDistances(), Lt.add(S), Lt.add(w(d, r - 0.5, b, 0, "#fb7185")), Lt.add(w(d, f + 0.5, b, 0, "#fb7185"));
    }), Lt.visible = true, x();
  }, window.__hekatanHideAxes = () => {
    Lt.visible = false, x();
  };
  const qt = new je();
  qt.visible = false, u.add(qt);
  let Ht = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, a = 0, n = 0) => {
    var _a2, _b;
    for (; qt.children.length; ) {
      const i = qt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    Ht.forEach((i) => {
      u.remove(i), i.geometry.dispose(), i.material.dispose();
    }), Ht = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, r) => {
      const f = s[r % s.length], y = o / 2, w = [new _(a - y, n - y, i), new _(a + y, n - y, i), new _(a + y, n + y, i), new _(a - y, n + y, i), new _(a - y, n - y, i)], b = new Me().setFromPoints(w), C = new ct({ color: f, transparent: true, opacity: 0.55 });
      qt.add(new _t(b, C));
      const d = document.createElement("canvas");
      d.width = 128, d.height = 32;
      const V = d.getContext("2d");
      V.fillStyle = `#${f.toString(16).padStart(6, "0")}`, V.font = "bold 18px sans-serif", V.fillText(`Z = ${i} m`, 4, 22);
      const ee = new Ho(d), S = new Wo({ map: ee, transparent: true }), z = new Jo(S);
      z.position.set(a - y - 1.5, n - y - 1.5, i), z.scale.set(2.5, 0.6, 1), qt.add(z);
      const v = new en(1e4, 1e4), F = new it({ visible: false, side: kt }), q = new et(v, F);
      q.position.set(0, 0, i), q.frustumCulled = false, q.userData = { refPlaneZ: i }, u.add(q), Ht.push(q);
    }), qt.visible = true, x();
  }, window.__hekatanHideRefPlanes = () => {
    qt.visible = false, Ht.forEach((t) => {
      t.visible = false;
    }), x();
  };
  const Qt = new je();
  Qt.frustumCulled = false, u.add(Qt);
  const ms = () => {
    var _a2, _b, _c, _d;
    for (; Qt.children.length; ) {
      const a = Qt.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const n = new Me().setFromPoints([new _(a[0], a[1], a[2]), new _(a[3], a[4], a[5])]), s = new Sn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new _t(n, s);
      i.computeLineDistances(), Qt.add(i);
    }
  };
  K.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, ms(), x());
  });
  const fn = new je();
  fn.frustumCulled = false, u.add(fn);
  const ko = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const a = fn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const n = new et(new xn(0.025, 12, 12), new it({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(a[0], a[1], a[2]), n.renderOrder = 996, n.scale.setScalar(yt(n.position)), fn.add(n);
    }
  };
  K.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, ko(), x());
  }), c.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(yt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = ko;
  const xt = new je(), ws = new et(new xn(0.01, 12, 12), new it({ color: 16724804, transparent: true, opacity: 0.95 })), ys = new et(new xn(0.015, 12, 12), new it({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(ws, ys);
  const hn = 0.08, Wn = (t, o, a) => {
    const n = new Me().setFromPoints([new _(...t), new _(...o)]);
    return new _t(n, new ct({ color: a, transparent: true, opacity: 0.7 }));
  };
  xt.add(Wn([-hn, 0, 0], [hn, 0, 0], 16711680)), xt.add(Wn([0, -hn, 0], [0, hn, 0], 65280)), xt.add(Wn([0, 0, -hn], [0, 0, hn], 35071)), xt.visible = false, xt.frustumCulled = false, u.add(xt);
  let Jn = 2;
  const Tn = (t) => {
    const o = h(), a = (g == null ? void 0 : g.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, vn = () => {
    if (!xt.visible) return;
    const t = Jn * Tn(xt.position) / 0.015;
    xt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let On = 10;
  const Qn = (t) => Math.max(1e-4, On * Tn(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (On = t), On), window.__hekatanUpdateSnapScale = vn, window.__hekatanSnapMarker = xt, window.__hekatanMetrosPorPixel = Tn, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (Jn = t, vn(), x()), Jn);
  const Po = () => {
    Ct.children.length !== 0 && Ct.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(yt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Po, c.addEventListener("change", () => {
    var _a2;
    vn(), Ue.visible && Pt(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Po();
  }), window.__hekatanShowSnap = (t, o, a) => {
    xt.position.set(t, o, a), xt.visible = true, vn(), x();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, x();
  }, g.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q;
    const o = M(t);
    if (!o) return;
    P.setFromCamera(A, o);
    const a = ie();
    if (a.length) {
      const n = a[0].point, s = t.altKey, i = Qn(n), r = s ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i);
      if (r) Ao(r.type, r.x, r.y, r.z), xt.position.set(r.x, r.y, r.z), xt.visible = true, n.set(r.x, r.y, r.z);
      else {
        Ln();
        const C = !s && window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0.5;
        C && d > 0 && (n.x = Math.round(n.x / d) * d, n.y = Math.round(n.y / d) * d, n.z = Math.round(n.z / d) * d), xt.position.copy(n), xt.visible = true;
      }
      vn();
      const f = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (f === "select" || !f) {
        const C = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = At(n.x, n.y, n.z, C), V = ln(n.x, n.y, n.z, C), ee = rn(n.x, n.y, n.z, C);
        if (d >= 0) {
          const F = e.points.rawVal[d];
          Ue.position.set(F[0], F[1], F[2]), Ue.visible = true, Pt(), De.visible = false, ht = { kind: "pt", a: d };
        } else if (V) {
          const F = e.points.rawVal, q = e.polylines.rawVal[V.polyIdx], D = F[q[V.segIdx]], le = F[q[V.segIdx + 1]];
          De.geometry.setFromPoints([new _(D[0], D[1], D[2]), new _(le[0], le[1], le[2])]), De.visible = true, Ue.visible = false, ht = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(V.polyIdx)) ?? false ? { kind: "poly", a: V.polyIdx } : { kind: "seg", a: V.polyIdx, b: V.segIdx };
        } else if (ee >= 0) {
          const q = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[ee];
          q && (De.geometry.setFromPoints([new _(q[0], q[1], q[2]), new _(q[3], q[4], q[5])]), De.visible = true, Ue.visible = false, ht = { kind: "aux", a: ee });
        } else De.visible = false, Ue.visible = false, ht = null;
        oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
        let S = n;
        if ((ht == null ? void 0 : ht.kind) === "pt") {
          const F = e.points.rawVal[ht.a];
          F && (S = new _(F[0], F[1], F[2]));
        }
        const z = `X=${S.x.toFixed(2)} Y=${S.y.toFixed(2)} Z=${S.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [S.x, S.y, S.z], ht) {
          const F = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          oe.textContent = `${z}  \xB7  \u{1F5B1} Click \u2192 ${F[ht.kind]}`;
        } else oe.textContent = z;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = z), pe.visible = false, ut.visible = false, x();
        return;
      }
      if (f === "delete" || f === "trim" || f === "extend" || f === "offset") {
        const C = (window.__hekatanSnap2D ?? 0.5) * 1.5, d = ln(n.x, n.y, n.z, C), V = rn(n.x, n.y, n.z, C);
        let ee = false;
        if (V >= 0) if (!d) ee = true;
        else {
          const F = window.__hekatanDrawingAuxLines, D = ((F == null ? void 0 : F.rawVal) ?? (F == null ? void 0 : F.val) ?? F ?? [])[V];
          Ot(n.x, n.y, n.z, D[0], D[1], D[2], D[3], D[4], D[5]) < d.dist && (ee = true);
        }
        ee ? (Qe = V, ve = -1, Je = -1, cn(V)) : d ? (ve = d.polyIdx, Je = d.segIdx, Qe = -1, Hn(d.polyIdx, d.segIdx)) : (ve = -1, Je = -1, Qe = -1, Ae.visible = false), pe.visible = false, ut.visible = false, X(), oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
        const S = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let z = "";
        ee ? z = `\u{1F5D1} l\xEDnea aux #${Qe + 1}` : d ? z = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(d.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${d.polyIdx + 1}` : `\u{1F5D1} seg ${d.segIdx + 1} / poly #${d.polyIdx + 1}` : z = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", oe.textContent = `${S}  \xB7  ${z}`;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = S), x();
        return;
      } else Ae.visible = false, ve = -1, Qe = -1;
      oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
      const y = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], w = y[y.length - 1] ?? [], b = e.points.rawVal ?? [];
      if (w.length > 0 && b[w[w.length - 1]]) {
        const C = w[w.length - 1], d = b[C];
        let V = Ie;
        if (Jt = null, !V && window.__hekatanAxisSnap !== false) {
          const Re = g.getBoundingClientRect(), Ke = t.clientX, tt = t.clientY, dt = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, rt = new _(d[0], d[1], d[2]), ft = [["x", new _(1, 0, 0)], ["y", new _(0, 1, 0)], ["z", new _(0, 0, 1)]], Pe = (at) => {
            const we = at.clone().project(o);
            return { x: (we.x * 0.5 + 0.5) * Re.width + Re.left, y: (-we.y * 0.5 + 0.5) * Re.height + Re.top };
          };
          let He = null;
          for (const [at, we] of ft) {
            const Ve = Pe(rt.clone().addScaledVector(we, -dt)), nt = Pe(rt.clone().addScaledVector(we, dt)), Tt = nt.x - Ve.x, $t = nt.y - Ve.y, Nt = Ke - Ve.x, Wt = tt - Ve.y, co = Tt * Tt + $t * $t || 1;
            let on = (Nt * Tt + Wt * $t) / co;
            on = Math.max(0, Math.min(1, on));
            const No = Math.hypot(Ke - (Ve.x + on * Tt), tt - (Ve.y + on * $t));
            if (He === null || No < He.dpx) {
              const po = P.ray, Yo = rt.clone().sub(po.origin), uo = we.dot(po.direction), Uo = we.dot(Yo), Fs = po.direction.dot(Yo), Zo = 1 - uo * uo, As = Math.abs(Zo) < 1e-6 ? -Uo : (uo * Fs - Uo) / Zo;
              He = { axis: at, dpx: No, pt: rt.clone().addScaledVector(we, As) };
            }
          }
          He && He.dpx <= 12 && (n.copy(He.pt), V = He.axis, Jt = He.pt.clone());
        }
        const ee = !!window.__hekatanOrthoMode;
        if (!V && ee) {
          const Re = Math.abs(n.x - d[0]), Ke = Math.abs(n.y - d[1]), tt = Math.abs(n.z - d[2]), dt = (_l = a[0]) == null ? void 0 : _l.object;
          let rt = null;
          dt === Ce ? rt = "xy" : dt === Ne ? rt = "xz" : dt === Le && (rt = "yz"), rt === "xy" ? V = Re >= Ke ? "x" : "y" : rt === "xz" ? V = Re >= tt ? "x" : "z" : rt === "yz" ? V = Ke >= tt ? "y" : "z" : V = Re >= Ke && Re >= tt ? "x" : Ke >= tt ? "y" : "z";
        }
        const S = window.__hekatanPolarTrack !== false;
        if (!V && S) {
          const Re = n.x - d[0], Ke = n.y - d[1], tt = n.z - d[2], dt = Math.hypot(Re, Ke, tt);
          if (dt > 1e-3) {
            const ft = Math.tan(6 * Math.PI / 180) * dt, Pe = Math.hypot(Ke, tt), He = Math.hypot(Re, tt), at = Math.hypot(Re, Ke), we = [["x", Pe], ["y", He], ["z", at]];
            we.sort((Ve, nt) => Ve[1] - nt[1]), we[0][1] <= ft && (V = we[0][0]);
          }
        }
        if (V) {
          const Re = d[0], Ke = d[1], tt = d[2];
          V === "x" ? n.set(n.x, Ke, tt) : V === "y" ? n.set(Re, n.y, tt) : n.set(Re, Ke, n.z);
          const dt = !!Ie, ft = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[V];
          qe.style.background = "rgba(15,23,42,0.92)", qe.style.color = ft, qe.style.border = `1.5px solid ${ft}`;
          const Pe = (_m = a[0]) == null ? void 0 : _m.object;
          let He = null;
          Pe === Ce ? He = "xy" : Pe === Ne ? He = "xz" : Pe === Le && (He = "yz");
          const at = He ? ` (plano ${He.toUpperCase()})` : "";
          qe.textContent = dt ? `\u{1F512} LOCK ${V.toUpperCase()}${at}` : `\u22A5 ORTO ${V.toUpperCase()}${at}`, qe.style.left = t.clientX + 20 + "px", qe.style.top = t.clientY + 18 + "px", qe.style.transform = "none", qe.style.display = "block";
        } else Ie || (qe.style.display = "none");
        const z = Math.hypot(n.x - d[0], n.y - d[1], n.z - d[2]), v = Math.atan2(n.y - d[1], n.x - d[0]) * 180 / Math.PI, F = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        oe.textContent = `${F} | \u0394L=${z.toFixed(2)}m ${v.toFixed(0)}\xB0`;
        const q = document.getElementById("hk-coord-fixed");
        q && (q.textContent = F), pe.geometry.setFromPoints([new _(d[0], d[1], d[2]), new _(n.x, n.y, n.z)]), (_n2 = pe.computeLineDistances) == null ? void 0 : _n2.call(pe), pe.visible = true, U(d[0], d[1], d[2], n.x, n.y, n.z);
        const D = window.__hekatanOrthoExt ?? 8, le = window.__hekatanShowOrthoPlanes !== false;
        ge.visible = le, le || We(null), le && (ot(ce, d, "xy", D), ot(me, d, "xz", D), ot(xe, d, "yz", D), Ze(Ce, d, "xy", D), Ze(Ne, d, "xz", D), Ze(Le, d, "yz", D));
        const Q = le ? P.intersectObjects([Ce, Ne, Le], false) : [];
        let W = null;
        if (Q.length > 0) {
          const Re = Q[0].object;
          Re === Ce ? W = "xy" : Re === Ne ? W = "xz" : Re === Le && (W = "yz");
        }
        We(W), W && (lt.style.left = t.clientX + "px", lt.style.top = t.clientY + "px"), k.geometry.setFromPoints([new _(d[0] - D, d[1], d[2]), new _(d[0] + D, d[1], d[2])]), (_o2 = k.computeLineDistances) == null ? void 0 : _o2.call(k), I.geometry.setFromPoints([new _(d[0], d[1] - D, d[2]), new _(d[0], d[1] + D, d[2])]), (_p = I.computeLineDistances) == null ? void 0 : _p.call(I), H.geometry.setFromPoints([new _(d[0], d[1], d[2] - D), new _(d[0], d[1], d[2] + D)]), (_q = H.computeLineDistances) == null ? void 0 : _q.call(H), ut.visible = true;
        const Ee = k.material, ke = I.material, Fe = H.material;
        V === "x" ? (Ee.opacity = 0.95, ke.opacity = 0.1, Fe.opacity = 0.1) : V === "y" ? (Ee.opacity = 0.1, ke.opacity = 0.95, Fe.opacity = 0.1) : V === "z" ? (Ee.opacity = 0.1, ke.opacity = 0.1, Fe.opacity = 0.95) : (Ee.opacity = 0.5, ke.opacity = 0.5, Fe.opacity = 0.5);
      } else {
        const C = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        oe.textContent = C;
        const d = document.getElementById("hk-coord-fixed");
        if (d && (d.textContent = C), pe.visible = false, ut.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(f)) {
          if (B = null, Z = null, Y.style.left = t.clientX + 20 + "px", Y.style.top = t.clientY - 28 + "px", Y.style.display = "block", !$) {
            Y.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const ee = document.activeElement;
            !(ee && (ee.tagName === "INPUT" || ee.tagName === "TEXTAREA") && ee !== Y) && document.activeElement !== Y && Y.focus({ preventScroll: true });
            try {
              Y.select();
            } catch {
            }
          }
        } else X();
      }
      x();
    } else Ln(), oe.style.display = "none", xt.visible = false, pe.visible = false, ut.visible = false, X(), x();
  }), K.derive(() => {
    if (!e.gridTarget) return;
    xa(l, { position: new _(...e.gridTarget.val.position), quaternion: new mo().setFromEuler(new kn(...e.gridTarget.val.rotation)) }, x), te.position.set(...e.gridTarget.val.position), te.quaternion.setFromEuler(new kn(...e.gridTarget.val.rotation)), te.updateMatrixWorld();
    const t = new _(0, 0, 1).applyEuler(new kn(...e.gridTarget.val.rotation));
    E = !(Math.abs(t.x) > 0.999 || Math.abs(t.y) > 0.999 || Math.abs(t.z) > 0.999);
  }), K.derive(() => {
    J.geometry.setAttribute("position", new vt(e.points.val.flat(), 3)), J.geometry.computeBoundingSphere();
  }), K.derive(() => {
    const t = 0.05 * m * 0.5 * p.val;
    P.params.Points.threshold = 0.4 * t;
  }), K.derive(() => {
    var _a2;
    const t = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of a) {
      const [r, f, y] = t[i];
      n.push(r, f, y);
    }
    const s = new Me();
    s.setAttribute("position", new vt(n, 3)), ye.geometry.dispose(), ye.geometry = s;
  });
  let jn = false, tn = 0;
  g.addEventListener("pointerdown", () => {
    jn = true;
  }), g.addEventListener("pointerup", () => {
    jn = false;
  }), g.addEventListener("pointermove", () => {
    jn && tn++;
  });
  const Et = document.createElement("div");
  Et.id = "hk-window-select", Et.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Et);
  let Ut = null, Mn = false, It = null;
  const eo = (t, o, a, n, s) => {
    s ? (Et.style.borderColor = "#34d399", Et.style.borderStyle = "dashed", Et.style.background = "rgba(52, 211, 153, 0.10)") : (Et.style.borderColor = "#22d3ee", Et.style.borderStyle = "solid", Et.style.background = "rgba(34, 211, 238, 0.10)"), Et.style.left = Math.min(t, a) + "px", Et.style.top = Math.min(o, n) + "px", Et.style.width = Math.abs(a - t) + "px", Et.style.height = Math.abs(n - o) + "px", Et.style.display = "block";
  }, Co = (t, o, a, n, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, a), r = Math.max(t, a), f = Math.min(o, n), y = Math.max(o, n), w = a < t, b = g.getBoundingClientRect(), C = h();
    C.updateMatrixWorld();
    const d = (Q) => {
      const W = new _(Q[0], Q[1], Q[2]);
      return W.project(C), { x: b.left + (W.x * 0.5 + 0.5) * b.width, y: b.top + (-W.y * 0.5 + 0.5) * b.height };
    }, V = (Q) => Q.x >= i && Q.x <= r && Q.y >= f && Q.y <= y, ee = (Q, W) => !(Q.x < i && W.x < i || Q.x > r && W.x > r || Q.y < f && W.y < f || Q.y > y && W.y > y);
    s || Se.clear();
    let S = 0;
    const z = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let Q = 0; Q < z.length; Q++) {
      const W = z[Q];
      W && V(d(W)) && (Se.add(`pt:${Q}`), S++);
    }
    const v = (Q, W) => w ? V(Q) || V(W) || ee(Q, W) : V(Q) && V(W), F = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], q = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let Q = 0; Q < F.length; Q++) {
      const W = F[Q];
      if (q.includes(Q)) {
        let ke;
        if (!w) ke = W.every((Fe) => {
          const Re = z[Fe];
          return !!Re && V(d(Re));
        });
        else {
          ke = false;
          for (let Fe = 0; Fe < W.length - 1; Fe++) {
            const Re = z[W[Fe]], Ke = z[W[Fe + 1]];
            if (!(!Re || !Ke) && v(d(Re), d(Ke))) {
              ke = true;
              break;
            }
          }
        }
        ke && (Se.add(`poly:${Q}`), S++);
      } else for (let ke = 0; ke < W.length - 1; ke++) {
        const Fe = z[W[ke]], Re = z[W[ke + 1]];
        !Fe || !Re || v(d(Fe), d(Re)) && (Se.add(`seg:${Q}:${ke}`), S++);
      }
    }
    const le = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let Q = 0; Q < le.length; Q++) {
      const W = le[Q];
      if (!W || W.length !== 6) continue;
      const Ee = d([W[0], W[1], W[2]]), ke = d([W[3], W[4], W[5]]);
      v(Ee, ke) && (Se.add(`aux:${Q}`), S++);
    }
    Mt(), ne(`${w ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${S} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Se.size})`), Et.style.display = "none";
  }, Vn = () => {
    It && (It = null, Et.style.display = "none", ne("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Vn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && It && Vn();
  });
  const zo = () => {
    var _a2, _b, _c, _d;
    if (Se.size === 0) return false;
    const t = [...Se], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Set();
    for (const ee of t) {
      const [S, ...z] = ee.split(":");
      if (S === "pt") r.add(+z[0]);
      else if (S === "poly") f.add(+z[0]);
      else if (S === "seg") {
        const v = +z[0], F = +z[1];
        y.has(v) || y.set(v, /* @__PURE__ */ new Set()), y.get(v).add(F);
      } else S === "aux" && w.add(+z[0]);
    }
    let b = 0, C = [], d = [];
    const V = /* @__PURE__ */ new Map();
    for (let ee = 0; ee < a.length; ee++) {
      if (f.has(ee)) {
        b++;
        continue;
      }
      V.set(ee, C.length);
      const S = y.get(ee);
      if (S && S.size > 0) {
        let z = [];
        for (let v = 0; v < a[ee].length; v++) z.push(a[ee][v]), v < a[ee].length - 1 && S.has(v) && (z.length >= 2 && C.push(z), z = [], b++);
        (z.length >= 2 || z.length === 1) && C.push(z);
      } else C.push([...a[ee]]);
    }
    if (r.size > 0) {
      const ee = [], S = /* @__PURE__ */ new Map();
      for (let v = 0; v < o.length; v++) {
        if (r.has(v)) {
          b++;
          continue;
        }
        S.set(v, ee.length), ee.push([...o[v]]);
      }
      const z = [];
      for (const v of C) {
        let F = [];
        for (const q of v) {
          const D = S.get(q);
          D === void 0 ? (F.length >= 2 && z.push(F), F = []) : F.push(D);
        }
        F.length >= 2 && z.push(F);
      }
      C = z, e.points.val = ee;
    }
    for (const ee of n) {
      const S = V.get(ee);
      S !== void 0 && S < C.length && d.push(S);
    }
    if (e.polylines && (e.polylines.val = C), e.areas && (e.areas.val = d), w.size > 0 && s) {
      const ee = i.filter((S, z) => !w.has(z));
      "val" in s ? s.val = ee : window.__hekatanDrawingAuxLines = ee, b += w.size;
    }
    Se.clear(), Mt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ne(`\u{1F5D1} ${b} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = zo, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || Se.size !== 0 && (t.preventDefault(), zo());
  });
  const Vt = document.createElement("div");
  Vt.id = "hk-properties-pane";
  const Fo = "hk-props-pane-pos";
  let bn = null;
  try {
    const t = localStorage.getItem(Fo);
    t && (bn = JSON.parse(t));
  } catch {
  }
  Vt.style.cssText = ["position:fixed", bn ? `left:${bn.left}px` : "left:14px", bn ? `top:${bn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Vt);
  const xs = () => {
    const t = Vt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, a = 0, n = 0, s = 0, i = 0;
    t.addEventListener("mousedown", (r) => {
      o = true, a = r.clientX, n = r.clientY;
      const f = Vt.getBoundingClientRect();
      s = f.left, i = f.top, Vt.style.transform = "none", Vt.style.left = `${s}px`, Vt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const f = r.clientX - a, y = r.clientY - n, w = Math.max(0, Math.min(window.innerWidth - 80, s + f)), b = Math.max(0, Math.min(window.innerHeight - 40, i + y));
      Vt.style.left = `${w}px`, Vt.style.top = `${b}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Fo, JSON.stringify({ left: parseFloat(Vt.style.left), top: parseFloat(Vt.style.top) }));
        } catch {
        }
      }
    });
  }, O = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, zt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let st = null;
  const gt = (t, o, a, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: a, value: n } }));
  }, gs = () => {
    if (st && (st.dispose(), st = null), Se.size === 0) {
      Vt.style.display = "none";
      return;
    }
    const t = [...Se], o = t.filter((C) => C.startsWith("pt:")), a = t.filter((C) => C.startsWith("seg:")), n = t.filter((C) => C.startsWith("poly:")), s = t.filter((C) => C.startsWith("aux:")), i = o.length > 0, r = a.length > 0, f = n.length > 0, y = !i && !r && !f, w = [];
    o.length && w.push(`\u{1F535} ${o.length} nodo(s)`), a.length && w.push(`\u{1F4CF} ${a.length} segmento(s)`), n.length && w.push(`\u25AD ${n.length} \xE1rea(s)`), s.length && w.push(`\u250A ${s.length} aux`);
    const b = `\u{1F3AF} ${Se.size} item(s) \u2014 ${w.join(", ")}`;
    st = new cs({ container: Vt, title: b });
    {
      const C = st.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      C.addBinding(zt, "dx", { label: "\u0394x (m)", step: 0.1 }), C.addBinding(zt, "dy", { label: "\u0394y (m)", step: 0.1 }), C.addBinding(zt, "dz", { label: "\u0394z (m)", step: 0.1 }), C.addBinding(zt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), C.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const V = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, zt.copias);
        ne(V ? `\u29C9 Replicado \xD7${V} (\u0394 ${zt.dx},${zt.dy},${zt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), C.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const V = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, 1);
        ne(V ? `\u2192 Copia desplazada \u0394 ${zt.dx},${zt.dy},${zt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const d = C.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      d.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), d.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ne(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const C = st.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      C.addBinding(O, "Ux"), C.addBinding(O, "Uy"), C.addBinding(O, "Uz"), C.addBinding(O, "Rx"), C.addBinding(O, "Ry"), C.addBinding(O, "Rz");
      const d = st.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      d.addBinding(O, "Kx", { label: "Kx", min: 0, step: 100 }), d.addBinding(O, "Ky", { label: "Ky", min: 0, step: 100 }), d.addBinding(O, "Kz", { label: "Kz", min: 0, step: 100 }), d.addBinding(O, "Krx", { label: "Krx", min: 0, step: 1e3 }), d.addBinding(O, "Kry", { label: "Kry", min: 0, step: 1e3 }), d.addBinding(O, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const V = st.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      V.addBinding(O, "Fx", { step: 0.1 }), V.addBinding(O, "Fy", { step: 0.1 }), V.addBinding(O, "Fz", { step: 0.1 }), V.addBinding(O, "Mx", { step: 0.1 }), V.addBinding(O, "My", { step: 0.1 }), V.addBinding(O, "Mz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(O, "mass", { label: "m", min: 0, step: 1 }), st.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(O, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), st.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let z = 0;
        const v = [O.Ux, O.Uy, O.Uz, O.Rx, O.Ry, O.Rz];
        v.some((D) => D) && (gt("nodes", o, "supports", v), z++);
        const F = [O.Fx, O.Fy, O.Fz, O.Mx, O.My, O.Mz];
        F.some((D) => D !== 0) && (gt("nodes", o, "loads", F), z++);
        const q = [O.Kx, O.Ky, O.Kz, O.Krx, O.Kry, O.Krz];
        if (q.some((D) => D !== 0) && (gt("nodes", o, "springs", q), z++), O.mass !== 0 && (gt("nodes", o, "mass", O.mass), z++), O.diaphragm !== "Ninguno" && (gt("nodes", o, "diaphragm", O.diaphragm), z++), z === 0) {
          ne("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let D = document.getElementById("hk-prop-toast");
          D || (D = document.createElement("div"), D.id = "hk-prop-toast", D.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(D)), D.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", D.style.background = "rgba(217,119,6,0.97)", D.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            D && (D.style.opacity = "0");
          }, 3200);
        } else ne(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const C = st.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      C.addBinding(O, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), C.addBinding(O, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const d = st.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      d.addBinding(O, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), d.addBinding(O, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), d.addBinding(O, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), d.addBinding(O, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), st.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(O, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), st.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(O, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const S = st.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      S.addBinding(O, "relMxI", { label: "Mx I" }), S.addBinding(O, "relMyI", { label: "My I" }), S.addBinding(O, "relMzI", { label: "Mz I" });
      const z = st.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      z.addBinding(O, "relMxJ", { label: "Mx J" }), z.addBinding(O, "relMyJ", { label: "My J" }), z.addBinding(O, "relMzJ", { label: "Mz J" }), st.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(O, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const F = st.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      F.addBinding(O, "LKx", { label: "LKx", min: 0, step: 100 }), F.addBinding(O, "LKy", { label: "LKy", min: 0, step: 100 }), F.addBinding(O, "LKz", { label: "LKz", min: 0, step: 100 });
      const q = st.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      q.addBinding(O, "qx", { step: 0.1 }), q.addBinding(O, "qy", { step: 0.1 }), q.addBinding(O, "qz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(O, "massPerM", { label: "m/L", min: 0, step: 1 }), st.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        gt("segs", a, "section", O.section), gt("segs", a, "material", O.material_frame);
        const le = { A: O.A_mod, Iz: O.Iz_mod, Iy: O.Iy_mod, J: O.J_mod };
        (le.A !== 1 || le.Iz !== 1 || le.Iy !== 1 || le.J !== 1) && gt("segs", a, "modifiers", le), O.insertionPoint !== "10 \u2014 Centroid" && gt("segs", a, "insertionPoint", O.insertionPoint), O.beta !== 0 && gt("segs", a, "beta", O.beta);
        const Q = [O.relMxI, O.relMyI, O.relMzI], W = [O.relMxJ, O.relMyJ, O.relMzJ];
        (Q.some((Fe) => Fe) || W.some((Fe) => Fe)) && gt("segs", a, "releases", { i: Q, j: W }), O.hinges !== "None" && gt("segs", a, "hinges", O.hinges);
        const Ee = [O.LKx, O.LKy, O.LKz];
        Ee.some((Fe) => Fe !== 0) && gt("segs", a, "lineSprings", Ee);
        const ke = [O.qx, O.qy, O.qz];
        ke.some((Fe) => Fe !== 0) && gt("segs", a, "distLoad", ke), O.massPerM !== 0 && gt("segs", a, "massPerM", O.massPerM), ne(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (f) {
      const C = st.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      C.addBinding(O, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), C.addBinding(O, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), C.addBinding(O, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), st.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(O, "surfLoad", { label: "q", step: 0.1 }), st.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        gt("areas", n, "shellType", O.shellType), gt("areas", n, "thickness", O.thickness), gt("areas", n, "material", O.material_shell), O.surfLoad !== 0 && gt("areas", n, "surfLoad", O.surfLoad), ne(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (y) {
      const C = st.addFolder({ title: "\u2139 Selecci\xF3n" }), d = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      C.addBinding(d, "msg", { readonly: true, label: "" });
    }
    st.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Se.clear(), Mt();
    }), Vt.style.display = "block", xs();
  };
  window.__hekatanRefreshPropsPane = gs;
  let mn = null, $n = false;
  g.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, $n = false);
  }), g.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !$n) {
      const o = t.clientX - mn.x, a = t.clientY - mn.y;
      Math.hypot(o, a) > 8 && ($n = true);
    }
  }), g.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !$n;
      mn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (It ? Vn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Se.size > 0 && (Se.clear(), Mt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, s = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), ne(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ne("\u238B Cancelado (click derecho)");
      }
    }
  }), g.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), g.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Ut = null, Mn = false));
  }), g.addEventListener("pointermove", (t) => {
    if (It && t.buttons === 0) {
      const i = t.clientX < It.x;
      eo(It.x, It.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Ut) return;
    const o = t.clientX - Ut.x, a = t.clientY - Ut.y, n = Math.hypot(o, a);
    if (!Mn && n < 8) return;
    Mn = true;
    const s = t.clientX < Ut.x;
    eo(Ut.x, Ut.y, t.clientX, t.clientY, s);
  }), g.addEventListener("pointerup", (t) => {
    if (!Ut) return;
    if (!Mn) {
      Ut = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    Co(Ut.x, Ut.y, t.clientX, t.clientY, o), Ut = null, Mn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true };
  const Xt = new je();
  Xt.visible = false, Xt.frustumCulled = false, u.add(Xt);
  const vs = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496 }, Ao = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    for (; Xt.children.length; ) {
      const r = Xt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = vs[t] ?? 16777215, i = new Me().setFromPoints([new _(-1, -1, 0), new _(1, -1, 0), new _(1, -1, 0), new _(1, 1, 0), new _(1, 1, 0), new _(-1, 1, 0), new _(-1, 1, 0), new _(-1, -1, 0)]);
    Xt.add(new Kt(i, new ct({ color: s, linewidth: 2 }))), Xt.position.set(o, a, n), Xt.visible = true, no();
  };
  let to = 4;
  const no = () => {
    Xt.visible && Xt.scale.setScalar(to * Tn(Xt.position));
  };
  window.__hekatanOsnapMarkerRef = Xt, window.__hekatanUpdateOsnapScale = no, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (to = t, no(), x()), to);
  const Ln = () => {
    Xt.visible = false;
  }, Ms = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    const s = window.__hekatanOsnap, i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let f = null;
    const y = { end: 0, node: 0, int: 1, mid: 2, cen: 3, per: 4, nea: 5 }, w = (S, z, v, F) => {
      const q = Math.hypot(z - t, v - o, F - a);
      if (q > n) return;
      const D = y[S] ?? 9;
      (!f || D < f.r || D === f.r && q < f.d) && (f = { type: S, x: z, y: v, z: F, d: q, r: D });
    };
    (s.node || s.end) && i.forEach((S) => {
      s.node && w("node", S[0], S[1], S[2]);
    });
    for (const S of r) if (!(S.length < 2)) for (let z = 0; z < S.length - 1; z++) {
      const v = i[S[z]], F = i[S[z + 1]];
      if (!(!v || !F) && (s.end && (w("end", v[0], v[1], v[2]), w("end", F[0], F[1], F[2])), s.mid && w("mid", (v[0] + F[0]) / 2, (v[1] + F[1]) / 2, (v[2] + F[2]) / 2), s.nea || s.per)) {
        const q = F[0] - v[0], D = F[1] - v[1], le = F[2] - v[2], Q = q * q + D * D + le * le;
        if (Q < 1e-12) continue;
        const W = Math.max(0, Math.min(1, ((t - v[0]) * q + (o - v[1]) * D + (a - v[2]) * le) / Q)), Ee = v[0] + W * q, ke = v[1] + W * D, Fe = v[2] + W * le;
        s.nea && w("nea", Ee, ke, Fe), s.per && w("per", Ee, ke, Fe);
      }
    }
    if (s.cen) {
      const S = En(), z = [...pn];
      for (const v of S) z.some((F) => Math.hypot(F.c[0] - v.c[0], F.c[1] - v.c[1], F.c[2] - v.c[2]) < 1e-6 && Math.abs(F.r - v.r) < 1e-6) || z.push(v);
      for (const v of z) {
        if (!i.some((D) => Math.abs(Math.hypot(D[0] - v.c[0], D[1] - v.c[1], D[2] - v.c[2]) - v.r) < 1e-6)) continue;
        const q = Math.hypot(t - v.c[0], o - v.c[1], a - v.c[2]);
        if (q < n || Math.abs(q - v.r) < n) {
          const D = Math.min(q, n * 0.5), le = 3;
          (!f || le < f.r || le === f.r && D < f.d) && (f = { type: "cen", x: v.c[0], y: v.c[1], z: v.c[2], d: D, r: le });
        }
      }
    }
    if (s.int) {
      const S = [];
      for (const z of r) for (let v = 0; v < z.length - 1; v++) {
        const F = i[z[v]], q = i[z[v + 1]];
        if (!F || !q) continue;
        const D = q[0] - F[0], le = q[1] - F[1], Q = q[2] - F[2], W = D * D + le * le + Q * Q;
        if (W < 1e-12) continue;
        const Ee = Math.max(0, Math.min(1, ((t - F[0]) * D + (o - F[1]) * le + (a - F[2]) * Q) / W));
        Math.hypot(F[0] + Ee * D - t, F[1] + Ee * le - o, F[2] + Ee * Q - a) < 3 * n && S.push([F, q]);
      }
      for (let z = 0; z < S.length; z++) for (let v = z + 1; v < S.length; v++) {
        const [F, q] = S[z], [D, le] = S[v], Q = [q[0] - F[0], q[1] - F[1], q[2] - F[2]], W = [le[0] - D[0], le[1] - D[1], le[2] - D[2]], Ee = [F[0] - D[0], F[1] - D[1], F[2] - D[2]], ke = Q[0] * Q[0] + Q[1] * Q[1] + Q[2] * Q[2], Fe = Q[0] * W[0] + Q[1] * W[1] + Q[2] * W[2], Re = W[0] * W[0] + W[1] * W[1] + W[2] * W[2], Ke = Q[0] * Ee[0] + Q[1] * Ee[1] + Q[2] * Ee[2], tt = W[0] * Ee[0] + W[1] * Ee[1] + W[2] * Ee[2], dt = ke * Re - Fe * Fe;
        if (dt < 1e-12) continue;
        const rt = (Fe * tt - Re * Ke) / dt, ft = (ke * tt - Fe * Ke) / dt;
        if (rt < -1e-6 || rt > 1 + 1e-6 || ft < -1e-6 || ft > 1 + 1e-6) continue;
        const Pe = [F[0] + rt * Q[0], F[1] + rt * Q[1], F[2] + rt * Q[2]], He = [D[0] + ft * W[0], D[1] + ft * W[1], D[2] + ft * W[2]];
        if (Math.hypot(Pe[0] - He[0], Pe[1] - He[1], Pe[2] - He[2]) > 1e-4) continue;
        [F, q, D, le].some((we) => Math.hypot(we[0] - Pe[0], we[1] - Pe[1], we[2] - Pe[2]) < 1e-6) || w("int", Pe[0], Pe[1], Pe[2]);
      }
    }
    const b = window.__hekatanAxisGrids ?? [], C = window.__hekatanLevels ?? [], d = b.filter((S) => S && S.start && S.end).map((S) => [S.start, S.end]);
    for (const [S, z] of d) {
      s.end && (w("end", S[0], S[1], S[2]), w("end", z[0], z[1], z[2]));
      const v = z[0] - S[0], F = z[1] - S[1], q = z[2] - S[2], D = v * v + F * F + q * q;
      if (D < 1e-12) continue;
      const le = Math.max(0, Math.min(1, ((t - S[0]) * v + (o - S[1]) * F + (a - S[2]) * q) / D));
      if (s.nea && w("nea", S[0] + le * v, S[1] + le * F, S[2] + le * q), s.int && Math.abs(q) > 1e-9) for (const Q of C) {
        const W = (Q.z - S[2]) / q;
        W < -1e-6 || W > 1 + 1e-6 || w("int", S[0] + W * v, S[1] + W * F, Q.z);
      }
    }
    if (s.int || s.node) for (let S = 0; S < d.length; S++) for (let z = S + 1; z < d.length; z++) {
      const [v, F] = d[S], [q, D] = d[z], le = F[0] - v[0], Q = F[1] - v[1], W = D[0] - q[0], Ee = D[1] - q[1], ke = le * Ee - Q * W;
      if (Math.abs(ke) < 1e-12) continue;
      const Fe = v[0] - q[0], Re = v[1] - q[1], Ke = (W * Re - Ee * Fe) / ke, tt = (le * Re - Q * Fe) / ke;
      if (Ke < -1e-6 || Ke > 1 + 1e-6 || tt < -1e-6 || tt > 1 + 1e-6) continue;
      const dt = (_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workZ;
      w("int", v[0] + Ke * le, v[1] + Ke * Q, typeof dt == "number" ? dt : a);
    }
    const V = window.__hekatanDrawingAuxLines, ee = (V == null ? void 0 : V.rawVal) ?? (V == null ? void 0 : V.val) ?? V ?? [];
    for (const S of ee) {
      if (S.length !== 6) continue;
      const z = [S[0], S[1], S[2]], v = [S[3], S[4], S[5]];
      if (s.end && (w("end", z[0], z[1], z[2]), w("end", v[0], v[1], v[2])), s.mid && w("mid", (z[0] + v[0]) / 2, (z[1] + v[1]) / 2, (z[2] + v[2]) / 2), s.nea || s.per) {
        const F = v[0] - z[0], q = v[1] - z[1], D = v[2] - z[2], le = F * F + q * q + D * D;
        if (le < 1e-12) continue;
        const Q = Math.max(0, Math.min(1, ((t - z[0]) * F + (o - z[1]) * q + (a - z[2]) * D) / le)), W = z[0] + Q * F, Ee = z[1] + Q * q, ke = z[2] + Q * D;
        s.nea && w("nea", W, Ee, ke), s.per && w("per", W, Ee, ke);
      }
    }
    return f ? { type: f.type, x: f.x, y: f.y, z: f.z } : null;
  }, wn = new je();
  wn.frustumCulled = false, u.add(wn);
  const Eo = new ct({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let To = 0;
  const Vo = () => {
    var _a2, _b;
    for (const t of wn.children.slice()) wn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    Vo();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of t || []) {
      const i = String(s).split(":");
      let r = [];
      if (i[0] === "pt") {
        const w = o[+i[1]];
        w && (r = [w, [w[0] + 1e-3, w[1], w[2]]]);
      } else if (i[0] === "seg") {
        const w = a[+i[1]] || [], b = o[w[+i[2]]], C = o[w[+i[2] + 1]];
        b && C && (r = [b, C]);
      } else i[0] === "poly" && (r = (a[+i[1]] || []).map((b) => o[b]).filter(Boolean));
      if (r.length < 2) continue;
      const f = new Me().setFromPoints(r.map((w) => new _(w[0], w[1], w[2]))), y = new _t(f, Eo);
      y.renderOrder = 1200, wn.add(y);
    }
    if (!wn.children.length) return;
    To = performance.now() + 900;
    const n = () => {
      const s = To - performance.now();
      if (s <= 0) {
        Vo(), x();
        return;
      }
      Eo.opacity = Math.min(1, s / 900) * 0.95, x(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Ms, window.__hekatanOsnapShow = Ao, window.__hekatanOsnapHide = Ln;
  let Te = [], mt = 0, nn = 0, bt = null;
  const _n = document.createElement("div");
  _n.id = "hk-cad-status", _n.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", _n.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(_n);
  const bs = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), Ie && t.push(`\u{1F512} LOCK ${Ie.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && t.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, ne = (t) => {
    var _a2;
    const o = t + bs();
    _n.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, _s = "Comando:", Ss = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], n = Te.length, s = (i, r = []) => ({ txt: i, ops: r });
    switch (t) {
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${fe.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect":
        return s(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${mt > 0 ? mt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${mt > 0 ? mt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(bt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(bt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(bt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${nn > 0 ? ` (distancia ${nn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Se.size ? s(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Se.size ? s(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Se.size ? s(`SELECCI\xD3N ${Se.size} objeto${Se.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(_s);
    }
  }, Rt = () => {
    var _a2;
    try {
      const t = Ss();
      (_a2 = window.__hekatanCadPrompt) == null ? void 0 : _a2.call(window, t.txt, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Rt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    ne(o);
  }, window.__hekatanCadResetPending = () => {
    Te = [], fe = [], G.visible = false, oo(), bt = null, x(), ne("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Rt();
  };
  function oo() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = oo;
  const yn = [], In = [], so = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, $o = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Te = [], pe.visible = false, ut.visible = false, X();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x(), Rt();
  }, Dt = () => {
    yn.push(so()), yn.length > 100 && yn.shift(), In.length = 0;
  }, Rn = () => {
    const t = yn.pop();
    if (!t) {
      ne("\u21B6 Nada para deshacer");
      return;
    }
    In.push(so()), $o(t), ne(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Lo = () => {
    const t = In.pop();
    if (!t) {
      ne("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(so()), $o(t), ne(`\u21B7 Rehacer \u2014 quedan ${In.length}`);
  };
  window.__hekatanPushUndo = Dt, window.__hekatanUndo = Rn, window.__hekatanRedo = Lo, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Lo());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e2;
    const o = t.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Rn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ne("Cerrar necesita al menos tres puntos."), true;
      Dt(), e.polylines.val = [...n.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return ao(), ne(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Rn(), true;
      Dt();
      const i = s[s.length - 1], r = s.slice(0, -1), f = n.some((b, C) => C !== n.length - 1 && b.includes(i)) || r.includes(i);
      let y = e.points.rawVal, w = [...n.slice(0, -1), r];
      if (!f && i === y.length - 1 && (y = y.slice(0, -1), e.points.val = y), e.polylines.val = w, r.length) {
        const b = y[r[r.length - 1]];
        b && (B = [b[0], b[1], b[2]]);
      } else B = null, pe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return x(), ne(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Rt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Rn();
    }
  }, { capture: true });
  const ao = () => {
    Te = [], bt = null, oo(), Ie = null, Gt(), pe.visible = false, ut.visible = false, X(), ne("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), x(), Rt();
  };
  window.__hekatanFinalizeDraw = ao;
  const Io = () => {
    var _a2, _b, _c;
    Te = [], fe = [], G.visible = false;
    let t = false;
    Se.size && (Se.clear(), Mt(), t = true), ao();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ne(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), x(), Rt();
  };
  window.__hekatanEscapeCancel = Io;
  const Ro = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Se.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (t[+a.slice(5)] || []).forEach((n) => o.add(n));
      else if (a.startsWith("seg:")) {
        const n = a.split(":"), s = t[+n[1]] || [], i = s[+n[2]], r = s[+n[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, Do = (t, o, a) => {
    var _a2;
    const n = Ro();
    if (!n.size) return 0;
    Dt();
    const s = e.points.rawVal.map((i, r) => n.has(r) ? [i[0] + t, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Mt(), x(), n.size;
  };
  window.__hekatanMoveSelection = Do;
  const Bo = (t, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!Se.size) {
      ne(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Rt();
      return;
    }
    if (Te.push(o), Te.length === 1) {
      B = o, ne(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Rt();
      return;
    }
    const [a, n] = Te, s = [n[0] - a[0], n[1] - a[1], n[2] - a[2]];
    Te = [], pe.visible = false;
    let i = 0;
    t === "move" ? i = Do(s[0], s[1], s[2]) : (i = Ro().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ne(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), t === "move" && (Se.clear(), Mt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Rt();
  };
  window.__hekatanPasoMoverCopiar = Bo;
  const ks = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), io = (t, o, a, n, s, i) => {
    const r = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], f = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], y = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], w = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], b = r[0] * f[0] + r[1] * f[1] + r[2] * f[2], C = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], d = r[0] * y[0] + r[1] * y[1] + r[2] * y[2], V = f[0] * y[0] + f[1] * y[1] + f[2] * y[2], ee = w * C - b * b;
    if (ee < 1e-12) return null;
    const S = (b * V - C * d) / ee, z = (w * V - b * d) / ee;
    if (!s && (S < -1e-6 || S > 1 + 1e-6) || !i && (z < -1e-6 || z > 1 + 1e-6)) return null;
    const v = [t[0] + S * r[0], t[1] + S * r[1], t[2] + S * r[2]], F = [a[0] + z * f[0], a[1] + z * f[1], a[2] + z * f[2]];
    return jt(v, F) > 1e-4 ? null : v;
  }, Ps = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((n) => n === t).length, 0);
  }, Cs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, zs = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, n = e.points.rawVal, s = Cs[t];
    if (!bt) {
      if (ve < 0) {
        ne(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      bt = { poly: ve, seg: Math.max(0, Je) }, ne(t === "offset" ? `DESFASE l\xEDnea #${bt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${nn > 0 ? ` (${nn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Rt();
      return;
    }
    if (t === "offset") {
      const S = bt.poly, z = a[S];
      if (!z || z.length < 2) {
        bt = null, ne("DESFASE: esa polil\xEDnea no tiene tramos."), Rt();
        return;
      }
      const v = z.length > 2 && z[0] === z[z.length - 1], F = ks(), q = [];
      for (let Pe = 0; Pe < z.length - 1; Pe++) {
        const He = n[z[Pe]], at = n[z[Pe + 1]], we = [at[0] - He[0], at[1] - He[1], at[2] - He[2]], Ve = Math.hypot(we[0], we[1], we[2]) || 1, nt = we[0] / Ve, Tt = we[1] / Ve, $t = we[2] / Ve, Nt = [F[1] * $t - F[2] * Tt, F[2] * nt - F[0] * $t, F[0] * Tt - F[1] * nt], Wt = Math.hypot(Nt[0], Nt[1], Nt[2]) || 1;
        q.push({ a: He, b: at, n: [Nt[0] / Wt, Nt[1] / Wt, Nt[2] / Wt] });
      }
      let D = 0, le = 1 / 0;
      q.forEach((Pe, He) => {
        const at = Ot(o[0], o[1], o[2], Pe.a[0], Pe.a[1], Pe.a[2], Pe.b[0], Pe.b[1], Pe.b[2]);
        at < le && (le = at, D = He);
      });
      const Q = q[D], W = Math.sign((o[0] - Q.a[0]) * Q.n[0] + (o[1] - Q.a[1]) * Q.n[1] + (o[2] - Q.a[2]) * Q.n[2]) || 1, Ee = nn > 0 ? nn : le;
      if (Ee < 1e-6) {
        ne("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const ke = q.map((Pe) => ({ a: [Pe.a[0] + W * Ee * Pe.n[0], Pe.a[1] + W * Ee * Pe.n[1], Pe.a[2] + W * Ee * Pe.n[2]], b: [Pe.b[0] + W * Ee * Pe.n[0], Pe.b[1] + W * Ee * Pe.n[1], Pe.b[2] + W * Ee * Pe.n[2]] })), Fe = ke.length, Re = (Pe) => {
        const He = ke[(Pe - 1 + Fe) % Fe], at = ke[Pe % Fe];
        return io(He.a, He.b, at.a, at.b, true, true) ?? at.a;
      }, Ke = [], tt = v ? Fe : Fe + 1;
      for (let Pe = 0; Pe < tt; Pe++) !v && Pe === 0 ? Ke.push(ke[0].a) : !v && Pe === Fe ? Ke.push(ke[Fe - 1].b) : Ke.push(Re(Pe));
      Dt();
      const dt = n.length;
      e.points.val = [...n, ...Ke];
      const rt = Ke.map((Pe, He) => dt + He);
      v && rt.push(dt);
      let ft = a.slice();
      ft.length && ft[ft.length - 1].length === 0 && (ft = ft.slice(0, -1)), e.polylines.val = [...ft, rt, []], bt = null, ne(`\u2713 Desfase a ${Ee.toFixed(2)} m \u2014 ${Fe} tramo${Fe === 1 ? "" : "s"} nuevo${Fe === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      x(), Rt();
      return;
    }
    let i = ve, r = Math.max(0, Je);
    if (i < 0 || i === bt.poly && r === bt.seg) {
      let z = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((v, F) => {
        for (let q = 0; q < v.length - 1; q++) {
          if (F === bt.poly && q === bt.seg) continue;
          const D = n[v[q]], le = n[v[q + 1]];
          if (!D || !le) continue;
          const Q = Ot(o[0], o[1], o[2], D[0], D[1], D[2], le[0], le[1], le[2]);
          Q < z && (z = Q, i = F, r = q);
        }
      }), i < 0) {
        ne(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = a[bt.poly], y = n[f[bt.seg]], w = n[f[bt.seg + 1]], b = a[i], C = b[r], d = b[r + 1];
    if (!y || !w || C == null || d == null) {
      ne(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const V = n[C], ee = n[d];
    if (t === "trim") {
      const S = io(V, ee, y, w, false, false);
      if (!S) {
        ne("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Dt();
      const z = n.length;
      e.points.val = [...n, S];
      const v = [...b.slice(0, r + 1), z, ...b.slice(r + 1)];
      e.polylines.val = a.map((q, D) => D === i ? v : q);
      const F = jt(o, V) < jt(o, ee);
      Fn(i, F ? r : r + 1), ne(`\u2713 Recortado en (${S[0].toFixed(2)}, ${S[1].toFixed(2)}, ${S[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const S = io(V, ee, y, w, true, false);
      if (!S) {
        ne("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const v = jt(o, V) < jt(o, ee) ? r : r + 1;
      if (v !== 0 && v !== b.length - 1) {
        ne("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const F = b[v];
      if (jt(S, V) + jt(S, ee) < jt(V, ee) + 1e-6) {
        ne("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Dt(), Ps(F) > 1) {
        const D = n.length;
        e.points.val = [...n, S];
        const le = b.slice();
        le[v] = D, e.polylines.val = a.map((Q, W) => W === i ? le : Q);
      } else e.points.val = n.map((D, le) => le === F ? S : D);
      ne(`\u2713 Alargada hasta (${S[0].toFixed(2)}, ${S[1].toFixed(2)}, ${S[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    x(), Rt();
  };
  window.__hekatanSelectionSize = () => Se.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return Se.clear(), o >= 0 && Se.add(`poly:${o}`), Mt(), ne(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Se.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Se.clear();
    const a = /* @__PURE__ */ new Set();
    return t.forEach((n, s) => {
      !n || n.length < 2 || (Se.add(`poly:${s}`), n.forEach((i) => a.add(i)));
    }), o.forEach((n, s) => {
      a.has(s) || Se.add(`pt:${s}`);
    }), Mt(), ne(`SELECCI\xD3N ${Se.size} objetos (todo el modelo) \xB7 Esc suelta`), Se.size;
  }, window.__hekatanReplicateSelection = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1));
    const s = [...Se], i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), y = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), b = [];
    if (s.forEach((S) => {
      if (S.startsWith("pt:")) y.add(+S.slice(3));
      else if (S.startsWith("poly:")) {
        const z = +S.slice(5);
        w.add(z), (r[z] || []).forEach((v) => y.add(v));
      } else if (S.startsWith("seg:")) {
        const z = S.split(":"), v = +z[1], F = +z[2], q = r[v] || [], D = q[F], le = q[F + 1];
        D != null && le != null && (b.push([D, le]), y.add(D), y.add(le));
      }
    }), !y.size) return 0;
    Dt();
    const C = [...i];
    let d = r.slice();
    d.length && d[d.length - 1].length === 0 && (d = d.slice(0, -1));
    const V = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], ee = [...y];
    for (let S = 1; S <= n; S++) {
      const z = t * S, v = o * S, F = a * S, q = /* @__PURE__ */ new Map();
      ee.forEach((D) => {
        q.set(D, C.length), C.push([i[D][0] + z, i[D][1] + v, i[D][2] + F]);
      }), w.forEach((D) => {
        const le = r[D].map((W) => q.has(W) ? q.get(W) : W), Q = d.length;
        d.push(le), f.has(D) && V.push(Q);
      }), b.forEach(([D, le]) => {
        d.push([q.get(D), q.get(le)]);
      });
    }
    d.push([]), e.points.val = C, e.polylines && (e.polylines.val = d), e.areas && (e.areas.val = V);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return x(), n;
  }, g.addEventListener("click", (t) => {
    var _a2, _b;
    if (tn > 5) {
      tn = 0;
      return;
    }
    tn = 0;
    const o = M(t);
    if (!o) return;
    P.setFromCamera(A, o);
    const a = ie();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(c.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), r = a[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(s * 12, 300)) {
        ne("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = a[0].point;
    (t.ctrlKey || t.metaKey) && (n = new _(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = s[s.length - 1] ?? [], r = e.points.rawVal ?? [];
      if (i.length > 0) {
        const f = r[i[i.length - 1]];
        if (f) {
          const y = !!window.__hekatanOrthoMode;
          let w = Ie;
          if (!w && y) {
            const b = Math.abs(n.x - f[0]), C = Math.abs(n.y - f[1]), d = Math.abs(n.z - f[2]);
            w = b >= C && b >= d ? "x" : C >= d ? "y" : "z";
          }
          w === "x" ? n = new _(n.x, f[1], f[2]) : w === "y" ? n = new _(f[0], n.y, f[2]) : w === "z" && (n = new _(f[0], f[1], n.z));
        }
      }
    }
    if (Jt) n = Jt.clone(), ne(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const s = Qn(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n = new _(i.x, i.y, i.z), ne(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        r && f > 0 && (n = new _(Math.round(n.x / f) * f, Math.round(n.y / f) * f, Math.round(n.z / f) * f));
      }
    }
    Xo(n, t);
  });
  const Xo = (t, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (ht) {
        It && Vn();
        const { kind: n, a: s, b: i } = ht, r = i !== void 0 ? `${n}:${s}:${i}` : `${n}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Se.clear(), Se.has(r) ? Se.delete(r) : Se.add(r), Mt(), ne(`\u2713 Seleccionados ${Se.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        It ? (Co(It.x, It.y, s, i, n), It = null) : n || (It = { x: s, y: i }, ne("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), eo(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], ne(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], s);
      ne(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      Bo(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "delete") {
      if (Qe >= 0) {
        const n = window.__hekatanDrawingAuxLines, s = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = Qe;
        if (i >= 0 && i < s.length) {
          Dt();
          const r = s.slice(0, i).concat(s.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, ne(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Qe = -1, Ae.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (ve >= 0) {
        const n = ve, s = Je;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (dn(n), ne(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : s >= 0 ? (Fn(n, s), ne(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${n + 1} borrado`)) : (dn(n), ne(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else ne("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Te.push([t.x, t.y, t.z]), Te.length === 1) {
        ne("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, s] = Te, i = Math.hypot(s[0] - n[0], s[1] - n[1], s[2] - n[2]);
      Math.abs(s[0] - n[0]);
      const r = Math.abs(s[1] - n[1]), y = Math.abs(s[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", w = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, w, y), ne(`\u2713 C\xEDrculo dibujado en ${y.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${w} segmentos`), Te = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (Te.push([t.x, t.y, t.z]), Te.length === 1) {
        ne("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Te.length === 2) {
        ne("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, s, i] = Te, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, s, i, r), ne(`\u2713 Arco dibujado \u2014 ${r} segmentos`), Te = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Te.push([t.x, t.y, t.z]), Te.length === 1) {
        ne("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Te;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, s), ne(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Te = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Te.push([t.x, t.y, t.z]), Te.length === 1) {
        ne("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Te;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, s), ne(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Te = [];
      return;
    }
    if (a === "polyarea") {
      fe.push([t.x, t.y, t.z]), G.geometry.setFromPoints(fe.map((n) => new _(n[0], n[1], n[2]))), G.visible = fe.length >= 1, ne(`\u25B0 \xC1rea libre \u2014 ${fe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), x();
      return;
    }
    if (a === "plane3") {
      if (Te.push([t.x, t.y, t.z]), Te.length < 3) {
        ne(`\u25E3 Plano inclinado \u2014 punto ${Te.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, s, i] = Te, r = (_o2 = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o2.call(window, n, s, i);
      ne(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Te = [];
      return;
    }
    if (a === "col") {
      Dt();
      const n = t.z, s = mt && mt > 0 ? mt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + s]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], mt = 0, ne(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Te.push([t.x, t.y, t.z]), Te.length === 1) {
        ne("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, s] = Te, i = mt && mt > 0 ? mt : 3;
      Dt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [n[0], n[1], n[2] + i]];
      const f = e.polylines.rawVal;
      if (f.length - 1, e.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const y = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, y];
      }
      ne(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Te = [], mt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Dt();
      const n = mt && mt > 0 ? mt : 3, s = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, s], [t.x, t.y, s + n]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], mt = 0, ne(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = ln(t.x, t.y, t.z, n);
      if (!s) {
        ne("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, f = i[s.polyIdx], y = r[f[s.segIdx]], w = r[f[s.segIdx + 1]];
      if (!y || !w) {
        ne("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const b = mt && mt > 0 ? mt : 3;
      Dt();
      const C = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [y[0], y[1], y[2]], [w[0], w[1], w[2]], [w[0], w[1], w[2] + b], [y[0], y[1], y[2] + b]];
      const d = e.polylines.rawVal;
      if (e.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [C, C + 1, C + 2, C + 3, C], []], e.areas) {
        const V = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, V];
      }
      mt = 0, ne(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${b.toFixed(2)}m`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "auxp") {
      const n = window.__hekatanDrawingAuxPoints;
      if (n) {
        const s = n.rawVal ?? n.val ?? [];
        n.val = [...s, [t.x, t.y, t.z]];
      }
      ne(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Te.push([t.x, t.y, t.z]), Te.length === 1) {
        ne("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, s] = Te, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const b = i.rawVal ?? i.val ?? [];
        i.val = [...b, [n[0], n[1], n[2], s[0], s[1], s[2]]];
      }
      const r = s[0] - n[0], f = s[1] - n[1], y = s[2] - n[2], w = Math.sqrt(r * r + f * f + y * y);
      ne(`\u2713 L\xEDnea auxiliar creada \u2014 L=${w.toFixed(2)}m (cyan, no FEM)`), Te = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      zs(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "chaflan") {
      if (Te.push([t.x, t.y, t.z]), Te.length === 1) {
        ne("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Te, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, s, i, r, 6);
      const f = Math.abs(s[0] - n[0]).toFixed(1), y = Math.abs(s[1] - n[1]).toFixed(1);
      ne(`\u2713 Losa con chaflanes dibujada \u2014 ${f}\xD7${y}m, r=${i}m, ${r} seg/chafl\xE1n`), Te = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if ($ = false, Dt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, s = n.length - 1, i = n[s] ?? [];
      if (a === "line" && i.length >= 2) {
        ne(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), ne("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") ne(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (a === "line") ne("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") ne("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ne(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  g.addEventListener("click", () => Rt()), g.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && fe.length >= 3) {
      t.preventDefault();
      const a = un();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), g.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = M(t);
    if (!o) return;
    P.setFromCamera(A, o);
    const a = ie();
    if (be.geometry.deleteAttribute("position"), a.length) {
      let n = a[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = r[r.length - 1] ?? [], y = e.points.rawVal ?? [];
        if (f.length > 0) {
          const w = y[f[f.length - 1]];
          if (w) {
            const b = !!window.__hekatanOrthoMode;
            let C = Ie;
            if (!C && b) {
              const d = Math.abs(n.x - w[0]), V = Math.abs(n.y - w[1]), ee = Math.abs(n.z - w[2]);
              C = d >= V && d >= ee ? "x" : V >= ee ? "y" : "z";
            }
            C === "x" ? n.set(n.x, w[1], w[2]) : C === "y" ? n.set(w[0], n.y, w[2]) : C === "z" && n.set(w[0], w[1], n.z);
          }
        }
      }
      const s = Qn(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0.5;
        r && f > 0 && (n.x = Math.round(n.x / f) * f, n.y = Math.round(n.y / f) * f, n.z = Math.round(n.z / f) * f);
      }
      be.geometry.setAttribute("position", new vt(n.toArray(), 3));
    }
    x();
  }), g.addEventListener("pointermove", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    P.setFromCamera(A, o);
    let a = false;
    const n = P.intersectObject(J), s = ie();
    if (n.length && s.length) {
      const i = new _(...e.points.rawVal[n[0].index]), r = new _(...s[0].point), f = i.sub(r), y = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      y.transformDirection(te.matrixWorld), Math.abs(f.dot(y)) < 1e-4 && (a = true);
    }
    be.visible = !a;
  });
  let lo = false, ro;
  g.addEventListener("pointermove", (t) => {
    var _a2;
    if (!tn) return;
    const o = M(t);
    if (!o) return;
    P.setFromCamera(A, o);
    let a = false;
    const n = P.intersectObject(J), s = ie();
    if (n.length && s.length) {
      const r = new _(...e.points.rawVal[n[0].index]), f = new _(...s[0].point), y = r.sub(f), w = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      w.transformDirection(te.matrixWorld), Math.abs(y.dot(w)) < 1e-4 && (a = true);
    }
    if (a && tn < 5 && (lo = true, c.enabled = false, ro = n[0].index), !lo || tn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (ro !== void 0) {
      let r = s[0].point;
      (t.ctrlKey || t.metaKey) && (r = new _(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[ro] = r.toArray();
    }
    e.points.val = i;
  }), g.addEventListener("pointerup", () => {
    c.enabled = true, lo = false;
  }), g.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    P.setFromCamera(A, o);
    let a = false;
    const n = P.intersectObject(J), s = ie();
    if (n.length && s.length) {
      const f = new _(...e.points.rawVal[n[0].index]), y = new _(...s[0].point), w = f.sub(y), b = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      b.transformDirection(te.matrixWorld), Math.abs(w.dot(b)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((f) => f.filter((y) => y !== n[0].index)).map((f) => f.map((y) => y > n[0].index ? y - 1 : y)).filter((f) => f.length);
    r.push([]), e.polylines.val = r;
  });
}
function xa(e, l, u) {
  const m = Math.round(14.999999999999998), p = { position: e.position.clone(), quaternion: e.quaternion.clone() }, g = setInterval(P, 1e3 / 30);
  let x = 0;
  function P() {
    x++;
    const A = x / m;
    e.position.lerpVectors(p.position, l.position, A), e.quaternion.slerpQuaternions(p.quaternion, l.quaternion, A), u && u(), x == m && clearInterval(g);
  }
}
function ga(e, l, u, h) {
  const c = Js(u, e.elements, h);
  return K.derive(() => {
    c.visible = l.shellResults.val != "none";
  }), c;
}
const va = 6, go = 10, Ma = 0.012;
function ba(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function _a(e, l, u, h) {
  if (!u && !h) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && u) {
    const m = u[e];
    if (m && m.has(l)) return m.get(l);
  }
  return null;
}
function Sa(e, l, u, h) {
  const c = new je(), m = new ds();
  m.setColorMap("rainbow");
  const p = new Zt(), g = K.state([]);
  return K.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const x = u.val, P = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], A = ba(l.frameResults.val);
    if (c.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), c.clear(), !A || P.length === 0 || x.length === 0) {
      g.val = [];
      return;
    }
    const M = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, te = (_c = e.deformOutputs) == null ? void 0 : _c.val, ae = [], de = [];
    for (let L = 0; L < P.length; L++) {
      if (P[L].length !== 2) continue;
      const ue = _a(A, L, M, te);
      ue && (ae.push(ue[0], ue[1]), de.push({ idx: L, vals: ue }));
    }
    if (ae.length === 0) {
      g.val = [];
      return;
    }
    const se = Math.min(...ae), E = Math.max(...ae);
    m.setMin(se), m.setMax(E), g.val = ae;
    const ie = [1 / 0, 1 / 0, 1 / 0], J = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of x) for (let j = 0; j < 3; j++) ie[j] = Math.min(ie[j], L[j]), J[j] = Math.max(J[j], L[j]);
    const ye = Math.max(J[0] - ie[0], J[1] - ie[1], J[2] - ie[2], 1) * Ma, Y = [], B = [], Z = [];
    let $ = 0;
    for (const { idx: L, vals: j } of de) {
      const ue = P[L], re = x[ue[0]], oe = x[ue[1]];
      if (!re || !oe) continue;
      const R = new _(oe[0] - re[0], oe[1] - re[1], oe[2] - re[2]), pe = R.length();
      if (pe < 1e-10) continue;
      R.normalize();
      const G = Math.abs(R.y) < 0.99 ? new _(0, 1, 0) : new _(1, 0, 0), fe = new _().crossVectors(R, G).normalize(), he = new _().crossVectors(R, fe).normalize(), $e = go + 1, _e = va;
      for (let Be = 0; Be < $e; Be++) {
        const Oe = Be / go, ut = re[0] + R.x * pe * Oe, Ft = re[1] + R.y * pe * Oe, k = re[2] + R.z * pe * Oe, I = j[0] + (j[1] - j[0]) * Oe, H = m.getColor(I) ?? new Zt(0, 0, 0);
        p.copy(H).convertSRGBToLinear();
        for (let N = 0; N < _e; N++) {
          const ce = N / _e * Math.PI * 2, me = Math.cos(ce), xe = Math.sin(ce);
          Y.push(ut + (fe.x * me + he.x * xe) * ye, Ft + (fe.y * me + he.y * xe) * ye, k + (fe.z * me + he.z * xe) * ye), B.push(p.r, p.g, p.b);
        }
      }
      for (let Be = 0; Be < go; Be++) for (let Oe = 0; Oe < _e; Oe++) {
        const ut = (Oe + 1) % _e, Ft = $ + Be * _e + Oe, k = $ + Be * _e + ut, I = $ + (Be + 1) * _e + Oe, H = $ + (Be + 1) * _e + ut;
        Z.push(Ft, k, H), Z.push(Ft, H, I);
      }
      $ += $e * _e;
    }
    if (Y.length === 0) return;
    const T = new Me();
    T.setAttribute("position", new vt(Y, 3)), T.setAttribute("color", new vt(B, 3)), T.setIndex(Z), T.computeVertexNormals();
    const U = new it({ vertexColors: true, side: kt }), X = new et(T, U);
    X.frustumCulled = false, c.add(X);
  }), c.__colorMapValues = g, c;
}
function ka() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Pa = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Ca = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, za = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function wt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Fa = 16755200, ns = 56831, Aa = 56831, Ea = 56831, Nn = 65382;
function Ta(e) {
  const l = new je();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const u = new xn(1, 16, 16), h = new it({ color: Fa, transparent: true, opacity: 0.85, depthTest: false }), c = new et(u, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const m = new Me(), p = new ct({ color: ns, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), g = new Kt(m, p);
  g.visible = false, g.renderOrder = 100, l.add(g);
  const x = new it({ color: ns, transparent: true, opacity: 0.7, depthTest: false }), P = new et(new Oo(1, 1, 1, 12), x);
  P.visible = false, P.renderOrder = 100, l.add(P);
  const A = new Me(), M = new it({ color: Aa, transparent: true, opacity: 0.45, side: kt, depthTest: false }), te = new et(A, M);
  te.visible = false, te.renderOrder = 100, l.add(te);
  const ae = new Me(), de = new ct({ color: Ea, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Kt(ae, de);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const E = new it({ color: Nn, transparent: true, opacity: 0.95, depthTest: false }), ie = new it({ color: Nn, transparent: true, opacity: 0.85, depthTest: false }), J = new Oo(1, 1, 1, 12), be = new it({ color: Nn, transparent: true, opacity: 0.55, side: kt, depthTest: false }), ye = new ct({ color: Nn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), Y = [];
  window.__hekatanModelSelection = Y;
  const B = new je();
  B.renderOrder = 101, l.add(B);
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function $(k) {
    const I = e.derivedNodes.rawVal;
    return !I || k < 0 || k >= I.length ? null : new _(I[k][0], I[k][1], I[k][2]);
  }
  function T(k, I) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s;
    const H = e.getActiveCamera();
    if (!H || !e.mesh) return null;
    const N = e.rendererElm.getBoundingClientRect(), ce = k - N.left, me = I - N.top, xe = e.derivedNodes.rawVal, ge = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!xe || !ge) return null;
    const Xe = /* @__PURE__ */ new Map(), Ce = (Ge) => {
      if (Xe.has(Ge)) return Xe.get(Ge);
      const Ye = $(Ge);
      if (!Ye) return Xe.set(Ge, null), null;
      const ze = Ye.clone().project(H), Ae = (ze.x * 0.5 + 0.5) * N.width, ve = (-ze.y * 0.5 + 0.5) * N.height, Je = { x: Ae, y: ve, z: ze.z };
      return Xe.set(Ge, Je), Je;
    }, Ne = /* @__PURE__ */ new Set();
    for (const Ge of ge) if (Ge) for (const Ye of Ge) Ne.add(Ye);
    const Le = 8;
    let Ze = -1, lt = Le;
    for (let Ge = 0; Ge < xe.length; Ge++) {
      if (!Ne.has(Ge)) continue;
      const Ye = Ce(Ge);
      if (!Ye || Ye.z < -1 || Ye.z > 1) continue;
      const ze = Ye.x - ce, Ae = Ye.y - me, ve = Math.sqrt(ze * ze + Ae * Ae);
      ve < lt && (lt = ve, Ze = Ge);
    }
    const We = ka(), ot = Ca[We.dispUnit] ?? 1e3, Ie = Pa[We.forceUnit] ?? 1;
    if (Ze >= 0) {
      const Ge = xe[Ze];
      let Ye = `Nodo ${Ze}
(${Ge[0].toFixed(3)}, ${Ge[1].toFixed(3)}, ${Ge[2].toFixed(3)})`;
      const ze = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (ze == null ? void 0 : ze.deformations) {
        const Ae = ze.deformations.get(Ze);
        if (Ae && (Ye += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ye += `
Ux = ${wt(Ae[0] * ot, 3)} ${We.dispUnit}`, Ye += `
Uy = ${wt(Ae[1] * ot, 3)} ${We.dispUnit}`, Ye += `
Uz = ${wt(Ae[2] * ot, 3)} ${We.dispUnit}`, (Math.abs(Ae[3]) > 1e-9 || Math.abs(Ae[4]) > 1e-9 || Math.abs(Ae[5]) > 1e-9) && (Ye += `
Rx = ${wt(Ae[3] * 1e3, 3)} mrad`, Ye += `
Ry = ${wt(Ae[4] * 1e3, 3)} mrad`, Ye += `
Rz = ${wt(Ae[5] * 1e3, 3)} mrad`)), ze.reactions) {
          const ve = ze.reactions.get(Ze);
          ve && (Math.abs(ve[0]) > 1e-9 || Math.abs(ve[1]) > 1e-9 || Math.abs(ve[2]) > 1e-9 || Math.abs(ve[3]) > 1e-6 || Math.abs(ve[4]) > 1e-6 || Math.abs(ve[5]) > 1e-6) && (Ye += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ye += `
Fx = ${wt(ve[0] * Ie)} ${We.forceUnit}`, Ye += `
Fy = ${wt(ve[1] * Ie)} ${We.forceUnit}`, Ye += `
Fz = ${wt(ve[2] * Ie)} ${We.forceUnit}`, (Math.abs(ve[3]) > 1e-6 || Math.abs(ve[4]) > 1e-6 || Math.abs(ve[5]) > 1e-6) && (Ye += `
Mx = ${wt(ve[3] * Ie)} ${We.forceUnit}\xB7m`, Ye += `
My = ${wt(ve[4] * Ie)} ${We.forceUnit}\xB7m`, Ye += `
Mz = ${wt(ve[5] * Ie)} ${We.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ze, info: Ye };
    }
    const Jt = 5;
    let qe = -1, Gt = Jt, Bt = "frame";
    for (let Ge = 0; Ge < ge.length; Ge++) {
      const Ye = ge[Ge];
      if (!(!Ye || Ye.length < 2)) {
        if (Ye.length === 2) {
          const ze = Ce(Ye[0]), Ae = Ce(Ye[1]);
          if (!ze || !Ae || ze.z < -1 || ze.z > 1 || Ae.z < -1 || Ae.z > 1) continue;
          const ve = Va(ce, me, ze.x, ze.y, Ae.x, Ae.y);
          ve < Gt && (Gt = ve, qe = Ge, Bt = "frame");
        } else if (Ye.length === 3 || Ye.length === 4) {
          const ze = [];
          let Ae = true;
          for (const ve of Ye) {
            const Je = Ce(ve);
            if (!Je || Je.z < -1 || Je.z > 1) {
              Ae = false;
              break;
            }
            ze.push(Je);
          }
          if (!Ae) continue;
          if ($a(ce, me, ze)) {
            const Je = ze.reduce((Qe, Se) => Qe + Se.z, 0) / ze.length * 1e-3;
            Je < Gt && (Gt = Je, qe = Ge, Bt = "shell");
          }
        } else if (Ye.length === 8) {
          const ze = [];
          let Ae = true;
          for (const De of Ye) {
            const Ue = Ce(De);
            if (!Ue || Ue.z < -1 || Ue.z > 1) {
              Ae = false;
              break;
            }
            ze.push(Ue);
          }
          if (!Ae) continue;
          const ve = Math.min(...ze.map((De) => De.x)), Je = Math.max(...ze.map((De) => De.x)), Qe = Math.min(...ze.map((De) => De.y)), Se = Math.max(...ze.map((De) => De.y));
          if (ce >= ve && ce <= Je && me >= Qe && me <= Se) {
            const Ue = ze.reduce((yt, Pt) => yt + Pt.z, 0) / ze.length * 1e-3;
            Ue < Gt && (Gt = Ue, qe = Ge, Bt = "solid");
          }
        }
      }
    }
    if (qe >= 0) {
      const Ge = ge[qe];
      let ze = `${Bt === "frame" ? "Frame" : Bt === "shell" ? "Shell" : "Solid"} ${qe}`;
      const Ae = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, ve = (_g = (_f = Ae == null ? void 0 : Ae.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, qe);
      if (ve) {
        ve.name && (ze += `
  \u{1F4CB} ${ve.name}`), ve.shape && (ze += `
  Shape: ${ve.shape}`);
        const Je = /concrete|hormig|rect.*sólida/i.test(ve.shape || ""), Qe = Je ? 100 : 1e3, Se = Je ? "cm" : "mm", De = (yt) => {
          const Pt = yt * Qe;
          return Math.abs(Pt - Math.round(Pt)) < 0.05 ? `${Math.round(Pt)}` : `${Pt.toFixed(1)}`;
        }, Ue = [];
        if (ve.D != null && Ue.push(`D=${De(ve.D)}`), ve.B != null && Ue.push(`B=${De(ve.B)}`), ve.TF != null && Ue.push(`TF=${De(ve.TF)}`), ve.TW != null && Ue.push(`TW=${De(ve.TW)}`), ve.t != null && Ue.push(`t=${De(ve.t)}`), Ue.length && (ze += `
  Dim: ${Ue.join(" ")} ${Se}`), ve.material) {
          let yt = ve.material;
          ve.fillMaterial && (yt += ` + FILL "${ve.fillMaterial}"`), ze += `
  Mat: ${yt}`;
        }
      } else {
        const Je = (_i = (_h = Ae == null ? void 0 : Ae.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, qe), Qe = (_k = (_j = Ae == null ? void 0 : Ae.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, qe);
        Je ? (ze += `
  ${Je}`, Qe && !Je.includes(Qe) && (ze += `  (${Qe})`)) : Qe && (ze += `
  Material: ${Qe}`);
      }
      if (ze += `
nodos: [${Ge.join(", ")}]`, Bt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Je = e.mesh.analyzeOutputs.rawVal, Qe = za[We.stressUnit] ?? 1, Se = [["bendingXX", "Mxx", Ie, `${We.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ie, `${We.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ie, `${We.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ie, `${We.forceUnit}/m`], ["membraneYY", "Nyy", Ie, `${We.forceUnit}/m`], ["membraneXY", "Nxy", Ie, `${We.forceUnit}/m`], ["shearX", "Qx", Ie, `${We.forceUnit}/m`], ["shearY", "Qy", Ie, `${We.forceUnit}/m`], ["vonMises", "\u03C3VM", Qe, We.stressUnit], ["pressure", "p", Qe, We.stressUnit]], De = [];
        for (const [Ue, yt, Pt, Ct] of Se) {
          const Yt = Je == null ? void 0 : Je[Ue];
          if (Yt && Yt instanceof Map) {
            const ht = Yt.get(qe);
            if (ht != null) {
              if (typeof ht == "number") De.push(`${yt} = ${wt(ht * Pt, 3)} ${Ct}`);
              else if (Array.isArray(ht)) {
                let At = ht[0];
                for (const Mt of ht) Math.abs(Mt) > Math.abs(At) && (At = Mt);
                De.push(`${yt} = ${wt(At * Pt, 3)} ${Ct}`);
              }
            }
          }
        }
        De.length > 0 && (ze += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + De.slice(0, 8).join(`
`));
      }
      if (Bt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Je = e.mesh.deformOutputs.rawVal, Qe = e.mesh.elementInputs.rawVal, Se = Je == null ? void 0 : Je.deformations;
        if (Se && Ge.length === 2) {
          const De = Se.get(Ge[0]), Ue = Se.get(Ge[1]), yt = xe[Ge[0]], Pt = xe[Ge[1]];
          if (De && Ue && yt && Pt) {
            const Ct = Pt[0] - yt[0], Yt = Pt[1] - yt[1], ht = Pt[2] - yt[2], At = Math.sqrt(Ct * Ct + Yt * Yt + ht * ht);
            if (At > 1e-9) {
              const Mt = Ct / At, Ot = Yt / At, ln = ht / At, rn = (Ue[0] - De[0]) * Mt + (Ue[1] - De[1]) * Ot + (Ue[2] - De[2]) * ln, cn = ((_n = Qe.elasticities) == null ? void 0 : _n.get(qe)) ?? 0, Hn = ((_o2 = Qe.areas) == null ? void 0 : _o2.get(qe)) ?? 0, dn = ((_p = Qe.momentsOfInertiaY) == null ? void 0 : _p.get(qe)) ?? 0, Fn = ((_q = Qe.momentsOfInertiaZ) == null ? void 0 : _q.get(qe)) ?? 0, pn = ((_r = Qe.torsionalConstants) == null ? void 0 : _r.get(qe)) ?? 0, An = ((_s = Qe.shearModuli) == null ? void 0 : _s.get(qe)) ?? cn / 2.6, gn = cn * Hn * (rn / At), En = (Ue[3] - De[3]) * Mt + (Ue[4] - De[4]) * Ot + (Ue[5] - De[5]) * ln, un = An * pn * (En / At), Lt = Ue[4] - De[4], qt = Ue[5] - De[5], Ht = cn * dn * Lt / At, Qt = cn * Fn * qt / At;
              ze += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, ze += `
L = ${wt(At, 3)} m`, ze += `
\u0394L = ${wt(rn * ot, 3)} ${We.dispUnit}`, ze += `
\u03B5 = ${wt(rn / At, 6)}`, Math.abs(gn) > 1e-6 && (ze += `
N \u2248 ${wt(gn * Ie)} ${We.forceUnit}`), Math.abs(un) > 1e-6 && (ze += `
T \u2248 ${wt(un * Ie)} ${We.forceUnit}\xB7m`), Math.abs(Ht) > 1e-6 && (ze += `
My \u2248 ${wt(Ht * Ie)} ${We.forceUnit}\xB7m`), Math.abs(Qt) > 1e-6 && (ze += `
Mz \u2248 ${wt(Qt * Ie)} ${We.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Bt, idx: qe, info: ze };
    }
    return null;
  }
  function U(k, I, H) {
    var _a2, _b, _c;
    if (c.visible = false, g.visible = false, P.visible = false, te.visible = false, se.visible = false, !k || !e.mesh) {
      Z.style.display = "none", e.render();
      return;
    }
    const N = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (k.type === "node") {
      const ge = $(k.idx);
      if (ge) {
        const Xe = e.derivedNodes.rawVal ?? [];
        let Ce = 1;
        if (Xe.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const We of Xe) for (let ot = 0; ot < 3; ot++) We[ot] < Ze[ot] && (Ze[ot] = We[ot]), We[ot] > lt[ot] && (lt[ot] = We[ot]);
          Ce = Math.max(lt[0] - Ze[0], lt[1] - Ze[1], lt[2] - Ze[2], 0.1);
        }
        const Ne = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Le = 0.021 * Ce * Ne;
        c.position.copy(ge), c.scale.setScalar(Le), c.visible = true;
      }
    } else if (k.type === "frame" && N) {
      const ge = N[k.idx], Xe = $(ge[0]), Ce = $(ge[1]);
      if (Xe && Ce) {
        const Ne = Xe.clone().add(Ce).multiplyScalar(0.5), Le = Ce.clone().sub(Xe), Ze = Le.length(), ot = e.getActiveCamera().position.distanceTo(Ne) * 35e-4;
        P.position.copy(Ne);
        const Ie = new _(0, 1, 0), Jt = Ie.clone().cross(Le).normalize(), qe = Ie.angleTo(Le);
        P.quaternion.setFromAxisAngle(Jt, qe), P.scale.set(ot, Ze, ot), P.visible = true;
      }
    } else if (k.type === "shell" && N) {
      const ge = N[k.idx], Xe = [], Ce = [];
      for (const Ne of ge) {
        const Le = $(Ne);
        if (!Le) return;
        Xe.push(Le.x, Le.y, Le.z);
      }
      ge.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && Ce.push(0, 1, 2), A.setAttribute("position", new vt(Xe, 3)), A.setIndex(Ce), A.computeVertexNormals(), te.visible = true;
    } else if (k.type === "solid" && N) {
      const ge = N[k.idx], Xe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
      for (const [Ne, Le] of Xe) {
        const Ze = $(ge[Ne]), lt = $(ge[Le]);
        Ze && lt && Ce.push(Ze.x, Ze.y, Ze.z, lt.x, lt.y, lt.z);
      }
      ae.setAttribute("position", new vt(Ce, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      Z.style.display = "none", e.render();
      return;
    }
    Z.textContent = k.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const me = e.rendererElm.getBoundingClientRect(), xe = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? me;
    Z.style.left = `${I - xe.left}px`, Z.style.top = `${H - xe.top}px`, e.render();
  }
  let X = "", L = 0, j = 0;
  const ue = window.__hekatanHoverDebug ?? false, re = (k) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const I = T(k.clientX, k.clientY);
      if (ue && j < 5) {
        const N = e.derivedNodes.rawVal, ce = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${k.clientX}, ${k.clientY}) nodes=${(N == null ? void 0 : N.length) ?? 0} elems=${(ce == null ? void 0 : ce.length) ?? 0} hover=`, I), j++;
      }
      const H = I ? `${I.type}:${I.idx}` : "";
      if (H !== X) X = H, U(I, k.clientX, k.clientY);
      else if (I) {
        const N = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        Z.style.left = `${k.clientX - N.left}px`, Z.style.top = `${k.clientY - N.top}px`;
      }
    });
  };
  let oe = null;
  const R = () => {
    X = "", c.visible = false, g.visible = false, P.visible = false, te.visible = false, se.visible = false, Z.style.display = "none", e.render();
  }, pe = (k) => {
    const I = e.rendererElm.getBoundingClientRect(), H = k.clientX - I.left, N = k.clientY - I.top;
    (H < -2 || N < -2 || H > I.width + 2 || N > I.height + 2) && (oe && clearTimeout(oe), oe = window.setTimeout(R, 200));
  }, G = () => {
    oe && (clearTimeout(oe), oe = null);
  };
  e.rendererElm.addEventListener("pointermove", re), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", G);
  function fe() {
    var _a2, _b, _c;
    const k = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return k === "select" || k === "none" || !k;
  }
  let he = null;
  e.rendererElm.addEventListener("pointerdown", (k) => {
    k.button === 0 && (he = { x: k.clientX, y: k.clientY });
  }), e.rendererElm.addEventListener("pointerup", (k) => {
    if (k.button !== 0 || !he) return;
    const I = k.clientX - he.x, H = k.clientY - he.y;
    if (he = null, I * I + H * H > 9 || !fe()) return;
    const N = T(k.clientX, k.clientY);
    N ? (ut({ type: N.type, idx: N.idx }, k.shiftKey), Oe()) : Ft();
  }), window.addEventListener("keydown", (k) => {
    if (k.key !== "Escape" || !Y.length) return;
    const I = document.activeElement, H = !!I && (I.id === "hk3-cmd-input" || I.id === "hk-dyn-input") && I.value === "";
    I && (I.tagName === "INPUT" || I.tagName === "TEXTAREA" || I.isContentEditable) && !H || Ft();
  }, { capture: true });
  function $e() {
    for (const k of B.children.slice()) {
      B.remove(k);
      const I = k.geometry;
      I && I !== u && I !== J && I.dispose();
    }
  }
  const _e = (k) => {
    var _a2;
    const I = e.getActiveCamera(), H = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return I.isOrthographicCamera ? (I.top - I.bottom) / (I.zoom || 1) / H : 2 * I.position.distanceTo(k) * Math.tan((I.fov || 50) * Math.PI / 180 / 2) / H;
  };
  function Be(k, I) {
    var _a2, _b;
    const H = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (k.type === "node") {
      const N = $(k.idx);
      if (!N) return;
      const ce = new et(u, E);
      ce.position.copy(N), ce.scale.setScalar(Math.max(1e-4, 7 * _e(N))), ce.renderOrder = 101, B.add(ce);
    } else if (k.type === "frame" && H) {
      const N = H[k.idx], ce = $(N[0]), me = $(N[1]);
      if (!ce || !me) return;
      const xe = ce.clone().add(me).multiplyScalar(0.5), ge = me.clone().sub(ce), Xe = ge.length(), Ce = e.getActiveCamera().position.distanceTo(xe), Ne = new et(J, ie);
      Ne.position.copy(xe);
      const Le = new _(0, 1, 0);
      Ne.quaternion.setFromAxisAngle(Le.clone().cross(ge).normalize(), Le.angleTo(ge)), Ne.scale.set(Ce * 35e-4, Xe, Ce * 35e-4), Ne.renderOrder = 101, B.add(Ne);
    } else if (k.type === "shell" && H) {
      const N = H[k.idx], ce = [], me = [];
      for (const Xe of N) {
        const Ce = $(Xe);
        if (!Ce) return;
        ce.push(Ce.x, Ce.y, Ce.z);
      }
      N.length === 4 ? me.push(0, 1, 2, 0, 2, 3) : N.length === 3 && me.push(0, 1, 2);
      const xe = new Me();
      xe.setAttribute("position", new vt(ce, 3)), xe.setIndex(me), xe.computeVertexNormals();
      const ge = new et(xe, be);
      ge.renderOrder = 101, B.add(ge);
    } else if (k.type === "solid" && H) {
      const N = H[k.idx], ce = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], me = [];
      for (const [Xe, Ce] of ce) {
        const Ne = $(N[Xe]), Le = $(N[Ce]);
        Ne && Le && me.push(Ne.x, Ne.y, Ne.z, Le.x, Le.y, Le.z);
      }
      const xe = new Me();
      xe.setAttribute("position", new vt(me, 3));
      const ge = new Kt(xe, ye);
      ge.renderOrder = 101, B.add(ge);
    }
  }
  function Oe() {
    if ($e(), !Y.length || !e.mesh) {
      e.render();
      return;
    }
    const k = e.derivedNodes.rawVal ?? [];
    if (k.length >= 2) {
      const I = [1 / 0, 1 / 0, 1 / 0], H = [-1 / 0, -1 / 0, -1 / 0];
      for (const N of k) for (let ce = 0; ce < 3; ce++) N[ce] < I[ce] && (I[ce] = N[ce]), N[ce] > H[ce] && (H[ce] = N[ce]);
      Math.max(H[0] - I[0], H[1] - I[1], H[2] - I[2], 0.1);
    }
    for (const I of Y) Be(I);
    e.render();
  }
  function ut(k, I) {
    const H = Y.findIndex((N) => N.type === k.type && N.idx === k.idx);
    H >= 0 ? Y.splice(H, 1) : I || Y.push(k), Y.length && Y[Y.length - 1];
  }
  function Ft() {
    Y.length = 0, Oe();
  }
  return K.derive(() => {
    e.derivedNodes.val, Y.length && Oe();
  }), l;
}
function Va(e, l, u, h, c, m) {
  const p = c - u, g = m - h, x = p * p + g * g;
  if (x < 1e-9) {
    const de = e - u, se = l - h;
    return Math.sqrt(de * de + se * se);
  }
  let P = ((e - u) * p + (l - h) * g) / x;
  P = Math.max(0, Math.min(1, P));
  const A = u + P * p, M = h + P * g, te = e - A, ae = l - M;
  return Math.sqrt(te * te + ae * ae);
}
function $a(e, l, u) {
  let h = false;
  for (let c = 0, m = u.length - 1; c < u.length; m = c++) {
    const p = u[c].x, g = u[c].y, x = u[m].x, P = u[m].y;
    g > l != P > l && e < (x - p) * (l - g) / (P - g + 1e-12) + p && (h = !h);
  }
  return h;
}
function os(e, l = 8) {
  const u = document.createElement("div");
  u.id = "legend", u.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    K.derive(() => {
      Kn.val, u.style.background = Ws();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", u.appendChild(h), setTimeout(() => {
    K.derive(() => {
      h.textContent = Mo.val ? `[${Mo.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (x, P) => P / l).reverse();
  let m, p;
  c.forEach((x, P) => {
    m = document.createElement("div"), m.id = `marker-${P}`, m.className = "marker", m.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", p = document.createElement("p"), p.id = `marker-text-${P}`, m.append(p), u.append(m);
  });
  const g = [];
  return u.querySelectorAll("p").forEach((x) => g.push(x)), setTimeout(() => {
    K.derive(() => {
      c.forEach((x, P) => {
        const A = g[P];
        A && (A.innerText = La(e.val, x).toString());
      });
    });
  }), u;
}
function La(e, l) {
  const u = zn.val;
  if (u) return ss(u[0] + l * (u[1] - u[0]));
  const h = e.filter((p) => Number.isFinite(p));
  if (h.length === 0) return "0";
  const [c, m] = _o(h);
  return ss(c + l * (m - c));
}
function ss(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function Ga({ mesh: e, settingsObj: l, drawingObj: u, objects3D: h, solids: c }) {
  Ks.DEFAULT_UP = new _(0, 0, 1);
  const m = document.createElement("div"), p = new Ys(), g = new Us(45, 1, 0.1, 2 * 1e6), x = new Zs(-10, 10, 10, -10, -1e3, 2e6);
  let P = g;
  const A = new qs({ antialias: true });
  A.localClippingEnabled = true;
  const M = new Qo(g, A.domElement);
  M.enableDamping = true, M.dampingFactor = 0.1, M.screenSpacePanning = true, M.zoomSpeed = 0.8, M.panSpeed = 1.2, M.rotateSpeed = 0.9, M.keyPanSpeed = 12, M.listenToKeyEvents(window), M.touches = { ONE: Bn.ROTATE, TWO: Bn.DOLLY_PAN }, A.domElement.addEventListener("wheel", (k) => {
    if (!k.ctrlKey && Math.abs(k.deltaX) > Math.abs(k.deltaY) * 1.5) {
      k.preventDefault();
      const I = M.target, H = new _().subVectors(g.position, I), N = new _();
      N.crossVectors(g.up, H).normalize();
      const me = H.length() * 1e-3 * M.panSpeed;
      I.addScaledVector(N, k.deltaX * me), g.position.addScaledVector(N, k.deltaX * me), M.update();
    }
  }, { passive: false });
  const te = new wo(new _(-1, 0, 0), 0), ae = new wo(new _(0, -1, 0), 0), de = new wo(new _(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const k = window.__hekatanClip, I = [];
    k.enableX && (te.normal.set(k.invertX ? 1 : -1, 0, 0), te.constant = k.invertX ? -k.posX : k.posX, I.push(te)), k.enableY && (ae.normal.set(0, k.invertY ? 1 : -1, 0), ae.constant = k.invertY ? -k.posY : k.posY, I.push(ae)), k.enableZ && (de.normal.set(0, 0, k.invertZ ? 1 : -1), de.constant = k.invertZ ? -k.posZ : k.posZ, I.push(de)), A.clippingPlanes = I, p.traverse((N) => {
      const ce = N;
      if (ce.material) {
        const me = Array.isArray(ce.material) ? ce.material : [ce.material];
        for (const xe of me) xe.clippingPlanes = I, xe.needsUpdate = true;
      }
    });
    const H = window.__hekatanPanes ?? [];
    for (const N of H) try {
      N && typeof N.refresh == "function" && N.refresh();
    } catch {
    }
    A.render(p, P);
  }
  se(), window.__hekatanClipApply = se;
  const E = Qs(l), ie = K.derive(() => Math.pow(10, E.displayScale.val / 10)), J = Ia(e, E), be = () => {
    const k = [];
    return E.gridXY.rawVal && k.push("xy"), E.gridXZ.rawVal && k.push("xz"), E.gridYZ.rawVal && k.push("yz"), k;
  }, ye = () => {
    const k = E.gridStep.rawVal, I = Math.max(k, E.gridMajor.rawVal);
    return { planes: be(), majorStep: I, minorStep: k };
  };
  let Y = xo(E.gridSize.rawVal, ye());
  Y.visible = E.gridVisible.rawVal, window.__hekatanSnap2D = E.cursorSnap.rawVal;
  const B = () => {
    const k = Math.max(0, Math.min(1, E.gridOpacity.rawVal));
    Y.traverse((I) => {
      const H = I.material;
      if (!H || !("opacity" in H)) return;
      const N = I.name ?? "";
      let ce = 0.35;
      N.includes("border") ? ce = 1 : N.includes("major") && (ce = 0.75), H.opacity = k * ce;
    });
  };
  B(), m.appendChild(Os(E, e, c)), m.setAttribute("id", "viewer"), m.appendChild(A.domElement), A.setPixelRatio(window.devicePixelRatio);
  const Z = an();
  A.setClearColor(Z.background, 1);
  const $ = E.gridSize.rawVal, T = $ * 0.5 + $ * 0.5 / Math.tan(45 * 0.5);
  g.position.set(0, 0, T), g.up.set(0, 1, 0), M.target.set(0, 0, 0), M.minDistance = 0.1, M.maxDistance = 1e4, m.__settings = E, M.zoomSpeed = 1, M._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, M.update();
  let U = es(E.gridSize.rawVal, E.flipAxes.rawVal);
  p.add(Y, U), K.derive(() => {
    window.__hekatanGridPlaneXY = E.gridXY.val, window.__hekatanGridPlaneXZ = E.gridXZ.val, window.__hekatanGridPlaneYZ = E.gridYZ.val;
  });
  let X = true;
  K.derive(() => {
    const k = E.gridVisible.val;
    if (X) {
      X = false;
      return;
    }
    Y.visible = k, G();
  });
  let L = true;
  K.derive(() => {
    if (E.gridOpacity.val, L) {
      L = false;
      return;
    }
    B(), G();
  }), K.derive(() => {
    const k = E.cursorSnap.val;
    window.__hekatanSnap2D = k;
  });
  let j = true;
  K.derive(() => {
    var _a2;
    const k = E.gridSize.val, I = E.flipAxes.val;
    if (E.gridXY.val, E.gridXZ.val, E.gridYZ.val, E.gridStep.val, E.gridMajor.val, j) {
      j = false;
      return;
    }
    p.remove(Y), (_a2 = Y.traverse) == null ? void 0 : _a2.call(Y, (ce) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ce.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Y = xo(k, ye()), Y.visible = E.gridVisible.rawVal, p.add(Y), B(), p.remove(U), U.traverse((ce) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ce.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = es(k, I), p.add(U);
    const H = k * 0.5 + k * 0.5 / Math.tan(45 * 0.5);
    g.position.distanceTo(M.target), Math.abs(g.position.x) < 0.1 && Math.abs(g.position.y) < 0.1 && g.position.z > 0 ? g.position.set(0, 0, H) : g.position.set(0.5 * k, -H, 0.5 * k), M.target.set(0, 0, 0), M.minDistance = Math.max(0.05, k * 0.01), M.maxDistance = Math.max(50, k * 50), M.update(), G();
  }), new ResizeObserver((k) => {
    var _a2, _b;
    for (const I of k) {
      const H = (_a2 = I.target) == null ? void 0 : _a2.clientWidth, N = (_b = I.target) == null ? void 0 : _b.clientHeight;
      if (H === 0 || N === 0) continue;
      const me = (re ? H / 2 : H) / N;
      g.aspect = me, g.updateProjectionMatrix();
      const xe = x.top;
      if (x.left = -xe * me, x.right = xe * me, x.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = me, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const ge = oe, Xe = ge.top;
        ge.left = -Xe * me, ge.right = Xe * me, ge.updateProjectionMatrix();
      }
      A.setSize(H, N), G();
    }
  }).observe(m), M.addEventListener("change", G), K.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e2 = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e2.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, E.displayScale.val, E.nodes.val, E.elements.val, (_g = E.edges) == null ? void 0 : _g.val, E.elemColumns.val, E.elemBeams.val, E.nodesIndexes.val, E.elementsIndexes.val, E.orientations.val, E.sections.val, E.secColumns.val, E.secBeams.val, E.secFloor.val, E.supports.val, E.loads.val, E.deformedShape.val, E.nodeResults.val, E.frameResults.val, E.shellResults.val, (_h = E.solidResults) == null ? void 0 : _h.val, (_i = E.extruded) == null ? void 0 : _i.val, setTimeout(G);
  });
  let re = false, oe = null, R = null, pe = false;
  function G() {
    const k = m.clientWidth || 1, I = m.clientHeight || 1;
    if (!re || !oe) {
      A.setScissorTest(false), A.setViewport(0, 0, k, I), A.render(p, P);
      return;
    }
    const H = k / 2;
    A.setScissorTest(true), A.setViewport(0, 0, H, I), A.setScissor(0, 0, H, I), A.render(p, P), A.setViewport(H, 0, H, I), A.setScissor(H, 0, H, I), A.render(p, oe), A.setScissorTest(false);
  }
  function fe(k) {
    P = k, M.object = k, M.update(), G();
  }
  function he(k, I) {
    re = k, I && (oe = I);
    const H = m.clientWidth || 1, N = m.clientHeight || 1, me = (k ? H / 2 : H) / N;
    g.isPerspectiveCamera && (g.aspect = me, g.updateProjectionMatrix());
    const xe = x.top;
    if (x.left = -xe * me, x.right = xe * me, x.updateProjectionMatrix(), k && oe) {
      if (R ? (R.object = oe, R.update()) : (R = new Qo(oe, A.domElement), R.enableDamping = true, R.dampingFactor = 0.1, R.screenSpacePanning = true, R.zoomSpeed = 0.8, R.panSpeed = 1.2, R.rotateSpeed = 0.9, R.touches = { ONE: Bn.ROTATE, TWO: Bn.DOLLY_PAN }, R.target.copy(M.target), R.addEventListener("change", G), R.enabled = false), !pe) {
        const ge = (Xe) => {
          if (!re || !R) return;
          const Ce = A.domElement.getBoundingClientRect(), Ne = Xe.clientX - Ce.left, Le = Ce.width / 2, Ze = Ne >= Le;
          M.enabled = !Ze, R.enabled = Ze;
        };
        A.domElement.addEventListener("pointerdown", ge, true), A.domElement.addEventListener("wheel", ge, { capture: true, passive: true }), pe = true;
      }
    } else k || (M.enabled = true, R && (R.enabled = false));
    m.__splitMode = k, window.__hekatanSplitMode = k, window.__hekatanSplitCamera = k ? oe : null, G();
  }
  if (e) {
    p.add(js(E, J, ie), Gs(e, E, J), na(E, J, ie), oa(e, E, J, ie), ea(e, E, J, ie), ta(e, E, J, ie), ia(e, E, J, ie), ra(e, E, J, ie), ua(e, E, J), wa(e, E, J, ie), fa(e, E, J, ie));
    const k = Ta({ scene: p, rendererElm: A.domElement, getActiveCamera: () => P, derivedNodes: J, derivedDisplayScale: ie, mesh: e, settings: E, render: G });
    p.add(k);
    const I = Ya(e, E), H = ga(e, E, J, I), N = os(I);
    p.add(H), m.appendChild(N);
    const ce = Sa(e, E, J);
    p.add(ce);
    const me = ce.__colorMapValues, xe = os(me);
    xe.id = "frame-legend", m.appendChild(xe), K.derive(() => {
      var _a2;
      const ge = E.shellResults.val != "none", Xe = (((_a2 = E.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ce = ge || Xe, Ne = E.frameResults.val.startsWith("contour:"), Le = I.val.some((Ze) => Number.isFinite(Ze));
      N.hidden = !Ce || !Le, H.visible = Ce, xe.hidden = !Ne;
    });
  }
  if (c) {
    const k = new rs(16777215, 0.5);
    p.add(k);
    const I = new qn(16777215, 0.5);
    I.position.set(30, 25, -10), I.shadow.mapSize.width = 1024, I.shadow.mapSize.height = 1024, p.add(I);
    const H = 10;
    I.shadow.camera.left = -H, I.shadow.camera.right = H, I.shadow.camera.top = H, I.shadow.camera.bottom = -H, I.shadow.camera.far = 1e3;
    const N = new qn(16777215, 0.5);
    N.color.setHSL(11, 43, 96), N.position.set(-10, 0, 30), p.add(N), K.derive(() => {
      (c == null ? void 0 : c.val.length) && (p.remove(...c.oldVal), p.add(...c.rawVal), G());
    }), K.derive(() => {
      c.rawVal.forEach((ce) => ce.visible = E.solids.val), G();
    });
  }
  if (h) {
    const k = [], I = (N) => {
      var _a2;
      return ((_a2 = N == null ? void 0 : N.userData) == null ? void 0 : _a2.isCota) ? E.showCotas.val : E.custom3D.val;
    }, H = () => {
      for (const N of k) N.visible = I(N);
      G();
    };
    K.derive(() => {
      const N = h.val;
      k.length && (p.remove(...k), k.length = 0), N.length && (p.add(...N), k.push(...N), H()), G();
    }), K.derive(() => {
      E.custom3D.val, H();
    }), K.derive(() => {
      E.showCotas.val, H();
    });
  }
  u && ya({ drawingObj: u, gridObj: Y, scene: p, getActiveCamera: () => P, controls: M, gridSize: $, derivedDisplayScale: ie, rendererElm: A.domElement, viewerRender: G }), is((k, I) => {
    var _a2;
    A.setClearColor(I.background, 1), p.remove(Y), (_a2 = Y.traverse) == null ? void 0 : _a2.call(Y, (H) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = H.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = H.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Y = xo(E.gridSize.rawVal, { planes: be() }), p.add(Y), m.style.setProperty("--awatif-legend-color", I.legendMarker), G();
  });
  const $e = { scene: p, perspCamera: g, orthoCamera: x, get camera() {
    return P;
  }, controls: M, renderer: A, rendererElm: A.domElement, render: G, setActiveCamera: fe, setSplitMode: he, get splitMode() {
    return re;
  }, get splitCamera() {
    return oe;
  }, settings: E };
  m.__ctx = $e;
  const _e = document.createElement("div");
  _e.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Be = (k, I, H) => {
    const N = document.createElement("button");
    return N.textContent = k, N.title = I, N.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), N.onmouseenter = () => {
      N.style.background = "rgba(70,70,70,0.9)";
    }, N.onmouseleave = () => {
      N.style.background = "rgba(40,40,40,0.85)";
    }, N.onclick = (ce) => {
      ce.preventDefault(), H();
    }, N;
  }, Oe = (k, I) => {
    const H = M.target, N = new _().subVectors(P.position, H), ce = N.length(), me = new _(), xe = new _();
    me.crossVectors(P.up, N).normalize(), xe.copy(P.up).normalize();
    const ge = ce * 0.05;
    H.addScaledVector(me, -k * ge), H.addScaledVector(xe, I * ge), P.position.addScaledVector(me, -k * ge), P.position.addScaledVector(xe, I * ge), M.update(), G();
  }, ut = (k) => {
    const I = new _().subVectors(P.position, M.target);
    I.multiplyScalar(k), P.position.copy(M.target).add(I), M.update(), G();
  }, Ft = () => {
    const k = document.createElement("div");
    return k.style.cssText = "width:32px;height:32px;", k;
  };
  return _e.append(Ft()), _e.append(Be("\u2191", "Pan arriba", () => Oe(0, 1))), _e.append(Be("\u2295", "Zoom in", () => ut(0.85))), _e.append(Be("\u2190", "Pan izquierda", () => Oe(-1, 0))), _e.append(Be("\u2302", "Reset vista", () => {
    M.reset(), G();
  })), _e.append(Be("\u2192", "Pan derecha", () => Oe(1, 0))), _e.append(Be("\u2296", "Zoom out", () => ut(1.18))), _e.append(Be("\u2193", "Pan abajo", () => Oe(0, -1))), _e.append(Ft()), getComputedStyle(m).position === "static" && (m.style.position = "relative"), m.appendChild(_e), m;
}
function Ia(e, l) {
  return K.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const u = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || u.length === 0) return u;
    const c = l.deformScale.val, m = l.deformScale.val * l.deformScaleZ.val, p = Number.isFinite(c) ? c : 1, g = Number.isFinite(m) ? m : 1;
    return u.map((x, P) => {
      var _a3;
      const A = ((_a3 = h.get(P)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], M = Number.isFinite(A[0]) ? A[0] : 0, te = Number.isFinite(A[1]) ? A[1] : 0, ae = Number.isFinite(A[2]) ? A[2] : 0;
      return [x[0] + M * p, x[1] + te * p, x[2] + ae * g];
    });
  });
}
const zn = K.state(null), Mo = K.state(""), Ra = K.state("kN"), Da = K.state("mm"), Ba = K.state("kN/m\xB2"), Xa = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, as = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Na = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Ya(e, l) {
  const u = K.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), K.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), de = (I, H) => {
      I == null ? void 0 : I.forEach((N, ce) => {
        const me = e.elements.val[ce];
        if (me) for (let xe = 0; xe < me.length; xe++) H.set(me[xe], [N[xe] ?? N[0]]);
      });
    };
    de((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), de((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, m), de((_f = (_e2 = e.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, p), de((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, g), de((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, x), de((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), de((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, A), de((_p = (_o2 = e.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, M), de((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, te), de((_t2 = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t2.pressure, ae);
    const se = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), ye = (I, H, N, ce, me) => {
      I.forEach((xe, ge) => {
        var _a3, _b2;
        const Xe = xe[0] ?? 0, Ce = ((_a3 = H.get(ge)) == null ? void 0 : _a3[0]) ?? 0, Ne = ((_b2 = N.get(ge)) == null ? void 0 : _b2[0]) ?? 0, Le = (Xe + Ce) / 2, Ze = Math.hypot((Xe - Ce) / 2, Ne);
        ce.set(ge, [Le + Ze]), me.set(ge, [Le - Ze]);
      });
    };
    ye(g, x, P, se, E), ye(c, m, p, ie, J), A.forEach((I, H) => {
      var _a3;
      be.set(H, [Math.hypot(I[0] ?? 0, ((_a3 = M.get(H)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const Y = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, B = (_w = l.solidResults) == null ? void 0 : _w.val, $ = B && B !== "none" ? B : l.shellResults.val, T = Y == null ? void 0 : Y[$], U = { bendingXX: [c, 0], bendingYY: [m, 0], bendingXY: [p, 0], membraneXX: [g, 0], membraneYY: [x, 0], membraneXY: [P, 0], tranverseShearX: [A, 0], tranverseShearY: [M, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [E, 0], bendingPrincipalMax: [ie, 0], bendingPrincipalMin: [J, 0], transverseShearMax: [be, 0], vonMises: [te, 0], pressure: [ae, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, X = l.shellResults.val, L = Ra.val, j = Da.val, ue = X === "displacementX" || X === "displacementY" || X === "displacementZ", re = X === "bendingXX" || X === "bendingYY" || X === "bendingXY" || X === "bendingPrincipalMax" || X === "bendingPrincipalMin", oe = X === "membraneXX" || X === "membraneYY" || X === "membraneXY" || X === "membranePrincipalMax" || X === "membranePrincipalMin", R = X === "vonMises" || X === "pressure", pe = X === "tranverseShearX" || X === "tranverseShearY" || X === "transverseShearMax", G = (_D = l.solidResults) == null ? void 0 : _D.val, fe = G === "vonMises" || G === "sigmaXX" || G === "sigmaYY" || G === "sigmaZZ" || G === "tauXY" || G === "tauYZ" || G === "tauXZ", he = G === "ux" || G === "uy" || G === "uz", $e = Ba.val, _e = fe ? Na[$e] : he || ue ? as[j] : re || oe || R || pe ? 1 / Xa[L] : 1, Be = fe ? $e : he || ue ? j : re ? `${L}\xB7m/m` : oe ? `${L}/m\xB2` : R ? `${L}/m\xB2` : pe ? `${L}/m` : "";
    Mo.val = Be, zn.val = Array.isArray(T) && T.length === 2 ? [T[0] * _e, T[1] * _e] : null;
    const Oe = us.val, Ft = G && G !== "none" ? [te, 0] : U[X], k = [];
    if (e.nodes.val.forEach((I, H) => {
      const N = Ft;
      if (!N || !N[0] || typeof N[0].has != "function") return;
      if (!N[0].has(H)) {
        k.push(Number.NaN);
        return;
      }
      const ce = N[0].get(H), me = ce ? ce[N[1]] ?? 0 : 0;
      k.push(me * _e);
    }), !zn.val && Oe !== "auto") {
      const I = e.nodes.val, H = /* @__PURE__ */ new Set(), N = (me, xe) => {
        var _a3;
        const ge = (_a3 = I[me[0]]) == null ? void 0 : _a3[xe];
        return me.every((Xe) => {
          var _a4;
          return Math.abs((((_a4 = I[Xe]) == null ? void 0 : _a4[xe]) ?? NaN) - ge) < 1e-6;
        });
      };
      for (const me of e.elements.val) {
        if (me.length !== 4) continue;
        const xe = N(me, 2), ge = !xe && N(me, 0), Xe = !xe && N(me, 1);
        if (Oe === "losas" ? xe : Oe === "muros" ? ge || Xe : Oe === "murosX" ? ge : Oe === "murosY" ? Xe : false) for (const Le of me) H.add(Le);
      }
      const ce = [];
      for (const me of H) {
        const xe = k[me];
        Number.isFinite(xe) && ce.push(xe);
      }
      ce.length && (zn.val = _o(ce));
    }
    u.val = k;
  }), u;
}
export {
  Js as a,
  os as b,
  Ra as c,
  Da as d,
  Ba as e,
  Ga as g
};
