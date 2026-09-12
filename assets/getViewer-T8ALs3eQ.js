import { N as Ot, a6 as On, q as ea, v as te, a7 as ta, D as Ft, M as it, B as Fe, F as St, a8 as na, x as xt, a9 as oa, aa as sa, h as us, ab as fs, r as un, ac as to, ad as no, a4 as Ps, _ as rt, b as yt, L as jt, w as Cs, c as aa, ae as ia, f as ut, V as E, $ as pn, af as Po, H as ao, d as zt, a as Co, Y as zs, Z as so, G as la, z as Tn, A as ra, ag as oo, t as ca, o as da, I as ln, a2 as An, E as hs, S as bn, m as zo, ah as En, g as ms, i as ws, j as ys, C as xs, K as pa, U as ua, W as fa, X as ha, T as Qn, P as Fo, O as ma } from "./theme-DQ--CgsI.js";
import { T as At, O as gs } from "./Text-ERv22veQ.js";
import { P as Fs } from "./tweakpane-BXg6ZhiP.js";
import { e as wa } from "./styles-0iLl92Fx.js";
class As {
  constructor(l, d = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(l, d);
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
  setColorMap(l, d = 32) {
    this.map = Ao[l] || Ao.rainbow, this.n = d;
    const u = 1 / this.n, h = new Ot(), y = new Ot();
    this.lut.length = 0, this.lut.push(new Ot(this.map[0][1]));
    for (let v = 1; v < d; v++) {
      const b = v * u;
      for (let g = 0; g < this.map.length - 1; g++) if (b > this.map[g][0] && b <= this.map[g + 1][0]) {
        const z = this.map[g][0], V = this.map[g + 1][0];
        h.setHex(this.map[g][1], On), y.setHex(this.map[g + 1][1], On);
        const M = new Ot().lerpColors(h, y, (b - z) / (V - z));
        this.lut.push(M);
      }
    }
    return this.lut.push(new Ot(this.map[this.map.length - 1][1])), this;
  }
  copy(l) {
    return this.lut = l.lut, this.map = l.map, this.n = l.n, this.minV = l.minV, this.maxV = l.maxV, this;
  }
  getColor(l) {
    l = ea.clamp(l, this.minV, this.maxV), l = (l - this.minV) / (this.maxV - this.minV);
    const d = Math.round(l * this.n);
    return this.lut[d];
  }
  addColorMap(l, d) {
    return Ao[l] = d, this;
  }
  createCanvas() {
    const l = document.createElement("canvas");
    return l.width = 1, l.height = this.n, this.updateCanvas(l), l;
  }
  updateCanvas(l) {
    const d = l.getContext("2d", { alpha: false }), u = d.getImageData(0, 0, 1, this.n), h = u.data;
    let y = 0;
    const v = 1 / this.n, b = new Ot(), g = new Ot(), z = new Ot();
    for (let V = 1; V >= 0; V -= v) for (let M = this.map.length - 1; M >= 0; M--) if (V < this.map[M][0] && V >= this.map[M - 1][0]) {
      const H = this.map[M - 1][0], xe = this.map[M][0];
      b.setHex(this.map[M - 1][1], On), g.setHex(this.map[M][1], On), z.lerpColors(b, g, (V - H) / (xe - H)), h[y * 4] = Math.round(z.r * 255), h[y * 4 + 1] = Math.round(z.g * 255), h[y * 4 + 2] = Math.round(z.b * 255), h[y * 4 + 3] = 255, y += 1;
    }
    return d.putImageData(u, 0, 0), l;
  }
}
const Ao = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, Es = [[0, 255, 0, 255], [0.077, 255, 0, 180], [0.154, 255, 0, 0], [0.231, 255, 80, 0], [0.308, 255, 140, 0], [0.385, 255, 190, 0], [0.462, 255, 255, 0], [0.538, 180, 255, 0], [0.615, 0, 255, 0], [0.692, 0, 255, 180], [0.769, 0, 255, 255], [0.846, 0, 180, 255], [0.923, 0, 0, 255], [1, 0, 0, 180]], ya = { safe: [[0, 224, 13, 107], [0.13, 221, 20, 50], [0.27, 252, 99, 39], [0.4, 254, 161, 47], [0.52, 238, 234, 25], [0.64, 5, 193, 69], [0.78, 7, 178, 244], [0.9, 4, 132, 213], [1, 90, 175, 230]], csi: Es, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, io = te.state("safe"), Vs = te.state("auto");
function Ts(e) {
  e = Math.max(0, Math.min(1, e));
  const l = ya[io.val] ?? Es;
  for (let u = 0; u < l.length - 1; u++) {
    const [h, y, v, b] = l[u], [g, z, V, M] = l[u + 1];
    if (e <= g) {
      const H = (e - h) / (g - h);
      return [y + (z - y) * H, v + (V - v) * H, b + (M - b) * H];
    }
  }
  const d = l[l.length - 1];
  return [d[1], d[2], d[3]];
}
function vs() {
  const l = new Uint8Array(1024);
  for (let u = 0; u < 256; u++) {
    const h = u / 255, [y, v, b] = Ts(h);
    l[u * 4 + 0] = y, l[u * 4 + 1] = v, l[u * 4 + 2] = b, l[u * 4 + 3] = 255;
  }
  const d = new oa(l, 256, 1, sa);
  return d.minFilter = us, d.magFilter = us, d.wrapS = fs, d.wrapT = fs, d.needsUpdate = true, d;
}
function xa() {
  const l = [];
  for (let d = 0; d <= 12; d++) {
    const u = 1 - d / 12, [h, y, v] = Ts(u);
    l.push(`rgb(${h | 0},${y | 0},${v | 0}) ${(d / 12 * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${l.join(",")})`;
}
function Ro(e) {
  if (!e.length) return [0, 1];
  const l = [...e].sort((y, v) => y - v), d = (y) => l[Math.min(l.length - 1, Math.max(0, Math.round(y * (l.length - 1))))];
  let u = l.length >= 20 ? d(0.01) : l[0], h = l.length >= 20 ? d(0.99) : l[l.length - 1];
  return u >= 0 && h > 0 && (u = 0), h <= 0 && u < 0 && (h = 0), [u, h];
}
function ga(e, l, d) {
  new As();
  const u = vs(), h = new ta({ uniforms: { cmap: { value: u }, ambient: { value: 0.95 } }, vertexShader: `
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
    const v = h.uniforms.cmap.value;
    h.uniforms.cmap.value = vs(), (_a2 = v == null ? void 0 : v.dispose) == null ? void 0 : _a2.call(v);
  });
  const y = new it(new Fe(), h);
  return y.renderOrder = -1, y.frustumCulled = false, y.userData.isShellArea = true, y.name = "__hekatan_shell_colormap", te.derive(() => {
    y.geometry.setAttribute("position", new St(e.val.flat(), 3));
    const v = [], b = [], g = [];
    l.val.forEach((B, ie) => {
      B.length === 3 ? (v.push(B[0], B[1], B[2]), b.push(ie), g.push(0)) : B.length === 4 && (v.push(B[0], B[1], B[2]), v.push(B[0], B[2], B[3]), b.push(ie, ie), g.push(0, 1));
    }), y.geometry.setIndex(new na(v, 1)), y.userData.faceToElem = b, y.userData.faceLocal = g;
    const z = d.val.filter((B) => Number.isFinite(B));
    let V, M;
    const H = Ln.val;
    if (H ? (M = H[0], V = H[1]) : [M, V] = Ro(z), V === M) {
      const B = Math.max(Math.abs(V) * 1e-6, 1e-9);
      V += B, M -= B;
    }
    const xe = H && H[0] > H[1], be = Math.min(M, V), se = Math.max(M, V), D = se - be, oe = new Float32Array(d.val.length);
    for (let B = 0; B < d.val.length; B++) {
      const ie = d.val[B];
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
function va(e, l, d) {
  const u = document.createElement("div"), h = new Fs({ title: "Settings", expanded: true, container: u });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(h), u.setAttribute("id", "settings");
  const y = "hk_settingsPos";
  let v = null;
  try {
    const M = localStorage.getItem(y);
    M && (v = JSON.parse(M));
  } catch {
  }
  u.style.cssText = ["position:fixed", v ? `left:${v.left}px` : "left:8px", v ? `top:${v.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const b = () => {
    const M = u.querySelector(".tp-rotv_b");
    if (!M) {
      setTimeout(b, 200);
      return;
    }
    M.style.cursor = "move", M.style.userSelect = "none";
    let H = false, xe = 0, be = 0, se = 0, D = 0;
    M.addEventListener("mousedown", (oe) => {
      H = true, xe = oe.clientX, be = oe.clientY;
      const B = u.getBoundingClientRect();
      se = B.left, D = B.top, u.style.left = `${se}px`, u.style.top = `${D}px`;
    }), window.addEventListener("mousemove", (oe) => {
      if (!H) return;
      const B = oe.clientX - xe, ie = oe.clientY - be, le = Math.max(0, Math.min(window.innerWidth - 40, se + B)), N = Math.max(0, Math.min(window.innerHeight - 40, D + ie));
      u.style.left = `${le}px`, u.style.top = `${N}px`;
    }), window.addEventListener("mouseup", () => {
      if (H) {
        H = false;
        try {
          localStorage.setItem(y, JSON.stringify({ left: parseFloat(u.style.left), top: parseFloat(u.style.top) }));
        } catch {
        }
      }
    });
  };
  if (b(), l == null ? void 0 : l.nodes) {
    h.addBinding(e.displayScale, "val", { label: "Display scale", min: -10, max: 10, step: 0.5 });
    const M = h.addFolder({ title: "\u{1F4D0} Grid", expanded: false });
    M.addBinding(e.gridVisible, "val", { label: "Mostrar la rejilla" }), M.addBinding(e.gridXY, "val", { label: "Plano XY (planta)" }), M.addBinding(e.gridXZ, "val", { label: "Plano XZ (frontal)" }), M.addBinding(e.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const H = M.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    H.addBinding(e.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), H.addBinding(e.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(e.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), H.addBinding(e.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), H.addBinding(e.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const xe = h.addFolder({ title: "\u{1F441} Ver", expanded: false });
    xe.addBinding(e.nodes, "val", { label: "Nodes" }), xe.addBinding(e.elements, "val", { label: "Elements" }), xe.addBinding(e.edges, "val", { label: "  Edges (delim.)" }), xe.addBinding(e.faces, "val", { label: "  Caras (fill)" }), xe.addBinding(e.elemFrames, "val", { label: "  Frames (todos)" }), xe.addBinding(e.elemColumns, "val", { label: "    Columnas" }), xe.addBinding(e.elemBeams, "val", { label: "    Vigas" }), xe.addBinding(e.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), xe.addBinding(e.elemLosas, "val", { label: "  Losas (shells z>0)" }), xe.addBinding(e.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), xe.addBinding(e.nodesIndexes, "val", { label: "Nodes indexes" }), xe.addBinding(e.elementsIndexes, "val", { label: "Elements indexes" }), xe.addBinding(e.orientations, "val", { label: "Orientations" }), xe.addBinding(e.sections, "val", { label: "Sections" }), xe.addBinding(e.extruded, "val", { label: "Extruido (3D)" }), xe.addBinding(e.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), xe.addBinding(e.secColumns, "val", { label: "  Sec. Columnas" }), xe.addBinding(e.secBeams, "val", { label: "  Sec. Vigas" }), xe.addBinding(e.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((l == null ? void 0 : l.nodeInputs) || (l == null ? void 0 : l.elementInputs)) {
    const M = h.addFolder({ title: "\u{1F4CC} Analysis Inputs", expanded: false });
    M.addBinding(e.supports, "val", { label: "Supports" }), M.addBinding(e.loads, "val", { label: "Loads" }), M.addBinding(e.custom3D, "val", { label: "Resortes (Winkler)" }), M.addBinding(e.showCotas, "val", { label: "Cotas" });
  }
  if ((l == null ? void 0 : l.deformOutputs) || (l == null ? void 0 : l.analyzeOutputs)) {
    const M = h.addFolder({ title: "\u{1F52C} Analyze", expanded: true });
    window.__hekatanOutputsFolder = M, M.addBinding(e.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Node results" }), M.addBinding(e.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Frame results" }), M.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), M.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), M.addBinding(e.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Shell results" }), M.addBinding(io, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", "ETABS / CSI (magenta\u2192azul)": "csi", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), M.addBinding(Vs, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), M.addBinding(e.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Solid results" }), M.addBinding(e.deformedShape, "val", { label: "Deformed shape" }), M.addBinding(e.deformScale, "val", { label: "  Scale XY", min: 0.1, max: 5e3, step: 0.1 }), M.addBinding(e.deformScaleZ, "val", { label: "  Scale Z", min: 0.01, max: 10, step: 0.01 });
  }
  d && h.addBinding(e.solids, "val", { label: "Solids" });
  const g = h.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), z = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), V = () => {
    const M = window.__hekatanClipApply;
    typeof M == "function" && M();
  };
  return g.addBinding(z, "enableX", { label: "Cortar X" }).on("change", V), g.addBinding(z, "posX", { min: -50, max: 50, step: 0.1, label: "  pos X (m)" }).on("change", V), g.addBinding(z, "invertX", { label: "  invertir X" }).on("change", V), g.addBinding(z, "enableY", { label: "Cortar Y" }).on("change", V), g.addBinding(z, "posY", { min: -50, max: 50, step: 0.1, label: "  pos Y (m)" }).on("change", V), g.addBinding(z, "invertY", { label: "  invertir Y" }).on("change", V), g.addBinding(z, "enableZ", { label: "Cortar Z" }).on("change", V), g.addBinding(z, "posZ", { min: -50, max: 50, step: 0.1, label: "  pos Z (m)" }).on("change", V), g.addBinding(z, "invertZ", { label: "  invertir Z" }).on("change", V), u;
}
function ba(e) {
  return { gridSize: te.state((e == null ? void 0 : e.gridSize) ?? 30), gridVisible: te.state((e == null ? void 0 : e.gridVisible) ?? true), gridOpacity: te.state((e == null ? void 0 : e.gridOpacity) ?? 1), gridStep: te.state((e == null ? void 0 : e.gridStep) ?? 1), gridMajor: te.state((e == null ? void 0 : e.gridMajor) ?? 5), cursorSnap: te.state((e == null ? void 0 : e.cursorSnap) ?? 0.5), gridXY: te.state((e == null ? void 0 : e.gridXY) ?? true), gridXZ: te.state((e == null ? void 0 : e.gridXZ) ?? false), gridYZ: te.state((e == null ? void 0 : e.gridYZ) ?? false), displayScale: te.state((e == null ? void 0 : e.displayScale) ?? 1), nodes: te.state((e == null ? void 0 : e.nodes) ?? true), elements: te.state((e == null ? void 0 : e.elements) ?? true), edges: te.state((e == null ? void 0 : e.edges) ?? true), faces: te.state((e == null ? void 0 : e.faces) ?? true), elemColumns: te.state((e == null ? void 0 : e.elemColumns) ?? true), elemBeams: te.state((e == null ? void 0 : e.elemBeams) ?? true), elemFrames: te.state((e == null ? void 0 : e.elemFrames) ?? true), elemZapatas: te.state((e == null ? void 0 : e.elemZapatas) ?? true), elemLosas: te.state((e == null ? void 0 : e.elemLosas) ?? true), colorByType: te.state((e == null ? void 0 : e.colorByType) ?? false), nodesIndexes: te.state((e == null ? void 0 : e.nodesIndexes) ?? false), elementsIndexes: te.state((e == null ? void 0 : e.elementsIndexes) ?? false), orientations: te.state((e == null ? void 0 : e.orientations) ?? false), sections: te.state((e == null ? void 0 : e.sections) ?? true), extruded: te.state((e == null ? void 0 : e.extruded) ?? false), sectionLabels: te.state((e == null ? void 0 : e.sectionLabels) ?? true), secColumns: te.state((e == null ? void 0 : e.secColumns) ?? true), secBeams: te.state((e == null ? void 0 : e.secBeams) ?? true), secFloor: te.state((e == null ? void 0 : e.secFloor) ?? -1), supports: te.state((e == null ? void 0 : e.supports) ?? true), loads: te.state((e == null ? void 0 : e.loads) ?? false), deformedShape: te.state((e == null ? void 0 : e.deformedShape) ?? false), nodeResults: te.state((e == null ? void 0 : e.nodeResults) ?? "none"), frameResults: te.state((e == null ? void 0 : e.frameResults) ?? "none"), shellResults: te.state((e == null ? void 0 : e.shellResults) ?? "none"), solidResults: te.state((e == null ? void 0 : e.solidResults) ?? "none"), flipAxes: te.state((e == null ? void 0 : e.flipAxes) ?? false), solids: te.state((e == null ? void 0 : e.solids) ?? true), custom3D: te.state((e == null ? void 0 : e.custom3D) ?? true), showCotas: te.state((e == null ? void 0 : e.showCotas) ?? true), deformScale: te.state((e == null ? void 0 : e.deformScale) ?? 1), deformScaleZ: te.state((e == null ? void 0 : e.deformScaleZ) ?? 1) };
}
function Ma(e, l, d) {
  const u = un(), h = new to(new Fe(), new no({ color: u.nodePoint }));
  return Ps((y, v) => {
    h.material.color.setHex(v.nodePoint);
  }), h.frustumCulled = false, te.derive(() => {
    e.nodes.val && h.geometry.setAttribute("position", new St(l.val.flat(), 3));
  }), te.derive(() => {
    if (d.val, l.val, !e.nodes.rawVal) return;
    const y = l.rawVal ?? [];
    let v = e.gridSize.val * 0.5;
    if (y.length >= 2) {
      const g = [1 / 0, 1 / 0, 1 / 0], z = [-1 / 0, -1 / 0, -1 / 0];
      for (const V of y) for (let M = 0; M < 3; M++) g[M] = Math.min(g[M], V[M]), z[M] = Math.max(z[M], V[M]);
      v = Math.max(z[0] - g[0], z[1] - g[1], z[2] - g[2], 0.1);
    }
    const b = 0.03 * v;
    h.material.size = b * d.rawVal;
  }), te.derive(() => {
    h.visible = e.nodes.val;
  }), h;
}
function Eo(e, l) {
  const d = un(), u = new rt();
  u.name = "hekatan-grid";
  const h = (l == null ? void 0 : l.planes) ?? ["xy"];
  let y = (l == null ? void 0 : l.majorStep) ?? 1, v = (l == null ? void 0 : l.minorStep) ?? 0.1;
  for (y <= 0 && (y = 1), v <= 0 && (v = 0.1); e / v > 500; ) v *= 2;
  for (; e / y > 100; ) y *= 2;
  const b = e / 2;
  y = Math.max(v, Math.round(y / v) * v);
  const z = new Ot(d.grid).multiplyScalar(1.3), V = new Ot(d.grid).multiplyScalar(0.8), M = (se, D, oe, B) => {
    const ie = [], le = se === "xy" ? (T, K) => [T, K, 0] : se === "xz" ? (T, K) => [T, 0, K] : (T, K) => [0, T, K], N = Math.floor(b / D);
    for (let T = -N; T <= N; T++) {
      const K = T * D, R = le(K, -b), $ = le(K, b);
      ie.push(...R, ...$);
    }
    for (let T = -N; T <= N; T++) {
      const K = T * D, R = le(-b, K), $ = le(b, K);
      ie.push(...R, ...$);
    }
    const I = new Fe();
    I.setAttribute("position", new St(ie, 3));
    const G = new yt({ color: oe, transparent: true, opacity: B, depthWrite: false }), Y = new jt(I, G);
    return Y.name = `grid-${se}-${D === v ? "minor" : "major"}`, Y;
  }, H = (se, D, oe) => {
    const B = se === "xy" ? (Y, T) => [Y, T, 0] : se === "xz" ? (Y, T) => [Y, 0, T] : (Y, T) => [0, Y, T], ie = [[-b, -b], [b, -b], [b, b], [-b, b]], le = [];
    for (const [Y, T] of ie) le.push(...B(Y, T));
    const N = new Fe();
    N.setAttribute("position", new St(le, 3));
    const I = new yt({ color: D, transparent: true, opacity: oe, depthWrite: false }), G = new Cs(N, I);
    return G.name = `grid-${se}-border`, G.renderOrder = 1, G;
  }, xe = (se, D, oe) => {
    const B = se === "xy" ? (I, G) => [I, G, 0] : se === "xz" ? (I, G) => [I, 0, G] : (I, G) => [0, I, G], ie = D === "u" ? [...B(-b, 0), ...B(b, 0)] : [...B(0, -b), ...B(0, b)], le = new Fe();
    le.setAttribute("position", new St(ie, 3));
    const N = new jt(le, new yt({ color: oe, transparent: true, opacity: 0.45, depthWrite: false }));
    return N.name = `grid-${se}-eje-${D}`, N.renderOrder = 1, N;
  }, be = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const se of h) {
    u.add(M(se, v, V, 0.12)), u.add(M(se, y, z, 0.4));
    const [D, oe] = be[se];
    u.add(xe(se, "u", D)), u.add(xe(se, "v", oe)), u.add(H(se, z, 0.55));
  }
  return u.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: y, minorStep: v, gridSize: e, planes: [...h] }, u;
}
function _a(e, l, d, u) {
  const h = new rt(), y = new aa(0.5, 0.5, 0.5), v = new ia(0.45, 0.7, 4);
  v.rotateX(Math.PI / 2), v.translate(0, 0, -0.35);
  const b = new ut({ color: 10166822 }), g = new ut({ color: 2792847 }), z = new ut({ color: 3835647 }), V = () => {
    const xe = d.rawVal ?? [];
    if (xe.length < 2) return l.gridSize.val * 0.5;
    let be = [1 / 0, 1 / 0, 1 / 0], se = [-1 / 0, -1 / 0, -1 / 0];
    for (const D of xe) for (let oe = 0; oe < 3; oe++) D[oe] < be[oe] && (be[oe] = D[oe]), D[oe] > se[oe] && (se[oe] = D[oe]);
    return Math.max(se[0] - be[0], se[1] - be[1], se[2] - be[2], 0.1);
  }, M = () => 0.08 * V(), H = () => u.rawVal;
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, !l.supports.val) return;
    h.clear();
    const xe = M();
    (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((be, se) => {
      const D = d.val[se];
      if (!D) return;
      const oe = be ?? [], B = (oe[0] ? 1 : 0) + (oe[1] ? 1 : 0) + (oe[2] ? 1 : 0), ie = (oe[3] ? 1 : 0) + (oe[4] ? 1 : 0) + (oe[5] ? 1 : 0);
      let le;
      B >= 3 && ie >= 3 ? le = new it(y, b) : B >= 3 && ie === 0 ? le = new it(v, g) : le = new it(v, z), le.position.set(D[0], D[1], D[2]);
      const N = xe * H();
      le.scale.set(N, N, N), h.add(le);
    });
  }), te.derive(() => {
    if (u.val, !l.supports.rawVal) return;
    const be = M() * H();
    h.children.forEach((se) => se.scale.set(be, be, be));
  }), te.derive(() => {
    h.visible = l.supports.val;
  }), h;
}
function ka(e, l, d, u) {
  const h = new rt();
  h.name = "loadsGroup";
  function y(b) {
    if (b.length < 2) return 0.12 * l.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], z = [-1 / 0, -1 / 0, -1 / 0];
    for (const M of b) for (let H = 0; H < 3; H++) g[H] = Math.min(g[H], M[H]), z[H] = Math.max(z[H], M[H]);
    return 0.08 * Math.max(z[0] - g[0], z[1] - g[1], z[2] - g[2], 0.1);
  }
  te.derive(() => {
    var _a2, _b, _c;
    if (l.deformedShape.val, !l.loads.val) return;
    h.children.forEach((se) => {
      var _a3;
      return (_a3 = se.dispose) == null ? void 0 : _a3.call(se);
    }), h.clear();
    const b = d.val, g = y(b), z = 240, V = [];
    (_c = (_b = (_a2 = e.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c.forEach((se, D) => {
      b[D] && se.slice(0, 3).some((oe) => Math.abs(oe) > 1e-15) && V.push(D);
    });
    let M = V;
    if (V.length > z) {
      const se = V.map(($) => b[$][0]), D = V.map(($) => b[$][1]), oe = Math.min(...se), B = Math.max(...se), ie = Math.min(...D), le = Math.max(...D), N = V.map(($) => b[$][2]), I = Math.max(1e-6, (Math.max(...N) - Math.min(...N)) / 40), G = ($) => Math.round($ / I), Y = new Set(N.map(G)), T = Math.max(4, Math.floor(z / Math.max(1, Y.size))), K = Math.max(2, Math.round(Math.sqrt(T))), R = /* @__PURE__ */ new Map();
      for (const $ of V) {
        const ne = B - oe < 1e-9 ? 0 : (b[$][0] - oe) / (B - oe), pe = le - ie < 1e-9 ? 0 : (b[$][1] - ie) / (le - ie), he = Math.min(K - 1, Math.floor(ne * K)), ae = Math.min(K - 1, Math.floor(pe * K)), Z = `${he},${ae},${G(b[$][2])}`, fe = Math.hypot(ne * K - (he + 0.5), pe * K - (ae + 0.5)), J = R.get(Z);
        (!J || fe < J.d) && R.set(Z, { i: $, d: fe });
      }
      M = [...R.values()].map(($) => $.i);
    }
    let H = 0;
    for (const se of M) {
      const D = e.nodeInputs.val.loads.get(se);
      for (let oe = 0; oe < 3; oe++) H = Math.max(H, Math.abs(D[oe]));
    }
    const xe = M.length <= 60, be = (se) => {
      const D = Math.abs(se);
      return D >= 100 ? se.toFixed(0) : D >= 10 ? se.toFixed(1) : se.toFixed(2);
    };
    for (const se of M) {
      const D = e.nodeInputs.val.loads.get(se), oe = b[se];
      if (oe) for (let B = 0; B < 3; B++) {
        const ie = D[B];
        if (!(Math.abs(ie) > 1e-9 * (H || 1))) continue;
        const le = new E(B === 0 ? Math.sign(ie) : 0, B === 1 ? Math.sign(ie) : 0, B === 2 ? Math.sign(ie) : 0), N = 0.45 + 0.55 * (H ? Math.abs(ie) / H : 1), I = new pn(le, new E(...oe), 1, B === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (I.userData = { nudo: oe, dir: le, rel: N }, h.add(I), xe) {
          const G = new At(be(ie), B === 2 ? "#f5b642" : "#ff6b5e");
          G.userData = { nudo: oe, dir: le, rel: N, texto: true }, h.add(G);
        }
      }
    }
    v(g * u.rawVal);
  });
  function v(b) {
    h.children.forEach((g) => {
      const z = g.userData;
      if (!(z == null ? void 0 : z.dir)) return;
      const V = b * z.rel, M = new E(...z.nudo).addScaledVector(z.dir, -V * (z.texto ? 1.12 : 1));
      g.position.copy(M), z.texto ? g.updateScale(b * 0.38) : g.scale.set(V, V, V);
    });
  }
  return te.derive(() => {
    u.val, l.loads.rawVal && v(y(d.rawVal) * u.rawVal);
  }), te.derive(() => {
    h.visible = l.loads.val;
  }), h;
}
function Sa(e, l, d) {
  const u = new rt();
  return te.derive(() => {
    if (!e.nodesIndexes.val) return;
    u.children.forEach((y) => y.dispose()), u.clear();
    const h = 0.05 * e.gridSize.val * 0.6;
    l.val.forEach((y, v) => {
      const b = new At(`${v}`);
      b.position.set(...y), b.updateScale(h * d.rawVal), u.add(b);
    });
  }), te.derive(() => {
    if (d.val, !e.nodesIndexes.rawVal) return;
    const h = 0.05 * e.gridSize.val * 0.6;
    u.children.forEach((y) => y.updateScale(h * d.rawVal));
  }), te.derive(() => {
    u.visible = e.nodesIndexes.val;
  }), u;
}
function Pa(e, l, d, u) {
  const h = new rt();
  return te.derive(() => {
    var _a2;
    if (l.deformedShape.val, !l.elementsIndexes.val) return;
    h.children.forEach((v) => v.dispose()), h.clear();
    const y = 0.05 * l.gridSize.val * 0.6;
    (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((v, b) => {
      const g = new At(`${b}`, void 0, "#001219");
      g.position.set(...Ca(v.map((z) => d.rawVal[z]))), g.updateScale(y * u.rawVal), h.add(g);
    });
  }), te.derive(() => {
    if (u.val, !l.elementsIndexes.rawVal) return;
    const y = 0.05 * l.gridSize.val * 0.6;
    h.children.forEach((v) => v.updateScale(y * u.rawVal));
  }), te.derive(() => {
    h.visible = l.elementsIndexes.val;
  }), h;
}
function Ca(e) {
  const l = e.reduce((u, h) => [u[0] + h[0], u[1] + h[1], u[2] + h[2]], [0, 0, 0]), d = e.length;
  return [l[0] / d, l[1] / d, l[2] / d];
}
function bs(e, l) {
  const d = new rt(), u = Math.min(0.05 * e, 0.6), h = un(), y = new At("X", "red", "transparent"), v = new At(l ? "Z" : "Y", "green", "transparent"), b = new At(l ? "Y" : "Z", "blue", "transparent"), g = new pn(new E(1, 0, 0), new E(0, 0, 0), 1, h.axisArrow, 0.2, 0.2), z = new pn(new E(0, 1, 0), new E(0, 0, 0), 1, h.axisArrow, 0.2, 0.2), V = new pn(new E(0, 0, 1), new E(0, 0, 0), 1, h.axisArrow, 0.2, 0.2);
  return y.position.set(1.3 * u, 0, 0), v.position.set(0, 1.3 * u, 0), b.position.set(0, 0, 1.3 * u), y.updateScale(0.4 * u), v.updateScale(0.4 * u), b.updateScale(0.4 * u), g.scale.set(u, u, u), z.scale.set(u, u, u), V.scale.set(u, u, u), d.add(g, z, V, y, v, b), d;
}
function Do(e, l) {
  const d = new E(...e), h = new E(...l).clone().sub(d), y = h.length(), v = h.dot(new E(1, 0, 0)) / y, b = h.dot(new E(0, 1, 0)) / y, g = h.dot(new E(0, 0, 1)) / y, z = Math.sqrt(v ** 2 + b ** 2);
  let V = new Po().fromArray([[v, b, g], [-b / z, v / z, 0], [-v * g / z, -b * g / z, z]].flat());
  return g === 1 && (V = new Po().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), g === -1 && (V = new Po().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new ao().setFromMatrix3(V);
}
function $o(e, l) {
  return e == null ? void 0 : e.map((d, u) => (9 * d + l[u]) / 10);
}
function $n(e) {
  const l = e.reduce((u, h) => [u[0] + h[0], u[1] + h[1], u[2] + h[2]], [0, 0, 0]), d = e.length;
  return [l[0] / d, l[1] / d, l[2] / d];
}
function za(e, l, d) {
  const u = $n([l, d]), h = $n([e, d]), y = $n([e, l]), v = new E(...u).sub(new E(...h)).normalize(), b = new E(...d).sub(new E(...y)).normalize(), g = v.clone().cross(b).normalize(), z = g.clone().cross(v).normalize();
  return new ao().makeBasis(v, z, g);
}
function Fa(e, l, d, u) {
  const h = new rt(), y = new Fe(), v = new yt({ vertexColors: true }), b = [0, 0, 0], g = [1, 0, 0], z = [0, 1, 0], V = [0, 0, 1];
  y.setAttribute("position", new St([...b, ...g, ...b, ...z, ...b, ...V], 3));
  const M = [255, 0, 0], H = [0, 255, 0], xe = [0, 0, 255];
  return y.setAttribute("color", new St([...M, ...M, ...H, ...H, ...xe, ...xe], 3)), te.derive(() => {
    var _a2;
    l.deformedShape.val, l.orientations.val && (h.clear(), (_a2 = e.elements) == null ? void 0 : _a2.val.forEach((be) => {
      const se = new jt(y, v), D = d.rawVal[be[0]], oe = d.rawVal[be[1]];
      if (be.length === 2 && (se.position.set(...$o(D, oe)), se.rotation.setFromRotationMatrix(Do(D, oe))), be.length === 3) {
        const le = d.rawVal[be[2]];
        se.position.set(...$n([D, oe, le])), se.rotation.setFromRotationMatrix(za(D, oe, le));
      }
      const ie = 0.05 * l.gridSize.rawVal * 0.75 * u.rawVal;
      se.scale.set(ie, ie, ie), h.add(se);
    }));
  }), te.derive(() => {
    if (u.val, !l.orientations.rawVal) return;
    const se = 0.05 * l.gridSize.val * 0.75 * u.rawVal;
    h.children.forEach((D) => D.scale.set(se, se, se));
  }), te.derive(() => {
    h.visible = l.orientations.val;
  }), h;
}
function Aa(e) {
  if (e.name) return e.name;
  if (e.type === "rect") {
    const l = (e.b * 100).toFixed(0), d = (e.h * 100).toFixed(0);
    return `${l}x${d}`;
  }
  return e.type === "circ" ? `D${(e.d * 100).toFixed(0)}` : "";
}
function Ea(e, l, d, u) {
  const h = new rt(), y = new rt();
  h.add(y);
  function v(I, G) {
    const Y = I / 2, T = G / 2, K = new Float32Array([0, -Y, -T, 0, Y, -T, 0, Y, T, 0, -Y, -T, 0, Y, T, 0, -Y, T]), R = new Fe();
    R.setAttribute("position", new xt(K, 3));
    const $ = new Float32Array([0, -Y, -T, 0, Y, -T, 0, Y, T, 0, -Y, T, 0, -Y, -T]), ne = new Fe();
    return ne.setAttribute("position", new xt($, 3)), { fill: R, outline: ne };
  }
  function b(I, G = 24) {
    const Y = I / 2, T = new Float32Array(G * 9);
    for (let ne = 0; ne < G; ne++) {
      const pe = ne / G * Math.PI * 2, he = (ne + 1) / G * Math.PI * 2;
      T[ne * 9] = 0, T[ne * 9 + 1] = 0, T[ne * 9 + 2] = 0, T[ne * 9 + 3] = 0, T[ne * 9 + 4] = Y * Math.cos(pe), T[ne * 9 + 5] = Y * Math.sin(pe), T[ne * 9 + 6] = 0, T[ne * 9 + 7] = Y * Math.cos(he), T[ne * 9 + 8] = Y * Math.sin(he);
    }
    const K = new Fe();
    K.setAttribute("position", new xt(T, 3));
    const R = new Float32Array((G + 1) * 3);
    for (let ne = 0; ne <= G; ne++) {
      const pe = ne / G * Math.PI * 2;
      R[ne * 3] = 0, R[ne * 3 + 1] = Y * Math.cos(pe), R[ne * 3 + 2] = Y * Math.sin(pe);
    }
    const $ = new Fe();
    return $.setAttribute("position", new xt(R, 3)), { fill: K, outline: $ };
  }
  function g(I, G, Y, T) {
    const K = Y ?? G * 0.08, R = T ?? I * 0.07, $ = I / 2, ne = G / 2, pe = ne - K, he = R / 2, ae = [];
    function Z(ve, Pe, me, De) {
      ae.push(0, ve, Pe, 0, me, Pe, 0, me, De, 0, ve, Pe, 0, me, De, 0, ve, De);
    }
    Z(-$, -ne, $, -pe), Z(-he, -pe, he, pe), Z(-$, pe, $, ne);
    const fe = new Fe();
    fe.setAttribute("position", new xt(new Float32Array(ae), 3));
    const J = new Float32Array([0, -$, -ne, 0, $, -ne, 0, $, -pe, 0, he, -pe, 0, he, pe, 0, $, pe, 0, $, ne, 0, -$, ne, 0, -$, pe, 0, -he, pe, 0, -he, -pe, 0, -$, -pe, 0, -$, -ne]), ge = new Fe();
    return ge.setAttribute("position", new xt(J, 3)), { fill: fe, outline: ge };
  }
  function z(I, G, Y) {
    const T = I / 2, K = G / 2, R = T - Y, $ = K - Y, ne = [];
    function pe(fe, J, ge, ve) {
      ne.push(0, fe, J, 0, ge, J, 0, ge, ve, 0, fe, J, 0, ge, ve, 0, fe, ve);
    }
    pe(-T, -K, T, -$), pe(-T, $, T, K), pe(-T, -$, -R, $), pe(R, -$, T, $);
    const he = new Fe();
    he.setAttribute("position", new xt(new Float32Array(ne), 3));
    const ae = new Float32Array([0, -T, -K, 0, T, -K, 0, T, -K, 0, T, K, 0, T, K, 0, -T, K, 0, -T, K, 0, -T, -K, 0, -R, -$, 0, R, -$, 0, R, -$, 0, R, $, 0, R, $, 0, -R, $, 0, -R, $, 0, -R, -$]), Z = new Fe();
    return Z.setAttribute("position", new xt(ae, 3)), { fill: he, outline: Z };
  }
  function V(I, G, Y) {
    const T = I / 2, K = G / 2, R = T - Y, $ = K - Y, ne = new Fe(), pe = new Float32Array([0, -R, -$, 0, R, -$, 0, R, $, 0, -R, -$, 0, R, $, 0, -R, $]);
    ne.setAttribute("position", new xt(pe, 3));
    const he = [];
    function ae(ge, ve, Pe, me) {
      he.push(0, ge, ve, 0, Pe, ve, 0, Pe, me, 0, ge, ve, 0, Pe, me, 0, ge, me);
    }
    ae(-T, -K, T, -$), ae(-T, $, T, K), ae(-T, -$, -R, $), ae(R, -$, T, $);
    const Z = new Fe();
    Z.setAttribute("position", new xt(new Float32Array(he), 3));
    const fe = new Float32Array([0, -T, -K, 0, T, -K, 0, T, -K, 0, T, K, 0, T, K, 0, -T, K, 0, -T, K, 0, -T, -K, 0, -R, -$, 0, R, -$, 0, R, -$, 0, R, $, 0, R, $, 0, -R, $, 0, -R, $, 0, -R, -$]), J = new Fe();
    return J.setAttribute("position", new xt(fe, 3)), { concFill: ne, steelFillGeom: Z, outline: J };
  }
  function M(I, G, Y) {
    const T = [], K = [[0, -I / 2, -G / 2], [0, -I / 2 + Y, -G / 2], [0, -I / 2 + Y, G / 2 - Y], [0, I / 2, G / 2 - Y], [0, I / 2, G / 2], [0, -I / 2, G / 2]], R = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const he of R) T.push(...K[he]);
    const $ = new Fe();
    $.setAttribute("position", new xt(new Float32Array(T), 3));
    const ne = [];
    for (let he = 0; he < K.length; he++) {
      const ae = (he + 1) % K.length;
      ne.push(...K[he], ...K[ae]);
    }
    const pe = new Fe();
    return pe.setAttribute("position", new xt(new Float32Array(ne), 3)), { fill: $, outline: pe };
  }
  function H(I, G, Y, T) {
    const K = T / 2, R = [], $ = [[0, -I - K, -G / 2], [0, -Y - K, -G / 2], [0, -Y - K, G / 2 - Y], [0, -K, G / 2 - Y], [0, -K, G / 2], [0, -I - K, G / 2]], ne = [[0, K, -G / 2], [0, K + Y, -G / 2], [0, K + Y, G / 2 - Y], [0, I + K, G / 2 - Y], [0, I + K, G / 2], [0, K, G / 2]], pe = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const fe of pe) R.push(...$[fe]);
    for (const fe of pe) R.push(...ne[fe]);
    const he = new Fe();
    he.setAttribute("position", new xt(new Float32Array(R), 3));
    const ae = [];
    for (const fe of [$, ne]) for (let J = 0; J < fe.length; J++) {
      const ge = (J + 1) % fe.length;
      ae.push(...fe[J], ...fe[ge]);
    }
    const Z = new Fe();
    return Z.setAttribute("position", new xt(new Float32Array(ae), 3)), { fill: he, outline: Z };
  }
  function xe(I, G, Y, T) {
    const K = G / 2, R = I, $ = [[0, -R, -K], [0, -R, -K + Y], [0, -T, -K + Y], [0, -T, K - Y], [0, -R, K - Y], [0, -R, K], [0, 0, K], [0, 0, -K]], ne = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], pe = [];
    for (const fe of ne) pe.push(...$[fe]);
    const he = new Fe();
    he.setAttribute("position", new xt(new Float32Array(pe), 3));
    const ae = [];
    for (let fe = 0; fe < $.length; fe++) {
      const J = (fe + 1) % $.length;
      ae.push(...$[fe], ...$[J]);
    }
    const Z = new Fe();
    return Z.setAttribute("position", new xt(new Float32Array(ae), 3)), { fill: he, outline: Z };
  }
  function be(I, G, Y, T, K) {
    const R = G / 2, $ = K / 2, ne = [], pe = [[0, -I, -R], [0, -I, -R + Y], [0, -$ - T, -R + Y], [0, -$ - T, R - Y], [0, -I, R - Y], [0, -I, R], [0, -$, R], [0, -$, -R]], he = pe.map((ge) => [ge[0], -ge[1], ge[2]]), ae = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const ge of ae) ne.push(...pe[ge]);
    for (const ge of ae) ne.push(...he[ge]);
    const Z = new Fe();
    Z.setAttribute("position", new xt(new Float32Array(ne), 3));
    const fe = [];
    for (const ge of [pe, he]) for (let ve = 0; ve < ge.length; ve++) {
      const Pe = (ve + 1) % ge.length;
      fe.push(...ge[ve], ...ge[Pe]);
    }
    const J = new Fe();
    return J.setAttribute("position", new xt(new Float32Array(fe), 3)), { fill: Z, outline: J };
  }
  function se(I, G, Y, T) {
    const K = I / 2, R = G / 2, $ = T / 2, ne = [[0, -$, -R], [0, $, -R], [0, $, R - Y], [0, K, R - Y], [0, K, R], [0, -K, R], [0, -K, R - Y], [0, -$, R - Y]], pe = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], he = [];
    for (const J of pe) he.push(...ne[J]);
    const ae = new Fe();
    ae.setAttribute("position", new xt(new Float32Array(he), 3));
    const Z = [];
    for (let J = 0; J < ne.length; J++) {
      const ge = (J + 1) % ne.length;
      Z.push(...ne[J], ...ne[ge]);
    }
    const fe = new Fe();
    return fe.setAttribute("position", new xt(new Float32Array(Z), 3)), { fill: ae, outline: fe };
  }
  function D(I, G, Y = 24) {
    const T = I / 2, K = T - G, R = [];
    for (let he = 0; he < Y; he++) {
      const ae = he / Y * Math.PI * 2, Z = (he + 1) / Y * Math.PI * 2, fe = Math.cos(ae), J = Math.sin(ae), ge = Math.cos(Z), ve = Math.sin(Z);
      R.push(0, T * fe, T * J, 0, T * ge, T * ve, 0, K * ge, K * ve), R.push(0, T * fe, T * J, 0, K * ge, K * ve, 0, K * fe, K * J);
    }
    const $ = new Fe();
    $.setAttribute("position", new xt(new Float32Array(R), 3));
    const ne = [];
    for (let he = 0; he < Y; he++) {
      const ae = he / Y * Math.PI * 2, Z = (he + 1) / Y * Math.PI * 2;
      ne.push(0, T * Math.cos(ae), T * Math.sin(ae), 0, T * Math.cos(Z), T * Math.sin(Z)), ne.push(0, K * Math.cos(ae), K * Math.sin(ae), 0, K * Math.cos(Z), K * Math.sin(Z));
    }
    const pe = new Fe();
    return pe.setAttribute("position", new xt(new Float32Array(ne), 3)), { fill: $, outline: pe };
  }
  const oe = new ut({ color: 52479, transparent: true, opacity: 0.35, side: Ft, depthWrite: false }), B = new yt({ color: 52479 }), ie = new ut({ color: 16750848, transparent: true, opacity: 0.4, side: Ft, depthWrite: false }), le = new yt({ color: 16750848 });
  function N(I, G) {
    const Y = Math.abs(G[0] - I[0]), T = Math.abs(G[1] - I[1]), K = Math.abs(G[2] - I[2]);
    return K > Y && K > T || T > Y && T > K;
  }
  return te.derive(() => {
    var _a2, _b;
    l.deformedShape.val, l.secColumns.val, l.secBeams.val, l.secFloor.val;
    const I = l.secColumns.rawVal, G = l.secBeams.rawVal;
    if (!I && !G) {
      h.children.forEach(($) => {
        $ instanceof At && $.dispose();
      }), h.clear();
      return;
    }
    h.children.forEach(($) => {
      $ instanceof At && $.dispose();
    }), h.clear();
    const Y = (_a2 = e.elements) == null ? void 0 : _a2.val, T = (_b = e.elementInputs) == null ? void 0 : _b.val;
    if (!Y || !T) return;
    const K = T.sectionShapes, R = l.secFloor.rawVal;
    Y.forEach(($, ne) => {
      if ($.length !== 2) return;
      const pe = d.rawVal[$[0]], he = d.rawVal[$[1]];
      if (!pe || !he) return;
      const ae = N(pe, he);
      if (ae && !I || !ae && !G) return;
      if (R >= 0) {
        const ve = Math.min(pe[1], he[1]);
        Math.max(pe[1], he[1]);
        const Pe = l.gridSize.rawVal || 3;
        if (Math.floor(ve / Pe + 0.01) !== R) return;
      }
      const Z = K == null ? void 0 : K.get(ne);
      if (!Z) return;
      const fe = [(pe[0] + he[0]) / 2, (pe[1] + he[1]) / 2, (pe[2] + he[2]) / 2], J = Do(pe, he);
      if (Z.type === "CFT") {
        const ve = V(Z.b, Z.h, Z.tw ?? Z.b * 0.05), Pe = new it(ve.concFill, oe);
        Pe.position.set(...fe), Pe.rotation.setFromRotationMatrix(J), h.add(Pe);
        const me = new it(ve.steelFillGeom, ie);
        me.position.set(...fe), me.rotation.setFromRotationMatrix(J), h.add(me);
        const De = new zt(ve.outline, le);
        De.position.set(...fe), De.rotation.setFromRotationMatrix(J), h.add(De);
      } else {
        let ve, Pe, me;
        switch (Z.type) {
          case "rect":
            ve = v(Z.b, Z.h), Pe = oe, me = B;
            break;
          case "circ":
            ve = b(Z.d), Pe = oe, me = B;
            break;
          case "I":
            ve = g(Z.b, Z.h, Z.tf, Z.tw), Pe = ie, me = le;
            break;
          case "HSS":
            ve = z(Z.b, Z.h, Z.tw ?? Z.b * 0.05), Pe = ie, me = le;
            break;
          case "CFT":
            ve = V(Z.b, Z.h, Z.tw ?? Z.b * 0.05), Pe = ie, me = le;
            break;
          case "L":
            ve = M(Z.b ?? Z.h, Z.h, Z.t ?? Z.tw ?? 3e-3), Pe = ie, me = le;
            break;
          case "2L":
            ve = H(Z.b ?? Z.h, Z.h, Z.t ?? Z.tw ?? 3e-3, Z.dis ?? 0.01), Pe = ie, me = le;
            break;
          case "C":
          case "coldC":
            ve = xe(Z.b, Z.h, Z.tf ?? Z.t ?? 3e-3, Z.tw ?? Z.t ?? 3e-3), Pe = ie, me = le;
            break;
          case "2C":
            ve = be(Z.b, Z.h, Z.tf ?? 5e-3, Z.tw ?? 5e-3, Z.dis ?? 0.01), Pe = ie, me = le;
            break;
          case "T":
            ve = se(Z.b, Z.h, Z.tf ?? 0.01, Z.tw ?? 6e-3), Pe = ie, me = le;
            break;
          case "pipe":
            ve = D(Z.d, Z.tw ?? Z.d * 0.05), Pe = ie, me = le;
            break;
          default:
            return;
        }
        const De = new it(ve.fill, Pe);
        De.position.set(...fe), De.rotation.setFromRotationMatrix(J), h.add(De);
        const Ze = new zt(ve.outline, me);
        Ze.position.set(...fe), Ze.rotation.setFromRotationMatrix(J), h.add(Ze);
      }
      const ge = Aa(Z);
      if (ge) {
        const Pe = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(Z.type) ? "#ff9900" : "#00ccff", me = new At(ge, Pe, "transparent");
        me.position.set(fe[0], fe[1], fe[2]);
        const De = 0.05 * l.gridSize.rawVal * 0.5;
        me.updateScale(De * ((u == null ? void 0 : u.rawVal) ?? 1)), y.add(me);
      }
    });
  }), u && te.derive(() => {
    if (u.val, !l.sections.rawVal) return;
    const I = 0.05 * l.gridSize.val * 0.5;
    y.children.forEach((G) => {
      G instanceof At && G.updateScale(I * u.rawVal);
    });
  }), te.derive(() => {
    h.visible = l.sections.val;
  }), te.derive(() => {
    y.visible = l.sectionLabels.val;
  }), h;
}
function Va(e) {
  if (!e) return null;
  const l = e.type, d = (V, M) => [V, M], u = (V, M) => [d(-V / 2, -M / 2), d(V / 2, -M / 2), d(V / 2, M / 2), d(-V / 2, M / 2)], h = (V, M = 24) => {
    const H = V / 2, xe = [];
    for (let be = 0; be < M; be++) {
      const se = 2 * Math.PI * be / M;
      xe.push(d(H * Math.cos(se), H * Math.sin(se)));
    }
    return xe;
  }, y = e.b ?? 0, v = e.h ?? 0, b = e.d ?? 0, g = e.tw ?? e.t ?? 0, z = e.tf ?? e.t ?? 0;
  switch (l) {
    case "rect":
      return y && v ? { contorno: u(y, v) } : null;
    case "circ":
      return b ? { contorno: h(b) } : null;
    case "pipe":
      return b && g ? { contorno: h(b), huecos: [h(b - 2 * g).reverse()] } : null;
    case "HSS":
      return y && v && g ? { contorno: u(y, v), huecos: [u(y - 2 * g, v - 2 * (z || g)).reverse()] } : null;
    case "CFT":
      return y && v ? { contorno: u(y, v) } : null;
    case "I":
      return y && v && g && z ? { contorno: [d(-y / 2, -v / 2), d(y / 2, -v / 2), d(y / 2, -v / 2 + z), d(g / 2, -v / 2 + z), d(g / 2, v / 2 - z), d(y / 2, v / 2 - z), d(y / 2, v / 2), d(-y / 2, v / 2), d(-y / 2, v / 2 - z), d(-g / 2, v / 2 - z), d(-g / 2, -v / 2 + z), d(-y / 2, -v / 2 + z)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return y && v && g && z ? { contorno: [d(-y / 2, -v / 2), d(y / 2, -v / 2), d(y / 2, -v / 2 + z), d(-y / 2 + g, -v / 2 + z), d(-y / 2 + g, v / 2 - z), d(y / 2, v / 2 - z), d(y / 2, v / 2), d(-y / 2, v / 2)] } : null;
    case "T":
      return y && v && g && z ? { contorno: [d(-g / 2, -v / 2), d(g / 2, -v / 2), d(g / 2, v / 2 - z), d(y / 2, v / 2 - z), d(y / 2, v / 2), d(-y / 2, v / 2), d(-y / 2, v / 2 - z), d(-g / 2, v / 2 - z)] } : null;
    case "L":
    case "2L":
      return y && v && g ? { contorno: [d(-y / 2, -v / 2), d(y / 2, -v / 2), d(y / 2, -v / 2 + g), d(-y / 2 + g, -v / 2 + g), d(-y / 2 + g, v / 2), d(-y / 2, v / 2)] } : null;
    default:
      return y && v ? { contorno: u(y, v) } : b ? { contorno: h(b) } : null;
  }
}
function Ta(e, l, d) {
  if (!e || e <= 0 || !l || !d || l <= 0 || d <= 0) return null;
  const u = Math.sqrt(Math.sqrt(d / l)), h = Math.sqrt(e / u), y = e / h;
  return !isFinite(h) || !isFinite(y) || h <= 0 || y <= 0 ? null : { contorno: [[-h / 2, -y / 2], [h / 2, -y / 2], [h / 2, y / 2], [-h / 2, y / 2]] };
}
function $a(e) {
  const l = new Tn();
  e.contorno.forEach(([d, u], h) => h ? l.lineTo(d, u) : l.moveTo(d, u)), l.closePath();
  for (const d of e.huecos ?? []) {
    const u = new ra();
    d.forEach(([h, y], v) => v ? u.lineTo(h, y) : u.moveTo(h, y)), u.closePath(), l.holes.push(u);
  }
  return l;
}
function La(e, l, d) {
  const u = new rt();
  u.name = "extrusion";
  const h = new Co({ color: 8369151, transparent: true, opacity: 0.92, side: Ft }), y = new Co({ color: 12623968, transparent: true, opacity: 0.85, side: Ft }), v = new Co({ color: 11583173, transparent: true, opacity: 0.85, side: Ft }), b = new rt();
  b.add(new zs(16777215, 0.55));
  const g = new so(16777215, 0.75);
  g.position.set(30, 25, 40);
  const z = new so(16777215, 0.35);
  z.position.set(-25, -20, 15), b.add(g, z);
  let V = 0;
  return te.derive(() => {
    var _a2, _b, _c, _d, _e;
    const M = ((_a2 = l.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++V, on: M }, u.visible = M;
    for (const B of [...u.children]) B !== b && (u.remove(B), (_c = (_b = B.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c.call(_b));
    if (u.children.includes(b) || u.add(b), !M) return;
    const H = d.val ?? [], xe = ((_d = e.elements) == null ? void 0 : _d.val) ?? [], be = ((_e = e.elementInputs) == null ? void 0 : _e.val) ?? {}, se = be.sectionShapes ?? /* @__PURE__ */ new Map(), D = be.thicknesses ?? /* @__PURE__ */ new Map();
    let oe = "";
    try {
      xe.forEach((B, ie) => {
        var _a3, _b2, _c2;
        if (B.length === 2) {
          let le = Va(se.get(ie)), N = true;
          if (le || (le = Ta((_a3 = be.areas) == null ? void 0 : _a3.get(ie), (_b2 = be.momentsOfInertiaY) == null ? void 0 : _b2.get(ie), (_c2 = be.momentsOfInertiaZ) == null ? void 0 : _c2.get(ie)), N = false), !le) return;
          const I = H[B[0]], G = H[B[1]];
          if (!I || !G) return;
          const Y = Math.hypot(G[0] - I[0], G[1] - I[1], G[2] - I[2]);
          if (Y < 1e-9) return;
          const T = new la($a(le), { depth: Y, bevelEnabled: false, curveSegments: 4 });
          T.applyMatrix4(new ao().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const K = new it(T, N ? h : y);
          K.position.set(I[0], I[1], I[2]), K.rotation.setFromRotationMatrix(Do(I, G)), u.add(K);
          return;
        }
        if (B.length === 3 || B.length === 4) {
          const le = D.get(ie);
          if (!le || le <= 0) return;
          const N = B.map((J) => H[J]).filter(Boolean);
          if (N.length < 3) return;
          const I = [N[1][0] - N[0][0], N[1][1] - N[0][1], N[1][2] - N[0][2]], G = [N[2][0] - N[0][0], N[2][1] - N[0][1], N[2][2] - N[0][2]], Y = I[1] * G[2] - I[2] * G[1], T = I[2] * G[0] - I[0] * G[2], K = I[0] * G[1] - I[1] * G[0], R = Math.hypot(Y, T, K);
          if (R < 1e-12) return;
          const $ = [Y / R, T / R, K / R], ne = [], pe = (J) => N.map((ge) => [ge[0] + $[0] * J, ge[1] + $[1] * J, ge[2] + $[2] * J]), he = pe(+le / 2), ae = pe(-le / 2), Z = (J, ge, ve) => ne.push(...J, ...ge, ...ve);
          for (const J of [he, ae]) Z(J[0], J[1], J[2]), J.length === 4 && Z(J[0], J[2], J[3]);
          for (let J = 0; J < N.length; J++) {
            const ge = (J + 1) % N.length;
            Z(he[J], ae[J], ae[ge]), Z(he[J], ae[ge], he[ge]);
          }
          const fe = new Fe();
          fe.setAttribute("position", new St(ne, 3)), fe.computeVertexNormals(), u.add(new it(fe, v));
        }
      });
    } catch (B) {
      oe = String((B == null ? void 0 : B.message) ?? B);
    }
    globalThis.__extrusionDebug = { corridas: V, on: M, fallo: oe, nElementos: xe.length, nFormas: se.size, nEspesores: D.size, mallas: u.children.length - 1 };
  }), u;
}
function $s(e, l, d = 0) {
  const u = [l[0] - e[0], l[1] - e[1], l[2] - e[2]], h = Math.hypot(u[0], u[1], u[2]) || 1, y = u[0] / h, v = u[1] / h, b = u[2] / h, g = Math.sqrt(y * y + v * v);
  let z, V, M;
  if (g < 1e-9) {
    const H = b > 0 ? 1 : -1;
    z = [0, 0, H], V = [1, 0, 0], M = [0, H, 0];
  } else z = [y, v, b], V = [-y * b / g, -v * b / g, g], M = [v / g, -y / g, 0];
  if (Math.abs(d) > 1e-12) {
    const H = d * Math.PI / 180, xe = Math.cos(H), be = Math.sin(H), se = V.map((oe, B) => xe * oe + be * M[B]), D = M.map((oe, B) => -be * V[B] + xe * oe);
    V = se, M = D;
  }
  return { e1: z, e2: V, e3: M };
}
function Lo(e, l) {
  if (!l) return [0, 0];
  const d = Number(l[0] ?? 0), u = Number(l[1] ?? 0);
  return e === "bendingsY" ? [d, -u] : [-d, u];
}
function Ls(e, l) {
  const d = (u) => u.map((h) => -h);
  switch (e) {
    case "bendingsZ":
      return d(l.e2);
    case "bendingsY":
      return d(l.e3);
    case "shearsZ":
      return l.e3;
    default:
      return l.e2;
  }
}
class jn extends rt {
  constructor(l, d, u, h, y, v, b) {
    super();
    const g = new Tn().moveTo(0, 0).lineTo(0, v[1]).lineTo(u, v[1]).lineTo(u, 0).lineTo(0, 0), z = g.getPoints(), V = new Fe().setFromPoints(z);
    this.lines = new zt(V, new yt({ color: un().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(h), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const M = new oo(g), H = new ut({ color: v[1] > 0 ? 24435 : 11411474, side: Ft });
    this.mesh = new it(M, H), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(h), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new At(`${y[1].toFixed(4)}`), this.normalizedResult = v, this.textPosition = $n([l, d]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(h), this.add(this.text);
  }
  updateScale(l) {
    this.lines.scale.set(1, l * 2, 1), this.mesh.scale.set(1, l * 2, 1), this.text.updateScale(l * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * l);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class Vo extends rt {
  constructor(l, d, u, h, y, v, b) {
    super();
    const g = y[0] * u / (y[0] + y[1]), z = y[0] * y[1] > 0;
    if (this.text = new At(`${y[0].toFixed(4)}`), this.text2 = new At(`${(y[1] * -1).toFixed(4)}`), this.normalizedResult = v, this.textPosition = $o(l, d), this.text2Position = $o(d, l), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(h), this.text2.rotation.setFromRotationMatrix(h), this.add(this.text, this.text2), z) {
      const V = new Tn().moveTo(0, 0).lineTo(0, v[0]).lineTo(g, 0).lineTo(0, 0), M = new Tn().moveTo(g, 0).lineTo(u, -v[1]).lineTo(u, 0).lineTo(g, 0), H = V.getPoints(), xe = M.getPoints(), be = new Fe().setFromPoints(H), se = new Fe().setFromPoints(xe), D = new yt({ color: un().resultOutline });
      this.lines = new zt(be, D), this.lines2 = new zt(se, D), this.lines.position.set(...l), this.lines2.position.set(...l), this.lines.rotation.setFromRotationMatrix(h), this.lines2.rotation.setFromRotationMatrix(h), b && this.lines.rotateX(Math.PI / 2), b && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const oe = new oo(V), B = new oo(M), ie = new ut({ color: v[0] > 0 ? 24435 : 11411474, side: Ft }), le = new ut({ color: -v[1] > 0 ? 24435 : 11411474, side: Ft });
      this.mesh = new it(oe, ie), this.mesh2 = new it(B, le), this.mesh.position.set(...l), this.mesh2.position.set(...l), this.mesh.rotation.setFromRotationMatrix(h), this.mesh2.rotation.setFromRotationMatrix(h), b && this.mesh.rotateX(Math.PI / 2), b && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const V = new Tn().moveTo(0, 0).lineTo(0, v[0]).lineTo(u, -v[1]).lineTo(u, 0).lineTo(0, 0), M = V.getPoints(), H = new Fe().setFromPoints(M);
      this.lines = new zt(H, new yt({ color: un().resultOutline })), this.lines.position.set(...l), this.lines.rotation.setFromRotationMatrix(h), b && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const xe = new oo(V), be = new ut({ color: v[0] > 0 ? 24435 : 11411474, side: Ft });
      this.mesh = new it(xe, be), this.mesh.position.set(...l), this.mesh.rotation.setFromRotationMatrix(h), b && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
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
function Ia(e, l, d, u) {
  const h = () => {
    const b = d.rawVal;
    if (!(b == null ? void 0 : b.length)) return 0.05 * l.gridSize.rawVal;
    const g = [1 / 0, 1 / 0, 1 / 0], z = [-1 / 0, -1 / 0, -1 / 0];
    for (const M of b) for (let H = 0; H < 3; H++) M[H] < g[H] && (g[H] = M[H]), M[H] > z[H] && (z[H] = M[H]);
    const V = Math.hypot(z[0] - g[0], z[1] - g[1], z[2] - g[2]);
    return !isFinite(V) || V <= 0 ? 0.05 * l.gridSize.rawVal : 0.025 * V;
  }, y = new rt(), v = { normals: jn, shearsY: jn, shearsZ: jn, torsions: jn, bendingsY: Vo, bendingsZ: Vo };
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, d.val, l.frameResults.val == "none") return;
    y.children.forEach((g) => g.dispose()), y.clear();
    const b = Is[l.frameResults.rawVal];
    (_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.rawVal[b]) == null ? void 0 : _b.forEach((g, z) => {
      var _a3, _b2, _c, _d, _e, _f;
      const V = ((_a3 = e.elements) == null ? void 0 : _a3.rawVal[z]) ?? [0, 1], M = d.rawVal[V[0]], H = d.rawVal[V[1]];
      if (!M || !H) return;
      const xe = new E(...H).distanceTo(new E(...M)), be = Ra((_b2 = e.analyzeOutputs) == null ? void 0 : _b2.rawVal[b]), se = ((_f = (_e = (_d = (_c = e.elementInputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, z)) ?? 0, D = $s(M, H, se), oe = Ls(b, D), B = new E(...D.e1), ie = new E(...oe), le = new ao().makeBasis(B, ie, B.clone().cross(ie)), [N, I] = Lo(b, g), G = v[b] === Vo ? [N, -I] : [N, I], Y = G.map((K) => K / (be === 0 ? 1 : be)), T = new v[b](M, H, xe, le, G, Y, false);
      T.updateScale(h() * u.rawVal), y.add(T);
    });
  }), te.derive(() => {
    if (u.val, l.frameResults.rawVal == "none") return;
    l.gridSize.val;
    const b = h();
    y.children.forEach((g) => g.updateScale(b * u.rawVal));
  }), te.derive(() => {
    y.visible = l.frameResults.val != "none";
  }), y;
}
function Ra(e) {
  let l = 0;
  return e == null ? void 0 : e.forEach((d) => {
    const u = Math.max(...(d ?? [0, 0]).map((h) => Math.abs(h)));
    u > l && (l = u);
  }), l;
}
class Da extends rt {
  constructor(l, d, u) {
    super();
    const h = d === Bo.reactions;
    u[0] && (this.xText1 = new At(`${h ? "Fx" : "Dx"}: ` + u[0].toFixed(4))), u[3] && (this.xText2 = new At(`${h ? "Mx" : "Rx"}: ` + u[3].toFixed(4))), u[1] && (this.yText1 = new At(`${h ? "Fy" : "Dy"}: ` + u[1].toFixed(4))), u[4] && (this.yText2 = new At(`${h ? "My" : "Ry"}: ` + u[4].toFixed(4))), u[2] && (this.zText1 = new At(`${h ? "Fz" : "Dz"}: ` + u[2].toFixed(4))), u[5] && (this.zText2 = new At(`${h ? "Mz" : "Rz"}: ` + u[5].toFixed(4))), (u[0] || u[3]) && (this.xArrow = new pn(new E(1, 0, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (u[1] || u[4]) && (this.yArrow = new pn(new E(0, 1, 0), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), (u[2] || u[5]) && (this.zArrow = new pn(new E(0, 0, 1), new E(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...l), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
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
function Ba(e, l, d, u) {
  const h = new rt();
  return te.derive(() => {
    var _a2, _b;
    if (l.deformedShape.val, l.nodeResults.val == "none") return;
    h.children.forEach((b) => b.dispose()), h.clear();
    const y = Bo[l.nodeResults.rawVal], v = 0.05 * l.gridSize.val;
    (_b = (_a2 = e.deformOutputs) == null ? void 0 : _a2.val[y]) == null ? void 0 : _b.forEach((b, g) => {
      const z = new Da(d.rawVal[g], y, b ?? [0, 0, 0, 0, 0, 0]);
      z.updateScale(v * u.rawVal), h.add(z);
    });
  }), te.derive(() => {
    if (u.val, l.nodeResults.rawVal == "none") return;
    const y = 0.05 * l.gridSize.val;
    h.children.forEach((v) => v.updateScale(y * u.rawVal));
  }), te.derive(() => {
    h.visible = l.nodeResults.val != "none";
  }), h;
}
function Na({ drawingObj: e, gridObj: l, scene: d, getActiveCamera: u, controls: h, gridSize: y, derivedDisplayScale: v, rendererElm: b, viewerRender: g }) {
  var _a2;
  const z = new ca(), V = new da(), M = (n) => {
    const o = b.getBoundingClientRect(), a = n.clientX - o.left, t = n.clientY - o.top, s = o.width || 1, i = o.height || 1;
    if (!!window.__hekatanSplitMode) {
      const m = s / 2;
      if (a >= m) return V.x = (a - m) / m * 2 - 1, V.y = -(t / i) * 2 + 1, window.__hekatanSplitCamera ?? u();
      V.x = a / m * 2 - 1;
    } else V.x = a / s * 2 - 1;
    return V.y = -(t / i) * 2 + 1, u();
  }, H = new it(new ln(1e4, 1e4), new ut({ side: Ft, transparent: true, opacity: 0, depthWrite: false }));
  H.visible = true, H.frustumCulled = false, d.add(H);
  const xe = (n, o, a) => {
    const t = new it(new ln(1e4, 1e4), new ut({ side: Ft, transparent: true, opacity: 0, depthWrite: false }));
    return t.rotation.set(n, o, a), t.visible = false, t.frustumCulled = false, d.add(t), t;
  }, be = xe(Math.PI / 2, 0, 0), se = xe(0, Math.PI / 2, 0);
  let D = false;
  const oe = () => {
    if (D) return z.intersectObjects([H], false);
    if (be.visible = !!window.__hekatanGridPlaneXZ, se.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && at.visible) {
      const a = z.intersectObjects([at, ht, Be], false);
      if (a.length > 0) return a;
    }
    const o = [H];
    return be.visible && o.push(be), se.visible && o.push(se), nn.visible && mn.length > 0 && o.push(...mn), z.intersectObjects(o, false);
  }, B = new to(new Fe(), new no()), ie = new to(new Fe(), new no({ color: "gray", sizeAttenuation: false, size: 6 })), le = new to(new Fe(), new no({ color: "orange", sizeAttenuation: false, size: 5 }));
  d.add(le);
  const N = document.createElement("input");
  N.id = "hk-rubber-label", N.type = "text", N.spellcheck = false, N.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, N.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(N);
  let I = null, G = null, Y = false;
  const T = new E(), K = (n, o, a, t, s, i) => {
    const r = t - n, m = s - o, w = i - a, x = Math.hypot(r, m, w);
    if (x < 0.01) {
      N.style.display = "none";
      return;
    }
    I = [n, o, a], G = [r / x, m / x, w / x], T.set((n + t) / 2, (o + s) / 2, (a + i) / 2), T.project(u());
    const k = b.getBoundingClientRect(), S = k.left + (T.x * 0.5 + 0.5) * k.width, c = k.top + (-T.y * 0.5 + 0.5) * k.height;
    if (N.style.left = S + "px", N.style.top = c + "px", N.style.display = "block", !Y) {
      if (N.value = `${x.toFixed(2)} m`, document.activeElement !== N) {
        const F = document.activeElement;
        F && (F.tagName === "INPUT" || F.tagName === "TEXTAREA") && F !== N || N.focus({ preventScroll: true });
      }
      try {
        N.select();
      } catch {
      }
    }
  }, R = () => {
    N.style.display = "none", I = null, G = null, Y = false, document.activeElement === N && N.blur();
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
    const i = I[0] + a * n, r = I[1] + t * n, m = I[2] + s * n;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, [i, r, m]];
    const w = e.polylines.rawVal, x = w.length ? w[w.length - 1] : [];
    e.polylines.val = [...w.slice(0, -1), [...x, e.points.rawVal.length - 1]], N.blur();
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
        const [i, r] = s;
        return a ? { kind: "relPolar", L: i, ang: r } : { kind: "absPolar", L: i, ang: r };
      }
      if (s.length === 3 && a) {
        const [i, r, m] = s;
        return { kind: "relSpherical", L: i, az: r, el: m };
      }
      return null;
    }
    if (o.includes(",")) {
      const s = o.split(",").map((w) => parseFloat(w.trim()));
      if (s.some(isNaN)) return null;
      const [i, r, m = 0] = s;
      return a ? { kind: "relCart", dx: i, dy: r, dz: m } : { kind: "absCart", x: i, y: r, z: m };
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
    ls(new E(a[0], a[1], a[2]), null), I = a, N.blur();
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
      if (Y = false, a.kind === "length") $(a.L), de(`\u270F DDE ${a.L}m aplicado en direcci\xF3n actual`);
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
      n.preventDefault(), Y = false, N.blur();
      return;
    }
    const o = n.key.toLowerCase();
    if (o === "x" || o === "y" || o === "z") {
      n.preventDefault(), setTimeout(() => {
        if (!Y && N.style.display === "block") try {
          N.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(n.key) || n.key === "Backspace" || n.key === "Delete") && (Y = true);
  }), window.addEventListener("keydown", (n) => {
    if (!I || !G || document.activeElement === N) return;
    const o = document.activeElement;
    o && (o.tagName === "INPUT" || o.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(n.key) && (N.value = n.key, N.focus(), N.setSelectionRange(1, 1), n.preventDefault());
  });
  const ae = document.createElement("div");
  ae.id = "hk-coord-readout", ae.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", ae.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(ae);
  const Z = document.createElement("div");
  Z.id = "hk-coord-fixed", Z.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", Z.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Z);
  const fe = new zt(new Fe().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new An({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  fe.frustumCulled = false, fe.visible = false, fe.name = "rubberBand", d.add(fe), window.__hekatanRubberBand = fe;
  const J = new zt(new Fe(), new yt({ color: 2282478, transparent: true, opacity: 0.9 }));
  J.frustumCulled = false, J.visible = false, d.add(J);
  let ge = [];
  const ve = new zt(new Fe(), new yt({ color: 16763904, transparent: true, opacity: 0.95 }));
  ve.frustumCulled = false, ve.visible = false, ve.renderOrder = 999, d.add(ve);
  let Pe = [];
  const me = document.createElement("div");
  me.id = "hk-measure-label", me.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:4px;padding:2px 7px;font:600 12px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(me);
  const De = (n) => {
    var _a3, _b;
    const o = M(n);
    if (!o) return null;
    z.setFromCamera(V, o);
    let a = null, t = null;
    const s = z.intersectObjects(d.children, true).filter((c) => c.object.isMesh && c.object !== gt && c.object !== et && c.object.visible !== false);
    if (s.length) {
      const c = s[0], F = c.point;
      a = [F.x, F.y, F.z];
      const U = (_b = (_a3 = c.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      U && c.face && (t = [c.face.a, c.face.b, c.face.c].map((f) => {
        const p = new E().fromBufferAttribute(U, f);
        return c.object.localToWorld(p), [p.x, p.y, p.z];
      }));
    } else {
      const c = oe();
      if (c.length) {
        const F = c[0].point;
        a = [F.x, F.y, F.z];
      }
    }
    if (!a) return null;
    const i = b.getBoundingClientRect(), r = (c) => {
      const F = new E(c[0], c[1], c[2]).project(o);
      return [i.left + (F.x * 0.5 + 0.5) * i.width, i.top + (-F.y * 0.5 + 0.5) * i.height];
    }, m = [n.clientX, n.clientY], w = 14;
    let x = a, k = w;
    const S = (c) => {
      const F = r(c), O = Math.hypot(F[0] - m[0], F[1] - m[1]);
      O < k && (k = O, x = c);
    };
    for (const c of t ?? []) S(c);
    for (const c of e.points.rawVal) S(c);
    return x;
  }, Ze = () => {
    if (Pe.length < 1) {
      me.style.display = "none";
      return;
    }
    const n = u(), o = Pe[0], a = Pe[1] ?? Pe[0], s = new E((o[0] + a[0]) / 2, (o[1] + a[1]) / 2, (o[2] + a[2]) / 2).clone().project(n), i = b.getBoundingClientRect();
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
    (_a2 = h.addEventListener) == null ? void 0 : _a2.call(h, "change", Ze);
  } catch {
  }
  const et = new it(new Fe(), new ut({ color: 16096779, transparent: true, opacity: 0.35, side: Ft, depthWrite: false }));
  et.frustumCulled = false, et.visible = false, et.renderOrder = 998, et.name = "hk-fill-preview", d.add(et), b.addEventListener("pointerleave", () => {
    et.visible && (et.visible = false, g());
  });
  const vt = (n) => {
    var _a3, _b, _c, _d;
    const o = e.points.rawVal, a = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = /* @__PURE__ */ new Map(), s = (f, p) => {
      f !== p && ((t.get(f) ?? t.set(f, /* @__PURE__ */ new Set()).get(f)).add(p), (t.get(p) ?? t.set(p, /* @__PURE__ */ new Set()).get(p)).add(f));
    };
    for (const f of a) for (let p = 0; p + 1 < f.length; p++) s(f[p], f[p + 1]);
    const i = (f, p) => {
      var _a4;
      return !!((_a4 = t.get(f)) == null ? void 0 : _a4.has(p));
    }, r = [], m = /* @__PURE__ */ new Set(), w = [...t.keys()];
    for (const f of w) for (const p of t.get(f)) if (!(p < f)) {
      for (const _ of t.get(p)) if (_ !== f) for (const P of t.get(_)) {
        if (P === f || P === p || !i(P, f) || i(f, _) || i(p, P)) continue;
        const X = [f, p, _, P].slice().sort((C, A) => C - A).join("-");
        m.has(X) || (m.add(X), r.push([f, p, _, P]));
      }
    }
    for (const f of w) for (const p of t.get(f)) if (!(p < f)) for (const _ of t.get(p)) {
      if (_ === f || !i(_, f)) continue;
      const P = [f, p, _].slice().sort((X, C) => X - C).join("-");
      m.has(P) || (m.add(P), r.push([f, p, _]));
    }
    const x = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", k = (f) => x === "xy" ? [f[0], f[1]] : x === "xz" ? [f[0], f[2]] : [f[1], f[2]], S = k(n), c = (f, p) => {
      let _ = false;
      for (let P = 0, X = p.length - 1; P < p.length; X = P++) {
        const C = p[P][0], A = p[P][1], q = p[X][0], Q = p[X][1];
        A > f[1] != Q > f[1] && f[0] < (q - C) * (f[1] - A) / (Q - A) + C && (_ = !_);
      }
      return _;
    }, F = (f) => {
      let p = 0;
      for (let _ = 0, P = f.length - 1; _ < f.length; P = _++) p += (f[P][0] + f[_][0]) * (f[P][1] - f[_][1]);
      return Math.abs(p) / 2;
    };
    let O = null, U = 1 / 0;
    for (const f of r) {
      const p = f.map((P) => k(o[P]));
      if (!c(S, p)) continue;
      const _ = F(p);
      _ < U && (U = _, O = f);
    }
    return O;
  }, ue = new rt(), L = new it(new ln(1, 1), new ut({ color: 2282478, transparent: true, opacity: 0.08, side: Ft, depthWrite: false })), j = new jt(new hs(new ln(1, 1)), new yt({ color: 2282478, transparent: true, opacity: 0.85 })), W = new jt(new Fe(), new yt({ color: 2282478, transparent: true, opacity: 0.3 })), ee = (n, o) => {
    const a = [], t = Math.ceil(n / o);
    for (let s = -t; s <= t; s++) {
      const i = s * o;
      a.push(-n, i, 0, n, i, 0), a.push(i, -n, 0, i, n, 0);
    }
    W.geometry.dispose(), W.geometry = new Fe(), W.geometry.setAttribute("position", new St(a, 3));
  };
  ue.add(L, j, W), ue.visible = false, ue.frustumCulled = false, d.add(ue);
  const we = new rt();
  we.frustumCulled = false, we.visible = false, d.add(we);
  const _e = (n) => {
    const o = new Fe().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), a = new An({ color: n, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new zt(o, a);
  }, ye = _e(16711680), Ae = _e(65280), Te = _e(35071);
  we.add(ye, Ae, Te);
  const He = [], Qe = (n) => n.traverse((o) => {
    var _a3, _b, _c, _d;
    (_b = (_a3 = o.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = o.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
  }), Ue = _e(16761856);
  Ue.material.dashSize = 0.28, Ue.material.gapSize = 0.16, Ue.material.opacity = 0.9, Ue.frustumCulled = false, Ue.visible = false, Ue.renderOrder = 98, d.add(Ue);
  const ft = (n) => {
    const o = new Fe().setFromPoints([new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0), new E(0, 0, 0)]), a = new yt({ color: n, transparent: true, opacity: 0.2, depthTest: false }), t = new Cs(o, a);
    return t.renderOrder = 997, t.frustumCulled = false, t;
  }, We = ft(3462041), Me = ft(16724804), Ee = ft(6333946), ct = new rt();
  ct.frustumCulled = false, ct.visible = false, d.add(ct), ct.add(We, Me, Ee);
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
      const o = window.__hekatanOrthoAnchor, a = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], t = a[a.length - 1] ?? [], s = e.points.rawVal ?? [], i = o && o.length === 3 ? o : t.length > 0 && s[t[t.length - 1]] ? s[t[t.length - 1]] : [0, 0, 0], r = window.__hekatanOrthoExt ?? 8;
      Ce(We, i, "xy", r), Ce(Me, i, "xz", r), Ce(Ee, i, "yz", r), Le(at, i, "xy", r), Le(ht, i, "xz", r), Le(Be, i, "yz", r), at.material.opacity = 0.05, ht.material.opacity = 0.05, Be.material.opacity = 0.05;
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
    a === "xy" ? s = [new E(o[0] - t, o[1] - t, o[2]), new E(o[0] + t, o[1] - t, o[2]), new E(o[0] + t, o[1] + t, o[2]), new E(o[0] - t, o[1] + t, o[2]), new E(o[0] - t, o[1] - t, o[2])] : a === "xz" ? s = [new E(o[0] - t, o[1], o[2] - t), new E(o[0] + t, o[1], o[2] - t), new E(o[0] + t, o[1], o[2] + t), new E(o[0] - t, o[1], o[2] + t), new E(o[0] - t, o[1], o[2] - t)] : s = [new E(o[0], o[1] - t, o[2] - t), new E(o[0], o[1] + t, o[2] - t), new E(o[0], o[1] + t, o[2] + t), new E(o[0], o[1] - t, o[2] + t), new E(o[0], o[1] - t, o[2] - t)], n.geometry.setFromPoints(s);
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
  const _t = new E(), kt = new E(), Kt = new E(), tn = (n) => {
    if (!Ne) return null;
    const o = n[0], a = n[1], t = n[2];
    return Ne === "x" ? (_t.set(o - 1e4, a, t), kt.set(o + 1e4, a, t)) : Ne === "y" ? (_t.set(o, a - 1e4, t), kt.set(o, a + 1e4, t)) : (_t.set(o, a, t - 1e4), kt.set(o, a, t + 1e4)), z.ray.distanceSqToSegment(_t, kt, null, Kt), Kt;
  };
  window.__hekatanProjectOnAxis = tn;
  const mt = new zt(new Fe().setFromPoints([new E(0, 0, 0), new E(0, 0, 0)]), new yt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  mt.renderOrder = 998, mt.frustumCulled = false, mt.visible = false, d.add(mt);
  let wt = -1, Nt = -1, Qt = -1;
  const Xe = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Xe;
  const Xt = new zt(new Fe().setFromPoints([new E(), new E()]), new yt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  Xt.renderOrder = 997, Xt.frustumCulled = false, Xt.visible = false, d.add(Xt);
  const Vt = new it(new bn(0.02, 12, 12), new ut({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  Vt.renderOrder = 998, Vt.visible = false, d.add(Vt);
  const fn = (n) => {
    const o = u();
    if (o.isOrthographicCamera) {
      const t = o, s = (t.top - t.bottom) / t.zoom;
      return Math.max(0.05, s * 6e-3);
    }
    const a = o.position.distanceTo(n);
    return Math.max(0.05, a / 10);
  }, In = () => {
    Vt.visible && Vt.scale.setScalar(fn(Vt.position));
  }, Gt = new rt();
  Gt.frustumCulled = false, d.add(Gt);
  const hn = 2282478;
  let Ht = null;
  const Rn = (n, o, a, t) => {
    if (!e.points) return -1;
    const s = e.points.rawVal;
    let i = -1, r = t;
    for (let m = 0; m < s.length; m++) {
      const w = s[m];
      if (!w) continue;
      const x = Math.hypot(n - w[0], o - w[1], a - w[2]);
      x < r && (r = x, i = m);
    }
    return i;
  }, Yt = () => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    for (; Gt.children.length; ) {
      const r = Gt.children.pop();
      (_b = (_a3 = r.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = ((_e2 = e.points) == null ? void 0 : _e2.rawVal) ?? [], o = ((_f = e.polylines) == null ? void 0 : _f.rawVal) ?? [], t = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const r of Xe) {
      const [m, ...w] = r.split(":");
      if (m === "pt") {
        const x = n[+w[0]];
        if (!x) continue;
        const k = new it(new bn(0.025, 12, 12), new ut({ color: hn, transparent: true, opacity: 0.9, depthTest: false }));
        k.position.set(x[0], x[1], x[2]), k.renderOrder = 999, k.__isSelectionPt = true, Gt.add(k);
      } else if (m === "seg") {
        const x = o[+w[0]], k = n[x == null ? void 0 : x[+w[1]]], S = n[x == null ? void 0 : x[+w[1] + 1]];
        if (!k || !S) continue;
        const c = new Fe().setFromPoints([new E(k[0], k[1], k[2]), new E(S[0], S[1], S[2])]), F = new zt(c, new yt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        F.renderOrder = 999, Gt.add(F);
      } else if (m === "poly") {
        const k = o[+w[0]].map((F) => {
          const O = n[F];
          return O ? new E(O[0], O[1], O[2]) : null;
        }).filter(Boolean);
        if (k.length < 2) continue;
        const S = new Fe().setFromPoints(k), c = new zt(S, new yt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        c.renderOrder = 999, Gt.add(c);
      } else if (m === "aux") {
        const x = t[+w[0]];
        if (!x || x.length !== 6) continue;
        const k = new Fe().setFromPoints([new E(x[0], x[1], x[2]), new E(x[3], x[4], x[5])]), S = new zt(k, new yt({ color: hn, transparent: true, opacity: 0.95, depthTest: false }));
        S.renderOrder = 999, Gt.add(S);
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
  const sn = (n, o, a, t, s, i, r, m, w) => {
    const x = r - t, k = m - s, S = w - i, c = x * x + k * k + S * S;
    if (c < 1e-12) return Math.hypot(n - t, o - s, a - i);
    let F = ((n - t) * x + (o - s) * k + (a - i) * S) / c;
    F = Math.max(0, Math.min(1, F));
    const O = t + F * x, U = s + F * k, f = i + F * S;
    return Math.hypot(n - O, o - U, a - f);
  }, Mn = (n, o, a, t) => {
    if (!e.polylines) return null;
    const s = e.polylines.rawVal, i = e.points.rawVal;
    let r = -1, m = -1, w = t;
    for (let x = 0; x < s.length; x++) {
      const k = s[x];
      for (let S = 0; S < k.length - 1; S++) {
        const c = i[k[S]], F = i[k[S + 1]];
        if (!c || !F) continue;
        const O = sn(n, o, a, c[0], c[1], c[2], F[0], F[1], F[2]);
        O < w && (w = O, r = x, m = S);
      }
    }
    return r >= 0 ? { polyIdx: r, segIdx: m, dist: w } : null;
  }, Dn = (n, o, a, t) => {
    const s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? (s == null ? void 0 : s.val) ?? s ?? [];
    let r = -1, m = t;
    for (let w = 0; w < i.length; w++) {
      const x = i[w];
      if (!x || x.length !== 6) continue;
      const k = sn(n, o, a, x[0], x[1], x[2], x[3], x[4], x[5]);
      k < m && (m = k, r = w);
    }
    return r;
  }, Bn = (n) => {
    const o = window.__hekatanDrawingAuxLines, t = ((o == null ? void 0 : o.rawVal) ?? (o == null ? void 0 : o.val) ?? o ?? [])[n];
    if (!t || t.length !== 6) {
      mt.visible = false;
      return;
    }
    mt.geometry.setFromPoints([new E(t[0], t[1], t[2]), new E(t[3], t[4], t[5])]), mt.visible = true;
  }, Nn = (n, o = -1) => {
    var _a3, _b;
    if (!e.polylines) return;
    const a = e.polylines.rawVal[n], t = e.points.rawVal;
    if (!a || a.length < 2) {
      mt.visible = false;
      return;
    }
    const s = ((_b = (_a3 = e.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(n)) ?? false, i = [];
    if (s || o < 0 || o >= a.length - 1) for (const r of a) {
      const m = t[r];
      m && i.push(new E(m[0], m[1], m[2]));
    }
    else {
      const r = t[a[o]], m = t[a[o + 1]];
      r && i.push(new E(r[0], r[1], r[2])), m && i.push(new E(m[0], m[1], m[2]));
    }
    mt.geometry.setFromPoints(i), mt.visible = true;
  }, Xn = (n) => {
    var _a3;
    if (!e.polylines) return;
    const o = e.polylines.rawVal;
    if (n < 0 || n >= o.length) return;
    const a = o.filter((w, x) => x !== n), t = /* @__PURE__ */ new Set();
    for (const w of a) for (const x of w) t.add(x);
    const s = e.points.rawVal, i = /* @__PURE__ */ new Map(), r = [];
    for (let w = 0; w < s.length; w++) t.has(w) && (i.set(w, r.length), r.push(s[w]));
    const m = a.map((w) => w.map((x) => i.get(x)).filter((x) => x !== void 0));
    e.points.val = r, e.polylines.val = m, e.areas && (e.areas.val = e.areas.rawVal.filter((w) => w !== n).map((w) => w > n ? w - 1 : w)), mt.visible = false, wt = -1, Nt = -1;
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
    const r = [...a.slice(0, n), ...i, ...a.slice(n + 1)], m = /* @__PURE__ */ new Set();
    for (const c of r) for (const F of c) m.add(F);
    const w = e.points.rawVal, x = /* @__PURE__ */ new Map(), k = [];
    for (let c = 0; c < w.length; c++) m.has(c) && (x.set(c, k.length), k.push(w[c]));
    const S = r.map((c) => c.map((F) => x.get(F)).filter((F) => F !== void 0));
    if (e.points.val = k, e.polylines.val = S, e.areas) {
      const c = i.length - 1;
      e.areas.val = e.areas.rawVal.map((F) => F > n ? F + c : F);
    }
    mt.visible = false, wt = -1, Nt = -1;
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
  };
  B.geometry.setAttribute("position", new St(e.points.rawVal.flat(), 3)), B.geometry.computeBoundingSphere(), B.frustumCulled = false, ie.frustumCulled = false, d.add(ie), H.position.set(0, 0, 0), H.rotateX(Math.PI / 2), H.geometry.rotateX(Math.PI / 2), H.updateMatrixWorld(), e.polylines && (e.polylines.val = [...e.polylines.rawVal, []]), window.__hekatanDrawAt = (n, o, a) => {
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
      const r = s.slice(0, i - 1).map((k) => n[k]).filter(Boolean);
      if (r.length < 5) continue;
      const m = [0, 1, 2].map((k) => r.reduce((S, c) => S + c[k], 0) / r.length), w = r.map((k) => Math.hypot(k[0] - m[0], k[1] - m[1], k[2] - m[2])), x = w.reduce((k, S) => k + S, 0) / w.length;
      x < 1e-9 || w.some((k) => Math.abs(k - x) > 5e-3 * x) || t.push({ c: m, r: x });
    }
    return Xo = t;
  };
  window.__hekatanCentrosDeducidos = Zo, window.__hekatanDrawCircle = (n, o, a, t, s = window.__hekatanArcSegs ?? 12, i = "xy") => {
    var _a3;
    const r = Math.max(4, Math.round(s)), m = e.points.rawVal.length, w = [];
    for (let x = 0; x < r; x++) {
      const k = 2 * Math.PI * x / r, S = t * Math.cos(k), c = t * Math.sin(k);
      let F;
      i === "xy" ? F = [n + S, o + c, a] : i === "xz" ? F = [n + S, o, a + c] : F = [n, o + S, a + c], w.push(F);
    }
    if (e.points.val = [...e.points.rawVal, ...w], Yn.push({ c: [n, o, a], r: t }), e.polylines) {
      const x = [...w.map((S, c) => m + c), m], k = e.polylines.rawVal;
      ((_a3 = k[k.length - 1]) == null ? void 0 : _a3.length) > 0 ? e.polylines.val = [...k, x, []] : e.polylines.val = [...k.slice(0, -1), x, []];
    }
  }, window.__hekatanDrawArc = (n, o, a, t = window.__hekatanArcSegs ?? 12) => {
    const s = Math.max(4, Math.round(t)), i = new E(...n), r = new E(...o), m = new E(...a), w = new E().subVectors(r, i), x = new E().subVectors(m, i), k = new E().crossVectors(w, x), S = 2 * k.lengthSq();
    let c;
    if (S < 1e-12) c = new E().addVectors(i, m).multiplyScalar(0.5);
    else {
      const Q = x.clone().multiplyScalar(w.lengthSq()).sub(w.clone().multiplyScalar(x.lengthSq())), re = new E().crossVectors(Q, k);
      c = i.clone().add(re.divideScalar(S));
    }
    const F = i.distanceTo(c), O = k.lengthSq() > 1e-12 ? k.clone().normalize() : new E(0, 1, 0), U = new E().subVectors(i, c).normalize(), f = new E().crossVectors(O, U).normalize(), p = (Q) => {
      const re = new E().subVectors(Q, c);
      return Math.atan2(re.dot(f), re.dot(U));
    }, _ = (Q) => {
      let re = Q;
      for (; re < 0; ) re += 2 * Math.PI;
      for (; re >= 2 * Math.PI; ) re -= 2 * Math.PI;
      return re;
    }, P = _(p(r)), X = _(p(m)), C = P <= X ? X : X - 2 * Math.PI, A = e.points.rawVal.length, q = [];
    for (let Q = 0; Q <= s; Q++) {
      const re = C * (Q / s), ke = U.clone().multiplyScalar(Math.cos(re)).add(f.clone().multiplyScalar(Math.sin(re))), Ke = c.clone().add(ke.multiplyScalar(F));
      q.push([Ke.x, Ke.y, Ke.z]);
    }
    if (e.points.val = [...e.points.rawVal, ...q], Yn.push({ c: [c.x, c.y, c.z], r: F }), e.polylines) {
      const Q = q.map((ke, Ke) => A + Ke), re = e.polylines.rawVal;
      e.polylines.val = [...re.slice(0, -1), Q, []];
    }
  }, window.__hekatanDrawSlabChaflan = (n, o, a = 1, t = 6, s = 6) => {
    const i = Math.min(n[0], o[0]), r = Math.max(n[0], o[0]), m = Math.min(n[1], o[1]), w = Math.max(n[1], o[1]), x = (n[2] + o[2]) / 2, k = r - i, S = w - m, c = Math.min(a, k / 2 - 0.01, S / 2 - 0.01);
    if (c <= 0) return;
    const F = e.points.rawVal.length, O = [], U = [], f = (p, _) => {
      O.push([p, _, x]), U.push(F + O.length - 1);
    };
    for (let p = 0; p <= s; p++) f(i + c + (k - 2 * c) * p / s, m);
    for (let p = 1; p <= t; p++) {
      const _ = -Math.PI / 2 + Math.PI / 2 * p / t;
      f(r - c + c * Math.cos(_), m + c + c * Math.sin(_));
    }
    for (let p = 1; p <= s; p++) f(r, m + c + (S - 2 * c) * p / s);
    for (let p = 1; p <= t; p++) {
      const _ = 0 + Math.PI / 2 * p / t;
      f(r - c + c * Math.cos(_), w - c + c * Math.sin(_));
    }
    for (let p = 1; p <= s; p++) f(r - c - (k - 2 * c) * p / s, w);
    for (let p = 1; p <= t; p++) {
      const _ = Math.PI / 2 + Math.PI / 2 * p / t;
      f(i + c + c * Math.cos(_), w - c + c * Math.sin(_));
    }
    for (let p = 1; p <= s; p++) f(i, w - c - (S - 2 * c) * p / s);
    for (let p = 1; p <= t; p++) {
      const _ = Math.PI + Math.PI / 2 * p / t;
      f(i + c + c * Math.cos(_), m + c + c * Math.sin(_));
    }
    if (U.push(F), e.points.val = [...e.points.rawVal, ...O], e.polylines) {
      const p = e.polylines.rawVal;
      e.polylines.val = [...p.slice(0, -1), U, []];
    }
  }, window.__hekatanDrawRect = (n, o) => {
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], r = o[0], m = o[1], w = o[2];
    let x;
    if (Math.abs(i - w) < 1e-6 ? x = [[t, s, i], [r, s, i], [r, m, i], [t, m, i]] : Math.abs(s - m) < 1e-6 ? x = [[t, s, i], [r, s, i], [r, s, w], [t, s, w]] : x = [[t, s, i], [t, m, i], [t, m, w], [t, s, w]], e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const k = [a, a + 1, a + 2, a + 3, a], S = e.polylines.rawVal;
      e.polylines.val = [...S.slice(0, -1), k, []];
    }
  }, window.__hekatanDrawRectArea = (n, o) => {
    var _a3;
    const a = e.points.rawVal.length, t = n[0], s = n[1], i = n[2], r = o[0], m = o[1], w = o[2];
    let x;
    if (D && e.gridTarget) {
      const k = e.gridTarget.rawVal, S = new En(...k.rotation), c = new E(1, 0, 0).applyEuler(S), F = new E(0, 1, 0).applyEuler(S), O = new E(...k.position), U = new E(t, s, i), f = new E(r, m, w), p = U.clone().sub(O).dot(c), _ = U.clone().sub(O).dot(F), P = f.clone().sub(O).dot(c), X = f.clone().sub(O).dot(F), C = (A, q) => O.clone().addScaledVector(c, A).addScaledVector(F, q).toArray();
      x = [C(p, _), C(P, _), C(P, X), C(p, X)];
    } else Math.abs(i - w) < 1e-6 ? x = [[t, s, i], [r, s, i], [r, m, i], [t, m, i]] : Math.abs(s - m) < 1e-6 ? x = [[t, s, i], [r, s, i], [r, s, w], [t, s, w]] : x = [[t, s, i], [t, m, i], [t, m, w], [t, s, w]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), e.points.val = [...e.points.rawVal, ...x], e.polylines) {
      const k = e.polylines.rawVal, S = k.length - 1, c = [a, a + 1, a + 2, a + 3, a];
      e.polylines.val = [...k.slice(0, -1), c, []], e.areas && (e.areas.val = [...e.areas.rawVal, S]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    g();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c;
    const n = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], o = e.points.rawVal, a = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), s = (f) => f.map((p) => Math.round(p * 1e4) / 1e4).join(",");
    for (let f = 0; f < o.length; f++) {
      const p = s(o[f]), _ = a.get(p);
      _ === void 0 && a.set(p, f), t.set(f, _ ?? f);
    }
    const i = n.map((f) => f.map((p) => t.get(p) ?? p)), r = /* @__PURE__ */ new Map(), m = (f, p) => {
      f !== p && ((r.get(f) ?? r.set(f, /* @__PURE__ */ new Set()).get(f)).add(p), (r.get(p) ?? r.set(p, /* @__PURE__ */ new Set()).get(p)).add(f));
    };
    for (const f of i) for (let p = 0; p + 1 < f.length; p++) m(f[p], f[p + 1]);
    const w = (f, p) => {
      var _a4;
      return !!((_a4 = r.get(f)) == null ? void 0 : _a4.has(p));
    }, x = /* @__PURE__ */ new Set(), k = [], S = [...r.keys()];
    for (const f of S) for (const p of r.get(f)) if (!(p < f)) {
      for (const _ of r.get(p)) if (_ !== f) for (const P of r.get(_)) {
        if (P === f || P === p || !w(P, f) || w(f, _) || w(p, P)) continue;
        const X = [f, p, _, P].slice().sort((C, A) => C - A).join("-");
        x.has(X) || (x.add(X), k.push([f, p, _, P]));
      }
    }
    for (const f of S) for (const p of r.get(f)) if (!(p < f)) for (const _ of r.get(p)) {
      if (_ === f || !w(_, f)) continue;
      const P = [f, p, _].slice().sort((X, C) => X - C).join("-");
      x.has(P) || (x.add(P), k.push([f, p, _]));
    }
    if (!k.length) return 0;
    const c = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []], F = new Set(c.map((f) => [...new Set(i[f] ?? [])].sort((p, _) => p - _).join("-"))), O = [...i];
    let U = 0;
    for (const f of k) {
      const p = f.slice().sort((_, P) => _ - P).join("-");
      F.has(p) || (F.add(p), O.push([...f, f[0]]), c.push(O.length - 1), U++);
    }
    if (U) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), e.polylines.val = O, e.areas && (e.areas.val = c);
      try {
        (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
      } catch {
      }
      g();
    }
    return U;
  }, window.__hekatanMeshPolyArea = (n, o) => {
    var _a3;
    const a = n.length;
    if (a < 3) return 0;
    let t = 0, s = 0, i = 0;
    for (let Se = 0; Se < a; Se++) {
      const Ie = n[Se], je = n[(Se + 1) % a];
      t += (Ie[1] - je[1]) * (Ie[2] + je[2]), s += (Ie[2] - je[2]) * (Ie[0] + je[0]), i += (Ie[0] - je[0]) * (Ie[1] + je[1]);
    }
    const r = Math.hypot(t, s, i) || 1;
    t /= r, s /= r, i /= r;
    let m = n[1][0] - n[0][0], w = n[1][1] - n[0][1], x = n[1][2] - n[0][2];
    const k = Math.hypot(m, w, x) || 1;
    m /= k, w /= k, x /= k;
    let S = s * x - i * w, c = i * m - t * x, F = t * w - s * m;
    const O = Math.hypot(S, c, F) || 1;
    S /= O, c /= O, F /= O;
    const U = n[0], f = (Se) => [(Se[0] - U[0]) * m + (Se[1] - U[1]) * w + (Se[2] - U[2]) * x, (Se[0] - U[0]) * S + (Se[1] - U[1]) * c + (Se[2] - U[2]) * F], p = (Se, Ie) => [U[0] + Se * m + Ie * S, U[1] + Se * w + Ie * c, U[2] + Se * x + Ie * F], _ = n.map(f);
    let P = 1 / 0, X = -1 / 0, C = 1 / 0, A = -1 / 0;
    for (const [Se, Ie] of _) Se < P && (P = Se), Se > X && (X = Se), Ie < C && (C = Ie), Ie > A && (A = Ie);
    const q = X - P, Q = A - C;
    if (q < 1e-6 || Q < 1e-6) return 0;
    let re = o && o > 0 ? o : 0.5;
    for (; q / re * (Q / re) > 2500; ) re *= 2;
    re = Math.min(re, Math.min(q, Q));
    const ke = (Se, Ie) => {
      let je = false;
      for (let Lt = 0, Bt = _.length - 1; Lt < _.length; Bt = Lt++) {
        const [It, on] = _[Lt], [_o, Wn] = _[Bt];
        on > Ie != Wn > Ie && Se < (_o - It) * (Ie - on) / (Wn - on) + It && (je = !je);
      }
      return je;
    }, Ke = Math.max(1, Math.round(q / re)), Re = Math.max(1, Math.round(Q / re)), st = q / Ke, nt = Q / Re, lt = /* @__PURE__ */ new Map(), Oe = [], $e = e.points.rawVal.length, ot = (Se, Ie) => {
      const je = Se + "," + Ie, Lt = lt.get(je);
      if (Lt !== void 0) return Lt;
      const Bt = $e + Oe.length;
      return Oe.push(p(P + Se * st, C + Ie * nt)), lt.set(je, Bt), Bt;
    }, Ye = [];
    for (let Se = 0; Se < Ke; Se++) for (let Ie = 0; Ie < Re; Ie++) {
      if (!ke(P + (Se + 0.5) * st, C + (Ie + 0.5) * nt)) continue;
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
    if (ge.length < 3) return ge = [], J.visible = false, g(), 0;
    const n = window.__hekatanMeshPolyArea(ge.slice());
    return ge = [], J.visible = false, g(), n;
  };
  window.__hekatanFinalizePolyArea = lo, window.__hekatanSetInclinedPlaneFrom3 = (n, o, a) => {
    var _a3;
    const t = new E(n[0], n[1], n[2]), s = new E(o[0], o[1], o[2]), i = new E(a[0], a[1], a[2]), r = new E().subVectors(s, t).cross(new E().subVectors(i, t));
    if (r.lengthSq() < 1e-9) return false;
    r.normalize();
    const m = new zo().setFromUnitVectors(new E(0, 0, 1), r), w = new En().setFromQuaternion(m);
    e.gridTarget && (e.gridTarget.val = { position: [t.x, t.y, t.z], rotation: [w.x, w.y, w.z] }), D = true;
    const x = new E().addVectors(t, s).add(i).multiplyScalar(1 / 3), k = Math.max(t.distanceTo(s), t.distanceTo(i), s.distanceTo(i)) * 2.2 + 4, S = k / 2;
    L.geometry.dispose(), L.geometry = new ln(k, k), j.geometry.dispose(), j.geometry = new hs(new ln(k, k)), ee(S, 1), ue.position.copy(x), ue.quaternion.copy(m), ue.scale.set(1, 1, 1), ue.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return g(), true;
  }, window.__hekatanResetPlaneXY = () => {
    e.gridTarget && (e.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), D = false, ue.visible = false, g();
  };
  const Wt = new rt();
  Wt.visible = false, d.add(Wt), window.__hekatanShowAxes = (n, o, a = 12, t = 2) => {
    var _a3, _b;
    for (; Wt.children.length; ) {
      const k = Wt.children.pop();
      (_a3 = k.geometry) == null ? void 0 : _a3.dispose(), (_b = k.material) == null ? void 0 : _b.dispose();
    }
    if (!n.length || !o.length) return;
    const s = Math.min(...o) - t, i = Math.max(...o) + t, r = Math.min(...n) - t, m = Math.max(...n) + t, w = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", x = (k, S, c, F, O) => {
      const U = document.createElement("canvas");
      U.width = 64, U.height = 32;
      const f = U.getContext("2d");
      f.fillStyle = O, f.font = "bold 22px sans-serif", f.textAlign = "center", f.fillText(k, 32, 26);
      const p = new ms(U), _ = new ws({ map: p, transparent: true }), P = new ys(_);
      return P.position.set(S, c, F), P.scale.set(1.2, 0.6, 1), P;
    };
    n.forEach((k, S) => {
      const c = S < w.length ? w[S] : `X${S}`, F = new Fe().setFromPoints([new E(k, s, 0), new E(k, i, 0), new E(k, s, 0), new E(k, s, a)]), O = new An({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), U = new jt(F, O);
      U.computeLineDistances(), Wt.add(U), Wt.add(x(c, k, s - 0.5, 0, "#60a5fa")), Wt.add(x(c, k, i + 0.5, 0, "#60a5fa"));
    }), o.forEach((k, S) => {
      const c = `${S + 1}`, F = new Fe().setFromPoints([new E(r, k, 0), new E(m, k, 0), new E(r, k, 0), new E(r, k, a)]), O = new An({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), U = new jt(F, O);
      U.computeLineDistances(), Wt.add(U), Wt.add(x(c, r - 0.5, k, 0, "#fb7185")), Wt.add(x(c, m + 0.5, k, 0, "#fb7185"));
    }), Wt.visible = true, g();
  }, window.__hekatanHideAxes = () => {
    Wt.visible = false, g();
  };
  const nn = new rt();
  nn.visible = false, d.add(nn);
  let mn = [];
  window.__hekatanShowRefPlanes = (n = [0, 3, 6, 9, 12], o = 20, a = 0, t = 0) => {
    var _a3, _b;
    for (; nn.children.length; ) {
      const i = nn.children.pop();
      (_a3 = i.geometry) == null ? void 0 : _a3.dispose(), (_b = i.material) == null ? void 0 : _b.dispose();
    }
    mn.forEach((i) => {
      d.remove(i), i.geometry.dispose(), i.material.dispose();
    }), mn = [];
    const s = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    n.forEach((i, r) => {
      const m = s[r % s.length], w = o / 2, x = [new E(a - w, t - w, i), new E(a + w, t - w, i), new E(a + w, t + w, i), new E(a - w, t + w, i), new E(a - w, t - w, i)], k = new Fe().setFromPoints(x), S = new yt({ color: m, transparent: true, opacity: 0.55 });
      nn.add(new zt(k, S));
      const c = document.createElement("canvas");
      c.width = 128, c.height = 32;
      const F = c.getContext("2d");
      F.fillStyle = `#${m.toString(16).padStart(6, "0")}`, F.font = "bold 18px sans-serif", F.fillText(`Z = ${i} m`, 4, 22);
      const O = new ms(c), U = new ws({ map: O, transparent: true }), f = new ys(U);
      f.position.set(a - w - 1.5, t - w - 1.5, i), f.scale.set(2.5, 0.6, 1), nn.add(f);
      const p = new ln(1e4, 1e4), _ = new ut({ visible: false, side: Ft }), P = new it(p, _);
      P.position.set(0, 0, i), P.frustumCulled = false, P.userData = { refPlaneZ: i }, d.add(P), mn.push(P);
    }), nn.visible = true, g();
  }, window.__hekatanHideRefPlanes = () => {
    nn.visible = false, mn.forEach((n) => {
      n.visible = false;
    }), g();
  };
  const _n = new rt();
  _n.frustumCulled = false, d.add(_n);
  const Rs = () => {
    var _a3, _b, _c, _d;
    for (; _n.children.length; ) {
      const a = _n.children.pop();
      (_b = (_a3 = a.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = a.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const n = window.__hekatanDrawingAuxLines, o = (n == null ? void 0 : n.rawVal) ?? (n == null ? void 0 : n.val) ?? n ?? [];
    for (const a of o) {
      if (a.length !== 6) continue;
      const t = new Fe().setFromPoints([new E(a[0], a[1], a[2]), new E(a[3], a[4], a[5])]), s = new An({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), i = new zt(t, s);
      i.computeLineDistances(), _n.add(i);
    }
  };
  te.derive(() => {
    const n = window.__hekatanDrawingAuxLines;
    (n == null ? void 0 : n.val) && (n.val, Rs(), g());
  });
  const wn = new rt();
  wn.frustumCulled = false, d.add(wn);
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
  }), h.addEventListener("change", () => {
    wn.children.forEach((n) => {
      n.scale.setScalar(fn(n.position));
    });
  }), window.__hekatanRenderAuxPoints = Uo;
  const gt = new rt(), Ds = new it(new bn(0.01, 12, 12), new ut({ color: 16724804, transparent: true, opacity: 0.95 })), Bs = new it(new bn(0.015, 12, 12), new ut({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  gt.add(Ds, Bs);
  const yn = 0.08, ro = (n, o, a) => {
    const t = new Fe().setFromPoints([new E(...n), new E(...o)]);
    return new zt(t, new yt({ color: a, transparent: true, opacity: 0.7 }));
  };
  gt.add(ro([-yn, 0, 0], [yn, 0, 0], 16711680)), gt.add(ro([0, -yn, 0], [0, yn, 0], 65280)), gt.add(ro([0, 0, -yn], [0, 0, yn], 35071)), gt.visible = false, gt.frustumCulled = false, d.add(gt);
  let co = 2;
  const Zn = (n) => {
    const o = u(), a = (b == null ? void 0 : b.clientHeight) || 700;
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
  window.__hekatanUpdateSelectionPtScale = qo, h.addEventListener("change", () => {
    var _a3;
    kn(), Vt.visible && In(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), qo();
  }), window.__hekatanShowSnap = (n, o, a) => {
    gt.position.set(n, o, a), gt.visible = true, kn(), g();
  }, window.__hekatanHideSnap = () => {
    gt.visible = false, g();
  }, b.addEventListener("pointermove", (n) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r, _s2, _t2, _u, _v, _w, _x;
    window.__hekatanCursorPx = { x: n.clientX, y: n.clientY };
    const o = M(n);
    if (!o) return;
    z.setFromCamera(V, o);
    const a = oe();
    if ((!a.length || ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) !== "fillarea") && et.visible && (et.visible = false), a.length) {
      const t = a[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const c = vt([t.x, t.y, t.z]);
        if (c) {
          const F = c.map((f) => e.points.rawVal[f]), O = [];
          for (let f = 1; f < F.length - 1; f++) O.push(F[0][0], F[0][1], F[0][2], F[f][0], F[f][1], F[f][2], F[f + 1][0], F[f + 1][1], F[f + 1][2]);
          const U = et.geometry;
          U.setAttribute("position", new St(O, 3)), U.computeVertexNormals(), et.visible = true;
        } else et.visible = false;
      } else et.visible && (et.visible = false);
      const s = n.altKey, i = po(t), r = s ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, t.x, t.y, t.z, i, { x: n.clientX, y: n.clientY });
      if (r) Jo(r.type, r.x, r.y, r.z), gt.position.set(r.x, r.y, r.z), gt.visible = true, t.set(r.x, r.y, r.z), Oo(r.type, n.clientX, n.clientY);
      else {
        Zs(), Kn();
        const S = !s && window.__hekatanSnapEnabled !== false, c = window.__hekatanSnap2D ?? 0.5;
        S && c > 0 && (t.x = Math.round(t.x / c) * c, t.y = Math.round(t.y / c) * c, t.z = Math.round(t.z / c) * c), gt.position.copy(t), gt.visible = true;
      }
      kn();
      const m = ((_j = (_i = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h)) == null ? void 0 : _j.tool) ?? "select";
      if (m === "select" || !m) {
        const S = (window.__hekatanSnap2D ?? 0.5) * 1.5, c = Rn(t.x, t.y, t.z, S), F = Mn(t.x, t.y, t.z, S), O = Dn(t.x, t.y, t.z, S);
        if (c >= 0) {
          const _ = e.points.rawVal[c];
          Vt.position.set(_[0], _[1], _[2]), Vt.visible = true, In(), Xt.visible = false, Ht = { kind: "pt", a: c };
        } else if (F) {
          const _ = e.points.rawVal, P = e.polylines.rawVal[F.polyIdx], X = _[P[F.segIdx]], C = _[P[F.segIdx + 1]];
          Xt.geometry.setFromPoints([new E(X[0], X[1], X[2]), new E(C[0], C[1], C[2])]), Xt.visible = true, Vt.visible = false, Ht = ((_l = (_k = e.areas) == null ? void 0 : _k.rawVal) == null ? void 0 : _l.includes(F.polyIdx)) ?? false ? { kind: "poly", a: F.polyIdx } : { kind: "seg", a: F.polyIdx, b: F.segIdx };
        } else if (O >= 0) {
          const P = (((_m = window.__hekatanDrawingAuxLines) == null ? void 0 : _m.rawVal) ?? [])[O];
          P && (Xt.geometry.setFromPoints([new E(P[0], P[1], P[2]), new E(P[3], P[4], P[5])]), Xt.visible = true, Vt.visible = false, Ht = { kind: "aux", a: O });
        } else Xt.visible = false, Vt.visible = false, Ht = null;
        ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
        let U = t;
        if ((Ht == null ? void 0 : Ht.kind) === "pt") {
          const _ = e.points.rawVal[Ht.a];
          _ && (U = new E(_[0], _[1], _[2]));
        }
        const f = `X=${U.x.toFixed(2)} Y=${U.y.toFixed(2)} Z=${U.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [U.x, U.y, U.z], Ht) {
          const _ = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          ae.textContent = `${f}  \xB7  \u{1F5B1} Click \u2192 ${_[Ht.kind]}`;
        } else ae.textContent = f;
        const p = document.getElementById("hk-coord-fixed");
        p && (p.textContent = f), Pt = { p: U.clone(), x: n.clientX, y: n.clientY }, fe.visible = false, we.visible = false, Ue.visible = false, g();
        return;
      }
      if (m === "delete" || m === "trim" || m === "extend" || m === "offset") {
        const S = (window.__hekatanSnap2D ?? 0.5) * 1.5, c = Mn(t.x, t.y, t.z, S), F = Dn(t.x, t.y, t.z, S);
        let O = false;
        if (F >= 0) if (!c) O = true;
        else {
          const _ = window.__hekatanDrawingAuxLines, X = ((_ == null ? void 0 : _.rawVal) ?? (_ == null ? void 0 : _.val) ?? _ ?? [])[F];
          sn(t.x, t.y, t.z, X[0], X[1], X[2], X[3], X[4], X[5]) < c.dist && (O = true);
        }
        O ? (Qt = F, wt = -1, Nt = -1, Bn(F)) : c ? (wt = c.polyIdx, Nt = c.segIdx, Qt = -1, Nn(c.polyIdx, c.segIdx)) : (wt = -1, Nt = -1, Qt = -1, mt.visible = false), fe.visible = false, we.visible = false, Ue.visible = false, R(), ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
        const U = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        let f = "";
        O ? f = `\u{1F5D1} l\xEDnea aux #${Qt + 1}` : c ? f = ((_o = (_n2 = e.areas) == null ? void 0 : _n2.rawVal) == null ? void 0 : _o.includes(c.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${c.polyIdx + 1}` : `\u{1F5D1} seg ${c.segIdx + 1} / poly #${c.polyIdx + 1}` : f = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", ae.textContent = `${U}  \xB7  ${f}`;
        const p = document.getElementById("hk-coord-fixed");
        p && (p.textContent = U), g();
        return;
      } else mt.visible = false, wt = -1, Qt = -1;
      ae.style.left = n.clientX + "px", ae.style.top = n.clientY + "px", ae.style.display = "block";
      const w = ((_p = e.polylines) == null ? void 0 : _p.rawVal) ?? [], x = w[w.length - 1] ?? [], k = e.points.rawVal ?? [];
      if (x.length > 0 && k[x[x.length - 1]]) {
        const S = x[x.length - 1], c = k[S];
        let F = Ne;
        if (dt = null, !F && window.__hekatanAxisSnap !== false) {
          const Re = b.getBoundingClientRect(), st = n.clientX, nt = n.clientY, lt = ((_q = settings.gridSize) == null ? void 0 : _q.rawVal) ?? 10, Oe = new E(c[0], c[1], c[2]), $e = [["x", new E(1, 0, 0)], ["y", new E(0, 1, 0)], ["z", new E(0, 0, 1)]], ot = (Se) => {
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
              const ko = z.ray, cs = Oe.clone().sub(ko.origin), So = Ie.dot(ko.direction), ds = Ie.dot(cs), Qs = ko.direction.dot(cs), ps = 1 - So * So, js = Math.abs(ps) < 1e-6 ? -ds : (So * Qs - ds) / ps;
              Ye = { axis: Se, dpx: rs, pt: Oe.clone().addScaledVector(Ie, js) };
            }
          }
          Ye && Ye.dpx <= 12 && (t.copy(Ye.pt), F = Ye.axis, dt = Ye.pt.clone());
        }
        const O = !!window.__hekatanOrthoMode;
        if (!F && O) {
          const Re = Math.abs(t.x - c[0]), st = Math.abs(t.y - c[1]), nt = Math.abs(t.z - c[2]), lt = (_r = a[0]) == null ? void 0 : _r.object;
          let Oe = null;
          lt === at ? Oe = "xy" : lt === ht ? Oe = "xz" : lt === Be && (Oe = "yz"), Oe === "xy" ? F = Re >= st ? "x" : "y" : Oe === "xz" ? F = Re >= nt ? "x" : "z" : Oe === "yz" ? F = st >= nt ? "y" : "z" : F = Re >= st && Re >= nt ? "x" : st >= nt ? "y" : "z";
        }
        const U = window.__hekatanPolarTrack !== false;
        if (!F && U) {
          const Re = t.x - c[0], st = t.y - c[1], nt = t.z - c[2], lt = Math.hypot(Re, st, nt);
          if (lt > 1e-3) {
            const $e = Math.tan(6 * Math.PI / 180) * lt, ot = Math.hypot(st, nt), Ye = Math.hypot(Re, nt), Se = Math.hypot(Re, st), Ie = [["x", ot], ["y", Ye], ["z", Se]];
            Ie.sort((je, Lt) => je[1] - Lt[1]), Ie[0][1] <= $e && (F = Ie[0][0]);
          }
        }
        if (F) {
          const Re = c[0], st = c[1], nt = c[2];
          F === "x" ? t.set(t.x, st, nt) : F === "y" ? t.set(Re, t.y, nt) : t.set(Re, st, t.z);
          const lt = !!Ne, $e = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[F];
          Ve.style.background = "rgba(15,23,42,0.92)", Ve.style.color = $e, Ve.style.border = `1.5px solid ${$e}`;
          const ot = (_s2 = a[0]) == null ? void 0 : _s2.object;
          let Ye = null;
          ot === at ? Ye = "xy" : ot === ht ? Ye = "xz" : ot === Be && (Ye = "yz");
          const Se = Ye ? ` (plano ${Ye.toUpperCase()})` : "";
          Ve.textContent = lt ? `\u{1F512} LOCK ${F.toUpperCase()}${Se}` : `\u22A5 ORTO ${F.toUpperCase()}${Se}`, Ve.style.left = n.clientX + 20 + "px", Ve.style.top = n.clientY + 18 + "px", Ve.style.transform = "none", Ve.style.display = "block";
        } else Ne || (Ve.style.display = "none");
        let f = null;
        if (!s && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const Re = e.points.rawVal, st = F ? [F] : ["z", "x", "y"], nt = { x: n.clientX, y: n.clientY };
          let lt = 1 / 0;
          for (const Oe of Re) if (!(Math.abs(Oe[0] - c[0]) < 1e-9 && Math.abs(Oe[1] - c[1]) < 1e-9 && Math.abs(Oe[2] - c[2]) < 1e-9)) for (const $e of st) {
            const ot = new E($e === "x" ? Oe[0] : t.x, $e === "y" ? Oe[1] : t.y, $e === "z" ? Oe[2] : t.z), Ye = wo(ot.x, ot.y, ot.z);
            if (!Ye) continue;
            const Se = Math.hypot(Ye.x - nt.x, Ye.y - nt.y);
            Se < Sn && Se < lt && (lt = Se, f = { q: Oe, eje: $e });
          }
        }
        f ? (f.eje === "x" ? t.x = f.q[0] : f.eje === "y" ? t.y = f.q[1] : t.z = f.q[2], Ue.geometry.setFromPoints([new E(f.q[0], f.q[1], f.q[2]), new E(t.x, t.y, t.z)]), (_t2 = Ue.computeLineDistances) == null ? void 0 : _t2.call(Ue), Ue.visible = true, gt.position.set(t.x, t.y, t.z), gt.visible = true, Oo("track", n.clientX, n.clientY)) : Ue.visible = false, Pt = { p: t.clone(), x: n.clientX, y: n.clientY };
        const p = Math.hypot(t.x - c[0], t.y - c[1], t.z - c[2]), _ = Math.atan2(t.y - c[1], t.x - c[0]) * 180 / Math.PI, P = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        ae.textContent = `${P} | \u0394L=${p.toFixed(2)}m ${_.toFixed(0)}\xB0`;
        const X = document.getElementById("hk-coord-fixed");
        X && (X.textContent = P), fe.geometry.setFromPoints([new E(c[0], c[1], c[2]), new E(t.x, t.y, t.z)]), (_u = fe.computeLineDistances) == null ? void 0 : _u.call(fe), fe.visible = true, K(c[0], c[1], c[2], t.x, t.y, t.z);
        const C = window.__hekatanOrthoExt ?? 8, A = window.__hekatanShowOrthoPlanes !== false;
        ct.visible = A, A || Je(null), A && (Ce(We, c, "xy", C), Ce(Me, c, "xz", C), Ce(Ee, c, "yz", C), Le(at, c, "xy", C), Le(ht, c, "xz", C), Le(Be, c, "yz", C));
        const q = A ? z.intersectObjects([at, ht, Be], false) : [];
        let Q = null;
        if (q.length > 0) {
          const Re = q[0].object;
          Re === at ? Q = "xy" : Re === ht ? Q = "xz" : Re === Be && (Q = "yz");
        }
        Je(Q), Q && (ze.style.left = n.clientX + "px", ze.style.top = n.clientY + "px"), ye.geometry.setFromPoints([new E(c[0] - C, c[1], c[2]), new E(c[0] + C, c[1], c[2])]), (_v = ye.computeLineDistances) == null ? void 0 : _v.call(ye), Ae.geometry.setFromPoints([new E(c[0], c[1] - C, c[2]), new E(c[0], c[1] + C, c[2])]), (_w = Ae.computeLineDistances) == null ? void 0 : _w.call(Ae), Te.geometry.setFromPoints([new E(c[0], c[1], c[2] - C), new E(c[0], c[1], c[2] + C)]), (_x = Te.computeLineDistances) == null ? void 0 : _x.call(Te), we.visible = true;
        const re = ye.material, ke = Ae.material, Ke = Te.material;
        F === "x" ? (re.opacity = 0.95, ke.opacity = 0.1, Ke.opacity = 0.1) : F === "y" ? (re.opacity = 0.1, ke.opacity = 0.95, Ke.opacity = 0.1) : F === "z" ? (re.opacity = 0.1, ke.opacity = 0.1, Ke.opacity = 0.95) : (re.opacity = 0.5, ke.opacity = 0.5, Ke.opacity = 0.5);
      } else {
        const S = `X=${t.x.toFixed(2)} Y=${t.y.toFixed(2)} Z=${t.z.toFixed(2)}`;
        ae.textContent = S;
        const c = document.getElementById("hk-coord-fixed");
        if (c && (c.textContent = S), fe.visible = false, we.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has(m)) {
          if (I = null, G = null, N.style.left = n.clientX + 20 + "px", N.style.top = n.clientY - 28 + "px", N.style.display = "block", !Y) {
            N.value = `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}`;
            const O = document.activeElement;
            !(O && (O.tagName === "INPUT" || O.tagName === "TEXTAREA") && O !== N) && document.activeElement !== N && N.focus({ preventScroll: true });
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
    const n = new zo().setFromEuler(new En(...e.gridTarget.val.rotation)), o = new zo().setFromAxisAngle(new E(1, 0, 0), Math.PI / 2);
    Xa(l, { position: new E(...e.gridTarget.val.position), quaternion: n.clone().multiply(o) }, g);
    {
      const t = e.gridTarget.val.position[2], s = Math.abs(n.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const i of He) d.remove(i), Qe(i);
      if (He.length = 0, s) {
        const i = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [], r = /* @__PURE__ */ new Set([0]);
        for (const w of i) r.add(+w[2].toFixed(3));
        for (const w of window.__hekatanLevels ?? []) isFinite(w == null ? void 0 : w.z) && r.add(+w.z.toFixed(3));
        const m = [...r].sort((w, x) => w - x).slice(0, 24);
        for (const w of m) {
          if (Math.abs(w - t) < 1e-6) continue;
          const x = l.clone(true);
          x.name = `hekatan-grid-nivel-${w}`, x.traverse((k) => {
            k.material && (k.material = k.material.clone(), k.material.transparent = true, k.material.opacity = (k.material.opacity ?? 1) * (Math.abs(w) < 1e-6 ? 0.5 : 0.22));
          }), x.position.set(0, 0, w), x.quaternion.copy(o), d.add(x), He.push(x);
        }
      }
    }
    H.position.set(...e.gridTarget.val.position), H.quaternion.setFromEuler(new En(...e.gridTarget.val.rotation)), H.updateMatrixWorld();
    const a = new E(0, 0, 1).applyEuler(new En(...e.gridTarget.val.rotation));
    D = !(Math.abs(a.x) > 0.999 || Math.abs(a.y) > 0.999 || Math.abs(a.z) > 0.999);
  }), te.derive(() => {
    B.geometry.setAttribute("position", new St(e.points.val.flat(), 3)), B.geometry.computeBoundingSphere();
  }), te.derive(() => {
    const n = 0.05 * y * 0.5 * v.val;
    z.params.Points.threshold = 0.4 * n;
  }), te.derive(() => {
    var _a3;
    const n = e.points.val ?? [], a = (((_a3 = e.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], t = [];
    for (const i of a) {
      const [r, m, w] = n[i];
      t.push(r, m, w);
    }
    const s = new Fe();
    s.setAttribute("position", new St(t, 3)), le.geometry.dispose(), le.geometry = s;
  });
  let uo = false, cn = 0;
  b.addEventListener("pointerdown", () => {
    uo = true;
  }), b.addEventListener("pointerup", () => {
    uo = false;
  }), b.addEventListener("pointermove", () => {
    uo && cn++;
  });
  const $t = document.createElement("div");
  $t.id = "hk-window-select", $t.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild($t);
  let Jt = null, Pn = false, Zt = null;
  const fo = (n, o, a, t, s) => {
    s ? ($t.style.borderColor = "#34d399", $t.style.borderStyle = "dashed", $t.style.background = "rgba(52, 211, 153, 0.10)") : ($t.style.borderColor = "#22d3ee", $t.style.borderStyle = "solid", $t.style.background = "rgba(34, 211, 238, 0.10)"), $t.style.left = Math.min(n, a) + "px", $t.style.top = Math.min(o, t) + "px", $t.style.width = Math.abs(a - n) + "px", $t.style.height = Math.abs(t - o) + "px", $t.style.display = "block";
  }, Ko = (n, o, a, t, s) => {
    var _a3, _b, _c, _d;
    const i = Math.min(n, a), r = Math.max(n, a), m = Math.min(o, t), w = Math.max(o, t), x = a < n, k = b.getBoundingClientRect(), S = u();
    S.updateMatrixWorld();
    const c = (A) => {
      const q = new E(A[0], A[1], A[2]);
      return q.project(S), { x: k.left + (q.x * 0.5 + 0.5) * k.width, y: k.top + (-q.y * 0.5 + 0.5) * k.height };
    }, F = (A) => A.x >= i && A.x <= r && A.y >= m && A.y <= w, O = (A, q) => !(A.x < i && q.x < i || A.x > r && q.x > r || A.y < m && q.y < m || A.y > w && q.y > w);
    s || Xe.clear();
    let U = 0;
    const f = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let A = 0; A < f.length; A++) {
      const q = f[A];
      q && F(c(q)) && (Xe.add(`pt:${A}`), U++);
    }
    const p = (A, q) => x ? F(A) || F(q) || O(A, q) : F(A) && F(q), _ = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], P = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [];
    for (let A = 0; A < _.length; A++) {
      const q = _[A];
      if (P.includes(A)) {
        let re;
        if (!x) re = q.every((ke) => {
          const Ke = f[ke];
          return !!Ke && F(c(Ke));
        });
        else {
          re = false;
          for (let ke = 0; ke < q.length - 1; ke++) {
            const Ke = f[q[ke]], Re = f[q[ke + 1]];
            if (!(!Ke || !Re) && p(c(Ke), c(Re))) {
              re = true;
              break;
            }
          }
        }
        re && (Xe.add(`poly:${A}`), U++);
      } else for (let re = 0; re < q.length - 1; re++) {
        const ke = f[q[re]], Ke = f[q[re + 1]];
        !ke || !Ke || p(c(ke), c(Ke)) && (Xe.add(`seg:${A}:${re}`), U++);
      }
    }
    const C = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let A = 0; A < C.length; A++) {
      const q = C[A];
      if (!q || q.length !== 6) continue;
      const Q = c([q[0], q[1], q[2]]), re = c([q[3], q[4], q[5]]);
      p(Q, re) && (Xe.add(`aux:${A}`), U++);
    }
    Yt(), de(U === 0 && !x ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${x ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${U} item(s) ${s ? "agregados a" : "\u2192"} selecci\xF3n (total ${Xe.size})`), $t.style.display = "none";
  }, Un = () => {
    Zt && (Zt = null, $t.style.display = "none", de("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = Un, window.addEventListener("keydown", (n) => {
    n.key === "Escape" && Zt && Un();
  });
  const Go = () => {
    var _a3, _b, _c, _d;
    if (Xe.size === 0) return false;
    const n = [...Xe], o = ((_a3 = e.points) == null ? void 0 : _a3.rawVal) ?? [], a = ((_b = e.polylines) == null ? void 0 : _b.rawVal) ?? [], t = ((_c = e.areas) == null ? void 0 : _c.rawVal) ?? [], s = window.__hekatanDrawingAuxLines, i = (s == null ? void 0 : s.rawVal) ?? [], r = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
    for (const O of n) {
      const [U, ...f] = O.split(":");
      if (U === "pt") r.add(+f[0]);
      else if (U === "poly") m.add(+f[0]);
      else if (U === "seg") {
        const p = +f[0], _ = +f[1];
        w.has(p) || w.set(p, /* @__PURE__ */ new Set()), w.get(p).add(_);
      } else U === "aux" && x.add(+f[0]);
    }
    let k = 0, S = [], c = [];
    const F = /* @__PURE__ */ new Map();
    for (let O = 0; O < a.length; O++) {
      if (m.has(O)) {
        k++;
        continue;
      }
      F.set(O, S.length);
      const U = w.get(O);
      if (U && U.size > 0) {
        let f = [];
        for (let p = 0; p < a[O].length; p++) f.push(a[O][p]), p < a[O].length - 1 && U.has(p) && (f.length >= 2 && S.push(f), f = [], k++);
        (f.length >= 2 || f.length === 1) && S.push(f);
      } else S.push([...a[O]]);
    }
    if (r.size > 0) {
      const O = [], U = /* @__PURE__ */ new Map();
      for (let p = 0; p < o.length; p++) {
        if (r.has(p)) {
          k++;
          continue;
        }
        U.set(p, O.length), O.push([...o[p]]);
      }
      const f = [];
      for (const p of S) {
        let _ = [];
        for (const P of p) {
          const X = U.get(P);
          X === void 0 ? (_.length >= 2 && f.push(_), _ = []) : _.push(X);
        }
        _.length >= 2 && f.push(_);
      }
      S = f, e.points.val = O;
    }
    for (const O of t) {
      const U = F.get(O);
      U !== void 0 && U < S.length && c.push(U);
    }
    if (e.polylines && (e.polylines.val = S), e.areas && (e.areas.val = c), x.size > 0 && s) {
      const O = i.filter((U, f) => !x.has(f));
      "val" in s ? s.val = O : window.__hekatanDrawingAuxLines = O, k += x.size;
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
    n.addEventListener("mousedown", (r) => {
      o = true, a = r.clientX, t = r.clientY;
      const m = Rt.getBoundingClientRect();
      s = m.left, i = m.top, Rt.style.transform = "none", Rt.style.left = `${s}px`, Rt.style.top = `${i}px`, r.preventDefault();
    }), window.addEventListener("mousemove", (r) => {
      if (!o) return;
      const m = r.clientX - a, w = r.clientY - t, x = Math.max(0, Math.min(window.innerWidth - 80, s + m)), k = Math.max(0, Math.min(window.innerHeight - 40, i + w));
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
    const n = [...Xe], o = n.filter((S) => S.startsWith("pt:")), a = n.filter((S) => S.startsWith("seg:")), t = n.filter((S) => S.startsWith("poly:")), s = n.filter((S) => S.startsWith("aux:")), i = o.length > 0, r = a.length > 0, m = t.length > 0, w = !i && !r && !m, x = [];
    o.length && x.push(`\u{1F535} ${o.length} nodo(s)`), a.length && x.push(`\u{1F4CF} ${a.length} segmento(s)`), t.length && x.push(`\u25AD ${t.length} \xE1rea(s)`), s.length && x.push(`\u250A ${s.length} aux`);
    const k = `\u{1F3AF} ${Xe.size} item(s) \u2014 ${x.join(", ")}`;
    pt = new Fs({ container: Rt, title: k });
    {
      const S = pt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      S.addBinding(Tt, "dx", { label: "\u0394x (m)", step: 0.1 }), S.addBinding(Tt, "dy", { label: "\u0394y (m)", step: 0.1 }), S.addBinding(Tt, "dz", { label: "\u0394z (m)", step: 0.1 }), S.addBinding(Tt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), S.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a3;
        const U = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, Tt.dx, Tt.dy, Tt.dz, Tt.copias);
        de(U ? `\u29C9 Replicado \xD7${U} (\u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      });
      const c = { vuelo: 1.5, losa: true, borde: true, ambos: true }, F = S.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      F.addBinding(c, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), F.addBinding(c, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), F.addBinding(c, "borde", { label: "con viga de borde" }), F.addBinding(c, "ambos", { label: "a los dos lados" }), F.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a3;
        const U = (_a3 = window.__hekatanVoladoSelection) == null ? void 0 : _a3.call(window, c.vuelo, { losa: c.losa, vigaBorde: c.borde, lados: c.ambos ? "ambos" : "afuera" });
        de(U ? `\u2310 Volado de ${c.vuelo} m en ${U} pa\xF1o(s)` + (c.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), S.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a3;
        const U = (_a3 = window.__hekatanReplicateSelection) == null ? void 0 : _a3.call(window, Tt.dx, Tt.dy, Tt.dz, 1);
        de(U ? `\u2192 Copia desplazada \u0394 ${Tt.dx},${Tt.dy},${Tt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const O = S.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      O.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a3;
        return (_a3 = window.__hekatanToggleSnap) == null ? void 0 : _a3.call(window);
      }), O.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), de(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (i) {
      const S = pt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${o.length} nodo(s)` });
      S.addBinding(ce, "Ux"), S.addBinding(ce, "Uy"), S.addBinding(ce, "Uz"), S.addBinding(ce, "Rx"), S.addBinding(ce, "Ry"), S.addBinding(ce, "Rz");
      const c = pt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      c.addBinding(ce, "Kx", { label: "Kx", min: 0, step: 100 }), c.addBinding(ce, "Ky", { label: "Ky", min: 0, step: 100 }), c.addBinding(ce, "Kz", { label: "Kz", min: 0, step: 100 }), c.addBinding(ce, "Krx", { label: "Krx", min: 0, step: 1e3 }), c.addBinding(ce, "Kry", { label: "Kry", min: 0, step: 1e3 }), c.addBinding(ce, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const F = pt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      F.addBinding(ce, "Fx", { step: 0.1 }), F.addBinding(ce, "Fy", { step: 0.1 }), F.addBinding(ce, "Fz", { step: 0.1 }), F.addBinding(ce, "Mx", { step: 0.1 }), F.addBinding(ce, "My", { step: 0.1 }), F.addBinding(ce, "Mz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(ce, "mass", { label: "m", min: 0, step: 1 }), pt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(ce, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), pt.addButton({ title: `\u2713 Aplicar a ${o.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let f = 0;
        const p = [ce.Ux, ce.Uy, ce.Uz, ce.Rx, ce.Ry, ce.Rz];
        p.some((X) => X) && (Ct("nodes", o, "supports", p), f++);
        const _ = [ce.Fx, ce.Fy, ce.Fz, ce.Mx, ce.My, ce.Mz];
        _.some((X) => X !== 0) && (Ct("nodes", o, "loads", _), f++);
        const P = [ce.Kx, ce.Ky, ce.Kz, ce.Krx, ce.Kry, ce.Krz];
        if (P.some((X) => X !== 0) && (Ct("nodes", o, "springs", P), f++), ce.mass !== 0 && (Ct("nodes", o, "mass", ce.mass), f++), ce.diaphragm !== "Ninguno" && (Ct("nodes", o, "diaphragm", ce.diaphragm), f++), f === 0) {
          de("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let X = document.getElementById("hk-prop-toast");
          X || (X = document.createElement("div"), X.id = "hk-prop-toast", X.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(X)), X.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", X.style.background = "rgba(217,119,6,0.97)", X.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            X && (X.style.opacity = "0");
          }, 3200);
        } else de(`\u2713 Propiedades aplicadas a ${o.length} nodo(s)`);
      });
    }
    if (r) {
      const S = pt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${a.length} seg(s)` });
      S.addBinding(ce, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), S.addBinding(ce, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const c = pt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      c.addBinding(ce, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), c.addBinding(ce, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), c.addBinding(ce, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), c.addBinding(ce, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), pt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(ce, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), pt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(ce, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const U = pt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      U.addBinding(ce, "relMxI", { label: "Mx I" }), U.addBinding(ce, "relMyI", { label: "My I" }), U.addBinding(ce, "relMzI", { label: "Mz I" });
      const f = pt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      f.addBinding(ce, "relMxJ", { label: "Mx J" }), f.addBinding(ce, "relMyJ", { label: "My J" }), f.addBinding(ce, "relMzJ", { label: "Mz J" }), pt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(ce, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const _ = pt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      _.addBinding(ce, "LKx", { label: "LKx", min: 0, step: 100 }), _.addBinding(ce, "LKy", { label: "LKy", min: 0, step: 100 }), _.addBinding(ce, "LKz", { label: "LKz", min: 0, step: 100 });
      const P = pt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      P.addBinding(ce, "qx", { step: 0.1 }), P.addBinding(ce, "qy", { step: 0.1 }), P.addBinding(ce, "qz", { step: 0.1 }), pt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(ce, "massPerM", { label: "m/L", min: 0, step: 1 }), pt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Ct("segs", a, "section", ce.section), Ct("segs", a, "material", ce.material_frame);
        const C = { A: ce.A_mod, Iz: ce.Iz_mod, Iy: ce.Iy_mod, J: ce.J_mod };
        (C.A !== 1 || C.Iz !== 1 || C.Iy !== 1 || C.J !== 1) && Ct("segs", a, "modifiers", C), ce.insertionPoint !== "10 \u2014 Centroid" && Ct("segs", a, "insertionPoint", ce.insertionPoint), ce.beta !== 0 && Ct("segs", a, "beta", ce.beta);
        const A = [ce.relMxI, ce.relMyI, ce.relMzI], q = [ce.relMxJ, ce.relMyJ, ce.relMzJ];
        (A.some((ke) => ke) || q.some((ke) => ke)) && Ct("segs", a, "releases", { i: A, j: q }), ce.hinges !== "None" && Ct("segs", a, "hinges", ce.hinges);
        const Q = [ce.LKx, ce.LKy, ce.LKz];
        Q.some((ke) => ke !== 0) && Ct("segs", a, "lineSprings", Q);
        const re = [ce.qx, ce.qy, ce.qz];
        re.some((ke) => ke !== 0) && Ct("segs", a, "distLoad", re), ce.massPerM !== 0 && Ct("segs", a, "massPerM", ce.massPerM), de(`\u2713 Propiedades aplicadas a ${a.length} segmento(s)`);
      });
    }
    if (m) {
      const S = pt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${t.length}` });
      S.addBinding(ce, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), S.addBinding(ce, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), S.addBinding(ce, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), pt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(ce, "surfLoad", { label: "q", step: 0.1 }), pt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Ct("areas", t, "shellType", ce.shellType), Ct("areas", t, "thickness", ce.thickness), Ct("areas", t, "material", ce.material_shell), ce.surfLoad !== 0 && Ct("areas", t, "surfLoad", ce.surfLoad), de(`\u2713 Propiedades aplicadas a ${t.length} \xE1rea(s)/shell(s)`);
      });
    }
    if (w) {
      const S = pt.addFolder({ title: "\u2139 Selecci\xF3n" }), c = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      S.addBinding(c, "msg", { readonly: true, label: "" });
    }
    pt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Xe.clear(), Yt();
    }), Rt.style.display = "block", Ns();
  };
  window.__hekatanRefreshPropsPane = Xs;
  let xn = null, qn = false;
  b.addEventListener("pointerdown", (n) => {
    n.button === 2 && (xn = { x: n.clientX, y: n.clientY }, qn = false);
  }), b.addEventListener("pointermove", (n) => {
    if (xn && n.buttons & 2 && !qn) {
      const o = n.clientX - xn.x, a = n.clientY - xn.y;
      Math.hypot(o, a) > 8 && (qn = true);
    }
  }), b.addEventListener("pointerup", (n) => {
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
  }), b.addEventListener("contextmenu", (n) => {
    n.preventDefault(), n.stopPropagation();
  }, { capture: true }), b.addEventListener("pointerdown", (n) => {
    var _a3, _b, _c;
    const o = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select";
    o !== "select" && o !== "none" && o || n.button === 0 && (window.__hekatanBloquearVentana || n.pointerType !== "touch" && (Jt = null, Pn = false));
  }), b.addEventListener("pointermove", (n) => {
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
  }), b.addEventListener("pointerup", (n) => {
    if (!Jt) return;
    if (!Pn) {
      Jt = null;
      return;
    }
    const o = n.ctrlKey || n.metaKey || n.shiftKey;
    Ko(Jt.x, Jt.y, n.clientX, n.clientY, o), Jt = null, Pn = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const qt = new rt();
  qt.visible = false, qt.frustumCulled = false, d.add(qt);
  const Wo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856 }, Jo = (n, o, a, t) => {
    var _a3, _b, _c, _d;
    for (; qt.children.length; ) {
      const r = qt.children.pop();
      (_b = (_a3 = r.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = r.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }
    const s = Wo[n] ?? 16777215, i = new Fe().setFromPoints([new E(-1, -1, 0), new E(1, -1, 0), new E(1, -1, 0), new E(1, 1, 0), new E(1, 1, 0), new E(-1, 1, 0), new E(-1, 1, 0), new E(-1, -1, 0)]);
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
  }, zn = new E(), wo = (n, o, a) => {
    const t = u();
    if (!t) return null;
    const s = b.getBoundingClientRect();
    return zn.set(n, o, a).project(t), !isFinite(zn.x) || !isFinite(zn.y) ? null : { x: s.left + (zn.x * 0.5 + 0.5) * s.width, y: s.top + (-zn.y * 0.5 + 0.5) * s.height };
  };
  window.__hekatanAPixeles = wo;
  const Us = (n, o, a, t, s) => {
    var _a3, _b, _c, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const i = window.__hekatanOsnap, r = e.points.rawVal, m = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let w = null;
    const x = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, k = s, S = (p, _, P, X) => {
      let C;
      if (k) {
        const q = wo(_, P, X);
        if (!q || (C = Math.hypot(q.x - k.x, q.y - k.y), C > Sn)) return;
      } else if (C = Math.hypot(_ - n, P - o, X - a), C > t) return;
      const A = x[p] ?? 9;
      (!w || A < w.r || A === w.r && C < w.d) && (w = { type: p, x: _, y: P, z: X, d: C, r: A });
    };
    if (i.ori !== false && S("ori", 0, 0, 0), i.grid !== false && window.__hekatanSnapEnabled === true) {
      const p = window.__hekatanGridConfig, _ = (p == null ? void 0 : p.minorStep) && p.minorStep > 0 ? p.minorStep : 1, P = ((p == null ? void 0 : p.gridSize) ?? 30) / 2, X = ((_d = (_c = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", C = (q) => Math.round(q / _) * _, A = (q, Q) => Math.abs(q) <= P + 1e-9 && Math.abs(Q) <= P + 1e-9;
      if (X === "xz") {
        const q = C(n), Q = C(a);
        A(q, Q) && S("grid", q, o, Q);
      } else if (X === "yz") {
        const q = C(o), Q = C(a);
        A(q, Q) && S("grid", n, q, Q);
      } else {
        const q = C(n), Q = C(o);
        A(q, Q) && S("grid", q, Q, a);
      }
    }
    (i.node || i.end) && r.forEach((p) => {
      i.node && S("node", p[0], p[1], p[2]);
    });
    for (const p of m) if (!(p.length < 2)) for (let _ = 0; _ < p.length - 1; _++) {
      const P = r[p[_]], X = r[p[_ + 1]];
      if (!(!P || !X) && (i.end && (S("end", P[0], P[1], P[2]), S("end", X[0], X[1], X[2])), i.mid && S("mid", (P[0] + X[0]) / 2, (P[1] + X[1]) / 2, (P[2] + X[2]) / 2), i.nea || i.per)) {
        const C = X[0] - P[0], A = X[1] - P[1], q = X[2] - P[2], Q = C * C + A * A + q * q;
        if (Q < 1e-12) continue;
        const re = Math.max(0, Math.min(1, ((n - P[0]) * C + (o - P[1]) * A + (a - P[2]) * q) / Q)), ke = P[0] + re * C, Ke = P[1] + re * A, Re = P[2] + re * q;
        i.nea && S("nea", ke, Ke, Re), i.per && S("per", ke, Ke, Re);
      }
    }
    if (i.cen) {
      const p = ((_e2 = e.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const _ of p) {
        const P = m[_];
        if (!P || P.length < 3) continue;
        const X = P[0] === P[P.length - 1] ? P.slice(0, -1) : P;
        let C = 0, A = 0, q = 0, Q = 0;
        for (const re of X) {
          const ke = r[re];
          ke && (C += ke[0], A += ke[1], q += ke[2], Q++);
        }
        Q >= 3 && S("cen", C / Q, A / Q, q / Q);
      }
    }
    if (i.cen) {
      const p = Zo(), _ = [...Yn];
      for (const P of p) _.some((X) => Math.hypot(X.c[0] - P.c[0], X.c[1] - P.c[1], X.c[2] - P.c[2]) < 1e-6 && Math.abs(X.r - P.r) < 1e-6) || _.push(P);
      for (const P of _) {
        if (!r.some((A) => Math.abs(Math.hypot(A[0] - P.c[0], A[1] - P.c[1], A[2] - P.c[2]) - P.r) < 1e-6)) continue;
        const C = Math.hypot(n - P.c[0], o - P.c[1], a - P.c[2]);
        if (C < t || Math.abs(C - P.r) < t) {
          const A = Math.min(C, t * 0.5), q = 3;
          (!w || q < w.r || q === w.r && A < w.d) && (w = { type: "cen", x: P.c[0], y: P.c[1], z: P.c[2], d: A, r: q });
        }
      }
    }
    if (i.int) {
      const p = [];
      for (const _ of m) for (let P = 0; P < _.length - 1; P++) {
        const X = r[_[P]], C = r[_[P + 1]];
        if (!X || !C) continue;
        const A = C[0] - X[0], q = C[1] - X[1], Q = C[2] - X[2], re = A * A + q * q + Q * Q;
        if (re < 1e-12) continue;
        const ke = Math.max(0, Math.min(1, ((n - X[0]) * A + (o - X[1]) * q + (a - X[2]) * Q) / re));
        Math.hypot(X[0] + ke * A - n, X[1] + ke * q - o, X[2] + ke * Q - a) < 3 * t && p.push([X, C]);
      }
      for (let _ = 0; _ < p.length; _++) for (let P = _ + 1; P < p.length; P++) {
        const [X, C] = p[_], [A, q] = p[P], Q = [C[0] - X[0], C[1] - X[1], C[2] - X[2]], re = [q[0] - A[0], q[1] - A[1], q[2] - A[2]], ke = [X[0] - A[0], X[1] - A[1], X[2] - A[2]], Ke = Q[0] * Q[0] + Q[1] * Q[1] + Q[2] * Q[2], Re = Q[0] * re[0] + Q[1] * re[1] + Q[2] * re[2], st = re[0] * re[0] + re[1] * re[1] + re[2] * re[2], nt = Q[0] * ke[0] + Q[1] * ke[1] + Q[2] * ke[2], lt = re[0] * ke[0] + re[1] * ke[1] + re[2] * ke[2], Oe = Ke * st - Re * Re;
        if (Oe < 1e-12) continue;
        const $e = (Re * lt - st * nt) / Oe, ot = (Ke * lt - Re * nt) / Oe;
        if ($e < -1e-6 || $e > 1 + 1e-6 || ot < -1e-6 || ot > 1 + 1e-6) continue;
        const Ye = [X[0] + $e * Q[0], X[1] + $e * Q[1], X[2] + $e * Q[2]], Se = [A[0] + ot * re[0], A[1] + ot * re[1], A[2] + ot * re[2]];
        if (Math.hypot(Ye[0] - Se[0], Ye[1] - Se[1], Ye[2] - Se[2]) > 1e-4) continue;
        [X, C, A, q].some((je) => Math.hypot(je[0] - Ye[0], je[1] - Ye[1], je[2] - Ye[2]) < 1e-6) || S("int", Ye[0], Ye[1], Ye[2]);
      }
    }
    const c = window.__hekatanAxisGrids ?? [], F = window.__hekatanLevels ?? [], O = c.filter((p) => p && p.start && p.end).map((p) => [p.start, p.end]);
    for (const [p, _] of O) {
      i.end && (S("end", p[0], p[1], p[2]), S("end", _[0], _[1], _[2]));
      const P = _[0] - p[0], X = _[1] - p[1], C = _[2] - p[2], A = P * P + X * X + C * C;
      if (A < 1e-12) continue;
      const q = Math.max(0, Math.min(1, ((n - p[0]) * P + (o - p[1]) * X + (a - p[2]) * C) / A));
      if (i.nea && S("nea", p[0] + q * P, p[1] + q * X, p[2] + q * C), i.int && Math.abs(C) > 1e-9) for (const Q of F) {
        const re = (Q.z - p[2]) / C;
        re < -1e-6 || re > 1 + 1e-6 || S("int", p[0] + re * P, p[1] + re * X, Q.z);
      }
    }
    if (i.int || i.node) for (let p = 0; p < O.length; p++) for (let _ = p + 1; _ < O.length; _++) {
      const [P, X] = O[p], [C, A] = O[_], q = X[0] - P[0], Q = X[1] - P[1], re = A[0] - C[0], ke = A[1] - C[1], Ke = q * ke - Q * re;
      if (Math.abs(Ke) < 1e-12) continue;
      const Re = P[0] - C[0], st = P[1] - C[1], nt = (re * st - ke * Re) / Ke, lt = (q * st - Q * Re) / Ke;
      if (nt < -1e-6 || nt > 1 + 1e-6 || lt < -1e-6 || lt > 1 + 1e-6) continue;
      const Oe = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      S("int", P[0] + nt * q, P[1] + nt * Q, typeof Oe == "number" ? Oe : a);
    }
    const U = window.__hekatanDrawingAuxLines, f = (U == null ? void 0 : U.rawVal) ?? (U == null ? void 0 : U.val) ?? U ?? [];
    for (const p of f) {
      if (p.length !== 6) continue;
      const _ = [p[0], p[1], p[2]], P = [p[3], p[4], p[5]];
      if (i.end && (S("end", _[0], _[1], _[2]), S("end", P[0], P[1], P[2])), i.mid && S("mid", (_[0] + P[0]) / 2, (_[1] + P[1]) / 2, (_[2] + P[2]) / 2), i.nea || i.per) {
        const X = P[0] - _[0], C = P[1] - _[1], A = P[2] - _[2], q = X * X + C * C + A * A;
        if (q < 1e-12) continue;
        const Q = Math.max(0, Math.min(1, ((n - _[0]) * X + (o - _[1]) * C + (a - _[2]) * A) / q)), re = _[0] + Q * X, ke = _[1] + Q * C, Ke = _[2] + Q * A;
        i.nea && S("nea", re, ke, Ke), i.per && S("per", re, ke, Ke);
      }
    }
    return w ? { type: w.type, x: w.x, y: w.y, z: w.z } : null;
  }, gn = new rt();
  gn.frustumCulled = false, d.add(gn);
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
      let r = [];
      if (i[0] === "pt") {
        const x = o[+i[1]];
        x && (r = [x, [x[0] + 1e-3, x[1], x[2]]]);
      } else if (i[0] === "seg") {
        const x = a[+i[1]] || [], k = o[x[+i[2]]], S = o[x[+i[2] + 1]];
        k && S && (r = [k, S]);
      } else i[0] === "poly" && (r = (a[+i[1]] || []).map((k) => o[k]).filter(Boolean));
      if (r.length < 2) continue;
      const m = new Fe().setFromPoints(r.map((x) => new E(x[0], x[1], x[2]))), w = new zt(m, Qo);
      w.renderOrder = 1200, gn.add(w);
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
    const n = ((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) ?? "select", o = ((_d = e.polylines) == null ? void 0 : _d.rawVal) ?? [], a = o.length ? o[o.length - 1] : [], t = qe.length, s = (i, r = []) => ({ txt: i, ops: r });
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
    qe = [], ge = [], J.visible = false, yo(), Et = null, g(), de("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), Ut();
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
      const i = s[s.length - 1], r = s.slice(0, -1), m = t.some((k, S) => S !== t.length - 1 && k.includes(i)) || r.includes(i);
      let w = e.points.rawVal, x = [...t.slice(0, -1), r];
      if (!m && i === w.length - 1 && (w = w.slice(0, -1), e.points.val = w), e.polylines.val = x, r.length) {
        const k = w[r[r.length - 1]];
        k && (I = [k[0], k[1], k[2]]);
      } else I = null, fe.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return g(), de(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${r.length}.`), Ut(), true;
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
    qe = [], ge = [], J.visible = false;
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
        const t = a.split(":"), s = n[+t[1]] || [], i = s[+t[2]], r = s[+t[2] + 1];
        i != null && o.add(i), r != null && o.add(r);
      }
    }), o;
  }, as = (n, o, a) => {
    var _a3;
    const t = ss();
    if (!t.size) return 0;
    Dt();
    const s = e.points.rawVal.map((i, r) => t.has(r) ? [i[0] + n, i[1] + o, i[2] + a] : i);
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
    const r = [o[0] - n[0], o[1] - n[1], o[2] - n[2]], m = [t[0] - a[0], t[1] - a[1], t[2] - a[2]], w = [n[0] - a[0], n[1] - a[1], n[2] - a[2]], x = r[0] * r[0] + r[1] * r[1] + r[2] * r[2], k = r[0] * m[0] + r[1] * m[1] + r[2] * m[2], S = m[0] * m[0] + m[1] * m[1] + m[2] * m[2], c = r[0] * w[0] + r[1] * w[1] + r[2] * w[2], F = m[0] * w[0] + m[1] * w[1] + m[2] * w[2], O = x * S - k * k;
    if (O < 1e-12) return null;
    const U = (k * F - S * c) / O, f = (x * F - k * c) / O;
    if (!s && (U < -1e-6 || U > 1 + 1e-6) || !i && (f < -1e-6 || f > 1 + 1e-6)) return null;
    const p = [n[0] + U * r[0], n[1] + U * r[1], n[2] + U * r[2]], _ = [a[0] + f * m[0], a[1] + f * m[1], a[2] + f * m[2]];
    return an(p, _) > 1e-4 ? null : p;
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
      const U = Et.poly, f = a[U];
      if (!f || f.length < 2) {
        Et = null, de("DESFASE: esa polil\xEDnea no tiene tramos."), Ut();
        return;
      }
      const p = f.length > 2 && f[0] === f[f.length - 1], _ = Hs(), P = [];
      for (let $e = 0; $e < f.length - 1; $e++) {
        const ot = t[f[$e]], Ye = t[f[$e + 1]], Se = [Ye[0] - ot[0], Ye[1] - ot[1], Ye[2] - ot[2]], Ie = Math.hypot(Se[0], Se[1], Se[2]) || 1, je = Se[0] / Ie, Lt = Se[1] / Ie, Bt = Se[2] / Ie, It = [_[1] * Bt - _[2] * Lt, _[2] * je - _[0] * Bt, _[0] * Lt - _[1] * je], on = Math.hypot(It[0], It[1], It[2]) || 1;
        P.push({ a: ot, b: Ye, n: [It[0] / on, It[1] / on, It[2] / on] });
      }
      let X = 0, C = 1 / 0;
      P.forEach(($e, ot) => {
        const Ye = sn(o[0], o[1], o[2], $e.a[0], $e.a[1], $e.a[2], $e.b[0], $e.b[1], $e.b[2]);
        Ye < C && (C = Ye, X = ot);
      });
      const A = P[X], q = Math.sign((o[0] - A.a[0]) * A.n[0] + (o[1] - A.a[1]) * A.n[1] + (o[2] - A.a[2]) * A.n[2]) || 1, Q = dn > 0 ? dn : C;
      if (Q < 1e-6) {
        de("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const re = P.map(($e) => ({ a: [$e.a[0] + q * Q * $e.n[0], $e.a[1] + q * Q * $e.n[1], $e.a[2] + q * Q * $e.n[2]], b: [$e.b[0] + q * Q * $e.n[0], $e.b[1] + q * Q * $e.n[1], $e.b[2] + q * Q * $e.n[2]] })), ke = re.length, Ke = ($e) => {
        const ot = re[($e - 1 + ke) % ke], Ye = re[$e % ke];
        return vo(ot.a, ot.b, Ye.a, Ye.b, true, true) ?? Ye.a;
      }, Re = [], st = p ? ke : ke + 1;
      for (let $e = 0; $e < st; $e++) !p && $e === 0 ? Re.push(re[0].a) : !p && $e === ke ? Re.push(re[ke - 1].b) : Re.push(Ke($e));
      Dt();
      const nt = t.length;
      e.points.val = [...t, ...Re];
      const lt = Re.map(($e, ot) => nt + ot);
      p && lt.push(nt);
      let Oe = a.slice();
      Oe.length && Oe[Oe.length - 1].length === 0 && (Oe = Oe.slice(0, -1)), e.polylines.val = [...Oe, lt, []], Et = null, de(`\u2713 Desfase a ${Q.toFixed(2)} m \u2014 ${ke} tramo${ke === 1 ? "" : "s"} nuevo${ke === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      g(), Ut();
      return;
    }
    let i = wt, r = Math.max(0, Nt);
    if (i < 0 || i === Et.poly && r === Et.seg) {
      let f = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (i = -1, a.forEach((p, _) => {
        for (let P = 0; P < p.length - 1; P++) {
          if (_ === Et.poly && P === Et.seg) continue;
          const X = t[p[P]], C = t[p[P + 1]];
          if (!X || !C) continue;
          const A = sn(o[0], o[1], o[2], X[0], X[1], X[2], C[0], C[1], C[2]);
          A < f && (f = A, i = _, r = P);
        }
      }), i < 0) {
        de(`${s}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const m = a[Et.poly], w = t[m[Et.seg]], x = t[m[Et.seg + 1]], k = a[i], S = k[r], c = k[r + 1];
    if (!w || !x || S == null || c == null) {
      de(`${s}: no se pudo leer el tramo.`);
      return;
    }
    const F = t[S], O = t[c];
    if (n === "trim") {
      const U = vo(F, O, w, x, false, false);
      if (!U) {
        de("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Dt();
      const f = t.length;
      e.points.val = [...t, U];
      const p = [...k.slice(0, r + 1), f, ...k.slice(r + 1)];
      e.polylines.val = a.map((P, X) => X === i ? p : P);
      const _ = an(o, F) < an(o, O);
      No(i, _ ? r : r + 1), de(`\u2713 Recortado en (${U[0].toFixed(2)}, ${U[1].toFixed(2)}, ${U[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const U = vo(F, O, w, x, true, false);
      if (!U) {
        de("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const p = an(o, F) < an(o, O) ? r : r + 1;
      if (p !== 0 && p !== k.length - 1) {
        de("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const _ = k[p];
      if (an(U, F) + an(U, O) < an(F, O) + 1e-6) {
        de("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Dt(), Ws(_) > 1) {
        const X = t.length;
        e.points.val = [...t, U];
        const C = k.slice();
        C[p] = X, e.polylines.val = a.map((A, q) => q === i ? C : A);
      } else e.points.val = t.map((X, C) => C === _ ? U : X);
      de(`\u2713 Alargada hasta (${U[0].toFixed(2)}, ${U[1].toFixed(2)}, ${U[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
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
    const i = [...Xe], r = e.points.rawVal, m = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], w = new Set(((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []), x = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Set(), S = [];
    if (i.forEach((f) => {
      if (f.startsWith("pt:")) {
        const p = +f.slice(3);
        r[p] && x.add(p);
      } else if (f.startsWith("poly:")) {
        const p = +f.slice(5);
        if (!m[p] || m[p].length < 2) return;
        k.add(p), m[p].forEach((_) => x.add(_));
      } else if (f.startsWith("seg:")) {
        const p = f.split(":"), _ = +p[1], P = +p[2], X = m[_] || [], C = X[P], A = X[P + 1];
        C != null && A != null && (S.push([C, A]), x.add(C), x.add(A));
      }
    }), !x.size) return 0;
    Dt();
    const c = [...r];
    let F = m.slice();
    F.length && F[F.length - 1].length === 0 && (F = F.slice(0, -1));
    const O = [...((_c = e.areas) == null ? void 0 : _c.rawVal) ?? []], U = [...x];
    for (let f = 1; f <= t; f++) {
      const p = s + f, _ = n * p, P = o * p, X = a * p, C = /* @__PURE__ */ new Map();
      U.forEach((A) => {
        C.set(A, c.length), c.push([r[A][0] + _, r[A][1] + P, r[A][2] + X]);
      }), k.forEach((A) => {
        const q = m[A].map((re) => C.has(re) ? C.get(re) : re), Q = F.length;
        F.push(q), w.has(A) && O.push(Q);
      }), S.forEach(([A, q]) => {
        F.push([C.get(A), C.get(q)]);
      });
    }
    F.push([]), e.points.val = c, e.polylines && (e.polylines.val = F), e.areas && (e.areas.val = O);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return g(), t;
  }, window.__hekatanVoladoSelection = (n, o = {}) => {
    var _a3, _b, _c;
    const a = Number(n);
    if (!Number.isFinite(a) || Math.abs(a) < 1e-6) return 0;
    const t = o.losa !== false, s = o.vigaBorde !== false, i = o.lados === "afuera" ? "afuera" : "ambos", r = e.points.rawVal, m = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], w = [];
    if ([...Xe].forEach((U) => {
      if (U.startsWith("seg:")) {
        const f = U.split(":"), p = +f[1], _ = +f[2], P = m[p] || [], X = P[_], C = P[_ + 1];
        X != null && C != null && w.push([X, C]);
      } else if (U.startsWith("poly:")) {
        const f = m[+U.slice(5)] || [];
        for (let p = 0; p + 1 < f.length; p++) w.push([f[p], f[p + 1]]);
      }
    }), !w.length) return 0;
    let x = 0, k = 0;
    for (const U of r) x += U[0], k += U[1];
    x /= Math.max(1, r.length), k /= Math.max(1, r.length), Dt();
    const S = [...r];
    let c = m.slice();
    c.length && c[c.length - 1].length === 0 && (c = c.slice(0, -1));
    const F = [...((_b = e.areas) == null ? void 0 : _b.rawVal) ?? []];
    let O = 0;
    for (const [U, f] of w) {
      const p = r[U], _ = r[f];
      if (!p || !_) continue;
      const P = _[0] - p[0], X = _[1] - p[1], C = Math.hypot(P, X);
      if (C < 1e-6) continue;
      let A = -X / C, q = P / C;
      const Q = (p[0] + _[0]) / 2, re = (p[1] + _[1]) / 2;
      (Q - x) * A + (re - k) * q < 0 && (A = -A, q = -q);
      const ke = i === "ambos" ? [1, -1] : [1];
      for (const Ke of ke) {
        const Re = A * a * Ke, st = q * a * Ke, nt = S.length;
        S.push([p[0] + Re, p[1] + st, p[2]]);
        const lt = S.length;
        S.push([_[0] + Re, _[1] + st, _[2]]), c.push([U, nt]), c.push([f, lt]), s && c.push([nt, lt]), t && (F.push(c.length), c.push([U, f, lt, nt, U])), O++;
      }
    }
    if (!O) return 0;
    c.push([]), e.points.val = S, e.polylines && (e.polylines.val = c), e.areas && (e.areas.val = F);
    try {
      (_c = window.__hekatanRebuild) == null ? void 0 : _c.call(window);
    } catch {
    }
    return g(), O;
  }, b.addEventListener("click", (n) => {
    var _a3, _b;
    if (window.__hekatanCursorPx = { x: n.clientX, y: n.clientY }, cn > 5) {
      cn = 0;
      return;
    }
    cn = 0;
    const o = M(n);
    if (!o) return;
    z.setFromCamera(V, o);
    const a = oe();
    if (!a.length) return;
    {
      const s = o.position.distanceTo(h.target) || 1, i = a[0].distance ?? o.position.distanceTo(a[0].point), r = a[0].point;
      if (!isFinite(r.x) || !isFinite(r.y) || !isFinite(r.z) || i > Math.max(s * 12, 300)) {
        de("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let t = a[0].point;
    (n.ctrlKey || n.metaKey) && (t = new E(Math.round(a[0].point.x), Math.round(a[0].point.y), Math.round(a[0].point.z)));
    {
      const s = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], i = s[s.length - 1] ?? [], r = e.points.rawVal ?? [];
      if (i.length > 0) {
        const m = r[i[i.length - 1]];
        if (m) {
          const w = !!window.__hekatanOrthoMode;
          let x = Ne;
          if (!x && w) {
            const k = Math.abs(t.x - m[0]), S = Math.abs(t.y - m[1]), c = Math.abs(t.z - m[2]);
            x = k >= S && k >= c ? "x" : S >= c ? "y" : "z";
          }
          x === "x" ? t = new E(t.x, m[1], m[2]) : x === "y" ? t = new E(m[0], t.y, m[2]) : x === "z" && (t = new E(m[0], m[1], t.z));
        }
      }
    }
    if (Pt && Math.abs(n.clientX - Pt.x) <= 3 && Math.abs(n.clientY - Pt.y) <= 3) t = Pt.p.clone();
    else if (dt) t = dt.clone(), de(`\u{1F4D0} Eje \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
    else {
      const s = po(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s, { x: n.clientX, y: n.clientY });
      if (i) t = new E(i.x, i.y, i.z), de(`\u{1F3AF} Snap [${i.type.toUpperCase()}] \u2192 (${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`);
      else {
        const r = window.__hekatanSnapEnabled !== false, m = window.__hekatanSnap2D ?? 0;
        r && m > 0 && (t = new E(Math.round(t.x / m) * m, Math.round(t.y / m) * m, Math.round(t.z / m) * m));
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
        const { kind: t, a: s, b: i } = Ht, r = i !== void 0 ? `${t}:${s}:${i}` : `${t}:${s}`;
        !!o && (o.ctrlKey || o.metaKey || o.shiftKey) || Xe.clear(), Xe.has(r) ? Xe.delete(r) : Xe.add(r), Yt(), de(`\u2713 Seleccionados ${Xe.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
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
          const r = s.slice(0, i).concat(s.slice(i + 1));
          t && typeof t == "object" && "val" in t ? t.val = r : window.__hekatanDrawingAuxLines = r, de(`\u{1F5D1} L\xEDnea auxiliar #${i + 1} borrada`), Qt = -1, mt.visible = false;
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
      const r = Math.abs(s[1] - t[1]), w = Math.abs(s[2] - t[2]) < 1e-3 ? "xy" : r < 1e-3 ? "xz" : "yz", x = window.__hekatanArcSegs ?? 12;
      (_h = window.__hekatanDrawCircle) == null ? void 0 : _h.call(window, t[0], t[1], t[2], i, x, w), de(`\u2713 C\xEDrculo dibujado en ${w.toUpperCase()} \u2014 r=${i.toFixed(2)}m, ${x} segmentos`), qe = [];
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
      const [t, s, i] = qe, r = window.__hekatanArcSegs ?? 12;
      (_j = window.__hekatanDrawArc) == null ? void 0 : _j.call(window, t, s, i, r), de(`\u2713 Arco dibujado \u2014 ${r} segmentos`), qe = [];
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
        ve.geometry.setFromPoints([new E(s[0], s[1], s[2]), new E(i[0], i[1], i[2])]), ve.visible = true;
        const r = Math.hypot(i[0] - s[0], i[1] - s[1], i[2] - s[2]), m = Math.hypot(i[0] - s[0], i[1] - s[1]);
        me.textContent = `${r.toFixed(3)} m`, Ze(), de(`\u{1F4CF} Distancia ${r.toFixed(3)} m  \xB7  \u0394x ${(i[0] - s[0]).toFixed(3)}  \u0394y ${(i[1] - s[1]).toFixed(3)}  \u0394z ${(i[2] - s[2]).toFixed(3)}  \xB7  en planta ${m.toFixed(3)} m`);
      }
      g();
      return;
    }
    if (a === "fillarea") {
      const t = e.points.rawVal, s = ((_n2 = e.polylines) == null ? void 0 : _n2.rawVal) ?? [], i = /* @__PURE__ */ new Map(), r = (C, A) => {
        C !== A && ((i.get(C) ?? i.set(C, /* @__PURE__ */ new Set()).get(C)).add(A), (i.get(A) ?? i.set(A, /* @__PURE__ */ new Set()).get(A)).add(C));
      };
      for (const C of s) for (let A = 0; A + 1 < C.length; A++) r(C[A], C[A + 1]);
      const m = (C, A) => {
        var _a4;
        return !!((_a4 = i.get(C)) == null ? void 0 : _a4.has(A));
      }, w = /* @__PURE__ */ new Set(), x = [], k = [...i.keys()];
      for (const C of k) for (const A of i.get(C)) if (!(A < C)) {
        for (const q of i.get(A)) if (q !== C) for (const Q of i.get(q)) {
          if (Q === C || Q === A || !m(Q, C) || m(C, q) || m(A, Q)) continue;
          const re = [C, A, q, Q].slice().sort((ke, Ke) => ke - Ke).join("-");
          w.has(re) || (w.add(re), x.push([C, A, q, Q]));
        }
      }
      for (const C of k) for (const A of i.get(C)) if (!(A < C)) for (const q of i.get(A)) {
        if (q === C || !m(q, C)) continue;
        const Q = [C, A, q].slice().sort((re, ke) => re - ke).join("-");
        w.has(Q) || (w.add(Q), x.push([C, A, q]));
      }
      const S = ((_q = (_p = (_o = window.__hekatanCadState) == null ? void 0 : _o.get) == null ? void 0 : _p.call(_o)) == null ? void 0 : _q.workPlane) ?? "xy", c = (C) => S === "xy" ? [C[0], C[1]] : S === "xz" ? [C[0], C[2]] : [C[1], C[2]], F = c([n.x, n.y, n.z]), O = (C, A) => {
        let q = false;
        for (let Q = 0, re = A.length - 1; Q < A.length; re = Q++) {
          const ke = A[Q][0], Ke = A[Q][1], Re = A[re][0], st = A[re][1];
          Ke > C[1] != st > C[1] && C[0] < (Re - ke) * (C[1] - Ke) / (st - Ke) + ke && (q = !q);
        }
        return q;
      }, U = (C) => {
        let A = 0;
        for (let q = 0, Q = C.length - 1; q < C.length; Q = q++) A += (C[Q][0] + C[q][0]) * (C[Q][1] - C[q][1]);
        return Math.abs(A) / 2;
      };
      let f = null, p = 1 / 0;
      for (const C of x) {
        const A = C.map((Q) => c(t[Q]));
        if (!O(F, A)) continue;
        const q = U(A);
        q < p && (p = q, f = C);
      }
      if (!f) {
        de("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const _ = f.slice().sort((C, A) => C - A).join("-"), P = ((_r = e.areas) == null ? void 0 : _r.rawVal) ?? [];
      if (P.some((C) => {
        const A = s[C] ?? [];
        return [...new Set(A)].sort((q, Q) => q - Q).join("-") === _;
      })) {
        de("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      e.polylines.val = [...s, [...f, f[0]]], e.areas.val = [...P, s.length], de(`\u2713 \xC1rea creada por relleno (${f.length} lados).`);
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
      ge.push([n.x, n.y, n.z]), J.geometry.setFromPoints(ge.map((t) => new E(t[0], t[1], t[2]))), J.visible = ge.length >= 1, de(`\u25B0 \xC1rea libre \u2014 ${ge.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), g();
      return;
    }
    if (a === "plane3") {
      if (qe.push([n.x, n.y, n.z]), qe.length < 3) {
        de(`\u25E3 Plano inclinado \u2014 punto ${qe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [t, s, i] = qe, r = (_u = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _u.call(window, t, s, i);
      de(r ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), qe = [];
      return;
    }
    if (a === "col") {
      Dt();
      const t = n.z, s = bt && bt > 0 ? bt : 3;
      e.points.val = [...e.points.rawVal, [n.x, n.y, t], [n.x, n.y, t + s]];
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], bt = 0, de(`\u258C Columna creada \u2014 h=${s.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
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
      const r = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [t[0], t[1], t[2]], [s[0], s[1], s[2]], [s[0], s[1], s[2] + i], [t[0], t[1], t[2] + i]];
      const m = e.polylines.rawVal;
      if (m.length - 1, e.polylines.val = [...m.slice(0, -1), ...m[m.length - 1].length > 0 ? [m[m.length - 1]] : [], [r, r + 1, r + 2, r + 3, r], []], e.areas) {
        const w = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, w];
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
      const i = e.polylines.rawVal, r = e.points.rawVal.length;
      e.polylines.val = [...i.slice(0, -1), ...i[i.length - 1].length > 0 ? [i[i.length - 1]] : [], [r - 2, r - 1], []], bt = 0, de(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${t.toFixed(2)}m`);
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
      const i = e.polylines.rawVal, r = e.points.rawVal, m = i[s.polyIdx], w = r[m[s.segIdx]], x = r[m[s.segIdx + 1]];
      if (!w || !x) {
        de("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const k = bt && bt > 0 ? bt : 3;
      Dt();
      const S = e.points.rawVal.length;
      e.points.val = [...e.points.rawVal, [w[0], w[1], w[2]], [x[0], x[1], x[2]], [x[0], x[1], x[2] + k], [w[0], w[1], w[2] + k]];
      const c = e.polylines.rawVal;
      if (e.polylines.val = [...c.slice(0, -1), ...c[c.length - 1].length > 0 ? [c[c.length - 1]] : [], [S, S + 1, S + 2, S + 3, S], []], e.areas) {
        const F = e.polylines.rawVal.length - 2;
        e.areas.val = [...e.areas.rawVal, F];
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
      const r = s[0] - t[0], m = s[1] - t[1], w = s[2] - t[2], x = Math.sqrt(r * r + m * m + w * w);
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
      const [t, s] = qe, i = window.__hekatanChaflanR ?? 1, r = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_z = window.__hekatanDrawSlabChaflan) == null ? void 0 : _z.call(window, t, s, i, r, 6);
      const m = Math.abs(s[0] - t[0]).toFixed(1), w = Math.abs(s[1] - t[1]).toFixed(1);
      de(`\u2713 Losa con chaflanes dibujada \u2014 ${m}\xD7${w}m, r=${i}m, ${r} seg/chafl\xE1n`), qe = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (Y = false, Dt(), e.points.val = [...e.points.rawVal, n.toArray()], e.polylines && (e.polylines.val = [...e.polylines.rawVal.slice(0, -1), [...e.polylines.rawVal.length ? e.polylines.rawVal.pop() : [], e.points.rawVal.length - 1]]), e.polylines) {
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
  b.addEventListener("click", () => Ut()), b.addEventListener("contextmenu", (n) => {
    var _a3, _b, _c;
    if (((_c = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c.tool) === "polyarea" && ge.length >= 3) {
      n.preventDefault();
      const a = lo();
      de(`\u2713 \xC1rea libre mallada \u2014 ${a} shells Q4 creados.`);
      return;
    }
    !e.polylines || e.polylines.rawVal[e.polylines.rawVal.length - 1].length === 0 || (e.polylines.val = [...e.polylines.rawVal, []]);
  }), b.addEventListener("pointermove", (n) => {
    var _a3, _b;
    const o = M(n);
    if (!o) return;
    z.setFromCamera(V, o);
    const a = oe();
    if (ie.geometry.deleteAttribute("position"), a.length) {
      let t = a[0].point.clone();
      (n.ctrlKey || n.metaKey) && t.set(Math.round(t.x), Math.round(t.y), Math.round(t.z));
      {
        const r = ((_a3 = e.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = r[r.length - 1] ?? [], w = e.points.rawVal ?? [];
        if (m.length > 0) {
          const x = w[m[m.length - 1]];
          if (x) {
            const k = !!window.__hekatanOrthoMode;
            let S = Ne;
            if (!S && k) {
              const c = Math.abs(t.x - x[0]), F = Math.abs(t.y - x[1]), O = Math.abs(t.z - x[2]);
              S = c >= F && c >= O ? "x" : F >= O ? "y" : "z";
            }
            S === "x" ? t.set(t.x, x[1], x[2]) : S === "y" ? t.set(x[0], t.y, x[2]) : S === "z" && t.set(x[0], x[1], t.z);
          }
        }
      }
      const s = po(t), i = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, t.x, t.y, t.z, s, { x: n.clientX, y: n.clientY });
      if (i) t.set(i.x, i.y, i.z);
      else {
        const r = window.__hekatanSnapEnabled !== false, m = window.__hekatanSnap2D ?? 0.5;
        r && m > 0 && (t.x = Math.round(t.x / m) * m, t.y = Math.round(t.y / m) * m, t.z = Math.round(t.z / m) * m);
      }
      ie.geometry.setAttribute("position", new St(t.toArray(), 3));
    }
    g();
  }), b.addEventListener("pointermove", (n) => {
    var _a3;
    const o = M(n);
    if (!o) return;
    z.setFromCamera(V, o);
    let a = false;
    const t = z.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const i = new E(...e.points.rawVal[t[0].index]), r = new E(...s[0].point), m = i.sub(r), w = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      w.transformDirection(H.matrixWorld), Math.abs(m.dot(w)) < 1e-4 && (a = true);
    }
    ie.visible = !a;
  });
  let bo = false, Mo;
  b.addEventListener("pointermove", (n) => {
    var _a3;
    if (!cn) return;
    const o = M(n);
    if (!o) return;
    z.setFromCamera(V, o);
    let a = false;
    const t = z.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const r = new E(...e.points.rawVal[t[0].index]), m = new E(...s[0].point), w = r.sub(m), x = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      x.transformDirection(H.matrixWorld), Math.abs(w.dot(x)) < 1e-4 && (a = true);
    }
    if (a && cn < 5 && (bo = true, h.enabled = false, Mo = t[0].index), !bo || cn % 2 !== 0) return;
    const i = [...e.points.rawVal];
    if (Mo !== void 0) {
      let r = s[0].point;
      (n.ctrlKey || n.metaKey) && (r = new E(Math.round(r.x), Math.round(r.y), Math.round(r.z))), i[Mo] = r.toArray();
    }
    e.points.val = i;
  }), b.addEventListener("pointerup", () => {
    h.enabled = true, bo = false;
  }), b.addEventListener("contextmenu", (n) => {
    var _a3;
    const o = M(n);
    if (!o) return;
    z.setFromCamera(V, o);
    let a = false;
    const t = z.intersectObject(B), s = oe();
    if (t.length && s.length) {
      const m = new E(...e.points.rawVal[t[0].index]), w = new E(...s[0].point), x = m.sub(w), k = (_a3 = s[0].face) == null ? void 0 : _a3.normal;
      k.transformDirection(H.matrixWorld), Math.abs(x.dot(k)) < 1e-4 && (a = true);
    }
    if (!a) return;
    const i = [...e.points.rawVal];
    if (i.splice(t[0].index, 1), e.points.val = i, !e.polylines) return;
    const r = e.polylines.rawVal.map((m) => m.filter((w) => w !== t[0].index)).map((m) => m.map((w) => w > t[0].index ? w - 1 : w)).filter((m) => m.length);
    r.push([]), e.polylines.val = r;
  });
}
function Xa(e, l, d) {
  const y = Math.round(14.999999999999998), v = { position: e.position.clone(), quaternion: e.quaternion.clone() }, b = setInterval(z, 1e3 / 30);
  let g = 0;
  function z() {
    g++;
    const V = g / y;
    e.position.lerpVectors(v.position, l.position, V), e.quaternion.slerpQuaternions(v.quaternion, l.quaternion, V), d && d(), g == y && clearInterval(b);
  }
}
function Ya(e, l, d, u) {
  const h = ga(d, e.elements, u);
  return te.derive(() => {
    h.visible = l.shellResults.val != "none";
  }), h;
}
const Za = 6, To = 10, Ua = 0.012;
function qa(e) {
  return e.startsWith("contour:") ? e.slice(8) : null;
}
function Ka(e, l, d, u) {
  if (!d && !u) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(e) && d) {
    const y = d[e];
    if (y && y.has(l)) return y.get(l);
  }
  return null;
}
function Ga(e, l, d, u) {
  const h = new rt(), y = new As();
  y.setColorMap("rainbow");
  const v = new Ot(), b = te.state([]);
  return te.derive(() => {
    var _a2, _b, _c;
    l.deformedShape.val;
    const g = d.val, z = ((_a2 = e.elements) == null ? void 0 : _a2.val) ?? [], V = qa(l.frameResults.val);
    if (h.children.forEach(($) => {
      $.geometry && $.geometry.dispose(), $.material && $.material.dispose();
    }), h.clear(), !V || z.length === 0 || g.length === 0) {
      b.val = [];
      return;
    }
    const M = (_b = e.analyzeOutputs) == null ? void 0 : _b.val, H = (_c = e.deformOutputs) == null ? void 0 : _c.val, xe = [], be = [];
    for (let $ = 0; $ < z.length; $++) {
      if (z[$].length !== 2) continue;
      const pe = Ka(V, $, M, H);
      pe && (xe.push(pe[0], pe[1]), be.push({ idx: $, vals: pe }));
    }
    if (xe.length === 0) {
      b.val = [];
      return;
    }
    const se = Math.min(...xe), D = Math.max(...xe);
    y.setMin(se), y.setMax(D), b.val = xe;
    const oe = [1 / 0, 1 / 0, 1 / 0], B = [-1 / 0, -1 / 0, -1 / 0];
    for (const $ of g) for (let ne = 0; ne < 3; ne++) oe[ne] = Math.min(oe[ne], $[ne]), B[ne] = Math.max(B[ne], $[ne]);
    const le = Math.max(B[0] - oe[0], B[1] - oe[1], B[2] - oe[2], 1) * Ua, N = [], I = [], G = [];
    let Y = 0;
    for (const { idx: $, vals: ne } of be) {
      const pe = z[$], he = g[pe[0]], ae = g[pe[1]];
      if (!he || !ae) continue;
      const Z = new E(ae[0] - he[0], ae[1] - he[1], ae[2] - he[2]), fe = Z.length();
      if (fe < 1e-10) continue;
      Z.normalize();
      const J = Math.abs(Z.y) < 0.99 ? new E(0, 1, 0) : new E(1, 0, 0), ge = new E().crossVectors(Z, J).normalize(), ve = new E().crossVectors(Z, ge).normalize(), Pe = To + 1, me = Za;
      for (let De = 0; De < Pe; De++) {
        const Ze = De / To, et = he[0] + Z.x * fe * Ze, vt = he[1] + Z.y * fe * Ze, ue = he[2] + Z.z * fe * Ze, L = ne[0] + (ne[1] - ne[0]) * Ze, j = y.getColor(L) ?? new Ot(0, 0, 0);
        v.copy(j).convertSRGBToLinear();
        for (let W = 0; W < me; W++) {
          const ee = W / me * Math.PI * 2, we = Math.cos(ee), _e = Math.sin(ee);
          N.push(et + (ge.x * we + ve.x * _e) * le, vt + (ge.y * we + ve.y * _e) * le, ue + (ge.z * we + ve.z * _e) * le), I.push(v.r, v.g, v.b);
        }
      }
      for (let De = 0; De < To; De++) for (let Ze = 0; Ze < me; Ze++) {
        const et = (Ze + 1) % me, vt = Y + De * me + Ze, ue = Y + De * me + et, L = Y + (De + 1) * me + Ze, j = Y + (De + 1) * me + et;
        G.push(vt, ue, j), G.push(vt, j, L);
      }
      Y += Pe * me;
    }
    if (N.length === 0) return;
    const T = new Fe();
    T.setAttribute("position", new St(N, 3)), T.setAttribute("color", new St(I, 3)), T.setIndex(G), T.computeVertexNormals();
    const K = new ut({ vertexColors: true, side: Ft }), R = new it(T, K);
    R.frustumCulled = false, h.add(R);
  }), h.__colorMapValues = b, h;
}
function Ha() {
  const e = window;
  return { forceUnit: e.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: e.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: e.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Wa = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Ja = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Oa = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Mt(e, l = 4) {
  return e == null || !isFinite(e) ? "\u2014" : e === 0 ? "0" : Math.abs(e) < 1e-3 || Math.abs(e) > 1e5 ? e.toExponential(l) : e.toFixed(l);
}
const Qa = 16755200, Ms = 56831, ja = 56831, ei = 56831, eo = 65382;
function ti(e) {
  const l = new rt();
  l.name = "__hekatan_hover", l.renderOrder = 99;
  const d = new bn(1, 16, 16), u = new ut({ color: Qa, transparent: true, opacity: 0.85, depthTest: false }), h = new it(d, u);
  h.visible = false, h.renderOrder = 100, l.add(h);
  const y = new Fe(), v = new yt({ color: Ms, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), b = new jt(y, v);
  b.visible = false, b.renderOrder = 100, l.add(b);
  const g = new ut({ color: Ms, transparent: true, opacity: 0.7, depthTest: false }), z = new it(new xs(1, 1, 1, 12), g);
  z.visible = false, z.renderOrder = 100, l.add(z);
  const V = new Fe(), M = new ut({ color: ja, transparent: true, opacity: 0.45, side: Ft, depthTest: false }), H = new it(V, M);
  H.visible = false, H.renderOrder = 100, l.add(H);
  const xe = new Fe(), be = new yt({ color: ei, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), se = new jt(xe, be);
  se.visible = false, se.renderOrder = 100, l.add(se);
  const D = new ut({ color: eo, transparent: true, opacity: 0.95, depthTest: false }), oe = new ut({ color: eo, transparent: true, opacity: 0.85, depthTest: false }), B = new xs(1, 1, 1, 12), ie = new ut({ color: eo, transparent: true, opacity: 0.55, side: Ft, depthTest: false }), le = new yt({ color: eo, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), N = [];
  window.__hekatanModelSelection = N;
  const I = new rt();
  I.renderOrder = 101, l.add(I);
  const G = document.createElement("div");
  Object.assign(G.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), G.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    e.rendererElm.parentElement && e.rendererElm.parentElement.appendChild(G);
  }, 0);
  function Y(ue) {
    const L = e.derivedNodes.rawVal;
    return !L || ue < 0 || ue >= L.length ? null : new E(L[ue][0], L[ue][1], L[ue][2]);
  }
  function T(ue, L) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2;
    const j = e.getActiveCamera();
    if (!j || !e.mesh) return null;
    const W = e.rendererElm.getBoundingClientRect(), ee = ue - W.left, we = L - W.top, _e = e.derivedNodes.rawVal, ye = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!_e || !ye) return null;
    const Ae = /* @__PURE__ */ new Map(), Te = (Be) => {
      if (Ae.has(Be)) return Ae.get(Be);
      const Le = Y(Be);
      if (!Le) return Ae.set(Be, null), null;
      const ze = Le.clone().project(j), Je = (ze.x * 0.5 + 0.5) * W.width, Ce = (-ze.y * 0.5 + 0.5) * W.height, Ne = { x: Je, y: Ce, z: ze.z };
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
  function K(ue, L, j) {
    var _a2, _b, _c;
    if (h.visible = false, b.visible = false, z.visible = false, H.visible = false, se.visible = false, !ue || !e.mesh) {
      G.style.display = "none", e.render();
      return;
    }
    const W = (_a2 = e.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (ue.type === "node") {
      const ye = Y(ue.idx);
      if (ye) {
        const Ae = e.derivedNodes.rawVal ?? [];
        let Te = 1;
        if (Ae.length >= 2) {
          let Ue = [1 / 0, 1 / 0, 1 / 0], ft = [-1 / 0, -1 / 0, -1 / 0];
          for (const We of Ae) for (let Me = 0; Me < 3; Me++) We[Me] < Ue[Me] && (Ue[Me] = We[Me]), We[Me] > ft[Me] && (ft[Me] = We[Me]);
          Te = Math.max(ft[0] - Ue[0], ft[1] - Ue[1], ft[2] - Ue[2], 0.1);
        }
        const He = ((_b = e.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Qe = 0.021 * Te * He;
        h.position.copy(ye), h.scale.setScalar(Qe), h.visible = true;
      }
    } else if (ue.type === "frame" && W) {
      const ye = W[ue.idx], Ae = Y(ye[0]), Te = Y(ye[1]);
      if (Ae && Te) {
        const He = Ae.clone().add(Te).multiplyScalar(0.5), Qe = Te.clone().sub(Ae), Ue = Qe.length(), Me = e.getActiveCamera().position.distanceTo(He) * 35e-4;
        z.position.copy(He);
        const Ee = new E(0, 1, 0), ct = Ee.clone().cross(Qe).normalize(), Ge = Ee.angleTo(Qe);
        z.quaternion.setFromAxisAngle(ct, Ge), z.scale.set(Me, Ue, Me), z.visible = true;
      }
    } else if (ue.type === "shell" && W) {
      const ye = W[ue.idx], Ae = [], Te = [];
      for (const He of ye) {
        const Qe = Y(He);
        if (!Qe) return;
        Ae.push(Qe.x, Qe.y, Qe.z);
      }
      ye.length === 4 ? Te.push(0, 1, 2, 0, 2, 3) : ye.length === 3 && Te.push(0, 1, 2), V.setAttribute("position", new St(Ae, 3)), V.setIndex(Te), V.computeVertexNormals(), H.visible = true;
    } else if (ue.type === "solid" && W) {
      const ye = W[ue.idx], Ae = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Te = [];
      for (const [He, Qe] of Ae) {
        const Ue = Y(ye[He]), ft = Y(ye[Qe]);
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
        const W = e.derivedNodes.rawVal, ee = (_b = (_a2 = e.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${ue.clientX}, ${ue.clientY}) nodes=${(W == null ? void 0 : W.length) ?? 0} elems=${(ee == null ? void 0 : ee.length) ?? 0} hover=`, L), ne++;
      }
      const j = L ? `${L.type}:${L.idx}` : "";
      if (j !== R) R = j, K(L, ue.clientX, ue.clientY);
      else if (L) {
        const W = ((_c = e.rendererElm.parentElement) == null ? void 0 : _c.getBoundingClientRect()) ?? e.rendererElm.getBoundingClientRect();
        G.style.left = `${ue.clientX - W.left}px`, G.style.top = `${ue.clientY - W.top}px`;
      }
    });
  };
  let ae = null;
  const Z = () => {
    R = "", h.visible = false, b.visible = false, z.visible = false, H.visible = false, se.visible = false, G.style.display = "none", e.render();
  }, fe = (ue) => {
    const L = e.rendererElm.getBoundingClientRect(), j = ue.clientX - L.left, W = ue.clientY - L.top;
    (j < -2 || W < -2 || j > L.width + 2 || W > L.height + 2) && (ae && clearTimeout(ae), ae = window.setTimeout(Z, 200));
  }, J = () => {
    ae && (clearTimeout(ae), ae = null);
  };
  e.rendererElm.addEventListener("pointermove", he), e.rendererElm.addEventListener("pointerleave", fe), e.rendererElm.addEventListener("pointerenter", J);
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
    const W = T(ue.clientX, ue.clientY);
    W ? (et({ type: W.type, idx: W.idx }, ue.shiftKey), Ze()) : vt();
  }), window.addEventListener("keydown", (ue) => {
    if (ue.key !== "Escape" || !N.length) return;
    const L = document.activeElement, j = !!L && (L.id === "hk3-cmd-input" || L.id === "hk-dyn-input") && L.value === "";
    L && (L.tagName === "INPUT" || L.tagName === "TEXTAREA" || L.isContentEditable) && !j || vt();
  }, { capture: true });
  function Pe() {
    for (const ue of I.children.slice()) {
      I.remove(ue);
      const L = ue.geometry;
      L && L !== d && L !== B && L.dispose();
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
      const W = Y(ue.idx);
      if (!W) return;
      const ee = new it(d, D);
      ee.position.copy(W), ee.scale.setScalar(Math.max(1e-4, 7 * me(W))), ee.renderOrder = 101, I.add(ee);
    } else if (ue.type === "frame" && j) {
      const W = j[ue.idx], ee = Y(W[0]), we = Y(W[1]);
      if (!ee || !we) return;
      const _e = ee.clone().add(we).multiplyScalar(0.5), ye = we.clone().sub(ee), Ae = ye.length(), Te = e.getActiveCamera().position.distanceTo(_e), He = new it(B, oe);
      He.position.copy(_e);
      const Qe = new E(0, 1, 0);
      He.quaternion.setFromAxisAngle(Qe.clone().cross(ye).normalize(), Qe.angleTo(ye)), He.scale.set(Te * 35e-4, Ae, Te * 35e-4), He.renderOrder = 101, I.add(He);
    } else if (ue.type === "shell" && j) {
      const W = j[ue.idx], ee = [], we = [];
      for (const Ae of W) {
        const Te = Y(Ae);
        if (!Te) return;
        ee.push(Te.x, Te.y, Te.z);
      }
      W.length === 4 ? we.push(0, 1, 2, 0, 2, 3) : W.length === 3 && we.push(0, 1, 2);
      const _e = new Fe();
      _e.setAttribute("position", new St(ee, 3)), _e.setIndex(we), _e.computeVertexNormals();
      const ye = new it(_e, ie);
      ye.renderOrder = 101, I.add(ye);
    } else if (ue.type === "solid" && j) {
      const W = j[ue.idx], ee = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], we = [];
      for (const [Ae, Te] of ee) {
        const He = Y(W[Ae]), Qe = Y(W[Te]);
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
      for (const W of ue) for (let ee = 0; ee < 3; ee++) W[ee] < L[ee] && (L[ee] = W[ee]), W[ee] > j[ee] && (j[ee] = W[ee]);
      Math.max(j[0] - L[0], j[1] - L[1], j[2] - L[2], 0.1);
    }
    for (const L of N) De(L);
    e.render();
  }
  function et(ue, L) {
    const j = N.findIndex((W) => W.type === ue.type && W.idx === ue.idx);
    j >= 0 ? N.splice(j, 1) : L || N.push(ue), N.length && N[N.length - 1];
  }
  function vt() {
    N.length = 0, Ze();
  }
  return te.derive(() => {
    e.derivedNodes.val, N.length && Ze();
  }), l;
}
function ni(e, l, d, u, h, y) {
  const v = h - d, b = y - u, g = v * v + b * b;
  if (g < 1e-9) {
    const be = e - d, se = l - u;
    return Math.sqrt(be * be + se * se);
  }
  let z = ((e - d) * v + (l - u) * b) / g;
  z = Math.max(0, Math.min(1, z));
  const V = d + z * v, M = u + z * b, H = e - V, xe = l - M;
  return Math.sqrt(H * H + xe * xe);
}
function oi(e, l, d) {
  let u = false;
  for (let h = 0, y = d.length - 1; h < d.length; y = h++) {
    const v = d[h].x, b = d[h].y, g = d[y].x, z = d[y].y;
    b > l != z > l && e < (g - v) * (l - b) / (z - b + 1e-12) + v && (u = !u);
  }
  return u;
}
const si = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, ai = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, rn = 1e-3;
function Vn(e, l) {
  return l === "XZ" ? { u: e[0], v: e[2], fuera: e[1] } : l === "YZ" ? { u: e[1], v: e[2], fuera: e[0] } : { u: e[0], v: e[1], fuera: e[2] };
}
function ii(e, l) {
  const d = Math.abs(l[0] - e[0]);
  return Math.abs(l[1] - e[1]) < rn ? { plano: "XZ", en: e[1] } : d < rn ? { plano: "YZ", en: e[0] } : { plano: "XY", en: e[2] };
}
function li(e, l) {
  var _a2, _b;
  let d = null, u = { plano: "XZ", en: 0 };
  const h = () => {
    var _a3, _b2;
    const B = ((_a3 = l == null ? void 0 : l.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.val);
    return !B || B === "none" ? null : String(B).replace(/^contour:/, "");
  }, y = (B) => {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], N = /* @__PURE__ */ new Set();
    for (const I of le) {
      if (I.length !== 2) continue;
      const G = ie[I[0]], Y = ie[I[1]];
      if (!G || !Y) continue;
      const T = Vn(G, B), K = Vn(Y, B);
      Math.abs(T.fuera - K.fuera) < rn && N.add(Math.round(T.fuera * 1e3) / 1e3);
    }
    return [...N].sort((I, G) => I - G);
  };
  function v(B) {
    var _a3, _b2;
    if (B == null ? void 0 : B.plano) u = { plano: B.plano, en: B.en ?? y(B.plano)[0] ?? 0 };
    else {
      const le = [...window.__hekatanModelSelection ?? []].reverse().find((G) => G.type === "frame"), N = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], I = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [];
      le && I[le.idx] && N[I[le.idx][0]] && N[I[le.idx][1]] ? u = ii(N[I[le.idx][0]], N[I[le.idx][1]]) : u = { plano: "XZ", en: y("XZ")[0] ?? 0 };
    }
    d || b(), d.hidden = false, g();
  }
  function b() {
    d = document.createElement("div"), d.id = "hk-diagrama-2d", d.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), d.innerHTML = `
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
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(d), d.querySelector(".hk-d2-x").addEventListener("click", () => {
      d.hidden = true;
    });
    const B = d.querySelector(".hk-d2-plano"), ie = d.querySelector(".hk-d2-en");
    B.addEventListener("change", () => {
      u = { plano: B.value, en: y(B.value)[0] ?? 0 }, g();
    }), ie.addEventListener("change", () => {
      u.en = Number(ie.value), g();
    });
    const le = (G) => {
      const Y = y(u.plano), T = Y.findIndex((R) => Math.abs(R - u.en) < rn), K = Math.max(0, Math.min(Y.length - 1, (T < 0 ? 0 : T) + G));
      Y.length && (u.en = Y[K], g());
    };
    d.querySelector(".hk-d2-ant").addEventListener("click", () => le(-1)), d.querySelector(".hk-d2-sig").addEventListener("click", () => le(1));
    const N = d.querySelector(".hk-d2-bar");
    let I = null;
    N.addEventListener("pointerdown", (G) => {
      if (G.target.closest("select,button")) return;
      const Y = d.getBoundingClientRect();
      I = { x: G.clientX, y: G.clientY, l: Y.left, t: Y.top }, d.style.transform = "none", d.style.left = Y.left + "px", d.style.top = Y.top + "px";
    }), window.addEventListener("pointermove", (G) => {
      !I || !d || (d.style.left = I.l + G.clientX - I.x + "px", d.style.top = I.t + G.clientY - I.y + "px");
    }), window.addEventListener("pointerup", () => {
      I = null;
    }), new ResizeObserver(() => {
      d && !d.hidden && g();
    }).observe(d);
  }
  function g() {
    var _a3, _b2, _c, _d, _e2, _f, _g, _h;
    if (!d || d.hidden) return;
    const B = new Set(M && !M.hidden && H >= 0 ? be(H) : []), ie = d.querySelector(".hk-d2-svg"), le = d.querySelector(".hk-d2-tit"), N = d.querySelector(".hk-d2-pie"), I = d.querySelector(".hk-d2-plano"), G = d.querySelector(".hk-d2-en");
    I.value = u.plano;
    const Y = y(u.plano), T = u.plano === "XZ" ? "y" : u.plano === "YZ" ? "x" : "z", K = u.plano === "XY" ? "Planta" : "P\xF3rtico";
    G.innerHTML = Y.map((Me, Ee) => `<option value="${Me}" ${Math.abs(Me - u.en) < rn ? "selected" : ""}>${K} ${Ee + 1} \xB7 ${T} = ${Me.toFixed(2)} m</option>`).join("");
    const R = h(), $ = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ne = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], pe = R ? (_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) == null ? void 0 : _d[R] : null;
    ie.innerHTML = "";
    const he = ie.clientWidth || 880, ae = ie.clientHeight || 480, Z = [];
    if (ne.forEach((Me, Ee) => {
      if (Me.length !== 2) return;
      const ct = $[Me[0]], Ge = $[Me[1]];
      if (!ct || !Ge) return;
      const at = Vn(ct, u.plano), ht = Vn(Ge, u.plano);
      Math.abs(at.fuera - u.en) < rn && Math.abs(ht.fuera - u.en) < rn && Z.push({ i: Ee, a: at, b: ht });
    }), !Z.length) {
      N.textContent = "No hay barras en este plano.", le.textContent = "";
      return;
    }
    let fe = 1 / 0, J = -1 / 0, ge = 1 / 0, ve = -1 / 0;
    for (const Me of Z) for (const Ee of [Me.a, Me.b]) fe = Math.min(fe, Ee.u), J = Math.max(J, Ee.u), ge = Math.min(ge, Ee.v), ve = Math.max(ve, Ee.v);
    const Pe = J - fe || 1, me = ve - ge || 1, De = 0.12 * Math.max(Pe, me), Ze = 46, et = Math.min((he - 2 * Ze) / (Pe + 2 * De), (ae - 2 * Ze) / (me + 2 * De)), vt = (he - Pe * et) / 2, ue = (ae - me * et) / 2, L = (Me) => vt + (Me - fe) * et, j = (Me) => ae - (ue + (Me - ge) * et), W = "http://www.w3.org/2000/svg", ee = (Me, Ee, ct) => {
      const Ge = document.createElementNS(W, Me);
      for (const at in Ee) Ge.setAttribute(at, String(Ee[at]));
      return ct != null && (Ge.textContent = ct), ie.appendChild(Ge), Ge;
    }, we = /* @__PURE__ */ new Map();
    for (const Me of Z) {
      const Ee = ((_h = (_g = (_f = (_e2 = e.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Me.i)) ?? 0, ct = Vn(Ls(R ?? "normals", $s($[ne[Me.i][0]], $[ne[Me.i][1]], Ee)), u.plano), Ge = Math.hypot(ct.u, ct.v);
      we.set(Me.i, Ge > 0.3 ? [ct.u / Ge, -ct.v / Ge] : null);
    }
    const _e = Z.filter((Me) => !we.get(Me.i)).length;
    let ye = 0;
    if (pe) for (const Me of Z) {
      if (!we.get(Me.i)) continue;
      const Ee = pe instanceof Map ? pe.get(Me.i) : pe[Me.i];
      Ee && (ye = Math.max(ye, Math.abs(Ee[0] ?? 0), Math.abs(Ee[1] ?? 0)));
    }
    const Ae = 0.12 * Math.max(Pe, me) * et, Te = ye > 0 ? Ae / ye : 0, He = R === "bendingsY" || R === "bendingsZ", Qe = (Me) => Math.abs(Me) >= 100 ? Me.toFixed(1) : Math.abs(Me) >= 10 ? Me.toFixed(2) : Me.toFixed(3), Ue = [];
    for (const Me of Z) {
      const Ee = L(Me.a.u), ct = j(Me.a.v), Ge = L(Me.b.u), at = j(Me.b.v), ht = we.get(Me.i), [Be, Le] = ht ?? [0, 0], ze = pe && ht ? pe instanceof Map ? pe.get(Me.i) : pe[Me.i] : null, [Je, Ce] = ze ? Lo(R, ze) : [0, 0];
      if (ze && Te > 0) {
        const Ve = [Ee + Be * Je * Te * 1, ct + Le * Je * Te * 1], tt = [Ge + Be * Ce * Te * 1, at + Le * Ce * Te * 1], Kt = Je + Ce >= 0 ? "#3fa7d6" : "#d9534f";
        ee("polygon", { points: `${Ee},${ct} ${Ve[0]},${Ve[1]} ${tt[0]},${tt[1]} ${Ge},${at}`, fill: Kt, "fill-opacity": 0.38, stroke: Kt, "stroke-width": 1.2 }), Ue.push({ x: Ve[0] + Be * 12, y: Ve[1] + Le * 12, t: Qe(Je), peso: Math.abs(Je) }), Ue.push({ x: tt[0] + Be * 12, y: tt[1] + Le * 12, t: Qe(Ce), peso: Math.abs(Ce) });
      }
      ee("line", { x1: Ee, y1: ct, x2: Ge, y2: at, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), B.has(Me.i) && ee("line", { x1: Ee, y1: ct, x2: Ge, y2: at, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const Ne = ee("line", { x1: Ee, y1: ct, x2: Ge, y2: at, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      Ne.addEventListener("click", () => se(Me.i));
      const dt = document.createElementNS(W, "title");
      dt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", Ne.appendChild(dt);
    }
    for (const Me of Z) for (const Ee of [Me.a, Me.b]) u.plano !== "XY" && Math.abs(Ee.v - ge) < rn && ee("rect", { x: L(Ee.u) - 6, y: j(Ee.v), width: 12, height: 7, fill: "#b03a3a" });
    const ft = [];
    Ue.sort((Me, Ee) => Ee.peso - Me.peso);
    for (const Me of Ue) Me.peso < 0.02 * ye || ft.some((Ee) => Math.hypot(Ee.x - Me.x, Ee.y - Me.y) < 34) || (ft.push(Me), ee("text", { x: Me.x, y: Me.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, Me.t));
    const We = R ? si[R] ?? R : "sin resultado";
    le.textContent = `${We} \xB7 ${u.plano === "XY" ? "planta" : "alzado"} ${u.plano} en ${T} = ${u.en.toFixed(2)} m`, N.textContent = R ? `${Z.length} barras en el plano \xB7 m\xE1ximo ${Qe(ye)} ${ai[R] ?? ""}` + (He ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (_e ? ` \xB7 ${_e} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const z = () => {
    try {
      g();
    } catch {
    }
  };
  (l == null ? void 0 : l.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    l.frameResults.val, z();
  }));
  let V = null;
  setInterval(() => {
    var _a3, _b2;
    const B = (_a3 = e.analyzeOutputs) == null ? void 0 : _a3.rawVal, ie = (_b2 = l == null ? void 0 : l.frameResults) == null ? void 0 : _b2.rawVal, le = [B, ie];
    if (!(V && V[0] === B && V[1] === ie)) {
      V = le, z();
      try {
        oe();
      } catch {
      }
    }
  }, 400);
  let M = null, H = -1, xe = "12";
  function be(B) {
    var _a3, _b2;
    const ie = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], le = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], N = /* @__PURE__ */ new Map();
    le.forEach((T, K) => {
      if (T.length === 2) for (const R of T) N.has(R) || N.set(R, []), N.get(R).push(K);
    });
    const I = (T) => {
      const K = ie[le[T][0]], R = ie[le[T][1]], $ = [R[0] - K[0], R[1] - K[1], R[2] - K[2]], ne = Math.hypot($[0], $[1], $[2]) || 1;
      return $.map((pe) => pe / ne);
    }, G = (T, K) => {
      const R = I(T), $ = I(K);
      return Math.abs(R[0] * $[0] + R[1] * $[1] + R[2] * $[2]) > 0.9999;
    }, Y = [B];
    for (const T of [0, 1]) {
      let K = B, R = le[B][T];
      for (let $ = 0; $ < 500; $++) {
        const ne = (N.get(R) ?? []).filter((he) => he !== K);
        if (ne.length !== 1 || !G(K, ne[0])) break;
        const pe = ne[0];
        T === 0 ? Y.unshift(pe) : Y.push(pe), R = le[pe][0] === R ? le[pe][1] : le[pe][0], K = pe;
      }
    }
    return Y;
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
    H = B, M || (M = document.createElement("div"), M.id = "hk-diagrama-barra", M.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), M.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(M), M.querySelector(".hk-b-x").addEventListener("click", () => {
      M.hidden = true, D(), g();
    }), M.querySelector(".hk-b-pl").addEventListener("change", (ie) => {
      xe = ie.target.value, oe();
    })), M.hidden = false, D(), oe(), g();
  }
  function D() {
    if (!d || !M) return;
    const B = window.innerWidth, ie = Math.min(560, Math.round(B * 0.4));
    M.style.width = ie + "px", !M.hidden && !d.hidden ? (d.style.transform = "none", d.style.left = "12px", d.style.width = B - ie - 36 + "px", M.style.top = d.getBoundingClientRect().top + "px") : d.hidden || (d.style.left = "50%", d.style.transform = "translateX(-50%)", d.style.width = "min(900px,92vw)");
  }
  function oe() {
    var _a3, _b2, _c;
    if (!M || M.hidden || H < 0) return;
    const B = ((_a3 = e.nodes) == null ? void 0 : _a3.rawVal) ?? [], ie = ((_b2 = e.elements) == null ? void 0 : _b2.rawVal) ?? [], le = ((_c = e.analyzeOutputs) == null ? void 0 : _c.rawVal) ?? {};
    if (!ie[H]) return;
    const N = be(H), I = [];
    let G = 0, Y = -1;
    N.forEach((J, ge) => {
      const [ve, Pe] = ie[J], me = ge === 0 ? N.length > 1 && ie[N[1]].includes(ve) : ve !== Y, De = me ? Pe : ve, Ze = me ? ve : Pe, et = Math.hypot(B[Ze][0] - B[De][0], B[Ze][1] - B[De][1], B[Ze][2] - B[De][2]);
      I.push({ x: G, e: J, fin: me ? 1 : 0 }), G += et, I.push({ x: G, e: J, fin: me ? 0 : 1 }), Y = Ze;
    });
    const T = G, K = (J, ge) => {
      const ve = le[J], Pe = ve ? ve instanceof Map ? ve.get(ge.e) : ve[ge.e] : null;
      return Pe ? Lo(J, Pe)[ge.fin] : 0;
    }, R = B[ie[N[0]][0]], $ = (J) => J.toFixed(2);
    M.querySelector(".hk-b-tit").textContent = "L = " + T.toFixed(2) + " m \xB7 " + N.length + " tramo(s) \xB7 desde (" + $(R[0]) + ", " + $(R[1]) + ", " + $(R[2]) + ")";
    const ne = xe === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], pe = M.querySelector(".hk-b-cuerpo");
    pe.innerHTML = "";
    const he = Math.max(300, pe.clientWidth), ae = 124, Z = 46, fe = (ae - 14) / 2;
    for (const [J, ge, ve, Pe] of ne) {
      const me = I.map((ye) => K(J, ye)), De = Math.max(...me), Ze = Math.min(...me), et = Math.max(Math.abs(De), Math.abs(Ze)) || 1, vt = (ye) => Z + ye / (T || 1) * (he - 2 * Z), ue = (ye) => fe + (Pe ? 1 : -1) * (ye / et) * (fe - 16), L = (ye) => Math.abs(ye) >= 100 ? ye.toFixed(1) : Math.abs(ye) >= 10 ? ye.toFixed(2) : ye.toFixed(3);
      let j = vt(0) + "," + fe + " ";
      I.forEach((ye, Ae) => {
        j += vt(ye.x) + "," + ue(me[Ae]) + " ";
      }), j += vt(T) + "," + fe;
      const W = me.indexOf(De), ee = me.indexOf(Ze), we = (ye, Ae) => {
        const Te = ue(me[ye]) + (ue(me[ye]) < fe ? -5 : 13);
        return '<text x="' + vt(I[ye].x) + '" y="' + Te + '" text-anchor="middle" fill="' + Ae + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + L(me[ye]) + "</text>";
      }, _e = Pe ? "#d9534f" : "#3fa7d6";
      pe.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + ge + ' <span style="color:#6f7d90;font-weight:400">(' + ve + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + L(De) + " \xB7 m\xEDn " + L(Ze) + (Pe ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + he + '" height="' + ae + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + Z + '" y1="' + fe + '" x2="' + (he - Z) + '" y2="' + fe + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + j + '" fill="' + _e + '" fill-opacity=".35" stroke="' + _e + '" stroke-width="1.4"/>' + we(0, "#f2f5fa") + we(I.length - 1, "#f2f5fa") + (W > 0 && W < I.length - 1 ? we(W, "#8fd3ff") : "") + (ee > 0 && ee < I.length - 1 && ee !== W ? we(ee, "#ff9f9a") : "") + '<text x="' + Z + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (he - Z) + '" y="' + (ae - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + T.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = se, window.__hekatanDiagrama2D = v, { abrir: v, abrirBarra: se };
}
function _s(e, l = 8) {
  const d = document.createElement("div");
  d.id = "legend", d.style.setProperty("--legend-n", String(l)), setTimeout(() => {
    te.derive(() => {
      io.val, d.style.background = xa();
    });
  });
  const u = document.createElement("div");
  u.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", d.appendChild(u), setTimeout(() => {
    te.derive(() => {
      u.textContent = Io.val ? `[${Io.val}]` : "";
    });
  });
  const h = Array.from({ length: l + 1 }, (g, z) => z / l).reverse();
  let y, v;
  h.forEach((g, z) => {
    y = document.createElement("div"), y.id = `marker-${z}`, y.className = "marker", y.style.marginTop = z == 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)", v = document.createElement("p"), v.id = `marker-text-${z}`, y.append(v), d.append(y);
  });
  const b = [];
  return d.querySelectorAll("p").forEach((g) => b.push(g)), setTimeout(() => {
    te.derive(() => {
      h.forEach((g, z) => {
        const V = b[z];
        V && (V.innerText = ri(e.val, g).toString());
      });
    });
  }), d;
}
function ri(e, l) {
  const d = Ln.val;
  if (d) return ks(d[0] + l * (d[1] - d[0]));
  const u = e.filter((v) => Number.isFinite(v));
  if (u.length === 0) return "0";
  const [h, y] = Ro(u);
  return ks(h + l * (y - h));
}
function ks(e) {
  if (!Number.isFinite(e)) return "\u2014";
  if (e === 0) return "0";
  const l = Math.abs(e);
  return l < 1e-3 || l >= 1e5 ? e.toExponential(2) : e.toPrecision(3);
}
function vi({ mesh: e, settingsObj: l, drawingObj: d, objects3D: u, solids: h }) {
  ma.DEFAULT_UP = new E(0, 0, 1);
  const y = document.createElement("div"), v = new pa(), b = new ua(45, 1, 0.1, 2 * 1e6), g = new fa(-10, 10, 10, -10, -1e3, 2e6);
  let z = b;
  const V = new ha({ antialias: true });
  V.localClippingEnabled = true;
  const M = new gs(b, V.domElement);
  M.enableDamping = true, M.dampingFactor = 0.1, M.screenSpacePanning = true, M.zoomSpeed = 0.8, M.panSpeed = 1.2, M.rotateSpeed = 0.9, M.keyPanSpeed = 12, M.listenToKeyEvents(window), M.touches = { ONE: Qn.ROTATE, TWO: Qn.DOLLY_PAN }, V.domElement.addEventListener("wheel", (L) => {
    if (!L.ctrlKey && Math.abs(L.deltaX) > Math.abs(L.deltaY) * 1.5) {
      L.preventDefault();
      const j = M.target, W = new E().subVectors(b.position, j), ee = new E();
      ee.crossVectors(b.up, W).normalize();
      const _e = W.length() * 1e-3 * M.panSpeed;
      j.addScaledVector(ee, L.deltaX * _e), b.position.addScaledVector(ee, L.deltaX * _e), M.update();
    }
  }, { passive: false });
  const H = new Fo(new E(-1, 0, 0), 0), xe = new Fo(new E(0, -1, 0), 0), be = new Fo(new E(0, 0, -1), 0);
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
    const W = window.__hekatanPanes ?? [];
    for (const ee of W) try {
      ee && typeof ee.refresh == "function" && ee.refresh();
    } catch {
    }
    V.render(v, z);
  }
  se(), window.__hekatanClipApply = se;
  const D = ba(l), oe = te.derive(() => Math.pow(10, D.displayScale.val / 10)), B = ci(e, D), ie = () => {
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
      const W = j.material;
      if (!W || !("opacity" in W)) return;
      const ee = j.name ?? "";
      let we = 0.55;
      ee.includes("border") ? we = 1 : ee.includes("major") && (we = 0.95), W.opacity = L * we;
    });
  };
  I(), y.appendChild(va(D, e, h)), y.setAttribute("id", "viewer"), y.appendChild(V.domElement), V.setPixelRatio(window.devicePixelRatio);
  const G = un();
  V.setClearColor(G.background, 1);
  const Y = D.gridSize.rawVal, T = Y * 0.5 + Y * 0.5 / Math.tan(45 * 0.5);
  b.position.set(0, 0, T), b.up.set(0, 1, 0), M.target.set(0, 0, 0), M.minDistance = 0.1, M.maxDistance = 1e4, y.__settings = D, M.zoomSpeed = 1, M._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, M.update();
  let K = bs(D.gridSize.rawVal, D.flipAxes.rawVal);
  v.add(N, K), te.derive(() => {
    window.__hekatanGridPlaneXY = D.gridXY.val, window.__hekatanGridPlaneXZ = D.gridXZ.val, window.__hekatanGridPlaneYZ = D.gridYZ.val;
  });
  let R = true;
  te.derive(() => {
    const L = D.gridVisible.val;
    if (R) {
      R = false;
      return;
    }
    N.visible = L, J();
  });
  let $ = true;
  te.derive(() => {
    if (D.gridOpacity.val, $) {
      $ = false;
      return;
    }
    I(), J();
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
    }), N = Eo(L, le()), N.visible = D.gridVisible.rawVal, v.add(N), I(), v.remove(K), K.traverse((_e) => {
      var _a3, _b2, _c2, _d;
      (_b2 = (_a3 = _e.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c2 = _e.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), K = bs(L, j), v.add(K);
    const W = L * 0.5 + L * 0.5 / Math.tan(45 * 0.5);
    b.position.distanceTo(M.target);
    const ee = Math.abs(b.position.x) < 0.1 && Math.abs(b.position.y) < 0.1 && b.position.z > 0;
    (((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.rawVal) ?? ((_c = e == null ? void 0 : e.nodes) == null ? void 0 : _c.val) ?? []).length > 0 || (ee ? b.position.set(0, 0, W) : b.position.set(0.5 * L, -W, 0.5 * L), M.target.set(0, 0, 0)), M.minDistance = Math.max(0.05, L * 0.01), M.maxDistance = Math.max(50, L * 50), M.update(), J();
  }), new ResizeObserver((L) => {
    var _a2, _b;
    for (const j of L) {
      const W = (_a2 = j.target) == null ? void 0 : _a2.clientWidth, ee = (_b = j.target) == null ? void 0 : _b.clientHeight;
      if (W === 0 || ee === 0) continue;
      const _e = (he ? W / 2 : W) / ee;
      b.aspect = _e, b.updateProjectionMatrix();
      const ye = g.top;
      if (g.left = -ye * _e, g.right = ye * _e, g.updateProjectionMatrix(), ae && ae.isPerspectiveCamera) ae.aspect = _e, ae.updateProjectionMatrix();
      else if (ae && ae.isOrthographicCamera) {
        const Ae = ae, Te = Ae.top;
        Ae.left = -Te * _e, Ae.right = Te * _e, Ae.updateProjectionMatrix();
      }
      V.setSize(W, ee), J();
    }
  }).observe(y), M.addEventListener("change", J), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    (_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val, (_b = e == null ? void 0 : e.elements) == null ? void 0 : _b.val, (_c = e == null ? void 0 : e.nodeInputs) == null ? void 0 : _c.val, (_d = e == null ? void 0 : e.elementInputs) == null ? void 0 : _d.val, (_e = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _e.val, (_f = e == null ? void 0 : e.analyzeOutputs) == null ? void 0 : _f.val, D.displayScale.val, D.nodes.val, D.elements.val, (_g = D.edges) == null ? void 0 : _g.val, D.elemColumns.val, D.elemBeams.val, D.nodesIndexes.val, D.elementsIndexes.val, D.orientations.val, D.sections.val, D.secColumns.val, D.secBeams.val, D.secFloor.val, D.supports.val, D.loads.val, D.deformedShape.val, D.nodeResults.val, D.frameResults.val, D.shellResults.val, (_h = D.solidResults) == null ? void 0 : _h.val, (_i = D.extruded) == null ? void 0 : _i.val, setTimeout(J);
  });
  let he = false, ae = null, Z = null, fe = false;
  function J() {
    const L = y.clientWidth || 1, j = y.clientHeight || 1;
    if (!he || !ae) {
      V.setScissorTest(false), V.setViewport(0, 0, L, j), V.render(v, z);
      return;
    }
    const W = L / 2;
    V.setScissorTest(true), V.setViewport(0, 0, W, j), V.setScissor(0, 0, W, j), V.render(v, z), V.setViewport(W, 0, W, j), V.setScissor(W, 0, W, j), V.render(v, ae), V.setScissorTest(false);
  }
  function ge(L) {
    z = L, M.object = L, M.update(), J();
  }
  function ve(L, j) {
    he = L, j && (ae = j);
    const W = y.clientWidth || 1, ee = y.clientHeight || 1, _e = (L ? W / 2 : W) / ee;
    b.isPerspectiveCamera && (b.aspect = _e, b.updateProjectionMatrix());
    const ye = g.top;
    if (g.left = -ye * _e, g.right = ye * _e, g.updateProjectionMatrix(), L && ae) {
      if (Z ? (Z.object = ae, Z.update()) : (Z = new gs(ae, V.domElement), Z.enableDamping = true, Z.dampingFactor = 0.1, Z.screenSpacePanning = true, Z.zoomSpeed = 0.8, Z.panSpeed = 1.2, Z.rotateSpeed = 0.9, Z.touches = { ONE: Qn.ROTATE, TWO: Qn.DOLLY_PAN }, Z.target.copy(M.target), Z.addEventListener("change", J), Z.enabled = false), !fe) {
        const Ae = (Te) => {
          if (!he || !Z) return;
          const He = V.domElement.getBoundingClientRect(), Qe = Te.clientX - He.left, Ue = He.width / 2, ft = Qe >= Ue;
          M.enabled = !ft, Z.enabled = ft;
        };
        V.domElement.addEventListener("pointerdown", Ae, true), V.domElement.addEventListener("wheel", Ae, { capture: true, passive: true }), fe = true;
      }
    } else L || (M.enabled = true, Z && (Z.enabled = false));
    y.__splitMode = L, window.__hekatanSplitMode = L, window.__hekatanSplitCamera = L ? ae : null, J();
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
    const L = ti({ scene: v, rendererElm: V.domElement, getActiveCamera: () => z, derivedNodes: B, derivedDisplayScale: oe, mesh: e, settings: D, render: J });
    v.add(L);
    const j = mi(e, D), W = Ya(e, D, B, j), ee = _s(j);
    v.add(W), y.appendChild(ee);
    const we = Ga(e, D, B);
    v.add(we);
    const _e = we.__colorMapValues, ye = _s(_e);
    ye.id = "frame-legend", y.appendChild(ye), te.derive(() => {
      var _a2;
      const Ae = D.shellResults.val != "none", Te = (((_a2 = D.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", He = Ae || Te, Qe = D.frameResults.val.startsWith("contour:"), Ue = j.val.some((ft) => Number.isFinite(ft));
      ee.hidden = !He || !Ue, W.visible = He, ye.hidden = !Qe;
    });
  }
  if (h) {
    const L = new zs(16777215, 0.5);
    v.add(L);
    const j = new so(16777215, 0.5);
    j.position.set(30, 25, -10), j.shadow.mapSize.width = 1024, j.shadow.mapSize.height = 1024, v.add(j);
    const W = 10;
    j.shadow.camera.left = -W, j.shadow.camera.right = W, j.shadow.camera.top = W, j.shadow.camera.bottom = -W, j.shadow.camera.far = 1e3;
    const ee = new so(16777215, 0.5);
    ee.color.setHSL(11, 43, 96), ee.position.set(-10, 0, 30), v.add(ee), te.derive(() => {
      (h == null ? void 0 : h.val.length) && (v.remove(...h.oldVal), v.add(...h.rawVal), J());
    }), te.derive(() => {
      h.rawVal.forEach((we) => we.visible = D.solids.val), J();
    });
  }
  if (u) {
    const L = [], j = (ee) => {
      var _a2;
      return ((_a2 = ee == null ? void 0 : ee.userData) == null ? void 0 : _a2.isCota) ? D.showCotas.val : D.custom3D.val;
    }, W = () => {
      for (const ee of L) ee.visible = j(ee);
      J();
    };
    te.derive(() => {
      const ee = u.val;
      L.length && (v.remove(...L), L.length = 0), ee.length && (v.add(...ee), L.push(...ee), W()), J();
    }), te.derive(() => {
      D.custom3D.val, W();
    }), te.derive(() => {
      D.showCotas.val, W();
    });
  }
  d && Na({ drawingObj: d, gridObj: N, scene: v, getActiveCamera: () => z, controls: M, gridSize: Y, derivedDisplayScale: oe, rendererElm: V.domElement, viewerRender: J }), Ps((L, j) => {
    var _a2;
    V.setClearColor(j.background, 1), v.remove(N), (_a2 = N.traverse) == null ? void 0 : _a2.call(N, (W) => {
      var _a3, _b, _c, _d;
      (_b = (_a3 = W.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c = W.material) == null ? void 0 : _c.dispose) == null ? void 0 : _d.call(_c);
    }), N = Eo(D.gridSize.rawVal, { planes: ie() }), v.add(N), y.style.setProperty("--awatif-legend-color", j.legendMarker), J();
  });
  const Pe = { scene: v, perspCamera: b, orthoCamera: g, get camera() {
    return z;
  }, controls: M, renderer: V, rendererElm: V.domElement, render: J, setActiveCamera: ge, setSplitMode: ve, get splitMode() {
    return he;
  }, get splitCamera() {
    return ae;
  }, settings: D };
  y.__ctx = Pe;
  const me = document.createElement("div");
  me.id = "hk-nav-camara", me.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const De = (L, j, W) => {
    const ee = document.createElement("button");
    return ee.textContent = L, ee.title = j, ee.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ee.onmouseenter = () => {
      ee.style.background = "rgba(70,70,70,0.9)";
    }, ee.onmouseleave = () => {
      ee.style.background = "rgba(40,40,40,0.85)";
    }, ee.onclick = (we) => {
      we.preventDefault(), W();
    }, ee;
  }, Ze = (L, j) => {
    const W = M.target, ee = new E().subVectors(z.position, W), we = ee.length(), _e = new E(), ye = new E();
    _e.crossVectors(z.up, ee).normalize(), ye.copy(z.up).normalize();
    const Ae = we * 0.05;
    W.addScaledVector(_e, -L * Ae), W.addScaledVector(ye, j * Ae), z.position.addScaledVector(_e, -L * Ae), z.position.addScaledVector(ye, j * Ae), M.update(), J();
  }, et = (L) => {
    const j = new E().subVectors(z.position, M.target);
    j.multiplyScalar(L), z.position.copy(M.target).add(j), M.update(), J();
  }, vt = () => {
    const L = document.createElement("div");
    return L.style.cssText = "width:32px;height:32px;", L;
  };
  return me.append(vt()), me.append(De("\u2191", "Pan arriba", () => Ze(0, 1))), me.append(De("\u2295", "Zoom in", () => et(0.85))), me.append(De("\u2190", "Pan izquierda", () => Ze(-1, 0))), me.append(De("\u2302", "Reset vista", () => {
    M.reset(), J();
  })), me.append(De("\u2192", "Pan derecha", () => Ze(1, 0))), me.append(De("\u2296", "Zoom out", () => et(1.18))), me.append(De("\u2193", "Pan abajo", () => Ze(0, -1))), me.append(vt()), getComputedStyle(y).position === "static" && (y.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && y.appendChild(me), y;
}
function ci(e, l) {
  return te.derive(() => {
    var _a2, _b, _c, _d;
    if (!l.deformedShape.val) return ((_a2 = e == null ? void 0 : e.nodes) == null ? void 0 : _a2.val) ?? [];
    const d = ((_b = e == null ? void 0 : e.nodes) == null ? void 0 : _b.val) ?? [], u = (_d = (_c = e == null ? void 0 : e.deformOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.deformations;
    if (!u || d.length === 0) return d;
    const h = l.deformScale.val, y = l.deformScale.val * l.deformScaleZ.val, v = Number.isFinite(h) ? h : 1, b = Number.isFinite(y) ? y : 1;
    return d.map((g, z) => {
      var _a3;
      const V = ((_a3 = u.get(z)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], M = Number.isFinite(V[0]) ? V[0] : 0, H = Number.isFinite(V[1]) ? V[1] : 0, xe = Number.isFinite(V[2]) ? V[2] : 0;
      return [g[0] + M * v, g[1] + H * v, g[2] + xe * b];
    });
  });
}
const Ln = te.state(null), Io = te.state(""), di = te.state("kN"), pi = te.state("mm"), ui = te.state("kN/m\xB2"), fi = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, Ss = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, hi = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76 };
function mi(e, l) {
  const d = te.state([]);
  let u;
  return ((h) => {
    h.bendingXX = "bendingXX", h.bendingYY = "bendingYY", h.bendingXY = "bendingXY", h.membraneXX = "membraneXX", h.membraneYY = "membraneYY", h.membraneXY = "membraneXY", h.tranverseShearX = "tranverseShearX", h.tranverseShearY = "tranverseShearY", h.membranePrincipalMax = "membranePrincipalMax", h.membranePrincipalMin = "membranePrincipalMin", h.bendingPrincipalMax = "bendingPrincipalMax", h.bendingPrincipalMin = "bendingPrincipalMin", h.transverseShearMax = "transverseShearMax", h.vonMises = "vonMises", h.pressure = "pressure", h.displacementX = "displacementX", h.displacementY = "displacementY", h.displacementZ = "displacementZ";
  })(u || (u = {})), te.derive(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D;
    const h = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), be = (L, j) => {
      L == null ? void 0 : L.forEach((W, ee) => {
        const we = e.elements.val[ee];
        if (we) for (let _e2 = 0; _e2 < we.length; _e2++) j.set(we[_e2], [W[_e2] ?? W[0]]);
      });
    };
    be((_b = (_a2 = e.analyzeOutputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.bendingXX, h), be((_d = (_c = e.analyzeOutputs) == null ? void 0 : _c.val) == null ? void 0 : _d.bendingYY, y), be((_f = (_e = e.analyzeOutputs) == null ? void 0 : _e.val) == null ? void 0 : _f.bendingXY, v), be((_h = (_g = e.analyzeOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.membraneXX, b), be((_j = (_i = e.analyzeOutputs) == null ? void 0 : _i.val) == null ? void 0 : _j.membraneYY, g), be((_l = (_k = e.analyzeOutputs) == null ? void 0 : _k.val) == null ? void 0 : _l.membraneXY, z), be((_n = (_m = e.analyzeOutputs) == null ? void 0 : _m.val) == null ? void 0 : _n.tranverseShearX, V), be((_p = (_o = e.analyzeOutputs) == null ? void 0 : _o.val) == null ? void 0 : _p.tranverseShearY, M), be((_r = (_q = e.analyzeOutputs) == null ? void 0 : _q.val) == null ? void 0 : _r.vonMises, H), be((_t = (_s2 = e.analyzeOutputs) == null ? void 0 : _s2.val) == null ? void 0 : _t.pressure, xe);
    const se = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), le = (L, j, W, ee, we) => {
      L.forEach((_e2, ye) => {
        var _a3, _b2;
        const Ae = _e2[0] ?? 0, Te = ((_a3 = j.get(ye)) == null ? void 0 : _a3[0]) ?? 0, He = ((_b2 = W.get(ye)) == null ? void 0 : _b2[0]) ?? 0, Qe = (Ae + Te) / 2, Ue = Math.hypot((Ae - Te) / 2, He);
        ee.set(ye, [Qe + Ue]), we.set(ye, [Qe - Ue]);
      });
    };
    le(b, g, z, se, D), le(h, y, v, oe, B), V.forEach((L, j) => {
      var _a3;
      ie.set(j, [Math.hypot(L[0] ?? 0, ((_a3 = M.get(j)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const N = (_v = (_u = e.analyzeOutputs) == null ? void 0 : _u.val) == null ? void 0 : _v.colorMapRanges, I = (_w = l.solidResults) == null ? void 0 : _w.val, Y = I && I !== "none" ? I : l.shellResults.val, T = N == null ? void 0 : N[Y], K = { bendingXX: [h, 0], bendingYY: [y, 0], bendingXY: [v, 0], membraneXX: [b, 0], membraneYY: [g, 0], membraneXY: [z, 0], tranverseShearX: [V, 0], tranverseShearY: [M, 0], membranePrincipalMax: [se, 0], membranePrincipalMin: [D, 0], bendingPrincipalMax: [oe, 0], bendingPrincipalMin: [B, 0], transverseShearMax: [ie, 0], vonMises: [H, 0], pressure: [xe, 0], displacementX: [(_y = (_x = e.deformOutputs) == null ? void 0 : _x.val) == null ? void 0 : _y.deformations, 0], displacementY: [(_A = (_z = e.deformOutputs) == null ? void 0 : _z.val) == null ? void 0 : _A.deformations, 1], displacementZ: [(_C = (_B = e.deformOutputs) == null ? void 0 : _B.val) == null ? void 0 : _C.deformations, 2] }, R = l.shellResults.val, $ = di.val, ne = pi.val, pe = R === "displacementX" || R === "displacementY" || R === "displacementZ", he = R === "bendingXX" || R === "bendingYY" || R === "bendingXY" || R === "bendingPrincipalMax" || R === "bendingPrincipalMin", ae = R === "membraneXX" || R === "membraneYY" || R === "membraneXY" || R === "membranePrincipalMax" || R === "membranePrincipalMin", Z = R === "vonMises" || R === "pressure", fe = R === "tranverseShearX" || R === "tranverseShearY" || R === "transverseShearMax", J = (_D = l.solidResults) == null ? void 0 : _D.val, ge = J === "vonMises" || J === "sigmaXX" || J === "sigmaYY" || J === "sigmaZZ" || J === "tauXY" || J === "tauYZ" || J === "tauXZ", ve = J === "ux" || J === "uy" || J === "uz", Pe = ui.val, me = ge ? hi[Pe] : ve || pe ? Ss[ne] : he || ae || Z || fe ? 1 / fi[$] : 1, De = ge ? Pe : ve || pe ? ne : he ? `${$}\xB7m/m` : ae ? `${$}/m\xB2` : Z ? `${$}/m\xB2` : fe ? `${$}/m` : "";
    Io.val = De, Ln.val = Array.isArray(T) && T.length === 2 ? [T[0] * me, T[1] * me] : null;
    const Ze = Vs.val, vt = J && J !== "none" ? [H, 0] : K[R], ue = [];
    if (e.nodes.val.forEach((L, j) => {
      const W = vt;
      if (!W || !W[0] || typeof W[0].has != "function") return;
      if (!W[0].has(j)) {
        ue.push(Number.NaN);
        return;
      }
      const ee = W[0].get(j), we = ee ? ee[W[1]] ?? 0 : 0;
      ue.push(we * me);
    }), !Ln.val && Ze !== "auto") {
      const L = e.nodes.val, j = /* @__PURE__ */ new Set(), W = (we, _e2) => {
        var _a3;
        const ye = (_a3 = L[we[0]]) == null ? void 0 : _a3[_e2];
        return we.every((Ae) => {
          var _a4;
          return Math.abs((((_a4 = L[Ae]) == null ? void 0 : _a4[_e2]) ?? NaN) - ye) < 1e-6;
        });
      };
      for (const we of e.elements.val) {
        if (we.length !== 4) continue;
        const _e2 = W(we, 2), ye = !_e2 && W(we, 0), Ae = !_e2 && W(we, 1);
        if (Ze === "losas" ? _e2 : Ze === "muros" ? ye || Ae : Ze === "murosX" ? ye : Ze === "murosY" ? Ae : false) for (const Qe of we) j.add(Qe);
      }
      const ee = [];
      for (const we of j) {
        const _e2 = ue[we];
        Number.isFinite(_e2) && ee.push(_e2);
      }
      ee.length && (Ln.val = Ro(ee));
    }
    d.val = ue;
  }), d;
}
export {
  ga as a,
  _s as b,
  di as c,
  pi as d,
  ui as e,
  vi as g
};
