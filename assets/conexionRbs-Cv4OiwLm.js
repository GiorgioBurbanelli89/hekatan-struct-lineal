import { a as ft } from "./analyze-DgLgRmKg.js";
import { d as _t, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { b as ut, c as bt, i as ht } from "./menegottoPinto-9Id4uJ7l.js";
import { s as Ke, __tla as __tla_1 } from "./secantPlasticity-CFgKIIdb.js";
import { b as O, B as D, d as L, S as Me, f as ge, M as V, V as B, c as he, L as Mt, E as gt, x as Je, e as te, J as He } from "./theme-DQ--CgsI.js";
import { c as Se } from "./colorMapPercentile-OnF3uP-w.js";
let Et;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  function xt(e) {
    var _a, _b;
    const n = e.nSteps ?? 10, l = e.maxIterPerStep ?? 8, f = e.softeningFactor, p = [], u = [], b = [], h = [], v = [];
    let w = -1, a = {}, s = {};
    for (let F = 1; F <= n; F++) {
      const y = F / n, S = e.buildLoads(y), z = {
        supports: e.supports,
        loads: S
      }, m = Ke({
        nodes: e.nodes,
        elements: e.elements,
        nodeInputs: z,
        elementInputs: e.elementInputs,
        Fy: e.Fy,
        maxIter: l,
        tol: 0.03,
        softeningFactor: f
      }), M = (_a = m.deformOutputs) == null ? void 0 : _a.deformations;
      let C = 0;
      if (M) {
        const $ = M.get(e.trackNode);
        $ && (C = Math.abs($[e.trackDof] ?? 0));
      }
      let c = 0;
      const g = (_b = m.analyzeOutputs) == null ? void 0 : _b.vonMises;
      if (g) for (const $ of g.values()) for (const _ of $) {
        const P = Math.abs(_);
        P > c && (c = P);
      }
      p.push(y), u.push(C), b.push(c), h.push(m.elementsYielded), v.push(m.converged), w < 0 && m.elementsYielded > 0 && (w = F - 1), a = m.deformOutputs, s = m.analyzeOutputs;
    }
    const i = u[0] > 1e-12 ? p[0] / u[0] : 0;
    return {
      lambdas: p,
      displacements: u,
      vonMisesMax: b,
      elementsYielded: h,
      firstYieldStep: w,
      finalDeformOutputs: a,
      finalAnalyzeOutputs: s,
      ultimateLoadFactor: p[p.length - 1] ?? 0,
      elasticStiffness: i,
      converged: v
    };
  }
  function wt(e) {
    const n = e.size ?? 1.5, l = [], f = e.lambdas.length;
    if (f === 0) return l;
    const p = Math.max(...e.displacements, 1e-9), u = Math.max(...e.lambdas, 1e-9), b = e.displacements.map((c) => c / p * n), h = e.lambdas.map((c) => c / u * n), [v, w, a] = e.center, s = (c, g) => new B(v + c, w, a + g), i = new O({
      color: 11184810
    }), F = new D().setFromPoints([
      s(0, 0),
      s(n * 1.05, 0)
    ]), y = new D().setFromPoints([
      s(0, 0),
      s(0, n * 1.05)
    ]);
    l.push(new L(F, i)), l.push(new L(y, i));
    const S = new O({
      color: 5592405,
      transparent: true,
      opacity: 0.4
    });
    for (let c = 1; c <= 5; c++) {
      const g = c / 5 * n, $ = new D().setFromPoints([
        s(0, g),
        s(n, g)
      ]);
      l.push(new L($, S));
    }
    const z = new O({
      color: 65484,
      linewidth: 3
    }), m = [
      s(0, 0)
    ];
    for (let c = 0; c < f; c++) m.push(s(b[c], h[c]));
    const M = new D().setFromPoints(m);
    l.push(new L(M, z));
    const C = new Me(n * 0.015, 8, 6);
    for (let c = 0; c < f; c++) {
      const $ = c === e.firstYieldStep ? 16776960 : 65484, _ = new ge({
        color: $
      }), P = new V(C, _);
      P.position.copy(s(b[c], h[c])), l.push(P);
    }
    if (e.firstYieldStep >= 0) {
      const c = e.firstYieldStep, g = s(b[c], h[c]), $ = new O({
        color: 16711680
      }), _ = n * 0.04, P = new D().setFromPoints([
        g.clone().add(new B(-_, 0, -_)),
        g.clone().add(new B(+_, 0, +_))
      ]), me = new D().setFromPoints([
        g.clone().add(new B(-_, 0, +_)),
        g.clone().add(new B(+_, 0, -_))
      ]);
      l.push(new L(P, $)), l.push(new L(me, $));
    }
    return l;
  }
  function pt(e) {
    const n = /* @__PURE__ */ new Map(), l = e.weld_tol ?? e.tf_beam * 1.5;
    for (let f = 0; f < e.elements.length; f++) {
      const p = e.elements[f];
      let u = 0, b = 0, h = 0;
      for (const g of p) u += e.nodes[g][0], b += e.nodes[g][1], h += e.nodes[g][2];
      u /= p.length, b /= p.length, h /= p.length;
      const v = Math.abs(u), w = Math.abs(b), a = Math.abs(h), s = Math.abs(u - (e.d_col / 2 - e.tf_col / 2)) < l, i = Math.abs(u - (-e.d_col / 2 + e.tf_col / 2)) < l, F = w < 1e-3 && v <= e.d_col / 2 && a <= e.d_col, y = u > e.x_col_face - l, S = y && Math.abs(h - (e.d_beam / 2 - e.tf_beam / 2)) < l, z = y && Math.abs(h - (-e.d_beam / 2 + e.tf_beam / 2)) < l, m = y && w < 1e-3 && a < e.d_beam / 2 - e.tf_beam / 2, M = y && u < e.x_col_face + l * 2, C = u >= e.x_rbs_start && u <= e.x_rbs_end;
      let c = "other";
      M && (S || z || m) ? c = "weld_zone" : S && C ? c = "RBS_top" : z && C ? c = "RBS_bot" : S ? c = "beam_flange_top" : z ? c = "beam_flange_bot" : m ? c = "beam_web" : s ? c = "col_flange_front" : i ? c = "col_flange_back" : F && (c = "col_web"), n.set(f, c);
    }
    return n;
  }
  const yt = {
    RBS_top: "RBS \u2014 pat\xEDn sup.",
    RBS_bot: "RBS \u2014 pat\xEDn inf.",
    beam_flange_top: "Viga \u2014 pat\xEDn sup.",
    beam_flange_bot: "Viga \u2014 pat\xEDn inf.",
    beam_web: "Viga \u2014 alma",
    col_flange_front: "Columna \u2014 pat\xEDn frontal",
    col_flange_back: "Columna \u2014 pat\xEDn trasero",
    col_web: "Columna \u2014 alma",
    weld_zone: "Zona soldadura",
    plate_body: "Cuerpo placa",
    plate_around_bolt: "Placa alrededor del perno",
    other: "Otros"
  };
  function vt(e, n, l) {
    const f = /* @__PURE__ */ new Map();
    for (const [u, b] of e.entries()) {
      const h = n.get(u);
      if (!h || h.length === 0) continue;
      let v = 0;
      for (const a of h) {
        const s = Math.abs(a);
        s > v && (v = s);
      }
      let w = f.get(b);
      w || (w = {
        vmValues: [],
        count: 0
      }, f.set(b, w)), w.vmValues.push(v), w.count++;
    }
    const p = [];
    for (const [u, b] of f.entries()) {
      if (b.vmValues.length === 0) continue;
      const h = Math.max(...b.vmValues), v = b.vmValues.reduce((i, F) => i + F, 0) / b.vmValues.length, w = h / l;
      let a = "green", s = "\u{1F7E2}";
      w > 1 ? (a = "red", s = "\u{1F534}") : w > 0.8 && (a = "yellow", s = "\u{1F7E1}"), p.push({
        zone: u,
        label: yt[u],
        nElements: b.count,
        maxVm: h,
        meanVm: v,
        ratio: w,
        status: a,
        statusIcon: s
      });
    }
    return p.sort((u, b) => b.ratio - u.ratio), p;
  }
  function Ft(e) {
    return e.length > 0 ? e[0] : null;
  }
  function St(e) {
    return e ? e.ratio < 0.5 ? "Sin esfuerzo significativo (aument\xE1 carga)" : e.ratio < 0.8 ? "Rango el\xE1stico seguro" : e.ratio < 1 ? `Cerca del l\xEDmite \u2014 governing: ${e.label}` : e.ratio < 1.5 ? `\u26A0 Fluencia en: ${e.label}` : `\u2717 COLAPSO en: ${e.label} (\u03C3=${e.ratio.toFixed(1)}\xD7Fy)` : "\u2014";
  }
  function zt(e, n, l, f) {
    if (!f) return [];
    let p = 1 / 0, u = 1 / 0, b = 1 / 0, h = -1 / 0, v = -1 / 0, w = -1 / 0, a = 0;
    for (const [z, m] of l.entries()) {
      if (m !== f) continue;
      const M = n[z];
      for (const C of M) {
        const [c, g, $] = e[C];
        c < p && (p = c), g < u && (u = g), $ < b && (b = $), c > h && (h = c), g > v && (v = g), $ > w && (w = $);
      }
      a++;
    }
    if (a === 0) return [];
    const s = 0.015;
    p -= s, u -= s, b -= s, h += s, v += s, w += s;
    const i = new he(h - p, v - u, w - b), F = new ge({
      color: 16711748,
      transparent: true,
      opacity: 0.15,
      wireframe: false
    }), y = new V(i, F);
    y.position.set((p + h) / 2, (u + v) / 2, (b + w) / 2);
    const S = new Mt(new gt(i), new O({
      color: 16711748,
      linewidth: 2
    }));
    return S.position.copy(y.position), [
      y,
      S
    ];
  }
  function $t(e) {
    const n = [], l = e.theta.length;
    if (l < 2) return {
      objects: n,
      moveCursor: () => {
      },
      setProgress: () => {
      }
    };
    const f = e.size, p = Math.max(...e.theta.map((_) => Math.abs(_)), 1e-9), u = Math.max(...e.M.map((_) => Math.abs(_)), 1e-9), b = e.theta.map((_) => _ / p * (f / 2)), h = e.M.map((_) => _ / u * (f / 2)), [v, w, a] = e.center, s = (_, P) => new B(v + _, w, a + P), i = f / 2, F = new O({
      color: 6710886
    });
    n.push(new L(new D().setFromPoints([
      s(-i, -i),
      s(+i, -i),
      s(+i, +i),
      s(-i, +i),
      s(-i, -i)
    ]), F));
    const y = new O({
      color: 11184810
    });
    n.push(new L(new D().setFromPoints([
      s(-i, 0),
      s(+i, 0)
    ]), y)), n.push(new L(new D().setFromPoints([
      s(0, -i),
      s(0, +i)
    ]), y));
    const S = 0.8 * e.Mp / u * (f / 2);
    if (Math.abs(S) <= i) {
      const _ = new O({
        color: 65280
      });
      n.push(new L(new D().setFromPoints([
        s(-i, +S),
        s(+i, +S)
      ]), _)), n.push(new L(new D().setFromPoints([
        s(-i, -S),
        s(+i, -S)
      ]), _));
    }
    const z = e.targetDrift / p * (f / 2);
    if (Math.abs(z) <= i) {
      const _ = new O({
        color: 16746496,
        transparent: true,
        opacity: 0.6
      });
      n.push(new L(new D().setFromPoints([
        s(+z, -i),
        s(+z, +i)
      ]), _)), n.push(new L(new D().setFromPoints([
        s(-z, -i),
        s(-z, +i)
      ]), _));
    }
    const m = new Float32Array(l * 3);
    for (let _ = 0; _ < l; _++) {
      const P = s(b[_], h[_]);
      m[_ * 3 + 0] = P.x, m[_ * 3 + 1] = P.y, m[_ * 3 + 2] = P.z;
    }
    const M = new D();
    M.setAttribute("position", new Je(m, 3)), M.setDrawRange(0, l);
    const C = new O({
      color: 65484,
      linewidth: 3
    }), c = new L(M, C);
    n.push(c);
    const g = new ge({
      color: 16711748
    }), $ = new V(new Me(f * 0.025, 12, 8), g);
    return $.position.copy(s(b[0], h[0])), n.push($), {
      objects: n,
      moveCursor: (_) => {
        const P = Math.max(0, Math.min(l - 1, _));
        $.position.copy(s(b[P], h[P]));
      },
      setProgress: (_) => {
        const P = Math.max(1, Math.min(l, _ + 1));
        M.setDrawRange(0, P);
      }
    };
  }
  function Ct(e) {
    const n = [], l = e.drifts.length;
    if (l < 2) return {
      objects: n,
      moveCursor: () => {
      },
      setProgress: () => {
      }
    };
    const f = e.size, p = Math.max(...e.drifts.map((m) => Math.abs(m)), 1e-9), u = e.drifts.map((m, M) => M / (l - 1) * f), b = e.drifts.map((m) => m / p * (f / 2)), [h, v, w] = e.center, a = (m, M) => new B(h + m, v, w + M), s = f / 2;
    n.push(new L(new D().setFromPoints([
      a(0, -s),
      a(f, -s),
      a(f, +s),
      a(0, +s),
      a(0, -s)
    ]), new O({
      color: 6710886
    }))), n.push(new L(new D().setFromPoints([
      a(0, 0),
      a(f, 0)
    ]), new O({
      color: 11184810
    })));
    const i = new Float32Array(l * 3);
    for (let m = 0; m < l; m++) {
      const M = a(u[m], b[m]);
      i[m * 3 + 0] = M.x, i[m * 3 + 1] = M.y, i[m * 3 + 2] = M.z;
    }
    const F = new D();
    F.setAttribute("position", new Je(i, 3)), F.setDrawRange(0, l);
    const y = new L(F, new O({
      color: 16755200,
      linewidth: 2
    }));
    n.push(y);
    const S = new ge({
      color: 16711748
    }), z = new V(new Me(f * 0.022, 12, 8), S);
    return z.position.copy(a(u[0], b[0])), n.push(z), {
      objects: n,
      moveCursor: (m) => {
        const M = Math.max(0, Math.min(l - 1, m));
        z.position.copy(a(u[M], b[M]));
      },
      setProgress: (m) => {
        const M = Math.max(1, Math.min(l, m + 1));
        F.setDrawRange(0, M);
      }
    };
  }
  Et = {
    id: "conexion-rbs",
    name: "Conexi\xF3n RBS (AISC 358-22 \xB7 Protocolo K3)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F529} Conexiones",
    hasModal: false,
    defaultShellResult: "vonMises",
    availableShellResults: [
      "vonMises",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "bendingXX",
      "bendingYY",
      "displacementZ"
    ],
    params: {
      d_beam: {
        default: 0.6,
        min: 0.3,
        max: 1,
        step: 0.02,
        label: "d viga (m)",
        folder: "Viga"
      },
      bf_beam: {
        default: 0.22,
        min: 0.12,
        max: 0.4,
        step: 0.01,
        label: "bf pat\xEDn viga (m)",
        folder: "Viga"
      },
      tf_beam: {
        default: 0.02,
        min: 0.01,
        max: 0.04,
        step: 2e-3,
        label: "tf pat\xEDn viga (m)",
        folder: "Viga"
      },
      tw_beam: {
        default: 0.012,
        min: 6e-3,
        max: 0.025,
        step: 1e-3,
        label: "tw alma viga (m)",
        folder: "Viga"
      },
      L_beam: {
        default: 3.5,
        min: 2,
        max: 6,
        step: 0.1,
        label: "L viga (m)",
        folder: "Viga"
      },
      d_col: {
        default: 0.42,
        min: 0.3,
        max: 0.7,
        step: 0.02,
        label: "d columna (m)",
        folder: "Columna"
      },
      bf_col: {
        default: 0.4,
        min: 0.25,
        max: 0.6,
        step: 0.01,
        label: "bf pat\xEDn col (m)",
        folder: "Columna"
      },
      tf_col: {
        default: 0.025,
        min: 0.012,
        max: 0.05,
        step: 2e-3,
        label: "tf pat\xEDn col (m)",
        folder: "Columna"
      },
      tw_col: {
        default: 0.018,
        min: 0.01,
        max: 0.035,
        step: 1e-3,
        label: "tw alma col (m)",
        folder: "Columna"
      },
      a_rbs: {
        default: 0.625,
        min: 0.5,
        max: 0.75,
        step: 0.025,
        label: "a/bf",
        folder: "RBS"
      },
      b_rbs: {
        default: 0.75,
        min: 0.65,
        max: 0.85,
        step: 0.025,
        label: "b/d",
        folder: "RBS"
      },
      c_rbs: {
        default: 0.25,
        min: 0.2,
        max: 0.25,
        step: 0.025,
        label: "c/bf (reducci\xF3n)",
        folder: "RBS"
      },
      Fy: {
        default: 345e3,
        min: 25e4,
        max: 45e4,
        step: 5e3,
        label: "Fy (kN/m\xB2)",
        folder: "Material"
      },
      E_steel: {
        default: 2e8,
        min: 19e7,
        max: 21e7,
        step: 1e6,
        label: "E (kN/m\xB2)",
        folder: "Material"
      },
      b_hard: {
        default: 0.01,
        min: 5e-3,
        max: 0.05,
        step: 5e-3,
        label: "b strain hardening",
        folder: "Material"
      },
      weld_type: {
        default: 0,
        label: "Tipo soldadura",
        options: {
          "CJP (penetraci\xF3n completa)": 0,
          "PJP (parcial)": 1,
          Filete: 2
        },
        folder: "Soldadura"
      },
      electrode_Fexx: {
        default: 48e4,
        label: "Electrodo Fexx (kN/m\xB2)",
        options: {
          "E60XX (414 MPa)": 414e3,
          "E70XX (483 MPa)": 483e3,
          "E80XX (552 MPa)": 552e3
        },
        folder: "Soldadura"
      },
      weld_throat: {
        default: 8e-3,
        min: 4e-3,
        max: 0.02,
        step: 1e-3,
        label: "Garganta tw (m, filete/PJP)",
        folder: "Soldadura"
      },
      weld_access_hole: {
        default: 1,
        label: "Weld access hole",
        options: {
          No: 0,
          "S\xED (AWS D1.8)": 1
        },
        folder: "Soldadura"
      },
      classification: {
        default: 1,
        label: "Clasificaci\xF3n sismo",
        options: {
          "IMF (0.02 rad)": 0,
          "SMF (0.04 rad)": 1,
          "Extendido (0.06 rad)": 2
        },
        folder: "Ensayo K3"
      },
      story_h: {
        default: 3.66,
        min: 2.5,
        max: 5,
        step: 0.1,
        label: "h piso (m)",
        folder: "Ensayo K3"
      },
      steps_per_cycle: {
        default: 40,
        min: 20,
        max: 100,
        step: 10,
        label: "Steps/ciclo",
        folder: "Ensayo K3"
      },
      mesh_density: {
        default: 2,
        min: 1,
        max: 5,
        step: 1,
        label: "Densidad malla (2 = r\xE1pido, 4 = denso)",
        folder: "Malla"
      },
      use_nonlinear: {
        default: 2,
        label: "Solver",
        options: {
          "Lineal (el\xE1stico)": 0,
          "No-lineal J2 secante": 1,
          "IDEA StatiCa (pushover)": 2
        },
        folder: "Solver"
      },
      nl_max_iter: {
        default: 10,
        min: 3,
        max: 25,
        step: 1,
        label: "Max iter NL",
        folder: "Solver"
      },
      load_factor: {
        default: 0.5,
        min: 0.02,
        max: 0.8,
        step: 0.02,
        label: "Factor carga (\xD7Mp)",
        folder: "Solver"
      },
      idea_steps: {
        default: 12,
        min: 4,
        max: 30,
        step: 1,
        label: "N pasos pushover",
        folder: "Solver"
      },
      animate_k3: {
        default: 0,
        label: "Animaci\xF3n K3",
        options: {
          Off: 0,
          "On (40 Hz)": 1,
          "On (lenta 10 Hz)": 2
        },
        folder: "Solver"
      },
      anim_amp: {
        default: 30,
        min: 5,
        max: 120,
        step: 5,
        label: "Amplificaci\xF3n visual",
        folder: "Solver"
      },
      colormap_mode: {
        default: 0,
        label: "Colormap",
        options: {
          "\u03C3vm por shell (FEM cl\xE1sico)": 0,
          "Utilization por componente (IDEA)": 1
        },
        folder: "Solver"
      }
    },
    build(e, n) {
      var _a;
      const l = [], f = [], p = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), F = e.E_steel / 2.6, y = 77, S = 1e-4, z = /* @__PURE__ */ new Map(), m = (t, o, r) => {
        const d = Math.round(t / S), x = Math.round(o / S), R = Math.round(r / S), I = `${d},${x},${R}`;
        let A = z.get(I);
        return A === void 0 && (l.push([
          t,
          o,
          r
        ]), A = l.length - 1, z.set(I, A)), A;
      }, M = (t, o, r, d, x) => {
        f.push([
          t,
          o,
          r,
          d
        ]);
        const R = f.length - 1;
        p.set(R, x), u.set(R, e.E_steel), b.set(R, 0.3), h.set(R, y), v.set(R, 0), w.set(R, 0), a.set(R, 0), s.set(R, 0), i.set(R, F);
      }, C = e.story_h, c = Math.max(1, Math.round(e.mesh_density)), g = 6 * c, $ = 2 * c, _ = c + 1, P = +e.d_col / 2 - e.tf_col / 2, me = -e.d_col / 2 + e.tf_col / 2, ze = me, Ze = P, oe = [];
      for (let t = 0; t <= g; t++) {
        const o = -C / 2 + t * C / g, r = [];
        for (let d = 0; d <= $; d++) {
          const x = -e.bf_col / 2 + d * e.bf_col / $;
          r.push(m(P, x, o));
        }
        oe.push(r);
      }
      for (let t = 0; t < g; t++) for (let o = 0; o < $; o++) M(oe[t][o], oe[t][o + 1], oe[t + 1][o + 1], oe[t + 1][o], e.tf_col);
      const ne = [];
      for (let t = 0; t <= g; t++) {
        const o = -C / 2 + t * C / g, r = [];
        for (let d = 0; d <= $; d++) {
          const x = -e.bf_col / 2 + d * e.bf_col / $;
          r.push(m(me, x, o));
        }
        ne.push(r);
      }
      for (let t = 0; t < g; t++) for (let o = 0; o < $; o++) M(ne[t][o], ne[t][o + 1], ne[t + 1][o + 1], ne[t + 1][o], e.tf_col);
      const se = [];
      for (let t = 0; t <= g; t++) {
        const o = -C / 2 + t * C / g, r = [];
        for (let d = 0; d <= _; d++) {
          const x = ze + (Ze - ze) * (d / _);
          r.push(m(x, 0, o));
        }
        se.push(r);
      }
      for (let t = 0; t < g; t++) for (let o = 0; o < _; o++) M(se[t][o], se[t][o + 1], se[t + 1][o + 1], se[t + 1][o], e.tw_col);
      const E = e.d_col / 2, T = e.a_rbs * e.bf_beam, W = T + e.b_rbs * e.d_beam, $e = (T + W) / 2, de = e.c_rbs * e.bf_beam, Ce = e.b_rbs * e.d_beam, xe = (4 * de * de + Ce * Ce) / (8 * de), Re = (t) => {
        if (t < T || t > W) return e.bf_beam;
        const o = t - $e, r = Math.sqrt(Math.max(0, xe * xe - o * o)) - (xe - de);
        return e.bf_beam - 2 * Math.max(0, r);
      }, Z = [
        0
      ], Pe = 2 * c;
      for (let t = 1; t <= Pe; t++) Z.push(T * t / Pe);
      const Ie = 8 * c + 4;
      for (let t = 1; t < Ie; t++) Z.push(T + (W - T) * t / Ie);
      Z.push(W);
      const Ae = 5 * c;
      for (let t = 1; t <= Ae; t++) Z.push(W + (e.L_beam - W) * t / Ae);
      Z.sort((t, o) => t - o);
      const K = [];
      for (const t of Z) (K.length === 0 || K[K.length - 1] < t - 1e-6) && K.push(t);
      const De = +e.d_beam / 2 - e.tf_beam / 2, we = -e.d_beam / 2 + e.tf_beam / 2, X = [], q = [], U = [], H = 2 * c, fe = 2 * c;
      for (const t of K) {
        const o = Re(t), r = E + t, d = [], x = [];
        for (let I = 0; I <= H; I++) {
          const A = -o / 2 + I * o / H;
          d.push(m(r, A, De)), x.push(m(r, A, we));
        }
        X.push(d), q.push(x);
        const R = [];
        for (let I = 0; I <= fe; I++) {
          const A = we + (De - we) * (I / fe);
          R.push(m(r, 0, A));
        }
        U.push(R);
      }
      for (let t = 0; t < K.length - 1; t++) {
        for (let o = 0; o < H; o++) M(X[t][o], X[t][o + 1], X[t + 1][o + 1], X[t + 1][o], e.tf_beam), M(q[t][o], q[t][o + 1], q[t + 1][o + 1], q[t + 1][o], e.tf_beam);
        for (let o = 0; o < fe; o++) M(U[t][o], U[t][o + 1], U[t + 1][o + 1], U[t + 1][o], e.tw_beam);
      }
      const j = /* @__PURE__ */ new Map(), pe = 0;
      for (let t = 0; t <= H; t++) j.set(X[pe][t], [
        true,
        true,
        true,
        true,
        true,
        true
      ]), j.set(q[pe][t], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let t = 0; t <= fe; t++) j.set(U[pe][t], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let t = 0; t < l.length; t++) {
        const o = l[t][2], r = Math.abs(l[t][0]) > e.d_col / 2 - 1e-4 - 1e-6 || Math.abs(l[t][1]) < 1e-6;
        Math.abs(Math.abs(o) - C / 2) < 1e-4 && r && l[t][0] <= e.d_col / 2 + 1e-4 && (j.has(t) || j.set(t, [
          true,
          true,
          true,
          true,
          true,
          true
        ]));
      }
      const qe = e.bf_beam * (1 - 2 * e.c_rbs) * e.tf_beam * (e.d_beam - e.tf_beam), Ue = e.Fy * qe, Qe = e.L_beam - e.a_rbs * e.bf_beam - e.b_rbs * e.d_beam / 2, Le = e.load_factor * Ue / Math.max(Qe, 0.5), _e = /* @__PURE__ */ new Map(), ye = K.length - 1, et = Le / (H + 1);
      for (let t = 0; t <= H; t++) _e.set(X[ye][t], [
        0,
        0,
        -et,
        0,
        0,
        0
      ]);
      n.nodes.val = l, n.elements.val = f, n.nodeInputs.val = {
        supports: j,
        loads: _e
      }, n.elementInputs.val = {
        thicknesses: p,
        elasticities: u,
        poissonsRatios: b,
        densities: h,
        areas: v,
        momentsOfInertiaY: w,
        momentsOfInertiaZ: a,
        torsionalConstants: s,
        shearModuli: i
      };
      try {
        const t = Math.round(e.use_nonlinear);
        if (t === 2) {
          const o = X[ye][0], r = xt({
            nodes: l,
            elements: f,
            supports: j,
            elementInputs: n.elementInputs.val,
            buildLoads: (Y) => {
              const J = /* @__PURE__ */ new Map(), ee = Le * Y / (H + 1);
              for (let G = 0; G <= H; G++) J.set(X[ye][G], [
                0,
                0,
                -ee,
                0,
                0,
                0
              ]);
              return J;
            },
            Fy: e.Fy,
            trackNode: o,
            trackDof: 2,
            nSteps: Math.round(e.idea_steps),
            maxIterPerStep: Math.round(e.nl_max_iter),
            softeningFactor: 0.9
          });
          n.deformOutputs.val = r.finalDeformOutputs;
          const d = r.finalAnalyzeOutputs, [x, R] = Se(d.vonMises, 90, e.Fy);
          d.colorMapRanges = {
            ...d.colorMapRanges,
            vonMises: [
              x,
              R
            ]
          }, n.analyzeOutputs.val = d, n.__ideaInfo = r, n.__nlInfo = null;
          const I = [
            E + e.L_beam * 0.55,
            -e.bf_beam * 2.5,
            0
          ], A = wt({
            lambdas: r.lambdas,
            displacements: r.displacements,
            firstYieldStep: r.firstYieldStep,
            center: I,
            size: Math.max(e.L_beam * 0.4, 1),
            plane: "xz"
          });
          n.objects3D.val = [
            ...n.objects3D.val,
            ...A
          ], console.log(`[conexion-rbs IDEA] ${r.lambdas.length} pasos | \u03BB_max=${r.ultimateLoadFactor.toFixed(2)} | \u03B4_max=${(r.displacements[r.displacements.length - 1] * 1e3).toFixed(2)}mm | 1er yield en paso ${r.firstYieldStep + 1}/${r.lambdas.length} | k_el\xE1stica=${r.elasticStiffness.toFixed(1)}`);
        } else if (t === 1) {
          const o = Ke({
            nodes: l,
            elements: f,
            nodeInputs: {
              supports: j,
              loads: _e
            },
            elementInputs: n.elementInputs.val,
            Fy: e.Fy,
            maxIter: Math.round(e.nl_max_iter),
            tol: 0.03,
            softeningFactor: 0.9
          });
          n.deformOutputs.val = o.deformOutputs;
          const r = o.analyzeOutputs, [d, x] = Se(r.vonMises, 90, e.Fy);
          r.colorMapRanges = {
            ...r.colorMapRanges,
            vonMises: [
              d,
              x
            ]
          }, n.analyzeOutputs.val = r, n.__nlInfo = {
            iterations: o.iterations,
            converged: o.converged,
            elementsYielded: o.elementsYielded,
            maxRatio: o.maxRatio
          }, n.__ideaInfo = null;
        } else {
          const o = _t(l, f, {
            supports: j,
            loads: _e
          }, n.elementInputs.val);
          n.deformOutputs.val = o;
          const r = ft(l, f, n.elementInputs.val, o), [d, x] = Se(r.vonMises, 90, e.Fy);
          r.colorMapRanges = {
            ...r.colorMapRanges,
            vonMises: [
              d,
              x
            ]
          }, n.analyzeOutputs.val = r, n.__nlInfo = null, n.__ideaInfo = null;
        }
      } catch (t) {
        console.error("[conexion-rbs] solver error:", (t == null ? void 0 : t.message) || t, t), n.deformOutputs.val = {}, n.analyzeOutputs.val = {};
      }
      try {
        const t = pt({
          nodes: l,
          elements: f,
          x_col_face: E,
          d_col: e.d_col,
          bf_col: e.bf_col,
          tf_col: e.tf_col,
          d_beam: e.d_beam,
          bf_beam: e.bf_beam,
          tf_beam: e.tf_beam,
          x_rbs_start: E + T,
          x_rbs_end: E + W,
          weld_tol: e.tf_beam * 1.5
        }), o = (_a = n.analyzeOutputs.val) == null ? void 0 : _a.vonMises;
        if (o) {
          const r = vt(t, o, e.Fy), d = Ft(r), x = St(d);
          if (n.__componentRatios = r, n.__governingComponent = d, n.__failureMode = x, e.colormap_mode > 0.5) {
            const I = /* @__PURE__ */ new Map();
            for (const Y of r) I.set(Y.zone, Y.ratio);
            const A = /* @__PURE__ */ new Map();
            for (let Y = 0; Y < f.length; Y++) {
              const J = t.get(Y), ee = J ? I.get(J) ?? 0 : 0, G = f[Y].length, dt = new Array(G).fill(ee * e.Fy);
              A.set(Y, dt);
            }
            n.analyzeOutputs.val.vonMises = A, n.analyzeOutputs.val.colorMapRanges = {
              ...n.analyzeOutputs.val.colorMapRanges,
              vonMises: [
                0,
                e.Fy
              ]
            };
          }
          const R = zt(l, f, t, (d == null ? void 0 : d.zone) ?? null);
          n.objects3D.val = [
            ...n.objects3D.val,
            ...R
          ];
        }
      } catch (t) {
        console.warn("[conexion-rbs] component analysis skipped:", (t == null ? void 0 : t.message) || t);
      }
      const N = [], Oe = E + $e, Ee = Math.min(e.bf_beam, e.d_beam) * 0.28, tt = new Me(Ee, 20, 16), ot = new te({
        color: 16720384,
        emissive: 6689024,
        metalness: 0.2,
        roughness: 0.5,
        transparent: true,
        opacity: 0.85
      }), ke = new V(tt, ot);
      ke.position.set(Oe, 0, 0), N.push(ke);
      const nt = new He(Ee * 1.25, 0.015, 12, 32), st = new te({
        color: 16755200,
        emissive: 4465152
      }), ve = new V(nt, st);
      ve.position.set(Oe, 0, 0), ve.rotation.y = Math.PI / 2, N.push(ve);
      const Ye = e.weld_type < 0.5 ? 16755200 : e.weld_type < 1.5 ? 16742144 : 16733440, Q = e.weld_type < 0.5 ? e.tf_beam * 0.95 : e.weld_type < 1.5 ? e.tf_beam * 0.6 : e.weld_throat, Be = (t) => {
        const o = new he(Q * 1.1, e.bf_beam, Q * 1.2), r = new te({
          color: Ye,
          emissive: 3346688,
          metalness: 0.7,
          roughness: 0.45
        }), d = new V(o, r);
        return d.position.set(E - Q / 2, 0, t), d;
      };
      N.push(Be(+e.d_beam / 2 - e.tf_beam / 2)), N.push(Be(-e.d_beam / 2 + e.tf_beam / 2));
      const at = e.d_beam - 2 * e.tf_beam - (e.weld_access_hole > 0.5 ? 2 * (e.tf_beam * 1.5) : 0), lt = new he(Q * 1.1, Q * 1.2, at), rt = new te({
        color: Ye,
        emissive: 3346688,
        metalness: 0.7,
        roughness: 0.45
      }), Ge = new V(lt, rt);
      if (Ge.position.set(E - Q / 2, 0, 0), N.push(Ge), e.weld_access_hole > 0.5) {
        const t = e.tf_beam * 1.2;
        for (const o of [
          +e.d_beam / 2 - e.tf_beam - t,
          -e.d_beam / 2 + e.tf_beam + t
        ]) {
          const r = new He(t, 3e-3, 10, 24), d = new te({
            color: 3355443,
            metalness: 0.5,
            roughness: 0.6
          }), x = new V(r, d);
          x.position.set(E + 2e-3, 0, o), x.rotation.y = Math.PI / 2, N.push(x);
        }
      }
      if (e.weld_type < 0.5) {
        const t = new he(0.025, e.bf_beam + 0.02, 0.01), o = new te({
          color: 5588019,
          metalness: 0.3,
          roughness: 0.8
        });
        for (const r of [
          +e.d_beam / 2 - e.tf_beam / 2,
          -e.d_beam / 2 + e.tf_beam / 2
        ]) {
          const d = new V(t, o), x = r > 0 ? -1 : 1;
          d.position.set(E - 0.015, 0, r + x * e.tf_beam * 0.7), N.push(d);
        }
      }
      const Ne = (t) => {
        const o = Re(t), r = E + t, d = [
          new B(r, -o / 2, +e.d_beam / 2 + 5e-3),
          new B(r, +o / 2, +e.d_beam / 2 + 5e-3),
          new B(r, +o / 2, -e.d_beam / 2 - 5e-3),
          new B(r, -o / 2, -e.d_beam / 2 - 5e-3),
          new B(r, -o / 2, +e.d_beam / 2 + 5e-3)
        ], x = new D().setFromPoints(d), R = new O({
          color: 16776960
        });
        return new L(x, R);
      };
      N.push(Ne(T)), N.push(Ne(W)), n.objects3D.val = N;
      const ae = e.classification < 0.5 ? 0.02 : e.classification < 1.5 ? 0.04 : 0.06, ct = ut(e.story_h, Math.round(e.steps_per_cycle), ae), it = e.b_rbs * e.d_beam, mt = e.d_beam / 2 / it, Ve = {
        Fy: e.Fy,
        E: e.E_steel,
        b: e.b_hard,
        R0: 15,
        cR1: 0.925,
        cR2: 0.15
      }, Xe = e.bf_beam * (1 - 2 * e.c_rbs), je = Xe * e.tf_beam * (e.d_beam - e.tf_beam), ue = e.Fy * je, k = [], le = [];
      let Fe = ht(Ve);
      for (const t of ct) {
        const o = t * mt;
        Fe = bt(o, Fe, Ve), k.push(t), le.push(Fe.sigma * je);
      }
      n.__rbsHistory = {
        theta: k,
        M: le,
        Mp: ue,
        targetDrift: ae,
        classification: e.classification < 0.5 ? "IMF" : e.classification < 1.5 ? "SMF" : "Extended"
      };
      const re = Math.max(e.L_beam * 0.6, 1.5), ce = $t({
        theta: k,
        M: le,
        Mp: ue,
        targetDrift: ae,
        center: [
          E + e.L_beam + re * 0.7,
          0,
          0
        ],
        size: re
      }), ie = Ct({
        drifts: k,
        center: [
          E + e.L_beam * 0.5 - re / 2,
          0,
          -e.story_h / 2 - re * 0.7
        ],
        size: re
      });
      n.objects3D.val = [
        ...n.objects3D.val,
        ...ce.objects,
        ...ie.objects
      ], window.__rbsCharts = {
        hyst: ce,
        prot: ie
      }, e.animate_k3 < 0.5 ? (ce.setProgress(k.length - 1), ie.setProgress(k.length - 1), ce.moveCursor(k.length - 1), ie.moveCursor(k.length - 1)) : (ce.setProgress(0), ie.setProgress(0));
      const Te = window.__rbsK3Anim;
      if (Te && (clearInterval(Te), window.__rbsK3Anim = null), e.animate_k3 > 0.5) {
        const t = e.animate_k3 < 1.5 ? 25 : 100, o = Math.max(...k.map((R) => Math.abs(R))), r = e.anim_amp;
        let d = 0;
        const x = window.__rbsCharts;
        setTimeout(() => {
          const I = (() => {
            const ee = document.querySelectorAll("div");
            for (const G of ee) if (G.__settings && G.__ctx) return G;
            return null;
          })();
          if (!I) return;
          const A = I.__settings, Y = I.__ctx;
          if (!(A == null ? void 0 : A.deformScale) || !(Y == null ? void 0 : Y.render)) return;
          A.deformedShape && (A.deformedShape.val = true);
          const J = setInterval(() => {
            var _a2;
            const G = (k[d] ?? 0) / o * r;
            A.deformScale.val = G, (x == null ? void 0 : x.hyst) && (x.hyst.moveCursor(d), x.hyst.setProgress(d)), (x == null ? void 0 : x.prot) && (x.prot.moveCursor(d), x.prot.setProgress(d)), (_a2 = Y.render) == null ? void 0 : _a2.call(Y), d = (d + 1) % k.length;
          }, t);
          window.__rbsK3Anim = J;
        }, 600);
      }
      let be = 0;
      for (let t = 0; t < k.length; t++) Math.abs(k[t] - ae) < 5e-3 && Math.abs(le[t]) > Math.abs(be) && (be = le[t]);
      const We = Math.abs(be) / ue;
      console.log(`[RBS AISC 358-22] Shells=${f.length}, Nodos=${l.length}
  bf_rbs=${Xe.toFixed(3)}m, Mp_rbs=${ue.toFixed(1)} kN\xB7m
  M@${(ae * 100).toFixed(1)}%=${be.toFixed(1)} kN\xB7m \xB7 Ratio=${We.toFixed(3)} \u2192 ${We >= 0.8 ? "PASA" : "FALLA"}`);
    },
    computedLabels(e, n) {
      const l = n.__rbsHistory;
      if (!l) return {
        Status: "\u2014"
      };
      const f = e.bf_beam * (1 - 2 * e.c_rbs), p = f * e.tf_beam * (e.d_beam - e.tf_beam), u = l.Mp, b = l.targetDrift;
      let h = 0;
      for (const a of l.M) Math.abs(a) > Math.abs(h) && (h = a);
      let v = 0;
      for (let a = 0; a < l.theta.length; a++) Math.abs(l.theta[a] - b) < 5e-3 && Math.abs(l.M[a]) > Math.abs(v) && (v = l.M[a]);
      const w = Math.abs(v) / u;
      return {
        "\u2500\u2500 Geometr\xEDa RBS (AISC 358-22 \xA75) \u2500\u2500": "",
        "Clasificaci\xF3n ensayo": l.classification,
        "Target drift \u03B8": `${(b * 100).toFixed(1)} %`,
        "bf pat\xEDn original": `${(e.bf_beam * 1e3).toFixed(0)} mm`,
        "bf pat\xEDn reducido RBS": `${(f * 1e3).toFixed(0)} mm (-${(e.c_rbs * 100 * 2).toFixed(0)}%)`,
        "a (inicio dogbone)": `${(e.a_rbs * e.bf_beam * 1e3).toFixed(0)} mm desde cara col`,
        "b (long. dogbone)": `${(e.b_rbs * e.d_beam * 1e3).toFixed(0)} mm`,
        "c (corte m\xE1x c/lado)": `${(e.c_rbs * e.bf_beam * 1e3).toFixed(0)} mm`,
        Zx_rbs: `${(p * 1e6).toFixed(0)} cm\xB3`,
        Mp_rbs: `${u.toFixed(1)} kN\xB7m`,
        "\u2500\u2500 Protocolo AISC 341 K3 \u2500\u2500": "",
        "M_max en historia": `${Math.abs(h).toFixed(1)} kN\xB7m`,
        "M @ target drift": `${Math.abs(v).toFixed(1)} kN\xB7m`,
        "Ratio M/Mp @ target": `${w.toFixed(3)}`,
        "Criterio (\u2265 0.80)": `${w >= 0.8 ? "\u2713 PASA" : "\u2717 FALLA"} \u2014 ${l.classification}`,
        "Data points generados": `${l.theta.length}`,
        "\u2500\u2500 Soldadura AISC 360 \xA7J2 \u2500\u2500": "",
        ...(() => {
          const a = e.weld_type < 0.5 ? "CJP" : e.weld_type < 1.5 ? "PJP" : "Filete", s = e.weld_type < 0.5 ? e.tf_beam : e.weld_type < 1.5 ? e.tf_beam * 0.7 : e.weld_throat, i = e.electrode_Fexx, F = 0.75, y = e.bf_beam, S = s * y, z = e.weld_type < 0.5 ? e.Fy * e.bf_beam * e.tf_beam : 0.6 * i * S, m = F * z, C = 0.8 * u / Math.max(e.d_beam - e.tf_beam, 0.1), c = C / m, g = i < 44e4 ? "E60XX" : i < 52e4 ? "E70XX" : "E80XX";
          return {
            "Tipo soldadura": a,
            Electrodo: `${g} (Fexx=${(i / 1e3).toFixed(0)} MPa)`,
            "Garganta efectiva": `${(s * 1e3).toFixed(1)} mm`,
            "L cord\xF3n (pat\xEDn)": `${(y * 1e3).toFixed(0)} mm`,
            "Ae (pat\xEDn)": `${(S * 1e6).toFixed(0)} mm\xB2`,
            "Rn cord\xF3n (nominal)": `${z.toFixed(0)} kN`,
            "\u03C6Rn (dise\xF1o)": `${m.toFixed(0)} kN`,
            "F_demand en pat\xEDn (0.8Mp)": `${C.toFixed(0)} kN`,
            "Ratio F/\u03C6Rn": `${c.toFixed(3)} ${c <= 1 ? "\u2713" : "\u2717"}`,
            "Weld access hole": e.weld_access_hole > 0.5 ? "S\xED (AWS D1.8 \xA76.10)" : "No",
            "Dictamen soldadura": e.weld_type < 0.5 ? "CJP \u2713 Demand-critical (AISC 358 \xA73.7)" : c <= 1 ? "\u2713 OK" : "\u2717 REVISAR garganta / electrodo"
          };
        })(),
        ...(() => {
          const a = n.__componentRatios, s = n.__governingComponent, i = n.__failureMode;
          if (!a || a.length === 0) return {};
          const F = {
            "\u2500\u2500 Componentes (\u03C3vm/Fy) tipo IDEA StatiCa \u2500\u2500": ""
          };
          for (const y of a.slice(0, 8)) F[`${y.statusIcon} ${y.label}`] = `${(y.ratio * 100).toFixed(0)}% (${y.nElements} shells)`;
          return s && (F["\u{1F3AF} Componente gobernante"] = s.label), i && (F["\u{1F50E} Modo de falla estimado"] = i), F;
        })(),
        ...(() => {
          const a = n.__ideaInfo, s = n.__nlInfo;
          if (a) {
            const i = a.displacements[a.displacements.length - 1] ?? 0, F = a.lambdas[a.lambdas.length - 1] ?? 0, y = a.firstYieldStep >= 0 ? a.lambdas[a.firstYieldStep] : null, S = a.firstYieldStep >= 0 ? a.displacements[a.firstYieldStep] : null, z = Math.max(...a.vonMisesMax), m = a.elementsYielded[a.elementsYielded.length - 1] ?? 0, M = a.converged.every((C) => C);
            return {
              "\u2500\u2500 IDEA StatiCa (pushover incremental) \u2500\u2500": "",
              "Pasos ejecutados": `${a.lambdas.length}`,
              Convergencia: M ? "\u2713 todos los pasos" : "\u2717 alg\xFAn paso no convergi\xF3",
              "\u03BB inicio fluencia": y !== null ? `${(y * 100).toFixed(0)}% (paso ${a.firstYieldStep + 1})` : "no fluy\xF3",
              "\u03B4 @ 1er yield": S !== null ? `${(S * 1e3).toFixed(2)} mm` : "\u2014",
              "\u03BB final": `${(F * 100).toFixed(0)}%`,
              "\u03B4 final (tip)": `${(i * 1e3).toFixed(2)} mm`,
              "k el\xE1stica (\u03BB/\u03B4)": `${a.elasticStiffness.toFixed(2)} 1/m`,
              "\u03C3vm_max (todo el pushover)": `${(z / 1e3).toFixed(1)} MPa`,
              "\u03C3vm / Fy": `${(z / e.Fy).toFixed(2)}`,
              "Shells plastificados (final)": `${m}`,
              "Modo falla (estimado)": m > 0 ? "RBS (dogbone) \u2014 donde concentra plastificaci\xF3n" : "Rango el\xE1stico (aument\xE1 load_factor)"
            };
          }
          return s ? {
            "\u2500\u2500 Solver FEM shells (NO-LINEAL J2) \u2500\u2500": "",
            "Iteraciones NL": `${s.iterations}${s.converged ? " \u2713 convergi\xF3" : " \u2717 max-iter"}`,
            "Elementos plastificados": `${s.elementsYielded}`,
            "Max \u03C3/Fy (lineal inicial)": s.maxRatio.toFixed(2),
            Interpretaci\u00F3n: s.elementsYielded > 0 ? `${s.elementsYielded} shells fluyeron \u2192 redistribuci\xF3n` : "Rango el\xE1stico (sin plastificar)"
          } : {
            "\u2500\u2500 Solver FEM shells \u2500\u2500": "",
            Tipo: "Lineal el\xE1stico"
          };
        })()
      };
    }
  };
});
export {
  __tla,
  Et as c
};
