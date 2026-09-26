import { b as Ke, v as dt, V as F, d as Xe, B as He } from "./Text-C1TX4d8g.js";
import { a as _t, __tla as __tla_0 } from "./analyze-Bun5MfUS.js";
import { m as ut, d as xt, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { a as Ye } from "./exampleVersion-D1A_5i59.js";
let We, zt;
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
  let pt, C, j, Mt, Ze, h;
  pt = 9.81;
  C = 25e6;
  j = 0.2;
  Mt = C / (2 * (1 + j));
  Ze = 24 / pt;
  h = 9.80665;
  We = [
    {
      name: "Custom",
      q_adm: 20,
      ks_factor: 10.5,
      su: 0,
      phi: 30,
      gamma: 18,
      N_SPT: 20,
      E_soil: 2e4
    },
    {
      name: "Arcilla blanda",
      q_adm: 5,
      ks_factor: 12,
      su: 25,
      phi: 0,
      gamma: 16,
      N_SPT: 3,
      E_soil: 3e3
    },
    {
      name: "Arcilla firme",
      q_adm: 15,
      ks_factor: 11,
      su: 75,
      phi: 0,
      gamma: 18,
      N_SPT: 10,
      E_soil: 15e3
    },
    {
      name: "Arcilla dura",
      q_adm: 30,
      ks_factor: 10,
      su: 150,
      phi: 0,
      gamma: 19,
      N_SPT: 20,
      E_soil: 3e4
    },
    {
      name: "Limo compacto",
      q_adm: 12,
      ks_factor: 10.5,
      su: 40,
      phi: 25,
      gamma: 18,
      N_SPT: 15,
      E_soil: 8e3
    },
    {
      name: "Arena suelta",
      q_adm: 10,
      ks_factor: 14,
      su: 0,
      phi: 28,
      gamma: 16,
      N_SPT: 10,
      E_soil: 1e4
    },
    {
      name: "Arena media",
      q_adm: 20,
      ks_factor: 13,
      su: 0,
      phi: 33,
      gamma: 18,
      N_SPT: 20,
      E_soil: 25e3
    },
    {
      name: "Arena densa",
      q_adm: 40,
      ks_factor: 12,
      su: 0,
      phi: 40,
      gamma: 20,
      N_SPT: 40,
      E_soil: 6e4
    },
    {
      name: "Grava densa",
      q_adm: 60,
      ks_factor: 12,
      su: 0,
      phi: 42,
      gamma: 22,
      N_SPT: 50,
      E_soil: 1e5
    },
    {
      name: "Roca alterada",
      q_adm: 100,
      ks_factor: 15,
      su: 0,
      phi: 45,
      gamma: 22,
      N_SPT: 100,
      E_soil: 5e5
    },
    {
      name: "Roca sana",
      q_adm: 200,
      ks_factor: 20,
      su: 0,
      phi: 50,
      gamma: 25,
      N_SPT: 100,
      E_soil: 2e6
    }
  ];
  function je(e) {
    const t = Math.round(e.ks_method ?? 0);
    if (t === 3) return e.ks ?? 2059;
    if (t === 0) return (e.q_adm ?? 20) * h * (e.ks_factor ?? 10.5);
    if (t === 1) {
      const i = e.E_soil ?? 25e3, s = e.nu_soil ?? 0.3, l = Math.min(e.Lz ?? 1.5, e.Bz ?? 1.5), n = e.tz ?? 0.3, f = C, m = n ** 3 / 12, y = i * l ** 4 / (f * m);
      return 0.65 * Math.pow(y, 1 / 12) * i / (l * (1 - s ** 2));
    }
    if (t === 2) {
      const i = (e.q_plate ?? 5) * h, l = (e.delta_plate ?? 5) / 1e3, n = i / l, f = e.B_plate ?? 0.3, m = Math.min(e.Lz ?? 1.5, e.Bz ?? 1.5);
      return (e.soilGranular ?? 1) >= 0.5 ? n * Math.pow((m + f) / (2 * m), 2) : n * (f / m);
    }
    return 2059;
  }
  let ht, bt, Ue, kt, St, gt;
  ht = 0.2;
  bt = 0.035;
  Ue = 8;
  kt = new Ke({
    color: 16711731,
    linewidth: 2
  });
  St = new Ke({
    color: 52224,
    linewidth: 2
  });
  gt = 0.04;
  zt = {
    id: "zapata-aislada",
    name: "Zapata Aislada (Ecuador q_adm tonf/m\xB2)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    defaultShellResult: "pressure",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    hasModal: true,
    params: {
      Lz: {
        default: 2.5,
        min: 1,
        max: 5,
        step: 0.05,
        label: "Lz (m)"
      },
      Bz: {
        default: 2.5,
        min: 1,
        max: 5,
        step: 0.05,
        label: "Bz (m)"
      },
      tz: {
        default: 0.1,
        min: 0.05,
        max: 1,
        step: 0.05,
        label: "tz (m)"
      },
      bc: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "bc columna (m)"
      },
      Hp: {
        default: 0.5,
        min: 0.3,
        max: 2,
        step: 0.1,
        label: "Hp pedestal (m)"
      },
      soilType: {
        default: 6,
        label: "Tipo de suelo",
        options: Object.fromEntries(We.map((e, t) => [
          e.name,
          t
        ]))
      },
      q_adm: {
        default: 20,
        min: 1,
        max: 200,
        step: 1,
        label: "q_adm (tonf/m\xB2)"
      },
      ks_method: {
        default: 0,
        label: "M\xE9todo ks",
        options: {
          "Bowles 1996 (q_adm \xD7 factor)": 0,
          "Vesic 1973 (E_soil)": 1,
          "Placa de carga (PLT)": 2,
          "Manual (ks directo)": 3
        }
      },
      ks_factor: {
        default: 10.5,
        min: 5,
        max: 200,
        step: 0.5,
        label: "ks_factor Bowles (referencia)"
      },
      nu_soil: {
        default: 0.3,
        min: 0,
        max: 0.5,
        step: 0.01,
        label: "\u03BD_soil Poisson"
      },
      q_plate: {
        default: 5,
        min: 0.5,
        max: 100,
        step: 0.5,
        label: "q_test placa (tonf/m\xB2)"
      },
      delta_plate: {
        default: 5,
        min: 0.1,
        max: 50,
        step: 0.1,
        label: "\u03B4_test placa (mm)"
      },
      B_plate: {
        default: 0.3,
        min: 0.1,
        max: 1,
        step: 0.05,
        label: "B_placa (m)"
      },
      soilGranular: {
        default: 1,
        boolean: true,
        label: "Suelo granular (Terzaghi)"
      },
      ks: {
        default: 2059,
        min: 100,
        max: 2e5,
        step: 10,
        label: "ks (kN/m/m\xB2)"
      },
      su: {
        default: 0,
        min: 0,
        max: 300,
        step: 1,
        label: "su cohesi\xF3n (kPa)"
      },
      phi: {
        default: 33,
        min: 0,
        max: 55,
        step: 1,
        label: "\u03C6 fricci\xF3n (\xB0)"
      },
      gamma: {
        default: 18,
        min: 14,
        max: 26,
        step: 0.5,
        label: "\u03B3 suelo (kN/m\xB3)"
      },
      N_SPT: {
        default: 20,
        min: 0,
        max: 100,
        step: 1,
        label: "N SPT"
      },
      E_soil: {
        default: 25e3,
        min: 1e3,
        max: 2e6,
        step: 1e3,
        label: "E suelo (kPa)"
      },
      useSimple: {
        default: 0,
        boolean: true,
        label: "\u{1F3AF} Usar Carga Simple (ignora D/L/S)",
        folder: "Cargas \u2014 Activar"
      },
      useD: {
        default: 1,
        boolean: true,
        label: "\u2611 Usar Patr\xF3n D (Muerta)",
        folder: "Cargas \u2014 Activar"
      },
      useL: {
        default: 1,
        boolean: true,
        label: "\u2611 Usar Patr\xF3n L (Viva)",
        folder: "Cargas \u2014 Activar"
      },
      useS: {
        default: 0,
        boolean: true,
        label: "\u2610 Usar Patr\xF3n S (Sobrecarga)",
        folder: "Cargas \u2014 Activar"
      },
      useFactors: {
        default: 1,
        boolean: true,
        label: "\xD7 Aplicar factores fD/fL/fS",
        folder: "Cargas \u2014 Activar"
      },
      P_simple: {
        default: 20,
        min: 0,
        max: 100,
        step: 0.5,
        label: "P (tonf)",
        folder: "Cargas \u2014 Simple"
      },
      Mx_simple: {
        default: 1,
        min: -5,
        max: 5,
        step: 0.1,
        label: "Mx (tonf\xB7m)",
        folder: "Cargas \u2014 Simple"
      },
      My_simple: {
        default: 2,
        min: -5,
        max: 5,
        step: 0.1,
        label: "My (tonf\xB7m)",
        folder: "Cargas \u2014 Simple"
      },
      P_D: {
        default: 10,
        min: 0,
        max: 500,
        step: 0.5,
        label: "P (tonf)",
        folder: "Cargas \u2014 Patr\xF3n D (Muerta)"
      },
      Mx_D: {
        default: 0,
        min: -50,
        max: 50,
        step: 0.5,
        label: "Mx (tonf\xB7m)",
        folder: "Cargas \u2014 Patr\xF3n D (Muerta)"
      },
      My_D: {
        default: 0,
        min: -50,
        max: 50,
        step: 0.5,
        label: "My (tonf\xB7m)",
        folder: "Cargas \u2014 Patr\xF3n D (Muerta)"
      },
      P_L: {
        default: 5,
        min: 0,
        max: 500,
        step: 0.5,
        label: "P (tonf)",
        folder: "Cargas \u2014 Patr\xF3n L (Viva)"
      },
      Mx_L: {
        default: 0,
        min: -50,
        max: 50,
        step: 0.5,
        label: "Mx (tonf\xB7m)",
        folder: "Cargas \u2014 Patr\xF3n L (Viva)"
      },
      My_L: {
        default: 0,
        min: -50,
        max: 50,
        step: 0.5,
        label: "My (tonf\xB7m)",
        folder: "Cargas \u2014 Patr\xF3n L (Viva)"
      },
      P_S: {
        default: 0,
        min: 0,
        max: 500,
        step: 0.5,
        label: "P (tonf)",
        folder: "Cargas \u2014 Patr\xF3n S (Sobrec.)"
      },
      Mx_S: {
        default: 0,
        min: -50,
        max: 50,
        step: 0.5,
        label: "Mx (tonf\xB7m)",
        folder: "Cargas \u2014 Patr\xF3n S (Sobrec.)"
      },
      My_S: {
        default: 0,
        min: -50,
        max: 50,
        step: 0.5,
        label: "My (tonf\xB7m)",
        folder: "Cargas \u2014 Patr\xF3n S (Sobrec.)"
      },
      combo: {
        default: 0,
        label: "Combinaci\xF3n (solo modo 5)",
        folder: "Cargas \u2014 Combinaci\xF3n D+L+S",
        options: {
          "1.2D + 1.6L (gravitatoria)": 0,
          "1.4D": 1,
          "1.2D + 1.0L": 2,
          "1.2D + 1.0L + 0.5S": 3,
          "1.2D + 1.6S + 0.5L": 4,
          "Servicio 1.0D + 1.0L": 5,
          "1.0D (solo D)": 6,
          "1.0L (solo L)": 7,
          "1.0S (solo S)": 8,
          "S\xEDsmica 1.2D+1.0L+1.0E": 9,
          "S\xEDsmica 0.9D + 1.0E": 10,
          Custom: 11
        }
      },
      fD: {
        default: 1.2,
        min: -2,
        max: 2,
        step: 0.05,
        label: "factor D",
        folder: "Cargas \u2014 Combinaci\xF3n D+L+S"
      },
      fL: {
        default: 1.6,
        min: -2,
        max: 2,
        step: 0.05,
        label: "factor L",
        folder: "Cargas \u2014 Combinaci\xF3n D+L+S"
      },
      fS: {
        default: 0,
        min: -2,
        max: 2,
        step: 0.05,
        label: "factor S (o E)",
        folder: "Cargas \u2014 Combinaci\xF3n D+L+S"
      },
      nSub: {
        default: 10,
        min: 3,
        max: 16,
        step: 1,
        label: "n subdivisiones"
      }
    },
    inlineComputed: [
      {
        after: "q_adm",
        label: "k_area (kN/m\xB3 activo)",
        compute: (e) => {
          const t = Math.round(e.ks_method ?? 0);
          let i;
          t === 0 ? i = (e.q_adm ?? 20) * h * (e.ks_factor ?? 10.5) : i = e.ks ?? 2059;
          const s = [
            "Bowles",
            "Vesic",
            "PLT",
            "Manual"
          ][t] || "?";
          return `${i.toFixed(0)} (${s})`;
        }
      },
      {
        after: "ks_factor",
        label: "ks Bowles ref. (kN/m\xB3)",
        compute: (e) => ((e.q_adm ?? 20) * h * (e.ks_factor ?? 10.5)).toFixed(0)
      },
      {
        after: "nu_soil",
        label: "ks Vesic ref. (kN/m\xB3)",
        compute: (e) => {
          const t = e.E_soil ?? 25e3, i = e.nu_soil ?? 0.3, s = Math.min(e.Lz ?? 1.5, e.Bz ?? 1.5), n = (e.tz ?? 0.3) ** 3 / 12, f = t * s ** 4 / (C * n);
          return (0.65 * Math.pow(f, 1 / 12) * t / (s * (1 - i ** 2))).toFixed(0);
        }
      },
      {
        after: "B_plate",
        label: "ks Placa ref. (kN/m\xB3)",
        compute: (e) => {
          const t = (e.q_plate ?? 5) * h, i = (e.delta_plate ?? 5) / 1e3, s = t / i, l = e.B_plate ?? 0.3, n = Math.min(e.Lz ?? 1.5, e.Bz ?? 1.5);
          return ((e.soilGranular ?? 1) >= 0.5 ? s * Math.pow((n + l) / (2 * n), 2) : s * (l / n)).toFixed(0);
        }
      },
      {
        after: "tz",
        label: "D flexural (kN\xB7m)",
        compute: (e) => {
          const t = e.tz ?? 0.15;
          return (C * t ** 3 / (12 * (1 - j ** 2))).toFixed(1);
        }
      },
      {
        after: "ks",
        label: "\u21B3 ks SAFE (tonf/m\xB3)",
        compute: (e) => ((e.ks ?? 2059) / h).toFixed(2)
      },
      {
        after: "ks",
        label: "k_r Biot",
        compute: (e) => {
          const t = e.tz ?? 0.15, i = e.Lz ?? 2.5, s = e.ks ?? 2059, n = C * t ** 3 / (12 * (1 - j ** 2)) / (s * i ** 4);
          return n.toFixed(3) + (n < 1 ? " FLEX" : " R\xCDG");
        }
      }
    ],
    computedLabels(e, t) {
      var _a, _b;
      const i = (e.q_adm ?? 20) * h, s = e.ks ?? i * (e.ks_factor ?? 10.5), l = e.tz ?? 0.15, n = e.Lz ?? 2.5, f = C * l ** 3 / (12 * (1 - j ** 2)), m = f / (s * n ** 4), y = (e.useSimple ?? 0) >= 0.5, ce = (e.useD ?? 0) >= 0.5, A = (e.useL ?? 0) >= 0.5, re = (e.useS ?? 0) >= 0.5, X = (e.useFactors ?? 1) >= 0.5, Me = X ? e.fD ?? 1.2 : 1, he = X ? e.fL ?? 1.6 : 1, B = X ? e.fS ?? 0 : 1, U = ce ? 1 : 0, K = A ? 1 : 0, J = re ? 1 : 0;
      let I = 0;
      y ? I = e.P_simple ?? 0 : I = U * Me * (e.P_D ?? 0) + K * he * (e.P_L ?? 0) + J * B * (e.P_S ?? 0);
      const k = [];
      y ? k.push("Simple") : (ce && k.push("D"), A && k.push("L"), re && k.push("S"), k.length || k.push("NINGUNO"));
      const me = k.join("+") + (X && !y ? " (factor)" : "");
      let be = 0, ke = 0, Se = false;
      const T = (_a = t.analyzeOutputs.rawVal) == null ? void 0 : _a.pressure;
      if (T && T.size) {
        let r = 1 / 0, b = -1 / 0;
        for (const G of T.values()) for (const d of G) Number.isFinite(d) && (d < r && (r = d), d > b && (b = d));
        Number.isFinite(r) && (be = Math.min(0, r), ke = Math.min(0, b), Se = r >= -1e-9);
      }
      const H = 9.80665, Y = be / H, Ce = ke / H, ge = Math.abs(Y) / (e.q_adm || 1), Q = e.Bz ?? n, Z = n * Q * l * 24 / 9.80665, u = I + Z, x = (_b = t.deformOutputs.rawVal) == null ? void 0 : _b.deformations;
      let $ = 0, N = 0, te = 0, W = 0, de = 0;
      if (x && x.size) {
        const r = t.nodes.rawVal, b = n / 2, G = Q / 2;
        let d = 1 / 0;
        for (const [ye, v] of x) {
          const w = r[ye];
          if (!w || Math.abs(w[2]) > 1e-6) continue;
          const S = v[2];
          if (!Number.isFinite(S)) continue;
          S < $ && ($ = S), (S > N || W === 0) && (N = S), W++, de += Math.abs(S);
          const ne = w[0] - b, ue = w[1] - G, le = Math.sqrt(ne * ne + ue * ue);
          le < d && (d = le, te = S);
        }
      }
      const Pe = n * Q / Math.max(W, 1), Le = s * Pe * de, Ne = $ * 1e3, ve = N * 1e3, De = te * 1e3, oe = (N - $) * 1e3, _e = Le / 9.80665, O = t.analyzeOutputs.rawVal;
      let ae = 0, p = 0, qe = 0;
      const se = (r) => {
        if (!r) return 0;
        let b = 0;
        for (const G of r.values()) for (const d of G) Number.isFinite(d) && Math.abs(d) > b && (b = Math.abs(d));
        return b;
      };
      return O && (ae = se(O.bendingXX), p = se(O.bendingYY), qe = se(O.vonMises)), {
        "Patrones activos": me,
        "ks (kN/m\xB3)": s.toFixed(0),
        "D (kN\xB7m)": f.toFixed(1),
        "k_r (Biot)": m.toFixed(3) + (m < 1 ? " FLEXIBLE" : " R\xCDGIDA"),
        "P total (tonf)": I.toFixed(2),
        "Peso propio losa (tonf)": Z.toFixed(3),
        "P + SW (tonf)": u.toFixed(2) + " \u2190 match con SAFE",
        "q_max (tonf/m\xB2)": Y.toFixed(2) + " (compresi\xF3n pico)",
        "q_min (tonf/m\xB2)": Ce.toFixed(2) + " (compresi\xF3n menor)",
        "q/q_adm": Se ? "\u26A0 ZAPATA LEVANTADA (sin compresion en ningun nudo)" : ge.toFixed(2) + (ge > 1 ? " \u26A0 EXCEDE" : " \u2713 OK"),
        "\u0394z max losa (mm)": Ne.toFixed(2) + " \u2193 (m\xE1s negativo)",
        "\u0394z centro losa (mm)": De.toFixed(2),
        "\u0394z m\xEDn losa (mm)": ve.toFixed(2) + " (esquina/borde)",
        "Asiento diferencial (mm)": oe.toFixed(2) + (oe / Math.max(n, Q) / 1e3 > 1 / 300 ? " \u26A0 excede L/300" : " \u2713 < L/300"),
        "\u03A3Reacc Z (tonf) \u2248": _e.toFixed(2) + (Math.abs(_e - u) / Math.max(u, 1) < 0.1 ? " \u2713 \u2248 P+SW" : " \u26A0 verificar"),
        "|Mxx| max (kN\xB7m/m)": ae.toFixed(2),
        "|Myy| max (kN\xB7m/m)": p.toFixed(2),
        "von Mises max (kPa)": qe.toFixed(1)
      };
    },
    onParamChange(e, t) {
      if (e === "soilType") {
        const s = Math.round(t.soilType ?? 0);
        if (s >= 0) {
          const l = We[s];
          t.q_adm = l.q_adm, t.ks_factor = l.ks_factor, t.su = l.su, t.phi = l.phi, t.gamma = l.gamma, t.N_SPT = l.N_SPT, t.E_soil = l.E_soil, t.ks = je(t);
        }
      }
      if ((/* @__PURE__ */ new Set([
        "ks_method",
        "q_adm",
        "ks_factor",
        "E_soil",
        "nu_soil",
        "Lz",
        "tz",
        "q_plate",
        "delta_plate",
        "B_plate",
        "soilGranular"
      ])).has(e) && Math.round(t.ks_method ?? 0) !== 3 && (t.ks = je(t)), e === "combo") {
        const s = Math.round(t.combo ?? 0), l = [
          [
            1.2,
            1.6,
            0
          ],
          [
            1.4,
            0,
            0
          ],
          [
            1.2,
            1,
            0
          ],
          [
            1.2,
            1,
            0.5
          ],
          [
            1.2,
            0.5,
            1.6
          ],
          [
            1,
            1,
            0
          ],
          [
            1,
            0,
            0
          ],
          [
            0,
            1,
            0
          ],
          [
            0,
            0,
            1
          ],
          [
            1.2,
            1,
            1
          ],
          [
            0.9,
            0,
            1
          ]
        ];
        s >= 0 && s < l.length && ([t.fD, t.fL, t.fS] = l[s]);
      }
    },
    build(e, t) {
      var _a;
      const { Lz: i, Bz: s, tz: l, bc: n, Hp: f } = e, m = e.q_adm, y = e.ks_factor, ce = m * h, A = e.ks ?? ce * y, re = (e.useSimple ?? 0) >= 0.5, X = (e.useD ?? 0) >= 0.5, Me = (e.useL ?? 0) >= 0.5, he = (e.useS ?? 0) >= 0.5, B = (e.useFactors ?? 1) >= 0.5, U = B ? e.fD ?? 1.2 : 1, K = B ? e.fL ?? 1.6 : 1, J = B ? e.fS ?? 0 : 1, I = X ? 1 : 0, k = Me ? 1 : 0, me = he ? 1 : 0, be = U, ke = K, Se = J;
      let T = 0, H = 0, Y = 0;
      re ? (T = e.P_simple ?? 0, H = e.Mx_simple ?? 0, Y = e.My_simple ?? 0) : (T = I * U * (e.P_D ?? 0) + k * K * (e.P_L ?? 0) + me * J * (e.P_S ?? 0), H = I * U * (e.Mx_D ?? 0) + k * K * (e.Mx_L ?? 0) + me * J * (e.Mx_S ?? 0), Y = I * U * (e.My_D ?? 0) + k * K * (e.My_L ?? 0) + me * J * (e.My_S ?? 0));
      const Ce = T * h, ge = H * h, Q = Y * h, ee = Math.round(e.nSub), fe = i / 2, Z = s / 2, u = [], x = [];
      for (let o = 0; o <= ee; o++) u.push(i * o / ee), x.push(s * o / ee);
      u.includes(fe) || (u.push(fe), u.sort((o, a) => o - a)), x.includes(Z) || (x.push(Z), x.sort((o, a) => o - a));
      const $ = [], N = [], te = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), Pe = /* @__PURE__ */ new Map(), Le = /* @__PURE__ */ new Map(), Ne = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), De = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), ae = (o, a, c) => {
        const _ = `${o.toFixed(4)},${a.toFixed(4)},${c.toFixed(4)}`;
        if (O.has(_)) return O.get(_);
        const R = $.length;
        return $.push([
          o,
          a,
          c
        ]), O.set(_, R), R;
      }, p = [];
      for (let o = 0; o < x.length; o++) {
        const a = [];
        for (let c = 0; c < u.length; c++) a.push(ae(u[c], x[o], 0));
        p.push(a);
      }
      for (let o = 0; o < x.length - 1; o++) for (let a = 0; a < u.length - 1; a++) {
        const c = N.length;
        N.push([
          p[o][a],
          p[o][a + 1],
          p[o + 1][a + 1],
          p[o + 1][a]
        ]), Pe.set(c, l), te.set(c, C), W.set(c, j), oe.set(c, Ze);
      }
      const qe = ae(fe, Z, 0), se = ae(fe, Z, f), r = N.length;
      N.push([
        qe,
        se
      ]), te.set(r, C), W.set(r, j), De.set(r, Mt), de.set(r, n * n), Le.set(r, n ** 4 / 12), Ne.set(r, n ** 4 / 12), ve.set(r, 0.14 * n ** 4), oe.set(r, Ze), _e.set(r, {
        type: "rect",
        b: n,
        h: n
      });
      const b = /* @__PURE__ */ new Map();
      b.set(se, [
        0,
        0,
        -Ce,
        ge,
        Q,
        0
      ]);
      const G = i / ee, d = s / ee, ye = 0.5, v = [], w = [];
      for (let o = 0; o < x.length; o++) for (let a = 0; a < u.length; a++) {
        const c = G * d * (a === 0 || a === u.length - 1 ? 0.5 : 1) * (o === 0 || o === x.length - 1 ? 0.5 : 1), _ = A * c, R = A * c * ye;
        v.push({
          node: p[o][a],
          dof: 0,
          k: R
        }), v.push({
          node: p[o][a],
          dof: 1,
          k: R
        }), v.push({
          node: p[o][a],
          dof: 2,
          k: _
        }), w.push(p[o][a]);
      }
      const S = A * G * d * 1e-4, ne = p[0][0];
      v.push({
        node: ne,
        dof: 3,
        k: S
      }), v.push({
        node: ne,
        dof: 4,
        k: S
      }), v.push({
        node: ne,
        dof: 5,
        k: S
      }), t.nodes.val = $.map((o) => [
        o[0],
        o[1],
        o[2]
      ]), t.elements.val = N, t.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: b,
        springs: v
      }, t.elementInputs.val = {
        elasticities: te,
        poissonsRatios: W,
        areas: de,
        momentsOfInertiaY: Le,
        momentsOfInertiaZ: Ne,
        torsionalConstants: ve,
        shearModuli: De,
        thicknesses: Pe,
        densities: oe,
        sectionShapes: _e
      };
      try {
        t.deformOutputs.val = xt(t.nodes.val, t.elements.val, t.nodeInputs.val, t.elementInputs.val, v);
        const o = _t(t.nodes.val, t.elements.val, t.elementInputs.val, t.deformOutputs.val), a = t.deformOutputs.rawVal.deformations, c = /* @__PURE__ */ new Map();
        let _ = 0;
        t.elements.rawVal.forEach((M, q) => {
          if (M.length !== 4) return;
          const E = [];
          for (const Be of M) {
            const Fe = a == null ? void 0 : a.get(Be), pe = A * (Fe ? Fe[2] : 0);
            E.push(pe), pe < _ && (_ = pe);
          }
          c.set(q, E);
        });
        const R = _ / h;
        o.pressure = c, t.analyzeOutputs.val = o;
        const g = Math.abs(R);
        let V = 1 / 0;
        c.forEach((M) => {
          for (const q of M) {
            const E = Math.abs(q);
            E < V && (V = E);
          }
        }), Number.isFinite(V) || (V = 0);
        const xe = V / h, we = g / e.q_adm, ie = C * l ** 3 / (12 * (1 - j ** 2)) / (A * i ** 4), P = [];
        re ? P.push("Simple") : (X && P.push(`D${B ? "\xD7" + be : ""}`), Me && P.push(`L${B ? "\xD7" + ke : ""}`), he && P.push(`S${B ? "\xD7" + Se : ""}`), P.length || P.push("\u26A0 NINGUNO activo"));
        const D = P.join(" + ");
        console.log(`[Zapata Aislada]  Patrones activos: ${D}
  Cargas totales: P=${T.toFixed(2)} tonf, Mx=${H.toFixed(2)} tonf\xB7m, My=${Y.toFixed(2)} tonf\xB7m
  Patrones: D(${e.P_D}, ${e.Mx_D}, ${e.My_D}) L(${e.P_L}, ${e.Mx_L}, ${e.My_L}) S(${e.P_S}, ${e.Mx_S}, ${e.My_S})
  q_max (centro) = -${g.toFixed(2)} tonf/m\xB2
  q_min (bordes) = -${xe.toFixed(2)} tonf/m\xB2
  variaci\xF3n = ${((1 - xe / (g || 1)) * 100).toFixed(1)}%
  q_adm = -${e.q_adm} tonf/m\xB2 | ratio q_max/q_adm = ${we.toFixed(2)}` + (we > 1 ? " \u26A0 SOBREPASA" : " \u2713 OK") + `
  k_r\xEDgidez = ${ie.toFixed(2)} (${ie < 1 ? "FLEXIBLE" : "R\xCDGIDA"} \u2014 flexible muestra concentraci\xF3n, r\xEDgida uniforme)`);
      } catch (o) {
        console.error("Solver error zapata aislada:", o);
      }
      const ue = t.deformOutputs.rawVal.deformations;
      let le = 1e-9;
      for (const o of w) {
        const a = ue == null ? void 0 : ue.get(o);
        a && Number.isFinite(a[2]) && (le = Math.max(le, Math.abs(a[2])));
      }
      const Ae = Ue * 12, Je = new Set(w), ze = (_a = document.querySelector("#viewer")) == null ? void 0 : _a.__settings, $e = (o, a, c = 1) => {
        const _ = o ? a : 0, g = -(le * Math.max(_, 1) + ht), V = c > 0 ? c : c < 0 ? -1 / c : 1, xe = bt * V, we = gt * V, Ee = [];
        for (const ie of w) {
          if (!Je.has(ie)) continue;
          const P = t.nodes.rawVal[ie];
          if (!P) continue;
          const D = P[0], M = P[1], q = ue == null ? void 0 : ue.get(ie), E = (L) => Number.isFinite(L) ? L : 0, Be = q ? E(q[0]) : 0, Fe = q ? E(q[1]) : 0, pe = q ? E(q[2]) : 0, Oe = D + Be * _, Ge = M + Fe * _, Re = 0 + pe * _, et = Re - g, Ie = (L) => [
            D + (Oe - D) * L,
            M + (Ge - M) * L,
            g + et * L
          ], [tt, ot, at] = Ie(0), [st, nt, lt] = Ie(0.05), Te = [
            new F(tt, ot, at),
            new F(st, nt, lt)
          ];
          for (let L = 0; L <= Ae; L++) {
            const ct = 0.05 + 0.9 * (L / Ae), [rt, mt, ft] = Ie(ct), Ve = 2 * Math.PI * Ue * (L / Ae);
            Te.push(new F(rt + xe * Math.cos(Ve), mt + xe * Math.sin(Ve), ft));
          }
          Te.push(new F(Oe, Ge, Re)), Ee.push(new Xe(new He().setFromPoints(Te), kt));
          const z = we, it = [
            new F(D - z, M - z, g),
            new F(D + z, M - z, g),
            new F(D + z, M + z, g),
            new F(D - z, M + z, g),
            new F(D - z, M - z, g)
          ];
          Ee.push(new Xe(new He().setFromPoints(it), St));
        }
        return Ee;
      }, Qe = Ye.v;
      ze ? dt.derive(() => {
        if (Ye.v !== Qe) return;
        const o = ze.deformedShape.val, a = ze.deformScale.val, c = ze.displayScale.val;
        t.objects3D.val = $e(o, a, c);
      }) : t.objects3D.val = $e(true, 1);
    },
    runModal(e, t, i) {
      var _a, _b;
      const s = t.nodes.val, l = t.elements.val, n = t.nodeInputs.val, f = t.elementInputs.val;
      if (!(!s.length || !l.length || !((_a = f.densities) == null ? void 0 : _a.size))) try {
        const m = ut(s, l, n, f, 12);
        i.render(m, {
          title: `Zapata Aislada ${e.Lz}\xD7${e.Bz}m t=${e.tz}m`,
          properties: [
            `E=25 GPa  \u03BD=0.2  \u03C1=24 kN/m\xB3  col=${e.bc}m  Hp=${e.Hp}m`
          ]
        }), console.log(`[Zapata Modal] f\u2081=${(_b = m.frequencies[0]) == null ? void 0 : _b.toFixed(4)} Hz`);
      } catch (m) {
        console.warn("Modal zapata error:", m.message);
      }
    }
  };
});
export {
  We as S,
  __tla,
  zt as z
};
