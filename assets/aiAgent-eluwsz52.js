var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { l as $t, a0 as pn, a1 as Cl, v as xe, a2 as Sl, D as Pt, M as pt, B as ze, F as Mt, a3 as Ml, q as bt, a4 as $l, a5 as El, a6 as sa, h as ia, a7 as na, Y as Vs, a8 as _n, a9 as kn, $ as Vi, H as ft, L as is, b as mt, f as gt, p as Pa, c as Al, aa as Tl, V as te, I as ti, J as Bt, ab as Jn, u as Tn, d as Vt, a as Qn, A as Ra, k as Mn, t as zl, s as Li, P as Il, ac as Cn, n as eo, m as Fl, w as Ds, X as Ti, E as oa, S as gi, ad as to, ae as zi, g as aa, i as la, j as ra, C as ca, x as Pl, y as Rl, z as Dl, W as Ll, G as da, af as fn, N as so, O as Nl, ag as Ol, _ as Vl } from "./Text-Br8EG2up.js";
import { P as Da } from "./tweakpane-BXg6ZhiP.js";
class La {
  constructor(e, t = 32) {
    this.isLut = true, this.lut = [], this.map = [], this.n = 0, this.minV = 0, this.maxV = 1, this.setColorMap(e, t);
  }
  set(e) {
    return e.isLut === true && this.copy(e), this;
  }
  setMin(e) {
    return this.minV = e, this;
  }
  setMax(e) {
    return this.maxV = e, this;
  }
  setColorMap(e, t = 32) {
    this.map = io[e] || io.rainbow, this.n = t;
    const s = 1 / this.n, i = new $t(), n = new $t();
    this.lut.length = 0, this.lut.push(new $t(this.map[0][1]));
    for (let o = 1; o < t; o++) {
      const a = o * s;
      for (let l = 0; l < this.map.length - 1; l++) if (a > this.map[l][0] && a <= this.map[l + 1][0]) {
        const c = this.map[l][0], h = this.map[l + 1][0];
        i.setHex(this.map[l][1], pn), n.setHex(this.map[l + 1][1], pn);
        const p = new $t().lerpColors(i, n, (a - c) / (h - c));
        this.lut.push(p);
      }
    }
    return this.lut.push(new $t(this.map[this.map.length - 1][1])), this;
  }
  copy(e) {
    return this.lut = e.lut, this.map = e.map, this.n = e.n, this.minV = e.minV, this.maxV = e.maxV, this;
  }
  getColor(e) {
    e = Cl.clamp(e, this.minV, this.maxV), e = (e - this.minV) / (this.maxV - this.minV);
    const t = Math.round(e * this.n);
    return this.lut[t];
  }
  addColorMap(e, t) {
    return io[e] = t, this;
  }
  createCanvas() {
    const e = document.createElement("canvas");
    return e.width = 1, e.height = this.n, this.updateCanvas(e), e;
  }
  updateCanvas(e) {
    const t = e.getContext("2d", { alpha: false }), s = t.getImageData(0, 0, 1, this.n), i = s.data;
    let n = 0;
    const o = 1 / this.n, a = new $t(), l = new $t(), c = new $t();
    for (let h = 1; h >= 0; h -= o) for (let p = this.map.length - 1; p >= 0; p--) if (h < this.map[p][0] && h >= this.map[p - 1][0]) {
      const f = this.map[p - 1][0], x = this.map[p][0];
      a.setHex(this.map[p - 1][1], pn), l.setHex(this.map[p][1], pn), c.lerpColors(a, l, (h - f) / (x - f)), i[n * 4] = Math.round(c.r * 255), i[n * 4 + 1] = Math.round(c.g * 255), i[n * 4 + 2] = Math.round(c.b * 255), i[n * 4 + 3] = 255, n += 1;
    }
    return t.putImageData(s, 0, 0), e;
  }
}
const io = { rainbow: [[0, 255], [0.2, 65535], [0.5, 65280], [0.8, 16776960], [1, 16711680]], cooltowarm: [[0, 3952322], [0.2, 10206463], [0.5, 14474460], [0.8, 16163717], [1, 11797542]], blackbody: [[0, 0], [0.2, 7864320], [0.5, 15086080], [0.8, 16776960], [1, 16777215]], grayscale: [[0, 0], [0.2, 4210752], [0.5, 8355712], [0.8, 12566463], [1, 16777215]] }, ha = [[200, 0, 200], [228, 0, 100], [255, 0, 0], [255, 64, 0], [255, 128, 0], [255, 170, 0], [255, 212, 0], [255, 255, 0], [128, 255, 0], [0, 255, 0], [0, 255, 128], [0, 255, 255], [0, 170, 255], [0, 85, 255], [0, 0, 255]], wi = ha.map(([r, e, t], s) => [s / (ha.length - 1), r, e, t]), Bl = /* @__PURE__ */ new Set(["safe", "etabs", "sap2000", "csi"]);
function bi(r) {
  return Bl.has(r);
}
const Na = { safe: wi, etabs: wi, sap2000: wi, csi: wi, jet_r: [[0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0], [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1, 0, 0, 180]], jet: [[0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90], [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1, 200, 0, 0]], viridis: [[0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1, 253, 231, 37]] }, Ts = xe.state("safe");
typeof window < "u" && (window.__hekatanColorPalette = Ts);
const Oa = xe.state("auto");
function Va(r) {
  r = Math.max(0, Math.min(1, r));
  const e = Ts.val, t = Na[e] ?? wi;
  if (bi(e)) {
    const i = t.length, n = Math.min(i - 1, Math.floor(r * i)), [, o, a, l] = t[n];
    return [o, a, l];
  }
  for (let i = 0; i < t.length - 1; i++) {
    const [n, o, a, l] = t[i], [c, h, p, f] = t[i + 1];
    if (r <= c) {
      const x = (r - n) / (c - n);
      return [o + (h - o) * x, a + (p - a) * x, l + (f - l) * x];
    }
  }
  const s = t[t.length - 1];
  return [s[1], s[2], s[3]];
}
function ua() {
  const e = new Uint8Array(1024);
  for (let i = 0; i < 256; i++) {
    const n = i / 255, [o, a, l] = Va(n);
    e[i * 4 + 0] = o, e[i * 4 + 1] = a, e[i * 4 + 2] = l, e[i * 4 + 3] = 255;
  }
  const t = new $l(e, 256, 1, El), s = bi(Ts.val);
  return t.minFilter = s ? sa : ia, t.magFilter = s ? sa : ia, t.wrapS = na, t.wrapT = na, t.needsUpdate = true, t;
}
function Hl() {
  const r = Ts.val;
  if (bi(r)) {
    const s = Na[r] ?? wi, i = s.length, n = [];
    for (let o = 0; o < i; o++) {
      const a = i - 1 - o, [, l, c, h] = s[a], p = `rgb(${l | 0},${c | 0},${h | 0})`, f = (o / i * 100).toFixed(4), x = ((o + 1) / i * 100).toFixed(4);
      n.push(`${p} ${f}%`, `${p} ${x}%`);
    }
    return `linear-gradient(${n.join(",")})`;
  }
  const e = 12, t = [];
  for (let s = 0; s <= e; s++) {
    const i = 1 - s / e, [n, o, a] = Va(i);
    t.push(`rgb(${n | 0},${o | 0},${a | 0}) ${(s / e * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${t.join(",")})`;
}
function yo(r) {
  if (!r.length) return [0, 1];
  const e = [...r].sort((n, o) => n - o), t = (n) => e[Math.min(e.length - 1, Math.max(0, Math.round(n * (e.length - 1))))];
  let s = e.length >= 20 ? t(0.01) : e[0], i = e.length >= 20 ? t(0.99) : e[e.length - 1];
  return s >= 0 && i > 0 && (s = 0), i <= 0 && s < 0 && (i = 0), [s, i];
}
function Xl(r, e, t) {
  new La();
  const s = ua(), i = new Sl({ uniforms: { cmap: { value: s }, ambient: { value: 0.95 } }, vertexShader: `
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
    `, side: Pt, transparent: false, clipping: true, depthWrite: true, depthTest: true });
  xe.derive(() => {
    var _a2;
    Ts.val;
    const o = i.uniforms.cmap.value;
    i.uniforms.cmap.value = ua(), (_a2 = o == null ? void 0 : o.dispose) == null ? void 0 : _a2.call(o);
  });
  const n = new pt(new ze(), i);
  return n.renderOrder = -1, n.frustumCulled = false, n.userData.isShellArea = true, n.name = "__hekatan_shell_colormap", xe.derive(() => {
    n.geometry.setAttribute("position", new Mt(r.val.flat(), 3));
    const o = [], a = [], l = [];
    e.val.forEach((A, P) => {
      A.length === 3 ? (o.push(A[0], A[1], A[2]), a.push(P), l.push(0)) : A.length === 4 && (o.push(A[0], A[1], A[2]), o.push(A[0], A[2], A[3]), a.push(P, P), l.push(0, 1));
    }), n.geometry.setIndex(new Ml(o, 1)), n.userData.faceToElem = a, n.userData.faceLocal = l;
    const c = t.val.filter((A) => Number.isFinite(A));
    let h, p;
    const f = Oi.val;
    if (f ? (p = f[0], h = f[1]) : [p, h] = yo(c), h === p) {
      const A = Math.max(Math.abs(h) * 1e-6, 1e-9);
      h += A, p -= A;
    }
    const x = f && f[0] > f[1] && !bi(Ts.val), b = Math.min(p, h), C = Math.max(p, h), _ = C - b, S = new Float32Array(t.val.length);
    for (let A = 0; A < t.val.length; A++) {
      const P = t.val[A];
      if (!Number.isFinite(P)) {
        S[A] = -1;
        continue;
      }
      const q = ((x ? C + b - P : P) - b) / _;
      S[A] = Math.max(0, Math.min(1, q));
    }
    n.geometry.setAttribute("scalar", new bt(S, 1));
  }), n;
}
function Yl(r, e, t) {
  const s = document.createElement("div"), i = new Da({ title: "Settings", expanded: true, container: s });
  window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(i), s.setAttribute("id", "settings");
  const n = "hk_settingsPos";
  let o = null;
  try {
    const x = localStorage.getItem(n);
    x && (o = JSON.parse(x));
  } catch {
  }
  s.style.cssText = ["position:fixed", o ? `left:${o.left}px` : "left:8px", o ? `top:${o.top}px` : "top:8px", "z-index:50", "max-height:calc(100vh - 32px)", "overflow-y:auto", "box-shadow:0 4px 16px rgba(0,0,0,0.35)", "border-radius:6px"].join(";") + ";";
  const a = () => {
    const x = s.querySelector(".tp-rotv_b");
    if (!x) {
      setTimeout(a, 200);
      return;
    }
    x.style.cursor = "move", x.style.userSelect = "none";
    let b = false, C = 0, _ = 0, S = 0, A = 0;
    x.addEventListener("mousedown", (P) => {
      b = true, C = P.clientX, _ = P.clientY;
      const X = s.getBoundingClientRect();
      S = X.left, A = X.top, s.style.left = `${S}px`, s.style.top = `${A}px`;
    }), window.addEventListener("mousemove", (P) => {
      if (!b) return;
      const X = P.clientX - C, q = P.clientY - _, G = Math.max(0, Math.min(window.innerWidth - 40, S + X)), W = Math.max(0, Math.min(window.innerHeight - 40, A + q));
      s.style.left = `${G}px`, s.style.top = `${W}px`;
    }), window.addEventListener("mouseup", () => {
      if (b) {
        b = false;
        try {
          localStorage.setItem(n, JSON.stringify({ left: parseFloat(s.style.left), top: parseFloat(s.style.top) }));
        } catch {
        }
      }
    });
  };
  if (a(), e == null ? void 0 : e.nodes) {
    i.addBinding(r.displayScale, "val", { label: "Tama\xF1o de los s\xEDmbolos", min: -10, max: 10, step: 0.5 });
    const x = i.addFolder({ title: "\u{1F4D0} Rejilla", expanded: false });
    x.addBinding(r.gridVisible, "val", { label: "Mostrar la rejilla" }), x.addBinding(r.gridXY, "val", { label: "Plano XY (planta)" }), x.addBinding(r.gridXZ, "val", { label: "Plano XZ (frontal)" }), x.addBinding(r.gridYZ, "val", { label: "Plano YZ (lateral)" });
    const b = x.addFolder({ title: "\u2699 Ajuste fino", expanded: false });
    b.addBinding(r.gridSize, "val", { label: "Dimensi\xF3n (m)", min: 1, max: 100, step: 1 }), b.addBinding(r.gridStep, "val", { label: "Separaci\xF3n (m)", min: 0.05, max: 5, step: 0.05 }), b.addBinding(r.gridMajor, "val", { label: "Separaci\xF3n mayores (m)", min: 0.1, max: 50, step: 0.1 }), b.addBinding(r.cursorSnap, "val", { label: "Paso cursor con F9 (m)", min: 0.05, max: 5, step: 0.05 }), b.addBinding(r.gridOpacity, "val", { label: "Opacidad", min: 0, max: 1, step: 0.05 });
    const C = i.addFolder({ title: "\u{1F441} Ver", expanded: false });
    C.addBinding(r.nodes, "val", { label: "Nudos" }), C.addBinding(r.elements, "val", { label: "Elementos" }), C.addBinding(r.edges, "val", { label: "  Aristas (delim.)" }), C.addBinding(r.faces, "val", { label: "  Caras (fill)" }), C.addBinding(r.elemFrames, "val", { label: "  Frames (todos)" }), C.addBinding(r.elemColumns, "val", { label: "    Columnas" }), C.addBinding(r.elemBeams, "val", { label: "    Vigas" }), C.addBinding(r.elemZapatas, "val", { label: "  Zapatas (shells z\u22640)" }), C.addBinding(r.elemLosas, "val", { label: "  Losas (shells z>0)" }), C.addBinding(r.colorByType, "val", { label: "  \u{1F3A8} Color por tipo" }), C.addBinding(r.nodesIndexes, "val", { label: "N\xBA de nudo" }), C.addBinding(r.elementsIndexes, "val", { label: "N\xBA de elemento" }), C.addBinding(r.orientations, "val", { label: "Ejes locales" }), C.addBinding(r.sections, "val", { label: "Secciones" }), C.addBinding(r.extruded, "val", { label: "Extruido (3D)" }), C.addBinding(r.sectionLabels, "val", { label: "  Sec. Labels (30x50)" }), C.addBinding(r.secColumns, "val", { label: "  Sec. Columnas" }), C.addBinding(r.secBeams, "val", { label: "  Sec. Vigas" }), C.addBinding(r.secFloor, "val", { label: "  Sec. Piso", options: { Todos: -1, "Piso 1": 0, "Piso 2": 1, "Piso 3": 2, "Piso 4": 3, "Piso 5": 4 } });
  }
  if ((e == null ? void 0 : e.nodeInputs) || (e == null ? void 0 : e.elementInputs)) {
    const x = i.addFolder({ title: "\u{1F4CC} Datos de entrada", expanded: false });
    x.addBinding(r.supports, "val", { label: "Apoyos" }), x.addBinding(r.loads, "val", { label: "Cargas" }), x.addBinding(r.custom3D, "val", { label: "Resortes (Winkler)" }), x.addBinding(r.showCotas, "val", { label: "Cotas" });
  }
  if ((e == null ? void 0 : e.deformOutputs) || (e == null ? void 0 : e.analyzeOutputs)) {
    const x = i.addFolder({ title: "\u{1F52C} Resultados", expanded: true });
    window.__hekatanOutputsFolder = x, x.addBinding(r.nodeResults, "val", { options: { none: "none", "U (deformations)": "deformations", "R (reactions)": "reactions" }, label: "Resultados de nudo" }), x.addBinding(r.frameResults, "val", { options: { none: "none", "Axial Force": "normals", Torsion: "torsions", "Shear 2-2": "shearsY", "Shear 3-3": "shearsZ", "Moment 2-2": "bendingsY", "Moment 3-3": "bendingsZ", "Axial Force (diagram)": "contour:normals", "Shear 2-2 (diagram)": "contour:shearsY", "Shear 3-3 (diagram)": "contour:shearsZ", "Torsion (diagram)": "contour:torsions", "Moment 2-2 (diagram)": "contour:bendingsY", "Moment 3-3 (diagram)": "contour:bendingsZ" }, label: "Resultados de barra" }), x.addButton({ title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
    }), x.addButton({ title: "\u{1F4C8} Gr\xE1fico de la barra designada" }).on("click", () => {
      var _a2;
      (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
    }), x.addBinding(r.shellResults, "val", { options: { none: "none", F11: "membraneXX", F22: "membraneYY", F12: "membraneXY", FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises", V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax", M11: "bendingXX", M22: "bendingYY", M12: "bendingXY", MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin", "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ" }, label: "Resultados de c\xE1scara" }), x.addBinding(Ts, "val", { options: { "SAFE (cimentaci\xF3n)": "safe", ETABS: "etabs", SAP2000: "sap2000", "Jet_r (rojo\u2192azul)": "jet_r", "Jet (azul\u2192rojo)": "jet", Viridis: "viridis" }, label: "\u{1F3A8} Paleta colores" }), x.addBinding(Oa, "val", { options: { "todas las c\xE1scaras": "auto", "solo muros": "muros", "muros X (plano x=cte)": "murosX", "muros Y (plano y=cte)": "murosY", "solo losas": "losas" }, label: "\u{1F4D0} Rango colormap" }), x.addBinding(r.solidResults, "val", { options: { none: "none", vonMises: "vonMises", \u03C3xx: "sigmaXX", \u03C3yy: "sigmaYY", \u03C3zz: "sigmaZZ", \u03C4xy: "tauXY", \u03C4yz: "tauYZ", \u03C4xz: "tauXZ", ux: "ux", uy: "uy", uz: "uz" }, label: "Resultados de s\xF3lido" }), x.addBinding(r.deformedShape, "val", { label: "Deformada" }), x.addBinding(r.deformScale, "val", { label: "  Escala XY", min: 0.1, max: 5e3, step: 0.1 }), x.addBinding(r.deformScaleZ, "val", { label: "  Escala Z", min: 0.01, max: 10, step: 0.01 });
  }
  t && i.addBinding(r.solids, "val", { label: "S\xF3lidos" });
  const l = i.addFolder({ title: "\u2702\uFE0F Cortes X/Y/Z", expanded: false }), c = window.__hekatanClip ?? (window.__hekatanClip = { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false }), h = () => {
    const x = window.__hekatanClipApply;
    typeof x == "function" && x();
  };
  let p = [];
  const f = (x, b) => {
    for (const _ of p) try {
      _.dispose();
    } catch {
    }
    p = [];
    const C = (_, S) => {
      const A = Math.floor(Math.min(x[S], -50)), P = Math.ceil(Math.max(b[S], 50)), X = P - A > 400 ? 0.5 : 0.1;
      return c["pos" + _] = Math.max(A, Math.min(P, c["pos" + _])), l.addBinding(c, "pos" + _, { min: A, max: P, step: X, label: `  pos ${_} (m)` }).on("change", h);
    };
    p.push(l.addBinding(c, "enableX", { label: "Cortar X" }).on("change", h), C("X", 0), l.addBinding(c, "invertX", { label: "  invertir X" }).on("change", h), l.addBinding(c, "enableY", { label: "Cortar Y" }).on("change", h), C("Y", 1), l.addBinding(c, "invertY", { label: "  invertir Y" }).on("change", h), l.addBinding(c, "enableZ", { label: "Cortar Z" }).on("change", h), C("Z", 2), l.addBinding(c, "invertZ", { label: "  invertir Z" }).on("change", h));
  };
  return f([-50, -50, -50], [50, 50, 50]), window.__hekatanClipRango = (x, b) => {
    f(x, b);
  }, s;
}
function Ul(r) {
  return { gridSize: xe.state((r == null ? void 0 : r.gridSize) ?? 30), gridVisible: xe.state((r == null ? void 0 : r.gridVisible) ?? true), gridOpacity: xe.state((r == null ? void 0 : r.gridOpacity) ?? 1), gridStep: xe.state((r == null ? void 0 : r.gridStep) ?? 1), gridMajor: xe.state((r == null ? void 0 : r.gridMajor) ?? 5), cursorSnap: xe.state((r == null ? void 0 : r.cursorSnap) ?? 0.5), gridXY: xe.state((r == null ? void 0 : r.gridXY) ?? true), gridXZ: xe.state((r == null ? void 0 : r.gridXZ) ?? false), gridYZ: xe.state((r == null ? void 0 : r.gridYZ) ?? false), displayScale: xe.state((r == null ? void 0 : r.displayScale) ?? 1), nodes: xe.state((r == null ? void 0 : r.nodes) ?? true), elements: xe.state((r == null ? void 0 : r.elements) ?? true), edges: xe.state((r == null ? void 0 : r.edges) ?? true), faces: xe.state((r == null ? void 0 : r.faces) ?? true), elemColumns: xe.state((r == null ? void 0 : r.elemColumns) ?? true), elemBeams: xe.state((r == null ? void 0 : r.elemBeams) ?? true), elemFrames: xe.state((r == null ? void 0 : r.elemFrames) ?? true), elemZapatas: xe.state((r == null ? void 0 : r.elemZapatas) ?? true), elemLosas: xe.state((r == null ? void 0 : r.elemLosas) ?? true), colorByType: xe.state((r == null ? void 0 : r.colorByType) ?? false), nodesIndexes: xe.state((r == null ? void 0 : r.nodesIndexes) ?? false), elementsIndexes: xe.state((r == null ? void 0 : r.elementsIndexes) ?? false), orientations: xe.state((r == null ? void 0 : r.orientations) ?? false), sections: xe.state((r == null ? void 0 : r.sections) ?? true), extruded: xe.state((r == null ? void 0 : r.extruded) ?? false), sectionLabels: xe.state((r == null ? void 0 : r.sectionLabels) ?? true), secColumns: xe.state((r == null ? void 0 : r.secColumns) ?? true), secBeams: xe.state((r == null ? void 0 : r.secBeams) ?? true), secFloor: xe.state((r == null ? void 0 : r.secFloor) ?? -1), supports: xe.state((r == null ? void 0 : r.supports) ?? true), loads: xe.state((r == null ? void 0 : r.loads) ?? false), deformedShape: xe.state((r == null ? void 0 : r.deformedShape) ?? false), nodeResults: xe.state((r == null ? void 0 : r.nodeResults) ?? "none"), frameResults: xe.state((r == null ? void 0 : r.frameResults) ?? "none"), shellResults: xe.state((r == null ? void 0 : r.shellResults) ?? "none"), solidResults: xe.state((r == null ? void 0 : r.solidResults) ?? "none"), flipAxes: xe.state((r == null ? void 0 : r.flipAxes) ?? false), solids: xe.state((r == null ? void 0 : r.solids) ?? true), custom3D: xe.state((r == null ? void 0 : r.custom3D) ?? true), showCotas: xe.state((r == null ? void 0 : r.showCotas) ?? true), deformScale: xe.state((r == null ? void 0 : r.deformScale) ?? 1), deformScaleZ: xe.state((r == null ? void 0 : r.deformScaleZ) ?? 1) };
}
function ql(r, e, t) {
  const s = Vs(), i = new _n(new ze(), new kn({ color: s.nodePoint }));
  return Vi((n, o) => {
    i.material.color.setHex(o.nodePoint);
  }), i.frustumCulled = false, xe.derive(() => {
    r.nodes.val && i.geometry.setAttribute("position", new Mt(e.val.flat(), 3));
  }), xe.derive(() => {
    if (t.val, e.val, !r.nodes.rawVal) return;
    const n = e.rawVal ?? [];
    let o = r.gridSize.val * 0.5;
    if (n.length >= 2) {
      const l = [1 / 0, 1 / 0, 1 / 0], c = [-1 / 0, -1 / 0, -1 / 0];
      for (const h of n) for (let p = 0; p < 3; p++) l[p] = Math.min(l[p], h[p]), c[p] = Math.max(c[p], h[p]);
      o = Math.max(c[0] - l[0], c[1] - l[1], c[2] - l[2], 0.1);
    }
    const a = 0.03 * o;
    i.material.size = a * t.rawVal;
  }), xe.derive(() => {
    i.visible = r.nodes.val;
  }), i;
}
const jl = new $t(16746496), Wl = new $t(52428), pa = new $t(52292), fa = new $t(3377407), ma = new $t(16763904);
function ga(r, e) {
  const t = Math.abs(e[0] - r[0]), s = Math.abs(e[1] - r[1]), i = Math.abs(e[2] - r[2]);
  return i > t && i > s || s > t && s > i;
}
function Zl(r, e, t, s) {
  const i = [e[0] - r[0], e[1] - r[1], e[2] - r[2]], n = [s[0] - r[0], s[1] - r[1], s[2] - r[2]], o = i[1] * n[2] - i[2] * n[1], a = i[2] * n[0] - i[0] * n[2], l = i[0] * n[1] - i[1] * n[0], c = Math.sqrt(o * o + a * a + l * l);
  return c < 1e-12 ? false : Math.abs(l / c) < 0.5;
}
function mn(r) {
  return r <= 1e-3;
}
function wa(r, e, t, s, i, n, o = 8) {
  const a = (ne, ae) => {
    const ue = ae ?? [0, 0, 0];
    return [ne[0] + (ue[0] || 0) * i, ne[1] + (ue[1] || 0) * i, ne[2] + (ue[2] || 0) * n];
  }, l = a(r, t), c = a(e, s), h = t && t.length >= 6 ? [t[3], t[4], t[5]] : null, p = s && s.length >= 6 ? [s[3], s[4], s[5]] : null;
  if (!h && !p) return [l, c];
  const f = [e[0] - r[0], e[1] - r[1], e[2] - r[2]], x = Math.hypot(f[0], f[1], f[2]);
  if (x < 1e-9) return [l, c];
  f[0] /= x, f[1] /= x, f[2] /= x;
  const b = Math.abs(f[2]) > 0.98 ? [0, 1, 0] : [0, 0, 1], C = (ne, ae) => [ne[1] * ae[2] - ne[2] * ae[1], ne[2] * ae[0] - ne[0] * ae[2], ne[0] * ae[1] - ne[1] * ae[0]];
  let _ = C(b, f);
  const S = Math.hypot(_[0], _[1], _[2]) || 1;
  _ = [_[0] / S, _[1] / S, _[2] / S];
  const A = C(f, _), P = (ne, ae) => ne[0] * ae[0] + ne[1] * ae[1] + ne[2] * ae[2], X = (ne) => {
    const ae = ne ?? [0, 0, 0];
    return [(ae[0] || 0) * i, (ae[1] || 0) * i, (ae[2] || 0) * n];
  }, q = X(t), G = X(s), W = P(q, _), U = P(G, _), K = P(q, A), D = P(G, A), R = h ? P(h, A) * i : 0, B = p ? P(p, A) * i : 0, Q = h ? P(h, _) * i : 0, re = p ? P(p, _) * i : 0, pe = P(q, f), be = P(G, f), le = [];
  for (let ne = 0; ne <= o; ne++) {
    const ae = ne / o, ue = 1 - 3 * ae * ae + 2 * ae * ae * ae, he = x * (ae - 2 * ae * ae + ae * ae * ae), Se = 3 * ae * ae - 2 * ae * ae * ae, ve = x * (-ae * ae + ae * ae * ae), Oe = ue * W + he * R + Se * U + ve * B, He = ue * K - he * Q + Se * D - ve * re, dt = pe + (be - pe) * ae, wt = [r[0] + f[0] * (ae * x + dt), r[1] + f[1] * (ae * x + dt), r[2] + f[2] * (ae * x + dt)];
    le.push([wt[0] + _[0] * Oe + A[0] * He, wt[1] + _[1] * Oe + A[1] * He, wt[2] + _[2] * Oe + A[2] * He]);
  }
  return le;
}
function Kl(r, e, t) {
  const s = Vs(), i = new ft(), n = new is(new ze(), new mt({ color: s.elementLine, vertexColors: false, depthTest: false, transparent: true, opacity: 1 }));
  Vi((p, f) => {
    n.material.color.setHex(f.elementLine);
  }), n.frustumCulled = false, n.renderOrder = 3, i.add(n);
  const o = new gt({ vertexColors: true, transparent: true, opacity: s.shellOpacity, side: Pt, depthWrite: false, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }), a = new pt(new ze(), o);
  a.frustumCulled = false, a.userData.isShellArea = true, a.name = "__hekatan_shell_area", i.add(a);
  let l = new $t(s.shellWall), c = new $t(s.shellSlab), h = new $t(s.shellTri);
  return Vi((p, f) => {
    l = new $t(f.shellWall), c = new $t(f.shellSlab), h = new $t(f.shellTri), o.opacity = f.shellOpacity, o.needsUpdate = true;
  }), xe.derive(() => {
    var _a2, _b, _c2, _d, _e, _f, _g, _h;
    if (e.deformedShape.val, e.elemColumns.val, e.elemBeams.val, (_a2 = e.elemFrames) == null ? void 0 : _a2.val, (_b = e.elemZapatas) == null ? void 0 : _b.val, (_c2 = e.elemLosas) == null ? void 0 : _c2.val, (_d = e.colorByType) == null ? void 0 : _d.val, !e.elements.val) return;
    const p = e.elemFrames ? e.elemFrames.rawVal : true, f = e.elemColumns.rawVal, x = e.elemBeams.rawVal, b = e.elemZapatas ? e.elemZapatas.rawVal : true, C = e.elemLosas ? e.elemLosas.rawVal : true, _ = e.colorByType ? e.colorByType.rawVal : false, S = t.val, A = ((_e = r.elements) == null ? void 0 : _e.val) || [], P = (D) => {
      if (D.length === 2) {
        if (!p) return false;
        const R = S[D[0]], B = S[D[1]];
        return !R || !B ? true : ga(R, B) ? f : x;
      }
      if (D.length === 4) {
        const R = D.map((Q) => S[Q]).filter(Boolean);
        if (R.length < 4) return true;
        const B = (R[0][2] + R[1][2] + R[2][2] + R[3][2]) / 4;
        return mn(B) ? b : C;
      }
      if (D.length === 3) {
        const R = D.map((Q) => S[Q]).filter(Boolean);
        if (R.length < 3) return true;
        const B = (R[0][2] + R[1][2] + R[2][2]) / 3;
        return mn(B) ? b : C;
      }
      return true;
    }, X = [], q = [];
    for (const D of A) {
      if (!P(D)) continue;
      let R = null;
      if (_) if (D.length === 2) {
        const Q = S[D[0]], re = S[D[1]];
        Q && re && (R = ga(Q, re) ? jl : Wl);
      } else if (D.length === 4) {
        const Q = D.map((re) => S[re]).filter(Boolean);
        if (Q.length === 4) {
          const re = (Q[0][2] + Q[1][2] + Q[2][2] + Q[3][2]) / 4;
          R = mn(re) ? pa : fa;
        }
      } else D.length === 3 && (R = ma);
      if (D.length === 2 && e.deformedShape.val) {
        const Q = ((_f = r.nodes) == null ? void 0 : _f.val) ?? [], re = (_h = (_g = r.deformOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.deformations, pe = Q[D[0]], be = Q[D[1]];
        if (pe && be && re) {
          const le = Number.isFinite(e.deformScale.val) ? e.deformScale.val : 1, ne = le * (Number.isFinite(e.deformScaleZ.val) ? e.deformScaleZ.val : 1), ae = wa(pe, be, re.get(D[0]), re.get(D[1]), le, ne);
          for (let ue = 0; ue < ae.length - 1; ue++) X.push(...ae[ue], ...ae[ue + 1]), _ && R && (q.push(R.r, R.g, R.b), q.push(R.r, R.g, R.b));
          continue;
        }
      }
      const B = e.__modoAnim;
      if (D.length === 2 && !e.deformedShape.val && B && B.orig.length === S.length) {
        const Q = B.orig[D[0]], re = B.orig[D[1]];
        if (Q && re) {
          const pe = B.shape.slice(D[0] * 6, D[0] * 6 + 6), be = B.shape.slice(D[1] * 6, D[1] * 6 + 6), le = wa(Q, re, pe, be, B.amp, B.amp);
          for (let ne = 0; ne < le.length - 1; ne++) X.push(...le[ne], ...le[ne + 1]), _ && R && (q.push(R.r, R.g, R.b), q.push(R.r, R.g, R.b));
          continue;
        }
      }
      for (const Q of Gl(D)) {
        const re = S[Q[0]], pe = S[Q[1]];
        !re || !pe || (X.push(...re, ...pe), _ && R && (q.push(R.r, R.g, R.b), q.push(R.r, R.g, R.b)));
      }
    }
    n.geometry.setAttribute("position", new Mt(X, 3)), _ && q.length === X.length ? (n.geometry.setAttribute("color", new Mt(q, 3)), n.material.vertexColors = true, n.material.needsUpdate = true) : (n.geometry.deleteAttribute("color"), n.material.vertexColors = false, n.material.needsUpdate = true);
    const G = [], W = [], U = [], K = [];
    for (let D = 0; D < A.length; D++) {
      const R = A[D];
      if (P(R)) {
        if (R.length === 3) {
          const [B, Q, re] = R;
          if (S[B] && S[Q] && S[re]) {
            U.push(D), K.push(0), G.push(...S[B], ...S[Q], ...S[re]);
            const pe = _ ? ma : h;
            for (let be = 0; be < 3; be++) W.push(pe.r, pe.g, pe.b);
          }
        } else if (R.length === 4) {
          const [B, Q, re, pe] = R;
          if (S[B] && S[Q] && S[re] && S[pe]) {
            let be;
            if (_) {
              const le = (S[B][2] + S[Q][2] + S[re][2] + S[pe][2]) / 4;
              be = mn(le) ? pa : fa;
            } else be = Zl(S[B], S[Q], S[re], S[pe]) ? l : c;
            G.push(...S[B], ...S[Q], ...S[re]), G.push(...S[B], ...S[re], ...S[pe]), U.push(D, D), K.push(0, 1);
            for (let le = 0; le < 6; le++) W.push(be.r, be.g, be.b);
          }
        }
      }
    }
    a.userData.faceToElem = U, a.userData.faceLocal = K, G.length > 0 ? (a.geometry.dispose(), a.geometry = new ze(), a.geometry.setAttribute("position", new Mt(G, 3)), a.geometry.setAttribute("color", new Mt(W, 3)), a.geometry.computeVertexNormals(), a.visible = e.faces ? e.faces.rawVal : true) : a.visible = false;
  }), xe.derive(() => {
    i.visible = e.elements.val;
  }), xe.derive(() => {
    e.edges && (n.visible = e.edges.val);
  }), xe.derive(() => {
    var _a2, _b;
    if (!e.faces) return;
    const p = e.faces.val, f = (((_a2 = e.shellResults) == null ? void 0 : _a2.val) ?? "none") !== "none", x = (((_b = e.solidResults) == null ? void 0 : _b.val) ?? "none") !== "none", b = f || x;
    a.geometry.attributes.position ? a.visible = p && !b : p || (a.visible = false);
  }), i;
}
function Gl(r) {
  if (r.length === 2) return [r];
  if (r.length === 8) {
    const t = r;
    return [[t[0], t[1]], [t[1], t[2]], [t[2], t[3]], [t[3], t[0]], [t[4], t[5]], [t[5], t[6]], [t[6], t[7]], [t[7], t[4]], [t[0], t[4]], [t[1], t[5]], [t[2], t[6]], [t[3], t[7]]];
  }
  const e = [];
  for (let t = 0; t < r.length; t++) e.push([r[t], r[(t + 1) % r.length]]);
  return e;
}
function no(r, e) {
  const t = Vs(), s = new ft();
  s.name = "hekatan-grid";
  const i = (e == null ? void 0 : e.planes) ?? ["xy"];
  let n = (e == null ? void 0 : e.majorStep) ?? 1, o = (e == null ? void 0 : e.minorStep) ?? 0.1;
  for (n <= 0 && (n = 1), o <= 0 && (o = 0.1); r / o > 500; ) o *= 2;
  for (; r / n > 100; ) n *= 2;
  const a = r / 2;
  n = Math.max(o, Math.round(n / o) * o);
  const c = new $t(t.grid).multiplyScalar(1.3), h = new $t(t.grid).multiplyScalar(0.8), p = (C, _, S, A) => {
    const P = [], X = C === "xy" ? (K, D) => [K, D, 0] : C === "xz" ? (K, D) => [K, 0, D] : (K, D) => [0, K, D], q = Math.floor(a / _);
    for (let K = -q; K <= q; K++) {
      const D = K * _, R = X(D, -a), B = X(D, a);
      P.push(...R, ...B);
    }
    for (let K = -q; K <= q; K++) {
      const D = K * _, R = X(-a, D), B = X(a, D);
      P.push(...R, ...B);
    }
    const G = new ze();
    G.setAttribute("position", new Mt(P, 3));
    const W = new mt({ color: S, transparent: true, opacity: A, depthWrite: false }), U = new is(G, W);
    return U.name = `grid-${C}-${_ === o ? "minor" : "major"}`, U;
  }, f = (C, _, S) => {
    const A = C === "xy" ? (U, K) => [U, K, 0] : C === "xz" ? (U, K) => [U, 0, K] : (U, K) => [0, U, K], P = [[-a, -a], [a, -a], [a, a], [-a, a]], X = [];
    for (const [U, K] of P) X.push(...A(U, K));
    const q = new ze();
    q.setAttribute("position", new Mt(X, 3));
    const G = new mt({ color: _, transparent: true, opacity: S, depthWrite: false }), W = new Pa(q, G);
    return W.name = `grid-${C}-border`, W.renderOrder = 1, W;
  }, x = (C, _, S) => {
    const A = C === "xy" ? (G, W) => [G, W, 0] : C === "xz" ? (G, W) => [G, 0, W] : (G, W) => [0, G, W], P = _ === "u" ? [...A(-a, 0), ...A(a, 0)] : [...A(0, -a), ...A(0, a)], X = new ze();
    X.setAttribute("position", new Mt(P, 3));
    const q = new is(X, new mt({ color: S, transparent: true, opacity: 0.45, depthWrite: false }));
    return q.name = `grid-${C}-eje-${_}`, q.renderOrder = 1, q;
  }, b = { xy: [14042459, 5155178], xz: [14042459, 4882390], yz: [5155178, 4882390] };
  for (const C of i) {
    s.add(p(C, o, h, 0.12)), s.add(p(C, n, c, 0.4));
    const [_, S] = b[C];
    s.add(x(C, "u", _)), s.add(x(C, "v", S)), s.add(f(C, c, 0.55));
  }
  return s.position.set(0, 0, 0), window.__hekatanGridConfig = { majorStep: n, minorStep: o, gridSize: r, planes: [...i] }, s;
}
function Jl(r, e, t, s) {
  const i = new ft(), n = new Al(0.5, 0.5, 0.5), o = new Tl(0.45, 0.7, 4);
  o.rotateX(Math.PI / 2), o.translate(0, 0, -0.35);
  const a = new gt({ color: 10166822 }), l = new gt({ color: 2792847 }), c = new gt({ color: 3835647 }), h = () => {
    const x = t.rawVal ?? [];
    if (x.length < 2) return e.gridSize.val * 0.5;
    let b = [1 / 0, 1 / 0, 1 / 0], C = [-1 / 0, -1 / 0, -1 / 0];
    for (const _ of x) for (let S = 0; S < 3; S++) _[S] < b[S] && (b[S] = _[S]), _[S] > C[S] && (C[S] = _[S]);
    return Math.max(C[0] - b[0], C[1] - b[1], C[2] - b[2], 0.1);
  }, p = () => 0.08 * h(), f = () => s.rawVal;
  return xe.derive(() => {
    var _a2, _b;
    if (e.deformedShape.val, !e.supports.val) return;
    i.clear();
    const x = p();
    (_b = (_a2 = r.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((b, C) => {
      const _ = t.val[C];
      if (!_) return;
      const S = b ?? [], A = (S[0] ? 1 : 0) + (S[1] ? 1 : 0) + (S[2] ? 1 : 0), P = (S[3] ? 1 : 0) + (S[4] ? 1 : 0) + (S[5] ? 1 : 0);
      let X;
      A >= 3 && P >= 3 ? X = new pt(n, a) : A >= 3 && P === 0 ? X = new pt(o, l) : X = new pt(o, c), X.position.set(_[0], _[1], _[2]);
      const q = x * f();
      X.scale.set(q, q, q), i.add(X);
    });
  }), xe.derive(() => {
    if (s.val, !e.supports.rawVal) return;
    const b = p() * f();
    i.children.forEach((C) => C.scale.set(b, b, b));
  }), xe.derive(() => {
    i.visible = e.supports.val;
  }), i;
}
function Ql(r, e, t, s) {
  const i = new ft();
  i.name = "loadsGroup";
  function n(a) {
    if (a.length < 2) return 0.12 * e.gridSize.rawVal;
    const l = [1 / 0, 1 / 0, 1 / 0], c = [-1 / 0, -1 / 0, -1 / 0];
    for (const p of a) for (let f = 0; f < 3; f++) l[f] = Math.min(l[f], p[f]), c[f] = Math.max(c[f], p[f]);
    return 0.08 * Math.max(c[0] - l[0], c[1] - l[1], c[2] - l[2], 0.1);
  }
  xe.derive(() => {
    var _a2, _b, _c2;
    if (e.deformedShape.val, !e.loads.val) return;
    i.children.forEach((C) => {
      var _a3;
      return (_a3 = C.dispose) == null ? void 0 : _a3.call(C);
    }), i.clear();
    const a = t.val, l = n(a), c = 240, h = [];
    (_c2 = (_b = (_a2 = r.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c2.forEach((C, _) => {
      a[_] && C.slice(0, 3).some((S) => Math.abs(S) > 1e-15) && h.push(_);
    });
    let p = h;
    if (h.length > c) {
      const C = h.map((B) => a[B][0]), _ = h.map((B) => a[B][1]), S = Math.min(...C), A = Math.max(...C), P = Math.min(..._), X = Math.max(..._), q = h.map((B) => a[B][2]), G = Math.max(1e-6, (Math.max(...q) - Math.min(...q)) / 40), W = (B) => Math.round(B / G), U = new Set(q.map(W)), K = Math.max(4, Math.floor(c / Math.max(1, U.size))), D = Math.max(2, Math.round(Math.sqrt(K))), R = /* @__PURE__ */ new Map();
      for (const B of h) {
        const Q = A - S < 1e-9 ? 0 : (a[B][0] - S) / (A - S), re = X - P < 1e-9 ? 0 : (a[B][1] - P) / (X - P), pe = Math.min(D - 1, Math.floor(Q * D)), be = Math.min(D - 1, Math.floor(re * D)), le = `${pe},${be},${W(a[B][2])}`, ne = Math.hypot(Q * D - (pe + 0.5), re * D - (be + 0.5)), ae = R.get(le);
        (!ae || ne < ae.d) && R.set(le, { i: B, d: ne });
      }
      p = [...R.values()].map((B) => B.i);
    }
    let f = 0;
    for (const C of p) {
      const _ = r.nodeInputs.val.loads.get(C);
      for (let S = 0; S < 3; S++) f = Math.max(f, Math.abs(_[S]));
    }
    const x = p.length <= 60, b = (C) => {
      const _ = Math.abs(C);
      return _ >= 100 ? C.toFixed(0) : _ >= 10 ? C.toFixed(1) : C.toFixed(2);
    };
    for (const C of p) {
      const _ = r.nodeInputs.val.loads.get(C), S = a[C];
      if (S) for (let A = 0; A < 3; A++) {
        const P = _[A];
        if (!(Math.abs(P) > 1e-9 * (f || 1))) continue;
        const X = new te(A === 0 ? Math.sign(P) : 0, A === 1 ? Math.sign(P) : 0, A === 2 ? Math.sign(P) : 0), q = 0.45 + 0.55 * (f ? Math.abs(P) / f : 1), G = new ti(X, new te(...S), 1, A === 2 ? 15637248 : 15022123, 0.3, 0.3);
        if (G.userData = { nudo: S, dir: X, rel: q }, i.add(G), x) {
          const W = new Bt(b(P), A === 2 ? "#f5b642" : "#ff6b5e");
          W.userData = { nudo: S, dir: X, rel: q, texto: true }, i.add(W);
        }
      }
    }
    o(l * s.rawVal);
  });
  function o(a) {
    i.children.forEach((l) => {
      const c = l.userData;
      if (!(c == null ? void 0 : c.dir)) return;
      const h = a * c.rel, p = new te(...c.nudo).addScaledVector(c.dir, -h * (c.texto ? 1.12 : 1));
      l.position.copy(p), c.texto ? l.updateScale(a * 0.38) : l.scale.set(h, h, h);
    });
  }
  return xe.derive(() => {
    s.val, e.loads.rawVal && o(n(t.rawVal) * s.rawVal);
  }), xe.derive(() => {
    i.visible = e.loads.val;
  }), i;
}
function er(r, e, t) {
  const s = new ft();
  return xe.derive(() => {
    if (!r.nodesIndexes.val) return;
    s.children.forEach((n) => n.dispose()), s.clear();
    const i = 0.05 * r.gridSize.val * 0.6;
    e.val.forEach((n, o) => {
      const a = new Bt(`${o}`);
      a.position.set(...n), a.updateScale(i * t.rawVal), s.add(a);
    });
  }), xe.derive(() => {
    if (t.val, !r.nodesIndexes.rawVal) return;
    const i = 0.05 * r.gridSize.val * 0.6;
    s.children.forEach((n) => n.updateScale(i * t.rawVal));
  }), xe.derive(() => {
    s.visible = r.nodesIndexes.val;
  }), s;
}
function tr(r, e, t, s) {
  const i = new ft();
  return xe.derive(() => {
    var _a2;
    if (e.deformedShape.val, !e.elementsIndexes.val) return;
    i.children.forEach((o) => o.dispose()), i.clear();
    const n = 0.05 * e.gridSize.val * 0.6;
    (_a2 = r.elements) == null ? void 0 : _a2.val.forEach((o, a) => {
      const l = new Bt(`${a}`, void 0, "#001219");
      l.position.set(...sr(o.map((c) => t.rawVal[c]))), l.updateScale(n * s.rawVal), i.add(l);
    });
  }), xe.derive(() => {
    if (s.val, !e.elementsIndexes.rawVal) return;
    const n = 0.05 * e.gridSize.val * 0.6;
    i.children.forEach((o) => o.updateScale(n * s.rawVal));
  }), xe.derive(() => {
    i.visible = e.elementsIndexes.val;
  }), i;
}
function sr(r) {
  const e = r.reduce((s, i) => [s[0] + i[0], s[1] + i[1], s[2] + i[2]], [0, 0, 0]), t = r.length;
  return [e[0] / t, e[1] / t, e[2] / t];
}
function ya(r, e) {
  const t = new ft(), s = Math.min(0.05 * r, 0.6), i = Vs(), n = new Bt("X", "red", "transparent"), o = new Bt(e ? "Z" : "Y", "green", "transparent"), a = new Bt(e ? "Y" : "Z", "blue", "transparent"), l = new ti(new te(1, 0, 0), new te(0, 0, 0), 1, i.axisArrow, 0.2, 0.2), c = new ti(new te(0, 1, 0), new te(0, 0, 0), 1, i.axisArrow, 0.2, 0.2), h = new ti(new te(0, 0, 1), new te(0, 0, 0), 1, i.axisArrow, 0.2, 0.2);
  return n.position.set(1.3 * s, 0, 0), o.position.set(0, 1.3 * s, 0), a.position.set(0, 0, 1.3 * s), n.updateScale(0.4 * s), o.updateScale(0.4 * s), a.updateScale(0.4 * s), l.scale.set(s, s, s), c.scale.set(s, s, s), h.scale.set(s, s, s), t.add(l, c, h, n, o, a), t;
}
function xo(r, e) {
  const t = new te(...r), i = new te(...e).clone().sub(t), n = i.length(), o = i.dot(new te(1, 0, 0)) / n, a = i.dot(new te(0, 1, 0)) / n, l = i.dot(new te(0, 0, 1)) / n, c = Math.sqrt(o ** 2 + a ** 2);
  let h = new Jn().fromArray([[o, a, l], [-a / c, o / c, 0], [-o * l / c, -a * l / c, c]].flat());
  return l === 1 && (h = new Jn().fromArray([[0, 0, 1], [0, 1, 0], [-1, 0, 0]].flat())), l === -1 && (h = new Jn().fromArray([[0, 0, -1], [0, 1, 0], [1, 0, 0]].flat())), new Tn().setFromMatrix3(h);
}
function po(r, e) {
  return r == null ? void 0 : r.map((t, s) => (9 * t + e[s]) / 10);
}
function Ni(r) {
  const e = r.reduce((s, i) => [s[0] + i[0], s[1] + i[1], s[2] + i[2]], [0, 0, 0]), t = r.length;
  return [e[0] / t, e[1] / t, e[2] / t];
}
function ir(r, e, t) {
  const s = Ni([e, t]), i = Ni([r, t]), n = Ni([r, e]), o = new te(...s).sub(new te(...i)).normalize(), a = new te(...t).sub(new te(...n)).normalize(), l = o.clone().cross(a).normalize(), c = l.clone().cross(o).normalize();
  return new Tn().makeBasis(o, c, l);
}
function nr(r, e, t, s) {
  const i = new ft(), n = new ze(), o = new mt({ vertexColors: true }), a = [0, 0, 0], l = [1, 0, 0], c = [0, 1, 0], h = [0, 0, 1];
  n.setAttribute("position", new Mt([...a, ...l, ...a, ...c, ...a, ...h], 3));
  const p = [255, 0, 0], f = [0, 255, 0], x = [0, 0, 255];
  return n.setAttribute("color", new Mt([...p, ...p, ...f, ...f, ...x, ...x], 3)), xe.derive(() => {
    var _a2;
    e.deformedShape.val, e.orientations.val && (i.clear(), (_a2 = r.elements) == null ? void 0 : _a2.val.forEach((b) => {
      const C = new is(n, o), _ = t.rawVal[b[0]], S = t.rawVal[b[1]];
      if (b.length === 2 && (C.position.set(...po(_, S)), C.rotation.setFromRotationMatrix(xo(_, S))), b.length === 3) {
        const X = t.rawVal[b[2]];
        C.position.set(...Ni([_, S, X])), C.rotation.setFromRotationMatrix(ir(_, S, X));
      }
      const P = 0.05 * e.gridSize.rawVal * 0.75 * s.rawVal;
      C.scale.set(P, P, P), i.add(C);
    }));
  }), xe.derive(() => {
    if (s.val, !e.orientations.rawVal) return;
    const C = 0.05 * e.gridSize.val * 0.75 * s.rawVal;
    i.children.forEach((_) => _.scale.set(C, C, C));
  }), xe.derive(() => {
    i.visible = e.orientations.val;
  }), i;
}
function or(r) {
  if (r.name) return r.name;
  if (r.type === "rect") {
    const e = (r.b * 100).toFixed(0), t = (r.h * 100).toFixed(0);
    return `${e}x${t}`;
  }
  return r.type === "circ" ? `D${(r.d * 100).toFixed(0)}` : "";
}
function ar(r, e, t, s) {
  const i = new ft(), n = new ft();
  i.add(n);
  function o(G, W) {
    const U = G / 2, K = W / 2, D = new Float32Array([0, -U, -K, 0, U, -K, 0, U, K, 0, -U, -K, 0, U, K, 0, -U, K]), R = new ze();
    R.setAttribute("position", new bt(D, 3));
    const B = new Float32Array([0, -U, -K, 0, U, -K, 0, U, K, 0, -U, K, 0, -U, -K]), Q = new ze();
    return Q.setAttribute("position", new bt(B, 3)), { fill: R, outline: Q };
  }
  function a(G, W = 24) {
    const U = G / 2, K = new Float32Array(W * 9);
    for (let Q = 0; Q < W; Q++) {
      const re = Q / W * Math.PI * 2, pe = (Q + 1) / W * Math.PI * 2;
      K[Q * 9] = 0, K[Q * 9 + 1] = 0, K[Q * 9 + 2] = 0, K[Q * 9 + 3] = 0, K[Q * 9 + 4] = U * Math.cos(re), K[Q * 9 + 5] = U * Math.sin(re), K[Q * 9 + 6] = 0, K[Q * 9 + 7] = U * Math.cos(pe), K[Q * 9 + 8] = U * Math.sin(pe);
    }
    const D = new ze();
    D.setAttribute("position", new bt(K, 3));
    const R = new Float32Array((W + 1) * 3);
    for (let Q = 0; Q <= W; Q++) {
      const re = Q / W * Math.PI * 2;
      R[Q * 3] = 0, R[Q * 3 + 1] = U * Math.cos(re), R[Q * 3 + 2] = U * Math.sin(re);
    }
    const B = new ze();
    return B.setAttribute("position", new bt(R, 3)), { fill: D, outline: B };
  }
  function l(G, W, U, K) {
    const D = U ?? W * 0.08, R = K ?? G * 0.07, B = G / 2, Q = W / 2, re = Q - D, pe = R / 2, be = [];
    function le(he, Se, ve, Oe) {
      be.push(0, he, Se, 0, ve, Se, 0, ve, Oe, 0, he, Se, 0, ve, Oe, 0, he, Oe);
    }
    le(-B, -Q, B, -re), le(-pe, -re, pe, re), le(-B, re, B, Q);
    const ne = new ze();
    ne.setAttribute("position", new bt(new Float32Array(be), 3));
    const ae = new Float32Array([0, -B, -Q, 0, B, -Q, 0, B, -re, 0, pe, -re, 0, pe, re, 0, B, re, 0, B, Q, 0, -B, Q, 0, -B, re, 0, -pe, re, 0, -pe, -re, 0, -B, -re, 0, -B, -Q]), ue = new ze();
    return ue.setAttribute("position", new bt(ae, 3)), { fill: ne, outline: ue };
  }
  function c(G, W, U) {
    const K = G / 2, D = W / 2, R = K - U, B = D - U, Q = [];
    function re(ne, ae, ue, he) {
      Q.push(0, ne, ae, 0, ue, ae, 0, ue, he, 0, ne, ae, 0, ue, he, 0, ne, he);
    }
    re(-K, -D, K, -B), re(-K, B, K, D), re(-K, -B, -R, B), re(R, -B, K, B);
    const pe = new ze();
    pe.setAttribute("position", new bt(new Float32Array(Q), 3));
    const be = new Float32Array([0, -K, -D, 0, K, -D, 0, K, -D, 0, K, D, 0, K, D, 0, -K, D, 0, -K, D, 0, -K, -D, 0, -R, -B, 0, R, -B, 0, R, -B, 0, R, B, 0, R, B, 0, -R, B, 0, -R, B, 0, -R, -B]), le = new ze();
    return le.setAttribute("position", new bt(be, 3)), { fill: pe, outline: le };
  }
  function h(G, W, U) {
    const K = G / 2, D = W / 2, R = K - U, B = D - U, Q = new ze(), re = new Float32Array([0, -R, -B, 0, R, -B, 0, R, B, 0, -R, -B, 0, R, B, 0, -R, B]);
    Q.setAttribute("position", new bt(re, 3));
    const pe = [];
    function be(ue, he, Se, ve) {
      pe.push(0, ue, he, 0, Se, he, 0, Se, ve, 0, ue, he, 0, Se, ve, 0, ue, ve);
    }
    be(-K, -D, K, -B), be(-K, B, K, D), be(-K, -B, -R, B), be(R, -B, K, B);
    const le = new ze();
    le.setAttribute("position", new bt(new Float32Array(pe), 3));
    const ne = new Float32Array([0, -K, -D, 0, K, -D, 0, K, -D, 0, K, D, 0, K, D, 0, -K, D, 0, -K, D, 0, -K, -D, 0, -R, -B, 0, R, -B, 0, R, -B, 0, R, B, 0, R, B, 0, -R, B, 0, -R, B, 0, -R, -B]), ae = new ze();
    return ae.setAttribute("position", new bt(ne, 3)), { concFill: Q, steelFillGeom: le, outline: ae };
  }
  function p(G, W, U) {
    const K = [], D = [[0, -G / 2, -W / 2], [0, -G / 2 + U, -W / 2], [0, -G / 2 + U, W / 2 - U], [0, G / 2, W / 2 - U], [0, G / 2, W / 2], [0, -G / 2, W / 2]], R = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const pe of R) K.push(...D[pe]);
    const B = new ze();
    B.setAttribute("position", new bt(new Float32Array(K), 3));
    const Q = [];
    for (let pe = 0; pe < D.length; pe++) {
      const be = (pe + 1) % D.length;
      Q.push(...D[pe], ...D[be]);
    }
    const re = new ze();
    return re.setAttribute("position", new bt(new Float32Array(Q), 3)), { fill: B, outline: re };
  }
  function f(G, W, U, K) {
    const D = K / 2, R = [], B = [[0, -G - D, -W / 2], [0, -U - D, -W / 2], [0, -U - D, W / 2 - U], [0, -D, W / 2 - U], [0, -D, W / 2], [0, -G - D, W / 2]], Q = [[0, D, -W / 2], [0, D + U, -W / 2], [0, D + U, W / 2 - U], [0, G + D, W / 2 - U], [0, G + D, W / 2], [0, D, W / 2]], re = [0, 1, 2, 0, 2, 5, 2, 3, 4, 2, 4, 5];
    for (const ne of re) R.push(...B[ne]);
    for (const ne of re) R.push(...Q[ne]);
    const pe = new ze();
    pe.setAttribute("position", new bt(new Float32Array(R), 3));
    const be = [];
    for (const ne of [B, Q]) for (let ae = 0; ae < ne.length; ae++) {
      const ue = (ae + 1) % ne.length;
      be.push(...ne[ae], ...ne[ue]);
    }
    const le = new ze();
    return le.setAttribute("position", new bt(new Float32Array(be), 3)), { fill: pe, outline: le };
  }
  function x(G, W, U, K) {
    const D = W / 2, R = G, B = [[0, -R, -D], [0, -R, -D + U], [0, -K, -D + U], [0, -K, D - U], [0, -R, D - U], [0, -R, D], [0, 0, D], [0, 0, -D]], Q = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5], re = [];
    for (const ne of Q) re.push(...B[ne]);
    const pe = new ze();
    pe.setAttribute("position", new bt(new Float32Array(re), 3));
    const be = [];
    for (let ne = 0; ne < B.length; ne++) {
      const ae = (ne + 1) % B.length;
      be.push(...B[ne], ...B[ae]);
    }
    const le = new ze();
    return le.setAttribute("position", new bt(new Float32Array(be), 3)), { fill: pe, outline: le };
  }
  function b(G, W, U, K, D) {
    const R = W / 2, B = D / 2, Q = [], re = [[0, -G, -R], [0, -G, -R + U], [0, -B - K, -R + U], [0, -B - K, R - U], [0, -G, R - U], [0, -G, R], [0, -B, R], [0, -B, -R]], pe = re.map((ue) => [ue[0], -ue[1], ue[2]]), be = [0, 1, 7, 1, 6, 7, 1, 2, 6, 2, 5, 6, 2, 3, 5, 3, 4, 5];
    for (const ue of be) Q.push(...re[ue]);
    for (const ue of be) Q.push(...pe[ue]);
    const le = new ze();
    le.setAttribute("position", new bt(new Float32Array(Q), 3));
    const ne = [];
    for (const ue of [re, pe]) for (let he = 0; he < ue.length; he++) {
      const Se = (he + 1) % ue.length;
      ne.push(...ue[he], ...ue[Se]);
    }
    const ae = new ze();
    return ae.setAttribute("position", new bt(new Float32Array(ne), 3)), { fill: le, outline: ae };
  }
  function C(G, W, U, K) {
    const D = G / 2, R = W / 2, B = K / 2, Q = [[0, -B, -R], [0, B, -R], [0, B, R - U], [0, D, R - U], [0, D, R], [0, -D, R], [0, -D, R - U], [0, -B, R - U]], re = [0, 1, 7, 1, 2, 7, 6, 7, 5, 2, 3, 4, 2, 4, 5, 2, 5, 7], pe = [];
    for (const ae of re) pe.push(...Q[ae]);
    const be = new ze();
    be.setAttribute("position", new bt(new Float32Array(pe), 3));
    const le = [];
    for (let ae = 0; ae < Q.length; ae++) {
      const ue = (ae + 1) % Q.length;
      le.push(...Q[ae], ...Q[ue]);
    }
    const ne = new ze();
    return ne.setAttribute("position", new bt(new Float32Array(le), 3)), { fill: be, outline: ne };
  }
  function _(G, W, U = 24) {
    const K = G / 2, D = K - W, R = [];
    for (let pe = 0; pe < U; pe++) {
      const be = pe / U * Math.PI * 2, le = (pe + 1) / U * Math.PI * 2, ne = Math.cos(be), ae = Math.sin(be), ue = Math.cos(le), he = Math.sin(le);
      R.push(0, K * ne, K * ae, 0, K * ue, K * he, 0, D * ue, D * he), R.push(0, K * ne, K * ae, 0, D * ue, D * he, 0, D * ne, D * ae);
    }
    const B = new ze();
    B.setAttribute("position", new bt(new Float32Array(R), 3));
    const Q = [];
    for (let pe = 0; pe < U; pe++) {
      const be = pe / U * Math.PI * 2, le = (pe + 1) / U * Math.PI * 2;
      Q.push(0, K * Math.cos(be), K * Math.sin(be), 0, K * Math.cos(le), K * Math.sin(le)), Q.push(0, D * Math.cos(be), D * Math.sin(be), 0, D * Math.cos(le), D * Math.sin(le));
    }
    const re = new ze();
    return re.setAttribute("position", new bt(new Float32Array(Q), 3)), { fill: B, outline: re };
  }
  const S = new gt({ color: 52479, transparent: true, opacity: 0.35, side: Pt, depthWrite: false }), A = new mt({ color: 52479 }), P = new gt({ color: 16750848, transparent: true, opacity: 0.4, side: Pt, depthWrite: false }), X = new mt({ color: 16750848 });
  function q(G, W) {
    const U = Math.abs(W[0] - G[0]), K = Math.abs(W[1] - G[1]), D = Math.abs(W[2] - G[2]);
    return D > U && D > K || K > U && K > D;
  }
  return xe.derive(() => {
    var _a2, _b;
    e.deformedShape.val, e.secColumns.val, e.secBeams.val, e.secFloor.val;
    const G = e.secColumns.rawVal, W = e.secBeams.rawVal;
    if (!G && !W) {
      i.children.forEach((B) => {
        B instanceof Bt && B.dispose();
      }), i.clear();
      return;
    }
    i.children.forEach((B) => {
      B instanceof Bt && B.dispose();
    }), i.clear();
    const U = (_a2 = r.elements) == null ? void 0 : _a2.val, K = (_b = r.elementInputs) == null ? void 0 : _b.val;
    if (!U || !K) return;
    const D = K.sectionShapes, R = e.secFloor.rawVal;
    U.forEach((B, Q) => {
      if (B.length !== 2) return;
      const re = t.rawVal[B[0]], pe = t.rawVal[B[1]];
      if (!re || !pe) return;
      const be = q(re, pe);
      if (be && !G || !be && !W) return;
      if (R >= 0) {
        const he = Math.min(re[1], pe[1]);
        Math.max(re[1], pe[1]);
        const Se = e.gridSize.rawVal || 3;
        if (Math.floor(he / Se + 0.01) !== R) return;
      }
      const le = D == null ? void 0 : D.get(Q);
      if (!le) return;
      const ne = [(re[0] + pe[0]) / 2, (re[1] + pe[1]) / 2, (re[2] + pe[2]) / 2], ae = xo(re, pe);
      if (le.type === "CFT") {
        const he = h(le.b, le.h, le.tw ?? le.b * 0.05), Se = new pt(he.concFill, S);
        Se.position.set(...ne), Se.rotation.setFromRotationMatrix(ae), i.add(Se);
        const ve = new pt(he.steelFillGeom, P);
        ve.position.set(...ne), ve.rotation.setFromRotationMatrix(ae), i.add(ve);
        const Oe = new Vt(he.outline, X);
        Oe.position.set(...ne), Oe.rotation.setFromRotationMatrix(ae), i.add(Oe);
      } else {
        let he, Se, ve;
        switch (le.type) {
          case "rect":
            he = o(le.b, le.h), Se = S, ve = A;
            break;
          case "circ":
            he = a(le.d), Se = S, ve = A;
            break;
          case "I":
            he = l(le.b, le.h, le.tf, le.tw), Se = P, ve = X;
            break;
          case "HSS":
            he = c(le.b, le.h, le.tw ?? le.b * 0.05), Se = P, ve = X;
            break;
          case "CFT":
            he = h(le.b, le.h, le.tw ?? le.b * 0.05), Se = P, ve = X;
            break;
          case "L":
            he = p(le.b ?? le.h, le.h, le.t ?? le.tw ?? 3e-3), Se = P, ve = X;
            break;
          case "2L":
            he = f(le.b ?? le.h, le.h, le.t ?? le.tw ?? 3e-3, le.dis ?? 0.01), Se = P, ve = X;
            break;
          case "C":
          case "coldC":
            he = x(le.b, le.h, le.tf ?? le.t ?? 3e-3, le.tw ?? le.t ?? 3e-3), Se = P, ve = X;
            break;
          case "2C":
            he = b(le.b, le.h, le.tf ?? 5e-3, le.tw ?? 5e-3, le.dis ?? 0.01), Se = P, ve = X;
            break;
          case "T":
            he = C(le.b, le.h, le.tf ?? 0.01, le.tw ?? 6e-3), Se = P, ve = X;
            break;
          case "pipe":
            he = _(le.d, le.tw ?? le.d * 0.05), Se = P, ve = X;
            break;
          default:
            return;
        }
        const Oe = new pt(he.fill, Se);
        Oe.position.set(...ne), Oe.rotation.setFromRotationMatrix(ae), i.add(Oe);
        const He = new Vt(he.outline, ve);
        He.position.set(...ne), He.rotation.setFromRotationMatrix(ae), i.add(He);
      }
      const ue = or(le);
      if (ue) {
        const Se = ["I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"].includes(le.type) ? "#ff9900" : "#00ccff", ve = new Bt(ue, Se, "transparent");
        ve.position.set(ne[0], ne[1], ne[2]);
        const Oe = 0.05 * e.gridSize.rawVal * 0.5;
        ve.updateScale(Oe * ((s == null ? void 0 : s.rawVal) ?? 1)), n.add(ve);
      }
    });
  }), s && xe.derive(() => {
    if (s.val, !e.sections.rawVal) return;
    const G = 0.05 * e.gridSize.val * 0.5;
    n.children.forEach((W) => {
      W instanceof Bt && W.updateScale(G * s.rawVal);
    });
  }), xe.derive(() => {
    i.visible = e.sections.val;
  }), xe.derive(() => {
    n.visible = e.sectionLabels.val;
  }), i;
}
function lr(r) {
  if (!r) return null;
  const e = r.type, t = (h, p) => [h, p], s = (h, p) => [t(-h / 2, -p / 2), t(h / 2, -p / 2), t(h / 2, p / 2), t(-h / 2, p / 2)], i = (h, p = 24) => {
    const f = h / 2, x = [];
    for (let b = 0; b < p; b++) {
      const C = 2 * Math.PI * b / p;
      x.push(t(f * Math.cos(C), f * Math.sin(C)));
    }
    return x;
  }, n = r.b ?? 0, o = r.h ?? 0, a = r.d ?? 0, l = r.tw ?? r.t ?? 0, c = r.tf ?? r.t ?? 0;
  switch (e) {
    case "rect":
      return n && o ? { contorno: s(n, o) } : null;
    case "circ":
      return a ? { contorno: i(a) } : null;
    case "pipe":
      return a && l ? { contorno: i(a), huecos: [i(a - 2 * l).reverse()] } : null;
    case "HSS":
      return n && o && l ? { contorno: s(n, o), huecos: [s(n - 2 * l, o - 2 * (c || l)).reverse()] } : null;
    case "CFT":
      return n && o ? { contorno: s(n, o) } : null;
    case "I":
      return n && o && l && c ? { contorno: [t(-n / 2, -o / 2), t(n / 2, -o / 2), t(n / 2, -o / 2 + c), t(l / 2, -o / 2 + c), t(l / 2, o / 2 - c), t(n / 2, o / 2 - c), t(n / 2, o / 2), t(-n / 2, o / 2), t(-n / 2, o / 2 - c), t(-l / 2, o / 2 - c), t(-l / 2, -o / 2 + c), t(-n / 2, -o / 2 + c)] } : null;
    case "C":
    case "2C":
    case "coldC":
      return n && o && l && c ? { contorno: [t(-n / 2, -o / 2), t(n / 2, -o / 2), t(n / 2, -o / 2 + c), t(-n / 2 + l, -o / 2 + c), t(-n / 2 + l, o / 2 - c), t(n / 2, o / 2 - c), t(n / 2, o / 2), t(-n / 2, o / 2)] } : null;
    case "T":
      return n && o && l && c ? { contorno: [t(-l / 2, -o / 2), t(l / 2, -o / 2), t(l / 2, o / 2 - c), t(n / 2, o / 2 - c), t(n / 2, o / 2), t(-n / 2, o / 2), t(-n / 2, o / 2 - c), t(-l / 2, o / 2 - c)] } : null;
    case "L":
    case "2L":
      return n && o && l ? { contorno: [t(-n / 2, -o / 2), t(n / 2, -o / 2), t(n / 2, -o / 2 + l), t(-n / 2 + l, -o / 2 + l), t(-n / 2 + l, o / 2), t(-n / 2, o / 2)] } : null;
    default:
      return n && o ? { contorno: s(n, o) } : a ? { contorno: i(a) } : null;
  }
}
function rr(r, e, t) {
  if (!r || r <= 0 || !e || !t || e <= 0 || t <= 0) return null;
  const s = Math.sqrt(Math.sqrt(t / e)), i = Math.sqrt(r / s), n = r / i;
  return !isFinite(i) || !isFinite(n) || i <= 0 || n <= 0 ? null : { contorno: [[-i / 2, -n / 2], [i / 2, -n / 2], [i / 2, n / 2], [-i / 2, n / 2]] };
}
function cr(r) {
  const e = new Li();
  r.contorno.forEach(([t, s], i) => i ? e.lineTo(t, s) : e.moveTo(t, s)), e.closePath();
  for (const t of r.huecos ?? []) {
    const s = new Il();
    t.forEach(([i, n], o) => o ? s.lineTo(i, n) : s.moveTo(i, n)), s.closePath(), e.holes.push(s);
  }
  return e;
}
function dr(r, e, t) {
  const s = new ft();
  s.name = "extrusion";
  const i = new Qn({ color: 8369151, transparent: true, opacity: 0.92, side: Pt }), n = new Qn({ color: 12623968, transparent: true, opacity: 0.85, side: Pt }), o = new Qn({ color: 11583173, transparent: true, opacity: 0.85, side: Pt }), a = new ft();
  a.add(new Ra(16777215, 0.55));
  const l = new Mn(16777215, 0.75);
  l.position.set(30, 25, 40);
  const c = new Mn(16777215, 0.35);
  c.position.set(-25, -20, 15), a.add(l, c);
  let h = 0;
  return xe.derive(() => {
    var _a2, _b, _c2, _d, _e;
    const p = ((_a2 = e.extruded) == null ? void 0 : _a2.val) ?? false;
    globalThis.__extrusionDebug = { corridas: ++h, on: p }, s.visible = p;
    for (const A of [...s.children]) A !== a && (s.remove(A), (_c2 = (_b = A.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c2.call(_b));
    if (s.children.includes(a) || s.add(a), !p) return;
    const f = t.val ?? [], x = ((_d = r.elements) == null ? void 0 : _d.val) ?? [], b = ((_e = r.elementInputs) == null ? void 0 : _e.val) ?? {}, C = b.sectionShapes ?? /* @__PURE__ */ new Map(), _ = b.thicknesses ?? /* @__PURE__ */ new Map();
    let S = "";
    try {
      x.forEach((A, P) => {
        var _a3, _b2, _c3;
        if (A.length === 2) {
          let X = lr(C.get(P)), q = true;
          if (X || (X = rr((_a3 = b.areas) == null ? void 0 : _a3.get(P), (_b2 = b.momentsOfInertiaY) == null ? void 0 : _b2.get(P), (_c3 = b.momentsOfInertiaZ) == null ? void 0 : _c3.get(P)), q = false), !X) return;
          const G = f[A[0]], W = f[A[1]];
          if (!G || !W) return;
          const U = Math.hypot(W[0] - G[0], W[1] - G[1], W[2] - G[2]);
          if (U < 1e-9) return;
          const K = new zl(cr(X), { depth: U, bevelEnabled: false, curveSegments: 4 });
          K.applyMatrix4(new Tn().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
          const D = new pt(K, q ? i : n);
          D.position.set(G[0], G[1], G[2]), D.rotation.setFromRotationMatrix(xo(G, W)), s.add(D);
          return;
        }
        if (A.length === 3 || A.length === 4) {
          const X = _.get(P);
          if (!X || X <= 0) return;
          const q = A.map((he) => f[he]).filter(Boolean);
          if (q.length < 3) return;
          const G = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], W = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]], U = G[1] * W[2] - G[2] * W[1], K = G[2] * W[0] - G[0] * W[2], D = G[0] * W[1] - G[1] * W[0], R = Math.hypot(U, K, D);
          if (R < 1e-12) return;
          const B = [U / R, K / R, D / R], Q = [], re = (he) => q.map((Se) => [Se[0] + B[0] * he, Se[1] + B[1] * he, Se[2] + B[2] * he]), pe = Math.abs(B[2]) > 0.5, be = B[2] > 0 ? -1 : 1, le = re(pe ? 0 : +X / 2), ne = re(pe ? be * X : -X / 2), ae = (he, Se, ve) => Q.push(...he, ...Se, ...ve);
          for (const he of [le, ne]) ae(he[0], he[1], he[2]), he.length === 4 && ae(he[0], he[2], he[3]);
          for (let he = 0; he < q.length; he++) {
            const Se = (he + 1) % q.length;
            ae(le[he], ne[he], ne[Se]), ae(le[he], ne[Se], le[Se]);
          }
          const ue = new ze();
          ue.setAttribute("position", new Mt(Q, 3)), ue.computeVertexNormals(), s.add(new pt(ue, o));
        }
      });
    } catch (A) {
      S = String((A == null ? void 0 : A.message) ?? A);
    }
    globalThis.__extrusionDebug = { corridas: h, on: p, fallo: S, nElementos: x.length, nFormas: C.size, nEspesores: _.size, mallas: s.children.length - 1 };
  }), s;
}
function Ba(r, e, t = 0) {
  const s = [e[0] - r[0], e[1] - r[1], e[2] - r[2]], i = Math.hypot(s[0], s[1], s[2]) || 1, n = s[0] / i, o = s[1] / i, a = s[2] / i, l = Math.sqrt(n * n + o * o);
  let c, h, p;
  if (l < 1e-9) {
    const f = a > 0 ? 1 : -1;
    c = [0, 0, f], h = [1, 0, 0], p = [0, f, 0];
  } else c = [n, o, a], h = [-n * a / l, -o * a / l, l], p = [o / l, -n / l, 0];
  if (Math.abs(t) > 1e-12) {
    const f = t * Math.PI / 180, x = Math.cos(f), b = Math.sin(f), C = h.map((S, A) => x * S + b * p[A]), _ = p.map((S, A) => -b * h[A] + x * S);
    h = C, p = _;
  }
  return { e1: c, e2: h, e3: p };
}
function fo(r, e) {
  if (!e) return [0, 0];
  const t = Number(e[0] ?? 0), s = Number(e[1] ?? 0);
  return r === "bendingsY" ? [t, -s] : [-t, s];
}
function Ha(r, e) {
  const t = (s) => s.map((i) => -i);
  switch (r) {
    case "bendingsZ":
      return t(e.e2);
    case "bendingsY":
      return t(e.e3);
    case "shearsZ":
      return e.e3;
    default:
      return e.e2;
  }
}
class gn extends ft {
  constructor(e, t, s, i, n, o, a) {
    super();
    const l = new Li().moveTo(0, 0).lineTo(0, o[1]).lineTo(s, o[1]).lineTo(s, 0).lineTo(0, 0), c = l.getPoints(), h = new ze().setFromPoints(c);
    this.lines = new Vt(h, new mt({ color: Vs().resultOutline })), this.lines.position.set(...e), this.lines.rotation.setFromRotationMatrix(i), a && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
    const p = new Cn(l), f = new gt({ color: o[1] > 0 ? 24435 : 11411474, side: Pt });
    this.mesh = new pt(p, f), this.mesh.position.set(...e), this.mesh.rotation.setFromRotationMatrix(i), a && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Bt(`${n[1].toFixed(4)}`), this.normalizedResult = o, this.textPosition = Ni([e, t]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(i), this.add(this.text);
  }
  updateScale(e) {
    this.lines.scale.set(1, e * 2, 1), this.mesh.scale.set(1, e * 2, 1), this.text.updateScale(e * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * e);
  }
  dispose() {
    this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
  }
}
class oo extends ft {
  constructor(e, t, s, i, n, o, a) {
    super();
    const l = n[0] * s / (n[0] + n[1]), c = n[0] * n[1] > 0;
    if (this.text = new Bt(`${n[0].toFixed(4)}`), this.text2 = new Bt(`${(n[1] * -1).toFixed(4)}`), this.normalizedResult = o, this.textPosition = po(e, t), this.text2Position = po(t, e), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(i), this.text2.rotation.setFromRotationMatrix(i), this.add(this.text, this.text2), c) {
      const h = new Li().moveTo(0, 0).lineTo(0, o[0]).lineTo(l, 0).lineTo(0, 0), p = new Li().moveTo(l, 0).lineTo(s, -o[1]).lineTo(s, 0).lineTo(l, 0), f = h.getPoints(), x = p.getPoints(), b = new ze().setFromPoints(f), C = new ze().setFromPoints(x), _ = new mt({ color: Vs().resultOutline });
      this.lines = new Vt(b, _), this.lines2 = new Vt(C, _), this.lines.position.set(...e), this.lines2.position.set(...e), this.lines.rotation.setFromRotationMatrix(i), this.lines2.rotation.setFromRotationMatrix(i), a && this.lines.rotateX(Math.PI / 2), a && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
      const S = new Cn(h), A = new Cn(p), P = new gt({ color: o[0] > 0 ? 24435 : 11411474, side: Pt }), X = new gt({ color: -o[1] > 0 ? 24435 : 11411474, side: Pt });
      this.mesh = new pt(S, P), this.mesh2 = new pt(A, X), this.mesh.position.set(...e), this.mesh2.position.set(...e), this.mesh.rotation.setFromRotationMatrix(i), this.mesh2.rotation.setFromRotationMatrix(i), a && this.mesh.rotateX(Math.PI / 2), a && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
    } else {
      const h = new Li().moveTo(0, 0).lineTo(0, o[0]).lineTo(s, -o[1]).lineTo(s, 0).lineTo(0, 0), p = h.getPoints(), f = new ze().setFromPoints(p);
      this.lines = new Vt(f, new mt({ color: Vs().resultOutline })), this.lines.position.set(...e), this.lines.rotation.setFromRotationMatrix(i), a && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const x = new Cn(h), b = new gt({ color: o[0] > 0 ? 24435 : 11411474, side: Pt });
      this.mesh = new pt(x, b), this.mesh.position.set(...e), this.mesh.rotation.setFromRotationMatrix(i), a && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
    }
  }
  updateScale(e) {
    var _a2, _b;
    this.lines.scale.set(1, e * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, e * 2, 1), this.mesh.scale.set(1, e * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, e * 2, 1), this.text.updateScale(e * 0.6), this.text2.updateScale(e * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * e), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * e);
  }
  dispose() {
    var _a2, _b, _c2, _d, _e, _f;
    this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c2 = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c2.dispose(), this.mesh.geometry.dispose(), (_d = this.mesh2) == null ? void 0 : _d.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
  }
}
var Xa = ((r) => (r.normals = "normals", r.shearsY = "shearsY", r.shearsZ = "shearsZ", r.torsions = "torsions", r.bendingsY = "bendingsY", r.bendingsZ = "bendingsZ", r))(Xa || {});
function hr(r, e, t, s) {
  const i = () => {
    const a = t.rawVal;
    if (!(a == null ? void 0 : a.length)) return 0.05 * e.gridSize.rawVal;
    const l = [1 / 0, 1 / 0, 1 / 0], c = [-1 / 0, -1 / 0, -1 / 0];
    for (const p of a) for (let f = 0; f < 3; f++) p[f] < l[f] && (l[f] = p[f]), p[f] > c[f] && (c[f] = p[f]);
    const h = Math.hypot(c[0] - l[0], c[1] - l[1], c[2] - l[2]);
    return !isFinite(h) || h <= 0 ? 0.05 * e.gridSize.rawVal : 0.025 * h;
  }, n = new ft(), o = { normals: gn, shearsY: gn, shearsZ: gn, torsions: gn, bendingsY: oo, bendingsZ: oo };
  return xe.derive(() => {
    var _a2, _b;
    if (e.deformedShape.val, t.val, e.frameResults.val == "none") return;
    n.children.forEach((l) => l.dispose()), n.clear();
    const a = Xa[e.frameResults.rawVal];
    (_b = (_a2 = r.analyzeOutputs) == null ? void 0 : _a2.rawVal[a]) == null ? void 0 : _b.forEach((l, c) => {
      var _a3, _b2, _c2, _d, _e, _f;
      const h = ((_a3 = r.elements) == null ? void 0 : _a3.rawVal[c]) ?? [0, 1], p = t.rawVal[h[0]], f = t.rawVal[h[1]];
      if (!p || !f) return;
      const x = new te(...f).distanceTo(new te(...p)), b = ur((_b2 = r.analyzeOutputs) == null ? void 0 : _b2.rawVal[a]), C = ((_f = (_e = (_d = (_c2 = r.elementInputs) == null ? void 0 : _c2.rawVal) == null ? void 0 : _d.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, c)) ?? 0, _ = Ba(p, f, C), S = Ha(a, _), A = new te(..._.e1), P = new te(...S), X = new Tn().makeBasis(A, P, A.clone().cross(P)), [q, G] = fo(a, l), W = o[a] === oo ? [q, -G] : [q, G], U = W.map((D) => D / (b === 0 ? 1 : b)), K = new o[a](p, f, x, X, W, U, false);
      K.updateScale(i() * s.rawVal), n.add(K);
    });
  }), xe.derive(() => {
    if (s.val, e.frameResults.rawVal == "none") return;
    e.gridSize.val;
    const a = i();
    n.children.forEach((l) => l.updateScale(a * s.rawVal));
  }), xe.derive(() => {
    n.visible = e.frameResults.val != "none";
  }), n;
}
function ur(r) {
  let e = 0;
  return r == null ? void 0 : r.forEach((t) => {
    const s = Math.max(...(t ?? [0, 0]).map((i) => Math.abs(i)));
    s > e && (e = s);
  }), e;
}
class pr extends ft {
  constructor(e, t, s) {
    super();
    const i = t === bo.reactions;
    s[0] && (this.xText1 = new Bt(`${i ? "Fx" : "Dx"}: ` + s[0].toFixed(4))), s[3] && (this.xText2 = new Bt(`${i ? "Mx" : "Rx"}: ` + s[3].toFixed(4))), s[1] && (this.yText1 = new Bt(`${i ? "Fy" : "Dy"}: ` + s[1].toFixed(4))), s[4] && (this.yText2 = new Bt(`${i ? "My" : "Ry"}: ` + s[4].toFixed(4))), s[2] && (this.zText1 = new Bt(`${i ? "Fz" : "Dz"}: ` + s[2].toFixed(4))), s[5] && (this.zText2 = new Bt(`${i ? "Mz" : "Rz"}: ` + s[5].toFixed(4))), (s[0] || s[3]) && (this.xArrow = new ti(new te(1, 0, 0), new te(0, 0, 0), 1, 15637248, 0.3, 0.3)), (s[1] || s[4]) && (this.yArrow = new ti(new te(0, 1, 0), new te(0, 0, 0), 1, 15637248, 0.3, 0.3)), (s[2] || s[5]) && (this.zArrow = new ti(new te(0, 0, 1), new te(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...e), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
  }
  updateScale(e) {
    var _a2, _b, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2;
    (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(e, e, e), (_b = this.yArrow) == null ? void 0 : _b.scale.set(e, e, e), (_c2 = this.zArrow) == null ? void 0 : _c2.scale.set(e, e, e), (_d = this.xText1) == null ? void 0 : _d.position.set(1.3 * e, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * e, 0, 0.5 * e), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * e, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * e, 0.5 * e), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * e), (_i = this.zText2) == null ? void 0 : _i.position.set(0, 0, 1.3 * e + 0.5 * e), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * e), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * e), (_l = this.yText1) == null ? void 0 : _l.updateScale(0.4 * e), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * e), (_n2 = this.zText1) == null ? void 0 : _n2.updateScale(0.4 * e), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * e);
  }
  dispose() {
    var _a2, _b, _c2, _d, _e, _f, _g, _h, _i;
    (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c2 = this.zArrow) == null ? void 0 : _c2.dispose(), (_d = this.xText1) == null ? void 0 : _d.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i = this.zText2) == null ? void 0 : _i.dispose();
  }
}
var bo = ((r) => (r.deformations = "deformations", r.reactions = "reactions", r))(bo || {});
function fr(r, e, t, s) {
  const i = new ft();
  return xe.derive(() => {
    var _a2, _b;
    if (e.deformedShape.val, e.nodeResults.val == "none") return;
    i.children.forEach((a) => a.dispose()), i.clear();
    const n = bo[e.nodeResults.rawVal], o = 0.05 * e.gridSize.val;
    (_b = (_a2 = r.deformOutputs) == null ? void 0 : _a2.val[n]) == null ? void 0 : _b.forEach((a, l) => {
      const c = new pr(t.rawVal[l], n, a ?? [0, 0, 0, 0, 0, 0]);
      c.updateScale(o * s.rawVal), i.add(c);
    });
  }), xe.derive(() => {
    if (s.val, e.nodeResults.rawVal == "none") return;
    const n = 0.05 * e.gridSize.val;
    i.children.forEach((o) => o.updateScale(n * s.rawVal));
  }), xe.derive(() => {
    i.visible = e.nodeResults.val != "none";
  }), i;
}
function mr({ drawingObj: r, gridObj: e, scene: t, getActiveCamera: s, controls: i, gridSize: n, derivedDisplayScale: o, rendererElm: a, viewerRender: l }) {
  var _a2;
  const c = new eo(), h = new Fl(), p = (u) => {
    const g = a.getBoundingClientRect(), y = u.clientX - g.left, m = u.clientY - g.top, v = g.width || 1, E = g.height || 1;
    if (!!window.__hekatanSplitMode) {
      const M = v / 2;
      if (y >= M) return h.x = (y - M) / M * 2 - 1, h.y = -(m / E) * 2 + 1, window.__hekatanSplitCamera ?? s();
      h.x = y / M * 2 - 1;
    } else h.x = y / v * 2 - 1;
    return h.y = -(m / E) * 2 + 1, s();
  }, f = new pt(new Ds(1e4, 1e4), new gt({ side: Pt, transparent: true, opacity: 0, depthWrite: false }));
  f.visible = true, f.frustumCulled = false, t.add(f);
  const x = (u, g, y) => {
    const m = new pt(new Ds(1e4, 1e4), new gt({ side: Pt, transparent: true, opacity: 0, depthWrite: false }));
    return m.rotation.set(u, g, y), m.visible = false, m.frustumCulled = false, t.add(m), m;
  }, b = x(Math.PI / 2, 0, 0), C = x(0, Math.PI / 2, 0);
  let _ = false, S = null, A = null, P = null;
  const X = new Vt(new ze(), new mt({ color: 3718648, depthTest: false, transparent: true, opacity: 0.95 }));
  X.name = "ref-ifc-cadena", X.renderOrder = 1e3, X.frustumCulled = false, X.visible = false, t.add(X);
  const q = (u, g, y) => Math.round(u * 1e3) + "," + Math.round(g * 1e3) + "," + Math.round(y * 1e3), G = (u) => {
    const g = /* @__PURE__ */ new Map();
    for (let y = 0; y + 0 < u.length / 6; y++) {
      const m = 6 * y;
      for (const v of [q(u[m], u[m + 1], u[m + 2]), q(u[m + 3], u[m + 4], u[m + 5])]) {
        const E = g.get(v);
        E ? E.push(y) : g.set(v, [y]);
      }
    }
    return g;
  }, W = (u) => {
    const { S: g, adj: y } = u, m = (V, H) => new te(g[6 * V + 3 * H], g[6 * V + 3 * H + 1], g[6 * V + 3 * H + 2]), v = /* @__PURE__ */ new Set([u.s]), E = (V, H) => {
      const ee = [];
      let Z = V, J = H;
      for (let se = 0; se < 3e3; se++) {
        const oe = (y.get(q(J.x, J.y, J.z)) || []).filter((je) => !v.has(je));
        if (oe.length !== 1) break;
        const ie = oe[0], de = m(ie, 0), me = m(ie, 1), ke = de.distanceTo(J) < me.distanceTo(J) ? me : de, Ae = J.clone().sub(Z).normalize(), nt = ke.clone().sub(J).normalize();
        if (Ae.dot(nt) < Math.cos(35 * Math.PI / 180)) break;
        v.add(ie), ee.push(ke), Z = J, J = ke;
      }
      return ee;
    }, k = m(u.s, 0), M = m(u.s, 1), $ = E(k, M), I = E(M, k), T = [...I.reverse(), k, M, ...$], N = I.length;
    if (T.length < 6) return T;
    const F = [], L = [];
    for (let V = 1; V < T.length; V++) F.push(T[V].distanceTo(T[V - 1]));
    for (let V = 1; V < T.length - 1; V++) {
      const H = T[V].clone().sub(T[V - 1]).normalize(), ee = T[V + 1].clone().sub(T[V]).normalize();
      L.push(Math.acos(Math.max(-1, Math.min(1, H.dot(ee)))) / Math.max(1e-6, (F[V - 1] + F[V]) / 2));
    }
    const Y = L.map((V, H) => {
      let ee = 0, Z = 0;
      for (let J = H - 1; J <= H + 1; J++) J >= 0 && J < L.length && (ee += L[J], Z++);
      return ee / Z;
    }), j = [];
    for (let V = 3; V < Y.length - 3; V++) {
      const H = (Y[V - 3] + Y[V - 2] + Y[V - 1]) / 3, ee = (Y[V + 1] + Y[V + 2] + Y[V + 3]) / 3, Z = Math.min(H, ee), J = Math.max(H, ee);
      J > 0.03 && J / Math.max(Z, 1e-6) > 2.2 && Math.abs(Y[V] - (H + ee) / 2) < J && (!j.length || V - j[j.length - 1] > 3) && j.push(V + 1);
    }
    let O = 0, z = T.length - 1;
    for (const V of j) V <= N && V > O && (O = V), V > N && V < z && (z = V);
    return T.slice(O, z + 1);
  }, U = (u) => {
    if (P = u, !u || u.length < 2) {
      X.visible = false;
      return;
    }
    X.geometry.dispose(), X.geometry = new ze().setFromPoints(u), X.visible = true;
  }, K = (u) => {
    let g = 0;
    for (let N = 1; N < u.length - 1; N++) {
      const F = u[N].clone().sub(u[N - 1]).normalize(), L = u[N + 1].clone().sub(u[N]).normalize();
      g += Math.acos(Math.max(-1, Math.min(1, F.dot(L))));
    }
    const y = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
    if (g < 3 * Math.PI / 180) return [u[0].toArray(), u[u.length - 1].toArray()];
    const m = String(window.__hekatanArcModo ?? "angulo"), v = m === "x" ? 0 : m === "y" ? 1 : m === "z" ? 2 : -1, E = [0];
    for (let N = 1; N < u.length; N++) E.push(E[N - 1] + u[N].distanceTo(u[N - 1]));
    const k = (N, F) => {
      for (let L = 1; L < u.length; L++) {
        const Y = N(u[L - 1], L - 1), j = N(u[L], L);
        if (Y <= F && F <= j || j <= F && F <= Y) {
          const O = Math.abs(j - Y) < 1e-12 ? 0 : (F - Y) / (j - Y);
          return u[L - 1].clone().lerp(u[L], O);
        }
      }
      return u[u.length - 1].clone();
    }, M = [], $ = v >= 0 ? u[0].getComponent(v) : 0, I = v >= 0 ? u[u.length - 1].getComponent(v) : 0, T = v >= 0 && Math.abs(I - $) > 1e-6 && u.every((N, F) => F === 0 || (N.getComponent(v) - u[F - 1].getComponent(v)) * (I - $) >= -1e-6);
    for (let N = 0; N <= y; N++) {
      const F = T ? k((L) => L.getComponent(v), $ + (I - $) * N / y) : k((L, Y) => E[Y], E[E.length - 1] * N / y);
      M.push([F.x, F.y, F.z]);
    }
    return M[0] = u[0].toArray(), M[y] = u[u.length - 1].toArray(), M;
  };
  window.__hekatanCadenaIfc = () => (P || []).map((u) => [u.x, u.y, u.z]);
  const D = /* @__PURE__ */ new Map(), R = (u) => {
    const g = D.get(u.id);
    if (g) return g;
    const y = u.geometry.getAttribute("position"), m = y ? Math.floor(y.count / 3) : 0, v = new Float64Array(m * 9), E = new Float64Array(m * 3), k = new Int32Array(m * 3).fill(-1);
    if (y) {
      u.updateMatrixWorld();
      const $ = new te();
      for (let Y = 0; Y < m * 3; Y++) $.fromBufferAttribute(y, Y).applyMatrix4(u.matrixWorld), v[3 * Y] = $.x, v[3 * Y + 1] = $.y, v[3 * Y + 2] = $.z;
      const I = new te(), T = new te(), N = new te(), F = (Y) => Math.round(v[3 * Y] * 1e3) + "," + Math.round(v[3 * Y + 1] * 1e3) + "," + Math.round(v[3 * Y + 2] * 1e3), L = /* @__PURE__ */ new Map();
      for (let Y = 0; Y < m; Y++) {
        const j = 3 * Y;
        I.set(v[3 * (j + 1)] - v[3 * j], v[3 * (j + 1) + 1] - v[3 * j + 1], v[3 * (j + 1) + 2] - v[3 * j + 2]), T.set(v[3 * (j + 2)] - v[3 * j], v[3 * (j + 2) + 1] - v[3 * j + 1], v[3 * (j + 2) + 2] - v[3 * j + 2]), N.crossVectors(I, T).normalize(), E[3 * Y] = N.x, E[3 * Y + 1] = N.y, E[3 * Y + 2] = N.z;
        for (let O = 0; O < 3; O++) {
          const z = F(j + O), V = F(j + (O + 1) % 3), H = z < V ? z + "|" + V : V + "|" + z, ee = L.get(H);
          ee ? ee.push(Y, O) : L.set(H, [Y, O]);
        }
      }
      for (const Y of L.values()) Y.length === 4 && (k[3 * Y[0] + Y[1]] = Y[2], k[3 * Y[2] + Y[3]] = Y[0]);
    }
    const M = { V: v, N: E, vec: k, n: m };
    return D.set(u.id, M), M;
  }, B = new pt(new ze(), new gt({ color: 3718648, transparent: true, opacity: 0.35, depthTest: false, side: Pt }));
  B.name = "ref-ifc-cara", B.renderOrder = 999, B.frustumCulled = false, B.visible = false, t.add(B);
  let Q = null;
  const re = (u, g) => {
    const y = Math.cos(12 * Math.PI / 180), m = Math.cos(80 * Math.PI / 180), v = [u.N[3 * g], u.N[3 * g + 1], u.N[3 * g + 2]], E = new Uint8Array(u.n), k = [], M = [g];
    for (E[g] = 1; M.length && k.length < 4e4; ) {
      const $ = M.pop();
      k.push($);
      for (let I = 0; I < 3; I++) {
        const T = u.vec[3 * $ + I];
        if (T < 0 || E[T]) continue;
        const N = u.N[3 * $] * u.N[3 * T] + u.N[3 * $ + 1] * u.N[3 * T + 1] + u.N[3 * $ + 2] * u.N[3 * T + 2], F = v[0] * u.N[3 * T] + v[1] * u.N[3 * T + 1] + v[2] * u.N[3 * T + 2];
        N >= y && F >= m && (E[T] = 1, M.push(T));
      }
    }
    return k;
  }, pe = (u, g, y) => {
    if (!u || g < 0 || !y) {
      Q && (Q = null, B.visible = false);
      return;
    }
    if (Q && Q.m === u && Q.tris.indexOf(g) >= 0) {
      Q.punto = y.clone();
      return;
    }
    const m = R(u), v = re(m, g), E = new Float32Array(v.length * 9), k = new te();
    let M = true;
    v.forEach(($, I) => {
      for (let T = 0; T < 9; T++) E[9 * I + T] = m.V[9 * $ + T];
      k.x += m.N[3 * $], k.y += m.N[3 * $ + 1], k.z += m.N[3 * $ + 2];
    }), k.normalize();
    for (const $ of v) if (k.x * m.N[3 * $] + k.y * m.N[3 * $ + 1] + k.z * m.N[3 * $ + 2] < Math.cos(5 * Math.PI / 180)) {
      M = false;
      break;
    }
    B.geometry.dispose(), B.geometry = new ze(), B.geometry.setAttribute("position", new bt(E, 3)), B.material.color.set(M ? 3718648 : 16096779), B.visible = true, Q = { m: u, t0: g, tris: v, normal: k, plana: M, punto: y.clone() };
  }, be = (u, g) => {
    const y = new Uint8Array(u.n);
    for (const T of g) y[T] = 1;
    const m = (T) => Math.round(u.V[3 * T] * 1e3) + "," + Math.round(u.V[3 * T + 1] * 1e3) + "," + Math.round(u.V[3 * T + 2] * 1e3), v = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
    for (const T of g) for (let N = 0; N < 3; N++) {
      const F = u.vec[3 * T + N];
      if (F >= 0 && y[F]) continue;
      const L = 3 * T + N, Y = 3 * T + (N + 1) % 3, j = m(L), O = m(Y);
      E.set(j, new te(u.V[3 * L], u.V[3 * L + 1], u.V[3 * L + 2])), E.set(O, new te(u.V[3 * Y], u.V[3 * Y + 1], u.V[3 * Y + 2])), (v.get(j) || v.set(j, []).get(j)).push(O), (v.get(O) || v.set(O, []).get(O)).push(j);
    }
    const k = /* @__PURE__ */ new Set();
    let M = [];
    for (const T of v.keys()) {
      if (k.has(T)) continue;
      const N = [T];
      k.add(T);
      let F = "", L = T;
      for (let Y = 0; Y < 1e5; Y++) {
        const j = (v.get(L) || []).find((O) => O !== F && !k.has(O));
        if (!j) break;
        N.push(j), k.add(j), F = L, L = j;
      }
      N.length > M.length && (M = N);
    }
    const $ = M.map((T) => E.get(T)), I = [];
    for (let T = 0; T < $.length; T++) {
      const N = $[(T + $.length - 1) % $.length], F = $[T], L = $[(T + 1) % $.length];
      if (F.distanceTo(N) < 1e-3) continue;
      const Y = F.clone().sub(N).normalize(), j = L.clone().sub(F).normalize();
      Y.dot(j) > Math.cos(3 * Math.PI / 180) || I.push(F);
    }
    return I;
  }, le = (u, g, y) => {
    const v = new eo(g.clone().addScaledVector(y, -2e-3), y.clone().negate(), 0, 3).intersectObject(u, false);
    return v.length ? v[0].distance + 2e-3 : null;
  };
  window.__hekatanRaycast = (u, g, y, m = 2) => {
    const v = new te(u[0], u[1], u[2]), E = new te(g[0], g[1], g[2]).normalize();
    let k = null;
    for (const M of [1, -1]) {
      const I = new eo(v, E.clone().multiplyScalar(M), 0, m).intersectObjects(y, false);
      I.length && (k == null || I[0].distance < k) && (k = I[0].distance);
    }
    return k;
  }, window.__hekatanCaraIfc = () => Q ? { tris: Q.tris.length, plana: Q.plana, normal: Q.normal.toArray(), punto: Q.punto.toArray(), contorno: be(R(Q.m), Q.tris).map((u) => [u.x, u.y, u.z]) } : null;
  const ne = /* @__PURE__ */ new Map(), ae = new is(new ze(), new mt({ color: 16498468, transparent: true, opacity: 0.35, depthTest: true }));
  ae.name = "ref-ifc-bordes", ae.frustumCulled = false, ae.visible = false, t.add(ae);
  const ue = 1, he = (u, g, y) => Math.floor(u / ue) + "," + Math.floor(g / ue) + "," + Math.floor(y / ue), Se = (u) => {
    const g = ne.get(u.id);
    if (g) return g;
    const y = u.geometry.getAttribute("position"), m = [], v = /* @__PURE__ */ new Map();
    if (y) {
      u.updateMatrixWorld();
      const k = Math.floor(y.count / 3), M = new Float64Array(y.count * 3), $ = new te();
      for (let O = 0; O < y.count; O++) $.fromBufferAttribute(y, O).applyMatrix4(u.matrixWorld), M[3 * O] = $.x, M[3 * O + 1] = $.y, M[3 * O + 2] = $.z;
      const I = (O) => Math.round(M[3 * O] * 1e3) + "," + Math.round(M[3 * O + 1] * 1e3) + "," + Math.round(M[3 * O + 2] * 1e3), T = new Float64Array(k * 3), N = new te(), F = new te(), L = new te();
      for (let O = 0; O < k; O++) {
        const z = 3 * O, V = 3 * O + 1, H = 3 * O + 2;
        N.set(M[3 * V] - M[3 * z], M[3 * V + 1] - M[3 * z + 1], M[3 * V + 2] - M[3 * z + 2]), F.set(M[3 * H] - M[3 * z], M[3 * H + 1] - M[3 * z + 1], M[3 * H + 2] - M[3 * z + 2]), L.crossVectors(N, F).normalize(), T[3 * O] = L.x, T[3 * O + 1] = L.y, T[3 * O + 2] = L.z;
      }
      const Y = /* @__PURE__ */ new Map();
      for (let O = 0; O < k; O++) for (let z = 0; z < 3; z++) {
        const V = 3 * O + z, H = 3 * O + (z + 1) % 3, ee = I(V), Z = I(H), J = ee < Z ? ee + "|" + Z : Z + "|" + ee, se = Y.get(J);
        se ? se.push(O) : Y.set(J, [O, V, H]);
      }
      const j = Math.cos(25 * Math.PI / 180);
      for (const O of Y.values()) {
        const z = O[0], V = O[1], H = O[2];
        let ee = O.length === 3;
        if (!ee && O.length === 4) {
          const J = O[3], se = T[3 * z] * T[3 * J] + T[3 * z + 1] * T[3 * J + 1] + T[3 * z + 2] * T[3 * J + 2];
          ee = Math.abs(se) < j;
        }
        if (!ee) continue;
        const Z = m.length / 6;
        m.push(M[3 * V], M[3 * V + 1], M[3 * V + 2], M[3 * H], M[3 * H + 1], M[3 * H + 2]);
        for (const [J, se, oe] of [[M[3 * V], M[3 * V + 1], M[3 * V + 2]], [M[3 * H], M[3 * H + 1], M[3 * H + 2]], [(M[3 * V] + M[3 * H]) / 2, (M[3 * V + 1] + M[3 * H + 1]) / 2, (M[3 * V + 2] + M[3 * H + 2]) / 2]]) {
          const ie = he(J, se, oe), de = v.get(ie);
          de ? de[de.length - 1] !== Z && de.push(Z) : v.set(ie, [Z]);
        }
      }
    }
    const E = { segs: new Float32Array(m), celdas: v };
    return ne.set(u.id, E), E;
  };
  let ve = "";
  const Oe = (u) => {
    const g = u.map((k) => k.id).join(",");
    if (g === ve) return;
    ve = g;
    const y = u.map((k) => Se(k).segs);
    let m = 0;
    for (const k of y) m += k.length;
    const v = new Float32Array(m);
    let E = 0;
    for (const k of y) v.set(k, E), E += k.length;
    ae.geometry.dispose(), ae.geometry = new ze(), ae.geometry.setAttribute("position", new bt(v, 3)), ae.visible = m > 0 && window.__hekatanRefIfcBordes !== false;
  };
  window.__hekatanRefIfcBordesRefrescar = () => {
    ae.visible = ve !== "" && window.__hekatanRefIfcBordes !== false, l();
  }, window.__hekatanBordesIfc = () => {
    let u = 0;
    for (const g of ne.values()) u += g.segs.length / 6;
    return u;
  };
  const He = (u, g) => {
    const y = window.__hekatanCursorPx;
    if (!y) return null;
    const m = Se(u), v = m.segs, E = Math.floor(g.x / ue), k = Math.floor(g.y / ue), M = Math.floor(g.z / ue), $ = /* @__PURE__ */ new Set();
    let I = Fs, T = null, N = Fs, F = null, L = -1;
    const Y = new te(), j = new te();
    for (let O = -1; O <= 1; O++) for (let z = -1; z <= 1; z++) for (let V = -1; V <= 1; V++) {
      const H = m.celdas.get(E + O + "," + (k + z) + "," + (M + V));
      if (H) for (const ee of H) {
        if ($.has(ee)) continue;
        $.add(ee);
        const Z = 6 * ee;
        Y.set(v[Z], v[Z + 1], v[Z + 2]), j.set(v[Z + 3], v[Z + 4], v[Z + 5]);
        const J = Ws(Y.x, Y.y, Y.z), se = Ws(j.x, j.y, j.z);
        if (!J || !se) continue;
        const oe = Math.hypot(J.x - y.x, J.y - y.y), ie = Math.hypot(se.x - y.x, se.y - y.y);
        oe < I && (I = oe, T = Y.clone()), ie < I && (I = ie, T = j.clone());
        const de = se.x - J.x, me = se.y - J.y, ke = de * de + me * me || 1e-9;
        let Ae = ((y.x - J.x) * de + (y.y - J.y) * me) / ke;
        Ae = Math.max(0, Math.min(1, Ae));
        const nt = Math.hypot(y.x - (J.x + Ae * de), y.y - (J.y + Ae * me));
        nt < N && (N = nt, F = Y.clone().lerp(j, Ae), L = ee);
      }
    }
    return L >= 0 && (m.adj || (m.adj = G(m.segs)), A = { S: m.segs, adj: m.adj, s: L }), T ? { tipo: "ifcVert", punto: T } : F ? { tipo: "ifcEdge", punto: F } : null;
  }, dt = () => {
    var _a3, _b, _c2;
    if (window.__hekatanRefIfcSnap === false) return null;
    const u = [];
    if (t.traverse((E) => {
      var _a4;
      ((_a4 = E.userData) == null ? void 0 : _a4.refIfc) && E.isMesh && u.push(E);
    }), !u.length) return ae.visible = false, ve = "", null;
    Oe(u);
    const g = c.intersectObjects(u, false).filter((E) => {
      const k = E.object.material;
      return (k && k.clippingPlanes || []).every(($) => $.distanceToPoint(E.point) >= 0);
    });
    if (!g.length) return null;
    const y = g[0], m = g[1];
    ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) === "ifcface" ? pe(y.object, y.faceIndex ?? -1, y.point) : Q && pe(null, -1, null);
    const v = He(y.object, y.point);
    if (v) return S = { tipo: v.tipo }, [{ ...y, point: v.punto }];
    if (m && m.object === y.object && m.distance - y.distance <= 1.2) {
      const E = y.point.clone().add(m.point).multiplyScalar(0.5);
      return S = { tipo: "ifcAxis" }, [{ ...y, point: E }];
    }
    return S = { tipo: "ifc" }, [y];
  };
  let wt = "", Ce = new Float32Array(0);
  const ce = new is(new ze(), new mt({ color: 16096779, transparent: true, opacity: 0.95, depthTest: false }));
  ce.name = "ref-ifc-seccion", ce.renderOrder = 998, ce.frustumCulled = false, ce.visible = false, t.add(ce);
  const _e = () => {
    const u = window.__hekatanClip;
    if (!u || window.__hekatanRefIfcSnap === false) return ce.visible = false, Ce = new Float32Array(0);
    const g = [];
    u.enableX && g.push([0, +u.posX]), u.enableY && g.push([1, +u.posY]), u.enableZ && g.push([2, +u.posZ]);
    const y = [];
    t.traverse((E) => {
      var _a3;
      ((_a3 = E.userData) == null ? void 0 : _a3.refIfc) && E.isMesh && y.push(E);
    });
    const m = JSON.stringify(g) + "|" + y.map((E) => E.id).join(",");
    if (m === wt) return Ce;
    wt = m;
    const v = [];
    if (g.length && y.length) {
      const E = [new te(), new te(), new te()];
      for (const k of y) {
        const M = k.geometry.getAttribute("position");
        if (M) {
          k.updateMatrixWorld();
          for (let $ = 0; $ + 2 < M.count; $ += 3) {
            for (let I = 0; I < 3; I++) E[I].fromBufferAttribute(M, $ + I).applyMatrix4(k.matrixWorld);
            for (const [I, T] of g) {
              const N = [E[0].getComponent(I) - T, E[1].getComponent(I) - T, E[2].getComponent(I) - T], F = [];
              for (let L = 0; L < 3; L++) {
                const Y = E[L], j = E[(L + 1) % 3], O = N[L], z = N[(L + 1) % 3];
                (O < 0 && z >= 0 || O >= 0 && z < 0) && F.push(Y.clone().lerp(j, O / (O - z)));
              }
              F.length === 2 && v.push(F[0].x, F[0].y, F[0].z, F[1].x, F[1].y, F[1].z);
            }
          }
        }
      }
    }
    return Ce = new Float32Array(v), ce.geometry.dispose(), ce.geometry = new ze(), ce.geometry.setAttribute("position", new bt(Ce, 3)), ce.visible = Ce.length > 0, Ce;
  };
  let ge = null, ye = null;
  const Le = (u, g) => {
    const y = _e();
    if (!y.length) return null;
    let m = Fs * 2, v = null, E = -1;
    const k = new te(), M = new te();
    for (let $ = 0; $ + 5 < y.length; $ += 6) {
      k.set(y[$], y[$ + 1], y[$ + 2]), M.set(y[$ + 3], y[$ + 4], y[$ + 5]);
      const I = Ws(k.x, k.y, k.z), T = Ws(M.x, M.y, M.z);
      if (!I || !T) continue;
      const N = T.x - I.x, F = T.y - I.y, L = N * N + F * F || 1e-9;
      let Y = ((u - I.x) * N + (g - I.y) * F) / L;
      Y = Math.max(0, Math.min(1, Y));
      const j = Math.hypot(u - (I.x + Y * N), g - (I.y + Y * F));
      j < m && (m = j, v = k.clone().lerp(M, Y), E = $ / 6);
    }
    return E >= 0 && (ye !== y && (ge = G(y), ye = y), A = { S: y, adj: ge, s: E }), v;
  };
  let Te = null;
  window.__hekatanSeccionIfc = () => _e().length / 6, window.__hekatanSeccionIfcPuntos = (u = 200) => {
    const g = _e(), y = [], m = Math.max(1, Math.floor(g.length / 6 / u));
    for (let v = 0; v + 2 < g.length; v += 6 * m) y.push([g[v], g[v + 1], g[v + 2]]);
    return y;
  };
  const Me = () => {
    S = null;
    const u = dt();
    if (u) return u;
    if (_) return c.intersectObjects([f], false);
    if (b.visible = !!window.__hekatanGridPlaneXZ, C.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && os.visible) {
      const m = c.intersectObjects([os, ps, fs], false);
      if (m.length > 0) return m;
    }
    const y = [f];
    return b.visible && y.push(b), C.visible && y.push(C), Es.visible && ri.length > 0 && y.push(...ri), c.intersectObjects(y, false);
  }, Ie = new _n(new ze(), new kn()), Ne = new _n(new ze(), new kn({ color: "gray", sizeAttenuation: false, size: 6 })), Ge = new _n(new ze(), new kn({ color: "orange", sizeAttenuation: false, size: 5 }));
  t.add(Ge);
  const Ee = document.createElement("input");
  Ee.id = "hk-rubber-label", Ee.type = "text", Ee.spellcheck = false, Ee.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, Ee.style.cssText = ["position:fixed", "z-index:99996", "padding:3px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(-50%,-50%)", "white-space:nowrap", "outline:none", "width:80px", "text-align:center", "display:none", "pointer-events:none"].join(";") + ";", document.body.appendChild(Ee);
  const tt = document.createElement("div");
  tt.id = "hk-rubber-angle", tt.style.cssText = ["position:fixed", "z-index:99996", "pointer-events:none", "padding:2px 6px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px", "font-family:Consolas,monospace", "font-size:12px", "transform:translate(-50%,0)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(tt);
  let Ye = null, Ze = null, $e = false;
  const Ve = new te(), Rt = (u, g, y, m, v, E) => {
    const k = m - u, M = v - g, $ = E - y, I = Math.hypot(k, M, $);
    if (I < 0.01) {
      Ee.style.display = "none";
      return;
    }
    Ye = [u, g, y], Ze = [k / I, M / I, $ / I], Ve.set((u + m) / 2, (g + v) / 2, (y + E) / 2), Ve.project(s());
    const T = a.getBoundingClientRect(), N = T.left + (Ve.x * 0.5 + 0.5) * T.width, F = T.top + (-Ve.y * 0.5 + 0.5) * T.height;
    Ee.style.left = N + "px", Ee.style.top = F + "px", Ee.style.display = "block";
    const L = new te(u, g, y).project(s()), Y = new te(m, v, E).project(s()), j = T.left + (L.x * 0.5 + 0.5) * T.width, O = T.top + (-L.y * 0.5 + 0.5) * T.height, z = T.left + (Y.x * 0.5 + 0.5) * T.width, V = T.top + (-Y.y * 0.5 + 0.5) * T.height;
    let H = Math.atan2(-(V - O), z - j) * 180 / Math.PI;
    if (H < 0 && (H += 360), tt.textContent = `${Math.round(H) % 360}\xB0`, tt.style.left = z + "px", tt.style.top = V + 34 + "px", tt.style.display = "block", !$e) {
      if (Ee.value = `${I.toFixed(2)} m`, document.activeElement !== Ee) {
        const ee = document.activeElement;
        ee && (ee.tagName === "INPUT" || ee.tagName === "TEXTAREA") && ee !== Ee || Ee.focus({ preventScroll: true });
      }
      try {
        Ee.select();
      } catch {
      }
    }
  }, ot = () => {
    Ee.style.display = "none", tt.style.display = "none", Ye = null, Ze = null, $e = false, document.activeElement === Ee && Ee.blur();
  }, At = (u) => {
    var _a3, _b, _c2, _d, _e2, _f, _g, _h;
    const g = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select";
    if (g === "offset") {
      Zs = u, we(`\u21C9 DESFASE distancia ${u} m \u2014 designe la l\xEDnea y luego el lado.`), Ee.blur();
      try {
        (_d = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d.call(window);
      } catch {
      }
      return;
    }
    if (g === "circle" && qe.length === 1) {
      const T = qe[0];
      qe = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, T[0], T[1], T[2], u), we(`\u2713 C\xEDrculo r=${u} m en (${T[0].toFixed(2)}, ${T[1].toFixed(2)}, ${T[2].toFixed(2)}).`);
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
    if (g === "col" || g === "wall" || g === "extp" || g === "extl") {
      It = u, we(`\u{1F4D0} Altura ${u}m memorizada \u2014 hac\xE9 el click para crear ${{ col: "columna", wall: "pared", extp: "extrusi\xF3n punto\u2192l\xEDnea", extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea" }[g]}.`), Ee.blur();
      return;
    }
    if (!Ye || !Ze || !r.polylines) return;
    let y = Ze[0], m = Ze[1], v = Ze[2];
    zt === "x" ? (y = Math.sign(y) || 1, m = 0, v = 0) : zt === "y" ? (y = 0, m = Math.sign(m) || 1, v = 0) : zt === "z" && (y = 0, m = 0, v = Math.sign(v) || 1);
    const E = Ye[0] + y * u, k = Ye[1] + m * u, M = Ye[2] + v * u;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), r.points.val = [...r.points.rawVal, [E, k, M]];
    const $ = r.polylines.rawVal, I = $.length ? $[$.length - 1] : [];
    r.polylines.val = [...$.slice(0, -1), [...I, r.points.rawVal.length - 1]], Ee.blur();
    try {
      (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
    } catch {
    }
    l();
  }, jt = (u) => {
    let g = u.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!g) return null;
    const y = g.startsWith("@");
    if (y && (g = g.slice(1)), g.includes("<")) {
      const v = g.split("<").map((E) => parseFloat(E.trim()));
      if (v.some(isNaN)) return null;
      if (v.length === 2) {
        const [E, k] = v;
        return y ? { kind: "relPolar", L: E, ang: k } : { kind: "absPolar", L: E, ang: k };
      }
      if (v.length === 3 && y) {
        const [E, k, M] = v;
        return { kind: "relSpherical", L: E, az: k, el: M };
      }
      return null;
    }
    if (g.includes(",")) {
      const v = g.split(",").map(($) => parseFloat($.trim()));
      if (v.some(isNaN)) return null;
      const [E, k, M = 0] = v;
      return y ? { kind: "relCart", dx: E, dy: k, dz: M } : { kind: "absCart", x: E, y: k, z: M };
    }
    const m = parseFloat(g);
    return isNaN(m) || m <= 0 ? null : { kind: "length", L: m };
  }, at = (u) => {
    if (!u) return null;
    if (u.kind === "absCart") return [u.x, u.y, u.z];
    if (u.kind === "relCart") return Ye ? [Ye[0] + u.dx, Ye[1] + u.dy, Ye[2] + u.dz] : null;
    if (u.kind === "absPolar") {
      const g = u.ang * Math.PI / 180;
      return [u.L * Math.cos(g), u.L * Math.sin(g), 0];
    }
    if (u.kind === "relPolar") {
      if (!Ye) return null;
      const g = u.ang * Math.PI / 180;
      return [Ye[0] + u.L * Math.cos(g), Ye[1] + u.L * Math.sin(g), Ye[2]];
    }
    if (u.kind === "relSpherical") {
      if (!Ye) return null;
      const g = u.az * Math.PI / 180, y = u.el * Math.PI / 180, m = u.L * Math.cos(y);
      return [Ye[0] + m * Math.cos(g), Ye[1] + m * Math.sin(g), Ye[2] + u.L * Math.sin(y)];
    }
    return null;
  }, Qe = (u) => {
    var _a3, _b;
    if (!r.polylines) return;
    window.__hekatanPushUndo && window.__hekatanPushUndo(), r.points.val = [...r.points.rawVal, u];
    const g = r.polylines.rawVal, y = g.length ? g[g.length - 1] : [];
    r.polylines.val = [...g.slice(0, -1), [...y, r.points.rawVal.length - 1]], Ye = u, Ee.blur();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    l();
    try {
      (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
    } catch {
    }
  };
  window.__hekatanTypeCoord = (u) => {
    var _a3;
    const g = jt(u);
    if (!g) return false;
    if (g.kind === "length") return At(g.L), true;
    const y = at(g);
    if (!y) return false;
    Go(new te(y[0], y[1], y[2]), null), Ye = y, Ee.blur();
    try {
      (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return true;
  }, Ee.addEventListener("keydown", (u) => {
    var _a3, _b, _c2;
    if (u.key === "Enter") {
      if (u.preventDefault(), !$e) {
        (_a3 = window.__hekatanFinalizeDraw) == null ? void 0 : _a3.call(window);
        try {
          (_c2 = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c2.call(_b, "select");
        } catch {
        }
        return;
      }
      const y = jt(Ee.value);
      if (!y) return;
      if ($e = false, y.kind === "length") At(y.L), we(`\u270F DDE ${y.L}m aplicado en direcci\xF3n actual`);
      else {
        const m = at(y);
        if (!m) return;
        Qe(m);
        const v = y.kind;
        we(`\u270F ${v} \u2192 (${m[0].toFixed(2)}, ${m[1].toFixed(2)}, ${m[2].toFixed(2)})`);
      }
      return;
    }
    if (u.key === "Escape") {
      u.preventDefault(), $e = false, Ee.blur();
      return;
    }
    const g = u.key.toLowerCase();
    if (g === "x" || g === "y" || g === "z") {
      u.preventDefault(), setTimeout(() => {
        if (!$e && Ee.style.display === "block") try {
          Ee.select();
        } catch {
        }
      }, 0);
      return;
    }
    (/^[0-9.\-]$/.test(u.key) || u.key === "Backspace" || u.key === "Delete") && ($e = true);
  }), window.addEventListener("keydown", (u) => {
    if (!Ye || !Ze || document.activeElement === Ee) return;
    const g = document.activeElement;
    g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(u.key) && (Ee.value = u.key, Ee.focus(), Ee.setSelectionRange(1, 1), u.preventDefault());
  });
  const Fe = document.createElement("div");
  Fe.id = "hk-coord-readout", Fe.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:4px 8px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px", "font-family:Consolas,monospace", "font-size:11px", "transform:translate(12px,-22px)", "white-space:nowrap", "display:none"].join(";") + ";", Fe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Fe);
  const st = document.createElement("div");
  st.id = "hk-coord-fixed", st.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "right:80px", "top:10px", "padding:6px 14px", "background:rgba(15,23,42,0.92)", "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)", "border-radius:5px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:500", "white-space:nowrap", "letter-spacing:0.3px", "box-shadow:0 2px 8px rgba(0,0,0,0.4)", "backdrop-filter:blur(4px)"].join(";") + ";", st.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(st);
  const Re = new Vt(new ze().setFromPoints([new te(0, 0, 0), new te(0, 0, 0)]), new Ti({ color: 2282478, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.85, linewidth: 2 }));
  Re.frustumCulled = false, Re.visible = false, Re.name = "rubberBand", t.add(Re), window.__hekatanRubberBand = Re;
  const ht = new Vt(new ze(), new mt({ color: 2282478, transparent: true, opacity: 0.9 }));
  ht.frustumCulled = false, ht.visible = false, t.add(ht);
  let lt = [];
  const Tt = new Vt(new ze(), new mt({ color: 16763904, transparent: true, opacity: 0.95 }));
  Tt.frustumCulled = false, Tt.visible = false, Tt.renderOrder = 999, t.add(Tt);
  let Ke = [];
  const it = document.createElement("div");
  it.id = "hk-measure-label", it.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(it);
  const Wt = (u) => {
    var _a3, _b;
    const g = p(u);
    if (!g) return null;
    c.setFromCamera(h, g);
    let y = null, m = null;
    const v = c.intersectObjects(t.children, true).filter((F) => F.object.isMesh && F.object !== vt && F.object !== _t && F.object.visible !== false);
    if (v.length) {
      const F = v[0], L = F.point;
      y = [L.x, L.y, L.z];
      const j = (_b = (_a3 = F.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
      j && F.face && (m = [F.face.a, F.face.b, F.face.c].map((O) => {
        const z = new te().fromBufferAttribute(j, O);
        return F.object.localToWorld(z), [z.x, z.y, z.z];
      }));
    } else {
      const F = Me();
      if (F.length) {
        const L = F[0].point;
        y = [L.x, L.y, L.z];
      }
    }
    if (!y) return null;
    const E = a.getBoundingClientRect(), k = (F) => {
      const L = new te(F[0], F[1], F[2]).project(g);
      return [E.left + (L.x * 0.5 + 0.5) * E.width, E.top + (-L.y * 0.5 + 0.5) * E.height];
    }, M = [u.clientX, u.clientY], $ = 14;
    let I = y, T = $;
    const N = (F) => {
      const L = k(F), Y = Math.hypot(L[0] - M[0], L[1] - M[1]);
      Y < T && (T = Y, I = F);
    };
    for (const F of m ?? []) N(F);
    for (const F of r.points.rawVal) N(F);
    return I;
  }, Dt = () => {
    if (Ke.length < 1) {
      it.style.display = "none";
      return;
    }
    const u = s(), g = Ke[0], y = Ke[1] ?? Ke[0], v = new te((g[0] + y[0]) / 2, (g[1] + y[1]) / 2, (g[2] + y[2]) / 2).clone().project(u), E = a.getBoundingClientRect();
    it.style.left = E.left + (v.x * 0.5 + 0.5) * E.width + "px", it.style.top = E.top + (-v.y * 0.5 + 0.5) * E.height - 14 + "px", it.style.display = "block";
  };
  window.__hekatanMeasureRefresh = Dt, window.__hekatanClearMeasure = () => {
    Ke = [], Tt.visible = false, it.style.display = "none";
    try {
      l();
    } catch {
    }
  };
  try {
    (_a2 = i.addEventListener) == null ? void 0 : _a2.call(i, "change", Dt);
  } catch {
  }
  const _t = new pt(new ze(), new gt({ color: 16096779, transparent: true, opacity: 0.35, side: Pt, depthWrite: false }));
  _t.frustumCulled = false, _t.visible = false, _t.renderOrder = 998, _t.name = "hk-fill-preview", t.add(_t), a.addEventListener("pointerleave", () => {
    Fe.style.display = "none", _t.visible && (_t.visible = false, l());
  });
  const ks = (u) => {
    var _a3, _b, _c2, _d;
    const g = r.points.rawVal, y = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = /* @__PURE__ */ new Map(), v = (O, z) => {
      O !== z && ((m.get(O) ?? m.set(O, /* @__PURE__ */ new Set()).get(O)).add(z), (m.get(z) ?? m.set(z, /* @__PURE__ */ new Set()).get(z)).add(O));
    };
    for (const O of y) for (let z = 0; z + 1 < O.length; z++) v(O[z], O[z + 1]);
    const E = (O, z) => {
      var _a4;
      return !!((_a4 = m.get(O)) == null ? void 0 : _a4.has(z));
    }, k = [], M = /* @__PURE__ */ new Set(), $ = [...m.keys()];
    for (const O of $) for (const z of m.get(O)) if (!(z < O)) {
      for (const V of m.get(z)) if (V !== O) for (const H of m.get(V)) {
        if (H === O || H === z || !E(H, O) || E(O, V) || E(z, H)) continue;
        const ee = [O, z, V, H].slice().sort((Z, J) => Z - J).join("-");
        M.has(ee) || (M.add(ee), k.push([O, z, V, H]));
      }
    }
    for (const O of $) for (const z of m.get(O)) if (!(z < O)) for (const V of m.get(z)) {
      if (V === O || !E(V, O)) continue;
      const H = [O, z, V].slice().sort((ee, Z) => ee - Z).join("-");
      M.has(H) || (M.add(H), k.push([O, z, V]));
    }
    const I = ((_d = (_c2 = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c2.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", T = (O) => I === "xy" ? [O[0], O[1]] : I === "xz" ? [O[0], O[2]] : [O[1], O[2]], N = T(u), F = (O, z) => {
      let V = false;
      for (let H = 0, ee = z.length - 1; H < z.length; ee = H++) {
        const Z = z[H][0], J = z[H][1], se = z[ee][0], oe = z[ee][1];
        J > O[1] != oe > O[1] && O[0] < (se - Z) * (O[1] - J) / (oe - J) + Z && (V = !V);
      }
      return V;
    }, L = (O) => {
      let z = 0;
      for (let V = 0, H = O.length - 1; V < O.length; H = V++) z += (O[H][0] + O[V][0]) * (O[H][1] - O[V][1]);
      return Math.abs(z) / 2;
    };
    let Y = null, j = 1 / 0;
    for (const O of k) {
      const z = O.map((H) => T(g[H]));
      if (!F(N, z)) continue;
      const V = L(z);
      V < j && (j = V, Y = O);
    }
    return Y;
  }, Lt = new ft(), Ht = new pt(new Ds(1, 1), new gt({ color: 2282478, transparent: true, opacity: 0.08, side: Pt, depthWrite: false })), Cs = new is(new oa(new Ds(1, 1)), new mt({ color: 2282478, transparent: true, opacity: 0.85 })), Bs = new is(new ze(), new mt({ color: 2282478, transparent: true, opacity: 0.3 })), qi = (u, g) => {
    const y = [], m = Math.ceil(u / g);
    for (let v = -m; v <= m; v++) {
      const E = v * g;
      y.push(-u, E, 0, u, E, 0), y.push(E, -u, 0, E, u, 0);
    }
    Bs.geometry.dispose(), Bs.geometry = new ze(), Bs.geometry.setAttribute("position", new Mt(y, 3));
  };
  Lt.add(Ht, Cs, Bs), Lt.visible = false, Lt.frustumCulled = false, t.add(Lt);
  const Zt = new ft();
  Zt.frustumCulled = false, Zt.visible = false, t.add(Zt);
  const Ss = (u) => {
    const g = new ze().setFromPoints([new te(0, 0, 0), new te(0, 0, 0)]), y = new Ti({ color: u, dashSize: 0.15, gapSize: 0.08, transparent: true, opacity: 0.5, linewidth: 1 });
    return new Vt(g, y);
  }, Hs = Ss(16711680), Xs = Ss(65280), Ys = Ss(35071);
  Zt.add(Hs, Xs, Ys);
  const vi = [], Fn = (u) => u.traverse((g) => {
    var _a3, _b, _c2, _d;
    (_b = (_a3 = g.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c2 = g.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
  }), Kt = Ss(16761856);
  Kt.material.dashSize = 0.28, Kt.material.gapSize = 0.16, Kt.material.opacity = 0.9, Kt.frustumCulled = false, Kt.visible = false, Kt.renderOrder = 98, t.add(Kt);
  const _i = (u) => {
    const g = new ze().setFromPoints([new te(0, 0, 0), new te(0, 0, 0), new te(0, 0, 0), new te(0, 0, 0)]), y = new mt({ color: u, transparent: true, opacity: 0.2, depthTest: false }), m = new Pa(g, y);
    return m.renderOrder = 997, m.frustumCulled = false, m;
  }, Us = _i(3462041), oi = _i(16724804), ai = _i(6333946), us = new ft();
  us.frustumCulled = false, us.visible = false, t.add(us), us.add(Us, oi, ai);
  const li = (u) => {
    const g = new Ds(1, 1), y = new gt({ color: u, transparent: true, opacity: 0.06, side: Pt, depthWrite: false }), m = new pt(g, y);
    return m.frustumCulled = false, m.renderOrder = 996, m;
  }, os = li(3462041), ps = li(16724804), fs = li(6333946);
  us.add(os, ps, fs);
  const Ms = (u, g, y, m) => {
    u.scale.set(2 * m, 2 * m, 1), y === "xy" ? (u.position.set(g[0], g[1], g[2]), u.rotation.set(0, 0, 0)) : y === "xz" ? (u.position.set(g[0], g[1], g[2]), u.rotation.set(Math.PI / 2, 0, 0)) : (u.position.set(g[0], g[1], g[2]), u.rotation.set(0, Math.PI / 2, 0));
  }, gs = document.createElement("div");
  gs.id = "hk-refplane-badge", gs.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99997", "padding:3px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold", "transform:translate(20px,40px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(gs), window.__hekatanSetOrthoPlanes = (u) => {
    var _a3;
    if (window.__hekatanShowOrthoPlanes = u, us.visible = u, u) {
      const g = window.__hekatanOrthoAnchor, y = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = y[y.length - 1] ?? [], v = r.points.rawVal ?? [], E = g && g.length === 3 ? g : m.length > 0 && v[m[m.length - 1]] ? v[m[m.length - 1]] : [0, 0, 0], k = window.__hekatanOrthoExt ?? 8;
      $s(Us, E, "xy", k), $s(oi, E, "xz", k), $s(ai, E, "yz", k), Ms(os, E, "xy", k), Ms(ps, E, "xz", k), Ms(fs, E, "yz", k), os.material.opacity = 0.05, ps.material.opacity = 0.05, fs.material.opacity = 0.05;
    } else {
      const g = document.getElementById("hk-refplane-badge");
      g && (g.style.display = "none");
    }
    l();
  }, window.__hekatanSetOrthoExt = (u) => {
    var _a3;
    if (window.__hekatanOrthoExt = u, !us.visible) {
      l();
      return;
    }
    const g = window.__hekatanOrthoAnchor, y = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = y[y.length - 1] ?? [], v = r.points.rawVal ?? [], E = g && g.length === 3 ? g : m.length > 0 && v[m[m.length - 1]] ? v[m[m.length - 1]] : [0, 0, 0];
    $s(Us, E, "xy", u), $s(oi, E, "xz", u), $s(ai, E, "yz", u), Ms(os, E, "xy", u), Ms(ps, E, "xz", u), Ms(fs, E, "yz", u), l();
  };
  const So = (u) => {
    if (os.material.opacity = u === "xy" ? 0.09 : 0.025, ps.material.opacity = u === "xz" ? 0.09 : 0.025, fs.material.opacity = u === "yz" ? 0.09 : 0.025, u) {
      const v = { xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" }, xz: { bg: "rgba(255,51,68,0.90)", text: "#1f0a0e" }, yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" } }[u];
      gs.style.background = v.bg, gs.style.color = v.text, gs.textContent = `\u25A6 Plano ${u.toUpperCase()}`, gs.style.display = "block";
    } else gs.style.display = "none";
  }, $s = (u, g, y, m) => {
    let v;
    y === "xy" ? v = [new te(g[0] - m, g[1] - m, g[2]), new te(g[0] + m, g[1] - m, g[2]), new te(g[0] + m, g[1] + m, g[2]), new te(g[0] - m, g[1] + m, g[2]), new te(g[0] - m, g[1] - m, g[2])] : y === "xz" ? v = [new te(g[0] - m, g[1], g[2] - m), new te(g[0] + m, g[1], g[2] - m), new te(g[0] + m, g[1], g[2] + m), new te(g[0] - m, g[1], g[2] + m), new te(g[0] - m, g[1], g[2] - m)] : v = [new te(g[0], g[1] - m, g[2] - m), new te(g[0], g[1] + m, g[2] - m), new te(g[0], g[1] + m, g[2] + m), new te(g[0], g[1] - m, g[2] + m), new te(g[0], g[1] - m, g[2] - m)], u.geometry.setFromPoints(v);
  };
  let zt = null;
  window.__hekatanAxisLock = () => zt;
  let ji = null, Xt = null;
  const Yt = document.createElement("div");
  Yt.id = "hk-axis-lock-badge", Yt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99998", "padding:4px 10px", "border-radius:4px", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "transform:translate(20px,18px)", "white-space:nowrap", "display:none"].join(";") + ";", document.body.appendChild(Yt);
  const Mo = () => {
    if (!zt) {
      Yt.style.display = "none";
      return;
    }
    const u = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    Yt.style.background = "rgba(15,23,42,0.92)", Yt.style.color = u[zt], Yt.style.border = `1.5px solid ${u[zt]}`, Yt.textContent = `\u{1F512} LOCK ${zt.toUpperCase()}`, Yt.style.display = "block";
  };
  window.addEventListener("keydown", (u) => {
    var _a3, _b, _c2, _d, _e2, _f;
    const g = document.activeElement;
    if (g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA") && g !== Ee) return;
    const y = u.key.toLowerCase(), m = (_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool;
    if (u.key === "Enter" && m === "polyarea" && lt.length >= 3) {
      const v = sn();
      we(`\u2713 \xC1rea libre mallada \u2014 ${v} shells Q4 creados.`), u.preventDefault();
      return;
    }
    if (y === "x" || y === "y" || y === "z") zt = zt === y ? null : y, Mo(), u.preventDefault();
    else if (u.key === "Escape") {
      const v = document.activeElement;
      v && (v.tagName === "INPUT" || v.tagName === "TEXTAREA") && v.blur(), jo(), u.preventDefault();
    } else u.key === "F3" ? (u.preventDefault(), (_d = window.__hekatanToggleOsnap) == null ? void 0 : _d.call(window)) : u.key === "F10" ? (u.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : u.key === "F8" && (u.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
  }), window.__hekatanToggleOsnap = () => {
    const u = !(window.__hekatanOsnapOn ?? true);
    window.__hekatanOsnapOn = u, u || rn(), we(`\u{1F9F2} OSNAP ${u ? "ON" : "OFF"} (F3)`);
  }, window.__hekatanTogglePolar = () => {
    const u = window.__hekatanPolarTrack === false;
    window.__hekatanPolarTrack = u, u || (Zt.visible = false), we(`\u25C8 POLAR ${u ? "ON" : "OFF"} (F10)`);
  }, window.__hekatanToggleOrtho = () => {
    var _a3;
    {
      window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
      const u = window.__hekatanOrthoMode;
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      let g = document.getElementById("hk-ortho-frame");
      g || (g = document.createElement("div"), g.id = "hk-ortho-frame", g.style.cssText = ["position:fixed", "inset:0", "z-index:99996", "border:3px solid rgba(34,211,238,0.85)", "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)", "pointer-events:none"].join(";") + ";", document.body.appendChild(g)), g.style.display = u ? "block" : "none";
      let y = document.getElementById("hk-ortho-badge");
      y || (y = document.createElement("div"), y.id = "hk-ortho-badge", y.style.cssText = ["position:fixed", "top:10px", "left:50%", "transform:translateX(-50%)", "z-index:99998", "padding:6px 16px", "background:rgba(34,211,238,0.95)", "color:#0a1f24", "border-radius:6px", "border:2px solid rgba(8,145,178,1)", "box-shadow:0 4px 16px rgba(34,211,238,0.5)", "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold", "pointer-events:none", "white-space:nowrap"].join(";") + ";", y.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(y)), y.style.display = u ? "block" : "none";
    }
  };
  const Wi = new te(), Zi = new te(), $o = new te(), Qa = (u) => {
    if (!zt) return null;
    const g = u[0], y = u[1], m = u[2];
    return zt === "x" ? (Wi.set(g - 1e4, y, m), Zi.set(g + 1e4, y, m)) : zt === "y" ? (Wi.set(g, y - 1e4, m), Zi.set(g, y + 1e4, m)) : (Wi.set(g, y, m - 1e4), Zi.set(g, y, m + 1e4)), c.ray.distanceSqToSegment(Wi, Zi, null, $o), $o;
  };
  window.__hekatanProjectOnAxis = Qa;
  const Qt = new Vt(new ze().setFromPoints([new te(0, 0, 0), new te(0, 0, 0)]), new mt({ color: 16724804, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false }));
  Qt.renderOrder = 998, Qt.frustumCulled = false, Qt.visible = false, t.add(Qt);
  let ms = -1, zs = -1, Is = -1;
  const Ue = /* @__PURE__ */ new Set();
  window.__hekatanSelection = Ue;
  const ws = new Vt(new ze().setFromPoints([new te(), new te()]), new mt({ color: 16766720, transparent: true, opacity: 0.95, depthTest: false }));
  ws.renderOrder = 997, ws.frustumCulled = false, ws.visible = false, t.add(ws);
  const as = new pt(new gi(0.02, 12, 12), new gt({ color: 16766720, transparent: true, opacity: 0.9, depthTest: false }));
  as.renderOrder = 998, as.visible = false, t.add(as);
  const Ki = (u) => {
    const g = s();
    if (g.isOrthographicCamera) {
      const m = g, v = (m.top - m.bottom) / m.zoom;
      return Math.max(0.05, v * 6e-3);
    }
    const y = g.position.distanceTo(u);
    return Math.max(0.05, y / 10);
  }, Eo = () => {
    as.visible && as.scale.setScalar(Ki(as.position));
  }, ys = new ft();
  ys.frustumCulled = false, t.add(ys);
  const Gi = 2282478;
  let xs = null;
  const el = (u, g, y, m) => {
    if (!r.points) return -1;
    const v = r.points.rawVal;
    let E = -1, k = m;
    for (let M = 0; M < v.length; M++) {
      const $ = v[M];
      if (!$) continue;
      const I = Math.hypot(u - $[0], g - $[1], y - $[2]);
      I < k && (k = I, E = M);
    }
    return E;
  }, ls = () => {
    var _a3, _b, _c2, _d, _e2, _f, _g, _h;
    for (; ys.children.length; ) {
      const k = ys.children.pop();
      (_b = (_a3 = k.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c2 = k.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }
    const u = ((_e2 = r.points) == null ? void 0 : _e2.rawVal) ?? [], g = ((_f = r.polylines) == null ? void 0 : _f.rawVal) ?? [], m = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
    for (const k of Ue) {
      const [M, ...$] = k.split(":");
      if (M === "pt") {
        const I = u[+$[0]];
        if (!I) continue;
        const T = new pt(new gi(0.025, 12, 12), new gt({ color: Gi, transparent: true, opacity: 0.9, depthTest: false }));
        T.position.set(I[0], I[1], I[2]), T.renderOrder = 999, T.__isSelectionPt = true, ys.add(T);
      } else if (M === "seg") {
        const I = g[+$[0]], T = u[I == null ? void 0 : I[+$[1]]], N = u[I == null ? void 0 : I[+$[1] + 1]];
        if (!T || !N) continue;
        const F = new ze().setFromPoints([new te(T[0], T[1], T[2]), new te(N[0], N[1], N[2])]), L = new Vt(F, new mt({ color: Gi, transparent: true, opacity: 0.95, depthTest: false }));
        L.renderOrder = 999, ys.add(L);
      } else if (M === "poly") {
        const T = g[+$[0]].map((L) => {
          const Y = u[L];
          return Y ? new te(Y[0], Y[1], Y[2]) : null;
        }).filter(Boolean);
        if (T.length < 2) continue;
        const N = new ze().setFromPoints(T), F = new Vt(N, new mt({ color: Gi, transparent: true, opacity: 0.95, depthTest: false }));
        F.renderOrder = 999, ys.add(F);
      } else if (M === "aux") {
        const I = m[+$[0]];
        if (!I || I.length !== 6) continue;
        const T = new ze().setFromPoints([new te(I[0], I[1], I[2]), new te(I[3], I[4], I[5])]), N = new Vt(T, new mt({ color: Gi, transparent: true, opacity: 0.95, depthTest: false }));
        N.renderOrder = 999, ys.add(N);
      }
    }
    const v = window.__hekatanUpdateSelectionPtScale;
    v && v();
    const E = window.__hekatanRefreshPropsPane;
    E && E();
    try {
      (_h = window.__hekatanUpdateSelectionPtScale) == null ? void 0 : _h.call(window);
    } catch {
    }
    l();
  };
  window.__hekatanRefreshSelection = ls, window.__hekatanSelectIds = (u) => {
    var _a3;
    Ue.clear();
    for (const g of u) Ue.add(g);
    try {
      (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return l(), Ue.size;
  }, window.__hekatanClearSelection = () => {
    Ue.clear(), ls();
  };
  const ki = (u, g, y, m, v, E, k, M, $) => {
    const I = k - m, T = M - v, N = $ - E, F = I * I + T * T + N * N;
    if (F < 1e-12) return Math.hypot(u - m, g - v, y - E);
    let L = ((u - m) * I + (g - v) * T + (y - E) * N) / F;
    L = Math.max(0, Math.min(1, L));
    const Y = m + L * I, j = v + L * T, O = E + L * N;
    return Math.hypot(u - Y, g - j, y - O);
  }, Pn = (u, g, y, m) => {
    if (!r.polylines) return null;
    const v = r.polylines.rawVal, E = r.points.rawVal;
    let k = -1, M = -1, $ = m;
    for (let I = 0; I < v.length; I++) {
      const T = v[I];
      for (let N = 0; N < T.length - 1; N++) {
        const F = E[T[N]], L = E[T[N + 1]];
        if (!F || !L) continue;
        const Y = ki(u, g, y, F[0], F[1], F[2], L[0], L[1], L[2]);
        Y < $ && ($ = Y, k = I, M = N);
      }
    }
    return k >= 0 ? { polyIdx: k, segIdx: M, dist: $ } : null;
  }, Ao = (u, g, y, m) => {
    const v = window.__hekatanDrawingAuxLines, E = (v == null ? void 0 : v.rawVal) ?? (v == null ? void 0 : v.val) ?? v ?? [];
    let k = -1, M = m;
    for (let $ = 0; $ < E.length; $++) {
      const I = E[$];
      if (!I || I.length !== 6) continue;
      const T = ki(u, g, y, I[0], I[1], I[2], I[3], I[4], I[5]);
      T < M && (M = T, k = $);
    }
    return k;
  }, tl = (u) => {
    const g = window.__hekatanDrawingAuxLines, m = ((g == null ? void 0 : g.rawVal) ?? (g == null ? void 0 : g.val) ?? g ?? [])[u];
    if (!m || m.length !== 6) {
      Qt.visible = false;
      return;
    }
    Qt.geometry.setFromPoints([new te(m[0], m[1], m[2]), new te(m[3], m[4], m[5])]), Qt.visible = true;
  }, sl = (u, g = -1) => {
    var _a3, _b;
    if (!r.polylines) return;
    const y = r.polylines.rawVal[u], m = r.points.rawVal;
    if (!y || y.length < 2) {
      Qt.visible = false;
      return;
    }
    const v = ((_b = (_a3 = r.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(u)) ?? false, E = [];
    if (v || g < 0 || g >= y.length - 1) for (const k of y) {
      const M = m[k];
      M && E.push(new te(M[0], M[1], M[2]));
    }
    else {
      const k = m[y[g]], M = m[y[g + 1]];
      k && E.push(new te(k[0], k[1], k[2])), M && E.push(new te(M[0], M[1], M[2]));
    }
    Qt.geometry.setFromPoints(E), Qt.visible = true;
  }, Ji = (u) => {
    var _a3;
    if (!r.polylines) return;
    const g = r.polylines.rawVal;
    if (u < 0 || u >= g.length) return;
    const y = g.filter(($, I) => I !== u), m = /* @__PURE__ */ new Set();
    for (const $ of y) for (const I of $) m.add(I);
    const v = r.points.rawVal, E = /* @__PURE__ */ new Map(), k = [];
    for (let $ = 0; $ < v.length; $++) m.has($) && (E.set($, k.length), k.push(v[$]));
    const M = y.map(($) => $.map((I) => E.get(I)).filter((I) => I !== void 0));
    r.points.val = k, r.polylines.val = M, r.areas && (r.areas.val = r.areas.rawVal.filter(($) => $ !== u).map(($) => $ > u ? $ - 1 : $)), Qt.visible = false, ms = -1, zs = -1;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
  }, To = (u, g) => {
    var _a3, _b, _c2;
    if (!r.polylines) return;
    const y = r.polylines.rawVal;
    if (u < 0 || u >= y.length) return;
    if (((_b = (_a3 = r.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(u)) ?? false) {
      Ji(u);
      return;
    }
    const v = y[u];
    if (g < 0 || g >= v.length - 1) return;
    if (v.length === 2) {
      Ji(u);
      return;
    }
    let E;
    g === 0 ? E = [v.slice(1)] : g === v.length - 2 ? E = [v.slice(0, -1)] : E = [v.slice(0, g + 1), v.slice(g + 1)];
    const k = [...y.slice(0, u), ...E, ...y.slice(u + 1)], M = /* @__PURE__ */ new Set();
    for (const F of k) for (const L of F) M.add(L);
    const $ = r.points.rawVal, I = /* @__PURE__ */ new Map(), T = [];
    for (let F = 0; F < $.length; F++) M.has(F) && (I.set(F, T.length), T.push($[F]));
    const N = k.map((F) => F.map((L) => I.get(L)).filter((L) => L !== void 0));
    if (r.points.val = T, r.polylines.val = N, r.areas) {
      const F = E.length - 1;
      r.areas.val = r.areas.rawVal.map((L) => L > u ? L + F : L);
    }
    Qt.visible = false, ms = -1, zs = -1;
    try {
      (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
    } catch {
    }
  };
  Ie.geometry.setAttribute("position", new Mt(r.points.rawVal.flat(), 3)), Ie.geometry.computeBoundingSphere(), Ie.frustumCulled = false, Ne.frustumCulled = false, t.add(Ne), f.position.set(0, 0, 0), f.rotateX(Math.PI / 2), f.geometry.rotateX(Math.PI / 2), f.updateMatrixWorld(), r.polylines && (r.polylines.val = [...r.polylines.rawVal, []]), window.__hekatanDrawAt = (u, g, y) => {
    if (r.points.val = [...r.points.rawVal, [u, g, y]], r.polylines) {
      const m = r.polylines.rawVal, v = m.length ? m[m.length - 1] : [];
      r.polylines.val = [...m.slice(0, -1), [...v, r.points.rawVal.length - 1]];
    }
  }, window.__hekatanDrawNewPoly = () => {
    var _a3;
    if (!r.polylines) return;
    const u = r.polylines.rawVal;
    ((_a3 = u[u.length - 1]) == null ? void 0 : _a3.length) !== 0 && (r.polylines.val = [...u, []]);
  };
  const Qi = [];
  window.__hekatanCirculos = Qi;
  let zo = [], Io = "";
  const Fo = () => {
    var _a3;
    const u = r.points.rawVal, g = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], y = `${u.length}|${g.length}|${g.reduce((v, E) => v + E.length, 0)}`;
    if (y === Io) return zo;
    Io = y;
    const m = [];
    for (const v of g) {
      const E = v.length;
      if (E < 6 || v[0] !== v[E - 1]) continue;
      const k = v.slice(0, E - 1).map((T) => u[T]).filter(Boolean);
      if (k.length < 5) continue;
      const M = [0, 1, 2].map((T) => k.reduce((N, F) => N + F[T], 0) / k.length), $ = k.map((T) => Math.hypot(T[0] - M[0], T[1] - M[1], T[2] - M[2])), I = $.reduce((T, N) => T + N, 0) / $.length;
      I < 1e-9 || $.some((T) => Math.abs(T - I) > 5e-3 * I) || m.push({ c: M, r: I });
    }
    return zo = m;
  };
  window.__hekatanCentrosDeducidos = Fo;
  const en = () => !!window.__hekatanCurvasAux, tn = (u, g) => {
    const y = window.__hekatanDrawingAuxLines;
    if (!y) return 0;
    Et();
    const m = y.rawVal ?? y.val ?? [], v = [];
    for (let E = 0; E + 1 < u.length; E++) v.push([...u[E], ...u[E + 1]]);
    return g && u.length > 2 && v.push([...u[u.length - 1], ...u[0]]), y.val = [...m, ...v], v.length;
  };
  window.__hekatanDrawCircle = (u, g, y, m, v = window.__hekatanArcSegs ?? 12, E = "xy") => {
    var _a3;
    const k = Math.max(4, Math.round(v)), M = r.points.rawVal.length, $ = [];
    for (let I = 0; I < k; I++) {
      const T = 2 * Math.PI * I / k, N = m * Math.cos(T), F = m * Math.sin(T);
      let L;
      E === "xy" ? L = [u + N, g + F, y] : E === "xz" ? L = [u + N, g, y + F] : L = [u, g + N, y + F], $.push(L);
    }
    if (Qi.push({ c: [u, g, y], r: m }), en()) {
      tn($, true);
      return;
    }
    if (r.points.val = [...r.points.rawVal, ...$], r.polylines) {
      const I = [...$.map((N, F) => M + F), M], T = r.polylines.rawVal;
      ((_a3 = T[T.length - 1]) == null ? void 0 : _a3.length) > 0 ? r.polylines.val = [...T, I, []] : r.polylines.val = [...T.slice(0, -1), I, []];
    }
  }, window.__hekatanDrawArc = (u, g, y, m = window.__hekatanArcSegs ?? 12) => {
    var _a3;
    const v = Math.max(4, Math.round(m)), E = new te(...u), k = new te(...g), M = new te(...y), $ = new te().subVectors(k, E), I = new te().subVectors(M, E), T = new te().crossVectors($, I), N = 2 * T.lengthSq();
    let F;
    if (N < 1e-12) F = new te().addVectors(E, M).multiplyScalar(0.5);
    else {
      const ke = I.clone().multiplyScalar($.lengthSq()).sub($.clone().multiplyScalar(I.lengthSq())), Ae = new te().crossVectors(ke, T);
      F = E.clone().add(Ae.divideScalar(N));
    }
    const L = E.distanceTo(F), Y = T.lengthSq() > 1e-12 ? T.clone().normalize() : new te(0, 1, 0), j = new te().subVectors(E, F).normalize(), O = new te().crossVectors(Y, j).normalize(), z = (ke) => {
      const Ae = new te().subVectors(ke, F);
      return Math.atan2(Ae.dot(O), Ae.dot(j));
    }, V = (ke) => {
      let Ae = ke;
      for (; Ae < 0; ) Ae += 2 * Math.PI;
      for (; Ae >= 2 * Math.PI; ) Ae -= 2 * Math.PI;
      return Ae;
    }, H = V(z(k)), ee = V(z(M)), Z = H <= ee ? ee : ee - 2 * Math.PI, J = r.points.rawVal.length, se = [], oe = (ke) => {
      const Ae = j.clone().multiplyScalar(Math.cos(ke)).add(O.clone().multiplyScalar(Math.sin(ke)));
      return F.clone().add(Ae.multiplyScalar(L));
    }, ie = String(window.__hekatanArcModo ?? "angulo"), de = ie === "x" ? 0 : ie === "y" ? 1 : ie === "z" ? 2 : -1;
    let me = false;
    if (de >= 0) {
      const ke = u[de], Ae = y[de], nt = 512;
      let je = Math.abs(Ae - ke) > 1e-9, et = ke;
      for (let De = 1; De <= nt && je; De++) {
        const Je = oe(Z * De / nt).getComponent(de);
        (Je - et) * (Ae - ke) < -1e-9 && (je = false), et = Je;
      }
      if (je) {
        me = true;
        for (let De = 0; De <= v; De++) {
          const Je = ke + (Ae - ke) * De / v;
          let Be = 0, Pe = Z;
          for (let We = 0; We < 60; We++) {
            const xt = (Be + Pe) / 2;
            (oe(xt).getComponent(de) - Je) * (Ae - ke) < 0 ? Be = xt : Pe = xt;
          }
          const Xe = oe((Be + Pe) / 2);
          se.push([Xe.x, Xe.y, Xe.z]);
        }
        se[0] = [u[0], u[1], u[2]], se[v] = [y[0], y[1], y[2]];
      } else try {
        (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${ie.toUpperCase()}: reparto por \xE1ngulo.`);
      } catch {
      }
    }
    if (!me) for (let ke = 0; ke <= v; ke++) {
      const Ae = oe(Z * (ke / v));
      se.push([Ae.x, Ae.y, Ae.z]);
    }
    if (Qi.push({ c: [F.x, F.y, F.z], r: L }), en()) {
      tn(se, false);
      return;
    }
    if (r.points.val = [...r.points.rawVal, ...se], r.polylines) {
      const ke = se.map((nt, je) => J + je), Ae = r.polylines.rawVal;
      r.polylines.val = [...Ae.slice(0, -1), ke, []];
    }
  }, window.__hekatanDrawPolinomio = (u, g = window.__hekatanArcSegs ?? 12) => {
    var _a3, _b, _c2, _d;
    const y = u.length;
    if (y < 2) return { ok: false, msg: "faltan puntos" };
    const m = Math.max(y - 1, Math.round(g)), v = (Z) => Math.max(...u.map((J) => J[Z])) - Math.min(...u.map((J) => J[Z])), E = [v(0), v(1), v(2)], k = String(((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.workPlane) ?? ""), M = k === "xy" ? 2 : k === "xz" ? 1 : k === "yz" ? 0 : -1, $ = M >= 0 && E[M] < 1e-6 ? M : E[2] <= E[0] && E[2] <= E[1] ? 2 : E[1] <= E[0] ? 1 : 0, I = $ === 2 ? "xy" : $ === 1 ? "xz" : "yz", T = [0, 1, 2].filter((Z) => Z !== $), [N, F] = E[T[0]] >= E[T[1]] ? T : [T[1], T[0]], L = u.map((Z) => Z[N]), Y = u.map((Z) => Z[F]);
    for (let Z = 0; Z < y; Z++) for (let J = Z + 1; J < y; J++) if (Math.abs(L[Z] - L[J]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[N]} en ${I.toUpperCase()}): no hay polinomio que pase por los dos` };
    const j = (Z) => {
      let J = 0;
      for (let se = 0; se < y; se++) {
        let oe = 1;
        for (let ie = 0; ie < y; ie++) ie !== se && (oe *= (Z - L[ie]) / (L[se] - L[ie]));
        J += Y[se] * oe;
      }
      return J;
    }, O = (() => {
      const Z = y, J = L.map((ie) => Array.from({ length: Z }, (de, me) => ie ** me)), se = Y.slice();
      for (let ie = 0; ie < Z; ie++) {
        let de = ie;
        for (let me = ie + 1; me < Z; me++) Math.abs(J[me][ie]) > Math.abs(J[de][ie]) && (de = me);
        [J[ie], J[de]] = [J[de], J[ie]], [se[ie], se[de]] = [se[de], se[ie]];
        for (let me = ie + 1; me < Z; me++) {
          const ke = J[me][ie] / J[ie][ie];
          for (let Ae = ie; Ae < Z; Ae++) J[me][Ae] -= ke * J[ie][Ae];
          se[me] -= ke * se[ie];
        }
      }
      const oe = new Array(Z).fill(0);
      for (let ie = Z - 1; ie >= 0; ie--) {
        let de = se[ie];
        for (let me = ie + 1; me < Z; me++) de -= J[ie][me] * oe[me];
        oe[ie] = de / J[ie][ie];
      }
      return oe;
    })(), z = L[0], V = L[y - 1], H = r.points.rawVal.length, ee = [];
    for (let Z = 0; Z <= m; Z++) {
      const J = z + (V - z) * Z / m, se = [u[0][0], u[0][1], u[0][2]];
      se[N] = J, se[F] = j(J), se[$] = u[0][$], ee.push(se);
    }
    if (ee[0] = [u[0][0], u[0][1], u[0][2]], ee[m] = [u[y - 1][0], u[y - 1][1], u[y - 1][2]], en()) return tn(ee, false), { ok: true, plano: I, coef: O, ia: N, io: F };
    if (r.points.val = [...r.points.rawVal, ...ee], r.polylines) {
      const Z = ee.map((se, oe) => H + oe), J = r.polylines.rawVal;
      r.polylines.val = ((_d = J[J.length - 1]) == null ? void 0 : _d.length) > 0 ? [...J, Z, []] : [...J.slice(0, -1), Z, []];
    }
    return { ok: true, plano: I, coef: O, ia: N, io: F };
  };
  const Po = () => {
    var _a3, _b;
    const u = r.points.rawVal, g = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], y = new Set(((_b = r.areas) == null ? void 0 : _b.rawVal) ?? []), m = window.__hekatanDrawingAuxLines, v = (m == null ? void 0 : m.rawVal) ?? (m == null ? void 0 : m.val) ?? [], E = [], k = [], M = /* @__PURE__ */ new Set(), $ = (I) => [u[I][0], u[I][1], u[I][2]];
    return [...Ue].forEach((I) => {
      const T = I.split(":");
      if (T[0] === "aux") {
        const F = v[+T[1]];
        F && F.length === 6 && (E.push([[F[0], F[1], F[2]], [F[3], F[4], F[5]]]), k.push(I));
        return;
      }
      const N = T[0] === "poly" || T[0] === "seg" ? +T[1] : -1;
      if (!(N < 0 || !g[N] || y.has(N))) if (T[0] === "poly") {
        if (M.has(N)) return;
        M.add(N);
        for (let F = 0; F + 1 < g[N].length; F++) E.push([$(g[N][F]), $(g[N][F + 1])]);
      } else {
        const F = g[N][+T[2]], L = g[N][+T[2] + 1];
        F != null && L != null && !M.has(N) && E.push([$(F), $(L)]);
      }
    }), { segs: E, auxIds: k };
  }, Ci = (u, g) => Math.abs(u[0] - g[0]) < 1e-6 && Math.abs(u[1] - g[1]) < 1e-6 && Math.abs(u[2] - g[2]) < 1e-6, il = (u) => {
    const g = new Array(u.length).fill(false), y = [];
    for (let m = 0; m < u.length; m++) {
      if (g[m]) continue;
      g[m] = true;
      const v = [u[m][0], u[m][1]];
      let E = true;
      for (; E; ) {
        E = false;
        for (let M = 0; M < u.length; M++) {
          if (g[M]) continue;
          const [$, I] = u[M], T = v[v.length - 1], N = v[0];
          Ci($, T) ? (v.push(I), g[M] = true, E = true) : Ci(I, T) ? (v.push($), g[M] = true, E = true) : Ci(I, N) ? (v.unshift($), g[M] = true, E = true) : Ci($, N) && (v.unshift(I), g[M] = true, E = true);
        }
      }
      const k = v.length > 3 && Ci(v[0], v[v.length - 1]);
      k && v.pop(), y.push({ pts: v, cerrada: k });
    }
    return y;
  }, Rn = (u, g) => {
    let y = u.findIndex((m) => Math.abs(m[0] - g[0]) < 1e-3 && Math.abs(m[1] - g[1]) < 1e-3 && Math.abs(m[2] - g[2]) < 1e-3);
    return y < 0 && (y = u.length, u.push(g)), y;
  }, Ro = (u) => {
    if (!u.length) return 0;
    Ue.clear(), u.forEach((y) => Ue.add(y));
    const g = u.length;
    return Bn(), Ue.clear(), g;
  };
  window.__hekatanRevolveSelection = (u, g, y, m = 360) => {
    var _a3, _b, _c2;
    const v = Math.max(3, Math.round(y || 16)), E = Math.abs(m - 360) < 1e-9, k = v, M = E ? v : v + 1, { segs: $, auxIds: I } = Po();
    if (!$.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)" };
    if (E && v % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    Et();
    const T = r.points.rawVal, N = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], F = [...T];
    let L = N.slice();
    L.length && L[L.length - 1].length === 0 && (L = L.slice(0, -1));
    const Y = [...((_b = r.areas) == null ? void 0 : _b.rawVal) ?? []], j = /* @__PURE__ */ new Map(), O = (se) => se.map((oe) => Math.round(oe * 1e4)).join(","), z = (se) => Math.hypot(se[0] - u, se[1] - g) < 1e-6, V = (se) => {
      const oe = O(se);
      let ie = j.get(oe);
      if (ie) return ie;
      if (z(se)) return ie = [Rn(F, se)], j.set(oe, ie), ie;
      const de = Math.hypot(se[0] - u, se[1] - g), me = Math.atan2(se[1] - g, se[0] - u);
      ie = [];
      for (let ke = 0; ke < M; ke++) {
        const Ae = me + m * Math.PI / 180 * ke / v;
        ie.push(Rn(F, ke === 0 ? se : [u + de * Math.cos(Ae), g + de * Math.sin(Ae), se[2]]));
      }
      return j.set(oe, ie), ie;
    };
    let H = 0, ee = false;
    const Z = (se) => {
      Y.push(L.length), L.push([...se, se[0]]), H++;
    };
    for (const [se, oe] of $) {
      const ie = V(se), de = V(oe);
      if (!(ie.length === 1 && de.length === 1)) {
        if (ie.length === 1 || de.length === 1) {
          ee = true;
          const me = ie.length === 1 ? ie[0] : de[0], ke = ie.length === 1 ? de : ie;
          for (let Ae = 0; Ae + 2 <= k; Ae += 2) Z([me, ke[Ae % M], ke[(Ae + 1) % M], ke[(Ae + 2) % M]]);
          continue;
        }
        for (let me = 0; me < k; me++) Z([ie[me], de[me], de[(me + 1) % M], ie[(me + 1) % M]]);
      }
    }
    L.push([]), r.points.val = F, r.polylines && (r.polylines.val = L), r.areas && (r.areas.val = Y);
    const J = Ro(I);
    try {
      (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
    } catch {
    }
    return l(), { anillos: j.size, areas: H, polo: ee, guias: J };
  }, window.__hekatanLoftSelection = (u, g) => {
    var _a3, _b, _c2;
    const { segs: y, auxIds: m } = Po(), v = il(y), E = (de) => de.pts.every((me) => Math.abs(me[2] - de.pts[0][2]) < 1e-6), k = v.find((de) => de.cerrada && E(de)), M = v.find((de) => !de.cerrada && de.pts.length >= 2 && !E(de));
    if (!k) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n" };
    if (!M) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n" };
    const $ = k.pts, I = $.length, T = M.pts.slice();
    T[T.length - 1][2] < T[0][2] && T.reverse();
    let N = 0;
    for (let de = 0; de < I; de++) {
      const me = $[de], ke = $[(de + 1) % I];
      N += me[0] * ke[1] - ke[0] * me[1];
    }
    const F = N > 0 ? 1 : -1, L = (de) => {
      const me = $[(de - 1 + I) % I], ke = $[de], Ae = $[(de + 1) % I], nt = [ke[0] - me[0], ke[1] - me[1]], je = [Ae[0] - ke[0], Ae[1] - ke[1]], et = Math.hypot(nt[0], nt[1]) || 1, De = Math.hypot(je[0], je[1]) || 1, Je = [F * nt[1] / et, -F * nt[0] / et], Be = [F * je[1] / De, -F * je[0] / De], Pe = 1 + (Je[0] * Be[0] + Je[1] * Be[1]);
      return [(Je[0] + Be[0]) / Math.max(Pe, 1e-6), (Je[1] + Be[1]) / Math.max(Pe, 1e-6)];
    }, Y = $.map((de, me) => L(me)), j = T[0];
    let O = [0, 0], z = 0;
    for (const de of T) {
      const me = de[0] - j[0], ke = de[1] - j[1], Ae = Math.hypot(me, ke);
      Ae > z && (z = Ae, O = [me / Ae, ke / Ae]);
    }
    if (z < 1e-9) {
      const de = j[0] - u, me = j[1] - g, ke = Math.hypot(de, me) || 1;
      O = [de / ke, me / ke];
    }
    O[0] * (j[0] - u) + O[1] * (j[1] - g) < 0 && (O = [-O[0], -O[1]]), Et();
    const V = r.points.rawVal, H = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], ee = [...V];
    let Z = H.slice();
    Z.length && Z[Z.length - 1].length === 0 && (Z = Z.slice(0, -1));
    const J = [...((_b = r.areas) == null ? void 0 : _b.rawVal) ?? []], se = T.map((de) => {
      const me = (de[0] - j[0]) * O[0] + (de[1] - j[1]) * O[1], ke = de[2];
      return $.map((Ae, nt) => Rn(ee, [Ae[0] + Y[nt][0] * me, Ae[1] + Y[nt][1] * me, ke]));
    });
    let oe = 0;
    for (let de = 0; de + 1 < se.length; de++) for (let me = 0; me < I; me++) {
      const ke = [se[de][me], se[de][(me + 1) % I], se[de + 1][(me + 1) % I], se[de + 1][me]];
      new Set(ke).size < 4 || (J.push(Z.length), Z.push([...ke, ke[0]]), oe++);
    }
    Z.push([]), r.points.val = ee, r.polylines && (r.polylines.val = Z), r.areas && (r.areas.val = J);
    const ie = Ro(m);
    try {
      (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
    } catch {
    }
    return l(), { contorno: I, perfil: T.length, areas: oe, guias: ie };
  }, window.__hekatanDrawSlabChaflan = (u, g, y = 1, m = 6, v = 6) => {
    const E = Math.min(u[0], g[0]), k = Math.max(u[0], g[0]), M = Math.min(u[1], g[1]), $ = Math.max(u[1], g[1]), I = (u[2] + g[2]) / 2, T = k - E, N = $ - M, F = Math.min(y, T / 2 - 0.01, N / 2 - 0.01);
    if (F <= 0) return;
    const L = r.points.rawVal.length, Y = [], j = [], O = (z, V) => {
      Y.push([z, V, I]), j.push(L + Y.length - 1);
    };
    for (let z = 0; z <= v; z++) O(E + F + (T - 2 * F) * z / v, M);
    for (let z = 1; z <= m; z++) {
      const V = -Math.PI / 2 + Math.PI / 2 * z / m;
      O(k - F + F * Math.cos(V), M + F + F * Math.sin(V));
    }
    for (let z = 1; z <= v; z++) O(k, M + F + (N - 2 * F) * z / v);
    for (let z = 1; z <= m; z++) {
      const V = 0 + Math.PI / 2 * z / m;
      O(k - F + F * Math.cos(V), $ - F + F * Math.sin(V));
    }
    for (let z = 1; z <= v; z++) O(k - F - (T - 2 * F) * z / v, $);
    for (let z = 1; z <= m; z++) {
      const V = Math.PI / 2 + Math.PI / 2 * z / m;
      O(E + F + F * Math.cos(V), $ - F + F * Math.sin(V));
    }
    for (let z = 1; z <= v; z++) O(E, $ - F - (N - 2 * F) * z / v);
    for (let z = 1; z < m; z++) {
      const V = Math.PI + Math.PI / 2 * z / m;
      O(E + F + F * Math.cos(V), M + F + F * Math.sin(V));
    }
    if (j.push(L), en()) {
      tn(Y, true);
      return;
    }
    if (r.points.val = [...r.points.rawVal, ...Y], r.polylines) {
      const z = r.polylines.rawVal;
      r.polylines.val = [...z.slice(0, -1), j, []];
    }
  }, window.__hekatanDrawRect = (u, g) => {
    const y = r.points.rawVal.length, m = u[0], v = u[1], E = u[2], k = g[0], M = g[1], $ = g[2];
    let I;
    if (Math.abs(E - $) < 1e-6 ? I = [[m, v, E], [k, v, E], [k, M, E], [m, M, E]] : Math.abs(v - M) < 1e-6 ? I = [[m, v, E], [k, v, E], [k, v, $], [m, v, $]] : I = [[m, v, E], [m, M, E], [m, M, $], [m, v, $]], r.points.val = [...r.points.rawVal, ...I], r.polylines) {
      const T = [y, y + 1, y + 2, y + 3, y], N = r.polylines.rawVal;
      r.polylines.val = [...N.slice(0, -1), T, []];
    }
  }, window.__hekatanDrawRectArea = (u, g) => {
    var _a3;
    const y = r.points.rawVal.length, m = u[0], v = u[1], E = u[2], k = g[0], M = g[1], $ = g[2];
    let I;
    if (_ && r.gridTarget) {
      const T = r.gridTarget.rawVal, N = new zi(...T.rotation), F = new te(1, 0, 0).applyEuler(N), L = new te(0, 1, 0).applyEuler(N), Y = new te(...T.position), j = new te(m, v, E), O = new te(k, M, $), z = j.clone().sub(Y).dot(F), V = j.clone().sub(Y).dot(L), H = O.clone().sub(Y).dot(F), ee = O.clone().sub(Y).dot(L), Z = (J, se) => Y.clone().addScaledVector(F, J).addScaledVector(L, se).toArray();
      I = [Z(z, V), Z(H, V), Z(H, ee), Z(z, ee)];
    } else Math.abs(E - $) < 1e-6 ? I = [[m, v, E], [k, v, E], [k, M, E], [m, M, E]] : Math.abs(v - M) < 1e-6 ? I = [[m, v, E], [k, v, E], [k, v, $], [m, v, $]] : I = [[m, v, E], [m, M, E], [m, M, $], [m, v, $]];
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), r.points.val = [...r.points.rawVal, ...I], r.polylines) {
      const T = r.polylines.rawVal, N = T.length - 1, F = [y, y + 1, y + 2, y + 3, y];
      r.polylines.val = [...T.slice(0, -1), F, []], r.areas && (r.areas.val = [...r.areas.rawVal, N]);
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    l();
  }, window.__hekatanFillClosedAreas = () => {
    var _a3, _b, _c2;
    const u = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], g = r.points.rawVal, y = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), v = (O) => O.map((z) => Math.round(z * 1e4) / 1e4).join(",");
    for (let O = 0; O < g.length; O++) {
      const z = v(g[O]), V = y.get(z);
      V === void 0 && y.set(z, O), m.set(O, V ?? O);
    }
    const E = u.map((O) => O.map((z) => m.get(z) ?? z)), k = /* @__PURE__ */ new Map(), M = (O, z) => {
      O !== z && ((k.get(O) ?? k.set(O, /* @__PURE__ */ new Set()).get(O)).add(z), (k.get(z) ?? k.set(z, /* @__PURE__ */ new Set()).get(z)).add(O));
    };
    for (const O of E) for (let z = 0; z + 1 < O.length; z++) M(O[z], O[z + 1]);
    const $ = (O, z) => {
      var _a4;
      return !!((_a4 = k.get(O)) == null ? void 0 : _a4.has(z));
    }, I = /* @__PURE__ */ new Set(), T = [], N = [...k.keys()];
    for (const O of N) for (const z of k.get(O)) if (!(z < O)) {
      for (const V of k.get(z)) if (V !== O) for (const H of k.get(V)) {
        if (H === O || H === z || !$(H, O) || $(O, V) || $(z, H)) continue;
        const ee = [O, z, V, H].slice().sort((Z, J) => Z - J).join("-");
        I.has(ee) || (I.add(ee), T.push([O, z, V, H]));
      }
    }
    for (const O of N) for (const z of k.get(O)) if (!(z < O)) for (const V of k.get(z)) {
      if (V === O || !$(V, O)) continue;
      const H = [O, z, V].slice().sort((ee, Z) => ee - Z).join("-");
      I.has(H) || (I.add(H), T.push([O, z, V]));
    }
    if (!T.length) return 0;
    const F = [...((_b = r.areas) == null ? void 0 : _b.rawVal) ?? []], L = new Set(F.map((O) => [...new Set(E[O] ?? [])].sort((z, V) => z - V).join("-"))), Y = [...E];
    let j = 0;
    for (const O of T) {
      const z = O.slice().sort((V, H) => V - H).join("-");
      L.has(z) || (L.add(z), Y.push([...O, O[0]]), F.push(Y.length - 1), j++);
    }
    if (j) {
      window.__hekatanPushUndo && window.__hekatanPushUndo(), r.polylines.val = Y, r.areas && (r.areas.val = F);
      try {
        (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
      } catch {
      }
      l();
    }
    return j;
  }, window.__hekatanMeshPolyArea = (u, g) => {
    var _a3;
    const y = u.length;
    if (y < 3) return 0;
    let m = 0, v = 0, E = 0;
    for (let Pe = 0; Pe < y; Pe++) {
      const Xe = u[Pe], We = u[(Pe + 1) % y];
      m += (Xe[1] - We[1]) * (Xe[2] + We[2]), v += (Xe[2] - We[2]) * (Xe[0] + We[0]), E += (Xe[0] - We[0]) * (Xe[1] + We[1]);
    }
    const k = Math.hypot(m, v, E) || 1;
    m /= k, v /= k, E /= k;
    let M = u[1][0] - u[0][0], $ = u[1][1] - u[0][1], I = u[1][2] - u[0][2];
    const T = Math.hypot(M, $, I) || 1;
    M /= T, $ /= T, I /= T;
    let N = v * I - E * $, F = E * M - m * I, L = m * $ - v * M;
    const Y = Math.hypot(N, F, L) || 1;
    N /= Y, F /= Y, L /= Y;
    const j = u[0], O = (Pe) => [(Pe[0] - j[0]) * M + (Pe[1] - j[1]) * $ + (Pe[2] - j[2]) * I, (Pe[0] - j[0]) * N + (Pe[1] - j[1]) * F + (Pe[2] - j[2]) * L], z = (Pe, Xe) => [j[0] + Pe * M + Xe * N, j[1] + Pe * $ + Xe * F, j[2] + Pe * I + Xe * L], V = u.map(O);
    let H = 1 / 0, ee = -1 / 0, Z = 1 / 0, J = -1 / 0;
    for (const [Pe, Xe] of V) Pe < H && (H = Pe), Pe > ee && (ee = Pe), Xe < Z && (Z = Xe), Xe > J && (J = Xe);
    const se = ee - H, oe = J - Z;
    if (se < 1e-6 || oe < 1e-6) return 0;
    let ie = g && g > 0 ? g : 0.5;
    for (; se / ie * (oe / ie) > 2500; ) ie *= 2;
    ie = Math.min(ie, Math.min(se, oe));
    const de = (Pe, Xe) => {
      let We = false;
      for (let xt = 0, St = V.length - 1; xt < V.length; St = xt++) {
        const [Ot, ds] = V[xt], [fi, Ks] = V[St];
        ds > Xe != Ks > Xe && Pe < (fi - Ot) * (Xe - ds) / (Ks - ds) + Ot && (We = !We);
      }
      return We;
    }, me = Math.max(1, Math.round(se / ie)), ke = Math.max(1, Math.round(oe / ie)), Ae = se / me, nt = oe / ke, je = /* @__PURE__ */ new Map(), et = [], De = r.points.rawVal.length, Je = (Pe, Xe) => {
      const We = Pe + "," + Xe, xt = je.get(We);
      if (xt !== void 0) return xt;
      const St = De + et.length;
      return et.push(z(H + Pe * Ae, Z + Xe * nt)), je.set(We, St), St;
    }, Be = [];
    for (let Pe = 0; Pe < me; Pe++) for (let Xe = 0; Xe < ke; Xe++) {
      if (!de(H + (Pe + 0.5) * Ae, Z + (Xe + 0.5) * nt)) continue;
      const We = Je(Pe, Xe), xt = Je(Pe + 1, Xe), St = Je(Pe + 1, Xe + 1), Ot = Je(Pe, Xe + 1);
      Be.push([We, xt, St, Ot]);
    }
    if (!Be.length) return 0;
    if (window.__hekatanPushUndo && window.__hekatanPushUndo(), r.points.val = [...r.points.rawVal, ...et], r.polylines && r.areas) {
      let Pe = r.polylines.rawVal.slice();
      Pe.length && Pe[Pe.length - 1].length === 0 && (Pe = Pe.slice(0, -1));
      const Xe = [];
      for (const We of Be) Xe.push(Pe.length), Pe.push([We[0], We[1], We[2], We[3], We[0]]);
      Pe.push([]), r.polylines.val = Pe, r.areas.val = [...r.areas.rawVal, ...Xe];
    }
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return l(), Be.length;
  };
  const sn = () => {
    if (lt.length < 3) return lt = [], ht.visible = false, l(), 0;
    const u = window.__hekatanMeshPolyArea(lt.slice());
    return lt = [], ht.visible = false, l(), u;
  };
  window.__hekatanFinalizePolyArea = sn, window.__hekatanSetInclinedPlaneFrom3 = (u, g, y) => {
    var _a3;
    const m = new te(u[0], u[1], u[2]), v = new te(g[0], g[1], g[2]), E = new te(y[0], y[1], y[2]), k = new te().subVectors(v, m).cross(new te().subVectors(E, m));
    if (k.lengthSq() < 1e-9) return false;
    k.normalize();
    const M = new to().setFromUnitVectors(new te(0, 0, 1), k), $ = new zi().setFromQuaternion(M);
    r.gridTarget && (r.gridTarget.val = { position: [m.x, m.y, m.z], rotation: [$.x, $.y, $.z] }), _ = true;
    const I = new te().addVectors(m, v).add(E).multiplyScalar(1 / 3), T = Math.max(m.distanceTo(v), m.distanceTo(E), v.distanceTo(E)) * 2.2 + 4, N = T / 2;
    Ht.geometry.dispose(), Ht.geometry = new Ds(T, T), Cs.geometry.dispose(), Cs.geometry = new oa(new Ds(T, T)), qi(N, 1), Lt.position.copy(I), Lt.quaternion.copy(M), Lt.scale.set(1, 1, 1), Lt.visible = true;
    try {
      (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return l(), true;
  }, window.__hekatanResetPlaneXY = () => {
    r.gridTarget && (r.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] }), _ = false, Lt.visible = false, l();
  };
  const rs = new ft();
  rs.visible = false, t.add(rs), window.__hekatanShowAxes = (u, g, y = 12, m = 2) => {
    var _a3, _b;
    for (; rs.children.length; ) {
      const T = rs.children.pop();
      (_a3 = T.geometry) == null ? void 0 : _a3.dispose(), (_b = T.material) == null ? void 0 : _b.dispose();
    }
    if (!u.length || !g.length) return;
    const v = Math.min(...g) - m, E = Math.max(...g) + m, k = Math.min(...u) - m, M = Math.max(...u) + m, $ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", I = (T, N, F, L, Y) => {
      const j = document.createElement("canvas");
      j.width = 64, j.height = 32;
      const O = j.getContext("2d");
      O.fillStyle = Y, O.font = "bold 22px sans-serif", O.textAlign = "center", O.fillText(T, 32, 26);
      const z = new aa(j), V = new la({ map: z, transparent: true }), H = new ra(V);
      return H.position.set(N, F, L), H.scale.set(1.2, 0.6, 1), H;
    };
    u.forEach((T, N) => {
      const F = N < $.length ? $[N] : `X${N}`, L = new ze().setFromPoints([new te(T, v, 0), new te(T, E, 0), new te(T, v, 0), new te(T, v, y)]), Y = new Ti({ color: 6333946, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), j = new is(L, Y);
      j.computeLineDistances(), rs.add(j), rs.add(I(F, T, v - 0.5, 0, "#60a5fa")), rs.add(I(F, T, E + 0.5, 0, "#60a5fa"));
    }), g.forEach((T, N) => {
      const F = `${N + 1}`, L = new ze().setFromPoints([new te(k, T, 0), new te(M, T, 0), new te(k, T, 0), new te(k, T, y)]), Y = new Ti({ color: 16478597, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 }), j = new is(L, Y);
      j.computeLineDistances(), rs.add(j), rs.add(I(F, k - 0.5, T, 0, "#fb7185")), rs.add(I(F, M + 0.5, T, 0, "#fb7185"));
    }), rs.visible = true, l();
  }, window.__hekatanHideAxes = () => {
    rs.visible = false, l();
  };
  const Es = new ft();
  Es.visible = false, t.add(Es);
  let ri = [];
  window.__hekatanShowRefPlanes = (u = [0, 3, 6, 9, 12], g = 20, y = 0, m = 0) => {
    var _a3, _b;
    for (; Es.children.length; ) {
      const E = Es.children.pop();
      (_a3 = E.geometry) == null ? void 0 : _a3.dispose(), (_b = E.material) == null ? void 0 : _b.dispose();
    }
    ri.forEach((E) => {
      t.remove(E), E.geometry.dispose(), E.material.dispose();
    }), ri = [];
    const v = [6333946, 3462041, 16498468, 16478597, 12616956, 2282478];
    u.forEach((E, k) => {
      const M = v[k % v.length], $ = g / 2, I = [new te(y - $, m - $, E), new te(y + $, m - $, E), new te(y + $, m + $, E), new te(y - $, m + $, E), new te(y - $, m - $, E)], T = new ze().setFromPoints(I), N = new mt({ color: M, transparent: true, opacity: 0.55 });
      Es.add(new Vt(T, N));
      const F = document.createElement("canvas");
      F.width = 128, F.height = 32;
      const L = F.getContext("2d");
      L.fillStyle = `#${M.toString(16).padStart(6, "0")}`, L.font = "bold 18px sans-serif", L.fillText(`Z = ${E} m`, 4, 22);
      const Y = new aa(F), j = new la({ map: Y, transparent: true }), O = new ra(j);
      O.position.set(y - $ - 1.5, m - $ - 1.5, E), O.scale.set(2.5, 0.6, 1), Es.add(O);
      const z = new Ds(1e4, 1e4), V = new gt({ visible: false, side: Pt }), H = new pt(z, V);
      H.position.set(0, 0, E), H.frustumCulled = false, H.userData = { refPlaneZ: E }, t.add(H), ri.push(H);
    }), Es.visible = true, l();
  }, window.__hekatanHideRefPlanes = () => {
    Es.visible = false, ri.forEach((u) => {
      u.visible = false;
    }), l();
  };
  const Si = new ft();
  Si.frustumCulled = false, t.add(Si);
  const nl = () => {
    var _a3, _b, _c2, _d;
    for (; Si.children.length; ) {
      const y = Si.children.pop();
      (_b = (_a3 = y.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c2 = y.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }
    const u = window.__hekatanDrawingAuxLines, g = (u == null ? void 0 : u.rawVal) ?? (u == null ? void 0 : u.val) ?? u ?? [];
    for (const y of g) {
      if (y.length !== 6) continue;
      const m = new ze().setFromPoints([new te(y[0], y[1], y[2]), new te(y[3], y[4], y[5])]), v = new Ti({ color: 2282478, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.8 }), E = new Vt(m, v);
      E.computeLineDistances(), Si.add(E);
    }
  };
  xe.derive(() => {
    const u = window.__hekatanDrawingAuxLines;
    (u == null ? void 0 : u.val) && (u.val, nl(), l());
  });
  const ci = new ft();
  ci.frustumCulled = false, t.add(ci);
  const Do = () => {
    var _a3, _b, _c2, _d;
    for (; ci.children.length; ) {
      const y = ci.children.pop();
      (_b = (_a3 = y.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c2 = y.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }
    const u = window.__hekatanDrawingAuxPoints, g = (u == null ? void 0 : u.rawVal) ?? (u == null ? void 0 : u.val) ?? u ?? [];
    for (const y of g) {
      if (!y || y.length !== 3) continue;
      const m = new pt(new gi(0.025, 12, 12), new gt({ color: 2282478, transparent: true, opacity: 0.85, depthTest: false }));
      m.position.set(y[0], y[1], y[2]), m.renderOrder = 996, m.scale.setScalar(Ki(m.position)), ci.add(m);
    }
  };
  xe.derive(() => {
    const u = window.__hekatanDrawingAuxPoints;
    (u == null ? void 0 : u.val) !== void 0 && (u.val, Do(), l());
  }), i.addEventListener("change", () => {
    ci.children.forEach((u) => {
      u.scale.setScalar(Ki(u.position));
    });
  }), window.__hekatanRenderAuxPoints = Do;
  const vt = new ft(), ol = new pt(new gi(0.01, 12, 12), new gt({ color: 16777215, transparent: true, opacity: 0.95 })), Lo = new pt(new gi(0.015, 12, 12), new gt({ color: 16498468, transparent: true, opacity: 0.2, depthWrite: false }));
  Lo.visible = false, vt.add(ol, Lo);
  const di = 0.08, Dn = (u, g, y) => {
    const m = new ze().setFromPoints([new te(...u), new te(...g)]);
    return new Vt(m, new mt({ color: y, transparent: true, opacity: 0.7 }));
  };
  vt.add(Dn([-di, 0, 0], [di, 0, 0], 16777215)), vt.add(Dn([0, -di, 0], [0, di, 0], 16777215)), vt.add(Dn([0, 0, -di], [0, 0, di], 16777215)), vt.visible = false, vt.frustumCulled = false, t.add(vt);
  let Ln = 2;
  const nn = (u) => {
    const g = s(), y = (a == null ? void 0 : a.clientHeight) || 700;
    return g.isOrthographicCamera ? (g.top - g.bottom) / (g.zoom || 1) / y : 2 * g.position.distanceTo(u) * Math.tan((g.fov || 50) * Math.PI / 180 / 2) / y;
  }, Mi = () => {
    if (!vt.visible) return;
    const u = Ln * nn(vt.position) / 0.015;
    vt.scale.setScalar(Math.max(1e-4, Math.min(1e5, u)));
  };
  let Fs = 10;
  const Nn = (u) => Math.max(1e-4, Fs * nn(u));
  window.__hekatanAperturaPx = (u) => (typeof u == "number" && u > 0 && (Fs = u), Fs), window.__hekatanUpdateSnapScale = Mi, window.__hekatanSnapMarker = vt, window.__hekatanMetrosPorPixel = nn, window.__hekatanSnapPx = (u) => (typeof u == "number" && u > 0 && (Ln = u, Mi(), l()), Ln);
  const No = () => {
    ys.children.length !== 0 && ys.children.forEach((u) => {
      if (!u.__isSelectionPt) return;
      const g = u;
      g.scale.setScalar(Ki(g.position) * 1.8);
    });
  };
  window.__hekatanUpdateSelectionPtScale = No, i.addEventListener("change", () => {
    var _a3;
    Mi(), as.visible && Eo(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), No();
  }), window.__hekatanShowSnap = (u, g, y) => {
    vt.position.set(u, g, y), vt.visible = true, Mi(), l();
  }, window.__hekatanHideSnap = () => {
    vt.visible = false, l();
  }, a.addEventListener("pointermove", (u) => {
    var _a3, _b, _c2, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r2, _s2, _t2, _u, _v, _w, _x;
    window.__hekatanCursorPx = { x: u.clientX, y: u.clientY };
    const g = p(u);
    if (!g) return;
    c.setFromCamera(h, g), A = null;
    const y = Me();
    if ((!y.length || ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) !== "fillarea") && _t.visible && (_t.visible = false), y.length) {
      const m = y[0].point;
      if (((_f = (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.get) == null ? void 0 : _e2.call(_d)) == null ? void 0 : _f.tool) === "fillarea") {
        const L = ks([m.x, m.y, m.z]);
        if (L) {
          const Y = L.map((z) => r.points.rawVal[z]), j = [];
          for (let z = 1; z < Y.length - 1; z++) j.push(Y[0][0], Y[0][1], Y[0][2], Y[z][0], Y[z][1], Y[z][2], Y[z + 1][0], Y[z + 1][1], Y[z + 1][2]);
          const O = _t.geometry;
          O.setAttribute("position", new Mt(j, 3)), O.computeVertexNormals(), _t.visible = true;
        } else _t.visible = false;
      } else _t.visible && (_t.visible = false);
      const v = u.altKey;
      let E = false;
      const k = Nn(m), M = v ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, m.x, m.y, m.z, k, { x: u.clientX, y: u.clientY });
      if (M) ln(M.type, M.x, M.y, M.z), vt.position.set(M.x, M.y, M.z), vt.visible = true, m.set(M.x, M.y, M.z), cn(M.type, u.clientX, u.clientY);
      else if (!v && (Te = Le(u.clientX, u.clientY))) E = true, m.copy(Te), ln("ifcSec", m.x, m.y, m.z), cn("ifcSec", u.clientX, u.clientY), vt.position.copy(m), vt.visible = true;
      else if (S && !v) E = true, ln(S.tipo, m.x, m.y, m.z), cn(S.tipo, u.clientX, u.clientY), vt.position.copy(m), vt.visible = true;
      else {
        cl(), rn();
        const F = !v && window.__hekatanSnapEnabled !== false, L = window.__hekatanSnap2D ?? 0.5;
        F && L > 0 && (m.x = Math.round(m.x / L) * L, m.y = Math.round(m.y / L) * L, m.z = Math.round(m.z / L) * L), vt.position.copy(m), vt.visible = true;
      }
      Mi(), U(A && !M && (E || S) ? W(A) : null), Xt = { p: m.clone(), x: u.clientX, y: u.clientY };
      const $ = ((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.tool) ?? "select";
      if ($ === "select" || !$) {
        const F = (window.__hekatanSnap2D ?? 0.5) * 1.5, L = el(m.x, m.y, m.z, F), Y = Pn(m.x, m.y, m.z, F), j = Ao(m.x, m.y, m.z, F);
        if (L >= 0) {
          const H = r.points.rawVal[L];
          as.position.set(H[0], H[1], H[2]), as.visible = true, Eo(), ws.visible = false, xs = { kind: "pt", a: L };
        } else if (Y) {
          const H = r.points.rawVal, ee = r.polylines.rawVal[Y.polyIdx], Z = H[ee[Y.segIdx]], J = H[ee[Y.segIdx + 1]];
          ws.geometry.setFromPoints([new te(Z[0], Z[1], Z[2]), new te(J[0], J[1], J[2])]), ws.visible = true, as.visible = false, xs = ((_l = (_k = r.areas) == null ? void 0 : _k.rawVal) == null ? void 0 : _l.includes(Y.polyIdx)) ?? false ? { kind: "poly", a: Y.polyIdx } : { kind: "seg", a: Y.polyIdx, b: Y.segIdx };
        } else if (j >= 0) {
          const ee = (((_m = window.__hekatanDrawingAuxLines) == null ? void 0 : _m.rawVal) ?? [])[j];
          ee && (ws.geometry.setFromPoints([new te(ee[0], ee[1], ee[2]), new te(ee[3], ee[4], ee[5])]), ws.visible = true, as.visible = false, xs = { kind: "aux", a: j });
        } else ws.visible = false, as.visible = false, xs = null;
        Fe.style.left = u.clientX + "px", Fe.style.top = u.clientY + "px", Fe.style.display = "block";
        let O = m;
        if ((xs == null ? void 0 : xs.kind) === "pt") {
          const H = r.points.rawVal[xs.a];
          H && (O = new te(H[0], H[1], H[2]));
        }
        const z = `X=${O.x.toFixed(2)} Y=${O.y.toFixed(2)} Z=${O.z.toFixed(2)}`;
        if (window.__hekatanCursorXYZ = [O.x, O.y, O.z], xs) {
          const H = { pt: "nodo", seg: "segmento", poly: "\xE1rea", aux: "l\xEDnea aux" };
          Fe.textContent = `${z}  \xB7  \u{1F5B1} Click \u2192 ${H[xs.kind]}`;
        } else Fe.textContent = z;
        const V = document.getElementById("hk-coord-fixed");
        V && (V.textContent = z), Xt = { p: O.clone(), x: u.clientX, y: u.clientY }, Re.visible = false, Zt.visible = false, Kt.visible = false, l();
        return;
      }
      if ($ === "delete" || $ === "trim" || $ === "extend" || $ === "offset") {
        const F = (window.__hekatanSnap2D ?? 0.5) * 1.5, L = Pn(m.x, m.y, m.z, F), Y = Ao(m.x, m.y, m.z, F);
        let j = false;
        if (Y >= 0) if (!L) j = true;
        else {
          const H = window.__hekatanDrawingAuxLines, Z = ((H == null ? void 0 : H.rawVal) ?? (H == null ? void 0 : H.val) ?? H ?? [])[Y];
          ki(m.x, m.y, m.z, Z[0], Z[1], Z[2], Z[3], Z[4], Z[5]) < L.dist && (j = true);
        }
        j ? (Is = Y, ms = -1, zs = -1, tl(Y)) : L ? (ms = L.polyIdx, zs = L.segIdx, Is = -1, sl(L.polyIdx, L.segIdx)) : (ms = -1, zs = -1, Is = -1, Qt.visible = false), Re.visible = false, Zt.visible = false, Kt.visible = false, ot(), Fe.style.left = u.clientX + "px", Fe.style.top = u.clientY + "px", Fe.style.display = "block";
        const O = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`;
        let z = "";
        j ? z = `\u{1F5D1} l\xEDnea aux #${Is + 1}` : L ? z = ((_o2 = (_n2 = r.areas) == null ? void 0 : _n2.rawVal) == null ? void 0 : _o2.includes(L.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${L.polyIdx + 1}` : `\u{1F5D1} seg ${L.segIdx + 1} / poly #${L.polyIdx + 1}` : z = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Fe.textContent = `${O}  \xB7  ${z}`;
        const V = document.getElementById("hk-coord-fixed");
        V && (V.textContent = O), l();
        return;
      } else Qt.visible = false, ms = -1, Is = -1;
      Fe.style.left = u.clientX + "px", Fe.style.top = u.clientY + "px", Fe.style.display = "block";
      const I = ((_p = r.polylines) == null ? void 0 : _p.rawVal) ?? [], T = I[I.length - 1] ?? [], N = r.points.rawVal ?? [];
      if (T.length > 0 && N[T[T.length - 1]]) {
        const F = T[T.length - 1], L = N[F];
        let Y = zt;
        ji = null;
        const j = !!M || E;
        if (!Y && !j && window.__hekatanAxisSnap !== false) {
          const je = a.getBoundingClientRect(), et = u.clientX, De = u.clientY, Je = ((_q = settings.gridSize) == null ? void 0 : _q.rawVal) ?? 10, Be = new te(L[0], L[1], L[2]), Pe = [["x", new te(1, 0, 0)], ["y", new te(0, 1, 0)], ["z", new te(0, 0, 1)]], Xe = (xt) => {
            const St = xt.clone().project(g);
            return { x: (St.x * 0.5 + 0.5) * je.width + je.left, y: (-St.y * 0.5 + 0.5) * je.height + je.top };
          };
          let We = null;
          for (const [xt, St] of Pe) {
            const Ot = Xe(Be.clone().addScaledVector(St, -Je)), ds = Xe(Be.clone().addScaledVector(St, Je)), fi = ds.x - Ot.x, Ks = ds.y - Ot.y, xl = et - Ot.x, bl = De - Ot.y, vl = fi * fi + Ks * Ks || 1;
            let un = (xl * fi + bl * Ks) / vl;
            un = Math.max(0, Math.min(1, un));
            const Jo = Math.hypot(et - (Ot.x + un * fi), De - (Ot.y + un * Ks));
            if (We === null || Jo < We.dpx) {
              const Kn = c.ray, Qo = Be.clone().sub(Kn.origin), Gn = St.dot(Kn.direction), ea = St.dot(Qo), _l2 = Kn.direction.dot(Qo), ta = 1 - Gn * Gn, kl = Math.abs(ta) < 1e-6 ? -ea : (Gn * _l2 - ea) / ta;
              We = { axis: xt, dpx: Jo, pt: Be.clone().addScaledVector(St, kl) };
            }
          }
          We && We.dpx <= 12 && (m.copy(We.pt), Y = We.axis, ji = We.pt.clone());
        }
        const O = !!window.__hekatanOrthoMode;
        if (!Y && !j && O) {
          const je = Math.abs(m.x - L[0]), et = Math.abs(m.y - L[1]), De = Math.abs(m.z - L[2]), Je = (_r2 = y[0]) == null ? void 0 : _r2.object;
          let Be = null;
          Je === os ? Be = "xy" : Je === ps ? Be = "xz" : Je === fs && (Be = "yz"), Be === "xy" ? Y = je >= et ? "x" : "y" : Be === "xz" ? Y = je >= De ? "x" : "z" : Be === "yz" ? Y = et >= De ? "y" : "z" : Y = je >= et && je >= De ? "x" : et >= De ? "y" : "z";
        }
        const z = window.__hekatanPolarTrack !== false;
        if (!Y && !j && z) {
          const je = m.x - L[0], et = m.y - L[1], De = m.z - L[2], Je = Math.hypot(je, et, De);
          if (Je > 1e-3) {
            const Pe = Math.tan(6 * Math.PI / 180) * Je, Xe = Math.hypot(et, De), We = Math.hypot(je, De), xt = Math.hypot(je, et), St = [["x", Xe], ["y", We], ["z", xt]];
            St.sort((Ot, ds) => Ot[1] - ds[1]), St[0][1] <= Pe && (Y = St[0][0]);
          }
        }
        if (Y) {
          const je = L[0], et = L[1], De = L[2];
          Y === "x" ? m.set(m.x, et, De) : Y === "y" ? m.set(je, m.y, De) : m.set(je, et, m.z);
          const Je = !!zt, Pe = { x: "#ff3344", y: "#34d399", z: "#60a5fa" }[Y];
          Yt.style.background = "rgba(15,23,42,0.92)", Yt.style.color = Pe, Yt.style.border = `1.5px solid ${Pe}`;
          const Xe = (_s2 = y[0]) == null ? void 0 : _s2.object;
          let We = null;
          Xe === os ? We = "xy" : Xe === ps ? We = "xz" : Xe === fs && (We = "yz");
          const xt = We ? ` (plano ${We.toUpperCase()})` : "";
          Yt.textContent = Je ? `\u{1F512} LOCK ${Y.toUpperCase()}${xt}` : `\u22A5 ORTO ${Y.toUpperCase()}${xt}`, Yt.style.left = u.clientX + 20 + "px", Yt.style.top = u.clientY + 18 + "px", Yt.style.transform = "none", Yt.style.display = "block";
        } else zt || (Yt.style.display = "none");
        let V = null;
        if (!v && !j && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
          const je = r.points.rawVal, et = Y ? [Y] : ["z", "x", "y"], De = { x: u.clientX, y: u.clientY };
          let Je = 1 / 0;
          for (const Be of je) if (!(Math.abs(Be[0] - L[0]) < 1e-9 && Math.abs(Be[1] - L[1]) < 1e-9 && Math.abs(Be[2] - L[2]) < 1e-9)) for (const Pe of et) {
            const Xe = new te(Pe === "x" ? Be[0] : m.x, Pe === "y" ? Be[1] : m.y, Pe === "z" ? Be[2] : m.z), We = Ws(Xe.x, Xe.y, Xe.z);
            if (!We) continue;
            const xt = Math.hypot(We.x - De.x, We.y - De.y);
            xt < Fs && xt < Je && (Je = xt, V = { q: Be, eje: Pe });
          }
        }
        V ? (V.eje === "x" ? m.x = V.q[0] : V.eje === "y" ? m.y = V.q[1] : m.z = V.q[2], Kt.geometry.setFromPoints([new te(V.q[0], V.q[1], V.q[2]), new te(m.x, m.y, m.z)]), (_t2 = Kt.computeLineDistances) == null ? void 0 : _t2.call(Kt), Kt.visible = true, vt.position.set(m.x, m.y, m.z), vt.visible = true, cn("track", u.clientX, u.clientY)) : Kt.visible = false, Xt = { p: m.clone(), x: u.clientX, y: u.clientY };
        const H = Math.hypot(m.x - L[0], m.y - L[1], m.z - L[2]), ee = Math.atan2(m.y - L[1], m.x - L[0]) * 180 / Math.PI, Z = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`, J = (ee % 360 + 360) % 360;
        Fe.textContent = `L = ${H.toFixed(3)} m   \u2220 ${J.toFixed(1)}\xB0   \xB7   ${Z}`;
        const se = document.getElementById("hk-coord-fixed");
        se && (se.textContent = Z), Re.geometry.setFromPoints([new te(L[0], L[1], L[2]), new te(m.x, m.y, m.z)]), (_u = Re.computeLineDistances) == null ? void 0 : _u.call(Re), Re.visible = true, Rt(L[0], L[1], L[2], m.x, m.y, m.z);
        const oe = window.__hekatanOrthoExt ?? 8, ie = window.__hekatanShowOrthoPlanes !== false;
        us.visible = ie, ie || So(null), ie && ($s(Us, L, "xy", oe), $s(oi, L, "xz", oe), $s(ai, L, "yz", oe), Ms(os, L, "xy", oe), Ms(ps, L, "xz", oe), Ms(fs, L, "yz", oe));
        const de = ie ? c.intersectObjects([os, ps, fs], false) : [];
        let me = null;
        if (de.length > 0) {
          const je = de[0].object;
          je === os ? me = "xy" : je === ps ? me = "xz" : je === fs && (me = "yz");
        }
        So(me), me && (gs.style.left = u.clientX + "px", gs.style.top = u.clientY + "px"), Hs.geometry.setFromPoints([new te(L[0] - oe, L[1], L[2]), new te(L[0] + oe, L[1], L[2])]), (_v = Hs.computeLineDistances) == null ? void 0 : _v.call(Hs), Xs.geometry.setFromPoints([new te(L[0], L[1] - oe, L[2]), new te(L[0], L[1] + oe, L[2])]), (_w = Xs.computeLineDistances) == null ? void 0 : _w.call(Xs), Ys.geometry.setFromPoints([new te(L[0], L[1], L[2] - oe), new te(L[0], L[1], L[2] + oe)]), (_x = Ys.computeLineDistances) == null ? void 0 : _x.call(Ys), Zt.visible = true;
        const ke = Hs.material, Ae = Xs.material, nt = Ys.material;
        Hs.visible = Y === "x", Xs.visible = Y === "y", Ys.visible = Y === "z", ke.opacity = 0.95, Ae.opacity = 0.95, nt.opacity = 0.95;
      } else {
        const F = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`;
        Fe.textContent = F;
        const L = document.getElementById("hk-coord-fixed");
        if (L && (L.textContent = F), Re.visible = false, Zt.visible = false, (/* @__PURE__ */ new Set(["line", "polyline", "area", "node", "column", "wall", "rect", "circle", "arc", "polyline-multi", "axis", "chaflan"])).has($)) {
          if (Ye = null, Ze = null, Ee.style.left = u.clientX + 20 + "px", Ee.style.top = u.clientY - 28 + "px", Ee.style.display = "block", !$e) {
            Ee.value = `${m.x.toFixed(2)},${m.y.toFixed(2)},${m.z.toFixed(2)}`;
            const j = document.activeElement;
            !(j && (j.tagName === "INPUT" || j.tagName === "TEXTAREA") && j !== Ee) && document.activeElement !== Ee && Ee.focus({ preventScroll: true });
            try {
              Ee.select();
            } catch {
            }
          }
        } else ot();
      }
      l();
    } else rn(), Fe.style.display = "none", vt.visible = false, Re.visible = false, Zt.visible = false, ot(), l();
  }), xe.derive(() => {
    var _a3;
    if (!r.gridTarget) return;
    const u = new to().setFromEuler(new zi(...r.gridTarget.val.rotation)), g = new to().setFromAxisAngle(new te(1, 0, 0), Math.PI / 2);
    gr(e, { position: new te(...r.gridTarget.val.position), quaternion: u.clone().multiply(g) }, l);
    {
      const m = r.gridTarget.val.position[2], v = Math.abs(u.x - Math.sin(Math.PI / 4)) < 1e-3;
      for (const E of vi) t.remove(E), Fn(E);
      if (vi.length = 0, v) {
        const E = ((_a3 = r.points) == null ? void 0 : _a3.rawVal) ?? [], k = /* @__PURE__ */ new Set([0]);
        for (const $ of E) k.add(+$[2].toFixed(3));
        for (const $ of window.__hekatanLevels ?? []) isFinite($ == null ? void 0 : $.z) && k.add(+$.z.toFixed(3));
        const M = [...k].sort(($, I) => $ - I).slice(0, 24);
        for (const $ of M) {
          if (Math.abs($ - m) < 1e-6) continue;
          const I = e.clone(true);
          I.name = `hekatan-grid-nivel-${$}`, I.traverse((T) => {
            T.material && (T.material = T.material.clone(), T.material.transparent = true, T.material.opacity = (T.material.opacity ?? 1) * (Math.abs($) < 1e-6 ? 0.5 : 0.22));
          }), I.position.set(0, 0, $), I.quaternion.copy(g), t.add(I), vi.push(I);
        }
      }
    }
    f.position.set(...r.gridTarget.val.position), f.quaternion.setFromEuler(new zi(...r.gridTarget.val.rotation)), f.updateMatrixWorld();
    const y = new te(0, 0, 1).applyEuler(new zi(...r.gridTarget.val.rotation));
    _ = !(Math.abs(y.x) > 0.999 || Math.abs(y.y) > 0.999 || Math.abs(y.z) > 0.999);
  }), xe.derive(() => {
    Ie.geometry.setAttribute("position", new Mt(r.points.val.flat(), 3)), Ie.geometry.computeBoundingSphere();
  }), xe.derive(() => {
    const u = 0.05 * n * 0.5 * o.val;
    c.params.Points.threshold = 0.4 * u;
  }), xe.derive(() => {
    var _a3;
    const u = r.points.val ?? [], y = (((_a3 = r.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], m = [];
    for (const E of y) {
      const [k, M, $] = u[E];
      m.push(k, M, $);
    }
    const v = new ze();
    v.setAttribute("position", new Mt(m, 3)), Ge.geometry.dispose(), Ge.geometry = v;
  });
  let On = false, qs = 0;
  a.addEventListener("pointerdown", () => {
    On = true;
  }), a.addEventListener("pointerup", () => {
    On = false;
  }), a.addEventListener("pointermove", () => {
    On && qs++;
  });
  const Gt = document.createElement("div");
  Gt.id = "hk-window-select", Gt.style.cssText = ["position:fixed", "pointer-events:none", "z-index:99996", "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)"].join(";") + ";", document.body.appendChild(Gt);
  let cs = null, $i = false, ts = null;
  const Vn = (u, g, y, m, v) => {
    v ? (Gt.style.borderColor = "#34d399", Gt.style.borderStyle = "dashed", Gt.style.background = "rgba(52, 211, 153, 0.10)") : (Gt.style.borderColor = "#22d3ee", Gt.style.borderStyle = "solid", Gt.style.background = "rgba(34, 211, 238, 0.10)"), Gt.style.left = Math.min(u, y) + "px", Gt.style.top = Math.min(g, m) + "px", Gt.style.width = Math.abs(y - u) + "px", Gt.style.height = Math.abs(m - g) + "px", Gt.style.display = "block";
  }, Oo = (u, g, y, m, v) => {
    var _a3, _b, _c2, _d;
    const E = Math.min(u, y), k = Math.max(u, y), M = Math.min(g, m), $ = Math.max(g, m), I = y < u, T = a.getBoundingClientRect(), N = s();
    N.updateMatrixWorld();
    const F = (J) => {
      const se = new te(J[0], J[1], J[2]);
      return se.project(N), { x: T.left + (se.x * 0.5 + 0.5) * T.width, y: T.top + (-se.y * 0.5 + 0.5) * T.height };
    }, L = (J) => J.x >= E && J.x <= k && J.y >= M && J.y <= $, Y = (J, se) => !(J.x < E && se.x < E || J.x > k && se.x > k || J.y < M && se.y < M || J.y > $ && se.y > $);
    v || Ue.clear();
    let j = 0;
    const O = ((_a3 = r.points) == null ? void 0 : _a3.rawVal) ?? [];
    for (let J = 0; J < O.length; J++) {
      const se = O[J];
      se && L(F(se)) && (Ue.add(`pt:${J}`), j++);
    }
    const z = (J, se) => I ? L(J) || L(se) || Y(J, se) : L(J) && L(se), V = ((_b = r.polylines) == null ? void 0 : _b.rawVal) ?? [], H = ((_c2 = r.areas) == null ? void 0 : _c2.rawVal) ?? [];
    for (let J = 0; J < V.length; J++) {
      const se = V[J];
      if (H.includes(J)) {
        let ie;
        if (!I) ie = se.every((de) => {
          const me = O[de];
          return !!me && L(F(me));
        });
        else {
          ie = false;
          for (let de = 0; de < se.length - 1; de++) {
            const me = O[se[de]], ke = O[se[de + 1]];
            if (!(!me || !ke) && z(F(me), F(ke))) {
              ie = true;
              break;
            }
          }
        }
        ie && (Ue.add(`poly:${J}`), j++);
      } else for (let ie = 0; ie < se.length - 1; ie++) {
        const de = O[se[ie]], me = O[se[ie + 1]];
        !de || !me || z(F(de), F(me)) && (Ue.add(`seg:${J}:${ie}`), j++);
      }
    }
    const Z = ((_d = window.__hekatanDrawingAuxLines) == null ? void 0 : _d.rawVal) ?? [];
    for (let J = 0; J < Z.length; J++) {
      const se = Z[J];
      if (!se || se.length !== 6) continue;
      const oe = F([se[0], se[1], se[2]]), ie = F([se[3], se[4], se[5]]);
      z(oe, ie) && (Ue.add(`aux:${J}`), j++);
    }
    ls(), we(j === 0 && !I ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${I ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${j} item(s) ${v ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ue.size})`), Gt.style.display = "none";
  }, on = () => {
    ts && (ts = null, Gt.style.display = "none", we("Selecci\xF3n cancelada"));
  };
  window.__hekatanCancelClickClickRect = on, window.addEventListener("keydown", (u) => {
    u.key === "Escape" && ts && on();
  });
  const Bn = () => {
    var _a3, _b, _c2, _d;
    if (Ue.size === 0) return false;
    const u = [...Ue], g = ((_a3 = r.points) == null ? void 0 : _a3.rawVal) ?? [], y = ((_b = r.polylines) == null ? void 0 : _b.rawVal) ?? [], m = ((_c2 = r.areas) == null ? void 0 : _c2.rawVal) ?? [], v = window.__hekatanDrawingAuxLines, E = (v == null ? void 0 : v.rawVal) ?? [], k = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Set();
    for (const Y of u) {
      const [j, ...O] = Y.split(":");
      if (j === "pt") k.add(+O[0]);
      else if (j === "poly") M.add(+O[0]);
      else if (j === "seg") {
        const z = +O[0], V = +O[1];
        $.has(z) || $.set(z, /* @__PURE__ */ new Set()), $.get(z).add(V);
      } else j === "aux" && I.add(+O[0]);
    }
    let T = 0, N = [], F = [];
    const L = /* @__PURE__ */ new Map();
    for (let Y = 0; Y < y.length; Y++) {
      if (M.has(Y)) {
        T++;
        continue;
      }
      L.set(Y, N.length);
      const j = $.get(Y);
      if (j && j.size > 0) {
        let O = [];
        for (let z = 0; z < y[Y].length; z++) O.push(y[Y][z]), z < y[Y].length - 1 && j.has(z) && (O.length >= 2 && N.push(O), O = [], T++);
        (O.length >= 2 || O.length === 1) && N.push(O);
      } else N.push([...y[Y]]);
    }
    if (k.size > 0) {
      const Y = [], j = /* @__PURE__ */ new Map();
      for (let z = 0; z < g.length; z++) {
        if (k.has(z)) {
          T++;
          continue;
        }
        j.set(z, Y.length), Y.push([...g[z]]);
      }
      const O = [];
      for (const z of N) {
        let V = [];
        for (const H of z) {
          const ee = j.get(H);
          ee === void 0 ? (V.length >= 2 && O.push(V), V = []) : V.push(ee);
        }
        V.length >= 2 && O.push(V);
      }
      N = O, r.points.val = Y;
    }
    for (const Y of m) {
      const j = L.get(Y);
      j !== void 0 && j < N.length && F.push(j);
    }
    if (r.polylines && (r.polylines.val = N), r.areas && (r.areas.val = F), I.size > 0 && v) {
      const Y = E.filter((j, O) => !I.has(O));
      "val" in v ? v.val = Y : window.__hekatanDrawingAuxLines = Y, T += I.size;
    }
    Ue.clear(), ls();
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return we(`\u{1F5D1} ${T} item(s) borrado(s)`), true;
  };
  window.__hekatanDeleteSelected = Bn, window.addEventListener("keydown", (u) => {
    if (u.key !== "Delete" && u.key !== "Backspace") return;
    const g = document.activeElement, y = g && (g.id === "hk3-cmd-input" || g.id === "hk-dyn-input") && g.value === "";
    g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA" || g.isContentEditable) && !y || Ue.size !== 0 && (u.preventDefault(), Bn());
  });
  const es = document.createElement("div");
  es.id = "hk-properties-pane";
  const Vo = "hk-props-pane-pos";
  let Ei = null;
  try {
    const u = localStorage.getItem(Vo);
    u && (Ei = JSON.parse(u));
  } catch {
  }
  es.style.cssText = ["position:fixed", Ei ? `left:${Ei.left}px` : "left:14px", Ei ? `top:${Ei.top}px` : "top:200px", "transform:none", "width:min(300px, calc(100vw - 32px))", "max-height:calc(100vh - 260px)", "overflow-y:auto", "z-index:201", "box-shadow:0 6px 24px rgba(0,0,0,0.45)", "border-radius:6px", "display:none"].join(";") + ";", document.body.appendChild(es);
  const al = () => {
    const u = es.querySelector(".tp-rotv_b");
    if (!u || u.__hkDragWired) return;
    u.__hkDragWired = true, u.style.cursor = "move", u.style.userSelect = "none";
    let g = false, y = 0, m = 0, v = 0, E = 0;
    u.addEventListener("mousedown", (k) => {
      g = true, y = k.clientX, m = k.clientY;
      const M = es.getBoundingClientRect();
      v = M.left, E = M.top, es.style.transform = "none", es.style.left = `${v}px`, es.style.top = `${E}px`, k.preventDefault();
    }), window.addEventListener("mousemove", (k) => {
      if (!g) return;
      const M = k.clientX - y, $ = k.clientY - m, I = Math.max(0, Math.min(window.innerWidth - 80, v + M)), T = Math.max(0, Math.min(window.innerHeight - 40, E + $));
      es.style.left = `${I}px`, es.style.top = `${T}px`;
    }), window.addEventListener("mouseup", () => {
      if (g) {
        g = false;
        try {
          localStorage.setItem(Vo, JSON.stringify({ left: parseFloat(es.style.left), top: parseFloat(es.style.top) }));
        } catch {
        }
      }
    });
  }, fe = { Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false, Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0, Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0, mass: 0, diaphragm: "Ninguno", section: "W14x84", material_frame: "A572 Gr 50", A_mod: 1, Iz_mod: 1, Iy_mod: 1, J_mod: 1, insertionPoint: "10 \u2014 Centroid", beta: 0, relMxI: false, relMyI: false, relMzI: false, relMxJ: false, relMyJ: false, relMzJ: false, hinges: "None", LKx: 0, LKy: 0, LKz: 0, qx: 0, qy: 0, qz: 0, massPerM: 0, shellType: "Mindlin (FSDT)", thickness: 0.2, material_shell: "Concreto C25", surfLoad: 0 }, kt = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let yt = null;
  const Nt = (u, g, y, m) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: u, ids: g, prop: y, value: m } }));
  }, ll = () => {
    var _a3, _b;
    if (yt && (yt.dispose(), yt = null), Ue.size === 0) {
      es.style.display = "none";
      return;
    }
    const u = [...Ue], g = u.filter((N) => N.startsWith("pt:"));
    if (g.length === 1) {
      const N = +g[0].slice(3), L = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(N);
      L ? [fe.Ux, fe.Uy, fe.Uz, fe.Rx, fe.Ry, fe.Rz] = L.map(Boolean) : fe.Ux = fe.Uy = fe.Uz = fe.Rx = fe.Ry = fe.Rz = false;
      const j = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(N);
      j ? [fe.Fx, fe.Fy, fe.Fz, fe.Mx, fe.My, fe.Mz] = j : fe.Fx = fe.Fy = fe.Fz = fe.Mx = fe.My = fe.Mz = 0;
    }
    const y = u.filter((N) => N.startsWith("seg:")), m = u.filter((N) => N.startsWith("poly:")), v = u.filter((N) => N.startsWith("aux:")), E = g.length > 0, k = y.length > 0, M = m.length > 0, $ = !E && !k && !M, I = [];
    g.length && I.push(`\u{1F535} ${g.length} nodo(s)`), y.length && I.push(`\u{1F4CF} ${y.length} segmento(s)`), m.length && I.push(`\u25AD ${m.length} \xE1rea(s)`), v.length && I.push(`\u250A ${v.length} aux`);
    const T = `\u{1F3AF} ${Ue.size} item(s) \u2014 ${I.join(", ")}`;
    yt = new Da({ container: es, title: T });
    {
      const N = yt.addFolder({ title: "\u270F\uFE0F Editar \u2014 Replicar / Mover", expanded: false });
      N.addBinding(kt, "dx", { label: "\u0394x (m)", step: 0.1 }), N.addBinding(kt, "dy", { label: "\u0394y (m)", step: 0.1 }), N.addBinding(kt, "dz", { label: "\u0394z (m)", step: 0.1 }), N.addBinding(kt, "copias", { label: "Copias", min: 1, max: 50, step: 1 }), N.addButton({ title: "\u29C9 Replicar selecci\xF3n" }).on("click", () => {
        var _a4;
        const j = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, kt.dx, kt.dy, kt.dz, kt.copias);
        we(j ? `\u29C9 Replicado \xD7${j} (\u0394 ${kt.dx},${kt.dy},${kt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
      }), N.addButton({ title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea" }).on("click", () => {
        var _a4;
        const j = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, kt.dx, kt.dy, kt.dz, kt.copias);
        we(j && (j.lineas || j.areas) ? `\u21D7 Extruido: ${j.lineas} barra(s), ${j.areas} pa\xF1o(s) (\u0394 ${kt.dx},${kt.dy},${kt.dz} m \xD7 ${kt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
      });
      const F = { vuelo: 1.5, losa: true, borde: true, ambos: true }, L = N.addFolder({ title: "\u2310 Volado sobre la viga designada", expanded: false });
      L.addBinding(F, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 }), L.addBinding(F, "losa", { label: "con pa\xF1o de losa (si no, hueca)" }), L.addBinding(F, "borde", { label: "con viga de borde" }), L.addBinding(F, "ambos", { label: "a los dos lados" }), L.addButton({ title: "\u2310 Poner volado (VOL)" }).on("click", () => {
        var _a4;
        const j = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, F.vuelo, { losa: F.losa, vigaBorde: F.borde, lados: F.ambos ? "ambos" : "afuera" });
        we(j ? `\u2310 Volado de ${F.vuelo} m en ${j} pa\xF1o(s)` + (F.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
      }), N.addButton({ title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)" }).on("click", () => {
        var _a4;
        const j = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, kt.dx, kt.dy, kt.dz, 1);
        we(j ? `\u2192 Copia desplazada \u0394 ${kt.dx},${kt.dy},${kt.dz} m` : "\u26A0 Nada seleccionado");
      });
      const Y = N.addFolder({ title: "\u{1F9F2} Snap", expanded: false });
      Y.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => {
        var _a4;
        return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
      }), Y.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), we(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }
    if (E) {
      const N = yt.addFolder({ title: `\u{1F4CC} Restraints (DOFs) \u2014 ${g.length} nodo(s)` });
      N.addBinding(fe, "Ux"), N.addBinding(fe, "Uy"), N.addBinding(fe, "Uz"), N.addBinding(fe, "Rx"), N.addBinding(fe, "Ry"), N.addBinding(fe, "Rz");
      const F = (z, V) => {
        [fe.Ux, fe.Uy, fe.Uz, fe.Rx, fe.Ry, fe.Rz] = z;
        try {
          yt.refresh();
        } catch {
        }
        Nt("nodes", g, "supports", z), we(`\u2713 ${V}: ${g.length} nudo(s) apoyado(s) (${z.map((H, ee) => H ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][ee] : "").filter(Boolean).join(" ")}).`);
      };
      N.addButton({ title: `\u25B2 Empotrar los ${g.length} nudo(s) (6 GDL)` }).on("click", () => F([true, true, true, true, true, true], "Empotrado")), N.addButton({ title: `\u25B3 Articular los ${g.length} nudo(s) (Ux Uy Uz)` }).on("click", () => F([true, true, true, false, false, false], "Articulado"));
      const L = yt.addFolder({ title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)", expanded: false });
      L.addBinding(fe, "Kx", { label: "Kx", min: 0, step: 100 }), L.addBinding(fe, "Ky", { label: "Ky", min: 0, step: 100 }), L.addBinding(fe, "Kz", { label: "Kz", min: 0, step: 100 }), L.addBinding(fe, "Krx", { label: "Krx", min: 0, step: 1e3 }), L.addBinding(fe, "Kry", { label: "Kry", min: 0, step: 1e3 }), L.addBinding(fe, "Krz", { label: "Krz", min: 0, step: 1e3 });
      const Y = yt.addFolder({ title: "\u2B07 Joint Loads (kN, kN\xB7m)" });
      Y.addBinding(fe, "Fx", { step: 0.1 }), Y.addBinding(fe, "Fy", { step: 0.1 }), Y.addBinding(fe, "Fz", { step: 0.1 }), Y.addBinding(fe, "Mx", { step: 0.1 }), Y.addBinding(fe, "My", { step: 0.1 }), Y.addBinding(fe, "Mz", { step: 0.1 }), yt.addFolder({ title: "\u2696 Additional Mass (kg)", expanded: false }).addBinding(fe, "mass", { label: "m", min: 0, step: 1 }), yt.addFolder({ title: "\u{1F517} Diaphragm (rigid link)", expanded: false }).addBinding(fe, "diaphragm", { label: "Diafragma", options: { Ninguno: "Ninguno", "D1 (rigid)": "D1 (rigid)", "D2 (rigid)": "D2 (rigid)", "D3 (rigid)": "D3 (rigid)" } }), yt.addButton({ title: `\u2713 Aplicar a ${g.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let z = 0;
        const V = [fe.Ux, fe.Uy, fe.Uz, fe.Rx, fe.Ry, fe.Rz];
        V.some((Z) => Z) && (Nt("nodes", g, "supports", V), z++);
        const H = [fe.Fx, fe.Fy, fe.Fz, fe.Mx, fe.My, fe.Mz];
        H.some((Z) => Z !== 0) && (Nt("nodes", g, "loads", H), z++);
        const ee = [fe.Kx, fe.Ky, fe.Kz, fe.Krx, fe.Kry, fe.Krz];
        if (ee.some((Z) => Z !== 0) && (Nt("nodes", g, "springs", ee), z++), fe.mass !== 0 && (Nt("nodes", g, "mass", fe.mass), z++), fe.diaphragm !== "Ninguno" && (Nt("nodes", g, "diaphragm", fe.diaphragm), z++), z === 0) {
          we("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
          let Z = document.getElementById("hk-prop-toast");
          Z || (Z = document.createElement("div"), Z.id = "hk-prop-toast", Z.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(Z)), Z.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", Z.style.background = "rgba(217,119,6,0.97)", Z.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
            Z && (Z.style.opacity = "0");
          }, 3200);
        } else we(`\u2713 Propiedades aplicadas a ${g.length} nodo(s)`);
      });
    }
    if (k) {
      const N = yt.addFolder({ title: `\u{1F4CF} Secci\xF3n frame \u2014 ${y.length} seg(s)` });
      N.addBinding(fe, "section", { label: "Secci\xF3n", options: { W14x84: "W14x84", W18x86: "W18x86", W24x146: "W24x146", HEB300: "HEB300", IPN300: "IPN300", IPE400: "IPE400", "Custom...": "Custom..." } }), N.addBinding(fe, "material_frame", { label: "Material", options: { "A572 Gr 50": "A572 Gr 50", A36: "A36", A992: "A992", "Concreto C25": "Concreto C25" } });
      const F = yt.addFolder({ title: "\u{1F527} Property Modifiers", expanded: false });
      F.addBinding(fe, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 }), F.addBinding(fe, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 }), F.addBinding(fe, "Iy_mod", { label: "Iy mod (d\xE9bil)", min: 0, max: 10, step: 0.1 }), F.addBinding(fe, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 }), yt.addFolder({ title: "\u{1F3AF} Insertion Point", expanded: false }).addBinding(fe, "insertionPoint", { label: "Cardinal", options: { "1 \u2014 Bottom Left": "1 \u2014 Bottom Left", "2 \u2014 Bottom Center": "2 \u2014 Bottom Center", "3 \u2014 Bottom Right": "3 \u2014 Bottom Right", "4 \u2014 Middle Left": "4 \u2014 Middle Left", "5 \u2014 Middle Center": "5 \u2014 Middle Center", "6 \u2014 Middle Right": "6 \u2014 Middle Right", "7 \u2014 Top Left": "7 \u2014 Top Left", "8 \u2014 Top Center": "8 \u2014 Top Center", "9 \u2014 Top Right": "9 \u2014 Top Right", "10 \u2014 Centroid": "10 \u2014 Centroid", "11 \u2014 Shear Center": "11 \u2014 Shear Center" } }), yt.addFolder({ title: "\u{1F9ED} Local Axes", expanded: false }).addBinding(fe, "beta", { label: "\u03B2 (\xB0)", min: -180, max: 180, step: 5 });
      const j = yt.addFolder({ title: "\u{1F513} Releases extremo I", expanded: false });
      j.addBinding(fe, "relMxI", { label: "Mx I" }), j.addBinding(fe, "relMyI", { label: "My I" }), j.addBinding(fe, "relMzI", { label: "Mz I" });
      const O = yt.addFolder({ title: "\u{1F513} Releases extremo J", expanded: false });
      O.addBinding(fe, "relMxJ", { label: "Mx J" }), O.addBinding(fe, "relMyJ", { label: "My J" }), O.addBinding(fe, "relMzJ", { label: "Mz J" }), yt.addFolder({ title: "\u{1FA79} Hinges (plastic)", expanded: false }).addBinding(fe, "hinges", { label: "Tipo", options: { None: "None", "Auto-FEMA M3": "Auto-FEMA M3", "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3", "Auto-Concrete M3": "Auto-Concrete M3", "Auto-Steel M3": "Auto-Steel M3", "Custom...": "Custom..." } });
      const V = yt.addFolder({ title: "\u{1F300} Line Springs (kN/m por m)", expanded: false });
      V.addBinding(fe, "LKx", { label: "LKx", min: 0, step: 100 }), V.addBinding(fe, "LKy", { label: "LKy", min: 0, step: 100 }), V.addBinding(fe, "LKz", { label: "LKz", min: 0, step: 100 });
      const H = yt.addFolder({ title: "\u2B07 Frame Loads (kN/m)" });
      H.addBinding(fe, "qx", { step: 0.1 }), H.addBinding(fe, "qy", { step: 0.1 }), H.addBinding(fe, "qz", { step: 0.1 }), yt.addFolder({ title: "\u2696 Additional Mass (kg/m)", expanded: false }).addBinding(fe, "massPerM", { label: "m/L", min: 0, step: 1 }), yt.addButton({ title: "\u2713 Aplicar a segmentos seleccionados" }).on("click", () => {
        Nt("segs", y, "section", fe.section), Nt("segs", y, "material", fe.material_frame);
        const Z = { A: fe.A_mod, Iz: fe.Iz_mod, Iy: fe.Iy_mod, J: fe.J_mod };
        (Z.A !== 1 || Z.Iz !== 1 || Z.Iy !== 1 || Z.J !== 1) && Nt("segs", y, "modifiers", Z), fe.insertionPoint !== "10 \u2014 Centroid" && Nt("segs", y, "insertionPoint", fe.insertionPoint), fe.beta !== 0 && Nt("segs", y, "beta", fe.beta);
        const J = [fe.relMxI, fe.relMyI, fe.relMzI], se = [fe.relMxJ, fe.relMyJ, fe.relMzJ];
        (J.some((de) => de) || se.some((de) => de)) && Nt("segs", y, "releases", { i: J, j: se }), fe.hinges !== "None" && Nt("segs", y, "hinges", fe.hinges);
        const oe = [fe.LKx, fe.LKy, fe.LKz];
        oe.some((de) => de !== 0) && Nt("segs", y, "lineSprings", oe);
        const ie = [fe.qx, fe.qy, fe.qz];
        ie.some((de) => de !== 0) && Nt("segs", y, "distLoad", ie), fe.massPerM !== 0 && Nt("segs", y, "massPerM", fe.massPerM), we(`\u2713 Propiedades aplicadas a ${y.length} segmento(s)`);
      });
    }
    if (M) {
      const N = yt.addFolder({ title: `\u25AD Shell / \xC1rea \u2014 ${m.length}` });
      N.addBinding(fe, "shellType", { label: "Tipo", options: { "Mindlin (FSDT)": "Mindlin (FSDT)", "Kirchhoff (CPT)": "Kirchhoff (CPT)", "Plane stress": "Plane stress" } }), N.addBinding(fe, "thickness", { label: "Espesor (m)", min: 0.01, step: 0.01 }), N.addBinding(fe, "material_shell", { label: "Material", options: { "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25", "Concreto C30": "Concreto C30", "Acero A36": "Acero A36" } }), yt.addFolder({ title: "\u2B07 Carga superficial (kN/m\xB2)" }).addBinding(fe, "surfLoad", { label: "q", step: 0.1 }), yt.addButton({ title: "\u2713 Aplicar a \xE1reas seleccionadas" }).on("click", () => {
        Nt("areas", m, "shellType", fe.shellType), Nt("areas", m, "thickness", fe.thickness), Nt("areas", m, "material", fe.material_shell), fe.surfLoad !== 0 && Nt("areas", m, "surfLoad", fe.surfLoad), we(`\u2713 Propiedades aplicadas a ${m.length} \xE1rea(s)/shell(s)`);
      });
    }
    if ($) {
      const N = yt.addFolder({ title: "\u2139 Selecci\xF3n" }), F = { msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar" };
      N.addBinding(F, "msg", { readonly: true, label: "Qu\xE9 hacer" });
    }
    yt.addButton({ title: "\u2715 Cerrar (limpia selecci\xF3n)" }).on("click", () => {
      Ue.clear(), ls();
    }), es.style.display = "block", al();
  };
  window.__hekatanRefreshPropsPane = ll;
  let hi = null, an = false;
  a.addEventListener("pointerdown", (u) => {
    u.button === 2 && (hi = { x: u.clientX, y: u.clientY }, an = false);
  }), a.addEventListener("pointermove", (u) => {
    if (hi && u.buttons & 2 && !an) {
      const g = u.clientX - hi.x, y = u.clientY - hi.y;
      Math.hypot(g, y) > 8 && (an = true);
    }
  }), a.addEventListener("pointerup", (u) => {
    var _a3, _b, _c2;
    if (u.button === 2) {
      const g = hi !== null && !an;
      hi = null;
      const y = window.__hekatanRClickOnElement === true;
      if (window.__hekatanRClickOnElement = false, y) return;
      if (g) {
        if (ts ? on() : window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })), Ue.size > 0 && (Ue.clear(), ls()), r.polylines) {
          const E = r.polylines.rawVal;
          (E[E.length - 1] ?? []).length > 0 && (r.polylines.val = [...E, []]);
        }
        const m = window.__hekatanCadState, v = (_b = (_a3 = m == null ? void 0 : m.get) == null ? void 0 : _a3.call(m)) == null ? void 0 : _b.tool;
        v && v !== "select" && v !== "none" ? ((_c2 = m == null ? void 0 : m.setTool) == null ? void 0 : _c2.call(m, "select"), we(`\u238B Cancelado \u2014 tool '${v}' cerrado, volv\xE9s a Seleccionar`)) : we("\u238B Cancelado (click derecho)");
      }
    }
  }), a.addEventListener("contextmenu", (u) => {
    u.preventDefault(), u.stopPropagation();
  }, { capture: true }), a.addEventListener("pointerdown", (u) => {
    var _a3, _b, _c2;
    const g = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select";
    g !== "select" && g !== "none" && g || u.button === 0 && (window.__hekatanBloquearVentana || u.pointerType !== "touch" && (cs = null, $i = false));
  }), a.addEventListener("pointermove", (u) => {
    if (ts && u.buttons === 0) {
      const E = u.clientX < ts.x;
      Vn(ts.x, ts.y, u.clientX, u.clientY, E);
      return;
    }
    if (!cs) return;
    const g = u.clientX - cs.x, y = u.clientY - cs.y, m = Math.hypot(g, y);
    if (!$i && m < 8) return;
    $i = true;
    const v = u.clientX < cs.x;
    Vn(cs.x, cs.y, u.clientX, u.clientY, v);
  }), a.addEventListener("pointerup", (u) => {
    if (!cs) return;
    if (!$i) {
      cs = null;
      return;
    }
    const g = u.ctrlKey || u.metaKey || u.shiftKey;
    Oo(cs.x, cs.y, u.clientX, u.clientY, g), cs = null, $i = false;
  }), window.__hekatanOsnap = window.__hekatanOsnap ?? { end: true, mid: true, node: true, cen: true, per: false, nea: false, int: true, ori: true, grid: true };
  const ns = new ft();
  ns.visible = false, ns.frustumCulled = false, t.add(ns);
  const Bo = { end: 16724804, mid: 16498468, node: 6333946, cen: 3462041, per: 12616956, nea: 16744118, int: 16746496, ori: 16777215, grid: 2282478, track: 16761856, ifc: 16096779, ifcAxis: 16639626, ifcSec: 16486972, ifcEdge: 16498468, ifcVert: 16724804 }, ln = (u, g, y, m) => {
    var _a3, _b, _c2, _d;
    for (; ns.children.length; ) {
      const k = ns.children.pop();
      (_b = (_a3 = k.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c2 = k.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }
    const v = Bo[u] ?? 16777215, E = new ze().setFromPoints([new te(-1, -1, 0), new te(1, -1, 0), new te(1, -1, 0), new te(1, 1, 0), new te(1, 1, 0), new te(-1, 1, 0), new te(-1, 1, 0), new te(-1, -1, 0)]);
    ns.add(new is(E, new mt({ color: v, linewidth: 2 }))), ns.position.set(g, y, m), ns.visible = true, Xn();
  };
  let Hn = 4;
  const Xn = () => {
    ns.visible && ns.scale.setScalar(Hn * nn(ns.position));
  };
  window.__hekatanOsnapMarkerRef = ns, window.__hekatanUpdateOsnapScale = Xn, window.__hekatanOsnapPx = (u) => (typeof u == "number" && u > 0 && (Hn = u, Xn(), l()), Hn);
  const rn = () => {
    ns.visible = false;
  }, rl = { ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final", track: "Alineado con un nudo", node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersecci\xF3n", per: "Perpendicular", nea: "Cercano", ifc: "Referencia IFC \xB7 cara", ifcAxis: "Referencia IFC \xB7 eje", ifcSec: "Secci\xF3n IFC (corte)", ifcEdge: "Borde IFC", ifcVert: "V\xE9rtice IFC" }, bs = document.createElement("div");
  bs.id = "hk-osnap-etiqueta", bs.style.cssText = ["position:fixed", "z-index:99995", "display:none", "pointer-events:none", "padding:2px 7px", "border-radius:4px", "white-space:nowrap", "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)", "color:#e2e8f0", "font:12px Consolas,monospace"].join(";") + ";", document.body.appendChild(bs);
  const cn = (u, g, y) => {
    const m = rl[u];
    if (!m) {
      bs.style.display = "none";
      return;
    }
    bs.textContent = m, bs.style.color = "#" + (Bo[u] ?? 16777215).toString(16).padStart(6, "0"), bs.style.left = g + 18 + "px", bs.style.top = y - 26 + "px", bs.style.display = "block";
  }, cl = () => {
    bs.style.display = "none";
  }, js = new te(), Ws = (u, g, y) => {
    const m = s();
    if (!m) return null;
    const v = a.getBoundingClientRect();
    return js.set(u, g, y).project(m), !isFinite(js.x) || !isFinite(js.y) || js.z < -1 || js.z > 1 ? null : { x: v.left + (js.x * 0.5 + 0.5) * v.width, y: v.top + (-js.y * 0.5 + 0.5) * v.height };
  };
  window.__hekatanAPixeles = Ws;
  const dl = (u, g, y, m, v) => {
    var _a3, _b, _c2, _d, _e2, _f, _g, _h;
    if (window.__hekatanOsnapOn === false) return null;
    const E = window.__hekatanOsnap, k = r.points.rawVal, M = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let $ = null;
    const I = { ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5 }, T = v, N = (z, V, H, ee) => {
      let Z;
      if (T) {
        const se = Ws(V, H, ee);
        if (!se || (Z = Math.hypot(se.x - T.x, se.y - T.y), Z > Fs)) return;
      } else if (Z = Math.hypot(V - u, H - g, ee - y), Z > m) return;
      const J = I[z] ?? 9;
      (!$ || J < $.r || J === $.r && Z < $.d) && ($ = { type: z, x: V, y: H, z: ee, d: Z, r: J });
    };
    if (E.ori !== false && N("ori", 0, 0, 0), E.grid !== false && window.__hekatanSnapEnabled === true) {
      const z = window.__hekatanGridConfig, V = (z == null ? void 0 : z.minorStep) && z.minorStep > 0 ? z.minorStep : 1, H = ((z == null ? void 0 : z.gridSize) ?? 30) / 2, ee = ((_d = (_c2 = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c2.call(_b)) == null ? void 0 : _d.workPlane) ?? "xy", Z = (se) => Math.round(se / V) * V, J = (se, oe) => Math.abs(se) <= H + 1e-9 && Math.abs(oe) <= H + 1e-9;
      if (ee === "xz") {
        const se = Z(u), oe = Z(y);
        J(se, oe) && N("grid", se, g, oe);
      } else if (ee === "yz") {
        const se = Z(g), oe = Z(y);
        J(se, oe) && N("grid", u, se, oe);
      } else {
        const se = Z(u), oe = Z(g);
        J(se, oe) && N("grid", se, oe, y);
      }
    }
    (E.node || E.end) && k.forEach((z) => {
      E.node && N("node", z[0], z[1], z[2]);
    });
    for (const z of M) if (!(z.length < 2)) for (let V = 0; V < z.length - 1; V++) {
      const H = k[z[V]], ee = k[z[V + 1]];
      if (!(!H || !ee) && (E.end && (N("end", H[0], H[1], H[2]), N("end", ee[0], ee[1], ee[2])), E.mid && N("mid", (H[0] + ee[0]) / 2, (H[1] + ee[1]) / 2, (H[2] + ee[2]) / 2), E.nea || E.per)) {
        const Z = ee[0] - H[0], J = ee[1] - H[1], se = ee[2] - H[2], oe = Z * Z + J * J + se * se;
        if (oe < 1e-12) continue;
        const ie = Math.max(0, Math.min(1, ((u - H[0]) * Z + (g - H[1]) * J + (y - H[2]) * se) / oe)), de = H[0] + ie * Z, me = H[1] + ie * J, ke = H[2] + ie * se;
        E.nea && N("nea", de, me, ke), E.per && N("per", de, me, ke);
      }
    }
    if (E.cen) {
      const z = ((_e2 = r.areas) == null ? void 0 : _e2.rawVal) ?? [];
      for (const V of z) {
        const H = M[V];
        if (!H || H.length < 3) continue;
        const ee = H[0] === H[H.length - 1] ? H.slice(0, -1) : H;
        let Z = 0, J = 0, se = 0, oe = 0;
        for (const ie of ee) {
          const de = k[ie];
          de && (Z += de[0], J += de[1], se += de[2], oe++);
        }
        oe >= 3 && N("cen", Z / oe, J / oe, se / oe);
      }
    }
    if (E.cen) {
      const z = Fo(), V = [...Qi];
      for (const H of z) V.some((ee) => Math.hypot(ee.c[0] - H.c[0], ee.c[1] - H.c[1], ee.c[2] - H.c[2]) < 1e-6 && Math.abs(ee.r - H.r) < 1e-6) || V.push(H);
      for (const H of V) {
        if (!k.some((J) => Math.abs(Math.hypot(J[0] - H.c[0], J[1] - H.c[1], J[2] - H.c[2]) - H.r) < 1e-6)) continue;
        const Z = Math.hypot(u - H.c[0], g - H.c[1], y - H.c[2]);
        if (Z < m || Math.abs(Z - H.r) < m) {
          const J = Math.min(Z, m * 0.5), se = 3;
          (!$ || se < $.r || se === $.r && J < $.d) && ($ = { type: "cen", x: H.c[0], y: H.c[1], z: H.c[2], d: J, r: se });
        }
      }
    }
    if (E.int) {
      const z = [];
      for (const V of M) for (let H = 0; H < V.length - 1; H++) {
        const ee = k[V[H]], Z = k[V[H + 1]];
        if (!ee || !Z) continue;
        const J = Z[0] - ee[0], se = Z[1] - ee[1], oe = Z[2] - ee[2], ie = J * J + se * se + oe * oe;
        if (ie < 1e-12) continue;
        const de = Math.max(0, Math.min(1, ((u - ee[0]) * J + (g - ee[1]) * se + (y - ee[2]) * oe) / ie));
        Math.hypot(ee[0] + de * J - u, ee[1] + de * se - g, ee[2] + de * oe - y) < 3 * m && z.push([ee, Z]);
      }
      for (let V = 0; V < z.length; V++) for (let H = V + 1; H < z.length; H++) {
        const [ee, Z] = z[V], [J, se] = z[H], oe = [Z[0] - ee[0], Z[1] - ee[1], Z[2] - ee[2]], ie = [se[0] - J[0], se[1] - J[1], se[2] - J[2]], de = [ee[0] - J[0], ee[1] - J[1], ee[2] - J[2]], me = oe[0] * oe[0] + oe[1] * oe[1] + oe[2] * oe[2], ke = oe[0] * ie[0] + oe[1] * ie[1] + oe[2] * ie[2], Ae = ie[0] * ie[0] + ie[1] * ie[1] + ie[2] * ie[2], nt = oe[0] * de[0] + oe[1] * de[1] + oe[2] * de[2], je = ie[0] * de[0] + ie[1] * de[1] + ie[2] * de[2], et = me * Ae - ke * ke;
        if (et < 1e-12) continue;
        const De = (ke * je - Ae * nt) / et, Je = (me * je - ke * nt) / et;
        if (De < -1e-6 || De > 1 + 1e-6 || Je < -1e-6 || Je > 1 + 1e-6) continue;
        const Be = [ee[0] + De * oe[0], ee[1] + De * oe[1], ee[2] + De * oe[2]], Pe = [J[0] + Je * ie[0], J[1] + Je * ie[1], J[2] + Je * ie[2]];
        if (Math.hypot(Be[0] - Pe[0], Be[1] - Pe[1], Be[2] - Pe[2]) > 1e-4) continue;
        [ee, Z, J, se].some((We) => Math.hypot(We[0] - Be[0], We[1] - Be[1], We[2] - Be[2]) < 1e-6) || N("int", Be[0], Be[1], Be[2]);
      }
    }
    const F = window.__hekatanAxisGrids ?? [], L = window.__hekatanLevels ?? [], Y = F.filter((z) => z && z.start && z.end).map((z) => [z.start, z.end]);
    for (const [z, V] of Y) {
      E.end && (N("end", z[0], z[1], z[2]), N("end", V[0], V[1], V[2]));
      const H = V[0] - z[0], ee = V[1] - z[1], Z = V[2] - z[2], J = H * H + ee * ee + Z * Z;
      if (J < 1e-12) continue;
      const se = Math.max(0, Math.min(1, ((u - z[0]) * H + (g - z[1]) * ee + (y - z[2]) * Z) / J));
      if (E.nea && N("nea", z[0] + se * H, z[1] + se * ee, z[2] + se * Z), E.int && Math.abs(Z) > 1e-9) for (const oe of L) {
        const ie = (oe.z - z[2]) / Z;
        ie < -1e-6 || ie > 1 + 1e-6 || N("int", z[0] + ie * H, z[1] + ie * ee, oe.z);
      }
    }
    if (E.int || E.node) for (let z = 0; z < Y.length; z++) for (let V = z + 1; V < Y.length; V++) {
      const [H, ee] = Y[z], [Z, J] = Y[V], se = ee[0] - H[0], oe = ee[1] - H[1], ie = J[0] - Z[0], de = J[1] - Z[1], me = se * de - oe * ie;
      if (Math.abs(me) < 1e-12) continue;
      const ke = H[0] - Z[0], Ae = H[1] - Z[1], nt = (ie * Ae - de * ke) / me, je = (se * Ae - oe * ke) / me;
      if (nt < -1e-6 || nt > 1 + 1e-6 || je < -1e-6 || je > 1 + 1e-6) continue;
      const et = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
      N("int", H[0] + nt * se, H[1] + nt * oe, typeof et == "number" ? et : y);
    }
    const j = window.__hekatanDrawingAuxLines, O = (j == null ? void 0 : j.rawVal) ?? (j == null ? void 0 : j.val) ?? j ?? [];
    for (const z of O) {
      if (z.length !== 6) continue;
      const V = [z[0], z[1], z[2]], H = [z[3], z[4], z[5]];
      if (E.end && (N("end", V[0], V[1], V[2]), N("end", H[0], H[1], H[2])), E.mid && N("mid", (V[0] + H[0]) / 2, (V[1] + H[1]) / 2, (V[2] + H[2]) / 2), E.nea || E.per) {
        const ee = H[0] - V[0], Z = H[1] - V[1], J = H[2] - V[2], se = ee * ee + Z * Z + J * J;
        if (se < 1e-12) continue;
        const oe = Math.max(0, Math.min(1, ((u - V[0]) * ee + (g - V[1]) * Z + (y - V[2]) * J) / se)), ie = V[0] + oe * ee, de = V[1] + oe * Z, me = V[2] + oe * J;
        E.nea && N("nea", ie, de, me), E.per && N("per", ie, de, me);
      }
    }
    return $ ? { type: $.type, x: $.x, y: $.y, z: $.z } : null;
  }, ui = new ft();
  ui.frustumCulled = false, t.add(ui);
  const Ho = new mt({ color: 15123555, transparent: true, opacity: 1, depthTest: false });
  let Xo = 0;
  const Yo = () => {
    var _a3, _b;
    for (const u of ui.children.slice()) ui.remove(u), (_b = (_a3 = u.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
  };
  window.__hekatanDestello = (u) => {
    var _a3, _b;
    Yo();
    const g = ((_a3 = r.points) == null ? void 0 : _a3.rawVal) ?? [], y = ((_b = r.polylines) == null ? void 0 : _b.rawVal) ?? [];
    for (const v of u || []) {
      const E = String(v).split(":");
      let k = [];
      if (E[0] === "pt") {
        const I = g[+E[1]];
        I && (k = [I, [I[0] + 1e-3, I[1], I[2]]]);
      } else if (E[0] === "seg") {
        const I = y[+E[1]] || [], T = g[I[+E[2]]], N = g[I[+E[2] + 1]];
        T && N && (k = [T, N]);
      } else E[0] === "poly" && (k = (y[+E[1]] || []).map((T) => g[T]).filter(Boolean));
      if (k.length < 2) continue;
      const M = new ze().setFromPoints(k.map((I) => new te(I[0], I[1], I[2]))), $ = new Vt(M, Ho);
      $.renderOrder = 1200, ui.add($);
    }
    if (!ui.children.length) return;
    Xo = performance.now() + 900;
    const m = () => {
      const v = Xo - performance.now();
      if (v <= 0) {
        Yo(), l();
        return;
      }
      Ho.opacity = Math.min(1, v / 900) * 0.95, l(), requestAnimationFrame(m);
    };
    requestAnimationFrame(m);
  }, window.addEventListener("hk:property-applied", (u) => {
    var _a3;
    const g = (_a3 = u == null ? void 0 : u.detail) == null ? void 0 : _a3.ids;
    Array.isArray(g) && g.length && window.__hekatanDestello(g);
  }), window.__hekatanOsnapCompute = dl, window.__hekatanOsnapShow = ln, window.__hekatanOsnapHide = rn;
  let qe = [], It = 0, Zs = 0, Ut = null;
  const Ps = document.createElement("div");
  Ps.id = "hk-cad-status", Ps.style.cssText = ["position:fixed", "bottom:8px", "left:50%", "transform:translateX(-50%)", "padding:6px 14px", "background:rgba(15, 23, 42, 0.92)", "color:#22d3ee", "border:1px solid rgba(34, 211, 238, 0.5)", "border-radius:6px", "font-family:Consolas, monospace", "font-size:12px", "z-index:90", "pointer-events:none", "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)", "max-width:90vw", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis"].join(";") + ";", Ps.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(Ps);
  const Ai = () => {
    const u = document.getElementById("hk3-cmdline");
    if (!u) {
      Ps.style.bottom = "8px";
      return;
    }
    const g = u.getBoundingClientRect();
    if (g.height <= 0) {
      Ps.style.bottom = "8px";
      return;
    }
    const y = Math.max(0, window.innerHeight - g.top);
    Ps.style.bottom = Math.round(y + 8) + "px";
  };
  Ai(), window.addEventListener("resize", Ai), setTimeout(Ai, 500), setTimeout(Ai, 2e3), setTimeout(Ai, 5e3);
  const hl = () => {
    var _a3, _b, _c2;
    const u = [];
    window.__hekatanOrthoMode && u.push("\u22A5 ORTO ON (F8)"), zt && u.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
    const y = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.workZ) ?? 0;
    return Math.abs(y) > 1e-3 && u.push(`Cota Z=${y}m`), window.__hekatanShowOrthoPlanes !== false && u.push("\u25A6 Planos XY/XZ/YZ"), u.length > 0 ? `   |   ${u.join("  \xB7  ")}` : "";
  }, we = (u) => {
    var _a3;
    const g = u + hl();
    Ps.textContent = g, window.__hekatanCadStatusText = g;
    try {
      (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, u);
    } catch {
    }
  }, ul = "Comando:", pl = () => {
    var _a3, _b, _c2, _d;
    const u = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select", g = ((_d = r.polylines) == null ? void 0 : _d.rawVal) ?? [], y = g.length ? g[g.length - 1] : [], m = qe.length, v = (E, k = []) => ({ txt: E, ops: k });
    switch (u) {
      case "line":
        return y.length >= 2 ? v("L\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : y.length === 1 ? v("L\xCDNEA Precise punto siguiente o", ["desHacer"]) : v("L\xCDNEA Precise primer punto:");
      case "polyline":
        return y.length >= 2 ? v("POLIL\xCDNEA Precise punto siguiente o", ["Cerrar", "desHacer"]) : y.length === 1 ? v("POLIL\xCDNEA Precise punto siguiente o", ["desHacer"]) : v("POLIL\xCDNEA Precise punto inicial:");
      case "node":
        return v("NUDO Precise punto:");
      case "area":
        return v(`LOSA Precise v\xE9rtice ${Math.min(y.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea":
        return v(m ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea":
        return v(`\xC1REA LIBRE Precise v\xE9rtice ${lt.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea":
        return v("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
      case "medir":
        return v(`REGLA ${Ke.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
      case "rect":
        return v(m ? "RECT\xC1NGULO Precise otra esquina:" : "RECT\xC1NGULO Precise primera esquina:");
      case "circle":
        return v(m ? "C\xCDRCULO Precise radio (clic o teclee la cifra):" : "C\xCDRCULO Precise centro:");
      case "arc":
        return v(m === 0 ? "ARCO Precise punto inicial:" : m === 1 ? "ARCO Precise segundo punto:" : "ARCO Precise punto final:");
      case "parabola":
        return v(`PAR\xC1BOLA Precise punto ${m + 1} de 3 (pasa por los tres):`);
      case "cubica":
        return v(`C\xDABICA Precise punto ${m + 1} de 4 (pasa por los cuatro):`);
      case "revolve":
        return v("REVOLUCI\xD3N Precise un punto del eje vertical (Z) alrededor del que gira la selecci\xF3n:");
      case "loft":
        return v("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
      case "col":
        return v(`COLUMNA Precise punto de inserci\xF3n (altura ${It > 0 ? It : 3} m; teclee otra + Enter antes del clic):`);
      case "wall":
        return v(m ? "MURO Precise segundo punto de la base:" : `MURO Precise primer punto de la base (altura ${It > 0 ? It : 3} m; teclee otra + Enter):`);
      case "plane3":
        return v(`PLANO Precise punto ${m + 1} de 3:`);
      case "extp":
        return v("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl":
        return v("EXTRUIR Precise la l\xEDnea a levantar:");
      case "extend":
        return v(Ut ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
      case "trim":
        return v(Ut ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
      case "offset":
        return v(Ut ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Zs > 0 ? ` (distancia ${Zs} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
      case "axis":
        return v("EJE Precise el primer punto del eje:");
      case "aux":
        return v(m ? "AUXILIAR Precise el segundo punto:" : "AUXILIAR Precise el primer punto:");
      case "auxp":
        return v("PUNTO AUXILIAR Precise punto:");
      case "chaflan":
        return v(m ? "LOSA CHAFLANES Precise otra esquina:" : "LOSA CHAFLANES Precise primera esquina:");
      case "delete":
        return v("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move":
        return Ue.size ? v(m ? "MOVER Precise segundo punto (o teclee @dx,dy,dz):" : "MOVER Precise punto base:") : v("MOVER Designe objetos (S o ventana) y vuelva a M:");
      case "copy":
        return Ue.size ? v(m ? "COPIAR Precise segundo punto (o teclee @dx,dy,dz):" : "COPIAR Precise punto base:") : v("COPIAR Designe objetos (S o ventana) y vuelva a CO:");
      case "select":
        return Ue.size ? v(`SELECCI\xD3N ${Ue.size} objeto${Ue.size === 1 ? "" : "s"} \xB7 Supr borra \xB7 M mueve \xB7 CO copia \xB7 Esc suelta:`) : v("Designe objetos (clic-clic: ventana izq\u2192der, captura der\u2192izq) o teclee un comando:");
      default:
        return v(ul);
    }
  }, ss = () => {
    var _a3, _b, _c2, _d, _e2;
    try {
      const u = pl(), g = ((_c2 = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c2.length) ?? 0, y = (((_d = r.points) == null ? void 0 : _d.rawVal) ?? []).length, v = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(u.txt) && !g && !y ? `${u.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : u.txt;
      (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, v, u.ops);
    } catch {
    }
  };
  window.__hekatanCadRefreshPrompt = ss, window.__hekatanRefreshStatus = () => {
    const u = window.__hekatanCadStatusText ?? "", g = u.split("   |   ")[0] ?? u;
    we(g);
  }, window.__hekatanCadResetPending = () => {
    qe = [], lt = [], ht.visible = false, Yn(), Ut = null, l(), we("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), ss();
  };
  function Yn() {
    if (!r.polylines) return;
    const u = r.polylines.rawVal.filter((g) => g.length >= 2);
    r.polylines.val = [...u, []];
  }
  window.__hekatanCerrarPolilinea = Yn;
  const pi = [], dn = [], fl = () => {
    const u = window.__hekatanDrawingAuxLines;
    return JSON.parse(JSON.stringify((u == null ? void 0 : u.rawVal) ?? (u == null ? void 0 : u.val) ?? []));
  }, Un = () => {
    var _a3, _b;
    return { p: JSON.parse(JSON.stringify(r.points.rawVal ?? [])), l: JSON.parse(JSON.stringify(((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [])), a: JSON.parse(JSON.stringify(((_b = r.areas) == null ? void 0 : _b.rawVal) ?? [])), x: fl() };
  }, Uo = (u) => {
    var _a3;
    if (r.points.val = u.p, r.polylines && (r.polylines.val = u.l), r.areas && (r.areas.val = u.a), u.x) {
      const g = window.__hekatanDrawingAuxLines;
      g && "val" in g && (g.val = u.x);
    }
    qe = [], Re.visible = false, Zt.visible = false, ot();
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    l(), ss();
  }, Et = () => {
    pi.push(Un()), pi.length > 100 && pi.shift(), dn.length = 0;
  }, hn = () => {
    const u = pi.pop();
    if (!u) {
      we("\u21B6 Nada para deshacer");
      return;
    }
    dn.push(Un()), Uo(u), we(`\u21B6 Deshacer \u2014 quedan ${pi.length}`);
  }, qo = () => {
    const u = dn.pop();
    if (!u) {
      we("\u21B7 Nada para rehacer");
      return;
    }
    pi.push(Un()), Uo(u), we(`\u21B7 Rehacer \u2014 quedan ${dn.length}`);
  };
  window.__hekatanPushUndo = Et, window.__hekatanUndo = hn, window.__hekatanRedo = qo, document.addEventListener("keydown", (u) => {
    var _a3;
    const g = u.key.toLowerCase();
    if (!((u.ctrlKey || u.metaKey) && (g === "y" || g === "z" && u.shiftKey))) return;
    const m = u.target;
    m && (m.tagName === "INPUT" || m.tagName === "TEXTAREA") && m.type !== "checkbox" && m.type !== "range" && (((_a3 = m.value) == null ? void 0 : _a3.length) ?? 0) > 0 && m.__hkSucio || (u.preventDefault(), u.stopPropagation(), qo());
  }, { capture: true }), window.__hekatanCadOption = (u) => {
    var _a3, _b, _c2, _d, _e2;
    const g = u.trim().toLowerCase(), y = (_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool;
    if (!r.polylines) return false;
    const m = r.polylines.rawVal, v = m.length ? m[m.length - 1] : [];
    if (y !== "line" && y !== "polyline") return g === "u" || g === "deshacer" || g === "undo" ? (hn(), true) : false;
    if (g === "c" || g === "cerrar" || g === "close") {
      if (v.length < 3) return we("Cerrar necesita al menos tres puntos."), true;
      Et(), r.polylines.val = [...m.slice(0, -1), [...v, v[0]], []];
      try {
        (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
      } catch {
      }
      return qn(), we(`\u2713 Polil\xEDnea cerrada \u2014 ${v.length} tramos.`), true;
    }
    if (g === "u" || g === "deshacer" || g === "undo") {
      if (!v.length) return hn(), true;
      Et();
      const E = v[v.length - 1], k = v.slice(0, -1), M = m.some((T, N) => N !== m.length - 1 && T.includes(E)) || k.includes(E);
      let $ = r.points.rawVal, I = [...m.slice(0, -1), k];
      if (!M && E === $.length - 1 && ($ = $.slice(0, -1), r.points.val = $), r.polylines.val = I, k.length) {
        const T = $[k[k.length - 1]];
        T && (Ye = [T[0], T[1], T[2]]);
      } else Ye = null, Re.visible = false;
      try {
        (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
      } catch {
      }
      return l(), we(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${k.length}.`), ss(), true;
    }
    return false;
  }, document.addEventListener("input", (u) => {
    const g = u.target;
    g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA") && (g.__hkSucio = true);
  }, { capture: true }), document.addEventListener("focusout", (u) => {
    const g = u.target;
    g && (g.__hkSucio = false);
  }, { capture: true }), document.addEventListener("keydown", (u) => {
    var _a3;
    if ((u.ctrlKey || u.metaKey) && u.key.toLowerCase() === "z" && !u.shiftKey) {
      const g = u.target, y = g == null ? void 0 : g.tagName;
      if ((y === "INPUT" || y === "TEXTAREA") && g.type !== "checkbox" && g.type !== "range" && ((_a3 = g.value) == null ? void 0 : _a3.length) > 0 && !!g.__hkSucio) return;
      u.preventDefault(), u.stopPropagation(), hn();
    }
  }, { capture: true });
  const qn = () => {
    qe = [], Ut = null, Yn(), zt = null, Mo(), Re.visible = false, Zt.visible = false, ot(), we("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), l(), ss();
  };
  window.__hekatanFinalizeDraw = qn;
  const jo = () => {
    var _a3, _b, _c2;
    qe = [], lt = [], ht.visible = false;
    let u = false;
    Ue.size && (Ue.clear(), ls(), u = true), qn();
    try {
      const g = window.__hekatanCadState, y = (_b = (_a3 = g == null ? void 0 : g.get) == null ? void 0 : _a3.call(g)) == null ? void 0 : _b.tool;
      y && y !== "select" && ((_c2 = g == null ? void 0 : g.setTool) == null ? void 0 : _c2.call(g, "select"));
    } catch {
    }
    we(u ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), l(), ss();
  };
  window.__hekatanEscapeCancel = jo;
  const Wo = () => {
    var _a3;
    const u = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], g = /* @__PURE__ */ new Set();
    return Ue.forEach((y) => {
      if (y.startsWith("pt:")) g.add(+y.slice(3));
      else if (y.startsWith("poly:")) (u[+y.slice(5)] || []).forEach((m) => g.add(m));
      else if (y.startsWith("seg:")) {
        const m = y.split(":"), v = u[+m[1]] || [], E = v[+m[2]], k = v[+m[2] + 1];
        E != null && g.add(E), k != null && g.add(k);
      }
    }), g;
  }, Zo = (u, g, y) => {
    var _a3;
    const m = Wo();
    if (!m.size) return 0;
    Et();
    const v = r.points.rawVal.map((E, k) => m.has(k) ? [E[0] + u, E[1] + g, E[2] + y] : E);
    r.points.val = v;
    try {
      (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
    } catch {
    }
    return ls(), l(), m.size;
  };
  window.__hekatanMoveSelection = Zo;
  const Ko = (u, g) => {
    var _a3, _b, _c2, _d, _e2;
    if (!Ue.size) {
      we(`${u === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), ss();
      return;
    }
    if (qe.push(g), qe.length === 1) {
      Ye = g, we(`${u === "move" ? "MOVER" : "COPIAR"} punto base (${g[0].toFixed(2)}, ${g[1].toFixed(2)}, ${g[2].toFixed(2)}). Precise el segundo punto.`), ss();
      return;
    }
    const [y, m] = qe, v = [m[0] - y[0], m[1] - y[1], m[2] - y[2]];
    qe = [], Re.visible = false;
    let E = 0;
    u === "move" ? E = Zo(v[0], v[1], v[2]) : (E = Wo().size, (_c2 = window.__hekatanReplicateSelection) == null ? void 0 : _c2.call(window, v[0], v[1], v[2], 1)), we(`\u2713 ${u === "move" ? "Movidos" : "Copiados"} ${E} nudo${E === 1 ? "" : "s"} \u2014 \u0394 (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}) m.`), u === "move" && (Ue.clear(), ls()), (_e2 = (_d = window.__hekatanCadState) == null ? void 0 : _d.setTool) == null ? void 0 : _e2.call(_d, "select"), ss();
  };
  window.__hekatanPasoMoverCopiar = Ko;
  const ml = () => {
    var _a3, _b, _c2;
    const u = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.workPlane) ?? "xy";
    return u === "xz" ? [0, 1, 0] : u === "yz" ? [1, 0, 0] : [0, 0, 1];
  }, Rs = (u, g) => Math.hypot(u[0] - g[0], u[1] - g[1], u[2] - g[2]), jn = (u, g, y, m, v, E) => {
    const k = [g[0] - u[0], g[1] - u[1], g[2] - u[2]], M = [m[0] - y[0], m[1] - y[1], m[2] - y[2]], $ = [u[0] - y[0], u[1] - y[1], u[2] - y[2]], I = k[0] * k[0] + k[1] * k[1] + k[2] * k[2], T = k[0] * M[0] + k[1] * M[1] + k[2] * M[2], N = M[0] * M[0] + M[1] * M[1] + M[2] * M[2], F = k[0] * $[0] + k[1] * $[1] + k[2] * $[2], L = M[0] * $[0] + M[1] * $[1] + M[2] * $[2], Y = I * N - T * T;
    if (Y < 1e-12) return null;
    const j = (T * L - N * F) / Y, O = (I * L - T * F) / Y;
    if (!v && (j < -1e-6 || j > 1 + 1e-6) || !E && (O < -1e-6 || O > 1 + 1e-6)) return null;
    const z = [u[0] + j * k[0], u[1] + j * k[1], u[2] + j * k[2]], V = [y[0] + O * M[0], y[1] + O * M[1], y[2] + O * M[2]];
    return Rs(z, V) > 1e-4 ? null : z;
  }, gl = (u) => {
    var _a3;
    return (((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((g, y) => g + y.filter((m) => m === u).length, 0);
  }, wl = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" }, yl = (u, g) => {
    var _a3, _b;
    if (!r.polylines) return;
    const y = r.polylines.rawVal, m = r.points.rawVal, v = wl[u];
    if (!Ut) {
      if (ms < 0) {
        we(`${v}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
        return;
      }
      Ut = { poly: ms, seg: Math.max(0, zs) }, we(u === "offset" ? `DESFASE l\xEDnea #${Ut.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Zs > 0 ? ` (${Zs} m)` : ""}.` : u === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), ss();
      return;
    }
    if (u === "offset") {
      const j = Ut.poly, O = y[j];
      if (!O || O.length < 2) {
        Ut = null, we("DESFASE: esa polil\xEDnea no tiene tramos."), ss();
        return;
      }
      const z = O.length > 2 && O[0] === O[O.length - 1], V = ml(), H = [];
      for (let De = 0; De < O.length - 1; De++) {
        const Je = m[O[De]], Be = m[O[De + 1]], Pe = [Be[0] - Je[0], Be[1] - Je[1], Be[2] - Je[2]], Xe = Math.hypot(Pe[0], Pe[1], Pe[2]) || 1, We = Pe[0] / Xe, xt = Pe[1] / Xe, St = Pe[2] / Xe, Ot = [V[1] * St - V[2] * xt, V[2] * We - V[0] * St, V[0] * xt - V[1] * We], ds = Math.hypot(Ot[0], Ot[1], Ot[2]) || 1;
        H.push({ a: Je, b: Be, n: [Ot[0] / ds, Ot[1] / ds, Ot[2] / ds] });
      }
      let ee = 0, Z = 1 / 0;
      H.forEach((De, Je) => {
        const Be = ki(g[0], g[1], g[2], De.a[0], De.a[1], De.a[2], De.b[0], De.b[1], De.b[2]);
        Be < Z && (Z = Be, ee = Je);
      });
      const J = H[ee], se = Math.sign((g[0] - J.a[0]) * J.n[0] + (g[1] - J.a[1]) * J.n[1] + (g[2] - J.a[2]) * J.n[2]) || 1, oe = Zs > 0 ? Zs : Z;
      if (oe < 1e-6) {
        we("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
        return;
      }
      const ie = H.map((De) => ({ a: [De.a[0] + se * oe * De.n[0], De.a[1] + se * oe * De.n[1], De.a[2] + se * oe * De.n[2]], b: [De.b[0] + se * oe * De.n[0], De.b[1] + se * oe * De.n[1], De.b[2] + se * oe * De.n[2]] })), de = ie.length, me = (De) => {
        const Je = ie[(De - 1 + de) % de], Be = ie[De % de];
        return jn(Je.a, Je.b, Be.a, Be.b, true, true) ?? Be.a;
      }, ke = [], Ae = z ? de : de + 1;
      for (let De = 0; De < Ae; De++) !z && De === 0 ? ke.push(ie[0].a) : !z && De === de ? ke.push(ie[de - 1].b) : ke.push(me(De));
      Et();
      const nt = m.length;
      r.points.val = [...m, ...ke];
      const je = ke.map((De, Je) => nt + Je);
      z && je.push(nt);
      let et = y.slice();
      et.length && et[et.length - 1].length === 0 && (et = et.slice(0, -1)), r.polylines.val = [...et, je, []], Ut = null, we(`\u2713 Desfase a ${oe.toFixed(2)} m \u2014 ${de} tramo${de === 1 ? "" : "s"} nuevo${de === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      l(), ss();
      return;
    }
    let E = ms, k = Math.max(0, zs);
    if (E < 0 || E === Ut.poly && k === Ut.seg) {
      let O = (window.__hekatanSnap2D ?? 0.5) * 1.5;
      if (E = -1, y.forEach((z, V) => {
        for (let H = 0; H < z.length - 1; H++) {
          if (V === Ut.poly && H === Ut.seg) continue;
          const ee = m[z[H]], Z = m[z[H + 1]];
          if (!ee || !Z) continue;
          const J = ki(g[0], g[1], g[2], ee[0], ee[1], ee[2], Z[0], Z[1], Z[2]);
          J < O && (O = J, E = V, k = H);
        }
      }), E < 0) {
        we(`${v}: pase el cursor por OTRA l\xEDnea y haga clic.`);
        return;
      }
    }
    const M = y[Ut.poly], $ = m[M[Ut.seg]], I = m[M[Ut.seg + 1]], T = y[E], N = T[k], F = T[k + 1];
    if (!$ || !I || N == null || F == null) {
      we(`${v}: no se pudo leer el tramo.`);
      return;
    }
    const L = m[N], Y = m[F];
    if (u === "trim") {
      const j = jn(L, Y, $, I, false, false);
      if (!j) {
        we("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
        return;
      }
      Et();
      const O = m.length;
      r.points.val = [...m, j];
      const z = [...T.slice(0, k + 1), O, ...T.slice(k + 1)];
      r.polylines.val = y.map((H, ee) => ee === E ? z : H);
      const V = Rs(g, L) < Rs(g, Y);
      To(E, V ? k : k + 1), we(`\u2713 Recortado en (${j[0].toFixed(2)}, ${j[1].toFixed(2)}, ${j[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const j = jn(L, Y, $, I, true, false);
      if (!j) {
        we("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
        return;
      }
      const z = Rs(g, L) < Rs(g, Y) ? k : k + 1;
      if (z !== 0 && z !== T.length - 1) {
        we("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
        return;
      }
      const V = T[z];
      if (Rs(j, L) + Rs(j, Y) < Rs(L, Y) + 1e-6) {
        we("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
        return;
      }
      if (Et(), gl(V) > 1) {
        const ee = m.length;
        r.points.val = [...m, j];
        const Z = T.slice();
        Z[z] = ee, r.polylines.val = y.map((J, se) => se === E ? Z : J);
      } else r.points.val = m.map((ee, Z) => Z === V ? j : ee);
      we(`\u2713 Alargada hasta (${j[0].toFixed(2)}, ${j[1].toFixed(2)}, ${j[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
    }
    try {
      (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
    } catch {
    }
    l(), ss();
  };
  window.__hekatanSelectionSize = () => Ue.size, window.__hekatanSelectLast = () => {
    var _a3;
    const u = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [];
    let g = u.length - 1;
    for (; g >= 0 && (!u[g] || u[g].length < 2); ) g--;
    return Ue.clear(), g >= 0 && Ue.add(`poly:${g}`), ls(), we(g >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ue.size;
  }, window.__hekatanSelectAll = () => {
    var _a3, _b;
    const u = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], g = ((_b = r.points) == null ? void 0 : _b.rawVal) ?? [];
    Ue.clear();
    const y = /* @__PURE__ */ new Set();
    return u.forEach((m, v) => {
      !m || m.length < 2 || (Ue.add(`poly:${v}`), m.forEach((E) => y.add(E)));
    }), g.forEach((m, v) => {
      y.has(v) || Ue.add(`pt:${v}`);
    }), ls(), we(`SELECCI\xD3N ${Ue.size} objetos (todo el modelo) \xB7 Esc suelta`), Ue.size;
  }, window.__hekatanReplicateSelection = (u, g, y, m, v = 0) => {
    var _a3, _b, _c2, _d;
    m = Math.max(1, Math.round(m || 1)), v = Math.max(0, Math.round(v || 0));
    const E = [...Ue], k = r.points.rawVal, M = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], $ = new Set(((_b = r.areas) == null ? void 0 : _b.rawVal) ?? []), I = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set(), N = [];
    if (E.forEach((O) => {
      if (O.startsWith("pt:")) {
        const z = +O.slice(3);
        k[z] && I.add(z);
      } else if (O.startsWith("poly:")) {
        const z = +O.slice(5);
        if (!M[z] || M[z].length < 2) return;
        T.add(z), M[z].forEach((V) => I.add(V));
      } else if (O.startsWith("seg:")) {
        const z = O.split(":"), V = +z[1], H = +z[2], ee = M[V] || [], Z = ee[H], J = ee[H + 1];
        Z != null && J != null && (N.push([Z, J]), I.add(Z), I.add(J));
      }
    }), !I.size) return 0;
    Et();
    const F = [...k];
    let L = M.slice();
    L.length && L[L.length - 1].length === 0 && (L = L.slice(0, -1));
    const Y = [...((_c2 = r.areas) == null ? void 0 : _c2.rawVal) ?? []], j = [...I];
    for (let O = 1; O <= m; O++) {
      const z = v + O, V = u * z, H = g * z, ee = y * z, Z = /* @__PURE__ */ new Map();
      j.forEach((J) => {
        Z.set(J, F.length), F.push([k[J][0] + V, k[J][1] + H, k[J][2] + ee]);
      }), T.forEach((J) => {
        const se = M[J].map((ie) => Z.has(ie) ? Z.get(ie) : ie), oe = L.length;
        L.push(se), $.has(J) && Y.push(oe);
      }), N.forEach(([J, se]) => {
        L.push([Z.get(J), Z.get(se)]);
      });
    }
    L.push([]), r.points.val = F, r.polylines && (r.polylines.val = L), r.areas && (r.areas.val = Y);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return l(), m;
  }, window.__hekatanExtrudeSelection = (u, g, y, m) => {
    var _a3, _b, _c2, _d;
    m = Math.max(1, Math.round(m || 1));
    const v = [...Ue], E = r.points.rawVal, k = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], M = new Set(((_b = r.areas) == null ? void 0 : _b.rawVal) ?? []), $ = /* @__PURE__ */ new Set(), I = [], T = /* @__PURE__ */ new Set();
    for (const V of k) for (const H of V) T.add(H);
    if (v.forEach((V) => {
      if (V.startsWith("poly:")) {
        const H = +V.slice(5);
        if (M.has(H)) return;
        const ee = k[H] || [];
        for (let Z = 0; Z + 1 < ee.length; Z++) I.push([ee[Z], ee[Z + 1]]), T.add(ee[Z]), T.add(ee[Z + 1]);
      } else if (V.startsWith("seg:")) {
        const H = V.split(":"), ee = +H[1], Z = +H[2], J = k[ee] || [], se = J[Z], oe = J[Z + 1];
        se != null && oe != null && (I.push([se, oe]), T.add(se), T.add(oe));
      }
    }), v.forEach((V) => {
      if (V.startsWith("pt:")) {
        const H = +V.slice(3);
        E[H] && !T.has(H) && $.add(H);
      }
    }), !$.size && !I.length) return { lineas: 0, areas: 0 };
    Et();
    const N = [...E];
    let F = k.slice();
    F.length && F[F.length - 1].length === 0 && (F = F.slice(0, -1));
    const L = [...((_c2 = r.areas) == null ? void 0 : _c2.rawVal) ?? []], Y = /* @__PURE__ */ new Map(), j = (V, H) => {
      if (H === 0) return V;
      const ee = V + ":" + H;
      let Z = Y.get(ee);
      if (Z == null) {
        const J = [E[V][0] + u * H, E[V][1] + g * H, E[V][2] + y * H];
        Z = N.findIndex((se) => Math.abs(se[0] - J[0]) < 1e-3 && Math.abs(se[1] - J[1]) < 1e-3 && Math.abs(se[2] - J[2]) < 1e-3), Z < 0 && (Z = N.length, N.push(J)), Y.set(ee, Z);
      }
      return Z;
    };
    let O = 0, z = 0;
    $.forEach((V) => {
      const H = [V];
      for (let ee = 1; ee <= m; ee++) H.push(j(V, ee));
      F.push(H), O += m;
    }), I.forEach(([V, H]) => {
      for (let ee = 1; ee <= m; ee++) {
        const Z = [j(V, ee - 1), j(H, ee - 1), j(H, ee), j(V, ee)];
        L.push(F.length), F.push([...Z, Z[0]]), z++;
      }
    }), F.push([]), r.points.val = N, r.polylines && (r.polylines.val = F), r.areas && (r.areas.val = L);
    try {
      (_d = window.__hekatanRebuild) == null ? void 0 : _d.call(window);
    } catch {
    }
    return l(), { lineas: O, areas: z };
  }, window.__hekatanVoladoSelection = (u, g = {}) => {
    var _a3, _b, _c2;
    const y = Number(u);
    if (!Number.isFinite(y) || Math.abs(y) < 1e-6) return 0;
    const m = g.losa !== false, v = g.vigaBorde !== false, E = g.lados === "afuera" ? "afuera" : "ambos", k = r.points.rawVal, M = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], $ = [];
    if ([...Ue].forEach((j) => {
      if (j.startsWith("seg:")) {
        const O = j.split(":"), z = +O[1], V = +O[2], H = M[z] || [], ee = H[V], Z = H[V + 1];
        ee != null && Z != null && $.push([ee, Z]);
      } else if (j.startsWith("poly:")) {
        const O = M[+j.slice(5)] || [];
        for (let z = 0; z + 1 < O.length; z++) $.push([O[z], O[z + 1]]);
      }
    }), !$.length) return 0;
    let I = 0, T = 0;
    for (const j of k) I += j[0], T += j[1];
    I /= Math.max(1, k.length), T /= Math.max(1, k.length), Et();
    const N = [...k];
    let F = M.slice();
    F.length && F[F.length - 1].length === 0 && (F = F.slice(0, -1));
    const L = [...((_b = r.areas) == null ? void 0 : _b.rawVal) ?? []];
    let Y = 0;
    for (const [j, O] of $) {
      const z = k[j], V = k[O];
      if (!z || !V) continue;
      const H = V[0] - z[0], ee = V[1] - z[1], Z = Math.hypot(H, ee);
      if (Z < 1e-6) continue;
      let J = -ee / Z, se = H / Z;
      const oe = (z[0] + V[0]) / 2, ie = (z[1] + V[1]) / 2;
      (oe - I) * J + (ie - T) * se < 0 && (J = -J, se = -se);
      const de = E === "ambos" ? [1, -1] : [1];
      for (const me of de) {
        const ke = J * y * me, Ae = se * y * me, nt = N.length;
        N.push([z[0] + ke, z[1] + Ae, z[2]]);
        const je = N.length;
        N.push([V[0] + ke, V[1] + Ae, V[2]]), F.push([j, nt]), F.push([O, je]), v && F.push([nt, je]), m && (L.push(F.length), F.push([j, O, je, nt, j])), Y++;
      }
    }
    if (!Y) return 0;
    F.push([]), r.points.val = N, r.polylines && (r.polylines.val = F), r.areas && (r.areas.val = L);
    try {
      (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
    } catch {
    }
    return l(), Y;
  }, a.addEventListener("click", (u) => {
    var _a3, _b;
    if (window.__hekatanCursorPx = { x: u.clientX, y: u.clientY }, qs > 5) {
      qs = 0;
      return;
    }
    qs = 0;
    const g = p(u);
    if (!g) return;
    c.setFromCamera(h, g);
    const y = !!(Xt && Math.abs(u.clientX - Xt.x) <= 3 && Math.abs(u.clientY - Xt.y) <= 3), m = y ? [{ point: Xt.p.clone(), distance: g.position.distanceTo(Xt.p) }] : Me();
    if (!m.length) return;
    if (!y) {
      const E = g.position.distanceTo(i.target) || 1, k = m[0].distance ?? g.position.distanceTo(m[0].point), M = m[0].point;
      if (!isFinite(M.x) || !isFinite(M.y) || !isFinite(M.z) || k > Math.max(E * 12, 300)) {
        we("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
        return;
      }
    }
    let v = m[0].point;
    (u.ctrlKey || u.metaKey) && (v = new te(Math.round(m[0].point.x), Math.round(m[0].point.y), Math.round(m[0].point.z)));
    {
      const E = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], k = E[E.length - 1] ?? [], M = r.points.rawVal ?? [];
      if (k.length > 0) {
        const $ = M[k[k.length - 1]];
        if ($) {
          const I = !!window.__hekatanOrthoMode;
          let T = zt;
          if (!T && I) {
            const N = Math.abs(v.x - $[0]), F = Math.abs(v.y - $[1]), L = Math.abs(v.z - $[2]);
            T = N >= F && N >= L ? "x" : F >= L ? "y" : "z";
          }
          T === "x" ? v = new te(v.x, $[1], $[2]) : T === "y" ? v = new te($[0], v.y, $[2]) : T === "z" && (v = new te($[0], $[1], v.z));
        }
      }
    }
    if (Xt && Math.abs(u.clientX - Xt.x) <= 3 && Math.abs(u.clientY - Xt.y) <= 3) v = Xt.p.clone();
    else if (ji) v = ji.clone(), we(`\u{1F4D0} Eje \u2192 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`);
    else {
      const E = Nn(v), k = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, v.x, v.y, v.z, E, { x: u.clientX, y: u.clientY });
      if (k) v = new te(k.x, k.y, k.z), we(`\u{1F3AF} Snap [${k.type.toUpperCase()}] \u2192 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`);
      else {
        const M = window.__hekatanSnapEnabled !== false, $ = window.__hekatanSnap2D ?? 0;
        M && $ > 0 && (v = new te(Math.round(v.x / $) * $, Math.round(v.y / $) * $, Math.round(v.z / $) * $));
      }
    }
    Go(v, u);
  });
  const Go = (u, g) => {
    var _a3, _b, _c2, _d, _e2, _f, _g, _h, _i2, _j, _k, _l, _m, _n2, _o2, _p, _q, _r2, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
    const y = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select";
    if (y === "select" || y === "none" || !y) {
      if (xs) {
        ts && on();
        const { kind: k, a: M, b: $ } = xs, I = $ !== void 0 ? `${k}:${M}:${$}` : `${k}:${M}`;
        !!g && (g.ctrlKey || g.metaKey || g.shiftKey) || Ue.clear(), Ue.has(I) ? Ue.delete(I) : Ue.add(I), ls(), we(`\u2713 Seleccionados ${Ue.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
      } else {
        const k = !!g && (g.ctrlKey || g.metaKey || g.shiftKey), M = (g == null ? void 0 : g.clientX) ?? 0, $ = (g == null ? void 0 : g.clientY) ?? 0;
        ts ? (Oo(ts.x, ts.y, M, $, k), ts = null) : k || (ts = { x: M, y: $ }, we("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Vn(M, $, M + 1, $ + 1, false));
      }
      return;
    }
    if (y === "axis") {
      const k = window.__hekatanAxisDraw;
      if (!k) return;
      if (!k.pendingStart) {
        k.pendingStart = [u.x, u.y, u.z], we(`\u{1F4CD} Eje \u2014 click 1 OK en (${u.x.toFixed(2)}, ${u.y.toFixed(2)}, ${u.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      const M = k.mode === "number", $ = (_d = window.__hekatanAxisCommit) == null ? void 0 : _d.call(window, k.pendingStart, [u.x, u.y, u.z], M);
      we(`\u2713 Eje "${$}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }
    if (y === "move" || y === "copy") {
      Ko(y, [u.x, u.y, u.z]);
      return;
    }
    if (y === "delete") {
      if (Is >= 0) {
        const k = window.__hekatanDrawingAuxLines, M = (k == null ? void 0 : k.rawVal) ?? (k == null ? void 0 : k.val) ?? k ?? [], $ = Is;
        if ($ >= 0 && $ < M.length) {
          Et();
          const I = M.slice(0, $).concat(M.slice($ + 1));
          k && typeof k == "object" && "val" in k ? k.val = I : window.__hekatanDrawingAuxLines = I, we(`\u{1F5D1} L\xEDnea auxiliar #${$ + 1} borrada`), Is = -1, Qt.visible = false;
          try {
            (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
          } catch {
          }
        }
      } else if (ms >= 0) {
        const k = ms, M = zs;
        ((_g = (_f = r.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(k)) ?? false ? (Ji(k), we(`\u{1F5D1} \xC1rea #${k + 1} (shell Q4) borrada`)) : M >= 0 ? (To(k, M), we(`\u{1F5D1} Segmento ${M + 1} de polil\xEDnea #${k + 1} borrado`)) : (Ji(k), we(`\u{1F5D1} Polil\xEDnea #${k + 1} borrada`));
      } else we("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
      return;
    }
    if (y === "circle") {
      if (qe.push([u.x, u.y, u.z]), qe.length === 1) {
        we("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
        return;
      }
      const [k, M] = qe, $ = Math.hypot(M[0] - k[0], M[1] - k[1], M[2] - k[2]), I = Math.abs(M[0] - k[0]), T = Math.abs(M[1] - k[1]), N = Math.abs(M[2] - k[2]), F = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), Y = (F === "xy" ? N < 1e-3 : F === "xz" ? T < 1e-3 : F === "yz" ? I < 1e-3 : false) ? F : N < 1e-3 ? "xy" : T < 1e-3 ? "xz" : "yz", j = window.__hekatanArcSegs ?? 12;
      (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, k[0], k[1], k[2], $, j, Y), we(`\u2713 C\xEDrculo dibujado en ${Y.toUpperCase()} \u2014 r=${$.toFixed(2)}m, ${j} segmentos`), qe = [];
      try {
        (_l = window.__hekatanRebuild) == null ? void 0 : _l.call(window);
      } catch {
      }
      return;
    }
    if (y === "ifcface") {
      if (!Q) {
        we("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
        return;
      }
      if (!Q.plana) {
        we("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
        return;
      }
      const k = R(Q.m), M = be(k, Q.tris);
      if (M.length < 3) {
        we("\u25A6 No se pudo cerrar el contorno de la cara.");
        return;
      }
      const $ = Q.normal.clone(), I = le(Q.m, Q.punto, $);
      let T = String(window.__hekatanIfcCaraPos ?? "auto"), N = false;
      try {
        const H = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
        N = Math.round((H == null ? void 0 : H.matShell) ?? 0) === 1;
      } catch {
      }
      T === "auto" && (T = Math.abs($.z) > 0.5 ? N ? "interior" : "exterior" : "media");
      const F = I ?? 0.2, L = T === "exterior" ? 0 : T === "interior" ? F : F / 2, Y = M.map((H) => H.clone().addScaledVector($, -L));
      Et(), lt = Y.map((H) => [H.x, H.y, H.z]);
      const j = sn();
      try {
        const H = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
        H && I && (H.tShell = Math.round(I * 100) / 100);
      } catch {
      }
      const O = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let z = "la de \xABSecci\xF3n shells\xBB";
      try {
        const H = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
        H && H.formaPlaca != null && (z = O[Math.round(H.formaPlaca)] ?? z);
      } catch {
      }
      const V = T === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : T === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + F.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (F / 2).toFixed(2) + " m hacia dentro)";
      we(`\u25A6 \xC1rea desde la cara del IFC: ${M.length} v\xE9rtices, ${j} shell(s). Espesor medido ${I ? I.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${V}; formulaci\xF3n ${z}, t = ${F.toFixed(2)} m.`), pe(null, -1, null);
      try {
        (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
      } catch {
      }
      l();
      return;
    }
    if (y === "ifcline") {
      if (!P || P.length < 2) {
        we("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
        return;
      }
      const k = K(P);
      Et();
      const M = r.points.rawVal, $ = [], I = [];
      for (const N of k) {
        let F = M.findIndex((L) => Math.abs(L[0] - N[0]) < 1e-3 && Math.abs(L[1] - N[1]) < 1e-3 && Math.abs(L[2] - N[2]) < 1e-3);
        F < 0 && (F = M.length + I.length, I.push(N)), $.push(F);
      }
      if (r.points.val = [...M, ...I], r.polylines) {
        const N = r.polylines.rawVal, F = N.length && N[N.length - 1].length === 0 ? N.slice(0, -1) : N;
        r.polylines.val = [...F, $, []];
      }
      const T = P.reduce((N, F, L) => L ? N + F.distanceTo(P[L - 1]) : 0, 0);
      we(`\u27CB L\xEDnea del IFC copiada: ${k.length - 1} tramo(s), ${T.toFixed(2)} m de desarrollo.`), U(null);
      try {
        (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
      } catch {
      }
      l();
      return;
    }
    if (y === "arc") {
      if (qe.push([u.x, u.y, u.z]), qe.length === 1) {
        we("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
        return;
      }
      if (qe.length === 2) {
        we("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
        return;
      }
      const [k, M, $] = qe, I = window.__hekatanArcSegs ?? 12;
      (_r2 = window.__hekatanDrawArc) == null ? void 0 : _r2.call(window, k, M, $, I), we(`\u2713 Arco dibujado \u2014 ${I} segmentos`), qe = [];
      try {
        (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
      } catch {
      }
      return;
    }
    if (y === "parabola" || y === "cubica") {
      const k = y === "parabola" ? 3 : 4, M = y === "parabola" ? "Par\xE1bola" : "C\xFAbica";
      if (qe.push([u.x, u.y, u.z]), qe.length < k) {
        we(`\u223F ${M} \u2014 punto ${qe.length}/${k} OK. Marc\xE1 el ${qe.length + 1}\xBA.`);
        return;
      }
      const $ = window.__hekatanArcSegs ?? 12, I = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, qe.slice(), $);
      if (!(I == null ? void 0 : I.ok)) {
        we(`\u26A0 ${M}: ${(I == null ? void 0 : I.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), qe = [];
        return;
      }
      const T = "xyz"[I.ia ?? 0], N = "xyz"[I.io ?? 2], F = (I.coef ?? []).map((L, Y) => `${L >= 0 && Y ? "+" : ""}${L.toFixed(3)}${Y ? "\xB7" + T + (Y > 1 ? "^" + Y : "") : ""}`).join(" ");
      we(`\u2713 ${M} dibujada en ${String(I.plano ?? "").toUpperCase()} \u2014 ${$} tramos a \u0394 igual de ${T} \xB7 ${N} = ${F}`), qe = [];
      try {
        (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
      } catch {
      }
      return;
    }
    if (y === "revolve") {
      const k = Math.round(window.__hekatanRevSectores ?? 16), M = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, u.x, u.y, k, 360);
      if (M == null ? void 0 : M.msg) {
        we(`\u26A0 Revoluci\xF3n: ${M.msg}.`);
        return;
      }
      we(`\u2713 Revoluci\xF3n: ${M.anillos} anillo(s) \xD7 ${k} sectores \u2192 ${M.areas} pa\xF1o(s) Q4${M.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${u.x.toFixed(2)}, ${u.y.toFixed(2)}).${M.guias ? ` ${M.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
      } catch {
      }
      return;
    }
    if (y === "loft") {
      const k = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, u.x, u.y);
      if (k == null ? void 0 : k.msg) {
        we(`\u26A0 Barrido: ${k.msg}.`);
        return;
      }
      we(`\u2713 Barrido: contorno de ${k.contorno} lados \xD7 perfil de ${k.perfil} puntos \u2192 ${k.areas} pa\xF1o(s) Q4. Eje por (${u.x.toFixed(2)}, ${u.y.toFixed(2)}).${k.guias ? ` ${k.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
      try {
        (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
      } catch {
      }
      return;
    }
    if (y === "rect") {
      if (qe.push([u.x, u.y, u.z]), qe.length === 1) {
        we("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [k, M] = qe;
      (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, k, M), we(`\u2713 Rect\xE1ngulo dibujado \u2014 (${k[0].toFixed(1)},${k[1].toFixed(1)}) \u2192 (${M[0].toFixed(1)},${M[1].toFixed(1)})`), qe = [];
      try {
        (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
      } catch {
      }
      return;
    }
    if (y === "medir") {
      const M = (Xt && Math.abs(Xt.x - g.clientX) < 3 && Math.abs(Xt.y - g.clientY) < 3 ? [Xt.p.x, Xt.p.y, Xt.p.z] : null) ?? Wt(g);
      if (!M) return;
      if (Ke.length >= 2 && (Ke = []), Ke.push(M), Ke.length === 1) Tt.visible = false, Dt(), we("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
      else {
        const [$, I] = Ke;
        Tt.geometry.setFromPoints([new te($[0], $[1], $[2]), new te(I[0], I[1], I[2])]), Tt.visible = true;
        const T = Math.hypot(I[0] - $[0], I[1] - $[1], I[2] - $[2]), N = Math.hypot(I[0] - $[0], I[1] - $[1]);
        it.textContent = `${T.toFixed(3)} m`, Dt(), we(`\u{1F4CF} Distancia ${T.toFixed(3)} m  \xB7  \u0394x ${(I[0] - $[0]).toFixed(3)}  \u0394y ${(I[1] - $[1]).toFixed(3)}  \u0394z ${(I[2] - $[2]).toFixed(3)}  \xB7  en planta ${N.toFixed(3)} m`);
      }
      l();
      return;
    }
    if (y === "fillarea") {
      const k = r.points.rawVal, M = ((_B = r.polylines) == null ? void 0 : _B.rawVal) ?? [], $ = /* @__PURE__ */ new Map(), I = (oe, ie) => {
        oe !== ie && (($.get(oe) ?? $.set(oe, /* @__PURE__ */ new Set()).get(oe)).add(ie), ($.get(ie) ?? $.set(ie, /* @__PURE__ */ new Set()).get(ie)).add(oe));
      };
      for (const oe of M) for (let ie = 0; ie + 1 < oe.length; ie++) I(oe[ie], oe[ie + 1]);
      const T = (oe, ie) => {
        var _a4;
        return !!((_a4 = $.get(oe)) == null ? void 0 : _a4.has(ie));
      }, N = /* @__PURE__ */ new Set(), F = [], L = [...$.keys()];
      for (const oe of L) for (const ie of $.get(oe)) if (!(ie < oe)) {
        for (const de of $.get(ie)) if (de !== oe) for (const me of $.get(de)) {
          if (me === oe || me === ie || !T(me, oe) || T(oe, de) || T(ie, me)) continue;
          const ke = [oe, ie, de, me].slice().sort((Ae, nt) => Ae - nt).join("-");
          N.has(ke) || (N.add(ke), F.push([oe, ie, de, me]));
        }
      }
      for (const oe of L) for (const ie of $.get(oe)) if (!(ie < oe)) for (const de of $.get(ie)) {
        if (de === oe || !T(de, oe)) continue;
        const me = [oe, ie, de].slice().sort((ke, Ae) => ke - Ae).join("-");
        N.has(me) || (N.add(me), F.push([oe, ie, de]));
      }
      const Y = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", j = (oe) => Y === "xy" ? [oe[0], oe[1]] : Y === "xz" ? [oe[0], oe[2]] : [oe[1], oe[2]], O = j([u.x, u.y, u.z]), z = (oe, ie) => {
        let de = false;
        for (let me = 0, ke = ie.length - 1; me < ie.length; ke = me++) {
          const Ae = ie[me][0], nt = ie[me][1], je = ie[ke][0], et = ie[ke][1];
          nt > oe[1] != et > oe[1] && oe[0] < (je - Ae) * (oe[1] - nt) / (et - nt) + Ae && (de = !de);
        }
        return de;
      }, V = (oe) => {
        let ie = 0;
        for (let de = 0, me = oe.length - 1; de < oe.length; me = de++) ie += (oe[me][0] + oe[de][0]) * (oe[me][1] - oe[de][1]);
        return Math.abs(ie) / 2;
      };
      let H = null, ee = 1 / 0;
      for (const oe of F) {
        const ie = oe.map((me) => j(k[me]));
        if (!z(O, ie)) continue;
        const de = V(ie);
        de < ee && (ee = de, H = oe);
      }
      if (!H) {
        we("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
        return;
      }
      const Z = H.slice().sort((oe, ie) => oe - ie).join("-"), J = ((_F = r.areas) == null ? void 0 : _F.rawVal) ?? [];
      if (J.some((oe) => {
        const ie = M[oe] ?? [];
        return [...new Set(ie)].sort((de, me) => de - me).join("-") === Z;
      })) {
        we("\u25A6 Esa celda ya tiene \xE1rea.");
        return;
      }
      r.polylines.val = [...M, [...H, H[0]]], r.areas.val = [...J, M.length], we(`\u2713 \xC1rea creada por relleno (${H.length} lados).`);
      try {
        (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
      } catch {
      }
      return;
    }
    if (y === "rectarea") {
      if (qe.push([u.x, u.y, u.z]), qe.length === 1) {
        we("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [k, M] = qe;
      (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, k, M), we(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${k[0].toFixed(1)},${k[1].toFixed(1)}) \u2192 (${M[0].toFixed(1)},${M[1].toFixed(1)})`), qe = [];
      return;
    }
    if (y === "polyarea") {
      lt.push([u.x, u.y, u.z]), ht.geometry.setFromPoints(lt.map((k) => new te(k[0], k[1], k[2]))), ht.visible = lt.length >= 1, we(`\u25B0 \xC1rea libre \u2014 ${lt.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), l();
      return;
    }
    if (y === "plane3") {
      if (qe.push([u.x, u.y, u.z]), qe.length < 3) {
        we(`\u25E3 Plano inclinado \u2014 punto ${qe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
        return;
      }
      const [k, M, $] = qe, I = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, k, M, $);
      we(I ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), qe = [];
      return;
    }
    if (y === "col") {
      Et();
      const k = u.z, M = It && It > 0 ? It : 3;
      r.points.val = [...r.points.rawVal, [u.x, u.y, k], [u.x, u.y, k + M]];
      const $ = r.polylines.rawVal, I = r.points.rawVal.length;
      r.polylines.val = [...$.slice(0, -1), ...$[$.length - 1].length > 0 ? [$[$.length - 1]] : [], [I - 2, I - 1], []], It = 0, we(`\u258C Columna creada \u2014 h=${M.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
      try {
        (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
      } catch {
      }
      return;
    }
    if (y === "wall") {
      if (qe.push([u.x, u.y, u.z]), qe.length === 1) {
        we("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
        return;
      }
      const [k, M] = qe, $ = It && It > 0 ? It : 3;
      Et();
      const I = r.points.rawVal.length;
      r.points.val = [...r.points.rawVal, [k[0], k[1], k[2]], [M[0], M[1], M[2]], [M[0], M[1], M[2] + $], [k[0], k[1], k[2] + $]];
      const T = r.polylines.rawVal;
      if (T.length - 1, r.polylines.val = [...T.slice(0, -1), ...T[T.length - 1].length > 0 ? [T[T.length - 1]] : [], [I, I + 1, I + 2, I + 3, I], []], r.areas) {
        const N = r.polylines.rawVal.length - 2;
        r.areas.val = [...r.areas.rawVal, N];
      }
      we(`\u25A5 Pared Q4 creada \u2014 h=${$.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), qe = [], It = 0;
      try {
        (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
      } catch {
      }
      return;
    }
    if (y === "extp") {
      Et();
      const k = It && It > 0 ? It : 3, M = u.z;
      r.points.val = [...r.points.rawVal, [u.x, u.y, M], [u.x, u.y, M + k]];
      const $ = r.polylines.rawVal, I = r.points.rawVal.length;
      r.polylines.val = [...$.slice(0, -1), ...$[$.length - 1].length > 0 ? [$[$.length - 1]] : [], [I - 2, I - 1], []], It = 0, we(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${k.toFixed(2)}m`);
      try {
        (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
      } catch {
      }
      return;
    }
    if (y === "extl") {
      const k = (window.__hekatanSnap2D ?? 0.5) * 1.5, M = Pn(u.x, u.y, u.z, k);
      if (!M) {
        we("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
        return;
      }
      const $ = r.polylines.rawVal, I = r.points.rawVal, T = $[M.polyIdx], N = I[T[M.segIdx]], F = I[T[M.segIdx + 1]];
      if (!N || !F) {
        we("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
        return;
      }
      const L = It && It > 0 ? It : 3;
      Et();
      const Y = r.points.rawVal.length;
      r.points.val = [...r.points.rawVal, [N[0], N[1], N[2]], [F[0], F[1], F[2]], [F[0], F[1], F[2] + L], [N[0], N[1], N[2] + L]];
      const j = r.polylines.rawVal;
      if (r.polylines.val = [...j.slice(0, -1), ...j[j.length - 1].length > 0 ? [j[j.length - 1]] : [], [Y, Y + 1, Y + 2, Y + 3, Y], []], r.areas) {
        const O = r.polylines.rawVal.length - 2;
        r.areas.val = [...r.areas.rawVal, O];
      }
      It = 0, we(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${L.toFixed(2)}m`);
      try {
        (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
      } catch {
      }
      return;
    }
    if (y === "auxp") {
      const k = window.__hekatanDrawingAuxPoints;
      if (k) {
        const M = k.rawVal ?? k.val ?? [];
        k.val = [...M, [u.x, u.y, u.z]];
      }
      we(`\u2726 Punto auxiliar agregado en (${u.x.toFixed(2)}, ${u.y.toFixed(2)}, ${u.z.toFixed(2)})`);
      return;
    }
    if (y === "aux") {
      if (qe.push([u.x, u.y, u.z]), qe.length === 1) {
        we("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
        return;
      }
      const [k, M] = qe, $ = window.__hekatanDrawingAuxLines;
      if ($) {
        Et();
        const L = $.rawVal ?? $.val ?? [];
        $.val = [...L, [k[0], k[1], k[2], M[0], M[1], M[2]]];
      }
      const I = M[0] - k[0], T = M[1] - k[1], N = M[2] - k[2], F = Math.sqrt(I * I + T * T + N * N);
      we(`\u2713 L\xEDnea auxiliar creada \u2014 L=${F.toFixed(2)}m (cyan, no FEM)`), qe = [];
      return;
    }
    if (y === "extend" || y === "trim" || y === "offset") {
      yl(y, [u.x, u.y, u.z]);
      return;
    }
    if (y === "chaflan") {
      if (qe.push([u.x, u.y, u.z]), qe.length === 1) {
        we("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
        return;
      }
      const [k, M] = qe, $ = window.__hekatanChaflanR ?? 1, I = Math.max(3, window.__hekatanArcSegs ?? 6);
      (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, k, M, $, I, 6);
      const T = Math.abs(M[0] - k[0]).toFixed(1), N = Math.abs(M[1] - k[1]).toFixed(1);
      we(`\u2713 Losa con chaflanes dibujada \u2014 ${T}\xD7${N}m, r=${$}m, ${I} seg/chafl\xE1n`), qe = [];
      try {
        (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
      } catch {
      }
      return;
    }
    $e = false, Et();
    const m = u.toArray(), v = r.points.rawVal;
    let E = v.findIndex((k) => Math.abs(k[0] - m[0]) < 1e-3 && Math.abs(k[1] - m[1]) < 1e-3 && Math.abs(k[2] - m[2]) < 1e-3);
    if (E < 0 && (r.points.val = [...v, m], E = r.points.rawVal.length - 1), r.polylines && y !== "node") {
      const k = r.polylines.rawVal, M = k.length ? k[k.length - 1] : [];
      M.length && M[M.length - 1] === E ? r.polylines.val = [...k, [E]] : r.polylines.val = [...k.slice(0, -1), [...M, E]];
    }
    if (r.polylines) {
      const k = r.polylines.rawVal, M = k.length - 1, $ = k[M] ?? [];
      if (y === "line" && $.length >= 2) {
        we(`\uFF0F L\xEDnea \u2014 ${$.length - 1} tramo${$.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
        try {
          (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
        } catch {
        }
        return;
      }
      if (y === "area" && $.length === 4) {
        r.polylines.val = [...k.slice(0, -1), [...$, $[0]], []], r.areas && (r.areas.val = [...r.areas.rawVal, M]), we("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
        try {
          (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
        } catch {
        }
        return;
      }
    }
    if (y === "node") we(`\u25CF Nodo creado en (${u.x.toFixed(2)}, ${u.y.toFixed(2)}, ${u.z.toFixed(2)})`);
    else if (y === "line") we("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
    else if (y === "polyline") we("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
    else if (y === "area") {
      const k = ((_R = r.polylines) == null ? void 0 : _R.rawVal[r.polylines.rawVal.length - 1]) ?? [];
      we(`\u25A6 \xC1rea \u2014 click ${k.length}/4. Marc\xE1 ${4 - k.length} v\xE9rtice${4 - k.length === 1 ? "" : "s"} m\xE1s.`);
    }
  };
  a.addEventListener("click", () => ss()), a.addEventListener("contextmenu", (u) => {
    var _a3, _b, _c2;
    if (((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) === "polyarea" && lt.length >= 3) {
      u.preventDefault();
      const y = sn();
      we(`\u2713 \xC1rea libre mallada \u2014 ${y} shells Q4 creados.`);
      return;
    }
    !r.polylines || r.polylines.rawVal[r.polylines.rawVal.length - 1].length === 0 || (r.polylines.val = [...r.polylines.rawVal, []]);
  }), a.addEventListener("pointermove", (u) => {
    var _a3, _b;
    const g = p(u);
    if (!g) return;
    c.setFromCamera(h, g);
    const y = Me();
    if (Ne.geometry.deleteAttribute("position"), y.length) {
      let m = y[0].point.clone();
      (u.ctrlKey || u.metaKey) && m.set(Math.round(m.x), Math.round(m.y), Math.round(m.z));
      {
        const k = ((_a3 = r.polylines) == null ? void 0 : _a3.rawVal) ?? [], M = k[k.length - 1] ?? [], $ = r.points.rawVal ?? [];
        if (M.length > 0) {
          const I = $[M[M.length - 1]];
          if (I) {
            const T = !!window.__hekatanOrthoMode;
            let N = zt;
            if (!N && T) {
              const F = Math.abs(m.x - I[0]), L = Math.abs(m.y - I[1]), Y = Math.abs(m.z - I[2]);
              N = F >= L && F >= Y ? "x" : L >= Y ? "y" : "z";
            }
            N === "x" ? m.set(m.x, I[1], I[2]) : N === "y" ? m.set(I[0], m.y, I[2]) : N === "z" && m.set(I[0], I[1], m.z);
          }
        }
      }
      const v = Nn(m), E = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, m.x, m.y, m.z, v, { x: u.clientX, y: u.clientY });
      if (E) m.set(E.x, E.y, E.z);
      else {
        const k = window.__hekatanSnapEnabled !== false, M = window.__hekatanSnap2D ?? 0.5;
        k && M > 0 && (m.x = Math.round(m.x / M) * M, m.y = Math.round(m.y / M) * M, m.z = Math.round(m.z / M) * M);
      }
      Ne.geometry.setAttribute("position", new Mt(m.toArray(), 3));
    }
    l();
  }), a.addEventListener("pointermove", (u) => {
    var _a3;
    const g = p(u);
    if (!g) return;
    c.setFromCamera(h, g);
    let y = false;
    const m = c.intersectObject(Ie), v = Me();
    if (m.length && v.length) {
      const E = new te(...r.points.rawVal[m[0].index]), k = new te(...v[0].point), M = E.sub(k), $ = (_a3 = v[0].face) == null ? void 0 : _a3.normal;
      $.transformDirection(f.matrixWorld), Math.abs(M.dot($)) < 1e-4 && (y = true);
    }
    Ne.visible = !y;
  });
  let Wn = false, Zn;
  a.addEventListener("pointermove", (u) => {
    var _a3;
    if (!qs) return;
    const g = p(u);
    if (!g) return;
    c.setFromCamera(h, g);
    let y = false;
    const m = c.intersectObject(Ie), v = Me();
    if (m.length && v.length) {
      const k = new te(...r.points.rawVal[m[0].index]), M = new te(...v[0].point), $ = k.sub(M), I = (_a3 = v[0].face) == null ? void 0 : _a3.normal;
      I.transformDirection(f.matrixWorld), Math.abs($.dot(I)) < 1e-4 && (y = true);
    }
    if (y && qs < 5 && (Wn = true, i.enabled = false, Zn = m[0].index), !Wn || qs % 2 !== 0) return;
    const E = [...r.points.rawVal];
    if (Zn !== void 0) {
      let k = v[0].point;
      (u.ctrlKey || u.metaKey) && (k = new te(Math.round(k.x), Math.round(k.y), Math.round(k.z))), E[Zn] = k.toArray();
    }
    r.points.val = E;
  }), a.addEventListener("pointerup", () => {
    i.enabled = true, Wn = false;
  }), a.addEventListener("contextmenu", (u) => {
    var _a3;
    const g = p(u);
    if (!g) return;
    c.setFromCamera(h, g);
    let y = false;
    const m = c.intersectObject(Ie), v = Me();
    if (m.length && v.length) {
      const M = new te(...r.points.rawVal[m[0].index]), $ = new te(...v[0].point), I = M.sub($), T = (_a3 = v[0].face) == null ? void 0 : _a3.normal;
      T.transformDirection(f.matrixWorld), Math.abs(I.dot(T)) < 1e-4 && (y = true);
    }
    if (!y) return;
    const E = [...r.points.rawVal];
    if (E.splice(m[0].index, 1), r.points.val = E, !r.polylines) return;
    const k = r.polylines.rawVal.map((M) => M.filter(($) => $ !== m[0].index)).map((M) => M.map(($) => $ > m[0].index ? $ - 1 : $)).filter((M) => M.length);
    k.push([]), r.polylines.val = k;
  });
}
function gr(r, e, t) {
  const n = Math.round(14.999999999999998), o = { position: r.position.clone(), quaternion: r.quaternion.clone() }, a = setInterval(c, 1e3 / 30);
  let l = 0;
  function c() {
    l++;
    const h = l / n;
    r.position.lerpVectors(o.position, e.position, h), r.quaternion.slerpQuaternions(o.quaternion, e.quaternion, h), t && t(), l == n && clearInterval(a);
  }
}
function wr(r, e, t, s) {
  const i = Xl(t, r.elements, s);
  return xe.derive(() => {
    i.visible = e.shellResults.val != "none";
  }), i;
}
const yr = 6, ao = 10, xr = 0.012;
function br(r) {
  return r.startsWith("contour:") ? r.slice(8) : null;
}
function vr(r, e, t, s) {
  if (!t && !s) return null;
  if (["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"].includes(r) && t) {
    const n = t[r];
    if (n && n.has(e)) return n.get(e);
  }
  return null;
}
function _r(r, e, t, s) {
  const i = new ft(), n = new La();
  n.setColorMap("rainbow");
  const o = new $t(), a = xe.state([]);
  return xe.derive(() => {
    var _a2, _b, _c2;
    e.deformedShape.val;
    const l = t.val, c = ((_a2 = r.elements) == null ? void 0 : _a2.val) ?? [], h = br(e.frameResults.val);
    if (i.children.forEach((B) => {
      B.geometry && B.geometry.dispose(), B.material && B.material.dispose();
    }), i.clear(), !h || c.length === 0 || l.length === 0) {
      a.val = [];
      return;
    }
    const p = (_b = r.analyzeOutputs) == null ? void 0 : _b.val, f = (_c2 = r.deformOutputs) == null ? void 0 : _c2.val, x = [], b = [];
    for (let B = 0; B < c.length; B++) {
      if (c[B].length !== 2) continue;
      const re = vr(h, B, p, f);
      re && (x.push(re[0], re[1]), b.push({ idx: B, vals: re }));
    }
    if (x.length === 0) {
      a.val = [];
      return;
    }
    const C = Math.min(...x), _ = Math.max(...x);
    n.setMin(C), n.setMax(_), a.val = x;
    const S = [1 / 0, 1 / 0, 1 / 0], A = [-1 / 0, -1 / 0, -1 / 0];
    for (const B of l) for (let Q = 0; Q < 3; Q++) S[Q] = Math.min(S[Q], B[Q]), A[Q] = Math.max(A[Q], B[Q]);
    const X = Math.max(A[0] - S[0], A[1] - S[1], A[2] - S[2], 1) * xr, q = [], G = [], W = [];
    let U = 0;
    for (const { idx: B, vals: Q } of b) {
      const re = c[B], pe = l[re[0]], be = l[re[1]];
      if (!pe || !be) continue;
      const le = new te(be[0] - pe[0], be[1] - pe[1], be[2] - pe[2]), ne = le.length();
      if (ne < 1e-10) continue;
      le.normalize();
      const ae = Math.abs(le.y) < 0.99 ? new te(0, 1, 0) : new te(1, 0, 0), ue = new te().crossVectors(le, ae).normalize(), he = new te().crossVectors(le, ue).normalize(), Se = ao + 1, ve = yr;
      for (let Oe = 0; Oe < Se; Oe++) {
        const He = Oe / ao, dt = pe[0] + le.x * ne * He, wt = pe[1] + le.y * ne * He, Ce = pe[2] + le.z * ne * He, ce = Q[0] + (Q[1] - Q[0]) * He, _e = n.getColor(ce) ?? new $t(0, 0, 0);
        o.copy(_e).convertSRGBToLinear();
        for (let ge = 0; ge < ve; ge++) {
          const ye = ge / ve * Math.PI * 2, Le = Math.cos(ye), Te = Math.sin(ye);
          q.push(dt + (ue.x * Le + he.x * Te) * X, wt + (ue.y * Le + he.y * Te) * X, Ce + (ue.z * Le + he.z * Te) * X), G.push(o.r, o.g, o.b);
        }
      }
      for (let Oe = 0; Oe < ao; Oe++) for (let He = 0; He < ve; He++) {
        const dt = (He + 1) % ve, wt = U + Oe * ve + He, Ce = U + Oe * ve + dt, ce = U + (Oe + 1) * ve + He, _e = U + (Oe + 1) * ve + dt;
        W.push(wt, Ce, _e), W.push(wt, _e, ce);
      }
      U += Se * ve;
    }
    if (q.length === 0) return;
    const K = new ze();
    K.setAttribute("position", new Mt(q, 3)), K.setAttribute("color", new Mt(G, 3)), K.setIndex(W), K.computeVertexNormals();
    const D = new gt({ vertexColors: true, side: Pt }), R = new pt(K, D);
    R.frustumCulled = false, i.add(R);
  }), i.__colorMapValues = a, i;
}
function kr() {
  const r = window;
  return { forceUnit: r.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf", dispUnit: r.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm", stressUnit: r.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2" };
}
const Cr = { kN: 1, tonf: 1 / 9.80665, kip: 1 / 4.4482216 }, Sr = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402 }, Mr = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Ft(r, e = 4) {
  return r == null || !isFinite(r) ? "\u2014" : r === 0 ? "0" : Math.abs(r) < 1e-3 || Math.abs(r) > 1e5 ? r.toExponential(e) : r.toFixed(e);
}
const $r = 16755200, xa = 56831, Er = 56831, Ar = 56831, wn = 65382;
function Tr(r) {
  const e = new ft();
  e.name = "__hekatan_hover", e.renderOrder = 99;
  const t = new gi(1, 16, 16), s = new gt({ color: $r, transparent: true, opacity: 0.85, depthTest: false }), i = new pt(t, s);
  i.visible = false, i.renderOrder = 100, e.add(i);
  const n = new ze(), o = new mt({ color: xa, linewidth: 4, transparent: true, opacity: 0.9, depthTest: false }), a = new is(n, o);
  a.visible = false, a.renderOrder = 100, e.add(a);
  const l = new gt({ color: xa, transparent: true, opacity: 0.7, depthTest: false }), c = new pt(new ca(1, 1, 1, 12), l);
  c.visible = false, c.renderOrder = 100, e.add(c);
  const h = new ze(), p = new gt({ color: Er, transparent: true, opacity: 0.45, side: Pt, depthTest: false }), f = new pt(h, p);
  f.visible = false, f.renderOrder = 100, e.add(f);
  const x = new ze(), b = new mt({ color: Ar, linewidth: 3, transparent: true, opacity: 0.95, depthTest: false }), C = new is(x, b);
  C.visible = false, C.renderOrder = 100, e.add(C);
  const _ = new gt({ color: wn, transparent: true, opacity: 0.95, depthTest: false }), S = new gt({ color: wn, transparent: true, opacity: 0.85, depthTest: false }), A = new ca(1, 1, 1, 12), P = new gt({ color: wn, transparent: true, opacity: 0.55, side: Pt, depthTest: false }), X = new mt({ color: wn, linewidth: 4, transparent: true, opacity: 1, depthTest: false }), q = [];
  window.__hekatanModelSelection = q;
  const G = new ft();
  G.renderOrder = 101, e.add(G);
  const W = document.createElement("div");
  Object.assign(W.style, { position: "absolute", pointerEvents: "none", padding: "5px 9px", fontSize: "11px", fontFamily: "Consolas, 'Courier New', monospace", background: "rgba(0, 0, 0, 0.88)", color: "#ffd166", border: "1px solid rgba(255, 200, 80, 0.5)", borderRadius: "4px", whiteSpace: "pre-line", zIndex: "9999", display: "none", transform: "translate(12px, 12px)", lineHeight: "1.35", maxWidth: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }), W.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
    r.rendererElm.parentElement && r.rendererElm.parentElement.appendChild(W);
  }, 0);
  function U(Ce) {
    const ce = r.derivedNodes.rawVal;
    return !ce || Ce < 0 || Ce >= ce.length ? null : new te(ce[Ce][0], ce[Ce][1], ce[Ce][2]);
  }
  function K(Ce, ce) {
    var _a2, _b, _c2, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r2, _s2;
    const _e = r.getActiveCamera();
    if (!_e || !r.mesh) return null;
    const ge = r.rendererElm.getBoundingClientRect(), ye = Ce - ge.left, Le = ce - ge.top, Te = r.derivedNodes.rawVal, Me = (_a2 = r.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (!Te || !Me) return null;
    const Ie = /* @__PURE__ */ new Map(), Ne = (at) => {
      if (Ie.has(at)) return Ie.get(at);
      const Qe = U(at);
      if (!Qe) return Ie.set(at, null), null;
      const Fe = Qe.clone().project(_e), st = (Fe.x * 0.5 + 0.5) * ge.width, Re = (-Fe.y * 0.5 + 0.5) * ge.height, ht = { x: st, y: Re, z: Fe.z };
      return Ie.set(at, ht), ht;
    }, Ge = /* @__PURE__ */ new Set();
    for (const at of Me) if (at) for (const Qe of at) Ge.add(Qe);
    const Ee = 8;
    let tt = -1, Ye = Ee;
    for (let at = 0; at < Te.length; at++) {
      if (!Ge.has(at)) continue;
      const Qe = Ne(at);
      if (!Qe || Qe.z < -1 || Qe.z > 1) continue;
      const Fe = Qe.x - ye, st = Qe.y - Le, Re = Math.sqrt(Fe * Fe + st * st);
      Re < Ye && (Ye = Re, tt = at);
    }
    const Ze = kr(), $e = Sr[Ze.dispUnit] ?? 1e3, Ve = Cr[Ze.forceUnit] ?? 1;
    if (tt >= 0) {
      const at = Te[tt];
      let Qe = `Nodo ${tt}
(${at[0].toFixed(3)}, ${at[1].toFixed(3)}, ${at[2].toFixed(3)})`;
      const Fe = (_c2 = (_b = r.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c2.rawVal;
      if (Fe == null ? void 0 : Fe.deformations) {
        const st = Fe.deformations.get(tt);
        if (st && (Qe += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, Qe += `
Ux = ${Ft(st[0] * $e, 3)} ${Ze.dispUnit}`, Qe += `
Uy = ${Ft(st[1] * $e, 3)} ${Ze.dispUnit}`, Qe += `
Uz = ${Ft(st[2] * $e, 3)} ${Ze.dispUnit}`, (Math.abs(st[3]) > 1e-9 || Math.abs(st[4]) > 1e-9 || Math.abs(st[5]) > 1e-9) && (Qe += `
Rx = ${Ft(st[3] * 1e3, 3)} mrad`, Qe += `
Ry = ${Ft(st[4] * 1e3, 3)} mrad`, Qe += `
Rz = ${Ft(st[5] * 1e3, 3)} mrad`)), Fe.reactions) {
          const Re = Fe.reactions.get(tt);
          Re && (Math.abs(Re[0]) > 1e-9 || Math.abs(Re[1]) > 1e-9 || Math.abs(Re[2]) > 1e-9 || Math.abs(Re[3]) > 1e-6 || Math.abs(Re[4]) > 1e-6 || Math.abs(Re[5]) > 1e-6) && (Qe += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, Qe += `
Fx = ${Ft(Re[0] * Ve)} ${Ze.forceUnit}`, Qe += `
Fy = ${Ft(Re[1] * Ve)} ${Ze.forceUnit}`, Qe += `
Fz = ${Ft(Re[2] * Ve)} ${Ze.forceUnit}`, (Math.abs(Re[3]) > 1e-6 || Math.abs(Re[4]) > 1e-6 || Math.abs(Re[5]) > 1e-6) && (Qe += `
Mx = ${Ft(Re[3] * Ve)} ${Ze.forceUnit}\xB7m`, Qe += `
My = ${Ft(Re[4] * Ve)} ${Ze.forceUnit}\xB7m`, Qe += `
Mz = ${Ft(Re[5] * Ve)} ${Ze.forceUnit}\xB7m`));
        }
      }
      return { type: "node", idx: tt, info: Qe };
    }
    const Rt = 5;
    let ot = -1, At = Rt, jt = "frame";
    for (let at = 0; at < Me.length; at++) {
      const Qe = Me[at];
      if (!(!Qe || Qe.length < 2)) {
        if (Qe.length === 2) {
          const Fe = Ne(Qe[0]), st = Ne(Qe[1]);
          if (!Fe || !st || Fe.z < -1 || Fe.z > 1 || st.z < -1 || st.z > 1) continue;
          const Re = zr(ye, Le, Fe.x, Fe.y, st.x, st.y);
          Re < At && (At = Re, ot = at, jt = "frame");
        } else if (Qe.length === 3 || Qe.length === 4) {
          const Fe = [];
          let st = true;
          for (const Re of Qe) {
            const ht = Ne(Re);
            if (!ht || ht.z < -1 || ht.z > 1) {
              st = false;
              break;
            }
            Fe.push(ht);
          }
          if (!st) continue;
          if (Ir(ye, Le, Fe)) {
            const ht = Fe.reduce((lt, Tt) => lt + Tt.z, 0) / Fe.length * 1e-3;
            ht < At && (At = ht, ot = at, jt = "shell");
          }
        } else if (Qe.length === 8) {
          const Fe = [];
          let st = true;
          for (const Ke of Qe) {
            const it = Ne(Ke);
            if (!it || it.z < -1 || it.z > 1) {
              st = false;
              break;
            }
            Fe.push(it);
          }
          if (!st) continue;
          const Re = Math.min(...Fe.map((Ke) => Ke.x)), ht = Math.max(...Fe.map((Ke) => Ke.x)), lt = Math.min(...Fe.map((Ke) => Ke.y)), Tt = Math.max(...Fe.map((Ke) => Ke.y));
          if (ye >= Re && ye <= ht && Le >= lt && Le <= Tt) {
            const it = Fe.reduce((Wt, Dt) => Wt + Dt.z, 0) / Fe.length * 1e-3;
            it < At && (At = it, ot = at, jt = "solid");
          }
        }
      }
    }
    if (ot >= 0) {
      const at = Me[ot];
      let Fe = `${jt === "frame" ? "Frame" : jt === "shell" ? "Shell" : "Solid"} ${ot}`;
      const st = (_e2 = (_d = r.mesh) == null ? void 0 : _d.elementInputs) == null ? void 0 : _e2.rawVal, Re = (_g = (_f = st == null ? void 0 : st.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, ot);
      if (Re) {
        Re.name && (Fe += `
  \u{1F4CB} ${Re.name}`), Re.shape && (Fe += `
  Shape: ${Re.shape}`);
        const ht = /concrete|hormig|rect.*sólida/i.test(Re.shape || ""), lt = ht ? 100 : 1e3, Tt = ht ? "cm" : "mm", Ke = (Wt) => {
          const Dt = Wt * lt;
          return Math.abs(Dt - Math.round(Dt)) < 0.05 ? `${Math.round(Dt)}` : `${Dt.toFixed(1)}`;
        }, it = [];
        if (Re.D != null && it.push(`D=${Ke(Re.D)}`), Re.B != null && it.push(`B=${Ke(Re.B)}`), Re.TF != null && it.push(`TF=${Ke(Re.TF)}`), Re.TW != null && it.push(`TW=${Ke(Re.TW)}`), Re.t != null && it.push(`t=${Ke(Re.t)}`), it.length && (Fe += `
  Dim: ${it.join(" ")} ${Tt}`), Re.material) {
          let Wt = Re.material;
          Re.fillMaterial && (Wt += ` + FILL "${Re.fillMaterial}"`), Fe += `
  Mat: ${Wt}`;
        }
      } else {
        const ht = (_i = (_h = st == null ? void 0 : st.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i.call(_h, ot), lt = (_k = (_j = st == null ? void 0 : st.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, ot);
        ht ? (Fe += `
  ${ht}`, lt && !ht.includes(lt) && (Fe += `  (${lt})`)) : lt && (Fe += `
  Material: ${lt}`);
      }
      if (Fe += `
nodos: [${at.join(", ")}]`, jt === "shell" && ((_l = r.mesh) == null ? void 0 : _l.analyzeOutputs)) {
        const ht = r.mesh.analyzeOutputs.rawVal, lt = Mr[Ze.stressUnit] ?? 1, Tt = [["bendingXX", "Mxx", Ve, `${Ze.forceUnit}\xB7m/m`], ["bendingYY", "Myy", Ve, `${Ze.forceUnit}\xB7m/m`], ["bendingXY", "Mxy", Ve, `${Ze.forceUnit}\xB7m/m`], ["membraneXX", "Nxx", Ve, `${Ze.forceUnit}/m`], ["membraneYY", "Nyy", Ve, `${Ze.forceUnit}/m`], ["membraneXY", "Nxy", Ve, `${Ze.forceUnit}/m`], ["shearX", "Qx", Ve, `${Ze.forceUnit}/m`], ["shearY", "Qy", Ve, `${Ze.forceUnit}/m`], ["vonMises", "\u03C3VM", lt, Ze.stressUnit], ["pressure", "p", lt, Ze.stressUnit]], Ke = [];
        for (const [it, Wt, Dt, _t] of Tt) {
          const ks = ht == null ? void 0 : ht[it];
          if (ks && ks instanceof Map) {
            const Lt = ks.get(ot);
            if (Lt != null) {
              if (typeof Lt == "number") Ke.push(`${Wt} = ${Ft(Lt * Dt, 3)} ${_t}`);
              else if (Array.isArray(Lt)) {
                let Ht = Lt[0];
                for (const Cs of Lt) Math.abs(Cs) > Math.abs(Ht) && (Ht = Cs);
                Ke.push(`${Wt} = ${Ft(Ht * Dt, 3)} ${_t}`);
              }
            }
          }
        }
        Ke.length > 0 && (Fe += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ke.slice(0, 8).join(`
`));
      }
      if (jt === "frame" && ((_m = r.mesh) == null ? void 0 : _m.deformOutputs) && r.mesh.elementInputs) {
        const ht = r.mesh.deformOutputs.rawVal, lt = r.mesh.elementInputs.rawVal, Tt = ht == null ? void 0 : ht.deformations;
        if (Tt && at.length === 2) {
          const Ke = Tt.get(at[0]), it = Tt.get(at[1]), Wt = Te[at[0]], Dt = Te[at[1]];
          if (Ke && it && Wt && Dt) {
            const _t = Dt[0] - Wt[0], ks = Dt[1] - Wt[1], Lt = Dt[2] - Wt[2], Ht = Math.sqrt(_t * _t + ks * ks + Lt * Lt);
            if (Ht > 1e-9) {
              const Cs = _t / Ht, Bs = ks / Ht, qi = Lt / Ht, Zt = (it[0] - Ke[0]) * Cs + (it[1] - Ke[1]) * Bs + (it[2] - Ke[2]) * qi, Ss = ((_n2 = lt.elasticities) == null ? void 0 : _n2.get(ot)) ?? 0, Hs = ((_o2 = lt.areas) == null ? void 0 : _o2.get(ot)) ?? 0, Xs = ((_p = lt.momentsOfInertiaY) == null ? void 0 : _p.get(ot)) ?? 0, Ys = ((_q = lt.momentsOfInertiaZ) == null ? void 0 : _q.get(ot)) ?? 0, vi = ((_r2 = lt.torsionalConstants) == null ? void 0 : _r2.get(ot)) ?? 0, Fn = ((_s2 = lt.shearModuli) == null ? void 0 : _s2.get(ot)) ?? Ss / 2.6, Kt = Ss * Hs * (Zt / Ht), _i2 = (it[3] - Ke[3]) * Cs + (it[4] - Ke[4]) * Bs + (it[5] - Ke[5]) * qi, Us = Fn * vi * (_i2 / Ht), oi = it[4] - Ke[4], ai = it[5] - Ke[5], us = Ss * Xs * oi / Ht, li = Ss * Ys * ai / Ht;
              Fe += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Fe += `
L = ${Ft(Ht, 3)} m`, Fe += `
\u0394L = ${Ft(Zt * $e, 3)} ${Ze.dispUnit}`, Fe += `
\u03B5 = ${Ft(Zt / Ht, 6)}`, Math.abs(Kt) > 1e-6 && (Fe += `
N \u2248 ${Ft(Kt * Ve)} ${Ze.forceUnit}`), Math.abs(Us) > 1e-6 && (Fe += `
T \u2248 ${Ft(Us * Ve)} ${Ze.forceUnit}\xB7m`), Math.abs(us) > 1e-6 && (Fe += `
My \u2248 ${Ft(us * Ve)} ${Ze.forceUnit}\xB7m`), Math.abs(li) > 1e-6 && (Fe += `
Mz \u2248 ${Ft(li * Ve)} ${Ze.forceUnit}\xB7m`);
            }
          }
        }
      }
      return { type: jt, idx: ot, info: Fe };
    }
    return null;
  }
  function D(Ce, ce, _e) {
    var _a2, _b, _c2;
    if (i.visible = false, a.visible = false, c.visible = false, f.visible = false, C.visible = false, !Ce || !r.mesh) {
      W.style.display = "none", r.render();
      return;
    }
    const ge = (_a2 = r.mesh.elements) == null ? void 0 : _a2.rawVal;
    if (Ce.type === "node") {
      const Me = U(Ce.idx);
      if (Me) {
        const Ie = r.derivedNodes.rawVal ?? [];
        let Ne = 1;
        if (Ie.length >= 2) {
          let tt = [1 / 0, 1 / 0, 1 / 0], Ye = [-1 / 0, -1 / 0, -1 / 0];
          for (const Ze of Ie) for (let $e = 0; $e < 3; $e++) Ze[$e] < tt[$e] && (tt[$e] = Ze[$e]), Ze[$e] > Ye[$e] && (Ye[$e] = Ze[$e]);
          Ne = Math.max(Ye[0] - tt[0], Ye[1] - tt[1], Ye[2] - tt[2], 0.1);
        }
        const Ge = ((_b = r.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, Ee = 0.021 * Ne * Ge;
        i.position.copy(Me), i.scale.setScalar(Ee), i.visible = true;
      }
    } else if (Ce.type === "frame" && ge) {
      const Me = ge[Ce.idx], Ie = U(Me[0]), Ne = U(Me[1]);
      if (Ie && Ne) {
        const Ge = Ie.clone().add(Ne).multiplyScalar(0.5), Ee = Ne.clone().sub(Ie), tt = Ee.length(), Ye = Math.max(1e-4, 3.5 * ve(Ge));
        c.position.copy(Ge);
        const Ze = new te(0, 1, 0), $e = Ze.clone().cross(Ee).normalize(), Ve = Ze.angleTo(Ee);
        c.quaternion.setFromAxisAngle($e, Ve), c.scale.set(Ye, tt, Ye), c.visible = true;
      }
    } else if (Ce.type === "shell" && ge) {
      const Me = ge[Ce.idx], Ie = [], Ne = [];
      for (const Ge of Me) {
        const Ee = U(Ge);
        if (!Ee) return;
        Ie.push(Ee.x, Ee.y, Ee.z);
      }
      Me.length === 4 ? Ne.push(0, 1, 2, 0, 2, 3) : Me.length === 3 && Ne.push(0, 1, 2), h.setAttribute("position", new Mt(Ie, 3)), h.setIndex(Ne), h.computeVertexNormals(), f.visible = true;
    } else if (Ce.type === "solid" && ge) {
      const Me = ge[Ce.idx], Ie = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Ne = [];
      for (const [Ge, Ee] of Ie) {
        const tt = U(Me[Ge]), Ye = U(Me[Ee]);
        tt && Ye && Ne.push(tt.x, tt.y, tt.z, Ye.x, Ye.y, Ye.z);
      }
      x.setAttribute("position", new Mt(Ne, 3)), C.visible = true;
    }
    if (window.__hekatanShellTooltipVisible === true) {
      W.style.display = "none", r.render();
      return;
    }
    W.textContent = Ce.info, W.style.whiteSpace = "pre-line", W.style.display = "block";
    const Le = r.rendererElm.getBoundingClientRect(), Te = ((_c2 = r.rendererElm.parentElement) == null ? void 0 : _c2.getBoundingClientRect()) ?? Le;
    W.style.left = `${ce - Te.left}px`, W.style.top = `${_e - Te.top}px`, r.render();
  }
  let R = "", B = 0, Q = 0;
  const re = window.__hekatanHoverDebug ?? false, pe = (Ce) => {
    B && cancelAnimationFrame(B), B = requestAnimationFrame(() => {
      var _a2, _b, _c2;
      const ce = K(Ce.clientX, Ce.clientY);
      if (re && Q < 5) {
        const ge = r.derivedNodes.rawVal, ye = (_b = (_a2 = r.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
        console.log(`[hover] pointer (${Ce.clientX}, ${Ce.clientY}) nodes=${(ge == null ? void 0 : ge.length) ?? 0} elems=${(ye == null ? void 0 : ye.length) ?? 0} hover=`, ce), Q++;
      }
      const _e = ce ? `${ce.type}:${ce.idx}` : "";
      if (_e !== R) R = _e, D(ce, Ce.clientX, Ce.clientY);
      else if (ce) {
        const ge = ((_c2 = r.rendererElm.parentElement) == null ? void 0 : _c2.getBoundingClientRect()) ?? r.rendererElm.getBoundingClientRect();
        W.style.left = `${Ce.clientX - ge.left}px`, W.style.top = `${Ce.clientY - ge.top}px`;
      }
    });
  };
  let be = null;
  const le = () => {
    R = "", i.visible = false, a.visible = false, c.visible = false, f.visible = false, C.visible = false, W.style.display = "none", r.render();
  }, ne = (Ce) => {
    const ce = r.rendererElm.getBoundingClientRect(), _e = Ce.clientX - ce.left, ge = Ce.clientY - ce.top;
    (_e < -2 || ge < -2 || _e > ce.width + 2 || ge > ce.height + 2) && (be && clearTimeout(be), be = window.setTimeout(le, 200));
  }, ae = () => {
    be && (clearTimeout(be), be = null);
  };
  r.rendererElm.addEventListener("pointermove", pe), r.rendererElm.addEventListener("pointerleave", ne), r.rendererElm.addEventListener("pointerenter", ae);
  function ue() {
    var _a2, _b, _c2;
    const Ce = ((_c2 = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c2.tool) ?? "select";
    return Ce === "select" || Ce === "none" || !Ce;
  }
  let he = null;
  r.rendererElm.addEventListener("pointerdown", (Ce) => {
    Ce.button === 0 && (he = { x: Ce.clientX, y: Ce.clientY });
  }), r.rendererElm.addEventListener("pointerup", (Ce) => {
    if (Ce.button !== 0 || !he) return;
    const ce = Ce.clientX - he.x, _e = Ce.clientY - he.y;
    if (he = null, ce * ce + _e * _e > 9 || !ue()) return;
    const ge = K(Ce.clientX, Ce.clientY);
    ge ? (dt({ type: ge.type, idx: ge.idx }, Ce.shiftKey), He()) : wt();
  }), window.addEventListener("keydown", (Ce) => {
    if (Ce.key !== "Escape" || !q.length) return;
    const ce = document.activeElement, _e = !!ce && (ce.id === "hk3-cmd-input" || ce.id === "hk-dyn-input") && ce.value === "";
    ce && (ce.tagName === "INPUT" || ce.tagName === "TEXTAREA" || ce.isContentEditable) && !_e || wt();
  }, { capture: true });
  function Se() {
    for (const Ce of G.children.slice()) {
      G.remove(Ce);
      const ce = Ce.geometry;
      ce && ce !== t && ce !== A && ce.dispose();
    }
  }
  const ve = (Ce) => {
    var _a2;
    const ce = r.getActiveCamera(), _e = ((_a2 = r.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
    return ce.isOrthographicCamera ? (ce.top - ce.bottom) / (ce.zoom || 1) / _e : 2 * ce.position.distanceTo(Ce) * Math.tan((ce.fov || 50) * Math.PI / 180 / 2) / _e;
  };
  function Oe(Ce, ce) {
    var _a2, _b;
    const _e = (_b = (_a2 = r.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
    if (Ce.type === "node") {
      const ge = U(Ce.idx);
      if (!ge) return;
      const ye = new pt(t, _);
      ye.position.copy(ge), ye.scale.setScalar(Math.max(1e-4, 7 * ve(ge))), ye.renderOrder = 101, G.add(ye);
    } else if (Ce.type === "frame" && _e) {
      const ge = _e[Ce.idx], ye = U(ge[0]), Le = U(ge[1]);
      if (!ye || !Le) return;
      const Te = ye.clone().add(Le).multiplyScalar(0.5), Me = Le.clone().sub(ye), Ie = Me.length(), Ne = Math.max(1e-4, 4 * ve(Te)), Ge = new pt(A, S);
      Ge.position.copy(Te);
      const Ee = new te(0, 1, 0);
      Ge.quaternion.setFromAxisAngle(Ee.clone().cross(Me).normalize(), Ee.angleTo(Me)), Ge.scale.set(Ne, Ie, Ne), Ge.renderOrder = 101, G.add(Ge);
    } else if (Ce.type === "shell" && _e) {
      const ge = _e[Ce.idx], ye = [], Le = [];
      for (const Ie of ge) {
        const Ne = U(Ie);
        if (!Ne) return;
        ye.push(Ne.x, Ne.y, Ne.z);
      }
      ge.length === 4 ? Le.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && Le.push(0, 1, 2);
      const Te = new ze();
      Te.setAttribute("position", new Mt(ye, 3)), Te.setIndex(Le), Te.computeVertexNormals();
      const Me = new pt(Te, P);
      Me.renderOrder = 101, G.add(Me);
    } else if (Ce.type === "solid" && _e) {
      const ge = _e[Ce.idx], ye = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], Le = [];
      for (const [Ie, Ne] of ye) {
        const Ge = U(ge[Ie]), Ee = U(ge[Ne]);
        Ge && Ee && Le.push(Ge.x, Ge.y, Ge.z, Ee.x, Ee.y, Ee.z);
      }
      const Te = new ze();
      Te.setAttribute("position", new Mt(Le, 3));
      const Me = new is(Te, X);
      Me.renderOrder = 101, G.add(Me);
    }
  }
  function He() {
    if (Se(), !q.length || !r.mesh) {
      r.render();
      return;
    }
    const Ce = r.derivedNodes.rawVal ?? [];
    if (Ce.length >= 2) {
      const ce = [1 / 0, 1 / 0, 1 / 0], _e = [-1 / 0, -1 / 0, -1 / 0];
      for (const ge of Ce) for (let ye = 0; ye < 3; ye++) ge[ye] < ce[ye] && (ce[ye] = ge[ye]), ge[ye] > _e[ye] && (_e[ye] = ge[ye]);
      Math.max(_e[0] - ce[0], _e[1] - ce[1], _e[2] - ce[2], 0.1);
    }
    for (const ce of q) Oe(ce);
    r.render();
  }
  function dt(Ce, ce) {
    const _e = q.findIndex((ge) => ge.type === Ce.type && ge.idx === Ce.idx);
    _e >= 0 ? q.splice(_e, 1) : ce || q.push(Ce), q.length && q[q.length - 1];
  }
  function wt() {
    q.length = 0, He();
  }
  return xe.derive(() => {
    r.derivedNodes.val, q.length && He();
  }), e;
}
function zr(r, e, t, s, i, n) {
  const o = i - t, a = n - s, l = o * o + a * a;
  if (l < 1e-9) {
    const b = r - t, C = e - s;
    return Math.sqrt(b * b + C * C);
  }
  let c = ((r - t) * o + (e - s) * a) / l;
  c = Math.max(0, Math.min(1, c));
  const h = t + c * o, p = s + c * a, f = r - h, x = e - p;
  return Math.sqrt(f * f + x * x);
}
function Ir(r, e, t) {
  let s = false;
  for (let i = 0, n = t.length - 1; i < t.length; n = i++) {
    const o = t[i].x, a = t[i].y, l = t[n].x, c = t[n].y;
    a > e != c > e && r < (l - o) * (e - a) / (c - a + 1e-12) + o && (s = !s);
  }
  return s;
}
const Fr = { normals: "Axial", torsions: "Torsi\xF3n", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3", bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3" }, Pr = { normals: "kN", torsions: "kN\xB7m", shearsY: "kN", shearsZ: "kN", bendingsY: "kN\xB7m", bendingsZ: "kN\xB7m" }, Ls = 1e-3;
function Ii(r, e) {
  return e === "XZ" ? { u: r[0], v: r[2], fuera: r[1] } : e === "YZ" ? { u: r[1], v: r[2], fuera: r[0] } : { u: r[0], v: r[1], fuera: r[2] };
}
function Rr(r, e) {
  const t = Math.abs(e[0] - r[0]);
  return Math.abs(e[1] - r[1]) < Ls ? { plano: "XZ", en: r[1] } : t < Ls ? { plano: "YZ", en: r[0] } : { plano: "XY", en: r[2] };
}
function Dr(r, e) {
  var _a2, _b;
  let t = null, s = { plano: "XZ", en: 0 };
  const i = () => {
    var _a3, _b2;
    const A = ((_a3 = e == null ? void 0 : e.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = e == null ? void 0 : e.frameResults) == null ? void 0 : _b2.val);
    return !A || A === "none" ? null : String(A).replace(/^contour:/, "");
  }, n = (A) => {
    var _a3, _b2;
    const P = ((_a3 = r.nodes) == null ? void 0 : _a3.rawVal) ?? [], X = ((_b2 = r.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Set();
    for (const G of X) {
      if (G.length !== 2) continue;
      const W = P[G[0]], U = P[G[1]];
      if (!W || !U) continue;
      const K = Ii(W, A), D = Ii(U, A);
      Math.abs(K.fuera - D.fuera) < Ls && q.add(Math.round(K.fuera * 1e3) / 1e3);
    }
    return [...q].sort((G, W) => G - W);
  };
  function o(A) {
    var _a3, _b2;
    if (A == null ? void 0 : A.plano) s = { plano: A.plano, en: A.en ?? n(A.plano)[0] ?? 0 };
    else {
      const X = [...window.__hekatanModelSelection ?? []].reverse().find((W) => W.type === "frame"), q = ((_a3 = r.nodes) == null ? void 0 : _a3.rawVal) ?? [], G = ((_b2 = r.elements) == null ? void 0 : _b2.rawVal) ?? [];
      X && G[X.idx] && q[G[X.idx][0]] && q[G[X.idx][1]] ? s = Rr(q[G[X.idx][0]], q[G[X.idx][1]]) : s = { plano: "XZ", en: n("XZ")[0] ?? 0 };
    }
    t || a(), t.hidden = false, l();
  }
  function a() {
    t = document.createElement("div"), t.id = "hk-diagrama-2d", t.style.cssText = ["position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)", "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), t.innerHTML = `
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
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`, document.body.appendChild(t), t.querySelector(".hk-d2-x").addEventListener("click", () => {
      t.hidden = true;
    });
    const A = t.querySelector(".hk-d2-plano"), P = t.querySelector(".hk-d2-en");
    A.addEventListener("change", () => {
      s = { plano: A.value, en: n(A.value)[0] ?? 0 }, l();
    }), P.addEventListener("change", () => {
      s.en = Number(P.value), l();
    });
    const X = (W) => {
      const U = n(s.plano), K = U.findIndex((R) => Math.abs(R - s.en) < Ls), D = Math.max(0, Math.min(U.length - 1, (K < 0 ? 0 : K) + W));
      U.length && (s.en = U[D], l());
    };
    t.querySelector(".hk-d2-ant").addEventListener("click", () => X(-1)), t.querySelector(".hk-d2-sig").addEventListener("click", () => X(1));
    const q = t.querySelector(".hk-d2-bar");
    let G = null;
    q.addEventListener("pointerdown", (W) => {
      if (W.target.closest("select,button")) return;
      const U = t.getBoundingClientRect();
      G = { x: W.clientX, y: W.clientY, l: U.left, t: U.top }, t.style.transform = "none", t.style.left = U.left + "px", t.style.top = U.top + "px";
    }), window.addEventListener("pointermove", (W) => {
      !G || !t || (t.style.left = G.l + W.clientX - G.x + "px", t.style.top = G.t + W.clientY - G.y + "px");
    }), window.addEventListener("pointerup", () => {
      G = null;
    }), new ResizeObserver(() => {
      t && !t.hidden && l();
    }).observe(t);
  }
  function l() {
    var _a3, _b2, _c2, _d, _e2, _f, _g, _h;
    if (!t || t.hidden) return;
    const A = new Set(p && !p.hidden && f >= 0 ? b(f) : []), P = t.querySelector(".hk-d2-svg"), X = t.querySelector(".hk-d2-tit"), q = t.querySelector(".hk-d2-pie"), G = t.querySelector(".hk-d2-plano"), W = t.querySelector(".hk-d2-en");
    G.value = s.plano;
    const U = n(s.plano), K = s.plano === "XZ" ? "y" : s.plano === "YZ" ? "x" : "z", D = s.plano === "XY" ? "Planta" : "P\xF3rtico";
    W.innerHTML = U.map(($e, Ve) => `<option value="${$e}" ${Math.abs($e - s.en) < Ls ? "selected" : ""}>${D} ${Ve + 1} \xB7 ${K} = ${$e.toFixed(2)} m</option>`).join("");
    const R = i(), B = ((_a3 = r.nodes) == null ? void 0 : _a3.rawVal) ?? [], Q = ((_b2 = r.elements) == null ? void 0 : _b2.rawVal) ?? [], re = R ? (_d = (_c2 = r.analyzeOutputs) == null ? void 0 : _c2.rawVal) == null ? void 0 : _d[R] : null;
    P.innerHTML = "";
    const pe = P.clientWidth || 880, be = P.clientHeight || 480, le = [];
    if (Q.forEach(($e, Ve) => {
      if ($e.length !== 2) return;
      const Rt = B[$e[0]], ot = B[$e[1]];
      if (!Rt || !ot) return;
      const At = Ii(Rt, s.plano), jt = Ii(ot, s.plano);
      Math.abs(At.fuera - s.en) < Ls && Math.abs(jt.fuera - s.en) < Ls && le.push({ i: Ve, a: At, b: jt });
    }), !le.length) {
      q.textContent = "No hay barras en este plano.", X.textContent = "";
      return;
    }
    let ne = 1 / 0, ae = -1 / 0, ue = 1 / 0, he = -1 / 0;
    for (const $e of le) for (const Ve of [$e.a, $e.b]) ne = Math.min(ne, Ve.u), ae = Math.max(ae, Ve.u), ue = Math.min(ue, Ve.v), he = Math.max(he, Ve.v);
    const Se = ae - ne || 1, ve = he - ue || 1, Oe = 0.12 * Math.max(Se, ve), He = 46, dt = Math.min((pe - 2 * He) / (Se + 2 * Oe), (be - 2 * He) / (ve + 2 * Oe)), wt = (pe - Se * dt) / 2, Ce = (be - ve * dt) / 2, ce = ($e) => wt + ($e - ne) * dt, _e = ($e) => be - (Ce + ($e - ue) * dt), ge = "http://www.w3.org/2000/svg", ye = ($e, Ve, Rt) => {
      const ot = document.createElementNS(ge, $e);
      for (const At in Ve) ot.setAttribute(At, String(Ve[At]));
      return Rt != null && (ot.textContent = Rt), P.appendChild(ot), ot;
    }, Le = /* @__PURE__ */ new Map();
    for (const $e of le) {
      const Ve = ((_h = (_g = (_f = (_e2 = r.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, $e.i)) ?? 0, Rt = Ii(Ha(R ?? "normals", Ba(B[Q[$e.i][0]], B[Q[$e.i][1]], Ve)), s.plano), ot = Math.hypot(Rt.u, Rt.v);
      Le.set($e.i, ot > 0.3 ? [Rt.u / ot, -Rt.v / ot] : null);
    }
    const Te = le.filter(($e) => !Le.get($e.i)).length;
    let Me = 0;
    if (re) for (const $e of le) {
      if (!Le.get($e.i)) continue;
      const Ve = re instanceof Map ? re.get($e.i) : re[$e.i];
      Ve && (Me = Math.max(Me, Math.abs(Ve[0] ?? 0), Math.abs(Ve[1] ?? 0)));
    }
    const Ie = 0.12 * Math.max(Se, ve) * dt, Ne = Me > 0 ? Ie / Me : 0, Ge = R === "bendingsY" || R === "bendingsZ", Ee = ($e) => Math.abs($e) >= 100 ? $e.toFixed(1) : Math.abs($e) >= 10 ? $e.toFixed(2) : $e.toFixed(3), tt = [];
    for (const $e of le) {
      const Ve = ce($e.a.u), Rt = _e($e.a.v), ot = ce($e.b.u), At = _e($e.b.v), jt = Le.get($e.i), [at, Qe] = jt ?? [0, 0], Fe = re && jt ? re instanceof Map ? re.get($e.i) : re[$e.i] : null, [st, Re] = Fe ? fo(R, Fe) : [0, 0];
      if (Fe && Ne > 0) {
        const Ke = [Ve + at * st * Ne * 1, Rt + Qe * st * Ne * 1], it = [ot + at * Re * Ne * 1, At + Qe * Re * Ne * 1], _t = st + Re >= 0 ? "#3fa7d6" : "#d9534f";
        ye("polygon", { points: `${Ve},${Rt} ${Ke[0]},${Ke[1]} ${it[0]},${it[1]} ${ot},${At}`, fill: _t, "fill-opacity": 0.38, stroke: _t, "stroke-width": 1.2 }), tt.push({ x: Ke[0] + at * 12, y: Ke[1] + Qe * 12, t: Ee(st), peso: Math.abs(st) }), tt.push({ x: it[0] + at * 12, y: it[1] + Qe * 12, t: Ee(Re), peso: Math.abs(Re) });
      }
      ye("line", { x1: Ve, y1: Rt, x2: ot, y2: At, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" }), A.has($e.i) && ye("line", { x1: Ve, y1: Rt, x2: ot, y2: At, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      const ht = ye("line", { x1: Ve, y1: Rt, x2: ot, y2: At, stroke: "transparent", "stroke-width": 14, style: "cursor:pointer;pointer-events:stroke" });
      ht.addEventListener("click", () => C($e.i));
      const lt = document.createElementNS(ge, "title");
      lt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", ht.appendChild(lt);
    }
    for (const $e of le) for (const Ve of [$e.a, $e.b]) s.plano !== "XY" && Math.abs(Ve.v - ue) < Ls && ye("rect", { x: ce(Ve.u) - 6, y: _e(Ve.v), width: 12, height: 7, fill: "#b03a3a" });
    const Ye = [];
    tt.sort(($e, Ve) => Ve.peso - $e.peso);
    for (const $e of tt) $e.peso < 0.02 * Me || Ye.some((Ve) => Math.hypot(Ve.x - $e.x, Ve.y - $e.y) < 34) || (Ye.push($e), ye("text", { x: $e.x, y: $e.y + 4, "text-anchor": "middle", fill: "#f2f5fa", "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14", "stroke-width": 3 }, $e.t));
    const Ze = R ? Fr[R] ?? R : "sin resultado";
    X.textContent = `${Ze} \xB7 ${s.plano === "XY" ? "planta" : "alzado"} ${s.plano} en ${K} = ${s.en.toFixed(2)} m`, q.textContent = R ? `${le.length} barras en el plano \xB7 m\xE1ximo ${Ee(Me)} ${Pr[R] ?? ""}` + (Ge ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (Te ? ` \xB7 ${Te} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
  }
  const c = () => {
    try {
      l();
    } catch {
    }
  };
  (e == null ? void 0 : e.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
    e.frameResults.val, c();
  }));
  let h = null;
  setInterval(() => {
    var _a3, _b2;
    const A = (_a3 = r.analyzeOutputs) == null ? void 0 : _a3.rawVal, P = (_b2 = e == null ? void 0 : e.frameResults) == null ? void 0 : _b2.rawVal, X = [A, P];
    if (!(h && h[0] === A && h[1] === P)) {
      h = X, c();
      try {
        S();
      } catch {
      }
    }
  }, 400);
  let p = null, f = -1, x = "12";
  function b(A) {
    var _a3, _b2;
    const P = ((_a3 = r.nodes) == null ? void 0 : _a3.rawVal) ?? [], X = ((_b2 = r.elements) == null ? void 0 : _b2.rawVal) ?? [], q = /* @__PURE__ */ new Map();
    X.forEach((K, D) => {
      if (K.length === 2) for (const R of K) q.has(R) || q.set(R, []), q.get(R).push(D);
    });
    const G = (K) => {
      const D = P[X[K][0]], R = P[X[K][1]], B = [R[0] - D[0], R[1] - D[1], R[2] - D[2]], Q = Math.hypot(B[0], B[1], B[2]) || 1;
      return B.map((re) => re / Q);
    }, W = (K, D) => {
      const R = G(K), B = G(D);
      return Math.abs(R[0] * B[0] + R[1] * B[1] + R[2] * B[2]) > 0.9999;
    }, U = [A];
    for (const K of [0, 1]) {
      let D = A, R = X[A][K];
      for (let B = 0; B < 500; B++) {
        const Q = (q.get(R) ?? []).filter((pe) => pe !== D);
        if (Q.length !== 1 || !W(D, Q[0])) break;
        const re = Q[0];
        K === 0 ? U.unshift(re) : U.push(re), R = X[re][0] === R ? X[re][1] : X[re][0], D = re;
      }
    }
    return U;
  }
  function C(A) {
    if (A == null) {
      const X = [...window.__hekatanModelSelection ?? []].reverse().find((q) => q.type === "frame");
      if (!X) {
        alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
        return;
      }
      A = X.idx;
    }
    f = A, p || (p = document.createElement("div"), p.id = "hk-diagrama-barra", p.style.cssText = ["position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991", "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px", "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0"].join(";"), p.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(p), p.querySelector(".hk-b-x").addEventListener("click", () => {
      p.hidden = true, _(), l();
    }), p.querySelector(".hk-b-pl").addEventListener("change", (P) => {
      x = P.target.value, S();
    })), p.hidden = false, _(), S(), l();
  }
  function _() {
    if (!t || !p) return;
    const A = window.innerWidth, P = Math.min(560, Math.round(A * 0.4));
    p.style.width = P + "px", !p.hidden && !t.hidden ? (t.style.transform = "none", t.style.left = "12px", t.style.width = A - P - 36 + "px", p.style.top = t.getBoundingClientRect().top + "px") : t.hidden || (t.style.left = "50%", t.style.transform = "translateX(-50%)", t.style.width = "min(900px,92vw)");
  }
  function S() {
    var _a3, _b2, _c2;
    if (!p || p.hidden || f < 0) return;
    const A = ((_a3 = r.nodes) == null ? void 0 : _a3.rawVal) ?? [], P = ((_b2 = r.elements) == null ? void 0 : _b2.rawVal) ?? [], X = ((_c2 = r.analyzeOutputs) == null ? void 0 : _c2.rawVal) ?? {};
    if (!P[f]) return;
    const q = b(f), G = [];
    let W = 0, U = -1;
    q.forEach((ae, ue) => {
      const [he, Se] = P[ae], ve = ue === 0 ? q.length > 1 && P[q[1]].includes(he) : he !== U, Oe = ve ? Se : he, He = ve ? he : Se, dt = Math.hypot(A[He][0] - A[Oe][0], A[He][1] - A[Oe][1], A[He][2] - A[Oe][2]);
      G.push({ x: W, e: ae, fin: ve ? 1 : 0 }), W += dt, G.push({ x: W, e: ae, fin: ve ? 0 : 1 }), U = He;
    });
    const K = W, D = (ae, ue) => {
      const he = X[ae], Se = he ? he instanceof Map ? he.get(ue.e) : he[ue.e] : null;
      return Se ? fo(ae, Se)[ue.fin] : 0;
    }, R = A[P[q[0]][0]], B = (ae) => ae.toFixed(2);
    p.querySelector(".hk-b-tit").textContent = "L = " + K.toFixed(2) + " m \xB7 " + q.length + " tramo(s) \xB7 desde (" + B(R[0]) + ", " + B(R[1]) + ", " + B(R[2]) + ")";
    const Q = x === "12" ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN\xB7m", true]] : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN\xB7m", true]], re = p.querySelector(".hk-b-cuerpo");
    re.innerHTML = "";
    const pe = Math.max(300, re.clientWidth), be = 124, le = 46, ne = (be - 14) / 2;
    for (const [ae, ue, he, Se] of Q) {
      const ve = G.map((Me) => D(ae, Me)), Oe = Math.max(...ve), He = Math.min(...ve), dt = Math.max(Math.abs(Oe), Math.abs(He)) || 1, wt = (Me) => le + Me / (K || 1) * (pe - 2 * le), Ce = (Me) => ne + (Se ? 1 : -1) * (Me / dt) * (ne - 16), ce = (Me) => Math.abs(Me) >= 100 ? Me.toFixed(1) : Math.abs(Me) >= 10 ? Me.toFixed(2) : Me.toFixed(3);
      let _e = wt(0) + "," + ne + " ";
      G.forEach((Me, Ie) => {
        _e += wt(Me.x) + "," + Ce(ve[Ie]) + " ";
      }), _e += wt(K) + "," + ne;
      const ge = ve.indexOf(Oe), ye = ve.indexOf(He), Le = (Me, Ie) => {
        const Ne = Ce(ve[Me]) + (Ce(ve[Me]) < ne ? -5 : 13);
        return '<text x="' + wt(G[Me].x) + '" y="' + Ne + '" text-anchor="middle" fill="' + Ie + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + ce(ve[Me]) + "</text>";
      }, Te = Se ? "#d9534f" : "#3fa7d6";
      re.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + ue + ' <span style="color:#6f7d90;font-weight:400">(' + he + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + ce(Oe) + " \xB7 m\xEDn " + ce(He) + (Se ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + pe + '" height="' + be + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + le + '" y1="' + ne + '" x2="' + (pe - le) + '" y2="' + ne + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + _e + '" fill="' + Te + '" fill-opacity=".35" stroke="' + Te + '" stroke-width="1.4"/>' + Le(0, "#f2f5fa") + Le(G.length - 1, "#f2f5fa") + (ge > 0 && ge < G.length - 1 ? Le(ge, "#8fd3ff") : "") + (ye > 0 && ye < G.length - 1 && ye !== ge ? Le(ye, "#ff9f9a") : "") + '<text x="' + le + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (pe - le) + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + K.toFixed(2) + " m</text></svg>");
    }
  }
  return window.__hekatanDiagramaBarra = C, window.__hekatanDiagrama2D = o, { abrir: o, abrirBarra: C };
}
function ba(r, e = 8) {
  const t = document.createElement("div");
  t.id = "legend";
  const s = document.createElement("div");
  s.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", t.appendChild(s), setTimeout(() => {
    xe.derive(() => {
      s.textContent = mo.val ? `[${mo.val}]` : "";
    });
  });
  const i = document.createElement("div");
  t.appendChild(i);
  let n = [], o = -1;
  function a(l) {
    if (l !== o) {
      o = l, t.style.setProperty("--legend-n", String(l)), i.innerHTML = "", n = [];
      for (let c = 0; c <= l; c++) {
        const h = document.createElement("div");
        h.className = "marker", h.style.marginTop = c === 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)";
        const p = document.createElement("p");
        h.append(p), i.append(h), n.push(p);
      }
    }
  }
  return setTimeout(() => {
    xe.derive(() => {
      const l = bi(Ts.val);
      a(l ? 15 : e), t.style.background = Hl(), t.classList.toggle("legend-discrete", l), Array.from({ length: o + 1 }, (h, p) => p / o).reverse().forEach((h, p) => {
        const f = n[p];
        f && (f.innerText = Lr(r.val, h).toString());
      });
    });
  }), t;
}
function Lr(r, e) {
  const t = Oi.val;
  if (t) {
    if (bi(Ts.val)) {
      const o = Math.min(t[0], t[1]), a = Math.max(t[0], t[1]);
      return lo(o + e * (a - o));
    }
    return lo(t[0] + e * (t[1] - t[0]));
  }
  const s = r.filter((o) => Number.isFinite(o));
  if (s.length === 0) return "0";
  const [i, n] = yo(s);
  return lo(i + e * (n - i));
}
function lo(r) {
  if (!Number.isFinite(r)) return "\u2014";
  if (r === 0) return "0";
  const e = Math.abs(r);
  return e < 1e-3 || e >= 1e5 ? r.toExponential(2) : r.toPrecision(3);
}
function Sc({ mesh: r, settingsObj: e, drawingObj: t, objects3D: s, solids: i }) {
  Nl.DEFAULT_UP = new te(0, 0, 1);
  const n = document.createElement("div"), o = new Pl(), a = new Rl(45, 1, 0.1, 2 * 1e6), l = new Dl(-10, 10, 10, -10, -1e3, 2e6);
  let c = a;
  const h = new Ll({ antialias: true });
  h.localClippingEnabled = true;
  const p = new da(a, h.domElement);
  p.enableDamping = true, p.dampingFactor = 0.1, p.screenSpacePanning = true, p.zoomSpeed = 0.8, p.panSpeed = 1.2, p.rotateSpeed = 0.9, p.keyPanSpeed = 12, p.listenToKeyEvents(window), p.touches = { ONE: fn.ROTATE, TWO: fn.DOLLY_PAN }, h.domElement.addEventListener("wheel", (ce) => {
    if (!ce.ctrlKey && Math.abs(ce.deltaX) > Math.abs(ce.deltaY) * 1.5) {
      ce.preventDefault();
      const _e = p.target, ge = new te().subVectors(a.position, _e), ye = new te();
      ye.crossVectors(a.up, ge).normalize();
      const Te = ge.length() * 1e-3 * p.panSpeed;
      _e.addScaledVector(ye, ce.deltaX * Te), a.position.addScaledVector(ye, ce.deltaX * Te), p.update();
    }
  }, { passive: false });
  const f = new so(new te(-1, 0, 0), 0), x = new so(new te(0, -1, 0), 0), b = new so(new te(0, 0, -1), 0);
  window.__hekatanClip = window.__hekatanClip ?? { enableX: false, enableY: false, enableZ: false, posX: 0, posY: 0, posZ: 0, invertX: false, invertY: false, invertZ: false };
  function C() {
    const ce = window.__hekatanClip, _e = [];
    ce.enableX && (f.normal.set(ce.invertX ? 1 : -1, 0, 0), f.constant = ce.invertX ? -ce.posX : ce.posX, _e.push(f)), ce.enableY && (x.normal.set(0, ce.invertY ? 1 : -1, 0), x.constant = ce.invertY ? -ce.posY : ce.posY, _e.push(x)), ce.enableZ && (b.normal.set(0, 0, ce.invertZ ? 1 : -1), b.constant = ce.invertZ ? -ce.posZ : ce.posZ, _e.push(b)), h.clippingPlanes = _e, o.traverse((ye) => {
      const Le = ye;
      if (Le.material) {
        const Te = Array.isArray(Le.material) ? Le.material : [Le.material];
        for (const Me of Te) Me.clippingPlanes = _e, Me.needsUpdate = true;
      }
    });
    const ge = window.__hekatanPanes ?? [];
    for (const ye of ge) try {
      ye && typeof ye.refresh == "function" && ye.refresh();
    } catch {
    }
    h.render(o, c);
  }
  C(), window.__hekatanClipApply = C;
  const _ = Ul(e), S = xe.derive(() => Math.pow(10, _.displayScale.val / 10)), A = Nr(r, _), P = () => {
    const ce = [];
    return _.gridXY.rawVal && ce.push("xy"), _.gridXZ.rawVal && ce.push("xz"), _.gridYZ.rawVal && ce.push("yz"), ce;
  }, X = () => {
    const ce = _.gridStep.rawVal, _e = Math.max(ce, _.gridMajor.rawVal);
    return { planes: P(), majorStep: _e, minorStep: ce };
  };
  let q = no(_.gridSize.rawVal, X());
  q.visible = _.gridVisible.rawVal, window.__hekatanSnap2D = _.cursorSnap.rawVal;
  const G = () => {
    const ce = Math.max(0, Math.min(1, _.gridOpacity.rawVal));
    q.traverse((_e) => {
      const ge = _e.material;
      if (!ge || !("opacity" in ge)) return;
      const ye = _e.name ?? "";
      let Le = 0.55;
      ye.includes("border") ? Le = 1 : ye.includes("major") && (Le = 0.95), ge.opacity = ce * Le;
    });
  };
  G(), n.appendChild(Yl(_, r, i)), n.setAttribute("id", "viewer"), n.appendChild(h.domElement), h.setPixelRatio(window.devicePixelRatio);
  const W = Vs();
  h.setClearColor(W.background, 1);
  const U = _.gridSize.rawVal, K = U * 0.5 + U * 0.5 / Math.tan(45 * 0.5);
  a.position.set(0, 0, K), a.up.set(0, 1, 0), p.target.set(0, 0, 0), p.minDistance = 0.1, p.maxDistance = 1e4, n.__settings = _, p.zoomSpeed = 1, p._getZoomScale = function() {
    return Math.pow(0.95, this.zoomSpeed);
  }, p.update();
  let D = ya(_.gridSize.rawVal, _.flipAxes.rawVal);
  o.add(q, D), xe.derive(() => {
    window.__hekatanGridPlaneXY = _.gridXY.val, window.__hekatanGridPlaneXZ = _.gridXZ.val, window.__hekatanGridPlaneYZ = _.gridYZ.val;
  });
  let R = true;
  xe.derive(() => {
    const ce = _.gridVisible.val;
    if (R) {
      R = false;
      return;
    }
    q.visible = ce, ae();
  });
  let B = true;
  xe.derive(() => {
    if (_.gridOpacity.val, B) {
      B = false;
      return;
    }
    G(), ae();
  }), xe.derive(() => {
    const ce = _.cursorSnap.val;
    window.__hekatanSnap2D = ce;
  });
  let Q = true;
  xe.derive(() => {
    var _a2, _b, _c2;
    const ce = _.gridSize.val, _e = _.flipAxes.val;
    if (_.gridXY.val, _.gridXZ.val, _.gridYZ.val, _.gridStep.val, _.gridMajor.val, Q) {
      Q = false;
      return;
    }
    o.remove(q), (_a2 = q.traverse) == null ? void 0 : _a2.call(q, (Te) => {
      var _a3, _b2, _c3, _d;
      (_b2 = (_a3 = Te.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c3 = Te.material) == null ? void 0 : _c3.dispose) == null ? void 0 : _d.call(_c3);
    }), q = no(ce, X()), q.visible = _.gridVisible.rawVal, o.add(q), G(), o.remove(D), D.traverse((Te) => {
      var _a3, _b2, _c3, _d;
      (_b2 = (_a3 = Te.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d = (_c3 = Te.material) == null ? void 0 : _c3.dispose) == null ? void 0 : _d.call(_c3);
    }), D = ya(ce, _e), o.add(D);
    const ge = ce * 0.5 + ce * 0.5 / Math.tan(45 * 0.5);
    a.position.distanceTo(p.target);
    const ye = Math.abs(a.position.x) < 0.1 && Math.abs(a.position.y) < 0.1 && a.position.z > 0;
    (((_b = r == null ? void 0 : r.nodes) == null ? void 0 : _b.rawVal) ?? ((_c2 = r == null ? void 0 : r.nodes) == null ? void 0 : _c2.val) ?? []).length > 0 || (ye ? a.position.set(0, 0, ge) : a.position.set(0.5 * ce, -ge, 0.5 * ce), p.target.set(0, 0, 0)), p.minDistance = Math.max(0.05, ce * 0.01), p.maxDistance = Math.max(50, ce * 50), p.update(), ae();
  }), new ResizeObserver((ce) => {
    var _a2, _b;
    for (const _e of ce) {
      const ge = (_a2 = _e.target) == null ? void 0 : _a2.clientWidth, ye = (_b = _e.target) == null ? void 0 : _b.clientHeight;
      if (ge === 0 || ye === 0) continue;
      const Te = (pe ? ge / 2 : ge) / ye;
      a.aspect = Te, a.updateProjectionMatrix();
      const Me = l.top;
      if (l.left = -Me * Te, l.right = Me * Te, l.updateProjectionMatrix(), be && be.isPerspectiveCamera) be.aspect = Te, be.updateProjectionMatrix();
      else if (be && be.isOrthographicCamera) {
        const Ie = be, Ne = Ie.top;
        Ie.left = -Ne * Te, Ie.right = Ne * Te, Ie.updateProjectionMatrix();
      }
      h.setSize(ge, ye), ae();
    }
  }).observe(n), p.addEventListener("change", ae), xe.derive(() => {
    var _a2, _b, _c2, _d, _e, _f, _g, _h, _i;
    (_a2 = r == null ? void 0 : r.nodes) == null ? void 0 : _a2.val, (_b = r == null ? void 0 : r.elements) == null ? void 0 : _b.val, (_c2 = r == null ? void 0 : r.nodeInputs) == null ? void 0 : _c2.val, (_d = r == null ? void 0 : r.elementInputs) == null ? void 0 : _d.val, (_e = r == null ? void 0 : r.deformOutputs) == null ? void 0 : _e.val, (_f = r == null ? void 0 : r.analyzeOutputs) == null ? void 0 : _f.val, _.displayScale.val, _.nodes.val, _.elements.val, (_g = _.edges) == null ? void 0 : _g.val, _.elemColumns.val, _.elemBeams.val, _.nodesIndexes.val, _.elementsIndexes.val, _.orientations.val, _.sections.val, _.secColumns.val, _.secBeams.val, _.secFloor.val, _.supports.val, _.loads.val, _.deformedShape.val, _.nodeResults.val, _.frameResults.val, _.shellResults.val, (_h = _.solidResults) == null ? void 0 : _h.val, (_i = _.extruded) == null ? void 0 : _i.val, setTimeout(ae);
  });
  let pe = false, be = null, le = null, ne = false;
  function ae() {
    const ce = n.clientWidth || 1, _e = n.clientHeight || 1;
    if (!pe || !be) {
      h.setScissorTest(false), h.setViewport(0, 0, ce, _e), h.render(o, c);
      return;
    }
    const ge = ce / 2;
    h.setScissorTest(true), h.setViewport(0, 0, ge, _e), h.setScissor(0, 0, ge, _e), h.render(o, c), h.setViewport(ge, 0, ge, _e), h.setScissor(ge, 0, ge, _e), h.render(o, be), h.setScissorTest(false);
  }
  function ue(ce) {
    c = ce, p.object = ce, p.update(), ae();
  }
  function he(ce, _e) {
    pe = ce, _e && (be = _e);
    const ge = n.clientWidth || 1, ye = n.clientHeight || 1, Te = (ce ? ge / 2 : ge) / ye;
    a.isPerspectiveCamera && (a.aspect = Te, a.updateProjectionMatrix());
    const Me = l.top;
    if (l.left = -Me * Te, l.right = Me * Te, l.updateProjectionMatrix(), ce && be) {
      if (le ? (le.object = be, le.update()) : (le = new da(be, h.domElement), le.enableDamping = true, le.dampingFactor = 0.1, le.screenSpacePanning = true, le.zoomSpeed = 0.8, le.panSpeed = 1.2, le.rotateSpeed = 0.9, le.touches = { ONE: fn.ROTATE, TWO: fn.DOLLY_PAN }, le.target.copy(p.target), le.addEventListener("change", ae), le.enabled = false), !ne) {
        const Ie = (Ne) => {
          if (!pe || !le) return;
          const Ge = h.domElement.getBoundingClientRect(), Ee = Ne.clientX - Ge.left, tt = Ge.width / 2, Ye = Ee >= tt;
          p.enabled = !Ye, le.enabled = Ye;
        };
        h.domElement.addEventListener("pointerdown", Ie, true), h.domElement.addEventListener("wheel", Ie, { capture: true, passive: true }), ne = true;
      }
    } else ce || (p.enabled = true, le && (le.enabled = false));
    n.__splitMode = ce, window.__hekatanSplitMode = ce, window.__hekatanSplitCamera = ce ? be : null, ae();
  }
  if (r) {
    o.add(ql(_, A, S), Kl(r, _, A), er(_, A, S), tr(r, _, A, S), Jl(r, _, A, S), Ql(r, _, A, S), nr(r, _, A, S), ar(r, _, A, S), dr(r, _, A), fr(r, _, A, S), hr(r, _, A, S)), window.__hekatanDiagrama2D || (Dr(r, _), h.domElement.addEventListener("dblclick", () => {
      var _a2;
      const Ie = (_a2 = _.frameResults) == null ? void 0 : _a2.rawVal;
      !Ie || Ie === "none" || !(window.__hekatanModelSelection ?? []).some((Ge) => Ge.type === "frame") || setTimeout(() => {
        var _a3;
        return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
      }, 60);
    }));
    const ce = Tr({ scene: o, rendererElm: h.domElement, getActiveCamera: () => c, derivedNodes: A, derivedDisplayScale: S, mesh: r, settings: _, render: ae });
    o.add(ce);
    const _e = Yr(r, _), ge = wr(r, _, A, _e), ye = ba(_e);
    o.add(ge), n.appendChild(ye);
    const Le = _r(r, _, A);
    o.add(Le);
    const Te = Le.__colorMapValues, Me = ba(Te);
    Me.id = "frame-legend", n.appendChild(Me), xe.derive(() => {
      var _a2;
      const Ie = _.shellResults.val != "none", Ne = (((_a2 = _.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ge = Ie || Ne, Ee = _.frameResults.val.startsWith("contour:"), tt = _e.val.some((Ye) => Number.isFinite(Ye));
      ye.hidden = !Ge || !tt, ge.visible = Ge, Me.hidden = !Ee;
    });
  }
  if (i) {
    const ce = new Ra(16777215, 0.5);
    o.add(ce);
    const _e = new Mn(16777215, 0.5);
    _e.position.set(30, 25, -10), _e.shadow.mapSize.width = 1024, _e.shadow.mapSize.height = 1024, o.add(_e);
    const ge = 10;
    _e.shadow.camera.left = -ge, _e.shadow.camera.right = ge, _e.shadow.camera.top = ge, _e.shadow.camera.bottom = -ge, _e.shadow.camera.far = 1e3;
    const ye = new Mn(16777215, 0.5);
    ye.color.setHSL(11, 43, 96), ye.position.set(-10, 0, 30), o.add(ye), xe.derive(() => {
      (i == null ? void 0 : i.val.length) && (o.remove(...i.oldVal), o.add(...i.rawVal), ae());
    }), xe.derive(() => {
      i.rawVal.forEach((Le) => Le.visible = _.solids.val), ae();
    });
  }
  if (s) {
    const ce = [], _e = (ye) => {
      var _a2;
      return ((_a2 = ye == null ? void 0 : ye.userData) == null ? void 0 : _a2.isCota) ? _.showCotas.val : _.custom3D.val;
    }, ge = () => {
      for (const ye of ce) ye.visible = _e(ye);
      ae();
    };
    xe.derive(() => {
      const ye = s.val;
      ce.length && (o.remove(...ce), ce.length = 0), ye.length && (o.add(...ye), ce.push(...ye), ge(), h.clippingPlanes.length && C()), ae();
    }), xe.derive(() => {
      _.custom3D.val, ge();
    }), xe.derive(() => {
      _.showCotas.val, ge();
    });
  }
  t && mr({ drawingObj: t, gridObj: q, scene: o, getActiveCamera: () => c, controls: p, gridSize: U, derivedDisplayScale: S, rendererElm: h.domElement, viewerRender: ae }), Vi((ce, _e) => {
    var _a2;
    h.setClearColor(_e.background, 1), o.remove(q), (_a2 = q.traverse) == null ? void 0 : _a2.call(q, (ge) => {
      var _a3, _b, _c2, _d;
      (_b = (_a3 = ge.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d = (_c2 = ge.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d.call(_c2);
    }), q = no(_.gridSize.rawVal, { planes: P() }), o.add(q), n.style.setProperty("--hk-legend-color", _e.legendMarker), ae();
  });
  const Se = { scene: o, perspCamera: a, orthoCamera: l, get camera() {
    return c;
  }, controls: p, renderer: h, rendererElm: h.domElement, render: ae, setActiveCamera: ue, setSplitMode: he, get splitMode() {
    return pe;
  }, get splitCamera() {
    return be;
  }, settings: _ };
  n.__ctx = Se;
  const ve = document.createElement("div");
  ve.id = "hk-nav-camara", ve.style.cssText = ["position:absolute", "right:8px", "bottom:8px", "z-index:50", "display:grid", "grid-template-columns:repeat(3, 32px)", "gap:2px", "user-select:none", "pointer-events:auto"].join(";");
  const Oe = (ce, _e, ge) => {
    const ye = document.createElement("button");
    return ye.textContent = ce, ye.title = _e, ye.style.cssText = ["width:32px", "height:32px", "background:rgba(40,40,40,0.85)", "color:#fff", "border:1px solid rgba(255,255,255,0.15)", "border-radius:4px", "cursor:pointer", "font-size:14px", "font-family:system-ui"].join(";"), ye.onmouseenter = () => {
      ye.style.background = "rgba(70,70,70,0.9)";
    }, ye.onmouseleave = () => {
      ye.style.background = "rgba(40,40,40,0.85)";
    }, ye.onclick = (Le) => {
      Le.preventDefault(), ge();
    }, ye;
  }, He = (ce, _e) => {
    const ge = p.target, ye = new te().subVectors(c.position, ge), Le = ye.length(), Te = new te(), Me = new te();
    Te.crossVectors(c.up, ye).normalize(), Me.copy(c.up).normalize();
    const Ie = Le * 0.05;
    ge.addScaledVector(Te, -ce * Ie), ge.addScaledVector(Me, _e * Ie), c.position.addScaledVector(Te, -ce * Ie), c.position.addScaledVector(Me, _e * Ie), p.update(), ae();
  }, dt = (ce) => {
    const _e = new te().subVectors(c.position, p.target);
    _e.multiplyScalar(ce), c.position.copy(p.target).add(_e), p.update(), ae();
  }, wt = () => {
    const ce = document.createElement("div");
    return ce.style.cssText = "width:32px;height:32px;", ce;
  };
  return ve.append(wt()), ve.append(Oe("\u2191", "Pan arriba", () => He(0, 1))), ve.append(Oe("\u2295", "Zoom in", () => dt(0.85))), ve.append(Oe("\u2190", "Pan izquierda", () => He(-1, 0))), ve.append(Oe("\u2302", "Reset vista", () => {
    p.reset(), ae();
  })), ve.append(Oe("\u2192", "Pan derecha", () => He(1, 0))), ve.append(Oe("\u2296", "Zoom out", () => dt(1.18))), ve.append(Oe("\u2193", "Pan abajo", () => He(0, -1))), ve.append(wt()), getComputedStyle(n).position === "static" && (n.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && n.appendChild(ve), n;
}
let va = "";
function Ya(r) {
  r !== va && (va = r, console.error(`[sello] ${r}`));
}
function Ua(r, e, t) {
  var _a2;
  const s = (_a2 = r == null ? void 0 : r.caseId) == null ? void 0 : _a2.val, i = e == null ? void 0 : e.caseId;
  return s && i && i !== s ? (Ya(`NO pinto ${t}: los resultados son de \xAB${i}\xBB y en pantalla esta \xAB${s}\xBB. Resultado viejo sobre modelo nuevo.`), false) : true;
}
function Ri(r, e, t) {
  if (!r || r.size === 0 || e === 0) return true;
  let s = -1;
  for (const i of r.keys()) i > s && (s = i);
  return s >= e ? (Ya(`NO pinto ${t}: el resultado llega al indice ${s} y la malla en pantalla tiene ${e}. Es de otro modelo.`), false) : true;
}
function Nr(r, e) {
  return xe.derive(() => {
    var _a2, _b, _c2, _d, _e;
    if (!e.deformedShape.val) return ((_a2 = r == null ? void 0 : r.nodes) == null ? void 0 : _a2.val) ?? [];
    const t = ((_b = r == null ? void 0 : r.nodes) == null ? void 0 : _b.val) ?? [], s = (_d = (_c2 = r == null ? void 0 : r.deformOutputs) == null ? void 0 : _c2.val) == null ? void 0 : _d.deformations;
    if (!s || t.length === 0 || !Ua(r, (_e = r == null ? void 0 : r.deformOutputs) == null ? void 0 : _e.val, "la deformada") || !Ri(s, t.length, "la deformada")) return t;
    const i = e.deformScale.val, n = e.deformScale.val * e.deformScaleZ.val, o = Number.isFinite(i) ? i : 1, a = Number.isFinite(n) ? n : 1;
    return t.map((l, c) => {
      var _a3;
      const h = ((_a3 = s.get(c)) == null ? void 0 : _a3.slice(0, 3)) ?? [0, 0, 0], p = Number.isFinite(h[0]) ? h[0] : 0, f = Number.isFinite(h[1]) ? h[1] : 0, x = Number.isFinite(h[2]) ? h[2] : 0;
      return [l[0] + p * o, l[1] + f * o, l[2] + x * a];
    });
  });
}
const Oi = xe.state(null), mo = xe.state(""), Or = xe.state("kN"), Vr = xe.state("mm"), Br = xe.state("tonf/m\xB2"), Hr = { kN: 1, tonf: 9.80665, kip: 4.4482216 }, _a = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 }, Xr = { "kN/m\xB2": 1, kPa: 1, MPa: 1 / 1e3, GPa: 1 / 1e6, "kgf/cm\xB2": 1 / 98.0665, "tonf/m\xB2": 1 / 9.80665, psi: 1 / 6.89476, ksi: 1 / 6894.76, "kip/ft\xB2": 1 / 47.88026 };
function Yr(r, e) {
  const t = xe.state([]);
  let s;
  return ((i) => {
    i.bendingXX = "bendingXX", i.bendingYY = "bendingYY", i.bendingXY = "bendingXY", i.membraneXX = "membraneXX", i.membraneYY = "membraneYY", i.membraneXY = "membraneXY", i.tranverseShearX = "tranverseShearX", i.tranverseShearY = "tranverseShearY", i.membranePrincipalMax = "membranePrincipalMax", i.membranePrincipalMin = "membranePrincipalMin", i.bendingPrincipalMax = "bendingPrincipalMax", i.bendingPrincipalMin = "bendingPrincipalMin", i.transverseShearMax = "transverseShearMax", i.vonMises = "vonMises", i.pressure = "pressure", i.displacementX = "displacementX", i.displacementY = "displacementY", i.displacementZ = "displacementZ";
  })(s || (s = {})), xe.derive(() => {
    var _a2, _b, _c2, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r2, _s2, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E;
    const i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), b = (ye, Le) => {
      ye == null ? void 0 : ye.forEach((Te, Me) => {
        const Ie = r.elements.val[Me];
        if (Ie) for (let Ne = 0; Ne < Ie.length; Ne++) Le.set(Ie[Ne], [Te[Ne] ?? Te[0]]);
      });
    }, C = r.elements.val.length, _ = (_a2 = r.analyzeOutputs) == null ? void 0 : _a2.val;
    Ua(r, _, "el colormap de cascara") && Ri(_ == null ? void 0 : _.bendingXX, C, "el colormap de cascara") && Ri(_ == null ? void 0 : _.membraneXX, C, "el colormap de cascara") && Ri(_ == null ? void 0 : _.vonMises, C, "el colormap de cascara") && Ri(_ == null ? void 0 : _.pressure, C, "el colormap de cascara") && (b((_c2 = (_b = r.analyzeOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c2.bendingXX, i), b((_e2 = (_d = r.analyzeOutputs) == null ? void 0 : _d.val) == null ? void 0 : _e2.bendingYY, n), b((_g = (_f = r.analyzeOutputs) == null ? void 0 : _f.val) == null ? void 0 : _g.bendingXY, o), b((_i = (_h = r.analyzeOutputs) == null ? void 0 : _h.val) == null ? void 0 : _i.membraneXX, a), b((_k = (_j = r.analyzeOutputs) == null ? void 0 : _j.val) == null ? void 0 : _k.membraneYY, l), b((_m = (_l = r.analyzeOutputs) == null ? void 0 : _l.val) == null ? void 0 : _m.membraneXY, c), b((_o2 = (_n2 = r.analyzeOutputs) == null ? void 0 : _n2.val) == null ? void 0 : _o2.tranverseShearX, h), b((_q = (_p = r.analyzeOutputs) == null ? void 0 : _p.val) == null ? void 0 : _q.tranverseShearY, p), b((_s2 = (_r2 = r.analyzeOutputs) == null ? void 0 : _r2.val) == null ? void 0 : _s2.vonMises, f), b((_u = (_t = r.analyzeOutputs) == null ? void 0 : _t.val) == null ? void 0 : _u.pressure, x));
    const A = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), W = (ye, Le, Te, Me, Ie) => {
      ye.forEach((Ne, Ge) => {
        var _a3, _b2;
        const Ee = Ne[0] ?? 0, tt = ((_a3 = Le.get(Ge)) == null ? void 0 : _a3[0]) ?? 0, Ye = ((_b2 = Te.get(Ge)) == null ? void 0 : _b2[0]) ?? 0, Ze = (Ee + tt) / 2, $e = Math.hypot((Ee - tt) / 2, Ye);
        Me.set(Ge, [Ze + $e]), Ie.set(Ge, [Ze - $e]);
      });
    };
    W(a, l, c, A, P), W(i, n, o, X, q), h.forEach((ye, Le) => {
      var _a3;
      G.set(Le, [Math.hypot(ye[0] ?? 0, ((_a3 = p.get(Le)) == null ? void 0 : _a3[0]) ?? 0)]);
    });
    const U = (_w = (_v = r.analyzeOutputs) == null ? void 0 : _v.val) == null ? void 0 : _w.colorMapRanges, K = (_x = e.solidResults) == null ? void 0 : _x.val, R = K && K !== "none" ? K : e.shellResults.val, B = U == null ? void 0 : U[R], Q = { bendingXX: [i, 0], bendingYY: [n, 0], bendingXY: [o, 0], membraneXX: [a, 0], membraneYY: [l, 0], membraneXY: [c, 0], tranverseShearX: [h, 0], tranverseShearY: [p, 0], membranePrincipalMax: [A, 0], membranePrincipalMin: [P, 0], bendingPrincipalMax: [X, 0], bendingPrincipalMin: [q, 0], transverseShearMax: [G, 0], vonMises: [f, 0], pressure: [x, 0], displacementX: [(_z = (_y = r.deformOutputs) == null ? void 0 : _y.val) == null ? void 0 : _z.deformations, 0], displacementY: [(_B = (_A = r.deformOutputs) == null ? void 0 : _A.val) == null ? void 0 : _B.deformations, 1], displacementZ: [(_D = (_C = r.deformOutputs) == null ? void 0 : _C.val) == null ? void 0 : _D.deformations, 2] }, re = e.shellResults.val, pe = Or.val, be = Vr.val, le = re === "displacementX" || re === "displacementY" || re === "displacementZ", ne = re === "bendingXX" || re === "bendingYY" || re === "bendingXY" || re === "bendingPrincipalMax" || re === "bendingPrincipalMin", ae = re === "membraneXX" || re === "membraneYY" || re === "membraneXY" || re === "membranePrincipalMax" || re === "membranePrincipalMin", ue = re === "vonMises" || re === "pressure", he = re === "tranverseShearX" || re === "tranverseShearY" || re === "transverseShearMax", Se = (_E = e.solidResults) == null ? void 0 : _E.val, ve = Se === "vonMises" || Se === "sigmaXX" || Se === "sigmaYY" || Se === "sigmaZZ" || Se === "tauXY" || Se === "tauYZ" || Se === "tauXZ", Oe = Se === "ux" || Se === "uy" || Se === "uz", He = Br.val, dt = ve ? Xr[He] : Oe || le ? _a[be] : ne || ae || ue || he ? 1 / Hr[pe] : 1, wt = ve ? He : Oe || le ? be : ne ? `${pe}\xB7m/m` : ae ? `${pe}/m\xB2` : ue ? `${pe}/m\xB2` : he ? `${pe}/m` : "";
    mo.val = wt, Oi.val = Array.isArray(B) && B.length === 2 ? [B[0] * dt, B[1] * dt] : null;
    const Ce = Oa.val, _e = Se && Se !== "none" ? [f, 0] : Q[re], ge = [];
    if (r.nodes.val.forEach((ye, Le) => {
      const Te = _e;
      if (!Te || !Te[0] || typeof Te[0].has != "function") return;
      if (!Te[0].has(Le)) {
        ge.push(Number.NaN);
        return;
      }
      const Me = Te[0].get(Le), Ie = Me ? Me[Te[1]] ?? 0 : 0;
      ge.push(Ie * dt);
    }), !Oi.val && Ce !== "auto") {
      const ye = r.nodes.val, Le = /* @__PURE__ */ new Set(), Te = (Ie, Ne) => {
        var _a3;
        const Ge = (_a3 = ye[Ie[0]]) == null ? void 0 : _a3[Ne];
        return Ie.every((Ee) => {
          var _a4;
          return Math.abs((((_a4 = ye[Ee]) == null ? void 0 : _a4[Ne]) ?? NaN) - Ge) < 1e-6;
        });
      };
      for (const Ie of r.elements.val) {
        if (Ie.length !== 4) continue;
        const Ne = Te(Ie, 2), Ge = !Ne && Te(Ie, 0), Ee = !Ne && Te(Ie, 1);
        if (Ce === "losas" ? Ne : Ce === "muros" ? Ge || Ee : Ce === "murosX" ? Ge : Ce === "murosY" ? Ee : false) for (const Ze of Ie) Le.add(Ze);
      }
      const Me = [];
      for (const Ie of Le) {
        const Ne = ge[Ie];
        Number.isFinite(Ne) && Me.push(Ne);
      }
      Me.length && (Oi.val = yo(Me));
    }
    t.val = ge;
  }), t;
}
class ka {
  constructor(e, t) {
    Object.assign(this, { type: t.type ?? null, detail: t, owner: e, target: t.target ?? null, phase: t.phase ?? "before", object: t.object ?? null, execute: null, isStopped: false, isCancelled: false, onComplete: null, listeners: [] }), delete t.type, delete t.target, delete t.object, this.complete = new Promise((s, i) => {
      this._resolve = s, this._reject = i;
    }), this.complete.catch(() => {
    });
  }
  finish(e) {
    e && w.extend(this.detail, e), this.phase = "after", this.owner.trigger.call(this.owner, this);
  }
  done(e) {
    this.listeners.push(e);
  }
  preventDefault() {
    this._reject(), this.isCancelled = true;
  }
  stopPropagation() {
    this.isStopped = true;
  }
}
class ni {
  constructor(e) {
    if (this.activeEvents = [], this.listeners = [], e !== void 0) {
      if (!w.checkName(e)) return;
      Os[e] = this;
    }
    this.debug = false;
  }
  on(e, t) {
    return (e = typeof e == "string" ? e.split(/[,\s]+/) : [e]).forEach((s) => {
      var i, n, o, a = typeof s == "string" ? s : s.type + ":" + s.execute + "." + s.scope;
      typeof s == "string" && ([n, i] = s.split("."), [n, o] = n.replace(":complete", ":after").replace(":done", ":after").split(":"), s = { type: n, execute: o ?? "before", scope: i }), (s = w.extend({ type: null, execute: "before", onComplete: null }, s)).type ? t ? (Array.isArray(this.listeners) || (this.listeners = []), this.listeners.push({ name: a, edata: s, handler: t }), this.debug && console.log("w2base: add event", { name: a, edata: s, handler: t })) : console.log("ERROR: You must specify event handler function when calling .on() method of " + this.name) : console.log("ERROR: You must specify event type when calling .on() method of " + this.name);
    }), this;
  }
  off(e, t) {
    return (e = typeof e == "string" ? e.split(/[,\s]+/) : [e]).forEach((s) => {
      var i, n, o, a = typeof s == "string" ? s : s.type + ":" + s.execute + "." + s.scope;
      if (typeof s == "string" && ([n, i] = s.split("."), [n, o] = n.replace(":complete", ":after").replace(":done", ":after").split(":"), s = { type: n || "*", execute: o || "", scope: i || "" }), (s = w.extend({ type: null, execute: null, onComplete: null }, s)).type || s.scope) {
        t = t || null;
        let l = 0;
        this.listeners = this.listeners.filter((c) => s.type !== "*" && s.type !== c.edata.type || s.execute !== "" && s.execute !== c.edata.execute || s.scope !== "" && s.scope !== c.edata.scope || s.handler != null && s.handler !== c.edata.handler || (l++, false)), this.debug && console.log(`w2base: remove event (${l})`, { name: a, edata: s, handler: t });
      } else console.log("ERROR: You must specify event type when calling .off() method of " + this.name);
    }), this;
  }
  trigger(e, t) {
    if (arguments.length == 1 ? t = e : (t.type = e, t.target = t.target ?? this), w.isPlainObject(t) && t.phase == "after") {
      if (!(t = this.activeEvents.find((o) => o.type == t.type && o.target == t.target))) return void console.log(`ERROR: Cannot find even handler for "${t.type}" on "${t.target}".`);
      console.log(`NOTICE: This syntax "edata.trigger({ phase: 'after' })" is outdated. Use edata.finish() instead.`);
    } else t instanceof ka || (t = new ka(this, t), this.activeEvents.push(t));
    let s, i, n;
    Array.isArray(this.listeners) || (this.listeners = []), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
    for (let o = this.listeners.length - 1; 0 <= o; o--) {
      let a = this.listeners[o];
      if (!(a == null || a.edata.type !== t.type && a.edata.type !== "*" || a.edata.target !== t.target && a.edata.target != null || a.edata.execute !== t.phase && a.edata.execute !== "*" && a.edata.phase !== "*") && (Object.keys(a.edata).forEach((l) => {
        t[l] == null && a.edata[l] != null && (t[l] = a.edata[l]);
      }), s = [], n = new RegExp(/\((.*?)\)/).exec(String(a.handler).split("=>")[0]), (s = n ? n[1].split(/\s*,\s*/) : s).length === 2 ? (a.handler.call(this, t.target, t), this.debug && console.log(" - call (old)", a.handler)) : (a.handler.call(this, t), this.debug && console.log(" - call", a.handler)), t.isStopped === true || t.stop === true)) return t;
    }
    if (e = "on" + t.type.substr(0, 1).toUpperCase() + t.type.substr(1), !(t.phase === "before" && typeof this[e] == "function" && (i = this[e], s = [], n = new RegExp(/\((.*?)\)/).exec(String(i).split("=>")[0]), (s = n ? n[1].split(/\s*,\s*/) : s).length === 2 ? (i.call(this, t.target, t), this.debug && console.log(" - call: on[Event] (old)", i)) : (i.call(this, t), this.debug && console.log(" - call: on[Event]", i)), t.isStopped === true || t.stop === true) || t.object != null && t.phase === "before" && typeof t.object[e] == "function" && (i = t.object[e], s = [], n = new RegExp(/\((.*?)\)/).exec(String(i).split("=>")[0]), (s = n ? n[1].split(/\s*,\s*/) : s).length === 2 ? (i.call(this, t.target, t), this.debug && console.log(" - call: edata.object (old)", i)) : (i.call(this, t), this.debug && console.log(" - call: edata.object", i)), t.isStopped === true || t.stop === true) || t.phase !== "after")) {
      typeof t.onComplete == "function" && t.onComplete.call(this, t);
      for (let o = 0; o < t.listeners.length; o++) typeof t.listeners[o] == "function" && (t.listeners[o].call(this, t), this.debug) && console.log(" - call: done", i);
      t._resolve(t), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
    }
    return t;
  }
}
const ro = { locale: "en-US", dateFormat: "m/d/yyyy", timeFormat: "hh:mi pm", datetimeFormat: "m/d/yyyy|hh:mi pm", currencyPrefix: "$", currencySuffix: "", currencyPrecision: 2, groupSymbol: ",", decimalSymbol: ".", shortmonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], fullmonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], shortdays: ["M", "T", "W", "T", "F", "S", "S"], fulldays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], weekStarts: "S", phrases: { "${count} letters or more...": "---", "Add new record": "---", "Add New": "---", "Advanced Search": "---", after: "---", "AJAX error. See console for more details.": "---", "All Fields": "---", All: "---", Any: "---", "Are you sure you want to delete ${count} ${records}?": "---", "Attach files by dragging and dropping or Click to Select": "---", before: "---", "begins with": "---", begins: "---", between: "---", buffered: "---", Cancel: "---", Close: "---", Column: "---", Confirmation: "---", contains: "---", Copied: "---", "Copy to clipboard": "---", "Current Date & Time": "---", "Delete selected records": "---", Delete: "---", 'Do you want to delete search item "${item}"?': "---", "Edit selected record": "---", Edit: "---", "Empty list": "---", "ends with": "---", ends: "---", "Field should be at least ${count} characters.": "---", Hide: "---", in: "---", "is not": "---", is: "---", "less than": "---", "Line #": "---", "Load ${count} more...": "---", "Loading...": "---", "Maximum number of files is ${count}": "---", "Maximum total size is ${count}": "---", Modified: "---", "more than": "---", "Multiple Fields": "---", Name: "---", "No items found": "---", "No matches": "---", No: "---", none: "---", "Not a float": "---", "Not a hex number": "---", "Not a valid date": "---", "Not a valid email": "---", "Not alpha-numeric": "---", "Not an integer": "---", "Not in money format": "---", "not in": "---", Notification: "---", of: "---", Ok: "---", Opacity: "---", "Record ID": "---", record: "---", records: "---", "Refreshing...": "---", "Reload data in the list": "---", Remove: "---", "Remove This Field": "---", "Request aborted.": "---", "Required field": "---", Reset: "---", "Restore Default State": "---", "Returned data is not in valid JSON format.": "---", "Save changed records": "---", "Save Grid State": "---", Save: "---", "Saved Searches": "---", "Saving...": "---", "Search took ${count} seconds": "---", Search: "---", "Select Hour": "---", "Select Minute": "---", selected: "---", "Server Response ${count} seconds": "---", "Show/hide columns": "---", Show: "---", Size: "---", Skip: "---", "Sorting took ${count} seconds": "---", "Type to search...": "---", Type: "---", Yes: "---", Yesterday: "---", "Your remote data source record count has changed, reloading from the first record.": "---" } };
const _Ct = class _Ct {
  constructor(e, t, s) {
    this.context = t ?? document, this.previous = s ?? null;
    let i = [];
    if (Array.isArray(e)) i = e;
    else if (e instanceof Node || e instanceof Window) i = [e];
    else if (e instanceof _Ct) i = e.nodes;
    else if (typeof e == "string") {
      if (typeof this.context.querySelector != "function") throw new Error("Invalid context");
      i = Array.from(this.context.querySelectorAll(e));
    } else if (e == null) i = [];
    else {
      if (t = Array.from(e ?? []), typeof e != "object" || !Array.isArray(t)) throw new Error(`Invalid selector "${e}"`);
      i = t;
    }
    this.nodes = i, this.length = i.length, this.each((n, o) => {
      this[o] = n;
    });
  }
  static _fragment(e) {
    let t = document.createElement("template");
    return t.innerHTML = e, t.content.childNodes.forEach((s) => {
      var i = _Ct._scriptConvert(s);
      i != s && t.content.replaceChild(i, s);
    }), t.content;
  }
  static _scriptConvert(e) {
    let t = (s) => {
      var i = s.ownerDocument.createElement("script"), n = (i.text = s.text, s.attributes);
      for (let o = 0; o < n.length; o++) i.setAttribute(n[o].name, n[o].value);
      return i;
    };
    return (e = e.tagName == "SCRIPT" ? t(e) : e).querySelectorAll && e.querySelectorAll("script").forEach((s) => {
      s.parentNode.replaceChild(t(s), s);
    }), e;
  }
  static _fixProp(e) {
    var t = { cellpadding: "cellPadding", cellspacing: "cellSpacing", class: "className", colspan: "colSpan", contenteditable: "contentEditable", for: "htmlFor", frameborder: "frameBorder", maxlength: "maxLength", readonly: "readOnly", rowspan: "rowSpan", tabindex: "tabIndex", usemap: "useMap" };
    return t[e] || e;
  }
  _insert(e, t) {
    let s = [], i = this.length;
    if (!(i < 1)) {
      let n = this;
      if (typeof t == "string") this.each((o) => {
        var a = _Ct._fragment(t);
        s.push(...a.childNodes), o[e](a);
      });
      else if (t instanceof _Ct) {
        let o = i == 1;
        t.each((a) => {
          this.each((l) => {
            var c = o ? a : a.cloneNode(true);
            s.push(c), l[e](c), _Ct._scriptConvert(c);
          });
        }), o || t.remove();
      } else {
        if (!(t instanceof Node)) throw new Error(`Incorrect argument for "${e}(html)". It expects one string argument.`);
        this.each((o) => {
          var a = i === 1 ? t : _Ct._fragment(t.outerHTML);
          s.push(...i === 1 ? [t] : a.childNodes), o[e](a);
        }), 1 < i && t.remove();
      }
      return n = e == "replaceWith" ? new _Ct(s, this.context, this) : n;
    }
  }
  _save(e, t, s) {
    e._mQuery = e._mQuery ?? {}, Array.isArray(s) ? (e._mQuery[t] = e._mQuery[t] ?? [], e._mQuery[t].push(...s)) : s != null ? e._mQuery[t] = s : delete e._mQuery[t];
  }
  get(e) {
    var t = this[e = e < 0 ? this.length + e : e];
    return t || (e != null ? null : this.nodes);
  }
  eq(e) {
    let t = [this[e = e < 0 ? this.length + e : e]];
    return t[0] == null && (t = []), new _Ct(t, this.context, this);
  }
  then(e) {
    return e = e(this), e ?? this;
  }
  find(e) {
    let t = [];
    return this.each((s) => {
      s = Array.from(s.querySelectorAll(e)), 0 < s.length && t.push(...s);
    }), new _Ct(t, this.context, this);
  }
  filter(e) {
    let t = [];
    return this.each((s) => {
      (s === e || typeof e == "string" && s.matches && s.matches(e) || typeof e == "function" && e(s)) && t.push(s);
    }), new _Ct(t, this.context, this);
  }
  next() {
    let e = [];
    return this.each((t) => {
      t = t.nextElementSibling, t && e.push(t);
    }), new _Ct(e, this.context, this);
  }
  prev() {
    let e = [];
    return this.each((t) => {
      t = t.previousElementSibling, t && e.push(t);
    }), new _Ct(e, this.context, this);
  }
  shadow(e) {
    let t = [];
    this.each((i) => {
      i.shadowRoot && t.push(i.shadowRoot);
    });
    var s = new _Ct(t, this.context, this);
    return e ? s.find(e) : s;
  }
  closest(e) {
    let t = [];
    return this.each((s) => {
      s = s.closest(e), s && t.push(s);
    }), new _Ct(t, this.context, this);
  }
  host(e) {
    let t = [], s = (n) => n.parentNode ? s(n.parentNode) : n, i = (n) => {
      n = s(n), t.push(n.host || n), n.host && e && i(n.host);
    };
    return this.each((n) => {
      i(n);
    }), new _Ct(t, this.context, this);
  }
  parent(e) {
    return this.parents(e, true);
  }
  parents(e, t) {
    let s = [], i = (o) => {
      if (s.indexOf(o) == -1 && s.push(o), !t && o.parentNode) return i(o.parentNode);
    };
    this.each((o) => {
      o.parentNode && i(o.parentNode);
    });
    var n = new _Ct(s, this.context, this);
    return e ? n.filter(e) : n;
  }
  add(e) {
    return e = e instanceof _Ct ? e.nodes : Array.isArray(e) ? e : [e], new _Ct(this.nodes.concat(e), this.context, this);
  }
  each(e) {
    return this.nodes.forEach((t, s) => {
      e(t, s, this);
    }), this;
  }
  append(e) {
    return this._insert("append", e);
  }
  prepend(e) {
    return this._insert("prepend", e);
  }
  after(e) {
    return this._insert("after", e);
  }
  before(e) {
    return this._insert("before", e);
  }
  replace(e) {
    return this._insert("replaceWith", e);
  }
  remove() {
    return this.each((e) => {
      e.remove();
    }), this;
  }
  css(e, t) {
    let s = e;
    var i, n = arguments.length;
    return n === 0 || n === 1 && typeof e == "string" ? this[0] ? (n = this[0].style, typeof e == "string" ? (i = n.getPropertyPriority(e), n.getPropertyValue(e) + (i ? "!" + i : "")) : Object.fromEntries(this[0].style.cssText.split(";").filter((o) => !!o).map((o) => o.split(":").map((a) => a.trim())))) : void 0 : (typeof e != "object" && ((s = {})[e] = t), this.each((o, a) => {
      Object.keys(s).forEach((l) => {
        var c = String(s[l]).toLowerCase().includes("!important") ? "important" : "";
        o.style.setProperty(l, String(s[l]).replace(/\!important/i, ""), c);
      });
    }), this);
  }
  addClass(e) {
    return this.toggleClass(e, true), this;
  }
  removeClass(e) {
    return this.toggleClass(e, false), this;
  }
  toggleClass(e, t) {
    return typeof e == "string" && (e = e.split(/[,\s]+/)), this.each((s) => {
      let i = e;
      (i = i == null && t === false ? Array.from(s.classList) : i).forEach((n) => {
        if (n !== "") {
          let o = t != null ? t ? "add" : "remove" : "toggle";
          s.classList[o](n);
        }
      });
    }), this;
  }
  hasClass(e) {
    if ((e = typeof e == "string" ? e.split(/[,\s]+/) : e) == null && 0 < this.length) return Array.from(this[0].classList);
    let t = false;
    return this.each((s) => {
      t = t || e.every((i) => Array.from(s.classList ?? []).includes(i));
    }), t;
  }
  on(e, t, s) {
    typeof t == "function" && (s = t, t = void 0);
    let i;
    return (t == null ? void 0 : t.delegate) && (i = t.delegate, delete t.delegate), (e = e.split(/[,\s]+/)).forEach((n) => {
      let [o, a] = String(n).toLowerCase().split(".");
      if (i) {
        let l = s;
        s = (c) => {
          var h = d(c.target).parents(i);
          0 < h.length ? c.delegate = h[0] : c.delegate = c.target, (c.target.matches(i) || 0 < h.length) && l(c);
        };
      }
      this.each((l) => {
        this._save(l, "events", [{ event: o, scope: a, callback: s, options: t }]), l.addEventListener(o, s, t);
      });
    }), this;
  }
  off(e, t, s) {
    return typeof t == "function" && (s = t, t = void 0), (e = (e ?? "").split(/[,\s]+/)).forEach((i) => {
      let [n, o] = String(i).toLowerCase().split(".");
      this.each((a) => {
        var _a2;
        if (Array.isArray((_a2 = a._mQuery) == null ? void 0 : _a2.events)) for (let c = a._mQuery.events.length - 1; 0 <= c; c--) {
          var l = a._mQuery.events[c];
          o == null || o === "" ? l.event != n && n !== "" || l.callback != s && s != null || (a.removeEventListener(l.event, l.callback, l.options), a._mQuery.events.splice(c, 1)) : l.event != n && n !== "" || l.scope != o || (a.removeEventListener(l.event, l.callback, l.options), a._mQuery.events.splice(c, 1));
        }
      });
    }), this;
  }
  trigger(e, t) {
    let s;
    return s = e instanceof Event || e instanceof CustomEvent ? e : new (["click", "dblclick", "mousedown", "mouseup", "mousemove"].includes(e) ? MouseEvent : ["keydown", "keyup", "keypress"].includes(e) ? KeyboardEvent : Event)(e, t), this.each((i) => {
      i.dispatchEvent(s);
    }), this;
  }
  attr(e, t) {
    if (t === void 0 && typeof e == "string") return this[0] ? this[0].getAttribute(e) : void 0;
    {
      let s = {};
      return typeof e == "object" ? s = e : s[e] = t, this.each((i) => {
        Object.entries(s).forEach(([n, o]) => {
          i.setAttribute(n, o);
        });
      }), this;
    }
  }
  removeAttr() {
    return this.each((e) => {
      Array.from(arguments).forEach((t) => {
        e.removeAttribute(t);
      });
    }), this;
  }
  prop(e, t) {
    if (t === void 0 && typeof e == "string") return this[0] ? this[0][e] : void 0;
    {
      let s = {};
      return typeof e == "object" ? s = e : s[e] = t, this.each((i) => {
        Object.entries(s).forEach(([n, o]) => {
          n = _Ct._fixProp(n), i[n] = o, n == "innerHTML" && _Ct._scriptConvert(i);
        });
      }), this;
    }
  }
  removeProp() {
    return this.each((e) => {
      Array.from(arguments).forEach((t) => {
        delete e[_Ct._fixProp(t)];
      });
    }), this;
  }
  data(e, t) {
    if (e instanceof Object) Object.entries(e).forEach((s) => {
      this.data(s[0], s[1]);
    });
    else {
      if (e && e.indexOf("-") != -1 && console.error(`Key "${e}" contains "-" (dash). Dashes are not allowed in property names. Use camelCase instead.`), !(arguments.length < 2)) return this.each((s) => {
        t != null ? s.dataset[e] = t instanceof Object ? JSON.stringify(t) : t : delete s.dataset[e];
      }), this;
      if (this[0]) {
        let s = Object.assign({}, this[0].dataset);
        return Object.keys(s).forEach((i) => {
          if (s[i].startsWith("[") || s[i].startsWith("{")) try {
            s[i] = JSON.parse(s[i]);
          } catch {
          }
        }), e ? s[e] : s;
      }
    }
  }
  removeData(e) {
    return typeof e == "string" && (e = e.split(/[,\s]+/)), this.each((t) => {
      e.forEach((s) => {
        delete t.dataset[s];
      });
    }), this;
  }
  show() {
    return this.toggle(true);
  }
  hide() {
    return this.toggle(false);
  }
  toggle(e) {
    return this.each((t) => {
      var _a2;
      var s, i = t.style.display, n = getComputedStyle(t).display, o = i == "none" || n == "none";
      !o || e != null && e !== true || (s = t instanceof HTMLTableRowElement ? "table-row" : t instanceof HTMLTableCellElement ? "table-cell" : "block", t.style.display = ((_a2 = t._mQuery) == null ? void 0 : _a2.prevDisplay) ?? (i == n && n != "none" ? "" : s), this._save(t, "prevDisplay", null)), o || e != null && e !== false || (n != "none" && this._save(t, "prevDisplay", n), t.style.setProperty("display", "none"));
    });
  }
  empty() {
    return this.html("");
  }
  html(e) {
    return this.prop("innerHTML", e);
  }
  text(e) {
    return this.prop("textContent", e);
  }
  val(e) {
    return this.prop("value", e);
  }
  change() {
    return this.trigger("change");
  }
  click() {
    return this.trigger("click");
  }
};
__publicField(_Ct, "version", 0.7);
let Ct = _Ct;
let d = function(r, e) {
  if (typeof r != "function") return new Ct(r, e);
  document.readyState == "complete" ? r() : window.addEventListener("load", r);
}, Os = (d.html = (r) => (r = Ct._fragment(r), d(r.children, r)), d.version = Ct.version, {});
class Ur {
  constructor() {
    this.version = "2.0.x", this.tmp = {}, this.settings = this.extend({}, { dataType: "HTTPJSON", dateStartYear: 1950, dateEndYear: 2030, macButtonOrder: false, warnNoPhrase: false }, ro, { phrases: null }), this.i18nCompare = Intl.Collator().compare, this.hasLocalStorage = function() {
      var e = "w2ui_test";
      try {
        return localStorage.setItem(e, e), localStorage.removeItem(e), true;
      } catch {
        return false;
      }
    }(), this.isMac = /Mac/i.test(navigator.platform), this.isMobile = /(iphone|ipod|ipad|mobile|android)/i.test(navigator.userAgent), this.isIOS = /(iphone|ipod|ipad)/i.test(navigator.platform), this.isAndroid = /(android)/i.test(navigator.userAgent), this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), this.formatters = { number(e, t) {
      return 20 < parseInt(t) && (t = 20), parseInt(t) < 0 && (t = 0), e == null || e === "" ? "" : w.formatNumber(parseFloat(e), t, true);
    }, float(e, t) {
      return w.formatters.number(e, t);
    }, int(e, t) {
      return w.formatters.number(e, 0);
    }, money(e, t) {
      return e == null || e === "" ? "" : (e = w.formatNumber(Number(e), w.settings.currencyPrecision), (w.settings.currencyPrefix || "") + e + (w.settings.currencySuffix || ""));
    }, currency(e, t) {
      return w.formatters.money(e, t);
    }, percent(e, t) {
      return e == null || e === "" ? "" : w.formatNumber(e, t || 1) + "%";
    }, size(e, t) {
      return e == null || e === "" ? "" : w.formatSize(parseInt(e));
    }, date(e, t) {
      if (t === "" && (t = w.settings.dateFormat), e == null || e === 0 || e === "") return "";
      let s = w.isDateTime(e, t, true);
      return '<span title="' + (s = s === false ? w.isDate(e, t, true) : s) + '">' + w.formatDate(s, t) + "</span>";
    }, datetime(e, t) {
      if (t === "" && (t = w.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let s = w.isDateTime(e, t, true);
      return '<span title="' + (s = s === false ? w.isDate(e, t, true) : s) + '">' + w.formatDateTime(s, t) + "</span>";
    }, time(e, t) {
      if (t === "" && (t = w.settings.timeFormat), e == null || e === 0 || e === "") return "";
      let s = w.isDateTime(e, t = (t = t === "h12" ? "hh:mi pm" : t) === "h24" ? "h24:mi" : t, true);
      return '<span title="' + (s = s === false ? w.isDate(e, t, true) : s) + '">' + w.formatTime(e, t) + "</span>";
    }, timestamp(e, t) {
      if (t === "" && (t = w.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let s = w.isDateTime(e, t, true);
      return (s = s === false ? w.isDate(e, t, true) : s).toString ? s.toString() : "";
    }, gmt(e, t) {
      if (t === "" && (t = w.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
      let s = w.isDateTime(e, t, true);
      return (s = s === false ? w.isDate(e, t, true) : s).toUTCString ? s.toUTCString() : "";
    }, age(e, t) {
      if (e == null || e === 0 || e === "") return "";
      let s = w.isDateTime(e, null, true);
      return '<span title="' + (s = s === false ? w.isDate(e, null, true) : s) + '">' + w.age(e) + (t ? " " + t : "") + "</span>";
    }, interval(e, t) {
      return e == null || e === 0 || e === "" ? "" : w.interval(e) + (t ? " " + t : "");
    }, toggle(e, t) {
      return e ? "Yes" : "";
    }, password(e, t) {
      let s = "";
      for (let i = 0; i < e.length; i++) s += "*";
      return s;
    } };
  }
  isBin(e) {
    return /^[0-1]+$/.test(e);
  }
  isInt(e) {
    return /^[-+]?[0-9]+$/.test(e);
  }
  isFloat(e) {
    return (typeof (e = typeof e == "string" ? e.replace(this.settings.groupSymbol, "").replace(this.settings.decimalSymbol, ".") : e) == "number" || typeof e == "string" && e !== "") && !isNaN(Number(e));
  }
  isMoney(e) {
    var t, s;
    return typeof e != "object" && e !== "" && (!!this.isFloat(e) || (t = this.settings, s = new RegExp("^" + (t.currencyPrefix ? "\\" + t.currencyPrefix + "?" : "") + "[-+]?" + (t.currencyPrefix ? "\\" + t.currencyPrefix + "?" : "") + "[0-9]*[\\" + t.decimalSymbol + "]?[0-9]+" + (t.currencySuffix ? "\\" + t.currencySuffix + "?" : "") + "$", "i"), typeof e == "string" && (e = e.replace(new RegExp(t.groupSymbol, "g"), "")), s.test(e)));
  }
  isHex(e) {
    return /^(0x)?[0-9a-fA-F]+$/.test(e);
  }
  isAlphaNumeric(e) {
    return /^[a-zA-Z0-9_-]+$/.test(e);
  }
  isEmail(e) {
    return /^[a-zA-Z0-9._%\-+]+@[а-яА-Яa-zA-Z0-9.-]+\.[а-яА-Яa-zA-Z]+$/.test(e);
  }
  isIpAddress(e) {
    return new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$").test(e);
  }
  isDate(e, t, s) {
    if (!e) return false;
    var i = "Invalid Date";
    let n, o, a;
    if (t == null && (t = this.settings.dateFormat), typeof e.getFullYear == "function") a = e.getFullYear(), n = e.getMonth() + 1, o = e.getDate();
    else if (parseInt(e) == e && 0 < parseInt(e)) e = new Date(parseInt(e)), a = e.getFullYear(), n = e.getMonth() + 1, o = e.getDate();
    else {
      if (e = String(e), new RegExp("mon", "ig").test(t)) {
        t = t.replace(/month/gi, "m").replace(/mon/gi, "m").replace(/dd/gi, "d").replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase(), e = e.replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase();
        for (let p = 0, f = this.settings.fullmonths.length; p < f; p++) {
          var l = this.settings.fullmonths[p];
          e = e.replace(new RegExp(l, "ig"), parseInt(p) + 1).replace(new RegExp(l.substr(0, 3), "ig"), parseInt(p) + 1);
        }
      }
      var c = e.replace(/-/g, "/").replace(/\./g, "/").toLowerCase().split("/"), t = t.replace(/-/g, "/").replace(/\./g, "/").toLowerCase();
      t === "mm/dd/yyyy" && (n = c[0], o = c[1], a = c[2]), t === "m/d/yyyy" && (n = c[0], o = c[1], a = c[2]), t === "dd/mm/yyyy" && (n = c[1], o = c[0], a = c[2]), t === "d/m/yyyy" && (n = c[1], o = c[0], a = c[2]), t === "yyyy/dd/mm" && (n = c[2], o = c[1], a = c[0]), t === "yyyy/d/m" && (n = c[2], o = c[1], a = c[0]), t === "yyyy/mm/dd" && (n = c[1], o = c[2], a = c[0]), t === "yyyy/m/d" && (n = c[1], o = c[2], a = c[0]), t === "mm/dd/yy" && (n = c[0], o = c[1], a = c[2]), t === "m/d/yy" && (n = c[0], o = c[1], a = parseInt(c[2]) + 1900), t === "dd/mm/yy" && (n = c[1], o = c[0], a = parseInt(c[2]) + 1900), t === "d/m/yy" && (n = c[1], o = c[0], a = parseInt(c[2]) + 1900), t === "yy/dd/mm" && (n = c[2], o = c[1], a = parseInt(c[0]) + 1900), t === "yy/d/m" && (n = c[2], o = c[1], a = parseInt(c[0]) + 1900), t === "yy/mm/dd" && (n = c[1], o = c[2], a = parseInt(c[0]) + 1900), t === "yy/m/d" && (n = c[1], o = c[2], a = parseInt(c[0]) + 1900);
    }
    return !!this.isInt(a) && !!this.isInt(n) && !!this.isInt(o) && (a = +a, n = +n, o = +o, (i = new Date(a, n - 1, o)).setFullYear(a), n != null) && String(i) !== "Invalid Date" && i.getMonth() + 1 === n && i.getDate() === o && i.getFullYear() === a && (s !== true || i);
  }
  isTime(a, t) {
    if (a == null) return false;
    let s, i, n;
    i = 0 <= (a = (a = String(a)).toUpperCase()).indexOf("AM");
    var o = (n = 0 <= a.indexOf("PM")) || i, a = (s = o ? 12 : 24, (a = a.replace("AM", "").replace("PM", "").trim()).split(":"));
    let l = parseInt(a[0] || 0), c = parseInt(a[1] || 0), h = parseInt(a[2] || 0);
    return (o && a.length === 1 || a.length === 2 || a.length === 3) && !(a[0] === "" || l < 0 || l > s || !this.isInt(a[0]) || 2 < a[0].length || 1 < a.length && (a[1] === "" || c < 0 || 59 < c || !this.isInt(a[1]) || a[1].length !== 2) || 2 < a.length && (a[2] === "" || h < 0 || 59 < h || !this.isInt(a[2]) || a[2].length !== 2) || !(o || s !== l || c === 0 && h === 0) || o && a.length === 1 && l === 0) && (t !== true || (n && l !== 12 && (l += 12), i && l === 12 && (l += 12), { hours: l, minutes: c, seconds: h }));
  }
  isDateTime(e, t, s) {
    var i;
    return typeof e.getFullYear == "function" ? s !== true || e : (i = parseInt(e)) === e ? !(i < 0) && (s !== true || new Date(i)) : (i = String(e).indexOf(" ")) < 0 ? !(String(e).indexOf("T") < 0 || String(new Date(e)) == "Invalid Date") && (s !== true || new Date(e)) : (t = (t = t ?? this.settings.datetimeFormat).split("|"), e = [e.substr(0, i), e.substr(i).trim()], t[0] = t[0].trim(), t[1] && (t[1] = t[1].trim()), i = this.isDate(e[0], t[0], true), t = this.isTime(e[1], true), i !== false && t !== false && (s !== true || (i.setHours(t.hours), i.setMinutes(t.minutes), i.setSeconds(t.seconds), i)));
  }
  age(e) {
    let t;
    if (e === "" || e == null || (t = typeof e.getFullYear == "function" ? e : parseInt(e) == e && 0 < parseInt(e) ? new Date(parseInt(e)) : new Date(e), String(t) === "Invalid Date")) return "";
    e = ((/* @__PURE__ */ new Date()).getTime() - t.getTime()) / 1e3;
    let s = "", i = "";
    return e < 0 ? (s = 0, i = "sec") : e < 60 ? (s = Math.floor(e), i = "sec", e < 0 && (s = 0, i = "sec")) : e < 3600 ? (s = Math.floor(e / 60), i = "min") : e < 86400 ? (s = Math.floor(e / 60 / 60), i = "hour") : e < 2592e3 ? (s = Math.floor(e / 24 / 60 / 60), i = "day") : e < 31536e3 ? (s = Math.floor(e / 30 / 24 / 60 / 60 * 10) / 10, i = "month") : e < 126144e3 ? (s = Math.floor(e / 365 / 24 / 60 / 60 * 10) / 10, i = "year") : 126144e3 <= e && (s = Math.floor(e / 365.25 / 24 / 60 / 60 * 10) / 10, i = "year"), s + " " + i + (1 < s ? "s" : "");
  }
  interval(e) {
    return e < 100 ? "< 0.01 sec" : e < 1e3 ? Math.floor(e / 10) / 100 + " sec" : e < 1e4 ? Math.floor(e / 100) / 10 + " sec" : e < 6e4 ? Math.floor(e / 1e3) + " secs" : e < 36e5 ? Math.floor(e / 6e4) + " mins" : e < 864e5 ? Math.floor(e / 36e5 * 10) / 10 + " hours" : e < 2628e6 ? Math.floor(e / 864e5 * 10) / 10 + " days" : e < 31536e6 ? Math.floor(e / 2628e6 * 10) / 10 + " months" : Math.floor(e / 31536e5) / 10 + " years";
  }
  date(n) {
    if (n === "" || n == null || typeof n == "object" && !n.getMonth) return "";
    let t = new Date(n);
    if (this.isInt(n) && (t = new Date(Number(n))), String(t) === "Invalid Date") return "";
    var n = this.settings.shortmonths, i = /* @__PURE__ */ new Date(), o = /* @__PURE__ */ new Date(), s = (o.setTime(o.getTime() - 864e5), n[t.getMonth()] + " " + t.getDate() + ", " + t.getFullYear()), i = n[i.getMonth()] + " " + i.getDate() + ", " + i.getFullYear(), n = n[o.getMonth()] + " " + o.getDate() + ", " + o.getFullYear(), o = t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + " " + (12 <= t.getHours() ? "pm" : "am");
    let a = s == i ? o : s;
    return '<span title="' + s + " " + (t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + ":" + (t.getSeconds() < 10 ? "0" : "") + t.getSeconds() + " " + (12 <= t.getHours() ? "pm" : "am")) + '">' + (a = s == n ? this.lang("Yesterday") : a) + "</span>";
  }
  formatSize(e) {
    var t;
    return this.isFloat(e) && e !== "" ? (e = parseFloat(e)) === 0 ? 0 : (t = parseInt(Math.floor(Math.log(e) / Math.log(1024))), (Math.floor(e / Math.pow(1024, t) * 10) / 10).toFixed(t === 0 ? 0 : 1) + " " + (["Bt", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"][t] || "??")) : "";
  }
  formatNumber(e, t, s) {
    return e == null || e === "" || typeof e == "object" ? "" : (s = { minimumFractionDigits: parseInt(t), maximumFractionDigits: parseInt(t), useGrouping: !!s }, (t == null || t < 0) && (s.minimumFractionDigits = 0, s.maximumFractionDigits = 20), parseFloat(e).toLocaleString(this.settings.locale, s));
  }
  formatDate(e, t) {
    if (t = t || this.settings.dateFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
    let s = new Date(e);
    var i, n;
    return this.isInt(e) && (s = new Date(Number(e))), String(s) === "Invalid Date" ? "" : (e = s.getFullYear(), i = s.getMonth(), n = s.getDate(), t.toLowerCase().replace("month", this.settings.fullmonths[i]).replace("mon", this.settings.shortmonths[i]).replace(/yyyy/g, ("000" + e).slice(-4)).replace(/yyy/g, ("000" + e).slice(-4)).replace(/yy/g, ("0" + e).slice(-2)).replace(/(^|[^a-z$])y/g, "$1" + e).replace(/mm/g, ("0" + (i + 1)).slice(-2)).replace(/dd/g, ("0" + n).slice(-2)).replace(/th/g, n == 1 ? "st" : "th").replace(/th/g, n == 2 ? "nd" : "th").replace(/th/g, n == 3 ? "rd" : "th").replace(/(^|[^a-z$])m/g, "$1" + (i + 1)).replace(/(^|[^a-z$])d/g, "$1" + n));
  }
  formatTime(e, t) {
    if (t = t || this.settings.timeFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
    let s = new Date(e);
    if (this.isInt(e) && (s = new Date(Number(e))), this.isTime(e) && (e = this.isTime(e, true), (s = /* @__PURE__ */ new Date()).setHours(e.hours), s.setMinutes(e.minutes)), String(s) === "Invalid Date") return "";
    let i = "am", n = s.getHours();
    e = s.getHours();
    let o = s.getMinutes(), a = s.getSeconds();
    return o < 10 && (o = "0" + o), a < 10 && (a = "0" + a), t.indexOf("am") === -1 && t.indexOf("pm") === -1 || (12 <= n && (i = "pm"), 12 < n && (n -= 12), n === 0 && (n = 12)), t.toLowerCase().replace("am", i).replace("pm", i).replace("hhh", n < 10 ? "0" + n : n).replace("hh24", e < 10 ? "0" + e : e).replace("h24", e).replace("hh", n).replace("mm", o).replace("mi", o).replace("ss", a).replace(/(^|[^a-z$])h/g, "$1" + n).replace(/(^|[^a-z$])m/g, "$1" + o).replace(/(^|[^a-z$])s/g, "$1" + a);
  }
  formatDateTime(e, t) {
    let s;
    return e === "" || e == null || typeof e == "object" && !e.getMonth ? "" : (typeof t != "string" ? s = [this.settings.dateFormat, this.settings.timeFormat] : ((s = t.split("|"))[0] = s[0].trim(), s[1] = 1 < s.length ? s[1].trim() : this.settings.timeFormat), s[1] === "h12" && (s[1] = "h:m pm"), s[1] === "h24" && (s[1] = "h24:m"), this.formatDate(e, s[0]) + " " + this.formatTime(e, s[1]));
  }
  stripSpaces(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/(?:\r\n|\r|\n)/g, " ").replace(/\s\s+/g, " ").trim();
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.stripSpaces(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.stripSpaces(e[t]);
        }));
    }
    return e;
  }
  stripTags(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/gi, "");
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.stripTags(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.stripTags(e[t]);
        }));
    }
    return e;
  }
  encodeTags(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.encodeTags(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.encodeTags(e[t]);
        }));
    }
    return e;
  }
  decodeTags(e) {
    if (e != null) switch (typeof e) {
      case "number":
        break;
      case "string":
        e = String(e).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        break;
      case "object":
        Array.isArray(e) ? (e = this.extend([], e)).forEach((t, s) => {
          e[s] = this.decodeTags(t);
        }) : (e = this.extend({}, e), Object.keys(e).forEach((t) => {
          e[t] = this.decodeTags(e[t]);
        }));
    }
    return e;
  }
  escapeId(e) {
    return e === "" || e == null ? "" : (e + "").replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, (t, s) => s ? t === "\0" ? "\uFFFD" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t);
  }
  unescapeId(e) {
    return e === "" || e == null ? "" : e.replace(/\\[\da-fA-F]{1,6}[\x20\t\r\n\f]?|\\([^\r\n\f])/g, (t, s) => (t = "0x" + t.slice(1) - 65536, s || (t < 0 ? String.fromCharCode(65536 + t) : String.fromCharCode(t >> 10 | 55296, 1023 & t | 56320))));
  }
  base64encode(e) {
    return btoa(e);
  }
  base64decode(e) {
    return atob(e);
  }
  async sha256(e) {
    return e = new TextEncoder().encode(e), crypto.subtle.digest("SHA-256", e).then((t) => Array.from(new Uint8Array(t)).map((s) => s.toString(16).padStart(2, "0")).join(""));
  }
  transition(e, t, s, i) {
    return new Promise((n, o) => {
      var a = getComputedStyle(e);
      let l = parseInt(a.width), c = parseInt(a.height);
      if (e && t) {
        switch (e.parentNode.style.cssText += "perspective: 900px; overflow: hidden;", e.style.cssText += "; position: absolute; z-index: 1019; backface-visibility: hidden", t.style.cssText += "; position: absolute; z-index: 1020; backface-visibility: hidden", s) {
          case "slide-left":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(" + l + "px, 0, 0)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(-" + l + "px, 0, 0)";
            }, 1);
            break;
          case "slide-right":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(-" + l + "px, 0, 0)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0px, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(" + l + "px, 0, 0)";
            }, 1);
            break;
          case "slide-down":
            e.style.cssText += "overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(0, " + c + "px, 0)";
            }, 1);
            break;
          case "slide-up":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(0, " + c + "px, 0)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)";
            }, 1);
            break;
          case "flip-left":
            e.style.cssText += "overflow: hidden; transform: rotateY(0deg)", t.style.cssText += "overflow: hidden; transform: rotateY(-180deg)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateY(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateY(180deg)";
            }, 1);
            break;
          case "flip-right":
            e.style.cssText += "overflow: hidden; transform: rotateY(0deg)", t.style.cssText += "overflow: hidden; transform: rotateY(180deg)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateY(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateY(-180deg)";
            }, 1);
            break;
          case "flip-down":
            e.style.cssText += "overflow: hidden; transform: rotateX(0deg)", t.style.cssText += "overflow: hidden; transform: rotateX(180deg)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateX(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateX(-180deg)";
            }, 1);
            break;
          case "flip-up":
            e.style.cssText += "overflow: hidden; transform: rotateX(0deg)", t.style.cssText += "overflow: hidden; transform: rotateX(-180deg)", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: rotateX(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateX(180deg)";
            }, 1);
            break;
          case "pop-in":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; transform: scale(1); opacity: 1;", e.style.cssText += "transition: 0.5s;";
            }, 1);
            break;
          case "pop-out":
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;", t.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; opacity: 1;", e.style.cssText += "transition: 0.5s; transform: scale(1.7); opacity: 0;";
            }, 1);
            break;
          default:
            e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; translate3d(0, 0, 0); opacity: 0;", d(t).show(), setTimeout(() => {
              t.style.cssText += "transition: 0.5s; opacity: 1;", e.style.cssText += "transition: 0.5s";
            }, 1);
        }
        setTimeout(() => {
          s === "slide-down" && (d(e).css("z-index", "1019"), d(t).css("z-index", "1020")), t && d(t).css({ opacity: "1" }).css({ transition: "", transform: "" }), e && d(e).css({ opacity: "1" }).css({ transition: "", transform: "" }), typeof i == "function" && i(), n();
        }, 500);
      } else console.log("ERROR: Cannot do transition when one of the divs is null");
    });
  }
  lock(e, t = {}) {
    if (e != null) {
      typeof t == "string" && (t = { msg: t }), arguments[2] && (t.spinner = arguments[2]), t = this.extend({ spinner: false }, t), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), t.msg || t.msg === 0 || (t.msg = ""), this.unlock(e);
      var s = d(e).get(0);
      let i = s.scrollWidth, n = s.scrollHeight, o = (s.tagName == "BODY" && (i < innerWidth && (i = innerWidth), n < innerHeight) && (n = innerHeight), d(e).prepend(`<div class="w2ui-lock" style="height: ${n}px; width: ${i}px"></div><div class="w2ui-lock-msg"></div>`), d(e).find(".w2ui-lock"));
      s = d(e).find(".w2ui-lock-msg"), e = (t.msg || s.css({ "background-color": "transparent", "background-image": "none", border: "0px", "box-shadow": "none" }), t.spinner === true && (t.msg = `<div class="w2ui-spinner" ${t.msg ? "" : 'style="width: 35px; height: 35px"'}></div>` + t.msg), t.msg ? s.html(t.msg).css("display", "block") : s.remove(), t.opacity != null && o.css("opacity", t.opacity), o.css({ display: "block" }), t.bgColor && o.css({ "background-color": t.bgColor }), getComputedStyle(o.get(0)));
      let a = e.opacity ?? 0.15;
      o.on("mousedown", function() {
        typeof t.onClick == "function" ? t.onClick() : o.css({ transition: ".2s", opacity: 1.5 * a });
      }).on("mouseup", function() {
        typeof t.onClick != "function" && o.css({ transition: ".2s", opacity: a });
      }).on("mousewheel", function(l) {
        l && (l.stopPropagation(), l.preventDefault());
      });
    }
  }
  unlock(e, t) {
    var s;
    e != null && (clearTimeout(e._prevUnlock), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), this.isInt(t) && 0 < t ? (d(e).find(".w2ui-lock").css({ transition: t / 1e3 + "s", opacity: 0 }), s = d(e).get(0), clearTimeout(s._prevUnlock), s._prevUnlock = setTimeout(() => {
      d(e).find(".w2ui-lock").remove();
    }, t)) : d(e).find(".w2ui-lock").remove(), d(e).find(".w2ui-lock-msg").remove());
  }
  message(e, t) {
    var _a2, _b;
    let s, i, n;
    var o = () => {
      var _a3;
      var b = d(e == null ? void 0 : e.box).find(".w2ui-message");
      b.length != 0 && typeof ((_a3 = t = b.get(0)._msg_options || {}) == null ? void 0 : _a3.close) == "function" && t.close();
    };
    let a = (b) => {
      var _a3, _b2;
      var C, _ = b.box._msg_prevFocus;
      d(e.box).find(".w2ui-message").length <= 1 ? e.owner ? e.owner.unlock(e.param, 150) : this.unlock(e.box, 150) : d(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + (b.msgIndex - 1)).css("z-index", 1500), _ ? 0 < (C = d(_).closest(".w2ui-message")).length ? C.get(0)._msg_options.setFocus(_) : _.focus() : typeof ((_b2 = e.owner) == null ? void 0 : _b2.focus) == "function" && e.owner.focus(), d(b.box).remove(), b.msgIndex === 0 && (x.css("z-index", b.tmp.zIndex), d(e.box).css("overflow", b.tmp.overflow)), b.trigger && n.finish();
    };
    if (typeof (t = typeof t != "string" && typeof t != "number" ? t : { width: String(t).length < 300 ? 350 : 550, height: String(t).length < 300 ? 170 : 250, text: String(t) }) != "object") return void o();
    t.text != null && (t.body = `<div class="w2ui-centered w2ui-msg-text">${t.text}</div>`), t.width == null && (t.width = 350), t.height == null && (t.height = 170), t.hideOn == null && (t.hideOn = ["esc"]), t.on == null && (h = t, t = new ni(), w.extend(t, h)), t.on("open", (b) => {
      w.bindEvents(d(t.box).find(".w2ui-eaction"), t), d(b.detail.box).find("button, input, textarea, [name=hidden-first]").off(".message").on("keydown.message", function(C) {
        C.keyCode == 27 && t.hideOn.includes("esc") && (t.cancelAction ? t.action(t.cancelAction) : t.close());
      }), setTimeout(() => t.setFocus(t.focus), 300);
    }), t.off(".prom");
    let l = { self: t, action(b) {
      return t.on("action.prom", b), l;
    }, close(b) {
      return t.on("close.prom", b), l;
    }, open(b) {
      return t.on("open.prom", b), l;
    }, then(b) {
      return t.on("open:after.prom", b), l;
    } }, c = (t.actions == null && t.buttons == null && t.html == null && (t.actions = { Ok(b) {
      b.detail.self.close();
    } }), t.off(".buttons"), t.actions != null && (t.buttons = "", Object.keys(t.actions).forEach((b) => {
      var C = t.actions[b];
      let _ = b;
      typeof C == "function" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${b}","event"]' name="${b}">${b}</button>`), typeof C == "object" && (t.buttons += `<button class="w2ui-btn w2ui-eaction ${C.class || ""}" name="${b}" data-click='["action","${b}","event"]'
                        style="${C.style ?? ""}" ${C.attrs ?? ""}>${C.text || b}</button>`, _ = Array.isArray(t.actions) ? C.text : b), typeof C == "string" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" name="${C}" data-click='["action","${C}","event"]'>${C}</button>`, _ = C), typeof _ == "string" && (_ = _[0].toLowerCase() + _.substr(1).replace(/\s+/g, "")), l[_] = function(S) {
        return t.on("action.buttons", (A) => {
          A.detail.action[0].toLowerCase() + A.detail.action.substr(1).replace(/\s+/g, "") == _ && S(A);
        }), l;
      };
    })), Array("html", "body", "buttons").forEach((b) => {
      t[b] = String(t[b] ?? "").trim();
    }), t.body === "" && t.buttons === "" || (t.html = `
                <div class="w2ui-message-body">${t.body || ""}</div>
                <div class="w2ui-message-buttons">${t.buttons || ""}</div>
            `), getComputedStyle(d(e.box).get(0)));
    var h = parseFloat(c.width), p = parseFloat(c.height);
    let f = 0, x = (0 < d(e.after).length && (c = getComputedStyle(d(e.after).get(0)), f = parseInt(c.display != "none" ? parseInt(c.height) : 0)), t.width > h && (t.width = h - 10), t.height > p - f && (t.height = p - 10 - f), t.originalWidth = t.width, t.originalHeight = t.height, parseInt(t.width) < 0 && (t.width = h + t.width), parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 0 && (t.height = p + t.height - f), parseInt(t.height) < 10 && (t.height = 10), t.originalHeight < 0 && (t.height = p + t.originalHeight - f), t.originalWidth < 0 && (t.width = h + 2 * t.originalWidth), d(e.box).find(e.after));
    return t.tmp || (t.tmp = { zIndex: x.css("z-index"), overflow: c.overflow }), t.html === "" && t.body === "" && t.buttons === "" ? o() : (t.msgIndex = d(e.box).find(".w2ui-message").length, t.msgIndex === 0 && typeof this.lock == "function" && (d(e.box).css("overflow", "hidden"), e.owner ? e.owner.lock(e.param) : this.lock(e.box)), d(e.box).find(".w2ui-message").css("z-index", 1390), x.css("z-index", 1501), p = `
                <div id="w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-${t.msgIndex}" class="w2ui-message" data-mousedown="stop"
                    style="z-index: 1500; left: ${(h - t.width) / 2}px; top: ${f}px;
                        width: ${t.width}px; height: ${t.height}px; transform: translateY(-${t.height}px)"
                    ${t.hideOn.includes("click") ? e.param ? `data-click='["message", "${e.param}"]` : 'data-click="message"' : ""}>
                    <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                    ${t.html}
                    <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                </div>`, 0 < d(e.after).length ? d(e.box).find(e.after).after(p) : d(e.box).prepend(p), t.box = d(e.box).find(`#w2ui-message-${(_b = e.owner) == null ? void 0 : _b.name}-` + t.msgIndex)[0], w.bindEvents(t.box, this), d(t.box).addClass("animating"), (t.box._msg_options = t).box._msg_prevFocus = document.activeElement, setTimeout(() => {
      var _a3;
      (n = t.trigger("open", { target: this.name, box: t.box, self: t })).isCancelled === true ? (d(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + t.msgIndex).remove(), t.msgIndex === 0 && (x.css("z-index", t.tmp.zIndex), d(e.box).css("overflow", t.tmp.overflow))) : d(t.box).css({ transition: "0.3s", transform: "translateY(0px)" });
    }, 0), i = setTimeout(() => {
      var _a3;
      d(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + t.msgIndex).removeClass("animating").css({ transition: "0s" }), n.finish();
    }, 300)), t.action = (b, C) => {
      let _ = t.actions[b];
      _ instanceof Object && _.onClick && (_ = _.onClick), b = t.trigger("action", { target: this.name, action: b, self: t, originalEvent: C, value: t.input ? t.input.value : null }), b.isCancelled !== true && (typeof _ == "function" && _(b), b.finish());
    }, t.close = () => {
      var _a3;
      (n = t.trigger("close", { target: "self", box: t.box, self: t })).isCancelled !== true && (clearTimeout(i), d(t.box).hasClass("animating") ? (clearTimeout(s), a(t)) : (d(t.box).addClass("w2ui-closing animating").css({ transition: "0.15s", transform: "translateY(-" + t.height + "px)" }), t.msgIndex !== 0 && d(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + (t.msgIndex - 1)).css("z-index", 1499), s = setTimeout(() => {
        a(t);
      }, 150)));
    }, t.setFocus = (b) => {
      var _a3, _b2;
      var C = d(e.box).find(".w2ui-message").length - 1;
      let _ = d(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + C), S = "input, button, select, textarea, [contentEditable], .w2ui-input";
      (_b2 = b != null ? isNaN(b) ? _.find(S).filter(b).get(0) : _.find(S).get(b) : _.find("[name=hidden-first]").get(0)) == null ? void 0 : _b2.focus(), d(e.box).find(".w2ui-message").find(S + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus"), d(_).find(S + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(A) {
        setTimeout(() => {
          var _a4, _b3, _c2;
          var P = document.activeElement, X = 0 < d(_).find(S).filter(P).length, q = d(P).attr("name");
          !X && P && P !== document.body && ((_a4 = d(_).find(S).get(0)) == null ? void 0 : _a4.focus()), q == "hidden-last" && ((_b3 = d(_).find(S).get(0)) == null ? void 0 : _b3.focus()), q == "hidden-first" && ((_c2 = d(_).find(S).get(-1)) == null ? void 0 : _c2.focus());
        }, 1);
      });
    }, l;
  }
  notify(e, t) {
    return new Promise((s) => {
      if (typeof e == "object" && (e = (t = e).text), (t = t || {}).where = t.where ?? document.body, t.timeout = t.timeout ?? 15e3, typeof this.tmp.notify_resolve == "function" && (this.tmp.notify_resolve(), d(this.tmp.notify_where).find("#w2ui-notify").remove()), this.tmp.notify_resolve = s, this.tmp.notify_where = t.where, clearTimeout(this.tmp.notify_timer), e) {
        if (typeof t.actions == "object") {
          let n = {};
          Object.keys(t.actions).forEach((o) => {
            n[o] = `<a class="w2ui-notify-link" value="${o}">${o}</a>`;
          }), e = this.execTemplate(e, n);
        }
        var i = `
                    <div id="w2ui-notify">
                        <div class="${t.class} ${t.error ? "w2ui-notify-error" : ""}">
                            ${e}
                            <span class="w2ui-notify-close w2ui-icon-cross"></span>
                        </div>
                    </div>`;
        d(t.where).append(i), d(t.where).find("#w2ui-notify").find(".w2ui-notify-close").on("click", (n) => {
          d(t.where).find("#w2ui-notify").remove(), s();
        }), t.actions && d(t.where).find("#w2ui-notify .w2ui-notify-link").on("click", (n) => {
          n = d(n.target).attr("value"), t.actions[n](), d(t.where).find("#w2ui-notify").remove(), s();
        }), 0 < t.timeout && (this.tmp.notify_timer = setTimeout(() => {
          d(t.where).find("#w2ui-notify").remove(), s();
        }, t.timeout));
      }
    });
  }
  confirm(e, t) {
    return w.normButtons(t = typeof t == "string" ? { text: t } : t, { yes: "Yes", no: "No" }), e = w.message(e, t), e && e.action((s) => {
      s.detail.self.close();
    }), e;
  }
  normButtons(e, t) {
    e.actions = e.actions ?? {};
    var s = Object.keys(t);
    return s.forEach((i) => {
      var n = e["btn_" + i];
      n && (t[i] = { text: w.lang(n.text ?? ""), class: n.class ?? "", style: n.style ?? "", attrs: n.attrs ?? "" }, delete e["btn_" + i]), Array("text", "class", "style", "attrs").forEach((o) => {
        e[i + "_" + o] && (typeof t[i] == "string" && (t[i] = { text: t[i] }), t[i][o] = e[i + "_" + o], delete e[i + "_" + o]);
      });
    }), s.includes("yes") && s.includes("no") && (w.settings.macButtonOrder ? w.extend(e.actions, { no: t.no, yes: t.yes }) : w.extend(e.actions, { yes: t.yes, no: t.no })), s.includes("ok") && s.includes("cancel") && (w.settings.macButtonOrder ? w.extend(e.actions, { cancel: t.cancel, ok: t.ok }) : w.extend(e.actions, { ok: t.ok, cancel: t.cancel })), e;
  }
  getSize(e, t) {
    let s = 0;
    if (0 < (e = d(e)).length) {
      e = e[0];
      var i = getComputedStyle(e);
      switch (t) {
        case "width":
          s = parseFloat(i.width), i.width === "auto" && (s = 0);
          break;
        case "height":
          s = parseFloat(i.height), i.height === "auto" && (s = 0);
          break;
        default:
          s = parseFloat(i[t] ?? 0) || 0;
      }
    }
    return s;
  }
  getStrWidth(e, t) {
    return d("body").append(`
            <div id="_tmp_width" style="position: absolute; top: -9000px; ${t || ""}">
                ${this.encodeTags(e)}
            </div>`), t = d("#_tmp_width")[0].clientWidth, d("#_tmp_width").remove(), t;
  }
  execTemplate(e, t) {
    return typeof e == "string" && t && typeof t == "object" ? e.replace(/\${([^}]+)?}/g, function(s, i) {
      return t[i] || i;
    }) : e;
  }
  marker(e, t, s = { onlyFirst: false, wholeWord: false }) {
    Array.isArray(t) || (t = t != null && t !== "" ? [t] : []);
    let i = s.wholeWord;
    d(e).each((n) => {
      for (var o = n, a = /\<span class=\"w2ui\-marker\"\>((.|\n|\r)*)\<\/span\>/gi; o.innerHTML.indexOf('<span class="w2ui-marker"') !== -1; ) o.innerHTML = o.innerHTML.replace(a, "$1");
      t.forEach((l) => {
        l = (l = typeof l != "string" ? String(l) : l).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;"), l = new RegExp((i ? "\\b" : "") + l + (i ? "\\b" : "") + "(?!([^<]+)?>)", "i" + (s.onlyFirst ? "" : "g")), n.innerHTML = n.innerHTML.replace(l, (c) => '<span class="w2ui-marker">' + c + "</span>");
      });
    });
  }
  lang(e, t) {
    if (!e || this.settings.phrases == null || typeof e != "string" || "<=>=".includes(e)) return this.execTemplate(e, t);
    let s = this.settings.phrases[e];
    return s == null ? (s = e, this.settings.warnNoPhrase && (this.settings.missing || (this.settings.missing = {}), this.settings.missing[e] = "---", this.settings.phrases[e] = "---", console.log(`Missing translation for "%c${e}%c", see %c w2utils.settings.phrases %c with value "---"`, "color: orange", "", "color: #999", ""))) : s !== "---" || this.settings.warnNoPhrase || (s = e), s === "---" && (s = `<span ${this.tooltip(e)}>---</span>`), this.execTemplate(s, t);
  }
  locale(e, t, s) {
    return new Promise((i, n) => {
      if (Array.isArray(e)) {
        this.settings.phrases = {};
        let o = [], a = {};
        e.forEach((l, c) => {
          l.length === 5 && (l = "locale/" + l.toLowerCase() + ".json", e[c] = l), o.push(this.locale(l, true, false));
        }), Promise.allSettled(o).then((l) => {
          l.forEach((c) => {
            c.value && (a[c.value.file] = c.value.data);
          }), e.forEach((c) => {
            this.settings = this.extend({}, this.settings, a[c]);
          }), i();
        });
      } else (e = e || "en-us") instanceof Object ? this.settings = this.extend({}, this.settings, ro, e) : (e.length === 5 && (e = "locale/" + e.toLowerCase() + ".json"), fetch(e, { method: "GET" }).then((o) => o.json()).then((o) => {
        s !== true && (this.settings = t ? this.extend({}, this.settings, o) : this.extend({}, this.settings, ro, { phrases: {} }, o)), i({ file: e, data: o });
      }).catch((o) => {
        console.log("ERROR: Cannot load locale " + e), n(o);
      }));
    });
  }
  scrollBarSize() {
    return this.tmp.scrollBarSize || (d("body").append(`
            <div id="_scrollbar_width" style="position: absolute; top: -300px; width: 100px; height: 100px; overflow-y: scroll;">
                <div style="height: 120px">1</div>
            </div>
        `), this.tmp.scrollBarSize = 100 - d("#_scrollbar_width > div")[0].clientWidth, d("#_scrollbar_width").remove()), this.tmp.scrollBarSize;
  }
  checkName(e) {
    return e == null ? (console.log('ERROR: Property "name" is required but not supplied.'), false) : Os[e] != null ? (console.log(`ERROR: Object named "${e}" is already registered as w2ui.${e}.`), false) : !!this.isAlphaNumeric(e) || (console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).'), false);
  }
  checkUniqueId(e, t, s, i) {
    Array.isArray(t) || (t = [t]);
    let n = true;
    return t.forEach((o) => {
      o.id === e && (console.log(`ERROR: The item id="${e}" is not unique within the ${s} "${i}".`, t), n = false);
    }), n;
  }
  encodeParams(e, t = "") {
    let s = "";
    return Object.keys(e).forEach((i) => {
      s != "" && (s += "&"), typeof e[i] == "object" ? s += this.encodeParams(e[i], t + i + (t ? "]" : "") + "[") : s += "" + t + i + (t ? "]" : "") + "=" + e[i];
    }), s;
  }
  parseRoute(e) {
    let t = [];
    return e = e.replace(/\/\(/g, "(?:/").replace(/\+/g, "__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (s, i, n, o, a, l) => (t.push({ name: o, optional: !!l }), i = i || "", (l ? "" : i) + "(?:" + (l ? i : "") + (n || "") + (a || (n ? "([^/.]+?)" : "([^/]+?)")) + ")" + (l || ""))).replace(/([\/.])/g, "\\$1").replace(/__plus__/g, "(.+)").replace(/\*/g, "(.*)"), { path: new RegExp("^" + e + "$", "i"), keys: t };
  }
  getCursorPosition(e) {
    if (e == null) return null;
    let t = 0;
    var s, i = e.ownerDocument || e.document, n = i.defaultView || i.parentWindow;
    let o;
    return ["INPUT", "TEXTAREA"].includes(e.tagName) ? t = e.selectionStart : n.getSelection ? 0 < (o = n.getSelection()).rangeCount && ((s = (n = o.getRangeAt(0)).cloneRange()).selectNodeContents(e), s.setEnd(n.endContainer, n.endOffset), t = s.toString().length) : (o = i.selection) && o.type !== "Control" && (n = o.createRange(), (s = i.body.createTextRange()).moveToElementText(e), s.setEndPoint("EndToEnd", n), t = s.text.length), t;
  }
  setCursorPosition(e, t, s) {
    if (e != null) {
      var i = document.createRange();
      let n, o = window.getSelection();
      if (["INPUT", "TEXTAREA"].includes(e.tagName)) e.setSelectionRange(t, s ?? t);
      else {
        for (let a = 0; a < e.childNodes.length; a++) {
          let l = d(e.childNodes[a]).text();
          if (t <= (l = e.childNodes[a].tagName ? (l = d(e.childNodes[a]).html()).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ") : l).length) {
            (n = (n = e.childNodes[a]).childNodes && 0 < n.childNodes.length ? n.childNodes[0] : n).childNodes && 0 < n.childNodes.length && (n = n.childNodes[0]);
            break;
          }
          t -= l.length;
        }
        n != null && (t > n.length && (t = n.length), i.setStart(n, t), s ? i.setEnd(n, s) : i.collapse(true), o.removeAllRanges(), o.addRange(i));
      }
    }
  }
  parseColor(e) {
    if (typeof e != "string") return null;
    let t = {};
    if ((e = (e = e.trim().toUpperCase())[0] === "#" ? e.substr(1) : e).length === 3) t = { r: parseInt(e[0] + e[0], 16), g: parseInt(e[1] + e[1], 16), b: parseInt(e[2] + e[2], 16), a: 1 };
    else if (e.length === 6) t = { r: parseInt(e.substr(0, 2), 16), g: parseInt(e.substr(2, 2), 16), b: parseInt(e.substr(4, 2), 16), a: 1 };
    else if (e.length === 8) t = { r: parseInt(e.substr(0, 2), 16), g: parseInt(e.substr(2, 2), 16), b: parseInt(e.substr(4, 2), 16), a: Math.round(parseInt(e.substr(6, 2), 16) / 255 * 100) / 100 };
    else if (4 < e.length && e.substr(0, 4) === "RGB(") {
      var s = e.replace("RGB", "").replace(/\(/g, "").replace(/\)/g, "").split(",");
      t = { r: parseInt(s[0], 10), g: parseInt(s[1], 10), b: parseInt(s[2], 10), a: 1 };
    } else {
      if (!(5 < e.length && e.substr(0, 5) === "RGBA(")) return null;
      s = e.replace("RGBA", "").replace(/\(/g, "").replace(/\)/g, "").split(","), t = { r: parseInt(s[0], 10), g: parseInt(s[1], 10), b: parseInt(s[2], 10), a: parseFloat(s[3]) };
    }
    return t;
  }
  hsv2rgb(e, t, s, i) {
    let n, o, a, l, c, h, p, f;
    switch (arguments.length === 1 && (t = e.s, s = e.v, i = e.a, e = e.h), h = (s /= 100) * (1 - (t /= 100)), p = s * (1 - (c = 6 * (e /= 360) - (l = Math.floor(6 * e))) * t), f = s * (1 - (1 - c) * t), l % 6) {
      case 0:
        n = s, o = f, a = h;
        break;
      case 1:
        n = p, o = s, a = h;
        break;
      case 2:
        n = h, o = s, a = f;
        break;
      case 3:
        n = h, o = p, a = s;
        break;
      case 4:
        n = f, o = h, a = s;
        break;
      case 5:
        n = s, o = h, a = p;
    }
    return { r: Math.round(255 * n), g: Math.round(255 * o), b: Math.round(255 * a), a: i ?? 1 };
  }
  rgb2hsv(e, t, s, i) {
    arguments.length === 1 && (t = e.g, s = e.b, i = e.a, e = e.r);
    let n = Math.max(e, t, s), o = Math.min(e, t, s), a = n - o, l, c = n === 0 ? 0 : a / n, h = n / 255;
    switch (n) {
      case o:
        l = 0;
        break;
      case e:
        l = t - s + a * (t < s ? 6 : 0), l /= 6 * a;
        break;
      case t:
        l = s - e + 2 * a, l /= 6 * a;
        break;
      case s:
        l = e - t + 4 * a, l /= 6 * a;
    }
    return { h: Math.round(360 * l), s: Math.round(100 * c), v: Math.round(100 * h), a: i ?? 1 };
  }
  tooltip(e, t) {
    let s = "mouseenter", i = "mouseleave";
    return t = (t = typeof e == "object" ? e : t) || {}, typeof e == "string" && (t.html = e), t.showOn && (s = t.showOn, delete t.showOn), t.hideOn && (i = t.hideOn, delete t.hideOn), t.name || (t.name = "no-name"), ` on${s}="w2tooltip.show(this, JSON.parse(w2utils.base64decode('${this.base64encode(JSON.stringify(t))}')))" on${i}="w2tooltip.hide('${t.name}')"`;
  }
  isPlainObject(e) {
    return e != null && Object.prototype.toString.call(e) === "[object Object]" && (e.constructor === void 0 || (e = Object.getPrototypeOf(e)) === null || e === Object.prototype);
  }
  clone(e, t) {
    let s;
    return t = Object.assign({ functions: true, elements: true, events: true, exclude: [] }, t ?? {}), Array.isArray(e) ? (s = Array.from(e)).forEach((i, n) => {
      s[n] = this.clone(i, t);
    }) : this.isPlainObject(e) ? (s = {}, Object.assign(s, e), t.exclude && t.exclude.forEach((i) => {
      delete s[i];
    }), Object.keys(s).forEach((i) => {
      s[i] = this.clone(s[i], t), s[i] === void 0 && delete s[i];
    })) : e instanceof Function && !t.functions || e instanceof Node && !t.elements || e instanceof Event && !t.events || (s = e), s;
  }
  extend(e, t) {
    if (Array.isArray(e)) {
      if (!Array.isArray(t)) throw new Error("Arrays can be extended with arrays only");
      e.splice(0, e.length), t.forEach((s) => {
        e.push(this.clone(s));
      });
    } else {
      if (e instanceof Node || e instanceof Event) throw new Error("HTML elmenents and events cannot be extended");
      if (e && typeof e == "object" && t != null) {
        if (typeof t != "object") throw new Error("Object can be extended with other objects only.");
        Object.keys(t).forEach((s) => {
          var i;
          e[s] != null && typeof e[s] == "object" && t[s] != null && typeof t[s] == "object" ? (i = this.clone(t[s]), e[s] instanceof Node || e[s] instanceof Event ? e[s] = i : (Array.isArray(e[s]) && this.isPlainObject(i) && (e[s] = {}), this.extend(e[s], i))) : e[s] = this.clone(t[s]);
        });
      } else if (t != null) throw new Error("Object is not extendable, only {} or [] can be extended.");
    }
    if (2 < arguments.length) for (let s = 2; s < arguments.length; s++) this.extend(e, arguments[s]);
    return e;
  }
  naturalCompare(e, t) {
    let s, i, n = 1, o = 0, a = 0, l = String.alphabet;
    function c(h, p, f) {
      if (f) {
        for (s = p; (f = c(h, s)) < 76 && 65 < f; ) ++s;
        return +h.slice(p - 1, s);
      }
      return -1 < (f = l && l.indexOf(h.charAt(p))) ? f + 76 : (f = h.charCodeAt(p) || 0) < 45 || 127 < f ? f : f < 46 ? 65 : f < 48 ? f - 1 : f < 58 ? f + 18 : f < 65 ? f - 11 : f < 91 ? f + 11 : f < 97 ? f - 37 : f < 123 ? f + 5 : f - 63;
    }
    if ((e += "") != (t += "")) {
      for (; n; ) if (i = c(e, o++), n = c(t, a++), i < 76 && n < 76 && 66 < i && 66 < n && (i = c(e, o, o), n = c(t, a, o = s), a = s), i != n) return i < n ? -1 : 1;
    }
    return 0;
  }
  normMenu(e, t) {
    return Array.isArray(e) ? (e.forEach((s, i) => {
      typeof s == "string" || typeof s == "number" ? e[i] = { id: s, text: String(s) } : s != null ? (s.caption != null && s.text == null && (s.text = s.caption), s.text != null && s.id == null && (s.id = s.text), s.text == null && s.id != null && (s.text = s.id)) : e[i] = { id: null, text: "null" };
    }), e) : typeof e == "function" ? (t = e.call(this, e, t), w.normMenu.call(this, t)) : typeof e == "object" ? Object.keys(e).map((s) => ({ id: s, text: e[s] })) : void 0;
  }
  prepareParams(e, t, s) {
    s = s ?? w.settings.dataType;
    let i = t.body;
    switch (s) {
      case "HTTPJSON":
        i = { request: i }, ["PUT", "DELETE"].includes(t.method) && (t.method = "POST"), n();
        break;
      case "HTTP":
        ["PUT", "DELETE"].includes(t.method) && (t.method = "POST"), n();
        break;
      case "RESTFULL":
        ["PUT", "DELETE"].includes(t.method) ? t.headers["Content-Type"] = "application/json" : n();
        break;
      case "JSON":
        t.method == "GET" ? (i = { request: i }, n()) : (t.headers["Content-Type"] = "application/json", t.method = "POST");
    }
    return t.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body), t;
    function n() {
      Object.keys(i).forEach((o) => {
        let a = i[o];
        typeof a == "object" && (a = JSON.stringify(a)), e.searchParams.append(o, a);
      }), delete t.body;
    }
  }
  bindEvents(e, t) {
    e.length != 0 && ((e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), d(e).each((s) => {
      let i = d(s).data();
      Object.keys(i).forEach((n) => {
        if (["click", "dblclick", "mouseenter", "mouseleave", "mouseover", "mouseout", "mousedown", "mousemove", "mouseup", "contextmenu", "focus", "focusin", "focusout", "blur", "input", "change", "keydown", "keyup", "keypress"].indexOf(String(n).toLowerCase()) != -1) {
          let o = i[n], a = (o = typeof o == "string" ? o.split("|").map((l) => {
            (l = (l = (l = l === "true" ? true : l) === "false" ? false : l) === "undefined" ? void 0 : l) === "null" && (l = null);
            var c = ["'", '"', "`"];
            return l = typeof (l = parseFloat(l) == l ? parseFloat(l) : l) == "string" && c.includes(l[0]) && c.includes(l[l.length - 1]) ? l.substring(1, l.length - 1) : l;
          }) : o)[0];
          o = o.slice(1), d(s).off(n + ".w2utils-bind").on(n + ".w2utils-bind", function(l) {
            switch (a) {
              case "alert":
                alert(o[0]);
                break;
              case "stop":
                l.stopPropagation();
                break;
              case "prevent":
                l.preventDefault();
                break;
              case "stopPrevent":
                return l.stopPropagation(), l.preventDefault(), false;
              default:
                if (t[a] == null) throw new Error(`Cannot dispatch event as the method "${a}" does not exist.`);
                t[a].apply(t, o.map((c, h) => {
                  switch (String(c).toLowerCase()) {
                    case "event":
                      return l;
                    case "this":
                      return this;
                    default:
                      return c;
                  }
                }));
            }
          });
        }
      });
    }));
  }
  debounce(e, t = 250) {
    let s;
    return (...i) => {
      clearTimeout(s), s = setTimeout(() => {
        e(...i);
      }, t);
    };
  }
}
var w = new Ur();
class qr extends ni {
  constructor() {
    super(), this.defaults = { title: "", text: "", body: "", buttons: "", width: 450, height: 250, focus: null, actions: null, style: "", speed: 0.3, modal: false, maximized: false, keyboard: true, showClose: true, showMax: false, transition: null, openMaximized: false, moved: false }, this.name = "popup", this.status = "closed", this.onOpen = null, this.onClose = null, this.onMax = null, this.onMin = null, this.onToggle = null, this.onKeydown = null, this.onAction = null, this.onMove = null, this.tmp = {}, this.handleResize = (e) => {
      this.options.moved || this.center(void 0, void 0, true);
    };
  }
  open(e) {
    let t = this;
    this.status != "closing" && !d("#w2ui-popup").hasClass("animating") || this.close(true);
    var s = this.options;
    (e = ["string", "number"].includes(typeof e) ? w.extend({ title: "Notification", body: `<div class="w2ui-centered">${e}</div>`, actions: { Ok() {
      t.close();
    } }, cancelAction: "ok" }, arguments[1] ?? {}) : e).text != null && (e.body = `<div class="w2ui-centered w2ui-msg-text">${e.text}</div>`), e = Object.assign({}, this.defaults, s, { title: "", body: "" }, e, { maximized: false }), this.options = e, d("#w2ui-popup").length === 0 && (this.off("*"), Object.keys(this).forEach((h) => {
      h.startsWith("on") && h != "on" && (this[h] = null);
    })), Object.keys(e).forEach((h) => {
      h.startsWith("on") && h != "on" && e[h] && (this[h] = e[h]);
    }), e.width = parseInt(e.width), e.height = parseInt(e.height);
    let i, n, o;
    var { top: a, left: l } = this.center();
    let c = { self: this, action(h) {
      return t.on("action.prom", h), c;
    }, close(h) {
      return t.on("close.prom", h), c;
    }, then(h) {
      return t.on("open:after.prom", h), c;
    } };
    if (e.actions == null || e.buttons || (e.buttons = "", Object.keys(e.actions).forEach((h) => {
      var p = e.actions[h];
      let f = h;
      typeof p == "function" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${h}","event"]'>${h}</button>`), typeof p == "object" && (e.buttons += `<button class="w2ui-btn w2ui-eaction ${p.class || ""}" name="${h}" data-click='["action","${h}","event"]'
                        style="${p.style}" ${p.attrs}>${p.text || h}</button>`, f = Array.isArray(e.actions) ? p.text : h), typeof p == "string" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${p}","event"]'>${p}</button>`, f = p), typeof f == "string" && (f = f[0].toLowerCase() + f.substr(1).replace(/\s+/g, "")), c[f] = function(x) {
        return t.on("action.buttons", (b) => {
          b.detail.action[0].toLowerCase() + b.detail.action.substr(1).replace(/\s+/g, "") == f && x(b);
        }), c;
      };
    })), d("#w2ui-popup").length === 0) {
      if ((i = this.trigger("open", { target: "popup", present: false })).isCancelled === true) return;
      this.status = "opening", w.lock(document.body, { opacity: 0.3, onClick: e.modal ? null : () => {
        this.close();
      } });
      let h = "";
      e.showClose && (h += `<div class="w2ui-popup-button w2ui-popup-close">
                            <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                        </div>`), e.showMax && (h += `<div class="w2ui-popup-button w2ui-popup-max">
                            <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                        </div>`), l = `
                left: ${l}px;
                top: ${a}px;
                width: ${parseInt(e.width)}px;
                height: ${parseInt(e.height)}px;
                transition: ${e.speed}s
            `, n = `<div id="w2ui-popup" class="w2ui-popup w2ui-anim-open animating" style="${w.stripSpaces(l)}"></div>`, d("body").append(n), d("#w2ui-popup")[0]._w2popup = { self: this, created: new Promise((p) => {
        this._promCreated = p;
      }), opened: new Promise((p) => {
        this._promOpened = p;
      }), closing: new Promise((p) => {
        this._promClosing = p;
      }), closed: new Promise((p) => {
        this._promClosed = p;
      }) }, l = `${e.title ? "" : "top: 0px !important;"} ` + (e.buttons ? "" : "bottom: 0px !important;"), n = `
                <span name="hidden-first" tabindex="0" style="position: absolute; top: -100px"></span>
                <div class="w2ui-popup-title-btns">${h}</div>
                <div class="w2ui-popup-title" style="${e.title ? "" : "display: none"}"></div>
                <div class="w2ui-box" style="${l}">
                    <div class="w2ui-popup-body ${!e.title || " w2ui-popup-no-title"}
                        ${!e.buttons || " w2ui-popup-no-buttons"}" style="${e.style}">
                    </div>
                </div>
                <div class="w2ui-popup-buttons" style="${e.buttons ? "" : "display: none"}"></div>
                <span name="hidden-last" tabindex="0" style="position: absolute; top: -100px"></span>
            `, d("#w2ui-popup").html(n), e.title && d("#w2ui-popup .w2ui-popup-title").append(w.lang(e.title)), e.buttons && d("#w2ui-popup .w2ui-popup-buttons").append(e.buttons), e.body && d("#w2ui-popup .w2ui-popup-body").append(e.body), setTimeout(() => {
        d("#w2ui-popup").css("transition", e.speed + "s").removeClass("w2ui-anim-open"), w.bindEvents("#w2ui-popup .w2ui-eaction", this), d("#w2ui-popup").find(".w2ui-popup-body").show(), this._promCreated();
      }, 1), clearTimeout(this._timer), this._timer = setTimeout(() => {
        this.status = "open", t.setFocus(e.focus), i.finish(), this._promOpened(), d("#w2ui-popup").removeClass("animating");
      }, 1e3 * e.speed);
    } else {
      if ((i = this.trigger("open", { target: "popup", present: true })).isCancelled === true) return;
      this.status = "opening", s != null && (s.maximized || s.width == e.width && s.height == e.height || this.resize(e.width, e.height), e.prevSize = e.width + "px:" + e.height + "px", e.maximized = s.maximized), a = d("#w2ui-popup .w2ui-box").get(0).cloneNode(true), d(a).removeClass("w2ui-box").addClass("w2ui-box-temp").find(".w2ui-popup-body").empty().append(e.body), d("#w2ui-popup .w2ui-box").after(a), e.buttons ? (d("#w2ui-popup .w2ui-popup-buttons").show().html("").append(e.buttons), d("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-buttons"), d("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "")) : (d("#w2ui-popup .w2ui-popup-buttons").hide().html(""), d("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-buttons"), d("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "0px")), e.title ? (d("#w2ui-popup .w2ui-popup-title").show().html((e.showClose ? `<div class="w2ui-popup-button w2ui-popup-close">
                                <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                            </div>` : "") + (e.showMax ? `<div class="w2ui-popup-button w2ui-popup-max">
                                <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                            </div>` : "")).append(e.title), d("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-title"), d("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "")) : (d("#w2ui-popup .w2ui-popup-title").hide().html(""), d("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-title"), d("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "0px"));
      let h = d("#w2ui-popup .w2ui-box")[0], p = d("#w2ui-popup .w2ui-box-temp")[0];
      d("#w2ui-popup").addClass("animating"), w.transition(h, p, e.transition, () => {
        d(h).remove(), d(p).removeClass("w2ui-box-temp").addClass("w2ui-box");
        var f = d(p).find(".w2ui-popup-body");
        f.length == 1 && (f[0].style.cssText = e.style, f.show()), t.setFocus(e.focus), d("#w2ui-popup").removeClass("animating");
      }), this.status = "open", i.finish(), w.bindEvents("#w2ui-popup .w2ui-eaction", this), d("#w2ui-popup").find(".w2ui-popup-body").show();
    }
    return e.openMaximized && this.max(), e._last_focus = document.activeElement, e.keyboard && d(document.body).on("keydown", (h) => {
      this.keydown(h);
    }), d(window).on("resize", this.handleResize), o = { resizing: false, mvMove: function(h) {
      o.resizing == 1 && (h = h || window.event, o.div_x = h.screenX - o.x, o.div_y = h.screenY - o.y, (h = t.trigger("move", { target: "popup", div_x: o.div_x, div_y: o.div_y, originalEvent: h })).isCancelled !== true) && (d("#w2ui-popup").css({ transition: "none", transform: "translate3d(" + o.div_x + "px, " + o.div_y + "px, 0px)" }), t.options.moved = true, h.finish());
    }, mvStop: function(h) {
      o.resizing != 1 || (h = h || window.event, t.status = "open", o.div_x = h.screenX - o.x, o.div_y = h.screenY - o.y, d("#w2ui-popup").css({ left: o.pos_x + o.div_x + "px", top: o.pos_y + o.div_y + "px" }).css({ transition: "none", transform: "translate3d(0px, 0px, 0px)" }), o.resizing = false, d(document.body).off(".w2ui-popup"), o.isLocked) || t.unlock();
    } }, d("#w2ui-popup .w2ui-popup-title").on("mousedown", function(h) {
      var p;
      t.options.maximized || (h = (h = h) || window.event, t.status = "moving", p = d("#w2ui-popup").get(0).getBoundingClientRect(), Object.assign(o, { resizing: true, isLocked: d("#w2ui-popup > .w2ui-lock").length == 1, x: h.screenX, y: h.screenY, pos_x: p.x, pos_y: p.y }), o.isLocked || t.lock({ opacity: 0 }), d(document.body).on("mousemove.w2ui-popup", o.mvMove).on("mouseup.w2ui-popup", o.mvStop), h.stopPropagation ? h.stopPropagation() : h.cancelBubble = true, h.preventDefault && h.preventDefault());
    }), c;
  }
  load(e) {
    return new Promise((t, s) => {
      if ((e = typeof e == "string" ? { url: e } : e).url == null) console.log("ERROR: The url is not defined."), s("The url is not defined");
      else {
        this.status = "loading";
        let [i, n] = String(e.url).split("#");
        i && fetch(i).then((o) => o.text()).then((o) => {
          t(this.template(o, n, e));
        });
      }
    });
  }
  template(e, t, s = {}) {
    let i;
    try {
      i = d(e);
    } catch {
      i = d.html(e);
    }
    return t && (i = i.filter("#" + t)), Object.assign(s, { width: parseInt(d(i).css("width")), height: parseInt(d(i).css("height")), title: d(i).find("[rel=title]").html(), body: d(i).find("[rel=body]").html(), buttons: d(i).find("[rel=buttons]").html(), style: d(i).find("[rel=body]").get(0).style.cssText }), this.open(s);
  }
  action(e, t) {
    let s = this.options.actions[e];
    s instanceof Object && s.onClick && (s = s.onClick), e = this.trigger("action", { action: e, target: "popup", self: this, originalEvent: t, value: this.input ? this.input.value : null }), e.isCancelled !== true && (typeof s == "function" && s.call(this, t), e.finish());
  }
  keydown(e) {
    var t;
    this.options && !this.options.keyboard || (t = this.trigger("keydown", { target: "popup", originalEvent: e })).isCancelled !== true && (e.keyCode === 27 && (e.preventDefault(), d("#w2ui-popup .w2ui-message").length == 0) && (this.options.cancelAction ? this.action(this.options.cancelAction) : this.close()), t.finish());
  }
  close(e) {
    let t = this.trigger("close", { target: "popup" });
    var s;
    t.isCancelled !== true && (s = () => {
      d("#w2ui-popup").remove(), this.options._last_focus && 0 < this.options._last_focus.length && this.options._last_focus.focus(), this.status = "closed", this.options = {}, t.finish(), this._promClosed();
    }, d("#w2ui-popup").length !== 0) && this.status != "closed" && (this.status == "opening" && (e = true), this.status == "closing" && e === true ? (s(), clearTimeout(this.tmp.closingTimer), w.unlock(document.body, 0)) : (this.status = "closing", d("#w2ui-popup").css("transition", this.options.speed + "s").addClass("w2ui-anim-close animating"), w.unlock(document.body, 300), this._promClosing(), e ? s() : this.tmp.closingTimer = setTimeout(s, 1e3 * this.options.speed), this.options.keyboard && d(document.body).off("keydown", this.keydown), d(window).off("resize", this.handleResize)));
  }
  toggle() {
    let e = this.trigger("toggle", { target: "popup" });
    e.isCancelled !== true && (this.options.maximized === true ? this.min() : this.max(), setTimeout(() => {
      e.finish();
    }, 1e3 * this.options.speed + 50));
  }
  max() {
    if (this.options.maximized !== true) {
      let t = this.trigger("max", { target: "popup" });
      var e;
      t.isCancelled !== true && (this.status = "resizing", e = d("#w2ui-popup").get(0).getBoundingClientRect(), this.options.prevSize = e.width + ":" + e.height, this.resize(1e4, 1e4, () => {
        this.status = "open", this.options.maximized = true, t.finish();
      }));
    }
  }
  min() {
    if (this.options.maximized === true) {
      var e = this.options.prevSize.split(":");
      let t = this.trigger("min", { target: "popup" });
      t.isCancelled !== true && (this.status = "resizing", this.options.maximized = false, this.resize(parseInt(e[0]), parseInt(e[1]), () => {
        this.status = "open", this.options.prevSize = null, t.finish();
      }));
    }
  }
  clear() {
    d("#w2ui-popup .w2ui-popup-title").html(""), d("#w2ui-popup .w2ui-popup-body").html(""), d("#w2ui-popup .w2ui-popup-buttons").html("");
  }
  reset() {
    this.open(this.defaults);
  }
  message(e) {
    return w.message({ owner: this, box: d("#w2ui-popup").get(0), after: ".w2ui-popup-title" }, e);
  }
  confirm(e) {
    return w.confirm({ owner: this, box: d("#w2ui-popup"), after: ".w2ui-popup-title" }, e);
  }
  setFocus(e) {
    var _a2;
    let t = d("#w2ui-popup"), s = "input, button, select, textarea, [contentEditable], .w2ui-input";
    e != null ? (_a2 = isNaN(e) ? t.find(s).filter(e).get(0) : t.find(s).get(e)) == null ? void 0 : _a2.focus() : (e = t.find("[name=hidden-first]").get(0)) && e.focus(), d(t).find(s + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus").on("blur.keep-focus", function(i) {
      setTimeout(() => {
        var _a3, _b, _c2;
        var n = document.activeElement, o = 0 < d(t).find(s).filter(n).length, a = d(n).attr("name");
        !o && n && n !== document.body && ((_a3 = d(t).find(s).get(0)) == null ? void 0 : _a3.focus()), a == "hidden-last" && ((_b = d(t).find(s).get(0)) == null ? void 0 : _b.focus()), a == "hidden-first" && ((_c2 = d(t).find(s).get(-1)) == null ? void 0 : _c2.focus());
      }, 1);
    });
  }
  lock(e, t) {
    var s = Array.from(arguments);
    s.unshift(d("#w2ui-popup")), w.lock(...s);
  }
  unlock(e) {
    w.unlock(d("#w2ui-popup"), e);
  }
  center(e, t, s) {
    let i, n;
    n = window.innerHeight == null ? (i = parseInt(document.documentElement.offsetWidth), parseInt(document.documentElement.offsetHeight)) : (i = parseInt(window.innerWidth), parseInt(window.innerHeight)), e = parseInt(e ?? this.options.width), t = parseInt(t ?? this.options.height), this.options.maximized === true && (e = i, t = n), i - 10 < e && (e = i - 10), n - 10 < t && (t = n - 10);
    var o = (n - t) / 2, a = (i - e) / 2;
    return s && (d("#w2ui-popup").css({ transition: "none", top: o + "px", left: a + "px", width: e + "px", height: t + "px" }), this.resizeMessages()), { top: o, left: a, width: e, height: t };
  }
  resize(n, o, s) {
    let i = this;
    this.options.speed == null && (this.options.speed = 0);
    var { top: n, left: o, width: a, height: l } = this.center(n, o), c = this.options.speed;
    d("#w2ui-popup").css({ transition: c + `s width, ${c}s height, ${c}s left, ${c}s top`, top: n + "px", left: o + "px", width: a + "px", height: l + "px" });
    let h = setInterval(() => {
      i.resizeMessages();
    }, 10);
    setTimeout(() => {
      clearInterval(h), i.resizeMessages(), typeof s == "function" && s();
    }, 1e3 * this.options.speed + 50);
  }
  resizeMessages() {
    d("#w2ui-popup .w2ui-message").each((e) => {
      var t = e._msg_options, s = d("#w2ui-popup"), n = (parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 10 && (t.height = 10), s[0].getBoundingClientRect()), s = parseInt(s.find(".w2ui-popup-title")[0].clientHeight), i = parseInt(n.width), n = parseInt(n.height);
      t.width = t.originalWidth, t.width > i - 10 && (t.width = i - 10), t.height = t.originalHeight, t.height > n - s - 5 && (t.height = n - s - 5), t.originalHeight < 0 && (t.height = n + t.originalHeight - s), t.originalWidth < 0 && (t.width = i + 2 * t.originalWidth), d(e).css({ left: (i - t.width) / 2 + "px", width: t.width + "px", height: t.height + "px" });
    });
  }
}
new qr();
const _ut = class _ut {
  constructor() {
    this.defaults = { name: null, html: "", style: "", class: "", position: "top|bottom", align: "", anchor: null, anchorClass: "", anchorStyle: "", autoShow: false, autoShowOn: null, autoHideOn: null, arrowSize: 8, margin: 0, margin: 1, screenMargin: 2, autoResize: true, offsetX: 0, offsetY: 0, maxWidth: null, maxHeight: null, watchScroll: null, watchResize: null, hideOn: null, onThen: null, onShow: null, onHide: null, onUpdate: null, onMove: null };
  }
  trigger(e, t) {
    var s;
    if (arguments.length == 2 && (s = e, (e = t).type = s), e.overlay) return e.overlay.trigger(e);
    console.log("ERROR: cannot find overlay where to trigger events");
  }
  get(e) {
    return arguments.length == 0 ? Object.keys(_ut.active) : e === true ? _ut.active : _ut.active[e.replace(/[\s\.#]/g, "_")];
  }
  attach(e, t) {
    let s, i, n = this;
    if (arguments.length != 0) {
      arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && typeof t == "string" ? t = (s = { anchor: e, html: t }).html : arguments.length === 2 && t != null && typeof t == "object" && (t = (s = t).html), s = w.extend({}, this.defaults, s || {}), !(t = !t && s.text ? s.text : t) && s.html && (t = s.html), delete s.anchor;
      let o = s.name || e.id;
      e != document && e != document.body || (e = document.body, o = "context-menu"), o || (o = "noname-" + Object.keys(_ut.active).length, console.log("NOTICE: name property is not defined for tooltip, could lead to too many instances")), o = o.replace(/[\s\.#]/g, "_"), _ut.active[o] ? ((i = _ut.active[o]).prevOptions = i.options, i.options = s, i.anchor = e, i.prevOptions.html == i.options.html && i.prevOptions.class == i.options.class && i.prevOptions.style == i.options.style || (i.needsUpdate = true), s = i.options) : (i = new ni(), Object.assign(i, { id: "w2overlay-" + o, name: o, options: s, anchor: e, displayed: false, tmp: { observeResize: new ResizeObserver(() => {
        this.resize(i.name);
      }) }, hide() {
        n.hide(o);
      } }), _ut.active[o] = i), Object.keys(i.options).forEach((l) => {
        var c = i.options[l];
        l.startsWith("on") && typeof c == "function" && (i[l] = c, delete i.options[l]);
      }), s.autoShow === true && (s.autoShowOn = s.autoShowOn ?? "mouseenter", s.autoHideOn = s.autoHideOn ?? "mouseleave", s.autoShow = false), s.autoShowOn && (t = "autoShow-" + i.name, d(e).off("." + t).on(s.autoShowOn + "." + t, (l) => {
        n.show(i.name), l.stopPropagation();
      }), delete s.autoShowOn), s.autoHideOn && (t = "autoHide-" + i.name, d(e).off("." + t).on(s.autoHideOn + "." + t, (l) => {
        n.hide(i.name), l.stopPropagation();
      }), delete s.autoHideOn), i.off(".attach");
      let a = { overlay: i, then: (l) => (i.on("show:after.attach", (c) => {
        l(c);
      }), a), show: (l) => (i.on("show.attach", (c) => {
        l(c);
      }), a), hide: (l) => (i.on("hide.attach", (c) => {
        l(c);
      }), a), update: (l) => (i.on("update.attach", (c) => {
        l(c);
      }), a), move: (l) => (i.on("move.attach", (c) => {
        l(c);
      }), a) };
      return a;
    }
  }
  update(e, t) {
    var s = _ut.active[e];
    s ? (s.needsUpdate = true, s.options.html = t, this.show(e)) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
  }
  show(e) {
    if (e instanceof HTMLElement || e instanceof Object) {
      let a = e, l = (e instanceof HTMLElement && ((a = arguments[1] || {}).anchor = e), this.attach(a));
      return d(l.overlay.anchor).off(".autoShow-" + l.overlay.name).off(".autoHide-" + l.overlay.name), setTimeout(() => {
        this.show(l.overlay.name), this.initControls && this.initControls(l.overlay);
      }, 1), l;
    }
    let t, s = this, i = _ut.active[e.replace(/[\s\.#]/g, "_")];
    if (i) {
      let a = i.options;
      if (!i || i.displayed && !i.needsUpdate) this.resize(i == null ? void 0 : i.name);
      else {
        var n = a.position.split("|"), n = ["top", "bottom"].includes(n[0]);
        let l = a.align == "both" && n ? "" : "white-space: nowrap;";
        if (a.maxWidth && w.getStrWidth(a.html, "") > a.maxWidth && (l = "width: " + a.maxWidth + "px; white-space: inherit; overflow: auto;"), l += " max-height: " + (a.maxHeight || window.innerHeight - 40) + "px;", a.html !== "" && a.html != null) {
          if (i.box) {
            if ((t = this.trigger("update", { target: e, overlay: i })).isCancelled === true) return void (i.prevOptions && (i.options = i.prevOptions, delete i.prevOptions));
            d(i.box).find(".w2ui-overlay-body").attr("style", (a.style || "") + "; " + l).removeClass().addClass("w2ui-overlay-body " + a.class).html(a.html);
          } else {
            if ((t = this.trigger("show", { target: e, overlay: i })).isCancelled === true) return;
            d("body").append(`<div id="${i.id}" name="${e}" style="display: none; pointer-events: none" class="w2ui-overlay"
                        data-click="stop" data-focusin="stop">
                    <style></style>
                    <div class="w2ui-overlay-body ${a.class}" style="${a.style || ""}; ${l}">
                        ${a.html}
                    </div>
                </div>`), i.box = d("#" + w.escapeId(i.id))[0], i.displayed = true, n = d(i.anchor).data("tooltipName") ?? [], n.push(e), d(i.anchor).data("tooltipName", n), w.bindEvents(i.box, {}), i.tmp.originalCSS = "", 0 < d(i.anchor).length && (i.tmp.originalCSS = d(i.anchor)[0].style.cssText);
          }
          this.resize(i.name), a.anchorStyle && (i.anchor.style.cssText += ";" + a.anchorStyle), !a.anchorClass || a.anchorClass == "w2ui-focus" && i.anchor == document.body || d(i.anchor).addClass(a.anchorClass), typeof a.hideOn == "string" && (a.hideOn = [a.hideOn]), Array.isArray(a.hideOn) || (a.hideOn = []), Object.assign(i.tmp, { scrollLeft: document.body.scrollLeft, scrollTop: document.body.scrollTop });
          {
            let c = (f) => {
              s.hide(i.name);
            }, h = d(i.anchor), p = "tooltip-" + i.name;
            d("body").off("." + p), a.hideOn.includes("doc-click") && (["INPUT", "TEXTAREA"].includes(i.anchor.tagName) && h.off(`.${p}-doc`).on(`click.${p}-doc`, (f) => {
              f.stopPropagation();
            }), d("body").on("click." + p, c)), a.hideOn.includes("focus-change") && d("body").on("focusin." + p, (f) => {
              document.activeElement != i.anchor && s.hide(i.name);
            }), ["INPUT", "TEXTAREA"].includes(i.anchor.tagName) && (h.off("." + p), a.hideOn.forEach((f) => {
              ["doc-click", "focus-change"].indexOf(f) == -1 && h.on(f + "." + p, { once: true }, c);
            }));
          }
          {
            var o = document.body;
            let c = "tooltip-" + i.name, h = o;
            o.tagName == "BODY" && (h = o.ownerDocument), d(h).off("." + c).on("scroll." + c, (p) => {
              Object.assign(i.tmp, { scrollLeft: o.scrollLeft, scrollTop: o.scrollTop }), s.resize(i.name);
            });
          }
          return d(i.box).show(), i.tmp.observeResize.observe(i.box), _ut.observeRemove.observe(document.body, { subtree: true, childList: true }), d(i.box).css("opacity", 1).find(".w2ui-overlay-body").html(a.html), setTimeout(() => {
            d(i.box).css({ "pointer-events": "auto" }).data("ready", "yes");
          }, 100), delete i.needsUpdate, i.box.overlay = i, t && t.finish(), { overlay: i };
        }
        s.hide(e);
      }
    }
  }
  hide(e) {
    var _a2;
    let t;
    if (arguments.length == 0) Object.keys(_ut.active).forEach((n) => {
      this.hide(n);
    });
    else if (e instanceof HTMLElement) (d(e).data("tooltipName") ?? []).forEach((n) => {
      this.hide(n);
    });
    else if (typeof e == "string" && (e = e.replace(/[\s\.#]/g, "_"), t = _ut.active[e]), t && t.box && (delete _ut.active[e], e = this.trigger("hide", { target: e, overlay: t }), e.isCancelled !== true)) {
      var s = "tooltip-" + t.name;
      (_a2 = t.tmp.observeResize) == null ? void 0 : _a2.disconnect(), t.options.watchScroll && d(t.options.watchScroll).off(".w2scroll-" + t.name);
      let n = 0;
      Object.keys(_ut.active).forEach((o) => {
        _ut.active[o].displayed && n++;
      }), n == 0 && _ut.observeRemove.disconnect(), d("body").off("." + s), d(document).off("." + s), t.box.remove(), t.box = null, t.displayed = false;
      var i = d(t.anchor).data("tooltipName") ?? [];
      i.indexOf(t.name) != -1 && i.splice(i.indexOf(t.name), 1), i.length == 0 ? d(t.anchor).removeData("tooltipName") : d(t.anchor).data("tooltipName", i), t.anchor.style.cssText = t.tmp.originalCSS, d(t.anchor).off("." + s).removeClass(t.options.anchorClass), e.finish();
    }
  }
  resize(e) {
    if (arguments.length == 0) Object.keys(_ut.active).forEach((i) => {
      i = _ut.active[i], i.displayed && this.resize(i.name);
    });
    else {
      var t = _ut.active[e.replace(/[\s\.#]/g, "_")];
      let i = this.getPosition(t.name);
      var s = i.left + "x" + i.top;
      let n;
      t.tmp.lastPos != s && (n = this.trigger("move", { target: e, overlay: t, pos: i })), d(t.box).css({ left: i.left + "px", top: i.top + "px" }).then((o) => {
        i.width != null && o.css("width", i.width + "px").find(".w2ui-overlay-body").css("width", "100%"), i.height != null && o.css("height", i.height + "px").find(".w2ui-overlay-body").css("height", "100%");
      }).find(".w2ui-overlay-body").removeClass("w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom").addClass(i.arrow.class).closest(".w2ui-overlay").find("style").text(i.arrow.style), t.tmp.lastPos != s && n && (t.tmp.lastPos = s, n.finish());
    }
  }
  getPosition(e) {
    let t = _ut.active[e.replace(/[\s\.#]/g, "_")];
    if (t && t.box) {
      let p = t.options;
      (t.tmp.resizedY || t.tmp.resizedX) && d(t.box).css({ width: "", height: "", scroll: "auto" });
      var e = w.scrollBarSize(), s = document.body.scrollWidth != document.body.clientWidth, i = document.body.scrollHeight != document.body.clientHeight;
      let x = { width: window.innerWidth - (i ? e : 0), height: window.innerHeight - (s ? e : 0) };
      var n, o = (p.position == "auto" ? "top|bottom|right|left" : p.position).split("|");
      let b = ["top", "bottom"].includes(o[0]), C = t.box.getBoundingClientRect(), _ = t.anchor.getBoundingClientRect(), S = (t.anchor == document.body && ({ x: a, y: l, width: c, height: h } = p.originalEvent, _ = { left: a - 2, top: l - 4, width: c, height: h, arrow: "none" }), p.arrowSize), A = (_.arrow == "none" && (S = 0), { top: _.top, bottom: x.height - (_.top + _.height) - +(s ? e : 0), left: _.left, right: x.width - (_.left + _.width) + (i ? e : 0) });
      C.width < 22 && (C.width = 22), C.height < 14 && (C.height = 14);
      let P, X, q, G, W = "", U = { offset: 0, class: "", style: `#${t.id} { --tip-size: ${S}px; }` }, K = { left: 0, top: 0 }, D = { posX: "", x: 0, posY: "", y: 0 };
      o.forEach((R) => {
        ["top", "bottom"].includes(R) && (!W && C.height + S / 1.893 < A[R] && (W = R), A[R] > D.y) && Object.assign(D, { posY: R, y: A[R] }), ["left", "right"].includes(R) && (!W && C.width + S / 1.893 < A[R] && (W = R), A[R] > D.x) && Object.assign(D, { posX: R, x: A[R] });
      }), W = W || (b ? D.posY : D.posX), p.autoResize && (["top", "bottom"].includes(W) && (C.height > A[W] ? (G = A[W], t.tmp.resizedY = true) : t.tmp.resizedY = false), ["left", "right"].includes(W)) && (C.width > A[W] ? (q = A[W], t.tmp.resizedX = true) : t.tmp.resizedX = false);
      var a = W;
      switch (U.class = _.arrow || "w2ui-arrow-" + a, a) {
        case "top":
          P = _.left + (_.width - (q ?? C.width)) / 2, X = _.top - (G ?? C.height) - S / 1.5 + 1;
          break;
        case "bottom":
          P = _.left + (_.width - (q ?? C.width)) / 2, X = _.top + _.height + S / 1.25 + 1;
          break;
        case "left":
          P = _.left - (q ?? C.width) - S / 1.2 - 1, X = _.top + (_.height - (G ?? C.height)) / 2;
          break;
        case "right":
          P = _.left + _.width + S / 1.2 + 1, X = _.top + (_.height - (G ?? C.height)) / 2;
      }
      b && (p.align == "left" && (K.left = _.left - P, P = _.left), p.align == "right" && (K.left = _.left + _.width - (q ?? C.width) - P, P = _.left + _.width - (q ?? C.width)), ["top", "bottom"].includes(W) && p.align.startsWith("both") && (n = p.align.split(":")[1] ?? 50, _.width >= n) && (P = _.left, q = _.width), p.align == "top" && (K.top = _.top - X, X = _.top), p.align == "bottom" && (K.top = _.top + _.height - (G ?? C.height) - X, X = _.top + _.height - (G ?? C.height)), ["left", "right"].includes(W) && p.align.startsWith("both") && (n = p.align.split(":")[1] ?? 50, _.height >= n) && (X = _.top, G = _.height));
      {
        let R;
        (["left", "right"].includes(p.align) && _.width < (q ?? C.width) || ["top", "bottom"].includes(p.align) && _.height < (G ?? C.height)) && (R = true);
        var l = W == "right" ? S : p.screenMargin, c = W == "bottom" ? S : p.screenMargin, h = x.width - (q ?? C.width) - (W == "left" ? S : p.screenMargin), s = x.height - (G ?? C.height) - (W == "top" ? S : p.screenMargin) + 3;
        (["top", "bottom"].includes(W) || p.autoResize) && (P < l && (R = true, K.left -= P, P = l), P > h) && (R = true, K.left -= P - h, P += h - P), (["left", "right"].includes(W) || p.autoResize) && (X < c && (R = true, K.top -= X, X = c), X > s) && (R = true, K.top -= X - s, X += s - X), R && (l = b ? "left" : "top", h = b ? "width" : "height", U.offset = -K[l], c = C[h] / 2 - S, Math.abs(U.offset) > c + S && (U.class = ""), Math.abs(U.offset) > c && (U.offset = U.offset < 0 ? -c : c), U.style = w.stripSpaces(`#${t.id} .w2ui-overlay-body:after,
                            #${t.id} .w2ui-overlay-body:before {
                                --tip-size: ${S}px;
                                margin-${l}: ${U.offset}px;
                            }`));
      }
      return i = W == "top" ? -p.margin : W == "bottom" ? p.margin : 0, e = W == "left" ? -p.margin : W == "right" ? p.margin : 0, X = Math.floor(100 * (X + parseFloat(p.offsetY) + parseFloat(i))) / 100, { left: P = Math.floor(100 * (P + parseFloat(p.offsetX) + parseFloat(e))) / 100, top: X, arrow: U, adjust: K, width: q, height: G, pos: W };
    }
  }
};
__publicField(_ut, "active", {});
__publicField(_ut, "observeRemove", new MutationObserver((e) => {
  let t = 0;
  Object.keys(_ut.active).forEach((s) => {
    s = _ut.active[s], s.displayed && (s.anchor && s.anchor.isConnected ? t++ : s.hide());
  }), t === 0 && _ut.observeRemove.disconnect();
}));
let ut = _ut;
class jr extends ut {
  constructor() {
    super(), this.palette = [["000000", "333333", "555555", "777777", "888888", "999999", "AAAAAA", "CCCCCC", "DDDDDD", "EEEEEE", "F7F7F7", "FFFFFF"], ["FF011B", "FF9838", "FFC300", "FFFD59", "86FF14", "14FF7A", "2EFFFC", "2693FF", "006CE7", "9B24F4", "FF21F5", "FF0099"], ["FFEAEA", "FCEFE1", "FCF4DC", "FFFECF", "EBFFD9", "D9FFE9", "E0FFFF", "E8F4FF", "ECF4FC", "EAE6F4", "FFF5FE", "FCF0F7"], ["F4CCCC", "FCE5CD", "FFF1C2", "FFFDA1", "D5FCB1", "B5F7D0", "BFFFFF", "D6ECFF", "CFE2F3", "D9D1E9", "FFE3FD", "FFD9F0"], ["EA9899", "F9CB9C", "FFE48C", "F7F56F", "B9F77E", "84F0B1", "83F7F7", "B5DAFF", "9FC5E8", "B4A7D6", "FAB9F6", "FFADDE"], ["E06666", "F6B26B", "DEB737", "E0DE51", "8FDB48", "52D189", "4EDEDB", "76ACE3", "6FA8DC", "8E7CC3", "E07EDA", "F26DBD"], ["CC0814", "E69138", "AB8816", "B5B20E", "6BAB30", "27A85F", "1BA8A6", "3C81C7", "3D85C6", "674EA7", "A14F9D", "BF4990"], ["99050C", "B45F17", "80650E", "737103", "395E14", "10783D", "13615E", "094785", "0A5394", "351C75", "780172", "782C5A"]], this.defaults = w.extend({}, this.defaults, { advanced: false, transparent: true, position: "top|bottom", class: "w2ui-white", color: "", liveUpdate: true, arrowSize: 12, autoResize: false, anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change"], onSelect: null, onLiveUpdate: null });
  }
  attach(e, t) {
    let s;
    arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((s = t).anchor = e), t = s.hideOn, s = w.extend({}, this.defaults, s || {}), t && (s.hideOn = t), s.style += "; padding: 0;", s.transparent && this.palette[0][1] == "333333" && (this.palette[0].splice(1, 1), this.palette[0].push("")), s.transparent || this.palette[0][1] == "333333" || (this.palette[0].splice(1, 0, "333333"), this.palette[0].pop()), s.color && (s.color = String(s.color).toUpperCase()), typeof s.color == "string" && s.color.substr(0, 1) === "#" && (s.color = s.color.substr(1)), this.index = [-1, -1];
    let i = super.attach(s), n = i.overlay;
    return n.options.html = this.getColorHTML(n.name, s), n.on("show.attach", (a) => {
      var a = a.detail.overlay, l = a.anchor, c = a.options;
      ["INPUT", "TEXTAREA"].includes(l.tagName) && !c.color && l.value && (a.tmp.initColor = l.value), delete a.newColor;
    }), n.on("show:after.attach", (o) => {
      var _a2;
      var a;
      ((_a2 = i.overlay) == null ? void 0 : _a2.box) && (a = d(i.overlay.box).find(".w2ui-eaction"), w.bindEvents(a, this), this.initControls(i.overlay));
    }), n.on("update:after.attach", (o) => {
      var _a2;
      var a;
      ((_a2 = i.overlay) == null ? void 0 : _a2.box) && (a = d(i.overlay.box).find(".w2ui-eaction"), w.bindEvents(a, this), this.initControls(i.overlay));
    }), n.on("hide.attach", (a) => {
      var a = a.detail.overlay, c = a.anchor, l = a.newColor ?? a.options.color ?? "", c = (["INPUT", "TEXTAREA"].includes(c.tagName) && c.value != l && (c.value = l), this.trigger("select", { color: l, target: a.name, overlay: a }));
      c.isCancelled !== true && c.finish();
    }), i.liveUpdate = (o) => (n.on("liveUpdate.attach", (a) => {
      o(a);
    }), i), i.select = (o) => (n.on("select.attach", (a) => {
      o(a);
    }), i), i;
  }
  select(e, n) {
    let s;
    this.index = [-1, -1], typeof n != "string" && (s = n.target, this.index = d(s).attr("index").split(":"), n = d(s).closest(".w2ui-overlay").attr("name"));
    var i = this.get(n), n = this.trigger("liveUpdate", { color: e, target: n, overlay: i, param: arguments[1] });
    n.isCancelled !== true && (["INPUT", "TEXTAREA"].includes(i.anchor.tagName) && i.options.liveUpdate && d(i.anchor).val(e), i.newColor = e, d(i.box).find(".w2ui-selected").removeClass("w2ui-selected"), s && d(s).addClass("w2ui-selected"), n.finish());
  }
  nextColor(e) {
    var t = this.palette;
    switch (e) {
      case "up":
        this.index[0]--;
        break;
      case "down":
        this.index[0]++;
        break;
      case "right":
        this.index[1]++;
        break;
      case "left":
        this.index[1]--;
    }
    return this.index[0] < 0 && (this.index[0] = 0), this.index[0] > t.length - 2 && (this.index[0] = t.length - 2), this.index[1] < 0 && (this.index[1] = 0), this.index[1] > t[0].length - 1 && (this.index[1] = t[0].length - 1), t[this.index[0]][this.index[1]];
  }
  tabClick(e, s) {
    typeof s != "string" && (s = d(s.target).closest(".w2ui-overlay").attr("name"));
    var s = this.get(s), i = d(s.box).find(`.w2ui-color-tab:nth-child(${e})`);
    d(s.box).find(".w2ui-color-tab").removeClass("w2ui-selected"), d(i).addClass("w2ui-selected"), d(s.box).find(".w2ui-tab-content").hide().closest(".w2ui-colors").find(".tab-" + e).show();
  }
  getColorHTML(e, t) {
    let s = `
            <div class="w2ui-colors">
                <div class="w2ui-tab-content tab-1">`;
    for (let n = 0; n < this.palette.length; n++) {
      s += '<div class="w2ui-color-row">';
      for (let o = 0; o < this.palette[n].length; o++) {
        var i = this.palette[n][o];
        let a = i === "FFFFFF" ? "; border: 1px solid #efefef" : "";
        s += `
                    <div class="w2ui-color w2ui-eaction ${i === "" ? "w2ui-no-color" : ""} ${t.color == i ? "w2ui-selected" : ""}"
                        style="background-color: #${i + a};" name="${i}" index="${n}:${o}"
                        data-mousedown="select|'${i}'|event" data-mouseup="hide|${e}">&nbsp;
                    </div>`;
      }
      s += "</div>", n < 2 && (s += '<div style="height: 8px"></div>');
    }
    return s = (s = (s += "</div>") + `
            <div class="w2ui-tab-content tab-2" style="display: none">
                <div class="color-info">
                    <div class="color-preview-bg"><div class="color-preview"></div><div class="color-original"></div></div>
                    <div class="color-part">
                        <span>H</span> <input class="w2ui-input" name="h" maxlength="3" max="360" tabindex="101">
                        <span>R</span> <input class="w2ui-input" name="r" maxlength="3" max="255" tabindex="104">
                    </div>
                    <div class="color-part">
                        <span>S</span> <input class="w2ui-input" name="s" maxlength="3" max="100" tabindex="102">
                        <span>G</span> <input class="w2ui-input" name="g" maxlength="3" max="255" tabindex="105">
                    </div>
                    <div class="color-part">
                        <span>V</span> <input class="w2ui-input" name="v" maxlength="3" max="100" tabindex="103">
                        <span>B</span> <input class="w2ui-input" name="b" maxlength="3" max="255" tabindex="106">
                    </div>
                    <div class="color-part opacity">
                        <span>${w.lang("Opacity")}</span>
                        <input class="w2ui-input" name="a" maxlength="5" max="1" tabindex="107">
                    </div>
                </div>
                <div class="palette" name="palette">
                    <div class="palette-bg"></div>
                    <div class="value1 move-x move-y"></div>
                </div>
                <div class="rainbow" name="rainbow">
                    <div class="value2 move-x"></div>
                </div>
                <div class="alpha" name="alpha">
                    <div class="alpha-bg"></div>
                    <div class="value2 move-x"></div>
                </div>
            </div>`) + `
            <div class="w2ui-color-tabs">
                <div class="w2ui-color-tab selected w2ui-eaction" data-click="tabClick|1|event|this"><span class="w2ui-icon w2ui-icon-colors"></span></div>
                <div class="w2ui-color-tab w2ui-eaction" data-click="tabClick|2|event|this"><span class="w2ui-icon w2ui-icon-settings"></span></div>
                <div style="padding: 5px; width: 100%; text-align: right;">
                    ${typeof t.html == "string" ? t.html : ""}
                </div>
            </div>`;
  }
  initControls(e) {
    let t, s = this;
    var i = e.options;
    let n = w.parseColor(i.color || e.tmp.initColor), o = (n == null && (n = { r: 140, g: 150, b: 160, a: 1 }), w.rgb2hsv(n));
    i.advanced === true && this.tabClick(2, e.name), c(o, true, true), d(e.box).find("input").off(".w2color").on("change.w2color", (_) => {
      _ = d(_.target);
      let b = parseFloat(_.val());
      var C = parseFloat(_.attr("max")), C = (isNaN(b) && (b = 0, _.val(0)), 1 < C && (b = parseInt(b)), 0 < C && b > C && (_.val(C), b = C), b < 0 && (_.val(0), b = 0), _.attr("name")), _ = {};
      ["r", "g", "b", "a"].indexOf(C) !== -1 ? (n[C] = b, o = w.rgb2hsv(n)) : ["h", "s", "v"].indexOf(C) !== -1 && (_[C] = b), c(_, true);
    }), d(e.box).find(".color-original").off(".w2color").on("click.w2color", (x) => {
      x = w.parseColor(d(x.target).css("background-color")), x != null && (n = x, c(o = w.rgb2hsv(n), true));
    }), i = `${w.isIOS ? "touchstart" : "mousedown"}.w2color`;
    let a = `${w.isIOS ? "touchend" : "mouseup"}.w2color`, l = `${w.isIOS ? "touchmove" : "mousemove"}.w2color`;
    function c(x, b, C) {
      var _a2;
      x.h != null && (o.h = x.h), x.s != null && (o.s = x.s), x.v != null && (o.v = x.v), x.a != null && (n.a = x.a, o.a = x.a);
      let _ = "rgba(" + (n = w.hsv2rgb(o)).r + "," + n.g + "," + n.b + "," + n.a + ")", S = [Number(n.r).toString(16).toUpperCase(), Number(n.g).toString(16).toUpperCase(), Number(n.b).toString(16).toUpperCase(), Math.round(255 * Number(n.a)).toString(16).toUpperCase()];
      var A, P;
      S.forEach((X, q) => {
        X.length === 1 && (S[q] = "0" + X);
      }), _ = S[0] + S[1] + S[2] + S[3], n.a === 1 && (_ = S[0] + S[1] + S[2]), d(e.box).find(".color-preview").css("background-color", "#" + _), d(e.box).find("input").each((X) => {
        X.name && (n[X.name] != null && (X.value = n[X.name]), o[X.name] != null && (X.value = o[X.name]), X.name === "a") && (X.value = n.a);
      }), C ? (x = ((_a2 = e.tmp) == null ? void 0 : _a2.initColor) || _, d(e.box).find(".color-original").css("background-color", "#" + x), d(e.box).find(".w2ui-colors .w2ui-selected").removeClass("w2ui-selected"), d(e.box).find(`.w2ui-colors [name="${x}"]`).addClass("w2ui-selected"), _.length == 8 && s.tabClick(2, e.name)) : s.select(_, e.name), b && (C = d(e.box).find(".palette .value1"), x = d(e.box).find(".rainbow .value2"), b = d(e.box).find(".alpha .value2"), A = parseInt(C[0].clientWidth) / 2, P = parseInt(x[0].clientWidth) / 2, C.css({ left: 150 * o.s / 100 - A + "px", top: 125 * (100 - o.v) / 100 - A + "px" }), x.css("left", o.h / 2.4 - P + "px"), b.css("left", 150 * n.a - P + "px"), h());
    }
    function h() {
      var x = w.hsv2rgb(o.h, 100, 100), x = `${x.r},${x.g},` + x.b;
      d(e.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${x},0) 0%, rgba(${x},1) 100%)`);
    }
    function p(x) {
      d("body").off(".w2color");
    }
    function f(S) {
      var P = t.el, _ = S.pageX - t.x, S = S.pageY - t.y;
      let b = t.left + _, C = t.top + S;
      var _ = parseInt(P.prop("clientWidth")) / 2, S = (b < -_ && (b = -_), C < -_ && (C = -_), b > t.width - _ && (b = t.width - _), C > t.height - _ && (C = t.height - _), P.hasClass("move-x") && P.css({ left: b + "px" }), P.hasClass("move-y") && P.css({ top: C + "px" }), d(P.get(0).parentNode).attr("name")), A = parseInt(P.css("left")) + _, P = parseInt(P.css("top")) + _;
      S === "palette" && c({ s: Math.round(A / t.width * 100), v: Math.round(100 - P / t.height * 100) }), S === "rainbow" && (c({ h: Math.round(2.4 * A) }), h()), S === "alpha" && c({ a: parseFloat(Number(A / 150).toFixed(2)) });
    }
    d(e.box).find(".palette, .rainbow, .alpha").off(".w2color").on(i + ".w2color", function(x) {
      var b = d(this).find(".value1, .value2"), C = parseInt(b.prop("clientWidth")) / 2;
      b.hasClass("move-x") && b.css({ left: x.offsetX - C + "px" }), b.hasClass("move-y") && b.css({ top: x.offsetY - C + "px" }), t = { el: b, x: x.pageX, y: x.pageY, width: b.prop("parentNode").clientWidth, height: b.prop("parentNode").clientHeight, left: parseInt(b.css("left")), top: parseInt(b.css("top")) }, f(x), d("body").off(".w2color").on(l, f).on(a, p);
    });
  }
}
class Wr extends ut {
  constructor() {
    super(), this.defaults = w.extend({}, this.defaults, { type: "normal", items: [], index: null, render: null, spinner: false, msgNoItems: w.lang("No items found"), topHTML: "", menuStyle: "", filter: false, markSearch: false, match: "contains", search: false, altRows: false, arrowSize: 10, align: "left", position: "bottom|top", class: "w2ui-white", anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change", "select"], onSelect: null, onSubMenu: null, onRemove: null });
  }
  attach(e, t) {
    let s;
    arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((s = t).anchor = e), t = s.hideOn, s = w.extend({}, this.defaults, s || {}), t && (s.hideOn = t), s.style += "; padding: 0;", s.items == null && (s.items = []), s.html = this.getMenuHTML(s);
    let i = super.attach(s), n = i.overlay;
    return n.on("show:after.attach, update:after.attach", (o) => {
      var _a2;
      if ((_a2 = i.overlay) == null ? void 0 : _a2.box) {
        let l = "";
        n.selected = null, n.options.items = w.normMenu(n.options.items), ["INPUT", "TEXTAREA"].includes(n.anchor.tagName) && (l = n.anchor.value, n.selected = n.anchor.dataset.selectedIndex);
        var a = d(i.overlay.box).find(".w2ui-eaction");
        w.bindEvents(a, this), this.applyFilter(n.name, null, l).then((c) => {
          n.tmp.searchCount = c.count, n.tmp.search = c.search, this.refreshSearch(n.name), this.initControls(i.overlay), this.refreshIndex(n.name);
        });
      }
    }), n.on("hide:after.attach", (o) => {
      rt.hide(n.name + "-tooltip");
    }), i.select = (o) => (n.on("select.attach", (a) => {
      o(a);
    }), i), i.remove = (o) => (n.on("remove.attach", (a) => {
      o(a);
    }), i), i.subMenu = (o) => (n.on("subMenu.attach", (a) => {
      o(a);
    }), i), i;
  }
  update(e, t) {
    var s, i = ut.active[e];
    i ? ((s = i.options).items != t && (s.items = t), t = this.getMenuHTML(s), s.html != t && (s.html = t, i.needsUpdate = true, this.show(e))) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
  }
  initControls(e) {
    d(e.box).find(".w2ui-menu:not(.w2ui-sub-menu)").off(".w2menu").on("mouseDown.w2menu", { delegate: ".w2ui-menu-item" }, (t) => {
      var s = t.delegate.dataset;
      this.menuDown(e, t, s.index, s.parents);
    }).on((w.isIOS ? "touchStart" : "click") + ".w2menu", { delegate: ".w2ui-menu-item" }, (t) => {
      var s = t.delegate.dataset;
      this.menuClick(e, t, parseInt(s.index), s.parents);
    }).find(".w2ui-menu-item").off(".w2menu").on("mouseEnter.w2menu", (t) => {
      var _a2;
      var s = t.target.dataset, s = (_a2 = e.options.items[s.index]) == null ? void 0 : _a2.tooltip;
      s && rt.show({ name: e.name + "-tooltip", anchor: t.target, html: s, position: "right|left", hideOn: ["doc-click"] });
    }).on("mouseLeave.w2menu", (t) => {
      rt.hide(e.name + "-tooltip");
    }), ["INPUT", "TEXTAREA"].includes(e.anchor.tagName) && d(e.anchor).off(".w2menu").on("input.w2menu", (t) => {
    }).on("keyup.w2menu", (t) => {
      t._searchType = "filter", this.keyUp(e, t);
    }), e.options.search && d(e.box).find("#menu-search").off(".w2menu").on("keyup.w2menu", (t) => {
      t._searchType = "search", this.keyUp(e, t);
    });
  }
  getCurrent(a, n) {
    var a = ut.active[a.replace(/[\s\.#]/g, "_")], s = a.options;
    let i = (n || (a.selected ?? "")).split("-");
    var n = i.length - 1, a = i[n], o = i.slice(0, i.length - 1).join("-"), a = w.isInt(a) ? parseInt(a) : 0;
    let l = s.items;
    return i.forEach((c, h) => {
      h < i.length - 1 && (l = l[c].items);
    }), { last: n, index: a, items: l, item: l[a], parents: o };
  }
  getMenuHTML(e, t, s, i) {
    if (e.spinner) return `
            <div class="w2ui-menu">
                <div class="w2ui-no-items">
                    <div class="w2ui-spinner"></div>
                    ${w.lang("Loading...")}
                </div>
            </div>`;
    i = i || [], t == null && (t = e.items), Array.isArray(t) || (t = []);
    let n = 0, o = null, a = "", l = (!s && e.search && (a += `
                <div class="w2ui-menu-search">
                    <span class="w2ui-icon w2ui-icon-search"></span>
                    <input id="menu-search" class="w2ui-input" type="text"/>
                </div>`, t.forEach((c) => c.hidden = false)), !s && e.topHTML && (a += `<div class="w2ui-menu-top">${e.topHTML}</div>`), `
            ${a}
            <div class="w2ui-menu ${s ? "w2ui-sub-menu" : ""}" ${s ? "" : `style="${e.menuStyle}"`}
                data-parent="${i}">
        `);
    return t.forEach((c, h) => {
      o = c.icon;
      var p = (0 < i.length ? i.join("-") + "-" : "") + h;
      if (o == null && (o = null), ["radio", "check"].indexOf(e.type) == -1 || Array.isArray(c.items) || c.group === false || (o = c.checked === true ? "w2ui-icon-check" : "w2ui-icon-empty"), c.hidden !== true) {
        let x = c.text, b = "", C = "";
        if (typeof (x = typeof e.render == "function" ? e.render(c, e) : x) == "function" && (x = x(c, e)), o && (String(o).slice(0, 1) !== "<" && (o = `<span class="w2ui-icon ${o}"></span>`), b = `<div class="menu-icon">${o}</span></div>`), c.type !== "break" && x != null && x !== "" && String(x).substr(0, 2) != "--") {
          var f = ["w2ui-menu-item"];
          e.altRows == 1 && f.push(n % 2 == 0 ? "w2ui-even" : "w2ui-odd");
          let _ = 1, S = (b === "" && _++, c.count == null && c.hotkey == null && c.remove !== true && c.items == null && _++, c.tooltip == null && c.hint != null && (c.tooltip = c.hint), "");
          if (c.remove === true) S = '<span class="remove">x</span>';
          else if (c.items != null) {
            let A = [];
            typeof c.items == "function" ? A = c.items(c) : Array.isArray(c.items) && (A = c.items), S = "<span></span>", C = `
                            <div class="w2ui-sub-menu-box" style="${c.expanded ? "" : "display: none"}">
                                ${this.getMenuHTML(e, A, true, i.concat(h))}
                            </div>`;
          } else c.count != null && (S += "<span>" + c.count + "</span>"), c.hotkey != null && (S += '<span class="hotkey">' + c.hotkey + "</span>");
          c.disabled === true && f.push("w2ui-disabled"), c._noSearchInside === true && f.push("w2ui-no-search-inside"), C !== "" && (f.push("has-sub-menu"), c.expanded ? f.push("expanded") : f.push("collapsed")), l += `
                        <div index="${p}" class="${f.join(" ")}" style="${c.style || ""}"
                            data-index="${h}" data-parents="${i.join("-")}">
                                <div style="width: ${(s ? 20 : 0) + parseInt(c.indent ?? 0)}px"></div>
                                ${b}
                                <div class="menu-text" colspan="${_}">${w.lang(x)}</div>
                                <div class="menu-extra">${S}</div>
                        </div>
                        ` + C, n++;
        } else f = (x ?? "").replace(/^-+/g, ""), l += `
                        <div index="${p}" class="w2ui-menu-divider ${f != "" ? "has-text" : ""}">
                            <div class="line"></div>
                            ${f ? `<div class="text">${f}</div>` : ""}
                        </div>`;
      }
      t[h] = c;
    }), n === 0 && e.msgNoItems && (l += `
                <div class="w2ui-no-items">
                    ${w.lang(e.msgNoItems)}
                </div>`), l += "</div>";
  }
  refreshIndex(i) {
    var t, s, i = ut.active[i.replace(/[\s\.#]/g, "_")];
    i && (i.displayed || this.show(i.name), t = d(i.box).find(".w2ui-overlay-body").get(0), s = d(i.box).find(".w2ui-menu-search, .w2ui-menu-top").get(0), d(i.box).find(".w2ui-menu-item.w2ui-selected").removeClass("w2ui-selected"), i = d(i.box).find(`.w2ui-menu-item[index="${i.selected}"]`).addClass("w2ui-selected").get(0)) && (i.offsetTop + i.clientHeight > t.clientHeight + t.scrollTop && i.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" }), i.offsetTop < t.scrollTop + (s ? s.clientHeight : 0)) && i.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
  }
  refreshSearch(e) {
    var _a2, _b;
    let t = ut.active[e.replace(/[\s\.#]/g, "_")];
    t && (t.displayed || this.show(t.name), d(t.box).find(".w2ui-no-items").hide(), d(t.box).find(".w2ui-menu-item, .w2ui-menu-divider").each((s) => {
      var _a3, _b2;
      var i;
      ((_a3 = this.getCurrent(e, s.getAttribute("index")).item) == null ? void 0 : _a3.hidden) ? d(s).hide() : ((i = (_b2 = t.tmp) == null ? void 0 : _b2.search) && t.options.markSearch && w.marker(s, i, { onlyFirst: t.options.match == "begins" }), d(s).show());
    }), d(t.box).find(".w2ui-sub-menu").each((s) => {
      var i = d(s).find(".w2ui-menu-item").get().some((n) => n.style.display != "none");
      this.getCurrent(e, s.dataset.parent).item.expanded && (i ? d(s).parent().show() : d(s).parent().hide());
    }), t.tmp.searchCount != 0 && ((_b = (_a2 = t.options) == null ? void 0 : _a2.items) == null ? void 0 : _b.length) != 0 || (d(t.box).find(".w2ui-no-items").length == 0 && d(t.box).find(".w2ui-menu:not(.w2ui-sub-menu)").append(`
                    <div class="w2ui-no-items">
                        ${w.lang(t.options.msgNoItems)}
                    </div>`), d(t.box).find(".w2ui-no-items").show()));
  }
  applyFilter(e, t, s, i) {
    var _a2;
    let n = 0;
    var o = ut.active[e.replace(/[\s\.#]/g, "_")];
    let a = o.options, l, c;
    var h = new Promise((x, b) => {
      l = x, c = b;
    });
    s == null && (s = ["INPUT", "TEXTAREA"].includes(o.anchor.tagName) ? o.anchor.value : "");
    let p = [];
    a.selected && (Array.isArray(a.selected) ? p = a.selected.map((x) => (x == null ? void 0 : x.id) ?? x) : ((_a2 = a.selected) == null ? void 0 : _a2.id) && (p = [a.selected.id])), o.tmp.activeChain = null;
    var f = o.tmp.remote ?? { hasMore: true, emtpySet: false, search: null, total: -1 };
    if (t == null && a.url && f.hasMore && f.search !== s) {
      let x = true, b = w.lang("Loading...");
      s.length < a.minLength && f.emptySet !== true && (b = w.lang("${count} letters or more...", { count: a.minLength }), x = false, s === "") && (b = w.lang(a.msgSearch)), d(o.box).find(".w2ui-no-items").html(b), f.search = s, a.items = [], o.tmp.remote = f, x && this.request(o, s, i).then((C) => {
        this.update(e, C), this.applyFilter(e, null, s).then((_) => {
          l(_);
        });
      }).catch((C) => {
        console.log("Server Request error", C);
      });
    } else {
      let x;
      t == null && (x = this.trigger("search", { search: s, overlay: o, prom: h, resolve: l, reject: c })).isCancelled === true || (t == null && (t = o.options.items), a.filter === false ? l({ count: -1, search: s }) : (t.forEach((b) => {
        let C = "", _ = "";
        ["is", "begins", "begins with"].indexOf(a.match) !== -1 && (C = "^"), ["is", "ends", "ends with"].indexOf(a.match) !== -1 && (_ = "$");
        try {
          new RegExp(C + s + _, "i").test(b.text) || b.text === "..." ? b.hidden = false : b.hidden = true;
        } catch {
        }
        a.hideSelected && p.includes(b.id) && (b.hidden = true), Array.isArray(b.items) && 0 < b.items.length && (delete b._noSearchInside, this.applyFilter(e, b.items, s).then((S) => {
          S = S.count, 0 < S && (n += S, b.hidden && (b._noSearchInside = true), s && (b.expanded = true), b.hidden = false);
        })), b.hidden !== true && n++;
      }), l({ count: n, search: s }), x == null ? void 0 : x.finish()));
    }
    return h;
  }
  request(e, t, s) {
    let i = e.options, n = e.tmp.remote, o, a;
    return (i.items.length === 0 && n.total !== 0 || n.total == i.cacheMax && t.length > n.search.length || t.length >= n.search.length && t.substr(0, n.search.length) !== n.search || t.length < n.search.length) && (n.controller && n.controller.abort(), n.loading = true, clearTimeout(n.timeout), n.timeout = setTimeout(() => {
      var l = i.url;
      let c = { search: t, max: i.cacheMax };
      Object.assign(c, i.postData);
      var h, p = this.trigger("request", { search: t, overlay: e, url: l, postData: c, httpMethod: i.method ?? "GET", httpHeaders: {} });
      p.isCancelled !== true && (l = new URL(p.detail.url, location), h = w.prepareParams(l, { method: p.detail.httpMethod, headers: p.detail.httpHeaders, body: p.detail.postData }), n.controller = new AbortController(), h.signal = n.controller.signal, fetch(l, h).then((f) => f.json()).then((f) => {
        n.controller = null;
        var x = e.trigger("load", { search: c.search, overlay: e, data: f });
        x.isCancelled !== true && (typeof (f = x.detail.data) == "string" && (f = JSON.parse(f)), (f = Array.isArray(f) ? { records: f } : f).records == null && f.items != null && (f.records = f.items, delete f.items), f.error || f.records != null || (f.records = []), Array.isArray(f.records) ? (f.records.length >= i.cacheMax ? (f.records.splice(i.cacheMax, f.records.length), n.hasMore = true) : n.hasMore = false, i.recId == null && i.recid != null && (i.recId = i.recid), (i.recId || i.recText) && f.records.forEach((b) => {
          typeof i.recId == "string" && (b.id = b[i.recId]), typeof i.recId == "function" && (b.id = i.recId(b)), typeof i.recText == "string" && (b.text = b[i.recText]), typeof i.recText == "function" && (b.text = i.recText(b));
        }), n.loading = false, n.search = t, n.total = f.records.length, n.lastError = "", n.emptySet = t === "" && f.records.length === 0, x.finish(), o(w.normMenu(f.records))) : console.error("ERROR: server did not return proper data structure", `
`, " - it should return", { records: [{ id: 1, text: "item" }] }, `
`, " - or just an array ", [{ id: 1, text: "item" }], `
`, " - or if errorr ", { error: true, message: "error message" }));
      }).catch((f) => {
        var x = this.trigger("error", { overlay: e, search: t, error: f });
        x.isCancelled !== true && ((f == null ? void 0 : f.name) !== "AbortError" && console.error("ERROR: Server communication failed.", `
`, " - it should return", { records: [{ id: 1, text: "item" }] }, `
`, " - or just an array ", [{ id: 1, text: "item" }], `
`, " - or if errorr ", { error: true, message: "error message" }), n.loading = false, n.search = "", n.total = -1, n.emptySet = true, n.lastError = x.detail.error || "Server communication failed", i.items = [], x.finish(), a());
      }), p.finish());
    }, s ? i.debounce ?? 350 : 0)), new Promise((l, c) => {
      o = l, a = c;
    });
  }
  getActiveChain(e, t, s = [], i = [], n) {
    var o = ut.active[e.replace(/[\s\.#]/g, "_")];
    return o.tmp.activeChain != null ? o.tmp.activeChain : ((t = t ?? o.options.items).forEach((a, l) => {
      var _a2;
      a.hidden || a.disabled || ((_a2 = a == null ? void 0 : a.text) == null ? void 0 : _a2.startsWith("--")) || (i.push(s.concat([l]).join("-")), Array.isArray(a.items) && 0 < a.items.length && a.expanded && (s.push(l), this.getActiveChain(e, a.items, s, i, true), s.pop()));
    }), n == null && (o.tmp.activeChain = i), i);
  }
  menuDown(e, t, s, i) {
    e = e.options;
    let n = e.items;
    var o = d(t.delegate).find(".w2ui-icon");
    let a = d(t.target).closest(".w2ui-menu:not(.w2ui-sub-menu)"), l = (typeof i == "string" && i !== "" && i.split("-").forEach((c) => {
      n = n[c].items;
    }), n[s]);
    if (!l.disabled) {
      let c = (h, p) => {
        h.forEach((f, x) => {
          f.id != l.id && (f.group === l.group && f.checked && (a.find(`.w2ui-menu-item[index="${(p ? p + "-" : "") + x}"] .w2ui-icon`).removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), h[x].checked = false), Array.isArray(f.items)) && c(f.items, x);
        });
      };
      e.type !== "check" && e.type !== "radio" || l.group === false || d(t.target).hasClass("remove") || d(t.target).closest(".w2ui-menu-item").hasClass("has-sub-menu") || (l.checked = e.type == "radio" || !l.checked, l.checked ? (e.type === "radio" && d(t.target).closest(".w2ui-menu").find(".w2ui-icon").removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), e.type === "check" && l.group != null && c(e.items), o.removeClass("w2ui-icon-empty").addClass("w2ui-icon-check")) : e.type === "check" && o.removeClass("w2ui-icon-check").addClass("w2ui-icon-empty")), d(t.target).hasClass("remove") || (a.find(".w2ui-menu-item").removeClass("w2ui-selected"), d(t.delegate).addClass("w2ui-selected"));
    }
  }
  menuClick(e, t, s, i) {
    var n = e.options;
    let o = n.items;
    var a = d(t.delegate).closest(".w2ui-menu-item");
    let l = !n.hideOn.includes("select");
    (t.shiftKey || t.metaKey || t.ctrlKey) && (l = true), typeof i == "string" && i !== "" ? i.split("-").forEach((h) => {
      o = o[h].items;
    }) : i = null;
    var c = (o = typeof o == "function" ? o({ overlay: e, index: s, parentIndex: i, event: t }) : o)[s];
    if (!c.disabled || d(t.target).hasClass("remove")) {
      let h;
      if (d(t.target).hasClass("remove")) {
        if ((h = this.trigger("remove", { originalEvent: t, target: e.name, overlay: e, item: c, index: s, parentIndex: i, el: a[0] })).isCancelled === true) return;
        l = !n.hideOn.includes("item-remove"), a.remove();
      } else if (a.hasClass("has-sub-menu")) {
        if ((h = this.trigger("subMenu", { originalEvent: t, target: e.name, overlay: e, item: c, index: s, parentIndex: i, el: a[0] })).isCancelled === true) return;
        l = true, a.hasClass("expanded") ? (c.expanded = false, a.removeClass("expanded").addClass("collapsed"), d(a.get(0).nextElementSibling).hide()) : (c.expanded = true, a.addClass("expanded").removeClass("collapsed"), d(a.get(0).nextElementSibling).show()), e.selected = parseInt(a.attr("index"));
      } else {
        if (n = this.findChecked(n.items), e.selected = parseInt(a.attr("index")), (h = this.trigger("select", { originalEvent: t, target: e.name, overlay: e, item: c, index: s, parentIndex: i, selected: n, keepOpen: l, el: a[0] })).isCancelled === true) return;
        c.keepOpen != null && (l = c.keepOpen), ["INPUT", "TEXTAREA"].includes(e.anchor.tagName) && (e.anchor.dataset.selected = c.id, e.anchor.dataset.selectedIndex = e.selected);
      }
      l || this.hide(e.name), h.finish();
    }
  }
  findChecked(e) {
    let t = [];
    return e.forEach((s) => {
      s.checked && t.push(s), Array.isArray(s.items) && (t = t.concat(this.findChecked(s.items)));
    }), t;
  }
  keyUp(e, t) {
    var _a2, _b;
    var s = e.options, i = t.target.value;
    let n = true, o = false;
    switch (t.keyCode) {
      case 46:
      case 8:
        i !== "" || e.displayed || (n = false);
        break;
      case 13:
        if (!e.displayed || !e.selected) return;
        var { index: l, parents: a } = this.getCurrent(e.name);
        t.delegate = d(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(l), a), n = false;
        break;
      case 27:
        n = false, e.displayed ? this.hide(e.name) : (l = e.anchor, ["INPUT", "TEXTAREA"].includes(l.tagName) && (l.value = "", delete l.dataset.selected, delete l.dataset.selectedIndex));
        break;
      case 37: {
        if (!e.displayed) return;
        let { item: h, index: p, parents: f } = this.getCurrent(e.name);
        f && (h = s.items[f], p = parseInt(f), f = "", o = true), Array.isArray(h == null ? void 0 : h.items) && 0 < h.items.length && h.expanded && (t.delegate = d(e.box).find(`.w2ui-menu-item[index="${p}"]`).get(0), e.selected = p, this.menuClick(e, t, parseInt(p), f)), n = false;
        break;
      }
      case 39:
        if (!e.displayed) return;
        var { item: a, index: l, parents: c } = this.getCurrent(e.name);
        Array.isArray(a == null ? void 0 : a.items) && 0 < a.items.length && !a.expanded && (t.delegate = d(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(l), c)), n = false;
        break;
      case 38:
        e.displayed && (a = this.getActiveChain(e.name), e.selected == null || ((_a2 = e.selected) == null ? void 0 : _a2.length) == 0 ? e.selected = a[a.length - 1] : ((l = a.indexOf(e.selected)) == -1 && (e.selected = a[a.length - 1]), 0 < l && (e.selected = a[l - 1])), n = false, o = true, t.preventDefault());
        break;
      case 40:
        e.displayed && (c = this.getActiveChain(e.name), e.selected == null || ((_b = e.selected) == null ? void 0 : _b.length) == 0 ? e.selected = c[0] : ((a = c.indexOf(e.selected)) == -1 && (e.selected = c[0]), a < c.length - 1 && (e.selected = c[a + 1])), n = false, o = true, t.preventDefault());
    }
    n && e.displayed && (s.filter && t._searchType == "filter" || s.search && t._searchType == "search") && this.applyFilter(e.name, null, i, true).then((h) => {
      e.tmp.searchCount = h.count, e.tmp.search = h.search, h.count !== 0 && this.getActiveChain(e.name).includes(e.selected) || (e.selected = null), this.refreshSearch(e.name);
    }), o && this.refreshIndex(e.name);
  }
}
class Zr extends ut {
  constructor() {
    super();
    var e = /* @__PURE__ */ new Date();
    this.daysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], this.today = e.getFullYear() + "/" + (Number(e.getMonth()) + 1) + "/" + e.getDate(), this.defaults = w.extend({}, this.defaults, { position: "top|bottom", class: "w2ui-calendar", type: "date", format: "", value: "", start: null, end: null, blockDates: [], blockWeekdays: [], colored: {}, arrowSize: 12, autoResize: false, anchorClass: "w2ui-focus", autoShowOn: "focus", hideOn: ["doc-click", "focus-change"], onSelect: null });
  }
  attach(n, i) {
    let s;
    arguments.length == 1 && n.anchor ? n = (s = n).anchor : arguments.length === 2 && i != null && typeof i == "object" && ((s = i).anchor = n);
    var i = s.hideOn, n = (s = w.extend({}, this.defaults, s || {}), i && (s.hideOn = i), s.format || (n = w.settings.dateFormat, i = w.settings.timeFormat, s.type == "date" ? s.format = n : s.type == "time" ? s.format = i : s.format = n + "|" + i), s.type == "time" ? this.getHourHTML(s) : this.getMonthHTML(s));
    s.style += "; padding: 0;", s.html = n.html;
    let o = super.attach(s), a = o.overlay;
    return Object.assign(a.tmp, n), a.on("show.attach", (c) => {
      var c = c.detail.overlay, h = c.anchor, p = c.options;
      ["INPUT", "TEXTAREA"].includes(h.tagName) && !p.value && h.value && (c.tmp.initValue = h.value), delete c.newValue, delete c.newDate;
    }), a.on("show:after.attach", (l) => {
      var _a2;
      ((_a2 = o.overlay) == null ? void 0 : _a2.box) && this.initControls(o.overlay);
    }), a.on("update:after.attach", (l) => {
      var _a2;
      ((_a2 = o.overlay) == null ? void 0 : _a2.box) && this.initControls(o.overlay);
    }), a.on("hide.attach", (c) => {
      var c = c.detail.overlay, h = c.anchor;
      c.newValue != null && (c.newDate && (c.newValue = c.newDate + " " + c.newValue), ["INPUT", "TEXTAREA"].includes(h.tagName) && h.value != c.newValue && (h.value = c.newValue), (h = this.trigger("select", { date: c.newValue, target: c.name, overlay: c })).isCancelled !== true) && h.finish();
    }), o.select = (l) => (a.on("select.attach", (c) => {
      l(c);
    }), o), o;
  }
  initControls(e) {
    let t = e.options, s = (n) => {
      let { month: o, year: a } = e.tmp;
      12 < (o += n) && (o = 1, a++), o < 1 && (o = 12, a--), n = this.getMonthHTML(t, o, a), Object.assign(e.tmp, n), d(e.box).find(".w2ui-overlay-body").html(n.html), this.initControls(e);
    }, i = (n, o) => {
      d(n.target).parent().find(".w2ui-jump-month, .w2ui-jump-year").removeClass("w2ui-selected"), d(n.target).addClass("w2ui-selected"), n = /* @__PURE__ */ new Date();
      let { jumpMonth: a, jumpYear: l } = e.tmp;
      (a = o && (l == null && (l = n.getFullYear()), a == null) ? n.getMonth() + 1 : a) && l && (o = this.getMonthHTML(t, a, l), Object.assign(e.tmp, o), d(e.box).find(".w2ui-overlay-body").html(o.html), e.tmp.jump = false, this.initControls(e));
    };
    d(e.box).find(".w2ui-cal-title").off(".calendar").on("click.calendar", (n) => {
      var o, a;
      Object.assign(e.tmp, { jumpYear: null, jumpMonth: null }), e.tmp.jump ? ({ month: o, year: a } = e.tmp, o = this.getMonthHTML(t, o, a), d(e.box).find(".w2ui-overlay-body").html(o.html), e.tmp.jump = false) : (d(e.box).find(".w2ui-overlay-body .w2ui-cal-days").replace(this.getYearHTML()), (a = d(e.box).find(`[name="${e.tmp.year}"]`).get(0)) && a.scrollIntoView(true), e.tmp.jump = true), this.initControls(e), n.stopPropagation();
    }).find(".w2ui-cal-previous").off(".calendar").on("click.calendar", (n) => {
      s(-1), n.stopPropagation();
    }).parent().find(".w2ui-cal-next").off(".calendar").on("click.calendar", (n) => {
      s(1), n.stopPropagation();
    }), d(e.box).find(".w2ui-cal-now").off(".calendar").on("click.calendar", (n) => {
      t.type == "datetime" ? e.newDate ? e.newValue = w.formatTime(/* @__PURE__ */ new Date(), t.format.split("|")[1]) : e.newValue = w.formatDateTime(/* @__PURE__ */ new Date(), t.format) : t.type == "date" ? e.newValue = w.formatDate(/* @__PURE__ */ new Date(), t.format) : t.type == "time" && (e.newValue = w.formatTime(/* @__PURE__ */ new Date(), t.format)), this.hide(e.name);
    }), d(e.box).off(".calendar").on("click.calendar", { delegate: ".w2ui-day.w2ui-date" }, (n) => {
      t.type == "datetime" ? (e.newDate = d(n.target).attr("date"), d(e.box).find(".w2ui-overlay-body").html(this.getHourHTML(e.options).html), this.initControls(e)) : (e.newValue = d(n.target).attr("date"), this.hide(e.name));
    }).on("click.calendar", { delegate: ".w2ui-jump-month" }, (n) => {
      e.tmp.jumpMonth = parseInt(d(n.target).attr("name")), i(n);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-month" }, (n) => {
      e.tmp.jumpMonth = parseInt(d(n.target).attr("name")), i(n, true);
    }).on("click.calendar", { delegate: ".w2ui-jump-year" }, (n) => {
      e.tmp.jumpYear = parseInt(d(n.target).attr("name")), i(n);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-year" }, (n) => {
      e.tmp.jumpYear = parseInt(d(n.target).attr("name")), i(n, true);
    }).on("click.calendar", { delegate: ".w2ui-time.hour" }, (o) => {
      var o = d(o.target).attr("hour");
      let a = this.str2min(t.value) % 60;
      e.tmp.initValue && !t.value && (a = this.str2min(e.tmp.initValue) % 60), t.noMinutes ? (e.newValue = this.min2str(60 * o, t.format), this.hide(e.name)) : (e.newValue = o + ":" + a, o = this.getMinHTML(o, t).html, d(e.box).find(".w2ui-overlay-body").html(o), this.initControls(e));
    }).on("click.calendar", { delegate: ".w2ui-time.min" }, (n) => {
      n = 60 * Math.floor(this.str2min(e.newValue) / 60) + parseInt(d(n.target).attr("min")), e.newValue = this.min2str(n, t.format), this.hide(e.name);
    });
  }
  getMonthHTML(e, t, s) {
    var o = w.settings.fulldays.slice(), i = w.settings.shortdays.slice();
    w.settings.weekStarts !== "M" && (o.unshift(o.pop()), i.unshift(i.pop()));
    let n = /* @__PURE__ */ new Date();
    var o = e.type === "datetime" ? w.isDateTime(e.value, e.format, true) : w.isDate(e.value, e.format, true), a = w.formatDate(o);
    t != null && s != null || (s = (o || n).getFullYear(), t = o ? o.getMonth() + 1 : n.getMonth() + 1), 12 < t && (t -= 12, s++), (t < 1 || t === 0) && (t += 12, s--), s / 4 == Math.floor(s / 4) ? this.daysCount[1] = 29 : this.daysCount[1] = 28, e.current = t + "/" + s;
    let l = (n = new Date(s, t - 1, 1)).getDay(), c = "";
    var h = w.settings.weekStarts;
    for (let A = 0; A < i.length; A++) {
      var p = h == "M" && A == 5 || h != "M" && A == 6, f = h == "M" && A == 6 || h != "M" && A == 0;
      c += `<div class="w2ui-day w2ui-weekday ${p ? "w2ui-sunday" : ""} ${f ? "w2ui-saturday" : ""}">${i[A]}</div>`;
    }
    let x = `
            <div class="w2ui-cal-title">
                <div class="w2ui-cal-previous">
                    <div></div>
                </div>
                <div class="w2ui-cal-next">
                    <div></div>
                </div>
                ${w.settings.fullmonths[t - 1]}, ${s}
                <span class="arrow-down"></span>
            </div>
            <div class="w2ui-cal-days">
                ${c}
        `, b = /* @__PURE__ */ new Date(s + `/${t}/1`);
    o = (b = new Date(b.getTime() + 432e5)).getDay(), w.settings.weekStarts == "M" && l--, 0 < o && (b = new Date(b.getTime() - 864e5 * l));
    for (let A = 0; A < 42; A++) {
      var C = [], _ = `${b.getFullYear()}/${b.getMonth() + 1}/` + b.getDate(), S = (b.getDay() === 6 && C.push("w2ui-saturday"), b.getDay() === 0 && C.push("w2ui-sunday"), b.getMonth() + 1 !== t && C.push("outside"), _ == this.today && C.push("w2ui-today"), b.getDate());
      let P = "", X = "", q, G;
      G = e.type === "datetime" ? (q = w.formatDateTime(_, e.format), w.formatDate(_, w.settings.dateFormat)) : q = w.formatDate(_, e.format), e.colored && e.colored[G] !== void 0 && (_ = e.colored[G].split("|"), X = "background-color: " + _[0] + ";", P = "color: " + _[1] + ";"), x += `<div class="w2ui-day ${this.inRange(q, e, true) ? "w2ui-date " + (G == a ? "w2ui-selected" : "") : "w2ui-blocked"} ${C.join(" ")}"
                       style="${P + X}" date="${G}" data-date="${b.getTime()}">
                            ${S}
                    </div>`, b = new Date(b.getTime() + 864e5);
    }
    return x += "</div>", e.btnNow && (o = w.lang("Today" + (e.type == "datetime" ? " & Now" : "")), x += `<div class="w2ui-cal-now">${o}</div>`), { html: x, month: t, year: s };
  }
  getYearHTML() {
    let e = "", t = "";
    for (let s = 0; s < w.settings.fullmonths.length; s++) e += `<div class="w2ui-jump-month" name="${s + 1}">${w.settings.shortmonths[s]}</div>`;
    for (let s = w.settings.dateStartYear; s <= w.settings.dateEndYear; s++) t += `<div class="w2ui-jump-year" name="${s}">${s}</div>`;
    return `<div class="w2ui-cal-jump">
            <div id="w2ui-jump-month">${e}</div>
            <div id="w2ui-jump-year">${t}</div>
        </div>`;
  }
  getHourHTML(e) {
    (e = e ?? {}).format || (e.format = w.settings.timeFormat);
    var t = -1 < e.format.indexOf("h24"), s = e.value || (e.anchor ? e.anchor.value : ""), i = [];
    for (let a = 0; a < 24; a++) {
      let l = (12 <= a && !t ? a - 12 : a) + ":00" + (t ? "" : a < 12 ? " am" : " pm"), c = (a != 12 || t || (l = "12:00 pm"), i[Math.floor(a / 8)] || (i[Math.floor(a / 8)] = ""), this.min2str(this.str2min(l))), h = this.min2str(this.str2min(l) + 59);
      e.type === "datetime" && (o = w.isDateTime(s, e.format, true), n = e.format.split("|")[0].trim(), c = w.formatDate(o, n) + " " + c, h = w.formatDate(o, n) + " " + h);
      var n, o = this.inRange(c, e) || this.inRange(h, e);
      i[Math.floor(a / 8)] += `<span hour="${a}"
                class="hour ${o ? "w2ui-time " : "w2ui-blocked"}">${l}</span>`;
    }
    return { html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${w.lang("Select Hour")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${i[0]}</div>
                <div class="w2ui-cal-column">${i[1]}</div>
                <div class="w2ui-cal-column">${i[2]}</div>
            </div>
            ${e.btnNow ? `<div class="w2ui-cal-now">${w.lang("Now")}</div>` : ""}
        </div>` };
  }
  getMinHTML(e, t) {
    e == null && (e = 0), (t = t ?? {}).format || (t.format = w.settings.timeFormat);
    var s = -1 < t.format.indexOf("h24"), i = t.value || (t.anchor ? t.anchor.value : ""), n = [];
    for (let h = 0; h < 60; h += 5) {
      var o = (12 < e && !s ? e - 12 : e) + ":" + (h < 10 ? 0 : "") + h + " " + (s ? "" : e < 12 ? "am" : "pm");
      let p = o;
      var a, l, c = h < 20 ? 0 : h < 40 ? 1 : 2;
      n[c] || (n[c] = ""), t.type === "datetime" && (a = w.isDateTime(i, t.format, true), l = t.format.split("|")[0].trim(), p = w.formatDate(a, l) + " " + p), n[c] += `<span min="${h}" class="min ${this.inRange(p, t) ? "w2ui-time " : "w2ui-blocked"}">${o}</span>`;
    }
    return { html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${w.lang("Select Minute")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${n[0]}</div>
                <div class="w2ui-cal-column">${n[1]}</div>
                <div class="w2ui-cal-column">${n[2]}</div>
            </div>
            ${t.btnNow ? `<div class="w2ui-cal-now">${w.lang("Now")}</div>` : ""}
        </div>` };
  }
  inRange(e, t, s) {
    let i = false;
    if (t.type === "date") {
      var n = w.isDate(e, t.format, true);
      if (n) {
        if (t.start || t.end) {
          var o = typeof t.start == "string" ? t.start : d(t.start).val(), a = typeof t.end == "string" ? t.end : d(t.end).val();
          let l = w.isDate(o, t.format, true), c = w.isDate(a, t.format, true);
          o = new Date(n), l = l || o, c = c || o, o >= l && o <= c && (i = true);
        } else i = true;
        Array.isArray(t.blockDates) && t.blockDates.includes(e) && (i = false), Array.isArray(t.blockWeekdays) && t.blockWeekdays.includes(n.getDay()) && (i = false);
      }
    } else if (t.type === "time") if (t.start || t.end) {
      a = this.str2min(e);
      let l = this.str2min(t.start), c = this.str2min(t.end);
      l = l || a, c = c || a, a >= l && a <= c && (i = true);
    } else i = true;
    else t.type === "datetime" && (o = w.isDateTime(e, t.format, true)) && (n = t.format.split("|").map((l) => l.trim()), s ? (a = w.formatDate(o, n[0]), e = w.extend({}, t, { type: "date", format: n[0] }), this.inRange(a, e) && (i = true)) : (s = w.formatTime(o, n[1]), a = { type: "time", format: n[1], start: t.startTime, end: t.endTime }, this.inRange(s, a) && (i = true)));
    return i;
  }
  str2min(e) {
    var t;
    return typeof e != "string" || (t = e.split(":")).length !== 2 ? null : (t[0] = parseInt(t[0]), t[1] = parseInt(t[1]), e.indexOf("pm") !== -1 && t[0] !== 12 && (t[0] += 12), e.includes("am") && t[0] == 12 && (t[0] = 0), 60 * t[0] + t[1]);
  }
  min2str(i, t) {
    1440 <= i && (i %= 1440), i < 0 && (i = 1440 + i);
    var s = Math.floor(i / 60), i = (i % 60 < 10 ? "0" : "") + i % 60;
    return t = t || w.settings.timeFormat, t.indexOf("h24") !== -1 ? s + ":" + i : (s <= 12 ? s : s - 12) + ":" + i + " " + (12 <= s ? "pm" : "am");
  }
}
let rt = new ut(), Jt = new Wr(), qa = new jr(), Fi = new Zr();
class Kr extends ni {
  constructor(e) {
    super(e.name), this.box = null, this.name = null, this.routeData = {}, this.items = [], this.right = "", this.tooltip = "top|left", this.onClick = null, this.onMouseDown = null, this.onMouseUp = null, this.onMouseEnter = null, this.onMouseLeave = null, this.onRender = null, this.onRefresh = null, this.onResize = null, this.onDestroy = null, this.item_template = { id: null, type: "button", text: null, html: "", tooltip: null, count: null, hidden: false, disabled: false, checked: false, icon: null, route: null, arrow: null, style: null, group: null, items: null, selected: null, color: null, overlay: { anchorClass: "" }, onClick: null, onRefresh: null }, this.last = { badge: {} };
    var t = e.items;
    delete e.items, Object.assign(this, e), Array.isArray(t) && this.add(t, true), e.items = t, typeof this.box == "string" && (this.box = d(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e, t) {
    this.insert(null, e, t);
  }
  insert(e, t, s) {
    (t = Array.isArray(t) ? t : [t]).forEach((i, n, o) => {
      typeof i == "string" && (i = o[n] = { id: i, text: i });
      var a, l = ["button", "check", "radio", "drop", "menu", "menu-radio", "menu-check", "color", "text-color", "html", "break", "spacer", "new-line"];
      if (l.includes(String(i.type))) if (i.id != null || ["break", "spacer", "new-line"].includes(i.type)) {
        if (i.type == null) console.log('ERROR: The parameter "type" is required but not supplied.', i);
        else if (w.checkUniqueId(i.id, this.items, "toolbar", this.name)) {
          let c = w.extend({}, this.item_template, i);
          c.type == "menu-check" ? (Array.isArray(c.selected) || (c.selected = []), Array.isArray(c.items) && c.items.forEach((h) => {
            (h = typeof h == "string" ? o[n] = { id: h, text: h } : h).checked && !c.selected.includes(h.id) && c.selected.push(h.id), !h.checked && c.selected.includes(h.id) && (h.checked = true), h.checked == null && (h.checked = false);
          })) : c.type == "menu-radio" && Array.isArray(c.items) && c.items.forEach((h, p, f) => {
            (h = typeof h == "string" ? f[p] = { id: h, text: h } : h).checked && c.selected == null ? c.selected = h.id : h.checked = false, h.checked || c.selected != h.id || (h.checked = true), h.checked == null && (h.checked = false);
          }), e == null ? this.items.push(c) : (a = this.get(e, true), this.items = this.items.slice(0, a).concat([c], this.items.slice(a))), c.line = c.line ?? 1, s !== true && this.refresh(c.id);
        }
      } else console.log('ERROR: The parameter "id" is required but not supplied.', i);
      else console.log('ERROR: The parameter "type" should be one of the following:', l, `, but ${i.type} is supplied.`, i);
    }), s !== true && this.resize();
  }
  remove() {
    let e = 0;
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && String(t).indexOf(":") == -1 && (e++, d(this.box).find("#tb_" + this.name + "_item_" + w.escapeId(s.id)).remove(), (t = this.get(s.id, true)) != null) && this.items.splice(t, 1);
    }), this.resize(), e;
  }
  set(e, t) {
    var s = this.get(e);
    return s != null && (Object.assign(s, t), this.refresh(String(e).split(":")[0]), true);
  }
  get(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let a = 0; a < this.items.length; a++) this.items[a].id != null && s.push(this.items[a].id);
      return s;
    }
    var i = String(e).split(":");
    for (let a = 0; a < this.items.length; a++) {
      var n = this.items[a];
      if (["menu", "menu-radio", "menu-check"].includes(n.type) && i.length == 2 && n.id == i[0]) {
        let l = n.items;
        typeof l == "function" && (l = l(this));
        for (let c = 0; c < l.length; c++) {
          var o = l[c];
          if (o.id == i[1] || o.id == null && o.text == i[1]) return t == 1 ? c : o;
          if (Array.isArray(o.items)) {
            for (let h = 0; h < o.items.length; h++) if (o.items[h].id == i[1] || o.items[h].id == null && o.items[h].text == i[1]) return t == 1 ? c : o.items[h];
          }
        }
      } else if (n.id == i[0]) return t == 1 ? a : n;
    }
    return null;
  }
  setCount(e, t, s, i) {
    var n = d(this.box).find(`#tb_${this.name}_item_${w.escapeId(e)} .w2ui-tb-count > span`);
    0 < n.length ? (n.removeClass().addClass(s ?? "").text(t).get(0).style.cssText = i ?? "", this.last.badge[e] = { className: s ?? "", style: i ?? "" }, this.get(e).count = t) : (this.set(e, { count: t }), this.setCount(...arguments));
  }
  show() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.hidden = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.resize();
      });
    }, 15), e;
  }
  hide() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.hidden = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.tooltipHide(t), this.resize();
      });
    }, 15), e;
  }
  enable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.disabled = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  disable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && (s.disabled = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.tooltipHide(t);
      });
    }, 15), e;
  }
  check() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && String(t).indexOf(":") == -1 && (s.checked = true, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  uncheck() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      var s = this.get(t);
      s && String(t).indexOf(":") == -1 && (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(s.type) && s.checked && rt.hide(this.name + "-drop"), s.checked = false, e.push(String(t).split(":")[0]));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  click(e, t) {
    var s = String(e).split(":");
    let i = this.get(s[0]), n = i && i.items ? w.normMenu.call(this, i.items, i) : [];
    if (1 < s.length) (s = this.get(e)) && !s.disabled && this.menuClick({ name: this.name, item: i, subItem: s, originalEvent: t });
    else if (i && !i.disabled && (s = this.trigger("click", { target: e ?? this.name, item: i, object: i, originalEvent: t }), s.isCancelled !== true)) {
      n = i && i.items ? w.normMenu.call(this, i.items, i) : [];
      let l = "#tb_" + this.name + "_item_" + w.escapeId(i.id);
      if (d(this.box).find(l).removeClass("down"), i.type == "radio") {
        for (let c = 0; c < this.items.length; c++) {
          var o = this.items[c];
          o != null && o.id != i.id && o.type === "radio" && o.group == i.group && o.checked && (o.checked = false, this.refresh(o.id));
        }
        i.checked = true, d(this.box).find(l).addClass("checked");
      }
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(i.type)) {
        if (this.tooltipHide(e), i.checked) return void rt.hide(this.name + "-drop");
        setTimeout(() => {
          var c = (p, f) => {
            let x = this;
            return function() {
              x.set(p, { checked: false });
            };
          }, h = d(this.box).find("#tb_" + this.name + "_item_" + w.escapeId(i.id));
          if (w.isPlainObject(i.overlay) || (i.overlay = {}), i.type == "drop" && rt.show(w.extend({ html: i.html, class: "w2ui-white", hideOn: ["doc-click"] }, i.overlay, { anchor: h[0], name: this.name + "-drop", data: { item: i, btn: l } })).hide(c(i.id)), ["menu", "menu-radio", "menu-check"].includes(i.type)) {
            let p = "normal";
            i.type == "menu-radio" && (p = "radio", n.forEach((f) => {
              i.selected == f.id ? f.checked = true : f.checked = false;
            })), i.type == "menu-check" && (p = "check", n.forEach((f) => {
              Array.isArray(i.selected) && i.selected.includes(f.id) ? f.checked = true : f.checked = false;
            })), Jt.show(w.extend({ items: n }, i.overlay, { type: p, name: this.name + "-drop", anchor: h[0], data: { item: i, btn: l } })).hide(c(i.id)).remove((f) => {
              this.menuClick({ name: this.name, remove: true, item: i, subItem: f.detail.item, originalEvent: f });
            }).select((f) => {
              this.menuClick({ name: this.name, item: i, subItem: f.detail.item, originalEvent: f });
            });
          }
          ["color", "text-color"].includes(i.type) && qa.show(w.extend({ color: i.color }, i.overlay, { anchor: h[0], name: this.name + "-drop", data: { item: i, btn: l } })).hide(c(i.id)).select((p) => {
            p.detail.color != null && this.colorClick({ name: this.name, item: i, color: p.detail.color });
          });
        }, 0);
      }
      if (["check", "menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(i.type) && (i.checked = !i.checked, i.checked ? d(this.box).find(l).addClass("checked") : d(this.box).find(l).removeClass("checked")), i.route) {
        let c = ("/" + i.route).replace(/\/{2,}/g, "/");
        var a = w.parseRoute(c);
        if (0 < a.keys.length) for (let h = 0; h < a.keys.length; h++) c = c.replace(new RegExp(":" + a.keys[h].name, "g"), this.routeData[a.keys[h].name]);
        setTimeout(() => {
          window.location.hash = c;
        }, 1);
      }
      this.tooltipShow(e), s.finish();
    }
  }
  scroll(e, t, s) {
    return new Promise((i, n) => {
      var o = d(this.box).find(`.w2ui-tb-line:nth-child(${t}) .w2ui-scroll-wrapper`), a = o.get(0).scrollLeft, l = o.find(".w2ui-tb-right").get(0), c = o.parent().get(0).getBoundingClientRect().width, h = a + parseInt(l.offsetLeft) + parseInt(l.clientWidth);
      switch (e) {
        case "left":
          (scroll = a - c + 50) <= 0 && (scroll = 0), o.get(0).scrollTo({ top: 0, left: scroll, behavior: s ? "atuo" : "smooth" });
          break;
        case "right":
          (scroll = a + c - 50) >= h - c && (scroll = h - c), o.get(0).scrollTo({ top: 0, left: scroll, behavior: s ? "atuo" : "smooth" });
      }
      setTimeout(() => {
        this.resize(), i();
      }, s ? 0 : 500);
    });
  }
  render(e) {
    var t = Date.now(), s = (typeof e == "string" && (e = d(e).get(0)), this.trigger("render", { target: this.name, box: e ?? this.box }));
    if (s.isCancelled !== true && (e != null && (0 < d(this.box).find(".w2ui-scroll-wrapper .w2ui-tb-right").length && d(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), this.box = e), this.box)) {
      Array.isArray(this.right) || (this.right = [this.right]);
      let n = "", o = 0;
      for (let a = 0; a < this.items.length; a++) {
        var i = this.items[a];
        i != null && (i.id == null && (i.id = "item_" + a), i.caption != null && console.log("NOTICE: toolbar item.caption property is deprecated, please use item.text. Item -> ", i), i.hint != null && console.log("NOTICE: toolbar item.hint property is deprecated, please use item.tooltip. Item -> ", i), a !== 0 && i.type != "new-line" || (o++, n += `
                    <div class="w2ui-tb-line">
                        <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                            <div class="w2ui-tb-right">${this.right[o - 1] ?? ""}</div>
                        </div>
                        <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll", "left", "${o}"]'></div>
                        <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll", "right", "${o}"]'></div>
                    </div>
                `), i.line = o);
      }
      return d(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-toolbar").html(n), 0 < d(this.box).length && (d(this.box)[0].style.cssText += this.style), w.bindEvents(d(this.box).find(".w2ui-tb-line .w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
        this.resize();
      }), this.last.observeResize.observe(this.box), this.refresh(), this.resize(), s.finish(), Date.now() - t;
    }
  }
  refresh(e) {
    var t = Date.now(), s = this.trigger("refresh", { target: e ?? this.name, item: this.get(e) });
    if (s.isCancelled !== true) {
      let l;
      if (e == null) for (let c = 0; c < this.items.length; c++) {
        var i = this.items[c];
        i.id == null && (i.id = "item_" + c), this.refresh(i.id);
      }
      else {
        var n = this.get(e);
        if (n == null) return false;
        if (typeof n.onRefresh != "function" || (l = this.trigger("refresh", { target: e, item: n, object: n })).isCancelled !== true) {
          var o = `#tb_${this.name}_item_` + w.escapeId(n.id);
          let c = d(this.box).find(o);
          var a = this.getItemHTML(n);
          if (this.tooltipHide(e), n.type == "spacer" && d(this.box).find(".w2ui-tb-line:nth-child(" + n.line).find(".w2ui-tb-right").css("width", "auto"), c.length === 0) {
            e = parseInt(this.get(e, true)) + 1;
            let h = d(this.box).find(`#tb_${this.name}_item_` + w.escapeId(this.items[e] ? this.items[e].id : ""));
            h.length == 0 ? h = d(this.box).find(".w2ui-tb-line:nth-child(" + n.line).find(".w2ui-tb-right").before(a) : h.after(a), w.bindEvents(d(this.box).find(o), this);
          } else {
            d(this.box).find(o).replace(d.html(a));
            let h = d(this.box).find(o).get(0), p = (w.bindEvents(h, this), rt.get(true));
            Object.keys(p).forEach((f) => {
              p[f].anchor == c.get(0) && (p[f].anchor = h);
            });
          }
          if (["menu", "menu-radio", "menu-check"].includes(n.type) && n.checked) {
            let h = Array.isArray(n.selected) ? n.selected : [n.selected];
            n.items.forEach((p) => {
              h.includes(p.id) ? p.checked = true : p.checked = false;
            }), Jt.update(this.name + "-drop", n.items);
          }
          return typeof n.onRefresh == "function" && l.finish(), s.finish(), Date.now() - t;
        }
      }
    }
  }
  resize() {
    var e = Date.now(), t = this.trigger("resize", { target: this.name });
    if (t.isCancelled !== true) return d(this.box).find(".w2ui-tb-line").each((i) => {
      var i = d(i), n = (i.find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), i.find(".w2ui-scroll-wrapper").get(0)), a = i.find(".w2ui-tb-right"), o = i.get(0).getBoundingClientRect().width, a = 0 < a.length ? a[0].offsetLeft + a[0].clientWidth : 0;
      o < a && (0 < n.scrollLeft && i.find(".w2ui-scroll-left").show(), o < a - n.scrollLeft) && i.find(".w2ui-scroll-right").show();
    }), t.finish(), Date.now() - e;
  }
  destroy() {
    var _a2;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (0 < d(this.box).find(".w2ui-scroll-wrapper  .w2ui-tb-right").length && d(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), d(this.box).html(""), (_a2 = this.last.observeResize) == null ? void 0 : _a2.disconnect(), delete Os[this.name], e.finish());
  }
  getItemHTML(e) {
    let t = "", s = (e.caption != null && e.text == null && (e.text = e.caption), e.text == null && (e.text = ""), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.tooltip == null && (e.tooltip = ""), typeof e.get == "function" || !Array.isArray(e.items) && typeof e.items != "function" || (e.get = function(a) {
      let l = e.items;
      return (l = typeof l == "function" ? e.items(e) : l).find((c) => c.id == a);
    }), ""), i = typeof e.text == "function" ? e.text.call(this, e) : e.text;
    e.icon && (s = e.icon, typeof e.icon == "function" && (s = e.icon.call(this, e)), s = `<div class="w2ui-tb-icon">${s = String(s).slice(0, 1) !== "<" ? `<span class="${s}"></span>` : s}</div>`);
    var n = ["w2ui-tb-button"];
    switch (e.checked && n.push("checked"), e.disabled && n.push("disabled"), e.hidden && n.push("hidden"), s || n.push("no-icon"), e.type) {
      case "color":
      case "text-color":
        typeof e.color == "string" && (e.color.slice(0, 1) == "#" && (e.color = e.color.slice(1)), [3, 6, 8].includes(e.color.length)) && (e.color = "#" + e.color), e.type == "color" && (i = `<span class="w2ui-tb-color-box" style="background-color: ${e.color != null ? e.color : "#fff"}"></span>
                           ` + (e.text ? `<div style="margin-left: 17px;">${w.lang(e.text)}</div>` : "")), e.type == "text-color" && (i = '<span style="color: ' + (e.color != null ? e.color : "#444") + ';">' + (e.text ? w.lang(e.text) : "<b>Aa</b>") + "</span>");
      case "menu":
      case "menu-check":
      case "menu-radio":
      case "button":
      case "check":
      case "radio":
      case "drop":
        var o = e.arrow === true || e.arrow !== false && ["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(e.type);
        t = `
                    <div id="tb_${this.name}_item_${e.id}" style="${e.hidden ? "display: none" : ""}"
                        class="${n.join(" ")} ${e.class || ""}"
                        ${e.disabled ? "" : `data-click='["click","${e.id}"]'
                               data-mouseenter='["mouseAction", "event", "this", "Enter", "${e.id}"]'
                               data-mouseleave='["mouseAction", "event", "this", "Leave", "${e.id}"]'
                               data-mousedown='["mouseAction", "event", "this", "Down", "${e.id}"]'
                               data-mouseup='["mouseAction", "event", "this", "Up", "${e.id}"]'`}
                    >
                        ${s}
                        ${i != "" ? `<div class="w2ui-tb-text" style="${e.style || ""}">
                                    ${w.lang(i)}
                                    ${e.count != null ? w.stripSpaces(`<span class="w2ui-tb-count">
                                                <span class="${this.last.badge[e.id] ? this.last.badge[e.id].className ?? "" : ""}"
                                                    style="${this.last.badge[e.id] ? this.last.badge[e.id].style ?? "" : ""}"
                                                >${e.count}</span>
                                           </span>`) : ""}
                                    ${o ? '<span class="w2ui-tb-down"><span></span></span>' : ""}
                                </div>` : ""}
                    </div>
                `;
        break;
      case "break":
        t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-break"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                            &#160;
                        </div>`;
        break;
      case "spacer":
        t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-spacer"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                        </div>`;
        break;
      case "html":
        t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-html ${n.join(" ")}"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                            ${typeof e.html == "function" ? e.html.call(this, e) : e.html}
                        </div>`;
    }
    return t;
  }
  tooltipShow(e) {
    if (this.tooltip != null) {
      var t = d(this.box).find("#tb_" + this.name + "_item_" + w.escapeId(e)).get(0), e = this.get(e), s = this.tooltip;
      let n = e.tooltip;
      typeof n == "function" && (n = n.call(this, e)), ["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(e.type) && e.checked == 1 || rt.show({ anchor: t, name: this.name + "-tooltip", html: n, position: s });
    }
  }
  tooltipHide(e) {
    this.tooltip != null && rt.hide(this.name + "-tooltip");
  }
  menuClick(e) {
    if (e.item && !e.item.disabled) {
      var t = this.trigger(e.remove !== true ? "click" : "remove", { target: e.item.id + ":" + e.subItem.id, item: e.item, subItem: e.subItem, originalEvent: e.originalEvent });
      if (t.isCancelled !== true) {
        let n = e.subItem, o = this.get(e.item.id), a = o.items;
        if (typeof a == "function" && (a = o.items()), o.type == "menu" && (o.selected = n.id), o.type == "menu-radio" && (o.selected = n.id, Array.isArray(a) && a.forEach((l) => {
          l.checked === true && delete l.checked, Array.isArray(l.items) && l.items.forEach((c) => {
            c.checked === true && delete c.checked;
          });
        }), n.checked = true), o.type == "menu-check") {
          if (Array.isArray(o.selected) || (o.selected = []), n.group == null) {
            var s = o.selected.indexOf(n.id);
            s == -1 ? (o.selected.push(n.id), n.checked = true) : (o.selected.splice(s, 1), n.checked = false);
          } else if (n.group !== false) {
            let l = [];
            s = o.selected.indexOf(n.id);
            let c = (h) => {
              h.forEach((p) => {
                var f;
                p.group === n.group && (f = o.selected.indexOf(p.id)) != -1 && (p.id != n.id && l.push(p.id), o.selected.splice(f, 1)), Array.isArray(p.items) && c(p.items);
              });
            };
            c(a), s == -1 && (o.selected.push(n.id), n.checked = true);
          }
        }
        if (typeof n.route == "string") {
          let l = n.route !== "" ? ("/" + n.route).replace(/\/{2,}/g, "/") : "";
          var i = w.parseRoute(l);
          if (0 < i.keys.length) for (let c = 0; c < i.keys.length; c++) this.routeData[i.keys[c].name] != null && (l = l.replace(new RegExp(":" + i.keys[c].name, "g"), this.routeData[i.keys[c].name]));
          setTimeout(() => {
            window.location.hash = l;
          }, 1);
        }
        this.refresh(e.item.id), t.finish();
      }
    }
  }
  colorClick(e) {
    var t;
    e.item && !e.item.disabled && (t = this.trigger("click", { target: e.item.id, item: e.item, color: e.color, final: e.final, originalEvent: e.originalEvent })).isCancelled !== true && (e.item.color = e.color, this.refresh(e.item.id), t.finish());
  }
  mouseAction(o, t, s, i) {
    var n = this.get(i), o = this.trigger("mouse" + s, { target: i, item: n, object: n, originalEvent: o });
    if (o.isCancelled !== true && !n.disabled && !n.hidden) {
      switch (s) {
        case "Enter":
          d(t).addClass("over"), this.tooltipShow(i);
          break;
        case "Leave":
          d(t).removeClass("over down"), this.tooltipHide(i);
          break;
        case "Down":
          d(t).addClass("down");
          break;
        case "Up":
          d(t).removeClass("down");
      }
      o.finish();
    }
  }
}
class Mc extends ni {
  constructor(e) {
    super(e.name), this.box = null, this.name = null, this.active = null, this.reorder = false, this.flow = "down", this.tooltip = "top|left", this.tabs = [], this.routeData = {}, this.last = {}, this.right = "", this.style = "", this.onClick = null, this.onMouseEnter = null, this.onMouseLeave = null, this.onMouseDown = null, this.onMouseUp = null, this.onClose = null, this.onRender = null, this.onRefresh = null, this.onResize = null, this.onDestroy = null, this.tab_template = { id: null, text: null, route: null, hidden: false, disabled: false, closable: false, tooltip: null, style: "", onClick: null, onRefresh: null, onClose: null };
    var t = e.tabs;
    delete e.tabs, Object.assign(this, e), Array.isArray(t) && this.add(t), e.tabs = t, typeof this.box == "string" && (this.box = d(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e) {
    return this.insert(null, e);
  }
  insert(e, t) {
    Array.isArray(t) || (t = [t]);
    let s = [];
    return t.forEach((i) => {
      var n, o;
      i.id == null ? console.log(`ERROR: The parameter "id" is required but not supplied. (obj: ${this.name})`) : w.checkUniqueId(i.id, this.tabs, "tabs", this.name) && (i = Object.assign({}, this.tab_template, i), e == null ? (this.tabs.push(i), s.push(this.animateInsert(null, i))) : (n = this.get(e, true), o = this.tabs[n].id, this.tabs.splice(n, 0, i), s.push(this.animateInsert(o, i))));
    }), Promise.all(s);
  }
  remove() {
    let e = 0;
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && (e++, this.tabs.splice(this.get(t.id, true), 1), d(this.box).find(`#tabs_${this.name}_tab_` + w.escapeId(t.id)).remove());
    }), this.resize(), e;
  }
  select(e) {
    return this.active != e && this.get(e) != null && (this.active = e, this.refresh(), true);
  }
  set(e, t) {
    var s = this.get(e, true);
    return s != null && (w.extend(this.tabs[s], t), this.refresh(e), true);
  }
  get(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let i = 0; i < this.tabs.length; i++) this.tabs[i].id != null && s.push(this.tabs[i].id);
      return s;
    }
    for (let i = 0; i < this.tabs.length; i++) if (this.tabs[i].id == e) return t === true ? i : this.tabs[i];
    return null;
  }
  show() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.hidden !== false && (t.hidden = false, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.resize();
      });
    }, 15), e;
  }
  hide() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.hidden !== true && (t.hidden = true, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t), this.resize();
      });
    }, 15), e;
  }
  enable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.disabled !== false && (t.disabled = false, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  disable() {
    let e = [];
    return Array.from(arguments).forEach((t) => {
      t = this.get(t), t && t.disabled !== true && (t.disabled = true, e.push(t.id));
    }), setTimeout(() => {
      e.forEach((t) => {
        this.refresh(t);
      });
    }, 15), e;
  }
  dragMove(e) {
    if (this.last.reordering) {
      let l = function(c, h) {
        c += h;
        let p = a.tabs[c];
        return p = p && p.hidden ? l(c, h) : p;
      }, a = this;
      var t = this.last.moving, n = this.tabs[t.index], s = l(t.index, 1), i = l(t.index, -1), n = d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(n.id));
      if (0 < t.divX && s) {
        var o = d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(s.id));
        let c = parseInt(n.get(0).clientWidth), h = parseInt(o.get(0).clientWidth);
        if (c = c < h ? Math.floor(c / 3) : Math.floor(h / 3), h -= c, t.divX > h) return s = this.tabs.indexOf(s), this.tabs.splice(t.index, 0, this.tabs.splice(s, 1)[0]), t.$tab.before(o.get(0)), t.$tab.css("opacity", 0), void Object.assign(this.last.moving, { index: s, divX: -c, x: e.pageX + c, left: t.left + t.divX + c });
      }
      if (t.divX < 0 && i) {
        o = d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(i.id));
        let c = parseInt(n.get(0).clientWidth), h = parseInt(o.get(0).clientWidth);
        c = c < h ? Math.floor(c / 3) : Math.floor(h / 3), h -= c, Math.abs(t.divX) > h && (s = this.tabs.indexOf(i), this.tabs.splice(t.index, 0, this.tabs.splice(s, 1)[0]), o.before(t.$tab), t.$tab.css("opacity", 0), Object.assign(t, { index: s, divX: c, x: e.pageX - c, left: t.left + t.divX - c }));
      }
    }
  }
  mouseAction(e, t, s) {
    var i = this.get(t), n = this.trigger("mouse" + e, { target: t, tab: i, object: i, originalEvent: s });
    if (n.isCancelled !== true && !i.disabled && !i.hidden) {
      switch (e) {
        case "Enter":
          this.tooltipShow(t);
          break;
        case "Leave":
          this.tooltipHide(t);
          break;
        case "Down":
          this.initReorder(t, s);
      }
      n.finish();
    }
  }
  tooltipShow(s) {
    var t = this.get(s), s = d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(s)).get(0);
    if (this.tooltip != null && !t.disabled && !this.last.reordering) {
      var i = this.tooltip;
      let n = t.tooltip;
      typeof n == "function" && (n = n.call(this, t)), rt.show({ anchor: s, name: this.name + "_tooltip", html: n, position: i });
    }
  }
  tooltipHide(e) {
    this.tooltip != null && rt.hide(this.name + "_tooltip");
  }
  getTabHTML(e) {
    if (e = this.get(e, true), e = this.tabs[e], e == null) return false;
    e.text == null && e.caption != null && (e.text = e.caption), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.caption != null && console.log("NOTICE: tabs tab.caption property is deprecated, please use tab.text. Tab -> ", e), e.hint != null && console.log("NOTICE: tabs tab.hint property is deprecated, please use tab.tooltip. Tab -> ", e);
    let t = e.text, s = ((t = typeof t == "function" ? t.call(this, e) : t) == null && (t = ""), ""), i = "";
    return e.hidden && (i += "display: none;"), e.disabled && (i += "opacity: 0.2;"), e.closable && !e.disabled && (s = `<div class="w2ui-tab-close w2ui-eaction ${this.active === e.id ? "active" : ""}"
                data-mousedown="stop" data-mouseup="clickClose|${e.id}|event">
            </div>`), `
            <div id="tabs_${this.name}_tab_${e.id}" style="${i} ${e.style}"
                class="w2ui-tab w2ui-eaction ${this.active === e.id ? "active" : ""} ${e.closable ? "closable" : ""} ${e.class || ""}"
                data-mouseenter="mouseAction|Enter|${e.id}|event]"
                data-mouseleave="mouseAction|Leave|${e.id}|event]"
                data-mousedown="mouseAction|Down|${e.id}|event"
                data-mouseup="mouseAction|Up|${e.id}|event"
                data-click="click|${e.id}|event"
               >
                    ${w.lang(t) + s}
            </div>`;
  }
  refresh(e) {
    var t = Date.now(), s = (this.flow == "up" ? d(this.box).addClass("w2ui-tabs-up") : d(this.box).removeClass("w2ui-tabs-up"), this.trigger("refresh", { target: e ?? this.name, object: this.get(e) }));
    if (s.isCancelled !== true) {
      if (e == null) for (let o = 0; o < this.tabs.length; o++) this.refresh(this.tabs[o].id);
      else {
        var i = "#tabs_" + this.name + "_tab_" + w.escapeId(e), n = d(this.box).find(i), e = this.getTabHTML(e);
        n.length === 0 ? d(this.box).find("#tabs_" + this.name + "_right").before(e) : d(this.box).find(".tab-animate-insert").length == 0 && n.replace(e), w.bindEvents(d(this.box).find(i + `, ${i} .w2ui-eaction`), this);
      }
      return d(this.box).find("#tabs_" + this.name + "_right").html(this.right), s.finish(), Date.now() - t;
    }
  }
  render(e) {
    var t = Date.now(), s = (typeof e == "string" && (e = d(e).get(0)), this.trigger("render", { target: this.name, box: e ?? this.box }));
    if (s.isCancelled !== true) return e != null && (0 < d(this.box).find("#tabs_" + this.name + "_right").length && d(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), this.box = e), !!this.box && (e = `
            <div class="w2ui-tabs-line"></div>
            <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                <div id="tabs_${this.name}_right" class="w2ui-tabs-right">${this.right}</div>
            </div>
            <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll","left"]'></div>
            <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll","right"]'></div>`, d(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-tabs").html(e), 0 < d(this.box).length && (d(this.box)[0].style.cssText += this.style), w.bindEvents(d(this.box).find(".w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    }), this.last.observeResize.observe(this.box), s.finish(), this.refresh(), this.resize(), Date.now() - t);
  }
  initReorder(e, t) {
    if (this.reorder) {
      let s = this, i = d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(e)), n = this.get(e, true), o = d(i.get(0).cloneNode(true)), a;
      o.attr("id", "#tabs_" + this.name + "_tab_ghost"), this.last.moving = { index: n, indexFrom: n, $tab: i, $ghost: o, divX: 0, left: i.get(0).getBoundingClientRect().left, parentX: d(this.box).get(0).getBoundingClientRect().left, x: t.pageX, opacity: i.css("opacity") }, d(document).off(".w2uiTabReorder").on("mousemove.w2uiTabReorder", function(l) {
        if (!s.last.reordering) {
          if ((a = s.trigger("reorder", { target: s.tabs[n].id, indexFrom: n, tab: s.tabs[n] })).isCancelled === true) return;
          rt.hide(this.name + "_tooltip"), s.last.reordering = true, o.addClass("moving"), o.css({ "pointer-events": "none", position: "absolute", left: i.get(0).getBoundingClientRect().left }), i.css("opacity", 0), d(s.box).find(".w2ui-scroll-wrapper").append(o.get(0)), d(s.box).find(".w2ui-tab-close").hide();
        }
        s.last.moving.divX = l.pageX - s.last.moving.x, o.css("left", s.last.moving.left - s.last.moving.parentX + s.last.moving.divX + "px"), s.dragMove(l);
      }).on("mouseup.w2uiTabReorder", function() {
        d(document).off(".w2uiTabReorder"), o.css({ transition: "0.1s", left: s.last.moving.$tab.get(0).getBoundingClientRect().left - s.last.moving.parentX }), d(s.box).find(".w2ui-tab-close").show(), setTimeout(() => {
          o.remove(), i.css({ opacity: s.last.moving.opacity }), s.last.reordering && a.finish({ indexTo: s.last.moving.index }), s.last.reordering = false;
        }, 100);
      });
    }
  }
  scroll(e, t) {
    return new Promise((s, i) => {
      var n = d(this.box).find(".w2ui-scroll-wrapper"), o = n.get(0).scrollLeft, a = n.find(".w2ui-tabs-right").get(0), l = n.parent().get(0).getBoundingClientRect().width, c = o + parseInt(a.offsetLeft) + parseInt(a.clientWidth);
      switch (e) {
        case "left": {
          let h = o - l + 50;
          h <= 0 && (h = 0), n.get(0).scrollTo({ top: 0, left: h, behavior: t ? "atuo" : "smooth" });
          break;
        }
        case "right": {
          let h = o + l - 50;
          h >= c - l && (h = c - l), n.get(0).scrollTo({ top: 0, left: h, behavior: t ? "atuo" : "smooth" });
          break;
        }
      }
      setTimeout(() => {
        this.resize(), s();
      }, t ? 0 : 350);
    });
  }
  scrollIntoView(e, t) {
    return new Promise((s, i) => {
      e == null && (e = this.active), this.get(e) != null && (d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(e)).get(0).scrollIntoView({ block: "start", inline: "center", behavior: t ? "atuo" : "smooth" }), setTimeout(() => {
        this.resize(), s();
      }, t ? 0 : 500));
    });
  }
  resize() {
    var e = Date.now();
    if (this.box != null) {
      var t, s, i, n, o = this.trigger("resize", { target: this.name });
      if (o.isCancelled !== true) return (t = d(this.box)).find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), s = t.find(".w2ui-scroll-wrapper").get(0), n = t.find(".w2ui-tabs-right"), (i = t.get(0).getBoundingClientRect().width) < (n = 0 < n.length ? n[0].offsetLeft + n[0].clientWidth : 0) && (0 < s.scrollLeft && t.find(".w2ui-scroll-left").show(), i < n - s.scrollLeft) && t.find(".w2ui-scroll-right").show(), o.finish(), Date.now() - e;
    }
  }
  destroy() {
    var _a2;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (0 < d(this.box).find("#tabs_" + this.name + "_right").length && d(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), (_a2 = this.last.observeResize) == null ? void 0 : _a2.disconnect(), delete Os[this.name], e.finish());
  }
  click(e, t) {
    var s = this.get(e);
    if (s == null || s.disabled || this.last.reordering) return false;
    if (e = this.trigger("click", { target: e, tab: s, object: s, originalEvent: t }), e.isCancelled !== true) {
      if (d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(this.active)).removeClass("active"), this.active = s.id, d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(this.active)).addClass("active"), typeof s.route == "string") {
        let n = s.route !== "" ? ("/" + s.route).replace(/\/{2,}/g, "/") : "";
        var i = w.parseRoute(n);
        if (0 < i.keys.length) for (let o = 0; o < i.keys.length; o++) this.routeData[i.keys[o].name] != null && (n = n.replace(new RegExp(":" + i.keys[o].name, "g"), this.routeData[i.keys[o].name]));
        setTimeout(() => {
          window.location.hash = n;
        }, 1);
      }
      e.finish();
    }
  }
  clickClose(e, t) {
    var s = this.get(e);
    if (s == null || s.disabled) return false;
    let i = this.trigger("close", { target: e, object: s, tab: s, originalEvent: t });
    i.isCancelled !== true && (this.animateClose(e).then(() => {
      this.remove(e), i.finish(), this.refresh();
    }), t) && t.stopPropagation();
  }
  animateClose(e) {
    return new Promise((t, s) => {
      var i = d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(e)), n = parseInt(i.get(0).clientWidth || 0);
      let o = i.replace(`<div class="tab-animate-close" style="display: inline-block; flex-shrink: 0; width: ${n}px; transition: width 0.25s"></div>`);
      setTimeout(() => {
        o.css({ width: "0px" });
      }, 1), setTimeout(() => {
        o.remove(), this.resize(), t();
      }, 500);
    });
  }
  animateInsert(e, t) {
    return new Promise((s, i) => {
      let n = d(this.box).find("#tabs_" + this.name + "_tab_" + w.escapeId(e)), o = d.html(this.getTabHTML(t.id));
      if (n.length == 0) (n = d(this.box).find("#tabs_tabs_right")).before(o), this.resize();
      else {
        o.css({ opacity: 0 }), d(this.box).find("#tabs_tabs_right").before(o.get(0));
        let a = d(this.box).find("#" + o.attr("id")).get(0).clientWidth ?? 0, l = d.html('<div class="tab-animate-insert" style="flex-shrink: 0; width: 0; transition: width 0.25s"></div>');
        n.before(l), o.hide(), l.before(o[0]), setTimeout(() => {
          l.css({ width: a + "px" });
        }, 1), setTimeout(() => {
          l.remove(), o.css({ opacity: 1 }).show(), this.refresh(t.id), this.resize(), s();
        }, 500);
      }
    });
  }
}
class $c extends ni {
  constructor(e) {
    if (super(e.name), this.name = null, this.box = null, this.columns = [], this.columnGroups = [], this.records = [], this.summary = [], this.searches = [], this.toolbar = {}, this.ranges = [], this.contextMenu = [], this.searchMap = {}, this.searchData = [], this.sortMap = {}, this.sortData = [], this.savedSearches = [], this.defaultSearches = [], this.total = 0, this.recid = null, this.last = { field: "", label: "", logic: "AND", search: "", searchIds: [], selection: { indexes: [], columns: {} }, saved_sel: null, multi: false, scrollTop: 0, scrollLeft: 0, colStart: 0, colEnd: 0, fetch: { action: "", offset: null, start: 0, response: 0, options: null, controller: null, loaded: false, hasMore: false }, pull_more: false, pull_refresh: true, range_start: null, range_end: null, sel_ind: null, sel_col: null, sel_type: null, sel_recid: null, idCache: {}, move: null, cancelClick: null, inEditMode: false, _edit: null, kbd_timer: null, marker_timer: null, click_time: null, click_recid: null, bubbleEl: null, colResizing: false, tmp: null, copy_event: null, userSelect: "", columnDrag: false, state: null, show_extra: 0, toolbar_height: 0 }, this.header = "", this.url = "", this.limit = 100, this.offset = 0, this.postData = {}, this.routeData = {}, this.httpHeaders = {}, this.show = { header: false, toolbar: false, footer: false, columnMenu: true, columnHeaders: true, lineNumbers: false, expandColumn: false, selectColumn: false, emptyRecords: true, toolbarReload: true, toolbarColumns: false, toolbarSearch: true, toolbarAdd: false, toolbarEdit: false, toolbarDelete: false, toolbarSave: false, searchAll: true, searchLogic: true, searchHiddenMsg: false, searchSave: true, statusRange: true, statusBuffered: false, statusRecordID: true, statusSelection: true, statusResponse: true, statusSort: false, statusSearch: false, recordTitles: false, selectionBorder: true, skipRecords: true, saveRestoreState: true }, this.stateId = null, this.hasFocus = false, this.autoLoad = true, this.fixedBody = true, this.recordHeight = 32, this.lineNumberWidth = 34, this.keyboard = true, this.selectType = "row", this.liveSearch = false, this.multiSearch = true, this.multiSelect = true, this.multiSort = true, this.reorderColumns = false, this.reorderRows = false, this.showExtraOnSearch = 0, this.markSearch = true, this.columnTooltip = "top|bottom", this.disableCVS = false, this.nestedFields = true, this.vs_start = 150, this.vs_extra = 5, this.style = "", this.tabIndex = null, this.dataType = null, this.parser = null, this.advanceOnEdit = true, this.useLocalStorage = true, this.colTemplate = { text: "", field: "", size: null, min: 20, max: null, gridMinWidth: null, sizeCorrected: null, sizeCalculated: null, sizeOriginal: null, sizeType: null, hidden: false, sortable: false, sortMode: null, searchable: false, resizable: true, hideable: true, autoResize: null, attr: "", style: "", render: null, title: null, tooltip: null, editable: {}, frozen: false, info: null, clipboardCopy: false }, this.stateColProps = { text: false, field: true, size: true, min: false, max: false, gridMinWidth: false, sizeCorrected: false, sizeCalculated: true, sizeOriginal: true, sizeType: true, hidden: true, sortable: false, sortMode: true, searchable: false, resizable: false, hideable: false, autoResize: false, attr: false, style: false, render: false, title: false, tooltip: false, editable: false, frozen: true, info: false, clipboardCopy: false }, this.msgDelete = "Are you sure you want to delete ${count} ${records}?", this.msgNotJSON = "Returned data is not in valid JSON format.", this.msgHTTPError = "HTTP error. See console for more details.", this.msgServerError = "Server error", this.msgRefresh = "Refreshing...", this.msgNeedReload = "Your remote data source record count has changed, reloading from the first record.", this.msgEmpty = "", this.buttons = { reload: { type: "button", id: "w2ui-reload", icon: "w2ui-icon-reload", tooltip: "Reload data in the list" }, columns: { type: "menu-check", id: "w2ui-column-on-off", icon: "w2ui-icon-columns", tooltip: "Show/hide columns", overlay: { align: "none" } }, search: { type: "html", id: "w2ui-search", html: '<div class="w2ui-icon w2ui-icon-search w2ui-search-down w2ui-action" data-click="searchShowFields"></div>' }, add: { type: "button", id: "w2ui-add", text: "Add New", tooltip: "Add new record", icon: "w2ui-icon-plus" }, edit: { type: "button", id: "w2ui-edit", text: "Edit", tooltip: "Edit selected record", icon: "w2ui-icon-pencil", batch: 1, disabled: true }, delete: { type: "button", id: "w2ui-delete", text: "Delete", tooltip: "Delete selected records", icon: "w2ui-icon-cross", batch: true, disabled: true }, save: { type: "button", id: "w2ui-save", text: "Save", tooltip: "Save changed records", icon: "w2ui-icon-check" } }, this.operators = { text: ["is", "begins", "contains", "ends"], number: ["=", "between", ">", "<", ">=", "<="], date: ["is", { oper: "less", text: "before" }, { oper: "more", text: "since" }, "between"], list: ["is"], hex: ["is", "between"], color: ["is", "begins", "contains", "ends"], enum: ["in", "not in"] }, this.defaultOperator = { text: "begins", number: "=", date: "is", list: "is", enum: "in", hex: "begins", color: "begins" }, this.operatorsMap = { text: "text", int: "number", float: "number", money: "number", currency: "number", percent: "number", hex: "hex", alphanumeric: "text", color: "color", date: "date", time: "date", datetime: "date", list: "list", combo: "text", enum: "enum", file: "enum", select: "list", radio: "list", checkbox: "list", toggle: "list" }, this.onAdd = null, this.onEdit = null, this.onRequest = null, this.onLoad = null, this.onDelete = null, this.onSave = null, this.onSelect = null, this.onClick = null, this.onDblClick = null, this.onContextMenu = null, this.onContextMenuClick = null, this.onColumnClick = null, this.onColumnDblClick = null, this.onColumnContextMenu = null, this.onColumnResize = null, this.onColumnAutoResize = null, this.onSort = null, this.onSearch = null, this.onSearchOpen = null, this.onChange = null, this.onRestore = null, this.onExpand = null, this.onCollapse = null, this.onError = null, this.onKeydown = null, this.onToolbar = null, this.onColumnOnOff = null, this.onCopy = null, this.onPaste = null, this.onSelectionExtend = null, this.onEditField = null, this.onRender = null, this.onRefresh = null, this.onReload = null, this.onResize = null, this.onDestroy = null, this.onStateSave = null, this.onStateRestore = null, this.onFocus = null, this.onBlur = null, this.onReorderRow = null, this.onSearchSave = null, this.onSearchRemove = null, this.onSearchSelect = null, this.onColumnSelect = null, this.onColumnDragStart = null, this.onColumnDragEnd = null, this.onResizerDblClick = null, this.onMouseEnter = null, this.onMouseLeave = null, w.extend(this, e), Array.isArray(this.records)) {
      let t = [];
      this.records.forEach((s, i) => {
        var _a2;
        s[this.recid] != null && (s.recid = s[this.recid]), s.recid == null && console.log("ERROR: Cannot add records without recid. (obj: " + this.name + ")"), ((_a2 = s.w2ui) == null ? void 0 : _a2.summary) === true && (this.summary.push(s), t.push(i));
      }), t.sort();
      for (let s = t.length - 1; 0 <= s; s--) this.records.splice(t[s], 1);
    }
    Array.isArray(this.columns) && this.columns.forEach((t, s) => {
      if (t = w.extend({}, this.colTemplate, t), s = (this.columns[s] = t).searchable, s != null && s !== false && this.getSearch(t.field) == null) if (w.isPlainObject(s)) this.addSearch(w.extend({ field: t.field, label: t.text, type: "text" }, s));
      else {
        let i = t.searchable, n = "";
        t.searchable === true && (i = "text", n = 'size="20"'), this.addSearch({ field: t.field, label: t.text, type: i, attr: n });
      }
    }), Array.isArray(this.defaultSearches) && this.defaultSearches.forEach((t, s) => {
      t.id = "default-" + s, t.icon ?? (t.icon = "w2ui-icon-search");
    }), e = this.cache("searches"), Array.isArray(e) && e.forEach((t) => {
      this.savedSearches.push({ id: t.id ?? "none", text: t.text ?? "none", icon: "w2ui-icon-search", remove: true, logic: t.logic ?? "AND", data: t.data ?? [] });
    }), typeof this.box == "string" && (this.box = d(this.box).get(0)), this.box && this.render(this.box);
  }
  add(e, t) {
    var _a2, _b;
    Array.isArray(e) || (e = [e]);
    let s = 0;
    for (let n = 0; n < e.length; n++) {
      var i = e[n];
      i[this.recid] != null && (i.recid = i[this.recid]), i.recid == null ? console.log("ERROR: Cannot add record without recid. (obj: " + this.name + ")") : (((_a2 = i.w2ui) == null ? void 0 : _a2.summary) === true ? t ? this.summary.unshift(i) : this.summary.push(i) : t ? this.records.unshift(i) : this.records.push(i), s++);
    }
    return (((_b = this.url) == null ? void 0 : _b.get) ?? this.url) || (this.total = this.records.length, this.localSort(false, true), this.localSearch()), this.refresh(), s;
  }
  find(e, t, s) {
    var i, n = [];
    let o = false;
    for (i in e = e ?? {}) String(i).indexOf(".") != -1 && (o = true);
    var a = s ? this.last.range_start : 0;
    let l = s ? this.last.range_end + 1 : this.records.length;
    l > this.records.length && (l = this.records.length);
    for (let h = a; h < l; h++) {
      let p = true;
      for (var c in e) {
        let f = this.records[h][c];
        o && String(c).indexOf(".") != -1 && (f = this.parseField(this.records[h], c)), e[c] == "not-null" ? f != null && f !== "" || (p = false) : e[c] != f && (p = false);
      }
      p && t !== true && n.push(this.records[h].recid), p && t === true && n.push(h);
    }
    return n;
  }
  set(e, t, s) {
    if (typeof e == "object" && e !== null && (s = t, t = e, e = null), e == null) {
      for (let n = 0; n < this.records.length; n++) w.extend(this.records[n], t);
      s !== true && this.refresh();
    } else {
      var i = this.get(e, true);
      if (i == null) return false;
      !this.records[i] || this.records[i].recid != e ? w.extend(this.summary[i], t) : w.extend(this.records[i], t), s !== true && this.refreshRow(e, i);
    }
    return true;
  }
  get(e, t) {
    if (Array.isArray(e)) {
      var s = [];
      for (let o = 0; o < e.length; o++) {
        var i = this.get(e[o], t);
        i !== null && s.push(i);
      }
      return s;
    }
    {
      let o = this.last.idCache;
      o || (this.last.idCache = o = {});
      var n = o[e];
      if (typeof n == "number") {
        if (0 <= n && n < this.records.length && this.records[n].recid == e) return t === true ? n : this.records[n];
        if (0 <= (n = ~n) && n < this.summary.length && this.summary[n].recid == e) return t === true ? n : this.summary[n];
        this.last.idCache = o = {};
      }
      for (let a = 0; a < this.records.length; a++) if (this.records[a].recid == e) return o[e] = a, t === true ? a : this.records[a];
      for (let a = 0; a < this.summary.length; a++) if (this.summary[a].recid == e) return o[e] = ~a, t === true ? a : this.summary[a];
      return null;
    }
  }
  getFirst(e) {
    if (this.records.length == 0) return null;
    let t = this.records[0];
    var s = this.last.searchIds;
    return t = 0 < this.searchData.length ? Array.isArray(s) && 0 < s.length ? this.records[s[e || 0]] : null : t;
  }
  remove() {
    var _a2;
    let e = 0;
    for (let t = 0; t < arguments.length; t++) {
      for (let s = this.records.length - 1; 0 <= s; s--) this.records[s].recid == arguments[t] && (this.records.splice(s, 1), e++);
      for (let s = this.summary.length - 1; 0 <= s; s--) this.summary[s].recid == arguments[t] && (this.summary.splice(s, 1), e++);
    }
    return (((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url) || (this.localSort(false, true), this.localSearch()), this.refresh(), e;
  }
  addColumn(e, t) {
    let s = 0;
    arguments.length == 1 ? (t = e, e = this.columns.length) : (e = typeof e == "string" ? this.getColumn(e, true) : e) == null && (e = this.columns.length), Array.isArray(t) || (t = [t]);
    for (let n = 0; n < t.length; n++) {
      var i = w.extend({}, this.colTemplate, t[n]);
      if (this.columns.splice(e, 0, i), t[n].searchable) {
        let o = t[n].searchable, a = "";
        t[n].searchable === true && (o = "text", a = 'size="20"'), this.addSearch({ field: t[n].field, label: t[n].text, type: o, attr: a });
      }
      e++, s++;
    }
    return this.refresh(), s;
  }
  removeColumn() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.columns.length - 1; 0 <= s; s--) this.columns[s].field == arguments[t] && (this.columns[s].searchable && this.removeSearch(arguments[t]), this.columns.splice(s, 1), e++);
    return this.refresh(), e;
  }
  getColumn(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let i = 0; i < this.columns.length; i++) s.push(this.columns[i].field);
      return s;
    }
    for (let i = 0; i < this.columns.length; i++) if (this.columns[i].field == e) return t === true ? i : this.columns[i];
    return null;
  }
  updateColumn(e, t) {
    let s = 0;
    return (e = Array.isArray(e) ? e : [e]).forEach((i) => {
      this.columns.forEach((n) => {
        if (n.field == i) {
          let o = w.clone(t);
          Object.keys(o).forEach((a) => {
            typeof o[a] == "function" && (o[a] = o[a](n)), n[a] != o[a] && s++;
          }), w.extend(n, o);
        }
      });
    }), 0 < s && this.refresh(), s;
  }
  toggleColumn() {
    return this.updateColumn(Array.from(arguments), { hidden(e) {
      return !e.hidden;
    } });
  }
  showColumn() {
    return this.updateColumn(Array.from(arguments), { hidden: false });
  }
  hideColumn() {
    return this.updateColumn(Array.from(arguments), { hidden: true });
  }
  addSearch(e, t) {
    let s = 0;
    arguments.length == 1 ? (t = e, e = this.searches.length) : (e = typeof e == "string" ? this.getSearch(e, true) : e) == null && (e = this.searches.length), Array.isArray(t) || (t = [t]);
    for (let i = 0; i < t.length; i++) this.searches.splice(e, 0, t[i]), e++, s++;
    return this.searchClose(), s;
  }
  removeSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && (this.searches.splice(s, 1), e++);
    return this.searchClose(), e;
  }
  getSearch(e, t) {
    if (arguments.length === 0) {
      var s = [];
      for (let i = 0; i < this.searches.length; i++) s.push(this.searches[i].field);
      return s;
    }
    for (let i = 0; i < this.searches.length; i++) if (this.searches[i].field == e) return t === true ? i : this.searches[i];
    return null;
  }
  toggleSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && (this.searches[s].hidden = !this.searches[s].hidden, e++);
    return this.searchClose(), e;
  }
  showSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && this.searches[s].hidden !== false && (this.searches[s].hidden = false, e++);
    return this.searchClose(), e;
  }
  hideSearch() {
    let e = 0;
    for (let t = 0; t < arguments.length; t++) for (let s = this.searches.length - 1; 0 <= s; s--) this.searches[s].field == arguments[t] && this.searches[s].hidden !== true && (this.searches[s].hidden = true, e++);
    return this.searchClose(), e;
  }
  getSearchData(e) {
    for (let t = 0; t < this.searchData.length; t++) if (this.searchData[t].field == e) return this.searchData[t];
    return null;
  }
  localSort(e, t) {
    var _a2, _b, _c2;
    let s = this;
    if (((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url) console.log("ERROR: grid.localSort can only be used on local data source, grid.url should be empty.");
    else if (Object.keys(this.sortData).length !== 0) {
      let l = function(p) {
        var f;
        return p.w2ui && p.w2ui.parent_recid != null ? p.w2ui._path || ((f = s.get(p.w2ui.parent_recid)) ? l(f).concat(p) : (console.log("ERROR: no parent record: " + p.w2ui.parent_recid), [p])) : [p];
      }, c = function(p, f) {
        if (p === f) return 0;
        for (let C = 0; C < s.sortData.length; C++) {
          var x = s.sortData[C].field, b = s.sortData[C].field_ || x;
          let _ = p[b], S = f[b];
          if (String(x).indexOf(".") != -1 && (_ = s.parseField(p, b), S = s.parseField(f, b)), b = s.getColumn(x), x = (b && 0 < Object.keys(b.editable).length && (w.isPlainObject(_) && _.text && (_ = _.text), w.isPlainObject(S)) && S.text && (S = S.text), h(_, S, C, s.sortData[C].direction, b.sortMode || "default")), x !== 0) return x;
        }
        return h(p.recid, f.recid, 0, "asc");
      }, h = function(p, f, x, b, C) {
        if (p === f) return 0;
        if ((p == null || p === "") && f != null && f !== "") return 1;
        if (p != null && p !== "" && (f == null || f === "")) return -1;
        if (b = b.toLowerCase() === "asc" ? 1 : -1, typeof p != typeof f) return typeof f < typeof p ? b : -b;
        if (p.constructor.name != f.constructor.name) return p.constructor.name > f.constructor.name ? b : -b;
        p && typeof p == "object" && (p = p.valueOf()), f && typeof f == "object" && (f = f.valueOf());
        var _ = {}.toString;
        switch (p && typeof p == "object" && p.toString != _ && (p = String(p)), f && typeof f == "object" && f.toString != _ && (f = String(f)), typeof p == "string" && (p = p.toLowerCase().trim()), typeof f == "string" && (f = f.toLowerCase().trim()), C) {
          case "natural":
            C = w.naturalCompare;
            break;
          case "i18n":
            C = w.i18nCompare;
        }
        return typeof C == "function" ? C(p, f) * b : f < p ? b : p < f ? -b : 0;
      }, a = Date.now();
      this.selectionSave(), this.prepareData(), t || this.reset();
      for (let p = 0; p < this.sortData.length; p++) {
        var i = this.getColumn(this.sortData[p].field);
        if (!i) return;
        typeof i.render == "string" && (["date", "age"].indexOf(i.render.split(":")[0]) != -1 && (this.sortData[p].field_ = i.field + "_"), ["time"].indexOf(i.render.split(":")[0]) != -1) && (this.sortData[p].field_ = i.field + "_");
      }
      for (let p = 0; p < s.records.length; p++) {
        var n = s.records[p];
        ((_b = n.w2ui) == null ? void 0 : _b.parent_recid) != null && (n.w2ui._path = l(n));
      }
      this.records.sort((p, f) => {
        if (!(p.w2ui && p.w2ui.parent_recid != null || f.w2ui && f.w2ui.parent_recid != null)) return c(p, f);
        var x = l(p), b = l(f);
        for (let _ = 0; _ < Math.min(x.length, b.length); _++) {
          var C = c(x[_], b[_]);
          if (C !== 0) return C;
        }
        return x.length > b.length ? 1 : x.length < b.length ? -1 : (console.log("ERROR: two paths should not be equal."), 0);
      });
      for (let p = 0; p < s.records.length; p++) {
        var o = s.records[p];
        ((_c2 = o.w2ui) == null ? void 0 : _c2.parent_recid) != null && (o.w2ui._path = null);
      }
      return this.selectionRestore(t), a = Date.now() - a, e !== true && this.show.statusSort && setTimeout(() => {
        this.status(w.lang("Sorting took ${count} seconds", { count: a / 1e3 }));
      }, 10), a;
    }
  }
  localSearch(e) {
    var _a2;
    let t = this;
    var s = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url;
    if (s) console.log("ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.");
    else {
      let n = Date.now(), o = {}.toString, a = {};
      if (this.total = this.records.length, this.last.searchIds = [], this.prepareData(), 0 < this.searchData.length && !s) {
        for (let l = this.total = 0; l < this.records.length; l++) {
          var i = this.records[l];
          if (function c(h) {
            var _a3, _b;
            let p = 0, f, x, b, C, _ = false;
            for (let S = 0; S < t.searchData.length; S++) {
              let A = t.searchData[S], P = t.getSearch(A.field);
              if (A != null) {
                P == null && (P = { field: A.field, type: A.type });
                let X = t.parseField(h, P.field);
                switch (f = X == null || typeof X == "object" && X.toString == o ? "" : String(X).toLowerCase(), A.value != null && (Array.isArray(A.value) ? (x = A.value[0], b = A.value[1]) : x = String(A.value).toLowerCase()), A.operator) {
                  case "=":
                  case "is":
                    t.parseField(h, P.field) == A.value ? p++ : P.type == "date" ? (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.formatDate(C, "yyyy-mm-dd"), x = w.formatDate(w.isDate(x, w.settings.dateFormat, true), "yyyy-mm-dd"), f == x && p++) : P.type == "time" ? (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.formatTime(C, "hh24:mi"), x = w.formatTime(x, "hh24:mi"), f == x && p++) : P.type == "datetime" && (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.formatDateTime(C, "yyyy-mm-dd|hh24:mm:ss"), x = w.formatDateTime(w.isDateTime(x, w.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), f == x) && p++;
                    break;
                  case "between":
                    ["int", "float", "money", "currency", "percent"].indexOf(P.type) != -1 ? parseFloat(t.parseField(h, P.field)) >= parseFloat(x) && parseFloat(t.parseField(h, P.field)) <= parseFloat(b) && p++ : P.type == "date" ? (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.isDate(C, w.settings.dateFormat, true), x = w.isDate(x, w.settings.dateFormat, true), (b = w.isDate(b, w.settings.dateFormat, true)) != null && (b = new Date(b.getTime() + 864e5)), f >= x && f < b && p++) : P.type == "time" ? (f = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), x = w.isTime(x, true), b = w.isTime(b, true), x = (/* @__PURE__ */ new Date()).setHours(x.hours, x.minutes, x.seconds || 0, 0), b = (/* @__PURE__ */ new Date()).setHours(b.hours, b.minutes, b.seconds || 0, 0), f >= x && f < b && p++) : P.type == "datetime" && (f = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), x = w.isDateTime(x, w.settings.datetimeFormat, true), b = (b = w.isDateTime(b, w.settings.datetimeFormat, true)) && new Date(b.getTime() + 864e5), f >= x) && f < b && p++;
                    break;
                  case "<=":
                    _ = true;
                  case "<":
                  case "less":
                    ["int", "float", "money", "currency", "percent"].indexOf(P.type) != -1 ? (f = parseFloat(t.parseField(h, P.field)), x = parseFloat(A.value), (f < x || _ && f === x) && p++) : P.type == "date" ? (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.isDate(C, w.settings.dateFormat, true), x = w.isDate(x, w.settings.dateFormat, true), (f < x || _ && f === x) && p++) : P.type == "time" ? (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.formatTime(C, "hh24:mi"), x = w.formatTime(x, "hh24:mi"), (f < x || _ && f === x) && p++) : P.type == "datetime" && (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.formatDateTime(C, "yyyy-mm-dd|hh24:mm:ss"), x = w.formatDateTime(w.isDateTime(x, w.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), f.length == x.length) && (f < x || _ && f === x) && p++;
                    break;
                  case ">=":
                    _ = true;
                  case ">":
                  case "more":
                    ["int", "float", "money", "currency", "percent"].indexOf(P.type) != -1 ? (f = parseFloat(t.parseField(h, P.field)), x = parseFloat(A.value), (f > x || _ && f === x) && p++) : P.type == "date" ? (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.isDate(C, w.settings.dateFormat, true), x = w.isDate(x, w.settings.dateFormat, true), (f > x || _ && f === x) && p++) : P.type == "time" ? (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.formatTime(C, "hh24:mi"), x = w.formatTime(x, "hh24:mi"), (f > x || _ && f === x) && p++) : P.type == "datetime" && (C = t.parseField(h, P.field + "_") instanceof Date ? t.parseField(h, P.field + "_") : t.parseField(h, P.field), f = w.formatDateTime(C, "yyyy-mm-dd|hh24:mm:ss"), x = w.formatDateTime(w.isDateTime(x, w.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), f.length == x.length) && (f > x || _ && f === x) && p++;
                    break;
                  case "in":
                    C = A.value, (C = A.svalue ? A.svalue : C).indexOf(w.isFloat(X) ? parseFloat(X) : X) === -1 && C.indexOf(f) === -1 || p++;
                    break;
                  case "not in":
                    C = A.value, (C = A.svalue ? A.svalue : C).indexOf(w.isFloat(X) ? parseFloat(X) : X) === -1 && C.indexOf(f) === -1 && p++;
                    break;
                  case "begins":
                  case "begins with":
                    f.indexOf(x) === 0 && p++;
                    break;
                  case "contains":
                    0 <= f.indexOf(x) && p++;
                    break;
                  case "null":
                    t.parseField(h, P.field) == null && p++;
                    break;
                  case "not null":
                    t.parseField(h, P.field) != null && p++;
                    break;
                  case "ends":
                  case "ends with":
                    let q = f.lastIndexOf(x);
                    q !== -1 && q == f.length - x.length && p++;
                }
              }
            }
            if (t.last.logic == "OR" && p !== 0 || t.last.logic == "AND" && p == t.searchData.length) return true;
            if (((_a3 = h.w2ui) == null ? void 0 : _a3.children) && ((_b = h.w2ui) == null ? void 0 : _b.expanded) !== true) for (let S = 0; S < h.w2ui.children.length; S++) {
              let A = h.w2ui.children[S];
              if (c(A)) return true;
            }
            return false;
          }(i)) if ((i == null ? void 0 : i.w2ui) && function c(h) {
            let p = t.get(h, true);
            if (p == null || h == null || a[h] || t.last.searchIds.includes(p)) return;
            a[h] = true;
            let f = t.records[p];
            (f == null ? void 0 : f.w2ui) && c(f.w2ui.parent_recid), t.last.searchIds.push(p);
          }(i.w2ui.parent_recid), 0 < this.showExtraOnSearch) {
            let c = this.showExtraOnSearch, h = this.showExtraOnSearch;
            if (l < c && (c = l), l + h > this.records.length && (h = this.records.length - l), 0 < c) for (let p = l - c; p < l; p++) this.last.searchIds.indexOf(p) < 0 && this.last.searchIds.push(p);
            if (this.last.searchIds.indexOf(l) < 0 && this.last.searchIds.push(l), 0 < h) for (let p = l + 1; p <= l + h; p++) this.last.searchIds.indexOf(p) < 0 && this.last.searchIds.push(p);
          } else this.last.searchIds.push(l);
        }
        this.total = this.last.searchIds.length;
      }
      return n = Date.now() - n, e !== true && this.show.statusSearch && setTimeout(() => {
        this.status(w.lang("Search took ${count} seconds", { count: n / 1e3 }));
      }, 10), n;
    }
  }
  getRangeData(e, t) {
    var s = this.get(e[0].recid, true), i = this.get(e[1].recid, true), n = e[0].column, o = e[1].column, a = [];
    if (n == o) for (let b = s; b <= i; b++) {
      var l = this.records[b], c = l[this.columns[n].field] || null;
      a.push(t !== true ? c : { data: c, column: n, index: b, record: l });
    }
    else if (s == i) {
      var h = this.records[s];
      for (let b = n; b <= o; b++) {
        var p = h[this.columns[b].field] || null;
        a.push(t !== true ? p : { data: p, column: b, index: s, record: h });
      }
    } else for (let b = s; b <= i; b++) {
      var f = this.records[b];
      a.push([]);
      for (let C = n; C <= o; C++) {
        var x = f[this.columns[C].field];
        t !== true ? a[a.length - 1].push(x) : a[a.length - 1].push({ data: x, column: C, index: b, record: f });
      }
    }
    return a;
  }
  addRange(e) {
    let t = 0, s, i;
    if (this.selectType != "row") {
      Array.isArray(e) || (e = [e]);
      for (let o = 0; o < e.length; o++) {
        if (typeof e[o] != "object" && (e[o] = { name: "selection" }), e[o].name == "selection") {
          if (this.show.selectionBorder === false) continue;
          var n = this.getSelection();
          if (n.length === 0) {
            this.removeRange("selection");
            continue;
          }
          s = n[0], i = n[n.length - 1];
        } else s = e[o].range[0], i = e[o].range[1];
        if (s) {
          n = { name: e[o].name, range: [{ recid: s.recid, column: s.column }, { recid: i.recid, column: i.column }], style: e[o].style || "" };
          let a = false;
          for (let l = 0; l < this.ranges.length; l++) if (this.ranges[l].name == e[o].name) {
            a = l;
            break;
          }
          a !== false ? this.ranges[a] = n : this.ranges.push(n), t++;
        }
      }
      this.refreshRanges();
    }
    return t;
  }
  removeRange() {
    let e = 0;
    for (let s = 0; s < arguments.length; s++) {
      var t = arguments[s];
      d(this.box).find("#grid_" + this.name + "_" + t).remove(), d(this.box).find("#grid_" + this.name + "_f" + t).remove();
      for (let i = this.ranges.length - 1; 0 <= i; i--) this.ranges[i].name == t && (this.ranges.splice(i, 1), e++);
    }
    return e;
  }
  refreshRanges() {
    if (this.ranges.length !== 0) {
      let C = function(S) {
        var A = f.last.move;
        if (A && A.type == "expand") {
          A.divX = S.screenX - A.x, A.divY = S.screenY - A.y;
          let P, X, q = S.target;
          q.tagName.toUpperCase() != "TD" && (q = d(q).closest("td")[0]), (X = d(q).attr("col") != null ? parseInt(d(q).attr("col")) : X) != null && (q = d(q).closest("tr")[0], P = f.records[d(q).attr("index")].recid, A.newRange[1].recid != P || A.newRange[1].column != X) && (S = w.clone(A.newRange), A.newRange = [{ recid: A.recid, column: A.column }, { recid: P, column: X }], b.detail && (b.detail.newRange = w.clone(A.newRange), b.detail.originalRange = w.clone(A.originalRange)), (b = f.trigger("selectionExtend", b)).isCancelled === true ? (A.newRange = S, b.detail.newRange = S) : (f.removeRange("grid-selection-expand"), f.addRange({ name: "grid-selection-expand", range: A.newRange, style: "background-color: rgba(100,100,100,0.1); border: 2px dotted rgba(100,100,100,0.5);" })));
        }
      }, _ = function(S) {
        f.removeRange("grid-selection-expand"), delete f.last.move, d("body").off(".w2ui-" + f.name), b.finish && b.finish();
      }, f = this, x;
      var e = Date.now(), t = d(this.box).find(`#grid_${this.name}_frecords`), s = d(this.box).find(`#grid_${this.name}_records`);
      for (let S = 0; S < this.ranges.length; S++) {
        var i = this.ranges[S], n = i.range[0], o = i.range[1];
        n.index == null && (n.index = this.get(n.recid, true)), o.index == null && (o.index = this.get(o.recid, true));
        let A = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(n.recid) + ' td[col="' + n.column + '"]'), P = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(o.recid) + ' td[col="' + o.column + '"]'), X = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(n.recid) + ' td[col="' + n.column + '"]'), q = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(o.recid) + ' td[col="' + o.column + '"]'), G = o.column;
        n.column < this.last.colStart && o.column > this.last.colStart && (A = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(n.recid) + ' td[col="start"]')), n.column < this.last.colEnd && o.column > this.last.colEnd && (P = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(o.recid) + ' td[col="end"]'), G = '"end"');
        var c = parseInt(d(this.box).find("#grid_" + this.name + "_rec_top").next().attr("index")), h = parseInt(d(this.box).find("#grid_" + this.name + "_rec_bottom").prev().attr("index")), p = parseInt(d(this.box).find("#grid_" + this.name + "_frec_top").next().attr("index")), a = parseInt(d(this.box).find("#grid_" + this.name + "_frec_bottom").prev().attr("index"));
        A.length === 0 && n.index < c && o.index > c && (A = d(this.box).find("#grid_" + this.name + "_rec_top").next().find('td[col="' + n.column + '"]')), P.length === 0 && o.index > h && n.index < h && (P = d(this.box).find("#grid_" + this.name + "_rec_bottom").prev().find('td[col="' + G + '"]')), X.length === 0 && n.index < p && o.index > p && (X = d(this.box).find("#grid_" + this.name + "_frec_top").next().find('td[col="' + n.column + '"]')), q.length === 0 && o.index > a && n.index < a && (q = d(this.box).find("#grid_" + this.name + "_frec_bottom").prev().find('td[col="' + o.column + '"]'));
        var l, c = d(this.box).find("#grid_" + this.name + "_editable").find(".w2ui-input"), h = c.attr("recid"), p = c.attr("column");
        i.name == "selection" && i.range[0].recid == h && i.range[0].column == p || (x = d(this.box).find("#grid_" + this.name + "_f" + i.name), (0 < X.length || 0 < q.length) && (x.length === 0 ? (t.append('<div id="grid_' + this.name + "_f" + i.name + '" class="w2ui-selection" style="' + i.style + '">' + (i.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), x = d(this.box).find("#grid_" + this.name + "_f" + i.name)) : (x.attr("style", i.style), x.find(".w2ui-selection-resizer").show()), q.length === 0 && ((q = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(o.recid) + " td:last-child")).length === 0 && (q = d(this.box).find("#grid_" + this.name + "_frec_bottom td:first-child")), x.css("border-right", "0px"), x.find(".w2ui-selection-resizer").hide()), n.recid != null) && o.recid != null && 0 < X.length && 0 < q.length ? (a = getComputedStyle(q[0]), c = X.prop("offsetTop") - X.prop("scrollTop"), h = X.prop("offsetLeft") + X.prop("scrollLeft"), p = q.prop("offsetTop") - q.prop("scrollTop"), l = q.prop("offsetLeft") + q.prop("scrollLeft"), x.show().css({ top: (0 < c ? c : 0) + "px", left: (0 < h ? h : 0) + "px", width: l - h + parseFloat(a.width) + 2 + "px", height: p - c + parseFloat(a.height) + 1 + "px" })) : x.hide(), x = d(this.box).find("#grid_" + this.name + "_" + i.name), (0 < A.length || 0 < P.length) && (x.length === 0 ? (s.append('<div id="grid_' + this.name + "_" + i.name + '" class="w2ui-selection" style="' + i.style + '">' + (i.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), x = d(this.box).find("#grid_" + this.name + "_" + i.name)) : x.attr("style", i.style), A.length === 0 && (A = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(n.recid) + " td:first-child")).length === 0 && (A = d(this.box).find("#grid_" + this.name + "_rec_top td:first-child")), q.length !== 0 && x.css("border-left", "0px"), n.recid != null) && o.recid != null && 0 < A.length && 0 < P.length ? (l = getComputedStyle(P[0]), h = A.prop("offsetTop") - A.prop("scrollTop"), p = A.prop("offsetLeft") + A.prop("scrollLeft"), c = P.prop("offsetTop") - P.prop("scrollTop"), a = P.prop("offsetLeft") + P.prop("scrollLeft"), x.show().css({ top: (0 < h ? h : 0) + "px", left: (0 < p ? p : 0) + "px", width: a - p + parseFloat(l.width) + 2 + "px", height: c - h + parseFloat(l.height) + 1 + "px" })) : x.hide());
      }
      d(this.box).find(".w2ui-selection-resizer").off(".resizer").on("mousedown.resizer", function(S) {
        var A = f.getSelection();
        f.last.move = { type: "expand", x: S.screenX, y: S.screenY, divX: 0, divY: 0, recid: A[0].recid, column: A[0].column, originalRange: [w.clone(A[0]), w.clone(A[A.length - 1])], newRange: [w.clone(A[0]), w.clone(A[A.length - 1])] }, d("body").off(".w2ui-" + f.name).on("mousemove.w2ui-" + f.name, C).on("mouseup.w2ui-" + f.name, _), S.preventDefault();
      }).on("dblclick.resizer", (S) => {
        S = this.trigger("resizerDblClick", { target: this.name, originalEvent: S }), S.isCancelled !== true && S.finish();
      });
      let b = { target: this.name, originalRange: null, newRange: null };
      return Date.now() - e;
    }
  }
  select() {
    if (arguments.length === 0) return 0;
    let e = 0;
    var t = this.last.selection;
    this.multiSelect || this.selectNone(true);
    let s = Array.from(arguments);
    Array.isArray(s[0]) && (s = s[0]);
    var i = { target: this.name }, i = (s.length == 1 ? (i.multiple = false, w.isPlainObject(s[0]) ? i.clicked = { recid: s[0].recid, column: s[0].column } : i.recid = s[0]) : (i.multiple = true, i.clicked = { recids: s }), this.trigger("select", i));
    if (i.isCancelled === true) return 0;
    if (this.selectType == "row") for (let S = 0; S < s.length; S++) {
      var n = typeof s[S] == "object" ? s[S].recid : s[S], o = this.get(n, true);
      if (o != null) {
        let A = null, P = null;
        (this.searchData.length !== 0 || o + 1 >= this.last.range_start && o + 1 <= this.last.range_end) && (A = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(n)), P = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(n))), this.selectType == "row" && t.indexes.indexOf(o) == -1 && (t.indexes.push(o), A && P && (A.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), P.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), A.find(".w2ui-grid-select-check").prop("checked", true)), e++);
      }
    }
    else {
      var a = {};
      for (let S = 0; S < s.length; S++) {
        var l = typeof s[S] == "object" ? s[S].recid : s[S], c = typeof s[S] == "object" ? s[S].column : null;
        if (a[l] = a[l] || [], Array.isArray(c)) a[l] = c;
        else if (w.isInt(c)) a[l].push(c);
        else for (let A = 0; A < this.columns.length; A++) this.columns[A].hidden || a[l].push(parseInt(A));
      }
      var h, p = [];
      for (h in a) {
        var f = this.get(h, true);
        if (f != null) {
          let S = null, A = null;
          f + 1 >= this.last.range_start && f + 1 <= this.last.range_end && (S = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(h)), A = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(h)));
          var x = t.columns[f] || [];
          t.indexes.indexOf(f) == -1 && t.indexes.push(f);
          for (let P = 0; P < a[h].length; P++) x.indexOf(a[h][P]) == -1 && x.push(a[h][P]);
          x.sort((P, X) => P - X);
          for (let P = 0; P < a[h].length; P++) {
            var b = a[h][P];
            p.indexOf(b) == -1 && p.push(b), S && (S.find("#grid_" + this.name + "_data_" + f + "_" + b).addClass("w2ui-selected"), S.find(".w2ui-col-number").addClass("w2ui-row-selected"), S.find(".w2ui-grid-select-check").prop("checked", true)), A && (A.find("#grid_" + this.name + "_data_" + f + "_" + b).addClass("w2ui-selected"), A.find(".w2ui-col-number").addClass("w2ui-row-selected"), A.find(".w2ui-grid-select-check").prop("checked", true)), e++;
          }
          t.columns[f] = x;
        }
      }
      for (let S = 0; S < p.length; S++) d(this.box).find("#grid_" + this.name + "_column_" + p[S] + " .w2ui-col-header").addClass("w2ui-col-selected");
    }
    t.indexes.sort((S, A) => S - A);
    var C = 0 < this.records.length && t.indexes.length == this.records.length, _ = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
    return C || _ ? d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, C), i.finish(), e;
  }
  unselect() {
    let e = 0;
    var t = this.last.selection;
    let s = Array.from(arguments);
    Array.isArray(s[0]) && (s = s[0]);
    var i = { target: this.name }, i = (s.length == 1 ? (i.multiple = false, w.isPlainObject(s[0]) ? i.clicked = { recid: s[0].recid, column: s[0].column } : i.clicked = { recid: s[0] }) : (i.multiple = true, i.recids = s), this.trigger("select", i));
    if (i.isCancelled === true) return 0;
    for (let b = 0; b < s.length; b++) {
      var n = typeof s[b] == "object" ? s[b].recid : s[b], o = this.get(n);
      if (o != null) {
        var o = this.get(o.recid, true), a = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(n)), l = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(n));
        if (this.selectType == "row") t.indexes.indexOf(o) != -1 && (t.indexes.splice(t.indexes.indexOf(o), 1), a.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), l.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), a.length != 0 && (a[0].style.cssText = "height: " + this.recordHeight + "px; " + a.attr("custom_style"), l[0].style.cssText = "height: " + this.recordHeight + "px; " + l.attr("custom_style")), a.find(".w2ui-grid-select-check").prop("checked", false), e++);
        else {
          var c = s[b].column;
          if (!w.isInt(c)) {
            var h = [];
            for (let _ = 0; _ < this.columns.length; _++) this.columns[_].hidden || h.push({ recid: n, column: _ });
            return this.unselect(h);
          }
          if (l = t.columns[o], Array.isArray(l) && l.indexOf(c) != -1) {
            l.splice(l.indexOf(c), 1), d(this.box).find(`#grid_${this.name}_rec_${w.escapeId(n)} > td[col="${c}"]`).removeClass("w2ui-selected w2ui-inactive"), d(this.box).find(`#grid_${this.name}_frec_${w.escapeId(n)} > td[col="${c}"]`).removeClass("w2ui-selected w2ui-inactive");
            let _ = false, S = false;
            var p = this.getSelection();
            for (let A = 0; A < p.length; A++) p[A].column == c && (_ = true), p[A].recid == n && (S = true);
            _ || d(this.box).find(`.w2ui-grid-columns td[col="${c}"] .w2ui-col-header, .w2ui-grid-fcolumns td[col="${c}"] .w2ui-col-header`).removeClass("w2ui-col-selected"), S || d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(n)).find(".w2ui-col-number").removeClass("w2ui-row-selected"), e++, l.length === 0 && (delete t.columns[o], t.indexes.splice(t.indexes.indexOf(o), 1), a.find(".w2ui-grid-select-check").prop("checked", false));
          }
        }
      }
    }
    var f = 0 < this.records.length && t.indexes.length == this.records.length, x = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
    return f || x ? d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, f), i.finish(), e;
  }
  selectAll() {
    var _a2;
    var e = Date.now();
    if (this.multiSelect !== false) {
      var t = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url;
      let i = w.clone(this.last.selection);
      var s = [];
      for (let n = 0; n < this.columns.length; n++) s.push(n);
      if (i.indexes = [], t || this.searchData.length === 0) {
        let n = this.records.length;
        this.searchData.length == 0 || t || (n = this.last.searchIds.length);
        for (let o = 0; o < n; o++) i.indexes.push(o), this.selectType != "row" && (i.columns[o] = s.slice());
      } else for (let n = 0; n < this.last.searchIds.length; n++) i.indexes.push(this.last.searchIds[n]), this.selectType != "row" && (i.columns[this.last.searchIds[n]] = s.slice());
      if (t = this.trigger("select", { target: this.name, multiple: true, all: true, clicked: i }), t.isCancelled !== true) return this.last.selection = i, this.selectType == "row" ? (d(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), d(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected")) : (d(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").addClass("w2ui-col-selected"), d(this.box).find(".w2ui-grid-records tr .w2ui-col-number").addClass("w2ui-row-selected"), d(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected"), d(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").addClass("w2ui-row-selected"), d(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected")), d(this.box).find("input.w2ui-grid-select-check").prop("checked", true), i = this.getSelection(true), this.addRange("selection"), d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true), this.status(), this.updateToolbar({ indexes: i }, true), t.finish(), Date.now() - e;
    }
  }
  selectNone(e) {
    var t, s = Date.now();
    let i;
    if (e || (i = this.trigger("select", { target: this.name, clicked: [] })).isCancelled !== true) return t = this.last.selection, this.selectType == "row" ? (d(this.box).find(".w2ui-grid-records tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), d(this.box).find(".w2ui-grid-frecords tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected")) : (d(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").removeClass("w2ui-col-selected"), d(this.box).find(".w2ui-grid-records tr .w2ui-col-number").removeClass("w2ui-row-selected"), d(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").removeClass("w2ui-row-selected"), d(this.box).find(".w2ui-grid-data.w2ui-selected").removeClass("w2ui-selected w2ui-inactive")), d(this.box).find("input.w2ui-grid-select-check").prop("checked", false), t.indexes = [], t.columns = {}, this.removeRange("selection"), d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.updateToolbar(t, false), e || i.finish(), Date.now() - s;
  }
  updateToolbar(e) {
    let t = this, s = e && e.indexes ? e.indexes.length : 0;
    function i(n, o) {
      if (n.batch != null) {
        let a = false;
        n.batch === true ? 0 < s && (a = true) : typeof n.batch == "number" ? s === n.batch && (a = true) : typeof n.batch == "function" && (a = n.batch({ cnt: s, sel: e })), a ? t.toolbar.enable(o + n.id) : t.toolbar.disable(o + n.id);
      }
    }
    this.toolbar.items.forEach((n) => {
      i(n, ""), Array.isArray(n.items) && n.items.forEach((o) => {
        i(o, n.id + ":");
      });
    }), this.show.toolbarSave && (0 < this.getChanges().length ? this.toolbar.enable("w2ui-save") : this.toolbar.disable("w2ui-save"));
  }
  getSelection(e) {
    var t = [], s = this.last.selection;
    if (this.selectType == "row") for (let n = 0; n < s.indexes.length; n++) this.records[s.indexes[n]] && t.push(e === true ? s.indexes[n] : this.records[s.indexes[n]].recid);
    else for (let n = 0; n < s.indexes.length; n++) {
      var i = s.columns[s.indexes[n]];
      if (this.records[s.indexes[n]]) for (let o = 0; o < i.length; o++) t.push({ recid: this.records[s.indexes[n]].recid, index: parseInt(s.indexes[n]), column: i[o] });
    }
    return t;
  }
  search(e, t) {
    var _a2;
    var s = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url, i = [];
    let n = this.last.multi, o = this.last.logic, a = this.last.field, l = this.last.search, c = false;
    var h = d(`#w2overlay-${this.name}-search-overlay`);
    for (let D = 0; D < this.searches.length; D++) this.searches[D].hidden && this.searches[D].value != null && (i.push({ field: this.searches[D].field, operator: this.searches[D].operator || "is", type: this.searches[D].type, value: this.searches[D].value || "" }), c = true);
    if (arguments.length === 0 && h.length === 0 && (t = this.multiSearch ? (e = this.searchData, this.last.logic) : (e = this.last.field, this.last.search)), arguments.length === 0 && h.length !== 0) {
      this.focus(), o = h.find(`#grid_${this.name}_logic`).val(), l = "";
      for (let D = 0; D < this.searches.length; D++) {
        var p = this.searches[D], f = h.find("#grid_" + this.name + "_operator_" + D).val(), x = h.find("#grid_" + this.name + "_field_" + D), b = h.find("#grid_" + this.name + "_field2_" + D);
        let R = x.val(), B = b.val(), Q = null, re = null;
        if (["int", "float", "money", "currency", "percent"].indexOf(p.type) != -1 && (C = x[0]._w2field, b = b[0]._w2field, C && (R = C.clean(R)), b) && (B = b.clean(B)), ["list", "enum"].indexOf(p.type) != -1 || ["in", "not in"].indexOf(f) != -1) if (R = x[0]._w2field.selected || {}, Array.isArray(R)) {
          Q = [];
          for (let pe = 0; pe < R.length; pe++) Q.push(w.isFloat(R[pe].id) ? parseFloat(R[pe].id) : String(R[pe].id).toLowerCase()), delete R[pe].hidden;
          Object.keys(R).length === 0 && (R = "");
        } else re = R.text || "", R = R.id || "";
        if (R !== "" && R != null || B != null && B !== "") {
          var C = { field: p.field, type: p.type, operator: f };
          f == "between" ? w.extend(C, { value: [R, B] }) : f == "in" && typeof R == "string" || f == "not in" && typeof R == "string" ? w.extend(C, { value: R.split(",") }) : w.extend(C, { value: R }), Q && w.extend(C, { svalue: Q }), re && w.extend(C, { text: re });
          try {
            p.type == "date" && f == "between" && (C.value[0] = R, C.value[1] = B), p.type == "date" && f == "is" && (C.value = R);
          } catch {
          }
          i.push(C), n = true;
        }
      }
    }
    if (typeof e == "string" && (arguments.length == 1 && (t = e, e = "all"), a = e, l = t, n = false, o = c ? "AND" : "OR", t != null)) if (e.toLowerCase() == "all") if (0 < this.searches.length) for (let D = 0; D < this.searches.length; D++) {
      var _, S = this.searches[D];
      if ((S.type == "text" || S.type == "alphanumeric" && w.isAlphaNumeric(t) || S.type == "int" && w.isInt(t) || S.type == "float" && w.isFloat(t) || S.type == "percent" && w.isFloat(t) || (S.type == "hex" || S.type == "color") && w.isHex(t) || S.type == "currency" && w.isMoney(t) || S.type == "money" && w.isMoney(t) || S.type == "date" && w.isDate(t) || S.type == "time" && w.isTime(t) || S.type == "datetime" && w.isDateTime(t) || S.type == "datetime" && w.isDate(t) || S.type == "enum" && w.isAlphaNumeric(t) || S.type == "list" && w.isAlphaNumeric(t)) && (_ = this.defaultOperator[this.operatorsMap[S.type]], _ = { field: S.field, type: S.type, operator: S.operator != null ? S.operator : _, value: t }, String(t).trim() != "") && i.push(_), ["int", "float", "money", "currency", "percent"].indexOf(S.type) != -1 && String(t).trim().split("-").length == 2 && (_ = String(t).trim().split("-"), A = { field: S.field, type: S.type, operator: S.operator != null ? S.operator : "between", value: [_[0], _[1]] }, i.push(A)), ["list", "enum"].indexOf(S.type) != -1) {
        var A, P = [];
        S.options == null && (S.options = {}), Array.isArray(S.options.items) || (S.options.items = []);
        for (let R = 0; R < S.options.items; R++) {
          var X = S.options.items[R];
          try {
            var q = new RegExp(t, "i");
            q.test(X) && P.push(R), X.text && q.test(X.text) && P.push(X.id);
          } catch {
          }
        }
        0 < P.length && (A = { field: S.field, type: S.type, operator: S.operator != null ? S.operator : "in", value: P }, i.push(A));
      }
    }
    else for (let D = 0; D < this.columns.length; D++) {
      var G = { field: this.columns[D].field, type: "text", operator: this.defaultOperator.text, value: t };
      i.push(G);
    }
    else {
      var W = h.find("#grid_" + this.name + "_search_all");
      let D = this.getSearch(e);
      if ((D = D ?? { field: e, type: "text" }).field == e && (this.last.label = D.label), t !== "") {
        let R = this.defaultOperator[this.operatorsMap[D.type]], B = t;
        if (["date", "time", "datetime"].indexOf(D.type) != -1 && (R = "is"), ["list", "enum"].indexOf(D.type) != -1 && (R = "is", W = W._w2field.get(), B = W && 0 < Object.keys(W).length ? W.id : ""), D.type == "int" && t !== "" && (R = "is", String(t).indexOf("-") != -1 && (W = t.split("-")).length == 2 && (R = "between", B = [parseInt(W[0]), parseInt(W[1])]), String(t).indexOf(",") != -1)) {
          var U = t.split(",");
          R = "in", B = [];
          for (let Q = 0; Q < U.length; Q++) B.push(U[Q]);
        }
        D.operator != null && (R = D.operator), W = { field: D.field, type: D.type, operator: R, value: B }, i.push(W);
      }
    }
    if (Array.isArray(e)) {
      let D = "AND";
      typeof t == "string" && (D = t.toUpperCase()) != "OR" && D != "AND" && (D = "AND"), l = "", n = true, o = D;
      for (let R = 0; R < e.length; R++) {
        var K = e[R];
        typeof K.value == "number" && K.operator == null && (K.operator = this.defaultOperator.number), typeof K.value == "string" && K.operator == null && (K.operator = this.defaultOperator.text), Array.isArray(K.value) && K.operator == null && (K.operator = this.defaultOperator.enum), w.isDate(K.value) && K.operator == null && (K.operator = this.defaultOperator.date), i.push(K);
      }
    }
    W = this.trigger("search", { target: this.name, multi: arguments.length === 0, searchField: e || "multi", searchValue: e ? t : "multi", searchData: i, searchLogic: o }), W.isCancelled !== true && (this.searchData = W.detail.searchData, this.last.field = a, this.last.search = l, this.last.multi = n, this.last.logic = W.detail.searchLogic, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), s ? (this.last.fetch.offset = 0, this.reload()) : (this.localSearch(), this.refresh()), W.finish());
  }
  searchOpen() {
    if (this.box && this.searches.length !== 0) {
      let e = this.trigger("searchOpen", { target: this.name });
      if (e.isCancelled !== true) {
        let t = d(this.toolbar.box).find(".w2ui-grid-search-input .w2ui-search-drop");
        t.addClass("checked"), rt.show({ name: this.name + "-search-overlay", anchor: d(this.box).find("#grid_" + this.name + "_search_all").get(0), position: "bottom|top", html: this.getSearchesHTML(), align: "left", arrowSize: 12, class: "w2ui-grid-search-advanced", hideOn: ["doc-click"] }).then((s) => {
          this.initSearches(), this.last.search_opened = true;
          let i = d(`#w2overlay-${this.name}-search-overlay`);
          i.data("gridName", this.name).off(".grid-search").on("click.grid-search", () => {
            i.find("input, select").each((o) => {
              o = d(o).data("tooltipName"), o && o.forEach((a) => {
                rt.hide(a);
              });
            });
          }), w.bindEvents(i.find("select, input, button"), this);
          var n = d(`#w2overlay-${this.name}-search-overlay *[rel=search]`);
          0 < n.length && n[0].focus(), e.finish();
        }).hide((s) => {
          t.removeClass("checked"), this.last.search_opened = false;
        });
      }
    }
  }
  searchClose() {
    rt.hide(this.name + "-search-overlay");
  }
  searchFieldTooltip(i, t, s) {
    var i = this.searches[i], n = this.searchData[t];
    let o = n.operator, a = ((o = o == "more" && n.type == "date" ? "since" : o) == "less" && n.type == "date" && (o = "before"), ""), l = n.value;
    Array.isArray(n.value) ? (n.value.forEach((c) => {
      a += `<span class="value">${c.text || c}</span>`;
    }), n.type == "date" && (a = "", n.value.forEach((c) => {
      a += `<span class="value">${w.formatDate(c)}</span>`;
    }))) : n.type == "date" && (l = w.formatDateTime(l)), rt.hide(this.name + "-search-props"), rt.show({ name: this.name + "-search-props", anchor: s, class: "w2ui-white", hideOn: "doc-click", html: `
                <div class="w2ui-grid-search-single">
                    <span class="field">${i.label}</span>
                    <span class="operator">${w.lang(o)}</span>
                    ${Array.isArray(n.value) ? "" + a : `<span class="value">${l}</span>`}
                    <div class="buttons">
                        <button id="remove" class="w2ui-btn">${w.lang("Remove This Field")}</button>
                    </div>
                </div>` }).then((c) => {
      d(c.detail.overlay.box).find("#remove").on("click", () => {
        this.searchData.splice("" + t, 1), this.reload(), this.localSearch(), rt.hide(this.name + "-search-props");
      });
    });
  }
  searchSuggest(e, t, s) {
    var _a2, _b;
    clearTimeout(this.last.kbd_timer), clearTimeout(this.last.overlay_timer), this.searchShowFields(true), this.searchClose(), t === true ? rt.hide(this.name + "-search-suggest") : 0 < d(`#w2overlay-${this.name}-search-suggest`).length || (e ? (t = d(this.box).find(`#grid_${this.name}_search_all`).get(0), e = [...this.defaultSearches ?? [], ...0 < ((_a2 = this.defaultSearches) == null ? void 0 : _a2.length) && 0 < ((_b = this.savedSearches) == null ? void 0 : _b.length) ? ["--"] : [], ...this.savedSearches ?? []], Array.isArray(e) && 0 < e.length && Jt.show({ name: this.name + "-search-suggest", anchor: t, align: "both", items: e, hideOn: ["doc-click", "sleect", "remove"], render(i) {
      let n = i.text;
      return n = i.isDefault ? `<b>${n}</b>` : n;
    } }).select((i) => {
      var n = this.trigger("searchSelect", { target: this.name, index: i.detail.index, item: i.detail.item });
      n.isCancelled === true ? i.preventDefault() : (i.detail.overlay.hide(), this.last.logic = i.detail.item.logic || "AND", this.last.search = "", this.last.label = "[Multiple Fields]", this.searchData = w.clone(i.detail.item.data), this.searchSelected = w.clone(i.detail.item, { exclude: ["icon", "remove"] }), this.reload(), n.finish());
    }).remove((i) => {
      let n = i.detail.item, o = this.trigger("searchRemove", { target: this.name, index: i.detail.index, item: n });
      o.isCancelled === true ? i.preventDefault() : (i.detail.overlay.hide(), this.confirm(w.lang('Do you want to delete search "${item}"?', { item: n.text })).yes((a) => {
        var l = this.savedSearches.findIndex((c) => c.id == n.id);
        l !== -1 && this.savedSearches.splice(l, 1), this.cacheSave("searches", this.savedSearches.map((c) => w.clone(c, { exclude: ["remove", "icon"] }))), a.detail.self.close(), o.finish();
      }).no((a) => {
        a.detail.self.close();
      }));
    })) : this.last.overlay_timer = setTimeout(() => {
      this.searchSuggest(true);
    }, 100));
  }
  searchSave() {
    let e = "", t = (this.searchSelected && (e = this.searchSelected.text), this.savedSearches.findIndex((i) => {
      var _a2;
      return i.id == ((_a2 = this.searchSelected) == null ? void 0 : _a2.id);
    })), s = this.trigger("searchSave", { target: this.name, saveLocalStorage: true });
    s.isCancelled !== true && this.message({ width: 350, height: 150, body: `<div class="w2ui-grid-save-search">
                        <span>${w.lang(t != -1 ? "Update Search" : "Save New Search")}</span>
                        <input class="search-name w2ui-input" placeholder="${w.lang("Search name")}">
                   </div>`, buttons: `
                <button id="grid-search-cancel" class="w2ui-btn">${w.lang("Cancel")}</button>
                <button id="grid-search-save" class="w2ui-btn w2ui-btn-blue" ${String(e).trim() == "" ? "disabled" : ""}>${w.lang("Save")}</button>
            ` }).open(async (i) => {
      d(i.detail.box).find("input, button").eq(0).val(e), await i.complete, d(i.detail.box).find("#grid-search-cancel").on("click", () => {
        this.message();
      }), d(i.detail.box).find("#grid-search-save").on("click", () => {
        var n = d(i.detail.box).find(".w2ui-message .search-name").val();
        this.searchSelected && t != -1 ? Object.assign(this.savedSearches[t], { id: n, text: n, logic: this.last.logic, data: w.clone(this.searchData) }) : this.savedSearches.push({ id: n, text: n, icon: "w2ui-icon-search", remove: true, logic: this.last.logic, data: this.searchData }), this.cacheSave("searches", this.savedSearches.map((o) => w.clone(o, { exclude: ["remove", "icon"] }))), this.message(), (this.searchSelected ? (this.searchSelected.text = n, d(this.box).find(`#grid_${this.name}_search_name .name-text`)) : (this.searchSelected = { text: n, logic: this.last.logic, data: w.clone(this.searchData) }, d(i.detail.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), d(i.detail.box).find(`#grid_${this.name}_search_name`).show().find(".name-text"))).html(n), s.finish({ name: n });
      }), d(i.detail.box).find("input, button").off(".message").on("keydown.message", (n) => {
        var o = String(d(i.detail.box).find(".w2ui-message-body input").val()).trim();
        n.keyCode == 13 && o != "" && d(i.detail.box).find("#grid-search-save").trigger("click"), n.keyCode == 27 && this.message();
      }).eq(0).on("input.message", (n) => {
        var o = d(i.detail.box).closest(".w2ui-message").find("#grid-search-save");
        String(d(i.detail.box).val()).trim() === "" ? o.prop("disabled", true) : o.prop("disabled", false);
      }).get(0).focus();
    });
  }
  cache(e) {
    var _a2;
    if (w.hasLocalStorage && this.useLocalStorage) try {
      var t = JSON.parse(localStorage.w2ui || "{}");
      return t[_a2 = this.stateId || this.name] ?? (t[_a2] = {}), t[this.stateId || this.name][e];
    } catch {
    }
    return null;
  }
  cacheSave(e, t) {
    var _a2;
    if (w.hasLocalStorage && this.useLocalStorage) try {
      var s = JSON.parse(localStorage.w2ui || "{}");
      return s[_a2 = this.stateId || this.name] ?? (s[_a2] = {}), s[this.stateId || this.name][e] = t, localStorage.w2ui = JSON.stringify(s), true;
    } catch {
      delete localStorage.w2ui;
    }
    return false;
  }
  searchReset(e) {
    var t = [];
    let s = false;
    for (let o = 0; o < this.searches.length; o++) this.searches[o].hidden && this.searches[o].value != null && (t.push({ field: this.searches[o].field, operator: this.searches[o].operator || "is", type: this.searches[o].type, value: this.searches[o].value || "" }), s = true);
    var i = this.trigger("search", { reset: true, target: this.name, searchData: t });
    if (i.isCancelled !== true) {
      var n = d(this.box).find("#grid_" + this.name + "_search_all");
      if (this.searchData = i.detail.searchData, this.searchSelected = null, this.last.search = "", this.last.logic = s ? "AND" : "OR", n.next().hide(), 0 < this.searches.length) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields", n.next().show();
      else {
        let o = 0;
        for (; o < this.searches.length && (this.searches[o].hidden || this.searches[o].simple === false); ) o++;
        o >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[o].field, this.last.label = this.searches[o].label);
      }
      this.last.multi = false, this.last.fetch.offset = 0, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), n = n.val("").get(0), (n == null ? void 0 : n._w2field) && n._w2field.reset(), e || this.reload(), i.finish();
    }
  }
  searchShowFields(e) {
    if (e === true) rt.hide(this.name + "-search-fields");
    else {
      var t = [];
      for (let i = -1; i < this.searches.length; i++) {
        let n = this.searches[i];
        var s = n ? n.field : null, s = this.getColumn(s);
        let o = false, a = null;
        if (this.show.searchHiddenMsg == 1 && i != -1 && (s == null || s.hidden === true && s.hideable !== false) && (o = true, a = w.lang("This column " + (s == null ? "does not exist" : "is hidden"))), i == -1) {
          if (!this.multiSearch || !this.show.searchAll) continue;
          n = { field: "all", label: "All Fields" };
        } else if (s != null && s.hideable === false || n.hidden === true && (a = w.lang("This column is hidden"), n.simple === false)) continue;
        n.label == null && n.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", n), n.label = n.caption), t.push({ id: n.field, text: w.lang(n.label), search: n, tooltip: a, disabled: o, checked: n.field == this.last.field });
      }
      Jt.show({ type: "radio", name: this.name + "-search-fields", anchor: d(this.box).find("#grid_" + this.name + "_search_name").parent().find(".w2ui-search-down").get(0), items: t, align: "none", hideOn: ["doc-click", "select"] }).select((i) => {
        this.searchInitInput(i.detail.item.search.field);
      });
    }
  }
  searchInitInput(e, t) {
    let s;
    var i = d(this.box).find("#grid_" + this.name + "_search_all");
    if (e == "all") s = { field: "all", label: w.lang("All Fields") };
    else if ((s = this.getSearch(e)) == null) return;
    this.last.search != "" ? (this.last.label = s.label, this.search(s.field, this.last.search)) : (this.last.field = s.field, this.last.label = s.label), i.attr("placeholder", w.lang("Search") + " " + w.lang(s.label || s.caption || s.field, true));
  }
  clear(e) {
    this.total = 0, this.records = [], this.summary = [], this.last.fetch.offset = 0, this.last.idCache = {}, this.last.selection = { indexes: [], columns: {} }, this.reset(true), e || this.refresh();
  }
  reset(e) {
    this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.range_start = null, this.last.range_end = null, d(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), e || this.refresh();
  }
  skip(e, t) {
    var _a2;
    ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url ? (this.offset = parseInt(e), this.offset > this.total && (this.offset = this.total - this.limit), (this.offset < 0 || !w.isInt(this.offset)) && (this.offset = 0), this.clear(true), this.reload(t)) : console.log("ERROR: grid.skip() can only be called when you have remote data source.");
  }
  load(e, t) {
    return e == null ? (console.log('ERROR: You need to provide url argument when calling .load() method of "' + this.name + '" object.'), new Promise((s, i) => {
      i();
    })) : (this.clear(true), this.request("load", {}, e, t));
  }
  reload(e) {
    var _a2;
    let t = this;
    var s = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url;
    return t.selectionSave(), s ? this.load(s, () => {
      t.selectionRestore(), typeof e == "function" && e();
    }) : (this.reset(true), this.localSearch(), this.selectionRestore(), typeof e == "function" && e({ status: "success" }), new Promise((i) => {
      i();
    }));
  }
  request(e, t, s, i) {
    let n = this, o, a;
    var l = new Promise((x, b) => {
      o = x, a = b;
    });
    if (t == null && (t = {}), !(s = s || this.url)) return new Promise((x, b) => {
      b();
    });
    w.isInt(this.offset) || (this.offset = 0), w.isInt(this.last.fetch.offset) || (this.last.fetch.offset = 0);
    let c;
    var h = { limit: this.limit, offset: parseInt(this.offset) + parseInt(this.last.fetch.offset), searchLogic: this.last.logic, search: this.searchData.map((x) => (x = w.clone(x), this.searchMap && this.searchMap[x.field] && (x.field = this.searchMap[x.field]), x)), sort: this.sortData.map((x) => (x = w.clone(x), this.sortMap && this.sortMap[x.field] && (x.field = this.sortMap[x.field]), x)) };
    if (this.searchData.length === 0 && (delete h.search, delete h.searchLogic), this.sortData.length === 0 && delete h.sort, w.extend(h, this.postData), w.extend(h, t), e != "delete" && e != "save" || (delete h.limit, delete h.offset, (h.action = e) == "delete" && (h[this.recid || "recid"] = this.getSelection())), e == "load") {
      if ((c = this.trigger("request", { target: this.name, url: s, postData: h, httpMethod: "GET", httpHeaders: this.httpHeaders })).isCancelled === true) return new Promise((x, b) => {
        b();
      });
    } else c = { detail: { url: s, postData: h, httpMethod: e == "save" ? "PUT" : "DELETE", httpHeaders: this.httpHeaders } };
    if (this.last.fetch.offset === 0 && this.lock(w.lang(this.msgRefresh), true), this.last.fetch.controller) try {
      this.last.fetch.controller.abort();
    } catch {
    }
    switch (s = c.detail.url, e) {
      case "save":
        (s == null ? void 0 : s.save) && (s = s.save);
        break;
      case "delete":
        (s == null ? void 0 : s.remove) && (s = s.remove);
        break;
      default:
        s = (s == null ? void 0 : s.get) ?? s;
    }
    if (0 < Object.keys(this.routeData).length) {
      var p = w.parseRoute(s);
      if (0 < p.keys.length) for (let x = 0; x < p.keys.length; x++) this.routeData[p.keys[x].name] != null && (s = s.replace(new RegExp(":" + p.keys[x].name, "g"), this.routeData[p.keys[x].name]));
    }
    return s = new URL(s, location), t = w.prepareParams(s, { method: c.detail.httpMethod, headers: c.detail.httpHeaders, body: c.detail.postData }, this.dataType), Object.assign(this.last.fetch, { action: e, options: t, controller: new AbortController(), start: Date.now(), loaded: false }), t.signal = this.last.fetch.controller.signal, fetch(s, t).catch(f).then((x) => {
      x != null && ((x == null ? void 0 : x.status) != 200 ? f(x ?? {}) : (n.unlock(), x.json().catch(f).then((b) => {
        this.requestComplete(b, e, i, o, a);
      })));
    }), e == "load" && c.finish(), l;
    function f(x) {
      var b;
      (x == null ? void 0 : x.name) !== "AbortError" && (n.unlock(), (b = n.trigger("error", { response: x, lastFetch: n.last.fetch })).isCancelled !== true) && (x.status && x.status != 200 ? n.error(x.status + ": " + x.statusText) : (console.log("ERROR: Server communication failed.", `
   EXPECTED:`, { total: 5, records: [{ recid: 1, field: "value" }] }, `
         OR:`, { error: true, message: "error message" }), n.requestComplete({ error: true, message: w.lang(this.msgHTTPError), response: x }, e, i, o, a)), b.finish());
    }
  }
  requestComplete(e, t, s, i, n) {
    var _a2;
    let o = e.error ?? false, a = (e.error == null && e.status === "error" && (o = true), this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1e3, setTimeout(() => {
      this.show.statusResponse && this.status(w.lang("Server Response ${count} seconds", { count: this.last.fetch.response }));
    }, 10), this.last.pull_more = false, this.last.pull_refresh = true, "load");
    this.last.fetch.action == "save" && (a = "save"), this.last.fetch.action == "delete" && (a = "delete");
    var l = this.trigger(a, { target: this.name, error: o, data: e, lastFetch: this.last.fetch });
    if (l.isCancelled === true) n();
    else {
      if (o) this.error(w.lang(e.message ?? this.msgServerError)), n(e);
      else if (typeof this.parser == "function" ? typeof (e = this.parser(e)) != "object" && console.log("ERROR: Your parser did not return proper object") : e == null ? e = { error: true, message: w.lang(this.msgNotJSON) } : Array.isArray(e) && (e = { error: o, records: e, total: e.length }), t == "load") {
        if (e.total == null && (e.total = -1), e.records == null && (e.records = []), e.records.length == this.limit ? (n = this.records.length + e.records.length, this.last.fetch.hasMore = n != this.total) : (this.last.fetch.hasMore = false, this.total = this.offset + this.last.fetch.offset + e.records.length), this.last.fetch.hasMore || d(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").hide(), this.last.fetch.offset === 0) this.records = [], this.summary = [];
        else if (e.total != -1 && parseInt(e.total) != parseInt(this.total)) {
          let c = this;
          return this.message(w.lang(this.msgNeedReload)).ok(() => {
            delete c.last.fetch.offset, c.reload();
          }), new Promise((h) => {
            h();
          });
        }
        w.isInt(e.total) && (this.total = parseInt(e.total)), e.records && e.records.forEach((c) => {
          var _a3;
          this.recid && (c.recid = this.parseField(c, this.recid)), c.recid == null && (c.recid = "recid-" + this.records.length), (((_a3 = c.w2ui) == null ? void 0 : _a3.summary) === true ? this.summary : this.records).push(c);
        }), e.summary && (this.summary = [], e.summary.forEach((c) => {
          this.recid && (c.recid = this.parseField(c, this.recid)), c.recid == null && (c.recid = "recid-" + this.summary.length), this.summary.push(c);
        }));
      } else if (t == "delete") return this.reset(), this.reload();
      (((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url) || (this.localSort(), this.localSearch()), this.total = parseInt(this.total), this.last.fetch.offset === 0 ? this.refresh() : (this.scroll(), this.resize()), typeof s == "function" && s(e), i(e), l.finish(), this.last.fetch.loaded = true;
    }
  }
  error(e) {
    var t = this.trigger("error", { target: this.name, message: e });
    t.isCancelled !== true && (this.message(e), t.finish());
  }
  getChanges(e) {
    var t = [];
    e === void 0 && (e = this.records);
    for (let n = 0; n < e.length; n++) {
      var s, i = e[n];
      (i == null ? void 0 : i.w2ui) && (i.w2ui.changes != null && ((s = {})[this.recid || "recid"] = i.recid, t.push(w.extend(s, i.w2ui.changes))), i.w2ui.expanded !== true) && i.w2ui.children && i.w2ui.children.length && t.push(...this.getChanges(i.w2ui.children));
    }
    return t;
  }
  mergeChanges() {
    var e = this.getChanges();
    for (let i = 0; i < e.length; i++) {
      var t, s = this.get(e[i][this.recid || "recid"]);
      for (t in e[i]) if (!(t == "recid" || this.recid && t == this.recid)) {
        typeof e[i][t] == "object" && (e[i][t] = e[i][t].text);
        try {
          (function n(o, a, l) {
            let c = a.split(".");
            c.length == 1 ? o[a] = l : (o = o[c[0]], c.shift(), n(o, c.join("."), l));
          })(s, t, e[i][t]);
        } catch (n) {
          console.log("ERROR: Cannot merge. ", n.message || "", n);
        }
        s.w2ui && delete s.w2ui.changes;
      }
    }
    this.refresh();
  }
  save(e) {
    var _a2;
    var t = this.getChanges(), s = ((_a2 = this.url) == null ? void 0 : _a2.save) ?? this.url;
    let i = this.trigger("save", { target: this.name, changes: t });
    i.isCancelled !== true && (s ? this.request("save", { changes: i.detail.changes }, null, (n) => {
      n.error || this.mergeChanges(), i.finish(), typeof e == "function" && e(n);
    }) : (this.mergeChanges(), i.finish()));
  }
  editField(e, t, s, i) {
    var _a2, _b;
    let n = this;
    if (this.last.inEditMode === true) i && i.keyCode == 13 ? ({ index: o, column: a, value: l } = this.last._edit, this.editChange({ type: "custom", value: l }, o, a, i), this.editDone(o, a, i)) : 0 < (l = d(this.box).find("div.w2ui-edit-box .w2ui-input")).length && (l.get(0).tagName == "DIV" ? (l.text(l.text() + s), w.setCursorPosition(l.get(0), l.text().length)) : (l.val(l.val() + s), w.setCursorPosition(l.get(0), l.val().length)));
    else {
      let c = this.get(e, true), h = this.getCellEditable(c, t);
      if (h && !["checkbox", "check"].includes(h.type)) {
        let p = this.records[c], f = this.columns[t];
        var o = f.frozen === true ? "_f" : "_";
        if (["enum", "file"].indexOf(h.type) != -1) console.log('ERROR: input types "enum" and "file" are not supported in inline editing.');
        else {
          var a = this.trigger("editField", { target: this.name, recid: e, column: t, value: s, index: c, originalEvent: i });
          if (a.isCancelled !== true) {
            let P = function(X) {
              try {
                var q = getComputedStyle(X), G = X.tagName.toUpperCase() == "DIV" ? X.innerText : X.value, W = d(n.box).find("#grid_" + n.name + "_editable").get(0), U = `font-family: ${q["font-family"]}; font-size: ${q["font-size"]}; white-space: no-wrap;`, K = w.getStrWidth(G, U);
                K + 20 > W.clientWidth && d(W).css("width", K + 20 + "px");
              } catch {
              }
            };
            s = a.detail.value, this.last.inEditMode = true, this.last.editColumn = t, this.last._edit = { value: s, index: c, column: t, recid: e }, this.selectNone(true), this.select({ recid: e, column: t });
            var l = d(this.box).find("#grid_" + this.name + o + "rec_" + w.escapeId(e));
            let x = l.find('[col="' + t + '"] > div'), b = (this.last._edit.tr = l, this.last._edit.div = x, d(this.box).find("div.w2ui-edit-box").remove(), this.selectType != "row" && (d(this.box).find("#grid_" + this.name + o + "selection").attr("id", "grid_" + this.name + "_editable").removeClass("w2ui-selection").addClass("w2ui-edit-box").prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>').find(".w2ui-selection-resizer").remove(), x = d(this.box).find("#grid_" + this.name + "_editable > div:first-child")), h.attr = h.attr ?? "", h.text = h.text ?? "", h.style = h.style ?? "", h.items = h.items ?? [], ((_b = (_a2 = p.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b[f.field]) != null ? w.stripTags(p.w2ui.changes[f.field]) : w.stripTags(n.parseField(p, f.field))), C = typeof (b = b ?? "") != "object" ? b : "", _ = (a.detail.prevValue != null && (C = a.detail.prevValue), s != null && (b = s), f.style != null ? f.style + ";" : "");
            typeof f.render == "string" && ["number", "int", "float", "money", "percent", "size"].includes(f.render.split(":")[0]) && (_ += "text-align: right;"), 0 < h.items.length && !w.isPlainObject(h.items[0]) && (h.items = w.normMenu(h.items));
            let S, A = ["date", "time", "datetime", "color", "list", "combo"];
            i = getComputedStyle(l.find('[col="' + t + '"] > div').get(0)), o = `font-family: ${i["font-family"]}; font-size: ${i["font-size"]};`, h.type === "div" ? (x.addClass("w2ui-editable").html(w.stripSpaces(`<div id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input w2ui-focus"
                        contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                        style="${o + _ + h.style}"
                        field="${f.field}" recid="${e}" column="${t}" ${h.attr}>
                    </div>` + h.text)), (S = x.find("div.w2ui-input").get(0)).innerText = typeof b != "object" ? b : "", s != null ? w.setCursorPosition(S, S.innerText.length) : w.setCursorPosition(S, 0, S.innerText.length)) : (x.addClass("w2ui-editable").html(w.stripSpaces(`<input id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input"
                        autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                        style="${o + _ + h.style}"
                        field="${f.field}" recid="${e}" column="${t}" ${h.attr}>` + h.text)), S = x.find("input").get(0), h.type == "number" && (b = w.formatNumber(b)), h.type == "date" && (b = w.formatDate(w.isDate(b, h.format, true) || /* @__PURE__ */ new Date(), h.format)), S.value = typeof b != "object" ? b : "", l = (X) => {
              var _a3, _b2, _c2, _d;
              var q = (_a3 = this.last._edit) == null ? void 0 : _a3.escKey;
              let G = false;
              var W = d(S).data("tooltipName");
              W && ((_b2 = rt.get(W[0])) == null ? void 0 : _b2.selected) != null && (G = true), !this.last.inEditMode || q || !A.includes(h.type) || ((_c2 = X.detail.overlay.anchor) == null ? void 0 : _c2.id) != ((_d = this.last._edit.input) == null ? void 0 : _d.id) && h.type != "list" || (this.editChange(), this.editDone(void 0, void 0, { keyCode: G ? 13 : 0 }));
            }, new yn(w.extend({}, h, { el: S, selected: b, onSelect: l, onHide: l })), s == null && S && S.select()), Object.assign(this.last._edit, { input: S, edit: h }), d(S).off(".w2ui-editable").on("blur.w2ui-editable", (X) => {
              var q, G;
              this.last.inEditMode && (q = this.last._edit.edit.type, G = d(S).data("tooltipName"), A.includes(q) && G || (this.editChange(S, c, t, X), this.editDone()));
            }).on("mousedown.w2ui-editable", (X) => {
              X.stopPropagation();
            }).on("click.w2ui-editable", (X) => {
              P.call(S, X);
            }).on("paste.w2ui-editable", (X) => {
              X.preventDefault(), X = X.clipboardData.getData("text/plain"), document.execCommand("insertHTML", false, X);
            }).on("keyup.w2ui-editable", (X) => {
              P.call(S, X);
            }).on("keydown.w2ui-editable", (X) => {
              switch (X.keyCode) {
                case 8:
                  h.type != "list" || S._w2field || X.preventDefault();
                  break;
                case 9:
                case 13:
                  X.preventDefault();
                  break;
                case 27:
                  var q = d(S).data("tooltipName");
                  q && 0 < q.length && (this.last._edit.escKey = true, rt.hide(q[0]), X.preventDefault()), X.stopPropagation();
              }
              setTimeout(() => {
                var _a3, _b2;
                switch (X.keyCode) {
                  case 9:
                    var G = X.shiftKey ? n.prevCell(c, t, true) : n.nextCell(c, t, true);
                    G != null && (W = n.records[G.index].recid, this.editChange(S, c, t, X), this.editDone(c, t, X), n.selectType != "row" ? (n.selectNone(true), n.select({ recid: W, column: G.colIndex })) : n.editField(W, G.colIndex, null, X), X.preventDefault) && X.preventDefault();
                    break;
                  case 13: {
                    let U = false;
                    var W = d(S).data("tooltipName");
                    W && rt.get(W[0]).selected != null && (U = true), W && U || (this.editChange(S, c, t, X), this.editDone(c, t, X));
                    break;
                  }
                  case 27: {
                    this.last._edit.escKey = false;
                    let U = n.parseField(p, f.field);
                    ((_b2 = (_a3 = p.w2ui) == null ? void 0 : _a3.changes) == null ? void 0 : _b2[f.field]) != null && (U = p.w2ui.changes[f.field]), S._prevValue != null && (U = S._prevValue), S.tagName == "DIV" ? S.innerText = U ?? "" : S.value = U ?? "", this.editDone(c, t, X), setTimeout(() => {
                      n.select({ recid: e, column: t });
                    }, 1);
                    break;
                  }
                }
                P(S);
              }, 1);
            }), S && (S._prevValue = C), h.type != "list" && setTimeout(() => {
              this.last.inEditMode && S && (S.focus(), clearTimeout(this.last.kbd_timer), (S.resize = P)(S));
            }, 50), a.finish({ input: S });
          }
        }
      }
    }
  }
  editChange(e, t, s, i) {
    var _a2, _b, _c2, _d;
    e = e ?? this.last._edit.input, t = t ?? this.last._edit.index, s = s ?? this.last._edit.column, i = i ?? {};
    var n = (t < 0 ? this.summary : this.records)[t = t < 0 ? -t - 1 : t], o = this.columns[s];
    let a = (e == null ? void 0 : e.tagName) == "DIV" ? e.innerText : e.value;
    var l = e._w2field, c = (l && (l.type == "list" && (a = l.selected), Object.keys(a).length !== 0 && a != null || (a = ""), w.isPlainObject(a) || (a = l.clean(a))), e.type == "checkbox" && (((_a2 = n.w2ui) == null ? void 0 : _a2.editable) === false && (e.checked = !e.checked), a = e.checked), this.parseField(n, o.field)), h = ((_b = n.w2ui) == null ? void 0 : _b.changes) && n.w2ui.changes.hasOwnProperty(o.field) ? n.w2ui.changes[o.field] : c;
    let p = { target: this.name, input: e, recid: n.recid, index: t, column: s, originalEvent: i, value: { new: a, previous: h, original: c } }, f = (((_c2 = i.target) == null ? void 0 : _c2._prevValue) != null && (p.value.previous = i.target._prevValue), 0);
    for (; f < 20; ) {
      if (f++, typeof (a = p.value.new) != "object" && String(c) != String(a) || typeof a == "object" && a && a.id != c && (typeof c != "object" || c == null || a.id != c.id)) {
        if ((p = this.trigger("change", p)).isCancelled !== true) {
          if (a !== p.detail.value.new) continue;
          (p.detail.value.new !== "" && p.detail.value.new != null || h !== "" && h != null) && (n.w2ui = n.w2ui ?? {}, n.w2ui.changes = n.w2ui.changes ?? {}, n.w2ui.changes[o.field] = p.detail.value.new), p.finish();
        }
      } else if ((p = this.trigger("restore", p)).isCancelled !== true) {
        if (a !== p.detail.value.new) continue;
        ((_d = n.w2ui) == null ? void 0 : _d.changes) && (delete n.w2ui.changes[o.field], Object.keys(n.w2ui.changes).length === 0) && delete n.w2ui.changes, p.finish();
      }
      break;
    }
  }
  editDone(e, t, s) {
    var _a2, _b;
    if (e = e ?? this.last._edit.index, t = t ?? this.last._edit.column, s = s ?? {}, this.advanceOnEdit && s.keyCode == 13) {
      let l = s.shiftKey ? this.prevRow(e, t, 1) : this.nextRow(e, t, 1);
      l == null && (l = e), setTimeout(() => {
        this.selectType != "row" ? (this.selectNone(true), this.select({ recid: this.records[l].recid, column: t })) : this.editField(this.records[l].recid, t, null, s);
      }, 1);
    }
    var i = e < 0, n = d(this.last._edit.tr).find('[col="' + t + '"]'), o = this.records[e], a = this.columns[t];
    this.last.inEditMode = false, this.last._edit = null, i || (((_b = (_a2 = o.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b[a.field]) != null ? n.addClass("w2ui-changed") : n.removeClass("w2ui-changed"), n.replace(this.getCellHTML(e, t, i))), d(this.box).find("div.w2ui-edit-box").remove(), this.updateToolbar(), setTimeout(() => {
      var l = d(this.box).find(`#grid_${this.name}_focus`).get(0);
      document.activeElement === l || this.last.inEditMode || l.focus();
    }, 10);
  }
  delete(e) {
    var _a2;
    var t = this.trigger("delete", { target: this.name, force: e });
    if (e && this.message(), t.isCancelled !== true) {
      e = t.detail.force;
      var s = this.getSelection();
      if (s.length !== 0) if (this.msgDelete == "" || e) {
        if (typeof this.url != "object" ? this.url : this.url.remove) this.request("delete");
        else if (typeof s[0] != "object") this.selectNone(), this.remove.apply(this, s);
        else {
          for (let a = 0; a < s.length; a++) {
            var i = this.columns[s[a].column].field, n = this.get(s[a].recid, true), o = this.records[n];
            n != null && i != "recid" && (this.records[n][i] = "", (_a2 = o.w2ui) == null ? void 0 : _a2.changes) && delete o.w2ui.changes[i];
          }
          this.update();
        }
        t.finish();
      } else this.confirm({ text: w.lang(this.msgDelete, { count: s.length, records: w.lang(s.length == 1 ? "record" : "records") }), width: 380, height: 170, yes_text: w.lang("Delete"), yes_class: "w2ui-btn-red", no_text: w.lang("Cancel") }).yes((a) => {
        a.detail.self.close(), this.delete(true);
      }).no((a) => {
        a.detail.self.close();
      });
    }
  }
  click(e, t) {
    var _a2, _b, _c2;
    var s = Date.now();
    let i = null;
    if (!(this.last.cancelClick == 1 || t && t.altKey)) if (typeof e == "object" && e !== null && (i = e.column, e = e.recid), t == null && (t = {}), s - parseInt(this.last.click_time) < 350 && this.last.click_recid == e && t.type == "click") this.dblClick(e, t);
    else {
      if (this.last.bubbleEl && (this.last.bubbleEl = null), this.last.click_time = s, s = this.last.click_recid, this.last.click_recid = e, i == null && t.target) {
        let p = t.target;
        p.tagName != "TD" && (p = d(p).closest("td")[0]), d(p).attr("col") != null && (i = parseInt(d(p).attr("col")));
      }
      var n = this.trigger("click", { target: this.name, recid: e, column: i, originalEvent: t });
      if (n.isCancelled !== true) {
        var o = this.getSelection(), a = (d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.get(e, true)), l = [];
        this.last.sel_ind = a, this.last.sel_col = i, this.last.sel_recid = e, this.last.sel_type = "click";
        let p, f, x, b;
        if (t.shiftKey && 0 < o.length && this.multiSelect) {
          if (o[0].recid) {
            p = this.get(o[0].recid, true), f = this.get(e, true), b = i > o[0].column ? (x = o[0].column, i) : (x = i, o[0].column);
            for (let C = x; C <= b; C++) l.push(C);
          } else p = this.get(s, true), f = this.get(e, true);
          var c = [], h = (p > f && (s = p, p = f, f = s), ((_a2 = this.url) == null ? void 0 : _a2.get) ? this.url.get : this.url);
          for (let C = p; C <= f; C++) if (!(0 < this.searchData.length) || h || this.last.searchIds.includes(C)) if (this.selectType == "row") c.push(this.records[C].recid);
          else for (let _ = 0; _ < l.length; _++) c.push({ recid: this.records[C].recid, column: l[_] });
          this.select(c);
        } else {
          s = this.last.selection;
          let C = s.indexes.indexOf(a) != -1, _ = false;
          d(t.target).closest("td").hasClass("w2ui-col-select") && (_ = true), (t.ctrlKey || t.shiftKey || t.metaKey || _) && this.multiSelect || this.showSelectColumn ? (C = this.selectType == "row" || ((_b = s.columns[a]) == null ? void 0 : _b.includes(i)) ? C : false) === true ? this.unselect({ recid: e, column: i }) : this.select({ recid: e, column: i }) : (this.selectType == "row" || ((_c2 = s.columns[a]) == null ? void 0 : _c2.includes(i)) || (C = false), this.selectNone(true), C === true && o.length == 1 ? this.unselect({ recid: e, column: i }) : this.select({ recid: e, column: i }));
        }
        this.status(), this.initResize(), n.finish();
      }
    }
  }
  columnClick(e, t) {
    if (this.last.colResizing !== true) {
      let o = this.trigger("columnClick", { target: this.name, field: e, originalEvent: t });
      if (o.isCancelled !== true) {
        if (this.selectType == "row") {
          var s = this.getColumn(e);
          s && s.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), o.detail.field == "line-number" && (this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll());
        } else if (t.altKey && (s = this.getColumn(e)) && s.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), o.detail.field == "line-number") this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll();
        else {
          t.shiftKey || t.metaKey || t.ctrlKey || this.selectNone(true);
          var s = this.getSelection(), e = this.getColumn(o.detail.field, true), i = [], n = [];
          if (s.length != 0 && t.shiftKey) {
            let c = e, h = s[0].column;
            c > h && (c = s[0].column, h = e);
            for (let p = c; p <= h; p++) n.push(p);
          } else n.push(e);
          if ((o = this.trigger("columnSelect", { target: this.name, columns: n })).isCancelled !== true) {
            for (let c = 0; c < this.records.length; c++) i.push({ recid: this.records[c].recid, column: n });
            this.select(i);
          }
          o.finish();
        }
        o.finish();
      }
    }
  }
  columnDblClick(e, t) {
    e = this.trigger("columnDblClick", { target: this.name, field: e, originalEvent: t }), e.isCancelled !== true && e.finish();
  }
  columnContextMenu(e, t) {
    e = this.trigger("columnContextMenu", { target: this.name, field: e, originalEvent: t }), e.isCancelled !== true && (this.show.columnMenu && (Jt.show({ type: "check", anchor: document.body, originalEvent: t, items: this.initColumnOnOff() }).then(() => {
      d("#w2overlay-context-menu .w2ui-grid-skip").off(".w2ui-grid").on("click.w2ui-grid", (s) => {
        s.stopPropagation();
      }).on("keypress", (s) => {
        s.keyCode == 13 && (this.skip(s.target.value), this.toolbar.click("w2ui-column-on-off"));
      });
    }).select((s) => {
      var i = s.detail.item.id;
      ["w2ui-stateSave", "w2ui-stateReset"].includes(i) ? this[i.substring(5)]() : i != "w2ui-skip" && this.columnOnOff(s, s.detail.item.id), clearTimeout(this.last.kbd_timer);
    }), clearTimeout(this.last.kbd_timer)), t.preventDefault(), e.finish());
  }
  focus(e) {
    if (e = this.trigger("focus", { target: this.name, originalEvent: e }), e.isCancelled === true) return false;
    this.hasFocus = true, d(this.box).removeClass("w2ui-inactive").find(".w2ui-inactive").removeClass("w2ui-inactive"), setTimeout(() => {
      var t = d(this.box).find(`#grid_${this.name}_focus`).get(0);
      t && document.activeElement != t && t.focus();
    }, 10), e.finish();
  }
  blur(e) {
    if (e = this.trigger("blur", { target: this.name, originalEvent: e }), e.isCancelled === true) return false;
    this.hasFocus = false, d(this.box).addClass("w2ui-inactive").find(".w2ui-selected").addClass("w2ui-inactive"), d(this.box).find(".w2ui-selection").addClass("w2ui-inactive"), e.finish();
  }
  keydown(e) {
    let t = this, s = typeof this.url != "object" ? this.url : this.url.get;
    if (t.keyboard === true) {
      var i = t.trigger("keydown", { target: t.name, originalEvent: e });
      if (i.isCancelled !== true) if (0 < d(this.box).find(".w2ui-message").length) e.keyCode == 27 && this.message();
      else {
        let X = function(U) {
          if (l && G(), !(_.length <= 0)) {
            let R = t.prevRow(b, t.selectType == "row" ? 0 : h[0].column, U);
            if ((R = P || R != null ? R : t.searchData.length == 0 || s ? 0 : t.last.searchIds[0]) != null) {
              if (P && t.multiSelect) {
                if (W()) return;
                if (t.selectType == "row") t.last.sel_ind > R && t.last.sel_ind != C ? t.unselect(t.records[C].recid) : t.select(t.records[R].recid);
                else if (t.last.sel_ind > R && t.last.sel_ind != C) {
                  R = C;
                  var K = [];
                  for (let B = 0; B < f.length; B++) K.push({ recid: t.records[R].recid, column: f[B] });
                  t.unselect(K);
                } else {
                  var D = [];
                  for (let B = 0; B < f.length; B++) D.push({ recid: t.records[R].recid, column: f[B] });
                  t.select(D);
                }
              } else t.selectNone(true), t.click({ recid: t.records[R].recid, column: f[0] }, e);
              t.scrollIntoView(R, null, true, U != 1), e.preventDefault && e.preventDefault();
            } else P || t.selectNone(true);
          }
        }, q = function(U) {
          if (l && G(), !(_.length <= 0)) {
            let R = t.nextRow(C, t.selectType == "row" ? 0 : h[0].column, U);
            if ((R = P || R != null ? R : t.searchData.length == 0 || s ? t.records.length - 1 : t.last.searchIds[t.last.searchIds.length - 1]) != null) {
              if (P && t.multiSelect) {
                if (W()) return;
                if (t.selectType == "row") t.last.sel_ind < R && t.last.sel_ind != b ? t.unselect(t.records[b].recid) : t.select(t.records[R].recid);
                else if (t.last.sel_ind < R && t.last.sel_ind != b) {
                  R = b;
                  var K = [];
                  for (let B = 0; B < f.length; B++) K.push({ recid: t.records[R].recid, column: f[B] });
                  t.unselect(K);
                } else {
                  var D = [];
                  for (let B = 0; B < f.length; B++) D.push({ recid: t.records[R].recid, column: f[B] });
                  t.select(D);
                }
              } else t.selectNone(true), t.click({ recid: t.records[R].recid, column: f[0] }, e);
              t.scrollIntoView(R, null, true, U != 1), S = true;
            } else P || t.selectNone(true);
          }
        }, G = function() {
          if (t.records && t.records.length !== 0) {
            let U = Math.floor(c[0].scrollTop / t.recordHeight) + 1;
            (!t.records[U] || U < 2) && (U = 0), t.records[U] !== void 0 && t.select({ recid: t.records[U].recid, column: 0 });
          }
        }, W = function() {
          if (t.last.sel_type == "click") {
            if (t.selectType == "row") return t.last.sel_type = "key", 1 < h.length && (h.splice(h.indexOf(t.records[t.last.sel_ind].recid), 1), t.unselect(h), 1);
            if (t.last.sel_type = "key", 1 < h.length) {
              for (let U = 0; U < h.length; U++) if (h[U].recid == t.last.sel_recid && h[U].column == t.last.sel_col) {
                h.splice(U, 1);
                break;
              }
              return t.unselect(h), 1;
            }
          }
        }, l = false, c = d(t.box).find("#grid_" + t.name + "_records"), h = t.getSelection(), p = (h.length === 0 && (l = true), h[0] || null), f = [], x = h[h.length - 1];
        if (typeof p == "object" && p != null) {
          p = h[0].recid, f = [];
          let U = 0;
          for (; !(!h[U] || h[U].recid != p); ) f.push(h[U].column), U++;
          x = h[h.length - 1].recid;
        }
        let b = t.get(p, true), C = t.get(x, true), _ = d(t.box).find(`#grid_${t.name}_rec_` + (b != null ? w.escapeId(t.records[b].recid) : "none"));
        var n, o = Math.floor(c[0].clientHeight / t.recordHeight);
        let S = false, A = e.keyCode, P = e.shiftKey;
        switch (A) {
          case 8:
          case 46:
            t.delete(), S = true, e.stopPropagation();
            break;
          case 27:
            t.selectNone(), S = true;
            break;
          case 65:
            (e.metaKey || e.ctrlKey) && (t.selectAll(), S = true);
            break;
          case 13:
            if (this.selectType == "row" && t.show.expandColumn === true) {
              if (_.length <= 0) break;
              t.toggle(p, e), S = true;
            } else {
              for (let U = 0; U < this.columns.length; U++) if (this.getCellEditable(b, U)) {
                f.push(parseInt(U));
                break;
              }
              0 < (f = this.selectType == "row" && this.last._edit && this.last._edit.column ? [this.last._edit.column] : f).length && (t.editField(p, this.last.editColumn || f[0], null, e), S = true);
            }
            break;
          case 37:
            (function() {
              if (l) G();
              else {
                if (t.selectType == "row") {
                  if (_.length <= 0) return;
                  var U = t.records[b].w2ui || {};
                  !U || U.parent_recid == null || Array.isArray(U.children) && U.children.length !== 0 && U.expanded ? t.collapse(p, e) : (t.unselect(p), t.collapse(U.parent_recid, e), t.select(U.parent_recid));
                } else {
                  let B = t.prevCell(b, f[0]);
                  if (B = (B == null ? void 0 : B.index) != b ? null : B == null ? void 0 : B.colIndex, P || B != null || (t.selectNone(true), B = 0), B != null) if (P && t.multiSelect) {
                    if (W()) return;
                    var K = [], D = [], R = [];
                    if (f.indexOf(t.last.sel_col) === 0 && 1 < f.length) {
                      for (let Q = 0; Q < h.length; Q++) K.indexOf(h[Q].recid) == -1 && K.push(h[Q].recid), R.push({ recid: h[Q].recid, column: f[f.length - 1] });
                      t.unselect(R), t.scrollIntoView(b, f[f.length - 1], true);
                    } else {
                      for (let Q = 0; Q < h.length; Q++) K.indexOf(h[Q].recid) == -1 && K.push(h[Q].recid), D.push({ recid: h[Q].recid, column: B });
                      t.select(D), t.scrollIntoView(b, B, true);
                    }
                  } else t.click({ recid: p, column: B }, e), t.scrollIntoView(b, B, true);
                  else P || t.selectNone(true);
                }
                S = true;
              }
            })();
            break;
          case 39:
            (function() {
              if (l) G();
              else {
                if (t.selectType == "row") {
                  if (_.length <= 0) return;
                  t.expand(p, e);
                } else {
                  let R = t.nextCell(b, f[f.length - 1]);
                  if (R = R.index != b ? null : R.colIndex, P || R != null || (t.selectNone(true), R = t.columns.length - 1), R != null) if (P && A == 39 && t.multiSelect) {
                    if (W()) return;
                    var U = [], K = [], D = [];
                    if (f.indexOf(t.last.sel_col) == f.length - 1 && 1 < f.length) {
                      for (let B = 0; B < h.length; B++) U.indexOf(h[B].recid) == -1 && U.push(h[B].recid), D.push({ recid: h[B].recid, column: f[0] });
                      t.unselect(D), t.scrollIntoView(b, f[0], true);
                    } else {
                      for (let B = 0; B < h.length; B++) U.indexOf(h[B].recid) == -1 && U.push(h[B].recid), K.push({ recid: h[B].recid, column: R });
                      t.select(K), t.scrollIntoView(b, R, true);
                    }
                  } else t.click({ recid: p, column: R }, e), t.scrollIntoView(b, R, true);
                  else P || t.selectNone(true);
                }
                S = true;
              }
            })();
            break;
          case 33:
            X(o);
            break;
          case 34:
            q(o);
            break;
          case 35:
            q(-1);
            break;
          case 36:
            X(-1);
            break;
          case 38:
            X(e.metaKey || e.ctrlKey ? -1 : 1);
            break;
          case 40:
            q(e.metaKey || e.ctrlKey ? -1 : 1);
            break;
          case 17:
          case 91:
            l || w.isSafari && (t.last.copy_event = t.copy(false, e), (n = d(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), n[0].select());
            break;
          case 67:
            (e.metaKey || e.ctrlKey) && (w.isSafari || (t.last.copy_event = t.copy(false, e), (n = d(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), n[0].select()), t.copy(t.last.copy_event, e));
            break;
          case 88:
            l || (e.ctrlKey || e.metaKey) && (w.isSafari || (t.last.copy_event = t.copy(false, e), (n = d(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), n[0].select()), t.copy(t.last.copy_event, e));
        }
        var a = [32, 187, 189, 192, 219, 220, 221, 186, 222, 188, 190, 191];
        for (let U = 48; U <= 111; U++) a.push(U);
        a.indexOf(A) == -1 || e.ctrlKey || e.metaKey || S || (f.length === 0 && f.push(0), S = false, setTimeout(() => {
          var U = d(t.box).find("#grid_" + t.name + "_focus"), K = U.val();
          U.val(""), t.editField(p, f[0], K, e);
        }, 1)), S && e.preventDefault && e.preventDefault(), i.finish();
      }
    }
  }
  scrollIntoView(e, t, s, i) {
    let n = this.records.length;
    if ((n = this.searchData.length == 0 || this.url ? n : this.last.searchIds.length) !== 0) {
      if (e == null) {
        var o = this.getSelection();
        if (o.length === 0) return;
        w.isPlainObject(o[0]) ? (e = o[0].index, t = o[0].column) : e = this.get(o[0], true);
      }
      var o = d(this.box).find(`#grid_${this.name}_records`), a = o[0].clientWidth, l = o[0].clientHeight, c = o[0].scrollTop, h = o[0].scrollLeft, p = this.last.searchIds.length;
      if (0 < p && (e = this.last.searchIds.indexOf(e)), o.css({ "scroll-behavior": s ? "auto" : "smooth" }), l < this.recordHeight * (0 < p ? p : n) && 0 < o.length && (p = (s = Math.floor(c / this.recordHeight)) + Math.floor(l / this.recordHeight), e == s && o.prop("scrollTop", c - l / 1.3), e == p && o.prop("scrollTop", c + l / 1.3), (e < s || p < e) && o.prop("scrollTop", (e - 1) * this.recordHeight), i === true) && o.prop("scrollTop", e * this.recordHeight), t != null) {
        let x = 0, b = 0;
        c = w.scrollBarSize();
        for (let C = 0; C <= t; C++) {
          var f = this.columns[C];
          f.frozen || f.hidden || (x = b, b += parseInt(f.sizeCalculated));
        }
        a < b - h ? o.prop("scrollLeft", x - c) : x < h && o.prop("scrollLeft", b - a + 2 * c);
      }
    }
  }
  scrollToColumn(e) {
    if (e != null) {
      let s = 0, i = false;
      for (let n = 0; n < this.columns.length; n++) {
        var t = this.columns[n];
        if (t.field == e) {
          i = true;
          break;
        }
        t.frozen || t.hidden || (t = parseInt(t.sizeCalculated || t.size), s += t);
      }
      i && (this.last.scrollLeft = s + 1, this.scroll());
    }
  }
  dblClick(e, t) {
    let s = null;
    if (typeof e == "object" && e !== null && (s = e.column, e = e.recid), t == null && (t = {}), s == null && t.target) {
      let a = t.target;
      a.tagName.toUpperCase() != "TD" && (a = d(a).closest("td")[0]), s = parseInt(d(a).attr("col"));
    }
    var i = this.get(e, true), n = this.records[i], o = this.trigger("dblClick", { target: this.name, recid: e, column: s, originalEvent: t });
    o.isCancelled !== true && (this.selectNone(true), this.getCellEditable(i, s) ? this.editField(e, s, null, t) : (this.select({ recid: e, column: s }), (this.show.expandColumn || n && n.w2ui && Array.isArray(n.w2ui.children)) && this.toggle(e)), o.finish());
  }
  showContextMenu(e, t, s) {
    if (this.last.userSelect != "text") {
      (s = s ?? { offsetX: 0, offsetY: 0, target: d(this.box).find(`#grid_${this.name}_rec_` + e)[0] }).offsetX == null && (s.offsetX = s.layerX - s.target.offsetLeft, s.offsetY = s.layerY - s.target.offsetTop), w.isFloat(e) && (e = parseFloat(e));
      var i = this.getSelection();
      if (this.selectType == "row") i.indexOf(e) == -1 && this.click(e);
      else {
        let o = false;
        for (let a = 0; a < i.length; a++) i[a].recid != e && i[a].column != t || (o = true);
        o || e == null || this.click({ recid: e, column: t }), o || t == null || this.columnClick(this.columns[t].field, s);
      }
      var n = this.trigger("contextMenu", { target: this.name, originalEvent: s, recid: e, column: t });
      n.isCancelled !== true && (0 < this.contextMenu.length && (Jt.show({ anchor: document.body, originalEvent: s, items: this.contextMenu }).select((o) => {
        clearTimeout(this.last.kbd_timer), this.contextMenuClick(e, t, o);
      }), clearTimeout(this.last.kbd_timer)), s.preventDefault(), n.finish());
    }
  }
  contextMenuClick(e, t, s) {
    e = this.trigger("contextMenuClick", { target: this.name, recid: e, column: t, originalEvent: s.detail.originalEvent, menuEvent: s, menuIndex: s.detail.index, menuItem: s.detail.item }), e.isCancelled !== true && e.finish();
  }
  toggle(e) {
    var t = this.get(e);
    if (t != null) return t.w2ui = t.w2ui ?? {}, t.w2ui.expanded === true ? this.collapse(e) : this.expand(e);
  }
  expand(e, t) {
    var _a2;
    var s = this.get(e, true);
    let i = this.records[s];
    i.w2ui = i.w2ui ?? {};
    var n = w.escapeId(e), o = i.w2ui.children;
    let a;
    if (Array.isArray(o)) {
      if (i.w2ui.expanded === true || o.length === 0 || (a = this.trigger("expand", { target: this.name, recid: e })).isCancelled === true) return false;
      i.w2ui.expanded = true, o.forEach((l) => {
        l.w2ui = l.w2ui ?? {}, l.w2ui.parent_recid = i.recid, l.w2ui.children == null && (l.w2ui.children = []);
      }), this.records.splice.apply(this.records, [s + 1, 0].concat(o)), this.total !== -1 && (this.total += o.length), (typeof this.url != "object" ? this.url : this.url.get) || (this.localSort(true, true), 0 < this.searchData.length && this.localSearch(true)), t !== true && this.refresh(), a.finish();
    } else {
      if (0 < d(this.box).find("#grid_" + this.name + "_rec_" + n + "_expanded_row").length || this.show.expandColumn !== true || i.w2ui.expanded == "none") return false;
      if (d(this.box).find("#grid_" + this.name + "_rec_" + n).after(`<tr id="grid_${this.name}_rec_${e}_expanded_row" class="w2ui-expanded-row">
                    <td colspan="100" class="w2ui-expanded2">
                        <div id="grid_${this.name}_rec_${e}_expanded"></div>
                    </td>
                    <td class="w2ui-grid-data-last"></td>
                </tr>`), d(this.box).find("#grid_" + this.name + "_frec_" + n).after(`<tr id="grid_${this.name}_frec_${e}_expanded_row" class="w2ui-expanded-row">
                    ${this.show.lineNumbers ? '<td class="w2ui-col-number"></td>' : ""}
                    <td class="w2ui-grid-data w2ui-expanded1" colspan="100">
                       <div id="grid_${this.name}_frec_${e}_expanded"></div>
                    </td>
                </tr>`), (a = this.trigger("expand", { target: this.name, recid: e, box_id: "grid_" + this.name + "_rec_" + e + "_expanded", fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded" })).isCancelled === true) return d(this.box).find("#grid_" + this.name + "_rec_" + n + "_expanded_row").remove(), d(this.box).find("#grid_" + this.name + "_frec_" + n + "_expanded_row").remove(), false;
      s = d(this.box).find("#grid_" + this.name + "_rec_" + e + "_expanded"), o = d(this.box).find("#grid_" + this.name + "_frec_" + e + "_expanded"), t = ((_a2 = s.find(":scope div:first-child")[0]) == null ? void 0 : _a2.clientHeight) ?? 50, s[0].clientHeight < t && s.css({ height: t + "px" }), o[0].clientHeight < t && o.css({ height: t + "px" }), d(this.box).find("#grid_" + this.name + "_rec_" + n).attr("expanded", "yes").addClass("w2ui-expanded"), d(this.box).find("#grid_" + this.name + "_frec_" + n).attr("expanded", "yes").addClass("w2ui-expanded"), d(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("-"), i.w2ui.expanded = true, a.finish(), this.resizeRecords();
    }
    return true;
  }
  collapse(e, t) {
    var s = this.get(e, true);
    let i = this.records[s], n = (i.w2ui = i.w2ui || {}, w.escapeId(e));
    var o = i.w2ui.children;
    let a;
    if (Array.isArray(o)) {
      if (i.w2ui.expanded !== true || (a = this.trigger("collapse", { target: this.name, recid: e })).isCancelled === true) return false;
      (function h(p) {
        p.w2ui.expanded = false;
        for (let f = 0; f < p.w2ui.children.length; f++) {
          let x = p.w2ui.children[f];
          x.w2ui.expanded && h(x);
        }
      })(i);
      var l = [];
      for (let h = i; h != null; h = this.get(h.w2ui.parent_recid)) l.push(h.w2ui.parent_recid);
      o = s + 1;
      let c = o;
      for (; !(this.records.length <= c + 1 || this.records[c + 1].w2ui == null || 0 <= l.indexOf(this.records[c + 1].w2ui.parent_recid)); ) c++;
      this.records.splice(o, c - o + 1), this.total !== -1 && (this.total -= c - o + 1), (typeof this.url != "object" ? this.url : this.url.get) || 0 < this.searchData.length && this.localSearch(true), t !== true && this.refresh(), a.finish();
    } else {
      if (d(this.box).find("#grid_" + this.name + "_rec_" + n + "_expanded_row").length === 0 || this.show.expandColumn !== true || (a = this.trigger("collapse", { target: this.name, recid: e, box_id: "grid_" + this.name + "_rec_" + e + "_expanded", fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded" })).isCancelled === true) return false;
      d(this.box).find("#grid_" + this.name + "_rec_" + n).removeAttr("expanded").removeClass("w2ui-expanded"), d(this.box).find("#grid_" + this.name + "_frec_" + n).removeAttr("expanded").removeClass("w2ui-expanded"), d(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("+"), d(this.box).find("#grid_" + this.name + "_rec_" + n + "_expanded").css("height", "0px"), d(this.box).find("#grid_" + this.name + "_frec_" + n + "_expanded").css("height", "0px"), setTimeout(() => {
        d(this.box).find("#grid_" + this.name + "_rec_" + n + "_expanded_row").remove(), d(this.box).find("#grid_" + this.name + "_frec_" + n + "_expanded_row").remove(), i.w2ui.expanded = false, a.finish(), this.resizeRecords();
      }, 300);
    }
    return true;
  }
  sort(e, t, s) {
    var i = this.trigger("sort", { target: this.name, field: e, direction: t, multiField: s });
    if (i.isCancelled !== true) {
      if (e != null) {
        let n = this.sortData.length;
        for (let o = 0; o < this.sortData.length; o++) if (this.sortData[o].field == e) {
          n = o;
          break;
        }
        t == null && (t = this.sortData[n] != null && (this.sortData[n].direction == null && (this.sortData[n].direction = ""), this.sortData[n].direction.toLowerCase() === "asc") ? "desc" : "asc"), this.multiSort === false && (this.sortData = [], n = 0), s != 1 && (this.sortData = [], n = 0), this.sortData[n] == null && (this.sortData[n] = {}), this.sortData[n].field = e, this.sortData[n].direction = t;
      } else this.sortData = [];
      (typeof this.url != "object" ? this.url : this.url.get) ? (i.finish({ direction: t }), this.last.fetch.offset = 0, this.reload()) : (this.localSort(false, true), 0 < this.searchData.length && this.localSearch(true), this.last.scrollTop = 0, d(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), i.finish({ direction: t }), this.refresh());
    }
  }
  copy(e, t) {
    if (w.isPlainObject(e)) return e.finish(), e.text;
    var s = this.getSelection();
    if (s.length === 0) return "";
    let i = "";
    if (typeof s[0] == "object") {
      let h = s[0].column, p = s[0].column;
      var n = [];
      for (let f = 0; f < s.length; f++) s[f].column < h && (h = s[f].column), s[f].column > p && (p = s[f].column), n.indexOf(s[f].index) == -1 && n.push(s[f].index);
      n.sort((f, x) => f - x);
      for (let f = 0; f < n.length; f++) {
        var o = n[f];
        for (let x = h; x <= p; x++) this.columns[x].hidden !== true && (i += this.getCellCopy(o, x) + "	");
        i = i.substr(0, i.length - 1), i += `
`;
      }
    } else {
      for (let h = 0; h < this.columns.length; h++) {
        var a = this.columns[h];
        if (a.hidden !== true) {
          let p = a.text || a.field;
          a.text && a.text.length < 3 && a.tooltip && (p = a.tooltip), i += '"' + w.stripTags(p) + '"	';
        }
      }
      i = i.substr(0, i.length - 1), i += `
`;
      for (let h = 0; h < s.length; h++) {
        var l = this.get(s[h], true);
        for (let p = 0; p < this.columns.length; p++) this.columns[p].hidden !== true && (i += '"' + this.getCellCopy(l, p) + '"	');
        i = i.substr(0, i.length - 1), i += `
`;
      }
    }
    i = i.substr(0, i.length - 1);
    let c;
    return e == null ? (c = this.trigger("copy", { target: this.name, text: i, cut: t.keyCode == 88, originalEvent: t })).isCancelled === true ? "" : (i = c.detail.text, c.finish(), i) : e === false ? (c = this.trigger("copy", { target: this.name, text: i, cut: t.keyCode == 88, originalEvent: t })).isCancelled === true ? "" : (i = c.detail.text, c) : void 0;
  }
  getCellCopy(e, t) {
    return w.stripTags(this.getCellHTML(e, t));
  }
  paste(e, c) {
    var s = this.getSelection();
    let i = this.get(s[0].recid, true);
    var n, o, a, l = s[0].column, c = this.trigger("paste", { target: this.name, text: e, index: i, column: l, originalEvent: c });
    if (c.isCancelled !== true) {
      if (e = c.detail.text, this.selectType == "row" || s.length === 0) console.log("ERROR: You can paste only if grid.selectType = 'cell' and when at least one cell selected.");
      else {
        if (typeof e != "object") {
          var h = [];
          e = e.split(`
`);
          for (let b = 0; b < e.length; b++) {
            var p = e[b].split("	");
            let C = 0;
            var f = this.records[i], x = [];
            if (f != null) {
              for (let _ = 0; _ < p.length; _++) this.columns[l + C] && (n = f, o = this.columns[l + C].field, a = p[_], n.w2ui = n.w2ui ?? {}, n.w2ui.changes = n.w2ui.changes || {}, n.w2ui.changes[o] = a, x.push(l + C), C++);
              for (let _ = 0; _ < x.length; _++) h.push({ recid: f.recid, column: x[_] });
              i++;
            }
          }
          this.selectNone(true), this.select(h);
        } else this.selectNone(true), this.select([{ recid: this.records[i], column: l }]);
        this.refresh();
      }
      c.finish();
    }
  }
  resize() {
    var e = Date.now();
    if (this.box && d(this.box).attr("name") == this.name) {
      var t = this.trigger("resize", { target: this.name });
      if (t.isCancelled !== true) return this.resizeBoxes(), this.resizeRecords(), t.finish(), Date.now() - e;
    }
  }
  update({ cells: e, fullCellRefresh: t, ignoreColumns: s } = {}) {
    var i = Date.now();
    let n = this;
    if (this.box == null) return 0;
    if (Array.isArray(e)) for (let p = 0; p < e.length; p++) {
      var o = e[p].index, a = e[p].column;
      if (!(o < 0)) if (o == null || a == null) console.log("ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]");
      else {
        var l = this.records[o] ?? {};
        l.w2ui = l.w2ui ?? {}, l.w2ui._update = l.w2ui._update ?? { cells: [] };
        let f = l.w2ui._update.row1, x = l.w2ui._update.row2;
        f != null && f.isConnected && x != null && x.isColSelected || (f = this.box.querySelector(`#grid_${this.name}_rec_` + w.escapeId(l.recid)), x = this.box.querySelector(`#grid_${this.name}_frec_` + w.escapeId(l.recid)), l.w2ui._update.row1 = f, l.w2ui._update.row2 = x), h(l, f, x, o, a);
      }
    }
    else for (let p = this.last.range_start - 1; p <= this.last.range_end; p++) {
      let f = p;
      f = 0 < this.last.searchIds.length ? this.last.searchIds[p] : p;
      var c = this.records[f];
      if (!(f < 0 || c == null)) {
        c.w2ui = c.w2ui ?? {}, c.w2ui._update = c.w2ui._update ?? { cells: [] };
        let x = c.w2ui._update.row1, b = c.w2ui._update.row2;
        x != null && x.isConnected && b != null && b.isColSelected || (x = this.box.querySelector(`#grid_${this.name}_rec_` + w.escapeId(c.recid)), b = this.box.querySelector(`#grid_${this.name}_frec_` + w.escapeId(c.recid)), c.w2ui._update.row1 = x, c.w2ui._update.row2 = b);
        for (let C = 0; C < this.columns.length; C++) h(c, x, b, f, C);
      }
    }
    return Date.now() - i;
    function h(p, f, x, b, C) {
      var _ = n.columns[C];
      if (!Array.isArray(s) || !s.includes(C) && !s.includes(_.field)) {
        let X = p.w2ui._update.cells[C];
        if (X != null && X.isConnected || (X = n.box.querySelector(`#grid_${n.name}_data_${b}_` + C), p.w2ui._update.cells[C] = X), X != null) {
          if (t) d(X).replace(n.getCellHTML(b, C, false)), X = n.box.querySelector(`#grid_${n.name}_data_${b}_` + C), p.w2ui._update.cells[C] = X;
          else {
            var S = X.children[0], { value: b, style: A, className: P } = n.getCellValue(b, C, false, true);
            if (S.innerHTML != b && (S.innerHTML = b), A != "" && X.style.cssText != A && (X.style.cssText = A), P != "") {
              let G = ["w2ui-grid-data"], W = [];
              S = P.split(" ").filter((U) => !!U), X.classList.forEach((U) => {
                G.includes(U) || W.push(U);
              }), X.classList.remove(...W), X.classList.add(...S);
            }
          }
          if (n.columns[C].style && n.columns[C].style != X.style.cssText && (X.style.cssText = n.columns[C].style ?? ""), p.w2ui.class != null) {
            if (typeof p.w2ui.class == "string") {
              let q = ["w2ui-odd", "w2ui-even", "w2ui-record"], G = [];
              b = p.w2ui.class.split(" ").filter((W) => !!W), f && x && (f.classList.forEach((W) => {
                q.includes(W) || G.push(W);
              }), f.classList.remove(...G), f.classList.add(...b), x.classList.remove(...G), x.classList.add(...b));
            }
            if (w.isPlainObject(p.w2ui.class) && typeof p.w2ui.class[_.field] == "string") {
              let q = ["w2ui-grid-data"], G = [];
              A = p.w2ui.class[_.field].split(" ").filter((W) => !!W), X.classList.forEach((W) => {
                q.includes(W) || G.push(W);
              }), X.classList.remove(...G), X.classList.add(...A);
            }
          }
          p.w2ui.style != null && (f && x && typeof p.w2ui.style == "string" && f.style.cssText !== p.w2ui.style && (f.style.cssText = "height: " + n.recordHeight + "px;" + p.w2ui.style, f.setAttribute("custom_style", p.w2ui.style), x.style.cssText = "height: " + n.recordHeight + "px;" + p.w2ui.style, x.setAttribute("custom_style", p.w2ui.style)), w.isPlainObject(p.w2ui.style)) && typeof p.w2ui.style[_.field] == "string" && X.style.cssText !== p.w2ui.style[_.field] && (X.style.cssText = p.w2ui.style[_.field]);
        }
      }
    }
  }
  refreshCell(n, i) {
    var s = this.get(n, true), i = this.getColumn(i, true), n = !this.records[s] || this.records[s].recid != n, o = d(this.box).find(`${n ? ".w2ui-grid-summary " : ""}#grid_${this.name}_data_${s}_` + i);
    return o.length != 0 && (o.replace(this.getCellHTML(s, i, n)), true);
  }
  refreshRow(e, t = null) {
    let s = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(e)), i = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(e));
    if (0 < s.length) {
      t == null && (t = this.get(e, true));
      var n = s.attr("line"), o = !this.records[t] || this.records[t].recid != e, a = typeof this.url != "object" ? this.url : this.url.get;
      if (0 < this.searchData.length && !a) for (let c = 0; c < this.last.searchIds.length; c++) this.last.searchIds[c] == t && (t = c);
      a = this.getRecordHTML(t, n, o), s.replace(a[0]), i.replace(a[1]);
      let l = this.records[t].w2ui ? this.records[t].w2ui.style : "";
      return typeof l == "string" && (s = d(this.box).find("#grid_" + this.name + "_frec_" + w.escapeId(e)), i = d(this.box).find("#grid_" + this.name + "_rec_" + w.escapeId(e)), s.attr("custom_style", l), i.attr("custom_style", l), s.hasClass("w2ui-selected") && (l = l.replace("background-color", "none")), s[0].style.cssText = "height: " + this.recordHeight + "px;" + l, i[0].style.cssText = "height: " + this.recordHeight + "px;" + l), o && this.resize(), true;
    }
    return false;
  }
  refresh() {
    var e = Date.now(), t = typeof this.url != "object" ? this.url : this.url.get;
    if (this.total <= 0 && !t && this.searchData.length === 0 && (this.total = this.records.length), this.box && (t = this.trigger("refresh", { target: this.name }), t.isCancelled !== true)) {
      this.show.header ? d(this.box).find(`#grid_${this.name}_header`).html(w.lang(this.header) + "&#160;").show() : d(this.box).find(`#grid_${this.name}_header`).hide(), this.show.toolbar ? d(this.box).find("#grid_" + this.name + "_toolbar").show() : d(this.box).find("#grid_" + this.name + "_toolbar").hide(), this.searchClose();
      var s = d(this.box).find("#grid_" + this.name + "_search_all");
      !this.multiSearch && this.last.field == "all" && 0 < this.searches.length && (this.last.field = this.searches[0].field, this.last.label = this.searches[0].label);
      for (let a = 0; a < this.searches.length; a++) this.searches[a].field == this.last.field && (this.last.label = this.searches[a].label);
      if (this.last.multi ? s.attr("placeholder", "[" + w.lang("Multiple Fields") + "]") : s.attr("placeholder", w.lang("Search") + " " + w.lang(this.last.label, true)), s.val() != this.last.search) {
        let a = this.last.search;
        var i = s._w2field;
        i && (a = i.format(a)), s.val(a);
      }
      this.refreshSearch(), this.refreshBody(), this.show.footer ? d(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()).show() : d(this.box).find(`#grid_${this.name}_footer`).hide();
      var i = this.last.selection, s = 0 < this.records.length && i.indexes.length == this.records.length, i = 0 < i.indexes.length && this.searchData.length !== 0 && i.indexes.length == this.last.searchIds.length, n = (s || i ? d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : d(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.find({ "w2ui.expanded": true }, true, true));
      for (let a = 0; a < n.length; a++) {
        var o = this.records[n[a]].w2ui;
        o && !Array.isArray(o.children) && (o.expanded = false);
      }
      return this.markSearch && setTimeout(() => {
        var a = [];
        for (let h = 0; h < this.searchData.length; h++) {
          var l = this.searchData[h], c = this.getSearch(l.field);
          c && !c.hidden && (c = this.getColumn(l.field, true), a.push({ field: l.field, search: l.value, col: c }));
        }
        0 < a.length && a.forEach((h) => {
          var p = d(this.box).find('td[col="' + h.col + '"]:not(.w2ui-head)');
          w.marker(p, h.search);
        });
      }, 50), this.updateToolbar(this.last.selection), t.finish(), this.resize(), this.addRange("selection"), setTimeout(() => {
        this.resize(), this.scroll();
      }, 1), this.reorderColumns && !this.last.columnDrag ? this.last.columnDrag = this.initColumnDrag() : !this.reorderColumns && this.last.columnDrag && this.last.columnDrag.remove(), Date.now() - e;
    }
  }
  refreshSearch() {
    if (this.multiSearch && 0 < this.searchData.length) {
      d(this.box).find(".w2ui-grid-searches").length == 0 && d(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + 35 + "px").append(`<div id="grid_${this.name}_searches" class="w2ui-grid-searches"></div>`);
      let e = `
                <span id="grid_${this.name}_search_logic" class="w2ui-grid-search-logic"></span>
                <div class="grid-search-line"></div>`;
      this.searchData.forEach((t, s) => {
        var i = this.getSearch(t.field, true), n = this.searches[i];
        let o;
        if (o = Array.isArray(t.value) ? `<span class="grid-search-count">${t.value.length}</span>` : n && n.type == "list" && t.text && t.text !== t.value ? ": " + t.text : ": " + t.value, n && n.type == "date") if (t.operator == "between") {
          let a = t.value[0], l = t.value[1];
          Number(a) === a && (a = w.formatDate(a)), Number(l) === l && (l = w.formatDate(l)), o = `: ${a} - ` + l;
        } else {
          let a = t.value, l = (Number(a) == a && (a = w.formatDate(a)), t.operator);
          (l = (l = l == "more" ? "since" : l) == "less" ? "before" : l).substr(0, 5) == "more:" && (l = "since"), o = `: ${l} ` + a;
        }
        e += `<span class="w2ui-action" data-click="searchFieldTooltip|${i}|${s}|this">
                    ${n ? n.label : ""}
                    ${o}
                    <span class="icon-chevron-down"></span>
                </span>`;
      }), e += `
                ${this.show.searchSave ? `<div class="grid-search-line"></div>
                       <button class="w2ui-btn grid-search-btn" data-click="searchSave">${w.lang("Save")}</button>
                      ` : ""}
                <button class="w2ui-btn grid-search-btn btn-remove"
                    data-click="searchReset">X</button>
            `, d(this.box).find(`#grid_${this.name}_searches`).html(e), d(this.box).find(`#grid_${this.name}_search_logic`).html(w.lang(this.last.logic == "AND" ? "All" : "Any"));
    } else d(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + "px").find(".w2ui-grid-searches").remove();
    this.searchSelected ? (d(this.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), d(this.box).find(`#grid_${this.name}_search_name`).show().find(".name-text").html(this.searchSelected.text)) : (d(this.box).find(`#grid_${this.name}_search_all`).prop("readOnly", false), d(this.box).find(`#grid_${this.name}_search_name`).hide().find(".name-text").html("")), w.bindEvents(d(this.box).find(`#grid_${this.name}_searches .w2ui-action, #grid_${this.name}_searches button`), this);
  }
  refreshBody() {
    this.scroll();
    var t = this.getRecordsHTML(), e = this.getColumnsHTML(), t = '<div id="grid_' + this.name + '_frecords" class="w2ui-grid-frecords" style="margin-bottom: ' + (w.scrollBarSize() - 1) + 'px;">' + t[0] + '</div><div id="grid_' + this.name + '_records" class="w2ui-grid-records">' + t[1] + '</div><div id="grid_' + this.name + '_scroll1" class="w2ui-grid-scroll1" style="height: ' + w.scrollBarSize() + 'px"></div><div id="grid_' + this.name + '_fcolumns" class="w2ui-grid-fcolumns">    <table><tbody>' + e[0] + '</tbody></table></div><div id="grid_' + this.name + '_columns" class="w2ui-grid-columns">    <table><tbody>' + e[1] + `</tbody></table></div><div class="w2ui-intersection-marker" style="display: none; height: ${this.recordHeight - 5}px">
               <div class="top-marker"></div>
               <div class="bottom-marker"></div>
            </div>`;
    let s = d(this.box).find(`#grid_${this.name}_body`, this.box).html(t);
    e = d(this.box).find(`#grid_${this.name}_records`, this.box), t = d(this.box).find(`#grid_${this.name}_frecords`, this.box), this.selectType == "row" && (e.on("mouseover mouseout", { delegate: "tr" }, (i) => {
      var n = d(i.delegate).attr("recid");
      d(this.box).find(`#grid_${this.name}_frec_` + w.escapeId(n)).toggleClass("w2ui-record-hover", i.type == "mouseover");
    }), t.on("mouseover mouseout", { delegate: "tr" }, (i) => {
      var n = d(i.delegate).attr("recid");
      d(this.box).find(`#grid_${this.name}_rec_` + w.escapeId(n)).toggleClass("w2ui-record-hover", i.type == "mouseover");
    })), w.isIOS ? e.append(t).on("click", { delegate: "tr" }, (i) => {
      var n = d(i.delegate).attr("recid");
      this.dblClick(n, i);
    }) : e.add(t).on("click", { delegate: "tr" }, (i) => {
      var n = d(i.delegate).attr("recid");
      n != "-none-" && this.click(n, i);
    }).on("contextmenu", { delegate: "tr" }, (i) => {
      var n = d(i.delegate).attr("recid"), o = d(i.target).closest("td"), o = parseInt(o.attr("col") ?? -1);
      this.showContextMenu(n, o, i);
    }).on("mouseover", { delegate: "tr" }, (i) => {
      this.last.rec_out = false;
      let n = d(i.delegate).attr("index"), o = d(i.delegate).attr("recid");
      n !== this.last.rec_over && (this.last.rec_over = n, setTimeout(() => {
        delete this.last.rec_out, this.trigger("mouseEnter", { target: this.name, originalEvent: i, index: n, recid: o }).finish();
      }));
    }).on("mouseout", { delegate: "tr" }, (i) => {
      let n = d(i.delegate).attr("index"), o = d(i.delegate).attr("recid");
      this.last.rec_out = true, setTimeout(() => {
        let a = () => {
          this.trigger("mouseLeave", { target: this.name, originalEvent: i, index: n, recid: o }).finish();
        };
        n !== this.last.rec_over && a(), setTimeout(() => {
          this.last.rec_out && (delete this.last.rec_out, delete this.last.rec_over, a());
        });
      });
    }), s.data("scroll", { lastDelta: 0, lastTime: 0 }).find(".w2ui-grid-frecords").on("mousewheel DOMMouseScroll ", (a) => {
      a.preventDefault();
      var n = s.data("scroll"), o = s.find(".w2ui-grid-records"), a = typeof a.wheelDelta != null ? -a.wheelDelta : a.detail || a.deltaY, l = o.prop("scrollTop");
      n.lastDelta += a, a = Math.round(n.lastDelta), s.data("scroll", n), o.get(0).scroll({ top: l + a, behavior: "smooth" });
    }), e.off(".body-global").on("scroll.body-global", { delegate: ".w2ui-grid-records" }, (i) => {
      this.scroll(i);
    }), d(this.box).find(".w2ui-grid-body").off(".body-global").on("click.body-global dblclick.body-global contextmenu.body-global", { delegate: "td.w2ui-head" }, (i) => {
      var n = d(i.delegate).attr("col"), o = this.columns[n] ?? { field: n };
      switch (i.type) {
        case "click":
          this.columnClick(o.field, i);
          break;
        case "dblclick":
          this.columnDblClick(o.field, i);
          break;
        case "contextmenu":
          this.columnContextMenu(o.field, i);
      }
    }).on("mouseover.body-global", { delegate: ".w2ui-col-header" }, (i) => {
      let n = d(i.delegate).parent().attr("col");
      this.columnTooltipShow(n, i), d(i.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
        this.columnTooltipHide(n, i);
      });
    }).on("click.body-global", { delegate: "input.w2ui-select-all" }, (i) => {
      i.delegate.checked ? this.selectAll() : this.selectNone(), i.stopPropagation(), clearTimeout(this.last.kbd_timer);
    }).on("click.body-global", { delegate: ".w2ui-show-children, .w2ui-col-expand" }, (i) => {
      i.stopPropagation(), this.toggle(d(i.target).parents("tr").attr("recid"));
    }).on("click.body-global mouseover.body-global", { delegate: ".w2ui-info" }, (i) => {
      var _a2, _b;
      var n = d(i.delegate).closest("td"), o = n.parent(), a = this.columns[n.attr("col")], l = o.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
      ["mouseenter", "mouseover"].includes((_b = (_a2 = a.info) == null ? void 0 : _a2.showOn) == null ? void 0 : _b.toLowerCase()) && i.type == "mouseover" ? this.showBubble(o.attr("index"), n.attr("col"), l).then(() => {
        d(i.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
          rt.hide(this.name + "-bubble");
        });
      }) : i.type == "click" && (rt.hide(this.name + "-bubble"), this.showBubble(o.attr("index"), n.attr("col"), l));
    }).on("mouseover.body-global", { delegate: ".w2ui-clipboard-copy" }, (i) => {
      if (!i.delegate._tooltipShow) {
        let o = d(i.delegate).parent(), a = o.parent();
        var n = this.columns[o.attr("col")];
        let l = a.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
        rt.show({ name: this.name + "-bubble", anchor: i.delegate, html: w.lang(typeof n.clipboardCopy == "string" ? n.clipboardCopy : "Copy to clipboard"), position: "top|bottom", offsetY: -2 }).hide((c) => {
          i.delegate._tooltipShow = false, d(i.delegate).off(".tooltip");
        }), d(i.delegate).off(".tooltip").on("mouseleave.tooltip", (c) => {
          rt.hide(this.name + "-bubble");
        }).on("click.tooltip", (c) => {
          c.stopPropagation(), rt.update(this.name + "-bubble", w.lang("Copied")), this.clipboardCopy(a.attr("index"), o.attr("col"), l);
        }), i.delegate._tooltipShow = true;
      }
    }).on("click.body-global", { delegate: ".w2ui-editable-checkbox" }, (i) => {
      var n = d(i.delegate).data();
      this.editChange.call(this, i.delegate, n.changeind, n.colind, i), this.updateToolbar();
    }), this.records.length === 0 && this.msgEmpty ? d(this.box).find(`#grid_${this.name}_body`).append(`<div id="grid_${this.name}_empty_msg" class="w2ui-grid-empty-msg"><div>${w.lang(this.msgEmpty)}</div></div>`) : 0 < d(this.box).find(`#grid_${this.name}_empty_msg`).length && d(this.box).find(`#grid_${this.name}_empty_msg`).remove(), 0 < this.summary.length ? (t = this.getSummaryHTML(), d(this.box).find(`#grid_${this.name}_fsummary`).html(t[0]).show(), d(this.box).find(`#grid_${this.name}_summary`).html(t[1]).show()) : (d(this.box).find(`#grid_${this.name}_fsummary`).hide(), d(this.box).find(`#grid_${this.name}_summary`).hide());
  }
  render(e) {
    var t = Date.now();
    let s = this;
    typeof e == "string" && (e = d(e).get(0));
    var i = this.trigger("render", { target: this.name, box: e ?? this.box });
    if (i.isCancelled !== true && (e != null && (0 < d(this.box).find(`#grid_${this.name}_body`).length && d(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), this.box = e), this.box)) {
      let a = function(h) {
        var _a2, _b;
        if (h.target.tagName) {
          var p = s.last.move;
          if (p && ["select", "select-column"].indexOf(p.type) != -1 && (p.divX = h.screenX - p.x, p.divY = h.screenY - p.y, !(Math.abs(p.divX) <= 1 && Math.abs(p.divY) <= 1))) if (s.last.cancelClick = true, s.reorderRows == 1 && s.last.move.reorder) {
            let q = d(h.target).parents("tr").attr("recid");
            (q = q == "-none-" ? "bottom" : q) != p.from && (x = d(s.box).find("#grid_" + s.name + "_rec_" + q), d(s.box).find(".insert-before"), x.addClass("insert-before"), p.lastY = h.screenY, p.to = q, x = { top: (_a2 = x.get(0)) == null ? void 0 : _a2.offsetTop, left: (_b = x.get(0)) == null ? void 0 : _b.offsetLeft }, d(s.box).find("#grid_" + s.name + "_ghost_line").css({ top: x.top + "px", left: p.pos.left + "px", "border-top": "2px solid #769EFC" })), d(s.box).find("#grid_" + s.name + "_ghost").css({ top: p.pos.top + p.divY + "px", left: p.pos.left + "px" });
          } else {
            p.start && p.recid && (s.selectNone(), p.start = false);
            var f = [], x = (h.target.tagName.toUpperCase() == "TR" ? d(h.target) : d(h.target).parents("tr")).attr("recid");
            if (x == null) {
              if (s.selectType != "row" && (!s.last.move || s.last.move.type != "select")) {
                var b = parseInt(d(h.target).parents("td").attr("col"));
                if (isNaN(b)) s.removeRange("column-selection"), d(s.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected"), d(s.box).find(".w2ui-col-number").removeClass("w2ui-row-selected"), delete p.colRange;
                else {
                  let q = b + "-" + b;
                  p.column < b && (q = p.column + "-" + b);
                  var C = [], _ = (q = p.column > b ? b + "-" + p.column : q).split("-");
                  for (let G = parseInt(_[0]); G <= parseInt(_[1]); G++) C.push(G);
                  if (p.colRange != q && (o = s.trigger("columnSelect", { target: s.name, columns: C })).isCancelled !== true) {
                    p.colRange == null && s.selectNone();
                    var S = q.split("-");
                    d(s.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected");
                    for (let G = parseInt(S[0]); G <= parseInt(S[1]); G++) d(s.box).find("#grid_" + s.name + "_column_" + G + " .w2ui-col-header").addClass("w2ui-col-selected");
                    d(s.box).find(".w2ui-col-number").not(".w2ui-head").addClass("w2ui-row-selected"), p.colRange = q, s.removeRange("column-selection"), s.addRange({ name: "column-selection", range: [{ recid: s.records[0].recid, column: S[0] }, { recid: s.records[s.records.length - 1].recid, column: S[1] }], style: "background-color: rgba(90, 145, 234, 0.1)" });
                  }
                }
              }
            } else {
              let q = s.get(p.recid, true);
              if (!(q == null || s.records[q] && s.records[q].recid != p.recid)) {
                let G = s.get(x, true);
                if (G != null) {
                  let W = parseInt(p.column), U = parseInt((h.target.tagName.toUpperCase() == "TD" ? d(h.target) : d(h.target).parents("td")).attr("col"));
                  isNaN(W) && isNaN(U) && (W = 0, U = s.columns.length - 1), q > G && (b = q, q = G, G = b);
                  var A, x = "ind1:" + q + ",ind2;" + G + ",col1:" + W + ",col2:" + U;
                  if (p.range != x) {
                    p.range = x;
                    for (let D = q; D <= G; D++) if (!(0 < s.last.searchIds.length && s.last.searchIds.indexOf(D) == -1)) if (s.selectType != "row") {
                      W > U && (A = W, W = U, U = A);
                      for (let R = W; R <= U; R++) s.columns[R].hidden || f.push({ recid: s.records[D].recid, column: parseInt(R) });
                    } else f.push(s.records[D].recid);
                    if (s.selectType != "row") {
                      var P = s.getSelection();
                      let D = [];
                      for (let R = 0; R < f.length; R++) {
                        let B = false;
                        for (let Q = 0; Q < P.length; Q++) f[R].recid == P[Q].recid && f[R].column == P[Q].column && (B = true);
                        B || D.push({ recid: f[R].recid, column: f[R].column });
                      }
                      s.select(D), D = [];
                      for (let R = 0; R < P.length; R++) {
                        let B = false;
                        for (let Q = 0; Q < f.length; Q++) f[Q].recid == P[R].recid && f[Q].column == P[R].column && (B = true);
                        B || D.push({ recid: P[R].recid, column: P[R].column });
                      }
                      s.unselect(D);
                    } else if (s.multiSelect) {
                      var X = s.getSelection();
                      for (let D = 0; D < f.length; D++) X.indexOf(f[D]) == -1 && s.select(f[D]);
                      for (let D = 0; D < X.length; D++) f.indexOf(X[D]) == -1 && s.unselect(X[D]);
                    }
                  }
                }
              }
            }
          }
        }
      }, l = function(h) {
        var p = s.last.move;
        if (setTimeout(() => {
          delete s.last.cancelClick;
        }, 1), !d(h.target).parents().hasClass(".w2ui-head") && !d(h.target).hasClass(".w2ui-head")) {
          if (p && ["select", "select-column"].indexOf(p.type) != -1) {
            if (p.colRange != null && o.isCancelled !== true) {
              var f = p.colRange.split("-"), x = [];
              for (let _ = 0; _ < s.records.length; _++) {
                var b = [];
                for (let S = parseInt(f[0]); S <= parseInt(f[1]); S++) b.push(S);
                x.push({ recid: s.records[_].recid, column: b });
              }
              s.removeRange("column-selection"), o.finish(), s.select(x);
            }
            if (s.reorderRows == 1 && s.last.move.reorder) if (p.to != null) {
              if (h = s.trigger("reorderRow", { target: s.name, recid: p.from, moveBefore: p.to }), h.isCancelled === true) return c(), void delete s.last.move;
              var C = s.get(p.from, true);
              let _ = s.get(p.to, true);
              p.to == "bottom" && (_ = s.records.length), p = s.records[C], C != null && _ != null && (s.records.splice(C, 1), C > _ ? s.records.splice(_, 0, p) : s.records.splice(_ - 1, 0, p)), s.sortData = [], d(s.box).find(`#grid_${s.name}_columns .w2ui-col-header`).removeClass("w2ui-col-sorted"), c(), h.finish();
            } else c();
          }
          delete s.last.move, d(document).off(".w2ui-" + s.name);
        }
      }, c = function() {
        d(s.box).find(`#grid_${s.name}_ghost`).remove(), d(s.box).find(`#grid_${s.name}_ghost_line`).remove(), s.refresh(), delete s.last.move;
      };
      if (e = typeof this.url != "object" ? this.url : this.url.get, this.reset(true), !this.last.field) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields";
      else {
        let h = 0;
        for (; h < this.searches.length && (this.searches[h].hidden || this.searches[h].simple === false); ) h++;
        h >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[h].field, this.last.label = this.searches[h].label);
      }
      if (d(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-grid w2ui-inactive").html('<div class="w2ui-grid-box">    <div id="grid_' + this.name + '_header" class="w2ui-grid-header"></div>    <div id="grid_' + this.name + '_toolbar" class="w2ui-grid-toolbar"></div>    <div id="grid_' + this.name + '_body" class="w2ui-grid-body"></div>    <div id="grid_' + this.name + '_fsummary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_summary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_footer" class="w2ui-grid-footer"></div>    <textarea id="grid_' + this.name + '_focus" class="w2ui-grid-focus-input" ' + (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : "") + (w.isIOS ? "readonly" : "") + "></textarea></div>"), this.selectType != "row" && d(this.box).addClass("w2ui-ss"), 0 < d(this.box).length && (d(this.box)[0].style.cssText += this.style), this.initToolbar(), this.toolbar != null && this.toolbar.render(d(this.box).find("#grid_" + this.name + "_toolbar")[0]), this.last.toolbar_height = d(this.box).find(`#grid_${this.name}_toolbar`).prop("offsetHeight"), this.last.field && this.last.field != "all") {
        let h = this.searchData;
        setTimeout(() => {
          this.searchInitInput(this.last.field, h.length == 1 ? h[0].value : null);
        }, 1);
      }
      d(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()), this.last.state || (this.last.state = this.stateSave(true)), this.stateRestore(), e && (this.clear(), this.refresh());
      let n = false;
      for (let h = 0; h < this.searches.length; h++) if (this.searches[h].hidden) {
        n = true;
        break;
      }
      n ? (this.searchReset(false), e || setTimeout(() => {
        this.searchReset();
      }, 1)) : this.reload(), d(this.box).find(`#grid_${this.name}_focus`).on("focus", (h) => {
        clearTimeout(this.last.kbd_timer), this.hasFocus || this.focus();
      }).on("blur", (h) => {
        clearTimeout(this.last.kbd_timer), this.last.kbd_timer = setTimeout(() => {
          this.hasFocus && this.blur();
        }, 100);
      }).on("paste", (h) => {
        var p = h.clipboardData || null;
        if (p) {
          let b = p.items, C = [];
          for (var f in b = b.length == 2 && (b = b.length == 2 && b[1].kind == "file" ? [b[1]] : b).length == 2 && b[0].type == "text/plain" && b[1].type == "text/html" ? [b[1]] : b) if (f = b[f], f.kind === "file") {
            var x = f.getAsFile();
            C.push({ kind: "file", data: x });
          } else if (f.kind === "string" && (f.type === "text/plain" || f.type === "text/html")) {
            h.preventDefault();
            let _ = p.getData("text/plain");
            _.indexOf("\r") != -1 && _.indexOf(`
`) == -1 && (_ = _.replace(/\r/g, `
`)), C.push({ kind: f.type == "text/html" ? "html" : "text", data: _ });
          }
          C.length === 1 && C[0].kind != "file" && (C = C[0].data), Os[this.name].paste(C, h), h.preventDefault();
        }
      }).on("keydown", function(h) {
        Os[s.name].keydown.call(Os[s.name], h);
      });
      let o;
      return d(this.box).off("mousedown.mouseStart").on("mousedown.mouseStart", function(h) {
        if (h.which == 1 && (s.last.userSelect == "text" && (s.last.userSelect = "", d(s.box).find(".w2ui-grid-body").css("user-select", "none")), !(s.selectType == "row" && (d(h.target).parents().hasClass("w2ui-head") || d(h.target).hasClass("w2ui-head")) || s.last.move && s.last.move.type == "expand"))) {
          if (h.altKey) d(s.box).find(".w2ui-grid-body").css("user-select", "text"), s.selectNone(), s.last.move = { type: "text-select" }, s.last.userSelect = "text";
          else {
            let S = h.target;
            var p = { x: h.offsetX - 10, y: h.offsetY - 10 };
            let A = false;
            for (; S && (!S.classList || !S.classList.contains("w2ui-grid")); ) S.tagName && S.tagName.toUpperCase() == "TD" && (A = true), S.tagName && S.tagName.toUpperCase() != "TR" && A == 1 && (p.x += S.offsetLeft, p.y += S.offsetTop), S = S.parentNode;
            s.last.move = { x: h.screenX, y: h.screenY, divX: 0, divY: 0, focusX: p.x, focusY: p.y, recid: d(h.target).parents("tr").attr("recid"), column: parseInt((h.target.tagName.toUpperCase() == "TD" ? d(h.target) : d(h.target).parents("td")).attr("col")), type: "select", ghost: false, start: true }, s.last.move.recid == null && (s.last.move.type = "select-column");
            let P = h.target, X = d(s.box).find("#grid_" + s.name + "_focus");
            if (s.last.move) {
              let q = s.last.move.focusX, G = s.last.move.focusY;
              var f = d(P).parents("table").parent();
              (f.hasClass("w2ui-grid-records") || f.hasClass("w2ui-grid-frecords") || f.hasClass("w2ui-grid-columns") || f.hasClass("w2ui-grid-fcolumns") || f.hasClass("w2ui-grid-summary")) && (q = s.last.move.focusX - d(s.box).find("#grid_" + s.name + "_records").prop("scrollLeft"), G = s.last.move.focusY - d(s.box).find("#grid_" + s.name + "_records").prop("scrollTop")), (d(P).hasClass("w2ui-grid-footer") || 0 < d(P).parents("div.w2ui-grid-footer").length) && (G = d(s.box).find("#grid_" + s.name + "_footer").get(0).offsetTop), f.hasClass("w2ui-scroll-wrapper") && f.parent().hasClass("w2ui-toolbar") && (q = s.last.move.focusX - f.prop("scrollLeft")), X.css({ left: q - 10, top: G });
            }
            setTimeout(() => {
              var _a2;
              s.last.inEditMode || (["INPUT", "TEXTAREA", "SELECT"].includes(P.tagName) ? P.focus() : X.get(0) !== document.active && ((_a2 = X.get(0)) == null ? void 0 : _a2.focus({ preventScroll: true })));
            }, 50), s.multiSelect || s.reorderRows || s.last.move.type != "drag" || delete s.last.move;
          }
          if (s.reorderRows == 1) {
            let S = h.target;
            var x, b, C, _;
            S.tagName.toUpperCase() != "TD" && (S = d(S).parents("td")[0]), d(S).hasClass("w2ui-col-number") || d(S).hasClass("w2ui-col-order") ? (s.selectNone(), s.last.move.reorder = true, f = d(s.box).find(".w2ui-even.w2ui-empty-record").css("background-color"), x = d(s.box).find(".w2ui-odd.w2ui-empty-record").css("background-color"), d(s.box).find(".w2ui-even td").filter(":not(.w2ui-col-number)").css("background-color", f), d(s.box).find(".w2ui-odd td").filter(":not(.w2ui-col-number)").css("background-color", x), x = s.last.move, b = d(s.box).find(".w2ui-grid-records"), x.ghost || (C = d(s.box).find(`#grid_${s.name}_rec_` + x.recid), _ = C.parents("table").find("tr:first-child").get(0).cloneNode(true), x.offsetY = h.offsetY, x.from = x.recid, x.pos = { top: C.get(0).offsetTop - 1, left: C.get(0).offsetLeft }, x.ghost = d(C.get(0).cloneNode(true)), x.ghost.removeAttr("id"), x.ghost.find("td").css({ "border-top": "1px solid silver", "border-bottom": "1px solid silver" }), C.find("td").remove(), C.append(`<td colspan="1000"><div class="w2ui-reorder-empty" style="height: ${s.recordHeight - 2}px"></div></td>`), b.append('<div id="grid_' + s.name + '_ghost_line" style="position: absolute; z-index: 999999; pointer-events: none; width: 100%;"></div>'), b.append('<table id="grid_' + s.name + '_ghost" style="position: absolute; z-index: 999998; opacity: 0.9; pointer-events: none;"></table>'), d(s.box).find("#grid_" + s.name + "_ghost").append(_).append(x.ghost)), d(s.box).find("#grid_" + s.name + "_ghost").css({ top: x.pos.top + "px", left: x.pos.left + "px" })) : s.last.move.reorder = false;
          }
          d(document).on("mousemove.w2ui-" + s.name, a).on("mouseup.w2ui-" + s.name, l), h.stopPropagation();
        }
      }), this.updateToolbar(), i.finish(), this.last.observeResize = new ResizeObserver(() => {
        this.resize();
      }), this.last.observeResize.observe(this.box), Date.now() - t;
    }
  }
  destroy() {
    var _a2;
    var e = this.trigger("destroy", { target: this.name });
    e.isCancelled !== true && (d(this.box).off(), typeof this.toolbar == "object" && this.toolbar.destroy && this.toolbar.destroy(), 0 < d(this.box).find(`#grid_${this.name}_body`).length && d(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), (_a2 = this.last.observeResize) == null ? void 0 : _a2.disconnect(), delete Os[this.name], e.finish());
  }
  initColumnOnOff() {
    var e, t = [{ id: "line-numbers", text: "Line #", checked: this.show.lineNumbers }];
    for (let n = 0; n < this.columns.length; n++) {
      var s = this.columns[n];
      let o = this.columns[n].text;
      s.hideable !== false && (o = (o = !o && this.columns[n].tooltip ? this.columns[n].tooltip : o) || "- column " + (parseInt(n) + 1) + " -", t.push({ id: s.field, text: w.stripTags(o), checked: !s.hidden }));
    }
    ((typeof this.url != "object" ? this.url : this.url.get) && this.show.skipRecords || this.show.saveRestoreState) && t.push({ text: "--" }), this.show.skipRecords && (e = w.lang("Skip") + `<input id="${this.name}_skip" type="text" class="w2ui-input w2ui-grid-skip" value="${this.offset}">` + w.lang("records"), t.push({ id: "w2ui-skip", text: e, group: false, icon: "w2ui-icon-empty" })), this.show.saveRestoreState && t.push({ id: "w2ui-stateSave", text: w.lang("Save Grid State"), icon: "w2ui-icon-empty", group: false }, { id: "w2ui-stateReset", text: w.lang("Restore Default State"), icon: "w2ui-icon-empty", group: false });
    let i = [];
    return t.forEach((n) => {
      n.text = w.lang(n.text), n.checked && i.push(n.id);
    }), this.toolbar.set("w2ui-column-on-off", { selected: i, items: t }), t;
  }
  initColumnDrag(e) {
    if (this.columnGroups && this.columnGroups.length) throw "Draggable columns are not currently supported with column groups.";
    let t = this, s = { pressed: false, targetPos: null, columnHead: null }, i = (a, l) => {
      var c = ["w2ui-col-number", "w2ui-col-expand", "w2ui-col-select"];
      l !== true && c.push("w2ui-head-last");
      for (let h = 0; h < c.length; h++) if (d(a).closest(".w2ui-head").hasClass(c[h])) return true;
      return false;
    };
    function n(a) {
      var l, c, h, p;
      s.pressed && s.columnHead && (l = a.pageX, c = a.pageY, i(a.target, true) || (a = a, d(a.target).closest("td").length != 0 && (p = d(t.box).find(".w2ui-grid-body").get(0).getBoundingClientRect(), h = d(a.target).closest("td").get(0).getBoundingClientRect(), d(t.box).find(".w2ui-intersection-marker").show().css({ left: h.left - p.left + "px" }), h = d(a.target).closest("td"), s.targetPos = h.hasClass("w2ui-head-last") ? t.columns.length : parseInt(h.attr("col")))), p = l, a = c, d(s.ghost).css({ left: p - 10 + "px", top: a - 10 + "px" }).show());
    }
    function o(a) {
      if (s.pressed && s.columnHead) {
        s.pressed = false;
        var l, c, h = () => {
          var p = d(t.box).find(".w2ui-grid-ghost");
          d(t.box).find(".w2ui-intersection-marker").hide(), d(s.ghost).remove(), p.remove(), d(document).off(".colDrag"), s = {};
        };
        if (a.pageX == s.initialX && a.pageY == s.initialY) t.columnClick(t.columns[s.originalPos].field, a), h();
        else {
          if ((a = t.trigger("columnDragEnd", { originalEvent: a, target: s.columnHead[0], dragData: s })).isCancelled === true) return false;
          l = t.columns[s.originalPos], c = t.columns, s.originalPos != s.targetPos && s.targetPos != null && (c.splice(s.targetPos, 0, w.clone(l)), c.splice(c.indexOf(l), 1)), h(), t.refresh(), a.finish({ targetColumn: NaN });
        }
      }
    }
    return d(t.box).off(".colDrag").on("mousedown.colDrag", function(a) {
      if (!s.pressed && s.numberPreColumnsPresent !== 0 && a.button === 0) {
        var l, c;
        if (d(a.target).parents().hasClass("w2ui-head") && !i(a.target)) {
          if (s.pressed = true, s.initialX = a.pageX, s.initialY = a.pageY, s.numberPreColumnsPresent = d(t.box).find(".w2ui-head.w2ui-col-number, .w2ui-head.w2ui-col-expand, .w2ui-head.w2ui-col-select").length, s.columnHead = h = d(a.target).closest(".w2ui-head"), s.originalPos = c = parseInt(h.attr("col"), 10), (c = t.trigger("columnDragStart", { originalEvent: a, origColumnNumber: c, target: h[0] })).isCancelled === true) return false;
          l = s.columns = d(t.box).find(".w2ui-head:not(.w2ui-head-last)"), d(document).on("mouseup.colDrag", o), d(document).on("mousemove.colDrag", n);
          var h = t.columns[s.originalPos], h = w.lang(typeof h.text == "function" ? h.text(h) : h.text);
          s.ghost = d.html(`<span col="${s.originalPos}">${h}</span>`)[0], d(document.body).append(s.ghost), d(s.ghost).css({ display: "none", left: a.pageX, top: a.pageY, opacity: 1, margin: "3px 0 0 20px", padding: "3px", "background-color": "white", position: "fixed", "z-index": 999999 }).addClass(".w2ui-grid-ghost"), s.offsets = [];
          for (let f = 0, x = l.length; f < x; f++) {
            var p = l[f].getBoundingClientRect();
            s.offsets.push(p.left);
          }
          c.finish();
        }
      }
    }), { remove() {
      d(t.box).off(".colDrag"), t.last.columnDrag = false;
    } };
  }
  columnOnOff(e, t) {
    if (e = this.trigger("columnOnOff", { target: this.name, field: t, originalEvent: e }), e.isCancelled !== true) {
      var s = this.find({ "w2ui.expanded": true }, true);
      for (let n = 0; n < s.length; n++) {
        var i = this.records[n].w2ui;
        i && !Array.isArray(i.children) && (this.records[n].w2ui.expanded = false);
      }
      t == "line-numbers" ? (this.show.lineNumbers = !this.show.lineNumbers, this.refresh()) : (t = this.getColumn(t)).hidden ? this.showColumn(t.field) : this.hideColumn(t.field), e.finish();
    }
  }
  initToolbar() {
    if (this.toolbar.render == null) {
      let t = this.toolbar.items || [];
      var e;
      this.toolbar.items = [], this.toolbar = new Kr(w.extend({}, this.toolbar, { name: this.name + "_toolbar", owner: this })), this.show.toolbarReload && this.toolbar.items.push(w.extend({}, this.buttons.reload)), this.show.toolbarColumns && this.toolbar.items.push(w.extend({}, this.buttons.columns)), this.show.toolbarSearch && (e = `
                <div class="w2ui-grid-search-input">
                    ${this.buttons.search.html}
                    <div id="grid_${this.name}_search_name" class="w2ui-grid-search-name">
                        <span class="name-icon w2ui-icon-search"></span>
                        <span class="name-text"></span>
                        <span class="name-cross w2ui-action" data-click="searchReset">x</span>
                    </div>
                    <input type="text" id="grid_${this.name}_search_all" class="w2ui-search-all" tabindex="-1"
                        autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                        placeholder="${w.lang(this.last.label, true)}" value="${this.last.search}"
                        data-focus="searchSuggest" data-click="stop"
                    >
                    <div class="w2ui-search-drop w2ui-action" data-click="searchOpen"
                            style="${this.multiSearch ? "" : "display: none"}">
                        <span class="w2ui-icon-drop"></span>
                    </div>
                </div>`, this.toolbar.items.push({ id: "w2ui-search", type: "html", html: e, onRefresh: async (i) => {
        await i.complete;
        var i = d(this.box).find(`#grid_${this.name}_search_all`), n = (w.bindEvents(d(this.box).find(`#grid_${this.name}_search_all, .w2ui-action`), this), w.debounce((o) => {
          var a = o.target.value;
          this.liveSearch && this.last.liveText != a && (this.last.liveText = a, this.search(this.last.field, a)), o.keyCode == 40 && this.searchSuggest(true);
        }, 250));
        i.on("change", (o) => {
          this.liveSearch || (this.search(this.last.field, o.target.value), this.searchSuggest(true, true, this));
        }).on("blur", () => {
          this.last.liveText = "";
        }).on("keyup", n);
      } })), Array.isArray(t) && (e = t.map((s) => s.id), this.show.toolbarAdd && !e.includes(this.buttons.add.id) && this.toolbar.items.push(w.extend({}, this.buttons.add)), this.show.toolbarEdit && !e.includes(this.buttons.edit.id) && this.toolbar.items.push(w.extend({}, this.buttons.edit)), this.show.toolbarDelete && !e.includes(this.buttons.delete.id) && this.toolbar.items.push(w.extend({}, this.buttons.delete)), this.show.toolbarSave && !e.includes(this.buttons.save.id) && ((this.show.toolbarAdd || this.show.toolbarDelete || this.show.toolbarEdit) && this.toolbar.items.push({ type: "break", id: "w2ui-break2" }), this.toolbar.items.push(w.extend({}, this.buttons.save))), t = t.map((s) => this.buttons[s.name] ? w.extend({}, this.buttons[s.name], s) : s)), this.toolbar.items.push(...t), this.toolbar.on("click", (s) => {
        var i = this.trigger("toolbar", { target: s.target, originalEvent: s });
        if (i.isCancelled !== true) {
          let o;
          switch (s.detail.item.id) {
            case "w2ui-reload":
              if ((o = this.trigger("reload", { target: this.name })).isCancelled === true) return false;
              this.reload(), o.finish();
              break;
            case "w2ui-column-on-off":
              s.detail.subItem ? (n = s.detail.subItem.id, ["w2ui-stateSave", "w2ui-stateReset"].includes(n) ? this[n.substring(5)]() : n != "w2ui-skip" && this.columnOnOff(s, s.detail.subItem.id)) : (this.initColumnOnOff(), setTimeout(() => {
                d(`#w2overlay-${this.name}_toolbar-drop .w2ui-grid-skip`).off(".w2ui-grid").on("click.w2ui-grid", (a) => {
                  a.stopPropagation();
                }).on("keypress", (a) => {
                  a.keyCode == 13 && (this.skip(a.target.value), this.toolbar.click("w2ui-column-on-off"));
                });
              }, 100));
              break;
            case "w2ui-add":
              if ((o = this.trigger("add", { target: this.name, recid: null })).isCancelled === true) return false;
              o.finish();
              break;
            case "w2ui-edit": {
              var n = this.getSelection();
              let a = null;
              if (n.length == 1 && (a = n[0]), (o = this.trigger("edit", { target: this.name, recid: a })).isCancelled === true) return false;
              o.finish();
              break;
            }
            case "w2ui-delete":
              this.delete();
              break;
            case "w2ui-save":
              this.save();
          }
          i.finish();
        }
      }), this.toolbar.on("refresh", (s) => {
        if (s.target == "w2ui-search") {
          let i = this.searchData;
          setTimeout(() => {
            this.searchInitInput(this.last.field, i.length == 1 ? i[0].value : null);
          }, 1);
        }
      });
    }
  }
  initResize() {
    let e = this;
    d(this.box).find(".w2ui-resizer").off(".grid-col-resize").on("click.grid-col-resize", function(t) {
      t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault();
    }).on("mousedown.grid-col-resize", function(t) {
      t = t || window.event, e.last.colResizing = true, e.last.tmp = { x: t.screenX, y: t.screenY, gx: t.screenX, gy: t.screenY, col: parseInt(d(this).attr("name")) }, e.last.tmp.tds = d(e.box).find("#grid_" + e.name + '_body table tr:first-child td[col="' + e.last.tmp.col + '"]'), t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault();
      for (let n = 0; n < e.columns.length; n++) e.columns[n].hidden || (e.columns[n].sizeOriginal == null && (e.columns[n].sizeOriginal = e.columns[n].size), e.columns[n].size = e.columns[n].sizeCalculated);
      let s = { phase: "before", type: "columnResize", target: e.name, column: e.last.tmp.col, field: e.columns[e.last.tmp.col].field };
      s = e.trigger(w.extend(s, { resizeBy: 0, originalEvent: t }));
      let i;
      d(document).off(".grid-col-resize").on("mousemove.grid-col-resize", function(n) {
        var o;
        e.last.colResizing == 1 && (n = n || window.event, (s = e.trigger(w.extend(s, { resizeBy: n.screenX - e.last.tmp.gx, originalEvent: n }))).isCancelled === true ? s.isCancelled = false : (e.last.tmp.x = n.screenX - e.last.tmp.x, e.last.tmp.y = n.screenY - e.last.tmp.y, o = parseInt(e.columns[e.last.tmp.col].size) + e.last.tmp.x + "px", e.columns[e.last.tmp.col].size = o, i && clearTimeout(i), i = setTimeout(() => {
          e.resizeRecords(), e.scroll();
        }, 100), e.last.tmp.tds.css({ width: o }), e.last.tmp.x = n.screenX, e.last.tmp.y = n.screenY));
      }).on("mouseup.grid-col-resize", function(n) {
        d(document).off(".grid-col-resize"), e.resizeRecords(), e.scroll(), s.finish({ originalEvent: n }), setTimeout(() => {
          e.last.colResizing = false;
        }, 1);
      });
    }).on("dblclick.grid-col-resize", function(t) {
      let s = parseInt(d(this).attr("name")), i = e.columns[s], n = 0;
      if (i.autoResize === false) return true;
      t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault(), d(e.box).find('.w2ui-grid-records td[col="' + s + '"] > div', e.box).each(() => {
        var a = this.offsetWidth - this.scrollWidth;
        a < n && (n = a - 3);
      });
      var o = { phase: "before", type: "columnAutoResize", target: e.name, column: i, field: i.field };
      (o = e.trigger(w.extend(o, { resizeBy: Math.abs(n), originalEvent: t }))).isCancelled === true ? o.isCancelled = false : (n < 0 && (i.size = Math.min(parseInt(i.size) + Math.abs(n), i.max || 1 / 0) + "px", e.resizeRecords(), e.resizeRecords(), e.scroll()), o.finish({ originalEvent: t }));
    }).each((t) => {
      var s = d(t).get(0).parentNode;
      d(t).css({ height: s.clientHeight + "px", "margin-left": s.clientWidth - 3 + "px" });
    });
  }
  resizeBoxes() {
    var e = d(this.box).find(`#grid_${this.name}_header`), t = d(this.box).find(`#grid_${this.name}_toolbar`), s = d(this.box).find(`#grid_${this.name}_fsummary`), i = d(this.box).find(`#grid_${this.name}_summary`), n = d(this.box).find(`#grid_${this.name}_footer`), o = d(this.box).find(`#grid_${this.name}_body`);
    this.show.header && e.css({ top: "0px", left: "0px", right: "0px" }), this.show.toolbar && t.css({ top: 0 + (this.show.header ? w.getSize(e, "height") : 0) + "px", left: "0px", right: "0px" }), 0 < this.summary.length && (s.css({ bottom: 0 + (this.show.footer ? w.getSize(n, "height") : 0) + "px" }), i.css({ bottom: 0 + (this.show.footer ? w.getSize(n, "height") : 0) + "px", right: "0px" })), this.show.footer && n.css({ bottom: "0px", left: "0px", right: "0px" }), o.css({ top: 0 + (this.show.header ? w.getSize(e, "height") : 0) + (this.show.toolbar ? w.getSize(t, "height") : 0) + "px", bottom: 0 + (this.show.footer ? w.getSize(n, "height") : 0) + (0 < this.summary.length ? w.getSize(i, "height") : 0) + "px", left: "0px", right: "0px" });
  }
  resizeRecords() {
    var _a2, _b, _c2, _d, _e, _f;
    let e = this;
    d(this.box).find(".w2ui-empty-record").remove();
    var t, s, i = d(this.box), n = d(this.box).find(":scope > div.w2ui-grid-box"), o = d(this.box).find(`#grid_${this.name}_header`), a = d(this.box).find(`#grid_${this.name}_toolbar`), l = d(this.box).find(`#grid_${this.name}_summary`), c = d(this.box).find(`#grid_${this.name}_fsummary`), h = d(this.box).find(`#grid_${this.name}_footer`), p = d(this.box).find(`#grid_${this.name}_body`), f = d(this.box).find(`#grid_${this.name}_columns`), x = d(this.box).find(`#grid_${this.name}_fcolumns`), b = d(this.box).find(`#grid_${this.name}_records`), C = d(this.box).find(`#grid_${this.name}_frecords`), _ = d(this.box).find(`#grid_${this.name}_scroll1`);
    let S = 8 * String(this.total).length + 10, A = (S < 34 && (S = 34), this.lineNumberWidth != null && (S = this.lineNumberWidth), false), P = false, X = 0;
    for (let ne = 0; ne < this.columns.length; ne++) this.columns[ne].frozen || this.columns[ne].hidden || (t = parseInt(this.columns[ne].sizeCalculated || this.columns[ne].size), X += t);
    ((_a2 = b[0]) == null ? void 0 : _a2.clientWidth) < X && (A = true), ((_b = p[0]) == null ? void 0 : _b.clientHeight) - (((_c2 = f[0]) == null ? void 0 : _c2.clientHeight) ?? 0) < (((_d = d(b).find(":scope > table")[0]) == null ? void 0 : _d.clientHeight) ?? 0) + (A ? w.scrollBarSize() : 0) && (P = true), this.fixedBody ? (s = ((_e = n[0]) == null ? void 0 : _e.clientHeight) - (this.show.header ? w.getSize(o, "height") : 0) - (this.show.toolbar ? w.getSize(a, "height") : 0) - (l.css("display") != "none" ? w.getSize(l, "height") : 0) - (this.show.footer ? w.getSize(h, "height") : 0), p.css("height", s + "px")) : (o = (s = w.getSize(f, "height") + w.getSize(d(this.box).find("#grid_" + this.name + "_records table"), "height") + (A ? w.scrollBarSize() : 0)) + (this.show.header ? w.getSize(o, "height") : 0) + (this.show.toolbar ? w.getSize(a, "height") : 0) + (l.css("display") != "none" ? w.getSize(l, "height") : 0) + (this.show.footer ? w.getSize(h, "height") : 0), n.css("height", o + "px"), p.css("height", s + "px"), i.css("height", w.getSize(n, "height") + "px"));
    let q = this.records.length;
    if (a = typeof this.url != "object" ? this.url : this.url.get, this.searchData.length == 0 || a || (q = this.last.searchIds.length), this.fixedBody || (P = false), A || P ? (f.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", w.scrollBarSize() + "px").show(), b.css({ top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + w.getSize(f, "height") + "px", "-webkit-overflow-scrolling": "touch", "overflow-x": A ? "auto" : "hidden", "overflow-y": P ? "auto" : "hidden" })) : (f.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").hide(), b.css({ top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + w.getSize(f, "height") + "px", overflow: "hidden" }), 0 < b.length && (this.last.scrollTop = 0, this.last.scrollLeft = 0)), A ? (C.css("margin-bottom", w.scrollBarSize() + "px"), _.show()) : (C.css("margin-bottom", 0), _.hide()), C.css({ overflow: "hidden", top: b.css("top") }), this.show.emptyRecords && !P) {
      let ne = Math.floor((((_f = b[0]) == null ? void 0 : _f.clientHeight) ?? 0) / this.recordHeight) - 1, ae = 0;
      if ((ae = b[0] ? b[0].scrollHeight - ne * this.recordHeight : ae) >= this.recordHeight && (ae -= this.recordHeight, ne++), this.fixedBody) {
        for (let ue = q; ue < ne; ue++) G(ue, this.recordHeight, this);
        G(ne, ae, this);
      }
    }
    function G(ne, ae, ue) {
      let he = "", Se = "";
      var ve;
      he += '<tr class="' + (ne % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + ae + 'px">', Se += '<tr class="' + (ne % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + ae + 'px">', ue.show.lineNumbers && (he += '<td class="w2ui-col-number"></td>'), ue.show.selectColumn && (he += '<td class="w2ui-grid-data w2ui-col-select"></td>'), ue.show.expandColumn && (he += '<td class="w2ui-grid-data w2ui-col-expand"></td>'), Se += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', ue.reorderRows && (Se += '<td class="w2ui-grid-data w2ui-col-order" col="order"></td>');
      for (let He = 0; He < ue.columns.length; He++) {
        var Oe = ue.columns[He];
        (Oe.hidden || He < ue.last.colStart || He > ue.last.colEnd) && !Oe.frozen || (ve = '<td class="w2ui-grid-data" ' + (Oe.attr != null ? Oe.attr : "") + ' col="' + He + '"></td>', Oe.frozen ? he += ve : Se += ve);
      }
      he += '<td class="w2ui-grid-data-last"></td> </tr>', Se += '<td class="w2ui-grid-data-last" col="end"></td> </tr>', d(ue.box).find("#grid_" + ue.name + "_frecords > table").append(he), d(ue.box).find("#grid_" + ue.name + "_records > table").append(Se);
    }
    let W, U;
    if (0 < p.length) {
      let ne = parseInt(p[0].clientWidth) - (P ? w.scrollBarSize() : 0) - (this.show.lineNumbers ? S : 0) - (this.reorderRows ? 26 : 0) - (this.show.selectColumn ? 26 : 0) - (this.show.expandColumn ? 26 : 0) - 1, ae = (W = ne, false);
      for (let ue = U = 0; ue < this.columns.length; ue++) {
        var K = this.columns[ue];
        0 < K.gridMinWidth && (K.gridMinWidth > W && K.hidden !== true && (K.hidden = true, ae = true), K.gridMinWidth < W) && K.hidden === true && (K.hidden = false, ae = true);
      }
      if (ae === true) return void this.refresh();
      for (let ue = 0; ue < this.columns.length; ue++) {
        var D = this.columns[ue];
        D.hidden || (String(D.size).substr(String(D.size).length - 2).toLowerCase() == "px" ? (ne -= parseFloat(D.size), this.columns[ue].sizeCalculated = D.size, this.columns[ue].sizeType = "px") : (U += parseFloat(D.size), this.columns[ue].sizeType = "%", delete D.sizeCorrected));
      }
      if (U != 100 && 0 < U) for (let ue = 0; ue < this.columns.length; ue++) {
        var R = this.columns[ue];
        R.hidden || R.sizeType == "%" && (R.sizeCorrected = Math.round(100 * parseFloat(R.size) * 100 / U) / 100 + "%");
      }
      for (let ue = 0; ue < this.columns.length; ue++) {
        var B = this.columns[ue];
        B.hidden || B.sizeType == "%" && (this.columns[ue].sizeCorrected != null ? this.columns[ue].sizeCalculated = Math.floor(ne * parseFloat(B.sizeCorrected) / 100) - 1 + "px" : this.columns[ue].sizeCalculated = Math.floor(ne * parseFloat(B.size) / 100) - 1 + "px");
      }
    }
    let Q = 0;
    for (let ne = 0; ne < this.columns.length; ne++) {
      var re = this.columns[ne];
      re.hidden || (re.min == null && (re.min = 20), parseInt(re.sizeCalculated) < parseInt(re.min) && (re.sizeCalculated = re.min + "px"), parseInt(re.sizeCalculated) > parseInt(re.max) && (re.sizeCalculated = re.max + "px"), Q += parseInt(re.sizeCalculated));
    }
    let pe = parseInt(W) - parseInt(Q);
    if (0 < pe && 0 < U) {
      let ne = 0;
      for (; ; ) {
        var be = this.columns[ne];
        if (be == null) ne = 0;
        else {
          if (!be.hidden && be.sizeType != "px" && (be.sizeCalculated = parseInt(be.sizeCalculated) + 1 + "px", --pe === 0)) break;
          ne++;
        }
      }
    } else 0 < pe && f.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", w.scrollBarSize() + "px").show();
    let le = 1;
    this.show.lineNumbers && (le += S), this.show.selectColumn && (le += 26), this.show.expandColumn && (le += 26);
    for (let ne = 0; ne < this.columns.length; ne++) this.columns[ne].hidden || this.columns[ne].frozen && (le += parseInt(this.columns[ne].sizeCalculated));
    x.css("width", le + "px"), C.css("width", le + "px"), c.css("width", le + "px"), _.css("width", le + "px"), f.css("left", le + "px"), b.css("left", le + "px"), l.css("left", le + "px"), f.find(":scope > table > tbody > tr:nth-child(1) td").add(x.find(":scope > table > tbody > tr:nth-child(1) td")).each((ne) => {
      d(ne).hasClass("w2ui-col-number") && d(ne).css("width", S + "px");
      var ae = d(ne).attr("col");
      if (ae != null) {
        if (ae == "start") {
          let ue = 0;
          for (let he = 0; he < e.last.colStart; he++) !e.columns[he] || e.columns[he].frozen || e.columns[he].hidden || (ue += parseInt(e.columns[he].sizeCalculated));
          d(ne).css("width", ue + "px");
        }
        e.columns[ae] && d(ne).css("width", e.columns[ae].sizeCalculated);
      }
      if (d(ne).hasClass("w2ui-head-last")) if (e.last.colEnd + 1 < e.columns.length) {
        let ue = 0;
        for (let he = e.last.colEnd + 1; he < e.columns.length; he++) !e.columns[he] || e.columns[he].frozen || e.columns[he].hidden || (ue += parseInt(e.columns[he].sizeCalculated));
        d(ne).css("width", ue + "px");
      } else d(ne).css("width", w.scrollBarSize() + (0 < pe && U === 0 ? pe : 0) + "px");
    }), f.find(":scope > table > tbody > tr").length == 3 && f.find(":scope > table > tbody > tr:nth-child(1) td").add(x.find(":scope > table > tbody > tr:nth-child(1) td")).html("").css({ height: "0", border: "0", padding: "0", margin: "0" }), b.find(":scope > table > tbody > tr:nth-child(1) td").add(C.find(":scope > table > tbody > tr:nth-child(1) td")).each((ne) => {
      d(ne).hasClass("w2ui-col-number") && d(ne).css("width", S + "px");
      var ae = d(ne).attr("col");
      if (ae != null) {
        if (ae == "start") {
          let ue = 0;
          for (let he = 0; he < e.last.colStart; he++) !e.columns[he] || e.columns[he].frozen || e.columns[he].hidden || (ue += parseInt(e.columns[he].sizeCalculated));
          d(ne).css("width", ue + "px");
        }
        e.columns[ae] && d(ne).css("width", e.columns[ae].sizeCalculated);
      }
      if (d(ne).hasClass("w2ui-grid-data-last") && d(ne).parents(".w2ui-grid-frecords").length === 0) if (e.last.colEnd + 1 < e.columns.length) {
        let ue = 0;
        for (let he = e.last.colEnd + 1; he < e.columns.length; he++) !e.columns[he] || e.columns[he].frozen || e.columns[he].hidden || (ue += parseInt(e.columns[he].sizeCalculated));
        d(ne).css("width", ue + "px");
      } else d(ne).css("width", (0 < pe && U === 0 ? pe : 0) + "px");
    }), l.find(":scope > table > tbody > tr:nth-child(1) td").add(c.find(":scope > table > tbody > tr:nth-child(1) td")).each((ne) => {
      d(ne).hasClass("w2ui-col-number") && d(ne).css("width", S + "px");
      var ae = d(ne).attr("col");
      if (ae != null) {
        if (ae == "start") {
          let ue = 0;
          for (let he = 0; he < e.last.colStart; he++) !e.columns[he] || e.columns[he].frozen || e.columns[he].hidden || (ue += parseInt(e.columns[he].sizeCalculated));
          d(ne).css("width", ue + "px");
        }
        e.columns[ae] && d(ne).css("width", e.columns[ae].sizeCalculated);
      }
      d(ne).hasClass("w2ui-grid-data-last") && d(ne).parents(".w2ui-grid-frecords").length === 0 && d(ne).css("width", w.scrollBarSize() + (0 < pe && U === 0 ? pe : 0) + "px");
    }), this.initResize(), this.refreshRanges(), (this.last.scrollTop || this.last.scrollLeft) && 0 < b.length && (f.prop("scrollLeft", this.last.scrollLeft), b.prop("scrollTop", this.last.scrollTop), b.prop("scrollLeft", this.last.scrollLeft)), f.css("will-change", "scroll-position");
  }
  getSearchesHTML() {
    let e = `
            <div class="search-title">
                ${w.lang("Advanced Search")}
                <span class="search-logic" style="${this.show.searchLogic ? "" : "display: none"}">
                    <select id="grid_${this.name}_logic" class="w2ui-input">
                        <option value="AND" ${this.last.logic == "AND" ? "selected" : ""}>${w.lang("All")}</option>
                        <option value="OR" ${this.last.logic == "OR" ? "selected" : ""}>${w.lang("Any")}</option>
                    </select>
                </span>
            </div>
            <table cellspacing="0"><tbody>
        `;
    for (let i = 0; i < this.searches.length; i++) {
      var t = this.searches[i];
      if (t.type = String(t.type).toLowerCase(), !t.hidden) {
        t.attr == null && (t.attr = ""), t.text == null && (t.text = ""), t.style == null && (t.style = ""), t.type == null && (t.type = "text"), t.label == null && t.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", t), t.label = t.caption);
        var s = `<select id="grid_${this.name}_operator_${i}" class="w2ui-input" data-change="initOperator|${i}">
                    ${this.getOperators(t.type, t.operators)}
                </select>`;
        e += `<tr>
                        <td class="caption">${w.lang(t.label) || ""}</td>
                        <td class="operator">${s}</td>
                        <td class="value">`;
        let n;
        switch (t.type) {
          case "text":
          case "alphanumeric":
          case "hex":
          case "color":
          case "list":
          case "combo":
          case "enum":
            n = "width: 250px;", ["hex", "color"].indexOf(t.type) != -1 && (n = "width: 90px;"), e += `<input rel="search" type="text" id="grid_${this.name}_field_${i}" name="${t.field}"
                               class="w2ui-input" style="${n + t.style}" ${t.attr}>`;
            break;
          case "int":
          case "float":
          case "money":
          case "currency":
          case "percent":
          case "date":
          case "time":
          case "datetime":
            n = "width: 90px;", t.type == "datetime" && (n = "width: 140px;"), e += `<input id="grid_${this.name}_field_${i}" name="${t.field}" ${t.attr} rel="search" type="text"
                                class="w2ui-input" style="${n + t.style}">
                            <span id="grid_${this.name}_range_${i}" style="display: none">&#160;-&#160;&#160;
                                <input rel="search" type="text" class="w2ui-input" style="${n + t.style}" id="grid_${this.name}_field2_${i}" name="${t.field}" ${t.attr}>
                            </span>`;
            break;
          case "select":
            e += `<select rel="search" class="w2ui-input" style="${t.style}" id="grid_${this.name}_field_${i}"
                                name="${t.field}" ${t.attr}></select>`;
        }
        e += t.text + "    </td></tr>";
      }
    }
    return e += `<tr>
            <td colspan="2" class="actions">
                <button type="button" class="w2ui-btn close-btn" data-click="searchClose">${w.lang("Close")}</button>
            </td>
            <td class="actions">
                <button type="button" class="w2ui-btn" data-click="searchReset">${w.lang("Reset")}</button>
                <button type="button" class="w2ui-btn w2ui-btn-blue" data-click="search">${w.lang("Search")}</button>
            </td>
        </tr></tbody></table>`;
  }
  getOperators(e, t) {
    let s = this.operators[this.operatorsMap[e]] || [], i = (t != null && Array.isArray(t) && (s = t), "");
    return s.forEach((n) => {
      let o = n, a = n;
      Array.isArray(n) ? (o = n[1], a = n[0]) : w.isPlainObject(n) && (o = n.text, a = n.oper), o == null && (o = n), i += `<option name="11" value="${a}">${w.lang(o)}</option>
`;
    }), i;
  }
  initOperator(e) {
    let t;
    var s = this.searches[e], i = this.getSearchData(s.field), n = d(`#w2overlay-${this.name}-search-overlay`), o = n.find(`#grid_${this.name}_range_` + e);
    let a = n.find(`#grid_${this.name}_field_` + e), l = n.find(`#grid_${this.name}_field2_` + e);
    var c = n.find(`#grid_${this.name}_operator_` + e).val();
    switch (a.show(), o.hide(), c) {
      case "between":
        o.show();
        break;
      case "null":
      case "not null":
        a.hide(), a.val(c), a.trigger("change");
    }
    switch (s.type) {
      case "text":
      case "alphanumeric":
        var h = a[0]._w2field;
        h && h.reset();
        break;
      case "int":
      case "float":
      case "hex":
      case "color":
      case "money":
      case "currency":
      case "percent":
      case "date":
      case "time":
      case "datetime":
        a[0]._w2field || (new yn(s.type, { el: a[0], ...s.options }), new yn(s.type, { el: l[0], ...s.options }), setTimeout(() => {
          a.trigger("keydown"), l.trigger("keydown");
        }, 1));
        break;
      case "list":
      case "combo":
      case "enum":
        t = s.options, s.type == "list" && (t.selected = {}), s.type == "enum" && (t.selected = []), i && (t.selected = i.value), a[0]._w2field || (h = new yn(s.type, { el: a[0], ...t }), i && i.text != null && h.set({ id: i.value, text: i.text }));
        break;
      case "select":
        t = '<option value="">--</option>';
        for (let f = 0; f < s.options.items.length; f++) {
          var p = s.options.items[f];
          if (w.isPlainObject(s.options.items[f])) {
            let x = p.id, b = p.text;
            x == null && p.value != null && (x = p.value), b == null && p.text != null && (b = p.text), x == null && (x = ""), t += '<option value="' + x + '">' + b + "</option>";
          } else t += '<option value="' + p + '">' + p + "</option>";
        }
        a.html(t);
    }
  }
  initSearches() {
    var e = d(`#w2overlay-${this.name}-search-overlay`);
    for (let n = 0; n < this.searches.length; n++) {
      var s = this.searches[n], t = this.getSearchData(s.field);
      s.type = String(s.type).toLowerCase(), typeof s.options != "object" && (s.options = {});
      let o = s.operator, a = [...this.operators[this.operatorsMap[s.type]]];
      s.operators && (a = s.operators), w.isPlainObject(o) && (o = o.oper), a.forEach((l, c) => {
        w.isPlainObject(l) && (a[c] = l.oper);
      }), t && t.operator && (o = t.operator);
      var s = this.defaultOperator[this.operatorsMap[s.type]], s = (a.indexOf(o) == -1 && (o = s), e.find(`#grid_${this.name}_operator_` + n).val(o), this.initOperator(n), e.find(`#grid_${this.name}_field_` + n)), i = e.find(`#grid_${this.name}_field2_` + n);
      t != null && (Array.isArray(t.value) ? ["in", "not in"].includes(t.operator) ? s[0]._w2field.set(t.value) : (s.val(t.value[0]).trigger("change"), i.val(t.value[1]).trigger("change")) : t.value != null && s.val(t.value).trigger("change"));
    }
    e.find(".w2ui-grid-search-advanced *[rel=search]").on("keypress", (n) => {
      n.keyCode == 13 && (this.search(), rt.hide(this.name + "-search-overlay"));
    });
  }
  getColumnsHTML() {
    let e = this, t = "", s = "";
    var i, n, o;
    return this.show.columnHeaders && (s = 0 < this.columnGroups.length ? (o = a(true), i = function() {
      let l = "<tr>", c = "<tr>", h = "", p = e.columnGroups.length - 1;
      e.columnGroups[p].text == null && e.columnGroups[p].caption != null && (console.log("NOTICE: grid columnGroup.caption property is deprecated, please use columnGroup.text. Group -> ", e.columnGroups[p]), e.columnGroups[p].text = e.columnGroups[p].caption), e.columnGroups[e.columnGroups.length - 1].text != "" && e.columnGroups.push({ text: "" }), e.show.lineNumbers && (l += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>&#160;</div></td>'), e.show.selectColumn && (l += '<td class="w2ui-head w2ui-col-select" col="select">    <div style="height: 25px">&#160;</div></td>'), e.show.expandColumn && (l += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div style="height: 25px">&#160;</div></td>');
      let f = 0;
      c += `<td id="grid_${e.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`, e.reorderRows && (c += '<td class="w2ui-head w2ui-col-order" col="order">    <div style="height: 25px">&#160;</div></td>');
      for (let _ = 0; _ < e.columnGroups.length; _++) {
        var x = e.columnGroups[_], b = e.columns[f] || {};
        x.colspan != null && (x.span = x.colspan), x.span != null && x.span == parseInt(x.span) || (x.span = 1), b.text == null && b.caption != null && (console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column ->", b), b.text = b.caption);
        let S = 0;
        for (let A = f; A < f + x.span; A++) e.columns[A] && !e.columns[A].hidden && S++;
        if (!((S = _ == e.columnGroups.length - 1 ? 100 : S) <= 0)) {
          if (x.main === true) {
            let A = "";
            for (let X = 0; X < e.sortData.length; X++) e.sortData[X].field == b.field && ((e.sortData[X].direction || "").toLowerCase() === "asc" && (A = "w2ui-sort-up"), (e.sortData[X].direction || "").toLowerCase() === "desc") && (A = "w2ui-sort-down");
            let P = "";
            b.resizable !== false && (P = `<div class="w2ui-resizer" name="${f}"></div>`);
            var C = w.lang(typeof b.text == "function" ? b.text(b) : b.text);
            h = `<td id="grid_${e.name}_column_${f}" class="w2ui-head ${A}" col="${f}"     rowspan="2" colspan="${S}">` + P + `    <div class="w2ui-col-group w2ui-col-header ${A ? "w2ui-col-sorted" : ""}">        <div class="${A}"></div>` + (C || "&#160;") + "    </div></td>";
          } else C = w.lang(typeof x.text == "function" ? x.text(x) : x.text), h = `<td id="grid_${e.name}_column_${f}" class="w2ui-head" col="${f}" colspan="${S}">    <div class="w2ui-col-group" style="${x.style ?? ""}">${C || "&#160;"}</div></td>`;
          b && b.frozen ? l += h : c += h;
        }
        f += x.span;
      }
      return l += "<td></td></tr>", c += `<td id="grid_${e.name}_column_end" class="w2ui-head" col="end"></td></tr>`, [l, c];
    }(), n = a(false), t = o[0] + i[0] + n[0], o[1] + i[1] + n[1]) : (o = a(true), t = o[0], o[1])), [t, s];
    function a(l) {
      let c = "<tr>", h = "<tr>", p = (e.show.lineNumbers && (c += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>#</div></td>'), e.show.selectColumn && (c += `<td class="w2ui-head w2ui-col-select" col="select">    <div>        <input type="checkbox" id="grid_${e.name}_check_all" class="w2ui-select-all" tabindex="-1"            style="${e.multiSelect == 0 ? "display: none;" : ""}"        >    </div></td>`), e.show.expandColumn && (c += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div>&#160;</div></td>'), 0), f = 0, x;
      h += `<td id="grid_${e.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`, e.reorderRows && (h += '<td class="w2ui-head w2ui-col-order" col="order">    <div>&#160;</div></td>');
      for (let _ = 0; _ < e.columns.length; _++) {
        var b, C = e.columns[_];
        C.text == null && C.caption != null && (console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column -> ", C), C.text = C.caption), C.size == null && (C.size = "100%"), _ == f && (x = e.columnGroups[p++] || {}, f += x.span), (_ < e.last.colStart || _ > e.last.colEnd) && !C.frozen || C.hidden || x.main === true && !l || (b = e.getColumnCellHTML(_), C && C.frozen ? c += b : h += b);
      }
      return c += '<td class="w2ui-head w2ui-head-last"><div>&#160;</div></td>', h += '<td class="w2ui-head w2ui-head-last" col="end"><div>&#160;</div></td>', c += "</tr>", h += "</tr>", [c, h];
    }
  }
  getColumnCellHTML(e) {
    var t = this.columns[e];
    if (t == null) return "";
    var s = !this.reorderColumns || this.columnGroups && this.columnGroups.length ? "" : " w2ui-col-reorderable ";
    let i = "";
    for (let c = 0; c < this.sortData.length; c++) this.sortData[c].field == t.field && ((this.sortData[c].direction || "").toLowerCase() === "asc" && (i = "w2ui-sort-up"), (this.sortData[c].direction || "").toLowerCase() === "desc") && (i = "w2ui-sort-down");
    var n, o = this.last.selection.columns;
    let a = false;
    for (n in o) for (let c = 0; c < o[n].length; c++) o[n][c] == e && (a = true);
    var l = w.lang(typeof t.text == "function" ? t.text(t) : t.text);
    return '<td id="grid_' + this.name + "_column_" + e + '" col="' + e + '" class="w2ui-head ' + i + s + '">' + (t.resizable !== false ? '<div class="w2ui-resizer" name="' + e + '"></div>' : "") + '    <div class="w2ui-col-header ' + (i ? "w2ui-col-sorted" : "") + " " + (a ? "w2ui-col-selected" : "") + '">        <div class="' + i + '"></div>' + (l || "&#160;") + "    </div></td>";
  }
  columnTooltipShow(i, t) {
    var s = d(this.box).find("#grid_" + this.name + "_column_" + i), i = this.columns[i], n = this.columnTooltip;
    rt.show({ name: this.name + "-column-tooltip", anchor: s.get(0), html: i == null ? void 0 : i.tooltip, position: n });
  }
  columnTooltipHide(e, t) {
    rt.hide(this.name + "-column-tooltip");
  }
  getRecordsHTML() {
    var _a2;
    let e = this.records.length;
    var t = typeof this.url != "object" ? this.url : this.url.get, t = ((e = this.searchData.length == 0 || t ? e : this.last.searchIds.length) > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start, d(this.box).find(`#grid_${this.name}_records`));
    let s = Math.floor((((_a2 = t.get(0)) == null ? void 0 : _a2.clientHeight) || 0) / this.recordHeight) + this.last.show_extra + 1;
    (!this.fixedBody || s > e) && (s = e);
    var i = this.getRecordHTML(-1, 0);
    let n = "<table><tbody>" + i[0], o = "<table><tbody>" + i[1];
    n += '<tr id="grid_' + this.name + '_frec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>', o += '<tr id="grid_' + this.name + '_rec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
    for (let a = 0; a < s; a++) i = this.getRecordHTML(a, a + 1), n += i[0], o += i[1];
    return t = (e - s) * this.recordHeight, n += '<tr id="grid_' + this.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border-right: 1px solid #D6D5D7;"></td></tr><tr id="grid_' + this.name + '_frec_more" style="display: none; ">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', o += '<tr id="grid_' + this.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + this.name + '_rec_more" style="display: none">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', this.last.range_start = 0, this.last.range_end = s, [n, o];
  }
  getSummaryHTML() {
    if (this.summary.length !== 0) {
      var e = this.getRecordHTML(-1, 0);
      let t = "<table><tbody>" + e[0], s = "<table><tbody>" + e[1];
      for (let i = 0; i < this.summary.length; i++) e = this.getRecordHTML(i, i + 1, true), t += e[0], s += e[1];
      return t += "</tbody></table>", s += "</tbody></table>", [t, s];
    }
  }
  scroll(e) {
    let t = this;
    var s = typeof this.url != "object" ? this.url : this.url.get, i = d(this.box).find(`#grid_${this.name}_records`), n = d(this.box).find(`#grid_${this.name}_frecords`);
    e && (P = e.target.scrollTop, e = e.target.scrollLeft, this.last.scrollTop = P, this.last.scrollLeft = e, p = d(this.box).find(`#grid_${this.name}_columns`)[0], f = d(this.box).find(`#grid_${this.name}_summary`)[0], p && (p.scrollLeft = e), f && (f.scrollLeft = e), n[0]) && (n[0].scrollTop = P), this.last.bubbleEl && (rt.hide(this.name + "-bubble"), this.last.bubbleEl = null);
    let o = null, a = null;
    if (this.disableCVS || 0 < this.columnGroups.length) o = 0, a = this.columns.length - 1;
    else {
      var l, c = i.prop("clientWidth");
      let D = 0;
      for (let R = 0; R < this.columns.length; R++) this.columns[R].frozen || this.columns[R].hidden || (l = parseInt(this.columns[R].sizeCalculated || this.columns[R].size), D + l + 30 > this.last.scrollLeft && o == null && (o = R), D + l - 30 > this.last.scrollLeft + c && a == null && (a = R), D += l);
      a == null && (a = this.columns.length - 1);
    }
    if (o != null && (o < 0 && (o = 0), a < 0 && (a = 0), o == a && (0 < o ? o-- : a++), o != this.last.colStart || a != this.last.colEnd)) {
      var h = d(this.box), p = Math.abs(o - this.last.colStart), f = Math.abs(a - this.last.colEnd);
      if (p < 5 && f < 5) {
        var x = h.find(`.w2ui-grid-columns #grid_${this.name}_column_start`), b = h.find(".w2ui-grid-columns .w2ui-head-last"), C = h.find(`#grid_${this.name}_records .w2ui-grid-data-spacer`), _ = h.find(`#grid_${this.name}_records .w2ui-grid-data-last`), S = h.find(`#grid_${this.name}_summary .w2ui-grid-data-spacer`), A = h.find(`#grid_${this.name}_summary .w2ui-grid-data-last`);
        if (o > this.last.colStart) for (let D = this.last.colStart; D < o; D++) h.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + D).remove(), h.find("#grid_" + this.name + '_records td[col="' + D + '"]').remove(), h.find("#grid_" + this.name + '_summary td[col="' + D + '"]').remove();
        if (a < this.last.colEnd) for (let D = this.last.colEnd; D > a; D--) h.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + D).remove(), h.find("#grid_" + this.name + '_records td[col="' + D + '"]').remove(), h.find("#grid_" + this.name + '_summary td[col="' + D + '"]').remove();
        if (o < this.last.colStart) for (let D = this.last.colStart - 1; D >= o; D--) this.columns[D] && (this.columns[D].frozen || this.columns[D].hidden) || (x.after(this.getColumnCellHTML(D)), C.each((R) => {
          var B = d(R).parent().attr("index");
          let Q = '<td class="w2ui-grid-data" col="' + D + '" style="height: 0px"></td>';
          B != null && (Q = this.getCellHTML(parseInt(B), D, false)), d(R).after(Q);
        }), S.each((R) => {
          var B = d(R).parent().attr("index");
          let Q = '<td class="w2ui-grid-data" col="' + D + '" style="height: 0px"></td>';
          B != null && (Q = this.getCellHTML(parseInt(B), D, true)), d(R).after(Q);
        }));
        if (a > this.last.colEnd) for (let D = this.last.colEnd + 1; D <= a; D++) this.columns[D] && (this.columns[D].frozen || this.columns[D].hidden) || (b.before(this.getColumnCellHTML(D)), _.each((R) => {
          var B = d(R).parent().attr("index");
          let Q = '<td class="w2ui-grid-data" col="' + D + '" style="height: 0px"></td>';
          B != null && (Q = this.getCellHTML(parseInt(B), D, false)), d(R).before(Q);
        }), A.each((R) => {
          var B = d(R).parent().attr("index") || -1, B = this.getCellHTML(parseInt(B), D, true);
          d(R).before(B);
        }));
        this.last.colStart = o, this.last.colEnd = a;
      } else {
        this.last.colStart = o, this.last.colEnd = a;
        var e = this.getColumnsHTML(), P = this.getRecordsHTML(), p = this.getSummaryHTML(), f = h.find(`#grid_${this.name}_columns`);
        let Q = h.find(`#grid_${this.name}_records`);
        var X = h.find(`#grid_${this.name}_frecords`);
        let re = h.find(`#grid_${this.name}_summary`);
        f.find("tbody").html(e[1]), X.html(P[0]), Q.prepend(P[1]), p != null && re.html(p[1]), setTimeout(() => {
          Q.find(":scope > table").filter(":not(table:first-child)").remove(), re[0] && (re[0].scrollLeft = this.last.scrollLeft);
        }, 1);
      }
      this.resizeRecords();
    }
    let q = this.records.length;
    if (q > this.total && this.total !== -1 && (q = this.total), (q = this.searchData.length == 0 || s ? q : this.last.searchIds.length) !== 0 && i.length !== 0 && i.prop("clientHeight") !== 0) {
      q > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start;
      let D = Math.round(i.prop("scrollTop") / this.recordHeight + 1), R = D + (Math.round(i.prop("clientHeight") / this.recordHeight) - 1);
      if (D > q && (D = q), R >= q - 1 && (R = q), d(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-right").html((this.show.statusRange ? w.formatNumber(this.offset + D) + "-" + w.formatNumber(this.offset + R) + (this.total != -1 ? " " + w.lang("of") + " " + w.formatNumber(this.total) : "") : "") + (s && this.show.statusBuffered ? " (" + w.lang("buffered") + " " + w.formatNumber(q) + (0 < this.offset ? ", skip " + w.formatNumber(this.offset) : "") + ")" : "")), s || this.fixedBody && !(this.total != -1 && this.total <= this.vs_start)) {
        let Se = function() {
          t.markSearch && (clearTimeout(t.last.marker_timer), t.last.marker_timer = setTimeout(() => {
            var ve = [];
            for (let dt = 0; dt < t.searchData.length; dt++) {
              var Oe = t.searchData[dt], He = t.getSearch(Oe.field);
              He && !He.hidden && (He = t.getColumn(Oe.field, true), ve.push({ field: Oe.field, search: Oe.value, col: He }));
            }
            0 < ve.length && ve.forEach((dt) => {
              var wt = d(t.box).find('td[col="' + dt.col + '"]:not(.w2ui-head)');
              w.marker(wt, dt.search);
            });
          }, 50));
        }, B = Math.floor(i.prop("scrollTop") / this.recordHeight) - this.last.show_extra, Q = B + Math.floor(i.prop("clientHeight") / this.recordHeight) + 2 * this.last.show_extra + 1;
        B < 1 && (B = 1), Q > this.total && this.total != -1 && (Q = this.total);
        var G = i.find("#grid_" + this.name + "_rec_top"), W = i.find("#grid_" + this.name + "_rec_bottom"), U = n.find("#grid_" + this.name + "_frec_top"), K = n.find("#grid_" + this.name + "_frec_bottom"), f = (String(G.next().prop("id")).indexOf("_expanded_row") != -1 && (G.next().remove(), U.next().remove()), this.total > Q && String(W.prev().prop("id")).indexOf("_expanded_row") != -1 && (W.prev().remove(), K.prev().remove()), parseInt(G.next().attr("line"))), e = parseInt(W.prev().attr("line"));
        let be, le, ne, ae, ue;
        if (f < B || f == 1 || this.last.pull_refresh) {
          if (Q <= e + this.last.show_extra - 2 && Q != this.total) return;
          for (this.last.pull_refresh = false; le = n.find("#grid_" + this.name + "_frec_top").next(), !((ne = i.find("#grid_" + this.name + "_rec_top").next()).attr("line") == "bottom" || !(parseInt(ne.attr("line")) < B)); ) le.remove(), ne.remove();
          be = i.find("#grid_" + this.name + "_rec_bottom").prev(), (ae = be.attr("line")) == "top" && (ae = B);
          for (let ve = parseInt(ae) + 1; ve <= Q; ve++) this.records[ve - 1] && ((ne = this.records[ve - 1].w2ui) && !Array.isArray(ne.children) && (ne.expanded = false), ue = this.getRecordHTML(ve - 1, ve), W.before(ue[1]), K.before(ue[0]));
        } else {
          if (B >= f - this.last.show_extra + 2 && 1 < B) return;
          for (; le = n.find("#grid_" + this.name + "_frec_bottom").prev(), !((ne = i.find("#grid_" + this.name + "_rec_bottom").prev()).attr("line") == "top" || !(parseInt(ne.attr("line")) > Q)); ) le.remove(), ne.remove();
          be = i.find("#grid_" + this.name + "_rec_top").next(), (ae = be.attr("line")) == "bottom" && (ae = Q);
          for (let ve = parseInt(ae) - 1; ve >= B; ve--) this.records[ve - 1] && ((ne = this.records[ve - 1].w2ui) && !Array.isArray(ne.children) && (ne.expanded = false), ue = this.getRecordHTML(ve - 1, ve), G.after(ue[1]), U.after(ue[0]));
        }
        Se(), setTimeout(() => {
          this.refreshRanges();
        }, 0), X = (B - 1) * this.recordHeight;
        let he = (q - Q) * this.recordHeight;
        he < 0 && (he = 0), G.css("height", X + "px"), U.css("height", X + "px"), W.css("height", he + "px"), K.css("height", he + "px"), this.last.range_start = B, this.last.range_end = Q, Math.floor(i.prop("scrollTop") / this.recordHeight) + Math.floor(i.prop("clientHeight") / this.recordHeight) + 10 > q && this.last.pull_more !== true && (q < this.total - this.offset || this.total == -1 && this.last.fetch.hasMore) && (this.autoLoad === true && (this.last.pull_more = true, this.last.fetch.offset += this.limit, this.request("load")), d(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").show().eq(1).off(".load-more").on("click.load-more", function() {
          d(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>'), t.last.pull_more = true, t.last.fetch.offset += t.limit, t.request("load");
        }).find("td").html(t.autoLoad ? '<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>' : '<div style="padding-top: 15px">' + w.lang("Load ${count} more...", { count: t.limit }) + "</div>"));
      }
    }
  }
  getRecordHTML(e, t, s) {
    var _a2, _b, _c2, _d, _e;
    let i = "", n = "";
    var o = this.last.selection;
    let a;
    if (e == -1) {
      i += '<tr line="0">', n += '<tr line="0">', this.show.lineNumbers && (i += '<td class="w2ui-col-number" style="height: 0px"></td>'), this.show.selectColumn && (i += '<td class="w2ui-col-select" style="height: 0px"></td>'), this.show.expandColumn && (i += '<td class="w2ui-col-expand" style="height: 0px"></td>'), n += '<td class="w2ui-grid-data w2ui-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>', this.reorderRows && (n += '<td class="w2ui-col-order" style="height: 0px"></td>');
      for (let C = 0; C < this.columns.length; C++) {
        var l = this.columns[C], c = '<td class="w2ui-grid-data" col="' + C + '" style="height: 0px;"></td>';
        l.frozen && !l.hidden ? i += c : l.hidden || C < this.last.colStart || C > this.last.colEnd || (n += c);
      }
      i += '<td class="w2ui-grid-data-last" style="height: 0px"></td>', n += '<td class="w2ui-grid-data-last" col="end" style="height: 0px"></td>';
    } else {
      var h = typeof this.url != "object" ? this.url : this.url.get;
      if (s !== true) {
        if (0 < this.searchData.length && !h) {
          if (e >= this.last.searchIds.length) return "";
          e = this.last.searchIds[e];
        } else if (e >= this.records.length) return "";
        a = this.records[e];
      } else {
        if (e >= this.summary.length) return "";
        a = this.summary[e];
      }
      if (!a) return "";
      a.recid == null && this.recid != null && (h = this.parseField(a, this.recid)) != null && (a.recid = h);
      let C = false, _ = (o.indexes.indexOf(e) != -1 && (C = true), a.w2ui ? a.w2ui.style : ""), S = (_ != null && typeof _ == "string" || (_ = ""), a.w2ui ? a.w2ui.class : "");
      if (S != null && typeof S == "string" || (S = ""), i += '<tr id="grid_' + this.name + "_frec_" + a.recid + '" recid="' + a.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + S + (C && this.selectType == "row" ? " w2ui-selected" : "") + (a.w2ui && a.w2ui.editable === false ? " w2ui-no-edit" : "") + (a.w2ui && a.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (C || _ == "" ? _.replace("background-color", "none") : _) + '" ' + (_ != "" ? 'custom_style="' + _ + '"' : "") + ">", n += '<tr id="grid_' + this.name + "_rec_" + a.recid + '" recid="' + a.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + S + (C && this.selectType == "row" ? " w2ui-selected" : "") + (a.w2ui && a.w2ui.editable === false ? " w2ui-no-edit" : "") + (a.w2ui && a.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (C || _ == "" ? _.replace("background-color", "none") : _) + '" ' + (_ != "" ? 'custom_style="' + _ + '"' : "") + ">", this.show.lineNumbers && (i += '<td id="grid_' + this.name + "_cell_" + e + "_number" + (s ? "_s" : "") + '"    class="w2ui-col-number ' + (C ? " w2ui-row-selected" : "") + '"' + (this.reorderRows ? ' style="cursor: move"' : "") + ">" + (s !== true ? this.getLineHTML(t, a) : "") + "</td>"), this.show.selectColumn && (i += '<td id="grid_' + this.name + "_cell_" + e + "_select" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-select">' + (s === true || a.w2ui && a.w2ui.hideCheckBox === true ? "" : '    <div>        <input class="w2ui-grid-select-check" type="checkbox" tabindex="-1" ' + (C ? 'checked="checked"' : "") + ' style="pointer-events: none"/>    </div>') + "</td>"), this.show.expandColumn) {
        let X = "";
        X = ((_a2 = a.w2ui) == null ? void 0 : _a2.expanded) === true ? "-" : "+", ((_b = a.w2ui) == null ? void 0 : _b.expanded) != "none" && Array.isArray((_c2 = a.w2ui) == null ? void 0 : _c2.children) && ((_d = a.w2ui) == null ? void 0 : _d.children.length) || (X = "+"), ((_e = a.w2ui) == null ? void 0 : _e.expanded) == "spinner" && (X = '<div class="w2ui-spinner" style="width: 16px; margin: -2px 2px;"></div>'), i += '<td id="grid_' + this.name + "_cell_" + e + "_expand" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-expand">' + (s !== true ? `<div>${X}</div>` : "") + "</td>";
      }
      n += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', this.reorderRows && (n += '<td id="grid_' + this.name + "_cell_" + e + "_order" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-order" col="order">' + (s !== true ? '<div title="Drag to reorder">&nbsp;</div>' : "") + "</td>");
      let A = 0, P = 0;
      for (; ; ) {
        let X = 1;
        var p, f = this.columns[A];
        if (f == null) break;
        if (f.hidden) A++, 0 < P && P--;
        else if (0 < P) {
          if (A++, this.columns[A] == null) break;
          a.w2ui.colspan[this.columns[A - 1].field] = 0, P--;
        } else {
          if (a.w2ui && (b = a.w2ui.colspan, p = this.columns[A].field, b) && b[p] === 0 && delete b[p], !(A < this.last.colStart || A > this.last.colEnd) || f.frozen) {
            if (a.w2ui && typeof a.w2ui.colspan == "object") {
              var x = parseInt(a.w2ui.colspan[f.field]) || null;
              if (1 < x) {
                let q = 0;
                for (let G = A; G < A + x && !(G >= this.columns.length); G++) this.columns[G].hidden && q++;
                X = x - q, P = x - 1;
              }
            }
            var b = this.getCellHTML(e, A, s, X);
            f.frozen ? i += b : n += b;
          }
          A++;
        }
      }
      i += '<td class="w2ui-grid-data-last"></td>', n += '<td class="w2ui-grid-data-last" col="end"></td>';
    }
    return i += "</tr>", n += "</tr>", [i, n];
  }
  getLineHTML(e) {
    return "<div>" + e + "</div>";
  }
  getCellHTML(e, t, s, i) {
    var _a2, _b, _c2, _d;
    let n = this, o = this.columns[t];
    if (o == null) return "";
    let a = (s !== true ? this.records : this.summary)[e], { value: l, style: c, className: h, attr: p, divAttr: f } = this.getCellValue(e, t, s, true);
    var x = e !== -1 ? this.getCellEditable(e, t) : "";
    let b = "max-height: " + parseInt(this.recordHeight) + "px;" + (o.clipboardCopy ? "margin-right: 20px" : "");
    var C = !s && ((_a2 = a == null ? void 0 : a.w2ui) == null ? void 0 : _a2.changes) && a.w2ui.changes[o.field] != null, _ = this.last.selection;
    let S = false, A = "";
    if (_.indexes.indexOf(e) != -1 && (S = true), i == null && (i = ((_b = a == null ? void 0 : a.w2ui) == null ? void 0 : _b.colspan) && a.w2ui.colspan[o.field] ? a.w2ui.colspan[o.field] : 1), t === 0 && Array.isArray((_c2 = a == null ? void 0 : a.w2ui) == null ? void 0 : _c2.children)) {
      let U = 0, K = this.get(a.w2ui.parent_recid, true);
      for (; K != null; ) {
        U++;
        var P = this.records[K].w2ui;
        if (P == null || P.parent_recid == null) break;
        K = this.get(P.parent_recid, true);
      }
      if (a.w2ui.parent_recid) for (let D = 0; D < U; D++) A += '<span class="w2ui-show-children w2ui-icon-empty"></span>';
      var X = 0 < a.w2ui.children.length ? a.w2ui.expanded ? "w2ui-icon-collapse" : "w2ui-icon-expand" : "w2ui-icon-empty";
      A += `<span class="w2ui-show-children ${X}"></span>`;
    }
    if (o.info === true && (o.info = {}), o.info != null) {
      let U = "w2ui-icon-info", K = (typeof o.info.icon == "function" ? U = o.info.icon(a, { self: this, index: e, colIndex: t, summary: !!s }) : typeof o.info.icon == "object" ? U = o.info.icon[this.parseField(a, o.field)] || "" : typeof o.info.icon == "string" && (U = o.info.icon), o.info.style || "");
      typeof o.info.style == "function" ? K = o.info.style(a, { self: this, index: e, colIndex: t, summary: !!s }) : typeof o.info.style == "object" ? K = o.info.style[this.parseField(a, o.field)] || "" : typeof o.info.style == "string" && (K = o.info.style), A += `<span class="w2ui-info ${U}" style="${K}"></span>`;
    }
    let q = l, G = (x && ["checkbox", "check"].indexOf(x.type) != -1 && (b += "text-align: center;", q = `<input tabindex="-1" type="checkbox" class="w2ui-editable-checkbox"
                            data-changeInd="${s ? -(e + 1) : e}" data-colInd="${t}" ${q ? 'checked="checked"' : ""}>`, A = ""), (q = `<div style="${b}" ${function(U) {
      let K;
      return n.show.recordTitles && (o.title != null ? (typeof o.title == "function" && (K = o.title.call(n, a, { self: this, index: e, colIndex: t, summary: !!s })), typeof o.title == "string" && (K = o.title)) : K = w.stripTags(String(U).replace(/"/g, "''"))), K != null ? 'title="' + String(K) + '"' : "";
    }(q)} ${f}>${A}${String(q)}</div>`) == null && (q = ""), typeof o.render == "string" && (X = o.render.toLowerCase().split(":"), ["number", "int", "float", "money", "currency", "percent", "size"].indexOf(X[0]) != -1) && (c += "text-align: right;"), (a == null ? void 0 : a.w2ui) && (typeof a.w2ui.style == "object" && (typeof a.w2ui.style[t] == "string" && (c += a.w2ui.style[t] + ";"), typeof a.w2ui.style[o.field] == "string") && (c += a.w2ui.style[o.field] + ";"), typeof a.w2ui.class == "object") && (typeof a.w2ui.class[t] == "string" && (h += a.w2ui.class[t] + " "), typeof a.w2ui.class[o.field] == "string") && (h += a.w2ui.class[o.field] + " "), false);
    S && ((_d = _.columns[e]) == null ? void 0 : _d.includes(t)) && (G = true);
    let W;
    return o.clipboardCopy && (W = '<span class="w2ui-clipboard-copy w2ui-icon-paste"></span>'), q = '<td class="w2ui-grid-data' + (G ? " w2ui-selected" : "") + " " + h + (C ? " w2ui-changed" : "") + '"    id="grid_' + this.name + "_data_" + e + "_" + t + '" col="' + t + '"    style="' + c + (o.style != null ? o.style : "") + '" ' + (o.attr != null ? o.attr : "") + p + (1 < i ? 'colspan="' + i + '"' : "") + ">" + q + (W && w.stripTags(q) ? W : "") + "</td>", q = e === -1 && s === true ? '<td class="w2ui-grid-data" col="' + t + '" style="height: 0px; ' + c + '" ' + (1 < i ? 'colspan="' + i + '"' : "") + "></td>" : q;
  }
  clipboardCopy(e, t, s) {
    var i = (s ? this.summary : this.records)[e], n = this.columns[t];
    let o = n ? this.parseField(i, n.field) : "";
    typeof n.clipboardCopy == "function" && (o = n.clipboardCopy(i, { self: this, index: e, colIndex: t, summary: !!s })), d(this.box).find("#grid_" + this.name + "_focus").text(o).get(0).select(), document.execCommand("copy");
  }
  showBubble(e, t, s) {
    var i = this.columns[t].info;
    if (i) {
      let f = "";
      var n = this.records[e], o = d(this.box).find(`${s ? ".w2ui-grid-summary" : ""} #grid_${this.name}_data_${e}_${t} .w2ui-info`);
      if (this.last.bubbleEl && rt.hide(this.name + "-bubble"), this.last.bubbleEl = o, i.fields == null) {
        i.fields = [];
        for (let b = 0; b < this.columns.length; b++) {
          var a = this.columns[b];
          i.fields.push(a.field + (typeof a.render == "string" ? ":" + a.render : ""));
        }
      }
      let x = i.fields;
      if (typeof x == "function" && (x = x(n, { self: this, index: e, colIndex: t, summary: !!s })), typeof i.render == "function") f = i.render(n, { self: this, index: e, colIndex: t, summary: !!s });
      else if (Array.isArray(x)) {
        f = '<table cellpadding="0" cellspacing="0">';
        for (let b = 0; b < x.length; b++) {
          var l = String(x[b]).split(":");
          if (l[0] == "" || l[0] == "-" || l[0] == "--" || l[0] == "---") f += '<tr><td colspan=2><div style="border-top: ' + (l[0] == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          else {
            let C = this.getColumn(l[0]), _ = (C = C ?? { field: l[0], caption: l[0] }) ? this.parseField(n, C.field) : "";
            1 < l.length && (w.formatters[l[1]] ? _ = w.formatters[l[1]](_, l[2] || null, n) : console.log('ERROR: w2utils.formatters["' + l[1] + '"] does not exists.')), (i.showEmpty === true || _ != null && _ != "") && (i.maxLength != null && typeof _ == "string" && _.length > i.maxLength && (_ = _.substr(0, i.maxLength) + "..."), f += "<tr><td>" + C.text + "</td><td>" + ((_ === 0 ? "0" : _) || "") + "</td></tr>");
          }
        }
        f += "</table>";
      } else if (w.isPlainObject(x)) {
        for (var c in f = '<table cellpadding="0" cellspacing="0">', x) {
          var h = x[c];
          if (h == "" || h == "-" || h == "--" || h == "---") f += '<tr><td colspan=2><div style="border-top: ' + (h == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          else {
            var p = String(h).split(":");
            let b = this.getColumn(p[0]), C = (b = b ?? { field: p[0], caption: p[0] }) ? this.parseField(n, b.field) : "";
            1 < p.length && (w.formatters[p[1]] ? C = w.formatters[p[1]](C, p[2] || null, n) : console.log('ERROR: w2utils.formatters["' + p[1] + '"] does not exists.')), typeof h == "function" && (C = h(n, { self: this, index: e, colIndex: t, summary: !!s })), (i.showEmpty === true || C != null && C != "") && (i.maxLength != null && typeof C == "string" && C.length > i.maxLength && (C = C.substr(0, i.maxLength) + "..."), f += "<tr><td>" + c + "</td><td>" + ((C === 0 ? "0" : C) || "") + "</td></tr>");
          }
        }
        f += "</table>";
      }
      return rt.show(w.extend({ name: this.name + "-bubble", html: f, anchor: o.get(0), position: "top|bottom", class: "w2ui-info-bubble", style: "", hideOn: ["doc-click"] }, i.options ?? {})).hide(() => [this.last.bubbleEl = null]);
    }
  }
  getCellEditable(e, t) {
    var s = this.columns[t], i = this.records[e];
    if (!i || !s) return null;
    let n = i.w2ui ? i.w2ui.editable : null;
    return n === false ? null : (n != null && n !== true || typeof (n = 0 < Object.keys(s.editable ?? {}).length ? s.editable : null) == "function" && (s = this.getCellValue(e, t, false), n = n.call(this, i, { self: this, value: s, index: e, colIndex: t })), n);
  }
  getCellValue(e, t, s, i) {
    var _a2, _b;
    var n = this.columns[t], o = (s !== true ? this.records : this.summary)[e];
    let a = this.parseField(o, n.field), l = "", c = "", h = "", p = "";
    if (((_b = (_a2 = o == null ? void 0 : o.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b[n.field]) != null && (a = o.w2ui.changes[n.field]), n.render != null && e !== -1) {
      if (typeof n.render == "function" && o != null) {
        let f;
        try {
          f = n.render(o, { self: this, value: a, index: e, colIndex: t, summary: !!s });
        } catch (x) {
          throw new Error(`Render function for column "${n.field}" in grid "${this.name}": -- ` + x.message);
        }
        f != null && typeof f == "object" && typeof f != "function" ? (f.id != null && f.text != null ? a = f.text : typeof f.html == "string" ? a = (f.html || "").trim() : (a = "", console.log("ERROR: render function should return a primitive or an object of the following structure.", { html: "", attr: "", style: "", class: "", divAttr: "" })), h = f.attr ?? "", c = f.style ?? "", l = f.class ?? "", p = f.divAttr ?? "") : a = String(f || "").trim();
      }
      if (typeof n.render == "object" && (e = n.render[a]) != null && e !== "" && (a = e), typeof n.render == "string") {
        t = n.render.toLowerCase().indexOf(":"), s = [], t == -1 ? (s[0] = n.render.toLowerCase(), s[1] = "") : (s[0] = n.render.toLowerCase().substr(0, t), s[1] = n.render.toLowerCase().substr(t + 1));
        let f = w.formatters[s[0]];
        n.options && n.options.autoFormat === false && (f = null), a = typeof f == "function" ? f(a, s[1], o) : "";
      }
    }
    return a == null && (a = ""), i ? { value: a, attr: h, style: c, className: l, divAttr: p } : a;
  }
  getFooterHTML() {
    return '<div>    <div class="w2ui-footer-left"></div>    <div class="w2ui-footer-right"></div>    <div class="w2ui-footer-center"></div></div>';
  }
  status(e) {
    if (e != null) d(this.box).find(`#grid_${this.name}_footer`).find(".w2ui-footer-left").html(e);
    else {
      let t = "";
      if (e = this.getSelection(), 0 < e.length && (this.show.statusSelection && 1 < e.length && (t = String(e.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + w.settings.groupSymbol) + " " + w.lang("selected")), this.show.statusRecordID) && e.length == 1) {
        let s = e[0];
        typeof s == "object" && (s = s.recid + ", " + w.lang("Column") + ": " + s.column), t = w.lang("Record ID") + ": " + s + " ";
      }
      d(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-left").html(t);
    }
  }
  lock(e, t) {
    let s = Array.from(arguments);
    s.unshift(this.box), setTimeout(() => {
      d(this.box).find("#grid_" + this.name + "_empty_msg").remove(), w.lock(...s);
    }, 10);
  }
  unlock(e) {
    setTimeout(() => {
      d(this.box).find(".w2ui-message").hasClass("w2ui-closing") || w.unlock(this.box, e);
    }, 25);
  }
  stateSave(e) {
    var t = { columns: [], show: w.clone(this.show), last: { search: this.last.search, multi: this.last.multi, logic: this.last.logic, label: this.last.label, field: this.last.field, scrollTop: this.last.scrollTop, scrollLeft: this.last.scrollLeft }, sortData: [], searchData: [] };
    let s;
    for (let n = 0; n < this.columns.length; n++) {
      let o = this.columns[n], a = {};
      Object.keys(this.stateColProps).forEach((l, c) => {
        this.stateColProps[l] && (s = o[l] !== void 0 ? o[l] : this.colTemplate[l] || null, a[l] = s);
      }), t.columns.push(a);
    }
    for (let n = 0; n < this.sortData.length; n++) t.sortData.push(w.clone(this.sortData[n]));
    for (let n = 0; n < this.searchData.length; n++) t.searchData.push(w.clone(this.searchData[n]));
    var i = this.trigger("stateSave", { target: this.name, state: t });
    if (i.isCancelled !== true) return e !== true && this.cacheSave("state", t), i.finish(), t;
  }
  stateRestore(e) {
    var _a2, _b, _c2;
    let t = typeof this.url != "object" ? this.url : this.url.get;
    e = e || this.cache("state");
    var s = this.trigger("stateRestore", { target: this.name, state: e });
    if (s.isCancelled !== true) {
      if (w.isPlainObject(e)) {
        w.extend(this.show, e.show ?? {}), w.extend(this.last, e.last ?? {});
        let o = this.last.scrollTop, a = this.last.scrollLeft;
        for (let l = 0; l < ((_a2 = e.columns) == null ? void 0 : _a2.length); l++) {
          var i = e.columns[l], n = this.getColumn(i.field, true);
          n !== null && (w.extend(this.columns[n], i), l !== n) && this.columns.splice(l, 0, this.columns.splice(n, 1)[0]);
        }
        this.sortData.splice(0, this.sortData.length);
        for (let l = 0; l < ((_b = e.sortData) == null ? void 0 : _b.length); l++) this.sortData.push(e.sortData[l]);
        this.searchData.splice(0, this.searchData.length);
        for (let l = 0; l < ((_c2 = e.searchData) == null ? void 0 : _c2.length); l++) this.searchData.push(e.searchData[l]);
        setTimeout(() => {
          t || (0 < this.sortData.length && this.localSort(), 0 < this.searchData.length && this.localSearch()), this.last.scrollTop = o, this.last.scrollLeft = a, this.refresh();
        }, 1), console.log(`INFO (w2ui): state restored for "${this.name}"`);
      }
      return s.finish(), true;
    }
  }
  stateReset() {
    this.stateRestore(this.last.state), this.cacheSave("state", null);
  }
  parseField(e, t) {
    if (this.nestedFields) {
      let i = "";
      try {
        i = e;
        var s = String(t).split(".");
        for (let n = 0; n < s.length; n++) i = i[s[n]];
      } catch {
        i = "";
      }
      return i;
    }
    return e ? e[t] : "";
  }
  prepareData() {
    let e = this;
    for (let t = 0; t < this.records.length; t++) (function s(i) {
      var _a2, _b;
      for (let n = 0; n < e.columns.length; n++) {
        let o = e.columns[n];
        if (i[o.field] != null && typeof o.render == "string") {
          if (["number", "int", "float", "money", "currency", "percent"].indexOf(o.render.split(":")[0]) != -1 && typeof i[o.field] != "number" && (i[o.field] = parseFloat(i[o.field])), ["date", "age"].indexOf(o.render.split(":")[0]) != -1 && !i[o.field + "_"]) {
            let a = i[o.field];
            w.isInt(a) && (a = parseInt(a)), i[o.field + "_"] = new Date(a);
          }
          if (["time"].indexOf(o.render) != -1) if (w.isTime(i[o.field])) {
            let a = w.isTime(i[o.field], true), l = /* @__PURE__ */ new Date();
            l.setHours(a.hours, a.minutes, a.seconds || 0, 0), i[o.field + "_"] || (i[o.field + "_"] = l);
          } else {
            let a = i[o.field], l = (a = (a = w.isInt(a) ? parseInt(a) : a) != null ? new Date(a) : /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
            l.setHours(a.getHours(), a.getMinutes(), a.getSeconds(), 0), i[o.field + "_"] || (i[o.field + "_"] = l);
          }
        }
      }
      if (((_a2 = i.w2ui) == null ? void 0 : _a2.children) && ((_b = i.w2ui) == null ? void 0 : _b.expanded) !== true) for (let n = 0; n < i.w2ui.children.length; n++) {
        let o = i.w2ui.children[n];
        s(o);
      }
    })(this.records[t]);
  }
  nextCell(e, t, s) {
    if (t += 1, t >= this.columns.length) return (e = this.nextRow(e)) == null ? e : this.nextCell(e, -1, s);
    var n = this.records[e].w2ui, i = this.columns[t], n = n && n.colspan && !isNaN(n.colspan[i.field]) ? parseInt(n.colspan[i.field]) : 1;
    return i == null ? null : i && i.hidden || n === 0 ? this.nextCell(e, t, s) : s && (i = this.getCellEditable(e, t), i == null || ["checkbox", "check"].indexOf(i.type) != -1) ? this.nextCell(e, t, s) : { index: e, colIndex: t };
  }
  prevCell(e, t, s) {
    if (t -= 1, t < 0) return (e = this.prevRow(e)) == null ? e : this.prevCell(e, this.columns.length, s);
    if (t < 0) return null;
    var n = this.records[e].w2ui, i = this.columns[t], n = n && n.colspan && !isNaN(n.colspan[i.field]) ? parseInt(n.colspan[i.field]) : 1;
    return i == null ? null : i && i.hidden || n === 0 ? this.prevCell(e, t, s) : s && (i = this.getCellEditable(e, t), i == null || ["checkbox", "check"].indexOf(i.type) != -1) ? this.prevCell(e, t, s) : { index: e, colIndex: t };
  }
  nextRow(e, t, s) {
    var i = this.last.searchIds;
    let n = null;
    if ((s = s ?? 1) == -1) return this.records.length - 1;
    if (e + s < this.records.length && i.length === 0 || 0 < i.length && e < i[i.length - s]) {
      if (e += s, 0 < i.length) for (; !(i.includes(e) || e > this.records.length); ) e += s;
      var a = this.records[e].w2ui, o = this.columns[t], a = a && a.colspan && o != null && !isNaN(a.colspan[o.field]) ? parseInt(a.colspan[o.field]) : 1;
      n = a === 0 ? this.nextRow(e, t, s) : e;
    }
    return n;
  }
  prevRow(e, t, s) {
    var i = this.last.searchIds;
    let n = null;
    if ((s = s ?? 1) == -1) return 0;
    if (0 <= e - s && i.length === 0 || 0 < i.length && e > i[0]) {
      if (e -= s, 0 < i.length) for (; !(i.includes(e) || e < 0); ) e -= s;
      var a = this.records[e].w2ui, o = this.columns[t], a = a && a.colspan && o != null && !isNaN(a.colspan[o.field]) ? parseInt(a.colspan[o.field]) : 1;
      n = a === 0 ? this.prevRow(e, t, s) : e;
    }
    return n;
  }
  selectionSave() {
    return this.last.saved_sel = this.getSelection(), this.last.saved_sel;
  }
  selectionRestore(e) {
    var t, s = Date.now(), i = (this.last.selection = { indexes: [], columns: {} }, this.last.selection), n = this.last.saved_sel;
    if (n) for (let o = 0; o < n.length; o++) w.isPlainObject(n[o]) ? (t = this.get(n[o].recid, true)) != null && (i.indexes.indexOf(t) == -1 && i.indexes.push(t), i.columns[t] || (i.columns[t] = []), i.columns[t].push(n[o].column)) : (t = this.get(n[o], true)) != null && i.indexes.push(t);
    return delete this.last.saved_sel, e !== true && this.refresh(), Date.now() - s;
  }
  message(e) {
    return w.message({ owner: this, box: this.box, after: ".w2ui-grid-header" }, e);
  }
  confirm(e) {
    return w.confirm({ owner: this, box: this.box, after: ".w2ui-grid-header" }, e);
  }
}
class yn extends ni {
  constructor(e, t) {
    super(), typeof e == "string" && t == null && (t = { type: e }), typeof e == "object" && t == null && (t = w.clone(e)), typeof e == "string" && typeof t == "object" && (t.type = e), t.type = String(t.type).toLowerCase(), this.el = t.el ?? null, this.selected = null, this.helpers = {}, this.type = t.type ?? "text", this.options = w.clone(t), this.onClick = t.onClick ?? null, this.onAdd = t.onAdd ?? null, this.onNew = t.onNew ?? null, this.onRemove = t.onRemove ?? null, this.onMouseEnter = t.onMouseEnter ?? null, this.onMouseLeave = t.onMouseLeave ?? null, this.onScroll = t.onScroll ?? null, this.tmp = {}, delete this.options.type, delete this.options.onClick, delete this.options.onMouseEnter, delete this.options.onMouseLeave, delete this.options.onScroll, this.el && this.render(this.el);
  }
  render(e) {
    e instanceof HTMLElement ? (e._w2field ? e._w2field.reset() : e._w2field = this, this.el = e, this.init()) : console.log("ERROR: Cannot init w2field on empty subject");
  }
  init() {
    let e = this.options, t;
    if (["INPUT", "TEXTAREA"].includes(this.el.tagName.toUpperCase())) {
      switch (this.type) {
        case "text":
        case "int":
        case "float":
        case "money":
        case "currency":
        case "percent":
        case "alphanumeric":
        case "bin":
        case "hex":
          t = { min: null, max: null, step: 1, autoFormat: true, autoCorrect: true, currencyPrefix: w.settings.currencyPrefix, currencySuffix: w.settings.currencySuffix, currencyPrecision: w.settings.currencyPrecision, decimalSymbol: w.settings.decimalSymbol, groupSymbol: w.settings.groupSymbol, arrow: false, keyboard: true, precision: null, prefix: "", suffix: "" }, this.options = w.extend({}, t, e), (e = this.options).numberRE = new RegExp("[" + e.groupSymbol + "]", "g"), e.moneyRE = new RegExp("[" + e.currencyPrefix + e.currencySuffix + e.groupSymbol + "]", "g"), e.percentRE = new RegExp("[" + e.groupSymbol + "%]", "g"), ["text", "alphanumeric", "hex", "bin"].includes(this.type) && (e.arrow = false, e.keyboard = false);
          break;
        case "color":
          t = { prefix: "#", suffix: `<div style="width: ${parseInt(getComputedStyle(this.el)["font-size"]) || 12}px">&#160;</div>`, arrow: false, advanced: null, transparent: true }, this.options = w.extend({}, t, e), e = this.options;
          break;
        case "date":
          t = { format: w.settings.dateFormat, keyboard: true, autoCorrect: true, start: null, end: null, blockDates: [], blockWeekdays: [], colored: {}, btnNow: true }, this.options = w.extend({ type: "date" }, t, e), e = this.options, d(this.el).attr("placeholder") == null && d(this.el).attr("placeholder", e.format);
          break;
        case "time":
          t = { format: w.settings.timeFormat, keyboard: true, autoCorrect: true, start: null, end: null, btnNow: true, noMinutes: false }, this.options = w.extend({ type: "time" }, t, e), e = this.options, d(this.el).attr("placeholder") == null && d(this.el).attr("placeholder", e.format);
          break;
        case "datetime":
          t = { format: w.settings.dateFormat + "|" + w.settings.timeFormat, keyboard: true, autoCorrect: true, start: null, end: null, startTime: null, endTime: null, blockDates: [], blockWeekdays: [], colored: {}, btnNow: true, noMinutes: false }, this.options = w.extend({ type: "datetime" }, t, e), e = this.options, d(this.el).attr("placeholder") == null && d(this.el).attr("placeholder", e.placeholder || e.format);
          break;
        case "list":
        case "combo":
          t = { items: [], selected: {}, url: null, recId: null, recText: null, method: null, debounce: 250, postData: {}, minLength: 1, cacheMax: 250, maxDropHeight: 350, maxDropWidth: null, minDropWidth: null, match: "begins", icon: null, iconStyle: "", align: "both", altRows: true, renderDrop: null, compare: null, filter: true, hideSelected: false, prefix: "", suffix: "", msgNoItems: "No matches", msgSearch: "Type to search...", openOnFocus: false, markSearch: false, onSearch: null, onRequest: null, onLoad: null, onError: null }, typeof e.items == "function" && (e._items_fun = e.items), e.items = w.normMenu.call(this, e.items), this.type === "list" && (d(this.el).addClass("w2ui-select"), !w.isPlainObject(e.selected)) && Array.isArray(e.items) && e.items.forEach((s) => {
            s && s.id === e.selected && (e.selected = w.clone(s));
          }), e = w.extend({}, t, e), this.options = e, w.isPlainObject(e.selected) || (e.selected = {}), this.selected = e.selected, d(this.el).attr("autocapitalize", "off").attr("autocomplete", "off").attr("autocorrect", "off").attr("spellcheck", "false"), e.selected.text != null && d(this.el).val(e.selected.text);
          break;
        case "enum":
          t = { items: [], selected: [], max: 0, url: null, recId: null, recText: null, debounce: 250, method: null, postData: {}, minLength: 1, cacheMax: 250, maxItemWidth: 250, maxDropHeight: 350, maxDropWidth: null, match: "contains", align: "", altRows: true, openOnFocus: false, markSearch: false, renderDrop: null, renderItem: null, compare: null, filter: true, hideSelected: true, style: "", msgNoItems: "No matches", msgSearch: "Type to search...", onSearch: null, onRequest: null, onLoad: null, onError: null, onClick: null, onAdd: null, onNew: null, onRemove: null, onMouseEnter: null, onMouseLeave: null, onScroll: null }, typeof (e = w.extend({}, t, e, { suffix: "" })).items == "function" && (e._items_fun = e.items), e.items = w.normMenu.call(this, e.items), e.selected = w.normMenu.call(this, e.selected), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected;
          break;
        case "file":
          t = { selected: [], max: 0, maxSize: 0, maxFileSize: 0, maxItemWidth: 250, maxDropHeight: 350, maxDropWidth: null, readContent: true, silent: true, align: "both", altRows: true, renderItem: null, style: "", onClick: null, onAdd: null, onRemove: null, onMouseEnter: null, onMouseLeave: null }, e = w.extend({}, t, e), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected, d(this.el).attr("placeholder") == null && d(this.el).attr("placeholder", w.lang("Attach files by dragging and dropping or Click to Select"));
      }
      d(this.el).css("box-sizing", "border-box").addClass("w2field w2ui-input").off(".w2field").on("change.w2field", (s) => {
        this.change(s);
      }).on("click.w2field", (s) => {
        this.click(s);
      }).on("focus.w2field", (s) => {
        this.focus(s);
      }).on("blur.w2field", (s) => {
        this.type !== "list" && this.blur(s);
      }).on("keydown.w2field", (s) => {
        this.keyDown(s);
      }).on("keyup.w2field", (s) => {
        this.keyUp(s);
      }), this.addPrefix(), this.addSuffix(), this.addSearch(), this.addMultiSearch(), this.change(new Event("change"));
    } else console.log("ERROR: w2field could only be applied to INPUT or TEXTAREA.", this.el);
  }
  get() {
    return ["list", "enum", "file"].indexOf(this.type) !== -1 ? this.selected : d(this.el).val();
  }
  set(e, t) {
    ["list", "enum", "file"].indexOf(this.type) !== -1 ? (this.type !== "list" && t ? (Array.isArray(this.selected) || (this.selected = []), this.selected.push(e), (t = Jt.get(this.el.id + "_menu")) && (t.options.selected = this.selected)) : (e == null && (e = []), t = this.type !== "enum" || Array.isArray(e) ? e : [e], this.selected = t), d(this.el).trigger("input").trigger("change"), this.refresh()) : d(this.el).val(e);
  }
  setIndex(e, t) {
    if (["list", "enum"].indexOf(this.type) !== -1) {
      var s = this.options.items;
      if (s && s[e]) return this.type == "list" && (this.selected = s[e]), this.type == "enum" && (t || (this.selected = []), this.selected.push(s[e])), (t = Jt.get(this.el.id + "_menu")) && (t.options.selected = this.selected), d(this.el).trigger("input").trigger("change"), this.refresh(), true;
    }
    return false;
  }
  refresh() {
    var _a2, _b;
    let e = this.options;
    var t = Date.now(), s = getComputedStyle(this.el);
    if (this.type == "list") {
      if (d(this.el).parent().css("white-space", "nowrap"), this.helpers.prefix && this.helpers.prefix.hide(), !this.helpers.search) return;
      this.selected == null && e.icon ? e.prefix = `
                    <span class="w2ui-icon ${e.icon} "style="cursor: pointer; font-size: 14px;
                        display: inline-block; margin-top: -1px; color: #7F98AD; ${e.iconStyle}">
                    </span>` : e.prefix = "", this.addPrefix();
      let l = d(this.helpers.search_focus);
      var i = d(l[0].previousElementSibling);
      l.css({ outline: "none" }), l.val() === "" ? (l.css("opacity", 0), i.css("opacity", 0), ((_a2 = this.selected) == null ? void 0 : _a2.id) ? (a = this.selected.text, o = this.findItemIndex(e.items, this.selected.id), a != null && d(this.el).val(w.lang(a)).data({ selected: a, selectedIndex: o[0] })) : (this.el.value = "", d(this.el).removeData("selected selectedIndex"))) : (l.css("opacity", 1), i.css("opacity", 1), d(this.el).val(""), setTimeout(() => {
        this.helpers.prefix && this.helpers.prefix.hide(), e.icon ? (l.css("margin-left", "17px"), d(this.helpers.search).find(".w2ui-icon-search").addClass("show-search")) : (l.css("margin-left", "0px"), d(this.helpers.search).find(".w2ui-icon-search").removeClass("show-search"));
      }, 1)), d(this.el).prop("readOnly") || d(this.el).prop("disabled") ? setTimeout(() => {
        this.helpers.prefix && d(this.helpers.prefix).css("opacity", "0.6"), this.helpers.suffix && d(this.helpers.suffix).css("opacity", "0.6");
      }, 1) : setTimeout(() => {
        this.helpers.prefix && d(this.helpers.prefix).css("opacity", "1"), this.helpers.suffix && d(this.helpers.suffix).css("opacity", "1");
      }, 1);
    }
    let n = this.helpers.multi;
    if (["enum", "file"].includes(this.type) && n) {
      let l = "";
      Array.isArray(this.selected) && this.selected.forEach((c, h) => {
        c != null && (l += `
                        <div class="li-item" index="${h}" style="max-width: ${parseInt(e.maxItemWidth)}px; ${c.style || ""}">
                        ${typeof e.renderItem == "function" ? e.renderItem(c, h, `<div class="w2ui-list-remove" index="${h}">&#160;&#160;</div>`) : `
                               ${c.icon ? `<span class="w2ui-icon ${c.icon}"></span>` : ""}
                               <div class="w2ui-list-remove" index="${h}">&#160;&#160;</div>
                               ${(this.type === "enum" ? c.text : c.name) ?? c.id ?? c}
                               ${c.size ? `<span class="file-size"> - ${w.formatSize(c.size)}</span>` : ""}
                            `}
                        </div>`);
      });
      var o, a = n.find(".w2ui-multi-items");
      e.style && n.attr("style", n.attr("style") + ";" + e.style), d(this.el).css("z-index", "-1"), d(this.el).prop("readOnly") || d(this.el).prop("disabled") ? setTimeout(() => {
        n[0].scrollTop = 0, n.addClass("w2ui-readonly").find(".li-item").css("opacity", "0.9").parent().find(".li-search").hide().find("input").prop("readOnly", true).closest(".w2ui-multi-items").find(".w2ui-list-remove").hide();
      }, 1) : setTimeout(() => {
        n.removeClass("w2ui-readonly").find(".li-item").css("opacity", "1").parent().find(".li-search").show().find("input").prop("readOnly", false).closest(".w2ui-multi-items").find(".w2ui-list-remove").show();
      }, 1), 0 < ((_b = this.selected) == null ? void 0 : _b.length) && d(this.el).attr("placeholder", ""), n.find(".w2ui-enum-placeholder").remove(), a.find(".li-item").remove(), l !== "" ? a.prepend(l) : d(this.el).attr("placeholder") != null && n.find("input").val() === "" && (o = w.stripSpaces(`
                    padding-top: ${s["padding-top"]};
                    padding-left: ${s["padding-left"]};
                    box-sizing: ${s["box-sizing"]};
                    line-height: ${s["line-height"]};
                    font-size: ${s["font-size"]};
                    font-family: ${s["font-family"]};
                `), n.prepend(`<div class="w2ui-enum-placeholder" style="${o}">${d(this.el).attr("placeholder")}</div>`)), n.off(".w2item").on("scroll.w2item", (c) => {
        c = this.trigger("scroll", { target: this.el, originalEvent: c }), c.isCancelled !== true && (rt.hide(this.el.id + "_preview"), c.finish());
      }).find(".li-item").on("click.w2item", (c) => {
        var h = d(c.target).closest(".li-item"), p = h.attr("index"), f = this.selected[p];
        if (!d(h).hasClass("li-search")) {
          c.stopPropagation();
          let x;
          if (d(c.target).hasClass("w2ui-list-remove")) d(this.el).prop("readOnly") || d(this.el).prop("disabled") || (x = this.trigger("remove", { target: this.el, originalEvent: c, item: f })).isCancelled !== true && (this.selected.splice(p, 1), d(this.el).trigger("input").trigger("change"), d(c.target).remove());
          else if ((x = this.trigger("click", { target: this.el, originalEvent: c.originalEvent, item: f })).isCancelled !== true) {
            let b = f.tooltip;
            if (this.type === "file" && (/image/i.test(f.type) && (b = `
                                    <div class="w2ui-file-preview">
                                        <img src="${f.content ? "data:" + f.type + ";base64," + f.content : ""}"
                                            style="max-width: 300px">
                                    </div>`), b += `
                                <div class="w2ui-file-info">
                                    <div class="file-caption">${w.lang("Name")}:</div>
                                    <div class="file-value">${f.name}</div>
                                    <div class="file-caption">${w.lang("Size")}:</div>
                                    <div class="file-value">${w.formatSize(f.size)}</div>
                                    <div class="file-caption">${w.lang("Type")}:</div>
                                    <div class="file-value file-type">${f.type}</div>
                                    <div class="file-caption">${w.lang("Modified")}:</div>
                                    <div class="file-value">${w.date(f.modified)}</div>
                                </div>`), b) {
              let C = this.el.id + "_preview";
              rt.show({ name: C, anchor: h.get(0), html: b, hideOn: ["doc-click"], class: "" }).show((_) => {
                d(`#w2overlay-${C} img`).on("load", function(S) {
                  var A = this.clientWidth, P = this.clientHeight;
                  A < 300 & P < 300 || (P <= A && 300 < A && d(this).css("width", "300px"), A < P && 300 < P && d(this).css("height", "300px"));
                }).on("error", function(S) {
                  this.style.display = "none";
                });
              });
            }
            x.finish();
          }
        }
      }).on("mouseenter.w2item", (c) => {
        var h = d(c.target).closest(".li-item");
        d(h).hasClass("li-search") || (h = this.selected[d(c.target).attr("index")], (c = this.trigger("mouseEnter", { target: this.el, originalEvent: c, item: h })).isCancelled !== true && c.finish());
      }).on("mouseleave.w2item", (c) => {
        var h = d(c.target).closest(".li-item");
        d(h).hasClass("li-search") || (h = this.selected[d(c.target).attr("index")], (c = this.trigger("mouseLeave", { target: this.el, originalEvent: c, item: h })).isCancelled !== true && c.finish());
      }), this.type === "enum" ? this.helpers.multi.find("input").css({ width: "15px" }) : this.helpers.multi.find(".li-search").hide(), this.resize();
    }
    return Date.now() - t;
  }
  resize() {
    var e = this.el.clientWidth, t = getComputedStyle(this.el), o = this.helpers.search, s = this.helpers.multi, i = this.helpers.suffix, n = this.helpers.prefix, o = (o && d(o).css("width", e), s && d(s).css("width", e - parseInt(t["margin-left"], 10) - parseInt(t["margin-right"], 10)), i && this.addSuffix(), n && this.addPrefix(), this.helpers.multi);
    if (["enum", "file"].includes(this.type) && o) {
      d(this.el).css("height", "auto");
      let a = d(o).find(":scope div.w2ui-multi-items").get(0).clientHeight + 5;
      (a = (a = a < 20 ? 20 : a) > this.tmp["max-height"] ? this.tmp["max-height"] : a) < this.tmp["min-height"] && (a = this.tmp["min-height"]), s = w.getSize(this.el, "height") - 2, s > a && (a = s), d(o).css({ height: a + "px", overflow: a == this.tmp["max-height"] ? "auto" : "hidden" }), d(o).css("height", a + "px"), d(this.el).css({ height: a + "px" });
    }
    this.tmp.current_width = e;
  }
  reset() {
    this.tmp != null && (d(this.el).css("height", "auto"), Array("padding-left", "padding-right", "background-color", "border-color").forEach((e) => {
      this.tmp && this.tmp["old-" + e] != null && (d(this.el).css(e, this.tmp["old-" + e]), delete this.tmp["old-" + e]);
    }), clearInterval(this.tmp.sizeTimer)), d(this.el).val(this.clean(d(this.el).val())).removeClass("w2field").removeData("selected selectedIndex").off(".w2field"), Object.keys(this.helpers).forEach((e) => {
      d(this.helpers[e]).remove();
    }), this.helpers = {};
  }
  clean(e) {
    var t;
    return e = typeof e != "number" && (t = this.options, e = String(e).trim(), ["int", "float", "money", "currency", "percent"].includes(this.type)) ? (e = typeof e == "string" ? (e = t.autoFormat && (["money", "currency"].includes(this.type) && (e = String(e).replace(t.moneyRE, "")), this.type === "percent" && (e = String(e).replace(t.percentRE, "")), ["int", "float"].includes(this.type)) ? String(e).replace(t.numberRE, "") : e).replace(/\s+/g, "").replace(new RegExp(t.groupSymbol, "g"), "").replace(t.decimalSymbol, ".") : e) !== "" && w.isFloat(e) ? Number(e) : "" : e;
  }
  format(e) {
    var t = this.options;
    if (t.autoFormat && e !== "") {
      switch (this.type) {
        case "money":
        case "currency":
          (e = w.formatNumber(e, t.currencyPrecision, true)) !== "" && (e = t.currencyPrefix + e + t.currencySuffix);
          break;
        case "percent":
          (e = w.formatNumber(e, t.precision, true)) !== "" && (e += "%");
          break;
        case "float":
          e = w.formatNumber(e, t.precision, true);
          break;
        case "int":
          e = w.formatNumber(e, 0, true);
      }
      var s = parseInt(1e3).toLocaleString(w.settings.locale, { useGrouping: true }).slice(1, 2);
      s !== this.options.groupSymbol && (e = e.replaceAll(s, this.options.groupSymbol));
    }
    return e;
  }
  change(e) {
    if (["int", "float", "money", "currency", "percent"].indexOf(this.type) !== -1) {
      var t = d(this.el).val(), s = this.format(this.clean(d(this.el).val()));
      if (t !== "" && t != s) return d(this.el).val(s), e.stopPropagation(), e.preventDefault(), false;
    }
    if (this.type === "color") {
      let i = d(this.el).val();
      i.substr(0, 3).toLowerCase() !== "rgb" && (i = "#" + i, (t = d(this.el).val().length) !== 8) && t !== 6 && t !== 3 && (i = ""), s = d(this.el).get(0).nextElementSibling, d(s).find("div").css("background-color", i), d(this.el).hasClass("has-focus") && this.updateOverlay();
    }
    if (["list", "enum", "file"].indexOf(this.type) !== -1 && this.refresh(), ["date", "time", "datetime"].indexOf(this.type) !== -1) {
      let i = parseInt(this.el.value);
      w.isInt(this.el.value) && 3e3 < i && (this.type === "time" && (i = w.formatTime(new Date(i), this.options.format)), this.type === "date" && (i = w.formatDate(new Date(i), this.options.format)), this.type === "datetime" && (i = w.formatDateTime(new Date(i), this.options.format)), d(this.el).val(i).trigger("input").trigger("change"));
    }
  }
  click(e) {
    ["list", "combo", "enum"].includes(this.type) && (d(this.el).hasClass("has-focus") || this.focus(e), this.type == "combo" && this.updateOverlay(), this.type == "list") && (this.updateOverlay(), e.stopPropagation()), ["date", "time", "datetime", "color"].includes(this.type) && this.updateOverlay();
  }
  focus(e) {
    if (this.type == "list" && document.activeElement == this.el) this.helpers.search_focus.focus();
    else {
      if (["color", "date", "time", "datetime"].indexOf(this.type) !== -1) {
        if (d(this.el).prop("readOnly") || d(this.el).prop("disabled")) return;
        this.updateOverlay();
      }
      if (["list", "combo", "enum"].indexOf(this.type) !== -1) {
        if (d(this.el).prop("readOnly") || d(this.el).prop("disabled")) return void d(this.el).addClass("has-focus");
        typeof this.options._items_fun == "function" && (this.options.items = w.normMenu.call(this, this.options._items_fun)), this.helpers.search && ((t = this.helpers.search_focus).value = "", t.select()), this.type == "enum" && (t = d(this.el.previousElementSibling).find(".li-search input").get(0), document.activeElement !== t) && t.focus(), this.resize(), e.showMenu === false || this.options.openOnFocus === false && !d(this.el).hasClass("has-focus") || setTimeout(() => {
          this.updateOverlay();
        }, 100);
      }
      var t;
      this.type == "file" && (t = d(this.el).get(0).previousElementSibling, d(t).addClass("has-focus")), d(this.el).addClass("has-focus");
    }
  }
  blur(e) {
    var _a2;
    var t, s = d(this.el).val().trim();
    if (d(this.el).removeClass("has-focus"), ["int", "float", "money", "currency", "percent"].includes(this.type) && s !== "") {
      let i = s, n = "";
      this.isStrValid(s) ? (t = this.clean(s), this.options.min != null && t < this.options.min && (i = this.options.min, n = "Should be >= " + this.options.min), this.options.max != null && t > this.options.max && (i = this.options.max, n = "Should be <= " + this.options.max)) : i = "", this.options.autoCorrect && (d(this.el).val(i).trigger("input").trigger("change"), n) && (rt.show({ name: this.el.id + "_error", anchor: this.el, html: n }), setTimeout(() => {
        rt.hide(this.el.id + "_error");
      }, 3e3));
    }
    ["date", "time", "datetime"].includes(this.type) && this.options.autoCorrect && s !== "" && (t = this.type == "date" ? w.isDate : this.type == "time" ? w.isTime : w.isDateTime, Fi.inRange(this.el.value, this.options) && t.bind(w)(this.el.value, this.options.format) || d(this.el).val("").trigger("input").trigger("change")), this.type === "enum" && d(this.helpers.multi).find("input").val("").css("width", "15px"), this.type == "file" && (s = this.el.previousElementSibling, d(s).removeClass("has-focus")), this.type === "list" && (this.el.value = ((_a2 = this.selected) == null ? void 0 : _a2.text) ?? "");
  }
  keyDown(e, n) {
    var s, i = this.options, n = e.keyCode || n && n.keyCode;
    let o = false, a, l, c, h, p, f;
    if (["int", "float", "money", "currency", "percent", "hex", "bin", "color", "alphanumeric"].includes(this.type) && !(e.metaKey || e.ctrlKey || e.altKey || this.isStrValid(e.key ?? "1", true) || [9, 8, 13, 27, 37, 38, 39, 40, 46].includes(e.keyCode))) return e.preventDefault(), e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true, false;
    if (["int", "float", "money", "currency", "percent"].includes(this.type)) {
      if (!i.keyboard || d(this.el).prop("readOnly") || d(this.el).prop("disabled")) return;
      switch (a = parseFloat(d(this.el).val().replace(i.moneyRE, "")) || 0, l = i.step, (e.ctrlKey || e.metaKey) && (l = 10 * i.step), n) {
        case 38:
          e.shiftKey || (p = a + l <= i.max || i.max == null ? Number((a + l).toFixed(12)) : i.max, d(this.el).val(p).trigger("input").trigger("change"), o = true);
          break;
        case 40:
          e.shiftKey || (p = a - l >= i.min || i.min == null ? Number((a - l).toFixed(12)) : i.min, d(this.el).val(p).trigger("input").trigger("change"), o = true);
      }
      o && (e.preventDefault(), this.moveCaret2end());
    }
    if (["date", "datetime"].includes(this.type)) {
      if (!i.keyboard || d(this.el).prop("readOnly") || d(this.el).prop("disabled")) return;
      var x = (this.type == "date" ? w.isDate : w.isDateTime).bind(w), b = (this.type == "date" ? w.formatDate : w.formatDateTime).bind(w);
      switch (c = 864e5, l = 1, (e.ctrlKey || e.metaKey) && (l = 10), (h = x(d(this.el).val(), i.format, true)) || (h = /* @__PURE__ */ new Date(), c = 0), n) {
        case 38:
          e.shiftKey || (l == 10 ? h.setMonth(h.getMonth() + 1) : h.setTime(h.getTime() + c), f = b(h.getTime(), i.format), d(this.el).val(f).trigger("input").trigger("change"), o = true);
          break;
        case 40:
          e.shiftKey || (l == 10 ? h.setMonth(h.getMonth() - 1) : h.setTime(h.getTime() - c), f = b(h.getTime(), i.format), d(this.el).val(f).trigger("input").trigger("change"), o = true);
      }
      o && (e.preventDefault(), this.moveCaret2end(), this.updateOverlay());
    }
    if (this.type === "time") {
      if (!i.keyboard || d(this.el).prop("readOnly") || d(this.el).prop("disabled")) return;
      l = e.ctrlKey || e.metaKey ? 60 : 1, a = d(this.el).val();
      let C = Fi.str2min(a) || Fi.str2min((/* @__PURE__ */ new Date()).getHours() + ":" + ((/* @__PURE__ */ new Date()).getMinutes() - 1));
      switch (n) {
        case 38:
          e.shiftKey || (C += l, o = true);
          break;
        case 40:
          e.shiftKey || (C -= l, o = true);
      }
      o && (e.preventDefault(), d(this.el).val(Fi.min2str(C)).trigger("input").trigger("change"), this.moveCaret2end());
    }
    if (["list", "enum"].includes(this.type)) switch (n) {
      case 8:
      case 46:
        this.type == "list" ? d(this.helpers.search_focus).val() == "" && (this.selected = null, Jt.hide(this.el.id + "_menu"), d(this.el).val("").trigger("input").trigger("change")) : d(this.helpers.multi).find("input").val() == "" && (Jt.hide(this.el.id + "_menu"), this.selected.pop(), (s = Jt.get(this.el.id + "_menu")) && (s.options.selected = this.selected), this.refresh());
        break;
      case 9:
      case 16:
        break;
      case 27:
        Jt.hide(this.el.id + "_menu"), this.refresh();
    }
  }
  keyUp(e) {
    var _a2, _b;
    if (this.type == "list") {
      let i = d(this.helpers.search_focus);
      i.val() !== "" ? d(this.el).attr("placeholder", "") : d(this.el).attr("placeholder", this.tmp.pholder), e.keyCode == 13 && setTimeout(() => {
        i.val(""), Jt.hide(this.el.id + "_menu"), this.refresh();
      }, 1), [38, 40].includes(e.keyCode) && !this.tmp.overlay.overlay.displayed && this.updateOverlay(), this.refresh();
    }
    var t, s;
    this.type == "combo" && this.updateOverlay(), this.type == "enum" && (t = this.helpers.multi.find("input"), s = getComputedStyle(t.get(0)), s = w.getStrWidth(t.val(), `font-family: ${s["font-family"]}; font-size: ${s["font-size"]};`), t.css({ width: s + 15 + "px" }), this.resize(), [38, 40].includes(e.keyCode)) && !((_b = (_a2 = this.tmp.overlay) == null ? void 0 : _a2.overlay) == null ? void 0 : _b.displayed) && this.updateOverlay();
  }
  findItemIndex(e, t, s) {
    let i = [];
    var n;
    return s = s || [], ["list", "combo", "enum"].includes(this.type) && this.options.url && (n = Jt.get(this.el.id + "_menu")) && (e = n.options.items, this.options.items = e), e.forEach((o, a) => {
      o.id === t && (i = s.concat([a]), this.options.index = [a]), i.length == 0 && o.items && 0 < o.items.length && (s.push(a), i = this.findItemIndex(o.items, t, s), s.pop());
    }), i;
  }
  updateOverlay(e) {
    let t = this.options;
    if (this.type === "color") {
      if (d(this.el).prop("readOnly") || d(this.el).prop("disabled")) return;
      qa.show(w.extend({ name: this.el.id + "_color", anchor: this.el, transparent: t.transparent, advanced: t.advanced, color: this.el.value, liveUpdate: true }, this.options)).select((i) => {
        i = i.detail.color, d(this.el).val(i).trigger("input").trigger("change");
      }).liveUpdate((i) => {
        i = i.detail.color, d(this.helpers.suffix).find(":scope > div").css("background-color", "#" + i);
      });
    }
    if (["list", "combo", "enum"].includes(this.type)) {
      var s;
      this.el;
      let i = this.el;
      this.type === "enum" && (s = this.helpers.multi.get(0), i = d(s).find("input").get(0)), this.type === "list" && (s = this.selected, w.isPlainObject(s) && 0 < Object.keys(s).length && 0 < (s = this.findItemIndex(t.items, s.id)).length && (t.index = s), i = this.helpers.search_focus), !d(this.el).hasClass("has-focus") || this.el.readOnly || this.el.disabled || (s = w.extend({}, t, { name: this.el.id + "_menu", anchor: i, selected: this.selected, search: false, render: t.renderDrop, anchorClass: "", offsetY: 5, maxHeight: t.maxDropHeight, maxWidth: t.maxDropWidth, minWidth: t.minDropWidth }), this.tmp.overlay = Jt.show(s).select((n) => {
        var _a2;
        var o, a;
        ["list", "combo"].includes(this.type) ? (this.selected = n.detail.item, d(i).val(""), d(this.el).val(this.selected.text).trigger("input").trigger("change"), this.focus({ showMenu: false })) : (a = this.selected, (o = (_a2 = n.detail) == null ? void 0 : _a2.item) && (n = this.trigger("add", { target: this.el, item: o, originalEvent: n })).isCancelled !== true && (a.length >= t.max && 0 < t.max && a.pop(), delete o.hidden, a.push(o), d(this.el).trigger("input").trigger("change"), d(this.helpers.multi).find("input").val(""), (a = Jt.get(this.el.id + "_menu")) && (a.options.selected = this.selected), n.finish()));
      }));
    }
    !["date", "time", "datetime"].includes(this.type) || d(this.el).prop("readOnly") || d(this.el).prop("disabled") || Fi.show(w.extend({ name: this.el.id + "_date", anchor: this.el, value: this.el.value }, this.options)).select((i) => {
      i = i.detail.date, i != null && d(this.el).val(i).trigger("input").trigger("change");
    });
  }
  isStrValid(e, t) {
    let s = true;
    switch (this.type) {
      case "int":
        s = !(!t || !["-", this.options.groupSymbol].includes(e)) || w.isInt(e.replace(this.options.numberRE, ""));
        break;
      case "percent":
        e = e.replace(/%/g, "");
      case "float":
        s = !(!t || !["-", "", this.options.decimalSymbol, this.options.groupSymbol].includes(e)) || w.isFloat(e.replace(this.options.numberRE, ""));
        break;
      case "money":
      case "currency":
        s = !(!t || !["-", this.options.decimalSymbol, this.options.groupSymbol, this.options.currencyPrefix, this.options.currencySuffix].includes(e)) || w.isFloat(e.replace(this.options.moneyRE, ""));
        break;
      case "bin":
        s = w.isBin(e);
        break;
      case "color":
      case "hex":
        s = w.isHex(e);
        break;
      case "alphanumeric":
        s = w.isAlphaNumeric(e);
    }
    return s;
  }
  addPrefix() {
    var e, t;
    this.options.prefix && (t = getComputedStyle(this.el), this.tmp["old-padding-left"] == null && (this.tmp["old-padding-left"] = t["padding-left"]), this.helpers.prefix && d(this.helpers.prefix).remove(), d(this.el).before(`<div class="w2ui-field-helper">${this.options.prefix}</div>`), e = d(this.el).get(0).previousElementSibling, d(e).css({ color: t.color, "font-family": t["font-family"], "font-size": t["font-size"], height: this.el.clientHeight + "px", "padding-top": t["padding-top"], "padding-bottom": t["padding-bottom"], "padding-left": this.tmp["old-padding-left"], "padding-right": 0, "margin-top": parseInt(t["margin-top"], 10) + 2 + "px", "margin-bottom": parseInt(t["margin-bottom"], 10) + 1 + "px", "margin-left": t["margin-left"], "margin-right": 0, "z-index": 1 }), d(this.el).css("padding-left", e.clientWidth + "px !important"), this.helpers.prefix = e);
  }
  addSuffix() {
    if (this.options.suffix || this.options.arrow) {
      let s, i = this;
      var e = getComputedStyle(this.el), t = (this.tmp["old-padding-right"] == null && (this.tmp["old-padding-right"] = e["padding-right"]), parseInt(e["padding-right"] || 0));
      this.options.arrow && (this.helpers.arrow && d(this.helpers.arrow).remove(), d(this.el).after('<div class="w2ui-field-helper" style="border: 1px solid transparent">&#160;    <div class="w2ui-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="w2ui-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>'), s = d(this.el).get(0).nextElementSibling, d(s).css({ color: e.color, "font-family": e["font-family"], "font-size": e["font-size"], height: this.el.clientHeight + "px", padding: 0, "margin-top": parseInt(e["margin-top"], 10) + 1 + "px", "margin-bottom": 0, "border-left": "1px solid silver", width: "16px", transform: "translateX(-100%)" }).on("mousedown", function(n) {
        d(n.target).hasClass("arrow-up") && i.keyDown(n, { keyCode: 38 }), d(n.target).hasClass("arrow-down") && i.keyDown(n, { keyCode: 40 });
      }), t += s.clientWidth, d(this.el).css("padding-right", t + "px !important"), this.helpers.arrow = s), this.options.suffix !== "" && (this.helpers.suffix && d(this.helpers.suffix).remove(), d(this.el).after(`<div class="w2ui-field-helper">${this.options.suffix}</div>`), s = d(this.el).get(0).nextElementSibling, d(s).css({ color: e.color, "font-family": e["font-family"], "font-size": e["font-size"], height: this.el.clientHeight + "px", "padding-top": e["padding-top"], "padding-bottom": e["padding-bottom"], "padding-left": 0, "padding-right": e["padding-right"], "margin-top": parseInt(e["margin-top"], 10) + 2 + "px", "margin-bottom": parseInt(e["margin-bottom"], 10) + 1 + "px", transform: "translateX(-100%)" }), d(this.el).css("padding-right", s.clientWidth + "px !important"), this.helpers.suffix = s);
    }
  }
  addSearch() {
    if (this.type === "list") {
      this.helpers.search && d(this.helpers.search).remove();
      let s = parseInt(d(this.el).attr("tabIndex")), i = (isNaN(s) || s === -1 || (this.tmp["old-tabIndex"] = s), (s = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : s) != null && !isNaN(s) || (s = 0), "");
      var e = `
            <div class="w2ui-field-helper">
                <span class="w2ui-icon w2ui-icon-search"></span>
                <input ${i = d(this.el).attr("id") != null ? 'id="' + d(this.el).attr("id") + '_search"' : i} type="text" tabIndex="${s}" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`, e = (d(this.el).attr("tabindex", -1).before(e), d(this.el).get(0).previousElementSibling), t = (this.helpers.search = e, this.helpers.search_focus = d(e).find("input").get(0), getComputedStyle(this.el));
      d(e).css({ width: this.el.clientWidth + "px", "margin-top": t["margin-top"], "margin-left": t["margin-left"], "margin-bottom": t["margin-bottom"], "margin-right": t["margin-right"] }).find("input").css({ cursor: "default", width: "100%", opacity: 1, padding: t.padding, margin: t.margin, border: "1px solid transparent", "background-color": "transparent" }), d(e).find("input").off(".helper").on("focus.helper", (n) => {
        d(n.target).val(""), this.tmp.pholder = d(this.el).attr("placeholder") ?? "", this.focus(n), n.stopPropagation();
      }).on("blur.helper", (n) => {
        d(n.target).val(""), this.tmp.pholder != null && d(this.el).attr("placeholder", this.tmp.pholder), this.blur(n), n.stopPropagation();
      }).on("keydown.helper", (n) => {
        this.keyDown(n);
      }).on("keyup.helper", (n) => {
        this.keyUp(n);
      }), d(e).on("click", (n) => {
        d(n.target).find("input").focus();
      });
    }
  }
  addMultiSearch() {
    if (["enum", "file"].includes(this.type)) {
      d(this.helpers.multi).remove();
      let n = "";
      var e, t, s = getComputedStyle(this.el), i = w.stripSpaces(`
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: ${s["margin-left"]};
            margin-right: ${s["margin-right"]};
            width: ${w.getSize(this.el, "width") - parseInt(s["margin-left"], 10) - parseInt(s["margin-right"], 10)}px;
        `);
      this.tmp["min-height"] == null && (e = this.tmp["min-height"] = parseInt((s["min-height"] != "none" ? s["min-height"] : 0) || 0), t = parseInt(s.height), this.tmp["min-height"] = Math.max(e, t)), this.tmp["max-height"] == null && s["max-height"] != "none" && (this.tmp["max-height"] = parseInt(s["max-height"]));
      let o = "", a = (d(this.el).attr("id") != null && (o = `id="${d(this.el).attr("id")}_search"`), parseInt(d(this.el).attr("tabIndex"))), l = (isNaN(a) || a === -1 || (this.tmp["old-tabIndex"] = a), (a = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : a) != null && !isNaN(a) || (a = 0), this.type === "enum" && (n = `
            <div class="w2ui-field-helper w2ui-list" style="${i}">
                <div class="w2ui-multi-items">
                    <div class="li-search">
                        <input ${o} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${a}"
                            ${d(this.el).prop("readOnly") ? "readonly" : ""}
                            ${d(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.type === "file" && (n = `
            <div class="w2ui-field-helper w2ui-list" style="${i}">
                <div class="w2ui-multi-file">
                    <input name="attachment" class="file-input" type="file" tabindex="-1"'
                        style="width: 100%; height: 100%; opacity: 0" title=""
                        ${this.options.max !== 1 ? "multiple" : ""}
                        ${d(this.el).prop("readOnly") || d(this.el).prop("disabled") ? "disabled" : ""}
                        ${d(this.el).attr("accept") ? ' accept="' + d(this.el).attr("accept") + '"' : ""}>
                </div>
                <div class="w2ui-multi-items">
                    <div class="li-search" style="display: none">
                        <input ${o} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${a}"
                            ${d(this.el).prop("readOnly") ? "readonly" : ""}
                            ${d(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.tmp["old-background-color"] = s["background-color"], this.tmp["old-border-color"] = s["border-color"], d(this.el).before(n).css({ "border-color": "transparent", "background-color": "transparent" }), d(this.el.previousElementSibling));
      this.helpers.multi = l, d(this.el).attr("tabindex", -1), l.on("click", (c) => {
        this.focus(c);
      }), l.find("input:not(.file-input)").on("click", (c) => {
        this.click(c);
      }).on("focus", (c) => {
        this.focus(c);
      }).on("blur", (c) => {
        this.blur(c);
      }).on("keydown", (c) => {
        this.keyDown(c);
      }).on("keyup", (c) => {
        this.keyUp(c);
      }), this.type === "file" && l.find("input.file-input").off(".drag").on("click.drag", (c) => {
        c.stopPropagation(), d(this.el).prop("readOnly") || d(this.el).prop("disabled") || this.focus(c);
      }).on("dragenter.drag", (c) => {
        d(this.el).prop("readOnly") || d(this.el).prop("disabled") || l.addClass("w2ui-file-dragover");
      }).on("dragleave.drag", (c) => {
        d(this.el).prop("readOnly") || d(this.el).prop("disabled") || l.removeClass("w2ui-file-dragover");
      }).on("drop.drag", (c) => {
        d(this.el).prop("readOnly") || d(this.el).prop("disabled") || (l.removeClass("w2ui-file-dragover"), Array.from(c.dataTransfer.files).forEach((h) => {
          this.addFile(h);
        }), this.focus(c), c.preventDefault(), c.stopPropagation());
      }).on("dragover.drag", (c) => {
        c.preventDefault(), c.stopPropagation();
      }).on("change.drag", (c) => {
        c.target.files !== void 0 && Array.from(c.target.files).forEach((h) => {
          this.addFile(h);
        }), this.focus(c);
      }), this.refresh();
    }
  }
  addFile(e) {
    var t = this.options, s = this.selected;
    let i = { name: e.name, type: e.type, modified: e.lastModifiedDate, size: e.size, content: null, file: e }, n = 0, o = 0, a = [], l = (Array.isArray(s) && s.forEach((c) => {
      c.name == e.name && c.size == e.size && a.push(w.lang('The file "${name}" (${size}) is already added.', { name: e.name, size: w.formatSize(e.size) })), n += c.size, o++;
    }), t.maxFileSize !== 0 && i.size > t.maxFileSize && a.push(w.lang("Maximum file size is ${size}", { size: w.formatSize(t.maxFileSize) })), t.maxSize !== 0 && n + i.size > t.maxSize && a.push(w.lang("Maximum total size is ${size}", { size: w.formatSize(t.maxSize) })), t.max !== 0 && o >= t.max && a.push(w.lang("Maximum number of files is ${count}", { count: t.max })), this.trigger("add", { target: this.el, file: i, total: o, totalSize: n, errors: a }));
    if (l.isCancelled !== true) if (t.silent !== true && 0 < a.length) rt.show({ anchor: this.el, html: "Errors: " + a.join("<br>") }), console.log("ERRORS (while adding files): ", a);
    else if (s.push(i), typeof FileReader < "u" && t.readContent === true) {
      s = new FileReader();
      let c = this;
      s.onload = function(p) {
        var p = p.target.result, f = p.indexOf(",");
        i.content = p.substr(f + 1), c.refresh(), d(c.el).trigger("input").trigger("change"), l.finish();
      }, s.readAsDataURL(e);
    } else this.refresh(), d(this.el).trigger("input").trigger("change"), l.finish();
  }
  moveCaret2end() {
    setTimeout(() => {
      this.el.setSelectionRange(this.el.value.length, this.el.value.length);
    }, 0);
  }
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const vo = globalThis, Ca = (r) => r, $n = vo.trustedTypes, Sa = $n ? $n.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ja = "$lit$", Ns = `lit$${Math.random().toFixed(9).slice(2)}$`, Wa = "?" + Ns, Gr = `<${Wa}>`, ii = document, Bi = () => ii.createComment(""), Hi = (r) => r === null || typeof r != "object" && typeof r != "function", _o = Array.isArray, Jr = (r) => _o(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", co = `[ 	
\f\r]`, Pi = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ma = /-->/g, $a = />/g, Gs = RegExp(`>|${co}(?:([^\\s"'>=/]+)(${co}*=${co}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ea = /'/g, Aa = /"/g, Za = /^(?:script|style|textarea|title)$/i, Qr = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), Sn = Qr(1), Xi = Symbol.for("lit-noChange"), qt = Symbol.for("lit-nothing"), Ta = /* @__PURE__ */ new WeakMap(), Qs = ii.createTreeWalker(ii, 129);
function Ka(r, e) {
  if (!_o(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Sa !== void 0 ? Sa.createHTML(e) : e;
}
const ec = (r, e) => {
  const t = r.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = Pi;
  for (let a = 0; a < t; a++) {
    const l = r[a];
    let c, h, p = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, h = o.exec(l), h !== null); ) f = o.lastIndex, o === Pi ? h[1] === "!--" ? o = Ma : h[1] !== void 0 ? o = $a : h[2] !== void 0 ? (Za.test(h[2]) && (i = RegExp("</" + h[2], "g")), o = Gs) : h[3] !== void 0 && (o = Gs) : o === Gs ? h[0] === ">" ? (o = i ?? Pi, p = -1) : h[1] === void 0 ? p = -2 : (p = o.lastIndex - h[2].length, c = h[1], o = h[3] === void 0 ? Gs : h[3] === '"' ? Aa : Ea) : o === Aa || o === Ea ? o = Gs : o === Ma || o === $a ? o = Pi : (o = Gs, i = void 0);
    const x = o === Gs && r[a + 1].startsWith("/>") ? " " : "";
    n += o === Pi ? l + Gr : p >= 0 ? (s.push(c), l.slice(0, p) + ja + l.slice(p) + Ns + x) : l + Ns + (p === -2 ? a : x);
  }
  return [Ka(r, n + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Yi {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const a = e.length - 1, l = this.parts, [c, h] = ec(e, t);
    if (this.el = Yi.createElement(c, s), Qs.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = Qs.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(ja)) {
          const f = h[o++], x = i.getAttribute(p).split(Ns), b = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: b[2], strings: x, ctor: b[1] === "." ? sc : b[1] === "?" ? ic : b[1] === "@" ? nc : zn }), i.removeAttribute(p);
        } else p.startsWith(Ns) && (l.push({ type: 6, index: n }), i.removeAttribute(p));
        if (Za.test(i.tagName)) {
          const p = i.textContent.split(Ns), f = p.length - 1;
          if (f > 0) {
            i.textContent = $n ? $n.emptyScript : "";
            for (let x = 0; x < f; x++) i.append(p[x], Bi()), Qs.nextNode(), l.push({ type: 2, index: ++n });
            i.append(p[f], Bi());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Wa) l.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(Ns, p + 1)) !== -1; ) l.push({ type: 7, index: n }), p += Ns.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = ii.createElement("template");
    return s.innerHTML = e, s;
  }
}
function xi(r, e, t = r, s) {
  var _a2, _b;
  if (e === Xi) return e;
  let i = s !== void 0 ? (_a2 = t._$Co) == null ? void 0 : _a2[s] : t._$Cl;
  const n = Hi(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((_b = i == null ? void 0 : i._$AO) == null ? void 0 : _b.call(i, false), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = xi(r, i._$AS(r, e.values), i, s)), e;
}
class tc {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? ii).importNode(t, true);
    Qs.currentNode = i;
    let n = Qs.nextNode(), o = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new Ui(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new oc(n, this, e)), this._$AV.push(c), l = s[++a];
      }
      o !== (l == null ? void 0 : l.index) && (n = Qs.nextNode(), o++);
    }
    return Qs.currentNode = ii, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class Ui {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = qt, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? true;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = xi(this, e, t), Hi(e) ? e === qt || e == null || e === "" ? (this._$AH !== qt && this._$AR(), this._$AH = qt) : e !== this._$AH && e !== Xi && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Jr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== qt && Hi(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ii.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var _a2;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Yi.createElement(Ka(s.h, s.h[0]), this.options)), s);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === i) this._$AH.p(t);
    else {
      const n = new tc(i, this), o = n.u(this.options);
      n.p(t), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = Ta.get(e.strings);
    return t === void 0 && Ta.set(e.strings, t = new Yi(e)), t;
  }
  k(e) {
    _o(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new Ui(this.O(Bi()), this.O(Bi()), this, this.options)) : s = t[i], s._$AI(n), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, t); e !== this._$AB; ) {
      const s = Ca(e).nextSibling;
      Ca(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var _a2;
    this._$AM === void 0 && (this._$Cv = e, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, e));
  }
}
class zn {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = qt, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = qt;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let o = false;
    if (n === void 0) e = xi(this, e, t, 0), o = !Hi(e) || e !== this._$AH && e !== Xi, o && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = xi(this, a[s + l], t, l), c === Xi && (c = this._$AH[l]), o || (o = !Hi(c) || c !== this._$AH[l]), c === qt ? e = qt : e !== qt && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === qt ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class sc extends zn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === qt ? void 0 : e;
  }
}
class ic extends zn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== qt);
  }
}
class nc extends zn {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = xi(this, e, t, 0) ?? qt) === Xi) return;
    const s = this._$AH, i = e === qt && s !== qt || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== qt && (s === qt || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var _a2;
    typeof this._$AH == "function" ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class oc {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    xi(this, e);
  }
}
const ac = vo.litHtmlPolyfillSupport;
ac == null ? void 0 : ac(Yi, Ui), (vo.litHtmlVersions ?? (vo.litHtmlVersions = [])).push("3.3.2");
const lc = (r, e, t) => {
  const s = e;
  let i = s._$litPart$;
  return i === void 0 && (s._$litPart$ = i = new Ui(e.insertBefore(Bi(), null), null, void 0, {})), i._$AI(r), i;
};
function Ec({ buttons: r, clickedButton: e, author: t, sourceCode: s }) {
  const i = document.createElement("div");
  function n() {
    return Vl() === "dark" ? "\u2600" : "\u263E";
  }
  const o = Sn`
    <div class="buttons-container">
      <button class="btn btn-icon" @click=${c}>
        ${rc()}
      </button>
      ${r == null ? void 0 : r.map((h) => Sn`<button class="btn btn-text" @click=${a}>
            ${h}
          </button>`)}
      <button class="btn btn-text btn-theme" @click=${l} title="Toggle light/dark theme">
        ${n()}
      </button>
    </div>

    <div id="dropdown-menu" style="display: none;">
      <a
        href="${s || "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal"}"
        class="dropdown-link"
        >Hekatan Struct Lineal — Source Code</a
      >
      ${t ? Sn`<a href="${t}" class="dropdown-link">Contacto · Jorge Burbano (LinkedIn)</a>` : ""}
      <a href="https://github.com/madil4/awatif/tree/v2.0.0" class="dropdown-link"
        >Based on awatif v2.0.0</a
      >
    </div>
  `;
  i.id = "toolbar", lc(o, i), Vi((h) => {
    const p = i.querySelector(".btn-theme");
    p && (p.textContent = h === "dark" ? "\u2600" : "\u263E");
  });
  function a(h) {
    const p = h.target;
    e.val = "", setTimeout(() => e.val = p.innerText);
  }
  function l() {
    Ol();
  }
  function c(h) {
    const p = document.getElementById("dropdown-menu");
    p.style.display = p.style.display === "block" ? "none" : "block";
  }
  return i;
}
function rc() {
  return Sn`<img src="${"/hekatan-struct-lineal/"}img/hekatan-lockup.png" alt="Hekatan Struct"
    style="height:28px;width:auto;border-radius:6px;display:block;">`;
}
const cc = { id: "ollama", name: "\u{1F999} Ollama (local, gratis)", supportsVision: true, models: [{ id: "qwen2.5-coder:7b", name: "Qwen 2.5 Coder 7B (c\xF3digo)", vision: false }, { id: "llama3.2-vision:11b", name: "Llama 3.2 Vision 11B", vision: true }, { id: "llava:7b", name: "LLaVA 7B (vision)", vision: true }, { id: "qwen2.5:7b", name: "Qwen 2.5 7B", vision: false }, { id: "llama3.1:8b", name: "Llama 3.1 8B", vision: false }], defaultModel: "qwen2.5-coder:7b", requiresKey: false, requiresLocal: true, async send({ msg: r, system: e, model: t }) {
  var _a2, _b;
  const s = { role: "user", content: r.text };
  ((_a2 = r.images) == null ? void 0 : _a2.length) && (s.images = r.images.map((o) => o.base64));
  let i;
  try {
    i = await fetch("http://localhost:11434/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model: t, messages: [{ role: "system", content: e }, s], stream: false }) });
  } catch {
    throw new Error(`Ollama no est\xE1 corriendo en localhost:11434.

Para usar Ollama:
1. Descargalo de ollama.com/download
2. Instal\xE1 un modelo: ollama pull ` + t + `
3. Verific\xE1 que est\xE9 activo (Ollama corre como servicio en background)

O cambi\xE1 a otro provider (Gemini/Groq/OpenRouter) que solo requiere API key.`);
  }
  if (!i.ok) {
    const o = await i.text();
    throw i.status === 404 ? new Error(`Modelo "${t}" no instalado. Ejecut\xE1: ollama pull ${t}`) : new Error(`Ollama error ${i.status}: ${o}`);
  }
  return ((_b = (await i.json()).message) == null ? void 0 : _b.content) ?? "";
} };
async function Ac() {
  try {
    const r = new AbortController(), e = setTimeout(() => r.abort(), 1500), t = await fetch("http://localhost:11434/api/tags", { signal: r.signal }).catch(() => null);
    return clearTimeout(e), !t || !t.ok ? [] : ((await t.json()).models ?? []).map((i) => i.name);
  } catch {
    return [];
  }
}
let xn = null;
function Tc() {
  if (xn) return xn;
  const r = typeof location < "u" ? location.hostname : "";
  return xn = r === "localhost" || r === "127.0.0.1" || r === "" || location.protocol === "file:" ? dc() : Promise.resolve(false), xn;
}
async function dc() {
  try {
    const r = new AbortController(), e = setTimeout(() => r.abort(), 1e3), t = await fetch("http://localhost:11434/api/tags", { signal: r.signal }).catch(() => null);
    return clearTimeout(e), !!t && t.ok;
  } catch {
    return false;
  }
}
const hc = { id: "gemini", name: "\u2728 Gemini Flash (free tier)", supportsVision: true, models: [{ id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (m\xE1s nuevo)", vision: true }, { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (estable)", vision: true }, { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (mejor calidad)", vision: true }], defaultModel: "gemini-2.0-flash-exp", requiresKey: true, requiresLocal: false, async send({ msg: r, system: e, apiKey: t, model: s }) {
  var _a2, _b, _c2, _d, _e;
  const i = [{ text: r.text }];
  for (const a of r.images ?? []) i.push({ inline_data: { mime_type: a.mimeType, data: a.base64 } });
  const n = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${s}:generateContent?key=${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ systemInstruction: { parts: [{ text: e }] }, contents: [{ role: "user", parts: i }], generationConfig: { temperature: 0.2, maxOutputTokens: 4096 } }) });
  if (!n.ok) throw new Error(`Gemini error ${n.status}: ${await n.text()}`);
  return ((_e = (_d = (_c2 = (_b = (_a2 = (await n.json()).candidates) == null ? void 0 : _a2[0]) == null ? void 0 : _b.content) == null ? void 0 : _c2.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text) ?? "";
} }, uc = { id: "groq", name: "\u26A1 Groq (r\xE1pido, free)", supportsVision: true, models: [{ id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (m\xE1s capaz)", vision: false }, { id: "llama-3.2-90b-vision-preview", name: "Llama 3.2 90B Vision", vision: true }, { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B", vision: false }, { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", vision: false }], defaultModel: "llama-3.3-70b-versatile", requiresKey: true, requiresLocal: false, async send({ msg: r, system: e, apiKey: t, model: s }) {
  var _a2, _b, _c2, _d;
  const i = [{ type: "text", text: r.text }];
  for (const a of r.images ?? []) i.push({ type: "image_url", image_url: { url: `data:${a.mimeType};base64,${a.base64}` } });
  const n = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${t}`, "content-type": "application/json" }, body: JSON.stringify({ model: s, messages: [{ role: "system", content: e }, { role: "user", content: ((_a2 = r.images) == null ? void 0 : _a2.length) ? i : r.text }], temperature: 0.2, max_tokens: 4096 }) });
  if (!n.ok) throw new Error(`Groq error ${n.status}: ${await n.text()}`);
  return ((_d = (_c2 = (_b = (await n.json()).choices) == null ? void 0 : _b[0]) == null ? void 0 : _c2.message) == null ? void 0 : _d.content) ?? "";
} }, pc = { id: "openrouter", name: "\u{1F310} OpenRouter (modelos free)", supportsVision: true, models: [{ id: "deepseek/deepseek-chat-v3:free", name: "DeepSeek V3 free (excelente c\xF3digo)", vision: false }, { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B free", vision: false }, { id: "meta-llama/llama-3.2-90b-vision-instruct:free", name: "Llama 3.2 90B Vision free", vision: true }, { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash free", vision: true }, { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen 2.5 Coder 32B free", vision: false }], defaultModel: "deepseek/deepseek-chat-v3:free", requiresKey: true, requiresLocal: false, async send({ msg: r, system: e, apiKey: t, model: s }) {
  var _a2, _b, _c2, _d;
  const i = [{ type: "text", text: r.text }];
  for (const a of r.images ?? []) i.push({ type: "image_url", image_url: { url: `data:${a.mimeType};base64,${a.base64}` } });
  const n = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${t}`, "content-type": "application/json", "HTTP-Referer": "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/", "X-Title": "Hekatan Struct Lineal" }, body: JSON.stringify({ model: s, messages: [{ role: "system", content: e }, { role: "user", content: ((_a2 = r.images) == null ? void 0 : _a2.length) ? i : r.text }], temperature: 0.2, max_tokens: 4096 }) });
  if (!n.ok) throw new Error(`OpenRouter error ${n.status}: ${await n.text()}`);
  return ((_d = (_c2 = (_b = (await n.json()).choices) == null ? void 0 : _b[0]) == null ? void 0 : _c2.message) == null ? void 0 : _d.content) ?? "";
} }, fc = [cc, hc, uc, pc];
function zc(r) {
  return fc.find((e) => e.id === r) ?? null;
}
const mi = "hekatan_ai_", As = { getKey(r) {
  return localStorage.getItem(`${mi}key_${r}`) ?? "";
}, setKey(r, e) {
  localStorage.setItem(`${mi}key_${r}`, e);
}, getProvider() {
  return localStorage.getItem(`${mi}provider`) ?? "ollama";
}, setProvider(r) {
  localStorage.setItem(`${mi}provider`, r);
}, getModel(r) {
  return localStorage.getItem(`${mi}model_${r}`) ?? "";
}, setModel(r, e) {
  localStorage.setItem(`${mi}model_${r}`, e);
} };
function Ic(r) {
  return new Promise((e, t) => {
    const s = new FileReader();
    s.onload = () => {
      const i = s.result, n = i.indexOf(",");
      e(n >= 0 ? i.slice(n + 1) : i);
    }, s.onerror = () => t(s.error), s.readAsDataURL(r);
  });
}
const Fc = `Eres un asistente experto en estructuras y FEM que ayuda al usuario a generar modelos
en Hekatan Struct Lineal. Tu salida debe ser SIEMPRE un script CLI ejecutable, sin
explicaciones extra (a menos que el user pida explicaci\xF3n).

DSL CLI de Hekatan:
\u2500 NODOS:        node <id>  <x>  <y>  <z>
\u2500 FRAMES:       frame <id>  <nodeI>  <nodeJ>  <E>  <A>  <Iy>  [Iz]  [J]
                Ejemplo: frame 1  1 2  25e6  0.16  0.0021
\u2500 SHELLS Q4:    shell <id>  <n1> <n2> <n3> <n4>  <thickness>  <E>
\u2500 APOYOS:       support <nodeId>  <Ux>  <Uy>  <Uz>  <Rx>  <Ry>  <Rz>
                (1 = restringido, 0 = libre)
\u2500 CARGAS:       load <nodeId>  <Fx>  <Fy>  <Fz>  <Mx>  <My>  <Mz>
\u2500 COMENTARIOS:  # comentario libre

Convenci\xF3n de ejes (Z-up):
\u2500 X: horizontal este
\u2500 Y: horizontal norte
\u2500 Z: vertical (gravedad = -Z)

Materiales t\xEDpicos (E = MPa = N/mm\xB2 \xD7 1e6 = Pa, en unidades SI):
\u2500 Hormig\xF3n: E = 25e9 Pa (25 GPa, f'c=210 kg/cm\xB2)
\u2500 Acero:    E = 210e9 Pa
\u2500 Madera:   E = 12e9 Pa (var\xEDa por especie)

Secciones t\xEDpicas:
\u2500 Columna 40\xD740: A=0.16 m\xB2, Iy=Iz=2.13e-3 m\u2074
\u2500 Viga 25\xD740:   A=0.10 m\xB2, Iy=1.33e-3, Iz=5.21e-4
\u2500 HEB-240:      A=0.0106, Iy=1.13e-4, Iz=3.92e-5
\u2500 IPE-300:      A=0.00538, Iy=8.36e-5, Iz=6.04e-6

Si el user pega una IMAGEN (croquis, plano, foto):
\u2500 Identific\xE1 geometr\xEDa, dimensiones, ejes, apoyos, cargas visibles
\u2500 Gener\xE1 el script CLI completo con coordenadas extra\xEDdas
\u2500 Si las dimensiones no son legibles, us\xE1 valores t\xEDpicos y comenta tu suposici\xF3n

REGLAS DE SALIDA:
1. Devuelve SOLO el script CLI, sin markdown, sin \`\`\`, sin comillas.
2. Cada l\xEDnea = un comando. Comentarios con #.
3. IDs sucesivos comenzando desde 1.
4. Si necesit\xE1s aclaraciones, ponelas como # comentario al final.

Ejemplo de salida t\xEDpica para "p\xF3rtico 1 vano, 4m vano, 3m altura, empotrado":
# P\xF3rtico 1 vano 4m \xD7 3m, empotrado en la base
node 1   0   0   0
node 2   0   0   3
node 3   4   0   3
node 4   4   0   0
frame 1  1 2   25e9  0.16  2.13e-3   # columna izq
frame 2  2 3   25e9  0.10  1.33e-3   # viga
frame 3  3 4   25e9  0.16  2.13e-3   # columna der
support 1  1 1 1 1 1 1
support 4  1 1 1 1 1 1`, ct = () => window, yi = [{ id: "ollama", nombre: "\u{1F999} Ollama (local)", url: "http://localhost:11434/v1/chat/completions", clave: false, modelos: ["qwen2.5:7b", "qwen2.5:3b", "llama3.1:8b", "qwen3:8b"], pista: "Local y gratis. Instalar: ollama.com \u2192 ollama pull qwen2.5:7b" }, { id: "gemini", nombre: "\u2728 Gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", clave: true, modelos: ["gemini-2.5-flash", "gemini-2.0-flash"], pista: "Clave gratis: aistudio.google.com/apikey" }, { id: "groq", nombre: "\u26A1 Groq", url: "https://api.groq.com/openai/v1/chat/completions", clave: true, modelos: ["llama-3.3-70b-versatile", "qwen/qwen3-32b"], pista: "Clave gratis: console.groq.com/keys" }, { id: "openrouter", nombre: "\u{1F310} OpenRouter", url: "https://openrouter.ai/api/v1/chat/completions", clave: true, modelos: ["deepseek/deepseek-chat-v3-0324:free", "qwen/qwen-2.5-72b-instruct:free"], pista: "Clave: openrouter.ai/keys (sufijo :free = gratis)" }], go = [{ name: "obtener_modelo", description: "Resumen del modelo abierto: plantilla, par\xE1metros, n\xFAmero de nudos, barras, c\xE1scaras, apoyos, cargas y dimensiones. \xDAsala al empezar si el usuario habla del modelo actual.", parameters: { type: "object", properties: {}, required: [] } }, { name: "listar_plantillas", description: "Busca plantillas param\xE9tricas del programa (edificios, p\xF3rticos, galpones, zapatas, losas, muros\u2026). Devuelve id, nombre y categor\xEDa.", parameters: { type: "object", properties: { filtro: { type: "string", description: "palabra a buscar, p. ej. 'edificio', 'zapata', 'galpon'. Vac\xEDo = todas." } }, required: [] } }, { name: "cargar_plantilla", description: "Abre una plantilla por su id y opcionalmente le pone par\xE1metros. Devuelve la lista de par\xE1metros de la plantilla con sus valores, para poder ajustarlos despu\xE9s.", parameters: { type: "object", properties: { id: { type: "string", description: "id de la plantilla (de listar_plantillas)" }, parametros: { type: "object", description: 'clave \u2192 valor num\xE9rico, p. ej. {"nFloors": 4}' } }, required: ["id"] } }, { name: "cambiar_parametros", description: "Cambia par\xE1metros num\xE9ricos de la plantilla abierta y recalcula.", parameters: { type: "object", properties: { parametros: { type: "object", description: "clave \u2192 valor num\xE9rico" } }, required: ["parametros"] } }, { name: "modelar_heks", description: "Construye un modelo a medida con comandos .heks (nudos, barras, c\xE1scaras, apoyos, cargas) y lo resuelve. Devuelve conteos, errores de sintaxis, flecha m\xE1xima y suma de reacciones.", parameters: { type: "object", properties: { script: { type: "string", description: "comandos .heks, uno por l\xEDnea; terminar con 'solve'" }, modo: { type: "string", enum: ["nuevo", "agregar"], description: "nuevo = reemplaza el modelo; agregar = a\xF1ade al modelo actual" } }, required: ["script"] } }, { name: "resultados", description: "Resultados del an\xE1lisis est\xE1tico: desplazamientos m\xE1ximos (mm) con su nudo y suma de reacciones (kN). \xDAsala para comprobar el modelo.", parameters: { type: "object", properties: {}, required: [] } }, { name: "analisis_modal", description: "Corre el an\xE1lisis modal y anima el modo 1. Devuelve periodos (s) y participaci\xF3n de masa UX, UY, RZ de los primeros modos.", parameters: { type: "object", properties: {}, required: [] } }, { name: "vista", description: "Cambia la vista 3D: c\xE1mara, deformada y campo de colores de c\xE1scaras.", parameters: { type: "object", properties: { camara: { type: "string", enum: ["iso", "plan", "elevX", "elevY"] }, deformada: { type: "boolean" }, campo_cascara: { type: "string", enum: ["none", "displacementZ", "bendingXX", "bendingYY", "membraneXX", "membraneYY", "vonMises"] } }, required: [] } }, { name: "deshacer", description: "Vuelve el modelo al estado anterior al \xFAltimo cambio hecho por el agente.", parameters: { type: "object", properties: {}, required: [] } }], mc = `Eres el agente de Hekatan Struct, un programa de an\xE1lisis estructural por elementos finitos.
No escribes el modelo en el chat: lo CONSTRUYES llamando a las herramientas, y compruebas cada paso.

Unidades: kN, m, s. Ejes: Z hacia arriba, gravedad = -Z.

C\xF3mo trabajar:
1. Si piden una tipolog\xEDa est\xE1ndar (edificio, p\xF3rtico, galp\xF3n, zapata, losa, muro\u2026), busca con
   listar_plantillas, \xE1brela con cargar_plantilla y ajusta los par\xE1metros que devuelve.
   Edificio de p\xF3rticos de hormig\xF3n \u2192 edificio-aporticado; claves: nPisos, nVanosX, nVanosY,
   spanX, spanY (luces en m), hPiso (m). Usa SIEMPRE las claves exactas que devuelve la herramienta.
2. Si es una estructura a medida, usa modelar_heks.
3. Despu\xE9s de modelar, llama a resultados (y a analisis_modal si preguntan por periodos o sismo).
   Si hay errores, flecha absurda o la suma de reacciones no equilibra la carga, corrige y repite.
4. Termina con 2-4 l\xEDneas en espa\xF1ol: qu\xE9 modelaste y los n\xFAmeros clave (flecha, periodo).
   No inventes n\xFAmeros: usa solo los que devolvieron las herramientas.

Sintaxis .heks (un comando por l\xEDnea, # comentario):
node <id> <x> <y> <z>
frame <id> <nI> <nJ> <E> <A> <I22> <I33>      E en kN/m\xB2 (hormig\xF3n 25e6, acero 2e8)
shell <id> <n1> <n2> <n3> <n4> <t> <E>          losa/muro Q4, nudos en orden de giro
support <nudo> fixed | pinned | roller          o seis 0/1: support 1 1 1 1 1 1 1
load <nudo> <Fx> <Fy> <Fz> <Mx> <My> <Mz>       kN (hacia abajo = Fz negativo)
frameload <barra> <wx> <wy> <wz>                kN/m globales
areaload <shell> <q>                            kN/m\xB2 (+z; gravedad negativa)
selfweight 1                                    peso propio
solve                                           al final, siempre

Parte las vigas en 4 tramos o m\xE1s si quieres ver su flecha: el resultado es solo en nudos.
Secciones t\xEDpicas: columna 40\xD740 A=0.16 I=0.002133; viga 30\xD750 A=0.15 I22=0.001125 I33=0.003125.
Ejemplo p\xF3rtico de un vano 5 m \xD7 3 m empotrado:
node 1 0 0 0
node 2 0 0 3
node 3 5 0 3
node 4 5 0 0
frame 1 1 2 25e6 0.16 0.002133 0.002133
frame 2 2 3 25e6 0.15 0.001125 0.003125
frame 3 3 4 25e6 0.16 0.002133 0.002133
support 1 fixed
support 4 fixed
frameload 2 0 0 -20
solve`, En = (r) => new Promise((e) => setTimeout(e, r)), An = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))), bn = [];
function ho() {
  var _a2, _b, _c2, _d;
  return { ex: ((_b = (_a2 = ct()).__hekatanExample) == null ? void 0 : _b.call(_a2)) ?? null, params: { ...((_d = (_c2 = ct()).__hekatanGetParams) == null ? void 0 : _d.call(_c2)) ?? {} }, script: ct().__hekatanCliScript ?? "" };
}
async function uo(r) {
  var _a2, _b, _c2, _d, _e, _f;
  ((_b = (_a2 = ct()).__hekatanExample) == null ? void 0 : _b.call(_a2)) === r ? (_d = (_c2 = ct()).__hekatanRebuild) == null ? void 0 : _d.call(_c2) : (_f = (_e = ct()).__hekatanLoadExampleById) == null ? void 0 : _f.call(_e, r), await An(), await En(150);
}
async function za(r) {
  var _a2, _b, _c2, _d;
  if (!r || !Object.keys(r).length) return [];
  const e = (_b = (_a2 = ct()).__hekatanParams) == null ? void 0 : _b.call(_a2);
  if (!e) return ["no hay plantilla abierta"];
  const t = [];
  for (const [s, i] of Object.entries(r)) {
    const n = typeof i == "boolean" ? i ? 1 : 0 : Number(i);
    if (!(s in e)) {
      t.push(`par\xE1metro desconocido: ${s}`);
      continue;
    }
    if (!Number.isFinite(n)) {
      t.push(`${s}: valor no num\xE9rico`);
      continue;
    }
    e[s] = n;
  }
  return (_d = (_c2 = ct()).__hekatanRebuild) == null ? void 0 : _d.call(_c2), await An(), await En(150), t;
}
function vn() {
  var _a2, _b, _c2, _d, _e;
  const r = ct().__hekatanStates;
  if (!r) return null;
  const e = ((_a2 = r.nodes) == null ? void 0 : _a2.val) ?? [], t = ((_b = r.elements) == null ? void 0 : _b.val) ?? [], s = ((_c2 = r.nodeInputs) == null ? void 0 : _c2.val) ?? {}, i = [1 / 0, 1 / 0, 1 / 0, -1 / 0, -1 / 0, -1 / 0];
  for (const o of e) for (let a = 0; a < 3; a++) i[a] = Math.min(i[a], o[a]), i[a + 3] = Math.max(i[a + 3], o[a]);
  const n = (o) => +o.toFixed(1);
  return { nudos: e.length, barras: t.filter((o) => o.length === 2).length, cascaras: t.filter((o) => o.length >= 3).length, apoyos: ((_d = s.supports) == null ? void 0 : _d.size) ?? 0, cargas_nodales: ((_e = s.loads) == null ? void 0 : _e.size) ?? 0, dimensiones_m: e.length ? { x: n(i[3] - i[0]), y: n(i[4] - i[1]), z: n(i[5] - i[2]) } : null };
}
function gc() {
  var _a2, _b, _c2;
  const r = (_b = (_a2 = ct().__hekatanStates) == null ? void 0 : _a2.deformOutputs) == null ? void 0 : _b.val;
  if (!((_c2 = r == null ? void 0 : r.deformations) == null ? void 0 : _c2.size)) return { error: "no hay resultados: el modelo no se resolvi\xF3 (\xBFfalta solve, apoyos o cargas?)" };
  const e = [0, 0, 0], t = [0, 0, 0];
  for (const [n, o] of r.deformations) for (let a = 0; a < 3; a++) Math.abs(o[a]) > Math.abs(e[a]) && (e[a] = o[a], t[a] = n);
  const s = [0, 0, 0];
  for (const [, n] of r.reactions ?? /* @__PURE__ */ new Map()) for (let o = 0; o < 3; o++) s[o] += n[o] || 0;
  const i = (n) => +(n * 1e3).toFixed(3);
  return { ux_max_mm: i(e[0]), indice_nudo_ux: t[0], uy_max_mm: i(e[1]), indice_nudo_uy: t[1], uz_max_mm: i(e[2]), indice_nudo_uz: t[2], suma_reacciones_kN: { Fx: +s[0].toFixed(2), Fy: +s[1].toFixed(2), Fz: +s[2].toFixed(2) } };
}
function Ia() {
  var _a2, _b, _c2, _d;
  const r = ((_b = (_a2 = ct()).__hekatanParamDefs) == null ? void 0 : _b.call(_a2)) ?? {}, e = ((_d = (_c2 = ct()).__hekatanGetParams) == null ? void 0 : _d.call(_c2)) ?? {}, t = {};
  for (const [s, i] of Object.entries(e)) {
    const n = r[s], o = (n == null ? void 0 : n.label) ? String(n.label).slice(0, 28) : "", a = (n == null ? void 0 : n.options) ? Object.entries(n.options) : [], l = a.length && a.length <= 4 ? "; " + a.map(([c, h]) => `${h}=${String(c).slice(0, 14)}`).join(", ") : "";
    t[s] = o || l ? `${i} (${o}${l})` : String(i);
  }
  return t;
}
async function ko(r, e) {
  var _a2, _b, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o2, _p, _q, _r2, _s2, _t, _u, _v;
  switch (r) {
    case "obtener_modelo": {
      const t = (_b = (_a2 = ct()).__hekatanExample) == null ? void 0 : _b.call(_a2), s = { plantilla: t, ...vn() };
      return t === "cli-modeler" ? s.script = String(ct().__hekatanCliScript ?? "").slice(0, 3e3) : t && (s.parametros = Ia()), s;
    }
    case "listar_plantillas": {
      const t = ct().__hekatanExamples ?? [], s = String((e == null ? void 0 : e.filtro) ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""), i = t.filter((n) => !s || `${n.id} ${n.name} ${n.category}`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(s));
      return { total: i.length, plantillas: i.slice(0, 30).map((n) => `${n.id} \u2014 ${n.name} [${n.category}]`) };
    }
    case "cargar_plantilla": {
      const t = String((e == null ? void 0 : e.id) ?? "");
      if (!(ct().__hekatanExamples ?? []).some((i) => i.id === t)) return { error: `no existe la plantilla '${t}'. Usa listar_plantillas.` };
      bn.push(ho()), await uo(t);
      const s = await za(e == null ? void 0 : e.parametros);
      return { ok: true, plantilla: t, ...vn(), avisos: s, parametros: Ia(), siguiente: s.length ? "Hay claves que no existen. Llama cambiar_parametros usando SOLO claves de 'parametros'." : "Ajusta con cambiar_parametros si hace falta y luego llama resultados." };
    }
    case "cambiar_parametros": {
      bn.push(ho());
      const t = await za(e == null ? void 0 : e.parametros);
      return { ok: t.length === 0, avisos: t, ...vn(), ...t.length ? { claves_validas: Object.keys(((_d = (_c2 = ct()).__hekatanGetParams) == null ? void 0 : _d.call(_c2)) ?? {}) } : {} };
    }
    case "modelar_heks": {
      let t = String((e == null ? void 0 : e.script) ?? "").replace(/^```[a-z]*\n?/i, "").replace(/\n?```\s*$/, "");
      if ((e == null ? void 0 : e.modo) === "agregar") {
        const n = (_f = (_e = ct()).__hekatanExample) == null ? void 0 : _f.call(_e);
        t = String(n === "cli-modeler" ? ct().__hekatanCliScript ?? "" : ((_h = (_g = ct()).__hekatanModeloAHeks) == null ? void 0 : _h.call(_g)) ?? "").replace(/^\s*solve\s*$/gim, "") + `
` + t;
      }
      /^\s*solve\s*$/im.test(t) || (t += `
solve`), bn.push(ho()), ct().__hekatanCliStats = null, ct().__hekatanCliScript = t, await uo("cli-modeler");
      for (let n = 0; n < 20 && !ct().__hekatanCliStats; n++) await En(100);
      const s = ct().__hekatanCliStats ?? {}, i = ct().__hekatanCliErrors ?? [];
      return { nudos: s.nodes, barras: s.frames, cascaras: s.shells, apoyos: s.supports, cargas: s.loads, resuelto: !!s.solved, uz_max_mm: s.maxUzMm, suma_Rz_kN: s.sumRz, errores: i.slice(0, 8) };
    }
    case "resultados":
      return gc();
    case "analisis_modal": {
      const t = (_j = (_i = ct()).__hekatanModalResults) == null ? void 0 : _j.call(_i);
      if (typeof ct().__hekatanRunModalAnimate != "function") return { error: "esta plantilla no tiene an\xE1lisis modal" };
      ct().__hekatanRunModalAnimate();
      let s = null;
      for (let o = 0; o < 100; o++) {
        await En(150);
        const a = (_l = (_k = ct()).__hekatanModalResults) == null ? void 0 : _l.call(_k);
        if (a && a !== t && ((_m = a.frequencies) == null ? void 0 : _m.length)) {
          s = a;
          break;
        }
      }
      if (!s) return { error: "el modal no devolvi\xF3 modos (\xBFmodelo sin masa o sin apoyos?)" };
      const i = Math.min(6, s.frequencies.length), n = [];
      for (let o = 0; o < i; o++) {
        const a = s.frequencies[o], l = ((_n2 = s.massParticipation) == null ? void 0 : _n2[o]) ?? [];
        n.push({ modo: o + 1, T_s: +(1 / a).toFixed(4), UX: +((l[0] ?? 0) * 100).toFixed(1), UY: +((l[1] ?? 0) * 100).toFixed(1), RZ: +((l[5] ?? 0) * 100).toFixed(1) });
      }
      return { modos: n, nota: "UX/UY/RZ = % de masa participante" };
    }
    case "vista": {
      const t = (_p = (_o2 = ct()).__hekatanSettings) == null ? void 0 : _p.call(_o2);
      return (e == null ? void 0 : e.deformada) !== void 0 && (t == null ? void 0 : t.deformedShape) && (t.deformedShape.val = !!e.deformada), (e == null ? void 0 : e.campo_cascara) && (t == null ? void 0 : t.shellResults) && (t.shellResults.val = e.campo_cascara), (e == null ? void 0 : e.camara) && ((_r2 = (_q = ct()).__hekatanSetView) == null ? void 0 : _r2.call(_q, e.camara)), await An(), { ok: true };
    }
    case "deshacer": {
      const t = bn.pop();
      if (!(t == null ? void 0 : t.ex)) return { error: "no hay nada que deshacer" };
      if (t.ex === "cli-modeler" && (ct().__hekatanCliScript = t.script), await uo(t.ex), t.ex !== "cli-modeler") {
        const s = (_t = (_s2 = ct()).__hekatanParams) == null ? void 0 : _t.call(_s2);
        s && (Object.assign(s, t.params), (_v = (_u = ct()).__hekatanRebuild) == null ? void 0 : _v.call(_u), await An());
      }
      return { ok: true, plantilla: t.ex, ...vn() };
    }
  }
  return { error: `herramienta desconocida: ${r}` };
}
const Fa = 14, Di = [];
async function wc(r, e, t, s) {
  var _a2, _b, _c2;
  const i = { "content-type": "application/json" };
  r.clave && (i.Authorization = `Bearer ${t}`), r.id === "openrouter" && (i["HTTP-Referer"] = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/", i["X-Title"] = "Hekatan Struct");
  const n = r.id === "ollama", o = [{ role: "system", content: mc }, ...Di], a = n ? { model: e, stream: false, options: { temperature: 0.1, num_ctx: 16384 }, tools: go.map((h) => ({ type: "function", function: h })), messages: o.map((h) => h.tool_calls ? { ...h, tool_calls: h.tool_calls.map((p) => ({ function: { name: p.function.name, arguments: typeof p.function.arguments == "string" ? JSON.parse(p.function.arguments || "{}") : p.function.arguments } })) } : h) } : { model: e, messages: o, temperature: 0.1, tool_choice: "auto", tools: go.map((h) => ({ type: "function", function: h })) }, l = await fetch(n ? "http://localhost:11434/api/chat" : r.url, { method: "POST", headers: i, signal: s, body: JSON.stringify(a) }).catch((h) => {
    throw (h == null ? void 0 : h.name) === "AbortError" ? h : new Error(r.id === "ollama" ? "Ollama no responde en localhost:11434. \xC1brelo o instala: ollama.com \u2192 ollama pull qwen2.5:7b" : `sin conexi\xF3n con ${r.nombre}: ${(h == null ? void 0 : h.message) ?? h}`);
  });
  if (!l.ok) {
    const h = (await l.text()).slice(0, 400);
    throw r.id === "ollama" && l.status === 404 ? new Error(`Modelo \xAB${e}\xBB no instalado: ollama pull ${e}`) : new Error(`${r.nombre} ${l.status}: ${h}`);
  }
  const c = await l.json();
  if (n) {
    const h = c.message ?? { role: "assistant", content: "" };
    return ((_a2 = h.tool_calls) == null ? void 0 : _a2.length) && (h.tool_calls = h.tool_calls.map((p, f) => ({ id: p.id ?? `t${Date.now()}${f}`, type: "function", function: { name: p.function.name, arguments: JSON.stringify(p.function.arguments ?? {}) } }))), h;
  }
  return ((_c2 = (_b = c.choices) == null ? void 0 : _b[0]) == null ? void 0 : _c2.message) ?? { role: "assistant", content: "" };
}
function yc(r) {
  const e = [], t = /\{[^{}]*"name"\s*:\s*"([a-z_]+)"[^{}]*"arguments"\s*:\s*(\{[\s\S]*?\})\s*\}/g;
  let s;
  for (; s = t.exec(r); ) go.some((i) => i.name === s[1]) && e.push({ id: `t${Date.now()}${e.length}`, type: "function", function: { name: s[1], arguments: s[2] } });
  return e;
}
function Ga(r, e) {
  var _a2, _b, _c2, _d;
  if (e == null ? void 0 : e.error) return `\u2717 ${e.error}`;
  switch (r) {
    case "listar_plantillas":
      return `${e.total} plantillas`;
    case "cargar_plantilla":
    case "cambiar_parametros":
    case "deshacer":
      return `${e.nudos} nudos \xB7 ${e.barras} barras \xB7 ${e.cascaras} c\xE1scaras` + (((_a2 = e.avisos) == null ? void 0 : _a2.length) ? ` \xB7 \u26A0 ${e.avisos[0]}` : "");
    case "modelar_heks":
      return `${e.nudos} nudos \xB7 ${e.barras} barras \xB7 ${e.cascaras} c\xE1scaras \xB7 Uz ${e.uz_max_mm} mm \xB7 \u03A3Rz ${e.suma_Rz_kN} kN` + (((_b = e.errores) == null ? void 0 : _b.length) ? ` \xB7 \u26A0 ${e.errores.length} errores` : "");
    case "resultados":
      return `Uz ${e.uz_max_mm} mm \xB7 Ux ${e.ux_max_mm} mm \xB7 \u03A3Fz ${(_c2 = e.suma_reacciones_kN) == null ? void 0 : _c2.Fz} kN`;
    case "analisis_modal":
      return (_d = e.modos) == null ? void 0 : _d.slice(0, 3).map((t) => `T${t.modo} = ${t.T_s} s`).join(" \xB7 ");
    case "obtener_modelo":
      return `${e.plantilla ?? "vac\xEDo"} \xB7 ${e.nudos ?? 0} nudos`;
    default:
      return "\u2713";
  }
}
let _s = null, si, hs, Js, ei = null;
function In() {
  _s && !document.body.contains(_s) && document.body.appendChild(_s);
}
function vs(r, e) {
  In();
  const t = document.createElement("div"), s = { user: "align-self:flex-end;background:#0e7490;color:#fff;border-radius:10px 10px 2px 10px;", ia: "align-self:flex-start;background:#1f2937;color:#e5e7eb;border-radius:10px 10px 10px 2px;", paso: "align-self:stretch;background:#111827;color:#93c5fd;border-left:3px solid #22d3ee;font-family:Consolas,monospace;font-size:11px;", error: "align-self:stretch;background:#3f1d1d;color:#fca5a5;border-left:3px solid #ef4444;" };
  return t.style.cssText = "padding:6px 9px;max-width:92%;white-space:pre-wrap;word-break:break-word;line-height:1.35;" + s[r], t.textContent = e, si.appendChild(t), si.scrollTop = si.scrollHeight, t;
}
function xc(r) {
  const e = JSON.stringify(r ?? {});
  return (r == null ? void 0 : r.script) ? `(${String(r.script).split(`
`).filter((t) => t.trim() && !t.trim().startsWith("#")).length} l\xEDneas .heks)` : e.length > 90 ? e.slice(0, 87) + "\u2026" : e;
}
async function wo() {
  const r = hs.value.trim();
  if (!r || ei) return;
  const e = As.getProvider(), t = yi.find((h) => h.id === e) ?? yi[0], s = As.getKey(t.id), i = As.getModel(`agente_${t.id}`) || t.modelos[0];
  if (t.clave && !s) {
    vs("error", `${t.nombre} necesita clave. ${t.pista}`);
    return;
  }
  hs.value = "", vs("user", r), Di.push({ role: "user", content: r }), ei = new AbortController(), Js.textContent = "\u25A0 Parar";
  const n = vs("ia", "\u2026"), o = /* @__PURE__ */ new Set(["cargar_plantilla", "cambiar_parametros", "modelar_heks"]);
  let a = false, l = false, c = 0;
  try {
    for (let h = 0; h < Fa; h++) {
      const p = await wc(t, i, s, ei.signal);
      let f = p.tool_calls ?? [];
      if (!f.length && p.content && (f = yc(p.content)), Di.push({ role: "assistant", content: f.length ? p.content ?? "" : p.content, tool_calls: f.length ? f : void 0 }), !f.length && a && !l && c < 2) {
        c++, Di.push({ role: "user", content: "(Hekatan) Todav\xEDa no comprobaste el modelo. Corrige los avisos con cambiar_parametros si los hubo, llama resultados (y analisis_modal si se pidi\xF3 el periodo) y responde en 2-4 l\xEDneas con esos n\xFAmeros." });
        continue;
      }
      if (!f.length) {
        n.remove(), vs("ia", (p.content ?? "").trim() || "(sin respuesta)");
        return;
      }
      for (const x of f) {
        let b = {};
        try {
          b = typeof x.function.arguments == "string" ? JSON.parse(x.function.arguments || "{}") : x.function.arguments;
        } catch {
          b = null;
        }
        const C = vs("paso", `\u{1F527} ${x.function.name} ${b ? xc(b) : "(argumentos inv\xE1lidos)"}`);
        si.insertBefore(C, n);
        let _;
        try {
          _ = b ? await ko(x.function.name, b) : { error: "JSON de argumentos inv\xE1lido" };
        } catch (S) {
          _ = { error: String((S == null ? void 0 : S.message) ?? S) };
        }
        In(), C.textContent += `
   \u2192 ${Ga(x.function.name, _)}`, o.has(x.function.name) && (a = true, l = false), (x.function.name === "resultados" || x.function.name === "analisis_modal") && (l = true), Di.push({ role: "tool", tool_call_id: x.id, content: JSON.stringify(_).slice(0, 6e3) });
      }
    }
    n.remove(), vs("error", `Par\xE9 tras ${Fa} pasos. P\xEDdeme que siga si hace falta.`);
  } catch (h) {
    n.remove(), (h == null ? void 0 : h.name) !== "AbortError" ? vs("error", String((h == null ? void 0 : h.message) ?? h)) : vs("error", "Detenido.");
  } finally {
    ei = null, Js.textContent = "Enviar \u25B6";
  }
}
function bc() {
  const r = document.createElement("div");
  r.id = "hk-agente-ia", r.style.cssText = ["position:fixed", "right:16px", "bottom:96px", "width:380px", "height:540px", "max-height:calc(100vh - 150px)", "max-width:calc(100vw - 32px)", "z-index:9000", "display:flex", "flex-direction:column", "background:#0b1220", "border:1px solid #334155", "border-radius:10px", "box-shadow:0 12px 40px rgba(0,0,0,.5)", "font:13px system-ui,Segoe UI,sans-serif", "color:#e5e7eb"].join(";");
  const e = document.createElement("div");
  e.style.cssText = "display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid #1e293b;cursor:move;", e.innerHTML = '<b style="flex:1">\u{1F916} Agente IA \xB7 Hekatan Struct</b>';
  const t = document.createElement("button");
  t.textContent = "\u2715", t.title = "Cerrar", t.style.cssText = "background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;", t.onclick = () => {
    r.style.display = "none";
  }, e.appendChild(t);
  const s = document.createElement("div");
  s.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-bottom:1px solid #1e293b;";
  const i = "background:#111827;color:#e5e7eb;border:1px solid #334155;border-radius:4px;padding:3px 5px;font-size:12px;", n = document.createElement("select");
  n.style.cssText = i + "flex:1 1 120px;";
  for (const A of yi) n.add(new Option(A.nombre, A.id));
  const o = document.createElement("input");
  o.style.cssText = i + "flex:1 1 140px;", o.setAttribute("list", "hk-agente-modelos");
  const a = document.createElement("datalist");
  a.id = "hk-agente-modelos";
  const l = document.createElement("input");
  l.type = "password", l.placeholder = "API key", l.style.cssText = i + "flex:1 1 100%;";
  const c = document.createElement("div");
  c.style.cssText = "flex:1 1 100%;color:#64748b;font-size:11px;";
  const h = () => {
    const A = yi.find((P) => P.id === n.value) ?? yi[0];
    a.innerHTML = A.modelos.map((P) => `<option value="${P}">`).join(""), o.value = As.getModel(`agente_${A.id}`) || A.modelos[0], l.style.display = A.clave ? "" : "none", l.value = As.getKey(A.id), c.textContent = A.pista;
  }, p = As.getProvider();
  n.value = yi.some((A) => A.id === p) ? p : "ollama", n.onchange = () => {
    As.setProvider(n.value), h();
  }, o.onchange = () => As.setModel(`agente_${n.value}`, o.value.trim()), l.onchange = () => As.setKey(n.value, l.value.trim()), s.append(n, o, a, l, c), h(), si = document.createElement("div"), si.style.cssText = "flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:10px;";
  const f = document.createElement("div");
  f.style.cssText = "display:flex;gap:6px;padding:8px 10px;border-top:1px solid #1e293b;", hs = document.createElement("textarea"), hs.rows = 2, hs.placeholder = "Ej.: edificio de 4 pisos, 3\xD72 vanos de 5 m; dime la flecha y el periodo", hs.style.cssText = i + "flex:1;resize:none;font-size:13px;", ["keydown", "keyup", "keypress"].forEach((A) => hs.addEventListener(A, (P) => P.stopPropagation())), hs.addEventListener("keydown", (A) => {
    A.key === "Enter" && !A.shiftKey && (A.preventDefault(), wo());
  });
  const x = document.createElement("div");
  x.style.cssText = "display:flex;flex-direction:column;gap:4px;", Js = document.createElement("button"), Js.textContent = "Enviar \u25B6", Js.style.cssText = "background:#22d3ee;color:#000;border:none;border-radius:4px;padding:6px 10px;font-weight:600;cursor:pointer;", Js.onclick = () => {
    ei ? ei.abort() : wo();
  };
  const b = document.createElement("button");
  b.textContent = "\u21B6 Deshacer", b.title = "Vuelve el modelo al estado anterior al \xFAltimo cambio del agente", b.style.cssText = "background:#334155;color:#e5e7eb;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;", b.onclick = async () => {
    if (ei) return;
    const A = await ko("deshacer", {});
    vs("paso", `\u21B6 deshacer \u2192 ${Ga("deshacer", A)}`);
  }, x.append(Js, b), f.append(hs, x), r.append(e, s, si, f), document.body.appendChild(r);
  let C = 0, _ = 0, S = false;
  return e.addEventListener("pointerdown", (A) => {
    if (A.target.tagName === "BUTTON") return;
    S = true;
    const P = r.getBoundingClientRect();
    C = A.clientX - P.left, _ = A.clientY - P.top, e.setPointerCapture(A.pointerId);
  }), e.addEventListener("pointermove", (A) => {
    S && (r.style.left = Math.max(0, A.clientX - C) + "px", r.style.top = Math.max(0, A.clientY - _) + "px", r.style.right = "auto", r.style.bottom = "auto");
  }), e.addEventListener("pointerup", () => {
    S = false;
  }), vs("ia", "Hola. P\xEDdeme una estructura y la armo en el visor, paso a paso: plantilla o .heks, c\xE1lculo, resultados y modal."), r;
}
function Co(r) {
  In(), _s || (_s = bc()), _s.style.display = "flex", r && (hs.value = r), hs.focus();
}
function vc(r) {
  const e = () => {
    const t = window.innerHeight, s = document.getElementById("hk-agente-explicar"), i = (a) => !!a && (a === r || a === s || r.contains(a)), n = ["#hk-cad-status", "#legend", "#hk3-cmdline"], o = (a) => n.some((l) => {
      const c = document.querySelector(l);
      if (!c) return false;
      const h = c.getBoundingClientRect();
      if (h.width <= 0 || h.height <= 0) return false;
      const p = 6;
      return !(a.right + p < h.left || h.right < a.left - p || a.bottom + p < h.top || h.bottom < a.top - p);
    });
    for (let a = 18; a < t * 0.7; a += 12) {
      r.style.bottom = a + "px", s && (s.style.bottom = a + "px");
      const l = r.getBoundingClientRect();
      if (o(l)) continue;
      const c = document.elementFromPoint(l.x + l.width / 2, l.y + 4), h = document.elementFromPoint(l.x + l.width / 2, l.y + l.height / 2), p = document.elementFromPoint(l.x + l.width / 2, l.bottom - 4);
      if (i(c) && i(h) && i(p)) return;
    }
    r.style.bottom = "120px";
  };
  e(), window.addEventListener("resize", e), setTimeout(e, 400), setTimeout(e, 1500), setTimeout(e, 4e3);
}
function Pc() {
  if (In(), document.getElementById("hk-agente-lanzador")) return;
  const r = document.createElement("button");
  r.id = "hk-agente-lanzador", r.textContent = "\u{1F916}", r.title = "Agente IA: p\xEDdele una estructura y la modela", r.style.cssText = ["position:fixed", "right:16px", "bottom:100px", "z-index:9600", "width:44px", "height:44px", "border-radius:50%", "border:1px solid #22d3ee", "background:#0b1220", "font-size:22px", "cursor:pointer", "box-shadow:0 4px 14px rgba(0,0,0,.4)"].join(";"), vc(r), r.onclick = () => {
    _s && _s.style.display !== "none" && document.body.contains(_s) ? _s.style.display = "none" : Co();
  }, document.body.appendChild(r), _c();
}
function _c() {
  if (document.getElementById("hk-agente-explicar")) return;
  const r = document.createElement("button");
  r.id = "hk-agente-explicar", r.textContent = "\u{1F4AC} Expl\xEDcame", r.title = "Que el agente lea el modelo y sus resultados y te los explique", r.style.cssText = ["position:fixed", "left:0", "top:0", "z-index:8999", "height:44px", "padding:0 14px", "border-radius:22px", "border:1px solid #22d3ee", "background:#0b1220", "color:#e2e8f0", "font:13px system-ui,sans-serif", "cursor:pointer", "box-shadow:0 4px 14px rgba(0,0,0,.4)", "display:none"].join(";"), r.onclick = () => {
    Ja("Expl\xEDcame este modelo ya calculado. Usa obtener_modelo y resultados, y dime en pocas l\xEDneas: qu\xE9 estructura es, qu\xE9 cargas y apoyos tiene, cu\xE1nto se desplaza (d\xF3nde y cu\xE1nto), si las reacciones equilibran la carga y si el resultado es razonable.");
  }, document.body.appendChild(r);
  const e = () => {
    var _a2, _b, _c2, _d;
    const s = !!((_d = (_c2 = (_b = (_a2 = ct().__hekatanStates) == null ? void 0 : _a2.deformOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c2.deformations) == null ? void 0 : _d.size);
    if (r.style.display = s ? "block" : "none", !s) return;
    const i = document.getElementById("hk-agente-lanzador");
    if (!i) return;
    const n = i.getBoundingClientRect();
    r.style.top = `${n.top}px`, r.style.left = `${Math.max(8, n.left - r.offsetWidth - 8)}px`;
  };
  e(), setInterval(e, 1200);
}
async function Ja(r) {
  Co(), hs.value = r, await wo();
}
typeof window < "u" && (ct().__hekatanAgenteIA = Co, ct().__hekatanPedirAgente = Ja, ct().__hekatanAgenteTool = ko);
export {
  qt as A,
  lc as D,
  Fc as H,
  fc as P,
  Ec as a,
  Mc as b,
  Xl as c,
  ba as d,
  Or as e,
  Vr as f,
  Sc as g,
  Br as h,
  Kr as i,
  Sn as j,
  As as k,
  Co as l,
  Pc as m,
  zc as n,
  Tc as o,
  Ac as p,
  Ic as q,
  $c as w
};
