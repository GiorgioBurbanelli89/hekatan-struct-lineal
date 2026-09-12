import { N as Ot, a6 as On, q as ea, v as te, a7 as ta, D as Ft, M as it, B as Fe, F as St, a8 as na, x as xt, a9 as oa, aa as sa, h as us, ab as fs, r as un, ac as to, ad as no, a4 as Ps, _ as rt, b as yt, L as jt, w as Cs, c as aa, ae as ia, f as ut, V as F, $ as pn, af as Po, H as ao, d as zt, a as Co, Y as zs, Z as so, G as la, z as Tn, A as ra, ag as oo, t as ca, o as da, I as ln, a2 as An, E as hs, S as bn, m as zo, ah as En, g as ms, i as ws, j as ys, C as xs, K as pa, U as ua, W as fa, X as ha, T as Qn, P as Fo, O as ma } from "./theme-DQ--CgsI.js";
import { T as At, O as gs } from "./Text-ERv22veQ.js";
import { P as Fs } from "./tweakpane-BXg6ZhiP.js";
import { e as wa } from "./styles-0iLl92Fx.js";
class As {
  constructor(r, c = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(r, c);
  }
  set(r) {
    return r.isLut === true && this.copy(r), this;
  }
  setMin(r) {
    return this.minV = r, this;
  }
  setMax(r) {
    return this.maxV = r, this;
  }
  setColorMap(r, c = 32) {
    this.map = Ao[r] || Ao.rainbow, this.n = c;
    const p = 1 / this.n, f = new Ot(), y = new Ot();
    this.lut.length = 0, this.lut.push(new Ot(this.map[0][1]));
    for (let v = 1; v < c; v++) {
      const M = v * p;
      for (let g = 0; g < this.map.length - 1; g++) if (M > this.map[g][0] && M <= this.map[g + 1][0]) {
        const P = this.map[g][0], V = this.map[g + 1][0];
        f.setHex(this.map[g][1], On), y.setHex(this.map[g + 1][1], On);
        const _ = new Ot().lerpColors(f, y, (M - P) / (V - P));
        this.lut.push(_);
      }
    }
    return this.lut.push(new Ot(this.map[this.map.length - 1][1])), this;
  }
  copy(r) {
    return this.lut = r.lut, this.map = r.map, this.n = r.n, this.minV = r.minV, this.maxV = r.maxV, this;
  }
  getColor(r) {
    r = ea.clamp(r, this.minV, this.maxV), r = (r - this.minV) / (this.maxV - this.minV);
    const c = Math.round(r * this.n);
    return this.lut[c];
  }
  addColorMap(r, c) {
    return Ao[r] = c, this;
  }
  createCanvas() {
    const r = document.createElement("canvas");
    return r.width = 1, r.height = this.n, this.updateCanvas(r), r;
  }
  updateCanvas(r) {
    const c = r.getContext("2d", { alpha: false }), p = c.getImageData(0, 0, 1, this.n), f = p.data;
    let y = 0;
    const v = 1 / this.n, M = new Ot(), g = new Ot(), P = new Ot();
    for (let V = 1; V >= 0; V -= v) for (let _ = this.map.length - 1; _ >= 0; _--) if (V < this.map[_][0] && V >= this.map[_ - 1][0]) {
      const H = this.map[_ - 1][0], xe = this.map[_][0];
      M.setHex(this.map[_ - 1][1], On), g.setHex(this.map[_][1], On), P.lerpColors(M, g, (V - H) / (xe - H)), f[y * 4] = Math.round(P.r * 255), f[y * 4 + 1] = Math.round(P.g * 255), f[y * 4 + 2] = Math.round(P.b * 255), f[y * 4 + 3] = 255, y += 1;
    }
    return c.putImageData(p, 0, 0), r;
  }
}
const Ao = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Es = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], ya = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Es, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, io = te.state("safe"), Vs = te.state("auto");
function Ts(e) {
  e = Math.max(0, Math.min(1, e));
  const r = ya[io.val] ?? Es;
  for (let p = 0; p < r.length - 1; p++) {
    const [f, y, v, M] = r[p], [g, P, V, _] = r[p + 1];
    if (e <= g) {
      const H = (e - f) / (g - f);
      return [y + (P - y) * H, v + (V - v) * H, M + (_ - M) * H];
    }
  }
  const c = r[r.length - 1];
  return [c[1], c[2], c[3]];
}
function vs() {
  const r = new Uint8Array(1024);
  for (let p = 0; p < 256; p++) {
    const f = p / 255, [y, v, M] = Ts(f);
    r[p * 4 + 0] = y, r[p * 4 + 1] = v, r[p * 4 + 2] = M, r[p * 4 + 3] = 255;
  }
  const c = new oa(r, 256, 1, sa);
  return c.minFilter = us, c.magFilter = us, c.wrapS = fs, c.wrapT = fs, c.needsUpdate = true, c;
}
function xa() {
  const r = [];
  for (let c = 0; c <= 12; c++) {
    const p = 1 - c / 12, [f, y, v] = Ts(p);
    r.push(`rgb(${f | 0},${y | 0},${v | 0}) ${(c / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${r.join(",")})`;
}
function Ro(e) {
  if (!e.length) return [0, 1];
  const r = [...e].sort((y, v) => y - v), c = (y) => r[Math.min(r.length - 1, Math.max(0, Math.round(y * (r.length - 1))))];
  let p = r.length >= 20 ? c(0.01) : r[0], f = r.length >= 20 ? c(0.99) : r[r.length - 1];
  return p >= 0 && f > 0 && (p = 0), f <= 0 && p < 0 && (f = 0), [p, f];
}
function ga(e, r, c) {
  new As();
  const p = vs(), f = new ta({ uniforms: { cmap: { value: p }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: Ft, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  te.derive(() => {
    var _a2;
    io.val;
    const v = f.uniforms.cmap.value;
    f.uniforms.cmap.value = vs(), (_a2 = v == null ? void 0 : v.dispose) == null ? void 0 : _a2.call(v);
  });
  const y = new it(new Fe(), f);
  return y.renderOrder = -1, y.frustumCulled = false, y.userData.isShellArea = true, y.name = "__hekatan_shell_colormap", te.derive(() => {
    y.geometry.setAttribute("position", new St(e.val.flat(), 3));
    const v = [], M = [], g = [];
    r.val.forEach((B, ie) => {
      B.length === 3 ? (v.push(B[0], B[1], B[2]), M.push(ie), g.push(0)) : B.length === 4 && (v.push(B[0], B[1], B[2]), v.push(B[0], B[2], B[3]), M.push(ie, ie), g.push(0, 1));
    }), y.geometry.setIndex(new na(v, 1)), y.userData.faceToElem = M, y.userData.faceLocal = g;
    const P = c.val.filter((B) => Number.isFinite(B));
    let V, _;
    const H = Ln.val;
    if (H ? (_ = H[0], V = H[1]) : [_, V] = Ro(P), V === _) {
      const B = Math.max(Math.abs(V) * 1e-6, 1e-9);
      V += B, _ -= B;
    }
    const xe = H && H[0] > H[1], be = Math.min(_, V), se = Math.max(_, V), D = se - be, oe = new Float32Array(c.val.length);
    for (let B = 0; B < c.val.length; B++) {
      const ie = c.val[B];
      if (!Number.isFinite(ie)) {
        oe[B] = -1;
        continue;
      }
      const N = ((xe ? se + be - ie : ie) - be) / D;
      oe[B] = Math.max(0, Math.min(1, N));
    }
    y.geometry.setAttribute("scalar", new xt(oe, 1));
  }), y;
}
function va(e, r, c) {
  const p = document.createElement("div"), f = new Fs({ title: "Settings", expanded: true, container: p });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(f), p.setAttribute("id", "settings");
  const y = "hk_settingsPos";
  let v = null;
  try {
    const _ = localStorage.getItem(y);
    _ && (v = JSON.parse(_));
  } catch {
  }
  p.style.cssText = ["position:fixed", v ? `left:${v.left}px` : "left:8px", v ? `top:${v.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const M = () => {
    const _ = p.querySelector(".tp-rotv_b");
    if (!_) {
      setTimeout(M, 200);
      return;
    }
    _.style.cursor = "move", _.style.userSelect = "none";
    let H = false, xe = 0, be = 0, se = 0, D = 0;
    _.addEventListener("mousedown", (oe) => {
      H = true, xe = oe.clientX, be = oe.clientY;
      const B = p.getBoundingClientRect();
      se = B.left, D = B.top, p.style.left = `${se}px`, p.style.top = `${D}px`;
    }), window.addEventListener("mousemove", (oe) => {
      if (!H) return;
      const B = oe.clientX - xe, ie = oe.clientY - be, le = Math.max(0, Math.min(window.innerWidth - 40, se + B)), N = Math.max(0, Math.min(window.innerHeight - 40, D + ie));
      p.style.left = `${le}px`, p.style.top = `${N}px`;
    }), window.addEventListener("mouseup", () => {
      if (H) {
        H = false;
        try {
          localStorage.setItem(y, JSON.stringify({ left: parseFloat(p.style.left), top: parseFloat(p.style.top) }));
        } catch {
        }
      }
    });
  };
  if (M(), r == null ? void 0 : r.nodes) {
    f.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const _ = f.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    _.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), _.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), _.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), _.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const H = _.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    H.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), H.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), H.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const xe = f.addFolder({ title: "\u{1F441} Ver", expanded: false });
    xe.addBinding(e.nodes, "val", { label: "Nodes" }), xe.addBinding(e.elements, "val", { label: "Elements" }), xe.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), xe.addBinding(e.faces, "val", { label: "  Caras (fill)" }), xe.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), xe.addBinding(e.elemColumns, "val", { label: "    Columnas" }), xe.addBinding(e.elemBeams, "val", { label: "    Vigas" }), xe.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), xe.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), xe.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), xe.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), xe.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), xe.addBinding(e.orientations, "val", { label: "Orientations" }), xe.addBinding(e.sections, "val", { label: "Sections" }), xe.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), xe.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), xe.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), xe.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), xe.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((r == null ? void 0 : r.nodeInputs) || (r == null ? void 0 : r.elementInputs)) {
    const _ = f.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    _.addBinding(e.supports, "val", { label: "Supports" }), _.addBinding(e.loads, "val", { label: "Loads" }), _.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), _.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((r == null ? void 0 : r.deformOutputs) || (r == null ? void 0 : r.analyzeOutputs)) {
    const _ = f.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = _, _.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), _.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), _.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), _.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), _.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), _.addBinding(io, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), _.addBinding(Vs, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), _.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), _.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), _.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), _.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  c && f.addBinding(e.solids, "val", { label: "Solids" });
  const g = f.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), P = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), V = () => {
    const _ = window.__hekatanClipApply;
    typeof _ == "function" && _();
  };
  return g.addBinding(P, "enableX", { label: "Cortar X" }).on("change", V), g.addBinding(P, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", V), g.addBinding(P, "invertX", { label: "  invertir X" }).on("change", V), g.addBinding(P, "enableY", { label: "Cortar Y" }).on("change", V), g.addBinding(P, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", V), g.addBinding(P, "invertY", { label: "  invertir Y" }).on("change", V), g.addBinding(P, "enableZ", { label: "Cortar Z" }).on("change", V), g.addBinding(P, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", V), g.addBinding(P, "invertZ", { label: "  invertir Z" }).on("change", V), p;
}
function ba(e) {
  return { gridSize: te.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: te.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: te.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: te.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: te.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: te.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: te.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: te.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: te.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: te.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: te.state((e == null ? void 0 : e.nodes) ?? true), elements: te.state((e == null ? void 0 : e.elements) ?? true), edges: te.state((e == null ? void 0 : e.edges) ?? true), faces: te.state((e == null ? void 0 : e.faces) ?? true), elemColumns: te.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: te.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: te.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: te.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: te.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: te.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: te.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: te.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: te.state((e == null ? void 0 : e.orientations) ?? false), sections: te.state((e == null ? void 0 : e.sections) ?? true), extruded: te.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: te.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: te.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: te.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: te.state((e == null ? void 0 : e.secFloor) ?? -1), supports: te.state((e == null ? void 0 : e.supports) ?? true), loads: te.state((e == null ? void 0 : e.loads) ?? false), deformedShape: te.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: te.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: te.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: te.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: te.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: te.state((e == null ? void 0 : e.flipAxes) ?? false), solids: te.state((e == null ? void 0 : e.solids) ?? true), custom3D: te.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: te.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: te.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: te.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Ma(e, r, c) {
  const p = un(), f = new to(new Fe(), new no({ color: p.nodePoint }));
  return Ps((y, v) => {
    f.material.color.setHex(v.nodePoint);
  }), f.frustumCulled = false, te.derive(() => {
    e.nodes.val && f.geometry.setAttribute("position", new St(r.val.flat(), 3));
  }), te.derive(() => {
    if (c.val, r.val, !e.nodes.rawVal) return;
    const y = r.rawVal ?? [];
    let v = e.gridSize.val * 0.5;
    if (y.length >= 2) {
      const g = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
      for (const V of y) for (let _ = 0; _ < 3; _++) g[_] = Math.min(g[_], V[_]), P[_] = Math.max(P[_], V[_]);
      v = Math.max(P[0] - g[0], P[1] - g[1], P[2] - g[2], 0.1);
    }
    const M = 0.03 * v;
    f.material.size = M * c.rawVal;
  }), te.derive(() => {
    f.visible = e.nodes.val;
  }), f;
}
function Eo(e, r) {
  const c = un(), p = new rt();
  p.name = "hekatan-grid";
  const f = (r == null ? void 0 : r.planes) ?? ["xy"];
  let y = (r == null ? void 0 : r.majorStep) ?? 1, v = (r == null ? void 0 : r.minorStep) ?? 0.1;
  for (y <= 0 && (y = 1), v <= 0 && (v = 0.1); e / v > 500; ) v *= 2;
  for (; e / y > 100; ) y *= 2;
  const M = e / 2;
  y = Math.max(v, Math.round(y / v) * v);
  const P = new Ot(c.grid).multiplyScalar(1.3), V = new Ot(c.grid).multiplyScalar(0.8), _ = (se, D, oe, B) => {
    const ie = [], le = se === "xy" ? (T, q) => [T, q, 0] : se === "xz" ? (T, q) => [T, 0, q] : (T, q) => [0, T, q], N = Math.floor(M / D);
    for (let T = -N; T <= N; T++) {
      const q = T * D, R = le(q, -M), $ = le(q, M);
      ie.push(...R, ...$);
    }
    for (let T = -N; T <= N; T++) {
      const q = T * D, R = le(-M, q), $ = le(M, q);
      ie.push(...R, ...$);
    }
    const I = new Fe();
    I.setAttribute("position", new St(ie, 3));
    const G = new yt({ color: oe, transparent: true, opacity: B, depthWrite: false }), X = new jt(I, G);
    return X.name = `grid-${se}-${D === v ? "minor" : "major"}`, X;
  }, H = (se, D, oe) => {
    const B = se === "xy" ? (X, T) => [X, T, 0] : se === "xz" ? (X, T) => [X, 0, T] : (X, T) => [0, X, T], ie = [[-M, -M], [M, -M], [M, M], [-M, M]], le = [];
    for (const [X, T] of ie) le.push(...B(X, T));
    const N = new Fe();
    N.setAttribute("position", new St(le, 3));
    const I = new yt({ color: D, transparent: true, opacity: oe, depthWrite: false }), G = new Cs(N, I);
    return G.name = `grid-${se}-border`, G.renderOrder = 1, G;
  }, xe = (se, D, oe) => {
    const B = se === "xy" ? (I, G) => [I, G, 0] : se === "xz" ? (I, G) => [I, 0, G] : (I, G) => [0, I, G], ie = D === "u" ? [...B(-M, 0), ...B(M, 0)] : [...B(0, -M), ...B(0, M)], le = new Fe();
    le.setAttribute("position", new St(ie, 3));
    const N = new jt(le, new yt({ color: oe, transparent: true, opacity: 0.45, depthWrite: false }));
    return N.name = `grid-${se}-eje-${D}`, N.renderOrder = 1, N;
  }, be = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of f) {
    p.add(_(se, v, V, 0.12)), p.add(_(se, y, P, 0.4));
    const [D, oe] = be[se];
    p.add(xe(se, "u", D)), p.add(xe(se, "v", oe)), p.add(H(se, P, 0.55));
  }
  return p.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: y, minorStep: v, gridSize: e, planes: [...f] }, p;
}
function _a(e, r, c, p) {
  const f = new rt(), y = new aa(0.5, 0.5, 0.5), v = new ia(0.45, 0.7, 4);
  v.rotateX(Math.PI / 2), v.translate(0, 0, -0.35);
  const M = new ut({ color: 10166822 }), g = new ut({ color: 2792847 }), P = new ut({ color: 3835647 }), V = () => {
    const xe = c.rawVal ?? [];
    if (xe.length < 2) return r.gridSize.val * 0.5;
    let be = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const D of xe) for (let oe = 0; oe < 3; oe++) D[oe] < be[oe] && (be[oe] = D[oe]), D[oe] > se[oe] && (se[oe] = D[oe]);
    return Math.max(se[0] - be[0], se[1] - be[1], se[2] - be[2], 0.1);
  }, _ = () => 0.08 * V(), H = () => p.rawVal;
  return te.derive(() => {
    var _a2, _b;
    if (r.deformedShape.val, !r.supports.val) return;
    f.clear();
    const xe = _();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((be, se) => {
      const D = c.val[se];
      if (!D) return;
      const oe = be ?? [], B = (oe[0] ? 1 : 0) + (oe[1] ? 1 : 0) + (oe[2] ? 1 : 0), ie = (oe[3] ? 1 : 0) + (oe[4] ? 1 : 0) + (oe[5] ? 1 : 0);
      let le;
      B >= 3 && ie >= 3 ? le = new it(y, M) : B >= 3 && ie === 0 ? le = new it(v, g) : le = new it(v, P), le.position.set(D[0], D[1], D[2]);
      const N = xe * H();
      le.scale.set(N, N, N), f.add(le);
    });
  }), te.derive(() => {
    if (p.val, !r.supports.rawVal) return;
    const be = _() * H();
    f.children.forEach((se) => se.scale.set(be, be, be));
  }), te.derive(() => {
    f.visible = r.supports.val;
  }), f;
}
function ka(e, r, c, p) {
  const f = new rt();
  f.name = "loadsGroup";
  function y(M) {
    if (M.length < 2) return 0.12 * r.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
    for (const _ of M) for (let H = 0; H < 3; H++) g[H] = Math.min(g[H], _[H]), P[H] = Math.max(P[H], _[H]);
    return 0.08 * Math.max(P[0] - g[0], P[1] - g[1], P[2] - g[2], 0.1);
  }
  te.derive(() => {
    var _a2, _b, _c;
    if (r.deformedShape.val, !r.loads.val) return;
    f.children.forEach((se) => {
      var _a3;
      return (_a3 = se.dispose) == null ? void 0 : _a3.call(se);
    }), f.clear();
    const M = c.val, g = y(M), P = 240, V = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((se, D) => {
      M[D] && se.slice(0, 3).some((oe) => Math.abs(oe) > 1e-15) && V.push(D);
    });
    let _ = V;
    if (V.length > P) {
      const se = V.map(($) => M[$][0]), D = V.map(($) => M[$][1]), oe = Math.min(...se), B = Math.max(...se), ie = Math.min(...D), le = Math.max(...D), N = V.map(($) => M[$][2]), I = Math.max(1e-6, (Math.max(...N) - Math.min(...N)) / 40), G = ($) => Math.round($ / I), X = new Set(N.map(G)), T = Math.max(4, Math.floor(P / Math.max(1, X.size))), q = Math.max(2, Math.round(Math.sqrt(T))), R = /* @__PURE__ */ new Map();
      for (const $ of V) {
        const ne = B - oe < 1e-9 ? 0 : (M[$][0] - oe) / (B - oe), pe = le - ie < 1e-9 ? 0 : (M[$][1] - ie) / (le - ie), he = Math.min(q - 1, Math.floor(ne * q)), ae = Math.min(q - 1, Math.floor(pe * q)), Y = `${he},${ae},${G(M[$][2])}`, fe = Math.hypot(ne * q - (he + 0.5), pe * q - (ae + 0.5)), O = R.get(Y);
        (!O || fe < O.d) && R.set(Y, { i: $, d: fe });
      }
      _ = [...R.values()].map(($) => $.i);
    }
    let H = 0;
    for (const se of _) {
      const D = e.nodeInputs.val.loads.get(se);
      for (let oe = 0; oe < 3; oe++) H = Math.max(H, Math.abs(D[oe]));
    }
    const xe = _.length <= 60, be = (se) => {
      const D = Math.abs(se);
      return D >= 100 ? se.toFixed(0) : D >= 10 ? se.toFixed(1) : se.toFixed(2);
    };
    for (const se of _) {
      const D = e.nodeInputs.val.loads.get(se), oe = M[se];
      if (oe) for (let B = 0; B < 3; B++) {
        const ie = D[B];
        if (!(Math.abs(ie) > 1e-9 * (H || 1))) continue;
        const le = new F(B === 0 ? Math.sign(ie) : 0, B === 1 ? Math.sign(ie) : 0, B === 2 ? Math.sign(ie) : 0), N = 0.45 + 0.55 * (H ? Math.abs(ie) / H : 1), I = new pn(le, new F(...oe), 1, B === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (I.userData = { nudo: oe, dir: le, rel: N }, f.add(I), xe) {
          const G = new At(be(ie), B === 2 ? "#f5b642" : "#ff6b5e");
          G.userData = { nudo: oe, dir: le, rel: N, texto: true }, f.add(G);
        }
      }
    }
    v(g * p.rawVal);
  });
  function v(M) {
    f.children.forEach((g) => {
      const P = g.userData;
      if (!(P == null ? void 0 : P.dir)) return;
      const V = M * P.rel, _ = new F(...P.nudo).addScaledVector(P.dir, -V * (P.texto ? 1.12 : 1));
      g.position.copy(_), P.texto ? g.updateScale(M * 0.38) : g.scale.set(V, V, V);
    });
  }
  return te.derive(() => {
    p.val, r.loads.rawVal && v(y(c.rawVal) * p.rawVal);
  }), te.derive(() => {
    f.visible = r.loads.val;
  }), f;
}
function Sa(e, r, c) {
  const p = new rt();
  return te.derive(() => {
    if (!e.nodesIndexes.val) return;
    p.children.forEach((y) => y.dispose()), p.clear();
    const f = 0.05 * e.gridSize.val * 0.6;
    r.val.forEach((y, v) => {
      const M = new At(`${v}`);
      M.position.set(...y), M.updateScale(f * c.rawVal), p.add(M);
    });
  }), te.derive(() => {
    if (c.val, !e.nodesIndexes.rawVal) return;
    const f = 0.05 * e.gridSize.val * 0.6;
    p.children.forEach((y) => y.updateScale(f * c.rawVal));
  }), te.derive(() => {
    p.visible = e.nodesIndexes.val;
  }), p;
}
function Pa(e, r, c, p) {
  const f = new rt();
  return te.derive(() => {
    var _a2;
    if (r.deformedShape.val, !r.elementsIndexes.val) return;
    f.children.forEach((v) => v.dispose()), f.clear();
    const y = 0.05 * r.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((v, M) => {
      const g = new At(`${M}`, void 0, "#001219");
      g.position.set(...Ca(v.map((P) => c.rawVal[P]))), g.updateScale(y * p.rawVal), f.add(g);
    });
  }), te.derive(() => {
    if (p.val, !r.elementsIndexes.rawVal) return;
    const y = 0.05 * r.gridSize.val * 0.6;
    f.children.forEach((v) => v.updateScale(y * p.rawVal));
  }), te.derive(() => {
    f.visible = r.elementsIndexes.val;
  }), f;
}
function Ca(e) {
  const r = e.reduce((p, f) => [p[0] + f[0], p[1] + f[1], p[2] + f[2]], [0, 0, 0]), c = e.length;
  return [r[0] / c, r[1] / c, r[2] / c];
}
function bs(e, r) {
  const c = new rt(), p = Math.min(0.05 * e, 0.6), f = un(), y = new At("X", "red", "transparent"), v = new At(r ? "Z" : "Y", "green", "transparent"), M = new At(r ? "Y" : "Z", "blue", "transparent"), g = new pn(new F(1, 0, 0), new F(0, 0, 0), 1, f.axisArrow, 0.2, 0.2), P = new pn(new F(0, 1, 0), new F(0, 0, 0), 1, f.axisArrow, 0.2, 0.2), V = new pn(new F(0, 0, 1), new F(0, 0, 0), 1, f.axisArrow, 0.2, 0.2);
  return y.position.set(1.3 * p, 0, 0), v.position.set(0, 1.3 * p, 0), M.position.set(0, 0, 1.3 * p), y.updateScale(0.4 * p), v.updateScale(0.4 * p), M.updateScale(0.4 * p), g.scale.set(p, p, p), P.scale.set(p, p, p), V.scale.set(p, p, p), c.add(g, P, V, y, v, M), c;
}
function Do(e, r) {
  const c = new F(...e), f = new F(...r).clone().sub(c), y = f.length(), v = f.dot(new F(1, 0, 0)) / y, M = f.dot(new F(0, 1, 0)) / y, g = f.dot(new F(0, 0, 1)) / y, P = Math.sqrt(v ** 2 + M ** 2);
  let V = new Po().fromArray([[v, M, g], [-M / P, v / P, 0], [-v * g / P, -M * g / P, P]].flat());
  return g === 1 && (V = new Po().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), g === -1 && (V = new Po().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new ao().setFromMatrix3(V);
}
function $o(e, r) {
  return e == null ? void 0 : e.map((c, p) => (9 * c + r[p]) / 10);
}
function $n(e) {
  const r = e.reduce((p, f) => [p[0] + f[0], p[1] + f[1], p[2] + f[2]], [0, 0, 0]), c = e.length;
  return [r[0] / c, r[1] / c, r[2] / c];
}
function za(e, r, c) {
  const p = $n([r, c]), f = $n([e, c]), y = $n([e, r]), v = new F(...p).sub(new F(...f)).normalize(), M = new F(...c).sub(new F(...y)).normalize(), g = v.clone().cross(M).normalize(), P = g.clone().cross(v).normalize();
  return new ao().makeBasis(v, P, g);
}
function Fa(e, r, c, p) {
  const f = new rt(), y = new Fe(), v = new yt({ vertexColors: true }), M = [0, 0, 0], g = [1, 0, 0], P = [0, 1, 0], V = [0, 0, 1];
  y.setAttribute("position", new St([...M, ...g, ...M, ...P, ...M, ...V], 3));
  const _ = [255, 0, 0], H = [0, 255, 0], xe = [0, 0, 255];
  return y.setAttribute("color", new St([..._, ..._, ...H, ...H, ...xe, ...xe], 3)), te.derive(() => {
    var _a2;
    r.deformedShape.val, r.orientations.val && (f.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((be) => {
      const se = new jt(y, v), D = c.rawVal[be[0]], oe = c.rawVal[be[1]];
      if (be.length === 2 && (se.position.set(...$o(D, oe)), se.rotation.setFromRotationMatrix(Do(D, oe))), be.length === 3) {
        const le = c.rawVal[be[2]];
        se.position.set(...$n([D, oe, le])), se.rotation.setFromRotationMatrix(za(D, oe, le));
      }
      const ie = 0.05 * r.gridSize.rawVal * 0.75 * p.rawVal;
      se.scale.set(ie, ie, ie), f.add(se);
    }));
  }), te.derive(() => {
    if (p.val, !r.orientations.rawVal) return;
    const se = 0.05 * r.gridSize.val * 0.75 * p.rawVal;
    f.children.forEach((D) => D.scale.set(se, se, se));
  }), te.derive(() => {
    f.visible = r.orientations.val;
  }), f;
}
function Aa(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const r = (e.b * 100).toFixed(0), c = (e.h * 100).toFixed(0);
    return `${r}x${c}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function Ea(e, r, c, p) {
  const f = new rt(), y = new rt();
  f.add(y);
  function v(I, G) {
    const X = I / 2, T = G / 2, q = new Float32Array([0, -X, -T, 0, X, -T, 0, X, T, 0, -X, -T, 0, X, T, 0, -X, T]), R = new Fe();
    R.setAttribute("position", new xt(q, 3));
    const $ = new Float32Array([0, -X, -T, 0, X, -T, 0, X, T, 0, -X, T, 0, -X, -T]), ne = new Fe();
    return ne.setAttribute("position", new xt($, 3)), { fill: R, outline: ne };
  }
  function M(I, G = 24) {
    const X = I / 2, T = new Float32Array(G * 9);
    for (let ne = 0; ne < G; ne++) {
      const pe = ne / G * Math.PI * 2, he = (ne + 1) / G * Math.PI * 2;
      T[ne * 9] = 0, T[ne * 9 + 1] = 0, T[ne * 9 + 2] = 0, T[ne * 9 + 3] = 0, T[ne * 9 + 4] = X * Math.cos(pe), T[ne * 9 + 5] = X * Math.sin(pe), T[ne * 9 + 6] = 0, T[ne * 9 + 7] = X * Math.cos(he), T[ne * 9 + 8] = X * Math.sin(he);
    }
    const q = new Fe();
    q.setAttribute("position", new xt(T, 3));
    const R = new Float32Array((G + 1) * 3);
    for (let ne = 0; ne <= G; ne++) {
      const pe = ne / G * Math.PI * 2;
      R[ne * 3] = 0, R[ne * 3 + 1] = X * Math.cos(pe), R[ne * 3 + 2] = X * Math.sin(pe);
    }
    const $ = new Fe();
    return $.setAttribute("position", new xt(R, 3)), { fill: q, outline: $ };
  }
  function g(I, G, X, T) {
    const q = X ?? G * 0.08, R = T ?? I * 0.07, $ = I / 2, ne = G / 2, pe = ne - q, he = R / 2, ae = [];
    function Y(ve, Pe, me, De) {
      ae.push(0, ve, Pe, 0, me, Pe, 0, me, De, 0, ve, Pe, 0, me, De, 0, ve, De);
    }
    Y(-$, -ne, $, -pe), Y(-he, -pe, he, pe), Y(-$, pe, $, ne);
    const fe = new Fe();
    fe.setAttribute("position", new xt(new Float32Array(ae), 3));
    const O = new Float32Array([0, -$, -ne, 0, $, -ne, 0, $, -pe, 0, he, -pe, 0, he, pe, 0, $, pe, 0, $, ne, 0, -$, ne, 0, -$, pe, 0, -he, pe, 0, -he, -pe, 0, -$, -pe, 0, -$, -ne]), ge = new Fe();
    return ge.setAttribute("position", new xt(O, 3)), { fill: fe, outline: ge };
  }
  function P(I, G, X) {
    const T = I / 2, q = G / 2, R = T - X, $ = q - X, ne = [];
    function pe(fe, O, ge, ve) {
      ne.push(0, fe, O, 0, ge, O, 0, ge, ve, 0, fe, O, 0, ge, ve, 0, fe, ve);
    }
    pe(-T, -q, T, -$), pe(-T, $, T, q), pe(-T, -$, -R, $), pe(R, -$, T, $);
    const he = new Fe();
    he.setAttribute("position", new xt(new Float32Array(ne), 3));
    const ae = new Float32Array([0, -T, -q, 0, T, -q, 0, T, -q, 0, T, q, 0, T, q, 0, -T, q, 0, -T, q, 0, -T, -q, 0, -R, -$, 0, R, -$, 0, R, -$, 0, R, $, 0, R, $, 0, -R, $, 0, -R, $, 0, -R, -$]), Y = new Fe();
    return Y.setAttribute("position", new xt(ae, 3)), { fill: he, outline: Y };
  }
  function V(I, G, X) {
    const T = I / 2, q = G / 2, R = T - X, $ = q - X, ne = new Fe(), pe = new Float32Array([0, -R, -$, 0, R, -$, 0, R, $, 0, -R, -$, 0, R, $, 0, -R, $]);
    ne.setAttribute("position", new xt(pe, 3));
    const he = [];
    function ae(ge, ve, Pe, me) {
      he.push(0, ge, ve, 0, Pe, ve, 0, Pe, me, 0, ge, ve, 0, Pe, me, 0, ge, me);
    }
    ae(-T, -q, T, -$), ae(-T, $, T, q), ae(-T, -$, -R, $), ae(R, -$, T, $);
    const Y = new Fe();
    Y.setAttribute("position", new xt(new Float32Array(he), 3));
    const fe = new Float32Array([0, -T, -q, 0, T, -q, 0, T, -q, 0, T, q, 0, T, q, 0, -T, q, 0, -T, q, 0, -T, -q, 0, -R, -$, 0, R, -$, 0, R, -$, 0, R, $, 0, R, $, 0, -R, $, 0, -R, $, 0, -R, -$]), O = new Fe();
    return O.setAttribute("position", new xt(fe, 3)), { concFill: ne, steelFillGeom: Y, outline: O };
  }
  function _(I, G, X) {
    const T = [], q = [[0, -I / 2, -G / 2], [0, -I / 2 + X, -G / 2], [0, -I / 2 + X, G / 2 - X], [0, I / 2, G / 2 - X], [0, I / 2, G / 2], [0, -I / 2, G / 2]], R = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const he of R) T.push(...q[he]);
    const $ = new Fe();
    $.setAttribute("position", new xt(new Float32Array(T), 3));
    const ne = [];
    for (let he = 0; he < q.length; he++) {
      const ae = (he + 1) % q.length;
      ne.push(...q[he], ...q[ae]);
    }
    const pe = new Fe();
    return pe.setAttribute("position", new xt(new Float32Array(ne), 3)), { fill: $, outline: pe };
  }
  function H(I, G, X, T) {
    const q = T / 2, R = [], $ = [[0, -I - q, -G / 2], [0, -X - q, -G / 2], [0, -X - q, G / 2 - X], [0, -q, G / 2 - X], [0, -q, G / 2], [0, -I - q, G / 2]], ne = [[0, q, -G / 2], [0, q + X, -G / 2], [0, q + X, G / 2 - X], [0, I + q, G / 2 - X], [0, I + q, G / 2], [0, q, G / 2]], pe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of pe) R.push(...$[fe]);
    for (const fe of pe) R.push(...ne[fe]);
    const he = new Fe();
    he.setAttribute("position", new xt(new Float32Array(R), 3));
    const ae = [];
    for (const fe of [$, ne]) for (let O = 0; O < fe.length; O++) {
      const ge = (O + 1) % fe.length;
      ae.push(...fe[O], ...fe[ge]);
    }
    const Y = new Fe();
    return Y.setAttribute("position", new xt(new Float32Array(ae), 3)), { fill: he, outline: Y };
  }
  function xe(I, G, X, T) {
    const q = G / 2, R = I, $ = [[0, -R, -q], [0, -R, -q + X], [0, -T, -q + X], [0, -T, q - X], [0, -R, q - X], [0, -R, q], [0, 0, q], [0, 0, -q]], ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], pe = [];
    for (const fe of ne) pe.push(...$[fe]);
    const he = new Fe();
    he.setAttribute("position", new xt(new Float32Array(pe), 3));
    const ae = [];
    for (let fe = 0; fe < $.length; fe++) {
      const O = (fe + 1) % $.length;
      ae.push(...$[fe], ...$[O]);
    }
    const Y = new Fe();
    return Y.setAttribute("position", new xt(new Float32Array(ae), 3)), { fill: he, outline: Y };
  }
  function be(I, G, X, T, q) {
    const R = G / 2, $ = q / 2, ne = [], pe = [[0, -I, -R], [0, -I, -R + X], [0, -$ - T, -R + X], [0, -$ - T, R - X], [0, -I, R - X], [0, -I, R], [0, -$, R], [0, -$, -R]], he = pe.map((ge) => [ge[0], -ge[1], ge[2]]), ae = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const ge of ae) ne.push(...pe[ge]);
    for (const ge of ae) ne.push(...he[ge]);
    const Y = new Fe();
    Y.setAttribute("position", new xt(new Float32Array(ne), 3));
    const fe = [];
    for (const ge of [pe, he]) for (let ve = 0; ve < ge.length; ve++) {
      const Pe = (ve + 1) % ge.length;
      fe.push(...ge[ve], ...ge[Pe]);
    }
    const O = new Fe();
    return O.setAttribute("position", new xt(new Float32Array(fe), 3)), { fill: Y, outline: O };
  }
  function se(I, G, X, T) {
    const q = I / 2, R = G / 2, $ = T / 2, ne = [[0, -$, -R], [0, $, -R], [0, $, R - X], [0, q, R - X], [0, q, R], [0, -q, R], [0, -q, R - X], [0, -$, R - X]], pe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], he = [];
    for (const O of pe) he.push(...ne[O]);
    const ae = new Fe();
    ae.setAttribute("position", new xt(new Float32Array(he), 3));
    const Y = [];
    for (let O = 0; O < ne.length; O++) {
      const ge = (O + 1) % ne.length;
      Y.push(...ne[O], ...ne[ge]);
    }
    const fe = new Fe();
    return fe.setAttribute("position", new xt(new Float32Array(Y), 3)), { fill: ae, outline: fe };
  }
  function D(I, G, X = 24) {
    const T = I / 2, q = T - G, R = [];
    for (let he = 0; he < X; he++) {
      const ae = he / X * Math.PI * 2, Y = (he + 1) / X * Math.PI * 2, fe = Math.cos(ae), O = Math.sin(ae), ge = Math.cos(Y), ve = Math.sin(Y);
      R.push(0, T * fe, T * O, 0, T * ge, T * ve, 0, q * ge, q * ve), R.push(0, T * fe, T * O, 0, q * ge, q * ve, 0, q * fe, q * O);
    }
    const $ = new Fe();
    $.setAttribute("position", new xt(new Float32Array(R), 3));
    const ne = [];
    for (let he = 0; he < X; he++) {
      const ae = he / X * Math.PI * 2, Y = (he + 1) / X * Math.PI * 2;
      ne.push(0, T * Math.cos(ae), T * Math.sin(ae), 0, T * Math.cos(Y), T * Math.sin(Y)), ne.push(0, q * Math.cos(ae), q * Math.sin(ae), 0, q * Math.cos(Y), q * Math.sin(Y));
    }
    const pe = new Fe();
    return pe.setAttribute("position", new xt(new Float32Array(ne), 3)), { fill: $, outline: pe };
  }
  const oe = new ut({ color: 52479, transparent: true, opacity: 0.35, side: Ft, depthWrite: false }), B = new yt({ color: 52479 }), ie = new ut({ color: 16750848, transparent: true, opacity: 0.4, side: Ft, depthWrite: false }), le = new yt({ color: 16750848 });
  function N(I, G) {
    const X = Math.abs(G[0] - I[0]), T = Math.abs(G[1] - I[1]), q = Math.abs(G[2] - I[2]);
    return q > X && q > T || T > X && T > q;
  }
  return te.derive(() => {
    var _a2, _b;
    r.deformedShape.val, r.secColumns.val, r.secBeams.val, r.secFloor.val;
    const I = r.secColumns.rawVal, G = r.secBeams.rawVal;
    if (!I && !G) {
      f.children.forEach(($) => {
        $ instanceof At && $.dispose();
      }), f.clear();
      return;
    }
    f.children.forEach(($) => {
      $ instanceof At && $.dispose();
    }), f.clear();
    const X = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!X || !T) return;
    const q = T.sectionShapes, R = r.secFloor.rawVal;
    X.forEach(($, ne) => {
      if ($.length !== 2) return;
      const pe = c.rawVal[$[0]], he = c.rawVal[$[1]];
      if (!pe || !he) return;
      const ae = N(pe, he);
      if (ae && !I || !ae && !G) return;
      if (R >= 0) {
        const ve = Math.min(pe[1], he[1]);
        Math.max(pe[1], he[1]);
        const Pe = r.gridSize.rawVal || 3;
        if (Math.floor(ve / Pe + 0.01) !== R) return;
      }
      const Y = q == null ? void 0 : q.get(ne);
      if (!Y) return;
      const fe = [(pe[0] + he[0]) / 2, (pe[1] + he[1]) / 2, (pe[2] + he[2]) / 2], O = Do(pe, he);
      if (Y.type === "CFT") {
        const ve = V(Y.b, Y.h, Y.tw ?? Y.b * 0.05), Pe = new it(ve.concFill, oe);
        Pe.position.set(...fe), Pe.rotation.setFromRotationMatrix(O), f.add(Pe);
        const me = new it(ve.steelFillGeom, ie);
        me.position.set(...fe), me.rotation.setFromRotationMatrix(O), f.add(me);
        const De = new zt(ve.outline, le);
        De.position.set(...fe), De.rotation.setFromRotationMatrix(O), f.add(De);
      } else {
        let ve, Pe, me;
        switch (Y.type) {
          case "rect":
            ve = v(Y.b, Y.h), Pe = oe, me = B;
            break;
          case "circ":
            ve = M(Y.d), Pe = oe, me = B;
            break;
          case "I":
            ve = g(Y.b, Y.h, Y.tf, Y.tw), Pe = ie, me = le;
            break;
          case "HSS":
            ve = P(Y.b, Y.h, Y.tw ?? Y.b * 0.05), Pe = ie, me = le;
            break;
          case "CFT":
            ve = V(Y.b, Y.h, Y.tw ?? Y.b * 0.05), Pe = ie, me = le;
            break;
          case "L":
            ve = _(Y.b ?? Y.h, Y.h, Y.t ?? Y.tw ?? 3e-3), Pe = ie, me = le;
            break;
          case "2L":
            ve = H(Y.b ?? Y.h, Y.h, Y.t ?? Y.tw ?? 3e-3, Y.dis ?? 0.01), Pe = ie, me = le;
            break;
          case "C":
          case "coldC":
            ve = xe(Y.b, Y.h, Y.tf ?? Y.t ?? 3e-3, Y.tw ?? Y.t ?? 3e-3), Pe = ie, me = le;
            break;
          case "2C":
            ve = be(Y.b, Y.h, Y.tf ?? 5e-3, Y.tw ?? 5e-3, Y.dis ?? 0.01), Pe = ie, me = le;
            break;
          case "T":
            ve = se(Y.b, Y.h, Y.tf ?? 0.01, Y.tw ?? 6e-3), Pe = ie, me = le;
            break;
          case "pipe":
            ve = D(Y.d, Y.tw ?? Y.d * 0.05), Pe = ie, me = le;
            break;
          default:
            return;
        }
        const De = new it(ve.fill, Pe);
        De.position.set(...fe), De.rotation.setFromRotationMatrix(O), f.add(De);
        const Ze = new zt(ve.outline, me);
        Ze.position.set(...fe), Ze.rotation.setFromRotationMatrix(O), f.add(Ze);
      }
      const ge = Aa(Y);
      if (ge) {
        const Pe = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(Y.type) ? "#ff9900" : "#00ccff", me = new At(ge, Pe, "transparent");
        me.position.set(fe[0], fe[1], fe[2]);
        const De = 0.05 * r.gridSize.rawVal * 0.5;
        me.updateScale(De * ((p == null ? void 0 : p.rawVal) ?? 1)), y.add(me);
      }
    });
  }), p && te.derive(() => {
    if (p.val, !r.sections.rawVal) return;
    const I = 0.05 * r.gridSize.val * 0.5;
    y.children.forEach((G) => {
      G instanceof At && G.updateScale(I * p.rawVal);
    });
  }), te.derive(() => {
    f.visible = r.sections.val;
  }), te.derive(() => {
    y.visible = r.sectionLabels.val;
  }), f;
}
function Va(e) {
  if (!e) return null;
  const r = e.type, c = (V, _) => [V, _], p = (V, _) => [c(-V / 2, -_ / 2), c(V / 2, -_ / 2), c(V / 2, _ / 2), c(-V / 2, _ / 2)], f = (V, _ = 24) => {
    const H = V / 2, xe = [];
    for (let be = 0; be < _; be++) {
      const se = 2 * Math.PI * be / _;
      xe.push(c(H * Math.cos(se), H * Math.sin(se)));
    }
    return xe;
  }, y = e.b ?? 0, v = e.h ?? 0, M = e.d ?? 0, g = e.tw ?? e.t ?? 0, P = e.tf ?? e.t ?? 0;
  switch (r) {
    case "rect":
      return y && v ? { contorno: p(y, v) } : null;
    case "circ":
      return M ? { contorno: f(M) } : null;
    case "pipe":
      return M && g ? { contorno: f(M), huecos: [f(M - 2 * g).reverse()] } : null;
    case "HSS":
      return y && v && g ? { contorno: p(y, v), huecos: [p(y - 2 * g, v - 2 * (P || g)).reverse()] } : null;
    case "CFT":
      return y && v ? { contorno: p(y, v) } : null;
    case "I":
      return y && v && g && P ? { contorno: [c(-y / 2, -v / 2), c(y / 2, -v / 2), c(y / 2, -v / 2 + P), c(g / 2, -v / 2 + P), c(g / 2, v / 2 - P), c(y / 2, v / 2 - P), c(y / 2, v / 2), c(-y / 2, v / 2), c(-y / 2, v / 2 - P), c(-g / 2, v / 2 - P), c(-g / 2, -v / 2 + P), c(-y / 2, -v / 2 + P)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return y && v && g && P ? { contorno: [c(-y / 2, -v / 2), c(y / 2, -v / 2), c(y / 2, -v / 2 + P), c(-y / 2 + g, -v / 2 + P), c(-y / 2 + g, v / 2 - P), c(y / 2, v / 2 - P), c(y / 2, v / 2), c(-y / 2, v / 2)] } : null;
    case "T":
      return y && v && g && P ? { contorno: [c(-g / 2, -v / 2), c(g / 2, -v / 2), c(g / 2, v / 2 - P), c(y / 2, v / 2 - P), c(y / 2, v / 2), c(-y / 2, v / 2), c(-y / 2, v / 2 - P), c(-g / 2, v / 2 - P)] } : null;
    case "L":
    case "2L":
      return y && v && g ? { contorno: [c(-y / 2, -v / 2), c(y / 2, -v / 2), c(y / 2, -v / 2 + g), c(-y / 2 + g, -v / 2 + g), c(-y / 2 + g, v / 2), c(-y / 2, v / 2)] } : null;
    default:
      return y && v ? { contorno: p(y, v) } : M ? { contorno: f(M) } : null;
  }
}
function Ta(e, r, c) {
  if (!e || e <= 0 || !r || !c || r <= 0 || c <= 0) return null;
  const p = Math.sqrt(Math.sqrt(c / r)), f = Math.sqrt(e / p), y = e / f;
  return !isFinite(f) || !isFinite(y) || f <= 0 || y <= 0 ? null : { contorno: [[-f / 2, -y / 2], [f / 2, -y / 2], [f / 2, y / 2], [-f / 2, y / 2]] };
}
function $a(e) {
  const r = new Tn();
  e.contorno.forEach(([c, p], f) => f ? r.lineTo(c, p) : r.moveTo(c, p)), r.closePath();
  for (const c of e.huecos ?? []) {
    const p = new ra();
    c.forEach(([f, y], v) => v ? p.lineTo(f, y) : p.moveTo(f, y)), p.closePath(), r.holes.push(p);
  }
  return r;
}
function La(e, r, c) {
  const p = new rt();
  p.name = "extrusion";
  const f = new Co({ color: 8369151, transparent: true, opacity: 0.92, side: Ft }), y = new Co({ color: 12623968, transparent: true, opacity: 0.85, side: Ft }), v = new Co({ color: 11583173, transparent: true, opacity: 0.85, side: Ft }), M = new rt();
  M.add(new zs(16777215, 0.55));
  const g = new so(16777215, 0.75);
  g.position.set(30, 25, 40);
  const P = new so(16777215, 0.35);
  P.position.set(-25, -20, 15), M.add(g, P);
  let V = 0;
  return te.derive(() => {
    var _a2, _b, _c, _d, _e;
    const _ = ((_a2 = r.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++V, on: _ }, p.visible = _;
    for (const B of [...p.children]) B !== M && (p.remove(B), (_c = (_b = B.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (p.children.includes(M) || p.add(M), !_) return;
    const H = c.val ?? [], xe = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], be = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = be.sectionShapes ?? /* @__PURE__ */ new Map(), D = be.thicknesses ?? /* @__PURE__ */ new Map();
    let oe = "";
    try {
      xe.forEach((B, ie) => {
        var _a3, _b2, _c2;
        if (B.length === 2) {
          let le = Va(se.get(ie)), N = true;
          if (le || (le = Ta((_a3 = be.areas) == null ? void 0 : _a3.get(ie), (_b2 = be.momentsOfInertiaY) == null ? void 0 : _b2.get(ie), (_c2 = be.momentsOfInertiaZ) == null ? void 0 : _c2.get(ie)), N = false), !le) return;
          const I = H[B[0]], G = H[B[1]];
          if (!I || !G) return;
          const X = Math.hypot(G[0] - I[0], G[1] - I[1], G[2] - I[2]);
          if (X < 1e-9) return;
          const T = new la($a(le), { depth: X, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new ao().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const q = new it(T, N ? f : y);
          q.position.set(I[0], I[1], I[2]), q.rotation.setFromRotationMatrix(Do(I, G)), p.add(q);
          return;
        }
        if (B.length === 3 || B.length === 4) {
          const le = D.get(ie);
          if (!le || le <= 0) return;
          const N = B.map((O) => H[O]).filter(Boolean);
          if (N.length < 3) return;
          const I = [N[1][0] - N[0][0], N[1][1] - N[0][1], N[1][2] - N[0][2]], G = [N[2][0] - N[0][0], N[2][1] - N[0][1], N[2][2] - N[0][2]], X = I[1] * G[2] - I[2] * G[1], T = I[2] * G[0] - I[0] * G[2], q = I[0] * G[1] - I[1] * G[0], R = Math.hypot(X, T, q);
          if (R < 1e-12) return;
          const $ = [X / R, T / R, q / R], ne = [], pe = (O) => N.map((ge) => [ge[0] + $[0] * O, ge[1] + $[1] * O, ge[2] + $[2] * O]), he = pe(+le / 2), ae = pe(-le / 2), Y = (O, ge, ve) => ne.push(...O, ...ge, ...ve);
          for (const O of [he, ae]) Y(O[0], O[1], O[2]), O.length === 4 && Y(O[0], O[2], O[3]);
          for (let O = 0; O < N.length; O++) {
            const ge = (O + 1) % N.length;
            Y(he[O], ae[O], ae[ge]), Y(he[O], ae[ge], he[ge]);
          }
          const fe = new Fe();
          fe.setAttribute("position", new St(ne, 3)), fe.computeVertexNormals(), p.add(new it(fe, v));
        }
      });
    } catch (B) {
      oe = String((B == null ? void 0 : B.message) ?? B);
    }
    globalThis.__extrusionDebug = { corridas: V, on: _, fallo: oe, nElementos: xe.length, nFormas: se.size, nEspesores: D.size, mallas: p.children.length - 1 };
  }), p;
}
function $s(e, r, c = 0) {
  const p = [r[0] - e[0], r[1] - e[1], r[2] - e[2]], f = Math.hypot(p[0], p[1], p[2]) || 1, y = p[0] / f, v = p[1] / f, M = p[2] / f, g = Math.sqrt(y * y + v * v);
  let P, V, _;
  if (g < 1e-9) {
    const H = M > 0 ? 1 : -1;
    P = [0, 0, H], V = [1, 0, 0], _ = [0, H, 0];
  } else P = [y, v, M], V = [-y * M / g, -v * M / g, g], _ = [v / g, -y / g, 0];
  if (Math.abs(c) > 1e-12) {
    const H = c * Math.PI / 180, xe = Math.cos(H), be = Math.sin(H), se = V.map((oe, B) => xe * oe + be * _[B]), D = _.map((oe, B) => -be * V[B] + xe * oe);
    V = se, _ = D;
  }
  return { e1: P, e2: V, e3: _ };
}
function Lo(e, r) {
  if (!r) return [0, 0];
  const c = Number(r[0] ?? 0), p = Number(r[1] ?? 0);
  return e === "bendingsY" ? [c, -p] : [-c, p];
}
function Ls(e, r) {
  const c = (p) => p.map((f) => -f);
  switch (e) {
    case "bendingsZ":
      return c(r.e2);
    case "bendingsY":
      return c(r.e3);
    case "shearsZ":
      return r.e3;
    default:
      return r.e2;
  }
}
class jn extends rt {
  constructor(r, c, p, f, y, v, M) {
    super();
    const g = new Tn().moveTo(0, 0).lineTo(0, v[1]).lineTo(p, v[1]).lineTo(p, 0).lineTo(0, 0), P = g.getPoints(), V = new Fe().setFromPoints(P);
    this.lines = new zt(V, new yt({ color: un().resultOutline })), this.lines.position.set(...r), this.lines.rotation.setFromRotationMatrix(f), M && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const _ = new oo(g), H = new ut({ color: v[1] > 0 ? 24435 : 11411474, side: Ft });
    this.mesh = new it(_, H), this.mesh.position.set(...r), this.mesh.rotation.setFromRotationMatrix(f), M && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new At(`${y[1].toFixed(4)}`), this.normalizedResult = v, this.textPosition = $n([r, c]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(f), this.add(this.text);
  }
  updateScale(r) {
    this.lines.scale.set(1, r * 2, 1), this.mesh.scale.set(1, r * 2, 1), this.text.updateScale(r * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * r);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Vo extends rt {
  constructor(r, c, p, f, y, v, M) {
    super();
    const g = y[0] * p / (y[0] + y[1]), P = y[0] * y[1] > 0;
    if (this.text = new At(`${y[0].toFixed(4)}`), this.text2 = new At(`${(y[1] * -1).toFixed(4)}`), this.normalizedResult = v, this.textPosition = $o(r, c), this.text2Position = $o(c, r), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(f), this.text2.rotation.setFromRotationMatrix(f), this.add(this.text, this.text2), P) {
      const V = new Tn().moveTo(0, 0).lineTo(0, v[0]).lineTo(g, 0).lineTo(0, 0), _ = new Tn().moveTo(g, 0).lineTo(p, -v[1]).lineTo(p, 0).lineTo(g, 0), H = V.getPoints(), xe = _.getPoints(), be = new Fe().setFromPoints(H), se = new Fe().setFromPoints(xe), D = new yt({ color: un().resultOutline });
      this.lines = new zt(be, D), this.lines2 = new zt(se, D), this.lines.position.set(...r), this.lines2.position.set(...r), this.lines.rotation.setFromRotationMatrix(f), this.lines2.rotation.setFromRotationMatrix(f), M && this.lines.rotateX(Math.PI / 2), M && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const oe = new oo(V), B = new oo(_), ie = new ut({ color: v[0] > 0 ? 24435 : 11411474, side: Ft }), le = new ut({ color: -v[1] > 0 ? 24435 : 11411474, side: Ft });
      this.mesh = new it(oe, ie), this.mesh2 = new it(B, le), this.mesh.position.set(...r), this.mesh2.position.set(...r), this.mesh.rotation.setFromRotationMatrix(f), this.mesh2.rotation.setFromRotationMatrix(f), M && this.mesh.rotateX(Math.PI / 2), M && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const V = new Tn().moveTo(0, 0).lineTo(0, v[0]).lineTo(p, -v[1]).lineTo(p, 0).lineTo(0, 0), _ = V.getPoints(), H = new Fe().setFromPoints(_);
      this.lines = new zt(H, new yt({ color: un().resultOutline })), this.lines.position.set(...r), this.lines.rotation.setFromRotationMatrix(f), M && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const xe = new oo(V), be = new ut({ color: v[0] > 0 ? 24435 : 11411474, side: Ft });
      this.mesh = new it(xe, be), this.mesh.position.set(...r), this.mesh.rotation.setFromRotationMatrix(f), M && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(r) {
    var _a2, _b;
    this.lines.scale.set(1, r * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, r * 2, 1), this.mesh.scale.set(1, r * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, r * 2, 1), this.text.updateScale(r * 0.6), this.text2.updateScale(r * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * r), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * r);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Is = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(Is || {});
function Ia(e, r, c, p) {
  const f = () => {
    const M = c.rawVal;
    if (!(M == null ? void 0 : M.length)) return 0.05 * r.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
    for (const _ of M) for (let H = 0; H < 3; H++) _[H] < g[H] && (g[H] = _[H]), _[H] > P[H] && (P[H] = _[H]);
    const V = Math.hypot(P[0] - g[0], P[1] - g[1], P[2] - g[2]);
    return !isFinite(V) || V <= 0 ? 0.05 * r.gridSize.rawVal : 0.025 * V;
  }, y = new rt(), v = { normals: jn, shearsY: jn, shearsZ: jn, torsions: jn, bendingsY: Vo, bendingsZ: Vo };
  return te.derive(() => {
    var _a2, _b;
    if (r.deformedShape.val, c.val, r.frameResults.val == "none") return;
    y.children.forEach((g) => g.dispose()), y.clear();
    const M = Is[r.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[M]) == null ? void 0 : _b.forEach((g, P) => {
      var _a3, _b2, _c, _d, _e, _f;
      const V = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[P]) ?? [0, 1], _ = c.rawVal[V[0]], H = c.rawVal[V[1]];
      if (!_ || !H) return;
      const xe = new F(...H).distanceTo(new F(..._)), be = Ra((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[M]), se = ((_f = (_e = (_d = (_c = e.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, P)) ?? 0, D = $s(_, H, se), oe = Ls(M, D), B = new F(...D.e1), ie = new F(...oe), le = new ao().makeBasis(B, ie, B.clone().cross(ie)), [N, I] = Lo(M, g), G = v[M] === Vo ? [N, -I] : [N, I], X = G.map((q) => q / (be === 0 ? 1 : be)), T = new v[M](_, H, xe, le, G, X, false);
      T.updateScale(f() * p.rawVal), y.add(T);
    });
  }), te.derive(() => {
    if (p.val, r.frameResults.rawVal == "none") return;
    r.gridSize.val;
    const M = f();
    y.children.forEach((g) => g.updateScale(M * p.rawVal));
  }), te.derive(() => {
    y.visible = r.frameResults.val != "none";
  }), y;
}
function Ra(e) {
  let r = 0;
  return e == null ? void 0 : e.forEach((c) => {
    const p = Math.max(...(c ?? [0, 0]).map((f) => Math.abs(f)));
    p > r && (r = p);
  }), r;
}
class Da extends rt {
  constructor(r, c, p) {
    super();
    const f = c === Bo.reactions;
    p[0] && (this.xText1 = new At(`${f ? "Fx" : "Dx"}: ` + p[0].toFixed(4))), p[3] && (this.xText2 = new At(`${f ? "Mx" : "Rx"}: ` + p[3].toFixed(4))), p[1] && (this.yText1 = new At(`${f ? "Fy" : "Dy"}: ` + p[1].toFixed(4))), p[4] && (this.yText2 = new At(`${f ? "My" : "Ry"}: ` + p[4].toFixed(4))), p[2] && (this.zText1 = new At(`${f ? "Fz" : "Dz"}: ` + p[2].toFixed(4))), p[5] && (this.zText2 = new At(`${f ? "Mz" : "Rz"}: ` + p[5].toFixed(4))), (p[0] || p[3]) && (this.xArrow = new pn(new F(1, 0, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[1] || p[4]) && (this.yArrow = new pn(new F(0, 1, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[2] || p[5]) && (this.zArrow = new pn(new F(0, 0, 1), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...r), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(r) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(r, r, r), (_b = this.yArrow) == null ? void 0 : _b.scale.set(r, r, r), (_c = this.zArrow) == null ? void 0 : _c.scale.set(r, r, r), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * r, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * r, 0, 0.5 * r), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * r, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * r, 0.5 * r), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * r), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * r + 0.5 * r), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * r), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * r), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * r), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * r), (_n = this.zText1) == null ? void 0 : _n.updateScale(0.4 * r), (_o = this.zText2) == null ? void 0 : _o.updateScale(0.4 * r);
  }
  dispose() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c = this.zArrow) == null ? void 0 : _c.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var Bo = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(Bo || {});
function Ba(e, r, c, p) {
  const f = new rt();
  return te.derive(() => {
    var _a2, _b;
    if (r.deformedShape.val, r.nodeResults.val == "none") return;
    f.children.forEach((M) => M.dispose()), f.clear();
    const y = Bo[r.nodeResults.rawVal], v = 0.05 * r.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[y]) == null ? void 0 : _b.forEach((M, g) => {
      const P = new Da(c.rawVal[g], y, M ?? [0, 0, 0, 0, 0, 0]);
      P.updateScale(v * p.rawVal), f.add(P);
    });
  }), te.derive(() => {
    if (p.val, r.nodeResults.rawVal == "none") return;
    const y = 0.05 * r.gridSize.val;
    f.children.forEach((v) => v.updateScale(y * p.rawVal));
  }), te.derive(() => {
    f.visible = r.nodeResults.val != "none";
  }), f;
}
function Na({ drawingObj: e, gridObj: r, scene: c, getActiveCamera: p, controls: f, gridSize: y, derivedDisplayScale: v, rendererElm: M, viewerRender: g }) {
  var _a2;
  const P = new ca(), V = new da(), _ = (n) => {
    const o = M.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const h = s / 2;
      if (a >= h) return V.x = (a - h) / h * 2 - 1, V.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? p();
      V.x = a / h * 2 - 1;
    } else V.x = a / s * 2 - 1;
    return V.y = -(t / i) * 2 + 1, p();
  }, H = new it(new ln(1e4, 1e4), new ut({ side: Ft, transparent: true, opacity: 0, depthWrite: false }));
  H.visible = true, H.frustumCulled = false, c.add(H);
  const xe = (n, o, a) => {
    const t = new it(new ln(1e4, 1e4), new ut({ side: Ft, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, c.add(t), t;
  }, be = xe(Math.PI / 2, 0, 0), se = xe(0, Math.PI / 2, 0);
  let D = false;
  const oe = () => {
    if (D) return P.intersectObjects([H], false);
    if (be.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && at.visible) {
      const a = P.intersectObjects([at, ht, Be], false);
      if (a.length > 0) return a;
    }
    const o = [H];
    return be.visible && o.push(be), se.visible && o.push(se), nn.visible && mn.length > 0 && o.push(...mn), P.intersectObjects(o, false);
  }, B = new to(new Fe(), new no()), ie = new to(new Fe(), new no({ color: "gray", sizeAttenuation: false, size: 6 })), le = new to(new Fe(), new no({ color: "orange", sizeAttenuation: false, size: 5 }));
  c.add(le);
  const N = document.createElement("input");
  N.id = "hk-rubber-label", N.type = "text", N.spellcheck = false, N.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, N.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(N);
  let I = null, G = null, X = false;
  const T = new F(), q = (n, o, a, t, s, i) => {
    const d = t - n, h = s - o, m = i - a, x = Math.hypot(d, h, m);
    if (x < 0.01) {
      N.style.display = "none";
      return;
    }
    I = [n, o, a], G = [d / x, h / x, m / x], T.set((n + t) / 2, (o + s) / 2, (a + i) / 2), T.project(p());
    const k = M.getBoundingClientRect(), w = k.left + (T.x * 0.5 + 0.5) * k.width, l = k.top + (-T.y * 0.5 + 0.5) * k.height;
    if (N.style.left = w + "px", N.style.top = l + "px", N.style.display = "block", !X) {
      if (N.value = `${x.toFixed(2)} m`, document.activeElement !== N) {
        const S = document.activeElement;
        S && (S.tagName === "INPUT" || S.tagName === "TEXTAREA") && S !== N || N.focus({ preventScroll: true });
      }
      try {
        N.select();
      } catch {
      }
    }
  }, R = () => {
    N.style.display = "none", I = null, G = null, X = false, document.activeElement === N && N.blur();
  }, $ = (n) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      dn = n, de(`\u21C9 DESFASE distancia ${n} m \u2014 designe la l\xEDnea y luego el lado.`), N.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && qe.length === 1) {
      const k = qe[0];
      qe = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, k[0], k[1], k[2], n), de(`\u2713 C\xEDrculo r=${n} m en (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}).`);
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
      bt = n, de(`\u{1F4D0} Altura ${n}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), N.blur();
      return;
    }
    if (!I || !G || !e.polylines) return;
    let a = G[0], t = G[1], s = G[2];
    Ne === "x" ? (a = Math.sign(a) || 1, t = 0, s = 0) : Ne === "y" ? (a = 0, t = Math.sign(t) || 1, s = 0) : Ne === "z" && (a = 0, t = 0, s = Math.sign(s) || 1);
    const i = I[0] + a * n, d = I[1] + t * n, h = I[2] + s * n;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, d, h]];
    const m = e.polylines.rawVal, x = m.length ? m[m.length - 1] : [];
    e.polylines.val = [...m.slice(0, -1), [...x, e.points.rawVal.length - 1]], N.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    g();
  }, ne = (n) => {
    let o = n.trim().toLowerCase().replace(/m$/g, "").trim();
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
        const [i, d, h] = s;
        return { kind: "relSpherical", L: i, az: d, el: h };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((m) => parseFloat(m.trim()));
      if (s.some(isNaN)) return null;
      const [i, d, h = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: d, dz: h } : { kind: "absCart", x: i, y: d, z: h };
    }
    const t = parseFloat(o);
    return isNaN(t) || t <= 0 ? null : { kind: "length", L: t };
  }, pe = (n) => {
    if (!n) return null;
    if (n.kind === "absCart") return [n.x, n.y, n.z];
    if (n.kind === "relCart") return I ? [I[0] + n.dx, I[1] + n.dy, I[2] + n.dz] : null;
    if (n.kind === "absPolar") {
      const o = n.ang * Math.PI / 180;
      return [n.L * Math.cos(o), n.L * Math.sin(o), 0];
    }
    if (n.kind === "relPolar") {
      if (!I) return null;
      const o = n.ang * Math.PI / 180;
      return [I[0] + n.L * Math.cos(o), I[1] + n.L * Math.sin(o), I[2]];
    }
    if (n.kind === "relSpherical") {
      if (!I) return null;
      const o = n.az * Math.PI / 180, a = n.el * Math.PI / 180, t = n.L * Math.cos(a);
      return [I[0] + t * Math.cos(o), I[1] + t * Math.sin(o), I[2] + n.L * Math.sin(a)];
    }
    return null;
  }, he = (n) => {
    var _a3, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, n];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], I = n, N.blur();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    g();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (n) => {
    var _a3;
    const o = ne(n);
    if (!o) return false;
    if (o.kind === "length") return $(o.L), true;
    const a = pe(o);
    if (!a) return false;
    ls(new F(a[0], a[1], a[2]), null), I = a, N.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, N.addEventListener("keydown", (n) => {
    if (n.key === "Enter") {
      n.preventDefault();
      const a = ne(N.value);
      if (!a) return;
      if (X = false, a.kind === "length") $(a.L), de(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = pe(a);
        if (!t) return;
        he(t);
        const s = a.kind;
        de(`\u270F ${s} \u2192 (${t[0].toFixed(2)}, ${t[1].toFixed(2)}, ${t[2].toFixed(2)})`);
      }
      return;
    }
    if (n.key === "Escape") {
      n.preventDefault(), X = false, N.blur();
      return;
    }
    const o = n.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      n.preventDefault(), setTimeout(() => {
        if (!X && N.style.display === "block") try {
          N.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(n.key) || n.key === "Backspace" || n.key === "Delete") && (X = true);
  }), window.addEventListener("keydown", (n) => {
    if (!I || !G || document.activeElement === N) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(n.key) && (N.value = n.key, N.focus(), N.setSelectionRange(1, 1), n.preventDefault());
  });
  const ae = document.createElement("div");
  ae.id = "hk-coord-readout", ae.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ae.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ae);
  const Y = document.createElement("div");
  Y.id = "hk-coord-fixed", Y.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Y.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Y);
  const fe = new zt(new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new An({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  fe.frustumCulled = false, fe.visible = false, fe.name = "rubberBand", c.add(fe), window.__hekatanRubberBand = fe;
  const O = new zt(new Fe(), new yt({ color: 2282478, transparent: true, opacity: 0.9 }));
  O.frustumCulled = false, O.visible = false, c.add(O);
  let ge = [];
  const ve = new zt(new Fe(), new yt({ color: 16763904, transparent: true, opacity: 0.95 }));
  ve.frustumCulled = false, ve.visible = false, ve.renderOrder = 999, c.add(ve);
  let Pe = [];
  const me = document.createElement("div");
  me.id = "hk-measure-label", me.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:4px;padding:2px 7px;font:600 12px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(me);
  const De = (n) => {
    var _a3, _b;
    const o = _(n);
    if (!o) return null;
    P.setFromCamera(V, o);
    let a = null, t = null;
    const s = P.intersectObjects(c.children, true).filter((l) => l.object.isMesh && l.object !== gt && l.object !== et && l.object.visible !== false);
    if (s.length) {
      const l = s[0], S = l.point;
      a = [S.x, S.y, S.z];
      const Z = (_b = (_a3 = l.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      Z && l.face && (t = [l.face.a, l.face.b, l.face.c].map((b) => {
        const u = new F().fromBufferAttribute(Z, b);
        return l.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const l = oe();
      if (l.length) {
        const S = l[0].point;
        a = [S.x, S.y, S.z];
      }
    }
    if (!a) return null;
    const i = M.getBoundingClientRect(), d = (l) => {
      const S = new F(l[0], l[1], l[2]).project(o);
      return [i.left + (S.x * 0.5 + 0.5) * i.width, i.top + (-S.y * 0.5 + 0.5) * i.height];
    }, h = [n.clientX, n.clientY], m = 14;
    let x = a, k = m;
    const w = (l) => {
      const S = d(l), W = Math.hypot(S[0] - h[0], S[1] - h[1]);
      W < k && (k = W, x = l);
    };
    for (const l of t ?? []) w(l);
    for (const l of e.points.rawVal) w(l);
    return x;
  }, Ze = () => {
    if (Pe.length < 1) {
      me.style.display = "none";
      return;
    }
    const n = p(), o = Pe[0], a = Pe[1] ?? Pe[0], s = new F((o[0] + a[0]) / 2, (o[1] + a[1]) / 2, (o[2] + a[2]) / 2).clone().project(n), i = M.getBoundingClientRect();
    me.style.left = i.left + (s.x * 0.5 + 0.5) * i.width + "px", me.style.top = i.top + (-s.y * 0.5 + 0.5) * i.height - 14 + "px", me.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Ze, window.__hekatanClearMeasure = () => {
    Pe = [], ve.visible = false, me.style.display = "none";
    try {
      g();
    } catch {
    }
  };
  try {
    (_a2 = f.addEventListener) == null ? void 0 : _a2.call(f, "change", Ze);
  } catch {
  }
  const et = new it(new Fe(), new ut({ color: 16096779, transparent: true, opacity: 0.35, side: Ft, depthWrite: false }));
  et.frustumCulled = false, et.visible = false, et.renderOrder = 998, et.name = "hk-fill-preview", c.add(et), M.addEventListener("pointerleave", () => {
    et.visible && (et.visible = false, g());
  });
  const vt = (n) => {
    var _a3, _b, _c, _d;
    const o = e.points.rawVal, a = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = /* @__PURE__ */ new Map(), s = (b, u) => {
      b !== u && ((t.get(b) ?? t.set(b, /* @__PURE__ */ new Set()).get(b)).add(u), (t.get(u) ?? t.set(u, /* @__PURE__ */ new Set()).get(u)).add(b));
    };
    for (const b of a) for (let u = 0; u + 1 < b.length; u++) s(b[u], b[u + 1]);
    const i = (b, u) => {
      var _a4;
      return !!((_a4 = t.get(b)) == null ? void 0 : _a4.has(u));
    }, d = [], h = /* @__PURE__ */ new Set(), m = [...t.keys()];
    for (const b of m) for (const u of t.get(b)) if (!(u < b)) {
      for (const z of t.get(u)) if (z !== b) for (const E of t.get(z)) {
        if (E === b || E === u || !i(E, b) || i(b, z) || i(u, E)) continue;
        const K = [b, u, z, E].slice().sort((C, A) => C - A).join("-");
        h.has(K) || (h.add(K), d.push([b, u, z, E]));
      }
    }
    for (const b of m) for (const u of t.get(b)) if (!(u < b)) for (const z of t.get(u)) {
      if (z === b || !i(z, b)) continue;
      const E = [b, u, z].slice().sort((K, C) => K - C).join("-");
      h.has(E) || (h.add(E), d.push([b, u, z]));
    }
    const x = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", k = (b) => x === "xy" ? [b[0], b[1]] : x === "xz" ? [b[0], b[2]] : [b[1], b[2]], w = k(n), l = (b, u) => {
      let z = false;
      for (let E = 0, K = u.length - 1; E < u.length; K = E++) {
        const C = u[E][0], A = u[E][1], U = u[K][0], Q = u[K][1];
        A > b[1] != Q > b[1] && b[0] < (U - C) * (b[1] - A) / (Q - A) + C && (z = !z);
      }
      return z;
    }, S = (b) => {
      let u = 0;
      for (let z = 0, E = b.length - 1; z < b.length; E = z++) u += (b[E][0] + b[z][0]) * (b[E][1] - b[z][1]);
      return Math.abs(u) / 2;
    };
    let W = null, Z = 1 / 0;
    for (const b of d) {
      const u = b.map((E) => k(o[E]));
      if (!l(w, u)) continue;
      const z = S(u);
      z < Z && (Z = z, W = b);
    }
    return W;
  }, ue = new rt(), L = new it(new ln(1, 1), new ut({ color: 2282478, transparent: true, opacity: 0.08, side: Ft, depthWrite: false })), j = new jt(new hs(new ln(1, 1)), new yt({ color: 2282478, transparent: true, opacity: 0.85 })), J = new jt(new Fe(), new yt({ color: 2282478, transparent: true, opacity: 0.3 })), ee = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-n, i, 0, n, i, 0), a.push(i, -n, 0, i, n, 0);
    }
    J.geometry.dispose(), J.geometry = new Fe(), J.geometry.setAttribute("position", new St(a, 3));
  };
  ue.add(L, j, J), ue.visible = false, ue.frustumCulled = false, c.add(ue);
  const we = new rt();
  we.frustumCulled = false, we.visible = false, c.add(we);
  const _e = (n) => {
    const o = new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), a = new An({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new zt(o, a);
  }, ye = _e(16711680), Ae = _e(65280), Te = _e(35071);
  we.add(ye, Ae, Te);
  const He = [], Qe = (n) => n.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Ue = _e(16761856);
  Ue.material.dashSize = 0.28, Ue.material.gapSize = 0.16, Ue.material.opacity = 0.9, Ue.frustumCulled = false, Ue.visible = false, Ue.renderOrder = 98, c.add(Ue);
  const ft = (n) => {
    const o = new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0)]), a = new yt({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new Cs(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, We = ft(3462041), Me = ft(16724804), Ee = ft(6333946), ct = new rt();
  ct.frustumCulled = false, ct.visible = false, c.add(ct), ct.add(We, Me, Ee);
  const Ge = (n) => {
    const o = new ln(1, 1), a = new ut({ color: n, transparent: true, opacity: 0.06, side: Ft, depthWrite: false }), t = new it(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, at = Ge(3462041), ht = Ge(16724804), Be = Ge(6333946);
  ct.add(at, ht, Be);
  const Le = (n, o, a, t) => {
    n.scale.set(2 * t, 2 * t, 1), a === "xy" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, 0, 0)) : a === "xz" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(Math.PI / 2, 0, 0)) : (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, Math.PI / 2, 0));
  }, ze = document.createElement("div");
  ze.id = "hk-refplane-badge", ze.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(ze), window.__hekatanSetOrthoPlanes = (n) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = n, ct.visible = n, n) {
      const o = window.__hekatanOrthoAnchor, a = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], d = window.__hekatanOrthoExt ?? 8;
      Ce(We, i, "xy", d), Ce(Me, i, "xz", d), Ce(Ee, i, "yz", d), Le(at, i, "xy", d), Le(ht, i, "xz", d), Le(Be, i, "yz", d), at.material.opacity = 0.05, ht.material.opacity = 0.05, Be.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    g();
  }, window.__hekatanSetOrthoExt = (n) => {
    var _a3;
    if (window.__hekatanOrthoExt = n, !ct.visible) {
      g();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0];
    Ce(We, i, "xy", n), Ce(Me, i, "xz", n), Ce(Ee, i, "yz", n), Le(at, i, "xy", n), Le(ht, i, "xz", n), Le(Be, i, "yz", n), g();
  };
  const Je = (n) => {
    if (at.material.opacity = n === "xy" ? 0.09 : 0.025, ht.material.opacity = n === "xz" ? 0.09 : 0.025, Be.material.opacity = n === "yz" ? 0.09 : 0.025, n) {
      const s = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[n];
      ze.style.background = s.bg, ze.style.color = s.text, ze.textContent = `\u25A6 Plano ${n.toUpperCase()}`, ze.style.display = "block";
    } else ze.style.display = "none";
  }, Ce = (n, o, a, t) => {
    let s;
    a === "xy" ? s = [new F(o[0] - t, o[1] - t, o[2]), new F(o[0] + t, o[1] - t, o[2]), new F(o[0] + t, o[1] + t, o[2]), new F(o[0] - t, o[1] + t, o[2]), new F(o[0] - t, o[1] - t, o[2])] : a === "xz" ? s = [new F(o[0] - t, o[1], o[2] - t), new F(o[0] + t, o[1], o[2] - t), new F(o[0] + t, o[1], o[2] + t), new F(o[0] - t, o[1], o[2] + t), new F(o[0] - t, o[1], o[2] - t)] : s = [new F(o[0], o[1] - t, o[2] - t), new F(o[0], o[1] + t, o[2] - t), new F(o[0], o[1] + t, o[2] + t), new F(o[0], o[1] - t, o[2] + t), new F(o[0], o[1] - t, o[2] - t)], n.geometry.setFromPoints(s);
  };
  let Ne = null;
  window.__hekatanAxisLock = () => Ne;
  let dt = null, Pt = null;
  const Ve = document.createElement("div");
  Ve.id = "hk-axis-lock-badge", Ve.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ve);
  const tt = () => {
    if (!Ne) {
      Ve.style.display = "none";
      return;
    }
    const n = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ve.style.background = "rgba(15,23,42,0.92)", Ve.style.color = n[Ne], Ve.style.border = `1.5px solid ${n[Ne]}`, Ve.textContent = `\u{1F512} LOCK ${Ne.toUpperCase()}`, Ve.style.display = "block";
  };
  window.addEventListener("keydown", (n) => {
    var _a3, _b, _c, _d, _e2, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== N) return;
    const a = n.key.toLowerCase(), t = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (n.key === "Enter" && t === "polyarea" && ge.length >= 3) {
      const s = lo();
      de(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), n.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Ne = Ne === a ? null : a, tt(), n.preventDefault();
    else if (n.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), os(), n.preventDefault();
    } else n.key === "F3" ? (n.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : n.key === "F10" ? (n.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : n.key === "F8" && (n.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const n = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = n, n || Kn(), de(`\u{1F9F2} OSNAP ${n ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const n = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = n, n || (we.visible = false), de(`\u25C8 POLAR ${n ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a3;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const n = window.__hekatanOrthoMode;
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      let o = document.getElementById("hk-ortho-frame");
      o || (o = document.createElement("div"), o.id = "hk-ortho-frame", o.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(o)), o.style.display = n ? "block" : "none";
      let a = document.getElementById("hk-ortho-badge");
      a || (a = document.createElement("div"), a.id = "hk-ortho-badge", a.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", a.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(a)), a.style.display = n ? "block" : "none";
    }
  };
  const _t = new F(), kt = new F(), Kt = new F(), tn = (n) => {
    if (!Ne) return null;
    const o = n[0], a = n[1], t = n[2];
    return Ne === "x" ? (_t.set(o - 1e4, a, t), kt.set(o + 1e4, a, t)) : Ne === "y" ? (_t.set(o, a - 1e4, t), kt.set(o, a + 1e4, t)) : (_t.set(o, a, t - 1e4), kt.set(o, a, t + 1e4)), P.ray.distanceSqToSegment(_t, kt, null, Kt), Kt;
  };
  window.__hekatanProjectOnAxis = tn;
  const mt = new zt(new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new yt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  mt.renderOrder = 998, mt.frustumCulled = false, mt.visible = false, c.add(mt);
  let wt = -1, Nt = -1, Qt = -1;
  const Xe = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Xe;
  const Xt = new zt(new Fe().setFromPoints([new F(), new F()]), new yt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Xt.renderOrder = 997, Xt.frustumCulled = false, Xt.visible = false, c.add(Xt);
  const Vt = new it(new bn(0.02, 12, 12), new ut({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Vt.renderOrder = 998, Vt.visible = false, c.add(Vt);
  const fn = (n) => {
    const o = p();
    if (o.isOrthographicCamera) {
      const t = o, s = (t.top - t.bottom) / t.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(n);
    return Math.max(0.05, a / 10);
  }, In = () => {
    Vt.visible && Vt.scale.setScalar(fn(Vt.position));
  }, Gt = new rt();
  Gt.frustumCulled = false, c.add(Gt);
  const hn = 2282478;
  let Ht = null;
  const Rn = (n, o, a, t) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, d = t;
    for (let h = 0; h < s.length; h++) {
      const m = s[h];
      if (!m) continue;
      const x = Math.hypot(n - m[0], o - m[1], a - m[2]);
      x < d && (d = x, i = h);
    }
    return i;
  }, Yt = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; Gt.children.length; ) {
      const d = Gt.children.pop();
      (_b = (_a3 = d.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = d.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const d of Xe) {
      const [h, ...m] = d.split(":");
      if (h === "pt") {
        const x = n[+m[0]];
        if (!x) continue;
        const k = new it(new bn(0.025, 12, 12), new ut({ color: hn, transparent: true, opacity: 0.9, depthTest: false }));
        k.position.set(x[0], x[1], x[2]), k.renderOrder = 999, k.__isSelectionPt = true, Gt.add(k);
      } else if (h === "seg") {
        const x = o[+m[0]], k = n[x == null ? void 0 : x[+m[1]]], w = n[x == null ? void 0 : x[+m[1] + 1]];
        if (!k || !w) continue;
        const l = new Fe().setFromPoints([new F(k[0], k[1], k[2]), new F(w[0], w[1], w[2])]), S = new zt(l, new yt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        S.renderOrder = 999, Gt.add(S);
      } else if (h === "poly") {
        const k = o[+m[0]].map((S) => {
          const W = n[S];
          return W ? new F(W[0], W[1], W[2]) : null;
        }).filter(Boolean);
        if (k.length < 2) continue;
        const w = new Fe().setFromPoints(k), l = new zt(w, new yt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        l.renderOrder = 999, Gt.add(l);
      } else if (h === "aux") {
        const x = t[+m[0]];
        if (!x || x.length !== 6) continue;
        const k = new Fe().setFromPoints([new F(x[0], x[1], x[2]), new F(x[3], x[4], x[5])]), w = new zt(k, new yt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        w.renderOrder = 999, Gt.add(w);
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
    g();
  };
  window.__hekatanRefreshSelection = Yt, window.__hekatanClearSelection = () => {
    Xe.clear(), Yt();
  };
  const sn = (n, o, a, t, s, i, d, h, m) => {
    const x = d - t, k = h - s, w = m - i, l = x * x + k * k + w * w;
    if (l < 1e-12) return Math.hypot(n - t, o - s, a - i);
    let S = ((n - t) * x + (o - s) * k + (a - i) * w) / l;
    S = Math.max(0, Math.min(1, S));
    const W = t + S * x, Z = s + S * k, b = i + S * w;
    return Math.hypot(n - W, o - Z, a - b);
  }, Mn = (n, o, a, t) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let d = -1, h = -1, m = t;
    for (let x = 0; x < s.length; x++) {
      const k = s[x];
      for (let w = 0; w < k.length - 1; w++) {
        const l = i[k[w]], S = i[k[w + 1]];
        if (!l || !S) continue;
        const W = sn(n, o, a, l[0], l[1], l[2], S[0], S[1], S[2]);
        W < m && (m = W, d = x, h = w);
      }
    }
    return d >= 0 ? { polyIdx: d, segIdx: h, dist: m } : null;
  }, Dn = (n, o, a, t) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let d = -1, h = t;
    for (let m = 0; m < i.length; m++) {
      const x = i[m];
      if (!x || x.length !== 6) continue;
      const k = sn(n, o, a, x[0], x[1], x[2], x[3], x[4], x[5]);
      k < h && (h = k, d = m);
    }
    return d;
  }, Bn = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      mt.visible = false;
      return;
    }
    mt.geometry.setFromPoints([new F(t[0], t[1], t[2]), new F(t[3], t[4], t[5])]), mt.visible = true;
  }, Nn = (n, o = -1) => {
    var _a3, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[n], t = e.points.rawVal;
    if (!a || a.length < 2) {
      mt.visible = false;
      return;
    }
    const s = ((_b = (_a3 = e.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(n)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const d of a) {
      const h = t[d];
      h && i.push(new F(h[0], h[1], h[2]));
    }
    else {
      const d = t[a[o]], h = t[a[o + 1]];
      d && i.push(new F(d[0], d[1], d[2])), h && i.push(new F(h[0], h[1], h[2]));
    }
    mt.geometry.setFromPoints(i), mt.visible = true;
  }, Xn = (n) => {
    var _a3;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (n < 0 || n >= o.length) return;
    const a = o.filter((m, x) => x !== n), t = /* @__PURE__ */ new Set();
    for (const m of a) for (const x of m) t.add(x);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), d = [];
    for (let m = 0; m < s.length; m++) t.has(m) && (i.set(m, d.length), d.push(s[m]));
    const h = a.map((m) => m.map((x) => i.get(x)).filter((x) => x !== void 0));
    e.points.val = d, e.polylines.val = h, e.areas && (e.areas.val = e.areas.rawVal.filter((m) => m !== n).map((m) => m > n ? m - 1 : m)), mt.visible = false, wt = -1, Nt = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, No = (n, o) => {
    var _a3, _b, _c;
    if (!e.polylines) return;
    const a = e.polylines.rawVal;
    if (n < 0 || n >= a.length) return;
    if (((_b = (_a3 = e.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(n)) ?? false) {
      Xn(n);
      return;
    }
    const s = a[n];
    if (o < 0 || o >= s.length - 1) return;
    if (s.length === 2) {
      Xn(n);
      return;
    }
    let i;
    o === 0 ? i = [s.slice(1)] : o === s.length - 2 ? i = [s.slice(0, -1)] : i = [s.slice(0, o + 1), s.slice(o + 1)];
    const d = [...a.slice(0, n), ...i, ...a.slice(n + 1)], h = /* @__PURE__ */ new Set();
    for (const l of d) for (const S of l) h.add(S);
    const m = e.points.rawVal, x = /* @__PURE__ */ new Map(), k = [];
    for (let l = 0; l < m.length; l++) h.has(l) && (x.set(l, k.length), k.push(m[l]));
    const w = d.map((l) => l.map((S) => x.get(S)).filter((S) => S !== void 0));
    if (e.points.val = k, e.polylines.val = w, e.areas) {
      const l = i.length - 1;
      e.areas.val = e.areas.rawVal.map((S) => S > n ? S + l : S);
    }
    mt.visible = false, wt = -1, Nt = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  B.geometry.setAttribute("position", new St(e.points.rawVal.flat(), 3)), B.geometry.computeBoundingSphere(), B.frustumCulled = false, ie.frustumCulled = false, c.add(ie), H.position.set(0, 0, 0), H.rotateX(Math.PI / 2), H.geometry.rotateX(Math.PI / 2), H.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
    if (e.points.val = [...e.points.rawVal, [n, o, a]], e.polylines) {
      const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
      e.polylines.val = [...t.slice(0, -1), [...s, e.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a3;
    if (!e.polylines) return;
    const n = e.polylines.rawVal;
    ((_a3 = n[n.length - 1]) == null ? void 0 : _a3.length) !== 0 && (e.polylines.val = [...n, []]);
  };
  const Yn = [];
  window.__hekatanCirculos = Yn;
  let Xo = [], Yo = "";
  const Zo = () => {
    var _a3;
    const n = e.points.rawVal, o = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], a = `${n.length}|${o.length}|${o.reduce((s, i) => s + i.length, 0)}`;
    if (a === Yo) return Xo;
    Yo = a;
    const t = [];
    for (const s of o) {
      const i = s.length;
      if (i < 6 || s[0] !== s[i - 1]) continue;
      const d = s.slice(0, i - 1).map((k) => n[k]).filter(Boolean);
      if (d.length < 5) continue;
      const h = [0, 1, 2].map((k) => d.reduce((w, l) => w + l[k], 0) / d.length), m = d.map((k) => Math.hypot(k[0] - h[0], k[1] - h[1], k[2] - h[2])), x = m.reduce((k, w) => k + w, 0) / m.length;
      x < 1e-9 || m.some((k) => Math.abs(k - x) > 5e-3 * x) || t.push({ c: h, r: x });
    }
    return Xo = t;
  };
  window.__hekatanCentrosDeducidos = Zo, window.__hekatanDrawCircle = (n, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a3;
    const d = Math.max(4, Math.round(s)), h = e.points.rawVal.length, m = [];
    for (let x = 0; x < d; x++) {
      const k = 2 * Math.PI * x / d, w = t * Math.cos(k), l = t * Math.sin(k);
      let S;
      i === "xy" ? S = [n + w, o + l, a] : i === "xz" ? S = [n + w, o, a + l] : S = [n, o + w, a + l], m.push(S);
    }
    if (e.points.val = [...e.points.rawVal, ...m], Yn.push({ c: [n, o, a], r: t }), e.polylines) {
      const x = [...m.map((w, l) => h + l), h], k = e.polylines.rawVal;
      ((_a3 = k[k.length - 1]) == null ? void 0 : _a3.length) > 0 ? e.polylines.val = [...k, x, []] : e.polylines.val = [...k.slice(0, -1), x, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(t)), i = new F(...n), d = new F(...o), h = new F(...a), m = new F().subVectors(d, i), x = new F().subVectors(h, i), k = new F().crossVectors(m, x), w = 2 * k.lengthSq();
    let l;
    if (w < 1e-12) l = new F().addVectors(i, h).multiplyScalar(0.5);
    else {
      const Q = x.clone().multiplyScalar(m.lengthSq()).sub(m.clone().multiplyScalar(x.lengthSq())), re = new F().crossVectors(Q, k);
      l = i.clone().add(re.divideScalar(w));
    }
    const S = i.distanceTo(l), W = k.lengthSq() > 1e-12 ? k.clone().normalize() : new F(0, 1, 0), Z = new F().subVectors(i, l).normalize(), b = new F().crossVectors(W, Z).normalize(), u = (Q) => {
      const re = new F().subVectors(Q, l);
      return Math.atan2(re.dot(b), re.dot(Z));
    }, z = (Q) => {
      let re = Q;
      for (; re < 0; ) re += 2 * Math.PI;
      for (; re >= 2 * Math.PI; ) re -= 2 * Math.PI;
      return re;
    }, E = z(u(d)), K = z(u(h)), C = E <= K ? K : K - 2 * Math.PI, A = e.points.rawVal.length, U = [];
    for (let Q = 0; Q <= s; Q++) {
      const re = C * (Q / s), ke = Z.clone().multiplyScalar(Math.cos(re)).add(b.clone().multiplyScalar(Math.sin(re))), Ke = l.clone().add(ke.multiplyScalar(S));
      U.push([Ke.x, Ke.y, Ke.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...U], Yn.push({ c: [l.x, l.y, l.z], r: S }), e.polylines) {
      const Q = U.map((ke, Ke) => A + Ke), re = e.polylines.rawVal;
      e.polylines.val = [...re.slice(0, -1), Q, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(n[0], o[0]), d = Math.max(n[0], o[0]), h = Math.min(n[1], o[1]), m = Math.max(n[1], o[1]), x = (n[2] + o[2]) / 2, k = d - i, w = m - h, l = Math.min(a, k / 2 - 0.01, w / 2 - 0.01);
    if (l <= 0) return;
    const S = e.points.rawVal.length, W = [], Z = [], b = (u, z) => {
      W.push([u, z, x]), Z.push(S + W.length - 1);
    };
    for (let u = 0; u <= s; u++) b(i + l + (k - 2 * l) * u / s, h);
    for (let u = 1; u <= t; u++) {
      const z = -Math.PI / 2 + Math.PI / 2 * u / t;
      b(d - l + l * Math.cos(z), h + l + l * Math.sin(z));
    }
    for (let u = 1; u <= s; u++) b(d, h + l + (w - 2 * l) * u / s);
    for (let u = 1; u <= t; u++) {
      const z = 0 + Math.PI / 2 * u / t;
      b(d - l + l * Math.cos(z), m - l + l * Math.sin(z));
    }
    for (let u = 1; u <= s; u++) b(d - l - (k - 2 * l) * u / s, m);
    for (let u = 1; u <= t; u++) {
      const z = Math.PI / 2 + Math.PI / 2 * u / t;
      b(i + l + l * Math.cos(z), m - l + l * Math.sin(z));
    }
    for (let u = 1; u <= s; u++) b(i, m - l - (w - 2 * l) * u / s);
    for (let u = 1; u <= t; u++) {
      const z = Math.PI + Math.PI / 2 * u / t;
      b(i + l + l * Math.cos(z), h + l + l * Math.sin(z));
    }
    if (Z.push(S), e.points.val = [...e.points.rawVal, ...W], e.polylines) {
      const u = e.polylines.rawVal;
      e.polylines.val = [...u.slice(0, -1), Z, []];
    }
  }, window.__hekatanDrawRect = (n, o) => {
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], d = o[0], h = o[1], m = o[2];
    let x;
    if (Math.abs(i - m) < 1e-6 ? x = [[t, s, i], [d, s, i], [d, h, i], [t, h, i]] : Math.abs(s - h) < 1e-6 ? x = [[t, s, i], [d, s, i], [d, s, m], [t, s, m]] : x = [[t, s, i], [t, h, i], [t, h, m], [t, s, m]], e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const k = [a, a + 1, a + 2, a + 3, a], w = e.polylines.rawVal;
      e.polylines.val = [...w.slice(0, -1), k, []];
    }
  }, window.__hekatanDrawRectArea = (n, o) => {
    var _a3;
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], d = o[0], h = o[1], m = o[2];
    let x;
    if (D && e.gridTarget) {
      const k = e.gridTarget.rawVal, w = new En(...k.rotation), l = new F(1, 0, 0).applyEuler(w), S = new F(0, 1, 0).applyEuler(w), W = new F(...k.position), Z = new F(t, s, i), b = new F(d, h, m), u = Z.clone().sub(W).dot(l), z = Z.clone().sub(W).dot(S), E = b.clone().sub(W).dot(l), K = b.clone().sub(W).dot(S), C = (A, U) => W.clone().addScaledVector(l, A).addScaledVector(S, U).toArray();
      x = [C(u, z), C(E, z), C(E, K), C(u, K)];
    } else Math.abs(i - m) < 1e-6 ? x = [[t, s, i], [d, s, i], [d, h, i], [t, h, i]] : Math.abs(s - h) < 1e-6 ? x = [[t, s, i], [d, s, i], [d, s, m], [t, s, m]] : x = [[t, s, i], [t, h, i], [t, h, m], [t, s, m]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const k = e.polylines.rawVal, w = k.length - 1, l = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [...k.slice(0, -1), l, []], e.areas && (e.areas.val = [...e.areas.rawVal, w]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    g();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Map(), a = (w, l) => {
      w !== l && ((o.get(w) ?? o.set(w, /* @__PURE__ */ new Set()).get(w)).add(l), (o.get(l) ?? o.set(l, /* @__PURE__ */ new Set()).get(l)).add(w));
    };
    for (const w of n) for (let l = 0; l + 1 < w.length; l++) a(w[l], w[l + 1]);
    const t = (w, l) => {
      var _a4;
      return !!((_a4 = o.get(w)) == null ? void 0 : _a4.has(l));
    }, s = /* @__PURE__ */ new Set(), i = [], d = [...o.keys()];
    for (const w of d) for (const l of o.get(w)) if (!(l < w)) {
      for (const S of o.get(l)) if (S !== w) for (const W of o.get(S)) {
        if (W === w || W === l || !t(W, w) || t(w, S) || t(l, W)) continue;
        const Z = [w, l, S, W].slice().sort((b, u) => b - u).join("-");
        s.has(Z) || (s.add(Z), i.push([w, l, S, W]));
      }
    }
    for (const w of d) for (const l of o.get(w)) if (!(l < w)) for (const S of o.get(l)) {
      if (S === w || !t(S, w)) continue;
      const W = [w, l, S].slice().sort((Z, b) => Z - b).join("-");
      s.has(W) || (s.add(W), i.push([w, l, S]));
    }
    if (!i.length) return 0;
    const h = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []], m = new Set(h.map((w) => [...new Set(n[w] ?? [])].sort((l, S) => l - S).join("-"))), x = [...n];
    let k = 0;
    for (const w of i) {
      const l = w.slice().sort((S, W) => S - W).join("-");
      m.has(l) || (m.add(l), x.push([...w, w[0]]), h.push(x.length - 1), k++);
    }
    if (k) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), e.polylines.val = x, e.areas && (e.areas.val = h);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      g();
    }
    return k;
  }, window.__hekatanMeshPolyArea = (n, o) => {
    var _a3;
    const a = n.length;
    if (a < 3) return 0;
    let t = 0, s = 0, i = 0;
    for (let Se = 0; Se < a; Se++) {
      const Ie = n[Se], je = n[(Se + 1) % a];
      t += (Ie[1] - je[1]) * (Ie[2] + je[2]), s += (Ie[2] - je[2]) * (Ie[0] + je[0]), i += (Ie[0] - je[0]) * (Ie[1] + je[1]);
    }
    const d = Math.hypot(t, s, i) || 1;
    t /= d, s /= d, i /= d;
    let h = n[1][0] - n[0][0], m = n[1][1] - n[0][1], x = n[1][2] - n[0][2];
    const k = Math.hypot(h, m, x) || 1;
    h /= k, m /= k, x /= k;
    let w = s * x - i * m, l = i * h - t * x, S = t * m - s * h;
    const W = Math.hypot(w, l, S) || 1;
    w /= W, l /= W, S /= W;
    const Z = n[0], b = (Se) => [(Se[0] - Z[0]) * h + (Se[1] - Z[1]) * m + (Se[2] - Z[2]) * x, (Se[0] - Z[0]) * w + (Se[1] - Z[1]) * l + (Se[2] - Z[2]) * S], u = (Se, Ie) => [Z[0] + Se * h + Ie * w, Z[1] + Se * m + Ie * l, Z[2] + Se * x + Ie * S], z = n.map(b);
    let E = 1 / 0, K = -1 / 0, C = 1 / 0, A = -1 / 0;
    for (const [Se, Ie] of z) Se < E && (E = Se), Se > K && (K = Se), Ie < C && (C = Ie), Ie > A && (A = Ie);
    const U = K - E, Q = A - C;
    if (U < 1e-6 || Q < 1e-6) return 0;
    let re = o && o > 0 ? o : 0.5;
    for (; U / re * (Q / re) > 2500; ) re *= 2;
    re = Math.min(re, Math.min(U, Q));
    const ke = (Se, Ie) => {
      let je = false;
      for (let Lt = 0, Bt = z.length - 1; Lt < z.length; Bt = Lt++) {
        const [It, on] = z[Lt], [_o, Wn] = z[Bt];
        on > Ie != Wn > Ie && Se < (_o - It) * (Ie - on) / (Wn - on) + It && (je = !je);
      }
      return je;
    }, Ke = Math.max(1, Math.round(U / re)), Re = Math.max(1, Math.round(Q / re)), st = U / Ke, nt = Q / Re, lt = /* @__PURE__ */ new Map(), Oe = [], $e = e.points.rawVal.length, ot = (Se, Ie) => {
      const je = Se + "," + Ie, Lt = lt.get(je);
      if (Lt !== void 0) return Lt;
      const Bt = $e + Oe.length;
      return Oe.push(u(E + Se * st, C + Ie * nt)), lt.set(je, Bt), Bt;
    }, Ye = [];
    for (let Se = 0; Se < Ke; Se++) for (let Ie = 0; Ie < Re; Ie++) {
      if (!ke(E + (Se + 0.5) * st, C + (Ie + 0.5) * nt)) continue;
      const je = ot(Se, Ie), Lt = ot(Se + 1, Ie), Bt = ot(Se + 1, Ie + 1), It = ot(Se, Ie + 1);
      Ye.push([je, Lt, Bt, It]);
    }
    if (!Ye.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...Oe], e.polylines && e.areas) {
      let Se = e.polylines.rawVal.slice();
      Se.length && Se[Se.length - 1].length === 0 && (Se = Se.slice(0, -1));
      const Ie = [];
      for (const je of Ye) Ie.push(Se.length), Se.push([je[0], je[1], je[2], je[3], je[0]]);
      Se.push([]), e.polylines.val = Se, e.areas.val = [...e.areas.rawVal, ...Ie];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return g(), Ye.length;
  };
  const lo = () => {
    if (ge.length < 3) return ge = [], O.visible = false, g(), 0;
    const n = window.__hekatanMeshPolyArea(ge.slice());
    return ge = [], O.visible = false, g(), n;
  };
  window.__hekatanFinalizePolyArea = lo, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a3;
    const t = new F(n[0], n[1], n[2]), s = new F(o[0], o[1], o[2]), i = new F(a[0], a[1], a[2]), d = new F().subVectors(s, t).cross(new F().subVectors(i, t));
    if (d.lengthSq() < 1e-9) return false;
    d.normalize();
    const h = new zo().setFromUnitVectors(new F(0, 0, 1), d), m = new En().setFromQuaternion(h);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [m.x, m.y, m.z] }), D = true;
    const x = new F().addVectors(t, s).add(i).multiplyScalar(1 / 3), k = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, w = k / 2;
    L.geometry.dispose(), L.geometry = new ln(k, k), j.geometry.dispose(), j.geometry = new hs(new ln(k, k)), ee(w, 1), ue.position.copy(x), ue.quaternion.copy(h), ue.scale.set(1, 1, 1), ue.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return g(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), D = false, ue.visible = false, g();
  };
  const Wt = new rt();
  Wt.visible = false, c.add(Wt), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a3, _b;
    for (; Wt.children.length; ) {
      const k = Wt.children.pop();
      (_a3 = k.geometry) == null ? void 0 : _a3.dispose(), (_b = k.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, d = Math.min(...n) - t, h = Math.max(...n) + t, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", x = (k, w, l, S, W) => {
      const Z = document.createElement("canvas");
      Z.width = 64, Z.height = 32;
      const b = Z.getContext("2d");
      b.fillStyle = W, b.font = "bold 22px sans-serif", b.textAlign = "center", b.fillText(k, 32, 26);
      const u = new ms(Z), z = new ws({ map: u, transparent: true }), E = new ys(z);
      return E.position.set(w, l, S), E.scale.set(1.2, 0.6, 1), E;
    };
    n.forEach((k, w) => {
      const l = w < m.length ? m[w] : `X${w}`, S = new Fe().setFromPoints([new F(k, s, 0), new F(k, i, 0), new F(k, s, 0), new F(k, s, a)]), W = new An({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), Z = new jt(S, W);
      Z.computeLineDistances(), Wt.add(Z), Wt.add(x(l, k, s - 0.5, 0, "#60a5fa")), Wt.add(x(l, k, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((k, w) => {
      const l = `${w + 1}`, S = new Fe().setFromPoints([new F(d, k, 0), new F(h, k, 0), new F(d, k, 0), new F(d, k, a)]), W = new An({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), Z = new jt(S, W);
      Z.computeLineDistances(), Wt.add(Z), Wt.add(x(l, d - 0.5, k, 0, "#fb7185")), Wt.add(x(l, h + 0.5, k, 0, "#fb7185"));
    }), Wt.visible = true, g();
  }, window.__hekatanHideAxes = () => {
    Wt.visible = false, g();
  };
  const nn = new rt();
  nn.visible = false, c.add(nn);
  let mn = [];
  window.__hekatanShowRefPlanes = (n = [0, 3, 6, 9, 12], o = 20, a = 0, t = 0) => {
    var _a3, _b;
    for (; nn.children.length; ) {
      const i = nn.children.pop();
      (_a3 = i.geometry) == null ? void 0 : _a3.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    mn.forEach((i) => {
      c.remove(i), i.geometry.dispose(), i.material.dispose();
    }), mn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    n.forEach((i, d) => {
      const h = s[d % s.length], m = o / 2, x = [new F(a - m, t - m, i), new F(a + m, t - m, i), new F(a + m, t + m, i), new F(a - m, t + m, i), new F(a - m, t - m, i)], k = new Fe().setFromPoints(x), w = new yt({ color: h, transparent: true, opacity: 0.55 });
      nn.add(new zt(k, w));
      const l = document.createElement("canvas");
      l.width = 128, l.height = 32;
      const S = l.getContext("2d");
      S.fillStyle = `#${h.toString(16).padStart(6, "0")}`, S.font = "bold 18px sans-serif", S.fillText(`Z = ${i} m`, 4, 22);
      const W = new ms(l), Z = new ws({ map: W, transparent: true }), b = new ys(Z);
      b.position.set(a - m - 1.5, t - m - 1.5, i), b.scale.set(2.5, 0.6, 1), nn.add(b);
      const u = new ln(1e4, 1e4), z = new ut({ visible: false, side: Ft }), E = new it(u, z);
      E.position.set(0, 0, i), E.frustumCulled = false, E.userData = { refPlaneZ: i }, c.add(E), mn.push(E);
    }), nn.visible = true, g();
  }, window.__hekatanHideRefPlanes = () => {
    nn.visible = false, mn.forEach((n) => {
      n.visible = false;
    }), g();
  };
  const _n = new rt();
  _n.frustumCulled = false, c.add(_n);
  const Rs = () => {
    var _a3, _b, _c, _d;
    for (; _n.children.length; ) {
      const a = _n.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxLines, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const t = new Fe().setFromPoints([new F(a[0], a[1], a[2]), new F(a[3], a[4], a[5])]), s = new An({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new zt(t, s);
      i.computeLineDistances(), _n.add(i);
    }
  };
  te.derive(() => {
    const n = window.__hekatanDrawingAuxLines;
    (n == null ? void 0 : n.val) && (n.val, Rs(), g());
  });
  const wn = new rt();
  wn.frustumCulled = false, c.add(wn);
  const Uo = () => {
    var _a3, _b, _c, _d;
    for (; wn.children.length; ) {
      const a = wn.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxPoints, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (!a || a.length !== 3) continue;
      const t = new it(new bn(0.025, 12, 12), new ut({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      t.position.set(a[0], a[1], a[2]), t.renderOrder = 996, t.scale.setScalar(fn(t.position)), wn.add(t);
    }
  };
  te.derive(() => {
    const n = window.__hekatanDrawingAuxPoints;
    (n == null ? void 0 : n.val) !== void 0 && (n.val, Uo(), g());
  }), f.addEventListener("change", () => {
    wn.children.forEach((n) => {
      n.scale.setScalar(fn(n.position));
    });
  }), window.__hekatanRenderAuxPoints = Uo;
  const gt = new rt(), Ds = new it(new bn(0.01, 12, 12), new ut({ color: 16724804, transparent: true, opacity: 0.95 })), Bs = new it(new bn(0.015, 12, 12), new ut({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  gt.add(Ds, Bs);
  const yn = 0.08, ro = (n, o, a) => {
    const t = new Fe().setFromPoints([new F(...n), new F(...o)]);
    return new zt(t, new yt({ color: a, transparent: true, opacity: 0.7 }));
  };
  gt.add(ro([-yn, 0, 0], [yn, 0, 0], 16711680)), gt.add(ro([0, -yn, 0], [0, yn, 0], 65280)), gt.add(ro([0, 0, -yn], [0, 0, yn], 35071)), gt.visible = false, gt.frustumCulled = false, c.add(gt);
  let co = 2;
  const Zn = (n) => {
    const o = p(), a = (M == null ? void 0 : M.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(n) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, kn = () => {
    if (!gt.visible) return;
    const n = co * Zn(gt.position) / 0.015;
    gt.scale.setScalar(Math.max(1e-4, Math.min(1e5, n)));
  };
  let Sn = 10;
  const po = (n) => Math.max(1e-4, Sn * Zn(n));
  window.__hekatanAperturaPx = (n) => (typeof n == "number" && n > 0 && (Sn = n), Sn), window.__hekatanUpdateSnapScale = kn, window.__hekatanSnapMarker = gt, window.__hekatanMetrosPorPixel = Zn, window.__hekatanSnapPx = (n) => (typeof n == "number" && n > 0 && (co = n, kn(), g()), co);
  const qo = () => {
    Gt.children.length !== 0 && Gt.children.forEach((n) => {
      if (!n.__isSelectionPt) return;
      const o = n;
      o.scale.setScalar(fn(o.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = qo, f.addEventListener("change", () => {
    var _a3;
    kn(), Vt.visible && In(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), qo();
  }), window.__hekatanShowSnap = (n, o, a) => {
    gt.position.set(n, o, a), gt.visible = true, kn(), g();
  }, window.__hekatanHideSnap = () => {
    gt.visible = false, g();
  }, M.addEventListener("pointermove", (n) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    window.__hekatanCursorPx = { x: n.clientX, y: n.clientY };
    const o = _(n);
    if (!o) return;
    P.setFromCamera(V, o);
    const a = oe();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && et.visible && (et.visible = false), a.length) {
      const t = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const l = vt([t.x, t.y, t.z]);
        if (l) {
          const S = l.map((b) => e.points.rawVal[b]), W = [];
          for (let b = 1; b < S.length - 1; b++) W.push(S[0][0], S[0][1], S[0][2], S[b][0], S[b][1], S[b][2], S[b + 1][0], S[b + 1][1], S[b + 1][2]);
          const Z = et.geometry;
          Z.setAttribute("position", new St(W, 3)), Z.computeVertexNormals(), et.visible = true;
        } else et.visible = false;
      } else et.visible && (et.visible = false);
      const s = n.altKey, i = po(t), d = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, t.x, t.y, t.z, i, { x: n.clientX, y: n.clientY });
      if (d) Jo(d.type, d.x, d.y, d.z), gt.position.set(d.x, d.y, d.z), gt.visible = true, t.set(d.x, d.y, d.z), Oo(d.type, n.clientX, n.clientY);
      else {
        Zs(), Kn();
        const w = !s && window.__hekatanSnapEnabled !== false, l = window.__hekatanSnap2D ?? 0.5;
        w && l > 0 && (t.x = Math.round(t.x / l) * l, t.y = Math.round(t.y / l) * l, t.z = Math.round(t.z / l) * l), gt.position.copy(t), gt.visible = true;
      }
      kn();
      const h = ((_j = (_i = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h)) == null ? void 0 : _j.tool) ?? "select";
      if (h === "select" || !h) {
        const w = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = Rn(t.x, t.y, t.z, w), S = Mn(t.x, t.y, t.z, w), W = Dn(t.x, t.y, t.z, w);
        if (l >= 0) {
          const z = e.points.rawVal[l];
          Vt.position.set(z[0], z[1], z[2]), Vt.visible = true, In(), Xt.visible = false, Ht = { kind: "pt", a: l };
        } else if (S) {
          const z = e.points.rawVal, E = e.polylines.rawVal[S.polyIdx], K = z[E[S.segIdx]], C = z[E[S.segIdx + 1]];
          Xt.geometry.setFromPoints([new F(K[0], K[1], K[2]), new F(C[0], C[1], C[2])]), Xt.visible = true, Vt.visible = false, Ht = ((_l = (_k = e.areas) == null ? void 0 : _k.rawVal) == null ? void 0 : _l.includes(S.polyIdx)) ?? false ? { kind: "poly", a: S.polyIdx } : { kind: "seg", a: S.polyIdx, b: S.segIdx };
        } else if (W >= 0) {
          const E = (((_m = window.__hekatanDrawingAuxLines) == null ? void 0 : _m.rawVal) ?? [])[W];
          E && (Xt.geometry.setFromPoints([new F(E[0], E[1], E[2]), new F(E[3], E[4], E[5])]), Xt.visible = true, Vt.visible = false, Ht = { kind: "aux", a: W });
        } else Xt.visible = false, Vt.visible = false, Ht = null;
        ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
        let Z = t;
        if ((Ht == null ? void 0 : Ht.kind) === "pt") {
          const z = e.points.rawVal[Ht.a];
          z && (Z = new F(z[0], z[1], z[2]));
        }
        const b = `X=${Z.x.toFixed(2)} Y=${Z.y.toFixed(2)} Z=${Z.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [Z.x, Z.y, Z.z], Ht) {
          const z = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ae.textContent = `${b}  \xB7  \u{1F5B1} Click \u2192 ${z[Ht.kind]}`;
        } else ae.textContent = b;
        const u = document.getElementById("hk-coord-fixed");
        u && (u.textContent = b), Pt = { p: Z.clone(), x: n.clientX, y: n.clientY }, fe.visible = false, we.visible = false, Ue.visible = false, g();
        return;
      }
      if (h === "delete" || h === "trim" || h === "extend" || h === "offset") {
        const w = (window.__hekatanSnap2D ?? 0.5) * 1.5, l = Mn(t.x, t.y, t.z, w), S = Dn(t.x, t.y, t.z, w);
        let W = false;
        if (S >= 0) if (!l) W = true;
        else {
          const z = window.__hekatanDrawingAuxLines, K = ((z == null ? void 0 : z.rawVal) ?? (z == null ? void 0 : z.val) ?? z ?? [])[S];
          sn(t.x, t.y, t.z, K[0], K[1], K[2], K[3], K[4], K[5]) < l.dist && (W = true);
        }
        W ? (Qt = S, wt = -1, Nt = -1, Bn(S)) : l ? (wt = l.polyIdx, Nt = l.segIdx, Qt = -1, Nn(l.polyIdx, l.segIdx)) : (wt = -1, Nt = -1, Qt = -1, mt.visible = false), fe.visible = false, we.visible = false, Ue.visible = false, R(), ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
        const Z = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let b = "";
        W ? b = `\u{1F5D1} l\xEDnea aux #${Qt + 1}` : l ? b = ((_o = (_n2 = e.areas) == null ? void 0 : _n2.rawVal) == null ? void 0 : _o.includes(l.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${l.polyIdx + 1}` : `\u{1F5D1} seg ${l.segIdx + 1} / poly #${l.polyIdx + 1}` : b = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ae.textContent = `${Z}  \xB7  ${b}`;
        const u = document.getElementById("hk-coord-fixed");
        u && (u.textContent = Z), g();
        return;
      } else mt.visible = false, wt = -1, Qt = -1;
      ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
      const m = ((_p = e.polylines) == null ? void 0 : _p.rawVal) ?? [], x = m[m.length - 1] ?? [], k = e.points.rawVal ?? [];
      if (x.length > 0 && k[x[x.length - 1]]) {
        const w = x[x.length - 1], l = k[w];
        let S = Ne;
        if (dt = null, !S && window.__hekatanAxisSnap !== false) {
          const Re = M.getBoundingClientRect(), st = n.clientX, nt = n.clientY, lt = ((_q = settings.gridSize) == null ? void 0 : _q.rawVal) ?? 10, Oe = new F(l[0], l[1], l[2]), $e = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], ot = (Se) => {
            const Ie = Se.clone().project(o);
            return { x: (Ie.x * 0.5 + 0.5) * Re.width + Re.left, y: (-Ie.y * 0.5 + 0.5) * Re.height + Re.top };
          };
          let Ye = null;
          for (const [Se, Ie] of $e) {
            const je = ot(Oe.clone().addScaledVector(Ie, -lt)), Lt = ot(Oe.clone().addScaledVector(Ie, lt)), Bt = Lt.x - je.x, It = Lt.y - je.y, on = st - je.x, _o2 = nt - je.y, Wn = Bt * Bt + It * It || 1;
            let Jn = (on * Bt + _o2 * It) / Wn;
            Jn = Math.max(0, Math.min(1, Jn));
            const rs = Math.hypot(st - (je.x + Jn * Bt), nt - (je.y + Jn * It));
            if (Ye === null || rs < Ye.dpx) {
              const ko = P.ray, cs = Oe.clone().sub(ko.origin), So = Ie.dot(ko.direction), ds = Ie.dot(cs), Qs = ko.direction.dot(cs), ps = 1 - So * So, js = Math.abs(ps) < 1e-6 ? -ds : (So * Qs - ds) / ps;
              Ye = { axis: Se, dpx: rs, pt: Oe.clone().addScaledVector(Ie, js) };
            }
          }
          Ye && Ye.dpx <= 12 && (t.copy(Ye.pt), S = Ye.axis, dt = Ye.pt.clone());
        }
        const W = !!window.__hekatanOrthoMode;
        if (!S && W) {
          const Re = Math.abs(t.x - l[0]), st = Math.abs(t.y - l[1]), nt = Math.abs(t.z - l[2]), lt = (_r = a[0]) == null ? void 0 : _r.object;
          let Oe = null;
          lt === at ? Oe = "xy" : lt === ht ? Oe = "xz" : lt === Be && (Oe = "yz"), Oe === "xy" ? S = Re >= st ? "x" : "y" : Oe === "xz" ? S = Re >= nt ? "x" : "z" : Oe === "yz" ? S = st >= nt ? "y" : "z" : S = Re >= st && Re >= nt ? "x" : st >= nt ? "y" : "z";
        }
        const Z = window.__hekatanPolarTrack !== false;
        if (!S && Z) {
          const Re = t.x - l[0], st = t.y - l[1], nt = t.z - l[2], lt = Math.hypot(Re, st, nt);
          if (lt > 1e-3) {
            const $e = Math.tan(6 * Math.PI / 180) * lt, ot = Math.hypot(st, nt), Ye = Math.hypot(Re, nt), Se = Math.hypot(Re, st), Ie = [["x", ot], ["y", Ye], ["z", Se]];
            Ie.sort((je, Lt) => je[1] - Lt[1]), Ie[0][1] <= $e && (S = Ie[0][0]);
          }
        }
        if (S) {
          const Re = l[0], st = l[1], nt = l[2];
          S === "x" ? t.set(t.x, st, nt) : S === "y" ? t.set(Re, t.y, nt) : t.set(Re, st, t.z);
          const lt = !!Ne, $e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[S];
          Ve.style.background = "rgba(15,23,42,0.92)", Ve.style.color = $e, Ve.style.border = `1.5px solid ${$e}`;
          const ot = (_s2 = a[0]) == null ? void 0 : _s2.object;
          let Ye = null;
          ot === at ? Ye = "xy" : ot === ht ? Ye = "xz" : ot === Be && (Ye = "yz");
          const Se = Ye ? ` (plano ${Ye.toUpperCase()})` : "";
          Ve.textContent = lt ? `\u{1F512} LOCK ${S.toUpperCase()}${Se}` : `\u22A5 ORTO ${S.toUpperCase()}${Se}`, Ve.style.left = n.clientX + 20 + "px", Ve.style.top = n.clientY + 18 + "px", Ve.style.transform = "none", Ve.style.display = "block";
        } else Ne || (Ve.style.display = "none");
        let b = null;
        if (!s && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Re = e.points.rawVal, st = S ? [S] : ["z", "x", "y"], nt = { x: n.clientX, y: n.clientY };
          let lt = 1 / 0;
          for (const Oe of Re) if (!(Math.abs(Oe[0] - l[0]) < 1e-9 && Math.abs(Oe[1] - l[1]) < 1e-9 && Math.abs(Oe[2] - l[2]) < 1e-9)) for (const $e of st) {
            const ot = new F($e === "x" ? Oe[0] : t.x, $e === "y" ? Oe[1] : t.y, $e === "z" ? Oe[2] : t.z), Ye = wo(ot.x, ot.y, ot.z);
            if (!Ye) continue;
            const Se = Math.hypot(Ye.x - nt.x, Ye.y - nt.y);
            Se < Sn && Se < lt && (lt = Se, b = { q: Oe, eje: $e });
          }
        }
        b ? (b.eje === "x" ? t.x = b.q[0] : b.eje === "y" ? t.y = b.q[1] : t.z = b.q[2], Ue.geometry.setFromPoints([new F(b.q[0], b.q[1], b.q[2]), new F(t.x, t.y, t.z)]), (_t2 = Ue.computeLineDistances) == null ? void 0 : _t2.call(Ue), Ue.visible = true, gt.position.set(t.x, t.y, t.z), gt.visible = true, Oo("track", n.clientX, n.clientY)) : Ue.visible = false, Pt = { p: t.clone(), x: n.clientX, y: n.clientY };
        const u = Math.hypot(t.x - l[0], t.y - l[1], t.z - l[2]), z = Math.atan2(t.y - l[1], t.x - l[0]) * 180 / Math.PI, E = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        ae.textContent = `${E} | \u0394L=${u.toFixed(2)}m ${z.toFixed(0)}\xB0`;
        const K = document.getElementById("hk-coord-fixed");
        K && (K.textContent = E), fe.geometry.setFromPoints([new F(l[0], l[1], l[2]), new F(t.x, t.y, t.z)]), (_u = fe.computeLineDistances) == null ? void 0 : _u.call(fe), fe.visible = true, q(l[0], l[1], l[2], t.x, t.y, t.z);
        const C = window.__hekatanOrthoExt ?? 8, A = window.__hekatanShowOrthoPlanes !== false;
        ct.visible = A, A || Je(null), A && (Ce(We, l, "xy", C), Ce(Me, l, "xz", C), Ce(Ee, l, "yz", C), Le(at, l, "xy", C), Le(ht, l, "xz", C), Le(Be, l, "yz", C));
        const U = A ? P.intersectObjects([at, ht, Be], false) : [];
        let Q = null;
        if (U.length > 0) {
          const Re = U[0].object;
          Re === at ? Q = "xy" : Re === ht ? Q = "xz" : Re === Be && (Q = "yz");
        }
        Je(Q), Q && (ze.style.left = n.clientX + "px", ze.style.top = n.clientY + "px"), ye.geometry.setFromPoints([new F(l[0] - C, l[1], l[2]), new F(l[0] + C, l[1], l[2])]), (_v = ye.computeLineDistances) == null ? void 0 : _v.call(ye), Ae.geometry.setFromPoints([new F(l[0], l[1] - C, l[2]), new F(l[0], l[1] + C, l[2])]), (_w = Ae.computeLineDistances) == null ? void 0 : _w.call(Ae), Te.geometry.setFromPoints([new F(l[0], l[1], l[2] - C), new F(l[0], l[1], l[2] + C)]), (_x = Te.computeLineDistances) == null ? void 0 : _x.call(Te), we.visible = true;
        const re = ye.material, ke = Ae.material, Ke = Te.material;
        S === "x" ? (re.opacity = 0.95, ke.opacity = 0.1, Ke.opacity = 0.1) : S === "y" ? (re.opacity = 0.1, ke.opacity = 0.95, Ke.opacity = 0.1) : S === "z" ? (re.opacity = 0.1, ke.opacity = 0.1, Ke.opacity = 0.95) : (re.opacity = 0.5, ke.opacity = 0.5, Ke.opacity = 0.5);
      } else {
        const w = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        ae.textContent = w;
        const l = document.getElementById("hk-coord-fixed");
        if (l && (l.textContent = w), fe.visible = false, we.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(h)) {
          if (I = null, G = null, N.style.left = n.clientX + 20 + "px", N.style.top = n.clientY - 28 + "px", N.style.display = "block", !X) {
            N.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const W = document.activeElement;
            !(W && (W.tagName === "INPUT" || W.tagName === "TEXTAREA") && W !== N) && document.activeElement !== N && N.focus({ preventScroll: true });
            try {
              N.select();
            } catch {
            }
          }
        } else R();
      }
      g();
    } else Kn(), ae.style.display = "none", gt.visible = false, fe.visible = false, we.visible = false, R(), g();
  }), te.derive(() => {
    var _a3;
    if (!e.gridTarget) return;
    const n = new zo().setFromEuler(new En(...e.gridTarget.val.rotation)), o = new zo().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2);
    Xa(r, { position: new F(...e.gridTarget.val.position), quaternion: n.clone().multiply(o) }, g);
    {
      const t = e.gridTarget.val.position[2], s = Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of He) c.remove(i), Qe(i);
      if (He.length = 0, s) {
        const i = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [], d = /* @__PURE__ */ new Set([0]);
        for (const m of i) d.add(+m[2].toFixed(3));
        for (const m of window.__hekatanLevels ?? []) isFinite(m == null ? void 0 : m.z) && d.add(+m.z.toFixed(3));
        const h = [...d].sort((m, x) => m - x).slice(0, 24);
        for (const m of h) {
          if (Math.abs(m - t) < 1e-6) continue;
          const x = r.clone(true);
          x.name = `hekatan-grid-nivel-${m}`, x.traverse((k) => {
            k.material && (k.material = k.material.clone(), k.material.transparent = true, k.material.opacity = (k.material.opacity ?? 1) * (Math.abs(m) < 1e-6 ? 0.5 : 0.22));
          }), x.position.set(0, 0, m), x.quaternion.copy(o), c.add(x), He.push(x);
        }
      }
    }
    H.position.set(...e.gridTarget.val.position), H.quaternion.setFromEuler(new En(...e.gridTarget.val.rotation)), H.updateMatrixWorld();
    const a = new F(0, 0, 1).applyEuler(new En(...e.gridTarget.val.rotation));
    D = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  }), te.derive(() => {
    B.geometry.setAttribute("position", new St(e.points.val.flat(), 3)), B.geometry.computeBoundingSphere();
  }), te.derive(() => {
    const n = 0.05 * y * 0.5 * v.val;
    P.params.Points.threshold = 0.4 * n;
  }), te.derive(() => {
    var _a3;
    const n = e.points.val ?? [], a = (((_a3 = e.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], t = [];
    for (const i of a) {
      const [d, h, m] = n[i];
      t.push(d, h, m);
    }
    const s = new Fe();
    s.setAttribute("position", new St(t, 3)), le.geometry.dispose(), le.geometry = s;
  });
  let uo = false, cn = 0;
  M.addEventListener("pointerdown", () => {
    uo = true;
  }), M.addEventListener("pointerup", () => {
    uo = false;
  }), M.addEventListener("pointermove", () => {
    uo && cn++;
  });
  const $t = document.createElement("div");
  $t.id = "hk-window-select", $t.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild($t);
  let Jt = null, Pn = false, Zt = null;
  const fo = (n, o, a, t, s) => {
    s ? ($t.style.borderColor = "#34d399", $t.style.borderStyle = "dashed", $t.style.background = "rgba(52, 211, 153, 0.10)") : ($t.style.borderColor = "#22d3ee", $t.style.borderStyle = "solid", $t.style.background = "rgba(34, 211, 238, 0.10)"), $t.style.left = Math.min(n, a) + "px", $t.style.top = Math.min(o, t) + "px", $t.style.width = Math.abs(a - n) + "px", $t.style.height = Math.abs(t - o) + "px", $t.style.display = "block";
  }, Ko = (n, o, a, t, s) => {
    var _a3, _b, _c, _d;
    const i = Math.min(n, a), d = Math.max(n, a), h = Math.min(o, t), m = Math.max(o, t), x = a < n, k = M.getBoundingClientRect(), w = p();
    w.updateMatrixWorld();
    const l = (A) => {
      const U = new F(A[0], A[1], A[2]);
      return U.project(w), { x: k.left + (U.x * 0.5 + 0.5) * k.width, y: k.top + (-U.y * 0.5 + 0.5) * k.height };
    }, S = (A) => A.x >= i && A.x <= d && A.y >= h && A.y <= m, W = (A, U) => !(A.x < i && U.x < i || A.x > d && U.x > d || A.y < h && U.y < h || A.y > m && U.y > m);
    s || Xe.clear();
    let Z = 0;
    const b = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let A = 0; A < b.length; A++) {
      const U = b[A];
      U && S(l(U)) && (Xe.add(`pt:${A}`), Z++);
    }
    const u = (A, U) => x ? S(A) || S(U) || W(A, U) : S(A) && S(U), z = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], E = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let A = 0; A < z.length; A++) {
      const U = z[A];
      if (E.includes(A)) {
        let re;
        if (!x) re = U.every((ke) => {
          const Ke = b[ke];
          return !!Ke && S(l(Ke));
        });
        else {
          re = false;
          for (let ke = 0; ke < U.length - 1; ke++) {
            const Ke = b[U[ke]], Re = b[U[ke + 1]];
            if (!(!Ke || !Re) && u(l(Ke), l(Re))) {
              re = true;
              break;
            }
          }
        }
        re && (Xe.add(`poly:${A}`), Z++);
      } else for (let re = 0; re < U.length - 1; re++) {
        const ke = b[U[re]], Ke = b[U[re + 1]];
        !ke || !Ke || u(l(ke), l(Ke)) && (Xe.add(`seg:${A}:${re}`), Z++);
      }
    }
    const C = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let A = 0; A < C.length; A++) {
      const U = C[A];
      if (!U || U.length !== 6) continue;
      const Q = l([U[0], U[1], U[2]]), re = l([U[3], U[4], U[5]]);
      u(Q, re) && (Xe.add(`aux:${A}`), Z++);
    }
    Yt(), de(Z === 0 && !x ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${x ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${Z} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Xe.size})`), $t.style.display = "none";
  }, Un = () => {
    Zt && (Zt = null, $t.style.display = "none", de("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Un, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && Zt && Un();
  });
  const Go = () => {
    var _a3, _b, _c, _d;
    if (Xe.size === 0) return false;
    const n = [...Xe], o = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], d = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
    for (const W of n) {
      const [Z, ...b] = W.split(":");
      if (Z === "pt") d.add(+b[0]);
      else if (Z === "poly") h.add(+b[0]);
      else if (Z === "seg") {
        const u = +b[0], z = +b[1];
        m.has(u) || m.set(u, /* @__PURE__ */ new Set()), m.get(u).add(z);
      } else Z === "aux" && x.add(+b[0]);
    }
    let k = 0, w = [], l = [];
    const S = /* @__PURE__ */ new Map();
    for (let W = 0; W < a.length; W++) {
      if (h.has(W)) {
        k++;
        continue;
      }
      S.set(W, w.length);
      const Z = m.get(W);
      if (Z && Z.size > 0) {
        let b = [];
        for (let u = 0; u < a[W].length; u++) b.push(a[W][u]), u < a[W].length - 1 && Z.has(u) && (b.length >= 2 && w.push(b), b = [], k++);
        (b.length >= 2 || b.length === 1) && w.push(b);
      } else w.push([...a[W]]);
    }
    if (d.size > 0) {
      const W = [], Z = /* @__PURE__ */ new Map();
      for (let u = 0; u < o.length; u++) {
        if (d.has(u)) {
          k++;
          continue;
        }
        Z.set(u, W.length), W.push([...o[u]]);
      }
      const b = [];
      for (const u of w) {
        let z = [];
        for (const E of u) {
          const K = Z.get(E);
          K === void 0 ? (z.length >= 2 && b.push(z), z = []) : z.push(K);
        }
        z.length >= 2 && b.push(z);
      }
      w = b, e.points.val = W;
    }
    for (const W of t) {
      const Z = S.get(W);
      Z !== void 0 && Z < w.length && l.push(Z);
    }
    if (e.polylines && (e.polylines.val = w), e.areas && (e.areas.val = l), x.size > 0 && s) {
      const W = i.filter((Z, b) => !x.has(b));
      "val" in s ? s.val = W : window.__hekatanDrawingAuxLines = W, k += x.size;
    }
    Xe.clear(), Yt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return de(`\u{1F5D1} ${k} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Go, window.addEventListener("keydown", (n) => {
    if (n.key !== "Delete" && n.key !== "Backspace") return;
    const o = document.activeElement, a = o && (o.id === "hk3-cmd-input" || o.id === "hk-dyn-input") && o.value === "";
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.isContentEditable) && !a || Xe.size !== 0 && (n.preventDefault(), Go());
  });
  const Rt = document.createElement("div");
  Rt.id = "hk-properties-pane";
  const Ho = "hk-props-pane-pos";
  let Cn = null;
  try {
    const n = localStorage.getItem(Ho);
    n && (Cn = JSON.parse(n));
  } catch {
  }
  Rt.style.cssText = ["position:fixed", Cn ? `left:${Cn.left}px` : "left:14px", Cn ? `top:${Cn.top}px` : "top:452px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 560px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(Rt);
  const Ns = () => {
    const n = Rt.querySelector(".tp-rotv_b");
    if (!n || n.__hkDragWired) return;
    n.__hkDragWired = true, n.style.cursor = "move", n.style.userSelect = "none";
    let o = false, a = 0, t = 0, s = 0, i = 0;
    n.addEventListener("mousedown", (d) => {
      o = true, a = d.clientX, t = d.clientY;
      const h = Rt.getBoundingClientRect();
      s = h.left, i = h.top, Rt.style.transform = "none", Rt.style.left = `${s}px`, Rt.style.top = `${i}px`, d.preventDefault();
    }), window.addEventListener("mousemove", (d) => {
      if (!o) return;
      const h = d.clientX - a, m = d.clientY - t, x = Math.max(0, Math.min(window.innerWidth - 80, s + h)), k = Math.max(0, Math.min(window.innerHeight - 40, i + m));
      Rt.style.left = `${x}px`, Rt.style.top = `${k}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Ho, JSON.stringify({ left: parseFloat(Rt.style.left), top: parseFloat(Rt.style.top) }));
        } catch {
        }
      }
    });
  }, ce = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, Tt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let pt = null;
  const Ct = (n, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: n, ids: o, prop: a, value: t } }));
  }, Xs = () => {
    if (pt && (pt.dispose(), pt = null), Xe.size === 0) {
      Rt.style.display = "none";
      return;
    }
    const n = [...Xe], o = n.filter((w) => w.startsWith("pt:")), a = n.filter((w) => w.startsWith("seg:")), t = n.filter((w) => w.startsWith("poly:")), s = n.filter((w) => w.startsWith("aux:")), i = o.length > 0, d = a.length > 0, h = t.length > 0, m = !i && !d && !h, x = [];
    o.length && x.push(`\u{1F535} ${o.length} nodo(s)`), a.length && x.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && x.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && x.push(`\u250A ${s.length} aux`);
    const k = `\u{1F3AF} ${Xe.size} item(s) \u2014 ${x.join(", ")}`;
    pt = new Fs({ container: Rt, title: k });
    {
      const w = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      w.addBinding(Tt, "dx", { label: "\u0394x (m)", step: 0.1 }), w.addBinding(Tt, "dy", { label: "\u0394y (m)", step: 0.1 }), w.addBinding(Tt, "dz", { label: "\u0394z (m)", step: 0.1 }), w.addBinding(Tt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), w.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a3;
        const Z = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, Tt.dx, Tt.dy, Tt.dz, Tt.copias);
        de(Z ? `\u29C9 Replicado \xD7${Z} (\u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const l = { vuelo: 1.5, losa: true, borde: true, ambos: true }, S = w.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      S.addBinding(l, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), S.addBinding(l, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), S.addBinding(l, "borde", { label: "con viga de borde" }), S.addBinding(l, "ambos", { label: "a los dos lados" }), S.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a3;
        const Z = (_a3 = window.__hekatanVoladoSelection) == null ? void 0 : _a3.call(window, l.vuelo, { losa: l.losa, vigaBorde: l.borde, lados: l.ambos ? "ambos" : "afuera" });
        de(Z ? `\u2310 Volado de ${l.vuelo} m en ${Z} pa\xF1o(s)` + (l.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), w.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a3;
        const Z = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, Tt.dx, Tt.dy, Tt.dz, 1);
        de(Z ? `\u2192 Copia desplazada \u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const W = w.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      W.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a3;
        return (_a3 = window.__hekatanToggleSnap) == null ? void 0 : _a3.call(window);
      }), W.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), de(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const w = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      w.addBinding(ce, "Ux"), w.addBinding(ce, "Uy"), w.addBinding(ce, "Uz"), w.addBinding(ce, "Rx"), w.addBinding(ce, "Ry"), w.addBinding(ce, "Rz");
      const l = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      l.addBinding(ce, "Kx", { label: "Kx", min: 0, step: 100 }), l.addBinding(ce, "Ky", { label: "Ky", min: 0, step: 100 }), l.addBinding(ce, "Kz", { label: "Kz", min: 0, step: 100 }), l.addBinding(ce, "Krx", { label: "Krx", min: 0, step: 1e3 }), l.addBinding(ce, "Kry", { label: "Kry", min: 0, step: 1e3 }), l.addBinding(ce, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const S = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      S.addBinding(ce, "Fx", { step: 0.1 }), S.addBinding(ce, "Fy", { step: 0.1 }), S.addBinding(ce, "Fz", { step: 0.1 }), S.addBinding(ce, "Mx", { step: 0.1 }), S.addBinding(ce, "My", { step: 0.1 }), S.addBinding(ce, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ce, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ce, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let b = 0;
        const u = [ce.Ux, ce.Uy, ce.Uz, ce.Rx, ce.Ry, ce.Rz];
        u.some((K) => K) && (Ct("nodes", o, "supports", u), b++);
        const z = [ce.Fx, ce.Fy, ce.Fz, ce.Mx, ce.My, ce.Mz];
        z.some((K) => K !== 0) && (Ct("nodes", o, "loads", z), b++);
        const E = [ce.Kx, ce.Ky, ce.Kz, ce.Krx, ce.Kry, ce.Krz];
        if (E.some((K) => K !== 0) && (Ct("nodes", o, "springs", E), b++), ce.mass !== 0 && (Ct("nodes", o, "mass", ce.mass), b++), ce.diaphragm !== "Ninguno" && (Ct("nodes", o, "diaphragm", ce.diaphragm), b++), b === 0) {
          de("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let K = document.getElementById("hk-prop-toast");
          K || (K = document.createElement("div"), K.id = "hk-prop-toast", K.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(K)), K.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", K.style.background = "rgba(217,119,6,0.97)", K.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            K && (K.style.opacity = "0");
          }, 3200);
        } else de(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (d) {
      const w = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      w.addBinding(ce, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), w.addBinding(ce, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const l = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      l.addBinding(ce, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), l.addBinding(ce, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), l.addBinding(ce, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), l.addBinding(ce, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ce, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ce, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const Z = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      Z.addBinding(ce, "relMxI", { label: "Mx I" }), Z.addBinding(ce, "relMyI", { label: "My I" }), Z.addBinding(ce, "relMzI", { label: "Mz I" });
      const b = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      b.addBinding(ce, "relMxJ", { label: "Mx J" }), b.addBinding(ce, "relMyJ", { label: "My J" }), b.addBinding(ce, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ce, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const z = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      z.addBinding(ce, "LKx", { label: "LKx", min: 0, step: 100 }), z.addBinding(ce, "LKy", { label: "LKy", min: 0, step: 100 }), z.addBinding(ce, "LKz", { label: "LKz", min: 0, step: 100 });
      const E = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      E.addBinding(ce, "qx", { step: 0.1 }), E.addBinding(ce, "qy", { step: 0.1 }), E.addBinding(ce, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ce, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Ct("segs", a, "section", ce.section), Ct("segs", a, "material", ce.material_frame);
        const C = { A: ce.A_mod, Iz: ce.Iz_mod, Iy: ce.Iy_mod, J: ce.J_mod };
        (C.A !== 1 || C.Iz !== 1 || C.Iy !== 1 || C.J !== 1) && Ct("segs", a, "modifiers", C), ce.insertionPoint !== "10 \u2014 Centroid" && Ct("segs", a, "insertionPoint", ce.insertionPoint), ce.beta !== 0 && Ct("segs", a, "beta", ce.beta);
        const A = [ce.relMxI, ce.relMyI, ce.relMzI], U = [ce.relMxJ, ce.relMyJ, ce.relMzJ];
        (A.some((ke) => ke) || U.some((ke) => ke)) && Ct("segs", a, "releases", { i: A, j: U }), ce.hinges !== "None" && Ct("segs", a, "hinges", ce.hinges);
        const Q = [ce.LKx, ce.LKy, ce.LKz];
        Q.some((ke) => ke !== 0) && Ct("segs", a, "lineSprings", Q);
        const re = [ce.qx, ce.qy, ce.qz];
        re.some((ke) => ke !== 0) && Ct("segs", a, "distLoad", re), ce.massPerM !== 0 && Ct("segs", a, "massPerM", ce.massPerM), de(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (h) {
      const w = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      w.addBinding(ce, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), w.addBinding(ce, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), w.addBinding(ce, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ce, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Ct("areas", t, "shellType", ce.shellType), Ct("areas", t, "thickness", ce.thickness), Ct("areas", t, "material", ce.material_shell), ce.surfLoad !== 0 && Ct("areas", t, "surfLoad", ce.surfLoad), de(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (m) {
      const w = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), l = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      w.addBinding(l, "msg", { readonly: true, label: "" });
    }
    pt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Xe.clear(), Yt();
    }), Rt.style.display = "block", Ns();
  };
  window.__hekatanRefreshPropsPane = Xs;
  let xn = null, qn = false;
  M.addEventListener("pointerdown", (n) => {
    n.button === 2 && (xn = { x: n.clientX, y: n.clientY }, qn = false);
  }), M.addEventListener("pointermove", (n) => {
    if (xn && n.buttons & 2 && !qn) {
      const o = n.clientX - xn.x, a = n.clientY - xn.y;
      Math.hypot(o, a) > 8 && (qn = true);
    }
  }), M.addEventListener("pointerup", (n) => {
    var _a3, _b, _c;
    if (n.button === 2) {
      const o = xn !== null && !qn;
      xn = null;
      const a = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, a) return;
      if (o) {
        if (Zt ? Un() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Xe.size > 0 && (Xe.clear(), Yt()), e.polylines) {
          const i = e.polylines.rawVal;
          (i[i.length - 1] ?? []).length > 0 && (e.polylines.val = [...i, []]);
        }
        const t = window.__hekatanCadState, s = (_b = (_a3 = t == null ? void 0 : t.get) == null ? void 0 : _a3.call(t)) == null ? void 0 : _b.tool;
        s && s !== "select" && s !== "none" ? ((_c = t == null ? void 0 : t.setTool) == null ? void 0 : _c.call(t, "select"), de(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : de("\u238B Cancelado (click derecho)");
      }
    }
  }), M.addEventListener("contextmenu", (n) => {
    n.preventDefault(), n.stopPropagation();
  }, { capture: true }), M.addEventListener("pointerdown", (n) => {
    var _a3, _b, _c;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || n.button === 0 && (window.__hekatanBloquearVentana || n.pointerType !== "touch" && (Jt = null, Pn = false));
  }), M.addEventListener("pointermove", (n) => {
    if (Zt && n.buttons === 0) {
      const i = n.clientX < Zt.x;
      fo(Zt.x, Zt.y, n.clientX, n.clientY, i);
      return;
    }
    if (!Jt) return;
    const o = n.clientX - Jt.x, a = n.clientY - Jt.y, t = Math.hypot(o, a);
    if (!Pn && t < 8) return;
    Pn = true;
    const s = n.clientX < Jt.x;
    fo(Jt.x, Jt.y, n.clientX, n.clientY, s);
  }), M.addEventListener("pointerup", (n) => {
    if (!Jt) return;
    if (!Pn) {
      Jt = null;
      return;
    }
    const o = n.ctrlKey || n.metaKey || n.shiftKey;
    Ko(Jt.x, Jt.y, n.clientX, n.clientY, o), Jt = null, Pn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const qt = new rt();
  qt.visible = false, qt.frustumCulled = false, c.add(qt);
  const Wo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Jo = (n, o, a, t) => {
    var _a3, _b, _c, _d;
    for (; qt.children.length; ) {
      const d = qt.children.pop();
      (_b = (_a3 = d.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = d.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Wo[n] ?? 16777215, i = new Fe().setFromPoints([new F(-1, -1, 0), new F(1, -1, 0), new F(1, -1, 0), new F(1, 1, 0), new F(1, 1, 0), new F(-1, 1, 0), new F(-1, 1, 0), new F(-1, -1, 0)]);
    qt.add(new jt(i, new yt({ color: s, linewidth: 2 }))), qt.position.set(o, a, t), qt.visible = true, mo();
  };
  let ho = 4;
  const mo = () => {
    qt.visible && qt.scale.setScalar(ho * Zn(qt.position));
  };
  window.__hekatanOsnapMarkerRef = qt, window.__hekatanUpdateOsnapScale = mo, window.__hekatanOsnapPx = (n) => (typeof n == "number" && n > 0 && (ho = n, mo(), g()), ho);
  const Kn = () => {
    qt.visible = false;
  }, Ys = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano" }, en = document.createElement("div");
  en.id = "hk-osnap-etiqueta", en.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(en);
  const Oo = (n, o, a) => {
    const t = Ys[n];
    if (!t) {
      en.style.display = "none";
      return;
    }
    en.textContent = t, en.style.color = "#" + (Wo[n] ?? 16777215).toString(16).padStart(6, "0"), en.style.left = o + 18 + "px", en.style.top = a - 26 + "px", en.style.display = "block";
  }, Zs = () => {
    en.style.display = "none";
  }, zn = new F(), wo = (n, o, a) => {
    const t = p();
    if (!t) return null;
    const s = M.getBoundingClientRect();
    return zn.set(n, o, a).project(t), !isFinite(zn.x) || !isFinite(zn.y) ? null : { x: s.left + (zn.x * 0.5 + 0.5) * s.width, y: s.top + (-zn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = wo;
  const Us = (n, o, a, t, s) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, d = e.points.rawVal, h = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let m = null;
    const x = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, k = s, w = (u, z, E, K) => {
      let C;
      if (k) {
        const U = wo(z, E, K);
        if (!U || (C = Math.hypot(U.x - k.x, U.y - k.y), C > Sn)) return;
      } else if (C = Math.hypot(z - n, E - o, K - a), C > t) return;
      const A = x[u] ?? 9;
      (!m || A < m.r || A === m.r && C < m.d) && (m = { type: u, x: z, y: E, z: K, d: C, r: A });
    };
    if (i.ori !== false && w("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, z = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, E = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, K = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", C = (U) => Math.round(U / z) * z, A = (U, Q) => Math.abs(U) <= E + 1e-9 && Math.abs(Q) <= E + 1e-9;
      if (K === "xz") {
        const U = C(n), Q = C(a);
        A(U, Q) && w("grid", U, o, Q);
      } else if (K === "yz") {
        const U = C(o), Q = C(a);
        A(U, Q) && w("grid", n, U, Q);
      } else {
        const U = C(n), Q = C(o);
        A(U, Q) && w("grid", U, Q, a);
      }
    }
    (i.node || i.end) && d.forEach((u) => {
      i.node && w("node", u[0], u[1], u[2]);
    });
    for (const u of h) if (!(u.length < 2)) for (let z = 0; z < u.length - 1; z++) {
      const E = d[u[z]], K = d[u[z + 1]];
      if (!(!E || !K) && (i.end && (w("end", E[0], E[1], E[2]), w("end", K[0], K[1], K[2])), i.mid && w("mid", (E[0] + K[0]) / 2, (E[1] + K[1]) / 2, (E[2] + K[2]) / 2), i.nea || i.per)) {
        const C = K[0] - E[0], A = K[1] - E[1], U = K[2] - E[2], Q = C * C + A * A + U * U;
        if (Q < 1e-12) continue;
        const re = Math.max(0, Math.min(1, ((n - E[0]) * C + (o - E[1]) * A + (a - E[2]) * U) / Q)), ke = E[0] + re * C, Ke = E[1] + re * A, Re = E[2] + re * U;
        i.nea && w("nea", ke, Ke, Re), i.per && w("per", ke, Ke, Re);
      }
    }
    if (i.cen) {
      const u = ((_e2 = e.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const z of u) {
        const E = h[z];
        if (!E || E.length < 3) continue;
        const K = E[0] === E[E.length - 1] ? E.slice(0, -1) : E;
        let C = 0, A = 0, U = 0, Q = 0;
        for (const re of K) {
          const ke = d[re];
          ke && (C += ke[0], A += ke[1], U += ke[2], Q++);
        }
        Q >= 3 && w("cen", C / Q, A / Q, U / Q);
      }
    }
    if (i.cen) {
      const u = Zo(), z = [...Yn];
      for (const E of u) z.some((K) => Math.hypot(K.c[0] - E.c[0], K.c[1] - E.c[1], K.c[2] - E.c[2]) < 1e-6 && Math.abs(K.r - E.r) < 1e-6) || z.push(E);
      for (const E of z) {
        if (!d.some((A) => Math.abs(Math.hypot(A[0] - E.c[0], A[1] - E.c[1], A[2] - E.c[2]) - E.r) < 1e-6)) continue;
        const C = Math.hypot(n - E.c[0], o - E.c[1], a - E.c[2]);
        if (C < t || Math.abs(C - E.r) < t) {
          const A = Math.min(C, t * 0.5), U = 3;
          (!m || U < m.r || U === m.r && A < m.d) && (m = { type: "cen", x: E.c[0], y: E.c[1], z: E.c[2], d: A, r: U });
        }
      }
    }
    if (i.int) {
      const u = [];
      for (const z of h) for (let E = 0; E < z.length - 1; E++) {
        const K = d[z[E]], C = d[z[E + 1]];
        if (!K || !C) continue;
        const A = C[0] - K[0], U = C[1] - K[1], Q = C[2] - K[2], re = A * A + U * U + Q * Q;
        if (re < 1e-12) continue;
        const ke = Math.max(0, Math.min(1, ((n - K[0]) * A + (o - K[1]) * U + (a - K[2]) * Q) / re));
        Math.hypot(K[0] + ke * A - n, K[1] + ke * U - o, K[2] + ke * Q - a) < 3 * t && u.push([K, C]);
      }
      for (let z = 0; z < u.length; z++) for (let E = z + 1; E < u.length; E++) {
        const [K, C] = u[z], [A, U] = u[E], Q = [C[0] - K[0], C[1] - K[1], C[2] - K[2]], re = [U[0] - A[0], U[1] - A[1], U[2] - A[2]], ke = [K[0] - A[0], K[1] - A[1], K[2] - A[2]], Ke = Q[0] * Q[0] + Q[1] * Q[1] + Q[2] * Q[2], Re = Q[0] * re[0] + Q[1] * re[1] + Q[2] * re[2], st = re[0] * re[0] + re[1] * re[1] + re[2] * re[2], nt = Q[0] * ke[0] + Q[1] * ke[1] + Q[2] * ke[2], lt = re[0] * ke[0] + re[1] * ke[1] + re[2] * ke[2], Oe = Ke * st - Re * Re;
        if (Oe < 1e-12) continue;
        const $e = (Re * lt - st * nt) / Oe, ot = (Ke * lt - Re * nt) / Oe;
        if ($e < -1e-6 || $e > 1 + 1e-6 || ot < -1e-6 || ot > 1 + 1e-6) continue;
        const Ye = [K[0] + $e * Q[0], K[1] + $e * Q[1], K[2] + $e * Q[2]], Se = [A[0] + ot * re[0], A[1] + ot * re[1], A[2] + ot * re[2]];
        if (Math.hypot(Ye[0] - Se[0], Ye[1] - Se[1], Ye[2] - Se[2]) > 1e-4) continue;
        [K, C, A, U].some((je) => Math.hypot(je[0] - Ye[0], je[1] - Ye[1], je[2] - Ye[2]) < 1e-6) || w("int", Ye[0], Ye[1], Ye[2]);
      }
    }
    const l = window.__hekatanAxisGrids ?? [], S = window.__hekatanLevels ?? [], W = l.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, z] of W) {
      i.end && (w("end", u[0], u[1], u[2]), w("end", z[0], z[1], z[2]));
      const E = z[0] - u[0], K = z[1] - u[1], C = z[2] - u[2], A = E * E + K * K + C * C;
      if (A < 1e-12) continue;
      const U = Math.max(0, Math.min(1, ((n - u[0]) * E + (o - u[1]) * K + (a - u[2]) * C) / A));
      if (i.nea && w("nea", u[0] + U * E, u[1] + U * K, u[2] + U * C), i.int && Math.abs(C) > 1e-9) for (const Q of S) {
        const re = (Q.z - u[2]) / C;
        re < -1e-6 || re > 1 + 1e-6 || w("int", u[0] + re * E, u[1] + re * K, Q.z);
      }
    }
    if (i.int || i.node) for (let u = 0; u < W.length; u++) for (let z = u + 1; z < W.length; z++) {
      const [E, K] = W[u], [C, A] = W[z], U = K[0] - E[0], Q = K[1] - E[1], re = A[0] - C[0], ke = A[1] - C[1], Ke = U * ke - Q * re;
      if (Math.abs(Ke) < 1e-12) continue;
      const Re = E[0] - C[0], st = E[1] - C[1], nt = (re * st - ke * Re) / Ke, lt = (U * st - Q * Re) / Ke;
      if (nt < -1e-6 || nt > 1 + 1e-6 || lt < -1e-6 || lt > 1 + 1e-6) continue;
      const Oe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      w("int", E[0] + nt * U, E[1] + nt * Q, typeof Oe == "number" ? Oe : a);
    }
    const Z = window.__hekatanDrawingAuxLines, b = (Z == null ? void 0 : Z.rawVal) ?? (Z == null ? void 0 : Z.val) ?? Z ?? [];
    for (const u of b) {
      if (u.length !== 6) continue;
      const z = [u[0], u[1], u[2]], E = [u[3], u[4], u[5]];
      if (i.end && (w("end", z[0], z[1], z[2]), w("end", E[0], E[1], E[2])), i.mid && w("mid", (z[0] + E[0]) / 2, (z[1] + E[1]) / 2, (z[2] + E[2]) / 2), i.nea || i.per) {
        const K = E[0] - z[0], C = E[1] - z[1], A = E[2] - z[2], U = K * K + C * C + A * A;
        if (U < 1e-12) continue;
        const Q = Math.max(0, Math.min(1, ((n - z[0]) * K + (o - z[1]) * C + (a - z[2]) * A) / U)), re = z[0] + Q * K, ke = z[1] + Q * C, Ke = z[2] + Q * A;
        i.nea && w("nea", re, ke, Ke), i.per && w("per", re, ke, Ke);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
  }, gn = new rt();
  gn.frustumCulled = false, c.add(gn);
  const Qo = new yt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let jo = 0;
  const es = () => {
    var _a3, _b;
    for (const n of gn.children.slice()) gn.remove(n), (_b = (_a3 = n.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (n) => {
    var _a3, _b;
    es();
    const o = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const s of n || []) {
      const i = String(s).split(":");
      let d = [];
      if (i[0] === "pt") {
        const x = o[+i[1]];
        x && (d = [x, [x[0] + 1e-3, x[1], x[2]]]);
      } else if (i[0] === "seg") {
        const x = a[+i[1]] || [], k = o[x[+i[2]]], w = o[x[+i[2] + 1]];
        k && w && (d = [k, w]);
      } else i[0] === "poly" && (d = (a[+i[1]] || []).map((k) => o[k]).filter(Boolean));
      if (d.length < 2) continue;
      const h = new Fe().setFromPoints(d.map((x) => new F(x[0], x[1], x[2]))), m = new zt(h, Qo);
      m.renderOrder = 1200, gn.add(m);
    }
    if (!gn.children.length) return;
    jo = performance.now() + 900;
    const t = () => {
      const s = jo - performance.now();
      if (s <= 0) {
        es(), g();
        return;
      }
      Qo.opacity = Math.min(1, s / 900) * 0.95, g(), requestAnimationFrame(t);
    };
    requestAnimationFrame(t);
  }, window.addEventListener("hk:property-applied", (n) => {
    var _a3;
    const o = (_a3 = n == null ? void 0 : n.detail) == null ? void 0 : _a3.ids;
    Array.isArray(o) && o.length && window.__hekatanDestello(o);
  }), window.__hekatanOsnapCompute = Us, window.__hekatanOsnapShow = Jo, window.__hekatanOsnapHide = Kn;
  let qe = [], bt = 0, dn = 0, Et = null;
  const Fn = document.createElement("div");
  Fn.id = "hk-cad-status", Fn.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", Fn.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(Fn);
  const qs = () => {
    var _a3, _b, _c;
    const n = [];
    window.__hekatanOrthoMode && n.push("\u22A5 ORTO ON (F8)"), Ne && n.push(`\u{1F512} LOCK ${Ne.toUpperCase()}`);
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workZ) ?? 0;
    return Math.abs(a) > 1e-3 && n.push(`Cota Z=${a}m`), window.__hekatanShowOrthoPlanes !== false && n.push("\u25A6 Planos XY/XZ/YZ"), n.length > 0 ? `   |   ${n.join("  \xB7  ")}` : "";
  }, de = (n) => {
    var _a3;
    const o = n + qs();
    Fn.textContent = o, window.__hekatanCadStatusText = o;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, n);
    } catch {
    }
  }, Ks = "Comando:", Gs = () => {
    var _a3, _b, _c, _d;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], t = qe.length, s = (i, d = []) => ({ txt: i, ops: d });
    switch (n) {
      case "line":
        return a.length >= 2 ? s("L\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? s("L\xCDNEA Precise punto siguiente o", ["desHacer"]) : s("L\xCDNEA Precise primer punto:");
      case "polyline":
        return a.length >= 2 ? s("POLIL\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : a.length === 1 ? s("POLIL\xCDNEA Precise punto siguiente o", ["desHacer"]) : s("POLIL\xCDNEA Precise punto inicial:");
      case "node":
        return s("NUDO Precise punto:");
      case "area":
        return s(`LOSA Precise v\xE9rtice ${Math.min(a.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea":
        return s(t ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${ge.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return s("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return s(`REGLA ${Pe.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
      case "rect":
        return s(t ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return s(t ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return s(t === 0 ? "ARCO Precise punto inicial:" : t === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "col":
        return s(`COLUMNA Precise punto de inserci\xF3n (altura ${bt > 0 ? bt : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return s(t ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${bt > 0 ? bt : 3} m; teclee otra + Enter):`);
      case "plane3":
        return s(`PLANO Precise punto ${t + 1} de 3:`);
      case "extp":
        return s("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return s("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return s(Et ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return s(Et ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return s(Et ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${dn > 0 ? ` (distancia ${dn} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
      case "axis":
        return s("EJE Precise el primer punto del eje:");
      case "aux":
        return s(t ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return s("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return s(t ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return s("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return Xe.size ? s(t ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : s("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Xe.size ? s(t ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : s("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Xe.size ? s(`SELECCI\xD3N ${Xe.size} objeto${Xe.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : s("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return s(Ks);
    }
  }, Ut = () => {
    var _a3, _b, _c, _d, _e2;
    try {
      const n = Gs(), o = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(n.txt) && !o && !a ? `${n.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : n.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, s, n.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Ut, window.__hekatanRefreshStatus = () => {
    const n = window.__hekatanCadStatusText ?? "", o = n.split("   |   ")[0] ?? n;
    de(o);
  }, window.__hekatanCadResetPending = () => {
    qe = [], ge = [], O.visible = false, yo(), Et = null, g(), de("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Ut();
  };
  function yo() {
    if (!e.polylines) return;
    const n = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...n, []];
  }
  window.__hekatanCerrarPolilinea = yo;
  const vn = [], Gn = [], xo = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, ts = (n) => {
    var _a3;
    e.points.val = n.p, e.polylines && (e.polylines.val = n.l), e.areas && (e.areas.val = n.a), qe = [], fe.visible = false, we.visible = false, R();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    g(), Ut();
  }, Dt = () => {
    vn.push(xo()), vn.length > 100 && vn.shift(), Gn.length = 0;
  }, Hn = () => {
    const n = vn.pop();
    if (!n) {
      de("\u21B6 Nada para deshacer");
      return;
    }
    Gn.push(xo()), ts(n), de(`\u21B6 Deshacer \u2014 quedan ${vn.length}`);
  }, ns = () => {
    const n = Gn.pop();
    if (!n) {
      de("\u21B7 Nada para rehacer");
      return;
    }
    vn.push(xo()), ts(n), de(`\u21B7 Rehacer \u2014 quedan ${Gn.length}`);
  };
  window.__hekatanPushUndo = Dt, window.__hekatanUndo = Hn, window.__hekatanRedo = ns, document.addEventListener("keydown", (n) => {
    var _a3;
    const o = n.key.toLowerCase();
    if (!((n.ctrlKey || n.metaKey) && (o === "y" || o === "z" && n.shiftKey))) return;
    const t = n.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a3 = t.value) == null ? void 0 : _a3.length) ?? 0) > 0 || (n.preventDefault(), n.stopPropagation(), ns());
  }, { capture: true }), window.__hekatanCadOption = (n) => {
    var _a3, _b, _c, _d, _e2;
    const o = n.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Hn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return de("Cerrar necesita al menos tres puntos."), true;
      Dt(), e.polylines.val = [...t.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return go(), de(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Hn(), true;
      Dt();
      const i = s[s.length - 1], d = s.slice(0, -1), h = t.some((k, w) => w !== t.length - 1 && k.includes(i)) || d.includes(i);
      let m = e.points.rawVal, x = [...t.slice(0, -1), d];
      if (!h && i === m.length - 1 && (m = m.slice(0, -1), e.points.val = m), e.polylines.val = x, d.length) {
        const k = m[d[d.length - 1]];
        k && (I = [k[0], k[1], k[2]]);
      } else I = null, fe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return g(), de(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${d.length}.`), Ut(), true;
    }
    return false;
  }, document.addEventListener("keydown", (n) => {
    var _a3;
    if ((n.ctrlKey || n.metaKey) && n.key.toLowerCase() === "z" && !n.shiftKey) {
      const o = n.target, a = o == null ? void 0 : o.tagName;
      if ((a === "INPUT" || a === "TEXTAREA") && o.type !== "checkbox" && o.type !== "range" && ((_a3 = o.value) == null ? void 0 : _a3.length) > 0) return;
      n.preventDefault(), n.stopPropagation(), Hn();
    }
  }, { capture: true });
  const go = () => {
    qe = [], Et = null, yo(), Ne = null, tt(), fe.visible = false, we.visible = false, R(), de("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), g(), Ut();
  };
  window.__hekatanFinalizeDraw = go;
  const os = () => {
    var _a3, _b, _c;
    qe = [], ge = [], O.visible = false;
    let n = false;
    Xe.size && (Xe.clear(), Yt(), n = true), go();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    de(n ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), g(), Ut();
  };
  window.__hekatanEscapeCancel = os;
  const ss = () => {
    var _a3;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Set();
    return Xe.forEach((a) => {
      if (a.startsWith("pt:")) o.add(+a.slice(3));
      else if (a.startsWith("poly:")) (n[+a.slice(5)] || []).forEach((t) => o.add(t));
      else if (a.startsWith("seg:")) {
        const t = a.split(":"), s = n[+t[1]] || [], i = s[+t[2]], d = s[+t[2] + 1];
        i != null && o.add(i), d != null && o.add(d);
      }
    }), o;
  }, as = (n, o, a) => {
    var _a3;
    const t = ss();
    if (!t.size) return 0;
    Dt();
    const s = e.points.rawVal.map((i, d) => t.has(d) ? [i[0] + n, i[1] + o, i[2] + a] : i);
    e.points.val = s;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return Yt(), g(), t.size;
  };
  window.__hekatanMoveSelection = as;
  const is = (n, o) => {
    var _a3, _b, _c, _d, _e2;
    if (!Xe.size) {
      de(`${n === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Ut();
      return;
    }
    if (qe.push(o), qe.length === 1) {
      I = o, de(`${n === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Ut();
      return;
    }
    const [a, t] = qe, s = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    qe = [], fe.visible = false;
    let i = 0;
    n === "move" ? i = as(s[0], s[1], s[2]) : (i = ss().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), de(`\u2713 ${n === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), n === "move" && (Xe.clear(), Yt()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), Ut();
  };
  window.__hekatanPasoMoverCopiar = is;
  const Hs = () => {
    var _a3, _b, _c;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return n === "xz" ? [0, 1, 0] : n === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, an = (n, o) => Math.hypot(n[0] - o[0], n[1] - o[1], n[2] - o[2]), vo = (n, o, a, t, s, i) => {
    const d = [o[0] - n[0], o[1] - n[1], o[2] - n[2]], h = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], m = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], x = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], k = d[0] * h[0] + d[1] * h[1] + d[2] * h[2], w = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], l = d[0] * m[0] + d[1] * m[1] + d[2] * m[2], S = h[0] * m[0] + h[1] * m[1] + h[2] * m[2], W = x * w - k * k;
    if (W < 1e-12) return null;
    const Z = (k * S - w * l) / W, b = (x * S - k * l) / W;
    if (!s && (Z < -1e-6 || Z > 1 + 1e-6) || !i && (b < -1e-6 || b > 1 + 1e-6)) return null;
    const u = [n[0] + Z * d[0], n[1] + Z * d[1], n[2] + Z * d[2]], z = [a[0] + b * h[0], a[1] + b * h[1], a[2] + b * h[2]];
    return an(u, z) > 1e-4 ? null : u;
  }, Ws = (n) => {
    var _a3;
    return (((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((o, a) => o + a.filter((t) => t === n).length, 0);
  }, Js = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Os = (n, o) => {
    var _a3, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, t = e.points.rawVal, s = Js[n];
    if (!Et) {
      if (wt < 0) {
        de(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Et = { poly: wt, seg: Math.max(0, Nt) }, de(n === "offset" ? `DESFASE l\xEDnea #${Et.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${dn > 0 ? ` (${dn} m)` : ""}.` : n === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Ut();
      return;
    }
    if (n === "offset") {
      const Z = Et.poly, b = a[Z];
      if (!b || b.length < 2) {
        Et = null, de("DESFASE: esa polil\xEDnea no tiene tramos."), Ut();
        return;
      }
      const u = b.length > 2 && b[0] === b[b.length - 1], z = Hs(), E = [];
      for (let $e = 0; $e < b.length - 1; $e++) {
        const ot = t[b[$e]], Ye = t[b[$e + 1]], Se = [Ye[0] - ot[0], Ye[1] - ot[1], Ye[2] - ot[2]], Ie = Math.hypot(Se[0], Se[1], Se[2]) || 1, je = Se[0] / Ie, Lt = Se[1] / Ie, Bt = Se[2] / Ie, It = [z[1] * Bt - z[2] * Lt, z[2] * je - z[0] * Bt, z[0] * Lt - z[1] * je], on = Math.hypot(It[0], It[1], It[2]) || 1;
        E.push({ a: ot, b: Ye, n: [It[0] / on, It[1] / on, It[2] / on] });
      }
      let K = 0, C = 1 / 0;
      E.forEach(($e, ot) => {
        const Ye = sn(o[0], o[1], o[2], $e.a[0], $e.a[1], $e.a[2], $e.b[0], $e.b[1], $e.b[2]);
        Ye < C && (C = Ye, K = ot);
      });
      const A = E[K], U = Math.sign((o[0] - A.a[0]) * A.n[0] + (o[1] - A.a[1]) * A.n[1] + (o[2] - A.a[2]) * A.n[2]) || 1, Q = dn > 0 ? dn : C;
      if (Q < 1e-6) {
        de("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const re = E.map(($e) => ({ a: [$e.a[0] + U * Q * $e.n[0], $e.a[1] + U * Q * $e.n[1], $e.a[2] + U * Q * $e.n[2]], b: [$e.b[0] + U * Q * $e.n[0], $e.b[1] + U * Q * $e.n[1], $e.b[2] + U * Q * $e.n[2]] })), ke = re.length, Ke = ($e) => {
        const ot = re[($e - 1 + ke) % ke], Ye = re[$e % ke];
        return vo(ot.a, ot.b, Ye.a, Ye.b, true, true) ?? Ye.a;
      }, Re = [], st = u ? ke : ke + 1;
      for (let $e = 0; $e < st; $e++) !u && $e === 0 ? Re.push(re[0].a) : !u && $e === ke ? Re.push(re[ke - 1].b) : Re.push(Ke($e));
      Dt();
      const nt = t.length;
      e.points.val = [...t, ...Re];
      const lt = Re.map(($e, ot) => nt + ot);
      u && lt.push(nt);
      let Oe = a.slice();
      Oe.length && Oe[Oe.length - 1].length === 0 && (Oe = Oe.slice(0, -1)), e.polylines.val = [...Oe, lt, []], Et = null, de(`\u2713 Desfase a ${Q.toFixed(2)} m \u2014 ${ke} tramo${ke === 1 ? "" : "s"} nuevo${ke === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      g(), Ut();
      return;
    }
    let i = wt, d = Math.max(0, Nt);
    if (i < 0 || i === Et.poly && d === Et.seg) {
      let b = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((u, z) => {
        for (let E = 0; E < u.length - 1; E++) {
          if (z === Et.poly && E === Et.seg) continue;
          const K = t[u[E]], C = t[u[E + 1]];
          if (!K || !C) continue;
          const A = sn(o[0], o[1], o[2], K[0], K[1], K[2], C[0], C[1], C[2]);
          A < b && (b = A, i = z, d = E);
        }
      }), i < 0) {
        de(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const h = a[Et.poly], m = t[h[Et.seg]], x = t[h[Et.seg + 1]], k = a[i], w = k[d], l = k[d + 1];
    if (!m || !x || w == null || l == null) {
      de(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const S = t[w], W = t[l];
    if (n === "trim") {
      const Z = vo(S, W, m, x, false, false);
      if (!Z) {
        de("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Dt();
      const b = t.length;
      e.points.val = [...t, Z];
      const u = [...k.slice(0, d + 1), b, ...k.slice(d + 1)];
      e.polylines.val = a.map((E, K) => K === i ? u : E);
      const z = an(o, S) < an(o, W);
      No(i, z ? d : d + 1), de(`\u2713 Recortado en (${Z[0].toFixed(2)}, ${Z[1].toFixed(2)}, ${Z[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const Z = vo(S, W, m, x, true, false);
      if (!Z) {
        de("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = an(o, S) < an(o, W) ? d : d + 1;
      if (u !== 0 && u !== k.length - 1) {
        de("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const z = k[u];
      if (an(Z, S) + an(Z, W) < an(S, W) + 1e-6) {
        de("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Dt(), Ws(z) > 1) {
        const K = t.length;
        e.points.val = [...t, Z];
        const C = k.slice();
        C[u] = K, e.polylines.val = a.map((A, U) => U === i ? C : A);
      } else e.points.val = t.map((K, C) => C === z ? Z : K);
      de(`\u2713 Alargada hasta (${Z[0].toFixed(2)}, ${Z[1].toFixed(2)}, ${Z[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    g(), Ut();
  };
  window.__hekatanSelectionSize = () => Xe.size, window.__hekatanSelectLast = () => {
    var _a3;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let o = n.length - 1;
    for (; o >= 0 && (!n[o] || n[o].length < 2); ) o--;
    return Xe.clear(), o >= 0 && Xe.add(`poly:${o}`), Yt(), de(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Xe.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Xe.clear();
    const a = /* @__PURE__ */ new Set();
    return n.forEach((t, s) => {
      !t || t.length < 2 || (Xe.add(`poly:${s}`), t.forEach((i) => a.add(i)));
    }), o.forEach((t, s) => {
      a.has(s) || Xe.add(`pt:${s}`);
    }), Yt(), de(`SELECCI\xD3N ${Xe.size} objetos (todo el modelo) \xB7 Esc suelta`), Xe.size;
  }, window.__hekatanReplicateSelection = (n, o, a, t, s = 0) => {
    var _a3, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...Xe], d = e.points.rawVal, h = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), x = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Set(), w = [];
    if (i.forEach((b) => {
      if (b.startsWith("pt:")) {
        const u = +b.slice(3);
        d[u] && x.add(u);
      } else if (b.startsWith("poly:")) {
        const u = +b.slice(5);
        if (!h[u] || h[u].length < 2) return;
        k.add(u), h[u].forEach((z) => x.add(z));
      } else if (b.startsWith("seg:")) {
        const u = b.split(":"), z = +u[1], E = +u[2], K = h[z] || [], C = K[E], A = K[E + 1];
        C != null && A != null && (w.push([C, A]), x.add(C), x.add(A));
      }
    }), !x.size) return 0;
    Dt();
    const l = [...d];
    let S = h.slice();
    S.length && S[S.length - 1].length === 0 && (S = S.slice(0, -1));
    const W = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], Z = [...x];
    for (let b = 1; b <= t; b++) {
      const u = s + b, z = n * u, E = o * u, K = a * u, C = /* @__PURE__ */ new Map();
      Z.forEach((A) => {
        C.set(A, l.length), l.push([d[A][0] + z, d[A][1] + E, d[A][2] + K]);
      }), k.forEach((A) => {
        const U = h[A].map((re) => C.has(re) ? C.get(re) : re), Q = S.length;
        S.push(U), m.has(A) && W.push(Q);
      }), w.forEach(([A, U]) => {
        S.push([C.get(A), C.get(U)]);
      });
    }
    S.push([]), e.points.val = l, e.polylines && (e.polylines.val = S), e.areas && (e.areas.val = W);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return g(), t;
  }, window.__hekatanVoladoSelection = (n, o = {}) => {
    var _a3, _b, _c;
    const a = Number(n);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const t = o.losa !== false, s = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", d = e.points.rawVal, h = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = [];
    if ([...Xe].forEach((Z) => {
      if (Z.startsWith("seg:")) {
        const b = Z.split(":"), u = +b[1], z = +b[2], E = h[u] || [], K = E[z], C = E[z + 1];
        K != null && C != null && m.push([K, C]);
      } else if (Z.startsWith("poly:")) {
        const b = h[+Z.slice(5)] || [];
        for (let u = 0; u + 1 < b.length; u++) m.push([b[u], b[u + 1]]);
      }
    }), !m.length) return 0;
    let x = 0, k = 0;
    for (const Z of d) x += Z[0], k += Z[1];
    x /= Math.max(1, d.length), k /= Math.max(1, d.length), Dt();
    const w = [...d];
    let l = h.slice();
    l.length && l[l.length - 1].length === 0 && (l = l.slice(0, -1));
    const S = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let W = 0;
    for (const [Z, b] of m) {
      const u = d[Z], z = d[b];
      if (!u || !z) continue;
      const E = z[0] - u[0], K = z[1] - u[1], C = Math.hypot(E, K);
      if (C < 1e-6) continue;
      let A = -K / C, U = E / C;
      const Q = (u[0] + z[0]) / 2, re = (u[1] + z[1]) / 2;
      (Q - x) * A + (re - k) * U < 0 && (A = -A, U = -U);
      const ke = i === "ambos" ? [1, -1] : [1];
      for (const Ke of ke) {
        const Re = A * a * Ke, st = U * a * Ke, nt = w.length;
        w.push([u[0] + Re, u[1] + st, u[2]]);
        const lt = w.length;
        w.push([z[0] + Re, z[1] + st, z[2]]), l.push([Z, nt]), l.push([b, lt]), s && l.push([nt, lt]), t && (S.push(l.length), l.push([Z, b, lt, nt, Z])), W++;
      }
    }
    if (!W) return 0;
    l.push([]), e.points.val = w, e.polylines && (e.polylines.val = l), e.areas && (e.areas.val = S);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return g(), W;
  }, M.addEventListener("click", (n) => {
    var _a3, _b;
    if (window.__hekatanCursorPx = { x: n.clientX, y: n.clientY }, cn > 5) {
      cn = 0;
      return;
    }
    cn = 0;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(V, o);
    const a = oe();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(f.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), d = a[0].point;
      if (!isFinite(d.x) || !isFinite(d.y) || !isFinite(d.z) || i > Math.max(s * 12, 300)) {
        de("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let t = a[0].point;
    (n.ctrlKey || n.metaKey) && (t = new F(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = s[s.length - 1] ?? [], d = e.points.rawVal ?? [];
      if (i.length > 0) {
        const h = d[i[i.length - 1]];
        if (h) {
          const m = !!window.__hekatanOrthoMode;
          let x = Ne;
          if (!x && m) {
            const k = Math.abs(t.x - h[0]), w = Math.abs(t.y - h[1]), l = Math.abs(t.z - h[2]);
            x = k >= w && k >= l ? "x" : w >= l ? "y" : "z";
          }
          x === "x" ? t = new F(t.x, h[1], h[2]) : x === "y" ? t = new F(h[0], t.y, h[2]) : x === "z" && (t = new F(h[0], h[1], t.z));
        }
      }
    }
    if (Pt && Math.abs(n.clientX - Pt.x) <= 3 && Math.abs(n.clientY - Pt.y) <= 3) t = Pt.p.clone();
    else if (dt) t = dt.clone(), de(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else {
      const s = po(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s, { x: n.clientX, y: n.clientY });
      if (i) t = new F(i.x, i.y, i.z), de(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      else {
        const d = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0;
        d && h > 0 && (t = new F(Math.round(t.x / h) * h, Math.round(t.y / h) * h, Math.round(t.z / h) * h));
      }
    }
    ls(t, n);
  });
  const ls = (n, o) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (Ht) {
        Zt && Un();
        const { kind: t, a: s, b: i } = Ht, d = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Xe.clear(), Xe.has(d) ? Xe.delete(d) : Xe.add(d), Yt(), de(`\u2713 Seleccionados ${Xe.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const t = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Zt ? (Ko(Zt.x, Zt.y, s, i, t), Zt = null) : t || (Zt = { x: s, y: i }, de("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), fo(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const t = window.__hekatanAxisDraw;
      if (!t) return;
      if (!t.pendingStart) {
        t.pendingStart = [n.x, n.y, n.z], de(`\u{1F4CD} Eje \u2014 click 1 OK en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = t.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, t.pendingStart, [n.x, n.y, n.z], s);
      de(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (a === "move" || a === "copy") {
      is(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "delete") {
      if (Qt >= 0) {
        const t = window.__hekatanDrawingAuxLines, s = (t == null ? void 0 : t.rawVal) ?? (t == null ? void 0 : t.val) ?? t ?? [], i = Qt;
        if (i >= 0 && i < s.length) {
          Dt();
          const d = s.slice(0, i).concat(s.slice(i + 1));
          t && typeof t == "object" && "val" in t ? t.val = d : window.__hekatanDrawingAuxLines = d, de(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Qt = -1, mt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (wt >= 0) {
        const t = wt, s = Nt;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(t)) ?? false ? (Xn(t), de(`\u{1F5D1} \xC1rea #${t + 1} (shell Q4) borrada`)) : s >= 0 ? (No(t, s), de(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${t + 1} borrado`)) : (Xn(t), de(`\u{1F5D1} Polil\xEDnea #${t + 1} borrada`));
      } else de("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        de("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [t, s] = qe, i = Math.hypot(s[0] - t[0], s[1] - t[1], s[2] - t[2]);
      Math.abs(s[0] - t[0]);
      const d = Math.abs(s[1] - t[1]), m = Math.abs(s[2] - t[2]) < 1e-3 ? "xy" : d < 1e-3 ? "xz" : "yz", x = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, t[0], t[1], t[2], i, x, m), de(`\u2713 C\xEDrculo dibujado en ${m.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${x} segmentos`), qe = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        de("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (qe.length === 2) {
        de("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [t, s, i] = qe, d = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, t, s, i, d), de(`\u2713 Arco dibujado \u2014 ${d} segmentos`), qe = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        de("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = qe;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, t, s), de(`\u2713 Rect\xE1ngulo dibujado \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), qe = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const t = De(o);
      if (!t) return;
      if (Pe.length >= 2 && (Pe = []), Pe.push(t), Pe.length === 1) ve.visible = false, Ze(), de("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [s, i] = Pe;
        ve.geometry.setFromPoints([new F(s[0], s[1], s[2]), new F(i[0], i[1], i[2])]), ve.visible = true;
        const d = Math.hypot(i[0] - s[0], i[1] - s[1], i[2] - s[2]), h = Math.hypot(i[0] - s[0], i[1] - s[1]);
        me.textContent = `${d.toFixed(3)} m`, Ze(), de(`\u{1F4CF} Distancia ${d.toFixed(3)} m  \xB7  \u0394x ${(i[0] - s[0]).toFixed(3)}  \u0394y ${(i[1] - s[1]).toFixed(3)}  \u0394z ${(i[2] - s[2]).toFixed(3)}  \xB7  en planta ${h.toFixed(3)} m`);
      }
      g();
      return;
    }
    if (a === "fillarea") {
      const t = e.points.rawVal, s = ((_n2 = e.polylines) == null ? void 0 : _n2.rawVal) ?? [], i = /* @__PURE__ */ new Map(), d = (C, A) => {
        C !== A && ((i.get(C) ?? i.set(C, /* @__PURE__ */ new Set()).get(C)).add(A), (i.get(A) ?? i.set(A, /* @__PURE__ */ new Set()).get(A)).add(C));
      };
      for (const C of s) for (let A = 0; A + 1 < C.length; A++) d(C[A], C[A + 1]);
      const h = (C, A) => {
        var _a4;
        return !!((_a4 = i.get(C)) == null ? void 0 : _a4.has(A));
      }, m = /* @__PURE__ */ new Set(), x = [], k = [...i.keys()];
      for (const C of k) for (const A of i.get(C)) if (!(A < C)) {
        for (const U of i.get(A)) if (U !== C) for (const Q of i.get(U)) {
          if (Q === C || Q === A || !h(Q, C) || h(C, U) || h(A, Q)) continue;
          const re = [C, A, U, Q].slice().sort((ke, Ke) => ke - Ke).join("-");
          m.has(re) || (m.add(re), x.push([C, A, U, Q]));
        }
      }
      for (const C of k) for (const A of i.get(C)) if (!(A < C)) for (const U of i.get(A)) {
        if (U === C || !h(U, C)) continue;
        const Q = [C, A, U].slice().sort((re, ke) => re - ke).join("-");
        m.has(Q) || (m.add(Q), x.push([C, A, U]));
      }
      const w = ((_q = (_p = (_o = window.__hekatanCadState) == null ? void 0 : _o.get) == null ? void 0 : _p.call(_o)) == null ? void 0 : _q.workPlane) ?? "xy", l = (C) => w === "xy" ? [C[0], C[1]] : w === "xz" ? [C[0], C[2]] : [C[1], C[2]], S = l([n.x, n.y, n.z]), W = (C, A) => {
        let U = false;
        for (let Q = 0, re = A.length - 1; Q < A.length; re = Q++) {
          const ke = A[Q][0], Ke = A[Q][1], Re = A[re][0], st = A[re][1];
          Ke > C[1] != st > C[1] && C[0] < (Re - ke) * (C[1] - Ke) / (st - Ke) + ke && (U = !U);
        }
        return U;
      }, Z = (C) => {
        let A = 0;
        for (let U = 0, Q = C.length - 1; U < C.length; Q = U++) A += (C[Q][0] + C[U][0]) * (C[Q][1] - C[U][1]);
        return Math.abs(A) / 2;
      };
      let b = null, u = 1 / 0;
      for (const C of x) {
        const A = C.map((Q) => l(t[Q]));
        if (!W(S, A)) continue;
        const U = Z(A);
        U < u && (u = U, b = C);
      }
      if (!b) {
        de("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const z = b.slice().sort((C, A) => C - A).join("-"), E = ((_r = e.areas) == null ? void 0 : _r.rawVal) ?? [];
      if (E.some((C) => {
        const A = s[C] ?? [];
        return [...new Set(A)].sort((U, Q) => U - Q).join("-") === z;
      })) {
        de("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      e.polylines.val = [...s, [...b, b[0]]], e.areas.val = [...E, s.length], de(`\u2713 \xC1rea creada por relleno (${b.length} lados).`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        de("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = qe;
      (_t2 = window.__hekatanDrawRectArea) == null ? void 0 : _t2.call(window, t, s), de(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), qe = [];
      return;
    }
    if (a === "polyarea") {
      ge.push([n.x, n.y, n.z]), O.geometry.setFromPoints(ge.map((t) => new F(t[0], t[1], t[2]))), O.visible = ge.length >= 1, de(`\u25B0 \xC1rea libre \u2014 ${ge.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), g();
      return;
    }
    if (a === "plane3") {
      if (qe.push([n.x, n.y, n.z]), qe.length < 3) {
        de(`\u25E3 Plano inclinado \u2014 punto ${qe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [t, s, i] = qe, d = (_u = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _u.call(window, t, s, i);
      de(d ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), qe = [];
      return;
    }
    if (a === "col") {
      Dt();
      const t = n.z, s = bt && bt > 0 ? bt : 3;
      e.points.val = [...e.points.rawVal, [n.x, n.y, t], [n.x, n.y, t + s]];
      const i = e.polylines.rawVal, d = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [d - 2, d - 1], []], bt = 0, de(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        de("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [t, s] = qe, i = bt && bt > 0 ? bt : 3;
      Dt();
      const d = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [t[0], t[1], t[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [t[0], t[1], t[2] + i]];
      const h = e.polylines.rawVal;
      if (h.length - 1, e.polylines.val = [...h.slice(0, -1), ...h[h.length - 1].length > 0 ? [h[h.length - 1]] : [], [d, d + 1, d + 2, d + 3, d], []], e.areas) {
        const m = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, m];
      }
      de(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), qe = [], bt = 0;
      try {
        (_w = window.__hekatanRebuild) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (a === "extp") {
      Dt();
      const t = bt && bt > 0 ? bt : 3, s = n.z;
      e.points.val = [...e.points.rawVal, [n.x, n.y, s], [n.x, n.y, s + t]];
      const i = e.polylines.rawVal, d = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [d - 2, d - 1], []], bt = 0, de(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${t.toFixed(2)}m`);
      try {
        (_x = window.__hekatanRebuild) == null ? void 0 : _x.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const t = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = Mn(n.x, n.y, n.z, t);
      if (!s) {
        de("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, d = e.points.rawVal, h = i[s.polyIdx], m = d[h[s.segIdx]], x = d[h[s.segIdx + 1]];
      if (!m || !x) {
        de("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const k = bt && bt > 0 ? bt : 3;
      Dt();
      const w = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [m[0], m[1], m[2]], [x[0], x[1], x[2]], [x[0], x[1], x[2] + k], [m[0], m[1], m[2] + k]];
      const l = e.polylines.rawVal;
      if (e.polylines.val = [...l.slice(0, -1), ...l[l.length - 1].length > 0 ? [l[l.length - 1]] : [], [w, w + 1, w + 2, w + 3, w], []], e.areas) {
        const S = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, S];
      }
      bt = 0, de(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${k.toFixed(2)}m`);
      try {
        (_y = window.__hekatanRebuild) == null ? void 0 : _y.call(window);
      } catch {
      }
      return;
    }
    if (a === "auxp") {
      const t = window.__hekatanDrawingAuxPoints;
      if (t) {
        const s = t.rawVal ?? t.val ?? [];
        t.val = [...s, [n.x, n.y, n.z]];
      }
      de(`\u2726 Punto auxiliar agregado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        de("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [t, s] = qe, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const k = i.rawVal ?? i.val ?? [];
        i.val = [...k, [t[0], t[1], t[2], s[0], s[1], s[2]]];
      }
      const d = s[0] - t[0], h = s[1] - t[1], m = s[2] - t[2], x = Math.sqrt(d * d + h * h + m * m);
      de(`\u2713 L\xEDnea auxiliar creada \u2014 L=${x.toFixed(2)}m (cyan, no FEM)`), qe = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      Os(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "chaflan") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        de("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = qe, i = window.__hekatanChaflanR ?? 1, d = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_z = window.__hekatanDrawSlabChaflan) == null ? void 0 : _z.call(window, t, s, i, d, 6);
      const h = Math.abs(s[0] - t[0]).toFixed(1), m = Math.abs(s[1] - t[1]).toFixed(1);
      de(`\u2713 Losa con chaflanes dibujada \u2014 ${h}\xD7${m}m, r=${i}m, ${d} seg/chafl\xE1n`), qe = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (X = false, Dt(), e.points.val = [...e.points.rawVal, n.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const t = e.polylines.rawVal, s = t.length - 1, i = t[s] ?? [];
      if (a === "line" && i.length >= 2) {
        de(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_B = window.__hekatanRebuild) == null ? void 0 : _B.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...t.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), de("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_C = window.__hekatanRebuild) == null ? void 0 : _C.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") de(`\u25CF Nodo creado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else if (a === "line") de("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") de("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const t = ((_D = e.polylines) == null ? void 0 : _D.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      de(`\u25A6 \xC1rea \u2014 click ${t.length}/4. Marc\xE1 ${4 - t.length} v\xE9rtice${4 - t.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  M.addEventListener("click", () => Ut()), M.addEventListener("contextmenu", (n) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && ge.length >= 3) {
      n.preventDefault();
      const a = lo();
      de(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), M.addEventListener("pointermove", (n) => {
    var _a3, _b;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(V, o);
    const a = oe();
    if (ie.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const d = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], h = d[d.length - 1] ?? [], m = e.points.rawVal ?? [];
        if (h.length > 0) {
          const x = m[h[h.length - 1]];
          if (x) {
            const k = !!window.__hekatanOrthoMode;
            let w = Ne;
            if (!w && k) {
              const l = Math.abs(t.x - x[0]), S = Math.abs(t.y - x[1]), W = Math.abs(t.z - x[2]);
              w = l >= S && l >= W ? "x" : S >= W ? "y" : "z";
            }
            w === "x" ? t.set(t.x, x[1], x[2]) : w === "y" ? t.set(x[0], t.y, x[2]) : w === "z" && t.set(x[0], x[1], t.z);
          }
        }
      }
      const s = po(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s, { x: n.clientX, y: n.clientY });
      if (i) t.set(i.x, i.y, i.z);
      else {
        const d = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0.5;
        d && h > 0 && (t.x = Math.round(t.x / h) * h, t.y = Math.round(t.y / h) * h, t.z = Math.round(t.z / h) * h);
      }
      ie.geometry.setAttribute("position", new St(t.toArray(), 3));
    }
    g();
  }), M.addEventListener("pointermove", (n) => {
    var _a3;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(V, o);
    let a = false;
    const t = P.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const i = new F(...e.points.rawVal[t[0].index]), d = new F(...s[0].point), h = i.sub(d), m = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      m.transformDirection(H.matrixWorld), Math.abs(h.dot(m)) < 1e-4 && (a = true);
    }
    ie.visible = !a;
  });
  let bo = false, Mo;
  M.addEventListener("pointermove", (n) => {
    var _a3;
    if (!cn) return;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(V, o);
    let a = false;
    const t = P.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const d = new F(...e.points.rawVal[t[0].index]), h = new F(...s[0].point), m = d.sub(h), x = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      x.transformDirection(H.matrixWorld), Math.abs(m.dot(x)) < 1e-4 && (a = true);
    }
    if (a && cn < 5 && (bo = true, f.enabled = false, Mo = t[0].index), !bo || cn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (Mo !== void 0) {
      let d = s[0].point;
      (n.ctrlKey || n.metaKey) && (d = new F(Math.round(d.x), Math.round(d.y), Math.round(d.z))), i[Mo] = d.toArray();
    }
    e.points.val = i;
  }), M.addEventListener("pointerup", () => {
    f.enabled = true, bo = false;
  }), M.addEventListener("contextmenu", (n) => {
    var _a3;
    const o = _(n);
    if (!o) return;
    P.setFromCamera(V, o);
    let a = false;
    const t = P.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const h = new F(...e.points.rawVal[t[0].index]), m = new F(...s[0].point), x = h.sub(m), k = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      k.transformDirection(H.matrixWorld), Math.abs(x.dot(k)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(t[0].index, 1), e.points.val = i, !e.polylines) return;
    const d = e.polylines.rawVal.map((h) => h.filter((m) => m !== t[0].index)).map((h) => h.map((m) => m > t[0].index ? m - 1 : m)).filter((h) => h.length);
    d.push([]), e.polylines.val = d;
  });
}
function Xa(e, r, c) {
  const y = Math.round(14.999999999999998), v = { position: e.position.clone(), quaternion: e.quaternion.clone() }, M = setInterval(P, 1e3 / 30);
  let g = 0;
  function P() {
    g++;
    const V = g / y;
    e.position.lerpVectors(v.position, r.position, V), e.quaternion.slerpQuaternions(v.quaternion, r.quaternion, V), c && c(), g == y && clearInterval(M);
  }
}
function Ya(e, r, c, p) {
  const f = ga(c, e.elements, p);
  return te.derive(() => {
    f.visible = r.shellResults.val != "none";
  }), f;
}
const Za = 6, To = 10, Ua = 0.012;
function qa(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ka(e, r, c, p) {
  if (!c && !p) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && c) {
    const y = c[e];
    if (y && y.has(r)) return y.get(r);
  }
  return null;
}
function Ga(e, r, c, p) {
  const f = new rt(), y = new As();
  y.setColorMap("rainbow");
  const v = new Ot(), M = te.state([]);
  return te.derive(() => {
    var _a2, _b, _c;
    r.deformedShape.val;
    const g = c.val, P = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], V = qa(r.frameResults.val);
    if (f.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), f.clear(), !V || P.length === 0 || g.length === 0) {
      M.val = [];
      return;
    }
    const _ = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, H = (_c = e.deformOutputs) == null ? void 0 : _c.val, xe = [], be = [];
    for (let $ = 0; $ < P.length; $++) {
      if (P[$].length !== 2) continue;
      const pe = Ka(V, $, _, H);
      pe && (xe.push(pe[0], pe[1]), be.push({ idx: $, vals: pe }));
    }
    if (xe.length === 0) {
      M.val = [];
      return;
    }
    const se = Math.min(...xe), D = Math.max(...xe);
    y.setMin(se), y.setMax(D), M.val = xe;
    const oe = [1 / 0, 1 / 0, 1 / 0], B = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of g) for (let ne = 0; ne < 3; ne++) oe[ne] = Math.min(oe[ne], $[ne]), B[ne] = Math.max(B[ne], $[ne]);
    const le = Math.max(B[0] - oe[0], B[1] - oe[1], B[2] - oe[2], 1) * Ua, N = [], I = [], G = [];
    let X = 0;
    for (const { idx: $, vals: ne } of be) {
      const pe = P[$], he = g[pe[0]], ae = g[pe[1]];
      if (!he || !ae) continue;
      const Y = new F(ae[0] - he[0], ae[1] - he[1], ae[2] - he[2]), fe = Y.length();
      if (fe < 1e-10) continue;
      Y.normalize();
      const O = Math.abs(Y.y) < 0.99 ? new F(0, 1, 0) : new F(1, 0, 0), ge = new F().crossVectors(Y, O).normalize(), ve = new F().crossVectors(Y, ge).normalize(), Pe = To + 1, me = Za;
      for (let De = 0; De < Pe; De++) {
        const Ze = De / To, et = he[0] + Y.x * fe * Ze, vt = he[1] + Y.y * fe * Ze, ue = he[2] + Y.z * fe * Ze, L = ne[0] + (ne[1] - ne[0]) * Ze, j = y.getColor(L) ?? new Ot(0, 0, 0);
        v.copy(j).convertSRGBToLinear();
        for (let J = 0; J < me; J++) {
          const ee = J / me * Math.PI * 2, we = Math.cos(ee), _e = Math.sin(ee);
          N.push(et + (ge.x * we + ve.x * _e) * le, vt + (ge.y * we + ve.y * _e) * le, ue + (ge.z * we + ve.z * _e) * le), I.push(v.r, v.g, v.b);
        }
      }
      for (let De = 0; De < To; De++) for (let Ze = 0; Ze < me; Ze++) {
        const et = (Ze + 1) % me, vt = X + De * me + Ze, ue = X + De * me + et, L = X + (De + 1) * me + Ze, j = X + (De + 1) * me + et;
        G.push(vt, ue, j), G.push(vt, j, L);
      }
      X += Pe * me;
    }
    if (N.length === 0) return;
    const T = new Fe();
    T.setAttribute("position", new St(N, 3)), T.setAttribute("color", new St(I, 3)), T.setIndex(G), T.computeVertexNormals();
    const q = new ut({ vertexColors: true, side: Ft }), R = new it(T, q);
    R.frustumCulled = false, f.add(R);
  }), f.__colorMapValues = M, f;
}
function Ha() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Wa = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Ja = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Oa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Mt(e, r = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(r) : e.toFixed(r);
}
const Qa = 16755200, Ms = 56831, ja = 56831, ei = 56831, eo = 65382;
function ti(e) {
  const r = new rt();
  r.name = "__hekatan_hover", r.renderOrder = 99;
  const c = new bn(1, 16, 16), p = new ut({ color: Qa, transparent: true, opacity: 0.85, depthTest: false }), f = new it(c, p);
  f.visible = false, f.renderOrder = 100, r.add(f);
  const y = new Fe(), v = new yt({ color: Ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), M = new jt(y, v);
  M.visible = false, M.renderOrder = 100, r.add(M);
  const g = new ut({ color: Ms, transparent: true, opacity: 0.7, depthTest: false }), P = new it(new xs(1, 1, 1, 12), g);
  P.visible = false, P.renderOrder = 100, r.add(P);
  const V = new Fe(), _ = new ut({ color: ja, transparent: true, opacity: 0.45, side: Ft, depthTest: false }), H = new it(V, _);
  H.visible = false, H.renderOrder = 100, r.add(H);
  const xe = new Fe(), be = new yt({ color: ei, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new jt(xe, be);
  se.visible = false, se.renderOrder = 100, r.add(se);
  const D = new ut({ color: eo, transparent: true, opacity: 0.95, depthTest: false }), oe = new ut({ color: eo, transparent: true, opacity: 0.85, depthTest: false }), B = new xs(1, 1, 1, 12), ie = new ut({ color: eo, transparent: true, opacity: 0.55, side: Ft, depthTest: false }), le = new yt({ color: eo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), N = [];
  window.__hekatanModelSelection = N;
  const I = new rt();
  I.renderOrder = 101, r.add(I);
  const G = document.createElement("div");
  Object.assign(G.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), G.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(G);
  }, 0);
  function X(ue) {
    const L = e.derivedNodes.rawVal;
    return !L || ue < 0 || ue >= L.length ? null : new F(L[ue][0], L[ue][1], L[ue][2]);
  }
  function T(ue, L) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const j = e.getActiveCamera();
    if (!j || !e.mesh) return null;
    const J = e.rendererElm.getBoundingClientRect(), ee = ue - J.left, we = L - J.top, _e = e.derivedNodes.rawVal, ye = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!_e || !ye) return null;
    const Ae = /* @__PURE__ */ new Map(), Te = (Be) => {
      if (Ae.has(Be)) return Ae.get(Be);
      const Le = X(Be);
      if (!Le) return Ae.set(Be, null), null;
      const ze = Le.clone().project(j), Je = (ze.x * 0.5 + 0.5) * J.width, Ce = (-ze.y * 0.5 + 0.5) * J.height, Ne = { x: Je, y: Ce, z: ze.z };
      return Ae.set(Be, Ne), Ne;
    }, He = /* @__PURE__ */ new Set();
    for (const Be of ye) if (Be) for (const Le of Be) He.add(Le);
    const Qe = 8;
    let Ue = -1, ft = Qe;
    for (let Be = 0; Be < _e.length; Be++) {
      if (!He.has(Be)) continue;
      const Le = Te(Be);
      if (!Le || Le.z < -1 || Le.z > 1) continue;
      const ze = Le.x - ee, Je = Le.y - we, Ce = Math.sqrt(ze * ze + Je * Je);
      Ce < ft && (ft = Ce, Ue = Be);
    }
    const We = Ha(), Me = Ja[We.dispUnit] ?? 1e3, Ee = Wa[We.forceUnit] ?? 1;
    if (Ue >= 0) {
      const Be = _e[Ue];
      let Le = `Nodo ${Ue}
(${Be[0].toFixed(3)}, ${Be[1].toFixed(3)}, ${Be[2].toFixed(3)})`;
      const ze = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (ze == null ? void 0 : ze.deformations) {
        const Je = ze.deformations.get(Ue);
        if (Je && (Le += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Le += `
Ux = ${Mt(Je[0] * Me, 3)} ${We.dispUnit}`, Le += `
Uy = ${Mt(Je[1] * Me, 3)} ${We.dispUnit}`, Le += `
Uz = ${Mt(Je[2] * Me, 3)} ${We.dispUnit}`, (Math.abs(Je[3]) > 1e-9 || Math.abs(Je[4]) > 1e-9 || Math.abs(Je[5]) > 1e-9) && (Le += `
Rx = ${Mt(Je[3] * 1e3, 3)} mrad`, Le += `
Ry = ${Mt(Je[4] * 1e3, 3)} mrad`, Le += `
Rz = ${Mt(Je[5] * 1e3, 3)} mrad`)), ze.reactions) {
          const Ce = ze.reactions.get(Ue);
          Ce && (Math.abs(Ce[0]) > 1e-9 || Math.abs(Ce[1]) > 1e-9 || Math.abs(Ce[2]) > 1e-9 || Math.abs(Ce[3]) > 1e-6 || Math.abs(Ce[4]) > 1e-6 || Math.abs(Ce[5]) > 1e-6) && (Le += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Le += `
Fx = ${Mt(Ce[0] * Ee)} ${We.forceUnit}`, Le += `
Fy = ${Mt(Ce[1] * Ee)} ${We.forceUnit}`, Le += `
Fz = ${Mt(Ce[2] * Ee)} ${We.forceUnit}`, (Math.abs(Ce[3]) > 1e-6 || Math.abs(Ce[4]) > 1e-6 || Math.abs(Ce[5]) > 1e-6) && (Le += `
Mx = ${Mt(Ce[3] * Ee)} ${We.forceUnit}\xB7m`, Le += `
My = ${Mt(Ce[4] * Ee)} ${We.forceUnit}\xB7m`, Le += `
Mz = ${Mt(Ce[5] * Ee)} ${We.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ue, info: Le };
    }
    const ct = 5;
    let Ge = -1, at = ct, ht = "frame";
    for (let Be = 0; Be < ye.length; Be++) {
      const Le = ye[Be];
      if (!(!Le || Le.length < 2)) {
        if (Le.length === 2) {
          const ze = Te(Le[0]), Je = Te(Le[1]);
          if (!ze || !Je || ze.z < -1 || ze.z > 1 || Je.z < -1 || Je.z > 1) continue;
          const Ce = ni(ee, we, ze.x, ze.y, Je.x, Je.y);
          Ce < at && (at = Ce, Ge = Be, ht = "frame");
        } else if (Le.length === 3 || Le.length === 4) {
          const ze = [];
          let Je = true;
          for (const Ce of Le) {
            const Ne = Te(Ce);
            if (!Ne || Ne.z < -1 || Ne.z > 1) {
              Je = false;
              break;
            }
            ze.push(Ne);
          }
          if (!Je) continue;
          if (oi(ee, we, ze)) {
            const Ne = ze.reduce((dt, Pt) => dt + Pt.z, 0) / ze.length * 1e-3;
            Ne < at && (at = Ne, Ge = Be, ht = "shell");
          }
        } else if (Le.length === 8) {
          const ze = [];
          let Je = true;
          for (const Ve of Le) {
            const tt = Te(Ve);
            if (!tt || tt.z < -1 || tt.z > 1) {
              Je = false;
              break;
            }
            ze.push(tt);
          }
          if (!Je) continue;
          const Ce = Math.min(...ze.map((Ve) => Ve.x)), Ne = Math.max(...ze.map((Ve) => Ve.x)), dt = Math.min(...ze.map((Ve) => Ve.y)), Pt = Math.max(...ze.map((Ve) => Ve.y));
          if (ee >= Ce && ee <= Ne && we >= dt && we <= Pt) {
            const tt = ze.reduce((_t, kt) => _t + kt.z, 0) / ze.length * 1e-3;
            tt < at && (at = tt, Ge = Be, ht = "solid");
          }
        }
      }
    }
    if (Ge >= 0) {
      const Be = ye[Ge];
      let ze = `${ht === "frame" ? "Frame" : ht === "shell" ? "Shell" : "Solid"} ${Ge}`;
      const Je = (_e2 = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Ce = (_g = (_f = Je == null ? void 0 : Je.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, Ge);
      if (Ce) {
        Ce.name && (ze += `
  \u{1F4CB} ${Ce.name}`), Ce.shape && (ze += `
  Shape: ${Ce.shape}`);
        const Ne = /concrete|hormig|rect.*sólida/i.test(Ce.shape || ""), dt = Ne ? 100 : 1e3, Pt = Ne ? "cm" : "mm", Ve = (_t) => {
          const kt = _t * dt;
          return Math.abs(kt - Math.round(kt)) < 0.05 ? `${Math.round(kt)}` : `${kt.toFixed(1)}`;
        }, tt = [];
        if (Ce.D != null && tt.push(`D=${Ve(Ce.D)}`), Ce.B != null && tt.push(`B=${Ve(Ce.B)}`), Ce.TF != null && tt.push(`TF=${Ve(Ce.TF)}`), Ce.TW != null && tt.push(`TW=${Ve(Ce.TW)}`), Ce.t != null && tt.push(`t=${Ve(Ce.t)}`), tt.length && (ze += `
  Dim: ${tt.join(" ")} ${Pt}`), Ce.material) {
          let _t = Ce.material;
          Ce.fillMaterial && (_t += ` + FILL "${Ce.fillMaterial}"`), ze += `
  Mat: ${_t}`;
        }
      } else {
        const Ne = (_i = (_h = Je == null ? void 0 : Je.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, Ge), dt = (_k = (_j = Je == null ? void 0 : Je.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, Ge);
        Ne ? (ze += `
  ${Ne}`, dt && !Ne.includes(dt) && (ze += `  (${dt})`)) : dt && (ze += `
  Material: ${dt}`);
      }
      if (ze += `
nodos: [${Be.join(", ")}]`, ht === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Ne = e.mesh.analyzeOutputs.rawVal, dt = Oa[We.stressUnit] ?? 1, Pt = [["bendingXX", "Mxx", Ee, `${We.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ee, `${We.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ee, `${We.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ee, `${We.forceUnit}/m`], ["membraneYY", "Nyy", Ee, `${We.forceUnit}/m`], ["membraneXY", "Nxy", Ee, `${We.forceUnit}/m`], ["shearX", "Qx", Ee, `${We.forceUnit}/m`], ["shearY", "Qy", Ee, `${We.forceUnit}/m`], ["vonMises", "\u03C3VM", dt, We.stressUnit], ["pressure", "p", dt, We.stressUnit]], Ve = [];
        for (const [tt, _t, kt, Kt] of Pt) {
          const tn = Ne == null ? void 0 : Ne[tt];
          if (tn && tn instanceof Map) {
            const mt = tn.get(Ge);
            if (mt != null) {
              if (typeof mt == "number") Ve.push(`${_t} = ${Mt(mt * kt, 3)} ${Kt}`);
              else if (Array.isArray(mt)) {
                let wt = mt[0];
                for (const Nt of mt) Math.abs(Nt) > Math.abs(wt) && (wt = Nt);
                Ve.push(`${_t} = ${Mt(wt * kt, 3)} ${Kt}`);
              }
            }
          }
        }
        Ve.length > 0 && (ze += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ve.slice(0, 8).join(`
`));
      }
      if (ht === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Ne = e.mesh.deformOutputs.rawVal, dt = e.mesh.elementInputs.rawVal, Pt = Ne == null ? void 0 : Ne.deformations;
        if (Pt && Be.length === 2) {
          const Ve = Pt.get(Be[0]), tt = Pt.get(Be[1]), _t = _e[Be[0]], kt = _e[Be[1]];
          if (Ve && tt && _t && kt) {
            const Kt = kt[0] - _t[0], tn = kt[1] - _t[1], mt = kt[2] - _t[2], wt = Math.sqrt(Kt * Kt + tn * tn + mt * mt);
            if (wt > 1e-9) {
              const Nt = Kt / wt, Qt = tn / wt, Xe = mt / wt, Xt = (tt[0] - Ve[0]) * Nt + (tt[1] - Ve[1]) * Qt + (tt[2] - Ve[2]) * Xe, Vt = ((_n = dt.elasticities) == null ? void 0 : _n.get(Ge)) ?? 0, fn = ((_o = dt.areas) == null ? void 0 : _o.get(Ge)) ?? 0, In = ((_p = dt.momentsOfInertiaY) == null ? void 0 : _p.get(Ge)) ?? 0, Gt = ((_q = dt.momentsOfInertiaZ) == null ? void 0 : _q.get(Ge)) ?? 0, hn = ((_r = dt.torsionalConstants) == null ? void 0 : _r.get(Ge)) ?? 0, Ht = ((_s2 = dt.shearModuli) == null ? void 0 : _s2.get(Ge)) ?? Vt / 2.6, Rn = Vt * fn * (Xt / wt), Yt = (tt[3] - Ve[3]) * Nt + (tt[4] - Ve[4]) * Qt + (tt[5] - Ve[5]) * Xe, sn = Ht * hn * (Yt / wt), Mn = tt[4] - Ve[4], Dn = tt[5] - Ve[5], Bn = Vt * In * Mn / wt, Nn = Vt * Gt * Dn / wt;
              ze += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, ze += `
L = ${Mt(wt, 3)} m`, ze += `
\u0394L = ${Mt(Xt * Me, 3)} ${We.dispUnit}`, ze += `
\u03B5 = ${Mt(Xt / wt, 6)}`, Math.abs(Rn) > 1e-6 && (ze += `
N \u2248 ${Mt(Rn * Ee)} ${We.forceUnit}`), Math.abs(sn) > 1e-6 && (ze += `
T \u2248 ${Mt(sn * Ee)} ${We.forceUnit}\xB7m`), Math.abs(Bn) > 1e-6 && (ze += `
My \u2248 ${Mt(Bn * Ee)} ${We.forceUnit}\xB7m`), Math.abs(Nn) > 1e-6 && (ze += `
Mz \u2248 ${Mt(Nn * Ee)} ${We.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: ht, idx: Ge, info: ze };
    }
    return null;
  }
  function q(ue, L, j) {
    var _a2, _b, _c;
    if (f.visible = false, M.visible = false, P.visible = false, H.visible = false, se.visible = false, !ue || !e.mesh) {
      G.style.display = "none", e.render();
      return;
    }
    const J = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (ue.type === "node") {
      const ye = X(ue.idx);
      if (ye) {
        const Ae = e.derivedNodes.rawVal ?? [];
        let Te = 1;
        if (Ae.length >= 2) {
          let Ue = [1 / 0, 1 / 0, 1 / 0], ft = [-1 / 0, -1 / 0, -1 / 0];
          for (const We of Ae) for (let Me = 0; Me < 3; Me++) We[Me] < Ue[Me] && (Ue[Me] = We[Me]), We[Me] > ft[Me] && (ft[Me] = We[Me]);
          Te = Math.max(ft[0] - Ue[0], ft[1] - Ue[1], ft[2] - Ue[2], 0.1);
        }
        const He = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Qe = 0.021 * Te * He;
        f.position.copy(ye), f.scale.setScalar(Qe), f.visible = true;
      }
    } else if (ue.type === "frame" && J) {
      const ye = J[ue.idx], Ae = X(ye[0]), Te = X(ye[1]);
      if (Ae && Te) {
        const He = Ae.clone().add(Te).multiplyScalar(0.5), Qe = Te.clone().sub(Ae), Ue = Qe.length(), Me = e.getActiveCamera().position.distanceTo(He) * 35e-4;
        P.position.copy(He);
        const Ee = new F(0, 1, 0), ct = Ee.clone().cross(Qe).normalize(), Ge = Ee.angleTo(Qe);
        P.quaternion.setFromAxisAngle(ct, Ge), P.scale.set(Me, Ue, Me), P.visible = true;
      }
    } else if (ue.type === "shell" && J) {
      const ye = J[ue.idx], Ae = [], Te = [];
      for (const He of ye) {
        const Qe = X(He);
        if (!Qe) return;
        Ae.push(Qe.x, Qe.y, Qe.z);
      }
      ye.length === 4 ? Te.push(0, 1, 2, 0, 2, 3) : ye.length === 3 && Te.push(0, 1, 2), V.setAttribute("position", new St(Ae, 3)), V.setIndex(Te), V.computeVertexNormals(), H.visible = true;
    } else if (ue.type === "solid" && J) {
      const ye = J[ue.idx], Ae = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Te = [];
      for (const [He, Qe] of Ae) {
        const Ue = X(ye[He]), ft = X(ye[Qe]);
        Ue && ft && Te.push(Ue.x, Ue.y, Ue.z, ft.x, ft.y, ft.z);
      }
      xe.setAttribute("position", new St(Te, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      G.style.display = "none", e.render();
      return;
    }
    G.textContent = ue.info, G.style.whiteSpace = "pre-line", G.style.display = "block";
    const we = e.rendererElm.getBoundingClientRect(), _e = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? we;
    G.style.left = `${L - _e.left}px`, G.style.top = `${j - _e.top}px`, e.render();
  }
  let R = "", $ = 0, ne = 0;
  const pe = window.__hekatanHoverDebug ?? false, he = (ue) => {
    $ && cancelAnimationFrame($), $ = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const L = T(ue.clientX, ue.clientY);
      if (pe && ne < 5) {
        const J = e.derivedNodes.rawVal, ee = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${ue.clientX}, ${ue.clientY}) nodes=${(J == null ? void 0 : J.length) ?? 0} elems=${(ee == null ? void 0 : ee.length) ?? 0} hover=`, L), ne++;
      }
      const j = L ? `${L.type}:${L.idx}` : "";
      if (j !== R) R = j, q(L, ue.clientX, ue.clientY);
      else if (L) {
        const J = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        G.style.left = `${ue.clientX - J.left}px`, G.style.top = `${ue.clientY - J.top}px`;
      }
    });
  };
  let ae = null;
  const Y = () => {
    R = "", f.visible = false, M.visible = false, P.visible = false, H.visible = false, se.visible = false, G.style.display = "none", e.render();
  }, fe = (ue) => {
    const L = e.rendererElm.getBoundingClientRect(), j = ue.clientX - L.left, J = ue.clientY - L.top;
    (j < -2 || J < -2 || j > L.width + 2 || J > L.height + 2) && (ae && clearTimeout(ae), ae = window.setTimeout(Y, 200));
  }, O = () => {
    ae && (clearTimeout(ae), ae = null);
  };
  e.rendererElm.addEventListener("pointermove", he), e.rendererElm.addEventListener("pointerleave", fe), e.rendererElm.addEventListener("pointerenter", O);
  function ge() {
    var _a2, _b, _c;
    const ue = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return ue === "select" || ue === "none" || !ue;
  }
  let ve = null;
  e.rendererElm.addEventListener("pointerdown", (ue) => {
    ue.button === 0 && (ve = { x: ue.clientX, y: ue.clientY });
  }), e.rendererElm.addEventListener("pointerup", (ue) => {
    if (ue.button !== 0 || !ve) return;
    const L = ue.clientX - ve.x, j = ue.clientY - ve.y;
    if (ve = null, L * L + j * j > 9 || !ge()) return;
    const J = T(ue.clientX, ue.clientY);
    J ? (et({ type: J.type, idx: J.idx }, ue.shiftKey), Ze()) : vt();
  }), window.addEventListener("keydown", (ue) => {
    if (ue.key !== "Escape" || !N.length) return;
    const L = document.activeElement, j = !!L && (L.id === "hk3-cmd-input" || L.id === "hk-dyn-input") && L.value === "";
    L && (L.tagName === "INPUT" || L.tagName === "TEXTAREA" || L.isContentEditable) && !j || vt();
  }, { capture: true });
  function Pe() {
    for (const ue of I.children.slice()) {
      I.remove(ue);
      const L = ue.geometry;
      L && L !== c && L !== B && L.dispose();
    }
  }
  const me = (ue) => {
    var _a2;
    const L = e.getActiveCamera(), j = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return L.isOrthographicCamera ? (L.top - L.bottom) / (L.zoom || 1) / j : 2 * L.position.distanceTo(ue) * Math.tan((L.fov || 50) * Math.PI / 180 / 2) / j;
  };
  function De(ue, L) {
    var _a2, _b;
    const j = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (ue.type === "node") {
      const J = X(ue.idx);
      if (!J) return;
      const ee = new it(c, D);
      ee.position.copy(J), ee.scale.setScalar(Math.max(1e-4, 7 * me(J))), ee.renderOrder = 101, I.add(ee);
    } else if (ue.type === "frame" && j) {
      const J = j[ue.idx], ee = X(J[0]), we = X(J[1]);
      if (!ee || !we) return;
      const _e = ee.clone().add(we).multiplyScalar(0.5), ye = we.clone().sub(ee), Ae = ye.length(), Te = e.getActiveCamera().position.distanceTo(_e), He = new it(B, oe);
      He.position.copy(_e);
      const Qe = new F(0, 1, 0);
      He.quaternion.setFromAxisAngle(Qe.clone().cross(ye).normalize(), Qe.angleTo(ye)), He.scale.set(Te * 35e-4, Ae, Te * 35e-4), He.renderOrder = 101, I.add(He);
    } else if (ue.type === "shell" && j) {
      const J = j[ue.idx], ee = [], we = [];
      for (const Ae of J) {
        const Te = X(Ae);
        if (!Te) return;
        ee.push(Te.x, Te.y, Te.z);
      }
      J.length === 4 ? we.push(0, 1, 2, 0, 2, 3) : J.length === 3 && we.push(0, 1, 2);
      const _e = new Fe();
      _e.setAttribute("position", new St(ee, 3)), _e.setIndex(we), _e.computeVertexNormals();
      const ye = new it(_e, ie);
      ye.renderOrder = 101, I.add(ye);
    } else if (ue.type === "solid" && j) {
      const J = j[ue.idx], ee = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], we = [];
      for (const [Ae, Te] of ee) {
        const He = X(J[Ae]), Qe = X(J[Te]);
        He && Qe && we.push(He.x, He.y, He.z, Qe.x, Qe.y, Qe.z);
      }
      const _e = new Fe();
      _e.setAttribute("position", new St(we, 3));
      const ye = new jt(_e, le);
      ye.renderOrder = 101, I.add(ye);
    }
  }
  function Ze() {
    if (Pe(), !N.length || !e.mesh) {
      e.render();
      return;
    }
    const ue = e.derivedNodes.rawVal ?? [];
    if (ue.length >= 2) {
      const L = [1 / 0, 1 / 0, 1 / 0], j = [-1 / 0, -1 / 0, -1 / 0];
      for (const J of ue) for (let ee = 0; ee < 3; ee++) J[ee] < L[ee] && (L[ee] = J[ee]), J[ee] > j[ee] && (j[ee] = J[ee]);
      Math.max(j[0] - L[0], j[1] - L[1], j[2] - L[2], 0.1);
    }
    for (const L of N) De(L);
    e.render();
  }
  function et(ue, L) {
    const j = N.findIndex((J) => J.type === ue.type && J.idx === ue.idx);
    j >= 0 ? N.splice(j, 1) : L || N.push(ue), N.length && N[N.length - 1];
  }
  function vt() {
    N.length = 0, Ze();
  }
  return te.derive(() => {
    e.derivedNodes.val, N.length && Ze();
  }), r;
}
function ni(e, r, c, p, f, y) {
  const v = f - c, M = y - p, g = v * v + M * M;
  if (g < 1e-9) {
    const be = e - c, se = r - p;
    return Math.sqrt(be * be + se * se);
  }
  let P = ((e - c) * v + (r - p) * M) / g;
  P = Math.max(0, Math.min(1, P));
  const V = c + P * v, _ = p + P * M, H = e - V, xe = r - _;
  return Math.sqrt(H * H + xe * xe);
}
function oi(e, r, c) {
  let p = false;
  for (let f = 0, y = c.length - 1; f < c.length; y = f++) {
    const v = c[f].x, M = c[f].y, g = c[y].x, P = c[y].y;
    M > r != P > r && e < (g - v) * (r - M) / (P - M + 1e-12) + v && (p = !p);
  }
  return p;
}
const si = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, ai = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, rn = 1e-3;
function Vn(e, r) {
  return r === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : r === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function ii(e, r) {
  const c = Math.abs(r[0] - e[0]);
  return Math.abs(r[1] - e[1]) < rn ? { plano: "XZ", en: e[1] } : c < rn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function li(e, r) {
  var _a2, _b;
  let c = null, p = { plano: "XZ", en: 0 };
  const f = () => {
    var _a3, _b2;
    const B = ((_a3 = r == null ? void 0 : r.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = r == null ? void 0 : r.frameResults) == null ? void 0 : _b2.val);
    return !B || B === "none" ? null : String(B).replace(/^contour:/, "");
  }, y = (B) => {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], N = /* @__PURE__ */ new Set();
    for (const I of le) {
      if (I.length !== 2) continue;
      const G = ie[I[0]], X = ie[I[1]];
      if (!G || !X) continue;
      const T = Vn(G, B), q = Vn(X, B);
      Math.abs(T.fuera - q.fuera) < rn && N.add(Math.round(T.fuera * 1e3) / 1e3);
    }
    return [...N].sort((I, G) => I - G);
  };
  function v(B) {
    var _a3, _b2;
    if (B == null ? void 0 : B.plano) p = { plano: B.plano, en: B.en ?? y(B.plano)[0] ?? 0 };
    else {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((G) => G.type === "frame"), N = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], I = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      le && I[le.idx] && N[I[le.idx][0]] && N[I[le.idx][1]] ? p = ii(N[I[le.idx][0]], N[I[le.idx][1]]) : p = { plano: "XZ", en: y("XZ")[0] ?? 0 };
    }
    c || M(), c.hidden = false, g();
  }
  function M() {
    c = document.createElement("div"), c.id = "hk-diagrama-2d", c.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), c.innerHTML = `
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
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(c), c.querySelector(".hk-d2-x").addEventListener("click", () => {
      c.hidden = true;
    });
    const B = c.querySelector(".hk-d2-plano"), ie = c.querySelector(".hk-d2-en");
    B.addEventListener("change", () => {
      p = { plano: B.value, en: y(B.value)[0] ?? 0 }, g();
    }), ie.addEventListener("change", () => {
      p.en = Number(ie.value), g();
    });
    const le = (G) => {
      const X = y(p.plano), T = X.findIndex((R) => Math.abs(R - p.en) < rn), q = Math.max(0, Math.min(X.length - 1, (T < 0 ? 0 : T) + G));
      X.length && (p.en = X[q], g());
    };
    c.querySelector(".hk-d2-ant").addEventListener("click", () => le(-1)), c.querySelector(".hk-d2-sig").addEventListener("click", () => le(1));
    const N = c.querySelector(".hk-d2-bar");
    let I = null;
    N.addEventListener("pointerdown", (G) => {
      if (G.target.closest("select,button")) return;
      const X = c.getBoundingClientRect();
      I = { x: G.clientX, y: G.clientY, l: X.left, t: X.top }, c.style.transform = "none", c.style.left = X.left + "px", c.style.top = X.top + "px";
    }), window.addEventListener("pointermove", (G) => {
      !I || !c || (c.style.left = I.l + G.clientX - I.x + "px", c.style.top = I.t + G.clientY - I.y + "px");
    }), window.addEventListener("pointerup", () => {
      I = null;
    }), new ResizeObserver(() => {
      c && !c.hidden && g();
    }).observe(c);
  }
  function g() {
    var _a3, _b2, _c, _d, _e2, _f, _g, _h;
    if (!c || c.hidden) return;
    const B = new Set(_ && !_.hidden && H >= 0 ? be(H) : []), ie = c.querySelector(".hk-d2-svg"), le = c.querySelector(".hk-d2-tit"), N = c.querySelector(".hk-d2-pie"), I = c.querySelector(".hk-d2-plano"), G = c.querySelector(".hk-d2-en");
    I.value = p.plano;
    const X = y(p.plano), T = p.plano === "XZ" ? "y" : p.plano === "YZ" ? "x" : "z", q = p.plano === "XY" ? "Planta" : "P\xF3rtico";
    G.innerHTML = X.map((Me, Ee) => `<option value="${Me}" ${Math.abs(Me - p.en) < rn ? "selected" : ""}>${q} ${Ee + 1} \xB7 ${T} = ${Me.toFixed(2)} m</option>`).join("");
    const R = f(), $ = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ne = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], pe = R ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[R] : null;
    ie.innerHTML = "";
    const he = ie.clientWidth || 880, ae = ie.clientHeight || 480, Y = [];
    if (ne.forEach((Me, Ee) => {
      if (Me.length !== 2) return;
      const ct = $[Me[0]], Ge = $[Me[1]];
      if (!ct || !Ge) return;
      const at = Vn(ct, p.plano), ht = Vn(Ge, p.plano);
      Math.abs(at.fuera - p.en) < rn && Math.abs(ht.fuera - p.en) < rn && Y.push({ i: Ee, a: at, b: ht });
    }), !Y.length) {
      N.textContent = "No hay barras en este plano.", le.textContent = "";
      return;
    }
    let fe = 1 / 0, O = -1 / 0, ge = 1 / 0, ve = -1 / 0;
    for (const Me of Y) for (const Ee of [Me.a, Me.b]) fe = Math.min(fe, Ee.u), O = Math.max(O, Ee.u), ge = Math.min(ge, Ee.v), ve = Math.max(ve, Ee.v);
    const Pe = O - fe || 1, me = ve - ge || 1, De = 0.12 * Math.max(Pe, me), Ze = 46, et = Math.min((he - 2 * Ze) / (Pe + 2 * De), (ae - 2 * Ze) / (me + 2 * De)), vt = (he - Pe * et) / 2, ue = (ae - me * et) / 2, L = (Me) => vt + (Me - fe) * et, j = (Me) => ae - (ue + (Me - ge) * et), J = "http://www.w3.org/2000/svg", ee = (Me, Ee, ct) => {
      const Ge = document.createElementNS(J, Me);
      for (const at in Ee) Ge.setAttribute(at, String(Ee[at]));
      return ct != null && (Ge.textContent = ct), ie.appendChild(Ge), Ge;
    }, we = /* @__PURE__ */ new Map();
    for (const Me of Y) {
      const Ee = ((_h = (_g = (_f = (_e2 = e.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Me.i)) ?? 0, ct = Vn(Ls(R ?? "normals", $s($[ne[Me.i][0]], $[ne[Me.i][1]], Ee)), p.plano), Ge = Math.hypot(ct.u, ct.v);
      we.set(Me.i, Ge > 0.3 ? [ct.u / Ge, -ct.v / Ge] : null);
    }
    const _e = Y.filter((Me) => !we.get(Me.i)).length;
    let ye = 0;
    if (pe) for (const Me of Y) {
      if (!we.get(Me.i)) continue;
      const Ee = pe instanceof Map ? pe.get(Me.i) : pe[Me.i];
      Ee && (ye = Math.max(ye, Math.abs(Ee[0] ?? 0), Math.abs(Ee[1] ?? 0)));
    }
    const Ae = 0.12 * Math.max(Pe, me) * et, Te = ye > 0 ? Ae / ye : 0, He = R === "bendingsY" || R === "bendingsZ", Qe = (Me) => Math.abs(Me) >= 100 ? Me.toFixed(1) : Math.abs(Me) >= 10 ? Me.toFixed(2) : Me.toFixed(3), Ue = [];
    for (const Me of Y) {
      const Ee = L(Me.a.u), ct = j(Me.a.v), Ge = L(Me.b.u), at = j(Me.b.v), ht = we.get(Me.i), [Be, Le] = ht ?? [0, 0], ze = pe && ht ? pe instanceof Map ? pe.get(Me.i) : pe[Me.i] : null, [Je, Ce] = ze ? Lo(R, ze) : [0, 0];
      if (ze && Te > 0) {
        const Ve = [Ee + Be * Je * Te * 1, ct + Le * Je * Te * 1], tt = [Ge + Be * Ce * Te * 1, at + Le * Ce * Te * 1], Kt = Je + Ce >= 0 ? "#3fa7d6" : "#d9534f";
        ee("polygon", { points: `${Ee},${ct} ${Ve[0]},${Ve[1]} ${tt[0]},${tt[1]} ${Ge},${at}`, fill: Kt, "fill-opacity": 0.38, stroke: Kt, "stroke-width": 1.2 }), Ue.push({ x: Ve[0] + Be * 12, y: Ve[1] + Le * 12, t: Qe(Je), peso: Math.abs(Je) }), Ue.push({ x: tt[0] + Be * 12, y: tt[1] + Le * 12, t: Qe(Ce), peso: Math.abs(Ce) });
      }
      ee("line", { x1: Ee, y1: ct, x2: Ge, y2: at, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), B.has(Me.i) && ee("line", { x1: Ee, y1: ct, x2: Ge, y2: at, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const Ne = ee("line", { x1: Ee, y1: ct, x2: Ge, y2: at, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      Ne.addEventListener("click", () => se(Me.i));
      const dt = document.createElementNS(J, "title");
      dt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Ne.appendChild(dt);
    }
    for (const Me of Y) for (const Ee of [Me.a, Me.b]) p.plano !== "XY" && Math.abs(Ee.v - ge) < rn && ee("rect", { x: L(Ee.u) - 6, y: j(Ee.v), width: 12, height: 7, fill: "#b03a3a" });
    const ft = [];
    Ue.sort((Me, Ee) => Ee.peso - Me.peso);
    for (const Me of Ue) Me.peso < 0.02 * ye || ft.some((Ee) => Math.hypot(Ee.x - Me.x, Ee.y - Me.y) < 34) || (ft.push(Me), ee("text", { x: Me.x, y: Me.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Me.t));
    const We = R ? si[R] ?? R : "sin resultado";
    le.textContent = `${We} \xB7 ${p.plano === "XY" ? "planta" : "alzado"} ${p.plano} en ${T} = ${p.en.toFixed(2)} m`, N.textContent = R ? `${Y.length} barras en el plano \xB7 m\xE1ximo ${Qe(ye)} ${ai[R] ?? ""}` + (He ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (_e ? ` \xB7 ${_e} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const P = () => {
    try {
      g();
    } catch {
    }
  };
  (r == null ? void 0 : r.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    r.frameResults.val, P();
  }));
  let V = null;
  setInterval(() => {
    var _a3, _b2;
    const B = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, ie = (_b2 = r == null ? void 0 : r.frameResults) == null ? void 0 : _b2.rawVal, le = [B, ie];
    if (!(V && V[0] === B && V[1] === ie)) {
      V = le, P();
      try {
        oe();
      } catch {
      }
    }
  }, 400);
  let _ = null, H = -1, xe = "12";
  function be(B) {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], N = /* @__PURE__ */ new Map();
    le.forEach((T, q) => {
      if (T.length === 2) for (const R of T) N.has(R) || N.set(R, []), N.get(R).push(q);
    });
    const I = (T) => {
      const q = ie[le[T][0]], R = ie[le[T][1]], $ = [R[0] - q[0], R[1] - q[1], R[2] - q[2]], ne = Math.hypot($[0], $[1], $[2]) || 1;
      return $.map((pe) => pe / ne);
    }, G = (T, q) => {
      const R = I(T), $ = I(q);
      return Math.abs(R[0] * $[0] + R[1] * $[1] + R[2] * $[2]) > 0.9999;
    }, X = [B];
    for (const T of [0, 1]) {
      let q = B, R = le[B][T];
      for (let $ = 0; $ < 500; $++) {
        const ne = (N.get(R) ?? []).filter((he) => he !== q);
        if (ne.length !== 1 || !G(q, ne[0])) break;
        const pe = ne[0];
        T === 0 ? X.unshift(pe) : X.push(pe), R = le[pe][0] === R ? le[pe][1] : le[pe][0], q = pe;
      }
    }
    return X;
  }
  function se(B) {
    if (B == null) {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((N) => N.type === "frame");
      if (!le) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      B = le.idx;
    }
    H = B, _ || (_ = document.createElement("div"), _.id = "hk-diagrama-barra", _.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), _.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(_), _.querySelector(".hk-b-x").addEventListener("click", () => {
      _.hidden = true, D(), g();
    }), _.querySelector(".hk-b-pl").addEventListener("change", (ie) => {
      xe = ie.target.value, oe();
    })), _.hidden = false, D(), oe(), g();
  }
  function D() {
    if (!c || !_) return;
    const B = window.innerWidth, ie = Math.min(560, Math.round(B * 0.4));
    _.style.width = ie + "px", !_.hidden && !c.hidden ? (c.style.transform = "none", c.style.left = "12px", c.style.width = B - ie - 36 + "px", _.style.top = c.getBoundingClientRect().top + "px") : c.hidden || (c.style.left = "50%", c.style.transform = "translateX(-50%)", c.style.width = "min(900px,92vw)");
  }
  function oe() {
    var _a3, _b2, _c;
    if (!_ || _.hidden || H < 0) return;
    const B = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ie = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], le = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!ie[H]) return;
    const N = be(H), I = [];
    let G = 0, X = -1;
    N.forEach((O, ge) => {
      const [ve, Pe] = ie[O], me = ge === 0 ? N.length > 1 && ie[N[1]].includes(ve) : ve !== X, De = me ? Pe : ve, Ze = me ? ve : Pe, et = Math.hypot(B[Ze][0] - B[De][0], B[Ze][1] - B[De][1], B[Ze][2] - B[De][2]);
      I.push({ x: G, e: O, fin: me ? 1 : 0 }), G += et, I.push({ x: G, e: O, fin: me ? 0 : 1 }), X = Ze;
    });
    const T = G, q = (O, ge) => {
      const ve = le[O], Pe = ve ? ve instanceof Map ? ve.get(ge.e) : ve[ge.e] : null;
      return Pe ? Lo(O, Pe)[ge.fin] : 0;
    }, R = B[ie[N[0]][0]], $ = (O) => O.toFixed(2);
    _.querySelector(".hk-b-tit").textContent = "L = " + T.toFixed(2) + " m \xB7 " + N.length + " tramo(s) \xB7 desde (" + $(R[0]) + ", " + $(R[1]) + ", " + $(R[2]) + ")";
    const ne = xe === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], pe = _.querySelector(".hk-b-cuerpo");
    pe.innerHTML = "";
    const he = Math.max(300, pe.clientWidth), ae = 124, Y = 46, fe = (ae - 14) / 2;
    for (const [O, ge, ve, Pe] of ne) {
      const me = I.map((ye) => q(O, ye)), De = Math.max(...me), Ze = Math.min(...me), et = Math.max(Math.abs(De), Math.abs(Ze)) || 1, vt = (ye) => Y + ye / (T || 1) * (he - 2 * Y), ue = (ye) => fe + (Pe ? 1 : -1) * (ye / et) * (fe - 16), L = (ye) => Math.abs(ye) >= 100 ? ye.toFixed(1) : Math.abs(ye) >= 10 ? ye.toFixed(2) : ye.toFixed(3);
      let j = vt(0) + "," + fe + " ";
      I.forEach((ye, Ae) => {
        j += vt(ye.x) + "," + ue(me[Ae]) + " ";
      }), j += vt(T) + "," + fe;
      const J = me.indexOf(De), ee = me.indexOf(Ze), we = (ye, Ae) => {
        const Te = ue(me[ye]) + (ue(me[ye]) < fe ? -5 : 13);
        return '<text x="' + vt(I[ye].x) + '" y="' + Te + '" text-anchor="middle" fill="' + Ae + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + L(me[ye]) + "</text>";
      }, _e = Pe ? "#d9534f" : "#3fa7d6";
      pe.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + ge + ' <span style="color:#6f7d90;font-weight:400">(' + ve + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + L(De) + " \xB7 m\xEDn " + L(Ze) + (Pe ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + he + '" height="' + ae + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + Y + '" y1="' + fe + '" x2="' + (he - Y) + '" y2="' + fe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + j + '" fill="' + _e + '" fill-opacity=".35" stroke="' + _e + '" stroke-width="1.4"/>' + we(0, "#f2f5fa") + we(I.length - 1, "#f2f5fa") + (J > 0 && J < I.length - 1 ? we(J, "#8fd3ff") : "") + (ee > 0 && ee < I.length - 1 && ee !== J ? we(ee, "#ff9f9a") : "") + '<text x="' + Y + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (he - Y) + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + T.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = se, window.__hekatanDiagrama2D = v, { abrir: v, abrirBarra: se };
}
function _s(e, r = 8) {
  const c = document.createElement("div");
  c.id = "legend", c.style.setProperty("--legend-n", String(r)), setTimeout(() => {
    te.derive(() => {
      io.val, c.style.background = xa();
    });
  });
  const p = document.createElement("div");
  p.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", c.appendChild(p), setTimeout(() => {
    te.derive(() => {
      p.textContent = Io.val ? `[${Io.val}]` : "";
    });
  });
  const f = Array.from({ length: r + 1 }, (g, P) => P / r).reverse();
  let y, v;
  f.forEach((g, P) => {
    y = document.createElement("div"), y.id = `marker-${P}`, y.className = "marker", y.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", v = document.createElement("p"), v.id = `marker-text-${P}`, y.append(v), c.append(y);
  });
  const M = [];
  return c.querySelectorAll("p").forEach((g) => M.push(g)), setTimeout(() => {
    te.derive(() => {
      f.forEach((g, P) => {
        const V = M[P];
        V && (V.innerText = ri(e.val, g).toString());
      });
    });
  }), c;
}
function ri(e, r) {
  const c = Ln.val;
  if (c) return ks(c[0] + r * (c[1] - c[0]));
  const p = e.filter((v) => Number.isFinite(v));
  if (p.length === 0) return "0";
  const [f, y] = Ro(p);
  return ks(f + r * (y - f));
}
function ks(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const r = Math.abs(e);
  return r < 1e-3 || r >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function vi({ mesh: e, settingsObj: r, drawingObj: c, objects3D: p, solids: f }) {
  ma.DEFAULT_UP = new F(0, 0, 1);
  const y = document.createElement("div"), v = new pa(), M = new ua(45, 1, 0.1, 2 * 1e6), g = new fa(-10, 10, 10, -10, -1e3, 2e6);
  let P = M;
  const V = new ha({ antialias: true });
  V.localClippingEnabled = true;
  const _ = new gs(M, V.domElement);
  _.enableDamping = true, _.dampingFactor = 0.1, _.screenSpacePanning = true, _.zoomSpeed = 0.8, _.panSpeed = 1.2, _.rotateSpeed = 0.9, _.keyPanSpeed = 12, _.listenToKeyEvents(window), _.touches = { ONE: Qn.ROTATE, TWO: Qn.DOLLY_PAN }, V.domElement.addEventListener("wheel", (L) => {
    if (!L.ctrlKey && Math.abs(L.deltaX) > Math.abs(L.deltaY) * 1.5) {
      L.preventDefault();
      const j = _.target, J = new F().subVectors(M.position, j), ee = new F();
      ee.crossVectors(M.up, J).normalize();
      const _e = J.length() * 1e-3 * _.panSpeed;
      j.addScaledVector(ee, L.deltaX * _e), M.position.addScaledVector(ee, L.deltaX * _e), _.update();
    }
  }, { passive: false });
  const H = new Fo(new F(-1, 0, 0), 0), xe = new Fo(new F(0, -1, 0), 0), be = new Fo(new F(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const L = window.__hekatanClip, j = [];
    L.enableX && (H.normal.set(L.invertX ? 1 : -1, 0, 0), H.constant = L.invertX ? -L.posX : L.posX, j.push(H)), L.enableY && (xe.normal.set(0, L.invertY ? 1 : -1, 0), xe.constant = L.invertY ? -L.posY : L.posY, j.push(xe)), L.enableZ && (be.normal.set(0, 0, L.invertZ ? 1 : -1), be.constant = L.invertZ ? -L.posZ : L.posZ, j.push(be)), V.clippingPlanes = j, v.traverse((ee) => {
      const we = ee;
      if (we.material) {
        const _e = Array.isArray(we.material) ? we.material : [we.material];
        for (const ye of _e) ye.clippingPlanes = j, ye.needsUpdate = true;
      }
    });
    const J = window.__hekatanPanes ?? [];
    for (const ee of J) try {
      ee && typeof ee.refresh == "function" && ee.refresh();
    } catch {
    }
    V.render(v, P);
  }
  se(), window.__hekatanClipApply = se;
  const D = ba(r), oe = te.derive(() => Math.pow(10, D.displayScale.val / 10)), B = ci(e, D), ie = () => {
    const L = [];
    return D.gridXY.rawVal && L.push("xy"), D.gridXZ.rawVal && L.push("xz"), D.gridYZ.rawVal && L.push("yz"), L;
  }, le = () => {
    const L = D.gridStep.rawVal, j = Math.max(L, D.gridMajor.rawVal);
    return { planes: ie(), majorStep: j, minorStep: L };
  };
  let N = Eo(D.gridSize.rawVal, le());
  N.visible = D.gridVisible.rawVal, window.__hekatanSnap2D = D.cursorSnap.rawVal;
  const I = () => {
    const L = Math.max(0, Math.min(1, D.gridOpacity.rawVal));
    N.traverse((j) => {
      const J = j.material;
      if (!J || !("opacity" in J)) return;
      const ee = j.name ?? "";
      let we = 0.55;
      ee.includes("border") ? we = 1 : ee.includes("major") && (we = 0.95), J.opacity = L * we;
    });
  };
  I(), y.appendChild(va(D, e, f)), y.setAttribute("id", "viewer"), y.appendChild(V.domElement), V.setPixelRatio(window.devicePixelRatio);
  const G = un();
  V.setClearColor(G.background, 1);
  const X = D.gridSize.rawVal, T = X * 0.5 + X * 0.5 / Math.tan(45 * 0.5);
  M.position.set(0, 0, T), M.up.set(0, 1, 0), _.target.set(0, 0, 0), _.minDistance = 0.1, _.maxDistance = 1e4, y.__settings = D, _.zoomSpeed = 1, _._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, _.update();
  let q = bs(D.gridSize.rawVal, D.flipAxes.rawVal);
  v.add(N, q), te.derive(() => {
    window.__hekatanGridPlaneXY = D.gridXY.val, window.__hekatanGridPlaneXZ = D.gridXZ.val, window.__hekatanGridPlaneYZ = D.gridYZ.val;
  });
  let R = true;
  te.derive(() => {
    const L = D.gridVisible.val;
    if (R) {
      R = false;
      return;
    }
    N.visible = L, O();
  });
  let $ = true;
  te.derive(() => {
    if (D.gridOpacity.val, $) {
      $ = false;
      return;
    }
    I(), O();
  }), te.derive(() => {
    const L = D.cursorSnap.val;
    window.__hekatanSnap2D = L;
  });
  let ne = true;
  te.derive(() => {
    var _a2, _b, _c;
    const L = D.gridSize.val, j = D.flipAxes.val;
    if (D.gridXY.val, D.gridXZ.val, D.gridYZ.val, D.gridStep.val, D.gridMajor.val, ne) {
      ne = false;
      return;
    }
    v.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (_e) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = _e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = _e.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), N = Eo(L, le()), N.visible = D.gridVisible.rawVal, v.add(N), I(), v.remove(q), q.traverse((_e) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = _e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = _e.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), q = bs(L, j), v.add(q);
    const J = L * 0.5 + L * 0.5 / Math.tan(45 * 0.5);
    M.position.distanceTo(_.target);
    const ee = Math.abs(M.position.x) < 0.1 && Math.abs(M.position.y) < 0.1 && M.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ee ? M.position.set(0, 0, J) : M.position.set(0.5 * L, -J, 0.5 * L), _.target.set(0, 0, 0)), _.minDistance = Math.max(0.05, L * 0.01), _.maxDistance = Math.max(50, L * 50), _.update(), O();
  }), new ResizeObserver((L) => {
    var _a2, _b;
    for (const j of L) {
      const J = (_a2 = j.target) == null ? void 0 : _a2.clientWidth, ee = (_b = j.target) == null ? void 0 : _b.clientHeight;
      if (J === 0 || ee === 0) continue;
      const _e = (he ? J / 2 : J) / ee;
      M.aspect = _e, M.updateProjectionMatrix();
      const ye = g.top;
      if (g.left = -ye * _e, g.right = ye * _e, g.updateProjectionMatrix(), ae && ae.isPerspectiveCamera) ae.aspect = _e, ae.updateProjectionMatrix();
      else if (ae && ae.isOrthographicCamera) {
        const Ae = ae, Te = Ae.top;
        Ae.left = -Te * _e, Ae.right = Te * _e, Ae.updateProjectionMatrix();
      }
      V.setSize(J, ee), O();
    }
  }).observe(y), _.addEventListener("change", O), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, D.displayScale.val, D.nodes.val, D.elements.val, (_g = D.edges) == null ? void 0 : _g.val, D.elemColumns.val, D.elemBeams.val, D.nodesIndexes.val, D.elementsIndexes.val, D.orientations.val, D.sections.val, D.secColumns.val, D.secBeams.val, D.secFloor.val, D.supports.val, D.loads.val, D.deformedShape.val, D.nodeResults.val, D.frameResults.val, D.shellResults.val, (_h = D.solidResults) == null ? void 0 : _h.val, (_i = D.extruded) == null ? void 0 : _i.val, setTimeout(O);
  });
  let he = false, ae = null, Y = null, fe = false;
  function O() {
    const L = y.clientWidth || 1, j = y.clientHeight || 1;
    if (!he || !ae) {
      V.setScissorTest(false), V.setViewport(0, 0, L, j), V.render(v, P);
      return;
    }
    const J = L / 2;
    V.setScissorTest(true), V.setViewport(0, 0, J, j), V.setScissor(0, 0, J, j), V.render(v, P), V.setViewport(J, 0, J, j), V.setScissor(J, 0, J, j), V.render(v, ae), V.setScissorTest(false);
  }
  function ge(L) {
    P = L, _.object = L, _.update(), O();
  }
  function ve(L, j) {
    he = L, j && (ae = j);
    const J = y.clientWidth || 1, ee = y.clientHeight || 1, _e = (L ? J / 2 : J) / ee;
    M.isPerspectiveCamera && (M.aspect = _e, M.updateProjectionMatrix());
    const ye = g.top;
    if (g.left = -ye * _e, g.right = ye * _e, g.updateProjectionMatrix(), L && ae) {
      if (Y ? (Y.object = ae, Y.update()) : (Y = new gs(ae, V.domElement), Y.enableDamping = true, Y.dampingFactor = 0.1, Y.screenSpacePanning = true, Y.zoomSpeed = 0.8, Y.panSpeed = 1.2, Y.rotateSpeed = 0.9, Y.touches = { ONE: Qn.ROTATE, TWO: Qn.DOLLY_PAN }, Y.target.copy(_.target), Y.addEventListener("change", O), Y.enabled = false), !fe) {
        const Ae = (Te) => {
          if (!he || !Y) return;
          const He = V.domElement.getBoundingClientRect(), Qe = Te.clientX - He.left, Ue = He.width / 2, ft = Qe >= Ue;
          _.enabled = !ft, Y.enabled = ft;
        };
        V.domElement.addEventListener("pointerdown", Ae, true), V.domElement.addEventListener("wheel", Ae, { capture: true, passive: true }), fe = true;
      }
    } else L || (_.enabled = true, Y && (Y.enabled = false));
    y.__splitMode = L, window.__hekatanSplitMode = L, window.__hekatanSplitCamera = L ? ae : null, O();
  }
  if (e) {
    v.add(Ma(D, B, oe), wa(e, D, B), Sa(D, B, oe), Pa(e, D, B, oe), _a(e, D, B, oe), ka(e, D, B, oe), Fa(e, D, B, oe), Ea(e, D, B, oe), La(e, D, B), Ba(e, D, B, oe), Ia(e, D, B, oe)), window.__hekatanDiagrama2D || (li(e, D), V.domElement.addEventListener("dblclick", () => {
      var _a2;
      const Ae = (_a2 = D.frameResults) == null ? void 0 : _a2.rawVal;
      !Ae || Ae === "none" || !(window.__hekatanModelSelection ?? []).some((He) => He.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const L = ti({ scene: v, rendererElm: V.domElement, getActiveCamera: () => P, derivedNodes: B, derivedDisplayScale: oe, mesh: e, settings: D, render: O });
    v.add(L);
    const j = mi(e, D), J = Ya(e, D, B, j), ee = _s(j);
    v.add(J), y.appendChild(ee);
    const we = Ga(e, D, B);
    v.add(we);
    const _e = we.__colorMapValues, ye = _s(_e);
    ye.id = "frame-legend", y.appendChild(ye), te.derive(() => {
      var _a2;
      const Ae = D.shellResults.val != "none", Te = (((_a2 = D.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", He = Ae || Te, Qe = D.frameResults.val.startsWith("contour:"), Ue = j.val.some((ft) => Number.isFinite(ft));
      ee.hidden = !He || !Ue, J.visible = He, ye.hidden = !Qe;
    });
  }
  if (f) {
    const L = new zs(16777215, 0.5);
    v.add(L);
    const j = new so(16777215, 0.5);
    j.position.set(30, 25, -10), j.shadow.mapSize.width = 1024, j.shadow.mapSize.height = 1024, v.add(j);
    const J = 10;
    j.shadow.camera.left = -J, j.shadow.camera.right = J, j.shadow.camera.top = J, j.shadow.camera.bottom = -J, j.shadow.camera.far = 1e3;
    const ee = new so(16777215, 0.5);
    ee.color.setHSL(11, 43, 96), ee.position.set(-10, 0, 30), v.add(ee), te.derive(() => {
      (f == null ? void 0 : f.val.length) && (v.remove(...f.oldVal), v.add(...f.rawVal), O());
    }), te.derive(() => {
      f.rawVal.forEach((we) => we.visible = D.solids.val), O();
    });
  }
  if (p) {
    const L = [], j = (ee) => {
      var _a2;
      return ((_a2 = ee == null ? void 0 : ee.userData) == null ? void 0 : _a2.isCota) ? D.showCotas.val : D.custom3D.val;
    }, J = () => {
      for (const ee of L) ee.visible = j(ee);
      O();
    };
    te.derive(() => {
      const ee = p.val;
      L.length && (v.remove(...L), L.length = 0), ee.length && (v.add(...ee), L.push(...ee), J()), O();
    }), te.derive(() => {
      D.custom3D.val, J();
    }), te.derive(() => {
      D.showCotas.val, J();
    });
  }
  c && Na({ drawingObj: c, gridObj: N, scene: v, getActiveCamera: () => P, controls: _, gridSize: X, derivedDisplayScale: oe, rendererElm: V.domElement, viewerRender: O }), Ps((L, j) => {
    var _a2;
    V.setClearColor(j.background, 1), v.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (J) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = J.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = J.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = Eo(D.gridSize.rawVal, { planes: ie() }), v.add(N), y.style.setProperty("--awatif-legend-color", j.legendMarker), O();
  });
  const Pe = { scene: v, perspCamera: M, orthoCamera: g, get camera() {
    return P;
  }, controls: _, renderer: V, rendererElm: V.domElement, render: O, setActiveCamera: ge, setSplitMode: ve, get splitMode() {
    return he;
  }, get splitCamera() {
    return ae;
  }, settings: D };
  y.__ctx = Pe;
  const me = document.createElement("div");
  me.id = "hk-nav-camara", me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const De = (L, j, J) => {
    const ee = document.createElement("button");
    return ee.textContent = L, ee.title = j, ee.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ee.onmouseenter = () => {
      ee.style.background = "rgba(70,70,70,0.9)";
    }, ee.onmouseleave = () => {
      ee.style.background = "rgba(40,40,40,0.85)";
    }, ee.onclick = (we) => {
      we.preventDefault(), J();
    }, ee;
  }, Ze = (L, j) => {
    const J = _.target, ee = new F().subVectors(P.position, J), we = ee.length(), _e = new F(), ye = new F();
    _e.crossVectors(P.up, ee).normalize(), ye.copy(P.up).normalize();
    const Ae = we * 0.05;
    J.addScaledVector(_e, -L * Ae), J.addScaledVector(ye, j * Ae), P.position.addScaledVector(_e, -L * Ae), P.position.addScaledVector(ye, j * Ae), _.update(), O();
  }, et = (L) => {
    const j = new F().subVectors(P.position, _.target);
    j.multiplyScalar(L), P.position.copy(_.target).add(j), _.update(), O();
  }, vt = () => {
    const L = document.createElement("div");
    return L.style.cssText = "width:32px;height:32px;", L;
  };
  return me.append(vt()), me.append(De("\u2191", "Pan arriba", () => Ze(0, 1))), me.append(De("\u2295", "Zoom in", () => et(0.85))), me.append(De("\u2190", "Pan izquierda", () => Ze(-1, 0))), me.append(De("\u2302", "Reset vista", () => {
    _.reset(), O();
  })), me.append(De("\u2192", "Pan derecha", () => Ze(1, 0))), me.append(De("\u2296", "Zoom out", () => et(1.18))), me.append(De("\u2193", "Pan abajo", () => Ze(0, -1))), me.append(vt()), getComputedStyle(y).position === "static" && (y.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && y.appendChild(me), y;
}
function ci(e, r) {
  return te.derive(() => {
    var _a2, _b, _c, _d;
    if (!r.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const c = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], p = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!p || c.length === 0) return c;
    const f = r.deformScale.val, y = r.deformScale.val * r.deformScaleZ.val, v = Number.isFinite(f) ? f : 1, M = Number.isFinite(y) ? y : 1;
    return c.map((g, P) => {
      var _a3;
      const V = ((_a3 = p.get(P)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], _ = Number.isFinite(V[0]) ? V[0] : 0, H = Number.isFinite(V[1]) ? V[1] : 0, xe = Number.isFinite(V[2]) ? V[2] : 0;
      return [g[0] + _ * v, g[1] + H * v, g[2] + xe * M];
    });
  });
}
const Ln = te.state(null), Io = te.state(""), di = te.state("kN"), pi = te.state("mm"), ui = te.state("kN/m\xB2"), fi = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Ss = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, hi = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function mi(e, r) {
  const c = te.state([]);
  let p;
  return ((f) => {
    f.bendingXX = "bendingXX", f.bendingYY = "bendingYY", f.bendingXY = "bendingXY", f.membraneXX = "membraneXX", f.membraneYY = "membraneYY", f.membraneXY = "membraneXY", f.tranverseShearX = "tranverseShearX", f.tranverseShearY = "tranverseShearY", f.membranePrincipalMax = "membranePrincipalMax", f.membranePrincipalMin = "membranePrincipalMin", f.bendingPrincipalMax = "bendingPrincipalMax", f.bendingPrincipalMin = "bendingPrincipalMin", f.transverseShearMax = "transverseShearMax", f.vonMises = "vonMises", f.pressure = "pressure", f.displacementX = "displacementX", f.displacementY = "displacementY", f.displacementZ = "displacementZ";
  })(p || (p = {})), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const f = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), be = (L, j) => {
      L == null ? void 0 : L.forEach((J, ee) => {
        const we = e.elements.val[ee];
        if (we) for (let _e2 = 0; _e2 < we.length; _e2++) j.set(we[_e2], [J[_e2] ?? J[0]]);
      });
    };
    be((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, f), be((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, y), be((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, v), be((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, M), be((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, g), be((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), be((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, V), be((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, _), be((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, H), be((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, xe);
    const se = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), le = (L, j, J, ee, we) => {
      L.forEach((_e2, ye) => {
        var _a3, _b2;
        const Ae = _e2[0] ?? 0, Te = ((_a3 = j.get(ye)) == null ? void 0 : _a3[0]) ?? 0, He = ((_b2 = J.get(ye)) == null ? void 0 : _b2[0]) ?? 0, Qe = (Ae + Te) / 2, Ue = Math.hypot((Ae - Te) / 2, He);
        ee.set(ye, [Qe + Ue]), we.set(ye, [Qe - Ue]);
      });
    };
    le(M, g, P, se, D), le(f, y, v, oe, B), V.forEach((L, j) => {
      var _a3;
      ie.set(j, [Math.hypot(L[0] ?? 0, ((_a3 = _.get(j)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const N = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, I = (_w = r.solidResults) == null ? void 0 : _w.val, X = I && I !== "none" ? I : r.shellResults.val, T = N == null ? void 0 : N[X], q = { bendingXX: [f, 0], bendingYY: [y, 0], bendingXY: [v, 0], membraneXX: [M, 0], membraneYY: [g, 0], membraneXY: [P, 0], tranverseShearX: [V, 0], tranverseShearY: [_, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [D, 0], bendingPrincipalMax: [oe, 0], bendingPrincipalMin: [B, 0], transverseShearMax: [ie, 0], vonMises: [H, 0], pressure: [xe, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, R = r.shellResults.val, $ = di.val, ne = pi.val, pe = R === "displacementX" || R === "displacementY" || R === "displacementZ", he = R === "bendingXX" || R === "bendingYY" || R === "bendingXY" || R === "bendingPrincipalMax" || R === "bendingPrincipalMin", ae = R === "membraneXX" || R === "membraneYY" || R === "membraneXY" || R === "membranePrincipalMax" || R === "membranePrincipalMin", Y = R === "vonMises" || R === "pressure", fe = R === "tranverseShearX" || R === "tranverseShearY" || R === "transverseShearMax", O = (_D = r.solidResults) == null ? void 0 : _D.val, ge = O === "vonMises" || O === "sigmaXX" || O === "sigmaYY" || O === "sigmaZZ" || O === "tauXY" || O === "tauYZ" || O === "tauXZ", ve = O === "ux" || O === "uy" || O === "uz", Pe = ui.val, me = ge ? hi[Pe] : ve || pe ? Ss[ne] : he || ae || Y || fe ? 1 / fi[$] : 1, De = ge ? Pe : ve || pe ? ne : he ? `${$}\xB7m/m` : ae ? `${$}/m\xB2` : Y ? `${$}/m\xB2` : fe ? `${$}/m` : "";
    Io.val = De, Ln.val = Array.isArray(T) && T.length === 2 ? [T[0] * me, T[1] * me] : null;
    const Ze = Vs.val, vt = O && O !== "none" ? [H, 0] : q[R], ue = [];
    if (e.nodes.val.forEach((L, j) => {
      const J = vt;
      if (!J || !J[0] || typeof J[0].has != "function") return;
      if (!J[0].has(j)) {
        ue.push(Number.NaN);
        return;
      }
      const ee = J[0].get(j), we = ee ? ee[J[1]] ?? 0 : 0;
      ue.push(we * me);
    }), !Ln.val && Ze !== "auto") {
      const L = e.nodes.val, j = /* @__PURE__ */ new Set(), J = (we, _e2) => {
        var _a3;
        const ye = (_a3 = L[we[0]]) == null ? void 0 : _a3[_e2];
        return we.every((Ae) => {
          var _a4;
          return Math.abs((((_a4 = L[Ae]) == null ? void 0 : _a4[_e2]) ?? NaN) - ye) < 1e-6;
        });
      };
      for (const we of e.elements.val) {
        if (we.length !== 4) continue;
        const _e2 = J(we, 2), ye = !_e2 && J(we, 0), Ae = !_e2 && J(we, 1);
        if (Ze === "losas" ? _e2 : Ze === "muros" ? ye || Ae : Ze === "murosX" ? ye : Ze === "murosY" ? Ae : false) for (const Qe of we) j.add(Qe);
      }
      const ee = [];
      for (const we of j) {
        const _e2 = ue[we];
        Number.isFinite(_e2) && ee.push(_e2);
      }
      ee.length && (Ln.val = Ro(ee));
    }
    c.val = ue;
  }), c;
}
export {
  ga as a,
  _s as b,
  di as c,
  pi as d,
  ui as e,
  vi as g
};
