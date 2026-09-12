import { N as Ot, a6 as On, q as ea, v as te, a7 as ta, D as Ft, M as it, B as Fe, F as St, a8 as na, x as yt, a9 as oa, aa as sa, h as us, ab as fs, r as un, ac as no, ad as oo, a4 as Ps, _ as rt, b as wt, L as jt, w as Cs, c as aa, ae as ia, f as ut, V as F, $ as pn, af as Co, H as io, d as zt, a as zo, Y as zs, Z as ao, G as la, z as $n, A as ra, ag as so, t as ca, o as da, I as ln, a2 as An, E as hs, S as bn, m as Qn, ah as En, g as ms, i as ws, j as ys, C as xs, K as pa, U as ua, W as fa, X as ha, T as jn, P as Fo, O as ma } from "./theme-DQ--CgsI.js";
import { T as At, O as gs } from "./Text-ERv22veQ.js";
import { P as Fs } from "./tweakpane-BXg6ZhiP.js";
import { e as wa } from "./styles-0iLl92Fx.js";
class As {
  constructor(l, c = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, c);
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
  setColorMap(l, c = 32) {
    this.map = Ao[l] || Ao.rainbow, this.n = c;
    const p = 1 / this.n, f = new Ot(), y = new Ot();
    this.lut.length = 0, this.lut.push(new Ot(this.map[0][1]));
    for (let v = 1; v < c; v++) {
      const M = v * p;
      for (let x = 0; x < this.map.length - 1; x++) if (M > this.map[x][0] && M <= this.map[x + 1][0]) {
        const P = this.map[x][0], $ = this.map[x + 1][0];
        f.setHex(this.map[x][1], On), y.setHex(this.map[x + 1][1], On);
        const _ = new Ot().lerpColors(f, y, (M - P) / ($ - P));
        this.lut.push(_);
      }
    }
    return this.lut.push(new Ot(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = ea.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const c = Math.round(l * this.n);
    return this.lut[c];
  }
  addColorMap(l, c) {
    return Ao[l] = c, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const c = l.getContext("2d", { alpha: false }), p = c.getImageData(0, 0, 1, this.n), f = p.data;
    let y = 0;
    const v = 1 / this.n, M = new Ot(), x = new Ot(), P = new Ot();
    for (let $ = 1; $ >= 0; $ -= v) for (let _ = this.map.length - 1; _ >= 0; _--) if ($ < this.map[_][0] && $ >= this.map[_ - 1][0]) {
      const O = this.map[_ - 1][0], ye = this.map[_][0];
      M.setHex(this.map[_ - 1][1], On), x.setHex(this.map[_][1], On), P.lerpColors(M, x, ($ - O) / (ye - O)), f[y * 4] = Math.round(P.r * 255), f[y * 4 + 1] = Math.round(P.g * 255), f[y * 4 + 2] = Math.round(P.b * 255), f[y * 4 + 3] = 255, y += 1;
    }
    return c.putImageData(p, 0, 0), l;
  }
}
const Ao = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Es = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], ya = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Es, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, lo = te.state("safe"), Vs = te.state("auto");
function $s(e) {
  e = Math.max(0, Math.min(1, e));
  const l = ya[lo.val] ?? Es;
  for (let p = 0; p < l.length - 1; p++) {
    const [f, y, v, M] = l[p], [x, P, $, _] = l[p + 1];
    if (e <= x) {
      const O = (e - f) / (x - f);
      return [y + (P - y) * O, v + ($ - v) * O, M + (_ - M) * O];
    }
  }
  const c = l[l.length - 1];
  return [c[1], c[2], c[3]];
}
function vs() {
  const l = new Uint8Array(1024);
  for (let p = 0; p < 256; p++) {
    const f = p / 255, [y, v, M] = $s(f);
    l[p * 4 + 0] = y, l[p * 4 + 1] = v, l[p * 4 + 2] = M, l[p * 4 + 3] = 255;
  }
  const c = new oa(l, 256, 1, sa);
  return c.minFilter = us, c.magFilter = us, c.wrapS = fs, c.wrapT = fs, c.needsUpdate = true, c;
}
function xa() {
  const l = [];
  for (let c = 0; c <= 12; c++) {
    const p = 1 - c / 12, [f, y, v] = $s(p);
    l.push(`rgb(${f | 0},${y | 0},${v | 0}) ${(c / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function Ro(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((y, v) => y - v), c = (y) => l[Math.min(l.length - 1, Math.max(0, Math.round(y * (l.length - 1))))];
  let p = l.length >= 20 ? c(0.01) : l[0], f = l.length >= 20 ? c(0.99) : l[l.length - 1];
  return p >= 0 && f > 0 && (p = 0), f <= 0 && p < 0 && (f = 0), [p, f];
}
function ga(e, l, c) {
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
    lo.val;
    const v = f.uniforms.cmap.value;
    f.uniforms.cmap.value = vs(), (_a2 = v == null ? void 0 : v.dispose) == null ? void 0 : _a2.call(v);
  });
  const y = new it(new Fe(), f);
  return y.renderOrder = -1, y.frustumCulled = false, y.userData.isShellArea = true, y.name = "__hekatan_shell_colormap", te.derive(() => {
    y.geometry.setAttribute("position", new St(e.val.flat(), 3));
    const v = [], M = [], x = [];
    l.val.forEach((B, ie) => {
      B.length === 3 ? (v.push(B[0], B[1], B[2]), M.push(ie), x.push(0)) : B.length === 4 && (v.push(B[0], B[1], B[2]), v.push(B[0], B[2], B[3]), M.push(ie, ie), x.push(0, 1));
    }), y.geometry.setIndex(new na(v, 1)), y.userData.faceToElem = M, y.userData.faceLocal = x;
    const P = c.val.filter((B) => Number.isFinite(B));
    let $, _;
    const O = Ln.val;
    if (O ? (_ = O[0], $ = O[1]) : [_, $] = Ro(P), $ === _) {
      const B = Math.max(Math.abs($) * 1e-6, 1e-9);
      $ += B, _ -= B;
    }
    const ye = O && O[0] > O[1], be = Math.min(_, $), se = Math.max(_, $), D = se - be, oe = new Float32Array(c.val.length);
    for (let B = 0; B < c.val.length; B++) {
      const ie = c.val[B];
      if (!Number.isFinite(ie)) {
        oe[B] = -1;
        continue;
      }
      const N = ((ye ? se + be - ie : ie) - be) / D;
      oe[B] = Math.max(0, Math.min(1, N));
    }
    y.geometry.setAttribute("scalar", new yt(oe, 1));
  }), y;
}
function va(e, l, c) {
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
    let O = false, ye = 0, be = 0, se = 0, D = 0;
    _.addEventListener("mousedown", (oe) => {
      O = true, ye = oe.clientX, be = oe.clientY;
      const B = p.getBoundingClientRect();
      se = B.left, D = B.top, p.style.left = `${se}px`, p.style.top = `${D}px`;
    }), window.addEventListener("mousemove", (oe) => {
      if (!O) return;
      const B = oe.clientX - ye, ie = oe.clientY - be, le = Math.max(0, Math.min(window.innerWidth - 40, se + B)), N = Math.max(0, Math.min(window.innerHeight - 40, D + ie));
      p.style.left = `${le}px`, p.style.top = `${N}px`;
    }), window.addEventListener("mouseup", () => {
      if (O) {
        O = false;
        try {
          localStorage.setItem(y, JSON.stringify({ left: parseFloat(p.style.left), top: parseFloat(p.style.top) }));
        } catch {
        }
      }
    });
  };
  if (M(), l == null ? void 0 : l.nodes) {
    f.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const _ = f.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    _.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), _.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), _.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), _.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const O = _.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    O.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), O.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), O.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), O.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), O.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const ye = f.addFolder({ title: "\u{1F441} Ver", expanded: false });
    ye.addBinding(e.nodes, "val", { label: "Nodes" }), ye.addBinding(e.elements, "val", { label: "Elements" }), ye.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), ye.addBinding(e.faces, "val", { label: "  Caras (fill)" }), ye.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), ye.addBinding(e.elemColumns, "val", { label: "    Columnas" }), ye.addBinding(e.elemBeams, "val", { label: "    Vigas" }), ye.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), ye.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), ye.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), ye.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), ye.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), ye.addBinding(e.orientations, "val", { label: "Orientations" }), ye.addBinding(e.sections, "val", { label: "Sections" }), ye.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), ye.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), ye.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), ye.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), ye.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const _ = f.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    _.addBinding(e.supports, "val", { label: "Supports" }), _.addBinding(e.loads, "val", { label: "Loads" }), _.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), _.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const _ = f.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = _, _.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), _.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), _.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), _.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), _.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), _.addBinding(lo, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), _.addBinding(Vs, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), _.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), _.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), _.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), _.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  c && f.addBinding(e.solids, "val", { label: "Solids" });
  const x = f.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), P = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), $ = () => {
    const _ = window.__hekatanClipApply;
    typeof _ == "function" && _();
  };
  return x.addBinding(P, "enableX", { label: "Cortar X" }).on("change", $), x.addBinding(P, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", $), x.addBinding(P, "invertX", { label: "  invertir X" }).on("change", $), x.addBinding(P, "enableY", { label: "Cortar Y" }).on("change", $), x.addBinding(P, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", $), x.addBinding(P, "invertY", { label: "  invertir Y" }).on("change", $), x.addBinding(P, "enableZ", { label: "Cortar Z" }).on("change", $), x.addBinding(P, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", $), x.addBinding(P, "invertZ", { label: "  invertir Z" }).on("change", $), p;
}
function ba(e) {
  return { gridSize: te.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: te.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: te.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: te.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: te.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: te.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: te.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: te.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: te.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: te.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: te.state((e == null ? void 0 : e.nodes) ?? true), elements: te.state((e == null ? void 0 : e.elements) ?? true), edges: te.state((e == null ? void 0 : e.edges) ?? true), faces: te.state((e == null ? void 0 : e.faces) ?? true), elemColumns: te.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: te.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: te.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: te.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: te.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: te.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: te.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: te.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: te.state((e == null ? void 0 : e.orientations) ?? false), sections: te.state((e == null ? void 0 : e.sections) ?? true), extruded: te.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: te.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: te.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: te.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: te.state((e == null ? void 0 : e.secFloor) ?? -1), supports: te.state((e == null ? void 0 : e.supports) ?? true), loads: te.state((e == null ? void 0 : e.loads) ?? false), deformedShape: te.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: te.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: te.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: te.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: te.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: te.state((e == null ? void 0 : e.flipAxes) ?? false), solids: te.state((e == null ? void 0 : e.solids) ?? true), custom3D: te.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: te.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: te.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: te.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Ma(e, l, c) {
  const p = un(), f = new no(new Fe(), new oo({ color: p.nodePoint }));
  return Ps((y, v) => {
    f.material.color.setHex(v.nodePoint);
  }), f.frustumCulled = false, te.derive(() => {
    e.nodes.val && f.geometry.setAttribute("position", new St(l.val.flat(), 3));
  }), te.derive(() => {
    if (c.val, l.val, !e.nodes.rawVal) return;
    const y = l.rawVal ?? [];
    let v = e.gridSize.val * 0.5;
    if (y.length >= 2) {
      const x = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
      for (const $ of y) for (let _ = 0; _ < 3; _++) x[_] = Math.min(x[_], $[_]), P[_] = Math.max(P[_], $[_]);
      v = Math.max(P[0] - x[0], P[1] - x[1], P[2] - x[2], 0.1);
    }
    const M = 0.03 * v;
    f.material.size = M * c.rawVal;
  }), te.derive(() => {
    f.visible = e.nodes.val;
  }), f;
}
function Eo(e, l) {
  const c = un(), p = new rt();
  p.name = "hekatan-grid";
  const f = (l == null ? void 0 : l.planes) ?? ["xy"];
  let y = (l == null ? void 0 : l.majorStep) ?? 1, v = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (y <= 0 && (y = 1), v <= 0 && (v = 0.1); e / v > 500; ) v *= 2;
  for (; e / y > 100; ) y *= 2;
  const M = e / 2;
  y = Math.max(v, Math.round(y / v) * v);
  const P = new Ot(c.grid).multiplyScalar(1.3), $ = new Ot(c.grid).multiplyScalar(0.8), _ = (se, D, oe, B) => {
    const ie = [], le = se === "xy" ? (T, q) => [T, q, 0] : se === "xz" ? (T, q) => [T, 0, q] : (T, q) => [0, T, q], N = Math.floor(M / D);
    for (let T = -N; T <= N; T++) {
      const q = T * D, R = le(q, -M), L = le(q, M);
      ie.push(...R, ...L);
    }
    for (let T = -N; T <= N; T++) {
      const q = T * D, R = le(-M, q), L = le(M, q);
      ie.push(...R, ...L);
    }
    const I = new Fe();
    I.setAttribute("position", new St(ie, 3));
    const K = new wt({ color: oe, transparent: true, opacity: B, depthWrite: false }), X = new jt(I, K);
    return X.name = `grid-${se}-${D === v ? "minor" : "major"}`, X;
  }, O = (se, D, oe) => {
    const B = se === "xy" ? (X, T) => [X, T, 0] : se === "xz" ? (X, T) => [X, 0, T] : (X, T) => [0, X, T], ie = [[-M, -M], [M, -M], [M, M], [-M, M]], le = [];
    for (const [X, T] of ie) le.push(...B(X, T));
    const N = new Fe();
    N.setAttribute("position", new St(le, 3));
    const I = new wt({ color: D, transparent: true, opacity: oe, depthWrite: false }), K = new Cs(N, I);
    return K.name = `grid-${se}-border`, K.renderOrder = 1, K;
  }, ye = (se, D, oe) => {
    const B = se === "xy" ? (I, K) => [I, K, 0] : se === "xz" ? (I, K) => [I, 0, K] : (I, K) => [0, I, K], ie = D === "u" ? [...B(-M, 0), ...B(M, 0)] : [...B(0, -M), ...B(0, M)], le = new Fe();
    le.setAttribute("position", new St(ie, 3));
    const N = new jt(le, new wt({ color: oe, transparent: true, opacity: 0.45, depthWrite: false }));
    return N.name = `grid-${se}-eje-${D}`, N.renderOrder = 1, N;
  }, be = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of f) {
    p.add(_(se, v, $, 0.12)), p.add(_(se, y, P, 0.4));
    const [D, oe] = be[se];
    p.add(ye(se, "u", D)), p.add(ye(se, "v", oe)), p.add(O(se, P, 0.55));
  }
  return p.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: y, minorStep: v, gridSize: e, planes: [...f] }, p;
}
function _a(e, l, c, p) {
  const f = new rt(), y = new aa(0.5, 0.5, 0.5), v = new ia(0.45, 0.7, 4);
  v.rotateX(Math.PI / 2), v.translate(0, 0, -0.35);
  const M = new ut({ color: 10166822 }), x = new ut({ color: 2792847 }), P = new ut({ color: 3835647 }), $ = () => {
    const ye = c.rawVal ?? [];
    if (ye.length < 2) return l.gridSize.val * 0.5;
    let be = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const D of ye) for (let oe = 0; oe < 3; oe++) D[oe] < be[oe] && (be[oe] = D[oe]), D[oe] > se[oe] && (se[oe] = D[oe]);
    return Math.max(se[0] - be[0], se[1] - be[1], se[2] - be[2], 0.1);
  }, _ = () => 0.08 * $(), O = () => p.rawVal;
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    f.clear();
    const ye = _();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((be, se) => {
      const D = c.val[se];
      if (!D) return;
      const oe = be ?? [], B = (oe[0] ? 1 : 0) + (oe[1] ? 1 : 0) + (oe[2] ? 1 : 0), ie = (oe[3] ? 1 : 0) + (oe[4] ? 1 : 0) + (oe[5] ? 1 : 0);
      let le;
      B >= 3 && ie >= 3 ? le = new it(y, M) : B >= 3 && ie === 0 ? le = new it(v, x) : le = new it(v, P), le.position.set(D[0], D[1], D[2]);
      const N = ye * O();
      le.scale.set(N, N, N), f.add(le);
    });
  }), te.derive(() => {
    if (p.val, !l.supports.rawVal) return;
    const be = _() * O();
    f.children.forEach((se) => se.scale.set(be, be, be));
  }), te.derive(() => {
    f.visible = l.supports.val;
  }), f;
}
function ka(e, l, c, p) {
  const f = new rt();
  f.name = "loadsGroup";
  function y(M) {
    if (M.length < 2) return 0.12 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
    for (const _ of M) for (let O = 0; O < 3; O++) x[O] = Math.min(x[O], _[O]), P[O] = Math.max(P[O], _[O]);
    return 0.08 * Math.max(P[0] - x[0], P[1] - x[1], P[2] - x[2], 0.1);
  }
  te.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    f.children.forEach((se) => {
      var _a3;
      return (_a3 = se.dispose) == null ? void 0 : _a3.call(se);
    }), f.clear();
    const M = c.val, x = y(M), P = 240, $ = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((se, D) => {
      M[D] && se.slice(0, 3).some((oe) => Math.abs(oe) > 1e-15) && $.push(D);
    });
    let _ = $;
    if ($.length > P) {
      const se = $.map((L) => M[L][0]), D = $.map((L) => M[L][1]), oe = Math.min(...se), B = Math.max(...se), ie = Math.min(...D), le = Math.max(...D), N = $.map((L) => M[L][2]), I = Math.max(1e-6, (Math.max(...N) - Math.min(...N)) / 40), K = (L) => Math.round(L / I), X = new Set(N.map(K)), T = Math.max(4, Math.floor(P / Math.max(1, X.size))), q = Math.max(2, Math.round(Math.sqrt(T))), R = /* @__PURE__ */ new Map();
      for (const L of $) {
        const ne = B - oe < 1e-9 ? 0 : (M[L][0] - oe) / (B - oe), de = le - ie < 1e-9 ? 0 : (M[L][1] - ie) / (le - ie), fe = Math.min(q - 1, Math.floor(ne * q)), ae = Math.min(q - 1, Math.floor(de * q)), Y = `${fe},${ae},${K(M[L][2])}`, pe = Math.hypot(ne * q - (fe + 0.5), de * q - (ae + 0.5)), Q = R.get(Y);
        (!Q || pe < Q.d) && R.set(Y, { i: L, d: pe });
      }
      _ = [...R.values()].map((L) => L.i);
    }
    let O = 0;
    for (const se of _) {
      const D = e.nodeInputs.val.loads.get(se);
      for (let oe = 0; oe < 3; oe++) O = Math.max(O, Math.abs(D[oe]));
    }
    const ye = _.length <= 60, be = (se) => {
      const D = Math.abs(se);
      return D >= 100 ? se.toFixed(0) : D >= 10 ? se.toFixed(1) : se.toFixed(2);
    };
    for (const se of _) {
      const D = e.nodeInputs.val.loads.get(se), oe = M[se];
      if (oe) for (let B = 0; B < 3; B++) {
        const ie = D[B];
        if (!(Math.abs(ie) > 1e-9 * (O || 1))) continue;
        const le = new F(B === 0 ? Math.sign(ie) : 0, B === 1 ? Math.sign(ie) : 0, B === 2 ? Math.sign(ie) : 0), N = 0.45 + 0.55 * (O ? Math.abs(ie) / O : 1), I = new pn(le, new F(...oe), 1, B === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (I.userData = { nudo: oe, dir: le, rel: N }, f.add(I), ye) {
          const K = new At(be(ie), B === 2 ? "#f5b642" : "#ff6b5e");
          K.userData = { nudo: oe, dir: le, rel: N, texto: true }, f.add(K);
        }
      }
    }
    v(x * p.rawVal);
  });
  function v(M) {
    f.children.forEach((x) => {
      const P = x.userData;
      if (!(P == null ? void 0 : P.dir)) return;
      const $ = M * P.rel, _ = new F(...P.nudo).addScaledVector(P.dir, -$ * (P.texto ? 1.12 : 1));
      x.position.copy(_), P.texto ? x.updateScale(M * 0.38) : x.scale.set($, $, $);
    });
  }
  return te.derive(() => {
    p.val, l.loads.rawVal && v(y(c.rawVal) * p.rawVal);
  }), te.derive(() => {
    f.visible = l.loads.val;
  }), f;
}
function Sa(e, l, c) {
  const p = new rt();
  return te.derive(() => {
    if (!e.nodesIndexes.val) return;
    p.children.forEach((y) => y.dispose()), p.clear();
    const f = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((y, v) => {
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
function Pa(e, l, c, p) {
  const f = new rt();
  return te.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    f.children.forEach((v) => v.dispose()), f.clear();
    const y = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((v, M) => {
      const x = new At(`${M}`, void 0, "#001219");
      x.position.set(...Ca(v.map((P) => c.rawVal[P]))), x.updateScale(y * p.rawVal), f.add(x);
    });
  }), te.derive(() => {
    if (p.val, !l.elementsIndexes.rawVal) return;
    const y = 0.05 * l.gridSize.val * 0.6;
    f.children.forEach((v) => v.updateScale(y * p.rawVal));
  }), te.derive(() => {
    f.visible = l.elementsIndexes.val;
  }), f;
}
function Ca(e) {
  const l = e.reduce((p, f) => [p[0] + f[0], p[1] + f[1], p[2] + f[2]], [0, 0, 0]), c = e.length;
  return [l[0] / c, l[1] / c, l[2] / c];
}
function bs(e, l) {
  const c = new rt(), p = Math.min(0.05 * e, 0.6), f = un(), y = new At("X", "red", "transparent"), v = new At(l ? "Z" : "Y", "green", "transparent"), M = new At(l ? "Y" : "Z", "blue", "transparent"), x = new pn(new F(1, 0, 0), new F(0, 0, 0), 1, f.axisArrow, 0.2, 0.2), P = new pn(new F(0, 1, 0), new F(0, 0, 0), 1, f.axisArrow, 0.2, 0.2), $ = new pn(new F(0, 0, 1), new F(0, 0, 0), 1, f.axisArrow, 0.2, 0.2);
  return y.position.set(1.3 * p, 0, 0), v.position.set(0, 1.3 * p, 0), M.position.set(0, 0, 1.3 * p), y.updateScale(0.4 * p), v.updateScale(0.4 * p), M.updateScale(0.4 * p), x.scale.set(p, p, p), P.scale.set(p, p, p), $.scale.set(p, p, p), c.add(x, P, $, y, v, M), c;
}
function Do(e, l) {
  const c = new F(...e), f = new F(...l).clone().sub(c), y = f.length(), v = f.dot(new F(1, 0, 0)) / y, M = f.dot(new F(0, 1, 0)) / y, x = f.dot(new F(0, 0, 1)) / y, P = Math.sqrt(v ** 2 + M ** 2);
  let $ = new Co().fromArray([[v, M, x], [-M / P, v / P, 0], [-v * x / P, -M * x / P, P]].flat());
  return x === 1 && ($ = new Co().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), x === -1 && ($ = new Co().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new io().setFromMatrix3($);
}
function To(e, l) {
  return e == null ? void 0 : e.map((c, p) => (9 * c + l[p]) / 10);
}
function Tn(e) {
  const l = e.reduce((p, f) => [p[0] + f[0], p[1] + f[1], p[2] + f[2]], [0, 0, 0]), c = e.length;
  return [l[0] / c, l[1] / c, l[2] / c];
}
function za(e, l, c) {
  const p = Tn([l, c]), f = Tn([e, c]), y = Tn([e, l]), v = new F(...p).sub(new F(...f)).normalize(), M = new F(...c).sub(new F(...y)).normalize(), x = v.clone().cross(M).normalize(), P = x.clone().cross(v).normalize();
  return new io().makeBasis(v, P, x);
}
function Fa(e, l, c, p) {
  const f = new rt(), y = new Fe(), v = new wt({ vertexColors: true }), M = [0, 0, 0], x = [1, 0, 0], P = [0, 1, 0], $ = [0, 0, 1];
  y.setAttribute("position", new St([...M, ...x, ...M, ...P, ...M, ...$], 3));
  const _ = [255, 0, 0], O = [0, 255, 0], ye = [0, 0, 255];
  return y.setAttribute("color", new St([..._, ..._, ...O, ...O, ...ye, ...ye], 3)), te.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (f.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((be) => {
      const se = new jt(y, v), D = c.rawVal[be[0]], oe = c.rawVal[be[1]];
      if (be.length === 2 && (se.position.set(...To(D, oe)), se.rotation.setFromRotationMatrix(Do(D, oe))), be.length === 3) {
        const le = c.rawVal[be[2]];
        se.position.set(...Tn([D, oe, le])), se.rotation.setFromRotationMatrix(za(D, oe, le));
      }
      const ie = 0.05 * l.gridSize.rawVal * 0.75 * p.rawVal;
      se.scale.set(ie, ie, ie), f.add(se);
    }));
  }), te.derive(() => {
    if (p.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * p.rawVal;
    f.children.forEach((D) => D.scale.set(se, se, se));
  }), te.derive(() => {
    f.visible = l.orientations.val;
  }), f;
}
function Aa(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), c = (e.h * 100).toFixed(0);
    return `${l}x${c}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function Ea(e, l, c, p) {
  const f = new rt(), y = new rt();
  f.add(y);
  function v(I, K) {
    const X = I / 2, T = K / 2, q = new Float32Array([0, -X, -T, 0, X, -T, 0, X, T, 0, -X, -T, 0, X, T, 0, -X, T]), R = new Fe();
    R.setAttribute("position", new yt(q, 3));
    const L = new Float32Array([0, -X, -T, 0, X, -T, 0, X, T, 0, -X, T, 0, -X, -T]), ne = new Fe();
    return ne.setAttribute("position", new yt(L, 3)), { fill: R, outline: ne };
  }
  function M(I, K = 24) {
    const X = I / 2, T = new Float32Array(K * 9);
    for (let ne = 0; ne < K; ne++) {
      const de = ne / K * Math.PI * 2, fe = (ne + 1) / K * Math.PI * 2;
      T[ne * 9] = 0, T[ne * 9 + 1] = 0, T[ne * 9 + 2] = 0, T[ne * 9 + 3] = 0, T[ne * 9 + 4] = X * Math.cos(de), T[ne * 9 + 5] = X * Math.sin(de), T[ne * 9 + 6] = 0, T[ne * 9 + 7] = X * Math.cos(fe), T[ne * 9 + 8] = X * Math.sin(fe);
    }
    const q = new Fe();
    q.setAttribute("position", new yt(T, 3));
    const R = new Float32Array((K + 1) * 3);
    for (let ne = 0; ne <= K; ne++) {
      const de = ne / K * Math.PI * 2;
      R[ne * 3] = 0, R[ne * 3 + 1] = X * Math.cos(de), R[ne * 3 + 2] = X * Math.sin(de);
    }
    const L = new Fe();
    return L.setAttribute("position", new yt(R, 3)), { fill: q, outline: L };
  }
  function x(I, K, X, T) {
    const q = X ?? K * 0.08, R = T ?? I * 0.07, L = I / 2, ne = K / 2, de = ne - q, fe = R / 2, ae = [];
    function Y(ve, Pe, we, Re) {
      ae.push(0, ve, Pe, 0, we, Pe, 0, we, Re, 0, ve, Pe, 0, we, Re, 0, ve, Re);
    }
    Y(-L, -ne, L, -de), Y(-fe, -de, fe, de), Y(-L, de, L, ne);
    const pe = new Fe();
    pe.setAttribute("position", new yt(new Float32Array(ae), 3));
    const Q = new Float32Array([0, -L, -ne, 0, L, -ne, 0, L, -de, 0, fe, -de, 0, fe, de, 0, L, de, 0, L, ne, 0, -L, ne, 0, -L, de, 0, -fe, de, 0, -fe, -de, 0, -L, -de, 0, -L, -ne]), xe = new Fe();
    return xe.setAttribute("position", new yt(Q, 3)), { fill: pe, outline: xe };
  }
  function P(I, K, X) {
    const T = I / 2, q = K / 2, R = T - X, L = q - X, ne = [];
    function de(pe, Q, xe, ve) {
      ne.push(0, pe, Q, 0, xe, Q, 0, xe, ve, 0, pe, Q, 0, xe, ve, 0, pe, ve);
    }
    de(-T, -q, T, -L), de(-T, L, T, q), de(-T, -L, -R, L), de(R, -L, T, L);
    const fe = new Fe();
    fe.setAttribute("position", new yt(new Float32Array(ne), 3));
    const ae = new Float32Array([0, -T, -q, 0, T, -q, 0, T, -q, 0, T, q, 0, T, q, 0, -T, q, 0, -T, q, 0, -T, -q, 0, -R, -L, 0, R, -L, 0, R, -L, 0, R, L, 0, R, L, 0, -R, L, 0, -R, L, 0, -R, -L]), Y = new Fe();
    return Y.setAttribute("position", new yt(ae, 3)), { fill: fe, outline: Y };
  }
  function $(I, K, X) {
    const T = I / 2, q = K / 2, R = T - X, L = q - X, ne = new Fe(), de = new Float32Array([0, -R, -L, 0, R, -L, 0, R, L, 0, -R, -L, 0, R, L, 0, -R, L]);
    ne.setAttribute("position", new yt(de, 3));
    const fe = [];
    function ae(xe, ve, Pe, we) {
      fe.push(0, xe, ve, 0, Pe, ve, 0, Pe, we, 0, xe, ve, 0, Pe, we, 0, xe, we);
    }
    ae(-T, -q, T, -L), ae(-T, L, T, q), ae(-T, -L, -R, L), ae(R, -L, T, L);
    const Y = new Fe();
    Y.setAttribute("position", new yt(new Float32Array(fe), 3));
    const pe = new Float32Array([0, -T, -q, 0, T, -q, 0, T, -q, 0, T, q, 0, T, q, 0, -T, q, 0, -T, q, 0, -T, -q, 0, -R, -L, 0, R, -L, 0, R, -L, 0, R, L, 0, R, L, 0, -R, L, 0, -R, L, 0, -R, -L]), Q = new Fe();
    return Q.setAttribute("position", new yt(pe, 3)), { concFill: ne, steelFillGeom: Y, outline: Q };
  }
  function _(I, K, X) {
    const T = [], q = [[0, -I / 2, -K / 2], [0, -I / 2 + X, -K / 2], [0, -I / 2 + X, K / 2 - X], [0, I / 2, K / 2 - X], [0, I / 2, K / 2], [0, -I / 2, K / 2]], R = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of R) T.push(...q[fe]);
    const L = new Fe();
    L.setAttribute("position", new yt(new Float32Array(T), 3));
    const ne = [];
    for (let fe = 0; fe < q.length; fe++) {
      const ae = (fe + 1) % q.length;
      ne.push(...q[fe], ...q[ae]);
    }
    const de = new Fe();
    return de.setAttribute("position", new yt(new Float32Array(ne), 3)), { fill: L, outline: de };
  }
  function O(I, K, X, T) {
    const q = T / 2, R = [], L = [[0, -I - q, -K / 2], [0, -X - q, -K / 2], [0, -X - q, K / 2 - X], [0, -q, K / 2 - X], [0, -q, K / 2], [0, -I - q, K / 2]], ne = [[0, q, -K / 2], [0, q + X, -K / 2], [0, q + X, K / 2 - X], [0, I + q, K / 2 - X], [0, I + q, K / 2], [0, q, K / 2]], de = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of de) R.push(...L[pe]);
    for (const pe of de) R.push(...ne[pe]);
    const fe = new Fe();
    fe.setAttribute("position", new yt(new Float32Array(R), 3));
    const ae = [];
    for (const pe of [L, ne]) for (let Q = 0; Q < pe.length; Q++) {
      const xe = (Q + 1) % pe.length;
      ae.push(...pe[Q], ...pe[xe]);
    }
    const Y = new Fe();
    return Y.setAttribute("position", new yt(new Float32Array(ae), 3)), { fill: fe, outline: Y };
  }
  function ye(I, K, X, T) {
    const q = K / 2, R = I, L = [[0, -R, -q], [0, -R, -q + X], [0, -T, -q + X], [0, -T, q - X], [0, -R, q - X], [0, -R, q], [0, 0, q], [0, 0, -q]], ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], de = [];
    for (const pe of ne) de.push(...L[pe]);
    const fe = new Fe();
    fe.setAttribute("position", new yt(new Float32Array(de), 3));
    const ae = [];
    for (let pe = 0; pe < L.length; pe++) {
      const Q = (pe + 1) % L.length;
      ae.push(...L[pe], ...L[Q]);
    }
    const Y = new Fe();
    return Y.setAttribute("position", new yt(new Float32Array(ae), 3)), { fill: fe, outline: Y };
  }
  function be(I, K, X, T, q) {
    const R = K / 2, L = q / 2, ne = [], de = [[0, -I, -R], [0, -I, -R + X], [0, -L - T, -R + X], [0, -L - T, R - X], [0, -I, R - X], [0, -I, R], [0, -L, R], [0, -L, -R]], fe = de.map((xe) => [xe[0], -xe[1], xe[2]]), ae = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const xe of ae) ne.push(...de[xe]);
    for (const xe of ae) ne.push(...fe[xe]);
    const Y = new Fe();
    Y.setAttribute("position", new yt(new Float32Array(ne), 3));
    const pe = [];
    for (const xe of [de, fe]) for (let ve = 0; ve < xe.length; ve++) {
      const Pe = (ve + 1) % xe.length;
      pe.push(...xe[ve], ...xe[Pe]);
    }
    const Q = new Fe();
    return Q.setAttribute("position", new yt(new Float32Array(pe), 3)), { fill: Y, outline: Q };
  }
  function se(I, K, X, T) {
    const q = I / 2, R = K / 2, L = T / 2, ne = [[0, -L, -R], [0, L, -R], [0, L, R - X], [0, q, R - X], [0, q, R], [0, -q, R], [0, -q, R - X], [0, -L, R - X]], de = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], fe = [];
    for (const Q of de) fe.push(...ne[Q]);
    const ae = new Fe();
    ae.setAttribute("position", new yt(new Float32Array(fe), 3));
    const Y = [];
    for (let Q = 0; Q < ne.length; Q++) {
      const xe = (Q + 1) % ne.length;
      Y.push(...ne[Q], ...ne[xe]);
    }
    const pe = new Fe();
    return pe.setAttribute("position", new yt(new Float32Array(Y), 3)), { fill: ae, outline: pe };
  }
  function D(I, K, X = 24) {
    const T = I / 2, q = T - K, R = [];
    for (let fe = 0; fe < X; fe++) {
      const ae = fe / X * Math.PI * 2, Y = (fe + 1) / X * Math.PI * 2, pe = Math.cos(ae), Q = Math.sin(ae), xe = Math.cos(Y), ve = Math.sin(Y);
      R.push(0, T * pe, T * Q, 0, T * xe, T * ve, 0, q * xe, q * ve), R.push(0, T * pe, T * Q, 0, q * xe, q * ve, 0, q * pe, q * Q);
    }
    const L = new Fe();
    L.setAttribute("position", new yt(new Float32Array(R), 3));
    const ne = [];
    for (let fe = 0; fe < X; fe++) {
      const ae = fe / X * Math.PI * 2, Y = (fe + 1) / X * Math.PI * 2;
      ne.push(0, T * Math.cos(ae), T * Math.sin(ae), 0, T * Math.cos(Y), T * Math.sin(Y)), ne.push(0, q * Math.cos(ae), q * Math.sin(ae), 0, q * Math.cos(Y), q * Math.sin(Y));
    }
    const de = new Fe();
    return de.setAttribute("position", new yt(new Float32Array(ne), 3)), { fill: L, outline: de };
  }
  const oe = new ut({ color: 52479, transparent: true, opacity: 0.35, side: Ft, depthWrite: false }), B = new wt({ color: 52479 }), ie = new ut({ color: 16750848, transparent: true, opacity: 0.4, side: Ft, depthWrite: false }), le = new wt({ color: 16750848 });
  function N(I, K) {
    const X = Math.abs(K[0] - I[0]), T = Math.abs(K[1] - I[1]), q = Math.abs(K[2] - I[2]);
    return q > X && q > T || T > X && T > q;
  }
  return te.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const I = l.secColumns.rawVal, K = l.secBeams.rawVal;
    if (!I && !K) {
      f.children.forEach((L) => {
        L instanceof At && L.dispose();
      }), f.clear();
      return;
    }
    f.children.forEach((L) => {
      L instanceof At && L.dispose();
    }), f.clear();
    const X = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!X || !T) return;
    const q = T.sectionShapes, R = l.secFloor.rawVal;
    X.forEach((L, ne) => {
      if (L.length !== 2) return;
      const de = c.rawVal[L[0]], fe = c.rawVal[L[1]];
      if (!de || !fe) return;
      const ae = N(de, fe);
      if (ae && !I || !ae && !K) return;
      if (R >= 0) {
        const ve = Math.min(de[1], fe[1]);
        Math.max(de[1], fe[1]);
        const Pe = l.gridSize.rawVal || 3;
        if (Math.floor(ve / Pe + 0.01) !== R) return;
      }
      const Y = q == null ? void 0 : q.get(ne);
      if (!Y) return;
      const pe = [(de[0] + fe[0]) / 2, (de[1] + fe[1]) / 2, (de[2] + fe[2]) / 2], Q = Do(de, fe);
      if (Y.type === "CFT") {
        const ve = $(Y.b, Y.h, Y.tw ?? Y.b * 0.05), Pe = new it(ve.concFill, oe);
        Pe.position.set(...pe), Pe.rotation.setFromRotationMatrix(Q), f.add(Pe);
        const we = new it(ve.steelFillGeom, ie);
        we.position.set(...pe), we.rotation.setFromRotationMatrix(Q), f.add(we);
        const Re = new zt(ve.outline, le);
        Re.position.set(...pe), Re.rotation.setFromRotationMatrix(Q), f.add(Re);
      } else {
        let ve, Pe, we;
        switch (Y.type) {
          case "rect":
            ve = v(Y.b, Y.h), Pe = oe, we = B;
            break;
          case "circ":
            ve = M(Y.d), Pe = oe, we = B;
            break;
          case "I":
            ve = x(Y.b, Y.h, Y.tf, Y.tw), Pe = ie, we = le;
            break;
          case "HSS":
            ve = P(Y.b, Y.h, Y.tw ?? Y.b * 0.05), Pe = ie, we = le;
            break;
          case "CFT":
            ve = $(Y.b, Y.h, Y.tw ?? Y.b * 0.05), Pe = ie, we = le;
            break;
          case "L":
            ve = _(Y.b ?? Y.h, Y.h, Y.t ?? Y.tw ?? 3e-3), Pe = ie, we = le;
            break;
          case "2L":
            ve = O(Y.b ?? Y.h, Y.h, Y.t ?? Y.tw ?? 3e-3, Y.dis ?? 0.01), Pe = ie, we = le;
            break;
          case "C":
          case "coldC":
            ve = ye(Y.b, Y.h, Y.tf ?? Y.t ?? 3e-3, Y.tw ?? Y.t ?? 3e-3), Pe = ie, we = le;
            break;
          case "2C":
            ve = be(Y.b, Y.h, Y.tf ?? 5e-3, Y.tw ?? 5e-3, Y.dis ?? 0.01), Pe = ie, we = le;
            break;
          case "T":
            ve = se(Y.b, Y.h, Y.tf ?? 0.01, Y.tw ?? 6e-3), Pe = ie, we = le;
            break;
          case "pipe":
            ve = D(Y.d, Y.tw ?? Y.d * 0.05), Pe = ie, we = le;
            break;
          default:
            return;
        }
        const Re = new it(ve.fill, Pe);
        Re.position.set(...pe), Re.rotation.setFromRotationMatrix(Q), f.add(Re);
        const Ue = new zt(ve.outline, we);
        Ue.position.set(...pe), Ue.rotation.setFromRotationMatrix(Q), f.add(Ue);
      }
      const xe = Aa(Y);
      if (xe) {
        const Pe = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(Y.type) ? "#ff9900" : "#00ccff", we = new At(xe, Pe, "transparent");
        we.position.set(pe[0], pe[1], pe[2]);
        const Re = 0.05 * l.gridSize.rawVal * 0.5;
        we.updateScale(Re * ((p == null ? void 0 : p.rawVal) ?? 1)), y.add(we);
      }
    });
  }), p && te.derive(() => {
    if (p.val, !l.sections.rawVal) return;
    const I = 0.05 * l.gridSize.val * 0.5;
    y.children.forEach((K) => {
      K instanceof At && K.updateScale(I * p.rawVal);
    });
  }), te.derive(() => {
    f.visible = l.sections.val;
  }), te.derive(() => {
    y.visible = l.sectionLabels.val;
  }), f;
}
function Va(e) {
  if (!e) return null;
  const l = e.type, c = ($, _) => [$, _], p = ($, _) => [c(-$ / 2, -_ / 2), c($ / 2, -_ / 2), c($ / 2, _ / 2), c(-$ / 2, _ / 2)], f = ($, _ = 24) => {
    const O = $ / 2, ye = [];
    for (let be = 0; be < _; be++) {
      const se = 2 * Math.PI * be / _;
      ye.push(c(O * Math.cos(se), O * Math.sin(se)));
    }
    return ye;
  }, y = e.b ?? 0, v = e.h ?? 0, M = e.d ?? 0, x = e.tw ?? e.t ?? 0, P = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return y && v ? { contorno: p(y, v) } : null;
    case "circ":
      return M ? { contorno: f(M) } : null;
    case "pipe":
      return M && x ? { contorno: f(M), huecos: [f(M - 2 * x).reverse()] } : null;
    case "HSS":
      return y && v && x ? { contorno: p(y, v), huecos: [p(y - 2 * x, v - 2 * (P || x)).reverse()] } : null;
    case "CFT":
      return y && v ? { contorno: p(y, v) } : null;
    case "I":
      return y && v && x && P ? { contorno: [c(-y / 2, -v / 2), c(y / 2, -v / 2), c(y / 2, -v / 2 + P), c(x / 2, -v / 2 + P), c(x / 2, v / 2 - P), c(y / 2, v / 2 - P), c(y / 2, v / 2), c(-y / 2, v / 2), c(-y / 2, v / 2 - P), c(-x / 2, v / 2 - P), c(-x / 2, -v / 2 + P), c(-y / 2, -v / 2 + P)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return y && v && x && P ? { contorno: [c(-y / 2, -v / 2), c(y / 2, -v / 2), c(y / 2, -v / 2 + P), c(-y / 2 + x, -v / 2 + P), c(-y / 2 + x, v / 2 - P), c(y / 2, v / 2 - P), c(y / 2, v / 2), c(-y / 2, v / 2)] } : null;
    case "T":
      return y && v && x && P ? { contorno: [c(-x / 2, -v / 2), c(x / 2, -v / 2), c(x / 2, v / 2 - P), c(y / 2, v / 2 - P), c(y / 2, v / 2), c(-y / 2, v / 2), c(-y / 2, v / 2 - P), c(-x / 2, v / 2 - P)] } : null;
    case "L":
    case "2L":
      return y && v && x ? { contorno: [c(-y / 2, -v / 2), c(y / 2, -v / 2), c(y / 2, -v / 2 + x), c(-y / 2 + x, -v / 2 + x), c(-y / 2 + x, v / 2), c(-y / 2, v / 2)] } : null;
    default:
      return y && v ? { contorno: p(y, v) } : M ? { contorno: f(M) } : null;
  }
}
function $a(e, l, c) {
  if (!e || e <= 0 || !l || !c || l <= 0 || c <= 0) return null;
  const p = Math.sqrt(Math.sqrt(c / l)), f = Math.sqrt(e / p), y = e / f;
  return !isFinite(f) || !isFinite(y) || f <= 0 || y <= 0 ? null : { contorno: [[-f / 2, -y / 2], [f / 2, -y / 2], [f / 2, y / 2], [-f / 2, y / 2]] };
}
function Ta(e) {
  const l = new $n();
  e.contorno.forEach(([c, p], f) => f ? l.lineTo(c, p) : l.moveTo(c, p)), l.closePath();
  for (const c of e.huecos ?? []) {
    const p = new ra();
    c.forEach(([f, y], v) => v ? p.lineTo(f, y) : p.moveTo(f, y)), p.closePath(), l.holes.push(p);
  }
  return l;
}
function La(e, l, c) {
  const p = new rt();
  p.name = "extrusion";
  const f = new zo({ color: 8369151, transparent: true, opacity: 0.92, side: Ft }), y = new zo({ color: 12623968, transparent: true, opacity: 0.85, side: Ft }), v = new zo({ color: 11583173, transparent: true, opacity: 0.85, side: Ft }), M = new rt();
  M.add(new zs(16777215, 0.55));
  const x = new ao(16777215, 0.75);
  x.position.set(30, 25, 40);
  const P = new ao(16777215, 0.35);
  P.position.set(-25, -20, 15), M.add(x, P);
  let $ = 0;
  return te.derive(() => {
    var _a2, _b, _c, _d, _e;
    const _ = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++$, on: _ }, p.visible = _;
    for (const B of [...p.children]) B !== M && (p.remove(B), (_c = (_b = B.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (p.children.includes(M) || p.add(M), !_) return;
    const O = c.val ?? [], ye = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], be = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = be.sectionShapes ?? /* @__PURE__ */ new Map(), D = be.thicknesses ?? /* @__PURE__ */ new Map();
    let oe = "";
    try {
      ye.forEach((B, ie) => {
        var _a3, _b2, _c2;
        if (B.length === 2) {
          let le = Va(se.get(ie)), N = true;
          if (le || (le = $a((_a3 = be.areas) == null ? void 0 : _a3.get(ie), (_b2 = be.momentsOfInertiaY) == null ? void 0 : _b2.get(ie), (_c2 = be.momentsOfInertiaZ) == null ? void 0 : _c2.get(ie)), N = false), !le) return;
          const I = O[B[0]], K = O[B[1]];
          if (!I || !K) return;
          const X = Math.hypot(K[0] - I[0], K[1] - I[1], K[2] - I[2]);
          if (X < 1e-9) return;
          const T = new la(Ta(le), { depth: X, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new io().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const q = new it(T, N ? f : y);
          q.position.set(I[0], I[1], I[2]), q.rotation.setFromRotationMatrix(Do(I, K)), p.add(q);
          return;
        }
        if (B.length === 3 || B.length === 4) {
          const le = D.get(ie);
          if (!le || le <= 0) return;
          const N = B.map((Q) => O[Q]).filter(Boolean);
          if (N.length < 3) return;
          const I = [N[1][0] - N[0][0], N[1][1] - N[0][1], N[1][2] - N[0][2]], K = [N[2][0] - N[0][0], N[2][1] - N[0][1], N[2][2] - N[0][2]], X = I[1] * K[2] - I[2] * K[1], T = I[2] * K[0] - I[0] * K[2], q = I[0] * K[1] - I[1] * K[0], R = Math.hypot(X, T, q);
          if (R < 1e-12) return;
          const L = [X / R, T / R, q / R], ne = [], de = (Q) => N.map((xe) => [xe[0] + L[0] * Q, xe[1] + L[1] * Q, xe[2] + L[2] * Q]), fe = de(+le / 2), ae = de(-le / 2), Y = (Q, xe, ve) => ne.push(...Q, ...xe, ...ve);
          for (const Q of [fe, ae]) Y(Q[0], Q[1], Q[2]), Q.length === 4 && Y(Q[0], Q[2], Q[3]);
          for (let Q = 0; Q < N.length; Q++) {
            const xe = (Q + 1) % N.length;
            Y(fe[Q], ae[Q], ae[xe]), Y(fe[Q], ae[xe], fe[xe]);
          }
          const pe = new Fe();
          pe.setAttribute("position", new St(ne, 3)), pe.computeVertexNormals(), p.add(new it(pe, v));
        }
      });
    } catch (B) {
      oe = String((B == null ? void 0 : B.message) ?? B);
    }
    globalThis.__extrusionDebug = { corridas: $, on: _, fallo: oe, nElementos: ye.length, nFormas: se.size, nEspesores: D.size, mallas: p.children.length - 1 };
  }), p;
}
function Ts(e, l, c = 0) {
  const p = [l[0] - e[0], l[1] - e[1], l[2] - e[2]], f = Math.hypot(p[0], p[1], p[2]) || 1, y = p[0] / f, v = p[1] / f, M = p[2] / f, x = Math.sqrt(y * y + v * v);
  let P, $, _;
  if (x < 1e-9) {
    const O = M > 0 ? 1 : -1;
    P = [0, 0, O], $ = [1, 0, 0], _ = [0, O, 0];
  } else P = [y, v, M], $ = [-y * M / x, -v * M / x, x], _ = [v / x, -y / x, 0];
  if (Math.abs(c) > 1e-12) {
    const O = c * Math.PI / 180, ye = Math.cos(O), be = Math.sin(O), se = $.map((oe, B) => ye * oe + be * _[B]), D = _.map((oe, B) => -be * $[B] + ye * oe);
    $ = se, _ = D;
  }
  return { e1: P, e2: $, e3: _ };
}
function Lo(e, l) {
  if (!l) return [0, 0];
  const c = Number(l[0] ?? 0), p = Number(l[1] ?? 0);
  return e === "bendingsY" ? [c, -p] : [-c, p];
}
function Ls(e, l) {
  const c = (p) => p.map((f) => -f);
  switch (e) {
    case "bendingsZ":
      return c(l.e2);
    case "bendingsY":
      return c(l.e3);
    case "shearsZ":
      return l.e3;
    default:
      return l.e2;
  }
}
class eo extends rt {
  constructor(l, c, p, f, y, v, M) {
    super();
    const x = new $n().moveTo(0, 0).lineTo(0, v[1]).lineTo(p, v[1]).lineTo(p, 0).lineTo(0, 0), P = x.getPoints(), $ = new Fe().setFromPoints(P);
    this.lines = new zt($, new wt({ color: un().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(f), M && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const _ = new so(x), O = new ut({ color: v[1] > 0 ? 24435 : 11411474, side: Ft });
    this.mesh = new it(_, O), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(f), M && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new At(`${y[1].toFixed(4)}`), this.normalizedResult = v, this.textPosition = Tn([l, c]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(f), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Vo extends rt {
  constructor(l, c, p, f, y, v, M) {
    super();
    const x = y[0] * p / (y[0] + y[1]), P = y[0] * y[1] > 0;
    if (this.text = new At(`${y[0].toFixed(4)}`), this.text2 = new At(`${(y[1] * -1).toFixed(4)}`), this.normalizedResult = v, this.textPosition = To(l, c), this.text2Position = To(c, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(f), this.text2.rotation.setFromRotationMatrix(f), this.add(this.text, this.text2), P) {
      const $ = new $n().moveTo(0, 0).lineTo(0, v[0]).lineTo(x, 0).lineTo(0, 0), _ = new $n().moveTo(x, 0).lineTo(p, -v[1]).lineTo(p, 0).lineTo(x, 0), O = $.getPoints(), ye = _.getPoints(), be = new Fe().setFromPoints(O), se = new Fe().setFromPoints(ye), D = new wt({ color: un().resultOutline });
      this.lines = new zt(be, D), this.lines2 = new zt(se, D), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(f), this.lines2.rotation.setFromRotationMatrix(f), M && this.lines.rotateX(Math.PI / 2), M && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const oe = new so($), B = new so(_), ie = new ut({ color: v[0] > 0 ? 24435 : 11411474, side: Ft }), le = new ut({ color: -v[1] > 0 ? 24435 : 11411474, side: Ft });
      this.mesh = new it(oe, ie), this.mesh2 = new it(B, le), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(f), this.mesh2.rotation.setFromRotationMatrix(f), M && this.mesh.rotateX(Math.PI / 2), M && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const $ = new $n().moveTo(0, 0).lineTo(0, v[0]).lineTo(p, -v[1]).lineTo(p, 0).lineTo(0, 0), _ = $.getPoints(), O = new Fe().setFromPoints(_);
      this.lines = new zt(O, new wt({ color: un().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(f), M && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const ye = new so($), be = new ut({ color: v[0] > 0 ? 24435 : 11411474, side: Ft });
      this.mesh = new it(ye, be), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(f), M && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
var Is = ((e) => (e.normals = "normals", e.shearsY = "shearsY", e.shearsZ = "shearsZ", e.torsions = "torsions", e.bendingsY = "bendingsY", e.bendingsZ = "bendingsZ", e))(Is || {});
function Ia(e, l, c, p) {
  const f = () => {
    const M = c.rawVal;
    if (!(M == null ? void 0 : M.length)) return 0.05 * l.gridSize.rawVal;
    const x = [1 / 0, 1 / 0, 1 / 0], P = [-1 / 0, -1 / 0, -1 / 0];
    for (const _ of M) for (let O = 0; O < 3; O++) _[O] < x[O] && (x[O] = _[O]), _[O] > P[O] && (P[O] = _[O]);
    const $ = Math.hypot(P[0] - x[0], P[1] - x[1], P[2] - x[2]);
    return !isFinite($) || $ <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * $;
  }, y = new rt(), v = { normals: eo, shearsY: eo, shearsZ: eo, torsions: eo, bendingsY: Vo, bendingsZ: Vo };
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, c.val, l.frameResults.val == "none") return;
    y.children.forEach((x) => x.dispose()), y.clear();
    const M = Is[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[M]) == null ? void 0 : _b.forEach((x, P) => {
      var _a3, _b2, _c, _d, _e, _f;
      const $ = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[P]) ?? [0, 1], _ = c.rawVal[$[0]], O = c.rawVal[$[1]];
      if (!_ || !O) return;
      const ye = new F(...O).distanceTo(new F(..._)), be = Ra((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[M]), se = ((_f = (_e = (_d = (_c = e.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, P)) ?? 0, D = Ts(_, O, se), oe = Ls(M, D), B = new F(...D.e1), ie = new F(...oe), le = new io().makeBasis(B, ie, B.clone().cross(ie)), [N, I] = Lo(M, x), K = v[M] === Vo ? [N, -I] : [N, I], X = K.map((q) => q / (be === 0 ? 1 : be)), T = new v[M](_, O, ye, le, K, X, false);
      T.updateScale(f() * p.rawVal), y.add(T);
    });
  }), te.derive(() => {
    if (p.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const M = f();
    y.children.forEach((x) => x.updateScale(M * p.rawVal));
  }), te.derive(() => {
    y.visible = l.frameResults.val != "none";
  }), y;
}
function Ra(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((c) => {
    const p = Math.max(...(c ?? [0, 0]).map((f) => Math.abs(f)));
    p > l && (l = p);
  }), l;
}
class Da extends rt {
  constructor(l, c, p) {
    super();
    const f = c === Bo.reactions;
    p[0] && (this.xText1 = new At(`${f ? "Fx" : "Dx"}: ` + p[0].toFixed(4))), p[3] && (this.xText2 = new At(`${f ? "Mx" : "Rx"}: ` + p[3].toFixed(4))), p[1] && (this.yText1 = new At(`${f ? "Fy" : "Dy"}: ` + p[1].toFixed(4))), p[4] && (this.yText2 = new At(`${f ? "My" : "Ry"}: ` + p[4].toFixed(4))), p[2] && (this.zText1 = new At(`${f ? "Fz" : "Dz"}: ` + p[2].toFixed(4))), p[5] && (this.zText2 = new At(`${f ? "Mz" : "Rz"}: ` + p[5].toFixed(4))), (p[0] || p[3]) && (this.xArrow = new pn(new F(1, 0, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[1] || p[4]) && (this.yArrow = new pn(new F(0, 1, 0), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), (p[2] || p[5]) && (this.zArrow = new pn(new F(0, 0, 1), new F(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
var Bo = ((e) => (e.deformations = "deformations", e.reactions = "reactions", e))(Bo || {});
function Ba(e, l, c, p) {
  const f = new rt();
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    f.children.forEach((M) => M.dispose()), f.clear();
    const y = Bo[l.nodeResults.rawVal], v = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[y]) == null ? void 0 : _b.forEach((M, x) => {
      const P = new Da(c.rawVal[x], y, M ?? [0, 0, 0, 0, 0, 0]);
      P.updateScale(v * p.rawVal), f.add(P);
    });
  }), te.derive(() => {
    if (p.val, l.nodeResults.rawVal == "none") return;
    const y = 0.05 * l.gridSize.val;
    f.children.forEach((v) => v.updateScale(y * p.rawVal));
  }), te.derive(() => {
    f.visible = l.nodeResults.val != "none";
  }), f;
}
function Na({ drawingObj: e, gridObj: l, scene: c, getActiveCamera: p, controls: f, gridSize: y, derivedDisplayScale: v, rendererElm: M, viewerRender: x }) {
  var _a2;
  const P = new ca(), $ = new da(), _ = (n) => {
    const o = M.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const h = s / 2;
      if (a >= h) return $.x = (a - h) / h * 2 - 1, $.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? p();
      $.x = a / h * 2 - 1;
    } else $.x = a / s * 2 - 1;
    return $.y = -(t / i) * 2 + 1, p();
  }, O = new it(new ln(1e4, 1e4), new ut({ side: Ft, transparent: true, opacity: 0, depthWrite: false }));
  O.visible = true, O.frustumCulled = false, c.add(O);
  const ye = (n, o, a) => {
    const t = new it(new ln(1e4, 1e4), new ut({ side: Ft, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, c.add(t), t;
  }, be = ye(Math.PI / 2, 0, 0), se = ye(0, Math.PI / 2, 0);
  let D = false;
  const oe = () => {
    if (D) return P.intersectObjects([O], false);
    if (be.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && at.visible) {
      const a = P.intersectObjects([at, ft, Be], false);
      if (a.length > 0) return a;
    }
    const o = [O];
    return be.visible && o.push(be), se.visible && o.push(se), nn.visible && mn.length > 0 && o.push(...mn), P.intersectObjects(o, false);
  }, B = new no(new Fe(), new oo()), ie = new no(new Fe(), new oo({ color: "gray", sizeAttenuation: false, size: 6 })), le = new no(new Fe(), new oo({ color: "orange", sizeAttenuation: false, size: 5 }));
  c.add(le);
  const N = document.createElement("input");
  N.id = "hk-rubber-label", N.type = "text", N.spellcheck = false, N.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, N.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(N);
  let I = null, K = null, X = false;
  const T = new F(), q = (n, o, a, t, s, i) => {
    const d = t - n, h = s - o, m = i - a, g = Math.hypot(d, h, m);
    if (g < 0.01) {
      N.style.display = "none";
      return;
    }
    I = [n, o, a], K = [d / g, h / g, m / g], T.set((n + t) / 2, (o + s) / 2, (a + i) / 2), T.project(p());
    const k = M.getBoundingClientRect(), w = k.left + (T.x * 0.5 + 0.5) * k.width, r = k.top + (-T.y * 0.5 + 0.5) * k.height;
    if (N.style.left = w + "px", N.style.top = r + "px", N.style.display = "block", !X) {
      if (N.value = `${g.toFixed(2)} m`, document.activeElement !== N) {
        const S = document.activeElement;
        S && (S.tagName === "INPUT" || S.tagName === "TEXTAREA") && S !== N || N.focus({ preventScroll: true });
      }
      try {
        N.select();
      } catch {
      }
    }
  }, R = () => {
    N.style.display = "none", I = null, K = null, X = false, document.activeElement === N && N.blur();
  }, L = (n) => {
    var _a3, _b, _c, _d, _e, _f, _g, _h;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (o === "offset") {
      dn = n, ce(`\u21C9 DESFASE distancia ${n} m \u2014 designe la l\xEDnea y luego el lado.`), N.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (o === "circle" && qe.length === 1) {
      const k = qe[0];
      qe = [], (_e = window.__hekatanDrawCircle) == null ? void 0 : _e.call(window, k[0], k[1], k[2], n), ce(`\u2713 C\xEDrculo r=${n} m en (${k[0].toFixed(2)}, ${k[1].toFixed(2)}, ${k[2].toFixed(2)}).`);
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
      bt = n, ce(`\u{1F4D0} Altura ${n}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[o]}.`), N.blur();
      return;
    }
    if (!I || !K || !e.polylines) return;
    let a = K[0], t = K[1], s = K[2];
    Ne === "x" ? (a = Math.sign(a) || 1, t = 0, s = 0) : Ne === "y" ? (a = 0, t = Math.sign(t) || 1, s = 0) : Ne === "z" && (a = 0, t = 0, s = Math.sign(s) || 1);
    const i = I[0] + a * n, d = I[1] + t * n, h = I[2] + s * n;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, d, h]];
    const m = e.polylines.rawVal, g = m.length ? m[m.length - 1] : [];
    e.polylines.val = [...m.slice(0, -1), [...g, e.points.rawVal.length - 1]], N.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    x();
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
  }, de = (n) => {
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
  }, fe = (n) => {
    var _a3, _b;
    if (!e.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, n];
    const o = e.polylines.rawVal, a = o.length ? o[o.length - 1] : [];
    e.polylines.val = [...o.slice(0, -1), [...a, e.points.rawVal.length - 1]], I = n, N.blur();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    x();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (n) => {
    var _a3;
    const o = ne(n);
    if (!o) return false;
    if (o.kind === "length") return L(o.L), true;
    const a = de(o);
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
      if (X = false, a.kind === "length") L(a.L), ce(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
      else {
        const t = de(a);
        if (!t) return;
        fe(t);
        const s = a.kind;
        ce(`\u270F ${s} \u2192 (${t[0].toFixed(2)}, ${t[1].toFixed(2)}, ${t[2].toFixed(2)})`);
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
    if (!I || !K || document.activeElement === N) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(n.key) && (N.value = n.key, N.focus(), N.setSelectionRange(1, 1), n.preventDefault());
  });
  const ae = document.createElement("div");
  ae.id = "hk-coord-readout", ae.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ae.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ae);
  const Y = document.createElement("div");
  Y.id = "hk-coord-fixed", Y.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Y.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Y);
  const pe = new zt(new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new An({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  pe.frustumCulled = false, pe.visible = false, pe.name = "rubberBand", c.add(pe), window.__hekatanRubberBand = pe;
  const Q = new zt(new Fe(), new wt({ color: 2282478, transparent: true, opacity: 0.9 }));
  Q.frustumCulled = false, Q.visible = false, c.add(Q);
  let xe = [];
  const ve = new zt(new Fe(), new wt({ color: 16763904, transparent: true, opacity: 0.95 }));
  ve.frustumCulled = false, ve.visible = false, ve.renderOrder = 999, c.add(ve);
  let Pe = [];
  const we = document.createElement("div");
  we.id = "hk-measure-label", we.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:4px;padding:2px 7px;font:600 12px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(we);
  const Re = (n) => {
    var _a3, _b;
    const o = _(n);
    if (!o) return null;
    P.setFromCamera($, o);
    let a = null, t = null;
    const s = P.intersectObjects(c.children, true).filter((r) => r.object.isMesh && r.object !== xt && r.object !== et && r.object.visible !== false);
    if (s.length) {
      const r = s[0], S = r.point;
      a = [S.x, S.y, S.z];
      const Z = (_b = (_a3 = r.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      Z && r.face && (t = [r.face.a, r.face.b, r.face.c].map((b) => {
        const u = new F().fromBufferAttribute(Z, b);
        return r.object.localToWorld(u), [u.x, u.y, u.z];
      }));
    } else {
      const r = oe();
      if (r.length) {
        const S = r[0].point;
        a = [S.x, S.y, S.z];
      }
    }
    if (!a) return null;
    const i = M.getBoundingClientRect(), d = (r) => {
      const S = new F(r[0], r[1], r[2]).project(o);
      return [i.left + (S.x * 0.5 + 0.5) * i.width, i.top + (-S.y * 0.5 + 0.5) * i.height];
    }, h = [n.clientX, n.clientY], m = 14;
    let g = a, k = m;
    const w = (r) => {
      const S = d(r), W = Math.hypot(S[0] - h[0], S[1] - h[1]);
      W < k && (k = W, g = r);
    };
    for (const r of t ?? []) w(r);
    for (const r of e.points.rawVal) w(r);
    return g;
  }, Ue = () => {
    if (Pe.length < 1) {
      we.style.display = "none";
      return;
    }
    const n = p(), o = Pe[0], a = Pe[1] ?? Pe[0], s = new F((o[0] + a[0]) / 2, (o[1] + a[1]) / 2, (o[2] + a[2]) / 2).clone().project(n), i = M.getBoundingClientRect();
    we.style.left = i.left + (s.x * 0.5 + 0.5) * i.width + "px", we.style.top = i.top + (-s.y * 0.5 + 0.5) * i.height - 14 + "px", we.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Ue;
  try {
    (_a2 = f.addEventListener) == null ? void 0 : _a2.call(f, "change", Ue);
  } catch {
  }
  const et = new it(new Fe(), new ut({ color: 16096779, transparent: true, opacity: 0.35, side: Ft, depthWrite: false }));
  et.frustumCulled = false, et.visible = false, et.renderOrder = 998, et.name = "hk-fill-preview", c.add(et), M.addEventListener("pointerleave", () => {
    et.visible && (et.visible = false, x());
  });
  const gt = (n) => {
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
      for (const C of t.get(u)) if (C !== b) for (const E of t.get(C)) {
        if (E === b || E === u || !i(E, b) || i(b, C) || i(u, E)) continue;
        const G = [b, u, C, E].slice().sort((z, A) => z - A).join("-");
        h.has(G) || (h.add(G), d.push([b, u, C, E]));
      }
    }
    for (const b of m) for (const u of t.get(b)) if (!(u < b)) for (const C of t.get(u)) {
      if (C === b || !i(C, b)) continue;
      const E = [b, u, C].slice().sort((G, z) => G - z).join("-");
      h.has(E) || (h.add(E), d.push([b, u, C]));
    }
    const g = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", k = (b) => g === "xy" ? [b[0], b[1]] : g === "xz" ? [b[0], b[2]] : [b[1], b[2]], w = k(n), r = (b, u) => {
      let C = false;
      for (let E = 0, G = u.length - 1; E < u.length; G = E++) {
        const z = u[E][0], A = u[E][1], U = u[G][0], ee = u[G][1];
        A > b[1] != ee > b[1] && b[0] < (U - z) * (b[1] - A) / (ee - A) + z && (C = !C);
      }
      return C;
    }, S = (b) => {
      let u = 0;
      for (let C = 0, E = b.length - 1; C < b.length; E = C++) u += (b[E][0] + b[C][0]) * (b[E][1] - b[C][1]);
      return Math.abs(u) / 2;
    };
    let W = null, Z = 1 / 0;
    for (const b of d) {
      const u = b.map((E) => k(o[E]));
      if (!r(w, u)) continue;
      const C = S(u);
      C < Z && (Z = C, W = b);
    }
    return W;
  }, V = new rt(), H = new it(new ln(1, 1), new ut({ color: 2282478, transparent: true, opacity: 0.08, side: Ft, depthWrite: false })), j = new jt(new hs(new ln(1, 1)), new wt({ color: 2282478, transparent: true, opacity: 0.85 })), J = new jt(new Fe(), new wt({ color: 2282478, transparent: true, opacity: 0.3 })), ge = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-n, i, 0, n, i, 0), a.push(i, -n, 0, i, n, 0);
    }
    J.geometry.dispose(), J.geometry = new Fe(), J.geometry.setAttribute("position", new St(a, 3));
  };
  V.add(H, j, J), V.visible = false, V.frustumCulled = false, c.add(V);
  const he = new rt();
  he.frustumCulled = false, he.visible = false, c.add(he);
  const ke = (n) => {
    const o = new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), a = new An({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new zt(o, a);
  }, me = ke(16711680), De = ke(65280), Ve = ke(35071);
  he.add(me, De, Ve);
  const tt = [], Oe = (n) => n.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Ye = ke(16761856);
  Ye.material.dashSize = 0.28, Ye.material.gapSize = 0.16, Ye.material.opacity = 0.9, Ye.frustumCulled = false, Ye.visible = false, Ye.renderOrder = 98, c.add(Ye);
  const vt = (n) => {
    const o = new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0), new F(0, 0, 0)]), a = new wt({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new Cs(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, He = vt(3462041), Me = vt(16724804), Ae = vt(6333946), ct = new rt();
  ct.frustumCulled = false, ct.visible = false, c.add(ct), ct.add(He, Me, Ae);
  const Ge = (n) => {
    const o = new ln(1, 1), a = new ut({ color: n, transparent: true, opacity: 0.06, side: Ft, depthWrite: false }), t = new it(o, a);
    return t.frustumCulled = false, t.renderOrder = 996, t;
  }, at = Ge(3462041), ft = Ge(16724804), Be = Ge(6333946);
  ct.add(at, ft, Be);
  const Le = (n, o, a, t) => {
    n.scale.set(2 * t, 2 * t, 1), a === "xy" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, 0, 0)) : a === "xz" ? (n.position.set(o[0], o[1], o[2]), n.rotation.set(Math.PI / 2, 0, 0)) : (n.position.set(o[0], o[1], o[2]), n.rotation.set(0, Math.PI / 2, 0));
  }, ze = document.createElement("div");
  ze.id = "hk-refplane-badge", ze.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(ze), window.__hekatanSetOrthoPlanes = (n) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = n, ct.visible = n, n) {
      const o = window.__hekatanOrthoAnchor, a = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], d = window.__hekatanOrthoExt ?? 8;
      Ce(He, i, "xy", d), Ce(Me, i, "xz", d), Ce(Ae, i, "yz", d), Le(at, i, "xy", d), Le(ft, i, "xz", d), Le(Be, i, "yz", d), at.material.opacity = 0.05, ft.material.opacity = 0.05, Be.material.opacity = 0.05;
    } else {
      const o = document.getElementById("hk-refplane-badge");
      o && (o.style.display = "none");
    }
    x();
  }, window.__hekatanSetOrthoExt = (n) => {
    var _a3;
    if (window.__hekatanOrthoExt = n, !ct.visible) {
      x();
      return;
    }
    const o = window.__hekatanOrthoAnchor, a = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0];
    Ce(He, i, "xy", n), Ce(Me, i, "xz", n), Ce(Ae, i, "yz", n), Le(at, i, "xy", n), Le(ft, i, "xz", n), Le(Be, i, "yz", n), x();
  };
  const We = (n) => {
    if (at.material.opacity = n === "xy" ? 0.09 : 0.025, ft.material.opacity = n === "xz" ? 0.09 : 0.025, Be.material.opacity = n === "yz" ? 0.09 : 0.025, n) {
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
  const Ee = document.createElement("div");
  Ee.id = "hk-axis-lock-badge", Ee.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Ee);
  const nt = () => {
    if (!Ne) {
      Ee.style.display = "none";
      return;
    }
    const n = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Ee.style.background = "rgba(15,23,42,0.92)", Ee.style.color = n[Ne], Ee.style.border = `1.5px solid ${n[Ne]}`, Ee.textContent = `\u{1F512} LOCK ${Ne.toUpperCase()}`, Ee.style.display = "block";
  };
  window.addEventListener("keydown", (n) => {
    var _a3, _b, _c, _d, _e, _f;
    const o = document.activeElement;
    if (o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") && o !== N) return;
    const a = n.key.toLowerCase(), t = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (n.key === "Enter" && t === "polyarea" && xe.length >= 3) {
      const s = ro();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${s} shells Q4 creados.`), n.preventDefault();
      return;
    }
    if (a === "x" || a === "y" || a === "z") Ne = Ne === a ? null : a, nt(), n.preventDefault();
    else if (n.key === "Escape") {
      const s = document.activeElement;
      s && (s.tagName === "INPUT" || s.tagName === "TEXTAREA") && s.blur(), os(), n.preventDefault();
    } else n.key === "F3" ? (n.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : n.key === "F10" ? (n.preventDefault(), (_e = window.__hekatanTogglePolar) == null ? void 0 : _e.call(window)) : n.key === "F8" && (n.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const n = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = n, n || Kn(), ce(`\u{1F9F2} OSNAP ${n ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const n = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = n, n || (he.visible = false), ce(`\u25C8 POLAR ${n ? "ON" : "OFF"} (F10)`);
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
  const ht = new zt(new Fe().setFromPoints([new F(0, 0, 0), new F(0, 0, 0)]), new wt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  ht.renderOrder = 998, ht.frustumCulled = false, ht.visible = false, c.add(ht);
  let mt = -1, Nt = -1, Qt = -1;
  const Xe = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Xe;
  const Xt = new zt(new Fe().setFromPoints([new F(), new F()]), new wt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
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
      const g = Math.hypot(n - m[0], o - m[1], a - m[2]);
      g < d && (d = g, i = h);
    }
    return i;
  }, Yt = () => {
    var _a3, _b, _c, _d, _e, _f, _g, _h;
    for (; Gt.children.length; ) {
      const d = Gt.children.pop();
      (_b = (_a3 = d.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = d.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = ((_e = e.points) == null ? void 0 : _e.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const d of Xe) {
      const [h, ...m] = d.split(":");
      if (h === "pt") {
        const g = n[+m[0]];
        if (!g) continue;
        const k = new it(new bn(0.025, 12, 12), new ut({ color: hn, transparent: true, opacity: 0.9, depthTest: false }));
        k.position.set(g[0], g[1], g[2]), k.renderOrder = 999, k.__isSelectionPt = true, Gt.add(k);
      } else if (h === "seg") {
        const g = o[+m[0]], k = n[g == null ? void 0 : g[+m[1]]], w = n[g == null ? void 0 : g[+m[1] + 1]];
        if (!k || !w) continue;
        const r = new Fe().setFromPoints([new F(k[0], k[1], k[2]), new F(w[0], w[1], w[2])]), S = new zt(r, new wt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        S.renderOrder = 999, Gt.add(S);
      } else if (h === "poly") {
        const k = o[+m[0]].map((S) => {
          const W = n[S];
          return W ? new F(W[0], W[1], W[2]) : null;
        }).filter(Boolean);
        if (k.length < 2) continue;
        const w = new Fe().setFromPoints(k), r = new zt(w, new wt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        r.renderOrder = 999, Gt.add(r);
      } else if (h === "aux") {
        const g = t[+m[0]];
        if (!g || g.length !== 6) continue;
        const k = new Fe().setFromPoints([new F(g[0], g[1], g[2]), new F(g[3], g[4], g[5])]), w = new zt(k, new wt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
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
    x();
  };
  window.__hekatanRefreshSelection = Yt, window.__hekatanClearSelection = () => {
    Xe.clear(), Yt();
  };
  const sn = (n, o, a, t, s, i, d, h, m) => {
    const g = d - t, k = h - s, w = m - i, r = g * g + k * k + w * w;
    if (r < 1e-12) return Math.hypot(n - t, o - s, a - i);
    let S = ((n - t) * g + (o - s) * k + (a - i) * w) / r;
    S = Math.max(0, Math.min(1, S));
    const W = t + S * g, Z = s + S * k, b = i + S * w;
    return Math.hypot(n - W, o - Z, a - b);
  }, Mn = (n, o, a, t) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let d = -1, h = -1, m = t;
    for (let g = 0; g < s.length; g++) {
      const k = s[g];
      for (let w = 0; w < k.length - 1; w++) {
        const r = i[k[w]], S = i[k[w + 1]];
        if (!r || !S) continue;
        const W = sn(n, o, a, r[0], r[1], r[2], S[0], S[1], S[2]);
        W < m && (m = W, d = g, h = w);
      }
    }
    return d >= 0 ? { polyIdx: d, segIdx: h, dist: m } : null;
  }, Dn = (n, o, a, t) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let d = -1, h = t;
    for (let m = 0; m < i.length; m++) {
      const g = i[m];
      if (!g || g.length !== 6) continue;
      const k = sn(n, o, a, g[0], g[1], g[2], g[3], g[4], g[5]);
      k < h && (h = k, d = m);
    }
    return d;
  }, Bn = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      ht.visible = false;
      return;
    }
    ht.geometry.setFromPoints([new F(t[0], t[1], t[2]), new F(t[3], t[4], t[5])]), ht.visible = true;
  }, Nn = (n, o = -1) => {
    var _a3, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[n], t = e.points.rawVal;
    if (!a || a.length < 2) {
      ht.visible = false;
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
    ht.geometry.setFromPoints(i), ht.visible = true;
  }, Xn = (n) => {
    var _a3;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (n < 0 || n >= o.length) return;
    const a = o.filter((m, g) => g !== n), t = /* @__PURE__ */ new Set();
    for (const m of a) for (const g of m) t.add(g);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), d = [];
    for (let m = 0; m < s.length; m++) t.has(m) && (i.set(m, d.length), d.push(s[m]));
    const h = a.map((m) => m.map((g) => i.get(g)).filter((g) => g !== void 0));
    e.points.val = d, e.polylines.val = h, e.areas && (e.areas.val = e.areas.rawVal.filter((m) => m !== n).map((m) => m > n ? m - 1 : m)), ht.visible = false, mt = -1, Nt = -1;
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
    for (const r of d) for (const S of r) h.add(S);
    const m = e.points.rawVal, g = /* @__PURE__ */ new Map(), k = [];
    for (let r = 0; r < m.length; r++) h.has(r) && (g.set(r, k.length), k.push(m[r]));
    const w = d.map((r) => r.map((S) => g.get(S)).filter((S) => S !== void 0));
    if (e.points.val = k, e.polylines.val = w, e.areas) {
      const r = i.length - 1;
      e.areas.val = e.areas.rawVal.map((S) => S > n ? S + r : S);
    }
    ht.visible = false, mt = -1, Nt = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  B.geometry.setAttribute("position", new St(e.points.rawVal.flat(), 3)), B.geometry.computeBoundingSphere(), B.frustumCulled = false, ie.frustumCulled = false, c.add(ie), O.position.set(0, 0, 0), O.rotateX(Math.PI / 2), O.geometry.rotateX(Math.PI / 2), O.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
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
      const h = [0, 1, 2].map((k) => d.reduce((w, r) => w + r[k], 0) / d.length), m = d.map((k) => Math.hypot(k[0] - h[0], k[1] - h[1], k[2] - h[2])), g = m.reduce((k, w) => k + w, 0) / m.length;
      g < 1e-9 || m.some((k) => Math.abs(k - g) > 5e-3 * g) || t.push({ c: h, r: g });
    }
    return Xo = t;
  };
  window.__hekatanCentrosDeducidos = Zo, window.__hekatanDrawCircle = (n, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a3;
    const d = Math.max(4, Math.round(s)), h = e.points.rawVal.length, m = [];
    for (let g = 0; g < d; g++) {
      const k = 2 * Math.PI * g / d, w = t * Math.cos(k), r = t * Math.sin(k);
      let S;
      i === "xy" ? S = [n + w, o + r, a] : i === "xz" ? S = [n + w, o, a + r] : S = [n, o + w, a + r], m.push(S);
    }
    if (e.points.val = [...e.points.rawVal, ...m], Yn.push({ c: [n, o, a], r: t }), e.polylines) {
      const g = [...m.map((w, r) => h + r), h], k = e.polylines.rawVal;
      ((_a3 = k[k.length - 1]) == null ? void 0 : _a3.length) > 0 ? e.polylines.val = [...k, g, []] : e.polylines.val = [...k.slice(0, -1), g, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(t)), i = new F(...n), d = new F(...o), h = new F(...a), m = new F().subVectors(d, i), g = new F().subVectors(h, i), k = new F().crossVectors(m, g).normalize(), w = new F().addVectors(i, d).multiplyScalar(0.5), r = new F().addVectors(d, h).multiplyScalar(0.5), S = new F().crossVectors(m, k).normalize(), W = new F().crossVectors(new F().subVectors(h, d), k).normalize(), Z = new F().subVectors(r, w), b = S.x * W.y - S.y * W.x;
    let u;
    if (Math.abs(b) > 1e-9) {
      const ue = (Z.x * W.y - Z.y * W.x) / b;
      u = new F().addVectors(w, S.clone().multiplyScalar(ue));
    } else u = w.clone();
    const C = i.distanceTo(u), E = new F().subVectors(i, u), G = new F().subVectors(h, u), z = Math.acos(Math.max(-1, Math.min(1, E.dot(G) / (C * C)))), A = e.points.rawVal.length, U = [], ee = k.clone();
    for (let ue = 0; ue <= s; ue++) {
      const _e = ue / s, Ke = z * _e, $e = new Qn().setFromAxisAngle(ee, Ke), Qe = E.clone().applyQuaternion($e).add(u);
      U.push([Qe.x, Qe.y, Qe.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...U], Yn.push({ c: [u.x, u.y, u.z], r: C }), e.polylines) {
      const ue = U.map((Ke, $e) => A + $e), _e = e.polylines.rawVal;
      e.polylines.val = [..._e.slice(0, -1), ue, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(n[0], o[0]), d = Math.max(n[0], o[0]), h = Math.min(n[1], o[1]), m = Math.max(n[1], o[1]), g = (n[2] + o[2]) / 2, k = d - i, w = m - h, r = Math.min(a, k / 2 - 0.01, w / 2 - 0.01);
    if (r <= 0) return;
    const S = e.points.rawVal.length, W = [], Z = [], b = (u, C) => {
      W.push([u, C, g]), Z.push(S + W.length - 1);
    };
    for (let u = 0; u <= s; u++) b(i + r + (k - 2 * r) * u / s, h);
    for (let u = 1; u <= t; u++) {
      const C = -Math.PI / 2 + Math.PI / 2 * u / t;
      b(d - r + r * Math.cos(C), h + r + r * Math.sin(C));
    }
    for (let u = 1; u <= s; u++) b(d, h + r + (w - 2 * r) * u / s);
    for (let u = 1; u <= t; u++) {
      const C = 0 + Math.PI / 2 * u / t;
      b(d - r + r * Math.cos(C), m - r + r * Math.sin(C));
    }
    for (let u = 1; u <= s; u++) b(d - r - (k - 2 * r) * u / s, m);
    for (let u = 1; u <= t; u++) {
      const C = Math.PI / 2 + Math.PI / 2 * u / t;
      b(i + r + r * Math.cos(C), m - r + r * Math.sin(C));
    }
    for (let u = 1; u <= s; u++) b(i, m - r - (w - 2 * r) * u / s);
    for (let u = 1; u <= t; u++) {
      const C = Math.PI + Math.PI / 2 * u / t;
      b(i + r + r * Math.cos(C), h + r + r * Math.sin(C));
    }
    if (Z.push(S), e.points.val = [...e.points.rawVal, ...W], e.polylines) {
      const u = e.polylines.rawVal;
      e.polylines.val = [...u.slice(0, -1), Z, []];
    }
  }, window.__hekatanDrawRect = (n, o) => {
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], d = o[0], h = o[1], m = o[2];
    let g;
    if (Math.abs(i - m) < 1e-6 ? g = [[t, s, i], [d, s, i], [d, h, i], [t, h, i]] : Math.abs(s - h) < 1e-6 ? g = [[t, s, i], [d, s, i], [d, s, m], [t, s, m]] : g = [[t, s, i], [t, h, i], [t, h, m], [t, s, m]], e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const k = [a, a + 1, a + 2, a + 3, a], w = e.polylines.rawVal;
      e.polylines.val = [...w.slice(0, -1), k, []];
    }
  }, window.__hekatanDrawRectArea = (n, o) => {
    var _a3;
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], d = o[0], h = o[1], m = o[2];
    let g;
    if (D && e.gridTarget) {
      const k = e.gridTarget.rawVal, w = new En(...k.rotation), r = new F(1, 0, 0).applyEuler(w), S = new F(0, 1, 0).applyEuler(w), W = new F(...k.position), Z = new F(t, s, i), b = new F(d, h, m), u = Z.clone().sub(W).dot(r), C = Z.clone().sub(W).dot(S), E = b.clone().sub(W).dot(r), G = b.clone().sub(W).dot(S), z = (A, U) => W.clone().addScaledVector(r, A).addScaledVector(S, U).toArray();
      g = [z(u, C), z(E, C), z(E, G), z(u, G)];
    } else Math.abs(i - m) < 1e-6 ? g = [[t, s, i], [d, s, i], [d, h, i], [t, h, i]] : Math.abs(s - h) < 1e-6 ? g = [[t, s, i], [d, s, i], [d, s, m], [t, s, m]] : g = [[t, s, i], [t, h, i], [t, h, m], [t, s, m]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...g], e.polylines) {
      const k = e.polylines.rawVal, w = k.length - 1, r = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [...k.slice(0, -1), r, []], e.areas && (e.areas.val = [...e.areas.rawVal, w]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    x();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = /* @__PURE__ */ new Map(), a = (w, r) => {
      w !== r && ((o.get(w) ?? o.set(w, /* @__PURE__ */ new Set()).get(w)).add(r), (o.get(r) ?? o.set(r, /* @__PURE__ */ new Set()).get(r)).add(w));
    };
    for (const w of n) for (let r = 0; r + 1 < w.length; r++) a(w[r], w[r + 1]);
    const t = (w, r) => {
      var _a4;
      return !!((_a4 = o.get(w)) == null ? void 0 : _a4.has(r));
    }, s = /* @__PURE__ */ new Set(), i = [], d = [...o.keys()];
    for (const w of d) for (const r of o.get(w)) if (!(r < w)) {
      for (const S of o.get(r)) if (S !== w) for (const W of o.get(S)) {
        if (W === w || W === r || !t(W, w) || t(w, S) || t(r, W)) continue;
        const Z = [w, r, S, W].slice().sort((b, u) => b - u).join("-");
        s.has(Z) || (s.add(Z), i.push([w, r, S, W]));
      }
    }
    for (const w of d) for (const r of o.get(w)) if (!(r < w)) for (const S of o.get(r)) {
      if (S === w || !t(S, w)) continue;
      const W = [w, r, S].slice().sort((Z, b) => Z - b).join("-");
      s.has(W) || (s.add(W), i.push([w, r, S]));
    }
    if (!i.length) return 0;
    const h = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []], m = new Set(h.map((w) => [...new Set(n[w] ?? [])].sort((r, S) => r - S).join("-"))), g = [...n];
    let k = 0;
    for (const w of i) {
      const r = w.slice().sort((S, W) => S - W).join("-");
      m.has(r) || (m.add(r), g.push([...w, w[0]]), h.push(g.length - 1), k++);
    }
    if (k) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), e.polylines.val = g, e.areas && (e.areas.val = h);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      x();
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
    let h = n[1][0] - n[0][0], m = n[1][1] - n[0][1], g = n[1][2] - n[0][2];
    const k = Math.hypot(h, m, g) || 1;
    h /= k, m /= k, g /= k;
    let w = s * g - i * m, r = i * h - t * g, S = t * m - s * h;
    const W = Math.hypot(w, r, S) || 1;
    w /= W, r /= W, S /= W;
    const Z = n[0], b = (Se) => [(Se[0] - Z[0]) * h + (Se[1] - Z[1]) * m + (Se[2] - Z[2]) * g, (Se[0] - Z[0]) * w + (Se[1] - Z[1]) * r + (Se[2] - Z[2]) * S], u = (Se, Ie) => [Z[0] + Se * h + Ie * w, Z[1] + Se * m + Ie * r, Z[2] + Se * g + Ie * S], C = n.map(b);
    let E = 1 / 0, G = -1 / 0, z = 1 / 0, A = -1 / 0;
    for (const [Se, Ie] of C) Se < E && (E = Se), Se > G && (G = Se), Ie < z && (z = Ie), Ie > A && (A = Ie);
    const U = G - E, ee = A - z;
    if (U < 1e-6 || ee < 1e-6) return 0;
    let ue = o && o > 0 ? o : 0.5;
    for (; U / ue * (ee / ue) > 2500; ) ue *= 2;
    ue = Math.min(ue, Math.min(U, ee));
    const _e = (Se, Ie) => {
      let je = false;
      for (let Lt = 0, Bt = C.length - 1; Lt < C.length; Bt = Lt++) {
        const [It, on] = C[Lt], [ko, Wn] = C[Bt];
        on > Ie != Wn > Ie && Se < (ko - It) * (Ie - on) / (Wn - on) + It && (je = !je);
      }
      return je;
    }, Ke = Math.max(1, Math.round(U / ue)), $e = Math.max(1, Math.round(ee / ue)), Qe = U / Ke, ot = ee / $e, lt = /* @__PURE__ */ new Map(), Je = [], Te = e.points.rawVal.length, st = (Se, Ie) => {
      const je = Se + "," + Ie, Lt = lt.get(je);
      if (Lt !== void 0) return Lt;
      const Bt = Te + Je.length;
      return Je.push(u(E + Se * Qe, z + Ie * ot)), lt.set(je, Bt), Bt;
    }, Ze = [];
    for (let Se = 0; Se < Ke; Se++) for (let Ie = 0; Ie < $e; Ie++) {
      if (!_e(E + (Se + 0.5) * Qe, z + (Ie + 0.5) * ot)) continue;
      const je = st(Se, Ie), Lt = st(Se + 1, Ie), Bt = st(Se + 1, Ie + 1), It = st(Se, Ie + 1);
      Ze.push([je, Lt, Bt, It]);
    }
    if (!Ze.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...Je], e.polylines && e.areas) {
      let Se = e.polylines.rawVal.slice();
      Se.length && Se[Se.length - 1].length === 0 && (Se = Se.slice(0, -1));
      const Ie = [];
      for (const je of Ze) Ie.push(Se.length), Se.push([je[0], je[1], je[2], je[3], je[0]]);
      Se.push([]), e.polylines.val = Se, e.areas.val = [...e.areas.rawVal, ...Ie];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return x(), Ze.length;
  };
  const ro = () => {
    if (xe.length < 3) return xe = [], Q.visible = false, x(), 0;
    const n = window.__hekatanMeshPolyArea(xe.slice());
    return xe = [], Q.visible = false, x(), n;
  };
  window.__hekatanFinalizePolyArea = ro, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a3;
    const t = new F(n[0], n[1], n[2]), s = new F(o[0], o[1], o[2]), i = new F(a[0], a[1], a[2]), d = new F().subVectors(s, t).cross(new F().subVectors(i, t));
    if (d.lengthSq() < 1e-9) return false;
    d.normalize();
    const h = new Qn().setFromUnitVectors(new F(0, 0, 1), d), m = new En().setFromQuaternion(h);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [m.x, m.y, m.z] }), D = true;
    const g = new F().addVectors(t, s).add(i).multiplyScalar(1 / 3), k = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, w = k / 2;
    H.geometry.dispose(), H.geometry = new ln(k, k), j.geometry.dispose(), j.geometry = new hs(new ln(k, k)), ge(w, 1), V.position.copy(g), V.quaternion.copy(h), V.scale.set(1, 1, 1), V.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return x(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), D = false, V.visible = false, x();
  };
  const Wt = new rt();
  Wt.visible = false, c.add(Wt), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a3, _b;
    for (; Wt.children.length; ) {
      const k = Wt.children.pop();
      (_a3 = k.geometry) == null ? void 0 : _a3.dispose(), (_b = k.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, d = Math.min(...n) - t, h = Math.max(...n) + t, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", g = (k, w, r, S, W) => {
      const Z = document.createElement("canvas");
      Z.width = 64, Z.height = 32;
      const b = Z.getContext("2d");
      b.fillStyle = W, b.font = "bold 22px sans-serif", b.textAlign = "center", b.fillText(k, 32, 26);
      const u = new ms(Z), C = new ws({ map: u, transparent: true }), E = new ys(C);
      return E.position.set(w, r, S), E.scale.set(1.2, 0.6, 1), E;
    };
    n.forEach((k, w) => {
      const r = w < m.length ? m[w] : `X${w}`, S = new Fe().setFromPoints([new F(k, s, 0), new F(k, i, 0), new F(k, s, 0), new F(k, s, a)]), W = new An({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), Z = new jt(S, W);
      Z.computeLineDistances(), Wt.add(Z), Wt.add(g(r, k, s - 0.5, 0, "#60a5fa")), Wt.add(g(r, k, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((k, w) => {
      const r = `${w + 1}`, S = new Fe().setFromPoints([new F(d, k, 0), new F(h, k, 0), new F(d, k, 0), new F(d, k, a)]), W = new An({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), Z = new jt(S, W);
      Z.computeLineDistances(), Wt.add(Z), Wt.add(g(r, d - 0.5, k, 0, "#fb7185")), Wt.add(g(r, h + 0.5, k, 0, "#fb7185"));
    }), Wt.visible = true, x();
  }, window.__hekatanHideAxes = () => {
    Wt.visible = false, x();
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
      const h = s[d % s.length], m = o / 2, g = [new F(a - m, t - m, i), new F(a + m, t - m, i), new F(a + m, t + m, i), new F(a - m, t + m, i), new F(a - m, t - m, i)], k = new Fe().setFromPoints(g), w = new wt({ color: h, transparent: true, opacity: 0.55 });
      nn.add(new zt(k, w));
      const r = document.createElement("canvas");
      r.width = 128, r.height = 32;
      const S = r.getContext("2d");
      S.fillStyle = `#${h.toString(16).padStart(6, "0")}`, S.font = "bold 18px sans-serif", S.fillText(`Z = ${i} m`, 4, 22);
      const W = new ms(r), Z = new ws({ map: W, transparent: true }), b = new ys(Z);
      b.position.set(a - m - 1.5, t - m - 1.5, i), b.scale.set(2.5, 0.6, 1), nn.add(b);
      const u = new ln(1e4, 1e4), C = new ut({ visible: false, side: Ft }), E = new it(u, C);
      E.position.set(0, 0, i), E.frustumCulled = false, E.userData = { refPlaneZ: i }, c.add(E), mn.push(E);
    }), nn.visible = true, x();
  }, window.__hekatanHideRefPlanes = () => {
    nn.visible = false, mn.forEach((n) => {
      n.visible = false;
    }), x();
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
    (n == null ? void 0 : n.val) && (n.val, Rs(), x());
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
    (n == null ? void 0 : n.val) !== void 0 && (n.val, Uo(), x());
  }), f.addEventListener("change", () => {
    wn.children.forEach((n) => {
      n.scale.setScalar(fn(n.position));
    });
  }), window.__hekatanRenderAuxPoints = Uo;
  const xt = new rt(), Ds = new it(new bn(0.01, 12, 12), new ut({ color: 16724804, transparent: true, opacity: 0.95 })), Bs = new it(new bn(0.015, 12, 12), new ut({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  xt.add(Ds, Bs);
  const yn = 0.08, co = (n, o, a) => {
    const t = new Fe().setFromPoints([new F(...n), new F(...o)]);
    return new zt(t, new wt({ color: a, transparent: true, opacity: 0.7 }));
  };
  xt.add(co([-yn, 0, 0], [yn, 0, 0], 16711680)), xt.add(co([0, -yn, 0], [0, yn, 0], 65280)), xt.add(co([0, 0, -yn], [0, 0, yn], 35071)), xt.visible = false, xt.frustumCulled = false, c.add(xt);
  let po = 2;
  const Zn = (n) => {
    const o = p(), a = (M == null ? void 0 : M.clientHeight) || 700;
    return o.isOrthographicCamera ? (o.top - o.bottom) / (o.zoom || 1) / a : 2 * o.position.distanceTo(n) * Math.tan((o.fov || 50) * Math.PI / 180 / 2) / a;
  }, kn = () => {
    if (!xt.visible) return;
    const n = po * Zn(xt.position) / 0.015;
    xt.scale.setScalar(Math.max(1e-4, Math.min(1e5, n)));
  };
  let Sn = 10;
  const uo = (n) => Math.max(1e-4, Sn * Zn(n));
  window.__hekatanAperturaPx = (n) => (typeof n == "number" && n > 0 && (Sn = n), Sn), window.__hekatanUpdateSnapScale = kn, window.__hekatanSnapMarker = xt, window.__hekatanMetrosPorPixel = Zn, window.__hekatanSnapPx = (n) => (typeof n == "number" && n > 0 && (po = n, kn(), x()), po);
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
    xt.position.set(n, o, a), xt.visible = true, kn(), x();
  }, window.__hekatanHideSnap = () => {
    xt.visible = false, x();
  }, M.addEventListener("pointermove", (n) => {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    window.__hekatanCursorPx = { x: n.clientX, y: n.clientY };
    const o = _(n);
    if (!o) return;
    P.setFromCamera($, o);
    const a = oe();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && et.visible && (et.visible = false), a.length) {
      const t = a[0].point;
      if (((_f = (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const r = gt([t.x, t.y, t.z]);
        if (r) {
          const S = r.map((b) => e.points.rawVal[b]), W = [];
          for (let b = 1; b < S.length - 1; b++) W.push(S[0][0], S[0][1], S[0][2], S[b][0], S[b][1], S[b][2], S[b + 1][0], S[b + 1][1], S[b + 1][2]);
          const Z = et.geometry;
          Z.setAttribute("position", new St(W, 3)), Z.computeVertexNormals(), et.visible = true;
        } else et.visible = false;
      } else et.visible && (et.visible = false);
      const s = n.altKey, i = uo(t), d = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, t.x, t.y, t.z, i, { x: n.clientX, y: n.clientY });
      if (d) Jo(d.type, d.x, d.y, d.z), xt.position.set(d.x, d.y, d.z), xt.visible = true, t.set(d.x, d.y, d.z), Oo(d.type, n.clientX, n.clientY);
      else {
        Zs(), Kn();
        const w = !s && window.__hekatanSnapEnabled !== false, r = window.__hekatanSnap2D ?? 0.5;
        w && r > 0 && (t.x = Math.round(t.x / r) * r, t.y = Math.round(t.y / r) * r, t.z = Math.round(t.z / r) * r), xt.position.copy(t), xt.visible = true;
      }
      kn();
      const h = ((_j = (_i = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h)) == null ? void 0 : _j.tool) ?? "select";
      if (h === "select" || !h) {
        const w = (window.__hekatanSnap2D ?? 0.5) * 1.5, r = Rn(t.x, t.y, t.z, w), S = Mn(t.x, t.y, t.z, w), W = Dn(t.x, t.y, t.z, w);
        if (r >= 0) {
          const C = e.points.rawVal[r];
          Vt.position.set(C[0], C[1], C[2]), Vt.visible = true, In(), Xt.visible = false, Ht = { kind: "pt", a: r };
        } else if (S) {
          const C = e.points.rawVal, E = e.polylines.rawVal[S.polyIdx], G = C[E[S.segIdx]], z = C[E[S.segIdx + 1]];
          Xt.geometry.setFromPoints([new F(G[0], G[1], G[2]), new F(z[0], z[1], z[2])]), Xt.visible = true, Vt.visible = false, Ht = ((_l = (_k = e.areas) == null ? void 0 : _k.rawVal) == null ? void 0 : _l.includes(S.polyIdx)) ?? false ? { kind: "poly", a: S.polyIdx } : { kind: "seg", a: S.polyIdx, b: S.segIdx };
        } else if (W >= 0) {
          const E = (((_m = window.__hekatanDrawingAuxLines) == null ? void 0 : _m.rawVal) ?? [])[W];
          E && (Xt.geometry.setFromPoints([new F(E[0], E[1], E[2]), new F(E[3], E[4], E[5])]), Xt.visible = true, Vt.visible = false, Ht = { kind: "aux", a: W });
        } else Xt.visible = false, Vt.visible = false, Ht = null;
        ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
        let Z = t;
        if ((Ht == null ? void 0 : Ht.kind) === "pt") {
          const C = e.points.rawVal[Ht.a];
          C && (Z = new F(C[0], C[1], C[2]));
        }
        const b = `X=${Z.x.toFixed(2)} Y=${Z.y.toFixed(2)} Z=${Z.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [Z.x, Z.y, Z.z], Ht) {
          const C = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ae.textContent = `${b}  \xB7  \u{1F5B1} Click \u2192 ${C[Ht.kind]}`;
        } else ae.textContent = b;
        const u = document.getElementById("hk-coord-fixed");
        u && (u.textContent = b), Pt = { p: Z.clone(), x: n.clientX, y: n.clientY }, pe.visible = false, he.visible = false, Ye.visible = false, x();
        return;
      }
      if (h === "delete" || h === "trim" || h === "extend" || h === "offset") {
        const w = (window.__hekatanSnap2D ?? 0.5) * 1.5, r = Mn(t.x, t.y, t.z, w), S = Dn(t.x, t.y, t.z, w);
        let W = false;
        if (S >= 0) if (!r) W = true;
        else {
          const C = window.__hekatanDrawingAuxLines, G = ((C == null ? void 0 : C.rawVal) ?? (C == null ? void 0 : C.val) ?? C ?? [])[S];
          sn(t.x, t.y, t.z, G[0], G[1], G[2], G[3], G[4], G[5]) < r.dist && (W = true);
        }
        W ? (Qt = S, mt = -1, Nt = -1, Bn(S)) : r ? (mt = r.polyIdx, Nt = r.segIdx, Qt = -1, Nn(r.polyIdx, r.segIdx)) : (mt = -1, Nt = -1, Qt = -1, ht.visible = false), pe.visible = false, he.visible = false, Ye.visible = false, R(), ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
        const Z = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let b = "";
        W ? b = `\u{1F5D1} l\xEDnea aux #${Qt + 1}` : r ? b = ((_o2 = (_n2 = e.areas) == null ? void 0 : _n2.rawVal) == null ? void 0 : _o2.includes(r.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${r.polyIdx + 1}` : `\u{1F5D1} seg ${r.segIdx + 1} / poly #${r.polyIdx + 1}` : b = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ae.textContent = `${Z}  \xB7  ${b}`;
        const u = document.getElementById("hk-coord-fixed");
        u && (u.textContent = Z), x();
        return;
      } else ht.visible = false, mt = -1, Qt = -1;
      ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
      const m = ((_p = e.polylines) == null ? void 0 : _p.rawVal) ?? [], g = m[m.length - 1] ?? [], k = e.points.rawVal ?? [];
      if (g.length > 0 && k[g[g.length - 1]]) {
        const w = g[g.length - 1], r = k[w];
        let S = Ne;
        if (dt = null, !S && window.__hekatanAxisSnap !== false) {
          const $e = M.getBoundingClientRect(), Qe = n.clientX, ot = n.clientY, lt = ((_q = settings.gridSize) == null ? void 0 : _q.rawVal) ?? 10, Je = new F(r[0], r[1], r[2]), Te = [["x", new F(1, 0, 0)], ["y", new F(0, 1, 0)], ["z", new F(0, 0, 1)]], st = (Se) => {
            const Ie = Se.clone().project(o);
            return { x: (Ie.x * 0.5 + 0.5) * $e.width + $e.left, y: (-Ie.y * 0.5 + 0.5) * $e.height + $e.top };
          };
          let Ze = null;
          for (const [Se, Ie] of Te) {
            const je = st(Je.clone().addScaledVector(Ie, -lt)), Lt = st(Je.clone().addScaledVector(Ie, lt)), Bt = Lt.x - je.x, It = Lt.y - je.y, on = Qe - je.x, ko = ot - je.y, Wn = Bt * Bt + It * It || 1;
            let Jn = (on * Bt + ko * It) / Wn;
            Jn = Math.max(0, Math.min(1, Jn));
            const rs = Math.hypot(Qe - (je.x + Jn * Bt), ot - (je.y + Jn * It));
            if (Ze === null || rs < Ze.dpx) {
              const So = P.ray, cs = Je.clone().sub(So.origin), Po = Ie.dot(So.direction), ds = Ie.dot(cs), Qs = So.direction.dot(cs), ps = 1 - Po * Po, js = Math.abs(ps) < 1e-6 ? -ds : (Po * Qs - ds) / ps;
              Ze = { axis: Se, dpx: rs, pt: Je.clone().addScaledVector(Ie, js) };
            }
          }
          Ze && Ze.dpx <= 12 && (t.copy(Ze.pt), S = Ze.axis, dt = Ze.pt.clone());
        }
        const W = !!window.__hekatanOrthoMode;
        if (!S && W) {
          const $e = Math.abs(t.x - r[0]), Qe = Math.abs(t.y - r[1]), ot = Math.abs(t.z - r[2]), lt = (_r = a[0]) == null ? void 0 : _r.object;
          let Je = null;
          lt === at ? Je = "xy" : lt === ft ? Je = "xz" : lt === Be && (Je = "yz"), Je === "xy" ? S = $e >= Qe ? "x" : "y" : Je === "xz" ? S = $e >= ot ? "x" : "z" : Je === "yz" ? S = Qe >= ot ? "y" : "z" : S = $e >= Qe && $e >= ot ? "x" : Qe >= ot ? "y" : "z";
        }
        const Z = window.__hekatanPolarTrack !== false;
        if (!S && Z) {
          const $e = t.x - r[0], Qe = t.y - r[1], ot = t.z - r[2], lt = Math.hypot($e, Qe, ot);
          if (lt > 1e-3) {
            const Te = Math.tan(6 * Math.PI / 180) * lt, st = Math.hypot(Qe, ot), Ze = Math.hypot($e, ot), Se = Math.hypot($e, Qe), Ie = [["x", st], ["y", Ze], ["z", Se]];
            Ie.sort((je, Lt) => je[1] - Lt[1]), Ie[0][1] <= Te && (S = Ie[0][0]);
          }
        }
        if (S) {
          const $e = r[0], Qe = r[1], ot = r[2];
          S === "x" ? t.set(t.x, Qe, ot) : S === "y" ? t.set($e, t.y, ot) : t.set($e, Qe, t.z);
          const lt = !!Ne, Te = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[S];
          Ee.style.background = "rgba(15,23,42,0.92)", Ee.style.color = Te, Ee.style.border = `1.5px solid ${Te}`;
          const st = (_s2 = a[0]) == null ? void 0 : _s2.object;
          let Ze = null;
          st === at ? Ze = "xy" : st === ft ? Ze = "xz" : st === Be && (Ze = "yz");
          const Se = Ze ? ` (plano ${Ze.toUpperCase()})` : "";
          Ee.textContent = lt ? `\u{1F512} LOCK ${S.toUpperCase()}${Se}` : `\u22A5 ORTO ${S.toUpperCase()}${Se}`, Ee.style.left = n.clientX + 20 + "px", Ee.style.top = n.clientY + 18 + "px", Ee.style.transform = "none", Ee.style.display = "block";
        } else Ne || (Ee.style.display = "none");
        let b = null;
        if (!s && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const $e = e.points.rawVal, Qe = S ? [S] : ["z", "x", "y"], ot = { x: n.clientX, y: n.clientY };
          let lt = 1 / 0;
          for (const Je of $e) if (!(Math.abs(Je[0] - r[0]) < 1e-9 && Math.abs(Je[1] - r[1]) < 1e-9 && Math.abs(Je[2] - r[2]) < 1e-9)) for (const Te of Qe) {
            const st = new F(Te === "x" ? Je[0] : t.x, Te === "y" ? Je[1] : t.y, Te === "z" ? Je[2] : t.z), Ze = yo(st.x, st.y, st.z);
            if (!Ze) continue;
            const Se = Math.hypot(Ze.x - ot.x, Ze.y - ot.y);
            Se < Sn && Se < lt && (lt = Se, b = { q: Je, eje: Te });
          }
        }
        b ? (b.eje === "x" ? t.x = b.q[0] : b.eje === "y" ? t.y = b.q[1] : t.z = b.q[2], Ye.geometry.setFromPoints([new F(b.q[0], b.q[1], b.q[2]), new F(t.x, t.y, t.z)]), (_t2 = Ye.computeLineDistances) == null ? void 0 : _t2.call(Ye), Ye.visible = true, xt.position.set(t.x, t.y, t.z), xt.visible = true, Oo("track", n.clientX, n.clientY)) : Ye.visible = false, Pt = { p: t.clone(), x: n.clientX, y: n.clientY };
        const u = Math.hypot(t.x - r[0], t.y - r[1], t.z - r[2]), C = Math.atan2(t.y - r[1], t.x - r[0]) * 180 / Math.PI, E = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        ae.textContent = `${E} | \u0394L=${u.toFixed(2)}m ${C.toFixed(0)}\xB0`;
        const G = document.getElementById("hk-coord-fixed");
        G && (G.textContent = E), pe.geometry.setFromPoints([new F(r[0], r[1], r[2]), new F(t.x, t.y, t.z)]), (_u = pe.computeLineDistances) == null ? void 0 : _u.call(pe), pe.visible = true, q(r[0], r[1], r[2], t.x, t.y, t.z);
        const z = window.__hekatanOrthoExt ?? 8, A = window.__hekatanShowOrthoPlanes !== false;
        ct.visible = A, A || We(null), A && (Ce(He, r, "xy", z), Ce(Me, r, "xz", z), Ce(Ae, r, "yz", z), Le(at, r, "xy", z), Le(ft, r, "xz", z), Le(Be, r, "yz", z));
        const U = A ? P.intersectObjects([at, ft, Be], false) : [];
        let ee = null;
        if (U.length > 0) {
          const $e = U[0].object;
          $e === at ? ee = "xy" : $e === ft ? ee = "xz" : $e === Be && (ee = "yz");
        }
        We(ee), ee && (ze.style.left = n.clientX + "px", ze.style.top = n.clientY + "px"), me.geometry.setFromPoints([new F(r[0] - z, r[1], r[2]), new F(r[0] + z, r[1], r[2])]), (_v = me.computeLineDistances) == null ? void 0 : _v.call(me), De.geometry.setFromPoints([new F(r[0], r[1] - z, r[2]), new F(r[0], r[1] + z, r[2])]), (_w = De.computeLineDistances) == null ? void 0 : _w.call(De), Ve.geometry.setFromPoints([new F(r[0], r[1], r[2] - z), new F(r[0], r[1], r[2] + z)]), (_x = Ve.computeLineDistances) == null ? void 0 : _x.call(Ve), he.visible = true;
        const ue = me.material, _e2 = De.material, Ke = Ve.material;
        S === "x" ? (ue.opacity = 0.95, _e2.opacity = 0.1, Ke.opacity = 0.1) : S === "y" ? (ue.opacity = 0.1, _e2.opacity = 0.95, Ke.opacity = 0.1) : S === "z" ? (ue.opacity = 0.1, _e2.opacity = 0.1, Ke.opacity = 0.95) : (ue.opacity = 0.5, _e2.opacity = 0.5, Ke.opacity = 0.5);
      } else {
        const w = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        ae.textContent = w;
        const r = document.getElementById("hk-coord-fixed");
        if (r && (r.textContent = w), pe.visible = false, he.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(h)) {
          if (I = null, K = null, N.style.left = n.clientX + 20 + "px", N.style.top = n.clientY - 28 + "px", N.style.display = "block", !X) {
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
      x();
    } else Kn(), ae.style.display = "none", xt.visible = false, pe.visible = false, he.visible = false, R(), x();
  }), te.derive(() => {
    var _a3;
    if (!e.gridTarget) return;
    const n = new Qn().setFromEuler(new En(...e.gridTarget.val.rotation)), o = new Qn().setFromAxisAngle(new F(1, 0, 0), Math.PI / 2);
    Xa(l, { position: new F(...e.gridTarget.val.position), quaternion: n.clone().multiply(o) }, x);
    {
      const t = e.gridTarget.val.position[2], s = Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of tt) c.remove(i), Oe(i);
      if (tt.length = 0, s) {
        const i = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [], d = /* @__PURE__ */ new Set([0]);
        for (const m of i) d.add(+m[2].toFixed(3));
        for (const m of window.__hekatanLevels ?? []) isFinite(m == null ? void 0 : m.z) && d.add(+m.z.toFixed(3));
        const h = [...d].sort((m, g) => m - g).slice(0, 24);
        for (const m of h) {
          if (Math.abs(m - t) < 1e-6) continue;
          const g = l.clone(true);
          g.name = `hekatan-grid-nivel-${m}`, g.traverse((k) => {
            k.material && (k.material = k.material.clone(), k.material.transparent = true, k.material.opacity = (k.material.opacity ?? 1) * (Math.abs(m) < 1e-6 ? 0.5 : 0.22));
          }), g.position.set(0, 0, m), g.quaternion.copy(o), c.add(g), tt.push(g);
        }
      }
    }
    O.position.set(...e.gridTarget.val.position), O.quaternion.setFromEuler(new En(...e.gridTarget.val.rotation)), O.updateMatrixWorld();
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
  let fo = false, cn = 0;
  M.addEventListener("pointerdown", () => {
    fo = true;
  }), M.addEventListener("pointerup", () => {
    fo = false;
  }), M.addEventListener("pointermove", () => {
    fo && cn++;
  });
  const Tt = document.createElement("div");
  Tt.id = "hk-window-select", Tt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Tt);
  let Jt = null, Pn = false, Zt = null;
  const ho = (n, o, a, t, s) => {
    s ? (Tt.style.borderColor = "#34d399", Tt.style.borderStyle = "dashed", Tt.style.background = "rgba(52, 211, 153, 0.10)") : (Tt.style.borderColor = "#22d3ee", Tt.style.borderStyle = "solid", Tt.style.background = "rgba(34, 211, 238, 0.10)"), Tt.style.left = Math.min(n, a) + "px", Tt.style.top = Math.min(o, t) + "px", Tt.style.width = Math.abs(a - n) + "px", Tt.style.height = Math.abs(t - o) + "px", Tt.style.display = "block";
  }, Ko = (n, o, a, t, s) => {
    var _a3, _b, _c, _d;
    const i = Math.min(n, a), d = Math.max(n, a), h = Math.min(o, t), m = Math.max(o, t), g = a < n, k = M.getBoundingClientRect(), w = p();
    w.updateMatrixWorld();
    const r = (A) => {
      const U = new F(A[0], A[1], A[2]);
      return U.project(w), { x: k.left + (U.x * 0.5 + 0.5) * k.width, y: k.top + (-U.y * 0.5 + 0.5) * k.height };
    }, S = (A) => A.x >= i && A.x <= d && A.y >= h && A.y <= m, W = (A, U) => !(A.x < i && U.x < i || A.x > d && U.x > d || A.y < h && U.y < h || A.y > m && U.y > m);
    s || Xe.clear();
    let Z = 0;
    const b = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let A = 0; A < b.length; A++) {
      const U = b[A];
      U && S(r(U)) && (Xe.add(`pt:${A}`), Z++);
    }
    const u = (A, U) => g ? S(A) || S(U) || W(A, U) : S(A) && S(U), C = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], E = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let A = 0; A < C.length; A++) {
      const U = C[A];
      if (E.includes(A)) {
        let ue;
        if (!g) ue = U.every((_e) => {
          const Ke = b[_e];
          return !!Ke && S(r(Ke));
        });
        else {
          ue = false;
          for (let _e = 0; _e < U.length - 1; _e++) {
            const Ke = b[U[_e]], $e = b[U[_e + 1]];
            if (!(!Ke || !$e) && u(r(Ke), r($e))) {
              ue = true;
              break;
            }
          }
        }
        ue && (Xe.add(`poly:${A}`), Z++);
      } else for (let ue = 0; ue < U.length - 1; ue++) {
        const _e = b[U[ue]], Ke = b[U[ue + 1]];
        !_e || !Ke || u(r(_e), r(Ke)) && (Xe.add(`seg:${A}:${ue}`), Z++);
      }
    }
    const z = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let A = 0; A < z.length; A++) {
      const U = z[A];
      if (!U || U.length !== 6) continue;
      const ee = r([U[0], U[1], U[2]]), ue = r([U[3], U[4], U[5]]);
      u(ee, ue) && (Xe.add(`aux:${A}`), Z++);
    }
    Yt(), ce(Z === 0 && !g ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${g ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${Z} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Xe.size})`), Tt.style.display = "none";
  }, Un = () => {
    Zt && (Zt = null, Tt.style.display = "none", ce("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Un, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && Zt && Un();
  });
  const Go = () => {
    var _a3, _b, _c, _d;
    if (Xe.size === 0) return false;
    const n = [...Xe], o = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], d = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
    for (const W of n) {
      const [Z, ...b] = W.split(":");
      if (Z === "pt") d.add(+b[0]);
      else if (Z === "poly") h.add(+b[0]);
      else if (Z === "seg") {
        const u = +b[0], C = +b[1];
        m.has(u) || m.set(u, /* @__PURE__ */ new Set()), m.get(u).add(C);
      } else Z === "aux" && g.add(+b[0]);
    }
    let k = 0, w = [], r = [];
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
        let C = [];
        for (const E of u) {
          const G = Z.get(E);
          G === void 0 ? (C.length >= 2 && b.push(C), C = []) : C.push(G);
        }
        C.length >= 2 && b.push(C);
      }
      w = b, e.points.val = W;
    }
    for (const W of t) {
      const Z = S.get(W);
      Z !== void 0 && Z < w.length && r.push(Z);
    }
    if (e.polylines && (e.polylines.val = w), e.areas && (e.areas.val = r), g.size > 0 && s) {
      const W = i.filter((Z, b) => !g.has(b));
      "val" in s ? s.val = W : window.__hekatanDrawingAuxLines = W, k += g.size;
    }
    Xe.clear(), Yt();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return ce(`\u{1F5D1} ${k} item(s) borrado(s)`), true;
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
      const h = d.clientX - a, m = d.clientY - t, g = Math.max(0, Math.min(window.innerWidth - 80, s + h)), k = Math.max(0, Math.min(window.innerHeight - 40, i + m));
      Rt.style.left = `${g}px`, Rt.style.top = `${k}px`;
    }), window.addEventListener("mouseup", () => {
      if (o) {
        o = false;
        try {
          localStorage.setItem(Ho, JSON.stringify({ left: parseFloat(Rt.style.left), top: parseFloat(Rt.style.top) }));
        } catch {
        }
      }
    });
  }, re = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, $t = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let pt = null;
  const Ct = (n, o, a, t) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: n, ids: o, prop: a, value: t } }));
  }, Xs = () => {
    if (pt && (pt.dispose(), pt = null), Xe.size === 0) {
      Rt.style.display = "none";
      return;
    }
    const n = [...Xe], o = n.filter((w) => w.startsWith("pt:")), a = n.filter((w) => w.startsWith("seg:")), t = n.filter((w) => w.startsWith("poly:")), s = n.filter((w) => w.startsWith("aux:")), i = o.length > 0, d = a.length > 0, h = t.length > 0, m = !i && !d && !h, g = [];
    o.length && g.push(`\u{1F535} ${o.length} nodo(s)`), a.length && g.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && g.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && g.push(`\u250A ${s.length} aux`);
    const k = `\u{1F3AF} ${Xe.size} item(s) \u2014 ${g.join(", ")}`;
    pt = new Fs({ container: Rt, title: k });
    {
      const w = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      w.addBinding($t, "dx", { label: "\u0394x (m)", step: 0.1 }), w.addBinding($t, "dy", { label: "\u0394y (m)", step: 0.1 }), w.addBinding($t, "dz", { label: "\u0394z (m)", step: 0.1 }), w.addBinding($t, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), w.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a3;
        const Z = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, $t.dx, $t.dy, $t.dz, $t.copias);
        ce(Z ? `\u29C9 Replicado \xD7${Z} (\u0394 ${$t.dx},${$t.dy},${$t.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const r = { vuelo: 1.5, losa: true, borde: true, ambos: true }, S = w.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      S.addBinding(r, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), S.addBinding(r, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), S.addBinding(r, "borde", { label: "con viga de borde" }), S.addBinding(r, "ambos", { label: "a los dos lados" }), S.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a3;
        const Z = (_a3 = window.__hekatanVoladoSelection) == null ? void 0 : _a3.call(window, r.vuelo, { losa: r.losa, vigaBorde: r.borde, lados: r.ambos ? "ambos" : "afuera" });
        ce(Z ? `\u2310 Volado de ${r.vuelo} m en ${Z} pa\xF1o(s)` + (r.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), w.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a3;
        const Z = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, $t.dx, $t.dy, $t.dz, 1);
        ce(Z ? `\u2192 Copia desplazada \u0394 ${$t.dx},${$t.dy},${$t.dz} m` : "\u26A0 Nada seleccionado");
      });
      const W = w.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      W.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a3;
        return (_a3 = window.__hekatanToggleSnap) == null ? void 0 : _a3.call(window);
      }), W.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ce(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const w = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      w.addBinding(re, "Ux"), w.addBinding(re, "Uy"), w.addBinding(re, "Uz"), w.addBinding(re, "Rx"), w.addBinding(re, "Ry"), w.addBinding(re, "Rz");
      const r = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      r.addBinding(re, "Kx", { label: "Kx", min: 0, step: 100 }), r.addBinding(re, "Ky", { label: "Ky", min: 0, step: 100 }), r.addBinding(re, "Kz", { label: "Kz", min: 0, step: 100 }), r.addBinding(re, "Krx", { label: "Krx", min: 0, step: 1e3 }), r.addBinding(re, "Kry", { label: "Kry", min: 0, step: 1e3 }), r.addBinding(re, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const S = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      S.addBinding(re, "Fx", { step: 0.1 }), S.addBinding(re, "Fy", { step: 0.1 }), S.addBinding(re, "Fz", { step: 0.1 }), S.addBinding(re, "Mx", { step: 0.1 }), S.addBinding(re, "My", { step: 0.1 }), S.addBinding(re, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(re, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(re, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let b = 0;
        const u = [re.Ux, re.Uy, re.Uz, re.Rx, re.Ry, re.Rz];
        u.some((G) => G) && (Ct("nodes", o, "supports", u), b++);
        const C = [re.Fx, re.Fy, re.Fz, re.Mx, re.My, re.Mz];
        C.some((G) => G !== 0) && (Ct("nodes", o, "loads", C), b++);
        const E = [re.Kx, re.Ky, re.Kz, re.Krx, re.Kry, re.Krz];
        if (E.some((G) => G !== 0) && (Ct("nodes", o, "springs", E), b++), re.mass !== 0 && (Ct("nodes", o, "mass", re.mass), b++), re.diaphragm !== "Ninguno" && (Ct("nodes", o, "diaphragm", re.diaphragm), b++), b === 0) {
          ce("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let G = document.getElementById("hk-prop-toast");
          G || (G = document.createElement("div"), G.id = "hk-prop-toast", G.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(G)), G.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", G.style.background = "rgba(217,119,6,0.97)", G.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            G && (G.style.opacity = "0");
          }, 3200);
        } else ce(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (d) {
      const w = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      w.addBinding(re, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), w.addBinding(re, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const r = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      r.addBinding(re, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), r.addBinding(re, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), r.addBinding(re, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), r.addBinding(re, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(re, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(re, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const Z = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      Z.addBinding(re, "relMxI", { label: "Mx I" }), Z.addBinding(re, "relMyI", { label: "My I" }), Z.addBinding(re, "relMzI", { label: "Mz I" });
      const b = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      b.addBinding(re, "relMxJ", { label: "Mx J" }), b.addBinding(re, "relMyJ", { label: "My J" }), b.addBinding(re, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(re, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const C = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      C.addBinding(re, "LKx", { label: "LKx", min: 0, step: 100 }), C.addBinding(re, "LKy", { label: "LKy", min: 0, step: 100 }), C.addBinding(re, "LKz", { label: "LKz", min: 0, step: 100 });
      const E = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      E.addBinding(re, "qx", { step: 0.1 }), E.addBinding(re, "qy", { step: 0.1 }), E.addBinding(re, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(re, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Ct("segs", a, "section", re.section), Ct("segs", a, "material", re.material_frame);
        const z = { A: re.A_mod, Iz: re.Iz_mod, Iy: re.Iy_mod, J: re.J_mod };
        (z.A !== 1 || z.Iz !== 1 || z.Iy !== 1 || z.J !== 1) && Ct("segs", a, "modifiers", z), re.insertionPoint !== "10 \u2014 Centroid" && Ct("segs", a, "insertionPoint", re.insertionPoint), re.beta !== 0 && Ct("segs", a, "beta", re.beta);
        const A = [re.relMxI, re.relMyI, re.relMzI], U = [re.relMxJ, re.relMyJ, re.relMzJ];
        (A.some((_e) => _e) || U.some((_e) => _e)) && Ct("segs", a, "releases", { i: A, j: U }), re.hinges !== "None" && Ct("segs", a, "hinges", re.hinges);
        const ee = [re.LKx, re.LKy, re.LKz];
        ee.some((_e) => _e !== 0) && Ct("segs", a, "lineSprings", ee);
        const ue = [re.qx, re.qy, re.qz];
        ue.some((_e) => _e !== 0) && Ct("segs", a, "distLoad", ue), re.massPerM !== 0 && Ct("segs", a, "massPerM", re.massPerM), ce(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (h) {
      const w = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      w.addBinding(re, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), w.addBinding(re, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), w.addBinding(re, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(re, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Ct("areas", t, "shellType", re.shellType), Ct("areas", t, "thickness", re.thickness), Ct("areas", t, "material", re.material_shell), re.surfLoad !== 0 && Ct("areas", t, "surfLoad", re.surfLoad), ce(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (m) {
      const w = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), r = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      w.addBinding(r, "msg", { readonly: true, label: "" });
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
        s && s !== "select" && s !== "none" ? ((_c = t == null ? void 0 : t.setTool) == null ? void 0 : _c.call(t, "select"), ce(`\u238B Cancelado \u2014 tool '${s}' cerrado, volv\xE9s a Seleccionar`)) : ce("\u238B Cancelado (click derecho)");
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
      ho(Zt.x, Zt.y, n.clientX, n.clientY, i);
      return;
    }
    if (!Jt) return;
    const o = n.clientX - Jt.x, a = n.clientY - Jt.y, t = Math.hypot(o, a);
    if (!Pn && t < 8) return;
    Pn = true;
    const s = n.clientX < Jt.x;
    ho(Jt.x, Jt.y, n.clientX, n.clientY, s);
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
    qt.add(new jt(i, new wt({ color: s, linewidth: 2 }))), qt.position.set(o, a, t), qt.visible = true, wo();
  };
  let mo = 4;
  const wo = () => {
    qt.visible && qt.scale.setScalar(mo * Zn(qt.position));
  };
  window.__hekatanOsnapMarkerRef = qt, window.__hekatanUpdateOsnapScale = wo, window.__hekatanOsnapPx = (n) => (typeof n == "number" && n > 0 && (mo = n, wo(), x()), mo);
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
  }, zn = new F(), yo = (n, o, a) => {
    const t = p();
    if (!t) return null;
    const s = M.getBoundingClientRect();
    return zn.set(n, o, a).project(t), !isFinite(zn.x) || !isFinite(zn.y) ? null : { x: s.left + (zn.x * 0.5 + 0.5) * s.width, y: s.top + (-zn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = yo;
  const Us = (n, o, a, t, s) => {
    var _a3, _b, _c, _d, _e, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, d = e.points.rawVal, h = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let m = null;
    const g = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, k = s, w = (u, C, E, G) => {
      let z;
      if (k) {
        const U = yo(C, E, G);
        if (!U || (z = Math.hypot(U.x - k.x, U.y - k.y), z > Sn)) return;
      } else if (z = Math.hypot(C - n, E - o, G - a), z > t) return;
      const A = g[u] ?? 9;
      (!m || A < m.r || A === m.r && z < m.d) && (m = { type: u, x: C, y: E, z: G, d: z, r: A });
    };
    if (i.ori !== false && w("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const u = window.__hekatanGridConfig, C = (u == null ? void 0 : u.minorStep) && u.minorStep > 0 ? u.minorStep : 1, E = ((u == null ? void 0 : u.gridSize) ?? 30) / 2, G = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", z = (U) => Math.round(U / C) * C, A = (U, ee) => Math.abs(U) <= E + 1e-9 && Math.abs(ee) <= E + 1e-9;
      if (G === "xz") {
        const U = z(n), ee = z(a);
        A(U, ee) && w("grid", U, o, ee);
      } else if (G === "yz") {
        const U = z(o), ee = z(a);
        A(U, ee) && w("grid", n, U, ee);
      } else {
        const U = z(n), ee = z(o);
        A(U, ee) && w("grid", U, ee, a);
      }
    }
    (i.node || i.end) && d.forEach((u) => {
      i.node && w("node", u[0], u[1], u[2]);
    });
    for (const u of h) if (!(u.length < 2)) for (let C = 0; C < u.length - 1; C++) {
      const E = d[u[C]], G = d[u[C + 1]];
      if (!(!E || !G) && (i.end && (w("end", E[0], E[1], E[2]), w("end", G[0], G[1], G[2])), i.mid && w("mid", (E[0] + G[0]) / 2, (E[1] + G[1]) / 2, (E[2] + G[2]) / 2), i.nea || i.per)) {
        const z = G[0] - E[0], A = G[1] - E[1], U = G[2] - E[2], ee = z * z + A * A + U * U;
        if (ee < 1e-12) continue;
        const ue = Math.max(0, Math.min(1, ((n - E[0]) * z + (o - E[1]) * A + (a - E[2]) * U) / ee)), _e2 = E[0] + ue * z, Ke = E[1] + ue * A, $e = E[2] + ue * U;
        i.nea && w("nea", _e2, Ke, $e), i.per && w("per", _e2, Ke, $e);
      }
    }
    if (i.cen) {
      const u = ((_e = e.areas) == null ? void 0 : _e.rawVal) ?? [];
      for (const C of u) {
        const E = h[C];
        if (!E || E.length < 3) continue;
        const G = E[0] === E[E.length - 1] ? E.slice(0, -1) : E;
        let z = 0, A = 0, U = 0, ee = 0;
        for (const ue of G) {
          const _e2 = d[ue];
          _e2 && (z += _e2[0], A += _e2[1], U += _e2[2], ee++);
        }
        ee >= 3 && w("cen", z / ee, A / ee, U / ee);
      }
    }
    if (i.cen) {
      const u = Zo(), C = [...Yn];
      for (const E of u) C.some((G) => Math.hypot(G.c[0] - E.c[0], G.c[1] - E.c[1], G.c[2] - E.c[2]) < 1e-6 && Math.abs(G.r - E.r) < 1e-6) || C.push(E);
      for (const E of C) {
        if (!d.some((A) => Math.abs(Math.hypot(A[0] - E.c[0], A[1] - E.c[1], A[2] - E.c[2]) - E.r) < 1e-6)) continue;
        const z = Math.hypot(n - E.c[0], o - E.c[1], a - E.c[2]);
        if (z < t || Math.abs(z - E.r) < t) {
          const A = Math.min(z, t * 0.5), U = 3;
          (!m || U < m.r || U === m.r && A < m.d) && (m = { type: "cen", x: E.c[0], y: E.c[1], z: E.c[2], d: A, r: U });
        }
      }
    }
    if (i.int) {
      const u = [];
      for (const C of h) for (let E = 0; E < C.length - 1; E++) {
        const G = d[C[E]], z = d[C[E + 1]];
        if (!G || !z) continue;
        const A = z[0] - G[0], U = z[1] - G[1], ee = z[2] - G[2], ue = A * A + U * U + ee * ee;
        if (ue < 1e-12) continue;
        const _e2 = Math.max(0, Math.min(1, ((n - G[0]) * A + (o - G[1]) * U + (a - G[2]) * ee) / ue));
        Math.hypot(G[0] + _e2 * A - n, G[1] + _e2 * U - o, G[2] + _e2 * ee - a) < 3 * t && u.push([G, z]);
      }
      for (let C = 0; C < u.length; C++) for (let E = C + 1; E < u.length; E++) {
        const [G, z] = u[C], [A, U] = u[E], ee = [z[0] - G[0], z[1] - G[1], z[2] - G[2]], ue = [U[0] - A[0], U[1] - A[1], U[2] - A[2]], _e2 = [G[0] - A[0], G[1] - A[1], G[2] - A[2]], Ke = ee[0] * ee[0] + ee[1] * ee[1] + ee[2] * ee[2], $e = ee[0] * ue[0] + ee[1] * ue[1] + ee[2] * ue[2], Qe = ue[0] * ue[0] + ue[1] * ue[1] + ue[2] * ue[2], ot = ee[0] * _e2[0] + ee[1] * _e2[1] + ee[2] * _e2[2], lt = ue[0] * _e2[0] + ue[1] * _e2[1] + ue[2] * _e2[2], Je = Ke * Qe - $e * $e;
        if (Je < 1e-12) continue;
        const Te = ($e * lt - Qe * ot) / Je, st = (Ke * lt - $e * ot) / Je;
        if (Te < -1e-6 || Te > 1 + 1e-6 || st < -1e-6 || st > 1 + 1e-6) continue;
        const Ze = [G[0] + Te * ee[0], G[1] + Te * ee[1], G[2] + Te * ee[2]], Se = [A[0] + st * ue[0], A[1] + st * ue[1], A[2] + st * ue[2]];
        if (Math.hypot(Ze[0] - Se[0], Ze[1] - Se[1], Ze[2] - Se[2]) > 1e-4) continue;
        [G, z, A, U].some((je) => Math.hypot(je[0] - Ze[0], je[1] - Ze[1], je[2] - Ze[2]) < 1e-6) || w("int", Ze[0], Ze[1], Ze[2]);
      }
    }
    const r = window.__hekatanAxisGrids ?? [], S = window.__hekatanLevels ?? [], W = r.filter((u) => u && u.start && u.end).map((u) => [u.start, u.end]);
    for (const [u, C] of W) {
      i.end && (w("end", u[0], u[1], u[2]), w("end", C[0], C[1], C[2]));
      const E = C[0] - u[0], G = C[1] - u[1], z = C[2] - u[2], A = E * E + G * G + z * z;
      if (A < 1e-12) continue;
      const U = Math.max(0, Math.min(1, ((n - u[0]) * E + (o - u[1]) * G + (a - u[2]) * z) / A));
      if (i.nea && w("nea", u[0] + U * E, u[1] + U * G, u[2] + U * z), i.int && Math.abs(z) > 1e-9) for (const ee of S) {
        const ue = (ee.z - u[2]) / z;
        ue < -1e-6 || ue > 1 + 1e-6 || w("int", u[0] + ue * E, u[1] + ue * G, ee.z);
      }
    }
    if (i.int || i.node) for (let u = 0; u < W.length; u++) for (let C = u + 1; C < W.length; C++) {
      const [E, G] = W[u], [z, A] = W[C], U = G[0] - E[0], ee = G[1] - E[1], ue = A[0] - z[0], _e2 = A[1] - z[1], Ke = U * _e2 - ee * ue;
      if (Math.abs(Ke) < 1e-12) continue;
      const $e = E[0] - z[0], Qe = E[1] - z[1], ot = (ue * Qe - _e2 * $e) / Ke, lt = (U * Qe - ee * $e) / Ke;
      if (ot < -1e-6 || ot > 1 + 1e-6 || lt < -1e-6 || lt > 1 + 1e-6) continue;
      const Je = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      w("int", E[0] + ot * U, E[1] + ot * ee, typeof Je == "number" ? Je : a);
    }
    const Z = window.__hekatanDrawingAuxLines, b = (Z == null ? void 0 : Z.rawVal) ?? (Z == null ? void 0 : Z.val) ?? Z ?? [];
    for (const u of b) {
      if (u.length !== 6) continue;
      const C = [u[0], u[1], u[2]], E = [u[3], u[4], u[5]];
      if (i.end && (w("end", C[0], C[1], C[2]), w("end", E[0], E[1], E[2])), i.mid && w("mid", (C[0] + E[0]) / 2, (C[1] + E[1]) / 2, (C[2] + E[2]) / 2), i.nea || i.per) {
        const G = E[0] - C[0], z = E[1] - C[1], A = E[2] - C[2], U = G * G + z * z + A * A;
        if (U < 1e-12) continue;
        const ee = Math.max(0, Math.min(1, ((n - C[0]) * G + (o - C[1]) * z + (a - C[2]) * A) / U)), ue = C[0] + ee * G, _e2 = C[1] + ee * z, Ke = C[2] + ee * A;
        i.nea && w("nea", ue, _e2, Ke), i.per && w("per", ue, _e2, Ke);
      }
    }
    return m ? { type: m.type, x: m.x, y: m.y, z: m.z } : null;
  }, gn = new rt();
  gn.frustumCulled = false, c.add(gn);
  const Qo = new wt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
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
        const g = o[+i[1]];
        g && (d = [g, [g[0] + 1e-3, g[1], g[2]]]);
      } else if (i[0] === "seg") {
        const g = a[+i[1]] || [], k = o[g[+i[2]]], w = o[g[+i[2] + 1]];
        k && w && (d = [k, w]);
      } else i[0] === "poly" && (d = (a[+i[1]] || []).map((k) => o[k]).filter(Boolean));
      if (d.length < 2) continue;
      const h = new Fe().setFromPoints(d.map((g) => new F(g[0], g[1], g[2]))), m = new zt(h, Qo);
      m.renderOrder = 1200, gn.add(m);
    }
    if (!gn.children.length) return;
    jo = performance.now() + 900;
    const t = () => {
      const s = jo - performance.now();
      if (s <= 0) {
        es(), x();
        return;
      }
      Qo.opacity = Math.min(1, s / 900) * 0.95, x(), requestAnimationFrame(t);
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
  }, ce = (n) => {
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
        return s(`\xC1REA LIBRE Precise v\xE9rtice ${xe.length + 1} (Enter o clic derecho cierra y malla):`);
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
    var _a3, _b, _c, _d, _e;
    try {
      const n = Gs(), o = ((_c = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c.length) ?? 0, a = (((_d = e.points) == null ? void 0 : _d.rawVal) ?? []).length, s = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(n.txt) && !o && !a ? `${n.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : n.txt;
      (_e = window.__hekatanCadPrompt) == null ? void 0 : _e.call(window, s, n.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = Ut, window.__hekatanRefreshStatus = () => {
    const n = window.__hekatanCadStatusText ?? "", o = n.split("   |   ")[0] ?? n;
    ce(o);
  }, window.__hekatanCadResetPending = () => {
    qe = [], xe = [], Q.visible = false, xo(), Et = null, x(), ce("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Ut();
  };
  function xo() {
    if (!e.polylines) return;
    const n = e.polylines.rawVal.filter((o) => o.length >= 2);
    e.polylines.val = [...n, []];
  }
  window.__hekatanCerrarPolilinea = xo;
  const vn = [], Gn = [], go = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(e.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? [])) };
  }, ts = (n) => {
    var _a3;
    e.points.val = n.p, e.polylines && (e.polylines.val = n.l), e.areas && (e.areas.val = n.a), qe = [], pe.visible = false, he.visible = false, R();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    x(), Ut();
  }, Dt = () => {
    vn.push(go()), vn.length > 100 && vn.shift(), Gn.length = 0;
  }, Hn = () => {
    const n = vn.pop();
    if (!n) {
      ce("\u21B6 Nada para deshacer");
      return;
    }
    Gn.push(go()), ts(n), ce(`\u21B6 Deshacer \u2014 quedan ${vn.length}`);
  }, ns = () => {
    const n = Gn.pop();
    if (!n) {
      ce("\u21B7 Nada para rehacer");
      return;
    }
    vn.push(go()), ts(n), ce(`\u21B7 Rehacer \u2014 quedan ${Gn.length}`);
  };
  window.__hekatanPushUndo = Dt, window.__hekatanUndo = Hn, window.__hekatanRedo = ns, document.addEventListener("keydown", (n) => {
    var _a3;
    const o = n.key.toLowerCase();
    if (!((n.ctrlKey || n.metaKey) && (o === "y" || o === "z" && n.shiftKey))) return;
    const t = n.target;
    t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA") && t.type !== "checkbox" && t.type !== "range" && (((_a3 = t.value) == null ? void 0 : _a3.length) ?? 0) > 0 || (n.preventDefault(), n.stopPropagation(), ns());
  }, { capture: true }), window.__hekatanCadOption = (n) => {
    var _a3, _b, _c, _d, _e;
    const o = n.trim().toLowerCase(), a = (_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool;
    if (!e.polylines) return false;
    const t = e.polylines.rawVal, s = t.length ? t[t.length - 1] : [];
    if (a !== "line" && a !== "polyline") return o === "u" || o === "deshacer" || o === "undo" ? (Hn(), true) : false;
    if (o === "c" || o === "cerrar" || o === "close") {
      if (s.length < 3) return ce("Cerrar necesita al menos tres puntos."), true;
      Dt(), e.polylines.val = [...t.slice(0, -1), [...s, s[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return vo(), ce(`\u2713 Polil\xEDnea cerrada \u2014 ${s.length} tramos.`), true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!s.length) return Hn(), true;
      Dt();
      const i = s[s.length - 1], d = s.slice(0, -1), h = t.some((k, w) => w !== t.length - 1 && k.includes(i)) || d.includes(i);
      let m = e.points.rawVal, g = [...t.slice(0, -1), d];
      if (!h && i === m.length - 1 && (m = m.slice(0, -1), e.points.val = m), e.polylines.val = g, d.length) {
        const k = m[d[d.length - 1]];
        k && (I = [k[0], k[1], k[2]]);
      } else I = null, pe.visible = false;
      try {
        (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
      } catch {
      }
      return x(), ce(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${d.length}.`), Ut(), true;
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
  const vo = () => {
    qe = [], Et = null, xo(), Ne = null, nt(), pe.visible = false, he.visible = false, R(), ce("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), x(), Ut();
  };
  window.__hekatanFinalizeDraw = vo;
  const os = () => {
    var _a3, _b, _c;
    qe = [], xe = [], Q.visible = false;
    let n = false;
    Xe.size && (Xe.clear(), Yt(), n = true), vo();
    try {
      const o = window.__hekatanCadState, a = (_b = (_a3 = o == null ? void 0 : o.get) == null ? void 0 : _a3.call(o)) == null ? void 0 : _b.tool;
      a && a !== "select" && ((_c = o == null ? void 0 : o.setTool) == null ? void 0 : _c.call(o, "select"));
    } catch {
    }
    ce(n ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), x(), Ut();
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
    return Yt(), x(), t.size;
  };
  window.__hekatanMoveSelection = as;
  const is = (n, o) => {
    var _a3, _b, _c, _d, _e;
    if (!Xe.size) {
      ce(`${n === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), Ut();
      return;
    }
    if (qe.push(o), qe.length === 1) {
      I = o, ce(`${n === "move" ? "MOVER" : "COPIAR"} punto base (${o[0].toFixed(2)}, ${o[1].toFixed(2)}, ${o[2].toFixed(2)}). Precise el segundo punto.`), Ut();
      return;
    }
    const [a, t] = qe, s = [t[0] - a[0], t[1] - a[1], t[2] - a[2]];
    qe = [], pe.visible = false;
    let i = 0;
    n === "move" ? i = as(s[0], s[1], s[2]) : (i = ss().size, (_c = window.__hekatanReplicateSelection) == null ? void 0 : _c.call(window, s[0], s[1], s[2], 1)), ce(`\u2713 ${n === "move" ? "Movidos" : "Copiados"} ${i} nudo${i === 1 ? "" : "s"} \u2014 \u0394 (${s[0].toFixed(2)}, ${s[1].toFixed(2)}, ${s[2].toFixed(2)}) m.`), n === "move" && (Xe.clear(), Yt()), (_e = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e.call(_d, "select"), Ut();
  };
  window.__hekatanPasoMoverCopiar = is;
  const Hs = () => {
    var _a3, _b, _c;
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.workPlane) ?? "xy";
    return n === "xz" ? [0, 1, 0] : n === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, an = (n, o) => Math.hypot(n[0] - o[0], n[1] - o[1], n[2] - o[2]), bo = (n, o, a, t, s, i) => {
    const d = [o[0] - n[0], o[1] - n[1], o[2] - n[2]], h = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], m = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], g = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], k = d[0] * h[0] + d[1] * h[1] + d[2] * h[2], w = h[0] * h[0] + h[1] * h[1] + h[2] * h[2], r = d[0] * m[0] + d[1] * m[1] + d[2] * m[2], S = h[0] * m[0] + h[1] * m[1] + h[2] * m[2], W = g * w - k * k;
    if (W < 1e-12) return null;
    const Z = (k * S - w * r) / W, b = (g * S - k * r) / W;
    if (!s && (Z < -1e-6 || Z > 1 + 1e-6) || !i && (b < -1e-6 || b > 1 + 1e-6)) return null;
    const u = [n[0] + Z * d[0], n[1] + Z * d[1], n[2] + Z * d[2]], C = [a[0] + b * h[0], a[1] + b * h[1], a[2] + b * h[2]];
    return an(u, C) > 1e-4 ? null : u;
  }, Ws = (n) => {
    var _a3;
    return (((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((o, a) => o + a.filter((t) => t === n).length, 0);
  }, Js = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, Os = (n, o) => {
    var _a3, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal, t = e.points.rawVal, s = Js[n];
    if (!Et) {
      if (mt < 0) {
        ce(`${s}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Et = { poly: mt, seg: Math.max(0, Nt) }, ce(n === "offset" ? `DESFASE l\xEDnea #${Et.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${dn > 0 ? ` (${dn} m)` : ""}.` : n === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), Ut();
      return;
    }
    if (n === "offset") {
      const Z = Et.poly, b = a[Z];
      if (!b || b.length < 2) {
        Et = null, ce("DESFASE: esa polil\xEDnea no tiene tramos."), Ut();
        return;
      }
      const u = b.length > 2 && b[0] === b[b.length - 1], C = Hs(), E = [];
      for (let Te = 0; Te < b.length - 1; Te++) {
        const st = t[b[Te]], Ze = t[b[Te + 1]], Se = [Ze[0] - st[0], Ze[1] - st[1], Ze[2] - st[2]], Ie = Math.hypot(Se[0], Se[1], Se[2]) || 1, je = Se[0] / Ie, Lt = Se[1] / Ie, Bt = Se[2] / Ie, It = [C[1] * Bt - C[2] * Lt, C[2] * je - C[0] * Bt, C[0] * Lt - C[1] * je], on = Math.hypot(It[0], It[1], It[2]) || 1;
        E.push({ a: st, b: Ze, n: [It[0] / on, It[1] / on, It[2] / on] });
      }
      let G = 0, z = 1 / 0;
      E.forEach((Te, st) => {
        const Ze = sn(o[0], o[1], o[2], Te.a[0], Te.a[1], Te.a[2], Te.b[0], Te.b[1], Te.b[2]);
        Ze < z && (z = Ze, G = st);
      });
      const A = E[G], U = Math.sign((o[0] - A.a[0]) * A.n[0] + (o[1] - A.a[1]) * A.n[1] + (o[2] - A.a[2]) * A.n[2]) || 1, ee = dn > 0 ? dn : z;
      if (ee < 1e-6) {
        ce("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const ue = E.map((Te) => ({ a: [Te.a[0] + U * ee * Te.n[0], Te.a[1] + U * ee * Te.n[1], Te.a[2] + U * ee * Te.n[2]], b: [Te.b[0] + U * ee * Te.n[0], Te.b[1] + U * ee * Te.n[1], Te.b[2] + U * ee * Te.n[2]] })), _e = ue.length, Ke = (Te) => {
        const st = ue[(Te - 1 + _e) % _e], Ze = ue[Te % _e];
        return bo(st.a, st.b, Ze.a, Ze.b, true, true) ?? Ze.a;
      }, $e = [], Qe = u ? _e : _e + 1;
      for (let Te = 0; Te < Qe; Te++) !u && Te === 0 ? $e.push(ue[0].a) : !u && Te === _e ? $e.push(ue[_e - 1].b) : $e.push(Ke(Te));
      Dt();
      const ot = t.length;
      e.points.val = [...t, ...$e];
      const lt = $e.map((Te, st) => ot + st);
      u && lt.push(ot);
      let Je = a.slice();
      Je.length && Je[Je.length - 1].length === 0 && (Je = Je.slice(0, -1)), e.polylines.val = [...Je, lt, []], Et = null, ce(`\u2713 Desfase a ${ee.toFixed(2)} m \u2014 ${_e} tramo${_e === 1 ? "" : "s"} nuevo${_e === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      x(), Ut();
      return;
    }
    let i = mt, d = Math.max(0, Nt);
    if (i < 0 || i === Et.poly && d === Et.seg) {
      let b = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((u, C) => {
        for (let E = 0; E < u.length - 1; E++) {
          if (C === Et.poly && E === Et.seg) continue;
          const G = t[u[E]], z = t[u[E + 1]];
          if (!G || !z) continue;
          const A = sn(o[0], o[1], o[2], G[0], G[1], G[2], z[0], z[1], z[2]);
          A < b && (b = A, i = C, d = E);
        }
      }), i < 0) {
        ce(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const h = a[Et.poly], m = t[h[Et.seg]], g = t[h[Et.seg + 1]], k = a[i], w = k[d], r = k[d + 1];
    if (!m || !g || w == null || r == null) {
      ce(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const S = t[w], W = t[r];
    if (n === "trim") {
      const Z = bo(S, W, m, g, false, false);
      if (!Z) {
        ce("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Dt();
      const b = t.length;
      e.points.val = [...t, Z];
      const u = [...k.slice(0, d + 1), b, ...k.slice(d + 1)];
      e.polylines.val = a.map((E, G) => G === i ? u : E);
      const C = an(o, S) < an(o, W);
      No(i, C ? d : d + 1), ce(`\u2713 Recortado en (${Z[0].toFixed(2)}, ${Z[1].toFixed(2)}, ${Z[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const Z = bo(S, W, m, g, true, false);
      if (!Z) {
        ce("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const u = an(o, S) < an(o, W) ? d : d + 1;
      if (u !== 0 && u !== k.length - 1) {
        ce("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const C = k[u];
      if (an(Z, S) + an(Z, W) < an(S, W) + 1e-6) {
        ce("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Dt(), Ws(C) > 1) {
        const G = t.length;
        e.points.val = [...t, Z];
        const z = k.slice();
        z[u] = G, e.polylines.val = a.map((A, U) => U === i ? z : A);
      } else e.points.val = t.map((G, z) => z === C ? Z : G);
      ce(`\u2713 Alargada hasta (${Z[0].toFixed(2)}, ${Z[1].toFixed(2)}, ${Z[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    x(), Ut();
  };
  window.__hekatanSelectionSize = () => Xe.size, window.__hekatanSelectLast = () => {
    var _a3;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let o = n.length - 1;
    for (; o >= 0 && (!n[o] || n[o].length < 2); ) o--;
    return Xe.clear(), o >= 0 && Xe.add(`poly:${o}`), Yt(), ce(o >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Xe.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = ((_b = e.points) == null ? void 0 : _b.rawVal) ?? [];
    Xe.clear();
    const a = /* @__PURE__ */ new Set();
    return n.forEach((t, s) => {
      !t || t.length < 2 || (Xe.add(`poly:${s}`), t.forEach((i) => a.add(i)));
    }), o.forEach((t, s) => {
      a.has(s) || Xe.add(`pt:${s}`);
    }), Yt(), ce(`SELECCI\xD3N ${Xe.size} objetos (todo el modelo) \xB7 Esc suelta`), Xe.size;
  }, window.__hekatanReplicateSelection = (n, o, a, t, s = 0) => {
    var _a3, _b, _c, _d;
    t = Math.max(1, Math.round(t || 1)), s = Math.max(0, Math.round(s || 0));
    const i = [...Xe], d = e.points.rawVal, h = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), g = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Set(), w = [];
    if (i.forEach((b) => {
      if (b.startsWith("pt:")) {
        const u = +b.slice(3);
        d[u] && g.add(u);
      } else if (b.startsWith("poly:")) {
        const u = +b.slice(5);
        if (!h[u] || h[u].length < 2) return;
        k.add(u), h[u].forEach((C) => g.add(C));
      } else if (b.startsWith("seg:")) {
        const u = b.split(":"), C = +u[1], E = +u[2], G = h[C] || [], z = G[E], A = G[E + 1];
        z != null && A != null && (w.push([z, A]), g.add(z), g.add(A));
      }
    }), !g.size) return 0;
    Dt();
    const r = [...d];
    let S = h.slice();
    S.length && S[S.length - 1].length === 0 && (S = S.slice(0, -1));
    const W = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], Z = [...g];
    for (let b = 1; b <= t; b++) {
      const u = s + b, C = n * u, E = o * u, G = a * u, z = /* @__PURE__ */ new Map();
      Z.forEach((A) => {
        z.set(A, r.length), r.push([d[A][0] + C, d[A][1] + E, d[A][2] + G]);
      }), k.forEach((A) => {
        const U = h[A].map((ue) => z.has(ue) ? z.get(ue) : ue), ee = S.length;
        S.push(U), m.has(A) && W.push(ee);
      }), w.forEach(([A, U]) => {
        S.push([z.get(A), z.get(U)]);
      });
    }
    S.push([]), e.points.val = r, e.polylines && (e.polylines.val = S), e.areas && (e.areas.val = W);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return x(), t;
  }, window.__hekatanVoladoSelection = (n, o = {}) => {
    var _a3, _b, _c;
    const a = Number(n);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const t = o.losa !== false, s = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", d = e.points.rawVal, h = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = [];
    if ([...Xe].forEach((Z) => {
      if (Z.startsWith("seg:")) {
        const b = Z.split(":"), u = +b[1], C = +b[2], E = h[u] || [], G = E[C], z = E[C + 1];
        G != null && z != null && m.push([G, z]);
      } else if (Z.startsWith("poly:")) {
        const b = h[+Z.slice(5)] || [];
        for (let u = 0; u + 1 < b.length; u++) m.push([b[u], b[u + 1]]);
      }
    }), !m.length) return 0;
    let g = 0, k = 0;
    for (const Z of d) g += Z[0], k += Z[1];
    g /= Math.max(1, d.length), k /= Math.max(1, d.length), Dt();
    const w = [...d];
    let r = h.slice();
    r.length && r[r.length - 1].length === 0 && (r = r.slice(0, -1));
    const S = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let W = 0;
    for (const [Z, b] of m) {
      const u = d[Z], C = d[b];
      if (!u || !C) continue;
      const E = C[0] - u[0], G = C[1] - u[1], z = Math.hypot(E, G);
      if (z < 1e-6) continue;
      let A = -G / z, U = E / z;
      const ee = (u[0] + C[0]) / 2, ue = (u[1] + C[1]) / 2;
      (ee - g) * A + (ue - k) * U < 0 && (A = -A, U = -U);
      const _e = i === "ambos" ? [1, -1] : [1];
      for (const Ke of _e) {
        const $e = A * a * Ke, Qe = U * a * Ke, ot = w.length;
        w.push([u[0] + $e, u[1] + Qe, u[2]]);
        const lt = w.length;
        w.push([C[0] + $e, C[1] + Qe, C[2]]), r.push([Z, ot]), r.push([b, lt]), s && r.push([ot, lt]), t && (S.push(r.length), r.push([Z, b, lt, ot, Z])), W++;
      }
    }
    if (!W) return 0;
    r.push([]), e.points.val = w, e.polylines && (e.polylines.val = r), e.areas && (e.areas.val = S);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return x(), W;
  }, M.addEventListener("click", (n) => {
    var _a3, _b;
    if (window.__hekatanCursorPx = { x: n.clientX, y: n.clientY }, cn > 5) {
      cn = 0;
      return;
    }
    cn = 0;
    const o = _(n);
    if (!o) return;
    P.setFromCamera($, o);
    const a = oe();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(f.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), d = a[0].point;
      if (!isFinite(d.x) || !isFinite(d.y) || !isFinite(d.z) || i > Math.max(s * 12, 300)) {
        ce("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
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
          let g = Ne;
          if (!g && m) {
            const k = Math.abs(t.x - h[0]), w = Math.abs(t.y - h[1]), r = Math.abs(t.z - h[2]);
            g = k >= w && k >= r ? "x" : w >= r ? "y" : "z";
          }
          g === "x" ? t = new F(t.x, h[1], h[2]) : g === "y" ? t = new F(h[0], t.y, h[2]) : g === "z" && (t = new F(h[0], h[1], t.z));
        }
      }
    }
    if (Pt && Math.abs(n.clientX - Pt.x) <= 3 && Math.abs(n.clientY - Pt.y) <= 3) t = Pt.p.clone();
    else if (dt) t = dt.clone(), ce(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else {
      const s = uo(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s, { x: n.clientX, y: n.clientY });
      if (i) t = new F(i.x, i.y, i.z), ce(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      else {
        const d = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0;
        d && h > 0 && (t = new F(Math.round(t.x / h) * h, Math.round(t.y / h) * h, Math.round(t.z / h) * h));
      }
    }
    ls(t, n);
  });
  const ls = (n, o) => {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const a = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    if (a === "select" || a === "none" || !a) {
      if (Ht) {
        Zt && Un();
        const { kind: t, a: s, b: i } = Ht, d = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Xe.clear(), Xe.has(d) ? Xe.delete(d) : Xe.add(d), Yt(), ce(`\u2713 Seleccionados ${Xe.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const t = !!o && (o.ctrlKey || o.metaKey || o.shiftKey), s = (o == null ? void 0 : o.clientX) ?? 0, i = (o == null ? void 0 : o.clientY) ?? 0;
        Zt ? (Ko(Zt.x, Zt.y, s, i, t), Zt = null) : t || (Zt = { x: s, y: i }, ce("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), ho(s, i, s + 1, i + 1, false));
      }
      return;
    }
    if (a === "axis") {
      const t = window.__hekatanAxisDraw;
      if (!t) return;
      if (!t.pendingStart) {
        t.pendingStart = [n.x, n.y, n.z], ce(`\u{1F4CD} Eje \u2014 click 1 OK en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const s = t.mode === "number", i = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, t.pendingStart, [n.x, n.y, n.z], s);
      ce(`\u2713 Eje "${i}" creado. Click 1=nuevo eje, o cambia tool.`);
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
          t && typeof t == "object" && "val" in t ? t.val = d : window.__hekatanDrawingAuxLines = d, ce(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Qt = -1, ht.visible = false;
          try {
            (_e = window.__hekatanRebuild) == null ? void 0 : _e.call(window);
          } catch {
          }
        }
      } else if (mt >= 0) {
        const t = mt, s = Nt;
        ((_g = (_f = e.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(t)) ?? false ? (Xn(t), ce(`\u{1F5D1} \xC1rea #${t + 1} (shell Q4) borrada`)) : s >= 0 ? (No(t, s), ce(`\u{1F5D1} Segmento ${s + 1} de polil\xEDnea #${t + 1} borrado`)) : (Xn(t), ce(`\u{1F5D1} Polil\xEDnea #${t + 1} borrada`));
      } else ce("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (a === "circle") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        ce("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [t, s] = qe, i = Math.hypot(s[0] - t[0], s[1] - t[1], s[2] - t[2]);
      Math.abs(s[0] - t[0]);
      const d = Math.abs(s[1] - t[1]), m = Math.abs(s[2] - t[2]) < 1e-3 ? "xy" : d < 1e-3 ? "xz" : "yz", g = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, t[0], t[1], t[2], i, g, m), ce(`\u2713 C\xEDrculo dibujado en ${m.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${g} segmentos`), qe = [];
      try {
        (_i = window.__hekatanRebuild) == null ? void 0 : _i.call(window);
      } catch {
      }
      return;
    }
    if (a === "arc") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        ce("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (qe.length === 2) {
        ce("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [t, s, i] = qe, d = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, t, s, i, d), ce(`\u2713 Arco dibujado \u2014 ${d} segmentos`), qe = [];
      try {
        (_k = window.__hekatanRebuild) == null ? void 0 : _k.call(window);
      } catch {
      }
      return;
    }
    if (a === "rect") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        ce("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = qe;
      (_l = window.__hekatanDrawRect) == null ? void 0 : _l.call(window, t, s), ce(`\u2713 Rect\xE1ngulo dibujado \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), qe = [];
      try {
        (_m = window.__hekatanRebuild) == null ? void 0 : _m.call(window);
      } catch {
      }
      return;
    }
    if (a === "medir") {
      const t = Re(o);
      if (!t) return;
      if (Pe.length >= 2 && (Pe = []), Pe.push(t), Pe.length === 1) ve.visible = false, Ue(), ce("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [s, i] = Pe;
        ve.geometry.setFromPoints([new F(s[0], s[1], s[2]), new F(i[0], i[1], i[2])]), ve.visible = true;
        const d = Math.hypot(i[0] - s[0], i[1] - s[1], i[2] - s[2]), h = Math.hypot(i[0] - s[0], i[1] - s[1]);
        we.textContent = `${d.toFixed(3)} m`, Ue(), ce(`\u{1F4CF} Distancia ${d.toFixed(3)} m  \xB7  \u0394x ${(i[0] - s[0]).toFixed(3)}  \u0394y ${(i[1] - s[1]).toFixed(3)}  \u0394z ${(i[2] - s[2]).toFixed(3)}  \xB7  en planta ${h.toFixed(3)} m`);
      }
      x();
      return;
    }
    if (a === "fillarea") {
      const t = e.points.rawVal, s = ((_n2 = e.polylines) == null ? void 0 : _n2.rawVal) ?? [], i = /* @__PURE__ */ new Map(), d = (z, A) => {
        z !== A && ((i.get(z) ?? i.set(z, /* @__PURE__ */ new Set()).get(z)).add(A), (i.get(A) ?? i.set(A, /* @__PURE__ */ new Set()).get(A)).add(z));
      };
      for (const z of s) for (let A = 0; A + 1 < z.length; A++) d(z[A], z[A + 1]);
      const h = (z, A) => {
        var _a4;
        return !!((_a4 = i.get(z)) == null ? void 0 : _a4.has(A));
      }, m = /* @__PURE__ */ new Set(), g = [], k = [...i.keys()];
      for (const z of k) for (const A of i.get(z)) if (!(A < z)) {
        for (const U of i.get(A)) if (U !== z) for (const ee of i.get(U)) {
          if (ee === z || ee === A || !h(ee, z) || h(z, U) || h(A, ee)) continue;
          const ue = [z, A, U, ee].slice().sort((_e2, Ke) => _e2 - Ke).join("-");
          m.has(ue) || (m.add(ue), g.push([z, A, U, ee]));
        }
      }
      for (const z of k) for (const A of i.get(z)) if (!(A < z)) for (const U of i.get(A)) {
        if (U === z || !h(U, z)) continue;
        const ee = [z, A, U].slice().sort((ue, _e2) => ue - _e2).join("-");
        m.has(ee) || (m.add(ee), g.push([z, A, U]));
      }
      const w = ((_q = (_p = (_o2 = window.__hekatanCadState) == null ? void 0 : _o2.get) == null ? void 0 : _p.call(_o2)) == null ? void 0 : _q.workPlane) ?? "xy", r = (z) => w === "xy" ? [z[0], z[1]] : w === "xz" ? [z[0], z[2]] : [z[1], z[2]], S = r([n.x, n.y, n.z]), W = (z, A) => {
        let U = false;
        for (let ee = 0, ue = A.length - 1; ee < A.length; ue = ee++) {
          const _e2 = A[ee][0], Ke = A[ee][1], $e = A[ue][0], Qe = A[ue][1];
          Ke > z[1] != Qe > z[1] && z[0] < ($e - _e2) * (z[1] - Ke) / (Qe - Ke) + _e2 && (U = !U);
        }
        return U;
      }, Z = (z) => {
        let A = 0;
        for (let U = 0, ee = z.length - 1; U < z.length; ee = U++) A += (z[ee][0] + z[U][0]) * (z[ee][1] - z[U][1]);
        return Math.abs(A) / 2;
      };
      let b = null, u = 1 / 0;
      for (const z of g) {
        const A = z.map((ee) => r(t[ee]));
        if (!W(S, A)) continue;
        const U = Z(A);
        U < u && (u = U, b = z);
      }
      if (!b) {
        ce("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const C = b.slice().sort((z, A) => z - A).join("-"), E = ((_r = e.areas) == null ? void 0 : _r.rawVal) ?? [];
      if (E.some((z) => {
        const A = s[z] ?? [];
        return [...new Set(A)].sort((U, ee) => U - ee).join("-") === C;
      })) {
        ce("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      e.polylines.val = [...s, [...b, b[0]]], e.areas.val = [...E, s.length], ce(`\u2713 \xC1rea creada por relleno (${b.length} lados).`);
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (a === "rectarea") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        ce("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = qe;
      (_t2 = window.__hekatanDrawRectArea) == null ? void 0 : _t2.call(window, t, s), ce(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${t[0].toFixed(1)},${t[1].toFixed(1)}) \u2192 (${s[0].toFixed(1)},${s[1].toFixed(1)})`), qe = [];
      return;
    }
    if (a === "polyarea") {
      xe.push([n.x, n.y, n.z]), Q.geometry.setFromPoints(xe.map((t) => new F(t[0], t[1], t[2]))), Q.visible = xe.length >= 1, ce(`\u25B0 \xC1rea libre \u2014 ${xe.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), x();
      return;
    }
    if (a === "plane3") {
      if (qe.push([n.x, n.y, n.z]), qe.length < 3) {
        ce(`\u25E3 Plano inclinado \u2014 punto ${qe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [t, s, i] = qe, d = (_u = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _u.call(window, t, s, i);
      ce(d ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), qe = [];
      return;
    }
    if (a === "col") {
      Dt();
      const t = n.z, s = bt && bt > 0 ? bt : 3;
      e.points.val = [...e.points.rawVal, [n.x, n.y, t], [n.x, n.y, t + s]];
      const i = e.polylines.rawVal, d = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [d - 2, d - 1], []], bt = 0, ce(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_v = window.__hekatanRebuild) == null ? void 0 : _v.call(window);
      } catch {
      }
      return;
    }
    if (a === "wall") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        ce("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
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
      ce(`\u25A5 Pared Q4 creada \u2014 h=${i.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), qe = [], bt = 0;
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
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [d - 2, d - 1], []], bt = 0, ce(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${t.toFixed(2)}m`);
      try {
        (_x = window.__hekatanRebuild) == null ? void 0 : _x.call(window);
      } catch {
      }
      return;
    }
    if (a === "extl") {
      const t = (window.__hekatanSnap2D ?? 0.5) * 1.5, s = Mn(n.x, n.y, n.z, t);
      if (!s) {
        ce("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const i = e.polylines.rawVal, d = e.points.rawVal, h = i[s.polyIdx], m = d[h[s.segIdx]], g = d[h[s.segIdx + 1]];
      if (!m || !g) {
        ce("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const k = bt && bt > 0 ? bt : 3;
      Dt();
      const w = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [m[0], m[1], m[2]], [g[0], g[1], g[2]], [g[0], g[1], g[2] + k], [m[0], m[1], m[2] + k]];
      const r = e.polylines.rawVal;
      if (e.polylines.val = [...r.slice(0, -1), ...r[r.length - 1].length > 0 ? [r[r.length - 1]] : [], [w, w + 1, w + 2, w + 3, w], []], e.areas) {
        const S = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, S];
      }
      bt = 0, ce(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${k.toFixed(2)}m`);
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
      ce(`\u2726 Punto auxiliar agregado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
      return;
    }
    if (a === "aux") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        ce("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [t, s] = qe, i = window.__hekatanDrawingAuxLines;
      if (i) {
        const k = i.rawVal ?? i.val ?? [];
        i.val = [...k, [t[0], t[1], t[2], s[0], s[1], s[2]]];
      }
      const d = s[0] - t[0], h = s[1] - t[1], m = s[2] - t[2], g = Math.sqrt(d * d + h * h + m * m);
      ce(`\u2713 L\xEDnea auxiliar creada \u2014 L=${g.toFixed(2)}m (cyan, no FEM)`), qe = [];
      return;
    }
    if (a === "extend" || a === "trim" || a === "offset") {
      Os(a, [n.x, n.y, n.z]);
      return;
    }
    if (a === "chaflan") {
      if (qe.push([n.x, n.y, n.z]), qe.length === 1) {
        ce("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [t, s] = qe, i = window.__hekatanChaflanR ?? 1, d = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_z = window.__hekatanDrawSlabChaflan) == null ? void 0 : _z.call(window, t, s, i, d, 6);
      const h = Math.abs(s[0] - t[0]).toFixed(1), m = Math.abs(s[1] - t[1]).toFixed(1);
      ce(`\u2713 Losa con chaflanes dibujada \u2014 ${h}\xD7${m}m, r=${i}m, ${d} seg/chafl\xE1n`), qe = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (X = false, Dt(), e.points.val = [...e.points.rawVal, n.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
      const t = e.polylines.rawVal, s = t.length - 1, i = t[s] ?? [];
      if (a === "line" && i.length >= 2) {
        ce(`\uFF0F L\xEDnea \u2014 ${i.length - 1} tramo${i.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_B = window.__hekatanRebuild) == null ? void 0 : _B.call(window);
        } catch {
        }
        return;
      }
      if (a === "area" && i.length === 4) {
        e.polylines.val = [...t.slice(0, -1), [...i, i[0]], []], e.areas && (e.areas.val = [...e.areas.rawVal, s]), ce("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_C = window.__hekatanRebuild) == null ? void 0 : _C.call(window);
        } catch {
        }
        return;
      }
    }
    if (a === "node") ce(`\u25CF Nodo creado en (${n.x.toFixed(2)}, ${n.y.toFixed(2)}, ${n.z.toFixed(2)})`);
    else if (a === "line") ce("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (a === "polyline") ce("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (a === "area") {
      const t = ((_D = e.polylines) == null ? void 0 : _D.rawVal[e.polylines.rawVal.length - 1]) ?? [];
      ce(`\u25A6 \xC1rea \u2014 click ${t.length}/4. Marc\xE1 ${4 - t.length} v\xE9rtice${4 - t.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  M.addEventListener("click", () => Ut()), M.addEventListener("contextmenu", (n) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && xe.length >= 3) {
      n.preventDefault();
      const a = ro();
      ce(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), M.addEventListener("pointermove", (n) => {
    var _a3, _b;
    const o = _(n);
    if (!o) return;
    P.setFromCamera($, o);
    const a = oe();
    if (ie.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const d = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], h = d[d.length - 1] ?? [], m = e.points.rawVal ?? [];
        if (h.length > 0) {
          const g = m[h[h.length - 1]];
          if (g) {
            const k = !!window.__hekatanOrthoMode;
            let w = Ne;
            if (!w && k) {
              const r = Math.abs(t.x - g[0]), S = Math.abs(t.y - g[1]), W = Math.abs(t.z - g[2]);
              w = r >= S && r >= W ? "x" : S >= W ? "y" : "z";
            }
            w === "x" ? t.set(t.x, g[1], g[2]) : w === "y" ? t.set(g[0], t.y, g[2]) : w === "z" && t.set(g[0], g[1], t.z);
          }
        }
      }
      const s = uo(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s, { x: n.clientX, y: n.clientY });
      if (i) t.set(i.x, i.y, i.z);
      else {
        const d = window.__hekatanSnapEnabled !== false, h = window.__hekatanSnap2D ?? 0.5;
        d && h > 0 && (t.x = Math.round(t.x / h) * h, t.y = Math.round(t.y / h) * h, t.z = Math.round(t.z / h) * h);
      }
      ie.geometry.setAttribute("position", new St(t.toArray(), 3));
    }
    x();
  }), M.addEventListener("pointermove", (n) => {
    var _a3;
    const o = _(n);
    if (!o) return;
    P.setFromCamera($, o);
    let a = false;
    const t = P.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const i = new F(...e.points.rawVal[t[0].index]), d = new F(...s[0].point), h = i.sub(d), m = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      m.transformDirection(O.matrixWorld), Math.abs(h.dot(m)) < 1e-4 && (a = true);
    }
    ie.visible = !a;
  });
  let Mo = false, _o;
  M.addEventListener("pointermove", (n) => {
    var _a3;
    if (!cn) return;
    const o = _(n);
    if (!o) return;
    P.setFromCamera($, o);
    let a = false;
    const t = P.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const d = new F(...e.points.rawVal[t[0].index]), h = new F(...s[0].point), m = d.sub(h), g = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      g.transformDirection(O.matrixWorld), Math.abs(m.dot(g)) < 1e-4 && (a = true);
    }
    if (a && cn < 5 && (Mo = true, f.enabled = false, _o = t[0].index), !Mo || cn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (_o !== void 0) {
      let d = s[0].point;
      (n.ctrlKey || n.metaKey) && (d = new F(Math.round(d.x), Math.round(d.y), Math.round(d.z))), i[_o] = d.toArray();
    }
    e.points.val = i;
  }), M.addEventListener("pointerup", () => {
    f.enabled = true, Mo = false;
  }), M.addEventListener("contextmenu", (n) => {
    var _a3;
    const o = _(n);
    if (!o) return;
    P.setFromCamera($, o);
    let a = false;
    const t = P.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const h = new F(...e.points.rawVal[t[0].index]), m = new F(...s[0].point), g = h.sub(m), k = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      k.transformDirection(O.matrixWorld), Math.abs(g.dot(k)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(t[0].index, 1), e.points.val = i, !e.polylines) return;
    const d = e.polylines.rawVal.map((h) => h.filter((m) => m !== t[0].index)).map((h) => h.map((m) => m > t[0].index ? m - 1 : m)).filter((h) => h.length);
    d.push([]), e.polylines.val = d;
  });
}
function Xa(e, l, c) {
  const y = Math.round(14.999999999999998), v = { position: e.position.clone(), quaternion: e.quaternion.clone() }, M = setInterval(P, 1e3 / 30);
  let x = 0;
  function P() {
    x++;
    const $ = x / y;
    e.position.lerpVectors(v.position, l.position, $), e.quaternion.slerpQuaternions(v.quaternion, l.quaternion, $), c && c(), x == y && clearInterval(M);
  }
}
function Ya(e, l, c, p) {
  const f = ga(c, e.elements, p);
  return te.derive(() => {
    f.visible = l.shellResults.val != "none";
  }), f;
}
const Za = 6, $o = 10, Ua = 0.012;
function qa(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ka(e, l, c, p) {
  if (!c && !p) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && c) {
    const y = c[e];
    if (y && y.has(l)) return y.get(l);
  }
  return null;
}
function Ga(e, l, c, p) {
  const f = new rt(), y = new As();
  y.setColorMap("rainbow");
  const v = new Ot(), M = te.state([]);
  return te.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const x = c.val, P = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], $ = qa(l.frameResults.val);
    if (f.children.forEach((L) => {
      L.geometry && L.geometry.dispose(), L.material && L.material.dispose();
    }), f.clear(), !$ || P.length === 0 || x.length === 0) {
      M.val = [];
      return;
    }
    const _ = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, O = (_c = e.deformOutputs) == null ? void 0 : _c.val, ye = [], be = [];
    for (let L = 0; L < P.length; L++) {
      if (P[L].length !== 2) continue;
      const de = Ka($, L, _, O);
      de && (ye.push(de[0], de[1]), be.push({ idx: L, vals: de }));
    }
    if (ye.length === 0) {
      M.val = [];
      return;
    }
    const se = Math.min(...ye), D = Math.max(...ye);
    y.setMin(se), y.setMax(D), M.val = ye;
    const oe = [1 / 0, 1 / 0, 1 / 0], B = [-1 / 0, -1 / 0, -1 / 0];
    for (const L of x) for (let ne = 0; ne < 3; ne++) oe[ne] = Math.min(oe[ne], L[ne]), B[ne] = Math.max(B[ne], L[ne]);
    const le = Math.max(B[0] - oe[0], B[1] - oe[1], B[2] - oe[2], 1) * Ua, N = [], I = [], K = [];
    let X = 0;
    for (const { idx: L, vals: ne } of be) {
      const de = P[L], fe = x[de[0]], ae = x[de[1]];
      if (!fe || !ae) continue;
      const Y = new F(ae[0] - fe[0], ae[1] - fe[1], ae[2] - fe[2]), pe = Y.length();
      if (pe < 1e-10) continue;
      Y.normalize();
      const Q = Math.abs(Y.y) < 0.99 ? new F(0, 1, 0) : new F(1, 0, 0), xe = new F().crossVectors(Y, Q).normalize(), ve = new F().crossVectors(Y, xe).normalize(), Pe = $o + 1, we = Za;
      for (let Re = 0; Re < Pe; Re++) {
        const Ue = Re / $o, et = fe[0] + Y.x * pe * Ue, gt = fe[1] + Y.y * pe * Ue, V = fe[2] + Y.z * pe * Ue, H = ne[0] + (ne[1] - ne[0]) * Ue, j = y.getColor(H) ?? new Ot(0, 0, 0);
        v.copy(j).convertSRGBToLinear();
        for (let J = 0; J < we; J++) {
          const ge = J / we * Math.PI * 2, he = Math.cos(ge), ke = Math.sin(ge);
          N.push(et + (xe.x * he + ve.x * ke) * le, gt + (xe.y * he + ve.y * ke) * le, V + (xe.z * he + ve.z * ke) * le), I.push(v.r, v.g, v.b);
        }
      }
      for (let Re = 0; Re < $o; Re++) for (let Ue = 0; Ue < we; Ue++) {
        const et = (Ue + 1) % we, gt = X + Re * we + Ue, V = X + Re * we + et, H = X + (Re + 1) * we + Ue, j = X + (Re + 1) * we + et;
        K.push(gt, V, j), K.push(gt, j, H);
      }
      X += Pe * we;
    }
    if (N.length === 0) return;
    const T = new Fe();
    T.setAttribute("position", new St(N, 3)), T.setAttribute("color", new St(I, 3)), T.setIndex(K), T.computeVertexNormals();
    const q = new ut({ vertexColors: true, side: Ft }), R = new it(T, q);
    R.frustumCulled = false, f.add(R);
  }), f.__colorMapValues = M, f;
}
function Ha() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Wa = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Ja = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Oa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Mt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Qa = 16755200, Ms = 56831, ja = 56831, ei = 56831, to = 65382;
function ti(e) {
  const l = new rt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const c = new bn(1, 16, 16), p = new ut({ color: Qa, transparent: true, opacity: 0.85, depthTest: false }), f = new it(c, p);
  f.visible = false, f.renderOrder = 100, l.add(f);
  const y = new Fe(), v = new wt({ color: Ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), M = new jt(y, v);
  M.visible = false, M.renderOrder = 100, l.add(M);
  const x = new ut({ color: Ms, transparent: true, opacity: 0.7, depthTest: false }), P = new it(new xs(1, 1, 1, 12), x);
  P.visible = false, P.renderOrder = 100, l.add(P);
  const $ = new Fe(), _ = new ut({ color: ja, transparent: true, opacity: 0.45, side: Ft, depthTest: false }), O = new it($, _);
  O.visible = false, O.renderOrder = 100, l.add(O);
  const ye = new Fe(), be = new wt({ color: ei, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new jt(ye, be);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const D = new ut({ color: to, transparent: true, opacity: 0.95, depthTest: false }), oe = new ut({ color: to, transparent: true, opacity: 0.85, depthTest: false }), B = new xs(1, 1, 1, 12), ie = new ut({ color: to, transparent: true, opacity: 0.55, side: Ft, depthTest: false }), le = new wt({ color: to, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), N = [];
  window.__hekatanModelSelection = N;
  const I = new rt();
  I.renderOrder = 101, l.add(I);
  const K = document.createElement("div");
  Object.assign(K.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), K.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(K);
  }, 0);
  function X(V) {
    const H = e.derivedNodes.rawVal;
    return !H || V < 0 || V >= H.length ? null : new F(H[V][0], H[V][1], H[V][2]);
  }
  function T(V, H) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const j = e.getActiveCamera();
    if (!j || !e.mesh) return null;
    const J = e.rendererElm.getBoundingClientRect(), ge = V - J.left, he = H - J.top, ke = e.derivedNodes.rawVal, me = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!ke || !me) return null;
    const De = /* @__PURE__ */ new Map(), Ve = (Be) => {
      if (De.has(Be)) return De.get(Be);
      const Le = X(Be);
      if (!Le) return De.set(Be, null), null;
      const ze = Le.clone().project(j), We = (ze.x * 0.5 + 0.5) * J.width, Ce = (-ze.y * 0.5 + 0.5) * J.height, Ne = { x: We, y: Ce, z: ze.z };
      return De.set(Be, Ne), Ne;
    }, tt = /* @__PURE__ */ new Set();
    for (const Be of me) if (Be) for (const Le of Be) tt.add(Le);
    const Oe = 8;
    let Ye = -1, vt = Oe;
    for (let Be = 0; Be < ke.length; Be++) {
      if (!tt.has(Be)) continue;
      const Le = Ve(Be);
      if (!Le || Le.z < -1 || Le.z > 1) continue;
      const ze = Le.x - ge, We = Le.y - he, Ce = Math.sqrt(ze * ze + We * We);
      Ce < vt && (vt = Ce, Ye = Be);
    }
    const He = Ha(), Me = Ja[He.dispUnit] ?? 1e3, Ae = Wa[He.forceUnit] ?? 1;
    if (Ye >= 0) {
      const Be = ke[Ye];
      let Le = `Nodo ${Ye}
(${Be[0].toFixed(3)}, ${Be[1].toFixed(3)}, ${Be[2].toFixed(3)})`;
      const ze = (_c = (_b = e.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c.rawVal;
      if (ze == null ? void 0 : ze.deformations) {
        const We = ze.deformations.get(Ye);
        if (We && (Le += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Le += `
Ux = ${Mt(We[0] * Me, 3)} ${He.dispUnit}`, Le += `
Uy = ${Mt(We[1] * Me, 3)} ${He.dispUnit}`, Le += `
Uz = ${Mt(We[2] * Me, 3)} ${He.dispUnit}`, (Math.abs(We[3]) > 1e-9 || Math.abs(We[4]) > 1e-9 || Math.abs(We[5]) > 1e-9) && (Le += `
Rx = ${Mt(We[3] * 1e3, 3)} mrad`, Le += `
Ry = ${Mt(We[4] * 1e3, 3)} mrad`, Le += `
Rz = ${Mt(We[5] * 1e3, 3)} mrad`)), ze.reactions) {
          const Ce = ze.reactions.get(Ye);
          Ce && (Math.abs(Ce[0]) > 1e-9 || Math.abs(Ce[1]) > 1e-9 || Math.abs(Ce[2]) > 1e-9 || Math.abs(Ce[3]) > 1e-6 || Math.abs(Ce[4]) > 1e-6 || Math.abs(Ce[5]) > 1e-6) && (Le += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Le += `
Fx = ${Mt(Ce[0] * Ae)} ${He.forceUnit}`, Le += `
Fy = ${Mt(Ce[1] * Ae)} ${He.forceUnit}`, Le += `
Fz = ${Mt(Ce[2] * Ae)} ${He.forceUnit}`, (Math.abs(Ce[3]) > 1e-6 || Math.abs(Ce[4]) > 1e-6 || Math.abs(Ce[5]) > 1e-6) && (Le += `
Mx = ${Mt(Ce[3] * Ae)} ${He.forceUnit}\xB7m`, Le += `
My = ${Mt(Ce[4] * Ae)} ${He.forceUnit}\xB7m`, Le += `
Mz = ${Mt(Ce[5] * Ae)} ${He.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: Ye, info: Le };
    }
    const ct = 5;
    let Ge = -1, at = ct, ft = "frame";
    for (let Be = 0; Be < me.length; Be++) {
      const Le = me[Be];
      if (!(!Le || Le.length < 2)) {
        if (Le.length === 2) {
          const ze = Ve(Le[0]), We = Ve(Le[1]);
          if (!ze || !We || ze.z < -1 || ze.z > 1 || We.z < -1 || We.z > 1) continue;
          const Ce = ni(ge, he, ze.x, ze.y, We.x, We.y);
          Ce < at && (at = Ce, Ge = Be, ft = "frame");
        } else if (Le.length === 3 || Le.length === 4) {
          const ze = [];
          let We = true;
          for (const Ce of Le) {
            const Ne = Ve(Ce);
            if (!Ne || Ne.z < -1 || Ne.z > 1) {
              We = false;
              break;
            }
            ze.push(Ne);
          }
          if (!We) continue;
          if (oi(ge, he, ze)) {
            const Ne = ze.reduce((dt, Pt) => dt + Pt.z, 0) / ze.length * 1e-3;
            Ne < at && (at = Ne, Ge = Be, ft = "shell");
          }
        } else if (Le.length === 8) {
          const ze = [];
          let We = true;
          for (const Ee of Le) {
            const nt = Ve(Ee);
            if (!nt || nt.z < -1 || nt.z > 1) {
              We = false;
              break;
            }
            ze.push(nt);
          }
          if (!We) continue;
          const Ce = Math.min(...ze.map((Ee) => Ee.x)), Ne = Math.max(...ze.map((Ee) => Ee.x)), dt = Math.min(...ze.map((Ee) => Ee.y)), Pt = Math.max(...ze.map((Ee) => Ee.y));
          if (ge >= Ce && ge <= Ne && he >= dt && he <= Pt) {
            const nt = ze.reduce((_t, kt) => _t + kt.z, 0) / ze.length * 1e-3;
            nt < at && (at = nt, Ge = Be, ft = "solid");
          }
        }
      }
    }
    if (Ge >= 0) {
      const Be = me[Ge];
      let ze = `${ft === "frame" ? "Frame" : ft === "shell" ? "Shell" : "Solid"} ${Ge}`;
      const We = (_e = (_d = e.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e.rawVal, Ce = (_g = (_f = We == null ? void 0 : We.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, Ge);
      if (Ce) {
        Ce.name && (ze += `
  \u{1F4CB} ${Ce.name}`), Ce.shape && (ze += `
  Shape: ${Ce.shape}`);
        const Ne = /concrete|hormig|rect.*sólida/i.test(Ce.shape || ""), dt = Ne ? 100 : 1e3, Pt = Ne ? "cm" : "mm", Ee = (_t) => {
          const kt = _t * dt;
          return Math.abs(kt - Math.round(kt)) < 0.05 ? `${Math.round(kt)}` : `${kt.toFixed(1)}`;
        }, nt = [];
        if (Ce.D != null && nt.push(`D=${Ee(Ce.D)}`), Ce.B != null && nt.push(`B=${Ee(Ce.B)}`), Ce.TF != null && nt.push(`TF=${Ee(Ce.TF)}`), Ce.TW != null && nt.push(`TW=${Ee(Ce.TW)}`), Ce.t != null && nt.push(`t=${Ee(Ce.t)}`), nt.length && (ze += `
  Dim: ${nt.join(" ")} ${Pt}`), Ce.material) {
          let _t = Ce.material;
          Ce.fillMaterial && (_t += ` + FILL "${Ce.fillMaterial}"`), ze += `
  Mat: ${_t}`;
        }
      } else {
        const Ne = (_i = (_h = We == null ? void 0 : We.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, Ge), dt = (_k = (_j = We == null ? void 0 : We.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, Ge);
        Ne ? (ze += `
  ${Ne}`, dt && !Ne.includes(dt) && (ze += `  (${dt})`)) : dt && (ze += `
  Material: ${dt}`);
      }
      if (ze += `
nodos: [${Be.join(", ")}]`, ft === "shell" && ((_l = e.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const Ne = e.mesh.analyzeOutputs.rawVal, dt = Oa[He.stressUnit] ?? 1, Pt = [["bendingXX", "Mxx", Ae, `${He.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ae, `${He.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ae, `${He.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ae, `${He.forceUnit}/m`], ["membraneYY", "Nyy", Ae, `${He.forceUnit}/m`], ["membraneXY", "Nxy", Ae, `${He.forceUnit}/m`], ["shearX", "Qx", Ae, `${He.forceUnit}/m`], ["shearY", "Qy", Ae, `${He.forceUnit}/m`], ["vonMises", "\u03C3VM", dt, He.stressUnit], ["pressure", "p", dt, He.stressUnit]], Ee = [];
        for (const [nt, _t, kt, Kt] of Pt) {
          const tn = Ne == null ? void 0 : Ne[nt];
          if (tn && tn instanceof Map) {
            const ht = tn.get(Ge);
            if (ht != null) {
              if (typeof ht == "number") Ee.push(`${_t} = ${Mt(ht * kt, 3)} ${Kt}`);
              else if (Array.isArray(ht)) {
                let mt = ht[0];
                for (const Nt of ht) Math.abs(Nt) > Math.abs(mt) && (mt = Nt);
                Ee.push(`${_t} = ${Mt(mt * kt, 3)} ${Kt}`);
              }
            }
          }
        }
        Ee.length > 0 && (ze += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ee.slice(0, 8).join(`
`));
      }
      if (ft === "frame" && ((_m = e.mesh) == null ? void 0 : _m.deformOutputs) && e.mesh.elementInputs) {
        const Ne = e.mesh.deformOutputs.rawVal, dt = e.mesh.elementInputs.rawVal, Pt = Ne == null ? void 0 : Ne.deformations;
        if (Pt && Be.length === 2) {
          const Ee = Pt.get(Be[0]), nt = Pt.get(Be[1]), _t = ke[Be[0]], kt = ke[Be[1]];
          if (Ee && nt && _t && kt) {
            const Kt = kt[0] - _t[0], tn = kt[1] - _t[1], ht = kt[2] - _t[2], mt = Math.sqrt(Kt * Kt + tn * tn + ht * ht);
            if (mt > 1e-9) {
              const Nt = Kt / mt, Qt = tn / mt, Xe = ht / mt, Xt = (nt[0] - Ee[0]) * Nt + (nt[1] - Ee[1]) * Qt + (nt[2] - Ee[2]) * Xe, Vt = ((_n = dt.elasticities) == null ? void 0 : _n.get(Ge)) ?? 0, fn = ((_o = dt.areas) == null ? void 0 : _o.get(Ge)) ?? 0, In = ((_p = dt.momentsOfInertiaY) == null ? void 0 : _p.get(Ge)) ?? 0, Gt = ((_q = dt.momentsOfInertiaZ) == null ? void 0 : _q.get(Ge)) ?? 0, hn = ((_r = dt.torsionalConstants) == null ? void 0 : _r.get(Ge)) ?? 0, Ht = ((_s2 = dt.shearModuli) == null ? void 0 : _s2.get(Ge)) ?? Vt / 2.6, Rn = Vt * fn * (Xt / mt), Yt = (nt[3] - Ee[3]) * Nt + (nt[4] - Ee[4]) * Qt + (nt[5] - Ee[5]) * Xe, sn = Ht * hn * (Yt / mt), Mn = nt[4] - Ee[4], Dn = nt[5] - Ee[5], Bn = Vt * In * Mn / mt, Nn = Vt * Gt * Dn / mt;
              ze += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, ze += `
L = ${Mt(mt, 3)} m`, ze += `
\u0394L = ${Mt(Xt * Me, 3)} ${He.dispUnit}`, ze += `
\u03B5 = ${Mt(Xt / mt, 6)}`, Math.abs(Rn) > 1e-6 && (ze += `
N \u2248 ${Mt(Rn * Ae)} ${He.forceUnit}`), Math.abs(sn) > 1e-6 && (ze += `
T \u2248 ${Mt(sn * Ae)} ${He.forceUnit}\xB7m`), Math.abs(Bn) > 1e-6 && (ze += `
My \u2248 ${Mt(Bn * Ae)} ${He.forceUnit}\xB7m`), Math.abs(Nn) > 1e-6 && (ze += `
Mz \u2248 ${Mt(Nn * Ae)} ${He.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: ft, idx: Ge, info: ze };
    }
    return null;
  }
  function q(V, H, j) {
    var _a2, _b, _c;
    if (f.visible = false, M.visible = false, P.visible = false, O.visible = false, se.visible = false, !V || !e.mesh) {
      K.style.display = "none", e.render();
      return;
    }
    const J = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (V.type === "node") {
      const me = X(V.idx);
      if (me) {
        const De = e.derivedNodes.rawVal ?? [];
        let Ve = 1;
        if (De.length >= 2) {
          let Ye = [1 / 0, 1 / 0, 1 / 0], vt = [-1 / 0, -1 / 0, -1 / 0];
          for (const He of De) for (let Me = 0; Me < 3; Me++) He[Me] < Ye[Me] && (Ye[Me] = He[Me]), He[Me] > vt[Me] && (vt[Me] = He[Me]);
          Ve = Math.max(vt[0] - Ye[0], vt[1] - Ye[1], vt[2] - Ye[2], 0.1);
        }
        const tt = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Oe = 0.021 * Ve * tt;
        f.position.copy(me), f.scale.setScalar(Oe), f.visible = true;
      }
    } else if (V.type === "frame" && J) {
      const me = J[V.idx], De = X(me[0]), Ve = X(me[1]);
      if (De && Ve) {
        const tt = De.clone().add(Ve).multiplyScalar(0.5), Oe = Ve.clone().sub(De), Ye = Oe.length(), Me = e.getActiveCamera().position.distanceTo(tt) * 35e-4;
        P.position.copy(tt);
        const Ae = new F(0, 1, 0), ct = Ae.clone().cross(Oe).normalize(), Ge = Ae.angleTo(Oe);
        P.quaternion.setFromAxisAngle(ct, Ge), P.scale.set(Me, Ye, Me), P.visible = true;
      }
    } else if (V.type === "shell" && J) {
      const me = J[V.idx], De = [], Ve = [];
      for (const tt of me) {
        const Oe = X(tt);
        if (!Oe) return;
        De.push(Oe.x, Oe.y, Oe.z);
      }
      me.length === 4 ? Ve.push(0, 1, 2, 0, 2, 3) : me.length === 3 && Ve.push(0, 1, 2), $.setAttribute("position", new St(De, 3)), $.setIndex(Ve), $.computeVertexNormals(), O.visible = true;
    } else if (V.type === "solid" && J) {
      const me = J[V.idx], De = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ve = [];
      for (const [tt, Oe] of De) {
        const Ye = X(me[tt]), vt = X(me[Oe]);
        Ye && vt && Ve.push(Ye.x, Ye.y, Ye.z, vt.x, vt.y, vt.z);
      }
      ye.setAttribute("position", new St(Ve, 3)), se.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      K.style.display = "none", e.render();
      return;
    }
    K.textContent = V.info, K.style.whiteSpace = "pre-line", K.style.display = "block";
    const he = e.rendererElm.getBoundingClientRect(), ke = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? he;
    K.style.left = `${H - ke.left}px`, K.style.top = `${j - ke.top}px`, e.render();
  }
  let R = "", L = 0, ne = 0;
  const de = window.__hekatanHoverDebug ?? false, fe = (V) => {
    L && cancelAnimationFrame(L), L = requestAnimationFrame(() => {
      var _a2, _b, _c;
      const H = T(V.clientX, V.clientY);
      if (de && ne < 5) {
        const J = e.derivedNodes.rawVal, ge = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${V.clientX}, ${V.clientY}) nodes=${(J == null ? void 0 : J.length) ?? 0} elems=${(ge == null ? void 0 : ge.length) ?? 0} hover=`, H), ne++;
      }
      const j = H ? `${H.type}:${H.idx}` : "";
      if (j !== R) R = j, q(H, V.clientX, V.clientY);
      else if (H) {
        const J = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        K.style.left = `${V.clientX - J.left}px`, K.style.top = `${V.clientY - J.top}px`;
      }
    });
  };
  let ae = null;
  const Y = () => {
    R = "", f.visible = false, M.visible = false, P.visible = false, O.visible = false, se.visible = false, K.style.display = "none", e.render();
  }, pe = (V) => {
    const H = e.rendererElm.getBoundingClientRect(), j = V.clientX - H.left, J = V.clientY - H.top;
    (j < -2 || J < -2 || j > H.width + 2 || J > H.height + 2) && (ae && clearTimeout(ae), ae = window.setTimeout(Y, 200));
  }, Q = () => {
    ae && (clearTimeout(ae), ae = null);
  };
  e.rendererElm.addEventListener("pointermove", fe), e.rendererElm.addEventListener("pointerleave", pe), e.rendererElm.addEventListener("pointerenter", Q);
  function xe() {
    var _a2, _b, _c;
    const V = ((_c = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c.tool) ?? "select";
    return V === "select" || V === "none" || !V;
  }
  let ve = null;
  e.rendererElm.addEventListener("pointerdown", (V) => {
    V.button === 0 && (ve = { x: V.clientX, y: V.clientY });
  }), e.rendererElm.addEventListener("pointerup", (V) => {
    if (V.button !== 0 || !ve) return;
    const H = V.clientX - ve.x, j = V.clientY - ve.y;
    if (ve = null, H * H + j * j > 9 || !xe()) return;
    const J = T(V.clientX, V.clientY);
    J ? (et({ type: J.type, idx: J.idx }, V.shiftKey), Ue()) : gt();
  }), window.addEventListener("keydown", (V) => {
    if (V.key !== "Escape" || !N.length) return;
    const H = document.activeElement, j = !!H && (H.id === "hk3-cmd-input" || H.id === "hk-dyn-input") && H.value === "";
    H && (H.tagName === "INPUT" || H.tagName === "TEXTAREA" || H.isContentEditable) && !j || gt();
  }, { capture: true });
  function Pe() {
    for (const V of I.children.slice()) {
      I.remove(V);
      const H = V.geometry;
      H && H !== c && H !== B && H.dispose();
    }
  }
  const we = (V) => {
    var _a2;
    const H = e.getActiveCamera(), j = ((_a2 = e.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return H.isOrthographicCamera ? (H.top - H.bottom) / (H.zoom || 1) / j : 2 * H.position.distanceTo(V) * Math.tan((H.fov || 50) * Math.PI / 180 / 2) / j;
  };
  function Re(V, H) {
    var _a2, _b;
    const j = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (V.type === "node") {
      const J = X(V.idx);
      if (!J) return;
      const ge = new it(c, D);
      ge.position.copy(J), ge.scale.setScalar(Math.max(1e-4, 7 * we(J))), ge.renderOrder = 101, I.add(ge);
    } else if (V.type === "frame" && j) {
      const J = j[V.idx], ge = X(J[0]), he = X(J[1]);
      if (!ge || !he) return;
      const ke = ge.clone().add(he).multiplyScalar(0.5), me = he.clone().sub(ge), De = me.length(), Ve = e.getActiveCamera().position.distanceTo(ke), tt = new it(B, oe);
      tt.position.copy(ke);
      const Oe = new F(0, 1, 0);
      tt.quaternion.setFromAxisAngle(Oe.clone().cross(me).normalize(), Oe.angleTo(me)), tt.scale.set(Ve * 35e-4, De, Ve * 35e-4), tt.renderOrder = 101, I.add(tt);
    } else if (V.type === "shell" && j) {
      const J = j[V.idx], ge = [], he = [];
      for (const De of J) {
        const Ve = X(De);
        if (!Ve) return;
        ge.push(Ve.x, Ve.y, Ve.z);
      }
      J.length === 4 ? he.push(0, 1, 2, 0, 2, 3) : J.length === 3 && he.push(0, 1, 2);
      const ke = new Fe();
      ke.setAttribute("position", new St(ge, 3)), ke.setIndex(he), ke.computeVertexNormals();
      const me = new it(ke, ie);
      me.renderOrder = 101, I.add(me);
    } else if (V.type === "solid" && j) {
      const J = j[V.idx], ge = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], he = [];
      for (const [De, Ve] of ge) {
        const tt = X(J[De]), Oe = X(J[Ve]);
        tt && Oe && he.push(tt.x, tt.y, tt.z, Oe.x, Oe.y, Oe.z);
      }
      const ke = new Fe();
      ke.setAttribute("position", new St(he, 3));
      const me = new jt(ke, le);
      me.renderOrder = 101, I.add(me);
    }
  }
  function Ue() {
    if (Pe(), !N.length || !e.mesh) {
      e.render();
      return;
    }
    const V = e.derivedNodes.rawVal ?? [];
    if (V.length >= 2) {
      const H = [1 / 0, 1 / 0, 1 / 0], j = [-1 / 0, -1 / 0, -1 / 0];
      for (const J of V) for (let ge = 0; ge < 3; ge++) J[ge] < H[ge] && (H[ge] = J[ge]), J[ge] > j[ge] && (j[ge] = J[ge]);
      Math.max(j[0] - H[0], j[1] - H[1], j[2] - H[2], 0.1);
    }
    for (const H of N) Re(H);
    e.render();
  }
  function et(V, H) {
    const j = N.findIndex((J) => J.type === V.type && J.idx === V.idx);
    j >= 0 ? N.splice(j, 1) : H || N.push(V), N.length && N[N.length - 1];
  }
  function gt() {
    N.length = 0, Ue();
  }
  return te.derive(() => {
    e.derivedNodes.val, N.length && Ue();
  }), l;
}
function ni(e, l, c, p, f, y) {
  const v = f - c, M = y - p, x = v * v + M * M;
  if (x < 1e-9) {
    const be = e - c, se = l - p;
    return Math.sqrt(be * be + se * se);
  }
  let P = ((e - c) * v + (l - p) * M) / x;
  P = Math.max(0, Math.min(1, P));
  const $ = c + P * v, _ = p + P * M, O = e - $, ye = l - _;
  return Math.sqrt(O * O + ye * ye);
}
function oi(e, l, c) {
  let p = false;
  for (let f = 0, y = c.length - 1; f < c.length; y = f++) {
    const v = c[f].x, M = c[f].y, x = c[y].x, P = c[y].y;
    M > l != P > l && e < (x - v) * (l - M) / (P - M + 1e-12) + v && (p = !p);
  }
  return p;
}
const si = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, ai = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, rn = 1e-3;
function Vn(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function ii(e, l) {
  const c = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < rn ? { plano: "XZ", en: e[1] } : c < rn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function li(e, l) {
  var _a2, _b;
  let c = null, p = { plano: "XZ", en: 0 };
  const f = () => {
    var _a3, _b2;
    const B = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !B || B === "none" ? null : String(B).replace(/^contour:/, "");
  }, y = (B) => {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], N = /* @__PURE__ */ new Set();
    for (const I of le) {
      if (I.length !== 2) continue;
      const K = ie[I[0]], X = ie[I[1]];
      if (!K || !X) continue;
      const T = Vn(K, B), q = Vn(X, B);
      Math.abs(T.fuera - q.fuera) < rn && N.add(Math.round(T.fuera * 1e3) / 1e3);
    }
    return [...N].sort((I, K) => I - K);
  };
  function v(B) {
    var _a3, _b2;
    if (B == null ? void 0 : B.plano) p = { plano: B.plano, en: B.en ?? y(B.plano)[0] ?? 0 };
    else {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((K) => K.type === "frame"), N = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], I = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      le && I[le.idx] && N[I[le.idx][0]] && N[I[le.idx][1]] ? p = ii(N[I[le.idx][0]], N[I[le.idx][1]]) : p = { plano: "XZ", en: y("XZ")[0] ?? 0 };
    }
    c || M(), c.hidden = false, x();
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
      p = { plano: B.value, en: y(B.value)[0] ?? 0 }, x();
    }), ie.addEventListener("change", () => {
      p.en = Number(ie.value), x();
    });
    const le = (K) => {
      const X = y(p.plano), T = X.findIndex((R) => Math.abs(R - p.en) < rn), q = Math.max(0, Math.min(X.length - 1, (T < 0 ? 0 : T) + K));
      X.length && (p.en = X[q], x());
    };
    c.querySelector(".hk-d2-ant").addEventListener("click", () => le(-1)), c.querySelector(".hk-d2-sig").addEventListener("click", () => le(1));
    const N = c.querySelector(".hk-d2-bar");
    let I = null;
    N.addEventListener("pointerdown", (K) => {
      if (K.target.closest("select,button")) return;
      const X = c.getBoundingClientRect();
      I = { x: K.clientX, y: K.clientY, l: X.left, t: X.top }, c.style.transform = "none", c.style.left = X.left + "px", c.style.top = X.top + "px";
    }), window.addEventListener("pointermove", (K) => {
      !I || !c || (c.style.left = I.l + K.clientX - I.x + "px", c.style.top = I.t + K.clientY - I.y + "px");
    }), window.addEventListener("pointerup", () => {
      I = null;
    }), new ResizeObserver(() => {
      c && !c.hidden && x();
    }).observe(c);
  }
  function x() {
    var _a3, _b2, _c, _d, _e, _f, _g, _h;
    if (!c || c.hidden) return;
    const B = new Set(_ && !_.hidden && O >= 0 ? be(O) : []), ie = c.querySelector(".hk-d2-svg"), le = c.querySelector(".hk-d2-tit"), N = c.querySelector(".hk-d2-pie"), I = c.querySelector(".hk-d2-plano"), K = c.querySelector(".hk-d2-en");
    I.value = p.plano;
    const X = y(p.plano), T = p.plano === "XZ" ? "y" : p.plano === "YZ" ? "x" : "z", q = p.plano === "XY" ? "Planta" : "P\xF3rtico";
    K.innerHTML = X.map((Me, Ae) => `<option value="${Me}" ${Math.abs(Me - p.en) < rn ? "selected" : ""}>${q} ${Ae + 1} \xB7 ${T} = ${Me.toFixed(2)} m</option>`).join("");
    const R = f(), L = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ne = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], de = R ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[R] : null;
    ie.innerHTML = "";
    const fe = ie.clientWidth || 880, ae = ie.clientHeight || 480, Y = [];
    if (ne.forEach((Me, Ae) => {
      if (Me.length !== 2) return;
      const ct = L[Me[0]], Ge = L[Me[1]];
      if (!ct || !Ge) return;
      const at = Vn(ct, p.plano), ft = Vn(Ge, p.plano);
      Math.abs(at.fuera - p.en) < rn && Math.abs(ft.fuera - p.en) < rn && Y.push({ i: Ae, a: at, b: ft });
    }), !Y.length) {
      N.textContent = "No hay barras en este plano.", le.textContent = "";
      return;
    }
    let pe = 1 / 0, Q = -1 / 0, xe = 1 / 0, ve = -1 / 0;
    for (const Me of Y) for (const Ae of [Me.a, Me.b]) pe = Math.min(pe, Ae.u), Q = Math.max(Q, Ae.u), xe = Math.min(xe, Ae.v), ve = Math.max(ve, Ae.v);
    const Pe = Q - pe || 1, we = ve - xe || 1, Re = 0.12 * Math.max(Pe, we), Ue = 46, et = Math.min((fe - 2 * Ue) / (Pe + 2 * Re), (ae - 2 * Ue) / (we + 2 * Re)), gt = (fe - Pe * et) / 2, V = (ae - we * et) / 2, H = (Me) => gt + (Me - pe) * et, j = (Me) => ae - (V + (Me - xe) * et), J = "http://www.w3.org/2000/svg", ge = (Me, Ae, ct) => {
      const Ge = document.createElementNS(J, Me);
      for (const at in Ae) Ge.setAttribute(at, String(Ae[at]));
      return ct != null && (Ge.textContent = ct), ie.appendChild(Ge), Ge;
    }, he = /* @__PURE__ */ new Map();
    for (const Me of Y) {
      const Ae = ((_h = (_g = (_f = (_e = e.elementInputs) == null ? void 0 : _e.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Me.i)) ?? 0, ct = Vn(Ls(R ?? "normals", Ts(L[ne[Me.i][0]], L[ne[Me.i][1]], Ae)), p.plano), Ge = Math.hypot(ct.u, ct.v);
      he.set(Me.i, Ge > 0.3 ? [ct.u / Ge, -ct.v / Ge] : null);
    }
    const ke = Y.filter((Me) => !he.get(Me.i)).length;
    let me = 0;
    if (de) for (const Me of Y) {
      if (!he.get(Me.i)) continue;
      const Ae = de instanceof Map ? de.get(Me.i) : de[Me.i];
      Ae && (me = Math.max(me, Math.abs(Ae[0] ?? 0), Math.abs(Ae[1] ?? 0)));
    }
    const De = 0.12 * Math.max(Pe, we) * et, Ve = me > 0 ? De / me : 0, tt = R === "bendingsY" || R === "bendingsZ", Oe = (Me) => Math.abs(Me) >= 100 ? Me.toFixed(1) : Math.abs(Me) >= 10 ? Me.toFixed(2) : Me.toFixed(3), Ye = [];
    for (const Me of Y) {
      const Ae = H(Me.a.u), ct = j(Me.a.v), Ge = H(Me.b.u), at = j(Me.b.v), ft = he.get(Me.i), [Be, Le] = ft ?? [0, 0], ze = de && ft ? de instanceof Map ? de.get(Me.i) : de[Me.i] : null, [We, Ce] = ze ? Lo(R, ze) : [0, 0];
      if (ze && Ve > 0) {
        const Ee = [Ae + Be * We * Ve * 1, ct + Le * We * Ve * 1], nt = [Ge + Be * Ce * Ve * 1, at + Le * Ce * Ve * 1], Kt = We + Ce >= 0 ? "#3fa7d6" : "#d9534f";
        ge("polygon", { points: `${Ae},${ct} ${Ee[0]},${Ee[1]} ${nt[0]},${nt[1]} ${Ge},${at}`, fill: Kt, "fill-opacity": 0.38, stroke: Kt, "stroke-width": 1.2 }), Ye.push({ x: Ee[0] + Be * 12, y: Ee[1] + Le * 12, t: Oe(We), peso: Math.abs(We) }), Ye.push({ x: nt[0] + Be * 12, y: nt[1] + Le * 12, t: Oe(Ce), peso: Math.abs(Ce) });
      }
      ge("line", { x1: Ae, y1: ct, x2: Ge, y2: at, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), B.has(Me.i) && ge("line", { x1: Ae, y1: ct, x2: Ge, y2: at, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const Ne = ge("line", { x1: Ae, y1: ct, x2: Ge, y2: at, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      Ne.addEventListener("click", () => se(Me.i));
      const dt = document.createElementNS(J, "title");
      dt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Ne.appendChild(dt);
    }
    for (const Me of Y) for (const Ae of [Me.a, Me.b]) p.plano !== "XY" && Math.abs(Ae.v - xe) < rn && ge("rect", { x: H(Ae.u) - 6, y: j(Ae.v), width: 12, height: 7, fill: "#b03a3a" });
    const vt = [];
    Ye.sort((Me, Ae) => Ae.peso - Me.peso);
    for (const Me of Ye) Me.peso < 0.02 * me || vt.some((Ae) => Math.hypot(Ae.x - Me.x, Ae.y - Me.y) < 34) || (vt.push(Me), ge("text", { x: Me.x, y: Me.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Me.t));
    const He = R ? si[R] ?? R : "sin resultado";
    le.textContent = `${He} \xB7 ${p.plano === "XY" ? "planta" : "alzado"} ${p.plano} en ${T} = ${p.en.toFixed(2)} m`, N.textContent = R ? `${Y.length} barras en el plano \xB7 m\xE1ximo ${Oe(me)} ${ai[R] ?? ""}` + (tt ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ke ? ` \xB7 ${ke} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const P = () => {
    try {
      x();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, P();
  }));
  let $ = null;
  setInterval(() => {
    var _a3, _b2;
    const B = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, ie = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, le = [B, ie];
    if (!($ && $[0] === B && $[1] === ie)) {
      $ = le, P();
      try {
        oe();
      } catch {
      }
    }
  }, 400);
  let _ = null, O = -1, ye = "12";
  function be(B) {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], N = /* @__PURE__ */ new Map();
    le.forEach((T, q) => {
      if (T.length === 2) for (const R of T) N.has(R) || N.set(R, []), N.get(R).push(q);
    });
    const I = (T) => {
      const q = ie[le[T][0]], R = ie[le[T][1]], L = [R[0] - q[0], R[1] - q[1], R[2] - q[2]], ne = Math.hypot(L[0], L[1], L[2]) || 1;
      return L.map((de) => de / ne);
    }, K = (T, q) => {
      const R = I(T), L = I(q);
      return Math.abs(R[0] * L[0] + R[1] * L[1] + R[2] * L[2]) > 0.9999;
    }, X = [B];
    for (const T of [0, 1]) {
      let q = B, R = le[B][T];
      for (let L = 0; L < 500; L++) {
        const ne = (N.get(R) ?? []).filter((fe) => fe !== q);
        if (ne.length !== 1 || !K(q, ne[0])) break;
        const de = ne[0];
        T === 0 ? X.unshift(de) : X.push(de), R = le[de][0] === R ? le[de][1] : le[de][0], q = de;
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
    O = B, _ || (_ = document.createElement("div"), _.id = "hk-diagrama-barra", _.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), _.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(_), _.querySelector(".hk-b-x").addEventListener("click", () => {
      _.hidden = true, D(), x();
    }), _.querySelector(".hk-b-pl").addEventListener("change", (ie) => {
      ye = ie.target.value, oe();
    })), _.hidden = false, D(), oe(), x();
  }
  function D() {
    if (!c || !_) return;
    const B = window.innerWidth, ie = Math.min(560, Math.round(B * 0.4));
    _.style.width = ie + "px", !_.hidden && !c.hidden ? (c.style.transform = "none", c.style.left = "12px", c.style.width = B - ie - 36 + "px", _.style.top = c.getBoundingClientRect().top + "px") : c.hidden || (c.style.left = "50%", c.style.transform = "translateX(-50%)", c.style.width = "min(900px,92vw)");
  }
  function oe() {
    var _a3, _b2, _c;
    if (!_ || _.hidden || O < 0) return;
    const B = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ie = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], le = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!ie[O]) return;
    const N = be(O), I = [];
    let K = 0, X = -1;
    N.forEach((Q, xe) => {
      const [ve, Pe] = ie[Q], we = xe === 0 ? N.length > 1 && ie[N[1]].includes(ve) : ve !== X, Re = we ? Pe : ve, Ue = we ? ve : Pe, et = Math.hypot(B[Ue][0] - B[Re][0], B[Ue][1] - B[Re][1], B[Ue][2] - B[Re][2]);
      I.push({ x: K, e: Q, fin: we ? 1 : 0 }), K += et, I.push({ x: K, e: Q, fin: we ? 0 : 1 }), X = Ue;
    });
    const T = K, q = (Q, xe) => {
      const ve = le[Q], Pe = ve ? ve instanceof Map ? ve.get(xe.e) : ve[xe.e] : null;
      return Pe ? Lo(Q, Pe)[xe.fin] : 0;
    }, R = B[ie[N[0]][0]], L = (Q) => Q.toFixed(2);
    _.querySelector(".hk-b-tit").textContent = "L = " + T.toFixed(2) + " m \xB7 " + N.length + " tramo(s) \xB7 desde (" + L(R[0]) + ", " + L(R[1]) + ", " + L(R[2]) + ")";
    const ne = ye === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], de = _.querySelector(".hk-b-cuerpo");
    de.innerHTML = "";
    const fe = Math.max(300, de.clientWidth), ae = 124, Y = 46, pe = (ae - 14) / 2;
    for (const [Q, xe, ve, Pe] of ne) {
      const we = I.map((me) => q(Q, me)), Re = Math.max(...we), Ue = Math.min(...we), et = Math.max(Math.abs(Re), Math.abs(Ue)) || 1, gt = (me) => Y + me / (T || 1) * (fe - 2 * Y), V = (me) => pe + (Pe ? 1 : -1) * (me / et) * (pe - 16), H = (me) => Math.abs(me) >= 100 ? me.toFixed(1) : Math.abs(me) >= 10 ? me.toFixed(2) : me.toFixed(3);
      let j = gt(0) + "," + pe + " ";
      I.forEach((me, De) => {
        j += gt(me.x) + "," + V(we[De]) + " ";
      }), j += gt(T) + "," + pe;
      const J = we.indexOf(Re), ge = we.indexOf(Ue), he = (me, De) => {
        const Ve = V(we[me]) + (V(we[me]) < pe ? -5 : 13);
        return '<text x="' + gt(I[me].x) + '" y="' + Ve + '" text-anchor="middle" fill="' + De + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + H(we[me]) + "</text>";
      }, ke = Pe ? "#d9534f" : "#3fa7d6";
      de.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + xe + ' <span style="color:#6f7d90;font-weight:400">(' + ve + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + H(Re) + " \xB7 m\xEDn " + H(Ue) + (Pe ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + fe + '" height="' + ae + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + Y + '" y1="' + pe + '" x2="' + (fe - Y) + '" y2="' + pe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + j + '" fill="' + ke + '" fill-opacity=".35" stroke="' + ke + '" stroke-width="1.4"/>' + he(0, "#f2f5fa") + he(I.length - 1, "#f2f5fa") + (J > 0 && J < I.length - 1 ? he(J, "#8fd3ff") : "") + (ge > 0 && ge < I.length - 1 && ge !== J ? he(ge, "#ff9f9a") : "") + '<text x="' + Y + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (fe - Y) + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + T.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = se, window.__hekatanDiagrama2D = v, { abrir: v, abrirBarra: se };
}
function _s(e, l = 8) {
  const c = document.createElement("div");
  c.id = "legend", c.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    te.derive(() => {
      lo.val, c.style.background = xa();
    });
  });
  const p = document.createElement("div");
  p.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", c.appendChild(p), setTimeout(() => {
    te.derive(() => {
      p.textContent = Io.val ? `[${Io.val}]` : "";
    });
  });
  const f = Array.from({ length: l + 1 }, (x, P) => P / l).reverse();
  let y, v;
  f.forEach((x, P) => {
    y = document.createElement("div"), y.id = `marker-${P}`, y.className = "marker", y.style.marginTop = P == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", v = document.createElement("p"), v.id = `marker-text-${P}`, y.append(v), c.append(y);
  });
  const M = [];
  return c.querySelectorAll("p").forEach((x) => M.push(x)), setTimeout(() => {
    te.derive(() => {
      f.forEach((x, P) => {
        const $ = M[P];
        $ && ($.innerText = ri(e.val, x).toString());
      });
    });
  }), c;
}
function ri(e, l) {
  const c = Ln.val;
  if (c) return ks(c[0] + l * (c[1] - c[0]));
  const p = e.filter((v) => Number.isFinite(v));
  if (p.length === 0) return "0";
  const [f, y] = Ro(p);
  return ks(f + l * (y - f));
}
function ks(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function vi({ mesh: e, settingsObj: l, drawingObj: c, objects3D: p, solids: f }) {
  ma.DEFAULT_UP = new F(0, 0, 1);
  const y = document.createElement("div"), v = new pa(), M = new ua(45, 1, 0.1, 2 * 1e6), x = new fa(-10, 10, 10, -10, -1e3, 2e6);
  let P = M;
  const $ = new ha({ antialias: true });
  $.localClippingEnabled = true;
  const _ = new gs(M, $.domElement);
  _.enableDamping = true, _.dampingFactor = 0.1, _.screenSpacePanning = true, _.zoomSpeed = 0.8, _.panSpeed = 1.2, _.rotateSpeed = 0.9, _.keyPanSpeed = 12, _.listenToKeyEvents(window), _.touches = { ONE: jn.ROTATE, TWO: jn.DOLLY_PAN }, $.domElement.addEventListener("wheel", (V) => {
    if (!V.ctrlKey && Math.abs(V.deltaX) > Math.abs(V.deltaY) * 1.5) {
      V.preventDefault();
      const H = _.target, j = new F().subVectors(M.position, H), J = new F();
      J.crossVectors(M.up, j).normalize();
      const he = j.length() * 1e-3 * _.panSpeed;
      H.addScaledVector(J, V.deltaX * he), M.position.addScaledVector(J, V.deltaX * he), _.update();
    }
  }, { passive: false });
  const O = new Fo(new F(-1, 0, 0), 0), ye = new Fo(new F(0, -1, 0), 0), be = new Fo(new F(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function se() {
    const V = window.__hekatanClip, H = [];
    V.enableX && (O.normal.set(V.invertX ? 1 : -1, 0, 0), O.constant = V.invertX ? -V.posX : V.posX, H.push(O)), V.enableY && (ye.normal.set(0, V.invertY ? 1 : -1, 0), ye.constant = V.invertY ? -V.posY : V.posY, H.push(ye)), V.enableZ && (be.normal.set(0, 0, V.invertZ ? 1 : -1), be.constant = V.invertZ ? -V.posZ : V.posZ, H.push(be)), $.clippingPlanes = H, v.traverse((J) => {
      const ge = J;
      if (ge.material) {
        const he = Array.isArray(ge.material) ? ge.material : [ge.material];
        for (const ke of he) ke.clippingPlanes = H, ke.needsUpdate = true;
      }
    });
    const j = window.__hekatanPanes ?? [];
    for (const J of j) try {
      J && typeof J.refresh == "function" && J.refresh();
    } catch {
    }
    $.render(v, P);
  }
  se(), window.__hekatanClipApply = se;
  const D = ba(l), oe = te.derive(() => Math.pow(10, D.displayScale.val / 10)), B = ci(e, D), ie = () => {
    const V = [];
    return D.gridXY.rawVal && V.push("xy"), D.gridXZ.rawVal && V.push("xz"), D.gridYZ.rawVal && V.push("yz"), V;
  }, le = () => {
    const V = D.gridStep.rawVal, H = Math.max(V, D.gridMajor.rawVal);
    return { planes: ie(), majorStep: H, minorStep: V };
  };
  let N = Eo(D.gridSize.rawVal, le());
  N.visible = D.gridVisible.rawVal, window.__hekatanSnap2D = D.cursorSnap.rawVal;
  const I = () => {
    const V = Math.max(0, Math.min(1, D.gridOpacity.rawVal));
    N.traverse((H) => {
      const j = H.material;
      if (!j || !("opacity" in j)) return;
      const J = H.name ?? "";
      let ge = 0.55;
      J.includes("border") ? ge = 1 : J.includes("major") && (ge = 0.95), j.opacity = V * ge;
    });
  };
  I(), y.appendChild(va(D, e, f)), y.setAttribute("id", "viewer"), y.appendChild($.domElement), $.setPixelRatio(window.devicePixelRatio);
  const K = un();
  $.setClearColor(K.background, 1);
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
    const V = D.gridVisible.val;
    if (R) {
      R = false;
      return;
    }
    N.visible = V, Q();
  });
  let L = true;
  te.derive(() => {
    if (D.gridOpacity.val, L) {
      L = false;
      return;
    }
    I(), Q();
  }), te.derive(() => {
    const V = D.cursorSnap.val;
    window.__hekatanSnap2D = V;
  });
  let ne = true;
  te.derive(() => {
    var _a2, _b, _c;
    const V = D.gridSize.val, H = D.flipAxes.val;
    if (D.gridXY.val, D.gridXZ.val, D.gridYZ.val, D.gridStep.val, D.gridMajor.val, ne) {
      ne = false;
      return;
    }
    v.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (he) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = he.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = he.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), N = Eo(V, le()), N.visible = D.gridVisible.rawVal, v.add(N), I(), v.remove(q), q.traverse((he) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = he.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = he.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), q = bs(V, H), v.add(q);
    const j = V * 0.5 + V * 0.5 / Math.tan(45 * 0.5);
    M.position.distanceTo(_.target);
    const J = Math.abs(M.position.x) < 0.1 && Math.abs(M.position.y) < 0.1 && M.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (J ? M.position.set(0, 0, j) : M.position.set(0.5 * V, -j, 0.5 * V), _.target.set(0, 0, 0)), _.minDistance = Math.max(0.05, V * 0.01), _.maxDistance = Math.max(50, V * 50), _.update(), Q();
  }), new ResizeObserver((V) => {
    var _a2, _b;
    for (const H of V) {
      const j = (_a2 = H.target) == null ? void 0 : _a2.clientWidth, J = (_b = H.target) == null ? void 0 : _b.clientHeight;
      if (j === 0 || J === 0) continue;
      const he = (fe ? j / 2 : j) / J;
      M.aspect = he, M.updateProjectionMatrix();
      const ke = x.top;
      if (x.left = -ke * he, x.right = ke * he, x.updateProjectionMatrix(), ae && ae.isPerspectiveCamera) ae.aspect = he, ae.updateProjectionMatrix();
      else if (ae && ae.isOrthographicCamera) {
        const me = ae, De = me.top;
        me.left = -De * he, me.right = De * he, me.updateProjectionMatrix();
      }
      $.setSize(j, J), Q();
    }
  }).observe(y), _.addEventListener("change", Q), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, D.displayScale.val, D.nodes.val, D.elements.val, (_g = D.edges) == null ? void 0 : _g.val, D.elemColumns.val, D.elemBeams.val, D.nodesIndexes.val, D.elementsIndexes.val, D.orientations.val, D.sections.val, D.secColumns.val, D.secBeams.val, D.secFloor.val, D.supports.val, D.loads.val, D.deformedShape.val, D.nodeResults.val, D.frameResults.val, D.shellResults.val, (_h = D.solidResults) == null ? void 0 : _h.val, (_i = D.extruded) == null ? void 0 : _i.val, setTimeout(Q);
  });
  let fe = false, ae = null, Y = null, pe = false;
  function Q() {
    const V = y.clientWidth || 1, H = y.clientHeight || 1;
    if (!fe || !ae) {
      $.setScissorTest(false), $.setViewport(0, 0, V, H), $.render(v, P);
      return;
    }
    const j = V / 2;
    $.setScissorTest(true), $.setViewport(0, 0, j, H), $.setScissor(0, 0, j, H), $.render(v, P), $.setViewport(j, 0, j, H), $.setScissor(j, 0, j, H), $.render(v, ae), $.setScissorTest(false);
  }
  function xe(V) {
    P = V, _.object = V, _.update(), Q();
  }
  function ve(V, H) {
    fe = V, H && (ae = H);
    const j = y.clientWidth || 1, J = y.clientHeight || 1, he = (V ? j / 2 : j) / J;
    M.isPerspectiveCamera && (M.aspect = he, M.updateProjectionMatrix());
    const ke = x.top;
    if (x.left = -ke * he, x.right = ke * he, x.updateProjectionMatrix(), V && ae) {
      if (Y ? (Y.object = ae, Y.update()) : (Y = new gs(ae, $.domElement), Y.enableDamping = true, Y.dampingFactor = 0.1, Y.screenSpacePanning = true, Y.zoomSpeed = 0.8, Y.panSpeed = 1.2, Y.rotateSpeed = 0.9, Y.touches = { ONE: jn.ROTATE, TWO: jn.DOLLY_PAN }, Y.target.copy(_.target), Y.addEventListener("change", Q), Y.enabled = false), !pe) {
        const me = (De) => {
          if (!fe || !Y) return;
          const Ve = $.domElement.getBoundingClientRect(), tt = De.clientX - Ve.left, Oe = Ve.width / 2, Ye = tt >= Oe;
          _.enabled = !Ye, Y.enabled = Ye;
        };
        $.domElement.addEventListener("pointerdown", me, true), $.domElement.addEventListener("wheel", me, { capture: true, passive: true }), pe = true;
      }
    } else V || (_.enabled = true, Y && (Y.enabled = false));
    y.__splitMode = V, window.__hekatanSplitMode = V, window.__hekatanSplitCamera = V ? ae : null, Q();
  }
  if (e) {
    v.add(Ma(D, B, oe), wa(e, D, B), Sa(D, B, oe), Pa(e, D, B, oe), _a(e, D, B, oe), ka(e, D, B, oe), Fa(e, D, B, oe), Ea(e, D, B, oe), La(e, D, B), Ba(e, D, B, oe), Ia(e, D, B, oe)), window.__hekatanDiagrama2D || (li(e, D), $.domElement.addEventListener("dblclick", () => {
      var _a2;
      const me = (_a2 = D.frameResults) == null ? void 0 : _a2.rawVal;
      !me || me === "none" || !(window.__hekatanModelSelection ?? []).some((Ve) => Ve.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const V = ti({ scene: v, rendererElm: $.domElement, getActiveCamera: () => P, derivedNodes: B, derivedDisplayScale: oe, mesh: e, settings: D, render: Q });
    v.add(V);
    const H = mi(e, D), j = Ya(e, D, B, H), J = _s(H);
    v.add(j), y.appendChild(J);
    const ge = Ga(e, D, B);
    v.add(ge);
    const he = ge.__colorMapValues, ke = _s(he);
    ke.id = "frame-legend", y.appendChild(ke), te.derive(() => {
      var _a2;
      const me = D.shellResults.val != "none", De = (((_a2 = D.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ve = me || De, tt = D.frameResults.val.startsWith("contour:"), Oe = H.val.some((Ye) => Number.isFinite(Ye));
      J.hidden = !Ve || !Oe, j.visible = Ve, ke.hidden = !tt;
    });
  }
  if (f) {
    const V = new zs(16777215, 0.5);
    v.add(V);
    const H = new ao(16777215, 0.5);
    H.position.set(30, 25, -10), H.shadow.mapSize.width = 1024, H.shadow.mapSize.height = 1024, v.add(H);
    const j = 10;
    H.shadow.camera.left = -j, H.shadow.camera.right = j, H.shadow.camera.top = j, H.shadow.camera.bottom = -j, H.shadow.camera.far = 1e3;
    const J = new ao(16777215, 0.5);
    J.color.setHSL(11, 43, 96), J.position.set(-10, 0, 30), v.add(J), te.derive(() => {
      (f == null ? void 0 : f.val.length) && (v.remove(...f.oldVal), v.add(...f.rawVal), Q());
    }), te.derive(() => {
      f.rawVal.forEach((ge) => ge.visible = D.solids.val), Q();
    });
  }
  if (p) {
    const V = [], H = (J) => {
      var _a2;
      return ((_a2 = J == null ? void 0 : J.userData) == null ? void 0 : _a2.isCota) ? D.showCotas.val : D.custom3D.val;
    }, j = () => {
      for (const J of V) J.visible = H(J);
      Q();
    };
    te.derive(() => {
      const J = p.val;
      V.length && (v.remove(...V), V.length = 0), J.length && (v.add(...J), V.push(...J), j()), Q();
    }), te.derive(() => {
      D.custom3D.val, j();
    }), te.derive(() => {
      D.showCotas.val, j();
    });
  }
  c && Na({ drawingObj: c, gridObj: N, scene: v, getActiveCamera: () => P, controls: _, gridSize: X, derivedDisplayScale: oe, rendererElm: $.domElement, viewerRender: Q }), Ps((V, H) => {
    var _a2;
    $.setClearColor(H.background, 1), v.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (j) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = j.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = j.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = Eo(D.gridSize.rawVal, { planes: ie() }), v.add(N), y.style.setProperty("--awatif-legend-color", H.legendMarker), Q();
  });
  const Pe = { scene: v, perspCamera: M, orthoCamera: x, get camera() {
    return P;
  }, controls: _, renderer: $, rendererElm: $.domElement, render: Q, setActiveCamera: xe, setSplitMode: ve, get splitMode() {
    return fe;
  }, get splitCamera() {
    return ae;
  }, settings: D };
  y.__ctx = Pe;
  const we = document.createElement("div");
  we.id = "hk-nav-camara", we.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Re = (V, H, j) => {
    const J = document.createElement("button");
    return J.textContent = V, J.title = H, J.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), J.onmouseenter = () => {
      J.style.background = "rgba(70,70,70,0.9)";
    }, J.onmouseleave = () => {
      J.style.background = "rgba(40,40,40,0.85)";
    }, J.onclick = (ge) => {
      ge.preventDefault(), j();
    }, J;
  }, Ue = (V, H) => {
    const j = _.target, J = new F().subVectors(P.position, j), ge = J.length(), he = new F(), ke = new F();
    he.crossVectors(P.up, J).normalize(), ke.copy(P.up).normalize();
    const me = ge * 0.05;
    j.addScaledVector(he, -V * me), j.addScaledVector(ke, H * me), P.position.addScaledVector(he, -V * me), P.position.addScaledVector(ke, H * me), _.update(), Q();
  }, et = (V) => {
    const H = new F().subVectors(P.position, _.target);
    H.multiplyScalar(V), P.position.copy(_.target).add(H), _.update(), Q();
  }, gt = () => {
    const V = document.createElement("div");
    return V.style.cssText = "width:32px;height:32px;", V;
  };
  return we.append(gt()), we.append(Re("\u2191", "Pan arriba", () => Ue(0, 1))), we.append(Re("\u2295", "Zoom in", () => et(0.85))), we.append(Re("\u2190", "Pan izquierda", () => Ue(-1, 0))), we.append(Re("\u2302", "Reset vista", () => {
    _.reset(), Q();
  })), we.append(Re("\u2192", "Pan derecha", () => Ue(1, 0))), we.append(Re("\u2296", "Zoom out", () => et(1.18))), we.append(Re("\u2193", "Pan abajo", () => Ue(0, -1))), we.append(gt()), getComputedStyle(y).position === "static" && (y.style.position = "relative"), y.appendChild(we), y;
}
function ci(e, l) {
  return te.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const c = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], p = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!p || c.length === 0) return c;
    const f = l.deformScale.val, y = l.deformScale.val * l.deformScaleZ.val, v = Number.isFinite(f) ? f : 1, M = Number.isFinite(y) ? y : 1;
    return c.map((x, P) => {
      var _a3;
      const $ = ((_a3 = p.get(P)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], _ = Number.isFinite($[0]) ? $[0] : 0, O = Number.isFinite($[1]) ? $[1] : 0, ye = Number.isFinite($[2]) ? $[2] : 0;
      return [x[0] + _ * v, x[1] + O * v, x[2] + ye * M];
    });
  });
}
const Ln = te.state(null), Io = te.state(""), di = te.state("kN"), pi = te.state("mm"), ui = te.state("kN/m\xB2"), fi = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Ss = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, hi = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function mi(e, l) {
  const c = te.state([]);
  let p;
  return ((f) => {
    f.bendingXX = "bendingXX", f.bendingYY = "bendingYY", f.bendingXY = "bendingXY", f.membraneXX = "membraneXX", f.membraneYY = "membraneYY", f.membraneXY = "membraneXY", f.tranverseShearX = "tranverseShearX", f.tranverseShearY = "tranverseShearY", f.membranePrincipalMax = "membranePrincipalMax", f.membranePrincipalMin = "membranePrincipalMin", f.bendingPrincipalMax = "bendingPrincipalMax", f.bendingPrincipalMin = "bendingPrincipalMin", f.transverseShearMax = "transverseShearMax", f.vonMises = "vonMises", f.pressure = "pressure", f.displacementX = "displacementX", f.displacementY = "displacementY", f.displacementZ = "displacementZ";
  })(p || (p = {})), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const f = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), be = (H, j) => {
      H == null ? void 0 : H.forEach((J, ge) => {
        const he = e.elements.val[ge];
        if (he) for (let ke = 0; ke < he.length; ke++) j.set(he[ke], [J[ke] ?? J[0]]);
      });
    };
    be((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, f), be((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, y), be((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, v), be((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, M), be((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, x), be((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, P), be((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, $), be((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, _), be((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, O), be((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, ye);
    const se = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), le = (H, j, J, ge, he) => {
      H.forEach((ke, me) => {
        var _a3, _b2;
        const De = ke[0] ?? 0, Ve = ((_a3 = j.get(me)) == null ? void 0 : _a3[0]) ?? 0, tt = ((_b2 = J.get(me)) == null ? void 0 : _b2[0]) ?? 0, Oe = (De + Ve) / 2, Ye = Math.hypot((De - Ve) / 2, tt);
        ge.set(me, [Oe + Ye]), he.set(me, [Oe - Ye]);
      });
    };
    le(M, x, P, se, D), le(f, y, v, oe, B), $.forEach((H, j) => {
      var _a3;
      ie.set(j, [Math.hypot(H[0] ?? 0, ((_a3 = _.get(j)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const N = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, I = (_w = l.solidResults) == null ? void 0 : _w.val, X = I && I !== "none" ? I : l.shellResults.val, T = N == null ? void 0 : N[X], q = { bendingXX: [f, 0], bendingYY: [y, 0], bendingXY: [v, 0], membraneXX: [M, 0], membraneYY: [x, 0], membraneXY: [P, 0], tranverseShearX: [$, 0], tranverseShearY: [_, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [D, 0], bendingPrincipalMax: [oe, 0], bendingPrincipalMin: [B, 0], transverseShearMax: [ie, 0], vonMises: [O, 0], pressure: [ye, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, R = l.shellResults.val, L = di.val, ne = pi.val, de = R === "displacementX" || R === "displacementY" || R === "displacementZ", fe = R === "bendingXX" || R === "bendingYY" || R === "bendingXY" || R === "bendingPrincipalMax" || R === "bendingPrincipalMin", ae = R === "membraneXX" || R === "membraneYY" || R === "membraneXY" || R === "membranePrincipalMax" || R === "membranePrincipalMin", Y = R === "vonMises" || R === "pressure", pe = R === "tranverseShearX" || R === "tranverseShearY" || R === "transverseShearMax", Q = (_D = l.solidResults) == null ? void 0 : _D.val, xe = Q === "vonMises" || Q === "sigmaXX" || Q === "sigmaYY" || Q === "sigmaZZ" || Q === "tauXY" || Q === "tauYZ" || Q === "tauXZ", ve = Q === "ux" || Q === "uy" || Q === "uz", Pe = ui.val, we = xe ? hi[Pe] : ve || de ? Ss[ne] : fe || ae || Y || pe ? 1 / fi[L] : 1, Re = xe ? Pe : ve || de ? ne : fe ? `${L}\xB7m/m` : ae ? `${L}/m\xB2` : Y ? `${L}/m\xB2` : pe ? `${L}/m` : "";
    Io.val = Re, Ln.val = Array.isArray(T) && T.length === 2 ? [T[0] * we, T[1] * we] : null;
    const Ue = Vs.val, gt = Q && Q !== "none" ? [O, 0] : q[R], V = [];
    if (e.nodes.val.forEach((H, j) => {
      const J = gt;
      if (!J || !J[0] || typeof J[0].has != "function") return;
      if (!J[0].has(j)) {
        V.push(Number.NaN);
        return;
      }
      const ge = J[0].get(j), he = ge ? ge[J[1]] ?? 0 : 0;
      V.push(he * we);
    }), !Ln.val && Ue !== "auto") {
      const H = e.nodes.val, j = /* @__PURE__ */ new Set(), J = (he, ke) => {
        var _a3;
        const me = (_a3 = H[he[0]]) == null ? void 0 : _a3[ke];
        return he.every((De) => {
          var _a4;
          return Math.abs((((_a4 = H[De]) == null ? void 0 : _a4[ke]) ?? NaN) - me) < 1e-6;
        });
      };
      for (const he of e.elements.val) {
        if (he.length !== 4) continue;
        const ke = J(he, 2), me = !ke && J(he, 0), De = !ke && J(he, 1);
        if (Ue === "losas" ? ke : Ue === "muros" ? me || De : Ue === "murosX" ? me : Ue === "murosY" ? De : false) for (const Oe of he) j.add(Oe);
      }
      const ge = [];
      for (const he of j) {
        const ke = V[he];
        Number.isFinite(ke) && ge.push(ke);
      }
      ge.length && (Ln.val = Ro(ge));
    }
    c.val = V;
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
