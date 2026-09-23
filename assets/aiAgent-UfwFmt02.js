var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { l as $t, a0 as xi, a1 as Wl, v as we, a2 as Zl, D as Pt, M as pt, B as Fe, F as Mt, a3 as Kl, q as bt, a4 as Gl, a5 as Jl, a6 as wa, h as xa, a7 as ba, Y as Hs, a8 as Ai, a9 as Ti, $ as qn, H as ft, L as is, b as mt, f as gt, p as el, c as Ql, aa as er, V as te, I as an, J as Bt, ab as ho, u as Hi, d as Vt, a as uo, A as tl, k as Ri, t as tr, s as Xn, P as sr, ac as zi, n as po, m as nr, w as Ns, X as Pn, E as va, S as vn, ad as fo, ae as Rn, g as _a, i as ka, j as Ca, C as Sa, x as ir, y as or, z as ar, W as lr, G as Ma, af as bi, N as mo, O as rr, ag as cr, _ as dr } from "./Text-Br8EG2up.js";
import { P as sl } from "./tweakpane-BXg6ZhiP.js";
let Ut, Ic, Ed, Oc, kd, vd, fr, Da, dc, hc, bd, uc, vc, Ii, Cs, Vo, Ad, Md, Sd, Cd, $d, _d;
let __tla = (async () => {
  class nl {
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
      this.map = go[e] || go.rainbow, this.n = t;
      const s = 1 / this.n, n = new $t(), i = new $t();
      this.lut.length = 0, this.lut.push(new $t(this.map[0][1]));
      for (let o = 1; o < t; o++) {
        const a = o * s;
        for (let r = 0; r < this.map.length - 1; r++) if (a > this.map[r][0] && a <= this.map[r + 1][0]) {
          const c = this.map[r][0], d = this.map[r + 1][0];
          n.setHex(this.map[r][1], xi), i.setHex(this.map[r + 1][1], xi);
          const p = new $t().lerpColors(n, i, (a - c) / (d - c));
          this.lut.push(p);
        }
      }
      return this.lut.push(new $t(this.map[this.map.length - 1][1])), this;
    }
    copy(e) {
      return this.lut = e.lut, this.map = e.map, this.n = e.n, this.minV = e.minV, this.maxV = e.maxV, this;
    }
    getColor(e) {
      e = Wl.clamp(e, this.minV, this.maxV), e = (e - this.minV) / (this.maxV - this.minV);
      const t = Math.round(e * this.n);
      return this.lut[t];
    }
    addColorMap(e, t) {
      return go[e] = t, this;
    }
    createCanvas() {
      const e = document.createElement("canvas");
      return e.width = 1, e.height = this.n, this.updateCanvas(e), e;
    }
    updateCanvas(e) {
      const t = e.getContext("2d", {
        alpha: false
      }), s = t.getImageData(0, 0, 1, this.n), n = s.data;
      let i = 0;
      const o = 1 / this.n, a = new $t(), r = new $t(), c = new $t();
      for (let d = 1; d >= 0; d -= o) for (let p = this.map.length - 1; p >= 0; p--) if (d < this.map[p][0] && d >= this.map[p - 1][0]) {
        const f = this.map[p - 1][0], x = this.map[p][0];
        a.setHex(this.map[p - 1][1], xi), r.setHex(this.map[p][1], xi), c.lerpColors(a, r, (d - f) / (x - f)), n[i * 4] = Math.round(c.r * 255), n[i * 4 + 1] = Math.round(c.g * 255), n[i * 4 + 2] = Math.round(c.b * 255), n[i * 4 + 3] = 255, i += 1;
      }
      return t.putImageData(s, 0, 0), e;
    }
  }
  const go = {
    rainbow: [
      [
        0,
        255
      ],
      [
        0.2,
        65535
      ],
      [
        0.5,
        65280
      ],
      [
        0.8,
        16776960
      ],
      [
        1,
        16711680
      ]
    ],
    cooltowarm: [
      [
        0,
        3952322
      ],
      [
        0.2,
        10206463
      ],
      [
        0.5,
        14474460
      ],
      [
        0.8,
        16163717
      ],
      [
        1,
        11797542
      ]
    ],
    blackbody: [
      [
        0,
        0
      ],
      [
        0.2,
        7864320
      ],
      [
        0.5,
        15086080
      ],
      [
        0.8,
        16776960
      ],
      [
        1,
        16777215
      ]
    ],
    grayscale: [
      [
        0,
        0
      ],
      [
        0.2,
        4210752
      ],
      [
        0.5,
        8355712
      ],
      [
        0.8,
        12566463
      ],
      [
        1,
        16777215
      ]
    ]
  }, $a = [
    [
      200,
      0,
      200
    ],
    [
      228,
      0,
      100
    ],
    [
      255,
      0,
      0
    ],
    [
      255,
      64,
      0
    ],
    [
      255,
      128,
      0
    ],
    [
      255,
      170,
      0
    ],
    [
      255,
      212,
      0
    ],
    [
      255,
      255,
      0
    ],
    [
      128,
      255,
      0
    ],
    [
      0,
      255,
      0
    ],
    [
      0,
      255,
      128
    ],
    [
      0,
      255,
      255
    ],
    [
      0,
      170,
      255
    ],
    [
      0,
      85,
      255
    ],
    [
      0,
      0,
      255
    ]
  ], _n = $a.map(([l, e, t], s) => [
    s / ($a.length - 1),
    l,
    e,
    t
  ]), hr = /* @__PURE__ */ new Set([
    "safe",
    "etabs",
    "sap2000",
    "csi"
  ]);
  function Cn(l) {
    return hr.has(l);
  }
  const il = {
    safe: _n,
    etabs: _n,
    sap2000: _n,
    csi: _n,
    jet_r: [
      [
        0,
        200,
        0,
        0
      ],
      [
        0.15,
        255,
        80,
        0
      ],
      [
        0.32,
        255,
        200,
        0
      ],
      [
        0.48,
        180,
        255,
        0
      ],
      [
        0.6,
        0,
        230,
        90
      ],
      [
        0.74,
        0,
        220,
        230
      ],
      [
        0.88,
        0,
        110,
        255
      ],
      [
        1,
        0,
        0,
        180
      ]
    ],
    jet: [
      [
        0,
        0,
        0,
        180
      ],
      [
        0.12,
        0,
        110,
        255
      ],
      [
        0.26,
        0,
        220,
        230
      ],
      [
        0.4,
        0,
        230,
        90
      ],
      [
        0.52,
        180,
        255,
        0
      ],
      [
        0.68,
        255,
        200,
        0
      ],
      [
        0.85,
        255,
        80,
        0
      ],
      [
        1,
        200,
        0,
        0
      ]
    ],
    viridis: [
      [
        0,
        68,
        1,
        84
      ],
      [
        0.25,
        59,
        82,
        139
      ],
      [
        0.5,
        33,
        145,
        140
      ],
      [
        0.75,
        94,
        201,
        98
      ],
      [
        1,
        253,
        231,
        37
      ]
    ]
  }, Is = we.state("safe");
  typeof window < "u" && (window.__hekatanColorPalette = Is);
  const Fo = we.state("auto");
  function ol(l) {
    l = Math.max(0, Math.min(1, l));
    const e = Is.val, t = il[e] ?? _n;
    if (Cn(e)) {
      const n = t.length, i = Math.min(n - 1, Math.floor(l * n)), [, o, a, r] = t[i];
      return [
        o,
        a,
        r
      ];
    }
    for (let n = 0; n < t.length - 1; n++) {
      const [i, o, a, r] = t[n], [c, d, p, f] = t[n + 1];
      if (l <= c) {
        const x = (l - i) / (c - i);
        return [
          o + (d - o) * x,
          a + (p - a) * x,
          r + (f - r) * x
        ];
      }
    }
    const s = t[t.length - 1];
    return [
      s[1],
      s[2],
      s[3]
    ];
  }
  function Ea() {
    const e = new Uint8Array(1024);
    for (let n = 0; n < 256; n++) {
      const i = n / 255, [o, a, r] = ol(i);
      e[n * 4 + 0] = o, e[n * 4 + 1] = a, e[n * 4 + 2] = r, e[n * 4 + 3] = 255;
    }
    const t = new Gl(e, 256, 1, Jl), s = Cn(Is.val);
    return t.minFilter = s ? wa : xa, t.magFilter = s ? wa : xa, t.wrapS = ba, t.wrapT = ba, t.needsUpdate = true, t;
  }
  function ur() {
    const l = Is.val;
    if (Cn(l)) {
      const s = il[l] ?? _n, n = s.length, i = [];
      for (let o = 0; o < n; o++) {
        const a = n - 1 - o, [, r, c, d] = s[a], p = `rgb(${r | 0},${c | 0},${d | 0})`, f = (o / n * 100).toFixed(4), x = ((o + 1) / n * 100).toFixed(4);
        i.push(`${p} ${f}%`, `${p} ${x}%`);
      }
      return `linear-gradient(${i.join(",")})`;
    }
    const e = 12, t = [];
    for (let s = 0; s <= e; s++) {
      const n = 1 - s / e, [i, o, a] = ol(n);
      t.push(`rgb(${i | 0},${o | 0},${a | 0}) ${(s / e * 100).toFixed(0)}%`);
    }
    return `linear-gradient(${t.join(",")})`;
  }
  let al = false;
  function pr(l) {
    al = l;
  }
  function Po(l) {
    if (!l.length) return [
      0,
      1
    ];
    const e = [
      ...l
    ].sort((a, r) => a - r), t = (a) => e[Math.min(e.length - 1, Math.max(0, Math.round(a * (e.length - 1))))], s = Fo.val, n = e.length >= 20 && (s === "robusto" || s !== "real" && !al);
    let i = n ? t(0.01) : e[0], o = n ? t(0.99) : e[e.length - 1];
    return i >= 0 && o > 0 && (i = 0), o <= 0 && i < 0 && (o = 0), [
      i,
      o
    ];
  }
  fr = function(l, e, t) {
    new nl();
    const s = Ea(), n = new Zl({
      uniforms: {
        cmap: {
          value: s
        },
        ambient: {
          value: 0.95
        }
      },
      vertexShader: `
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
    `,
      fragmentShader: `
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
    `,
      side: Pt,
      transparent: false,
      clipping: true,
      depthWrite: true,
      depthTest: true
    });
    we.derive(() => {
      var _a2;
      Is.val;
      const o = n.uniforms.cmap.value;
      n.uniforms.cmap.value = Ea(), (_a2 = o == null ? void 0 : o.dispose) == null ? void 0 : _a2.call(o);
    });
    const i = new pt(new Fe(), n);
    return i.renderOrder = -1, i.frustumCulled = false, i.userData.isShellArea = true, i.name = "__hekatan_shell_colormap", we.derive(() => {
      i.geometry.setAttribute("position", new Mt(l.val.flat(), 3));
      const o = [], a = [], r = [];
      e.val.forEach((A, P) => {
        A.length === 3 ? (o.push(A[0], A[1], A[2]), a.push(P), r.push(0)) : A.length === 4 && (o.push(A[0], A[1], A[2]), o.push(A[0], A[2], A[3]), a.push(P, P), r.push(0, 1));
      }), i.geometry.setIndex(new Kl(o, 1)), i.userData.faceToElem = a, i.userData.faceLocal = r;
      const c = t.val.filter((A) => Number.isFinite(A));
      let d, p;
      const f = jn.val;
      if (f ? (p = f[0], d = f[1]) : [p, d] = Po(c), d === p) {
        const A = Math.max(Math.abs(d) * 1e-6, 1e-9);
        d += A, p -= A;
      }
      const x = f && f[0] > f[1] && !Cn(Is.val), b = Math.min(p, d), C = Math.max(p, d), _ = C - b, S = new Float32Array(t.val.length);
      for (let A = 0; A < t.val.length; A++) {
        const P = t.val[A];
        if (!Number.isFinite(P)) {
          S[A] = -1;
          continue;
        }
        const U = ((x ? C + b - P : P) - b) / _;
        S[A] = Math.max(0, Math.min(1, U));
      }
      i.geometry.setAttribute("scalar", new bt(S, 1));
    }), i;
  };
  function mr(l, e, t) {
    const s = document.createElement("div"), n = new sl({
      title: "Settings",
      expanded: true,
      container: s
    });
    window.__hekatanPanes = window.__hekatanPanes ?? [], window.__hekatanPanes.push(n), s.setAttribute("id", "settings");
    const i = "hk_settingsPos";
    let o = null;
    try {
      const x = localStorage.getItem(i);
      x && (o = JSON.parse(x));
    } catch {
    }
    s.style.cssText = [
      "position:fixed",
      o ? `left:${o.left}px` : "left:8px",
      o ? `top:${o.top}px` : "top:8px",
      "z-index:50",
      "max-height:calc(100vh - 32px)",
      "overflow-y:auto",
      "box-shadow:0 4px 16px rgba(0,0,0,0.35)",
      "border-radius:6px"
    ].join(";") + ";";
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
        const H = s.getBoundingClientRect();
        S = H.left, A = H.top, s.style.left = `${S}px`, s.style.top = `${A}px`;
      }), window.addEventListener("mousemove", (P) => {
        if (!b) return;
        const H = P.clientX - C, U = P.clientY - _, G = Math.max(0, Math.min(window.innerWidth - 40, S + H)), W = Math.max(0, Math.min(window.innerHeight - 40, A + U));
        s.style.left = `${G}px`, s.style.top = `${W}px`;
      }), window.addEventListener("mouseup", () => {
        if (b) {
          b = false;
          try {
            localStorage.setItem(i, JSON.stringify({
              left: parseFloat(s.style.left),
              top: parseFloat(s.style.top)
            }));
          } catch {
          }
        }
      });
    };
    if (a(), e == null ? void 0 : e.nodes) {
      n.addBinding(l.displayScale, "val", {
        label: "Tama\xF1o de los s\xEDmbolos",
        min: -10,
        max: 10,
        step: 0.5
      });
      const x = n.addFolder({
        title: "\u{1F4D0} Rejilla",
        expanded: false
      });
      x.addBinding(l.gridVisible, "val", {
        label: "Mostrar la rejilla"
      }), x.addBinding(l.gridXY, "val", {
        label: "Plano XY (planta)"
      }), x.addBinding(l.gridXZ, "val", {
        label: "Plano XZ (frontal)"
      }), x.addBinding(l.gridYZ, "val", {
        label: "Plano YZ (lateral)"
      });
      const b = x.addFolder({
        title: "\u2699 Ajuste fino",
        expanded: false
      });
      b.addBinding(l.gridSize, "val", {
        label: "Dimensi\xF3n (m)",
        min: 1,
        max: 100,
        step: 1
      }), b.addBinding(l.gridStep, "val", {
        label: "Separaci\xF3n (m)",
        min: 0.05,
        max: 5,
        step: 0.05
      }), b.addBinding(l.gridMajor, "val", {
        label: "Separaci\xF3n mayores (m)",
        min: 0.1,
        max: 50,
        step: 0.1
      }), b.addBinding(l.cursorSnap, "val", {
        label: "Paso cursor con F9 (m)",
        min: 0.05,
        max: 5,
        step: 0.05
      }), b.addBinding(l.gridOpacity, "val", {
        label: "Opacidad",
        min: 0,
        max: 1,
        step: 0.05
      });
      const C = n.addFolder({
        title: "\u{1F441} Ver",
        expanded: false
      });
      C.addBinding(l.nodes, "val", {
        label: "Nudos"
      }), C.addBinding(l.elements, "val", {
        label: "Elementos"
      }), C.addBinding(l.edges, "val", {
        label: "  Aristas (delim.)"
      }), C.addBinding(l.faces, "val", {
        label: "  Caras (fill)"
      }), C.addBinding(l.elemFrames, "val", {
        label: "  Frames (todos)"
      }), C.addBinding(l.elemColumns, "val", {
        label: "    Columnas"
      }), C.addBinding(l.elemBeams, "val", {
        label: "    Vigas"
      }), C.addBinding(l.elemZapatas, "val", {
        label: "  Zapatas (shells z\u22640)"
      }), C.addBinding(l.elemLosas, "val", {
        label: "  Losas (shells z>0)"
      }), C.addBinding(l.colorByType, "val", {
        label: "  \u{1F3A8} Color por tipo"
      }), C.addBinding(l.nodesIndexes, "val", {
        label: "N\xBA de nudo"
      }), C.addBinding(l.elementsIndexes, "val", {
        label: "N\xBA de elemento"
      }), C.addBinding(l.orientations, "val", {
        label: "Ejes locales"
      }), C.addBinding(l.sections, "val", {
        label: "Secciones"
      }), C.addBinding(l.extruded, "val", {
        label: "Extruido (3D)"
      }), C.addBinding(l.sectionLabels, "val", {
        label: "  Sec. Labels (30x50)"
      }), C.addBinding(l.secColumns, "val", {
        label: "  Sec. Columnas"
      }), C.addBinding(l.secBeams, "val", {
        label: "  Sec. Vigas"
      }), C.addBinding(l.secFloor, "val", {
        label: "  Sec. Piso",
        options: {
          Todos: -1,
          "Piso 1": 0,
          "Piso 2": 1,
          "Piso 3": 2,
          "Piso 4": 3,
          "Piso 5": 4
        }
      });
    }
    if ((e == null ? void 0 : e.nodeInputs) || (e == null ? void 0 : e.elementInputs)) {
      const x = n.addFolder({
        title: "\u{1F4CC} Datos de entrada",
        expanded: false
      });
      x.addBinding(l.supports, "val", {
        label: "Apoyos"
      }), x.addBinding(l.loads, "val", {
        label: "Cargas"
      }), x.addBinding(l.custom3D, "val", {
        label: "Resortes (Winkler)"
      }), x.addBinding(l.showCotas, "val", {
        label: "Cotas"
      });
    }
    if ((e == null ? void 0 : e.deformOutputs) || (e == null ? void 0 : e.analyzeOutputs)) {
      const x = n.addFolder({
        title: "\u{1F52C} Resultados",
        expanded: true
      });
      window.__hekatanOutputsFolder = x, x.addBinding(l.nodeResults, "val", {
        options: {
          none: "none",
          "U (deformations)": "deformations",
          "R (reactions)": "reactions"
        },
        label: "Resultados de nudo"
      }), x.addBinding(l.frameResults, "val", {
        options: {
          none: "none",
          "Axial Force": "normals",
          Torsion: "torsions",
          "Shear 2-2": "shearsY",
          "Shear 3-3": "shearsZ",
          "Moment 2-2": "bendingsY",
          "Moment 3-3": "bendingsZ",
          "Axial Force (diagram)": "contour:normals",
          "Shear 2-2 (diagram)": "contour:shearsY",
          "Shear 3-3 (diagram)": "contour:shearsZ",
          "Torsion (diagram)": "contour:torsions",
          "Moment 2-2 (diagram)": "contour:bendingsY",
          "Moment 3-3 (diagram)": "contour:bendingsZ"
        },
        label: "Resultados de barra"
      }), x.addButton({
        title: "\u{1F4D0} Ver diagrama en 2D (alzado / planta)"
      }).on("click", () => {
        var _a2;
        (_a2 = window.__hekatanDiagrama2D) == null ? void 0 : _a2.call(window);
      }), x.addButton({
        title: "\u{1F4C8} Gr\xE1fico de la barra designada"
      }).on("click", () => {
        var _a2;
        (_a2 = window.__hekatanDiagramaBarra) == null ? void 0 : _a2.call(window);
      }), x.addBinding(l.shellResults, "val", {
        options: {
          none: "none",
          F11: "membraneXX",
          F22: "membraneYY",
          F12: "membraneXY",
          FMax: "membranePrincipalMax",
          FMin: "membranePrincipalMin",
          FVM: "vonMises",
          V13: "tranverseShearX",
          V23: "tranverseShearY",
          VMax: "transverseShearMax",
          M11: "bendingXX",
          M22: "bendingYY",
          M12: "bendingXY",
          MMax: "bendingPrincipalMax",
          MMin: "bendingPrincipalMin",
          "Pressure (suelo)": "pressure",
          Ux: "displacementX",
          Uy: "displacementY",
          Uz: "displacementZ"
        },
        label: "Resultados de c\xE1scara"
      }), x.addBinding(Is, "val", {
        options: {
          "SAFE (cimentaci\xF3n)": "safe",
          ETABS: "etabs",
          SAP2000: "sap2000",
          "Jet_r (rojo\u2192azul)": "jet_r",
          "Jet (azul\u2192rojo)": "jet",
          Viridis: "viridis"
        },
        label: "\u{1F3A8} Paleta colores"
      }), x.addBinding(Fo, "val", {
        options: {
          "todas las c\xE1scaras": "auto",
          "todas, recortando picos (p1\u2013p99)": "robusto",
          "todas, min/max real": "real",
          "solo muros": "muros",
          "muros X (plano x=cte)": "murosX",
          "muros Y (plano y=cte)": "murosY",
          "solo losas": "losas"
        },
        label: "\u{1F4D0} Rango colormap"
      }), x.addBinding(l.solidResults, "val", {
        options: {
          none: "none",
          vonMises: "vonMises",
          \u03C3xx: "sigmaXX",
          \u03C3yy: "sigmaYY",
          \u03C3zz: "sigmaZZ",
          \u03C4xy: "tauXY",
          \u03C4yz: "tauYZ",
          \u03C4xz: "tauXZ",
          ux: "ux",
          uy: "uy",
          uz: "uz"
        },
        label: "Resultados de s\xF3lido"
      }), x.addBinding(l.deformedShape, "val", {
        label: "Deformada"
      }), x.addBinding(l.deformScale, "val", {
        label: "  Escala XY",
        min: 0.1,
        max: 5e4,
        step: 0.1
      }), x.addBinding(l.deformScaleZ, "val", {
        label: "  Escala Z",
        min: 0.01,
        max: 10,
        step: 0.01
      });
    }
    t && n.addBinding(l.solids, "val", {
      label: "S\xF3lidos"
    });
    const r = n.addFolder({
      title: "\u2702\uFE0F Cortes X/Y/Z",
      expanded: false
    }), c = window.__hekatanClip ?? (window.__hekatanClip = {
      enableX: false,
      enableY: false,
      enableZ: false,
      posX: 0,
      posY: 0,
      posZ: 0,
      invertX: false,
      invertY: false,
      invertZ: false
    }), d = () => {
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
        const A = Math.floor(Math.min(x[S], -50)), P = Math.ceil(Math.max(b[S], 50)), H = P - A > 400 ? 0.5 : 0.1;
        return c["pos" + _] = Math.max(A, Math.min(P, c["pos" + _])), r.addBinding(c, "pos" + _, {
          min: A,
          max: P,
          step: H,
          label: `  pos ${_} (m)`
        }).on("change", d);
      };
      p.push(r.addBinding(c, "enableX", {
        label: "Cortar X"
      }).on("change", d), C("X", 0), r.addBinding(c, "invertX", {
        label: "  invertir X"
      }).on("change", d), r.addBinding(c, "enableY", {
        label: "Cortar Y"
      }).on("change", d), C("Y", 1), r.addBinding(c, "invertY", {
        label: "  invertir Y"
      }).on("change", d), r.addBinding(c, "enableZ", {
        label: "Cortar Z"
      }).on("change", d), C("Z", 2), r.addBinding(c, "invertZ", {
        label: "  invertir Z"
      }).on("change", d));
    };
    return f([
      -50,
      -50,
      -50
    ], [
      50,
      50,
      50
    ]), window.__hekatanClipRango = (x, b) => {
      f(x, b);
    }, s;
  }
  function gr(l) {
    return {
      gridSize: we.state((l == null ? void 0 : l.gridSize) ?? 30),
      gridVisible: we.state((l == null ? void 0 : l.gridVisible) ?? true),
      gridOpacity: we.state((l == null ? void 0 : l.gridOpacity) ?? 1),
      gridStep: we.state((l == null ? void 0 : l.gridStep) ?? 1),
      gridMajor: we.state((l == null ? void 0 : l.gridMajor) ?? 5),
      cursorSnap: we.state((l == null ? void 0 : l.cursorSnap) ?? 0.5),
      gridXY: we.state((l == null ? void 0 : l.gridXY) ?? true),
      gridXZ: we.state((l == null ? void 0 : l.gridXZ) ?? false),
      gridYZ: we.state((l == null ? void 0 : l.gridYZ) ?? false),
      displayScale: we.state((l == null ? void 0 : l.displayScale) ?? 1),
      nodes: we.state((l == null ? void 0 : l.nodes) ?? true),
      elements: we.state((l == null ? void 0 : l.elements) ?? true),
      edges: we.state((l == null ? void 0 : l.edges) ?? true),
      faces: we.state((l == null ? void 0 : l.faces) ?? true),
      elemColumns: we.state((l == null ? void 0 : l.elemColumns) ?? true),
      elemBeams: we.state((l == null ? void 0 : l.elemBeams) ?? true),
      elemFrames: we.state((l == null ? void 0 : l.elemFrames) ?? true),
      elemZapatas: we.state((l == null ? void 0 : l.elemZapatas) ?? true),
      elemLosas: we.state((l == null ? void 0 : l.elemLosas) ?? true),
      colorByType: we.state((l == null ? void 0 : l.colorByType) ?? false),
      nodesIndexes: we.state((l == null ? void 0 : l.nodesIndexes) ?? false),
      elementsIndexes: we.state((l == null ? void 0 : l.elementsIndexes) ?? false),
      orientations: we.state((l == null ? void 0 : l.orientations) ?? false),
      sections: we.state((l == null ? void 0 : l.sections) ?? true),
      extruded: we.state((l == null ? void 0 : l.extruded) ?? false),
      sectionLabels: we.state((l == null ? void 0 : l.sectionLabels) ?? true),
      secColumns: we.state((l == null ? void 0 : l.secColumns) ?? true),
      secBeams: we.state((l == null ? void 0 : l.secBeams) ?? true),
      secFloor: we.state((l == null ? void 0 : l.secFloor) ?? -1),
      supports: we.state((l == null ? void 0 : l.supports) ?? true),
      loads: we.state((l == null ? void 0 : l.loads) ?? false),
      deformedShape: we.state((l == null ? void 0 : l.deformedShape) ?? false),
      nodeResults: we.state((l == null ? void 0 : l.nodeResults) ?? "none"),
      frameResults: we.state((l == null ? void 0 : l.frameResults) ?? "none"),
      shellResults: we.state((l == null ? void 0 : l.shellResults) ?? "none"),
      solidResults: we.state((l == null ? void 0 : l.solidResults) ?? "none"),
      flipAxes: we.state((l == null ? void 0 : l.flipAxes) ?? false),
      solids: we.state((l == null ? void 0 : l.solids) ?? true),
      custom3D: we.state((l == null ? void 0 : l.custom3D) ?? true),
      showCotas: we.state((l == null ? void 0 : l.showCotas) ?? true),
      deformScale: we.state((l == null ? void 0 : l.deformScale) ?? 1),
      deformScaleZ: we.state((l == null ? void 0 : l.deformScaleZ) ?? 1)
    };
  }
  function yr(l, e, t) {
    const s = Hs(), n = new Ai(new Fe(), new Ti({
      color: s.nodePoint
    }));
    return qn((i, o) => {
      n.material.color.setHex(o.nodePoint);
    }), n.frustumCulled = false, we.derive(() => {
      l.nodes.val && n.geometry.setAttribute("position", new Mt(e.val.flat(), 3));
    }), we.derive(() => {
      if (t.val, e.val, !l.nodes.rawVal) return;
      const i = e.rawVal ?? [];
      let o = l.gridSize.val * 0.5;
      if (i.length >= 2) {
        const r = [
          1 / 0,
          1 / 0,
          1 / 0
        ], c = [
          -1 / 0,
          -1 / 0,
          -1 / 0
        ];
        for (const d of i) for (let p = 0; p < 3; p++) r[p] = Math.min(r[p], d[p]), c[p] = Math.max(c[p], d[p]);
        o = Math.max(c[0] - r[0], c[1] - r[1], c[2] - r[2], 0.1);
      }
      const a = 0.03 * o;
      n.material.size = a * t.rawVal;
    }), we.derive(() => {
      n.visible = l.nodes.val;
    }), n;
  }
  const wr = new $t(16746496), xr = new $t(52428), Aa = new $t(52292), Ta = new $t(3377407), za = new $t(16763904);
  function Ia(l, e) {
    const t = Math.abs(e[0] - l[0]), s = Math.abs(e[1] - l[1]), n = Math.abs(e[2] - l[2]);
    return n > t && n > s || s > t && s > n;
  }
  function br(l, e, t, s) {
    const n = [
      e[0] - l[0],
      e[1] - l[1],
      e[2] - l[2]
    ], i = [
      s[0] - l[0],
      s[1] - l[1],
      s[2] - l[2]
    ], o = n[1] * i[2] - n[2] * i[1], a = n[2] * i[0] - n[0] * i[2], r = n[0] * i[1] - n[1] * i[0], c = Math.sqrt(o * o + a * a + r * r);
    return c < 1e-12 ? false : Math.abs(r / c) < 0.5;
  }
  function vi(l) {
    return l <= 1e-3;
  }
  function Fa(l, e, t, s, n, i, o = 8) {
    const a = (ie, le) => {
      const he = le ?? [
        0,
        0,
        0
      ];
      return [
        ie[0] + (he[0] || 0) * n,
        ie[1] + (he[1] || 0) * n,
        ie[2] + (he[2] || 0) * i
      ];
    }, r = a(l, t), c = a(e, s), d = t && t.length >= 6 ? [
      t[3],
      t[4],
      t[5]
    ] : null, p = s && s.length >= 6 ? [
      s[3],
      s[4],
      s[5]
    ] : null;
    if (!d && !p) return [
      r,
      c
    ];
    const f = [
      e[0] - l[0],
      e[1] - l[1],
      e[2] - l[2]
    ], x = Math.hypot(f[0], f[1], f[2]);
    if (x < 1e-9) return [
      r,
      c
    ];
    f[0] /= x, f[1] /= x, f[2] /= x;
    const b = Math.abs(f[2]) > 0.98 ? [
      0,
      1,
      0
    ] : [
      0,
      0,
      1
    ], C = (ie, le) => [
      ie[1] * le[2] - ie[2] * le[1],
      ie[2] * le[0] - ie[0] * le[2],
      ie[0] * le[1] - ie[1] * le[0]
    ];
    let _ = C(b, f);
    const S = Math.hypot(_[0], _[1], _[2]) || 1;
    _ = [
      _[0] / S,
      _[1] / S,
      _[2] / S
    ];
    const A = C(f, _), P = (ie, le) => ie[0] * le[0] + ie[1] * le[1] + ie[2] * le[2], H = (ie) => {
      const le = ie ?? [
        0,
        0,
        0
      ];
      return [
        (le[0] || 0) * n,
        (le[1] || 0) * n,
        (le[2] || 0) * i
      ];
    }, U = H(t), G = H(s), W = P(U, _), V = P(G, _), q = P(U, A), D = P(G, A), R = d ? P(d, A) * n : 0, X = p ? P(p, A) * n : 0, Q = d ? P(d, _) * n : 0, re = p ? P(p, _) * n : 0, ue = P(U, f), be = P(G, f), ae = [];
    for (let ie = 0; ie <= o; ie++) {
      const le = ie / o, he = 1 - 3 * le * le + 2 * le * le * le, pe = x * (le - 2 * le * le + le * le * le), Se = 3 * le * le - 2 * le * le * le, ve = x * (-le * le + le * le * le), Ae = he * W + pe * R + Se * V + ve * X, Ve = he * q - pe * Q + Se * D - ve * re, ot = ue + (be - ue) * le, yt = [
        l[0] + f[0] * (le * x + ot),
        l[1] + f[1] * (le * x + ot),
        l[2] + f[2] * (le * x + ot)
      ];
      ae.push([
        yt[0] + _[0] * Ae + A[0] * Ve,
        yt[1] + _[1] * Ae + A[1] * Ve,
        yt[2] + _[2] * Ae + A[2] * Ve
      ]);
    }
    return ae;
  }
  function vr(l, e, t) {
    const s = Hs(), n = new ft(), i = new is(new Fe(), new mt({
      color: s.elementLine,
      vertexColors: false,
      depthTest: false,
      transparent: true,
      opacity: 1
    }));
    qn((p, f) => {
      i.material.color.setHex(f.elementLine);
    }), i.frustumCulled = false, i.renderOrder = 3, n.add(i);
    const o = new gt({
      vertexColors: true,
      transparent: true,
      opacity: s.shellOpacity,
      side: Pt,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    }), a = new pt(new Fe(), o);
    a.frustumCulled = false, a.userData.isShellArea = true, a.name = "__hekatan_shell_area", n.add(a);
    let r = new $t(s.shellWall), c = new $t(s.shellSlab), d = new $t(s.shellTri);
    return qn((p, f) => {
      r = new $t(f.shellWall), c = new $t(f.shellSlab), d = new $t(f.shellTri), o.opacity = f.shellOpacity, o.needsUpdate = true;
    }), we.derive(() => {
      var _a2, _b, _c2, _d2, _e, _f, _g, _h;
      if (e.deformedShape.val, e.elemColumns.val, e.elemBeams.val, (_a2 = e.elemFrames) == null ? void 0 : _a2.val, (_b = e.elemZapatas) == null ? void 0 : _b.val, (_c2 = e.elemLosas) == null ? void 0 : _c2.val, (_d2 = e.colorByType) == null ? void 0 : _d2.val, !e.elements.val) return;
      const p = e.elemFrames ? e.elemFrames.rawVal : true, f = e.elemColumns.rawVal, x = e.elemBeams.rawVal, b = e.elemZapatas ? e.elemZapatas.rawVal : true, C = e.elemLosas ? e.elemLosas.rawVal : true, _ = e.colorByType ? e.colorByType.rawVal : false, S = t.val, A = ((_e = l.elements) == null ? void 0 : _e.val) || [], P = (D) => {
        if (D.length === 2) {
          if (!p) return false;
          const R = S[D[0]], X = S[D[1]];
          return !R || !X ? true : Ia(R, X) ? f : x;
        }
        if (D.length === 4) {
          const R = D.map((Q) => S[Q]).filter(Boolean);
          if (R.length < 4) return true;
          const X = (R[0][2] + R[1][2] + R[2][2] + R[3][2]) / 4;
          return vi(X) ? b : C;
        }
        if (D.length === 3) {
          const R = D.map((Q) => S[Q]).filter(Boolean);
          if (R.length < 3) return true;
          const X = (R[0][2] + R[1][2] + R[2][2]) / 3;
          return vi(X) ? b : C;
        }
        return true;
      }, H = [], U = [];
      for (const D of A) {
        if (!P(D)) continue;
        let R = null;
        if (_) if (D.length === 2) {
          const Q = S[D[0]], re = S[D[1]];
          Q && re && (R = Ia(Q, re) ? wr : xr);
        } else if (D.length === 4) {
          const Q = D.map((re) => S[re]).filter(Boolean);
          if (Q.length === 4) {
            const re = (Q[0][2] + Q[1][2] + Q[2][2] + Q[3][2]) / 4;
            R = vi(re) ? Aa : Ta;
          }
        } else D.length === 3 && (R = za);
        if (D.length === 2 && e.deformedShape.val) {
          const Q = ((_f = l.nodes) == null ? void 0 : _f.val) ?? [], re = (_h = (_g = l.deformOutputs) == null ? void 0 : _g.val) == null ? void 0 : _h.deformations, ue = Q[D[0]], be = Q[D[1]];
          if (ue && be && re) {
            const ae = Number.isFinite(e.deformScale.val) ? e.deformScale.val : 1, ie = ae * (Number.isFinite(e.deformScaleZ.val) ? e.deformScaleZ.val : 1), le = Fa(ue, be, re.get(D[0]), re.get(D[1]), ae, ie);
            for (let he = 0; he < le.length - 1; he++) H.push(...le[he], ...le[he + 1]), _ && R && (U.push(R.r, R.g, R.b), U.push(R.r, R.g, R.b));
            continue;
          }
        }
        const X = e.__modoAnim;
        if (D.length === 2 && !e.deformedShape.val && X && X.orig.length === S.length) {
          const Q = X.orig[D[0]], re = X.orig[D[1]];
          if (Q && re) {
            const ue = X.shape.slice(D[0] * 6, D[0] * 6 + 6), be = X.shape.slice(D[1] * 6, D[1] * 6 + 6), ae = Fa(Q, re, ue, be, X.amp, X.amp);
            for (let ie = 0; ie < ae.length - 1; ie++) H.push(...ae[ie], ...ae[ie + 1]), _ && R && (U.push(R.r, R.g, R.b), U.push(R.r, R.g, R.b));
            continue;
          }
        }
        for (const Q of _r(D)) {
          const re = S[Q[0]], ue = S[Q[1]];
          !re || !ue || (H.push(...re, ...ue), _ && R && (U.push(R.r, R.g, R.b), U.push(R.r, R.g, R.b)));
        }
      }
      i.geometry.setAttribute("position", new Mt(H, 3)), _ && U.length === H.length ? (i.geometry.setAttribute("color", new Mt(U, 3)), i.material.vertexColors = true, i.material.needsUpdate = true) : (i.geometry.deleteAttribute("color"), i.material.vertexColors = false, i.material.needsUpdate = true);
      const G = [], W = [], V = [], q = [];
      for (let D = 0; D < A.length; D++) {
        const R = A[D];
        if (P(R)) {
          if (R.length === 3) {
            const [X, Q, re] = R;
            if (S[X] && S[Q] && S[re]) {
              V.push(D), q.push(0), G.push(...S[X], ...S[Q], ...S[re]);
              const ue = _ ? za : d;
              for (let be = 0; be < 3; be++) W.push(ue.r, ue.g, ue.b);
            }
          } else if (R.length === 4) {
            const [X, Q, re, ue] = R;
            if (S[X] && S[Q] && S[re] && S[ue]) {
              let be;
              if (_) {
                const ae = (S[X][2] + S[Q][2] + S[re][2] + S[ue][2]) / 4;
                be = vi(ae) ? Aa : Ta;
              } else be = br(S[X], S[Q], S[re], S[ue]) ? r : c;
              G.push(...S[X], ...S[Q], ...S[re]), G.push(...S[X], ...S[re], ...S[ue]), V.push(D, D), q.push(0, 1);
              for (let ae = 0; ae < 6; ae++) W.push(be.r, be.g, be.b);
            }
          }
        }
      }
      a.userData.faceToElem = V, a.userData.faceLocal = q, G.length > 0 ? (a.geometry.dispose(), a.geometry = new Fe(), a.geometry.setAttribute("position", new Mt(G, 3)), a.geometry.setAttribute("color", new Mt(W, 3)), a.geometry.computeVertexNormals(), a.visible = e.faces ? e.faces.rawVal : true) : a.visible = false;
    }), we.derive(() => {
      n.visible = e.elements.val;
    }), we.derive(() => {
      e.edges && (i.visible = e.edges.val);
    }), we.derive(() => {
      var _a2, _b;
      if (!e.faces) return;
      const p = e.faces.val, f = (((_a2 = e.shellResults) == null ? void 0 : _a2.val) ?? "none") !== "none", x = (((_b = e.solidResults) == null ? void 0 : _b.val) ?? "none") !== "none", b = f || x;
      a.geometry.attributes.position ? a.visible = p && !b : p || (a.visible = false);
    }), n;
  }
  function _r(l) {
    if (l.length === 2) return [
      l
    ];
    if (l.length === 8) {
      const t = l;
      return [
        [
          t[0],
          t[1]
        ],
        [
          t[1],
          t[2]
        ],
        [
          t[2],
          t[3]
        ],
        [
          t[3],
          t[0]
        ],
        [
          t[4],
          t[5]
        ],
        [
          t[5],
          t[6]
        ],
        [
          t[6],
          t[7]
        ],
        [
          t[7],
          t[4]
        ],
        [
          t[0],
          t[4]
        ],
        [
          t[1],
          t[5]
        ],
        [
          t[2],
          t[6]
        ],
        [
          t[3],
          t[7]
        ]
      ];
    }
    const e = [];
    for (let t = 0; t < l.length; t++) e.push([
      l[t],
      l[(t + 1) % l.length]
    ]);
    return e;
  }
  function yo(l, e) {
    const t = Hs(), s = new ft();
    s.name = "hekatan-grid";
    const n = (e == null ? void 0 : e.planes) ?? [
      "xy"
    ];
    let i = (e == null ? void 0 : e.majorStep) ?? 1, o = (e == null ? void 0 : e.minorStep) ?? 0.1;
    for (i <= 0 && (i = 1), o <= 0 && (o = 0.1); l / o > 500; ) o *= 2;
    for (; l / i > 100; ) i *= 2;
    const a = l / 2;
    i = Math.max(o, Math.round(i / o) * o);
    const c = new $t(t.grid).multiplyScalar(1.3), d = new $t(t.grid).multiplyScalar(0.8), p = (C, _, S, A) => {
      const P = [], H = C === "xy" ? (q, D) => [
        q,
        D,
        0
      ] : C === "xz" ? (q, D) => [
        q,
        0,
        D
      ] : (q, D) => [
        0,
        q,
        D
      ], U = Math.floor(a / _);
      for (let q = -U; q <= U; q++) {
        const D = q * _, R = H(D, -a), X = H(D, a);
        P.push(...R, ...X);
      }
      for (let q = -U; q <= U; q++) {
        const D = q * _, R = H(-a, D), X = H(a, D);
        P.push(...R, ...X);
      }
      const G = new Fe();
      G.setAttribute("position", new Mt(P, 3));
      const W = new mt({
        color: S,
        transparent: true,
        opacity: A,
        depthWrite: false
      }), V = new is(G, W);
      return V.name = `grid-${C}-${_ === o ? "minor" : "major"}`, V;
    }, f = (C, _, S) => {
      const A = C === "xy" ? (V, q) => [
        V,
        q,
        0
      ] : C === "xz" ? (V, q) => [
        V,
        0,
        q
      ] : (V, q) => [
        0,
        V,
        q
      ], P = [
        [
          -a,
          -a
        ],
        [
          a,
          -a
        ],
        [
          a,
          a
        ],
        [
          -a,
          a
        ]
      ], H = [];
      for (const [V, q] of P) H.push(...A(V, q));
      const U = new Fe();
      U.setAttribute("position", new Mt(H, 3));
      const G = new mt({
        color: _,
        transparent: true,
        opacity: S,
        depthWrite: false
      }), W = new el(U, G);
      return W.name = `grid-${C}-border`, W.renderOrder = 1, W;
    }, x = (C, _, S) => {
      const A = C === "xy" ? (G, W) => [
        G,
        W,
        0
      ] : C === "xz" ? (G, W) => [
        G,
        0,
        W
      ] : (G, W) => [
        0,
        G,
        W
      ], P = _ === "u" ? [
        ...A(-a, 0),
        ...A(a, 0)
      ] : [
        ...A(0, -a),
        ...A(0, a)
      ], H = new Fe();
      H.setAttribute("position", new Mt(P, 3));
      const U = new is(H, new mt({
        color: S,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      }));
      return U.name = `grid-${C}-eje-${_}`, U.renderOrder = 1, U;
    }, b = {
      xy: [
        14042459,
        5155178
      ],
      xz: [
        14042459,
        4882390
      ],
      yz: [
        5155178,
        4882390
      ]
    };
    for (const C of n) {
      s.add(p(C, o, d, 0.12)), s.add(p(C, i, c, 0.4));
      const [_, S] = b[C];
      s.add(x(C, "u", _)), s.add(x(C, "v", S)), s.add(f(C, c, 0.55));
    }
    return s.position.set(0, 0, 0), window.__hekatanGridConfig = {
      majorStep: i,
      minorStep: o,
      gridSize: l,
      planes: [
        ...n
      ]
    }, s;
  }
  function kr(l, e, t, s) {
    const n = new ft(), i = new Ql(0.5, 0.5, 0.5), o = new er(0.45, 0.7, 4);
    o.rotateX(Math.PI / 2), o.translate(0, 0, -0.35);
    const a = new gt({
      color: 10166822
    }), r = new gt({
      color: 2792847
    }), c = new gt({
      color: 3835647
    }), d = () => {
      const x = t.rawVal ?? [];
      if (x.length < 2) return e.gridSize.val * 0.5;
      let b = [
        1 / 0,
        1 / 0,
        1 / 0
      ], C = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const _ of x) for (let S = 0; S < 3; S++) _[S] < b[S] && (b[S] = _[S]), _[S] > C[S] && (C[S] = _[S]);
      return Math.max(C[0] - b[0], C[1] - b[1], C[2] - b[2], 0.1);
    }, p = () => 0.08 * d(), f = () => s.rawVal;
    return we.derive(() => {
      var _a2, _b;
      if (e.deformedShape.val, !e.supports.val) return;
      n.clear();
      const x = p();
      (_b = (_a2 = l.nodeInputs) == null ? void 0 : _a2.val.supports) == null ? void 0 : _b.forEach((b, C) => {
        const _ = t.val[C];
        if (!_) return;
        const S = b ?? [], A = (S[0] ? 1 : 0) + (S[1] ? 1 : 0) + (S[2] ? 1 : 0), P = (S[3] ? 1 : 0) + (S[4] ? 1 : 0) + (S[5] ? 1 : 0);
        let H;
        A >= 3 && P >= 3 ? H = new pt(i, a) : A >= 3 && P === 0 ? H = new pt(o, r) : H = new pt(o, c), H.position.set(_[0], _[1], _[2]);
        const U = x * f();
        H.scale.set(U, U, U), n.add(H);
      });
    }), we.derive(() => {
      if (s.val, !e.supports.rawVal) return;
      const b = p() * f();
      n.children.forEach((C) => C.scale.set(b, b, b));
    }), we.derive(() => {
      n.visible = e.supports.val;
    }), n;
  }
  function Cr(l, e, t, s) {
    const n = new ft();
    n.name = "loadsGroup";
    function i(a) {
      if (a.length < 2) return 0.12 * e.gridSize.rawVal;
      const r = [
        1 / 0,
        1 / 0,
        1 / 0
      ], c = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const p of a) for (let f = 0; f < 3; f++) r[f] = Math.min(r[f], p[f]), c[f] = Math.max(c[f], p[f]);
      return 0.08 * Math.max(c[0] - r[0], c[1] - r[1], c[2] - r[2], 0.1);
    }
    we.derive(() => {
      var _a2, _b, _c2;
      if (e.deformedShape.val, !e.loads.val) return;
      n.children.forEach((C) => {
        var _a3;
        return (_a3 = C.dispose) == null ? void 0 : _a3.call(C);
      }), n.clear();
      const a = t.val, r = i(a), c = 240, d = [];
      (_c2 = (_b = (_a2 = l.nodeInputs) == null ? void 0 : _a2.val) == null ? void 0 : _b.loads) == null ? void 0 : _c2.forEach((C, _) => {
        a[_] && C.slice(0, 3).some((S) => Math.abs(S) > 1e-15) && d.push(_);
      });
      let p = d;
      if (d.length > c) {
        const C = d.map((X) => a[X][0]), _ = d.map((X) => a[X][1]), S = Math.min(...C), A = Math.max(...C), P = Math.min(..._), H = Math.max(..._), U = d.map((X) => a[X][2]), G = Math.max(1e-6, (Math.max(...U) - Math.min(...U)) / 40), W = (X) => Math.round(X / G), V = new Set(U.map(W)), q = Math.max(4, Math.floor(c / Math.max(1, V.size))), D = Math.max(2, Math.round(Math.sqrt(q))), R = /* @__PURE__ */ new Map();
        for (const X of d) {
          const Q = A - S < 1e-9 ? 0 : (a[X][0] - S) / (A - S), re = H - P < 1e-9 ? 0 : (a[X][1] - P) / (H - P), ue = Math.min(D - 1, Math.floor(Q * D)), be = Math.min(D - 1, Math.floor(re * D)), ae = `${ue},${be},${W(a[X][2])}`, ie = Math.hypot(Q * D - (ue + 0.5), re * D - (be + 0.5)), le = R.get(ae);
          (!le || ie < le.d) && R.set(ae, {
            i: X,
            d: ie
          });
        }
        p = [
          ...R.values()
        ].map((X) => X.i);
      }
      let f = 0;
      for (const C of p) {
        const _ = l.nodeInputs.val.loads.get(C);
        for (let S = 0; S < 3; S++) f = Math.max(f, Math.abs(_[S]));
      }
      const x = p.length <= 60, b = (C) => {
        const _ = Math.abs(C);
        return _ >= 100 ? C.toFixed(0) : _ >= 10 ? C.toFixed(1) : C.toFixed(2);
      };
      for (const C of p) {
        const _ = l.nodeInputs.val.loads.get(C), S = a[C];
        if (S) for (let A = 0; A < 3; A++) {
          const P = _[A];
          if (!(Math.abs(P) > 1e-9 * (f || 1))) continue;
          const H = new te(A === 0 ? Math.sign(P) : 0, A === 1 ? Math.sign(P) : 0, A === 2 ? Math.sign(P) : 0), U = 0.45 + 0.55 * (f ? Math.abs(P) / f : 1), G = new an(H, new te(...S), 1, A === 2 ? 15637248 : 15022123, 0.3, 0.3);
          if (G.userData = {
            nudo: S,
            dir: H,
            rel: U
          }, n.add(G), x) {
            const W = new Bt(b(P), A === 2 ? "#f5b642" : "#ff6b5e");
            W.userData = {
              nudo: S,
              dir: H,
              rel: U,
              texto: true
            }, n.add(W);
          }
        }
      }
      o(r * s.rawVal);
    });
    function o(a) {
      n.children.forEach((r) => {
        const c = r.userData;
        if (!(c == null ? void 0 : c.dir)) return;
        const d = a * c.rel, p = new te(...c.nudo).addScaledVector(c.dir, -d * (c.texto ? 1.12 : 1));
        r.position.copy(p), c.texto ? r.updateScale(a * 0.38) : r.scale.set(d, d, d);
      });
    }
    return we.derive(() => {
      s.val, e.loads.rawVal && o(i(t.rawVal) * s.rawVal);
    }), we.derive(() => {
      n.visible = e.loads.val;
    }), n;
  }
  function Sr(l, e, t) {
    const s = new ft();
    return we.derive(() => {
      if (!l.nodesIndexes.val) return;
      s.children.forEach((i) => i.dispose()), s.clear();
      const n = 0.05 * l.gridSize.val * 0.6;
      e.val.forEach((i, o) => {
        const a = new Bt(`${o}`);
        a.position.set(...i), a.updateScale(n * t.rawVal), s.add(a);
      });
    }), we.derive(() => {
      if (t.val, !l.nodesIndexes.rawVal) return;
      const n = 0.05 * l.gridSize.val * 0.6;
      s.children.forEach((i) => i.updateScale(n * t.rawVal));
    }), we.derive(() => {
      s.visible = l.nodesIndexes.val;
    }), s;
  }
  function Mr(l, e, t, s) {
    const n = new ft();
    return we.derive(() => {
      var _a2;
      if (e.deformedShape.val, !e.elementsIndexes.val) return;
      n.children.forEach((o) => o.dispose()), n.clear();
      const i = 0.05 * e.gridSize.val * 0.6;
      (_a2 = l.elements) == null ? void 0 : _a2.val.forEach((o, a) => {
        const r = new Bt(`${a}`, void 0, "#001219");
        r.position.set(...$r(o.map((c) => t.rawVal[c]))), r.updateScale(i * s.rawVal), n.add(r);
      });
    }), we.derive(() => {
      if (s.val, !e.elementsIndexes.rawVal) return;
      const i = 0.05 * e.gridSize.val * 0.6;
      n.children.forEach((o) => o.updateScale(i * s.rawVal));
    }), we.derive(() => {
      n.visible = e.elementsIndexes.val;
    }), n;
  }
  function $r(l) {
    const e = l.reduce((s, n) => [
      s[0] + n[0],
      s[1] + n[1],
      s[2] + n[2]
    ], [
      0,
      0,
      0
    ]), t = l.length;
    return [
      e[0] / t,
      e[1] / t,
      e[2] / t
    ];
  }
  function Pa(l, e) {
    const t = new ft(), s = Math.min(0.05 * l, 0.6), n = Hs(), i = new Bt("X", "red", "transparent"), o = new Bt(e ? "Z" : "Y", "green", "transparent"), a = new Bt(e ? "Y" : "Z", "blue", "transparent"), r = new an(new te(1, 0, 0), new te(0, 0, 0), 1, n.axisArrow, 0.2, 0.2), c = new an(new te(0, 1, 0), new te(0, 0, 0), 1, n.axisArrow, 0.2, 0.2), d = new an(new te(0, 0, 1), new te(0, 0, 0), 1, n.axisArrow, 0.2, 0.2);
    return i.position.set(1.3 * s, 0, 0), o.position.set(0, 1.3 * s, 0), a.position.set(0, 0, 1.3 * s), i.updateScale(0.4 * s), o.updateScale(0.4 * s), a.updateScale(0.4 * s), r.scale.set(s, s, s), c.scale.set(s, s, s), d.scale.set(s, s, s), t.add(r, c, d, i, o, a), t;
  }
  function Di(l, e) {
    const t = new te(...l), n = new te(...e).clone().sub(t), i = n.length(), o = n.dot(new te(1, 0, 0)) / i, a = n.dot(new te(0, 1, 0)) / i, r = n.dot(new te(0, 0, 1)) / i, c = Math.sqrt(o ** 2 + a ** 2);
    let d = new ho().fromArray([
      [
        o,
        a,
        r
      ],
      [
        -a / c,
        o / c,
        0
      ],
      [
        -o * r / c,
        -a * r / c,
        c
      ]
    ].flat());
    return r === 1 && (d = new ho().fromArray([
      [
        0,
        0,
        1
      ],
      [
        0,
        1,
        0
      ],
      [
        -1,
        0,
        0
      ]
    ].flat())), r === -1 && (d = new ho().fromArray([
      [
        0,
        0,
        -1
      ],
      [
        0,
        1,
        0
      ],
      [
        1,
        0,
        0
      ]
    ].flat())), new Hi().setFromMatrix3(d);
  }
  function Mo(l, e) {
    return l == null ? void 0 : l.map((t, s) => (9 * t + e[s]) / 10);
  }
  function Yn(l) {
    const e = l.reduce((s, n) => [
      s[0] + n[0],
      s[1] + n[1],
      s[2] + n[2]
    ], [
      0,
      0,
      0
    ]), t = l.length;
    return [
      e[0] / t,
      e[1] / t,
      e[2] / t
    ];
  }
  function Er(l, e, t) {
    const s = Yn([
      e,
      t
    ]), n = Yn([
      l,
      t
    ]), i = Yn([
      l,
      e
    ]), o = new te(...s).sub(new te(...n)).normalize(), a = new te(...t).sub(new te(...i)).normalize(), r = o.clone().cross(a).normalize(), c = r.clone().cross(o).normalize();
    return new Hi().makeBasis(o, c, r);
  }
  function Ar(l, e, t, s) {
    const n = new ft(), i = new Fe(), o = new mt({
      vertexColors: true
    }), a = [
      0,
      0,
      0
    ], r = [
      1,
      0,
      0
    ], c = [
      0,
      1,
      0
    ], d = [
      0,
      0,
      1
    ];
    i.setAttribute("position", new Mt([
      ...a,
      ...r,
      ...a,
      ...c,
      ...a,
      ...d
    ], 3));
    const p = [
      255,
      0,
      0
    ], f = [
      0,
      255,
      0
    ], x = [
      0,
      0,
      255
    ];
    return i.setAttribute("color", new Mt([
      ...p,
      ...p,
      ...f,
      ...f,
      ...x,
      ...x
    ], 3)), we.derive(() => {
      var _a2;
      e.deformedShape.val, e.orientations.val && (n.clear(), (_a2 = l.elements) == null ? void 0 : _a2.val.forEach((b) => {
        const C = new is(i, o), _ = t.rawVal[b[0]], S = t.rawVal[b[1]];
        if (b.length === 2 && (C.position.set(...Mo(_, S)), C.rotation.setFromRotationMatrix(Di(_, S))), b.length === 3) {
          const H = t.rawVal[b[2]];
          C.position.set(...Yn([
            _,
            S,
            H
          ])), C.rotation.setFromRotationMatrix(Er(_, S, H));
        }
        const P = 0.05 * e.gridSize.rawVal * 0.75 * s.rawVal;
        C.scale.set(P, P, P), n.add(C);
      }));
    }), we.derive(() => {
      if (s.val, !e.orientations.rawVal) return;
      const C = 0.05 * e.gridSize.val * 0.75 * s.rawVal;
      n.children.forEach((_) => _.scale.set(C, C, C));
    }), we.derive(() => {
      n.visible = e.orientations.val;
    }), n;
  }
  function Tr(l) {
    if (l.name) return l.name;
    if (l.type === "rect") {
      const e = (l.b * 100).toFixed(0), t = (l.h * 100).toFixed(0);
      return `${e}x${t}`;
    }
    return l.type === "circ" ? `D${(l.d * 100).toFixed(0)}` : "";
  }
  function zr(l, e, t, s) {
    const n = new ft(), i = new ft();
    n.add(i);
    function o(G, W) {
      const V = G / 2, q = W / 2, D = new Float32Array([
        0,
        -V,
        -q,
        0,
        V,
        -q,
        0,
        V,
        q,
        0,
        -V,
        -q,
        0,
        V,
        q,
        0,
        -V,
        q
      ]), R = new Fe();
      R.setAttribute("position", new bt(D, 3));
      const X = new Float32Array([
        0,
        -V,
        -q,
        0,
        V,
        -q,
        0,
        V,
        q,
        0,
        -V,
        q,
        0,
        -V,
        -q
      ]), Q = new Fe();
      return Q.setAttribute("position", new bt(X, 3)), {
        fill: R,
        outline: Q
      };
    }
    function a(G, W = 24) {
      const V = G / 2, q = new Float32Array(W * 9);
      for (let Q = 0; Q < W; Q++) {
        const re = Q / W * Math.PI * 2, ue = (Q + 1) / W * Math.PI * 2;
        q[Q * 9] = 0, q[Q * 9 + 1] = 0, q[Q * 9 + 2] = 0, q[Q * 9 + 3] = 0, q[Q * 9 + 4] = V * Math.cos(re), q[Q * 9 + 5] = V * Math.sin(re), q[Q * 9 + 6] = 0, q[Q * 9 + 7] = V * Math.cos(ue), q[Q * 9 + 8] = V * Math.sin(ue);
      }
      const D = new Fe();
      D.setAttribute("position", new bt(q, 3));
      const R = new Float32Array((W + 1) * 3);
      for (let Q = 0; Q <= W; Q++) {
        const re = Q / W * Math.PI * 2;
        R[Q * 3] = 0, R[Q * 3 + 1] = V * Math.cos(re), R[Q * 3 + 2] = V * Math.sin(re);
      }
      const X = new Fe();
      return X.setAttribute("position", new bt(R, 3)), {
        fill: D,
        outline: X
      };
    }
    function r(G, W, V, q) {
      const D = V ?? W * 0.08, R = q ?? G * 0.07, X = G / 2, Q = W / 2, re = Q - D, ue = R / 2, be = [];
      function ae(pe, Se, ve, Ae) {
        be.push(0, pe, Se, 0, ve, Se, 0, ve, Ae, 0, pe, Se, 0, ve, Ae, 0, pe, Ae);
      }
      ae(-X, -Q, X, -re), ae(-ue, -re, ue, re), ae(-X, re, X, Q);
      const ie = new Fe();
      ie.setAttribute("position", new bt(new Float32Array(be), 3));
      const le = new Float32Array([
        0,
        -X,
        -Q,
        0,
        X,
        -Q,
        0,
        X,
        -re,
        0,
        ue,
        -re,
        0,
        ue,
        re,
        0,
        X,
        re,
        0,
        X,
        Q,
        0,
        -X,
        Q,
        0,
        -X,
        re,
        0,
        -ue,
        re,
        0,
        -ue,
        -re,
        0,
        -X,
        -re,
        0,
        -X,
        -Q
      ]), he = new Fe();
      return he.setAttribute("position", new bt(le, 3)), {
        fill: ie,
        outline: he
      };
    }
    function c(G, W, V) {
      const q = G / 2, D = W / 2, R = q - V, X = D - V, Q = [];
      function re(ie, le, he, pe) {
        Q.push(0, ie, le, 0, he, le, 0, he, pe, 0, ie, le, 0, he, pe, 0, ie, pe);
      }
      re(-q, -D, q, -X), re(-q, X, q, D), re(-q, -X, -R, X), re(R, -X, q, X);
      const ue = new Fe();
      ue.setAttribute("position", new bt(new Float32Array(Q), 3));
      const be = new Float32Array([
        0,
        -q,
        -D,
        0,
        q,
        -D,
        0,
        q,
        -D,
        0,
        q,
        D,
        0,
        q,
        D,
        0,
        -q,
        D,
        0,
        -q,
        D,
        0,
        -q,
        -D,
        0,
        -R,
        -X,
        0,
        R,
        -X,
        0,
        R,
        -X,
        0,
        R,
        X,
        0,
        R,
        X,
        0,
        -R,
        X,
        0,
        -R,
        X,
        0,
        -R,
        -X
      ]), ae = new Fe();
      return ae.setAttribute("position", new bt(be, 3)), {
        fill: ue,
        outline: ae
      };
    }
    function d(G, W, V) {
      const q = G / 2, D = W / 2, R = q - V, X = D - V, Q = new Fe(), re = new Float32Array([
        0,
        -R,
        -X,
        0,
        R,
        -X,
        0,
        R,
        X,
        0,
        -R,
        -X,
        0,
        R,
        X,
        0,
        -R,
        X
      ]);
      Q.setAttribute("position", new bt(re, 3));
      const ue = [];
      function be(he, pe, Se, ve) {
        ue.push(0, he, pe, 0, Se, pe, 0, Se, ve, 0, he, pe, 0, Se, ve, 0, he, ve);
      }
      be(-q, -D, q, -X), be(-q, X, q, D), be(-q, -X, -R, X), be(R, -X, q, X);
      const ae = new Fe();
      ae.setAttribute("position", new bt(new Float32Array(ue), 3));
      const ie = new Float32Array([
        0,
        -q,
        -D,
        0,
        q,
        -D,
        0,
        q,
        -D,
        0,
        q,
        D,
        0,
        q,
        D,
        0,
        -q,
        D,
        0,
        -q,
        D,
        0,
        -q,
        -D,
        0,
        -R,
        -X,
        0,
        R,
        -X,
        0,
        R,
        -X,
        0,
        R,
        X,
        0,
        R,
        X,
        0,
        -R,
        X,
        0,
        -R,
        X,
        0,
        -R,
        -X
      ]), le = new Fe();
      return le.setAttribute("position", new bt(ie, 3)), {
        concFill: Q,
        steelFillGeom: ae,
        outline: le
      };
    }
    function p(G, W, V) {
      const q = [], D = [
        [
          0,
          -G / 2,
          -W / 2
        ],
        [
          0,
          -G / 2 + V,
          -W / 2
        ],
        [
          0,
          -G / 2 + V,
          W / 2 - V
        ],
        [
          0,
          G / 2,
          W / 2 - V
        ],
        [
          0,
          G / 2,
          W / 2
        ],
        [
          0,
          -G / 2,
          W / 2
        ]
      ], R = [
        0,
        1,
        2,
        0,
        2,
        5,
        2,
        3,
        4,
        2,
        4,
        5
      ];
      for (const ue of R) q.push(...D[ue]);
      const X = new Fe();
      X.setAttribute("position", new bt(new Float32Array(q), 3));
      const Q = [];
      for (let ue = 0; ue < D.length; ue++) {
        const be = (ue + 1) % D.length;
        Q.push(...D[ue], ...D[be]);
      }
      const re = new Fe();
      return re.setAttribute("position", new bt(new Float32Array(Q), 3)), {
        fill: X,
        outline: re
      };
    }
    function f(G, W, V, q) {
      const D = q / 2, R = [], X = [
        [
          0,
          -G - D,
          -W / 2
        ],
        [
          0,
          -V - D,
          -W / 2
        ],
        [
          0,
          -V - D,
          W / 2 - V
        ],
        [
          0,
          -D,
          W / 2 - V
        ],
        [
          0,
          -D,
          W / 2
        ],
        [
          0,
          -G - D,
          W / 2
        ]
      ], Q = [
        [
          0,
          D,
          -W / 2
        ],
        [
          0,
          D + V,
          -W / 2
        ],
        [
          0,
          D + V,
          W / 2 - V
        ],
        [
          0,
          G + D,
          W / 2 - V
        ],
        [
          0,
          G + D,
          W / 2
        ],
        [
          0,
          D,
          W / 2
        ]
      ], re = [
        0,
        1,
        2,
        0,
        2,
        5,
        2,
        3,
        4,
        2,
        4,
        5
      ];
      for (const ie of re) R.push(...X[ie]);
      for (const ie of re) R.push(...Q[ie]);
      const ue = new Fe();
      ue.setAttribute("position", new bt(new Float32Array(R), 3));
      const be = [];
      for (const ie of [
        X,
        Q
      ]) for (let le = 0; le < ie.length; le++) {
        const he = (le + 1) % ie.length;
        be.push(...ie[le], ...ie[he]);
      }
      const ae = new Fe();
      return ae.setAttribute("position", new bt(new Float32Array(be), 3)), {
        fill: ue,
        outline: ae
      };
    }
    function x(G, W, V, q) {
      const D = W / 2, R = G, X = [
        [
          0,
          -R,
          -D
        ],
        [
          0,
          -R,
          -D + V
        ],
        [
          0,
          -q,
          -D + V
        ],
        [
          0,
          -q,
          D - V
        ],
        [
          0,
          -R,
          D - V
        ],
        [
          0,
          -R,
          D
        ],
        [
          0,
          0,
          D
        ],
        [
          0,
          0,
          -D
        ]
      ], Q = [
        0,
        1,
        7,
        1,
        6,
        7,
        1,
        2,
        6,
        2,
        5,
        6,
        2,
        3,
        5,
        3,
        4,
        5
      ], re = [];
      for (const ie of Q) re.push(...X[ie]);
      const ue = new Fe();
      ue.setAttribute("position", new bt(new Float32Array(re), 3));
      const be = [];
      for (let ie = 0; ie < X.length; ie++) {
        const le = (ie + 1) % X.length;
        be.push(...X[ie], ...X[le]);
      }
      const ae = new Fe();
      return ae.setAttribute("position", new bt(new Float32Array(be), 3)), {
        fill: ue,
        outline: ae
      };
    }
    function b(G, W, V, q, D) {
      const R = W / 2, X = D / 2, Q = [], re = [
        [
          0,
          -G,
          -R
        ],
        [
          0,
          -G,
          -R + V
        ],
        [
          0,
          -X - q,
          -R + V
        ],
        [
          0,
          -X - q,
          R - V
        ],
        [
          0,
          -G,
          R - V
        ],
        [
          0,
          -G,
          R
        ],
        [
          0,
          -X,
          R
        ],
        [
          0,
          -X,
          -R
        ]
      ], ue = re.map((he) => [
        he[0],
        -he[1],
        he[2]
      ]), be = [
        0,
        1,
        7,
        1,
        6,
        7,
        1,
        2,
        6,
        2,
        5,
        6,
        2,
        3,
        5,
        3,
        4,
        5
      ];
      for (const he of be) Q.push(...re[he]);
      for (const he of be) Q.push(...ue[he]);
      const ae = new Fe();
      ae.setAttribute("position", new bt(new Float32Array(Q), 3));
      const ie = [];
      for (const he of [
        re,
        ue
      ]) for (let pe = 0; pe < he.length; pe++) {
        const Se = (pe + 1) % he.length;
        ie.push(...he[pe], ...he[Se]);
      }
      const le = new Fe();
      return le.setAttribute("position", new bt(new Float32Array(ie), 3)), {
        fill: ae,
        outline: le
      };
    }
    function C(G, W, V, q) {
      const D = G / 2, R = W / 2, X = q / 2, Q = [
        [
          0,
          -X,
          -R
        ],
        [
          0,
          X,
          -R
        ],
        [
          0,
          X,
          R - V
        ],
        [
          0,
          D,
          R - V
        ],
        [
          0,
          D,
          R
        ],
        [
          0,
          -D,
          R
        ],
        [
          0,
          -D,
          R - V
        ],
        [
          0,
          -X,
          R - V
        ]
      ], re = [
        0,
        1,
        7,
        1,
        2,
        7,
        6,
        7,
        5,
        2,
        3,
        4,
        2,
        4,
        5,
        2,
        5,
        7
      ], ue = [];
      for (const le of re) ue.push(...Q[le]);
      const be = new Fe();
      be.setAttribute("position", new bt(new Float32Array(ue), 3));
      const ae = [];
      for (let le = 0; le < Q.length; le++) {
        const he = (le + 1) % Q.length;
        ae.push(...Q[le], ...Q[he]);
      }
      const ie = new Fe();
      return ie.setAttribute("position", new bt(new Float32Array(ae), 3)), {
        fill: be,
        outline: ie
      };
    }
    function _(G, W, V = 24) {
      const q = G / 2, D = q - W, R = [];
      for (let ue = 0; ue < V; ue++) {
        const be = ue / V * Math.PI * 2, ae = (ue + 1) / V * Math.PI * 2, ie = Math.cos(be), le = Math.sin(be), he = Math.cos(ae), pe = Math.sin(ae);
        R.push(0, q * ie, q * le, 0, q * he, q * pe, 0, D * he, D * pe), R.push(0, q * ie, q * le, 0, D * he, D * pe, 0, D * ie, D * le);
      }
      const X = new Fe();
      X.setAttribute("position", new bt(new Float32Array(R), 3));
      const Q = [];
      for (let ue = 0; ue < V; ue++) {
        const be = ue / V * Math.PI * 2, ae = (ue + 1) / V * Math.PI * 2;
        Q.push(0, q * Math.cos(be), q * Math.sin(be), 0, q * Math.cos(ae), q * Math.sin(ae)), Q.push(0, D * Math.cos(be), D * Math.sin(be), 0, D * Math.cos(ae), D * Math.sin(ae));
      }
      const re = new Fe();
      return re.setAttribute("position", new bt(new Float32Array(Q), 3)), {
        fill: X,
        outline: re
      };
    }
    const S = new gt({
      color: 52479,
      transparent: true,
      opacity: 0.35,
      side: Pt,
      depthWrite: false
    }), A = new mt({
      color: 52479
    }), P = new gt({
      color: 16750848,
      transparent: true,
      opacity: 0.4,
      side: Pt,
      depthWrite: false
    }), H = new mt({
      color: 16750848
    });
    function U(G, W) {
      const V = Math.abs(W[0] - G[0]), q = Math.abs(W[1] - G[1]), D = Math.abs(W[2] - G[2]);
      return D > V && D > q || q > V && q > D;
    }
    return we.derive(() => {
      const G = t.val;
      if (!G) return;
      const W = (V) => {
        var _a2;
        const q = (_a2 = V.userData) == null ? void 0 : _a2.secElem;
        if (!q) return;
        const D = G[q[0]], R = G[q[1]];
        !D || !R || (V.position.set((D[0] + R[0]) / 2, (D[1] + R[1]) / 2, (D[2] + R[2]) / 2), V.rotation.setFromRotationMatrix(Di(D, R)));
      };
      n.children.forEach(W), i.children.forEach(W);
    }), we.derive(() => {
      var _a2, _b;
      e.deformedShape.val, e.secColumns.val, e.secBeams.val, e.secFloor.val;
      const G = e.secColumns.rawVal, W = e.secBeams.rawVal;
      if (!G && !W) {
        n.children.forEach((X) => {
          X instanceof Bt && X.dispose();
        }), n.clear();
        return;
      }
      n.children.forEach((X) => {
        X instanceof Bt && X.dispose();
      }), i.clear(), n.clear();
      const V = (_a2 = l.elements) == null ? void 0 : _a2.val, q = (_b = l.elementInputs) == null ? void 0 : _b.val;
      if (!V || !q) return;
      const D = q.sectionShapes, R = e.secFloor.rawVal;
      V.forEach((X, Q) => {
        if (X.length !== 2) return;
        const re = t.rawVal[X[0]], ue = t.rawVal[X[1]];
        if (!re || !ue) return;
        const be = U(re, ue);
        if (be && !G || !be && !W) return;
        if (R >= 0) {
          const Se = Math.min(re[1], ue[1]);
          Math.max(re[1], ue[1]);
          const ve = e.gridSize.rawVal || 3;
          if (Math.floor(Se / ve + 0.01) !== R) return;
        }
        const ae = D == null ? void 0 : D.get(Q);
        if (!ae || !(ae.h > 0 || ae.d > 0 || ae.b > 0)) return;
        const ie = [
          (re[0] + ue[0]) / 2,
          (re[1] + ue[1]) / 2,
          (re[2] + ue[2]) / 2
        ], le = Di(re, ue), he = (Se) => (Se.userData.secElem = X, Se);
        if (ae.type === "CFT") {
          const Se = d(ae.b, ae.h, ae.tw ?? ae.b * 0.05), ve = new pt(Se.concFill, S);
          ve.position.set(...ie), he(ve), ve.rotation.setFromRotationMatrix(le), n.add(ve);
          const Ae = new pt(Se.steelFillGeom, P);
          Ae.position.set(...ie), he(Ae), Ae.rotation.setFromRotationMatrix(le), n.add(Ae);
          const Ve = new Vt(Se.outline, H);
          Ve.position.set(...ie), he(Ve), Ve.rotation.setFromRotationMatrix(le), n.add(Ve);
        } else {
          let Se, ve, Ae;
          switch (ae.type) {
            case "rect":
              Se = o(ae.b, ae.h), ve = S, Ae = A;
              break;
            case "circ":
              Se = a(ae.d), ve = S, Ae = A;
              break;
            case "I":
              Se = r(ae.b, ae.h, ae.tf, ae.tw), ve = P, Ae = H;
              break;
            case "HSS":
              Se = c(ae.b, ae.h, ae.tw ?? ae.b * 0.05), ve = P, Ae = H;
              break;
            case "CFT":
              Se = d(ae.b, ae.h, ae.tw ?? ae.b * 0.05), ve = P, Ae = H;
              break;
            case "L":
              Se = p(ae.b ?? ae.h, ae.h, ae.t ?? ae.tw ?? 3e-3), ve = P, Ae = H;
              break;
            case "2L":
              Se = f(ae.b ?? ae.h, ae.h, ae.t ?? ae.tw ?? 3e-3, ae.dis ?? 0.01), ve = P, Ae = H;
              break;
            case "C":
            case "coldC":
              Se = x(ae.b, ae.h, ae.tf ?? ae.t ?? 3e-3, ae.tw ?? ae.t ?? 3e-3), ve = P, Ae = H;
              break;
            case "2C":
              Se = b(ae.b, ae.h, ae.tf ?? 5e-3, ae.tw ?? 5e-3, ae.dis ?? 0.01), ve = P, Ae = H;
              break;
            case "T":
              Se = C(ae.b, ae.h, ae.tf ?? 0.01, ae.tw ?? 6e-3), ve = P, Ae = H;
              break;
            case "pipe":
              Se = _(ae.d, ae.tw ?? ae.d * 0.05), ve = P, Ae = H;
              break;
            default:
              return;
          }
          const Ve = new pt(Se.fill, ve);
          Ve.position.set(...ie), he(Ve), Ve.rotation.setFromRotationMatrix(le), n.add(Ve);
          const ot = new Vt(Se.outline, Ae);
          ot.position.set(...ie), he(ot), ot.rotation.setFromRotationMatrix(le), n.add(ot);
        }
        const pe = Tr(ae);
        if (pe) {
          const ve = [
            "I",
            "HSS",
            "CFT",
            "L",
            "2L",
            "C",
            "2C",
            "T",
            "pipe",
            "coldC"
          ].includes(ae.type) ? "#ff9900" : "#00ccff", Ae = new Bt(pe, ve, "transparent");
          Ae.position.set(ie[0], ie[1], ie[2]), he(Ae);
          const Ve = 0.05 * e.gridSize.rawVal * 0.5;
          Ae.updateScale(Ve * ((s == null ? void 0 : s.rawVal) ?? 1)), i.add(Ae);
        }
      });
    }), s && we.derive(() => {
      if (s.val, !e.sections.rawVal) return;
      const G = 0.05 * e.gridSize.val * 0.5;
      i.children.forEach((W) => {
        W instanceof Bt && W.updateScale(G * s.rawVal);
      });
    }), we.derive(() => {
      n.visible = e.sections.val;
    }), we.derive(() => {
      i.visible = e.sectionLabels.val;
    }), n;
  }
  function Ir(l) {
    if (!l) return null;
    const e = l.type, t = (d, p) => [
      d,
      p
    ], s = (d, p) => [
      t(-d / 2, -p / 2),
      t(d / 2, -p / 2),
      t(d / 2, p / 2),
      t(-d / 2, p / 2)
    ], n = (d, p = 24) => {
      const f = d / 2, x = [];
      for (let b = 0; b < p; b++) {
        const C = 2 * Math.PI * b / p;
        x.push(t(f * Math.cos(C), f * Math.sin(C)));
      }
      return x;
    }, i = l.b ?? 0, o = l.h ?? 0, a = l.d ?? 0, r = l.tw ?? l.t ?? 0, c = l.tf ?? l.t ?? 0;
    switch (e) {
      case "rect":
        return i && o ? {
          contorno: s(i, o)
        } : null;
      case "circ":
        return a ? {
          contorno: n(a)
        } : null;
      case "pipe":
        return a && r ? {
          contorno: n(a),
          huecos: [
            n(a - 2 * r).reverse()
          ]
        } : null;
      case "HSS":
        return i && o && r ? {
          contorno: s(i, o),
          huecos: [
            s(i - 2 * r, o - 2 * (c || r)).reverse()
          ]
        } : null;
      case "CFT":
        return i && o ? {
          contorno: s(i, o)
        } : null;
      case "I":
        return i && o && r && c ? {
          contorno: [
            t(-i / 2, -o / 2),
            t(i / 2, -o / 2),
            t(i / 2, -o / 2 + c),
            t(r / 2, -o / 2 + c),
            t(r / 2, o / 2 - c),
            t(i / 2, o / 2 - c),
            t(i / 2, o / 2),
            t(-i / 2, o / 2),
            t(-i / 2, o / 2 - c),
            t(-r / 2, o / 2 - c),
            t(-r / 2, -o / 2 + c),
            t(-i / 2, -o / 2 + c)
          ]
        } : null;
      case "C":
      case "2C":
      case "coldC":
        return i && o && r && c ? {
          contorno: [
            t(-i / 2, -o / 2),
            t(i / 2, -o / 2),
            t(i / 2, -o / 2 + c),
            t(-i / 2 + r, -o / 2 + c),
            t(-i / 2 + r, o / 2 - c),
            t(i / 2, o / 2 - c),
            t(i / 2, o / 2),
            t(-i / 2, o / 2)
          ]
        } : null;
      case "T":
        return i && o && r && c ? {
          contorno: [
            t(-r / 2, -o / 2),
            t(r / 2, -o / 2),
            t(r / 2, o / 2 - c),
            t(i / 2, o / 2 - c),
            t(i / 2, o / 2),
            t(-i / 2, o / 2),
            t(-i / 2, o / 2 - c),
            t(-r / 2, o / 2 - c)
          ]
        } : null;
      case "L":
      case "2L":
        return i && o && r ? {
          contorno: [
            t(-i / 2, -o / 2),
            t(i / 2, -o / 2),
            t(i / 2, -o / 2 + r),
            t(-i / 2 + r, -o / 2 + r),
            t(-i / 2 + r, o / 2),
            t(-i / 2, o / 2)
          ]
        } : null;
      default:
        return i && o ? {
          contorno: s(i, o)
        } : a ? {
          contorno: n(a)
        } : null;
    }
  }
  function Fr(l, e, t) {
    if (!l || l <= 0 || !e || !t || e <= 0 || t <= 0) return null;
    const s = Math.sqrt(Math.sqrt(t / e)), n = Math.sqrt(l / s), i = l / n;
    return !isFinite(n) || !isFinite(i) || n <= 0 || i <= 0 ? null : {
      contorno: [
        [
          -n / 2,
          -i / 2
        ],
        [
          n / 2,
          -i / 2
        ],
        [
          n / 2,
          i / 2
        ],
        [
          -n / 2,
          i / 2
        ]
      ]
    };
  }
  function Pr(l) {
    const e = new Xn();
    l.contorno.forEach(([t, s], n) => n ? e.lineTo(t, s) : e.moveTo(t, s)), e.closePath();
    for (const t of l.huecos ?? []) {
      const s = new sr();
      t.forEach(([n, i], o) => o ? s.lineTo(n, i) : s.moveTo(n, i)), s.closePath(), e.holes.push(s);
    }
    return e;
  }
  function Rr(l, e, t) {
    const s = new ft();
    s.name = "extrusion";
    const n = new uo({
      color: 8369151,
      transparent: true,
      opacity: 0.92,
      side: Pt
    }), i = new uo({
      color: 12623968,
      transparent: true,
      opacity: 0.85,
      side: Pt
    }), o = new uo({
      color: 11583173,
      transparent: true,
      opacity: 0.85,
      side: Pt
    }), a = new ft();
    a.add(new tl(16777215, 0.55));
    const r = new Ri(16777215, 0.75);
    r.position.set(30, 25, 40);
    const c = new Ri(16777215, 0.35);
    c.position.set(-25, -20, 15), a.add(r, c);
    let d = 0;
    return we.derive(() => {
      var _a2, _b, _c2, _d2, _e;
      const p = ((_a2 = e.extruded) == null ? void 0 : _a2.val) ?? false;
      globalThis.__extrusionDebug = {
        corridas: ++d,
        on: p
      }, s.visible = p;
      for (const A of [
        ...s.children
      ]) A !== a && (s.remove(A), (_c2 = (_b = A.geometry) == null ? void 0 : _b.dispose) == null ? void 0 : _c2.call(_b));
      if (s.children.includes(a) || s.add(a), !p) return;
      const f = t.val ?? [], x = ((_d2 = l.elements) == null ? void 0 : _d2.val) ?? [], b = ((_e = l.elementInputs) == null ? void 0 : _e.val) ?? {}, C = b.sectionShapes ?? /* @__PURE__ */ new Map(), _ = b.thicknesses ?? /* @__PURE__ */ new Map();
      let S = "";
      try {
        x.forEach((A, P) => {
          var _a3, _b2, _c3;
          if (A.length === 2) {
            let H = Ir(C.get(P)), U = true;
            if (H || (H = Fr((_a3 = b.areas) == null ? void 0 : _a3.get(P), (_b2 = b.momentsOfInertiaY) == null ? void 0 : _b2.get(P), (_c3 = b.momentsOfInertiaZ) == null ? void 0 : _c3.get(P)), U = false), !H) return;
            const G = f[A[0]], W = f[A[1]];
            if (!G || !W) return;
            const V = Math.hypot(W[0] - G[0], W[1] - G[1], W[2] - G[2]);
            if (V < 1e-9) return;
            const q = new tr(Pr(H), {
              depth: V,
              bevelEnabled: false,
              curveSegments: 4
            });
            q.applyMatrix4(new Hi().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
            const D = new pt(q, U ? n : i);
            D.position.set(G[0], G[1], G[2]), D.rotation.setFromRotationMatrix(Di(G, W)), s.add(D);
            return;
          }
          if (A.length === 3 || A.length === 4) {
            const H = _.get(P);
            if (!H || H <= 0) return;
            const U = A.map((pe) => f[pe]).filter(Boolean);
            if (U.length < 3) return;
            const G = [
              U[1][0] - U[0][0],
              U[1][1] - U[0][1],
              U[1][2] - U[0][2]
            ], W = [
              U[2][0] - U[0][0],
              U[2][1] - U[0][1],
              U[2][2] - U[0][2]
            ], V = G[1] * W[2] - G[2] * W[1], q = G[2] * W[0] - G[0] * W[2], D = G[0] * W[1] - G[1] * W[0], R = Math.hypot(V, q, D);
            if (R < 1e-12) return;
            const X = [
              V / R,
              q / R,
              D / R
            ], Q = [], re = (pe) => U.map((Se) => [
              Se[0] + X[0] * pe,
              Se[1] + X[1] * pe,
              Se[2] + X[2] * pe
            ]), ue = Math.abs(X[2]) > 0.5, be = X[2] > 0 ? -1 : 1, ae = re(ue ? 0 : +H / 2), ie = re(ue ? be * H : -H / 2), le = (pe, Se, ve) => Q.push(...pe, ...Se, ...ve);
            for (const pe of [
              ae,
              ie
            ]) le(pe[0], pe[1], pe[2]), pe.length === 4 && le(pe[0], pe[2], pe[3]);
            for (let pe = 0; pe < U.length; pe++) {
              const Se = (pe + 1) % U.length;
              le(ae[pe], ie[pe], ie[Se]), le(ae[pe], ie[Se], ae[Se]);
            }
            const he = new Fe();
            he.setAttribute("position", new Mt(Q, 3)), he.computeVertexNormals(), s.add(new pt(he, o));
          }
        });
      } catch (A) {
        S = String((A == null ? void 0 : A.message) ?? A);
      }
      globalThis.__extrusionDebug = {
        corridas: d,
        on: p,
        fallo: S,
        nElementos: x.length,
        nFormas: C.size,
        nEspesores: _.size,
        mallas: s.children.length - 1
      };
    }), s;
  }
  function ll(l, e, t = 0) {
    const s = [
      e[0] - l[0],
      e[1] - l[1],
      e[2] - l[2]
    ], n = Math.hypot(s[0], s[1], s[2]) || 1, i = s[0] / n, o = s[1] / n, a = s[2] / n, r = Math.sqrt(i * i + o * o);
    let c, d, p;
    if (r < 1e-9) {
      const f = a > 0 ? 1 : -1;
      c = [
        0,
        0,
        f
      ], d = [
        1,
        0,
        0
      ], p = [
        0,
        f,
        0
      ];
    } else c = [
      i,
      o,
      a
    ], d = [
      -i * a / r,
      -o * a / r,
      r
    ], p = [
      o / r,
      -i / r,
      0
    ];
    if (Math.abs(t) > 1e-12) {
      const f = t * Math.PI / 180, x = Math.cos(f), b = Math.sin(f), C = d.map((S, A) => x * S + b * p[A]), _ = p.map((S, A) => -b * d[A] + x * S);
      d = C, p = _;
    }
    return {
      e1: c,
      e2: d,
      e3: p
    };
  }
  function $o(l, e) {
    if (!e) return [
      0,
      0
    ];
    const t = Number(e[0] ?? 0), s = Number(e[1] ?? 0);
    return l === "bendingsY" ? [
      t,
      -s
    ] : [
      -t,
      s
    ];
  }
  function rl(l, e) {
    const t = (s) => s.map((n) => -n);
    switch (l) {
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
  class _i extends ft {
    constructor(e, t, s, n, i, o, a) {
      super();
      const r = new Xn().moveTo(0, 0).lineTo(0, o[1]).lineTo(s, o[1]).lineTo(s, 0).lineTo(0, 0), c = r.getPoints(), d = new Fe().setFromPoints(c);
      this.lines = new Vt(d, new mt({
        color: Hs().resultOutline
      })), this.lines.position.set(...e), this.lines.rotation.setFromRotationMatrix(n), a && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
      const p = new zi(r), f = new gt({
        color: o[1] > 0 ? 24435 : 11411474,
        side: Pt
      });
      this.mesh = new pt(p, f), this.mesh.position.set(...e), this.mesh.rotation.setFromRotationMatrix(n), a && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh), this.text = new Bt(`${i[1].toFixed(4)}`), this.normalizedResult = o, this.textPosition = Yn([
        e,
        t
      ]), this.text.position.set(...this.textPosition), this.text.rotation.setFromRotationMatrix(n), this.add(this.text);
    }
    updateScale(e) {
      this.lines.scale.set(1, e * 2, 1), this.mesh.scale.set(1, e * 2, 1), this.text.updateScale(e * 0.6), this.text.position.set(...this.textPosition), this.text.translateZ(this.normalizedResult[1] * 2.5 * e);
    }
    dispose() {
      this.lines.geometry.dispose(), this.lines.material.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.text.dispose();
    }
  }
  class wo extends ft {
    constructor(e, t, s, n, i, o, a) {
      super();
      const r = i[0] * s / (i[0] + i[1]), c = i[0] * i[1] > 0;
      if (this.text = new Bt(`${i[0].toFixed(4)}`), this.text2 = new Bt(`${(i[1] * -1).toFixed(4)}`), this.normalizedResult = o, this.textPosition = Mo(e, t), this.text2Position = Mo(t, e), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.rotation.setFromRotationMatrix(n), this.text2.rotation.setFromRotationMatrix(n), this.add(this.text, this.text2), c) {
        const d = new Xn().moveTo(0, 0).lineTo(0, o[0]).lineTo(r, 0).lineTo(0, 0), p = new Xn().moveTo(r, 0).lineTo(s, -o[1]).lineTo(s, 0).lineTo(r, 0), f = d.getPoints(), x = p.getPoints(), b = new Fe().setFromPoints(f), C = new Fe().setFromPoints(x), _ = new mt({
          color: Hs().resultOutline
        });
        this.lines = new Vt(b, _), this.lines2 = new Vt(C, _), this.lines.position.set(...e), this.lines2.position.set(...e), this.lines.rotation.setFromRotationMatrix(n), this.lines2.rotation.setFromRotationMatrix(n), a && this.lines.rotateX(Math.PI / 2), a && this.lines2.rotateX(Math.PI / 2), this.add(this.lines, this.lines2);
        const S = new zi(d), A = new zi(p), P = new gt({
          color: o[0] > 0 ? 24435 : 11411474,
          side: Pt
        }), H = new gt({
          color: -o[1] > 0 ? 24435 : 11411474,
          side: Pt
        });
        this.mesh = new pt(S, P), this.mesh2 = new pt(A, H), this.mesh.position.set(...e), this.mesh2.position.set(...e), this.mesh.rotation.setFromRotationMatrix(n), this.mesh2.rotation.setFromRotationMatrix(n), a && this.mesh.rotateX(Math.PI / 2), a && this.mesh2.rotateX(Math.PI / 2), this.add(this.mesh, this.mesh2);
      } else {
        const d = new Xn().moveTo(0, 0).lineTo(0, o[0]).lineTo(s, -o[1]).lineTo(s, 0).lineTo(0, 0), p = d.getPoints(), f = new Fe().setFromPoints(p);
        this.lines = new Vt(f, new mt({
          color: Hs().resultOutline
        })), this.lines.position.set(...e), this.lines.rotation.setFromRotationMatrix(n), a && this.lines.rotateX(Math.PI / 2), this.add(this.lines);
        const x = new zi(d), b = new gt({
          color: o[0] > 0 ? 24435 : 11411474,
          side: Pt
        });
        this.mesh = new pt(x, b), this.mesh.position.set(...e), this.mesh.rotation.setFromRotationMatrix(n), a && this.mesh.rotateX(Math.PI / 2), this.add(this.mesh);
      }
    }
    updateScale(e) {
      var _a2, _b;
      this.lines.scale.set(1, e * 2, 1), (_a2 = this.lines2) == null ? void 0 : _a2.scale.set(1, e * 2, 1), this.mesh.scale.set(1, e * 2, 1), (_b = this.mesh2) == null ? void 0 : _b.scale.set(1, e * 2, 1), this.text.updateScale(e * 0.6), this.text2.updateScale(e * 0.6), this.text.position.set(...this.textPosition), this.text2.position.set(...this.text2Position), this.text.translateZ(this.normalizedResult[0] * 2.5 * e), this.text2.translateZ(-this.normalizedResult[1] * 2.5 * e);
    }
    dispose() {
      var _a2, _b, _c2, _d2, _e, _f;
      this.lines.geometry.dispose(), (_a2 = this.lines2) == null ? void 0 : _a2.geometry.dispose(), this.lines.material.dispose(), (_c2 = (_b = this.lines2) == null ? void 0 : _b.material) == null ? void 0 : _c2.dispose(), this.mesh.geometry.dispose(), (_d2 = this.mesh2) == null ? void 0 : _d2.geometry.dispose(), this.mesh.material.dispose(), (_f = (_e = this.mesh2) == null ? void 0 : _e.material) == null ? void 0 : _f.dispose(), this.text.dispose(), this.text2.dispose();
    }
  }
  var cl = ((l) => (l.normals = "normals", l.shearsY = "shearsY", l.shearsZ = "shearsZ", l.torsions = "torsions", l.bendingsY = "bendingsY", l.bendingsZ = "bendingsZ", l))(cl || {});
  function Dr(l, e, t, s) {
    const n = () => {
      const a = t.rawVal;
      if (!(a == null ? void 0 : a.length)) return 0.05 * e.gridSize.rawVal;
      const r = [
        1 / 0,
        1 / 0,
        1 / 0
      ], c = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const p of a) for (let f = 0; f < 3; f++) p[f] < r[f] && (r[f] = p[f]), p[f] > c[f] && (c[f] = p[f]);
      const d = Math.hypot(c[0] - r[0], c[1] - r[1], c[2] - r[2]);
      return !isFinite(d) || d <= 0 ? 0.05 * e.gridSize.rawVal : 0.025 * d;
    }, i = new ft(), o = {
      normals: _i,
      shearsY: _i,
      shearsZ: _i,
      torsions: _i,
      bendingsY: wo,
      bendingsZ: wo
    };
    return we.derive(() => {
      var _a2, _b;
      if (e.deformedShape.val, t.val, e.frameResults.val == "none") return;
      i.children.forEach((r) => r.dispose()), i.clear();
      const a = cl[e.frameResults.rawVal];
      (_b = (_a2 = l.analyzeOutputs) == null ? void 0 : _a2.rawVal[a]) == null ? void 0 : _b.forEach((r, c) => {
        var _a3, _b2, _c2, _d2, _e, _f;
        const d = ((_a3 = l.elements) == null ? void 0 : _a3.rawVal[c]) ?? [
          0,
          1
        ], p = t.rawVal[d[0]], f = t.rawVal[d[1]];
        if (!p || !f) return;
        const x = new te(...f).distanceTo(new te(...p)), b = Lr((_b2 = l.analyzeOutputs) == null ? void 0 : _b2.rawVal[a]), C = ((_f = (_e = (_d2 = (_c2 = l.elementInputs) == null ? void 0 : _c2.rawVal) == null ? void 0 : _d2.localAngles) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, c)) ?? 0, _ = ll(p, f, C), S = rl(a, _), A = new te(..._.e1), P = new te(...S), H = new Hi().makeBasis(A, P, A.clone().cross(P)), [U, G] = $o(a, r), W = o[a] === wo ? [
          U,
          -G
        ] : [
          U,
          G
        ], V = W.map((D) => D / (b === 0 ? 1 : b)), q = new o[a](p, f, x, H, W, V, false);
        q.updateScale(n() * s.rawVal), i.add(q);
      });
    }), we.derive(() => {
      if (s.val, e.frameResults.rawVal == "none") return;
      e.gridSize.val;
      const a = n();
      i.children.forEach((r) => r.updateScale(a * s.rawVal));
    }), we.derive(() => {
      i.visible = e.frameResults.val != "none";
    }), i;
  }
  function Lr(l) {
    let e = 0;
    return l == null ? void 0 : l.forEach((t) => {
      const s = Math.max(...(t ?? [
        0,
        0
      ]).map((n) => Math.abs(n)));
      s > e && (e = s);
    }), e;
  }
  class Nr extends ft {
    constructor(e, t, s) {
      super();
      const n = t === Ro.reactions;
      s[0] && (this.xText1 = new Bt(`${n ? "Fx" : "Dx"}: ` + s[0].toFixed(4))), s[3] && (this.xText2 = new Bt(`${n ? "Mx" : "Rx"}: ` + s[3].toFixed(4))), s[1] && (this.yText1 = new Bt(`${n ? "Fy" : "Dy"}: ` + s[1].toFixed(4))), s[4] && (this.yText2 = new Bt(`${n ? "My" : "Ry"}: ` + s[4].toFixed(4))), s[2] && (this.zText1 = new Bt(`${n ? "Fz" : "Dz"}: ` + s[2].toFixed(4))), s[5] && (this.zText2 = new Bt(`${n ? "Mz" : "Rz"}: ` + s[5].toFixed(4))), (s[0] || s[3]) && (this.xArrow = new an(new te(1, 0, 0), new te(0, 0, 0), 1, 15637248, 0.3, 0.3)), (s[1] || s[4]) && (this.yArrow = new an(new te(0, 1, 0), new te(0, 0, 0), 1, 15637248, 0.3, 0.3)), (s[2] || s[5]) && (this.zArrow = new an(new te(0, 0, 1), new te(0, 0, 0), 1, 15637248, 0.3, 0.3)), this.position.set(...e), this.xArrow && this.add(this.xArrow), this.yArrow && this.add(this.yArrow), this.zArrow && this.add(this.zArrow), this.xText1 && this.add(this.xText1), this.xText2 && this.add(this.xText2), this.yText1 && this.add(this.yText1), this.yText2 && this.add(this.yText2), this.zText1 && this.add(this.zText1), this.zText2 && this.add(this.zText2);
    }
    updateScale(e) {
      var _a2, _b, _c2, _d2, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2;
      (_a2 = this.xArrow) == null ? void 0 : _a2.scale.set(e, e, e), (_b = this.yArrow) == null ? void 0 : _b.scale.set(e, e, e), (_c2 = this.zArrow) == null ? void 0 : _c2.scale.set(e, e, e), (_d2 = this.xText1) == null ? void 0 : _d2.position.set(1.3 * e, 0, 0), (_e = this.xText2) == null ? void 0 : _e.position.set(1.3 * e, 0, 0.5 * e), (_f = this.yText1) == null ? void 0 : _f.position.set(0, 1.3 * e, 0), (_g = this.yText2) == null ? void 0 : _g.position.set(0, 1.3 * e, 0.5 * e), (_h = this.zText1) == null ? void 0 : _h.position.set(0, 0, 1.3 * e), (_i2 = this.zText2) == null ? void 0 : _i2.position.set(0, 0, 1.3 * e + 0.5 * e), (_j = this.xText1) == null ? void 0 : _j.updateScale(0.4 * e), (_k = this.xText2) == null ? void 0 : _k.updateScale(0.4 * e), (_l2 = this.yText1) == null ? void 0 : _l2.updateScale(0.4 * e), (_m = this.yText2) == null ? void 0 : _m.updateScale(0.4 * e), (_n2 = this.zText1) == null ? void 0 : _n2.updateScale(0.4 * e), (_o2 = this.zText2) == null ? void 0 : _o2.updateScale(0.4 * e);
    }
    dispose() {
      var _a2, _b, _c2, _d2, _e, _f, _g, _h, _i2;
      (_a2 = this.xArrow) == null ? void 0 : _a2.dispose(), (_b = this.yArrow) == null ? void 0 : _b.dispose(), (_c2 = this.zArrow) == null ? void 0 : _c2.dispose(), (_d2 = this.xText1) == null ? void 0 : _d2.dispose(), (_e = this.xText2) == null ? void 0 : _e.dispose(), (_f = this.yText1) == null ? void 0 : _f.dispose(), (_g = this.yText2) == null ? void 0 : _g.dispose(), (_h = this.zText1) == null ? void 0 : _h.dispose(), (_i2 = this.zText2) == null ? void 0 : _i2.dispose();
    }
  }
  var Ro = ((l) => (l.deformations = "deformations", l.reactions = "reactions", l))(Ro || {});
  function Or(l, e, t, s) {
    const n = new ft();
    return we.derive(() => {
      var _a2, _b;
      if (e.deformedShape.val, e.nodeResults.val == "none") return;
      n.children.forEach((a) => a.dispose()), n.clear();
      const i = Ro[e.nodeResults.rawVal], o = 0.05 * e.gridSize.val;
      (_b = (_a2 = l.deformOutputs) == null ? void 0 : _a2.val[i]) == null ? void 0 : _b.forEach((a, r) => {
        const c = new Nr(t.rawVal[r], i, a ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ]);
        c.updateScale(o * s.rawVal), n.add(c);
      });
    }), we.derive(() => {
      if (s.val, e.nodeResults.rawVal == "none") return;
      const i = 0.05 * e.gridSize.val;
      n.children.forEach((o) => o.updateScale(i * s.rawVal));
    }), we.derive(() => {
      n.visible = e.nodeResults.val != "none";
    }), n;
  }
  function Vr({ drawingObj: l, gridObj: e, scene: t, getActiveCamera: s, controls: n, gridSize: i, derivedDisplayScale: o, rendererElm: a, viewerRender: r }) {
    var _a2;
    const c = new po(), d = new nr(), p = (u) => {
      const g = a.getBoundingClientRect(), w = u.clientX - g.left, m = u.clientY - g.top, v = g.width || 1, E = g.height || 1;
      if (!!window.__hekatanSplitMode) {
        const M = v / 2;
        if (w >= M) return d.x = (w - M) / M * 2 - 1, d.y = -(m / E) * 2 + 1, window.__hekatanSplitCamera ?? s();
        d.x = w / M * 2 - 1;
      } else d.x = w / v * 2 - 1;
      return d.y = -(m / E) * 2 + 1, s();
    }, f = new pt(new Ns(1e4, 1e4), new gt({
      side: Pt,
      transparent: true,
      opacity: 0,
      depthWrite: false
    }));
    f.visible = true, f.frustumCulled = false, t.add(f);
    const x = (u, g, w) => {
      const m = new pt(new Ns(1e4, 1e4), new gt({
        side: Pt,
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      return m.rotation.set(u, g, w), m.visible = false, m.frustumCulled = false, t.add(m), m;
    }, b = x(Math.PI / 2, 0, 0), C = x(0, Math.PI / 2, 0);
    let _ = false, S = null, A = null, P = null;
    const H = new Vt(new Fe(), new mt({
      color: 3718648,
      depthTest: false,
      transparent: true,
      opacity: 0.95
    }));
    H.name = "ref-ifc-cadena", H.renderOrder = 1e3, H.frustumCulled = false, H.visible = false, t.add(H);
    const U = (u, g, w) => Math.round(u * 1e3) + "," + Math.round(g * 1e3) + "," + Math.round(w * 1e3), G = (u) => {
      const g = /* @__PURE__ */ new Map();
      for (let w = 0; w + 0 < u.length / 6; w++) {
        const m = 6 * w;
        for (const v of [
          U(u[m], u[m + 1], u[m + 2]),
          U(u[m + 3], u[m + 4], u[m + 5])
        ]) {
          const E = g.get(v);
          E ? E.push(w) : g.set(v, [
            w
          ]);
        }
      }
      return g;
    }, W = (u) => {
      const { S: g, adj: w } = u, m = (B, Y) => new te(g[6 * B + 3 * Y], g[6 * B + 3 * Y + 1], g[6 * B + 3 * Y + 2]), v = /* @__PURE__ */ new Set([
        u.s
      ]), E = (B, Y) => {
        const ee = [];
        let K = B, J = Y;
        for (let se = 0; se < 3e3; se++) {
          const oe = (w.get(U(J.x, J.y, J.z)) || []).filter((We) => !v.has(We));
          if (oe.length !== 1) break;
          const ne = oe[0], de = m(ne, 0), me = m(ne, 1), ke = de.distanceTo(J) < me.distanceTo(J) ? me : de, Te = J.clone().sub(K).normalize(), it = ke.clone().sub(J).normalize();
          if (Te.dot(it) < Math.cos(35 * Math.PI / 180)) break;
          v.add(ne), ee.push(ke), K = J, J = ke;
        }
        return ee;
      }, k = m(u.s, 0), M = m(u.s, 1), $ = E(k, M), I = E(M, k), T = [
        ...I.reverse(),
        k,
        M,
        ...$
      ], N = I.length;
      if (T.length < 6) return T;
      const F = [], L = [];
      for (let B = 1; B < T.length; B++) F.push(T[B].distanceTo(T[B - 1]));
      for (let B = 1; B < T.length - 1; B++) {
        const Y = T[B].clone().sub(T[B - 1]).normalize(), ee = T[B + 1].clone().sub(T[B]).normalize();
        L.push(Math.acos(Math.max(-1, Math.min(1, Y.dot(ee)))) / Math.max(1e-6, (F[B - 1] + F[B]) / 2));
      }
      const j = L.map((B, Y) => {
        let ee = 0, K = 0;
        for (let J = Y - 1; J <= Y + 1; J++) J >= 0 && J < L.length && (ee += L[J], K++);
        return ee / K;
      }), Z = [];
      for (let B = 3; B < j.length - 3; B++) {
        const Y = (j[B - 3] + j[B - 2] + j[B - 1]) / 3, ee = (j[B + 1] + j[B + 2] + j[B + 3]) / 3, K = Math.min(Y, ee), J = Math.max(Y, ee);
        J > 0.03 && J / Math.max(K, 1e-6) > 2.2 && Math.abs(j[B] - (Y + ee) / 2) < J && (!Z.length || B - Z[Z.length - 1] > 3) && Z.push(B + 1);
      }
      let O = 0, z = T.length - 1;
      for (const B of Z) B <= N && B > O && (O = B), B > N && B < z && (z = B);
      return T.slice(O, z + 1);
    }, V = (u) => {
      if (P = u, !u || u.length < 2) {
        H.visible = false;
        return;
      }
      H.geometry.dispose(), H.geometry = new Fe().setFromPoints(u), H.visible = true;
    }, q = (u) => {
      let g = 0;
      for (let N = 1; N < u.length - 1; N++) {
        const F = u[N].clone().sub(u[N - 1]).normalize(), L = u[N + 1].clone().sub(u[N]).normalize();
        g += Math.acos(Math.max(-1, Math.min(1, F.dot(L))));
      }
      const w = Math.max(2, Math.round(window.__hekatanArcSegs ?? 12));
      if (g < 3 * Math.PI / 180) return [
        u[0].toArray(),
        u[u.length - 1].toArray()
      ];
      const m = String(window.__hekatanArcModo ?? "angulo"), v = m === "x" ? 0 : m === "y" ? 1 : m === "z" ? 2 : -1, E = [
        0
      ];
      for (let N = 1; N < u.length; N++) E.push(E[N - 1] + u[N].distanceTo(u[N - 1]));
      const k = (N, F) => {
        for (let L = 1; L < u.length; L++) {
          const j = N(u[L - 1], L - 1), Z = N(u[L], L);
          if (j <= F && F <= Z || Z <= F && F <= j) {
            const O = Math.abs(Z - j) < 1e-12 ? 0 : (F - j) / (Z - j);
            return u[L - 1].clone().lerp(u[L], O);
          }
        }
        return u[u.length - 1].clone();
      }, M = [], $ = v >= 0 ? u[0].getComponent(v) : 0, I = v >= 0 ? u[u.length - 1].getComponent(v) : 0, T = v >= 0 && Math.abs(I - $) > 1e-6 && u.every((N, F) => F === 0 || (N.getComponent(v) - u[F - 1].getComponent(v)) * (I - $) >= -1e-6);
      for (let N = 0; N <= w; N++) {
        const F = T ? k((L) => L.getComponent(v), $ + (I - $) * N / w) : k((L, j) => E[j], E[E.length - 1] * N / w);
        M.push([
          F.x,
          F.y,
          F.z
        ]);
      }
      return M[0] = u[0].toArray(), M[w] = u[u.length - 1].toArray(), M;
    };
    window.__hekatanCadenaIfc = () => (P || []).map((u) => [
      u.x,
      u.y,
      u.z
    ]);
    const D = /* @__PURE__ */ new Map(), R = (u) => {
      const g = D.get(u.id);
      if (g) return g;
      const w = u.geometry.getAttribute("position"), m = w ? Math.floor(w.count / 3) : 0, v = new Float64Array(m * 9), E = new Float64Array(m * 3), k = new Int32Array(m * 3).fill(-1);
      if (w) {
        u.updateMatrixWorld();
        const $ = new te();
        for (let j = 0; j < m * 3; j++) $.fromBufferAttribute(w, j).applyMatrix4(u.matrixWorld), v[3 * j] = $.x, v[3 * j + 1] = $.y, v[3 * j + 2] = $.z;
        const I = new te(), T = new te(), N = new te(), F = (j) => Math.round(v[3 * j] * 1e3) + "," + Math.round(v[3 * j + 1] * 1e3) + "," + Math.round(v[3 * j + 2] * 1e3), L = /* @__PURE__ */ new Map();
        for (let j = 0; j < m; j++) {
          const Z = 3 * j;
          I.set(v[3 * (Z + 1)] - v[3 * Z], v[3 * (Z + 1) + 1] - v[3 * Z + 1], v[3 * (Z + 1) + 2] - v[3 * Z + 2]), T.set(v[3 * (Z + 2)] - v[3 * Z], v[3 * (Z + 2) + 1] - v[3 * Z + 1], v[3 * (Z + 2) + 2] - v[3 * Z + 2]), N.crossVectors(I, T).normalize(), E[3 * j] = N.x, E[3 * j + 1] = N.y, E[3 * j + 2] = N.z;
          for (let O = 0; O < 3; O++) {
            const z = F(Z + O), B = F(Z + (O + 1) % 3), Y = z < B ? z + "|" + B : B + "|" + z, ee = L.get(Y);
            ee ? ee.push(j, O) : L.set(Y, [
              j,
              O
            ]);
          }
        }
        for (const j of L.values()) j.length === 4 && (k[3 * j[0] + j[1]] = j[2], k[3 * j[2] + j[3]] = j[0]);
      }
      const M = {
        V: v,
        N: E,
        vec: k,
        n: m
      };
      return D.set(u.id, M), M;
    }, X = new pt(new Fe(), new gt({
      color: 3718648,
      transparent: true,
      opacity: 0.35,
      depthTest: false,
      side: Pt
    }));
    X.name = "ref-ifc-cara", X.renderOrder = 999, X.frustumCulled = false, X.visible = false, t.add(X);
    let Q = null;
    const re = (u, g) => {
      const w = Math.cos(12 * Math.PI / 180), m = Math.cos(80 * Math.PI / 180), v = [
        u.N[3 * g],
        u.N[3 * g + 1],
        u.N[3 * g + 2]
      ], E = new Uint8Array(u.n), k = [], M = [
        g
      ];
      for (E[g] = 1; M.length && k.length < 4e4; ) {
        const $ = M.pop();
        k.push($);
        for (let I = 0; I < 3; I++) {
          const T = u.vec[3 * $ + I];
          if (T < 0 || E[T]) continue;
          const N = u.N[3 * $] * u.N[3 * T] + u.N[3 * $ + 1] * u.N[3 * T + 1] + u.N[3 * $ + 2] * u.N[3 * T + 2], F = v[0] * u.N[3 * T] + v[1] * u.N[3 * T + 1] + v[2] * u.N[3 * T + 2];
          N >= w && F >= m && (E[T] = 1, M.push(T));
        }
      }
      return k;
    }, ue = (u, g, w) => {
      if (!u || g < 0 || !w) {
        Q && (Q = null, X.visible = false);
        return;
      }
      if (Q && Q.m === u && Q.tris.indexOf(g) >= 0) {
        Q.punto = w.clone();
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
      X.geometry.dispose(), X.geometry = new Fe(), X.geometry.setAttribute("position", new bt(E, 3)), X.material.color.set(M ? 3718648 : 16096779), X.visible = true, Q = {
        m: u,
        t0: g,
        tris: v,
        normal: k,
        plana: M,
        punto: w.clone()
      };
    }, be = (u, g) => {
      const w = new Uint8Array(u.n);
      for (const T of g) w[T] = 1;
      const m = (T) => Math.round(u.V[3 * T] * 1e3) + "," + Math.round(u.V[3 * T + 1] * 1e3) + "," + Math.round(u.V[3 * T + 2] * 1e3), v = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
      for (const T of g) for (let N = 0; N < 3; N++) {
        const F = u.vec[3 * T + N];
        if (F >= 0 && w[F]) continue;
        const L = 3 * T + N, j = 3 * T + (N + 1) % 3, Z = m(L), O = m(j);
        E.set(Z, new te(u.V[3 * L], u.V[3 * L + 1], u.V[3 * L + 2])), E.set(O, new te(u.V[3 * j], u.V[3 * j + 1], u.V[3 * j + 2])), (v.get(Z) || v.set(Z, []).get(Z)).push(O), (v.get(O) || v.set(O, []).get(O)).push(Z);
      }
      const k = /* @__PURE__ */ new Set();
      let M = [];
      for (const T of v.keys()) {
        if (k.has(T)) continue;
        const N = [
          T
        ];
        k.add(T);
        let F = "", L = T;
        for (let j = 0; j < 1e5; j++) {
          const Z = (v.get(L) || []).find((O) => O !== F && !k.has(O));
          if (!Z) break;
          N.push(Z), k.add(Z), F = L, L = Z;
        }
        N.length > M.length && (M = N);
      }
      const $ = M.map((T) => E.get(T)), I = [];
      for (let T = 0; T < $.length; T++) {
        const N = $[(T + $.length - 1) % $.length], F = $[T], L = $[(T + 1) % $.length];
        if (F.distanceTo(N) < 1e-3) continue;
        const j = F.clone().sub(N).normalize(), Z = L.clone().sub(F).normalize();
        j.dot(Z) > Math.cos(3 * Math.PI / 180) || I.push(F);
      }
      return I;
    }, ae = (u, g, w) => {
      const v = new po(g.clone().addScaledVector(w, -2e-3), w.clone().negate(), 0, 3).intersectObject(u, false);
      return v.length ? v[0].distance + 2e-3 : null;
    };
    window.__hekatanRaycast = (u, g, w, m = 2) => {
      const v = new te(u[0], u[1], u[2]), E = new te(g[0], g[1], g[2]).normalize();
      let k = null;
      for (const M of [
        1,
        -1
      ]) {
        const I = new po(v, E.clone().multiplyScalar(M), 0, m).intersectObjects(w, false);
        I.length && (k == null || I[0].distance < k) && (k = I[0].distance);
      }
      return k;
    }, window.__hekatanCaraIfc = () => Q ? {
      tris: Q.tris.length,
      plana: Q.plana,
      normal: Q.normal.toArray(),
      punto: Q.punto.toArray(),
      contorno: be(R(Q.m), Q.tris).map((u) => [
        u.x,
        u.y,
        u.z
      ])
    } : null;
    const ie = /* @__PURE__ */ new Map(), le = new is(new Fe(), new mt({
      color: 16498468,
      transparent: true,
      opacity: 0.35,
      depthTest: true
    }));
    le.name = "ref-ifc-bordes", le.frustumCulled = false, le.visible = false, t.add(le);
    const he = 1, pe = (u, g, w) => Math.floor(u / he) + "," + Math.floor(g / he) + "," + Math.floor(w / he), Se = (u) => {
      const g = ie.get(u.id);
      if (g) return g;
      const w = u.geometry.getAttribute("position"), m = [], v = /* @__PURE__ */ new Map();
      if (w) {
        u.updateMatrixWorld();
        const k = Math.floor(w.count / 3), M = new Float64Array(w.count * 3), $ = new te();
        for (let O = 0; O < w.count; O++) $.fromBufferAttribute(w, O).applyMatrix4(u.matrixWorld), M[3 * O] = $.x, M[3 * O + 1] = $.y, M[3 * O + 2] = $.z;
        const I = (O) => Math.round(M[3 * O] * 1e3) + "," + Math.round(M[3 * O + 1] * 1e3) + "," + Math.round(M[3 * O + 2] * 1e3), T = new Float64Array(k * 3), N = new te(), F = new te(), L = new te();
        for (let O = 0; O < k; O++) {
          const z = 3 * O, B = 3 * O + 1, Y = 3 * O + 2;
          N.set(M[3 * B] - M[3 * z], M[3 * B + 1] - M[3 * z + 1], M[3 * B + 2] - M[3 * z + 2]), F.set(M[3 * Y] - M[3 * z], M[3 * Y + 1] - M[3 * z + 1], M[3 * Y + 2] - M[3 * z + 2]), L.crossVectors(N, F).normalize(), T[3 * O] = L.x, T[3 * O + 1] = L.y, T[3 * O + 2] = L.z;
        }
        const j = /* @__PURE__ */ new Map();
        for (let O = 0; O < k; O++) for (let z = 0; z < 3; z++) {
          const B = 3 * O + z, Y = 3 * O + (z + 1) % 3, ee = I(B), K = I(Y), J = ee < K ? ee + "|" + K : K + "|" + ee, se = j.get(J);
          se ? se.push(O) : j.set(J, [
            O,
            B,
            Y
          ]);
        }
        const Z = Math.cos(25 * Math.PI / 180);
        for (const O of j.values()) {
          const z = O[0], B = O[1], Y = O[2];
          let ee = O.length === 3;
          if (!ee && O.length === 4) {
            const J = O[3], se = T[3 * z] * T[3 * J] + T[3 * z + 1] * T[3 * J + 1] + T[3 * z + 2] * T[3 * J + 2];
            ee = Math.abs(se) < Z;
          }
          if (!ee) continue;
          const K = m.length / 6;
          m.push(M[3 * B], M[3 * B + 1], M[3 * B + 2], M[3 * Y], M[3 * Y + 1], M[3 * Y + 2]);
          for (const [J, se, oe] of [
            [
              M[3 * B],
              M[3 * B + 1],
              M[3 * B + 2]
            ],
            [
              M[3 * Y],
              M[3 * Y + 1],
              M[3 * Y + 2]
            ],
            [
              (M[3 * B] + M[3 * Y]) / 2,
              (M[3 * B + 1] + M[3 * Y + 1]) / 2,
              (M[3 * B + 2] + M[3 * Y + 2]) / 2
            ]
          ]) {
            const ne = pe(J, se, oe), de = v.get(ne);
            de ? de[de.length - 1] !== K && de.push(K) : v.set(ne, [
              K
            ]);
          }
        }
      }
      const E = {
        segs: new Float32Array(m),
        celdas: v
      };
      return ie.set(u.id, E), E;
    };
    let ve = "";
    const Ae = (u) => {
      const g = u.map((k) => k.id).join(",");
      if (g === ve) return;
      ve = g;
      const w = u.map((k) => Se(k).segs);
      let m = 0;
      for (const k of w) m += k.length;
      const v = new Float32Array(m);
      let E = 0;
      for (const k of w) v.set(k, E), E += k.length;
      le.geometry.dispose(), le.geometry = new Fe(), le.geometry.setAttribute("position", new bt(v, 3)), le.visible = m > 0 && window.__hekatanRefIfcBordes !== false;
    };
    window.__hekatanRefIfcBordesRefrescar = () => {
      le.visible = ve !== "" && window.__hekatanRefIfcBordes !== false, r();
    }, window.__hekatanBordesIfc = () => {
      let u = 0;
      for (const g of ie.values()) u += g.segs.length / 6;
      return u;
    };
    const Ve = (u, g) => {
      const w = window.__hekatanCursorPx;
      if (!w) return null;
      const m = Se(u), v = m.segs, E = Math.floor(g.x / he), k = Math.floor(g.y / he), M = Math.floor(g.z / he), $ = /* @__PURE__ */ new Set();
      let I = Rs, T = null, N = Rs, F = null, L = -1;
      const j = new te(), Z = new te();
      for (let O = -1; O <= 1; O++) for (let z = -1; z <= 1; z++) for (let B = -1; B <= 1; B++) {
        const Y = m.celdas.get(E + O + "," + (k + z) + "," + (M + B));
        if (Y) for (const ee of Y) {
          if ($.has(ee)) continue;
          $.add(ee);
          const K = 6 * ee;
          j.set(v[K], v[K + 1], v[K + 2]), Z.set(v[K + 3], v[K + 4], v[K + 5]);
          const J = Ks(j.x, j.y, j.z), se = Ks(Z.x, Z.y, Z.z);
          if (!J || !se) continue;
          const oe = Math.hypot(J.x - w.x, J.y - w.y), ne = Math.hypot(se.x - w.x, se.y - w.y);
          oe < I && (I = oe, T = j.clone()), ne < I && (I = ne, T = Z.clone());
          const de = se.x - J.x, me = se.y - J.y, ke = de * de + me * me || 1e-9;
          let Te = ((w.x - J.x) * de + (w.y - J.y) * me) / ke;
          Te = Math.max(0, Math.min(1, Te));
          const it = Math.hypot(w.x - (J.x + Te * de), w.y - (J.y + Te * me));
          it < N && (N = it, F = j.clone().lerp(Z, Te), L = ee);
        }
      }
      return L >= 0 && (m.adj || (m.adj = G(m.segs)), A = {
        S: m.segs,
        adj: m.adj,
        s: L
      }), T ? {
        tipo: "ifcVert",
        punto: T
      } : F ? {
        tipo: "ifcEdge",
        punto: F
      } : null;
    }, ot = () => {
      var _a3, _b, _c2;
      if (window.__hekatanRefIfcSnap === false) return null;
      const u = [];
      if (t.traverse((E) => {
        var _a4;
        ((_a4 = E.userData) == null ? void 0 : _a4.refIfc) && E.isMesh && u.push(E);
      }), !u.length) return le.visible = false, ve = "", null;
      Ae(u);
      const g = c.intersectObjects(u, false).filter((E) => {
        const k = E.object.material;
        return (k && k.clippingPlanes || []).every(($) => $.distanceToPoint(E.point) >= 0);
      });
      if (!g.length) return null;
      const w = g[0], m = g[1];
      ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) === "ifcface" ? ue(w.object, w.faceIndex ?? -1, w.point) : Q && ue(null, -1, null);
      const v = Ve(w.object, w.point);
      if (v) return S = {
        tipo: v.tipo
      }, [
        {
          ...w,
          point: v.punto
        }
      ];
      if (m && m.object === w.object && m.distance - w.distance <= 1.2) {
        const E = w.point.clone().add(m.point).multiplyScalar(0.5);
        return S = {
          tipo: "ifcAxis"
        }, [
          {
            ...w,
            point: E
          }
        ];
      }
      return S = {
        tipo: "ifc"
      }, [
        w
      ];
    };
    let yt = "", Ce = new Float32Array(0);
    const ce = new is(new Fe(), new mt({
      color: 16096779,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }));
    ce.name = "ref-ifc-seccion", ce.renderOrder = 998, ce.frustumCulled = false, ce.visible = false, t.add(ce);
    const _e = () => {
      const u = window.__hekatanClip;
      if (!u || window.__hekatanRefIfcSnap === false) return ce.visible = false, Ce = new Float32Array(0);
      const g = [];
      u.enableX && g.push([
        0,
        +u.posX
      ]), u.enableY && g.push([
        1,
        +u.posY
      ]), u.enableZ && g.push([
        2,
        +u.posZ
      ]);
      const w = [];
      t.traverse((E) => {
        var _a3;
        ((_a3 = E.userData) == null ? void 0 : _a3.refIfc) && E.isMesh && w.push(E);
      });
      const m = JSON.stringify(g) + "|" + w.map((E) => E.id).join(",");
      if (m === yt) return Ce;
      yt = m;
      const v = [];
      if (g.length && w.length) {
        const E = [
          new te(),
          new te(),
          new te()
        ];
        for (const k of w) {
          const M = k.geometry.getAttribute("position");
          if (M) {
            k.updateMatrixWorld();
            for (let $ = 0; $ + 2 < M.count; $ += 3) {
              for (let I = 0; I < 3; I++) E[I].fromBufferAttribute(M, $ + I).applyMatrix4(k.matrixWorld);
              for (const [I, T] of g) {
                const N = [
                  E[0].getComponent(I) - T,
                  E[1].getComponent(I) - T,
                  E[2].getComponent(I) - T
                ], F = [];
                for (let L = 0; L < 3; L++) {
                  const j = E[L], Z = E[(L + 1) % 3], O = N[L], z = N[(L + 1) % 3];
                  (O < 0 && z >= 0 || O >= 0 && z < 0) && F.push(j.clone().lerp(Z, O / (O - z)));
                }
                F.length === 2 && v.push(F[0].x, F[0].y, F[0].z, F[1].x, F[1].y, F[1].z);
              }
            }
          }
        }
      }
      return Ce = new Float32Array(v), ce.geometry.dispose(), ce.geometry = new Fe(), ce.geometry.setAttribute("position", new bt(Ce, 3)), ce.visible = Ce.length > 0, Ce;
    };
    let ge = null, xe = null;
    const Ne = (u, g) => {
      const w = _e();
      if (!w.length) return null;
      let m = Rs * 2, v = null, E = -1;
      const k = new te(), M = new te();
      for (let $ = 0; $ + 5 < w.length; $ += 6) {
        k.set(w[$], w[$ + 1], w[$ + 2]), M.set(w[$ + 3], w[$ + 4], w[$ + 5]);
        const I = Ks(k.x, k.y, k.z), T = Ks(M.x, M.y, M.z);
        if (!I || !T) continue;
        const N = T.x - I.x, F = T.y - I.y, L = N * N + F * F || 1e-9;
        let j = ((u - I.x) * N + (g - I.y) * F) / L;
        j = Math.max(0, Math.min(1, j));
        const Z = Math.hypot(u - (I.x + j * N), g - (I.y + j * F));
        Z < m && (m = Z, v = k.clone().lerp(M, j), E = $ / 6);
      }
      return E >= 0 && (xe !== w && (ge = G(w), xe = w), A = {
        S: w,
        adj: ge,
        s: E
      }), v;
    };
    let ze = null;
    window.__hekatanSeccionIfc = () => _e().length / 6, window.__hekatanSeccionIfcPuntos = (u = 200) => {
      const g = _e(), w = [], m = Math.max(1, Math.floor(g.length / 6 / u));
      for (let v = 0; v + 2 < g.length; v += 6 * m) w.push([
        g[v],
        g[v + 1],
        g[v + 2]
      ]);
      return w;
    };
    const Me = () => {
      S = null;
      const u = ot();
      if (u) return u;
      if (_) return c.intersectObjects([
        f
      ], false);
      if (b.visible = !!window.__hekatanGridPlaneXZ, C.visible = !!window.__hekatanGridPlaneYZ, window.__hekatanOrthoRaycast === true && cs.visible) {
        const m = c.intersectObjects([
          cs,
          gs,
          ys
        ], false);
        if (m.length > 0) return m;
      }
      const w = [
        f
      ];
      return b.visible && w.push(b), C.visible && w.push(C), zs.visible && pn.length > 0 && w.push(...pn), c.intersectObjects(w, false);
    }, Ie = new Ai(new Fe(), new Ti()), Oe = new Ai(new Fe(), new Ti({
      color: "gray",
      sizeAttenuation: false,
      size: 6
    })), Ye = new Ai(new Fe(), new Ti({
      color: "orange",
      sizeAttenuation: false,
      size: 5
    }));
    t.add(Ye);
    const $e = document.createElement("input");
    $e.id = "hk-rubber-label", $e.type = "text", $e.spellcheck = false, $e.title = `Sintaxis estilo AutoCAD:
  5         \u2192 5m en direcci\xF3n del cursor (DDE)
  5,3,2     \u2192 coordenada absoluta (X,Y,Z)
  @5,3,2    \u2192 relativa al \xFAltimo punto
  5<45      \u2192 polar 2D: 5m a 45\xB0 desde origen
  @5<45     \u2192 polar relativa: 5m a 45\xB0 del \xFAltimo punto
  @5<45<30  \u2192 esf\xE9rica 3D: 5m, azimuth 45\xB0, elevaci\xF3n 30\xB0`, $e.style.cssText = [
      "position:fixed",
      "z-index:99996",
      "padding:3px 8px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1.5px solid #22d3ee",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:13px",
      "font-weight:bold",
      "transform:translate(-50%,-50%)",
      "white-space:nowrap",
      "outline:none",
      "width:80px",
      "text-align:center",
      "display:none",
      "pointer-events:none"
    ].join(";") + ";", document.body.appendChild($e);
    const Qe = document.createElement("div");
    Qe.id = "hk-rubber-angle", Qe.style.cssText = [
      "position:fixed",
      "z-index:99996",
      "pointer-events:none",
      "padding:2px 6px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1px solid #22d3ee",
      "border-radius:3px",
      "font-family:Consolas,monospace",
      "font-size:12px",
      "transform:translate(-50%,0)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", document.body.appendChild(Qe);
    let je = null, Ke = null, Ee = false;
    const Be = new te(), Rt = (u, g, w, m, v, E) => {
      const k = m - u, M = v - g, $ = E - w, I = Math.hypot(k, M, $);
      if (I < 0.01) {
        $e.style.display = "none";
        return;
      }
      je = [
        u,
        g,
        w
      ], Ke = [
        k / I,
        M / I,
        $ / I
      ], Be.set((u + m) / 2, (g + v) / 2, (w + E) / 2), Be.project(s());
      const T = a.getBoundingClientRect(), N = T.left + (Be.x * 0.5 + 0.5) * T.width, F = T.top + (-Be.y * 0.5 + 0.5) * T.height;
      $e.style.left = N + "px", $e.style.top = F + "px", $e.style.display = "block";
      const L = new te(u, g, w).project(s()), j = new te(m, v, E).project(s()), Z = T.left + (L.x * 0.5 + 0.5) * T.width, O = T.top + (-L.y * 0.5 + 0.5) * T.height, z = T.left + (j.x * 0.5 + 0.5) * T.width, B = T.top + (-j.y * 0.5 + 0.5) * T.height;
      let Y = Math.atan2(-(B - O), z - Z) * 180 / Math.PI;
      if (Y < 0 && (Y += 360), Qe.textContent = `${Math.round(Y) % 360}\xB0`, Qe.style.left = z + "px", Qe.style.top = B + 34 + "px", Qe.style.display = "block", !Ee) {
        if ($e.value = `${I.toFixed(2)} m`, document.activeElement !== $e) {
          const ee = document.activeElement;
          ee && (ee.tagName === "INPUT" || ee.tagName === "TEXTAREA") && ee !== $e || $e.focus({
            preventScroll: true
          });
        }
        try {
          $e.select();
        } catch {
        }
      }
    }, at = () => {
      $e.style.display = "none", Qe.style.display = "none", je = null, Ke = null, Ee = false, document.activeElement === $e && $e.blur();
    }, At = (u) => {
      var _a3, _b, _c2, _d2, _e2, _f, _g, _h;
      const g = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select";
      if (g === "offset") {
        Gs = u, ye(`\u21C9 DESFASE distancia ${u} m \u2014 designe la l\xEDnea y luego el lado.`), $e.blur();
        try {
          (_d2 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _d2.call(window);
        } catch {
        }
        return;
      }
      if (g === "circle" && qe.length === 1) {
        const T = qe[0];
        qe = [], (_e2 = window.__hekatanDrawCircle) == null ? void 0 : _e2.call(window, T[0], T[1], T[2], u), ye(`\u2713 C\xEDrculo r=${u} m en (${T[0].toFixed(2)}, ${T[1].toFixed(2)}, ${T[2].toFixed(2)}).`);
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
        It = u, ye(`\u{1F4D0} Altura ${u}m memorizada \u2014 hac\xE9 el click para crear ${{
          col: "columna",
          wall: "pared",
          extp: "extrusi\xF3n punto\u2192l\xEDnea",
          extl: "extrusi\xF3n l\xEDnea\u2192\xE1rea"
        }[g]}.`), $e.blur();
        return;
      }
      if (!je || !Ke || !l.polylines) return;
      let w = Ke[0], m = Ke[1], v = Ke[2];
      zt === "x" ? (w = Math.sign(w) || 1, m = 0, v = 0) : zt === "y" ? (w = 0, m = Math.sign(m) || 1, v = 0) : zt === "z" && (w = 0, m = 0, v = Math.sign(v) || 1);
      const E = je[0] + w * u, k = je[1] + m * u, M = je[2] + v * u;
      window.__hekatanPushUndo && window.__hekatanPushUndo(), l.points.val = [
        ...l.points.rawVal,
        [
          E,
          k,
          M
        ]
      ];
      const $ = l.polylines.rawVal, I = $.length ? $[$.length - 1] : [];
      l.polylines.val = [
        ...$.slice(0, -1),
        [
          ...I,
          l.points.rawVal.length - 1
        ]
      ], $e.blur();
      try {
        (_h = window.__hekatanRebuild) == null ? void 0 : _h.call(window);
      } catch {
      }
      r();
    }, qt = (u) => {
      let g = u.trim().toLowerCase().replace(/m$/g, "").trim();
      if (!g) return null;
      const w = g.startsWith("@");
      if (w && (g = g.slice(1)), g.includes("<")) {
        const v = g.split("<").map((E) => parseFloat(E.trim()));
        if (v.some(isNaN)) return null;
        if (v.length === 2) {
          const [E, k] = v;
          return w ? {
            kind: "relPolar",
            L: E,
            ang: k
          } : {
            kind: "absPolar",
            L: E,
            ang: k
          };
        }
        if (v.length === 3 && w) {
          const [E, k, M] = v;
          return {
            kind: "relSpherical",
            L: E,
            az: k,
            el: M
          };
        }
        return null;
      }
      if (g.includes(",")) {
        const v = g.split(",").map(($) => parseFloat($.trim()));
        if (v.some(isNaN)) return null;
        const [E, k, M = 0] = v;
        return w ? {
          kind: "relCart",
          dx: E,
          dy: k,
          dz: M
        } : {
          kind: "absCart",
          x: E,
          y: k,
          z: M
        };
      }
      const m = parseFloat(g);
      return isNaN(m) || m <= 0 ? null : {
        kind: "length",
        L: m
      };
    }, lt = (u) => {
      if (!u) return null;
      if (u.kind === "absCart") return [
        u.x,
        u.y,
        u.z
      ];
      if (u.kind === "relCart") return je ? [
        je[0] + u.dx,
        je[1] + u.dy,
        je[2] + u.dz
      ] : null;
      if (u.kind === "absPolar") {
        const g = u.ang * Math.PI / 180;
        return [
          u.L * Math.cos(g),
          u.L * Math.sin(g),
          0
        ];
      }
      if (u.kind === "relPolar") {
        if (!je) return null;
        const g = u.ang * Math.PI / 180;
        return [
          je[0] + u.L * Math.cos(g),
          je[1] + u.L * Math.sin(g),
          je[2]
        ];
      }
      if (u.kind === "relSpherical") {
        if (!je) return null;
        const g = u.az * Math.PI / 180, w = u.el * Math.PI / 180, m = u.L * Math.cos(w);
        return [
          je[0] + m * Math.cos(g),
          je[1] + m * Math.sin(g),
          je[2] + u.L * Math.sin(w)
        ];
      }
      return null;
    }, et = (u) => {
      var _a3, _b;
      if (!l.polylines) return;
      window.__hekatanPushUndo && window.__hekatanPushUndo(), l.points.val = [
        ...l.points.rawVal,
        u
      ];
      const g = l.polylines.rawVal, w = g.length ? g[g.length - 1] : [];
      l.polylines.val = [
        ...g.slice(0, -1),
        [
          ...w,
          l.points.rawVal.length - 1
        ]
      ], je = u, $e.blur();
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      r();
      try {
        (_b = window.__hekatanCadRefreshPrompt) == null ? void 0 : _b.call(window);
      } catch {
      }
    };
    window.__hekatanTypeCoord = (u) => {
      var _a3;
      const g = qt(u);
      if (!g) return false;
      if (g.kind === "length") return At(g.L), true;
      const w = lt(g);
      if (!w) return false;
      pa(new te(w[0], w[1], w[2]), null), je = w, $e.blur();
      try {
        (_a3 = window.__hekatanCadRefreshPrompt) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return true;
    }, $e.addEventListener("keydown", (u) => {
      var _a3, _b, _c2;
      if (u.key === "Enter") {
        if (u.preventDefault(), !Ee) {
          (_a3 = window.__hekatanFinalizeDraw) == null ? void 0 : _a3.call(window);
          try {
            (_c2 = (_b = window.__hekatanCadState) == null ? void 0 : _b.setTool) == null ? void 0 : _c2.call(_b, "select");
          } catch {
          }
          return;
        }
        const w = qt($e.value);
        if (!w) return;
        if (Ee = false, w.kind === "length") At(w.L), ye(`\u270F DDE ${w.L}m aplicado en direcci\xF3n actual`);
        else {
          const m = lt(w);
          if (!m) return;
          et(m);
          const v = w.kind;
          ye(`\u270F ${v} \u2192 (${m[0].toFixed(2)}, ${m[1].toFixed(2)}, ${m[2].toFixed(2)})`);
        }
        return;
      }
      if (u.key === "Escape") {
        u.preventDefault(), Ee = false, $e.blur();
        return;
      }
      const g = u.key.toLowerCase();
      if (g === "x" || g === "y" || g === "z") {
        u.preventDefault(), setTimeout(() => {
          if (!Ee && $e.style.display === "block") try {
            $e.select();
          } catch {
          }
        }, 0);
        return;
      }
      (/^[0-9.\-]$/.test(u.key) || u.key === "Backspace" || u.key === "Delete") && (Ee = true);
    }), window.addEventListener("keydown", (u) => {
      if (!je || !Ke || document.activeElement === $e) return;
      const g = document.activeElement;
      g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA") || /^[0-9.\-]$/.test(u.key) && ($e.value = u.key, $e.focus(), $e.setSelectionRange(1, 1), u.preventDefault());
    });
    const Pe = document.createElement("div");
    Pe.id = "hk-coord-readout", Pe.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99997",
      "padding:4px 8px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1px solid #22d3ee",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:11px",
      "transform:translate(12px,-22px)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", Pe.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(Pe);
    const st = document.createElement("div");
    st.id = "hk-coord-fixed", st.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99998",
      "right:80px",
      "top:10px",
      "padding:6px 14px",
      "background:rgba(15,23,42,0.92)",
      "color:#22d3ee",
      "border:1px solid rgba(34,211,238,0.55)",
      "border-radius:5px",
      "font-family:Consolas,monospace",
      "font-size:13px",
      "font-weight:500",
      "white-space:nowrap",
      "letter-spacing:0.3px",
      "box-shadow:0 2px 8px rgba(0,0,0,0.4)",
      "backdrop-filter:blur(4px)"
    ].join(";") + ";", st.textContent = "X=0.00  Y=0.00  Z=0.00", document.body.appendChild(st);
    const De = new Vt(new Fe().setFromPoints([
      new te(0, 0, 0),
      new te(0, 0, 0)
    ]), new Pn({
      color: 2282478,
      dashSize: 0.2,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    }));
    De.frustumCulled = false, De.visible = false, De.name = "rubberBand", t.add(De), window.__hekatanRubberBand = De;
    const ht = new Vt(new Fe(), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.9
    }));
    ht.frustumCulled = false, ht.visible = false, t.add(ht);
    let rt = [];
    const Tt = new Vt(new Fe(), new mt({
      color: 16763904,
      transparent: true,
      opacity: 0.95
    }));
    Tt.frustumCulled = false, Tt.visible = false, Tt.renderOrder = 999, t.add(Tt);
    let Ge = [];
    const nt = document.createElement("div");
    nt.id = "hk-measure-label", nt.style.cssText = "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)", document.body.appendChild(nt);
    const Wt = (u) => {
      var _a3, _b;
      const g = p(u);
      if (!g) return null;
      c.setFromCamera(d, g);
      let w = null, m = null;
      const v = c.intersectObjects(t.children, true).filter((F) => F.object.isMesh && F.object !== vt && F.object !== _t && F.object.visible !== false);
      if (v.length) {
        const F = v[0], L = F.point;
        w = [
          L.x,
          L.y,
          L.z
        ];
        const Z = (_b = (_a3 = F.object.geometry) == null ? void 0 : _a3.attributes) == null ? void 0 : _b.position;
        Z && F.face && (m = [
          F.face.a,
          F.face.b,
          F.face.c
        ].map((O) => {
          const z = new te().fromBufferAttribute(Z, O);
          return F.object.localToWorld(z), [
            z.x,
            z.y,
            z.z
          ];
        }));
      } else {
        const F = Me();
        if (F.length) {
          const L = F[0].point;
          w = [
            L.x,
            L.y,
            L.z
          ];
        }
      }
      if (!w) return null;
      const E = a.getBoundingClientRect(), k = (F) => {
        const L = new te(F[0], F[1], F[2]).project(g);
        return [
          E.left + (L.x * 0.5 + 0.5) * E.width,
          E.top + (-L.y * 0.5 + 0.5) * E.height
        ];
      }, M = [
        u.clientX,
        u.clientY
      ], $ = 14;
      let I = w, T = $;
      const N = (F) => {
        const L = k(F), j = Math.hypot(L[0] - M[0], L[1] - M[1]);
        j < T && (T = j, I = F);
      };
      for (const F of m ?? []) N(F);
      for (const F of l.points.rawVal) N(F);
      return I;
    }, Dt = () => {
      if (Ge.length < 1) {
        nt.style.display = "none";
        return;
      }
      const u = s(), g = Ge[0], w = Ge[1] ?? Ge[0], v = new te((g[0] + w[0]) / 2, (g[1] + w[1]) / 2, (g[2] + w[2]) / 2).clone().project(u), E = a.getBoundingClientRect();
      nt.style.left = E.left + (v.x * 0.5 + 0.5) * E.width + "px", nt.style.top = E.top + (-v.y * 0.5 + 0.5) * E.height - 14 + "px", nt.style.display = "block";
    };
    window.__hekatanMeasureRefresh = Dt, window.__hekatanClearMeasure = () => {
      Ge = [], Tt.visible = false, nt.style.display = "none";
      try {
        r();
      } catch {
      }
    };
    try {
      (_a2 = n.addEventListener) == null ? void 0 : _a2.call(n, "change", Dt);
    } catch {
    }
    const _t = new pt(new Fe(), new gt({
      color: 16096779,
      transparent: true,
      opacity: 0.35,
      side: Pt,
      depthWrite: false
    }));
    _t.frustumCulled = false, _t.visible = false, _t.renderOrder = 998, _t.name = "hk-fill-preview", t.add(_t), a.addEventListener("pointerleave", () => {
      Pe.style.display = "none", _t.visible && (_t.visible = false, r());
    });
    const Ms = (u) => {
      var _a3, _b, _c2, _d2;
      const g = l.points.rawVal, w = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = /* @__PURE__ */ new Map(), v = (O, z) => {
        O !== z && ((m.get(O) ?? m.set(O, /* @__PURE__ */ new Set()).get(O)).add(z), (m.get(z) ?? m.set(z, /* @__PURE__ */ new Set()).get(z)).add(O));
      };
      for (const O of w) for (let z = 0; z + 1 < O.length; z++) v(O[z], O[z + 1]);
      const E = (O, z) => {
        var _a4;
        return !!((_a4 = m.get(O)) == null ? void 0 : _a4.has(z));
      }, k = [], M = /* @__PURE__ */ new Set(), $ = [
        ...m.keys()
      ];
      for (const O of $) for (const z of m.get(O)) if (!(z < O)) {
        for (const B of m.get(z)) if (B !== O) for (const Y of m.get(B)) {
          if (Y === O || Y === z || !E(Y, O) || E(O, B) || E(z, Y)) continue;
          const ee = [
            O,
            z,
            B,
            Y
          ].slice().sort((K, J) => K - J).join("-");
          M.has(ee) || (M.add(ee), k.push([
            O,
            z,
            B,
            Y
          ]));
        }
      }
      for (const O of $) for (const z of m.get(O)) if (!(z < O)) for (const B of m.get(z)) {
        if (B === O || !E(B, O)) continue;
        const Y = [
          O,
          z,
          B
        ].slice().sort((ee, K) => ee - K).join("-");
        M.has(Y) || (M.add(Y), k.push([
          O,
          z,
          B
        ]));
      }
      const I = ((_d2 = (_c2 = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c2.call(_b)) == null ? void 0 : _d2.workPlane) ?? "xy", T = (O) => I === "xy" ? [
        O[0],
        O[1]
      ] : I === "xz" ? [
        O[0],
        O[2]
      ] : [
        O[1],
        O[2]
      ], N = T(u), F = (O, z) => {
        let B = false;
        for (let Y = 0, ee = z.length - 1; Y < z.length; ee = Y++) {
          const K = z[Y][0], J = z[Y][1], se = z[ee][0], oe = z[ee][1];
          J > O[1] != oe > O[1] && O[0] < (se - K) * (O[1] - J) / (oe - J) + K && (B = !B);
        }
        return B;
      }, L = (O) => {
        let z = 0;
        for (let B = 0, Y = O.length - 1; B < O.length; Y = B++) z += (O[Y][0] + O[B][0]) * (O[Y][1] - O[B][1]);
        return Math.abs(z) / 2;
      };
      let j = null, Z = 1 / 0;
      for (const O of k) {
        const z = O.map((Y) => T(g[Y]));
        if (!F(N, z)) continue;
        const B = L(z);
        B < Z && (Z = B, j = O);
      }
      return j;
    }, Lt = new ft(), Ht = new pt(new Ns(1, 1), new gt({
      color: 2282478,
      transparent: true,
      opacity: 0.08,
      side: Pt,
      depthWrite: false
    })), $s = new is(new va(new Ns(1, 1)), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.85
    })), Xs = new is(new Fe(), new mt({
      color: 2282478,
      transparent: true,
      opacity: 0.3
    })), Qn = (u, g) => {
      const w = [], m = Math.ceil(u / g);
      for (let v = -m; v <= m; v++) {
        const E = v * g;
        w.push(-u, E, 0, u, E, 0), w.push(E, -u, 0, E, u, 0);
      }
      Xs.geometry.dispose(), Xs.geometry = new Fe(), Xs.geometry.setAttribute("position", new Mt(w, 3));
    };
    Lt.add(Ht, $s, Xs), Lt.visible = false, Lt.frustumCulled = false, t.add(Lt);
    const Zt = new ft();
    Zt.frustumCulled = false, Zt.visible = false, t.add(Zt);
    const Es = (u) => {
      const g = new Fe().setFromPoints([
        new te(0, 0, 0),
        new te(0, 0, 0)
      ]), w = new Pn({
        color: u,
        dashSize: 0.15,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.5,
        linewidth: 1
      });
      return new Vt(g, w);
    }, Ys = Es(16711680), js = Es(65280), Us = Es(35071);
    Zt.add(Ys, js, Us);
    const Sn = [], ji = (u) => u.traverse((g) => {
      var _a3, _b, _c2, _d2;
      (_b = (_a3 = g.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d2 = (_c2 = g.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d2.call(_c2);
    }), Kt = Es(16761856);
    Kt.material.dashSize = 0.28, Kt.material.gapSize = 0.16, Kt.material.opacity = 0.9, Kt.frustumCulled = false, Kt.visible = false, Kt.renderOrder = 98, t.add(Kt);
    const Mn = (u) => {
      const g = new Fe().setFromPoints([
        new te(0, 0, 0),
        new te(0, 0, 0),
        new te(0, 0, 0),
        new te(0, 0, 0)
      ]), w = new mt({
        color: u,
        transparent: true,
        opacity: 0.2,
        depthTest: false
      }), m = new el(g, w);
      return m.renderOrder = 997, m.frustumCulled = false, m;
    }, qs = Mn(3462041), dn = Mn(16724804), hn = Mn(6333946), ms = new ft();
    ms.frustumCulled = false, ms.visible = false, t.add(ms), ms.add(qs, dn, hn);
    const un = (u) => {
      const g = new Ns(1, 1), w = new gt({
        color: u,
        transparent: true,
        opacity: 0.06,
        side: Pt,
        depthWrite: false
      }), m = new pt(g, w);
      return m.frustumCulled = false, m.renderOrder = 996, m;
    }, cs = un(3462041), gs = un(16724804), ys = un(6333946);
    ms.add(cs, gs, ys);
    const As = (u, g, w, m) => {
      u.scale.set(2 * m, 2 * m, 1), w === "xy" ? (u.position.set(g[0], g[1], g[2]), u.rotation.set(0, 0, 0)) : w === "xz" ? (u.position.set(g[0], g[1], g[2]), u.rotation.set(Math.PI / 2, 0, 0)) : (u.position.set(g[0], g[1], g[2]), u.rotation.set(0, Math.PI / 2, 0));
    }, xs = document.createElement("div");
    xs.id = "hk-refplane-badge", xs.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99997",
      "padding:3px 10px",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:12px",
      "font-weight:bold",
      "transform:translate(20px,40px)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", document.body.appendChild(xs), window.__hekatanSetOrthoPlanes = (u) => {
      var _a3;
      if (window.__hekatanShowOrthoPlanes = u, ms.visible = u, u) {
        const g = window.__hekatanOrthoAnchor, w = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = w[w.length - 1] ?? [], v = l.points.rawVal ?? [], E = g && g.length === 3 ? g : m.length > 0 && v[m[m.length - 1]] ? v[m[m.length - 1]] : [
          0,
          0,
          0
        ], k = window.__hekatanOrthoExt ?? 8;
        Ts(qs, E, "xy", k), Ts(dn, E, "xz", k), Ts(hn, E, "yz", k), As(cs, E, "xy", k), As(gs, E, "xz", k), As(ys, E, "yz", k), cs.material.opacity = 0.05, gs.material.opacity = 0.05, ys.material.opacity = 0.05;
      } else {
        const g = document.getElementById("hk-refplane-badge");
        g && (g.style.display = "none");
      }
      r();
    }, window.__hekatanSetOrthoExt = (u) => {
      var _a3;
      if (window.__hekatanOrthoExt = u, !ms.visible) {
        r();
        return;
      }
      const g = window.__hekatanOrthoAnchor, w = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], m = w[w.length - 1] ?? [], v = l.points.rawVal ?? [], E = g && g.length === 3 ? g : m.length > 0 && v[m[m.length - 1]] ? v[m[m.length - 1]] : [
        0,
        0,
        0
      ];
      Ts(qs, E, "xy", u), Ts(dn, E, "xz", u), Ts(hn, E, "yz", u), As(cs, E, "xy", u), As(gs, E, "xz", u), As(ys, E, "yz", u), r();
    };
    const Bo = (u) => {
      if (cs.material.opacity = u === "xy" ? 0.09 : 0.025, gs.material.opacity = u === "xz" ? 0.09 : 0.025, ys.material.opacity = u === "yz" ? 0.09 : 0.025, u) {
        const v = {
          xy: {
            bg: "rgba(52,211,153,0.90)",
            text: "#0a1f12"
          },
          xz: {
            bg: "rgba(255,51,68,0.90)",
            text: "#1f0a0e"
          },
          yz: {
            bg: "rgba(96,165,250,0.90)",
            text: "#0a1224"
          }
        }[u];
        xs.style.background = v.bg, xs.style.color = v.text, xs.textContent = `\u25A6 Plano ${u.toUpperCase()}`, xs.style.display = "block";
      } else xs.style.display = "none";
    }, Ts = (u, g, w, m) => {
      let v;
      w === "xy" ? v = [
        new te(g[0] - m, g[1] - m, g[2]),
        new te(g[0] + m, g[1] - m, g[2]),
        new te(g[0] + m, g[1] + m, g[2]),
        new te(g[0] - m, g[1] + m, g[2]),
        new te(g[0] - m, g[1] - m, g[2])
      ] : w === "xz" ? v = [
        new te(g[0] - m, g[1], g[2] - m),
        new te(g[0] + m, g[1], g[2] - m),
        new te(g[0] + m, g[1], g[2] + m),
        new te(g[0] - m, g[1], g[2] + m),
        new te(g[0] - m, g[1], g[2] - m)
      ] : v = [
        new te(g[0], g[1] - m, g[2] - m),
        new te(g[0], g[1] + m, g[2] - m),
        new te(g[0], g[1] + m, g[2] + m),
        new te(g[0], g[1] - m, g[2] + m),
        new te(g[0], g[1] - m, g[2] - m)
      ], u.geometry.setFromPoints(v);
    };
    let zt = null;
    window.__hekatanAxisLock = () => zt;
    let ei = null, Xt = null;
    const Yt = document.createElement("div");
    Yt.id = "hk-axis-lock-badge", Yt.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99998",
      "padding:4px 10px",
      "border-radius:4px",
      "font-family:Consolas,monospace",
      "font-size:13px",
      "font-weight:bold",
      "transform:translate(20px,18px)",
      "white-space:nowrap",
      "display:none"
    ].join(";") + ";", document.body.appendChild(Yt);
    const Ho = () => {
      if (!zt) {
        Yt.style.display = "none";
        return;
      }
      const u = {
        x: "#ff3344",
        y: "#34d399",
        z: "#60a5fa"
      };
      Yt.style.background = "rgba(15,23,42,0.92)", Yt.style.color = u[zt], Yt.style.border = `1.5px solid ${u[zt]}`, Yt.textContent = `\u{1F512} LOCK ${zt.toUpperCase()}`, Yt.style.display = "block";
    };
    window.addEventListener("keydown", (u) => {
      var _a3, _b, _c2, _d2, _e2, _f;
      const g = document.activeElement;
      if (g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA") && g !== $e) return;
      const w = u.key.toLowerCase(), m = (_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool;
      if (u.key === "Enter" && m === "polyarea" && rt.length >= 3) {
        const v = ci();
        ye(`\u2713 \xC1rea libre mallada \u2014 ${v} shells Q4 creados.`), u.preventDefault();
        return;
      }
      if (w === "x" || w === "y" || w === "z") zt = zt === w ? null : w, Ho(), u.preventDefault();
      else if (u.key === "Escape") {
        const v = document.activeElement;
        v && (v.tagName === "INPUT" || v.tagName === "TEXTAREA") && v.blur(), ca(), u.preventDefault();
      } else u.key === "F3" ? (u.preventDefault(), (_d2 = window.__hekatanToggleOsnap) == null ? void 0 : _d2.call(window)) : u.key === "F10" ? (u.preventDefault(), (_e2 = window.__hekatanTogglePolar) == null ? void 0 : _e2.call(window)) : u.key === "F8" && (u.preventDefault(), (_f = window.__hekatanToggleOrtho) == null ? void 0 : _f.call(window));
    }), window.__hekatanToggleOsnap = () => {
      const u = !(window.__hekatanOsnapOn ?? true);
      window.__hekatanOsnapOn = u, u || fi(), ye(`\u{1F9F2} OSNAP ${u ? "ON" : "OFF"} (F3)`);
    }, window.__hekatanTogglePolar = () => {
      const u = window.__hekatanPolarTrack === false;
      window.__hekatanPolarTrack = u, u || (Zt.visible = false), ye(`\u25C8 POLAR ${u ? "ON" : "OFF"} (F10)`);
    }, window.__hekatanToggleOrtho = () => {
      var _a3;
      {
        window.__hekatanOrthoMode = !window.__hekatanOrthoMode;
        const u = window.__hekatanOrthoMode;
        (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
        let g = document.getElementById("hk-ortho-frame");
        g || (g = document.createElement("div"), g.id = "hk-ortho-frame", g.style.cssText = [
          "position:fixed",
          "inset:0",
          "z-index:99996",
          "border:3px solid rgba(34,211,238,0.85)",
          "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)",
          "pointer-events:none"
        ].join(";") + ";", document.body.appendChild(g)), g.style.display = u ? "block" : "none";
        let w = document.getElementById("hk-ortho-badge");
        w || (w = document.createElement("div"), w.id = "hk-ortho-badge", w.style.cssText = [
          "position:fixed",
          "top:10px",
          "left:50%",
          "transform:translateX(-50%)",
          "z-index:99998",
          "padding:6px 16px",
          "background:rgba(34,211,238,0.95)",
          "color:#0a1f24",
          "border-radius:6px",
          "border:2px solid rgba(8,145,178,1)",
          "box-shadow:0 4px 16px rgba(34,211,238,0.5)",
          "font-family:Consolas,monospace",
          "font-size:13px",
          "font-weight:bold",
          "pointer-events:none",
          "white-space:nowrap"
        ].join(";") + ";", w.textContent = "\u22A5 ORTO ON (F8)", document.body.appendChild(w)), w.style.display = u ? "block" : "none";
      }
    };
    const ti = new te(), si = new te(), Xo = new te(), kl = (u) => {
      if (!zt) return null;
      const g = u[0], w = u[1], m = u[2];
      return zt === "x" ? (ti.set(g - 1e4, w, m), si.set(g + 1e4, w, m)) : zt === "y" ? (ti.set(g, w - 1e4, m), si.set(g, w + 1e4, m)) : (ti.set(g, w, m - 1e4), si.set(g, w, m + 1e4)), c.ray.distanceSqToSegment(ti, si, null, Xo), Xo;
    };
    window.__hekatanProjectOnAxis = kl;
    const Qt = new Vt(new Fe().setFromPoints([
      new te(0, 0, 0),
      new te(0, 0, 0)
    ]), new mt({
      color: 16724804,
      transparent: true,
      opacity: 0.95,
      linewidth: 4,
      depthTest: false
    }));
    Qt.renderOrder = 998, Qt.frustumCulled = false, Qt.visible = false, t.add(Qt);
    let ws = -1, Fs = -1, Ps = -1;
    const Ue = /* @__PURE__ */ new Set();
    window.__hekatanSelection = Ue;
    const bs = new Vt(new Fe().setFromPoints([
      new te(),
      new te()
    ]), new mt({
      color: 16766720,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }));
    bs.renderOrder = 997, bs.frustumCulled = false, bs.visible = false, t.add(bs);
    const ds = new pt(new vn(0.02, 12, 12), new gt({
      color: 16766720,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    }));
    ds.renderOrder = 998, ds.visible = false, t.add(ds);
    const ni = (u) => {
      const g = s();
      if (g.isOrthographicCamera) {
        const m = g, v = (m.top - m.bottom) / m.zoom;
        return Math.max(0.05, v * 6e-3);
      }
      const w = g.position.distanceTo(u);
      return Math.max(0.05, w / 10);
    }, Yo = () => {
      ds.visible && ds.scale.setScalar(ni(ds.position));
    }, vs = new ft();
    vs.frustumCulled = false, t.add(vs);
    const ii = 2282478;
    let _s = null;
    const Cl = (u, g, w, m) => {
      if (!l.points) return -1;
      const v = l.points.rawVal;
      let E = -1, k = m;
      for (let M = 0; M < v.length; M++) {
        const $ = v[M];
        if (!$) continue;
        const I = Math.hypot(u - $[0], g - $[1], w - $[2]);
        I < k && (k = I, E = M);
      }
      return E;
    }, hs = () => {
      var _a3, _b, _c2, _d2, _e2, _f, _g, _h;
      for (; vs.children.length; ) {
        const k = vs.children.pop();
        (_b = (_a3 = k.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d2 = (_c2 = k.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d2.call(_c2);
      }
      const u = ((_e2 = l.points) == null ? void 0 : _e2.rawVal) ?? [], g = ((_f = l.polylines) == null ? void 0 : _f.rawVal) ?? [], m = ((_g = window.__hekatanDrawingAuxLines) == null ? void 0 : _g.rawVal) ?? [];
      for (const k of Ue) {
        const [M, ...$] = k.split(":");
        if (M === "pt") {
          const I = u[+$[0]];
          if (!I) continue;
          const T = new pt(new vn(0.025, 12, 12), new gt({
            color: ii,
            transparent: true,
            opacity: 0.9,
            depthTest: false
          }));
          T.position.set(I[0], I[1], I[2]), T.renderOrder = 999, T.__isSelectionPt = true, vs.add(T);
        } else if (M === "seg") {
          const I = g[+$[0]], T = u[I == null ? void 0 : I[+$[1]]], N = u[I == null ? void 0 : I[+$[1] + 1]];
          if (!T || !N) continue;
          const F = new Fe().setFromPoints([
            new te(T[0], T[1], T[2]),
            new te(N[0], N[1], N[2])
          ]), L = new Vt(F, new mt({
            color: ii,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          L.renderOrder = 999, vs.add(L);
        } else if (M === "poly") {
          const T = g[+$[0]].map((L) => {
            const j = u[L];
            return j ? new te(j[0], j[1], j[2]) : null;
          }).filter(Boolean);
          if (T.length < 2) continue;
          const N = new Fe().setFromPoints(T), F = new Vt(N, new mt({
            color: ii,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          F.renderOrder = 999, vs.add(F);
        } else if (M === "aux") {
          const I = m[+$[0]];
          if (!I || I.length !== 6) continue;
          const T = new Fe().setFromPoints([
            new te(I[0], I[1], I[2]),
            new te(I[3], I[4], I[5])
          ]), N = new Vt(T, new mt({
            color: ii,
            transparent: true,
            opacity: 0.95,
            depthTest: false
          }));
          N.renderOrder = 999, vs.add(N);
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
      r();
    };
    window.__hekatanRefreshSelection = hs, window.__hekatanSelectIds = (u) => {
      var _a3;
      Ue.clear();
      for (const g of u) Ue.add(g);
      try {
        (_a3 = window.__hekatanRefreshSelection) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return r(), Ue.size;
    }, window.__hekatanClearSelection = () => {
      Ue.clear(), hs();
    };
    const $n = (u, g, w, m, v, E, k, M, $) => {
      const I = k - m, T = M - v, N = $ - E, F = I * I + T * T + N * N;
      if (F < 1e-12) return Math.hypot(u - m, g - v, w - E);
      let L = ((u - m) * I + (g - v) * T + (w - E) * N) / F;
      L = Math.max(0, Math.min(1, L));
      const j = m + L * I, Z = v + L * T, O = E + L * N;
      return Math.hypot(u - j, g - Z, w - O);
    }, Ui = (u, g, w, m) => {
      if (!l.polylines) return null;
      const v = l.polylines.rawVal, E = l.points.rawVal;
      let k = -1, M = -1, $ = m;
      for (let I = 0; I < v.length; I++) {
        const T = v[I];
        for (let N = 0; N < T.length - 1; N++) {
          const F = E[T[N]], L = E[T[N + 1]];
          if (!F || !L) continue;
          const j = $n(u, g, w, F[0], F[1], F[2], L[0], L[1], L[2]);
          j < $ && ($ = j, k = I, M = N);
        }
      }
      return k >= 0 ? {
        polyIdx: k,
        segIdx: M,
        dist: $
      } : null;
    }, jo = (u, g, w, m) => {
      const v = window.__hekatanDrawingAuxLines, E = (v == null ? void 0 : v.rawVal) ?? (v == null ? void 0 : v.val) ?? v ?? [];
      let k = -1, M = m;
      for (let $ = 0; $ < E.length; $++) {
        const I = E[$];
        if (!I || I.length !== 6) continue;
        const T = $n(u, g, w, I[0], I[1], I[2], I[3], I[4], I[5]);
        T < M && (M = T, k = $);
      }
      return k;
    }, Sl = (u) => {
      const g = window.__hekatanDrawingAuxLines, m = ((g == null ? void 0 : g.rawVal) ?? (g == null ? void 0 : g.val) ?? g ?? [])[u];
      if (!m || m.length !== 6) {
        Qt.visible = false;
        return;
      }
      Qt.geometry.setFromPoints([
        new te(m[0], m[1], m[2]),
        new te(m[3], m[4], m[5])
      ]), Qt.visible = true;
    }, Ml = (u, g = -1) => {
      var _a3, _b;
      if (!l.polylines) return;
      const w = l.polylines.rawVal[u], m = l.points.rawVal;
      if (!w || w.length < 2) {
        Qt.visible = false;
        return;
      }
      const v = ((_b = (_a3 = l.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(u)) ?? false, E = [];
      if (v || g < 0 || g >= w.length - 1) for (const k of w) {
        const M = m[k];
        M && E.push(new te(M[0], M[1], M[2]));
      }
      else {
        const k = m[w[g]], M = m[w[g + 1]];
        k && E.push(new te(k[0], k[1], k[2])), M && E.push(new te(M[0], M[1], M[2]));
      }
      Qt.geometry.setFromPoints(E), Qt.visible = true;
    }, oi = (u) => {
      var _a3;
      if (!l.polylines) return;
      const g = l.polylines.rawVal;
      if (u < 0 || u >= g.length) return;
      const w = g.filter(($, I) => I !== u), m = /* @__PURE__ */ new Set();
      for (const $ of w) for (const I of $) m.add(I);
      const v = l.points.rawVal, E = /* @__PURE__ */ new Map(), k = [];
      for (let $ = 0; $ < v.length; $++) m.has($) && (E.set($, k.length), k.push(v[$]));
      const M = w.map(($) => $.map((I) => E.get(I)).filter((I) => I !== void 0));
      l.points.val = k, l.polylines.val = M, l.areas && (l.areas.val = l.areas.rawVal.filter(($) => $ !== u).map(($) => $ > u ? $ - 1 : $)), Qt.visible = false, ws = -1, Fs = -1;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
    }, Uo = (u, g) => {
      var _a3, _b, _c2;
      if (!l.polylines) return;
      const w = l.polylines.rawVal;
      if (u < 0 || u >= w.length) return;
      if (((_b = (_a3 = l.areas) == null ? void 0 : _a3.rawVal) == null ? void 0 : _b.includes(u)) ?? false) {
        oi(u);
        return;
      }
      const v = w[u];
      if (g < 0 || g >= v.length - 1) return;
      if (v.length === 2) {
        oi(u);
        return;
      }
      let E;
      g === 0 ? E = [
        v.slice(1)
      ] : g === v.length - 2 ? E = [
        v.slice(0, -1)
      ] : E = [
        v.slice(0, g + 1),
        v.slice(g + 1)
      ];
      const k = [
        ...w.slice(0, u),
        ...E,
        ...w.slice(u + 1)
      ], M = /* @__PURE__ */ new Set();
      for (const F of k) for (const L of F) M.add(L);
      const $ = l.points.rawVal, I = /* @__PURE__ */ new Map(), T = [];
      for (let F = 0; F < $.length; F++) M.has(F) && (I.set(F, T.length), T.push($[F]));
      const N = k.map((F) => F.map((L) => I.get(L)).filter((L) => L !== void 0));
      if (l.points.val = T, l.polylines.val = N, l.areas) {
        const F = E.length - 1;
        l.areas.val = l.areas.rawVal.map((L) => L > u ? L + F : L);
      }
      Qt.visible = false, ws = -1, Fs = -1;
      try {
        (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
      } catch {
      }
    };
    Ie.geometry.setAttribute("position", new Mt(l.points.rawVal.flat(), 3)), Ie.geometry.computeBoundingSphere(), Ie.frustumCulled = false, Oe.frustumCulled = false, t.add(Oe), f.position.set(0, 0, 0), f.rotateX(Math.PI / 2), f.geometry.rotateX(Math.PI / 2), f.updateMatrixWorld(), l.polylines && (l.polylines.val = [
      ...l.polylines.rawVal,
      []
    ]), window.__hekatanDrawAt = (u, g, w) => {
      if (l.points.val = [
        ...l.points.rawVal,
        [
          u,
          g,
          w
        ]
      ], l.polylines) {
        const m = l.polylines.rawVal, v = m.length ? m[m.length - 1] : [];
        l.polylines.val = [
          ...m.slice(0, -1),
          [
            ...v,
            l.points.rawVal.length - 1
          ]
        ];
      }
    }, window.__hekatanDrawNewPoly = () => {
      var _a3;
      if (!l.polylines) return;
      const u = l.polylines.rawVal;
      ((_a3 = u[u.length - 1]) == null ? void 0 : _a3.length) !== 0 && (l.polylines.val = [
        ...u,
        []
      ]);
    };
    const ai = [];
    window.__hekatanCirculos = ai;
    let qo = [], Wo = "";
    const Zo = () => {
      var _a3;
      const u = l.points.rawVal, g = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], w = `${u.length}|${g.length}|${g.reduce((v, E) => v + E.length, 0)}`;
      if (w === Wo) return qo;
      Wo = w;
      const m = [];
      for (const v of g) {
        const E = v.length;
        if (E < 6 || v[0] !== v[E - 1]) continue;
        const k = v.slice(0, E - 1).map((T) => u[T]).filter(Boolean);
        if (k.length < 5) continue;
        const M = [
          0,
          1,
          2
        ].map((T) => k.reduce((N, F) => N + F[T], 0) / k.length), $ = k.map((T) => Math.hypot(T[0] - M[0], T[1] - M[1], T[2] - M[2])), I = $.reduce((T, N) => T + N, 0) / $.length;
        I < 1e-9 || $.some((T) => Math.abs(T - I) > 5e-3 * I) || m.push({
          c: M,
          r: I
        });
      }
      return qo = m;
    };
    window.__hekatanCentrosDeducidos = Zo;
    const li = () => !!window.__hekatanCurvasAux, ri = (u, g) => {
      const w = window.__hekatanDrawingAuxLines;
      if (!w) return 0;
      Et();
      const m = w.rawVal ?? w.val ?? [], v = [];
      for (let E = 0; E + 1 < u.length; E++) v.push([
        ...u[E],
        ...u[E + 1]
      ]);
      return g && u.length > 2 && v.push([
        ...u[u.length - 1],
        ...u[0]
      ]), w.val = [
        ...m,
        ...v
      ], v.length;
    };
    window.__hekatanDrawCircle = (u, g, w, m, v = window.__hekatanArcSegs ?? 12, E = "xy") => {
      var _a3;
      const k = Math.max(4, Math.round(v)), M = l.points.rawVal.length, $ = [];
      for (let I = 0; I < k; I++) {
        const T = 2 * Math.PI * I / k, N = m * Math.cos(T), F = m * Math.sin(T);
        let L;
        E === "xy" ? L = [
          u + N,
          g + F,
          w
        ] : E === "xz" ? L = [
          u + N,
          g,
          w + F
        ] : L = [
          u,
          g + N,
          w + F
        ], $.push(L);
      }
      if (ai.push({
        c: [
          u,
          g,
          w
        ],
        r: m
      }), li()) {
        ri($, true);
        return;
      }
      if (l.points.val = [
        ...l.points.rawVal,
        ...$
      ], l.polylines) {
        const I = [
          ...$.map((N, F) => M + F),
          M
        ], T = l.polylines.rawVal;
        ((_a3 = T[T.length - 1]) == null ? void 0 : _a3.length) > 0 ? l.polylines.val = [
          ...T,
          I,
          []
        ] : l.polylines.val = [
          ...T.slice(0, -1),
          I,
          []
        ];
      }
    }, window.__hekatanDrawArc = (u, g, w, m = window.__hekatanArcSegs ?? 12) => {
      var _a3;
      const v = Math.max(4, Math.round(m)), E = new te(...u), k = new te(...g), M = new te(...w), $ = new te().subVectors(k, E), I = new te().subVectors(M, E), T = new te().crossVectors($, I), N = 2 * T.lengthSq();
      let F;
      if (N < 1e-12) F = new te().addVectors(E, M).multiplyScalar(0.5);
      else {
        const ke = I.clone().multiplyScalar($.lengthSq()).sub($.clone().multiplyScalar(I.lengthSq())), Te = new te().crossVectors(ke, T);
        F = E.clone().add(Te.divideScalar(N));
      }
      const L = E.distanceTo(F), j = T.lengthSq() > 1e-12 ? T.clone().normalize() : new te(0, 1, 0), Z = new te().subVectors(E, F).normalize(), O = new te().crossVectors(j, Z).normalize(), z = (ke) => {
        const Te = new te().subVectors(ke, F);
        return Math.atan2(Te.dot(O), Te.dot(Z));
      }, B = (ke) => {
        let Te = ke;
        for (; Te < 0; ) Te += 2 * Math.PI;
        for (; Te >= 2 * Math.PI; ) Te -= 2 * Math.PI;
        return Te;
      }, Y = B(z(k)), ee = B(z(M)), K = Y <= ee ? ee : ee - 2 * Math.PI, J = l.points.rawVal.length, se = [], oe = (ke) => {
        const Te = Z.clone().multiplyScalar(Math.cos(ke)).add(O.clone().multiplyScalar(Math.sin(ke)));
        return F.clone().add(Te.multiplyScalar(L));
      }, ne = String(window.__hekatanArcModo ?? "angulo"), de = ne === "x" ? 0 : ne === "y" ? 1 : ne === "z" ? 2 : -1;
      let me = false;
      if (de >= 0) {
        const ke = u[de], Te = w[de], it = 512;
        let We = Math.abs(Te - ke) > 1e-9, tt = ke;
        for (let Le = 1; Le <= it && We; Le++) {
          const Je = oe(K * Le / it).getComponent(de);
          (Je - tt) * (Te - ke) < -1e-9 && (We = false), tt = Je;
        }
        if (We) {
          me = true;
          for (let Le = 0; Le <= v; Le++) {
            const Je = ke + (Te - ke) * Le / v;
            let He = 0, Re = K;
            for (let Ze = 0; Ze < 60; Ze++) {
              const xt = (He + Re) / 2;
              (oe(xt).getComponent(de) - Je) * (Te - ke) < 0 ? He = xt : Re = xt;
            }
            const Xe = oe((He + Re) / 2);
            se.push([
              Xe.x,
              Xe.y,
              Xe.z
            ]);
          }
          se[0] = [
            u[0],
            u[1],
            u[2]
          ], se[v] = [
            w[0],
            w[1],
            w[2]
          ];
        } else try {
          (_a3 = window.__hekatanCadUpdateStatus) == null ? void 0 : _a3.call(window, `\u26A0 El arco no es mon\xF3tono en ${ne.toUpperCase()}: reparto por \xE1ngulo.`);
        } catch {
        }
      }
      if (!me) for (let ke = 0; ke <= v; ke++) {
        const Te = oe(K * (ke / v));
        se.push([
          Te.x,
          Te.y,
          Te.z
        ]);
      }
      if (ai.push({
        c: [
          F.x,
          F.y,
          F.z
        ],
        r: L
      }), li()) {
        ri(se, false);
        return;
      }
      if (l.points.val = [
        ...l.points.rawVal,
        ...se
      ], l.polylines) {
        const ke = se.map((it, We) => J + We), Te = l.polylines.rawVal;
        l.polylines.val = [
          ...Te.slice(0, -1),
          ke,
          []
        ];
      }
    }, window.__hekatanDrawPolinomio = (u, g = window.__hekatanArcSegs ?? 12) => {
      var _a3, _b, _c2, _d2;
      const w = u.length;
      if (w < 2) return {
        ok: false,
        msg: "faltan puntos"
      };
      const m = Math.max(w - 1, Math.round(g)), v = (K) => Math.max(...u.map((J) => J[K])) - Math.min(...u.map((J) => J[K])), E = [
        v(0),
        v(1),
        v(2)
      ], k = String(((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.workPlane) ?? ""), M = k === "xy" ? 2 : k === "xz" ? 1 : k === "yz" ? 0 : -1, $ = M >= 0 && E[M] < 1e-6 ? M : E[2] <= E[0] && E[2] <= E[1] ? 2 : E[1] <= E[0] ? 1 : 0, I = $ === 2 ? "xy" : $ === 1 ? "xz" : "yz", T = [
        0,
        1,
        2
      ].filter((K) => K !== $), [N, F] = E[T[0]] >= E[T[1]] ? T : [
        T[1],
        T[0]
      ], L = u.map((K) => K[N]), j = u.map((K) => K[F]);
      for (let K = 0; K < w; K++) for (let J = K + 1; J < w; J++) if (Math.abs(L[K] - L[J]) < 1e-9) return {
        ok: false,
        msg: `dos puntos con la misma abscisa (${"XYZ"[N]} en ${I.toUpperCase()}): no hay polinomio que pase por los dos`
      };
      const Z = (K) => {
        let J = 0;
        for (let se = 0; se < w; se++) {
          let oe = 1;
          for (let ne = 0; ne < w; ne++) ne !== se && (oe *= (K - L[ne]) / (L[se] - L[ne]));
          J += j[se] * oe;
        }
        return J;
      }, O = (() => {
        const K = w, J = L.map((ne) => Array.from({
          length: K
        }, (de, me) => ne ** me)), se = j.slice();
        for (let ne = 0; ne < K; ne++) {
          let de = ne;
          for (let me = ne + 1; me < K; me++) Math.abs(J[me][ne]) > Math.abs(J[de][ne]) && (de = me);
          [J[ne], J[de]] = [
            J[de],
            J[ne]
          ], [se[ne], se[de]] = [
            se[de],
            se[ne]
          ];
          for (let me = ne + 1; me < K; me++) {
            const ke = J[me][ne] / J[ne][ne];
            for (let Te = ne; Te < K; Te++) J[me][Te] -= ke * J[ne][Te];
            se[me] -= ke * se[ne];
          }
        }
        const oe = new Array(K).fill(0);
        for (let ne = K - 1; ne >= 0; ne--) {
          let de = se[ne];
          for (let me = ne + 1; me < K; me++) de -= J[ne][me] * oe[me];
          oe[ne] = de / J[ne][ne];
        }
        return oe;
      })(), z = L[0], B = L[w - 1], Y = l.points.rawVal.length, ee = [];
      for (let K = 0; K <= m; K++) {
        const J = z + (B - z) * K / m, se = [
          u[0][0],
          u[0][1],
          u[0][2]
        ];
        se[N] = J, se[F] = Z(J), se[$] = u[0][$], ee.push(se);
      }
      if (ee[0] = [
        u[0][0],
        u[0][1],
        u[0][2]
      ], ee[m] = [
        u[w - 1][0],
        u[w - 1][1],
        u[w - 1][2]
      ], li()) return ri(ee, false), {
        ok: true,
        plano: I,
        coef: O,
        ia: N,
        io: F
      };
      if (l.points.val = [
        ...l.points.rawVal,
        ...ee
      ], l.polylines) {
        const K = ee.map((se, oe) => Y + oe), J = l.polylines.rawVal;
        l.polylines.val = ((_d2 = J[J.length - 1]) == null ? void 0 : _d2.length) > 0 ? [
          ...J,
          K,
          []
        ] : [
          ...J.slice(0, -1),
          K,
          []
        ];
      }
      return {
        ok: true,
        plano: I,
        coef: O,
        ia: N,
        io: F
      };
    };
    const Ko = () => {
      var _a3, _b;
      const u = l.points.rawVal, g = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], w = new Set(((_b = l.areas) == null ? void 0 : _b.rawVal) ?? []), m = window.__hekatanDrawingAuxLines, v = (m == null ? void 0 : m.rawVal) ?? (m == null ? void 0 : m.val) ?? [], E = [], k = [], M = /* @__PURE__ */ new Set(), $ = (I) => [
        u[I][0],
        u[I][1],
        u[I][2]
      ];
      return [
        ...Ue
      ].forEach((I) => {
        const T = I.split(":");
        if (T[0] === "aux") {
          const F = v[+T[1]];
          F && F.length === 6 && (E.push([
            [
              F[0],
              F[1],
              F[2]
            ],
            [
              F[3],
              F[4],
              F[5]
            ]
          ]), k.push(I));
          return;
        }
        const N = T[0] === "poly" || T[0] === "seg" ? +T[1] : -1;
        if (!(N < 0 || !g[N] || w.has(N))) if (T[0] === "poly") {
          if (M.has(N)) return;
          M.add(N);
          for (let F = 0; F + 1 < g[N].length; F++) E.push([
            $(g[N][F]),
            $(g[N][F + 1])
          ]);
        } else {
          const F = g[N][+T[2]], L = g[N][+T[2] + 1];
          F != null && L != null && !M.has(N) && E.push([
            $(F),
            $(L)
          ]);
        }
      }), {
        segs: E,
        auxIds: k
      };
    }, En = (u, g) => Math.abs(u[0] - g[0]) < 1e-6 && Math.abs(u[1] - g[1]) < 1e-6 && Math.abs(u[2] - g[2]) < 1e-6, $l = (u) => {
      const g = new Array(u.length).fill(false), w = [];
      for (let m = 0; m < u.length; m++) {
        if (g[m]) continue;
        g[m] = true;
        const v = [
          u[m][0],
          u[m][1]
        ];
        let E = true;
        for (; E; ) {
          E = false;
          for (let M = 0; M < u.length; M++) {
            if (g[M]) continue;
            const [$, I] = u[M], T = v[v.length - 1], N = v[0];
            En($, T) ? (v.push(I), g[M] = true, E = true) : En(I, T) ? (v.push($), g[M] = true, E = true) : En(I, N) ? (v.unshift($), g[M] = true, E = true) : En($, N) && (v.unshift(I), g[M] = true, E = true);
          }
        }
        const k = v.length > 3 && En(v[0], v[v.length - 1]);
        k && v.pop(), w.push({
          pts: v,
          cerrada: k
        });
      }
      return w;
    }, qi = (u, g) => {
      let w = u.findIndex((m) => Math.abs(m[0] - g[0]) < 1e-3 && Math.abs(m[1] - g[1]) < 1e-3 && Math.abs(m[2] - g[2]) < 1e-3);
      return w < 0 && (w = u.length, u.push(g)), w;
    }, Go = (u) => {
      if (!u.length) return 0;
      Ue.clear(), u.forEach((w) => Ue.add(w));
      const g = u.length;
      return Qi(), Ue.clear(), g;
    };
    window.__hekatanRevolveSelection = (u, g, w, m = 360) => {
      var _a3, _b, _c2;
      const v = Math.max(3, Math.round(w || 16)), E = Math.abs(m - 360) < 1e-9, k = v, M = E ? v : v + 1, { segs: $, auxIds: I } = Ko();
      if (!$.length) return {
        anillos: 0,
        areas: 0,
        polo: false,
        guias: 0,
        msg: "no hay gu\xEDa seleccionada (el meridiano: barras o l\xEDneas auxiliares)"
      };
      if (E && v % 2) return {
        anillos: 0,
        areas: 0,
        polo: false,
        guias: 0,
        msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)"
      };
      Et();
      const T = l.points.rawVal, N = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], F = [
        ...T
      ];
      let L = N.slice();
      L.length && L[L.length - 1].length === 0 && (L = L.slice(0, -1));
      const j = [
        ...((_b = l.areas) == null ? void 0 : _b.rawVal) ?? []
      ], Z = /* @__PURE__ */ new Map(), O = (se) => se.map((oe) => Math.round(oe * 1e4)).join(","), z = (se) => Math.hypot(se[0] - u, se[1] - g) < 1e-6, B = (se) => {
        const oe = O(se);
        let ne = Z.get(oe);
        if (ne) return ne;
        if (z(se)) return ne = [
          qi(F, se)
        ], Z.set(oe, ne), ne;
        const de = Math.hypot(se[0] - u, se[1] - g), me = Math.atan2(se[1] - g, se[0] - u);
        ne = [];
        for (let ke = 0; ke < M; ke++) {
          const Te = me + m * Math.PI / 180 * ke / v;
          ne.push(qi(F, ke === 0 ? se : [
            u + de * Math.cos(Te),
            g + de * Math.sin(Te),
            se[2]
          ]));
        }
        return Z.set(oe, ne), ne;
      };
      let Y = 0, ee = false;
      const K = (se) => {
        j.push(L.length), L.push([
          ...se,
          se[0]
        ]), Y++;
      };
      for (const [se, oe] of $) {
        const ne = B(se), de = B(oe);
        if (!(ne.length === 1 && de.length === 1)) {
          if (ne.length === 1 || de.length === 1) {
            ee = true;
            const me = ne.length === 1 ? ne[0] : de[0], ke = ne.length === 1 ? de : ne;
            for (let Te = 0; Te + 2 <= k; Te += 2) K([
              me,
              ke[Te % M],
              ke[(Te + 1) % M],
              ke[(Te + 2) % M]
            ]);
            continue;
          }
          for (let me = 0; me < k; me++) K([
            ne[me],
            de[me],
            de[(me + 1) % M],
            ne[(me + 1) % M]
          ]);
        }
      }
      L.push([]), l.points.val = F, l.polylines && (l.polylines.val = L), l.areas && (l.areas.val = j);
      const J = Go(I);
      try {
        (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
      } catch {
      }
      return r(), {
        anillos: Z.size,
        areas: Y,
        polo: ee,
        guias: J
      };
    }, window.__hekatanLoftSelection = (u, g) => {
      var _a3, _b, _c2;
      const { segs: w, auxIds: m } = Ko(), v = $l(w), E = (de) => de.pts.every((me) => Math.abs(me[2] - de.pts[0][2]) < 1e-6), k = v.find((de) => de.cerrada && E(de)), M = v.find((de) => !de.cerrada && de.pts.length >= 2 && !E(de));
      if (!k) return {
        contorno: 0,
        perfil: 0,
        areas: 0,
        guias: 0,
        msg: "falta el CONTORNO de planta (una l\xEDnea cerrada y horizontal) en la selecci\xF3n"
      };
      if (!M) return {
        contorno: 0,
        perfil: 0,
        areas: 0,
        guias: 0,
        msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selecci\xF3n"
      };
      const $ = k.pts, I = $.length, T = M.pts.slice();
      T[T.length - 1][2] < T[0][2] && T.reverse();
      let N = 0;
      for (let de = 0; de < I; de++) {
        const me = $[de], ke = $[(de + 1) % I];
        N += me[0] * ke[1] - ke[0] * me[1];
      }
      const F = N > 0 ? 1 : -1, L = (de) => {
        const me = $[(de - 1 + I) % I], ke = $[de], Te = $[(de + 1) % I], it = [
          ke[0] - me[0],
          ke[1] - me[1]
        ], We = [
          Te[0] - ke[0],
          Te[1] - ke[1]
        ], tt = Math.hypot(it[0], it[1]) || 1, Le = Math.hypot(We[0], We[1]) || 1, Je = [
          F * it[1] / tt,
          -F * it[0] / tt
        ], He = [
          F * We[1] / Le,
          -F * We[0] / Le
        ], Re = 1 + (Je[0] * He[0] + Je[1] * He[1]);
        return [
          (Je[0] + He[0]) / Math.max(Re, 1e-6),
          (Je[1] + He[1]) / Math.max(Re, 1e-6)
        ];
      }, j = $.map((de, me) => L(me)), Z = T[0];
      let O = [
        0,
        0
      ], z = 0;
      for (const de of T) {
        const me = de[0] - Z[0], ke = de[1] - Z[1], Te = Math.hypot(me, ke);
        Te > z && (z = Te, O = [
          me / Te,
          ke / Te
        ]);
      }
      if (z < 1e-9) {
        const de = Z[0] - u, me = Z[1] - g, ke = Math.hypot(de, me) || 1;
        O = [
          de / ke,
          me / ke
        ];
      }
      O[0] * (Z[0] - u) + O[1] * (Z[1] - g) < 0 && (O = [
        -O[0],
        -O[1]
      ]), Et();
      const B = l.points.rawVal, Y = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], ee = [
        ...B
      ];
      let K = Y.slice();
      K.length && K[K.length - 1].length === 0 && (K = K.slice(0, -1));
      const J = [
        ...((_b = l.areas) == null ? void 0 : _b.rawVal) ?? []
      ], se = T.map((de) => {
        const me = (de[0] - Z[0]) * O[0] + (de[1] - Z[1]) * O[1], ke = de[2];
        return $.map((Te, it) => qi(ee, [
          Te[0] + j[it][0] * me,
          Te[1] + j[it][1] * me,
          ke
        ]));
      });
      let oe = 0;
      for (let de = 0; de + 1 < se.length; de++) for (let me = 0; me < I; me++) {
        const ke = [
          se[de][me],
          se[de][(me + 1) % I],
          se[de + 1][(me + 1) % I],
          se[de + 1][me]
        ];
        new Set(ke).size < 4 || (J.push(K.length), K.push([
          ...ke,
          ke[0]
        ]), oe++);
      }
      K.push([]), l.points.val = ee, l.polylines && (l.polylines.val = K), l.areas && (l.areas.val = J);
      const ne = Go(m);
      try {
        (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
      } catch {
      }
      return r(), {
        contorno: I,
        perfil: T.length,
        areas: oe,
        guias: ne
      };
    }, window.__hekatanDrawSlabChaflan = (u, g, w = 1, m = 6, v = 6) => {
      const E = Math.min(u[0], g[0]), k = Math.max(u[0], g[0]), M = Math.min(u[1], g[1]), $ = Math.max(u[1], g[1]), I = (u[2] + g[2]) / 2, T = k - E, N = $ - M, F = Math.min(w, T / 2 - 0.01, N / 2 - 0.01);
      if (F <= 0) return;
      const L = l.points.rawVal.length, j = [], Z = [], O = (z, B) => {
        j.push([
          z,
          B,
          I
        ]), Z.push(L + j.length - 1);
      };
      for (let z = 0; z <= v; z++) O(E + F + (T - 2 * F) * z / v, M);
      for (let z = 1; z <= m; z++) {
        const B = -Math.PI / 2 + Math.PI / 2 * z / m;
        O(k - F + F * Math.cos(B), M + F + F * Math.sin(B));
      }
      for (let z = 1; z <= v; z++) O(k, M + F + (N - 2 * F) * z / v);
      for (let z = 1; z <= m; z++) {
        const B = 0 + Math.PI / 2 * z / m;
        O(k - F + F * Math.cos(B), $ - F + F * Math.sin(B));
      }
      for (let z = 1; z <= v; z++) O(k - F - (T - 2 * F) * z / v, $);
      for (let z = 1; z <= m; z++) {
        const B = Math.PI / 2 + Math.PI / 2 * z / m;
        O(E + F + F * Math.cos(B), $ - F + F * Math.sin(B));
      }
      for (let z = 1; z <= v; z++) O(E, $ - F - (N - 2 * F) * z / v);
      for (let z = 1; z < m; z++) {
        const B = Math.PI + Math.PI / 2 * z / m;
        O(E + F + F * Math.cos(B), M + F + F * Math.sin(B));
      }
      if (Z.push(L), li()) {
        ri(j, true);
        return;
      }
      if (l.points.val = [
        ...l.points.rawVal,
        ...j
      ], l.polylines) {
        const z = l.polylines.rawVal;
        l.polylines.val = [
          ...z.slice(0, -1),
          Z,
          []
        ];
      }
    }, window.__hekatanDrawRect = (u, g) => {
      const w = l.points.rawVal.length, m = u[0], v = u[1], E = u[2], k = g[0], M = g[1], $ = g[2];
      let I;
      if (Math.abs(E - $) < 1e-6 ? I = [
        [
          m,
          v,
          E
        ],
        [
          k,
          v,
          E
        ],
        [
          k,
          M,
          E
        ],
        [
          m,
          M,
          E
        ]
      ] : Math.abs(v - M) < 1e-6 ? I = [
        [
          m,
          v,
          E
        ],
        [
          k,
          v,
          E
        ],
        [
          k,
          v,
          $
        ],
        [
          m,
          v,
          $
        ]
      ] : I = [
        [
          m,
          v,
          E
        ],
        [
          m,
          M,
          E
        ],
        [
          m,
          M,
          $
        ],
        [
          m,
          v,
          $
        ]
      ], l.points.val = [
        ...l.points.rawVal,
        ...I
      ], l.polylines) {
        const T = [
          w,
          w + 1,
          w + 2,
          w + 3,
          w
        ], N = l.polylines.rawVal;
        l.polylines.val = [
          ...N.slice(0, -1),
          T,
          []
        ];
      }
    }, window.__hekatanDrawRectArea = (u, g) => {
      var _a3;
      const w = l.points.rawVal.length, m = u[0], v = u[1], E = u[2], k = g[0], M = g[1], $ = g[2];
      let I;
      if (_ && l.gridTarget) {
        const T = l.gridTarget.rawVal, N = new Rn(...T.rotation), F = new te(1, 0, 0).applyEuler(N), L = new te(0, 1, 0).applyEuler(N), j = new te(...T.position), Z = new te(m, v, E), O = new te(k, M, $), z = Z.clone().sub(j).dot(F), B = Z.clone().sub(j).dot(L), Y = O.clone().sub(j).dot(F), ee = O.clone().sub(j).dot(L), K = (J, se) => j.clone().addScaledVector(F, J).addScaledVector(L, se).toArray();
        I = [
          K(z, B),
          K(Y, B),
          K(Y, ee),
          K(z, ee)
        ];
      } else Math.abs(E - $) < 1e-6 ? I = [
        [
          m,
          v,
          E
        ],
        [
          k,
          v,
          E
        ],
        [
          k,
          M,
          E
        ],
        [
          m,
          M,
          E
        ]
      ] : Math.abs(v - M) < 1e-6 ? I = [
        [
          m,
          v,
          E
        ],
        [
          k,
          v,
          E
        ],
        [
          k,
          v,
          $
        ],
        [
          m,
          v,
          $
        ]
      ] : I = [
        [
          m,
          v,
          E
        ],
        [
          m,
          M,
          E
        ],
        [
          m,
          M,
          $
        ],
        [
          m,
          v,
          $
        ]
      ];
      if (window.__hekatanPushUndo && window.__hekatanPushUndo(), l.points.val = [
        ...l.points.rawVal,
        ...I
      ], l.polylines) {
        const T = l.polylines.rawVal, N = T.length - 1, F = [
          w,
          w + 1,
          w + 2,
          w + 3,
          w
        ];
        l.polylines.val = [
          ...T.slice(0, -1),
          F,
          []
        ], l.areas && (l.areas.val = [
          ...l.areas.rawVal,
          N
        ]);
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      r();
    }, window.__hekatanFillClosedAreas = () => {
      var _a3, _b, _c2;
      const u = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], g = l.points.rawVal, w = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), v = (O) => O.map((z) => Math.round(z * 1e4) / 1e4).join(",");
      for (let O = 0; O < g.length; O++) {
        const z = v(g[O]), B = w.get(z);
        B === void 0 && w.set(z, O), m.set(O, B ?? O);
      }
      const E = u.map((O) => O.map((z) => m.get(z) ?? z)), k = /* @__PURE__ */ new Map(), M = (O, z) => {
        O !== z && ((k.get(O) ?? k.set(O, /* @__PURE__ */ new Set()).get(O)).add(z), (k.get(z) ?? k.set(z, /* @__PURE__ */ new Set()).get(z)).add(O));
      };
      for (const O of E) for (let z = 0; z + 1 < O.length; z++) M(O[z], O[z + 1]);
      const $ = (O, z) => {
        var _a4;
        return !!((_a4 = k.get(O)) == null ? void 0 : _a4.has(z));
      }, I = /* @__PURE__ */ new Set(), T = [], N = [
        ...k.keys()
      ];
      for (const O of N) for (const z of k.get(O)) if (!(z < O)) {
        for (const B of k.get(z)) if (B !== O) for (const Y of k.get(B)) {
          if (Y === O || Y === z || !$(Y, O) || $(O, B) || $(z, Y)) continue;
          const ee = [
            O,
            z,
            B,
            Y
          ].slice().sort((K, J) => K - J).join("-");
          I.has(ee) || (I.add(ee), T.push([
            O,
            z,
            B,
            Y
          ]));
        }
      }
      for (const O of N) for (const z of k.get(O)) if (!(z < O)) for (const B of k.get(z)) {
        if (B === O || !$(B, O)) continue;
        const Y = [
          O,
          z,
          B
        ].slice().sort((ee, K) => ee - K).join("-");
        I.has(Y) || (I.add(Y), T.push([
          O,
          z,
          B
        ]));
      }
      if (!T.length) return 0;
      const F = [
        ...((_b = l.areas) == null ? void 0 : _b.rawVal) ?? []
      ], L = new Set(F.map((O) => [
        ...new Set(E[O] ?? [])
      ].sort((z, B) => z - B).join("-"))), j = [
        ...E
      ];
      let Z = 0;
      for (const O of T) {
        const z = O.slice().sort((B, Y) => B - Y).join("-");
        L.has(z) || (L.add(z), j.push([
          ...O,
          O[0]
        ]), F.push(j.length - 1), Z++);
      }
      if (Z) {
        window.__hekatanPushUndo && window.__hekatanPushUndo(), l.polylines.val = j, l.areas && (l.areas.val = F);
        try {
          (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
        } catch {
        }
        r();
      }
      return Z;
    }, window.__hekatanMeshPolyArea = (u, g) => {
      var _a3;
      const w = u.length;
      if (w < 3) return 0;
      let m = 0, v = 0, E = 0;
      for (let Re = 0; Re < w; Re++) {
        const Xe = u[Re], Ze = u[(Re + 1) % w];
        m += (Xe[1] - Ze[1]) * (Xe[2] + Ze[2]), v += (Xe[2] - Ze[2]) * (Xe[0] + Ze[0]), E += (Xe[0] - Ze[0]) * (Xe[1] + Ze[1]);
      }
      const k = Math.hypot(m, v, E) || 1;
      m /= k, v /= k, E /= k;
      let M = u[1][0] - u[0][0], $ = u[1][1] - u[0][1], I = u[1][2] - u[0][2];
      const T = Math.hypot(M, $, I) || 1;
      M /= T, $ /= T, I /= T;
      let N = v * I - E * $, F = E * M - m * I, L = m * $ - v * M;
      const j = Math.hypot(N, F, L) || 1;
      N /= j, F /= j, L /= j;
      const Z = u[0], O = (Re) => [
        (Re[0] - Z[0]) * M + (Re[1] - Z[1]) * $ + (Re[2] - Z[2]) * I,
        (Re[0] - Z[0]) * N + (Re[1] - Z[1]) * F + (Re[2] - Z[2]) * L
      ], z = (Re, Xe) => [
        Z[0] + Re * M + Xe * N,
        Z[1] + Re * $ + Xe * F,
        Z[2] + Re * I + Xe * L
      ], B = u.map(O);
      let Y = 1 / 0, ee = -1 / 0, K = 1 / 0, J = -1 / 0;
      for (const [Re, Xe] of B) Re < Y && (Y = Re), Re > ee && (ee = Re), Xe < K && (K = Xe), Xe > J && (J = Xe);
      const se = ee - Y, oe = J - K;
      if (se < 1e-6 || oe < 1e-6) return 0;
      let ne = g && g > 0 ? g : 0.5;
      for (; se / ne * (oe / ne) > 2500; ) ne *= 2;
      ne = Math.min(ne, Math.min(se, oe));
      const de = (Re, Xe) => {
        let Ze = false;
        for (let xt = 0, St = B.length - 1; xt < B.length; St = xt++) {
          const [Ot, fs] = B[xt], [xn, Js] = B[St];
          fs > Xe != Js > Xe && Re < (xn - Ot) * (Xe - fs) / (Js - fs) + Ot && (Ze = !Ze);
        }
        return Ze;
      }, me = Math.max(1, Math.round(se / ne)), ke = Math.max(1, Math.round(oe / ne)), Te = se / me, it = oe / ke, We = /* @__PURE__ */ new Map(), tt = [], Le = l.points.rawVal.length, Je = (Re, Xe) => {
        const Ze = Re + "," + Xe, xt = We.get(Ze);
        if (xt !== void 0) return xt;
        const St = Le + tt.length;
        return tt.push(z(Y + Re * Te, K + Xe * it)), We.set(Ze, St), St;
      }, He = [];
      for (let Re = 0; Re < me; Re++) for (let Xe = 0; Xe < ke; Xe++) {
        if (!de(Y + (Re + 0.5) * Te, K + (Xe + 0.5) * it)) continue;
        const Ze = Je(Re, Xe), xt = Je(Re + 1, Xe), St = Je(Re + 1, Xe + 1), Ot = Je(Re, Xe + 1);
        He.push([
          Ze,
          xt,
          St,
          Ot
        ]);
      }
      if (!He.length) return 0;
      if (window.__hekatanPushUndo && window.__hekatanPushUndo(), l.points.val = [
        ...l.points.rawVal,
        ...tt
      ], l.polylines && l.areas) {
        let Re = l.polylines.rawVal.slice();
        Re.length && Re[Re.length - 1].length === 0 && (Re = Re.slice(0, -1));
        const Xe = [];
        for (const Ze of He) Xe.push(Re.length), Re.push([
          Ze[0],
          Ze[1],
          Ze[2],
          Ze[3],
          Ze[0]
        ]);
        Re.push([]), l.polylines.val = Re, l.areas.val = [
          ...l.areas.rawVal,
          ...Xe
        ];
      }
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return r(), He.length;
    };
    const ci = () => {
      if (rt.length < 3) return rt = [], ht.visible = false, r(), 0;
      const u = window.__hekatanMeshPolyArea(rt.slice());
      return rt = [], ht.visible = false, r(), u;
    };
    window.__hekatanFinalizePolyArea = ci, window.__hekatanSetInclinedPlaneFrom3 = (u, g, w) => {
      var _a3;
      const m = new te(u[0], u[1], u[2]), v = new te(g[0], g[1], g[2]), E = new te(w[0], w[1], w[2]), k = new te().subVectors(v, m).cross(new te().subVectors(E, m));
      if (k.lengthSq() < 1e-9) return false;
      k.normalize();
      const M = new fo().setFromUnitVectors(new te(0, 0, 1), k), $ = new Rn().setFromQuaternion(M);
      l.gridTarget && (l.gridTarget.val = {
        position: [
          m.x,
          m.y,
          m.z
        ],
        rotation: [
          $.x,
          $.y,
          $.z
        ]
      }), _ = true;
      const I = new te().addVectors(m, v).add(E).multiplyScalar(1 / 3), T = Math.max(m.distanceTo(v), m.distanceTo(E), v.distanceTo(E)) * 2.2 + 4, N = T / 2;
      Ht.geometry.dispose(), Ht.geometry = new Ns(T, T), $s.geometry.dispose(), $s.geometry = new va(new Ns(T, T)), Qn(N, 1), Lt.position.copy(I), Lt.quaternion.copy(M), Lt.scale.set(1, 1, 1), Lt.visible = true;
      try {
        (_a3 = window.__hekatanRefreshStatus) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return r(), true;
    }, window.__hekatanResetPlaneXY = () => {
      l.gridTarget && (l.gridTarget.val = {
        position: [
          0,
          0,
          0
        ],
        rotation: [
          Math.PI / 2,
          0,
          0
        ]
      }), _ = false, Lt.visible = false, r();
    };
    const us = new ft();
    us.visible = false, t.add(us), window.__hekatanShowAxes = (u, g, w = 12, m = 2) => {
      var _a3, _b;
      for (; us.children.length; ) {
        const T = us.children.pop();
        (_a3 = T.geometry) == null ? void 0 : _a3.dispose(), (_b = T.material) == null ? void 0 : _b.dispose();
      }
      if (!u.length || !g.length) return;
      const v = Math.min(...g) - m, E = Math.max(...g) + m, k = Math.min(...u) - m, M = Math.max(...u) + m, $ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", I = (T, N, F, L, j) => {
        const Z = document.createElement("canvas");
        Z.width = 64, Z.height = 32;
        const O = Z.getContext("2d");
        O.fillStyle = j, O.font = "bold 22px sans-serif", O.textAlign = "center", O.fillText(T, 32, 26);
        const z = new _a(Z), B = new ka({
          map: z,
          transparent: true
        }), Y = new Ca(B);
        return Y.position.set(N, F, L), Y.scale.set(1.2, 0.6, 1), Y;
      };
      u.forEach((T, N) => {
        const F = N < $.length ? $[N] : `X${N}`, L = new Fe().setFromPoints([
          new te(T, v, 0),
          new te(T, E, 0),
          new te(T, v, 0),
          new te(T, v, w)
        ]), j = new Pn({
          color: 6333946,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.6
        }), Z = new is(L, j);
        Z.computeLineDistances(), us.add(Z), us.add(I(F, T, v - 0.5, 0, "#60a5fa")), us.add(I(F, T, E + 0.5, 0, "#60a5fa"));
      }), g.forEach((T, N) => {
        const F = `${N + 1}`, L = new Fe().setFromPoints([
          new te(k, T, 0),
          new te(M, T, 0),
          new te(k, T, 0),
          new te(k, T, w)
        ]), j = new Pn({
          color: 16478597,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.6
        }), Z = new is(L, j);
        Z.computeLineDistances(), us.add(Z), us.add(I(F, k - 0.5, T, 0, "#fb7185")), us.add(I(F, M + 0.5, T, 0, "#fb7185"));
      }), us.visible = true, r();
    }, window.__hekatanHideAxes = () => {
      us.visible = false, r();
    };
    const zs = new ft();
    zs.visible = false, t.add(zs);
    let pn = [];
    window.__hekatanShowRefPlanes = (u = [
      0,
      3,
      6,
      9,
      12
    ], g = 20, w = 0, m = 0) => {
      var _a3, _b;
      for (; zs.children.length; ) {
        const E = zs.children.pop();
        (_a3 = E.geometry) == null ? void 0 : _a3.dispose(), (_b = E.material) == null ? void 0 : _b.dispose();
      }
      pn.forEach((E) => {
        t.remove(E), E.geometry.dispose(), E.material.dispose();
      }), pn = [];
      const v = [
        6333946,
        3462041,
        16498468,
        16478597,
        12616956,
        2282478
      ];
      u.forEach((E, k) => {
        const M = v[k % v.length], $ = g / 2, I = [
          new te(w - $, m - $, E),
          new te(w + $, m - $, E),
          new te(w + $, m + $, E),
          new te(w - $, m + $, E),
          new te(w - $, m - $, E)
        ], T = new Fe().setFromPoints(I), N = new mt({
          color: M,
          transparent: true,
          opacity: 0.55
        });
        zs.add(new Vt(T, N));
        const F = document.createElement("canvas");
        F.width = 128, F.height = 32;
        const L = F.getContext("2d");
        L.fillStyle = `#${M.toString(16).padStart(6, "0")}`, L.font = "bold 18px sans-serif", L.fillText(`Z = ${E} m`, 4, 22);
        const j = new _a(F), Z = new ka({
          map: j,
          transparent: true
        }), O = new Ca(Z);
        O.position.set(w - $ - 1.5, m - $ - 1.5, E), O.scale.set(2.5, 0.6, 1), zs.add(O);
        const z = new Ns(1e4, 1e4), B = new gt({
          visible: false,
          side: Pt
        }), Y = new pt(z, B);
        Y.position.set(0, 0, E), Y.frustumCulled = false, Y.userData = {
          refPlaneZ: E
        }, t.add(Y), pn.push(Y);
      }), zs.visible = true, r();
    }, window.__hekatanHideRefPlanes = () => {
      zs.visible = false, pn.forEach((u) => {
        u.visible = false;
      }), r();
    };
    const An = new ft();
    An.frustumCulled = false, t.add(An);
    const El = () => {
      var _a3, _b, _c2, _d2;
      for (; An.children.length; ) {
        const w = An.children.pop();
        (_b = (_a3 = w.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d2 = (_c2 = w.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d2.call(_c2);
      }
      const u = window.__hekatanDrawingAuxLines, g = (u == null ? void 0 : u.rawVal) ?? (u == null ? void 0 : u.val) ?? u ?? [];
      for (const w of g) {
        if (w.length !== 6) continue;
        const m = new Fe().setFromPoints([
          new te(w[0], w[1], w[2]),
          new te(w[3], w[4], w[5])
        ]), v = new Pn({
          color: 2282478,
          dashSize: 0.3,
          gapSize: 0.15,
          transparent: true,
          opacity: 0.8
        }), E = new Vt(m, v);
        E.computeLineDistances(), An.add(E);
      }
    };
    we.derive(() => {
      const u = window.__hekatanDrawingAuxLines;
      (u == null ? void 0 : u.val) && (u.val, El(), r());
    });
    const fn = new ft();
    fn.frustumCulled = false, t.add(fn);
    const Jo = () => {
      var _a3, _b, _c2, _d2;
      for (; fn.children.length; ) {
        const w = fn.children.pop();
        (_b = (_a3 = w.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d2 = (_c2 = w.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d2.call(_c2);
      }
      const u = window.__hekatanDrawingAuxPoints, g = (u == null ? void 0 : u.rawVal) ?? (u == null ? void 0 : u.val) ?? u ?? [];
      for (const w of g) {
        if (!w || w.length !== 3) continue;
        const m = new pt(new vn(0.025, 12, 12), new gt({
          color: 2282478,
          transparent: true,
          opacity: 0.85,
          depthTest: false
        }));
        m.position.set(w[0], w[1], w[2]), m.renderOrder = 996, m.scale.setScalar(ni(m.position)), fn.add(m);
      }
    };
    we.derive(() => {
      const u = window.__hekatanDrawingAuxPoints;
      (u == null ? void 0 : u.val) !== void 0 && (u.val, Jo(), r());
    }), n.addEventListener("change", () => {
      fn.children.forEach((u) => {
        u.scale.setScalar(ni(u.position));
      });
    }), window.__hekatanRenderAuxPoints = Jo;
    const vt = new ft(), Al = new pt(new vn(0.01, 12, 12), new gt({
      color: 16777215,
      transparent: true,
      opacity: 0.95
    })), Qo = new pt(new vn(0.015, 12, 12), new gt({
      color: 16498468,
      transparent: true,
      opacity: 0.2,
      depthWrite: false
    }));
    Qo.visible = false, vt.add(Al, Qo);
    const mn = 0.08, Wi = (u, g, w) => {
      const m = new Fe().setFromPoints([
        new te(...u),
        new te(...g)
      ]);
      return new Vt(m, new mt({
        color: w,
        transparent: true,
        opacity: 0.7
      }));
    };
    vt.add(Wi([
      -mn,
      0,
      0
    ], [
      mn,
      0,
      0
    ], 16777215)), vt.add(Wi([
      0,
      -mn,
      0
    ], [
      0,
      mn,
      0
    ], 16777215)), vt.add(Wi([
      0,
      0,
      -mn
    ], [
      0,
      0,
      mn
    ], 16777215)), vt.visible = false, vt.frustumCulled = false, t.add(vt);
    let Zi = 2;
    const di = (u) => {
      const g = s(), w = (a == null ? void 0 : a.clientHeight) || 700;
      return g.isOrthographicCamera ? (g.top - g.bottom) / (g.zoom || 1) / w : 2 * g.position.distanceTo(u) * Math.tan((g.fov || 50) * Math.PI / 180 / 2) / w;
    }, Tn = () => {
      if (!vt.visible) return;
      const u = Zi * di(vt.position) / 0.015;
      vt.scale.setScalar(Math.max(1e-4, Math.min(1e5, u)));
    };
    let Rs = 10;
    const Ki = (u) => Math.max(1e-4, Rs * di(u));
    window.__hekatanAperturaPx = (u) => (typeof u == "number" && u > 0 && (Rs = u), Rs), window.__hekatanUpdateSnapScale = Tn, window.__hekatanSnapMarker = vt, window.__hekatanMetrosPorPixel = di, window.__hekatanSnapPx = (u) => (typeof u == "number" && u > 0 && (Zi = u, Tn(), r()), Zi);
    const ea = () => {
      vs.children.length !== 0 && vs.children.forEach((u) => {
        if (!u.__isSelectionPt) return;
        const g = u;
        g.scale.setScalar(ni(g.position) * 1.8);
      });
    };
    window.__hekatanUpdateSelectionPtScale = ea, n.addEventListener("change", () => {
      var _a3;
      Tn(), ds.visible && Yo(), (_a3 = window.__hekatanUpdateOsnapScale) == null ? void 0 : _a3.call(window), ea();
    }), window.__hekatanShowSnap = (u, g, w) => {
      vt.position.set(u, g, w), vt.visible = true, Tn(), r();
    }, window.__hekatanHideSnap = () => {
      vt.visible = false, r();
    }, a.addEventListener("pointermove", (u) => {
      var _a3, _b, _c2, _d2, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r2, _s2, _t2, _u, _v, _w, _x;
      window.__hekatanCursorPx = {
        x: u.clientX,
        y: u.clientY
      };
      const g = p(u);
      if (!g) return;
      c.setFromCamera(d, g), A = null;
      const w = Me();
      if ((!w.length || ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) !== "fillarea") && _t.visible && (_t.visible = false), w.length) {
        const m = w[0].point;
        if (((_f = (_e2 = (_d2 = window.__hekatanCadState) == null ? void 0 : _d2.get) == null ? void 0 : _e2.call(_d2)) == null ? void 0 : _f.tool) === "fillarea") {
          const L = Ms([
            m.x,
            m.y,
            m.z
          ]);
          if (L) {
            const j = L.map((z) => l.points.rawVal[z]), Z = [];
            for (let z = 1; z < j.length - 1; z++) Z.push(j[0][0], j[0][1], j[0][2], j[z][0], j[z][1], j[z][2], j[z + 1][0], j[z + 1][1], j[z + 1][2]);
            const O = _t.geometry;
            O.setAttribute("position", new Mt(Z, 3)), O.computeVertexNormals(), _t.visible = true;
          } else _t.visible = false;
        } else _t.visible && (_t.visible = false);
        const v = u.altKey;
        let E = false;
        const k = Ki(m), M = v ? null : (_g = window.__hekatanOsnapCompute) == null ? void 0 : _g.call(window, m.x, m.y, m.z, k, {
          x: u.clientX,
          y: u.clientY
        });
        if (M) pi(M.type, M.x, M.y, M.z), vt.position.set(M.x, M.y, M.z), vt.visible = true, m.set(M.x, M.y, M.z), mi(M.type, u.clientX, u.clientY);
        else if (!v && (ze = Ne(u.clientX, u.clientY))) E = true, m.copy(ze), pi("ifcSec", m.x, m.y, m.z), mi("ifcSec", u.clientX, u.clientY), vt.position.copy(m), vt.visible = true;
        else if (S && !v) E = true, pi(S.tipo, m.x, m.y, m.z), mi(S.tipo, u.clientX, u.clientY), vt.position.copy(m), vt.visible = true;
        else {
          Fl(), fi();
          const F = !v && window.__hekatanSnapEnabled !== false, L = window.__hekatanSnap2D ?? 0.5;
          F && L > 0 && (m.x = Math.round(m.x / L) * L, m.y = Math.round(m.y / L) * L, m.z = Math.round(m.z / L) * L), vt.position.copy(m), vt.visible = true;
        }
        Tn(), V(A && !M && (E || S) ? W(A) : null), Xt = {
          p: m.clone(),
          x: u.clientX,
          y: u.clientY
        };
        const $ = ((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.tool) ?? "select";
        if ($ === "select" || !$) {
          const F = (window.__hekatanSnap2D ?? 0.5) * 1.5, L = Cl(m.x, m.y, m.z, F), j = Ui(m.x, m.y, m.z, F), Z = jo(m.x, m.y, m.z, F);
          if (L >= 0) {
            const Y = l.points.rawVal[L];
            ds.position.set(Y[0], Y[1], Y[2]), ds.visible = true, Yo(), bs.visible = false, _s = {
              kind: "pt",
              a: L
            };
          } else if (j) {
            const Y = l.points.rawVal, ee = l.polylines.rawVal[j.polyIdx], K = Y[ee[j.segIdx]], J = Y[ee[j.segIdx + 1]];
            bs.geometry.setFromPoints([
              new te(K[0], K[1], K[2]),
              new te(J[0], J[1], J[2])
            ]), bs.visible = true, ds.visible = false, _s = ((_l2 = (_k = l.areas) == null ? void 0 : _k.rawVal) == null ? void 0 : _l2.includes(j.polyIdx)) ?? false ? {
              kind: "poly",
              a: j.polyIdx
            } : {
              kind: "seg",
              a: j.polyIdx,
              b: j.segIdx
            };
          } else if (Z >= 0) {
            const ee = (((_m = window.__hekatanDrawingAuxLines) == null ? void 0 : _m.rawVal) ?? [])[Z];
            ee && (bs.geometry.setFromPoints([
              new te(ee[0], ee[1], ee[2]),
              new te(ee[3], ee[4], ee[5])
            ]), bs.visible = true, ds.visible = false, _s = {
              kind: "aux",
              a: Z
            });
          } else bs.visible = false, ds.visible = false, _s = null;
          Pe.style.left = u.clientX + "px", Pe.style.top = u.clientY + "px", Pe.style.display = "block";
          let O = m;
          if ((_s == null ? void 0 : _s.kind) === "pt") {
            const Y = l.points.rawVal[_s.a];
            Y && (O = new te(Y[0], Y[1], Y[2]));
          }
          const z = `X=${O.x.toFixed(2)} Y=${O.y.toFixed(2)} Z=${O.z.toFixed(2)}`;
          if (window.__hekatanCursorXYZ = [
            O.x,
            O.y,
            O.z
          ], _s) {
            const Y = {
              pt: "nodo",
              seg: "segmento",
              poly: "\xE1rea",
              aux: "l\xEDnea aux"
            };
            Pe.textContent = `${z}  \xB7  \u{1F5B1} Click \u2192 ${Y[_s.kind]}`;
          } else Pe.textContent = z;
          const B = document.getElementById("hk-coord-fixed");
          B && (B.textContent = z), Xt = {
            p: O.clone(),
            x: u.clientX,
            y: u.clientY
          }, De.visible = false, Zt.visible = false, Kt.visible = false, r();
          return;
        }
        if ($ === "delete" || $ === "trim" || $ === "extend" || $ === "offset") {
          const F = (window.__hekatanSnap2D ?? 0.5) * 1.5, L = Ui(m.x, m.y, m.z, F), j = jo(m.x, m.y, m.z, F);
          let Z = false;
          if (j >= 0) if (!L) Z = true;
          else {
            const Y = window.__hekatanDrawingAuxLines, K = ((Y == null ? void 0 : Y.rawVal) ?? (Y == null ? void 0 : Y.val) ?? Y ?? [])[j];
            $n(m.x, m.y, m.z, K[0], K[1], K[2], K[3], K[4], K[5]) < L.dist && (Z = true);
          }
          Z ? (Ps = j, ws = -1, Fs = -1, Sl(j)) : L ? (ws = L.polyIdx, Fs = L.segIdx, Ps = -1, Ml(L.polyIdx, L.segIdx)) : (ws = -1, Fs = -1, Ps = -1, Qt.visible = false), De.visible = false, Zt.visible = false, Kt.visible = false, at(), Pe.style.left = u.clientX + "px", Pe.style.top = u.clientY + "px", Pe.style.display = "block";
          const O = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`;
          let z = "";
          Z ? z = `\u{1F5D1} l\xEDnea aux #${Ps + 1}` : L ? z = ((_o2 = (_n2 = l.areas) == null ? void 0 : _n2.rawVal) == null ? void 0 : _o2.includes(L.polyIdx)) ?? false ? `\u{1F5D1} \xE1rea #${L.polyIdx + 1}` : `\u{1F5D1} seg ${L.segIdx + 1} / poly #${L.polyIdx + 1}` : z = "\u{1F5D1} acerc\xE1 a l\xEDnea/\xE1rea", Pe.textContent = `${O}  \xB7  ${z}`;
          const B = document.getElementById("hk-coord-fixed");
          B && (B.textContent = O), r();
          return;
        } else Qt.visible = false, ws = -1, Ps = -1;
        Pe.style.left = u.clientX + "px", Pe.style.top = u.clientY + "px", Pe.style.display = "block";
        const I = ((_p = l.polylines) == null ? void 0 : _p.rawVal) ?? [], T = I[I.length - 1] ?? [], N = l.points.rawVal ?? [];
        if (T.length > 0 && N[T[T.length - 1]]) {
          const F = T[T.length - 1], L = N[F];
          let j = zt;
          ei = null;
          const Z = !!M || E;
          if (!j && !Z && window.__hekatanAxisSnap !== false) {
            const We = a.getBoundingClientRect(), tt = u.clientX, Le = u.clientY, Je = ((_q = settings.gridSize) == null ? void 0 : _q.rawVal) ?? 10, He = new te(L[0], L[1], L[2]), Re = [
              [
                "x",
                new te(1, 0, 0)
              ],
              [
                "y",
                new te(0, 1, 0)
              ],
              [
                "z",
                new te(0, 0, 1)
              ]
            ], Xe = (xt) => {
              const St = xt.clone().project(g);
              return {
                x: (St.x * 0.5 + 0.5) * We.width + We.left,
                y: (-St.y * 0.5 + 0.5) * We.height + We.top
              };
            };
            let Ze = null;
            for (const [xt, St] of Re) {
              const Ot = Xe(He.clone().addScaledVector(St, -Je)), fs = Xe(He.clone().addScaledVector(St, Je)), xn = fs.x - Ot.x, Js = fs.y - Ot.y, Xl = tt - Ot.x, Yl = Le - Ot.y, jl = xn * xn + Js * Js || 1;
              let wi = (Xl * xn + Yl * Js) / jl;
              wi = Math.max(0, Math.min(1, wi));
              const fa = Math.hypot(tt - (Ot.x + wi * xn), Le - (Ot.y + wi * Js));
              if (Ze === null || fa < Ze.dpx) {
                const ro = c.ray, ma = He.clone().sub(ro.origin), co = St.dot(ro.direction), ga = St.dot(ma), Ul = ro.direction.dot(ma), ya = 1 - co * co, ql = Math.abs(ya) < 1e-6 ? -ga : (co * Ul - ga) / ya;
                Ze = {
                  axis: xt,
                  dpx: fa,
                  pt: He.clone().addScaledVector(St, ql)
                };
              }
            }
            Ze && Ze.dpx <= 12 && (m.copy(Ze.pt), j = Ze.axis, ei = Ze.pt.clone());
          }
          const O = !!window.__hekatanOrthoMode;
          if (!j && !Z && O) {
            const We = Math.abs(m.x - L[0]), tt = Math.abs(m.y - L[1]), Le = Math.abs(m.z - L[2]), Je = (_r2 = w[0]) == null ? void 0 : _r2.object;
            let He = null;
            Je === cs ? He = "xy" : Je === gs ? He = "xz" : Je === ys && (He = "yz"), He === "xy" ? j = We >= tt ? "x" : "y" : He === "xz" ? j = We >= Le ? "x" : "z" : He === "yz" ? j = tt >= Le ? "y" : "z" : j = We >= tt && We >= Le ? "x" : tt >= Le ? "y" : "z";
          }
          const z = window.__hekatanPolarTrack !== false;
          if (!j && !Z && z) {
            const We = m.x - L[0], tt = m.y - L[1], Le = m.z - L[2], Je = Math.hypot(We, tt, Le);
            if (Je > 1e-3) {
              const Re = Math.tan(6 * Math.PI / 180) * Je, Xe = Math.hypot(tt, Le), Ze = Math.hypot(We, Le), xt = Math.hypot(We, tt), St = [
                [
                  "x",
                  Xe
                ],
                [
                  "y",
                  Ze
                ],
                [
                  "z",
                  xt
                ]
              ];
              St.sort((Ot, fs) => Ot[1] - fs[1]), St[0][1] <= Re && (j = St[0][0]);
            }
          }
          if (j) {
            const We = L[0], tt = L[1], Le = L[2];
            j === "x" ? m.set(m.x, tt, Le) : j === "y" ? m.set(We, m.y, Le) : m.set(We, tt, m.z);
            const Je = !!zt, Re = {
              x: "#ff3344",
              y: "#34d399",
              z: "#60a5fa"
            }[j];
            Yt.style.background = "rgba(15,23,42,0.92)", Yt.style.color = Re, Yt.style.border = `1.5px solid ${Re}`;
            const Xe = (_s2 = w[0]) == null ? void 0 : _s2.object;
            let Ze = null;
            Xe === cs ? Ze = "xy" : Xe === gs ? Ze = "xz" : Xe === ys && (Ze = "yz");
            const xt = Ze ? ` (plano ${Ze.toUpperCase()})` : "";
            Yt.textContent = Je ? `\u{1F512} LOCK ${j.toUpperCase()}${xt}` : `\u22A5 ORTO ${j.toUpperCase()}${xt}`, Yt.style.left = u.clientX + 20 + "px", Yt.style.top = u.clientY + 18 + "px", Yt.style.transform = "none", Yt.style.display = "block";
          } else zt || (Yt.style.display = "none");
          let B = null;
          if (!v && !Z && window.__hekatanTrack !== false && window.__hekatanOsnapOn !== false) {
            const We = l.points.rawVal, tt = j ? [
              j
            ] : [
              "z",
              "x",
              "y"
            ], Le = {
              x: u.clientX,
              y: u.clientY
            };
            let Je = 1 / 0;
            for (const He of We) if (!(Math.abs(He[0] - L[0]) < 1e-9 && Math.abs(He[1] - L[1]) < 1e-9 && Math.abs(He[2] - L[2]) < 1e-9)) for (const Re of tt) {
              const Xe = new te(Re === "x" ? He[0] : m.x, Re === "y" ? He[1] : m.y, Re === "z" ? He[2] : m.z), Ze = Ks(Xe.x, Xe.y, Xe.z);
              if (!Ze) continue;
              const xt = Math.hypot(Ze.x - Le.x, Ze.y - Le.y);
              xt < Rs && xt < Je && (Je = xt, B = {
                q: He,
                eje: Re
              });
            }
          }
          B ? (B.eje === "x" ? m.x = B.q[0] : B.eje === "y" ? m.y = B.q[1] : m.z = B.q[2], Kt.geometry.setFromPoints([
            new te(B.q[0], B.q[1], B.q[2]),
            new te(m.x, m.y, m.z)
          ]), (_t2 = Kt.computeLineDistances) == null ? void 0 : _t2.call(Kt), Kt.visible = true, vt.position.set(m.x, m.y, m.z), vt.visible = true, mi("track", u.clientX, u.clientY)) : Kt.visible = false, Xt = {
            p: m.clone(),
            x: u.clientX,
            y: u.clientY
          };
          const Y = Math.hypot(m.x - L[0], m.y - L[1], m.z - L[2]), ee = Math.atan2(m.y - L[1], m.x - L[0]) * 180 / Math.PI, K = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`, J = (ee % 360 + 360) % 360;
          Pe.textContent = `L = ${Y.toFixed(3)} m   \u2220 ${J.toFixed(1)}\xB0   \xB7   ${K}`;
          const se = document.getElementById("hk-coord-fixed");
          se && (se.textContent = K), De.geometry.setFromPoints([
            new te(L[0], L[1], L[2]),
            new te(m.x, m.y, m.z)
          ]), (_u = De.computeLineDistances) == null ? void 0 : _u.call(De), De.visible = true, Rt(L[0], L[1], L[2], m.x, m.y, m.z);
          const oe = window.__hekatanOrthoExt ?? 8, ne = window.__hekatanShowOrthoPlanes !== false;
          ms.visible = ne, ne || Bo(null), ne && (Ts(qs, L, "xy", oe), Ts(dn, L, "xz", oe), Ts(hn, L, "yz", oe), As(cs, L, "xy", oe), As(gs, L, "xz", oe), As(ys, L, "yz", oe));
          const de = ne ? c.intersectObjects([
            cs,
            gs,
            ys
          ], false) : [];
          let me = null;
          if (de.length > 0) {
            const We = de[0].object;
            We === cs ? me = "xy" : We === gs ? me = "xz" : We === ys && (me = "yz");
          }
          Bo(me), me && (xs.style.left = u.clientX + "px", xs.style.top = u.clientY + "px"), Ys.geometry.setFromPoints([
            new te(L[0] - oe, L[1], L[2]),
            new te(L[0] + oe, L[1], L[2])
          ]), (_v = Ys.computeLineDistances) == null ? void 0 : _v.call(Ys), js.geometry.setFromPoints([
            new te(L[0], L[1] - oe, L[2]),
            new te(L[0], L[1] + oe, L[2])
          ]), (_w = js.computeLineDistances) == null ? void 0 : _w.call(js), Us.geometry.setFromPoints([
            new te(L[0], L[1], L[2] - oe),
            new te(L[0], L[1], L[2] + oe)
          ]), (_x = Us.computeLineDistances) == null ? void 0 : _x.call(Us), Zt.visible = true;
          const ke = Ys.material, Te = js.material, it = Us.material;
          Ys.visible = j === "x", js.visible = j === "y", Us.visible = j === "z", ke.opacity = 0.95, Te.opacity = 0.95, it.opacity = 0.95;
        } else {
          const F = `X=${m.x.toFixed(2)} Y=${m.y.toFixed(2)} Z=${m.z.toFixed(2)}`;
          Pe.textContent = F;
          const L = document.getElementById("hk-coord-fixed");
          if (L && (L.textContent = F), De.visible = false, Zt.visible = false, (/* @__PURE__ */ new Set([
            "line",
            "polyline",
            "area",
            "node",
            "column",
            "wall",
            "rect",
            "circle",
            "arc",
            "polyline-multi",
            "axis",
            "chaflan"
          ])).has($)) {
            if (je = null, Ke = null, $e.style.left = u.clientX + 20 + "px", $e.style.top = u.clientY - 28 + "px", $e.style.display = "block", !Ee) {
              $e.value = `${m.x.toFixed(2)},${m.y.toFixed(2)},${m.z.toFixed(2)}`;
              const Z = document.activeElement;
              !(Z && (Z.tagName === "INPUT" || Z.tagName === "TEXTAREA") && Z !== $e) && document.activeElement !== $e && $e.focus({
                preventScroll: true
              });
              try {
                $e.select();
              } catch {
              }
            }
          } else at();
        }
        r();
      } else fi(), Pe.style.display = "none", vt.visible = false, De.visible = false, Zt.visible = false, at(), r();
    }), we.derive(() => {
      var _a3;
      if (!l.gridTarget) return;
      const u = new fo().setFromEuler(new Rn(...l.gridTarget.val.rotation)), g = new fo().setFromAxisAngle(new te(1, 0, 0), Math.PI / 2);
      Br(e, {
        position: new te(...l.gridTarget.val.position),
        quaternion: u.clone().multiply(g)
      }, r);
      {
        const m = l.gridTarget.val.position[2], v = Math.abs(u.x - Math.sin(Math.PI / 4)) < 1e-3;
        for (const E of Sn) t.remove(E), ji(E);
        if (Sn.length = 0, v) {
          const E = ((_a3 = l.points) == null ? void 0 : _a3.rawVal) ?? [], k = /* @__PURE__ */ new Set([
            0
          ]);
          for (const $ of E) k.add(+$[2].toFixed(3));
          for (const $ of window.__hekatanLevels ?? []) isFinite($ == null ? void 0 : $.z) && k.add(+$.z.toFixed(3));
          const M = [
            ...k
          ].sort(($, I) => $ - I).slice(0, 24);
          for (const $ of M) {
            if (Math.abs($ - m) < 1e-6) continue;
            const I = e.clone(true);
            I.name = `hekatan-grid-nivel-${$}`, I.traverse((T) => {
              T.material && (T.material = T.material.clone(), T.material.transparent = true, T.material.opacity = (T.material.opacity ?? 1) * (Math.abs($) < 1e-6 ? 0.5 : 0.22));
            }), I.position.set(0, 0, $), I.quaternion.copy(g), t.add(I), Sn.push(I);
          }
        }
      }
      f.position.set(...l.gridTarget.val.position), f.quaternion.setFromEuler(new Rn(...l.gridTarget.val.rotation)), f.updateMatrixWorld();
      const w = new te(0, 0, 1).applyEuler(new Rn(...l.gridTarget.val.rotation));
      _ = !(Math.abs(w.x) > 0.999 || Math.abs(w.y) > 0.999 || Math.abs(w.z) > 0.999);
    }), we.derive(() => {
      Ie.geometry.setAttribute("position", new Mt(l.points.val.flat(), 3)), Ie.geometry.computeBoundingSphere();
    }), we.derive(() => {
      const u = 0.05 * i * 0.5 * o.val;
      c.params.Points.threshold = 0.4 * u;
    }), we.derive(() => {
      var _a3;
      const u = l.points.val ?? [], w = (((_a3 = l.polylines) == null ? void 0 : _a3.val) ?? []).at(-1) ?? [], m = [];
      for (const E of w) {
        const [k, M, $] = u[E];
        m.push(k, M, $);
      }
      const v = new Fe();
      v.setAttribute("position", new Mt(m, 3)), Ye.geometry.dispose(), Ye.geometry = v;
    });
    let Gi = false, Ws = 0;
    a.addEventListener("pointerdown", () => {
      Gi = true;
    }), a.addEventListener("pointerup", () => {
      Gi = false;
    }), a.addEventListener("pointermove", () => {
      Gi && Ws++;
    });
    const Gt = document.createElement("div");
    Gt.id = "hk-window-select", Gt.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "z-index:99996",
      "display:none",
      "border:1.5px solid",
      "background:rgba(0,0,0,0)"
    ].join(";") + ";", document.body.appendChild(Gt);
    let ps = null, zn = false, ts = null;
    const Ji = (u, g, w, m, v) => {
      v ? (Gt.style.borderColor = "#34d399", Gt.style.borderStyle = "dashed", Gt.style.background = "rgba(52, 211, 153, 0.10)") : (Gt.style.borderColor = "#22d3ee", Gt.style.borderStyle = "solid", Gt.style.background = "rgba(34, 211, 238, 0.10)"), Gt.style.left = Math.min(u, w) + "px", Gt.style.top = Math.min(g, m) + "px", Gt.style.width = Math.abs(w - u) + "px", Gt.style.height = Math.abs(m - g) + "px", Gt.style.display = "block";
    }, ta = (u, g, w, m, v) => {
      var _a3, _b, _c2, _d2;
      const E = Math.min(u, w), k = Math.max(u, w), M = Math.min(g, m), $ = Math.max(g, m), I = w < u, T = a.getBoundingClientRect(), N = s();
      N.updateMatrixWorld();
      const F = (J) => {
        const se = new te(J[0], J[1], J[2]);
        return se.project(N), {
          x: T.left + (se.x * 0.5 + 0.5) * T.width,
          y: T.top + (-se.y * 0.5 + 0.5) * T.height
        };
      }, L = (J) => J.x >= E && J.x <= k && J.y >= M && J.y <= $, j = (J, se) => !(J.x < E && se.x < E || J.x > k && se.x > k || J.y < M && se.y < M || J.y > $ && se.y > $);
      v || Ue.clear();
      let Z = 0;
      const O = ((_a3 = l.points) == null ? void 0 : _a3.rawVal) ?? [];
      for (let J = 0; J < O.length; J++) {
        const se = O[J];
        se && L(F(se)) && (Ue.add(`pt:${J}`), Z++);
      }
      const z = (J, se) => I ? L(J) || L(se) || j(J, se) : L(J) && L(se), B = ((_b = l.polylines) == null ? void 0 : _b.rawVal) ?? [], Y = ((_c2 = l.areas) == null ? void 0 : _c2.rawVal) ?? [];
      for (let J = 0; J < B.length; J++) {
        const se = B[J];
        if (Y.includes(J)) {
          let ne;
          if (!I) ne = se.every((de) => {
            const me = O[de];
            return !!me && L(F(me));
          });
          else {
            ne = false;
            for (let de = 0; de < se.length - 1; de++) {
              const me = O[se[de]], ke = O[se[de + 1]];
              if (!(!me || !ke) && z(F(me), F(ke))) {
                ne = true;
                break;
              }
            }
          }
          ne && (Ue.add(`poly:${J}`), Z++);
        } else for (let ne = 0; ne < se.length - 1; ne++) {
          const de = O[se[ne]], me = O[se[ne + 1]];
          !de || !me || z(F(de), F(me)) && (Ue.add(`seg:${J}:${ne}`), Z++);
        }
      }
      const K = ((_d2 = window.__hekatanDrawingAuxLines) == null ? void 0 : _d2.rawVal) ?? [];
      for (let J = 0; J < K.length; J++) {
        const se = K[J];
        if (!se || se.length !== 6) continue;
        const oe = F([
          se[0],
          se[1],
          se[2]
        ]), ne = F([
          se[3],
          se[4],
          se[5]
        ]);
        z(oe, ne) && (Ue.add(`aux:${J}`), Z++);
      }
      hs(), ye(Z === 0 && !I ? "\u{1F535} Window (izq\u2192der) \u2014 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (\u{1F7E2} captura) coge todo lo que toque." : `${I ? "\u{1F7E2} Crossing" : "\u{1F535} Window"} \u2014 ${Z} item(s) ${v ? "agregados a" : "\u2192"} selecci\xF3n (total ${Ue.size})`), Gt.style.display = "none";
    }, hi = () => {
      ts && (ts = null, Gt.style.display = "none", ye("Selecci\xF3n cancelada"));
    };
    window.__hekatanCancelClickClickRect = hi, window.addEventListener("keydown", (u) => {
      u.key === "Escape" && ts && hi();
    });
    const Qi = () => {
      var _a3, _b, _c2, _d2;
      if (Ue.size === 0) return false;
      const u = [
        ...Ue
      ], g = ((_a3 = l.points) == null ? void 0 : _a3.rawVal) ?? [], w = ((_b = l.polylines) == null ? void 0 : _b.rawVal) ?? [], m = ((_c2 = l.areas) == null ? void 0 : _c2.rawVal) ?? [], v = window.__hekatanDrawingAuxLines, E = (v == null ? void 0 : v.rawVal) ?? [], k = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Set();
      for (const j of u) {
        const [Z, ...O] = j.split(":");
        if (Z === "pt") k.add(+O[0]);
        else if (Z === "poly") M.add(+O[0]);
        else if (Z === "seg") {
          const z = +O[0], B = +O[1];
          $.has(z) || $.set(z, /* @__PURE__ */ new Set()), $.get(z).add(B);
        } else Z === "aux" && I.add(+O[0]);
      }
      let T = 0, N = [], F = [];
      const L = /* @__PURE__ */ new Map();
      for (let j = 0; j < w.length; j++) {
        if (M.has(j)) {
          T++;
          continue;
        }
        L.set(j, N.length);
        const Z = $.get(j);
        if (Z && Z.size > 0) {
          let O = [];
          for (let z = 0; z < w[j].length; z++) O.push(w[j][z]), z < w[j].length - 1 && Z.has(z) && (O.length >= 2 && N.push(O), O = [], T++);
          (O.length >= 2 || O.length === 1) && N.push(O);
        } else N.push([
          ...w[j]
        ]);
      }
      if (k.size > 0) {
        const j = [], Z = /* @__PURE__ */ new Map();
        for (let z = 0; z < g.length; z++) {
          if (k.has(z)) {
            T++;
            continue;
          }
          Z.set(z, j.length), j.push([
            ...g[z]
          ]);
        }
        const O = [];
        for (const z of N) {
          let B = [];
          for (const Y of z) {
            const ee = Z.get(Y);
            ee === void 0 ? (B.length >= 2 && O.push(B), B = []) : B.push(ee);
          }
          B.length >= 2 && O.push(B);
        }
        N = O, l.points.val = j;
      }
      for (const j of m) {
        const Z = L.get(j);
        Z !== void 0 && Z < N.length && F.push(Z);
      }
      if (l.polylines && (l.polylines.val = N), l.areas && (l.areas.val = F), I.size > 0 && v) {
        const j = E.filter((Z, O) => !I.has(O));
        "val" in v ? v.val = j : window.__hekatanDrawingAuxLines = j, T += I.size;
      }
      Ue.clear(), hs();
      try {
        (_d2 = window.__hekatanRebuild) == null ? void 0 : _d2.call(window);
      } catch {
      }
      return ye(`\u{1F5D1} ${T} item(s) borrado(s)`), true;
    };
    window.__hekatanDeleteSelected = Qi, window.addEventListener("keydown", (u) => {
      if (u.key !== "Delete" && u.key !== "Backspace") return;
      const g = document.activeElement, w = g && (g.id === "hk3-cmd-input" || g.id === "hk-dyn-input") && g.value === "";
      g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA" || g.isContentEditable) && !w || Ue.size !== 0 && (u.preventDefault(), Qi());
    });
    const es = document.createElement("div");
    es.id = "hk-properties-pane";
    const sa = "hk-props-pane-pos";
    let In = null;
    try {
      const u = localStorage.getItem(sa);
      u && (In = JSON.parse(u));
    } catch {
    }
    es.style.cssText = [
      "position:fixed",
      In ? `left:${In.left}px` : "left:14px",
      In ? `top:${In.top}px` : "top:200px",
      "transform:none",
      "width:min(300px, calc(100vw - 32px))",
      "max-height:calc(100vh - 260px)",
      "overflow-y:auto",
      "z-index:201",
      "box-shadow:0 6px 24px rgba(0,0,0,0.45)",
      "border-radius:6px",
      "display:none"
    ].join(";") + ";", document.body.appendChild(es);
    const Tl = () => {
      const u = es.querySelector(".tp-rotv_b");
      if (!u || u.__hkDragWired) return;
      u.__hkDragWired = true, u.style.cursor = "move", u.style.userSelect = "none";
      let g = false, w = 0, m = 0, v = 0, E = 0;
      u.addEventListener("mousedown", (k) => {
        g = true, w = k.clientX, m = k.clientY;
        const M = es.getBoundingClientRect();
        v = M.left, E = M.top, es.style.transform = "none", es.style.left = `${v}px`, es.style.top = `${E}px`, k.preventDefault();
      }), window.addEventListener("mousemove", (k) => {
        if (!g) return;
        const M = k.clientX - w, $ = k.clientY - m, I = Math.max(0, Math.min(window.innerWidth - 80, v + M)), T = Math.max(0, Math.min(window.innerHeight - 40, E + $));
        es.style.left = `${I}px`, es.style.top = `${T}px`;
      }), window.addEventListener("mouseup", () => {
        if (g) {
          g = false;
          try {
            localStorage.setItem(sa, JSON.stringify({
              left: parseFloat(es.style.left),
              top: parseFloat(es.style.top)
            }));
          } catch {
          }
        }
      });
    }, fe = {
      Ux: false,
      Uy: false,
      Uz: false,
      Rx: false,
      Ry: false,
      Rz: false,
      Fx: 0,
      Fy: 0,
      Fz: 0,
      Mx: 0,
      My: 0,
      Mz: 0,
      Kx: 0,
      Ky: 0,
      Kz: 0,
      Krx: 0,
      Kry: 0,
      Krz: 0,
      mass: 0,
      diaphragm: "Ninguno",
      section: "W14x84",
      material_frame: "A572 Gr 50",
      A_mod: 1,
      Iz_mod: 1,
      Iy_mod: 1,
      J_mod: 1,
      insertionPoint: "10 \u2014 Centroid",
      beta: 0,
      relMxI: false,
      relMyI: false,
      relMzI: false,
      relMxJ: false,
      relMyJ: false,
      relMzJ: false,
      hinges: "None",
      LKx: 0,
      LKy: 0,
      LKz: 0,
      qx: 0,
      qy: 0,
      qz: 0,
      massPerM: 0,
      shellType: "Mindlin (FSDT)",
      thickness: 0.2,
      material_shell: "Concreto C25",
      surfLoad: 0
    }, kt = {
      dx: 0,
      dy: 0,
      dz: 3,
      copias: 1
    };
    let wt = null;
    const Nt = (u, g, w, m) => {
      window.dispatchEvent(new CustomEvent("hk:property-applied", {
        detail: {
          kind: u,
          ids: g,
          prop: w,
          value: m
        }
      }));
    }, zl = () => {
      var _a3, _b;
      if (wt && (wt.dispose(), wt = null), Ue.size === 0) {
        es.style.display = "none";
        return;
      }
      const u = [
        ...Ue
      ], g = u.filter((N) => N.startsWith("pt:"));
      if (g.length === 1) {
        const N = +g[0].slice(3), L = (_a3 = window.__hekatanManualSupports) == null ? void 0 : _a3.get(N);
        L ? [fe.Ux, fe.Uy, fe.Uz, fe.Rx, fe.Ry, fe.Rz] = L.map(Boolean) : fe.Ux = fe.Uy = fe.Uz = fe.Rx = fe.Ry = fe.Rz = false;
        const Z = (_b = window.__hekatanManualLoads) == null ? void 0 : _b.get(N);
        Z ? [fe.Fx, fe.Fy, fe.Fz, fe.Mx, fe.My, fe.Mz] = Z : fe.Fx = fe.Fy = fe.Fz = fe.Mx = fe.My = fe.Mz = 0;
      }
      const w = u.filter((N) => N.startsWith("seg:")), m = u.filter((N) => N.startsWith("poly:")), v = u.filter((N) => N.startsWith("aux:")), E = g.length > 0, k = w.length > 0, M = m.length > 0, $ = !E && !k && !M, I = [];
      g.length && I.push(`\u{1F535} ${g.length} nodo(s)`), w.length && I.push(`\u{1F4CF} ${w.length} segmento(s)`), m.length && I.push(`\u25AD ${m.length} \xE1rea(s)`), v.length && I.push(`\u250A ${v.length} aux`);
      const T = `\u{1F3AF} ${Ue.size} item(s) \u2014 ${I.join(", ")}`;
      wt = new sl({
        container: es,
        title: T
      });
      {
        const N = wt.addFolder({
          title: "\u270F\uFE0F Editar \u2014 Replicar / Mover",
          expanded: false
        });
        N.addBinding(kt, "dx", {
          label: "\u0394x (m)",
          step: 0.1
        }), N.addBinding(kt, "dy", {
          label: "\u0394y (m)",
          step: 0.1
        }), N.addBinding(kt, "dz", {
          label: "\u0394z (m)",
          step: 0.1
        }), N.addBinding(kt, "copias", {
          label: "Copias",
          min: 1,
          max: 50,
          step: 1
        }), N.addButton({
          title: "\u29C9 Replicar selecci\xF3n"
        }).on("click", () => {
          var _a4;
          const Z = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, kt.dx, kt.dy, kt.dz, kt.copias);
          ye(Z ? `\u29C9 Replicado \xD7${Z} (\u0394 ${kt.dx},${kt.dy},${kt.dz} m)` : "\u26A0 Nada que replicar \u2014 seleccion\xE1 nodos/frames/\xE1reas");
        }), N.addButton({
          title: "\u21D7 Extruir: nudo \u2192 l\xEDnea, l\xEDnea \u2192 \xE1rea"
        }).on("click", () => {
          var _a4;
          const Z = (_a4 = window.__hekatanExtrudeSelection) == null ? void 0 : _a4.call(window, kt.dx, kt.dy, kt.dz, kt.copias);
          ye(Z && (Z.lineas || Z.areas) ? `\u21D7 Extruido: ${Z.lineas} barra(s), ${Z.areas} pa\xF1o(s) (\u0394 ${kt.dx},${kt.dy},${kt.dz} m \xD7 ${kt.copias})` : "\u26A0 Nada que extruir \u2014 design\xE1 nudos (\u2192 l\xEDneas) o barras (\u2192 \xE1reas)");
        });
        const F = {
          vuelo: 1.5,
          losa: true,
          borde: true,
          ambos: true
        }, L = N.addFolder({
          title: "\u2310 Volado sobre la viga designada",
          expanded: false
        });
        L.addBinding(F, "vuelo", {
          label: "vuelo (m)",
          min: 0.1,
          max: 6,
          step: 0.05
        }), L.addBinding(F, "losa", {
          label: "con pa\xF1o de losa (si no, hueca)"
        }), L.addBinding(F, "borde", {
          label: "con viga de borde"
        }), L.addBinding(F, "ambos", {
          label: "a los dos lados"
        }), L.addButton({
          title: "\u2310 Poner volado (VOL)"
        }).on("click", () => {
          var _a4;
          const Z = (_a4 = window.__hekatanVoladoSelection) == null ? void 0 : _a4.call(window, F.vuelo, {
            losa: F.losa,
            vigaBorde: F.borde,
            lados: F.ambos ? "ambos" : "afuera"
          });
          ye(Z ? `\u2310 Volado de ${F.vuelo} m en ${Z} pa\xF1o(s)` + (F.losa ? " con losa" : " hueco") : "\u26A0 Design\xE1 una VIGA (un segmento) y volv\xE9 a pulsar");
        }), N.addButton({
          title: "\u2192 Mover selecci\xF3n (1 copia, sin duplicar geometr\xEDa base)"
        }).on("click", () => {
          var _a4;
          const Z = (_a4 = window.__hekatanReplicateSelection) == null ? void 0 : _a4.call(window, kt.dx, kt.dy, kt.dz, 1);
          ye(Z ? `\u2192 Copia desplazada \u0394 ${kt.dx},${kt.dy},${kt.dz} m` : "\u26A0 Nada seleccionado");
        });
        const j = N.addFolder({
          title: "\u{1F9F2} Snap",
          expanded: false
        });
        j.addButton({
          title: "Snap a grilla ON/OFF (F9)"
        }).on("click", () => {
          var _a4;
          return (_a4 = window.__hekatanToggleSnap) == null ? void 0 : _a4.call(window);
        }), j.addButton({
          title: "OSNAP (endpoints/medios) ON/OFF"
        }).on("click", () => {
          window.__hekatanOsnapOn = !(window.__hekatanOsnapOn ?? true), ye(`\u{1F9F2} OSNAP ${window.__hekatanOsnapOn ? "ON" : "OFF"}`);
        });
      }
      if (E) {
        const N = wt.addFolder({
          title: `\u{1F4CC} Restraints (DOFs) \u2014 ${g.length} nodo(s)`
        });
        N.addBinding(fe, "Ux"), N.addBinding(fe, "Uy"), N.addBinding(fe, "Uz"), N.addBinding(fe, "Rx"), N.addBinding(fe, "Ry"), N.addBinding(fe, "Rz");
        const F = (z, B) => {
          [fe.Ux, fe.Uy, fe.Uz, fe.Rx, fe.Ry, fe.Rz] = z;
          try {
            wt.refresh();
          } catch {
          }
          Nt("nodes", g, "supports", z), ye(`\u2713 ${B}: ${g.length} nudo(s) apoyado(s) (${z.map((Y, ee) => Y ? [
            "Ux",
            "Uy",
            "Uz",
            "Rx",
            "Ry",
            "Rz"
          ][ee] : "").filter(Boolean).join(" ")}).`);
        };
        N.addButton({
          title: `\u25B2 Empotrar los ${g.length} nudo(s) (6 GDL)`
        }).on("click", () => F([
          true,
          true,
          true,
          true,
          true,
          true
        ], "Empotrado")), N.addButton({
          title: `\u25B3 Articular los ${g.length} nudo(s) (Ux Uy Uz)`
        }).on("click", () => F([
          true,
          true,
          true,
          false,
          false,
          false
        ], "Articulado"));
        const L = wt.addFolder({
          title: "\u{1F300} Springs (kN/m, kN\xB7m/rad)",
          expanded: false
        });
        L.addBinding(fe, "Kx", {
          label: "Kx",
          min: 0,
          step: 100
        }), L.addBinding(fe, "Ky", {
          label: "Ky",
          min: 0,
          step: 100
        }), L.addBinding(fe, "Kz", {
          label: "Kz",
          min: 0,
          step: 100
        }), L.addBinding(fe, "Krx", {
          label: "Krx",
          min: 0,
          step: 1e3
        }), L.addBinding(fe, "Kry", {
          label: "Kry",
          min: 0,
          step: 1e3
        }), L.addBinding(fe, "Krz", {
          label: "Krz",
          min: 0,
          step: 1e3
        });
        const j = wt.addFolder({
          title: "\u2B07 Joint Loads (kN, kN\xB7m)"
        });
        j.addBinding(fe, "Fx", {
          step: 0.1
        }), j.addBinding(fe, "Fy", {
          step: 0.1
        }), j.addBinding(fe, "Fz", {
          step: 0.1
        }), j.addBinding(fe, "Mx", {
          step: 0.1
        }), j.addBinding(fe, "My", {
          step: 0.1
        }), j.addBinding(fe, "Mz", {
          step: 0.1
        }), wt.addFolder({
          title: "\u2696 Additional Mass (kg)",
          expanded: false
        }).addBinding(fe, "mass", {
          label: "m",
          min: 0,
          step: 1
        }), wt.addFolder({
          title: "\u{1F517} Diaphragm (rigid link)",
          expanded: false
        }).addBinding(fe, "diaphragm", {
          label: "Diafragma",
          options: {
            Ninguno: "Ninguno",
            "D1 (rigid)": "D1 (rigid)",
            "D2 (rigid)": "D2 (rigid)",
            "D3 (rigid)": "D3 (rigid)"
          }
        }), wt.addButton({
          title: `\u2713 Aplicar a ${g.length} nodo(s) seleccionado(s)`
        }).on("click", () => {
          let z = 0;
          const B = [
            fe.Ux,
            fe.Uy,
            fe.Uz,
            fe.Rx,
            fe.Ry,
            fe.Rz
          ];
          B.some((K) => K) && (Nt("nodes", g, "supports", B), z++);
          const Y = [
            fe.Fx,
            fe.Fy,
            fe.Fz,
            fe.Mx,
            fe.My,
            fe.Mz
          ];
          Y.some((K) => K !== 0) && (Nt("nodes", g, "loads", Y), z++);
          const ee = [
            fe.Kx,
            fe.Ky,
            fe.Kz,
            fe.Krx,
            fe.Kry,
            fe.Krz
          ];
          if (ee.some((K) => K !== 0) && (Nt("nodes", g, "springs", ee), z++), fe.mass !== 0 && (Nt("nodes", g, "mass", fe.mass), z++), fe.diaphragm !== "Ninguno" && (Nt("nodes", g, "diaphragm", fe.diaphragm), z++), z === 0) {
            ye("\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para apoyo, o un valor de carga/resorte/masa, y volv\xE9 a aplicar.");
            let K = document.getElementById("hk-prop-toast");
            K || (K = document.createElement("div"), K.id = "hk-prop-toast", K.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)", document.body.appendChild(K)), K.textContent = "\u26A0 Nada que aplicar \u2014 marc\xE1 un DOF (Ux\u2026Rz) para empotrado/articulado, despu\xE9s Aplicar", K.style.background = "rgba(217,119,6,0.97)", K.style.opacity = "1", clearTimeout(window.__hekatanPropToastT), window.__hekatanPropToastT = setTimeout(() => {
              K && (K.style.opacity = "0");
            }, 3200);
          } else ye(`\u2713 Propiedades aplicadas a ${g.length} nodo(s)`);
        });
      }
      if (k) {
        const N = wt.addFolder({
          title: `\u{1F4CF} Secci\xF3n frame \u2014 ${w.length} seg(s)`
        });
        N.addBinding(fe, "section", {
          label: "Secci\xF3n",
          options: {
            W14x84: "W14x84",
            W18x86: "W18x86",
            W24x146: "W24x146",
            HEB300: "HEB300",
            IPN300: "IPN300",
            IPE400: "IPE400",
            "Custom...": "Custom..."
          }
        }), N.addBinding(fe, "material_frame", {
          label: "Material",
          options: {
            "A572 Gr 50": "A572 Gr 50",
            A36: "A36",
            A992: "A992",
            "Concreto C25": "Concreto C25"
          }
        });
        const F = wt.addFolder({
          title: "\u{1F527} Property Modifiers",
          expanded: false
        });
        F.addBinding(fe, "A_mod", {
          label: "A mod",
          min: 0,
          max: 10,
          step: 0.1
        }), F.addBinding(fe, "Iz_mod", {
          label: "Iz mod (fuerte)",
          min: 0,
          max: 10,
          step: 0.1
        }), F.addBinding(fe, "Iy_mod", {
          label: "Iy mod (d\xE9bil)",
          min: 0,
          max: 10,
          step: 0.1
        }), F.addBinding(fe, "J_mod", {
          label: "J mod",
          min: 0,
          max: 10,
          step: 0.1
        }), wt.addFolder({
          title: "\u{1F3AF} Insertion Point",
          expanded: false
        }).addBinding(fe, "insertionPoint", {
          label: "Cardinal",
          options: {
            "1 \u2014 Bottom Left": "1 \u2014 Bottom Left",
            "2 \u2014 Bottom Center": "2 \u2014 Bottom Center",
            "3 \u2014 Bottom Right": "3 \u2014 Bottom Right",
            "4 \u2014 Middle Left": "4 \u2014 Middle Left",
            "5 \u2014 Middle Center": "5 \u2014 Middle Center",
            "6 \u2014 Middle Right": "6 \u2014 Middle Right",
            "7 \u2014 Top Left": "7 \u2014 Top Left",
            "8 \u2014 Top Center": "8 \u2014 Top Center",
            "9 \u2014 Top Right": "9 \u2014 Top Right",
            "10 \u2014 Centroid": "10 \u2014 Centroid",
            "11 \u2014 Shear Center": "11 \u2014 Shear Center"
          }
        }), wt.addFolder({
          title: "\u{1F9ED} Local Axes",
          expanded: false
        }).addBinding(fe, "beta", {
          label: "\u03B2 (\xB0)",
          min: -180,
          max: 180,
          step: 5
        });
        const Z = wt.addFolder({
          title: "\u{1F513} Releases extremo I",
          expanded: false
        });
        Z.addBinding(fe, "relMxI", {
          label: "Mx I"
        }), Z.addBinding(fe, "relMyI", {
          label: "My I"
        }), Z.addBinding(fe, "relMzI", {
          label: "Mz I"
        });
        const O = wt.addFolder({
          title: "\u{1F513} Releases extremo J",
          expanded: false
        });
        O.addBinding(fe, "relMxJ", {
          label: "Mx J"
        }), O.addBinding(fe, "relMyJ", {
          label: "My J"
        }), O.addBinding(fe, "relMzJ", {
          label: "Mz J"
        }), wt.addFolder({
          title: "\u{1FA79} Hinges (plastic)",
          expanded: false
        }).addBinding(fe, "hinges", {
          label: "Tipo",
          options: {
            None: "None",
            "Auto-FEMA M3": "Auto-FEMA M3",
            "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3",
            "Auto-Concrete M3": "Auto-Concrete M3",
            "Auto-Steel M3": "Auto-Steel M3",
            "Custom...": "Custom..."
          }
        });
        const B = wt.addFolder({
          title: "\u{1F300} Line Springs (kN/m por m)",
          expanded: false
        });
        B.addBinding(fe, "LKx", {
          label: "LKx",
          min: 0,
          step: 100
        }), B.addBinding(fe, "LKy", {
          label: "LKy",
          min: 0,
          step: 100
        }), B.addBinding(fe, "LKz", {
          label: "LKz",
          min: 0,
          step: 100
        });
        const Y = wt.addFolder({
          title: "\u2B07 Frame Loads (kN/m)"
        });
        Y.addBinding(fe, "qx", {
          step: 0.1
        }), Y.addBinding(fe, "qy", {
          step: 0.1
        }), Y.addBinding(fe, "qz", {
          step: 0.1
        }), wt.addFolder({
          title: "\u2696 Additional Mass (kg/m)",
          expanded: false
        }).addBinding(fe, "massPerM", {
          label: "m/L",
          min: 0,
          step: 1
        }), wt.addButton({
          title: "\u2713 Aplicar a segmentos seleccionados"
        }).on("click", () => {
          Nt("segs", w, "section", fe.section), Nt("segs", w, "material", fe.material_frame);
          const K = {
            A: fe.A_mod,
            Iz: fe.Iz_mod,
            Iy: fe.Iy_mod,
            J: fe.J_mod
          };
          (K.A !== 1 || K.Iz !== 1 || K.Iy !== 1 || K.J !== 1) && Nt("segs", w, "modifiers", K), fe.insertionPoint !== "10 \u2014 Centroid" && Nt("segs", w, "insertionPoint", fe.insertionPoint), fe.beta !== 0 && Nt("segs", w, "beta", fe.beta);
          const J = [
            fe.relMxI,
            fe.relMyI,
            fe.relMzI
          ], se = [
            fe.relMxJ,
            fe.relMyJ,
            fe.relMzJ
          ];
          (J.some((de) => de) || se.some((de) => de)) && Nt("segs", w, "releases", {
            i: J,
            j: se
          }), fe.hinges !== "None" && Nt("segs", w, "hinges", fe.hinges);
          const oe = [
            fe.LKx,
            fe.LKy,
            fe.LKz
          ];
          oe.some((de) => de !== 0) && Nt("segs", w, "lineSprings", oe);
          const ne = [
            fe.qx,
            fe.qy,
            fe.qz
          ];
          ne.some((de) => de !== 0) && Nt("segs", w, "distLoad", ne), fe.massPerM !== 0 && Nt("segs", w, "massPerM", fe.massPerM), ye(`\u2713 Propiedades aplicadas a ${w.length} segmento(s)`);
        });
      }
      if (M) {
        const N = wt.addFolder({
          title: `\u25AD Shell / \xC1rea \u2014 ${m.length}`
        });
        N.addBinding(fe, "shellType", {
          label: "Tipo",
          options: {
            "Mindlin (FSDT)": "Mindlin (FSDT)",
            "Kirchhoff (CPT)": "Kirchhoff (CPT)",
            "Plane stress": "Plane stress"
          }
        }), N.addBinding(fe, "thickness", {
          label: "Espesor (m)",
          min: 0.01,
          step: 0.01
        }), N.addBinding(fe, "material_shell", {
          label: "Material",
          options: {
            "Concreto C20": "Concreto C20",
            "Concreto C25": "Concreto C25",
            "Concreto C30": "Concreto C30",
            "Acero A36": "Acero A36"
          }
        }), wt.addFolder({
          title: "\u2B07 Carga superficial (kN/m\xB2)"
        }).addBinding(fe, "surfLoad", {
          label: "q",
          step: 0.1
        }), wt.addButton({
          title: "\u2713 Aplicar a \xE1reas seleccionadas"
        }).on("click", () => {
          Nt("areas", m, "shellType", fe.shellType), Nt("areas", m, "thickness", fe.thickness), Nt("areas", m, "material", fe.material_shell), fe.surfLoad !== 0 && Nt("areas", m, "surfLoad", fe.surfLoad), ye(`\u2713 Propiedades aplicadas a ${m.length} \xE1rea(s)/shell(s)`);
        });
      }
      if ($) {
        const N = wt.addFolder({
          title: "\u2139 Selecci\xF3n"
        }), F = {
          msg: "Seleccion\xE1 nodos, frames o \xE1reas para editar"
        };
        N.addBinding(F, "msg", {
          readonly: true,
          label: "Qu\xE9 hacer"
        });
      }
      wt.addButton({
        title: "\u2715 Cerrar (limpia selecci\xF3n)"
      }).on("click", () => {
        Ue.clear(), hs();
      }), es.style.display = "block", Tl();
    };
    window.__hekatanRefreshPropsPane = zl;
    let gn = null, ui = false;
    a.addEventListener("pointerdown", (u) => {
      u.button === 2 && (gn = {
        x: u.clientX,
        y: u.clientY
      }, ui = false);
    }), a.addEventListener("pointermove", (u) => {
      if (gn && u.buttons & 2 && !ui) {
        const g = u.clientX - gn.x, w = u.clientY - gn.y;
        Math.hypot(g, w) > 8 && (ui = true);
      }
    }), a.addEventListener("pointerup", (u) => {
      var _a3, _b, _c2;
      if (u.button === 2) {
        const g = gn !== null && !ui;
        gn = null;
        const w = window.__hekatanRClickOnElement === true;
        if (window.__hekatanRClickOnElement = false, w) return;
        if (g) {
          if (ts ? hi() : window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true
          })), Ue.size > 0 && (Ue.clear(), hs()), l.polylines) {
            const E = l.polylines.rawVal;
            (E[E.length - 1] ?? []).length > 0 && (l.polylines.val = [
              ...E,
              []
            ]);
          }
          const m = window.__hekatanCadState, v = (_b = (_a3 = m == null ? void 0 : m.get) == null ? void 0 : _a3.call(m)) == null ? void 0 : _b.tool;
          v && v !== "select" && v !== "none" ? ((_c2 = m == null ? void 0 : m.setTool) == null ? void 0 : _c2.call(m, "select"), ye(`\u238B Cancelado \u2014 tool '${v}' cerrado, volv\xE9s a Seleccionar`)) : ye("\u238B Cancelado (click derecho)");
        }
      }
    }), a.addEventListener("contextmenu", (u) => {
      u.preventDefault(), u.stopPropagation();
    }, {
      capture: true
    }), a.addEventListener("pointerdown", (u) => {
      var _a3, _b, _c2;
      const g = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select";
      g !== "select" && g !== "none" && g || u.button === 0 && (window.__hekatanBloquearVentana || u.pointerType !== "touch" && (ps = null, zn = false));
    }), a.addEventListener("pointermove", (u) => {
      if (ts && u.buttons === 0) {
        const E = u.clientX < ts.x;
        Ji(ts.x, ts.y, u.clientX, u.clientY, E);
        return;
      }
      if (!ps) return;
      const g = u.clientX - ps.x, w = u.clientY - ps.y, m = Math.hypot(g, w);
      if (!zn && m < 8) return;
      zn = true;
      const v = u.clientX < ps.x;
      Ji(ps.x, ps.y, u.clientX, u.clientY, v);
    }), a.addEventListener("pointerup", (u) => {
      if (!ps) return;
      if (!zn) {
        ps = null;
        return;
      }
      const g = u.ctrlKey || u.metaKey || u.shiftKey;
      ta(ps.x, ps.y, u.clientX, u.clientY, g), ps = null, zn = false;
    }), window.__hekatanOsnap = window.__hekatanOsnap ?? {
      end: true,
      mid: true,
      node: true,
      cen: true,
      per: false,
      nea: false,
      int: true,
      ori: true,
      grid: true
    };
    const ls = new ft();
    ls.visible = false, ls.frustumCulled = false, t.add(ls);
    const na = {
      end: 16724804,
      mid: 16498468,
      node: 6333946,
      cen: 3462041,
      per: 12616956,
      nea: 16744118,
      int: 16746496,
      ori: 16777215,
      grid: 2282478,
      track: 16761856,
      ifc: 16096779,
      ifcAxis: 16639626,
      ifcSec: 16486972,
      ifcEdge: 16498468,
      ifcVert: 16724804
    }, pi = (u, g, w, m) => {
      var _a3, _b, _c2, _d2;
      for (; ls.children.length; ) {
        const k = ls.children.pop();
        (_b = (_a3 = k.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d2 = (_c2 = k.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d2.call(_c2);
      }
      const v = na[u] ?? 16777215, E = new Fe().setFromPoints([
        new te(-1, -1, 0),
        new te(1, -1, 0),
        new te(1, -1, 0),
        new te(1, 1, 0),
        new te(1, 1, 0),
        new te(-1, 1, 0),
        new te(-1, 1, 0),
        new te(-1, -1, 0)
      ]);
      ls.add(new is(E, new mt({
        color: v,
        linewidth: 2
      }))), ls.position.set(g, w, m), ls.visible = true, to();
    };
    let eo = 4;
    const to = () => {
      ls.visible && ls.scale.setScalar(eo * di(ls.position));
    };
    window.__hekatanOsnapMarkerRef = ls, window.__hekatanUpdateOsnapScale = to, window.__hekatanOsnapPx = (u) => (typeof u == "number" && u > 0 && (eo = u, to(), r()), eo);
    const fi = () => {
      ls.visible = false;
    }, Il = {
      ori: "Origen (0,0,0)",
      grid: "Cruce de rejilla",
      end: "Punto final",
      track: "Alineado con un nudo",
      node: "Nudo",
      mid: "Punto medio",
      cen: "Centro",
      int: "Intersecci\xF3n",
      per: "Perpendicular",
      nea: "Cercano",
      ifc: "Referencia IFC \xB7 cara",
      ifcAxis: "Referencia IFC \xB7 eje",
      ifcSec: "Secci\xF3n IFC (corte)",
      ifcEdge: "Borde IFC",
      ifcVert: "V\xE9rtice IFC"
    }, ks = document.createElement("div");
    ks.id = "hk-osnap-etiqueta", ks.style.cssText = [
      "position:fixed",
      "z-index:99995",
      "display:none",
      "pointer-events:none",
      "padding:2px 7px",
      "border-radius:4px",
      "white-space:nowrap",
      "background:rgba(15,23,42,0.92)",
      "border:1px solid rgba(148,163,184,.45)",
      "color:#e2e8f0",
      "font:12px Consolas,monospace"
    ].join(";") + ";", document.body.appendChild(ks);
    const mi = (u, g, w) => {
      const m = Il[u];
      if (!m) {
        ks.style.display = "none";
        return;
      }
      ks.textContent = m, ks.style.color = "#" + (na[u] ?? 16777215).toString(16).padStart(6, "0"), ks.style.left = g + 18 + "px", ks.style.top = w - 26 + "px", ks.style.display = "block";
    }, Fl = () => {
      ks.style.display = "none";
    }, Zs = new te(), Ks = (u, g, w) => {
      const m = s();
      if (!m) return null;
      const v = a.getBoundingClientRect();
      return Zs.set(u, g, w).project(m), !isFinite(Zs.x) || !isFinite(Zs.y) || Zs.z < -1 || Zs.z > 1 ? null : {
        x: v.left + (Zs.x * 0.5 + 0.5) * v.width,
        y: v.top + (-Zs.y * 0.5 + 0.5) * v.height
      };
    };
    window.__hekatanAPixeles = Ks;
    const Pl = (u, g, w, m, v) => {
      var _a3, _b, _c2, _d2, _e2, _f, _g, _h;
      if (window.__hekatanOsnapOn === false) return null;
      const E = window.__hekatanOsnap, k = l.points.rawVal, M = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [];
      let $ = null;
      const I = {
        ori: 0,
        end: 0,
        node: 0,
        int: 1,
        grid: 2,
        mid: 2,
        cen: 3,
        per: 4,
        nea: 5
      }, T = v, N = (z, B, Y, ee) => {
        let K;
        if (T) {
          const se = Ks(B, Y, ee);
          if (!se || (K = Math.hypot(se.x - T.x, se.y - T.y), K > Rs)) return;
        } else if (K = Math.hypot(B - u, Y - g, ee - w), K > m) return;
        const J = I[z] ?? 9;
        (!$ || J < $.r || J === $.r && K < $.d) && ($ = {
          type: z,
          x: B,
          y: Y,
          z: ee,
          d: K,
          r: J
        });
      };
      if (E.ori !== false && N("ori", 0, 0, 0), E.grid !== false && window.__hekatanSnapEnabled === true) {
        const z = window.__hekatanGridConfig, B = (z == null ? void 0 : z.minorStep) && z.minorStep > 0 ? z.minorStep : 1, Y = ((z == null ? void 0 : z.gridSize) ?? 30) / 2, ee = ((_d2 = (_c2 = (_b = window.__hekatanCadState) == null ? void 0 : _b.get) == null ? void 0 : _c2.call(_b)) == null ? void 0 : _d2.workPlane) ?? "xy", K = (se) => Math.round(se / B) * B, J = (se, oe) => Math.abs(se) <= Y + 1e-9 && Math.abs(oe) <= Y + 1e-9;
        if (ee === "xz") {
          const se = K(u), oe = K(w);
          J(se, oe) && N("grid", se, g, oe);
        } else if (ee === "yz") {
          const se = K(g), oe = K(w);
          J(se, oe) && N("grid", u, se, oe);
        } else {
          const se = K(u), oe = K(g);
          J(se, oe) && N("grid", se, oe, w);
        }
      }
      (E.node || E.end) && k.forEach((z) => {
        E.node && N("node", z[0], z[1], z[2]);
      });
      for (const z of M) if (!(z.length < 2)) for (let B = 0; B < z.length - 1; B++) {
        const Y = k[z[B]], ee = k[z[B + 1]];
        if (!(!Y || !ee) && (E.end && (N("end", Y[0], Y[1], Y[2]), N("end", ee[0], ee[1], ee[2])), E.mid && N("mid", (Y[0] + ee[0]) / 2, (Y[1] + ee[1]) / 2, (Y[2] + ee[2]) / 2), E.nea || E.per)) {
          const K = ee[0] - Y[0], J = ee[1] - Y[1], se = ee[2] - Y[2], oe = K * K + J * J + se * se;
          if (oe < 1e-12) continue;
          const ne = Math.max(0, Math.min(1, ((u - Y[0]) * K + (g - Y[1]) * J + (w - Y[2]) * se) / oe)), de = Y[0] + ne * K, me = Y[1] + ne * J, ke = Y[2] + ne * se;
          E.nea && N("nea", de, me, ke), E.per && N("per", de, me, ke);
        }
      }
      if (E.cen) {
        const z = ((_e2 = l.areas) == null ? void 0 : _e2.rawVal) ?? [];
        for (const B of z) {
          const Y = M[B];
          if (!Y || Y.length < 3) continue;
          const ee = Y[0] === Y[Y.length - 1] ? Y.slice(0, -1) : Y;
          let K = 0, J = 0, se = 0, oe = 0;
          for (const ne of ee) {
            const de = k[ne];
            de && (K += de[0], J += de[1], se += de[2], oe++);
          }
          oe >= 3 && N("cen", K / oe, J / oe, se / oe);
        }
      }
      if (E.cen) {
        const z = Zo(), B = [
          ...ai
        ];
        for (const Y of z) B.some((ee) => Math.hypot(ee.c[0] - Y.c[0], ee.c[1] - Y.c[1], ee.c[2] - Y.c[2]) < 1e-6 && Math.abs(ee.r - Y.r) < 1e-6) || B.push(Y);
        for (const Y of B) {
          if (!k.some((J) => Math.abs(Math.hypot(J[0] - Y.c[0], J[1] - Y.c[1], J[2] - Y.c[2]) - Y.r) < 1e-6)) continue;
          const K = Math.hypot(u - Y.c[0], g - Y.c[1], w - Y.c[2]);
          if (K < m || Math.abs(K - Y.r) < m) {
            const J = Math.min(K, m * 0.5), se = 3;
            (!$ || se < $.r || se === $.r && J < $.d) && ($ = {
              type: "cen",
              x: Y.c[0],
              y: Y.c[1],
              z: Y.c[2],
              d: J,
              r: se
            });
          }
        }
      }
      if (E.int) {
        const z = [];
        for (const B of M) for (let Y = 0; Y < B.length - 1; Y++) {
          const ee = k[B[Y]], K = k[B[Y + 1]];
          if (!ee || !K) continue;
          const J = K[0] - ee[0], se = K[1] - ee[1], oe = K[2] - ee[2], ne = J * J + se * se + oe * oe;
          if (ne < 1e-12) continue;
          const de = Math.max(0, Math.min(1, ((u - ee[0]) * J + (g - ee[1]) * se + (w - ee[2]) * oe) / ne));
          Math.hypot(ee[0] + de * J - u, ee[1] + de * se - g, ee[2] + de * oe - w) < 3 * m && z.push([
            ee,
            K
          ]);
        }
        for (let B = 0; B < z.length; B++) for (let Y = B + 1; Y < z.length; Y++) {
          const [ee, K] = z[B], [J, se] = z[Y], oe = [
            K[0] - ee[0],
            K[1] - ee[1],
            K[2] - ee[2]
          ], ne = [
            se[0] - J[0],
            se[1] - J[1],
            se[2] - J[2]
          ], de = [
            ee[0] - J[0],
            ee[1] - J[1],
            ee[2] - J[2]
          ], me = oe[0] * oe[0] + oe[1] * oe[1] + oe[2] * oe[2], ke = oe[0] * ne[0] + oe[1] * ne[1] + oe[2] * ne[2], Te = ne[0] * ne[0] + ne[1] * ne[1] + ne[2] * ne[2], it = oe[0] * de[0] + oe[1] * de[1] + oe[2] * de[2], We = ne[0] * de[0] + ne[1] * de[1] + ne[2] * de[2], tt = me * Te - ke * ke;
          if (tt < 1e-12) continue;
          const Le = (ke * We - Te * it) / tt, Je = (me * We - ke * it) / tt;
          if (Le < -1e-6 || Le > 1 + 1e-6 || Je < -1e-6 || Je > 1 + 1e-6) continue;
          const He = [
            ee[0] + Le * oe[0],
            ee[1] + Le * oe[1],
            ee[2] + Le * oe[2]
          ], Re = [
            J[0] + Je * ne[0],
            J[1] + Je * ne[1],
            J[2] + Je * ne[2]
          ];
          if (Math.hypot(He[0] - Re[0], He[1] - Re[1], He[2] - Re[2]) > 1e-4) continue;
          [
            ee,
            K,
            J,
            se
          ].some((Ze) => Math.hypot(Ze[0] - He[0], Ze[1] - He[1], Ze[2] - He[2]) < 1e-6) || N("int", He[0], He[1], He[2]);
        }
      }
      const F = window.__hekatanAxisGrids ?? [], L = window.__hekatanLevels ?? [], j = F.filter((z) => z && z.start && z.end).map((z) => [
        z.start,
        z.end
      ]);
      for (const [z, B] of j) {
        E.end && (N("end", z[0], z[1], z[2]), N("end", B[0], B[1], B[2]));
        const Y = B[0] - z[0], ee = B[1] - z[1], K = B[2] - z[2], J = Y * Y + ee * ee + K * K;
        if (J < 1e-12) continue;
        const se = Math.max(0, Math.min(1, ((u - z[0]) * Y + (g - z[1]) * ee + (w - z[2]) * K) / J));
        if (E.nea && N("nea", z[0] + se * Y, z[1] + se * ee, z[2] + se * K), E.int && Math.abs(K) > 1e-9) for (const oe of L) {
          const ne = (oe.z - z[2]) / K;
          ne < -1e-6 || ne > 1 + 1e-6 || N("int", z[0] + ne * Y, z[1] + ne * ee, oe.z);
        }
      }
      if (E.int || E.node) for (let z = 0; z < j.length; z++) for (let B = z + 1; B < j.length; B++) {
        const [Y, ee] = j[z], [K, J] = j[B], se = ee[0] - Y[0], oe = ee[1] - Y[1], ne = J[0] - K[0], de = J[1] - K[1], me = se * de - oe * ne;
        if (Math.abs(me) < 1e-12) continue;
        const ke = Y[0] - K[0], Te = Y[1] - K[1], it = (ne * Te - de * ke) / me, We = (se * Te - oe * ke) / me;
        if (it < -1e-6 || it > 1 + 1e-6 || We < -1e-6 || We > 1 + 1e-6) continue;
        const tt = (_h = (_g = (_f = window.__hekatanCadState) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f)) == null ? void 0 : _h.workZ;
        N("int", Y[0] + it * se, Y[1] + it * oe, typeof tt == "number" ? tt : w);
      }
      const Z = window.__hekatanDrawingAuxLines, O = (Z == null ? void 0 : Z.rawVal) ?? (Z == null ? void 0 : Z.val) ?? Z ?? [];
      for (const z of O) {
        if (z.length !== 6) continue;
        const B = [
          z[0],
          z[1],
          z[2]
        ], Y = [
          z[3],
          z[4],
          z[5]
        ];
        if (E.end && (N("end", B[0], B[1], B[2]), N("end", Y[0], Y[1], Y[2])), E.mid && N("mid", (B[0] + Y[0]) / 2, (B[1] + Y[1]) / 2, (B[2] + Y[2]) / 2), E.nea || E.per) {
          const ee = Y[0] - B[0], K = Y[1] - B[1], J = Y[2] - B[2], se = ee * ee + K * K + J * J;
          if (se < 1e-12) continue;
          const oe = Math.max(0, Math.min(1, ((u - B[0]) * ee + (g - B[1]) * K + (w - B[2]) * J) / se)), ne = B[0] + oe * ee, de = B[1] + oe * K, me = B[2] + oe * J;
          E.nea && N("nea", ne, de, me), E.per && N("per", ne, de, me);
        }
      }
      return $ ? {
        type: $.type,
        x: $.x,
        y: $.y,
        z: $.z
      } : null;
    }, yn = new ft();
    yn.frustumCulled = false, t.add(yn);
    const ia = new mt({
      color: 15123555,
      transparent: true,
      opacity: 1,
      depthTest: false
    });
    let oa = 0;
    const aa = () => {
      var _a3, _b;
      for (const u of yn.children.slice()) yn.remove(u), (_b = (_a3 = u.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3);
    };
    window.__hekatanDestello = (u) => {
      var _a3, _b;
      aa();
      const g = ((_a3 = l.points) == null ? void 0 : _a3.rawVal) ?? [], w = ((_b = l.polylines) == null ? void 0 : _b.rawVal) ?? [];
      for (const v of u || []) {
        const E = String(v).split(":");
        let k = [];
        if (E[0] === "pt") {
          const I = g[+E[1]];
          I && (k = [
            I,
            [
              I[0] + 1e-3,
              I[1],
              I[2]
            ]
          ]);
        } else if (E[0] === "seg") {
          const I = w[+E[1]] || [], T = g[I[+E[2]]], N = g[I[+E[2] + 1]];
          T && N && (k = [
            T,
            N
          ]);
        } else E[0] === "poly" && (k = (w[+E[1]] || []).map((T) => g[T]).filter(Boolean));
        if (k.length < 2) continue;
        const M = new Fe().setFromPoints(k.map((I) => new te(I[0], I[1], I[2]))), $ = new Vt(M, ia);
        $.renderOrder = 1200, yn.add($);
      }
      if (!yn.children.length) return;
      oa = performance.now() + 900;
      const m = () => {
        const v = oa - performance.now();
        if (v <= 0) {
          aa(), r();
          return;
        }
        ia.opacity = Math.min(1, v / 900) * 0.95, r(), requestAnimationFrame(m);
      };
      requestAnimationFrame(m);
    }, window.addEventListener("hk:property-applied", (u) => {
      var _a3;
      const g = (_a3 = u == null ? void 0 : u.detail) == null ? void 0 : _a3.ids;
      Array.isArray(g) && g.length && window.__hekatanDestello(g);
    }), window.__hekatanOsnapCompute = Pl, window.__hekatanOsnapShow = pi, window.__hekatanOsnapHide = fi;
    let qe = [], It = 0, Gs = 0, jt = null;
    const Ds = document.createElement("div");
    Ds.id = "hk-cad-status", Ds.style.cssText = [
      "position:fixed",
      "bottom:8px",
      "left:50%",
      "transform:translateX(-50%)",
      "padding:6px 14px",
      "background:rgba(15, 23, 42, 0.92)",
      "color:#22d3ee",
      "border:1px solid rgba(34, 211, 238, 0.5)",
      "border-radius:6px",
      "font-family:Consolas, monospace",
      "font-size:12px",
      "z-index:90",
      "pointer-events:none",
      "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)",
      "max-width:90vw",
      "white-space:nowrap",
      "overflow:hidden",
      "text-overflow:ellipsis"
    ].join(";") + ";", Ds.textContent = "\u{1F6E0} CAD listo \u2014 seleccion\xE1 un tool. Inputs: 5 (DDE) \xB7 5,3,2 (abs) \xB7 @5,3,2 (rel) \xB7 @5<45 (polar) \xB7 @5<45<30 (esf\xE9rico) + Enter", document.body.appendChild(Ds);
    const Fn = () => {
      const u = document.getElementById("hk3-cmdline");
      if (!u) {
        Ds.style.bottom = "8px";
        return;
      }
      const g = u.getBoundingClientRect();
      if (g.height <= 0) {
        Ds.style.bottom = "8px";
        return;
      }
      const w = Math.max(0, window.innerHeight - g.top);
      Ds.style.bottom = Math.round(w + 8) + "px";
    };
    Fn(), window.addEventListener("resize", Fn), setTimeout(Fn, 500), setTimeout(Fn, 2e3), setTimeout(Fn, 5e3);
    const Rl = () => {
      var _a3, _b, _c2;
      const u = [];
      window.__hekatanOrthoMode && u.push("\u22A5 ORTO ON (F8)"), zt && u.push(`\u{1F512} LOCK ${zt.toUpperCase()}`);
      const w = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.workZ) ?? 0;
      return Math.abs(w) > 1e-3 && u.push(`Cota Z=${w}m`), window.__hekatanShowOrthoPlanes !== false && u.push("\u25A6 Planos XY/XZ/YZ"), u.length > 0 ? `   |   ${u.join("  \xB7  ")}` : "";
    }, ye = (u) => {
      var _a3;
      const g = u + Rl();
      Ds.textContent = g, window.__hekatanCadStatusText = g;
      try {
        (_a3 = window.__hekatanCadEcho) == null ? void 0 : _a3.call(window, u);
      } catch {
      }
    }, Dl = "Comando:", Ll = () => {
      var _a3, _b, _c2, _d2;
      const u = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select", g = ((_d2 = l.polylines) == null ? void 0 : _d2.rawVal) ?? [], w = g.length ? g[g.length - 1] : [], m = qe.length, v = (E, k = []) => ({
        txt: E,
        ops: k
      });
      switch (u) {
        case "line":
          return w.length >= 2 ? v("L\xCDNEA Precise punto siguiente o", [
            "Cerrar",
            "desHacer"
          ]) : w.length === 1 ? v("L\xCDNEA Precise punto siguiente o", [
            "desHacer"
          ]) : v("L\xCDNEA Precise primer punto:");
        case "polyline":
          return w.length >= 2 ? v("POLIL\xCDNEA Precise punto siguiente o", [
            "Cerrar",
            "desHacer"
          ]) : w.length === 1 ? v("POLIL\xCDNEA Precise punto siguiente o", [
            "desHacer"
          ]) : v("POLIL\xCDNEA Precise punto inicial:");
        case "node":
          return v("NUDO Precise punto:");
        case "area":
          return v(`LOSA Precise v\xE9rtice ${Math.min(w.length + 1, 4)} de 4 (en orden, antihorario):`);
        case "rectarea":
          return v(m ? "LOSA RECTANGULAR Precise otra esquina:" : "LOSA RECTANGULAR Precise primera esquina:");
        case "polyarea":
          return v(`\xC1REA LIBRE Precise v\xE9rtice ${rt.length + 1} (Enter o clic derecho cierra y malla):`);
        case "fillarea":
          return v("RELLENAR \xC1REA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el \xE1rea:");
        case "medir":
          return v(`REGLA ${Ge.length === 1 ? "Marque el 2\xBA punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
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
          return v(jt ? "ALARGAR Designe la l\xEDnea a alargar, cerca del extremo libre:" : "ALARGAR Designe el contorno hasta el que alargar:");
        case "trim":
          return v(jt ? "RECORTAR Designe el trozo de l\xEDnea a quitar:" : "RECORTAR Designe el contorno de corte:");
        case "offset":
          return v(jt ? "DESFASE Precise el lado hacia el que va la copia:" : `DESFASE Designe la l\xEDnea a desfasar${Gs > 0 ? ` (distancia ${Gs} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`);
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
          return v(Dl);
      }
    }, ss = () => {
      var _a3, _b, _c2, _d2, _e2;
      try {
        const u = Ll(), g = ((_c2 = ((_a3 = window.__hekatanAxisGrids) == null ? void 0 : _a3.rawVal) ?? ((_b = window.__hekatanAxisGrids) == null ? void 0 : _b.val) ?? window.__hekatanAxisGrids) == null ? void 0 : _c2.length) ?? 0, w = (((_d2 = l.points) == null ? void 0 : _d2.rawVal) ?? []).length, v = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(u.txt) && !g && !w ? `${u.txt}  \u2014  teclee la coordenada (0,0,0) o pulse \u{1F3D7} Rejilla para replantear ejes y niveles` : u.txt;
        (_e2 = window.__hekatanCadPrompt) == null ? void 0 : _e2.call(window, v, u.ops);
      } catch {
      }
    };
    window.__hekatanCadRefreshPrompt = ss, window.__hekatanRefreshStatus = () => {
      const u = window.__hekatanCadStatusText ?? "", g = u.split("   |   ")[0] ?? u;
      ye(g);
    }, window.__hekatanCadResetPending = () => {
      qe = [], rt = [], ht.visible = false, so(), jt = null, r(), ye("\u{1F6E0} Tool cambiado \u2014 clicks pendientes limpiados"), ss();
    };
    function so() {
      if (!l.polylines) return;
      const u = l.polylines.rawVal.filter((g) => g.length >= 2);
      l.polylines.val = [
        ...u,
        []
      ];
    }
    window.__hekatanCerrarPolilinea = so;
    const wn = [], gi = [], Nl = () => {
      const u = window.__hekatanDrawingAuxLines;
      return JSON.parse(JSON.stringify((u == null ? void 0 : u.rawVal) ?? (u == null ? void 0 : u.val) ?? []));
    }, no = () => {
      var _a3, _b;
      return {
        p: JSON.parse(JSON.stringify(l.points.rawVal ?? [])),
        l: JSON.parse(JSON.stringify(((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [])),
        a: JSON.parse(JSON.stringify(((_b = l.areas) == null ? void 0 : _b.rawVal) ?? [])),
        x: Nl()
      };
    }, la = (u) => {
      var _a3;
      if (l.points.val = u.p, l.polylines && (l.polylines.val = u.l), l.areas && (l.areas.val = u.a), u.x) {
        const g = window.__hekatanDrawingAuxLines;
        g && "val" in g && (g.val = u.x);
      }
      qe = [], De.visible = false, Zt.visible = false, at();
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      r(), ss();
    }, Et = () => {
      wn.push(no()), wn.length > 100 && wn.shift(), gi.length = 0;
    }, yi = () => {
      const u = wn.pop();
      if (!u) {
        ye("\u21B6 Nada para deshacer");
        return;
      }
      gi.push(no()), la(u), ye(`\u21B6 Deshacer \u2014 quedan ${wn.length}`);
    }, ra = () => {
      const u = gi.pop();
      if (!u) {
        ye("\u21B7 Nada para rehacer");
        return;
      }
      wn.push(no()), la(u), ye(`\u21B7 Rehacer \u2014 quedan ${gi.length}`);
    };
    window.__hekatanPushUndo = Et, window.__hekatanUndo = yi, window.__hekatanRedo = ra, document.addEventListener("keydown", (u) => {
      var _a3;
      const g = u.key.toLowerCase();
      if (!((u.ctrlKey || u.metaKey) && (g === "y" || g === "z" && u.shiftKey))) return;
      const m = u.target;
      m && (m.tagName === "INPUT" || m.tagName === "TEXTAREA") && m.type !== "checkbox" && m.type !== "range" && (((_a3 = m.value) == null ? void 0 : _a3.length) ?? 0) > 0 && m.__hkSucio || (u.preventDefault(), u.stopPropagation(), ra());
    }, {
      capture: true
    }), window.__hekatanCadOption = (u) => {
      var _a3, _b, _c2, _d2, _e2;
      const g = u.trim().toLowerCase(), w = (_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool;
      if (!l.polylines) return false;
      const m = l.polylines.rawVal, v = m.length ? m[m.length - 1] : [];
      if (w !== "line" && w !== "polyline") return g === "u" || g === "deshacer" || g === "undo" ? (yi(), true) : false;
      if (g === "c" || g === "cerrar" || g === "close") {
        if (v.length < 3) return ye("Cerrar necesita al menos tres puntos."), true;
        Et(), l.polylines.val = [
          ...m.slice(0, -1),
          [
            ...v,
            v[0]
          ],
          []
        ];
        try {
          (_d2 = window.__hekatanRebuild) == null ? void 0 : _d2.call(window);
        } catch {
        }
        return io(), ye(`\u2713 Polil\xEDnea cerrada \u2014 ${v.length} tramos.`), true;
      }
      if (g === "u" || g === "deshacer" || g === "undo") {
        if (!v.length) return yi(), true;
        Et();
        const E = v[v.length - 1], k = v.slice(0, -1), M = m.some((T, N) => N !== m.length - 1 && T.includes(E)) || k.includes(E);
        let $ = l.points.rawVal, I = [
          ...m.slice(0, -1),
          k
        ];
        if (!M && E === $.length - 1 && ($ = $.slice(0, -1), l.points.val = $), l.polylines.val = I, k.length) {
          const T = $[k[k.length - 1]];
          T && (je = [
            T[0],
            T[1],
            T[2]
          ]);
        } else je = null, De.visible = false;
        try {
          (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
        } catch {
        }
        return r(), ye(`\u21B6 \xDAltimo punto quitado \u2014 quedan ${k.length}.`), ss(), true;
      }
      return false;
    }, document.addEventListener("input", (u) => {
      const g = u.target;
      g && (g.tagName === "INPUT" || g.tagName === "TEXTAREA") && (g.__hkSucio = true);
    }, {
      capture: true
    }), document.addEventListener("focusout", (u) => {
      const g = u.target;
      g && (g.__hkSucio = false);
    }, {
      capture: true
    }), document.addEventListener("keydown", (u) => {
      var _a3;
      if ((u.ctrlKey || u.metaKey) && u.key.toLowerCase() === "z" && !u.shiftKey) {
        const g = u.target, w = g == null ? void 0 : g.tagName;
        if ((w === "INPUT" || w === "TEXTAREA") && g.type !== "checkbox" && g.type !== "range" && ((_a3 = g.value) == null ? void 0 : _a3.length) > 0 && !!g.__hkSucio) return;
        u.preventDefault(), u.stopPropagation(), yi();
      }
    }, {
      capture: true
    });
    const io = () => {
      qe = [], jt = null, so(), zt = null, Ho(), De.visible = false, Zt.visible = false, at(), ye("\u23F9 Dibujo finalizado \u2014 click para empezar otra serie"), r(), ss();
    };
    window.__hekatanFinalizeDraw = io;
    const ca = () => {
      var _a3, _b, _c2;
      qe = [], rt = [], ht.visible = false;
      let u = false;
      Ue.size && (Ue.clear(), hs(), u = true), io();
      try {
        const g = window.__hekatanCadState, w = (_b = (_a3 = g == null ? void 0 : g.get) == null ? void 0 : _a3.call(g)) == null ? void 0 : _b.tool;
        w && w !== "select" && ((_c2 = g == null ? void 0 : g.setTool) == null ? void 0 : _c2.call(g, "select"));
      } catch {
      }
      ye(u ? "\u238B Selecci\xF3n cancelada" : "\u238B Sin herramienta \u2014 clic-clic para seleccionar por ventana"), r(), ss();
    };
    window.__hekatanEscapeCancel = ca;
    const da = () => {
      var _a3;
      const u = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], g = /* @__PURE__ */ new Set();
      return Ue.forEach((w) => {
        if (w.startsWith("pt:")) g.add(+w.slice(3));
        else if (w.startsWith("poly:")) (u[+w.slice(5)] || []).forEach((m) => g.add(m));
        else if (w.startsWith("seg:")) {
          const m = w.split(":"), v = u[+m[1]] || [], E = v[+m[2]], k = v[+m[2] + 1];
          E != null && g.add(E), k != null && g.add(k);
        }
      }), g;
    }, ha = (u, g, w) => {
      var _a3;
      const m = da();
      if (!m.size) return 0;
      Et();
      const v = l.points.rawVal.map((E, k) => m.has(k) ? [
        E[0] + u,
        E[1] + g,
        E[2] + w
      ] : E);
      l.points.val = v;
      try {
        (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
      } catch {
      }
      return hs(), r(), m.size;
    };
    window.__hekatanMoveSelection = ha;
    const ua = (u, g) => {
      var _a3, _b, _c2, _d2, _e2;
      if (!Ue.size) {
        ye(`${u === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`), (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.setTool) == null ? void 0 : _b.call(_a3, "select"), ss();
        return;
      }
      if (qe.push(g), qe.length === 1) {
        je = g, ye(`${u === "move" ? "MOVER" : "COPIAR"} punto base (${g[0].toFixed(2)}, ${g[1].toFixed(2)}, ${g[2].toFixed(2)}). Precise el segundo punto.`), ss();
        return;
      }
      const [w, m] = qe, v = [
        m[0] - w[0],
        m[1] - w[1],
        m[2] - w[2]
      ];
      qe = [], De.visible = false;
      let E = 0;
      u === "move" ? E = ha(v[0], v[1], v[2]) : (E = da().size, (_c2 = window.__hekatanReplicateSelection) == null ? void 0 : _c2.call(window, v[0], v[1], v[2], 1)), ye(`\u2713 ${u === "move" ? "Movidos" : "Copiados"} ${E} nudo${E === 1 ? "" : "s"} \u2014 \u0394 (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}) m.`), u === "move" && (Ue.clear(), hs()), (_e2 = (_d2 = window.__hekatanCadState) == null ? void 0 : _d2.setTool) == null ? void 0 : _e2.call(_d2, "select"), ss();
    };
    window.__hekatanPasoMoverCopiar = ua;
    const Ol = () => {
      var _a3, _b, _c2;
      const u = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.workPlane) ?? "xy";
      return u === "xz" ? [
        0,
        1,
        0
      ] : u === "yz" ? [
        1,
        0,
        0
      ] : [
        0,
        0,
        1
      ];
    }, Ls = (u, g) => Math.hypot(u[0] - g[0], u[1] - g[1], u[2] - g[2]), oo = (u, g, w, m, v, E) => {
      const k = [
        g[0] - u[0],
        g[1] - u[1],
        g[2] - u[2]
      ], M = [
        m[0] - w[0],
        m[1] - w[1],
        m[2] - w[2]
      ], $ = [
        u[0] - w[0],
        u[1] - w[1],
        u[2] - w[2]
      ], I = k[0] * k[0] + k[1] * k[1] + k[2] * k[2], T = k[0] * M[0] + k[1] * M[1] + k[2] * M[2], N = M[0] * M[0] + M[1] * M[1] + M[2] * M[2], F = k[0] * $[0] + k[1] * $[1] + k[2] * $[2], L = M[0] * $[0] + M[1] * $[1] + M[2] * $[2], j = I * N - T * T;
      if (j < 1e-12) return null;
      const Z = (T * L - N * F) / j, O = (I * L - T * F) / j;
      if (!v && (Z < -1e-6 || Z > 1 + 1e-6) || !E && (O < -1e-6 || O > 1 + 1e-6)) return null;
      const z = [
        u[0] + Z * k[0],
        u[1] + Z * k[1],
        u[2] + Z * k[2]
      ], B = [
        w[0] + O * M[0],
        w[1] + O * M[1],
        w[2] + O * M[2]
      ];
      return Ls(z, B) > 1e-4 ? null : z;
    }, Vl = (u) => {
      var _a3;
      return (((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? []).reduce((g, w) => g + w.filter((m) => m === u).length, 0);
    }, Bl = {
      offset: "DESFASE",
      trim: "RECORTAR",
      extend: "ALARGAR"
    }, Hl = (u, g) => {
      var _a3, _b;
      if (!l.polylines) return;
      const w = l.polylines.rawVal, m = l.points.rawVal, v = Bl[u];
      if (!jt) {
        if (ws < 0) {
          ye(`${v}: pase el cursor por una l\xEDnea (se pone roja) y haga clic.`);
          return;
        }
        jt = {
          poly: ws,
          seg: Math.max(0, Fs)
        }, ye(u === "offset" ? `DESFASE l\xEDnea #${jt.poly + 1} designada \u2014 clic en el lado hacia el que va la copia${Gs > 0 ? ` (${Gs} m)` : ""}.` : u === "trim" ? "RECORTAR contorno designado \u2014 clic en el trozo de l\xEDnea a quitar." : "ALARGAR contorno designado \u2014 clic en la l\xEDnea a alargar, cerca del extremo libre."), ss();
        return;
      }
      if (u === "offset") {
        const Z = jt.poly, O = w[Z];
        if (!O || O.length < 2) {
          jt = null, ye("DESFASE: esa polil\xEDnea no tiene tramos."), ss();
          return;
        }
        const z = O.length > 2 && O[0] === O[O.length - 1], B = Ol(), Y = [];
        for (let Le = 0; Le < O.length - 1; Le++) {
          const Je = m[O[Le]], He = m[O[Le + 1]], Re = [
            He[0] - Je[0],
            He[1] - Je[1],
            He[2] - Je[2]
          ], Xe = Math.hypot(Re[0], Re[1], Re[2]) || 1, Ze = Re[0] / Xe, xt = Re[1] / Xe, St = Re[2] / Xe, Ot = [
            B[1] * St - B[2] * xt,
            B[2] * Ze - B[0] * St,
            B[0] * xt - B[1] * Ze
          ], fs = Math.hypot(Ot[0], Ot[1], Ot[2]) || 1;
          Y.push({
            a: Je,
            b: He,
            n: [
              Ot[0] / fs,
              Ot[1] / fs,
              Ot[2] / fs
            ]
          });
        }
        let ee = 0, K = 1 / 0;
        Y.forEach((Le, Je) => {
          const He = $n(g[0], g[1], g[2], Le.a[0], Le.a[1], Le.a[2], Le.b[0], Le.b[1], Le.b[2]);
          He < K && (K = He, ee = Je);
        });
        const J = Y[ee], se = Math.sign((g[0] - J.a[0]) * J.n[0] + (g[1] - J.a[1]) * J.n[1] + (g[2] - J.a[2]) * J.n[2]) || 1, oe = Gs > 0 ? Gs : K;
        if (oe < 1e-6) {
          ye("DESFASE: distancia nula \u2014 teclee una distancia o clique m\xE1s lejos.");
          return;
        }
        const ne = Y.map((Le) => ({
          a: [
            Le.a[0] + se * oe * Le.n[0],
            Le.a[1] + se * oe * Le.n[1],
            Le.a[2] + se * oe * Le.n[2]
          ],
          b: [
            Le.b[0] + se * oe * Le.n[0],
            Le.b[1] + se * oe * Le.n[1],
            Le.b[2] + se * oe * Le.n[2]
          ]
        })), de = ne.length, me = (Le) => {
          const Je = ne[(Le - 1 + de) % de], He = ne[Le % de];
          return oo(Je.a, Je.b, He.a, He.b, true, true) ?? He.a;
        }, ke = [], Te = z ? de : de + 1;
        for (let Le = 0; Le < Te; Le++) !z && Le === 0 ? ke.push(ne[0].a) : !z && Le === de ? ke.push(ne[de - 1].b) : ke.push(me(Le));
        Et();
        const it = m.length;
        l.points.val = [
          ...m,
          ...ke
        ];
        const We = ke.map((Le, Je) => it + Je);
        z && We.push(it);
        let tt = w.slice();
        tt.length && tt[tt.length - 1].length === 0 && (tt = tt.slice(0, -1)), l.polylines.val = [
          ...tt,
          We,
          []
        ], jt = null, ye(`\u2713 Desfase a ${oe.toFixed(2)} m \u2014 ${de} tramo${de === 1 ? "" : "s"} nuevo${de === 1 ? "" : "s"}. Designe otra l\xEDnea o Esc.`);
        try {
          (_a3 = window.__hekatanRebuild) == null ? void 0 : _a3.call(window);
        } catch {
        }
        r(), ss();
        return;
      }
      let E = ws, k = Math.max(0, Fs);
      if (E < 0 || E === jt.poly && k === jt.seg) {
        let O = (window.__hekatanSnap2D ?? 0.5) * 1.5;
        if (E = -1, w.forEach((z, B) => {
          for (let Y = 0; Y < z.length - 1; Y++) {
            if (B === jt.poly && Y === jt.seg) continue;
            const ee = m[z[Y]], K = m[z[Y + 1]];
            if (!ee || !K) continue;
            const J = $n(g[0], g[1], g[2], ee[0], ee[1], ee[2], K[0], K[1], K[2]);
            J < O && (O = J, E = B, k = Y);
          }
        }), E < 0) {
          ye(`${v}: pase el cursor por OTRA l\xEDnea y haga clic.`);
          return;
        }
      }
      const M = w[jt.poly], $ = m[M[jt.seg]], I = m[M[jt.seg + 1]], T = w[E], N = T[k], F = T[k + 1];
      if (!$ || !I || N == null || F == null) {
        ye(`${v}: no se pudo leer el tramo.`);
        return;
      }
      const L = m[N], j = m[F];
      if (u === "trim") {
        const Z = oo(L, j, $, I, false, false);
        if (!Z) {
          ye("RECORTAR: esa l\xEDnea no cruza el contorno designado.");
          return;
        }
        Et();
        const O = m.length;
        l.points.val = [
          ...m,
          Z
        ];
        const z = [
          ...T.slice(0, k + 1),
          O,
          ...T.slice(k + 1)
        ];
        l.polylines.val = w.map((Y, ee) => ee === E ? z : Y);
        const B = Ls(g, L) < Ls(g, j);
        Uo(E, B ? k : k + 1), ye(`\u2713 Recortado en (${Z[0].toFixed(2)}, ${Z[1].toFixed(2)}, ${Z[2].toFixed(2)}). Designe otro trozo o Esc.`);
      } else {
        const Z = oo(L, j, $, I, true, false);
        if (!Z) {
          ye("ALARGAR: ni prolongada llega esa l\xEDnea al contorno.");
          return;
        }
        const z = Ls(g, L) < Ls(g, j) ? k : k + 1;
        if (z !== 0 && z !== T.length - 1) {
          ye("ALARGAR: solo se alarga un extremo libre de la polil\xEDnea.");
          return;
        }
        const B = T[z];
        if (Ls(Z, L) + Ls(Z, j) < Ls(L, j) + 1e-6) {
          ye("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR.");
          return;
        }
        if (Et(), Vl(B) > 1) {
          const ee = m.length;
          l.points.val = [
            ...m,
            Z
          ];
          const K = T.slice();
          K[z] = ee, l.polylines.val = w.map((J, se) => se === E ? K : J);
        } else l.points.val = m.map((ee, K) => K === B ? Z : ee);
        ye(`\u2713 Alargada hasta (${Z[0].toFixed(2)}, ${Z[1].toFixed(2)}, ${Z[2].toFixed(2)}). Designe otra l\xEDnea o Esc.`);
      }
      try {
        (_b = window.__hekatanRebuild) == null ? void 0 : _b.call(window);
      } catch {
      }
      r(), ss();
    };
    window.__hekatanSelectionSize = () => Ue.size, window.__hekatanSelectLast = () => {
      var _a3;
      const u = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [];
      let g = u.length - 1;
      for (; g >= 0 && (!u[g] || u[g].length < 2); ) g--;
      return Ue.clear(), g >= 0 && Ue.add(`poly:${g}`), hs(), ye(g >= 0 ? "SELECCI\xD3N 1 objeto (el \xFAltimo dibujado) \xB7 Esc suelta" : "No hay ning\xFAn objeto dibujado todav\xEDa."), Ue.size;
    }, window.__hekatanSelectAll = () => {
      var _a3, _b;
      const u = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], g = ((_b = l.points) == null ? void 0 : _b.rawVal) ?? [];
      Ue.clear();
      const w = /* @__PURE__ */ new Set();
      return u.forEach((m, v) => {
        !m || m.length < 2 || (Ue.add(`poly:${v}`), m.forEach((E) => w.add(E)));
      }), g.forEach((m, v) => {
        w.has(v) || Ue.add(`pt:${v}`);
      }), hs(), ye(`SELECCI\xD3N ${Ue.size} objetos (todo el modelo) \xB7 Esc suelta`), Ue.size;
    }, window.__hekatanReplicateSelection = (u, g, w, m, v = 0) => {
      var _a3, _b, _c2, _d2;
      m = Math.max(1, Math.round(m || 1)), v = Math.max(0, Math.round(v || 0));
      const E = [
        ...Ue
      ], k = l.points.rawVal, M = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], $ = new Set(((_b = l.areas) == null ? void 0 : _b.rawVal) ?? []), I = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Set(), N = [];
      if (E.forEach((O) => {
        if (O.startsWith("pt:")) {
          const z = +O.slice(3);
          k[z] && I.add(z);
        } else if (O.startsWith("poly:")) {
          const z = +O.slice(5);
          if (!M[z] || M[z].length < 2) return;
          T.add(z), M[z].forEach((B) => I.add(B));
        } else if (O.startsWith("seg:")) {
          const z = O.split(":"), B = +z[1], Y = +z[2], ee = M[B] || [], K = ee[Y], J = ee[Y + 1];
          K != null && J != null && (N.push([
            K,
            J
          ]), I.add(K), I.add(J));
        }
      }), !I.size) return 0;
      Et();
      const F = [
        ...k
      ];
      let L = M.slice();
      L.length && L[L.length - 1].length === 0 && (L = L.slice(0, -1));
      const j = [
        ...((_c2 = l.areas) == null ? void 0 : _c2.rawVal) ?? []
      ], Z = [
        ...I
      ];
      for (let O = 1; O <= m; O++) {
        const z = v + O, B = u * z, Y = g * z, ee = w * z, K = /* @__PURE__ */ new Map();
        Z.forEach((J) => {
          K.set(J, F.length), F.push([
            k[J][0] + B,
            k[J][1] + Y,
            k[J][2] + ee
          ]);
        }), T.forEach((J) => {
          const se = M[J].map((ne) => K.has(ne) ? K.get(ne) : ne), oe = L.length;
          L.push(se), $.has(J) && j.push(oe);
        }), N.forEach(([J, se]) => {
          L.push([
            K.get(J),
            K.get(se)
          ]);
        });
      }
      L.push([]), l.points.val = F, l.polylines && (l.polylines.val = L), l.areas && (l.areas.val = j);
      try {
        (_d2 = window.__hekatanRebuild) == null ? void 0 : _d2.call(window);
      } catch {
      }
      return r(), m;
    }, window.__hekatanExtrudeSelection = (u, g, w, m) => {
      var _a3, _b, _c2, _d2;
      m = Math.max(1, Math.round(m || 1));
      const v = [
        ...Ue
      ], E = l.points.rawVal, k = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], M = new Set(((_b = l.areas) == null ? void 0 : _b.rawVal) ?? []), $ = /* @__PURE__ */ new Set(), I = [], T = /* @__PURE__ */ new Set();
      for (const B of k) for (const Y of B) T.add(Y);
      if (v.forEach((B) => {
        if (B.startsWith("poly:")) {
          const Y = +B.slice(5);
          if (M.has(Y)) return;
          const ee = k[Y] || [];
          for (let K = 0; K + 1 < ee.length; K++) I.push([
            ee[K],
            ee[K + 1]
          ]), T.add(ee[K]), T.add(ee[K + 1]);
        } else if (B.startsWith("seg:")) {
          const Y = B.split(":"), ee = +Y[1], K = +Y[2], J = k[ee] || [], se = J[K], oe = J[K + 1];
          se != null && oe != null && (I.push([
            se,
            oe
          ]), T.add(se), T.add(oe));
        }
      }), v.forEach((B) => {
        if (B.startsWith("pt:")) {
          const Y = +B.slice(3);
          E[Y] && !T.has(Y) && $.add(Y);
        }
      }), !$.size && !I.length) return {
        lineas: 0,
        areas: 0
      };
      Et();
      const N = [
        ...E
      ];
      let F = k.slice();
      F.length && F[F.length - 1].length === 0 && (F = F.slice(0, -1));
      const L = [
        ...((_c2 = l.areas) == null ? void 0 : _c2.rawVal) ?? []
      ], j = /* @__PURE__ */ new Map(), Z = (B, Y) => {
        if (Y === 0) return B;
        const ee = B + ":" + Y;
        let K = j.get(ee);
        if (K == null) {
          const J = [
            E[B][0] + u * Y,
            E[B][1] + g * Y,
            E[B][2] + w * Y
          ];
          K = N.findIndex((se) => Math.abs(se[0] - J[0]) < 1e-3 && Math.abs(se[1] - J[1]) < 1e-3 && Math.abs(se[2] - J[2]) < 1e-3), K < 0 && (K = N.length, N.push(J)), j.set(ee, K);
        }
        return K;
      };
      let O = 0, z = 0;
      $.forEach((B) => {
        const Y = [
          B
        ];
        for (let ee = 1; ee <= m; ee++) Y.push(Z(B, ee));
        F.push(Y), O += m;
      }), I.forEach(([B, Y]) => {
        for (let ee = 1; ee <= m; ee++) {
          const K = [
            Z(B, ee - 1),
            Z(Y, ee - 1),
            Z(Y, ee),
            Z(B, ee)
          ];
          L.push(F.length), F.push([
            ...K,
            K[0]
          ]), z++;
        }
      }), F.push([]), l.points.val = N, l.polylines && (l.polylines.val = F), l.areas && (l.areas.val = L);
      try {
        (_d2 = window.__hekatanRebuild) == null ? void 0 : _d2.call(window);
      } catch {
      }
      return r(), {
        lineas: O,
        areas: z
      };
    }, window.__hekatanVoladoSelection = (u, g = {}) => {
      var _a3, _b, _c2;
      const w = Number(u);
      if (!Number.isFinite(w) || Math.abs(w) < 1e-6) return 0;
      const m = g.losa !== false, v = g.vigaBorde !== false, E = g.lados === "afuera" ? "afuera" : "ambos", k = l.points.rawVal, M = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], $ = [];
      if ([
        ...Ue
      ].forEach((Z) => {
        if (Z.startsWith("seg:")) {
          const O = Z.split(":"), z = +O[1], B = +O[2], Y = M[z] || [], ee = Y[B], K = Y[B + 1];
          ee != null && K != null && $.push([
            ee,
            K
          ]);
        } else if (Z.startsWith("poly:")) {
          const O = M[+Z.slice(5)] || [];
          for (let z = 0; z + 1 < O.length; z++) $.push([
            O[z],
            O[z + 1]
          ]);
        }
      }), !$.length) return 0;
      let I = 0, T = 0;
      for (const Z of k) I += Z[0], T += Z[1];
      I /= Math.max(1, k.length), T /= Math.max(1, k.length), Et();
      const N = [
        ...k
      ];
      let F = M.slice();
      F.length && F[F.length - 1].length === 0 && (F = F.slice(0, -1));
      const L = [
        ...((_b = l.areas) == null ? void 0 : _b.rawVal) ?? []
      ];
      let j = 0;
      for (const [Z, O] of $) {
        const z = k[Z], B = k[O];
        if (!z || !B) continue;
        const Y = B[0] - z[0], ee = B[1] - z[1], K = Math.hypot(Y, ee);
        if (K < 1e-6) continue;
        let J = -ee / K, se = Y / K;
        const oe = (z[0] + B[0]) / 2, ne = (z[1] + B[1]) / 2;
        (oe - I) * J + (ne - T) * se < 0 && (J = -J, se = -se);
        const de = E === "ambos" ? [
          1,
          -1
        ] : [
          1
        ];
        for (const me of de) {
          const ke = J * w * me, Te = se * w * me, it = N.length;
          N.push([
            z[0] + ke,
            z[1] + Te,
            z[2]
          ]);
          const We = N.length;
          N.push([
            B[0] + ke,
            B[1] + Te,
            B[2]
          ]), F.push([
            Z,
            it
          ]), F.push([
            O,
            We
          ]), v && F.push([
            it,
            We
          ]), m && (L.push(F.length), F.push([
            Z,
            O,
            We,
            it,
            Z
          ])), j++;
        }
      }
      if (!j) return 0;
      F.push([]), l.points.val = N, l.polylines && (l.polylines.val = F), l.areas && (l.areas.val = L);
      try {
        (_c2 = window.__hekatanRebuild) == null ? void 0 : _c2.call(window);
      } catch {
      }
      return r(), j;
    }, a.addEventListener("click", (u) => {
      var _a3, _b;
      if (window.__hekatanCursorPx = {
        x: u.clientX,
        y: u.clientY
      }, Ws > 5) {
        Ws = 0;
        return;
      }
      Ws = 0;
      const g = p(u);
      if (!g) return;
      c.setFromCamera(d, g);
      const w = !!(Xt && Math.abs(u.clientX - Xt.x) <= 3 && Math.abs(u.clientY - Xt.y) <= 3), m = w ? [
        {
          point: Xt.p.clone(),
          distance: g.position.distanceTo(Xt.p)
        }
      ] : Me();
      if (!m.length) return;
      if (!w) {
        const E = g.position.distanceTo(n.target) || 1, k = m[0].distance ?? g.position.distanceTo(m[0].point), M = m[0].point;
        if (!isFinite(M.x) || !isFinite(M.y) || !isFinite(M.z) || k > Math.max(E * 12, 300)) {
          ye("\u26A0 Click rasante descartado \u2014 cay\xF3 demasiado lejos. Acerc\xE1 la vista o clicke\xE1 sobre la grilla.");
          return;
        }
      }
      let v = m[0].point;
      (u.ctrlKey || u.metaKey) && (v = new te(Math.round(m[0].point.x), Math.round(m[0].point.y), Math.round(m[0].point.z)));
      {
        const E = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], k = E[E.length - 1] ?? [], M = l.points.rawVal ?? [];
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
      else if (ei) v = ei.clone(), ye(`\u{1F4D0} Eje \u2192 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`);
      else {
        const E = Ki(v), k = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, v.x, v.y, v.z, E, {
          x: u.clientX,
          y: u.clientY
        });
        if (k) v = new te(k.x, k.y, k.z), ye(`\u{1F3AF} Snap [${k.type.toUpperCase()}] \u2192 (${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`);
        else {
          const M = window.__hekatanSnapEnabled !== false, $ = window.__hekatanSnap2D ?? 0;
          M && $ > 0 && (v = new te(Math.round(v.x / $) * $, Math.round(v.y / $) * $, Math.round(v.z / $) * $));
        }
      }
      pa(v, u);
    });
    const pa = (u, g) => {
      var _a3, _b, _c2, _d2, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r2, _s2, _t2, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R;
      const w = ((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) ?? "select";
      if (w === "select" || w === "none" || !w) {
        if (_s) {
          ts && hi();
          const { kind: k, a: M, b: $ } = _s, I = $ !== void 0 ? `${k}:${M}:${$}` : `${k}:${M}`;
          !!g && (g.ctrlKey || g.metaKey || g.shiftKey) || Ue.clear(), Ue.has(I) ? Ue.delete(I) : Ue.add(I), hs(), ye(`\u2713 Seleccionados ${Ue.size} elemento(s) \u2014 Ctrl+Click para multi-selecci\xF3n`);
        } else {
          const k = !!g && (g.ctrlKey || g.metaKey || g.shiftKey), M = (g == null ? void 0 : g.clientX) ?? 0, $ = (g == null ? void 0 : g.clientY) ?? 0;
          ts ? (ta(ts.x, ts.y, M, $, k), ts = null) : k || (ts = {
            x: M,
            y: $
          }, ye("\u{1F5B1} Click 2 para cerrar el rect\xE1ngulo (\u2192 derecha=Window azul, \u2190izquierda=Crossing verde). Esc=cancelar."), Ji(M, $, M + 1, $ + 1, false));
        }
        return;
      }
      if (w === "axis") {
        const k = window.__hekatanAxisDraw;
        if (!k) return;
        if (!k.pendingStart) {
          k.pendingStart = [
            u.x,
            u.y,
            u.z
          ], ye(`\u{1F4CD} Eje \u2014 click 1 OK en (${u.x.toFixed(2)}, ${u.y.toFixed(2)}, ${u.z.toFixed(2)}). Click 2=fin.`);
          return;
        }
        const M = k.mode === "number", $ = (_d2 = window.__hekatanAxisCommit) == null ? void 0 : _d2.call(window, k.pendingStart, [
          u.x,
          u.y,
          u.z
        ], M);
        ye(`\u2713 Eje "${$}" creado. Click 1=nuevo eje, o cambia tool.`);
        return;
      }
      if (w === "move" || w === "copy") {
        ua(w, [
          u.x,
          u.y,
          u.z
        ]);
        return;
      }
      if (w === "delete") {
        if (Ps >= 0) {
          const k = window.__hekatanDrawingAuxLines, M = (k == null ? void 0 : k.rawVal) ?? (k == null ? void 0 : k.val) ?? k ?? [], $ = Ps;
          if ($ >= 0 && $ < M.length) {
            Et();
            const I = M.slice(0, $).concat(M.slice($ + 1));
            k && typeof k == "object" && "val" in k ? k.val = I : window.__hekatanDrawingAuxLines = I, ye(`\u{1F5D1} L\xEDnea auxiliar #${$ + 1} borrada`), Ps = -1, Qt.visible = false;
            try {
              (_e2 = window.__hekatanRebuild) == null ? void 0 : _e2.call(window);
            } catch {
            }
          }
        } else if (ws >= 0) {
          const k = ws, M = Fs;
          ((_g = (_f = l.areas) == null ? void 0 : _f.rawVal) == null ? void 0 : _g.includes(k)) ?? false ? (oi(k), ye(`\u{1F5D1} \xC1rea #${k + 1} (shell Q4) borrada`)) : M >= 0 ? (Uo(k, M), ye(`\u{1F5D1} Segmento ${M + 1} de polil\xEDnea #${k + 1} borrado`)) : (oi(k), ye(`\u{1F5D1} Polil\xEDnea #${k + 1} borrada`));
        } else ye("\u{1F5D1} Acerc\xE1 el cursor a una l\xEDnea/\xE1rea/aux para borrarla");
        return;
      }
      if (w === "circle") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length === 1) {
          ye("\u25CB C\xEDrculo \u2014 click 1/2 OK (centro). Ahora marc\xE1 el radio.");
          return;
        }
        const [k, M] = qe, $ = Math.hypot(M[0] - k[0], M[1] - k[1], M[2] - k[2]), I = Math.abs(M[0] - k[0]), T = Math.abs(M[1] - k[1]), N = Math.abs(M[2] - k[2]), F = String(((_j = (_i2 = (_h = window.__hekatanCadState) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h)) == null ? void 0 : _j.workPlane) ?? ""), j = (F === "xy" ? N < 1e-3 : F === "xz" ? T < 1e-3 : F === "yz" ? I < 1e-3 : false) ? F : N < 1e-3 ? "xy" : T < 1e-3 ? "xz" : "yz", Z = window.__hekatanArcSegs ?? 12;
        (_k = window.__hekatanDrawCircle) == null ? void 0 : _k.call(window, k[0], k[1], k[2], $, Z, j), ye(`\u2713 C\xEDrculo dibujado en ${j.toUpperCase()} \u2014 r=${$.toFixed(2)}m, ${Z} segmentos`), qe = [];
        try {
          (_l2 = window.__hekatanRebuild) == null ? void 0 : _l2.call(window);
        } catch {
        }
        return;
      }
      if (w === "ifcface") {
        if (!Q) {
          ye("\u25A6 Acerc\xE1 el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en \xE1rea.");
          return;
        }
        if (!Q.plana) {
          ye("\u25A6 Esa cara es CURVA (naranja): ETABS no admite \xE1reas curvas. Copi\xE1 el arco con \xABCopiar l\xEDnea del IFC\xBB y extru\xEDlo (Editar \u203A Extruir) para tener pa\xF1os planos.");
          return;
        }
        const k = R(Q.m), M = be(k, Q.tris);
        if (M.length < 3) {
          ye("\u25A6 No se pudo cerrar el contorno de la cara.");
          return;
        }
        const $ = Q.normal.clone(), I = ae(Q.m, Q.punto, $);
        let T = String(window.__hekatanIfcCaraPos ?? "auto"), N = false;
        try {
          const Y = (_m = window.__hekatanParams) == null ? void 0 : _m.call(window);
          N = Math.round((Y == null ? void 0 : Y.matShell) ?? 0) === 1;
        } catch {
        }
        T === "auto" && (T = Math.abs($.z) > 0.5 ? N ? "interior" : "exterior" : "media");
        const F = I ?? 0.2, L = T === "exterior" ? 0 : T === "interior" ? F : F / 2, j = M.map((Y) => Y.clone().addScaledVector($, -L));
        Et(), rt = j.map((Y) => [
          Y.x,
          Y.y,
          Y.z
        ]);
        const Z = ci();
        try {
          const Y = (_n2 = window.__hekatanParams) == null ? void 0 : _n2.call(window);
          Y && I && (Y.tShell = Math.round(I * 100) / 100);
        } catch {
        }
        const O = [
          "Shell-Thick (Mindlin)",
          "Shell-Thin (Kirchhoff)",
          "Membrana"
        ];
        let z = "la de \xABSecci\xF3n shells\xBB";
        try {
          const Y = (_o2 = window.__hekatanParams) == null ? void 0 : _o2.call(window);
          Y && Y.formaPlaca != null && (z = O[Math.round(Y.formaPlaca)] ?? z);
        } catch {
        }
        const B = T === "exterior" ? "la cara TOCADA (punto de inserci\xF3n SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de an\xE1lisis se queda en el plano dibujado)" : T === "interior" ? "la cara de ATR\xC1S (inserci\xF3n INFERIOR, desfase " + F.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (F / 2).toFixed(2) + " m hacia dentro)";
        ye(`\u25A6 \xC1rea desde la cara del IFC: ${M.length} v\xE9rtices, ${Z} shell(s). Espesor medido ${I ? I.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${B}; formulaci\xF3n ${z}, t = ${F.toFixed(2)} m.`), ue(null, -1, null);
        try {
          (_p = window.__hekatanRebuild) == null ? void 0 : _p.call(window);
        } catch {
        }
        r();
        return;
      }
      if (w === "ifcline") {
        if (!P || P.length < 2) {
          ye("\u27CB Acerc\xE1 el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia.");
          return;
        }
        const k = q(P);
        Et();
        const M = l.points.rawVal, $ = [], I = [];
        for (const N of k) {
          let F = M.findIndex((L) => Math.abs(L[0] - N[0]) < 1e-3 && Math.abs(L[1] - N[1]) < 1e-3 && Math.abs(L[2] - N[2]) < 1e-3);
          F < 0 && (F = M.length + I.length, I.push(N)), $.push(F);
        }
        if (l.points.val = [
          ...M,
          ...I
        ], l.polylines) {
          const N = l.polylines.rawVal, F = N.length && N[N.length - 1].length === 0 ? N.slice(0, -1) : N;
          l.polylines.val = [
            ...F,
            $,
            []
          ];
        }
        const T = P.reduce((N, F, L) => L ? N + F.distanceTo(P[L - 1]) : 0, 0);
        ye(`\u27CB L\xEDnea del IFC copiada: ${k.length - 1} tramo(s), ${T.toFixed(2)} m de desarrollo.`), V(null);
        try {
          (_q = window.__hekatanRebuild) == null ? void 0 : _q.call(window);
        } catch {
        }
        r();
        return;
      }
      if (w === "arc") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length === 1) {
          ye("\u2312 Arco \u2014 click 1/3 OK (inicio). Marc\xE1 el punto medio.");
          return;
        }
        if (qe.length === 2) {
          ye("\u2312 Arco \u2014 click 2/3 OK (medio). Marc\xE1 el final.");
          return;
        }
        const [k, M, $] = qe, I = window.__hekatanArcSegs ?? 12;
        (_r2 = window.__hekatanDrawArc) == null ? void 0 : _r2.call(window, k, M, $, I), ye(`\u2713 Arco dibujado \u2014 ${I} segmentos`), qe = [];
        try {
          (_s2 = window.__hekatanRebuild) == null ? void 0 : _s2.call(window);
        } catch {
        }
        return;
      }
      if (w === "parabola" || w === "cubica") {
        const k = w === "parabola" ? 3 : 4, M = w === "parabola" ? "Par\xE1bola" : "C\xFAbica";
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length < k) {
          ye(`\u223F ${M} \u2014 punto ${qe.length}/${k} OK. Marc\xE1 el ${qe.length + 1}\xBA.`);
          return;
        }
        const $ = window.__hekatanArcSegs ?? 12, I = (_t2 = window.__hekatanDrawPolinomio) == null ? void 0 : _t2.call(window, qe.slice(), $);
        if (!(I == null ? void 0 : I.ok)) {
          ye(`\u26A0 ${M}: ${(I == null ? void 0 : I.msg) ?? "no se pudo"}. Volv\xE9 a marcar los puntos.`), qe = [];
          return;
        }
        const T = "xyz"[I.ia ?? 0], N = "xyz"[I.io ?? 2], F = (I.coef ?? []).map((L, j) => `${L >= 0 && j ? "+" : ""}${L.toFixed(3)}${j ? "\xB7" + T + (j > 1 ? "^" + j : "") : ""}`).join(" ");
        ye(`\u2713 ${M} dibujada en ${String(I.plano ?? "").toUpperCase()} \u2014 ${$} tramos a \u0394 igual de ${T} \xB7 ${N} = ${F}`), qe = [];
        try {
          (_u = window.__hekatanRebuild) == null ? void 0 : _u.call(window);
        } catch {
        }
        return;
      }
      if (w === "revolve") {
        const k = Math.round(window.__hekatanRevSectores ?? 16), M = (_v = window.__hekatanRevolveSelection) == null ? void 0 : _v.call(window, u.x, u.y, k, 360);
        if (M == null ? void 0 : M.msg) {
          ye(`\u26A0 Revoluci\xF3n: ${M.msg}.`);
          return;
        }
        ye(`\u2713 Revoluci\xF3n: ${M.anillos} anillo(s) \xD7 ${k} sectores \u2192 ${M.areas} pa\xF1o(s) Q4${M.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${u.x.toFixed(2)}, ${u.y.toFixed(2)}).${M.guias ? ` ${M.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
        try {
          (_w = window.__hekatanClearSelection) == null ? void 0 : _w.call(window);
        } catch {
        }
        return;
      }
      if (w === "loft") {
        const k = (_x = window.__hekatanLoftSelection) == null ? void 0 : _x.call(window, u.x, u.y);
        if (k == null ? void 0 : k.msg) {
          ye(`\u26A0 Barrido: ${k.msg}.`);
          return;
        }
        ye(`\u2713 Barrido: contorno de ${k.contorno} lados \xD7 perfil de ${k.perfil} puntos \u2192 ${k.areas} pa\xF1o(s) Q4. Eje por (${u.x.toFixed(2)}, ${u.y.toFixed(2)}).${k.guias ? ` ${k.guias} l\xEDnea(s) auxiliar(es) de gu\xEDa borrada(s).` : ""}`);
        try {
          (_y = window.__hekatanClearSelection) == null ? void 0 : _y.call(window);
        } catch {
        }
        return;
      }
      if (w === "rect") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length === 1) {
          ye("\u25AD Rect\xE1ngulo \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [k, M] = qe;
        (_z = window.__hekatanDrawRect) == null ? void 0 : _z.call(window, k, M), ye(`\u2713 Rect\xE1ngulo dibujado \u2014 (${k[0].toFixed(1)},${k[1].toFixed(1)}) \u2192 (${M[0].toFixed(1)},${M[1].toFixed(1)})`), qe = [];
        try {
          (_A = window.__hekatanRebuild) == null ? void 0 : _A.call(window);
        } catch {
        }
        return;
      }
      if (w === "medir") {
        const M = (Xt && Math.abs(Xt.x - g.clientX) < 3 && Math.abs(Xt.y - g.clientY) < 3 ? [
          Xt.p.x,
          Xt.p.y,
          Xt.p.z
        ] : null) ?? Wt(g);
        if (!M) return;
        if (Ge.length >= 2 && (Ge = []), Ge.push(M), Ge.length === 1) Tt.visible = false, Dt(), ye("\u{1F4CF} Regla \u2014 1er punto puesto. Marca el 2\xBA.");
        else {
          const [$, I] = Ge;
          Tt.geometry.setFromPoints([
            new te($[0], $[1], $[2]),
            new te(I[0], I[1], I[2])
          ]), Tt.visible = true;
          const T = Math.hypot(I[0] - $[0], I[1] - $[1], I[2] - $[2]), N = Math.hypot(I[0] - $[0], I[1] - $[1]);
          nt.textContent = `${T.toFixed(3)} m`, Dt(), ye(`\u{1F4CF} Distancia ${T.toFixed(3)} m  \xB7  \u0394x ${(I[0] - $[0]).toFixed(3)}  \u0394y ${(I[1] - $[1]).toFixed(3)}  \u0394z ${(I[2] - $[2]).toFixed(3)}  \xB7  en planta ${N.toFixed(3)} m`);
        }
        r();
        return;
      }
      if (w === "fillarea") {
        const k = l.points.rawVal, M = ((_B = l.polylines) == null ? void 0 : _B.rawVal) ?? [], $ = /* @__PURE__ */ new Map(), I = (oe, ne) => {
          oe !== ne && (($.get(oe) ?? $.set(oe, /* @__PURE__ */ new Set()).get(oe)).add(ne), ($.get(ne) ?? $.set(ne, /* @__PURE__ */ new Set()).get(ne)).add(oe));
        };
        for (const oe of M) for (let ne = 0; ne + 1 < oe.length; ne++) I(oe[ne], oe[ne + 1]);
        const T = (oe, ne) => {
          var _a4;
          return !!((_a4 = $.get(oe)) == null ? void 0 : _a4.has(ne));
        }, N = /* @__PURE__ */ new Set(), F = [], L = [
          ...$.keys()
        ];
        for (const oe of L) for (const ne of $.get(oe)) if (!(ne < oe)) {
          for (const de of $.get(ne)) if (de !== oe) for (const me of $.get(de)) {
            if (me === oe || me === ne || !T(me, oe) || T(oe, de) || T(ne, me)) continue;
            const ke = [
              oe,
              ne,
              de,
              me
            ].slice().sort((Te, it) => Te - it).join("-");
            N.has(ke) || (N.add(ke), F.push([
              oe,
              ne,
              de,
              me
            ]));
          }
        }
        for (const oe of L) for (const ne of $.get(oe)) if (!(ne < oe)) for (const de of $.get(ne)) {
          if (de === oe || !T(de, oe)) continue;
          const me = [
            oe,
            ne,
            de
          ].slice().sort((ke, Te) => ke - Te).join("-");
          N.has(me) || (N.add(me), F.push([
            oe,
            ne,
            de
          ]));
        }
        const j = ((_E = (_D = (_C = window.__hekatanCadState) == null ? void 0 : _C.get) == null ? void 0 : _D.call(_C)) == null ? void 0 : _E.workPlane) ?? "xy", Z = (oe) => j === "xy" ? [
          oe[0],
          oe[1]
        ] : j === "xz" ? [
          oe[0],
          oe[2]
        ] : [
          oe[1],
          oe[2]
        ], O = Z([
          u.x,
          u.y,
          u.z
        ]), z = (oe, ne) => {
          let de = false;
          for (let me = 0, ke = ne.length - 1; me < ne.length; ke = me++) {
            const Te = ne[me][0], it = ne[me][1], We = ne[ke][0], tt = ne[ke][1];
            it > oe[1] != tt > oe[1] && oe[0] < (We - Te) * (oe[1] - it) / (tt - it) + Te && (de = !de);
          }
          return de;
        }, B = (oe) => {
          let ne = 0;
          for (let de = 0, me = oe.length - 1; de < oe.length; me = de++) ne += (oe[me][0] + oe[de][0]) * (oe[me][1] - oe[de][1]);
          return Math.abs(ne) / 2;
        };
        let Y = null, ee = 1 / 0;
        for (const oe of F) {
          const ne = oe.map((me) => Z(k[me]));
          if (!z(O, ne)) continue;
          const de = B(ne);
          de < ee && (ee = de, Y = oe);
        }
        if (!Y) {
          ye("\u25A6 Rellenar \xE1rea \u2014 no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero.");
          return;
        }
        const K = Y.slice().sort((oe, ne) => oe - ne).join("-"), J = ((_F = l.areas) == null ? void 0 : _F.rawVal) ?? [];
        if (J.some((oe) => {
          const ne = M[oe] ?? [];
          return [
            ...new Set(ne)
          ].sort((de, me) => de - me).join("-") === K;
        })) {
          ye("\u25A6 Esa celda ya tiene \xE1rea.");
          return;
        }
        l.polylines.val = [
          ...M,
          [
            ...Y,
            Y[0]
          ]
        ], l.areas.val = [
          ...J,
          M.length
        ], ye(`\u2713 \xC1rea creada por relleno (${Y.length} lados).`);
        try {
          (_G = window.__hekatanRebuild) == null ? void 0 : _G.call(window);
        } catch {
        }
        return;
      }
      if (w === "rectarea") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length === 1) {
          ye("\u25AD \xC1rea rectangular \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [k, M] = qe;
        (_H = window.__hekatanDrawRectArea) == null ? void 0 : _H.call(window, k, M), ye(`\u2713 \xC1rea rectangular (shell Q4) creada \u2014 (${k[0].toFixed(1)},${k[1].toFixed(1)}) \u2192 (${M[0].toFixed(1)},${M[1].toFixed(1)})`), qe = [];
        return;
      }
      if (w === "polyarea") {
        rt.push([
          u.x,
          u.y,
          u.z
        ]), ht.geometry.setFromPoints(rt.map((k) => new te(k[0], k[1], k[2]))), ht.visible = rt.length >= 1, ye(`\u25B0 \xC1rea libre \u2014 ${rt.length} punto(s). Click m\xE1s v\xE9rtices, o Enter / click-derecho para cerrar y mallar (m\xEDn. 3).`), r();
        return;
      }
      if (w === "plane3") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length < 3) {
          ye(`\u25E3 Plano inclinado \u2014 punto ${qe.length}/3. Tip: cambi\xE1 la Cota Z (o enganch\xE1 un nodo) entre clicks para darle inclinaci\xF3n.`);
          return;
        }
        const [k, M, $] = qe, I = (_I = window.__hekatanSetInclinedPlaneFrom3) == null ? void 0 : _I.call(window, k, M, $);
        ye(I ? "\u2713 Plano de trabajo INCLINADO activo. Dibuj\xE1 el \xE1rea (\u25AD/\u2B21) sobre \xE9l. (XY para resetear)" : "\u26A0 Los 3 puntos son colineales \u2014 no definen un plano. Reintent\xE1."), qe = [];
        return;
      }
      if (w === "col") {
        Et();
        const k = u.z, M = It && It > 0 ? It : 3;
        l.points.val = [
          ...l.points.rawVal,
          [
            u.x,
            u.y,
            k
          ],
          [
            u.x,
            u.y,
            k + M
          ]
        ];
        const $ = l.polylines.rawVal, I = l.points.rawVal.length;
        l.polylines.val = [
          ...$.slice(0, -1),
          ...$[$.length - 1].length > 0 ? [
            $[$.length - 1]
          ] : [],
          [
            I - 2,
            I - 1
          ],
          []
        ], It = 0, ye(`\u258C Columna creada \u2014 h=${M.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`);
        try {
          (_J = window.__hekatanRebuild) == null ? void 0 : _J.call(window);
        } catch {
        }
        return;
      }
      if (w === "wall") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length === 1) {
          ye("\u25A5 Pared Q4 \u2014 click 1/2 OK (esquina base 1). Marc\xE1 la otra esquina base.");
          return;
        }
        const [k, M] = qe, $ = It && It > 0 ? It : 3;
        Et();
        const I = l.points.rawVal.length;
        l.points.val = [
          ...l.points.rawVal,
          [
            k[0],
            k[1],
            k[2]
          ],
          [
            M[0],
            M[1],
            M[2]
          ],
          [
            M[0],
            M[1],
            M[2] + $
          ],
          [
            k[0],
            k[1],
            k[2] + $
          ]
        ];
        const T = l.polylines.rawVal;
        if (T.length - 1, l.polylines.val = [
          ...T.slice(0, -1),
          ...T[T.length - 1].length > 0 ? [
            T[T.length - 1]
          ] : [],
          [
            I,
            I + 1,
            I + 2,
            I + 3,
            I
          ],
          []
        ], l.areas) {
          const N = l.polylines.rawVal.length - 2;
          l.areas.val = [
            ...l.areas.rawVal,
            N
          ];
        }
        ye(`\u25A5 Pared Q4 creada \u2014 h=${$.toFixed(2)}m. Tipe\xE1 altura + Enter para custom.`), qe = [], It = 0;
        try {
          (_K = window.__hekatanRebuild) == null ? void 0 : _K.call(window);
        } catch {
        }
        return;
      }
      if (w === "extp") {
        Et();
        const k = It && It > 0 ? It : 3, M = u.z;
        l.points.val = [
          ...l.points.rawVal,
          [
            u.x,
            u.y,
            M
          ],
          [
            u.x,
            u.y,
            M + k
          ]
        ];
        const $ = l.polylines.rawVal, I = l.points.rawVal.length;
        l.polylines.val = [
          ...$.slice(0, -1),
          ...$[$.length - 1].length > 0 ? [
            $[$.length - 1]
          ] : [],
          [
            I - 2,
            I - 1
          ],
          []
        ], It = 0, ye(`\u2B06 Extrusi\xF3n punto\u2192l\xEDnea \u2014 h=${k.toFixed(2)}m`);
        try {
          (_L = window.__hekatanRebuild) == null ? void 0 : _L.call(window);
        } catch {
        }
        return;
      }
      if (w === "extl") {
        const k = (window.__hekatanSnap2D ?? 0.5) * 1.5, M = Ui(u.x, u.y, u.z, k);
        if (!M) {
          ye("\u2B06 Extruir l\xEDnea \u2014 acerc\xE1 el cursor a una l\xEDnea existente y volv\xE9 a clickear.");
          return;
        }
        const $ = l.polylines.rawVal, I = l.points.rawVal, T = $[M.polyIdx], N = I[T[M.segIdx]], F = I[T[M.segIdx + 1]];
        if (!N || !F) {
          ye("\u2B06 Extruir l\xEDnea \u2014 segmento no v\xE1lido.");
          return;
        }
        const L = It && It > 0 ? It : 3;
        Et();
        const j = l.points.rawVal.length;
        l.points.val = [
          ...l.points.rawVal,
          [
            N[0],
            N[1],
            N[2]
          ],
          [
            F[0],
            F[1],
            F[2]
          ],
          [
            F[0],
            F[1],
            F[2] + L
          ],
          [
            N[0],
            N[1],
            N[2] + L
          ]
        ];
        const Z = l.polylines.rawVal;
        if (l.polylines.val = [
          ...Z.slice(0, -1),
          ...Z[Z.length - 1].length > 0 ? [
            Z[Z.length - 1]
          ] : [],
          [
            j,
            j + 1,
            j + 2,
            j + 3,
            j
          ],
          []
        ], l.areas) {
          const O = l.polylines.rawVal.length - 2;
          l.areas.val = [
            ...l.areas.rawVal,
            O
          ];
        }
        It = 0, ye(`\u2B06 Extrusi\xF3n l\xEDnea\u2192\xE1rea Q4 \u2014 h=${L.toFixed(2)}m`);
        try {
          (_M = window.__hekatanRebuild) == null ? void 0 : _M.call(window);
        } catch {
        }
        return;
      }
      if (w === "auxp") {
        const k = window.__hekatanDrawingAuxPoints;
        if (k) {
          const M = k.rawVal ?? k.val ?? [];
          k.val = [
            ...M,
            [
              u.x,
              u.y,
              u.z
            ]
          ];
        }
        ye(`\u2726 Punto auxiliar agregado en (${u.x.toFixed(2)}, ${u.y.toFixed(2)}, ${u.z.toFixed(2)})`);
        return;
      }
      if (w === "aux") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length === 1) {
          ye("\u250A L\xEDnea auxiliar \u2014 click 1/2 OK. Marc\xE1 el punto final.");
          return;
        }
        const [k, M] = qe, $ = window.__hekatanDrawingAuxLines;
        if ($) {
          Et();
          const L = $.rawVal ?? $.val ?? [];
          $.val = [
            ...L,
            [
              k[0],
              k[1],
              k[2],
              M[0],
              M[1],
              M[2]
            ]
          ];
        }
        const I = M[0] - k[0], T = M[1] - k[1], N = M[2] - k[2], F = Math.sqrt(I * I + T * T + N * N);
        ye(`\u2713 L\xEDnea auxiliar creada \u2014 L=${F.toFixed(2)}m (cyan, no FEM)`), qe = [];
        return;
      }
      if (w === "extend" || w === "trim" || w === "offset") {
        Hl(w, [
          u.x,
          u.y,
          u.z
        ]);
        return;
      }
      if (w === "chaflan") {
        if (qe.push([
          u.x,
          u.y,
          u.z
        ]), qe.length === 1) {
          ye("\u25B1 Losa con chaflanes \u2014 click 1/2 OK (esquina). Marc\xE1 la esquina opuesta.");
          return;
        }
        const [k, M] = qe, $ = window.__hekatanChaflanR ?? 1, I = Math.max(3, window.__hekatanArcSegs ?? 6);
        (_N = window.__hekatanDrawSlabChaflan) == null ? void 0 : _N.call(window, k, M, $, I, 6);
        const T = Math.abs(M[0] - k[0]).toFixed(1), N = Math.abs(M[1] - k[1]).toFixed(1);
        ye(`\u2713 Losa con chaflanes dibujada \u2014 ${T}\xD7${N}m, r=${$}m, ${I} seg/chafl\xE1n`), qe = [];
        try {
          (_O = window.__hekatanRebuild) == null ? void 0 : _O.call(window);
        } catch {
        }
        return;
      }
      Ee = false, Et();
      const m = u.toArray(), v = l.points.rawVal;
      let E = v.findIndex((k) => Math.abs(k[0] - m[0]) < 1e-3 && Math.abs(k[1] - m[1]) < 1e-3 && Math.abs(k[2] - m[2]) < 1e-3);
      if (E < 0 && (l.points.val = [
        ...v,
        m
      ], E = l.points.rawVal.length - 1), l.polylines && w !== "node") {
        const k = l.polylines.rawVal, M = k.length ? k[k.length - 1] : [];
        M.length && M[M.length - 1] === E ? l.polylines.val = [
          ...k,
          [
            E
          ]
        ] : l.polylines.val = [
          ...k.slice(0, -1),
          [
            ...M,
            E
          ]
        ];
      }
      if (l.polylines) {
        const k = l.polylines.rawVal, M = k.length - 1, $ = k[M] ?? [];
        if (w === "line" && $.length >= 2) {
          ye(`\uFF0F L\xEDnea \u2014 ${$.length - 1} tramo${$.length === 2 ? "" : "s"}. Segu\xED marcando puntos; Esc o clic derecho para terminar.`);
          try {
            (_P = window.__hekatanRebuild) == null ? void 0 : _P.call(window);
          } catch {
          }
          return;
        }
        if (w === "area" && $.length === 4) {
          l.polylines.val = [
            ...k.slice(0, -1),
            [
              ...$,
              $[0]
            ],
            []
          ], l.areas && (l.areas.val = [
            ...l.areas.rawVal,
            M
          ]), ye("\u25A6 \xC1rea (shell Q4) creada \u2014 4 v\xE9rtices marcados.");
          try {
            (_Q = window.__hekatanRebuild) == null ? void 0 : _Q.call(window);
          } catch {
          }
          return;
        }
      }
      if (w === "node") ye(`\u25CF Nodo creado en (${u.x.toFixed(2)}, ${u.y.toFixed(2)}, ${u.z.toFixed(2)})`);
      else if (w === "line") ye("\uFF0F L\xEDnea \u2014 click 1/2 OK. Marc\xE1 el segundo punto para crear el frame.");
      else if (w === "polyline") ye("\u2310 Polil\xEDnea \u2014 punto agregado. Continu\xE1 clickeando, right-click para terminar.");
      else if (w === "area") {
        const k = ((_R = l.polylines) == null ? void 0 : _R.rawVal[l.polylines.rawVal.length - 1]) ?? [];
        ye(`\u25A6 \xC1rea \u2014 click ${k.length}/4. Marc\xE1 ${4 - k.length} v\xE9rtice${4 - k.length === 1 ? "" : "s"} m\xE1s.`);
      }
    };
    a.addEventListener("click", () => ss()), a.addEventListener("contextmenu", (u) => {
      var _a3, _b, _c2;
      if (((_c2 = (_b = (_a3 = window.__hekatanCadState) == null ? void 0 : _a3.get) == null ? void 0 : _b.call(_a3)) == null ? void 0 : _c2.tool) === "polyarea" && rt.length >= 3) {
        u.preventDefault();
        const w = ci();
        ye(`\u2713 \xC1rea libre mallada \u2014 ${w} shells Q4 creados.`);
        return;
      }
      !l.polylines || l.polylines.rawVal[l.polylines.rawVal.length - 1].length === 0 || (l.polylines.val = [
        ...l.polylines.rawVal,
        []
      ]);
    }), a.addEventListener("pointermove", (u) => {
      var _a3, _b;
      const g = p(u);
      if (!g) return;
      c.setFromCamera(d, g);
      const w = Me();
      if (Oe.geometry.deleteAttribute("position"), w.length) {
        let m = w[0].point.clone();
        (u.ctrlKey || u.metaKey) && m.set(Math.round(m.x), Math.round(m.y), Math.round(m.z));
        {
          const k = ((_a3 = l.polylines) == null ? void 0 : _a3.rawVal) ?? [], M = k[k.length - 1] ?? [], $ = l.points.rawVal ?? [];
          if (M.length > 0) {
            const I = $[M[M.length - 1]];
            if (I) {
              const T = !!window.__hekatanOrthoMode;
              let N = zt;
              if (!N && T) {
                const F = Math.abs(m.x - I[0]), L = Math.abs(m.y - I[1]), j = Math.abs(m.z - I[2]);
                N = F >= L && F >= j ? "x" : L >= j ? "y" : "z";
              }
              N === "x" ? m.set(m.x, I[1], I[2]) : N === "y" ? m.set(I[0], m.y, I[2]) : N === "z" && m.set(I[0], I[1], m.z);
            }
          }
        }
        const v = Ki(m), E = (_b = window.__hekatanOsnapCompute) == null ? void 0 : _b.call(window, m.x, m.y, m.z, v, {
          x: u.clientX,
          y: u.clientY
        });
        if (E) m.set(E.x, E.y, E.z);
        else {
          const k = window.__hekatanSnapEnabled !== false, M = window.__hekatanSnap2D ?? 0.5;
          k && M > 0 && (m.x = Math.round(m.x / M) * M, m.y = Math.round(m.y / M) * M, m.z = Math.round(m.z / M) * M);
        }
        Oe.geometry.setAttribute("position", new Mt(m.toArray(), 3));
      }
      r();
    }), a.addEventListener("pointermove", (u) => {
      var _a3;
      const g = p(u);
      if (!g) return;
      c.setFromCamera(d, g);
      let w = false;
      const m = c.intersectObject(Ie), v = Me();
      if (m.length && v.length) {
        const E = new te(...l.points.rawVal[m[0].index]), k = new te(...v[0].point), M = E.sub(k), $ = (_a3 = v[0].face) == null ? void 0 : _a3.normal;
        $.transformDirection(f.matrixWorld), Math.abs(M.dot($)) < 1e-4 && (w = true);
      }
      Oe.visible = !w;
    });
    let ao = false, lo;
    a.addEventListener("pointermove", (u) => {
      var _a3;
      if (!Ws) return;
      const g = p(u);
      if (!g) return;
      c.setFromCamera(d, g);
      let w = false;
      const m = c.intersectObject(Ie), v = Me();
      if (m.length && v.length) {
        const k = new te(...l.points.rawVal[m[0].index]), M = new te(...v[0].point), $ = k.sub(M), I = (_a3 = v[0].face) == null ? void 0 : _a3.normal;
        I.transformDirection(f.matrixWorld), Math.abs($.dot(I)) < 1e-4 && (w = true);
      }
      if (w && Ws < 5 && (ao = true, n.enabled = false, lo = m[0].index), !ao || Ws % 2 !== 0) return;
      const E = [
        ...l.points.rawVal
      ];
      if (lo !== void 0) {
        let k = v[0].point;
        (u.ctrlKey || u.metaKey) && (k = new te(Math.round(k.x), Math.round(k.y), Math.round(k.z))), E[lo] = k.toArray();
      }
      l.points.val = E;
    }), a.addEventListener("pointerup", () => {
      n.enabled = true, ao = false;
    }), a.addEventListener("contextmenu", (u) => {
      var _a3;
      const g = p(u);
      if (!g) return;
      c.setFromCamera(d, g);
      let w = false;
      const m = c.intersectObject(Ie), v = Me();
      if (m.length && v.length) {
        const M = new te(...l.points.rawVal[m[0].index]), $ = new te(...v[0].point), I = M.sub($), T = (_a3 = v[0].face) == null ? void 0 : _a3.normal;
        T.transformDirection(f.matrixWorld), Math.abs(I.dot(T)) < 1e-4 && (w = true);
      }
      if (!w) return;
      const E = [
        ...l.points.rawVal
      ];
      if (E.splice(m[0].index, 1), l.points.val = E, !l.polylines) return;
      const k = l.polylines.rawVal.map((M) => M.filter(($) => $ !== m[0].index)).map((M) => M.map(($) => $ > m[0].index ? $ - 1 : $)).filter((M) => M.length);
      k.push([]), l.polylines.val = k;
    });
  }
  function Br(l, e, t) {
    const i = Math.round(14.999999999999998), o = {
      position: l.position.clone(),
      quaternion: l.quaternion.clone()
    }, a = setInterval(c, 1e3 / 30);
    let r = 0;
    function c() {
      r++;
      const d = r / i;
      l.position.lerpVectors(o.position, e.position, d), l.quaternion.slerpQuaternions(o.quaternion, e.quaternion, d), t && t(), r == i && clearInterval(a);
    }
  }
  function Hr(l, e, t, s) {
    const n = fr(t, l.elements, s);
    return we.derive(() => {
      n.visible = e.shellResults.val != "none";
    }), n;
  }
  const Xr = 6, xo = 10, Yr = 0.012;
  function jr(l) {
    return l.startsWith("contour:") ? l.slice(8) : null;
  }
  function Ur(l, e, t, s) {
    if (!t && !s) return null;
    if ([
      "normals",
      "shearsY",
      "shearsZ",
      "torsions",
      "bendingsY",
      "bendingsZ"
    ].includes(l) && t) {
      const i = t[l];
      if (i && i.has(e)) return i.get(e);
    }
    return null;
  }
  function qr(l, e, t, s) {
    const n = new ft(), i = new nl();
    i.setColorMap("rainbow");
    const o = new $t(), a = we.state([]);
    return we.derive(() => {
      var _a2, _b, _c2;
      e.deformedShape.val;
      const r = t.val, c = ((_a2 = l.elements) == null ? void 0 : _a2.val) ?? [], d = jr(e.frameResults.val);
      if (n.children.forEach((X) => {
        X.geometry && X.geometry.dispose(), X.material && X.material.dispose();
      }), n.clear(), !d || c.length === 0 || r.length === 0) {
        a.val = [];
        return;
      }
      const p = (_b = l.analyzeOutputs) == null ? void 0 : _b.val, f = (_c2 = l.deformOutputs) == null ? void 0 : _c2.val, x = [], b = [];
      for (let X = 0; X < c.length; X++) {
        if (c[X].length !== 2) continue;
        const re = Ur(d, X, p, f);
        re && (x.push(re[0], re[1]), b.push({
          idx: X,
          vals: re
        }));
      }
      if (x.length === 0) {
        a.val = [];
        return;
      }
      const C = Math.min(...x), _ = Math.max(...x);
      i.setMin(C), i.setMax(_), a.val = x;
      const S = [
        1 / 0,
        1 / 0,
        1 / 0
      ], A = [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ];
      for (const X of r) for (let Q = 0; Q < 3; Q++) S[Q] = Math.min(S[Q], X[Q]), A[Q] = Math.max(A[Q], X[Q]);
      const H = Math.max(A[0] - S[0], A[1] - S[1], A[2] - S[2], 1) * Yr, U = [], G = [], W = [];
      let V = 0;
      for (const { idx: X, vals: Q } of b) {
        const re = c[X], ue = r[re[0]], be = r[re[1]];
        if (!ue || !be) continue;
        const ae = new te(be[0] - ue[0], be[1] - ue[1], be[2] - ue[2]), ie = ae.length();
        if (ie < 1e-10) continue;
        ae.normalize();
        const le = Math.abs(ae.y) < 0.99 ? new te(0, 1, 0) : new te(1, 0, 0), he = new te().crossVectors(ae, le).normalize(), pe = new te().crossVectors(ae, he).normalize(), Se = xo + 1, ve = Xr;
        for (let Ae = 0; Ae < Se; Ae++) {
          const Ve = Ae / xo, ot = ue[0] + ae.x * ie * Ve, yt = ue[1] + ae.y * ie * Ve, Ce = ue[2] + ae.z * ie * Ve, ce = Q[0] + (Q[1] - Q[0]) * Ve, _e = i.getColor(ce) ?? new $t(0, 0, 0);
          o.copy(_e).convertSRGBToLinear();
          for (let ge = 0; ge < ve; ge++) {
            const xe = ge / ve * Math.PI * 2, Ne = Math.cos(xe), ze = Math.sin(xe);
            U.push(ot + (he.x * Ne + pe.x * ze) * H, yt + (he.y * Ne + pe.y * ze) * H, Ce + (he.z * Ne + pe.z * ze) * H), G.push(o.r, o.g, o.b);
          }
        }
        for (let Ae = 0; Ae < xo; Ae++) for (let Ve = 0; Ve < ve; Ve++) {
          const ot = (Ve + 1) % ve, yt = V + Ae * ve + Ve, Ce = V + Ae * ve + ot, ce = V + (Ae + 1) * ve + Ve, _e = V + (Ae + 1) * ve + ot;
          W.push(yt, Ce, _e), W.push(yt, _e, ce);
        }
        V += Se * ve;
      }
      if (U.length === 0) return;
      const q = new Fe();
      q.setAttribute("position", new Mt(U, 3)), q.setAttribute("color", new Mt(G, 3)), q.setIndex(W), q.computeVertexNormals();
      const D = new gt({
        vertexColors: true,
        side: Pt
      }), R = new pt(q, D);
      R.frustumCulled = false, n.add(R);
    }), n.__colorMapValues = a, n;
  }
  function Wr() {
    const l = window;
    return {
      forceUnit: l.__hekatanForceUnit ?? localStorage.getItem("hk_forceUnit") ?? "tonf",
      dispUnit: l.__hekatanDispUnit ?? localStorage.getItem("hk_dispUnit") ?? "mm",
      stressUnit: l.__hekatanStressUnit ?? localStorage.getItem("hk_stressUnit") ?? "tonf/m\xB2"
    };
  }
  const Zr = {
    kN: 1,
    tonf: 1 / 9.80665,
    kip: 1 / 4.4482216
  }, Kr = {
    mm: 1e3,
    cm: 100,
    m: 1,
    in: 39.3700787402
  }, Gr = {
    "kN/m\xB2": 1,
    kPa: 1,
    MPa: 1 / 1e3,
    GPa: 1 / 1e6,
    "kgf/cm\xB2": 1 / 98.0665,
    "tonf/m\xB2": 1 / 9.80665,
    psi: 1 / 6.89476,
    ksi: 1 / 6894.76,
    "kip/ft\xB2": 1 / 47.88026
  };
  function Ft(l, e = 4) {
    return l == null || !isFinite(l) ? "\u2014" : l === 0 ? "0" : Math.abs(l) < 1e-3 || Math.abs(l) > 1e5 ? l.toExponential(e) : l.toFixed(e);
  }
  const Jr = 16755200, Ra = 56831, Qr = 56831, ec = 56831, ki = 65382;
  function tc(l) {
    const e = new ft();
    e.name = "__hekatan_hover", e.renderOrder = 99;
    const t = new vn(1, 16, 16), s = new gt({
      color: Jr,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    }), n = new pt(t, s);
    n.visible = false, n.renderOrder = 100, e.add(n);
    const i = new Fe(), o = new mt({
      color: Ra,
      linewidth: 4,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    }), a = new is(i, o);
    a.visible = false, a.renderOrder = 100, e.add(a);
    const r = new gt({
      color: Ra,
      transparent: true,
      opacity: 0.7,
      depthTest: false
    }), c = new pt(new Sa(1, 1, 1, 12), r);
    c.visible = false, c.renderOrder = 100, e.add(c);
    const d = new Fe(), p = new gt({
      color: Qr,
      transparent: true,
      opacity: 0.45,
      side: Pt,
      depthTest: false
    }), f = new pt(d, p);
    f.visible = false, f.renderOrder = 100, e.add(f);
    const x = new Fe(), b = new mt({
      color: ec,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }), C = new is(x, b);
    C.visible = false, C.renderOrder = 100, e.add(C);
    const _ = new gt({
      color: ki,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    }), S = new gt({
      color: ki,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    }), A = new Sa(1, 1, 1, 12), P = new gt({
      color: ki,
      transparent: true,
      opacity: 0.55,
      side: Pt,
      depthTest: false
    }), H = new mt({
      color: ki,
      linewidth: 4,
      transparent: true,
      opacity: 1,
      depthTest: false
    }), U = [];
    window.__hekatanModelSelection = U;
    const G = new ft();
    G.renderOrder = 101, e.add(G);
    const W = document.createElement("div");
    Object.assign(W.style, {
      position: "absolute",
      pointerEvents: "none",
      padding: "5px 9px",
      fontSize: "11px",
      fontFamily: "Consolas, 'Courier New', monospace",
      background: "rgba(0, 0, 0, 0.88)",
      color: "#ffd166",
      border: "1px solid rgba(255, 200, 80, 0.5)",
      borderRadius: "4px",
      whiteSpace: "pre-line",
      zIndex: "9999",
      display: "none",
      transform: "translate(12px, 12px)",
      lineHeight: "1.35",
      maxWidth: "260px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
    }), W.classList.add("hekatan-hover-tooltip"), setTimeout(() => {
      l.rendererElm.parentElement && l.rendererElm.parentElement.appendChild(W);
    }, 0);
    function V(Ce) {
      const ce = l.derivedNodes.rawVal;
      return !ce || Ce < 0 || Ce >= ce.length ? null : new te(ce[Ce][0], ce[Ce][1], ce[Ce][2]);
    }
    function q(Ce, ce) {
      var _a2, _b, _c2, _d2, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r2, _s;
      const _e = l.getActiveCamera();
      if (!_e || !l.mesh) return null;
      const ge = l.rendererElm.getBoundingClientRect(), xe = Ce - ge.left, Ne = ce - ge.top, ze = l.derivedNodes.rawVal, Me = (_a2 = l.mesh.elements) == null ? void 0 : _a2.rawVal;
      if (!ze || !Me) return null;
      const Ie = /* @__PURE__ */ new Map(), Oe = (lt) => {
        if (Ie.has(lt)) return Ie.get(lt);
        const et = V(lt);
        if (!et) return Ie.set(lt, null), null;
        const Pe = et.clone().project(_e), st = (Pe.x * 0.5 + 0.5) * ge.width, De = (-Pe.y * 0.5 + 0.5) * ge.height, ht = {
          x: st,
          y: De,
          z: Pe.z
        };
        return Ie.set(lt, ht), ht;
      }, Ye = /* @__PURE__ */ new Set();
      for (const lt of Me) if (lt) for (const et of lt) Ye.add(et);
      const $e = 8;
      let Qe = -1, je = $e;
      for (let lt = 0; lt < ze.length; lt++) {
        if (!Ye.has(lt)) continue;
        const et = Oe(lt);
        if (!et || et.z < -1 || et.z > 1) continue;
        const Pe = et.x - xe, st = et.y - Ne, De = Math.sqrt(Pe * Pe + st * st);
        De < je && (je = De, Qe = lt);
      }
      const Ke = Wr(), Ee = Kr[Ke.dispUnit] ?? 1e3, Be = Zr[Ke.forceUnit] ?? 1;
      if (Qe >= 0) {
        const lt = ze[Qe];
        let et = `Nodo ${Qe}
(${lt[0].toFixed(3)}, ${lt[1].toFixed(3)}, ${lt[2].toFixed(3)})`;
        const Pe = (_c2 = (_b = l.mesh) == null ? void 0 : _b.deformOutputs) == null ? void 0 : _c2.rawVal;
        if (Pe == null ? void 0 : Pe.deformations) {
          const st = Pe.deformations.get(Qe);
          if (st && (et += `
\u2500\u2500\u2500\u2500 \u0394 desplaz. \u2500\u2500\u2500\u2500`, et += `
Ux = ${Ft(st[0] * Ee, 3)} ${Ke.dispUnit}`, et += `
Uy = ${Ft(st[1] * Ee, 3)} ${Ke.dispUnit}`, et += `
Uz = ${Ft(st[2] * Ee, 3)} ${Ke.dispUnit}`, (Math.abs(st[3]) > 1e-9 || Math.abs(st[4]) > 1e-9 || Math.abs(st[5]) > 1e-9) && (et += `
Rx = ${Ft(st[3] * 1e3, 3)} mrad`, et += `
Ry = ${Ft(st[4] * 1e3, 3)} mrad`, et += `
Rz = ${Ft(st[5] * 1e3, 3)} mrad`)), Pe.reactions) {
            const De = Pe.reactions.get(Qe);
            De && (Math.abs(De[0]) > 1e-9 || Math.abs(De[1]) > 1e-9 || Math.abs(De[2]) > 1e-9 || Math.abs(De[3]) > 1e-6 || Math.abs(De[4]) > 1e-6 || Math.abs(De[5]) > 1e-6) && (et += `
\u2500\u2500\u2500\u2500 R reacciones \u2500\u2500\u2500\u2500`, et += `
Fx = ${Ft(De[0] * Be)} ${Ke.forceUnit}`, et += `
Fy = ${Ft(De[1] * Be)} ${Ke.forceUnit}`, et += `
Fz = ${Ft(De[2] * Be)} ${Ke.forceUnit}`, (Math.abs(De[3]) > 1e-6 || Math.abs(De[4]) > 1e-6 || Math.abs(De[5]) > 1e-6) && (et += `
Mx = ${Ft(De[3] * Be)} ${Ke.forceUnit}\xB7m`, et += `
My = ${Ft(De[4] * Be)} ${Ke.forceUnit}\xB7m`, et += `
Mz = ${Ft(De[5] * Be)} ${Ke.forceUnit}\xB7m`));
          }
        }
        return {
          type: "node",
          idx: Qe,
          info: et
        };
      }
      const Rt = 5;
      let at = -1, At = Rt, qt = "frame";
      for (let lt = 0; lt < Me.length; lt++) {
        const et = Me[lt];
        if (!(!et || et.length < 2)) {
          if (et.length === 2) {
            const Pe = Oe(et[0]), st = Oe(et[1]);
            if (!Pe || !st || Pe.z < -1 || Pe.z > 1 || st.z < -1 || st.z > 1) continue;
            const De = sc(xe, Ne, Pe.x, Pe.y, st.x, st.y);
            De < At && (At = De, at = lt, qt = "frame");
          } else if (et.length === 3 || et.length === 4) {
            const Pe = [];
            let st = true;
            for (const De of et) {
              const ht = Oe(De);
              if (!ht || ht.z < -1 || ht.z > 1) {
                st = false;
                break;
              }
              Pe.push(ht);
            }
            if (!st) continue;
            if (nc(xe, Ne, Pe)) {
              const ht = Pe.reduce((rt, Tt) => rt + Tt.z, 0) / Pe.length * 1e-3;
              ht < At && (At = ht, at = lt, qt = "shell");
            }
          } else if (et.length === 8) {
            const Pe = [];
            let st = true;
            for (const Ge of et) {
              const nt = Oe(Ge);
              if (!nt || nt.z < -1 || nt.z > 1) {
                st = false;
                break;
              }
              Pe.push(nt);
            }
            if (!st) continue;
            const De = Math.min(...Pe.map((Ge) => Ge.x)), ht = Math.max(...Pe.map((Ge) => Ge.x)), rt = Math.min(...Pe.map((Ge) => Ge.y)), Tt = Math.max(...Pe.map((Ge) => Ge.y));
            if (xe >= De && xe <= ht && Ne >= rt && Ne <= Tt) {
              const nt = Pe.reduce((Wt, Dt) => Wt + Dt.z, 0) / Pe.length * 1e-3;
              nt < At && (At = nt, at = lt, qt = "solid");
            }
          }
        }
      }
      if (at >= 0) {
        const lt = Me[at];
        let Pe = `${qt === "frame" ? "Frame" : qt === "shell" ? "Shell" : "Solid"} ${at}`;
        const st = (_e2 = (_d2 = l.mesh) == null ? void 0 : _d2.elementInputs) == null ? void 0 : _e2.rawVal, De = (_g = (_f = st == null ? void 0 : st.sectionInfo) == null ? void 0 : _f.get) == null ? void 0 : _g.call(_f, at);
        if (De) {
          De.name && (Pe += `
  \u{1F4CB} ${De.name}`), De.shape && (Pe += `
  Shape: ${De.shape}`);
          const ht = /concrete|hormig|rect.*sólida/i.test(De.shape || ""), rt = ht ? 100 : 1e3, Tt = ht ? "cm" : "mm", Ge = (Wt) => {
            const Dt = Wt * rt;
            return Math.abs(Dt - Math.round(Dt)) < 0.05 ? `${Math.round(Dt)}` : `${Dt.toFixed(1)}`;
          }, nt = [];
          if (De.D != null && nt.push(`D=${Ge(De.D)}`), De.B != null && nt.push(`B=${Ge(De.B)}`), De.TF != null && nt.push(`TF=${Ge(De.TF)}`), De.TW != null && nt.push(`TW=${Ge(De.TW)}`), De.t != null && nt.push(`t=${Ge(De.t)}`), nt.length && (Pe += `
  Dim: ${nt.join(" ")} ${Tt}`), De.material) {
            let Wt = De.material;
            De.fillMaterial && (Wt += ` + FILL "${De.fillMaterial}"`), Pe += `
  Mat: ${Wt}`;
          }
        } else {
          const ht = (_i2 = (_h = st == null ? void 0 : st.sectionLabels) == null ? void 0 : _h.get) == null ? void 0 : _i2.call(_h, at), rt = (_k = (_j = st == null ? void 0 : st.materialTypes) == null ? void 0 : _j.get) == null ? void 0 : _k.call(_j, at);
          ht ? (Pe += `
  ${ht}`, rt && !ht.includes(rt) && (Pe += `  (${rt})`)) : rt && (Pe += `
  Material: ${rt}`);
        }
        if (Pe += `
nodos: [${lt.join(", ")}]`, qt === "shell" && ((_l2 = l.mesh) == null ? void 0 : _l2.analyzeOutputs)) {
          const ht = l.mesh.analyzeOutputs.rawVal, rt = Gr[Ke.stressUnit] ?? 1, Tt = [
            [
              "bendingXX",
              "Mxx",
              Be,
              `${Ke.forceUnit}\xB7m/m`
            ],
            [
              "bendingYY",
              "Myy",
              Be,
              `${Ke.forceUnit}\xB7m/m`
            ],
            [
              "bendingXY",
              "Mxy",
              Be,
              `${Ke.forceUnit}\xB7m/m`
            ],
            [
              "membraneXX",
              "Nxx",
              Be,
              `${Ke.forceUnit}/m`
            ],
            [
              "membraneYY",
              "Nyy",
              Be,
              `${Ke.forceUnit}/m`
            ],
            [
              "membraneXY",
              "Nxy",
              Be,
              `${Ke.forceUnit}/m`
            ],
            [
              "shearX",
              "Qx",
              Be,
              `${Ke.forceUnit}/m`
            ],
            [
              "shearY",
              "Qy",
              Be,
              `${Ke.forceUnit}/m`
            ],
            [
              "vonMises",
              "\u03C3VM",
              rt,
              Ke.stressUnit
            ],
            [
              "pressure",
              "p",
              rt,
              Ke.stressUnit
            ]
          ], Ge = [];
          for (const [nt, Wt, Dt, _t] of Tt) {
            const Ms = ht == null ? void 0 : ht[nt];
            if (Ms && Ms instanceof Map) {
              const Lt = Ms.get(at);
              if (Lt != null) {
                if (typeof Lt == "number") Ge.push(`${Wt} = ${Ft(Lt * Dt, 3)} ${_t}`);
                else if (Array.isArray(Lt)) {
                  let Ht = Lt[0];
                  for (const $s of Lt) Math.abs($s) > Math.abs(Ht) && (Ht = $s);
                  Ge.push(`${Wt} = ${Ft(Ht * Dt, 3)} ${_t}`);
                }
              }
            }
          }
          Ge.length > 0 && (Pe += `
\u2500\u2500\u2500\u2500 results \u2500\u2500\u2500\u2500
` + Ge.slice(0, 8).join(`
`));
        }
        if (qt === "frame" && ((_m = l.mesh) == null ? void 0 : _m.deformOutputs) && l.mesh.elementInputs) {
          const ht = l.mesh.deformOutputs.rawVal, rt = l.mesh.elementInputs.rawVal, Tt = ht == null ? void 0 : ht.deformations;
          if (Tt && lt.length === 2) {
            const Ge = Tt.get(lt[0]), nt = Tt.get(lt[1]), Wt = ze[lt[0]], Dt = ze[lt[1]];
            if (Ge && nt && Wt && Dt) {
              const _t = Dt[0] - Wt[0], Ms = Dt[1] - Wt[1], Lt = Dt[2] - Wt[2], Ht = Math.sqrt(_t * _t + Ms * Ms + Lt * Lt);
              if (Ht > 1e-9) {
                const $s = _t / Ht, Xs = Ms / Ht, Qn = Lt / Ht, Zt = (nt[0] - Ge[0]) * $s + (nt[1] - Ge[1]) * Xs + (nt[2] - Ge[2]) * Qn, Es = ((_n2 = rt.elasticities) == null ? void 0 : _n2.get(at)) ?? 0, Ys = ((_o2 = rt.areas) == null ? void 0 : _o2.get(at)) ?? 0, js = ((_p = rt.momentsOfInertiaY) == null ? void 0 : _p.get(at)) ?? 0, Us = ((_q = rt.momentsOfInertiaZ) == null ? void 0 : _q.get(at)) ?? 0, Sn = ((_r2 = rt.torsionalConstants) == null ? void 0 : _r2.get(at)) ?? 0, ji = ((_s = rt.shearModuli) == null ? void 0 : _s.get(at)) ?? Es / 2.6, Kt = Es * Ys * (Zt / Ht), Mn = (nt[3] - Ge[3]) * $s + (nt[4] - Ge[4]) * Xs + (nt[5] - Ge[5]) * Qn, qs = ji * Sn * (Mn / Ht), dn = nt[4] - Ge[4], hn = nt[5] - Ge[5], ms = Es * js * dn / Ht, un = Es * Us * hn / Ht;
                Pe += `
\u2500\u2500\u2500\u2500 frame \u2500\u2500\u2500\u2500`, Pe += `
L = ${Ft(Ht, 3)} m`, Pe += `
\u0394L = ${Ft(Zt * Ee, 3)} ${Ke.dispUnit}`, Pe += `
\u03B5 = ${Ft(Zt / Ht, 6)}`, Math.abs(Kt) > 1e-6 && (Pe += `
N \u2248 ${Ft(Kt * Be)} ${Ke.forceUnit}`), Math.abs(qs) > 1e-6 && (Pe += `
T \u2248 ${Ft(qs * Be)} ${Ke.forceUnit}\xB7m`), Math.abs(ms) > 1e-6 && (Pe += `
My \u2248 ${Ft(ms * Be)} ${Ke.forceUnit}\xB7m`), Math.abs(un) > 1e-6 && (Pe += `
Mz \u2248 ${Ft(un * Be)} ${Ke.forceUnit}\xB7m`);
              }
            }
          }
        }
        return {
          type: qt,
          idx: at,
          info: Pe
        };
      }
      return null;
    }
    function D(Ce, ce, _e) {
      var _a2, _b, _c2;
      if (n.visible = false, a.visible = false, c.visible = false, f.visible = false, C.visible = false, !Ce || !l.mesh) {
        W.style.display = "none", l.render();
        return;
      }
      const ge = (_a2 = l.mesh.elements) == null ? void 0 : _a2.rawVal;
      if (Ce.type === "node") {
        const Me = V(Ce.idx);
        if (Me) {
          const Ie = l.derivedNodes.rawVal ?? [];
          let Oe = 1;
          if (Ie.length >= 2) {
            let Qe = [
              1 / 0,
              1 / 0,
              1 / 0
            ], je = [
              -1 / 0,
              -1 / 0,
              -1 / 0
            ];
            for (const Ke of Ie) for (let Ee = 0; Ee < 3; Ee++) Ke[Ee] < Qe[Ee] && (Qe[Ee] = Ke[Ee]), Ke[Ee] > je[Ee] && (je[Ee] = Ke[Ee]);
            Oe = Math.max(je[0] - Qe[0], je[1] - Qe[1], je[2] - Qe[2], 0.1);
          }
          const Ye = ((_b = l.derivedDisplayScale) == null ? void 0 : _b.rawVal) ?? 1, $e = 0.021 * Oe * Ye;
          n.position.copy(Me), n.scale.setScalar($e), n.visible = true;
        }
      } else if (Ce.type === "frame" && ge) {
        const Me = ge[Ce.idx], Ie = V(Me[0]), Oe = V(Me[1]);
        if (Ie && Oe) {
          const Ye = Ie.clone().add(Oe).multiplyScalar(0.5), $e = Oe.clone().sub(Ie), Qe = $e.length(), je = Math.max(1e-4, 3.5 * ve(Ye));
          c.position.copy(Ye);
          const Ke = new te(0, 1, 0), Ee = Ke.clone().cross($e).normalize(), Be = Ke.angleTo($e);
          c.quaternion.setFromAxisAngle(Ee, Be), c.scale.set(je, Qe, je), c.visible = true;
        }
      } else if (Ce.type === "shell" && ge) {
        const Me = ge[Ce.idx], Ie = [], Oe = [];
        for (const Ye of Me) {
          const $e = V(Ye);
          if (!$e) return;
          Ie.push($e.x, $e.y, $e.z);
        }
        Me.length === 4 ? Oe.push(0, 1, 2, 0, 2, 3) : Me.length === 3 && Oe.push(0, 1, 2), d.setAttribute("position", new Mt(Ie, 3)), d.setIndex(Oe), d.computeVertexNormals(), f.visible = true;
      } else if (Ce.type === "solid" && ge) {
        const Me = ge[Ce.idx], Ie = [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            0
          ],
          [
            4,
            5
          ],
          [
            5,
            6
          ],
          [
            6,
            7
          ],
          [
            7,
            4
          ],
          [
            0,
            4
          ],
          [
            1,
            5
          ],
          [
            2,
            6
          ],
          [
            3,
            7
          ]
        ], Oe = [];
        for (const [Ye, $e] of Ie) {
          const Qe = V(Me[Ye]), je = V(Me[$e]);
          Qe && je && Oe.push(Qe.x, Qe.y, Qe.z, je.x, je.y, je.z);
        }
        x.setAttribute("position", new Mt(Oe, 3)), C.visible = true;
      }
      if (window.__hekatanShellTooltipVisible === true) {
        W.style.display = "none", l.render();
        return;
      }
      W.textContent = Ce.info, W.style.whiteSpace = "pre-line", W.style.display = "block";
      const Ne = l.rendererElm.getBoundingClientRect(), ze = ((_c2 = l.rendererElm.parentElement) == null ? void 0 : _c2.getBoundingClientRect()) ?? Ne;
      W.style.left = `${ce - ze.left}px`, W.style.top = `${_e - ze.top}px`, l.render();
    }
    let R = "", X = 0, Q = 0;
    const re = window.__hekatanHoverDebug ?? false, ue = (Ce) => {
      X && cancelAnimationFrame(X), X = requestAnimationFrame(() => {
        var _a2, _b, _c2;
        const ce = q(Ce.clientX, Ce.clientY);
        if (re && Q < 5) {
          const ge = l.derivedNodes.rawVal, xe = (_b = (_a2 = l.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
          console.log(`[hover] pointer (${Ce.clientX}, ${Ce.clientY}) nodes=${(ge == null ? void 0 : ge.length) ?? 0} elems=${(xe == null ? void 0 : xe.length) ?? 0} hover=`, ce), Q++;
        }
        const _e = ce ? `${ce.type}:${ce.idx}` : "";
        if (_e !== R) R = _e, D(ce, Ce.clientX, Ce.clientY);
        else if (ce) {
          const ge = ((_c2 = l.rendererElm.parentElement) == null ? void 0 : _c2.getBoundingClientRect()) ?? l.rendererElm.getBoundingClientRect();
          W.style.left = `${Ce.clientX - ge.left}px`, W.style.top = `${Ce.clientY - ge.top}px`;
        }
      });
    };
    let be = null;
    const ae = () => {
      R = "", n.visible = false, a.visible = false, c.visible = false, f.visible = false, C.visible = false, W.style.display = "none", l.render();
    }, ie = (Ce) => {
      const ce = l.rendererElm.getBoundingClientRect(), _e = Ce.clientX - ce.left, ge = Ce.clientY - ce.top;
      (_e < -2 || ge < -2 || _e > ce.width + 2 || ge > ce.height + 2) && (be && clearTimeout(be), be = window.setTimeout(ae, 200));
    }, le = () => {
      be && (clearTimeout(be), be = null);
    };
    l.rendererElm.addEventListener("pointermove", ue), l.rendererElm.addEventListener("pointerleave", ie), l.rendererElm.addEventListener("pointerenter", le);
    function he() {
      var _a2, _b, _c2;
      const Ce = ((_c2 = (_b = (_a2 = window.__hekatanCadState) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2)) == null ? void 0 : _c2.tool) ?? "select";
      return Ce === "select" || Ce === "none" || !Ce;
    }
    let pe = null;
    l.rendererElm.addEventListener("pointerdown", (Ce) => {
      Ce.button === 0 && (pe = {
        x: Ce.clientX,
        y: Ce.clientY
      });
    }), l.rendererElm.addEventListener("pointerup", (Ce) => {
      if (Ce.button !== 0 || !pe) return;
      const ce = Ce.clientX - pe.x, _e = Ce.clientY - pe.y;
      if (pe = null, ce * ce + _e * _e > 9 || !he()) return;
      const ge = q(Ce.clientX, Ce.clientY);
      ge ? (ot({
        type: ge.type,
        idx: ge.idx
      }, Ce.shiftKey), Ve()) : yt();
    }), window.addEventListener("keydown", (Ce) => {
      if (Ce.key !== "Escape" || !U.length) return;
      const ce = document.activeElement, _e = !!ce && (ce.id === "hk3-cmd-input" || ce.id === "hk-dyn-input") && ce.value === "";
      ce && (ce.tagName === "INPUT" || ce.tagName === "TEXTAREA" || ce.isContentEditable) && !_e || yt();
    }, {
      capture: true
    });
    function Se() {
      for (const Ce of G.children.slice()) {
        G.remove(Ce);
        const ce = Ce.geometry;
        ce && ce !== t && ce !== A && ce.dispose();
      }
    }
    const ve = (Ce) => {
      var _a2;
      const ce = l.getActiveCamera(), _e = ((_a2 = l.rendererElm) == null ? void 0 : _a2.clientHeight) || 700;
      return ce.isOrthographicCamera ? (ce.top - ce.bottom) / (ce.zoom || 1) / _e : 2 * ce.position.distanceTo(Ce) * Math.tan((ce.fov || 50) * Math.PI / 180 / 2) / _e;
    };
    function Ae(Ce, ce) {
      var _a2, _b;
      const _e = (_b = (_a2 = l.mesh) == null ? void 0 : _a2.elements) == null ? void 0 : _b.rawVal;
      if (Ce.type === "node") {
        const ge = V(Ce.idx);
        if (!ge) return;
        const xe = new pt(t, _);
        xe.position.copy(ge), xe.scale.setScalar(Math.max(1e-4, 7 * ve(ge))), xe.renderOrder = 101, G.add(xe);
      } else if (Ce.type === "frame" && _e) {
        const ge = _e[Ce.idx], xe = V(ge[0]), Ne = V(ge[1]);
        if (!xe || !Ne) return;
        const ze = xe.clone().add(Ne).multiplyScalar(0.5), Me = Ne.clone().sub(xe), Ie = Me.length(), Oe = Math.max(1e-4, 4 * ve(ze)), Ye = new pt(A, S);
        Ye.position.copy(ze);
        const $e = new te(0, 1, 0);
        Ye.quaternion.setFromAxisAngle($e.clone().cross(Me).normalize(), $e.angleTo(Me)), Ye.scale.set(Oe, Ie, Oe), Ye.renderOrder = 101, G.add(Ye);
      } else if (Ce.type === "shell" && _e) {
        const ge = _e[Ce.idx], xe = [], Ne = [];
        for (const Ie of ge) {
          const Oe = V(Ie);
          if (!Oe) return;
          xe.push(Oe.x, Oe.y, Oe.z);
        }
        ge.length === 4 ? Ne.push(0, 1, 2, 0, 2, 3) : ge.length === 3 && Ne.push(0, 1, 2);
        const ze = new Fe();
        ze.setAttribute("position", new Mt(xe, 3)), ze.setIndex(Ne), ze.computeVertexNormals();
        const Me = new pt(ze, P);
        Me.renderOrder = 101, G.add(Me);
      } else if (Ce.type === "solid" && _e) {
        const ge = _e[Ce.idx], xe = [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            2,
            3
          ],
          [
            3,
            0
          ],
          [
            4,
            5
          ],
          [
            5,
            6
          ],
          [
            6,
            7
          ],
          [
            7,
            4
          ],
          [
            0,
            4
          ],
          [
            1,
            5
          ],
          [
            2,
            6
          ],
          [
            3,
            7
          ]
        ], Ne = [];
        for (const [Ie, Oe] of xe) {
          const Ye = V(ge[Ie]), $e = V(ge[Oe]);
          Ye && $e && Ne.push(Ye.x, Ye.y, Ye.z, $e.x, $e.y, $e.z);
        }
        const ze = new Fe();
        ze.setAttribute("position", new Mt(Ne, 3));
        const Me = new is(ze, H);
        Me.renderOrder = 101, G.add(Me);
      }
    }
    function Ve() {
      if (Se(), !U.length || !l.mesh) {
        l.render();
        return;
      }
      const Ce = l.derivedNodes.rawVal ?? [];
      if (Ce.length >= 2) {
        const ce = [
          1 / 0,
          1 / 0,
          1 / 0
        ], _e = [
          -1 / 0,
          -1 / 0,
          -1 / 0
        ];
        for (const ge of Ce) for (let xe = 0; xe < 3; xe++) ge[xe] < ce[xe] && (ce[xe] = ge[xe]), ge[xe] > _e[xe] && (_e[xe] = ge[xe]);
        Math.max(_e[0] - ce[0], _e[1] - ce[1], _e[2] - ce[2], 0.1);
      }
      for (const ce of U) Ae(ce);
      l.render();
    }
    function ot(Ce, ce) {
      const _e = U.findIndex((ge) => ge.type === Ce.type && ge.idx === Ce.idx);
      _e >= 0 ? U.splice(_e, 1) : ce || U.push(Ce), U.length && U[U.length - 1];
    }
    function yt() {
      U.length = 0, Ve();
    }
    return we.derive(() => {
      l.derivedNodes.val, U.length && Ve();
    }), e;
  }
  function sc(l, e, t, s, n, i) {
    const o = n - t, a = i - s, r = o * o + a * a;
    if (r < 1e-9) {
      const b = l - t, C = e - s;
      return Math.sqrt(b * b + C * C);
    }
    let c = ((l - t) * o + (e - s) * a) / r;
    c = Math.max(0, Math.min(1, c));
    const d = t + c * o, p = s + c * a, f = l - d, x = e - p;
    return Math.sqrt(f * f + x * x);
  }
  function nc(l, e, t) {
    let s = false;
    for (let n = 0, i = t.length - 1; n < t.length; i = n++) {
      const o = t[n].x, a = t[n].y, r = t[i].x, c = t[i].y;
      a > e != c > e && l < (r - o) * (e - a) / (c - a + 1e-12) + o && (s = !s);
    }
    return s;
  }
  const ic = {
    normals: "Axial",
    torsions: "Torsi\xF3n",
    shearsY: "Cortante 2-2",
    shearsZ: "Cortante 3-3",
    bendingsY: "Momento 2-2",
    bendingsZ: "Momento 3-3"
  }, oc = {
    normals: "kN",
    torsions: "kN\xB7m",
    shearsY: "kN",
    shearsZ: "kN",
    bendingsY: "kN\xB7m",
    bendingsZ: "kN\xB7m"
  }, Os = 1e-3;
  function Dn(l, e) {
    return e === "XZ" ? {
      u: l[0],
      v: l[2],
      fuera: l[1]
    } : e === "YZ" ? {
      u: l[1],
      v: l[2],
      fuera: l[0]
    } : {
      u: l[0],
      v: l[1],
      fuera: l[2]
    };
  }
  function ac(l, e) {
    const t = Math.abs(e[0] - l[0]);
    return Math.abs(e[1] - l[1]) < Os ? {
      plano: "XZ",
      en: l[1]
    } : t < Os ? {
      plano: "YZ",
      en: l[0]
    } : {
      plano: "XY",
      en: l[2]
    };
  }
  function lc(l, e) {
    var _a2, _b;
    let t = null, s = {
      plano: "XZ",
      en: 0
    };
    const n = () => {
      var _a3, _b2;
      const A = ((_a3 = e == null ? void 0 : e.frameResults) == null ? void 0 : _a3.rawVal) ?? ((_b2 = e == null ? void 0 : e.frameResults) == null ? void 0 : _b2.val);
      return !A || A === "none" ? null : String(A).replace(/^contour:/, "");
    }, i = (A) => {
      var _a3, _b2;
      const P = ((_a3 = l.nodes) == null ? void 0 : _a3.rawVal) ?? [], H = ((_b2 = l.elements) == null ? void 0 : _b2.rawVal) ?? [], U = /* @__PURE__ */ new Set();
      for (const G of H) {
        if (G.length !== 2) continue;
        const W = P[G[0]], V = P[G[1]];
        if (!W || !V) continue;
        const q = Dn(W, A), D = Dn(V, A);
        Math.abs(q.fuera - D.fuera) < Os && U.add(Math.round(q.fuera * 1e3) / 1e3);
      }
      return [
        ...U
      ].sort((G, W) => G - W);
    };
    function o(A) {
      var _a3, _b2;
      if (A == null ? void 0 : A.plano) s = {
        plano: A.plano,
        en: A.en ?? i(A.plano)[0] ?? 0
      };
      else {
        const H = [
          ...window.__hekatanModelSelection ?? []
        ].reverse().find((W) => W.type === "frame"), U = ((_a3 = l.nodes) == null ? void 0 : _a3.rawVal) ?? [], G = ((_b2 = l.elements) == null ? void 0 : _b2.rawVal) ?? [];
        H && G[H.idx] && U[G[H.idx][0]] && U[G[H.idx][1]] ? s = ac(U[G[H.idx][0]], U[G[H.idx][1]]) : s = {
          plano: "XZ",
          en: i("XZ")[0] ?? 0
        };
      }
      t || a(), t.hidden = false, r();
    }
    function a() {
      t = document.createElement("div"), t.id = "hk-diagrama-2d", t.style.cssText = [
        "position:fixed",
        "left:50%",
        "top:70px",
        "transform:translateX(-50%)",
        "width:min(900px,92vw)",
        "height:min(560px,78vh)",
        "z-index:9990",
        "background:#0b0e14",
        "border:1px solid #2f3b50",
        "border-radius:8px",
        "box-shadow:0 12px 40px rgba(0,0,0,.6)",
        "display:flex",
        "flex-direction:column",
        "font:12px 'Segoe UI',system-ui,sans-serif",
        "color:#c9d3e0"
      ].join(";"), t.innerHTML = `
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
        s = {
          plano: A.value,
          en: i(A.value)[0] ?? 0
        }, r();
      }), P.addEventListener("change", () => {
        s.en = Number(P.value), r();
      });
      const H = (W) => {
        const V = i(s.plano), q = V.findIndex((R) => Math.abs(R - s.en) < Os), D = Math.max(0, Math.min(V.length - 1, (q < 0 ? 0 : q) + W));
        V.length && (s.en = V[D], r());
      };
      t.querySelector(".hk-d2-ant").addEventListener("click", () => H(-1)), t.querySelector(".hk-d2-sig").addEventListener("click", () => H(1));
      const U = t.querySelector(".hk-d2-bar");
      let G = null;
      U.addEventListener("pointerdown", (W) => {
        if (W.target.closest("select,button")) return;
        const V = t.getBoundingClientRect();
        G = {
          x: W.clientX,
          y: W.clientY,
          l: V.left,
          t: V.top
        }, t.style.transform = "none", t.style.left = V.left + "px", t.style.top = V.top + "px";
      }), window.addEventListener("pointermove", (W) => {
        !G || !t || (t.style.left = G.l + W.clientX - G.x + "px", t.style.top = G.t + W.clientY - G.y + "px");
      }), window.addEventListener("pointerup", () => {
        G = null;
      }), new ResizeObserver(() => {
        t && !t.hidden && r();
      }).observe(t);
    }
    function r() {
      var _a3, _b2, _c2, _d2, _e2, _f, _g, _h;
      if (!t || t.hidden) return;
      const A = new Set(p && !p.hidden && f >= 0 ? b(f) : []), P = t.querySelector(".hk-d2-svg"), H = t.querySelector(".hk-d2-tit"), U = t.querySelector(".hk-d2-pie"), G = t.querySelector(".hk-d2-plano"), W = t.querySelector(".hk-d2-en");
      G.value = s.plano;
      const V = i(s.plano), q = s.plano === "XZ" ? "y" : s.plano === "YZ" ? "x" : "z", D = s.plano === "XY" ? "Planta" : "P\xF3rtico";
      W.innerHTML = V.map((Ee, Be) => `<option value="${Ee}" ${Math.abs(Ee - s.en) < Os ? "selected" : ""}>${D} ${Be + 1} \xB7 ${q} = ${Ee.toFixed(2)} m</option>`).join("");
      const R = n(), X = ((_a3 = l.nodes) == null ? void 0 : _a3.rawVal) ?? [], Q = ((_b2 = l.elements) == null ? void 0 : _b2.rawVal) ?? [], re = R ? (_d2 = (_c2 = l.analyzeOutputs) == null ? void 0 : _c2.rawVal) == null ? void 0 : _d2[R] : null;
      P.innerHTML = "";
      const ue = P.clientWidth || 880, be = P.clientHeight || 480, ae = [];
      if (Q.forEach((Ee, Be) => {
        if (Ee.length !== 2) return;
        const Rt = X[Ee[0]], at = X[Ee[1]];
        if (!Rt || !at) return;
        const At = Dn(Rt, s.plano), qt = Dn(at, s.plano);
        Math.abs(At.fuera - s.en) < Os && Math.abs(qt.fuera - s.en) < Os && ae.push({
          i: Be,
          a: At,
          b: qt
        });
      }), !ae.length) {
        U.textContent = "No hay barras en este plano.", H.textContent = "";
        return;
      }
      let ie = 1 / 0, le = -1 / 0, he = 1 / 0, pe = -1 / 0;
      for (const Ee of ae) for (const Be of [
        Ee.a,
        Ee.b
      ]) ie = Math.min(ie, Be.u), le = Math.max(le, Be.u), he = Math.min(he, Be.v), pe = Math.max(pe, Be.v);
      const Se = le - ie || 1, ve = pe - he || 1, Ae = 0.12 * Math.max(Se, ve), Ve = 46, ot = Math.min((ue - 2 * Ve) / (Se + 2 * Ae), (be - 2 * Ve) / (ve + 2 * Ae)), yt = (ue - Se * ot) / 2, Ce = (be - ve * ot) / 2, ce = (Ee) => yt + (Ee - ie) * ot, _e = (Ee) => be - (Ce + (Ee - he) * ot), ge = "http://www.w3.org/2000/svg", xe = (Ee, Be, Rt) => {
        const at = document.createElementNS(ge, Ee);
        for (const At in Be) at.setAttribute(At, String(Be[At]));
        return Rt != null && (at.textContent = Rt), P.appendChild(at), at;
      }, Ne = /* @__PURE__ */ new Map();
      for (const Ee of ae) {
        const Be = ((_h = (_g = (_f = (_e2 = l.elementInputs) == null ? void 0 : _e2.rawVal) == null ? void 0 : _f.localAngles) == null ? void 0 : _g.get) == null ? void 0 : _h.call(_g, Ee.i)) ?? 0, Rt = Dn(rl(R ?? "normals", ll(X[Q[Ee.i][0]], X[Q[Ee.i][1]], Be)), s.plano), at = Math.hypot(Rt.u, Rt.v);
        Ne.set(Ee.i, at > 0.3 ? [
          Rt.u / at,
          -Rt.v / at
        ] : null);
      }
      const ze = ae.filter((Ee) => !Ne.get(Ee.i)).length;
      let Me = 0;
      if (re) for (const Ee of ae) {
        if (!Ne.get(Ee.i)) continue;
        const Be = re instanceof Map ? re.get(Ee.i) : re[Ee.i];
        Be && (Me = Math.max(Me, Math.abs(Be[0] ?? 0), Math.abs(Be[1] ?? 0)));
      }
      const Ie = 0.12 * Math.max(Se, ve) * ot, Oe = Me > 0 ? Ie / Me : 0, Ye = R === "bendingsY" || R === "bendingsZ", $e = (Ee) => Math.abs(Ee) >= 100 ? Ee.toFixed(1) : Math.abs(Ee) >= 10 ? Ee.toFixed(2) : Ee.toFixed(3), Qe = [];
      for (const Ee of ae) {
        const Be = ce(Ee.a.u), Rt = _e(Ee.a.v), at = ce(Ee.b.u), At = _e(Ee.b.v), qt = Ne.get(Ee.i), [lt, et] = qt ?? [
          0,
          0
        ], Pe = re && qt ? re instanceof Map ? re.get(Ee.i) : re[Ee.i] : null, [st, De] = Pe ? $o(R, Pe) : [
          0,
          0
        ];
        if (Pe && Oe > 0) {
          const Ge = [
            Be + lt * st * Oe * 1,
            Rt + et * st * Oe * 1
          ], nt = [
            at + lt * De * Oe * 1,
            At + et * De * Oe * 1
          ], _t = st + De >= 0 ? "#3fa7d6" : "#d9534f";
          xe("polygon", {
            points: `${Be},${Rt} ${Ge[0]},${Ge[1]} ${nt[0]},${nt[1]} ${at},${At}`,
            fill: _t,
            "fill-opacity": 0.38,
            stroke: _t,
            "stroke-width": 1.2
          }), Qe.push({
            x: Ge[0] + lt * 12,
            y: Ge[1] + et * 12,
            t: $e(st),
            peso: Math.abs(st)
          }), Qe.push({
            x: nt[0] + lt * 12,
            y: nt[1] + et * 12,
            t: $e(De),
            peso: Math.abs(De)
          });
        }
        xe("line", {
          x1: Be,
          y1: Rt,
          x2: at,
          y2: At,
          stroke: "#e6ecf5",
          "stroke-width": 2.2,
          "stroke-linecap": "round"
        }), A.has(Ee.i) && xe("line", {
          x1: Be,
          y1: Rt,
          x2: at,
          y2: At,
          stroke: "#e6c463",
          "stroke-width": 5,
          "stroke-linecap": "round"
        });
        const ht = xe("line", {
          x1: Be,
          y1: Rt,
          x2: at,
          y2: At,
          stroke: "transparent",
          "stroke-width": 14,
          style: "cursor:pointer;pointer-events:stroke"
        });
        ht.addEventListener("click", () => C(Ee.i));
        const rt = document.createElementNS(ge, "title");
        rt.textContent = "Clic: gr\xE1fico de esta barra (axil, cortante, momento)", ht.appendChild(rt);
      }
      for (const Ee of ae) for (const Be of [
        Ee.a,
        Ee.b
      ]) s.plano !== "XY" && Math.abs(Be.v - he) < Os && xe("rect", {
        x: ce(Be.u) - 6,
        y: _e(Be.v),
        width: 12,
        height: 7,
        fill: "#b03a3a"
      });
      const je = [];
      Qe.sort((Ee, Be) => Be.peso - Ee.peso);
      for (const Ee of Qe) Ee.peso < 0.02 * Me || je.some((Be) => Math.hypot(Be.x - Ee.x, Be.y - Ee.y) < 34) || (je.push(Ee), xe("text", {
        x: Ee.x,
        y: Ee.y + 4,
        "text-anchor": "middle",
        fill: "#f2f5fa",
        "font-size": 12,
        "font-weight": 600,
        "paint-order": "stroke",
        stroke: "#0b0e14",
        "stroke-width": 3
      }, Ee.t));
      const Ke = R ? ic[R] ?? R : "sin resultado";
      H.textContent = `${Ke} \xB7 ${s.plano === "XY" ? "planta" : "alzado"} ${s.plano} en ${q} = ${s.en.toFixed(2)} m`, U.textContent = R ? `${ae.length} barras en el plano \xB7 m\xE1ximo ${$e(Me)} ${oc[R] ?? ""}` + (Ye ? " \xB7 el momento va del lado de la tracci\xF3n" : "") + (ze ? ` \xB7 ${ze} barra(s) con este resultado en otro plano (sin dibujar)` : "") + " \xB7 clic en una barra: su gr\xE1fico" : "Eleg\xED un resultado en \xABFrame results\xBB (Axial, Cortante, Momento) para ver su diagrama aqu\xED.";
    }
    const c = () => {
      try {
        r();
      } catch {
      }
    };
    (e == null ? void 0 : e.frameResults) && ((_b = (_a2 = window.van) == null ? void 0 : _a2.derive) == null ? void 0 : _b.call(_a2, () => {
      e.frameResults.val, c();
    }));
    let d = null;
    setInterval(() => {
      var _a3, _b2;
      const A = (_a3 = l.analyzeOutputs) == null ? void 0 : _a3.rawVal, P = (_b2 = e == null ? void 0 : e.frameResults) == null ? void 0 : _b2.rawVal, H = [
        A,
        P
      ];
      if (!(d && d[0] === A && d[1] === P)) {
        d = H, c();
        try {
          S();
        } catch {
        }
      }
    }, 400);
    let p = null, f = -1, x = "12";
    function b(A) {
      var _a3, _b2;
      const P = ((_a3 = l.nodes) == null ? void 0 : _a3.rawVal) ?? [], H = ((_b2 = l.elements) == null ? void 0 : _b2.rawVal) ?? [], U = /* @__PURE__ */ new Map();
      H.forEach((q, D) => {
        if (q.length === 2) for (const R of q) U.has(R) || U.set(R, []), U.get(R).push(D);
      });
      const G = (q) => {
        const D = P[H[q][0]], R = P[H[q][1]], X = [
          R[0] - D[0],
          R[1] - D[1],
          R[2] - D[2]
        ], Q = Math.hypot(X[0], X[1], X[2]) || 1;
        return X.map((re) => re / Q);
      }, W = (q, D) => {
        const R = G(q), X = G(D);
        return Math.abs(R[0] * X[0] + R[1] * X[1] + R[2] * X[2]) > 0.9999;
      }, V = [
        A
      ];
      for (const q of [
        0,
        1
      ]) {
        let D = A, R = H[A][q];
        for (let X = 0; X < 500; X++) {
          const Q = (U.get(R) ?? []).filter((ue) => ue !== D);
          if (Q.length !== 1 || !W(D, Q[0])) break;
          const re = Q[0];
          q === 0 ? V.unshift(re) : V.push(re), R = H[re][0] === R ? H[re][1] : H[re][0], D = re;
        }
      }
      return V;
    }
    function C(A) {
      if (A == null) {
        const H = [
          ...window.__hekatanModelSelection ?? []
        ].reverse().find((U) => U.type === "frame");
        if (!H) {
          alert("Design\xE1 una barra (clic sobre ella) y volv\xE9 a pulsar.");
          return;
        }
        A = H.idx;
      }
      f = A, p || (p = document.createElement("div"), p.id = "hk-diagrama-barra", p.style.cssText = [
        "position:fixed",
        "right:24px",
        "top:90px",
        "width:min(620px,92vw)",
        "z-index:9991",
        "background:#0b0e14",
        "border:1px solid #2f3b50",
        "border-radius:8px",
        "box-shadow:0 12px 40px rgba(0,0,0,.6)",
        "font:12px 'Segoe UI',system-ui,sans-serif",
        "color:#c9d3e0"
      ].join(";"), p.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50"><b style="color:#e6c463;white-space:nowrap">\u{1F4C8} Barra</b><span class="hk-b-tit" style="color:#9fb0c6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto"></span><select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"><option value="12">plano 1-2 (V2 \xB7 M3)</option><option value="13">plano 1-3 (V3 \xB7 M2)</option></select><button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">\u2715</button></div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>', document.body.appendChild(p), p.querySelector(".hk-b-x").addEventListener("click", () => {
        p.hidden = true, _(), r();
      }), p.querySelector(".hk-b-pl").addEventListener("change", (P) => {
        x = P.target.value, S();
      })), p.hidden = false, _(), S(), r();
    }
    function _() {
      if (!t || !p) return;
      const A = window.innerWidth, P = Math.min(560, Math.round(A * 0.4));
      p.style.width = P + "px", !p.hidden && !t.hidden ? (t.style.transform = "none", t.style.left = "12px", t.style.width = A - P - 36 + "px", p.style.top = t.getBoundingClientRect().top + "px") : t.hidden || (t.style.left = "50%", t.style.transform = "translateX(-50%)", t.style.width = "min(900px,92vw)");
    }
    function S() {
      var _a3, _b2, _c2;
      if (!p || p.hidden || f < 0) return;
      const A = ((_a3 = l.nodes) == null ? void 0 : _a3.rawVal) ?? [], P = ((_b2 = l.elements) == null ? void 0 : _b2.rawVal) ?? [], H = ((_c2 = l.analyzeOutputs) == null ? void 0 : _c2.rawVal) ?? {};
      if (!P[f]) return;
      const U = b(f), G = [];
      let W = 0, V = -1;
      U.forEach((le, he) => {
        const [pe, Se] = P[le], ve = he === 0 ? U.length > 1 && P[U[1]].includes(pe) : pe !== V, Ae = ve ? Se : pe, Ve = ve ? pe : Se, ot = Math.hypot(A[Ve][0] - A[Ae][0], A[Ve][1] - A[Ae][1], A[Ve][2] - A[Ae][2]);
        G.push({
          x: W,
          e: le,
          fin: ve ? 1 : 0
        }), W += ot, G.push({
          x: W,
          e: le,
          fin: ve ? 0 : 1
        }), V = Ve;
      });
      const q = W, D = (le, he) => {
        const pe = H[le], Se = pe ? pe instanceof Map ? pe.get(he.e) : pe[he.e] : null;
        return Se ? $o(le, Se)[he.fin] : 0;
      }, R = A[P[U[0]][0]], X = (le) => le.toFixed(2);
      p.querySelector(".hk-b-tit").textContent = "L = " + q.toFixed(2) + " m \xB7 " + U.length + " tramo(s) \xB7 desde (" + X(R[0]) + ", " + X(R[1]) + ", " + X(R[2]) + ")";
      const Q = x === "12" ? [
        [
          "normals",
          "Axial P",
          "kN",
          false
        ],
        [
          "shearsY",
          "Cortante V2",
          "kN",
          false
        ],
        [
          "bendingsZ",
          "Momento M3",
          "kN\xB7m",
          true
        ]
      ] : [
        [
          "normals",
          "Axial P",
          "kN",
          false
        ],
        [
          "shearsZ",
          "Cortante V3",
          "kN",
          false
        ],
        [
          "bendingsY",
          "Momento M2",
          "kN\xB7m",
          true
        ]
      ], re = p.querySelector(".hk-b-cuerpo");
      re.innerHTML = "";
      const ue = Math.max(300, re.clientWidth), be = 124, ae = 46, ie = (be - 14) / 2;
      for (const [le, he, pe, Se] of Q) {
        const ve = G.map((Me) => D(le, Me)), Ae = Math.max(...ve), Ve = Math.min(...ve), ot = Math.max(Math.abs(Ae), Math.abs(Ve)) || 1, yt = (Me) => ae + Me / (q || 1) * (ue - 2 * ae), Ce = (Me) => ie + (Se ? 1 : -1) * (Me / ot) * (ie - 16), ce = (Me) => Math.abs(Me) >= 100 ? Me.toFixed(1) : Math.abs(Me) >= 10 ? Me.toFixed(2) : Me.toFixed(3);
        let _e = yt(0) + "," + ie + " ";
        G.forEach((Me, Ie) => {
          _e += yt(Me.x) + "," + Ce(ve[Ie]) + " ";
        }), _e += yt(q) + "," + ie;
        const ge = ve.indexOf(Ae), xe = ve.indexOf(Ve), Ne = (Me, Ie) => {
          const Oe = Ce(ve[Me]) + (Ce(ve[Me]) < ie ? -5 : 13);
          return '<text x="' + yt(G[Me].x) + '" y="' + Oe + '" text-anchor="middle" fill="' + Ie + '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' + ce(ve[Me]) + "</text>";
        }, ze = Se ? "#d9534f" : "#3fa7d6";
        re.insertAdjacentHTML("beforeend", '<div style="display:flex;justify-content:space-between;margin-top:4px"><b style="color:#dbe6f5">' + he + ' <span style="color:#6f7d90;font-weight:400">(' + pe + ')</span></b><span style="color:#9fb0c6">m\xE1x ' + ce(Ae) + " \xB7 m\xEDn " + ce(Ve) + (Se ? " \xB7 positivo hacia abajo" : "") + '</span></div><svg width="' + ue + '" height="' + be + '" style="display:block;background:#0e131c;border-radius:4px"><line x1="' + ae + '" y1="' + ie + '" x2="' + (ue - ae) + '" y2="' + ie + '" stroke="#e6ecf5" stroke-width="2"/><polygon points="' + _e + '" fill="' + ze + '" fill-opacity=".35" stroke="' + ze + '" stroke-width="1.4"/>' + Ne(0, "#f2f5fa") + Ne(G.length - 1, "#f2f5fa") + (ge > 0 && ge < G.length - 1 ? Ne(ge, "#8fd3ff") : "") + (xe > 0 && xe < G.length - 1 && xe !== ge ? Ne(xe, "#ff9f9a") : "") + '<text x="' + ae + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text><text x="' + (ue - ae) + '" y="' + (be - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' + q.toFixed(2) + " m</text></svg>");
      }
    }
    return window.__hekatanDiagramaBarra = C, window.__hekatanDiagrama2D = o, {
      abrir: o,
      abrirBarra: C
    };
  }
  Da = function(l, e = 8) {
    const t = document.createElement("div");
    t.id = "legend";
    const s = document.createElement("div");
    s.style.cssText = "position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:11px;color:#bbb;white-space:nowrap;font-family:monospace", t.appendChild(s), setTimeout(() => {
      we.derive(() => {
        s.textContent = Eo.val ? `[${Eo.val}]` : "";
      });
    });
    const n = document.createElement("div");
    t.appendChild(n);
    let i = [], o = -1;
    function a(r) {
      if (r !== o) {
        o = r, t.style.setProperty("--legend-n", String(r)), n.innerHTML = "", i = [];
        for (let c = 0; c <= r; c++) {
          const d = document.createElement("div");
          d.className = "marker", d.style.marginTop = c === 0 ? "0px" : "calc(var(--legend-h) / var(--legend-n) - 1px)";
          const p = document.createElement("p");
          d.append(p), n.append(d), i.push(p);
        }
      }
    }
    return setTimeout(() => {
      we.derive(() => {
        const r = Cn(Is.val);
        a(r ? 15 : e), t.style.background = ur(), t.classList.toggle("legend-discrete", r), Array.from({
          length: o + 1
        }, (d, p) => p / o).reverse().forEach((d, p) => {
          const f = i[p];
          f && (f.innerText = rc(l.val, d).toString());
        });
      });
    }), t;
  };
  function rc(l, e) {
    const t = jn.val;
    if (t) {
      if (Cn(Is.val)) {
        const o = Math.min(t[0], t[1]), a = Math.max(t[0], t[1]);
        return bo(o + e * (a - o));
      }
      return bo(t[0] + e * (t[1] - t[0]));
    }
    const s = l.filter((o) => Number.isFinite(o));
    if (s.length === 0) return "0";
    const [n, i] = Po(s);
    return bo(n + e * (i - n));
  }
  function bo(l) {
    if (!Number.isFinite(l)) return "\u2014";
    if (l === 0) return "0";
    const e = Math.abs(l);
    return e < 1e-3 || e >= 1e5 ? l.toExponential(2) : l.toPrecision(3);
  }
  bd = function({ mesh: l, settingsObj: e, drawingObj: t, objects3D: s, solids: n }) {
    rr.DEFAULT_UP = new te(0, 0, 1);
    const i = document.createElement("div"), o = new ir(), a = new or(45, 1, 0.1, 2 * 1e6), r = new ar(-10, 10, 10, -10, -1e3, 2e6);
    let c = a;
    const d = new lr({
      antialias: true
    });
    d.localClippingEnabled = true;
    const p = new Ma(a, d.domElement);
    p.enableDamping = true, p.dampingFactor = 0.1, p.screenSpacePanning = true, p.zoomSpeed = 0.8, p.panSpeed = 1.2, p.rotateSpeed = 0.9, p.keyPanSpeed = 12, p.listenToKeyEvents(window), p.touches = {
      ONE: bi.ROTATE,
      TWO: bi.DOLLY_PAN
    }, d.domElement.addEventListener("wheel", (ce) => {
      if (!ce.ctrlKey && Math.abs(ce.deltaX) > Math.abs(ce.deltaY) * 1.5) {
        ce.preventDefault();
        const _e = p.target, ge = new te().subVectors(a.position, _e), xe = new te();
        xe.crossVectors(a.up, ge).normalize();
        const ze = ge.length() * 1e-3 * p.panSpeed;
        _e.addScaledVector(xe, ce.deltaX * ze), a.position.addScaledVector(xe, ce.deltaX * ze), p.update();
      }
    }, {
      passive: false
    });
    const f = new mo(new te(-1, 0, 0), 0), x = new mo(new te(0, -1, 0), 0), b = new mo(new te(0, 0, -1), 0);
    window.__hekatanClip = window.__hekatanClip ?? {
      enableX: false,
      enableY: false,
      enableZ: false,
      posX: 0,
      posY: 0,
      posZ: 0,
      invertX: false,
      invertY: false,
      invertZ: false
    };
    function C() {
      const ce = window.__hekatanClip, _e = [];
      ce.enableX && (f.normal.set(ce.invertX ? 1 : -1, 0, 0), f.constant = ce.invertX ? -ce.posX : ce.posX, _e.push(f)), ce.enableY && (x.normal.set(0, ce.invertY ? 1 : -1, 0), x.constant = ce.invertY ? -ce.posY : ce.posY, _e.push(x)), ce.enableZ && (b.normal.set(0, 0, ce.invertZ ? 1 : -1), b.constant = ce.invertZ ? -ce.posZ : ce.posZ, _e.push(b)), d.clippingPlanes = _e, o.traverse((xe) => {
        const Ne = xe;
        if (Ne.material) {
          const ze = Array.isArray(Ne.material) ? Ne.material : [
            Ne.material
          ];
          for (const Me of ze) Me.clippingPlanes = _e, Me.needsUpdate = true;
        }
      });
      const ge = window.__hekatanPanes ?? [];
      for (const xe of ge) try {
        xe && typeof xe.refresh == "function" && xe.refresh();
      } catch {
      }
      d.render(o, c);
    }
    C(), window.__hekatanClipApply = C;
    const _ = gr(e), S = we.derive(() => Math.pow(10, _.displayScale.val / 10)), A = cc(l, _), P = () => {
      const ce = [];
      return _.gridXY.rawVal && ce.push("xy"), _.gridXZ.rawVal && ce.push("xz"), _.gridYZ.rawVal && ce.push("yz"), ce;
    }, H = () => {
      const ce = _.gridStep.rawVal, _e = Math.max(ce, _.gridMajor.rawVal);
      return {
        planes: P(),
        majorStep: _e,
        minorStep: ce
      };
    };
    let U = yo(_.gridSize.rawVal, H());
    U.visible = _.gridVisible.rawVal, window.__hekatanSnap2D = _.cursorSnap.rawVal;
    const G = () => {
      const ce = Math.max(0, Math.min(1, _.gridOpacity.rawVal));
      U.traverse((_e) => {
        const ge = _e.material;
        if (!ge || !("opacity" in ge)) return;
        const xe = _e.name ?? "";
        let Ne = 0.55;
        xe.includes("border") ? Ne = 1 : xe.includes("major") && (Ne = 0.95), ge.opacity = ce * Ne;
      });
    };
    G(), i.appendChild(mr(_, l, n)), i.setAttribute("id", "viewer"), i.appendChild(d.domElement), d.setPixelRatio(window.devicePixelRatio);
    const W = Hs();
    d.setClearColor(W.background, 1);
    const V = _.gridSize.rawVal, q = V * 0.5 + V * 0.5 / Math.tan(45 * 0.5);
    a.position.set(0, 0, q), a.up.set(0, 1, 0), p.target.set(0, 0, 0), p.minDistance = 0.1, p.maxDistance = 1e4, i.__settings = _, p.zoomSpeed = 1, p._getZoomScale = function() {
      return Math.pow(0.95, this.zoomSpeed);
    }, p.update();
    let D = Pa(_.gridSize.rawVal, _.flipAxes.rawVal);
    o.add(U, D), we.derive(() => {
      window.__hekatanGridPlaneXY = _.gridXY.val, window.__hekatanGridPlaneXZ = _.gridXZ.val, window.__hekatanGridPlaneYZ = _.gridYZ.val;
    });
    let R = true;
    we.derive(() => {
      const ce = _.gridVisible.val;
      if (R) {
        R = false;
        return;
      }
      U.visible = ce, le();
    });
    let X = true;
    we.derive(() => {
      if (_.gridOpacity.val, X) {
        X = false;
        return;
      }
      G(), le();
    }), we.derive(() => {
      const ce = _.cursorSnap.val;
      window.__hekatanSnap2D = ce;
    });
    let Q = true;
    we.derive(() => {
      var _a2, _b, _c2;
      const ce = _.gridSize.val, _e = _.flipAxes.val;
      if (_.gridXY.val, _.gridXZ.val, _.gridYZ.val, _.gridStep.val, _.gridMajor.val, Q) {
        Q = false;
        return;
      }
      o.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (ze) => {
        var _a3, _b2, _c3, _d2;
        (_b2 = (_a3 = ze.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d2 = (_c3 = ze.material) == null ? void 0 : _c3.dispose) == null ? void 0 : _d2.call(_c3);
      }), U = yo(ce, H()), U.visible = _.gridVisible.rawVal, o.add(U), G(), o.remove(D), D.traverse((ze) => {
        var _a3, _b2, _c3, _d2;
        (_b2 = (_a3 = ze.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), (_d2 = (_c3 = ze.material) == null ? void 0 : _c3.dispose) == null ? void 0 : _d2.call(_c3);
      }), D = Pa(ce, _e), o.add(D);
      const ge = ce * 0.5 + ce * 0.5 / Math.tan(45 * 0.5);
      a.position.distanceTo(p.target);
      const xe = Math.abs(a.position.x) < 0.1 && Math.abs(a.position.y) < 0.1 && a.position.z > 0;
      (((_b = l == null ? void 0 : l.nodes) == null ? void 0 : _b.rawVal) ?? ((_c2 = l == null ? void 0 : l.nodes) == null ? void 0 : _c2.val) ?? []).length > 0 || (xe ? a.position.set(0, 0, ge) : a.position.set(0.5 * ce, -ge, 0.5 * ce), p.target.set(0, 0, 0)), p.minDistance = Math.max(0.05, ce * 0.01), p.maxDistance = Math.max(50, ce * 50), p.update(), le();
    }), new ResizeObserver((ce) => {
      var _a2, _b;
      for (const _e of ce) {
        const ge = (_a2 = _e.target) == null ? void 0 : _a2.clientWidth, xe = (_b = _e.target) == null ? void 0 : _b.clientHeight;
        if (ge === 0 || xe === 0) continue;
        const ze = (ue ? ge / 2 : ge) / xe;
        a.aspect = ze, a.updateProjectionMatrix();
        const Me = r.top;
        if (r.left = -Me * ze, r.right = Me * ze, r.updateProjectionMatrix(), be && be.isPerspectiveCamera) be.aspect = ze, be.updateProjectionMatrix();
        else if (be && be.isOrthographicCamera) {
          const Ie = be, Oe = Ie.top;
          Ie.left = -Oe * ze, Ie.right = Oe * ze, Ie.updateProjectionMatrix();
        }
        d.setSize(ge, xe), le();
      }
    }).observe(i), p.addEventListener("change", le), we.derive(() => {
      var _a2, _b, _c2, _d2, _e, _f, _g, _h, _i2;
      (_a2 = l == null ? void 0 : l.nodes) == null ? void 0 : _a2.val, (_b = l == null ? void 0 : l.elements) == null ? void 0 : _b.val, (_c2 = l == null ? void 0 : l.nodeInputs) == null ? void 0 : _c2.val, (_d2 = l == null ? void 0 : l.elementInputs) == null ? void 0 : _d2.val, (_e = l == null ? void 0 : l.deformOutputs) == null ? void 0 : _e.val, (_f = l == null ? void 0 : l.analyzeOutputs) == null ? void 0 : _f.val, _.displayScale.val, _.nodes.val, _.elements.val, (_g = _.edges) == null ? void 0 : _g.val, _.elemColumns.val, _.elemBeams.val, _.nodesIndexes.val, _.elementsIndexes.val, _.orientations.val, _.sections.val, _.secColumns.val, _.secBeams.val, _.secFloor.val, _.supports.val, _.loads.val, _.deformedShape.val, _.nodeResults.val, _.frameResults.val, _.shellResults.val, (_h = _.solidResults) == null ? void 0 : _h.val, (_i2 = _.extruded) == null ? void 0 : _i2.val, setTimeout(le);
    });
    let ue = false, be = null, ae = null, ie = false;
    function le() {
      const ce = i.clientWidth || 1, _e = i.clientHeight || 1;
      if (!ue || !be) {
        d.setScissorTest(false), d.setViewport(0, 0, ce, _e), d.render(o, c);
        return;
      }
      const ge = ce / 2;
      d.setScissorTest(true), d.setViewport(0, 0, ge, _e), d.setScissor(0, 0, ge, _e), d.render(o, c), d.setViewport(ge, 0, ge, _e), d.setScissor(ge, 0, ge, _e), d.render(o, be), d.setScissorTest(false);
    }
    function he(ce) {
      c = ce, p.object = ce, p.update(), le();
    }
    function pe(ce, _e) {
      ue = ce, _e && (be = _e);
      const ge = i.clientWidth || 1, xe = i.clientHeight || 1, ze = (ce ? ge / 2 : ge) / xe;
      a.isPerspectiveCamera && (a.aspect = ze, a.updateProjectionMatrix());
      const Me = r.top;
      if (r.left = -Me * ze, r.right = Me * ze, r.updateProjectionMatrix(), ce && be) {
        if (ae ? (ae.object = be, ae.update()) : (ae = new Ma(be, d.domElement), ae.enableDamping = true, ae.dampingFactor = 0.1, ae.screenSpacePanning = true, ae.zoomSpeed = 0.8, ae.panSpeed = 1.2, ae.rotateSpeed = 0.9, ae.touches = {
          ONE: bi.ROTATE,
          TWO: bi.DOLLY_PAN
        }, ae.target.copy(p.target), ae.addEventListener("change", le), ae.enabled = false), !ie) {
          const Ie = (Oe) => {
            if (!ue || !ae) return;
            const Ye = d.domElement.getBoundingClientRect(), $e = Oe.clientX - Ye.left, Qe = Ye.width / 2, je = $e >= Qe;
            p.enabled = !je, ae.enabled = je;
          };
          d.domElement.addEventListener("pointerdown", Ie, true), d.domElement.addEventListener("wheel", Ie, {
            capture: true,
            passive: true
          }), ie = true;
        }
      } else ce || (p.enabled = true, ae && (ae.enabled = false));
      i.__splitMode = ce, window.__hekatanSplitMode = ce, window.__hekatanSplitCamera = ce ? be : null, le();
    }
    if (l) {
      o.add(yr(_, A, S), vr(l, _, A), Sr(_, A, S), Mr(l, _, A, S), kr(l, _, A, S), Cr(l, _, A, S), Ar(l, _, A, S), zr(l, _, A, S), Rr(l, _, A), Or(l, _, A, S), Dr(l, _, A, S)), window.__hekatanDiagrama2D || (lc(l, _), d.domElement.addEventListener("dblclick", () => {
        var _a2;
        const Ie = (_a2 = _.frameResults) == null ? void 0 : _a2.rawVal;
        !Ie || Ie === "none" || !(window.__hekatanModelSelection ?? []).some((Ye) => Ye.type === "frame") || setTimeout(() => {
          var _a3;
          return (_a3 = window.__hekatanDiagrama2D) == null ? void 0 : _a3.call(window);
        }, 60);
      }));
      const ce = tc({
        scene: o,
        rendererElm: d.domElement,
        getActiveCamera: () => c,
        derivedNodes: A,
        derivedDisplayScale: S,
        mesh: l,
        settings: _,
        render: le
      });
      o.add(ce);
      const _e = mc(l, _), ge = Hr(l, _, A, _e), xe = Da(_e);
      o.add(ge), i.appendChild(xe);
      const Ne = qr(l, _, A);
      o.add(Ne);
      const ze = Ne.__colorMapValues, Me = Da(ze);
      Me.id = "frame-legend", i.appendChild(Me), we.derive(() => {
        var _a2;
        const Ie = _.shellResults.val != "none", Oe = (((_a2 = _.solidResults) == null ? void 0 : _a2.val) ?? "none") !== "none", Ye = Ie || Oe, $e = _.frameResults.val.startsWith("contour:"), Qe = _e.val.some((je) => Number.isFinite(je));
        xe.hidden = !Ye || !Qe, ge.visible = Ye, Me.hidden = !$e;
      });
    }
    if (n) {
      const ce = new tl(16777215, 0.5);
      o.add(ce);
      const _e = new Ri(16777215, 0.5);
      _e.position.set(30, 25, -10), _e.shadow.mapSize.width = 1024, _e.shadow.mapSize.height = 1024, o.add(_e);
      const ge = 10;
      _e.shadow.camera.left = -ge, _e.shadow.camera.right = ge, _e.shadow.camera.top = ge, _e.shadow.camera.bottom = -ge, _e.shadow.camera.far = 1e3;
      const xe = new Ri(16777215, 0.5);
      xe.color.setHSL(11, 43, 96), xe.position.set(-10, 0, 30), o.add(xe), we.derive(() => {
        (n == null ? void 0 : n.val.length) && (o.remove(...n.oldVal), o.add(...n.rawVal), le());
      }), we.derive(() => {
        n.rawVal.forEach((Ne) => Ne.visible = _.solids.val), le();
      });
    }
    if (s) {
      const ce = [], _e = (xe) => {
        var _a2;
        return ((_a2 = xe == null ? void 0 : xe.userData) == null ? void 0 : _a2.isCota) ? _.showCotas.val : _.custom3D.val;
      }, ge = () => {
        for (const xe of ce) xe.visible = _e(xe);
        le();
      };
      we.derive(() => {
        const xe = s.val;
        ce.length && (o.remove(...ce), ce.length = 0), xe.length && (o.add(...xe), ce.push(...xe), ge(), d.clippingPlanes.length && C()), le();
      }), we.derive(() => {
        _.custom3D.val, ge();
      }), we.derive(() => {
        _.showCotas.val, ge();
      });
    }
    t && Vr({
      drawingObj: t,
      gridObj: U,
      scene: o,
      getActiveCamera: () => c,
      controls: p,
      gridSize: V,
      derivedDisplayScale: S,
      rendererElm: d.domElement,
      viewerRender: le
    }), qn((ce, _e) => {
      var _a2;
      d.setClearColor(_e.background, 1), o.remove(U), (_a2 = U.traverse) == null ? void 0 : _a2.call(U, (ge) => {
        var _a3, _b, _c2, _d2;
        (_b = (_a3 = ge.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b.call(_a3), (_d2 = (_c2 = ge.material) == null ? void 0 : _c2.dispose) == null ? void 0 : _d2.call(_c2);
      }), U = yo(_.gridSize.rawVal, {
        planes: P()
      }), o.add(U), i.style.setProperty("--hk-legend-color", _e.legendMarker), le();
    });
    const Se = {
      scene: o,
      perspCamera: a,
      orthoCamera: r,
      get camera() {
        return c;
      },
      controls: p,
      renderer: d,
      rendererElm: d.domElement,
      render: le,
      setActiveCamera: he,
      setSplitMode: pe,
      get splitMode() {
        return ue;
      },
      get splitCamera() {
        return be;
      },
      settings: _
    };
    i.__ctx = Se;
    const ve = document.createElement("div");
    ve.id = "hk-nav-camara", ve.style.cssText = [
      "position:absolute",
      "right:8px",
      "bottom:8px",
      "z-index:50",
      "display:grid",
      "grid-template-columns:repeat(3, 32px)",
      "gap:2px",
      "user-select:none",
      "pointer-events:auto"
    ].join(";");
    const Ae = (ce, _e, ge) => {
      const xe = document.createElement("button");
      return xe.textContent = ce, xe.title = _e, xe.style.cssText = [
        "width:32px",
        "height:32px",
        "background:rgba(40,40,40,0.85)",
        "color:#fff",
        "border:1px solid rgba(255,255,255,0.15)",
        "border-radius:4px",
        "cursor:pointer",
        "font-size:14px",
        "font-family:system-ui"
      ].join(";"), xe.onmouseenter = () => {
        xe.style.background = "rgba(70,70,70,0.9)";
      }, xe.onmouseleave = () => {
        xe.style.background = "rgba(40,40,40,0.85)";
      }, xe.onclick = (Ne) => {
        Ne.preventDefault(), ge();
      }, xe;
    }, Ve = (ce, _e) => {
      const ge = p.target, xe = new te().subVectors(c.position, ge), Ne = xe.length(), ze = new te(), Me = new te();
      ze.crossVectors(c.up, xe).normalize(), Me.copy(c.up).normalize();
      const Ie = Ne * 0.05;
      ge.addScaledVector(ze, -ce * Ie), ge.addScaledVector(Me, _e * Ie), c.position.addScaledVector(ze, -ce * Ie), c.position.addScaledVector(Me, _e * Ie), p.update(), le();
    }, ot = (ce) => {
      const _e = new te().subVectors(c.position, p.target);
      _e.multiplyScalar(ce), c.position.copy(p.target).add(_e), p.update(), le();
    }, yt = () => {
      const ce = document.createElement("div");
      return ce.style.cssText = "width:32px;height:32px;", ce;
    };
    return ve.append(yt()), ve.append(Ae("\u2191", "Pan arriba", () => Ve(0, 1))), ve.append(Ae("\u2295", "Zoom in", () => ot(0.85))), ve.append(Ae("\u2190", "Pan izquierda", () => Ve(-1, 0))), ve.append(Ae("\u2302", "Reset vista", () => {
      p.reset(), le();
    })), ve.append(Ae("\u2192", "Pan derecha", () => Ve(1, 0))), ve.append(Ae("\u2296", "Zoom out", () => ot(1.18))), ve.append(Ae("\u2193", "Pan abajo", () => Ve(0, -1))), ve.append(yt()), getComputedStyle(i).position === "static" && (i.style.position = "relative"), typeof window.matchMedia == "function" && window.matchMedia("(pointer: coarse)").matches && i.appendChild(ve), i;
  };
  let La = "";
  function dl(l) {
    l !== La && (La = l, console.error(`[sello] ${l}`));
  }
  function hl(l, e, t) {
    var _a2;
    const s = (_a2 = l == null ? void 0 : l.caseId) == null ? void 0 : _a2.val, n = e == null ? void 0 : e.caseId;
    return s && n && n !== s ? (dl(`NO pinto ${t}: los resultados son de \xAB${n}\xBB y en pantalla esta \xAB${s}\xBB. Resultado viejo sobre modelo nuevo.`), false) : true;
  }
  function Vn(l, e, t) {
    if (!l || l.size === 0 || e === 0) return true;
    let s = -1;
    for (const n of l.keys()) n > s && (s = n);
    return s >= e ? (dl(`NO pinto ${t}: el resultado llega al indice ${s} y la malla en pantalla tiene ${e}. Es de otro modelo.`), false) : true;
  }
  function cc(l, e) {
    return we.derive(() => {
      var _a2, _b, _c2, _d2, _e;
      if (!e.deformedShape.val) return ((_a2 = l == null ? void 0 : l.nodes) == null ? void 0 : _a2.val) ?? [];
      const t = ((_b = l == null ? void 0 : l.nodes) == null ? void 0 : _b.val) ?? [], s = (_d2 = (_c2 = l == null ? void 0 : l.deformOutputs) == null ? void 0 : _c2.val) == null ? void 0 : _d2.deformations;
      if (!s || t.length === 0 || !hl(l, (_e = l == null ? void 0 : l.deformOutputs) == null ? void 0 : _e.val, "la deformada") || !Vn(s, t.length, "la deformada")) return t;
      const n = e.deformScale.val, i = e.deformScale.val * e.deformScaleZ.val, o = Number.isFinite(n) ? n : 1, a = Number.isFinite(i) ? i : 1;
      return t.map((r, c) => {
        var _a3;
        const d = ((_a3 = s.get(c)) == null ? void 0 : _a3.slice(0, 3)) ?? [
          0,
          0,
          0
        ], p = Number.isFinite(d[0]) ? d[0] : 0, f = Number.isFinite(d[1]) ? d[1] : 0, x = Number.isFinite(d[2]) ? d[2] : 0;
        return [
          r[0] + p * o,
          r[1] + f * o,
          r[2] + x * a
        ];
      });
    });
  }
  let jn, Eo, pc, Na, fc;
  jn = we.state(null);
  Eo = we.state("");
  dc = we.state("kN");
  hc = we.state("mm");
  uc = we.state("tonf/m\xB2");
  pc = {
    kN: 1,
    tonf: 9.80665,
    kip: 4.4482216
  };
  Na = {
    mm: 1e3,
    cm: 100,
    m: 1,
    in: 39.3700787402,
    ft: 3.280839895
  };
  fc = {
    "kN/m\xB2": 1,
    kPa: 1,
    MPa: 1 / 1e3,
    GPa: 1 / 1e6,
    "kgf/cm\xB2": 1 / 98.0665,
    "tonf/m\xB2": 1 / 9.80665,
    psi: 1 / 6.89476,
    ksi: 1 / 6894.76,
    "kip/ft\xB2": 1 / 47.88026
  };
  function mc(l, e) {
    const t = we.state([]);
    let s;
    return ((n) => {
      n.bendingXX = "bendingXX", n.bendingYY = "bendingYY", n.bendingXY = "bendingXY", n.membraneXX = "membraneXX", n.membraneYY = "membraneYY", n.membraneXY = "membraneXY", n.tranverseShearX = "tranverseShearX", n.tranverseShearY = "tranverseShearY", n.membranePrincipalMax = "membranePrincipalMax", n.membranePrincipalMin = "membranePrincipalMin", n.bendingPrincipalMax = "bendingPrincipalMax", n.bendingPrincipalMin = "bendingPrincipalMin", n.transverseShearMax = "transverseShearMax", n.vonMises = "vonMises", n.pressure = "pressure", n.displacementX = "displacementX", n.displacementY = "displacementY", n.displacementZ = "displacementZ";
    })(s || (s = {})), we.derive(() => {
      var _a2, _b, _c2, _d2, _e2, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r2, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E;
      const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), b = (xe, Ne) => {
        const ze = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map();
        xe == null ? void 0 : xe.forEach((Ie, Oe) => {
          const Ye = l.elements.val[Oe];
          if (Ye) for (let $e = 0; $e < Ye.length; $e++) {
            const Qe = Ie[$e] ?? Ie[0];
            Number.isFinite(Qe) && (ze.set(Ye[$e], (ze.get(Ye[$e]) ?? 0) + Qe), Me.set(Ye[$e], (Me.get(Ye[$e]) ?? 0) + 1));
          }
        }), ze.forEach((Ie, Oe) => Ne.set(Oe, [
          Ie / Me.get(Oe)
        ]));
      }, C = l.elements.val.length, _ = (_a2 = l.analyzeOutputs) == null ? void 0 : _a2.val;
      hl(l, _, "el colormap de cascara") && Vn(_ == null ? void 0 : _.bendingXX, C, "el colormap de cascara") && Vn(_ == null ? void 0 : _.membraneXX, C, "el colormap de cascara") && Vn(_ == null ? void 0 : _.vonMises, C, "el colormap de cascara") && Vn(_ == null ? void 0 : _.pressure, C, "el colormap de cascara") && (b((_c2 = (_b = l.analyzeOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c2.bendingXX, n), b((_e2 = (_d2 = l.analyzeOutputs) == null ? void 0 : _d2.val) == null ? void 0 : _e2.bendingYY, i), b((_g = (_f = l.analyzeOutputs) == null ? void 0 : _f.val) == null ? void 0 : _g.bendingXY, o), b((_i2 = (_h = l.analyzeOutputs) == null ? void 0 : _h.val) == null ? void 0 : _i2.membraneXX, a), b((_k = (_j = l.analyzeOutputs) == null ? void 0 : _j.val) == null ? void 0 : _k.membraneYY, r), b((_m = (_l2 = l.analyzeOutputs) == null ? void 0 : _l2.val) == null ? void 0 : _m.membraneXY, c), b((_o2 = (_n2 = l.analyzeOutputs) == null ? void 0 : _n2.val) == null ? void 0 : _o2.tranverseShearX, d), b((_q = (_p = l.analyzeOutputs) == null ? void 0 : _p.val) == null ? void 0 : _q.tranverseShearY, p), b((_s = (_r2 = l.analyzeOutputs) == null ? void 0 : _r2.val) == null ? void 0 : _s.vonMises, f), b((_u = (_t = l.analyzeOutputs) == null ? void 0 : _t.val) == null ? void 0 : _u.pressure, x));
      const A = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), W = (xe, Ne, ze, Me, Ie) => {
        xe.forEach((Oe, Ye) => {
          var _a3, _b2;
          const $e = Oe[0] ?? 0, Qe = ((_a3 = Ne.get(Ye)) == null ? void 0 : _a3[0]) ?? 0, je = ((_b2 = ze.get(Ye)) == null ? void 0 : _b2[0]) ?? 0, Ke = ($e + Qe) / 2, Ee = Math.hypot(($e - Qe) / 2, je);
          Me.set(Ye, [
            Ke + Ee
          ]), Ie.set(Ye, [
            Ke - Ee
          ]);
        });
      };
      W(a, r, c, A, P), W(n, i, o, H, U), d.forEach((xe, Ne) => {
        var _a3;
        G.set(Ne, [
          Math.hypot(xe[0] ?? 0, ((_a3 = p.get(Ne)) == null ? void 0 : _a3[0]) ?? 0)
        ]);
      });
      const V = (_w = (_v = l.analyzeOutputs) == null ? void 0 : _v.val) == null ? void 0 : _w.colorMapRanges, q = (_x = e.solidResults) == null ? void 0 : _x.val, R = q && q !== "none" ? q : e.shellResults.val, X = V == null ? void 0 : V[R], Q = {
        bendingXX: [
          n,
          0
        ],
        bendingYY: [
          i,
          0
        ],
        bendingXY: [
          o,
          0
        ],
        membraneXX: [
          a,
          0
        ],
        membraneYY: [
          r,
          0
        ],
        membraneXY: [
          c,
          0
        ],
        tranverseShearX: [
          d,
          0
        ],
        tranverseShearY: [
          p,
          0
        ],
        membranePrincipalMax: [
          A,
          0
        ],
        membranePrincipalMin: [
          P,
          0
        ],
        bendingPrincipalMax: [
          H,
          0
        ],
        bendingPrincipalMin: [
          U,
          0
        ],
        transverseShearMax: [
          G,
          0
        ],
        vonMises: [
          f,
          0
        ],
        pressure: [
          x,
          0
        ],
        displacementX: [
          (_z = (_y = l.deformOutputs) == null ? void 0 : _y.val) == null ? void 0 : _z.deformations,
          0
        ],
        displacementY: [
          (_B = (_A = l.deformOutputs) == null ? void 0 : _A.val) == null ? void 0 : _B.deformations,
          1
        ],
        displacementZ: [
          (_D = (_C = l.deformOutputs) == null ? void 0 : _C.val) == null ? void 0 : _D.deformations,
          2
        ]
      }, re = e.shellResults.val, ue = dc.val, be = hc.val, ae = re === "displacementX" || re === "displacementY" || re === "displacementZ", ie = re === "bendingXX" || re === "bendingYY" || re === "bendingXY" || re === "bendingPrincipalMax" || re === "bendingPrincipalMin", le = re === "membraneXX" || re === "membraneYY" || re === "membraneXY" || re === "membranePrincipalMax" || re === "membranePrincipalMin", he = re === "vonMises" || re === "pressure", pe = re === "tranverseShearX" || re === "tranverseShearY" || re === "transverseShearMax", Se = (_E = e.solidResults) == null ? void 0 : _E.val, ve = Se === "vonMises" || Se === "sigmaXX" || Se === "sigmaYY" || Se === "sigmaZZ" || Se === "tauXY" || Se === "tauYZ" || Se === "tauXZ", Ae = Se === "ux" || Se === "uy" || Se === "uz", Ve = uc.val, ot = ve ? fc[Ve] : Ae || ae ? Na[be] : ie || le || he || pe ? 1 / pc[ue] : 1, yt = ve ? Ve : Ae || ae ? be : ie ? `${ue}\xB7m/m` : le ? `${ue}/m\xB2` : he ? `${ue}/m\xB2` : pe ? `${ue}/m` : "";
      Eo.val = yt, pr(ae || Ae), jn.val = Array.isArray(X) && X.length === 2 ? [
        X[0] * ot,
        X[1] * ot
      ] : null;
      const Ce = Fo.val, _e = Se && Se !== "none" ? [
        f,
        0
      ] : Q[re], ge = [];
      if (l.nodes.val.forEach((xe, Ne) => {
        const ze = _e;
        if (!ze || !ze[0] || typeof ze[0].has != "function") return;
        if (!ze[0].has(Ne)) {
          ge.push(Number.NaN);
          return;
        }
        const Me = ze[0].get(Ne), Ie = Me ? Me[ze[1]] ?? 0 : 0;
        ge.push(Ie * ot);
      }), !jn.val && Ce !== "auto" && Ce !== "robusto" && Ce !== "real") {
        const xe = l.nodes.val, Ne = /* @__PURE__ */ new Set(), ze = (Ie, Oe) => {
          var _a3;
          const Ye = (_a3 = xe[Ie[0]]) == null ? void 0 : _a3[Oe];
          return Ie.every(($e) => {
            var _a4;
            return Math.abs((((_a4 = xe[$e]) == null ? void 0 : _a4[Oe]) ?? NaN) - Ye) < 1e-6;
          });
        };
        for (const Ie of l.elements.val) {
          if (Ie.length !== 4) continue;
          const Oe = ze(Ie, 2), Ye = !Oe && ze(Ie, 0), $e = !Oe && ze(Ie, 1);
          if (Ce === "losas" ? Oe : Ce === "muros" ? Ye || $e : Ce === "murosX" ? Ye : Ce === "murosY" ? $e : false) for (const Ke of Ie) Ne.add(Ke);
        }
        const Me = [];
        for (const Ie of Ne) {
          const Oe = ge[Ie];
          Number.isFinite(Oe) && Me.push(Oe);
        }
        Me.length && (jn.val = Po(Me));
      }
      t.val = ge;
    }), t;
  }
  class Oa {
    constructor(e, t) {
      Object.assign(this, {
        type: t.type ?? null,
        detail: t,
        owner: e,
        target: t.target ?? null,
        phase: t.phase ?? "before",
        object: t.object ?? null,
        execute: null,
        isStopped: false,
        isCancelled: false,
        onComplete: null,
        listeners: []
      }), delete t.type, delete t.target, delete t.object, this.complete = new Promise((s, n) => {
        this._resolve = s, this._reject = n;
      }), this.complete.catch(() => {
      });
    }
    finish(e) {
      e && y.extend(this.detail, e), this.phase = "after", this.owner.trigger.call(this.owner, this);
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
  class cn {
    constructor(e) {
      if (this.activeEvents = [], this.listeners = [], e !== void 0) {
        if (!y.checkName(e)) return;
        Bs[e] = this;
      }
      this.debug = false;
    }
    on(e, t) {
      return (e = typeof e == "string" ? e.split(/[,\s]+/) : [
        e
      ]).forEach((s) => {
        var n, i, o, a = typeof s == "string" ? s : s.type + ":" + s.execute + "." + s.scope;
        typeof s == "string" && ([i, n] = s.split("."), [i, o] = i.replace(":complete", ":after").replace(":done", ":after").split(":"), s = {
          type: i,
          execute: o ?? "before",
          scope: n
        }), (s = y.extend({
          type: null,
          execute: "before",
          onComplete: null
        }, s)).type ? t ? (Array.isArray(this.listeners) || (this.listeners = []), this.listeners.push({
          name: a,
          edata: s,
          handler: t
        }), this.debug && console.log("w2base: add event", {
          name: a,
          edata: s,
          handler: t
        })) : console.log("ERROR: You must specify event handler function when calling .on() method of " + this.name) : console.log("ERROR: You must specify event type when calling .on() method of " + this.name);
      }), this;
    }
    off(e, t) {
      return (e = typeof e == "string" ? e.split(/[,\s]+/) : [
        e
      ]).forEach((s) => {
        var n, i, o, a = typeof s == "string" ? s : s.type + ":" + s.execute + "." + s.scope;
        if (typeof s == "string" && ([i, n] = s.split("."), [i, o] = i.replace(":complete", ":after").replace(":done", ":after").split(":"), s = {
          type: i || "*",
          execute: o || "",
          scope: n || ""
        }), (s = y.extend({
          type: null,
          execute: null,
          onComplete: null
        }, s)).type || s.scope) {
          t = t || null;
          let r = 0;
          this.listeners = this.listeners.filter((c) => s.type !== "*" && s.type !== c.edata.type || s.execute !== "" && s.execute !== c.edata.execute || s.scope !== "" && s.scope !== c.edata.scope || s.handler != null && s.handler !== c.edata.handler || (r++, false)), this.debug && console.log(`w2base: remove event (${r})`, {
            name: a,
            edata: s,
            handler: t
          });
        } else console.log("ERROR: You must specify event type when calling .off() method of " + this.name);
      }), this;
    }
    trigger(e, t) {
      if (arguments.length == 1 ? t = e : (t.type = e, t.target = t.target ?? this), y.isPlainObject(t) && t.phase == "after") {
        if (!(t = this.activeEvents.find((o) => o.type == t.type && o.target == t.target))) return void console.log(`ERROR: Cannot find even handler for "${t.type}" on "${t.target}".`);
        console.log(`NOTICE: This syntax "edata.trigger({ phase: 'after' })" is outdated. Use edata.finish() instead.`);
      } else t instanceof Oa || (t = new Oa(this, t), this.activeEvents.push(t));
      let s, n, i;
      Array.isArray(this.listeners) || (this.listeners = []), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
      for (let o = this.listeners.length - 1; 0 <= o; o--) {
        let a = this.listeners[o];
        if (!(a == null || a.edata.type !== t.type && a.edata.type !== "*" || a.edata.target !== t.target && a.edata.target != null || a.edata.execute !== t.phase && a.edata.execute !== "*" && a.edata.phase !== "*") && (Object.keys(a.edata).forEach((r) => {
          t[r] == null && a.edata[r] != null && (t[r] = a.edata[r]);
        }), s = [], i = new RegExp(/\((.*?)\)/).exec(String(a.handler).split("=>")[0]), (s = i ? i[1].split(/\s*,\s*/) : s).length === 2 ? (a.handler.call(this, t.target, t), this.debug && console.log(" - call (old)", a.handler)) : (a.handler.call(this, t), this.debug && console.log(" - call", a.handler)), t.isStopped === true || t.stop === true)) return t;
      }
      if (e = "on" + t.type.substr(0, 1).toUpperCase() + t.type.substr(1), !(t.phase === "before" && typeof this[e] == "function" && (n = this[e], s = [], i = new RegExp(/\((.*?)\)/).exec(String(n).split("=>")[0]), (s = i ? i[1].split(/\s*,\s*/) : s).length === 2 ? (n.call(this, t.target, t), this.debug && console.log(" - call: on[Event] (old)", n)) : (n.call(this, t), this.debug && console.log(" - call: on[Event]", n)), t.isStopped === true || t.stop === true) || t.object != null && t.phase === "before" && typeof t.object[e] == "function" && (n = t.object[e], s = [], i = new RegExp(/\((.*?)\)/).exec(String(n).split("=>")[0]), (s = i ? i[1].split(/\s*,\s*/) : s).length === 2 ? (n.call(this, t.target, t), this.debug && console.log(" - call: edata.object (old)", n)) : (n.call(this, t), this.debug && console.log(" - call: edata.object", n)), t.isStopped === true || t.stop === true) || t.phase !== "after")) {
        typeof t.onComplete == "function" && t.onComplete.call(this, t);
        for (let o = 0; o < t.listeners.length; o++) typeof t.listeners[o] == "function" && (t.listeners[o].call(this, t), this.debug) && console.log(" - call: done", n);
        t._resolve(t), this.debug && console.log(`w2base: trigger "${t.type}:${t.phase}"`, t);
      }
      return t;
    }
  }
  const vo = {
    locale: "en-US",
    dateFormat: "m/d/yyyy",
    timeFormat: "hh:mi pm",
    datetimeFormat: "m/d/yyyy|hh:mi pm",
    currencyPrefix: "$",
    currencySuffix: "",
    currencyPrecision: 2,
    groupSymbol: ",",
    decimalSymbol: ".",
    shortmonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    fullmonths: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    shortdays: [
      "M",
      "T",
      "W",
      "T",
      "F",
      "S",
      "S"
    ],
    fulldays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    weekStarts: "S",
    phrases: {
      "${count} letters or more...": "---",
      "Add new record": "---",
      "Add New": "---",
      "Advanced Search": "---",
      after: "---",
      "AJAX error. See console for more details.": "---",
      "All Fields": "---",
      All: "---",
      Any: "---",
      "Are you sure you want to delete ${count} ${records}?": "---",
      "Attach files by dragging and dropping or Click to Select": "---",
      before: "---",
      "begins with": "---",
      begins: "---",
      between: "---",
      buffered: "---",
      Cancel: "---",
      Close: "---",
      Column: "---",
      Confirmation: "---",
      contains: "---",
      Copied: "---",
      "Copy to clipboard": "---",
      "Current Date & Time": "---",
      "Delete selected records": "---",
      Delete: "---",
      'Do you want to delete search item "${item}"?': "---",
      "Edit selected record": "---",
      Edit: "---",
      "Empty list": "---",
      "ends with": "---",
      ends: "---",
      "Field should be at least ${count} characters.": "---",
      Hide: "---",
      in: "---",
      "is not": "---",
      is: "---",
      "less than": "---",
      "Line #": "---",
      "Load ${count} more...": "---",
      "Loading...": "---",
      "Maximum number of files is ${count}": "---",
      "Maximum total size is ${count}": "---",
      Modified: "---",
      "more than": "---",
      "Multiple Fields": "---",
      Name: "---",
      "No items found": "---",
      "No matches": "---",
      No: "---",
      none: "---",
      "Not a float": "---",
      "Not a hex number": "---",
      "Not a valid date": "---",
      "Not a valid email": "---",
      "Not alpha-numeric": "---",
      "Not an integer": "---",
      "Not in money format": "---",
      "not in": "---",
      Notification: "---",
      of: "---",
      Ok: "---",
      Opacity: "---",
      "Record ID": "---",
      record: "---",
      records: "---",
      "Refreshing...": "---",
      "Reload data in the list": "---",
      Remove: "---",
      "Remove This Field": "---",
      "Request aborted.": "---",
      "Required field": "---",
      Reset: "---",
      "Restore Default State": "---",
      "Returned data is not in valid JSON format.": "---",
      "Save changed records": "---",
      "Save Grid State": "---",
      Save: "---",
      "Saved Searches": "---",
      "Saving...": "---",
      "Search took ${count} seconds": "---",
      Search: "---",
      "Select Hour": "---",
      "Select Minute": "---",
      selected: "---",
      "Server Response ${count} seconds": "---",
      "Show/hide columns": "---",
      Show: "---",
      Size: "---",
      Skip: "---",
      "Sorting took ${count} seconds": "---",
      "Type to search...": "---",
      Type: "---",
      Yes: "---",
      Yesterday: "---",
      "Your remote data source record count has changed, reloading from the first record.": "---"
    }
  };
  const _Ct = class _Ct {
    constructor(e, t, s) {
      this.context = t ?? document, this.previous = s ?? null;
      let n = [];
      if (Array.isArray(e)) n = e;
      else if (e instanceof Node || e instanceof Window) n = [
        e
      ];
      else if (e instanceof _Ct) n = e.nodes;
      else if (typeof e == "string") {
        if (typeof this.context.querySelector != "function") throw new Error("Invalid context");
        n = Array.from(this.context.querySelectorAll(e));
      } else if (e == null) n = [];
      else {
        if (t = Array.from(e ?? []), typeof e != "object" || !Array.isArray(t)) throw new Error(`Invalid selector "${e}"`);
        n = t;
      }
      this.nodes = n, this.length = n.length, this.each((i, o) => {
        this[o] = i;
      });
    }
    static _fragment(e) {
      let t = document.createElement("template");
      return t.innerHTML = e, t.content.childNodes.forEach((s) => {
        var n = _Ct._scriptConvert(s);
        n != s && t.content.replaceChild(n, s);
      }), t.content;
    }
    static _scriptConvert(e) {
      let t = (s) => {
        var n = s.ownerDocument.createElement("script"), i = (n.text = s.text, s.attributes);
        for (let o = 0; o < i.length; o++) n.setAttribute(i[o].name, i[o].value);
        return n;
      };
      return (e = e.tagName == "SCRIPT" ? t(e) : e).querySelectorAll && e.querySelectorAll("script").forEach((s) => {
        s.parentNode.replaceChild(t(s), s);
      }), e;
    }
    static _fixProp(e) {
      var t = {
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        class: "className",
        colspan: "colSpan",
        contenteditable: "contentEditable",
        for: "htmlFor",
        frameborder: "frameBorder",
        maxlength: "maxLength",
        readonly: "readOnly",
        rowspan: "rowSpan",
        tabindex: "tabIndex",
        usemap: "useMap"
      };
      return t[e] || e;
    }
    _insert(e, t) {
      let s = [], n = this.length;
      if (!(n < 1)) {
        let i = this;
        if (typeof t == "string") this.each((o) => {
          var a = _Ct._fragment(t);
          s.push(...a.childNodes), o[e](a);
        });
        else if (t instanceof _Ct) {
          let o = n == 1;
          t.each((a) => {
            this.each((r) => {
              var c = o ? a : a.cloneNode(true);
              s.push(c), r[e](c), _Ct._scriptConvert(c);
            });
          }), o || t.remove();
        } else {
          if (!(t instanceof Node)) throw new Error(`Incorrect argument for "${e}(html)". It expects one string argument.`);
          this.each((o) => {
            var a = n === 1 ? t : _Ct._fragment(t.outerHTML);
            s.push(...n === 1 ? [
              t
            ] : a.childNodes), o[e](a);
          }), 1 < n && t.remove();
        }
        return i = e == "replaceWith" ? new _Ct(s, this.context, this) : i;
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
      let t = [
        this[e = e < 0 ? this.length + e : e]
      ];
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
      this.each((n) => {
        n.shadowRoot && t.push(n.shadowRoot);
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
      let t = [], s = (i) => i.parentNode ? s(i.parentNode) : i, n = (i) => {
        i = s(i), t.push(i.host || i), i.host && e && n(i.host);
      };
      return this.each((i) => {
        n(i);
      }), new _Ct(t, this.context, this);
    }
    parent(e) {
      return this.parents(e, true);
    }
    parents(e, t) {
      let s = [], n = (o) => {
        if (s.indexOf(o) == -1 && s.push(o), !t && o.parentNode) return n(o.parentNode);
      };
      this.each((o) => {
        o.parentNode && n(o.parentNode);
      });
      var i = new _Ct(s, this.context, this);
      return e ? i.filter(e) : i;
    }
    add(e) {
      return e = e instanceof _Ct ? e.nodes : Array.isArray(e) ? e : [
        e
      ], new _Ct(this.nodes.concat(e), this.context, this);
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
      var n, i = arguments.length;
      return i === 0 || i === 1 && typeof e == "string" ? this[0] ? (i = this[0].style, typeof e == "string" ? (n = i.getPropertyPriority(e), i.getPropertyValue(e) + (n ? "!" + n : "")) : Object.fromEntries(this[0].style.cssText.split(";").filter((o) => !!o).map((o) => o.split(":").map((a) => a.trim())))) : void 0 : (typeof e != "object" && ((s = {})[e] = t), this.each((o, a) => {
        Object.keys(s).forEach((r) => {
          var c = String(s[r]).toLowerCase().includes("!important") ? "important" : "";
          o.style.setProperty(r, String(s[r]).replace(/\!important/i, ""), c);
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
        let n = e;
        (n = n == null && t === false ? Array.from(s.classList) : n).forEach((i) => {
          if (i !== "") {
            let o = t != null ? t ? "add" : "remove" : "toggle";
            s.classList[o](i);
          }
        });
      }), this;
    }
    hasClass(e) {
      if ((e = typeof e == "string" ? e.split(/[,\s]+/) : e) == null && 0 < this.length) return Array.from(this[0].classList);
      let t = false;
      return this.each((s) => {
        t = t || e.every((n) => Array.from(s.classList ?? []).includes(n));
      }), t;
    }
    on(e, t, s) {
      typeof t == "function" && (s = t, t = void 0);
      let n;
      return (t == null ? void 0 : t.delegate) && (n = t.delegate, delete t.delegate), (e = e.split(/[,\s]+/)).forEach((i) => {
        let [o, a] = String(i).toLowerCase().split(".");
        if (n) {
          let r = s;
          s = (c) => {
            var d = h(c.target).parents(n);
            0 < d.length ? c.delegate = d[0] : c.delegate = c.target, (c.target.matches(n) || 0 < d.length) && r(c);
          };
        }
        this.each((r) => {
          this._save(r, "events", [
            {
              event: o,
              scope: a,
              callback: s,
              options: t
            }
          ]), r.addEventListener(o, s, t);
        });
      }), this;
    }
    off(e, t, s) {
      return typeof t == "function" && (s = t, t = void 0), (e = (e ?? "").split(/[,\s]+/)).forEach((n) => {
        let [i, o] = String(n).toLowerCase().split(".");
        this.each((a) => {
          var _a2;
          if (Array.isArray((_a2 = a._mQuery) == null ? void 0 : _a2.events)) for (let c = a._mQuery.events.length - 1; 0 <= c; c--) {
            var r = a._mQuery.events[c];
            o == null || o === "" ? r.event != i && i !== "" || r.callback != s && s != null || (a.removeEventListener(r.event, r.callback, r.options), a._mQuery.events.splice(c, 1)) : r.event != i && i !== "" || r.scope != o || (a.removeEventListener(r.event, r.callback, r.options), a._mQuery.events.splice(c, 1));
          }
        });
      }), this;
    }
    trigger(e, t) {
      let s;
      return s = e instanceof Event || e instanceof CustomEvent ? e : new ([
        "click",
        "dblclick",
        "mousedown",
        "mouseup",
        "mousemove"
      ].includes(e) ? MouseEvent : [
        "keydown",
        "keyup",
        "keypress"
      ].includes(e) ? KeyboardEvent : Event)(e, t), this.each((n) => {
        n.dispatchEvent(s);
      }), this;
    }
    attr(e, t) {
      if (t === void 0 && typeof e == "string") return this[0] ? this[0].getAttribute(e) : void 0;
      {
        let s = {};
        return typeof e == "object" ? s = e : s[e] = t, this.each((n) => {
          Object.entries(s).forEach(([i, o]) => {
            n.setAttribute(i, o);
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
        return typeof e == "object" ? s = e : s[e] = t, this.each((n) => {
          Object.entries(s).forEach(([i, o]) => {
            i = _Ct._fixProp(i), n[i] = o, i == "innerHTML" && _Ct._scriptConvert(n);
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
          return Object.keys(s).forEach((n) => {
            if (s[n].startsWith("[") || s[n].startsWith("{")) try {
              s[n] = JSON.parse(s[n]);
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
        var s, n = t.style.display, i = getComputedStyle(t).display, o = n == "none" || i == "none";
        !o || e != null && e !== true || (s = t instanceof HTMLTableRowElement ? "table-row" : t instanceof HTMLTableCellElement ? "table-cell" : "block", t.style.display = ((_a2 = t._mQuery) == null ? void 0 : _a2.prevDisplay) ?? (n == i && i != "none" ? "" : s), this._save(t, "prevDisplay", null)), o || e != null && e !== false || (i != "none" && this._save(t, "prevDisplay", i), t.style.setProperty("display", "none"));
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
  let h = function(l, e) {
    if (typeof l != "function") return new Ct(l, e);
    document.readyState == "complete" ? l() : window.addEventListener("load", l);
  }, Bs = (h.html = (l) => (l = Ct._fragment(l), h(l.children, l)), h.version = Ct.version, {});
  class gc {
    constructor() {
      this.version = "2.0.x", this.tmp = {}, this.settings = this.extend({}, {
        dataType: "HTTPJSON",
        dateStartYear: 1950,
        dateEndYear: 2030,
        macButtonOrder: false,
        warnNoPhrase: false
      }, vo, {
        phrases: null
      }), this.i18nCompare = Intl.Collator().compare, this.hasLocalStorage = function() {
        var e = "w2ui_test";
        try {
          return localStorage.setItem(e, e), localStorage.removeItem(e), true;
        } catch {
          return false;
        }
      }(), this.isMac = /Mac/i.test(navigator.platform), this.isMobile = /(iphone|ipod|ipad|mobile|android)/i.test(navigator.userAgent), this.isIOS = /(iphone|ipod|ipad)/i.test(navigator.platform), this.isAndroid = /(android)/i.test(navigator.userAgent), this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), this.formatters = {
        number(e, t) {
          return 20 < parseInt(t) && (t = 20), parseInt(t) < 0 && (t = 0), e == null || e === "" ? "" : y.formatNumber(parseFloat(e), t, true);
        },
        float(e, t) {
          return y.formatters.number(e, t);
        },
        int(e, t) {
          return y.formatters.number(e, 0);
        },
        money(e, t) {
          return e == null || e === "" ? "" : (e = y.formatNumber(Number(e), y.settings.currencyPrecision), (y.settings.currencyPrefix || "") + e + (y.settings.currencySuffix || ""));
        },
        currency(e, t) {
          return y.formatters.money(e, t);
        },
        percent(e, t) {
          return e == null || e === "" ? "" : y.formatNumber(e, t || 1) + "%";
        },
        size(e, t) {
          return e == null || e === "" ? "" : y.formatSize(parseInt(e));
        },
        date(e, t) {
          if (t === "" && (t = y.settings.dateFormat), e == null || e === 0 || e === "") return "";
          let s = y.isDateTime(e, t, true);
          return '<span title="' + (s = s === false ? y.isDate(e, t, true) : s) + '">' + y.formatDate(s, t) + "</span>";
        },
        datetime(e, t) {
          if (t === "" && (t = y.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
          let s = y.isDateTime(e, t, true);
          return '<span title="' + (s = s === false ? y.isDate(e, t, true) : s) + '">' + y.formatDateTime(s, t) + "</span>";
        },
        time(e, t) {
          if (t === "" && (t = y.settings.timeFormat), e == null || e === 0 || e === "") return "";
          let s = y.isDateTime(e, t = (t = t === "h12" ? "hh:mi pm" : t) === "h24" ? "h24:mi" : t, true);
          return '<span title="' + (s = s === false ? y.isDate(e, t, true) : s) + '">' + y.formatTime(e, t) + "</span>";
        },
        timestamp(e, t) {
          if (t === "" && (t = y.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
          let s = y.isDateTime(e, t, true);
          return (s = s === false ? y.isDate(e, t, true) : s).toString ? s.toString() : "";
        },
        gmt(e, t) {
          if (t === "" && (t = y.settings.datetimeFormat), e == null || e === 0 || e === "") return "";
          let s = y.isDateTime(e, t, true);
          return (s = s === false ? y.isDate(e, t, true) : s).toUTCString ? s.toUTCString() : "";
        },
        age(e, t) {
          if (e == null || e === 0 || e === "") return "";
          let s = y.isDateTime(e, null, true);
          return '<span title="' + (s = s === false ? y.isDate(e, null, true) : s) + '">' + y.age(e) + (t ? " " + t : "") + "</span>";
        },
        interval(e, t) {
          return e == null || e === 0 || e === "" ? "" : y.interval(e) + (t ? " " + t : "");
        },
        toggle(e, t) {
          return e ? "Yes" : "";
        },
        password(e, t) {
          let s = "";
          for (let n = 0; n < e.length; n++) s += "*";
          return s;
        }
      };
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
      var n = "Invalid Date";
      let i, o, a;
      if (t == null && (t = this.settings.dateFormat), typeof e.getFullYear == "function") a = e.getFullYear(), i = e.getMonth() + 1, o = e.getDate();
      else if (parseInt(e) == e && 0 < parseInt(e)) e = new Date(parseInt(e)), a = e.getFullYear(), i = e.getMonth() + 1, o = e.getDate();
      else {
        if (e = String(e), new RegExp("mon", "ig").test(t)) {
          t = t.replace(/month/gi, "m").replace(/mon/gi, "m").replace(/dd/gi, "d").replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase(), e = e.replace(/[, ]/gi, "/").replace(/\/\//g, "/").toLowerCase();
          for (let p = 0, f = this.settings.fullmonths.length; p < f; p++) {
            var r = this.settings.fullmonths[p];
            e = e.replace(new RegExp(r, "ig"), parseInt(p) + 1).replace(new RegExp(r.substr(0, 3), "ig"), parseInt(p) + 1);
          }
        }
        var c = e.replace(/-/g, "/").replace(/\./g, "/").toLowerCase().split("/"), t = t.replace(/-/g, "/").replace(/\./g, "/").toLowerCase();
        t === "mm/dd/yyyy" && (i = c[0], o = c[1], a = c[2]), t === "m/d/yyyy" && (i = c[0], o = c[1], a = c[2]), t === "dd/mm/yyyy" && (i = c[1], o = c[0], a = c[2]), t === "d/m/yyyy" && (i = c[1], o = c[0], a = c[2]), t === "yyyy/dd/mm" && (i = c[2], o = c[1], a = c[0]), t === "yyyy/d/m" && (i = c[2], o = c[1], a = c[0]), t === "yyyy/mm/dd" && (i = c[1], o = c[2], a = c[0]), t === "yyyy/m/d" && (i = c[1], o = c[2], a = c[0]), t === "mm/dd/yy" && (i = c[0], o = c[1], a = c[2]), t === "m/d/yy" && (i = c[0], o = c[1], a = parseInt(c[2]) + 1900), t === "dd/mm/yy" && (i = c[1], o = c[0], a = parseInt(c[2]) + 1900), t === "d/m/yy" && (i = c[1], o = c[0], a = parseInt(c[2]) + 1900), t === "yy/dd/mm" && (i = c[2], o = c[1], a = parseInt(c[0]) + 1900), t === "yy/d/m" && (i = c[2], o = c[1], a = parseInt(c[0]) + 1900), t === "yy/mm/dd" && (i = c[1], o = c[2], a = parseInt(c[0]) + 1900), t === "yy/m/d" && (i = c[1], o = c[2], a = parseInt(c[0]) + 1900);
      }
      return !!this.isInt(a) && !!this.isInt(i) && !!this.isInt(o) && (a = +a, i = +i, o = +o, (n = new Date(a, i - 1, o)).setFullYear(a), i != null) && String(n) !== "Invalid Date" && n.getMonth() + 1 === i && n.getDate() === o && n.getFullYear() === a && (s !== true || n);
    }
    isTime(a, t) {
      if (a == null) return false;
      let s, n, i;
      n = 0 <= (a = (a = String(a)).toUpperCase()).indexOf("AM");
      var o = (i = 0 <= a.indexOf("PM")) || n, a = (s = o ? 12 : 24, (a = a.replace("AM", "").replace("PM", "").trim()).split(":"));
      let r = parseInt(a[0] || 0), c = parseInt(a[1] || 0), d = parseInt(a[2] || 0);
      return (o && a.length === 1 || a.length === 2 || a.length === 3) && !(a[0] === "" || r < 0 || r > s || !this.isInt(a[0]) || 2 < a[0].length || 1 < a.length && (a[1] === "" || c < 0 || 59 < c || !this.isInt(a[1]) || a[1].length !== 2) || 2 < a.length && (a[2] === "" || d < 0 || 59 < d || !this.isInt(a[2]) || a[2].length !== 2) || !(o || s !== r || c === 0 && d === 0) || o && a.length === 1 && r === 0) && (t !== true || (i && r !== 12 && (r += 12), n && r === 12 && (r += 12), {
        hours: r,
        minutes: c,
        seconds: d
      }));
    }
    isDateTime(e, t, s) {
      var n;
      return typeof e.getFullYear == "function" ? s !== true || e : (n = parseInt(e)) === e ? !(n < 0) && (s !== true || new Date(n)) : (n = String(e).indexOf(" ")) < 0 ? !(String(e).indexOf("T") < 0 || String(new Date(e)) == "Invalid Date") && (s !== true || new Date(e)) : (t = (t = t ?? this.settings.datetimeFormat).split("|"), e = [
        e.substr(0, n),
        e.substr(n).trim()
      ], t[0] = t[0].trim(), t[1] && (t[1] = t[1].trim()), n = this.isDate(e[0], t[0], true), t = this.isTime(e[1], true), n !== false && t !== false && (s !== true || (n.setHours(t.hours), n.setMinutes(t.minutes), n.setSeconds(t.seconds), n)));
    }
    age(e) {
      let t;
      if (e === "" || e == null || (t = typeof e.getFullYear == "function" ? e : parseInt(e) == e && 0 < parseInt(e) ? new Date(parseInt(e)) : new Date(e), String(t) === "Invalid Date")) return "";
      e = ((/* @__PURE__ */ new Date()).getTime() - t.getTime()) / 1e3;
      let s = "", n = "";
      return e < 0 ? (s = 0, n = "sec") : e < 60 ? (s = Math.floor(e), n = "sec", e < 0 && (s = 0, n = "sec")) : e < 3600 ? (s = Math.floor(e / 60), n = "min") : e < 86400 ? (s = Math.floor(e / 60 / 60), n = "hour") : e < 2592e3 ? (s = Math.floor(e / 24 / 60 / 60), n = "day") : e < 31536e3 ? (s = Math.floor(e / 30 / 24 / 60 / 60 * 10) / 10, n = "month") : e < 126144e3 ? (s = Math.floor(e / 365 / 24 / 60 / 60 * 10) / 10, n = "year") : 126144e3 <= e && (s = Math.floor(e / 365.25 / 24 / 60 / 60 * 10) / 10, n = "year"), s + " " + n + (1 < s ? "s" : "");
    }
    interval(e) {
      return e < 100 ? "< 0.01 sec" : e < 1e3 ? Math.floor(e / 10) / 100 + " sec" : e < 1e4 ? Math.floor(e / 100) / 10 + " sec" : e < 6e4 ? Math.floor(e / 1e3) + " secs" : e < 36e5 ? Math.floor(e / 6e4) + " mins" : e < 864e5 ? Math.floor(e / 36e5 * 10) / 10 + " hours" : e < 2628e6 ? Math.floor(e / 864e5 * 10) / 10 + " days" : e < 31536e6 ? Math.floor(e / 2628e6 * 10) / 10 + " months" : Math.floor(e / 31536e5) / 10 + " years";
    }
    date(i) {
      if (i === "" || i == null || typeof i == "object" && !i.getMonth) return "";
      let t = new Date(i);
      if (this.isInt(i) && (t = new Date(Number(i))), String(t) === "Invalid Date") return "";
      var i = this.settings.shortmonths, n = /* @__PURE__ */ new Date(), o = /* @__PURE__ */ new Date(), s = (o.setTime(o.getTime() - 864e5), i[t.getMonth()] + " " + t.getDate() + ", " + t.getFullYear()), n = i[n.getMonth()] + " " + n.getDate() + ", " + n.getFullYear(), i = i[o.getMonth()] + " " + o.getDate() + ", " + o.getFullYear(), o = t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + " " + (12 <= t.getHours() ? "pm" : "am");
      let a = s == n ? o : s;
      return '<span title="' + s + " " + (t.getHours() - (12 < t.getHours() ? 12 : 0) + ":" + (t.getMinutes() < 10 ? "0" : "") + t.getMinutes() + ":" + (t.getSeconds() < 10 ? "0" : "") + t.getSeconds() + " " + (12 <= t.getHours() ? "pm" : "am")) + '">' + (a = s == i ? this.lang("Yesterday") : a) + "</span>";
    }
    formatSize(e) {
      var t;
      return this.isFloat(e) && e !== "" ? (e = parseFloat(e)) === 0 ? 0 : (t = parseInt(Math.floor(Math.log(e) / Math.log(1024))), (Math.floor(e / Math.pow(1024, t) * 10) / 10).toFixed(t === 0 ? 0 : 1) + " " + ([
        "Bt",
        "KB",
        "MB",
        "GB",
        "TB",
        "PB",
        "EB",
        "ZB"
      ][t] || "??")) : "";
    }
    formatNumber(e, t, s) {
      return e == null || e === "" || typeof e == "object" ? "" : (s = {
        minimumFractionDigits: parseInt(t),
        maximumFractionDigits: parseInt(t),
        useGrouping: !!s
      }, (t == null || t < 0) && (s.minimumFractionDigits = 0, s.maximumFractionDigits = 20), parseFloat(e).toLocaleString(this.settings.locale, s));
    }
    formatDate(e, t) {
      if (t = t || this.settings.dateFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
      let s = new Date(e);
      var n, i;
      return this.isInt(e) && (s = new Date(Number(e))), String(s) === "Invalid Date" ? "" : (e = s.getFullYear(), n = s.getMonth(), i = s.getDate(), t.toLowerCase().replace("month", this.settings.fullmonths[n]).replace("mon", this.settings.shortmonths[n]).replace(/yyyy/g, ("000" + e).slice(-4)).replace(/yyy/g, ("000" + e).slice(-4)).replace(/yy/g, ("0" + e).slice(-2)).replace(/(^|[^a-z$])y/g, "$1" + e).replace(/mm/g, ("0" + (n + 1)).slice(-2)).replace(/dd/g, ("0" + i).slice(-2)).replace(/th/g, i == 1 ? "st" : "th").replace(/th/g, i == 2 ? "nd" : "th").replace(/th/g, i == 3 ? "rd" : "th").replace(/(^|[^a-z$])m/g, "$1" + (n + 1)).replace(/(^|[^a-z$])d/g, "$1" + i));
    }
    formatTime(e, t) {
      if (t = t || this.settings.timeFormat, e === "" || e == null || typeof e == "object" && !e.getMonth) return "";
      let s = new Date(e);
      if (this.isInt(e) && (s = new Date(Number(e))), this.isTime(e) && (e = this.isTime(e, true), (s = /* @__PURE__ */ new Date()).setHours(e.hours), s.setMinutes(e.minutes)), String(s) === "Invalid Date") return "";
      let n = "am", i = s.getHours();
      e = s.getHours();
      let o = s.getMinutes(), a = s.getSeconds();
      return o < 10 && (o = "0" + o), a < 10 && (a = "0" + a), t.indexOf("am") === -1 && t.indexOf("pm") === -1 || (12 <= i && (n = "pm"), 12 < i && (i -= 12), i === 0 && (i = 12)), t.toLowerCase().replace("am", n).replace("pm", n).replace("hhh", i < 10 ? "0" + i : i).replace("hh24", e < 10 ? "0" + e : e).replace("h24", e).replace("hh", i).replace("mm", o).replace("mi", o).replace("ss", a).replace(/(^|[^a-z$])h/g, "$1" + i).replace(/(^|[^a-z$])m/g, "$1" + o).replace(/(^|[^a-z$])s/g, "$1" + a);
    }
    formatDateTime(e, t) {
      let s;
      return e === "" || e == null || typeof e == "object" && !e.getMonth ? "" : (typeof t != "string" ? s = [
        this.settings.dateFormat,
        this.settings.timeFormat
      ] : ((s = t.split("|"))[0] = s[0].trim(), s[1] = 1 < s.length ? s[1].trim() : this.settings.timeFormat), s[1] === "h12" && (s[1] = "h:m pm"), s[1] === "h24" && (s[1] = "h24:m"), this.formatDate(e, s[0]) + " " + this.formatTime(e, s[1]));
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
    transition(e, t, s, n) {
      return new Promise((i, o) => {
        var a = getComputedStyle(e);
        let r = parseInt(a.width), c = parseInt(a.height);
        if (e && t) {
          switch (e.parentNode.style.cssText += "perspective: 900px; overflow: hidden;", e.style.cssText += "; position: absolute; z-index: 1019; backface-visibility: hidden", t.style.cssText += "; position: absolute; z-index: 1020; backface-visibility: hidden", s) {
            case "slide-left":
              e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(" + r + "px, 0, 0)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(-" + r + "px, 0, 0)";
              }, 1);
              break;
            case "slide-right":
              e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(-" + r + "px, 0, 0)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: translate3d(0px, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(" + r + "px, 0, 0)";
              }, 1);
              break;
            case "slide-down":
              e.style.cssText += "overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(0, " + c + "px, 0)";
              }, 1);
              break;
            case "slide-up":
              e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(0, " + c + "px, 0)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)", e.style.cssText += "transition: 0.5s; transform: translate3d(0, 0, 0)";
              }, 1);
              break;
            case "flip-left":
              e.style.cssText += "overflow: hidden; transform: rotateY(0deg)", t.style.cssText += "overflow: hidden; transform: rotateY(-180deg)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: rotateY(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateY(180deg)";
              }, 1);
              break;
            case "flip-right":
              e.style.cssText += "overflow: hidden; transform: rotateY(0deg)", t.style.cssText += "overflow: hidden; transform: rotateY(180deg)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: rotateY(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateY(-180deg)";
              }, 1);
              break;
            case "flip-down":
              e.style.cssText += "overflow: hidden; transform: rotateX(0deg)", t.style.cssText += "overflow: hidden; transform: rotateX(180deg)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: rotateX(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateX(-180deg)";
              }, 1);
              break;
            case "flip-up":
              e.style.cssText += "overflow: hidden; transform: rotateX(0deg)", t.style.cssText += "overflow: hidden; transform: rotateX(-180deg)", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: rotateX(0deg)", e.style.cssText += "transition: 0.5s; transform: rotateX(180deg)";
              }, 1);
              break;
            case "pop-in":
              e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; transform: scale(1); opacity: 1;", e.style.cssText += "transition: 0.5s;";
              }, 1);
              break;
            case "pop-out":
              e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;", t.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; opacity: 1;", e.style.cssText += "transition: 0.5s; transform: scale(1.7); opacity: 0;";
              }, 1);
              break;
            default:
              e.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)", t.style.cssText += "overflow: hidden; translate3d(0, 0, 0); opacity: 0;", h(t).show(), setTimeout(() => {
                t.style.cssText += "transition: 0.5s; opacity: 1;", e.style.cssText += "transition: 0.5s";
              }, 1);
          }
          setTimeout(() => {
            s === "slide-down" && (h(e).css("z-index", "1019"), h(t).css("z-index", "1020")), t && h(t).css({
              opacity: "1"
            }).css({
              transition: "",
              transform: ""
            }), e && h(e).css({
              opacity: "1"
            }).css({
              transition: "",
              transform: ""
            }), typeof n == "function" && n(), i();
          }, 500);
        } else console.log("ERROR: Cannot do transition when one of the divs is null");
      });
    }
    lock(e, t = {}) {
      if (e != null) {
        typeof t == "string" && (t = {
          msg: t
        }), arguments[2] && (t.spinner = arguments[2]), t = this.extend({
          spinner: false
        }, t), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), t.msg || t.msg === 0 || (t.msg = ""), this.unlock(e);
        var s = h(e).get(0);
        let n = s.scrollWidth, i = s.scrollHeight, o = (s.tagName == "BODY" && (n < innerWidth && (n = innerWidth), i < innerHeight) && (i = innerHeight), h(e).prepend(`<div class="w2ui-lock" style="height: ${i}px; width: ${n}px"></div><div class="w2ui-lock-msg"></div>`), h(e).find(".w2ui-lock"));
        s = h(e).find(".w2ui-lock-msg"), e = (t.msg || s.css({
          "background-color": "transparent",
          "background-image": "none",
          border: "0px",
          "box-shadow": "none"
        }), t.spinner === true && (t.msg = `<div class="w2ui-spinner" ${t.msg ? "" : 'style="width: 35px; height: 35px"'}></div>` + t.msg), t.msg ? s.html(t.msg).css("display", "block") : s.remove(), t.opacity != null && o.css("opacity", t.opacity), o.css({
          display: "block"
        }), t.bgColor && o.css({
          "background-color": t.bgColor
        }), getComputedStyle(o.get(0)));
        let a = e.opacity ?? 0.15;
        o.on("mousedown", function() {
          typeof t.onClick == "function" ? t.onClick() : o.css({
            transition: ".2s",
            opacity: 1.5 * a
          });
        }).on("mouseup", function() {
          typeof t.onClick != "function" && o.css({
            transition: ".2s",
            opacity: a
          });
        }).on("mousewheel", function(r) {
          r && (r.stopPropagation(), r.preventDefault());
        });
      }
    }
    unlock(e, t) {
      var s;
      e != null && (clearTimeout(e._prevUnlock), (e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), this.isInt(t) && 0 < t ? (h(e).find(".w2ui-lock").css({
        transition: t / 1e3 + "s",
        opacity: 0
      }), s = h(e).get(0), clearTimeout(s._prevUnlock), s._prevUnlock = setTimeout(() => {
        h(e).find(".w2ui-lock").remove();
      }, t)) : h(e).find(".w2ui-lock").remove(), h(e).find(".w2ui-lock-msg").remove());
    }
    message(e, t) {
      var _a2, _b;
      let s, n, i;
      var o = () => {
        var _a3;
        var b = h(e == null ? void 0 : e.box).find(".w2ui-message");
        b.length != 0 && typeof ((_a3 = t = b.get(0)._msg_options || {}) == null ? void 0 : _a3.close) == "function" && t.close();
      };
      let a = (b) => {
        var _a3, _b2;
        var C, _ = b.box._msg_prevFocus;
        h(e.box).find(".w2ui-message").length <= 1 ? e.owner ? e.owner.unlock(e.param, 150) : this.unlock(e.box, 150) : h(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + (b.msgIndex - 1)).css("z-index", 1500), _ ? 0 < (C = h(_).closest(".w2ui-message")).length ? C.get(0)._msg_options.setFocus(_) : _.focus() : typeof ((_b2 = e.owner) == null ? void 0 : _b2.focus) == "function" && e.owner.focus(), h(b.box).remove(), b.msgIndex === 0 && (x.css("z-index", b.tmp.zIndex), h(e.box).css("overflow", b.tmp.overflow)), b.trigger && i.finish();
      };
      if (typeof (t = typeof t != "string" && typeof t != "number" ? t : {
        width: String(t).length < 300 ? 350 : 550,
        height: String(t).length < 300 ? 170 : 250,
        text: String(t)
      }) != "object") return void o();
      t.text != null && (t.body = `<div class="w2ui-centered w2ui-msg-text">${t.text}</div>`), t.width == null && (t.width = 350), t.height == null && (t.height = 170), t.hideOn == null && (t.hideOn = [
        "esc"
      ]), t.on == null && (d = t, t = new cn(), y.extend(t, d)), t.on("open", (b) => {
        y.bindEvents(h(t.box).find(".w2ui-eaction"), t), h(b.detail.box).find("button, input, textarea, [name=hidden-first]").off(".message").on("keydown.message", function(C) {
          C.keyCode == 27 && t.hideOn.includes("esc") && (t.cancelAction ? t.action(t.cancelAction) : t.close());
        }), setTimeout(() => t.setFocus(t.focus), 300);
      }), t.off(".prom");
      let r = {
        self: t,
        action(b) {
          return t.on("action.prom", b), r;
        },
        close(b) {
          return t.on("close.prom", b), r;
        },
        open(b) {
          return t.on("open.prom", b), r;
        },
        then(b) {
          return t.on("open:after.prom", b), r;
        }
      }, c = (t.actions == null && t.buttons == null && t.html == null && (t.actions = {
        Ok(b) {
          b.detail.self.close();
        }
      }), t.off(".buttons"), t.actions != null && (t.buttons = "", Object.keys(t.actions).forEach((b) => {
        var C = t.actions[b];
        let _ = b;
        typeof C == "function" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${b}","event"]' name="${b}">${b}</button>`), typeof C == "object" && (t.buttons += `<button class="w2ui-btn w2ui-eaction ${C.class || ""}" name="${b}" data-click='["action","${b}","event"]'
                        style="${C.style ?? ""}" ${C.attrs ?? ""}>${C.text || b}</button>`, _ = Array.isArray(t.actions) ? C.text : b), typeof C == "string" && (t.buttons += `<button class="w2ui-btn w2ui-eaction" name="${C}" data-click='["action","${C}","event"]'>${C}</button>`, _ = C), typeof _ == "string" && (_ = _[0].toLowerCase() + _.substr(1).replace(/\s+/g, "")), r[_] = function(S) {
          return t.on("action.buttons", (A) => {
            A.detail.action[0].toLowerCase() + A.detail.action.substr(1).replace(/\s+/g, "") == _ && S(A);
          }), r;
        };
      })), Array("html", "body", "buttons").forEach((b) => {
        t[b] = String(t[b] ?? "").trim();
      }), t.body === "" && t.buttons === "" || (t.html = `
                <div class="w2ui-message-body">${t.body || ""}</div>
                <div class="w2ui-message-buttons">${t.buttons || ""}</div>
            `), getComputedStyle(h(e.box).get(0)));
      var d = parseFloat(c.width), p = parseFloat(c.height);
      let f = 0, x = (0 < h(e.after).length && (c = getComputedStyle(h(e.after).get(0)), f = parseInt(c.display != "none" ? parseInt(c.height) : 0)), t.width > d && (t.width = d - 10), t.height > p - f && (t.height = p - 10 - f), t.originalWidth = t.width, t.originalHeight = t.height, parseInt(t.width) < 0 && (t.width = d + t.width), parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 0 && (t.height = p + t.height - f), parseInt(t.height) < 10 && (t.height = 10), t.originalHeight < 0 && (t.height = p + t.originalHeight - f), t.originalWidth < 0 && (t.width = d + 2 * t.originalWidth), h(e.box).find(e.after));
      return t.tmp || (t.tmp = {
        zIndex: x.css("z-index"),
        overflow: c.overflow
      }), t.html === "" && t.body === "" && t.buttons === "" ? o() : (t.msgIndex = h(e.box).find(".w2ui-message").length, t.msgIndex === 0 && typeof this.lock == "function" && (h(e.box).css("overflow", "hidden"), e.owner ? e.owner.lock(e.param) : this.lock(e.box)), h(e.box).find(".w2ui-message").css("z-index", 1390), x.css("z-index", 1501), p = `
                <div id="w2ui-message-${(_a2 = e.owner) == null ? void 0 : _a2.name}-${t.msgIndex}" class="w2ui-message" data-mousedown="stop"
                    style="z-index: 1500; left: ${(d - t.width) / 2}px; top: ${f}px;
                        width: ${t.width}px; height: ${t.height}px; transform: translateY(-${t.height}px)"
                    ${t.hideOn.includes("click") ? e.param ? `data-click='["message", "${e.param}"]` : 'data-click="message"' : ""}>
                    <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                    ${t.html}
                    <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                </div>`, 0 < h(e.after).length ? h(e.box).find(e.after).after(p) : h(e.box).prepend(p), t.box = h(e.box).find(`#w2ui-message-${(_b = e.owner) == null ? void 0 : _b.name}-` + t.msgIndex)[0], y.bindEvents(t.box, this), h(t.box).addClass("animating"), (t.box._msg_options = t).box._msg_prevFocus = document.activeElement, setTimeout(() => {
        var _a3;
        (i = t.trigger("open", {
          target: this.name,
          box: t.box,
          self: t
        })).isCancelled === true ? (h(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + t.msgIndex).remove(), t.msgIndex === 0 && (x.css("z-index", t.tmp.zIndex), h(e.box).css("overflow", t.tmp.overflow))) : h(t.box).css({
          transition: "0.3s",
          transform: "translateY(0px)"
        });
      }, 0), n = setTimeout(() => {
        var _a3;
        h(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + t.msgIndex).removeClass("animating").css({
          transition: "0s"
        }), i.finish();
      }, 300)), t.action = (b, C) => {
        let _ = t.actions[b];
        _ instanceof Object && _.onClick && (_ = _.onClick), b = t.trigger("action", {
          target: this.name,
          action: b,
          self: t,
          originalEvent: C,
          value: t.input ? t.input.value : null
        }), b.isCancelled !== true && (typeof _ == "function" && _(b), b.finish());
      }, t.close = () => {
        var _a3;
        (i = t.trigger("close", {
          target: "self",
          box: t.box,
          self: t
        })).isCancelled !== true && (clearTimeout(n), h(t.box).hasClass("animating") ? (clearTimeout(s), a(t)) : (h(t.box).addClass("w2ui-closing animating").css({
          transition: "0.15s",
          transform: "translateY(-" + t.height + "px)"
        }), t.msgIndex !== 0 && h(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + (t.msgIndex - 1)).css("z-index", 1499), s = setTimeout(() => {
          a(t);
        }, 150)));
      }, t.setFocus = (b) => {
        var _a3, _b2;
        var C = h(e.box).find(".w2ui-message").length - 1;
        let _ = h(e.box).find(`#w2ui-message-${(_a3 = e.owner) == null ? void 0 : _a3.name}-` + C), S = "input, button, select, textarea, [contentEditable], .w2ui-input";
        (_b2 = b != null ? isNaN(b) ? _.find(S).filter(b).get(0) : _.find(S).get(b) : _.find("[name=hidden-first]").get(0)) == null ? void 0 : _b2.focus(), h(e.box).find(".w2ui-message").find(S + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus"), h(_).find(S + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(A) {
          setTimeout(() => {
            var _a4, _b3, _c2;
            var P = document.activeElement, H = 0 < h(_).find(S).filter(P).length, U = h(P).attr("name");
            !H && P && P !== document.body && ((_a4 = h(_).find(S).get(0)) == null ? void 0 : _a4.focus()), U == "hidden-last" && ((_b3 = h(_).find(S).get(0)) == null ? void 0 : _b3.focus()), U == "hidden-first" && ((_c2 = h(_).find(S).get(-1)) == null ? void 0 : _c2.focus());
          }, 1);
        });
      }, r;
    }
    notify(e, t) {
      return new Promise((s) => {
        if (typeof e == "object" && (e = (t = e).text), (t = t || {}).where = t.where ?? document.body, t.timeout = t.timeout ?? 15e3, typeof this.tmp.notify_resolve == "function" && (this.tmp.notify_resolve(), h(this.tmp.notify_where).find("#w2ui-notify").remove()), this.tmp.notify_resolve = s, this.tmp.notify_where = t.where, clearTimeout(this.tmp.notify_timer), e) {
          if (typeof t.actions == "object") {
            let i = {};
            Object.keys(t.actions).forEach((o) => {
              i[o] = `<a class="w2ui-notify-link" value="${o}">${o}</a>`;
            }), e = this.execTemplate(e, i);
          }
          var n = `
                    <div id="w2ui-notify">
                        <div class="${t.class} ${t.error ? "w2ui-notify-error" : ""}">
                            ${e}
                            <span class="w2ui-notify-close w2ui-icon-cross"></span>
                        </div>
                    </div>`;
          h(t.where).append(n), h(t.where).find("#w2ui-notify").find(".w2ui-notify-close").on("click", (i) => {
            h(t.where).find("#w2ui-notify").remove(), s();
          }), t.actions && h(t.where).find("#w2ui-notify .w2ui-notify-link").on("click", (i) => {
            i = h(i.target).attr("value"), t.actions[i](), h(t.where).find("#w2ui-notify").remove(), s();
          }), 0 < t.timeout && (this.tmp.notify_timer = setTimeout(() => {
            h(t.where).find("#w2ui-notify").remove(), s();
          }, t.timeout));
        }
      });
    }
    confirm(e, t) {
      return y.normButtons(t = typeof t == "string" ? {
        text: t
      } : t, {
        yes: "Yes",
        no: "No"
      }), e = y.message(e, t), e && e.action((s) => {
        s.detail.self.close();
      }), e;
    }
    normButtons(e, t) {
      e.actions = e.actions ?? {};
      var s = Object.keys(t);
      return s.forEach((n) => {
        var i = e["btn_" + n];
        i && (t[n] = {
          text: y.lang(i.text ?? ""),
          class: i.class ?? "",
          style: i.style ?? "",
          attrs: i.attrs ?? ""
        }, delete e["btn_" + n]), Array("text", "class", "style", "attrs").forEach((o) => {
          e[n + "_" + o] && (typeof t[n] == "string" && (t[n] = {
            text: t[n]
          }), t[n][o] = e[n + "_" + o], delete e[n + "_" + o]);
        });
      }), s.includes("yes") && s.includes("no") && (y.settings.macButtonOrder ? y.extend(e.actions, {
        no: t.no,
        yes: t.yes
      }) : y.extend(e.actions, {
        yes: t.yes,
        no: t.no
      })), s.includes("ok") && s.includes("cancel") && (y.settings.macButtonOrder ? y.extend(e.actions, {
        cancel: t.cancel,
        ok: t.ok
      }) : y.extend(e.actions, {
        ok: t.ok,
        cancel: t.cancel
      })), e;
    }
    getSize(e, t) {
      let s = 0;
      if (0 < (e = h(e)).length) {
        e = e[0];
        var n = getComputedStyle(e);
        switch (t) {
          case "width":
            s = parseFloat(n.width), n.width === "auto" && (s = 0);
            break;
          case "height":
            s = parseFloat(n.height), n.height === "auto" && (s = 0);
            break;
          default:
            s = parseFloat(n[t] ?? 0) || 0;
        }
      }
      return s;
    }
    getStrWidth(e, t) {
      return h("body").append(`
            <div id="_tmp_width" style="position: absolute; top: -9000px; ${t || ""}">
                ${this.encodeTags(e)}
            </div>`), t = h("#_tmp_width")[0].clientWidth, h("#_tmp_width").remove(), t;
    }
    execTemplate(e, t) {
      return typeof e == "string" && t && typeof t == "object" ? e.replace(/\${([^}]+)?}/g, function(s, n) {
        return t[n] || n;
      }) : e;
    }
    marker(e, t, s = {
      onlyFirst: false,
      wholeWord: false
    }) {
      Array.isArray(t) || (t = t != null && t !== "" ? [
        t
      ] : []);
      let n = s.wholeWord;
      h(e).each((i) => {
        for (var o = i, a = /\<span class=\"w2ui\-marker\"\>((.|\n|\r)*)\<\/span\>/gi; o.innerHTML.indexOf('<span class="w2ui-marker"') !== -1; ) o.innerHTML = o.innerHTML.replace(a, "$1");
        t.forEach((r) => {
          r = (r = typeof r != "string" ? String(r) : r).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;"), r = new RegExp((n ? "\\b" : "") + r + (n ? "\\b" : "") + "(?!([^<]+)?>)", "i" + (s.onlyFirst ? "" : "g")), i.innerHTML = i.innerHTML.replace(r, (c) => '<span class="w2ui-marker">' + c + "</span>");
        });
      });
    }
    lang(e, t) {
      if (!e || this.settings.phrases == null || typeof e != "string" || "<=>=".includes(e)) return this.execTemplate(e, t);
      let s = this.settings.phrases[e];
      return s == null ? (s = e, this.settings.warnNoPhrase && (this.settings.missing || (this.settings.missing = {}), this.settings.missing[e] = "---", this.settings.phrases[e] = "---", console.log(`Missing translation for "%c${e}%c", see %c w2utils.settings.phrases %c with value "---"`, "color: orange", "", "color: #999", ""))) : s !== "---" || this.settings.warnNoPhrase || (s = e), s === "---" && (s = `<span ${this.tooltip(e)}>---</span>`), this.execTemplate(s, t);
    }
    locale(e, t, s) {
      return new Promise((n, i) => {
        if (Array.isArray(e)) {
          this.settings.phrases = {};
          let o = [], a = {};
          e.forEach((r, c) => {
            r.length === 5 && (r = "locale/" + r.toLowerCase() + ".json", e[c] = r), o.push(this.locale(r, true, false));
          }), Promise.allSettled(o).then((r) => {
            r.forEach((c) => {
              c.value && (a[c.value.file] = c.value.data);
            }), e.forEach((c) => {
              this.settings = this.extend({}, this.settings, a[c]);
            }), n();
          });
        } else (e = e || "en-us") instanceof Object ? this.settings = this.extend({}, this.settings, vo, e) : (e.length === 5 && (e = "locale/" + e.toLowerCase() + ".json"), fetch(e, {
          method: "GET"
        }).then((o) => o.json()).then((o) => {
          s !== true && (this.settings = t ? this.extend({}, this.settings, o) : this.extend({}, this.settings, vo, {
            phrases: {}
          }, o)), n({
            file: e,
            data: o
          });
        }).catch((o) => {
          console.log("ERROR: Cannot load locale " + e), i(o);
        }));
      });
    }
    scrollBarSize() {
      return this.tmp.scrollBarSize || (h("body").append(`
            <div id="_scrollbar_width" style="position: absolute; top: -300px; width: 100px; height: 100px; overflow-y: scroll;">
                <div style="height: 120px">1</div>
            </div>
        `), this.tmp.scrollBarSize = 100 - h("#_scrollbar_width > div")[0].clientWidth, h("#_scrollbar_width").remove()), this.tmp.scrollBarSize;
    }
    checkName(e) {
      return e == null ? (console.log('ERROR: Property "name" is required but not supplied.'), false) : Bs[e] != null ? (console.log(`ERROR: Object named "${e}" is already registered as w2ui.${e}.`), false) : !!this.isAlphaNumeric(e) || (console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).'), false);
    }
    checkUniqueId(e, t, s, n) {
      Array.isArray(t) || (t = [
        t
      ]);
      let i = true;
      return t.forEach((o) => {
        o.id === e && (console.log(`ERROR: The item id="${e}" is not unique within the ${s} "${n}".`, t), i = false);
      }), i;
    }
    encodeParams(e, t = "") {
      let s = "";
      return Object.keys(e).forEach((n) => {
        s != "" && (s += "&"), typeof e[n] == "object" ? s += this.encodeParams(e[n], t + n + (t ? "]" : "") + "[") : s += "" + t + n + (t ? "]" : "") + "=" + e[n];
      }), s;
    }
    parseRoute(e) {
      let t = [];
      return e = e.replace(/\/\(/g, "(?:/").replace(/\+/g, "__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (s, n, i, o, a, r) => (t.push({
        name: o,
        optional: !!r
      }), n = n || "", (r ? "" : n) + "(?:" + (r ? n : "") + (i || "") + (a || (i ? "([^/.]+?)" : "([^/]+?)")) + ")" + (r || ""))).replace(/([\/.])/g, "\\$1").replace(/__plus__/g, "(.+)").replace(/\*/g, "(.*)"), {
        path: new RegExp("^" + e + "$", "i"),
        keys: t
      };
    }
    getCursorPosition(e) {
      if (e == null) return null;
      let t = 0;
      var s, n = e.ownerDocument || e.document, i = n.defaultView || n.parentWindow;
      let o;
      return [
        "INPUT",
        "TEXTAREA"
      ].includes(e.tagName) ? t = e.selectionStart : i.getSelection ? 0 < (o = i.getSelection()).rangeCount && ((s = (i = o.getRangeAt(0)).cloneRange()).selectNodeContents(e), s.setEnd(i.endContainer, i.endOffset), t = s.toString().length) : (o = n.selection) && o.type !== "Control" && (i = o.createRange(), (s = n.body.createTextRange()).moveToElementText(e), s.setEndPoint("EndToEnd", i), t = s.text.length), t;
    }
    setCursorPosition(e, t, s) {
      if (e != null) {
        var n = document.createRange();
        let i, o = window.getSelection();
        if ([
          "INPUT",
          "TEXTAREA"
        ].includes(e.tagName)) e.setSelectionRange(t, s ?? t);
        else {
          for (let a = 0; a < e.childNodes.length; a++) {
            let r = h(e.childNodes[a]).text();
            if (t <= (r = e.childNodes[a].tagName ? (r = h(e.childNodes[a]).html()).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ") : r).length) {
              (i = (i = e.childNodes[a]).childNodes && 0 < i.childNodes.length ? i.childNodes[0] : i).childNodes && 0 < i.childNodes.length && (i = i.childNodes[0]);
              break;
            }
            t -= r.length;
          }
          i != null && (t > i.length && (t = i.length), n.setStart(i, t), s ? n.setEnd(i, s) : n.collapse(true), o.removeAllRanges(), o.addRange(n));
        }
      }
    }
    parseColor(e) {
      if (typeof e != "string") return null;
      let t = {};
      if ((e = (e = e.trim().toUpperCase())[0] === "#" ? e.substr(1) : e).length === 3) t = {
        r: parseInt(e[0] + e[0], 16),
        g: parseInt(e[1] + e[1], 16),
        b: parseInt(e[2] + e[2], 16),
        a: 1
      };
      else if (e.length === 6) t = {
        r: parseInt(e.substr(0, 2), 16),
        g: parseInt(e.substr(2, 2), 16),
        b: parseInt(e.substr(4, 2), 16),
        a: 1
      };
      else if (e.length === 8) t = {
        r: parseInt(e.substr(0, 2), 16),
        g: parseInt(e.substr(2, 2), 16),
        b: parseInt(e.substr(4, 2), 16),
        a: Math.round(parseInt(e.substr(6, 2), 16) / 255 * 100) / 100
      };
      else if (4 < e.length && e.substr(0, 4) === "RGB(") {
        var s = e.replace("RGB", "").replace(/\(/g, "").replace(/\)/g, "").split(",");
        t = {
          r: parseInt(s[0], 10),
          g: parseInt(s[1], 10),
          b: parseInt(s[2], 10),
          a: 1
        };
      } else {
        if (!(5 < e.length && e.substr(0, 5) === "RGBA(")) return null;
        s = e.replace("RGBA", "").replace(/\(/g, "").replace(/\)/g, "").split(","), t = {
          r: parseInt(s[0], 10),
          g: parseInt(s[1], 10),
          b: parseInt(s[2], 10),
          a: parseFloat(s[3])
        };
      }
      return t;
    }
    hsv2rgb(e, t, s, n) {
      let i, o, a, r, c, d, p, f;
      switch (arguments.length === 1 && (t = e.s, s = e.v, n = e.a, e = e.h), d = (s /= 100) * (1 - (t /= 100)), p = s * (1 - (c = 6 * (e /= 360) - (r = Math.floor(6 * e))) * t), f = s * (1 - (1 - c) * t), r % 6) {
        case 0:
          i = s, o = f, a = d;
          break;
        case 1:
          i = p, o = s, a = d;
          break;
        case 2:
          i = d, o = s, a = f;
          break;
        case 3:
          i = d, o = p, a = s;
          break;
        case 4:
          i = f, o = d, a = s;
          break;
        case 5:
          i = s, o = d, a = p;
      }
      return {
        r: Math.round(255 * i),
        g: Math.round(255 * o),
        b: Math.round(255 * a),
        a: n ?? 1
      };
    }
    rgb2hsv(e, t, s, n) {
      arguments.length === 1 && (t = e.g, s = e.b, n = e.a, e = e.r);
      let i = Math.max(e, t, s), o = Math.min(e, t, s), a = i - o, r, c = i === 0 ? 0 : a / i, d = i / 255;
      switch (i) {
        case o:
          r = 0;
          break;
        case e:
          r = t - s + a * (t < s ? 6 : 0), r /= 6 * a;
          break;
        case t:
          r = s - e + 2 * a, r /= 6 * a;
          break;
        case s:
          r = e - t + 4 * a, r /= 6 * a;
      }
      return {
        h: Math.round(360 * r),
        s: Math.round(100 * c),
        v: Math.round(100 * d),
        a: n ?? 1
      };
    }
    tooltip(e, t) {
      let s = "mouseenter", n = "mouseleave";
      return t = (t = typeof e == "object" ? e : t) || {}, typeof e == "string" && (t.html = e), t.showOn && (s = t.showOn, delete t.showOn), t.hideOn && (n = t.hideOn, delete t.hideOn), t.name || (t.name = "no-name"), ` on${s}="w2tooltip.show(this, JSON.parse(w2utils.base64decode('${this.base64encode(JSON.stringify(t))}')))" on${n}="w2tooltip.hide('${t.name}')"`;
    }
    isPlainObject(e) {
      return e != null && Object.prototype.toString.call(e) === "[object Object]" && (e.constructor === void 0 || (e = Object.getPrototypeOf(e)) === null || e === Object.prototype);
    }
    clone(e, t) {
      let s;
      return t = Object.assign({
        functions: true,
        elements: true,
        events: true,
        exclude: []
      }, t ?? {}), Array.isArray(e) ? (s = Array.from(e)).forEach((n, i) => {
        s[i] = this.clone(n, t);
      }) : this.isPlainObject(e) ? (s = {}, Object.assign(s, e), t.exclude && t.exclude.forEach((n) => {
        delete s[n];
      }), Object.keys(s).forEach((n) => {
        s[n] = this.clone(s[n], t), s[n] === void 0 && delete s[n];
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
            var n;
            e[s] != null && typeof e[s] == "object" && t[s] != null && typeof t[s] == "object" ? (n = this.clone(t[s]), e[s] instanceof Node || e[s] instanceof Event ? e[s] = n : (Array.isArray(e[s]) && this.isPlainObject(n) && (e[s] = {}), this.extend(e[s], n))) : e[s] = this.clone(t[s]);
          });
        } else if (t != null) throw new Error("Object is not extendable, only {} or [] can be extended.");
      }
      if (2 < arguments.length) for (let s = 2; s < arguments.length; s++) this.extend(e, arguments[s]);
      return e;
    }
    naturalCompare(e, t) {
      let s, n, i = 1, o = 0, a = 0, r = String.alphabet;
      function c(d, p, f) {
        if (f) {
          for (s = p; (f = c(d, s)) < 76 && 65 < f; ) ++s;
          return +d.slice(p - 1, s);
        }
        return -1 < (f = r && r.indexOf(d.charAt(p))) ? f + 76 : (f = d.charCodeAt(p) || 0) < 45 || 127 < f ? f : f < 46 ? 65 : f < 48 ? f - 1 : f < 58 ? f + 18 : f < 65 ? f - 11 : f < 91 ? f + 11 : f < 97 ? f - 37 : f < 123 ? f + 5 : f - 63;
      }
      if ((e += "") != (t += "")) {
        for (; i; ) if (n = c(e, o++), i = c(t, a++), n < 76 && i < 76 && 66 < n && 66 < i && (n = c(e, o, o), i = c(t, a, o = s), a = s), n != i) return n < i ? -1 : 1;
      }
      return 0;
    }
    normMenu(e, t) {
      return Array.isArray(e) ? (e.forEach((s, n) => {
        typeof s == "string" || typeof s == "number" ? e[n] = {
          id: s,
          text: String(s)
        } : s != null ? (s.caption != null && s.text == null && (s.text = s.caption), s.text != null && s.id == null && (s.id = s.text), s.text == null && s.id != null && (s.text = s.id)) : e[n] = {
          id: null,
          text: "null"
        };
      }), e) : typeof e == "function" ? (t = e.call(this, e, t), y.normMenu.call(this, t)) : typeof e == "object" ? Object.keys(e).map((s) => ({
        id: s,
        text: e[s]
      })) : void 0;
    }
    prepareParams(e, t, s) {
      s = s ?? y.settings.dataType;
      let n = t.body;
      switch (s) {
        case "HTTPJSON":
          n = {
            request: n
          }, [
            "PUT",
            "DELETE"
          ].includes(t.method) && (t.method = "POST"), i();
          break;
        case "HTTP":
          [
            "PUT",
            "DELETE"
          ].includes(t.method) && (t.method = "POST"), i();
          break;
        case "RESTFULL":
          [
            "PUT",
            "DELETE"
          ].includes(t.method) ? t.headers["Content-Type"] = "application/json" : i();
          break;
        case "JSON":
          t.method == "GET" ? (n = {
            request: n
          }, i()) : (t.headers["Content-Type"] = "application/json", t.method = "POST");
      }
      return t.body = typeof t.body == "string" ? t.body : JSON.stringify(t.body), t;
      function i() {
        Object.keys(n).forEach((o) => {
          let a = n[o];
          typeof a == "object" && (a = JSON.stringify(a)), e.searchParams.append(o, a);
        }), delete t.body;
      }
    }
    bindEvents(e, t) {
      e.length != 0 && ((e == null ? void 0 : e[0]) instanceof Node && (e = Array.isArray(e) ? e : e.get()), h(e).each((s) => {
        let n = h(s).data();
        Object.keys(n).forEach((i) => {
          if ([
            "click",
            "dblclick",
            "mouseenter",
            "mouseleave",
            "mouseover",
            "mouseout",
            "mousedown",
            "mousemove",
            "mouseup",
            "contextmenu",
            "focus",
            "focusin",
            "focusout",
            "blur",
            "input",
            "change",
            "keydown",
            "keyup",
            "keypress"
          ].indexOf(String(i).toLowerCase()) != -1) {
            let o = n[i], a = (o = typeof o == "string" ? o.split("|").map((r) => {
              (r = (r = (r = r === "true" ? true : r) === "false" ? false : r) === "undefined" ? void 0 : r) === "null" && (r = null);
              var c = [
                "'",
                '"',
                "`"
              ];
              return r = typeof (r = parseFloat(r) == r ? parseFloat(r) : r) == "string" && c.includes(r[0]) && c.includes(r[r.length - 1]) ? r.substring(1, r.length - 1) : r;
            }) : o)[0];
            o = o.slice(1), h(s).off(i + ".w2utils-bind").on(i + ".w2utils-bind", function(r) {
              switch (a) {
                case "alert":
                  alert(o[0]);
                  break;
                case "stop":
                  r.stopPropagation();
                  break;
                case "prevent":
                  r.preventDefault();
                  break;
                case "stopPrevent":
                  return r.stopPropagation(), r.preventDefault(), false;
                default:
                  if (t[a] == null) throw new Error(`Cannot dispatch event as the method "${a}" does not exist.`);
                  t[a].apply(t, o.map((c, d) => {
                    switch (String(c).toLowerCase()) {
                      case "event":
                        return r;
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
      return (...n) => {
        clearTimeout(s), s = setTimeout(() => {
          e(...n);
        }, t);
      };
    }
  }
  var y = new gc();
  class yc extends cn {
    constructor() {
      super(), this.defaults = {
        title: "",
        text: "",
        body: "",
        buttons: "",
        width: 450,
        height: 250,
        focus: null,
        actions: null,
        style: "",
        speed: 0.3,
        modal: false,
        maximized: false,
        keyboard: true,
        showClose: true,
        showMax: false,
        transition: null,
        openMaximized: false,
        moved: false
      }, this.name = "popup", this.status = "closed", this.onOpen = null, this.onClose = null, this.onMax = null, this.onMin = null, this.onToggle = null, this.onKeydown = null, this.onAction = null, this.onMove = null, this.tmp = {}, this.handleResize = (e) => {
        this.options.moved || this.center(void 0, void 0, true);
      };
    }
    open(e) {
      let t = this;
      this.status != "closing" && !h("#w2ui-popup").hasClass("animating") || this.close(true);
      var s = this.options;
      (e = [
        "string",
        "number"
      ].includes(typeof e) ? y.extend({
        title: "Notification",
        body: `<div class="w2ui-centered">${e}</div>`,
        actions: {
          Ok() {
            t.close();
          }
        },
        cancelAction: "ok"
      }, arguments[1] ?? {}) : e).text != null && (e.body = `<div class="w2ui-centered w2ui-msg-text">${e.text}</div>`), e = Object.assign({}, this.defaults, s, {
        title: "",
        body: ""
      }, e, {
        maximized: false
      }), this.options = e, h("#w2ui-popup").length === 0 && (this.off("*"), Object.keys(this).forEach((d) => {
        d.startsWith("on") && d != "on" && (this[d] = null);
      })), Object.keys(e).forEach((d) => {
        d.startsWith("on") && d != "on" && e[d] && (this[d] = e[d]);
      }), e.width = parseInt(e.width), e.height = parseInt(e.height);
      let n, i, o;
      var { top: a, left: r } = this.center();
      let c = {
        self: this,
        action(d) {
          return t.on("action.prom", d), c;
        },
        close(d) {
          return t.on("close.prom", d), c;
        },
        then(d) {
          return t.on("open:after.prom", d), c;
        }
      };
      if (e.actions == null || e.buttons || (e.buttons = "", Object.keys(e.actions).forEach((d) => {
        var p = e.actions[d];
        let f = d;
        typeof p == "function" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${d}","event"]'>${d}</button>`), typeof p == "object" && (e.buttons += `<button class="w2ui-btn w2ui-eaction ${p.class || ""}" name="${d}" data-click='["action","${d}","event"]'
                        style="${p.style}" ${p.attrs}>${p.text || d}</button>`, f = Array.isArray(e.actions) ? p.text : d), typeof p == "string" && (e.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${p}","event"]'>${p}</button>`, f = p), typeof f == "string" && (f = f[0].toLowerCase() + f.substr(1).replace(/\s+/g, "")), c[f] = function(x) {
          return t.on("action.buttons", (b) => {
            b.detail.action[0].toLowerCase() + b.detail.action.substr(1).replace(/\s+/g, "") == f && x(b);
          }), c;
        };
      })), h("#w2ui-popup").length === 0) {
        if ((n = this.trigger("open", {
          target: "popup",
          present: false
        })).isCancelled === true) return;
        this.status = "opening", y.lock(document.body, {
          opacity: 0.3,
          onClick: e.modal ? null : () => {
            this.close();
          }
        });
        let d = "";
        e.showClose && (d += `<div class="w2ui-popup-button w2ui-popup-close">
                            <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                        </div>`), e.showMax && (d += `<div class="w2ui-popup-button w2ui-popup-max">
                            <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                        </div>`), r = `
                left: ${r}px;
                top: ${a}px;
                width: ${parseInt(e.width)}px;
                height: ${parseInt(e.height)}px;
                transition: ${e.speed}s
            `, i = `<div id="w2ui-popup" class="w2ui-popup w2ui-anim-open animating" style="${y.stripSpaces(r)}"></div>`, h("body").append(i), h("#w2ui-popup")[0]._w2popup = {
          self: this,
          created: new Promise((p) => {
            this._promCreated = p;
          }),
          opened: new Promise((p) => {
            this._promOpened = p;
          }),
          closing: new Promise((p) => {
            this._promClosing = p;
          }),
          closed: new Promise((p) => {
            this._promClosed = p;
          })
        }, r = `${e.title ? "" : "top: 0px !important;"} ` + (e.buttons ? "" : "bottom: 0px !important;"), i = `
                <span name="hidden-first" tabindex="0" style="position: absolute; top: -100px"></span>
                <div class="w2ui-popup-title-btns">${d}</div>
                <div class="w2ui-popup-title" style="${e.title ? "" : "display: none"}"></div>
                <div class="w2ui-box" style="${r}">
                    <div class="w2ui-popup-body ${!e.title || " w2ui-popup-no-title"}
                        ${!e.buttons || " w2ui-popup-no-buttons"}" style="${e.style}">
                    </div>
                </div>
                <div class="w2ui-popup-buttons" style="${e.buttons ? "" : "display: none"}"></div>
                <span name="hidden-last" tabindex="0" style="position: absolute; top: -100px"></span>
            `, h("#w2ui-popup").html(i), e.title && h("#w2ui-popup .w2ui-popup-title").append(y.lang(e.title)), e.buttons && h("#w2ui-popup .w2ui-popup-buttons").append(e.buttons), e.body && h("#w2ui-popup .w2ui-popup-body").append(e.body), setTimeout(() => {
          h("#w2ui-popup").css("transition", e.speed + "s").removeClass("w2ui-anim-open"), y.bindEvents("#w2ui-popup .w2ui-eaction", this), h("#w2ui-popup").find(".w2ui-popup-body").show(), this._promCreated();
        }, 1), clearTimeout(this._timer), this._timer = setTimeout(() => {
          this.status = "open", t.setFocus(e.focus), n.finish(), this._promOpened(), h("#w2ui-popup").removeClass("animating");
        }, 1e3 * e.speed);
      } else {
        if ((n = this.trigger("open", {
          target: "popup",
          present: true
        })).isCancelled === true) return;
        this.status = "opening", s != null && (s.maximized || s.width == e.width && s.height == e.height || this.resize(e.width, e.height), e.prevSize = e.width + "px:" + e.height + "px", e.maximized = s.maximized), a = h("#w2ui-popup .w2ui-box").get(0).cloneNode(true), h(a).removeClass("w2ui-box").addClass("w2ui-box-temp").find(".w2ui-popup-body").empty().append(e.body), h("#w2ui-popup .w2ui-box").after(a), e.buttons ? (h("#w2ui-popup .w2ui-popup-buttons").show().html("").append(e.buttons), h("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-buttons"), h("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "")) : (h("#w2ui-popup .w2ui-popup-buttons").hide().html(""), h("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-buttons"), h("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "0px")), e.title ? (h("#w2ui-popup .w2ui-popup-title").show().html((e.showClose ? `<div class="w2ui-popup-button w2ui-popup-close">
                                <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                            </div>` : "") + (e.showMax ? `<div class="w2ui-popup-button w2ui-popup-max">
                                <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                            </div>` : "")).append(e.title), h("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-title"), h("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "")) : (h("#w2ui-popup .w2ui-popup-title").hide().html(""), h("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-title"), h("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "0px"));
        let d = h("#w2ui-popup .w2ui-box")[0], p = h("#w2ui-popup .w2ui-box-temp")[0];
        h("#w2ui-popup").addClass("animating"), y.transition(d, p, e.transition, () => {
          h(d).remove(), h(p).removeClass("w2ui-box-temp").addClass("w2ui-box");
          var f = h(p).find(".w2ui-popup-body");
          f.length == 1 && (f[0].style.cssText = e.style, f.show()), t.setFocus(e.focus), h("#w2ui-popup").removeClass("animating");
        }), this.status = "open", n.finish(), y.bindEvents("#w2ui-popup .w2ui-eaction", this), h("#w2ui-popup").find(".w2ui-popup-body").show();
      }
      return e.openMaximized && this.max(), e._last_focus = document.activeElement, e.keyboard && h(document.body).on("keydown", (d) => {
        this.keydown(d);
      }), h(window).on("resize", this.handleResize), o = {
        resizing: false,
        mvMove: function(d) {
          o.resizing == 1 && (d = d || window.event, o.div_x = d.screenX - o.x, o.div_y = d.screenY - o.y, (d = t.trigger("move", {
            target: "popup",
            div_x: o.div_x,
            div_y: o.div_y,
            originalEvent: d
          })).isCancelled !== true) && (h("#w2ui-popup").css({
            transition: "none",
            transform: "translate3d(" + o.div_x + "px, " + o.div_y + "px, 0px)"
          }), t.options.moved = true, d.finish());
        },
        mvStop: function(d) {
          o.resizing != 1 || (d = d || window.event, t.status = "open", o.div_x = d.screenX - o.x, o.div_y = d.screenY - o.y, h("#w2ui-popup").css({
            left: o.pos_x + o.div_x + "px",
            top: o.pos_y + o.div_y + "px"
          }).css({
            transition: "none",
            transform: "translate3d(0px, 0px, 0px)"
          }), o.resizing = false, h(document.body).off(".w2ui-popup"), o.isLocked) || t.unlock();
        }
      }, h("#w2ui-popup .w2ui-popup-title").on("mousedown", function(d) {
        var p;
        t.options.maximized || (d = (d = d) || window.event, t.status = "moving", p = h("#w2ui-popup").get(0).getBoundingClientRect(), Object.assign(o, {
          resizing: true,
          isLocked: h("#w2ui-popup > .w2ui-lock").length == 1,
          x: d.screenX,
          y: d.screenY,
          pos_x: p.x,
          pos_y: p.y
        }), o.isLocked || t.lock({
          opacity: 0
        }), h(document.body).on("mousemove.w2ui-popup", o.mvMove).on("mouseup.w2ui-popup", o.mvStop), d.stopPropagation ? d.stopPropagation() : d.cancelBubble = true, d.preventDefault && d.preventDefault());
      }), c;
    }
    load(e) {
      return new Promise((t, s) => {
        if ((e = typeof e == "string" ? {
          url: e
        } : e).url == null) console.log("ERROR: The url is not defined."), s("The url is not defined");
        else {
          this.status = "loading";
          let [n, i] = String(e.url).split("#");
          n && fetch(n).then((o) => o.text()).then((o) => {
            t(this.template(o, i, e));
          });
        }
      });
    }
    template(e, t, s = {}) {
      let n;
      try {
        n = h(e);
      } catch {
        n = h.html(e);
      }
      return t && (n = n.filter("#" + t)), Object.assign(s, {
        width: parseInt(h(n).css("width")),
        height: parseInt(h(n).css("height")),
        title: h(n).find("[rel=title]").html(),
        body: h(n).find("[rel=body]").html(),
        buttons: h(n).find("[rel=buttons]").html(),
        style: h(n).find("[rel=body]").get(0).style.cssText
      }), this.open(s);
    }
    action(e, t) {
      let s = this.options.actions[e];
      s instanceof Object && s.onClick && (s = s.onClick), e = this.trigger("action", {
        action: e,
        target: "popup",
        self: this,
        originalEvent: t,
        value: this.input ? this.input.value : null
      }), e.isCancelled !== true && (typeof s == "function" && s.call(this, t), e.finish());
    }
    keydown(e) {
      var t;
      this.options && !this.options.keyboard || (t = this.trigger("keydown", {
        target: "popup",
        originalEvent: e
      })).isCancelled !== true && (e.keyCode === 27 && (e.preventDefault(), h("#w2ui-popup .w2ui-message").length == 0) && (this.options.cancelAction ? this.action(this.options.cancelAction) : this.close()), t.finish());
    }
    close(e) {
      let t = this.trigger("close", {
        target: "popup"
      });
      var s;
      t.isCancelled !== true && (s = () => {
        h("#w2ui-popup").remove(), this.options._last_focus && 0 < this.options._last_focus.length && this.options._last_focus.focus(), this.status = "closed", this.options = {}, t.finish(), this._promClosed();
      }, h("#w2ui-popup").length !== 0) && this.status != "closed" && (this.status == "opening" && (e = true), this.status == "closing" && e === true ? (s(), clearTimeout(this.tmp.closingTimer), y.unlock(document.body, 0)) : (this.status = "closing", h("#w2ui-popup").css("transition", this.options.speed + "s").addClass("w2ui-anim-close animating"), y.unlock(document.body, 300), this._promClosing(), e ? s() : this.tmp.closingTimer = setTimeout(s, 1e3 * this.options.speed), this.options.keyboard && h(document.body).off("keydown", this.keydown), h(window).off("resize", this.handleResize)));
    }
    toggle() {
      let e = this.trigger("toggle", {
        target: "popup"
      });
      e.isCancelled !== true && (this.options.maximized === true ? this.min() : this.max(), setTimeout(() => {
        e.finish();
      }, 1e3 * this.options.speed + 50));
    }
    max() {
      if (this.options.maximized !== true) {
        let t = this.trigger("max", {
          target: "popup"
        });
        var e;
        t.isCancelled !== true && (this.status = "resizing", e = h("#w2ui-popup").get(0).getBoundingClientRect(), this.options.prevSize = e.width + ":" + e.height, this.resize(1e4, 1e4, () => {
          this.status = "open", this.options.maximized = true, t.finish();
        }));
      }
    }
    min() {
      if (this.options.maximized === true) {
        var e = this.options.prevSize.split(":");
        let t = this.trigger("min", {
          target: "popup"
        });
        t.isCancelled !== true && (this.status = "resizing", this.options.maximized = false, this.resize(parseInt(e[0]), parseInt(e[1]), () => {
          this.status = "open", this.options.prevSize = null, t.finish();
        }));
      }
    }
    clear() {
      h("#w2ui-popup .w2ui-popup-title").html(""), h("#w2ui-popup .w2ui-popup-body").html(""), h("#w2ui-popup .w2ui-popup-buttons").html("");
    }
    reset() {
      this.open(this.defaults);
    }
    message(e) {
      return y.message({
        owner: this,
        box: h("#w2ui-popup").get(0),
        after: ".w2ui-popup-title"
      }, e);
    }
    confirm(e) {
      return y.confirm({
        owner: this,
        box: h("#w2ui-popup"),
        after: ".w2ui-popup-title"
      }, e);
    }
    setFocus(e) {
      var _a2;
      let t = h("#w2ui-popup"), s = "input, button, select, textarea, [contentEditable], .w2ui-input";
      e != null ? (_a2 = isNaN(e) ? t.find(s).filter(e).get(0) : t.find(s).get(e)) == null ? void 0 : _a2.focus() : (e = t.find("[name=hidden-first]").get(0)) && e.focus(), h(t).find(s + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus").on("blur.keep-focus", function(n) {
        setTimeout(() => {
          var _a3, _b, _c2;
          var i = document.activeElement, o = 0 < h(t).find(s).filter(i).length, a = h(i).attr("name");
          !o && i && i !== document.body && ((_a3 = h(t).find(s).get(0)) == null ? void 0 : _a3.focus()), a == "hidden-last" && ((_b = h(t).find(s).get(0)) == null ? void 0 : _b.focus()), a == "hidden-first" && ((_c2 = h(t).find(s).get(-1)) == null ? void 0 : _c2.focus());
        }, 1);
      });
    }
    lock(e, t) {
      var s = Array.from(arguments);
      s.unshift(h("#w2ui-popup")), y.lock(...s);
    }
    unlock(e) {
      y.unlock(h("#w2ui-popup"), e);
    }
    center(e, t, s) {
      let n, i;
      i = window.innerHeight == null ? (n = parseInt(document.documentElement.offsetWidth), parseInt(document.documentElement.offsetHeight)) : (n = parseInt(window.innerWidth), parseInt(window.innerHeight)), e = parseInt(e ?? this.options.width), t = parseInt(t ?? this.options.height), this.options.maximized === true && (e = n, t = i), n - 10 < e && (e = n - 10), i - 10 < t && (t = i - 10);
      var o = (i - t) / 2, a = (n - e) / 2;
      return s && (h("#w2ui-popup").css({
        transition: "none",
        top: o + "px",
        left: a + "px",
        width: e + "px",
        height: t + "px"
      }), this.resizeMessages()), {
        top: o,
        left: a,
        width: e,
        height: t
      };
    }
    resize(i, o, s) {
      let n = this;
      this.options.speed == null && (this.options.speed = 0);
      var { top: i, left: o, width: a, height: r } = this.center(i, o), c = this.options.speed;
      h("#w2ui-popup").css({
        transition: c + `s width, ${c}s height, ${c}s left, ${c}s top`,
        top: i + "px",
        left: o + "px",
        width: a + "px",
        height: r + "px"
      });
      let d = setInterval(() => {
        n.resizeMessages();
      }, 10);
      setTimeout(() => {
        clearInterval(d), n.resizeMessages(), typeof s == "function" && s();
      }, 1e3 * this.options.speed + 50);
    }
    resizeMessages() {
      h("#w2ui-popup .w2ui-message").each((e) => {
        var t = e._msg_options, s = h("#w2ui-popup"), i = (parseInt(t.width) < 10 && (t.width = 10), parseInt(t.height) < 10 && (t.height = 10), s[0].getBoundingClientRect()), s = parseInt(s.find(".w2ui-popup-title")[0].clientHeight), n = parseInt(i.width), i = parseInt(i.height);
        t.width = t.originalWidth, t.width > n - 10 && (t.width = n - 10), t.height = t.originalHeight, t.height > i - s - 5 && (t.height = i - s - 5), t.originalHeight < 0 && (t.height = i + t.originalHeight - s), t.originalWidth < 0 && (t.width = n + 2 * t.originalWidth), h(e).css({
          left: (n - t.width) / 2 + "px",
          width: t.width + "px",
          height: t.height + "px"
        });
      });
    }
  }
  new yc();
  const _ut = class _ut {
    constructor() {
      this.defaults = {
        name: null,
        html: "",
        style: "",
        class: "",
        position: "top|bottom",
        align: "",
        anchor: null,
        anchorClass: "",
        anchorStyle: "",
        autoShow: false,
        autoShowOn: null,
        autoHideOn: null,
        arrowSize: 8,
        margin: 0,
        margin: 1,
        screenMargin: 2,
        autoResize: true,
        offsetX: 0,
        offsetY: 0,
        maxWidth: null,
        maxHeight: null,
        watchScroll: null,
        watchResize: null,
        hideOn: null,
        onThen: null,
        onShow: null,
        onHide: null,
        onUpdate: null,
        onMove: null
      };
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
      let s, n, i = this;
      if (arguments.length != 0) {
        arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && typeof t == "string" ? t = (s = {
          anchor: e,
          html: t
        }).html : arguments.length === 2 && t != null && typeof t == "object" && (t = (s = t).html), s = y.extend({}, this.defaults, s || {}), !(t = !t && s.text ? s.text : t) && s.html && (t = s.html), delete s.anchor;
        let o = s.name || e.id;
        e != document && e != document.body || (e = document.body, o = "context-menu"), o || (o = "noname-" + Object.keys(_ut.active).length, console.log("NOTICE: name property is not defined for tooltip, could lead to too many instances")), o = o.replace(/[\s\.#]/g, "_"), _ut.active[o] ? ((n = _ut.active[o]).prevOptions = n.options, n.options = s, n.anchor = e, n.prevOptions.html == n.options.html && n.prevOptions.class == n.options.class && n.prevOptions.style == n.options.style || (n.needsUpdate = true), s = n.options) : (n = new cn(), Object.assign(n, {
          id: "w2overlay-" + o,
          name: o,
          options: s,
          anchor: e,
          displayed: false,
          tmp: {
            observeResize: new ResizeObserver(() => {
              this.resize(n.name);
            })
          },
          hide() {
            i.hide(o);
          }
        }), _ut.active[o] = n), Object.keys(n.options).forEach((r) => {
          var c = n.options[r];
          r.startsWith("on") && typeof c == "function" && (n[r] = c, delete n.options[r]);
        }), s.autoShow === true && (s.autoShowOn = s.autoShowOn ?? "mouseenter", s.autoHideOn = s.autoHideOn ?? "mouseleave", s.autoShow = false), s.autoShowOn && (t = "autoShow-" + n.name, h(e).off("." + t).on(s.autoShowOn + "." + t, (r) => {
          i.show(n.name), r.stopPropagation();
        }), delete s.autoShowOn), s.autoHideOn && (t = "autoHide-" + n.name, h(e).off("." + t).on(s.autoHideOn + "." + t, (r) => {
          i.hide(n.name), r.stopPropagation();
        }), delete s.autoHideOn), n.off(".attach");
        let a = {
          overlay: n,
          then: (r) => (n.on("show:after.attach", (c) => {
            r(c);
          }), a),
          show: (r) => (n.on("show.attach", (c) => {
            r(c);
          }), a),
          hide: (r) => (n.on("hide.attach", (c) => {
            r(c);
          }), a),
          update: (r) => (n.on("update.attach", (c) => {
            r(c);
          }), a),
          move: (r) => (n.on("move.attach", (c) => {
            r(c);
          }), a)
        };
        return a;
      }
    }
    update(e, t) {
      var s = _ut.active[e];
      s ? (s.needsUpdate = true, s.options.html = t, this.show(e)) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
    }
    show(e) {
      if (e instanceof HTMLElement || e instanceof Object) {
        let a = e, r = (e instanceof HTMLElement && ((a = arguments[1] || {}).anchor = e), this.attach(a));
        return h(r.overlay.anchor).off(".autoShow-" + r.overlay.name).off(".autoHide-" + r.overlay.name), setTimeout(() => {
          this.show(r.overlay.name), this.initControls && this.initControls(r.overlay);
        }, 1), r;
      }
      let t, s = this, n = _ut.active[e.replace(/[\s\.#]/g, "_")];
      if (n) {
        let a = n.options;
        if (!n || n.displayed && !n.needsUpdate) this.resize(n == null ? void 0 : n.name);
        else {
          var i = a.position.split("|"), i = [
            "top",
            "bottom"
          ].includes(i[0]);
          let r = a.align == "both" && i ? "" : "white-space: nowrap;";
          if (a.maxWidth && y.getStrWidth(a.html, "") > a.maxWidth && (r = "width: " + a.maxWidth + "px; white-space: inherit; overflow: auto;"), r += " max-height: " + (a.maxHeight || window.innerHeight - 40) + "px;", a.html !== "" && a.html != null) {
            if (n.box) {
              if ((t = this.trigger("update", {
                target: e,
                overlay: n
              })).isCancelled === true) return void (n.prevOptions && (n.options = n.prevOptions, delete n.prevOptions));
              h(n.box).find(".w2ui-overlay-body").attr("style", (a.style || "") + "; " + r).removeClass().addClass("w2ui-overlay-body " + a.class).html(a.html);
            } else {
              if ((t = this.trigger("show", {
                target: e,
                overlay: n
              })).isCancelled === true) return;
              h("body").append(`<div id="${n.id}" name="${e}" style="display: none; pointer-events: none" class="w2ui-overlay"
                        data-click="stop" data-focusin="stop">
                    <style></style>
                    <div class="w2ui-overlay-body ${a.class}" style="${a.style || ""}; ${r}">
                        ${a.html}
                    </div>
                </div>`), n.box = h("#" + y.escapeId(n.id))[0], n.displayed = true, i = h(n.anchor).data("tooltipName") ?? [], i.push(e), h(n.anchor).data("tooltipName", i), y.bindEvents(n.box, {}), n.tmp.originalCSS = "", 0 < h(n.anchor).length && (n.tmp.originalCSS = h(n.anchor)[0].style.cssText);
            }
            this.resize(n.name), a.anchorStyle && (n.anchor.style.cssText += ";" + a.anchorStyle), !a.anchorClass || a.anchorClass == "w2ui-focus" && n.anchor == document.body || h(n.anchor).addClass(a.anchorClass), typeof a.hideOn == "string" && (a.hideOn = [
              a.hideOn
            ]), Array.isArray(a.hideOn) || (a.hideOn = []), Object.assign(n.tmp, {
              scrollLeft: document.body.scrollLeft,
              scrollTop: document.body.scrollTop
            });
            {
              let c = (f) => {
                s.hide(n.name);
              }, d = h(n.anchor), p = "tooltip-" + n.name;
              h("body").off("." + p), a.hideOn.includes("doc-click") && ([
                "INPUT",
                "TEXTAREA"
              ].includes(n.anchor.tagName) && d.off(`.${p}-doc`).on(`click.${p}-doc`, (f) => {
                f.stopPropagation();
              }), h("body").on("click." + p, c)), a.hideOn.includes("focus-change") && h("body").on("focusin." + p, (f) => {
                document.activeElement != n.anchor && s.hide(n.name);
              }), [
                "INPUT",
                "TEXTAREA"
              ].includes(n.anchor.tagName) && (d.off("." + p), a.hideOn.forEach((f) => {
                [
                  "doc-click",
                  "focus-change"
                ].indexOf(f) == -1 && d.on(f + "." + p, {
                  once: true
                }, c);
              }));
            }
            {
              var o = document.body;
              let c = "tooltip-" + n.name, d = o;
              o.tagName == "BODY" && (d = o.ownerDocument), h(d).off("." + c).on("scroll." + c, (p) => {
                Object.assign(n.tmp, {
                  scrollLeft: o.scrollLeft,
                  scrollTop: o.scrollTop
                }), s.resize(n.name);
              });
            }
            return h(n.box).show(), n.tmp.observeResize.observe(n.box), _ut.observeRemove.observe(document.body, {
              subtree: true,
              childList: true
            }), h(n.box).css("opacity", 1).find(".w2ui-overlay-body").html(a.html), setTimeout(() => {
              h(n.box).css({
                "pointer-events": "auto"
              }).data("ready", "yes");
            }, 100), delete n.needsUpdate, n.box.overlay = n, t && t.finish(), {
              overlay: n
            };
          }
          s.hide(e);
        }
      }
    }
    hide(e) {
      var _a2;
      let t;
      if (arguments.length == 0) Object.keys(_ut.active).forEach((i) => {
        this.hide(i);
      });
      else if (e instanceof HTMLElement) (h(e).data("tooltipName") ?? []).forEach((i) => {
        this.hide(i);
      });
      else if (typeof e == "string" && (e = e.replace(/[\s\.#]/g, "_"), t = _ut.active[e]), t && t.box && (delete _ut.active[e], e = this.trigger("hide", {
        target: e,
        overlay: t
      }), e.isCancelled !== true)) {
        var s = "tooltip-" + t.name;
        (_a2 = t.tmp.observeResize) == null ? void 0 : _a2.disconnect(), t.options.watchScroll && h(t.options.watchScroll).off(".w2scroll-" + t.name);
        let i = 0;
        Object.keys(_ut.active).forEach((o) => {
          _ut.active[o].displayed && i++;
        }), i == 0 && _ut.observeRemove.disconnect(), h("body").off("." + s), h(document).off("." + s), t.box.remove(), t.box = null, t.displayed = false;
        var n = h(t.anchor).data("tooltipName") ?? [];
        n.indexOf(t.name) != -1 && n.splice(n.indexOf(t.name), 1), n.length == 0 ? h(t.anchor).removeData("tooltipName") : h(t.anchor).data("tooltipName", n), t.anchor.style.cssText = t.tmp.originalCSS, h(t.anchor).off("." + s).removeClass(t.options.anchorClass), e.finish();
      }
    }
    resize(e) {
      if (arguments.length == 0) Object.keys(_ut.active).forEach((n) => {
        n = _ut.active[n], n.displayed && this.resize(n.name);
      });
      else {
        var t = _ut.active[e.replace(/[\s\.#]/g, "_")];
        let n = this.getPosition(t.name);
        var s = n.left + "x" + n.top;
        let i;
        t.tmp.lastPos != s && (i = this.trigger("move", {
          target: e,
          overlay: t,
          pos: n
        })), h(t.box).css({
          left: n.left + "px",
          top: n.top + "px"
        }).then((o) => {
          n.width != null && o.css("width", n.width + "px").find(".w2ui-overlay-body").css("width", "100%"), n.height != null && o.css("height", n.height + "px").find(".w2ui-overlay-body").css("height", "100%");
        }).find(".w2ui-overlay-body").removeClass("w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom").addClass(n.arrow.class).closest(".w2ui-overlay").find("style").text(n.arrow.style), t.tmp.lastPos != s && i && (t.tmp.lastPos = s, i.finish());
      }
    }
    getPosition(e) {
      let t = _ut.active[e.replace(/[\s\.#]/g, "_")];
      if (t && t.box) {
        let p = t.options;
        (t.tmp.resizedY || t.tmp.resizedX) && h(t.box).css({
          width: "",
          height: "",
          scroll: "auto"
        });
        var e = y.scrollBarSize(), s = document.body.scrollWidth != document.body.clientWidth, n = document.body.scrollHeight != document.body.clientHeight;
        let x = {
          width: window.innerWidth - (n ? e : 0),
          height: window.innerHeight - (s ? e : 0)
        };
        var i, o = (p.position == "auto" ? "top|bottom|right|left" : p.position).split("|");
        let b = [
          "top",
          "bottom"
        ].includes(o[0]), C = t.box.getBoundingClientRect(), _ = t.anchor.getBoundingClientRect(), S = (t.anchor == document.body && ({ x: a, y: r, width: c, height: d } = p.originalEvent, _ = {
          left: a - 2,
          top: r - 4,
          width: c,
          height: d,
          arrow: "none"
        }), p.arrowSize), A = (_.arrow == "none" && (S = 0), {
          top: _.top,
          bottom: x.height - (_.top + _.height) - +(s ? e : 0),
          left: _.left,
          right: x.width - (_.left + _.width) + (n ? e : 0)
        });
        C.width < 22 && (C.width = 22), C.height < 14 && (C.height = 14);
        let P, H, U, G, W = "", V = {
          offset: 0,
          class: "",
          style: `#${t.id} { --tip-size: ${S}px; }`
        }, q = {
          left: 0,
          top: 0
        }, D = {
          posX: "",
          x: 0,
          posY: "",
          y: 0
        };
        o.forEach((R) => {
          [
            "top",
            "bottom"
          ].includes(R) && (!W && C.height + S / 1.893 < A[R] && (W = R), A[R] > D.y) && Object.assign(D, {
            posY: R,
            y: A[R]
          }), [
            "left",
            "right"
          ].includes(R) && (!W && C.width + S / 1.893 < A[R] && (W = R), A[R] > D.x) && Object.assign(D, {
            posX: R,
            x: A[R]
          });
        }), W = W || (b ? D.posY : D.posX), p.autoResize && ([
          "top",
          "bottom"
        ].includes(W) && (C.height > A[W] ? (G = A[W], t.tmp.resizedY = true) : t.tmp.resizedY = false), [
          "left",
          "right"
        ].includes(W)) && (C.width > A[W] ? (U = A[W], t.tmp.resizedX = true) : t.tmp.resizedX = false);
        var a = W;
        switch (V.class = _.arrow || "w2ui-arrow-" + a, a) {
          case "top":
            P = _.left + (_.width - (U ?? C.width)) / 2, H = _.top - (G ?? C.height) - S / 1.5 + 1;
            break;
          case "bottom":
            P = _.left + (_.width - (U ?? C.width)) / 2, H = _.top + _.height + S / 1.25 + 1;
            break;
          case "left":
            P = _.left - (U ?? C.width) - S / 1.2 - 1, H = _.top + (_.height - (G ?? C.height)) / 2;
            break;
          case "right":
            P = _.left + _.width + S / 1.2 + 1, H = _.top + (_.height - (G ?? C.height)) / 2;
        }
        b && (p.align == "left" && (q.left = _.left - P, P = _.left), p.align == "right" && (q.left = _.left + _.width - (U ?? C.width) - P, P = _.left + _.width - (U ?? C.width)), [
          "top",
          "bottom"
        ].includes(W) && p.align.startsWith("both") && (i = p.align.split(":")[1] ?? 50, _.width >= i) && (P = _.left, U = _.width), p.align == "top" && (q.top = _.top - H, H = _.top), p.align == "bottom" && (q.top = _.top + _.height - (G ?? C.height) - H, H = _.top + _.height - (G ?? C.height)), [
          "left",
          "right"
        ].includes(W) && p.align.startsWith("both") && (i = p.align.split(":")[1] ?? 50, _.height >= i) && (H = _.top, G = _.height));
        {
          let R;
          ([
            "left",
            "right"
          ].includes(p.align) && _.width < (U ?? C.width) || [
            "top",
            "bottom"
          ].includes(p.align) && _.height < (G ?? C.height)) && (R = true);
          var r = W == "right" ? S : p.screenMargin, c = W == "bottom" ? S : p.screenMargin, d = x.width - (U ?? C.width) - (W == "left" ? S : p.screenMargin), s = x.height - (G ?? C.height) - (W == "top" ? S : p.screenMargin) + 3;
          ([
            "top",
            "bottom"
          ].includes(W) || p.autoResize) && (P < r && (R = true, q.left -= P, P = r), P > d) && (R = true, q.left -= P - d, P += d - P), ([
            "left",
            "right"
          ].includes(W) || p.autoResize) && (H < c && (R = true, q.top -= H, H = c), H > s) && (R = true, q.top -= H - s, H += s - H), R && (r = b ? "left" : "top", d = b ? "width" : "height", V.offset = -q[r], c = C[d] / 2 - S, Math.abs(V.offset) > c + S && (V.class = ""), Math.abs(V.offset) > c && (V.offset = V.offset < 0 ? -c : c), V.style = y.stripSpaces(`#${t.id} .w2ui-overlay-body:after,
                            #${t.id} .w2ui-overlay-body:before {
                                --tip-size: ${S}px;
                                margin-${r}: ${V.offset}px;
                            }`));
        }
        return n = W == "top" ? -p.margin : W == "bottom" ? p.margin : 0, e = W == "left" ? -p.margin : W == "right" ? p.margin : 0, H = Math.floor(100 * (H + parseFloat(p.offsetY) + parseFloat(n))) / 100, {
          left: P = Math.floor(100 * (P + parseFloat(p.offsetX) + parseFloat(e))) / 100,
          top: H,
          arrow: V,
          adjust: q,
          width: U,
          height: G,
          pos: W
        };
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
  class wc extends ut {
    constructor() {
      super(), this.palette = [
        [
          "000000",
          "333333",
          "555555",
          "777777",
          "888888",
          "999999",
          "AAAAAA",
          "CCCCCC",
          "DDDDDD",
          "EEEEEE",
          "F7F7F7",
          "FFFFFF"
        ],
        [
          "FF011B",
          "FF9838",
          "FFC300",
          "FFFD59",
          "86FF14",
          "14FF7A",
          "2EFFFC",
          "2693FF",
          "006CE7",
          "9B24F4",
          "FF21F5",
          "FF0099"
        ],
        [
          "FFEAEA",
          "FCEFE1",
          "FCF4DC",
          "FFFECF",
          "EBFFD9",
          "D9FFE9",
          "E0FFFF",
          "E8F4FF",
          "ECF4FC",
          "EAE6F4",
          "FFF5FE",
          "FCF0F7"
        ],
        [
          "F4CCCC",
          "FCE5CD",
          "FFF1C2",
          "FFFDA1",
          "D5FCB1",
          "B5F7D0",
          "BFFFFF",
          "D6ECFF",
          "CFE2F3",
          "D9D1E9",
          "FFE3FD",
          "FFD9F0"
        ],
        [
          "EA9899",
          "F9CB9C",
          "FFE48C",
          "F7F56F",
          "B9F77E",
          "84F0B1",
          "83F7F7",
          "B5DAFF",
          "9FC5E8",
          "B4A7D6",
          "FAB9F6",
          "FFADDE"
        ],
        [
          "E06666",
          "F6B26B",
          "DEB737",
          "E0DE51",
          "8FDB48",
          "52D189",
          "4EDEDB",
          "76ACE3",
          "6FA8DC",
          "8E7CC3",
          "E07EDA",
          "F26DBD"
        ],
        [
          "CC0814",
          "E69138",
          "AB8816",
          "B5B20E",
          "6BAB30",
          "27A85F",
          "1BA8A6",
          "3C81C7",
          "3D85C6",
          "674EA7",
          "A14F9D",
          "BF4990"
        ],
        [
          "99050C",
          "B45F17",
          "80650E",
          "737103",
          "395E14",
          "10783D",
          "13615E",
          "094785",
          "0A5394",
          "351C75",
          "780172",
          "782C5A"
        ]
      ], this.defaults = y.extend({}, this.defaults, {
        advanced: false,
        transparent: true,
        position: "top|bottom",
        class: "w2ui-white",
        color: "",
        liveUpdate: true,
        arrowSize: 12,
        autoResize: false,
        anchorClass: "w2ui-focus",
        autoShowOn: "focus",
        hideOn: [
          "doc-click",
          "focus-change"
        ],
        onSelect: null,
        onLiveUpdate: null
      });
    }
    attach(e, t) {
      let s;
      arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((s = t).anchor = e), t = s.hideOn, s = y.extend({}, this.defaults, s || {}), t && (s.hideOn = t), s.style += "; padding: 0;", s.transparent && this.palette[0][1] == "333333" && (this.palette[0].splice(1, 1), this.palette[0].push("")), s.transparent || this.palette[0][1] == "333333" || (this.palette[0].splice(1, 0, "333333"), this.palette[0].pop()), s.color && (s.color = String(s.color).toUpperCase()), typeof s.color == "string" && s.color.substr(0, 1) === "#" && (s.color = s.color.substr(1)), this.index = [
        -1,
        -1
      ];
      let n = super.attach(s), i = n.overlay;
      return i.options.html = this.getColorHTML(i.name, s), i.on("show.attach", (a) => {
        var a = a.detail.overlay, r = a.anchor, c = a.options;
        [
          "INPUT",
          "TEXTAREA"
        ].includes(r.tagName) && !c.color && r.value && (a.tmp.initColor = r.value), delete a.newColor;
      }), i.on("show:after.attach", (o) => {
        var _a2;
        var a;
        ((_a2 = n.overlay) == null ? void 0 : _a2.box) && (a = h(n.overlay.box).find(".w2ui-eaction"), y.bindEvents(a, this), this.initControls(n.overlay));
      }), i.on("update:after.attach", (o) => {
        var _a2;
        var a;
        ((_a2 = n.overlay) == null ? void 0 : _a2.box) && (a = h(n.overlay.box).find(".w2ui-eaction"), y.bindEvents(a, this), this.initControls(n.overlay));
      }), i.on("hide.attach", (a) => {
        var a = a.detail.overlay, c = a.anchor, r = a.newColor ?? a.options.color ?? "", c = ([
          "INPUT",
          "TEXTAREA"
        ].includes(c.tagName) && c.value != r && (c.value = r), this.trigger("select", {
          color: r,
          target: a.name,
          overlay: a
        }));
        c.isCancelled !== true && c.finish();
      }), n.liveUpdate = (o) => (i.on("liveUpdate.attach", (a) => {
        o(a);
      }), n), n.select = (o) => (i.on("select.attach", (a) => {
        o(a);
      }), n), n;
    }
    select(e, i) {
      let s;
      this.index = [
        -1,
        -1
      ], typeof i != "string" && (s = i.target, this.index = h(s).attr("index").split(":"), i = h(s).closest(".w2ui-overlay").attr("name"));
      var n = this.get(i), i = this.trigger("liveUpdate", {
        color: e,
        target: i,
        overlay: n,
        param: arguments[1]
      });
      i.isCancelled !== true && ([
        "INPUT",
        "TEXTAREA"
      ].includes(n.anchor.tagName) && n.options.liveUpdate && h(n.anchor).val(e), n.newColor = e, h(n.box).find(".w2ui-selected").removeClass("w2ui-selected"), s && h(s).addClass("w2ui-selected"), i.finish());
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
      typeof s != "string" && (s = h(s.target).closest(".w2ui-overlay").attr("name"));
      var s = this.get(s), n = h(s.box).find(`.w2ui-color-tab:nth-child(${e})`);
      h(s.box).find(".w2ui-color-tab").removeClass("w2ui-selected"), h(n).addClass("w2ui-selected"), h(s.box).find(".w2ui-tab-content").hide().closest(".w2ui-colors").find(".tab-" + e).show();
    }
    getColorHTML(e, t) {
      let s = `
            <div class="w2ui-colors">
                <div class="w2ui-tab-content tab-1">`;
      for (let i = 0; i < this.palette.length; i++) {
        s += '<div class="w2ui-color-row">';
        for (let o = 0; o < this.palette[i].length; o++) {
          var n = this.palette[i][o];
          let a = n === "FFFFFF" ? "; border: 1px solid #efefef" : "";
          s += `
                    <div class="w2ui-color w2ui-eaction ${n === "" ? "w2ui-no-color" : ""} ${t.color == n ? "w2ui-selected" : ""}"
                        style="background-color: #${n + a};" name="${n}" index="${i}:${o}"
                        data-mousedown="select|'${n}'|event" data-mouseup="hide|${e}">&nbsp;
                    </div>`;
        }
        s += "</div>", i < 2 && (s += '<div style="height: 8px"></div>');
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
                        <span>${y.lang("Opacity")}</span>
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
      var n = e.options;
      let i = y.parseColor(n.color || e.tmp.initColor), o = (i == null && (i = {
        r: 140,
        g: 150,
        b: 160,
        a: 1
      }), y.rgb2hsv(i));
      n.advanced === true && this.tabClick(2, e.name), c(o, true, true), h(e.box).find("input").off(".w2color").on("change.w2color", (_) => {
        _ = h(_.target);
        let b = parseFloat(_.val());
        var C = parseFloat(_.attr("max")), C = (isNaN(b) && (b = 0, _.val(0)), 1 < C && (b = parseInt(b)), 0 < C && b > C && (_.val(C), b = C), b < 0 && (_.val(0), b = 0), _.attr("name")), _ = {};
        [
          "r",
          "g",
          "b",
          "a"
        ].indexOf(C) !== -1 ? (i[C] = b, o = y.rgb2hsv(i)) : [
          "h",
          "s",
          "v"
        ].indexOf(C) !== -1 && (_[C] = b), c(_, true);
      }), h(e.box).find(".color-original").off(".w2color").on("click.w2color", (x) => {
        x = y.parseColor(h(x.target).css("background-color")), x != null && (i = x, c(o = y.rgb2hsv(i), true));
      }), n = `${y.isIOS ? "touchstart" : "mousedown"}.w2color`;
      let a = `${y.isIOS ? "touchend" : "mouseup"}.w2color`, r = `${y.isIOS ? "touchmove" : "mousemove"}.w2color`;
      function c(x, b, C) {
        var _a2;
        x.h != null && (o.h = x.h), x.s != null && (o.s = x.s), x.v != null && (o.v = x.v), x.a != null && (i.a = x.a, o.a = x.a);
        let _ = "rgba(" + (i = y.hsv2rgb(o)).r + "," + i.g + "," + i.b + "," + i.a + ")", S = [
          Number(i.r).toString(16).toUpperCase(),
          Number(i.g).toString(16).toUpperCase(),
          Number(i.b).toString(16).toUpperCase(),
          Math.round(255 * Number(i.a)).toString(16).toUpperCase()
        ];
        var A, P;
        S.forEach((H, U) => {
          H.length === 1 && (S[U] = "0" + H);
        }), _ = S[0] + S[1] + S[2] + S[3], i.a === 1 && (_ = S[0] + S[1] + S[2]), h(e.box).find(".color-preview").css("background-color", "#" + _), h(e.box).find("input").each((H) => {
          H.name && (i[H.name] != null && (H.value = i[H.name]), o[H.name] != null && (H.value = o[H.name]), H.name === "a") && (H.value = i.a);
        }), C ? (x = ((_a2 = e.tmp) == null ? void 0 : _a2.initColor) || _, h(e.box).find(".color-original").css("background-color", "#" + x), h(e.box).find(".w2ui-colors .w2ui-selected").removeClass("w2ui-selected"), h(e.box).find(`.w2ui-colors [name="${x}"]`).addClass("w2ui-selected"), _.length == 8 && s.tabClick(2, e.name)) : s.select(_, e.name), b && (C = h(e.box).find(".palette .value1"), x = h(e.box).find(".rainbow .value2"), b = h(e.box).find(".alpha .value2"), A = parseInt(C[0].clientWidth) / 2, P = parseInt(x[0].clientWidth) / 2, C.css({
          left: 150 * o.s / 100 - A + "px",
          top: 125 * (100 - o.v) / 100 - A + "px"
        }), x.css("left", o.h / 2.4 - P + "px"), b.css("left", 150 * i.a - P + "px"), d());
      }
      function d() {
        var x = y.hsv2rgb(o.h, 100, 100), x = `${x.r},${x.g},` + x.b;
        h(e.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${x},0) 0%, rgba(${x},1) 100%)`);
      }
      function p(x) {
        h("body").off(".w2color");
      }
      function f(S) {
        var P = t.el, _ = S.pageX - t.x, S = S.pageY - t.y;
        let b = t.left + _, C = t.top + S;
        var _ = parseInt(P.prop("clientWidth")) / 2, S = (b < -_ && (b = -_), C < -_ && (C = -_), b > t.width - _ && (b = t.width - _), C > t.height - _ && (C = t.height - _), P.hasClass("move-x") && P.css({
          left: b + "px"
        }), P.hasClass("move-y") && P.css({
          top: C + "px"
        }), h(P.get(0).parentNode).attr("name")), A = parseInt(P.css("left")) + _, P = parseInt(P.css("top")) + _;
        S === "palette" && c({
          s: Math.round(A / t.width * 100),
          v: Math.round(100 - P / t.height * 100)
        }), S === "rainbow" && (c({
          h: Math.round(2.4 * A)
        }), d()), S === "alpha" && c({
          a: parseFloat(Number(A / 150).toFixed(2))
        });
      }
      h(e.box).find(".palette, .rainbow, .alpha").off(".w2color").on(n + ".w2color", function(x) {
        var b = h(this).find(".value1, .value2"), C = parseInt(b.prop("clientWidth")) / 2;
        b.hasClass("move-x") && b.css({
          left: x.offsetX - C + "px"
        }), b.hasClass("move-y") && b.css({
          top: x.offsetY - C + "px"
        }), t = {
          el: b,
          x: x.pageX,
          y: x.pageY,
          width: b.prop("parentNode").clientWidth,
          height: b.prop("parentNode").clientHeight,
          left: parseInt(b.css("left")),
          top: parseInt(b.css("top"))
        }, f(x), h("body").off(".w2color").on(r, f).on(a, p);
      });
    }
  }
  class xc extends ut {
    constructor() {
      super(), this.defaults = y.extend({}, this.defaults, {
        type: "normal",
        items: [],
        index: null,
        render: null,
        spinner: false,
        msgNoItems: y.lang("No items found"),
        topHTML: "",
        menuStyle: "",
        filter: false,
        markSearch: false,
        match: "contains",
        search: false,
        altRows: false,
        arrowSize: 10,
        align: "left",
        position: "bottom|top",
        class: "w2ui-white",
        anchorClass: "w2ui-focus",
        autoShowOn: "focus",
        hideOn: [
          "doc-click",
          "focus-change",
          "select"
        ],
        onSelect: null,
        onSubMenu: null,
        onRemove: null
      });
    }
    attach(e, t) {
      let s;
      arguments.length == 1 && e.anchor ? e = (s = e).anchor : arguments.length === 2 && t != null && typeof t == "object" && ((s = t).anchor = e), t = s.hideOn, s = y.extend({}, this.defaults, s || {}), t && (s.hideOn = t), s.style += "; padding: 0;", s.items == null && (s.items = []), s.html = this.getMenuHTML(s);
      let n = super.attach(s), i = n.overlay;
      return i.on("show:after.attach, update:after.attach", (o) => {
        var _a2;
        if ((_a2 = n.overlay) == null ? void 0 : _a2.box) {
          let r = "";
          i.selected = null, i.options.items = y.normMenu(i.options.items), [
            "INPUT",
            "TEXTAREA"
          ].includes(i.anchor.tagName) && (r = i.anchor.value, i.selected = i.anchor.dataset.selectedIndex);
          var a = h(n.overlay.box).find(".w2ui-eaction");
          y.bindEvents(a, this), this.applyFilter(i.name, null, r).then((c) => {
            i.tmp.searchCount = c.count, i.tmp.search = c.search, this.refreshSearch(i.name), this.initControls(n.overlay), this.refreshIndex(i.name);
          });
        }
      }), i.on("hide:after.attach", (o) => {
        ct.hide(i.name + "-tooltip");
      }), n.select = (o) => (i.on("select.attach", (a) => {
        o(a);
      }), n), n.remove = (o) => (i.on("remove.attach", (a) => {
        o(a);
      }), n), n.subMenu = (o) => (i.on("subMenu.attach", (a) => {
        o(a);
      }), n), n;
    }
    update(e, t) {
      var s, n = ut.active[e];
      n ? ((s = n.options).items != t && (s.items = t), t = this.getMenuHTML(s), s.html != t && (s.html = t, n.needsUpdate = true, this.show(e))) : console.log(`Tooltip "${e}" is not displayed. Cannot update it.`);
    }
    initControls(e) {
      h(e.box).find(".w2ui-menu:not(.w2ui-sub-menu)").off(".w2menu").on("mouseDown.w2menu", {
        delegate: ".w2ui-menu-item"
      }, (t) => {
        var s = t.delegate.dataset;
        this.menuDown(e, t, s.index, s.parents);
      }).on((y.isIOS ? "touchStart" : "click") + ".w2menu", {
        delegate: ".w2ui-menu-item"
      }, (t) => {
        var s = t.delegate.dataset;
        this.menuClick(e, t, parseInt(s.index), s.parents);
      }).find(".w2ui-menu-item").off(".w2menu").on("mouseEnter.w2menu", (t) => {
        var _a2;
        var s = t.target.dataset, s = (_a2 = e.options.items[s.index]) == null ? void 0 : _a2.tooltip;
        s && ct.show({
          name: e.name + "-tooltip",
          anchor: t.target,
          html: s,
          position: "right|left",
          hideOn: [
            "doc-click"
          ]
        });
      }).on("mouseLeave.w2menu", (t) => {
        ct.hide(e.name + "-tooltip");
      }), [
        "INPUT",
        "TEXTAREA"
      ].includes(e.anchor.tagName) && h(e.anchor).off(".w2menu").on("input.w2menu", (t) => {
      }).on("keyup.w2menu", (t) => {
        t._searchType = "filter", this.keyUp(e, t);
      }), e.options.search && h(e.box).find("#menu-search").off(".w2menu").on("keyup.w2menu", (t) => {
        t._searchType = "search", this.keyUp(e, t);
      });
    }
    getCurrent(a, i) {
      var a = ut.active[a.replace(/[\s\.#]/g, "_")], s = a.options;
      let n = (i || (a.selected ?? "")).split("-");
      var i = n.length - 1, a = n[i], o = n.slice(0, n.length - 1).join("-"), a = y.isInt(a) ? parseInt(a) : 0;
      let r = s.items;
      return n.forEach((c, d) => {
        d < n.length - 1 && (r = r[c].items);
      }), {
        last: i,
        index: a,
        items: r,
        item: r[a],
        parents: o
      };
    }
    getMenuHTML(e, t, s, n) {
      if (e.spinner) return `
            <div class="w2ui-menu">
                <div class="w2ui-no-items">
                    <div class="w2ui-spinner"></div>
                    ${y.lang("Loading...")}
                </div>
            </div>`;
      n = n || [], t == null && (t = e.items), Array.isArray(t) || (t = []);
      let i = 0, o = null, a = "", r = (!s && e.search && (a += `
                <div class="w2ui-menu-search">
                    <span class="w2ui-icon w2ui-icon-search"></span>
                    <input id="menu-search" class="w2ui-input" type="text"/>
                </div>`, t.forEach((c) => c.hidden = false)), !s && e.topHTML && (a += `<div class="w2ui-menu-top">${e.topHTML}</div>`), `
            ${a}
            <div class="w2ui-menu ${s ? "w2ui-sub-menu" : ""}" ${s ? "" : `style="${e.menuStyle}"`}
                data-parent="${n}">
        `);
      return t.forEach((c, d) => {
        o = c.icon;
        var p = (0 < n.length ? n.join("-") + "-" : "") + d;
        if (o == null && (o = null), [
          "radio",
          "check"
        ].indexOf(e.type) == -1 || Array.isArray(c.items) || c.group === false || (o = c.checked === true ? "w2ui-icon-check" : "w2ui-icon-empty"), c.hidden !== true) {
          let x = c.text, b = "", C = "";
          if (typeof (x = typeof e.render == "function" ? e.render(c, e) : x) == "function" && (x = x(c, e)), o && (String(o).slice(0, 1) !== "<" && (o = `<span class="w2ui-icon ${o}"></span>`), b = `<div class="menu-icon">${o}</span></div>`), c.type !== "break" && x != null && x !== "" && String(x).substr(0, 2) != "--") {
            var f = [
              "w2ui-menu-item"
            ];
            e.altRows == 1 && f.push(i % 2 == 0 ? "w2ui-even" : "w2ui-odd");
            let _ = 1, S = (b === "" && _++, c.count == null && c.hotkey == null && c.remove !== true && c.items == null && _++, c.tooltip == null && c.hint != null && (c.tooltip = c.hint), "");
            if (c.remove === true) S = '<span class="remove">x</span>';
            else if (c.items != null) {
              let A = [];
              typeof c.items == "function" ? A = c.items(c) : Array.isArray(c.items) && (A = c.items), S = "<span></span>", C = `
                            <div class="w2ui-sub-menu-box" style="${c.expanded ? "" : "display: none"}">
                                ${this.getMenuHTML(e, A, true, n.concat(d))}
                            </div>`;
            } else c.count != null && (S += "<span>" + c.count + "</span>"), c.hotkey != null && (S += '<span class="hotkey">' + c.hotkey + "</span>");
            c.disabled === true && f.push("w2ui-disabled"), c._noSearchInside === true && f.push("w2ui-no-search-inside"), C !== "" && (f.push("has-sub-menu"), c.expanded ? f.push("expanded") : f.push("collapsed")), r += `
                        <div index="${p}" class="${f.join(" ")}" style="${c.style || ""}"
                            data-index="${d}" data-parents="${n.join("-")}">
                                <div style="width: ${(s ? 20 : 0) + parseInt(c.indent ?? 0)}px"></div>
                                ${b}
                                <div class="menu-text" colspan="${_}">${y.lang(x)}</div>
                                <div class="menu-extra">${S}</div>
                        </div>
                        ` + C, i++;
          } else f = (x ?? "").replace(/^-+/g, ""), r += `
                        <div index="${p}" class="w2ui-menu-divider ${f != "" ? "has-text" : ""}">
                            <div class="line"></div>
                            ${f ? `<div class="text">${f}</div>` : ""}
                        </div>`;
        }
        t[d] = c;
      }), i === 0 && e.msgNoItems && (r += `
                <div class="w2ui-no-items">
                    ${y.lang(e.msgNoItems)}
                </div>`), r += "</div>";
    }
    refreshIndex(n) {
      var t, s, n = ut.active[n.replace(/[\s\.#]/g, "_")];
      n && (n.displayed || this.show(n.name), t = h(n.box).find(".w2ui-overlay-body").get(0), s = h(n.box).find(".w2ui-menu-search, .w2ui-menu-top").get(0), h(n.box).find(".w2ui-menu-item.w2ui-selected").removeClass("w2ui-selected"), n = h(n.box).find(`.w2ui-menu-item[index="${n.selected}"]`).addClass("w2ui-selected").get(0)) && (n.offsetTop + n.clientHeight > t.clientHeight + t.scrollTop && n.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start"
      }), n.offsetTop < t.scrollTop + (s ? s.clientHeight : 0)) && n.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end"
      });
    }
    refreshSearch(e) {
      var _a2, _b;
      let t = ut.active[e.replace(/[\s\.#]/g, "_")];
      t && (t.displayed || this.show(t.name), h(t.box).find(".w2ui-no-items").hide(), h(t.box).find(".w2ui-menu-item, .w2ui-menu-divider").each((s) => {
        var _a3, _b2;
        var n;
        ((_a3 = this.getCurrent(e, s.getAttribute("index")).item) == null ? void 0 : _a3.hidden) ? h(s).hide() : ((n = (_b2 = t.tmp) == null ? void 0 : _b2.search) && t.options.markSearch && y.marker(s, n, {
          onlyFirst: t.options.match == "begins"
        }), h(s).show());
      }), h(t.box).find(".w2ui-sub-menu").each((s) => {
        var n = h(s).find(".w2ui-menu-item").get().some((i) => i.style.display != "none");
        this.getCurrent(e, s.dataset.parent).item.expanded && (n ? h(s).parent().show() : h(s).parent().hide());
      }), t.tmp.searchCount != 0 && ((_b = (_a2 = t.options) == null ? void 0 : _a2.items) == null ? void 0 : _b.length) != 0 || (h(t.box).find(".w2ui-no-items").length == 0 && h(t.box).find(".w2ui-menu:not(.w2ui-sub-menu)").append(`
                    <div class="w2ui-no-items">
                        ${y.lang(t.options.msgNoItems)}
                    </div>`), h(t.box).find(".w2ui-no-items").show()));
    }
    applyFilter(e, t, s, n) {
      var _a2;
      let i = 0;
      var o = ut.active[e.replace(/[\s\.#]/g, "_")];
      let a = o.options, r, c;
      var d = new Promise((x, b) => {
        r = x, c = b;
      });
      s == null && (s = [
        "INPUT",
        "TEXTAREA"
      ].includes(o.anchor.tagName) ? o.anchor.value : "");
      let p = [];
      a.selected && (Array.isArray(a.selected) ? p = a.selected.map((x) => (x == null ? void 0 : x.id) ?? x) : ((_a2 = a.selected) == null ? void 0 : _a2.id) && (p = [
        a.selected.id
      ])), o.tmp.activeChain = null;
      var f = o.tmp.remote ?? {
        hasMore: true,
        emtpySet: false,
        search: null,
        total: -1
      };
      if (t == null && a.url && f.hasMore && f.search !== s) {
        let x = true, b = y.lang("Loading...");
        s.length < a.minLength && f.emptySet !== true && (b = y.lang("${count} letters or more...", {
          count: a.minLength
        }), x = false, s === "") && (b = y.lang(a.msgSearch)), h(o.box).find(".w2ui-no-items").html(b), f.search = s, a.items = [], o.tmp.remote = f, x && this.request(o, s, n).then((C) => {
          this.update(e, C), this.applyFilter(e, null, s).then((_) => {
            r(_);
          });
        }).catch((C) => {
          console.log("Server Request error", C);
        });
      } else {
        let x;
        t == null && (x = this.trigger("search", {
          search: s,
          overlay: o,
          prom: d,
          resolve: r,
          reject: c
        })).isCancelled === true || (t == null && (t = o.options.items), a.filter === false ? r({
          count: -1,
          search: s
        }) : (t.forEach((b) => {
          let C = "", _ = "";
          [
            "is",
            "begins",
            "begins with"
          ].indexOf(a.match) !== -1 && (C = "^"), [
            "is",
            "ends",
            "ends with"
          ].indexOf(a.match) !== -1 && (_ = "$");
          try {
            new RegExp(C + s + _, "i").test(b.text) || b.text === "..." ? b.hidden = false : b.hidden = true;
          } catch {
          }
          a.hideSelected && p.includes(b.id) && (b.hidden = true), Array.isArray(b.items) && 0 < b.items.length && (delete b._noSearchInside, this.applyFilter(e, b.items, s).then((S) => {
            S = S.count, 0 < S && (i += S, b.hidden && (b._noSearchInside = true), s && (b.expanded = true), b.hidden = false);
          })), b.hidden !== true && i++;
        }), r({
          count: i,
          search: s
        }), x == null ? void 0 : x.finish()));
      }
      return d;
    }
    request(e, t, s) {
      let n = e.options, i = e.tmp.remote, o, a;
      return (n.items.length === 0 && i.total !== 0 || i.total == n.cacheMax && t.length > i.search.length || t.length >= i.search.length && t.substr(0, i.search.length) !== i.search || t.length < i.search.length) && (i.controller && i.controller.abort(), i.loading = true, clearTimeout(i.timeout), i.timeout = setTimeout(() => {
        var r = n.url;
        let c = {
          search: t,
          max: n.cacheMax
        };
        Object.assign(c, n.postData);
        var d, p = this.trigger("request", {
          search: t,
          overlay: e,
          url: r,
          postData: c,
          httpMethod: n.method ?? "GET",
          httpHeaders: {}
        });
        p.isCancelled !== true && (r = new URL(p.detail.url, location), d = y.prepareParams(r, {
          method: p.detail.httpMethod,
          headers: p.detail.httpHeaders,
          body: p.detail.postData
        }), i.controller = new AbortController(), d.signal = i.controller.signal, fetch(r, d).then((f) => f.json()).then((f) => {
          i.controller = null;
          var x = e.trigger("load", {
            search: c.search,
            overlay: e,
            data: f
          });
          x.isCancelled !== true && (typeof (f = x.detail.data) == "string" && (f = JSON.parse(f)), (f = Array.isArray(f) ? {
            records: f
          } : f).records == null && f.items != null && (f.records = f.items, delete f.items), f.error || f.records != null || (f.records = []), Array.isArray(f.records) ? (f.records.length >= n.cacheMax ? (f.records.splice(n.cacheMax, f.records.length), i.hasMore = true) : i.hasMore = false, n.recId == null && n.recid != null && (n.recId = n.recid), (n.recId || n.recText) && f.records.forEach((b) => {
            typeof n.recId == "string" && (b.id = b[n.recId]), typeof n.recId == "function" && (b.id = n.recId(b)), typeof n.recText == "string" && (b.text = b[n.recText]), typeof n.recText == "function" && (b.text = n.recText(b));
          }), i.loading = false, i.search = t, i.total = f.records.length, i.lastError = "", i.emptySet = t === "" && f.records.length === 0, x.finish(), o(y.normMenu(f.records))) : console.error("ERROR: server did not return proper data structure", `
`, " - it should return", {
            records: [
              {
                id: 1,
                text: "item"
              }
            ]
          }, `
`, " - or just an array ", [
            {
              id: 1,
              text: "item"
            }
          ], `
`, " - or if errorr ", {
            error: true,
            message: "error message"
          }));
        }).catch((f) => {
          var x = this.trigger("error", {
            overlay: e,
            search: t,
            error: f
          });
          x.isCancelled !== true && ((f == null ? void 0 : f.name) !== "AbortError" && console.error("ERROR: Server communication failed.", `
`, " - it should return", {
            records: [
              {
                id: 1,
                text: "item"
              }
            ]
          }, `
`, " - or just an array ", [
            {
              id: 1,
              text: "item"
            }
          ], `
`, " - or if errorr ", {
            error: true,
            message: "error message"
          }), i.loading = false, i.search = "", i.total = -1, i.emptySet = true, i.lastError = x.detail.error || "Server communication failed", n.items = [], x.finish(), a());
        }), p.finish());
      }, s ? n.debounce ?? 350 : 0)), new Promise((r, c) => {
        o = r, a = c;
      });
    }
    getActiveChain(e, t, s = [], n = [], i) {
      var o = ut.active[e.replace(/[\s\.#]/g, "_")];
      return o.tmp.activeChain != null ? o.tmp.activeChain : ((t = t ?? o.options.items).forEach((a, r) => {
        var _a2;
        a.hidden || a.disabled || ((_a2 = a == null ? void 0 : a.text) == null ? void 0 : _a2.startsWith("--")) || (n.push(s.concat([
          r
        ]).join("-")), Array.isArray(a.items) && 0 < a.items.length && a.expanded && (s.push(r), this.getActiveChain(e, a.items, s, n, true), s.pop()));
      }), i == null && (o.tmp.activeChain = n), n);
    }
    menuDown(e, t, s, n) {
      e = e.options;
      let i = e.items;
      var o = h(t.delegate).find(".w2ui-icon");
      let a = h(t.target).closest(".w2ui-menu:not(.w2ui-sub-menu)"), r = (typeof n == "string" && n !== "" && n.split("-").forEach((c) => {
        i = i[c].items;
      }), i[s]);
      if (!r.disabled) {
        let c = (d, p) => {
          d.forEach((f, x) => {
            f.id != r.id && (f.group === r.group && f.checked && (a.find(`.w2ui-menu-item[index="${(p ? p + "-" : "") + x}"] .w2ui-icon`).removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), d[x].checked = false), Array.isArray(f.items)) && c(f.items, x);
          });
        };
        e.type !== "check" && e.type !== "radio" || r.group === false || h(t.target).hasClass("remove") || h(t.target).closest(".w2ui-menu-item").hasClass("has-sub-menu") || (r.checked = e.type == "radio" || !r.checked, r.checked ? (e.type === "radio" && h(t.target).closest(".w2ui-menu").find(".w2ui-icon").removeClass("w2ui-icon-check").addClass("w2ui-icon-empty"), e.type === "check" && r.group != null && c(e.items), o.removeClass("w2ui-icon-empty").addClass("w2ui-icon-check")) : e.type === "check" && o.removeClass("w2ui-icon-check").addClass("w2ui-icon-empty")), h(t.target).hasClass("remove") || (a.find(".w2ui-menu-item").removeClass("w2ui-selected"), h(t.delegate).addClass("w2ui-selected"));
      }
    }
    menuClick(e, t, s, n) {
      var i = e.options;
      let o = i.items;
      var a = h(t.delegate).closest(".w2ui-menu-item");
      let r = !i.hideOn.includes("select");
      (t.shiftKey || t.metaKey || t.ctrlKey) && (r = true), typeof n == "string" && n !== "" ? n.split("-").forEach((d) => {
        o = o[d].items;
      }) : n = null;
      var c = (o = typeof o == "function" ? o({
        overlay: e,
        index: s,
        parentIndex: n,
        event: t
      }) : o)[s];
      if (!c.disabled || h(t.target).hasClass("remove")) {
        let d;
        if (h(t.target).hasClass("remove")) {
          if ((d = this.trigger("remove", {
            originalEvent: t,
            target: e.name,
            overlay: e,
            item: c,
            index: s,
            parentIndex: n,
            el: a[0]
          })).isCancelled === true) return;
          r = !i.hideOn.includes("item-remove"), a.remove();
        } else if (a.hasClass("has-sub-menu")) {
          if ((d = this.trigger("subMenu", {
            originalEvent: t,
            target: e.name,
            overlay: e,
            item: c,
            index: s,
            parentIndex: n,
            el: a[0]
          })).isCancelled === true) return;
          r = true, a.hasClass("expanded") ? (c.expanded = false, a.removeClass("expanded").addClass("collapsed"), h(a.get(0).nextElementSibling).hide()) : (c.expanded = true, a.addClass("expanded").removeClass("collapsed"), h(a.get(0).nextElementSibling).show()), e.selected = parseInt(a.attr("index"));
        } else {
          if (i = this.findChecked(i.items), e.selected = parseInt(a.attr("index")), (d = this.trigger("select", {
            originalEvent: t,
            target: e.name,
            overlay: e,
            item: c,
            index: s,
            parentIndex: n,
            selected: i,
            keepOpen: r,
            el: a[0]
          })).isCancelled === true) return;
          c.keepOpen != null && (r = c.keepOpen), [
            "INPUT",
            "TEXTAREA"
          ].includes(e.anchor.tagName) && (e.anchor.dataset.selected = c.id, e.anchor.dataset.selectedIndex = e.selected);
        }
        r || this.hide(e.name), d.finish();
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
      var s = e.options, n = t.target.value;
      let i = true, o = false;
      switch (t.keyCode) {
        case 46:
        case 8:
          n !== "" || e.displayed || (i = false);
          break;
        case 13:
          if (!e.displayed || !e.selected) return;
          var { index: r, parents: a } = this.getCurrent(e.name);
          t.delegate = h(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(r), a), i = false;
          break;
        case 27:
          i = false, e.displayed ? this.hide(e.name) : (r = e.anchor, [
            "INPUT",
            "TEXTAREA"
          ].includes(r.tagName) && (r.value = "", delete r.dataset.selected, delete r.dataset.selectedIndex));
          break;
        case 37: {
          if (!e.displayed) return;
          let { item: d, index: p, parents: f } = this.getCurrent(e.name);
          f && (d = s.items[f], p = parseInt(f), f = "", o = true), Array.isArray(d == null ? void 0 : d.items) && 0 < d.items.length && d.expanded && (t.delegate = h(e.box).find(`.w2ui-menu-item[index="${p}"]`).get(0), e.selected = p, this.menuClick(e, t, parseInt(p), f)), i = false;
          break;
        }
        case 39:
          if (!e.displayed) return;
          var { item: a, index: r, parents: c } = this.getCurrent(e.name);
          Array.isArray(a == null ? void 0 : a.items) && 0 < a.items.length && !a.expanded && (t.delegate = h(e.box).find(".w2ui-selected").get(0), this.menuClick(e, t, parseInt(r), c)), i = false;
          break;
        case 38:
          e.displayed && (a = this.getActiveChain(e.name), e.selected == null || ((_a2 = e.selected) == null ? void 0 : _a2.length) == 0 ? e.selected = a[a.length - 1] : ((r = a.indexOf(e.selected)) == -1 && (e.selected = a[a.length - 1]), 0 < r && (e.selected = a[r - 1])), i = false, o = true, t.preventDefault());
          break;
        case 40:
          e.displayed && (c = this.getActiveChain(e.name), e.selected == null || ((_b = e.selected) == null ? void 0 : _b.length) == 0 ? e.selected = c[0] : ((a = c.indexOf(e.selected)) == -1 && (e.selected = c[0]), a < c.length - 1 && (e.selected = c[a + 1])), i = false, o = true, t.preventDefault());
      }
      i && e.displayed && (s.filter && t._searchType == "filter" || s.search && t._searchType == "search") && this.applyFilter(e.name, null, n, true).then((d) => {
        e.tmp.searchCount = d.count, e.tmp.search = d.search, d.count !== 0 && this.getActiveChain(e.name).includes(e.selected) || (e.selected = null), this.refreshSearch(e.name);
      }), o && this.refreshIndex(e.name);
    }
  }
  class bc extends ut {
    constructor() {
      super();
      var e = /* @__PURE__ */ new Date();
      this.daysCount = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
      ], this.today = e.getFullYear() + "/" + (Number(e.getMonth()) + 1) + "/" + e.getDate(), this.defaults = y.extend({}, this.defaults, {
        position: "top|bottom",
        class: "w2ui-calendar",
        type: "date",
        format: "",
        value: "",
        start: null,
        end: null,
        blockDates: [],
        blockWeekdays: [],
        colored: {},
        arrowSize: 12,
        autoResize: false,
        anchorClass: "w2ui-focus",
        autoShowOn: "focus",
        hideOn: [
          "doc-click",
          "focus-change"
        ],
        onSelect: null
      });
    }
    attach(i, n) {
      let s;
      arguments.length == 1 && i.anchor ? i = (s = i).anchor : arguments.length === 2 && n != null && typeof n == "object" && ((s = n).anchor = i);
      var n = s.hideOn, i = (s = y.extend({}, this.defaults, s || {}), n && (s.hideOn = n), s.format || (i = y.settings.dateFormat, n = y.settings.timeFormat, s.type == "date" ? s.format = i : s.type == "time" ? s.format = n : s.format = i + "|" + n), s.type == "time" ? this.getHourHTML(s) : this.getMonthHTML(s));
      s.style += "; padding: 0;", s.html = i.html;
      let o = super.attach(s), a = o.overlay;
      return Object.assign(a.tmp, i), a.on("show.attach", (c) => {
        var c = c.detail.overlay, d = c.anchor, p = c.options;
        [
          "INPUT",
          "TEXTAREA"
        ].includes(d.tagName) && !p.value && d.value && (c.tmp.initValue = d.value), delete c.newValue, delete c.newDate;
      }), a.on("show:after.attach", (r) => {
        var _a2;
        ((_a2 = o.overlay) == null ? void 0 : _a2.box) && this.initControls(o.overlay);
      }), a.on("update:after.attach", (r) => {
        var _a2;
        ((_a2 = o.overlay) == null ? void 0 : _a2.box) && this.initControls(o.overlay);
      }), a.on("hide.attach", (c) => {
        var c = c.detail.overlay, d = c.anchor;
        c.newValue != null && (c.newDate && (c.newValue = c.newDate + " " + c.newValue), [
          "INPUT",
          "TEXTAREA"
        ].includes(d.tagName) && d.value != c.newValue && (d.value = c.newValue), (d = this.trigger("select", {
          date: c.newValue,
          target: c.name,
          overlay: c
        })).isCancelled !== true) && d.finish();
      }), o.select = (r) => (a.on("select.attach", (c) => {
        r(c);
      }), o), o;
    }
    initControls(e) {
      let t = e.options, s = (i) => {
        let { month: o, year: a } = e.tmp;
        12 < (o += i) && (o = 1, a++), o < 1 && (o = 12, a--), i = this.getMonthHTML(t, o, a), Object.assign(e.tmp, i), h(e.box).find(".w2ui-overlay-body").html(i.html), this.initControls(e);
      }, n = (i, o) => {
        h(i.target).parent().find(".w2ui-jump-month, .w2ui-jump-year").removeClass("w2ui-selected"), h(i.target).addClass("w2ui-selected"), i = /* @__PURE__ */ new Date();
        let { jumpMonth: a, jumpYear: r } = e.tmp;
        (a = o && (r == null && (r = i.getFullYear()), a == null) ? i.getMonth() + 1 : a) && r && (o = this.getMonthHTML(t, a, r), Object.assign(e.tmp, o), h(e.box).find(".w2ui-overlay-body").html(o.html), e.tmp.jump = false, this.initControls(e));
      };
      h(e.box).find(".w2ui-cal-title").off(".calendar").on("click.calendar", (i) => {
        var o, a;
        Object.assign(e.tmp, {
          jumpYear: null,
          jumpMonth: null
        }), e.tmp.jump ? ({ month: o, year: a } = e.tmp, o = this.getMonthHTML(t, o, a), h(e.box).find(".w2ui-overlay-body").html(o.html), e.tmp.jump = false) : (h(e.box).find(".w2ui-overlay-body .w2ui-cal-days").replace(this.getYearHTML()), (a = h(e.box).find(`[name="${e.tmp.year}"]`).get(0)) && a.scrollIntoView(true), e.tmp.jump = true), this.initControls(e), i.stopPropagation();
      }).find(".w2ui-cal-previous").off(".calendar").on("click.calendar", (i) => {
        s(-1), i.stopPropagation();
      }).parent().find(".w2ui-cal-next").off(".calendar").on("click.calendar", (i) => {
        s(1), i.stopPropagation();
      }), h(e.box).find(".w2ui-cal-now").off(".calendar").on("click.calendar", (i) => {
        t.type == "datetime" ? e.newDate ? e.newValue = y.formatTime(/* @__PURE__ */ new Date(), t.format.split("|")[1]) : e.newValue = y.formatDateTime(/* @__PURE__ */ new Date(), t.format) : t.type == "date" ? e.newValue = y.formatDate(/* @__PURE__ */ new Date(), t.format) : t.type == "time" && (e.newValue = y.formatTime(/* @__PURE__ */ new Date(), t.format)), this.hide(e.name);
      }), h(e.box).off(".calendar").on("click.calendar", {
        delegate: ".w2ui-day.w2ui-date"
      }, (i) => {
        t.type == "datetime" ? (e.newDate = h(i.target).attr("date"), h(e.box).find(".w2ui-overlay-body").html(this.getHourHTML(e.options).html), this.initControls(e)) : (e.newValue = h(i.target).attr("date"), this.hide(e.name));
      }).on("click.calendar", {
        delegate: ".w2ui-jump-month"
      }, (i) => {
        e.tmp.jumpMonth = parseInt(h(i.target).attr("name")), n(i);
      }).on("dblclick.calendar", {
        delegate: ".w2ui-jump-month"
      }, (i) => {
        e.tmp.jumpMonth = parseInt(h(i.target).attr("name")), n(i, true);
      }).on("click.calendar", {
        delegate: ".w2ui-jump-year"
      }, (i) => {
        e.tmp.jumpYear = parseInt(h(i.target).attr("name")), n(i);
      }).on("dblclick.calendar", {
        delegate: ".w2ui-jump-year"
      }, (i) => {
        e.tmp.jumpYear = parseInt(h(i.target).attr("name")), n(i, true);
      }).on("click.calendar", {
        delegate: ".w2ui-time.hour"
      }, (o) => {
        var o = h(o.target).attr("hour");
        let a = this.str2min(t.value) % 60;
        e.tmp.initValue && !t.value && (a = this.str2min(e.tmp.initValue) % 60), t.noMinutes ? (e.newValue = this.min2str(60 * o, t.format), this.hide(e.name)) : (e.newValue = o + ":" + a, o = this.getMinHTML(o, t).html, h(e.box).find(".w2ui-overlay-body").html(o), this.initControls(e));
      }).on("click.calendar", {
        delegate: ".w2ui-time.min"
      }, (i) => {
        i = 60 * Math.floor(this.str2min(e.newValue) / 60) + parseInt(h(i.target).attr("min")), e.newValue = this.min2str(i, t.format), this.hide(e.name);
      });
    }
    getMonthHTML(e, t, s) {
      var o = y.settings.fulldays.slice(), n = y.settings.shortdays.slice();
      y.settings.weekStarts !== "M" && (o.unshift(o.pop()), n.unshift(n.pop()));
      let i = /* @__PURE__ */ new Date();
      var o = e.type === "datetime" ? y.isDateTime(e.value, e.format, true) : y.isDate(e.value, e.format, true), a = y.formatDate(o);
      t != null && s != null || (s = (o || i).getFullYear(), t = o ? o.getMonth() + 1 : i.getMonth() + 1), 12 < t && (t -= 12, s++), (t < 1 || t === 0) && (t += 12, s--), s / 4 == Math.floor(s / 4) ? this.daysCount[1] = 29 : this.daysCount[1] = 28, e.current = t + "/" + s;
      let r = (i = new Date(s, t - 1, 1)).getDay(), c = "";
      var d = y.settings.weekStarts;
      for (let A = 0; A < n.length; A++) {
        var p = d == "M" && A == 5 || d != "M" && A == 6, f = d == "M" && A == 6 || d != "M" && A == 0;
        c += `<div class="w2ui-day w2ui-weekday ${p ? "w2ui-sunday" : ""} ${f ? "w2ui-saturday" : ""}">${n[A]}</div>`;
      }
      let x = `
            <div class="w2ui-cal-title">
                <div class="w2ui-cal-previous">
                    <div></div>
                </div>
                <div class="w2ui-cal-next">
                    <div></div>
                </div>
                ${y.settings.fullmonths[t - 1]}, ${s}
                <span class="arrow-down"></span>
            </div>
            <div class="w2ui-cal-days">
                ${c}
        `, b = /* @__PURE__ */ new Date(s + `/${t}/1`);
      o = (b = new Date(b.getTime() + 432e5)).getDay(), y.settings.weekStarts == "M" && r--, 0 < o && (b = new Date(b.getTime() - 864e5 * r));
      for (let A = 0; A < 42; A++) {
        var C = [], _ = `${b.getFullYear()}/${b.getMonth() + 1}/` + b.getDate(), S = (b.getDay() === 6 && C.push("w2ui-saturday"), b.getDay() === 0 && C.push("w2ui-sunday"), b.getMonth() + 1 !== t && C.push("outside"), _ == this.today && C.push("w2ui-today"), b.getDate());
        let P = "", H = "", U, G;
        G = e.type === "datetime" ? (U = y.formatDateTime(_, e.format), y.formatDate(_, y.settings.dateFormat)) : U = y.formatDate(_, e.format), e.colored && e.colored[G] !== void 0 && (_ = e.colored[G].split("|"), H = "background-color: " + _[0] + ";", P = "color: " + _[1] + ";"), x += `<div class="w2ui-day ${this.inRange(U, e, true) ? "w2ui-date " + (G == a ? "w2ui-selected" : "") : "w2ui-blocked"} ${C.join(" ")}"
                       style="${P + H}" date="${G}" data-date="${b.getTime()}">
                            ${S}
                    </div>`, b = new Date(b.getTime() + 864e5);
      }
      return x += "</div>", e.btnNow && (o = y.lang("Today" + (e.type == "datetime" ? " & Now" : "")), x += `<div class="w2ui-cal-now">${o}</div>`), {
        html: x,
        month: t,
        year: s
      };
    }
    getYearHTML() {
      let e = "", t = "";
      for (let s = 0; s < y.settings.fullmonths.length; s++) e += `<div class="w2ui-jump-month" name="${s + 1}">${y.settings.shortmonths[s]}</div>`;
      for (let s = y.settings.dateStartYear; s <= y.settings.dateEndYear; s++) t += `<div class="w2ui-jump-year" name="${s}">${s}</div>`;
      return `<div class="w2ui-cal-jump">
            <div id="w2ui-jump-month">${e}</div>
            <div id="w2ui-jump-year">${t}</div>
        </div>`;
    }
    getHourHTML(e) {
      (e = e ?? {}).format || (e.format = y.settings.timeFormat);
      var t = -1 < e.format.indexOf("h24"), s = e.value || (e.anchor ? e.anchor.value : ""), n = [];
      for (let a = 0; a < 24; a++) {
        let r = (12 <= a && !t ? a - 12 : a) + ":00" + (t ? "" : a < 12 ? " am" : " pm"), c = (a != 12 || t || (r = "12:00 pm"), n[Math.floor(a / 8)] || (n[Math.floor(a / 8)] = ""), this.min2str(this.str2min(r))), d = this.min2str(this.str2min(r) + 59);
        e.type === "datetime" && (o = y.isDateTime(s, e.format, true), i = e.format.split("|")[0].trim(), c = y.formatDate(o, i) + " " + c, d = y.formatDate(o, i) + " " + d);
        var i, o = this.inRange(c, e) || this.inRange(d, e);
        n[Math.floor(a / 8)] += `<span hour="${a}"
                class="hour ${o ? "w2ui-time " : "w2ui-blocked"}">${r}</span>`;
      }
      return {
        html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${y.lang("Select Hour")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${n[0]}</div>
                <div class="w2ui-cal-column">${n[1]}</div>
                <div class="w2ui-cal-column">${n[2]}</div>
            </div>
            ${e.btnNow ? `<div class="w2ui-cal-now">${y.lang("Now")}</div>` : ""}
        </div>`
      };
    }
    getMinHTML(e, t) {
      e == null && (e = 0), (t = t ?? {}).format || (t.format = y.settings.timeFormat);
      var s = -1 < t.format.indexOf("h24"), n = t.value || (t.anchor ? t.anchor.value : ""), i = [];
      for (let d = 0; d < 60; d += 5) {
        var o = (12 < e && !s ? e - 12 : e) + ":" + (d < 10 ? 0 : "") + d + " " + (s ? "" : e < 12 ? "am" : "pm");
        let p = o;
        var a, r, c = d < 20 ? 0 : d < 40 ? 1 : 2;
        i[c] || (i[c] = ""), t.type === "datetime" && (a = y.isDateTime(n, t.format, true), r = t.format.split("|")[0].trim(), p = y.formatDate(a, r) + " " + p), i[c] += `<span min="${d}" class="min ${this.inRange(p, t) ? "w2ui-time " : "w2ui-blocked"}">${o}</span>`;
      }
      return {
        html: `<div class="w2ui-calendar">
            <div class="w2ui-time-title">${y.lang("Select Minute")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${i[0]}</div>
                <div class="w2ui-cal-column">${i[1]}</div>
                <div class="w2ui-cal-column">${i[2]}</div>
            </div>
            ${t.btnNow ? `<div class="w2ui-cal-now">${y.lang("Now")}</div>` : ""}
        </div>`
      };
    }
    inRange(e, t, s) {
      let n = false;
      if (t.type === "date") {
        var i = y.isDate(e, t.format, true);
        if (i) {
          if (t.start || t.end) {
            var o = typeof t.start == "string" ? t.start : h(t.start).val(), a = typeof t.end == "string" ? t.end : h(t.end).val();
            let r = y.isDate(o, t.format, true), c = y.isDate(a, t.format, true);
            o = new Date(i), r = r || o, c = c || o, o >= r && o <= c && (n = true);
          } else n = true;
          Array.isArray(t.blockDates) && t.blockDates.includes(e) && (n = false), Array.isArray(t.blockWeekdays) && t.blockWeekdays.includes(i.getDay()) && (n = false);
        }
      } else if (t.type === "time") if (t.start || t.end) {
        a = this.str2min(e);
        let r = this.str2min(t.start), c = this.str2min(t.end);
        r = r || a, c = c || a, a >= r && a <= c && (n = true);
      } else n = true;
      else t.type === "datetime" && (o = y.isDateTime(e, t.format, true)) && (i = t.format.split("|").map((r) => r.trim()), s ? (a = y.formatDate(o, i[0]), e = y.extend({}, t, {
        type: "date",
        format: i[0]
      }), this.inRange(a, e) && (n = true)) : (s = y.formatTime(o, i[1]), a = {
        type: "time",
        format: i[1],
        start: t.startTime,
        end: t.endTime
      }, this.inRange(s, a) && (n = true)));
      return n;
    }
    str2min(e) {
      var t;
      return typeof e != "string" || (t = e.split(":")).length !== 2 ? null : (t[0] = parseInt(t[0]), t[1] = parseInt(t[1]), e.indexOf("pm") !== -1 && t[0] !== 12 && (t[0] += 12), e.includes("am") && t[0] == 12 && (t[0] = 0), 60 * t[0] + t[1]);
    }
    min2str(n, t) {
      1440 <= n && (n %= 1440), n < 0 && (n = 1440 + n);
      var s = Math.floor(n / 60), n = (n % 60 < 10 ? "0" : "") + n % 60;
      return t = t || y.settings.timeFormat, t.indexOf("h24") !== -1 ? s + ":" + n : (s <= 12 ? s : s - 12) + ":" + n + " " + (12 <= s ? "pm" : "am");
    }
  }
  let ct = new ut(), Jt = new xc(), ul = new wc(), Ln = new bc();
  vc = class extends cn {
    constructor(e) {
      super(e.name), this.box = null, this.name = null, this.routeData = {}, this.items = [], this.right = "", this.tooltip = "top|left", this.onClick = null, this.onMouseDown = null, this.onMouseUp = null, this.onMouseEnter = null, this.onMouseLeave = null, this.onRender = null, this.onRefresh = null, this.onResize = null, this.onDestroy = null, this.item_template = {
        id: null,
        type: "button",
        text: null,
        html: "",
        tooltip: null,
        count: null,
        hidden: false,
        disabled: false,
        checked: false,
        icon: null,
        route: null,
        arrow: null,
        style: null,
        group: null,
        items: null,
        selected: null,
        color: null,
        overlay: {
          anchorClass: ""
        },
        onClick: null,
        onRefresh: null
      }, this.last = {
        badge: {}
      };
      var t = e.items;
      delete e.items, Object.assign(this, e), Array.isArray(t) && this.add(t, true), e.items = t, typeof this.box == "string" && (this.box = h(this.box).get(0)), this.box && this.render(this.box);
    }
    add(e, t) {
      this.insert(null, e, t);
    }
    insert(e, t, s) {
      (t = Array.isArray(t) ? t : [
        t
      ]).forEach((n, i, o) => {
        typeof n == "string" && (n = o[i] = {
          id: n,
          text: n
        });
        var a, r = [
          "button",
          "check",
          "radio",
          "drop",
          "menu",
          "menu-radio",
          "menu-check",
          "color",
          "text-color",
          "html",
          "break",
          "spacer",
          "new-line"
        ];
        if (r.includes(String(n.type))) if (n.id != null || [
          "break",
          "spacer",
          "new-line"
        ].includes(n.type)) {
          if (n.type == null) console.log('ERROR: The parameter "type" is required but not supplied.', n);
          else if (y.checkUniqueId(n.id, this.items, "toolbar", this.name)) {
            let c = y.extend({}, this.item_template, n);
            c.type == "menu-check" ? (Array.isArray(c.selected) || (c.selected = []), Array.isArray(c.items) && c.items.forEach((d) => {
              (d = typeof d == "string" ? o[i] = {
                id: d,
                text: d
              } : d).checked && !c.selected.includes(d.id) && c.selected.push(d.id), !d.checked && c.selected.includes(d.id) && (d.checked = true), d.checked == null && (d.checked = false);
            })) : c.type == "menu-radio" && Array.isArray(c.items) && c.items.forEach((d, p, f) => {
              (d = typeof d == "string" ? f[p] = {
                id: d,
                text: d
              } : d).checked && c.selected == null ? c.selected = d.id : d.checked = false, d.checked || c.selected != d.id || (d.checked = true), d.checked == null && (d.checked = false);
            }), e == null ? this.items.push(c) : (a = this.get(e, true), this.items = this.items.slice(0, a).concat([
              c
            ], this.items.slice(a))), c.line = c.line ?? 1, s !== true && this.refresh(c.id);
          }
        } else console.log('ERROR: The parameter "id" is required but not supplied.', n);
        else console.log('ERROR: The parameter "type" should be one of the following:', r, `, but ${n.type} is supplied.`, n);
      }), s !== true && this.resize();
    }
    remove() {
      let e = 0;
      return Array.from(arguments).forEach((t) => {
        var s = this.get(t);
        s && String(t).indexOf(":") == -1 && (e++, h(this.box).find("#tb_" + this.name + "_item_" + y.escapeId(s.id)).remove(), (t = this.get(s.id, true)) != null) && this.items.splice(t, 1);
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
      var n = String(e).split(":");
      for (let a = 0; a < this.items.length; a++) {
        var i = this.items[a];
        if ([
          "menu",
          "menu-radio",
          "menu-check"
        ].includes(i.type) && n.length == 2 && i.id == n[0]) {
          let r = i.items;
          typeof r == "function" && (r = r(this));
          for (let c = 0; c < r.length; c++) {
            var o = r[c];
            if (o.id == n[1] || o.id == null && o.text == n[1]) return t == 1 ? c : o;
            if (Array.isArray(o.items)) {
              for (let d = 0; d < o.items.length; d++) if (o.items[d].id == n[1] || o.items[d].id == null && o.items[d].text == n[1]) return t == 1 ? c : o.items[d];
            }
          }
        } else if (i.id == n[0]) return t == 1 ? a : i;
      }
      return null;
    }
    setCount(e, t, s, n) {
      var i = h(this.box).find(`#tb_${this.name}_item_${y.escapeId(e)} .w2ui-tb-count > span`);
      0 < i.length ? (i.removeClass().addClass(s ?? "").text(t).get(0).style.cssText = n ?? "", this.last.badge[e] = {
        className: s ?? "",
        style: n ?? ""
      }, this.get(e).count = t) : (this.set(e, {
        count: t
      }), this.setCount(...arguments));
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
        s && String(t).indexOf(":") == -1 && ([
          "menu",
          "menu-radio",
          "menu-check",
          "drop",
          "color",
          "text-color"
        ].includes(s.type) && s.checked && ct.hide(this.name + "-drop"), s.checked = false, e.push(String(t).split(":")[0]));
      }), setTimeout(() => {
        e.forEach((t) => {
          this.refresh(t);
        });
      }, 15), e;
    }
    click(e, t) {
      var s = String(e).split(":");
      let n = this.get(s[0]), i = n && n.items ? y.normMenu.call(this, n.items, n) : [];
      if (1 < s.length) (s = this.get(e)) && !s.disabled && this.menuClick({
        name: this.name,
        item: n,
        subItem: s,
        originalEvent: t
      });
      else if (n && !n.disabled && (s = this.trigger("click", {
        target: e ?? this.name,
        item: n,
        object: n,
        originalEvent: t
      }), s.isCancelled !== true)) {
        i = n && n.items ? y.normMenu.call(this, n.items, n) : [];
        let r = "#tb_" + this.name + "_item_" + y.escapeId(n.id);
        if (h(this.box).find(r).removeClass("down"), n.type == "radio") {
          for (let c = 0; c < this.items.length; c++) {
            var o = this.items[c];
            o != null && o.id != n.id && o.type === "radio" && o.group == n.group && o.checked && (o.checked = false, this.refresh(o.id));
          }
          n.checked = true, h(this.box).find(r).addClass("checked");
        }
        if ([
          "menu",
          "menu-radio",
          "menu-check",
          "drop",
          "color",
          "text-color"
        ].includes(n.type)) {
          if (this.tooltipHide(e), n.checked) return void ct.hide(this.name + "-drop");
          setTimeout(() => {
            var c = (p, f) => {
              let x = this;
              return function() {
                x.set(p, {
                  checked: false
                });
              };
            }, d = h(this.box).find("#tb_" + this.name + "_item_" + y.escapeId(n.id));
            if (y.isPlainObject(n.overlay) || (n.overlay = {}), n.type == "drop" && ct.show(y.extend({
              html: n.html,
              class: "w2ui-white",
              hideOn: [
                "doc-click"
              ]
            }, n.overlay, {
              anchor: d[0],
              name: this.name + "-drop",
              data: {
                item: n,
                btn: r
              }
            })).hide(c(n.id)), [
              "menu",
              "menu-radio",
              "menu-check"
            ].includes(n.type)) {
              let p = "normal";
              n.type == "menu-radio" && (p = "radio", i.forEach((f) => {
                n.selected == f.id ? f.checked = true : f.checked = false;
              })), n.type == "menu-check" && (p = "check", i.forEach((f) => {
                Array.isArray(n.selected) && n.selected.includes(f.id) ? f.checked = true : f.checked = false;
              })), Jt.show(y.extend({
                items: i
              }, n.overlay, {
                type: p,
                name: this.name + "-drop",
                anchor: d[0],
                data: {
                  item: n,
                  btn: r
                }
              })).hide(c(n.id)).remove((f) => {
                this.menuClick({
                  name: this.name,
                  remove: true,
                  item: n,
                  subItem: f.detail.item,
                  originalEvent: f
                });
              }).select((f) => {
                this.menuClick({
                  name: this.name,
                  item: n,
                  subItem: f.detail.item,
                  originalEvent: f
                });
              });
            }
            [
              "color",
              "text-color"
            ].includes(n.type) && ul.show(y.extend({
              color: n.color
            }, n.overlay, {
              anchor: d[0],
              name: this.name + "-drop",
              data: {
                item: n,
                btn: r
              }
            })).hide(c(n.id)).select((p) => {
              p.detail.color != null && this.colorClick({
                name: this.name,
                item: n,
                color: p.detail.color
              });
            });
          }, 0);
        }
        if ([
          "check",
          "menu",
          "menu-radio",
          "menu-check",
          "drop",
          "color",
          "text-color"
        ].includes(n.type) && (n.checked = !n.checked, n.checked ? h(this.box).find(r).addClass("checked") : h(this.box).find(r).removeClass("checked")), n.route) {
          let c = ("/" + n.route).replace(/\/{2,}/g, "/");
          var a = y.parseRoute(c);
          if (0 < a.keys.length) for (let d = 0; d < a.keys.length; d++) c = c.replace(new RegExp(":" + a.keys[d].name, "g"), this.routeData[a.keys[d].name]);
          setTimeout(() => {
            window.location.hash = c;
          }, 1);
        }
        this.tooltipShow(e), s.finish();
      }
    }
    scroll(e, t, s) {
      return new Promise((n, i) => {
        var o = h(this.box).find(`.w2ui-tb-line:nth-child(${t}) .w2ui-scroll-wrapper`), a = o.get(0).scrollLeft, r = o.find(".w2ui-tb-right").get(0), c = o.parent().get(0).getBoundingClientRect().width, d = a + parseInt(r.offsetLeft) + parseInt(r.clientWidth);
        switch (e) {
          case "left":
            (scroll = a - c + 50) <= 0 && (scroll = 0), o.get(0).scrollTo({
              top: 0,
              left: scroll,
              behavior: s ? "atuo" : "smooth"
            });
            break;
          case "right":
            (scroll = a + c - 50) >= d - c && (scroll = d - c), o.get(0).scrollTo({
              top: 0,
              left: scroll,
              behavior: s ? "atuo" : "smooth"
            });
        }
        setTimeout(() => {
          this.resize(), n();
        }, s ? 0 : 500);
      });
    }
    render(e) {
      var t = Date.now(), s = (typeof e == "string" && (e = h(e).get(0)), this.trigger("render", {
        target: this.name,
        box: e ?? this.box
      }));
      if (s.isCancelled !== true && (e != null && (0 < h(this.box).find(".w2ui-scroll-wrapper .w2ui-tb-right").length && h(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), this.box = e), this.box)) {
        Array.isArray(this.right) || (this.right = [
          this.right
        ]);
        let i = "", o = 0;
        for (let a = 0; a < this.items.length; a++) {
          var n = this.items[a];
          n != null && (n.id == null && (n.id = "item_" + a), n.caption != null && console.log("NOTICE: toolbar item.caption property is deprecated, please use item.text. Item -> ", n), n.hint != null && console.log("NOTICE: toolbar item.hint property is deprecated, please use item.tooltip. Item -> ", n), a !== 0 && n.type != "new-line" || (o++, i += `
                    <div class="w2ui-tb-line">
                        <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                            <div class="w2ui-tb-right">${this.right[o - 1] ?? ""}</div>
                        </div>
                        <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll", "left", "${o}"]'></div>
                        <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll", "right", "${o}"]'></div>
                    </div>
                `), n.line = o);
        }
        return h(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-toolbar").html(i), 0 < h(this.box).length && (h(this.box)[0].style.cssText += this.style), y.bindEvents(h(this.box).find(".w2ui-tb-line .w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
          this.resize();
        }), this.last.observeResize.observe(this.box), this.refresh(), this.resize(), s.finish(), Date.now() - t;
      }
    }
    refresh(e) {
      var t = Date.now(), s = this.trigger("refresh", {
        target: e ?? this.name,
        item: this.get(e)
      });
      if (s.isCancelled !== true) {
        let r;
        if (e == null) for (let c = 0; c < this.items.length; c++) {
          var n = this.items[c];
          n.id == null && (n.id = "item_" + c), this.refresh(n.id);
        }
        else {
          var i = this.get(e);
          if (i == null) return false;
          if (typeof i.onRefresh != "function" || (r = this.trigger("refresh", {
            target: e,
            item: i,
            object: i
          })).isCancelled !== true) {
            var o = `#tb_${this.name}_item_` + y.escapeId(i.id);
            let c = h(this.box).find(o);
            var a = this.getItemHTML(i);
            if (this.tooltipHide(e), i.type == "spacer" && h(this.box).find(".w2ui-tb-line:nth-child(" + i.line).find(".w2ui-tb-right").css("width", "auto"), c.length === 0) {
              e = parseInt(this.get(e, true)) + 1;
              let d = h(this.box).find(`#tb_${this.name}_item_` + y.escapeId(this.items[e] ? this.items[e].id : ""));
              d.length == 0 ? d = h(this.box).find(".w2ui-tb-line:nth-child(" + i.line).find(".w2ui-tb-right").before(a) : d.after(a), y.bindEvents(h(this.box).find(o), this);
            } else {
              h(this.box).find(o).replace(h.html(a));
              let d = h(this.box).find(o).get(0), p = (y.bindEvents(d, this), ct.get(true));
              Object.keys(p).forEach((f) => {
                p[f].anchor == c.get(0) && (p[f].anchor = d);
              });
            }
            if ([
              "menu",
              "menu-radio",
              "menu-check"
            ].includes(i.type) && i.checked) {
              let d = Array.isArray(i.selected) ? i.selected : [
                i.selected
              ];
              i.items.forEach((p) => {
                d.includes(p.id) ? p.checked = true : p.checked = false;
              }), Jt.update(this.name + "-drop", i.items);
            }
            return typeof i.onRefresh == "function" && r.finish(), s.finish(), Date.now() - t;
          }
        }
      }
    }
    resize() {
      var e = Date.now(), t = this.trigger("resize", {
        target: this.name
      });
      if (t.isCancelled !== true) return h(this.box).find(".w2ui-tb-line").each((n) => {
        var n = h(n), i = (n.find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), n.find(".w2ui-scroll-wrapper").get(0)), a = n.find(".w2ui-tb-right"), o = n.get(0).getBoundingClientRect().width, a = 0 < a.length ? a[0].offsetLeft + a[0].clientWidth : 0;
        o < a && (0 < i.scrollLeft && n.find(".w2ui-scroll-left").show(), o < a - i.scrollLeft) && n.find(".w2ui-scroll-right").show();
      }), t.finish(), Date.now() - e;
    }
    destroy() {
      var _a2;
      var e = this.trigger("destroy", {
        target: this.name
      });
      e.isCancelled !== true && (0 < h(this.box).find(".w2ui-scroll-wrapper  .w2ui-tb-right").length && h(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-toolbar").html(""), h(this.box).html(""), (_a2 = this.last.observeResize) == null ? void 0 : _a2.disconnect(), delete Bs[this.name], e.finish());
    }
    getItemHTML(e) {
      let t = "", s = (e.caption != null && e.text == null && (e.text = e.caption), e.text == null && (e.text = ""), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.tooltip == null && (e.tooltip = ""), typeof e.get == "function" || !Array.isArray(e.items) && typeof e.items != "function" || (e.get = function(a) {
        let r = e.items;
        return (r = typeof r == "function" ? e.items(e) : r).find((c) => c.id == a);
      }), ""), n = typeof e.text == "function" ? e.text.call(this, e) : e.text;
      e.icon && (s = e.icon, typeof e.icon == "function" && (s = e.icon.call(this, e)), s = `<div class="w2ui-tb-icon">${s = String(s).slice(0, 1) !== "<" ? `<span class="${s}"></span>` : s}</div>`);
      var i = [
        "w2ui-tb-button"
      ];
      switch (e.checked && i.push("checked"), e.disabled && i.push("disabled"), e.hidden && i.push("hidden"), s || i.push("no-icon"), e.type) {
        case "color":
        case "text-color":
          typeof e.color == "string" && (e.color.slice(0, 1) == "#" && (e.color = e.color.slice(1)), [
            3,
            6,
            8
          ].includes(e.color.length)) && (e.color = "#" + e.color), e.type == "color" && (n = `<span class="w2ui-tb-color-box" style="background-color: ${e.color != null ? e.color : "#fff"}"></span>
                           ` + (e.text ? `<div style="margin-left: 17px;">${y.lang(e.text)}</div>` : "")), e.type == "text-color" && (n = '<span style="color: ' + (e.color != null ? e.color : "#444") + ';">' + (e.text ? y.lang(e.text) : "<b>Aa</b>") + "</span>");
        case "menu":
        case "menu-check":
        case "menu-radio":
        case "button":
        case "check":
        case "radio":
        case "drop":
          var o = e.arrow === true || e.arrow !== false && [
            "menu",
            "menu-radio",
            "menu-check",
            "drop",
            "color",
            "text-color"
          ].includes(e.type);
          t = `
                    <div id="tb_${this.name}_item_${e.id}" style="${e.hidden ? "display: none" : ""}"
                        class="${i.join(" ")} ${e.class || ""}"
                        ${e.disabled ? "" : `data-click='["click","${e.id}"]'
                               data-mouseenter='["mouseAction", "event", "this", "Enter", "${e.id}"]'
                               data-mouseleave='["mouseAction", "event", "this", "Leave", "${e.id}"]'
                               data-mousedown='["mouseAction", "event", "this", "Down", "${e.id}"]'
                               data-mouseup='["mouseAction", "event", "this", "Up", "${e.id}"]'`}
                    >
                        ${s}
                        ${n != "" ? `<div class="w2ui-tb-text" style="${e.style || ""}">
                                    ${y.lang(n)}
                                    ${e.count != null ? y.stripSpaces(`<span class="w2ui-tb-count">
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
          t = `<div id="tb_${this.name}_item_${e.id}" class="w2ui-tb-html ${i.join(" ")}"
                            style="${e.hidden ? "display: none" : ""}; ${e.style || ""}">
                            ${typeof e.html == "function" ? e.html.call(this, e) : e.html}
                        </div>`;
      }
      return t;
    }
    tooltipShow(e) {
      if (this.tooltip != null) {
        var t = h(this.box).find("#tb_" + this.name + "_item_" + y.escapeId(e)).get(0), e = this.get(e), s = this.tooltip;
        let i = e.tooltip;
        typeof i == "function" && (i = i.call(this, e)), [
          "menu",
          "menu-radio",
          "menu-check",
          "drop",
          "color",
          "text-color"
        ].includes(e.type) && e.checked == 1 || ct.show({
          anchor: t,
          name: this.name + "-tooltip",
          html: i,
          position: s
        });
      }
    }
    tooltipHide(e) {
      this.tooltip != null && ct.hide(this.name + "-tooltip");
    }
    menuClick(e) {
      if (e.item && !e.item.disabled) {
        var t = this.trigger(e.remove !== true ? "click" : "remove", {
          target: e.item.id + ":" + e.subItem.id,
          item: e.item,
          subItem: e.subItem,
          originalEvent: e.originalEvent
        });
        if (t.isCancelled !== true) {
          let i = e.subItem, o = this.get(e.item.id), a = o.items;
          if (typeof a == "function" && (a = o.items()), o.type == "menu" && (o.selected = i.id), o.type == "menu-radio" && (o.selected = i.id, Array.isArray(a) && a.forEach((r) => {
            r.checked === true && delete r.checked, Array.isArray(r.items) && r.items.forEach((c) => {
              c.checked === true && delete c.checked;
            });
          }), i.checked = true), o.type == "menu-check") {
            if (Array.isArray(o.selected) || (o.selected = []), i.group == null) {
              var s = o.selected.indexOf(i.id);
              s == -1 ? (o.selected.push(i.id), i.checked = true) : (o.selected.splice(s, 1), i.checked = false);
            } else if (i.group !== false) {
              let r = [];
              s = o.selected.indexOf(i.id);
              let c = (d) => {
                d.forEach((p) => {
                  var f;
                  p.group === i.group && (f = o.selected.indexOf(p.id)) != -1 && (p.id != i.id && r.push(p.id), o.selected.splice(f, 1)), Array.isArray(p.items) && c(p.items);
                });
              };
              c(a), s == -1 && (o.selected.push(i.id), i.checked = true);
            }
          }
          if (typeof i.route == "string") {
            let r = i.route !== "" ? ("/" + i.route).replace(/\/{2,}/g, "/") : "";
            var n = y.parseRoute(r);
            if (0 < n.keys.length) for (let c = 0; c < n.keys.length; c++) this.routeData[n.keys[c].name] != null && (r = r.replace(new RegExp(":" + n.keys[c].name, "g"), this.routeData[n.keys[c].name]));
            setTimeout(() => {
              window.location.hash = r;
            }, 1);
          }
          this.refresh(e.item.id), t.finish();
        }
      }
    }
    colorClick(e) {
      var t;
      e.item && !e.item.disabled && (t = this.trigger("click", {
        target: e.item.id,
        item: e.item,
        color: e.color,
        final: e.final,
        originalEvent: e.originalEvent
      })).isCancelled !== true && (e.item.color = e.color, this.refresh(e.item.id), t.finish());
    }
    mouseAction(o, t, s, n) {
      var i = this.get(n), o = this.trigger("mouse" + s, {
        target: n,
        item: i,
        object: i,
        originalEvent: o
      });
      if (o.isCancelled !== true && !i.disabled && !i.hidden) {
        switch (s) {
          case "Enter":
            h(t).addClass("over"), this.tooltipShow(n);
            break;
          case "Leave":
            h(t).removeClass("over down"), this.tooltipHide(n);
            break;
          case "Down":
            h(t).addClass("down");
            break;
          case "Up":
            h(t).removeClass("down");
        }
        o.finish();
      }
    }
  };
  vd = class extends cn {
    constructor(e) {
      super(e.name), this.box = null, this.name = null, this.active = null, this.reorder = false, this.flow = "down", this.tooltip = "top|left", this.tabs = [], this.routeData = {}, this.last = {}, this.right = "", this.style = "", this.onClick = null, this.onMouseEnter = null, this.onMouseLeave = null, this.onMouseDown = null, this.onMouseUp = null, this.onClose = null, this.onRender = null, this.onRefresh = null, this.onResize = null, this.onDestroy = null, this.tab_template = {
        id: null,
        text: null,
        route: null,
        hidden: false,
        disabled: false,
        closable: false,
        tooltip: null,
        style: "",
        onClick: null,
        onRefresh: null,
        onClose: null
      };
      var t = e.tabs;
      delete e.tabs, Object.assign(this, e), Array.isArray(t) && this.add(t), e.tabs = t, typeof this.box == "string" && (this.box = h(this.box).get(0)), this.box && this.render(this.box);
    }
    add(e) {
      return this.insert(null, e);
    }
    insert(e, t) {
      Array.isArray(t) || (t = [
        t
      ]);
      let s = [];
      return t.forEach((n) => {
        var i, o;
        n.id == null ? console.log(`ERROR: The parameter "id" is required but not supplied. (obj: ${this.name})`) : y.checkUniqueId(n.id, this.tabs, "tabs", this.name) && (n = Object.assign({}, this.tab_template, n), e == null ? (this.tabs.push(n), s.push(this.animateInsert(null, n))) : (i = this.get(e, true), o = this.tabs[i].id, this.tabs.splice(i, 0, n), s.push(this.animateInsert(o, n))));
      }), Promise.all(s);
    }
    remove() {
      let e = 0;
      return Array.from(arguments).forEach((t) => {
        t = this.get(t), t && (e++, this.tabs.splice(this.get(t.id, true), 1), h(this.box).find(`#tabs_${this.name}_tab_` + y.escapeId(t.id)).remove());
      }), this.resize(), e;
    }
    select(e) {
      return this.active != e && this.get(e) != null && (this.active = e, this.refresh(), true);
    }
    set(e, t) {
      var s = this.get(e, true);
      return s != null && (y.extend(this.tabs[s], t), this.refresh(e), true);
    }
    get(e, t) {
      if (arguments.length === 0) {
        var s = [];
        for (let n = 0; n < this.tabs.length; n++) this.tabs[n].id != null && s.push(this.tabs[n].id);
        return s;
      }
      for (let n = 0; n < this.tabs.length; n++) if (this.tabs[n].id == e) return t === true ? n : this.tabs[n];
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
        let r = function(c, d) {
          c += d;
          let p = a.tabs[c];
          return p = p && p.hidden ? r(c, d) : p;
        }, a = this;
        var t = this.last.moving, i = this.tabs[t.index], s = r(t.index, 1), n = r(t.index, -1), i = h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(i.id));
        if (0 < t.divX && s) {
          var o = h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(s.id));
          let c = parseInt(i.get(0).clientWidth), d = parseInt(o.get(0).clientWidth);
          if (c = c < d ? Math.floor(c / 3) : Math.floor(d / 3), d -= c, t.divX > d) return s = this.tabs.indexOf(s), this.tabs.splice(t.index, 0, this.tabs.splice(s, 1)[0]), t.$tab.before(o.get(0)), t.$tab.css("opacity", 0), void Object.assign(this.last.moving, {
            index: s,
            divX: -c,
            x: e.pageX + c,
            left: t.left + t.divX + c
          });
        }
        if (t.divX < 0 && n) {
          o = h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(n.id));
          let c = parseInt(i.get(0).clientWidth), d = parseInt(o.get(0).clientWidth);
          c = c < d ? Math.floor(c / 3) : Math.floor(d / 3), d -= c, Math.abs(t.divX) > d && (s = this.tabs.indexOf(n), this.tabs.splice(t.index, 0, this.tabs.splice(s, 1)[0]), o.before(t.$tab), t.$tab.css("opacity", 0), Object.assign(t, {
            index: s,
            divX: c,
            x: e.pageX - c,
            left: t.left + t.divX - c
          }));
        }
      }
    }
    mouseAction(e, t, s) {
      var n = this.get(t), i = this.trigger("mouse" + e, {
        target: t,
        tab: n,
        object: n,
        originalEvent: s
      });
      if (i.isCancelled !== true && !n.disabled && !n.hidden) {
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
        i.finish();
      }
    }
    tooltipShow(s) {
      var t = this.get(s), s = h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(s)).get(0);
      if (this.tooltip != null && !t.disabled && !this.last.reordering) {
        var n = this.tooltip;
        let i = t.tooltip;
        typeof i == "function" && (i = i.call(this, t)), ct.show({
          anchor: s,
          name: this.name + "_tooltip",
          html: i,
          position: n
        });
      }
    }
    tooltipHide(e) {
      this.tooltip != null && ct.hide(this.name + "_tooltip");
    }
    getTabHTML(e) {
      if (e = this.get(e, true), e = this.tabs[e], e == null) return false;
      e.text == null && e.caption != null && (e.text = e.caption), e.tooltip == null && e.hint != null && (e.tooltip = e.hint), e.caption != null && console.log("NOTICE: tabs tab.caption property is deprecated, please use tab.text. Tab -> ", e), e.hint != null && console.log("NOTICE: tabs tab.hint property is deprecated, please use tab.tooltip. Tab -> ", e);
      let t = e.text, s = ((t = typeof t == "function" ? t.call(this, e) : t) == null && (t = ""), ""), n = "";
      return e.hidden && (n += "display: none;"), e.disabled && (n += "opacity: 0.2;"), e.closable && !e.disabled && (s = `<div class="w2ui-tab-close w2ui-eaction ${this.active === e.id ? "active" : ""}"
                data-mousedown="stop" data-mouseup="clickClose|${e.id}|event">
            </div>`), `
            <div id="tabs_${this.name}_tab_${e.id}" style="${n} ${e.style}"
                class="w2ui-tab w2ui-eaction ${this.active === e.id ? "active" : ""} ${e.closable ? "closable" : ""} ${e.class || ""}"
                data-mouseenter="mouseAction|Enter|${e.id}|event]"
                data-mouseleave="mouseAction|Leave|${e.id}|event]"
                data-mousedown="mouseAction|Down|${e.id}|event"
                data-mouseup="mouseAction|Up|${e.id}|event"
                data-click="click|${e.id}|event"
               >
                    ${y.lang(t) + s}
            </div>`;
    }
    refresh(e) {
      var t = Date.now(), s = (this.flow == "up" ? h(this.box).addClass("w2ui-tabs-up") : h(this.box).removeClass("w2ui-tabs-up"), this.trigger("refresh", {
        target: e ?? this.name,
        object: this.get(e)
      }));
      if (s.isCancelled !== true) {
        if (e == null) for (let o = 0; o < this.tabs.length; o++) this.refresh(this.tabs[o].id);
        else {
          var n = "#tabs_" + this.name + "_tab_" + y.escapeId(e), i = h(this.box).find(n), e = this.getTabHTML(e);
          i.length === 0 ? h(this.box).find("#tabs_" + this.name + "_right").before(e) : h(this.box).find(".tab-animate-insert").length == 0 && i.replace(e), y.bindEvents(h(this.box).find(n + `, ${n} .w2ui-eaction`), this);
        }
        return h(this.box).find("#tabs_" + this.name + "_right").html(this.right), s.finish(), Date.now() - t;
      }
    }
    render(e) {
      var t = Date.now(), s = (typeof e == "string" && (e = h(e).get(0)), this.trigger("render", {
        target: this.name,
        box: e ?? this.box
      }));
      if (s.isCancelled !== true) return e != null && (0 < h(this.box).find("#tabs_" + this.name + "_right").length && h(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), this.box = e), !!this.box && (e = `
            <div class="w2ui-tabs-line"></div>
            <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                <div id="tabs_${this.name}_right" class="w2ui-tabs-right">${this.right}</div>
            </div>
            <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll","left"]'></div>
            <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll","right"]'></div>`, h(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-tabs").html(e), 0 < h(this.box).length && (h(this.box)[0].style.cssText += this.style), y.bindEvents(h(this.box).find(".w2ui-eaction"), this), this.last.observeResize = new ResizeObserver(() => {
        this.resize();
      }), this.last.observeResize.observe(this.box), s.finish(), this.refresh(), this.resize(), Date.now() - t);
    }
    initReorder(e, t) {
      if (this.reorder) {
        let s = this, n = h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(e)), i = this.get(e, true), o = h(n.get(0).cloneNode(true)), a;
        o.attr("id", "#tabs_" + this.name + "_tab_ghost"), this.last.moving = {
          index: i,
          indexFrom: i,
          $tab: n,
          $ghost: o,
          divX: 0,
          left: n.get(0).getBoundingClientRect().left,
          parentX: h(this.box).get(0).getBoundingClientRect().left,
          x: t.pageX,
          opacity: n.css("opacity")
        }, h(document).off(".w2uiTabReorder").on("mousemove.w2uiTabReorder", function(r) {
          if (!s.last.reordering) {
            if ((a = s.trigger("reorder", {
              target: s.tabs[i].id,
              indexFrom: i,
              tab: s.tabs[i]
            })).isCancelled === true) return;
            ct.hide(this.name + "_tooltip"), s.last.reordering = true, o.addClass("moving"), o.css({
              "pointer-events": "none",
              position: "absolute",
              left: n.get(0).getBoundingClientRect().left
            }), n.css("opacity", 0), h(s.box).find(".w2ui-scroll-wrapper").append(o.get(0)), h(s.box).find(".w2ui-tab-close").hide();
          }
          s.last.moving.divX = r.pageX - s.last.moving.x, o.css("left", s.last.moving.left - s.last.moving.parentX + s.last.moving.divX + "px"), s.dragMove(r);
        }).on("mouseup.w2uiTabReorder", function() {
          h(document).off(".w2uiTabReorder"), o.css({
            transition: "0.1s",
            left: s.last.moving.$tab.get(0).getBoundingClientRect().left - s.last.moving.parentX
          }), h(s.box).find(".w2ui-tab-close").show(), setTimeout(() => {
            o.remove(), n.css({
              opacity: s.last.moving.opacity
            }), s.last.reordering && a.finish({
              indexTo: s.last.moving.index
            }), s.last.reordering = false;
          }, 100);
        });
      }
    }
    scroll(e, t) {
      return new Promise((s, n) => {
        var i = h(this.box).find(".w2ui-scroll-wrapper"), o = i.get(0).scrollLeft, a = i.find(".w2ui-tabs-right").get(0), r = i.parent().get(0).getBoundingClientRect().width, c = o + parseInt(a.offsetLeft) + parseInt(a.clientWidth);
        switch (e) {
          case "left": {
            let d = o - r + 50;
            d <= 0 && (d = 0), i.get(0).scrollTo({
              top: 0,
              left: d,
              behavior: t ? "atuo" : "smooth"
            });
            break;
          }
          case "right": {
            let d = o + r - 50;
            d >= c - r && (d = c - r), i.get(0).scrollTo({
              top: 0,
              left: d,
              behavior: t ? "atuo" : "smooth"
            });
            break;
          }
        }
        setTimeout(() => {
          this.resize(), s();
        }, t ? 0 : 350);
      });
    }
    scrollIntoView(e, t) {
      return new Promise((s, n) => {
        e == null && (e = this.active), this.get(e) != null && (h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(e)).get(0).scrollIntoView({
          block: "start",
          inline: "center",
          behavior: t ? "atuo" : "smooth"
        }), setTimeout(() => {
          this.resize(), s();
        }, t ? 0 : 500));
      });
    }
    resize() {
      var e = Date.now();
      if (this.box != null) {
        var t, s, n, i, o = this.trigger("resize", {
          target: this.name
        });
        if (o.isCancelled !== true) return (t = h(this.box)).find(".w2ui-scroll-left, .w2ui-scroll-right").hide(), s = t.find(".w2ui-scroll-wrapper").get(0), i = t.find(".w2ui-tabs-right"), (n = t.get(0).getBoundingClientRect().width) < (i = 0 < i.length ? i[0].offsetLeft + i[0].clientWidth : 0) && (0 < s.scrollLeft && t.find(".w2ui-scroll-left").show(), n < i - s.scrollLeft) && t.find(".w2ui-scroll-right").show(), o.finish(), Date.now() - e;
      }
    }
    destroy() {
      var _a2;
      var e = this.trigger("destroy", {
        target: this.name
      });
      e.isCancelled !== true && (0 < h(this.box).find("#tabs_" + this.name + "_right").length && h(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-tabs").html(""), (_a2 = this.last.observeResize) == null ? void 0 : _a2.disconnect(), delete Bs[this.name], e.finish());
    }
    click(e, t) {
      var s = this.get(e);
      if (s == null || s.disabled || this.last.reordering) return false;
      if (e = this.trigger("click", {
        target: e,
        tab: s,
        object: s,
        originalEvent: t
      }), e.isCancelled !== true) {
        if (h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(this.active)).removeClass("active"), this.active = s.id, h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(this.active)).addClass("active"), typeof s.route == "string") {
          let i = s.route !== "" ? ("/" + s.route).replace(/\/{2,}/g, "/") : "";
          var n = y.parseRoute(i);
          if (0 < n.keys.length) for (let o = 0; o < n.keys.length; o++) this.routeData[n.keys[o].name] != null && (i = i.replace(new RegExp(":" + n.keys[o].name, "g"), this.routeData[n.keys[o].name]));
          setTimeout(() => {
            window.location.hash = i;
          }, 1);
        }
        e.finish();
      }
    }
    clickClose(e, t) {
      var s = this.get(e);
      if (s == null || s.disabled) return false;
      let n = this.trigger("close", {
        target: e,
        object: s,
        tab: s,
        originalEvent: t
      });
      n.isCancelled !== true && (this.animateClose(e).then(() => {
        this.remove(e), n.finish(), this.refresh();
      }), t) && t.stopPropagation();
    }
    animateClose(e) {
      return new Promise((t, s) => {
        var n = h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(e)), i = parseInt(n.get(0).clientWidth || 0);
        let o = n.replace(`<div class="tab-animate-close" style="display: inline-block; flex-shrink: 0; width: ${i}px; transition: width 0.25s"></div>`);
        setTimeout(() => {
          o.css({
            width: "0px"
          });
        }, 1), setTimeout(() => {
          o.remove(), this.resize(), t();
        }, 500);
      });
    }
    animateInsert(e, t) {
      return new Promise((s, n) => {
        let i = h(this.box).find("#tabs_" + this.name + "_tab_" + y.escapeId(e)), o = h.html(this.getTabHTML(t.id));
        if (i.length == 0) (i = h(this.box).find("#tabs_tabs_right")).before(o), this.resize();
        else {
          o.css({
            opacity: 0
          }), h(this.box).find("#tabs_tabs_right").before(o.get(0));
          let a = h(this.box).find("#" + o.attr("id")).get(0).clientWidth ?? 0, r = h.html('<div class="tab-animate-insert" style="flex-shrink: 0; width: 0; transition: width 0.25s"></div>');
          i.before(r), o.hide(), r.before(o[0]), setTimeout(() => {
            r.css({
              width: a + "px"
            });
          }, 1), setTimeout(() => {
            r.remove(), o.css({
              opacity: 1
            }).show(), this.refresh(t.id), this.resize(), s();
          }, 500);
        }
      });
    }
  };
  _d = class extends cn {
    constructor(e) {
      if (super(e.name), this.name = null, this.box = null, this.columns = [], this.columnGroups = [], this.records = [], this.summary = [], this.searches = [], this.toolbar = {}, this.ranges = [], this.contextMenu = [], this.searchMap = {}, this.searchData = [], this.sortMap = {}, this.sortData = [], this.savedSearches = [], this.defaultSearches = [], this.total = 0, this.recid = null, this.last = {
        field: "",
        label: "",
        logic: "AND",
        search: "",
        searchIds: [],
        selection: {
          indexes: [],
          columns: {}
        },
        saved_sel: null,
        multi: false,
        scrollTop: 0,
        scrollLeft: 0,
        colStart: 0,
        colEnd: 0,
        fetch: {
          action: "",
          offset: null,
          start: 0,
          response: 0,
          options: null,
          controller: null,
          loaded: false,
          hasMore: false
        },
        pull_more: false,
        pull_refresh: true,
        range_start: null,
        range_end: null,
        sel_ind: null,
        sel_col: null,
        sel_type: null,
        sel_recid: null,
        idCache: {},
        move: null,
        cancelClick: null,
        inEditMode: false,
        _edit: null,
        kbd_timer: null,
        marker_timer: null,
        click_time: null,
        click_recid: null,
        bubbleEl: null,
        colResizing: false,
        tmp: null,
        copy_event: null,
        userSelect: "",
        columnDrag: false,
        state: null,
        show_extra: 0,
        toolbar_height: 0
      }, this.header = "", this.url = "", this.limit = 100, this.offset = 0, this.postData = {}, this.routeData = {}, this.httpHeaders = {}, this.show = {
        header: false,
        toolbar: false,
        footer: false,
        columnMenu: true,
        columnHeaders: true,
        lineNumbers: false,
        expandColumn: false,
        selectColumn: false,
        emptyRecords: true,
        toolbarReload: true,
        toolbarColumns: false,
        toolbarSearch: true,
        toolbarAdd: false,
        toolbarEdit: false,
        toolbarDelete: false,
        toolbarSave: false,
        searchAll: true,
        searchLogic: true,
        searchHiddenMsg: false,
        searchSave: true,
        statusRange: true,
        statusBuffered: false,
        statusRecordID: true,
        statusSelection: true,
        statusResponse: true,
        statusSort: false,
        statusSearch: false,
        recordTitles: false,
        selectionBorder: true,
        skipRecords: true,
        saveRestoreState: true
      }, this.stateId = null, this.hasFocus = false, this.autoLoad = true, this.fixedBody = true, this.recordHeight = 32, this.lineNumberWidth = 34, this.keyboard = true, this.selectType = "row", this.liveSearch = false, this.multiSearch = true, this.multiSelect = true, this.multiSort = true, this.reorderColumns = false, this.reorderRows = false, this.showExtraOnSearch = 0, this.markSearch = true, this.columnTooltip = "top|bottom", this.disableCVS = false, this.nestedFields = true, this.vs_start = 150, this.vs_extra = 5, this.style = "", this.tabIndex = null, this.dataType = null, this.parser = null, this.advanceOnEdit = true, this.useLocalStorage = true, this.colTemplate = {
        text: "",
        field: "",
        size: null,
        min: 20,
        max: null,
        gridMinWidth: null,
        sizeCorrected: null,
        sizeCalculated: null,
        sizeOriginal: null,
        sizeType: null,
        hidden: false,
        sortable: false,
        sortMode: null,
        searchable: false,
        resizable: true,
        hideable: true,
        autoResize: null,
        attr: "",
        style: "",
        render: null,
        title: null,
        tooltip: null,
        editable: {},
        frozen: false,
        info: null,
        clipboardCopy: false
      }, this.stateColProps = {
        text: false,
        field: true,
        size: true,
        min: false,
        max: false,
        gridMinWidth: false,
        sizeCorrected: false,
        sizeCalculated: true,
        sizeOriginal: true,
        sizeType: true,
        hidden: true,
        sortable: false,
        sortMode: true,
        searchable: false,
        resizable: false,
        hideable: false,
        autoResize: false,
        attr: false,
        style: false,
        render: false,
        title: false,
        tooltip: false,
        editable: false,
        frozen: true,
        info: false,
        clipboardCopy: false
      }, this.msgDelete = "Are you sure you want to delete ${count} ${records}?", this.msgNotJSON = "Returned data is not in valid JSON format.", this.msgHTTPError = "HTTP error. See console for more details.", this.msgServerError = "Server error", this.msgRefresh = "Refreshing...", this.msgNeedReload = "Your remote data source record count has changed, reloading from the first record.", this.msgEmpty = "", this.buttons = {
        reload: {
          type: "button",
          id: "w2ui-reload",
          icon: "w2ui-icon-reload",
          tooltip: "Reload data in the list"
        },
        columns: {
          type: "menu-check",
          id: "w2ui-column-on-off",
          icon: "w2ui-icon-columns",
          tooltip: "Show/hide columns",
          overlay: {
            align: "none"
          }
        },
        search: {
          type: "html",
          id: "w2ui-search",
          html: '<div class="w2ui-icon w2ui-icon-search w2ui-search-down w2ui-action" data-click="searchShowFields"></div>'
        },
        add: {
          type: "button",
          id: "w2ui-add",
          text: "Add New",
          tooltip: "Add new record",
          icon: "w2ui-icon-plus"
        },
        edit: {
          type: "button",
          id: "w2ui-edit",
          text: "Edit",
          tooltip: "Edit selected record",
          icon: "w2ui-icon-pencil",
          batch: 1,
          disabled: true
        },
        delete: {
          type: "button",
          id: "w2ui-delete",
          text: "Delete",
          tooltip: "Delete selected records",
          icon: "w2ui-icon-cross",
          batch: true,
          disabled: true
        },
        save: {
          type: "button",
          id: "w2ui-save",
          text: "Save",
          tooltip: "Save changed records",
          icon: "w2ui-icon-check"
        }
      }, this.operators = {
        text: [
          "is",
          "begins",
          "contains",
          "ends"
        ],
        number: [
          "=",
          "between",
          ">",
          "<",
          ">=",
          "<="
        ],
        date: [
          "is",
          {
            oper: "less",
            text: "before"
          },
          {
            oper: "more",
            text: "since"
          },
          "between"
        ],
        list: [
          "is"
        ],
        hex: [
          "is",
          "between"
        ],
        color: [
          "is",
          "begins",
          "contains",
          "ends"
        ],
        enum: [
          "in",
          "not in"
        ]
      }, this.defaultOperator = {
        text: "begins",
        number: "=",
        date: "is",
        list: "is",
        enum: "in",
        hex: "begins",
        color: "begins"
      }, this.operatorsMap = {
        text: "text",
        int: "number",
        float: "number",
        money: "number",
        currency: "number",
        percent: "number",
        hex: "hex",
        alphanumeric: "text",
        color: "color",
        date: "date",
        time: "date",
        datetime: "date",
        list: "list",
        combo: "text",
        enum: "enum",
        file: "enum",
        select: "list",
        radio: "list",
        checkbox: "list",
        toggle: "list"
      }, this.onAdd = null, this.onEdit = null, this.onRequest = null, this.onLoad = null, this.onDelete = null, this.onSave = null, this.onSelect = null, this.onClick = null, this.onDblClick = null, this.onContextMenu = null, this.onContextMenuClick = null, this.onColumnClick = null, this.onColumnDblClick = null, this.onColumnContextMenu = null, this.onColumnResize = null, this.onColumnAutoResize = null, this.onSort = null, this.onSearch = null, this.onSearchOpen = null, this.onChange = null, this.onRestore = null, this.onExpand = null, this.onCollapse = null, this.onError = null, this.onKeydown = null, this.onToolbar = null, this.onColumnOnOff = null, this.onCopy = null, this.onPaste = null, this.onSelectionExtend = null, this.onEditField = null, this.onRender = null, this.onRefresh = null, this.onReload = null, this.onResize = null, this.onDestroy = null, this.onStateSave = null, this.onStateRestore = null, this.onFocus = null, this.onBlur = null, this.onReorderRow = null, this.onSearchSave = null, this.onSearchRemove = null, this.onSearchSelect = null, this.onColumnSelect = null, this.onColumnDragStart = null, this.onColumnDragEnd = null, this.onResizerDblClick = null, this.onMouseEnter = null, this.onMouseLeave = null, y.extend(this, e), Array.isArray(this.records)) {
        let t = [];
        this.records.forEach((s, n) => {
          var _a2;
          s[this.recid] != null && (s.recid = s[this.recid]), s.recid == null && console.log("ERROR: Cannot add records without recid. (obj: " + this.name + ")"), ((_a2 = s.w2ui) == null ? void 0 : _a2.summary) === true && (this.summary.push(s), t.push(n));
        }), t.sort();
        for (let s = t.length - 1; 0 <= s; s--) this.records.splice(t[s], 1);
      }
      Array.isArray(this.columns) && this.columns.forEach((t, s) => {
        if (t = y.extend({}, this.colTemplate, t), s = (this.columns[s] = t).searchable, s != null && s !== false && this.getSearch(t.field) == null) if (y.isPlainObject(s)) this.addSearch(y.extend({
          field: t.field,
          label: t.text,
          type: "text"
        }, s));
        else {
          let n = t.searchable, i = "";
          t.searchable === true && (n = "text", i = 'size="20"'), this.addSearch({
            field: t.field,
            label: t.text,
            type: n,
            attr: i
          });
        }
      }), Array.isArray(this.defaultSearches) && this.defaultSearches.forEach((t, s) => {
        t.id = "default-" + s, t.icon ?? (t.icon = "w2ui-icon-search");
      }), e = this.cache("searches"), Array.isArray(e) && e.forEach((t) => {
        this.savedSearches.push({
          id: t.id ?? "none",
          text: t.text ?? "none",
          icon: "w2ui-icon-search",
          remove: true,
          logic: t.logic ?? "AND",
          data: t.data ?? []
        });
      }), typeof this.box == "string" && (this.box = h(this.box).get(0)), this.box && this.render(this.box);
    }
    add(e, t) {
      var _a2, _b;
      Array.isArray(e) || (e = [
        e
      ]);
      let s = 0;
      for (let i = 0; i < e.length; i++) {
        var n = e[i];
        n[this.recid] != null && (n.recid = n[this.recid]), n.recid == null ? console.log("ERROR: Cannot add record without recid. (obj: " + this.name + ")") : (((_a2 = n.w2ui) == null ? void 0 : _a2.summary) === true ? t ? this.summary.unshift(n) : this.summary.push(n) : t ? this.records.unshift(n) : this.records.push(n), s++);
      }
      return (((_b = this.url) == null ? void 0 : _b.get) ?? this.url) || (this.total = this.records.length, this.localSort(false, true), this.localSearch()), this.refresh(), s;
    }
    find(e, t, s) {
      var n, i = [];
      let o = false;
      for (n in e = e ?? {}) String(n).indexOf(".") != -1 && (o = true);
      var a = s ? this.last.range_start : 0;
      let r = s ? this.last.range_end + 1 : this.records.length;
      r > this.records.length && (r = this.records.length);
      for (let d = a; d < r; d++) {
        let p = true;
        for (var c in e) {
          let f = this.records[d][c];
          o && String(c).indexOf(".") != -1 && (f = this.parseField(this.records[d], c)), e[c] == "not-null" ? f != null && f !== "" || (p = false) : e[c] != f && (p = false);
        }
        p && t !== true && i.push(this.records[d].recid), p && t === true && i.push(d);
      }
      return i;
    }
    set(e, t, s) {
      if (typeof e == "object" && e !== null && (s = t, t = e, e = null), e == null) {
        for (let i = 0; i < this.records.length; i++) y.extend(this.records[i], t);
        s !== true && this.refresh();
      } else {
        var n = this.get(e, true);
        if (n == null) return false;
        !this.records[n] || this.records[n].recid != e ? y.extend(this.summary[n], t) : y.extend(this.records[n], t), s !== true && this.refreshRow(e, n);
      }
      return true;
    }
    get(e, t) {
      if (Array.isArray(e)) {
        var s = [];
        for (let o = 0; o < e.length; o++) {
          var n = this.get(e[o], t);
          n !== null && s.push(n);
        }
        return s;
      }
      {
        let o = this.last.idCache;
        o || (this.last.idCache = o = {});
        var i = o[e];
        if (typeof i == "number") {
          if (0 <= i && i < this.records.length && this.records[i].recid == e) return t === true ? i : this.records[i];
          if (0 <= (i = ~i) && i < this.summary.length && this.summary[i].recid == e) return t === true ? i : this.summary[i];
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
      arguments.length == 1 ? (t = e, e = this.columns.length) : (e = typeof e == "string" ? this.getColumn(e, true) : e) == null && (e = this.columns.length), Array.isArray(t) || (t = [
        t
      ]);
      for (let i = 0; i < t.length; i++) {
        var n = y.extend({}, this.colTemplate, t[i]);
        if (this.columns.splice(e, 0, n), t[i].searchable) {
          let o = t[i].searchable, a = "";
          t[i].searchable === true && (o = "text", a = 'size="20"'), this.addSearch({
            field: t[i].field,
            label: t[i].text,
            type: o,
            attr: a
          });
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
        for (let n = 0; n < this.columns.length; n++) s.push(this.columns[n].field);
        return s;
      }
      for (let n = 0; n < this.columns.length; n++) if (this.columns[n].field == e) return t === true ? n : this.columns[n];
      return null;
    }
    updateColumn(e, t) {
      let s = 0;
      return (e = Array.isArray(e) ? e : [
        e
      ]).forEach((n) => {
        this.columns.forEach((i) => {
          if (i.field == n) {
            let o = y.clone(t);
            Object.keys(o).forEach((a) => {
              typeof o[a] == "function" && (o[a] = o[a](i)), i[a] != o[a] && s++;
            }), y.extend(i, o);
          }
        });
      }), 0 < s && this.refresh(), s;
    }
    toggleColumn() {
      return this.updateColumn(Array.from(arguments), {
        hidden(e) {
          return !e.hidden;
        }
      });
    }
    showColumn() {
      return this.updateColumn(Array.from(arguments), {
        hidden: false
      });
    }
    hideColumn() {
      return this.updateColumn(Array.from(arguments), {
        hidden: true
      });
    }
    addSearch(e, t) {
      let s = 0;
      arguments.length == 1 ? (t = e, e = this.searches.length) : (e = typeof e == "string" ? this.getSearch(e, true) : e) == null && (e = this.searches.length), Array.isArray(t) || (t = [
        t
      ]);
      for (let n = 0; n < t.length; n++) this.searches.splice(e, 0, t[n]), e++, s++;
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
        for (let n = 0; n < this.searches.length; n++) s.push(this.searches[n].field);
        return s;
      }
      for (let n = 0; n < this.searches.length; n++) if (this.searches[n].field == e) return t === true ? n : this.searches[n];
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
        let r = function(p) {
          var f;
          return p.w2ui && p.w2ui.parent_recid != null ? p.w2ui._path || ((f = s.get(p.w2ui.parent_recid)) ? r(f).concat(p) : (console.log("ERROR: no parent record: " + p.w2ui.parent_recid), [
            p
          ])) : [
            p
          ];
        }, c = function(p, f) {
          if (p === f) return 0;
          for (let C = 0; C < s.sortData.length; C++) {
            var x = s.sortData[C].field, b = s.sortData[C].field_ || x;
            let _ = p[b], S = f[b];
            if (String(x).indexOf(".") != -1 && (_ = s.parseField(p, b), S = s.parseField(f, b)), b = s.getColumn(x), x = (b && 0 < Object.keys(b.editable).length && (y.isPlainObject(_) && _.text && (_ = _.text), y.isPlainObject(S)) && S.text && (S = S.text), d(_, S, C, s.sortData[C].direction, b.sortMode || "default")), x !== 0) return x;
          }
          return d(p.recid, f.recid, 0, "asc");
        }, d = function(p, f, x, b, C) {
          if (p === f) return 0;
          if ((p == null || p === "") && f != null && f !== "") return 1;
          if (p != null && p !== "" && (f == null || f === "")) return -1;
          if (b = b.toLowerCase() === "asc" ? 1 : -1, typeof p != typeof f) return typeof f < typeof p ? b : -b;
          if (p.constructor.name != f.constructor.name) return p.constructor.name > f.constructor.name ? b : -b;
          p && typeof p == "object" && (p = p.valueOf()), f && typeof f == "object" && (f = f.valueOf());
          var _ = {}.toString;
          switch (p && typeof p == "object" && p.toString != _ && (p = String(p)), f && typeof f == "object" && f.toString != _ && (f = String(f)), typeof p == "string" && (p = p.toLowerCase().trim()), typeof f == "string" && (f = f.toLowerCase().trim()), C) {
            case "natural":
              C = y.naturalCompare;
              break;
            case "i18n":
              C = y.i18nCompare;
          }
          return typeof C == "function" ? C(p, f) * b : f < p ? b : p < f ? -b : 0;
        }, a = Date.now();
        this.selectionSave(), this.prepareData(), t || this.reset();
        for (let p = 0; p < this.sortData.length; p++) {
          var n = this.getColumn(this.sortData[p].field);
          if (!n) return;
          typeof n.render == "string" && ([
            "date",
            "age"
          ].indexOf(n.render.split(":")[0]) != -1 && (this.sortData[p].field_ = n.field + "_"), [
            "time"
          ].indexOf(n.render.split(":")[0]) != -1) && (this.sortData[p].field_ = n.field + "_");
        }
        for (let p = 0; p < s.records.length; p++) {
          var i = s.records[p];
          ((_b = i.w2ui) == null ? void 0 : _b.parent_recid) != null && (i.w2ui._path = r(i));
        }
        this.records.sort((p, f) => {
          if (!(p.w2ui && p.w2ui.parent_recid != null || f.w2ui && f.w2ui.parent_recid != null)) return c(p, f);
          var x = r(p), b = r(f);
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
          this.status(y.lang("Sorting took ${count} seconds", {
            count: a / 1e3
          }));
        }, 10), a;
      }
    }
    localSearch(e) {
      var _a2;
      let t = this;
      var s = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url;
      if (s) console.log("ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.");
      else {
        let i = Date.now(), o = {}.toString, a = {};
        if (this.total = this.records.length, this.last.searchIds = [], this.prepareData(), 0 < this.searchData.length && !s) {
          for (let r = this.total = 0; r < this.records.length; r++) {
            var n = this.records[r];
            if (function c(d) {
              var _a3, _b;
              let p = 0, f, x, b, C, _ = false;
              for (let S = 0; S < t.searchData.length; S++) {
                let A = t.searchData[S], P = t.getSearch(A.field);
                if (A != null) {
                  P == null && (P = {
                    field: A.field,
                    type: A.type
                  });
                  let H = t.parseField(d, P.field);
                  switch (f = H == null || typeof H == "object" && H.toString == o ? "" : String(H).toLowerCase(), A.value != null && (Array.isArray(A.value) ? (x = A.value[0], b = A.value[1]) : x = String(A.value).toLowerCase()), A.operator) {
                    case "=":
                    case "is":
                      t.parseField(d, P.field) == A.value ? p++ : P.type == "date" ? (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.formatDate(C, "yyyy-mm-dd"), x = y.formatDate(y.isDate(x, y.settings.dateFormat, true), "yyyy-mm-dd"), f == x && p++) : P.type == "time" ? (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.formatTime(C, "hh24:mi"), x = y.formatTime(x, "hh24:mi"), f == x && p++) : P.type == "datetime" && (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.formatDateTime(C, "yyyy-mm-dd|hh24:mm:ss"), x = y.formatDateTime(y.isDateTime(x, y.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), f == x) && p++;
                      break;
                    case "between":
                      [
                        "int",
                        "float",
                        "money",
                        "currency",
                        "percent"
                      ].indexOf(P.type) != -1 ? parseFloat(t.parseField(d, P.field)) >= parseFloat(x) && parseFloat(t.parseField(d, P.field)) <= parseFloat(b) && p++ : P.type == "date" ? (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.isDate(C, y.settings.dateFormat, true), x = y.isDate(x, y.settings.dateFormat, true), (b = y.isDate(b, y.settings.dateFormat, true)) != null && (b = new Date(b.getTime() + 864e5)), f >= x && f < b && p++) : P.type == "time" ? (f = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), x = y.isTime(x, true), b = y.isTime(b, true), x = (/* @__PURE__ */ new Date()).setHours(x.hours, x.minutes, x.seconds || 0, 0), b = (/* @__PURE__ */ new Date()).setHours(b.hours, b.minutes, b.seconds || 0, 0), f >= x && f < b && p++) : P.type == "datetime" && (f = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), x = y.isDateTime(x, y.settings.datetimeFormat, true), b = (b = y.isDateTime(b, y.settings.datetimeFormat, true)) && new Date(b.getTime() + 864e5), f >= x) && f < b && p++;
                      break;
                    case "<=":
                      _ = true;
                    case "<":
                    case "less":
                      [
                        "int",
                        "float",
                        "money",
                        "currency",
                        "percent"
                      ].indexOf(P.type) != -1 ? (f = parseFloat(t.parseField(d, P.field)), x = parseFloat(A.value), (f < x || _ && f === x) && p++) : P.type == "date" ? (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.isDate(C, y.settings.dateFormat, true), x = y.isDate(x, y.settings.dateFormat, true), (f < x || _ && f === x) && p++) : P.type == "time" ? (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.formatTime(C, "hh24:mi"), x = y.formatTime(x, "hh24:mi"), (f < x || _ && f === x) && p++) : P.type == "datetime" && (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.formatDateTime(C, "yyyy-mm-dd|hh24:mm:ss"), x = y.formatDateTime(y.isDateTime(x, y.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), f.length == x.length) && (f < x || _ && f === x) && p++;
                      break;
                    case ">=":
                      _ = true;
                    case ">":
                    case "more":
                      [
                        "int",
                        "float",
                        "money",
                        "currency",
                        "percent"
                      ].indexOf(P.type) != -1 ? (f = parseFloat(t.parseField(d, P.field)), x = parseFloat(A.value), (f > x || _ && f === x) && p++) : P.type == "date" ? (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.isDate(C, y.settings.dateFormat, true), x = y.isDate(x, y.settings.dateFormat, true), (f > x || _ && f === x) && p++) : P.type == "time" ? (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.formatTime(C, "hh24:mi"), x = y.formatTime(x, "hh24:mi"), (f > x || _ && f === x) && p++) : P.type == "datetime" && (C = t.parseField(d, P.field + "_") instanceof Date ? t.parseField(d, P.field + "_") : t.parseField(d, P.field), f = y.formatDateTime(C, "yyyy-mm-dd|hh24:mm:ss"), x = y.formatDateTime(y.isDateTime(x, y.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss"), f.length == x.length) && (f > x || _ && f === x) && p++;
                      break;
                    case "in":
                      C = A.value, (C = A.svalue ? A.svalue : C).indexOf(y.isFloat(H) ? parseFloat(H) : H) === -1 && C.indexOf(f) === -1 || p++;
                      break;
                    case "not in":
                      C = A.value, (C = A.svalue ? A.svalue : C).indexOf(y.isFloat(H) ? parseFloat(H) : H) === -1 && C.indexOf(f) === -1 && p++;
                      break;
                    case "begins":
                    case "begins with":
                      f.indexOf(x) === 0 && p++;
                      break;
                    case "contains":
                      0 <= f.indexOf(x) && p++;
                      break;
                    case "null":
                      t.parseField(d, P.field) == null && p++;
                      break;
                    case "not null":
                      t.parseField(d, P.field) != null && p++;
                      break;
                    case "ends":
                    case "ends with":
                      let U = f.lastIndexOf(x);
                      U !== -1 && U == f.length - x.length && p++;
                  }
                }
              }
              if (t.last.logic == "OR" && p !== 0 || t.last.logic == "AND" && p == t.searchData.length) return true;
              if (((_a3 = d.w2ui) == null ? void 0 : _a3.children) && ((_b = d.w2ui) == null ? void 0 : _b.expanded) !== true) for (let S = 0; S < d.w2ui.children.length; S++) {
                let A = d.w2ui.children[S];
                if (c(A)) return true;
              }
              return false;
            }(n)) if ((n == null ? void 0 : n.w2ui) && function c(d) {
              let p = t.get(d, true);
              if (p == null || d == null || a[d] || t.last.searchIds.includes(p)) return;
              a[d] = true;
              let f = t.records[p];
              (f == null ? void 0 : f.w2ui) && c(f.w2ui.parent_recid), t.last.searchIds.push(p);
            }(n.w2ui.parent_recid), 0 < this.showExtraOnSearch) {
              let c = this.showExtraOnSearch, d = this.showExtraOnSearch;
              if (r < c && (c = r), r + d > this.records.length && (d = this.records.length - r), 0 < c) for (let p = r - c; p < r; p++) this.last.searchIds.indexOf(p) < 0 && this.last.searchIds.push(p);
              if (this.last.searchIds.indexOf(r) < 0 && this.last.searchIds.push(r), 0 < d) for (let p = r + 1; p <= r + d; p++) this.last.searchIds.indexOf(p) < 0 && this.last.searchIds.push(p);
            } else this.last.searchIds.push(r);
          }
          this.total = this.last.searchIds.length;
        }
        return i = Date.now() - i, e !== true && this.show.statusSearch && setTimeout(() => {
          this.status(y.lang("Search took ${count} seconds", {
            count: i / 1e3
          }));
        }, 10), i;
      }
    }
    getRangeData(e, t) {
      var s = this.get(e[0].recid, true), n = this.get(e[1].recid, true), i = e[0].column, o = e[1].column, a = [];
      if (i == o) for (let b = s; b <= n; b++) {
        var r = this.records[b], c = r[this.columns[i].field] || null;
        a.push(t !== true ? c : {
          data: c,
          column: i,
          index: b,
          record: r
        });
      }
      else if (s == n) {
        var d = this.records[s];
        for (let b = i; b <= o; b++) {
          var p = d[this.columns[b].field] || null;
          a.push(t !== true ? p : {
            data: p,
            column: b,
            index: s,
            record: d
          });
        }
      } else for (let b = s; b <= n; b++) {
        var f = this.records[b];
        a.push([]);
        for (let C = i; C <= o; C++) {
          var x = f[this.columns[C].field];
          t !== true ? a[a.length - 1].push(x) : a[a.length - 1].push({
            data: x,
            column: C,
            index: b,
            record: f
          });
        }
      }
      return a;
    }
    addRange(e) {
      let t = 0, s, n;
      if (this.selectType != "row") {
        Array.isArray(e) || (e = [
          e
        ]);
        for (let o = 0; o < e.length; o++) {
          if (typeof e[o] != "object" && (e[o] = {
            name: "selection"
          }), e[o].name == "selection") {
            if (this.show.selectionBorder === false) continue;
            var i = this.getSelection();
            if (i.length === 0) {
              this.removeRange("selection");
              continue;
            }
            s = i[0], n = i[i.length - 1];
          } else s = e[o].range[0], n = e[o].range[1];
          if (s) {
            i = {
              name: e[o].name,
              range: [
                {
                  recid: s.recid,
                  column: s.column
                },
                {
                  recid: n.recid,
                  column: n.column
                }
              ],
              style: e[o].style || ""
            };
            let a = false;
            for (let r = 0; r < this.ranges.length; r++) if (this.ranges[r].name == e[o].name) {
              a = r;
              break;
            }
            a !== false ? this.ranges[a] = i : this.ranges.push(i), t++;
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
        h(this.box).find("#grid_" + this.name + "_" + t).remove(), h(this.box).find("#grid_" + this.name + "_f" + t).remove();
        for (let n = this.ranges.length - 1; 0 <= n; n--) this.ranges[n].name == t && (this.ranges.splice(n, 1), e++);
      }
      return e;
    }
    refreshRanges() {
      if (this.ranges.length !== 0) {
        let C = function(S) {
          var A = f.last.move;
          if (A && A.type == "expand") {
            A.divX = S.screenX - A.x, A.divY = S.screenY - A.y;
            let P, H, U = S.target;
            U.tagName.toUpperCase() != "TD" && (U = h(U).closest("td")[0]), (H = h(U).attr("col") != null ? parseInt(h(U).attr("col")) : H) != null && (U = h(U).closest("tr")[0], P = f.records[h(U).attr("index")].recid, A.newRange[1].recid != P || A.newRange[1].column != H) && (S = y.clone(A.newRange), A.newRange = [
              {
                recid: A.recid,
                column: A.column
              },
              {
                recid: P,
                column: H
              }
            ], b.detail && (b.detail.newRange = y.clone(A.newRange), b.detail.originalRange = y.clone(A.originalRange)), (b = f.trigger("selectionExtend", b)).isCancelled === true ? (A.newRange = S, b.detail.newRange = S) : (f.removeRange("grid-selection-expand"), f.addRange({
              name: "grid-selection-expand",
              range: A.newRange,
              style: "background-color: rgba(100,100,100,0.1); border: 2px dotted rgba(100,100,100,0.5);"
            })));
          }
        }, _ = function(S) {
          f.removeRange("grid-selection-expand"), delete f.last.move, h("body").off(".w2ui-" + f.name), b.finish && b.finish();
        }, f = this, x;
        var e = Date.now(), t = h(this.box).find(`#grid_${this.name}_frecords`), s = h(this.box).find(`#grid_${this.name}_records`);
        for (let S = 0; S < this.ranges.length; S++) {
          var n = this.ranges[S], i = n.range[0], o = n.range[1];
          i.index == null && (i.index = this.get(i.recid, true)), o.index == null && (o.index = this.get(o.recid, true));
          let A = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(i.recid) + ' td[col="' + i.column + '"]'), P = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(o.recid) + ' td[col="' + o.column + '"]'), H = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(i.recid) + ' td[col="' + i.column + '"]'), U = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(o.recid) + ' td[col="' + o.column + '"]'), G = o.column;
          i.column < this.last.colStart && o.column > this.last.colStart && (A = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(i.recid) + ' td[col="start"]')), i.column < this.last.colEnd && o.column > this.last.colEnd && (P = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(o.recid) + ' td[col="end"]'), G = '"end"');
          var c = parseInt(h(this.box).find("#grid_" + this.name + "_rec_top").next().attr("index")), d = parseInt(h(this.box).find("#grid_" + this.name + "_rec_bottom").prev().attr("index")), p = parseInt(h(this.box).find("#grid_" + this.name + "_frec_top").next().attr("index")), a = parseInt(h(this.box).find("#grid_" + this.name + "_frec_bottom").prev().attr("index"));
          A.length === 0 && i.index < c && o.index > c && (A = h(this.box).find("#grid_" + this.name + "_rec_top").next().find('td[col="' + i.column + '"]')), P.length === 0 && o.index > d && i.index < d && (P = h(this.box).find("#grid_" + this.name + "_rec_bottom").prev().find('td[col="' + G + '"]')), H.length === 0 && i.index < p && o.index > p && (H = h(this.box).find("#grid_" + this.name + "_frec_top").next().find('td[col="' + i.column + '"]')), U.length === 0 && o.index > a && i.index < a && (U = h(this.box).find("#grid_" + this.name + "_frec_bottom").prev().find('td[col="' + o.column + '"]'));
          var r, c = h(this.box).find("#grid_" + this.name + "_editable").find(".w2ui-input"), d = c.attr("recid"), p = c.attr("column");
          n.name == "selection" && n.range[0].recid == d && n.range[0].column == p || (x = h(this.box).find("#grid_" + this.name + "_f" + n.name), (0 < H.length || 0 < U.length) && (x.length === 0 ? (t.append('<div id="grid_' + this.name + "_f" + n.name + '" class="w2ui-selection" style="' + n.style + '">' + (n.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), x = h(this.box).find("#grid_" + this.name + "_f" + n.name)) : (x.attr("style", n.style), x.find(".w2ui-selection-resizer").show()), U.length === 0 && ((U = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(o.recid) + " td:last-child")).length === 0 && (U = h(this.box).find("#grid_" + this.name + "_frec_bottom td:first-child")), x.css("border-right", "0px"), x.find(".w2ui-selection-resizer").hide()), i.recid != null) && o.recid != null && 0 < H.length && 0 < U.length ? (a = getComputedStyle(U[0]), c = H.prop("offsetTop") - H.prop("scrollTop"), d = H.prop("offsetLeft") + H.prop("scrollLeft"), p = U.prop("offsetTop") - U.prop("scrollTop"), r = U.prop("offsetLeft") + U.prop("scrollLeft"), x.show().css({
            top: (0 < c ? c : 0) + "px",
            left: (0 < d ? d : 0) + "px",
            width: r - d + parseFloat(a.width) + 2 + "px",
            height: p - c + parseFloat(a.height) + 1 + "px"
          })) : x.hide(), x = h(this.box).find("#grid_" + this.name + "_" + n.name), (0 < A.length || 0 < P.length) && (x.length === 0 ? (s.append('<div id="grid_' + this.name + "_" + n.name + '" class="w2ui-selection" style="' + n.style + '">' + (n.name == "selection" ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>"), x = h(this.box).find("#grid_" + this.name + "_" + n.name)) : x.attr("style", n.style), A.length === 0 && (A = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(i.recid) + " td:first-child")).length === 0 && (A = h(this.box).find("#grid_" + this.name + "_rec_top td:first-child")), U.length !== 0 && x.css("border-left", "0px"), i.recid != null) && o.recid != null && 0 < A.length && 0 < P.length ? (r = getComputedStyle(P[0]), d = A.prop("offsetTop") - A.prop("scrollTop"), p = A.prop("offsetLeft") + A.prop("scrollLeft"), c = P.prop("offsetTop") - P.prop("scrollTop"), a = P.prop("offsetLeft") + P.prop("scrollLeft"), x.show().css({
            top: (0 < d ? d : 0) + "px",
            left: (0 < p ? p : 0) + "px",
            width: a - p + parseFloat(r.width) + 2 + "px",
            height: c - d + parseFloat(r.height) + 1 + "px"
          })) : x.hide());
        }
        h(this.box).find(".w2ui-selection-resizer").off(".resizer").on("mousedown.resizer", function(S) {
          var A = f.getSelection();
          f.last.move = {
            type: "expand",
            x: S.screenX,
            y: S.screenY,
            divX: 0,
            divY: 0,
            recid: A[0].recid,
            column: A[0].column,
            originalRange: [
              y.clone(A[0]),
              y.clone(A[A.length - 1])
            ],
            newRange: [
              y.clone(A[0]),
              y.clone(A[A.length - 1])
            ]
          }, h("body").off(".w2ui-" + f.name).on("mousemove.w2ui-" + f.name, C).on("mouseup.w2ui-" + f.name, _), S.preventDefault();
        }).on("dblclick.resizer", (S) => {
          S = this.trigger("resizerDblClick", {
            target: this.name,
            originalEvent: S
          }), S.isCancelled !== true && S.finish();
        });
        let b = {
          target: this.name,
          originalRange: null,
          newRange: null
        };
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
      var n = {
        target: this.name
      }, n = (s.length == 1 ? (n.multiple = false, y.isPlainObject(s[0]) ? n.clicked = {
        recid: s[0].recid,
        column: s[0].column
      } : n.recid = s[0]) : (n.multiple = true, n.clicked = {
        recids: s
      }), this.trigger("select", n));
      if (n.isCancelled === true) return 0;
      if (this.selectType == "row") for (let S = 0; S < s.length; S++) {
        var i = typeof s[S] == "object" ? s[S].recid : s[S], o = this.get(i, true);
        if (o != null) {
          let A = null, P = null;
          (this.searchData.length !== 0 || o + 1 >= this.last.range_start && o + 1 <= this.last.range_end) && (A = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(i)), P = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(i))), this.selectType == "row" && t.indexes.indexOf(o) == -1 && (t.indexes.push(o), A && P && (A.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), P.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), A.find(".w2ui-grid-select-check").prop("checked", true)), e++);
        }
      }
      else {
        var a = {};
        for (let S = 0; S < s.length; S++) {
          var r = typeof s[S] == "object" ? s[S].recid : s[S], c = typeof s[S] == "object" ? s[S].column : null;
          if (a[r] = a[r] || [], Array.isArray(c)) a[r] = c;
          else if (y.isInt(c)) a[r].push(c);
          else for (let A = 0; A < this.columns.length; A++) this.columns[A].hidden || a[r].push(parseInt(A));
        }
        var d, p = [];
        for (d in a) {
          var f = this.get(d, true);
          if (f != null) {
            let S = null, A = null;
            f + 1 >= this.last.range_start && f + 1 <= this.last.range_end && (S = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(d)), A = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(d)));
            var x = t.columns[f] || [];
            t.indexes.indexOf(f) == -1 && t.indexes.push(f);
            for (let P = 0; P < a[d].length; P++) x.indexOf(a[d][P]) == -1 && x.push(a[d][P]);
            x.sort((P, H) => P - H);
            for (let P = 0; P < a[d].length; P++) {
              var b = a[d][P];
              p.indexOf(b) == -1 && p.push(b), S && (S.find("#grid_" + this.name + "_data_" + f + "_" + b).addClass("w2ui-selected"), S.find(".w2ui-col-number").addClass("w2ui-row-selected"), S.find(".w2ui-grid-select-check").prop("checked", true)), A && (A.find("#grid_" + this.name + "_data_" + f + "_" + b).addClass("w2ui-selected"), A.find(".w2ui-col-number").addClass("w2ui-row-selected"), A.find(".w2ui-grid-select-check").prop("checked", true)), e++;
            }
            t.columns[f] = x;
          }
        }
        for (let S = 0; S < p.length; S++) h(this.box).find("#grid_" + this.name + "_column_" + p[S] + " .w2ui-col-header").addClass("w2ui-col-selected");
      }
      t.indexes.sort((S, A) => S - A);
      var C = 0 < this.records.length && t.indexes.length == this.records.length, _ = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
      return C || _ ? h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, C), n.finish(), e;
    }
    unselect() {
      let e = 0;
      var t = this.last.selection;
      let s = Array.from(arguments);
      Array.isArray(s[0]) && (s = s[0]);
      var n = {
        target: this.name
      }, n = (s.length == 1 ? (n.multiple = false, y.isPlainObject(s[0]) ? n.clicked = {
        recid: s[0].recid,
        column: s[0].column
      } : n.clicked = {
        recid: s[0]
      }) : (n.multiple = true, n.recids = s), this.trigger("select", n));
      if (n.isCancelled === true) return 0;
      for (let b = 0; b < s.length; b++) {
        var i = typeof s[b] == "object" ? s[b].recid : s[b], o = this.get(i);
        if (o != null) {
          var o = this.get(o.recid, true), a = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(i)), r = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(i));
          if (this.selectType == "row") t.indexes.indexOf(o) != -1 && (t.indexes.splice(t.indexes.indexOf(o), 1), a.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), r.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), a.length != 0 && (a[0].style.cssText = "height: " + this.recordHeight + "px; " + a.attr("custom_style"), r[0].style.cssText = "height: " + this.recordHeight + "px; " + r.attr("custom_style")), a.find(".w2ui-grid-select-check").prop("checked", false), e++);
          else {
            var c = s[b].column;
            if (!y.isInt(c)) {
              var d = [];
              for (let _ = 0; _ < this.columns.length; _++) this.columns[_].hidden || d.push({
                recid: i,
                column: _
              });
              return this.unselect(d);
            }
            if (r = t.columns[o], Array.isArray(r) && r.indexOf(c) != -1) {
              r.splice(r.indexOf(c), 1), h(this.box).find(`#grid_${this.name}_rec_${y.escapeId(i)} > td[col="${c}"]`).removeClass("w2ui-selected w2ui-inactive"), h(this.box).find(`#grid_${this.name}_frec_${y.escapeId(i)} > td[col="${c}"]`).removeClass("w2ui-selected w2ui-inactive");
              let _ = false, S = false;
              var p = this.getSelection();
              for (let A = 0; A < p.length; A++) p[A].column == c && (_ = true), p[A].recid == i && (S = true);
              _ || h(this.box).find(`.w2ui-grid-columns td[col="${c}"] .w2ui-col-header, .w2ui-grid-fcolumns td[col="${c}"] .w2ui-col-header`).removeClass("w2ui-col-selected"), S || h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(i)).find(".w2ui-col-number").removeClass("w2ui-row-selected"), e++, r.length === 0 && (delete t.columns[o], t.indexes.splice(t.indexes.indexOf(o), 1), a.find(".w2ui-grid-select-check").prop("checked", false));
            }
          }
        }
      }
      var f = 0 < this.records.length && t.indexes.length == this.records.length, x = 0 < t.indexes.length && this.searchData.length !== 0 && t.indexes.length == this.last.searchIds.length;
      return f || x ? h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.addRange("selection"), this.updateToolbar(t, f), n.finish(), e;
    }
    selectAll() {
      var _a2;
      var e = Date.now();
      if (this.multiSelect !== false) {
        var t = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url;
        let n = y.clone(this.last.selection);
        var s = [];
        for (let i = 0; i < this.columns.length; i++) s.push(i);
        if (n.indexes = [], t || this.searchData.length === 0) {
          let i = this.records.length;
          this.searchData.length == 0 || t || (i = this.last.searchIds.length);
          for (let o = 0; o < i; o++) n.indexes.push(o), this.selectType != "row" && (n.columns[o] = s.slice());
        } else for (let i = 0; i < this.last.searchIds.length; i++) n.indexes.push(this.last.searchIds[i]), this.selectType != "row" && (n.columns[this.last.searchIds[i]] = s.slice());
        if (t = this.trigger("select", {
          target: this.name,
          multiple: true,
          all: true,
          clicked: n
        }), t.isCancelled !== true) return this.last.selection = n, this.selectType == "row" ? (h(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected"), h(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected")) : (h(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").addClass("w2ui-col-selected"), h(this.box).find(".w2ui-grid-records tr .w2ui-col-number").addClass("w2ui-row-selected"), h(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected"), h(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").addClass("w2ui-row-selected"), h(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected")), h(this.box).find("input.w2ui-grid-select-check").prop("checked", true), n = this.getSelection(true), this.addRange("selection"), h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true), this.status(), this.updateToolbar({
          indexes: n
        }, true), t.finish(), Date.now() - e;
      }
    }
    selectNone(e) {
      var t, s = Date.now();
      let n;
      if (e || (n = this.trigger("select", {
        target: this.name,
        clicked: []
      })).isCancelled !== true) return t = this.last.selection, this.selectType == "row" ? (h(this.box).find(".w2ui-grid-records tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected"), h(this.box).find(".w2ui-grid-frecords tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected")) : (h(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").removeClass("w2ui-col-selected"), h(this.box).find(".w2ui-grid-records tr .w2ui-col-number").removeClass("w2ui-row-selected"), h(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").removeClass("w2ui-row-selected"), h(this.box).find(".w2ui-grid-data.w2ui-selected").removeClass("w2ui-selected w2ui-inactive")), h(this.box).find("input.w2ui-grid-select-check").prop("checked", false), t.indexes = [], t.columns = {}, this.removeRange("selection"), h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.updateToolbar(t, false), e || n.finish(), Date.now() - s;
    }
    updateToolbar(e) {
      let t = this, s = e && e.indexes ? e.indexes.length : 0;
      function n(i, o) {
        if (i.batch != null) {
          let a = false;
          i.batch === true ? 0 < s && (a = true) : typeof i.batch == "number" ? s === i.batch && (a = true) : typeof i.batch == "function" && (a = i.batch({
            cnt: s,
            sel: e
          })), a ? t.toolbar.enable(o + i.id) : t.toolbar.disable(o + i.id);
        }
      }
      this.toolbar.items.forEach((i) => {
        n(i, ""), Array.isArray(i.items) && i.items.forEach((o) => {
          n(o, i.id + ":");
        });
      }), this.show.toolbarSave && (0 < this.getChanges().length ? this.toolbar.enable("w2ui-save") : this.toolbar.disable("w2ui-save"));
    }
    getSelection(e) {
      var t = [], s = this.last.selection;
      if (this.selectType == "row") for (let i = 0; i < s.indexes.length; i++) this.records[s.indexes[i]] && t.push(e === true ? s.indexes[i] : this.records[s.indexes[i]].recid);
      else for (let i = 0; i < s.indexes.length; i++) {
        var n = s.columns[s.indexes[i]];
        if (this.records[s.indexes[i]]) for (let o = 0; o < n.length; o++) t.push({
          recid: this.records[s.indexes[i]].recid,
          index: parseInt(s.indexes[i]),
          column: n[o]
        });
      }
      return t;
    }
    search(e, t) {
      var _a2;
      var s = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url, n = [];
      let i = this.last.multi, o = this.last.logic, a = this.last.field, r = this.last.search, c = false;
      var d = h(`#w2overlay-${this.name}-search-overlay`);
      for (let D = 0; D < this.searches.length; D++) this.searches[D].hidden && this.searches[D].value != null && (n.push({
        field: this.searches[D].field,
        operator: this.searches[D].operator || "is",
        type: this.searches[D].type,
        value: this.searches[D].value || ""
      }), c = true);
      if (arguments.length === 0 && d.length === 0 && (t = this.multiSearch ? (e = this.searchData, this.last.logic) : (e = this.last.field, this.last.search)), arguments.length === 0 && d.length !== 0) {
        this.focus(), o = d.find(`#grid_${this.name}_logic`).val(), r = "";
        for (let D = 0; D < this.searches.length; D++) {
          var p = this.searches[D], f = d.find("#grid_" + this.name + "_operator_" + D).val(), x = d.find("#grid_" + this.name + "_field_" + D), b = d.find("#grid_" + this.name + "_field2_" + D);
          let R = x.val(), X = b.val(), Q = null, re = null;
          if ([
            "int",
            "float",
            "money",
            "currency",
            "percent"
          ].indexOf(p.type) != -1 && (C = x[0]._w2field, b = b[0]._w2field, C && (R = C.clean(R)), b) && (X = b.clean(X)), [
            "list",
            "enum"
          ].indexOf(p.type) != -1 || [
            "in",
            "not in"
          ].indexOf(f) != -1) if (R = x[0]._w2field.selected || {}, Array.isArray(R)) {
            Q = [];
            for (let ue = 0; ue < R.length; ue++) Q.push(y.isFloat(R[ue].id) ? parseFloat(R[ue].id) : String(R[ue].id).toLowerCase()), delete R[ue].hidden;
            Object.keys(R).length === 0 && (R = "");
          } else re = R.text || "", R = R.id || "";
          if (R !== "" && R != null || X != null && X !== "") {
            var C = {
              field: p.field,
              type: p.type,
              operator: f
            };
            f == "between" ? y.extend(C, {
              value: [
                R,
                X
              ]
            }) : f == "in" && typeof R == "string" || f == "not in" && typeof R == "string" ? y.extend(C, {
              value: R.split(",")
            }) : y.extend(C, {
              value: R
            }), Q && y.extend(C, {
              svalue: Q
            }), re && y.extend(C, {
              text: re
            });
            try {
              p.type == "date" && f == "between" && (C.value[0] = R, C.value[1] = X), p.type == "date" && f == "is" && (C.value = R);
            } catch {
            }
            n.push(C), i = true;
          }
        }
      }
      if (typeof e == "string" && (arguments.length == 1 && (t = e, e = "all"), a = e, r = t, i = false, o = c ? "AND" : "OR", t != null)) if (e.toLowerCase() == "all") if (0 < this.searches.length) for (let D = 0; D < this.searches.length; D++) {
        var _, S = this.searches[D];
        if ((S.type == "text" || S.type == "alphanumeric" && y.isAlphaNumeric(t) || S.type == "int" && y.isInt(t) || S.type == "float" && y.isFloat(t) || S.type == "percent" && y.isFloat(t) || (S.type == "hex" || S.type == "color") && y.isHex(t) || S.type == "currency" && y.isMoney(t) || S.type == "money" && y.isMoney(t) || S.type == "date" && y.isDate(t) || S.type == "time" && y.isTime(t) || S.type == "datetime" && y.isDateTime(t) || S.type == "datetime" && y.isDate(t) || S.type == "enum" && y.isAlphaNumeric(t) || S.type == "list" && y.isAlphaNumeric(t)) && (_ = this.defaultOperator[this.operatorsMap[S.type]], _ = {
          field: S.field,
          type: S.type,
          operator: S.operator != null ? S.operator : _,
          value: t
        }, String(t).trim() != "") && n.push(_), [
          "int",
          "float",
          "money",
          "currency",
          "percent"
        ].indexOf(S.type) != -1 && String(t).trim().split("-").length == 2 && (_ = String(t).trim().split("-"), A = {
          field: S.field,
          type: S.type,
          operator: S.operator != null ? S.operator : "between",
          value: [
            _[0],
            _[1]
          ]
        }, n.push(A)), [
          "list",
          "enum"
        ].indexOf(S.type) != -1) {
          var A, P = [];
          S.options == null && (S.options = {}), Array.isArray(S.options.items) || (S.options.items = []);
          for (let R = 0; R < S.options.items; R++) {
            var H = S.options.items[R];
            try {
              var U = new RegExp(t, "i");
              U.test(H) && P.push(R), H.text && U.test(H.text) && P.push(H.id);
            } catch {
            }
          }
          0 < P.length && (A = {
            field: S.field,
            type: S.type,
            operator: S.operator != null ? S.operator : "in",
            value: P
          }, n.push(A));
        }
      }
      else for (let D = 0; D < this.columns.length; D++) {
        var G = {
          field: this.columns[D].field,
          type: "text",
          operator: this.defaultOperator.text,
          value: t
        };
        n.push(G);
      }
      else {
        var W = d.find("#grid_" + this.name + "_search_all");
        let D = this.getSearch(e);
        if ((D = D ?? {
          field: e,
          type: "text"
        }).field == e && (this.last.label = D.label), t !== "") {
          let R = this.defaultOperator[this.operatorsMap[D.type]], X = t;
          if ([
            "date",
            "time",
            "datetime"
          ].indexOf(D.type) != -1 && (R = "is"), [
            "list",
            "enum"
          ].indexOf(D.type) != -1 && (R = "is", W = W._w2field.get(), X = W && 0 < Object.keys(W).length ? W.id : ""), D.type == "int" && t !== "" && (R = "is", String(t).indexOf("-") != -1 && (W = t.split("-")).length == 2 && (R = "between", X = [
            parseInt(W[0]),
            parseInt(W[1])
          ]), String(t).indexOf(",") != -1)) {
            var V = t.split(",");
            R = "in", X = [];
            for (let Q = 0; Q < V.length; Q++) X.push(V[Q]);
          }
          D.operator != null && (R = D.operator), W = {
            field: D.field,
            type: D.type,
            operator: R,
            value: X
          }, n.push(W);
        }
      }
      if (Array.isArray(e)) {
        let D = "AND";
        typeof t == "string" && (D = t.toUpperCase()) != "OR" && D != "AND" && (D = "AND"), r = "", i = true, o = D;
        for (let R = 0; R < e.length; R++) {
          var q = e[R];
          typeof q.value == "number" && q.operator == null && (q.operator = this.defaultOperator.number), typeof q.value == "string" && q.operator == null && (q.operator = this.defaultOperator.text), Array.isArray(q.value) && q.operator == null && (q.operator = this.defaultOperator.enum), y.isDate(q.value) && q.operator == null && (q.operator = this.defaultOperator.date), n.push(q);
        }
      }
      W = this.trigger("search", {
        target: this.name,
        multi: arguments.length === 0,
        searchField: e || "multi",
        searchValue: e ? t : "multi",
        searchData: n,
        searchLogic: o
      }), W.isCancelled !== true && (this.searchData = W.detail.searchData, this.last.field = a, this.last.search = r, this.last.multi = i, this.last.logic = W.detail.searchLogic, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), s ? (this.last.fetch.offset = 0, this.reload()) : (this.localSearch(), this.refresh()), W.finish());
    }
    searchOpen() {
      if (this.box && this.searches.length !== 0) {
        let e = this.trigger("searchOpen", {
          target: this.name
        });
        if (e.isCancelled !== true) {
          let t = h(this.toolbar.box).find(".w2ui-grid-search-input .w2ui-search-drop");
          t.addClass("checked"), ct.show({
            name: this.name + "-search-overlay",
            anchor: h(this.box).find("#grid_" + this.name + "_search_all").get(0),
            position: "bottom|top",
            html: this.getSearchesHTML(),
            align: "left",
            arrowSize: 12,
            class: "w2ui-grid-search-advanced",
            hideOn: [
              "doc-click"
            ]
          }).then((s) => {
            this.initSearches(), this.last.search_opened = true;
            let n = h(`#w2overlay-${this.name}-search-overlay`);
            n.data("gridName", this.name).off(".grid-search").on("click.grid-search", () => {
              n.find("input, select").each((o) => {
                o = h(o).data("tooltipName"), o && o.forEach((a) => {
                  ct.hide(a);
                });
              });
            }), y.bindEvents(n.find("select, input, button"), this);
            var i = h(`#w2overlay-${this.name}-search-overlay *[rel=search]`);
            0 < i.length && i[0].focus(), e.finish();
          }).hide((s) => {
            t.removeClass("checked"), this.last.search_opened = false;
          });
        }
      }
    }
    searchClose() {
      ct.hide(this.name + "-search-overlay");
    }
    searchFieldTooltip(n, t, s) {
      var n = this.searches[n], i = this.searchData[t];
      let o = i.operator, a = ((o = o == "more" && i.type == "date" ? "since" : o) == "less" && i.type == "date" && (o = "before"), ""), r = i.value;
      Array.isArray(i.value) ? (i.value.forEach((c) => {
        a += `<span class="value">${c.text || c}</span>`;
      }), i.type == "date" && (a = "", i.value.forEach((c) => {
        a += `<span class="value">${y.formatDate(c)}</span>`;
      }))) : i.type == "date" && (r = y.formatDateTime(r)), ct.hide(this.name + "-search-props"), ct.show({
        name: this.name + "-search-props",
        anchor: s,
        class: "w2ui-white",
        hideOn: "doc-click",
        html: `
                <div class="w2ui-grid-search-single">
                    <span class="field">${n.label}</span>
                    <span class="operator">${y.lang(o)}</span>
                    ${Array.isArray(i.value) ? "" + a : `<span class="value">${r}</span>`}
                    <div class="buttons">
                        <button id="remove" class="w2ui-btn">${y.lang("Remove This Field")}</button>
                    </div>
                </div>`
      }).then((c) => {
        h(c.detail.overlay.box).find("#remove").on("click", () => {
          this.searchData.splice("" + t, 1), this.reload(), this.localSearch(), ct.hide(this.name + "-search-props");
        });
      });
    }
    searchSuggest(e, t, s) {
      var _a2, _b;
      clearTimeout(this.last.kbd_timer), clearTimeout(this.last.overlay_timer), this.searchShowFields(true), this.searchClose(), t === true ? ct.hide(this.name + "-search-suggest") : 0 < h(`#w2overlay-${this.name}-search-suggest`).length || (e ? (t = h(this.box).find(`#grid_${this.name}_search_all`).get(0), e = [
        ...this.defaultSearches ?? [],
        ...0 < ((_a2 = this.defaultSearches) == null ? void 0 : _a2.length) && 0 < ((_b = this.savedSearches) == null ? void 0 : _b.length) ? [
          "--"
        ] : [],
        ...this.savedSearches ?? []
      ], Array.isArray(e) && 0 < e.length && Jt.show({
        name: this.name + "-search-suggest",
        anchor: t,
        align: "both",
        items: e,
        hideOn: [
          "doc-click",
          "sleect",
          "remove"
        ],
        render(n) {
          let i = n.text;
          return i = n.isDefault ? `<b>${i}</b>` : i;
        }
      }).select((n) => {
        var i = this.trigger("searchSelect", {
          target: this.name,
          index: n.detail.index,
          item: n.detail.item
        });
        i.isCancelled === true ? n.preventDefault() : (n.detail.overlay.hide(), this.last.logic = n.detail.item.logic || "AND", this.last.search = "", this.last.label = "[Multiple Fields]", this.searchData = y.clone(n.detail.item.data), this.searchSelected = y.clone(n.detail.item, {
          exclude: [
            "icon",
            "remove"
          ]
        }), this.reload(), i.finish());
      }).remove((n) => {
        let i = n.detail.item, o = this.trigger("searchRemove", {
          target: this.name,
          index: n.detail.index,
          item: i
        });
        o.isCancelled === true ? n.preventDefault() : (n.detail.overlay.hide(), this.confirm(y.lang('Do you want to delete search "${item}"?', {
          item: i.text
        })).yes((a) => {
          var r = this.savedSearches.findIndex((c) => c.id == i.id);
          r !== -1 && this.savedSearches.splice(r, 1), this.cacheSave("searches", this.savedSearches.map((c) => y.clone(c, {
            exclude: [
              "remove",
              "icon"
            ]
          }))), a.detail.self.close(), o.finish();
        }).no((a) => {
          a.detail.self.close();
        }));
      })) : this.last.overlay_timer = setTimeout(() => {
        this.searchSuggest(true);
      }, 100));
    }
    searchSave() {
      let e = "", t = (this.searchSelected && (e = this.searchSelected.text), this.savedSearches.findIndex((n) => {
        var _a2;
        return n.id == ((_a2 = this.searchSelected) == null ? void 0 : _a2.id);
      })), s = this.trigger("searchSave", {
        target: this.name,
        saveLocalStorage: true
      });
      s.isCancelled !== true && this.message({
        width: 350,
        height: 150,
        body: `<div class="w2ui-grid-save-search">
                        <span>${y.lang(t != -1 ? "Update Search" : "Save New Search")}</span>
                        <input class="search-name w2ui-input" placeholder="${y.lang("Search name")}">
                   </div>`,
        buttons: `
                <button id="grid-search-cancel" class="w2ui-btn">${y.lang("Cancel")}</button>
                <button id="grid-search-save" class="w2ui-btn w2ui-btn-blue" ${String(e).trim() == "" ? "disabled" : ""}>${y.lang("Save")}</button>
            `
      }).open(async (n) => {
        h(n.detail.box).find("input, button").eq(0).val(e), await n.complete, h(n.detail.box).find("#grid-search-cancel").on("click", () => {
          this.message();
        }), h(n.detail.box).find("#grid-search-save").on("click", () => {
          var i = h(n.detail.box).find(".w2ui-message .search-name").val();
          this.searchSelected && t != -1 ? Object.assign(this.savedSearches[t], {
            id: i,
            text: i,
            logic: this.last.logic,
            data: y.clone(this.searchData)
          }) : this.savedSearches.push({
            id: i,
            text: i,
            icon: "w2ui-icon-search",
            remove: true,
            logic: this.last.logic,
            data: this.searchData
          }), this.cacheSave("searches", this.savedSearches.map((o) => y.clone(o, {
            exclude: [
              "remove",
              "icon"
            ]
          }))), this.message(), (this.searchSelected ? (this.searchSelected.text = i, h(this.box).find(`#grid_${this.name}_search_name .name-text`)) : (this.searchSelected = {
            text: i,
            logic: this.last.logic,
            data: y.clone(this.searchData)
          }, h(n.detail.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), h(n.detail.box).find(`#grid_${this.name}_search_name`).show().find(".name-text"))).html(i), s.finish({
            name: i
          });
        }), h(n.detail.box).find("input, button").off(".message").on("keydown.message", (i) => {
          var o = String(h(n.detail.box).find(".w2ui-message-body input").val()).trim();
          i.keyCode == 13 && o != "" && h(n.detail.box).find("#grid-search-save").trigger("click"), i.keyCode == 27 && this.message();
        }).eq(0).on("input.message", (i) => {
          var o = h(n.detail.box).closest(".w2ui-message").find("#grid-search-save");
          String(h(n.detail.box).val()).trim() === "" ? o.prop("disabled", true) : o.prop("disabled", false);
        }).get(0).focus();
      });
    }
    cache(e) {
      var _a2;
      if (y.hasLocalStorage && this.useLocalStorage) try {
        var t = JSON.parse(localStorage.w2ui || "{}");
        return t[_a2 = this.stateId || this.name] ?? (t[_a2] = {}), t[this.stateId || this.name][e];
      } catch {
      }
      return null;
    }
    cacheSave(e, t) {
      var _a2;
      if (y.hasLocalStorage && this.useLocalStorage) try {
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
      for (let o = 0; o < this.searches.length; o++) this.searches[o].hidden && this.searches[o].value != null && (t.push({
        field: this.searches[o].field,
        operator: this.searches[o].operator || "is",
        type: this.searches[o].type,
        value: this.searches[o].value || ""
      }), s = true);
      var n = this.trigger("search", {
        reset: true,
        target: this.name,
        searchData: t
      });
      if (n.isCancelled !== true) {
        var i = h(this.box).find("#grid_" + this.name + "_search_all");
        if (this.searchData = n.detail.searchData, this.searchSelected = null, this.last.search = "", this.last.logic = s ? "AND" : "OR", i.next().hide(), 0 < this.searches.length) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields", i.next().show();
        else {
          let o = 0;
          for (; o < this.searches.length && (this.searches[o].hidden || this.searches[o].simple === false); ) o++;
          o >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[o].field, this.last.label = this.searches[o].label);
        }
        this.last.multi = false, this.last.fetch.offset = 0, this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.selection.indexes = [], this.last.selection.columns = {}, this.searchClose(), i = i.val("").get(0), (i == null ? void 0 : i._w2field) && i._w2field.reset(), e || this.reload(), n.finish();
      }
    }
    searchShowFields(e) {
      if (e === true) ct.hide(this.name + "-search-fields");
      else {
        var t = [];
        for (let n = -1; n < this.searches.length; n++) {
          let i = this.searches[n];
          var s = i ? i.field : null, s = this.getColumn(s);
          let o = false, a = null;
          if (this.show.searchHiddenMsg == 1 && n != -1 && (s == null || s.hidden === true && s.hideable !== false) && (o = true, a = y.lang("This column " + (s == null ? "does not exist" : "is hidden"))), n == -1) {
            if (!this.multiSearch || !this.show.searchAll) continue;
            i = {
              field: "all",
              label: "All Fields"
            };
          } else if (s != null && s.hideable === false || i.hidden === true && (a = y.lang("This column is hidden"), i.simple === false)) continue;
          i.label == null && i.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", i), i.label = i.caption), t.push({
            id: i.field,
            text: y.lang(i.label),
            search: i,
            tooltip: a,
            disabled: o,
            checked: i.field == this.last.field
          });
        }
        Jt.show({
          type: "radio",
          name: this.name + "-search-fields",
          anchor: h(this.box).find("#grid_" + this.name + "_search_name").parent().find(".w2ui-search-down").get(0),
          items: t,
          align: "none",
          hideOn: [
            "doc-click",
            "select"
          ]
        }).select((n) => {
          this.searchInitInput(n.detail.item.search.field);
        });
      }
    }
    searchInitInput(e, t) {
      let s;
      var n = h(this.box).find("#grid_" + this.name + "_search_all");
      if (e == "all") s = {
        field: "all",
        label: y.lang("All Fields")
      };
      else if ((s = this.getSearch(e)) == null) return;
      this.last.search != "" ? (this.last.label = s.label, this.search(s.field, this.last.search)) : (this.last.field = s.field, this.last.label = s.label), n.attr("placeholder", y.lang("Search") + " " + y.lang(s.label || s.caption || s.field, true));
    }
    clear(e) {
      this.total = 0, this.records = [], this.summary = [], this.last.fetch.offset = 0, this.last.idCache = {}, this.last.selection = {
        indexes: [],
        columns: {}
      }, this.reset(true), e || this.refresh();
    }
    reset(e) {
      this.last.scrollTop = 0, this.last.scrollLeft = 0, this.last.range_start = null, this.last.range_end = null, h(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), e || this.refresh();
    }
    skip(e, t) {
      var _a2;
      ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url ? (this.offset = parseInt(e), this.offset > this.total && (this.offset = this.total - this.limit), (this.offset < 0 || !y.isInt(this.offset)) && (this.offset = 0), this.clear(true), this.reload(t)) : console.log("ERROR: grid.skip() can only be called when you have remote data source.");
    }
    load(e, t) {
      return e == null ? (console.log('ERROR: You need to provide url argument when calling .load() method of "' + this.name + '" object.'), new Promise((s, n) => {
        n();
      })) : (this.clear(true), this.request("load", {}, e, t));
    }
    reload(e) {
      var _a2;
      let t = this;
      var s = ((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url;
      return t.selectionSave(), s ? this.load(s, () => {
        t.selectionRestore(), typeof e == "function" && e();
      }) : (this.reset(true), this.localSearch(), this.selectionRestore(), typeof e == "function" && e({
        status: "success"
      }), new Promise((n) => {
        n();
      }));
    }
    request(e, t, s, n) {
      let i = this, o, a;
      var r = new Promise((x, b) => {
        o = x, a = b;
      });
      if (t == null && (t = {}), !(s = s || this.url)) return new Promise((x, b) => {
        b();
      });
      y.isInt(this.offset) || (this.offset = 0), y.isInt(this.last.fetch.offset) || (this.last.fetch.offset = 0);
      let c;
      var d = {
        limit: this.limit,
        offset: parseInt(this.offset) + parseInt(this.last.fetch.offset),
        searchLogic: this.last.logic,
        search: this.searchData.map((x) => (x = y.clone(x), this.searchMap && this.searchMap[x.field] && (x.field = this.searchMap[x.field]), x)),
        sort: this.sortData.map((x) => (x = y.clone(x), this.sortMap && this.sortMap[x.field] && (x.field = this.sortMap[x.field]), x))
      };
      if (this.searchData.length === 0 && (delete d.search, delete d.searchLogic), this.sortData.length === 0 && delete d.sort, y.extend(d, this.postData), y.extend(d, t), e != "delete" && e != "save" || (delete d.limit, delete d.offset, (d.action = e) == "delete" && (d[this.recid || "recid"] = this.getSelection())), e == "load") {
        if ((c = this.trigger("request", {
          target: this.name,
          url: s,
          postData: d,
          httpMethod: "GET",
          httpHeaders: this.httpHeaders
        })).isCancelled === true) return new Promise((x, b) => {
          b();
        });
      } else c = {
        detail: {
          url: s,
          postData: d,
          httpMethod: e == "save" ? "PUT" : "DELETE",
          httpHeaders: this.httpHeaders
        }
      };
      if (this.last.fetch.offset === 0 && this.lock(y.lang(this.msgRefresh), true), this.last.fetch.controller) try {
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
        var p = y.parseRoute(s);
        if (0 < p.keys.length) for (let x = 0; x < p.keys.length; x++) this.routeData[p.keys[x].name] != null && (s = s.replace(new RegExp(":" + p.keys[x].name, "g"), this.routeData[p.keys[x].name]));
      }
      return s = new URL(s, location), t = y.prepareParams(s, {
        method: c.detail.httpMethod,
        headers: c.detail.httpHeaders,
        body: c.detail.postData
      }, this.dataType), Object.assign(this.last.fetch, {
        action: e,
        options: t,
        controller: new AbortController(),
        start: Date.now(),
        loaded: false
      }), t.signal = this.last.fetch.controller.signal, fetch(s, t).catch(f).then((x) => {
        x != null && ((x == null ? void 0 : x.status) != 200 ? f(x ?? {}) : (i.unlock(), x.json().catch(f).then((b) => {
          this.requestComplete(b, e, n, o, a);
        })));
      }), e == "load" && c.finish(), r;
      function f(x) {
        var b;
        (x == null ? void 0 : x.name) !== "AbortError" && (i.unlock(), (b = i.trigger("error", {
          response: x,
          lastFetch: i.last.fetch
        })).isCancelled !== true) && (x.status && x.status != 200 ? i.error(x.status + ": " + x.statusText) : (console.log("ERROR: Server communication failed.", `
   EXPECTED:`, {
          total: 5,
          records: [
            {
              recid: 1,
              field: "value"
            }
          ]
        }, `
         OR:`, {
          error: true,
          message: "error message"
        }), i.requestComplete({
          error: true,
          message: y.lang(this.msgHTTPError),
          response: x
        }, e, n, o, a)), b.finish());
      }
    }
    requestComplete(e, t, s, n, i) {
      var _a2;
      let o = e.error ?? false, a = (e.error == null && e.status === "error" && (o = true), this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1e3, setTimeout(() => {
        this.show.statusResponse && this.status(y.lang("Server Response ${count} seconds", {
          count: this.last.fetch.response
        }));
      }, 10), this.last.pull_more = false, this.last.pull_refresh = true, "load");
      this.last.fetch.action == "save" && (a = "save"), this.last.fetch.action == "delete" && (a = "delete");
      var r = this.trigger(a, {
        target: this.name,
        error: o,
        data: e,
        lastFetch: this.last.fetch
      });
      if (r.isCancelled === true) i();
      else {
        if (o) this.error(y.lang(e.message ?? this.msgServerError)), i(e);
        else if (typeof this.parser == "function" ? typeof (e = this.parser(e)) != "object" && console.log("ERROR: Your parser did not return proper object") : e == null ? e = {
          error: true,
          message: y.lang(this.msgNotJSON)
        } : Array.isArray(e) && (e = {
          error: o,
          records: e,
          total: e.length
        }), t == "load") {
          if (e.total == null && (e.total = -1), e.records == null && (e.records = []), e.records.length == this.limit ? (i = this.records.length + e.records.length, this.last.fetch.hasMore = i != this.total) : (this.last.fetch.hasMore = false, this.total = this.offset + this.last.fetch.offset + e.records.length), this.last.fetch.hasMore || h(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").hide(), this.last.fetch.offset === 0) this.records = [], this.summary = [];
          else if (e.total != -1 && parseInt(e.total) != parseInt(this.total)) {
            let c = this;
            return this.message(y.lang(this.msgNeedReload)).ok(() => {
              delete c.last.fetch.offset, c.reload();
            }), new Promise((d) => {
              d();
            });
          }
          y.isInt(e.total) && (this.total = parseInt(e.total)), e.records && e.records.forEach((c) => {
            var _a3;
            this.recid && (c.recid = this.parseField(c, this.recid)), c.recid == null && (c.recid = "recid-" + this.records.length), (((_a3 = c.w2ui) == null ? void 0 : _a3.summary) === true ? this.summary : this.records).push(c);
          }), e.summary && (this.summary = [], e.summary.forEach((c) => {
            this.recid && (c.recid = this.parseField(c, this.recid)), c.recid == null && (c.recid = "recid-" + this.summary.length), this.summary.push(c);
          }));
        } else if (t == "delete") return this.reset(), this.reload();
        (((_a2 = this.url) == null ? void 0 : _a2.get) ?? this.url) || (this.localSort(), this.localSearch()), this.total = parseInt(this.total), this.last.fetch.offset === 0 ? this.refresh() : (this.scroll(), this.resize()), typeof s == "function" && s(e), n(e), r.finish(), this.last.fetch.loaded = true;
      }
    }
    error(e) {
      var t = this.trigger("error", {
        target: this.name,
        message: e
      });
      t.isCancelled !== true && (this.message(e), t.finish());
    }
    getChanges(e) {
      var t = [];
      e === void 0 && (e = this.records);
      for (let i = 0; i < e.length; i++) {
        var s, n = e[i];
        (n == null ? void 0 : n.w2ui) && (n.w2ui.changes != null && ((s = {})[this.recid || "recid"] = n.recid, t.push(y.extend(s, n.w2ui.changes))), n.w2ui.expanded !== true) && n.w2ui.children && n.w2ui.children.length && t.push(...this.getChanges(n.w2ui.children));
      }
      return t;
    }
    mergeChanges() {
      var e = this.getChanges();
      for (let n = 0; n < e.length; n++) {
        var t, s = this.get(e[n][this.recid || "recid"]);
        for (t in e[n]) if (!(t == "recid" || this.recid && t == this.recid)) {
          typeof e[n][t] == "object" && (e[n][t] = e[n][t].text);
          try {
            (function i(o, a, r) {
              let c = a.split(".");
              c.length == 1 ? o[a] = r : (o = o[c[0]], c.shift(), i(o, c.join("."), r));
            })(s, t, e[n][t]);
          } catch (i) {
            console.log("ERROR: Cannot merge. ", i.message || "", i);
          }
          s.w2ui && delete s.w2ui.changes;
        }
      }
      this.refresh();
    }
    save(e) {
      var _a2;
      var t = this.getChanges(), s = ((_a2 = this.url) == null ? void 0 : _a2.save) ?? this.url;
      let n = this.trigger("save", {
        target: this.name,
        changes: t
      });
      n.isCancelled !== true && (s ? this.request("save", {
        changes: n.detail.changes
      }, null, (i) => {
        i.error || this.mergeChanges(), n.finish(), typeof e == "function" && e(i);
      }) : (this.mergeChanges(), n.finish()));
    }
    editField(e, t, s, n) {
      var _a2, _b;
      let i = this;
      if (this.last.inEditMode === true) n && n.keyCode == 13 ? ({ index: o, column: a, value: r } = this.last._edit, this.editChange({
        type: "custom",
        value: r
      }, o, a, n), this.editDone(o, a, n)) : 0 < (r = h(this.box).find("div.w2ui-edit-box .w2ui-input")).length && (r.get(0).tagName == "DIV" ? (r.text(r.text() + s), y.setCursorPosition(r.get(0), r.text().length)) : (r.val(r.val() + s), y.setCursorPosition(r.get(0), r.val().length)));
      else {
        let c = this.get(e, true), d = this.getCellEditable(c, t);
        if (d && ![
          "checkbox",
          "check"
        ].includes(d.type)) {
          let p = this.records[c], f = this.columns[t];
          var o = f.frozen === true ? "_f" : "_";
          if ([
            "enum",
            "file"
          ].indexOf(d.type) != -1) console.log('ERROR: input types "enum" and "file" are not supported in inline editing.');
          else {
            var a = this.trigger("editField", {
              target: this.name,
              recid: e,
              column: t,
              value: s,
              index: c,
              originalEvent: n
            });
            if (a.isCancelled !== true) {
              let P = function(H) {
                try {
                  var U = getComputedStyle(H), G = H.tagName.toUpperCase() == "DIV" ? H.innerText : H.value, W = h(i.box).find("#grid_" + i.name + "_editable").get(0), V = `font-family: ${U["font-family"]}; font-size: ${U["font-size"]}; white-space: no-wrap;`, q = y.getStrWidth(G, V);
                  q + 20 > W.clientWidth && h(W).css("width", q + 20 + "px");
                } catch {
                }
              };
              s = a.detail.value, this.last.inEditMode = true, this.last.editColumn = t, this.last._edit = {
                value: s,
                index: c,
                column: t,
                recid: e
              }, this.selectNone(true), this.select({
                recid: e,
                column: t
              });
              var r = h(this.box).find("#grid_" + this.name + o + "rec_" + y.escapeId(e));
              let x = r.find('[col="' + t + '"] > div'), b = (this.last._edit.tr = r, this.last._edit.div = x, h(this.box).find("div.w2ui-edit-box").remove(), this.selectType != "row" && (h(this.box).find("#grid_" + this.name + o + "selection").attr("id", "grid_" + this.name + "_editable").removeClass("w2ui-selection").addClass("w2ui-edit-box").prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>').find(".w2ui-selection-resizer").remove(), x = h(this.box).find("#grid_" + this.name + "_editable > div:first-child")), d.attr = d.attr ?? "", d.text = d.text ?? "", d.style = d.style ?? "", d.items = d.items ?? [], ((_b = (_a2 = p.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b[f.field]) != null ? y.stripTags(p.w2ui.changes[f.field]) : y.stripTags(i.parseField(p, f.field))), C = typeof (b = b ?? "") != "object" ? b : "", _ = (a.detail.prevValue != null && (C = a.detail.prevValue), s != null && (b = s), f.style != null ? f.style + ";" : "");
              typeof f.render == "string" && [
                "number",
                "int",
                "float",
                "money",
                "percent",
                "size"
              ].includes(f.render.split(":")[0]) && (_ += "text-align: right;"), 0 < d.items.length && !y.isPlainObject(d.items[0]) && (d.items = y.normMenu(d.items));
              let S, A = [
                "date",
                "time",
                "datetime",
                "color",
                "list",
                "combo"
              ];
              n = getComputedStyle(r.find('[col="' + t + '"] > div').get(0)), o = `font-family: ${n["font-family"]}; font-size: ${n["font-size"]};`, d.type === "div" ? (x.addClass("w2ui-editable").html(y.stripSpaces(`<div id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input w2ui-focus"
                        contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                        style="${o + _ + d.style}"
                        field="${f.field}" recid="${e}" column="${t}" ${d.attr}>
                    </div>` + d.text)), (S = x.find("div.w2ui-input").get(0)).innerText = typeof b != "object" ? b : "", s != null ? y.setCursorPosition(S, S.innerText.length) : y.setCursorPosition(S, 0, S.innerText.length)) : (x.addClass("w2ui-editable").html(y.stripSpaces(`<input id="grid_${this.name}_edit_${e}_${t}" class="w2ui-input"
                        autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                        style="${o + _ + d.style}"
                        field="${f.field}" recid="${e}" column="${t}" ${d.attr}>` + d.text)), S = x.find("input").get(0), d.type == "number" && (b = y.formatNumber(b)), d.type == "date" && (b = y.formatDate(y.isDate(b, d.format, true) || /* @__PURE__ */ new Date(), d.format)), S.value = typeof b != "object" ? b : "", r = (H) => {
                var _a3, _b2, _c2, _d2;
                var U = (_a3 = this.last._edit) == null ? void 0 : _a3.escKey;
                let G = false;
                var W = h(S).data("tooltipName");
                W && ((_b2 = ct.get(W[0])) == null ? void 0 : _b2.selected) != null && (G = true), !this.last.inEditMode || U || !A.includes(d.type) || ((_c2 = H.detail.overlay.anchor) == null ? void 0 : _c2.id) != ((_d2 = this.last._edit.input) == null ? void 0 : _d2.id) && d.type != "list" || (this.editChange(), this.editDone(void 0, void 0, {
                  keyCode: G ? 13 : 0
                }));
              }, new Ci(y.extend({}, d, {
                el: S,
                selected: b,
                onSelect: r,
                onHide: r
              })), s == null && S && S.select()), Object.assign(this.last._edit, {
                input: S,
                edit: d
              }), h(S).off(".w2ui-editable").on("blur.w2ui-editable", (H) => {
                var U, G;
                this.last.inEditMode && (U = this.last._edit.edit.type, G = h(S).data("tooltipName"), A.includes(U) && G || (this.editChange(S, c, t, H), this.editDone()));
              }).on("mousedown.w2ui-editable", (H) => {
                H.stopPropagation();
              }).on("click.w2ui-editable", (H) => {
                P.call(S, H);
              }).on("paste.w2ui-editable", (H) => {
                H.preventDefault(), H = H.clipboardData.getData("text/plain"), document.execCommand("insertHTML", false, H);
              }).on("keyup.w2ui-editable", (H) => {
                P.call(S, H);
              }).on("keydown.w2ui-editable", (H) => {
                switch (H.keyCode) {
                  case 8:
                    d.type != "list" || S._w2field || H.preventDefault();
                    break;
                  case 9:
                  case 13:
                    H.preventDefault();
                    break;
                  case 27:
                    var U = h(S).data("tooltipName");
                    U && 0 < U.length && (this.last._edit.escKey = true, ct.hide(U[0]), H.preventDefault()), H.stopPropagation();
                }
                setTimeout(() => {
                  var _a3, _b2;
                  switch (H.keyCode) {
                    case 9:
                      var G = H.shiftKey ? i.prevCell(c, t, true) : i.nextCell(c, t, true);
                      G != null && (W = i.records[G.index].recid, this.editChange(S, c, t, H), this.editDone(c, t, H), i.selectType != "row" ? (i.selectNone(true), i.select({
                        recid: W,
                        column: G.colIndex
                      })) : i.editField(W, G.colIndex, null, H), H.preventDefault) && H.preventDefault();
                      break;
                    case 13: {
                      let V = false;
                      var W = h(S).data("tooltipName");
                      W && ct.get(W[0]).selected != null && (V = true), W && V || (this.editChange(S, c, t, H), this.editDone(c, t, H));
                      break;
                    }
                    case 27: {
                      this.last._edit.escKey = false;
                      let V = i.parseField(p, f.field);
                      ((_b2 = (_a3 = p.w2ui) == null ? void 0 : _a3.changes) == null ? void 0 : _b2[f.field]) != null && (V = p.w2ui.changes[f.field]), S._prevValue != null && (V = S._prevValue), S.tagName == "DIV" ? S.innerText = V ?? "" : S.value = V ?? "", this.editDone(c, t, H), setTimeout(() => {
                        i.select({
                          recid: e,
                          column: t
                        });
                      }, 1);
                      break;
                    }
                  }
                  P(S);
                }, 1);
              }), S && (S._prevValue = C), d.type != "list" && setTimeout(() => {
                this.last.inEditMode && S && (S.focus(), clearTimeout(this.last.kbd_timer), (S.resize = P)(S));
              }, 50), a.finish({
                input: S
              });
            }
          }
        }
      }
    }
    editChange(e, t, s, n) {
      var _a2, _b, _c2, _d2;
      e = e ?? this.last._edit.input, t = t ?? this.last._edit.index, s = s ?? this.last._edit.column, n = n ?? {};
      var i = (t < 0 ? this.summary : this.records)[t = t < 0 ? -t - 1 : t], o = this.columns[s];
      let a = (e == null ? void 0 : e.tagName) == "DIV" ? e.innerText : e.value;
      var r = e._w2field, c = (r && (r.type == "list" && (a = r.selected), Object.keys(a).length !== 0 && a != null || (a = ""), y.isPlainObject(a) || (a = r.clean(a))), e.type == "checkbox" && (((_a2 = i.w2ui) == null ? void 0 : _a2.editable) === false && (e.checked = !e.checked), a = e.checked), this.parseField(i, o.field)), d = ((_b = i.w2ui) == null ? void 0 : _b.changes) && i.w2ui.changes.hasOwnProperty(o.field) ? i.w2ui.changes[o.field] : c;
      let p = {
        target: this.name,
        input: e,
        recid: i.recid,
        index: t,
        column: s,
        originalEvent: n,
        value: {
          new: a,
          previous: d,
          original: c
        }
      }, f = (((_c2 = n.target) == null ? void 0 : _c2._prevValue) != null && (p.value.previous = n.target._prevValue), 0);
      for (; f < 20; ) {
        if (f++, typeof (a = p.value.new) != "object" && String(c) != String(a) || typeof a == "object" && a && a.id != c && (typeof c != "object" || c == null || a.id != c.id)) {
          if ((p = this.trigger("change", p)).isCancelled !== true) {
            if (a !== p.detail.value.new) continue;
            (p.detail.value.new !== "" && p.detail.value.new != null || d !== "" && d != null) && (i.w2ui = i.w2ui ?? {}, i.w2ui.changes = i.w2ui.changes ?? {}, i.w2ui.changes[o.field] = p.detail.value.new), p.finish();
          }
        } else if ((p = this.trigger("restore", p)).isCancelled !== true) {
          if (a !== p.detail.value.new) continue;
          ((_d2 = i.w2ui) == null ? void 0 : _d2.changes) && (delete i.w2ui.changes[o.field], Object.keys(i.w2ui.changes).length === 0) && delete i.w2ui.changes, p.finish();
        }
        break;
      }
    }
    editDone(e, t, s) {
      var _a2, _b;
      if (e = e ?? this.last._edit.index, t = t ?? this.last._edit.column, s = s ?? {}, this.advanceOnEdit && s.keyCode == 13) {
        let r = s.shiftKey ? this.prevRow(e, t, 1) : this.nextRow(e, t, 1);
        r == null && (r = e), setTimeout(() => {
          this.selectType != "row" ? (this.selectNone(true), this.select({
            recid: this.records[r].recid,
            column: t
          })) : this.editField(this.records[r].recid, t, null, s);
        }, 1);
      }
      var n = e < 0, i = h(this.last._edit.tr).find('[col="' + t + '"]'), o = this.records[e], a = this.columns[t];
      this.last.inEditMode = false, this.last._edit = null, n || (((_b = (_a2 = o.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b[a.field]) != null ? i.addClass("w2ui-changed") : i.removeClass("w2ui-changed"), i.replace(this.getCellHTML(e, t, n))), h(this.box).find("div.w2ui-edit-box").remove(), this.updateToolbar(), setTimeout(() => {
        var r = h(this.box).find(`#grid_${this.name}_focus`).get(0);
        document.activeElement === r || this.last.inEditMode || r.focus();
      }, 10);
    }
    delete(e) {
      var _a2;
      var t = this.trigger("delete", {
        target: this.name,
        force: e
      });
      if (e && this.message(), t.isCancelled !== true) {
        e = t.detail.force;
        var s = this.getSelection();
        if (s.length !== 0) if (this.msgDelete == "" || e) {
          if (typeof this.url != "object" ? this.url : this.url.remove) this.request("delete");
          else if (typeof s[0] != "object") this.selectNone(), this.remove.apply(this, s);
          else {
            for (let a = 0; a < s.length; a++) {
              var n = this.columns[s[a].column].field, i = this.get(s[a].recid, true), o = this.records[i];
              i != null && n != "recid" && (this.records[i][n] = "", (_a2 = o.w2ui) == null ? void 0 : _a2.changes) && delete o.w2ui.changes[n];
            }
            this.update();
          }
          t.finish();
        } else this.confirm({
          text: y.lang(this.msgDelete, {
            count: s.length,
            records: y.lang(s.length == 1 ? "record" : "records")
          }),
          width: 380,
          height: 170,
          yes_text: y.lang("Delete"),
          yes_class: "w2ui-btn-red",
          no_text: y.lang("Cancel")
        }).yes((a) => {
          a.detail.self.close(), this.delete(true);
        }).no((a) => {
          a.detail.self.close();
        });
      }
    }
    click(e, t) {
      var _a2, _b, _c2;
      var s = Date.now();
      let n = null;
      if (!(this.last.cancelClick == 1 || t && t.altKey)) if (typeof e == "object" && e !== null && (n = e.column, e = e.recid), t == null && (t = {}), s - parseInt(this.last.click_time) < 350 && this.last.click_recid == e && t.type == "click") this.dblClick(e, t);
      else {
        if (this.last.bubbleEl && (this.last.bubbleEl = null), this.last.click_time = s, s = this.last.click_recid, this.last.click_recid = e, n == null && t.target) {
          let p = t.target;
          p.tagName != "TD" && (p = h(p).closest("td")[0]), h(p).attr("col") != null && (n = parseInt(h(p).attr("col")));
        }
        var i = this.trigger("click", {
          target: this.name,
          recid: e,
          column: n,
          originalEvent: t
        });
        if (i.isCancelled !== true) {
          var o = this.getSelection(), a = (h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.get(e, true)), r = [];
          this.last.sel_ind = a, this.last.sel_col = n, this.last.sel_recid = e, this.last.sel_type = "click";
          let p, f, x, b;
          if (t.shiftKey && 0 < o.length && this.multiSelect) {
            if (o[0].recid) {
              p = this.get(o[0].recid, true), f = this.get(e, true), b = n > o[0].column ? (x = o[0].column, n) : (x = n, o[0].column);
              for (let C = x; C <= b; C++) r.push(C);
            } else p = this.get(s, true), f = this.get(e, true);
            var c = [], d = (p > f && (s = p, p = f, f = s), ((_a2 = this.url) == null ? void 0 : _a2.get) ? this.url.get : this.url);
            for (let C = p; C <= f; C++) if (!(0 < this.searchData.length) || d || this.last.searchIds.includes(C)) if (this.selectType == "row") c.push(this.records[C].recid);
            else for (let _ = 0; _ < r.length; _++) c.push({
              recid: this.records[C].recid,
              column: r[_]
            });
            this.select(c);
          } else {
            s = this.last.selection;
            let C = s.indexes.indexOf(a) != -1, _ = false;
            h(t.target).closest("td").hasClass("w2ui-col-select") && (_ = true), (t.ctrlKey || t.shiftKey || t.metaKey || _) && this.multiSelect || this.showSelectColumn ? (C = this.selectType == "row" || ((_b = s.columns[a]) == null ? void 0 : _b.includes(n)) ? C : false) === true ? this.unselect({
              recid: e,
              column: n
            }) : this.select({
              recid: e,
              column: n
            }) : (this.selectType == "row" || ((_c2 = s.columns[a]) == null ? void 0 : _c2.includes(n)) || (C = false), this.selectNone(true), C === true && o.length == 1 ? this.unselect({
              recid: e,
              column: n
            }) : this.select({
              recid: e,
              column: n
            }));
          }
          this.status(), this.initResize(), i.finish();
        }
      }
    }
    columnClick(e, t) {
      if (this.last.colResizing !== true) {
        let o = this.trigger("columnClick", {
          target: this.name,
          field: e,
          originalEvent: t
        });
        if (o.isCancelled !== true) {
          if (this.selectType == "row") {
            var s = this.getColumn(e);
            s && s.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), o.detail.field == "line-number" && (this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll());
          } else if (t.altKey && (s = this.getColumn(e)) && s.sortable && this.sort(e, null, !(!t || !t.ctrlKey && !t.metaKey)), o.detail.field == "line-number") this.getSelection().length >= this.records.length ? this.selectNone() : this.selectAll();
          else {
            t.shiftKey || t.metaKey || t.ctrlKey || this.selectNone(true);
            var s = this.getSelection(), e = this.getColumn(o.detail.field, true), n = [], i = [];
            if (s.length != 0 && t.shiftKey) {
              let c = e, d = s[0].column;
              c > d && (c = s[0].column, d = e);
              for (let p = c; p <= d; p++) i.push(p);
            } else i.push(e);
            if ((o = this.trigger("columnSelect", {
              target: this.name,
              columns: i
            })).isCancelled !== true) {
              for (let c = 0; c < this.records.length; c++) n.push({
                recid: this.records[c].recid,
                column: i
              });
              this.select(n);
            }
            o.finish();
          }
          o.finish();
        }
      }
    }
    columnDblClick(e, t) {
      e = this.trigger("columnDblClick", {
        target: this.name,
        field: e,
        originalEvent: t
      }), e.isCancelled !== true && e.finish();
    }
    columnContextMenu(e, t) {
      e = this.trigger("columnContextMenu", {
        target: this.name,
        field: e,
        originalEvent: t
      }), e.isCancelled !== true && (this.show.columnMenu && (Jt.show({
        type: "check",
        anchor: document.body,
        originalEvent: t,
        items: this.initColumnOnOff()
      }).then(() => {
        h("#w2overlay-context-menu .w2ui-grid-skip").off(".w2ui-grid").on("click.w2ui-grid", (s) => {
          s.stopPropagation();
        }).on("keypress", (s) => {
          s.keyCode == 13 && (this.skip(s.target.value), this.toolbar.click("w2ui-column-on-off"));
        });
      }).select((s) => {
        var n = s.detail.item.id;
        [
          "w2ui-stateSave",
          "w2ui-stateReset"
        ].includes(n) ? this[n.substring(5)]() : n != "w2ui-skip" && this.columnOnOff(s, s.detail.item.id), clearTimeout(this.last.kbd_timer);
      }), clearTimeout(this.last.kbd_timer)), t.preventDefault(), e.finish());
    }
    focus(e) {
      if (e = this.trigger("focus", {
        target: this.name,
        originalEvent: e
      }), e.isCancelled === true) return false;
      this.hasFocus = true, h(this.box).removeClass("w2ui-inactive").find(".w2ui-inactive").removeClass("w2ui-inactive"), setTimeout(() => {
        var t = h(this.box).find(`#grid_${this.name}_focus`).get(0);
        t && document.activeElement != t && t.focus();
      }, 10), e.finish();
    }
    blur(e) {
      if (e = this.trigger("blur", {
        target: this.name,
        originalEvent: e
      }), e.isCancelled === true) return false;
      this.hasFocus = false, h(this.box).addClass("w2ui-inactive").find(".w2ui-selected").addClass("w2ui-inactive"), h(this.box).find(".w2ui-selection").addClass("w2ui-inactive"), e.finish();
    }
    keydown(e) {
      let t = this, s = typeof this.url != "object" ? this.url : this.url.get;
      if (t.keyboard === true) {
        var n = t.trigger("keydown", {
          target: t.name,
          originalEvent: e
        });
        if (n.isCancelled !== true) if (0 < h(this.box).find(".w2ui-message").length) e.keyCode == 27 && this.message();
        else {
          let H = function(V) {
            if (r && G(), !(_.length <= 0)) {
              let R = t.prevRow(b, t.selectType == "row" ? 0 : d[0].column, V);
              if ((R = P || R != null ? R : t.searchData.length == 0 || s ? 0 : t.last.searchIds[0]) != null) {
                if (P && t.multiSelect) {
                  if (W()) return;
                  if (t.selectType == "row") t.last.sel_ind > R && t.last.sel_ind != C ? t.unselect(t.records[C].recid) : t.select(t.records[R].recid);
                  else if (t.last.sel_ind > R && t.last.sel_ind != C) {
                    R = C;
                    var q = [];
                    for (let X = 0; X < f.length; X++) q.push({
                      recid: t.records[R].recid,
                      column: f[X]
                    });
                    t.unselect(q);
                  } else {
                    var D = [];
                    for (let X = 0; X < f.length; X++) D.push({
                      recid: t.records[R].recid,
                      column: f[X]
                    });
                    t.select(D);
                  }
                } else t.selectNone(true), t.click({
                  recid: t.records[R].recid,
                  column: f[0]
                }, e);
                t.scrollIntoView(R, null, true, V != 1), e.preventDefault && e.preventDefault();
              } else P || t.selectNone(true);
            }
          }, U = function(V) {
            if (r && G(), !(_.length <= 0)) {
              let R = t.nextRow(C, t.selectType == "row" ? 0 : d[0].column, V);
              if ((R = P || R != null ? R : t.searchData.length == 0 || s ? t.records.length - 1 : t.last.searchIds[t.last.searchIds.length - 1]) != null) {
                if (P && t.multiSelect) {
                  if (W()) return;
                  if (t.selectType == "row") t.last.sel_ind < R && t.last.sel_ind != b ? t.unselect(t.records[b].recid) : t.select(t.records[R].recid);
                  else if (t.last.sel_ind < R && t.last.sel_ind != b) {
                    R = b;
                    var q = [];
                    for (let X = 0; X < f.length; X++) q.push({
                      recid: t.records[R].recid,
                      column: f[X]
                    });
                    t.unselect(q);
                  } else {
                    var D = [];
                    for (let X = 0; X < f.length; X++) D.push({
                      recid: t.records[R].recid,
                      column: f[X]
                    });
                    t.select(D);
                  }
                } else t.selectNone(true), t.click({
                  recid: t.records[R].recid,
                  column: f[0]
                }, e);
                t.scrollIntoView(R, null, true, V != 1), S = true;
              } else P || t.selectNone(true);
            }
          }, G = function() {
            if (t.records && t.records.length !== 0) {
              let V = Math.floor(c[0].scrollTop / t.recordHeight) + 1;
              (!t.records[V] || V < 2) && (V = 0), t.records[V] !== void 0 && t.select({
                recid: t.records[V].recid,
                column: 0
              });
            }
          }, W = function() {
            if (t.last.sel_type == "click") {
              if (t.selectType == "row") return t.last.sel_type = "key", 1 < d.length && (d.splice(d.indexOf(t.records[t.last.sel_ind].recid), 1), t.unselect(d), 1);
              if (t.last.sel_type = "key", 1 < d.length) {
                for (let V = 0; V < d.length; V++) if (d[V].recid == t.last.sel_recid && d[V].column == t.last.sel_col) {
                  d.splice(V, 1);
                  break;
                }
                return t.unselect(d), 1;
              }
            }
          }, r = false, c = h(t.box).find("#grid_" + t.name + "_records"), d = t.getSelection(), p = (d.length === 0 && (r = true), d[0] || null), f = [], x = d[d.length - 1];
          if (typeof p == "object" && p != null) {
            p = d[0].recid, f = [];
            let V = 0;
            for (; !(!d[V] || d[V].recid != p); ) f.push(d[V].column), V++;
            x = d[d.length - 1].recid;
          }
          let b = t.get(p, true), C = t.get(x, true), _ = h(t.box).find(`#grid_${t.name}_rec_` + (b != null ? y.escapeId(t.records[b].recid) : "none"));
          var i, o = Math.floor(c[0].clientHeight / t.recordHeight);
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
                for (let V = 0; V < this.columns.length; V++) if (this.getCellEditable(b, V)) {
                  f.push(parseInt(V));
                  break;
                }
                0 < (f = this.selectType == "row" && this.last._edit && this.last._edit.column ? [
                  this.last._edit.column
                ] : f).length && (t.editField(p, this.last.editColumn || f[0], null, e), S = true);
              }
              break;
            case 37:
              (function() {
                if (r) G();
                else {
                  if (t.selectType == "row") {
                    if (_.length <= 0) return;
                    var V = t.records[b].w2ui || {};
                    !V || V.parent_recid == null || Array.isArray(V.children) && V.children.length !== 0 && V.expanded ? t.collapse(p, e) : (t.unselect(p), t.collapse(V.parent_recid, e), t.select(V.parent_recid));
                  } else {
                    let X = t.prevCell(b, f[0]);
                    if (X = (X == null ? void 0 : X.index) != b ? null : X == null ? void 0 : X.colIndex, P || X != null || (t.selectNone(true), X = 0), X != null) if (P && t.multiSelect) {
                      if (W()) return;
                      var q = [], D = [], R = [];
                      if (f.indexOf(t.last.sel_col) === 0 && 1 < f.length) {
                        for (let Q = 0; Q < d.length; Q++) q.indexOf(d[Q].recid) == -1 && q.push(d[Q].recid), R.push({
                          recid: d[Q].recid,
                          column: f[f.length - 1]
                        });
                        t.unselect(R), t.scrollIntoView(b, f[f.length - 1], true);
                      } else {
                        for (let Q = 0; Q < d.length; Q++) q.indexOf(d[Q].recid) == -1 && q.push(d[Q].recid), D.push({
                          recid: d[Q].recid,
                          column: X
                        });
                        t.select(D), t.scrollIntoView(b, X, true);
                      }
                    } else t.click({
                      recid: p,
                      column: X
                    }, e), t.scrollIntoView(b, X, true);
                    else P || t.selectNone(true);
                  }
                  S = true;
                }
              })();
              break;
            case 39:
              (function() {
                if (r) G();
                else {
                  if (t.selectType == "row") {
                    if (_.length <= 0) return;
                    t.expand(p, e);
                  } else {
                    let R = t.nextCell(b, f[f.length - 1]);
                    if (R = R.index != b ? null : R.colIndex, P || R != null || (t.selectNone(true), R = t.columns.length - 1), R != null) if (P && A == 39 && t.multiSelect) {
                      if (W()) return;
                      var V = [], q = [], D = [];
                      if (f.indexOf(t.last.sel_col) == f.length - 1 && 1 < f.length) {
                        for (let X = 0; X < d.length; X++) V.indexOf(d[X].recid) == -1 && V.push(d[X].recid), D.push({
                          recid: d[X].recid,
                          column: f[0]
                        });
                        t.unselect(D), t.scrollIntoView(b, f[0], true);
                      } else {
                        for (let X = 0; X < d.length; X++) V.indexOf(d[X].recid) == -1 && V.push(d[X].recid), q.push({
                          recid: d[X].recid,
                          column: R
                        });
                        t.select(q), t.scrollIntoView(b, R, true);
                      }
                    } else t.click({
                      recid: p,
                      column: R
                    }, e), t.scrollIntoView(b, R, true);
                    else P || t.selectNone(true);
                  }
                  S = true;
                }
              })();
              break;
            case 33:
              H(o);
              break;
            case 34:
              U(o);
              break;
            case 35:
              U(-1);
              break;
            case 36:
              H(-1);
              break;
            case 38:
              H(e.metaKey || e.ctrlKey ? -1 : 1);
              break;
            case 40:
              U(e.metaKey || e.ctrlKey ? -1 : 1);
              break;
            case 17:
            case 91:
              r || y.isSafari && (t.last.copy_event = t.copy(false, e), (i = h(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), i[0].select());
              break;
            case 67:
              (e.metaKey || e.ctrlKey) && (y.isSafari || (t.last.copy_event = t.copy(false, e), (i = h(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), i[0].select()), t.copy(t.last.copy_event, e));
              break;
            case 88:
              r || (e.ctrlKey || e.metaKey) && (y.isSafari || (t.last.copy_event = t.copy(false, e), (i = h(t.box).find("#grid_" + t.name + "_focus")).val(t.last.copy_event.detail.text), i[0].select()), t.copy(t.last.copy_event, e));
          }
          var a = [
            32,
            187,
            189,
            192,
            219,
            220,
            221,
            186,
            222,
            188,
            190,
            191
          ];
          for (let V = 48; V <= 111; V++) a.push(V);
          a.indexOf(A) == -1 || e.ctrlKey || e.metaKey || S || (f.length === 0 && f.push(0), S = false, setTimeout(() => {
            var V = h(t.box).find("#grid_" + t.name + "_focus"), q = V.val();
            V.val(""), t.editField(p, f[0], q, e);
          }, 1)), S && e.preventDefault && e.preventDefault(), n.finish();
        }
      }
    }
    scrollIntoView(e, t, s, n) {
      let i = this.records.length;
      if ((i = this.searchData.length == 0 || this.url ? i : this.last.searchIds.length) !== 0) {
        if (e == null) {
          var o = this.getSelection();
          if (o.length === 0) return;
          y.isPlainObject(o[0]) ? (e = o[0].index, t = o[0].column) : e = this.get(o[0], true);
        }
        var o = h(this.box).find(`#grid_${this.name}_records`), a = o[0].clientWidth, r = o[0].clientHeight, c = o[0].scrollTop, d = o[0].scrollLeft, p = this.last.searchIds.length;
        if (0 < p && (e = this.last.searchIds.indexOf(e)), o.css({
          "scroll-behavior": s ? "auto" : "smooth"
        }), r < this.recordHeight * (0 < p ? p : i) && 0 < o.length && (p = (s = Math.floor(c / this.recordHeight)) + Math.floor(r / this.recordHeight), e == s && o.prop("scrollTop", c - r / 1.3), e == p && o.prop("scrollTop", c + r / 1.3), (e < s || p < e) && o.prop("scrollTop", (e - 1) * this.recordHeight), n === true) && o.prop("scrollTop", e * this.recordHeight), t != null) {
          let x = 0, b = 0;
          c = y.scrollBarSize();
          for (let C = 0; C <= t; C++) {
            var f = this.columns[C];
            f.frozen || f.hidden || (x = b, b += parseInt(f.sizeCalculated));
          }
          a < b - d ? o.prop("scrollLeft", x - c) : x < d && o.prop("scrollLeft", b - a + 2 * c);
        }
      }
    }
    scrollToColumn(e) {
      if (e != null) {
        let s = 0, n = false;
        for (let i = 0; i < this.columns.length; i++) {
          var t = this.columns[i];
          if (t.field == e) {
            n = true;
            break;
          }
          t.frozen || t.hidden || (t = parseInt(t.sizeCalculated || t.size), s += t);
        }
        n && (this.last.scrollLeft = s + 1, this.scroll());
      }
    }
    dblClick(e, t) {
      let s = null;
      if (typeof e == "object" && e !== null && (s = e.column, e = e.recid), t == null && (t = {}), s == null && t.target) {
        let a = t.target;
        a.tagName.toUpperCase() != "TD" && (a = h(a).closest("td")[0]), s = parseInt(h(a).attr("col"));
      }
      var n = this.get(e, true), i = this.records[n], o = this.trigger("dblClick", {
        target: this.name,
        recid: e,
        column: s,
        originalEvent: t
      });
      o.isCancelled !== true && (this.selectNone(true), this.getCellEditable(n, s) ? this.editField(e, s, null, t) : (this.select({
        recid: e,
        column: s
      }), (this.show.expandColumn || i && i.w2ui && Array.isArray(i.w2ui.children)) && this.toggle(e)), o.finish());
    }
    showContextMenu(e, t, s) {
      if (this.last.userSelect != "text") {
        (s = s ?? {
          offsetX: 0,
          offsetY: 0,
          target: h(this.box).find(`#grid_${this.name}_rec_` + e)[0]
        }).offsetX == null && (s.offsetX = s.layerX - s.target.offsetLeft, s.offsetY = s.layerY - s.target.offsetTop), y.isFloat(e) && (e = parseFloat(e));
        var n = this.getSelection();
        if (this.selectType == "row") n.indexOf(e) == -1 && this.click(e);
        else {
          let o = false;
          for (let a = 0; a < n.length; a++) n[a].recid != e && n[a].column != t || (o = true);
          o || e == null || this.click({
            recid: e,
            column: t
          }), o || t == null || this.columnClick(this.columns[t].field, s);
        }
        var i = this.trigger("contextMenu", {
          target: this.name,
          originalEvent: s,
          recid: e,
          column: t
        });
        i.isCancelled !== true && (0 < this.contextMenu.length && (Jt.show({
          anchor: document.body,
          originalEvent: s,
          items: this.contextMenu
        }).select((o) => {
          clearTimeout(this.last.kbd_timer), this.contextMenuClick(e, t, o);
        }), clearTimeout(this.last.kbd_timer)), s.preventDefault(), i.finish());
      }
    }
    contextMenuClick(e, t, s) {
      e = this.trigger("contextMenuClick", {
        target: this.name,
        recid: e,
        column: t,
        originalEvent: s.detail.originalEvent,
        menuEvent: s,
        menuIndex: s.detail.index,
        menuItem: s.detail.item
      }), e.isCancelled !== true && e.finish();
    }
    toggle(e) {
      var t = this.get(e);
      if (t != null) return t.w2ui = t.w2ui ?? {}, t.w2ui.expanded === true ? this.collapse(e) : this.expand(e);
    }
    expand(e, t) {
      var _a2;
      var s = this.get(e, true);
      let n = this.records[s];
      n.w2ui = n.w2ui ?? {};
      var i = y.escapeId(e), o = n.w2ui.children;
      let a;
      if (Array.isArray(o)) {
        if (n.w2ui.expanded === true || o.length === 0 || (a = this.trigger("expand", {
          target: this.name,
          recid: e
        })).isCancelled === true) return false;
        n.w2ui.expanded = true, o.forEach((r) => {
          r.w2ui = r.w2ui ?? {}, r.w2ui.parent_recid = n.recid, r.w2ui.children == null && (r.w2ui.children = []);
        }), this.records.splice.apply(this.records, [
          s + 1,
          0
        ].concat(o)), this.total !== -1 && (this.total += o.length), (typeof this.url != "object" ? this.url : this.url.get) || (this.localSort(true, true), 0 < this.searchData.length && this.localSearch(true)), t !== true && this.refresh(), a.finish();
      } else {
        if (0 < h(this.box).find("#grid_" + this.name + "_rec_" + i + "_expanded_row").length || this.show.expandColumn !== true || n.w2ui.expanded == "none") return false;
        if (h(this.box).find("#grid_" + this.name + "_rec_" + i).after(`<tr id="grid_${this.name}_rec_${e}_expanded_row" class="w2ui-expanded-row">
                    <td colspan="100" class="w2ui-expanded2">
                        <div id="grid_${this.name}_rec_${e}_expanded"></div>
                    </td>
                    <td class="w2ui-grid-data-last"></td>
                </tr>`), h(this.box).find("#grid_" + this.name + "_frec_" + i).after(`<tr id="grid_${this.name}_frec_${e}_expanded_row" class="w2ui-expanded-row">
                    ${this.show.lineNumbers ? '<td class="w2ui-col-number"></td>' : ""}
                    <td class="w2ui-grid-data w2ui-expanded1" colspan="100">
                       <div id="grid_${this.name}_frec_${e}_expanded"></div>
                    </td>
                </tr>`), (a = this.trigger("expand", {
          target: this.name,
          recid: e,
          box_id: "grid_" + this.name + "_rec_" + e + "_expanded",
          fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded"
        })).isCancelled === true) return h(this.box).find("#grid_" + this.name + "_rec_" + i + "_expanded_row").remove(), h(this.box).find("#grid_" + this.name + "_frec_" + i + "_expanded_row").remove(), false;
        s = h(this.box).find("#grid_" + this.name + "_rec_" + e + "_expanded"), o = h(this.box).find("#grid_" + this.name + "_frec_" + e + "_expanded"), t = ((_a2 = s.find(":scope div:first-child")[0]) == null ? void 0 : _a2.clientHeight) ?? 50, s[0].clientHeight < t && s.css({
          height: t + "px"
        }), o[0].clientHeight < t && o.css({
          height: t + "px"
        }), h(this.box).find("#grid_" + this.name + "_rec_" + i).attr("expanded", "yes").addClass("w2ui-expanded"), h(this.box).find("#grid_" + this.name + "_frec_" + i).attr("expanded", "yes").addClass("w2ui-expanded"), h(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("-"), n.w2ui.expanded = true, a.finish(), this.resizeRecords();
      }
      return true;
    }
    collapse(e, t) {
      var s = this.get(e, true);
      let n = this.records[s], i = (n.w2ui = n.w2ui || {}, y.escapeId(e));
      var o = n.w2ui.children;
      let a;
      if (Array.isArray(o)) {
        if (n.w2ui.expanded !== true || (a = this.trigger("collapse", {
          target: this.name,
          recid: e
        })).isCancelled === true) return false;
        (function d(p) {
          p.w2ui.expanded = false;
          for (let f = 0; f < p.w2ui.children.length; f++) {
            let x = p.w2ui.children[f];
            x.w2ui.expanded && d(x);
          }
        })(n);
        var r = [];
        for (let d = n; d != null; d = this.get(d.w2ui.parent_recid)) r.push(d.w2ui.parent_recid);
        o = s + 1;
        let c = o;
        for (; !(this.records.length <= c + 1 || this.records[c + 1].w2ui == null || 0 <= r.indexOf(this.records[c + 1].w2ui.parent_recid)); ) c++;
        this.records.splice(o, c - o + 1), this.total !== -1 && (this.total -= c - o + 1), (typeof this.url != "object" ? this.url : this.url.get) || 0 < this.searchData.length && this.localSearch(true), t !== true && this.refresh(), a.finish();
      } else {
        if (h(this.box).find("#grid_" + this.name + "_rec_" + i + "_expanded_row").length === 0 || this.show.expandColumn !== true || (a = this.trigger("collapse", {
          target: this.name,
          recid: e,
          box_id: "grid_" + this.name + "_rec_" + e + "_expanded",
          fbox_id: "grid_" + this.name + "_frec_" + e + "_expanded"
        })).isCancelled === true) return false;
        h(this.box).find("#grid_" + this.name + "_rec_" + i).removeAttr("expanded").removeClass("w2ui-expanded"), h(this.box).find("#grid_" + this.name + "_frec_" + i).removeAttr("expanded").removeClass("w2ui-expanded"), h(this.box).find("#grid_" + this.name + "_cell_" + this.get(e, true) + "_expand div").html("+"), h(this.box).find("#grid_" + this.name + "_rec_" + i + "_expanded").css("height", "0px"), h(this.box).find("#grid_" + this.name + "_frec_" + i + "_expanded").css("height", "0px"), setTimeout(() => {
          h(this.box).find("#grid_" + this.name + "_rec_" + i + "_expanded_row").remove(), h(this.box).find("#grid_" + this.name + "_frec_" + i + "_expanded_row").remove(), n.w2ui.expanded = false, a.finish(), this.resizeRecords();
        }, 300);
      }
      return true;
    }
    sort(e, t, s) {
      var n = this.trigger("sort", {
        target: this.name,
        field: e,
        direction: t,
        multiField: s
      });
      if (n.isCancelled !== true) {
        if (e != null) {
          let i = this.sortData.length;
          for (let o = 0; o < this.sortData.length; o++) if (this.sortData[o].field == e) {
            i = o;
            break;
          }
          t == null && (t = this.sortData[i] != null && (this.sortData[i].direction == null && (this.sortData[i].direction = ""), this.sortData[i].direction.toLowerCase() === "asc") ? "desc" : "asc"), this.multiSort === false && (this.sortData = [], i = 0), s != 1 && (this.sortData = [], i = 0), this.sortData[i] == null && (this.sortData[i] = {}), this.sortData[i].field = e, this.sortData[i].direction = t;
        } else this.sortData = [];
        (typeof this.url != "object" ? this.url : this.url.get) ? (n.finish({
          direction: t
        }), this.last.fetch.offset = 0, this.reload()) : (this.localSort(false, true), 0 < this.searchData.length && this.localSearch(true), this.last.scrollTop = 0, h(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0), n.finish({
          direction: t
        }), this.refresh());
      }
    }
    copy(e, t) {
      if (y.isPlainObject(e)) return e.finish(), e.text;
      var s = this.getSelection();
      if (s.length === 0) return "";
      let n = "";
      if (typeof s[0] == "object") {
        let d = s[0].column, p = s[0].column;
        var i = [];
        for (let f = 0; f < s.length; f++) s[f].column < d && (d = s[f].column), s[f].column > p && (p = s[f].column), i.indexOf(s[f].index) == -1 && i.push(s[f].index);
        i.sort((f, x) => f - x);
        for (let f = 0; f < i.length; f++) {
          var o = i[f];
          for (let x = d; x <= p; x++) this.columns[x].hidden !== true && (n += this.getCellCopy(o, x) + "	");
          n = n.substr(0, n.length - 1), n += `
`;
        }
      } else {
        for (let d = 0; d < this.columns.length; d++) {
          var a = this.columns[d];
          if (a.hidden !== true) {
            let p = a.text || a.field;
            a.text && a.text.length < 3 && a.tooltip && (p = a.tooltip), n += '"' + y.stripTags(p) + '"	';
          }
        }
        n = n.substr(0, n.length - 1), n += `
`;
        for (let d = 0; d < s.length; d++) {
          var r = this.get(s[d], true);
          for (let p = 0; p < this.columns.length; p++) this.columns[p].hidden !== true && (n += '"' + this.getCellCopy(r, p) + '"	');
          n = n.substr(0, n.length - 1), n += `
`;
        }
      }
      n = n.substr(0, n.length - 1);
      let c;
      return e == null ? (c = this.trigger("copy", {
        target: this.name,
        text: n,
        cut: t.keyCode == 88,
        originalEvent: t
      })).isCancelled === true ? "" : (n = c.detail.text, c.finish(), n) : e === false ? (c = this.trigger("copy", {
        target: this.name,
        text: n,
        cut: t.keyCode == 88,
        originalEvent: t
      })).isCancelled === true ? "" : (n = c.detail.text, c) : void 0;
    }
    getCellCopy(e, t) {
      return y.stripTags(this.getCellHTML(e, t));
    }
    paste(e, c) {
      var s = this.getSelection();
      let n = this.get(s[0].recid, true);
      var i, o, a, r = s[0].column, c = this.trigger("paste", {
        target: this.name,
        text: e,
        index: n,
        column: r,
        originalEvent: c
      });
      if (c.isCancelled !== true) {
        if (e = c.detail.text, this.selectType == "row" || s.length === 0) console.log("ERROR: You can paste only if grid.selectType = 'cell' and when at least one cell selected.");
        else {
          if (typeof e != "object") {
            var d = [];
            e = e.split(`
`);
            for (let b = 0; b < e.length; b++) {
              var p = e[b].split("	");
              let C = 0;
              var f = this.records[n], x = [];
              if (f != null) {
                for (let _ = 0; _ < p.length; _++) this.columns[r + C] && (i = f, o = this.columns[r + C].field, a = p[_], i.w2ui = i.w2ui ?? {}, i.w2ui.changes = i.w2ui.changes || {}, i.w2ui.changes[o] = a, x.push(r + C), C++);
                for (let _ = 0; _ < x.length; _++) d.push({
                  recid: f.recid,
                  column: x[_]
                });
                n++;
              }
            }
            this.selectNone(true), this.select(d);
          } else this.selectNone(true), this.select([
            {
              recid: this.records[n],
              column: r
            }
          ]);
          this.refresh();
        }
        c.finish();
      }
    }
    resize() {
      var e = Date.now();
      if (this.box && h(this.box).attr("name") == this.name) {
        var t = this.trigger("resize", {
          target: this.name
        });
        if (t.isCancelled !== true) return this.resizeBoxes(), this.resizeRecords(), t.finish(), Date.now() - e;
      }
    }
    update({ cells: e, fullCellRefresh: t, ignoreColumns: s } = {}) {
      var n = Date.now();
      let i = this;
      if (this.box == null) return 0;
      if (Array.isArray(e)) for (let p = 0; p < e.length; p++) {
        var o = e[p].index, a = e[p].column;
        if (!(o < 0)) if (o == null || a == null) console.log("ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]");
        else {
          var r = this.records[o] ?? {};
          r.w2ui = r.w2ui ?? {}, r.w2ui._update = r.w2ui._update ?? {
            cells: []
          };
          let f = r.w2ui._update.row1, x = r.w2ui._update.row2;
          f != null && f.isConnected && x != null && x.isColSelected || (f = this.box.querySelector(`#grid_${this.name}_rec_` + y.escapeId(r.recid)), x = this.box.querySelector(`#grid_${this.name}_frec_` + y.escapeId(r.recid)), r.w2ui._update.row1 = f, r.w2ui._update.row2 = x), d(r, f, x, o, a);
        }
      }
      else for (let p = this.last.range_start - 1; p <= this.last.range_end; p++) {
        let f = p;
        f = 0 < this.last.searchIds.length ? this.last.searchIds[p] : p;
        var c = this.records[f];
        if (!(f < 0 || c == null)) {
          c.w2ui = c.w2ui ?? {}, c.w2ui._update = c.w2ui._update ?? {
            cells: []
          };
          let x = c.w2ui._update.row1, b = c.w2ui._update.row2;
          x != null && x.isConnected && b != null && b.isColSelected || (x = this.box.querySelector(`#grid_${this.name}_rec_` + y.escapeId(c.recid)), b = this.box.querySelector(`#grid_${this.name}_frec_` + y.escapeId(c.recid)), c.w2ui._update.row1 = x, c.w2ui._update.row2 = b);
          for (let C = 0; C < this.columns.length; C++) d(c, x, b, f, C);
        }
      }
      return Date.now() - n;
      function d(p, f, x, b, C) {
        var _ = i.columns[C];
        if (!Array.isArray(s) || !s.includes(C) && !s.includes(_.field)) {
          let H = p.w2ui._update.cells[C];
          if (H != null && H.isConnected || (H = i.box.querySelector(`#grid_${i.name}_data_${b}_` + C), p.w2ui._update.cells[C] = H), H != null) {
            if (t) h(H).replace(i.getCellHTML(b, C, false)), H = i.box.querySelector(`#grid_${i.name}_data_${b}_` + C), p.w2ui._update.cells[C] = H;
            else {
              var S = H.children[0], { value: b, style: A, className: P } = i.getCellValue(b, C, false, true);
              if (S.innerHTML != b && (S.innerHTML = b), A != "" && H.style.cssText != A && (H.style.cssText = A), P != "") {
                let G = [
                  "w2ui-grid-data"
                ], W = [];
                S = P.split(" ").filter((V) => !!V), H.classList.forEach((V) => {
                  G.includes(V) || W.push(V);
                }), H.classList.remove(...W), H.classList.add(...S);
              }
            }
            if (i.columns[C].style && i.columns[C].style != H.style.cssText && (H.style.cssText = i.columns[C].style ?? ""), p.w2ui.class != null) {
              if (typeof p.w2ui.class == "string") {
                let U = [
                  "w2ui-odd",
                  "w2ui-even",
                  "w2ui-record"
                ], G = [];
                b = p.w2ui.class.split(" ").filter((W) => !!W), f && x && (f.classList.forEach((W) => {
                  U.includes(W) || G.push(W);
                }), f.classList.remove(...G), f.classList.add(...b), x.classList.remove(...G), x.classList.add(...b));
              }
              if (y.isPlainObject(p.w2ui.class) && typeof p.w2ui.class[_.field] == "string") {
                let U = [
                  "w2ui-grid-data"
                ], G = [];
                A = p.w2ui.class[_.field].split(" ").filter((W) => !!W), H.classList.forEach((W) => {
                  U.includes(W) || G.push(W);
                }), H.classList.remove(...G), H.classList.add(...A);
              }
            }
            p.w2ui.style != null && (f && x && typeof p.w2ui.style == "string" && f.style.cssText !== p.w2ui.style && (f.style.cssText = "height: " + i.recordHeight + "px;" + p.w2ui.style, f.setAttribute("custom_style", p.w2ui.style), x.style.cssText = "height: " + i.recordHeight + "px;" + p.w2ui.style, x.setAttribute("custom_style", p.w2ui.style)), y.isPlainObject(p.w2ui.style)) && typeof p.w2ui.style[_.field] == "string" && H.style.cssText !== p.w2ui.style[_.field] && (H.style.cssText = p.w2ui.style[_.field]);
          }
        }
      }
    }
    refreshCell(i, n) {
      var s = this.get(i, true), n = this.getColumn(n, true), i = !this.records[s] || this.records[s].recid != i, o = h(this.box).find(`${i ? ".w2ui-grid-summary " : ""}#grid_${this.name}_data_${s}_` + n);
      return o.length != 0 && (o.replace(this.getCellHTML(s, n, i)), true);
    }
    refreshRow(e, t = null) {
      let s = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(e)), n = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(e));
      if (0 < s.length) {
        t == null && (t = this.get(e, true));
        var i = s.attr("line"), o = !this.records[t] || this.records[t].recid != e, a = typeof this.url != "object" ? this.url : this.url.get;
        if (0 < this.searchData.length && !a) for (let c = 0; c < this.last.searchIds.length; c++) this.last.searchIds[c] == t && (t = c);
        a = this.getRecordHTML(t, i, o), s.replace(a[0]), n.replace(a[1]);
        let r = this.records[t].w2ui ? this.records[t].w2ui.style : "";
        return typeof r == "string" && (s = h(this.box).find("#grid_" + this.name + "_frec_" + y.escapeId(e)), n = h(this.box).find("#grid_" + this.name + "_rec_" + y.escapeId(e)), s.attr("custom_style", r), n.attr("custom_style", r), s.hasClass("w2ui-selected") && (r = r.replace("background-color", "none")), s[0].style.cssText = "height: " + this.recordHeight + "px;" + r, n[0].style.cssText = "height: " + this.recordHeight + "px;" + r), o && this.resize(), true;
      }
      return false;
    }
    refresh() {
      var e = Date.now(), t = typeof this.url != "object" ? this.url : this.url.get;
      if (this.total <= 0 && !t && this.searchData.length === 0 && (this.total = this.records.length), this.box && (t = this.trigger("refresh", {
        target: this.name
      }), t.isCancelled !== true)) {
        this.show.header ? h(this.box).find(`#grid_${this.name}_header`).html(y.lang(this.header) + "&#160;").show() : h(this.box).find(`#grid_${this.name}_header`).hide(), this.show.toolbar ? h(this.box).find("#grid_" + this.name + "_toolbar").show() : h(this.box).find("#grid_" + this.name + "_toolbar").hide(), this.searchClose();
        var s = h(this.box).find("#grid_" + this.name + "_search_all");
        !this.multiSearch && this.last.field == "all" && 0 < this.searches.length && (this.last.field = this.searches[0].field, this.last.label = this.searches[0].label);
        for (let a = 0; a < this.searches.length; a++) this.searches[a].field == this.last.field && (this.last.label = this.searches[a].label);
        if (this.last.multi ? s.attr("placeholder", "[" + y.lang("Multiple Fields") + "]") : s.attr("placeholder", y.lang("Search") + " " + y.lang(this.last.label, true)), s.val() != this.last.search) {
          let a = this.last.search;
          var n = s._w2field;
          n && (a = n.format(a)), s.val(a);
        }
        this.refreshSearch(), this.refreshBody(), this.show.footer ? h(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()).show() : h(this.box).find(`#grid_${this.name}_footer`).hide();
        var n = this.last.selection, s = 0 < this.records.length && n.indexes.length == this.records.length, n = 0 < n.indexes.length && this.searchData.length !== 0 && n.indexes.length == this.last.searchIds.length, i = (s || n ? h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true) : h(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false), this.status(), this.find({
          "w2ui.expanded": true
        }, true, true));
        for (let a = 0; a < i.length; a++) {
          var o = this.records[i[a]].w2ui;
          o && !Array.isArray(o.children) && (o.expanded = false);
        }
        return this.markSearch && setTimeout(() => {
          var a = [];
          for (let d = 0; d < this.searchData.length; d++) {
            var r = this.searchData[d], c = this.getSearch(r.field);
            c && !c.hidden && (c = this.getColumn(r.field, true), a.push({
              field: r.field,
              search: r.value,
              col: c
            }));
          }
          0 < a.length && a.forEach((d) => {
            var p = h(this.box).find('td[col="' + d.col + '"]:not(.w2ui-head)');
            y.marker(p, d.search);
          });
        }, 50), this.updateToolbar(this.last.selection), t.finish(), this.resize(), this.addRange("selection"), setTimeout(() => {
          this.resize(), this.scroll();
        }, 1), this.reorderColumns && !this.last.columnDrag ? this.last.columnDrag = this.initColumnDrag() : !this.reorderColumns && this.last.columnDrag && this.last.columnDrag.remove(), Date.now() - e;
      }
    }
    refreshSearch() {
      if (this.multiSearch && 0 < this.searchData.length) {
        h(this.box).find(".w2ui-grid-searches").length == 0 && h(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + 35 + "px").append(`<div id="grid_${this.name}_searches" class="w2ui-grid-searches"></div>`);
        let e = `
                <span id="grid_${this.name}_search_logic" class="w2ui-grid-search-logic"></span>
                <div class="grid-search-line"></div>`;
        this.searchData.forEach((t, s) => {
          var n = this.getSearch(t.field, true), i = this.searches[n];
          let o;
          if (o = Array.isArray(t.value) ? `<span class="grid-search-count">${t.value.length}</span>` : i && i.type == "list" && t.text && t.text !== t.value ? ": " + t.text : ": " + t.value, i && i.type == "date") if (t.operator == "between") {
            let a = t.value[0], r = t.value[1];
            Number(a) === a && (a = y.formatDate(a)), Number(r) === r && (r = y.formatDate(r)), o = `: ${a} - ` + r;
          } else {
            let a = t.value, r = (Number(a) == a && (a = y.formatDate(a)), t.operator);
            (r = (r = r == "more" ? "since" : r) == "less" ? "before" : r).substr(0, 5) == "more:" && (r = "since"), o = `: ${r} ` + a;
          }
          e += `<span class="w2ui-action" data-click="searchFieldTooltip|${n}|${s}|this">
                    ${i ? i.label : ""}
                    ${o}
                    <span class="icon-chevron-down"></span>
                </span>`;
        }), e += `
                ${this.show.searchSave ? `<div class="grid-search-line"></div>
                       <button class="w2ui-btn grid-search-btn" data-click="searchSave">${y.lang("Save")}</button>
                      ` : ""}
                <button class="w2ui-btn grid-search-btn btn-remove"
                    data-click="searchReset">X</button>
            `, h(this.box).find(`#grid_${this.name}_searches`).html(e), h(this.box).find(`#grid_${this.name}_search_logic`).html(y.lang(this.last.logic == "AND" ? "All" : "Any"));
      } else h(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + "px").find(".w2ui-grid-searches").remove();
      this.searchSelected ? (h(this.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true), h(this.box).find(`#grid_${this.name}_search_name`).show().find(".name-text").html(this.searchSelected.text)) : (h(this.box).find(`#grid_${this.name}_search_all`).prop("readOnly", false), h(this.box).find(`#grid_${this.name}_search_name`).hide().find(".name-text").html("")), y.bindEvents(h(this.box).find(`#grid_${this.name}_searches .w2ui-action, #grid_${this.name}_searches button`), this);
    }
    refreshBody() {
      this.scroll();
      var t = this.getRecordsHTML(), e = this.getColumnsHTML(), t = '<div id="grid_' + this.name + '_frecords" class="w2ui-grid-frecords" style="margin-bottom: ' + (y.scrollBarSize() - 1) + 'px;">' + t[0] + '</div><div id="grid_' + this.name + '_records" class="w2ui-grid-records">' + t[1] + '</div><div id="grid_' + this.name + '_scroll1" class="w2ui-grid-scroll1" style="height: ' + y.scrollBarSize() + 'px"></div><div id="grid_' + this.name + '_fcolumns" class="w2ui-grid-fcolumns">    <table><tbody>' + e[0] + '</tbody></table></div><div id="grid_' + this.name + '_columns" class="w2ui-grid-columns">    <table><tbody>' + e[1] + `</tbody></table></div><div class="w2ui-intersection-marker" style="display: none; height: ${this.recordHeight - 5}px">
               <div class="top-marker"></div>
               <div class="bottom-marker"></div>
            </div>`;
      let s = h(this.box).find(`#grid_${this.name}_body`, this.box).html(t);
      e = h(this.box).find(`#grid_${this.name}_records`, this.box), t = h(this.box).find(`#grid_${this.name}_frecords`, this.box), this.selectType == "row" && (e.on("mouseover mouseout", {
        delegate: "tr"
      }, (n) => {
        var i = h(n.delegate).attr("recid");
        h(this.box).find(`#grid_${this.name}_frec_` + y.escapeId(i)).toggleClass("w2ui-record-hover", n.type == "mouseover");
      }), t.on("mouseover mouseout", {
        delegate: "tr"
      }, (n) => {
        var i = h(n.delegate).attr("recid");
        h(this.box).find(`#grid_${this.name}_rec_` + y.escapeId(i)).toggleClass("w2ui-record-hover", n.type == "mouseover");
      })), y.isIOS ? e.append(t).on("click", {
        delegate: "tr"
      }, (n) => {
        var i = h(n.delegate).attr("recid");
        this.dblClick(i, n);
      }) : e.add(t).on("click", {
        delegate: "tr"
      }, (n) => {
        var i = h(n.delegate).attr("recid");
        i != "-none-" && this.click(i, n);
      }).on("contextmenu", {
        delegate: "tr"
      }, (n) => {
        var i = h(n.delegate).attr("recid"), o = h(n.target).closest("td"), o = parseInt(o.attr("col") ?? -1);
        this.showContextMenu(i, o, n);
      }).on("mouseover", {
        delegate: "tr"
      }, (n) => {
        this.last.rec_out = false;
        let i = h(n.delegate).attr("index"), o = h(n.delegate).attr("recid");
        i !== this.last.rec_over && (this.last.rec_over = i, setTimeout(() => {
          delete this.last.rec_out, this.trigger("mouseEnter", {
            target: this.name,
            originalEvent: n,
            index: i,
            recid: o
          }).finish();
        }));
      }).on("mouseout", {
        delegate: "tr"
      }, (n) => {
        let i = h(n.delegate).attr("index"), o = h(n.delegate).attr("recid");
        this.last.rec_out = true, setTimeout(() => {
          let a = () => {
            this.trigger("mouseLeave", {
              target: this.name,
              originalEvent: n,
              index: i,
              recid: o
            }).finish();
          };
          i !== this.last.rec_over && a(), setTimeout(() => {
            this.last.rec_out && (delete this.last.rec_out, delete this.last.rec_over, a());
          });
        });
      }), s.data("scroll", {
        lastDelta: 0,
        lastTime: 0
      }).find(".w2ui-grid-frecords").on("mousewheel DOMMouseScroll ", (a) => {
        a.preventDefault();
        var i = s.data("scroll"), o = s.find(".w2ui-grid-records"), a = typeof a.wheelDelta != null ? -a.wheelDelta : a.detail || a.deltaY, r = o.prop("scrollTop");
        i.lastDelta += a, a = Math.round(i.lastDelta), s.data("scroll", i), o.get(0).scroll({
          top: r + a,
          behavior: "smooth"
        });
      }), e.off(".body-global").on("scroll.body-global", {
        delegate: ".w2ui-grid-records"
      }, (n) => {
        this.scroll(n);
      }), h(this.box).find(".w2ui-grid-body").off(".body-global").on("click.body-global dblclick.body-global contextmenu.body-global", {
        delegate: "td.w2ui-head"
      }, (n) => {
        var i = h(n.delegate).attr("col"), o = this.columns[i] ?? {
          field: i
        };
        switch (n.type) {
          case "click":
            this.columnClick(o.field, n);
            break;
          case "dblclick":
            this.columnDblClick(o.field, n);
            break;
          case "contextmenu":
            this.columnContextMenu(o.field, n);
        }
      }).on("mouseover.body-global", {
        delegate: ".w2ui-col-header"
      }, (n) => {
        let i = h(n.delegate).parent().attr("col");
        this.columnTooltipShow(i, n), h(n.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
          this.columnTooltipHide(i, n);
        });
      }).on("click.body-global", {
        delegate: "input.w2ui-select-all"
      }, (n) => {
        n.delegate.checked ? this.selectAll() : this.selectNone(), n.stopPropagation(), clearTimeout(this.last.kbd_timer);
      }).on("click.body-global", {
        delegate: ".w2ui-show-children, .w2ui-col-expand"
      }, (n) => {
        n.stopPropagation(), this.toggle(h(n.target).parents("tr").attr("recid"));
      }).on("click.body-global mouseover.body-global", {
        delegate: ".w2ui-info"
      }, (n) => {
        var _a2, _b;
        var i = h(n.delegate).closest("td"), o = i.parent(), a = this.columns[i.attr("col")], r = o.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
        [
          "mouseenter",
          "mouseover"
        ].includes((_b = (_a2 = a.info) == null ? void 0 : _a2.showOn) == null ? void 0 : _b.toLowerCase()) && n.type == "mouseover" ? this.showBubble(o.attr("index"), i.attr("col"), r).then(() => {
          h(n.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
            ct.hide(this.name + "-bubble");
          });
        }) : n.type == "click" && (ct.hide(this.name + "-bubble"), this.showBubble(o.attr("index"), i.attr("col"), r));
      }).on("mouseover.body-global", {
        delegate: ".w2ui-clipboard-copy"
      }, (n) => {
        if (!n.delegate._tooltipShow) {
          let o = h(n.delegate).parent(), a = o.parent();
          var i = this.columns[o.attr("col")];
          let r = a.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
          ct.show({
            name: this.name + "-bubble",
            anchor: n.delegate,
            html: y.lang(typeof i.clipboardCopy == "string" ? i.clipboardCopy : "Copy to clipboard"),
            position: "top|bottom",
            offsetY: -2
          }).hide((c) => {
            n.delegate._tooltipShow = false, h(n.delegate).off(".tooltip");
          }), h(n.delegate).off(".tooltip").on("mouseleave.tooltip", (c) => {
            ct.hide(this.name + "-bubble");
          }).on("click.tooltip", (c) => {
            c.stopPropagation(), ct.update(this.name + "-bubble", y.lang("Copied")), this.clipboardCopy(a.attr("index"), o.attr("col"), r);
          }), n.delegate._tooltipShow = true;
        }
      }).on("click.body-global", {
        delegate: ".w2ui-editable-checkbox"
      }, (n) => {
        var i = h(n.delegate).data();
        this.editChange.call(this, n.delegate, i.changeind, i.colind, n), this.updateToolbar();
      }), this.records.length === 0 && this.msgEmpty ? h(this.box).find(`#grid_${this.name}_body`).append(`<div id="grid_${this.name}_empty_msg" class="w2ui-grid-empty-msg"><div>${y.lang(this.msgEmpty)}</div></div>`) : 0 < h(this.box).find(`#grid_${this.name}_empty_msg`).length && h(this.box).find(`#grid_${this.name}_empty_msg`).remove(), 0 < this.summary.length ? (t = this.getSummaryHTML(), h(this.box).find(`#grid_${this.name}_fsummary`).html(t[0]).show(), h(this.box).find(`#grid_${this.name}_summary`).html(t[1]).show()) : (h(this.box).find(`#grid_${this.name}_fsummary`).hide(), h(this.box).find(`#grid_${this.name}_summary`).hide());
    }
    render(e) {
      var t = Date.now();
      let s = this;
      typeof e == "string" && (e = h(e).get(0));
      var n = this.trigger("render", {
        target: this.name,
        box: e ?? this.box
      });
      if (n.isCancelled !== true && (e != null && (0 < h(this.box).find(`#grid_${this.name}_body`).length && h(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), this.box = e), this.box)) {
        let a = function(d) {
          var _a2, _b;
          if (d.target.tagName) {
            var p = s.last.move;
            if (p && [
              "select",
              "select-column"
            ].indexOf(p.type) != -1 && (p.divX = d.screenX - p.x, p.divY = d.screenY - p.y, !(Math.abs(p.divX) <= 1 && Math.abs(p.divY) <= 1))) if (s.last.cancelClick = true, s.reorderRows == 1 && s.last.move.reorder) {
              let U = h(d.target).parents("tr").attr("recid");
              (U = U == "-none-" ? "bottom" : U) != p.from && (x = h(s.box).find("#grid_" + s.name + "_rec_" + U), h(s.box).find(".insert-before"), x.addClass("insert-before"), p.lastY = d.screenY, p.to = U, x = {
                top: (_a2 = x.get(0)) == null ? void 0 : _a2.offsetTop,
                left: (_b = x.get(0)) == null ? void 0 : _b.offsetLeft
              }, h(s.box).find("#grid_" + s.name + "_ghost_line").css({
                top: x.top + "px",
                left: p.pos.left + "px",
                "border-top": "2px solid #769EFC"
              })), h(s.box).find("#grid_" + s.name + "_ghost").css({
                top: p.pos.top + p.divY + "px",
                left: p.pos.left + "px"
              });
            } else {
              p.start && p.recid && (s.selectNone(), p.start = false);
              var f = [], x = (d.target.tagName.toUpperCase() == "TR" ? h(d.target) : h(d.target).parents("tr")).attr("recid");
              if (x == null) {
                if (s.selectType != "row" && (!s.last.move || s.last.move.type != "select")) {
                  var b = parseInt(h(d.target).parents("td").attr("col"));
                  if (isNaN(b)) s.removeRange("column-selection"), h(s.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected"), h(s.box).find(".w2ui-col-number").removeClass("w2ui-row-selected"), delete p.colRange;
                  else {
                    let U = b + "-" + b;
                    p.column < b && (U = p.column + "-" + b);
                    var C = [], _ = (U = p.column > b ? b + "-" + p.column : U).split("-");
                    for (let G = parseInt(_[0]); G <= parseInt(_[1]); G++) C.push(G);
                    if (p.colRange != U && (o = s.trigger("columnSelect", {
                      target: s.name,
                      columns: C
                    })).isCancelled !== true) {
                      p.colRange == null && s.selectNone();
                      var S = U.split("-");
                      h(s.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected");
                      for (let G = parseInt(S[0]); G <= parseInt(S[1]); G++) h(s.box).find("#grid_" + s.name + "_column_" + G + " .w2ui-col-header").addClass("w2ui-col-selected");
                      h(s.box).find(".w2ui-col-number").not(".w2ui-head").addClass("w2ui-row-selected"), p.colRange = U, s.removeRange("column-selection"), s.addRange({
                        name: "column-selection",
                        range: [
                          {
                            recid: s.records[0].recid,
                            column: S[0]
                          },
                          {
                            recid: s.records[s.records.length - 1].recid,
                            column: S[1]
                          }
                        ],
                        style: "background-color: rgba(90, 145, 234, 0.1)"
                      });
                    }
                  }
                }
              } else {
                let U = s.get(p.recid, true);
                if (!(U == null || s.records[U] && s.records[U].recid != p.recid)) {
                  let G = s.get(x, true);
                  if (G != null) {
                    let W = parseInt(p.column), V = parseInt((d.target.tagName.toUpperCase() == "TD" ? h(d.target) : h(d.target).parents("td")).attr("col"));
                    isNaN(W) && isNaN(V) && (W = 0, V = s.columns.length - 1), U > G && (b = U, U = G, G = b);
                    var A, x = "ind1:" + U + ",ind2;" + G + ",col1:" + W + ",col2:" + V;
                    if (p.range != x) {
                      p.range = x;
                      for (let D = U; D <= G; D++) if (!(0 < s.last.searchIds.length && s.last.searchIds.indexOf(D) == -1)) if (s.selectType != "row") {
                        W > V && (A = W, W = V, V = A);
                        for (let R = W; R <= V; R++) s.columns[R].hidden || f.push({
                          recid: s.records[D].recid,
                          column: parseInt(R)
                        });
                      } else f.push(s.records[D].recid);
                      if (s.selectType != "row") {
                        var P = s.getSelection();
                        let D = [];
                        for (let R = 0; R < f.length; R++) {
                          let X = false;
                          for (let Q = 0; Q < P.length; Q++) f[R].recid == P[Q].recid && f[R].column == P[Q].column && (X = true);
                          X || D.push({
                            recid: f[R].recid,
                            column: f[R].column
                          });
                        }
                        s.select(D), D = [];
                        for (let R = 0; R < P.length; R++) {
                          let X = false;
                          for (let Q = 0; Q < f.length; Q++) f[Q].recid == P[R].recid && f[Q].column == P[R].column && (X = true);
                          X || D.push({
                            recid: P[R].recid,
                            column: P[R].column
                          });
                        }
                        s.unselect(D);
                      } else if (s.multiSelect) {
                        var H = s.getSelection();
                        for (let D = 0; D < f.length; D++) H.indexOf(f[D]) == -1 && s.select(f[D]);
                        for (let D = 0; D < H.length; D++) f.indexOf(H[D]) == -1 && s.unselect(H[D]);
                      }
                    }
                  }
                }
              }
            }
          }
        }, r = function(d) {
          var p = s.last.move;
          if (setTimeout(() => {
            delete s.last.cancelClick;
          }, 1), !h(d.target).parents().hasClass(".w2ui-head") && !h(d.target).hasClass(".w2ui-head")) {
            if (p && [
              "select",
              "select-column"
            ].indexOf(p.type) != -1) {
              if (p.colRange != null && o.isCancelled !== true) {
                var f = p.colRange.split("-"), x = [];
                for (let _ = 0; _ < s.records.length; _++) {
                  var b = [];
                  for (let S = parseInt(f[0]); S <= parseInt(f[1]); S++) b.push(S);
                  x.push({
                    recid: s.records[_].recid,
                    column: b
                  });
                }
                s.removeRange("column-selection"), o.finish(), s.select(x);
              }
              if (s.reorderRows == 1 && s.last.move.reorder) if (p.to != null) {
                if (d = s.trigger("reorderRow", {
                  target: s.name,
                  recid: p.from,
                  moveBefore: p.to
                }), d.isCancelled === true) return c(), void delete s.last.move;
                var C = s.get(p.from, true);
                let _ = s.get(p.to, true);
                p.to == "bottom" && (_ = s.records.length), p = s.records[C], C != null && _ != null && (s.records.splice(C, 1), C > _ ? s.records.splice(_, 0, p) : s.records.splice(_ - 1, 0, p)), s.sortData = [], h(s.box).find(`#grid_${s.name}_columns .w2ui-col-header`).removeClass("w2ui-col-sorted"), c(), d.finish();
              } else c();
            }
            delete s.last.move, h(document).off(".w2ui-" + s.name);
          }
        }, c = function() {
          h(s.box).find(`#grid_${s.name}_ghost`).remove(), h(s.box).find(`#grid_${s.name}_ghost_line`).remove(), s.refresh(), delete s.last.move;
        };
        if (e = typeof this.url != "object" ? this.url : this.url.get, this.reset(true), !this.last.field) if (this.multiSearch && this.show.searchAll) this.last.field = "all", this.last.label = "All Fields";
        else {
          let d = 0;
          for (; d < this.searches.length && (this.searches[d].hidden || this.searches[d].simple === false); ) d++;
          d >= this.searches.length ? (this.last.field = "", this.last.label = "") : (this.last.field = this.searches[d].field, this.last.label = this.searches[d].label);
        }
        if (h(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-grid w2ui-inactive").html('<div class="w2ui-grid-box">    <div id="grid_' + this.name + '_header" class="w2ui-grid-header"></div>    <div id="grid_' + this.name + '_toolbar" class="w2ui-grid-toolbar"></div>    <div id="grid_' + this.name + '_body" class="w2ui-grid-body"></div>    <div id="grid_' + this.name + '_fsummary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_summary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_footer" class="w2ui-grid-footer"></div>    <textarea id="grid_' + this.name + '_focus" class="w2ui-grid-focus-input" ' + (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : "") + (y.isIOS ? "readonly" : "") + "></textarea></div>"), this.selectType != "row" && h(this.box).addClass("w2ui-ss"), 0 < h(this.box).length && (h(this.box)[0].style.cssText += this.style), this.initToolbar(), this.toolbar != null && this.toolbar.render(h(this.box).find("#grid_" + this.name + "_toolbar")[0]), this.last.toolbar_height = h(this.box).find(`#grid_${this.name}_toolbar`).prop("offsetHeight"), this.last.field && this.last.field != "all") {
          let d = this.searchData;
          setTimeout(() => {
            this.searchInitInput(this.last.field, d.length == 1 ? d[0].value : null);
          }, 1);
        }
        h(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()), this.last.state || (this.last.state = this.stateSave(true)), this.stateRestore(), e && (this.clear(), this.refresh());
        let i = false;
        for (let d = 0; d < this.searches.length; d++) if (this.searches[d].hidden) {
          i = true;
          break;
        }
        i ? (this.searchReset(false), e || setTimeout(() => {
          this.searchReset();
        }, 1)) : this.reload(), h(this.box).find(`#grid_${this.name}_focus`).on("focus", (d) => {
          clearTimeout(this.last.kbd_timer), this.hasFocus || this.focus();
        }).on("blur", (d) => {
          clearTimeout(this.last.kbd_timer), this.last.kbd_timer = setTimeout(() => {
            this.hasFocus && this.blur();
          }, 100);
        }).on("paste", (d) => {
          var p = d.clipboardData || null;
          if (p) {
            let b = p.items, C = [];
            for (var f in b = b.length == 2 && (b = b.length == 2 && b[1].kind == "file" ? [
              b[1]
            ] : b).length == 2 && b[0].type == "text/plain" && b[1].type == "text/html" ? [
              b[1]
            ] : b) if (f = b[f], f.kind === "file") {
              var x = f.getAsFile();
              C.push({
                kind: "file",
                data: x
              });
            } else if (f.kind === "string" && (f.type === "text/plain" || f.type === "text/html")) {
              d.preventDefault();
              let _ = p.getData("text/plain");
              _.indexOf("\r") != -1 && _.indexOf(`
`) == -1 && (_ = _.replace(/\r/g, `
`)), C.push({
                kind: f.type == "text/html" ? "html" : "text",
                data: _
              });
            }
            C.length === 1 && C[0].kind != "file" && (C = C[0].data), Bs[this.name].paste(C, d), d.preventDefault();
          }
        }).on("keydown", function(d) {
          Bs[s.name].keydown.call(Bs[s.name], d);
        });
        let o;
        return h(this.box).off("mousedown.mouseStart").on("mousedown.mouseStart", function(d) {
          if (d.which == 1 && (s.last.userSelect == "text" && (s.last.userSelect = "", h(s.box).find(".w2ui-grid-body").css("user-select", "none")), !(s.selectType == "row" && (h(d.target).parents().hasClass("w2ui-head") || h(d.target).hasClass("w2ui-head")) || s.last.move && s.last.move.type == "expand"))) {
            if (d.altKey) h(s.box).find(".w2ui-grid-body").css("user-select", "text"), s.selectNone(), s.last.move = {
              type: "text-select"
            }, s.last.userSelect = "text";
            else {
              let S = d.target;
              var p = {
                x: d.offsetX - 10,
                y: d.offsetY - 10
              };
              let A = false;
              for (; S && (!S.classList || !S.classList.contains("w2ui-grid")); ) S.tagName && S.tagName.toUpperCase() == "TD" && (A = true), S.tagName && S.tagName.toUpperCase() != "TR" && A == 1 && (p.x += S.offsetLeft, p.y += S.offsetTop), S = S.parentNode;
              s.last.move = {
                x: d.screenX,
                y: d.screenY,
                divX: 0,
                divY: 0,
                focusX: p.x,
                focusY: p.y,
                recid: h(d.target).parents("tr").attr("recid"),
                column: parseInt((d.target.tagName.toUpperCase() == "TD" ? h(d.target) : h(d.target).parents("td")).attr("col")),
                type: "select",
                ghost: false,
                start: true
              }, s.last.move.recid == null && (s.last.move.type = "select-column");
              let P = d.target, H = h(s.box).find("#grid_" + s.name + "_focus");
              if (s.last.move) {
                let U = s.last.move.focusX, G = s.last.move.focusY;
                var f = h(P).parents("table").parent();
                (f.hasClass("w2ui-grid-records") || f.hasClass("w2ui-grid-frecords") || f.hasClass("w2ui-grid-columns") || f.hasClass("w2ui-grid-fcolumns") || f.hasClass("w2ui-grid-summary")) && (U = s.last.move.focusX - h(s.box).find("#grid_" + s.name + "_records").prop("scrollLeft"), G = s.last.move.focusY - h(s.box).find("#grid_" + s.name + "_records").prop("scrollTop")), (h(P).hasClass("w2ui-grid-footer") || 0 < h(P).parents("div.w2ui-grid-footer").length) && (G = h(s.box).find("#grid_" + s.name + "_footer").get(0).offsetTop), f.hasClass("w2ui-scroll-wrapper") && f.parent().hasClass("w2ui-toolbar") && (U = s.last.move.focusX - f.prop("scrollLeft")), H.css({
                  left: U - 10,
                  top: G
                });
              }
              setTimeout(() => {
                var _a2;
                s.last.inEditMode || ([
                  "INPUT",
                  "TEXTAREA",
                  "SELECT"
                ].includes(P.tagName) ? P.focus() : H.get(0) !== document.active && ((_a2 = H.get(0)) == null ? void 0 : _a2.focus({
                  preventScroll: true
                })));
              }, 50), s.multiSelect || s.reorderRows || s.last.move.type != "drag" || delete s.last.move;
            }
            if (s.reorderRows == 1) {
              let S = d.target;
              var x, b, C, _;
              S.tagName.toUpperCase() != "TD" && (S = h(S).parents("td")[0]), h(S).hasClass("w2ui-col-number") || h(S).hasClass("w2ui-col-order") ? (s.selectNone(), s.last.move.reorder = true, f = h(s.box).find(".w2ui-even.w2ui-empty-record").css("background-color"), x = h(s.box).find(".w2ui-odd.w2ui-empty-record").css("background-color"), h(s.box).find(".w2ui-even td").filter(":not(.w2ui-col-number)").css("background-color", f), h(s.box).find(".w2ui-odd td").filter(":not(.w2ui-col-number)").css("background-color", x), x = s.last.move, b = h(s.box).find(".w2ui-grid-records"), x.ghost || (C = h(s.box).find(`#grid_${s.name}_rec_` + x.recid), _ = C.parents("table").find("tr:first-child").get(0).cloneNode(true), x.offsetY = d.offsetY, x.from = x.recid, x.pos = {
                top: C.get(0).offsetTop - 1,
                left: C.get(0).offsetLeft
              }, x.ghost = h(C.get(0).cloneNode(true)), x.ghost.removeAttr("id"), x.ghost.find("td").css({
                "border-top": "1px solid silver",
                "border-bottom": "1px solid silver"
              }), C.find("td").remove(), C.append(`<td colspan="1000"><div class="w2ui-reorder-empty" style="height: ${s.recordHeight - 2}px"></div></td>`), b.append('<div id="grid_' + s.name + '_ghost_line" style="position: absolute; z-index: 999999; pointer-events: none; width: 100%;"></div>'), b.append('<table id="grid_' + s.name + '_ghost" style="position: absolute; z-index: 999998; opacity: 0.9; pointer-events: none;"></table>'), h(s.box).find("#grid_" + s.name + "_ghost").append(_).append(x.ghost)), h(s.box).find("#grid_" + s.name + "_ghost").css({
                top: x.pos.top + "px",
                left: x.pos.left + "px"
              })) : s.last.move.reorder = false;
            }
            h(document).on("mousemove.w2ui-" + s.name, a).on("mouseup.w2ui-" + s.name, r), d.stopPropagation();
          }
        }), this.updateToolbar(), n.finish(), this.last.observeResize = new ResizeObserver(() => {
          this.resize();
        }), this.last.observeResize.observe(this.box), Date.now() - t;
      }
    }
    destroy() {
      var _a2;
      var e = this.trigger("destroy", {
        target: this.name
      });
      e.isCancelled !== true && (h(this.box).off(), typeof this.toolbar == "object" && this.toolbar.destroy && this.toolbar.destroy(), 0 < h(this.box).find(`#grid_${this.name}_body`).length && h(this.box).removeAttr("name").removeClass("w2ui-reset w2ui-grid w2ui-inactive").html(""), (_a2 = this.last.observeResize) == null ? void 0 : _a2.disconnect(), delete Bs[this.name], e.finish());
    }
    initColumnOnOff() {
      var e, t = [
        {
          id: "line-numbers",
          text: "Line #",
          checked: this.show.lineNumbers
        }
      ];
      for (let i = 0; i < this.columns.length; i++) {
        var s = this.columns[i];
        let o = this.columns[i].text;
        s.hideable !== false && (o = (o = !o && this.columns[i].tooltip ? this.columns[i].tooltip : o) || "- column " + (parseInt(i) + 1) + " -", t.push({
          id: s.field,
          text: y.stripTags(o),
          checked: !s.hidden
        }));
      }
      ((typeof this.url != "object" ? this.url : this.url.get) && this.show.skipRecords || this.show.saveRestoreState) && t.push({
        text: "--"
      }), this.show.skipRecords && (e = y.lang("Skip") + `<input id="${this.name}_skip" type="text" class="w2ui-input w2ui-grid-skip" value="${this.offset}">` + y.lang("records"), t.push({
        id: "w2ui-skip",
        text: e,
        group: false,
        icon: "w2ui-icon-empty"
      })), this.show.saveRestoreState && t.push({
        id: "w2ui-stateSave",
        text: y.lang("Save Grid State"),
        icon: "w2ui-icon-empty",
        group: false
      }, {
        id: "w2ui-stateReset",
        text: y.lang("Restore Default State"),
        icon: "w2ui-icon-empty",
        group: false
      });
      let n = [];
      return t.forEach((i) => {
        i.text = y.lang(i.text), i.checked && n.push(i.id);
      }), this.toolbar.set("w2ui-column-on-off", {
        selected: n,
        items: t
      }), t;
    }
    initColumnDrag(e) {
      if (this.columnGroups && this.columnGroups.length) throw "Draggable columns are not currently supported with column groups.";
      let t = this, s = {
        pressed: false,
        targetPos: null,
        columnHead: null
      }, n = (a, r) => {
        var c = [
          "w2ui-col-number",
          "w2ui-col-expand",
          "w2ui-col-select"
        ];
        r !== true && c.push("w2ui-head-last");
        for (let d = 0; d < c.length; d++) if (h(a).closest(".w2ui-head").hasClass(c[d])) return true;
        return false;
      };
      function i(a) {
        var r, c, d, p;
        s.pressed && s.columnHead && (r = a.pageX, c = a.pageY, n(a.target, true) || (a = a, h(a.target).closest("td").length != 0 && (p = h(t.box).find(".w2ui-grid-body").get(0).getBoundingClientRect(), d = h(a.target).closest("td").get(0).getBoundingClientRect(), h(t.box).find(".w2ui-intersection-marker").show().css({
          left: d.left - p.left + "px"
        }), d = h(a.target).closest("td"), s.targetPos = d.hasClass("w2ui-head-last") ? t.columns.length : parseInt(d.attr("col")))), p = r, a = c, h(s.ghost).css({
          left: p - 10 + "px",
          top: a - 10 + "px"
        }).show());
      }
      function o(a) {
        if (s.pressed && s.columnHead) {
          s.pressed = false;
          var r, c, d = () => {
            var p = h(t.box).find(".w2ui-grid-ghost");
            h(t.box).find(".w2ui-intersection-marker").hide(), h(s.ghost).remove(), p.remove(), h(document).off(".colDrag"), s = {};
          };
          if (a.pageX == s.initialX && a.pageY == s.initialY) t.columnClick(t.columns[s.originalPos].field, a), d();
          else {
            if ((a = t.trigger("columnDragEnd", {
              originalEvent: a,
              target: s.columnHead[0],
              dragData: s
            })).isCancelled === true) return false;
            r = t.columns[s.originalPos], c = t.columns, s.originalPos != s.targetPos && s.targetPos != null && (c.splice(s.targetPos, 0, y.clone(r)), c.splice(c.indexOf(r), 1)), d(), t.refresh(), a.finish({
              targetColumn: NaN
            });
          }
        }
      }
      return h(t.box).off(".colDrag").on("mousedown.colDrag", function(a) {
        if (!s.pressed && s.numberPreColumnsPresent !== 0 && a.button === 0) {
          var r, c;
          if (h(a.target).parents().hasClass("w2ui-head") && !n(a.target)) {
            if (s.pressed = true, s.initialX = a.pageX, s.initialY = a.pageY, s.numberPreColumnsPresent = h(t.box).find(".w2ui-head.w2ui-col-number, .w2ui-head.w2ui-col-expand, .w2ui-head.w2ui-col-select").length, s.columnHead = d = h(a.target).closest(".w2ui-head"), s.originalPos = c = parseInt(d.attr("col"), 10), (c = t.trigger("columnDragStart", {
              originalEvent: a,
              origColumnNumber: c,
              target: d[0]
            })).isCancelled === true) return false;
            r = s.columns = h(t.box).find(".w2ui-head:not(.w2ui-head-last)"), h(document).on("mouseup.colDrag", o), h(document).on("mousemove.colDrag", i);
            var d = t.columns[s.originalPos], d = y.lang(typeof d.text == "function" ? d.text(d) : d.text);
            s.ghost = h.html(`<span col="${s.originalPos}">${d}</span>`)[0], h(document.body).append(s.ghost), h(s.ghost).css({
              display: "none",
              left: a.pageX,
              top: a.pageY,
              opacity: 1,
              margin: "3px 0 0 20px",
              padding: "3px",
              "background-color": "white",
              position: "fixed",
              "z-index": 999999
            }).addClass(".w2ui-grid-ghost"), s.offsets = [];
            for (let f = 0, x = r.length; f < x; f++) {
              var p = r[f].getBoundingClientRect();
              s.offsets.push(p.left);
            }
            c.finish();
          }
        }
      }), {
        remove() {
          h(t.box).off(".colDrag"), t.last.columnDrag = false;
        }
      };
    }
    columnOnOff(e, t) {
      if (e = this.trigger("columnOnOff", {
        target: this.name,
        field: t,
        originalEvent: e
      }), e.isCancelled !== true) {
        var s = this.find({
          "w2ui.expanded": true
        }, true);
        for (let i = 0; i < s.length; i++) {
          var n = this.records[i].w2ui;
          n && !Array.isArray(n.children) && (this.records[i].w2ui.expanded = false);
        }
        t == "line-numbers" ? (this.show.lineNumbers = !this.show.lineNumbers, this.refresh()) : (t = this.getColumn(t)).hidden ? this.showColumn(t.field) : this.hideColumn(t.field), e.finish();
      }
    }
    initToolbar() {
      if (this.toolbar.render == null) {
        let t = this.toolbar.items || [];
        var e;
        this.toolbar.items = [], this.toolbar = new vc(y.extend({}, this.toolbar, {
          name: this.name + "_toolbar",
          owner: this
        })), this.show.toolbarReload && this.toolbar.items.push(y.extend({}, this.buttons.reload)), this.show.toolbarColumns && this.toolbar.items.push(y.extend({}, this.buttons.columns)), this.show.toolbarSearch && (e = `
                <div class="w2ui-grid-search-input">
                    ${this.buttons.search.html}
                    <div id="grid_${this.name}_search_name" class="w2ui-grid-search-name">
                        <span class="name-icon w2ui-icon-search"></span>
                        <span class="name-text"></span>
                        <span class="name-cross w2ui-action" data-click="searchReset">x</span>
                    </div>
                    <input type="text" id="grid_${this.name}_search_all" class="w2ui-search-all" tabindex="-1"
                        autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                        placeholder="${y.lang(this.last.label, true)}" value="${this.last.search}"
                        data-focus="searchSuggest" data-click="stop"
                    >
                    <div class="w2ui-search-drop w2ui-action" data-click="searchOpen"
                            style="${this.multiSearch ? "" : "display: none"}">
                        <span class="w2ui-icon-drop"></span>
                    </div>
                </div>`, this.toolbar.items.push({
          id: "w2ui-search",
          type: "html",
          html: e,
          onRefresh: async (n) => {
            await n.complete;
            var n = h(this.box).find(`#grid_${this.name}_search_all`), i = (y.bindEvents(h(this.box).find(`#grid_${this.name}_search_all, .w2ui-action`), this), y.debounce((o) => {
              var a = o.target.value;
              this.liveSearch && this.last.liveText != a && (this.last.liveText = a, this.search(this.last.field, a)), o.keyCode == 40 && this.searchSuggest(true);
            }, 250));
            n.on("change", (o) => {
              this.liveSearch || (this.search(this.last.field, o.target.value), this.searchSuggest(true, true, this));
            }).on("blur", () => {
              this.last.liveText = "";
            }).on("keyup", i);
          }
        })), Array.isArray(t) && (e = t.map((s) => s.id), this.show.toolbarAdd && !e.includes(this.buttons.add.id) && this.toolbar.items.push(y.extend({}, this.buttons.add)), this.show.toolbarEdit && !e.includes(this.buttons.edit.id) && this.toolbar.items.push(y.extend({}, this.buttons.edit)), this.show.toolbarDelete && !e.includes(this.buttons.delete.id) && this.toolbar.items.push(y.extend({}, this.buttons.delete)), this.show.toolbarSave && !e.includes(this.buttons.save.id) && ((this.show.toolbarAdd || this.show.toolbarDelete || this.show.toolbarEdit) && this.toolbar.items.push({
          type: "break",
          id: "w2ui-break2"
        }), this.toolbar.items.push(y.extend({}, this.buttons.save))), t = t.map((s) => this.buttons[s.name] ? y.extend({}, this.buttons[s.name], s) : s)), this.toolbar.items.push(...t), this.toolbar.on("click", (s) => {
          var n = this.trigger("toolbar", {
            target: s.target,
            originalEvent: s
          });
          if (n.isCancelled !== true) {
            let o;
            switch (s.detail.item.id) {
              case "w2ui-reload":
                if ((o = this.trigger("reload", {
                  target: this.name
                })).isCancelled === true) return false;
                this.reload(), o.finish();
                break;
              case "w2ui-column-on-off":
                s.detail.subItem ? (i = s.detail.subItem.id, [
                  "w2ui-stateSave",
                  "w2ui-stateReset"
                ].includes(i) ? this[i.substring(5)]() : i != "w2ui-skip" && this.columnOnOff(s, s.detail.subItem.id)) : (this.initColumnOnOff(), setTimeout(() => {
                  h(`#w2overlay-${this.name}_toolbar-drop .w2ui-grid-skip`).off(".w2ui-grid").on("click.w2ui-grid", (a) => {
                    a.stopPropagation();
                  }).on("keypress", (a) => {
                    a.keyCode == 13 && (this.skip(a.target.value), this.toolbar.click("w2ui-column-on-off"));
                  });
                }, 100));
                break;
              case "w2ui-add":
                if ((o = this.trigger("add", {
                  target: this.name,
                  recid: null
                })).isCancelled === true) return false;
                o.finish();
                break;
              case "w2ui-edit": {
                var i = this.getSelection();
                let a = null;
                if (i.length == 1 && (a = i[0]), (o = this.trigger("edit", {
                  target: this.name,
                  recid: a
                })).isCancelled === true) return false;
                o.finish();
                break;
              }
              case "w2ui-delete":
                this.delete();
                break;
              case "w2ui-save":
                this.save();
            }
            n.finish();
          }
        }), this.toolbar.on("refresh", (s) => {
          if (s.target == "w2ui-search") {
            let n = this.searchData;
            setTimeout(() => {
              this.searchInitInput(this.last.field, n.length == 1 ? n[0].value : null);
            }, 1);
          }
        });
      }
    }
    initResize() {
      let e = this;
      h(this.box).find(".w2ui-resizer").off(".grid-col-resize").on("click.grid-col-resize", function(t) {
        t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault();
      }).on("mousedown.grid-col-resize", function(t) {
        t = t || window.event, e.last.colResizing = true, e.last.tmp = {
          x: t.screenX,
          y: t.screenY,
          gx: t.screenX,
          gy: t.screenY,
          col: parseInt(h(this).attr("name"))
        }, e.last.tmp.tds = h(e.box).find("#grid_" + e.name + '_body table tr:first-child td[col="' + e.last.tmp.col + '"]'), t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault();
        for (let i = 0; i < e.columns.length; i++) e.columns[i].hidden || (e.columns[i].sizeOriginal == null && (e.columns[i].sizeOriginal = e.columns[i].size), e.columns[i].size = e.columns[i].sizeCalculated);
        let s = {
          phase: "before",
          type: "columnResize",
          target: e.name,
          column: e.last.tmp.col,
          field: e.columns[e.last.tmp.col].field
        };
        s = e.trigger(y.extend(s, {
          resizeBy: 0,
          originalEvent: t
        }));
        let n;
        h(document).off(".grid-col-resize").on("mousemove.grid-col-resize", function(i) {
          var o;
          e.last.colResizing == 1 && (i = i || window.event, (s = e.trigger(y.extend(s, {
            resizeBy: i.screenX - e.last.tmp.gx,
            originalEvent: i
          }))).isCancelled === true ? s.isCancelled = false : (e.last.tmp.x = i.screenX - e.last.tmp.x, e.last.tmp.y = i.screenY - e.last.tmp.y, o = parseInt(e.columns[e.last.tmp.col].size) + e.last.tmp.x + "px", e.columns[e.last.tmp.col].size = o, n && clearTimeout(n), n = setTimeout(() => {
            e.resizeRecords(), e.scroll();
          }, 100), e.last.tmp.tds.css({
            width: o
          }), e.last.tmp.x = i.screenX, e.last.tmp.y = i.screenY));
        }).on("mouseup.grid-col-resize", function(i) {
          h(document).off(".grid-col-resize"), e.resizeRecords(), e.scroll(), s.finish({
            originalEvent: i
          }), setTimeout(() => {
            e.last.colResizing = false;
          }, 1);
        });
      }).on("dblclick.grid-col-resize", function(t) {
        let s = parseInt(h(this).attr("name")), n = e.columns[s], i = 0;
        if (n.autoResize === false) return true;
        t.stopPropagation ? t.stopPropagation() : t.cancelBubble = true, t.preventDefault && t.preventDefault(), h(e.box).find('.w2ui-grid-records td[col="' + s + '"] > div', e.box).each(() => {
          var a = this.offsetWidth - this.scrollWidth;
          a < i && (i = a - 3);
        });
        var o = {
          phase: "before",
          type: "columnAutoResize",
          target: e.name,
          column: n,
          field: n.field
        };
        (o = e.trigger(y.extend(o, {
          resizeBy: Math.abs(i),
          originalEvent: t
        }))).isCancelled === true ? o.isCancelled = false : (i < 0 && (n.size = Math.min(parseInt(n.size) + Math.abs(i), n.max || 1 / 0) + "px", e.resizeRecords(), e.resizeRecords(), e.scroll()), o.finish({
          originalEvent: t
        }));
      }).each((t) => {
        var s = h(t).get(0).parentNode;
        h(t).css({
          height: s.clientHeight + "px",
          "margin-left": s.clientWidth - 3 + "px"
        });
      });
    }
    resizeBoxes() {
      var e = h(this.box).find(`#grid_${this.name}_header`), t = h(this.box).find(`#grid_${this.name}_toolbar`), s = h(this.box).find(`#grid_${this.name}_fsummary`), n = h(this.box).find(`#grid_${this.name}_summary`), i = h(this.box).find(`#grid_${this.name}_footer`), o = h(this.box).find(`#grid_${this.name}_body`);
      this.show.header && e.css({
        top: "0px",
        left: "0px",
        right: "0px"
      }), this.show.toolbar && t.css({
        top: 0 + (this.show.header ? y.getSize(e, "height") : 0) + "px",
        left: "0px",
        right: "0px"
      }), 0 < this.summary.length && (s.css({
        bottom: 0 + (this.show.footer ? y.getSize(i, "height") : 0) + "px"
      }), n.css({
        bottom: 0 + (this.show.footer ? y.getSize(i, "height") : 0) + "px",
        right: "0px"
      })), this.show.footer && i.css({
        bottom: "0px",
        left: "0px",
        right: "0px"
      }), o.css({
        top: 0 + (this.show.header ? y.getSize(e, "height") : 0) + (this.show.toolbar ? y.getSize(t, "height") : 0) + "px",
        bottom: 0 + (this.show.footer ? y.getSize(i, "height") : 0) + (0 < this.summary.length ? y.getSize(n, "height") : 0) + "px",
        left: "0px",
        right: "0px"
      });
    }
    resizeRecords() {
      var _a2, _b, _c2, _d2, _e, _f;
      let e = this;
      h(this.box).find(".w2ui-empty-record").remove();
      var t, s, n = h(this.box), i = h(this.box).find(":scope > div.w2ui-grid-box"), o = h(this.box).find(`#grid_${this.name}_header`), a = h(this.box).find(`#grid_${this.name}_toolbar`), r = h(this.box).find(`#grid_${this.name}_summary`), c = h(this.box).find(`#grid_${this.name}_fsummary`), d = h(this.box).find(`#grid_${this.name}_footer`), p = h(this.box).find(`#grid_${this.name}_body`), f = h(this.box).find(`#grid_${this.name}_columns`), x = h(this.box).find(`#grid_${this.name}_fcolumns`), b = h(this.box).find(`#grid_${this.name}_records`), C = h(this.box).find(`#grid_${this.name}_frecords`), _ = h(this.box).find(`#grid_${this.name}_scroll1`);
      let S = 8 * String(this.total).length + 10, A = (S < 34 && (S = 34), this.lineNumberWidth != null && (S = this.lineNumberWidth), false), P = false, H = 0;
      for (let ie = 0; ie < this.columns.length; ie++) this.columns[ie].frozen || this.columns[ie].hidden || (t = parseInt(this.columns[ie].sizeCalculated || this.columns[ie].size), H += t);
      ((_a2 = b[0]) == null ? void 0 : _a2.clientWidth) < H && (A = true), ((_b = p[0]) == null ? void 0 : _b.clientHeight) - (((_c2 = f[0]) == null ? void 0 : _c2.clientHeight) ?? 0) < (((_d2 = h(b).find(":scope > table")[0]) == null ? void 0 : _d2.clientHeight) ?? 0) + (A ? y.scrollBarSize() : 0) && (P = true), this.fixedBody ? (s = ((_e = i[0]) == null ? void 0 : _e.clientHeight) - (this.show.header ? y.getSize(o, "height") : 0) - (this.show.toolbar ? y.getSize(a, "height") : 0) - (r.css("display") != "none" ? y.getSize(r, "height") : 0) - (this.show.footer ? y.getSize(d, "height") : 0), p.css("height", s + "px")) : (o = (s = y.getSize(f, "height") + y.getSize(h(this.box).find("#grid_" + this.name + "_records table"), "height") + (A ? y.scrollBarSize() : 0)) + (this.show.header ? y.getSize(o, "height") : 0) + (this.show.toolbar ? y.getSize(a, "height") : 0) + (r.css("display") != "none" ? y.getSize(r, "height") : 0) + (this.show.footer ? y.getSize(d, "height") : 0), i.css("height", o + "px"), p.css("height", s + "px"), n.css("height", y.getSize(i, "height") + "px"));
      let U = this.records.length;
      if (a = typeof this.url != "object" ? this.url : this.url.get, this.searchData.length == 0 || a || (U = this.last.searchIds.length), this.fixedBody || (P = false), A || P ? (f.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", y.scrollBarSize() + "px").show(), b.css({
        top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + y.getSize(f, "height") + "px",
        "-webkit-overflow-scrolling": "touch",
        "overflow-x": A ? "auto" : "hidden",
        "overflow-y": P ? "auto" : "hidden"
      })) : (f.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").hide(), b.css({
        top: (0 < this.columnGroups.length && this.show.columns ? 1 : 0) + y.getSize(f, "height") + "px",
        overflow: "hidden"
      }), 0 < b.length && (this.last.scrollTop = 0, this.last.scrollLeft = 0)), A ? (C.css("margin-bottom", y.scrollBarSize() + "px"), _.show()) : (C.css("margin-bottom", 0), _.hide()), C.css({
        overflow: "hidden",
        top: b.css("top")
      }), this.show.emptyRecords && !P) {
        let ie = Math.floor((((_f = b[0]) == null ? void 0 : _f.clientHeight) ?? 0) / this.recordHeight) - 1, le = 0;
        if ((le = b[0] ? b[0].scrollHeight - ie * this.recordHeight : le) >= this.recordHeight && (le -= this.recordHeight, ie++), this.fixedBody) {
          for (let he = U; he < ie; he++) G(he, this.recordHeight, this);
          G(ie, le, this);
        }
      }
      function G(ie, le, he) {
        let pe = "", Se = "";
        var ve;
        pe += '<tr class="' + (ie % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + le + 'px">', Se += '<tr class="' + (ie % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + le + 'px">', he.show.lineNumbers && (pe += '<td class="w2ui-col-number"></td>'), he.show.selectColumn && (pe += '<td class="w2ui-grid-data w2ui-col-select"></td>'), he.show.expandColumn && (pe += '<td class="w2ui-grid-data w2ui-col-expand"></td>'), Se += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', he.reorderRows && (Se += '<td class="w2ui-grid-data w2ui-col-order" col="order"></td>');
        for (let Ve = 0; Ve < he.columns.length; Ve++) {
          var Ae = he.columns[Ve];
          (Ae.hidden || Ve < he.last.colStart || Ve > he.last.colEnd) && !Ae.frozen || (ve = '<td class="w2ui-grid-data" ' + (Ae.attr != null ? Ae.attr : "") + ' col="' + Ve + '"></td>', Ae.frozen ? pe += ve : Se += ve);
        }
        pe += '<td class="w2ui-grid-data-last"></td> </tr>', Se += '<td class="w2ui-grid-data-last" col="end"></td> </tr>', h(he.box).find("#grid_" + he.name + "_frecords > table").append(pe), h(he.box).find("#grid_" + he.name + "_records > table").append(Se);
      }
      let W, V;
      if (0 < p.length) {
        let ie = parseInt(p[0].clientWidth) - (P ? y.scrollBarSize() : 0) - (this.show.lineNumbers ? S : 0) - (this.reorderRows ? 26 : 0) - (this.show.selectColumn ? 26 : 0) - (this.show.expandColumn ? 26 : 0) - 1, le = (W = ie, false);
        for (let he = V = 0; he < this.columns.length; he++) {
          var q = this.columns[he];
          0 < q.gridMinWidth && (q.gridMinWidth > W && q.hidden !== true && (q.hidden = true, le = true), q.gridMinWidth < W) && q.hidden === true && (q.hidden = false, le = true);
        }
        if (le === true) return void this.refresh();
        for (let he = 0; he < this.columns.length; he++) {
          var D = this.columns[he];
          D.hidden || (String(D.size).substr(String(D.size).length - 2).toLowerCase() == "px" ? (ie -= parseFloat(D.size), this.columns[he].sizeCalculated = D.size, this.columns[he].sizeType = "px") : (V += parseFloat(D.size), this.columns[he].sizeType = "%", delete D.sizeCorrected));
        }
        if (V != 100 && 0 < V) for (let he = 0; he < this.columns.length; he++) {
          var R = this.columns[he];
          R.hidden || R.sizeType == "%" && (R.sizeCorrected = Math.round(100 * parseFloat(R.size) * 100 / V) / 100 + "%");
        }
        for (let he = 0; he < this.columns.length; he++) {
          var X = this.columns[he];
          X.hidden || X.sizeType == "%" && (this.columns[he].sizeCorrected != null ? this.columns[he].sizeCalculated = Math.floor(ie * parseFloat(X.sizeCorrected) / 100) - 1 + "px" : this.columns[he].sizeCalculated = Math.floor(ie * parseFloat(X.size) / 100) - 1 + "px");
        }
      }
      let Q = 0;
      for (let ie = 0; ie < this.columns.length; ie++) {
        var re = this.columns[ie];
        re.hidden || (re.min == null && (re.min = 20), parseInt(re.sizeCalculated) < parseInt(re.min) && (re.sizeCalculated = re.min + "px"), parseInt(re.sizeCalculated) > parseInt(re.max) && (re.sizeCalculated = re.max + "px"), Q += parseInt(re.sizeCalculated));
      }
      let ue = parseInt(W) - parseInt(Q);
      if (0 < ue && 0 < V) {
        let ie = 0;
        for (; ; ) {
          var be = this.columns[ie];
          if (be == null) ie = 0;
          else {
            if (!be.hidden && be.sizeType != "px" && (be.sizeCalculated = parseInt(be.sizeCalculated) + 1 + "px", --ue === 0)) break;
            ie++;
          }
        }
      } else 0 < ue && f.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", y.scrollBarSize() + "px").show();
      let ae = 1;
      this.show.lineNumbers && (ae += S), this.show.selectColumn && (ae += 26), this.show.expandColumn && (ae += 26);
      for (let ie = 0; ie < this.columns.length; ie++) this.columns[ie].hidden || this.columns[ie].frozen && (ae += parseInt(this.columns[ie].sizeCalculated));
      x.css("width", ae + "px"), C.css("width", ae + "px"), c.css("width", ae + "px"), _.css("width", ae + "px"), f.css("left", ae + "px"), b.css("left", ae + "px"), r.css("left", ae + "px"), f.find(":scope > table > tbody > tr:nth-child(1) td").add(x.find(":scope > table > tbody > tr:nth-child(1) td")).each((ie) => {
        h(ie).hasClass("w2ui-col-number") && h(ie).css("width", S + "px");
        var le = h(ie).attr("col");
        if (le != null) {
          if (le == "start") {
            let he = 0;
            for (let pe = 0; pe < e.last.colStart; pe++) !e.columns[pe] || e.columns[pe].frozen || e.columns[pe].hidden || (he += parseInt(e.columns[pe].sizeCalculated));
            h(ie).css("width", he + "px");
          }
          e.columns[le] && h(ie).css("width", e.columns[le].sizeCalculated);
        }
        if (h(ie).hasClass("w2ui-head-last")) if (e.last.colEnd + 1 < e.columns.length) {
          let he = 0;
          for (let pe = e.last.colEnd + 1; pe < e.columns.length; pe++) !e.columns[pe] || e.columns[pe].frozen || e.columns[pe].hidden || (he += parseInt(e.columns[pe].sizeCalculated));
          h(ie).css("width", he + "px");
        } else h(ie).css("width", y.scrollBarSize() + (0 < ue && V === 0 ? ue : 0) + "px");
      }), f.find(":scope > table > tbody > tr").length == 3 && f.find(":scope > table > tbody > tr:nth-child(1) td").add(x.find(":scope > table > tbody > tr:nth-child(1) td")).html("").css({
        height: "0",
        border: "0",
        padding: "0",
        margin: "0"
      }), b.find(":scope > table > tbody > tr:nth-child(1) td").add(C.find(":scope > table > tbody > tr:nth-child(1) td")).each((ie) => {
        h(ie).hasClass("w2ui-col-number") && h(ie).css("width", S + "px");
        var le = h(ie).attr("col");
        if (le != null) {
          if (le == "start") {
            let he = 0;
            for (let pe = 0; pe < e.last.colStart; pe++) !e.columns[pe] || e.columns[pe].frozen || e.columns[pe].hidden || (he += parseInt(e.columns[pe].sizeCalculated));
            h(ie).css("width", he + "px");
          }
          e.columns[le] && h(ie).css("width", e.columns[le].sizeCalculated);
        }
        if (h(ie).hasClass("w2ui-grid-data-last") && h(ie).parents(".w2ui-grid-frecords").length === 0) if (e.last.colEnd + 1 < e.columns.length) {
          let he = 0;
          for (let pe = e.last.colEnd + 1; pe < e.columns.length; pe++) !e.columns[pe] || e.columns[pe].frozen || e.columns[pe].hidden || (he += parseInt(e.columns[pe].sizeCalculated));
          h(ie).css("width", he + "px");
        } else h(ie).css("width", (0 < ue && V === 0 ? ue : 0) + "px");
      }), r.find(":scope > table > tbody > tr:nth-child(1) td").add(c.find(":scope > table > tbody > tr:nth-child(1) td")).each((ie) => {
        h(ie).hasClass("w2ui-col-number") && h(ie).css("width", S + "px");
        var le = h(ie).attr("col");
        if (le != null) {
          if (le == "start") {
            let he = 0;
            for (let pe = 0; pe < e.last.colStart; pe++) !e.columns[pe] || e.columns[pe].frozen || e.columns[pe].hidden || (he += parseInt(e.columns[pe].sizeCalculated));
            h(ie).css("width", he + "px");
          }
          e.columns[le] && h(ie).css("width", e.columns[le].sizeCalculated);
        }
        h(ie).hasClass("w2ui-grid-data-last") && h(ie).parents(".w2ui-grid-frecords").length === 0 && h(ie).css("width", y.scrollBarSize() + (0 < ue && V === 0 ? ue : 0) + "px");
      }), this.initResize(), this.refreshRanges(), (this.last.scrollTop || this.last.scrollLeft) && 0 < b.length && (f.prop("scrollLeft", this.last.scrollLeft), b.prop("scrollTop", this.last.scrollTop), b.prop("scrollLeft", this.last.scrollLeft)), f.css("will-change", "scroll-position");
    }
    getSearchesHTML() {
      let e = `
            <div class="search-title">
                ${y.lang("Advanced Search")}
                <span class="search-logic" style="${this.show.searchLogic ? "" : "display: none"}">
                    <select id="grid_${this.name}_logic" class="w2ui-input">
                        <option value="AND" ${this.last.logic == "AND" ? "selected" : ""}>${y.lang("All")}</option>
                        <option value="OR" ${this.last.logic == "OR" ? "selected" : ""}>${y.lang("Any")}</option>
                    </select>
                </span>
            </div>
            <table cellspacing="0"><tbody>
        `;
      for (let n = 0; n < this.searches.length; n++) {
        var t = this.searches[n];
        if (t.type = String(t.type).toLowerCase(), !t.hidden) {
          t.attr == null && (t.attr = ""), t.text == null && (t.text = ""), t.style == null && (t.style = ""), t.type == null && (t.type = "text"), t.label == null && t.caption != null && (console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", t), t.label = t.caption);
          var s = `<select id="grid_${this.name}_operator_${n}" class="w2ui-input" data-change="initOperator|${n}">
                    ${this.getOperators(t.type, t.operators)}
                </select>`;
          e += `<tr>
                        <td class="caption">${y.lang(t.label) || ""}</td>
                        <td class="operator">${s}</td>
                        <td class="value">`;
          let i;
          switch (t.type) {
            case "text":
            case "alphanumeric":
            case "hex":
            case "color":
            case "list":
            case "combo":
            case "enum":
              i = "width: 250px;", [
                "hex",
                "color"
              ].indexOf(t.type) != -1 && (i = "width: 90px;"), e += `<input rel="search" type="text" id="grid_${this.name}_field_${n}" name="${t.field}"
                               class="w2ui-input" style="${i + t.style}" ${t.attr}>`;
              break;
            case "int":
            case "float":
            case "money":
            case "currency":
            case "percent":
            case "date":
            case "time":
            case "datetime":
              i = "width: 90px;", t.type == "datetime" && (i = "width: 140px;"), e += `<input id="grid_${this.name}_field_${n}" name="${t.field}" ${t.attr} rel="search" type="text"
                                class="w2ui-input" style="${i + t.style}">
                            <span id="grid_${this.name}_range_${n}" style="display: none">&#160;-&#160;&#160;
                                <input rel="search" type="text" class="w2ui-input" style="${i + t.style}" id="grid_${this.name}_field2_${n}" name="${t.field}" ${t.attr}>
                            </span>`;
              break;
            case "select":
              e += `<select rel="search" class="w2ui-input" style="${t.style}" id="grid_${this.name}_field_${n}"
                                name="${t.field}" ${t.attr}></select>`;
          }
          e += t.text + "    </td></tr>";
        }
      }
      return e += `<tr>
            <td colspan="2" class="actions">
                <button type="button" class="w2ui-btn close-btn" data-click="searchClose">${y.lang("Close")}</button>
            </td>
            <td class="actions">
                <button type="button" class="w2ui-btn" data-click="searchReset">${y.lang("Reset")}</button>
                <button type="button" class="w2ui-btn w2ui-btn-blue" data-click="search">${y.lang("Search")}</button>
            </td>
        </tr></tbody></table>`;
    }
    getOperators(e, t) {
      let s = this.operators[this.operatorsMap[e]] || [], n = (t != null && Array.isArray(t) && (s = t), "");
      return s.forEach((i) => {
        let o = i, a = i;
        Array.isArray(i) ? (o = i[1], a = i[0]) : y.isPlainObject(i) && (o = i.text, a = i.oper), o == null && (o = i), n += `<option name="11" value="${a}">${y.lang(o)}</option>
`;
      }), n;
    }
    initOperator(e) {
      let t;
      var s = this.searches[e], n = this.getSearchData(s.field), i = h(`#w2overlay-${this.name}-search-overlay`), o = i.find(`#grid_${this.name}_range_` + e);
      let a = i.find(`#grid_${this.name}_field_` + e), r = i.find(`#grid_${this.name}_field2_` + e);
      var c = i.find(`#grid_${this.name}_operator_` + e).val();
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
          var d = a[0]._w2field;
          d && d.reset();
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
          a[0]._w2field || (new Ci(s.type, {
            el: a[0],
            ...s.options
          }), new Ci(s.type, {
            el: r[0],
            ...s.options
          }), setTimeout(() => {
            a.trigger("keydown"), r.trigger("keydown");
          }, 1));
          break;
        case "list":
        case "combo":
        case "enum":
          t = s.options, s.type == "list" && (t.selected = {}), s.type == "enum" && (t.selected = []), n && (t.selected = n.value), a[0]._w2field || (d = new Ci(s.type, {
            el: a[0],
            ...t
          }), n && n.text != null && d.set({
            id: n.value,
            text: n.text
          }));
          break;
        case "select":
          t = '<option value="">--</option>';
          for (let f = 0; f < s.options.items.length; f++) {
            var p = s.options.items[f];
            if (y.isPlainObject(s.options.items[f])) {
              let x = p.id, b = p.text;
              x == null && p.value != null && (x = p.value), b == null && p.text != null && (b = p.text), x == null && (x = ""), t += '<option value="' + x + '">' + b + "</option>";
            } else t += '<option value="' + p + '">' + p + "</option>";
          }
          a.html(t);
      }
    }
    initSearches() {
      var e = h(`#w2overlay-${this.name}-search-overlay`);
      for (let i = 0; i < this.searches.length; i++) {
        var s = this.searches[i], t = this.getSearchData(s.field);
        s.type = String(s.type).toLowerCase(), typeof s.options != "object" && (s.options = {});
        let o = s.operator, a = [
          ...this.operators[this.operatorsMap[s.type]]
        ];
        s.operators && (a = s.operators), y.isPlainObject(o) && (o = o.oper), a.forEach((r, c) => {
          y.isPlainObject(r) && (a[c] = r.oper);
        }), t && t.operator && (o = t.operator);
        var s = this.defaultOperator[this.operatorsMap[s.type]], s = (a.indexOf(o) == -1 && (o = s), e.find(`#grid_${this.name}_operator_` + i).val(o), this.initOperator(i), e.find(`#grid_${this.name}_field_` + i)), n = e.find(`#grid_${this.name}_field2_` + i);
        t != null && (Array.isArray(t.value) ? [
          "in",
          "not in"
        ].includes(t.operator) ? s[0]._w2field.set(t.value) : (s.val(t.value[0]).trigger("change"), n.val(t.value[1]).trigger("change")) : t.value != null && s.val(t.value).trigger("change"));
      }
      e.find(".w2ui-grid-search-advanced *[rel=search]").on("keypress", (i) => {
        i.keyCode == 13 && (this.search(), ct.hide(this.name + "-search-overlay"));
      });
    }
    getColumnsHTML() {
      let e = this, t = "", s = "";
      var n, i, o;
      return this.show.columnHeaders && (s = 0 < this.columnGroups.length ? (o = a(true), n = function() {
        let r = "<tr>", c = "<tr>", d = "", p = e.columnGroups.length - 1;
        e.columnGroups[p].text == null && e.columnGroups[p].caption != null && (console.log("NOTICE: grid columnGroup.caption property is deprecated, please use columnGroup.text. Group -> ", e.columnGroups[p]), e.columnGroups[p].text = e.columnGroups[p].caption), e.columnGroups[e.columnGroups.length - 1].text != "" && e.columnGroups.push({
          text: ""
        }), e.show.lineNumbers && (r += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>&#160;</div></td>'), e.show.selectColumn && (r += '<td class="w2ui-head w2ui-col-select" col="select">    <div style="height: 25px">&#160;</div></td>'), e.show.expandColumn && (r += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div style="height: 25px">&#160;</div></td>');
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
              for (let H = 0; H < e.sortData.length; H++) e.sortData[H].field == b.field && ((e.sortData[H].direction || "").toLowerCase() === "asc" && (A = "w2ui-sort-up"), (e.sortData[H].direction || "").toLowerCase() === "desc") && (A = "w2ui-sort-down");
              let P = "";
              b.resizable !== false && (P = `<div class="w2ui-resizer" name="${f}"></div>`);
              var C = y.lang(typeof b.text == "function" ? b.text(b) : b.text);
              d = `<td id="grid_${e.name}_column_${f}" class="w2ui-head ${A}" col="${f}"     rowspan="2" colspan="${S}">` + P + `    <div class="w2ui-col-group w2ui-col-header ${A ? "w2ui-col-sorted" : ""}">        <div class="${A}"></div>` + (C || "&#160;") + "    </div></td>";
            } else C = y.lang(typeof x.text == "function" ? x.text(x) : x.text), d = `<td id="grid_${e.name}_column_${f}" class="w2ui-head" col="${f}" colspan="${S}">    <div class="w2ui-col-group" style="${x.style ?? ""}">${C || "&#160;"}</div></td>`;
            b && b.frozen ? r += d : c += d;
          }
          f += x.span;
        }
        return r += "<td></td></tr>", c += `<td id="grid_${e.name}_column_end" class="w2ui-head" col="end"></td></tr>`, [
          r,
          c
        ];
      }(), i = a(false), t = o[0] + n[0] + i[0], o[1] + n[1] + i[1]) : (o = a(true), t = o[0], o[1])), [
        t,
        s
      ];
      function a(r) {
        let c = "<tr>", d = "<tr>", p = (e.show.lineNumbers && (c += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>#</div></td>'), e.show.selectColumn && (c += `<td class="w2ui-head w2ui-col-select" col="select">    <div>        <input type="checkbox" id="grid_${e.name}_check_all" class="w2ui-select-all" tabindex="-1"            style="${e.multiSelect == 0 ? "display: none;" : ""}"        >    </div></td>`), e.show.expandColumn && (c += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div>&#160;</div></td>'), 0), f = 0, x;
        d += `<td id="grid_${e.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`, e.reorderRows && (d += '<td class="w2ui-head w2ui-col-order" col="order">    <div>&#160;</div></td>');
        for (let _ = 0; _ < e.columns.length; _++) {
          var b, C = e.columns[_];
          C.text == null && C.caption != null && (console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column -> ", C), C.text = C.caption), C.size == null && (C.size = "100%"), _ == f && (x = e.columnGroups[p++] || {}, f += x.span), (_ < e.last.colStart || _ > e.last.colEnd) && !C.frozen || C.hidden || x.main === true && !r || (b = e.getColumnCellHTML(_), C && C.frozen ? c += b : d += b);
        }
        return c += '<td class="w2ui-head w2ui-head-last"><div>&#160;</div></td>', d += '<td class="w2ui-head w2ui-head-last" col="end"><div>&#160;</div></td>', c += "</tr>", d += "</tr>", [
          c,
          d
        ];
      }
    }
    getColumnCellHTML(e) {
      var t = this.columns[e];
      if (t == null) return "";
      var s = !this.reorderColumns || this.columnGroups && this.columnGroups.length ? "" : " w2ui-col-reorderable ";
      let n = "";
      for (let c = 0; c < this.sortData.length; c++) this.sortData[c].field == t.field && ((this.sortData[c].direction || "").toLowerCase() === "asc" && (n = "w2ui-sort-up"), (this.sortData[c].direction || "").toLowerCase() === "desc") && (n = "w2ui-sort-down");
      var i, o = this.last.selection.columns;
      let a = false;
      for (i in o) for (let c = 0; c < o[i].length; c++) o[i][c] == e && (a = true);
      var r = y.lang(typeof t.text == "function" ? t.text(t) : t.text);
      return '<td id="grid_' + this.name + "_column_" + e + '" col="' + e + '" class="w2ui-head ' + n + s + '">' + (t.resizable !== false ? '<div class="w2ui-resizer" name="' + e + '"></div>' : "") + '    <div class="w2ui-col-header ' + (n ? "w2ui-col-sorted" : "") + " " + (a ? "w2ui-col-selected" : "") + '">        <div class="' + n + '"></div>' + (r || "&#160;") + "    </div></td>";
    }
    columnTooltipShow(n, t) {
      var s = h(this.box).find("#grid_" + this.name + "_column_" + n), n = this.columns[n], i = this.columnTooltip;
      ct.show({
        name: this.name + "-column-tooltip",
        anchor: s.get(0),
        html: n == null ? void 0 : n.tooltip,
        position: i
      });
    }
    columnTooltipHide(e, t) {
      ct.hide(this.name + "-column-tooltip");
    }
    getRecordsHTML() {
      var _a2;
      let e = this.records.length;
      var t = typeof this.url != "object" ? this.url : this.url.get, t = ((e = this.searchData.length == 0 || t ? e : this.last.searchIds.length) > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start, h(this.box).find(`#grid_${this.name}_records`));
      let s = Math.floor((((_a2 = t.get(0)) == null ? void 0 : _a2.clientHeight) || 0) / this.recordHeight) + this.last.show_extra + 1;
      (!this.fixedBody || s > e) && (s = e);
      var n = this.getRecordHTML(-1, 0);
      let i = "<table><tbody>" + n[0], o = "<table><tbody>" + n[1];
      i += '<tr id="grid_' + this.name + '_frec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>', o += '<tr id="grid_' + this.name + '_rec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
      for (let a = 0; a < s; a++) n = this.getRecordHTML(a, a + 1), i += n[0], o += n[1];
      return t = (e - s) * this.recordHeight, i += '<tr id="grid_' + this.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border-right: 1px solid #D6D5D7;"></td></tr><tr id="grid_' + this.name + '_frec_more" style="display: none; ">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', o += '<tr id="grid_' + this.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + t + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + this.name + '_rec_more" style="display: none">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>', this.last.range_start = 0, this.last.range_end = s, [
        i,
        o
      ];
    }
    getSummaryHTML() {
      if (this.summary.length !== 0) {
        var e = this.getRecordHTML(-1, 0);
        let t = "<table><tbody>" + e[0], s = "<table><tbody>" + e[1];
        for (let n = 0; n < this.summary.length; n++) e = this.getRecordHTML(n, n + 1, true), t += e[0], s += e[1];
        return t += "</tbody></table>", s += "</tbody></table>", [
          t,
          s
        ];
      }
    }
    scroll(e) {
      let t = this;
      var s = typeof this.url != "object" ? this.url : this.url.get, n = h(this.box).find(`#grid_${this.name}_records`), i = h(this.box).find(`#grid_${this.name}_frecords`);
      e && (P = e.target.scrollTop, e = e.target.scrollLeft, this.last.scrollTop = P, this.last.scrollLeft = e, p = h(this.box).find(`#grid_${this.name}_columns`)[0], f = h(this.box).find(`#grid_${this.name}_summary`)[0], p && (p.scrollLeft = e), f && (f.scrollLeft = e), i[0]) && (i[0].scrollTop = P), this.last.bubbleEl && (ct.hide(this.name + "-bubble"), this.last.bubbleEl = null);
      let o = null, a = null;
      if (this.disableCVS || 0 < this.columnGroups.length) o = 0, a = this.columns.length - 1;
      else {
        var r, c = n.prop("clientWidth");
        let D = 0;
        for (let R = 0; R < this.columns.length; R++) this.columns[R].frozen || this.columns[R].hidden || (r = parseInt(this.columns[R].sizeCalculated || this.columns[R].size), D + r + 30 > this.last.scrollLeft && o == null && (o = R), D + r - 30 > this.last.scrollLeft + c && a == null && (a = R), D += r);
        a == null && (a = this.columns.length - 1);
      }
      if (o != null && (o < 0 && (o = 0), a < 0 && (a = 0), o == a && (0 < o ? o-- : a++), o != this.last.colStart || a != this.last.colEnd)) {
        var d = h(this.box), p = Math.abs(o - this.last.colStart), f = Math.abs(a - this.last.colEnd);
        if (p < 5 && f < 5) {
          var x = d.find(`.w2ui-grid-columns #grid_${this.name}_column_start`), b = d.find(".w2ui-grid-columns .w2ui-head-last"), C = d.find(`#grid_${this.name}_records .w2ui-grid-data-spacer`), _ = d.find(`#grid_${this.name}_records .w2ui-grid-data-last`), S = d.find(`#grid_${this.name}_summary .w2ui-grid-data-spacer`), A = d.find(`#grid_${this.name}_summary .w2ui-grid-data-last`);
          if (o > this.last.colStart) for (let D = this.last.colStart; D < o; D++) d.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + D).remove(), d.find("#grid_" + this.name + '_records td[col="' + D + '"]').remove(), d.find("#grid_" + this.name + '_summary td[col="' + D + '"]').remove();
          if (a < this.last.colEnd) for (let D = this.last.colEnd; D > a; D--) d.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + D).remove(), d.find("#grid_" + this.name + '_records td[col="' + D + '"]').remove(), d.find("#grid_" + this.name + '_summary td[col="' + D + '"]').remove();
          if (o < this.last.colStart) for (let D = this.last.colStart - 1; D >= o; D--) this.columns[D] && (this.columns[D].frozen || this.columns[D].hidden) || (x.after(this.getColumnCellHTML(D)), C.each((R) => {
            var X = h(R).parent().attr("index");
            let Q = '<td class="w2ui-grid-data" col="' + D + '" style="height: 0px"></td>';
            X != null && (Q = this.getCellHTML(parseInt(X), D, false)), h(R).after(Q);
          }), S.each((R) => {
            var X = h(R).parent().attr("index");
            let Q = '<td class="w2ui-grid-data" col="' + D + '" style="height: 0px"></td>';
            X != null && (Q = this.getCellHTML(parseInt(X), D, true)), h(R).after(Q);
          }));
          if (a > this.last.colEnd) for (let D = this.last.colEnd + 1; D <= a; D++) this.columns[D] && (this.columns[D].frozen || this.columns[D].hidden) || (b.before(this.getColumnCellHTML(D)), _.each((R) => {
            var X = h(R).parent().attr("index");
            let Q = '<td class="w2ui-grid-data" col="' + D + '" style="height: 0px"></td>';
            X != null && (Q = this.getCellHTML(parseInt(X), D, false)), h(R).before(Q);
          }), A.each((R) => {
            var X = h(R).parent().attr("index") || -1, X = this.getCellHTML(parseInt(X), D, true);
            h(R).before(X);
          }));
          this.last.colStart = o, this.last.colEnd = a;
        } else {
          this.last.colStart = o, this.last.colEnd = a;
          var e = this.getColumnsHTML(), P = this.getRecordsHTML(), p = this.getSummaryHTML(), f = d.find(`#grid_${this.name}_columns`);
          let Q = d.find(`#grid_${this.name}_records`);
          var H = d.find(`#grid_${this.name}_frecords`);
          let re = d.find(`#grid_${this.name}_summary`);
          f.find("tbody").html(e[1]), H.html(P[0]), Q.prepend(P[1]), p != null && re.html(p[1]), setTimeout(() => {
            Q.find(":scope > table").filter(":not(table:first-child)").remove(), re[0] && (re[0].scrollLeft = this.last.scrollLeft);
          }, 1);
        }
        this.resizeRecords();
      }
      let U = this.records.length;
      if (U > this.total && this.total !== -1 && (U = this.total), (U = this.searchData.length == 0 || s ? U : this.last.searchIds.length) !== 0 && n.length !== 0 && n.prop("clientHeight") !== 0) {
        U > this.vs_start ? this.last.show_extra = this.vs_extra : this.last.show_extra = this.vs_start;
        let D = Math.round(n.prop("scrollTop") / this.recordHeight + 1), R = D + (Math.round(n.prop("clientHeight") / this.recordHeight) - 1);
        if (D > U && (D = U), R >= U - 1 && (R = U), h(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-right").html((this.show.statusRange ? y.formatNumber(this.offset + D) + "-" + y.formatNumber(this.offset + R) + (this.total != -1 ? " " + y.lang("of") + " " + y.formatNumber(this.total) : "") : "") + (s && this.show.statusBuffered ? " (" + y.lang("buffered") + " " + y.formatNumber(U) + (0 < this.offset ? ", skip " + y.formatNumber(this.offset) : "") + ")" : "")), s || this.fixedBody && !(this.total != -1 && this.total <= this.vs_start)) {
          let Se = function() {
            t.markSearch && (clearTimeout(t.last.marker_timer), t.last.marker_timer = setTimeout(() => {
              var ve = [];
              for (let ot = 0; ot < t.searchData.length; ot++) {
                var Ae = t.searchData[ot], Ve = t.getSearch(Ae.field);
                Ve && !Ve.hidden && (Ve = t.getColumn(Ae.field, true), ve.push({
                  field: Ae.field,
                  search: Ae.value,
                  col: Ve
                }));
              }
              0 < ve.length && ve.forEach((ot) => {
                var yt = h(t.box).find('td[col="' + ot.col + '"]:not(.w2ui-head)');
                y.marker(yt, ot.search);
              });
            }, 50));
          }, X = Math.floor(n.prop("scrollTop") / this.recordHeight) - this.last.show_extra, Q = X + Math.floor(n.prop("clientHeight") / this.recordHeight) + 2 * this.last.show_extra + 1;
          X < 1 && (X = 1), Q > this.total && this.total != -1 && (Q = this.total);
          var G = n.find("#grid_" + this.name + "_rec_top"), W = n.find("#grid_" + this.name + "_rec_bottom"), V = i.find("#grid_" + this.name + "_frec_top"), q = i.find("#grid_" + this.name + "_frec_bottom"), f = (String(G.next().prop("id")).indexOf("_expanded_row") != -1 && (G.next().remove(), V.next().remove()), this.total > Q && String(W.prev().prop("id")).indexOf("_expanded_row") != -1 && (W.prev().remove(), q.prev().remove()), parseInt(G.next().attr("line"))), e = parseInt(W.prev().attr("line"));
          let be, ae, ie, le, he;
          if (f < X || f == 1 || this.last.pull_refresh) {
            if (Q <= e + this.last.show_extra - 2 && Q != this.total) return;
            for (this.last.pull_refresh = false; ae = i.find("#grid_" + this.name + "_frec_top").next(), !((ie = n.find("#grid_" + this.name + "_rec_top").next()).attr("line") == "bottom" || !(parseInt(ie.attr("line")) < X)); ) ae.remove(), ie.remove();
            be = n.find("#grid_" + this.name + "_rec_bottom").prev(), (le = be.attr("line")) == "top" && (le = X);
            for (let ve = parseInt(le) + 1; ve <= Q; ve++) this.records[ve - 1] && ((ie = this.records[ve - 1].w2ui) && !Array.isArray(ie.children) && (ie.expanded = false), he = this.getRecordHTML(ve - 1, ve), W.before(he[1]), q.before(he[0]));
          } else {
            if (X >= f - this.last.show_extra + 2 && 1 < X) return;
            for (; ae = i.find("#grid_" + this.name + "_frec_bottom").prev(), !((ie = n.find("#grid_" + this.name + "_rec_bottom").prev()).attr("line") == "top" || !(parseInt(ie.attr("line")) > Q)); ) ae.remove(), ie.remove();
            be = n.find("#grid_" + this.name + "_rec_top").next(), (le = be.attr("line")) == "bottom" && (le = Q);
            for (let ve = parseInt(le) - 1; ve >= X; ve--) this.records[ve - 1] && ((ie = this.records[ve - 1].w2ui) && !Array.isArray(ie.children) && (ie.expanded = false), he = this.getRecordHTML(ve - 1, ve), G.after(he[1]), V.after(he[0]));
          }
          Se(), setTimeout(() => {
            this.refreshRanges();
          }, 0), H = (X - 1) * this.recordHeight;
          let pe = (U - Q) * this.recordHeight;
          pe < 0 && (pe = 0), G.css("height", H + "px"), V.css("height", H + "px"), W.css("height", pe + "px"), q.css("height", pe + "px"), this.last.range_start = X, this.last.range_end = Q, Math.floor(n.prop("scrollTop") / this.recordHeight) + Math.floor(n.prop("clientHeight") / this.recordHeight) + 10 > U && this.last.pull_more !== true && (U < this.total - this.offset || this.total == -1 && this.last.fetch.hasMore) && (this.autoLoad === true && (this.last.pull_more = true, this.last.fetch.offset += this.limit, this.request("load")), h(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").show().eq(1).off(".load-more").on("click.load-more", function() {
            h(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>'), t.last.pull_more = true, t.last.fetch.offset += t.limit, t.request("load");
          }).find("td").html(t.autoLoad ? '<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>' : '<div style="padding-top: 15px">' + y.lang("Load ${count} more...", {
            count: t.limit
          }) + "</div>"));
        }
      }
    }
    getRecordHTML(e, t, s) {
      var _a2, _b, _c2, _d2, _e;
      let n = "", i = "";
      var o = this.last.selection;
      let a;
      if (e == -1) {
        n += '<tr line="0">', i += '<tr line="0">', this.show.lineNumbers && (n += '<td class="w2ui-col-number" style="height: 0px"></td>'), this.show.selectColumn && (n += '<td class="w2ui-col-select" style="height: 0px"></td>'), this.show.expandColumn && (n += '<td class="w2ui-col-expand" style="height: 0px"></td>'), i += '<td class="w2ui-grid-data w2ui-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>', this.reorderRows && (i += '<td class="w2ui-col-order" style="height: 0px"></td>');
        for (let C = 0; C < this.columns.length; C++) {
          var r = this.columns[C], c = '<td class="w2ui-grid-data" col="' + C + '" style="height: 0px;"></td>';
          r.frozen && !r.hidden ? n += c : r.hidden || C < this.last.colStart || C > this.last.colEnd || (i += c);
        }
        n += '<td class="w2ui-grid-data-last" style="height: 0px"></td>', i += '<td class="w2ui-grid-data-last" col="end" style="height: 0px"></td>';
      } else {
        var d = typeof this.url != "object" ? this.url : this.url.get;
        if (s !== true) {
          if (0 < this.searchData.length && !d) {
            if (e >= this.last.searchIds.length) return "";
            e = this.last.searchIds[e];
          } else if (e >= this.records.length) return "";
          a = this.records[e];
        } else {
          if (e >= this.summary.length) return "";
          a = this.summary[e];
        }
        if (!a) return "";
        a.recid == null && this.recid != null && (d = this.parseField(a, this.recid)) != null && (a.recid = d);
        let C = false, _ = (o.indexes.indexOf(e) != -1 && (C = true), a.w2ui ? a.w2ui.style : ""), S = (_ != null && typeof _ == "string" || (_ = ""), a.w2ui ? a.w2ui.class : "");
        if (S != null && typeof S == "string" || (S = ""), n += '<tr id="grid_' + this.name + "_frec_" + a.recid + '" recid="' + a.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + S + (C && this.selectType == "row" ? " w2ui-selected" : "") + (a.w2ui && a.w2ui.editable === false ? " w2ui-no-edit" : "") + (a.w2ui && a.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (C || _ == "" ? _.replace("background-color", "none") : _) + '" ' + (_ != "" ? 'custom_style="' + _ + '"' : "") + ">", i += '<tr id="grid_' + this.name + "_rec_" + a.recid + '" recid="' + a.recid + '" line="' + t + '" index="' + e + '"  class="' + (t % 2 == 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + S + (C && this.selectType == "row" ? " w2ui-selected" : "") + (a.w2ui && a.w2ui.editable === false ? " w2ui-no-edit" : "") + (a.w2ui && a.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (C || _ == "" ? _.replace("background-color", "none") : _) + '" ' + (_ != "" ? 'custom_style="' + _ + '"' : "") + ">", this.show.lineNumbers && (n += '<td id="grid_' + this.name + "_cell_" + e + "_number" + (s ? "_s" : "") + '"    class="w2ui-col-number ' + (C ? " w2ui-row-selected" : "") + '"' + (this.reorderRows ? ' style="cursor: move"' : "") + ">" + (s !== true ? this.getLineHTML(t, a) : "") + "</td>"), this.show.selectColumn && (n += '<td id="grid_' + this.name + "_cell_" + e + "_select" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-select">' + (s === true || a.w2ui && a.w2ui.hideCheckBox === true ? "" : '    <div>        <input class="w2ui-grid-select-check" type="checkbox" tabindex="-1" ' + (C ? 'checked="checked"' : "") + ' style="pointer-events: none"/>    </div>') + "</td>"), this.show.expandColumn) {
          let H = "";
          H = ((_a2 = a.w2ui) == null ? void 0 : _a2.expanded) === true ? "-" : "+", ((_b = a.w2ui) == null ? void 0 : _b.expanded) != "none" && Array.isArray((_c2 = a.w2ui) == null ? void 0 : _c2.children) && ((_d2 = a.w2ui) == null ? void 0 : _d2.children.length) || (H = "+"), ((_e = a.w2ui) == null ? void 0 : _e.expanded) == "spinner" && (H = '<div class="w2ui-spinner" style="width: 16px; margin: -2px 2px;"></div>'), n += '<td id="grid_' + this.name + "_cell_" + e + "_expand" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-expand">' + (s !== true ? `<div>${H}</div>` : "") + "</td>";
        }
        i += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>', this.reorderRows && (i += '<td id="grid_' + this.name + "_cell_" + e + "_order" + (s ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-order" col="order">' + (s !== true ? '<div title="Drag to reorder">&nbsp;</div>' : "") + "</td>");
        let A = 0, P = 0;
        for (; ; ) {
          let H = 1;
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
                  let U = 0;
                  for (let G = A; G < A + x && !(G >= this.columns.length); G++) this.columns[G].hidden && U++;
                  H = x - U, P = x - 1;
                }
              }
              var b = this.getCellHTML(e, A, s, H);
              f.frozen ? n += b : i += b;
            }
            A++;
          }
        }
        n += '<td class="w2ui-grid-data-last"></td>', i += '<td class="w2ui-grid-data-last" col="end"></td>';
      }
      return n += "</tr>", i += "</tr>", [
        n,
        i
      ];
    }
    getLineHTML(e) {
      return "<div>" + e + "</div>";
    }
    getCellHTML(e, t, s, n) {
      var _a2, _b, _c2, _d2;
      let i = this, o = this.columns[t];
      if (o == null) return "";
      let a = (s !== true ? this.records : this.summary)[e], { value: r, style: c, className: d, attr: p, divAttr: f } = this.getCellValue(e, t, s, true);
      var x = e !== -1 ? this.getCellEditable(e, t) : "";
      let b = "max-height: " + parseInt(this.recordHeight) + "px;" + (o.clipboardCopy ? "margin-right: 20px" : "");
      var C = !s && ((_a2 = a == null ? void 0 : a.w2ui) == null ? void 0 : _a2.changes) && a.w2ui.changes[o.field] != null, _ = this.last.selection;
      let S = false, A = "";
      if (_.indexes.indexOf(e) != -1 && (S = true), n == null && (n = ((_b = a == null ? void 0 : a.w2ui) == null ? void 0 : _b.colspan) && a.w2ui.colspan[o.field] ? a.w2ui.colspan[o.field] : 1), t === 0 && Array.isArray((_c2 = a == null ? void 0 : a.w2ui) == null ? void 0 : _c2.children)) {
        let V = 0, q = this.get(a.w2ui.parent_recid, true);
        for (; q != null; ) {
          V++;
          var P = this.records[q].w2ui;
          if (P == null || P.parent_recid == null) break;
          q = this.get(P.parent_recid, true);
        }
        if (a.w2ui.parent_recid) for (let D = 0; D < V; D++) A += '<span class="w2ui-show-children w2ui-icon-empty"></span>';
        var H = 0 < a.w2ui.children.length ? a.w2ui.expanded ? "w2ui-icon-collapse" : "w2ui-icon-expand" : "w2ui-icon-empty";
        A += `<span class="w2ui-show-children ${H}"></span>`;
      }
      if (o.info === true && (o.info = {}), o.info != null) {
        let V = "w2ui-icon-info", q = (typeof o.info.icon == "function" ? V = o.info.icon(a, {
          self: this,
          index: e,
          colIndex: t,
          summary: !!s
        }) : typeof o.info.icon == "object" ? V = o.info.icon[this.parseField(a, o.field)] || "" : typeof o.info.icon == "string" && (V = o.info.icon), o.info.style || "");
        typeof o.info.style == "function" ? q = o.info.style(a, {
          self: this,
          index: e,
          colIndex: t,
          summary: !!s
        }) : typeof o.info.style == "object" ? q = o.info.style[this.parseField(a, o.field)] || "" : typeof o.info.style == "string" && (q = o.info.style), A += `<span class="w2ui-info ${V}" style="${q}"></span>`;
      }
      let U = r, G = (x && [
        "checkbox",
        "check"
      ].indexOf(x.type) != -1 && (b += "text-align: center;", U = `<input tabindex="-1" type="checkbox" class="w2ui-editable-checkbox"
                            data-changeInd="${s ? -(e + 1) : e}" data-colInd="${t}" ${U ? 'checked="checked"' : ""}>`, A = ""), (U = `<div style="${b}" ${function(V) {
        let q;
        return i.show.recordTitles && (o.title != null ? (typeof o.title == "function" && (q = o.title.call(i, a, {
          self: this,
          index: e,
          colIndex: t,
          summary: !!s
        })), typeof o.title == "string" && (q = o.title)) : q = y.stripTags(String(V).replace(/"/g, "''"))), q != null ? 'title="' + String(q) + '"' : "";
      }(U)} ${f}>${A}${String(U)}</div>`) == null && (U = ""), typeof o.render == "string" && (H = o.render.toLowerCase().split(":"), [
        "number",
        "int",
        "float",
        "money",
        "currency",
        "percent",
        "size"
      ].indexOf(H[0]) != -1) && (c += "text-align: right;"), (a == null ? void 0 : a.w2ui) && (typeof a.w2ui.style == "object" && (typeof a.w2ui.style[t] == "string" && (c += a.w2ui.style[t] + ";"), typeof a.w2ui.style[o.field] == "string") && (c += a.w2ui.style[o.field] + ";"), typeof a.w2ui.class == "object") && (typeof a.w2ui.class[t] == "string" && (d += a.w2ui.class[t] + " "), typeof a.w2ui.class[o.field] == "string") && (d += a.w2ui.class[o.field] + " "), false);
      S && ((_d2 = _.columns[e]) == null ? void 0 : _d2.includes(t)) && (G = true);
      let W;
      return o.clipboardCopy && (W = '<span class="w2ui-clipboard-copy w2ui-icon-paste"></span>'), U = '<td class="w2ui-grid-data' + (G ? " w2ui-selected" : "") + " " + d + (C ? " w2ui-changed" : "") + '"    id="grid_' + this.name + "_data_" + e + "_" + t + '" col="' + t + '"    style="' + c + (o.style != null ? o.style : "") + '" ' + (o.attr != null ? o.attr : "") + p + (1 < n ? 'colspan="' + n + '"' : "") + ">" + U + (W && y.stripTags(U) ? W : "") + "</td>", U = e === -1 && s === true ? '<td class="w2ui-grid-data" col="' + t + '" style="height: 0px; ' + c + '" ' + (1 < n ? 'colspan="' + n + '"' : "") + "></td>" : U;
    }
    clipboardCopy(e, t, s) {
      var n = (s ? this.summary : this.records)[e], i = this.columns[t];
      let o = i ? this.parseField(n, i.field) : "";
      typeof i.clipboardCopy == "function" && (o = i.clipboardCopy(n, {
        self: this,
        index: e,
        colIndex: t,
        summary: !!s
      })), h(this.box).find("#grid_" + this.name + "_focus").text(o).get(0).select(), document.execCommand("copy");
    }
    showBubble(e, t, s) {
      var n = this.columns[t].info;
      if (n) {
        let f = "";
        var i = this.records[e], o = h(this.box).find(`${s ? ".w2ui-grid-summary" : ""} #grid_${this.name}_data_${e}_${t} .w2ui-info`);
        if (this.last.bubbleEl && ct.hide(this.name + "-bubble"), this.last.bubbleEl = o, n.fields == null) {
          n.fields = [];
          for (let b = 0; b < this.columns.length; b++) {
            var a = this.columns[b];
            n.fields.push(a.field + (typeof a.render == "string" ? ":" + a.render : ""));
          }
        }
        let x = n.fields;
        if (typeof x == "function" && (x = x(i, {
          self: this,
          index: e,
          colIndex: t,
          summary: !!s
        })), typeof n.render == "function") f = n.render(i, {
          self: this,
          index: e,
          colIndex: t,
          summary: !!s
        });
        else if (Array.isArray(x)) {
          f = '<table cellpadding="0" cellspacing="0">';
          for (let b = 0; b < x.length; b++) {
            var r = String(x[b]).split(":");
            if (r[0] == "" || r[0] == "-" || r[0] == "--" || r[0] == "---") f += '<tr><td colspan=2><div style="border-top: ' + (r[0] == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
            else {
              let C = this.getColumn(r[0]), _ = (C = C ?? {
                field: r[0],
                caption: r[0]
              }) ? this.parseField(i, C.field) : "";
              1 < r.length && (y.formatters[r[1]] ? _ = y.formatters[r[1]](_, r[2] || null, i) : console.log('ERROR: w2utils.formatters["' + r[1] + '"] does not exists.')), (n.showEmpty === true || _ != null && _ != "") && (n.maxLength != null && typeof _ == "string" && _.length > n.maxLength && (_ = _.substr(0, n.maxLength) + "..."), f += "<tr><td>" + C.text + "</td><td>" + ((_ === 0 ? "0" : _) || "") + "</td></tr>");
            }
          }
          f += "</table>";
        } else if (y.isPlainObject(x)) {
          for (var c in f = '<table cellpadding="0" cellspacing="0">', x) {
            var d = x[c];
            if (d == "" || d == "-" || d == "--" || d == "---") f += '<tr><td colspan=2><div style="border-top: ' + (d == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
            else {
              var p = String(d).split(":");
              let b = this.getColumn(p[0]), C = (b = b ?? {
                field: p[0],
                caption: p[0]
              }) ? this.parseField(i, b.field) : "";
              1 < p.length && (y.formatters[p[1]] ? C = y.formatters[p[1]](C, p[2] || null, i) : console.log('ERROR: w2utils.formatters["' + p[1] + '"] does not exists.')), typeof d == "function" && (C = d(i, {
                self: this,
                index: e,
                colIndex: t,
                summary: !!s
              })), (n.showEmpty === true || C != null && C != "") && (n.maxLength != null && typeof C == "string" && C.length > n.maxLength && (C = C.substr(0, n.maxLength) + "..."), f += "<tr><td>" + c + "</td><td>" + ((C === 0 ? "0" : C) || "") + "</td></tr>");
            }
          }
          f += "</table>";
        }
        return ct.show(y.extend({
          name: this.name + "-bubble",
          html: f,
          anchor: o.get(0),
          position: "top|bottom",
          class: "w2ui-info-bubble",
          style: "",
          hideOn: [
            "doc-click"
          ]
        }, n.options ?? {})).hide(() => [
          this.last.bubbleEl = null
        ]);
      }
    }
    getCellEditable(e, t) {
      var s = this.columns[t], n = this.records[e];
      if (!n || !s) return null;
      let i = n.w2ui ? n.w2ui.editable : null;
      return i === false ? null : (i != null && i !== true || typeof (i = 0 < Object.keys(s.editable ?? {}).length ? s.editable : null) == "function" && (s = this.getCellValue(e, t, false), i = i.call(this, n, {
        self: this,
        value: s,
        index: e,
        colIndex: t
      })), i);
    }
    getCellValue(e, t, s, n) {
      var _a2, _b;
      var i = this.columns[t], o = (s !== true ? this.records : this.summary)[e];
      let a = this.parseField(o, i.field), r = "", c = "", d = "", p = "";
      if (((_b = (_a2 = o == null ? void 0 : o.w2ui) == null ? void 0 : _a2.changes) == null ? void 0 : _b[i.field]) != null && (a = o.w2ui.changes[i.field]), i.render != null && e !== -1) {
        if (typeof i.render == "function" && o != null) {
          let f;
          try {
            f = i.render(o, {
              self: this,
              value: a,
              index: e,
              colIndex: t,
              summary: !!s
            });
          } catch (x) {
            throw new Error(`Render function for column "${i.field}" in grid "${this.name}": -- ` + x.message);
          }
          f != null && typeof f == "object" && typeof f != "function" ? (f.id != null && f.text != null ? a = f.text : typeof f.html == "string" ? a = (f.html || "").trim() : (a = "", console.log("ERROR: render function should return a primitive or an object of the following structure.", {
            html: "",
            attr: "",
            style: "",
            class: "",
            divAttr: ""
          })), d = f.attr ?? "", c = f.style ?? "", r = f.class ?? "", p = f.divAttr ?? "") : a = String(f || "").trim();
        }
        if (typeof i.render == "object" && (e = i.render[a]) != null && e !== "" && (a = e), typeof i.render == "string") {
          t = i.render.toLowerCase().indexOf(":"), s = [], t == -1 ? (s[0] = i.render.toLowerCase(), s[1] = "") : (s[0] = i.render.toLowerCase().substr(0, t), s[1] = i.render.toLowerCase().substr(t + 1));
          let f = y.formatters[s[0]];
          i.options && i.options.autoFormat === false && (f = null), a = typeof f == "function" ? f(a, s[1], o) : "";
        }
      }
      return a == null && (a = ""), n ? {
        value: a,
        attr: d,
        style: c,
        className: r,
        divAttr: p
      } : a;
    }
    getFooterHTML() {
      return '<div>    <div class="w2ui-footer-left"></div>    <div class="w2ui-footer-right"></div>    <div class="w2ui-footer-center"></div></div>';
    }
    status(e) {
      if (e != null) h(this.box).find(`#grid_${this.name}_footer`).find(".w2ui-footer-left").html(e);
      else {
        let t = "";
        if (e = this.getSelection(), 0 < e.length && (this.show.statusSelection && 1 < e.length && (t = String(e.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + y.settings.groupSymbol) + " " + y.lang("selected")), this.show.statusRecordID) && e.length == 1) {
          let s = e[0];
          typeof s == "object" && (s = s.recid + ", " + y.lang("Column") + ": " + s.column), t = y.lang("Record ID") + ": " + s + " ";
        }
        h(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-left").html(t);
      }
    }
    lock(e, t) {
      let s = Array.from(arguments);
      s.unshift(this.box), setTimeout(() => {
        h(this.box).find("#grid_" + this.name + "_empty_msg").remove(), y.lock(...s);
      }, 10);
    }
    unlock(e) {
      setTimeout(() => {
        h(this.box).find(".w2ui-message").hasClass("w2ui-closing") || y.unlock(this.box, e);
      }, 25);
    }
    stateSave(e) {
      var t = {
        columns: [],
        show: y.clone(this.show),
        last: {
          search: this.last.search,
          multi: this.last.multi,
          logic: this.last.logic,
          label: this.last.label,
          field: this.last.field,
          scrollTop: this.last.scrollTop,
          scrollLeft: this.last.scrollLeft
        },
        sortData: [],
        searchData: []
      };
      let s;
      for (let i = 0; i < this.columns.length; i++) {
        let o = this.columns[i], a = {};
        Object.keys(this.stateColProps).forEach((r, c) => {
          this.stateColProps[r] && (s = o[r] !== void 0 ? o[r] : this.colTemplate[r] || null, a[r] = s);
        }), t.columns.push(a);
      }
      for (let i = 0; i < this.sortData.length; i++) t.sortData.push(y.clone(this.sortData[i]));
      for (let i = 0; i < this.searchData.length; i++) t.searchData.push(y.clone(this.searchData[i]));
      var n = this.trigger("stateSave", {
        target: this.name,
        state: t
      });
      if (n.isCancelled !== true) return e !== true && this.cacheSave("state", t), n.finish(), t;
    }
    stateRestore(e) {
      var _a2, _b, _c2;
      let t = typeof this.url != "object" ? this.url : this.url.get;
      e = e || this.cache("state");
      var s = this.trigger("stateRestore", {
        target: this.name,
        state: e
      });
      if (s.isCancelled !== true) {
        if (y.isPlainObject(e)) {
          y.extend(this.show, e.show ?? {}), y.extend(this.last, e.last ?? {});
          let o = this.last.scrollTop, a = this.last.scrollLeft;
          for (let r = 0; r < ((_a2 = e.columns) == null ? void 0 : _a2.length); r++) {
            var n = e.columns[r], i = this.getColumn(n.field, true);
            i !== null && (y.extend(this.columns[i], n), r !== i) && this.columns.splice(r, 0, this.columns.splice(i, 1)[0]);
          }
          this.sortData.splice(0, this.sortData.length);
          for (let r = 0; r < ((_b = e.sortData) == null ? void 0 : _b.length); r++) this.sortData.push(e.sortData[r]);
          this.searchData.splice(0, this.searchData.length);
          for (let r = 0; r < ((_c2 = e.searchData) == null ? void 0 : _c2.length); r++) this.searchData.push(e.searchData[r]);
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
        let n = "";
        try {
          n = e;
          var s = String(t).split(".");
          for (let i = 0; i < s.length; i++) n = n[s[i]];
        } catch {
          n = "";
        }
        return n;
      }
      return e ? e[t] : "";
    }
    prepareData() {
      let e = this;
      for (let t = 0; t < this.records.length; t++) (function s(n) {
        var _a2, _b;
        for (let i = 0; i < e.columns.length; i++) {
          let o = e.columns[i];
          if (n[o.field] != null && typeof o.render == "string") {
            if ([
              "number",
              "int",
              "float",
              "money",
              "currency",
              "percent"
            ].indexOf(o.render.split(":")[0]) != -1 && typeof n[o.field] != "number" && (n[o.field] = parseFloat(n[o.field])), [
              "date",
              "age"
            ].indexOf(o.render.split(":")[0]) != -1 && !n[o.field + "_"]) {
              let a = n[o.field];
              y.isInt(a) && (a = parseInt(a)), n[o.field + "_"] = new Date(a);
            }
            if ([
              "time"
            ].indexOf(o.render) != -1) if (y.isTime(n[o.field])) {
              let a = y.isTime(n[o.field], true), r = /* @__PURE__ */ new Date();
              r.setHours(a.hours, a.minutes, a.seconds || 0, 0), n[o.field + "_"] || (n[o.field + "_"] = r);
            } else {
              let a = n[o.field], r = (a = (a = y.isInt(a) ? parseInt(a) : a) != null ? new Date(a) : /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
              r.setHours(a.getHours(), a.getMinutes(), a.getSeconds(), 0), n[o.field + "_"] || (n[o.field + "_"] = r);
            }
          }
        }
        if (((_a2 = n.w2ui) == null ? void 0 : _a2.children) && ((_b = n.w2ui) == null ? void 0 : _b.expanded) !== true) for (let i = 0; i < n.w2ui.children.length; i++) {
          let o = n.w2ui.children[i];
          s(o);
        }
      })(this.records[t]);
    }
    nextCell(e, t, s) {
      if (t += 1, t >= this.columns.length) return (e = this.nextRow(e)) == null ? e : this.nextCell(e, -1, s);
      var i = this.records[e].w2ui, n = this.columns[t], i = i && i.colspan && !isNaN(i.colspan[n.field]) ? parseInt(i.colspan[n.field]) : 1;
      return n == null ? null : n && n.hidden || i === 0 ? this.nextCell(e, t, s) : s && (n = this.getCellEditable(e, t), n == null || [
        "checkbox",
        "check"
      ].indexOf(n.type) != -1) ? this.nextCell(e, t, s) : {
        index: e,
        colIndex: t
      };
    }
    prevCell(e, t, s) {
      if (t -= 1, t < 0) return (e = this.prevRow(e)) == null ? e : this.prevCell(e, this.columns.length, s);
      if (t < 0) return null;
      var i = this.records[e].w2ui, n = this.columns[t], i = i && i.colspan && !isNaN(i.colspan[n.field]) ? parseInt(i.colspan[n.field]) : 1;
      return n == null ? null : n && n.hidden || i === 0 ? this.prevCell(e, t, s) : s && (n = this.getCellEditable(e, t), n == null || [
        "checkbox",
        "check"
      ].indexOf(n.type) != -1) ? this.prevCell(e, t, s) : {
        index: e,
        colIndex: t
      };
    }
    nextRow(e, t, s) {
      var n = this.last.searchIds;
      let i = null;
      if ((s = s ?? 1) == -1) return this.records.length - 1;
      if (e + s < this.records.length && n.length === 0 || 0 < n.length && e < n[n.length - s]) {
        if (e += s, 0 < n.length) for (; !(n.includes(e) || e > this.records.length); ) e += s;
        var a = this.records[e].w2ui, o = this.columns[t], a = a && a.colspan && o != null && !isNaN(a.colspan[o.field]) ? parseInt(a.colspan[o.field]) : 1;
        i = a === 0 ? this.nextRow(e, t, s) : e;
      }
      return i;
    }
    prevRow(e, t, s) {
      var n = this.last.searchIds;
      let i = null;
      if ((s = s ?? 1) == -1) return 0;
      if (0 <= e - s && n.length === 0 || 0 < n.length && e > n[0]) {
        if (e -= s, 0 < n.length) for (; !(n.includes(e) || e < 0); ) e -= s;
        var a = this.records[e].w2ui, o = this.columns[t], a = a && a.colspan && o != null && !isNaN(a.colspan[o.field]) ? parseInt(a.colspan[o.field]) : 1;
        i = a === 0 ? this.prevRow(e, t, s) : e;
      }
      return i;
    }
    selectionSave() {
      return this.last.saved_sel = this.getSelection(), this.last.saved_sel;
    }
    selectionRestore(e) {
      var t, s = Date.now(), n = (this.last.selection = {
        indexes: [],
        columns: {}
      }, this.last.selection), i = this.last.saved_sel;
      if (i) for (let o = 0; o < i.length; o++) y.isPlainObject(i[o]) ? (t = this.get(i[o].recid, true)) != null && (n.indexes.indexOf(t) == -1 && n.indexes.push(t), n.columns[t] || (n.columns[t] = []), n.columns[t].push(i[o].column)) : (t = this.get(i[o], true)) != null && n.indexes.push(t);
      return delete this.last.saved_sel, e !== true && this.refresh(), Date.now() - s;
    }
    message(e) {
      return y.message({
        owner: this,
        box: this.box,
        after: ".w2ui-grid-header"
      }, e);
    }
    confirm(e) {
      return y.confirm({
        owner: this,
        box: this.box,
        after: ".w2ui-grid-header"
      }, e);
    }
  };
  class Ci extends cn {
    constructor(e, t) {
      super(), typeof e == "string" && t == null && (t = {
        type: e
      }), typeof e == "object" && t == null && (t = y.clone(e)), typeof e == "string" && typeof t == "object" && (t.type = e), t.type = String(t.type).toLowerCase(), this.el = t.el ?? null, this.selected = null, this.helpers = {}, this.type = t.type ?? "text", this.options = y.clone(t), this.onClick = t.onClick ?? null, this.onAdd = t.onAdd ?? null, this.onNew = t.onNew ?? null, this.onRemove = t.onRemove ?? null, this.onMouseEnter = t.onMouseEnter ?? null, this.onMouseLeave = t.onMouseLeave ?? null, this.onScroll = t.onScroll ?? null, this.tmp = {}, delete this.options.type, delete this.options.onClick, delete this.options.onMouseEnter, delete this.options.onMouseLeave, delete this.options.onScroll, this.el && this.render(this.el);
    }
    render(e) {
      e instanceof HTMLElement ? (e._w2field ? e._w2field.reset() : e._w2field = this, this.el = e, this.init()) : console.log("ERROR: Cannot init w2field on empty subject");
    }
    init() {
      let e = this.options, t;
      if ([
        "INPUT",
        "TEXTAREA"
      ].includes(this.el.tagName.toUpperCase())) {
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
            t = {
              min: null,
              max: null,
              step: 1,
              autoFormat: true,
              autoCorrect: true,
              currencyPrefix: y.settings.currencyPrefix,
              currencySuffix: y.settings.currencySuffix,
              currencyPrecision: y.settings.currencyPrecision,
              decimalSymbol: y.settings.decimalSymbol,
              groupSymbol: y.settings.groupSymbol,
              arrow: false,
              keyboard: true,
              precision: null,
              prefix: "",
              suffix: ""
            }, this.options = y.extend({}, t, e), (e = this.options).numberRE = new RegExp("[" + e.groupSymbol + "]", "g"), e.moneyRE = new RegExp("[" + e.currencyPrefix + e.currencySuffix + e.groupSymbol + "]", "g"), e.percentRE = new RegExp("[" + e.groupSymbol + "%]", "g"), [
              "text",
              "alphanumeric",
              "hex",
              "bin"
            ].includes(this.type) && (e.arrow = false, e.keyboard = false);
            break;
          case "color":
            t = {
              prefix: "#",
              suffix: `<div style="width: ${parseInt(getComputedStyle(this.el)["font-size"]) || 12}px">&#160;</div>`,
              arrow: false,
              advanced: null,
              transparent: true
            }, this.options = y.extend({}, t, e), e = this.options;
            break;
          case "date":
            t = {
              format: y.settings.dateFormat,
              keyboard: true,
              autoCorrect: true,
              start: null,
              end: null,
              blockDates: [],
              blockWeekdays: [],
              colored: {},
              btnNow: true
            }, this.options = y.extend({
              type: "date"
            }, t, e), e = this.options, h(this.el).attr("placeholder") == null && h(this.el).attr("placeholder", e.format);
            break;
          case "time":
            t = {
              format: y.settings.timeFormat,
              keyboard: true,
              autoCorrect: true,
              start: null,
              end: null,
              btnNow: true,
              noMinutes: false
            }, this.options = y.extend({
              type: "time"
            }, t, e), e = this.options, h(this.el).attr("placeholder") == null && h(this.el).attr("placeholder", e.format);
            break;
          case "datetime":
            t = {
              format: y.settings.dateFormat + "|" + y.settings.timeFormat,
              keyboard: true,
              autoCorrect: true,
              start: null,
              end: null,
              startTime: null,
              endTime: null,
              blockDates: [],
              blockWeekdays: [],
              colored: {},
              btnNow: true,
              noMinutes: false
            }, this.options = y.extend({
              type: "datetime"
            }, t, e), e = this.options, h(this.el).attr("placeholder") == null && h(this.el).attr("placeholder", e.placeholder || e.format);
            break;
          case "list":
          case "combo":
            t = {
              items: [],
              selected: {},
              url: null,
              recId: null,
              recText: null,
              method: null,
              debounce: 250,
              postData: {},
              minLength: 1,
              cacheMax: 250,
              maxDropHeight: 350,
              maxDropWidth: null,
              minDropWidth: null,
              match: "begins",
              icon: null,
              iconStyle: "",
              align: "both",
              altRows: true,
              renderDrop: null,
              compare: null,
              filter: true,
              hideSelected: false,
              prefix: "",
              suffix: "",
              msgNoItems: "No matches",
              msgSearch: "Type to search...",
              openOnFocus: false,
              markSearch: false,
              onSearch: null,
              onRequest: null,
              onLoad: null,
              onError: null
            }, typeof e.items == "function" && (e._items_fun = e.items), e.items = y.normMenu.call(this, e.items), this.type === "list" && (h(this.el).addClass("w2ui-select"), !y.isPlainObject(e.selected)) && Array.isArray(e.items) && e.items.forEach((s) => {
              s && s.id === e.selected && (e.selected = y.clone(s));
            }), e = y.extend({}, t, e), this.options = e, y.isPlainObject(e.selected) || (e.selected = {}), this.selected = e.selected, h(this.el).attr("autocapitalize", "off").attr("autocomplete", "off").attr("autocorrect", "off").attr("spellcheck", "false"), e.selected.text != null && h(this.el).val(e.selected.text);
            break;
          case "enum":
            t = {
              items: [],
              selected: [],
              max: 0,
              url: null,
              recId: null,
              recText: null,
              debounce: 250,
              method: null,
              postData: {},
              minLength: 1,
              cacheMax: 250,
              maxItemWidth: 250,
              maxDropHeight: 350,
              maxDropWidth: null,
              match: "contains",
              align: "",
              altRows: true,
              openOnFocus: false,
              markSearch: false,
              renderDrop: null,
              renderItem: null,
              compare: null,
              filter: true,
              hideSelected: true,
              style: "",
              msgNoItems: "No matches",
              msgSearch: "Type to search...",
              onSearch: null,
              onRequest: null,
              onLoad: null,
              onError: null,
              onClick: null,
              onAdd: null,
              onNew: null,
              onRemove: null,
              onMouseEnter: null,
              onMouseLeave: null,
              onScroll: null
            }, typeof (e = y.extend({}, t, e, {
              suffix: ""
            })).items == "function" && (e._items_fun = e.items), e.items = y.normMenu.call(this, e.items), e.selected = y.normMenu.call(this, e.selected), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected;
            break;
          case "file":
            t = {
              selected: [],
              max: 0,
              maxSize: 0,
              maxFileSize: 0,
              maxItemWidth: 250,
              maxDropHeight: 350,
              maxDropWidth: null,
              readContent: true,
              silent: true,
              align: "both",
              altRows: true,
              renderItem: null,
              style: "",
              onClick: null,
              onAdd: null,
              onRemove: null,
              onMouseEnter: null,
              onMouseLeave: null
            }, e = y.extend({}, t, e), this.options = e, Array.isArray(e.selected) || (e.selected = []), this.selected = e.selected, h(this.el).attr("placeholder") == null && h(this.el).attr("placeholder", y.lang("Attach files by dragging and dropping or Click to Select"));
        }
        h(this.el).css("box-sizing", "border-box").addClass("w2field w2ui-input").off(".w2field").on("change.w2field", (s) => {
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
      return [
        "list",
        "enum",
        "file"
      ].indexOf(this.type) !== -1 ? this.selected : h(this.el).val();
    }
    set(e, t) {
      [
        "list",
        "enum",
        "file"
      ].indexOf(this.type) !== -1 ? (this.type !== "list" && t ? (Array.isArray(this.selected) || (this.selected = []), this.selected.push(e), (t = Jt.get(this.el.id + "_menu")) && (t.options.selected = this.selected)) : (e == null && (e = []), t = this.type !== "enum" || Array.isArray(e) ? e : [
        e
      ], this.selected = t), h(this.el).trigger("input").trigger("change"), this.refresh()) : h(this.el).val(e);
    }
    setIndex(e, t) {
      if ([
        "list",
        "enum"
      ].indexOf(this.type) !== -1) {
        var s = this.options.items;
        if (s && s[e]) return this.type == "list" && (this.selected = s[e]), this.type == "enum" && (t || (this.selected = []), this.selected.push(s[e])), (t = Jt.get(this.el.id + "_menu")) && (t.options.selected = this.selected), h(this.el).trigger("input").trigger("change"), this.refresh(), true;
      }
      return false;
    }
    refresh() {
      var _a2, _b;
      let e = this.options;
      var t = Date.now(), s = getComputedStyle(this.el);
      if (this.type == "list") {
        if (h(this.el).parent().css("white-space", "nowrap"), this.helpers.prefix && this.helpers.prefix.hide(), !this.helpers.search) return;
        this.selected == null && e.icon ? e.prefix = `
                    <span class="w2ui-icon ${e.icon} "style="cursor: pointer; font-size: 14px;
                        display: inline-block; margin-top: -1px; color: #7F98AD; ${e.iconStyle}">
                    </span>` : e.prefix = "", this.addPrefix();
        let r = h(this.helpers.search_focus);
        var n = h(r[0].previousElementSibling);
        r.css({
          outline: "none"
        }), r.val() === "" ? (r.css("opacity", 0), n.css("opacity", 0), ((_a2 = this.selected) == null ? void 0 : _a2.id) ? (a = this.selected.text, o = this.findItemIndex(e.items, this.selected.id), a != null && h(this.el).val(y.lang(a)).data({
          selected: a,
          selectedIndex: o[0]
        })) : (this.el.value = "", h(this.el).removeData("selected selectedIndex"))) : (r.css("opacity", 1), n.css("opacity", 1), h(this.el).val(""), setTimeout(() => {
          this.helpers.prefix && this.helpers.prefix.hide(), e.icon ? (r.css("margin-left", "17px"), h(this.helpers.search).find(".w2ui-icon-search").addClass("show-search")) : (r.css("margin-left", "0px"), h(this.helpers.search).find(".w2ui-icon-search").removeClass("show-search"));
        }, 1)), h(this.el).prop("readOnly") || h(this.el).prop("disabled") ? setTimeout(() => {
          this.helpers.prefix && h(this.helpers.prefix).css("opacity", "0.6"), this.helpers.suffix && h(this.helpers.suffix).css("opacity", "0.6");
        }, 1) : setTimeout(() => {
          this.helpers.prefix && h(this.helpers.prefix).css("opacity", "1"), this.helpers.suffix && h(this.helpers.suffix).css("opacity", "1");
        }, 1);
      }
      let i = this.helpers.multi;
      if ([
        "enum",
        "file"
      ].includes(this.type) && i) {
        let r = "";
        Array.isArray(this.selected) && this.selected.forEach((c, d) => {
          c != null && (r += `
                        <div class="li-item" index="${d}" style="max-width: ${parseInt(e.maxItemWidth)}px; ${c.style || ""}">
                        ${typeof e.renderItem == "function" ? e.renderItem(c, d, `<div class="w2ui-list-remove" index="${d}">&#160;&#160;</div>`) : `
                               ${c.icon ? `<span class="w2ui-icon ${c.icon}"></span>` : ""}
                               <div class="w2ui-list-remove" index="${d}">&#160;&#160;</div>
                               ${(this.type === "enum" ? c.text : c.name) ?? c.id ?? c}
                               ${c.size ? `<span class="file-size"> - ${y.formatSize(c.size)}</span>` : ""}
                            `}
                        </div>`);
        });
        var o, a = i.find(".w2ui-multi-items");
        e.style && i.attr("style", i.attr("style") + ";" + e.style), h(this.el).css("z-index", "-1"), h(this.el).prop("readOnly") || h(this.el).prop("disabled") ? setTimeout(() => {
          i[0].scrollTop = 0, i.addClass("w2ui-readonly").find(".li-item").css("opacity", "0.9").parent().find(".li-search").hide().find("input").prop("readOnly", true).closest(".w2ui-multi-items").find(".w2ui-list-remove").hide();
        }, 1) : setTimeout(() => {
          i.removeClass("w2ui-readonly").find(".li-item").css("opacity", "1").parent().find(".li-search").show().find("input").prop("readOnly", false).closest(".w2ui-multi-items").find(".w2ui-list-remove").show();
        }, 1), 0 < ((_b = this.selected) == null ? void 0 : _b.length) && h(this.el).attr("placeholder", ""), i.find(".w2ui-enum-placeholder").remove(), a.find(".li-item").remove(), r !== "" ? a.prepend(r) : h(this.el).attr("placeholder") != null && i.find("input").val() === "" && (o = y.stripSpaces(`
                    padding-top: ${s["padding-top"]};
                    padding-left: ${s["padding-left"]};
                    box-sizing: ${s["box-sizing"]};
                    line-height: ${s["line-height"]};
                    font-size: ${s["font-size"]};
                    font-family: ${s["font-family"]};
                `), i.prepend(`<div class="w2ui-enum-placeholder" style="${o}">${h(this.el).attr("placeholder")}</div>`)), i.off(".w2item").on("scroll.w2item", (c) => {
          c = this.trigger("scroll", {
            target: this.el,
            originalEvent: c
          }), c.isCancelled !== true && (ct.hide(this.el.id + "_preview"), c.finish());
        }).find(".li-item").on("click.w2item", (c) => {
          var d = h(c.target).closest(".li-item"), p = d.attr("index"), f = this.selected[p];
          if (!h(d).hasClass("li-search")) {
            c.stopPropagation();
            let x;
            if (h(c.target).hasClass("w2ui-list-remove")) h(this.el).prop("readOnly") || h(this.el).prop("disabled") || (x = this.trigger("remove", {
              target: this.el,
              originalEvent: c,
              item: f
            })).isCancelled !== true && (this.selected.splice(p, 1), h(this.el).trigger("input").trigger("change"), h(c.target).remove());
            else if ((x = this.trigger("click", {
              target: this.el,
              originalEvent: c.originalEvent,
              item: f
            })).isCancelled !== true) {
              let b = f.tooltip;
              if (this.type === "file" && (/image/i.test(f.type) && (b = `
                                    <div class="w2ui-file-preview">
                                        <img src="${f.content ? "data:" + f.type + ";base64," + f.content : ""}"
                                            style="max-width: 300px">
                                    </div>`), b += `
                                <div class="w2ui-file-info">
                                    <div class="file-caption">${y.lang("Name")}:</div>
                                    <div class="file-value">${f.name}</div>
                                    <div class="file-caption">${y.lang("Size")}:</div>
                                    <div class="file-value">${y.formatSize(f.size)}</div>
                                    <div class="file-caption">${y.lang("Type")}:</div>
                                    <div class="file-value file-type">${f.type}</div>
                                    <div class="file-caption">${y.lang("Modified")}:</div>
                                    <div class="file-value">${y.date(f.modified)}</div>
                                </div>`), b) {
                let C = this.el.id + "_preview";
                ct.show({
                  name: C,
                  anchor: d.get(0),
                  html: b,
                  hideOn: [
                    "doc-click"
                  ],
                  class: ""
                }).show((_) => {
                  h(`#w2overlay-${C} img`).on("load", function(S) {
                    var A = this.clientWidth, P = this.clientHeight;
                    A < 300 & P < 300 || (P <= A && 300 < A && h(this).css("width", "300px"), A < P && 300 < P && h(this).css("height", "300px"));
                  }).on("error", function(S) {
                    this.style.display = "none";
                  });
                });
              }
              x.finish();
            }
          }
        }).on("mouseenter.w2item", (c) => {
          var d = h(c.target).closest(".li-item");
          h(d).hasClass("li-search") || (d = this.selected[h(c.target).attr("index")], (c = this.trigger("mouseEnter", {
            target: this.el,
            originalEvent: c,
            item: d
          })).isCancelled !== true && c.finish());
        }).on("mouseleave.w2item", (c) => {
          var d = h(c.target).closest(".li-item");
          h(d).hasClass("li-search") || (d = this.selected[h(c.target).attr("index")], (c = this.trigger("mouseLeave", {
            target: this.el,
            originalEvent: c,
            item: d
          })).isCancelled !== true && c.finish());
        }), this.type === "enum" ? this.helpers.multi.find("input").css({
          width: "15px"
        }) : this.helpers.multi.find(".li-search").hide(), this.resize();
      }
      return Date.now() - t;
    }
    resize() {
      var e = this.el.clientWidth, t = getComputedStyle(this.el), o = this.helpers.search, s = this.helpers.multi, n = this.helpers.suffix, i = this.helpers.prefix, o = (o && h(o).css("width", e), s && h(s).css("width", e - parseInt(t["margin-left"], 10) - parseInt(t["margin-right"], 10)), n && this.addSuffix(), i && this.addPrefix(), this.helpers.multi);
      if ([
        "enum",
        "file"
      ].includes(this.type) && o) {
        h(this.el).css("height", "auto");
        let a = h(o).find(":scope div.w2ui-multi-items").get(0).clientHeight + 5;
        (a = (a = a < 20 ? 20 : a) > this.tmp["max-height"] ? this.tmp["max-height"] : a) < this.tmp["min-height"] && (a = this.tmp["min-height"]), s = y.getSize(this.el, "height") - 2, s > a && (a = s), h(o).css({
          height: a + "px",
          overflow: a == this.tmp["max-height"] ? "auto" : "hidden"
        }), h(o).css("height", a + "px"), h(this.el).css({
          height: a + "px"
        });
      }
      this.tmp.current_width = e;
    }
    reset() {
      this.tmp != null && (h(this.el).css("height", "auto"), Array("padding-left", "padding-right", "background-color", "border-color").forEach((e) => {
        this.tmp && this.tmp["old-" + e] != null && (h(this.el).css(e, this.tmp["old-" + e]), delete this.tmp["old-" + e]);
      }), clearInterval(this.tmp.sizeTimer)), h(this.el).val(this.clean(h(this.el).val())).removeClass("w2field").removeData("selected selectedIndex").off(".w2field"), Object.keys(this.helpers).forEach((e) => {
        h(this.helpers[e]).remove();
      }), this.helpers = {};
    }
    clean(e) {
      var t;
      return e = typeof e != "number" && (t = this.options, e = String(e).trim(), [
        "int",
        "float",
        "money",
        "currency",
        "percent"
      ].includes(this.type)) ? (e = typeof e == "string" ? (e = t.autoFormat && ([
        "money",
        "currency"
      ].includes(this.type) && (e = String(e).replace(t.moneyRE, "")), this.type === "percent" && (e = String(e).replace(t.percentRE, "")), [
        "int",
        "float"
      ].includes(this.type)) ? String(e).replace(t.numberRE, "") : e).replace(/\s+/g, "").replace(new RegExp(t.groupSymbol, "g"), "").replace(t.decimalSymbol, ".") : e) !== "" && y.isFloat(e) ? Number(e) : "" : e;
    }
    format(e) {
      var t = this.options;
      if (t.autoFormat && e !== "") {
        switch (this.type) {
          case "money":
          case "currency":
            (e = y.formatNumber(e, t.currencyPrecision, true)) !== "" && (e = t.currencyPrefix + e + t.currencySuffix);
            break;
          case "percent":
            (e = y.formatNumber(e, t.precision, true)) !== "" && (e += "%");
            break;
          case "float":
            e = y.formatNumber(e, t.precision, true);
            break;
          case "int":
            e = y.formatNumber(e, 0, true);
        }
        var s = parseInt(1e3).toLocaleString(y.settings.locale, {
          useGrouping: true
        }).slice(1, 2);
        s !== this.options.groupSymbol && (e = e.replaceAll(s, this.options.groupSymbol));
      }
      return e;
    }
    change(e) {
      if ([
        "int",
        "float",
        "money",
        "currency",
        "percent"
      ].indexOf(this.type) !== -1) {
        var t = h(this.el).val(), s = this.format(this.clean(h(this.el).val()));
        if (t !== "" && t != s) return h(this.el).val(s), e.stopPropagation(), e.preventDefault(), false;
      }
      if (this.type === "color") {
        let n = h(this.el).val();
        n.substr(0, 3).toLowerCase() !== "rgb" && (n = "#" + n, (t = h(this.el).val().length) !== 8) && t !== 6 && t !== 3 && (n = ""), s = h(this.el).get(0).nextElementSibling, h(s).find("div").css("background-color", n), h(this.el).hasClass("has-focus") && this.updateOverlay();
      }
      if ([
        "list",
        "enum",
        "file"
      ].indexOf(this.type) !== -1 && this.refresh(), [
        "date",
        "time",
        "datetime"
      ].indexOf(this.type) !== -1) {
        let n = parseInt(this.el.value);
        y.isInt(this.el.value) && 3e3 < n && (this.type === "time" && (n = y.formatTime(new Date(n), this.options.format)), this.type === "date" && (n = y.formatDate(new Date(n), this.options.format)), this.type === "datetime" && (n = y.formatDateTime(new Date(n), this.options.format)), h(this.el).val(n).trigger("input").trigger("change"));
      }
    }
    click(e) {
      [
        "list",
        "combo",
        "enum"
      ].includes(this.type) && (h(this.el).hasClass("has-focus") || this.focus(e), this.type == "combo" && this.updateOverlay(), this.type == "list") && (this.updateOverlay(), e.stopPropagation()), [
        "date",
        "time",
        "datetime",
        "color"
      ].includes(this.type) && this.updateOverlay();
    }
    focus(e) {
      if (this.type == "list" && document.activeElement == this.el) this.helpers.search_focus.focus();
      else {
        if ([
          "color",
          "date",
          "time",
          "datetime"
        ].indexOf(this.type) !== -1) {
          if (h(this.el).prop("readOnly") || h(this.el).prop("disabled")) return;
          this.updateOverlay();
        }
        if ([
          "list",
          "combo",
          "enum"
        ].indexOf(this.type) !== -1) {
          if (h(this.el).prop("readOnly") || h(this.el).prop("disabled")) return void h(this.el).addClass("has-focus");
          typeof this.options._items_fun == "function" && (this.options.items = y.normMenu.call(this, this.options._items_fun)), this.helpers.search && ((t = this.helpers.search_focus).value = "", t.select()), this.type == "enum" && (t = h(this.el.previousElementSibling).find(".li-search input").get(0), document.activeElement !== t) && t.focus(), this.resize(), e.showMenu === false || this.options.openOnFocus === false && !h(this.el).hasClass("has-focus") || setTimeout(() => {
            this.updateOverlay();
          }, 100);
        }
        var t;
        this.type == "file" && (t = h(this.el).get(0).previousElementSibling, h(t).addClass("has-focus")), h(this.el).addClass("has-focus");
      }
    }
    blur(e) {
      var _a2;
      var t, s = h(this.el).val().trim();
      if (h(this.el).removeClass("has-focus"), [
        "int",
        "float",
        "money",
        "currency",
        "percent"
      ].includes(this.type) && s !== "") {
        let n = s, i = "";
        this.isStrValid(s) ? (t = this.clean(s), this.options.min != null && t < this.options.min && (n = this.options.min, i = "Should be >= " + this.options.min), this.options.max != null && t > this.options.max && (n = this.options.max, i = "Should be <= " + this.options.max)) : n = "", this.options.autoCorrect && (h(this.el).val(n).trigger("input").trigger("change"), i) && (ct.show({
          name: this.el.id + "_error",
          anchor: this.el,
          html: i
        }), setTimeout(() => {
          ct.hide(this.el.id + "_error");
        }, 3e3));
      }
      [
        "date",
        "time",
        "datetime"
      ].includes(this.type) && this.options.autoCorrect && s !== "" && (t = this.type == "date" ? y.isDate : this.type == "time" ? y.isTime : y.isDateTime, Ln.inRange(this.el.value, this.options) && t.bind(y)(this.el.value, this.options.format) || h(this.el).val("").trigger("input").trigger("change")), this.type === "enum" && h(this.helpers.multi).find("input").val("").css("width", "15px"), this.type == "file" && (s = this.el.previousElementSibling, h(s).removeClass("has-focus")), this.type === "list" && (this.el.value = ((_a2 = this.selected) == null ? void 0 : _a2.text) ?? "");
    }
    keyDown(e, i) {
      var s, n = this.options, i = e.keyCode || i && i.keyCode;
      let o = false, a, r, c, d, p, f;
      if ([
        "int",
        "float",
        "money",
        "currency",
        "percent",
        "hex",
        "bin",
        "color",
        "alphanumeric"
      ].includes(this.type) && !(e.metaKey || e.ctrlKey || e.altKey || this.isStrValid(e.key ?? "1", true) || [
        9,
        8,
        13,
        27,
        37,
        38,
        39,
        40,
        46
      ].includes(e.keyCode))) return e.preventDefault(), e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true, false;
      if ([
        "int",
        "float",
        "money",
        "currency",
        "percent"
      ].includes(this.type)) {
        if (!n.keyboard || h(this.el).prop("readOnly") || h(this.el).prop("disabled")) return;
        switch (a = parseFloat(h(this.el).val().replace(n.moneyRE, "")) || 0, r = n.step, (e.ctrlKey || e.metaKey) && (r = 10 * n.step), i) {
          case 38:
            e.shiftKey || (p = a + r <= n.max || n.max == null ? Number((a + r).toFixed(12)) : n.max, h(this.el).val(p).trigger("input").trigger("change"), o = true);
            break;
          case 40:
            e.shiftKey || (p = a - r >= n.min || n.min == null ? Number((a - r).toFixed(12)) : n.min, h(this.el).val(p).trigger("input").trigger("change"), o = true);
        }
        o && (e.preventDefault(), this.moveCaret2end());
      }
      if ([
        "date",
        "datetime"
      ].includes(this.type)) {
        if (!n.keyboard || h(this.el).prop("readOnly") || h(this.el).prop("disabled")) return;
        var x = (this.type == "date" ? y.isDate : y.isDateTime).bind(y), b = (this.type == "date" ? y.formatDate : y.formatDateTime).bind(y);
        switch (c = 864e5, r = 1, (e.ctrlKey || e.metaKey) && (r = 10), (d = x(h(this.el).val(), n.format, true)) || (d = /* @__PURE__ */ new Date(), c = 0), i) {
          case 38:
            e.shiftKey || (r == 10 ? d.setMonth(d.getMonth() + 1) : d.setTime(d.getTime() + c), f = b(d.getTime(), n.format), h(this.el).val(f).trigger("input").trigger("change"), o = true);
            break;
          case 40:
            e.shiftKey || (r == 10 ? d.setMonth(d.getMonth() - 1) : d.setTime(d.getTime() - c), f = b(d.getTime(), n.format), h(this.el).val(f).trigger("input").trigger("change"), o = true);
        }
        o && (e.preventDefault(), this.moveCaret2end(), this.updateOverlay());
      }
      if (this.type === "time") {
        if (!n.keyboard || h(this.el).prop("readOnly") || h(this.el).prop("disabled")) return;
        r = e.ctrlKey || e.metaKey ? 60 : 1, a = h(this.el).val();
        let C = Ln.str2min(a) || Ln.str2min((/* @__PURE__ */ new Date()).getHours() + ":" + ((/* @__PURE__ */ new Date()).getMinutes() - 1));
        switch (i) {
          case 38:
            e.shiftKey || (C += r, o = true);
            break;
          case 40:
            e.shiftKey || (C -= r, o = true);
        }
        o && (e.preventDefault(), h(this.el).val(Ln.min2str(C)).trigger("input").trigger("change"), this.moveCaret2end());
      }
      if ([
        "list",
        "enum"
      ].includes(this.type)) switch (i) {
        case 8:
        case 46:
          this.type == "list" ? h(this.helpers.search_focus).val() == "" && (this.selected = null, Jt.hide(this.el.id + "_menu"), h(this.el).val("").trigger("input").trigger("change")) : h(this.helpers.multi).find("input").val() == "" && (Jt.hide(this.el.id + "_menu"), this.selected.pop(), (s = Jt.get(this.el.id + "_menu")) && (s.options.selected = this.selected), this.refresh());
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
        let n = h(this.helpers.search_focus);
        n.val() !== "" ? h(this.el).attr("placeholder", "") : h(this.el).attr("placeholder", this.tmp.pholder), e.keyCode == 13 && setTimeout(() => {
          n.val(""), Jt.hide(this.el.id + "_menu"), this.refresh();
        }, 1), [
          38,
          40
        ].includes(e.keyCode) && !this.tmp.overlay.overlay.displayed && this.updateOverlay(), this.refresh();
      }
      var t, s;
      this.type == "combo" && this.updateOverlay(), this.type == "enum" && (t = this.helpers.multi.find("input"), s = getComputedStyle(t.get(0)), s = y.getStrWidth(t.val(), `font-family: ${s["font-family"]}; font-size: ${s["font-size"]};`), t.css({
        width: s + 15 + "px"
      }), this.resize(), [
        38,
        40
      ].includes(e.keyCode)) && !((_b = (_a2 = this.tmp.overlay) == null ? void 0 : _a2.overlay) == null ? void 0 : _b.displayed) && this.updateOverlay();
    }
    findItemIndex(e, t, s) {
      let n = [];
      var i;
      return s = s || [], [
        "list",
        "combo",
        "enum"
      ].includes(this.type) && this.options.url && (i = Jt.get(this.el.id + "_menu")) && (e = i.options.items, this.options.items = e), e.forEach((o, a) => {
        o.id === t && (n = s.concat([
          a
        ]), this.options.index = [
          a
        ]), n.length == 0 && o.items && 0 < o.items.length && (s.push(a), n = this.findItemIndex(o.items, t, s), s.pop());
      }), n;
    }
    updateOverlay(e) {
      let t = this.options;
      if (this.type === "color") {
        if (h(this.el).prop("readOnly") || h(this.el).prop("disabled")) return;
        ul.show(y.extend({
          name: this.el.id + "_color",
          anchor: this.el,
          transparent: t.transparent,
          advanced: t.advanced,
          color: this.el.value,
          liveUpdate: true
        }, this.options)).select((n) => {
          n = n.detail.color, h(this.el).val(n).trigger("input").trigger("change");
        }).liveUpdate((n) => {
          n = n.detail.color, h(this.helpers.suffix).find(":scope > div").css("background-color", "#" + n);
        });
      }
      if ([
        "list",
        "combo",
        "enum"
      ].includes(this.type)) {
        var s;
        this.el;
        let n = this.el;
        this.type === "enum" && (s = this.helpers.multi.get(0), n = h(s).find("input").get(0)), this.type === "list" && (s = this.selected, y.isPlainObject(s) && 0 < Object.keys(s).length && 0 < (s = this.findItemIndex(t.items, s.id)).length && (t.index = s), n = this.helpers.search_focus), !h(this.el).hasClass("has-focus") || this.el.readOnly || this.el.disabled || (s = y.extend({}, t, {
          name: this.el.id + "_menu",
          anchor: n,
          selected: this.selected,
          search: false,
          render: t.renderDrop,
          anchorClass: "",
          offsetY: 5,
          maxHeight: t.maxDropHeight,
          maxWidth: t.maxDropWidth,
          minWidth: t.minDropWidth
        }), this.tmp.overlay = Jt.show(s).select((i) => {
          var _a2;
          var o, a;
          [
            "list",
            "combo"
          ].includes(this.type) ? (this.selected = i.detail.item, h(n).val(""), h(this.el).val(this.selected.text).trigger("input").trigger("change"), this.focus({
            showMenu: false
          })) : (a = this.selected, (o = (_a2 = i.detail) == null ? void 0 : _a2.item) && (i = this.trigger("add", {
            target: this.el,
            item: o,
            originalEvent: i
          })).isCancelled !== true && (a.length >= t.max && 0 < t.max && a.pop(), delete o.hidden, a.push(o), h(this.el).trigger("input").trigger("change"), h(this.helpers.multi).find("input").val(""), (a = Jt.get(this.el.id + "_menu")) && (a.options.selected = this.selected), i.finish()));
        }));
      }
      ![
        "date",
        "time",
        "datetime"
      ].includes(this.type) || h(this.el).prop("readOnly") || h(this.el).prop("disabled") || Ln.show(y.extend({
        name: this.el.id + "_date",
        anchor: this.el,
        value: this.el.value
      }, this.options)).select((n) => {
        n = n.detail.date, n != null && h(this.el).val(n).trigger("input").trigger("change");
      });
    }
    isStrValid(e, t) {
      let s = true;
      switch (this.type) {
        case "int":
          s = !(!t || ![
            "-",
            this.options.groupSymbol
          ].includes(e)) || y.isInt(e.replace(this.options.numberRE, ""));
          break;
        case "percent":
          e = e.replace(/%/g, "");
        case "float":
          s = !(!t || ![
            "-",
            "",
            this.options.decimalSymbol,
            this.options.groupSymbol
          ].includes(e)) || y.isFloat(e.replace(this.options.numberRE, ""));
          break;
        case "money":
        case "currency":
          s = !(!t || ![
            "-",
            this.options.decimalSymbol,
            this.options.groupSymbol,
            this.options.currencyPrefix,
            this.options.currencySuffix
          ].includes(e)) || y.isFloat(e.replace(this.options.moneyRE, ""));
          break;
        case "bin":
          s = y.isBin(e);
          break;
        case "color":
        case "hex":
          s = y.isHex(e);
          break;
        case "alphanumeric":
          s = y.isAlphaNumeric(e);
      }
      return s;
    }
    addPrefix() {
      var e, t;
      this.options.prefix && (t = getComputedStyle(this.el), this.tmp["old-padding-left"] == null && (this.tmp["old-padding-left"] = t["padding-left"]), this.helpers.prefix && h(this.helpers.prefix).remove(), h(this.el).before(`<div class="w2ui-field-helper">${this.options.prefix}</div>`), e = h(this.el).get(0).previousElementSibling, h(e).css({
        color: t.color,
        "font-family": t["font-family"],
        "font-size": t["font-size"],
        height: this.el.clientHeight + "px",
        "padding-top": t["padding-top"],
        "padding-bottom": t["padding-bottom"],
        "padding-left": this.tmp["old-padding-left"],
        "padding-right": 0,
        "margin-top": parseInt(t["margin-top"], 10) + 2 + "px",
        "margin-bottom": parseInt(t["margin-bottom"], 10) + 1 + "px",
        "margin-left": t["margin-left"],
        "margin-right": 0,
        "z-index": 1
      }), h(this.el).css("padding-left", e.clientWidth + "px !important"), this.helpers.prefix = e);
    }
    addSuffix() {
      if (this.options.suffix || this.options.arrow) {
        let s, n = this;
        var e = getComputedStyle(this.el), t = (this.tmp["old-padding-right"] == null && (this.tmp["old-padding-right"] = e["padding-right"]), parseInt(e["padding-right"] || 0));
        this.options.arrow && (this.helpers.arrow && h(this.helpers.arrow).remove(), h(this.el).after('<div class="w2ui-field-helper" style="border: 1px solid transparent">&#160;    <div class="w2ui-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="w2ui-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>'), s = h(this.el).get(0).nextElementSibling, h(s).css({
          color: e.color,
          "font-family": e["font-family"],
          "font-size": e["font-size"],
          height: this.el.clientHeight + "px",
          padding: 0,
          "margin-top": parseInt(e["margin-top"], 10) + 1 + "px",
          "margin-bottom": 0,
          "border-left": "1px solid silver",
          width: "16px",
          transform: "translateX(-100%)"
        }).on("mousedown", function(i) {
          h(i.target).hasClass("arrow-up") && n.keyDown(i, {
            keyCode: 38
          }), h(i.target).hasClass("arrow-down") && n.keyDown(i, {
            keyCode: 40
          });
        }), t += s.clientWidth, h(this.el).css("padding-right", t + "px !important"), this.helpers.arrow = s), this.options.suffix !== "" && (this.helpers.suffix && h(this.helpers.suffix).remove(), h(this.el).after(`<div class="w2ui-field-helper">${this.options.suffix}</div>`), s = h(this.el).get(0).nextElementSibling, h(s).css({
          color: e.color,
          "font-family": e["font-family"],
          "font-size": e["font-size"],
          height: this.el.clientHeight + "px",
          "padding-top": e["padding-top"],
          "padding-bottom": e["padding-bottom"],
          "padding-left": 0,
          "padding-right": e["padding-right"],
          "margin-top": parseInt(e["margin-top"], 10) + 2 + "px",
          "margin-bottom": parseInt(e["margin-bottom"], 10) + 1 + "px",
          transform: "translateX(-100%)"
        }), h(this.el).css("padding-right", s.clientWidth + "px !important"), this.helpers.suffix = s);
      }
    }
    addSearch() {
      if (this.type === "list") {
        this.helpers.search && h(this.helpers.search).remove();
        let s = parseInt(h(this.el).attr("tabIndex")), n = (isNaN(s) || s === -1 || (this.tmp["old-tabIndex"] = s), (s = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : s) != null && !isNaN(s) || (s = 0), "");
        var e = `
            <div class="w2ui-field-helper">
                <span class="w2ui-icon w2ui-icon-search"></span>
                <input ${n = h(this.el).attr("id") != null ? 'id="' + h(this.el).attr("id") + '_search"' : n} type="text" tabIndex="${s}" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`, e = (h(this.el).attr("tabindex", -1).before(e), h(this.el).get(0).previousElementSibling), t = (this.helpers.search = e, this.helpers.search_focus = h(e).find("input").get(0), getComputedStyle(this.el));
        h(e).css({
          width: this.el.clientWidth + "px",
          "margin-top": t["margin-top"],
          "margin-left": t["margin-left"],
          "margin-bottom": t["margin-bottom"],
          "margin-right": t["margin-right"]
        }).find("input").css({
          cursor: "default",
          width: "100%",
          opacity: 1,
          padding: t.padding,
          margin: t.margin,
          border: "1px solid transparent",
          "background-color": "transparent"
        }), h(e).find("input").off(".helper").on("focus.helper", (i) => {
          h(i.target).val(""), this.tmp.pholder = h(this.el).attr("placeholder") ?? "", this.focus(i), i.stopPropagation();
        }).on("blur.helper", (i) => {
          h(i.target).val(""), this.tmp.pholder != null && h(this.el).attr("placeholder", this.tmp.pholder), this.blur(i), i.stopPropagation();
        }).on("keydown.helper", (i) => {
          this.keyDown(i);
        }).on("keyup.helper", (i) => {
          this.keyUp(i);
        }), h(e).on("click", (i) => {
          h(i.target).find("input").focus();
        });
      }
    }
    addMultiSearch() {
      if ([
        "enum",
        "file"
      ].includes(this.type)) {
        h(this.helpers.multi).remove();
        let i = "";
        var e, t, s = getComputedStyle(this.el), n = y.stripSpaces(`
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: ${s["margin-left"]};
            margin-right: ${s["margin-right"]};
            width: ${y.getSize(this.el, "width") - parseInt(s["margin-left"], 10) - parseInt(s["margin-right"], 10)}px;
        `);
        this.tmp["min-height"] == null && (e = this.tmp["min-height"] = parseInt((s["min-height"] != "none" ? s["min-height"] : 0) || 0), t = parseInt(s.height), this.tmp["min-height"] = Math.max(e, t)), this.tmp["max-height"] == null && s["max-height"] != "none" && (this.tmp["max-height"] = parseInt(s["max-height"]));
        let o = "", a = (h(this.el).attr("id") != null && (o = `id="${h(this.el).attr("id")}_search"`), parseInt(h(this.el).attr("tabIndex"))), r = (isNaN(a) || a === -1 || (this.tmp["old-tabIndex"] = a), (a = this.tmp["old-tabIndex"] ? this.tmp["old-tabIndex"] : a) != null && !isNaN(a) || (a = 0), this.type === "enum" && (i = `
            <div class="w2ui-field-helper w2ui-list" style="${n}">
                <div class="w2ui-multi-items">
                    <div class="li-search">
                        <input ${o} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${a}"
                            ${h(this.el).prop("readOnly") ? "readonly" : ""}
                            ${h(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.type === "file" && (i = `
            <div class="w2ui-field-helper w2ui-list" style="${n}">
                <div class="w2ui-multi-file">
                    <input name="attachment" class="file-input" type="file" tabindex="-1"'
                        style="width: 100%; height: 100%; opacity: 0" title=""
                        ${this.options.max !== 1 ? "multiple" : ""}
                        ${h(this.el).prop("readOnly") || h(this.el).prop("disabled") ? "disabled" : ""}
                        ${h(this.el).attr("accept") ? ' accept="' + h(this.el).attr("accept") + '"' : ""}>
                </div>
                <div class="w2ui-multi-items">
                    <div class="li-search" style="display: none">
                        <input ${o} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${a}"
                            ${h(this.el).prop("readOnly") ? "readonly" : ""}
                            ${h(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`), this.tmp["old-background-color"] = s["background-color"], this.tmp["old-border-color"] = s["border-color"], h(this.el).before(i).css({
          "border-color": "transparent",
          "background-color": "transparent"
        }), h(this.el.previousElementSibling));
        this.helpers.multi = r, h(this.el).attr("tabindex", -1), r.on("click", (c) => {
          this.focus(c);
        }), r.find("input:not(.file-input)").on("click", (c) => {
          this.click(c);
        }).on("focus", (c) => {
          this.focus(c);
        }).on("blur", (c) => {
          this.blur(c);
        }).on("keydown", (c) => {
          this.keyDown(c);
        }).on("keyup", (c) => {
          this.keyUp(c);
        }), this.type === "file" && r.find("input.file-input").off(".drag").on("click.drag", (c) => {
          c.stopPropagation(), h(this.el).prop("readOnly") || h(this.el).prop("disabled") || this.focus(c);
        }).on("dragenter.drag", (c) => {
          h(this.el).prop("readOnly") || h(this.el).prop("disabled") || r.addClass("w2ui-file-dragover");
        }).on("dragleave.drag", (c) => {
          h(this.el).prop("readOnly") || h(this.el).prop("disabled") || r.removeClass("w2ui-file-dragover");
        }).on("drop.drag", (c) => {
          h(this.el).prop("readOnly") || h(this.el).prop("disabled") || (r.removeClass("w2ui-file-dragover"), Array.from(c.dataTransfer.files).forEach((d) => {
            this.addFile(d);
          }), this.focus(c), c.preventDefault(), c.stopPropagation());
        }).on("dragover.drag", (c) => {
          c.preventDefault(), c.stopPropagation();
        }).on("change.drag", (c) => {
          c.target.files !== void 0 && Array.from(c.target.files).forEach((d) => {
            this.addFile(d);
          }), this.focus(c);
        }), this.refresh();
      }
    }
    addFile(e) {
      var t = this.options, s = this.selected;
      let n = {
        name: e.name,
        type: e.type,
        modified: e.lastModifiedDate,
        size: e.size,
        content: null,
        file: e
      }, i = 0, o = 0, a = [], r = (Array.isArray(s) && s.forEach((c) => {
        c.name == e.name && c.size == e.size && a.push(y.lang('The file "${name}" (${size}) is already added.', {
          name: e.name,
          size: y.formatSize(e.size)
        })), i += c.size, o++;
      }), t.maxFileSize !== 0 && n.size > t.maxFileSize && a.push(y.lang("Maximum file size is ${size}", {
        size: y.formatSize(t.maxFileSize)
      })), t.maxSize !== 0 && i + n.size > t.maxSize && a.push(y.lang("Maximum total size is ${size}", {
        size: y.formatSize(t.maxSize)
      })), t.max !== 0 && o >= t.max && a.push(y.lang("Maximum number of files is ${count}", {
        count: t.max
      })), this.trigger("add", {
        target: this.el,
        file: n,
        total: o,
        totalSize: i,
        errors: a
      }));
      if (r.isCancelled !== true) if (t.silent !== true && 0 < a.length) ct.show({
        anchor: this.el,
        html: "Errors: " + a.join("<br>")
      }), console.log("ERRORS (while adding files): ", a);
      else if (s.push(n), typeof FileReader < "u" && t.readContent === true) {
        s = new FileReader();
        let c = this;
        s.onload = function(p) {
          var p = p.target.result, f = p.indexOf(",");
          n.content = p.substr(f + 1), c.refresh(), h(c.el).trigger("input").trigger("change"), r.finish();
        }, s.readAsDataURL(e);
      } else this.refresh(), h(this.el).trigger("input").trigger("change"), r.finish();
    }
    moveCaret2end() {
      setTimeout(() => {
        this.el.setSelectionRange(this.el.value.length, this.el.value.length);
      }, 0);
    }
  }
  let Do, Va, Li, Ba, pl, Vs, fl, _c, rn, Wn, Zn, Lo, kc, _o, Nn, Ha, Xa, Qs, Ya, ja, ml, Cc, Kn, Ua, nn;
  Do = globalThis;
  Va = (l) => l;
  Li = Do.trustedTypes;
  Ba = Li ? Li.createPolicy("lit-html", {
    createHTML: (l) => l
  }) : void 0;
  pl = "$lit$";
  Vs = `lit$${Math.random().toFixed(9).slice(2)}$`;
  fl = "?" + Vs;
  _c = `<${fl}>`;
  rn = document;
  Wn = () => rn.createComment("");
  Zn = (l) => l === null || typeof l != "object" && typeof l != "function";
  Lo = Array.isArray;
  kc = (l) => Lo(l) || typeof (l == null ? void 0 : l[Symbol.iterator]) == "function";
  _o = `[ 	
\f\r]`;
  Nn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  Ha = /-->/g;
  Xa = />/g;
  Qs = RegExp(`>|${_o}(?:([^\\s"'>=/]+)(${_o}*=${_o}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  Ya = /'/g;
  ja = /"/g;
  ml = /^(?:script|style|textarea|title)$/i;
  Cc = (l) => (e, ...t) => ({
    _$litType$: l,
    strings: e,
    values: t
  });
  Ii = Cc(1);
  Kn = Symbol.for("lit-noChange");
  Ut = Symbol.for("lit-nothing");
  Ua = /* @__PURE__ */ new WeakMap();
  nn = rn.createTreeWalker(rn, 129);
  function gl(l, e) {
    if (!Lo(l) || !l.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return Ba !== void 0 ? Ba.createHTML(e) : e;
  }
  const Sc = (l, e) => {
    const t = l.length - 1, s = [];
    let n, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = Nn;
    for (let a = 0; a < t; a++) {
      const r = l[a];
      let c, d, p = -1, f = 0;
      for (; f < r.length && (o.lastIndex = f, d = o.exec(r), d !== null); ) f = o.lastIndex, o === Nn ? d[1] === "!--" ? o = Ha : d[1] !== void 0 ? o = Xa : d[2] !== void 0 ? (ml.test(d[2]) && (n = RegExp("</" + d[2], "g")), o = Qs) : d[3] !== void 0 && (o = Qs) : o === Qs ? d[0] === ">" ? (o = n ?? Nn, p = -1) : d[1] === void 0 ? p = -2 : (p = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? Qs : d[3] === '"' ? ja : Ya) : o === ja || o === Ya ? o = Qs : o === Ha || o === Xa ? o = Nn : (o = Qs, n = void 0);
      const x = o === Qs && l[a + 1].startsWith("/>") ? " " : "";
      i += o === Nn ? r + _c : p >= 0 ? (s.push(c), r.slice(0, p) + pl + r.slice(p) + Vs + x) : r + Vs + (p === -2 ? a : x);
    }
    return [
      gl(l, i + (l[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")),
      s
    ];
  };
  class Gn {
    constructor({ strings: e, _$litType$: t }, s) {
      let n;
      this.parts = [];
      let i = 0, o = 0;
      const a = e.length - 1, r = this.parts, [c, d] = Sc(e, t);
      if (this.el = Gn.createElement(c, s), nn.currentNode = this.el.content, t === 2 || t === 3) {
        const p = this.el.content.firstChild;
        p.replaceWith(...p.childNodes);
      }
      for (; (n = nn.nextNode()) !== null && r.length < a; ) {
        if (n.nodeType === 1) {
          if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(pl)) {
            const f = d[o++], x = n.getAttribute(p).split(Vs), b = /([.?@])?(.*)/.exec(f);
            r.push({
              type: 1,
              index: i,
              name: b[2],
              strings: x,
              ctor: b[1] === "." ? $c : b[1] === "?" ? Ec : b[1] === "@" ? Ac : Xi
            }), n.removeAttribute(p);
          } else p.startsWith(Vs) && (r.push({
            type: 6,
            index: i
          }), n.removeAttribute(p));
          if (ml.test(n.tagName)) {
            const p = n.textContent.split(Vs), f = p.length - 1;
            if (f > 0) {
              n.textContent = Li ? Li.emptyScript : "";
              for (let x = 0; x < f; x++) n.append(p[x], Wn()), nn.nextNode(), r.push({
                type: 2,
                index: ++i
              });
              n.append(p[f], Wn());
            }
          }
        } else if (n.nodeType === 8) if (n.data === fl) r.push({
          type: 2,
          index: i
        });
        else {
          let p = -1;
          for (; (p = n.data.indexOf(Vs, p + 1)) !== -1; ) r.push({
            type: 7,
            index: i
          }), p += Vs.length - 1;
        }
        i++;
      }
    }
    static createElement(e, t) {
      const s = rn.createElement("template");
      return s.innerHTML = e, s;
    }
  }
  function kn(l, e, t = l, s) {
    var _a2, _b;
    if (e === Kn) return e;
    let n = s !== void 0 ? (_a2 = t._$Co) == null ? void 0 : _a2[s] : t._$Cl;
    const i = Zn(e) ? void 0 : e._$litDirective$;
    return (n == null ? void 0 : n.constructor) !== i && ((_b = n == null ? void 0 : n._$AO) == null ? void 0 : _b.call(n, false), i === void 0 ? n = void 0 : (n = new i(l), n._$AT(l, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = n : t._$Cl = n), n !== void 0 && (e = kn(l, n._$AS(l, e.values), n, s)), e;
  }
  class Mc {
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
      const { el: { content: t }, parts: s } = this._$AD, n = ((e == null ? void 0 : e.creationScope) ?? rn).importNode(t, true);
      nn.currentNode = n;
      let i = nn.nextNode(), o = 0, a = 0, r = s[0];
      for (; r !== void 0; ) {
        if (o === r.index) {
          let c;
          r.type === 2 ? c = new Jn(i, i.nextSibling, this, e) : r.type === 1 ? c = new r.ctor(i, r.name, r.strings, this, e) : r.type === 6 && (c = new Tc(i, this, e)), this._$AV.push(c), r = s[++a];
        }
        o !== (r == null ? void 0 : r.index) && (i = nn.nextNode(), o++);
      }
      return nn.currentNode = rn, n;
    }
    p(e) {
      let t = 0;
      for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
    }
  }
  class Jn {
    get _$AU() {
      var _a2;
      return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
    }
    constructor(e, t, s, n) {
      this.type = 2, this._$AH = Ut, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? true;
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
      e = kn(this, e, t), Zn(e) ? e === Ut || e == null || e === "" ? (this._$AH !== Ut && this._$AR(), this._$AH = Ut) : e !== this._$AH && e !== Kn && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : kc(e) ? this.k(e) : this._(e);
    }
    O(e) {
      return this._$AA.parentNode.insertBefore(e, this._$AB);
    }
    T(e) {
      this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
    }
    _(e) {
      this._$AH !== Ut && Zn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(rn.createTextNode(e)), this._$AH = e;
    }
    $(e) {
      var _a2;
      const { values: t, _$litType$: s } = e, n = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Gn.createElement(gl(s.h, s.h[0]), this.options)), s);
      if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === n) this._$AH.p(t);
      else {
        const i = new Mc(n, this), o = i.u(this.options);
        i.p(t), this.T(o), this._$AH = i;
      }
    }
    _$AC(e) {
      let t = Ua.get(e.strings);
      return t === void 0 && Ua.set(e.strings, t = new Gn(e)), t;
    }
    k(e) {
      Lo(this._$AH) || (this._$AH = [], this._$AR());
      const t = this._$AH;
      let s, n = 0;
      for (const i of e) n === t.length ? t.push(s = new Jn(this.O(Wn()), this.O(Wn()), this, this.options)) : s = t[n], s._$AI(i), n++;
      n < t.length && (this._$AR(s && s._$AB.nextSibling, n), t.length = n);
    }
    _$AR(e = this._$AA.nextSibling, t) {
      var _a2;
      for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, t); e !== this._$AB; ) {
        const s = Va(e).nextSibling;
        Va(e).remove(), e = s;
      }
    }
    setConnected(e) {
      var _a2;
      this._$AM === void 0 && (this._$Cv = e, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, e));
    }
  }
  class Xi {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(e, t, s, n, i) {
      this.type = 1, this._$AH = Ut, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = i, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = Ut;
    }
    _$AI(e, t = this, s, n) {
      const i = this.strings;
      let o = false;
      if (i === void 0) e = kn(this, e, t, 0), o = !Zn(e) || e !== this._$AH && e !== Kn, o && (this._$AH = e);
      else {
        const a = e;
        let r, c;
        for (e = i[0], r = 0; r < i.length - 1; r++) c = kn(this, a[s + r], t, r), c === Kn && (c = this._$AH[r]), o || (o = !Zn(c) || c !== this._$AH[r]), c === Ut ? e = Ut : e !== Ut && (e += (c ?? "") + i[r + 1]), this._$AH[r] = c;
      }
      o && !n && this.j(e);
    }
    j(e) {
      e === Ut ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
    }
  }
  class $c extends Xi {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(e) {
      this.element[this.name] = e === Ut ? void 0 : e;
    }
  }
  class Ec extends Xi {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(e) {
      this.element.toggleAttribute(this.name, !!e && e !== Ut);
    }
  }
  class Ac extends Xi {
    constructor(e, t, s, n, i) {
      super(e, t, s, n, i), this.type = 5;
    }
    _$AI(e, t = this) {
      if ((e = kn(this, e, t, 0) ?? Ut) === Kn) return;
      const s = this._$AH, n = e === Ut && s !== Ut || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, i = e !== Ut && (s === Ut || n);
      n && this.element.removeEventListener(this.name, this, s), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
    }
    handleEvent(e) {
      var _a2;
      typeof this._$AH == "function" ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, e) : this._$AH.handleEvent(e);
    }
  }
  class Tc {
    constructor(e, t, s) {
      this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(e) {
      kn(this, e);
    }
  }
  const zc = Do.litHtmlPolyfillSupport;
  zc == null ? void 0 : zc(Gn, Jn), (Do.litHtmlVersions ?? (Do.litHtmlVersions = [])).push("3.3.2");
  Ic = (l, e, t) => {
    const s = e;
    let n = s._$litPart$;
    return n === void 0 && (s._$litPart$ = n = new Jn(e.insertBefore(Wn(), null), null, void 0, {})), n._$AI(l), n;
  };
  kd = function({ buttons: l, clickedButton: e, author: t, sourceCode: s }) {
    const n = document.createElement("div");
    function i() {
      return dr() === "dark" ? "\u2600" : "\u263E";
    }
    const o = Ii`
    <div class="buttons-container">
      <button class="btn btn-icon" @click=${c}>
        ${Fc()}
      </button>
      ${l == null ? void 0 : l.map((d) => Ii`<button class="btn btn-text" @click=${a}>
            ${d}
          </button>`)}
      <button class="btn btn-text btn-theme" @click=${r} title="Toggle light/dark theme">
        ${i()}
      </button>
    </div>

    <div id="dropdown-menu" style="display: none;">
      <a
        href="${s || "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal"}"
        class="dropdown-link"
        >Hekatan Struct Lineal — Source Code</a
      >
      ${t ? Ii`<a href="${t}" class="dropdown-link">Contacto · Jorge Burbano (LinkedIn)</a>` : ""}
      <a href="https://github.com/madil4/awatif/tree/v2.0.0" class="dropdown-link"
        >Based on awatif v2.0.0</a
      >
    </div>
  `;
    n.id = "toolbar", Ic(o, n), qn((d) => {
      const p = n.querySelector(".btn-theme");
      p && (p.textContent = d === "dark" ? "\u2600" : "\u263E");
    });
    function a(d) {
      const p = d.target;
      e.val = "", setTimeout(() => e.val = p.innerText);
    }
    function r() {
      cr();
    }
    function c(d) {
      const p = document.getElementById("dropdown-menu");
      p.style.display = p.style.display === "block" ? "none" : "block";
    }
    return n;
  };
  function Fc() {
    return Ii`<img src="${"/hekatan-struct-lineal/"}img/hekatan-lockup.png" alt="Hekatan Struct"
    style="height:28px;width:auto;border-radius:6px;display:block;">`;
  }
  const Pc = {
    id: "ollama",
    name: "\u{1F999} Ollama (local, gratis)",
    supportsVision: true,
    models: [
      {
        id: "qwen2.5-coder:7b",
        name: "Qwen 2.5 Coder 7B (c\xF3digo)",
        vision: false
      },
      {
        id: "llama3.2-vision:11b",
        name: "Llama 3.2 Vision 11B",
        vision: true
      },
      {
        id: "llava:7b",
        name: "LLaVA 7B (vision)",
        vision: true
      },
      {
        id: "qwen2.5:7b",
        name: "Qwen 2.5 7B",
        vision: false
      },
      {
        id: "llama3.1:8b",
        name: "Llama 3.1 8B",
        vision: false
      }
    ],
    defaultModel: "qwen2.5-coder:7b",
    requiresKey: false,
    requiresLocal: true,
    async send({ msg: l, system: e, model: t }) {
      var _a2, _b;
      const s = {
        role: "user",
        content: l.text
      };
      ((_a2 = l.images) == null ? void 0 : _a2.length) && (s.images = l.images.map((o) => o.base64));
      let n;
      try {
        n = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: t,
            messages: [
              {
                role: "system",
                content: e
              },
              s
            ],
            stream: false
          })
        });
      } catch {
        throw new Error(`Ollama no est\xE1 corriendo en localhost:11434.

Para usar Ollama:
1. Descargalo de ollama.com/download
2. Instal\xE1 un modelo: ollama pull ` + t + `
3. Verific\xE1 que est\xE9 activo (Ollama corre como servicio en background)

O cambi\xE1 a otro provider (Gemini/Groq/OpenRouter) que solo requiere API key.`);
      }
      if (!n.ok) {
        const o = await n.text();
        throw n.status === 404 ? new Error(`Modelo "${t}" no instalado. Ejecut\xE1: ollama pull ${t}`) : new Error(`Ollama error ${n.status}: ${o}`);
      }
      return ((_b = (await n.json()).message) == null ? void 0 : _b.content) ?? "";
    }
  };
  Cd = async function() {
    try {
      const l = new AbortController(), e = setTimeout(() => l.abort(), 1500), t = await fetch("http://localhost:11434/api/tags", {
        signal: l.signal
      }).catch(() => null);
      return clearTimeout(e), !t || !t.ok ? [] : ((await t.json()).models ?? []).map((n) => n.name);
    } catch {
      return [];
    }
  };
  let Si = null;
  Sd = function() {
    if (Si) return Si;
    const l = typeof location < "u" ? location.hostname : "";
    return Si = l === "localhost" || l === "127.0.0.1" || l === "" || location.protocol === "file:" ? Rc() : Promise.resolve(false), Si;
  };
  async function Rc() {
    try {
      const l = new AbortController(), e = setTimeout(() => l.abort(), 1e3), t = await fetch("http://localhost:11434/api/tags", {
        signal: l.signal
      }).catch(() => null);
      return clearTimeout(e), !!t && t.ok;
    } catch {
      return false;
    }
  }
  let Dc, Lc, Nc;
  Dc = {
    id: "gemini",
    name: "\u2728 Gemini Flash (free tier)",
    supportsVision: true,
    models: [
      {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash (m\xE1s nuevo)",
        vision: true
      },
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash (estable)",
        vision: true
      },
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro (mejor calidad)",
        vision: true
      }
    ],
    defaultModel: "gemini-2.0-flash-exp",
    requiresKey: true,
    requiresLocal: false,
    async send({ msg: l, system: e, apiKey: t, model: s }) {
      var _a2, _b, _c2, _d2, _e;
      const n = [
        {
          text: l.text
        }
      ];
      for (const a of l.images ?? []) n.push({
        inline_data: {
          mime_type: a.mimeType,
          data: a.base64
        }
      });
      const i = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${s}:generateContent?key=${t}`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: e
              }
            ]
          },
          contents: [
            {
              role: "user",
              parts: n
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096
          }
        })
      });
      if (!i.ok) throw new Error(`Gemini error ${i.status}: ${await i.text()}`);
      return ((_e = (_d2 = (_c2 = (_b = (_a2 = (await i.json()).candidates) == null ? void 0 : _a2[0]) == null ? void 0 : _b.content) == null ? void 0 : _c2.parts) == null ? void 0 : _d2[0]) == null ? void 0 : _e.text) ?? "";
    }
  };
  Lc = {
    id: "groq",
    name: "\u26A1 Groq (r\xE1pido, free)",
    supportsVision: true,
    models: [
      {
        id: "llama-3.3-70b-versatile",
        name: "Llama 3.3 70B (m\xE1s capaz)",
        vision: false
      },
      {
        id: "llama-3.2-90b-vision-preview",
        name: "Llama 3.2 90B Vision",
        vision: true
      },
      {
        id: "llama-3.1-70b-versatile",
        name: "Llama 3.1 70B",
        vision: false
      },
      {
        id: "mixtral-8x7b-32768",
        name: "Mixtral 8x7B",
        vision: false
      }
    ],
    defaultModel: "llama-3.3-70b-versatile",
    requiresKey: true,
    requiresLocal: false,
    async send({ msg: l, system: e, apiKey: t, model: s }) {
      var _a2, _b, _c2, _d2;
      const n = [
        {
          type: "text",
          text: l.text
        }
      ];
      for (const a of l.images ?? []) n.push({
        type: "image_url",
        image_url: {
          url: `data:${a.mimeType};base64,${a.base64}`
        }
      });
      const i = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${t}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: s,
          messages: [
            {
              role: "system",
              content: e
            },
            {
              role: "user",
              content: ((_a2 = l.images) == null ? void 0 : _a2.length) ? n : l.text
            }
          ],
          temperature: 0.2,
          max_tokens: 4096
        })
      });
      if (!i.ok) throw new Error(`Groq error ${i.status}: ${await i.text()}`);
      return ((_d2 = (_c2 = (_b = (await i.json()).choices) == null ? void 0 : _b[0]) == null ? void 0 : _c2.message) == null ? void 0 : _d2.content) ?? "";
    }
  };
  Nc = {
    id: "openrouter",
    name: "\u{1F310} OpenRouter (modelos free)",
    supportsVision: true,
    models: [
      {
        id: "deepseek/deepseek-chat-v3:free",
        name: "DeepSeek V3 free (excelente c\xF3digo)",
        vision: false
      },
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "Llama 3.3 70B free",
        vision: false
      },
      {
        id: "meta-llama/llama-3.2-90b-vision-instruct:free",
        name: "Llama 3.2 90B Vision free",
        vision: true
      },
      {
        id: "google/gemini-2.0-flash-exp:free",
        name: "Gemini 2.0 Flash free",
        vision: true
      },
      {
        id: "qwen/qwen-2.5-coder-32b-instruct:free",
        name: "Qwen 2.5 Coder 32B free",
        vision: false
      }
    ],
    defaultModel: "deepseek/deepseek-chat-v3:free",
    requiresKey: true,
    requiresLocal: false,
    async send({ msg: l, system: e, apiKey: t, model: s }) {
      var _a2, _b, _c2, _d2;
      const n = [
        {
          type: "text",
          text: l.text
        }
      ];
      for (const a of l.images ?? []) n.push({
        type: "image_url",
        image_url: {
          url: `data:${a.mimeType};base64,${a.base64}`
        }
      });
      const i = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${t}`,
          "content-type": "application/json",
          "HTTP-Referer": "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/",
          "X-Title": "Hekatan Struct Lineal"
        },
        body: JSON.stringify({
          model: s,
          messages: [
            {
              role: "system",
              content: e
            },
            {
              role: "user",
              content: ((_a2 = l.images) == null ? void 0 : _a2.length) ? n : l.text
            }
          ],
          temperature: 0.2,
          max_tokens: 4096
        })
      });
      if (!i.ok) throw new Error(`OpenRouter error ${i.status}: ${await i.text()}`);
      return ((_d2 = (_c2 = (_b = (await i.json()).choices) == null ? void 0 : _b[0]) == null ? void 0 : _c2.message) == null ? void 0 : _d2.content) ?? "";
    }
  };
  Oc = [
    Pc,
    Dc,
    Lc,
    Nc
  ];
  Md = function(l) {
    return Oc.find((e) => e.id === l) ?? null;
  };
  let bn;
  bn = "hekatan_ai_";
  Cs = {
    getKey(l) {
      return localStorage.getItem(`${bn}key_${l}`) ?? "";
    },
    setKey(l, e) {
      localStorage.setItem(`${bn}key_${l}`, e);
    },
    getProvider() {
      return localStorage.getItem(`${bn}provider`) ?? "ollama";
    },
    setProvider(l) {
      localStorage.setItem(`${bn}provider`, l);
    },
    getModel(l) {
      return localStorage.getItem(`${bn}model_${l}`) ?? "";
    },
    setModel(l, e) {
      localStorage.setItem(`${bn}model_${l}`, e);
    }
  };
  $d = function(l) {
    return new Promise((e, t) => {
      const s = new FileReader();
      s.onload = () => {
        const n = s.result, i = n.indexOf(",");
        e(i >= 0 ? n.slice(i + 1) : n);
      }, s.onerror = () => t(s.error), s.readAsDataURL(l);
    });
  };
  let Vc, Bc;
  Ed = `Eres un asistente experto en estructuras y FEM que ayuda al usuario a generar modelos
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
support 4  1 1 1 1 1 1`;
  Vc = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
  Bc = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
  let ns = null, Ss, Bn, qa = false;
  function Wa() {
    if (qa) return;
    qa = true;
    const l = document.createElement("link");
    l.rel = "stylesheet", l.href = Vc, document.head.appendChild(l);
    const e = document.createElement("script");
    e.src = Bc, e.onload = () => qc(), e.onerror = () => {
    }, document.head.appendChild(e);
  }
  const Hc = {
    alpha: "\u03B1",
    beta: "\u03B2",
    gamma: "\u03B3",
    delta: "\u03B4",
    epsilon: "\u03B5",
    zeta: "\u03B6",
    eta: "\u03B7",
    theta: "\u03B8",
    lambda: "\u03BB",
    mu: "\u03BC",
    nu: "\u03BD",
    xi: "\u03BE",
    pi: "\u03C0",
    rho: "\u03C1",
    sigma: "\u03C3",
    tau: "\u03C4",
    phi: "\u03C6",
    psi: "\u03C8",
    omega: "\u03C9",
    Delta: "\u0394",
    Sigma: "\u03A3",
    Omega: "\u03A9",
    Phi: "\u03A6",
    Gamma: "\u0393",
    Theta: "\u0398",
    approx: "\u2248",
    times: "\xD7",
    cdot: "\xB7",
    le: "\u2264",
    ge: "\u2265",
    ne: "\u2260",
    pm: "\xB1",
    to: "\u2192",
    rightarrow: "\u2192",
    infty: "\u221E",
    partial: "\u2202",
    int: "\u222B"
  }, yl = (l) => l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function Xc(l) {
    let e = l;
    return e = e.replace(/\\(?:text|mathrm|mathbf|operatorname)\s*\{([^{}]*)\}/g, "$1"), e = e.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '<span style="display:inline-block;vertical-align:-0.5em;text-align:center"><span style="display:block;border-bottom:1px solid currentColor;padding:0 3px">$1</span><span style="display:block;padding:0 3px">$2</span></span>'), e = e.replace(/\\sqrt\s*\{([^{}]*)\}/g, '\u221A<span style="border-top:1px solid currentColor">$1</span>'), e = e.replace(/\\left|\\right/g, ""), e = e.replace(/\\([A-Za-z]+)/g, (t, s) => Hc[s] ?? t.slice(1)), e = e.replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>").replace(/\^(\w)/g, "<sup>$1</sup>"), e = e.replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>").replace(/_(\w)/g, "<sub>$1</sub>"), e = e.replace(/[{}]/g, ""), e;
  }
  function wl(l, e) {
    const t = window.katex;
    if (t) try {
      return t.renderToString(l, {
        displayMode: e,
        throwOnError: false
      });
    } catch {
    }
    return Xc(yl(l));
  }
  function Yc(l) {
    return /\$[^$\n]+\$|\\\(|\\\[|\\frac|\\text\{|\\sqrt|^\s*#{1,3}\s|\*\*[^*]+\*\*/m.test(l);
  }
  function ko(l) {
    const e = [], t = l.replace(/\$\$([^$]+)\$\$|\$([^$\n]+)\$|\\\(([^)]+)\\\)/g, (n, i, o, a) => (e.push(wl((i ?? o ?? a).trim(), false)), "\0" + (e.length - 1) + "\0"));
    let s = yl(t);
    return s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"), s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>"), s = s.replace(/`([^`]+)`/g, '<code style="background:#eef2f7;padding:1px 4px;border-radius:3px">$1</code>'), s.replace(/\u0000(\d+)\u0000/g, (n, i) => e[+i]);
  }
  function Ao(l) {
    const e = [], t = l.split(`
`);
    let s = false;
    const n = () => {
      s && (e.push("</ul>"), s = false);
    };
    for (let i = 0; i < t.length; i++) {
      const a = t[i].trim(), r = a.match(/^\$\$?([^$]+)\$\$?$/) || a.match(/^\\\[([\s\S]+)\\\]$/);
      if (r) {
        n(), e.push('<div class="hk-eq">' + wl(r[1].trim(), true) + "</div>");
        continue;
      }
      if (!a) {
        n();
        continue;
      }
      const c = a.match(/^(#{1,4})\s+(.*)$/);
      if (c) {
        n();
        const d = Math.min(c[1].length + 1, 4);
        e.push(`<h${d}>${ko(c[2])}</h${d}>`);
        continue;
      }
      if (/^([-*•]|\d+[.)])\s+/.test(a)) {
        s || (e.push("<ul>"), s = true), e.push("<li>" + ko(a.replace(/^([-*•]|\d+[.)])\s+/, "")) + "</li>");
        continue;
      }
      if (/^(-{3,}|_{3,})$/.test(a)) {
        n(), e.push("<hr>");
        continue;
      }
      n(), e.push("<p>" + ko(a) + "</p>");
    }
    return n(), e.join(`
`);
  }
  const jc = `
#hk-hoja-lisp .hk-papel{background:#fbfaf7;color:#1a1a1a;padding:14px 18px;
  font:15px/1.6 Georgia,"Times New Roman",serif;overflow:auto;flex:1;min-height:0;}
#hk-hoja-lisp h2,#hk-hoja-lisp h3,#hk-hoja-lisp h4{color:#0f3d63;margin:14px 0 6px;
  font-family:system-ui,Segoe UI,sans-serif;}
#hk-hoja-lisp h2{font-size:18px;border-bottom:2px solid #d8cfc0;padding-bottom:3px;}
#hk-hoja-lisp h3{font-size:16px;} #hk-hoja-lisp h4{font-size:14px;}
#hk-hoja-lisp p{margin:6px 0;} #hk-hoja-lisp ul{margin:6px 0 6px 20px;padding:0;}
#hk-hoja-lisp li{margin:3px 0;}
#hk-hoja-lisp hr{border:none;border-top:1px solid #ddd5c6;margin:12px 0;}
#hk-hoja-lisp .hk-eq{margin:12px 0;text-align:center;font-size:17px;color:#0b2d4d;}
#hk-hoja-lisp .katex{font-size:1.02em;}
`;
  function To() {
    if (!ns) return;
    const l = document.getElementById("hk-agente-ia"), e = l && l.style.display !== "none" ? l.getBoundingClientRect() : null, t = ns.offsetWidth || 430;
    e && e.width > 0 ? (ns.style.left = Math.max(8, Math.round(e.left - t - 10)) + "px", ns.style.top = Math.round(e.top) + "px", ns.style.height = Math.round(e.height) + "px") : (ns.style.left = "auto", ns.style.right = "410px", ns.style.top = "auto", ns.style.bottom = "96px");
  }
  function Uc() {
    const l = document.createElement("style");
    l.textContent = jc, document.head.appendChild(l);
    const e = document.createElement("div");
    e.id = "hk-hoja-lisp", e.style.cssText = [
      "position:fixed",
      "left:auto",
      "right:410px",
      "bottom:96px",
      "width:430px",
      "height:540px",
      "max-height:calc(100vh - 150px)",
      "max-width:calc(100vw - 32px)",
      "z-index:8990",
      "display:flex",
      "flex-direction:column",
      "background:#fbfaf7",
      "border:1px solid #cbbfa8",
      "border-radius:10px",
      "box-shadow:0 12px 40px rgba(0,0,0,.45)",
      "overflow:hidden"
    ].join(";");
    const t = document.createElement("div");
    t.style.cssText = "display:flex;align-items:center;gap:6px;padding:7px 10px;background:#13314f;color:#e8eef5;font:600 13px system-ui,Segoe UI,sans-serif;cursor:move;flex-shrink:0;", Bn = document.createElement("span"), Bn.style.cssText = "flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;", Bn.textContent = "\u{1F4C4} Hoja \xB7 Hekatan LISP", t.appendChild(Bn);
    const s = document.createElement("button");
    s.textContent = "\u2197 Abrir", s.title = "Abrir la hoja en Hekatan LISP web, en una pesta\xF1a aparte", s.style.cssText = "background:#1e4468;border:1px solid #2f5f8d;border-radius:4px;color:#dbe7f3;cursor:pointer;font:11px system-ui,Segoe UI,sans-serif;padding:2px 7px;", s.onclick = () => {
      Un && window.open(Un, "_blank", "noopener");
    }, t.appendChild(s);
    const n = document.createElement("button");
    n.textContent = "\u{1F517} Enlace", n.title = "Copiar el enlace: la hoja viaja DENTRO del enlace, se comparte tal cual", n.style.cssText = "background:#1e4468;border:1px solid #2f5f8d;border-radius:4px;color:#dbe7f3;cursor:pointer;font:11px system-ui,Segoe UI,sans-serif;padding:2px 7px;", n.onclick = () => {
      var _a2;
      (_a2 = navigator.clipboard) == null ? void 0 : _a2.writeText(Un || Ni).catch(() => {
      });
      const c = n.textContent;
      n.textContent = "\u2713 Copiado", setTimeout(() => {
        n.textContent = c;
      }, 1800);
    }, t.appendChild(n);
    const i = document.createElement("button");
    i.textContent = "\u2715", i.title = "Cerrar la hoja", i.style.cssText = "background:none;border:none;color:#cbd5e1;cursor:pointer;font-size:14px;", i.onclick = () => {
      e.style.display = "none";
    }, t.appendChild(i), e.appendChild(t), Ss = document.createElement("div"), Ss.className = "hk-papel", e.appendChild(Ss), document.body.appendChild(e);
    let o = 0, a = 0, r = false;
    return t.addEventListener("mousedown", (c) => {
      if (c.target.tagName === "BUTTON") return;
      const d = e.getBoundingClientRect();
      o = c.clientX - d.left, a = c.clientY - d.top, r = true, c.preventDefault();
    }), window.addEventListener("mousemove", (c) => {
      r && (e.style.right = "auto", e.style.bottom = "auto", e.style.left = Math.max(0, c.clientX - o) + "px", e.style.top = Math.max(0, c.clientY - a) + "px");
    }), window.addEventListener("mouseup", () => {
      r = false;
    }), window.addEventListener("resize", To), e;
  }
  let Ni = "", Un = "";
  function Oi(l, e) {
    (!ns || !document.body.contains(ns)) && (ns = Uc()), ns.style.display = "flex", Bn.textContent = "\u{1F4C4} " + (l || "Hoja \xB7 Hekatan LISP"), Ni = e, To(), setTimeout(To, 60);
    const t = Kc(e);
    if (t) {
      Un = "", Gc(Ss, t).then((s) => {
        Un = s, s || (Ss.style.padding = "", Wa(), Ss.innerHTML = Ao(e));
      });
      return;
    }
    Wa(), Ss.style.padding = "", Ss.innerHTML = Ao(e), Ss.scrollTop = 0;
  }
  function qc() {
    ns && Ni && (Ss.innerHTML = Ao(Ni));
  }
  window.__hkHoja = Oi;
  const Wc = "https://giorgioburbanelli89.github.io/hekatan-lisp/";
  async function Zc(l) {
    const e = new Blob([
      l
    ]).stream().pipeThrough(new window.CompressionStream("deflate-raw")), t = new Uint8Array(await new Response(e).arrayBuffer());
    let s = "";
    for (const n of t) s += String.fromCharCode(n);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function Kc(l) {
    const e = l.match(/```(?:lisp|hekatan|hoja)?\s*\n([\s\S]*?)```/i);
    if (!e) return null;
    const t = e[1].trim();
    return /^\s*#|#dibujo|#graf|#:/m.test(t) ? t : null;
  }
  async function Gc(l, e) {
    l.innerHTML = '<p style="color:#5a6673;font:13px system-ui">Abriendo el motor de Hekatan LISP\u2026</p>';
    let t;
    try {
      t = Wc + "#h=" + await Zc(e) + "&solo=1&embed=1";
    } catch {
      return "";
    }
    const s = document.createElement("iframe");
    return s.src = t, s.style.cssText = "width:100%;height:100%;border:none;background:#fbfaf7;", s.setAttribute("loading", "eager"), l.innerHTML = "", l.style.padding = "0", l.appendChild(s), t;
  }
  window.__hkHoja = Oi;
  const Jc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.min.mjs", Qc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.worker.min.mjs", Fi = 6, xl = 1600, bl = 6e4;
  async function ed(l) {
    var _a2;
    const e = await createImageBitmap(l), t = Math.min(1, xl / Math.max(e.width, e.height)), s = Math.round(e.width * t), n = Math.round(e.height * t), i = document.createElement("canvas");
    i.width = s, i.height = n, i.getContext("2d").drawImage(e, 0, 0, s, n), (_a2 = e.close) == null ? void 0 : _a2.call(e);
    const a = /jpe?g/i.test(l.type) || l.size > 9e5;
    return i.toDataURL(a ? "image/jpeg" : "image/png", 0.85);
  }
  let On = null;
  async function td() {
    return On || (On = await import(Jc).then(async (m) => {
      await m.__tla;
      return m;
    }), On.GlobalWorkerOptions.workerSrc = Qc, On);
  }
  async function sd(l, e) {
    const s = await (await td()).getDocument({
      data: await l.arrayBuffer()
    }).promise, n = s.numPages;
    let i = "";
    for (let r = 1; r <= n; r++) {
      const p = (await (await s.getPage(r)).getTextContent()).items.map((f) => f.str).join(" ").replace(/\s+/g, " ").trim();
      if (p && (i += `

--- p\xE1gina ${r} ---
${p}`), i.length > bl) {
        i += `

(\u2026 recortado)`;
        break;
      }
    }
    if (i.replace(/\s/g, "").length > n * 40) return e(`${l.name}: ${n} p\xE1g., texto extra\xEDdo (${i.length} caracteres).`), [
      {
        nombre: l.name,
        tipo: "texto",
        dato: i.trim(),
        paginas: n
      }
    ];
    const o = Math.min(n, Fi);
    e(`${l.name}: escaneado (sin texto). Mando ${o} de ${n} p\xE1ginas como imagen.`);
    const a = [];
    for (let r = 1; r <= o; r++) {
      const c = await s.getPage(r), d = c.getViewport({
        scale: 1
      }), p = Math.min(2.2, xl / Math.max(d.width, d.height)), f = c.getViewport({
        scale: p
      }), x = document.createElement("canvas");
      x.width = Math.round(f.width), x.height = Math.round(f.height), await c.render({
        canvasContext: x.getContext("2d"),
        viewport: f
      }).promise, a.push({
        nombre: `${l.name} \xB7 p\xE1g. ${r}`,
        tipo: "imagen",
        dato: x.toDataURL("image/jpeg", 0.82)
      });
    }
    return a;
  }
  async function nd(l, e) {
    const t = [];
    for (const n of l) try {
      if (/^image\//.test(n.type)) t.push({
        nombre: n.name,
        tipo: "imagen",
        dato: await ed(n)
      }), e(`${n.name}: imagen lista (la lee el modelo).`);
      else if (/pdf$/i.test(n.type) || /\.pdf$/i.test(n.name)) t.push(...await sd(n, e));
      else {
        const i = (await n.text()).slice(0, bl);
        t.push({
          nombre: n.name,
          tipo: "texto",
          dato: i
        }), e(`${n.name}: texto (${i.length} caracteres).`);
      }
    } catch (i) {
      e(`${n.name}: no se pudo leer \u2014 ${(i == null ? void 0 : i.message) ?? i}`);
    }
    const s = t.filter((n) => n.tipo === "imagen");
    return s.length > Fi ? (e(`Solo mando las ${Fi} primeras im\xE1genes.`), [
      ...t.filter((n) => n.tipo === "texto"),
      ...s.slice(0, Fi)
    ]) : t;
  }
  function id(l, e) {
    if (!e.length) return {
      role: "user",
      content: l
    };
    const t = [], s = e.filter((i) => i.tipo === "texto");
    let n = l;
    for (const i of s) n += `

===== ${i.nombre} =====
${i.dato}`;
    t.push({
      type: "text",
      text: n
    });
    for (const i of e.filter((o) => o.tipo === "imagen")) t.push({
      type: "image_url",
      image_url: {
        url: i.dato
      }
    });
    return {
      role: "user",
      content: t
    };
  }
  function od() {
    return new Promise((l) => {
      const e = document.createElement("input");
      e.type = "file", e.multiple = true, e.accept = "image/*,.pdf,.txt,.csv,.md,.lisp,.heks,.e2k,.s2k,.f2k", e.style.display = "none", document.body.appendChild(e), e.onchange = () => {
        l(Array.from(e.files ?? [])), e.remove();
      }, window.addEventListener("focus", () => setTimeout(() => {
        var _a2;
        document.body.contains(e) && !((_a2 = e.files) == null ? void 0 : _a2.length) && (l([]), e.remove());
      }, 500), {
        once: true
      }), e.click();
    });
  }
  const dt = () => window, en = [
    {
      id: "ollama",
      nombre: "\u{1F999} Ollama (local)",
      url: "http://localhost:11434/v1/chat/completions",
      clave: false,
      modelos: [
        "qwen2.5:7b",
        "qwen2.5:3b",
        "llama3.1:8b",
        "qwen3:8b"
      ],
      pista: "Local y gratis. Instalar: ollama.com \u2192 ollama pull qwen2.5:7b"
    },
    {
      id: "gemini",
      nombre: "\u2728 Gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      clave: true,
      modelos: [
        "gemini-3.6-flash",
        "gemini-flash-latest",
        "gemini-flash-lite-latest"
      ],
      pista: "Clave gratis: aistudio.google.com/apikey"
    },
    {
      id: "groq",
      nombre: "\u26A1 Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      clave: true,
      modelos: [
        "llama-3.3-70b-versatile",
        "qwen/qwen3-32b"
      ],
      pista: "Clave gratis: console.groq.com/keys"
    },
    {
      id: "openrouter",
      nombre: "\u{1F310} OpenRouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      clave: true,
      modelos: [
        "deepseek/deepseek-chat-v3-0324:free",
        "qwen/qwen-2.5-72b-instruct:free"
      ],
      pista: "Clave: openrouter.ai/keys (sufijo :free = gratis)"
    }
  ], zo = [
    {
      name: "obtener_modelo",
      description: "Resumen del modelo abierto: plantilla, par\xE1metros, n\xFAmero de nudos, barras, c\xE1scaras, apoyos, cargas y dimensiones. \xDAsala al empezar si el usuario habla del modelo actual.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    },
    {
      name: "listar_plantillas",
      description: "Busca plantillas param\xE9tricas del programa (edificios, p\xF3rticos, galpones, zapatas, losas, muros\u2026). Devuelve id, nombre y categor\xEDa.",
      parameters: {
        type: "object",
        properties: {
          filtro: {
            type: "string",
            description: "palabra a buscar, p. ej. 'edificio', 'zapata', 'galpon'. Vac\xEDo = todas."
          }
        },
        required: []
      }
    },
    {
      name: "cargar_plantilla",
      description: "Abre una plantilla por su id y opcionalmente le pone par\xE1metros. Devuelve la lista de par\xE1metros de la plantilla con sus valores, para poder ajustarlos despu\xE9s.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id de la plantilla (de listar_plantillas)"
          },
          parametros: {
            type: "object",
            description: 'clave \u2192 valor num\xE9rico, p. ej. {"nFloors": 4}'
          }
        },
        required: [
          "id"
        ]
      }
    },
    {
      name: "cambiar_parametros",
      description: "Cambia par\xE1metros num\xE9ricos de la plantilla abierta y recalcula.",
      parameters: {
        type: "object",
        properties: {
          parametros: {
            type: "object",
            description: "clave \u2192 valor num\xE9rico"
          }
        },
        required: [
          "parametros"
        ]
      }
    },
    {
      name: "modelar_heks",
      description: "Construye un modelo a medida con comandos .heks (nudos, barras, c\xE1scaras, apoyos, cargas) y lo resuelve. Devuelve conteos, errores de sintaxis, flecha m\xE1xima y suma de reacciones.",
      parameters: {
        type: "object",
        properties: {
          script: {
            type: "string",
            description: "comandos .heks, uno por l\xEDnea; terminar con 'solve'"
          },
          modo: {
            type: "string",
            enum: [
              "nuevo",
              "agregar"
            ],
            description: "nuevo = reemplaza el modelo; agregar = a\xF1ade al modelo actual"
          }
        },
        required: [
          "script"
        ]
      }
    },
    {
      name: "resultados",
      description: "Resultados del an\xE1lisis est\xE1tico: desplazamientos m\xE1ximos (mm) con su nudo y suma de reacciones (kN). \xDAsala para comprobar el modelo.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    },
    {
      name: "analisis_modal",
      description: "Corre el an\xE1lisis modal y anima el modo 1. Devuelve periodos (s) y participaci\xF3n de masa UX, UY, RZ de los primeros modos.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    },
    {
      name: "vista",
      description: "Cambia la vista 3D: c\xE1mara, deformada y campo de colores de c\xE1scaras.",
      parameters: {
        type: "object",
        properties: {
          camara: {
            type: "string",
            enum: [
              "iso",
              "plan",
              "elevX",
              "elevY"
            ]
          },
          deformada: {
            type: "boolean"
          },
          campo_cascara: {
            type: "string",
            enum: [
              "none",
              "displacementZ",
              "bendingXX",
              "bendingYY",
              "membraneXX",
              "membraneYY",
              "vonMises"
            ]
          }
        },
        required: []
      }
    },
    {
      name: "deshacer",
      description: "Vuelve el modelo al estado anterior al \xFAltimo cambio hecho por el agente.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  ], ad = `Eres el agente de Hekatan Struct, un programa de an\xE1lisis estructural por elementos finitos.
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

C\xF3mo se escribe una EXPLICACI\xD3N (cuando piden explicar, comprobar, deducir o un dibujo):
NO se escribe en el chat: se escribe como HOJA DE HEKATAN LISP en un bloque de c\xF3digo marcado
\xABlisp\xBB, y el motor la resuelve y la dibuja en la ventana de la izquierda. Nada de LaTeX.

  # T\xEDtulo de la hoja
  #: Texto corrido, con **negrita**. Aqu\xED se dice de d\xF3nde sale cada cosa.
  ## 1 \xB7 Datos
  #: Los DATOS van en TABLA, en columnas \u2014 nunca uno por rengl\xF3n, que deja la hoja medio vac\xEDa:
  #| Dato | Valor | Dato | Valor |
  #|---|---:|---|---:|
  #| B | 1.50 m | P | 606 kN |
  #| L | 1.50 m | e_{x} | 0.15 m |
  #| h | 0.40 m | e_{y} | 0.30 m |
  ## 2 \xB7 El c\xE1lculo
  #: Primero en letras, que el motor la deja simb\xF3lica:
  sigma_max = P/A*(1 + 6*e_x/B)
  #: Y ahora con los n\xFAmeros y SUS UNIDADES:
  A = 1.5m*1.5m|m^2
  sigma_max = dec(606kN/2.25m^2*(1 + 6*0.15/1.5), 1)|kPa

UNIDADES \u2014 OBLIGATORIAS en TODA l\xEDnea que tenga un n\xFAmero. El motor las calcula de verdad.
  MAL:   Lx = 1.5          P = 606.2         s = sigma_max/ks      \u2192 sale \xAB\u2248 0.0\xBB y no dice nada
  BIEN:  L_x = 1.5m        P = 606.2kN       s = dec(754.3kPa/20000kN/m^3, 1)|mm   \u2192 \xAB37.7 mm\xBB
  \xB7 se pegan al n\xFAmero, sin espacio: 606kN, 1.5m, 20000kN/m^3, 240kgf/cm^2;
  \xB7 la BARRA dice en qu\xE9 unidad se quiere LEER: |kPa, |mm, |tonf/m2, |kgf/cm2;
  \xB7 sin la barra el resultado sale en la unidad base (metros) y un asiento de 37 mm
    se convierte en \xAB0.0\xBB: por eso la barra NO es opcional;
  \xB7 si las dimensiones no cuadran el motor avisa, as\xED que no hay que inventar factores.
DECIMALES: el motor es exacto y escribe 9/4 en vez de 2.25. Para leerlo en decimal: dec(expr, 2).
  Nunca metas un dec() dentro de otro dec(): deja de evaluar.
SUB\xCDNDICES: en la l\xEDnea de c\xE1lculo SIN llaves (e_x, N_q, sigma_max). En el texto \xAB#:\xBB y en las
  tablas CON llaves (e_{x}), que si no el guion bajo abre cursiva.
  En las tablas el exponente tambien con llaves: kN/m^{3}, kgf/cm^{2}.

Para DIBUJAR (croquis a escala, con cotas); coordenadas del problema en metros, Y hacia arriba:

  #dibujo("Zapata 1.5 x 1.5 m", ud = m, escala = 1:28, cotas = m, alto = 240)
  #  rect(0, 0, 1.5, 0.4, "gruesa")
  #  achurado(0, 0, 1.5, 0.4, "diagonal")
  #  rect(0.6, 0.4, 0.3, 0.9, "gruesa")
  #  flecha(0.75, 1.75, 0.75, 1.35, "rojo")
  #  texto(0.95, 1.6, "P = 606 kN", 2.6, "i")
  #  cota(0, -0.3, 1.5, -0.3, -0.12, "B = 1.50")
  #fin

Y para una GR\xC1FICA: #fplot(...). Dos o tres apartados bastan; la ventana es estrecha.
Usa los n\xFAmeros que devolvieron las herramientas, nunca inventados.

Si te falta un dato para contestar bien \u2014 una f\xF3rmula, una tabla de la norma, un plano, el
enunciado de un ejercicio \u2014 NO lo inventes ni te disculpes: P\xCDDELO. Di exactamente esto:
  \xABEso no lo s\xE9 de memoria. Adj\xFAntame la p\xE1gina con el bot\xF3n ' + chr(0x1F4CE) + ' de abajo: vale una FOTO o una
   captura (la leo yo), un PDF (le saco el texto) o un .txt. Dime tambi\xE9n qu\xE9 parte miro.\xBB
Cuando llegue, trabaja SOLO con lo que ponga ah\xED, y cita de d\xF3nde sale cada n\xFAmero.

Si piden COMPROBAR algo a mano, la hoja es adem\xE1s la CALCULADORA: dilo y explica c\xF3mo se usa.
En la ventana de la izquierda, sobre el papel, est\xE1 la barra del motor:
  \xB7 \xAB\u270E Volver al editor\xBB abre el c\xF3digo: se cambia un n\xFAmero y se ve el resultado nuevo.
  \xB7 \xAB\u25B6 Ejecutar\xBB (o AutoRun) vuelve a calcular.
  \xB7 \xAB\u{1F517} Enlace\xBB, arriba, copia la hoja ENTERA dentro del enlace: se pega en WhatsApp o Telegram y
    el que lo abra ve la misma hoja, sin instalar nada. \xAB\u2197 Abrir\xBB la saca a una pesta\xF1a aparte.
Una hoja de comprobaci\xF3n lleva los datos arriba y las f\xF3rmulas debajo: as\xED basta tocar un dato.

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
solve`, Vi = (l) => new Promise((e) => setTimeout(e, l)), Bi = () => new Promise((l) => requestAnimationFrame(() => requestAnimationFrame(l))), Mi = [];
  function Co() {
    var _a2, _b, _c2, _d2;
    return {
      ex: ((_b = (_a2 = dt()).__hekatanExample) == null ? void 0 : _b.call(_a2)) ?? null,
      params: {
        ...((_d2 = (_c2 = dt()).__hekatanGetParams) == null ? void 0 : _d2.call(_c2)) ?? {}
      },
      script: dt().__hekatanCliScript ?? ""
    };
  }
  async function So(l) {
    var _a2, _b, _c2, _d2, _e, _f;
    ((_b = (_a2 = dt()).__hekatanExample) == null ? void 0 : _b.call(_a2)) === l ? (_d2 = (_c2 = dt()).__hekatanRebuild) == null ? void 0 : _d2.call(_c2) : (_f = (_e = dt()).__hekatanLoadExampleById) == null ? void 0 : _f.call(_e, l), await Bi(), await Vi(150);
  }
  async function Za(l) {
    var _a2, _b, _c2, _d2;
    if (!l || !Object.keys(l).length) return [];
    const e = (_b = (_a2 = dt()).__hekatanParams) == null ? void 0 : _b.call(_a2);
    if (!e) return [
      "no hay plantilla abierta"
    ];
    const t = [];
    for (const [s, n] of Object.entries(l)) {
      const i = typeof n == "boolean" ? n ? 1 : 0 : Number(n);
      if (!(s in e)) {
        t.push(`par\xE1metro desconocido: ${s}`);
        continue;
      }
      if (!Number.isFinite(i)) {
        t.push(`${s}: valor no num\xE9rico`);
        continue;
      }
      e[s] = i;
    }
    return (_d2 = (_c2 = dt()).__hekatanRebuild) == null ? void 0 : _d2.call(_c2), await Bi(), await Vi(150), t;
  }
  function $i() {
    var _a2, _b, _c2, _d2, _e;
    const l = dt().__hekatanStates;
    if (!l) return null;
    const e = ((_a2 = l.nodes) == null ? void 0 : _a2.val) ?? [], t = ((_b = l.elements) == null ? void 0 : _b.val) ?? [], s = ((_c2 = l.nodeInputs) == null ? void 0 : _c2.val) ?? {}, n = [
      1 / 0,
      1 / 0,
      1 / 0,
      -1 / 0,
      -1 / 0,
      -1 / 0
    ];
    for (const o of e) for (let a = 0; a < 3; a++) n[a] = Math.min(n[a], o[a]), n[a + 3] = Math.max(n[a + 3], o[a]);
    const i = (o) => +o.toFixed(1);
    return {
      nudos: e.length,
      barras: t.filter((o) => o.length === 2).length,
      cascaras: t.filter((o) => o.length >= 3).length,
      apoyos: ((_d2 = s.supports) == null ? void 0 : _d2.size) ?? 0,
      cargas_nodales: ((_e = s.loads) == null ? void 0 : _e.size) ?? 0,
      dimensiones_m: e.length ? {
        x: i(n[3] - n[0]),
        y: i(n[4] - n[1]),
        z: i(n[5] - n[2])
      } : null
    };
  }
  function ld() {
    var _a2, _b, _c2;
    const l = (_b = (_a2 = dt().__hekatanStates) == null ? void 0 : _a2.deformOutputs) == null ? void 0 : _b.val;
    if (!((_c2 = l == null ? void 0 : l.deformations) == null ? void 0 : _c2.size)) return {
      error: "no hay resultados: el modelo no se resolvi\xF3 (\xBFfalta solve, apoyos o cargas?)"
    };
    const e = [
      0,
      0,
      0
    ], t = [
      0,
      0,
      0
    ];
    for (const [i, o] of l.deformations) for (let a = 0; a < 3; a++) Math.abs(o[a]) > Math.abs(e[a]) && (e[a] = o[a], t[a] = i);
    const s = [
      0,
      0,
      0
    ];
    for (const [, i] of l.reactions ?? /* @__PURE__ */ new Map()) for (let o = 0; o < 3; o++) s[o] += i[o] || 0;
    const n = (i) => +(i * 1e3).toFixed(3);
    return {
      ux_max_mm: n(e[0]),
      indice_nudo_ux: t[0],
      uy_max_mm: n(e[1]),
      indice_nudo_uy: t[1],
      uz_max_mm: n(e[2]),
      indice_nudo_uz: t[2],
      suma_reacciones_kN: {
        Fx: +s[0].toFixed(2),
        Fy: +s[1].toFixed(2),
        Fz: +s[2].toFixed(2)
      }
    };
  }
  function Ka() {
    var _a2, _b, _c2, _d2;
    const l = ((_b = (_a2 = dt()).__hekatanParamDefs) == null ? void 0 : _b.call(_a2)) ?? {}, e = ((_d2 = (_c2 = dt()).__hekatanGetParams) == null ? void 0 : _d2.call(_c2)) ?? {}, t = {};
    for (const [s, n] of Object.entries(e)) {
      const i = l[s], o = (i == null ? void 0 : i.label) ? String(i.label).slice(0, 28) : "", a = (i == null ? void 0 : i.options) ? Object.entries(i.options) : [], r = a.length && a.length <= 4 ? "; " + a.map(([c, d]) => `${d}=${String(c).slice(0, 14)}`).join(", ") : "";
      t[s] = o || r ? `${n} (${o}${r})` : String(n);
    }
    return t;
  }
  async function No(l, e) {
    var _a2, _b, _c2, _d2, _e, _f, _g, _h, _i2, _j, _k, _l2, _m, _n2, _o2, _p, _q, _r2, _s, _t, _u, _v;
    switch (l) {
      case "obtener_modelo": {
        const t = (_b = (_a2 = dt()).__hekatanExample) == null ? void 0 : _b.call(_a2), s = {
          plantilla: t,
          ...$i()
        };
        return t === "cli-modeler" ? s.script = String(dt().__hekatanCliScript ?? "").slice(0, 3e3) : t && (s.parametros = Ka()), s;
      }
      case "listar_plantillas": {
        const t = dt().__hekatanExamples ?? [], s = String((e == null ? void 0 : e.filtro) ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""), n = t.filter((i) => !s || `${i.id} ${i.name} ${i.category}`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(s));
        return {
          total: n.length,
          plantillas: n.slice(0, 30).map((i) => `${i.id} \u2014 ${i.name} [${i.category}]`)
        };
      }
      case "cargar_plantilla": {
        const t = String((e == null ? void 0 : e.id) ?? "");
        if (!(dt().__hekatanExamples ?? []).some((n) => n.id === t)) return {
          error: `no existe la plantilla '${t}'. Usa listar_plantillas.`
        };
        Mi.push(Co()), await So(t);
        const s = await Za(e == null ? void 0 : e.parametros);
        return {
          ok: true,
          plantilla: t,
          ...$i(),
          avisos: s,
          parametros: Ka(),
          siguiente: s.length ? "Hay claves que no existen. Llama cambiar_parametros usando SOLO claves de 'parametros'." : "Ajusta con cambiar_parametros si hace falta y luego llama resultados."
        };
      }
      case "cambiar_parametros": {
        Mi.push(Co());
        const t = await Za(e == null ? void 0 : e.parametros);
        return {
          ok: t.length === 0,
          avisos: t,
          ...$i(),
          ...t.length ? {
            claves_validas: Object.keys(((_d2 = (_c2 = dt()).__hekatanGetParams) == null ? void 0 : _d2.call(_c2)) ?? {})
          } : {}
        };
      }
      case "modelar_heks": {
        let t = String((e == null ? void 0 : e.script) ?? "").replace(/^```[a-z]*\n?/i, "").replace(/\n?```\s*$/, "");
        if ((e == null ? void 0 : e.modo) === "agregar") {
          const i = (_f = (_e = dt()).__hekatanExample) == null ? void 0 : _f.call(_e);
          t = String(i === "cli-modeler" ? dt().__hekatanCliScript ?? "" : ((_h = (_g = dt()).__hekatanModeloAHeks) == null ? void 0 : _h.call(_g)) ?? "").replace(/^\s*solve\s*$/gim, "") + `
` + t;
        }
        /^\s*solve\s*$/im.test(t) || (t += `
solve`), Mi.push(Co()), dt().__hekatanCliStats = null, dt().__hekatanCliScript = t, await So("cli-modeler");
        for (let i = 0; i < 20 && !dt().__hekatanCliStats; i++) await Vi(100);
        const s = dt().__hekatanCliStats ?? {}, n = dt().__hekatanCliErrors ?? [];
        return {
          nudos: s.nodes,
          barras: s.frames,
          cascaras: s.shells,
          apoyos: s.supports,
          cargas: s.loads,
          resuelto: !!s.solved,
          uz_max_mm: s.maxUzMm,
          suma_Rz_kN: s.sumRz,
          errores: n.slice(0, 8)
        };
      }
      case "resultados":
        return ld();
      case "analisis_modal": {
        const t = (_j = (_i2 = dt()).__hekatanModalResults) == null ? void 0 : _j.call(_i2);
        if (typeof dt().__hekatanRunModalAnimate != "function") return {
          error: "esta plantilla no tiene an\xE1lisis modal"
        };
        dt().__hekatanRunModalAnimate();
        let s = null;
        for (let o = 0; o < 100; o++) {
          await Vi(150);
          const a = (_l2 = (_k = dt()).__hekatanModalResults) == null ? void 0 : _l2.call(_k);
          if (a && a !== t && ((_m = a.frequencies) == null ? void 0 : _m.length)) {
            s = a;
            break;
          }
        }
        if (!s) return {
          error: "el modal no devolvi\xF3 modos (\xBFmodelo sin masa o sin apoyos?)"
        };
        const n = Math.min(6, s.frequencies.length), i = [];
        for (let o = 0; o < n; o++) {
          const a = s.frequencies[o], r = ((_n2 = s.massParticipation) == null ? void 0 : _n2[o]) ?? [];
          i.push({
            modo: o + 1,
            T_s: +(1 / a).toFixed(4),
            UX: +((r[0] ?? 0) * 100).toFixed(1),
            UY: +((r[1] ?? 0) * 100).toFixed(1),
            RZ: +((r[5] ?? 0) * 100).toFixed(1)
          });
        }
        return {
          modos: i,
          nota: "UX/UY/RZ = % de masa participante"
        };
      }
      case "vista": {
        const t = (_p = (_o2 = dt()).__hekatanSettings) == null ? void 0 : _p.call(_o2);
        return (e == null ? void 0 : e.deformada) !== void 0 && (t == null ? void 0 : t.deformedShape) && (t.deformedShape.val = !!e.deformada), (e == null ? void 0 : e.campo_cascara) && (t == null ? void 0 : t.shellResults) && (t.shellResults.val = e.campo_cascara), (e == null ? void 0 : e.camara) && ((_r2 = (_q = dt()).__hekatanSetView) == null ? void 0 : _r2.call(_q, e.camara)), await Bi(), {
          ok: true
        };
      }
      case "deshacer": {
        const t = Mi.pop();
        if (!(t == null ? void 0 : t.ex)) return {
          error: "no hay nada que deshacer"
        };
        if (t.ex === "cli-modeler" && (dt().__hekatanCliScript = t.script), await So(t.ex), t.ex !== "cli-modeler") {
          const s = (_t = (_s = dt()).__hekatanParams) == null ? void 0 : _t.call(_s);
          s && (Object.assign(s, t.params), (_v = (_u = dt()).__hekatanRebuild) == null ? void 0 : _v.call(_u), await Bi());
        }
        return {
          ok: true,
          plantilla: t.ex,
          ...$i()
        };
      }
    }
    return {
      error: `herramienta desconocida: ${l}`
    };
  }
  const Ga = 14, Hn = [];
  let tn = [], Pi = () => {
  };
  const Ei = [
    2e3,
    5e3,
    12e3
  ], rd = /* @__PURE__ */ new Set([
    429,
    500,
    502,
    503,
    504
  ]);
  let Ja = "";
  async function cd(l, e, t, s) {
    const n = [
      e,
      ...l.modelos.filter((o) => o !== e)
    ];
    let i = null;
    for (let o = 0; o < n.length; o++) for (let a = 0; a <= Ei.length; a++) try {
      const r = await dd(l, n[o], t, s);
      if (n[o] !== Ja && (Ja = n[o], o > 0)) {
        os("paso", `El modelo estaba saturado; sigo con ${n[o]}.`), Cs.setModel(`agente_${l.id}`, n[o]);
        const c = document.getElementById("hk-agente-modelo");
        c && (c.value = n[o]);
      }
      return r;
    } catch (r) {
      if ((r == null ? void 0 : r.name) === "AbortError") throw r;
      i = r;
      const c = parseInt((String((r == null ? void 0 : r.message) ?? "").match(/\b(\d{3})\b/) ?? [])[1] ?? "0", 10);
      if (c === 404 && o < n.length - 1) break;
      if (!rd.has(c)) throw r;
      if (a === Ei.length) break;
      os("paso", `El modelo est\xE1 saturado (${c}). Reintento en ${Ei[a] / 1e3} s\u2026`), await new Promise((d, p) => {
        const f = setTimeout(d, Ei[a]);
        s.addEventListener("abort", () => {
          clearTimeout(f), p(new DOMException("", "AbortError"));
        }, {
          once: true
        });
      });
    }
    throw i ?? new Error("sin respuesta");
  }
  async function dd(l, e, t, s) {
    var _a2, _b, _c2;
    const n = {
      "content-type": "application/json"
    };
    l.clave && (n.Authorization = `Bearer ${t}`), l.id === "openrouter" && (n["HTTP-Referer"] = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/", n["X-Title"] = "Hekatan Struct");
    const i = l.id === "ollama", o = [
      {
        role: "system",
        content: ad
      },
      ...Hn
    ], a = i ? {
      model: e,
      stream: false,
      options: {
        temperature: 0.1,
        num_ctx: 16384
      },
      tools: zo.map((d) => ({
        type: "function",
        function: d
      })),
      messages: o.map((d) => d.tool_calls ? {
        ...d,
        tool_calls: d.tool_calls.map((p) => ({
          function: {
            name: p.function.name,
            arguments: typeof p.function.arguments == "string" ? JSON.parse(p.function.arguments || "{}") : p.function.arguments
          }
        }))
      } : d)
    } : {
      model: e,
      messages: o,
      temperature: 0.1,
      tool_choice: "auto",
      tools: zo.map((d) => ({
        type: "function",
        function: d
      }))
    }, r = await fetch(i ? "http://localhost:11434/api/chat" : l.url, {
      method: "POST",
      headers: n,
      signal: s,
      body: JSON.stringify(a)
    }).catch((d) => {
      if ((d == null ? void 0 : d.name) === "AbortError") throw d;
      if (l.id === "ollama") {
        const p = location.protocol !== "file:" && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
        throw new Error(p ? "Desde el sitio p\xFAblico el navegador NO deja llegar a Ollama de tu PC (protecci\xF3n de red privada de Chrome/Edge), aunque Ollama est\xE9 abierto. Opciones: abre Hekatan Struct en local, o elige aqu\xED arriba un proveedor en la nube (Gemini tiene clave gratis en aistudio.google.com/apikey)." : "Ollama no responde en localhost:11434. \xC1brelo o instala: ollama.com \u2192 ollama pull qwen2.5:7b");
      }
      throw new Error(`sin conexi\xF3n con ${l.nombre}: ${(d == null ? void 0 : d.message) ?? d}`);
    });
    if (!r.ok) {
      const d = (await r.text()).slice(0, 400);
      throw l.id === "ollama" && r.status === 404 ? new Error(`Modelo \xAB${e}\xBB no instalado: ollama pull ${e}`) : l.id === "ollama" && r.status === 403 ? new Error("Ollama rechaza a " + location.origin + '. Dale permiso: setx OLLAMA_ORIGINS "' + location.origin + '" y reinicia Ollama.') : new Error(`${l.nombre} ${r.status}: ${d}`);
    }
    const c = await r.json();
    if (i) {
      const d = c.message ?? {
        role: "assistant",
        content: ""
      };
      return ((_a2 = d.tool_calls) == null ? void 0 : _a2.length) && (d.tool_calls = d.tool_calls.map((p, f) => ({
        id: p.id ?? `t${Date.now()}${f}`,
        type: "function",
        function: {
          name: p.function.name,
          arguments: JSON.stringify(p.function.arguments ?? {})
        }
      }))), d;
    }
    return ((_c2 = (_b = c.choices) == null ? void 0 : _b[0]) == null ? void 0 : _c2.message) ?? {
      role: "assistant",
      content: ""
    };
  }
  function hd(l) {
    const e = [], t = /\{[^{}]*"name"\s*:\s*"([a-z_]+)"[^{}]*"arguments"\s*:\s*(\{[\s\S]*?\})\s*\}/g;
    let s;
    for (; s = t.exec(l); ) zo.some((n) => n.name === s[1]) && e.push({
      id: `t${Date.now()}${e.length}`,
      type: "function",
      function: {
        name: s[1],
        arguments: s[2]
      }
    });
    return e;
  }
  function vl(l, e) {
    var _a2, _b, _c2, _d2;
    if (e == null ? void 0 : e.error) return `\u2717 ${e.error}`;
    switch (l) {
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
        return (_d2 = e.modos) == null ? void 0 : _d2.slice(0, 3).map((t) => `T${t.modo} = ${t.T_s} s`).join(" \xB7 ");
      case "obtener_modelo":
        return `${e.plantilla ?? "vac\xEDo"} \xB7 ${e.nudos ?? 0} nudos`;
      default:
        return "\u2713";
    }
  }
  let as = null, ln, rs, sn, on = null;
  function Yi() {
    as && !document.body.contains(as) && document.body.appendChild(as);
  }
  function os(l, e) {
    Yi();
    const t = document.createElement("div"), s = {
      user: "align-self:flex-end;background:#0e7490;color:#fff;border-radius:10px 10px 2px 10px;",
      ia: "align-self:flex-start;background:#1f2937;color:#e5e7eb;border-radius:10px 10px 10px 2px;",
      paso: "align-self:stretch;background:#111827;color:#93c5fd;border-left:3px solid #22d3ee;font-family:Consolas,monospace;font-size:11px;",
      error: "align-self:stretch;background:#3f1d1d;color:#fca5a5;border-left:3px solid #ef4444;"
    };
    return t.style.cssText = "padding:6px 9px;max-width:92%;white-space:pre-wrap;word-break:break-word;line-height:1.35;" + s[l], t.textContent = e, ln.appendChild(t), ln.scrollTop = ln.scrollHeight, t;
  }
  function ud(l) {
    const e = JSON.stringify(l ?? {});
    return (l == null ? void 0 : l.script) ? `(${String(l.script).split(`
`).filter((t) => t.trim() && !t.trim().startsWith("#")).length} l\xEDneas .heks)` : e.length > 90 ? e.slice(0, 87) + "\u2026" : e;
  }
  async function Io() {
    const l = rs.value.trim();
    if (!l || on) return;
    const e = Cs.getProvider(), t = en.find((p) => p.id === e) ?? en[0], s = Cs.getKey(t.id), n = Cs.getModel(`agente_${t.id}`) || t.modelos[0];
    if (t.clave && !s) {
      os("error", `${t.nombre} necesita clave. ${t.pista}`);
      return;
    }
    rs.value = "", os("user", l);
    const i = tn;
    tn = [], Pi(), Hn.push(id(l, i)), on = new AbortController(), sn.textContent = "\u25A0 Parar";
    const o = os("ia", "\u2026"), a = /* @__PURE__ */ new Set([
      "cargar_plantilla",
      "cambiar_parametros",
      "modelar_heks"
    ]);
    let r = false, c = false, d = 0;
    try {
      for (let p = 0; p < Ga; p++) {
        const f = await cd(t, n, s, on.signal);
        let x = f.tool_calls ?? [];
        if (!x.length && f.content && (x = hd(f.content)), Hn.push({
          role: "assistant",
          content: x.length ? f.content ?? "" : f.content,
          tool_calls: x.length ? x : void 0
        }), !x.length && r && !c && d < 2) {
          d++, Hn.push({
            role: "user",
            content: "(Hekatan) Todav\xEDa no comprobaste el modelo. Corrige los avisos con cambiar_parametros si los hubo, llama resultados (y analisis_modal si se pidi\xF3 el periodo) y responde en 2-4 l\xEDneas con esos n\xFAmeros."
          });
          continue;
        }
        if (!x.length) {
          o.remove(), pd((f.content ?? "").trim() || "(sin respuesta)");
          return;
        }
        for (const b of x) {
          let C = {};
          try {
            C = typeof b.function.arguments == "string" ? JSON.parse(b.function.arguments || "{}") : b.function.arguments;
          } catch {
            C = null;
          }
          const _ = os("paso", `\u{1F527} ${b.function.name} ${C ? ud(C) : "(argumentos inv\xE1lidos)"}`);
          ln.insertBefore(_, o);
          let S;
          try {
            S = C ? await No(b.function.name, C) : {
              error: "JSON de argumentos inv\xE1lido"
            };
          } catch (A) {
            S = {
              error: String((A == null ? void 0 : A.message) ?? A)
            };
          }
          Yi(), _.textContent += `
   \u2192 ${vl(b.function.name, S)}`, a.has(b.function.name) && (r = true, c = false), (b.function.name === "resultados" || b.function.name === "analisis_modal") && (c = true), Hn.push({
            role: "tool",
            tool_call_id: b.id,
            content: JSON.stringify(S).slice(0, 6e3)
          });
        }
      }
      o.remove(), os("error", `Par\xE9 tras ${Ga} pasos. P\xEDdeme que siga si hace falta.`);
    } catch (p) {
      o.remove(), (p == null ? void 0 : p.name) !== "AbortError" ? os("error", String((p == null ? void 0 : p.message) ?? p)) : os("error", "Detenido.");
    } finally {
      on = null, sn.textContent = "Enviar \u25B6";
    }
  }
  function pd(l) {
    if (!Yc(l)) {
      os("ia", l);
      return;
    }
    Oi(Qa(l), l);
    const e = l.split(`
`).map((n) => n.trim()).find((n) => n && !/^[#*\-]/.test(n) && !n.includes("$")) ?? "", t = os("ia", (e ? e + `

` : "") + "\u{1F4C4} La explicaci\xF3n, con las f\xF3rmulas, est\xE1 en la hoja de la izquierda."), s = document.createElement("button");
    s.textContent = "Abrir la hoja \u25B8", s.style.cssText = "margin-top:6px;background:#13314f;color:#e8eef5;border:1px solid #2b5480;border-radius:5px;padding:3px 8px;font-size:12px;cursor:pointer;display:block;", s.onclick = () => Oi(Qa(l), l), t.appendChild(s);
  }
  function Qa(l) {
    const e = l.match(/^\s*#{1,3}\s+(.+)$/m);
    return e ? e[1].replace(/[*`$]/g, "").trim().slice(0, 60) : (l.split(`
`).map((s) => s.trim()).find(Boolean) ?? "").replace(/[*`$]/g, "").slice(0, 60) || "Hoja \xB7 Hekatan LISP";
  }
  async function fd() {
    if (!(location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname))) return false;
    try {
      const e = new AbortController(), t = setTimeout(() => e.abort(), 900), s = await fetch("http://localhost:11434/api/tags", {
        signal: e.signal
      });
      return clearTimeout(t), s.ok;
    } catch {
      return false;
    }
  }
  function md() {
    const l = document.createElement("div");
    l.id = "hk-agente-ia", l.style.cssText = [
      "position:fixed",
      "right:16px",
      "bottom:96px",
      "width:380px",
      "height:540px",
      "max-height:calc(100vh - 150px)",
      "max-width:calc(100vw - 32px)",
      "z-index:9000",
      "display:flex",
      "flex-direction:column",
      "background:#0b1220",
      "border:1px solid #334155",
      "border-radius:10px",
      "box-shadow:0 12px 40px rgba(0,0,0,.5)",
      "font:13px system-ui,Segoe UI,sans-serif",
      "color:#e5e7eb"
    ].join(";");
    const e = document.createElement("div");
    e.style.cssText = "display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid #1e293b;cursor:move;flex-shrink:0;", e.innerHTML = '<b style="flex:1">\u{1F916} Agente IA \xB7 Hekatan Struct</b>';
    const t = document.createElement("button");
    t.textContent = "\u2715", t.title = "Cerrar", t.style.cssText = "background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;", t.onclick = () => {
      l.style.display = "none", Oo();
    }, e.appendChild(t);
    const s = document.createElement("div");
    s.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-bottom:1px solid #1e293b;flex-shrink:0;";
    const n = "background:#111827;color:#e5e7eb;border:1px solid #334155;border-radius:4px;padding:3px 5px;font-size:12px;", i = document.createElement("select");
    i.style.cssText = n + "flex:1 1 120px;";
    for (const V of en) i.add(new Option(V.nombre, V.id));
    const o = document.createElement("input");
    o.id = "hk-agente-modelo", o.style.cssText = n + "flex:1 1 140px;", o.setAttribute("list", "hk-agente-modelos");
    const a = document.createElement("datalist");
    a.id = "hk-agente-modelos";
    const r = document.createElement("input");
    [
      "keydown",
      "keyup",
      "keypress",
      "paste"
    ].forEach((V) => r.addEventListener(V, (q) => q.stopPropagation())), r.type = "password", r.placeholder = "API key", r.style.cssText = n + "flex:1;";
    const c = document.createElement("button");
    c.type = "button", c.textContent = "\u{1F441}", c.title = "Ver la clave un momento (se vuelve a ocultar sola a los 8 s)", c.style.cssText = "background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:4px;padding:2px 8px;cursor:pointer;";
    let d = null;
    c.onclick = () => {
      const V = r.type === "password";
      r.type = V ? "text" : "password", c.textContent = V ? "\u{1F648}" : "\u{1F441}", clearTimeout(d), V && (d = setTimeout(() => {
        r.type = "password", c.textContent = "\u{1F441}";
      }, 8e3));
    };
    const p = document.createElement("div");
    p.style.cssText = "display:flex;gap:4px;flex:1 1 100%;", p.append(r, c);
    const f = document.createElement("div");
    f.style.cssText = "flex:1 1 100%;color:#64748b;font-size:11px;";
    const x = () => {
      const V = en.find((q) => q.id === i.value) ?? en[0];
      a.innerHTML = V.modelos.map((q) => `<option value="${q}">`).join(""), o.value = Cs.getModel(`agente_${V.id}`) || V.modelos[0], r.style.display = V.clave ? "" : "none", c.style.display = V.clave ? "" : "none", p.style.display = V.clave ? "flex" : "none", r.value = Cs.getKey(V.id), f.textContent = V.pista;
    }, b = Cs.getProvider();
    i.value = en.some((V) => V.id === b) ? b : "gemini", en.some((V) => V.id === b) || fd().then((V) => {
      V && i.value === "gemini" && (i.value = "ollama", x());
    }), i.onchange = () => {
      Cs.setProvider(i.value), x();
    }, o.onchange = () => Cs.setModel(`agente_${i.value}`, o.value.trim());
    const C = () => {
      const V = r.value.trim();
      if (Cs.setKey(i.value, V), !V) {
        f.textContent = "Falta la clave.", f.style.color = "#f59e0b";
        return;
      }
      f.textContent = "\u2713 Clave guardada en este navegador (no se env\xEDa a ning\xFAn sitio).", f.style.color = "#5ecb92";
    };
    r.onchange = C, r.oninput = C, r.addEventListener("paste", () => setTimeout(C, 0)), s.append(i, o, a, p, f), x(), ln = document.createElement("div"), ln.style.cssText = "flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:10px;";
    const _ = document.createElement("div");
    _.style.cssText = "display:flex;gap:6px;padding:8px 10px;border-top:1px solid #1e293b;flex-shrink:0;", rs = document.createElement("textarea"), rs.rows = 2, rs.placeholder = "Ej.: edificio de 4 pisos, 3\xD72 vanos de 5 m; dime la flecha y el periodo", rs.style.cssText = n + "flex:1;resize:none;font-size:13px;", [
      "keydown",
      "keyup",
      "keypress"
    ].forEach((V) => rs.addEventListener(V, (q) => q.stopPropagation())), rs.addEventListener("keydown", (V) => {
      V.key === "Enter" && !V.shiftKey && (V.preventDefault(), Io());
    });
    const S = document.createElement("div");
    S.style.cssText = "display:flex;flex-direction:column;gap:4px;", sn = document.createElement("button"), sn.textContent = "Enviar \u25B6", sn.style.cssText = "background:#22d3ee;color:#000;border:none;border-radius:4px;padding:6px 10px;font-weight:600;cursor:pointer;", sn.onclick = () => {
      on ? on.abort() : Io();
    };
    const A = document.createElement("button");
    A.textContent = "\u21B6 Deshacer", A.title = "Vuelve el modelo al estado anterior al \xFAltimo cambio del agente", A.style.cssText = "background:#334155;color:#e5e7eb;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;", A.onclick = async () => {
      if (on) return;
      const V = await No("deshacer", {});
      os("paso", `\u21B6 deshacer \u2192 ${vl("deshacer", V)}`);
    };
    const P = document.createElement("button");
    P.textContent = "\u{1F4CE}", P.title = "Adjuntar una imagen, un PDF o un texto: una p\xE1gina del libro, un plano, la formulaci\xF3n. El modelo LEE la imagen (no hace falta pasarla a texto).", P.style.cssText = "background:#334155;color:#e5e7eb;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:13px;", P.onclick = async () => {
      const V = await od();
      if (!V.length) return;
      const q = await nd(V, (D) => os("paso", "\u{1F4CE} " + D));
      tn = [
        ...tn,
        ...q
      ], Pi();
    }, S.append(sn, A, P);
    const H = document.createElement("div");
    H.style.cssText = "display:none;flex-wrap:wrap;gap:4px;padding:4px 10px;border-top:1px solid #1e293b;flex-shrink:0;", Pi = () => {
      H.innerHTML = "", H.style.display = tn.length ? "flex" : "none", tn.forEach((V, q) => {
        const D = document.createElement("span");
        D.style.cssText = "background:#1e293b;border:1px solid #334155;border-radius:4px;padding:1px 6px;font-size:11px;color:#cbd5e1;cursor:pointer;", D.textContent = (V.tipo === "imagen" ? "\u{1F5BC} " : "\u{1F4C4} ") + V.nombre.slice(0, 26) + " \xD7", D.title = "Quitar", D.onclick = () => {
          tn.splice(q, 1), Pi();
        }, H.appendChild(D);
      });
    }, _.append(rs, S), l.append(e, s, ln, H, _), document.body.appendChild(l);
    let U = 0, G = 0, W = false;
    return e.addEventListener("pointerdown", (V) => {
      if (V.target.tagName === "BUTTON") return;
      W = true;
      const q = l.getBoundingClientRect();
      U = V.clientX - q.left, G = V.clientY - q.top, e.setPointerCapture(V.pointerId);
    }), e.addEventListener("pointermove", (V) => {
      W && (l.style.left = Math.max(0, V.clientX - U) + "px", l.style.top = Math.max(0, V.clientY - G) + "px", l.style.right = "auto", l.style.bottom = "auto");
    }), e.addEventListener("pointerup", () => {
      W = false;
    }), os("ia", "Hola. P\xEDdeme una estructura y la armo en el visor, paso a paso: plantilla o .heks, c\xE1lculo, resultados y modal."), l;
  }
  function Oo() {
    const l = !!as && as.style.display !== "none" && document.body.contains(as);
    for (const t of [
      "hk-agente-lanzador",
      "hk-caja-negra-btn"
    ]) {
      const s = document.getElementById(t);
      s && (s.style.display = l ? "none" : "block");
    }
    const e = document.getElementById("hk-agente-explicar");
    e && l && (e.style.display = "none");
  }
  Vo = function(l) {
    Yi(), as || (as = md()), as.style.display = "flex", Oo(), setTimeout(() => {
      try {
        const e = as.querySelector('input[type="password"]');
        if (e && !e.value) {
          e.focus();
          return;
        }
        rs == null ? void 0 : rs.focus();
      } catch {
      }
    }, 60), l && (rs.value = l), rs.focus();
  };
  function gd(l) {
    const e = () => {
      const t = window.innerHeight, s = document.getElementById("hk-agente-explicar"), n = (a) => !!a && (a === l || a === s || l.contains(a)), i = [
        "#hk-cad-status",
        "#legend",
        "#hk3-cmdline"
      ], o = (a) => i.some((r) => {
        const c = document.querySelector(r);
        if (!c) return false;
        const d = c.getBoundingClientRect();
        if (d.width <= 0 || d.height <= 0) return false;
        const p = 6;
        return !(a.right + p < d.left || d.right < a.left - p || a.bottom + p < d.top || d.bottom < a.top - p);
      });
      for (let a = 18; a < t * 0.7; a += 12) {
        l.style.bottom = a + "px", s && (s.style.bottom = a + "px");
        const r = l.getBoundingClientRect();
        if (o(r)) continue;
        const c = document.elementFromPoint(r.x + r.width / 2, r.y + 4), d = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2), p = document.elementFromPoint(r.x + r.width / 2, r.bottom - 4);
        if (n(c) && n(d) && n(p)) return;
      }
      l.style.bottom = "120px";
    };
    e(), window.addEventListener("resize", e), setTimeout(e, 400), setTimeout(e, 1500), setTimeout(e, 4e3);
  }
  Ad = function() {
    if (Yi(), document.getElementById("hk-agente-lanzador")) return;
    const l = document.createElement("button");
    l.id = "hk-agente-lanzador", l.textContent = "\u{1F916}", l.title = "Agente IA: p\xEDdele una estructura y la modela", l.style.cssText = [
      "position:fixed",
      "right:16px",
      "bottom:100px",
      "z-index:9600",
      "width:44px",
      "height:44px",
      "border-radius:50%",
      "border:1px solid #22d3ee",
      "background:#0b1220",
      "font-size:22px",
      "cursor:pointer",
      "box-shadow:0 4px 14px rgba(0,0,0,.4)"
    ].join(";"), gd(l), l.onclick = () => {
      as && as.style.display !== "none" && document.body.contains(as) ? (as.style.display = "none", Oo()) : Vo();
    }, document.body.appendChild(l), yd();
  };
  function yd() {
    if (document.getElementById("hk-agente-explicar")) return;
    const l = document.createElement("button");
    l.id = "hk-agente-explicar", l.textContent = "\u{1F4AC} Expl\xEDcame", l.title = "Que el agente lea el modelo y sus resultados y te los explique", l.style.cssText = [
      "position:fixed",
      "left:0",
      "top:0",
      "z-index:8999",
      "height:44px",
      "padding:0 14px",
      "border-radius:22px",
      "border:1px solid #22d3ee",
      "background:#0b1220",
      "color:#e2e8f0",
      "font:13px system-ui,sans-serif",
      "cursor:pointer",
      "box-shadow:0 4px 14px rgba(0,0,0,.4)",
      "display:none"
    ].join(";"), l.onclick = () => {
      _l("Expl\xEDcame este modelo ya calculado. Usa obtener_modelo y resultados, y dime en pocas l\xEDneas: qu\xE9 estructura es, qu\xE9 cargas y apoyos tiene, cu\xE1nto se desplaza (d\xF3nde y cu\xE1nto), si las reacciones equilibran la carga y si el resultado es razonable.");
    }, document.body.appendChild(l);
    const e = () => {
      var _a2, _b, _c2, _d2;
      const s = !!((_d2 = (_c2 = (_b = (_a2 = dt().__hekatanStates) == null ? void 0 : _a2.deformOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c2.deformations) == null ? void 0 : _d2.size);
      if (l.style.display = s ? "block" : "none", !s) return;
      const n = document.getElementById("hk-agente-lanzador");
      if (!n) return;
      const i = n.getBoundingClientRect();
      if (i.width <= 0 || i.height <= 0) {
        l.style.display = "none";
        return;
      }
      l.style.top = `${i.top}px`, l.style.left = `${Math.max(8, i.left - l.offsetWidth - 8)}px`;
    };
    e(), setInterval(e, 1200);
  }
  async function _l(l) {
    Vo(), rs.value = l, await Io();
  }
  typeof window < "u" && (dt().__hekatanAgenteIA = Vo, dt().__hekatanPedirAgente = _l, dt().__hekatanAgenteTool = No);
})();
export {
  Ut as A,
  Ic as D,
  Ed as H,
  Oc as P,
  __tla,
  kd as a,
  vd as b,
  fr as c,
  Da as d,
  dc as e,
  hc as f,
  bd as g,
  uc as h,
  vc as i,
  Ii as j,
  Cs as k,
  Vo as l,
  Ad as m,
  Md as n,
  Sd as o,
  Cd as p,
  $d as q,
  _d as w
};
