import { N as Zt, a6 as Dn, q as Ls, v as H, a7 as Is, D as kt, M as et, B as Me, F as vt, a8 as Rs, x as pt, a9 as Bs, aa as Ds, h as Go, ab as Ho, r as ln, ac as Zn, ad as qn, a4 as rs, _ as je, a as ct, L as Kt, w as cs, b as Xs, ae as Ns, f as it, V as b, $ as an, af as mo, H as _o, d as _t, c as wo, Y as ds, Z as Gn, G as Ys, z as Cn, A as Us, ag as Kn, t as Zs, o as qs, I as tn, a2 as kn, E as Wo, S as gn, m as Xn, ah as Pn, g as Jo, i as Oo, j as Qo, C as jo, K as Ks, U as Gs, W as Hs, X as Ws, T as Nn, P as yo, O as Js } from "./theme-Dxpmbnyd.js";
import { T as St, O as es } from "./Text-DxjkL_3A.js";
import { P as ps } from "./tweakpane-BXg6ZhiP.js";
import { e as Os } from "./styles-Ce_UnsFA.js";
class us {
  constructor(l, p = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, p);
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
  setColorMap(l, p = 32) {
    this.map = xo[l] || xo.rainbow, this.n = p;
    const h = 1 / this.n, c = new Zt(), w = new Zt();
    this.lut.length = 0, this.lut.push(new Zt(this.map[0][1]));
    for (let f = 1; f < p; f++) {
      const g = f * h;
      for (let x = 0; x < this.map.length - 1; x++) if (g > this.map[x][0] && g <= this.map[x + 1][0]) {
        const S = this.map[x][0], A = this.map[x + 1][0];
        c.setHex(this.map[x][1], Dn), w.setHex(this.map[x + 1][1], Dn);
        const M = new Zt().lerpColors(c, w, (g - S) / (A - S));
        this.lut.push(M);
      }
    }
    return this.lut.push(new Zt(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Ls.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const p = Math.round(l * this.n);
    return this.lut[p];
  }
  addColorMap(l, p) {
    return xo[l] = p, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const p = l.getContext("2d", { alpha: false }), h = p.getImageData(0, 0, 1, this.n), c = h.data;
    let w = 0;
    const f = 1 / this.n, g = new Zt(), x = new Zt(), S = new Zt();
    for (let A = 1; A >= 0; A -= f) for (let M = this.map.length - 1; M >= 0; M--) if (A < this.map[M][0] && A >= this.map[M - 1][0]) {
      const G = this.map[M - 1][0], le = this.map[M][0];
      g.setHex(this.map[M - 1][1], Dn), x.setHex(this.map[M][1], Dn), S.lerpColors(g, x, (A - G) / (le - G)), c[w * 4] = Math.round(S.r * 255), c[w * 4 + 1] = Math.round(S.g * 255), c[w * 4 + 2] = Math.round(S.b * 255), c[w * 4 + 3] = 255, w += 1;
    }
    return p.putImageData(h, 0, 0), l;
  }
}
const xo = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, fs = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], Qs = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: fs, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Hn = H.state("safe"), hs = H.state("auto");
function ms(e) {
  e = Math.max(0, Math.min(1, e));
  const l = Qs[Hn.val] ?? fs;
  for (let h = 0; h < l.length - 1; h++) {
    const [c, w, f, g] = l[h], [x, S, A, M] = l[h + 1];
    if (e <= x) {
      const G = (e - c) / (x - c);
      return [w + (S - w) * G, f + (A - f) * G, g + (M - g) * G];
    }
  }
  const p = l[l.length - 1];
  return [p[1], p[2], p[3]];
}
function ts() {
  const l = new Uint8Array(1024);
  for (let h = 0; h < 256; h++) {
    const c = h / 255, [w, f, g] = ms(c);
    l[h * 4 + 0] = w, l[h * 4 + 1] = f, l[h * 4 + 2] = g, l[h * 4 + 3] = 255;
  }
  const p = new Bs(l, 256, 1, Ds);
  return p.minFilter = Go, p.magFilter = Go, p.wrapS = Ho, p.wrapT = Ho, p.needsUpdate = true, p;
}
function js() {
  const l = [];
  for (let p = 0; p <= 12; p++) {
    const h = 1 - p / 12, [c, w, f] = ms(h);
    l.push(`rgb(${c | 0},${w | 0},${f | 0}) ${(p / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function So(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((w, f) => w - f), p = (w) => l[Math.min(l.length - 1, Math.max(0, Math.round(w * (l.length - 1))))];
  let h = l.length >= 20 ? p(0.01) : l[0], c = l.length >= 20 ? p(0.99) : l[l.length - 1];
  return h >= 0 && c > 0 && (h = 0), c <= 0 && h < 0 && (c = 0), [h, c];
}
function ea(e, l, p) {
  new us();
  const h = ts(), c = new Is({ uniforms: { cmap: { value: h }, ambient: { value: 0.95 } }, vertexShader: `
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
  H.derive(() => {
    var _a2;
    Hn.val;
    const f = c.uniforms.cmap.value;
    c.uniforms.cmap.value = ts(), (_a2 = f == null ? void 0 : f.dispose) == null ? void 0 : _a2.call(f);
  });
  const w = new et(new Me(), c);
  return w.renderOrder = -1, w.frustumCulled = false, w.userData.isShellArea = true, w.name = "__hekatan_shell_colormap", H.derive(() => {
    w.geometry.setAttribute("position", new vt(e.val.flat(), 3));
    const f = [], g = [], x = [];
    l.val.forEach((j, be) => {
      j.length === 3 ? (f.push(j[0], j[1], j[2]), g.push(be), x.push(0)) : j.length === 4 && (f.push(j[0], j[1], j[2]), f.push(j[0], j[2], j[3]), g.push(be, be), x.push(0, 1));
    }), w.geometry.setIndex(new Rs(f, 1)), w.userData.faceToElem = g, w.userData.faceLocal = x;
    const S = p.val.filter((j) => Number.isFinite(j));
    let A, M;
    const G = Fn.val;
    if (G ? (M = G[0], A = G[1]) : [M, A] = So(S), A === M) {
      const j = Math.max(Math.abs(A) * 1e-6, 1e-9);
      A += j, M -= j;
    }
    const le = G && G[0] > G[1], ce = Math.min(M, A), ae = Math.max(M, A), V = ae - ce, ie = new Float32Array(p.val.length);
    for (let j = 0; j < p.val.length; j++) {
      const be = p.val[j];
      if (!Number.isFinite(be)) {
        ie[j] = -1;
        continue;
      }
      const U = ((le ? ae + ce - be : be) - ce) / V;
      ie[j] = Math.max(0, Math.min(1, U));
    }
    w.geometry.setAttribute("scalar", new pt(ie, 1));
  }), w;
}
function ta(e, l, p) {
  const h = document.createElement("div"), c = new ps({ title: "Settings", expanded: true, container: h });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(c), h.setAttribute("id", "settings");
  const w = "hk_settingsPos";
  let f = null;
  try {
    const M = localStorage.getItem(w);
    M && (f = JSON.parse(M));
  } catch {
  }
  h.style.cssText = ["position:fixed", f ? `left:${f.left}px` : "left:8px", f ? `top:${f.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const g = () => {
    const M = h.querySelector(".tp-rotv_b");
    if (!M) {
      setTimeout(g, 200);
      return;
    }
    M.style.cursor = "move", M.style.userSelect = "none";
    let G = false, le = 0, ce = 0, ae = 0, V = 0;
    M.addEventListener("mousedown", (ie) => {
      G = true, le = ie.clientX, ce = ie.clientY;
      const j = h.getBoundingClientRect();
      ae = j.left, V = j.top, h.style.left = `${ae}px`, h.style.top = `${V}px`;
    }), window.addEventListener("mousemove", (ie) => {
      if (!G) return;
      const j = ie.clientX - le, be = ie.clientY - ce, ye = Math.max(0, Math.min(window.innerWidth - 40, ae + j)), U = Math.max(0, Math.min(window.innerHeight - 40, V + be));
      h.style.left = `${ye}px`, h.style.top = `${U}px`;
    }), window.addEventListener("mouseup", () => {
      if (G) {
        G = false;
        try {
          localStorage.setItem(w, JSON.stringify({ left: parseFloat(h.style.left), top: parseFloat(h.style.top) }));
        } catch {
        }
      }
    });
  };
  if (g(), l == null ? void 0 : l.nodes) {
    c.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const M = c.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    M.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), M.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), M.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), M.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const G = M.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    G.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), G.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), G.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), G.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), G.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const le = c.addFolder({ title: "\u{1F441} Ver", expanded: false });
    le.addBinding(e.nodes, "val", { label: "Nodes" }), le.addBinding(e.elements, "val", { label: "Elements" }), le.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), le.addBinding(e.faces, "val", { label: "  Caras (fill)" }), le.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), le.addBinding(e.elemColumns, "val", { label: "    Columnas" }), le.addBinding(e.elemBeams, "val", { label: "    Vigas" }), le.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), le.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), le.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), le.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), le.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), le.addBinding(e.orientations, "val", { label: "Orientations" }), le.addBinding(e.sections, "val", { label: "Sections" }), le.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), le.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), le.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), le.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), le.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const M = c.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    M.addBinding(e.supports, "val", { label: "Supports" }), M.addBinding(e.loads, "val", { label: "Loads" }), M.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), M.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const M = c.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = M, M.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), M.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), M.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), M.addBinding(Hn, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), M.addBinding(hs, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), M.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), M.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), M.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), M.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  p && c.addBinding(e.solids, "val", { label: "Solids" });
  const x = c.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), S = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), A = () => {
    const M = window.__hekatanClipApply;
    typeof M == "function" && M();
  };
  return x.addBinding(S, "enableX", { label: "Cortar X" }).on("change", A), x.addBinding(S, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", A), x.addBinding(S, "invertX", { label: "  invertir X" }).on("change", A), x.addBinding(S, "enableY", { label: "Cortar Y" }).on("change", A), x.addBinding(S, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", A), x.addBinding(S, "invertY", { label: "  invertir Y" }).on("change", A), x.addBinding(S, "enableZ", { label: "Cortar Z" }).on("change", A), x.addBinding(S, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", A), x.addBinding(S, "invertZ", { label: "  invertir Z" }).on("change", A), h;
}
function na(e) {
  return { gridSize: H.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: H.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: H.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: H.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: H.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: H.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: H.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: H.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: H.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: H.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: H.state((e == null ? void 0 : e.nodes) ?? true), elements: H.state((e == null ? void 0 : e.elements) ?? true), edges: H.state((e == null ? void 0 : e.edges) ?? true), faces: H.state((e == null ? void 0 : e.faces) ?? true), elemColumns: H.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: H.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: H.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: H.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: H.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: H.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: H.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: H.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: H.state((e == null ? void 0 : e.orientations) ?? false), sections: H.state((e == null ? void 0 : e.sections) ?? true), extruded: H.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: H.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: H.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: H.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: H.state((e == null ? void 0 : e.secFloor) ?? -1), supports: H.state((e == null ? void 0 : e.supports) ?? true), loads: H.state((e == null ? void 0 : e.loads) ?? false), deformedShape: H.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: H.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: H.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: H.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: H.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: H.state((e == null ? void 0 : e.flipAxes) ?? false), solids: H.state((e == null ? void 0 : e.solids) ?? true), custom3D: H.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: H.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: H.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: H.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function oa(e, l, p) {
  const h = ln(), c = new Zn(new Me(), new qn({ color: h.nodePoint }));
  return rs((w, f) => {
    c.material.color.setHex(f.nodePoint);
  }), c.frustumCulled = false, H.derive(() => {
    e.nodes.val && c.geometry.setAttribute("position", new vt(l.val.flat(), 3));
  }), H.derive(() => {
    if (p.val, l.val, !e.nodes.rawVal) return;
    const w = l.rawVal ?? [];
    let f = e.gridSize.val * 0.5;
    if (w.length >= 2) {
      const x = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
      for (const A of w) for (let M = 0; M < 3; M++) x[M] = Math.min(x[M], A[M]), S[M] = Math.max(S[M], A[M]);
      f = Math.max(S[0] - x[0], S[1] - x[1], S[2] - x[2], 0.1);
    }
    const g = 0.03 * f;
    c.material.size = g * p.rawVal;
  }), H.derive(() => {
    c.visible = e.nodes.val;
  }), c;
}
function go(e, l) {
  const p = ln(), h = new je();
  h.name = "hekatan-grid";
  const c = (l == null ? void 0 : l.planes) ?? ["xy"];
  let w = (l == null ? void 0 : l.majorStep) ?? 1, f = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (w <= 0 && (w = 1), f <= 0 && (f = 0.1); e / f > 500; ) f *= 2;
  for (; e / w > 100; ) w *= 2;
  const g = e / 2;
  w = Math.max(f, Math.round(w / f) * f);
  const S = new Zt(p.grid).multiplyScalar(1.3), A = new Zt(p.grid).multiplyScalar(0.8), M = (ae, V, ie, j) => {
    const be = [], ye = ae === "xy" ? (T, Z) => [T, Z, 0] : ae === "xz" ? (T, Z) => [T, 0, Z] : (T, Z) => [0, T, Z], U = Math.floor(g / V);
    for (let T = -U; T <= U; T++) {
      const Z = T * V, N = ye(Z, -g), L = ye(Z, g);
      be.push(...N, ...L);
    }
    for (let T = -U; T <= U; T++) {
      const Z = T * V, N = ye(-g, Z), L = ye(g, Z);
      be.push(...N, ...L);
    }
    const X = new Me();
    X.setAttribute("position", new vt(be, 3));
    const K = new ct({ color: ie, transparent: true, opacity: j, depthWrite: false }), $ = new Kt(X, K);
    return $.name = `grid-${ae}-${V === f ? "minor" : "major"}`, $;
  }, G = (ae, V, ie) => {
    const j = ae === "xy" ? ($, T) => [$, T, 0] : ae === "xz" ? ($, T) => [$, 0, T] : ($, T) => [0, $, T], be = [[-g, -g], [g, -g], [g, g], [-g, g]], ye = [];
    for (const [$, T] of be) ye.push(...j($, T));
    const U = new Me();
    U.setAttribute("position", new vt(ye, 3));
    const X = new ct({ color: V, transparent: true, opacity: ie, depthWrite: false }), K = new cs(U, X);
    return K.name = `grid-${ae}-border`, K.renderOrder = 1, K;
  }, le = (ae, V, ie) => {
    const j = ae === "xy" ? (X, K) => [X, K, 0] : ae === "xz" ? (X, K) => [X, 0, K] : (X, K) => [0, X, K], be = V === "u" ? [...j(-g, 0), ...j(g, 0)] : [...j(0, -g), ...j(0, g)], ye = new Me();
    ye.setAttribute("position", new vt(be, 3));
    const U = new Kt(ye, new ct({ color: ie, transparent: true, opacity: 0.45, depthWrite: false }));
    return U.name = `grid-${ae}-eje-${V}`, U.renderOrder = 1, U;
  }, ce = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const ae of c) {
    h.add(M(ae, f, A, 0.12)), h.add(M(ae, w, S, 0.4));
    const [V, ie] = ce[ae];
    h.add(le(ae, "u", V)), h.add(le(ae, "v", ie)), h.add(G(ae, S, 0.55));
  }
  return h.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: w, minorStep: f, gridSize: e, planes: [...c] }, h;
}
function sa(e, l, p, h) {
  const c = new je(), w = new Xs(0.5, 0.5, 0.5), f = new Ns(0.45, 0.7, 4);
  f.rotateX(Math.PI / 2), f.translate(0, 0, -0.35);
  const g = new it({ color: 10166822 }), x = new it({ color: 2792847 }), S = new it({ color: 3835647 }), A = () => {
    const le = p.rawVal ?? [];
    if (le.length < 2) return l.gridSize.val * 0.5;
    let ce = [1 / 0, 1 / 0, 1 / 0], ae = [-1 / 0, -1 / 0, -1 / 0];
    for (const V of le) for (let ie = 0; ie < 3; ie++) V[ie] < ce[ie] && (ce[ie] = V[ie]), V[ie] > ae[ie] && (ae[ie] = V[ie]);
    return Math.max(ae[0] - ce[0], ae[1] - ce[1], ae[2] - ce[2], 0.1);
  }, M = () => 0.08 * A(), G = () => h.rawVal;
  return H.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    c.clear();
    const le = M();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((ce, ae) => {
      const V = p.val[ae];
      if (!V) return;
      const ie = ce ?? [], j = (ie[0] ? 1 : 0) + (ie[1] ? 1 : 0) + (ie[2] ? 1 : 0), be = (ie[3] ? 1 : 0) + (ie[4] ? 1 : 0) + (ie[5] ? 1 : 0);
      let ye;
      j >= 3 && be >= 3 ? ye = new et(w, g) : j >= 3 && be === 0 ? ye = new et(f, x) : ye = new et(f, S), ye.position.set(V[0], V[1], V[2]);
      const U = le * G();
      ye.scale.set(U, U, U), c.add(ye);
    });
  }), H.derive(() => {
    if (h.val, !l.supports.rawVal) return;
    const ce = M() * G();
    c.children.forEach((ae) => ae.scale.set(ce, ce, ce));
  }), H.derive(() => {
    c.visible = l.supports.val;
  }), c;
}
function aa(e, l, p, h) {
  const c = new je();
  c.name = "loadsGroup";
  function w(f) {
    if (f.length < 2) return 0.12 * l.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], x = [-1 / 0, -1 / 0, -1 / 0];
    for (const A of f) for (let M = 0; M < 3; M++) g[M] = Math.min(g[M], A[M]), x[M] = Math.max(x[M], A[M]);
    return 0.08 * Math.max(x[0] - g[0], x[1] - g[1], x[2] - g[2], 0.1);
  }
  return H.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    c.children.forEach((M) => M.dispose()), c.clear();
    const f = p.val, g = w(f), x = 240, S = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((M, G) => {
      f[G] && M.slice(0, 3).some((le) => Math.abs(le) > 1e-15) && S.push(G);
    });
    let A = S;
    if (S.length > x) {
      const M = S.map(($) => f[$][0]), G = S.map(($) => f[$][1]), le = Math.min(...M), ce = Math.max(...M), ae = Math.min(...G), V = Math.max(...G), ie = S.map(($) => f[$][2]), j = Math.max(1e-6, (Math.max(...ie) - Math.min(...ie)) / 40), be = ($) => Math.round($ / j), ye = new Set(ie.map(be)), U = Math.max(4, Math.floor(x / Math.max(1, ye.size))), X = Math.max(2, Math.round(Math.sqrt(U))), K = /* @__PURE__ */ new Map();
      for (const $ of S) {
        const T = ce - le < 1e-9 ? 0 : (f[$][0] - le) / (ce - le), Z = V - ae < 1e-9 ? 0 : (f[$][1] - ae) / (V - ae), N = Math.min(X - 1, Math.floor(T * X)), L = Math.min(X - 1, Math.floor(Z * X)), ne = `${N},${L},${be(f[$][2])}`, ue = Math.hypot(T * X - (N + 0.5), Z * X - (L + 0.5)), re = K.get(ne);
        (!re || ue < re.d) && K.set(ne, { i: $, d: ue });
      }
      A = [...K.values()].map(($) => $.i);
    }
    for (const M of A) {
      const G = e.nodeInputs.val.loads.get(M), le = f[M];
      if (!le) continue;
      const ce = new b(...G.slice(0, 3));
      if (ce.lengthSq() < 1e-30) continue;
      ce.normalize();
      const ae = new an(ce, new b(...le), 1, 15637248, 0.3, 0.3), V = g * h.rawVal;
      ae.scale.set(V, V, V), c.add(ae);
    }
  }), H.derive(() => {
    if (h.val, !l.loads.rawVal) return;
    const g = w(p.rawVal) * h.rawVal;
    c.children.forEach((x) => x.scale.set(g, g, g));
  }), H.derive(() => {
    c.visible = l.loads.val;
  }), c;
}
function ia(e, l, p) {
  const h = new je();
  return H.derive(() => {
    if (!e.nodesIndexes.val) return;
    h.children.forEach((w) => w.dispose()), h.clear();
    const c = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((w, f) => {
      const g = new St(`${f}`);
      g.position.set(...w), g.updateScale(c * p.rawVal), h.add(g);
    });
  }), H.derive(() => {
    if (p.val, !e.nodesIndexes.rawVal) return;
    const c = 0.05 * e.gridSize.val * 0.6;
    h.children.forEach((w) => w.updateScale(c * p.rawVal));
  }), H.derive(() => {
    h.visible = e.nodesIndexes.val;
  }), h;
}
function la(e, l, p, h) {
  const c = new je();
  return H.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    c.children.forEach((f) => f.dispose()), c.clear();
    const w = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((f, g) => {
      const x = new St(`${g}`, void 0, "#001219");
      x.position.set(...ra(f.map((S) => p.rawVal[S]))), x.updateScale(w * h.rawVal), c.add(x);
    });
  }), H.derive(() => {
    if (h.val, !l.elementsIndexes.rawVal) return;
    const w = 0.05 * l.gridSize.val * 0.6;
    c.children.forEach((f) => f.updateScale(w * h.rawVal));
  }), H.derive(() => {
    c.visible = l.elementsIndexes.val;
  }), c;
}
function ra(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function ns(e, l) {
  const p = new je(), h = Math.min(0.05 * e, 0.6), c = ln(), w = new St("X", "red", "transparent"), f = new St(l ? "Z" : "Y", "green", "transparent"), g = new St(l ? "Y" : "Z", "blue", "transparent"), x = new an(new b(1, 0, 0), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), S = new an(new b(0, 1, 0), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2), A = new an(new b(0, 0, 1), new b(0, 0, 0), 1, c.axisArrow, 0.2, 0.2);
  return w.position.set(1.3 * h, 0, 0), f.position.set(0, 1.3 * h, 0), g.position.set(0, 0, 1.3 * h), w.updateScale(0.4 * h), f.updateScale(0.4 * h), g.updateScale(0.4 * h), x.scale.set(h, h, h), S.scale.set(h, h, h), A.scale.set(h, h, h), p.add(x, S, A, w, f, g), p;
}
function Wn(e, l) {
  const p = new b(...e), c = new b(...l).clone().sub(p), w = c.length(), f = c.dot(new b(1, 0, 0)) / w, g = c.dot(new b(0, 1, 0)) / w, x = c.dot(new b(0, 0, 1)) / w, S = Math.sqrt(f ** 2 + g ** 2);
  let A = new mo().fromArray([[f, g, x], [-g / S, f / S, 0], [-f * x / S, -g * x / S, S]].flat());
  return x === 1 && (A = new mo().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), x === -1 && (A = new mo().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new _o().setFromMatrix3(A);
}
function Mo(e, l) {
  return e == null ? void 0 : e.map((p, h) => (9 * p + l[h]) / 10);
}
function zn(e) {
  const l = e.reduce((h, c) => [h[0] + c[0], h[1] + c[1], h[2] + c[2]], [0, 0, 0]), p = e.length;
  return [l[0] / p, l[1] / p, l[2] / p];
}
function ca(e, l, p) {
  const h = zn([l, p]), c = zn([e, p]), w = zn([e, l]), f = new b(...h).sub(new b(...c)).normalize(), g = new b(...p).sub(new b(...w)).normalize(), x = f.clone().cross(g).normalize(), S = x.clone().cross(f).normalize();
  return new _o().makeBasis(f, S, x);
}
function da(e, l, p, h) {
  const c = new je(), w = new Me(), f = new ct({ vertexColors: true }), g = [0, 0, 0], x = [1, 0, 0], S = [0, 1, 0], A = [0, 0, 1];
  w.setAttribute("position", new vt([...g, ...x, ...g, ...S, ...g, ...A], 3));
  const M = [255, 0, 0], G = [0, 255, 0], le = [0, 0, 255];
  return w.setAttribute("color", new vt([...M, ...M, ...G, ...G, ...le, ...le], 3)), H.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (c.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((ce) => {
      const ae = new Kt(w, f), V = p.rawVal[ce[0]], ie = p.rawVal[ce[1]];
      if (ce.length === 2 && (ae.position.set(...Mo(V, ie)), ae.rotation.setFromRotationMatrix(Wn(V, ie))), ce.length === 3) {
        const ye = p.rawVal[ce[2]];
        ae.position.set(...zn([V, ie, ye])), ae.rotation.setFromRotationMatrix(ca(V, ie, ye));
      }
      const be = 0.05 * l.gridSize.rawVal * 0.75 * h.rawVal;
      ae.scale.set(be, be, be), c.add(ae);
    }));
  }), H.derive(() => {
    if (h.val, !l.orientations.rawVal) return;
    const ae = 0.05 * l.gridSize.val * 0.75 * h.rawVal;
    c.children.forEach((V) => V.scale.set(ae, ae, ae));
  }), H.derive(() => {
    c.visible = l.orientations.val;
  }), c;
}
function pa(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), p = (e.h * 100).toFixed(0);
    return `${l}x${p}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ua(e, l, p, h) {
  const c = new je(), w = new je();
  c.add(w);
  function f(X, K) {
    const $ = X / 2, T = K / 2, Z = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, -T, 0, $, T, 0, -$, T]), N = new Me();
    N.setAttribute("position", new pt(Z, 3));
    const L = new Float32Array([0, -$, -T, 0, $, -T, 0, $, T, 0, -$, T, 0, -$, -T]), ne = new Me();
    return ne.setAttribute("position", new pt(L, 3)), { fill: N, outline: ne };
  }
  function g(X, K = 24) {
    const $ = X / 2, T = new Float32Array(K * 9);
    for (let ne = 0; ne < K; ne++) {
      const ue = ne / K * Math.PI * 2, re = (ne + 1) / K * Math.PI * 2;
      T[ne * 9] = 0, T[ne * 9 + 1] = 0, T[ne * 9 + 2] = 0, T[ne * 9 + 3] = 0, T[ne * 9 + 4] = $ * Math.cos(ue), T[ne * 9 + 5] = $ * Math.sin(ue), T[ne * 9 + 6] = 0, T[ne * 9 + 7] = $ * Math.cos(re), T[ne * 9 + 8] = $ * Math.sin(re);
    }
    const Z = new Me();
    Z.setAttribute("position", new pt(T, 3));
    const N = new Float32Array((K + 1) * 3);
    for (let ne = 0; ne <= K; ne++) {
      const ue = ne / K * Math.PI * 2;
      N[ne * 3] = 0, N[ne * 3 + 1] = $ * Math.cos(ue), N[ne * 3 + 2] = $ * Math.sin(ue);
    }
    const L = new Me();
    return L.setAttribute("position", new pt(N, 3)), { fill: Z, outline: L };
  }
  function x(X, K, $, T) {
    const Z = $ ?? K * 0.08, N = T ?? X * 0.07, L = X / 2, ne = K / 2, ue = ne - Z, re = N / 2, se = [];
    function B(he, $e, _e, De) {
      se.push(0, he, $e, 0, _e, $e, 0, _e, De, 0, he, $e, 0, _e, De, 0, he, De);
    }
    B(-L, -ne, L, -ue), B(-re, -ue, re, ue), B(-L, ue, L, ne);
    const pe = new Me();
    pe.setAttribute("position", new pt(new Float32Array(se), 3));
    const W = new Float32Array([0, -L, -ne, 0, L, -ne, 0, L, -ue, 0, re, -ue, 0, re, ue, 0, L, ue, 0, L, ne, 0, -L, ne, 0, -L, ue, 0, -re, ue, 0, -re, -ue, 0, -L, -ue, 0, -L, -ne]), fe = new Me();
    return fe.setAttribute("position", new pt(W, 3)), { fill: pe, outline: fe };
  }
  function S(X, K, $) {
    const T = X / 2, Z = K / 2, N = T - $, L = Z - $, ne = [];
    function ue(pe, W, fe, he) {
      ne.push(0, pe, W, 0, fe, W, 0, fe, he, 0, pe, W, 0, fe, he, 0, pe, he);
    }
    ue(-T, -Z, T, -L), ue(-T, L, T, Z), ue(-T, -L, -N, L), ue(N, -L, T, L);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(ne), 3));
    const se = new Float32Array([0, -T, -Z, 0, T, -Z, 0, T, -Z, 0, T, Z, 0, T, Z, 0, -T, Z, 0, -T, Z, 0, -T, -Z, 0, -N, -L, 0, N, -L, 0, N, -L, 0, N, L, 0, N, L, 0, -N, L, 0, -N, L, 0, -N, -L]), B = new Me();
    return B.setAttribute("position", new pt(se, 3)), { fill: re, outline: B };
  }
  function A(X, K, $) {
    const T = X / 2, Z = K / 2, N = T - $, L = Z - $, ne = new Me(), ue = new Float32Array([0, -N, -L, 0, N, -L, 0, N, L, 0, -N, -L, 0, N, L, 0, -N, L]);
    ne.setAttribute("position", new pt(ue, 3));
    const re = [];
    function se(fe, he, $e, _e) {
      re.push(0, fe, he, 0, $e, he, 0, $e, _e, 0, fe, he, 0, $e, _e, 0, fe, _e);
    }
    se(-T, -Z, T, -L), se(-T, L, T, Z), se(-T, -L, -N, L), se(N, -L, T, L);
    const B = new Me();
    B.setAttribute("position", new pt(new Float32Array(re), 3));
    const pe = new Float32Array([0, -T, -Z, 0, T, -Z, 0, T, -Z, 0, T, Z, 0, T, Z, 0, -T, Z, 0, -T, Z, 0, -T, -Z, 0, -N, -L, 0, N, -L, 0, N, -L, 0, N, L, 0, N, L, 0, -N, L, 0, -N, L, 0, -N, -L]), W = new Me();
    return W.setAttribute("position", new pt(pe, 3)), { concFill: ne, steelFillGeom: B, outline: W };
  }
  function M(X, K, $) {
    const T = [], Z = [[0, -X / 2, -K / 2], [0, -X / 2 + $, -K / 2], [0, -X / 2 + $, K / 2 - $], [0, X / 2, K / 2 - $], [0, X / 2, K / 2], [0, -X / 2, K / 2]], N = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const re of N) T.push(...Z[re]);
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(T), 3));
    const ne = [];
    for (let re = 0; re < Z.length; re++) {
      const se = (re + 1) % Z.length;
      ne.push(...Z[re], ...Z[se]);
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(ne), 3)), { fill: L, outline: ue };
  }
  function G(X, K, $, T) {
    const Z = T / 2, N = [], L = [[0, -X - Z, -K / 2], [0, -$ - Z, -K / 2], [0, -$ - Z, K / 2 - $], [0, -Z, K / 2 - $], [0, -Z, K / 2], [0, -X - Z, K / 2]], ne = [[0, Z, -K / 2], [0, Z + $, -K / 2], [0, Z + $, K / 2 - $], [0, X + Z, K / 2 - $], [0, X + Z, K / 2], [0, Z, K / 2]], ue = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of ue) N.push(...L[pe]);
    for (const pe of ue) N.push(...ne[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(N), 3));
    const se = [];
    for (const pe of [L, ne]) for (let W = 0; W < pe.length; W++) {
      const fe = (W + 1) % pe.length;
      se.push(...pe[W], ...pe[fe]);
    }
    const B = new Me();
    return B.setAttribute("position", new pt(new Float32Array(se), 3)), { fill: re, outline: B };
  }
  function le(X, K, $, T) {
    const Z = K / 2, N = X, L = [[0, -N, -Z], [0, -N, -Z + $], [0, -T, -Z + $], [0, -T, Z - $], [0, -N, Z - $], [0, -N, Z], [0, 0, Z], [0, 0, -Z]], ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ue = [];
    for (const pe of ne) ue.push(...L[pe]);
    const re = new Me();
    re.setAttribute("position", new pt(new Float32Array(ue), 3));
    const se = [];
    for (let pe = 0; pe < L.length; pe++) {
      const W = (pe + 1) % L.length;
      se.push(...L[pe], ...L[W]);
    }
    const B = new Me();
    return B.setAttribute("position", new pt(new Float32Array(se), 3)), { fill: re, outline: B };
  }
  function ce(X, K, $, T, Z) {
    const N = K / 2, L = Z / 2, ne = [], ue = [[0, -X, -N], [0, -X, -N + $], [0, -L - T, -N + $], [0, -L - T, N - $], [0, -X, N - $], [0, -X, N], [0, -L, N], [0, -L, -N]], re = ue.map((fe) => [fe[0], -fe[1], fe[2]]), se = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const fe of se) ne.push(...ue[fe]);
    for (const fe of se) ne.push(...re[fe]);
    const B = new Me();
    B.setAttribute("position", new pt(new Float32Array(ne), 3));
    const pe = [];
    for (const fe of [ue, re]) for (let he = 0; he < fe.length; he++) {
      const $e = (he + 1) % fe.length;
      pe.push(...fe[he], ...fe[$e]);
    }
    const W = new Me();
    return W.setAttribute("position", new pt(new Float32Array(pe), 3)), { fill: B, outline: W };
  }
  function ae(X, K, $, T) {
    const Z = X / 2, N = K / 2, L = T / 2, ne = [[0, -L, -N], [0, L, -N], [0, L, N - $], [0, Z, N - $], [0, Z, N], [0, -Z, N], [0, -Z, N - $], [0, -L, N - $]], ue = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], re = [];
    for (const W of ue) re.push(...ne[W]);
    const se = new Me();
    se.setAttribute("position", new pt(new Float32Array(re), 3));
    const B = [];
    for (let W = 0; W < ne.length; W++) {
      const fe = (W + 1) % ne.length;
      B.push(...ne[W], ...ne[fe]);
    }
    const pe = new Me();
    return pe.setAttribute("position", new pt(new Float32Array(B), 3)), { fill: se, outline: pe };
  }
  function V(X, K, $ = 24) {
    const T = X / 2, Z = T - K, N = [];
    for (let re = 0; re < $; re++) {
      const se = re / $ * Math.PI * 2, B = (re + 1) / $ * Math.PI * 2, pe = Math.cos(se), W = Math.sin(se), fe = Math.cos(B), he = Math.sin(B);
      N.push(0, T * pe, T * W, 0, T * fe, T * he, 0, Z * fe, Z * he), N.push(0, T * pe, T * W, 0, Z * fe, Z * he, 0, Z * pe, Z * W);
    }
    const L = new Me();
    L.setAttribute("position", new pt(new Float32Array(N), 3));
    const ne = [];
    for (let re = 0; re < $; re++) {
      const se = re / $ * Math.PI * 2, B = (re + 1) / $ * Math.PI * 2;
      ne.push(0, T * Math.cos(se), T * Math.sin(se), 0, T * Math.cos(B), T * Math.sin(B)), ne.push(0, Z * Math.cos(se), Z * Math.sin(se), 0, Z * Math.cos(B), Z * Math.sin(B));
    }
    const ue = new Me();
    return ue.setAttribute("position", new pt(new Float32Array(ne), 3)), { fill: L, outline: ue };
  }
  const ie = new it({ color: 52479, transparent: true, opacity: 0.35, side: kt, depthWrite: false }), j = new ct({ color: 52479 }), be = new it({ color: 16750848, transparent: true, opacity: 0.4, side: kt, depthWrite: false }), ye = new ct({ color: 16750848 });
  function U(X, K) {
    const $ = Math.abs(K[0] - X[0]), T = Math.abs(K[1] - X[1]), Z = Math.abs(K[2] - X[2]);
    return Z > $ && Z > T || T > $ && T > Z;
  }
  return H.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const X = l.secColumns.rawVal, K = l.secBeams.rawVal;
    if (!X && !K) {
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
    const Z = T.sectionShapes, N = l.secFloor.rawVal;
    $.forEach((L, ne) => {
      if (L.length !== 2) return;
      const ue = p.rawVal[L[0]], re = p.rawVal[L[1]];
      if (!ue || !re) return;
      const se = U(ue, re);
      if (se && !X || !se && !K) return;
      if (N >= 0) {
        const he = Math.min(ue[1], re[1]);
        Math.max(ue[1], re[1]);
        const $e = l.gridSize.rawVal || 3;
        if (Math.floor(he / $e + 0.01) !== N) return;
      }
      const B = Z == null ? void 0 : Z.get(ne);
      if (!B) return;
      const pe = [(ue[0] + re[0]) / 2, (ue[1] + re[1]) / 2, (ue[2] + re[2]) / 2], W = Wn(ue, re);
      if (B.type === "CFT") {
        const he = A(B.b, B.h, B.tw ?? B.b * 0.05), $e = new et(he.concFill, ie);
        $e.position.set(...pe), $e.rotation.setFromRotationMatrix(W), c.add($e);
        const _e = new et(he.steelFillGeom, be);
        _e.position.set(...pe), _e.rotation.setFromRotationMatrix(W), c.add(_e);
        const De = new _t(he.outline, ye);
        De.position.set(...pe), De.rotation.setFromRotationMatrix(W), c.add(De);
      } else {
        let he, $e, _e;
        switch (B.type) {
          case "rect":
            he = f(B.b, B.h), $e = ie, _e = j;
            break;
          case "circ":
            he = g(B.d), $e = ie, _e = j;
            break;
          case "I":
            he = x(B.b, B.h, B.tf, B.tw), $e = be, _e = ye;
            break;
          case "HSS":
            he = S(B.b, B.h, B.tw ?? B.b * 0.05), $e = be, _e = ye;
            break;
          case "CFT":
            he = A(B.b, B.h, B.tw ?? B.b * 0.05), $e = be, _e = ye;
            break;
          case "L":
            he = M(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3), $e = be, _e = ye;
            break;
          case "2L":
            he = G(B.b ?? B.h, B.h, B.t ?? B.tw ?? 3e-3, B.dis ?? 0.01), $e = be, _e = ye;
            break;
          case "C":
          case "coldC":
            he = le(B.b, B.h, B.tf ?? B.t ?? 3e-3, B.tw ?? B.t ?? 3e-3), $e = be, _e = ye;
            break;
          case "2C":
            he = ce(B.b, B.h, B.tf ?? 5e-3, B.tw ?? 5e-3, B.dis ?? 0.01), $e = be, _e = ye;
            break;
          case "T":
            he = ae(B.b, B.h, B.tf ?? 0.01, B.tw ?? 6e-3), $e = be, _e = ye;
            break;
          case "pipe":
            he = V(B.d, B.tw ?? B.d * 0.05), $e = be, _e = ye;
            break;
          default:
            return;
        }
        const De = new et(he.fill, $e);
        De.position.set(...pe), De.rotation.setFromRotationMatrix(W), c.add(De);
        const Oe = new _t(he.outline, _e);
        Oe.position.set(...pe), Oe.rotation.setFromRotationMatrix(W), c.add(Oe);
      }
      const fe = pa(B);
      if (fe) {
        const $e = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(B.type) ? "#ff9900" : "#00ccff", _e = new St(fe, $e, "transparent");
        _e.position.set(pe[0], pe[1], pe[2]);
        const De = 0.05 * l.gridSize.rawVal * 0.5;
        _e.updateScale(De * ((h == null ? void 0 : h.rawVal) ?? 1)), w.add(_e);
      }
    });
  }), h && H.derive(() => {
    if (h.val, !l.sections.rawVal) return;
    const X = 0.05 * l.gridSize.val * 0.5;
    w.children.forEach((K) => {
      K instanceof St && K.updateScale(X * h.rawVal);
    });
  }), H.derive(() => {
    c.visible = l.sections.val;
  }), H.derive(() => {
    w.visible = l.sectionLabels.val;
  }), c;
}
function fa(e) {
  if (!e) return null;
  const l = e.type, p = (A, M) => [A, M], h = (A, M) => [p(-A / 2, -M / 2), p(A / 2, -M / 2), p(A / 2, M / 2), p(-A / 2, M / 2)], c = (A, M = 24) => {
    const G = A / 2, le = [];
    for (let ce = 0; ce < M; ce++) {
      const ae = 2 * Math.PI * ce / M;
      le.push(p(G * Math.cos(ae), G * Math.sin(ae)));
    }
    return le;
  }, w = e.b ?? 0, f = e.h ?? 0, g = e.d ?? 0, x = e.tw ?? e.t ?? 0, S = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return w && f ? { contorno: h(w, f) } : null;
    case "circ":
      return g ? { contorno: c(g) } : null;
    case "pipe":
      return g && x ? { contorno: c(g), huecos: [c(g - 2 * x).reverse()] } : null;
    case "HSS":
      return w && f && x ? { contorno: h(w, f), huecos: [h(w - 2 * x, f - 2 * (S || x)).reverse()] } : null;
    case "CFT":
      return w && f ? { contorno: h(w, f) } : null;
    case "I":
      return w && f && x && S ? { contorno: [p(-w / 2, -f / 2), p(w / 2, -f / 2), p(w / 2, -f / 2 + S), p(x / 2, -f / 2 + S), p(x / 2, f / 2 - S), p(w / 2, f / 2 - S), p(w / 2, f / 2), p(-w / 2, f / 2), p(-w / 2, f / 2 - S), p(-x / 2, f / 2 - S), p(-x / 2, -f / 2 + S), p(-w / 2, -f / 2 + S)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return w && f && x && S ? { contorno: [p(-w / 2, -f / 2), p(w / 2, -f / 2), p(w / 2, -f / 2 + S), p(-w / 2 + x, -f / 2 + S), p(-w / 2 + x, f / 2 - S), p(w / 2, f / 2 - S), p(w / 2, f / 2), p(-w / 2, f / 2)] } : null;
    case "T":
      return w && f && x && S ? { contorno: [p(-x / 2, -f / 2), p(x / 2, -f / 2), p(x / 2, f / 2 - S), p(w / 2, f / 2 - S), p(w / 2, f / 2), p(-w / 2, f / 2), p(-w / 2, f / 2 - S), p(-x / 2, f / 2 - S)] } : null;
    case "L":
    case "2L":
      return w && f && x ? { contorno: [p(-w / 2, -f / 2), p(w / 2, -f / 2), p(w / 2, -f / 2 + x), p(-w / 2 + x, -f / 2 + x), p(-w / 2 + x, f / 2), p(-w / 2, f / 2)] } : null;
    default:
      return w && f ? { contorno: h(w, f) } : g ? { contorno: c(g) } : null;
  }
}
function ha(e, l, p) {
  if (!e || e <= 0 || !l || !p || l <= 0 || p <= 0) return null;
  const h = Math.sqrt(Math.sqrt(p / l)), c = Math.sqrt(e / h), w = e / c;
  return !isFinite(c) || !isFinite(w) || c <= 0 || w <= 0 ? null : { contorno: [[-c / 2, -w / 2], [c / 2, -w / 2], [c / 2, w / 2], [-c / 2, w / 2]] };
}
function ma(e) {
  const l = new Cn();
  e.contorno.forEach(([p, h], c) => c ? l.lineTo(p, h) : l.moveTo(p, h)), l.closePath();
  for (const p of e.huecos ?? []) {
    const h = new Us();
    p.forEach(([c, w], f) => f ? h.lineTo(c, w) : h.moveTo(c, w)), h.closePath(), l.holes.push(h);
  }
  return l;
}
function wa(e, l, p) {
  const h = new je();
  h.name = "extrusion";
  const c = new wo({ color: 8369151, transparent: true, opacity: 0.92, side: kt }), w = new wo({ color: 12623968, transparent: true, opacity: 0.85, side: kt }), f = new wo({ color: 11583173, transparent: true, opacity: 0.85, side: kt }), g = new je();
  g.add(new ds(16777215, 0.55));
  const x = new Gn(16777215, 0.75);
  x.position.set(30, 25, 40);
  const S = new Gn(16777215, 0.35);
  S.position.set(-25, -20, 15), g.add(x, S);
  let A = 0;
  return H.derive(() => {
    var _a2, _b, _c, _d, _e;
    const M = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++A, on: M }, h.visible = M;
    for (const j of [...h.children]) j !== g && (h.remove(j), (_c = (_b = j.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (h.children.includes(g) || h.add(g), !M) return;
    const G = p.val ?? [], le = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], ce = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, ae = ce.sectionShapes ?? /* @__PURE__ */ new Map(), V = ce.thicknesses ?? /* @__PURE__ */ new Map();
    let ie = "";
    try {
      le.forEach((j, be) => {
        var _a3, _b2, _c2;
        if (j.length === 2) {
          let ye = fa(ae.get(be)), U = true;
          if (ye || (ye = ha((_a3 = ce.areas) == null ? void 0 : _a3.get(be), (_b2 = ce.momentsOfInertiaY) == null ? void 0 : _b2.get(be), (_c2 = ce.momentsOfInertiaZ) == null ? void 0 : _c2.get(be)), U = false), !ye) return;
          const X = G[j[0]], K = G[j[1]];
          if (!X || !K) return;
          const $ = Math.hypot(K[0] - X[0], K[1] - X[1], K[2] - X[2]);
          if ($ < 1e-9) return;
          const T = new Ys(ma(ye), { depth: $, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new _o().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const Z = new et(T, U ? c : w);
          Z.position.set(X[0], X[1], X[2]), Z.rotation.setFromRotationMatrix(Wn(X, K)), h.add(Z);
          return;
        }
        if (j.length === 3 || j.length === 4) {
          const ye = V.get(be);
          if (!ye || ye <= 0) return;
          const U = j.map((W) => G[W]).filter(Boolean);
          if (U.length < 3) return;
          const X = [U[1][0] - U[0][0], U[1][1] - U[0][1], U[1][2] - U[0][2]], K = [U[2][0] - U[0][0], U[2][1] - U[0][1], U[2][2] - U[0][2]], $ = X[1] * K[2] - X[2] * K[1], T = X[2] * K[0] - X[0] * K[2], Z = X[0] * K[1] - X[1] * K[0], N = Math.hypot($, T, Z);
          if (N < 1e-12) return;
          const L = [$ / N, T / N, Z / N], ne = [], ue = (W) => U.map((fe) => [fe[0] + L[0] * W, fe[1] + L[1] * W, fe[2] + L[2] * W]), re = ue(+ye / 2), se = ue(-ye / 2), B = (W, fe, he) => ne.push(...W, ...fe, ...he);
          for (const W of [re, se]) B(W[0], W[1], W[2]), W.length === 4 && B(W[0], W[2], W[3]);
          for (let W = 0; W < U.length; W++) {
            const fe = (W + 1) % U.length;
            B(re[W], se[W], se[fe]), B(re[W], se[fe], re[fe]);
          }
          const pe = new Me();
          pe.setAttribute("position", new vt(ne, 3)), pe.computeVertexNormals(), h.add(new et(pe, f));
        }
      });
    } catch (j) {
      ie = String((j == null ? void 0 : j.message) ?? j);
    }
    globalThis.__extrusionDebug = { corridas: A, on: M, fallo: ie, nElementos: le.length, nFormas: ae.size, nEspesores: V.size, mallas: h.children.length - 1 };
  }), h;
}
class Yn extends je {
  constructor(l, p, h, c, w, f, g) {
    super();
    const x = new Cn().moveTo(0, 0).lineTo(0, f[1]).lineTo(h, f[1]).lineTo(h, 0).lineTo(0, 0), S = x.getPoints(), A = new Me().setFromPoints(S);
    this.lines = new _t(A, new ct({ color: ln().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const M = new Kn(x), G = new it({ color: f[1] > 0 ? 24435 : 11411474, side: kt });
    this.mesh = new et(M, G), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new St(`${w[1].toFixed(4)}`), this.normalizedResult = f, this.textPosition = zn([l, p]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(c), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class os extends je {
  constructor(l, p, h, c, w, f, g) {
    super();
    const x = w[0] * h / (w[0] + w[1]), S = w[0] * w[1] > 0;
    if (this.text = new St(`${w[0].toFixed(4)}`), this.text2 = new St(`${(w[1] * -1).toFixed(4)}`), this.normalizedResult = f, this.textPosition = Mo(l, p), this.text2Position = Mo(p, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(c), this.text2.rotation.setFromRotationMatrix(c), this.add(this.text, this.text2), S) {
      const A = new Cn().moveTo(0, 0).lineTo(0, f[0]).lineTo(x, 0).lineTo(0, 0), M = new Cn().moveTo(x, 0).lineTo(h, -f[1]).lineTo(h, 0).lineTo(x, 0), G = A.getPoints(), le = M.getPoints(), ce = new Me().setFromPoints(G), ae = new Me().setFromPoints(le), V = new ct({ color: ln().resultOutline });
      this.lines = new _t(ce, V), this.lines2 = new _t(ae, V), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), this.lines2.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), g && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const ie = new Kn(A), j = new Kn(M), be = new it({ color: f[0] > 0 ? 24435 : 11411474, side: kt }), ye = new it({ color: -f[1] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(ie, be), this.mesh2 = new et(j, ye), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), this.mesh2.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), g && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const A = new Cn().moveTo(0, 0).lineTo(0, f[0]).lineTo(h, -f[1]).lineTo(h, 0).lineTo(0, 0), M = A.getPoints(), G = new Me().setFromPoints(M);
      this.lines = new _t(G, new ct({ color: ln().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(c), g && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const le = new Kn(A), ce = new it({ color: f[0] > 0 ? 24435 : 11411474, side: kt });
      this.mesh = new et(le, ce), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(c), g && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var ws = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(ws || {});
function ya(e, l, p, h) {
  const c = () => {
    const g = p.rawVal;
    if (!(g == null ? void 0 : g.length)) return 0.05 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], S = [-1 / 0, -1 / 0, -1 / 0];
    for (const M of g) for (let G = 0; G < 3; G++) M[G] < x[G] && (x[G] = M[G]), M[G] > S[G] && (S[G] = M[G]);
    const A = Math.hypot(S[0] - x[0], S[1] - x[1], S[2] - x[2]);
    return !isFinite(A) || A <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * A;
  }, w = new je(), f = { normals: Yn, shearsY: Yn, shearsZ: Yn, torsions: Yn, bendingsY: os, bendingsZ: os };
  return H.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, p.val, l.frameResults.val == "none") return;
    w.children.forEach((x) => x.dispose()), w.clear();
    const g = ws[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[g]) == null ? void 0 : _b.forEach((x, S) => {
      var _a3, _b2;
      const A = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[S]) ?? [0, 1], M = p.rawVal[A[0]], G = p.rawVal[A[1]];
      if (!M || !G) return;
      const le = new b(...G).distanceTo(new b(...M)), ce = xa((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[g]), ae = x == null ? void 0 : x.map((j) => j / (ce === 0 ? 1 : ce)), V = Wn(M, G), ie = new f[g](M, G, le, V, x ?? [0, 0], ae ?? [0, 0], !!["normals", "shearsZ", "torsions", "bendingsY"].includes(g));
      ie.updateScale(c() * h.rawVal), w.add(ie);
    });
  }), H.derive(() => {
    if (h.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const g = c();
    w.children.forEach((x) => x.updateScale(g * h.rawVal));
  }), H.derive(() => {
    w.visible = l.frameResults.val != "none";
  }), w;
}
function xa(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((p) => {
    const h = Math.max(...(p ?? [0, 0]).map((c) => Math.abs(c)));
    h > l && (l = h);
  }), l;
}
class ga extends je {
  constructor(l, p, h) {
    super();
    const c = p === ko.reactions;
    h[0] && (this.xText1 = new St(`${c ? "Fx" : "Dx"}: ` + h[0].toFixed(4))), h[3] && (this.xText2 = new St(`${c ? "Mx" : "Rx"}: ` + h[3].toFixed(4))), h[1] && (this.yText1 = new St(`${c ? "Fy" : "Dy"}: ` + h[1].toFixed(4))), h[4] && (this.yText2 = new St(`${c ? "My" : "Ry"}: ` + h[4].toFixed(4))), h[2] && (this.zText1 = new St(`${c ? "Fz" : "Dz"}: ` + h[2].toFixed(4))), h[5] && (this.zText2 = new St(`${c ? "Mz" : "Rz"}: ` + h[5].toFixed(4))), (h[0] || h[3]) && (this.xArrow = new an(new b(1, 0, 0), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[1] || h[4]) && (this.yArrow = new an(new b(0, 1, 0), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), (h[2] || h[5]) && (this.zArrow = new an(new b(0, 0, 1), new b(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
var ko = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(ko || {});
function va(e, l, p, h) {
  const c = new je();
  return H.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    c.children.forEach((g) => g.dispose()), c.clear();
    const w = ko[l.nodeResults.rawVal], f = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[w]) == null ? void 0 : _b.forEach((g, x) => {
      const S = new ga(p.rawVal[x], w, g ?? [0, 0, 0, 0, 0, 0]);
      S.updateScale(f * h.rawVal), c.add(S);
    });
  }), H.derive(() => {
    if (h.val, l.nodeResults.rawVal == "none") return;
    const w = 0.05 * l.gridSize.val;
    c.children.forEach((f) => f.updateScale(w * h.rawVal));
  }), H.derive(() => {
    c.visible = l.nodeResults.val != "none";
  }), c;
}
function Ma({ drawingObj: e, gridObj: l, scene: p, getActiveCamera: h, controls: c, gridSize: w, derivedDisplayScale: f, rendererElm: g, viewerRender: x }) {
  const S = new Zs(), A = new qs(), M = (t) => {
    const o = g.getBoundingClientRect(), a = t.clientX - o.left, n = t.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const d = s / 2;
      if (a >= d) return A.x = (a - d) / d * 2 - 1, A.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? h();
      A.x = a / d * 2 - 1;
    } else A.x = a / s * 2 - 1;
    return A.y = -(n / i) * 2 + 1, h();
  }, G = new et(new tn(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
  G.visible = true, G.frustumCulled = false, p.add(G);
  const le = (t, o, a) => {
    const n = new et(new tn(1e4, 1e4), new it({ side: kt, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, a), n.visible = false, n.frustumCulled = false, p.add(n), n;
  }, ce = le(Math.PI / 2, 0, 0), ae = le(0, Math.PI / 2, 0);
  let V = false;
  const ie = () => {
    if (V) return S.intersectObjects([G], false);
    if (ce.visible = !!window.__hekatanGridPlaneXZ, ae.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && ze.visible) {
      const a = S.intersectObjects([ze, Ne, Le], false);
      if (a.length > 0) return a;
    }
    const o = [G];
    return ce.visible && o.push(ce), ae.visible && o.push(ae), qt.visible && Wt.length > 0 && o.push(...Wt), S.intersectObjects(o, false);
  }, j = new Zn(new Me(), new qn()), be = new Zn(new Me(), new qn({ color: "gray", sizeAttenuation: false, size: 6 })), ye = new Zn(new Me(), new qn({ color: "orange", sizeAttenuation: false, size: 5 }));
  p.add(ye);
  const U = document.createElement("input");
  U.id = "hk-rubber-label", U.type = "text", U.spellcheck = false, U.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, U.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(U);
  let X = null, K = null, $ = false;
  const T = new b(), Z = (t, o, a, n, s, i) => {
    const r = n - t, d = s - o, v = i - a, m = Math.hypot(r, d, v);
    if (m < 0.01) {
      U.style.display = "none";
      return;
    }
    X = [t, o, a], K = [r / m, d / m, v / m], T.set((t + n) / 2, (o + s) / 2, (a + i) / 2), T.project(h());
    const _ = g.getBoundingClientRect(), F = _.left + (T.x * 0.5 + 0.5) * _.width, u = _.top + (-T.y * 0.5 + 0.5) * _.height;
    if (U.style.left = F + "px", U.style.top = u + "px", U.style.display = "block", !$) {
      if (U.value = `${m.toFixed(2)} m`, document.activeElement !== U) {
        const E = document.activeElement;
        E && (E.tagName === "INPUT" || E.tagName === "TEXTAREA") && E !== U || U.focus({ preventScroll: true });
      }
      try {
        U.select();
      } catch {
      }
    }
  }, N = () => {
    U.style.display = "none", X = null, K = null, $ = false, document.activeElement === U && U.blur();
  }, L = (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      on = t, oe(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), U.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ve.length === 1) {
      const _ = Ve[0];
      Ve = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, _[0], _[1], _[2], t), oe(`\u2713 C\xEDrculo r=${t} m en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}).`);
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
      mt = t, oe(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), U.blur();
      return;
    }
    if (!X || !K || !e.polylines) return;
    let a = K[0], n = K[1], s = K[2];
    Ie === "x" ? (a = Math.sign(a) || 1, n = 0, s = 0) : Ie === "y" ? (a = 0, n = Math.sign(n) || 1, s = 0) : Ie === "z" && (a = 0, n = 0, s = Math.sign(s) || 1);
    const i = X[0] + a * t, r = X[1] + n * t, d = X[2] + s * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, d]];
    const v = e.polylines.rawVal, m = v.length ? v[v.length - 1] : [];
    e.polylines.val = [...v.slice(0, -1), [...m, e.points.rawVal.length - 1]], U.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    x();
  }, ne = (t) => {
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
      const s = o.split(",").map((v) => parseFloat(v.trim()));
      if (s.some(isNaN)) return null;
      const [i, r, d = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: r, dz: d } : { kind: "absCart", x: i, y: r, z: d };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, ue = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return X ? [X[0] + t.dx, X[1] + t.dy, X[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!X) return null;
      const o = t.ang * Math.PI / 180;
      return [X[0] + t.L * Math.cos(o), X[1] + t.L * Math.sin(o), X[2]];
    }
    if (t.kind === "relSpherical") {
      if (!X) return null;
      const o = t.az * Math.PI / 180, a = t.el * Math.PI / 180, n = t.L * Math.cos(a);
      return [X[0] + n * Math.cos(o), X[1] + n * Math.sin(o), X[2] + t.L * Math.sin(a)];
    }
    return null;
  }, re = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], X = t, U.blur();
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
    const o = ne(t);
    if (!o) return false;
    if (o.kind === "length") return L(o.L), true;
    const a = ue(o);
    if (!a) return false;
    Yo(new b(a[0], a[1], a[2]), null), X = a, U.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, U.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const a = ne(U.value);
      if (!a) return;
      if ($ = false, a.kind === "length") L(a.L), oe(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = ue(a);
        if (!n) return;
        re(n);
        const s = a.kind;
        oe(`\u270F ${s} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), $ = false, U.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!$ && U.style.display === "block") try {
          U.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && ($ = true);
  }), window.addEventListener("keydown", (t) => {
    if (!X || !K || document.activeElement === U) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (U.value = t.key, U.focus(), U.setSelectionRange(1, 1), t.preventDefault());
  });
  const se = document.createElement("div");
  se.id = "hk-coord-readout", se.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", se.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(se);
  const B = document.createElement("div");
  B.id = "hk-coord-fixed", B.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", B.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(B);
  const pe = new _t(new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), new kn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", p.add(pe), window.__hekatanRubberBand = pe;
  const W = new _t(new Me(), new ct({ color: 2282478, transparent: true, opacity: 0.9 }));
  W.frustumCulled = false, W.visible = false, p.add(W);
  let fe = [];
  const he = new je(), $e = new et(new tn(1, 1), new it({ color: 2282478, transparent: true, opacity: 0.08, side: kt, depthWrite: false })), _e = new Kt(new Wo(new tn(1, 1)), new ct({ color: 2282478, transparent: true, opacity: 0.85 })), De = new Kt(new Me(), new ct({ color: 2282478, transparent: true, opacity: 0.3 })), Oe = (t, o) => {
    const a = [], n = Math.ceil(t / o);
    for (let s = -n; s <= n; s++) {
      const i = s * o;
      a.push(-t, i, 0, t, i, 0), a.push(i, -t, 0, i, t, 0);
    }
    De.geometry.dispose(), De.geometry = new Me(), De.geometry.setAttribute("position", new vt(a, 3));
  };
  he.add($e, _e, De), he.visible = false, he.frustumCulled = false, p.add(he);
  const ut = new je();
  ut.frustumCulled = false, ut.visible = false, p.add(ut);
  const Ft = (t) => {
    const o = new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), a = new kn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new _t(o, a);
  }, k = Ft(16711680), I = Ft(65280), J = Ft(35071);
  ut.add(k, I, J);
  const Y = (t) => {
    const o = new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0), new b(0, 0, 0), new b(0, 0, 0)]), a = new ct({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new cs(o, a);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, de = Y(3462041), me = Y(16724804), xe = Y(6333946), ge = new je();
  ge.frustumCulled = false, ge.visible = false, p.add(ge), ge.add(de, me, xe);
  const Xe = (t) => {
    const o = new tn(1, 1), a = new it({ color: t, transparent: true, opacity: 0.06, side: kt, depthWrite: false }), n = new et(o, a);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, ze = Xe(3462041), Ne = Xe(16724804), Le = Xe(6333946);
  ge.add(ze, Ne, Le);
  const Ze = (t, o, a, n) => {
    t.scale.set(2 * n, 2 * n, 1), a === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : a === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, lt = document.createElement("div");
  lt.id = "hk-refplane-badge", lt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(lt), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, ge.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      ot(de, i, "xy", r), ot(me, i, "xz", r), ot(xe, i, "yz", r), Ze(ze, i, "xy", r), Ze(Ne, i, "xz", r), Ze(Le, i, "yz", r), ze.material.opacity = 0.05, Ne.material.opacity = 0.05, Le.material.opacity = 0.05;
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
    ot(de, i, "xy", t), ot(me, i, "xz", t), ot(xe, i, "yz", t), Ze(ze, i, "xy", t), Ze(Ne, i, "xz", t), Ze(Le, i, "yz", t), x();
  };
  const We = (t) => {
    if (ze.material.opacity = t === "xy" ? 0.09 : 0.025, Ne.material.opacity = t === "xz" ? 0.09 : 0.025, Le.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      lt.style.background = s.bg, lt.style.color = s.text, lt.textContent = `\u25A6 Plano ${t.toUpperCase()}`, lt.style.display = "block";
    } else lt.style.display = "none";
  }, ot = (t, o, a, n) => {
    let s;
    a === "xy" ? s = [new b(o[0] - n, o[1] - n, o[2]), new b(o[0] + n, o[1] - n, o[2]), new b(o[0] + n, o[1] + n, o[2]), new b(o[0] - n, o[1] + n, o[2]), new b(o[0] - n, o[1] - n, o[2])] : a === "xz" ? s = [new b(o[0] - n, o[1], o[2] - n), new b(o[0] + n, o[1], o[2] - n), new b(o[0] + n, o[1], o[2] + n), new b(o[0] - n, o[1], o[2] + n), new b(o[0] - n, o[1], o[2] - n)] : s = [new b(o[0], o[1] - n, o[2] - n), new b(o[0], o[1] + n, o[2] - n), new b(o[0], o[1] + n, o[2] + n), new b(o[0], o[1] - n, o[2] + n), new b(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(s);
  };
  let Ie = null;
  window.__hekatanAxisLock = () => Ie;
  let Ot = null;
  const qe = document.createElement("div");
  qe.id = "hk-axis-lock-badge", qe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(qe);
  const Ht = () => {
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
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== U) return;
    const a = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && fe.length >= 3) {
      const s = fn();
      oe(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Ie = Ie === a ? null : a, Ht(), t.preventDefault();
    else if (t.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Bo(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || In(), oe(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (ut.visible = false), oe(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
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
  const Dt = new b(), Ge = new b(), Ye = new b(), Fe = (t) => {
    if (!Ie) return null;
    const o = t[0], a = t[1], n = t[2];
    return Ie === "x" ? (Dt.set(o - 1e4, a, n), Ge.set(o + 1e4, a, n)) : Ie === "y" ? (Dt.set(o, a - 1e4, n), Ge.set(o, a + 1e4, n)) : (Dt.set(o, a, n - 1e4), Ge.set(o, a, n + 1e4)), S.ray.distanceSqToSegment(Dt, Ge, null, Ye), Ye;
  };
  window.__hekatanProjectOnAxis = Fe;
  const Ee = new _t(new Me().setFromPoints([new b(0, 0, 0), new b(0, 0, 0)]), new ct({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Ee.renderOrder = 998, Ee.frustumCulled = false, Ee.visible = false, p.add(Ee);
  let ve = -1, Je = -1, Qe = -1;
  const ke = /* @__PURE__ */ new Set();
  window.__hekatanSelection = ke;
  const Be = new _t(new Me().setFromPoints([new b(), new b()]), new ct({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Be.renderOrder = 997, Be.frustumCulled = false, Be.visible = false, p.add(Be);
  const Ue = new et(new gn(0.02, 12, 12), new it({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Ue.renderOrder = 998, Ue.visible = false, p.add(Ue);
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
  Ct.frustumCulled = false, p.add(Ct);
  const Yt = 2282478;
  let ht = null;
  const At = (t, o, a, n) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, r = n;
    for (let d = 0; d < s.length; d++) {
      const v = s[d];
      if (!v) continue;
      const m = Math.hypot(t - v[0], o - v[1], a - v[2]);
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
      const [d, ...v] = r.split(":");
      if (d === "pt") {
        const m = t[+v[0]];
        if (!m) continue;
        const _ = new et(new gn(0.025, 12, 12), new it({ color: Yt, transparent: true, opacity: 0.9, depthTest: false }));
        _.position.set(m[0], m[1], m[2]), _.renderOrder = 999, _.__isSelectionPt = true, Ct.add(_);
      } else if (d === "seg") {
        const m = o[+v[0]], _ = t[m == null ? void 0 : m[+v[1]]], F = t[m == null ? void 0 : m[+v[1] + 1]];
        if (!_ || !F) continue;
        const u = new Me().setFromPoints([new b(_[0], _[1], _[2]), new b(F[0], F[1], F[2])]), E = new _t(u, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        E.renderOrder = 999, Ct.add(E);
      } else if (d === "poly") {
        const _ = o[+v[0]].map((E) => {
          const te = t[E];
          return te ? new b(te[0], te[1], te[2]) : null;
        }).filter(Boolean);
        if (_.length < 2) continue;
        const F = new Me().setFromPoints(_), u = new _t(F, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        u.renderOrder = 999, Ct.add(u);
      } else if (d === "aux") {
        const m = n[+v[0]];
        if (!m || m.length !== 6) continue;
        const _ = new Me().setFromPoints([new b(m[0], m[1], m[2]), new b(m[3], m[4], m[5])]), F = new _t(_, new ct({ color: Yt, transparent: true, opacity: 0.95, depthTest: false }));
        F.renderOrder = 999, Ct.add(F);
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
  const Qt = (t, o, a, n, s, i, r, d, v) => {
    const m = r - n, _ = d - s, F = v - i, u = m * m + _ * _ + F * F;
    if (u < 1e-12) return Math.hypot(t - n, o - s, a - i);
    let E = ((t - n) * m + (o - s) * _ + (a - i) * F) / u;
    E = Math.max(0, Math.min(1, E));
    const te = n + E * m, P = s + E * _, C = i + E * F;
    return Math.hypot(t - te, o - P, a - C);
  }, rn = (t, o, a, n) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, d = -1, v = n;
    for (let m = 0; m < s.length; m++) {
      const _ = s[m];
      for (let F = 0; F < _.length - 1; F++) {
        const u = i[_[F]], E = i[_[F + 1]];
        if (!u || !E) continue;
        const te = Qt(t, o, a, u[0], u[1], u[2], E[0], E[1], E[2]);
        te < v && (v = te, r = m, d = F);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: d, dist: v } : null;
  }, cn = (t, o, a, n) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let r = -1, d = n;
    for (let v = 0; v < i.length; v++) {
      const m = i[v];
      if (!m || m.length !== 6) continue;
      const _ = Qt(t, o, a, m[0], m[1], m[2], m[3], m[4], m[5]);
      _ < d && (d = _, r = v);
    }
    return r;
  }, dn = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      Ee.visible = false;
      return;
    }
    Ee.geometry.setFromPoints([new b(n[0], n[1], n[2]), new b(n[3], n[4], n[5])]), Ee.visible = true;
  }, Jn = (t, o = -1) => {
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
      d && i.push(new b(d[0], d[1], d[2]));
    }
    else {
      const r = n[a[o]], d = n[a[o + 1]];
      r && i.push(new b(r[0], r[1], r[2])), d && i.push(new b(d[0], d[1], d[2]));
    }
    Ee.geometry.setFromPoints(i), Ee.visible = true;
  }, pn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const a = o.filter((v, m) => m !== t), n = /* @__PURE__ */ new Set();
    for (const v of a) for (const m of v) n.add(m);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let v = 0; v < s.length; v++) n.has(v) && (i.set(v, r.length), r.push(s[v]));
    const d = a.map((v) => v.map((m) => i.get(m)).filter((m) => m !== void 0));
    e.points.val = r, e.polylines.val = d, e.areas && (e.areas.val = e.areas.rawVal.filter((v) => v !== t).map((v) => v > t ? v - 1 : v)), Ee.visible = false, ve = -1, Je = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, An = (t, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (t < 0 || t >= a.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false) {
      pn(t);
      return;
    }
    const s = a[t];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      pn(t);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const r = [...a.slice(0, t), ...i, ...a.slice(t + 1)], d = /* @__PURE__ */ new Set();
    for (const u of r) for (const E of u) d.add(E);
    const v = e.points.rawVal, m = /* @__PURE__ */ new Map(), _ = [];
    for (let u = 0; u < v.length; u++) d.has(u) && (m.set(u, _.length), _.push(v[u]));
    const F = r.map((u) => u.map((E) => m.get(E)).filter((E) => E !== void 0));
    if (e.points.val = _, e.polylines.val = F, e.areas) {
      const u = i.length - 1;
      e.areas.val = e.areas.rawVal.map((E) => E > t ? E + u : E);
    }
    Ee.visible = false, ve = -1, Je = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  j.geometry.setAttribute("position", new vt(e.points.rawVal.flat(), 3)), j.geometry.computeBoundingSphere(), j.frustumCulled = false, be.frustumCulled = false, p.add(be), G.position.set(0, 0, 0), G.rotateX(Math.PI / 2), G.geometry.rotateX(Math.PI / 2), G.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, a) => {
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
  const un = [];
  window.__hekatanCirculos = un;
  let En = [], vn = "";
  const Vn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${t.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === vn) return En;
    vn = a;
    const n = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const r = s.slice(0, i - 1).map((_) => t[_]).filter(Boolean);
      if (r.length < 5) continue;
      const d = [0, 1, 2].map((_) => r.reduce((F, u) => F + u[_], 0) / r.length), v = r.map((_) => Math.hypot(_[0] - d[0], _[1] - d[1], _[2] - d[2])), m = v.reduce((_, F) => _ + F, 0) / v.length;
      m < 1e-9 || v.some((_) => Math.abs(_ - m) > 5e-3 * m) || n.push({ c: d, r: m });
    }
    return En = n;
  };
  window.__hekatanCentrosDeducidos = Vn, window.__hekatanDrawCircle = (t, o, a, n, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const r = Math.max(4, Math.round(s)), d = e.points.rawVal.length, v = [];
    for (let m = 0; m < r; m++) {
      const _ = 2 * Math.PI * m / r, F = n * Math.cos(_), u = n * Math.sin(_);
      let E;
      i === "xy" ? E = [t + F, o + u, a] : i === "xz" ? E = [t + F, o, a + u] : E = [t, o + F, a + u], v.push(E);
    }
    if (e.points.val = [...e.points.rawVal, ...v], un.push({ c: [t, o, a], r: n }), e.polylines) {
      const m = [...v.map((F, u) => d + u), d], _ = e.polylines.rawVal;
      ((_a2 = _[_.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [..._, m, []] : e.polylines.val = [..._.slice(0, -1), m, []];
    }
  }, window.__hekatanDrawArc = (t, o, a, n = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(n)), i = new b(...t), r = new b(...o), d = new b(...a), v = new b().subVectors(r, i), m = new b().subVectors(d, i), _ = new b().crossVectors(v, m).normalize(), F = new b().addVectors(i, r).multiplyScalar(0.5), u = new b().addVectors(r, d).multiplyScalar(0.5), E = new b().crossVectors(v, _).normalize(), te = new b().crossVectors(new b().subVectors(d, r), _).normalize(), P = new b().subVectors(u, F), C = E.x * te.y - E.y * te.x;
    let y;
    if (Math.abs(C) > 1e-9) {
      const Se = (P.x * te.y - P.y * te.x) / C;
      y = new b().addVectors(F, E.clone().multiplyScalar(Se));
    } else y = F.clone();
    const z = i.distanceTo(y), q = new b().subVectors(i, y), D = new b().subVectors(d, y), Q = Math.acos(Math.max(-1, Math.min(1, q.dot(D) / (z * z)))), R = e.points.rawVal.length, O = [], Ce = _.clone();
    for (let Se = 0; Se <= s; Se++) {
      const Ae = Se / s, Re = Q * Ae, Ke = new Xn().setFromAxisAngle(Ce, Re), tt = q.clone().applyQuaternion(Ke).add(y);
      O.push([tt.x, tt.y, tt.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...O], un.push({ c: [y.x, y.y, y.z], r: z }), e.polylines) {
      const Se = O.map((Re, Ke) => R + Ke), Ae = e.polylines.rawVal;
      e.polylines.val = [...Ae.slice(0, -1), Se, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, a = 1, n = 6, s = 6) => {
    const i = Math.min(t[0], o[0]), r = Math.max(t[0], o[0]), d = Math.min(t[1], o[1]), v = Math.max(t[1], o[1]), m = (t[2] + o[2]) / 2, _ = r - i, F = v - d, u = Math.min(a, _ / 2 - 0.01, F / 2 - 0.01);
    if (u <= 0) return;
    const E = e.points.rawVal.length, te = [], P = [], C = (y, z) => {
      te.push([y, z, m]), P.push(E + te.length - 1);
    };
    for (let y = 0; y <= s; y++) C(i + u + (_ - 2 * u) * y / s, d);
    for (let y = 1; y <= n; y++) {
      const z = -Math.PI / 2 + Math.PI / 2 * y / n;
      C(r - u + u * Math.cos(z), d + u + u * Math.sin(z));
    }
    for (let y = 1; y <= s; y++) C(r, d + u + (F - 2 * u) * y / s);
    for (let y = 1; y <= n; y++) {
      const z = 0 + Math.PI / 2 * y / n;
      C(r - u + u * Math.cos(z), v - u + u * Math.sin(z));
    }
    for (let y = 1; y <= s; y++) C(r - u - (_ - 2 * u) * y / s, v);
    for (let y = 1; y <= n; y++) {
      const z = Math.PI / 2 + Math.PI / 2 * y / n;
      C(i + u + u * Math.cos(z), v - u + u * Math.sin(z));
    }
    for (let y = 1; y <= s; y++) C(i, v - u - (F - 2 * u) * y / s);
    for (let y = 1; y <= n; y++) {
      const z = Math.PI + Math.PI / 2 * y / n;
      C(i + u + u * Math.cos(z), d + u + u * Math.sin(z));
    }
    if (P.push(E), e.points.val = [...e.points.rawVal, ...te], e.polylines) {
      const y = e.polylines.rawVal;
      e.polylines.val = [...y.slice(0, -1), P, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], d = o[1], v = o[2];
    let m;
    if (Math.abs(i - v) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, d, i], [n, d, i]] : Math.abs(s - d) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, s, v], [n, s, v]] : m = [[n, s, i], [n, d, i], [n, d, v], [n, s, v]], e.points.val = [...e.points.rawVal, ...m], e.polylines) {
      const _ = [a, a + 1, a + 2, a + 3, a], F = e.polylines.rawVal;
      e.polylines.val = [...F.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], r = o[0], d = o[1], v = o[2];
    let m;
    if (V && e.gridTarget) {
      const _ = e.gridTarget.rawVal, F = new Pn(..._.rotation), u = new b(1, 0, 0).applyEuler(F), E = new b(0, 1, 0).applyEuler(F), te = new b(..._.position), P = new b(n, s, i), C = new b(r, d, v), y = P.clone().sub(te).dot(u), z = P.clone().sub(te).dot(E), q = C.clone().sub(te).dot(u), D = C.clone().sub(te).dot(E), Q = (R, O) => te.clone().addScaledVector(u, R).addScaledVector(E, O).toArray();
      m = [Q(y, z), Q(q, z), Q(q, D), Q(y, D)];
    } else Math.abs(i - v) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, d, i], [n, d, i]] : Math.abs(s - d) < 1e-6 ? m = [[n, s, i], [r, s, i], [r, s, v], [n, s, v]] : m = [[n, s, i], [n, d, i], [n, d, v], [n, s, v]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...m], e.polylines) {
      const _ = e.polylines.rawVal, F = _.length - 1, u = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [..._.slice(0, -1), u, []], e.areas && (e.areas.val = [...e.areas.rawVal, F]);
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
      const Te = t[we], nt = t[(we + 1) % a];
      n += (Te[1] - nt[1]) * (Te[2] + nt[2]), s += (Te[2] - nt[2]) * (Te[0] + nt[0]), i += (Te[0] - nt[0]) * (Te[1] + nt[1]);
    }
    const r = Math.hypot(n, s, i) || 1;
    n /= r, s /= r, i /= r;
    let d = t[1][0] - t[0][0], v = t[1][1] - t[0][1], m = t[1][2] - t[0][2];
    const _ = Math.hypot(d, v, m) || 1;
    d /= _, v /= _, m /= _;
    let F = s * m - i * v, u = i * d - n * m, E = n * v - s * d;
    const te = Math.hypot(F, u, E) || 1;
    F /= te, u /= te, E /= te;
    const P = t[0], C = (we) => [(we[0] - P[0]) * d + (we[1] - P[1]) * v + (we[2] - P[2]) * m, (we[0] - P[0]) * F + (we[1] - P[1]) * u + (we[2] - P[2]) * E], y = (we, Te) => [P[0] + we * d + Te * F, P[1] + we * v + Te * u, P[2] + we * m + Te * E], z = t.map(C);
    let q = 1 / 0, D = -1 / 0, Q = 1 / 0, R = -1 / 0;
    for (const [we, Te] of z) we < q && (q = we), we > D && (D = we), Te < Q && (Q = Te), Te > R && (R = Te);
    const O = D - q, Ce = R - Q;
    if (O < 1e-6 || Ce < 1e-6) return 0;
    let Se = o && o > 0 ? o : 0.5;
    for (; O / Se * (Ce / Se) > 2500; ) Se *= 2;
    Se = Math.min(Se, Math.min(O, Ce));
    const Ae = (we, Te) => {
      let nt = false;
      for (let Vt = 0, $t = z.length - 1; Vt < z.length; $t = Vt++) {
        const [Nt, Jt] = z[Vt], [uo, sn] = z[$t];
        Jt > Te != sn > Te && we < (uo - Nt) * (Te - Jt) / (sn - Jt) + Nt && (nt = !nt);
      }
      return nt;
    }, Re = Math.max(1, Math.round(O / Se)), Ke = Math.max(1, Math.round(Ce / Se)), tt = O / Re, dt = Ce / Ke, rt = /* @__PURE__ */ new Map(), ft = [], Pe = e.points.rawVal.length, He = (we, Te) => {
      const nt = we + "," + Te, Vt = rt.get(nt);
      if (Vt !== void 0) return Vt;
      const $t = Pe + ft.length;
      return ft.push(y(q + we * tt, Q + Te * dt)), rt.set(nt, $t), $t;
    }, at = [];
    for (let we = 0; we < Re; we++) for (let Te = 0; Te < Ke; Te++) {
      if (!Ae(q + (we + 0.5) * tt, Q + (Te + 0.5) * dt)) continue;
      const nt = He(we, Te), Vt = He(we + 1, Te), $t = He(we + 1, Te + 1), Nt = He(we, Te + 1);
      at.push([nt, Vt, $t, Nt]);
    }
    if (!at.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...ft], e.polylines && e.areas) {
      let we = e.polylines.rawVal.slice();
      we.length && we[we.length - 1].length === 0 && (we = we.slice(0, -1));
      const Te = [];
      for (const nt of at) Te.push(we.length), we.push([nt[0], nt[1], nt[2], nt[3], nt[0]]);
      we.push([]), e.polylines.val = we, e.areas.val = [...e.areas.rawVal, ...Te];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), at.length;
  };
  const fn = () => {
    if (fe.length < 3) return fe = [], W.visible = false, x(), 0;
    const t = window.__hekatanMeshPolyArea(fe.slice());
    return fe = [], W.visible = false, x(), t;
  };
  window.__hekatanFinalizePolyArea = fn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, a) => {
    var _a2;
    const n = new b(t[0], t[1], t[2]), s = new b(o[0], o[1], o[2]), i = new b(a[0], a[1], a[2]), r = new b().subVectors(s, n).cross(new b().subVectors(i, n));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const d = new Xn().setFromUnitVectors(new b(0, 0, 1), r), v = new Pn().setFromQuaternion(d);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [v.x, v.y, v.z] }), V = true;
    const m = new b().addVectors(n, s).add(i).multiplyScalar(1 / 3), _ = Math.max(n.distanceTo(s), n.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, F = _ / 2;
    $e.geometry.dispose(), $e.geometry = new tn(_, _), _e.geometry.dispose(), _e.geometry = new Wo(new tn(_, _)), Oe(F, 1), he.position.copy(m), he.quaternion.copy(d), he.scale.set(1, 1, 1), he.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), V = false, he.visible = false, x();
  };
  const Lt = new je();
  Lt.visible = false, p.add(Lt), window.__hekatanShowAxes = (t, o, a = 12, n = 2) => {
    var _a2, _b;
    for (; Lt.children.length; ) {
      const _ = Lt.children.pop();
      (_a2 = _.geometry) == null ? void 0 : _a2.dispose(), (_b = _.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const s = Math.min(...o) - n, i = Math.max(...o) + n, r = Math.min(...t) - n, d = Math.max(...t) + n, v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", m = (_, F, u, E, te) => {
      const P = document.createElement("canvas");
      P.width = 64, P.height = 32;
      const C = P.getContext("2d");
      C.fillStyle = te, C.font = "bold 22px sans-serif", C.textAlign = "center", C.fillText(_, 32, 26);
      const y = new Jo(P), z = new Oo({ map: y, transparent: true }), q = new Qo(z);
      return q.position.set(F, u, E), q.scale.set(1.2, 0.6, 1), q;
    };
    t.forEach((_, F) => {
      const u = F < v.length ? v[F] : `X${F}`, E = new Me().setFromPoints([new b(_, s, 0), new b(_, i, 0), new b(_, s, 0), new b(_, s, a)]), te = new kn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), P = new Kt(E, te);
      P.computeLineDistances(), Lt.add(P), Lt.add(m(u, _, s - 0.5, 0, "#60a5fa")), Lt.add(m(u, _, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((_, F) => {
      const u = `${F + 1}`, E = new Me().setFromPoints([new b(r, _, 0), new b(d, _, 0), new b(r, _, 0), new b(r, _, a)]), te = new kn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), P = new Kt(E, te);
      P.computeLineDistances(), Lt.add(P), Lt.add(m(u, r - 0.5, _, 0, "#fb7185")), Lt.add(m(u, d + 0.5, _, 0, "#fb7185"));
    }), Lt.visible = true, x();
  }, window.__hekatanHideAxes = () => {
    Lt.visible = false, x();
  };
  const qt = new je();
  qt.visible = false, p.add(qt);
  let Wt = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, a = 0, n = 0) => {
    var _a2, _b;
    for (; qt.children.length; ) {
      const i = qt.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    Wt.forEach((i) => {
      p.remove(i), i.geometry.dispose(), i.material.dispose();
    }), Wt = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, r) => {
      const d = s[r % s.length], v = o / 2, m = [new b(a - v, n - v, i), new b(a + v, n - v, i), new b(a + v, n + v, i), new b(a - v, n + v, i), new b(a - v, n - v, i)], _ = new Me().setFromPoints(m), F = new ct({ color: d, transparent: true, opacity: 0.55 });
      qt.add(new _t(_, F));
      const u = document.createElement("canvas");
      u.width = 128, u.height = 32;
      const E = u.getContext("2d");
      E.fillStyle = `#${d.toString(16).padStart(6, "0")}`, E.font = "bold 18px sans-serif", E.fillText(`Z = ${i} m`, 4, 22);
      const te = new Jo(u), P = new Oo({ map: te, transparent: true }), C = new Qo(P);
      C.position.set(a - v - 1.5, n - v - 1.5, i), C.scale.set(2.5, 0.6, 1), qt.add(C);
      const y = new tn(1e4, 1e4), z = new it({ visible: false, side: kt }), q = new et(y, z);
      q.position.set(0, 0, i), q.frustumCulled = false, q.userData = { refPlaneZ: i }, p.add(q), Wt.push(q);
    }), qt.visible = true, x();
  }, window.__hekatanHideRefPlanes = () => {
    qt.visible = false, Wt.forEach((t) => {
      t.visible = false;
    }), x();
  };
  const jt = new je();
  jt.frustumCulled = false, p.add(jt);
  const ys = () => {
    var _a2, _b, _c, _d;
    for (; jt.children.length; ) {
      const a = jt.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const n = new Me().setFromPoints([new b(a[0], a[1], a[2]), new b(a[3], a[4], a[5])]), s = new kn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new _t(n, s);
      i.computeLineDistances(), jt.add(i);
    }
  };
  H.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, ys(), x());
  });
  const hn = new je();
  hn.frustumCulled = false, p.add(hn);
  const Po = () => {
    var _a2, _b, _c, _d;
    for (; hn.children.length; ) {
      const a = hn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const n = new et(new gn(0.025, 12, 12), new it({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(a[0], a[1], a[2]), n.renderOrder = 996, n.scale.setScalar(yt(n.position)), hn.add(n);
    }
  };
  H.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Po(), x());
  }), c.addEventListener("change", () => {
    hn.children.forEach((t) => {
      t.scale.setScalar(yt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Po;
  const xt = new je(), xs = new et(new gn(0.01, 12, 12), new it({ color: 16724804, transparent: true, opacity: 0.95 })), gs = new et(new gn(0.015, 12, 12), new it({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(xs, gs);
  const mn = 0.08, On = (t, o, a) => {
    const n = new Me().setFromPoints([new b(...t), new b(...o)]);
    return new _t(n, new ct({ color: a, transparent: true, opacity: 0.7 }));
  };
  xt.add(On([-mn, 0, 0], [mn, 0, 0], 16711680)), xt.add(On([0, -mn, 0], [0, mn, 0], 65280)), xt.add(On([0, 0, -mn], [0, 0, mn], 35071)), xt.visible = false, xt.frustumCulled = false, p.add(xt);
  let Qn = 2;
  const Tn = (t) => {
    const o = h(), a = (g == null ? void 0 : g.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, Mn = () => {
    if (!xt.visible) return;
    const t = Qn * Tn(xt.position) / 0.015;
    xt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let jn = 10;
  const eo = (t) => Math.max(1e-4, jn * Tn(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (jn = t), jn), window.__hekatanUpdateSnapScale = Mn, window.__hekatanSnapMarker = xt, window.__hekatanMetrosPorPixel = Tn, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (Qn = t, Mn(), x()), Qn);
  const Co = () => {
    Ct.children.length !== 0 && Ct.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(yt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Co, c.addEventListener("change", () => {
    var _a2;
    Mn(), Ue.visible && Pt(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Co();
  }), window.__hekatanShowSnap = (t, o, a) => {
    xt.position.set(t, o, a), xt.visible = true, Mn(), x();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, x();
  }, g.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    const a = ie();
    if (a.length) {
      const n = a[0].point, s = t.altKey, i = eo(n), r = s ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i);
      if (r) Vo(r.type, r.x, r.y, r.z), xt.position.set(r.x, r.y, r.z), xt.visible = true, n.set(r.x, r.y, r.z), _s(r.type, t.clientX, t.clientY);
      else {
        Ss(), In();
        const F = !s && window.__hekatanSnapEnabled !== false, u = window.__hekatanSnap2D ?? 0.5;
        F && u > 0 && (n.x = Math.round(n.x / u) * u, n.y = Math.round(n.y / u) * u, n.z = Math.round(n.z / u) * u), xt.position.copy(n), xt.visible = true;
      }
      Mn();
      const d = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (d === "select" || !d) {
        const F = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = At(n.x, n.y, n.z, F), E = rn(n.x, n.y, n.z, F), te = cn(n.x, n.y, n.z, F);
        if (u >= 0) {
          const z = e.points.rawVal[u];
          Ue.position.set(z[0], z[1], z[2]), Ue.visible = true, Pt(), Be.visible = false, ht = { kind: "pt", a: u };
        } else if (E) {
          const z = e.points.rawVal, q = e.polylines.rawVal[E.polyIdx], D = z[q[E.segIdx]], Q = z[q[E.segIdx + 1]];
          Be.geometry.setFromPoints([new b(D[0], D[1], D[2]), new b(Q[0], Q[1], Q[2])]), Be.visible = true, Ue.visible = false, ht = ((_f = (_e2 = e.areas) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.includes(E.polyIdx)) ?? false ? { kind: "poly", a: E.polyIdx } : { kind: "seg", a: E.polyIdx, b: E.segIdx };
        } else if (te >= 0) {
          const q = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[te];
          q && (Be.geometry.setFromPoints([new b(q[0], q[1], q[2]), new b(q[3], q[4], q[5])]), Be.visible = true, Ue.visible = false, ht = { kind: "aux", a: te });
        } else Be.visible = false, Ue.visible = false, ht = null;
        se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        let P = n;
        if ((ht == null ? void 0 : ht.kind) === "pt") {
          const z = e.points.rawVal[ht.a];
          z && (P = new b(z[0], z[1], z[2]));
        }
        const C = `X=${P.x.toFixed(2)} Y=${P.y.toFixed(2)} Z=${P.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [P.x, P.y, P.z], ht) {
          const z = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          se.textContent = `${C}  \xB7  \u{1F5B1} Click \u2192 ${z[ht.kind]}`;
        } else se.textContent = C;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = C), pe.visible = false, ut.visible = false, x();
        return;
      }
      if (d === "delete" || d === "trim" || d === "extend" || d === "offset") {
        const F = (window.__hekatanSnap2D ?? 0.5) * 1.5, u = rn(n.x, n.y, n.z, F), E = cn(n.x, n.y, n.z, F);
        let te = false;
        if (E >= 0) if (!u) te = true;
        else {
          const z = window.__hekatanDrawingAuxLines, D = ((z == null ? void 0 : z.rawVal) ?? (z == null ? void 0 : z.val) ?? z ?? [])[E];
          Qt(n.x, n.y, n.z, D[0], D[1], D[2], D[3], D[4], D[5]) < u.dist && (te = true);
        }
        te ? (Qe = E, ve = -1, Je = -1, dn(E)) : u ? (ve = u.polyIdx, Je = u.segIdx, Qe = -1, Jn(u.polyIdx, u.segIdx)) : (ve = -1, Je = -1, Qe = -1, Ee.visible = false), pe.visible = false, ut.visible = false, N(), se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
        const P = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let C = "";
        te ? C = `\u{1F5D1} l\xEDnea aux #${Qe + 1}` : u ? C = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(u.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${u.polyIdx + 1}` : `\u{1F5D1} seg ${u.segIdx + 1} / poly #${u.polyIdx + 1}` : C = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", se.textContent = `${P}  \xB7  ${C}`;
        const y = document.getElementById("hk-coord-fixed");
        y && (y.textContent = P), x();
        return;
      } else Ee.visible = false, ve = -1, Qe = -1;
      se.style.left = t.clientX + "px", se.style.top = t.clientY + "px", se.style.display = "block";
      const v = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], m = v[v.length - 1] ?? [], _ = e.points.rawVal ?? [];
      if (m.length > 0 && _[m[m.length - 1]]) {
        const F = m[m.length - 1], u = _[F];
        let E = Ie;
        if (Ot = null, !E && window.__hekatanAxisSnap !== false) {
          const Re = g.getBoundingClientRect(), Ke = t.clientX, tt = t.clientY, dt = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, rt = new b(u[0], u[1], u[2]), ft = [["x", new b(1, 0, 0)], ["y", new b(0, 1, 0)], ["z", new b(0, 0, 1)]], Pe = (at) => {
            const we = at.clone().project(o);
            return { x: (we.x * 0.5 + 0.5) * Re.width + Re.left, y: (-we.y * 0.5 + 0.5) * Re.height + Re.top };
          };
          let He = null;
          for (const [at, we] of ft) {
            const Te = Pe(rt.clone().addScaledVector(we, -dt)), nt = Pe(rt.clone().addScaledVector(we, dt)), Vt = nt.x - Te.x, $t = nt.y - Te.y, Nt = Ke - Te.x, Jt = tt - Te.y, uo = Vt * Vt + $t * $t || 1;
            let sn = (Nt * Vt + Jt * $t) / uo;
            sn = Math.max(0, Math.min(1, sn));
            const Uo = Math.hypot(Ke - (Te.x + sn * Vt), tt - (Te.y + sn * $t));
            if (He === null || Uo < He.dpx) {
              const fo = S.ray, Zo = rt.clone().sub(fo.origin), ho = we.dot(fo.direction), qo = we.dot(Zo), Ts = fo.direction.dot(Zo), Ko = 1 - ho * ho, $s = Math.abs(Ko) < 1e-6 ? -qo : (ho * Ts - qo) / Ko;
              He = { axis: at, dpx: Uo, pt: rt.clone().addScaledVector(we, $s) };
            }
          }
          He && He.dpx <= 12 && (n.copy(He.pt), E = He.axis, Ot = He.pt.clone());
        }
        const te = !!window.__hekatanOrthoMode;
        if (!E && te) {
          const Re = Math.abs(n.x - u[0]), Ke = Math.abs(n.y - u[1]), tt = Math.abs(n.z - u[2]), dt = (_l = a[0]) == null ? void 0 : _l.object;
          let rt = null;
          dt === ze ? rt = "xy" : dt === Ne ? rt = "xz" : dt === Le && (rt = "yz"), rt === "xy" ? E = Re >= Ke ? "x" : "y" : rt === "xz" ? E = Re >= tt ? "x" : "z" : rt === "yz" ? E = Ke >= tt ? "y" : "z" : E = Re >= Ke && Re >= tt ? "x" : Ke >= tt ? "y" : "z";
        }
        const P = window.__hekatanPolarTrack !== false;
        if (!E && P) {
          const Re = n.x - u[0], Ke = n.y - u[1], tt = n.z - u[2], dt = Math.hypot(Re, Ke, tt);
          if (dt > 1e-3) {
            const ft = Math.tan(6 * Math.PI / 180) * dt, Pe = Math.hypot(Ke, tt), He = Math.hypot(Re, tt), at = Math.hypot(Re, Ke), we = [["x", Pe], ["y", He], ["z", at]];
            we.sort((Te, nt) => Te[1] - nt[1]), we[0][1] <= ft && (E = we[0][0]);
          }
        }
        if (E) {
          const Re = u[0], Ke = u[1], tt = u[2];
          E === "x" ? n.set(n.x, Ke, tt) : E === "y" ? n.set(Re, n.y, tt) : n.set(Re, Ke, n.z);
          const dt = !!Ie, ft = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[E];
          qe.style.background = "rgba(15,23,42,0.92)", qe.style.color = ft, qe.style.border = `1.5px solid ${ft}`;
          const Pe = (_m = a[0]) == null ? void 0 : _m.object;
          let He = null;
          Pe === ze ? He = "xy" : Pe === Ne ? He = "xz" : Pe === Le && (He = "yz");
          const at = He ? ` (plano ${He.toUpperCase()})` : "";
          qe.textContent = dt ? `\u{1F512} LOCK ${E.toUpperCase()}${at}` : `\u22A5 ORTO ${E.toUpperCase()}${at}`, qe.style.left = t.clientX + 20 + "px", qe.style.top = t.clientY + 18 + "px", qe.style.transform = "none", qe.style.display = "block";
        } else Ie || (qe.style.display = "none");
        const C = Math.hypot(n.x - u[0], n.y - u[1], n.z - u[2]), y = Math.atan2(n.y - u[1], n.x - u[0]) * 180 / Math.PI, z = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = `${z} | \u0394L=${C.toFixed(2)}m ${y.toFixed(0)}\xB0`;
        const q = document.getElementById("hk-coord-fixed");
        q && (q.textContent = z), pe.geometry.setFromPoints([new b(u[0], u[1], u[2]), new b(n.x, n.y, n.z)]), (_n2 = pe.computeLineDistances) == null ? void 0 : _n2.call(pe), pe.visible = true, Z(u[0], u[1], u[2], n.x, n.y, n.z);
        const D = window.__hekatanOrthoExt ?? 8, Q = window.__hekatanShowOrthoPlanes !== false;
        ge.visible = Q, Q || We(null), Q && (ot(de, u, "xy", D), ot(me, u, "xz", D), ot(xe, u, "yz", D), Ze(ze, u, "xy", D), Ze(Ne, u, "xz", D), Ze(Le, u, "yz", D));
        const R = Q ? S.intersectObjects([ze, Ne, Le], false) : [];
        let O = null;
        if (R.length > 0) {
          const Re = R[0].object;
          Re === ze ? O = "xy" : Re === Ne ? O = "xz" : Re === Le && (O = "yz");
        }
        We(O), O && (lt.style.left = t.clientX + "px", lt.style.top = t.clientY + "px"), k.geometry.setFromPoints([new b(u[0] - D, u[1], u[2]), new b(u[0] + D, u[1], u[2])]), (_o2 = k.computeLineDistances) == null ? void 0 : _o2.call(k), I.geometry.setFromPoints([new b(u[0], u[1] - D, u[2]), new b(u[0], u[1] + D, u[2])]), (_p = I.computeLineDistances) == null ? void 0 : _p.call(I), J.geometry.setFromPoints([new b(u[0], u[1], u[2] - D), new b(u[0], u[1], u[2] + D)]), (_q = J.computeLineDistances) == null ? void 0 : _q.call(J), ut.visible = true;
        const Ce = k.material, Se = I.material, Ae = J.material;
        E === "x" ? (Ce.opacity = 0.95, Se.opacity = 0.1, Ae.opacity = 0.1) : E === "y" ? (Ce.opacity = 0.1, Se.opacity = 0.95, Ae.opacity = 0.1) : E === "z" ? (Ce.opacity = 0.1, Se.opacity = 0.1, Ae.opacity = 0.95) : (Ce.opacity = 0.5, Se.opacity = 0.5, Ae.opacity = 0.5);
      } else {
        const F = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        se.textContent = F;
        const u = document.getElementById("hk-coord-fixed");
        if (u && (u.textContent = F), pe.visible = false, ut.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(d)) {
          if (X = null, K = null, U.style.left = t.clientX + 20 + "px", U.style.top = t.clientY - 28 + "px", U.style.display = "block", !$) {
            U.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const te = document.activeElement;
            !(te && (te.tagName === "INPUT" || te.tagName === "TEXTAREA") && te !== U) && document.activeElement !== U && U.focus({ preventScroll: true });
            try {
              U.select();
            } catch {
            }
          }
        } else N();
      }
      x();
    } else In(), se.style.display = "none", xt.visible = false, pe.visible = false, ut.visible = false, N(), x();
  }), H.derive(() => {
    if (!e.gridTarget) return;
    const t = new Xn().setFromEuler(new Pn(...e.gridTarget.val.rotation)), o = new Xn().setFromAxisAngle(new b(1, 0, 0), Math.PI / 2);
    ba(l, { position: new b(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, x), G.position.set(...e.gridTarget.val.position), G.quaternion.setFromEuler(new Pn(...e.gridTarget.val.rotation)), G.updateMatrixWorld();
    const a = new b(0, 0, 1).applyEuler(new Pn(...e.gridTarget.val.rotation));
    V = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  }), H.derive(() => {
    j.geometry.setAttribute("position", new vt(e.points.val.flat(), 3)), j.geometry.computeBoundingSphere();
  }), H.derive(() => {
    const t = 0.05 * w * 0.5 * f.val;
    S.params.Points.threshold = 0.4 * t;
  }), H.derive(() => {
    var _a2;
    const t = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of a) {
      const [r, d, v] = t[i];
      n.push(r, d, v);
    }
    const s = new Me();
    s.setAttribute("position", new vt(n, 3)), ye.geometry.dispose(), ye.geometry = s;
  });
  let to = false, nn = 0;
  g.addEventListener("pointerdown", () => {
    to = true;
  }), g.addEventListener("pointerup", () => {
    to = false;
  }), g.addEventListener("pointermove", () => {
    to && nn++;
  });
  const Et = document.createElement("div");
  Et.id = "hk-window-select", Et.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Et);
  let Ut = null, bn = false, It = null;
  const no = (t, o, a, n, s) => {
    s ? (Et.style.borderColor = "#34d399", Et.style.borderStyle = "dashed", Et.style.background = "rgba(52, 211, 153, 0.10)") : (Et.style.borderColor = "#22d3ee", Et.style.borderStyle = "solid", Et.style.background = "rgba(34, 211, 238, 0.10)"), Et.style.left = Math.min(t, a) + "px", Et.style.top = Math.min(o, n) + "px", Et.style.width = Math.abs(a - t) + "px", Et.style.height = Math.abs(n - o) + "px", Et.style.display = "block";
  }, zo = (t, o, a, n, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, a), r = Math.max(t, a), d = Math.min(o, n), v = Math.max(o, n), m = a < t, _ = g.getBoundingClientRect(), F = h();
    F.updateMatrixWorld();
    const u = (R) => {
      const O = new b(R[0], R[1], R[2]);
      return O.project(F), { x: _.left + (O.x * 0.5 + 0.5) * _.width, y: _.top + (-O.y * 0.5 + 0.5) * _.height };
    }, E = (R) => R.x >= i && R.x <= r && R.y >= d && R.y <= v, te = (R, O) => !(R.x < i && O.x < i || R.x > r && O.x > r || R.y < d && O.y < d || R.y > v && O.y > v);
    s || ke.clear();
    let P = 0;
    const C = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let R = 0; R < C.length; R++) {
      const O = C[R];
      O && E(u(O)) && (ke.add(`pt:${R}`), P++);
    }
    const y = (R, O) => m ? E(R) || E(O) || te(R, O) : E(R) && E(O), z = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], q = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let R = 0; R < z.length; R++) {
      const O = z[R];
      if (q.includes(R)) {
        let Se;
        if (!m) Se = O.every((Ae) => {
          const Re = C[Ae];
          return !!Re && E(u(Re));
        });
        else {
          Se = false;
          for (let Ae = 0; Ae < O.length - 1; Ae++) {
            const Re = C[O[Ae]], Ke = C[O[Ae + 1]];
            if (!(!Re || !Ke) && y(u(Re), u(Ke))) {
              Se = true;
              break;
            }
          }
        }
        Se && (ke.add(`poly:${R}`), P++);
      } else for (let Se = 0; Se < O.length - 1; Se++) {
        const Ae = C[O[Se]], Re = C[O[Se + 1]];
        !Ae || !Re || y(u(Ae), u(Re)) && (ke.add(`seg:${R}:${Se}`), P++);
      }
    }
    const Q = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let R = 0; R < Q.length; R++) {
      const O = Q[R];
      if (!O || O.length !== 6) continue;
      const Ce = u([O[0], O[1], O[2]]), Se = u([O[3], O[4], O[5]]);
      y(Ce, Se) && (ke.add(`aux:${R}`), P++);
    }
    Mt(), oe(`${m ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${P} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${ke.size})`), Et.style.display = "none";
  }, $n = () => {
    It && (It = null, Et.style.display = "none", oe("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = $n, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && It && $n();
  });
  const Fo = () => {
    var _a2, _b, _c, _d;
    if (ke.size === 0) return false;
    const t = [...ke], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set();
    for (const te of t) {
      const [P, ...C] = te.split(":");
      if (P === "pt") r.add(+C[0]);
      else if (P === "poly") d.add(+C[0]);
      else if (P === "seg") {
        const y = +C[0], z = +C[1];
        v.has(y) || v.set(y, /* @__PURE__ */ new Set()), v.get(y).add(z);
      } else P === "aux" && m.add(+C[0]);
    }
    let _ = 0, F = [], u = [];
    const E = /* @__PURE__ */ new Map();
    for (let te = 0; te < a.length; te++) {
      if (d.has(te)) {
        _++;
        continue;
      }
      E.set(te, F.length);
      const P = v.get(te);
      if (P && P.size > 0) {
        let C = [];
        for (let y = 0; y < a[te].length; y++) C.push(a[te][y]), y < a[te].length - 1 && P.has(y) && (C.length >= 2 && F.push(C), C = [], _++);
        (C.length >= 2 || C.length === 1) && F.push(C);
      } else F.push([...a[te]]);
    }
    if (r.size > 0) {
      const te = [], P = /* @__PURE__ */ new Map();
      for (let y = 0; y < o.length; y++) {
        if (r.has(y)) {
          _++;
          continue;
        }
        P.set(y, te.length), te.push([...o[y]]);
      }
      const C = [];
      for (const y of F) {
        let z = [];
        for (const q of y) {
          const D = P.get(q);
          D === void 0 ? (z.length >= 2 && C.push(z), z = []) : z.push(D);
        }
        z.length >= 2 && C.push(z);
      }
      F = C, e.points.val = te;
    }
    for (const te of n) {
      const P = E.get(te);
      P !== void 0 && P < F.length && u.push(P);
    }
    if (e.polylines && (e.polylines.val = F), e.areas && (e.areas.val = u), m.size > 0 && s) {
      const te = i.filter((P, C) => !m.has(C));
      "val" in s ? s.val = te : window.__hekatanDrawingAuxLines = te, _ += m.size;
    }
    ke.clear(), Mt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return oe(`\u{1F5D1} ${_} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Fo, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || ke.size !== 0 && (t.preventDefault(), Fo());
  });
  const Tt = document.createElement("div");
  Tt.id = "hk-properties-pane";
  const Ao = "hk-props-pane-pos";
  let _n = null;
  try {
    const t = localStorage.getItem(Ao);
    t && (_n = JSON.parse(t));
  } catch {
  }
  Tt.style.cssText = ["position:fixed", _n ? `left:${_n.left}px` : "left:14px", _n ? `top:${_n.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Tt);
  const vs = () => {
    const t = Tt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, a = 0, n = 0, s = 0, i = 0;
    t.addEventListener("mousedown", (r) => {
      o = true, a = r.clientX, n = r.clientY;
      const d = Tt.getBoundingClientRect();
      s = d.left, i = d.top, Tt.style.transform = "none", Tt.style.left = `${s}px`, Tt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const d = r.clientX - a, v = r.clientY - n, m = Math.max(0, Math.min(window.innerWidth - 80, s + d)), _ = Math.max(0, Math.min(window.innerHeight - 40, i + v));
      Tt.style.left = `${m}px`, Tt.style.top = `${_}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Ao, JSON.stringify({ left: parseFloat(Tt.style.left), top: parseFloat(Tt.style.top) }));
        } catch {
        }
      }
    });
  }, ee = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, zt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let st = null;
  const gt = (t, o, a, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: a, value: n } }));
  }, Ms = () => {
    if (st && (st.dispose(), st = null), ke.size === 0) {
      Tt.style.display = "none";
      return;
    }
    const t = [...ke], o = t.filter((F) => F.startsWith("pt:")), a = t.filter((F) => F.startsWith("seg:")), n = t.filter((F) => F.startsWith("poly:")), s = t.filter((F) => F.startsWith("aux:")), i = o.length > 0, r = a.length > 0, d = n.length > 0, v = !i && !r && !d, m = [];
    o.length && m.push(`\u{1F535} ${o.length} nodo(s)`), a.length && m.push(`\u{1F4CF} ${a.length} segmento(s)`), n.length && m.push(`\u25AD ${n.length} \xE1rea(s)`), s.length && m.push(`\u250A ${s.length} aux`);
    const _ = `\u{1F3AF} ${ke.size} item(s) \u2014 ${m.join(", ")}`;
    st = new ps({ container: Tt, title: _ });
    {
      const F = st.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      F.addBinding(zt, "dx", { label: "\u0394x (m)", step: 0.1 }), F.addBinding(zt, "dy", { label: "\u0394y (m)", step: 0.1 }), F.addBinding(zt, "dz", { label: "\u0394z (m)", step: 0.1 }), F.addBinding(zt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), F.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const E = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, zt.copias);
        oe(E ? `\u29C9 Replicado \xD7${E} (\u0394 ${zt.dx},${zt.dy},${zt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), F.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const E = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, zt.dx, zt.dy, zt.dz, 1);
        oe(E ? `\u2192 Copia desplazada \u0394 ${zt.dx},${zt.dy},${zt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const u = F.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      u.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), u.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), oe(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const F = st.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      F.addBinding(ee, "Ux"), F.addBinding(ee, "Uy"), F.addBinding(ee, "Uz"), F.addBinding(ee, "Rx"), F.addBinding(ee, "Ry"), F.addBinding(ee, "Rz");
      const u = st.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      u.addBinding(ee, "Kx", { label: "Kx", min: 0, step: 100 }), u.addBinding(ee, "Ky", { label: "Ky", min: 0, step: 100 }), u.addBinding(ee, "Kz", { label: "Kz", min: 0, step: 100 }), u.addBinding(ee, "Krx", { label: "Krx", min: 0, step: 1e3 }), u.addBinding(ee, "Kry", { label: "Kry", min: 0, step: 1e3 }), u.addBinding(ee, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const E = st.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      E.addBinding(ee, "Fx", { step: 0.1 }), E.addBinding(ee, "Fy", { step: 0.1 }), E.addBinding(ee, "Fz", { step: 0.1 }), E.addBinding(ee, "Mx", { step: 0.1 }), E.addBinding(ee, "My", { step: 0.1 }), E.addBinding(ee, "Mz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ee, "mass", { label: "m", min: 0, step: 1 }), st.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ee, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), st.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let C = 0;
        const y = [ee.Ux, ee.Uy, ee.Uz, ee.Rx, ee.Ry, ee.Rz];
        y.some((D) => D) && (gt("nodes", o, "supports", y), C++);
        const z = [ee.Fx, ee.Fy, ee.Fz, ee.Mx, ee.My, ee.Mz];
        z.some((D) => D !== 0) && (gt("nodes", o, "loads", z), C++);
        const q = [ee.Kx, ee.Ky, ee.Kz, ee.Krx, ee.Kry, ee.Krz];
        if (q.some((D) => D !== 0) && (gt("nodes", o, "springs", q), C++), ee.mass !== 0 && (gt("nodes", o, "mass", ee.mass), C++), ee.diaphragm !== "Ninguno" && (gt("nodes", o, "diaphragm", ee.diaphragm), C++), C === 0) {
          oe("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let D = document.getElementById("hk-prop-toast");
          D || (D = document.createElement("div"), D.id = "hk-prop-toast", D.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(D)), D.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", D.style.background = "rgba(217,119,6,0.97)", D.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            D && (D.style.opacity = "0");
          }, 3200);
        } else oe(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const F = st.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      F.addBinding(ee, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), F.addBinding(ee, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const u = st.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      u.addBinding(ee, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), u.addBinding(ee, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), u.addBinding(ee, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), u.addBinding(ee, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), st.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ee, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), st.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ee, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const P = st.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      P.addBinding(ee, "relMxI", { label: "Mx I" }), P.addBinding(ee, "relMyI", { label: "My I" }), P.addBinding(ee, "relMzI", { label: "Mz I" });
      const C = st.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      C.addBinding(ee, "relMxJ", { label: "Mx J" }), C.addBinding(ee, "relMyJ", { label: "My J" }), C.addBinding(ee, "relMzJ", { label: "Mz J" }), st.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ee, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const z = st.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      z.addBinding(ee, "LKx", { label: "LKx", min: 0, step: 100 }), z.addBinding(ee, "LKy", { label: "LKy", min: 0, step: 100 }), z.addBinding(ee, "LKz", { label: "LKz", min: 0, step: 100 });
      const q = st.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      q.addBinding(ee, "qx", { step: 0.1 }), q.addBinding(ee, "qy", { step: 0.1 }), q.addBinding(ee, "qz", { step: 0.1 }), st.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ee, "massPerM", { label: "m/L", min: 0, step: 1 }), st.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        gt("segs", a, "section", ee.section), gt("segs", a, "material", ee.material_frame);
        const Q = { A: ee.A_mod, Iz: ee.Iz_mod, Iy: ee.Iy_mod, J: ee.J_mod };
        (Q.A !== 1 || Q.Iz !== 1 || Q.Iy !== 1 || Q.J !== 1) && gt("segs", a, "modifiers", Q), ee.insertionPoint !== "10 \u2014 Centroid" && gt("segs", a, "insertionPoint", ee.insertionPoint), ee.beta !== 0 && gt("segs", a, "beta", ee.beta);
        const R = [ee.relMxI, ee.relMyI, ee.relMzI], O = [ee.relMxJ, ee.relMyJ, ee.relMzJ];
        (R.some((Ae) => Ae) || O.some((Ae) => Ae)) && gt("segs", a, "releases", { i: R, j: O }), ee.hinges !== "None" && gt("segs", a, "hinges", ee.hinges);
        const Ce = [ee.LKx, ee.LKy, ee.LKz];
        Ce.some((Ae) => Ae !== 0) && gt("segs", a, "lineSprings", Ce);
        const Se = [ee.qx, ee.qy, ee.qz];
        Se.some((Ae) => Ae !== 0) && gt("segs", a, "distLoad", Se), ee.massPerM !== 0 && gt("segs", a, "massPerM", ee.massPerM), oe(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (d) {
      const F = st.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      F.addBinding(ee, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), F.addBinding(ee, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), F.addBinding(ee, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), st.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ee, "surfLoad", { label: "q", step: 0.1 }), st.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        gt("areas", n, "shellType", ee.shellType), gt("areas", n, "thickness", ee.thickness), gt("areas", n, "material", ee.material_shell), ee.surfLoad !== 0 && gt("areas", n, "surfLoad", ee.surfLoad), oe(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (v) {
      const F = st.addFolder({ title: "\u2139 Selecci\xF3n" }), u = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      F.addBinding(u, "msg", { readonly: true, label: "" });
    }
    st.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      ke.clear(), Mt();
    }), Tt.style.display = "block", vs();
  };
  window.__hekatanRefreshPropsPane = Ms;
  let wn = null, Ln = false;
  g.addEventListener("pointerdown", (t) => {
    t.button === 2 && (wn = { x: t.clientX, y: t.clientY }, Ln = false);
  }), g.addEventListener("pointermove", (t) => {
    if (wn && t.buttons & 2 && !Ln) {
      const o = t.clientX - wn.x, a = t.clientY - wn.y;
      Math.hypot(o, a) > 8 && (Ln = true);
    }
  }), g.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = wn !== null && !Ln;
      wn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (It ? $n() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), ke.size > 0 && (ke.clear(), Mt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, s = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), oe(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : oe("\u238B Cancelado (click derecho)");
      }
    }
  }), g.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), g.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Ut = null, bn = false));
  }), g.addEventListener("pointermove", (t) => {
    if (It && t.buttons === 0) {
      const i = t.clientX < It.x;
      no(It.x, It.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Ut) return;
    const o = t.clientX - Ut.x, a = t.clientY - Ut.y, n = Math.hypot(o, a);
    if (!bn && n < 8) return;
    bn = true;
    const s = t.clientX < Ut.x;
    no(Ut.x, Ut.y, t.clientX, t.clientY, s);
  }), g.addEventListener("pointerup", (t) => {
    if (!Ut) return;
    if (!bn) {
      Ut = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    zo(Ut.x, Ut.y, t.clientX, t.clientY, o), Ut = null, bn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const Xt = new je();
  Xt.visible = false, Xt.frustumCulled = false, p.add(Xt);
  const Eo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478 }, Vo = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    for (; Xt.children.length; ) {
      const r = Xt.children.pop();
      (_b = (_a2 = r.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Eo[t] ?? 16777215, i = new Me().setFromPoints([new b(-1, -1, 0), new b(1, -1, 0), new b(1, -1, 0), new b(1, 1, 0), new b(1, 1, 0), new b(-1, 1, 0), new b(-1, 1, 0), new b(-1, -1, 0)]);
    Xt.add(new Kt(i, new ct({ color: s, linewidth: 2 }))), Xt.position.set(o, a, n), Xt.visible = true, so();
  };
  let oo = 4;
  const so = () => {
    Xt.visible && Xt.scale.setScalar(oo * Tn(Xt.position));
  };
  window.__hekatanOsnapMarkerRef = Xt, window.__hekatanUpdateOsnapScale = so, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (oo = t, so(), x()), oo);
  const In = () => {
    Xt.visible = false;
  }, bs = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Gt = document.createElement("div");
  Gt.id = "hk-osnap-etiqueta", Gt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Gt);
  const _s = (t, o, a) => {
    const n = bs[t];
    if (!n) {
      Gt.style.display = "none";
      return;
    }
    Gt.textContent = n, Gt.style.color = "#" + (Eo[t] ?? 16777215).toString(16).padStart(6, "0"), Gt.style.left = o + 18 + "px", Gt.style.top = a - 26 + "px", Gt.style.display = "block";
  }, Ss = () => {
    Gt.style.display = "none";
  }, ks = (t, o, a, n) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const s = window.__hekatanOsnap, i = e.points.rawVal, r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let d = null;
    const v = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, m = (P, C, y, z) => {
      const q = Math.hypot(C - t, y - o, z - a);
      if (q > n) return;
      const D = v[P] ?? 9;
      (!d || D < d.r || D === d.r && q < d.d) && (d = { type: P, x: C, y, z, d: q, r: D });
    };
    if (s.ori !== false && m("ori", 0, 0, 0), s.grid !== false && window.__hekatanSnapEnabled === true) {
      const P = window.__hekatanGridConfig, C = (P == null ? void 0 : P.minorStep) && P.minorStep > 0 ? P.minorStep : 1, y = ((P == null ? void 0 : P.gridSize) ?? 30) / 2, z = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", q = (Q) => Math.round(Q / C) * C, D = (Q, R) => Math.abs(Q) <= y + 1e-9 && Math.abs(R) <= y + 1e-9;
      if (z === "xz") {
        const Q = q(t), R = q(a);
        D(Q, R) && m("grid", Q, o, R);
      } else if (z === "yz") {
        const Q = q(o), R = q(a);
        D(Q, R) && m("grid", t, Q, R);
      } else {
        const Q = q(t), R = q(o);
        D(Q, R) && m("grid", Q, R, a);
      }
    }
    (s.node || s.end) && i.forEach((P) => {
      s.node && m("node", P[0], P[1], P[2]);
    });
    for (const P of r) if (!(P.length < 2)) for (let C = 0; C < P.length - 1; C++) {
      const y = i[P[C]], z = i[P[C + 1]];
      if (!(!y || !z) && (s.end && (m("end", y[0], y[1], y[2]), m("end", z[0], z[1], z[2])), s.mid && m("mid", (y[0] + z[0]) / 2, (y[1] + z[1]) / 2, (y[2] + z[2]) / 2), s.nea || s.per)) {
        const q = z[0] - y[0], D = z[1] - y[1], Q = z[2] - y[2], R = q * q + D * D + Q * Q;
        if (R < 1e-12) continue;
        const O = Math.max(0, Math.min(1, ((t - y[0]) * q + (o - y[1]) * D + (a - y[2]) * Q) / R)), Ce = y[0] + O * q, Se = y[1] + O * D, Ae = y[2] + O * Q;
        s.nea && m("nea", Ce, Se, Ae), s.per && m("per", Ce, Se, Ae);
      }
    }
    if (s.cen) {
      const P = ((_e2 = e.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const C of P) {
        const y = r[C];
        if (!y || y.length < 3) continue;
        const z = y[0] === y[y.length - 1] ? y.slice(0, -1) : y;
        let q = 0, D = 0, Q = 0, R = 0;
        for (const O of z) {
          const Ce = i[O];
          Ce && (q += Ce[0], D += Ce[1], Q += Ce[2], R++);
        }
        R >= 3 && m("cen", q / R, D / R, Q / R);
      }
    }
    if (s.cen) {
      const P = Vn(), C = [...un];
      for (const y of P) C.some((z) => Math.hypot(z.c[0] - y.c[0], z.c[1] - y.c[1], z.c[2] - y.c[2]) < 1e-6 && Math.abs(z.r - y.r) < 1e-6) || C.push(y);
      for (const y of C) {
        if (!i.some((D) => Math.abs(Math.hypot(D[0] - y.c[0], D[1] - y.c[1], D[2] - y.c[2]) - y.r) < 1e-6)) continue;
        const q = Math.hypot(t - y.c[0], o - y.c[1], a - y.c[2]);
        if (q < n || Math.abs(q - y.r) < n) {
          const D = Math.min(q, n * 0.5), Q = 3;
          (!d || Q < d.r || Q === d.r && D < d.d) && (d = { type: "cen", x: y.c[0], y: y.c[1], z: y.c[2], d: D, r: Q });
        }
      }
    }
    if (s.int) {
      const P = [];
      for (const C of r) for (let y = 0; y < C.length - 1; y++) {
        const z = i[C[y]], q = i[C[y + 1]];
        if (!z || !q) continue;
        const D = q[0] - z[0], Q = q[1] - z[1], R = q[2] - z[2], O = D * D + Q * Q + R * R;
        if (O < 1e-12) continue;
        const Ce = Math.max(0, Math.min(1, ((t - z[0]) * D + (o - z[1]) * Q + (a - z[2]) * R) / O));
        Math.hypot(z[0] + Ce * D - t, z[1] + Ce * Q - o, z[2] + Ce * R - a) < 3 * n && P.push([z, q]);
      }
      for (let C = 0; C < P.length; C++) for (let y = C + 1; y < P.length; y++) {
        const [z, q] = P[C], [D, Q] = P[y], R = [q[0] - z[0], q[1] - z[1], q[2] - z[2]], O = [Q[0] - D[0], Q[1] - D[1], Q[2] - D[2]], Ce = [z[0] - D[0], z[1] - D[1], z[2] - D[2]], Se = R[0] * R[0] + R[1] * R[1] + R[2] * R[2], Ae = R[0] * O[0] + R[1] * O[1] + R[2] * O[2], Re = O[0] * O[0] + O[1] * O[1] + O[2] * O[2], Ke = R[0] * Ce[0] + R[1] * Ce[1] + R[2] * Ce[2], tt = O[0] * Ce[0] + O[1] * Ce[1] + O[2] * Ce[2], dt = Se * Re - Ae * Ae;
        if (dt < 1e-12) continue;
        const rt = (Ae * tt - Re * Ke) / dt, ft = (Se * tt - Ae * Ke) / dt;
        if (rt < -1e-6 || rt > 1 + 1e-6 || ft < -1e-6 || ft > 1 + 1e-6) continue;
        const Pe = [z[0] + rt * R[0], z[1] + rt * R[1], z[2] + rt * R[2]], He = [D[0] + ft * O[0], D[1] + ft * O[1], D[2] + ft * O[2]];
        if (Math.hypot(Pe[0] - He[0], Pe[1] - He[1], Pe[2] - He[2]) > 1e-4) continue;
        [z, q, D, Q].some((we) => Math.hypot(we[0] - Pe[0], we[1] - Pe[1], we[2] - Pe[2]) < 1e-6) || m("int", Pe[0], Pe[1], Pe[2]);
      }
    }
    const _ = window.__hekatanAxisGrids ?? [], F = window.__hekatanLevels ?? [], u = _.filter((P) => P && P.start && P.end).map((P) => [P.start, P.end]);
    for (const [P, C] of u) {
      s.end && (m("end", P[0], P[1], P[2]), m("end", C[0], C[1], C[2]));
      const y = C[0] - P[0], z = C[1] - P[1], q = C[2] - P[2], D = y * y + z * z + q * q;
      if (D < 1e-12) continue;
      const Q = Math.max(0, Math.min(1, ((t - P[0]) * y + (o - P[1]) * z + (a - P[2]) * q) / D));
      if (s.nea && m("nea", P[0] + Q * y, P[1] + Q * z, P[2] + Q * q), s.int && Math.abs(q) > 1e-9) for (const R of F) {
        const O = (R.z - P[2]) / q;
        O < -1e-6 || O > 1 + 1e-6 || m("int", P[0] + O * y, P[1] + O * z, R.z);
      }
    }
    if (s.int || s.node) for (let P = 0; P < u.length; P++) for (let C = P + 1; C < u.length; C++) {
      const [y, z] = u[P], [q, D] = u[C], Q = z[0] - y[0], R = z[1] - y[1], O = D[0] - q[0], Ce = D[1] - q[1], Se = Q * Ce - R * O;
      if (Math.abs(Se) < 1e-12) continue;
      const Ae = y[0] - q[0], Re = y[1] - q[1], Ke = (O * Re - Ce * Ae) / Se, tt = (Q * Re - R * Ae) / Se;
      if (Ke < -1e-6 || Ke > 1 + 1e-6 || tt < -1e-6 || tt > 1 + 1e-6) continue;
      const dt = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      m("int", y[0] + Ke * Q, y[1] + Ke * R, typeof dt == "number" ? dt : a);
    }
    const E = window.__hekatanDrawingAuxLines, te = (E == null ? void 0 : E.rawVal) ?? (E == null ? void 0 : E.val) ?? E ?? [];
    for (const P of te) {
      if (P.length !== 6) continue;
      const C = [P[0], P[1], P[2]], y = [P[3], P[4], P[5]];
      if (s.end && (m("end", C[0], C[1], C[2]), m("end", y[0], y[1], y[2])), s.mid && m("mid", (C[0] + y[0]) / 2, (C[1] + y[1]) / 2, (C[2] + y[2]) / 2), s.nea || s.per) {
        const z = y[0] - C[0], q = y[1] - C[1], D = y[2] - C[2], Q = z * z + q * q + D * D;
        if (Q < 1e-12) continue;
        const R = Math.max(0, Math.min(1, ((t - C[0]) * z + (o - C[1]) * q + (a - C[2]) * D) / Q)), O = C[0] + R * z, Ce = C[1] + R * q, Se = C[2] + R * D;
        s.nea && m("nea", O, Ce, Se), s.per && m("per", O, Ce, Se);
      }
    }
    return d ? { type: d.type, x: d.x, y: d.y, z: d.z } : null;
  }, yn = new je();
  yn.frustumCulled = false, p.add(yn);
  const To = new ct({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let $o = 0;
  const Lo = () => {
    var _a2, _b;
    for (const t of yn.children.slice()) yn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    Lo();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of t || []) {
      const i = String(s).split(":");
      let r = [];
      if (i[0] === "pt") {
        const m = o[+i[1]];
        m && (r = [m, [m[0] + 1e-3, m[1], m[2]]]);
      } else if (i[0] === "seg") {
        const m = a[+i[1]] || [], _ = o[m[+i[2]]], F = o[m[+i[2] + 1]];
        _ && F && (r = [_, F]);
      } else i[0] === "poly" && (r = (a[+i[1]] || []).map((_) => o[_]).filter(Boolean));
      if (r.length < 2) continue;
      const d = new Me().setFromPoints(r.map((m) => new b(m[0], m[1], m[2]))), v = new _t(d, To);
      v.renderOrder = 1200, yn.add(v);
    }
    if (!yn.children.length) return;
    $o = performance.now() + 900;
    const n = () => {
      const s = $o - performance.now();
      if (s <= 0) {
        Lo(), x();
        return;
      }
      To.opacity = Math.min(1, s / 900) * 0.95, x(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = ks, window.__hekatanOsnapShow = Vo, window.__hekatanOsnapHide = In;
  let Ve = [], mt = 0, on = 0, bt = null;
  const Sn = document.createElement("div");
  Sn.id = "hk-cad-status", Sn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", Sn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(Sn);
  const Ps = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), Ie && t.push(`\u{1F512} LOCK ${Ie.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && t.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, oe = (t) => {
    var _a2;
    const o = t + Ps();
    Sn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Cs = "Comando:", zs = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], n = Ve.length, s = (i, r = []) => ({ txt: i, ops: r });
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
        return s(bt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${on > 0 ? ` (distancia ${on} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return s(Cs);
    }
  }, Rt = () => {
    var _a2, _b, _c, _d, _e2;
    try {
      const t = zs(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !a ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, s, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Rt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    oe(o);
  }, window.__hekatanCadResetPending = () => {
    Ve = [], fe = [], W.visible = false, ao(), bt = null, x(), oe("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Rt();
  };
  function ao() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = ao;
  const xn = [], Rn = [], io = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Io = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ve = [], pe.visible = false, ut.visible = false, N();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x(), Rt();
  }, Bt = () => {
    xn.push(io()), xn.length > 100 && xn.shift(), Rn.length = 0;
  }, Bn = () => {
    const t = xn.pop();
    if (!t) {
      oe("\u21B6 Nada para deshacer");
      return;
    }
    Rn.push(io()), Io(t), oe(`\u21B6 Deshacer \u2014 quedan ${xn.length}`);
  }, Ro = () => {
    const t = Rn.pop();
    if (!t) {
      oe("\u21B7 Nada para rehacer");
      return;
    }
    xn.push(io()), Io(t), oe(`\u21B7 Rehacer \u2014 quedan ${Rn.length}`);
  };
  window.__hekatanPushUndo = Bt, window.__hekatanUndo = Bn, window.__hekatanRedo = Ro, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Ro());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e2;
    const o = t.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Bn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return oe("Cerrar necesita al menos tres puntos."), true;
      Bt(), e.polylines.val = [...n.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return lo(), oe(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Bn(), true;
      Bt();
      const i = s[s.length - 1], r = s.slice(0, -1), d = n.some((_, F) => F !== n.length - 1 && _.includes(i)) || r.includes(i);
      let v = e.points.rawVal, m = [...n.slice(0, -1), r];
      if (!d && i === v.length - 1 && (v = v.slice(0, -1), e.points.val = v), e.polylines.val = m, r.length) {
        const _ = v[r[r.length - 1]];
        _ && (X = [_[0], _[1], _[2]]);
      } else X = null, pe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return x(), oe(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Rt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Bn();
    }
  }, { capture: true });
  const lo = () => {
    Ve = [], bt = null, ao(), Ie = null, Ht(), pe.visible = false, ut.visible = false, N(), oe("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), x(), Rt();
  };
  window.__hekatanFinalizeDraw = lo;
  const Bo = () => {
    var _a2, _b, _c;
    Ve = [], fe = [], W.visible = false;
    let t = false;
    ke.size && (ke.clear(), Mt(), t = true), lo();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    oe(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), x(), Rt();
  };
  window.__hekatanEscapeCancel = Bo;
  const Do = () => {
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
  }, Xo = (t, o, a) => {
    var _a2;
    const n = Do();
    if (!n.size) return 0;
    Bt();
    const s = e.points.rawVal.map((i, r) => n.has(r) ? [i[0] + t, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Mt(), x(), n.size;
  };
  window.__hekatanMoveSelection = Xo;
  const No = (t, o) => {
    var _a2, _b, _c, _d, _e2;
    if (!ke.size) {
      oe(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Rt();
      return;
    }
    if (Ve.push(o), Ve.length === 1) {
      X = o, oe(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Rt();
      return;
    }
    const [a, n] = Ve, s = [n[0] - a[0], n[1] - a[1], n[2] - a[2]];
    Ve = [], pe.visible = false;
    let i = 0;
    t === "move" ? i = Xo(s[0], s[1], s[2]) : (i = Do().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), oe(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), t === "move" && (ke.clear(), Mt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Rt();
  };
  window.__hekatanPasoMoverCopiar = No;
  const Fs = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, en = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), ro = (t, o, a, n, s, i) => {
    const r = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], d = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], v = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], m = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], _ = r[0] * d[0] + r[1] * d[1] + r[2] * d[2], F = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], u = r[0] * v[0] + r[1] * v[1] + r[2] * v[2], E = d[0] * v[0] + d[1] * v[1] + d[2] * v[2], te = m * F - _ * _;
    if (te < 1e-12) return null;
    const P = (_ * E - F * u) / te, C = (m * E - _ * u) / te;
    if (!s && (P < -1e-6 || P > 1 + 1e-6) || !i && (C < -1e-6 || C > 1 + 1e-6)) return null;
    const y = [t[0] + P * r[0], t[1] + P * r[1], t[2] + P * r[2]], z = [a[0] + C * d[0], a[1] + C * d[1], a[2] + C * d[2]];
    return en(y, z) > 1e-4 ? null : y;
  }, As = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((n) => n === t).length, 0);
  }, Es = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Vs = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, n = e.points.rawVal, s = Es[t];
    if (!bt) {
      if (ve < 0) {
        oe(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      bt = { poly: ve, seg: Math.max(0, Je) }, oe(t === "offset" ? `DESFASE l\xEDnea #${bt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${on > 0 ? ` (${on} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Rt();
      return;
    }
    if (t === "offset") {
      const P = bt.poly, C = a[P];
      if (!C || C.length < 2) {
        bt = null, oe("DESFASE: esa polil\xEDnea no tiene tramos."), Rt();
        return;
      }
      const y = C.length > 2 && C[0] === C[C.length - 1], z = Fs(), q = [];
      for (let Pe = 0; Pe < C.length - 1; Pe++) {
        const He = n[C[Pe]], at = n[C[Pe + 1]], we = [at[0] - He[0], at[1] - He[1], at[2] - He[2]], Te = Math.hypot(we[0], we[1], we[2]) || 1, nt = we[0] / Te, Vt = we[1] / Te, $t = we[2] / Te, Nt = [z[1] * $t - z[2] * Vt, z[2] * nt - z[0] * $t, z[0] * Vt - z[1] * nt], Jt = Math.hypot(Nt[0], Nt[1], Nt[2]) || 1;
        q.push({ a: He, b: at, n: [Nt[0] / Jt, Nt[1] / Jt, Nt[2] / Jt] });
      }
      let D = 0, Q = 1 / 0;
      q.forEach((Pe, He) => {
        const at = Qt(o[0], o[1], o[2], Pe.a[0], Pe.a[1], Pe.a[2], Pe.b[0], Pe.b[1], Pe.b[2]);
        at < Q && (Q = at, D = He);
      });
      const R = q[D], O = Math.sign((o[0] - R.a[0]) * R.n[0] + (o[1] - R.a[1]) * R.n[1] + (o[2] - R.a[2]) * R.n[2]) || 1, Ce = on > 0 ? on : Q;
      if (Ce < 1e-6) {
        oe("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const Se = q.map((Pe) => ({ a: [Pe.a[0] + O * Ce * Pe.n[0], Pe.a[1] + O * Ce * Pe.n[1], Pe.a[2] + O * Ce * Pe.n[2]], b: [Pe.b[0] + O * Ce * Pe.n[0], Pe.b[1] + O * Ce * Pe.n[1], Pe.b[2] + O * Ce * Pe.n[2]] })), Ae = Se.length, Re = (Pe) => {
        const He = Se[(Pe - 1 + Ae) % Ae], at = Se[Pe % Ae];
        return ro(He.a, He.b, at.a, at.b, true, true) ?? at.a;
      }, Ke = [], tt = y ? Ae : Ae + 1;
      for (let Pe = 0; Pe < tt; Pe++) !y && Pe === 0 ? Ke.push(Se[0].a) : !y && Pe === Ae ? Ke.push(Se[Ae - 1].b) : Ke.push(Re(Pe));
      Bt();
      const dt = n.length;
      e.points.val = [...n, ...Ke];
      const rt = Ke.map((Pe, He) => dt + He);
      y && rt.push(dt);
      let ft = a.slice();
      ft.length && ft[ft.length - 1].length === 0 && (ft = ft.slice(0, -1)), e.polylines.val = [...ft, rt, []], bt = null, oe(`\u2713 Desfase a ${Ce.toFixed(2)} m \u2014 ${Ae} tramo${Ae === 1 ? "" : "s"} nuevo${Ae === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      x(), Rt();
      return;
    }
    let i = ve, r = Math.max(0, Je);
    if (i < 0 || i === bt.poly && r === bt.seg) {
      let C = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((y, z) => {
        for (let q = 0; q < y.length - 1; q++) {
          if (z === bt.poly && q === bt.seg) continue;
          const D = n[y[q]], Q = n[y[q + 1]];
          if (!D || !Q) continue;
          const R = Qt(o[0], o[1], o[2], D[0], D[1], D[2], Q[0], Q[1], Q[2]);
          R < C && (C = R, i = z, r = q);
        }
      }), i < 0) {
        oe(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const d = a[bt.poly], v = n[d[bt.seg]], m = n[d[bt.seg + 1]], _ = a[i], F = _[r], u = _[r + 1];
    if (!v || !m || F == null || u == null) {
      oe(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const E = n[F], te = n[u];
    if (t === "trim") {
      const P = ro(E, te, v, m, false, false);
      if (!P) {
        oe("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Bt();
      const C = n.length;
      e.points.val = [...n, P];
      const y = [..._.slice(0, r + 1), C, ..._.slice(r + 1)];
      e.polylines.val = a.map((q, D) => D === i ? y : q);
      const z = en(o, E) < en(o, te);
      An(i, z ? r : r + 1), oe(`\u2713 Recortado en (${P[0].toFixed(2)}, ${P[1].toFixed(2)}, ${P[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const P = ro(E, te, v, m, true, false);
      if (!P) {
        oe("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const y = en(o, E) < en(o, te) ? r : r + 1;
      if (y !== 0 && y !== _.length - 1) {
        oe("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const z = _[y];
      if (en(P, E) + en(P, te) < en(E, te) + 1e-6) {
        oe("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Bt(), As(z) > 1) {
        const D = n.length;
        e.points.val = [...n, P];
        const Q = _.slice();
        Q[y] = D, e.polylines.val = a.map((R, O) => O === i ? Q : R);
      } else e.points.val = n.map((D, Q) => Q === z ? P : D);
      oe(`\u2713 Alargada hasta (${P[0].toFixed(2)}, ${P[1].toFixed(2)}, ${P[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
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
    return ke.clear(), o >= 0 && ke.add(`poly:${o}`), Mt(), oe(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), ke.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    ke.clear();
    const a = /* @__PURE__ */ new Set();
    return t.forEach((n, s) => {
      !n || n.length < 2 || (ke.add(`poly:${s}`), n.forEach((i) => a.add(i)));
    }), o.forEach((n, s) => {
      a.has(s) || ke.add(`pt:${s}`);
    }), Mt(), oe(`SELECCI\xD3N ${ke.size} objetos (todo el modelo) \xB7 Esc suelta`), ke.size;
  }, window.__hekatanReplicateSelection = (t, o, a, n, s = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...ke], r = e.points.rawVal, d = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], v = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), m = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), F = [];
    if (i.forEach((C) => {
      if (C.startsWith("pt:")) {
        const y = +C.slice(3);
        r[y] && m.add(y);
      } else if (C.startsWith("poly:")) {
        const y = +C.slice(5);
        if (!d[y] || d[y].length < 2) return;
        _.add(y), d[y].forEach((z) => m.add(z));
      } else if (C.startsWith("seg:")) {
        const y = C.split(":"), z = +y[1], q = +y[2], D = d[z] || [], Q = D[q], R = D[q + 1];
        Q != null && R != null && (F.push([Q, R]), m.add(Q), m.add(R));
      }
    }), !m.size) return 0;
    Bt();
    const u = [...r];
    let E = d.slice();
    E.length && E[E.length - 1].length === 0 && (E = E.slice(0, -1));
    const te = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], P = [...m];
    for (let C = 1; C <= n; C++) {
      const y = s + C, z = t * y, q = o * y, D = a * y, Q = /* @__PURE__ */ new Map();
      P.forEach((R) => {
        Q.set(R, u.length), u.push([r[R][0] + z, r[R][1] + q, r[R][2] + D]);
      }), _.forEach((R) => {
        const O = d[R].map((Se) => Q.has(Se) ? Q.get(Se) : Se), Ce = E.length;
        E.push(O), v.has(R) && te.push(Ce);
      }), F.forEach(([R, O]) => {
        E.push([Q.get(R), Q.get(O)]);
      });
    }
    E.push([]), e.points.val = u, e.polylines && (e.polylines.val = E), e.areas && (e.areas.val = te);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return x(), n;
  }, g.addEventListener("click", (t) => {
    var _a2, _b;
    if (nn > 5) {
      nn = 0;
      return;
    }
    nn = 0;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    const a = ie();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(c.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), r = a[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(s * 12, 300)) {
        oe("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = a[0].point;
    (t.ctrlKey || t.metaKey) && (n = new b(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = s[s.length - 1] ?? [], r = e.points.rawVal ?? [];
      if (i.length > 0) {
        const d = r[i[i.length - 1]];
        if (d) {
          const v = !!window.__hekatanOrthoMode;
          let m = Ie;
          if (!m && v) {
            const _ = Math.abs(n.x - d[0]), F = Math.abs(n.y - d[1]), u = Math.abs(n.z - d[2]);
            m = _ >= F && _ >= u ? "x" : F >= u ? "y" : "z";
          }
          m === "x" ? n = new b(n.x, d[1], d[2]) : m === "y" ? n = new b(d[0], n.y, d[2]) : m === "z" && (n = new b(d[0], d[1], n.z));
        }
      }
    }
    if (Ot) n = Ot.clone(), oe(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const s = eo(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n = new b(i.x, i.y, i.z), oe(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0;
        r && d > 0 && (n = new b(Math.round(n.x / d) * d, Math.round(n.y / d) * d, Math.round(n.z / d) * d));
      }
    }
    Yo(n, t);
  });
  const Yo = (t, o) => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (ht) {
        It && $n();
        const { kind: n, a: s, b: i } = ht, r = i !== void 0 ? `${n}:${s}:${i}` : `${n}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || ke.clear(), ke.has(r) ? ke.delete(r) : ke.add(r), Mt(), oe(`\u2713 Seleccionados ${ke.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        It ? (zo(It.x, It.y, s, i, n), It = null) : n || (It = { x: s, y: i }, oe("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), no(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], oe(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], s);
      oe(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      No(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "delete") {
      if (Qe >= 0) {
        const n = window.__hekatanDrawingAuxLines, s = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = Qe;
        if (i >= 0 && i < s.length) {
          Bt();
          const r = s.slice(0, i).concat(s.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = r : window.__hekatanDrawingAuxLines = r, oe(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Qe = -1, Ee.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (ve >= 0) {
        const n = ve, s = Je;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (pn(n), oe(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : s >= 0 ? (An(n, s), oe(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${n + 1} borrado`)) : (pn(n), oe(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else oe("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        oe("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, s] = Ve, i = Math.hypot(s[0] - n[0], s[1] - n[1], s[2] - n[2]);
      Math.abs(s[0] - n[0]);
      const r = Math.abs(s[1] - n[1]), v = Math.abs(s[2] - n[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", m = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, m, v), oe(`\u2713 C\xEDrculo dibujado en ${v.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${m} segmentos`), Ve = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        oe("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ve.length === 2) {
        oe("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, s, i] = Ve, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, s, i, r), oe(`\u2713 Arco dibujado \u2014 ${r} segmentos`), Ve = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        oe("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ve;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, s), oe(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ve = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        oe("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ve;
      (_n2 = window.__hekatanDrawRectArea) == null ? void 0 : _n2.call(window, n, s), oe(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ve = [];
      return;
    }
    if (a === "polyarea") {
      fe.push([t.x, t.y, t.z]), W.geometry.setFromPoints(fe.map((n) => new b(n[0], n[1], n[2]))), W.visible = fe.length >= 1, oe(`\u25B0 \xC1rea libre \u2014 ${fe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), x();
      return;
    }
    if (a === "plane3") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length < 3) {
        oe(`\u25E3 Plano inclinado \u2014 punto ${Ve.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, s, i] = Ve, r = (_o2 = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _o2.call(window, n, s, i);
      oe(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ve = [];
      return;
    }
    if (a === "col") {
      Bt();
      const n = t.z, s = mt && mt > 0 ? mt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + s]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], mt = 0, oe(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        oe("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, s] = Ve, i = mt && mt > 0 ? mt : 3;
      Bt();
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [n[0], n[1], n[2] + i]];
      const d = e.polylines.rawVal;
      if (d.length - 1, e.polylines.val = [...d.slice(0, -1), ...d[d.length - 1].length > 0 ? [d[d.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const v = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, v];
      }
      oe(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ve = [], mt = 0;
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Bt();
      const n = mt && mt > 0 ? mt : 3, s = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, s], [t.x, t.y, s + n]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], mt = 0, oe(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_r = window.__hekatanRebuild) == null ? void 0 : _r.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = rn(t.x, t.y, t.z, n);
      if (!s) {
        oe("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, r = e.points.rawVal, d = i[s.polyIdx], v = r[d[s.segIdx]], m = r[d[s.segIdx + 1]];
      if (!v || !m) {
        oe("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const _ = mt && mt > 0 ? mt : 3;
      Bt();
      const F = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [v[0], v[1], v[2]], [m[0], m[1], m[2]], [m[0], m[1], m[2] + _], [v[0], v[1], v[2] + _]];
      const u = e.polylines.rawVal;
      if (e.polylines.val = [...u.slice(0, -1), ...u[u.length - 1].length > 0 ? [u[u.length - 1]] : [], [F, F + 1, F + 2, F + 3, F], []], e.areas) {
        const E = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, E];
      }
      mt = 0, oe(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${_.toFixed(2)}m`);
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
      oe(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        oe("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, s] = Ve, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const _ = i.rawVal ?? i.val ?? [];
        i.val = [..._, [n[0], n[1], n[2], s[0], s[1], s[2]]];
      }
      const r = s[0] - n[0], d = s[1] - n[1], v = s[2] - n[2], m = Math.sqrt(r * r + d * d + v * v);
      oe(`\u2713 L\xEDnea auxiliar creada \u2014 L=${m.toFixed(2)}m (cyan, no FEM)`), Ve = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      Vs(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "chaflan") {
      if (Ve.push([t.x, t.y, t.z]), Ve.length === 1) {
        oe("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ve, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_t2 = window.__hekatanDrawSlabChaflan) == null ? void 0 : _t2.call(window, n, s, i, r, 6);
      const d = Math.abs(s[0] - n[0]).toFixed(1), v = Math.abs(s[1] - n[1]).toFixed(1);
      oe(`\u2713 Losa con chaflanes dibujada \u2014 ${d}\xD7${v}m, r=${i}m, ${r} seg/chafl\xE1n`), Ve = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if ($ = false, Bt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, s = n.length - 1, i = n[s] ?? [];
      if (a === "line" && i.length >= 2) {
        oe(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), oe("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") oe(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (a === "line") oe("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") oe("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const n = ((_x = e.polylines) == null ? void 0 : _x.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      oe(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  g.addEventListener("click", () => Rt()), g.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && fe.length >= 3) {
      t.preventDefault();
      const a = fn();
      oe(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), g.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    const a = ie();
    if (be.geometry.deleteAttribute("position"), a.length) {
      let n = a[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const r = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], d = r[r.length - 1] ?? [], v = e.points.rawVal ?? [];
        if (d.length > 0) {
          const m = v[d[d.length - 1]];
          if (m) {
            const _ = !!window.__hekatanOrthoMode;
            let F = Ie;
            if (!F && _) {
              const u = Math.abs(n.x - m[0]), E = Math.abs(n.y - m[1]), te = Math.abs(n.z - m[2]);
              F = u >= E && u >= te ? "x" : E >= te ? "y" : "z";
            }
            F === "x" ? n.set(n.x, m[1], m[2]) : F === "y" ? n.set(m[0], n.y, m[2]) : F === "z" && n.set(m[0], m[1], n.z);
          }
        }
      }
      const s = eo(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s);
      if (i) n.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, d = window.__hekatanSnap2D ?? 0.5;
        r && d > 0 && (n.x = Math.round(n.x / d) * d, n.y = Math.round(n.y / d) * d, n.z = Math.round(n.z / d) * d);
      }
      be.geometry.setAttribute("position", new vt(n.toArray(), 3));
    }
    x();
  }), g.addEventListener("pointermove", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    let a = false;
    const n = S.intersectObject(j), s = ie();
    if (n.length && s.length) {
      const i = new b(...e.points.rawVal[n[0].index]), r = new b(...s[0].point), d = i.sub(r), v = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      v.transformDirection(G.matrixWorld), Math.abs(d.dot(v)) < 1e-4 && (a = true);
    }
    be.visible = !a;
  });
  let co = false, po;
  g.addEventListener("pointermove", (t) => {
    var _a2;
    if (!nn) return;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    let a = false;
    const n = S.intersectObject(j), s = ie();
    if (n.length && s.length) {
      const r = new b(...e.points.rawVal[n[0].index]), d = new b(...s[0].point), v = r.sub(d), m = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      m.transformDirection(G.matrixWorld), Math.abs(v.dot(m)) < 1e-4 && (a = true);
    }
    if (a && nn < 5 && (co = true, c.enabled = false, po = n[0].index), !co || nn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (po !== void 0) {
      let r = s[0].point;
      (t.ctrlKey || t.metaKey) && (r = new b(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[po] = r.toArray();
    }
    e.points.val = i;
  }), g.addEventListener("pointerup", () => {
    c.enabled = true, co = false;
  }), g.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    S.setFromCamera(A, o);
    let a = false;
    const n = S.intersectObject(j), s = ie();
    if (n.length && s.length) {
      const d = new b(...e.points.rawVal[n[0].index]), v = new b(...s[0].point), m = d.sub(v), _ = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      _.transformDirection(G.matrixWorld), Math.abs(m.dot(_)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((d) => d.filter((v) => v !== n[0].index)).map((d) => d.map((v) => v > n[0].index ? v - 1 : v)).filter((d) => d.length);
    r.push([]), e.polylines.val = r;
  });
}
function ba(e, l, p) {
  const w = Math.round(14.999999999999998), f = { position: e.position.clone(), quaternion: e.quaternion.clone() }, g = setInterval(S, 1e3 / 30);
  let x = 0;
  function S() {
    x++;
    const A = x / w;
    e.position.lerpVectors(f.position, l.position, A), e.quaternion.slerpQuaternions(f.quaternion, l.quaternion, A), p && p(), x == w && clearInterval(g);
  }
}
function _a(e, l, p, h) {
  const c = ea(p, e.elements, h);
  return H.derive(() => {
    c.visible = l.shellResults.val != "none";
  }), c;
}
const Sa = 6, vo = 10, ka = 0.012;
function Pa(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ca(e, l, p, h) {
  if (!p && !h) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && p) {
    const w = p[e];
    if (w && w.has(l)) return w.get(l);
  }
  return null;
}
function za(e, l, p, h) {
  const c = new je(), w = new us();
  w.setColorMap("rainbow");
  const f = new Zt(), g = H.state([]);
  return H.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const x = p.val, S = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], A = Pa(l.frameResults.val);
    if (c.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), c.clear(), !A || S.length === 0 || x.length === 0) {
      g.val = [];
      return;
    }
    const M = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, G = (_c = e.deformOutputs) == null ? void 0 : _c.val, le = [], ce = [];
    for (let L = 0; L < S.length; L++) {
      if (S[L].length !== 2) continue;
      const ue = Ca(A, L, M, G);
      ue && (le.push(ue[0], ue[1]), ce.push({ idx: L, vals: ue }));
    }
    if (le.length === 0) {
      g.val = [];
      return;
    }
    const ae = Math.min(...le), V = Math.max(...le);
    w.setMin(ae), w.setMax(V), g.val = le;
    const ie = [1 / 0, 1 / 0, 1 / 0], j = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of x) for (let ne = 0; ne < 3; ne++) ie[ne] = Math.min(ie[ne], L[ne]), j[ne] = Math.max(j[ne], L[ne]);
    const ye = Math.max(j[0] - ie[0], j[1] - ie[1], j[2] - ie[2], 1) * ka, U = [], X = [], K = [];
    let $ = 0;
    for (const { idx: L, vals: ne } of ce) {
      const ue = S[L], re = x[ue[0]], se = x[ue[1]];
      if (!re || !se) continue;
      const B = new b(se[0] - re[0], se[1] - re[1], se[2] - re[2]), pe = B.length();
      if (pe < 1e-10) continue;
      B.normalize();
      const W = Math.abs(B.y) < 0.99 ? new b(0, 1, 0) : new b(1, 0, 0), fe = new b().crossVectors(B, W).normalize(), he = new b().crossVectors(B, fe).normalize(), $e = vo + 1, _e = Sa;
      for (let De = 0; De < $e; De++) {
        const Oe = De / vo, ut = re[0] + B.x * pe * Oe, Ft = re[1] + B.y * pe * Oe, k = re[2] + B.z * pe * Oe, I = ne[0] + (ne[1] - ne[0]) * Oe, J = w.getColor(I) ?? new Zt(0, 0, 0);
        f.copy(J).convertSRGBToLinear();
        for (let Y = 0; Y < _e; Y++) {
          const de = Y / _e * Math.PI * 2, me = Math.cos(de), xe = Math.sin(de);
          U.push(ut + (fe.x * me + he.x * xe) * ye, Ft + (fe.y * me + he.y * xe) * ye, k + (fe.z * me + he.z * xe) * ye), X.push(f.r, f.g, f.b);
        }
      }
      for (let De = 0; De < vo; De++) for (let Oe = 0; Oe < _e; Oe++) {
        const ut = (Oe + 1) % _e, Ft = $ + De * _e + Oe, k = $ + De * _e + ut, I = $ + (De + 1) * _e + Oe, J = $ + (De + 1) * _e + ut;
        K.push(Ft, k, J), K.push(Ft, J, I);
      }
      $ += $e * _e;
    }
    if (U.length === 0) return;
    const T = new Me();
    T.setAttribute("position", new vt(U, 3)), T.setAttribute("color", new vt(X, 3)), T.setIndex(K), T.computeVertexNormals();
    const Z = new it({ vertexColors: true, side: kt }), N = new et(T, Z);
    N.frustumCulled = false, c.add(N);
  }), c.__colorMapValues = g, c;
}
function Fa() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Aa = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Ea = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Va = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function wt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Ta = 16755200, ss = 56831, $a = 56831, La = 56831, Un = 65382;
function Ia(e) {
  const l = new je();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const p = new gn(1, 16, 16), h = new it({ color: Ta, transparent: true, opacity: 0.85, depthTest: false }), c = new et(p, h);
  c.visible = false, c.renderOrder = 100, l.add(c);
  const w = new Me(), f = new ct({ color: ss, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), g = new Kt(w, f);
  g.visible = false, g.renderOrder = 100, l.add(g);
  const x = new it({ color: ss, transparent: true, opacity: 0.7, depthTest: false }), S = new et(new jo(1, 1, 1, 12), x);
  S.visible = false, S.renderOrder = 100, l.add(S);
  const A = new Me(), M = new it({ color: $a, transparent: true, opacity: 0.45, side: kt, depthTest: false }), G = new et(A, M);
  G.visible = false, G.renderOrder = 100, l.add(G);
  const le = new Me(), ce = new ct({ color: La, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), ae = new Kt(le, ce);
  ae.visible = false, ae.renderOrder = 100, l.add(ae);
  const V = new it({ color: Un, transparent: true, opacity: 0.95, depthTest: false }), ie = new it({ color: Un, transparent: true, opacity: 0.85, depthTest: false }), j = new jo(1, 1, 1, 12), be = new it({ color: Un, transparent: true, opacity: 0.55, side: kt, depthTest: false }), ye = new ct({ color: Un, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), U = [];
  window.__hekatanModelSelection = U;
  const X = new je();
  X.renderOrder = 101, l.add(X);
  const K = document.createElement("div");
  Object.assign(K.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), K.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(K);
  }, 0);
  function $(k) {
    const I = e.derivedNodes.rawVal;
    return !I || k < 0 || k >= I.length ? null : new b(I[k][0], I[k][1], I[k][2]);
  }
  function T(k, I) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s;
    const J = e.getActiveCamera();
    if (!J || !e.mesh) return null;
    const Y = e.rendererElm.getBoundingClientRect(), de = k - Y.left, me = I - Y.top, xe = e.derivedNodes.rawVal, ge = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!xe || !ge) return null;
    const Xe = /* @__PURE__ */ new Map(), ze = (Ge) => {
      if (Xe.has(Ge)) return Xe.get(Ge);
      const Ye = $(Ge);
      if (!Ye) return Xe.set(Ge, null), null;
      const Fe = Ye.clone().project(J), Ee = (Fe.x * 0.5 + 0.5) * Y.width, ve = (-Fe.y * 0.5 + 0.5) * Y.height, Je = { x: Ee, y: ve, z: Fe.z };
      return Xe.set(Ge, Je), Je;
    }, Ne = /* @__PURE__ */ new Set();
    for (const Ge of ge) if (Ge) for (const Ye of Ge) Ne.add(Ye);
    const Le = 8;
    let Ze = -1, lt = Le;
    for (let Ge = 0; Ge < xe.length; Ge++) {
      if (!Ne.has(Ge)) continue;
      const Ye = ze(Ge);
      if (!Ye || Ye.z < -1 || Ye.z > 1) continue;
      const Fe = Ye.x - de, Ee = Ye.y - me, ve = Math.sqrt(Fe * Fe + Ee * Ee);
      ve < lt && (lt = ve, Ze = Ge);
    }
    const We = Fa(), ot = Ea[We.dispUnit] ?? 1e3, Ie = Aa[We.forceUnit] ?? 1;
    if (Ze >= 0) {
      const Ge = xe[Ze];
      let Ye = `Nodo ${Ze}
(${Ge[0].toFixed(3)}, ${Ge[1].toFixed(3)}, ${Ge[2].toFixed(3)})`;
      const Fe = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Fe == null ? void 0 : Fe.deformations) {
        const Ee = Fe.deformations.get(Ze);
        if (Ee && (Ye += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ye += `
Ux = ${wt(Ee[0] * ot, 3)} ${We.dispUnit}`, Ye += `
Uy = ${wt(Ee[1] * ot, 3)} ${We.dispUnit}`, Ye += `
Uz = ${wt(Ee[2] * ot, 3)} ${We.dispUnit}`, (Math.abs(Ee[3]) > 1e-9 || Math.abs(Ee[4]) > 1e-9 || Math.abs(Ee[5]) > 1e-9) && (Ye += `
Rx = ${wt(Ee[3] * 1e3, 3)} mrad`, Ye += `
Ry = ${wt(Ee[4] * 1e3, 3)} mrad`, Ye += `
Rz = ${wt(Ee[5] * 1e3, 3)} mrad`)), Fe.reactions) {
          const ve = Fe.reactions.get(Ze);
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
    const Ot = 5;
    let qe = -1, Ht = Ot, Dt = "frame";
    for (let Ge = 0; Ge < ge.length; Ge++) {
      const Ye = ge[Ge];
      if (!(!Ye || Ye.length < 2)) {
        if (Ye.length === 2) {
          const Fe = ze(Ye[0]), Ee = ze(Ye[1]);
          if (!Fe || !Ee || Fe.z < -1 || Fe.z > 1 || Ee.z < -1 || Ee.z > 1) continue;
          const ve = Ra(de, me, Fe.x, Fe.y, Ee.x, Ee.y);
          ve < Ht && (Ht = ve, qe = Ge, Dt = "frame");
        } else if (Ye.length === 3 || Ye.length === 4) {
          const Fe = [];
          let Ee = true;
          for (const ve of Ye) {
            const Je = ze(ve);
            if (!Je || Je.z < -1 || Je.z > 1) {
              Ee = false;
              break;
            }
            Fe.push(Je);
          }
          if (!Ee) continue;
          if (Ba(de, me, Fe)) {
            const Je = Fe.reduce((Qe, ke) => Qe + ke.z, 0) / Fe.length * 1e-3;
            Je < Ht && (Ht = Je, qe = Ge, Dt = "shell");
          }
        } else if (Ye.length === 8) {
          const Fe = [];
          let Ee = true;
          for (const Be of Ye) {
            const Ue = ze(Be);
            if (!Ue || Ue.z < -1 || Ue.z > 1) {
              Ee = false;
              break;
            }
            Fe.push(Ue);
          }
          if (!Ee) continue;
          const ve = Math.min(...Fe.map((Be) => Be.x)), Je = Math.max(...Fe.map((Be) => Be.x)), Qe = Math.min(...Fe.map((Be) => Be.y)), ke = Math.max(...Fe.map((Be) => Be.y));
          if (de >= ve && de <= Je && me >= Qe && me <= ke) {
            const Ue = Fe.reduce((yt, Pt) => yt + Pt.z, 0) / Fe.length * 1e-3;
            Ue < Ht && (Ht = Ue, qe = Ge, Dt = "solid");
          }
        }
      }
    }
    if (qe >= 0) {
      const Ge = ge[qe];
      let Fe = `${Dt === "frame" ? "Frame" : Dt === "shell" ? "Shell" : "Solid"} ${qe}`;
      const Ee = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, ve = (_g = (_f = Ee == null ? void 0 : Ee.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, qe);
      if (ve) {
        ve.name && (Fe += `
  \u{1F4CB} ${ve.name}`), ve.shape && (Fe += `
  Shape: ${ve.shape}`);
        const Je = /concrete|hormig|rect.*sólida/i.test(ve.shape || ""), Qe = Je ? 100 : 1e3, ke = Je ? "cm" : "mm", Be = (yt) => {
          const Pt = yt * Qe;
          return Math.abs(Pt - Math.round(Pt)) < 0.05 ? `${Math.round(Pt)}` : `${Pt.toFixed(1)}`;
        }, Ue = [];
        if (ve.D != null && Ue.push(`D=${Be(ve.D)}`), ve.B != null && Ue.push(`B=${Be(ve.B)}`), ve.TF != null && Ue.push(`TF=${Be(ve.TF)}`), ve.TW != null && Ue.push(`TW=${Be(ve.TW)}`), ve.t != null && Ue.push(`t=${Be(ve.t)}`), Ue.length && (Fe += `
  Dim: ${Ue.join(" ")} ${ke}`), ve.material) {
          let yt = ve.material;
          ve.fillMaterial && (yt += ` + FILL "${ve.fillMaterial}"`), Fe += `
  Mat: ${yt}`;
        }
      } else {
        const Je = (_i = (_h = Ee == null ? void 0 : Ee.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, qe), Qe = (_k = (_j = Ee == null ? void 0 : Ee.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, qe);
        Je ? (Fe += `
  ${Je}`, Qe && !Je.includes(Qe) && (Fe += `  (${Qe})`)) : Qe && (Fe += `
  Material: ${Qe}`);
      }
      if (Fe += `
nodos: [${Ge.join(", ")}]`, Dt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Je = e.mesh.analyzeOutputs.rawVal, Qe = Va[We.stressUnit] ?? 1, ke = [["bendingXX", "Mxx", Ie, `${We.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ie, `${We.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ie, `${We.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ie, `${We.forceUnit}/m`], ["membraneYY", "Nyy", Ie, `${We.forceUnit}/m`], ["membraneXY", "Nxy", Ie, `${We.forceUnit}/m`], ["shearX", "Qx", Ie, `${We.forceUnit}/m`], ["shearY", "Qy", Ie, `${We.forceUnit}/m`], ["vonMises", "\u03C3VM", Qe, We.stressUnit], ["pressure", "p", Qe, We.stressUnit]], Be = [];
        for (const [Ue, yt, Pt, Ct] of ke) {
          const Yt = Je == null ? void 0 : Je[Ue];
          if (Yt && Yt instanceof Map) {
            const ht = Yt.get(qe);
            if (ht != null) {
              if (typeof ht == "number") Be.push(`${yt} = ${wt(ht * Pt, 3)} ${Ct}`);
              else if (Array.isArray(ht)) {
                let At = ht[0];
                for (const Mt of ht) Math.abs(Mt) > Math.abs(At) && (At = Mt);
                Be.push(`${yt} = ${wt(At * Pt, 3)} ${Ct}`);
              }
            }
          }
        }
        Be.length > 0 && (Fe += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Be.slice(0, 8).join(`
`));
      }
      if (Dt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Je = e.mesh.deformOutputs.rawVal, Qe = e.mesh.elementInputs.rawVal, ke = Je == null ? void 0 : Je.deformations;
        if (ke && Ge.length === 2) {
          const Be = ke.get(Ge[0]), Ue = ke.get(Ge[1]), yt = xe[Ge[0]], Pt = xe[Ge[1]];
          if (Be && Ue && yt && Pt) {
            const Ct = Pt[0] - yt[0], Yt = Pt[1] - yt[1], ht = Pt[2] - yt[2], At = Math.sqrt(Ct * Ct + Yt * Yt + ht * ht);
            if (At > 1e-9) {
              const Mt = Ct / At, Qt = Yt / At, rn = ht / At, cn = (Ue[0] - Be[0]) * Mt + (Ue[1] - Be[1]) * Qt + (Ue[2] - Be[2]) * rn, dn = ((_n = Qe.elasticities) == null ? void 0 : _n.get(qe)) ?? 0, Jn = ((_o2 = Qe.areas) == null ? void 0 : _o2.get(qe)) ?? 0, pn = ((_p = Qe.momentsOfInertiaY) == null ? void 0 : _p.get(qe)) ?? 0, An = ((_q = Qe.momentsOfInertiaZ) == null ? void 0 : _q.get(qe)) ?? 0, un = ((_r = Qe.torsionalConstants) == null ? void 0 : _r.get(qe)) ?? 0, En = ((_s = Qe.shearModuli) == null ? void 0 : _s.get(qe)) ?? dn / 2.6, vn = dn * Jn * (cn / At), Vn = (Ue[3] - Be[3]) * Mt + (Ue[4] - Be[4]) * Qt + (Ue[5] - Be[5]) * rn, fn = En * un * (Vn / At), Lt = Ue[4] - Be[4], qt = Ue[5] - Be[5], Wt = dn * pn * Lt / At, jt = dn * An * qt / At;
              Fe += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Fe += `
L = ${wt(At, 3)} m`, Fe += `
\u0394L = ${wt(cn * ot, 3)} ${We.dispUnit}`, Fe += `
\u03B5 = ${wt(cn / At, 6)}`, Math.abs(vn) > 1e-6 && (Fe += `
N \u2248 ${wt(vn * Ie)} ${We.forceUnit}`), Math.abs(fn) > 1e-6 && (Fe += `
T \u2248 ${wt(fn * Ie)} ${We.forceUnit}\xB7m`), Math.abs(Wt) > 1e-6 && (Fe += `
My \u2248 ${wt(Wt * Ie)} ${We.forceUnit}\xB7m`), Math.abs(jt) > 1e-6 && (Fe += `
Mz \u2248 ${wt(jt * Ie)} ${We.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: Dt, idx: qe, info: Fe };
    }
    return null;
  }
  function Z(k, I, J) {
    var _a2, _b, _c;
    if (c.visible = false, g.visible = false, S.visible = false, G.visible = false, ae.visible = false, !k || !e.mesh) {
      K.style.display = "none", e.render();
      return;
    }
    const Y = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (k.type === "node") {
      const ge = $(k.idx);
      if (ge) {
        const Xe = e.derivedNodes.rawVal ?? [];
        let ze = 1;
        if (Xe.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], lt = [-1 / 0, -1 / 0, -1 / 0];
          for (const We of Xe) for (let ot = 0; ot < 3; ot++) We[ot] < Ze[ot] && (Ze[ot] = We[ot]), We[ot] > lt[ot] && (lt[ot] = We[ot]);
          ze = Math.max(lt[0] - Ze[0], lt[1] - Ze[1], lt[2] - Ze[2], 0.1);
        }
        const Ne = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Le = 0.021 * ze * Ne;
        c.position.copy(ge), c.scale.setScalar(Le), c.visible = true;
      }
    } else if (k.type === "frame" && Y) {
      const ge = Y[k.idx], Xe = $(ge[0]), ze = $(ge[1]);
      if (Xe && ze) {
        const Ne = Xe.clone().add(ze).multiplyScalar(0.5), Le = ze.clone().sub(Xe), Ze = Le.length(), ot = e.getActiveCamera().position.distanceTo(Ne) * 35e-4;
        S.position.copy(Ne);
        const Ie = new b(0, 1, 0), Ot = Ie.clone().cross(Le).normalize(), qe = Ie.angleTo(Le);
        S.quaternion.setFromAxisAngle(Ot, qe), S.scale.set(ot, Ze, ot), S.visible = true;
      }
    } else if (k.type === "shell" && Y) {
      const ge = Y[k.idx], Xe = [], ze = [];
      for (const Ne of ge) {
        const Le = $(Ne);
        if (!Le) return;
        Xe.push(Le.x, Le.y, Le.z);
      }
      ge.length === 4 ? ze.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && ze.push(0, 1, 2), A.setAttribute("position", new vt(Xe, 3)), A.setIndex(ze), A.computeVertexNormals(), G.visible = true;
    } else if (k.type === "solid" && Y) {
      const ge = Y[k.idx], Xe = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ze = [];
      for (const [Ne, Le] of Xe) {
        const Ze = $(ge[Ne]), lt = $(ge[Le]);
        Ze && lt && ze.push(Ze.x, Ze.y, Ze.z, lt.x, lt.y, lt.z);
      }
      le.setAttribute("position", new vt(ze, 3)), ae.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      K.style.display = "none", e.render();
      return;
    }
    K.textContent = k.info, K.style.whiteSpace = "pre-line", K.style.display = "block";
    const me = e.rendererElm.getBoundingClientRect(), xe = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? me;
    K.style.left = `${I - xe.left}px`, K.style.top = `${J - xe.top}px`, e.render();
  }
  let N = "", L = 0, ne = 0;
  const ue = window.__hekatanHoverDebug ?? false, re = (k) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const I = T(k.clientX, k.clientY);
      if (ue && ne < 5) {
        const Y = e.derivedNodes.rawVal, de = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${k.clientX}, ${k.clientY}) nodes=${(Y == null ? void 0 : Y.length) ?? 0} elems=${(de == null ? void 0 : de.length) ?? 0} hover=`, I), ne++;
      }
      const J = I ? `${I.type}:${I.idx}` : "";
      if (J !== N) N = J, Z(I, k.clientX, k.clientY);
      else if (I) {
        const Y = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        K.style.left = `${k.clientX - Y.left}px`, K.style.top = `${k.clientY - Y.top}px`;
      }
    });
  };
  let se = null;
  const B = () => {
    N = "", c.visible = false, g.visible = false, S.visible = false, G.visible = false, ae.visible = false, K.style.display = "none", e.render();
  }, pe = (k) => {
    const I = e.rendererElm.getBoundingClientRect(), J = k.clientX - I.left, Y = k.clientY - I.top;
    (J < -2 || Y < -2 || J > I.width + 2 || Y > I.height + 2) && (se && clearTimeout(se), se = window.setTimeout(B, 200));
  }, W = () => {
    se && (clearTimeout(se), se = null);
  };
  e.rendererElm.addEventListener("pointermove", re), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", W);
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
    const I = k.clientX - he.x, J = k.clientY - he.y;
    if (he = null, I * I + J * J > 9 || !fe()) return;
    const Y = T(k.clientX, k.clientY);
    Y ? (ut({ type: Y.type, idx: Y.idx }, k.shiftKey), Oe()) : Ft();
  }), window.addEventListener("keydown", (k) => {
    if (k.key !== "Escape" || !U.length) return;
    const I = document.activeElement, J = !!I && (I.id === "hk3-cmd-input" || I.id === "hk-dyn-input") && I.value === "";
    I && (I.tagName === "INPUT" || I.tagName === "TEXTAREA" || I.isContentEditable) && !J || Ft();
  }, { capture: true });
  function $e() {
    for (const k of X.children.slice()) {
      X.remove(k);
      const I = k.geometry;
      I && I !== p && I !== j && I.dispose();
    }
  }
  const _e = (k) => {
    var _a2;
    const I = e.getActiveCamera(), J = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return I.isOrthographicCamera ? (I.top - I.bottom) / (I.zoom || 1) / J : 2 * I.position.distanceTo(k) * Math.tan((I.fov || 50) * Math.PI / 180 / 2) / J;
  };
  function De(k, I) {
    var _a2, _b;
    const J = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (k.type === "node") {
      const Y = $(k.idx);
      if (!Y) return;
      const de = new et(p, V);
      de.position.copy(Y), de.scale.setScalar(Math.max(1e-4, 7 * _e(Y))), de.renderOrder = 101, X.add(de);
    } else if (k.type === "frame" && J) {
      const Y = J[k.idx], de = $(Y[0]), me = $(Y[1]);
      if (!de || !me) return;
      const xe = de.clone().add(me).multiplyScalar(0.5), ge = me.clone().sub(de), Xe = ge.length(), ze = e.getActiveCamera().position.distanceTo(xe), Ne = new et(j, ie);
      Ne.position.copy(xe);
      const Le = new b(0, 1, 0);
      Ne.quaternion.setFromAxisAngle(Le.clone().cross(ge).normalize(), Le.angleTo(ge)), Ne.scale.set(ze * 35e-4, Xe, ze * 35e-4), Ne.renderOrder = 101, X.add(Ne);
    } else if (k.type === "shell" && J) {
      const Y = J[k.idx], de = [], me = [];
      for (const Xe of Y) {
        const ze = $(Xe);
        if (!ze) return;
        de.push(ze.x, ze.y, ze.z);
      }
      Y.length === 4 ? me.push(0, 1, 2, 0, 2, 3) : Y.length === 3 && me.push(0, 1, 2);
      const xe = new Me();
      xe.setAttribute("position", new vt(de, 3)), xe.setIndex(me), xe.computeVertexNormals();
      const ge = new et(xe, be);
      ge.renderOrder = 101, X.add(ge);
    } else if (k.type === "solid" && J) {
      const Y = J[k.idx], de = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], me = [];
      for (const [Xe, ze] of de) {
        const Ne = $(Y[Xe]), Le = $(Y[ze]);
        Ne && Le && me.push(Ne.x, Ne.y, Ne.z, Le.x, Le.y, Le.z);
      }
      const xe = new Me();
      xe.setAttribute("position", new vt(me, 3));
      const ge = new Kt(xe, ye);
      ge.renderOrder = 101, X.add(ge);
    }
  }
  function Oe() {
    if ($e(), !U.length || !e.mesh) {
      e.render();
      return;
    }
    const k = e.derivedNodes.rawVal ?? [];
    if (k.length >= 2) {
      const I = [1 / 0, 1 / 0, 1 / 0], J = [-1 / 0, -1 / 0, -1 / 0];
      for (const Y of k) for (let de = 0; de < 3; de++) Y[de] < I[de] && (I[de] = Y[de]), Y[de] > J[de] && (J[de] = Y[de]);
      Math.max(J[0] - I[0], J[1] - I[1], J[2] - I[2], 0.1);
    }
    for (const I of U) De(I);
    e.render();
  }
  function ut(k, I) {
    const J = U.findIndex((Y) => Y.type === k.type && Y.idx === k.idx);
    J >= 0 ? U.splice(J, 1) : I || U.push(k), U.length && U[U.length - 1];
  }
  function Ft() {
    U.length = 0, Oe();
  }
  return H.derive(() => {
    e.derivedNodes.val, U.length && Oe();
  }), l;
}
function Ra(e, l, p, h, c, w) {
  const f = c - p, g = w - h, x = f * f + g * g;
  if (x < 1e-9) {
    const ce = e - p, ae = l - h;
    return Math.sqrt(ce * ce + ae * ae);
  }
  let S = ((e - p) * f + (l - h) * g) / x;
  S = Math.max(0, Math.min(1, S));
  const A = p + S * f, M = h + S * g, G = e - A, le = l - M;
  return Math.sqrt(G * G + le * le);
}
function Ba(e, l, p) {
  let h = false;
  for (let c = 0, w = p.length - 1; c < p.length; w = c++) {
    const f = p[c].x, g = p[c].y, x = p[w].x, S = p[w].y;
    g > l != S > l && e < (x - f) * (l - g) / (S - g + 1e-12) + f && (h = !h);
  }
  return h;
}
function as(e, l = 8) {
  const p = document.createElement("div");
  p.id = "legend", p.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    H.derive(() => {
      Hn.val, p.style.background = js();
    });
  });
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", p.appendChild(h), setTimeout(() => {
    H.derive(() => {
      h.textContent = bo.val ? `[${bo.val}]` : "";
    });
  });
  const c = Array.from({ length: l + 1 }, (x, S) => S / l).reverse();
  let w, f;
  c.forEach((x, S) => {
    w = document.createElement("div"), w.id = `marker-${S}`, w.className = "marker", w.style.marginTop = S == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", f = document.createElement("p"), f.id = `marker-text-${S}`, w.append(f), p.append(w);
  });
  const g = [];
  return p.querySelectorAll("p").forEach((x) => g.push(x)), setTimeout(() => {
    H.derive(() => {
      c.forEach((x, S) => {
        const A = g[S];
        A && (A.innerText = Da(e.val, x).toString());
      });
    });
  }), p;
}
function Da(e, l) {
  const p = Fn.val;
  if (p) return is(p[0] + l * (p[1] - p[0]));
  const h = e.filter((f) => Number.isFinite(f));
  if (h.length === 0) return "0";
  const [c, w] = So(h);
  return is(c + l * (w - c));
}
function is(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function Oa({ mesh: e, settingsObj: l, drawingObj: p, objects3D: h, solids: c }) {
  Js.DEFAULT_UP = new b(0, 0, 1);
  const w = document.createElement("div"), f = new Ks(), g = new Gs(45, 1, 0.1, 2 * 1e6), x = new Hs(-10, 10, 10, -10, -1e3, 2e6);
  let S = g;
  const A = new Ws({ antialias: true });
  A.localClippingEnabled = true;
  const M = new es(g, A.domElement);
  M.enableDamping = true, M.dampingFactor = 0.1, M.screenSpacePanning = true, M.zoomSpeed = 0.8, M.panSpeed = 1.2, M.rotateSpeed = 0.9, M.keyPanSpeed = 12, M.listenToKeyEvents(window), M.touches = { ONE: Nn.ROTATE, TWO: Nn.DOLLY_PAN }, A.domElement.addEventListener("wheel", (k) => {
    if (!k.ctrlKey && Math.abs(k.deltaX) > Math.abs(k.deltaY) * 1.5) {
      k.preventDefault();
      const I = M.target, J = new b().subVectors(g.position, I), Y = new b();
      Y.crossVectors(g.up, J).normalize();
      const me = J.length() * 1e-3 * M.panSpeed;
      I.addScaledVector(Y, k.deltaX * me), g.position.addScaledVector(Y, k.deltaX * me), M.update();
    }
  }, { passive: false });
  const G = new yo(new b(-1, 0, 0), 0), le = new yo(new b(0, -1, 0), 0), ce = new yo(new b(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function ae() {
    const k = window.__hekatanClip, I = [];
    k.enableX && (G.normal.set(k.invertX ? 1 : -1, 0, 0), G.constant = k.invertX ? -k.posX : k.posX, I.push(G)), k.enableY && (le.normal.set(0, k.invertY ? 1 : -1, 0), le.constant = k.invertY ? -k.posY : k.posY, I.push(le)), k.enableZ && (ce.normal.set(0, 0, k.invertZ ? 1 : -1), ce.constant = k.invertZ ? -k.posZ : k.posZ, I.push(ce)), A.clippingPlanes = I, f.traverse((Y) => {
      const de = Y;
      if (de.material) {
        const me = Array.isArray(de.material) ? de.material : [de.material];
        for (const xe of me) xe.clippingPlanes = I, xe.needsUpdate = true;
      }
    });
    const J = window.__hekatanPanes ?? [];
    for (const Y of J) try {
      Y && typeof Y.refresh == "function" && Y.refresh();
    } catch {
    }
    A.render(f, S);
  }
  ae(), window.__hekatanClipApply = ae;
  const V = na(l), ie = H.derive(() => Math.pow(10, V.displayScale.val / 10)), j = Xa(e, V), be = () => {
    const k = [];
    return V.gridXY.rawVal && k.push("xy"), V.gridXZ.rawVal && k.push("xz"), V.gridYZ.rawVal && k.push("yz"), k;
  }, ye = () => {
    const k = V.gridStep.rawVal, I = Math.max(k, V.gridMajor.rawVal);
    return { planes: be(), majorStep: I, minorStep: k };
  };
  let U = go(V.gridSize.rawVal, ye());
  U.visible = V.gridVisible.rawVal, window.__hekatanSnap2D = V.cursorSnap.rawVal;
  const X = () => {
    const k = Math.max(0, Math.min(1, V.gridOpacity.rawVal));
    U.traverse((I) => {
      const J = I.material;
      if (!J || !("opacity" in J)) return;
      const Y = I.name ?? "";
      let de = 0.55;
      Y.includes("border") ? de = 1 : Y.includes("major") && (de = 0.95), J.opacity = k * de;
    });
  };
  X(), w.appendChild(ta(V, e, c)), w.setAttribute("id", "viewer"), w.appendChild(A.domElement), A.setPixelRatio(window.devicePixelRatio);
  const K = ln();
  A.setClearColor(K.background, 1);
  const $ = V.gridSize.rawVal, T = $ * 0.5 + $ * 0.5 / Math.tan(45 * 0.5);
  g.position.set(0, 0, T), g.up.set(0, 1, 0), M.target.set(0, 0, 0), M.minDistance = 0.1, M.maxDistance = 1e4, w.__settings = V, M.zoomSpeed = 1, M._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, M.update();
  let Z = ns(V.gridSize.rawVal, V.flipAxes.rawVal);
  f.add(U, Z), H.derive(() => {
    window.__hekatanGridPlaneXY = V.gridXY.val, window.__hekatanGridPlaneXZ = V.gridXZ.val, window.__hekatanGridPlaneYZ = V.gridYZ.val;
  });
  let N = true;
  H.derive(() => {
    const k = V.gridVisible.val;
    if (N) {
      N = false;
      return;
    }
    U.visible = k, W();
  });
  let L = true;
  H.derive(() => {
    if (V.gridOpacity.val, L) {
      L = false;
      return;
    }
    X(), W();
  }), H.derive(() => {
    const k = V.cursorSnap.val;
    window.__hekatanSnap2D = k;
  });
  let ne = true;
  H.derive(() => {
    var _a2;
    const k = V.gridSize.val, I = V.flipAxes.val;
    if (V.gridXY.val, V.gridXZ.val, V.gridYZ.val, V.gridStep.val, V.gridMajor.val, ne) {
      ne = false;
      return;
    }
    f.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (de) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = de.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = de.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = go(k, ye()), U.visible = V.gridVisible.rawVal, f.add(U), X(), f.remove(Z), Z.traverse((de) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = de.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = de.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), Z = ns(k, I), f.add(Z);
    const J = k * 0.5 + k * 0.5 / Math.tan(45 * 0.5);
    g.position.distanceTo(M.target), Math.abs(g.position.x) < 0.1 && Math.abs(g.position.y) < 0.1 && g.position.z > 0 ? g.position.set(0, 0, J) : g.position.set(0.5 * k, -J, 0.5 * k), M.target.set(0, 0, 0), M.minDistance = Math.max(0.05, k * 0.01), M.maxDistance = Math.max(50, k * 50), M.update(), W();
  }), new ResizeObserver((k) => {
    var _a2, _b;
    for (const I of k) {
      const J = (_a2 = I.target) == null ? void 0 : _a2.clientWidth, Y = (_b = I.target) == null ? void 0 : _b.clientHeight;
      if (J === 0 || Y === 0) continue;
      const me = (re ? J / 2 : J) / Y;
      g.aspect = me, g.updateProjectionMatrix();
      const xe = x.top;
      if (x.left = -xe * me, x.right = xe * me, x.updateProjectionMatrix(), se && se.isPerspectiveCamera) se.aspect = me, se.updateProjectionMatrix();
      else if (se && se.isOrthographicCamera) {
        const ge = se, Xe = ge.top;
        ge.left = -Xe * me, ge.right = Xe * me, ge.updateProjectionMatrix();
      }
      A.setSize(J, Y), W();
    }
  }).observe(w), M.addEventListener("change", W), H.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e2 = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e2.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, V.displayScale.val, V.nodes.val, V.elements.val, (_g = V.edges) == null ? void 0 : _g.val, V.elemColumns.val, V.elemBeams.val, V.nodesIndexes.val, V.elementsIndexes.val, V.orientations.val, V.sections.val, V.secColumns.val, V.secBeams.val, V.secFloor.val, V.supports.val, V.loads.val, V.deformedShape.val, V.nodeResults.val, V.frameResults.val, V.shellResults.val, (_h = V.solidResults) == null ? void 0 : _h.val, (_i = V.extruded) == null ? void 0 : _i.val, setTimeout(W);
  });
  let re = false, se = null, B = null, pe = false;
  function W() {
    const k = w.clientWidth || 1, I = w.clientHeight || 1;
    if (!re || !se) {
      A.setScissorTest(false), A.setViewport(0, 0, k, I), A.render(f, S);
      return;
    }
    const J = k / 2;
    A.setScissorTest(true), A.setViewport(0, 0, J, I), A.setScissor(0, 0, J, I), A.render(f, S), A.setViewport(J, 0, J, I), A.setScissor(J, 0, J, I), A.render(f, se), A.setScissorTest(false);
  }
  function fe(k) {
    S = k, M.object = k, M.update(), W();
  }
  function he(k, I) {
    re = k, I && (se = I);
    const J = w.clientWidth || 1, Y = w.clientHeight || 1, me = (k ? J / 2 : J) / Y;
    g.isPerspectiveCamera && (g.aspect = me, g.updateProjectionMatrix());
    const xe = x.top;
    if (x.left = -xe * me, x.right = xe * me, x.updateProjectionMatrix(), k && se) {
      if (B ? (B.object = se, B.update()) : (B = new es(se, A.domElement), B.enableDamping = true, B.dampingFactor = 0.1, B.screenSpacePanning = true, B.zoomSpeed = 0.8, B.panSpeed = 1.2, B.rotateSpeed = 0.9, B.touches = { ONE: Nn.ROTATE, TWO: Nn.DOLLY_PAN }, B.target.copy(M.target), B.addEventListener("change", W), B.enabled = false), !pe) {
        const ge = (Xe) => {
          if (!re || !B) return;
          const ze = A.domElement.getBoundingClientRect(), Ne = Xe.clientX - ze.left, Le = ze.width / 2, Ze = Ne >= Le;
          M.enabled = !Ze, B.enabled = Ze;
        };
        A.domElement.addEventListener("pointerdown", ge, true), A.domElement.addEventListener("wheel", ge, { capture: true, passive: true }), pe = true;
      }
    } else k || (M.enabled = true, B && (B.enabled = false));
    w.__splitMode = k, window.__hekatanSplitMode = k, window.__hekatanSplitCamera = k ? se : null, W();
  }
  if (e) {
    f.add(oa(V, j, ie), Os(e, V, j), ia(V, j, ie), la(e, V, j, ie), sa(e, V, j, ie), aa(e, V, j, ie), da(e, V, j, ie), ua(e, V, j, ie), wa(e, V, j), va(e, V, j, ie), ya(e, V, j, ie));
    const k = Ia({ scene: f, rendererElm: A.domElement, getActiveCamera: () => S, derivedNodes: j, derivedDisplayScale: ie, mesh: e, settings: V, render: W });
    f.add(k);
    const I = Ka(e, V), J = _a(e, V, j, I), Y = as(I);
    f.add(J), w.appendChild(Y);
    const de = za(e, V, j);
    f.add(de);
    const me = de.__colorMapValues, xe = as(me);
    xe.id = "frame-legend", w.appendChild(xe), H.derive(() => {
      var _a2;
      const ge = V.shellResults.val != "none", Xe = (((_a2 = V.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", ze = ge || Xe, Ne = V.frameResults.val.startsWith("contour:"), Le = I.val.some((Ze) => Number.isFinite(Ze));
      Y.hidden = !ze || !Le, J.visible = ze, xe.hidden = !Ne;
    });
  }
  if (c) {
    const k = new ds(16777215, 0.5);
    f.add(k);
    const I = new Gn(16777215, 0.5);
    I.position.set(30, 25, -10), I.shadow.mapSize.width = 1024, I.shadow.mapSize.height = 1024, f.add(I);
    const J = 10;
    I.shadow.camera.left = -J, I.shadow.camera.right = J, I.shadow.camera.top = J, I.shadow.camera.bottom = -J, I.shadow.camera.far = 1e3;
    const Y = new Gn(16777215, 0.5);
    Y.color.setHSL(11, 43, 96), Y.position.set(-10, 0, 30), f.add(Y), H.derive(() => {
      (c == null ? void 0 : c.val.length) && (f.remove(...c.oldVal), f.add(...c.rawVal), W());
    }), H.derive(() => {
      c.rawVal.forEach((de) => de.visible = V.solids.val), W();
    });
  }
  if (h) {
    const k = [], I = (Y) => {
      var _a2;
      return ((_a2 = Y == null ? void 0 : Y.userData) == null ? void 0 : _a2.isCota) ? V.showCotas.val : V.custom3D.val;
    }, J = () => {
      for (const Y of k) Y.visible = I(Y);
      W();
    };
    H.derive(() => {
      const Y = h.val;
      k.length && (f.remove(...k), k.length = 0), Y.length && (f.add(...Y), k.push(...Y), J()), W();
    }), H.derive(() => {
      V.custom3D.val, J();
    }), H.derive(() => {
      V.showCotas.val, J();
    });
  }
  p && Ma({ drawingObj: p, gridObj: U, scene: f, getActiveCamera: () => S, controls: M, gridSize: $, derivedDisplayScale: ie, rendererElm: A.domElement, viewerRender: W }), rs((k, I) => {
    var _a2;
    A.setClearColor(I.background, 1), f.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (J) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = J.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = J.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), U = go(V.gridSize.rawVal, { planes: be() }), f.add(U), w.style.setProperty("--awatif-legend-color", I.legendMarker), W();
  });
  const $e = { scene: f, perspCamera: g, orthoCamera: x, get camera() {
    return S;
  }, controls: M, renderer: A, rendererElm: A.domElement, render: W, setActiveCamera: fe, setSplitMode: he, get splitMode() {
    return re;
  }, get splitCamera() {
    return se;
  }, settings: V };
  w.__ctx = $e;
  const _e = document.createElement("div");
  _e.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const De = (k, I, J) => {
    const Y = document.createElement("button");
    return Y.textContent = k, Y.title = I, Y.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), Y.onmouseenter = () => {
      Y.style.background = "rgba(70,70,70,0.9)";
    }, Y.onmouseleave = () => {
      Y.style.background = "rgba(40,40,40,0.85)";
    }, Y.onclick = (de) => {
      de.preventDefault(), J();
    }, Y;
  }, Oe = (k, I) => {
    const J = M.target, Y = new b().subVectors(S.position, J), de = Y.length(), me = new b(), xe = new b();
    me.crossVectors(S.up, Y).normalize(), xe.copy(S.up).normalize();
    const ge = de * 0.05;
    J.addScaledVector(me, -k * ge), J.addScaledVector(xe, I * ge), S.position.addScaledVector(me, -k * ge), S.position.addScaledVector(xe, I * ge), M.update(), W();
  }, ut = (k) => {
    const I = new b().subVectors(S.position, M.target);
    I.multiplyScalar(k), S.position.copy(M.target).add(I), M.update(), W();
  }, Ft = () => {
    const k = document.createElement("div");
    return k.style.cssText = "width:32px;height:32px;", k;
  };
  return _e.append(Ft()), _e.append(De("\u2191", "Pan arriba", () => Oe(0, 1))), _e.append(De("\u2295", "Zoom in", () => ut(0.85))), _e.append(De("\u2190", "Pan izquierda", () => Oe(-1, 0))), _e.append(De("\u2302", "Reset vista", () => {
    M.reset(), W();
  })), _e.append(De("\u2192", "Pan derecha", () => Oe(1, 0))), _e.append(De("\u2296", "Zoom out", () => ut(1.18))), _e.append(De("\u2193", "Pan abajo", () => Oe(0, -1))), _e.append(Ft()), getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(_e), w;
}
function Xa(e, l) {
  return H.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const p = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], h = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!h || p.length === 0) return p;
    const c = l.deformScale.val, w = l.deformScale.val * l.deformScaleZ.val, f = Number.isFinite(c) ? c : 1, g = Number.isFinite(w) ? w : 1;
    return p.map((x, S) => {
      var _a3;
      const A = ((_a3 = h.get(S)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], M = Number.isFinite(A[0]) ? A[0] : 0, G = Number.isFinite(A[1]) ? A[1] : 0, le = Number.isFinite(A[2]) ? A[2] : 0;
      return [x[0] + M * f, x[1] + G * f, x[2] + le * g];
    });
  });
}
const Fn = H.state(null), bo = H.state(""), Na = H.state("kN"), Ya = H.state("mm"), Ua = H.state("kN/m\xB2"), Za = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, ls = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, qa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function Ka(e, l) {
  const p = H.state([]);
  let h;
  return ((c) => {
    c.bendingXX = "bendingXX", c.bendingYY = "bendingYY", c.bendingXY = "bendingXY", c.membraneXX = "membraneXX", c.membraneYY = "membraneYY", c.membraneXY = "membraneXY", c.tranverseShearX = "tranverseShearX", c.tranverseShearY = "tranverseShearY", c.membranePrincipalMax = "membranePrincipalMax", c.membranePrincipalMin = "membranePrincipalMin", c.bendingPrincipalMax = "bendingPrincipalMax", c.bendingPrincipalMin = "bendingPrincipalMin", c.transverseShearMax = "transverseShearMax", c.vonMises = "vonMises", c.pressure = "pressure", c.displacementX = "displacementX", c.displacementY = "displacementY", c.displacementZ = "displacementZ";
  })(h || (h = {})), H.derive(() => {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o2, _p, _q, _r, _s, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const c = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), ce = (I, J) => {
      I == null ? void 0 : I.forEach((Y, de) => {
        const me = e.elements.val[de];
        if (me) for (let xe = 0; xe < me.length; xe++) J.set(me[xe], [Y[xe] ?? Y[0]]);
      });
    };
    ce((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, c), ce((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, w), ce((_f = (_e2 = e.analyzeOutputs) == null ? void 0 : _e2.val) == null ? void 0 : _f.bendingXY, f), ce((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, g), ce((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, x), ce((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, S), ce((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, A), ce((_p = (_o2 = e.analyzeOutputs) == null ? void 0 : _o2.val) == null ? void 0 : _p.tranverseShearY, M), ce((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, G), ce((_t2 = (_s = e.analyzeOutputs) == null ? void 0 : _s.val) == null ? void 0 : _t2.pressure, le);
    const ae = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), ye = (I, J, Y, de, me) => {
      I.forEach((xe, ge) => {
        var _a3, _b2;
        const Xe = xe[0] ?? 0, ze = ((_a3 = J.get(ge)) == null ? void 0 : _a3[0]) ?? 0, Ne = ((_b2 = Y.get(ge)) == null ? void 0 : _b2[0]) ?? 0, Le = (Xe + ze) / 2, Ze = Math.hypot((Xe - ze) / 2, Ne);
        de.set(ge, [Le + Ze]), me.set(ge, [Le - Ze]);
      });
    };
    ye(g, x, S, ae, V), ye(c, w, f, ie, j), A.forEach((I, J) => {
      var _a3;
      be.set(J, [Math.hypot(I[0] ?? 0, ((_a3 = M.get(J)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const U = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, X = (_w = l.solidResults) == null ? void 0 : _w.val, $ = X && X !== "none" ? X : l.shellResults.val, T = U == null ? void 0 : U[$], Z = { bendingXX: [c, 0], bendingYY: [w, 0], bendingXY: [f, 0], membraneXX: [g, 0], membraneYY: [x, 0], membraneXY: [S, 0], tranverseShearX: [A, 0], tranverseShearY: [M, 0], membranePrincipalMax: [ae, 0], membranePrincipalMin: [V, 0], bendingPrincipalMax: [ie, 0], bendingPrincipalMin: [j, 0], transverseShearMax: [be, 0], vonMises: [G, 0], pressure: [le, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, N = l.shellResults.val, L = Na.val, ne = Ya.val, ue = N === "displacementX" || N === "displacementY" || N === "displacementZ", re = N === "bendingXX" || N === "bendingYY" || N === "bendingXY" || N === "bendingPrincipalMax" || N === "bendingPrincipalMin", se = N === "membraneXX" || N === "membraneYY" || N === "membraneXY" || N === "membranePrincipalMax" || N === "membranePrincipalMin", B = N === "vonMises" || N === "pressure", pe = N === "tranverseShearX" || N === "tranverseShearY" || N === "transverseShearMax", W = (_D = l.solidResults) == null ? void 0 : _D.val, fe = W === "vonMises" || W === "sigmaXX" || W === "sigmaYY" || W === "sigmaZZ" || W === "tauXY" || W === "tauYZ" || W === "tauXZ", he = W === "ux" || W === "uy" || W === "uz", $e = Ua.val, _e = fe ? qa[$e] : he || ue ? ls[ne] : re || se || B || pe ? 1 / Za[L] : 1, De = fe ? $e : he || ue ? ne : re ? `${L}\xB7m/m` : se ? `${L}/m\xB2` : B ? `${L}/m\xB2` : pe ? `${L}/m` : "";
    bo.val = De, Fn.val = Array.isArray(T) && T.length === 2 ? [T[0] * _e, T[1] * _e] : null;
    const Oe = hs.val, Ft = W && W !== "none" ? [G, 0] : Z[N], k = [];
    if (e.nodes.val.forEach((I, J) => {
      const Y = Ft;
      if (!Y || !Y[0] || typeof Y[0].has != "function") return;
      if (!Y[0].has(J)) {
        k.push(Number.NaN);
        return;
      }
      const de = Y[0].get(J), me = de ? de[Y[1]] ?? 0 : 0;
      k.push(me * _e);
    }), !Fn.val && Oe !== "auto") {
      const I = e.nodes.val, J = /* @__PURE__ */ new Set(), Y = (me, xe) => {
        var _a3;
        const ge = (_a3 = I[me[0]]) == null ? void 0 : _a3[xe];
        return me.every((Xe) => {
          var _a4;
          return Math.abs((((_a4 = I[Xe]) == null ? void 0 : _a4[xe]) ?? NaN) - ge) < 1e-6;
        });
      };
      for (const me of e.elements.val) {
        if (me.length !== 4) continue;
        const xe = Y(me, 2), ge = !xe && Y(me, 0), Xe = !xe && Y(me, 1);
        if (Oe === "losas" ? xe : Oe === "muros" ? ge || Xe : Oe === "murosX" ? ge : Oe === "murosY" ? Xe : false) for (const Le of me) J.add(Le);
      }
      const de = [];
      for (const me of J) {
        const xe = k[me];
        Number.isFinite(xe) && de.push(xe);
      }
      de.length && (Fn.val = So(de));
    }
    p.val = k;
  }), p;
}
export {
  ea as a,
  as as b,
  Na as c,
  Ya as d,
  Ua as e,
  Oa as g
};
