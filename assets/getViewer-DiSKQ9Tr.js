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
    const h = 1 / this.n, c = new Zt(), w = new Zt();
    this.lut.length = 0, this.lut.push(new Zt(this.map[0][1]));
    for (let p = 1; p < u; p++) {
      const v = p * h;
      for (let x = 0; x < this.map.length - 1; x++) if (v > this.map[x][0] && v <= this.map[x + 1][0]) {
        const k = this.map[x][0], E = this.map[x + 1][0];
        c.setHex(this.map[x][1], Dn), w.setHex(this.map[x + 1][1], Dn);
        const M = new Zt().lerpColors(c, w, (v - k) / (E - k));
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
    let w = 0;
    const p = 1 / this.n, v = new Zt(), x = new Zt(), k = new Zt();
    for (let E = 1; E >= 0; E -= p) for (let M = this.map.length - 1; M >= 0; M--) if (E < this.map[M][0] && E >= this.map[M - 1][0]) {
      const te = this.map[M - 1][0], ae = this.map[M][0];
      v.setHex(this.map[M - 1][1], Dn), x.setHex(this.map[M][1], Dn), k.lerpColors(v, x, (E - te) / (ae - te)), c[w * 4] = Math.round(k.r * 255), c[w * 4 + 1] = Math.round(k.g * 255), c[w * 4 + 2] = Math.round(k.b * 255), c[w * 4 + 3] = 255, w += 1;
    }
    return u.putImageData(h, 0, 0), l;
  }
}
const yo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ps = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Hs = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ps, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Kn = K.state("safe"), us = K.state("auto");
function fs(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Hs[Kn.val] ?? ps;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, w, p, v] = l[h], [x, k, E, M] = l[h + 1];
    if (e <= x) {
      const te = (e - c) / (x - c);
      return [w + (k - w) * te, p + (E - p) * te, v + (M - v) * te];
    }
  }
  const u = l[l.length - 1];
  return [u[1], u[2], u[3]];
}
function jo() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [w, p, v] = fs(c);
    l[h * 4 + 0] = w, l[h * 4 + 1] = p, l[h * 4 + 2] = v, l[h * 4 + 3] = 255;
  }
  const u = new $s(l, 256, 1, Ls);
  return u.minFilter = qo, u.magFilter = qo, u.wrapS = Ko, u.wrapT = Ko, u.needsUpdate = true, u;
}
function Ws() {
  const l = [];
  for (let u = 0; u <= 12; u++) {
    const h = 1 - u / 12, [c, w, p] = fs(h);
    l.push(`rgb(${c | 0},${w | 0},${p | 0}) ${(u / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function _o(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((w, p) => w - p), u = (w) => l[Math.min(l.length - 1, Math.max(0, Math.round(w * (l.length - 1))))];
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
  const w = new et(new Me(), c);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", K.derive(() => {
    w.geometry.setAttribute("position", new vt(e.val.flat(), 3));
    const p = [], v = [], x = [];
    l.val.forEach((O, be) => {
      O.length === 3 ? (p.push(O[0], O[1], O[2]), v.push(be), x.push(0)) : O.length === 4 && (p.push(O[0], O[1], O[2]), p.push(O[0], O[2], O[3]), v.push(be, be), x.push(0, 1));
    }), w.geometry.setIndex(new Vs(p, 1)), w.userData.faceToElem = v, w.userData.faceLocal = x;
    const k = u.val.filter((O) => Number.isFinite(O));
    let E, M;
    const te = zn.val;
    if (te ? (M = te[0], E = te[1]) : [M, E] = _o(k), E === M) {
      const O = Math.max(Math.abs(E) * 1e-6, 1e-9);
      E += O, M -= O;
    }
    const ae = te && te[0] > te[1], de = Math.min(M, E), se = Math.max(M, E), T = se - de, ie = new Float32Array(u.val.length);
    for (let O = 0; O < u.val.length; O++) {
      const be = u.val[O];
      if (!Number.isFinite(be)) {
        ie[O] = -1;
        continue;
      }
      const N = ((ae ? se + de - be : be) - de) / T;
      ie[O] = Math.max(0, Math.min(1, N));
    }
    w.geometry.setAttribute("scalar", new pt(ie, 1));
  }), w;
}
function Os(e, l, u) {
  const h = document.createElement("div"), c = new cs({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let p = null;
  try {
    const M = localStorage.getItem(w);
    M && (p = JSON.parse(M));
  } catch {
  }
  h.style.cssText = ["position:fixed", p ? `left:${p.left}px` : "left:8px", p ? `top:${p.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const v = () => {
    const M = h.querySelector(".tp-rotv_b");
    if (!M) {
      setTimeout(v, 200);
      return;
    }
    M.style.cursor = "move", M.style.userSelect = "none";
    let te = false, ae = 0, de = 0, se = 0, T = 0;
    M.addEventListener("mousedown", (ie) => {
      te = true, ae = ie.clientX, de = ie.clientY;
      const O = h.getBoundingClientRect();
      se = O.left, T = O.top, h.style.left = `${se}px`, h.style.top = `${T}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!te) return;
      const O = ie.clientX - ae, be = ie.clientY - de, ye = Math.max(0, Math.min(window.innerWidth - 40, se + O)), N = Math.max(0, Math.min(window.innerHeight - 40, T + be));
      h.style.left = `${ye}px`, h.style.top = `${N}px`;
    }), window.addEventListener("mouseup", () => {
      if (te) {
        te = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(h.style.left), top: parseFloat(h.style.top) }));
        } catch {
        }
      }
    });
  };
  if (v(), l == null ? void 0 : l.nodes) {
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
  const x = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), k = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), E = () => {
    const M = window.__hekatanClipApply;
    typeof M == "function" && M();
  };
  return x.addBinding(k, "enableX", { label: "Cortar X" }).on("change", E), x.addBinding(k, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", E), x.addBinding(k, "invertX", { label: "  invertir X" }).on("change", E), x.addBinding(k, "enableY", { label: "Cortar Y" }).on("change", E), x.addBinding(k, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", E), x.addBinding(k, "invertY", { label: "  invertir Y" }).on("change", E), x.addBinding(k, "enableZ", { label: "Cortar Z" }).on("change", E), x.addBinding(k, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", E), x.addBinding(k, "invertZ", { label: "  invertir Z" }).on("change", E), h;
}
function Qs(e) {
  return { gridSize: K.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: K.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: K.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: K.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: K.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: K.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: K.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: K.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: K.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: K.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: K.state((e == null ? void 0 : e.nodes) ?? true), elements: K.state((e == null ? void 0 : e.elements) ?? true), edges: K.state((e == null ? void 0 : e.edges) ?? true), faces: K.state((e == null ? void 0 : e.faces) ?? true), elemColumns: K.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: K.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: K.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: K.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: K.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: K.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: K.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: K.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: K.state((e == null ? void 0 : e.orientations) ?? false), sections: K.state((e == null ? void 0 : e.sections) ?? true), extruded: K.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: K.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: K.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: K.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: K.state((e == null ? void 0 : e.secFloor) ?? -1), supports: K.state((e == null ? void 0 : e.supports) ?? true), loads: K.state((e == null ? void 0 : e.loads) ?? false), deformedShape: K.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: K.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: K.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: K.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: K.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: K.state((e == null ? void 0 : e.flipAxes) ?? false), solids: K.state((e == null ? void 0 : e.solids) ?? true), custom3D: K.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: K.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: K.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: K.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function js(e, l, u) {
  const h = an(), c = new Yn(new Me(), new Un({ color: h.nodePoint }));
  return is((w, p) => {
    c.material.color.setHex(p.nodePoint);
  }), c.frustumCulled = false, K.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new vt(l.val.flat(), 3));
  }), K.derive(() => {
    if (u.val, l.val, !e.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let p = e.gridSize.val * 0.5;
    if (w.length >= 2) {
      const x = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
      for (const E of w) for (let M = 0; M < 3; M++) x[M] = Math.min(x[M], E[M]), k[M] = Math.max(k[M], E[M]);
      p = Math.max(k[0] - x[0], k[1] - x[1], k[2] - x[2], 0.1);
    }
    const v = 0.03 * p;
    c.material.size = v * u.rawVal;
  }), K.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function xo(e, l) {
  const u = an(), h = new je();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, p = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), p <= 0 && (p = 0.1); e / p > 500; ) p *= 2;
  for (; e / w > 100; ) w *= 2;
  const v = e / 2;
  w = Math.max(p, Math.round(w / p) * p);
  const k = new Zt(u.grid), E = new Zt(u.grid).multiplyScalar(0.45), M = (se, T, ie, O) => {
    const be = [], ye = se === "xy" ? (V, Y) => [V, Y, 0] : se === "xz" ? (V, Y) => [V, 0, Y] : (V, Y) => [0, V, Y], N = Math.floor(v / T);
    for (let V = -N; V <= N; V++) {
      const Y = V * T, B = ye(Y, -v), L = ye(Y, v);
      be.push(...B, ...L);
    }
    for (let V = -N; V <= N; V++) {
      const Y = V * T, B = ye(-v, Y), L = ye(v, Y);
      be.push(...B, ...L);
    }
    const D = new Me();
    D.setAttribute("position", new vt(be, 3));
    const Z = new ct({ color: ie, transparent: true, opacity: O, depthWrite: false }), $ = new Kt(D, Z);
    return $.name = `grid-${se}-${T === p ? "minor" : "major"}`, $;
  }, te = (se, T, ie) => {
    const O = se === "xy" ? ($, V) => [$, V, 0] : se === "xz" ? ($, V) => [$, 0, V] : ($, V) => [0, $, V], be = [[-v, -v], [v, -v], [v, v], [-v, v]], ye = [];
    for (const [$, V] of be) ye.push(...O($, V));
    const N = new Me();
    N.setAttribute("position", new vt(ye, 3));
    const D = new ct({ color: T, transparent: true, opacity: ie, depthWrite: false }), Z = new ls(N, D);
    return Z.name = `grid-${se}-border`, Z.renderOrder = 1, Z;
  }, ae = (se, T, ie) => {
    const O = se === "xy" ? (D, Z) => [D, Z, 0] : se === "xz" ? (D, Z) => [D, 0, Z] : (D, Z) => [0, D, Z], be = T === "u" ? [...O(-v, 0), ...O(v, 0)] : [...O(0, -v), ...O(0, v)], ye = new Me();
    ye.setAttribute("position", new vt(be, 3));
    const N = new Kt(ye, new ct({ color: ie, transparent: true, opacity: 0.45, depthWrite: false }));
    return N.name = `grid-${se}-eje-${T}`, N.renderOrder = 1, N;
  }, de = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of c) {
    h.add(M(se, p, E, 0.12)), h.add(M(se, w, k, 0.4));
    const [T, ie] = de[se];
    h.add(ae(se, "u", T)), h.add(ae(se, "v", ie)), h.add(te(se, k, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: p, gridSize: e, planes: [...c] }, h;
}
function ea(e, l, u, h) {
  const c = new je(), w = new Is(0.5, 0.5, 0.5), p = new Rs(0.45, 0.7, 4);
  p.rotateX(Math.PI / 2), p.translate(0, 0, -0.35);
  const v = new it({ color: 10166822 }), x = new it({ color: 2792847 }), k = new it({ color: 3835647 }), E = () => {
    const ae = u.rawVal ?? [];
    if (ae.length < 2) return l.gridSize.val * 0.5;
    let de = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const T of ae) for (let ie = 0; ie < 3; ie++) T[ie] < de[ie] && (de[ie] = T[ie]), T[ie] > se[ie] && (se[ie] = T[ie]);
    return Math.max(se[0] - de[0], se[1] - de[1], se[2] - de[2], 0.1);
  }, M = () => 0.08 * E(), te = () => h.rawVal;
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const ae = M();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((de, se) => {
      const T = u.val[se];
      if (!T) return;
      const ie = de ?? [], O = (ie[0] ? 1 : 0) + (ie[1] ? 1 : 0) + (ie[2] ? 1 : 0), be = (ie[3] ? 1 : 0) + (ie[4] ? 1 : 0) + (ie[5] ? 1 : 0);
      let ye;
      O >= 3 && be >= 3 ? ye = new et(w, v) : O >= 3 && be === 0 ? ye = new et(p, x) : ye = new et(p, k), ye.position.set(T[0], T[1], T[2]);
      const N = ae * te();
      ye.scale.set(N, N, N), c.add(ye);
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
  function w(p) {
    if (p.length < 2) return 0.12 * l.gridSize.rawVal;
    const v = [1 / 0, 1 / 0, 1 / 0], x = [-1 / 0, -1 / 0, -1 / 0];
    for (const E of p) for (let M = 0; M < 3; M++) v[M] = Math.min(v[M], E[M]), x[M] = Math.max(x[M], E[M]);
    return 0.08 * Math.max(x[0] - v[0], x[1] - v[1], x[2] - v[2], 0.1);
  }
  return K.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((M) => M.dispose()), c.clear();
    const p = u.val, v = w(p), x = 240, k = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((M, te) => {
      p[te] && M.slice(0, 3).some((ae) => Math.abs(ae) > 1e-15) && k.push(te);
    });
    let E = k;
    if (k.length > x) {
      const M = k.map(($) => p[$][0]), te = k.map(($) => p[$][1]), ae = Math.min(...M), de = Math.max(...M), se = Math.min(...te), T = Math.max(...te), ie = k.map(($) => p[$][2]), O = Math.max(1e-6, (Math.max(...ie) - Math.min(...ie)) / 40), be = ($) => Math.round($ / O), ye = new Set(ie.map(be)), N = Math.max(4, Math.floor(x / Math.max(1, ye.size))), D = Math.max(2, Math.round(Math.sqrt(N))), Z = /* @__PURE__ */ new Map();
      for (const $ of k) {
        const V = de - ae < 1e-9 ? 0 : (p[$][0] - ae) / (de - ae), Y = T - se < 1e-9 ? 0 : (p[$][1] - se) / (T - se), B = Math.min(D - 1, Math.floor(V * D)), L = Math.min(D - 1, Math.floor(Y * D)), ee = `${B},${L},${be(p[$][2])}`, ue = Math.hypot(V * D - (B + 0.5), Y * D - (L + 0.5)), re = Z.get(ee);
        (!re || ue < re.d) && Z.set(ee, { i: $, d: ue });
      }
      E = [...Z.values()].map(($) => $.i);
    }
    for (const M of E) {
      const te = e.nodeInputs.val.loads.get(M), ae = p[M];
      if (!ae) continue;
      const de = new _(...te.slice(0, 3));
      if (de.lengthSq() < 1e-30) continue;
      de.normalize();
      const se = new sn(de, new _(...ae), 1, 15637248, 0.3, 0.3), T = v * h.rawVal;
      se.scale.set(T, T, T), c.add(se);
    }
  }), K.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const v = w(u.rawVal) * h.rawVal;
    c.children.forEach((x) => x.scale.set(v, v, v));
  }), K.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function na(e, l, u) {
  const h = new je();
  return K.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((w) => w.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((w, p) => {
      const v = new St(`${p}`);
      v.position.set(...w), v.updateScale(c * u.rawVal), h.add(v);
    });
  }), K.derive(() => {
    if (u.val, !e.nodesIndexes.rawVal) return;
    const c = 0.05 * e.gridSize.val * 0.6;
    h.children.forEach((w) => w.updateScale(c * u.rawVal));
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
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((p, v) => {
      const x = new St(`${v}`, void 0, "#001219");
      x.position.set(...sa(p.map((k) => u.rawVal[k]))), x.updateScale(w * h.rawVal), c.add(x);
    });
  }), K.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((p) => p.updateScale(w * h.rawVal));
  }), K.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function sa(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), u = e.length;
  return [l[0] / u, l[1] / u, l[2] / u];
}
function es(e, l) {
  const u = new je(), h = Math.min(0.05 * e, 0.6), c = an(), w = new St("X", "red", "transparent"), p = new St(l ? "Z" : "Y", "green", "transparent"), v = new St(l ? "Y" : "Z", "blue", "transparent"), x = new sn(new _(1, 0, 0), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), k = new sn(new _(0, 1, 0), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), E = new sn(new _(0, 0, 1), new _(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * h, 0, 0), p.position.set(0, 1.3 * h, 0), v.position.set(0, 0, 1.3 * h), w.updateScale(0.4 * h), p.updateScale(0.4 * h), v.updateScale(0.4 * h), x.scale.set(h, h, h), k.scale.set(h, h, h), E.scale.set(h, h, h), u.add(x, k, E, w, p, v), u;
}
function Gn(e, l) {
  const u = new _(...e), c = new _(...l).clone().sub(u), w = c.length(), p = c.dot(new _(1, 0, 0)) / w, v = c.dot(new _(0, 1, 0)) / w, x = c.dot(new _(0, 0, 1)) / w, k = Math.sqrt(p ** 2 + v ** 2);
  let E = new fo().fromArray([[p, v, x], [-v / k, p / k, 0], [-p * x / k, -v * x / k, k]].flat());
  return x === 1 && (E = new fo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), x === -1 && (E = new fo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new bo().setFromMatrix3(E);
}
function vo(e, l) {
  return e == null ? void 0 : e.map((u, h) => (9 * u + l[h]) / 10);
}
function Cn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), u = e.length;
  return [l[0] / u, l[1] / u, l[2] / u];
}
function aa(e, l, u) {
  const h = Cn([l, u]), c = Cn([e, u]), w = Cn([e, l]), p = new _(...h).sub(new _(...c)).normalize(), v = new _(...u).sub(new _(...w)).normalize(), x = p.clone().cross(v).normalize(), k = x.clone().cross(p).normalize();
  return new bo().makeBasis(p, k, x);
}
function ia(e, l, u, h) {
  const c = new je(), w = new Me(), p = new ct({ vertexColors: true }), v = [0, 0, 0], x = [1, 0, 0], k = [0, 1, 0], E = [0, 0, 1];
  w.setAttribute("position", new vt([...v, ...x, ...v, ...k, ...v, ...E], 3));
  const M = [255, 0, 0], te = [0, 255, 0], ae = [0, 0, 255];
  return w.setAttribute("color", new vt([...M, ...M, ...te, ...te, ...ae, ...ae], 3)), K.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((de) => {
      const se = new Kt(w, p), T = u.rawVal[de[0]], ie = u.rawVal[de[1]];
      if (de.length === 2 && (se.position.set(...vo(T, ie)), se.rotation.setFromRotationMatrix(Gn(T, ie))), de.length === 3) {
        const ye = u.rawVal[de[2]];
        se.position.set(...Cn([T, ie, ye])), se.rotation.setFromRotationMatrix(aa(T, ie, ye));
      }
      const be = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      se.scale.set(be, be, be), c.add(se);
    }));
  }), K.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((T) => T.scale.set(se, se, se));
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
  const c = new je(), w = new je();
  c.add(w);
  function p(D, Z) {
    const $ = D / 2, V = Z / 2, Y = new Float32Array([0, -$, -V, 0, $, -V, 0, $, V, 0, -$, -V, 0, $, V, 0, -$, V]), B = new Me();
    B.setAttribute("position", new pt(Y, 3));
    const L = new Float32Array([0, -$, -V, 0, $, -V, 0, $, V, 0, -$, V, 0, -$, -V]), ee = new Me();
    return ee.setAttribute("position", new pt(L, 3)), { fill: B, outline: ee };
  }
  function v(D, Z = 24) {
    const $ = D / 2, V = new Float32Array(Z * 9);
    for (let ee = 0; ee < Z; ee++) {
      const ue = ee / Z * Math.PI * 2, re = (ee + 1) / Z * Math.PI * 2;
      V[ee * 9] = 0, V[ee * 9 + 1] = 0, V[ee * 9 + 2] = 0, V[ee * 9 + 3] = 0, V[ee * 9 + 4] = $ * Math.cos(ue), V[ee * 9 + 5] = $ * Math.sin(ue), V[ee * 9 + 6] = 0, V[ee * 9 + 7] = $ * Math.cos(re), V[ee * 9 + 8] = $ * Math.sin(re);
    }
    const Y = new Me();
    Y.setAttribute("position", new pt(V, 3));
    const B = new Float32Array((Z + 1) * 3);
    for (let ee = 0; ee <= Z; ee++) {
      const ue = ee / Z * Math.PI * 2;
      B[ee * 3] = 0, B[ee * 3 + 1] = $ * Math.cos(ue), B[ee * 3 + 2] = $ * Math.sin(ue);
    }
    const L = new Me();
    return L.setAttribute("position", new pt(B, 3)), { fill: Y, outline: L };
  }
  function x(D, Z, $, V) {
    const Y = $ ?? Z * 0.08, B = V ?? D * 0.07, L = D / 2, ee = Z / 2, ue = ee - Y, re = B / 2, oe = [];
    function R(he, $e, _e, Be) {
      oe.push(0, he, $e, 0, _e, $e, 0, _e, Be, 0, he, $e, 0, _e, Be, 0, he, Be);
    }
    R(-L, -ee, L, -ue), R(-re, -ue, re, ue), R(-L, ue, L, ee);
    const pe = new Me();
    pe.setAttribute("position", new pt(new Float32Array(oe), 3));
    const H = new Float32Array([0, -L, -ee, 0, L, -ee, 0, L, -ue, 0, re, -ue, 0, re, ue, 0, L, ue, 0, L, ee, 0, -L, ee, 0, -L, ue, 0, -re, ue, 0, -re, -ue, 0, -L, -ue, 0, -L, -ee]), fe = new Me();
    return fe.setAttribute("position", new pt(H, 3)), { fill: pe, outline: fe };
  }
  function k(D, Z, $) {
    const V = D / 2, Y = Z / 2, B = V - $, L = Y - $, ee = [];
    function ue(pe, H, fe, he) {
      ee.push(0, pe, H, 0, fe, H, 0, fe, he, 0, pe, H, 0, fe, he, 0, pe, he);
    }
    ue(-V, -Y, V, -L), ue(-V, L, V, Y), ue(-V, -L, -B, L), ue(B, -L, V, L);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(ee), 3));
    const oe = new Float32Array([0, -V, -Y, 0, V, -Y, 0, V, -Y, 0, V, Y, 0, V, Y, 0, -V, Y, 0, -V, Y, 0, -V, -Y, 0, -B, -L, 0, B, -L, 0, B, -L, 0, B, L, 0, B, L, 0, -B, L, 0, -B, L, 0, -B, -L]), R = new Me();
    return R.setAttribute("position", new pt(oe, 3)), { fill: re, outline: R };
  }
  function E(D, Z, $) {
    const V = D / 2, Y = Z / 2, B = V - $, L = Y - $, ee = new Me(), ue = new Float32Array([0, -B, -L, 0, B, -L, 0, B, L, 0, -B, -L, 0, B, L, 0, -B, L]);
    ee.setAttribute("position", new pt(ue, 3));
    const re = [];
    function oe(fe, he, $e, _e) {
      re.push(0, fe, he, 0, $e, he, 0, $e, _e, 0, fe, he, 0, $e, _e, 0, fe, _e);
    }
    oe(-V, -Y, V, -L), oe(-V, L, V, Y), oe(-V, -L, -B, L), oe(B, -L, V, L);
    const R = new Me();
    R.setAttribute("position", new pt(new Float32Array(re), 3));
    const pe = new Float32Array([0, -V, -Y, 0, V, -Y, 0, V, -Y, 0, V, Y, 0, V, Y, 0, -V, Y, 0, -V, Y, 0, -V, -Y, 0, -B, -L, 0, B, -L, 0, B, -L, 0, B, L, 0, B, L, 0, -B, L, 0, -B, L, 0, -B, -L]), H = new Me();
    return H.setAttribute("position", new pt(pe, 3)), { concFill: ee, steelFillGeom: R, outline: H };
  }
  function M(D, Z, $) {
    const V = [], Y = [[0, -D / 2, -Z / 2], [0, -D / 2 + $, -Z / 2], [0, -D / 2 + $, Z / 2 - $], [0, D / 2, Z / 2 - $], [0, D / 2, Z / 2], [0, -D / 2, Z / 2]], B = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const re of B) V.push(...Y[re]);
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(V), 3));
    const ee = [];
    for (let re = 0; re < Y.length; re++) {
      const oe = (re + 1) % Y.length;
      ee.push(...Y[re], ...Y[oe]);
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(ee), 3)), { fill: L, outline: ue };
  }
  function te(D, Z, $, V) {
    const Y = V / 2, B = [], L = [[0, -D - Y, -Z / 2], [0, -$ - Y, -Z / 2], [0, -$ - Y, Z / 2 - $], [0, -Y, Z / 2 - $], [0, -Y, Z / 2], [0, -D - Y, Z / 2]], ee = [[0, Y, -Z / 2], [0, Y + $, -Z / 2], [0, Y + $, Z / 2 - $], [0, D + Y, Z / 2 - $], [0, D + Y, Z / 2], [0, Y, Z / 2]], ue = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of ue) B.push(...L[pe]);
    for (const pe of ue) B.push(...ee[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(B), 3));
    const oe = [];
    for (const pe of [L, ee]) for (let H = 0; H < pe.length; H++) {
      const fe = (H + 1) % pe.length;
      oe.push(...pe[H], ...pe[fe]);
    }
    const R = new Me();
    return R.setAttribute("position", new pt(new Float32Array(oe), 3)), { fill: re, outline: R };
  }
  function ae(D, Z, $, V) {
    const Y = Z / 2, B = D, L = [[0, -B, -Y], [0, -B, -Y + $], [0, -V, -Y + $], [0, -V, Y - $], [0, -B, Y - $], [0, -B, Y], [0, 0, Y], [0, 0, -Y]], ee = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ue = [];
    for (const pe of ee) ue.push(...L[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(ue), 3));
    const oe = [];
    for (let pe = 0; pe < L.length; pe++) {
      const H = (pe + 1) % L.length;
      oe.push(...L[pe], ...L[H]);
    }
    const R = new Me();
    return R.setAttribute("position", new pt(new Float32Array(oe), 3)), { fill: re, outline: R };
  }
  function de(D, Z, $, V, Y) {
    const B = Z / 2, L = Y / 2, ee = [], ue = [[0, -D, -B], [0, -D, -B + $], [0, -L - V, -B + $], [0, -L - V, B - $], [0, -D, B - $], [0, -D, B], [0, -L, B], [0, -L, -B]], re = ue.map((fe) => [fe[0], -fe[1], fe[2]]), oe = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const fe of oe) ee.push(...ue[fe]);
    for (const fe of oe) ee.push(...re[fe]);
    const R = new Me();
    R.setAttribute("position", new pt(new Float32Array(ee), 3));
    const pe = [];
    for (const fe of [ue, re]) for (let he = 0; he < fe.length; he++) {
      const $e = (he + 1) % fe.length;
      pe.push(...fe[he], ...fe[$e]);
    }
    const H = new Me();
    return H.setAttribute("position", new pt(new Float32Array(pe), 3)), { fill: R, outline: H };
  }
  function se(D, Z, $, V) {
    const Y = D / 2, B = Z / 2, L = V / 2, ee = [[0, -L, -B], [0, L, -B], [0, L, B - $], [0, Y, B - $], [0, Y, B], [0, -Y, B], [0, -Y, B - $], [0, -L, B - $]], ue = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], re = [];
    for (const H of ue) re.push(...ee[H]);
    const oe = new Me();
    oe.setAttribute("position", new pt(new Float32Array(re), 3));
    const R = [];
    for (let H = 0; H < ee.length; H++) {
      const fe = (H + 1) % ee.length;
      R.push(...ee[H], ...ee[fe]);
    }
    const pe = new Me();
    return pe.setAttribute("position", new pt(new Float32Array(R), 3)), { fill: oe, outline: pe };
  }
  function T(D, Z, $ = 24) {
    const V = D / 2, Y = V - Z, B = [];
    for (let re = 0; re < $; re++) {
      const oe = re / $ * Math.PI * 2, R = (re + 1) / $ * Math.PI * 2, pe = Math.cos(oe), H = Math.sin(oe), fe = Math.cos(R), he = Math.sin(R);
      B.push(0, V * pe, V * H, 0, V * fe, V * he, 0, Y * fe, Y * he), B.push(0, V * pe, V * H, 0, Y * fe, Y * he, 0, Y * pe, Y * H);
    }
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(B), 3));
    const ee = [];
    for (let re = 0; re < $; re++) {
      const oe = re / $ * Math.PI * 2, R = (re + 1) / $ * Math.PI * 2;
      ee.push(0, V * Math.cos(oe), V * Math.sin(oe), 0, V * Math.cos(R), V * Math.sin(R)), ee.push(0, Y * Math.cos(oe), Y * Math.sin(oe), 0, Y * Math.cos(R), Y * Math.sin(R));
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(ee), 3)), { fill: L, outline: ue };
  }
  const ie = new it({ color: 52479, transparent: true, opacity: 0.35, side: kt, depthWrite: false }), O = new ct({ color: 52479 }), be = new it({ color: 16750848, transparent: true, opacity: 0.4, side: kt, depthWrite: false }), ye = new ct({ color: 16750848 });
  function N(D, Z) {
    const $ = Math.abs(Z[0] - D[0]), V = Math.abs(Z[1] - D[1]), Y = Math.abs(Z[2] - D[2]);
    return Y > $ && Y > V || V > $ && V > Y;
  }
  return K.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const D = l.secColumns.rawVal, Z = l.secBeams.rawVal;
    if (!D && !Z) {
      c.children.forEach((L) => {
        L instanceof St && L.dispose();
      }), c.clear();
      return;
    }
    c.children.forEach((L) => {
      L instanceof St && L.dispose();
    }), c.clear();
    const $ = (_a2 = e.elements) == null ? void 0 : _a2.val, V = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!$ || !V) return;
    const Y = V.sectionShapes, B = l.secFloor.rawVal;
    $.forEach((L, ee) => {
      if (L.length !== 2) return;
      const ue = u.rawVal[L[0]], re = u.rawVal[L[1]];
      if (!ue || !re) return;
      const oe = N(ue, re);
      if (oe && !D || !oe && !Z) return;
      if (B >= 0) {
        const he = Math.min(ue[1], re[1]);
        Math.max(ue[1], re[1]);
        const $e = l.gridSize.rawVal || 3;
        if (Math.floor(he / $e + 0.01) !== B) return;
      }
      const R = Y == null ? void 0 : Y.get(ee);
      if (!R) return;
      const pe = [(ue[0] + re[0]) / 2, (ue[1] + re[1]) / 2, (ue[2] + re[2]) / 2], H = Gn(ue, re);
      if (R.type === "CFT") {
        const he = E(R.b, R.h, R.tw ?? R.b * 0.05), $e = new et(he.concFill, ie);
        $e.position.set(...pe), $e.rotation.setFromRotationMatrix(H), c.add($e);
        const _e = new et(he.steelFillGeom, be);
        _e.position.set(...pe), _e.rotation.setFromRotationMatrix(H), c.add(_e);
        const Be = new _t(he.outline, ye);
        Be.position.set(...pe), Be.rotation.setFromRotationMatrix(H), c.add(Be);
      } else {
        let he, $e, _e;
        switch (R.type) {
          case "rect":
            he = p(R.b, R.h), $e = ie, _e = O;
            break;
          case "circ":
            he = v(R.d), $e = ie, _e = O;
            break;
          case "I":
            he = x(R.b, R.h, R.tf, R.tw), $e = be, _e = ye;
            break;
          case "HSS":
            he = k(R.b, R.h, R.tw ?? R.b * 0.05), $e = be, _e = ye;
            break;
          case "CFT":
            he = E(R.b, R.h, R.tw ?? R.b * 0.05), $e = be, _e = ye;
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
            he = T(R.d, R.tw ?? R.d * 0.05), $e = be, _e = ye;
            break;
          default:
            return;
        }
        const Be = new et(he.fill, $e);
        Be.position.set(...pe), Be.rotation.setFromRotationMatrix(H), c.add(Be);
        const Oe = new _t(he.outline, _e);
        Oe.position.set(...pe), Oe.rotation.setFromRotationMatrix(H), c.add(Oe);
      }
      const fe = la(R);
      if (fe) {
        const $e = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(R.type) ? "#ff9900" : "#00ccff", _e = new St(fe, $e, "transparent");
        _e.position.set(pe[0], pe[1], pe[2]);
        const Be = 0.05 * l.gridSize.rawVal * 0.5;
        _e.updateScale(Be * ((h == null ? void 0 : h.rawVal) ?? 1)), w.add(_e);
      }
    });
  }), h && K.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const D = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((Z) => {
      Z instanceof St && Z.updateScale(D * h.rawVal);
    });
  }), K.derive(() => {
    c.visible = l.sections.val;
  }), K.derive(() => {
    w.visible = l.sectionLabels.val;
  }), c;
}
function ca(e) {
  if (!e) return null;
  const l = e.type, u = (E, M) => [E, M], h = (E, M) => [u(-E / 2, -M / 2), u(E / 2, -M / 2), u(E / 2, M / 2), u(-E / 2, M / 2)], c = (E, M = 24) => {
    const te = E / 2, ae = [];
    for (let de = 0; de < M; de++) {
      const se = 2 * Math.PI * de / M;
      ae.push(u(te * Math.cos(se), te * Math.sin(se)));
    }
    return ae;
  }, w = e.b ?? 0, p = e.h ?? 0, v = e.d ?? 0, x = e.tw ?? e.t ?? 0, k = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return w && p ? { contorno: h(w, p) } : null;
    case "circ":
      return v ? { contorno: c(v) } : null;
    case "pipe":
      return v && x ? { contorno: c(v), huecos: [c(v - 2 * x).reverse()] } : null;
    case "HSS":
      return w && p && x ? { contorno: h(w, p), huecos: [h(w - 2 * x, p - 2 * (k || x)).reverse()] } : null;
    case "CFT":
      return w && p ? { contorno: h(w, p) } : null;
    case "I":
      return w && p && x && k ? { contorno: [u(-w / 2, -p / 2), u(w / 2, -p / 2), u(w / 2, -p / 2 + k), u(x / 2, -p / 2 + k), u(x / 2, p / 2 - k), u(w / 2, p / 2 - k), u(w / 2, p / 2), u(-w / 2, p / 2), u(-w / 2, p / 2 - k), u(-x / 2, p / 2 - k), u(-x / 2, -p / 2 + k), u(-w / 2, -p / 2 + k)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && p && x && k ? { contorno: [u(-w / 2, -p / 2), u(w / 2, -p / 2), u(w / 2, -p / 2 + k), u(-w / 2 + x, -p / 2 + k), u(-w / 2 + x, p / 2 - k), u(w / 2, p / 2 - k), u(w / 2, p / 2), u(-w / 2, p / 2)] } : null;
    case "T":
      return w && p && x && k ? { contorno: [u(-x / 2, -p / 2), u(x / 2, -p / 2), u(x / 2, p / 2 - k), u(w / 2, p / 2 - k), u(w / 2, p / 2), u(-w / 2, p / 2), u(-w / 2, p / 2 - k), u(-x / 2, p / 2 - k)] } : null;
    case "L":
    case "2L":
      return w && p && x ? { contorno: [u(-w / 2, -p / 2), u(w / 2, -p / 2), u(w / 2, -p / 2 + x), u(-w / 2 + x, -p / 2 + x), u(-w / 2 + x, p / 2), u(-w / 2, p / 2)] } : null;
    default:
      return w && p ? { contorno: h(w, p) } : v ? { contorno: c(v) } : null;
  }
}
function da(e, l, u) {
  if (!e || e <= 0 || !l || !u || l <= 0 || u <= 0) return null;
  const h = Math.sqrt(Math.sqrt(u / l)), c = Math.sqrt(e / h), w = e / c;
  return !isFinite(c) || !isFinite(w) || c <= 0 || w <= 0 ? null : { contorno: [[-c / 2, -w / 2], [c / 2, -w / 2], [c / 2, w / 2], [-c / 2, w / 2]] };
}
function pa(e) {
  const l = new Pn();
  e.contorno.forEach(([u, h], c) => c ? l.lineTo(u, h) : l.moveTo(u, h)), l.closePath();
  for (const u of e.huecos ?? []) {
    const h = new Bs();
    u.forEach(([c, w], p) => p ? h.lineTo(c, w) : h.moveTo(c, w)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function ua(e, l, u) {
  const h = new je();
  h.name = "extrusion";
  const c = new ho({ color: 8369151, transparent: true, opacity: 0.92, side: kt }), w = new ho({ color: 12623968, transparent: true, opacity: 0.85, side: kt }), p = new ho({ color: 11583173, transparent: true, opacity: 0.85, side: kt }), v = new je();
  v.add(new rs(16777215, 0.55));
  const x = new qn(16777215, 0.75);
  x.position.set(30, 25, 40);
  const k = new qn(16777215, 0.35);
  k.position.set(-25, -20, 15), v.add(x, k);
  let E = 0;
  return K.derive(() => {
    var _a2, _b, _c, _d, _e;
    const M = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++E, on: M }, h.visible = M;
    for (const O of [...h.children]) O !== v && (h.remove(O), (_c = (_b = O.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(v) || h.add(v), !M) return;
    const te = u.val ?? [], ae = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], de = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = de.sectionShapes ?? /* @__PURE__ */ new Map(), T = de.thicknesses ?? /* @__PURE__ */ new Map();
    let ie = "";
    try {
      ae.forEach((O, be) => {
        var _a3, _b2, _c2;
        if (O.length === 2) {
          let ye = ca(se.get(be)), N = true;
          if (ye || (ye = da((_a3 = de.areas) == null ? void 0 : _a3.get(be), (_b2 = de.momentsOfInertiaY) == null ? void 0 : _b2.get(be), (_c2 = de.momentsOfInertiaZ) == null ? void 0 : _c2.get(be)), N = false), !ye) return;
          const D = te[O[0]], Z = te[O[1]];
          if (!D || !Z) return;
          const $ = Math.hypot(Z[0] - D[0], Z[1] - D[1], Z[2] - D[2]);
          if ($ < 1e-9) return;
          const V = new Ds(pa(ye), { depth: $, bevelEnabled: false, curveSegments: 4 });
          V.applyMatrix4(new bo().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const Y = new et(V, N ? c : w);
          Y.position.set(D[0], D[1], D[2]), Y.rotation.setFromRotationMatrix(Gn(D, Z)), h.add(Y);
          return;
        }
        if (O.length === 3 || O.length === 4) {
          const ye = T.get(be);
          if (!ye || ye <= 0) return;
          const N = O.map((H) => te[H]).filter(Boolean);
          if (N.length < 3) return;
          const D = [N[1][0] - N[0][0], N[1][1] - N[0][1], N[1][2] - N[0][2]], Z = [N[2][0] - N[0][0], N[2][1] - N[0][1], N[2][2] - N[0][2]], $ = D[1] * Z[2] - D[2] * Z[1], V = D[2] * Z[0] - D[0] * Z[2], Y = D[0] * Z[1] - D[1] * Z[0], B = Math.hypot($, V, Y);
          if (B < 1e-12) return;
          const L = [$ / B, V / B, Y / B], ee = [], ue = (H) => N.map((fe) => [fe[0] + L[0] * H, fe[1] + L[1] * H, fe[2] + L[2] * H]), re = ue(+ye / 2), oe = ue(-ye / 2), R = (H, fe, he) => ee.push(...H, ...fe, ...he);
          for (const H of [re, oe]) R(H[0], H[1], H[2]), H.length === 4 && R(H[0], H[2], H[3]);
          for (let H = 0; H < N.length; H++) {
            const fe = (H + 1) % N.length;
            R(re[H], oe[H], oe[fe]), R(re[H], oe[fe], re[fe]);
          }
          const pe = new Me();
          pe.setAttribute("position", new vt(ee, 3)), pe.computeVertexNormals(), h.add(new et(pe, p));
        }
      });
    } catch (O) {
      ie = String((O == null ? void 0 : O.message) ?? O);
    }
    globalThis.__extrusionDebug = { corridas: E, on: M, fallo: ie, nElementos: ae.length, nFormas: se.size, nEspesores: T.size, mallas: h.children.length - 1 };
  }), h;
}
class Xn extends je {
  constructor(l, u, h, c, w, p, v) {
    super();
    const x = new Pn().moveTo(0, 0).lineTo(0, p[1]).lineTo(h, p[1]).lineTo(h, 0).lineTo(0, 0), k = x.getPoints(), E = new Me().setFromPoints(k);
    this.lines = new _t(E, new ct({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), v && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const M = new Zn(x), te = new it({ color: p[1] > 0 ? 24435 : 11411474, side: kt });
    this.mesh = new et(M, te), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), v && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new St(`${w[1].toFixed(4)}`), this.normalizedResult = p, this.textPosition = Cn([l, u]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class ts extends je {
  constructor(l, u, h, c, w, p, v) {
    super();
    const x = w[0] * h / (w[0] + w[1]), k = w[0] * w[1] > 0;
    if (this.text = new St(`${w[0].toFixed(4)}`), this.text2 = new St(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = p, this.textPosition = vo(l, u), this.text2Position = vo(u, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), k) {
      const E = new Pn().moveTo(0, 0).lineTo(0, p[0]).lineTo(x, 0).lineTo(0, 0), M = new Pn().moveTo(x, 0).lineTo(h, -p[1]).lineTo(h, 0).lineTo(x, 0), te = E.getPoints(), ae = M.getPoints(), de = new Me().setFromPoints(te), se = new Me().setFromPoints(ae), T = new ct({ color: an().resultOutline });
      this.lines = new _t(de, T), this.lines2 = new _t(se, T), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), v && this.lines.rotateX(Math.PI / 2), v && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ie = new Zn(E), O = new Zn(M), be = new it({ color: p[0] > 0 ? 24435 : 11411474, side: kt }), ye = new it({ color: -p[1] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(ie, be), this.mesh2 = new et(O, ye), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), v && this.mesh.rotateX(Math.PI / 2), v && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const E = new Pn().moveTo(0, 0).lineTo(0, p[0]).lineTo(h, -p[1]).lineTo(h, 0).lineTo(0, 0), M = E.getPoints(), te = new Me().setFromPoints(M);
      this.lines = new _t(te, new ct({ color: an().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), v && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ae = new Zn(E), de = new it({ color: p[0] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(ae, de), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), v && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
  const c = new je(), w = { normals: Xn, shearsY: Xn, shearsZ: Xn, torsions: Xn, bendingsY: ts, bendingsZ: ts };
  return K.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, u.val, l.frameResults.val == "none") return;
    c.children.forEach((v) => v.dispose()), c.clear();
    const p = hs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[p]) == null ? void 0 : _b.forEach((v, x) => {
      var _a3, _b2;
      const k = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[x]) ?? [0, 1], E = u.rawVal[k[0]], M = u.rawVal[k[1]];
      if (!E || !M) return;
      const te = new _(...M).distanceTo(new _(...E)), ae = ha((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[p]), de = v == null ? void 0 : v.map((O) => O / (ae === 0 ? 1 : ae)), se = Gn(E, M), T = new w[p](E, M, te, se, v ?? [0, 0], de ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(p)), ie = 0.05 * l.gridSize.rawVal;
      T.updateScale(ie * h.rawVal), c.add(T);
    });
  }), K.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    const p = 0.05 * l.gridSize.val;
    c.children.forEach((v) => v.updateScale(p * h.rawVal));
  }), K.derive(() => {
    c.visible = l.frameResults.val != "none";
  }), c;
}
function ha(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((u) => {
    const h = Math.max(...(u ?? [0, 0]).map((c) => Math.abs(c)));
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
    c.children.forEach((v) => v.dispose()), c.clear();
    const w = So[l.nodeResults.rawVal], p = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[w]) == null ? void 0 : _b.forEach((v, x) => {
      const k = new ma(u.rawVal[x], w, v ?? [0, 0, 0, 0, 0, 0]);
      k.updateScale(p * h.rawVal), c.add(k);
    });
  }), K.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    c.children.forEach((p) => p.updateScale(w * h.rawVal));
  }), K.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function ya({ drawingObj: e, gridObj: l, scene: u, getActiveCamera: h, controls: c, gridSize: w, derivedDisplayScale: p, rendererElm: v, viewerRender: x }) {
  const k = new Xs(), E = new Ns(), M = (t) => {
    const o = v.getBoundingClientRect(), a = t.clientX - o.left, n = t.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const d = s / 2;
      if (a >= d) return E.x = (a - d) / d * 2 - 1, E.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      E.x = a / d * 2 - 1;
    } else E.x = a / s * 2 - 1;
    return E.y = -(n / i) * 2 + 1, h();
  }, te = new et(new en(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
  te.visible = true, te.frustumCulled = false, u.add(te);
  const ae = (t, o, a) => {
    const n = new et(new en(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, a), n.visible = false, n.frustumCulled = false, u.add(n), n;
  }, de = ae(Math.PI / 2, 0, 0), se = ae(0, Math.PI / 2, 0);
  let T = false;
  const ie = () => {
    if (T) return k.intersectObjects([te], false);
    if (de.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ce.visible) {
      const a = k.intersectObjects([Ce, Ne, Le], false);
      if (a.length > 0) return a;
    }
    const o = [te];
    return de.visible && o.push(de), se.visible && o.push(se), qt.visible && Ht.length > 0 && o.push(...Ht), k.intersectObjects(o, false);
  }, O = new Yn(new Me(), new Un()), be = new Yn(new Me(), new Un({ color: "gray", sizeAttenuation: false, size: 6 })), ye = new Yn(new Me(), new Un({ color: "orange", sizeAttenuation: false, size: 5 }));
  u.add(ye);
  const N = document.createElement("input");
  N.id = "hk-rubber-label", N.type = "text", N.spellcheck = false, N.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, N.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(N);
  let D = null, Z = null, $ = false;
  const V = new _(), Y = (t, o, a, n, s, i) => {
    const r = n - t, d = s - o, g = i - a, m = Math.hypot(r, d, g);
    if (m < 0.01) {
      N.style.display = "none";
      return;
    }
    D = [t, o, a], Z = [r / m, d / m, g / m], V.set((t + n) / 2, (o + s) / 2, (a + i) / 2), V.project(h());
    const b = v.getBoundingClientRect(), z = b.left + (V.x * 0.5 + 0.5) * b.width, f = b.top + (-V.y * 0.5 + 0.5) * b.height;
    if (N.style.left = z + "px", N.style.top = f + "px", N.style.display = "block", !$) {
      if (N.value = `${m.toFixed(2)} m`, document.activeElement !== N) {
        const A = document.activeElement;
        A && (A.tagName === "INPUT" || A.tagName === "TEXTAREA") && A !== N || N.focus({ preventScroll: true });
      }
      try {
        N.select();
      } catch {
      }
    }
  }, B = () => {
    N.style.display = "none", D = null, Z = null, $ = false, document.activeElement === N && N.blur();
  }, L = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      nn = t, ne(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), N.blur();
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
      mt = t, ne(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), N.blur();
      return;
    }
    if (!D || !Z || !e.polylines) return;
    let a = Z[0], n = Z[1], s = Z[2];
    Ie === "x" ? (a = Math.sign(a) || 1, n = 0, s = 0) : Ie === "y" ? (a = 0, n = Math.sign(n) || 1, s = 0) : Ie === "z" && (a = 0, n = 0, s = Math.sign(s) || 1);
    const i = D[0] + a * t, r = D[1] + n * t, d = D[2] + s * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, d]];
    const g = e.polylines.rawVal, m = g.length ? g[g.length - 1] : [];
    e.polylines.val = [...g.slice(0, -1), [...m, e.points.rawVal.length - 1]], N.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    x();
  }, ee = (t) => {
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
        const [i, r, d] = s;
        return { kind: "relSpherical", L: i, az: r, el: d };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((g) => parseFloat(g.trim()));
      if (s.some(isNaN)) return null;
      const [i, r, d = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: r, dz: d } : { kind: "absCart", x: i, y: r, z: d };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, ue = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return D ? [D[0] + t.dx, D[1] + t.dy, D[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!D) return null;
      const o = t.ang * Math.PI / 180;
      return [D[0] + t.L * Math.cos(o), D[1] + t.L * Math.sin(o), D[2]];
    }
    if (t.kind === "relSpherical") {
      if (!D) return null;
      const o = t.az * Math.PI / 180, a = t.el * Math.PI / 180, n = t.L * Math.cos(a);
      return [D[0] + n * Math.cos(o), D[1] + n * Math.sin(o), D[2] + t.L * Math.sin(a)];
    }
    return null;
  }, re = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], D = t, N.blur();
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
    const o = ee(t);
    if (!o) return false;
    if (o.kind === "length") return L(o.L), true;
    const a = ue(o);
    if (!a) return false;
    Xo(new _(a[0], a[1], a[2]), null), D = a, N.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, N.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const a = ee(N.value);
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
      t.preventDefault(), $ = false, N.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!$ && N.style.display === "block") try {
          N.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && ($ = true);
  }), window.addEventListener("keydown", (t) => {
    if (!D || !Z || document.activeElement === N) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (N.value = t.key, N.focus(), N.setSelectionRange(1, 1), t.preventDefault());
  });
  const oe = document.createElement("div");
  oe.id = "hk-coord-readout", oe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", oe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(oe);
  const R = document.createElement("div");
  R.id = "hk-coord-fixed", R.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", R.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(R);
  const pe = new _t(new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), new Sn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", u.add(pe), window.__hekatanRubberBand = pe;
  const H = new _t(new Me(), new ct({ color: 2282478, transparent: true, opacity: 0.9 }));
  H.frustumCulled = false, H.visible = false, u.add(H);
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
  }, S = Ft(16711680), I = Ft(65280), W = Ft(35071);
  ut.add(S, I, W);
  const X = (t) => {
    const o = new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0), new _(0, 0, 0), new _(0, 0, 0)]), a = new ct({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new ls(o, a);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, ce = X(3462041), me = X(16724804), xe = X(6333946), ge = new je();
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
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== N) return;
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
    return Ie === "x" ? (Bt.set(o - 1e4, a, n), Ge.set(o + 1e4, a, n)) : Ie === "y" ? (Bt.set(o, a - 1e4, n), Ge.set(o, a + 1e4, n)) : (Bt.set(o, a, n - 1e4), Ge.set(o, a, n + 1e4)), k.ray.distanceSqToSegment(Bt, Ge, null, Ye), Ye;
  };
  window.__hekatanProjectOnAxis = ze;
  const Ee = new _t(new Me().setFromPoints([new _(0, 0, 0), new _(0, 0, 0)]), new ct({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Ee.renderOrder = 998, Ee.frustumCulled = false, Ee.visible = false, u.add(Ee);
  let ve = -1, Je = -1, Qe = -1;
  const ke = /* @__PURE__ */ new Set();
  window.__hekatanSelection = ke;
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
    for (let d = 0; d < s.length; d++) {
      const g = s[d];
      if (!g) continue;
      const m = Math.hypot(t - g[0], o - g[1], a - g[2]);
      m < r && (r = m, i = d);
    }
    return i;
  }, Mt = () => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    for (; Ct.children.length; ) {
      const r = Ct.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of ke) {
      const [d, ...g] = r.split(":");
      if (d === "pt") {
        const m = t[+g[0]];
        if (!m) continue;
        const b = new et(new xn(0.025, 12, 12), new it({ color: Yt, transparent: true, opacity: 0.9, depthTest: false }));
        b.position.set(m[0], m[1], m[2]), b.renderOrder = 999, b.__isSelectionPt = true, Ct.add(b);
      } else if (d === "seg") {
        const m = o[+g[0]], b = t[m == null ? void 0 : m[+g[1]]], z = t[m == null ? void 0 : m[+g[1] + 1]];
        if (!b || !z) continue;
        const f = new Me().setFromPoints([new _(b[0], b[1], b[2]), new _(z[0], z[1], z[2])]), A = new _t(f, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        A.renderOrder = 999, Ct.add(A);
      } else if (d === "poly") {
        const b = o[+g[0]].map((A) => {
          const j = t[A];
          return j ? new _(j[0], j[1], j[2]) : null;
        }).filter(Boolean);
        if (b.length < 2) continue;
        const z = new Me().setFromPoints(b), f = new _t(z, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        f.renderOrder = 999, Ct.add(f);
      } else if (d === "aux") {
        const m = n[+g[0]];
        if (!m || m.length !== 6) continue;
        const b = new Me().setFromPoints([new _(m[0], m[1], m[2]), new _(m[3], m[4], m[5])]), z = new _t(b, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        z.renderOrder = 999, Ct.add(z);
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
    ke.clear(), Mt();
  };
  const Ot = (t, o, a, n, s, i, r, d, g) => {
    const m = r - n, b = d - s, z = g - i, f = m * m + b * b + z * z;
    if (f < 1e-12) return Math.hypot(t - n, o - s, a - i);
    let A = ((t - n) * m + (o - s) * b + (a - i) * z) / f;
    A = Math.max(0, Math.min(1, A));
    const j = n + A * m, C = s + A * b, P = i + A * z;
    return Math.hypot(t - j, o - C, a - P);
  }, ln = (t, o, a, n) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, d = -1, g = n;
    for (let m = 0; m < s.length; m++) {
      const b = s[m];
      for (let z = 0; z < b.length - 1; z++) {
        const f = i[b[z]], A = i[b[z + 1]];
        if (!f || !A) continue;
        const j = Ot(t, o, a, f[0], f[1], f[2], A[0], A[1], A[2]);
        j < g && (g = j, r = m, d = z);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: d, dist: g } : null;
  }, rn = (t, o, a, n) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let r = -1, d = n;
    for (let g = 0; g < i.length; g++) {
      const m = i[g];
      if (!m || m.length !== 6) continue;
      const b = Ot(t, o, a, m[0], m[1], m[2], m[3], m[4], m[5]);
      b < d && (d = b, r = g);
    }
    return r;
  }, cn = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      Ee.visible = false;
      return;
    }
    Ee.geometry.setFromPoints([new _(n[0], n[1], n[2]), new _(n[3], n[4], n[5])]), Ee.visible = true;
  }, Hn = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!a || a.length < 2) {
      Ee.visible = false;
      return;
    }
    const s = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const r of a) {
      const d = n[r];
      d && i.push(new _(d[0], d[1], d[2]));
    }
    else {
      const r = n[a[o]], d = n[a[o + 1]];
      r && i.push(new _(r[0], r[1], r[2])), d && i.push(new _(d[0], d[1], d[2]));
    }
    Ee.geometry.setFromPoints(i), Ee.visible = true;
  }, dn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const a = o.filter((g, m) => m !== t), n = /* @__PURE__ */ new Set();
    for (const g of a) for (const m of g) n.add(m);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let g = 0; g < s.length; g++) n.has(g) && (i.set(g, r.length), r.push(s[g]));
    const d = a.map((g) => g.map((m) => i.get(m)).filter((m) => m !== void 0));
    e.points.val = r, e.polylines.val = d, e.areas && (e.areas.val = e.areas.rawVal.filter((g) => g !== t).map((g) => g > t ? g - 1 : g)), Ee.visible = false, ve = -1, Je = -1;
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
    const r = [...a.slice(0, t), ...i, ...a.slice(t + 1)], d = /* @__PURE__ */ new Set();
    for (const f of r) for (const A of f) d.add(A);
    const g = e.points.rawVal, m = /* @__PURE__ */ new Map(), b = [];
    for (let f = 0; f < g.length; f++) d.has(f) && (m.set(f, b.length), b.push(g[f]));
    const z = r.map((f) => f.map((A) => m.get(A)).filter((A) => A !== void 0));
    if (e.points.val = b, e.polylines.val = z, e.areas) {
      const f = i.length - 1;
      e.areas.val = e.areas.rawVal.map((A) => A > t ? A + f : A);
    }
    Ee.visible = false, ve = -1, Je = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  O.geometry.setAttribute("position", new vt(e.points.rawVal.flat(), 3)), O.geometry.computeBoundingSphere(), O.frustumCulled = false, be.frustumCulled = false, u.add(be), te.position.set(0, 0, 0), te.rotateX(Math.PI / 2), te.geometry.rotateX(Math.PI / 2), te.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, a) => {
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
      const d = [0, 1, 2].map((b) => r.reduce((z, f) => z + f[b], 0) / r.length), g = r.map((b) => Math.hypot(b[0] - d[0], b[1] - d[1], b[2] - d[2])), m = g.reduce((b, z) => b + z, 0) / g.length;
      m < 1e-9 || g.some((b) => Math.abs(b - m) > 5e-3 * m) || n.push({ c: d, r: m });
    }
    return An = n;
  };
  window.__hekatanCentrosDeducidos = En, window.__hekatanDrawCircle = (t, o, a, n, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(s)), d = e.points.rawVal.length, g = [];
    for (let m = 0; m < r; m++) {
      const b = 2 * Math.PI * m / r, z = n * Math.cos(b), f = n * Math.sin(b);
      let A;
      i === "xy" ? A = [t + z, o + f, a] : i === "xz" ? A = [t + z, o, a + f] : A = [t, o + z, a + f], g.push(A);
    }
    if (e.points.val = [...e.points.rawVal, ...g], pn.push({ c: [t, o, a], r: n }), e.polylines) {
      const m = [...g.map((z, f) => d + f), d], b = e.polylines.rawVal;
      ((_a2 = b[b.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [...b, m, []] : e.polylines.val = [...b.slice(0, -1), m, []];
    }
  }, window.__hekatanDrawArc = (t, o, a, n = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(n)), i = new _(...t), r = new _(...o), d = new _(...a), g = new _().subVectors(r, i), m = new _().subVectors(d, i), b = new _().crossVectors(g, m).normalize(), z = new _().addVectors(i, r).multiplyScalar(0.5), f = new _().addVectors(r, d).multiplyScalar(0.5), A = new _().crossVectors(g, b).normalize(), j = new _().crossVectors(new _().subVectors(d, r), b).normalize(), C = new _().subVectors(f, z), P = A.x * j.y - A.y * j.x;
    let y;
    if (Math.abs(P) > 1e-9) {
      const Se = (C.x * j.y - C.y * j.x) / P;
      y = new _().addVectors(z, A.clone().multiplyScalar(Se));
    } else y = z.clone();
    const F = i.distanceTo(y), G = new _().subVectors(i, y), U = new _().subVectors(d, y), le = Math.acos(Math.max(-1, Math.min(1, G.dot(U) / (F * F)))), q = e.points.rawVal.length, J = [], Ae = b.clone();
    for (let Se = 0; Se <= s; Se++) {
      const Fe = Se / s, Re = le * Fe, Ke = new mo().setFromAxisAngle(Ae, Re), tt = G.clone().applyQuaternion(Ke).add(y);
      J.push([tt.x, tt.y, tt.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...J], pn.push({ c: [y.x, y.y, y.z], r: F }), e.polylines) {
      const Se = J.map((Re, Ke) => q + Ke), Fe = e.polylines.rawVal;
      e.polylines.val = [...Fe.slice(0, -1), Se, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, a = 1, n = 6, s = 6) => {
    const i = Math.min(t[0], o[0]), r = Math.max(t[0], o[0]), d = Math.min(t[1], o[1]), g = Math.max(t[1], o[1]), m = (t[2] + o[2]) / 2, b = r - i, z = g - d, f = Math.min(a, b / 2 - 0.01, z / 2 - 0.01);
    if (f <= 0) return;
    const A = e.points.rawVal.length, j = [], C = [], P = (y, F) => {
      j.push([y, F, m]), C.push(A + j.length - 1);
    };
    for (let y = 0; y <= s; y++) P(i + f + (b - 2 * f) * y / s, d);
    for (let y = 1; y <= n; y++) {
      const F = -Math.PI / 2 + Math.PI / 2 * y / n;
      P(r - f + f * Math.cos(F), d + f + f * Math.sin(F));
    }
    for (let y = 1; y <= s; y++) P(r, d + f + (z - 2 * f) * y / s);
    for (let y = 1; y <= n; y++) {
      const F = 0 + Math.PI / 2 * y / n;
      P(r - f + f * Math.cos(F), g - f + f * Math.sin(F));
    }
    for (let y = 1; y <= s; y++) P(r - f - (b - 2 * f) * y / s, g);
    for (let y = 1; y <= n; y++) {
      const F = Math.PI / 2 + Math.PI / 2 * y / n;
      P(i + f + f * Math.cos(F), g - f + f * Math.sin(F));
    }
    for (let y = 1; y <= s; y++) P(i, g - f - (z - 2 * f) * y / s);
    for (let y = 1; y <= n; y++) {
      const F = Math.PI + Math.PI / 2 * y / n;
      P(i + f + f * Math.cos(F), d + f + f * Math.sin(F));
    }
    if (C.push(A), e.points.val = [...e.points.rawVal, ...j], e.polylines) {
      const y = e.polylines.rawVal;
      e.polylines.val = [...y.slice(0, -1), C, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], d = o[1], g = o[2];
    let m;
    if (Math.abs(i - g) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, d, i], [n, d, i]] : Math.abs(s - d) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, s, g], [n, s, g]] : m = [[n, s, i], [n, d, i], [n, d, g], [n, s, g]], e.points.val = [...e.points.rawVal, ...m], e.polylines) {
      const b = [a, a + 1, a + 2, a + 3, a], z = e.polylines.rawVal;
      e.polylines.val = [...z.slice(0, -1), b, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], d = o[1], g = o[2];
    let m;
    if (T && e.gridTarget) {
      const b = e.gridTarget.rawVal, z = new kn(...b.rotation), f = new _(1, 0, 0).applyEuler(z), A = new _(0, 1, 0).applyEuler(z), j = new _(...b.position), C = new _(n, s, i), P = new _(r, d, g), y = C.clone().sub(j).dot(f), F = C.clone().sub(j).dot(A), G = P.clone().sub(j).dot(f), U = P.clone().sub(j).dot(A), le = (q, J) => j.clone().addScaledVector(f, q).addScaledVector(A, J).toArray();
      m = [le(y, F), le(G, F), le(G, U), le(y, U)];
    } else Math.abs(i - g) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, d, i], [n, d, i]] : Math.abs(s - d) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, s, g], [n, s, g]] : m = [[n, s, i], [n, d, i], [n, d, g], [n, s, g]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...m], e.polylines) {
      const b = e.polylines.rawVal, z = b.length - 1, f = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [...b.slice(0, -1), f, []], e.areas && (e.areas.val = [...e.areas.rawVal, z]);
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
    let d = t[1][0] - t[0][0], g = t[1][1] - t[0][1], m = t[1][2] - t[0][2];
    const b = Math.hypot(d, g, m) || 1;
    d /= b, g /= b, m /= b;
    let z = s * m - i * g, f = i * d - n * m, A = n * g - s * d;
    const j = Math.hypot(z, f, A) || 1;
    z /= j, f /= j, A /= j;
    const C = t[0], P = (we) => [(we[0] - C[0]) * d + (we[1] - C[1]) * g + (we[2] - C[2]) * m, (we[0] - C[0]) * z + (we[1] - C[1]) * f + (we[2] - C[2]) * A], y = (we, Ve) => [C[0] + we * d + Ve * z, C[1] + we * g + Ve * f, C[2] + we * m + Ve * A], F = t.map(P);
    let G = 1 / 0, U = -1 / 0, le = 1 / 0, q = -1 / 0;
    for (const [we, Ve] of F) we < G && (G = we), we > U && (U = we), Ve < le && (le = Ve), Ve > q && (q = Ve);
    const J = U - G, Ae = q - le;
    if (J < 1e-6 || Ae < 1e-6) return 0;
    let Se = o && o > 0 ? o : 0.5;
    for (; J / Se * (Ae / Se) > 2500; ) Se *= 2;
    Se = Math.min(Se, Math.min(J, Ae));
    const Fe = (we, Ve) => {
      let nt = false;
      for (let Tt = 0, $t = F.length - 1; Tt < F.length; $t = Tt++) {
        const [Nt, Wt] = F[Tt], [co, on] = F[$t];
        Wt > Ve != on > Ve && we < (co - Nt) * (Ve - Wt) / (on - Wt) + Nt && (nt = !nt);
      }
      return nt;
    }, Re = Math.max(1, Math.round(J / Se)), Ke = Math.max(1, Math.round(Ae / Se)), tt = J / Re, dt = Ae / Ke, rt = /* @__PURE__ */ new Map(), ft = [], Pe = e.points.rawVal.length, He = (we, Ve) => {
      const nt = we + "," + Ve, Tt = rt.get(nt);
      if (Tt !== void 0) return Tt;
      const $t = Pe + ft.length;
      return ft.push(y(G + we * tt, le + Ve * dt)), rt.set(nt, $t), $t;
    }, at = [];
    for (let we = 0; we < Re; we++) for (let Ve = 0; Ve < Ke; Ve++) {
      if (!Fe(G + (we + 0.5) * tt, le + (Ve + 0.5) * dt)) continue;
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
    if (fe.length < 3) return fe = [], H.visible = false, x(), 0;
    const t = window.__hekatanMeshPolyArea(fe.slice());
    return fe = [], H.visible = false, x(), t;
  };
  window.__hekatanFinalizePolyArea = un, window.__hekatanSetInclinedPlaneFrom3 = (t, o, a) => {
    var _a2;
    const n = new _(t[0], t[1], t[2]), s = new _(o[0], o[1], o[2]), i = new _(a[0], a[1], a[2]), r = new _().subVectors(s, n).cross(new _().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const d = new mo().setFromUnitVectors(new _(0, 0, 1), r), g = new kn().setFromQuaternion(d);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [g.x, g.y, g.z] }), T = true;
    const m = new _().addVectors(n, s).add(i).multiplyScalar(1 / 3), b = Math.max(n.distanceTo(s), n.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, z = b / 2;
    $e.geometry.dispose(), $e.geometry = new en(b, b), _e.geometry.dispose(), _e.geometry = new Go(new en(b, b)), Oe(z, 1), he.position.copy(m), he.quaternion.copy(d), he.scale.set(1, 1, 1), he.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] }), T = false, he.visible = false, x();
  };
  const Lt = new je();
  Lt.visible = false, u.add(Lt), window.__hekatanShowAxes = (t, o, a = 12, n = 2) => {
    var _a2, _b;
    for (; Lt.children.length; ) {
      const b = Lt.children.pop();
      (_a2 = b.geometry) == null ? void 0 : _a2.dispose(), (_b = b.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const s = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...t) - n, d = Math.max(...t) + n, g = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", m = (b, z, f, A, j) => {
      const C = document.createElement("canvas");
      C.width = 64, C.height = 32;
      const P = C.getContext("2d");
      P.fillStyle = j, P.font = "bold 22px sans-serif", P.textAlign = "center", P.fillText(b, 32, 26);
      const y = new Ho(C), F = new Wo({ map: y, transparent: true }), G = new Jo(F);
      return G.position.set(z, f, A), G.scale.set(1.2, 0.6, 1), G;
    };
    t.forEach((b, z) => {
      const f = z < g.length ? g[z] : `X${z}`, A = new Me().setFromPoints([new _(b, s, 0), new _(b, i, 0), new _(b, s, 0), new _(b, s, a)]), j = new Sn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), C = new Kt(A, j);
      C.computeLineDistances(), Lt.add(C), Lt.add(m(f, b, s - 0.5, 0, "#60a5fa")), Lt.add(m(f, b, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((b, z) => {
      const f = `${z + 1}`, A = new Me().setFromPoints([new _(r, b, 0), new _(d, b, 0), new _(r, b, 0), new _(r, b, a)]), j = new Sn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), C = new Kt(A, j);
      C.computeLineDistances(), Lt.add(C), Lt.add(m(f, r - 0.5, b, 0, "#fb7185")), Lt.add(m(f, d + 0.5, b, 0, "#fb7185"));
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
      const d = s[r % s.length], g = o / 2, m = [new _(a - g, n - g, i), new _(a + g, n - g, i), new _(a + g, n + g, i), new _(a - g, n + g, i), new _(a - g, n - g, i)], b = new Me().setFromPoints(m), z = new ct({ color: d, transparent: true, opacity: 0.55 });
      qt.add(new _t(b, z));
      const f = document.createElement("canvas");
      f.width = 128, f.height = 32;
      const A = f.getContext("2d");
      A.fillStyle = `#${d.toString(16).padStart(6, "0")}`, A.font = "bold 18px sans-serif", A.fillText(`Z = ${i} m`, 4, 22);
      const j = new Ho(f), C = new Wo({ map: j, transparent: true }), P = new Jo(C);
      P.position.set(a - g - 1.5, n - g - 1.5, i), P.scale.set(2.5, 0.6, 1), qt.add(P);
      const y = new en(1e4, 1e4), F = new it({ visible: false, side: kt }), G = new et(y, F);
      G.position.set(0, 0, i), G.frustumCulled = false, G.userData = { refPlaneZ: i }, u.add(G), Ht.push(G);
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
    const o = h(), a = (v == null ? void 0 : v.clientHeight) || 700;
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
  }, v.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(E, o);
    const a = ie();
    if (a.length) {
      const n = a[0].point, s = t.altKey, i = Qn(n), r = s ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i);
      if (r) Ao(r.type, r.x, r.y, r.z), xt.position.set(r.x, r.y, r.z), xt.visible = true, n.set(r.x, r.y, r.z);
      else {
        Ln();
        const z = !s && window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0.5;
        z && f > 0 && (n.x = Math.round(n.x / f) * f, n.y = Math.round(n.y / f) * f, n.z = Math.round(n.z / f) * f), xt.position.copy(n), xt.visible = true;
      }
      vn();
      const d = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (d === "select" || !d) {
        const z = (window.__hekatanSnap2D ?? 0.5) * 1.5, f = At(n.x, n.y, n.z, z), A = ln(n.x, n.y, n.z, z), j = rn(n.x, n.y, n.z, z);
        if (f >= 0) {
          const F = e.points.rawVal[f];
          Ue.position.set(F[0], F[1], F[2]), Ue.visible = true, Pt(), De.visible = false, ht = { kind: "pt", a: f };
        } else if (A) {
          const F = e.points.rawVal, G = e.polylines.rawVal[A.polyIdx], U = F[G[A.segIdx]], le = F[G[A.segIdx + 1]];
          De.geometry.setFromPoints([new _(U[0], U[1], U[2]), new _(le[0], le[1], le[2])]), De.visible = true, Ue.visible = false, ht = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(A.polyIdx)) ?? false ? { kind: "poly", a: A.polyIdx } : { kind: "seg", a: A.polyIdx, b: A.segIdx };
        } else if (j >= 0) {
          const G = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[j];
          G && (De.geometry.setFromPoints([new _(G[0], G[1], G[2]), new _(G[3], G[4], G[5])]), De.visible = true, Ue.visible = false, ht = { kind: "aux", a: j });
        } else De.visible = false, Ue.visible = false, ht = null;
        oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
        let C = n;
        if ((ht == null ? void 0 : ht.kind) === "pt") {
          const F = e.points.rawVal[ht.a];
          F && (C = new _(F[0], F[1], F[2]));
        }
        const P = `X=${C.x.toFixed(2)} Y=${C.y.toFixed(2)} Z=${C.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [C.x, C.y, C.z], ht) {
          const F = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          oe.textContent = `${P}  \xB7  \u{1F5B1} Click \u2192 ${F[ht.kind]}`;
        } else oe.textContent = P;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = P), pe.visible = false, ut.visible = false, x();
        return;
      }
      if (d === "delete" || d === "trim" || d === "extend" || d === "offset") {
        const z = (window.__hekatanSnap2D ?? 0.5) * 1.5, f = ln(n.x, n.y, n.z, z), A = rn(n.x, n.y, n.z, z);
        let j = false;
        if (A >= 0) if (!f) j = true;
        else {
          const F = window.__hekatanDrawingAuxLines, U = ((F == null ? void 0 : F.rawVal) ?? (F == null ? void 0 : F.val) ?? F ?? [])[A];
          Ot(n.x, n.y, n.z, U[0], U[1], U[2], U[3], U[4], U[5]) < f.dist && (j = true);
        }
        j ? (Qe = A, ve = -1, Je = -1, cn(A)) : f ? (ve = f.polyIdx, Je = f.segIdx, Qe = -1, Hn(f.polyIdx, f.segIdx)) : (ve = -1, Je = -1, Qe = -1, Ee.visible = false), pe.visible = false, ut.visible = false, B(), oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
        const C = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let P = "";
        j ? P = `\u{1F5D1} l\xEDnea aux #${Qe + 1}` : f ? P = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(f.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${f.polyIdx + 1}` : `\u{1F5D1} seg ${f.segIdx + 1} / poly #${f.polyIdx + 1}` : P = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", oe.textContent = `${C}  \xB7  ${P}`;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = C), x();
        return;
      } else Ee.visible = false, ve = -1, Qe = -1;
      oe.style.left = t.clientX + "px", oe.style.top = t.clientY + "px", oe.style.display = "block";
      const g = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], m = g[g.length - 1] ?? [], b = e.points.rawVal ?? [];
      if (m.length > 0 && b[m[m.length - 1]]) {
        const z = m[m.length - 1], f = b[z];
        let A = Ie;
        if (Jt = null, !A && window.__hekatanAxisSnap !== false) {
          const Re = v.getBoundingClientRect(), Ke = t.clientX, tt = t.clientY, dt = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, rt = new _(f[0], f[1], f[2]), ft = [["x", new _(1, 0, 0)], ["y", new _(0, 1, 0)], ["z", new _(0, 0, 1)]], Pe = (at) => {
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
              const po = k.ray, Yo = rt.clone().sub(po.origin), uo = we.dot(po.direction), Uo = we.dot(Yo), Fs = po.direction.dot(Yo), Zo = 1 - uo * uo, As = Math.abs(Zo) < 1e-6 ? -Uo : (uo * Fs - Uo) / Zo;
              He = { axis: at, dpx: No, pt: rt.clone().addScaledVector(we, As) };
            }
          }
          He && He.dpx <= 12 && (n.copy(He.pt), A = He.axis, Jt = He.pt.clone());
        }
        const j = !!window.__hekatanOrthoMode;
        if (!A && j) {
          const Re = Math.abs(n.x - f[0]), Ke = Math.abs(n.y - f[1]), tt = Math.abs(n.z - f[2]), dt = (_l = a[0]) == null ? void 0 : _l.object;
          let rt = null;
          dt === Ce ? rt = "xy" : dt === Ne ? rt = "xz" : dt === Le && (rt = "yz"), rt === "xy" ? A = Re >= Ke ? "x" : "y" : rt === "xz" ? A = Re >= tt ? "x" : "z" : rt === "yz" ? A = Ke >= tt ? "y" : "z" : A = Re >= Ke && Re >= tt ? "x" : Ke >= tt ? "y" : "z";
        }
        const C = window.__hekatanPolarTrack !== false;
        if (!A && C) {
          const Re = n.x - f[0], Ke = n.y - f[1], tt = n.z - f[2], dt = Math.hypot(Re, Ke, tt);
          if (dt > 1e-3) {
            const ft = Math.tan(6 * Math.PI / 180) * dt, Pe = Math.hypot(Ke, tt), He = Math.hypot(Re, tt), at = Math.hypot(Re, Ke), we = [["x", Pe], ["y", He], ["z", at]];
            we.sort((Ve, nt) => Ve[1] - nt[1]), we[0][1] <= ft && (A = we[0][0]);
          }
        }
        if (A) {
          const Re = f[0], Ke = f[1], tt = f[2];
          A === "x" ? n.set(n.x, Ke, tt) : A === "y" ? n.set(Re, n.y, tt) : n.set(Re, Ke, n.z);
          const dt = !!Ie, ft = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[A];
          qe.style.background = "rgba(15,23,42,0.92)", qe.style.color = ft, qe.style.border = `1.5px solid ${ft}`;
          const Pe = (_m = a[0]) == null ? void 0 : _m.object;
          let He = null;
          Pe === Ce ? He = "xy" : Pe === Ne ? He = "xz" : Pe === Le && (He = "yz");
          const at = He ? ` (plano ${He.toUpperCase()})` : "";
          qe.textContent = dt ? `\u{1F512} LOCK ${A.toUpperCase()}${at}` : `\u22A5 ORTO ${A.toUpperCase()}${at}`, qe.style.left = t.clientX + 20 + "px", qe.style.top = t.clientY + 18 + "px", qe.style.transform = "none", qe.style.display = "block";
        } else Ie || (qe.style.display = "none");
        const P = Math.hypot(n.x - f[0], n.y - f[1], n.z - f[2]), y = Math.atan2(n.y - f[1], n.x - f[0]) * 180 / Math.PI, F = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        oe.textContent = `${F} | \u0394L=${P.toFixed(2)}m ${y.toFixed(0)}\xB0`;
        const G = document.getElementById("hk-coord-fixed");
        G && (G.textContent = F), pe.geometry.setFromPoints([new _(f[0], f[1], f[2]), new _(n.x, n.y, n.z)]), (_n2 = pe.computeLineDistances) == null ? void 0 : _n2.call(pe), pe.visible = true, Y(f[0], f[1], f[2], n.x, n.y, n.z);
        const U = window.__hekatanOrthoExt ?? 8, le = window.__hekatanShowOrthoPlanes !== false;
        ge.visible = le, le || We(null), le && (ot(ce, f, "xy", U), ot(me, f, "xz", U), ot(xe, f, "yz", U), Ze(Ce, f, "xy", U), Ze(Ne, f, "xz", U), Ze(Le, f, "yz", U));
        const q = le ? k.intersectObjects([Ce, Ne, Le], false) : [];
        let J = null;
        if (q.length > 0) {
          const Re = q[0].object;
          Re === Ce ? J = "xy" : Re === Ne ? J = "xz" : Re === Le && (J = "yz");
        }
        We(J), J && (lt.style.left = t.clientX + "px", lt.style.top = t.clientY + "px"), S.geometry.setFromPoints([new _(f[0] - U, f[1], f[2]), new _(f[0] + U, f[1], f[2])]), (_o2 = S.computeLineDistances) == null ? void 0 : _o2.call(S), I.geometry.setFromPoints([new _(f[0], f[1] - U, f[2]), new _(f[0], f[1] + U, f[2])]), (_p = I.computeLineDistances) == null ? void 0 : _p.call(I), W.geometry.setFromPoints([new _(f[0], f[1], f[2] - U), new _(f[0], f[1], f[2] + U)]), (_q = W.computeLineDistances) == null ? void 0 : _q.call(W), ut.visible = true;
        const Ae = S.material, Se = I.material, Fe = W.material;
        A === "x" ? (Ae.opacity = 0.95, Se.opacity = 0.1, Fe.opacity = 0.1) : A === "y" ? (Ae.opacity = 0.1, Se.opacity = 0.95, Fe.opacity = 0.1) : A === "z" ? (Ae.opacity = 0.1, Se.opacity = 0.1, Fe.opacity = 0.95) : (Ae.opacity = 0.5, Se.opacity = 0.5, Fe.opacity = 0.5);
      } else {
        const z = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        oe.textContent = z;
        const f = document.getElementById("hk-coord-fixed");
        if (f && (f.textContent = z), pe.visible = false, ut.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(d)) {
          if (D = null, Z = null, N.style.left = t.clientX + 20 + "px", N.style.top = t.clientY - 28 + "px", N.style.display = "block", !$) {
            N.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const j = document.activeElement;
            !(j && (j.tagName === "INPUT" || j.tagName === "TEXTAREA") && j !== N) && document.activeElement !== N && N.focus({ preventScroll: true });
            try {
              N.select();
            } catch {
            }
          }
        } else B();
      }
      x();
    } else Ln(), oe.style.display = "none", xt.visible = false, pe.visible = false, ut.visible = false, B(), x();
  }), K.derive(() => {
    if (!e.gridTarget) return;
    xa(l, { position: new _(...e.gridTarget.val.position), quaternion: new mo().setFromEuler(new kn(...e.gridTarget.val.rotation)) }, x), te.position.set(...e.gridTarget.val.position), te.quaternion.setFromEuler(new kn(...e.gridTarget.val.rotation)), te.updateMatrixWorld();
    const t = new _(0, 0, 1).applyEuler(new kn(...e.gridTarget.val.rotation));
    T = !(Math.abs(t.x) > 0.999 || Math.abs(t.y) > 0.999 || Math.abs(t.z) > 0.999);
  }), K.derive(() => {
    O.geometry.setAttribute("position", new vt(e.points.val.flat(), 3)), O.geometry.computeBoundingSphere();
  }), K.derive(() => {
    const t = 0.05 * w * 0.5 * p.val;
    k.params.Points.threshold = 0.4 * t;
  }), K.derive(() => {
    var _a2;
    const t = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of a) {
      const [r, d, g] = t[i];
      n.push(r, d, g);
    }
    const s = new Me();
    s.setAttribute("position", new vt(n, 3)), ye.geometry.dispose(), ye.geometry = s;
  });
  let jn = false, tn = 0;
  v.addEventListener("pointerdown", () => {
    jn = true;
  }), v.addEventListener("pointerup", () => {
    jn = false;
  }), v.addEventListener("pointermove", () => {
    jn && tn++;
  });
  const Et = document.createElement("div");
  Et.id = "hk-window-select", Et.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Et);
  let Ut = null, Mn = false, It = null;
  const eo = (t, o, a, n, s) => {
    s ? (Et.style.borderColor = "#34d399", Et.style.borderStyle = "dashed", Et.style.background = "rgba(52, 211, 153, 0.10)") : (Et.style.borderColor = "#22d3ee", Et.style.borderStyle = "solid", Et.style.background = "rgba(34, 211, 238, 0.10)"), Et.style.left = Math.min(t, a) + "px", Et.style.top = Math.min(o, n) + "px", Et.style.width = Math.abs(a - t) + "px", Et.style.height = Math.abs(n - o) + "px", Et.style.display = "block";
  }, Co = (t, o, a, n, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, a), r = Math.max(t, a), d = Math.min(o, n), g = Math.max(o, n), m = a < t, b = v.getBoundingClientRect(), z = h();
    z.updateMatrixWorld();
    const f = (q) => {
      const J = new _(q[0], q[1], q[2]);
      return J.project(z), { x: b.left + (J.x * 0.5 + 0.5) * b.width, y: b.top + (-J.y * 0.5 + 0.5) * b.height };
    }, A = (q) => q.x >= i && q.x <= r && q.y >= d && q.y <= g, j = (q, J) => !(q.x < i && J.x < i || q.x > r && J.x > r || q.y < d && J.y < d || q.y > g && J.y > g);
    s || ke.clear();
    let C = 0;
    const P = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let q = 0; q < P.length; q++) {
      const J = P[q];
      J && A(f(J)) && (ke.add(`pt:${q}`), C++);
    }
    const y = (q, J) => m ? A(q) || A(J) || j(q, J) : A(q) && A(J), F = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], G = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let q = 0; q < F.length; q++) {
      const J = F[q];
      if (G.includes(q)) {
        let Se;
        if (!m) Se = J.every((Fe) => {
          const Re = P[Fe];
          return !!Re && A(f(Re));
        });
        else {
          Se = false;
          for (let Fe = 0; Fe < J.length - 1; Fe++) {
            const Re = P[J[Fe]], Ke = P[J[Fe + 1]];
            if (!(!Re || !Ke) && y(f(Re), f(Ke))) {
              Se = true;
              break;
            }
          }
        }
        Se && (ke.add(`poly:${q}`), C++);
      } else for (let Se = 0; Se < J.length - 1; Se++) {
        const Fe = P[J[Se]], Re = P[J[Se + 1]];
        !Fe || !Re || y(f(Fe), f(Re)) && (ke.add(`seg:${q}:${Se}`), C++);
      }
    }
    const le = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let q = 0; q < le.length; q++) {
      const J = le[q];
      if (!J || J.length !== 6) continue;
      const Ae = f([J[0], J[1], J[2]]), Se = f([J[3], J[4], J[5]]);
      y(Ae, Se) && (ke.add(`aux:${q}`), C++);
    }
    Mt(), ne(`${m ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${C} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${ke.size})`), Et.style.display = "none";
  }, Vn = () => {
    It && (It = null, Et.style.display = "none", ne("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Vn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && It && Vn();
  });
  const zo = () => {
    var _a2, _b, _c, _d;
    if (ke.size === 0) return false;
    const t = [...ke], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set();
    for (const j of t) {
      const [C, ...P] = j.split(":");
      if (C === "pt") r.add(+P[0]);
      else if (C === "poly") d.add(+P[0]);
      else if (C === "seg") {
        const y = +P[0], F = +P[1];
        g.has(y) || g.set(y, /* @__PURE__ */ new Set()), g.get(y).add(F);
      } else C === "aux" && m.add(+P[0]);
    }
    let b = 0, z = [], f = [];
    const A = /* @__PURE__ */ new Map();
    for (let j = 0; j < a.length; j++) {
      if (d.has(j)) {
        b++;
        continue;
      }
      A.set(j, z.length);
      const C = g.get(j);
      if (C && C.size > 0) {
        let P = [];
        for (let y = 0; y < a[j].length; y++) P.push(a[j][y]), y < a[j].length - 1 && C.has(y) && (P.length >= 2 && z.push(P), P = [], b++);
        (P.length >= 2 || P.length === 1) && z.push(P);
      } else z.push([...a[j]]);
    }
    if (r.size > 0) {
      const j = [], C = /* @__PURE__ */ new Map();
      for (let y = 0; y < o.length; y++) {
        if (r.has(y)) {
          b++;
          continue;
        }
        C.set(y, j.length), j.push([...o[y]]);
      }
      const P = [];
      for (const y of z) {
        let F = [];
        for (const G of y) {
          const U = C.get(G);
          U === void 0 ? (F.length >= 2 && P.push(F), F = []) : F.push(U);
        }
        F.length >= 2 && P.push(F);
      }
      z = P, e.points.val = j;
    }
    for (const j of n) {
      const C = A.get(j);
      C !== void 0 && C < z.length && f.push(C);
    }
    if (e.polylines && (e.polylines.val = z), e.areas && (e.areas.val = f), m.size > 0 && s) {
      const j = i.filter((C, P) => !m.has(P));
      "val" in s ? s.val = j : window.__hekatanDrawingAuxLines = j, b += m.size;
    }
    ke.clear(), Mt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ne(`\u{1F5D1} ${b} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = zo, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || ke.size !== 0 && (t.preventDefault(), zo());
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
      const d = Vt.getBoundingClientRect();
      s = d.left, i = d.top, Vt.style.transform = "none", Vt.style.left = `${s}px`, Vt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const d = r.clientX - a, g = r.clientY - n, m = Math.max(0, Math.min(window.innerWidth - 80, s + d)), b = Math.max(0, Math.min(window.innerHeight - 40, i + g));
      Vt.style.left = `${m}px`, Vt.style.top = `${b}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Fo, JSON.stringify({ left: parseFloat(Vt.style.left), top: parseFloat(Vt.style.top) }));
        } catch {
        }
      }
    });
  }, Q = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, zt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let st = null;
  const gt = (t, o, a, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: a, value: n } }));
  }, gs = () => {
    if (st && (st.dispose(), st = null), ke.size === 0) {
      Vt.style.display = "none";
      return;
    }
    const t = [...ke], o = t.filter((z) => z.startsWith("pt:")), a = t.filter((z) => z.startsWith("seg:")), n = t.filter((z) => z.startsWith("poly:")), s = t.filter((z) => z.startsWith("aux:")), i = o.length > 0, r = a.length > 0, d = n.length > 0, g = !i && !r && !d, m = [];
    o.length && m.push(`\u{1F535} ${o.length} nodo(s)`), a.length && m.push(`\u{1F4CF} ${a.length} segmento(s)`), n.length && m.push(`\u25AD ${n.length} \xE1rea(s)`), s.length && m.push(`\u250A ${s.length} aux`);
    const b = `\u{1F3AF} ${ke.size} item(s) \u2014 ${m.join(", ")}`;
    st = new cs({ container: Vt, title: b });
    {
      const z = st.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      z.addBinding(zt, "dx", { label: "\u0394x (m)", step: 0.1 }), z.addBinding(zt, "dy", { label: "\u0394y (m)", step: 0.1 }), z.addBinding(zt, "dz", { label: "\u0394z (m)", step: 0.1 }), z.addBinding(zt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), z.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const A = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, zt.copias);
        ne(A ? `\u29C9 Replicado \xD7${A} (\u0394 ${zt.dx},${zt.dy},${zt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), z.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const A = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, 1);
        ne(A ? `\u2192 Copia desplazada \u0394 ${zt.dx},${zt.dy},${zt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const f = z.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      f.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), f.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ne(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const z = st.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      z.addBinding(Q, "Ux"), z.addBinding(Q, "Uy"), z.addBinding(Q, "Uz"), z.addBinding(Q, "Rx"), z.addBinding(Q, "Ry"), z.addBinding(Q, "Rz");
      const f = st.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      f.addBinding(Q, "Kx", { label: "Kx", min: 0, step: 100 }), f.addBinding(Q, "Ky", { label: "Ky", min: 0, step: 100 }), f.addBinding(Q, "Kz", { label: "Kz", min: 0, step: 100 }), f.addBinding(Q, "Krx", { label: "Krx", min: 0, step: 1e3 }), f.addBinding(Q, "Kry", { label: "Kry", min: 0, step: 1e3 }), f.addBinding(Q, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const A = st.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      A.addBinding(Q, "Fx", { step: 0.1 }), A.addBinding(Q, "Fy", { step: 0.1 }), A.addBinding(Q, "Fz", { step: 0.1 }), A.addBinding(Q, "Mx", { step: 0.1 }), A.addBinding(Q, "My", { step: 0.1 }), A.addBinding(Q, "Mz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(Q, "mass", { label: "m", min: 0, step: 1 }), st.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(Q, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), st.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let P = 0;
        const y = [Q.Ux, Q.Uy, Q.Uz, Q.Rx, Q.Ry, Q.Rz];
        y.some((U) => U) && (gt("nodes", o, "supports", y), P++);
        const F = [Q.Fx, Q.Fy, Q.Fz, Q.Mx, Q.My, Q.Mz];
        F.some((U) => U !== 0) && (gt("nodes", o, "loads", F), P++);
        const G = [Q.Kx, Q.Ky, Q.Kz, Q.Krx, Q.Kry, Q.Krz];
        if (G.some((U) => U !== 0) && (gt("nodes", o, "springs", G), P++), Q.mass !== 0 && (gt("nodes", o, "mass", Q.mass), P++), Q.diaphragm !== "Ninguno" && (gt("nodes", o, "diaphragm", Q.diaphragm), P++), P === 0) {
          ne("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let U = document.getElementById("hk-prop-toast");
          U || (U = document.createElement("div"), U.id = "hk-prop-toast", U.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(U)), U.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", U.style.background = "rgba(217,119,6,0.97)", U.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            U && (U.style.opacity = "0");
          }, 3200);
        } else ne(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const z = st.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      z.addBinding(Q, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), z.addBinding(Q, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const f = st.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      f.addBinding(Q, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), f.addBinding(Q, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), f.addBinding(Q, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), f.addBinding(Q, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), st.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(Q, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), st.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(Q, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const C = st.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      C.addBinding(Q, "relMxI", { label: "Mx I" }), C.addBinding(Q, "relMyI", { label: "My I" }), C.addBinding(Q, "relMzI", { label: "Mz I" });
      const P = st.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      P.addBinding(Q, "relMxJ", { label: "Mx J" }), P.addBinding(Q, "relMyJ", { label: "My J" }), P.addBinding(Q, "relMzJ", { label: "Mz J" }), st.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(Q, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const F = st.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      F.addBinding(Q, "LKx", { label: "LKx", min: 0, step: 100 }), F.addBinding(Q, "LKy", { label: "LKy", min: 0, step: 100 }), F.addBinding(Q, "LKz", { label: "LKz", min: 0, step: 100 });
      const G = st.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      G.addBinding(Q, "qx", { step: 0.1 }), G.addBinding(Q, "qy", { step: 0.1 }), G.addBinding(Q, "qz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(Q, "massPerM", { label: "m/L", min: 0, step: 1 }), st.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        gt("segs", a, "section", Q.section), gt("segs", a, "material", Q.material_frame);
        const le = { A: Q.A_mod, Iz: Q.Iz_mod, Iy: Q.Iy_mod, J: Q.J_mod };
        (le.A !== 1 || le.Iz !== 1 || le.Iy !== 1 || le.J !== 1) && gt("segs", a, "modifiers", le), Q.insertionPoint !== "10 \u2014 Centroid" && gt("segs", a, "insertionPoint", Q.insertionPoint), Q.beta !== 0 && gt("segs", a, "beta", Q.beta);
        const q = [Q.relMxI, Q.relMyI, Q.relMzI], J = [Q.relMxJ, Q.relMyJ, Q.relMzJ];
        (q.some((Fe) => Fe) || J.some((Fe) => Fe)) && gt("segs", a, "releases", { i: q, j: J }), Q.hinges !== "None" && gt("segs", a, "hinges", Q.hinges);
        const Ae = [Q.LKx, Q.LKy, Q.LKz];
        Ae.some((Fe) => Fe !== 0) && gt("segs", a, "lineSprings", Ae);
        const Se = [Q.qx, Q.qy, Q.qz];
        Se.some((Fe) => Fe !== 0) && gt("segs", a, "distLoad", Se), Q.massPerM !== 0 && gt("segs", a, "massPerM", Q.massPerM), ne(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (d) {
      const z = st.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      z.addBinding(Q, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), z.addBinding(Q, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), z.addBinding(Q, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), st.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(Q, "surfLoad", { label: "q", step: 0.1 }), st.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        gt("areas", n, "shellType", Q.shellType), gt("areas", n, "thickness", Q.thickness), gt("areas", n, "material", Q.material_shell), Q.surfLoad !== 0 && gt("areas", n, "surfLoad", Q.surfLoad), ne(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (g) {
      const z = st.addFolder({ title: "\u2139 Selecci\xF3n" }), f = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      z.addBinding(f, "msg", { readonly: true, label: "" });
    }
    st.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      ke.clear(), Mt();
    }), Vt.style.display = "block", xs();
  };
  window.__hekatanRefreshPropsPane = gs;
  let mn = null, $n = false;
  v.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, $n = false);
  }), v.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !$n) {
      const o = t.clientX - mn.x, a = t.clientY - mn.y;
      Math.hypot(o, a) > 8 && ($n = true);
    }
  }), v.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !$n;
      mn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (It ? Vn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), ke.size > 0 && (ke.clear(), Mt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, s = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), ne(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ne("\u238B Cancelado (click derecho)");
      }
    }
  }), v.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), v.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Ut = null, Mn = false));
  }), v.addEventListener("pointermove", (t) => {
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
  }), v.addEventListener("pointerup", (t) => {
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
    let d = null;
    const g = { end: 0, node: 0, int: 1, mid: 2, cen: 3, per: 4, nea: 5 }, m = (C, P, y, F) => {
      const G = Math.hypot(P - t, y - o, F - a);
      if (G > n) return;
      const U = g[C] ?? 9;
      (!d || U < d.r || U === d.r && G < d.d) && (d = { type: C, x: P, y, z: F, d: G, r: U });
    };
    (s.node || s.end) && i.forEach((C) => {
      s.node && m("node", C[0], C[1], C[2]);
    });
    for (const C of r) if (!(C.length < 2)) for (let P = 0; P < C.length - 1; P++) {
      const y = i[C[P]], F = i[C[P + 1]];
      if (!(!y || !F) && (s.end && (m("end", y[0], y[1], y[2]), m("end", F[0], F[1], F[2])), s.mid && m("mid", (y[0] + F[0]) / 2, (y[1] + F[1]) / 2, (y[2] + F[2]) / 2), s.nea || s.per)) {
        const G = F[0] - y[0], U = F[1] - y[1], le = F[2] - y[2], q = G * G + U * U + le * le;
        if (q < 1e-12) continue;
        const J = Math.max(0, Math.min(1, ((t - y[0]) * G + (o - y[1]) * U + (a - y[2]) * le) / q)), Ae = y[0] + J * G, Se = y[1] + J * U, Fe = y[2] + J * le;
        s.nea && m("nea", Ae, Se, Fe), s.per && m("per", Ae, Se, Fe);
      }
    }
    if (s.cen) {
      const C = En(), P = [...pn];
      for (const y of C) P.some((F) => Math.hypot(F.c[0] - y.c[0], F.c[1] - y.c[1], F.c[2] - y.c[2]) < 1e-6 && Math.abs(F.r - y.r) < 1e-6) || P.push(y);
      for (const y of P) {
        if (!i.some((U) => Math.abs(Math.hypot(U[0] - y.c[0], U[1] - y.c[1], U[2] - y.c[2]) - y.r) < 1e-6)) continue;
        const G = Math.hypot(t - y.c[0], o - y.c[1], a - y.c[2]);
        if (G < n || Math.abs(G - y.r) < n) {
          const U = Math.min(G, n * 0.5), le = 3;
          (!d || le < d.r || le === d.r && U < d.d) && (d = { type: "cen", x: y.c[0], y: y.c[1], z: y.c[2], d: U, r: le });
        }
      }
    }
    if (s.int) {
      const C = [];
      for (const P of r) for (let y = 0; y < P.length - 1; y++) {
        const F = i[P[y]], G = i[P[y + 1]];
        if (!F || !G) continue;
        const U = G[0] - F[0], le = G[1] - F[1], q = G[2] - F[2], J = U * U + le * le + q * q;
        if (J < 1e-12) continue;
        const Ae = Math.max(0, Math.min(1, ((t - F[0]) * U + (o - F[1]) * le + (a - F[2]) * q) / J));
        Math.hypot(F[0] + Ae * U - t, F[1] + Ae * le - o, F[2] + Ae * q - a) < 3 * n && C.push([F, G]);
      }
      for (let P = 0; P < C.length; P++) for (let y = P + 1; y < C.length; y++) {
        const [F, G] = C[P], [U, le] = C[y], q = [G[0] - F[0], G[1] - F[1], G[2] - F[2]], J = [le[0] - U[0], le[1] - U[1], le[2] - U[2]], Ae = [F[0] - U[0], F[1] - U[1], F[2] - U[2]], Se = q[0] * q[0] + q[1] * q[1] + q[2] * q[2], Fe = q[0] * J[0] + q[1] * J[1] + q[2] * J[2], Re = J[0] * J[0] + J[1] * J[1] + J[2] * J[2], Ke = q[0] * Ae[0] + q[1] * Ae[1] + q[2] * Ae[2], tt = J[0] * Ae[0] + J[1] * Ae[1] + J[2] * Ae[2], dt = Se * Re - Fe * Fe;
        if (dt < 1e-12) continue;
        const rt = (Fe * tt - Re * Ke) / dt, ft = (Se * tt - Fe * Ke) / dt;
        if (rt < -1e-6 || rt > 1 + 1e-6 || ft < -1e-6 || ft > 1 + 1e-6) continue;
        const Pe = [F[0] + rt * q[0], F[1] + rt * q[1], F[2] + rt * q[2]], He = [U[0] + ft * J[0], U[1] + ft * J[1], U[2] + ft * J[2]];
        if (Math.hypot(Pe[0] - He[0], Pe[1] - He[1], Pe[2] - He[2]) > 1e-4) continue;
        [F, G, U, le].some((we) => Math.hypot(we[0] - Pe[0], we[1] - Pe[1], we[2] - Pe[2]) < 1e-6) || m("int", Pe[0], Pe[1], Pe[2]);
      }
    }
    const b = window.__hekatanAxisGrids ?? [], z = window.__hekatanLevels ?? [], f = b.filter((C) => C && C.start && C.end).map((C) => [C.start, C.end]);
    for (const [C, P] of f) {
      s.end && (m("end", C[0], C[1], C[2]), m("end", P[0], P[1], P[2]));
      const y = P[0] - C[0], F = P[1] - C[1], G = P[2] - C[2], U = y * y + F * F + G * G;
      if (U < 1e-12) continue;
      const le = Math.max(0, Math.min(1, ((t - C[0]) * y + (o - C[1]) * F + (a - C[2]) * G) / U));
      if (s.nea && m("nea", C[0] + le * y, C[1] + le * F, C[2] + le * G), s.int && Math.abs(G) > 1e-9) for (const q of z) {
        const J = (q.z - C[2]) / G;
        J < -1e-6 || J > 1 + 1e-6 || m("int", C[0] + J * y, C[1] + J * F, q.z);
      }
    }
    if (s.int || s.node) for (let C = 0; C < f.length; C++) for (let P = C + 1; P < f.length; P++) {
      const [y, F] = f[C], [G, U] = f[P], le = F[0] - y[0], q = F[1] - y[1], J = U[0] - G[0], Ae = U[1] - G[1], Se = le * Ae - q * J;
      if (Math.abs(Se) < 1e-12) continue;
      const Fe = y[0] - G[0], Re = y[1] - G[1], Ke = (J * Re - Ae * Fe) / Se, tt = (le * Re - q * Fe) / Se;
      if (Ke < -1e-6 || Ke > 1 + 1e-6 || tt < -1e-6 || tt > 1 + 1e-6) continue;
      const dt = (_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workZ;
      m("int", y[0] + Ke * le, y[1] + Ke * q, typeof dt == "number" ? dt : a);
    }
    const A = window.__hekatanDrawingAuxLines, j = (A == null ? void 0 : A.rawVal) ?? (A == null ? void 0 : A.val) ?? A ?? [];
    for (const C of j) {
      if (C.length !== 6) continue;
      const P = [C[0], C[1], C[2]], y = [C[3], C[4], C[5]];
      if (s.end && (m("end", P[0], P[1], P[2]), m("end", y[0], y[1], y[2])), s.mid && m("mid", (P[0] + y[0]) / 2, (P[1] + y[1]) / 2, (P[2] + y[2]) / 2), s.nea || s.per) {
        const F = y[0] - P[0], G = y[1] - P[1], U = y[2] - P[2], le = F * F + G * G + U * U;
        if (le < 1e-12) continue;
        const q = Math.max(0, Math.min(1, ((t - P[0]) * F + (o - P[1]) * G + (a - P[2]) * U) / le)), J = P[0] + q * F, Ae = P[1] + q * G, Se = P[2] + q * U;
        s.nea && m("nea", J, Ae, Se), s.per && m("per", J, Ae, Se);
      }
    }
    return d ? { type: d.type, x: d.x, y: d.y, z: d.z } : null;
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
        const m = o[+i[1]];
        m && (r = [m, [m[0] + 1e-3, m[1], m[2]]]);
      } else if (i[0] === "seg") {
        const m = a[+i[1]] || [], b = o[m[+i[2]]], z = o[m[+i[2] + 1]];
        b && z && (r = [b, z]);
      } else i[0] === "poly" && (r = (a[+i[1]] || []).map((b) => o[b]).filter(Boolean));
      if (r.length < 2) continue;
      const d = new Me().setFromPoints(r.map((m) => new _(m[0], m[1], m[2]))), g = new _t(d, Eo);
      g.renderOrder = 1200, wn.add(g);
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
        return ke.size ? s(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return ke.size ? s(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return ke.size ? s(`SELECCI\xD3N ${ke.size} objeto${ke.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
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
    Te = [], fe = [], H.visible = false, oo(), bt = null, x(), ne("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Rt();
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
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Te = [], pe.visible = false, ut.visible = false, B();
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
      const i = s[s.length - 1], r = s.slice(0, -1), d = n.some((b, z) => z !== n.length - 1 && b.includes(i)) || r.includes(i);
      let g = e.points.rawVal, m = [...n.slice(0, -1), r];
      if (!d && i === g.length - 1 && (g = g.slice(0, -1), e.points.val = g), e.polylines.val = m, r.length) {
        const b = g[r[r.length - 1]];
        b && (D = [b[0], b[1], b[2]]);
      } else D = null, pe.visible = false;
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
    Te = [], bt = null, oo(), Ie = null, Gt(), pe.visible = false, ut.visible = false, B(), ne("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), x(), Rt();
  };
  window.__hekatanFinalizeDraw = ao;
  const Io = () => {
    var _a2, _b, _c;
    Te = [], fe = [], H.visible = false;
    let t = false;
    ke.size && (ke.clear(), Mt(), t = true), ao();
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
    return ke.forEach((a) => {
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
    if (!ke.size) {
      ne(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Rt();
      return;
    }
    if (Te.push(o), Te.length === 1) {
      D = o, ne(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Rt();
      return;
    }
    const [a, n] = Te, s = [n[0] - a[0], n[1] - a[1], n[2] - a[2]];
    Te = [], pe.visible = false;
    let i = 0;
    t === "move" ? i = Do(s[0], s[1], s[2]) : (i = Ro().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ne(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), t === "move" && (ke.clear(), Mt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Rt();
  };
  window.__hekatanPasoMoverCopiar = Bo;
  const ks = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), io = (t, o, a, n, s, i) => {
    const r = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], d = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], g = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], m = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], b = r[0] * d[0] + r[1] * d[1] + r[2] * d[2], z = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], f = r[0] * g[0] + r[1] * g[1] + r[2] * g[2], A = d[0] * g[0] + d[1] * g[1] + d[2] * g[2], j = m * z - b * b;
    if (j < 1e-12) return null;
    const C = (b * A - z * f) / j, P = (m * A - b * f) / j;
    if (!s && (C < -1e-6 || C > 1 + 1e-6) || !i && (P < -1e-6 || P > 1 + 1e-6)) return null;
    const y = [t[0] + C * r[0], t[1] + C * r[1], t[2] + C * r[2]], F = [a[0] + P * d[0], a[1] + P * d[1], a[2] + P * d[2]];
    return jt(y, F) > 1e-4 ? null : y;
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
      const C = bt.poly, P = a[C];
      if (!P || P.length < 2) {
        bt = null, ne("DESFASE: esa polil\xEDnea no tiene tramos."), Rt();
        return;
      }
      const y = P.length > 2 && P[0] === P[P.length - 1], F = ks(), G = [];
      for (let Pe = 0; Pe < P.length - 1; Pe++) {
        const He = n[P[Pe]], at = n[P[Pe + 1]], we = [at[0] - He[0], at[1] - He[1], at[2] - He[2]], Ve = Math.hypot(we[0], we[1], we[2]) || 1, nt = we[0] / Ve, Tt = we[1] / Ve, $t = we[2] / Ve, Nt = [F[1] * $t - F[2] * Tt, F[2] * nt - F[0] * $t, F[0] * Tt - F[1] * nt], Wt = Math.hypot(Nt[0], Nt[1], Nt[2]) || 1;
        G.push({ a: He, b: at, n: [Nt[0] / Wt, Nt[1] / Wt, Nt[2] / Wt] });
      }
      let U = 0, le = 1 / 0;
      G.forEach((Pe, He) => {
        const at = Ot(o[0], o[1], o[2], Pe.a[0], Pe.a[1], Pe.a[2], Pe.b[0], Pe.b[1], Pe.b[2]);
        at < le && (le = at, U = He);
      });
      const q = G[U], J = Math.sign((o[0] - q.a[0]) * q.n[0] + (o[1] - q.a[1]) * q.n[1] + (o[2] - q.a[2]) * q.n[2]) || 1, Ae = nn > 0 ? nn : le;
      if (Ae < 1e-6) {
        ne("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const Se = G.map((Pe) => ({ a: [Pe.a[0] + J * Ae * Pe.n[0], Pe.a[1] + J * Ae * Pe.n[1], Pe.a[2] + J * Ae * Pe.n[2]], b: [Pe.b[0] + J * Ae * Pe.n[0], Pe.b[1] + J * Ae * Pe.n[1], Pe.b[2] + J * Ae * Pe.n[2]] })), Fe = Se.length, Re = (Pe) => {
        const He = Se[(Pe - 1 + Fe) % Fe], at = Se[Pe % Fe];
        return io(He.a, He.b, at.a, at.b, true, true) ?? at.a;
      }, Ke = [], tt = y ? Fe : Fe + 1;
      for (let Pe = 0; Pe < tt; Pe++) !y && Pe === 0 ? Ke.push(Se[0].a) : !y && Pe === Fe ? Ke.push(Se[Fe - 1].b) : Ke.push(Re(Pe));
      Dt();
      const dt = n.length;
      e.points.val = [...n, ...Ke];
      const rt = Ke.map((Pe, He) => dt + He);
      y && rt.push(dt);
      let ft = a.slice();
      ft.length && ft[ft.length - 1].length === 0 && (ft = ft.slice(0, -1)), e.polylines.val = [...ft, rt, []], bt = null, ne(`\u2713 Desfase a ${Ae.toFixed(2)} m \u2014 ${Fe} tramo${Fe === 1 ? "" : "s"} nuevo${Fe === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      x(), Rt();
      return;
    }
    let i = ve, r = Math.max(0, Je);
    if (i < 0 || i === bt.poly && r === bt.seg) {
      let P = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((y, F) => {
        for (let G = 0; G < y.length - 1; G++) {
          if (F === bt.poly && G === bt.seg) continue;
          const U = n[y[G]], le = n[y[G + 1]];
          if (!U || !le) continue;
          const q = Ot(o[0], o[1], o[2], U[0], U[1], U[2], le[0], le[1], le[2]);
          q < P && (P = q, i = F, r = G);
        }
      }), i < 0) {
        ne(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const d = a[bt.poly], g = n[d[bt.seg]], m = n[d[bt.seg + 1]], b = a[i], z = b[r], f = b[r + 1];
    if (!g || !m || z == null || f == null) {
      ne(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const A = n[z], j = n[f];
    if (t === "trim") {
      const C = io(A, j, g, m, false, false);
      if (!C) {
        ne("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Dt();
      const P = n.length;
      e.points.val = [...n, C];
      const y = [...b.slice(0, r + 1), P, ...b.slice(r + 1)];
      e.polylines.val = a.map((G, U) => U === i ? y : G);
      const F = jt(o, A) < jt(o, j);
      Fn(i, F ? r : r + 1), ne(`\u2713 Recortado en (${C[0].toFixed(2)}, ${C[1].toFixed(2)}, ${C[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const C = io(A, j, g, m, true, false);
      if (!C) {
        ne("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const y = jt(o, A) < jt(o, j) ? r : r + 1;
      if (y !== 0 && y !== b.length - 1) {
        ne("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const F = b[y];
      if (jt(C, A) + jt(C, j) < jt(A, j) + 1e-6) {
        ne("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Dt(), Ps(F) > 1) {
        const U = n.length;
        e.points.val = [...n, C];
        const le = b.slice();
        le[y] = U, e.polylines.val = a.map((q, J) => J === i ? le : q);
      } else e.points.val = n.map((U, le) => le === F ? C : U);
      ne(`\u2713 Alargada hasta (${C[0].toFixed(2)}, ${C[1].toFixed(2)}, ${C[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    x(), Rt();
  };
  window.__hekatanSelectionSize = () => ke.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return ke.clear(), o >= 0 && ke.add(`poly:${o}`), Mt(), ne(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), ke.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    ke.clear();
    const a = /* @__PURE__ */ new Set();
    return t.forEach((n, s) => {
      !n || n.length < 2 || (ke.add(`poly:${s}`), n.forEach((i) => a.add(i)));
    }), o.forEach((n, s) => {
      a.has(s) || ke.add(`pt:${s}`);
    }), Mt(), ne(`SELECCI\xD3N ${ke.size} objetos (todo el modelo) \xB7 Esc suelta`), ke.size;
  }, window.__hekatanReplicateSelection = (t, o, a, n, s = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...ke], r = e.points.rawVal, d = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], g = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), m = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), z = [];
    if (i.forEach((P) => {
      if (P.startsWith("pt:")) {
        const y = +P.slice(3);
        r[y] && m.add(y);
      } else if (P.startsWith("poly:")) {
        const y = +P.slice(5);
        if (!d[y] || d[y].length < 2) return;
        b.add(y), d[y].forEach((F) => m.add(F));
      } else if (P.startsWith("seg:")) {
        const y = P.split(":"), F = +y[1], G = +y[2], U = d[F] || [], le = U[G], q = U[G + 1];
        le != null && q != null && (z.push([le, q]), m.add(le), m.add(q));
      }
    }), !m.size) return 0;
    Dt();
    const f = [...r];
    let A = d.slice();
    A.length && A[A.length - 1].length === 0 && (A = A.slice(0, -1));
    const j = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], C = [...m];
    for (let P = 1; P <= n; P++) {
      const y = s + P, F = t * y, G = o * y, U = a * y, le = /* @__PURE__ */ new Map();
      C.forEach((q) => {
        le.set(q, f.length), f.push([r[q][0] + F, r[q][1] + G, r[q][2] + U]);
      }), b.forEach((q) => {
        const J = d[q].map((Se) => le.has(Se) ? le.get(Se) : Se), Ae = A.length;
        A.push(J), g.has(q) && j.push(Ae);
      }), z.forEach(([q, J]) => {
        A.push([le.get(q), le.get(J)]);
      });
    }
    A.push([]), e.points.val = f, e.polylines && (e.polylines.val = A), e.areas && (e.areas.val = j);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return x(), n;
  }, v.addEventListener("click", (t) => {
    var _a2, _b;
    if (tn > 5) {
      tn = 0;
      return;
    }
    tn = 0;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(E, o);
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
        const d = r[i[i.length - 1]];
        if (d) {
          const g = !!window.__hekatanOrthoMode;
          let m = Ie;
          if (!m && g) {
            const b = Math.abs(n.x - d[0]), z = Math.abs(n.y - d[1]), f = Math.abs(n.z - d[2]);
            m = b >= z && b >= f ? "x" : z >= f ? "y" : "z";
          }
          m === "x" ? n = new _(n.x, d[1], d[2]) : m === "y" ? n = new _(d[0], n.y, d[2]) : m === "z" && (n = new _(d[0], d[1], n.z));
        }
      }
    }
    if (Jt) n = Jt.clone(), ne(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const s = Qn(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n = new _(i.x, i.y, i.z), ne(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0;
        r && d > 0 && (n = new _(Math.round(n.x / d) * d, Math.round(n.y / d) * d, Math.round(n.z / d) * d));
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
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || ke.clear(), ke.has(r) ? ke.delete(r) : ke.add(r), Mt(), ne(`\u2713 Seleccionados ${ke.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
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
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, ne(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Qe = -1, Ee.visible = false;
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
      const r = Math.abs(s[1] - n[1]), g = Math.abs(s[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", m = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, m, g), ne(`\u2713 C\xEDrculo dibujado en ${g.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${m} segmentos`), Te = [];
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
      fe.push([t.x, t.y, t.z]), H.geometry.setFromPoints(fe.map((n) => new _(n[0], n[1], n[2]))), H.visible = fe.length >= 1, ne(`\u25B0 \xC1rea libre \u2014 ${fe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), x();
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
      const d = e.polylines.rawVal;
      if (d.length - 1, e.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const g = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, g];
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
      const i = e.polylines.rawVal, r = e.points.rawVal, d = i[s.polyIdx], g = r[d[s.segIdx]], m = r[d[s.segIdx + 1]];
      if (!g || !m) {
        ne("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const b = mt && mt > 0 ? mt : 3;
      Dt();
      const z = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [g[0], g[1], g[2]], [m[0], m[1], m[2]], [m[0], m[1], m[2] + b], [g[0], g[1], g[2] + b]];
      const f = e.polylines.rawVal;
      if (e.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [z, z + 1, z + 2, z + 3, z], []], e.areas) {
        const A = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, A];
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
      const r = s[0] - n[0], d = s[1] - n[1], g = s[2] - n[2], m = Math.sqrt(r * r + d * d + g * g);
      ne(`\u2713 L\xEDnea auxiliar creada \u2014 L=${m.toFixed(2)}m (cyan, no FEM)`), Te = [];
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
      const d = Math.abs(s[0] - n[0]).toFixed(1), g = Math.abs(s[1] - n[1]).toFixed(1);
      ne(`\u2713 Losa con chaflanes dibujada \u2014 ${d}\xD7${g}m, r=${i}m, ${r} seg/chafl\xE1n`), Te = [];
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
  v.addEventListener("click", () => Rt()), v.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && fe.length >= 3) {
      t.preventDefault();
      const a = un();
      ne(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), v.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(E, o);
    const a = ie();
    if (be.geometry.deleteAttribute("position"), a.length) {
      let n = a[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], d = r[r.length - 1] ?? [], g = e.points.rawVal ?? [];
        if (d.length > 0) {
          const m = g[d[d.length - 1]];
          if (m) {
            const b = !!window.__hekatanOrthoMode;
            let z = Ie;
            if (!z && b) {
              const f = Math.abs(n.x - m[0]), A = Math.abs(n.y - m[1]), j = Math.abs(n.z - m[2]);
              z = f >= A && f >= j ? "x" : A >= j ? "y" : "z";
            }
            z === "x" ? n.set(n.x, m[1], m[2]) : z === "y" ? n.set(m[0], n.y, m[2]) : z === "z" && n.set(m[0], m[1], n.z);
          }
        }
      }
      const s = Qn(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0.5;
        r && d > 0 && (n.x = Math.round(n.x / d) * d, n.y = Math.round(n.y / d) * d, n.z = Math.round(n.z / d) * d);
      }
      be.geometry.setAttribute("position", new vt(n.toArray(), 3));
    }
    x();
  }), v.addEventListener("pointermove", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(E, o);
    let a = false;
    const n = k.intersectObject(O), s = ie();
    if (n.length && s.length) {
      const i = new _(...e.points.rawVal[n[0].index]), r = new _(...s[0].point), d = i.sub(r), g = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      g.transformDirection(te.matrixWorld), Math.abs(d.dot(g)) < 1e-4 && (a = true);
    }
    be.visible = !a;
  });
  let lo = false, ro;
  v.addEventListener("pointermove", (t) => {
    var _a2;
    if (!tn) return;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(E, o);
    let a = false;
    const n = k.intersectObject(O), s = ie();
    if (n.length && s.length) {
      const r = new _(...e.points.rawVal[n[0].index]), d = new _(...s[0].point), g = r.sub(d), m = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      m.transformDirection(te.matrixWorld), Math.abs(g.dot(m)) < 1e-4 && (a = true);
    }
    if (a && tn < 5 && (lo = true, c.enabled = false, ro = n[0].index), !lo || tn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (ro !== void 0) {
      let r = s[0].point;
      (t.ctrlKey || t.metaKey) && (r = new _(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[ro] = r.toArray();
    }
    e.points.val = i;
  }), v.addEventListener("pointerup", () => {
    c.enabled = true, lo = false;
  }), v.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(E, o);
    let a = false;
    const n = k.intersectObject(O), s = ie();
    if (n.length && s.length) {
      const d = new _(...e.points.rawVal[n[0].index]), g = new _(...s[0].point), m = d.sub(g), b = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      b.transformDirection(te.matrixWorld), Math.abs(m.dot(b)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((d) => d.filter((g) => g !== n[0].index)).map((d) => d.map((g) => g > n[0].index ? g - 1 : g)).filter((d) => d.length);
    r.push([]), e.polylines.val = r;
  });
}
function xa(e, l, u) {
  const w = Math.round(14.999999999999998), p = { position: e.position.clone(), quaternion: e.quaternion.clone() }, v = setInterval(k, 1e3 / 30);
  let x = 0;
  function k() {
    x++;
    const E = x / w;
    e.position.lerpVectors(p.position, l.position, E), e.quaternion.slerpQuaternions(p.quaternion, l.quaternion, E), u && u(), x == w && clearInterval(v);
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
    const w = u[e];
    if (w && w.has(l)) return w.get(l);
  }
  return null;
}
function Sa(e, l, u, h) {
  const c = new je(), w = new ds();
  w.setColorMap("rainbow");
  const p = new Zt(), v = K.state([]);
  return K.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const x = u.val, k = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], E = ba(l.frameResults.val);
    if (c.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), c.clear(), !E || k.length === 0 || x.length === 0) {
      v.val = [];
      return;
    }
    const M = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, te = (_c = e.deformOutputs) == null ? void 0 : _c.val, ae = [], de = [];
    for (let L = 0; L < k.length; L++) {
      if (k[L].length !== 2) continue;
      const ue = _a(E, L, M, te);
      ue && (ae.push(ue[0], ue[1]), de.push({ idx: L, vals: ue }));
    }
    if (ae.length === 0) {
      v.val = [];
      return;
    }
    const se = Math.min(...ae), T = Math.max(...ae);
    w.setMin(se), w.setMax(T), v.val = ae;
    const ie = [1 / 0, 1 / 0, 1 / 0], O = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of x) for (let ee = 0; ee < 3; ee++) ie[ee] = Math.min(ie[ee], L[ee]), O[ee] = Math.max(O[ee], L[ee]);
    const ye = Math.max(O[0] - ie[0], O[1] - ie[1], O[2] - ie[2], 1) * Ma, N = [], D = [], Z = [];
    let $ = 0;
    for (const { idx: L, vals: ee } of de) {
      const ue = k[L], re = x[ue[0]], oe = x[ue[1]];
      if (!re || !oe) continue;
      const R = new _(oe[0] - re[0], oe[1] - re[1], oe[2] - re[2]), pe = R.length();
      if (pe < 1e-10) continue;
      R.normalize();
      const H = Math.abs(R.y) < 0.99 ? new _(0, 1, 0) : new _(1, 0, 0), fe = new _().crossVectors(R, H).normalize(), he = new _().crossVectors(R, fe).normalize(), $e = go + 1, _e = va;
      for (let Be = 0; Be < $e; Be++) {
        const Oe = Be / go, ut = re[0] + R.x * pe * Oe, Ft = re[1] + R.y * pe * Oe, S = re[2] + R.z * pe * Oe, I = ee[0] + (ee[1] - ee[0]) * Oe, W = w.getColor(I) ?? new Zt(0, 0, 0);
        p.copy(W).convertSRGBToLinear();
        for (let X = 0; X < _e; X++) {
          const ce = X / _e * Math.PI * 2, me = Math.cos(ce), xe = Math.sin(ce);
          N.push(ut + (fe.x * me + he.x * xe) * ye, Ft + (fe.y * me + he.y * xe) * ye, S + (fe.z * me + he.z * xe) * ye), D.push(p.r, p.g, p.b);
        }
      }
      for (let Be = 0; Be < go; Be++) for (let Oe = 0; Oe < _e; Oe++) {
        const ut = (Oe + 1) % _e, Ft = $ + Be * _e + Oe, S = $ + Be * _e + ut, I = $ + (Be + 1) * _e + Oe, W = $ + (Be + 1) * _e + ut;
        Z.push(Ft, S, W), Z.push(Ft, W, I);
      }
      $ += $e * _e;
    }
    if (N.length === 0) return;
    const V = new Me();
    V.setAttribute("position", new vt(N, 3)), V.setAttribute("color", new vt(D, 3)), V.setIndex(Z), V.computeVertexNormals();
    const Y = new it({ vertexColors: true, side: kt }), B = new et(V, Y);
    B.frustumCulled = false, c.add(B);
  }), c.__colorMapValues = v, c;
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
  const w = new Me(), p = new ct({ color: ns, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), v = new Kt(w, p);
  v.visible = false, v.renderOrder = 100, l.add(v);
  const x = new it({ color: ns, transparent: true, opacity: 0.7, depthTest: false }), k = new et(new Oo(1, 1, 1, 12), x);
  k.visible = false, k.renderOrder = 100, l.add(k);
  const E = new Me(), M = new it({ color: Aa, transparent: true, opacity: 0.45, side: kt, depthTest: false }), te = new et(E, M);
  te.visible = false, te.renderOrder = 100, l.add(te);
  const ae = new Me(), de = new ct({ color: Ea, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Kt(ae, de);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const T = new it({ color: Nn, transparent: true, opacity: 0.95, depthTest: false }), ie = new it({ color: Nn, transparent: true, opacity: 0.85, depthTest: false }), O = new Oo(1, 1, 1, 12), be = new it({ color: Nn, transparent: true, opacity: 0.55, side: kt, depthTest: false }), ye = new ct({ color: Nn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), N = [];
  window.__hekatanModelSelection = N;
  const D = new je();
  D.renderOrder = 101, l.add(D);
  const Z = document.createElement("div");
  Object.assign(Z.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), Z.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(Z);
  }, 0);
  function $(S) {
    const I = e.derivedNodes.rawVal;
    return !I || S < 0 || S >= I.length ? null : new _(I[S][0], I[S][1], I[S][2]);
  }
  function V(S, I) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s;
    const W = e.getActiveCamera();
    if (!W || !e.mesh) return null;
    const X = e.rendererElm.getBoundingClientRect(), ce = S - X.left, me = I - X.top, xe = e.derivedNodes.rawVal, ge = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!xe || !ge) return null;
    const Xe = /* @__PURE__ */ new Map(), Ce = (Ge) => {
      if (Xe.has(Ge)) return Xe.get(Ge);
      const Ye = $(Ge);
      if (!Ye) return Xe.set(Ge, null), null;
      const ze = Ye.clone().project(W), Ee = (ze.x * 0.5 + 0.5) * X.width, ve = (-ze.y * 0.5 + 0.5) * X.height, Je = { x: Ee, y: ve, z: ze.z };
      return Xe.set(Ge, Je), Je;
    }, Ne = /* @__PURE__ */ new Set();
    for (const Ge of ge) if (Ge) for (const Ye of Ge) Ne.add(Ye);
    const Le = 8;
    let Ze = -1, lt = Le;
    for (let Ge = 0; Ge < xe.length; Ge++) {
      if (!Ne.has(Ge)) continue;
      const Ye = Ce(Ge);
      if (!Ye || Ye.z < -1 || Ye.z > 1) continue;
      const ze = Ye.x - ce, Ee = Ye.y - me, ve = Math.sqrt(ze * ze + Ee * Ee);
      ve < lt && (lt = ve, Ze = Ge);
    }
    const We = ka(), ot = Ca[We.dispUnit] ?? 1e3, Ie = Pa[We.forceUnit] ?? 1;
    if (Ze >= 0) {
      const Ge = xe[Ze];
      let Ye = `Nodo ${Ze}
(${Ge[0].toFixed(3)}, ${Ge[1].toFixed(3)}, ${Ge[2].toFixed(3)})`;
      const ze = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (ze == null ? void 0 : ze.deformations) {
        const Ee = ze.deformations.get(Ze);
        if (Ee && (Ye += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ye += `
Ux = ${wt(Ee[0] * ot, 3)} ${We.dispUnit}`, Ye += `
Uy = ${wt(Ee[1] * ot, 3)} ${We.dispUnit}`, Ye += `
Uz = ${wt(Ee[2] * ot, 3)} ${We.dispUnit}`, (Math.abs(Ee[3]) > 1e-9 || Math.abs(Ee[4]) > 1e-9 || Math.abs(Ee[5]) > 1e-9) && (Ye += `
Rx = ${wt(Ee[3] * 1e3, 3)} mrad`, Ye += `
Ry = ${wt(Ee[4] * 1e3, 3)} mrad`, Ye += `
Rz = ${wt(Ee[5] * 1e3, 3)} mrad`)), ze.reactions) {
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
          const ze = Ce(Ye[0]), Ee = Ce(Ye[1]);
          if (!ze || !Ee || ze.z < -1 || ze.z > 1 || Ee.z < -1 || Ee.z > 1) continue;
          const ve = Va(ce, me, ze.x, ze.y, Ee.x, Ee.y);
          ve < Gt && (Gt = ve, qe = Ge, Bt = "frame");
        } else if (Ye.length === 3 || Ye.length === 4) {
          const ze = [];
          let Ee = true;
          for (const ve of Ye) {
            const Je = Ce(ve);
            if (!Je || Je.z < -1 || Je.z > 1) {
              Ee = false;
              break;
            }
            ze.push(Je);
          }
          if (!Ee) continue;
          if ($a(ce, me, ze)) {
            const Je = ze.reduce((Qe, ke) => Qe + ke.z, 0) / ze.length * 1e-3;
            Je < Gt && (Gt = Je, qe = Ge, Bt = "shell");
          }
        } else if (Ye.length === 8) {
          const ze = [];
          let Ee = true;
          for (const De of Ye) {
            const Ue = Ce(De);
            if (!Ue || Ue.z < -1 || Ue.z > 1) {
              Ee = false;
              break;
            }
            ze.push(Ue);
          }
          if (!Ee) continue;
          const ve = Math.min(...ze.map((De) => De.x)), Je = Math.max(...ze.map((De) => De.x)), Qe = Math.min(...ze.map((De) => De.y)), ke = Math.max(...ze.map((De) => De.y));
          if (ce >= ve && ce <= Je && me >= Qe && me <= ke) {
            const Ue = ze.reduce((yt, Pt) => yt + Pt.z, 0) / ze.length * 1e-3;
            Ue < Gt && (Gt = Ue, qe = Ge, Bt = "solid");
          }
        }
      }
    }
    if (qe >= 0) {
      const Ge = ge[qe];
      let ze = `${Bt === "frame" ? "Frame" : Bt === "shell" ? "Shell" : "Solid"} ${qe}`;
      const Ee = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, ve = (_g = (_f = Ee == null ? void 0 : Ee.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, qe);
      if (ve) {
        ve.name && (ze += `
  \u{1F4CB} ${ve.name}`), ve.shape && (ze += `
  Shape: ${ve.shape}`);
        const Je = /concrete|hormig|rect.*sólida/i.test(ve.shape || ""), Qe = Je ? 100 : 1e3, ke = Je ? "cm" : "mm", De = (yt) => {
          const Pt = yt * Qe;
          return Math.abs(Pt - Math.round(Pt)) < 0.05 ? `${Math.round(Pt)}` : `${Pt.toFixed(1)}`;
        }, Ue = [];
        if (ve.D != null && Ue.push(`D=${De(ve.D)}`), ve.B != null && Ue.push(`B=${De(ve.B)}`), ve.TF != null && Ue.push(`TF=${De(ve.TF)}`), ve.TW != null && Ue.push(`TW=${De(ve.TW)}`), ve.t != null && Ue.push(`t=${De(ve.t)}`), Ue.length && (ze += `
  Dim: ${Ue.join(" ")} ${ke}`), ve.material) {
          let yt = ve.material;
          ve.fillMaterial && (yt += ` + FILL "${ve.fillMaterial}"`), ze += `
  Mat: ${yt}`;
        }
      } else {
        const Je = (_i = (_h = Ee == null ? void 0 : Ee.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, qe), Qe = (_k = (_j = Ee == null ? void 0 : Ee.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, qe);
        Je ? (ze += `
  ${Je}`, Qe && !Je.includes(Qe) && (ze += `  (${Qe})`)) : Qe && (ze += `
  Material: ${Qe}`);
      }
      if (ze += `
nodos: [${Ge.join(", ")}]`, Bt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Je = e.mesh.analyzeOutputs.rawVal, Qe = za[We.stressUnit] ?? 1, ke = [["bendingXX", "Mxx", Ie, `${We.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ie, `${We.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ie, `${We.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ie, `${We.forceUnit}/m`], ["membraneYY", "Nyy", Ie, `${We.forceUnit}/m`], ["membraneXY", "Nxy", Ie, `${We.forceUnit}/m`], ["shearX", "Qx", Ie, `${We.forceUnit}/m`], ["shearY", "Qy", Ie, `${We.forceUnit}/m`], ["vonMises", "\u03C3VM", Qe, We.stressUnit], ["pressure", "p", Qe, We.stressUnit]], De = [];
        for (const [Ue, yt, Pt, Ct] of ke) {
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
        const Je = e.mesh.deformOutputs.rawVal, Qe = e.mesh.elementInputs.rawVal, ke = Je == null ? void 0 : Je.deformations;
        if (ke && Ge.length === 2) {
          const De = ke.get(Ge[0]), Ue = ke.get(Ge[1]), yt = xe[Ge[0]], Pt = xe[Ge[1]];
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
  function Y(S, I, W) {
    var _a2, _b, _c;
    if (c.visible = false, v.visible = false, k.visible = false, te.visible = false, se.visible = false, !S || !e.mesh) {
      Z.style.display = "none", e.render();
      return;
    }
    const X = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (S.type === "node") {
      const ge = $(S.idx);
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
    } else if (S.type === "frame" && X) {
      const ge = X[S.idx], Xe = $(ge[0]), Ce = $(ge[1]);
      if (Xe && Ce) {
        const Ne = Xe.clone().add(Ce).multiplyScalar(0.5), Le = Ce.clone().sub(Xe), Ze = Le.length(), ot = e.getActiveCamera().position.distanceTo(Ne) * 35e-4;
        k.position.copy(Ne);
        const Ie = new _(0, 1, 0), Jt = Ie.clone().cross(Le).normalize(), qe = Ie.angleTo(Le);
        k.quaternion.setFromAxisAngle(Jt, qe), k.scale.set(ot, Ze, ot), k.visible = true;
      }
    } else if (S.type === "shell" && X) {
      const ge = X[S.idx], Xe = [], Ce = [];
      for (const Ne of ge) {
        const Le = $(Ne);
        if (!Le) return;
        Xe.push(Le.x, Le.y, Le.z);
      }
      ge.length === 4 ? Ce.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && Ce.push(0, 1, 2), E.setAttribute("position", new vt(Xe, 3)), E.setIndex(Ce), E.computeVertexNormals(), te.visible = true;
    } else if (S.type === "solid" && X) {
      const ge = X[S.idx], Xe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ce = [];
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
    Z.textContent = S.info, Z.style.whiteSpace = "pre-line", Z.style.display = "block";
    const me = e.rendererElm.getBoundingClientRect(), xe = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? me;
    Z.style.left = `${I - xe.left}px`, Z.style.top = `${W - xe.top}px`, e.render();
  }
  let B = "", L = 0, ee = 0;
  const ue = window.__hekatanHoverDebug ?? false, re = (S) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const I = V(S.clientX, S.clientY);
      if (ue && ee < 5) {
        const X = e.derivedNodes.rawVal, ce = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${S.clientX}, ${S.clientY}) nodes=${(X == null ? void 0 : X.length) ?? 0} elems=${(ce == null ? void 0 : ce.length) ?? 0} hover=`, I), ee++;
      }
      const W = I ? `${I.type}:${I.idx}` : "";
      if (W !== B) B = W, Y(I, S.clientX, S.clientY);
      else if (I) {
        const X = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        Z.style.left = `${S.clientX - X.left}px`, Z.style.top = `${S.clientY - X.top}px`;
      }
    });
  };
  let oe = null;
  const R = () => {
    B = "", c.visible = false, v.visible = false, k.visible = false, te.visible = false, se.visible = false, Z.style.display = "none", e.render();
  }, pe = (S) => {
    const I = e.rendererElm.getBoundingClientRect(), W = S.clientX - I.left, X = S.clientY - I.top;
    (W < -2 || X < -2 || W > I.width + 2 || X > I.height + 2) && (oe && clearTimeout(oe), oe = window.setTimeout(R, 200));
  }, H = () => {
    oe && (clearTimeout(oe), oe = null);
  };
  e.rendererElm.addEventListener("pointermove", re), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", H);
  function fe() {
    var _a2, _b, _c;
    const S = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return S === "select" || S === "none" || !S;
  }
  let he = null;
  e.rendererElm.addEventListener("pointerdown", (S) => {
    S.button === 0 && (he = { x: S.clientX, y: S.clientY });
  }), e.rendererElm.addEventListener("pointerup", (S) => {
    if (S.button !== 0 || !he) return;
    const I = S.clientX - he.x, W = S.clientY - he.y;
    if (he = null, I * I + W * W > 9 || !fe()) return;
    const X = V(S.clientX, S.clientY);
    X ? (ut({ type: X.type, idx: X.idx }, S.shiftKey), Oe()) : Ft();
  }), window.addEventListener("keydown", (S) => {
    if (S.key !== "Escape" || !N.length) return;
    const I = document.activeElement, W = !!I && (I.id === "hk3-cmd-input" || I.id === "hk-dyn-input") && I.value === "";
    I && (I.tagName === "INPUT" || I.tagName === "TEXTAREA" || I.isContentEditable) && !W || Ft();
  }, { capture: true });
  function $e() {
    for (const S of D.children.slice()) {
      D.remove(S);
      const I = S.geometry;
      I && I !== u && I !== O && I.dispose();
    }
  }
  const _e = (S) => {
    var _a2;
    const I = e.getActiveCamera(), W = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return I.isOrthographicCamera ? (I.top - I.bottom) / (I.zoom || 1) / W : 2 * I.position.distanceTo(S) * Math.tan((I.fov || 50) * Math.PI / 180 / 2) / W;
  };
  function Be(S, I) {
    var _a2, _b;
    const W = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (S.type === "node") {
      const X = $(S.idx);
      if (!X) return;
      const ce = new et(u, T);
      ce.position.copy(X), ce.scale.setScalar(Math.max(1e-4, 7 * _e(X))), ce.renderOrder = 101, D.add(ce);
    } else if (S.type === "frame" && W) {
      const X = W[S.idx], ce = $(X[0]), me = $(X[1]);
      if (!ce || !me) return;
      const xe = ce.clone().add(me).multiplyScalar(0.5), ge = me.clone().sub(ce), Xe = ge.length(), Ce = e.getActiveCamera().position.distanceTo(xe), Ne = new et(O, ie);
      Ne.position.copy(xe);
      const Le = new _(0, 1, 0);
      Ne.quaternion.setFromAxisAngle(Le.clone().cross(ge).normalize(), Le.angleTo(ge)), Ne.scale.set(Ce * 35e-4, Xe, Ce * 35e-4), Ne.renderOrder = 101, D.add(Ne);
    } else if (S.type === "shell" && W) {
      const X = W[S.idx], ce = [], me = [];
      for (const Xe of X) {
        const Ce = $(Xe);
        if (!Ce) return;
        ce.push(Ce.x, Ce.y, Ce.z);
      }
      X.length === 4 ? me.push(0, 1, 2, 0, 2, 3) : X.length === 3 && me.push(0, 1, 2);
      const xe = new Me();
      xe.setAttribute("position", new vt(ce, 3)), xe.setIndex(me), xe.computeVertexNormals();
      const ge = new et(xe, be);
      ge.renderOrder = 101, D.add(ge);
    } else if (S.type === "solid" && W) {
      const X = W[S.idx], ce = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], me = [];
      for (const [Xe, Ce] of ce) {
        const Ne = $(X[Xe]), Le = $(X[Ce]);
        Ne && Le && me.push(Ne.x, Ne.y, Ne.z, Le.x, Le.y, Le.z);
      }
      const xe = new Me();
      xe.setAttribute("position", new vt(me, 3));
      const ge = new Kt(xe, ye);
      ge.renderOrder = 101, D.add(ge);
    }
  }
  function Oe() {
    if ($e(), !N.length || !e.mesh) {
      e.render();
      return;
    }
    const S = e.derivedNodes.rawVal ?? [];
    if (S.length >= 2) {
      const I = [1 / 0, 1 / 0, 1 / 0], W = [-1 / 0, -1 / 0, -1 / 0];
      for (const X of S) for (let ce = 0; ce < 3; ce++) X[ce] < I[ce] && (I[ce] = X[ce]), X[ce] > W[ce] && (W[ce] = X[ce]);
      Math.max(W[0] - I[0], W[1] - I[1], W[2] - I[2], 0.1);
    }
    for (const I of N) Be(I);
    e.render();
  }
  function ut(S, I) {
    const W = N.findIndex((X) => X.type === S.type && X.idx === S.idx);
    W >= 0 ? N.splice(W, 1) : I || N.push(S), N.length && N[N.length - 1];
  }
  function Ft() {
    N.length = 0, Oe();
  }
  return K.derive(() => {
    e.derivedNodes.val, N.length && Oe();
  }), l;
}
function Va(e, l, u, h, c, w) {
  const p = c - u, v = w - h, x = p * p + v * v;
  if (x < 1e-9) {
    const de = e - u, se = l - h;
    return Math.sqrt(de * de + se * se);
  }
  let k = ((e - u) * p + (l - h) * v) / x;
  k = Math.max(0, Math.min(1, k));
  const E = u + k * p, M = h + k * v, te = e - E, ae = l - M;
  return Math.sqrt(te * te + ae * ae);
}
function $a(e, l, u) {
  let h = false;
  for (let c = 0, w = u.length - 1; c < u.length; w = c++) {
    const p = u[c].x, v = u[c].y, x = u[w].x, k = u[w].y;
    v > l != k > l && e < (x - p) * (l - v) / (k - v + 1e-12) + p && (h = !h);
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
  const c = Array.from({ length: l + 1 }, (x, k) => k / l).reverse();
  let w, p;
  c.forEach((x, k) => {
    w = document.createElement("div"), w.id = `marker-${k}`, w.className = "marker", w.style.marginTop = k == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", p = document.createElement("p"), p.id = `marker-text-${k}`, w.append(p), u.append(w);
  });
  const v = [];
  return u.querySelectorAll("p").forEach((x) => v.push(x)), setTimeout(() => {
    K.derive(() => {
      c.forEach((x, k) => {
        const E = v[k];
        E && (E.innerText = La(e.val, x).toString());
      });
    });
  }), u;
}
function La(e, l) {
  const u = zn.val;
  if (u) return ss(u[0] + l * (u[1] - u[0]));
  const h = e.filter((p) => Number.isFinite(p));
  if (h.length === 0) return "0";
  const [c, w] = _o(h);
  return ss(c + l * (w - c));
}
function ss(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function Ga({ mesh: e, settingsObj: l, drawingObj: u, objects3D: h, solids: c }) {
  Ks.DEFAULT_UP = new _(0, 0, 1);
  const w = document.createElement("div"), p = new Ys(), v = new Us(45, 1, 0.1, 2 * 1e6), x = new Zs(-10, 10, 10, -10, -1e3, 2e6);
  let k = v;
  const E = new qs({ antialias: true });
  E.localClippingEnabled = true;
  const M = new Qo(v, E.domElement);
  M.enableDamping = true, M.dampingFactor = 0.1, M.screenSpacePanning = true, M.zoomSpeed = 0.8, M.panSpeed = 1.2, M.rotateSpeed = 0.9, M.keyPanSpeed = 12, M.listenToKeyEvents(window), M.touches = { ONE: Bn.ROTATE, TWO: Bn.DOLLY_PAN }, E.domElement.addEventListener("wheel", (S) => {
    if (!S.ctrlKey && Math.abs(S.deltaX) > Math.abs(S.deltaY) * 1.5) {
      S.preventDefault();
      const I = M.target, W = new _().subVectors(v.position, I), X = new _();
      X.crossVectors(v.up, W).normalize();
      const me = W.length() * 1e-3 * M.panSpeed;
      I.addScaledVector(X, S.deltaX * me), v.position.addScaledVector(X, S.deltaX * me), M.update();
    }
  }, { passive: false });
  const te = new wo(new _(-1, 0, 0), 0), ae = new wo(new _(0, -1, 0), 0), de = new wo(new _(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const S = window.__hekatanClip, I = [];
    S.enableX && (te.normal.set(S.invertX ? 1 : -1, 0, 0), te.constant = S.invertX ? -S.posX : S.posX, I.push(te)), S.enableY && (ae.normal.set(0, S.invertY ? 1 : -1, 0), ae.constant = S.invertY ? -S.posY : S.posY, I.push(ae)), S.enableZ && (de.normal.set(0, 0, S.invertZ ? 1 : -1), de.constant = S.invertZ ? -S.posZ : S.posZ, I.push(de)), E.clippingPlanes = I, p.traverse((X) => {
      const ce = X;
      if (ce.material) {
        const me = Array.isArray(ce.material) ? ce.material : [ce.material];
        for (const xe of me) xe.clippingPlanes = I, xe.needsUpdate = true;
      }
    });
    const W = window.__hekatanPanes ?? [];
    for (const X of W) try {
      X && typeof X.refresh == "function" && X.refresh();
    } catch {
    }
    E.render(p, k);
  }
  se(), window.__hekatanClipApply = se;
  const T = Qs(l), ie = K.derive(() => Math.pow(10, T.displayScale.val / 10)), O = Ia(e, T), be = () => {
    const S = [];
    return T.gridXY.rawVal && S.push("xy"), T.gridXZ.rawVal && S.push("xz"), T.gridYZ.rawVal && S.push("yz"), S;
  }, ye = () => {
    const S = T.gridStep.rawVal, I = Math.max(S, T.gridMajor.rawVal);
    return { planes: be(), majorStep: I, minorStep: S };
  };
  let N = xo(T.gridSize.rawVal, ye());
  N.visible = T.gridVisible.rawVal, window.__hekatanSnap2D = T.cursorSnap.rawVal;
  const D = () => {
    const S = Math.max(0, Math.min(1, T.gridOpacity.rawVal));
    N.traverse((I) => {
      const W = I.material;
      if (!W || !("opacity" in W)) return;
      const X = I.name ?? "";
      let ce = 0.35;
      X.includes("border") ? ce = 1 : X.includes("major") && (ce = 0.75), W.opacity = S * ce;
    });
  };
  D(), w.appendChild(Os(T, e, c)), w.setAttribute("id", "viewer"), w.appendChild(E.domElement), E.setPixelRatio(window.devicePixelRatio);
  const Z = an();
  E.setClearColor(Z.background, 1);
  const $ = T.gridSize.rawVal, V = $ * 0.5 + $ * 0.5 / Math.tan(45 * 0.5);
  v.position.set(0, 0, V), v.up.set(0, 1, 0), M.target.set(0, 0, 0), M.minDistance = 0.1, M.maxDistance = 1e4, w.__settings = T, M.zoomSpeed = 1, M._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, M.update();
  let Y = es(T.gridSize.rawVal, T.flipAxes.rawVal);
  p.add(N, Y), K.derive(() => {
    window.__hekatanGridPlaneXY = T.gridXY.val, window.__hekatanGridPlaneXZ = T.gridXZ.val, window.__hekatanGridPlaneYZ = T.gridYZ.val;
  });
  let B = true;
  K.derive(() => {
    const S = T.gridVisible.val;
    if (B) {
      B = false;
      return;
    }
    N.visible = S, H();
  });
  let L = true;
  K.derive(() => {
    if (T.gridOpacity.val, L) {
      L = false;
      return;
    }
    D(), H();
  }), K.derive(() => {
    const S = T.cursorSnap.val;
    window.__hekatanSnap2D = S;
  });
  let ee = true;
  K.derive(() => {
    var _a2;
    const S = T.gridSize.val, I = T.flipAxes.val;
    if (T.gridXY.val, T.gridXZ.val, T.gridYZ.val, T.gridStep.val, T.gridMajor.val, ee) {
      ee = false;
      return;
    }
    p.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (ce) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ce.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = xo(S, ye()), N.visible = T.gridVisible.rawVal, p.add(N), D(), p.remove(Y), Y.traverse((ce) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = ce.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = ce.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Y = es(S, I), p.add(Y);
    const W = S * 0.5 + S * 0.5 / Math.tan(45 * 0.5);
    v.position.distanceTo(M.target), Math.abs(v.position.x) < 0.1 && Math.abs(v.position.y) < 0.1 && v.position.z > 0 ? v.position.set(0, 0, W) : v.position.set(0.5 * S, -W, 0.5 * S), M.target.set(0, 0, 0), M.minDistance = Math.max(0.05, S * 0.01), M.maxDistance = Math.max(50, S * 50), M.update(), H();
  }), new ResizeObserver((S) => {
    var _a2, _b;
    for (const I of S) {
      const W = (_a2 = I.target) == null ? void 0 : _a2.clientWidth, X = (_b = I.target) == null ? void 0 : _b.clientHeight;
      if (W === 0 || X === 0) continue;
      const me = (re ? W / 2 : W) / X;
      v.aspect = me, v.updateProjectionMatrix();
      const xe = x.top;
      if (x.left = -xe * me, x.right = xe * me, x.updateProjectionMatrix(), oe && oe.isPerspectiveCamera) oe.aspect = me, oe.updateProjectionMatrix();
      else if (oe && oe.isOrthographicCamera) {
        const ge = oe, Xe = ge.top;
        ge.left = -Xe * me, ge.right = Xe * me, ge.updateProjectionMatrix();
      }
      E.setSize(W, X), H();
    }
  }).observe(w), M.addEventListener("change", H), K.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e2 = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e2.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, T.displayScale.val, T.nodes.val, T.elements.val, (_g = T.edges) == null ? void 0 : _g.val, T.elemColumns.val, T.elemBeams.val, T.nodesIndexes.val, T.elementsIndexes.val, T.orientations.val, T.sections.val, T.secColumns.val, T.secBeams.val, T.secFloor.val, T.supports.val, T.loads.val, T.deformedShape.val, T.nodeResults.val, T.frameResults.val, T.shellResults.val, (_h = T.solidResults) == null ? void 0 : _h.val, (_i = T.extruded) == null ? void 0 : _i.val, setTimeout(H);
  });
  let re = false, oe = null, R = null, pe = false;
  function H() {
    const S = w.clientWidth || 1, I = w.clientHeight || 1;
    if (!re || !oe) {
      E.setScissorTest(false), E.setViewport(0, 0, S, I), E.render(p, k);
      return;
    }
    const W = S / 2;
    E.setScissorTest(true), E.setViewport(0, 0, W, I), E.setScissor(0, 0, W, I), E.render(p, k), E.setViewport(W, 0, W, I), E.setScissor(W, 0, W, I), E.render(p, oe), E.setScissorTest(false);
  }
  function fe(S) {
    k = S, M.object = S, M.update(), H();
  }
  function he(S, I) {
    re = S, I && (oe = I);
    const W = w.clientWidth || 1, X = w.clientHeight || 1, me = (S ? W / 2 : W) / X;
    v.isPerspectiveCamera && (v.aspect = me, v.updateProjectionMatrix());
    const xe = x.top;
    if (x.left = -xe * me, x.right = xe * me, x.updateProjectionMatrix(), S && oe) {
      if (R ? (R.object = oe, R.update()) : (R = new Qo(oe, E.domElement), R.enableDamping = true, R.dampingFactor = 0.1, R.screenSpacePanning = true, R.zoomSpeed = 0.8, R.panSpeed = 1.2, R.rotateSpeed = 0.9, R.touches = { ONE: Bn.ROTATE, TWO: Bn.DOLLY_PAN }, R.target.copy(M.target), R.addEventListener("change", H), R.enabled = false), !pe) {
        const ge = (Xe) => {
          if (!re || !R) return;
          const Ce = E.domElement.getBoundingClientRect(), Ne = Xe.clientX - Ce.left, Le = Ce.width / 2, Ze = Ne >= Le;
          M.enabled = !Ze, R.enabled = Ze;
        };
        E.domElement.addEventListener("pointerdown", ge, true), E.domElement.addEventListener("wheel", ge, { capture: true, passive: true }), pe = true;
      }
    } else S || (M.enabled = true, R && (R.enabled = false));
    w.__splitMode = S, window.__hekatanSplitMode = S, window.__hekatanSplitCamera = S ? oe : null, H();
  }
  if (e) {
    p.add(js(T, O, ie), Gs(e, T, O), na(T, O, ie), oa(e, T, O, ie), ea(e, T, O, ie), ta(e, T, O, ie), ia(e, T, O, ie), ra(e, T, O, ie), ua(e, T, O), wa(e, T, O, ie), fa(e, T, O, ie));
    const S = Ta({ scene: p, rendererElm: E.domElement, getActiveCamera: () => k, derivedNodes: O, derivedDisplayScale: ie, mesh: e, settings: T, render: H });
    p.add(S);
    const I = Ya(e, T), W = ga(e, T, O, I), X = os(I);
    p.add(W), w.appendChild(X);
    const ce = Sa(e, T, O);
    p.add(ce);
    const me = ce.__colorMapValues, xe = os(me);
    xe.id = "frame-legend", w.appendChild(xe), K.derive(() => {
      var _a2;
      const ge = T.shellResults.val != "none", Xe = (((_a2 = T.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ce = ge || Xe, Ne = T.frameResults.val.startsWith("contour:"), Le = I.val.some((Ze) => Number.isFinite(Ze));
      X.hidden = !Ce || !Le, W.visible = Ce, xe.hidden = !Ne;
    });
  }
  if (c) {
    const S = new rs(16777215, 0.5);
    p.add(S);
    const I = new qn(16777215, 0.5);
    I.position.set(30, 25, -10), I.shadow.mapSize.width = 1024, I.shadow.mapSize.height = 1024, p.add(I);
    const W = 10;
    I.shadow.camera.left = -W, I.shadow.camera.right = W, I.shadow.camera.top = W, I.shadow.camera.bottom = -W, I.shadow.camera.far = 1e3;
    const X = new qn(16777215, 0.5);
    X.color.setHSL(11, 43, 96), X.position.set(-10, 0, 30), p.add(X), K.derive(() => {
      (c == null ? void 0 : c.val.length) && (p.remove(...c.oldVal), p.add(...c.rawVal), H());
    }), K.derive(() => {
      c.rawVal.forEach((ce) => ce.visible = T.solids.val), H();
    });
  }
  if (h) {
    const S = [], I = (X) => {
      var _a2;
      return ((_a2 = X == null ? void 0 : X.userData) == null ? void 0 : _a2.isCota) ? T.showCotas.val : T.custom3D.val;
    }, W = () => {
      for (const X of S) X.visible = I(X);
      H();
    };
    K.derive(() => {
      const X = h.val;
      S.length && (p.remove(...S), S.length = 0), X.length && (p.add(...X), S.push(...X), W()), H();
    }), K.derive(() => {
      T.custom3D.val, W();
    }), K.derive(() => {
      T.showCotas.val, W();
    });
  }
  u && ya({ drawingObj: u, gridObj: N, scene: p, getActiveCamera: () => k, controls: M, gridSize: $, derivedDisplayScale: ie, rendererElm: E.domElement, viewerRender: H }), is((S, I) => {
    var _a2;
    E.setClearColor(I.background, 1), p.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (W) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = W.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = W.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = xo(T.gridSize.rawVal, { planes: be() }), p.add(N), w.style.setProperty("--awatif-legend-color", I.legendMarker), H();
  });
  const $e = { scene: p, perspCamera: v, orthoCamera: x, get camera() {
    return k;
  }, controls: M, renderer: E, rendererElm: E.domElement, render: H, setActiveCamera: fe, setSplitMode: he, get splitMode() {
    return re;
  }, get splitCamera() {
    return oe;
  }, settings: T };
  w.__ctx = $e;
  const _e = document.createElement("div");
  _e.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Be = (S, I, W) => {
    const X = document.createElement("button");
    return X.textContent = S, X.title = I, X.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), X.onmouseenter = () => {
      X.style.background = "rgba(70,70,70,0.9)";
    }, X.onmouseleave = () => {
      X.style.background = "rgba(40,40,40,0.85)";
    }, X.onclick = (ce) => {
      ce.preventDefault(), W();
    }, X;
  }, Oe = (S, I) => {
    const W = M.target, X = new _().subVectors(k.position, W), ce = X.length(), me = new _(), xe = new _();
    me.crossVectors(k.up, X).normalize(), xe.copy(k.up).normalize();
    const ge = ce * 0.05;
    W.addScaledVector(me, -S * ge), W.addScaledVector(xe, I * ge), k.position.addScaledVector(me, -S * ge), k.position.addScaledVector(xe, I * ge), M.update(), H();
  }, ut = (S) => {
    const I = new _().subVectors(k.position, M.target);
    I.multiplyScalar(S), k.position.copy(M.target).add(I), M.update(), H();
  }, Ft = () => {
    const S = document.createElement("div");
    return S.style.cssText = "width:32px;height:32px;", S;
  };
  return _e.append(Ft()), _e.append(Be("\u2191", "Pan arriba", () => Oe(0, 1))), _e.append(Be("\u2295", "Zoom in", () => ut(0.85))), _e.append(Be("\u2190", "Pan izquierda", () => Oe(-1, 0))), _e.append(Be("\u2302", "Reset vista", () => {
    M.reset(), H();
  })), _e.append(Be("\u2192", "Pan derecha", () => Oe(1, 0))), _e.append(Be("\u2296", "Zoom out", () => ut(1.18))), _e.append(Be("\u2193", "Pan abajo", () => Oe(0, -1))), _e.append(Ft()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(_e), w;
}
function Ia(e, l) {
  return K.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const u = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || u.length === 0) return u;
    const c = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, p = Number.isFinite(c) ? c : 1, v = Number.isFinite(w) ? w : 1;
    return u.map((x, k) => {
      var _a3;
      const E = ((_a3 = h.get(k)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], M = Number.isFinite(E[0]) ? E[0] : 0, te = Number.isFinite(E[1]) ? E[1] : 0, ae = Number.isFinite(E[2]) ? E[2] : 0;
      return [x[0] + M * p, x[1] + te * p, x[2] + ae * v];
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
    const c = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), de = (I, W) => {
      I == null ? void 0 : I.forEach((X, ce) => {
        const me = e.elements.val[ce];
        if (me) for (let xe = 0; xe < me.length; xe++) W.set(me[xe], [X[xe] ?? X[0]]);
      });
    };
    de((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), de((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), de((_f = (_e2 = e.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, p), de((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, v), de((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, x), de((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, k), de((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, E), de((_p = (_o2 = e.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, M), de((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, te), de((_t2 = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t2.pressure, ae);
    const se = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), ye = (I, W, X, ce, me) => {
      I.forEach((xe, ge) => {
        var _a3, _b2;
        const Xe = xe[0] ?? 0, Ce = ((_a3 = W.get(ge)) == null ? void 0 : _a3[0]) ?? 0, Ne = ((_b2 = X.get(ge)) == null ? void 0 : _b2[0]) ?? 0, Le = (Xe + Ce) / 2, Ze = Math.hypot((Xe - Ce) / 2, Ne);
        ce.set(ge, [Le + Ze]), me.set(ge, [Le - Ze]);
      });
    };
    ye(v, x, k, se, T), ye(c, w, p, ie, O), E.forEach((I, W) => {
      var _a3;
      be.set(W, [Math.hypot(I[0] ?? 0, ((_a3 = M.get(W)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const N = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, D = (_w = l.solidResults) == null ? void 0 : _w.val, $ = D && D !== "none" ? D : l.shellResults.val, V = N == null ? void 0 : N[$], Y = { bendingXX: [c, 0], bendingYY: [w, 0], bendingXY: [p, 0], membraneXX: [v, 0], membraneYY: [x, 0], membraneXY: [k, 0], tranverseShearX: [E, 0], tranverseShearY: [M, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [T, 0], bendingPrincipalMax: [ie, 0], bendingPrincipalMin: [O, 0], transverseShearMax: [be, 0], vonMises: [te, 0], pressure: [ae, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, B = l.shellResults.val, L = Ra.val, ee = Da.val, ue = B === "displacementX" || B === "displacementY" || B === "displacementZ", re = B === "bendingXX" || B === "bendingYY" || B === "bendingXY" || B === "bendingPrincipalMax" || B === "bendingPrincipalMin", oe = B === "membraneXX" || B === "membraneYY" || B === "membraneXY" || B === "membranePrincipalMax" || B === "membranePrincipalMin", R = B === "vonMises" || B === "pressure", pe = B === "tranverseShearX" || B === "tranverseShearY" || B === "transverseShearMax", H = (_D = l.solidResults) == null ? void 0 : _D.val, fe = H === "vonMises" || H === "sigmaXX" || H === "sigmaYY" || H === "sigmaZZ" || H === "tauXY" || H === "tauYZ" || H === "tauXZ", he = H === "ux" || H === "uy" || H === "uz", $e = Ba.val, _e = fe ? Na[$e] : he || ue ? as[ee] : re || oe || R || pe ? 1 / Xa[L] : 1, Be = fe ? $e : he || ue ? ee : re ? `${L}\xB7m/m` : oe ? `${L}/m\xB2` : R ? `${L}/m\xB2` : pe ? `${L}/m` : "";
    Mo.val = Be, zn.val = Array.isArray(V) && V.length === 2 ? [V[0] * _e, V[1] * _e] : null;
    const Oe = us.val, Ft = H && H !== "none" ? [te, 0] : Y[B], S = [];
    if (e.nodes.val.forEach((I, W) => {
      const X = Ft;
      if (!X || !X[0] || typeof X[0].has != "function") return;
      if (!X[0].has(W)) {
        S.push(Number.NaN);
        return;
      }
      const ce = X[0].get(W), me = ce ? ce[X[1]] ?? 0 : 0;
      S.push(me * _e);
    }), !zn.val && Oe !== "auto") {
      const I = e.nodes.val, W = /* @__PURE__ */ new Set(), X = (me, xe) => {
        var _a3;
        const ge = (_a3 = I[me[0]]) == null ? void 0 : _a3[xe];
        return me.every((Xe) => {
          var _a4;
          return Math.abs((((_a4 = I[Xe]) == null ? void 0 : _a4[xe]) ?? NaN) - ge) < 1e-6;
        });
      };
      for (const me of e.elements.val) {
        if (me.length !== 4) continue;
        const xe = X(me, 2), ge = !xe && X(me, 0), Xe = !xe && X(me, 1);
        if (Oe === "losas" ? xe : Oe === "muros" ? ge || Xe : Oe === "murosX" ? ge : Oe === "murosY" ? Xe : false) for (const Le of me) W.add(Le);
      }
      const ce = [];
      for (const me of W) {
        const xe = S[me];
        Number.isFinite(xe) && ce.push(xe);
      }
      ce.length && (zn.val = _o(ce));
    }
    u.val = S;
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
