import { d as O, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { d as G, a as J, s as V, c as Z } from "./fiberSectionCft-CvKVMF85.js";
let Q;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function j(e) {
    const f = e / 1e3;
    return 4700 * Math.sqrt(f) * 1e3;
  }
  function H(e) {
    const f = e.shape ?? "circular", n = e.t, _ = e.L, o = e.fc, s = e.Fy, c = e.Es ?? 2e8, a = e.rhoSR ?? 0, r = e.K ?? 1;
    let i, d, u, F, M, P, $;
    if (f === "circular") {
      const l = e.D, m = l - 2 * n;
      u = Math.PI * l * l / 4;
      const b = Math.PI * m * m / 4;
      i = u - b, d = b, F = Math.PI / 64 * (Math.pow(l, 4) - Math.pow(m, 4)), M = Math.PI / 64 * Math.pow(m, 4), P = l / n, $ = 0.95;
    } else {
      const l = e.D, m = e.H ?? l;
      u = l * m;
      const b = l - 2 * n, p = m - 2 * n, K = b * p;
      i = u - K, d = K, F = (l * Math.pow(m, 3) - b * Math.pow(p, 3)) / 12, M = b * Math.pow(p, 3) / 12, P = Math.max(l, m) / n, $ = 0.85;
    }
    const C = j(o), I = a * u, L = Math.min(0.7, 0.25 + 3 * (i + I) / u), g = 0.5, x = s * i + $ * o * (d + I * c / C), A = c * F + g * c * 0 + L * C * M, E = c * i + c * I + C * d;
    let D, h, t;
    f === "circular" ? (D = 0.15 * c / s, h = 0.19 * c / s) : (D = 2.26 * Math.sqrt(c / s), h = 3 * Math.sqrt(c / s)), P <= D ? t = "compact" : P <= h ? t = "noncompact" : t = "slender";
    const S = r * _, N = Math.PI * Math.PI * A / (S * S), v = x / N;
    let w;
    v <= 2.25 ? w = x * Math.pow(0.658, v) : w = 0.877 * N;
    const q = s * i + a * s * u;
    let k;
    if (f === "circular") {
      const l = e.D, m = l - 2 * n;
      k = (Math.pow(l, 3) - Math.pow(m, 3)) / 6;
    } else {
      const l = e.D, m = e.H ?? l, b = l - 2 * n, p = m - 2 * n;
      k = (l * m * m - b * p * p) / 4;
    }
    const z = s * k + 0.85 * o * M / (e.D / 2);
    let y;
    if (f === "circular") y = 2 * n * (e.D - n);
    else {
      const l = e.H ?? e.D;
      y = 2 * n * (l - n);
    }
    const B = 0.6 * s * y;
    return {
      As: i,
      Ac: d,
      Ag: u,
      Is: F,
      Ic: M,
      Ec: C,
      Pno: x,
      EI_eff: A,
      EA_eff: E,
      C1: L,
      C2: $,
      C3: g,
      slenderness: t,
      slendernessRatio: P,
      lambda_p: D,
      lambda_r: h,
      Pn: w,
      Pnt: q,
      Mno: z,
      Vn: B,
      lambda_global: v,
      Pe: N
    };
  }
  function T(e, f, n) {
    const _ = H(e), o = 0.75, s = 0.9, c = o * _.Pn, a = s * _.Mno, r = f / c;
    let i, d;
    return r >= 0.2 ? (i = r + 8 / 9 * (n / a), d = "Eq. H1-1a (P/Pc \u2265 0.2)") : (i = r / 2 + n / a, d = "Eq. H1-1b (P/Pc < 0.2)"), {
      ratio: i,
      passes: i <= 1,
      Pc: c,
      Mc: a,
      governing: d
    };
  }
  Q = {
    id: "columna-cft",
    name: "Columna CFT (AISC 360-22 \xA7I2)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 1 GDL Axial",
    hasModal: false,
    params: {
      shape: {
        default: 0,
        label: "Forma",
        options: {
          "Circular HSS": 0,
          "Rectangular HSS": 1
        }
      },
      Dout: {
        default: 0.3,
        min: 0.1,
        max: 0.8,
        step: 0.01,
        label: "D exterior (m)"
      },
      Hrect: {
        default: 0.3,
        min: 0.1,
        max: 0.8,
        step: 0.01,
        label: "H alto rect (m)",
        folder: "Solo rectangular"
      },
      t_tube: {
        default: 0.01,
        min: 4e-3,
        max: 0.025,
        step: 1e-3,
        label: "t tubo (m)"
      },
      L_col: {
        default: 3,
        min: 1.5,
        max: 8,
        step: 0.1,
        label: "L columna (m)"
      },
      K_eff: {
        default: 1,
        min: 0.5,
        max: 2,
        step: 0.1,
        label: "K efectivo (AISC Table C-A-7.1)"
      },
      fc: {
        default: 28e3,
        min: 14e3,
        max: 7e4,
        step: 1e3,
        label: "f'c (kN/m\xB2)",
        folder: "Materiales"
      },
      Fy: {
        default: 345e3,
        min: 25e4,
        max: 45e4,
        step: 5e3,
        label: "Fy acero (kN/m\xB2)",
        folder: "Materiales"
      },
      Pu: {
        default: 2e3,
        min: 0,
        max: 2e4,
        step: 50,
        label: "Pu compresi\xF3n (kN)",
        folder: "Demanda LRFD",
        unitType: "force"
      },
      Mu: {
        default: 150,
        min: 0,
        max: 2e3,
        step: 10,
        label: "Mu flector (kN\xB7m)",
        folder: "Demanda LRFD",
        unitType: "moment"
      }
    },
    defaultShellResult: "none",
    availableShellResults: [],
    build(e, f) {
      const _ = e.L_col, o = [];
      for (let t = 0; t <= 10; t++) o.push([
        0,
        0,
        t / 10 * _
      ]);
      const s = [];
      for (let t = 0; t < 10; t++) s.push([
        t,
        t + 1
      ]);
      const c = e.shape < 0.5 ? "circular" : "rectangular", a = {
        shape: c,
        D: e.Dout,
        H: e.Hrect,
        t: e.t_tube,
        L: e.L_col,
        fc: e.fc,
        Fy: e.Fy,
        K: e.K_eff
      }, r = H(a), i = /* @__PURE__ */ new Map();
      i.set(0, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const d = /* @__PURE__ */ new Map();
      d.set(10, [
        0,
        0,
        -e.Pu,
        e.Mu,
        0,
        0
      ]), f.nodes.val = o, f.elements.val = s, f.nodeInputs.val = {
        supports: i,
        loads: d
      };
      const u = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), x = 2e8, R = r.EA_eff / x, A = r.EI_eff / x, E = 2 * A, D = x / (2 * (1 + 0.3));
      for (let t = 0; t < s.length; t++) u.set(t, R), F.set(t, A), M.set(t, A), P.set(t, E), $.set(t, x), C.set(t, D), I.set(t, 24), L.set(t, e.t_tube), g.set(t, 0.2);
      f.elementInputs.val = {
        areas: u,
        momentsOfInertiaZ: M,
        momentsOfInertiaY: F,
        torsionalConstants: P,
        elasticities: $,
        shearModuli: C,
        densities: I,
        thicknesses: L,
        poissonsRatios: g
      };
      try {
        f.deformOutputs.val = O(o, s, {
          supports: i,
          loads: d
        }, f.elementInputs.val);
      } catch (t) {
        console.error("CFT deform error:", t);
      }
      f.objects3D.val = [];
      const h = T(a, e.Pu, e.Mu);
      console.log(`[CFT ${c}] D=${(e.Dout * 1e3).toFixed(0)}mm t=${(e.t_tube * 1e3).toFixed(1)}mm f'c=${(e.fc / 1e3).toFixed(0)}MPa Fy=${(e.Fy / 1e3).toFixed(0)}MPa
  Pno=${r.Pno.toFixed(0)} kN \xB7 Pn=${r.Pn.toFixed(0)} kN \xB7 Pnt=${r.Pnt.toFixed(0)} kN
  EI_eff=${(r.EI_eff / 1e6).toFixed(1)} MN\xB7m\xB2 \xB7 EA_eff=${(r.EA_eff / 1e6).toFixed(1)} MN
  C1=${r.C1.toFixed(3)} \xB7 C2=${r.C2} \xB7 C3=${r.C3} \xB7 slenderness=${r.slenderness} (ratio ${r.slendernessRatio.toFixed(1)})
  Demand/Capacity ratio = ${h.ratio.toFixed(3)} ${h.passes ? "\u2713 OK" : "\u2717 FAIL"} (${h.governing})`);
    },
    computedLabels(e, f) {
      const n = e.shape < 0.5 ? "circular" : "rectangular", _ = {
        shape: n,
        D: e.Dout,
        H: e.Hrect,
        t: e.t_tube,
        L: e.L_col,
        fc: e.fc,
        Fy: e.Fy,
        K: e.K_eff
      }, o = H(_), s = T(_, e.Pu, e.Mu), c = {
        "\u2500\u2500 Geometr\xEDa CFT \u2500\u2500": "",
        Forma: n,
        "As acero": `${(o.As * 1e4).toFixed(1)} cm\xB2`,
        "Ac concreto": `${(o.Ac * 1e4).toFixed(0)} cm\xB2`,
        "As/Ag": `${(o.As / o.Ag * 100).toFixed(1)} %`,
        "\u2500\u2500 AISC 360-22 \xA7I2.1b \u2500\u2500": "",
        "Pno (compresi\xF3n nominal)": `${o.Pno.toFixed(0)} kN`,
        "Pn (con pandeo global)": `${o.Pn.toFixed(0)} kN`,
        "Pnt (tracci\xF3n)": `${o.Pnt.toFixed(0)} kN`,
        "Mno (flexi\xF3n)": `${o.Mno.toFixed(1)} kN\xB7m`,
        EI_eff: `${(o.EI_eff / 1e6).toFixed(1)} MN\xB7m\xB2`,
        EA_eff: `${(o.EA_eff / 1e6).toFixed(1)} MN`,
        "Factor C1 (concreto)": o.C1.toFixed(3),
        "Factor C2 (confinamiento)": o.C2.toFixed(2),
        "\u2500\u2500 Esbeltez (\xA7I1.4) \u2500\u2500": "",
        [`${n === "circular" ? "D/t" : "b/t"}`]: o.slendernessRatio.toFixed(1),
        "\u03BBp (compact limit)": o.lambda_p.toFixed(1),
        Clasificaci\u00F3n: o.slenderness.toUpperCase(),
        "\u2500\u2500 Verificaci\xF3n \xA7H1.1 \u2500\u2500": "",
        "Pu / Pc (Pc = \u03C6Pn)": `${(e.Pu / s.Pc).toFixed(3)}`,
        "Mu / Mc (Mc = \u03C6Mno)": `${(e.Mu / s.Mc).toFixed(3)}`,
        "Ratio D/C": `${s.ratio.toFixed(3)} ${s.passes ? "\u2713" : "\u2717 FAIL"}`,
        "Ecuaci\xF3n gobernante": s.governing
      };
      try {
        const a = n === "circular" ? G(e.Dout, e.t_tube, e.fc, e.Fy, 32, 8) : J(e.Dout, e.Hrect, e.t_tube, e.fc, e.Fy, 16, 16), { P: r } = V(a, a.mander.ecc, 0), { M: i } = Z(a, e.Pu, 0.02), d = o.Pno, u = Math.abs(r), F = (u - d) / d * 100;
        c["\u2500\u2500 Level 2 (Fiber section Mander) \u2500\u2500"] = "", c["f'cc concreto confinado"] = `${(a.mander.fcc / 1e3).toFixed(1)} MPa (f'c \xD7 ${a.mander.K_conf.toFixed(2)})`, c["\u03B5cc confinado"] = `${(a.mander.ecc * 1e3).toFixed(2)} \u2030 (vs \u03B5co=2\u2030 no confinado)`, c["Pno L2 (fiber)"] = `${u.toFixed(0)} kN`, c["L2 vs L1 diff"] = `${F >= 0 ? "+" : ""}${F.toFixed(1)} %`, c["M @ Pu (fiber)"] = `${Math.abs(i).toFixed(1)} kN\xB7m`, c["Fibras acero \xD7 concreto"] = `${a.fibers.filter((M) => M.kind === "steel").length} \xD7 ${a.fibers.filter((M) => M.kind === "concrete").length}`;
      } catch (a) {
        c["Level 2 fiber error"] = `${a.message}`;
      }
      return c;
    }
  };
});
export {
  __tla,
  Q as c
};
