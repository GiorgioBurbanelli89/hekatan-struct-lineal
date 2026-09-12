import { N as Ht, a6 as Gn, q as Gs, v as ee, a7 as Hs, D as At, M as lt, B as ze, F as Ct, a8 as Ws, x as yt, a9 as Js, aa as Os, h as as, ab as is, r as dn, ac as Qn, ad as jn, a4 as gs, _ as it, b as ht, L as Wt, w as vs, c as Qs, ae as js, f as ft, V as S, $ as cn, af as ko, H as no, d as Ft, a as So, Y as bs, Z as to, G as ea, z as Vn, A as ta, ag as eo, t as na, o as oa, I as en, a2 as Fn, E as ls, S as xn, m as Hn, ah as An, g as rs, i as cs, j as ds, C as ps, K as sa, U as aa, W as ia, X as la, T as Wn, P as Po, O as ra } from "./theme-DQ--CgsI.js";
import { T as Pt, O as us } from "./Text-ERv22veQ.js";
import { P as Ms } from "./tweakpane-BXg6ZhiP.js";
import { e as ca } from "./styles-0iLl92Fx.js";
class _s {
  constructor(l, r = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, r);
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
  setColorMap(l, r = 32) {
    this.map = Co[l] || Co.rainbow, this.n = r;
    const p = 1 / this.n, u = new Ht(), m = new Ht();
    this.lut.length = 0, this.lut.push(new Ht(this.map[0][1]));
    for (let y = 1; y < r; y++) {
      const b = y * p;
      for (let x = 0; x < this.map.length - 1; x++) if (b > this.map[x][0] && b <= this.map[x + 1][0]) {
        const k = this.map[x][0], F = this.map[x + 1][0];
        u.setHex(this.map[x][1], Gn), m.setHex(this.map[x + 1][1], Gn);
        const M = new Ht().lerpColors(u, m, (b - k) / (F - k));
        this.lut.push(M);
      }
    }
    return this.lut.push(new Ht(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = Gs.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const r = Math.round(l * this.n);
    return this.lut[r];
  }
  addColorMap(l, r) {
    return Co[l] = r, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const r = l.getContext("2d", { alpha: false }), p = r.getImageData(0, 0, 1, this.n), u = p.data;
    let m = 0;
    const y = 1 / this.n, b = new Ht(), x = new Ht(), k = new Ht();
    for (let F = 1; F >= 0; F -= y) for (let M = this.map.length - 1; M >= 0; M--) if (F < this.map[M][0] && F >= this.map[M - 1][0]) {
      const W = this.map[M - 1][0], ye = this.map[M][0];
      b.setHex(this.map[M - 1][1], Gn), x.setHex(this.map[M][1], Gn), k.lerpColors(b, x, (F - W) / (ye - W)), u[m * 4] = Math.round(k.r * 255), u[m * 4 + 1] = Math.round(k.g * 255), u[m * 4 + 2] = Math.round(k.b * 255), u[m * 4 + 3] = 255, m += 1;
    }
    return r.putImageData(p, 0, 0), l;
  }
}
const Co = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ks = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], da = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: ks, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, oo = ee.state("safe"), Ss = ee.state("auto");
function Ps(e) {
  e = Math.max(0, Math.min(1, e));
  const l = da[oo.val] ?? ks;
  for (let p = 0; p < l.length - 1; p++) {
    const [u, m, y, b] = l[p], [x, k, F, M] = l[p + 1];
    if (e <= x) {
      const W = (e - u) / (x - u);
      return [m + (k - m) * W, y + (F - y) * W, b + (M - b) * W];
    }
  }
  const r = l[l.length - 1];
  return [r[1], r[2], r[3]];
}
function fs() {
  const l = new Uint8Array(1024);
  for (let p = 0; p < 256; p++) {
    const u = p / 255, [m, y, b] = Ps(u);
    l[p * 4 + 0] = m, l[p * 4 + 1] = y, l[p * 4 + 2] = b, l[p * 4 + 3] = 255;
  }
  const r = new Js(l, 256, 1, Os);
  return r.minFilter = as, r.magFilter = as, r.wrapS = is, r.wrapT = is, r.needsUpdate = true, r;
}
function pa() {
  const l = [];
  for (let r = 0; r <= 12; r++) {
    const p = 1 - r / 12, [u, m, y] = Ps(p);
    l.push(`rgb(${u | 0},${m | 0},${y | 0}) ${(r / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function $o(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((m, y) => m - y), r = (m) => l[Math.min(l.length - 1, Math.max(0, Math.round(m * (l.length - 1))))];
  let p = l.length >= 20 ? r(0.01) : l[0], u = l.length >= 20 ? r(0.99) : l[l.length - 1];
  return p >= 0 && u > 0 && (p = 0), u <= 0 && p < 0 && (u = 0), [p, u];
}
function ua(e, l, r) {
  new _s();
  const p = fs(), u = new Hs({ uniforms: { cmap: { value: p }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: At, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  ee.derive(() => {
    var _a2;
    oo.val;
    const y = u.uniforms.cmap.value;
    u.uniforms.cmap.value = fs(), (_a2 = y == null ? void 0 : y.dispose) == null ? void 0 : _a2.call(y);
  });
  const m = new lt(new ze(), u);
  return m.renderOrder = -1, m.frustumCulled = false, m.userData.isShellArea = true, m.name = "__hekatan_shell_colormap", ee.derive(() => {
    m.geometry.setAttribute("position", new Ct(e.val.flat(), 3));
    const y = [], b = [], x = [];
    l.val.forEach((D, ie) => {
      D.length === 3 ? (y.push(D[0], D[1], D[2]), b.push(ie), x.push(0)) : D.length === 4 && (y.push(D[0], D[1], D[2]), y.push(D[0], D[2], D[3]), b.push(ie, ie), x.push(0, 1));
    }), m.geometry.setIndex(new Ws(y, 1)), m.userData.faceToElem = b, m.userData.faceLocal = x;
    const k = r.val.filter((D) => Number.isFinite(D));
    let F, M;
    const W = $n.val;
    if (W ? (M = W[0], F = W[1]) : [M, F] = $o(k), F === M) {
      const D = Math.max(Math.abs(F) * 1e-6, 1e-9);
      F += D, M -= D;
    }
    const ye = W && W[0] > W[1], be = Math.min(M, F), se = Math.max(M, F), R = se - be, oe = new Float32Array(r.val.length);
    for (let D = 0; D < r.val.length; D++) {
      const ie = r.val[D];
      if (!Number.isFinite(ie)) {
        oe[D] = -1;
        continue;
      }
      const B = ((ye ? se + be - ie : ie) - be) / R;
      oe[D] = Math.max(0, Math.min(1, B));
    }
    m.geometry.setAttribute("scalar", new yt(oe, 1));
  }), m;
}
function fa(e, l, r) {
  const p = document.createElement("div"), u = new Ms({ title: "Settings", expanded: true, container: p });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(u), p.setAttribute("id", "settings");
  const m = "hk_settingsPos";
  let y = null;
  try {
    const M = localStorage.getItem(m);
    M && (y = JSON.parse(M));
  } catch {
  }
  p.style.cssText = ["position:fixed", y ? `left:${y.left}px` : "left:8px", y ? `top:${y.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const b = () => {
    const M = p.querySelector(".tp-rotv_b");
    if (!M) {
      setTimeout(b, 200);
      return;
    }
    M.style.cursor = "move", M.style.userSelect = "none";
    let W = false, ye = 0, be = 0, se = 0, R = 0;
    M.addEventListener("mousedown", (oe) => {
      W = true, ye = oe.clientX, be = oe.clientY;
      const D = p.getBoundingClientRect();
      se = D.left, R = D.top, p.style.left = `${se}px`, p.style.top = `${R}px`;
    }), window.addEventListener("mousemove", (oe) => {
      if (!W) return;
      const D = oe.clientX - ye, ie = oe.clientY - be, le = Math.max(0, Math.min(window.innerWidth - 40, se + D)), B = Math.max(0, Math.min(window.innerHeight - 40, R + ie));
      p.style.left = `${le}px`, p.style.top = `${B}px`;
    }), window.addEventListener("mouseup", () => {
      if (W) {
        W = false;
        try {
          localStorage.setItem(m, JSON.stringify({ left: parseFloat(p.style.left), top: parseFloat(p.style.top) }));
        } catch {
        }
      }
    });
  };
  if (b(), l == null ? void 0 : l.nodes) {
    u.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const M = u.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    M.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), M.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), M.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), M.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const W = M.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    W.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), W.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), W.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), W.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), W.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ye = u.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ye.addBinding(e.nodes, "val", { label: "Nodes" }), ye.addBinding(e.elements, "val", { label: "Elements" }), ye.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ye.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ye.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ye.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ye.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ye.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ye.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ye.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ye.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ye.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ye.addBinding(e.orientations, "val", { label: "Orientations" }), ye.addBinding(e.sections, "val", { label: "Sections" }), ye.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ye.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ye.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ye.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ye.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const M = u.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    M.addBinding(e.supports, "val", { label: "Supports" }), M.addBinding(e.loads, "val", { label: "Loads" }), M.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), M.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const M = u.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = M, M.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), M.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), M.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), M.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), M.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), M.addBinding(oo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), M.addBinding(Ss, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), M.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), M.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), M.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), M.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  r && u.addBinding(e.solids, "val", { label: "Solids" });
  const x = u.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), k = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), F = () => {
    const M = window.__hekatanClipApply;
    typeof M == "function" && M();
  };
  return x.addBinding(k, "enableX", { label: "Cortar X" }).on("change", F), x.addBinding(k, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", F), x.addBinding(k, "invertX", { label: "  invertir X" }).on("change", F), x.addBinding(k, "enableY", { label: "Cortar Y" }).on("change", F), x.addBinding(k, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", F), x.addBinding(k, "invertY", { label: "  invertir Y" }).on("change", F), x.addBinding(k, "enableZ", { label: "Cortar Z" }).on("change", F), x.addBinding(k, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", F), x.addBinding(k, "invertZ", { label: "  invertir Z" }).on("change", F), p;
}
function ha(e) {
  return { gridSize: ee.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: ee.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: ee.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: ee.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: ee.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: ee.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: ee.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: ee.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: ee.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: ee.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: ee.state((e == null ? void 0 : e.nodes) ?? true), elements: ee.state((e == null ? void 0 : e.elements) ?? true), edges: ee.state((e == null ? void 0 : e.edges) ?? true), faces: ee.state((e == null ? void 0 : e.faces) ?? true), elemColumns: ee.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: ee.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: ee.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: ee.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: ee.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: ee.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: ee.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: ee.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: ee.state((e == null ? void 0 : e.orientations) ?? false), sections: ee.state((e == null ? void 0 : e.sections) ?? true), extruded: ee.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: ee.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: ee.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: ee.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: ee.state((e == null ? void 0 : e.secFloor) ?? -1), supports: ee.state((e == null ? void 0 : e.supports) ?? true), loads: ee.state((e == null ? void 0 : e.loads) ?? false), deformedShape: ee.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: ee.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: ee.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: ee.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: ee.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: ee.state((e == null ? void 0 : e.flipAxes) ?? false), solids: ee.state((e == null ? void 0 : e.solids) ?? true), custom3D: ee.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: ee.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: ee.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: ee.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function ma(e, l, r) {
  const p = dn(), u = new Qn(new ze(), new jn({ color: p.nodePoint }));
  return gs((m, y) => {
    u.material.color.setHex(y.nodePoint);
  }), u.frustumCulled = false, ee.derive(() => {
    e.nodes.val && u.geometry.setAttribute("position", new Ct(l.val.flat(), 3));
  }), ee.derive(() => {
    if (r.val, l.val, !e.nodes.rawVal) return;
    const m = l.rawVal ?? [];
    let y = e.gridSize.val * 0.5;
    if (m.length >= 2) {
      const x = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
      for (const F of m) for (let M = 0; M < 3; M++) x[M] = Math.min(x[M], F[M]), k[M] = Math.max(k[M], F[M]);
      y = Math.max(k[0] - x[0], k[1] - x[1], k[2] - x[2], 0.1);
    }
    const b = 0.03 * y;
    u.material.size = b * r.rawVal;
  }), ee.derive(() => {
    u.visible = e.nodes.val;
  }), u;
}
function zo(e, l) {
  const r = dn(), p = new it();
  p.name = "hekatan-grid";
  const u = (l == null ? void 0 : l.planes) ?? ["xy"];
  let m = (l == null ? void 0 : l.majorStep) ?? 1, y = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (m <= 0 && (m = 1), y <= 0 && (y = 0.1); e / y > 500; ) y *= 2;
  for (; e / m > 100; ) m *= 2;
  const b = e / 2;
  m = Math.max(y, Math.round(m / y) * y);
  const k = new Ht(r.grid).multiplyScalar(1.3), F = new Ht(r.grid).multiplyScalar(0.8), M = (se, R, oe, D) => {
    const ie = [], le = se === "xy" ? (E, Y) => [E, Y, 0] : se === "xz" ? (E, Y) => [E, 0, Y] : (E, Y) => [0, E, Y], B = Math.floor(b / R);
    for (let E = -B; E <= B; E++) {
      const Y = E * R, I = le(Y, -b), V = le(Y, b);
      ie.push(...I, ...V);
    }
    for (let E = -B; E <= B; E++) {
      const Y = E * R, I = le(-b, Y), V = le(b, Y);
      ie.push(...I, ...V);
    }
    const L = new ze();
    L.setAttribute("position", new Ct(ie, 3));
    const U = new ht({ color: oe, transparent: true, opacity: D, depthWrite: false }), N = new Wt(L, U);
    return N.name = `grid-${se}-${R === y ? "minor" : "major"}`, N;
  }, W = (se, R, oe) => {
    const D = se === "xy" ? (N, E) => [N, E, 0] : se === "xz" ? (N, E) => [N, 0, E] : (N, E) => [0, N, E], ie = [[-b, -b], [b, -b], [b, b], [-b, b]], le = [];
    for (const [N, E] of ie) le.push(...D(N, E));
    const B = new ze();
    B.setAttribute("position", new Ct(le, 3));
    const L = new ht({ color: R, transparent: true, opacity: oe, depthWrite: false }), U = new vs(B, L);
    return U.name = `grid-${se}-border`, U.renderOrder = 1, U;
  }, ye = (se, R, oe) => {
    const D = se === "xy" ? (L, U) => [L, U, 0] : se === "xz" ? (L, U) => [L, 0, U] : (L, U) => [0, L, U], ie = R === "u" ? [...D(-b, 0), ...D(b, 0)] : [...D(0, -b), ...D(0, b)], le = new ze();
    le.setAttribute("position", new Ct(ie, 3));
    const B = new Wt(le, new ht({ color: oe, transparent: true, opacity: 0.45, depthWrite: false }));
    return B.name = `grid-${se}-eje-${R}`, B.renderOrder = 1, B;
  }, be = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of u) {
    p.add(M(se, y, F, 0.12)), p.add(M(se, m, k, 0.4));
    const [R, oe] = be[se];
    p.add(ye(se, "u", R)), p.add(ye(se, "v", oe)), p.add(W(se, k, 0.55));
  }
  return p.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: m, minorStep: y, gridSize: e, planes: [...u] }, p;
}
function wa(e, l, r, p) {
  const u = new it(), m = new Qs(0.5, 0.5, 0.5), y = new js(0.45, 0.7, 4);
  y.rotateX(Math.PI / 2), y.translate(0, 0, -0.35);
  const b = new ft({ color: 10166822 }), x = new ft({ color: 2792847 }), k = new ft({ color: 3835647 }), F = () => {
    const ye = r.rawVal ?? [];
    if (ye.length < 2) return l.gridSize.val * 0.5;
    let be = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const R of ye) for (let oe = 0; oe < 3; oe++) R[oe] < be[oe] && (be[oe] = R[oe]), R[oe] > se[oe] && (se[oe] = R[oe]);
    return Math.max(se[0] - be[0], se[1] - be[1], se[2] - be[2], 0.1);
  }, M = () => 0.08 * F(), W = () => p.rawVal;
  return ee.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    u.clear();
    const ye = M();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((be, se) => {
      const R = r.val[se];
      if (!R) return;
      const oe = be ?? [], D = (oe[0] ? 1 : 0) + (oe[1] ? 1 : 0) + (oe[2] ? 1 : 0), ie = (oe[3] ? 1 : 0) + (oe[4] ? 1 : 0) + (oe[5] ? 1 : 0);
      let le;
      D >= 3 && ie >= 3 ? le = new lt(m, b) : D >= 3 && ie === 0 ? le = new lt(y, x) : le = new lt(y, k), le.position.set(R[0], R[1], R[2]);
      const B = ye * W();
      le.scale.set(B, B, B), u.add(le);
    });
  }), ee.derive(() => {
    if (p.val, !l.supports.rawVal) return;
    const be = M() * W();
    u.children.forEach((se) => se.scale.set(be, be, be));
  }), ee.derive(() => {
    u.visible = l.supports.val;
  }), u;
}
function ya(e, l, r, p) {
  const u = new it();
  u.name = "loadsGroup";
  function m(b) {
    if (b.length < 2) return 0.12 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
    for (const M of b) for (let W = 0; W < 3; W++) x[W] = Math.min(x[W], M[W]), k[W] = Math.max(k[W], M[W]);
    return 0.08 * Math.max(k[0] - x[0], k[1] - x[1], k[2] - x[2], 0.1);
  }
  ee.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    u.children.forEach((se) => {
      var _a3;
      return (_a3 = se.dispose) == null ? void 0 : _a3.call(se);
    }), u.clear();
    const b = r.val, x = m(b), k = 240, F = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((se, R) => {
      b[R] && se.slice(0, 3).some((oe) => Math.abs(oe) > 1e-15) && F.push(R);
    });
    let M = F;
    if (F.length > k) {
      const se = F.map((V) => b[V][0]), R = F.map((V) => b[V][1]), oe = Math.min(...se), D = Math.max(...se), ie = Math.min(...R), le = Math.max(...R), B = F.map((V) => b[V][2]), L = Math.max(1e-6, (Math.max(...B) - Math.min(...B)) / 40), U = (V) => Math.round(V / L), N = new Set(B.map(U)), E = Math.max(4, Math.floor(k / Math.max(1, N.size))), Y = Math.max(2, Math.round(Math.sqrt(E))), I = /* @__PURE__ */ new Map();
      for (const V of F) {
        const te = D - oe < 1e-9 ? 0 : (b[V][0] - oe) / (D - oe), ce = le - ie < 1e-9 ? 0 : (b[V][1] - ie) / (le - ie), he = Math.min(Y - 1, Math.floor(te * Y)), ae = Math.min(Y - 1, Math.floor(ce * Y)), X = `${he},${ae},${U(b[V][2])}`, pe = Math.hypot(te * Y - (he + 0.5), ce * Y - (ae + 0.5)), O = I.get(X);
        (!O || pe < O.d) && I.set(X, { i: V, d: pe });
      }
      M = [...I.values()].map((V) => V.i);
    }
    let W = 0;
    for (const se of M) {
      const R = e.nodeInputs.val.loads.get(se);
      for (let oe = 0; oe < 3; oe++) W = Math.max(W, Math.abs(R[oe]));
    }
    const ye = M.length <= 60, be = (se) => {
      const R = Math.abs(se);
      return R >= 100 ? se.toFixed(0) : R >= 10 ? se.toFixed(1) : se.toFixed(2);
    };
    for (const se of M) {
      const R = e.nodeInputs.val.loads.get(se), oe = b[se];
      if (oe) for (let D = 0; D < 3; D++) {
        const ie = R[D];
        if (!(Math.abs(ie) > 1e-9 * (W || 1))) continue;
        const le = new S(D === 0 ? Math.sign(ie) : 0, D === 1 ? Math.sign(ie) : 0, D === 2 ? Math.sign(ie) : 0), B = 0.45 + 0.55 * (W ? Math.abs(ie) / W : 1), L = new cn(le, new S(...oe), 1, D === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (L.userData = { nudo: oe, dir: le, rel: B }, u.add(L), ye) {
          const U = new Pt(be(ie), D === 2 ? "#f5b642" : "#ff6b5e");
          U.userData = { nudo: oe, dir: le, rel: B, texto: true }, u.add(U);
        }
      }
    }
    y(x * p.rawVal);
  });
  function y(b) {
    u.children.forEach((x) => {
      const k = x.userData;
      if (!(k == null ? void 0 : k.dir)) return;
      const F = b * k.rel, M = new S(...k.nudo).addScaledVector(k.dir, -F * (k.texto ? 1.12 : 1));
      x.position.copy(M), k.texto ? x.updateScale(b * 0.38) : x.scale.set(F, F, F);
    });
  }
  return ee.derive(() => {
    p.val, l.loads.rawVal && y(m(r.rawVal) * p.rawVal);
  }), ee.derive(() => {
    u.visible = l.loads.val;
  }), u;
}
function xa(e, l, r) {
  const p = new it();
  return ee.derive(() => {
    if (!e.nodesIndexes.val) return;
    p.children.forEach((m) => m.dispose()), p.clear();
    const u = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((m, y) => {
      const b = new Pt(`${y}`);
      b.position.set(...m), b.updateScale(u * r.rawVal), p.add(b);
    });
  }), ee.derive(() => {
    if (r.val, !e.nodesIndexes.rawVal) return;
    const u = 0.05 * e.gridSize.val * 0.6;
    p.children.forEach((m) => m.updateScale(u * r.rawVal));
  }), ee.derive(() => {
    p.visible = e.nodesIndexes.val;
  }), p;
}
function ga(e, l, r, p) {
  const u = new it();
  return ee.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    u.children.forEach((y) => y.dispose()), u.clear();
    const m = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((y, b) => {
      const x = new Pt(`${b}`, void 0, "#001219");
      x.position.set(...va(y.map((k) => r.rawVal[k]))), x.updateScale(m * p.rawVal), u.add(x);
    });
  }), ee.derive(() => {
    if (p.val, !l.elementsIndexes.rawVal) return;
    const m = 0.05 * l.gridSize.val * 0.6;
    u.children.forEach((y) => y.updateScale(m * p.rawVal));
  }), ee.derive(() => {
    u.visible = l.elementsIndexes.val;
  }), u;
}
function va(e) {
  const l = e.reduce((p, u) => [p[0] + u[0], p[1] + u[1], p[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function hs(e, l) {
  const r = new it(), p = Math.min(0.05 * e, 0.6), u = dn(), m = new Pt("X", "red", "transparent"), y = new Pt(l ? "Z" : "Y", "green", "transparent"), b = new Pt(l ? "Y" : "Z", "blue", "transparent"), x = new cn(new S(1, 0, 0), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), k = new cn(new S(0, 1, 0), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2), F = new cn(new S(0, 0, 1), new S(0, 0, 0), 1, u.axisArrow, 0.2, 0.2);
  return m.position.set(1.3 * p, 0, 0), y.position.set(0, 1.3 * p, 0), b.position.set(0, 0, 1.3 * p), m.updateScale(0.4 * p), y.updateScale(0.4 * p), b.updateScale(0.4 * p), x.scale.set(p, p, p), k.scale.set(p, p, p), F.scale.set(p, p, p), r.add(x, k, F, m, y, b), r;
}
function Lo(e, l) {
  const r = new S(...e), u = new S(...l).clone().sub(r), m = u.length(), y = u.dot(new S(1, 0, 0)) / m, b = u.dot(new S(0, 1, 0)) / m, x = u.dot(new S(0, 0, 1)) / m, k = Math.sqrt(y ** 2 + b ** 2);
  let F = new ko().fromArray([[y, b, x], [-b / k, y / k, 0], [-y * x / k, -b * x / k, k]].flat());
  return x === 1 && (F = new ko().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), x === -1 && (F = new ko().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new no().setFromMatrix3(F);
}
function Eo(e, l) {
  return e == null ? void 0 : e.map((r, p) => (9 * r + l[p]) / 10);
}
function Tn(e) {
  const l = e.reduce((p, u) => [p[0] + u[0], p[1] + u[1], p[2] + u[2]], [0, 0, 0]), r = e.length;
  return [l[0] / r, l[1] / r, l[2] / r];
}
function ba(e, l, r) {
  const p = Tn([l, r]), u = Tn([e, r]), m = Tn([e, l]), y = new S(...p).sub(new S(...u)).normalize(), b = new S(...r).sub(new S(...m)).normalize(), x = y.clone().cross(b).normalize(), k = x.clone().cross(y).normalize();
  return new no().makeBasis(y, k, x);
}
function Ma(e, l, r, p) {
  const u = new it(), m = new ze(), y = new ht({ vertexColors: true }), b = [0, 0, 0], x = [1, 0, 0], k = [0, 1, 0], F = [0, 0, 1];
  m.setAttribute("position", new Ct([...b, ...x, ...b, ...k, ...b, ...F], 3));
  const M = [255, 0, 0], W = [0, 255, 0], ye = [0, 0, 255];
  return m.setAttribute("color", new Ct([...M, ...M, ...W, ...W, ...ye, ...ye], 3)), ee.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (u.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((be) => {
      const se = new Wt(m, y), R = r.rawVal[be[0]], oe = r.rawVal[be[1]];
      if (be.length === 2 && (se.position.set(...Eo(R, oe)), se.rotation.setFromRotationMatrix(Lo(R, oe))), be.length === 3) {
        const le = r.rawVal[be[2]];
        se.position.set(...Tn([R, oe, le])), se.rotation.setFromRotationMatrix(ba(R, oe, le));
      }
      const ie = 0.05 * l.gridSize.rawVal * 0.75 * p.rawVal;
      se.scale.set(ie, ie, ie), u.add(se);
    }));
  }), ee.derive(() => {
    if (p.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * p.rawVal;
    u.children.forEach((R) => R.scale.set(se, se, se));
  }), ee.derive(() => {
    u.visible = l.orientations.val;
  }), u;
}
function _a(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), r = (e.h * 100).toFixed(0);
    return `${l}x${r}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function ka(e, l, r, p) {
  const u = new it(), m = new it();
  u.add(m);
  function y(L, U) {
    const N = L / 2, E = U / 2, Y = new Float32Array([0, -N, -E, 0, N, -E, 0, N, E, 0, -N, -E, 0, N, E, 0, -N, E]), I = new ze();
    I.setAttribute("position", new yt(Y, 3));
    const V = new Float32Array([0, -N, -E, 0, N, -E, 0, N, E, 0, -N, E, 0, -N, -E]), te = new ze();
    return te.setAttribute("position", new yt(V, 3)), { fill: I, outline: te };
  }
  function b(L, U = 24) {
    const N = L / 2, E = new Float32Array(U * 9);
    for (let te = 0; te < U; te++) {
      const ce = te / U * Math.PI * 2, he = (te + 1) / U * Math.PI * 2;
      E[te * 9] = 0, E[te * 9 + 1] = 0, E[te * 9 + 2] = 0, E[te * 9 + 3] = 0, E[te * 9 + 4] = N * Math.cos(ce), E[te * 9 + 5] = N * Math.sin(ce), E[te * 9 + 6] = 0, E[te * 9 + 7] = N * Math.cos(he), E[te * 9 + 8] = N * Math.sin(he);
    }
    const Y = new ze();
    Y.setAttribute("position", new yt(E, 3));
    const I = new Float32Array((U + 1) * 3);
    for (let te = 0; te <= U; te++) {
      const ce = te / U * Math.PI * 2;
      I[te * 3] = 0, I[te * 3 + 1] = N * Math.cos(ce), I[te * 3 + 2] = N * Math.sin(ce);
    }
    const V = new ze();
    return V.setAttribute("position", new yt(I, 3)), { fill: Y, outline: V };
  }
  function x(L, U, N, E) {
    const Y = N ?? U * 0.08, I = E ?? L * 0.07, V = L / 2, te = U / 2, ce = te - Y, he = I / 2, ae = [];
    function X(ge, Ee, Me, Ie) {
      ae.push(0, ge, Ee, 0, Me, Ee, 0, Me, Ie, 0, ge, Ee, 0, Me, Ie, 0, ge, Ie);
    }
    X(-V, -te, V, -ce), X(-he, -ce, he, ce), X(-V, ce, V, te);
    const pe = new ze();
    pe.setAttribute("position", new yt(new Float32Array(ae), 3));
    const O = new Float32Array([0, -V, -te, 0, V, -te, 0, V, -ce, 0, he, -ce, 0, he, ce, 0, V, ce, 0, V, te, 0, -V, te, 0, -V, ce, 0, -he, ce, 0, -he, -ce, 0, -V, -ce, 0, -V, -te]), xe = new ze();
    return xe.setAttribute("position", new yt(O, 3)), { fill: pe, outline: xe };
  }
  function k(L, U, N) {
    const E = L / 2, Y = U / 2, I = E - N, V = Y - N, te = [];
    function ce(pe, O, xe, ge) {
      te.push(0, pe, O, 0, xe, O, 0, xe, ge, 0, pe, O, 0, xe, ge, 0, pe, ge);
    }
    ce(-E, -Y, E, -V), ce(-E, V, E, Y), ce(-E, -V, -I, V), ce(I, -V, E, V);
    const he = new ze();
    he.setAttribute("position", new yt(new Float32Array(te), 3));
    const ae = new Float32Array([0, -E, -Y, 0, E, -Y, 0, E, -Y, 0, E, Y, 0, E, Y, 0, -E, Y, 0, -E, Y, 0, -E, -Y, 0, -I, -V, 0, I, -V, 0, I, -V, 0, I, V, 0, I, V, 0, -I, V, 0, -I, V, 0, -I, -V]), X = new ze();
    return X.setAttribute("position", new yt(ae, 3)), { fill: he, outline: X };
  }
  function F(L, U, N) {
    const E = L / 2, Y = U / 2, I = E - N, V = Y - N, te = new ze(), ce = new Float32Array([0, -I, -V, 0, I, -V, 0, I, V, 0, -I, -V, 0, I, V, 0, -I, V]);
    te.setAttribute("position", new yt(ce, 3));
    const he = [];
    function ae(xe, ge, Ee, Me) {
      he.push(0, xe, ge, 0, Ee, ge, 0, Ee, Me, 0, xe, ge, 0, Ee, Me, 0, xe, Me);
    }
    ae(-E, -Y, E, -V), ae(-E, V, E, Y), ae(-E, -V, -I, V), ae(I, -V, E, V);
    const X = new ze();
    X.setAttribute("position", new yt(new Float32Array(he), 3));
    const pe = new Float32Array([0, -E, -Y, 0, E, -Y, 0, E, -Y, 0, E, Y, 0, E, Y, 0, -E, Y, 0, -E, Y, 0, -E, -Y, 0, -I, -V, 0, I, -V, 0, I, -V, 0, I, V, 0, I, V, 0, -I, V, 0, -I, V, 0, -I, -V]), O = new ze();
    return O.setAttribute("position", new yt(pe, 3)), { concFill: te, steelFillGeom: X, outline: O };
  }
  function M(L, U, N) {
    const E = [], Y = [[0, -L / 2, -U / 2], [0, -L / 2 + N, -U / 2], [0, -L / 2 + N, U / 2 - N], [0, L / 2, U / 2 - N], [0, L / 2, U / 2], [0, -L / 2, U / 2]], I = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const he of I) E.push(...Y[he]);
    const V = new ze();
    V.setAttribute("position", new yt(new Float32Array(E), 3));
    const te = [];
    for (let he = 0; he < Y.length; he++) {
      const ae = (he + 1) % Y.length;
      te.push(...Y[he], ...Y[ae]);
    }
    const ce = new ze();
    return ce.setAttribute("position", new yt(new Float32Array(te), 3)), { fill: V, outline: ce };
  }
  function W(L, U, N, E) {
    const Y = E / 2, I = [], V = [[0, -L - Y, -U / 2], [0, -N - Y, -U / 2], [0, -N - Y, U / 2 - N], [0, -Y, U / 2 - N], [0, -Y, U / 2], [0, -L - Y, U / 2]], te = [[0, Y, -U / 2], [0, Y + N, -U / 2], [0, Y + N, U / 2 - N], [0, L + Y, U / 2 - N], [0, L + Y, U / 2], [0, Y, U / 2]], ce = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of ce) I.push(...V[pe]);
    for (const pe of ce) I.push(...te[pe]);
    const he = new ze();
    he.setAttribute("position", new yt(new Float32Array(I), 3));
    const ae = [];
    for (const pe of [V, te]) for (let O = 0; O < pe.length; O++) {
      const xe = (O + 1) % pe.length;
      ae.push(...pe[O], ...pe[xe]);
    }
    const X = new ze();
    return X.setAttribute("position", new yt(new Float32Array(ae), 3)), { fill: he, outline: X };
  }
  function ye(L, U, N, E) {
    const Y = U / 2, I = L, V = [[0, -I, -Y], [0, -I, -Y + N], [0, -E, -Y + N], [0, -E, Y - N], [0, -I, Y - N], [0, -I, Y], [0, 0, Y], [0, 0, -Y]], te = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], ce = [];
    for (const pe of te) ce.push(...V[pe]);
    const he = new ze();
    he.setAttribute("position", new yt(new Float32Array(ce), 3));
    const ae = [];
    for (let pe = 0; pe < V.length; pe++) {
      const O = (pe + 1) % V.length;
      ae.push(...V[pe], ...V[O]);
    }
    const X = new ze();
    return X.setAttribute("position", new yt(new Float32Array(ae), 3)), { fill: he, outline: X };
  }
  function be(L, U, N, E, Y) {
    const I = U / 2, V = Y / 2, te = [], ce = [[0, -L, -I], [0, -L, -I + N], [0, -V - E, -I + N], [0, -V - E, I - N], [0, -L, I - N], [0, -L, I], [0, -V, I], [0, -V, -I]], he = ce.map((xe) => [xe[0], -xe[1], xe[2]]), ae = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const xe of ae) te.push(...ce[xe]);
    for (const xe of ae) te.push(...he[xe]);
    const X = new ze();
    X.setAttribute("position", new yt(new Float32Array(te), 3));
    const pe = [];
    for (const xe of [ce, he]) for (let ge = 0; ge < xe.length; ge++) {
      const Ee = (ge + 1) % xe.length;
      pe.push(...xe[ge], ...xe[Ee]);
    }
    const O = new ze();
    return O.setAttribute("position", new yt(new Float32Array(pe), 3)), { fill: X, outline: O };
  }
  function se(L, U, N, E) {
    const Y = L / 2, I = U / 2, V = E / 2, te = [[0, -V, -I], [0, V, -I], [0, V, I - N], [0, Y, I - N], [0, Y, I], [0, -Y, I], [0, -Y, I - N], [0, -V, I - N]], ce = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], he = [];
    for (const O of ce) he.push(...te[O]);
    const ae = new ze();
    ae.setAttribute("position", new yt(new Float32Array(he), 3));
    const X = [];
    for (let O = 0; O < te.length; O++) {
      const xe = (O + 1) % te.length;
      X.push(...te[O], ...te[xe]);
    }
    const pe = new ze();
    return pe.setAttribute("position", new yt(new Float32Array(X), 3)), { fill: ae, outline: pe };
  }
  function R(L, U, N = 24) {
    const E = L / 2, Y = E - U, I = [];
    for (let he = 0; he < N; he++) {
      const ae = he / N * Math.PI * 2, X = (he + 1) / N * Math.PI * 2, pe = Math.cos(ae), O = Math.sin(ae), xe = Math.cos(X), ge = Math.sin(X);
      I.push(0, E * pe, E * O, 0, E * xe, E * ge, 0, Y * xe, Y * ge), I.push(0, E * pe, E * O, 0, Y * xe, Y * ge, 0, Y * pe, Y * O);
    }
    const V = new ze();
    V.setAttribute("position", new yt(new Float32Array(I), 3));
    const te = [];
    for (let he = 0; he < N; he++) {
      const ae = he / N * Math.PI * 2, X = (he + 1) / N * Math.PI * 2;
      te.push(0, E * Math.cos(ae), E * Math.sin(ae), 0, E * Math.cos(X), E * Math.sin(X)), te.push(0, Y * Math.cos(ae), Y * Math.sin(ae), 0, Y * Math.cos(X), Y * Math.sin(X));
    }
    const ce = new ze();
    return ce.setAttribute("position", new yt(new Float32Array(te), 3)), { fill: V, outline: ce };
  }
  const oe = new ft({ color: 52479, transparent: true, opacity: 0.35, side: At, depthWrite: false }), D = new ht({ color: 52479 }), ie = new ft({ color: 16750848, transparent: true, opacity: 0.4, side: At, depthWrite: false }), le = new ht({ color: 16750848 });
  function B(L, U) {
    const N = Math.abs(U[0] - L[0]), E = Math.abs(U[1] - L[1]), Y = Math.abs(U[2] - L[2]);
    return Y > N && Y > E || E > N && E > Y;
  }
  return ee.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const L = l.secColumns.rawVal, U = l.secBeams.rawVal;
    if (!L && !U) {
      u.children.forEach((V) => {
        V instanceof Pt && V.dispose();
      }), u.clear();
      return;
    }
    u.children.forEach((V) => {
      V instanceof Pt && V.dispose();
    }), u.clear();
    const N = (_a2 = e.elements) == null ? void 0 : _a2.val, E = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!N || !E) return;
    const Y = E.sectionShapes, I = l.secFloor.rawVal;
    N.forEach((V, te) => {
      if (V.length !== 2) return;
      const ce = r.rawVal[V[0]], he = r.rawVal[V[1]];
      if (!ce || !he) return;
      const ae = B(ce, he);
      if (ae && !L || !ae && !U) return;
      if (I >= 0) {
        const ge = Math.min(ce[1], he[1]);
        Math.max(ce[1], he[1]);
        const Ee = l.gridSize.rawVal || 3;
        if (Math.floor(ge / Ee + 0.01) !== I) return;
      }
      const X = Y == null ? void 0 : Y.get(te);
      if (!X) return;
      const pe = [(ce[0] + he[0]) / 2, (ce[1] + he[1]) / 2, (ce[2] + he[2]) / 2], O = Lo(ce, he);
      if (X.type === "CFT") {
        const ge = F(X.b, X.h, X.tw ?? X.b * 0.05), Ee = new lt(ge.concFill, oe);
        Ee.position.set(...pe), Ee.rotation.setFromRotationMatrix(O), u.add(Ee);
        const Me = new lt(ge.steelFillGeom, ie);
        Me.position.set(...pe), Me.rotation.setFromRotationMatrix(O), u.add(Me);
        const Ie = new Ft(ge.outline, le);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(O), u.add(Ie);
      } else {
        let ge, Ee, Me;
        switch (X.type) {
          case "rect":
            ge = y(X.b, X.h), Ee = oe, Me = D;
            break;
          case "circ":
            ge = b(X.d), Ee = oe, Me = D;
            break;
          case "I":
            ge = x(X.b, X.h, X.tf, X.tw), Ee = ie, Me = le;
            break;
          case "HSS":
            ge = k(X.b, X.h, X.tw ?? X.b * 0.05), Ee = ie, Me = le;
            break;
          case "CFT":
            ge = F(X.b, X.h, X.tw ?? X.b * 0.05), Ee = ie, Me = le;
            break;
          case "L":
            ge = M(X.b ?? X.h, X.h, X.t ?? X.tw ?? 3e-3), Ee = ie, Me = le;
            break;
          case "2L":
            ge = W(X.b ?? X.h, X.h, X.t ?? X.tw ?? 3e-3, X.dis ?? 0.01), Ee = ie, Me = le;
            break;
          case "C":
          case "coldC":
            ge = ye(X.b, X.h, X.tf ?? X.t ?? 3e-3, X.tw ?? X.t ?? 3e-3), Ee = ie, Me = le;
            break;
          case "2C":
            ge = be(X.b, X.h, X.tf ?? 5e-3, X.tw ?? 5e-3, X.dis ?? 0.01), Ee = ie, Me = le;
            break;
          case "T":
            ge = se(X.b, X.h, X.tf ?? 0.01, X.tw ?? 6e-3), Ee = ie, Me = le;
            break;
          case "pipe":
            ge = R(X.d, X.tw ?? X.d * 0.05), Ee = ie, Me = le;
            break;
          default:
            return;
        }
        const Ie = new lt(ge.fill, Ee);
        Ie.position.set(...pe), Ie.rotation.setFromRotationMatrix(O), u.add(Ie);
        const Ke = new Ft(ge.outline, Me);
        Ke.position.set(...pe), Ke.rotation.setFromRotationMatrix(O), u.add(Ke);
      }
      const xe = _a(X);
      if (xe) {
        const Ee = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(X.type) ? "#ff9900" : "#00ccff", Me = new Pt(xe, Ee, "transparent");
        Me.position.set(pe[0], pe[1], pe[2]);
        const Ie = 0.05 * l.gridSize.rawVal * 0.5;
        Me.updateScale(Ie * ((p == null ? void 0 : p.rawVal) ?? 1)), m.add(Me);
      }
    });
  }), p && ee.derive(() => {
    if (p.val, !l.sections.rawVal) return;
    const L = 0.05 * l.gridSize.val * 0.5;
    m.children.forEach((U) => {
      U instanceof Pt && U.updateScale(L * p.rawVal);
    });
  }), ee.derive(() => {
    u.visible = l.sections.val;
  }), ee.derive(() => {
    m.visible = l.sectionLabels.val;
  }), u;
}
function Sa(e) {
  if (!e) return null;
  const l = e.type, r = (F, M) => [F, M], p = (F, M) => [r(-F / 2, -M / 2), r(F / 2, -M / 2), r(F / 2, M / 2), r(-F / 2, M / 2)], u = (F, M = 24) => {
    const W = F / 2, ye = [];
    for (let be = 0; be < M; be++) {
      const se = 2 * Math.PI * be / M;
      ye.push(r(W * Math.cos(se), W * Math.sin(se)));
    }
    return ye;
  }, m = e.b ?? 0, y = e.h ?? 0, b = e.d ?? 0, x = e.tw ?? e.t ?? 0, k = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return m && y ? { contorno: p(m, y) } : null;
    case "circ":
      return b ? { contorno: u(b) } : null;
    case "pipe":
      return b && x ? { contorno: u(b), huecos: [u(b - 2 * x).reverse()] } : null;
    case "HSS":
      return m && y && x ? { contorno: p(m, y), huecos: [p(m - 2 * x, y - 2 * (k || x)).reverse()] } : null;
    case "CFT":
      return m && y ? { contorno: p(m, y) } : null;
    case "I":
      return m && y && x && k ? { contorno: [r(-m / 2, -y / 2), r(m / 2, -y / 2), r(m / 2, -y / 2 + k), r(x / 2, -y / 2 + k), r(x / 2, y / 2 - k), r(m / 2, y / 2 - k), r(m / 2, y / 2), r(-m / 2, y / 2), r(-m / 2, y / 2 - k), r(-x / 2, y / 2 - k), r(-x / 2, -y / 2 + k), r(-m / 2, -y / 2 + k)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return m && y && x && k ? { contorno: [r(-m / 2, -y / 2), r(m / 2, -y / 2), r(m / 2, -y / 2 + k), r(-m / 2 + x, -y / 2 + k), r(-m / 2 + x, y / 2 - k), r(m / 2, y / 2 - k), r(m / 2, y / 2), r(-m / 2, y / 2)] } : null;
    case "T":
      return m && y && x && k ? { contorno: [r(-x / 2, -y / 2), r(x / 2, -y / 2), r(x / 2, y / 2 - k), r(m / 2, y / 2 - k), r(m / 2, y / 2), r(-m / 2, y / 2), r(-m / 2, y / 2 - k), r(-x / 2, y / 2 - k)] } : null;
    case "L":
    case "2L":
      return m && y && x ? { contorno: [r(-m / 2, -y / 2), r(m / 2, -y / 2), r(m / 2, -y / 2 + x), r(-m / 2 + x, -y / 2 + x), r(-m / 2 + x, y / 2), r(-m / 2, y / 2)] } : null;
    default:
      return m && y ? { contorno: p(m, y) } : b ? { contorno: u(b) } : null;
  }
}
function Pa(e, l, r) {
  if (!e || e <= 0 || !l || !r || l <= 0 || r <= 0) return null;
  const p = Math.sqrt(Math.sqrt(r / l)), u = Math.sqrt(e / p), m = e / u;
  return !isFinite(u) || !isFinite(m) || u <= 0 || m <= 0 ? null : { contorno: [[-u / 2, -m / 2], [u / 2, -m / 2], [u / 2, m / 2], [-u / 2, m / 2]] };
}
function Ca(e) {
  const l = new Vn();
  e.contorno.forEach(([r, p], u) => u ? l.lineTo(r, p) : l.moveTo(r, p)), l.closePath();
  for (const r of e.huecos ?? []) {
    const p = new ta();
    r.forEach(([u, m], y) => y ? p.lineTo(u, m) : p.moveTo(u, m)), p.closePath(), l.holes.push(p);
  }
  return l;
}
function za(e, l, r) {
  const p = new it();
  p.name = "extrusion";
  const u = new So({ color: 8369151, transparent: true, opacity: 0.92, side: At }), m = new So({ color: 12623968, transparent: true, opacity: 0.85, side: At }), y = new So({ color: 11583173, transparent: true, opacity: 0.85, side: At }), b = new it();
  b.add(new bs(16777215, 0.55));
  const x = new to(16777215, 0.75);
  x.position.set(30, 25, 40);
  const k = new to(16777215, 0.35);
  k.position.set(-25, -20, 15), b.add(x, k);
  let F = 0;
  return ee.derive(() => {
    var _a2, _b, _c, _d, _e;
    const M = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++F, on: M }, p.visible = M;
    for (const D of [...p.children]) D !== b && (p.remove(D), (_c = (_b = D.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (p.children.includes(b) || p.add(b), !M) return;
    const W = r.val ?? [], ye = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], be = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = be.sectionShapes ?? /* @__PURE__ */ new Map(), R = be.thicknesses ?? /* @__PURE__ */ new Map();
    let oe = "";
    try {
      ye.forEach((D, ie) => {
        var _a3, _b2, _c2;
        if (D.length === 2) {
          let le = Sa(se.get(ie)), B = true;
          if (le || (le = Pa((_a3 = be.areas) == null ? void 0 : _a3.get(ie), (_b2 = be.momentsOfInertiaY) == null ? void 0 : _b2.get(ie), (_c2 = be.momentsOfInertiaZ) == null ? void 0 : _c2.get(ie)), B = false), !le) return;
          const L = W[D[0]], U = W[D[1]];
          if (!L || !U) return;
          const N = Math.hypot(U[0] - L[0], U[1] - L[1], U[2] - L[2]);
          if (N < 1e-9) return;
          const E = new ea(Ca(le), { depth: N, bevelEnabled: false, curveSegments: 4 });
          E.applyMatrix4(new no().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const Y = new lt(E, B ? u : m);
          Y.position.set(L[0], L[1], L[2]), Y.rotation.setFromRotationMatrix(Lo(L, U)), p.add(Y);
          return;
        }
        if (D.length === 3 || D.length === 4) {
          const le = R.get(ie);
          if (!le || le <= 0) return;
          const B = D.map((O) => W[O]).filter(Boolean);
          if (B.length < 3) return;
          const L = [B[1][0] - B[0][0], B[1][1] - B[0][1], B[1][2] - B[0][2]], U = [B[2][0] - B[0][0], B[2][1] - B[0][1], B[2][2] - B[0][2]], N = L[1] * U[2] - L[2] * U[1], E = L[2] * U[0] - L[0] * U[2], Y = L[0] * U[1] - L[1] * U[0], I = Math.hypot(N, E, Y);
          if (I < 1e-12) return;
          const V = [N / I, E / I, Y / I], te = [], ce = (O) => B.map((xe) => [xe[0] + V[0] * O, xe[1] + V[1] * O, xe[2] + V[2] * O]), he = ce(+le / 2), ae = ce(-le / 2), X = (O, xe, ge) => te.push(...O, ...xe, ...ge);
          for (const O of [he, ae]) X(O[0], O[1], O[2]), O.length === 4 && X(O[0], O[2], O[3]);
          for (let O = 0; O < B.length; O++) {
            const xe = (O + 1) % B.length;
            X(he[O], ae[O], ae[xe]), X(he[O], ae[xe], he[xe]);
          }
          const pe = new ze();
          pe.setAttribute("position", new Ct(te, 3)), pe.computeVertexNormals(), p.add(new lt(pe, y));
        }
      });
    } catch (D) {
      oe = String((D == null ? void 0 : D.message) ?? D);
    }
    globalThis.__extrusionDebug = { corridas: F, on: M, fallo: oe, nElementos: ye.length, nFormas: se.size, nEspesores: R.size, mallas: p.children.length - 1 };
  }), p;
}
function Cs(e, l, r = 0) {
  const p = [l[0] - e[0], l[1] - e[1], l[2] - e[2]], u = Math.hypot(p[0], p[1], p[2]) || 1, m = p[0] / u, y = p[1] / u, b = p[2] / u, x = Math.sqrt(m * m + y * y);
  let k, F, M;
  if (x < 1e-9) {
    const W = b > 0 ? 1 : -1;
    k = [0, 0, W], F = [1, 0, 0], M = [0, W, 0];
  } else k = [m, y, b], F = [-m * b / x, -y * b / x, x], M = [y / x, -m / x, 0];
  if (Math.abs(r) > 1e-12) {
    const W = r * Math.PI / 180, ye = Math.cos(W), be = Math.sin(W), se = F.map((oe, D) => ye * oe + be * M[D]), R = M.map((oe, D) => -be * F[D] + ye * oe);
    F = se, M = R;
  }
  return { e1: k, e2: F, e3: M };
}
function Vo(e, l) {
  if (!l) return [0, 0];
  const r = Number(l[0] ?? 0), p = Number(l[1] ?? 0);
  return e === "bendingsY" ? [r, -p] : [-r, p];
}
function zs(e, l) {
  const r = (p) => p.map((u) => -u);
  switch (e) {
    case "bendingsZ":
      return r(l.e2);
    case "bendingsY":
      return r(l.e3);
    case "shearsZ":
      return l.e3;
    default:
      return l.e2;
  }
}
class Jn extends it {
  constructor(l, r, p, u, m, y, b) {
    super();
    const x = new Vn().moveTo(0, 0).lineTo(0, y[1]).lineTo(p, y[1]).lineTo(p, 0).lineTo(0, 0), k = x.getPoints(), F = new ze().setFromPoints(k);
    this.lines = new Ft(F, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const M = new eo(x), W = new ft({ color: y[1] > 0 ? 24435 : 11411474, side: At });
    this.mesh = new lt(M, W), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Pt(`${m[1].toFixed(4)}`), this.normalizedResult = y, this.textPosition = Tn([l, r]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(u), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Fo extends it {
  constructor(l, r, p, u, m, y, b) {
    super();
    const x = m[0] * p / (m[0] + m[1]), k = m[0] * m[1] > 0;
    if (this.text = new Pt(`${m[0].toFixed(4)}`), this.text2 = new Pt(`${(m[1] * -1).toFixed(4)}`), this.normalizedResult = y, this.textPosition = Eo(l, r), this.text2Position = Eo(r, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(u), this.text2.rotation.setFromRotationMatrix(u), this.add(this.text, this.text2), k) {
      const F = new Vn().moveTo(0, 0).lineTo(0, y[0]).lineTo(x, 0).lineTo(0, 0), M = new Vn().moveTo(x, 0).lineTo(p, -y[1]).lineTo(p, 0).lineTo(x, 0), W = F.getPoints(), ye = M.getPoints(), be = new ze().setFromPoints(W), se = new ze().setFromPoints(ye), R = new ht({ color: dn().resultOutline });
      this.lines = new Ft(be, R), this.lines2 = new Ft(se, R), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), this.lines2.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), b && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const oe = new eo(F), D = new eo(M), ie = new ft({ color: y[0] > 0 ? 24435 : 11411474, side: At }), le = new ft({ color: -y[1] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(oe, ie), this.mesh2 = new lt(D, le), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), this.mesh2.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), b && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const F = new Vn().moveTo(0, 0).lineTo(0, y[0]).lineTo(p, -y[1]).lineTo(p, 0).lineTo(0, 0), M = F.getPoints(), W = new ze().setFromPoints(M);
      this.lines = new Ft(W, new ht({ color: dn().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(u), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ye = new eo(F), be = new ft({ color: y[0] > 0 ? 24435 : 11411474, side: At });
      this.mesh = new lt(ye, be), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(u), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var Fs = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(Fs || {});
function Fa(e, l, r, p) {
  const u = () => {
    const b = r.rawVal;
    if (!(b == null ? void 0 : b.length)) return 0.05 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], k = [-1 / 0, -1 / 0, -1 / 0];
    for (const M of b) for (let W = 0; W < 3; W++) M[W] < x[W] && (x[W] = M[W]), M[W] > k[W] && (k[W] = M[W]);
    const F = Math.hypot(k[0] - x[0], k[1] - x[1], k[2] - x[2]);
    return !isFinite(F) || F <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * F;
  }, m = new it(), y = { normals: Jn, shearsY: Jn, shearsZ: Jn, torsions: Jn, bendingsY: Fo, bendingsZ: Fo };
  return ee.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, r.val, l.frameResults.val == "none") return;
    m.children.forEach((x) => x.dispose()), m.clear();
    const b = Fs[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[b]) == null ? void 0 : _b.forEach((x, k) => {
      var _a3, _b2, _c, _d, _e, _f;
      const F = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[k]) ?? [0, 1], M = r.rawVal[F[0]], W = r.rawVal[F[1]];
      if (!M || !W) return;
      const ye = new S(...W).distanceTo(new S(...M)), be = Aa((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[b]), se = ((_f = (_e = (_d = (_c = e.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, k)) ?? 0, R = Cs(M, W, se), oe = zs(b, R), D = new S(...R.e1), ie = new S(...oe), le = new no().makeBasis(D, ie, D.clone().cross(ie)), [B, L] = Vo(b, x), U = y[b] === Fo ? [B, -L] : [B, L], N = U.map((Y) => Y / (be === 0 ? 1 : be)), E = new y[b](M, W, ye, le, U, N, false);
      E.updateScale(u() * p.rawVal), m.add(E);
    });
  }), ee.derive(() => {
    if (p.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const b = u();
    m.children.forEach((x) => x.updateScale(b * p.rawVal));
  }), ee.derive(() => {
    m.visible = l.frameResults.val != "none";
  }), m;
}
function Aa(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((r) => {
    const p = Math.max(...(r ?? [0, 0]).map((u) => Math.abs(u)));
    p > l && (l = p);
  }), l;
}
class Ea extends it {
  constructor(l, r, p) {
    super();
    const u = r === Io.reactions;
    p[0] && (this.xText1 = new Pt(`${u ? "Fx" : "Dx"}: ` + p[0].toFixed(4))), p[3] && (this.xText2 = new Pt(`${u ? "Mx" : "Rx"}: ` + p[3].toFixed(4))), p[1] && (this.yText1 = new Pt(`${u ? "Fy" : "Dy"}: ` + p[1].toFixed(4))), p[4] && (this.yText2 = new Pt(`${u ? "My" : "Ry"}: ` + p[4].toFixed(4))), p[2] && (this.zText1 = new Pt(`${u ? "Fz" : "Dz"}: ` + p[2].toFixed(4))), p[5] && (this.zText2 = new Pt(`${u ? "Mz" : "Rz"}: ` + p[5].toFixed(4))), (p[0] || p[3]) && (this.xArrow = new cn(new S(1, 0, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[1] || p[4]) && (this.yArrow = new cn(new S(0, 1, 0), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[2] || p[5]) && (this.zArrow = new cn(new S(0, 0, 1), new S(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(l) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(l, l, l), (_b = this.yArrow) == null ? void 0 : _b.scale.set(l, l, l), (_c = this.zArrow) == null ? void 0 : _c.scale.set(l, l, l), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * l, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * l, 0, 0.5 * l), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * l, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * l, 0.5 * l), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * l), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * l + 0.5 * l), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * l), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * l), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * l), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * l), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * l), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * l);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var Io = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(Io || {});
function Va(e, l, r, p) {
  const u = new it();
  return ee.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    u.children.forEach((b) => b.dispose()), u.clear();
    const m = Io[l.nodeResults.rawVal], y = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[m]) == null ? void 0 : _b.forEach((b, x) => {
      const k = new Ea(r.rawVal[x], m, b ?? [0, 0, 0, 0, 0, 0]);
      k.updateScale(y * p.rawVal), u.add(k);
    });
  }), ee.derive(() => {
    if (p.val, l.nodeResults.rawVal == "none") return;
    const m = 0.05 * l.gridSize.val;
    u.children.forEach((y) => y.updateScale(m * p.rawVal));
  }), ee.derive(() => {
    u.visible = l.nodeResults.val != "none";
  }), u;
}
function Ta({ drawingObj: e, gridObj: l, scene: r, getActiveCamera: p, controls: u, gridSize: m, derivedDisplayScale: y, rendererElm: b, viewerRender: x }) {
  const k = new na(), F = new oa(), M = (t) => {
    const o = b.getBoundingClientRect(), a = t.clientX - o.left, n = t.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const f = s / 2;
      if (a >= f) return F.x = (a - f) / f * 2 - 1, F.y = -(n / i) * 2 + 1, window.__hekatanSplitCamera ?? p();
      F.x = a / f * 2 - 1;
    } else F.x = a / s * 2 - 1;
    return F.y = -(n / i) * 2 + 1, p();
  }, W = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
  W.visible = true, W.frustumCulled = false, r.add(W);
  const ye = (t, o, a) => {
    const n = new lt(new en(1e4, 1e4), new ft({ side: At, transparent: true, opacity: 0, depthWrite: false }));
    return n.rotation.set(t, o, a), n.visible = false, n.frustumCulled = false, r.add(n), n;
  }, be = ye(Math.PI / 2, 0, 0), se = ye(0, Math.PI / 2, 0);
  let R = false;
  const oe = () => {
    if (R) return k.intersectObjects([W], false);
    if (be.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && Ze.visible) {
      const a = k.intersectObjects([Ze, rt, Ne], false);
      if (a.length > 0) return a;
    }
    const o = [W];
    return be.visible && o.push(be), se.visible && o.push(se), Ot.visible && un.length > 0 && o.push(...un), k.intersectObjects(o, false);
  }, D = new Qn(new ze(), new jn()), ie = new Qn(new ze(), new jn({ color: "gray", sizeAttenuation: false, size: 6 })), le = new Qn(new ze(), new jn({ color: "orange", sizeAttenuation: false, size: 5 }));
  r.add(le);
  const B = document.createElement("input");
  B.id = "hk-rubber-label", B.type = "text", B.spellcheck = false, B.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, B.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(B);
  let L = null, U = null, N = false;
  const E = new S(), Y = (t, o, a, n, s, i) => {
    const d = n - t, f = s - o, h = i - a, g = Math.hypot(d, f, h);
    if (g < 0.01) {
      B.style.display = "none";
      return;
    }
    L = [t, o, a], U = [d / g, f / g, h / g], E.set((t + n) / 2, (o + s) / 2, (a + i) / 2), E.project(p());
    const _ = b.getBoundingClientRect(), w = _.left + (E.x * 0.5 + 0.5) * _.width, c = _.top + (-E.y * 0.5 + 0.5) * _.height;
    if (B.style.left = w + "px", B.style.top = c + "px", B.style.display = "block", !N) {
      if (B.value = `${g.toFixed(2)} m`, document.activeElement !== B) {
        const A = document.activeElement;
        A && (A.tagName === "INPUT" || A.tagName === "TEXTAREA") && A !== B || B.focus({ preventScroll: true });
      }
      try {
        B.select();
      } catch {
      }
    }
  }, I = () => {
    B.style.display = "none", L = null, U = null, N = false, document.activeElement === B && B.blur();
  }, V = (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      rn = t, de(`\u21C9 DESFASE distancia ${t} m \u2014 designe la l\xEDnea y luego el lado.`), B.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && Ue.length === 1) {
      const _ = Ue[0];
      Ue = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, _[0], _[1], _[2], t), de(`\u2713 C\xEDrculo r=${t} m en (${_[0].toFixed(2)}, ${_[1].toFixed(2)}, ${_[2].toFixed(2)}).`);
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
      vt = t, de(`\u{1F4D0} Altura ${t}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), B.blur();
      return;
    }
    if (!L || !U || !e.polylines) return;
    let a = U[0], n = U[1], s = U[2];
    Oe === "x" ? (a = Math.sign(a) || 1, n = 0, s = 0) : Oe === "y" ? (a = 0, n = Math.sign(n) || 1, s = 0) : Oe === "z" && (a = 0, n = 0, s = Math.sign(s) || 1);
    const i = L[0] + a * t, d = L[1] + n * t, f = L[2] + s * t;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, d, f]];
    const h = e.polylines.rawVal, g = h.length ? h[h.length - 1] : [];
    e.polylines.val = [...h.slice(0, -1), [...g, e.points.rawVal.length - 1]], B.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    x();
  }, te = (t) => {
    let o = t.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!o) return null;
    const a = o.startsWith("@");
    if (a && (o = o.slice(1)), o.includes("<")) {
      const s = o.split("<").map((i) => parseFloat(i.trim()));
      if (s.some(isNaN)) return null;
      if (s.length === 2) {
        const [i, d] = s;
        return a ? { kind: "relPolar", L: i, ang: d } : { kind: "absPolar", L: i, ang: d };
      }
      if (s.length === 3 && a) {
        const [i, d, f] = s;
        return { kind: "relSpherical", L: i, az: d, el: f };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((h) => parseFloat(h.trim()));
      if (s.some(isNaN)) return null;
      const [i, d, f = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: d, dz: f } : { kind: "absCart", x: i, y: d, z: f };
    }
    const n = parseFloat(o);
    return isNaN(n) || n <= 0 ? null : { kind: "length", L: n };
  }, ce = (t) => {
    if (!t) return null;
    if (t.kind === "absCart") return [t.x, t.y, t.z];
    if (t.kind === "relCart") return L ? [L[0] + t.dx, L[1] + t.dy, L[2] + t.dz] : null;
    if (t.kind === "absPolar") {
      const o = t.ang * Math.PI / 180;
      return [t.L * Math.cos(o), t.L * Math.sin(o), 0];
    }
    if (t.kind === "relPolar") {
      if (!L) return null;
      const o = t.ang * Math.PI / 180;
      return [L[0] + t.L * Math.cos(o), L[1] + t.L * Math.sin(o), L[2]];
    }
    if (t.kind === "relSpherical") {
      if (!L) return null;
      const o = t.az * Math.PI / 180, a = t.el * Math.PI / 180, n = t.L * Math.cos(a);
      return [L[0] + n * Math.cos(o), L[1] + n * Math.sin(o), L[2] + t.L * Math.sin(a)];
    }
    return null;
  }, he = (t) => {
    var _a2, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, t];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], L = t, B.blur();
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
    const o = te(t);
    if (!o) return false;
    if (o.kind === "length") return V(o.L), true;
    const a = ce(o);
    if (!a) return false;
    es(new S(a[0], a[1], a[2]), null), L = a, B.blur();
    try {
      (_a2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return true;
  }, B.addEventListener("keydown", (t) => {
    if (t.key === "Enter") {
      t.preventDefault();
      const a = te(B.value);
      if (!a) return;
      if (N = false, a.kind === "length") V(a.L), de(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const n = ce(a);
        if (!n) return;
        he(n);
        const s = a.kind;
        de(`\u270F ${s} \u2192 (${n[0].toFixed(2)}, ${n[1].toFixed(2)}, ${n[2].toFixed(2)})`);
      }
      return;
    }
    if (t.key === "Escape") {
      t.preventDefault(), N = false, B.blur();
      return;
    }
    const o = t.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      t.preventDefault(), setTimeout(() => {
        if (!N && B.style.display === "block") try {
          B.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(t.key) || t.key === "Backspace" || t.key === "Delete") && (N = true);
  }), window.addEventListener("keydown", (t) => {
    if (!L || !U || document.activeElement === B) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(t.key) && (B.value = t.key, B.focus(), B.setSelectionRange(1, 1), t.preventDefault());
  });
  const ae = document.createElement("div");
  ae.id = "hk-coord-readout", ae.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ae.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ae);
  const X = document.createElement("div");
  X.id = "hk-coord-fixed", X.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", X.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(X);
  const pe = new Ft(new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new Fn({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", r.add(pe), window.__hekatanRubberBand = pe;
  const O = new Ft(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.9 }));
  O.frustumCulled = false, O.visible = false, r.add(O);
  let xe = [];
  const ge = new it(), Ee = new lt(new en(1, 1), new ft({ color: 2282478, transparent: true, opacity: 0.08, side: At, depthWrite: false })), Me = new Wt(new ls(new en(1, 1)), new ht({ color: 2282478, transparent: true, opacity: 0.85 })), Ie = new Wt(new ze(), new ht({ color: 2282478, transparent: true, opacity: 0.3 })), Ke = (t, o) => {
    const a = [], n = Math.ceil(t / o);
    for (let s = -n; s <= n; s++) {
      const i = s * o;
      a.push(-t, i, 0, t, i, 0), a.push(i, -t, 0, i, t, 0);
    }
    Ie.geometry.dispose(), Ie.geometry = new ze(), Ie.geometry.setAttribute("position", new Ct(a, 3));
  };
  ge.add(Ee, Me, Ie), ge.visible = false, ge.frustumCulled = false, r.add(ge);
  const st = new it();
  st.frustumCulled = false, st.visible = false, r.add(st);
  const mt = (t) => {
    const o = new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), a = new Fn({ color: t, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Ft(o, a);
  }, z = mt(16711680), K = mt(65280), j = mt(35071);
  st.add(z, K, j);
  const J = [], ve = (t) => t.traverse((o) => {
    var _a2, _b, _c, _d;
    (_b = (_a2 = o.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), ue = mt(16761856);
  ue.material.dashSize = 0.28, ue.material.gapSize = 0.16, ue.material.opacity = 0.9, ue.frustumCulled = false, ue.visible = false, ue.renderOrder = 98, r.add(ue);
  const Se = (t) => {
    const o = new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0), new S(0, 0, 0)]), a = new ht({ color: t, transparent: true, opacity: 0.2, depthTest: false }), n = new vs(o, a);
    return n.renderOrder = 997, n.frustumCulled = false, n;
  }, me = Se(3462041), De = Se(16724804), Te = Se(6333946), We = new it();
  We.frustumCulled = false, We.visible = false, r.add(We), We.add(me, De, Te);
  const Qe = (t) => {
    const o = new en(1, 1), a = new ft({ color: t, transparent: true, opacity: 0.06, side: At, depthWrite: false }), n = new lt(o, a);
    return n.frustumCulled = false, n.renderOrder = 996, n;
  }, Ze = Qe(3462041), rt = Qe(16724804), Ne = Qe(6333946);
  We.add(Ze, rt, Ne);
  const we = (t, o, a, n) => {
    t.scale.set(2 * n, 2 * n, 1), a === "xy" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, 0, 0)) : a === "xz" ? (t.position.set(o[0], o[1], o[2]), t.rotation.set(Math.PI / 2, 0, 0)) : (t.position.set(o[0], o[1], o[2]), t.rotation.set(0, Math.PI / 2, 0));
  }, Pe = document.createElement("div");
  Pe.id = "hk-refplane-badge", Pe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Pe), window.__hekatanSetOrthoPlanes = (t) => {
    var _a2;
    if (window.__hekatanShowOrthoPlanes = t, We.visible = t, t) {
      const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0], d = window.__hekatanOrthoExt ?? 8;
      Xe(me, i, "xy", d), Xe(De, i, "xz", d), Xe(Te, i, "yz", d), we(Ze, i, "xy", d), we(rt, i, "xz", d), we(Ne, i, "yz", d), Ze.material.opacity = 0.05, rt.material.opacity = 0.05, Ne.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    x();
  }, window.__hekatanSetOrthoExt = (t) => {
    var _a2;
    if (window.__hekatanOrthoExt = t, !We.visible) {
      x();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], n = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : n.length > 0 && s[n[n.length - 1]] ? s[n[n.length - 1]] : [0, 0, 0];
    Xe(me, i, "xy", t), Xe(De, i, "xz", t), Xe(Te, i, "yz", t), we(Ze, i, "xy", t), we(rt, i, "xz", t), we(Ne, i, "yz", t), x();
  };
  const xt = (t) => {
    if (Ze.material.opacity = t === "xy" ? 0.09 : 0.025, rt.material.opacity = t === "xz" ? 0.09 : 0.025, Ne.material.opacity = t === "yz" ? 0.09 : 0.025, t) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[t];
      Pe.style.background = s.bg, Pe.style.color = s.text, Pe.textContent = `\u25A6 Plano ${t.toUpperCase()}`, Pe.style.display = "block";
    } else Pe.style.display = "none";
  }, Xe = (t, o, a, n) => {
    let s;
    a === "xy" ? s = [new S(o[0] - n, o[1] - n, o[2]), new S(o[0] + n, o[1] - n, o[2]), new S(o[0] + n, o[1] + n, o[2]), new S(o[0] - n, o[1] + n, o[2]), new S(o[0] - n, o[1] - n, o[2])] : a === "xz" ? s = [new S(o[0] - n, o[1], o[2] - n), new S(o[0] + n, o[1], o[2] - n), new S(o[0] + n, o[1], o[2] + n), new S(o[0] - n, o[1], o[2] + n), new S(o[0] - n, o[1], o[2] - n)] : s = [new S(o[0], o[1] - n, o[2] - n), new S(o[0], o[1] + n, o[2] - n), new S(o[0], o[1] + n, o[2] + n), new S(o[0], o[1] - n, o[2] + n), new S(o[0], o[1] - n, o[2] - n)], t.geometry.setFromPoints(s);
  };
  let Oe = null;
  window.__hekatanAxisLock = () => Oe;
  let kt = null, qe = null;
  const Ce = document.createElement("div");
  Ce.id = "hk-axis-lock-badge", Ce.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ce);
  const Ve = () => {
    if (!Oe) {
      Ce.style.display = "none";
      return;
    }
    const t = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = t[Oe], Ce.style.border = `1.5px solid ${t[Oe]}`, Ce.textContent = `\u{1F512} LOCK ${Oe.toUpperCase()}`, Ce.style.display = "block";
  };
  window.addEventListener("keydown", (t) => {
    var _a2, _b, _c, _d, _e, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== B) return;
    const a = t.key.toLowerCase(), n = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (t.key === "Enter" && n === "polyarea" && xe.length >= 3) {
      const s = pn();
      de(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), t.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Oe = Oe === a ? null : a, Ve(), t.preventDefault();
    else if (t.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), Jo(), t.preventDefault();
    } else t.key === "F3" ? (t.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : t.key === "F10" ? (t.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : t.key === "F8" && (t.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const t = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = t, t || Yn(), de(`\u{1F9F2} OSNAP ${t ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const t = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = t, t || (st.visible = false), de(`\u25C8 POLAR ${t ? "ON" : "OFF"} (F10)`);
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
  const He = new S(), Fe = new S(), ct = new S(), ut = (t) => {
    if (!Oe) return null;
    const o = t[0], a = t[1], n = t[2];
    return Oe === "x" ? (He.set(o - 1e4, a, n), Fe.set(o + 1e4, a, n)) : Oe === "y" ? (He.set(o, a - 1e4, n), Fe.set(o, a + 1e4, n)) : (He.set(o, a, n - 1e4), Fe.set(o, a, n + 1e4)), k.ray.distanceSqToSegment(He, Fe, null, ct), ct;
  };
  window.__hekatanProjectOnAxis = ut;
  const dt = new Ft(new ze().setFromPoints([new S(0, 0, 0), new S(0, 0, 0)]), new ht({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  dt.renderOrder = 998, dt.frustumCulled = false, dt.visible = false, r.add(dt);
  let Be = -1, Je = -1, wt = -1;
  const Ae = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ae;
  const Mt = new Ft(new ze().setFromPoints([new S(), new S()]), new ht({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Mt.renderOrder = 997, Mt.frustumCulled = false, Mt.visible = false, r.add(Mt);
  const _t = new lt(new xn(0.02, 12, 12), new ft({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  _t.renderOrder = 998, _t.visible = false, r.add(_t);
  const Dt = (t) => {
    const o = p();
    if (o.isOrthographicCamera) {
      const n = o, s = (n.top - n.bottom) / n.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(t);
    return Math.max(0.05, a / 10);
  }, Et = () => {
    _t.visible && _t.scale.setScalar(Dt(_t.position));
  }, $t = new it();
  $t.frustumCulled = false, r.add($t);
  const nn = 2282478;
  let Ut = null;
  const gn = (t, o, a, n) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, d = n;
    for (let f = 0; f < s.length; f++) {
      const h = s[f];
      if (!h) continue;
      const g = Math.hypot(t - h[0], o - h[1], a - h[2]);
      g < d && (d = g, i = f);
    }
    return i;
  }, Vt = () => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    for (; $t.children.length; ) {
      const d = $t.children.pop();
      (_b = (_a2 = d.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = d.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = ((_e = e.points) == null ? void 0 : _e.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], n = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const d of Ae) {
      const [f, ...h] = d.split(":");
      if (f === "pt") {
        const g = t[+h[0]];
        if (!g) continue;
        const _ = new lt(new xn(0.025, 12, 12), new ft({ color: nn, transparent: true, opacity: 0.9, depthTest: false }));
        _.position.set(g[0], g[1], g[2]), _.renderOrder = 999, _.__isSelectionPt = true, $t.add(_);
      } else if (f === "seg") {
        const g = o[+h[0]], _ = t[g == null ? void 0 : g[+h[1]]], w = t[g == null ? void 0 : g[+h[1] + 1]];
        if (!_ || !w) continue;
        const c = new ze().setFromPoints([new S(_[0], _[1], _[2]), new S(w[0], w[1], w[2])]), A = new Ft(c, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        A.renderOrder = 999, $t.add(A);
      } else if (f === "poly") {
        const _ = o[+h[0]].map((A) => {
          const Q = t[A];
          return Q ? new S(Q[0], Q[1], Q[2]) : null;
        }).filter(Boolean);
        if (_.length < 2) continue;
        const w = new ze().setFromPoints(_), c = new Ft(w, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        c.renderOrder = 999, $t.add(c);
      } else if (f === "aux") {
        const g = n[+h[0]];
        if (!g || g.length !== 6) continue;
        const _ = new ze().setFromPoints([new S(g[0], g[1], g[2]), new S(g[3], g[4], g[5])]), w = new Ft(_, new ht({ color: nn, transparent: true, opacity: 0.95, depthTest: false }));
        w.renderOrder = 999, $t.add(w);
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
  window.__hekatanRefreshSelection = Vt, window.__hekatanClearSelection = () => {
    Ae.clear(), Vt();
  };
  const on = (t, o, a, n, s, i, d, f, h) => {
    const g = d - n, _ = f - s, w = h - i, c = g * g + _ * _ + w * w;
    if (c < 1e-12) return Math.hypot(t - n, o - s, a - i);
    let A = ((t - n) * g + (o - s) * _ + (a - i) * w) / c;
    A = Math.max(0, Math.min(1, A));
    const Q = n + A * g, G = s + A * _, Z = i + A * w;
    return Math.hypot(t - Q, o - G, a - Z);
  }, vn = (t, o, a, n) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let d = -1, f = -1, h = n;
    for (let g = 0; g < s.length; g++) {
      const _ = s[g];
      for (let w = 0; w < _.length - 1; w++) {
        const c = i[_[w]], A = i[_[w + 1]];
        if (!c || !A) continue;
        const Q = on(t, o, a, c[0], c[1], c[2], A[0], A[1], A[2]);
        Q < h && (h = Q, d = g, f = w);
      }
    }
    return d >= 0 ? { polyIdx: d, segIdx: f, dist: h } : null;
  }, Ln = (t, o, a, n) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let d = -1, f = n;
    for (let h = 0; h < i.length; h++) {
      const g = i[h];
      if (!g || g.length !== 6) continue;
      const _ = on(t, o, a, g[0], g[1], g[2], g[3], g[4], g[5]);
      _ < f && (f = _, d = h);
    }
    return d;
  }, so = (t) => {
    const o = window.__hekatanDrawingAuxLines, n = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[t];
    if (!n || n.length !== 6) {
      dt.visible = false;
      return;
    }
    dt.geometry.setFromPoints([new S(n[0], n[1], n[2]), new S(n[3], n[4], n[5])]), dt.visible = true;
  }, ao = (t, o = -1) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[t], n = e.points.rawVal;
    if (!a || a.length < 2) {
      dt.visible = false;
      return;
    }
    const s = ((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const d of a) {
      const f = n[d];
      f && i.push(new S(f[0], f[1], f[2]));
    }
    else {
      const d = n[a[o]], f = n[a[o + 1]];
      d && i.push(new S(d[0], d[1], d[2])), f && i.push(new S(f[0], f[1], f[2]));
    }
    dt.geometry.setFromPoints(i), dt.visible = true;
  }, sn = (t) => {
    var _a2;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (t < 0 || t >= o.length) return;
    const a = o.filter((h, g) => g !== t), n = /* @__PURE__ */ new Set();
    for (const h of a) for (const g of h) n.add(g);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), d = [];
    for (let h = 0; h < s.length; h++) n.has(h) && (i.set(h, d.length), d.push(s[h]));
    const f = a.map((h) => h.map((g) => i.get(g)).filter((g) => g !== void 0));
    e.points.val = d, e.polylines.val = f, e.areas && (e.areas.val = e.areas.rawVal.filter((h) => h !== t).map((h) => h > t ? h - 1 : h)), dt.visible = false, Be = -1, Je = -1;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
  }, In = (t, o) => {
    var _a2, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (t < 0 || t >= a.length) return;
    if (((_b = (_a2 = e.areas) == null ? void 0 : _a2.rawVal) == null ? void 0 : _b.includes(t)) ?? false) {
      sn(t);
      return;
    }
    const s = a[t];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      sn(t);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const d = [...a.slice(0, t), ...i, ...a.slice(t + 1)], f = /* @__PURE__ */ new Set();
    for (const c of d) for (const A of c) f.add(A);
    const h = e.points.rawVal, g = /* @__PURE__ */ new Map(), _ = [];
    for (let c = 0; c < h.length; c++) f.has(c) && (g.set(c, _.length), _.push(h[c]));
    const w = d.map((c) => c.map((A) => g.get(A)).filter((A) => A !== void 0));
    if (e.points.val = _, e.polylines.val = w, e.areas) {
      const c = i.length - 1;
      e.areas.val = e.areas.rawVal.map((A) => A > t ? A + c : A);
    }
    dt.visible = false, Be = -1, Je = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  D.geometry.setAttribute("position", new Ct(e.points.rawVal.flat(), 3)), D.geometry.computeBoundingSphere(), D.frustumCulled = false, ie.frustumCulled = false, r.add(ie), W.position.set(0, 0, 0), W.rotateX(Math.PI / 2), W.geometry.rotateX(Math.PI / 2), W.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (t, o, a) => {
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
  const an = [];
  window.__hekatanCirculos = an;
  let Rn = [], Dn = "";
  const bn = () => {
    var _a2;
    const t = e.points.rawVal, o = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], a = `${t.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === Dn) return Rn;
    Dn = a;
    const n = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const d = s.slice(0, i - 1).map((_) => t[_]).filter(Boolean);
      if (d.length < 5) continue;
      const f = [0, 1, 2].map((_) => d.reduce((w, c) => w + c[_], 0) / d.length), h = d.map((_) => Math.hypot(_[0] - f[0], _[1] - f[1], _[2] - f[2])), g = h.reduce((_, w) => _ + w, 0) / h.length;
      g < 1e-9 || h.some((_) => Math.abs(_ - g) > 5e-3 * g) || n.push({ c: f, r: g });
    }
    return Rn = n;
  };
  window.__hekatanCentrosDeducidos = bn, window.__hekatanDrawCircle = (t, o, a, n, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a2;
    const d = Math.max(4, Math.round(s)), f = e.points.rawVal.length, h = [];
    for (let g = 0; g < d; g++) {
      const _ = 2 * Math.PI * g / d, w = n * Math.cos(_), c = n * Math.sin(_);
      let A;
      i === "xy" ? A = [t + w, o + c, a] : i === "xz" ? A = [t + w, o, a + c] : A = [t, o + w, a + c], h.push(A);
    }
    if (e.points.val = [...e.points.rawVal, ...h], an.push({ c: [t, o, a], r: n }), e.polylines) {
      const g = [...h.map((w, c) => f + c), f], _ = e.polylines.rawVal;
      ((_a2 = _[_.length - 1]) == null ? void 0 : _a2.length) > 0 ? e.polylines.val = [..._, g, []] : e.polylines.val = [..._.slice(0, -1), g, []];
    }
  }, window.__hekatanDrawArc = (t, o, a, n = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(n)), i = new S(...t), d = new S(...o), f = new S(...a), h = new S().subVectors(d, i), g = new S().subVectors(f, i), _ = new S().crossVectors(h, g).normalize(), w = new S().addVectors(i, d).multiplyScalar(0.5), c = new S().addVectors(d, f).multiplyScalar(0.5), A = new S().crossVectors(h, _).normalize(), Q = new S().crossVectors(new S().subVectors(f, d), _).normalize(), G = new S().subVectors(c, w), Z = A.x * Q.y - A.y * Q.x;
    let v;
    if (Math.abs(Z) > 1e-9) {
      const fe = (G.x * Q.y - G.y * Q.x) / Z;
      v = new S().addVectors(w, A.clone().multiplyScalar(fe));
    } else v = w.clone();
    const T = i.distanceTo(v), $ = new S().subVectors(i, v), H = new S().subVectors(f, v), P = Math.acos(Math.max(-1, Math.min(1, $.dot(H) / (T * T)))), C = e.points.rawVal.length, q = [], ne = _.clone();
    for (let fe = 0; fe <= s; fe++) {
      const _e = fe / s, Ge = P * _e, $e = new Hn().setFromAxisAngle(ne, Ge), et = $.clone().applyQuaternion($e).add(v);
      q.push([et.x, et.y, et.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...q], an.push({ c: [v.x, v.y, v.z], r: T }), e.polylines) {
      const fe = q.map((Ge, $e) => C + $e), _e = e.polylines.rawVal;
      e.polylines.val = [..._e.slice(0, -1), fe, []];
    }
  }, window.__hekatanDrawSlabChaflan = (t, o, a = 1, n = 6, s = 6) => {
    const i = Math.min(t[0], o[0]), d = Math.max(t[0], o[0]), f = Math.min(t[1], o[1]), h = Math.max(t[1], o[1]), g = (t[2] + o[2]) / 2, _ = d - i, w = h - f, c = Math.min(a, _ / 2 - 0.01, w / 2 - 0.01);
    if (c <= 0) return;
    const A = e.points.rawVal.length, Q = [], G = [], Z = (v, T) => {
      Q.push([v, T, g]), G.push(A + Q.length - 1);
    };
    for (let v = 0; v <= s; v++) Z(i + c + (_ - 2 * c) * v / s, f);
    for (let v = 1; v <= n; v++) {
      const T = -Math.PI / 2 + Math.PI / 2 * v / n;
      Z(d - c + c * Math.cos(T), f + c + c * Math.sin(T));
    }
    for (let v = 1; v <= s; v++) Z(d, f + c + (w - 2 * c) * v / s);
    for (let v = 1; v <= n; v++) {
      const T = 0 + Math.PI / 2 * v / n;
      Z(d - c + c * Math.cos(T), h - c + c * Math.sin(T));
    }
    for (let v = 1; v <= s; v++) Z(d - c - (_ - 2 * c) * v / s, h);
    for (let v = 1; v <= n; v++) {
      const T = Math.PI / 2 + Math.PI / 2 * v / n;
      Z(i + c + c * Math.cos(T), h - c + c * Math.sin(T));
    }
    for (let v = 1; v <= s; v++) Z(i, h - c - (w - 2 * c) * v / s);
    for (let v = 1; v <= n; v++) {
      const T = Math.PI + Math.PI / 2 * v / n;
      Z(i + c + c * Math.cos(T), f + c + c * Math.sin(T));
    }
    if (G.push(A), e.points.val = [...e.points.rawVal, ...Q], e.polylines) {
      const v = e.polylines.rawVal;
      e.polylines.val = [...v.slice(0, -1), G, []];
    }
  }, window.__hekatanDrawRect = (t, o) => {
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], d = o[0], f = o[1], h = o[2];
    let g;
    if (Math.abs(i - h) < 1e-6 ? g = [[n, s, i], [d, s, i], [d, f, i], [n, f, i]] : Math.abs(s - f) < 1e-6 ? g = [[n, s, i], [d, s, i], [d, s, h], [n, s, h]] : g = [[n, s, i], [n, f, i], [n, f, h], [n, s, h]], e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const _ = [a, a + 1, a + 2, a + 3, a], w = e.polylines.rawVal;
      e.polylines.val = [...w.slice(0, -1), _, []];
    }
  }, window.__hekatanDrawRectArea = (t, o) => {
    var _a2;
    const a = e.points.rawVal.length, n = t[0], s = t[1], i = t[2], d = o[0], f = o[1], h = o[2];
    let g;
    if (R && e.gridTarget) {
      const _ = e.gridTarget.rawVal, w = new An(..._.rotation), c = new S(1, 0, 0).applyEuler(w), A = new S(0, 1, 0).applyEuler(w), Q = new S(..._.position), G = new S(n, s, i), Z = new S(d, f, h), v = G.clone().sub(Q).dot(c), T = G.clone().sub(Q).dot(A), $ = Z.clone().sub(Q).dot(c), H = Z.clone().sub(Q).dot(A), P = (C, q) => Q.clone().addScaledVector(c, C).addScaledVector(A, q).toArray();
      g = [P(v, T), P($, T), P($, H), P(v, H)];
    } else Math.abs(i - h) < 1e-6 ? g = [[n, s, i], [d, s, i], [d, f, i], [n, f, i]] : Math.abs(s - f) < 1e-6 ? g = [[n, s, i], [d, s, i], [d, s, h], [n, s, h]] : g = [[n, s, i], [n, f, i], [n, f, h], [n, s, h]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const _ = e.polylines.rawVal, w = _.length - 1, c = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [..._.slice(0, -1), c, []], e.areas && (e.areas.val = [...e.areas.rawVal, w]);
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x();
  }, window.__hekatanFillClosedAreas = () => {
    var _a2, _b, _c;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Map(), a = (w, c) => {
      w !== c && ((o.get(w) ?? o.set(w, /* @__PURE__ */ new Set()).get(w)).add(c), (o.get(c) ?? o.set(c, /* @__PURE__ */ new Set()).get(c)).add(w));
    };
    for (const w of t) for (let c = 0; c + 1 < w.length; c++) a(w[c], w[c + 1]);
    const n = (w, c) => {
      var _a3;
      return !!((_a3 = o.get(w)) == null ? void 0 : _a3.has(c));
    }, s = /* @__PURE__ */ new Set(), i = [], d = [...o.keys()];
    for (const w of d) for (const c of o.get(w)) if (!(c < w)) {
      for (const A of o.get(c)) if (A !== w) for (const Q of o.get(A)) {
        if (Q === w || Q === c || !n(Q, w) || n(w, A) || n(c, Q)) continue;
        const G = [w, c, A, Q].slice().sort((Z, v) => Z - v).join("-");
        s.has(G) || (s.add(G), i.push([w, c, A, Q]));
      }
    }
    for (const w of d) for (const c of o.get(w)) if (!(c < w)) for (const A of o.get(c)) {
      if (A === w || !n(A, w)) continue;
      const Q = [w, c, A].slice().sort((G, Z) => G - Z).join("-");
      s.has(Q) || (s.add(Q), i.push([w, c, A]));
    }
    if (!i.length) return 0;
    const f = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []], h = new Set(f.map((w) => [...new Set(t[w] ?? [])].sort((c, A) => c - A).join("-"))), g = [...t];
    let _ = 0;
    for (const w of i) {
      const c = w.slice().sort((A, Q) => A - Q).join("-");
      h.has(c) || (h.add(c), g.push([...w, w[0]]), f.push(g.length - 1), _++);
    }
    if (_) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), e.polylines.val = g, e.areas && (e.areas.val = f);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      x();
    }
    return _;
  }, window.__hekatanMeshPolyArea = (t, o) => {
    var _a2;
    const a = t.length;
    if (a < 3) return 0;
    let n = 0, s = 0, i = 0;
    for (let ke = 0; ke < a; ke++) {
      const Re = t[ke], tt = t[(ke + 1) % a];
      n += (Re[1] - tt[1]) * (Re[2] + tt[2]), s += (Re[2] - tt[2]) * (Re[0] + tt[0]), i += (Re[0] - tt[0]) * (Re[1] + tt[1]);
    }
    const d = Math.hypot(n, s, i) || 1;
    n /= d, s /= d, i /= d;
    let f = t[1][0] - t[0][0], h = t[1][1] - t[0][1], g = t[1][2] - t[0][2];
    const _ = Math.hypot(f, h, g) || 1;
    f /= _, h /= _, g /= _;
    let w = s * g - i * h, c = i * f - n * g, A = n * h - s * f;
    const Q = Math.hypot(w, c, A) || 1;
    w /= Q, c /= Q, A /= Q;
    const G = t[0], Z = (ke) => [(ke[0] - G[0]) * f + (ke[1] - G[1]) * h + (ke[2] - G[2]) * g, (ke[0] - G[0]) * w + (ke[1] - G[1]) * c + (ke[2] - G[2]) * A], v = (ke, Re) => [G[0] + ke * f + Re * w, G[1] + ke * h + Re * c, G[2] + ke * g + Re * A], T = t.map(Z);
    let $ = 1 / 0, H = -1 / 0, P = 1 / 0, C = -1 / 0;
    for (const [ke, Re] of T) ke < $ && ($ = ke), ke > H && (H = ke), Re < P && (P = Re), Re > C && (C = Re);
    const q = H - $, ne = C - P;
    if (q < 1e-6 || ne < 1e-6) return 0;
    let fe = o && o > 0 ? o : 0.5;
    for (; q / fe * (ne / fe) > 2500; ) fe *= 2;
    fe = Math.min(fe, Math.min(q, ne));
    const _e = (ke, Re) => {
      let tt = false;
      for (let It = 0, Xt = T.length - 1; It < T.length; Xt = It++) {
        const [Rt, Qt] = T[It], [bo, qn] = T[Xt];
        Qt > Re != qn > Re && ke < (bo - Rt) * (Re - Qt) / (qn - Qt) + Rt && (tt = !tt);
      }
      return tt;
    }, Ge = Math.max(1, Math.round(q / fe)), $e = Math.max(1, Math.round(ne / fe)), et = q / Ge, nt = ne / $e, at = /* @__PURE__ */ new Map(), je = [], Le = e.points.rawVal.length, ot = (ke, Re) => {
      const tt = ke + "," + Re, It = at.get(tt);
      if (It !== void 0) return It;
      const Xt = Le + je.length;
      return je.push(v($ + ke * et, P + Re * nt)), at.set(tt, Xt), Xt;
    }, Ye = [];
    for (let ke = 0; ke < Ge; ke++) for (let Re = 0; Re < $e; Re++) {
      if (!_e($ + (ke + 0.5) * et, P + (Re + 0.5) * nt)) continue;
      const tt = ot(ke, Re), It = ot(ke + 1, Re), Xt = ot(ke + 1, Re + 1), Rt = ot(ke, Re + 1);
      Ye.push([tt, It, Xt, Rt]);
    }
    if (!Ye.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...je], e.polylines && e.areas) {
      let ke = e.polylines.rawVal.slice();
      ke.length && ke[ke.length - 1].length === 0 && (ke = ke.slice(0, -1));
      const Re = [];
      for (const tt of Ye) Re.push(ke.length), ke.push([tt[0], tt[1], tt[2], tt[3], tt[0]]);
      ke.push([]), e.polylines.val = ke, e.areas.val = [...e.areas.rawVal, ...Re];
    }
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), Ye.length;
  };
  const pn = () => {
    if (xe.length < 3) return xe = [], O.visible = false, x(), 0;
    const t = window.__hekatanMeshPolyArea(xe.slice());
    return xe = [], O.visible = false, x(), t;
  };
  window.__hekatanFinalizePolyArea = pn, window.__hekatanSetInclinedPlaneFrom3 = (t, o, a) => {
    var _a2;
    const n = new S(t[0], t[1], t[2]), s = new S(o[0], o[1], o[2]), i = new S(a[0], a[1], a[2]), d = new S().subVectors(s, n).cross(new S().subVectors(i, n));
    if (d.lengthSq() < 1e-9) return false;
    d.normalize();
    const f = new Hn().setFromUnitVectors(new S(0, 0, 1), d), h = new An().setFromQuaternion(f);
    e.gridTarget && (e.gridTarget.val = { position: [n.x, n.y, n.z], rotation: [h.x, h.y, h.z] }), R = true;
    const g = new S().addVectors(n, s).add(i).multiplyScalar(1 / 3), _ = Math.max(n.distanceTo(s), n.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, w = _ / 2;
    Ee.geometry.dispose(), Ee.geometry = new en(_, _), Me.geometry.dispose(), Me.geometry = new ls(new en(_, _)), Ke(w, 1), ge.position.copy(g), ge.quaternion.copy(f), ge.scale.set(1, 1, 1), ge.visible = true;
    try {
      (_a2 = window.__hekatanRefreshStatus) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return x(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), R = false, ge.visible = false, x();
  };
  const Kt = new it();
  Kt.visible = false, r.add(Kt), window.__hekatanShowAxes = (t, o, a = 12, n = 2) => {
    var _a2, _b;
    for (; Kt.children.length; ) {
      const _ = Kt.children.pop();
      (_a2 = _.geometry) == null ? void 0 : _a2.dispose(), (_b = _.material) == null ? void 0 : _b.dispose();
    }
    if (!t.length || !o.length) return;
    const s = Math.min(...o) - n, i = Math.max(...o) + n, d = Math.min(...t) - n, f = Math.max(...t) + n, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", g = (_, w, c, A, Q) => {
      const G = document.createElement("canvas");
      G.width = 64, G.height = 32;
      const Z = G.getContext("2d");
      Z.fillStyle = Q, Z.font = "bold 22px sans-serif", Z.textAlign = "center", Z.fillText(_, 32, 26);
      const v = new rs(G), T = new cs({ map: v, transparent: true }), $ = new ds(T);
      return $.position.set(w, c, A), $.scale.set(1.2, 0.6, 1), $;
    };
    t.forEach((_, w) => {
      const c = w < h.length ? h[w] : `X${w}`, A = new ze().setFromPoints([new S(_, s, 0), new S(_, i, 0), new S(_, s, 0), new S(_, s, a)]), Q = new Fn({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), G = new Wt(A, Q);
      G.computeLineDistances(), Kt.add(G), Kt.add(g(c, _, s - 0.5, 0, "#60a5fa")), Kt.add(g(c, _, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((_, w) => {
      const c = `${w + 1}`, A = new ze().setFromPoints([new S(d, _, 0), new S(f, _, 0), new S(d, _, 0), new S(d, _, a)]), Q = new Fn({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), G = new Wt(A, Q);
      G.computeLineDistances(), Kt.add(G), Kt.add(g(c, d - 0.5, _, 0, "#fb7185")), Kt.add(g(c, f + 0.5, _, 0, "#fb7185"));
    }), Kt.visible = true, x();
  }, window.__hekatanHideAxes = () => {
    Kt.visible = false, x();
  };
  const Ot = new it();
  Ot.visible = false, r.add(Ot);
  let un = [];
  window.__hekatanShowRefPlanes = (t = [0, 3, 6, 9, 12], o = 20, a = 0, n = 0) => {
    var _a2, _b;
    for (; Ot.children.length; ) {
      const i = Ot.children.pop();
      (_a2 = i.geometry) == null ? void 0 : _a2.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    un.forEach((i) => {
      r.remove(i), i.geometry.dispose(), i.material.dispose();
    }), un = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    t.forEach((i, d) => {
      const f = s[d % s.length], h = o / 2, g = [new S(a - h, n - h, i), new S(a + h, n - h, i), new S(a + h, n + h, i), new S(a - h, n + h, i), new S(a - h, n - h, i)], _ = new ze().setFromPoints(g), w = new ht({ color: f, transparent: true, opacity: 0.55 });
      Ot.add(new Ft(_, w));
      const c = document.createElement("canvas");
      c.width = 128, c.height = 32;
      const A = c.getContext("2d");
      A.fillStyle = `#${f.toString(16).padStart(6, "0")}`, A.font = "bold 18px sans-serif", A.fillText(`Z = ${i} m`, 4, 22);
      const Q = new rs(c), G = new cs({ map: Q, transparent: true }), Z = new ds(G);
      Z.position.set(a - h - 1.5, n - h - 1.5, i), Z.scale.set(2.5, 0.6, 1), Ot.add(Z);
      const v = new en(1e4, 1e4), T = new ft({ visible: false, side: At }), $ = new lt(v, T);
      $.position.set(0, 0, i), $.frustumCulled = false, $.userData = { refPlaneZ: i }, r.add($), un.push($);
    }), Ot.visible = true, x();
  }, window.__hekatanHideRefPlanes = () => {
    Ot.visible = false, un.forEach((t) => {
      t.visible = false;
    }), x();
  };
  const Mn = new it();
  Mn.frustumCulled = false, r.add(Mn);
  const As = () => {
    var _a2, _b, _c, _d;
    for (; Mn.children.length; ) {
      const a = Mn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxLines, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const n = new ze().setFromPoints([new S(a[0], a[1], a[2]), new S(a[3], a[4], a[5])]), s = new Fn({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new Ft(n, s);
      i.computeLineDistances(), Mn.add(i);
    }
  };
  ee.derive(() => {
    const t = window.__hekatanDrawingAuxLines;
    (t == null ? void 0 : t.val) && (t.val, As(), x());
  });
  const fn = new it();
  fn.frustumCulled = false, r.add(fn);
  const Ro = () => {
    var _a2, _b, _c, _d;
    for (; fn.children.length; ) {
      const a = fn.children.pop();
      (_b = (_a2 = a.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const t = window.__hekatanDrawingAuxPoints, o = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const n = new lt(new xn(0.025, 12, 12), new ft({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      n.position.set(a[0], a[1], a[2]), n.renderOrder = 996, n.scale.setScalar(Dt(n.position)), fn.add(n);
    }
  };
  ee.derive(() => {
    const t = window.__hekatanDrawingAuxPoints;
    (t == null ? void 0 : t.val) !== void 0 && (t.val, Ro(), x());
  }), u.addEventListener("change", () => {
    fn.children.forEach((t) => {
      t.scale.setScalar(Dt(t.position));
    });
  }), window.__hekatanRenderAuxPoints = Ro;
  const gt = new it(), Es = new lt(new xn(0.01, 12, 12), new ft({ color: 16724804, transparent: true, opacity: 0.95 })), Vs = new lt(new xn(0.015, 12, 12), new ft({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  gt.add(Es, Vs);
  const hn = 0.08, io = (t, o, a) => {
    const n = new ze().setFromPoints([new S(...t), new S(...o)]);
    return new Ft(n, new ht({ color: a, transparent: true, opacity: 0.7 }));
  };
  gt.add(io([-hn, 0, 0], [hn, 0, 0], 16711680)), gt.add(io([0, -hn, 0], [0, hn, 0], 65280)), gt.add(io([0, 0, -hn], [0, 0, hn], 35071)), gt.visible = false, gt.frustumCulled = false, r.add(gt);
  let lo = 2;
  const Bn = (t) => {
    const o = p(), a = (b == null ? void 0 : b.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(t) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, _n = () => {
    if (!gt.visible) return;
    const t = lo * Bn(gt.position) / 0.015;
    gt.scale.setScalar(Math.max(1e-4, Math.min(1e5, t)));
  };
  let kn = 10;
  const ro = (t) => Math.max(1e-4, kn * Bn(t));
  window.__hekatanAperturaPx = (t) => (typeof t == "number" && t > 0 && (kn = t), kn), window.__hekatanUpdateSnapScale = _n, window.__hekatanSnapMarker = gt, window.__hekatanMetrosPorPixel = Bn, window.__hekatanSnapPx = (t) => (typeof t == "number" && t > 0 && (lo = t, _n(), x()), lo);
  const Do = () => {
    $t.children.length !== 0 && $t.children.forEach((t) => {
      if (!t.__isSelectionPt) return;
      const o = t;
      o.scale.setScalar(Dt(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = Do, u.addEventListener("change", () => {
    var _a2;
    _n(), _t.visible && Et(), (_a2 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a2.call(window), Do();
  }), window.__hekatanShowSnap = (t, o, a) => {
    gt.position.set(t, o, a), gt.visible = true, _n(), x();
  }, window.__hekatanHideSnap = () => {
    gt.visible = false, x();
  }, b.addEventListener("pointermove", (t) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
    window.__hekatanCursorPx = { x: t.clientX, y: t.clientY };
    const o = M(t);
    if (!o) return;
    k.setFromCamera(F, o);
    const a = oe();
    if (a.length) {
      const n = a[0].point, s = t.altKey, i = ro(n), d = s ? null : (_a2 = window.__hekatanOsnapCompute) == null ? void 0 : _a2.call(window, n.x, n.y, n.z, i, { x: t.clientX, y: t.clientY });
      if (d) Zo(d.type, d.x, d.y, d.z), gt.position.set(d.x, d.y, d.z), gt.visible = true, n.set(d.x, d.y, d.z), Uo(d.type, t.clientX, t.clientY);
      else {
        Is(), Yn();
        const w = !s && window.__hekatanSnapEnabled !== false, c = window.__hekatanSnap2D ?? 0.5;
        w && c > 0 && (n.x = Math.round(n.x / c) * c, n.y = Math.round(n.y / c) * c, n.z = Math.round(n.z / c) * c), gt.position.copy(n), gt.visible = true;
      }
      _n();
      const f = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.tool) ?? "select";
      if (f === "select" || !f) {
        const w = (window.__hekatanSnap2D ?? 0.5) * 1.5, c = gn(n.x, n.y, n.z, w), A = vn(n.x, n.y, n.z, w), Q = Ln(n.x, n.y, n.z, w);
        if (c >= 0) {
          const T = e.points.rawVal[c];
          _t.position.set(T[0], T[1], T[2]), _t.visible = true, Et(), Mt.visible = false, Ut = { kind: "pt", a: c };
        } else if (A) {
          const T = e.points.rawVal, $ = e.polylines.rawVal[A.polyIdx], H = T[$[A.segIdx]], P = T[$[A.segIdx + 1]];
          Mt.geometry.setFromPoints([new S(H[0], H[1], H[2]), new S(P[0], P[1], P[2])]), Mt.visible = true, _t.visible = false, Ut = ((_f = (_e = e.areas) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.includes(A.polyIdx)) ?? false ? { kind: "poly", a: A.polyIdx } : { kind: "seg", a: A.polyIdx, b: A.segIdx };
        } else if (Q >= 0) {
          const $ = (((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [])[Q];
          $ && (Mt.geometry.setFromPoints([new S($[0], $[1], $[2]), new S($[3], $[4], $[5])]), Mt.visible = true, _t.visible = false, Ut = { kind: "aux", a: Q });
        } else Mt.visible = false, _t.visible = false, Ut = null;
        ae.style.left = t.clientX + "px", ae.style.top = t.clientY + "px", ae.style.display = "block";
        let G = n;
        if ((Ut == null ? void 0 : Ut.kind) === "pt") {
          const T = e.points.rawVal[Ut.a];
          T && (G = new S(T[0], T[1], T[2]));
        }
        const Z = `X=${G.x.toFixed(2)} Y=${G.y.toFixed(2)} Z=${G.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [G.x, G.y, G.z], Ut) {
          const T = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ae.textContent = `${Z}  \xB7  \u{1F5B1} Click \u2192 ${T[Ut.kind]}`;
        } else ae.textContent = Z;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = Z), qe = { p: G.clone(), x: t.clientX, y: t.clientY }, pe.visible = false, st.visible = false, ue.visible = false, x();
        return;
      }
      if (f === "delete" || f === "trim" || f === "extend" || f === "offset") {
        const w = (window.__hekatanSnap2D ?? 0.5) * 1.5, c = vn(n.x, n.y, n.z, w), A = Ln(n.x, n.y, n.z, w);
        let Q = false;
        if (A >= 0) if (!c) Q = true;
        else {
          const T = window.__hekatanDrawingAuxLines, H = ((T == null ? void 0 : T.rawVal) ?? (T == null ? void 0 : T.val) ?? T ?? [])[A];
          on(n.x, n.y, n.z, H[0], H[1], H[2], H[3], H[4], H[5]) < c.dist && (Q = true);
        }
        Q ? (wt = A, Be = -1, Je = -1, so(A)) : c ? (Be = c.polyIdx, Je = c.segIdx, wt = -1, ao(c.polyIdx, c.segIdx)) : (Be = -1, Je = -1, wt = -1, dt.visible = false), pe.visible = false, st.visible = false, ue.visible = false, I(), ae.style.left = t.clientX + "px", ae.style.top = t.clientY + "px", ae.style.display = "block";
        const G = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        let Z = "";
        Q ? Z = `\u{1F5D1} l\xEDnea aux #${wt + 1}` : c ? Z = ((_i = (_h = e.areas) == null ? void 0 : _h.rawVal) == null ? void 0 : _i.includes(c.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${c.polyIdx + 1}` : `\u{1F5D1} seg ${c.segIdx + 1} / poly #${c.polyIdx + 1}` : Z = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ae.textContent = `${G}  \xB7  ${Z}`;
        const v = document.getElementById("hk-coord-fixed");
        v && (v.textContent = G), x();
        return;
      } else dt.visible = false, Be = -1, wt = -1;
      ae.style.left = t.clientX + "px", ae.style.top = t.clientY + "px", ae.style.display = "block";
      const h = ((_j = e.polylines) == null ? void 0 : _j.rawVal) ?? [], g = h[h.length - 1] ?? [], _ = e.points.rawVal ?? [];
      if (g.length > 0 && _[g[g.length - 1]]) {
        const w = g[g.length - 1], c = _[w];
        let A = Oe;
        if (kt = null, !A && window.__hekatanAxisSnap !== false) {
          const $e = b.getBoundingClientRect(), et = t.clientX, nt = t.clientY, at = ((_k = settings.gridSize) == null ? void 0 : _k.rawVal) ?? 10, je = new S(c[0], c[1], c[2]), Le = [["x", new S(1, 0, 0)], ["y", new S(0, 1, 0)], ["z", new S(0, 0, 1)]], ot = (ke) => {
            const Re = ke.clone().project(o);
            return { x: (Re.x * 0.5 + 0.5) * $e.width + $e.left, y: (-Re.y * 0.5 + 0.5) * $e.height + $e.top };
          };
          let Ye = null;
          for (const [ke, Re] of Le) {
            const tt = ot(je.clone().addScaledVector(Re, -at)), It = ot(je.clone().addScaledVector(Re, at)), Xt = It.x - tt.x, Rt = It.y - tt.y, Qt = et - tt.x, bo = nt - tt.y, qn = Xt * Xt + Rt * Rt || 1;
            let Kn = (Qt * Xt + bo * Rt) / qn;
            Kn = Math.max(0, Math.min(1, Kn));
            const ts = Math.hypot(et - (tt.x + Kn * Xt), nt - (tt.y + Kn * Rt));
            if (Ye === null || ts < Ye.dpx) {
              const Mo = k.ray, ns = je.clone().sub(Mo.origin), _o2 = Re.dot(Mo.direction), os = Re.dot(ns), qs = Mo.direction.dot(ns), ss = 1 - _o2 * _o2, Ks = Math.abs(ss) < 1e-6 ? -os : (_o2 * qs - os) / ss;
              Ye = { axis: ke, dpx: ts, pt: je.clone().addScaledVector(Re, Ks) };
            }
          }
          Ye && Ye.dpx <= 12 && (n.copy(Ye.pt), A = Ye.axis, kt = Ye.pt.clone());
        }
        const Q = !!window.__hekatanOrthoMode;
        if (!A && Q) {
          const $e = Math.abs(n.x - c[0]), et = Math.abs(n.y - c[1]), nt = Math.abs(n.z - c[2]), at = (_l = a[0]) == null ? void 0 : _l.object;
          let je = null;
          at === Ze ? je = "xy" : at === rt ? je = "xz" : at === Ne && (je = "yz"), je === "xy" ? A = $e >= et ? "x" : "y" : je === "xz" ? A = $e >= nt ? "x" : "z" : je === "yz" ? A = et >= nt ? "y" : "z" : A = $e >= et && $e >= nt ? "x" : et >= nt ? "y" : "z";
        }
        const G = window.__hekatanPolarTrack !== false;
        if (!A && G) {
          const $e = n.x - c[0], et = n.y - c[1], nt = n.z - c[2], at = Math.hypot($e, et, nt);
          if (at > 1e-3) {
            const Le = Math.tan(6 * Math.PI / 180) * at, ot = Math.hypot(et, nt), Ye = Math.hypot($e, nt), ke = Math.hypot($e, et), Re = [["x", ot], ["y", Ye], ["z", ke]];
            Re.sort((tt, It) => tt[1] - It[1]), Re[0][1] <= Le && (A = Re[0][0]);
          }
        }
        if (A) {
          const $e = c[0], et = c[1], nt = c[2];
          A === "x" ? n.set(n.x, et, nt) : A === "y" ? n.set($e, n.y, nt) : n.set($e, et, n.z);
          const at = !!Oe, Le = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[A];
          Ce.style.background = "rgba(15,23,42,0.92)", Ce.style.color = Le, Ce.style.border = `1.5px solid ${Le}`;
          const ot = (_m = a[0]) == null ? void 0 : _m.object;
          let Ye = null;
          ot === Ze ? Ye = "xy" : ot === rt ? Ye = "xz" : ot === Ne && (Ye = "yz");
          const ke = Ye ? ` (plano ${Ye.toUpperCase()})` : "";
          Ce.textContent = at ? `\u{1F512} LOCK ${A.toUpperCase()}${ke}` : `\u22A5 ORTO ${A.toUpperCase()}${ke}`, Ce.style.left = t.clientX + 20 + "px", Ce.style.top = t.clientY + 18 + "px", Ce.style.transform = "none", Ce.style.display = "block";
        } else Oe || (Ce.style.display = "none");
        let Z = null;
        if (!s && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const $e = e.points.rawVal, et = A ? [A] : ["z", "x", "y"], nt = { x: t.clientX, y: t.clientY };
          let at = 1 / 0;
          for (const je of $e) if (!(Math.abs(je[0] - c[0]) < 1e-9 && Math.abs(je[1] - c[1]) < 1e-9 && Math.abs(je[2] - c[2]) < 1e-9)) for (const Le of et) {
            const ot = new S(Le === "x" ? je[0] : n.x, Le === "y" ? je[1] : n.y, Le === "z" ? je[2] : n.z), Ye = ho(ot.x, ot.y, ot.z);
            if (!Ye) continue;
            const ke = Math.hypot(Ye.x - nt.x, Ye.y - nt.y);
            ke < kn && ke < at && (at = ke, Z = { q: je, eje: Le });
          }
        }
        Z ? (Z.eje === "x" ? n.x = Z.q[0] : Z.eje === "y" ? n.y = Z.q[1] : n.z = Z.q[2], ue.geometry.setFromPoints([new S(Z.q[0], Z.q[1], Z.q[2]), new S(n.x, n.y, n.z)]), (_n2 = ue.computeLineDistances) == null ? void 0 : _n2.call(ue), ue.visible = true, gt.position.set(n.x, n.y, n.z), gt.visible = true, Uo("track", t.clientX, t.clientY)) : ue.visible = false, qe = { p: n.clone(), x: t.clientX, y: t.clientY };
        const v = Math.hypot(n.x - c[0], n.y - c[1], n.z - c[2]), T = Math.atan2(n.y - c[1], n.x - c[0]) * 180 / Math.PI, $ = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ae.textContent = `${$} | \u0394L=${v.toFixed(2)}m ${T.toFixed(0)}\xB0`;
        const H = document.getElementById("hk-coord-fixed");
        H && (H.textContent = $), pe.geometry.setFromPoints([new S(c[0], c[1], c[2]), new S(n.x, n.y, n.z)]), (_o = pe.computeLineDistances) == null ? void 0 : _o.call(pe), pe.visible = true, Y(c[0], c[1], c[2], n.x, n.y, n.z);
        const P = window.__hekatanOrthoExt ?? 8, C = window.__hekatanShowOrthoPlanes !== false;
        We.visible = C, C || xt(null), C && (Xe(me, c, "xy", P), Xe(De, c, "xz", P), Xe(Te, c, "yz", P), we(Ze, c, "xy", P), we(rt, c, "xz", P), we(Ne, c, "yz", P));
        const q = C ? k.intersectObjects([Ze, rt, Ne], false) : [];
        let ne = null;
        if (q.length > 0) {
          const $e = q[0].object;
          $e === Ze ? ne = "xy" : $e === rt ? ne = "xz" : $e === Ne && (ne = "yz");
        }
        xt(ne), ne && (Pe.style.left = t.clientX + "px", Pe.style.top = t.clientY + "px"), z.geometry.setFromPoints([new S(c[0] - P, c[1], c[2]), new S(c[0] + P, c[1], c[2])]), (_p = z.computeLineDistances) == null ? void 0 : _p.call(z), K.geometry.setFromPoints([new S(c[0], c[1] - P, c[2]), new S(c[0], c[1] + P, c[2])]), (_q = K.computeLineDistances) == null ? void 0 : _q.call(K), j.geometry.setFromPoints([new S(c[0], c[1], c[2] - P), new S(c[0], c[1], c[2] + P)]), (_r = j.computeLineDistances) == null ? void 0 : _r.call(j), st.visible = true;
        const fe = z.material, _e2 = K.material, Ge = j.material;
        A === "x" ? (fe.opacity = 0.95, _e2.opacity = 0.1, Ge.opacity = 0.1) : A === "y" ? (fe.opacity = 0.1, _e2.opacity = 0.95, Ge.opacity = 0.1) : A === "z" ? (fe.opacity = 0.1, _e2.opacity = 0.1, Ge.opacity = 0.95) : (fe.opacity = 0.5, _e2.opacity = 0.5, Ge.opacity = 0.5);
      } else {
        const w = `X=${n.x.toFixed(2)} Y=${n.y.toFixed(2)} Z=${n.z.toFixed(2)}`;
        ae.textContent = w;
        const c = document.getElementById("hk-coord-fixed");
        if (c && (c.textContent = w), pe.visible = false, st.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(f)) {
          if (L = null, U = null, B.style.left = t.clientX + 20 + "px", B.style.top = t.clientY - 28 + "px", B.style.display = "block", !N) {
            B.value = `${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)}`;
            const Q = document.activeElement;
            !(Q && (Q.tagName === "INPUT" || Q.tagName === "TEXTAREA") && Q !== B) && document.activeElement !== B && B.focus({ preventScroll: true });
            try {
              B.select();
            } catch {
            }
          }
        } else I();
      }
      x();
    } else Yn(), ae.style.display = "none", gt.visible = false, pe.visible = false, st.visible = false, I(), x();
  }), ee.derive(() => {
    var _a2;
    if (!e.gridTarget) return;
    const t = new Hn().setFromEuler(new An(...e.gridTarget.val.rotation)), o = new Hn().setFromAxisAngle(new S(1, 0, 0), Math.PI / 2);
    $a(l, { position: new S(...e.gridTarget.val.position), quaternion: t.clone().multiply(o) }, x);
    {
      const n = e.gridTarget.val.position[2], s = Math.abs(t.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of J) r.remove(i), ve(i);
      if (J.length = 0, s) {
        const i = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], d = /* @__PURE__ */ new Set([0]);
        for (const h of i) d.add(+h[2].toFixed(3));
        for (const h of window.__hekatanLevels ?? []) isFinite(h == null ? void 0 : h.z) && d.add(+h.z.toFixed(3));
        const f = [...d].sort((h, g) => h - g).slice(0, 24);
        for (const h of f) {
          if (Math.abs(h - n) < 1e-6) continue;
          const g = l.clone(true);
          g.name = `hekatan-grid-nivel-${h}`, g.traverse((_) => {
            _.material && (_.material = _.material.clone(), _.material.transparent = true, _.material.opacity = (_.material.opacity ?? 1) * (Math.abs(h) < 1e-6 ? 0.5 : 0.22));
          }), g.position.set(0, 0, h), g.quaternion.copy(o), r.add(g), J.push(g);
        }
      }
    }
    W.position.set(...e.gridTarget.val.position), W.quaternion.setFromEuler(new An(...e.gridTarget.val.rotation)), W.updateMatrixWorld();
    const a = new S(0, 0, 1).applyEuler(new An(...e.gridTarget.val.rotation));
    R = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  }), ee.derive(() => {
    D.geometry.setAttribute("position", new Ct(e.points.val.flat(), 3)), D.geometry.computeBoundingSphere();
  }), ee.derive(() => {
    const t = 0.05 * m * 0.5 * y.val;
    k.params.Points.threshold = 0.4 * t;
  }), ee.derive(() => {
    var _a2;
    const t = e.points.val ?? [], a = (((_a2 = e.polylines) == null ? void 0 : _a2.val) ?? []).at(-1) ?? [], n = [];
    for (const i of a) {
      const [d, f, h] = t[i];
      n.push(d, f, h);
    }
    const s = new ze();
    s.setAttribute("position", new Ct(n, 3)), le.geometry.dispose(), le.geometry = s;
  });
  let co = false, ln = 0;
  b.addEventListener("pointerdown", () => {
    co = true;
  }), b.addEventListener("pointerup", () => {
    co = false;
  }), b.addEventListener("pointermove", () => {
    co && ln++;
  });
  const Lt = document.createElement("div");
  Lt.id = "hk-window-select", Lt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Lt);
  let Gt = null, Sn = false, Yt = null;
  const po = (t, o, a, n, s) => {
    s ? (Lt.style.borderColor = "#34d399", Lt.style.borderStyle = "dashed", Lt.style.background = "rgba(52, 211, 153, 0.10)") : (Lt.style.borderColor = "#22d3ee", Lt.style.borderStyle = "solid", Lt.style.background = "rgba(34, 211, 238, 0.10)"), Lt.style.left = Math.min(t, a) + "px", Lt.style.top = Math.min(o, n) + "px", Lt.style.width = Math.abs(a - t) + "px", Lt.style.height = Math.abs(n - o) + "px", Lt.style.display = "block";
  }, Bo = (t, o, a, n, s) => {
    var _a2, _b, _c, _d;
    const i = Math.min(t, a), d = Math.max(t, a), f = Math.min(o, n), h = Math.max(o, n), g = a < t, _ = b.getBoundingClientRect(), w = p();
    w.updateMatrixWorld();
    const c = (C) => {
      const q = new S(C[0], C[1], C[2]);
      return q.project(w), { x: _.left + (q.x * 0.5 + 0.5) * _.width, y: _.top + (-q.y * 0.5 + 0.5) * _.height };
    }, A = (C) => C.x >= i && C.x <= d && C.y >= f && C.y <= h, Q = (C, q) => !(C.x < i && q.x < i || C.x > d && q.x > d || C.y < f && q.y < f || C.y > h && q.y > h);
    s || Ae.clear();
    let G = 0;
    const Z = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [];
    for (let C = 0; C < Z.length; C++) {
      const q = Z[C];
      q && A(c(q)) && (Ae.add(`pt:${C}`), G++);
    }
    const v = (C, q) => g ? A(C) || A(q) || Q(C, q) : A(C) && A(q), T = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], $ = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let C = 0; C < T.length; C++) {
      const q = T[C];
      if ($.includes(C)) {
        let fe;
        if (!g) fe = q.every((_e) => {
          const Ge = Z[_e];
          return !!Ge && A(c(Ge));
        });
        else {
          fe = false;
          for (let _e = 0; _e < q.length - 1; _e++) {
            const Ge = Z[q[_e]], $e = Z[q[_e + 1]];
            if (!(!Ge || !$e) && v(c(Ge), c($e))) {
              fe = true;
              break;
            }
          }
        }
        fe && (Ae.add(`poly:${C}`), G++);
      } else for (let fe = 0; fe < q.length - 1; fe++) {
        const _e = Z[q[fe]], Ge = Z[q[fe + 1]];
        !_e || !Ge || v(c(_e), c(Ge)) && (Ae.add(`seg:${C}:${fe}`), G++);
      }
    }
    const P = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let C = 0; C < P.length; C++) {
      const q = P[C];
      if (!q || q.length !== 6) continue;
      const ne = c([q[0], q[1], q[2]]), fe = c([q[3], q[4], q[5]]);
      v(ne, fe) && (Ae.add(`aux:${C}`), G++);
    }
    Vt(), de(G === 0 && !g ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${g ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${G} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ae.size})`), Lt.style.display = "none";
  }, Nn = () => {
    Yt && (Yt = null, Lt.style.display = "none", de("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Nn, window.addEventListener("keydown", (t) => {
    t.key === "Escape" && Yt && Nn();
  });
  const No = () => {
    var _a2, _b, _c, _d;
    if (Ae.size === 0) return false;
    const t = [...Ae], o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], n = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const Q of t) {
      const [G, ...Z] = Q.split(":");
      if (G === "pt") d.add(+Z[0]);
      else if (G === "poly") f.add(+Z[0]);
      else if (G === "seg") {
        const v = +Z[0], T = +Z[1];
        h.has(v) || h.set(v, /* @__PURE__ */ new Set()), h.get(v).add(T);
      } else G === "aux" && g.add(+Z[0]);
    }
    let _ = 0, w = [], c = [];
    const A = /* @__PURE__ */ new Map();
    for (let Q = 0; Q < a.length; Q++) {
      if (f.has(Q)) {
        _++;
        continue;
      }
      A.set(Q, w.length);
      const G = h.get(Q);
      if (G && G.size > 0) {
        let Z = [];
        for (let v = 0; v < a[Q].length; v++) Z.push(a[Q][v]), v < a[Q].length - 1 && G.has(v) && (Z.length >= 2 && w.push(Z), Z = [], _++);
        (Z.length >= 2 || Z.length === 1) && w.push(Z);
      } else w.push([...a[Q]]);
    }
    if (d.size > 0) {
      const Q = [], G = /* @__PURE__ */ new Map();
      for (let v = 0; v < o.length; v++) {
        if (d.has(v)) {
          _++;
          continue;
        }
        G.set(v, Q.length), Q.push([...o[v]]);
      }
      const Z = [];
      for (const v of w) {
        let T = [];
        for (const $ of v) {
          const H = G.get($);
          H === void 0 ? (T.length >= 2 && Z.push(T), T = []) : T.push(H);
        }
        T.length >= 2 && Z.push(T);
      }
      w = Z, e.points.val = Q;
    }
    for (const Q of n) {
      const G = A.get(Q);
      G !== void 0 && G < w.length && c.push(G);
    }
    if (e.polylines && (e.polylines.val = w), e.areas && (e.areas.val = c), g.size > 0 && s) {
      const Q = i.filter((G, Z) => !g.has(Z));
      "val" in s ? s.val = Q : window.__hekatanDrawingAuxLines = Q, _ += g.size;
    }
    Ae.clear(), Vt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return de(`\u{1F5D1} ${_} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = No, window.addEventListener("keydown", (t) => {
    if (t.key !== "Delete" && t.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || Ae.size !== 0 && (t.preventDefault(), No());
  });
  const Bt = document.createElement("div");
  Bt.id = "hk-properties-pane";
  const Xo = "hk-props-pane-pos";
  let Pn = null;
  try {
    const t = localStorage.getItem(Xo);
    t && (Pn = JSON.parse(t));
  } catch {
  }
  Bt.style.cssText = ["position:fixed", Pn ? `left:${Pn.left}px` : "left:14px", Pn ? `top:${Pn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Bt);
  const Ts = () => {
    const t = Bt.querySelector(".tp-rotv_b");
    if (!t || t.__hkDragWired) return;
    t.__hkDragWired = true, t.style.cursor = "move", t.style.userSelect = "none";
    let o = false, a = 0, n = 0, s = 0, i = 0;
    t.addEventListener("mousedown", (d) => {
      o = true, a = d.clientX, n = d.clientY;
      const f = Bt.getBoundingClientRect();
      s = f.left, i = f.top, Bt.style.transform = "none", Bt.style.left = `${s}px`, Bt.style.top = `${i}px`, d.preventDefault();
    }), window.addEventListener("mousemove", (d) => {
      if (!o) return;
      const f = d.clientX - a, h = d.clientY - n, g = Math.max(0, Math.min(window.innerWidth - 80, s + f)), _ = Math.max(0, Math.min(window.innerHeight - 40, i + h));
      Bt.style.left = `${g}px`, Bt.style.top = `${_}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Xo, JSON.stringify({ left: parseFloat(Bt.style.left), top: parseFloat(Bt.style.top) }));
        } catch {
        }
      }
    });
  }, re = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Tt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let pt = null;
  const St = (t, o, a, n) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: t, ids: o, prop: a, value: n } }));
  }, $s = () => {
    if (pt && (pt.dispose(), pt = null), Ae.size === 0) {
      Bt.style.display = "none";
      return;
    }
    const t = [...Ae], o = t.filter((w) => w.startsWith("pt:")), a = t.filter((w) => w.startsWith("seg:")), n = t.filter((w) => w.startsWith("poly:")), s = t.filter((w) => w.startsWith("aux:")), i = o.length > 0, d = a.length > 0, f = n.length > 0, h = !i && !d && !f, g = [];
    o.length && g.push(`\u{1F535} ${o.length} nodo(s)`), a.length && g.push(`\u{1F4CF} ${a.length} segmento(s)`), n.length && g.push(`\u25AD ${n.length} \xE1rea(s)`), s.length && g.push(`\u250A ${s.length} aux`);
    const _ = `\u{1F3AF} ${Ae.size} item(s) \u2014 ${g.join(", ")}`;
    pt = new Ms({ container: Bt, title: _ });
    {
      const w = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      w.addBinding(Tt, "dx", { label: "\u0394x (m)", step: 0.1 }), w.addBinding(Tt, "dy", { label: "\u0394y (m)", step: 0.1 }), w.addBinding(Tt, "dz", { label: "\u0394z (m)", step: 0.1 }), w.addBinding(Tt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), w.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, Tt.copias);
        de(G ? `\u29C9 Replicado \xD7${G} (\u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const c = { vuelo: 1.5, losa: true, borde: true, ambos: true }, A = w.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      A.addBinding(c, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), A.addBinding(c, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), A.addBinding(c, "borde", { label: "con viga de borde" }), A.addBinding(c, "ambos", { label: "a los dos lados" }), A.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanVoladoSelection) == null ? void 0 : _a2.call(window, c.vuelo, { losa: c.losa, vigaBorde: c.borde, lados: c.ambos ? "ambos" : "afuera" });
        de(G ? `\u2310 Volado de ${c.vuelo} m en ${G} pa\xF1o(s)` + (c.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), w.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a2;
        const G = (_a2 = window.__hekatanReplicateSelection) == null ? void 0 : _a2.call(window, Tt.dx, Tt.dy, Tt.dz, 1);
        de(G ? `\u2192 Copia desplazada \u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const Q = w.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      Q.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a2;
        return (_a2 = window.__hekatanToggleSnap) == null ? void 0 : _a2.call(window);
      }), Q.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), de(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const w = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      w.addBinding(re, "Ux"), w.addBinding(re, "Uy"), w.addBinding(re, "Uz"), w.addBinding(re, "Rx"), w.addBinding(re, "Ry"), w.addBinding(re, "Rz");
      const c = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      c.addBinding(re, "Kx", { label: "Kx", min: 0, step: 100 }), c.addBinding(re, "Ky", { label: "Ky", min: 0, step: 100 }), c.addBinding(re, "Kz", { label: "Kz", min: 0, step: 100 }), c.addBinding(re, "Krx", { label: "Krx", min: 0, step: 1e3 }), c.addBinding(re, "Kry", { label: "Kry", min: 0, step: 1e3 }), c.addBinding(re, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const A = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      A.addBinding(re, "Fx", { step: 0.1 }), A.addBinding(re, "Fy", { step: 0.1 }), A.addBinding(re, "Fz", { step: 0.1 }), A.addBinding(re, "Mx", { step: 0.1 }), A.addBinding(re, "My", { step: 0.1 }), A.addBinding(re, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(re, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(re, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let Z = 0;
        const v = [re.Ux, re.Uy, re.Uz, re.Rx, re.Ry, re.Rz];
        v.some((H) => H) && (St("nodes", o, "supports", v), Z++);
        const T = [re.Fx, re.Fy, re.Fz, re.Mx, re.My, re.Mz];
        T.some((H) => H !== 0) && (St("nodes", o, "loads", T), Z++);
        const $ = [re.Kx, re.Ky, re.Kz, re.Krx, re.Kry, re.Krz];
        if ($.some((H) => H !== 0) && (St("nodes", o, "springs", $), Z++), re.mass !== 0 && (St("nodes", o, "mass", re.mass), Z++), re.diaphragm !== "Ninguno" && (St("nodes", o, "diaphragm", re.diaphragm), Z++), Z === 0) {
          de("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let H = document.getElementById("hk-prop-toast");
          H || (H = document.createElement("div"), H.id = "hk-prop-toast", H.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(H)), H.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", H.style.background = "rgba(217,119,6,0.97)", H.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            H && (H.style.opacity = "0");
          }, 3200);
        } else de(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (d) {
      const w = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      w.addBinding(re, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), w.addBinding(re, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const c = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      c.addBinding(re, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), c.addBinding(re, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), c.addBinding(re, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), c.addBinding(re, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(re, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(re, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const G = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      G.addBinding(re, "relMxI", { label: "Mx I" }), G.addBinding(re, "relMyI", { label: "My I" }), G.addBinding(re, "relMzI", { label: "Mz I" });
      const Z = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      Z.addBinding(re, "relMxJ", { label: "Mx J" }), Z.addBinding(re, "relMyJ", { label: "My J" }), Z.addBinding(re, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(re, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const T = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      T.addBinding(re, "LKx", { label: "LKx", min: 0, step: 100 }), T.addBinding(re, "LKy", { label: "LKy", min: 0, step: 100 }), T.addBinding(re, "LKz", { label: "LKz", min: 0, step: 100 });
      const $ = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      $.addBinding(re, "qx", { step: 0.1 }), $.addBinding(re, "qy", { step: 0.1 }), $.addBinding(re, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(re, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        St("segs", a, "section", re.section), St("segs", a, "material", re.material_frame);
        const P = { A: re.A_mod, Iz: re.Iz_mod, Iy: re.Iy_mod, J: re.J_mod };
        (P.A !== 1 || P.Iz !== 1 || P.Iy !== 1 || P.J !== 1) && St("segs", a, "modifiers", P), re.insertionPoint !== "10 \u2014 Centroid" && St("segs", a, "insertionPoint", re.insertionPoint), re.beta !== 0 && St("segs", a, "beta", re.beta);
        const C = [re.relMxI, re.relMyI, re.relMzI], q = [re.relMxJ, re.relMyJ, re.relMzJ];
        (C.some((_e) => _e) || q.some((_e) => _e)) && St("segs", a, "releases", { i: C, j: q }), re.hinges !== "None" && St("segs", a, "hinges", re.hinges);
        const ne = [re.LKx, re.LKy, re.LKz];
        ne.some((_e) => _e !== 0) && St("segs", a, "lineSprings", ne);
        const fe = [re.qx, re.qy, re.qz];
        fe.some((_e) => _e !== 0) && St("segs", a, "distLoad", fe), re.massPerM !== 0 && St("segs", a, "massPerM", re.massPerM), de(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (f) {
      const w = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${n.length}` });
      w.addBinding(re, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), w.addBinding(re, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), w.addBinding(re, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(re, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        St("areas", n, "shellType", re.shellType), St("areas", n, "thickness", re.thickness), St("areas", n, "material", re.material_shell), re.surfLoad !== 0 && St("areas", n, "surfLoad", re.surfLoad), de(`\u2713 Propiedades aplicadas a ${n.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (h) {
      const w = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), c = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      w.addBinding(c, "msg", { readonly: true, label: "" });
    }
    pt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ae.clear(), Vt();
    }), Bt.style.display = "block", Ts();
  };
  window.__hekatanRefreshPropsPane = $s;
  let mn = null, Xn = false;
  b.addEventListener("pointerdown", (t) => {
    t.button === 2 && (mn = { x: t.clientX, y: t.clientY }, Xn = false);
  }), b.addEventListener("pointermove", (t) => {
    if (mn && t.buttons & 2 && !Xn) {
      const o = t.clientX - mn.x, a = t.clientY - mn.y;
      Math.hypot(o, a) > 8 && (Xn = true);
    }
  }), b.addEventListener("pointerup", (t) => {
    var _a2, _b, _c;
    if (t.button === 2) {
      const o = mn !== null && !Xn;
      mn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (Yt ? Nn() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ae.size > 0 && (Ae.clear(), Vt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const n = window.__hekatanCadState, s = (_b = (_a2 = n == null ? void 0 : n.get) == null ? void 0 : _a2.call(n)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = n == null ? void 0 : n.setTool) == null ? void 0 : _c.call(n, "select"), de(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : de("\u238B Cancelado (click derecho)");
      }
    }
  }), b.addEventListener("contextmenu", (t) => {
    t.preventDefault(), t.stopPropagation();
  }, { capture: true }), b.addEventListener("pointerdown", (t) => {
    var _a2, _b, _c;
    const o = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || t.button === 0 && (window.__hekatanBloquearVentana || t.pointerType !== "touch" && (Gt = null, Sn = false));
  }), b.addEventListener("pointermove", (t) => {
    if (Yt && t.buttons === 0) {
      const i = t.clientX < Yt.x;
      po(Yt.x, Yt.y, t.clientX, t.clientY, i);
      return;
    }
    if (!Gt) return;
    const o = t.clientX - Gt.x, a = t.clientY - Gt.y, n = Math.hypot(o, a);
    if (!Sn && n < 8) return;
    Sn = true;
    const s = t.clientX < Gt.x;
    po(Gt.x, Gt.y, t.clientX, t.clientY, s);
  }), b.addEventListener("pointerup", (t) => {
    if (!Gt) return;
    if (!Sn) {
      Gt = null;
      return;
    }
    const o = t.ctrlKey || t.metaKey || t.shiftKey;
    Bo(Gt.x, Gt.y, t.clientX, t.clientY, o), Gt = null, Sn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const qt = new it();
  qt.visible = false, qt.frustumCulled = false, r.add(qt);
  const Yo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Zo = (t, o, a, n) => {
    var _a2, _b, _c, _d;
    for (; qt.children.length; ) {
      const d = qt.children.pop();
      (_b = (_a2 = d.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2), (_d = (_c = d.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Yo[t] ?? 16777215, i = new ze().setFromPoints([new S(-1, -1, 0), new S(1, -1, 0), new S(1, -1, 0), new S(1, 1, 0), new S(1, 1, 0), new S(-1, 1, 0), new S(-1, 1, 0), new S(-1, -1, 0)]);
    qt.add(new Wt(i, new ht({ color: s, linewidth: 2 }))), qt.position.set(o, a, n), qt.visible = true, fo();
  };
  let uo = 4;
  const fo = () => {
    qt.visible && qt.scale.setScalar(uo * Bn(qt.position));
  };
  window.__hekatanOsnapMarkerRef = qt, window.__hekatanUpdateOsnapScale = fo, window.__hekatanOsnapPx = (t) => (typeof t == "number" && t > 0 && (uo = t, fo(), x()), uo);
  const Yn = () => {
    qt.visible = false;
  }, Ls = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, Jt = document.createElement("div");
  Jt.id = "hk-osnap-etiqueta", Jt.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(Jt);
  const Uo = (t, o, a) => {
    const n = Ls[t];
    if (!n) {
      Jt.style.display = "none";
      return;
    }
    Jt.textContent = n, Jt.style.color = "#" + (Yo[t] ?? 16777215).toString(16).padStart(6, "0"), Jt.style.left = o + 18 + "px", Jt.style.top = a - 26 + "px", Jt.style.display = "block";
  }, Is = () => {
    Jt.style.display = "none";
  }, Cn = new S(), ho = (t, o, a) => {
    const n = p();
    if (!n) return null;
    const s = b.getBoundingClientRect();
    return Cn.set(t, o, a).project(n), !isFinite(Cn.x) || !isFinite(Cn.y) ? null : { x: s.left + (Cn.x * 0.5 + 0.5) * s.width, y: s.top + (-Cn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = ho;
  const Rs = (t, o, a, n, s) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, d = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let h = null;
    const g = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, _ = s, w = (v, T, $, H) => {
      let P;
      if (_) {
        const q = ho(T, $, H);
        if (!q || (P = Math.hypot(q.x - _.x, q.y - _.y), P > kn)) return;
      } else if (P = Math.hypot(T - t, $ - o, H - a), P > n) return;
      const C = g[v] ?? 9;
      (!h || C < h.r || C === h.r && P < h.d) && (h = { type: v, x: T, y: $, z: H, d: P, r: C });
    };
    if (i.ori !== false && w("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const v = window.__hekatanGridConfig, T = (v == null ? void 0 : v.minorStep) && v.minorStep > 0 ? v.minorStep : 1, $ = ((v == null ? void 0 : v.gridSize) ?? 30) / 2, H = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", P = (q) => Math.round(q / T) * T, C = (q, ne) => Math.abs(q) <= $ + 1e-9 && Math.abs(ne) <= $ + 1e-9;
      if (H === "xz") {
        const q = P(t), ne = P(a);
        C(q, ne) && w("grid", q, o, ne);
      } else if (H === "yz") {
        const q = P(o), ne = P(a);
        C(q, ne) && w("grid", t, q, ne);
      } else {
        const q = P(t), ne = P(o);
        C(q, ne) && w("grid", q, ne, a);
      }
    }
    (i.node || i.end) && d.forEach((v) => {
      i.node && w("node", v[0], v[1], v[2]);
    });
    for (const v of f) if (!(v.length < 2)) for (let T = 0; T < v.length - 1; T++) {
      const $ = d[v[T]], H = d[v[T + 1]];
      if (!(!$ || !H) && (i.end && (w("end", $[0], $[1], $[2]), w("end", H[0], H[1], H[2])), i.mid && w("mid", ($[0] + H[0]) / 2, ($[1] + H[1]) / 2, ($[2] + H[2]) / 2), i.nea || i.per)) {
        const P = H[0] - $[0], C = H[1] - $[1], q = H[2] - $[2], ne = P * P + C * C + q * q;
        if (ne < 1e-12) continue;
        const fe = Math.max(0, Math.min(1, ((t - $[0]) * P + (o - $[1]) * C + (a - $[2]) * q) / ne)), _e2 = $[0] + fe * P, Ge = $[1] + fe * C, $e = $[2] + fe * q;
        i.nea && w("nea", _e2, Ge, $e), i.per && w("per", _e2, Ge, $e);
      }
    }
    if (i.cen) {
      const v = ((_e = e.areas) == null ? void 0 : _e.rawVal) ?? [];
      for (const T of v) {
        const $ = f[T];
        if (!$ || $.length < 3) continue;
        const H = $[0] === $[$.length - 1] ? $.slice(0, -1) : $;
        let P = 0, C = 0, q = 0, ne = 0;
        for (const fe of H) {
          const _e2 = d[fe];
          _e2 && (P += _e2[0], C += _e2[1], q += _e2[2], ne++);
        }
        ne >= 3 && w("cen", P / ne, C / ne, q / ne);
      }
    }
    if (i.cen) {
      const v = bn(), T = [...an];
      for (const $ of v) T.some((H) => Math.hypot(H.c[0] - $.c[0], H.c[1] - $.c[1], H.c[2] - $.c[2]) < 1e-6 && Math.abs(H.r - $.r) < 1e-6) || T.push($);
      for (const $ of T) {
        if (!d.some((C) => Math.abs(Math.hypot(C[0] - $.c[0], C[1] - $.c[1], C[2] - $.c[2]) - $.r) < 1e-6)) continue;
        const P = Math.hypot(t - $.c[0], o - $.c[1], a - $.c[2]);
        if (P < n || Math.abs(P - $.r) < n) {
          const C = Math.min(P, n * 0.5), q = 3;
          (!h || q < h.r || q === h.r && C < h.d) && (h = { type: "cen", x: $.c[0], y: $.c[1], z: $.c[2], d: C, r: q });
        }
      }
    }
    if (i.int) {
      const v = [];
      for (const T of f) for (let $ = 0; $ < T.length - 1; $++) {
        const H = d[T[$]], P = d[T[$ + 1]];
        if (!H || !P) continue;
        const C = P[0] - H[0], q = P[1] - H[1], ne = P[2] - H[2], fe = C * C + q * q + ne * ne;
        if (fe < 1e-12) continue;
        const _e2 = Math.max(0, Math.min(1, ((t - H[0]) * C + (o - H[1]) * q + (a - H[2]) * ne) / fe));
        Math.hypot(H[0] + _e2 * C - t, H[1] + _e2 * q - o, H[2] + _e2 * ne - a) < 3 * n && v.push([H, P]);
      }
      for (let T = 0; T < v.length; T++) for (let $ = T + 1; $ < v.length; $++) {
        const [H, P] = v[T], [C, q] = v[$], ne = [P[0] - H[0], P[1] - H[1], P[2] - H[2]], fe = [q[0] - C[0], q[1] - C[1], q[2] - C[2]], _e2 = [H[0] - C[0], H[1] - C[1], H[2] - C[2]], Ge = ne[0] * ne[0] + ne[1] * ne[1] + ne[2] * ne[2], $e = ne[0] * fe[0] + ne[1] * fe[1] + ne[2] * fe[2], et = fe[0] * fe[0] + fe[1] * fe[1] + fe[2] * fe[2], nt = ne[0] * _e2[0] + ne[1] * _e2[1] + ne[2] * _e2[2], at = fe[0] * _e2[0] + fe[1] * _e2[1] + fe[2] * _e2[2], je = Ge * et - $e * $e;
        if (je < 1e-12) continue;
        const Le = ($e * at - et * nt) / je, ot = (Ge * at - $e * nt) / je;
        if (Le < -1e-6 || Le > 1 + 1e-6 || ot < -1e-6 || ot > 1 + 1e-6) continue;
        const Ye = [H[0] + Le * ne[0], H[1] + Le * ne[1], H[2] + Le * ne[2]], ke = [C[0] + ot * fe[0], C[1] + ot * fe[1], C[2] + ot * fe[2]];
        if (Math.hypot(Ye[0] - ke[0], Ye[1] - ke[1], Ye[2] - ke[2]) > 1e-4) continue;
        [H, P, C, q].some((tt) => Math.hypot(tt[0] - Ye[0], tt[1] - Ye[1], tt[2] - Ye[2]) < 1e-6) || w("int", Ye[0], Ye[1], Ye[2]);
      }
    }
    const c = window.__hekatanAxisGrids ?? [], A = window.__hekatanLevels ?? [], Q = c.filter((v) => v && v.start && v.end).map((v) => [v.start, v.end]);
    for (const [v, T] of Q) {
      i.end && (w("end", v[0], v[1], v[2]), w("end", T[0], T[1], T[2]));
      const $ = T[0] - v[0], H = T[1] - v[1], P = T[2] - v[2], C = $ * $ + H * H + P * P;
      if (C < 1e-12) continue;
      const q = Math.max(0, Math.min(1, ((t - v[0]) * $ + (o - v[1]) * H + (a - v[2]) * P) / C));
      if (i.nea && w("nea", v[0] + q * $, v[1] + q * H, v[2] + q * P), i.int && Math.abs(P) > 1e-9) for (const ne of A) {
        const fe = (ne.z - v[2]) / P;
        fe < -1e-6 || fe > 1 + 1e-6 || w("int", v[0] + fe * $, v[1] + fe * H, ne.z);
      }
    }
    if (i.int || i.node) for (let v = 0; v < Q.length; v++) for (let T = v + 1; T < Q.length; T++) {
      const [$, H] = Q[v], [P, C] = Q[T], q = H[0] - $[0], ne = H[1] - $[1], fe = C[0] - P[0], _e2 = C[1] - P[1], Ge = q * _e2 - ne * fe;
      if (Math.abs(Ge) < 1e-12) continue;
      const $e = $[0] - P[0], et = $[1] - P[1], nt = (fe * et - _e2 * $e) / Ge, at = (q * et - ne * $e) / Ge;
      if (nt < -1e-6 || nt > 1 + 1e-6 || at < -1e-6 || at > 1 + 1e-6) continue;
      const je = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      w("int", $[0] + nt * q, $[1] + nt * ne, typeof je == "number" ? je : a);
    }
    const G = window.__hekatanDrawingAuxLines, Z = (G == null ? void 0 : G.rawVal) ?? (G == null ? void 0 : G.val) ?? G ?? [];
    for (const v of Z) {
      if (v.length !== 6) continue;
      const T = [v[0], v[1], v[2]], $ = [v[3], v[4], v[5]];
      if (i.end && (w("end", T[0], T[1], T[2]), w("end", $[0], $[1], $[2])), i.mid && w("mid", (T[0] + $[0]) / 2, (T[1] + $[1]) / 2, (T[2] + $[2]) / 2), i.nea || i.per) {
        const H = $[0] - T[0], P = $[1] - T[1], C = $[2] - T[2], q = H * H + P * P + C * C;
        if (q < 1e-12) continue;
        const ne = Math.max(0, Math.min(1, ((t - T[0]) * H + (o - T[1]) * P + (a - T[2]) * C) / q)), fe = T[0] + ne * H, _e2 = T[1] + ne * P, Ge = T[2] + ne * C;
        i.nea && w("nea", fe, _e2, Ge), i.per && w("per", fe, _e2, Ge);
      }
    }
    return h ? { type: h.type, x: h.x, y: h.y, z: h.z } : null;
  }, wn = new it();
  wn.frustumCulled = false, r.add(wn);
  const qo = new ht({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Ko = 0;
  const Go = () => {
    var _a2, _b;
    for (const t of wn.children.slice()) wn.remove(t), (_b = (_a2 = t.geometry) == null ? void 0 : _a2.dispose) == null ? void 0 : _b.call(_a2);
  };
  window.__hekatanDestello = (t) => {
    var _a2, _b;
    Go();
    const o = ((_a2 = e.points) == null ? void 0 : _a2.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of t || []) {
      const i = String(s).split(":");
      let d = [];
      if (i[0] === "pt") {
        const g = o[+i[1]];
        g && (d = [g, [g[0] + 1e-3, g[1], g[2]]]);
      } else if (i[0] === "seg") {
        const g = a[+i[1]] || [], _ = o[g[+i[2]]], w = o[g[+i[2] + 1]];
        _ && w && (d = [_, w]);
      } else i[0] === "poly" && (d = (a[+i[1]] || []).map((_) => o[_]).filter(Boolean));
      if (d.length < 2) continue;
      const f = new ze().setFromPoints(d.map((g) => new S(g[0], g[1], g[2]))), h = new Ft(f, qo);
      h.renderOrder = 1200, wn.add(h);
    }
    if (!wn.children.length) return;
    Ko = performance.now() + 900;
    const n = () => {
      const s = Ko - performance.now();
      if (s <= 0) {
        Go(), x();
        return;
      }
      qo.opacity = Math.min(1, s / 900) * 0.95, x(), requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }, window.addEventListener("hk:property-applied", (t) => {
    var _a2;
    const o = (_a2 = t == null ? void 0 : t.detail) == null ? void 0 : _a2.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Rs, window.__hekatanOsnapShow = Zo, window.__hekatanOsnapHide = Yn;
  let Ue = [], vt = 0, rn = 0, zt = null;
  const zn = document.createElement("div");
  zn.id = "hk-cad-status", zn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", zn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(zn);
  const Ds = () => {
    var _a2, _b, _c;
    const t = [];
    window.__hekatanOrthoMode && t.push("\u22A5 ORTO ON (F8)"), Oe && t.push(`\u{1F512} LOCK ${Oe.toUpperCase()}`);
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && t.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && t.push("\u25A6 Planos XY/XZ/YZ"), t.length > 0 ? `   |   ${t.join("  \xB7  ")}` : "";
  }, de = (t) => {
    var _a2;
    const o = t + Ds();
    zn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a2 = window.__hekatanCadEcho) == null ? void 0 : _a2.call(window, t);
    } catch {
    }
  }, Bs = "Comando:", Ns = () => {
    var _a2, _b, _c, _d;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], n = Ue.length, s = (i, d = []) => ({ txt: i, ops: d });
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${xe.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return s("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "rect":
        return s(n ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(n ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(n === 0 ? "ARCO Precise punto inicial:" : n === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(n ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${vt > 0 ? vt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(zt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(zt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(zt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${rn > 0 ? ` (distancia ${rn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
        return Ae.size ? s(n ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ae.size ? s(n ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ae.size ? s(`SELECCI\xD3N ${Ae.size} objeto${Ae.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(Bs);
    }
  }, Zt = () => {
    var _a2, _b, _c, _d, _e;
    try {
      const t = Ns(), o = ((_c = ((_a2 = window.__hekatanAxisGrids) == null ? void 0 : _a2.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(t.txt) && !o && !a ? `${t.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : t.txt;
      (_e = window.__hekatanCadPrompt) == null ? void 0 : _e.call(window, s, t.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Zt, window.__hekatanRefreshStatus = () => {
    const t = window.__hekatanCadStatusText ?? "", o = t.split("   |   ")[0] ?? t;
    de(o);
  }, window.__hekatanCadResetPending = () => {
    Ue = [], xe = [], O.visible = false, mo(), zt = null, x(), de("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Zt();
  };
  function mo() {
    if (!e.polylines) return;
    const t = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...t, []];
  }
  window.__hekatanCerrarPolilinea = mo;
  const yn = [], Zn = [], wo = () => {
    var _a2, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, Ho = (t) => {
    var _a2;
    e.points.val = t.p, e.polylines && (e.polylines.val = t.l), e.areas && (e.areas.val = t.a), Ue = [], pe.visible = false, st.visible = false, I();
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    x(), Zt();
  }, Nt = () => {
    yn.push(wo()), yn.length > 100 && yn.shift(), Zn.length = 0;
  }, Un = () => {
    const t = yn.pop();
    if (!t) {
      de("\u21B6 Nada para deshacer");
      return;
    }
    Zn.push(wo()), Ho(t), de(`\u21B6 Deshacer \u2014 quedan ${yn.length}`);
  }, Wo = () => {
    const t = Zn.pop();
    if (!t) {
      de("\u21B7 Nada para rehacer");
      return;
    }
    yn.push(wo()), Ho(t), de(`\u21B7 Rehacer \u2014 quedan ${Zn.length}`);
  };
  window.__hekatanPushUndo = Nt, window.__hekatanUndo = Un, window.__hekatanRedo = Wo, document.addEventListener("keydown", (t) => {
    var _a2;
    const o = t.key.toLowerCase();
    if (!((t.ctrlKey || t.metaKey) && (o === "y" || o === "z" && t.shiftKey))) return;
    const n = t.target;
    n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA") && n.type !== "checkbox" && n.type !== "range" && (((_a2 = n.value) == null ? void 0 : _a2.length) ?? 0) > 0 || (t.preventDefault(), t.stopPropagation(), Wo());
  }, { capture: true }), window.__hekatanCadOption = (t) => {
    var _a2, _b, _c, _d, _e;
    const o = t.trim().toLowerCase(), a = (_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const n = e.polylines.rawVal, s = n.length ? n[n.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Un(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return de("Cerrar necesita al menos tres puntos."), true;
      Nt(), e.polylines.val = [...n.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return yo(), de(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Un(), true;
      Nt();
      const i = s[s.length - 1], d = s.slice(0, -1), f = n.some((_, w) => w !== n.length - 1 && _.includes(i)) || d.includes(i);
      let h = e.points.rawVal, g = [...n.slice(0, -1), d];
      if (!f && i === h.length - 1 && (h = h.slice(0, -1), e.points.val = h), e.polylines.val = g, d.length) {
        const _ = h[d[d.length - 1]];
        _ && (L = [_[0], _[1], _[2]]);
      } else L = null, pe.visible = false;
      try {
        (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
      } catch {
      }
      return x(), de(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${d.length}.`), Zt(), true;
    }
    return false;
  }, document.addEventListener("keydown", (t) => {
    var _a2;
    if ((t.ctrlKey || t.metaKey) && t.key.toLowerCase() === "z" && !t.shiftKey) {
      const o = t.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a2 = o.value) == null ? void 0 : _a2.length) > 0) return;
      t.preventDefault(), t.stopPropagation(), Un();
    }
  }, { capture: true });
  const yo = () => {
    Ue = [], zt = null, mo(), Oe = null, Ve(), pe.visible = false, st.visible = false, I(), de("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), x(), Zt();
  };
  window.__hekatanFinalizeDraw = yo;
  const Jo = () => {
    var _a2, _b, _c;
    Ue = [], xe = [], O.visible = false;
    let t = false;
    Ae.size && (Ae.clear(), Vt(), t = true), yo();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    de(t ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), x(), Zt();
  };
  window.__hekatanEscapeCancel = Jo;
  const Oo = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Ae.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (t[+a.slice(5)] || []).forEach((n) => o.add(n));
      else if (a.startsWith("seg:")) {
        const n = a.split(":"), s = t[+n[1]] || [], i = s[+n[2]], d = s[+n[2] + 1];
        i != null && o.add(i), d != null && o.add(d);
      }
    }), o;
  }, Qo = (t, o, a) => {
    var _a2;
    const n = Oo();
    if (!n.size) return 0;
    Nt();
    const s = e.points.rawVal.map((i, d) => n.has(d) ? [i[0] + t, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
    } catch {
    }
    return Vt(), x(), n.size;
  };
  window.__hekatanMoveSelection = Qo;
  const jo = (t, o) => {
    var _a2, _b, _c, _d, _e;
    if (!Ae.size) {
      de(`${t === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.setTool) == null ? void 0 : _b.call(_a2, "select"), Zt();
      return;
    }
    if (Ue.push(o), Ue.length === 1) {
      L = o, de(`${t === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Zt();
      return;
    }
    const [a, n] = Ue, s = [n[0] - a[0], n[1] - a[1], n[2] - a[2]];
    Ue = [], pe.visible = false;
    let i = 0;
    t === "move" ? i = Qo(s[0], s[1], s[2]) : (i = Oo().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), de(`\u2713 ${t === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), t === "move" && (Ae.clear(), Vt()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Zt();
  };
  window.__hekatanPasoMoverCopiar = jo;
  const Xs = () => {
    var _a2, _b, _c;
    const t = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.workPlane) ?? "xy";
    return t === "xz" ? [0, 1, 0] : t === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, jt = (t, o) => Math.hypot(t[0] - o[0], t[1] - o[1], t[2] - o[2]), xo = (t, o, a, n, s, i) => {
    const d = [o[0] - t[0], o[1] - t[1], o[2] - t[2]], f = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], h = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], g = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], _ = d[0] * f[0] + d[1] * f[1] + d[2] * f[2], w = f[0] * f[0] + f[1] * f[1] + f[2] * f[2], c = d[0] * h[0] + d[1] * h[1] + d[2] * h[2], A = f[0] * h[0] + f[1] * h[1] + f[2] * h[2], Q = g * w - _ * _;
    if (Q < 1e-12) return null;
    const G = (_ * A - w * c) / Q, Z = (g * A - _ * c) / Q;
    if (!s && (G < -1e-6 || G > 1 + 1e-6) || !i && (Z < -1e-6 || Z > 1 + 1e-6)) return null;
    const v = [t[0] + G * d[0], t[1] + G * d[1], t[2] + G * d[2]], T = [a[0] + Z * f[0], a[1] + Z * f[1], a[2] + Z * f[2]];
    return jt(v, T) > 1e-4 ? null : v;
  }, Ys = (t) => {
    var _a2;
    return (((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? []).reduce((o, a) => o + a.filter((n) => n === t).length, 0);
  }, Zs = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Us = (t, o) => {
    var _a2, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, n = e.points.rawVal, s = Zs[t];
    if (!zt) {
      if (Be < 0) {
        de(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      zt = { poly: Be, seg: Math.max(0, Je) }, de(t === "offset" ? `DESFASE l\xEDnea #${zt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${rn > 0 ? ` (${rn} m)` : ""}.` : t === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Zt();
      return;
    }
    if (t === "offset") {
      const G = zt.poly, Z = a[G];
      if (!Z || Z.length < 2) {
        zt = null, de("DESFASE: esa polil\xEDnea no tiene tramos."), Zt();
        return;
      }
      const v = Z.length > 2 && Z[0] === Z[Z.length - 1], T = Xs(), $ = [];
      for (let Le = 0; Le < Z.length - 1; Le++) {
        const ot = n[Z[Le]], Ye = n[Z[Le + 1]], ke = [Ye[0] - ot[0], Ye[1] - ot[1], Ye[2] - ot[2]], Re = Math.hypot(ke[0], ke[1], ke[2]) || 1, tt = ke[0] / Re, It = ke[1] / Re, Xt = ke[2] / Re, Rt = [T[1] * Xt - T[2] * It, T[2] * tt - T[0] * Xt, T[0] * It - T[1] * tt], Qt = Math.hypot(Rt[0], Rt[1], Rt[2]) || 1;
        $.push({ a: ot, b: Ye, n: [Rt[0] / Qt, Rt[1] / Qt, Rt[2] / Qt] });
      }
      let H = 0, P = 1 / 0;
      $.forEach((Le, ot) => {
        const Ye = on(o[0], o[1], o[2], Le.a[0], Le.a[1], Le.a[2], Le.b[0], Le.b[1], Le.b[2]);
        Ye < P && (P = Ye, H = ot);
      });
      const C = $[H], q = Math.sign((o[0] - C.a[0]) * C.n[0] + (o[1] - C.a[1]) * C.n[1] + (o[2] - C.a[2]) * C.n[2]) || 1, ne = rn > 0 ? rn : P;
      if (ne < 1e-6) {
        de("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const fe = $.map((Le) => ({ a: [Le.a[0] + q * ne * Le.n[0], Le.a[1] + q * ne * Le.n[1], Le.a[2] + q * ne * Le.n[2]], b: [Le.b[0] + q * ne * Le.n[0], Le.b[1] + q * ne * Le.n[1], Le.b[2] + q * ne * Le.n[2]] })), _e = fe.length, Ge = (Le) => {
        const ot = fe[(Le - 1 + _e) % _e], Ye = fe[Le % _e];
        return xo(ot.a, ot.b, Ye.a, Ye.b, true, true) ?? Ye.a;
      }, $e = [], et = v ? _e : _e + 1;
      for (let Le = 0; Le < et; Le++) !v && Le === 0 ? $e.push(fe[0].a) : !v && Le === _e ? $e.push(fe[_e - 1].b) : $e.push(Ge(Le));
      Nt();
      const nt = n.length;
      e.points.val = [...n, ...$e];
      const at = $e.map((Le, ot) => nt + ot);
      v && at.push(nt);
      let je = a.slice();
      je.length && je[je.length - 1].length === 0 && (je = je.slice(0, -1)), e.polylines.val = [...je, at, []], zt = null, de(`\u2713 Desfase a ${ne.toFixed(2)} m \u2014 ${_e} tramo${_e === 1 ? "" : "s"} nuevo${_e === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a2 = window.__hekatanRebuild) == null ? void 0 : _a2.call(window);
      } catch {
      }
      x(), Zt();
      return;
    }
    let i = Be, d = Math.max(0, Je);
    if (i < 0 || i === zt.poly && d === zt.seg) {
      let Z = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((v, T) => {
        for (let $ = 0; $ < v.length - 1; $++) {
          if (T === zt.poly && $ === zt.seg) continue;
          const H = n[v[$]], P = n[v[$ + 1]];
          if (!H || !P) continue;
          const C = on(o[0], o[1], o[2], H[0], H[1], H[2], P[0], P[1], P[2]);
          C < Z && (Z = C, i = T, d = $);
        }
      }), i < 0) {
        de(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const f = a[zt.poly], h = n[f[zt.seg]], g = n[f[zt.seg + 1]], _ = a[i], w = _[d], c = _[d + 1];
    if (!h || !g || w == null || c == null) {
      de(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const A = n[w], Q = n[c];
    if (t === "trim") {
      const G = xo(A, Q, h, g, false, false);
      if (!G) {
        de("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Nt();
      const Z = n.length;
      e.points.val = [...n, G];
      const v = [..._.slice(0, d + 1), Z, ..._.slice(d + 1)];
      e.polylines.val = a.map(($, H) => H === i ? v : $);
      const T = jt(o, A) < jt(o, Q);
      In(i, T ? d : d + 1), de(`\u2713 Recortado en (${G[0].toFixed(2)}, ${G[1].toFixed(2)}, ${G[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const G = xo(A, Q, h, g, true, false);
      if (!G) {
        de("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const v = jt(o, A) < jt(o, Q) ? d : d + 1;
      if (v !== 0 && v !== _.length - 1) {
        de("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const T = _[v];
      if (jt(G, A) + jt(G, Q) < jt(A, Q) + 1e-6) {
        de("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Nt(), Ys(T) > 1) {
        const H = n.length;
        e.points.val = [...n, G];
        const P = _.slice();
        P[v] = H, e.polylines.val = a.map((C, q) => q === i ? P : C);
      } else e.points.val = n.map((H, P) => P === T ? G : H);
      de(`\u2713 Alargada hasta (${G[0].toFixed(2)}, ${G[1].toFixed(2)}, ${G[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    x(), Zt();
  };
  window.__hekatanSelectionSize = () => Ae.size, window.__hekatanSelectLast = () => {
    var _a2;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [];
    let o = t.length - 1;
    for (; o >= 0 && (!t[o] || t[o].length < 2); ) o--;
    return Ae.clear(), o >= 0 && Ae.add(`poly:${o}`), Vt(), de(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ae.size;
  }, window.__hekatanSelectAll = () => {
    var _a2, _b;
    const t = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Ae.clear();
    const a = /* @__PURE__ */ new Set();
    return t.forEach((n, s) => {
      !n || n.length < 2 || (Ae.add(`poly:${s}`), n.forEach((i) => a.add(i)));
    }), o.forEach((n, s) => {
      a.has(s) || Ae.add(`pt:${s}`);
    }), Vt(), de(`SELECCI\xD3N ${Ae.size} objetos (todo el modelo) \xB7 Esc suelta`), Ae.size;
  }, window.__hekatanReplicateSelection = (t, o, a, n, s = 0) => {
    var _a2, _b, _c, _d;
    n = Math.max(1, Math.round(n || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...Ae], d = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], h = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), g = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), w = [];
    if (i.forEach((Z) => {
      if (Z.startsWith("pt:")) {
        const v = +Z.slice(3);
        d[v] && g.add(v);
      } else if (Z.startsWith("poly:")) {
        const v = +Z.slice(5);
        if (!f[v] || f[v].length < 2) return;
        _.add(v), f[v].forEach((T) => g.add(T));
      } else if (Z.startsWith("seg:")) {
        const v = Z.split(":"), T = +v[1], $ = +v[2], H = f[T] || [], P = H[$], C = H[$ + 1];
        P != null && C != null && (w.push([P, C]), g.add(P), g.add(C));
      }
    }), !g.size) return 0;
    Nt();
    const c = [...d];
    let A = f.slice();
    A.length && A[A.length - 1].length === 0 && (A = A.slice(0, -1));
    const Q = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], G = [...g];
    for (let Z = 1; Z <= n; Z++) {
      const v = s + Z, T = t * v, $ = o * v, H = a * v, P = /* @__PURE__ */ new Map();
      G.forEach((C) => {
        P.set(C, c.length), c.push([d[C][0] + T, d[C][1] + $, d[C][2] + H]);
      }), _.forEach((C) => {
        const q = f[C].map((fe) => P.has(fe) ? P.get(fe) : fe), ne = A.length;
        A.push(q), h.has(C) && Q.push(ne);
      }), w.forEach(([C, q]) => {
        A.push([P.get(C), P.get(q)]);
      });
    }
    A.push([]), e.points.val = c, e.polylines && (e.polylines.val = A), e.areas && (e.areas.val = Q);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return x(), n;
  }, window.__hekatanVoladoSelection = (t, o = {}) => {
    var _a2, _b, _c;
    const a = Number(t);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const n = o.losa !== false, s = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", d = e.points.rawVal, f = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], h = [];
    if ([...Ae].forEach((G) => {
      if (G.startsWith("seg:")) {
        const Z = G.split(":"), v = +Z[1], T = +Z[2], $ = f[v] || [], H = $[T], P = $[T + 1];
        H != null && P != null && h.push([H, P]);
      } else if (G.startsWith("poly:")) {
        const Z = f[+G.slice(5)] || [];
        for (let v = 0; v + 1 < Z.length; v++) h.push([Z[v], Z[v + 1]]);
      }
    }), !h.length) return 0;
    let g = 0, _ = 0;
    for (const G of d) g += G[0], _ += G[1];
    g /= Math.max(1, d.length), _ /= Math.max(1, d.length), Nt();
    const w = [...d];
    let c = f.slice();
    c.length && c[c.length - 1].length === 0 && (c = c.slice(0, -1));
    const A = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let Q = 0;
    for (const [G, Z] of h) {
      const v = d[G], T = d[Z];
      if (!v || !T) continue;
      const $ = T[0] - v[0], H = T[1] - v[1], P = Math.hypot($, H);
      if (P < 1e-6) continue;
      let C = -H / P, q = $ / P;
      const ne = (v[0] + T[0]) / 2, fe = (v[1] + T[1]) / 2;
      (ne - g) * C + (fe - _) * q < 0 && (C = -C, q = -q);
      const _e = i === "ambos" ? [1, -1] : [1];
      for (const Ge of _e) {
        const $e = C * a * Ge, et = q * a * Ge, nt = w.length;
        w.push([v[0] + $e, v[1] + et, v[2]]);
        const at = w.length;
        w.push([T[0] + $e, T[1] + et, T[2]]), c.push([G, nt]), c.push([Z, at]), s && c.push([nt, at]), n && (A.push(c.length), c.push([G, Z, at, nt, G])), Q++;
      }
    }
    if (!Q) return 0;
    c.push([]), e.points.val = w, e.polylines && (e.polylines.val = c), e.areas && (e.areas.val = A);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return x(), Q;
  }, b.addEventListener("click", (t) => {
    var _a2, _b;
    if (window.__hekatanCursorPx = { x: t.clientX, y: t.clientY }, ln > 5) {
      ln = 0;
      return;
    }
    ln = 0;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(F, o);
    const a = oe();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(u.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), d = a[0].point;
      if (!isFinite(d.x) || !isFinite(d.y) || !isFinite(d.z) || i > Math.max(s * 12, 300)) {
        de("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let n = a[0].point;
    (t.ctrlKey || t.metaKey) && (n = new S(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], i = s[s.length - 1] ?? [], d = e.points.rawVal ?? [];
      if (i.length > 0) {
        const f = d[i[i.length - 1]];
        if (f) {
          const h = !!window.__hekatanOrthoMode;
          let g = Oe;
          if (!g && h) {
            const _ = Math.abs(n.x - f[0]), w = Math.abs(n.y - f[1]), c = Math.abs(n.z - f[2]);
            g = _ >= w && _ >= c ? "x" : w >= c ? "y" : "z";
          }
          g === "x" ? n = new S(n.x, f[1], f[2]) : g === "y" ? n = new S(f[0], n.y, f[2]) : g === "z" && (n = new S(f[0], f[1], n.z));
        }
      }
    }
    if (qe && Math.abs(t.clientX - qe.x) <= 3 && Math.abs(t.clientY - qe.y) <= 3) n = qe.p.clone();
    else if (kt) n = kt.clone(), de(`\u{1F4D0} Eje \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else {
      const s = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s, { x: t.clientX, y: t.clientY });
      if (i) n = new S(i.x, i.y, i.z), de(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      else {
        const d = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0;
        d && f > 0 && (n = new S(Math.round(n.x / f) * f, Math.round(n.y / f) * f, Math.round(n.z / f) * f));
      }
    }
    es(n, t);
  });
  const es = (t, o) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const a = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (Ut) {
        Yt && Nn();
        const { kind: n, a: s, b: i } = Ut, d = i !== void 0 ? `${n}:${s}:${i}` : `${n}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Ae.clear(), Ae.has(d) ? Ae.delete(d) : Ae.add(d), Vt(), de(`\u2713 Seleccionados ${Ae.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const n = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Yt ? (Bo(Yt.x, Yt.y, s, i, n), Yt = null) : n || (Yt = { x: s, y: i }, de("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), po(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const n = window.__hekatanAxisDraw;
      if (!n) return;
      if (!n.pendingStart) {
        n.pendingStart = [t.x, t.y, t.z], de(`\u{1F4CD} Eje \u2014 click 1 OK en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = n.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, n.pendingStart, [t.x, t.y, t.z], s);
      de(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      jo(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "delete") {
      if (wt >= 0) {
        const n = window.__hekatanDrawingAuxLines, s = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [], i = wt;
        if (i >= 0 && i < s.length) {
          Nt();
          const d = s.slice(0, i).concat(s.slice(i + 1));
          n && typeof n == "object" && "val" in n ? n.val = d : window.__hekatanDrawingAuxLines = d, de(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), wt = -1, dt.visible = false;
          try {
            (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
          } catch {
          }
        }
      } else if (Be >= 0) {
        const n = Be, s = Je;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(n)) ?? false ? (sn(n), de(`\u{1F5D1} \xC1rea #${n + 1} (shell Q4) borrada`)) : s >= 0 ? (In(n, s), de(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${n + 1} borrado`)) : (sn(n), de(`\u{1F5D1} Polil\xEDnea #${n + 1} borrada`));
      } else de("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [n, s] = Ue, i = Math.hypot(s[0] - n[0], s[1] - n[1], s[2] - n[2]);
      Math.abs(s[0] - n[0]);
      const d = Math.abs(s[1] - n[1]), h = Math.abs(s[2] - n[2]) < 1e-3 ? "xy" : d < 1e-3 ? "xz" : "yz", g = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, n[0], n[1], n[2], i, g, h), de(`\u2713 C\xEDrculo dibujado en ${h.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${g} segmentos`), Ue = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (Ue.length === 2) {
        de("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [n, s, i] = Ue, d = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, n, s, i, d), de(`\u2713 Arco dibujado \u2014 ${d} segmentos`), Ue = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ue;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, n, s), de(`\u2713 Rect\xE1ngulo dibujado \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ue = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "fillarea") {
      const n = e.points.rawVal, s = ((_n2 = e.polylines) == null ? void 0 : _n2.rawVal) ?? [], i = /* @__PURE__ */ new Map(), d = (P, C) => {
        P !== C && ((i.get(P) ?? i.set(P, /* @__PURE__ */ new Set()).get(P)).add(C), (i.get(C) ?? i.set(C, /* @__PURE__ */ new Set()).get(C)).add(P));
      };
      for (const P of s) for (let C = 0; C + 1 < P.length; C++) d(P[C], P[C + 1]);
      const f = (P, C) => {
        var _a3;
        return !!((_a3 = i.get(P)) == null ? void 0 : _a3.has(C));
      }, h = /* @__PURE__ */ new Set(), g = [], _ = [...i.keys()];
      for (const P of _) for (const C of i.get(P)) if (!(C < P)) {
        for (const q of i.get(C)) if (q !== P) for (const ne of i.get(q)) {
          if (ne === P || ne === C || !f(ne, P) || f(P, q) || f(C, ne)) continue;
          const fe = [P, C, q, ne].slice().sort((_e2, Ge) => _e2 - Ge).join("-");
          h.has(fe) || (h.add(fe), g.push([P, C, q, ne]));
        }
      }
      for (const P of _) for (const C of i.get(P)) if (!(C < P)) for (const q of i.get(C)) {
        if (q === P || !f(q, P)) continue;
        const ne = [P, C, q].slice().sort((fe, _e2) => fe - _e2).join("-");
        h.has(ne) || (h.add(ne), g.push([P, C, q]));
      }
      const w = ((_q = (_p = (_o = window.__hekatanCadState) == null ? void 0 : _o.get) == null ? void 0 : _p.call(_o)) == null ? void 0 : _q.workPlane) ?? "xy", c = (P) => w === "xy" ? [P[0], P[1]] : w === "xz" ? [P[0], P[2]] : [P[1], P[2]], A = c([t.x, t.y, t.z]), Q = (P, C) => {
        let q = false;
        for (let ne = 0, fe = C.length - 1; ne < C.length; fe = ne++) {
          const _e2 = C[ne][0], Ge = C[ne][1], $e = C[fe][0], et = C[fe][1];
          Ge > P[1] != et > P[1] && P[0] < ($e - _e2) * (P[1] - Ge) / (et - Ge) + _e2 && (q = !q);
        }
        return q;
      }, G = (P) => {
        let C = 0;
        for (let q = 0, ne = P.length - 1; q < P.length; ne = q++) C += (P[ne][0] + P[q][0]) * (P[ne][1] - P[q][1]);
        return Math.abs(C) / 2;
      };
      let Z = null, v = 1 / 0;
      for (const P of g) {
        const C = P.map((ne) => c(n[ne]));
        if (!Q(A, C)) continue;
        const q = G(C);
        q < v && (v = q, Z = P);
      }
      if (!Z) {
        de("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const T = Z.slice().sort((P, C) => P - C).join("-"), $ = ((_r = e.areas) == null ? void 0 : _r.rawVal) ?? [];
      if ($.some((P) => {
        const C = s[P] ?? [];
        return [...new Set(C)].sort((q, ne) => q - ne).join("-") === T;
      })) {
        de("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      e.polylines.val = [...s, [...Z, Z[0]]], e.areas.val = [...$, s.length], de(`\u2713 \xC1rea creada por relleno (${Z.length} lados).`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ue;
      (_t2 = window.__hekatanDrawRectArea) == null ? void 0 : _t2.call(window, n, s), de(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${n[0].toFixed(1)},${n[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), Ue = [];
      return;
    }
    if (a === "polyarea") {
      xe.push([t.x, t.y, t.z]), O.geometry.setFromPoints(xe.map((n) => new S(n[0], n[1], n[2]))), O.visible = xe.length >= 1, de(`\u25B0 \xC1rea libre \u2014 ${xe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), x();
      return;
    }
    if (a === "plane3") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length < 3) {
        de(`\u25E3 Plano inclinado \u2014 punto ${Ue.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [n, s, i] = Ue, d = (_u = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _u.call(window, n, s, i);
      de(d ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), Ue = [];
      return;
    }
    if (a === "col") {
      Nt();
      const n = t.z, s = vt && vt > 0 ? vt : 3;
      e.points.val = [...e.points.rawVal, [t.x, t.y, n], [t.x, t.y, n + s]];
      const i = e.polylines.rawVal, d = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [d - 2, d - 1], []], vt = 0, de(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [n, s] = Ue, i = vt && vt > 0 ? vt : 3;
      Nt();
      const d = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [n[0], n[1], n[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [n[0], n[1], n[2] + i]];
      const f = e.polylines.rawVal;
      if (f.length - 1, e.polylines.val = [...f.slice(0, -1), ...f[f.length - 1].length > 0 ? [f[f.length - 1]] : [], [d, d + 1, d + 2, d + 3, d], []], e.areas) {
        const h = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, h];
      }
      de(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), Ue = [], vt = 0;
      try {
        (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Nt();
      const n = vt && vt > 0 ? vt : 3, s = t.z;
      e.points.val = [...e.points.rawVal, [t.x, t.y, s], [t.x, t.y, s + n]];
      const i = e.polylines.rawVal, d = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [d - 2, d - 1], []], vt = 0, de(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${n.toFixed(2)}m`);
      try {
        (_x = window.__hekatanRebuild) == null ? void 0 : _x.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const n = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = vn(t.x, t.y, t.z, n);
      if (!s) {
        de("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, d = e.points.rawVal, f = i[s.polyIdx], h = d[f[s.segIdx]], g = d[f[s.segIdx + 1]];
      if (!h || !g) {
        de("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const _ = vt && vt > 0 ? vt : 3;
      Nt();
      const w = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [h[0], h[1], h[2]], [g[0], g[1], g[2]], [g[0], g[1], g[2] + _], [h[0], h[1], h[2] + _]];
      const c = e.polylines.rawVal;
      if (e.polylines.val = [...c.slice(0, -1), ...c[c.length - 1].length > 0 ? [c[c.length - 1]] : [], [w, w + 1, w + 2, w + 3, w], []], e.areas) {
        const A = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, A];
      }
      vt = 0, de(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${_.toFixed(2)}m`);
      try {
        (_y = window.__hekatanRebuild) == null ? void 0 : _y.call(window);
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
      de(`\u2726 Punto auxiliar agregado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [n, s] = Ue, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const _ = i.rawVal ?? i.val ?? [];
        i.val = [..._, [n[0], n[1], n[2], s[0], s[1], s[2]]];
      }
      const d = s[0] - n[0], f = s[1] - n[1], h = s[2] - n[2], g = Math.sqrt(d * d + f * f + h * h);
      de(`\u2713 L\xEDnea auxiliar creada \u2014 L=${g.toFixed(2)}m (cyan, no FEM)`), Ue = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      Us(a, [t.x, t.y, t.z]);
      return;
    }
    if (a === "chaflan") {
      if (Ue.push([t.x, t.y, t.z]), Ue.length === 1) {
        de("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [n, s] = Ue, i = window.__hekatanChaflanR ?? 1, d = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_z = window.__hekatanDrawSlabChaflan) == null ? void 0 : _z.call(window, n, s, i, d, 6);
      const f = Math.abs(s[0] - n[0]).toFixed(1), h = Math.abs(s[1] - n[1]).toFixed(1);
      de(`\u2713 Losa con chaflanes dibujada \u2014 ${f}\xD7${h}m, r=${i}m, ${d} seg/chafl\xE1n`), Ue = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (N = false, Nt(), e.points.val = [...e.points.rawVal, t.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const n = e.polylines.rawVal, s = n.length - 1, i = n[s] ?? [];
      if (a === "line" && i.length >= 2) {
        de(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_B = window.__hekatanRebuild) == null ? void 0 : _B.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...n.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), de("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_C = window.__hekatanRebuild) == null ? void 0 : _C.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") de(`\u25CF Nodo creado en (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else if (a === "line") de("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") de("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const n = ((_D = e.polylines) == null ? void 0 : _D.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      de(`\u25A6 \xC1rea \u2014 click ${n.length}/4. Marc\xE1 ${4 - n.length} v\xE9rtice${4 - n.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  b.addEventListener("click", () => Zt()), b.addEventListener("contextmenu", (t) => {
    var _a2, _b, _c;
    if (((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) === "polyarea" && xe.length >= 3) {
      t.preventDefault();
      const a = pn();
      de(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), b.addEventListener("pointermove", (t) => {
    var _a2, _b;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(F, o);
    const a = oe();
    if (ie.geometry.deleteAttribute("position"), a.length) {
      let n = a[0].point.clone();
      (t.ctrlKey || t.metaKey) && n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
      {
        const d = ((_a2 = e.polylines) == null ? void 0 : _a2.rawVal) ?? [], f = d[d.length - 1] ?? [], h = e.points.rawVal ?? [];
        if (f.length > 0) {
          const g = h[f[f.length - 1]];
          if (g) {
            const _ = !!window.__hekatanOrthoMode;
            let w = Oe;
            if (!w && _) {
              const c = Math.abs(n.x - g[0]), A = Math.abs(n.y - g[1]), Q = Math.abs(n.z - g[2]);
              w = c >= A && c >= Q ? "x" : A >= Q ? "y" : "z";
            }
            w === "x" ? n.set(n.x, g[1], g[2]) : w === "y" ? n.set(g[0], n.y, g[2]) : w === "z" && n.set(g[0], g[1], n.z);
          }
        }
      }
      const s = ro(n), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, n.x, n.y, n.z, s, { x: t.clientX, y: t.clientY });
      if (i) n.set(i.x, i.y, i.z);
      else {
        const d = window.__hekatanSnapEnabled !== false, f = window.__hekatanSnap2D ?? 0.5;
        d && f > 0 && (n.x = Math.round(n.x / f) * f, n.y = Math.round(n.y / f) * f, n.z = Math.round(n.z / f) * f);
      }
      ie.geometry.setAttribute("position", new Ct(n.toArray(), 3));
    }
    x();
  }), b.addEventListener("pointermove", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(F, o);
    let a = false;
    const n = k.intersectObject(D), s = oe();
    if (n.length && s.length) {
      const i = new S(...e.points.rawVal[n[0].index]), d = new S(...s[0].point), f = i.sub(d), h = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      h.transformDirection(W.matrixWorld), Math.abs(f.dot(h)) < 1e-4 && (a = true);
    }
    ie.visible = !a;
  });
  let go = false, vo;
  b.addEventListener("pointermove", (t) => {
    var _a2;
    if (!ln) return;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(F, o);
    let a = false;
    const n = k.intersectObject(D), s = oe();
    if (n.length && s.length) {
      const d = new S(...e.points.rawVal[n[0].index]), f = new S(...s[0].point), h = d.sub(f), g = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      g.transformDirection(W.matrixWorld), Math.abs(h.dot(g)) < 1e-4 && (a = true);
    }
    if (a && ln < 5 && (go = true, u.enabled = false, vo = n[0].index), !go || ln % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (vo !== void 0) {
      let d = s[0].point;
      (t.ctrlKey || t.metaKey) && (d = new S(Math.round(d.x), Math.round(d.y), Math.round(d.z))), i[vo] = d.toArray();
    }
    e.points.val = i;
  }), b.addEventListener("pointerup", () => {
    u.enabled = true, go = false;
  }), b.addEventListener("contextmenu", (t) => {
    var _a2;
    const o = M(t);
    if (!o) return;
    k.setFromCamera(F, o);
    let a = false;
    const n = k.intersectObject(D), s = oe();
    if (n.length && s.length) {
      const f = new S(...e.points.rawVal[n[0].index]), h = new S(...s[0].point), g = f.sub(h), _ = (_a2 = s[0].face) == null ? void 0 : _a2.normal;
      _.transformDirection(W.matrixWorld), Math.abs(g.dot(_)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(n[0].index, 1), e.points.val = i, !e.polylines) return;
    const d = e.polylines.rawVal.map((f) => f.filter((h) => h !== n[0].index)).map((f) => f.map((h) => h > n[0].index ? h - 1 : h)).filter((f) => f.length);
    d.push([]), e.polylines.val = d;
  });
}
function $a(e, l, r) {
  const m = Math.round(14.999999999999998), y = { position: e.position.clone(), quaternion: e.quaternion.clone() }, b = setInterval(k, 1e3 / 30);
  let x = 0;
  function k() {
    x++;
    const F = x / m;
    e.position.lerpVectors(y.position, l.position, F), e.quaternion.slerpQuaternions(y.quaternion, l.quaternion, F), r && r(), x == m && clearInterval(b);
  }
}
function La(e, l, r, p) {
  const u = ua(r, e.elements, p);
  return ee.derive(() => {
    u.visible = l.shellResults.val != "none";
  }), u;
}
const Ia = 6, Ao = 10, Ra = 0.012;
function Da(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ba(e, l, r, p) {
  if (!r && !p) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && r) {
    const m = r[e];
    if (m && m.has(l)) return m.get(l);
  }
  return null;
}
function Na(e, l, r, p) {
  const u = new it(), m = new _s();
  m.setColorMap("rainbow");
  const y = new Ht(), b = ee.state([]);
  return ee.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const x = r.val, k = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], F = Da(l.frameResults.val);
    if (u.children.forEach((V) => {
      V.geometry && V.geometry.dispose(), V.material && V.material.dispose();
    }), u.clear(), !F || k.length === 0 || x.length === 0) {
      b.val = [];
      return;
    }
    const M = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, W = (_c = e.deformOutputs) == null ? void 0 : _c.val, ye = [], be = [];
    for (let V = 0; V < k.length; V++) {
      if (k[V].length !== 2) continue;
      const ce = Ba(F, V, M, W);
      ce && (ye.push(ce[0], ce[1]), be.push({ idx: V, vals: ce }));
    }
    if (ye.length === 0) {
      b.val = [];
      return;
    }
    const se = Math.min(...ye), R = Math.max(...ye);
    m.setMin(se), m.setMax(R), b.val = ye;
    const oe = [1 / 0, 1 / 0, 1 / 0], D = [-1 / 0, -1 / 0, -1 / 0];
    for (const V of x) for (let te = 0; te < 3; te++) oe[te] = Math.min(oe[te], V[te]), D[te] = Math.max(D[te], V[te]);
    const le = Math.max(D[0] - oe[0], D[1] - oe[1], D[2] - oe[2], 1) * Ra, B = [], L = [], U = [];
    let N = 0;
    for (const { idx: V, vals: te } of be) {
      const ce = k[V], he = x[ce[0]], ae = x[ce[1]];
      if (!he || !ae) continue;
      const X = new S(ae[0] - he[0], ae[1] - he[1], ae[2] - he[2]), pe = X.length();
      if (pe < 1e-10) continue;
      X.normalize();
      const O = Math.abs(X.y) < 0.99 ? new S(0, 1, 0) : new S(1, 0, 0), xe = new S().crossVectors(X, O).normalize(), ge = new S().crossVectors(X, xe).normalize(), Ee = Ao + 1, Me = Ia;
      for (let Ie = 0; Ie < Ee; Ie++) {
        const Ke = Ie / Ao, st = he[0] + X.x * pe * Ke, mt = he[1] + X.y * pe * Ke, z = he[2] + X.z * pe * Ke, K = te[0] + (te[1] - te[0]) * Ke, j = m.getColor(K) ?? new Ht(0, 0, 0);
        y.copy(j).convertSRGBToLinear();
        for (let J = 0; J < Me; J++) {
          const ve = J / Me * Math.PI * 2, ue = Math.cos(ve), Se = Math.sin(ve);
          B.push(st + (xe.x * ue + ge.x * Se) * le, mt + (xe.y * ue + ge.y * Se) * le, z + (xe.z * ue + ge.z * Se) * le), L.push(y.r, y.g, y.b);
        }
      }
      for (let Ie = 0; Ie < Ao; Ie++) for (let Ke = 0; Ke < Me; Ke++) {
        const st = (Ke + 1) % Me, mt = N + Ie * Me + Ke, z = N + Ie * Me + st, K = N + (Ie + 1) * Me + Ke, j = N + (Ie + 1) * Me + st;
        U.push(mt, z, j), U.push(mt, j, K);
      }
      N += Ee * Me;
    }
    if (B.length === 0) return;
    const E = new ze();
    E.setAttribute("position", new Ct(B, 3)), E.setAttribute("color", new Ct(L, 3)), E.setIndex(U), E.computeVertexNormals();
    const Y = new ft({ vertexColors: true, side: At }), I = new lt(E, Y);
    I.frustumCulled = false, u.add(I);
  }), u.__colorMapValues = b, u;
}
function Xa() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Ya = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Za = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Ua = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function bt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const qa = 16755200, ms = 56831, Ka = 56831, Ga = 56831, On = 65382;
function Ha(e) {
  const l = new it();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const r = new xn(1, 16, 16), p = new ft({ color: qa, transparent: true, opacity: 0.85, depthTest: false }), u = new lt(r, p);
  u.visible = false, u.renderOrder = 100, l.add(u);
  const m = new ze(), y = new ht({ color: ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), b = new Wt(m, y);
  b.visible = false, b.renderOrder = 100, l.add(b);
  const x = new ft({ color: ms, transparent: true, opacity: 0.7, depthTest: false }), k = new lt(new ps(1, 1, 1, 12), x);
  k.visible = false, k.renderOrder = 100, l.add(k);
  const F = new ze(), M = new ft({ color: Ka, transparent: true, opacity: 0.45, side: At, depthTest: false }), W = new lt(F, M);
  W.visible = false, W.renderOrder = 100, l.add(W);
  const ye = new ze(), be = new ht({ color: Ga, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new Wt(ye, be);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const R = new ft({ color: On, transparent: true, opacity: 0.95, depthTest: false }), oe = new ft({ color: On, transparent: true, opacity: 0.85, depthTest: false }), D = new ps(1, 1, 1, 12), ie = new ft({ color: On, transparent: true, opacity: 0.55, side: At, depthTest: false }), le = new ht({ color: On, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), B = [];
  window.__hekatanModelSelection = B;
  const L = new it();
  L.renderOrder = 101, l.add(L);
  const U = document.createElement("div");
  Object.assign(U.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), U.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(U);
  }, 0);
  function N(z) {
    const K = e.derivedNodes.rawVal;
    return !K || z < 0 || z >= K.length ? null : new S(K[z][0], K[z][1], K[z][2]);
  }
  function E(z, K) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const j = e.getActiveCamera();
    if (!j || !e.mesh) return null;
    const J = e.rendererElm.getBoundingClientRect(), ve = z - J.left, ue = K - J.top, Se = e.derivedNodes.rawVal, me = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Se || !me) return null;
    const De = /* @__PURE__ */ new Map(), Te = (qe) => {
      if (De.has(qe)) return De.get(qe);
      const Ce = N(qe);
      if (!Ce) return De.set(qe, null), null;
      const Ve = Ce.clone().project(j), He = (Ve.x * 0.5 + 0.5) * J.width, Fe = (-Ve.y * 0.5 + 0.5) * J.height, ct = { x: He, y: Fe, z: Ve.z };
      return De.set(qe, ct), ct;
    }, We = /* @__PURE__ */ new Set();
    for (const qe of me) if (qe) for (const Ce of qe) We.add(Ce);
    const Qe = 8;
    let Ze = -1, rt = Qe;
    for (let qe = 0; qe < Se.length; qe++) {
      if (!We.has(qe)) continue;
      const Ce = Te(qe);
      if (!Ce || Ce.z < -1 || Ce.z > 1) continue;
      const Ve = Ce.x - ve, He = Ce.y - ue, Fe = Math.sqrt(Ve * Ve + He * He);
      Fe < rt && (rt = Fe, Ze = qe);
    }
    const Ne = Xa(), we = Za[Ne.dispUnit] ?? 1e3, Pe = Ya[Ne.forceUnit] ?? 1;
    if (Ze >= 0) {
      const qe = Se[Ze];
      let Ce = `Nodo ${Ze}
(${qe[0].toFixed(3)}, ${qe[1].toFixed(3)}, ${qe[2].toFixed(3)})`;
      const Ve = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (Ve == null ? void 0 : Ve.deformations) {
        const He = Ve.deformations.get(Ze);
        if (He && (Ce += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Ce += `
Ux = ${bt(He[0] * we, 3)} ${Ne.dispUnit}`, Ce += `
Uy = ${bt(He[1] * we, 3)} ${Ne.dispUnit}`, Ce += `
Uz = ${bt(He[2] * we, 3)} ${Ne.dispUnit}`, (Math.abs(He[3]) > 1e-9 || Math.abs(He[4]) > 1e-9 || Math.abs(He[5]) > 1e-9) && (Ce += `
Rx = ${bt(He[3] * 1e3, 3)} mrad`, Ce += `
Ry = ${bt(He[4] * 1e3, 3)} mrad`, Ce += `
Rz = ${bt(He[5] * 1e3, 3)} mrad`)), Ve.reactions) {
          const Fe = Ve.reactions.get(Ze);
          Fe && (Math.abs(Fe[0]) > 1e-9 || Math.abs(Fe[1]) > 1e-9 || Math.abs(Fe[2]) > 1e-9 || Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Ce += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Ce += `
Fx = ${bt(Fe[0] * Pe)} ${Ne.forceUnit}`, Ce += `
Fy = ${bt(Fe[1] * Pe)} ${Ne.forceUnit}`, Ce += `
Fz = ${bt(Fe[2] * Pe)} ${Ne.forceUnit}`, (Math.abs(Fe[3]) > 1e-6 || Math.abs(Fe[4]) > 1e-6 || Math.abs(Fe[5]) > 1e-6) && (Ce += `
Mx = ${bt(Fe[3] * Pe)} ${Ne.forceUnit}\xB7m`, Ce += `
My = ${bt(Fe[4] * Pe)} ${Ne.forceUnit}\xB7m`, Ce += `
Mz = ${bt(Fe[5] * Pe)} ${Ne.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ze, info: Ce };
    }
    const xt = 5;
    let Xe = -1, Oe = xt, kt = "frame";
    for (let qe = 0; qe < me.length; qe++) {
      const Ce = me[qe];
      if (!(!Ce || Ce.length < 2)) {
        if (Ce.length === 2) {
          const Ve = Te(Ce[0]), He = Te(Ce[1]);
          if (!Ve || !He || Ve.z < -1 || Ve.z > 1 || He.z < -1 || He.z > 1) continue;
          const Fe = Wa(ve, ue, Ve.x, Ve.y, He.x, He.y);
          Fe < Oe && (Oe = Fe, Xe = qe, kt = "frame");
        } else if (Ce.length === 3 || Ce.length === 4) {
          const Ve = [];
          let He = true;
          for (const Fe of Ce) {
            const ct = Te(Fe);
            if (!ct || ct.z < -1 || ct.z > 1) {
              He = false;
              break;
            }
            Ve.push(ct);
          }
          if (!He) continue;
          if (Ja(ve, ue, Ve)) {
            const ct = Ve.reduce((ut, dt) => ut + dt.z, 0) / Ve.length * 1e-3;
            ct < Oe && (Oe = ct, Xe = qe, kt = "shell");
          }
        } else if (Ce.length === 8) {
          const Ve = [];
          let He = true;
          for (const Be of Ce) {
            const Je = Te(Be);
            if (!Je || Je.z < -1 || Je.z > 1) {
              He = false;
              break;
            }
            Ve.push(Je);
          }
          if (!He) continue;
          const Fe = Math.min(...Ve.map((Be) => Be.x)), ct = Math.max(...Ve.map((Be) => Be.x)), ut = Math.min(...Ve.map((Be) => Be.y)), dt = Math.max(...Ve.map((Be) => Be.y));
          if (ve >= Fe && ve <= ct && ue >= ut && ue <= dt) {
            const Je = Ve.reduce((wt, Ae) => wt + Ae.z, 0) / Ve.length * 1e-3;
            Je < Oe && (Oe = Je, Xe = qe, kt = "solid");
          }
        }
      }
    }
    if (Xe >= 0) {
      const qe = me[Xe];
      let Ve = `${kt === "frame" ? "Frame" : kt === "shell" ? "Shell" : "Solid"} ${Xe}`;
      const He = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, Fe = (_g = (_f = He == null ? void 0 : He.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, Xe);
      if (Fe) {
        Fe.name && (Ve += `
  \u{1F4CB} ${Fe.name}`), Fe.shape && (Ve += `
  Shape: ${Fe.shape}`);
        const ct = /concrete|hormig|rect.*sólida/i.test(Fe.shape || ""), ut = ct ? 100 : 1e3, dt = ct ? "cm" : "mm", Be = (wt) => {
          const Ae = wt * ut;
          return Math.abs(Ae - Math.round(Ae)) < 0.05 ? `${Math.round(Ae)}` : `${Ae.toFixed(1)}`;
        }, Je = [];
        if (Fe.D != null && Je.push(`D=${Be(Fe.D)}`), Fe.B != null && Je.push(`B=${Be(Fe.B)}`), Fe.TF != null && Je.push(`TF=${Be(Fe.TF)}`), Fe.TW != null && Je.push(`TW=${Be(Fe.TW)}`), Fe.t != null && Je.push(`t=${Be(Fe.t)}`), Je.length && (Ve += `
  Dim: ${Je.join(" ")} ${dt}`), Fe.material) {
          let wt = Fe.material;
          Fe.fillMaterial && (wt += ` + FILL "${Fe.fillMaterial}"`), Ve += `
  Mat: ${wt}`;
        }
      } else {
        const ct = (_i = (_h = He == null ? void 0 : He.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, Xe), ut = (_k = (_j = He == null ? void 0 : He.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, Xe);
        ct ? (Ve += `
  ${ct}`, ut && !ct.includes(ut) && (Ve += `  (${ut})`)) : ut && (Ve += `
  Material: ${ut}`);
      }
      if (Ve += `
nodos: [${qe.join(", ")}]`, kt === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const ct = e.mesh.analyzeOutputs.rawVal, ut = Ua[Ne.stressUnit] ?? 1, dt = [["bendingXX", "Mxx", Pe, `${Ne.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Pe, `${Ne.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Pe, `${Ne.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Pe, `${Ne.forceUnit}/m`], ["membraneYY", "Nyy", Pe, `${Ne.forceUnit}/m`], ["membraneXY", "Nxy", Pe, `${Ne.forceUnit}/m`], ["shearX", "Qx", Pe, `${Ne.forceUnit}/m`], ["shearY", "Qy", Pe, `${Ne.forceUnit}/m`], ["vonMises", "\u03C3VM", ut, Ne.stressUnit], ["pressure", "p", ut, Ne.stressUnit]], Be = [];
        for (const [Je, wt, Ae, Mt] of dt) {
          const _t = ct == null ? void 0 : ct[Je];
          if (_t && _t instanceof Map) {
            const Dt = _t.get(Xe);
            if (Dt != null) {
              if (typeof Dt == "number") Be.push(`${wt} = ${bt(Dt * Ae, 3)} ${Mt}`);
              else if (Array.isArray(Dt)) {
                let Et = Dt[0];
                for (const $t of Dt) Math.abs($t) > Math.abs(Et) && (Et = $t);
                Be.push(`${wt} = ${bt(Et * Ae, 3)} ${Mt}`);
              }
            }
          }
        }
        Be.length > 0 && (Ve += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Be.slice(0, 8).join(`
`));
      }
      if (kt === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const ct = e.mesh.deformOutputs.rawVal, ut = e.mesh.elementInputs.rawVal, dt = ct == null ? void 0 : ct.deformations;
        if (dt && qe.length === 2) {
          const Be = dt.get(qe[0]), Je = dt.get(qe[1]), wt = Se[qe[0]], Ae = Se[qe[1]];
          if (Be && Je && wt && Ae) {
            const Mt = Ae[0] - wt[0], _t = Ae[1] - wt[1], Dt = Ae[2] - wt[2], Et = Math.sqrt(Mt * Mt + _t * _t + Dt * Dt);
            if (Et > 1e-9) {
              const $t = Mt / Et, nn = _t / Et, Ut = Dt / Et, gn = (Je[0] - Be[0]) * $t + (Je[1] - Be[1]) * nn + (Je[2] - Be[2]) * Ut, Vt = ((_n = ut.elasticities) == null ? void 0 : _n.get(Xe)) ?? 0, on = ((_o = ut.areas) == null ? void 0 : _o.get(Xe)) ?? 0, vn = ((_p = ut.momentsOfInertiaY) == null ? void 0 : _p.get(Xe)) ?? 0, Ln = ((_q = ut.momentsOfInertiaZ) == null ? void 0 : _q.get(Xe)) ?? 0, so = ((_r = ut.torsionalConstants) == null ? void 0 : _r.get(Xe)) ?? 0, ao = ((_s2 = ut.shearModuli) == null ? void 0 : _s2.get(Xe)) ?? Vt / 2.6, sn = Vt * on * (gn / Et), In = (Je[3] - Be[3]) * $t + (Je[4] - Be[4]) * nn + (Je[5] - Be[5]) * Ut, an = ao * so * (In / Et), Rn = Je[4] - Be[4], Dn = Je[5] - Be[5], bn = Vt * vn * Rn / Et, pn = Vt * Ln * Dn / Et;
              Ve += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Ve += `
L = ${bt(Et, 3)} m`, Ve += `
\u0394L = ${bt(gn * we, 3)} ${Ne.dispUnit}`, Ve += `
\u03B5 = ${bt(gn / Et, 6)}`, Math.abs(sn) > 1e-6 && (Ve += `
N \u2248 ${bt(sn * Pe)} ${Ne.forceUnit}`), Math.abs(an) > 1e-6 && (Ve += `
T \u2248 ${bt(an * Pe)} ${Ne.forceUnit}\xB7m`), Math.abs(bn) > 1e-6 && (Ve += `
My \u2248 ${bt(bn * Pe)} ${Ne.forceUnit}\xB7m`), Math.abs(pn) > 1e-6 && (Ve += `
Mz \u2248 ${bt(pn * Pe)} ${Ne.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: kt, idx: Xe, info: Ve };
    }
    return null;
  }
  function Y(z, K, j) {
    var _a2, _b, _c;
    if (u.visible = false, b.visible = false, k.visible = false, W.visible = false, se.visible = false, !z || !e.mesh) {
      U.style.display = "none", e.render();
      return;
    }
    const J = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (z.type === "node") {
      const me = N(z.idx);
      if (me) {
        const De = e.derivedNodes.rawVal ?? [];
        let Te = 1;
        if (De.length >= 2) {
          let Ze = [1 / 0, 1 / 0, 1 / 0], rt = [-1 / 0, -1 / 0, -1 / 0];
          for (const Ne of De) for (let we = 0; we < 3; we++) Ne[we] < Ze[we] && (Ze[we] = Ne[we]), Ne[we] > rt[we] && (rt[we] = Ne[we]);
          Te = Math.max(rt[0] - Ze[0], rt[1] - Ze[1], rt[2] - Ze[2], 0.1);
        }
        const We = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Qe = 0.021 * Te * We;
        u.position.copy(me), u.scale.setScalar(Qe), u.visible = true;
      }
    } else if (z.type === "frame" && J) {
      const me = J[z.idx], De = N(me[0]), Te = N(me[1]);
      if (De && Te) {
        const We = De.clone().add(Te).multiplyScalar(0.5), Qe = Te.clone().sub(De), Ze = Qe.length(), we = e.getActiveCamera().position.distanceTo(We) * 35e-4;
        k.position.copy(We);
        const Pe = new S(0, 1, 0), xt = Pe.clone().cross(Qe).normalize(), Xe = Pe.angleTo(Qe);
        k.quaternion.setFromAxisAngle(xt, Xe), k.scale.set(we, Ze, we), k.visible = true;
      }
    } else if (z.type === "shell" && J) {
      const me = J[z.idx], De = [], Te = [];
      for (const We of me) {
        const Qe = N(We);
        if (!Qe) return;
        De.push(Qe.x, Qe.y, Qe.z);
      }
      me.length === 4 ? Te.push(0, 1, 2, 0, 2, 3) : me.length === 3 && Te.push(0, 1, 2), F.setAttribute("position", new Ct(De, 3)), F.setIndex(Te), F.computeVertexNormals(), W.visible = true;
    } else if (z.type === "solid" && J) {
      const me = J[z.idx], De = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Te = [];
      for (const [We, Qe] of De) {
        const Ze = N(me[We]), rt = N(me[Qe]);
        Ze && rt && Te.push(Ze.x, Ze.y, Ze.z, rt.x, rt.y, rt.z);
      }
      ye.setAttribute("position", new Ct(Te, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      U.style.display = "none", e.render();
      return;
    }
    U.textContent = z.info, U.style.whiteSpace = "pre-line", U.style.display = "block";
    const ue = e.rendererElm.getBoundingClientRect(), Se = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? ue;
    U.style.left = `${K - Se.left}px`, U.style.top = `${j - Se.top}px`, e.render();
  }
  let I = "", V = 0, te = 0;
  const ce = window.__hekatanHoverDebug ?? false, he = (z) => {
    V && cancelAnimationFrame(V), V = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const K = E(z.clientX, z.clientY);
      if (ce && te < 5) {
        const J = e.derivedNodes.rawVal, ve = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${z.clientX}, ${z.clientY}) nodes=${(J == null ? void 0 : J.length) ?? 0} elems=${(ve == null ? void 0 : ve.length) ?? 0} hover=`, K), te++;
      }
      const j = K ? `${K.type}:${K.idx}` : "";
      if (j !== I) I = j, Y(K, z.clientX, z.clientY);
      else if (K) {
        const J = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        U.style.left = `${z.clientX - J.left}px`, U.style.top = `${z.clientY - J.top}px`;
      }
    });
  };
  let ae = null;
  const X = () => {
    I = "", u.visible = false, b.visible = false, k.visible = false, W.visible = false, se.visible = false, U.style.display = "none", e.render();
  }, pe = (z) => {
    const K = e.rendererElm.getBoundingClientRect(), j = z.clientX - K.left, J = z.clientY - K.top;
    (j < -2 || J < -2 || j > K.width + 2 || J > K.height + 2) && (ae && clearTimeout(ae), ae = window.setTimeout(X, 200));
  }, O = () => {
    ae && (clearTimeout(ae), ae = null);
  };
  e.rendererElm.addEventListener("pointermove", he), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", O);
  function xe() {
    var _a2, _b, _c;
    const z = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return z === "select" || z === "none" || !z;
  }
  let ge = null;
  e.rendererElm.addEventListener("pointerdown", (z) => {
    z.button === 0 && (ge = { x: z.clientX, y: z.clientY });
  }), e.rendererElm.addEventListener("pointerup", (z) => {
    if (z.button !== 0 || !ge) return;
    const K = z.clientX - ge.x, j = z.clientY - ge.y;
    if (ge = null, K * K + j * j > 9 || !xe()) return;
    const J = E(z.clientX, z.clientY);
    J ? (st({ type: J.type, idx: J.idx }, z.shiftKey), Ke()) : mt();
  }), window.addEventListener("keydown", (z) => {
    if (z.key !== "Escape" || !B.length) return;
    const K = document.activeElement, j = !!K && (K.id === "hk3-cmd-input" || K.id === "hk-dyn-input") && K.value === "";
    K && (K.tagName === "INPUT" || K.tagName === "TEXTAREA" || K.isContentEditable) && !j || mt();
  }, { capture: true });
  function Ee() {
    for (const z of L.children.slice()) {
      L.remove(z);
      const K = z.geometry;
      K && K !== r && K !== D && K.dispose();
    }
  }
  const Me = (z) => {
    var _a2;
    const K = e.getActiveCamera(), j = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return K.isOrthographicCamera ? (K.top - K.bottom) / (K.zoom || 1) / j : 2 * K.position.distanceTo(z) * Math.tan((K.fov || 50) * Math.PI / 180 / 2) / j;
  };
  function Ie(z, K) {
    var _a2, _b;
    const j = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (z.type === "node") {
      const J = N(z.idx);
      if (!J) return;
      const ve = new lt(r, R);
      ve.position.copy(J), ve.scale.setScalar(Math.max(1e-4, 7 * Me(J))), ve.renderOrder = 101, L.add(ve);
    } else if (z.type === "frame" && j) {
      const J = j[z.idx], ve = N(J[0]), ue = N(J[1]);
      if (!ve || !ue) return;
      const Se = ve.clone().add(ue).multiplyScalar(0.5), me = ue.clone().sub(ve), De = me.length(), Te = e.getActiveCamera().position.distanceTo(Se), We = new lt(D, oe);
      We.position.copy(Se);
      const Qe = new S(0, 1, 0);
      We.quaternion.setFromAxisAngle(Qe.clone().cross(me).normalize(), Qe.angleTo(me)), We.scale.set(Te * 35e-4, De, Te * 35e-4), We.renderOrder = 101, L.add(We);
    } else if (z.type === "shell" && j) {
      const J = j[z.idx], ve = [], ue = [];
      for (const De of J) {
        const Te = N(De);
        if (!Te) return;
        ve.push(Te.x, Te.y, Te.z);
      }
      J.length === 4 ? ue.push(0, 1, 2, 0, 2, 3) : J.length === 3 && ue.push(0, 1, 2);
      const Se = new ze();
      Se.setAttribute("position", new Ct(ve, 3)), Se.setIndex(ue), Se.computeVertexNormals();
      const me = new lt(Se, ie);
      me.renderOrder = 101, L.add(me);
    } else if (z.type === "solid" && j) {
      const J = j[z.idx], ve = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], ue = [];
      for (const [De, Te] of ve) {
        const We = N(J[De]), Qe = N(J[Te]);
        We && Qe && ue.push(We.x, We.y, We.z, Qe.x, Qe.y, Qe.z);
      }
      const Se = new ze();
      Se.setAttribute("position", new Ct(ue, 3));
      const me = new Wt(Se, le);
      me.renderOrder = 101, L.add(me);
    }
  }
  function Ke() {
    if (Ee(), !B.length || !e.mesh) {
      e.render();
      return;
    }
    const z = e.derivedNodes.rawVal ?? [];
    if (z.length >= 2) {
      const K = [1 / 0, 1 / 0, 1 / 0], j = [-1 / 0, -1 / 0, -1 / 0];
      for (const J of z) for (let ve = 0; ve < 3; ve++) J[ve] < K[ve] && (K[ve] = J[ve]), J[ve] > j[ve] && (j[ve] = J[ve]);
      Math.max(j[0] - K[0], j[1] - K[1], j[2] - K[2], 0.1);
    }
    for (const K of B) Ie(K);
    e.render();
  }
  function st(z, K) {
    const j = B.findIndex((J) => J.type === z.type && J.idx === z.idx);
    j >= 0 ? B.splice(j, 1) : K || B.push(z), B.length && B[B.length - 1];
  }
  function mt() {
    B.length = 0, Ke();
  }
  return ee.derive(() => {
    e.derivedNodes.val, B.length && Ke();
  }), l;
}
function Wa(e, l, r, p, u, m) {
  const y = u - r, b = m - p, x = y * y + b * b;
  if (x < 1e-9) {
    const be = e - r, se = l - p;
    return Math.sqrt(be * be + se * se);
  }
  let k = ((e - r) * y + (l - p) * b) / x;
  k = Math.max(0, Math.min(1, k));
  const F = r + k * y, M = p + k * b, W = e - F, ye = l - M;
  return Math.sqrt(W * W + ye * ye);
}
function Ja(e, l, r) {
  let p = false;
  for (let u = 0, m = r.length - 1; u < r.length; m = u++) {
    const y = r[u].x, b = r[u].y, x = r[m].x, k = r[m].y;
    b > l != k > l && e < (x - y) * (l - b) / (k - b + 1e-12) + y && (p = !p);
  }
  return p;
}
const Oa = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Qa = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, tn = 1e-3;
function En(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function ja(e, l) {
  const r = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < tn ? { plano: "XZ", en: e[1] } : r < tn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function ei(e, l) {
  var _a2, _b;
  let r = null, p = { plano: "XZ", en: 0 };
  const u = () => {
    var _a3, _b2;
    const D = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !D || D === "none" ? null : String(D).replace(/^contour:/, "");
  }, m = (D) => {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], B = /* @__PURE__ */ new Set();
    for (const L of le) {
      if (L.length !== 2) continue;
      const U = ie[L[0]], N = ie[L[1]];
      if (!U || !N) continue;
      const E = En(U, D), Y = En(N, D);
      Math.abs(E.fuera - Y.fuera) < tn && B.add(Math.round(E.fuera * 1e3) / 1e3);
    }
    return [...B].sort((L, U) => L - U);
  };
  function y(D) {
    var _a3, _b2;
    if (D == null ? void 0 : D.plano) p = { plano: D.plano, en: D.en ?? m(D.plano)[0] ?? 0 };
    else {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((U) => U.type === "frame"), B = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], L = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      le && L[le.idx] && B[L[le.idx][0]] && B[L[le.idx][1]] ? p = ja(B[L[le.idx][0]], B[L[le.idx][1]]) : p = { plano: "XZ", en: m("XZ")[0] ?? 0 };
    }
    r || b(), r.hidden = false, x();
  }
  function b() {
    r = document.createElement("div"), r.id = "hk-diagrama-2d", r.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), r.innerHTML = `
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
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(r), r.querySelector(".hk-d2-x").addEventListener("click", () => {
      r.hidden = true;
    });
    const D = r.querySelector(".hk-d2-plano"), ie = r.querySelector(".hk-d2-en");
    D.addEventListener("change", () => {
      p = { plano: D.value, en: m(D.value)[0] ?? 0 }, x();
    }), ie.addEventListener("change", () => {
      p.en = Number(ie.value), x();
    });
    const le = (U) => {
      const N = m(p.plano), E = N.findIndex((I) => Math.abs(I - p.en) < tn), Y = Math.max(0, Math.min(N.length - 1, (E < 0 ? 0 : E) + U));
      N.length && (p.en = N[Y], x());
    };
    r.querySelector(".hk-d2-ant").addEventListener("click", () => le(-1)), r.querySelector(".hk-d2-sig").addEventListener("click", () => le(1));
    const B = r.querySelector(".hk-d2-bar");
    let L = null;
    B.addEventListener("pointerdown", (U) => {
      if (U.target.closest("select,button")) return;
      const N = r.getBoundingClientRect();
      L = { x: U.clientX, y: U.clientY, l: N.left, t: N.top }, r.style.transform = "none", r.style.left = N.left + "px", r.style.top = N.top + "px";
    }), window.addEventListener("pointermove", (U) => {
      !L || !r || (r.style.left = L.l + U.clientX - L.x + "px", r.style.top = L.t + U.clientY - L.y + "px");
    }), window.addEventListener("pointerup", () => {
      L = null;
    }), new ResizeObserver(() => {
      r && !r.hidden && x();
    }).observe(r);
  }
  function x() {
    var _a3, _b2, _c, _d, _e, _f, _g, _h;
    if (!r || r.hidden) return;
    const D = new Set(M && !M.hidden && W >= 0 ? be(W) : []), ie = r.querySelector(".hk-d2-svg"), le = r.querySelector(".hk-d2-tit"), B = r.querySelector(".hk-d2-pie"), L = r.querySelector(".hk-d2-plano"), U = r.querySelector(".hk-d2-en");
    L.value = p.plano;
    const N = m(p.plano), E = p.plano === "XZ" ? "y" : p.plano === "YZ" ? "x" : "z", Y = p.plano === "XY" ? "Planta" : "P\xF3rtico";
    U.innerHTML = N.map((we, Pe) => `<option value="${we}" ${Math.abs(we - p.en) < tn ? "selected" : ""}>${Y} ${Pe + 1} \xB7 ${E} = ${we.toFixed(2)} m</option>`).join("");
    const I = u(), V = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], te = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], ce = I ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[I] : null;
    ie.innerHTML = "";
    const he = ie.clientWidth || 880, ae = ie.clientHeight || 480, X = [];
    if (te.forEach((we, Pe) => {
      if (we.length !== 2) return;
      const xt = V[we[0]], Xe = V[we[1]];
      if (!xt || !Xe) return;
      const Oe = En(xt, p.plano), kt = En(Xe, p.plano);
      Math.abs(Oe.fuera - p.en) < tn && Math.abs(kt.fuera - p.en) < tn && X.push({ i: Pe, a: Oe, b: kt });
    }), !X.length) {
      B.textContent = "No hay barras en este plano.", le.textContent = "";
      return;
    }
    let pe = 1 / 0, O = -1 / 0, xe = 1 / 0, ge = -1 / 0;
    for (const we of X) for (const Pe of [we.a, we.b]) pe = Math.min(pe, Pe.u), O = Math.max(O, Pe.u), xe = Math.min(xe, Pe.v), ge = Math.max(ge, Pe.v);
    const Ee = O - pe || 1, Me = ge - xe || 1, Ie = 0.12 * Math.max(Ee, Me), Ke = 46, st = Math.min((he - 2 * Ke) / (Ee + 2 * Ie), (ae - 2 * Ke) / (Me + 2 * Ie)), mt = (he - Ee * st) / 2, z = (ae - Me * st) / 2, K = (we) => mt + (we - pe) * st, j = (we) => ae - (z + (we - xe) * st), J = "http://www.w3.org/2000/svg", ve = (we, Pe, xt) => {
      const Xe = document.createElementNS(J, we);
      for (const Oe in Pe) Xe.setAttribute(Oe, String(Pe[Oe]));
      return xt != null && (Xe.textContent = xt), ie.appendChild(Xe), Xe;
    }, ue = /* @__PURE__ */ new Map();
    for (const we of X) {
      const Pe = ((_h = (_g = (_f = (_e = e.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, we.i)) ?? 0, xt = En(zs(I ?? "normals", Cs(V[te[we.i][0]], V[te[we.i][1]], Pe)), p.plano), Xe = Math.hypot(xt.u, xt.v);
      ue.set(we.i, Xe > 0.3 ? [xt.u / Xe, -xt.v / Xe] : null);
    }
    const Se = X.filter((we) => !ue.get(we.i)).length;
    let me = 0;
    if (ce) for (const we of X) {
      if (!ue.get(we.i)) continue;
      const Pe = ce instanceof Map ? ce.get(we.i) : ce[we.i];
      Pe && (me = Math.max(me, Math.abs(Pe[0] ?? 0), Math.abs(Pe[1] ?? 0)));
    }
    const De = 0.12 * Math.max(Ee, Me) * st, Te = me > 0 ? De / me : 0, We = I === "bendingsY" || I === "bendingsZ", Qe = (we) => Math.abs(we) >= 100 ? we.toFixed(1) : Math.abs(we) >= 10 ? we.toFixed(2) : we.toFixed(3), Ze = [];
    for (const we of X) {
      const Pe = K(we.a.u), xt = j(we.a.v), Xe = K(we.b.u), Oe = j(we.b.v), kt = ue.get(we.i), [qe, Ce] = kt ?? [0, 0], Ve = ce && kt ? ce instanceof Map ? ce.get(we.i) : ce[we.i] : null, [He, Fe] = Ve ? Vo(I, Ve) : [0, 0];
      if (Ve && Te > 0) {
        const Be = [Pe + qe * He * Te * 1, xt + Ce * He * Te * 1], Je = [Xe + qe * Fe * Te * 1, Oe + Ce * Fe * Te * 1], Mt = He + Fe >= 0 ? "#3fa7d6" : "#d9534f";
        ve("polygon", { points: `${Pe},${xt} ${Be[0]},${Be[1]} ${Je[0]},${Je[1]} ${Xe},${Oe}`, fill: Mt, "fill-opacity": 0.38, stroke: Mt, "stroke-width": 1.2 }), Ze.push({ x: Be[0] + qe * 12, y: Be[1] + Ce * 12, t: Qe(He), peso: Math.abs(He) }), Ze.push({ x: Je[0] + qe * 12, y: Je[1] + Ce * 12, t: Qe(Fe), peso: Math.abs(Fe) });
      }
      ve("line", { x1: Pe, y1: xt, x2: Xe, y2: Oe, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), D.has(we.i) && ve("line", { x1: Pe, y1: xt, x2: Xe, y2: Oe, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const ct = ve("line", { x1: Pe, y1: xt, x2: Xe, y2: Oe, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      ct.addEventListener("click", () => se(we.i));
      const ut = document.createElementNS(J, "title");
      ut.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", ct.appendChild(ut);
    }
    for (const we of X) for (const Pe of [we.a, we.b]) p.plano !== "XY" && Math.abs(Pe.v - xe) < tn && ve("rect", { x: K(Pe.u) - 6, y: j(Pe.v), width: 12, height: 7, fill: "#b03a3a" });
    const rt = [];
    Ze.sort((we, Pe) => Pe.peso - we.peso);
    for (const we of Ze) we.peso < 0.02 * me || rt.some((Pe) => Math.hypot(Pe.x - we.x, Pe.y - we.y) < 34) || (rt.push(we), ve("text", { x: we.x, y: we.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, we.t));
    const Ne = I ? Oa[I] ?? I : "sin resultado";
    le.textContent = `${Ne} \xB7 ${p.plano === "XY" ? "planta" : "alzado"} ${p.plano} en ${E} = ${p.en.toFixed(2)} m`, B.textContent = I ? `${X.length} barras en el plano \xB7 m\xE1ximo ${Qe(me)} ${Qa[I] ?? ""}` + (We ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (Se ? ` \xB7 ${Se} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const k = () => {
    try {
      x();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, k();
  }));
  let F = null;
  setInterval(() => {
    var _a3, _b2;
    const D = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, ie = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, le = [D, ie];
    if (!(F && F[0] === D && F[1] === ie)) {
      F = le, k();
      try {
        oe();
      } catch {
      }
    }
  }, 400);
  let M = null, W = -1, ye = "12";
  function be(D) {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], B = /* @__PURE__ */ new Map();
    le.forEach((E, Y) => {
      if (E.length === 2) for (const I of E) B.has(I) || B.set(I, []), B.get(I).push(Y);
    });
    const L = (E) => {
      const Y = ie[le[E][0]], I = ie[le[E][1]], V = [I[0] - Y[0], I[1] - Y[1], I[2] - Y[2]], te = Math.hypot(V[0], V[1], V[2]) || 1;
      return V.map((ce) => ce / te);
    }, U = (E, Y) => {
      const I = L(E), V = L(Y);
      return Math.abs(I[0] * V[0] + I[1] * V[1] + I[2] * V[2]) > 0.9999;
    }, N = [D];
    for (const E of [0, 1]) {
      let Y = D, I = le[D][E];
      for (let V = 0; V < 500; V++) {
        const te = (B.get(I) ?? []).filter((he) => he !== Y);
        if (te.length !== 1 || !U(Y, te[0])) break;
        const ce = te[0];
        E === 0 ? N.unshift(ce) : N.push(ce), I = le[ce][0] === I ? le[ce][1] : le[ce][0], Y = ce;
      }
    }
    return N;
  }
  function se(D) {
    if (D == null) {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((B) => B.type === "frame");
      if (!le) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      D = le.idx;
    }
    W = D, M || (M = document.createElement("div"), M.id = "hk-diagrama-barra", M.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), M.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(M), M.querySelector(".hk-b-x").addEventListener("click", () => {
      M.hidden = true, R(), x();
    }), M.querySelector(".hk-b-pl").addEventListener("change", (ie) => {
      ye = ie.target.value, oe();
    })), M.hidden = false, R(), oe(), x();
  }
  function R() {
    if (!r || !M) return;
    const D = window.innerWidth, ie = Math.min(560, Math.round(D * 0.4));
    M.style.width = ie + "px", !M.hidden && !r.hidden ? (r.style.transform = "none", r.style.left = "12px", r.style.width = D - ie - 36 + "px", M.style.top = r.getBoundingClientRect().top + "px") : r.hidden || (r.style.left = "50%", r.style.transform = "translateX(-50%)", r.style.width = "min(900px,92vw)");
  }
  function oe() {
    var _a3, _b2, _c;
    if (!M || M.hidden || W < 0) return;
    const D = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ie = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], le = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!ie[W]) return;
    const B = be(W), L = [];
    let U = 0, N = -1;
    B.forEach((O, xe) => {
      const [ge, Ee] = ie[O], Me = xe === 0 ? B.length > 1 && ie[B[1]].includes(ge) : ge !== N, Ie = Me ? Ee : ge, Ke = Me ? ge : Ee, st = Math.hypot(D[Ke][0] - D[Ie][0], D[Ke][1] - D[Ie][1], D[Ke][2] - D[Ie][2]);
      L.push({ x: U, e: O, fin: Me ? 1 : 0 }), U += st, L.push({ x: U, e: O, fin: Me ? 0 : 1 }), N = Ke;
    });
    const E = U, Y = (O, xe) => {
      const ge = le[O], Ee = ge ? ge instanceof Map ? ge.get(xe.e) : ge[xe.e] : null;
      return Ee ? Vo(O, Ee)[xe.fin] : 0;
    }, I = D[ie[B[0]][0]], V = (O) => O.toFixed(2);
    M.querySelector(".hk-b-tit").textContent = "L = " + E.toFixed(2) + " m \xB7 " + B.length + " tramo(s) \xB7 desde (" + V(I[0]) + ", " + V(I[1]) + ", " + V(I[2]) + ")";
    const te = ye === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], ce = M.querySelector(".hk-b-cuerpo");
    ce.innerHTML = "";
    const he = Math.max(300, ce.clientWidth), ae = 124, X = 46, pe = (ae - 14) / 2;
    for (const [O, xe, ge, Ee] of te) {
      const Me = L.map((me) => Y(O, me)), Ie = Math.max(...Me), Ke = Math.min(...Me), st = Math.max(Math.abs(Ie), Math.abs(Ke)) || 1, mt = (me) => X + me / (E || 1) * (he - 2 * X), z = (me) => pe + (Ee ? 1 : -1) * (me / st) * (pe - 16), K = (me) => Math.abs(me) >= 100 ? me.toFixed(1) : Math.abs(me) >= 10 ? me.toFixed(2) : me.toFixed(3);
      let j = mt(0) + "," + pe + " ";
      L.forEach((me, De) => {
        j += mt(me.x) + "," + z(Me[De]) + " ";
      }), j += mt(E) + "," + pe;
      const J = Me.indexOf(Ie), ve = Me.indexOf(Ke), ue = (me, De) => {
        const Te = z(Me[me]) + (z(Me[me]) < pe ? -5 : 13);
        return '<text x="' + mt(L[me].x) + '" y="' + Te + '" text-anchor="middle" fill="' + De + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + K(Me[me]) + "</text>";
      }, Se = Ee ? "#d9534f" : "#3fa7d6";
      ce.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + xe + ' <span style="color:#6f7d90;font-weight:400">(' + ge + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + K(Ie) + " \xB7 m\xEDn " + K(Ke) + (Ee ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + he + '" height="' + ae + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + X + '" y1="' + pe + '" x2="' + (he - X) + '" y2="' + pe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + j + '" fill="' + Se + '" fill-opacity=".35" stroke="' + Se + '" stroke-width="1.4"/>' + ue(0, "#f2f5fa") + ue(L.length - 1, "#f2f5fa") + (J > 0 && J < L.length - 1 ? ue(J, "#8fd3ff") : "") + (ve > 0 && ve < L.length - 1 && ve !== J ? ue(ve, "#ff9f9a") : "") + '<text x="' + X + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (he - X) + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + E.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = se, window.__hekatanDiagrama2D = y, { abrir: y, abrirBarra: se };
}
function ws(e, l = 8) {
  const r = document.createElement("div");
  r.id = "legend", r.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    ee.derive(() => {
      oo.val, r.style.background = pa();
    });
  });
  const p = document.createElement("div");
  p.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", r.appendChild(p), setTimeout(() => {
    ee.derive(() => {
      p.textContent = To.val ? `[${To.val}]` : "";
    });
  });
  const u = Array.from({ length: l + 1 }, (x, k) => k / l).reverse();
  let m, y;
  u.forEach((x, k) => {
    m = document.createElement("div"), m.id = `marker-${k}`, m.className = "marker", m.style.marginTop = k == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", y = document.createElement("p"), y.id = `marker-text-${k}`, m.append(y), r.append(m);
  });
  const b = [];
  return r.querySelectorAll("p").forEach((x) => b.push(x)), setTimeout(() => {
    ee.derive(() => {
      u.forEach((x, k) => {
        const F = b[k];
        F && (F.innerText = ti(e.val, x).toString());
      });
    });
  }), r;
}
function ti(e, l) {
  const r = $n.val;
  if (r) return ys(r[0] + l * (r[1] - r[0]));
  const p = e.filter((y) => Number.isFinite(y));
  if (p.length === 0) return "0";
  const [u, m] = $o(p);
  return ys(u + l * (m - u));
}
function ys(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function fi({ mesh: e, settingsObj: l, drawingObj: r, objects3D: p, solids: u }) {
  ra.DEFAULT_UP = new S(0, 0, 1);
  const m = document.createElement("div"), y = new sa(), b = new aa(45, 1, 0.1, 2 * 1e6), x = new ia(-10, 10, 10, -10, -1e3, 2e6);
  let k = b;
  const F = new la({ antialias: true });
  F.localClippingEnabled = true;
  const M = new us(b, F.domElement);
  M.enableDamping = true, M.dampingFactor = 0.1, M.screenSpacePanning = true, M.zoomSpeed = 0.8, M.panSpeed = 1.2, M.rotateSpeed = 0.9, M.keyPanSpeed = 12, M.listenToKeyEvents(window), M.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, F.domElement.addEventListener("wheel", (z) => {
    if (!z.ctrlKey && Math.abs(z.deltaX) > Math.abs(z.deltaY) * 1.5) {
      z.preventDefault();
      const K = M.target, j = new S().subVectors(b.position, K), J = new S();
      J.crossVectors(b.up, j).normalize();
      const ue = j.length() * 1e-3 * M.panSpeed;
      K.addScaledVector(J, z.deltaX * ue), b.position.addScaledVector(J, z.deltaX * ue), M.update();
    }
  }, { passive: false });
  const W = new Po(new S(-1, 0, 0), 0), ye = new Po(new S(0, -1, 0), 0), be = new Po(new S(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const z = window.__hekatanClip, K = [];
    z.enableX && (W.normal.set(z.invertX ? 1 : -1, 0, 0), W.constant = z.invertX ? -z.posX : z.posX, K.push(W)), z.enableY && (ye.normal.set(0, z.invertY ? 1 : -1, 0), ye.constant = z.invertY ? -z.posY : z.posY, K.push(ye)), z.enableZ && (be.normal.set(0, 0, z.invertZ ? 1 : -1), be.constant = z.invertZ ? -z.posZ : z.posZ, K.push(be)), F.clippingPlanes = K, y.traverse((J) => {
      const ve = J;
      if (ve.material) {
        const ue = Array.isArray(ve.material) ? ve.material : [ve.material];
        for (const Se of ue) Se.clippingPlanes = K, Se.needsUpdate = true;
      }
    });
    const j = window.__hekatanPanes ?? [];
    for (const J of j) try {
      J && typeof J.refresh == "function" && J.refresh();
    } catch {
    }
    F.render(y, k);
  }
  se(), window.__hekatanClipApply = se;
  const R = ha(l), oe = ee.derive(() => Math.pow(10, R.displayScale.val / 10)), D = ni(e, R), ie = () => {
    const z = [];
    return R.gridXY.rawVal && z.push("xy"), R.gridXZ.rawVal && z.push("xz"), R.gridYZ.rawVal && z.push("yz"), z;
  }, le = () => {
    const z = R.gridStep.rawVal, K = Math.max(z, R.gridMajor.rawVal);
    return { planes: ie(), majorStep: K, minorStep: z };
  };
  let B = zo(R.gridSize.rawVal, le());
  B.visible = R.gridVisible.rawVal, window.__hekatanSnap2D = R.cursorSnap.rawVal;
  const L = () => {
    const z = Math.max(0, Math.min(1, R.gridOpacity.rawVal));
    B.traverse((K) => {
      const j = K.material;
      if (!j || !("opacity" in j)) return;
      const J = K.name ?? "";
      let ve = 0.55;
      J.includes("border") ? ve = 1 : J.includes("major") && (ve = 0.95), j.opacity = z * ve;
    });
  };
  L(), m.appendChild(fa(R, e, u)), m.setAttribute("id", "viewer"), m.appendChild(F.domElement), F.setPixelRatio(window.devicePixelRatio);
  const U = dn();
  F.setClearColor(U.background, 1);
  const N = R.gridSize.rawVal, E = N * 0.5 + N * 0.5 / Math.tan(45 * 0.5);
  b.position.set(0, 0, E), b.up.set(0, 1, 0), M.target.set(0, 0, 0), M.minDistance = 0.1, M.maxDistance = 1e4, m.__settings = R, M.zoomSpeed = 1, M._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, M.update();
  let Y = hs(R.gridSize.rawVal, R.flipAxes.rawVal);
  y.add(B, Y), ee.derive(() => {
    window.__hekatanGridPlaneXY = R.gridXY.val, window.__hekatanGridPlaneXZ = R.gridXZ.val, window.__hekatanGridPlaneYZ = R.gridYZ.val;
  });
  let I = true;
  ee.derive(() => {
    const z = R.gridVisible.val;
    if (I) {
      I = false;
      return;
    }
    B.visible = z, O();
  });
  let V = true;
  ee.derive(() => {
    if (R.gridOpacity.val, V) {
      V = false;
      return;
    }
    L(), O();
  }), ee.derive(() => {
    const z = R.cursorSnap.val;
    window.__hekatanSnap2D = z;
  });
  let te = true;
  ee.derive(() => {
    var _a2, _b, _c;
    const z = R.gridSize.val, K = R.flipAxes.val;
    if (R.gridXY.val, R.gridXZ.val, R.gridYZ.val, R.gridStep.val, R.gridMajor.val, te) {
      te = false;
      return;
    }
    y.remove(B), (_a2 = B.traverse) == null ? void 0 : _a2.call(B, (ue) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ue.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), B = zo(z, le()), B.visible = R.gridVisible.rawVal, y.add(B), L(), y.remove(Y), Y.traverse((ue) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = ue.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = ue.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), Y = hs(z, K), y.add(Y);
    const j = z * 0.5 + z * 0.5 / Math.tan(45 * 0.5);
    b.position.distanceTo(M.target);
    const J = Math.abs(b.position.x) < 0.1 && Math.abs(b.position.y) < 0.1 && b.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (J ? b.position.set(0, 0, j) : b.position.set(0.5 * z, -j, 0.5 * z), M.target.set(0, 0, 0)), M.minDistance = Math.max(0.05, z * 0.01), M.maxDistance = Math.max(50, z * 50), M.update(), O();
  }), new ResizeObserver((z) => {
    var _a2, _b;
    for (const K of z) {
      const j = (_a2 = K.target) == null ? void 0 : _a2.clientWidth, J = (_b = K.target) == null ? void 0 : _b.clientHeight;
      if (j === 0 || J === 0) continue;
      const ue = (he ? j / 2 : j) / J;
      b.aspect = ue, b.updateProjectionMatrix();
      const Se = x.top;
      if (x.left = -Se * ue, x.right = Se * ue, x.updateProjectionMatrix(), ae && ae.isPerspectiveCamera) ae.aspect = ue, ae.updateProjectionMatrix();
      else if (ae && ae.isOrthographicCamera) {
        const me = ae, De = me.top;
        me.left = -De * ue, me.right = De * ue, me.updateProjectionMatrix();
      }
      F.setSize(j, J), O();
    }
  }).observe(m), M.addEventListener("change", O), ee.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, R.displayScale.val, R.nodes.val, R.elements.val, (_g = R.edges) == null ? void 0 : _g.val, R.elemColumns.val, R.elemBeams.val, R.nodesIndexes.val, R.elementsIndexes.val, R.orientations.val, R.sections.val, R.secColumns.val, R.secBeams.val, R.secFloor.val, R.supports.val, R.loads.val, R.deformedShape.val, R.nodeResults.val, R.frameResults.val, R.shellResults.val, (_h = R.solidResults) == null ? void 0 : _h.val, (_i = R.extruded) == null ? void 0 : _i.val, setTimeout(O);
  });
  let he = false, ae = null, X = null, pe = false;
  function O() {
    const z = m.clientWidth || 1, K = m.clientHeight || 1;
    if (!he || !ae) {
      F.setScissorTest(false), F.setViewport(0, 0, z, K), F.render(y, k);
      return;
    }
    const j = z / 2;
    F.setScissorTest(true), F.setViewport(0, 0, j, K), F.setScissor(0, 0, j, K), F.render(y, k), F.setViewport(j, 0, j, K), F.setScissor(j, 0, j, K), F.render(y, ae), F.setScissorTest(false);
  }
  function xe(z) {
    k = z, M.object = z, M.update(), O();
  }
  function ge(z, K) {
    he = z, K && (ae = K);
    const j = m.clientWidth || 1, J = m.clientHeight || 1, ue = (z ? j / 2 : j) / J;
    b.isPerspectiveCamera && (b.aspect = ue, b.updateProjectionMatrix());
    const Se = x.top;
    if (x.left = -Se * ue, x.right = Se * ue, x.updateProjectionMatrix(), z && ae) {
      if (X ? (X.object = ae, X.update()) : (X = new us(ae, F.domElement), X.enableDamping = true, X.dampingFactor = 0.1, X.screenSpacePanning = true, X.zoomSpeed = 0.8, X.panSpeed = 1.2, X.rotateSpeed = 0.9, X.touches = { ONE: Wn.ROTATE, TWO: Wn.DOLLY_PAN }, X.target.copy(M.target), X.addEventListener("change", O), X.enabled = false), !pe) {
        const me = (De) => {
          if (!he || !X) return;
          const Te = F.domElement.getBoundingClientRect(), We = De.clientX - Te.left, Qe = Te.width / 2, Ze = We >= Qe;
          M.enabled = !Ze, X.enabled = Ze;
        };
        F.domElement.addEventListener("pointerdown", me, true), F.domElement.addEventListener("wheel", me, { capture: true, passive: true }), pe = true;
      }
    } else z || (M.enabled = true, X && (X.enabled = false));
    m.__splitMode = z, window.__hekatanSplitMode = z, window.__hekatanSplitCamera = z ? ae : null, O();
  }
  if (e) {
    y.add(ma(R, D, oe), ca(e, R, D), xa(R, D, oe), ga(e, R, D, oe), wa(e, R, D, oe), ya(e, R, D, oe), Ma(e, R, D, oe), ka(e, R, D, oe), za(e, R, D), Va(e, R, D, oe), Fa(e, R, D, oe)), window.__hekatanDiagrama2D || (ei(e, R), F.domElement.addEventListener("dblclick", () => {
      var _a2;
      const me = (_a2 = R.frameResults) == null ? void 0 : _a2.rawVal;
      !me || me === "none" || !(window.__hekatanModelSelection ?? []).some((Te) => Te.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const z = Ha({ scene: y, rendererElm: F.domElement, getActiveCamera: () => k, derivedNodes: D, derivedDisplayScale: oe, mesh: e, settings: R, render: O });
    y.add(z);
    const K = ri(e, R), j = La(e, R, D, K), J = ws(K);
    y.add(j), m.appendChild(J);
    const ve = Na(e, R, D);
    y.add(ve);
    const ue = ve.__colorMapValues, Se = ws(ue);
    Se.id = "frame-legend", m.appendChild(Se), ee.derive(() => {
      var _a2;
      const me = R.shellResults.val != "none", De = (((_a2 = R.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Te = me || De, We = R.frameResults.val.startsWith("contour:"), Qe = K.val.some((Ze) => Number.isFinite(Ze));
      J.hidden = !Te || !Qe, j.visible = Te, Se.hidden = !We;
    });
  }
  if (u) {
    const z = new bs(16777215, 0.5);
    y.add(z);
    const K = new to(16777215, 0.5);
    K.position.set(30, 25, -10), K.shadow.mapSize.width = 1024, K.shadow.mapSize.height = 1024, y.add(K);
    const j = 10;
    K.shadow.camera.left = -j, K.shadow.camera.right = j, K.shadow.camera.top = j, K.shadow.camera.bottom = -j, K.shadow.camera.far = 1e3;
    const J = new to(16777215, 0.5);
    J.color.setHSL(11, 43, 96), J.position.set(-10, 0, 30), y.add(J), ee.derive(() => {
      (u == null ? void 0 : u.val.length) && (y.remove(...u.oldVal), y.add(...u.rawVal), O());
    }), ee.derive(() => {
      u.rawVal.forEach((ve) => ve.visible = R.solids.val), O();
    });
  }
  if (p) {
    const z = [], K = (J) => {
      var _a2;
      return ((_a2 = J == null ? void 0 : J.userData) == null ? void 0 : _a2.isCota) ? R.showCotas.val : R.custom3D.val;
    }, j = () => {
      for (const J of z) J.visible = K(J);
      O();
    };
    ee.derive(() => {
      const J = p.val;
      z.length && (y.remove(...z), z.length = 0), J.length && (y.add(...J), z.push(...J), j()), O();
    }), ee.derive(() => {
      R.custom3D.val, j();
    }), ee.derive(() => {
      R.showCotas.val, j();
    });
  }
  r && Ta({ drawingObj: r, gridObj: B, scene: y, getActiveCamera: () => k, controls: M, gridSize: N, derivedDisplayScale: oe, rendererElm: F.domElement, viewerRender: O }), gs((z, K) => {
    var _a2;
    F.setClearColor(K.background, 1), y.remove(B), (_a2 = B.traverse) == null ? void 0 : _a2.call(B, (j) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = j.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = j.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), B = zo(R.gridSize.rawVal, { planes: ie() }), y.add(B), m.style.setProperty("--awatif-legend-color", K.legendMarker), O();
  });
  const Ee = { scene: y, perspCamera: b, orthoCamera: x, get camera() {
    return k;
  }, controls: M, renderer: F, rendererElm: F.domElement, render: O, setActiveCamera: xe, setSplitMode: ge, get splitMode() {
    return he;
  }, get splitCamera() {
    return ae;
  }, settings: R };
  m.__ctx = Ee;
  const Me = document.createElement("div");
  Me.id = "hk-nav-camara", Me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Ie = (z, K, j) => {
    const J = document.createElement("button");
    return J.textContent = z, J.title = K, J.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), J.onmouseenter = () => {
      J.style.background = "rgba(70,70,70,0.9)";
    }, J.onmouseleave = () => {
      J.style.background = "rgba(40,40,40,0.85)";
    }, J.onclick = (ve) => {
      ve.preventDefault(), j();
    }, J;
  }, Ke = (z, K) => {
    const j = M.target, J = new S().subVectors(k.position, j), ve = J.length(), ue = new S(), Se = new S();
    ue.crossVectors(k.up, J).normalize(), Se.copy(k.up).normalize();
    const me = ve * 0.05;
    j.addScaledVector(ue, -z * me), j.addScaledVector(Se, K * me), k.position.addScaledVector(ue, -z * me), k.position.addScaledVector(Se, K * me), M.update(), O();
  }, st = (z) => {
    const K = new S().subVectors(k.position, M.target);
    K.multiplyScalar(z), k.position.copy(M.target).add(K), M.update(), O();
  }, mt = () => {
    const z = document.createElement("div");
    return z.style.cssText = "width:32px;height:32px;", z;
  };
  return Me.append(mt()), Me.append(Ie("\u2191", "Pan arriba", () => Ke(0, 1))), Me.append(Ie("\u2295", "Zoom in", () => st(0.85))), Me.append(Ie("\u2190", "Pan izquierda", () => Ke(-1, 0))), Me.append(Ie("\u2302", "Reset vista", () => {
    M.reset(), O();
  })), Me.append(Ie("\u2192", "Pan derecha", () => Ke(1, 0))), Me.append(Ie("\u2296", "Zoom out", () => st(1.18))), Me.append(Ie("\u2193", "Pan abajo", () => Ke(0, -1))), Me.append(mt()), getComputedStyle(m).position === "static" && (m.style.position = "relative"), m.appendChild(Me), m;
}
function ni(e, l) {
  return ee.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const r = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], p = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!p || r.length === 0) return r;
    const u = l.deformScale.val, m = l.deformScale.val * l.deformScaleZ.val, y = Number.isFinite(u) ? u : 1, b = Number.isFinite(m) ? m : 1;
    return r.map((x, k) => {
      var _a3;
      const F = ((_a3 = p.get(k)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], M = Number.isFinite(F[0]) ? F[0] : 0, W = Number.isFinite(F[1]) ? F[1] : 0, ye = Number.isFinite(F[2]) ? F[2] : 0;
      return [x[0] + M * y, x[1] + W * y, x[2] + ye * b];
    });
  });
}
const $n = ee.state(null), To = ee.state(""), oi = ee.state("kN"), si = ee.state("mm"), ai = ee.state("kN/m\xB2"), ii = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, xs = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, li = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function ri(e, l) {
  const r = ee.state([]);
  let p;
  return ((u) => {
    u.bendingXX = "bendingXX", u.bendingYY = "bendingYY", u.bendingXY = "bendingXY", u.membraneXX = "membraneXX", u.membraneYY = "membraneYY", u.membraneXY = "membraneXY", u.tranverseShearX = "tranverseShearX", u.tranverseShearY = "tranverseShearY", u.membranePrincipalMax = "membranePrincipalMax", u.membranePrincipalMin = "membranePrincipalMin", u.bendingPrincipalMax = "bendingPrincipalMax", u.bendingPrincipalMin = "bendingPrincipalMin", u.transverseShearMax = "transverseShearMax", u.vonMises = "vonMises", u.pressure = "pressure", u.displacementX = "displacementX", u.displacementY = "displacementY", u.displacementZ = "displacementZ";
  })(p || (p = {})), ee.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const u = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), be = (K, j) => {
      K == null ? void 0 : K.forEach((J, ve) => {
        const ue = e.elements.val[ve];
        if (ue) for (let Se = 0; Se < ue.length; Se++) j.set(ue[Se], [J[Se] ?? J[0]]);
      });
    };
    be((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, u), be((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, m), be((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, y), be((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, b), be((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, x), be((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, k), be((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, F), be((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, M), be((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, W), be((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, ye);
    const se = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), le = (K, j, J, ve, ue) => {
      K.forEach((Se, me) => {
        var _a3, _b2;
        const De = Se[0] ?? 0, Te = ((_a3 = j.get(me)) == null ? void 0 : _a3[0]) ?? 0, We = ((_b2 = J.get(me)) == null ? void 0 : _b2[0]) ?? 0, Qe = (De + Te) / 2, Ze = Math.hypot((De - Te) / 2, We);
        ve.set(me, [Qe + Ze]), ue.set(me, [Qe - Ze]);
      });
    };
    le(b, x, k, se, R), le(u, m, y, oe, D), F.forEach((K, j) => {
      var _a3;
      ie.set(j, [Math.hypot(K[0] ?? 0, ((_a3 = M.get(j)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const B = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, L = (_w = l.solidResults) == null ? void 0 : _w.val, N = L && L !== "none" ? L : l.shellResults.val, E = B == null ? void 0 : B[N], Y = { bendingXX: [u, 0], bendingYY: [m, 0], bendingXY: [y, 0], membraneXX: [b, 0], membraneYY: [x, 0], membraneXY: [k, 0], tranverseShearX: [F, 0], tranverseShearY: [M, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [R, 0], bendingPrincipalMax: [oe, 0], bendingPrincipalMin: [D, 0], transverseShearMax: [ie, 0], vonMises: [W, 0], pressure: [ye, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, I = l.shellResults.val, V = oi.val, te = si.val, ce = I === "displacementX" || I === "displacementY" || I === "displacementZ", he = I === "bendingXX" || I === "bendingYY" || I === "bendingXY" || I === "bendingPrincipalMax" || I === "bendingPrincipalMin", ae = I === "membraneXX" || I === "membraneYY" || I === "membraneXY" || I === "membranePrincipalMax" || I === "membranePrincipalMin", X = I === "vonMises" || I === "pressure", pe = I === "tranverseShearX" || I === "tranverseShearY" || I === "transverseShearMax", O = (_D = l.solidResults) == null ? void 0 : _D.val, xe = O === "vonMises" || O === "sigmaXX" || O === "sigmaYY" || O === "sigmaZZ" || O === "tauXY" || O === "tauYZ" || O === "tauXZ", ge = O === "ux" || O === "uy" || O === "uz", Ee = ai.val, Me = xe ? li[Ee] : ge || ce ? xs[te] : he || ae || X || pe ? 1 / ii[V] : 1, Ie = xe ? Ee : ge || ce ? te : he ? `${V}\xB7m/m` : ae ? `${V}/m\xB2` : X ? `${V}/m\xB2` : pe ? `${V}/m` : "";
    To.val = Ie, $n.val = Array.isArray(E) && E.length === 2 ? [E[0] * Me, E[1] * Me] : null;
    const Ke = Ss.val, mt = O && O !== "none" ? [W, 0] : Y[I], z = [];
    if (e.nodes.val.forEach((K, j) => {
      const J = mt;
      if (!J || !J[0] || typeof J[0].has != "function") return;
      if (!J[0].has(j)) {
        z.push(Number.NaN);
        return;
      }
      const ve = J[0].get(j), ue = ve ? ve[J[1]] ?? 0 : 0;
      z.push(ue * Me);
    }), !$n.val && Ke !== "auto") {
      const K = e.nodes.val, j = /* @__PURE__ */ new Set(), J = (ue, Se) => {
        var _a3;
        const me = (_a3 = K[ue[0]]) == null ? void 0 : _a3[Se];
        return ue.every((De) => {
          var _a4;
          return Math.abs((((_a4 = K[De]) == null ? void 0 : _a4[Se]) ?? NaN) - me) < 1e-6;
        });
      };
      for (const ue of e.elements.val) {
        if (ue.length !== 4) continue;
        const Se = J(ue, 2), me = !Se && J(ue, 0), De = !Se && J(ue, 1);
        if (Ke === "losas" ? Se : Ke === "muros" ? me || De : Ke === "murosX" ? me : Ke === "murosY" ? De : false) for (const Qe of ue) j.add(Qe);
      }
      const ve = [];
      for (const ue of j) {
        const Se = z[ue];
        Number.isFinite(Se) && ve.push(Se);
      }
      ve.length && ($n.val = $o(ve));
    }
    r.val = z;
  }), r;
}
export {
  ua as a,
  ws as b,
  oi as c,
  si as d,
  ai as e,
  fi as g
};
