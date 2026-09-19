import { b as Kt, v as de, V as F, d as Ht, B as Zt } from "./Text-BE1eWO-3.js";
import { a as _e, __tla as __tla_0 } from "./analyze-4AlEzwQI.js";
import { m as ue, d as xe, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { a as Xt } from "./exampleVersion-D1A_5i59.js";
let ze;
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
  const pe = 9.81, C = 25e6, U = 0.2, Me = C / (2 * (1 + U)), Wt = 24 / pe, h = 9.80665, jt = [
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
  function Ut(t) {
    const e = Math.round(t.ks_method ?? 0);
    if (e === 3) return t.ks ?? 2059;
    if (e === 0) return (t.q_adm ?? 20) * h * (t.ks_factor ?? 10.5);
    if (e === 1) {
      const i = t.E_soil ?? 25e3, s = t.nu_soil ?? 0.3, l = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5), n = t.tz ?? 0.3, f = C, m = n ** 3 / 12, y = i * l ** 4 / (f * m);
      return 0.65 * Math.pow(y, 1 / 12) * i / (l * (1 - s ** 2));
    }
    if (e === 2) {
      const i = (t.q_plate ?? 5) * h, l = (t.delta_plate ?? 5) / 1e3, n = i / l, f = t.B_plate ?? 0.3, m = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5);
      return (t.soilGranular ?? 1) >= 0.5 ? n * Math.pow((m + f) / (2 * m), 2) : n * (f / m);
    }
    return 2059;
  }
  let he, ke, Yt, be, Se, ge;
  he = 0.2;
  ke = 0.035;
  Yt = 8;
  be = new Kt({
    color: 16711731,
    linewidth: 2
  });
  Se = new Kt({
    color: 52224,
    linewidth: 2
  });
  ge = 0.04;
  ze = {
    id: "zapata-aislada",
    name: "Zapata Aislada (Ecuador q_adm tonf/m\xB2)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    defaultShellResult: "pressure",
    availableShellResults: [
      "pressure",
      "bendingXX",
      "bendingYY",
      "displacementZ",
      "vonMises"
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
        options: Object.fromEntries(jt.map((t, e) => [
          t.name,
          e
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
        compute: (t) => {
          const e = Math.round(t.ks_method ?? 0);
          let i;
          e === 0 ? i = (t.q_adm ?? 20) * h * (t.ks_factor ?? 10.5) : i = t.ks ?? 2059;
          const s = [
            "Bowles",
            "Vesic",
            "PLT",
            "Manual"
          ][e] || "?";
          return `${i.toFixed(0)} (${s})`;
        }
      },
      {
        after: "ks_factor",
        label: "ks Bowles ref. (kN/m\xB3)",
        compute: (t) => ((t.q_adm ?? 20) * h * (t.ks_factor ?? 10.5)).toFixed(0)
      },
      {
        after: "nu_soil",
        label: "ks Vesic ref. (kN/m\xB3)",
        compute: (t) => {
          const e = t.E_soil ?? 25e3, i = t.nu_soil ?? 0.3, s = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5), n = (t.tz ?? 0.3) ** 3 / 12, f = e * s ** 4 / (C * n);
          return (0.65 * Math.pow(f, 1 / 12) * e / (s * (1 - i ** 2))).toFixed(0);
        }
      },
      {
        after: "B_plate",
        label: "ks Placa ref. (kN/m\xB3)",
        compute: (t) => {
          const e = (t.q_plate ?? 5) * h, i = (t.delta_plate ?? 5) / 1e3, s = e / i, l = t.B_plate ?? 0.3, n = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5);
          return ((t.soilGranular ?? 1) >= 0.5 ? s * Math.pow((n + l) / (2 * n), 2) : s * (l / n)).toFixed(0);
        }
      },
      {
        after: "tz",
        label: "D flexural (kN\xB7m)",
        compute: (t) => {
          const e = t.tz ?? 0.15;
          return (C * e ** 3 / (12 * (1 - U ** 2))).toFixed(1);
        }
      },
      {
        after: "ks",
        label: "\u21B3 ks SAFE (tonf/m\xB3)",
        compute: (t) => ((t.ks ?? 2059) / h).toFixed(2)
      },
      {
        after: "ks",
        label: "k_r Biot",
        compute: (t) => {
          const e = t.tz ?? 0.15, i = t.Lz ?? 2.5, s = t.ks ?? 2059, n = C * e ** 3 / (12 * (1 - U ** 2)) / (s * i ** 4);
          return n.toFixed(3) + (n < 1 ? " FLEX" : " R\xCDG");
        }
      }
    ],
    computedLabels(t, e) {
      var _a, _b;
      const i = (t.q_adm ?? 20) * h, s = t.ks ?? i * (t.ks_factor ?? 10.5), l = t.tz ?? 0.15, n = t.Lz ?? 2.5, f = C * l ** 3 / (12 * (1 - U ** 2)), m = f / (s * n ** 4), y = (t.useSimple ?? 0) >= 0.5, ct = (t.useD ?? 0) >= 0.5, A = (t.useL ?? 0) >= 0.5, rt = (t.useS ?? 0) >= 0.5, H = (t.useFactors ?? 1) >= 0.5, Mt = H ? t.fD ?? 1.2 : 1, ht = H ? t.fL ?? 1.6 : 1, B = H ? t.fS ?? 0 : 1, Y = ct ? 1 : 0, K = A ? 1 : 0, J = rt ? 1 : 0;
      let I = 0;
      y ? I = t.P_simple ?? 0 : I = Y * Mt * (t.P_D ?? 0) + K * ht * (t.P_L ?? 0) + J * B * (t.P_S ?? 0);
      const b = [];
      y ? b.push("Simple") : (ct && b.push("D"), A && b.push("L"), rt && b.push("S"), b.length || b.push("NINGUNO"));
      const mt = b.join("+") + (H && !y ? " (factor)" : "");
      let kt = 0, bt = 0, St = false;
      const T = (_a = e.analyzeOutputs.rawVal) == null ? void 0 : _a.pressure;
      if (T && T.size) {
        let r = 1 / 0, k = -1 / 0;
        for (const G of T.values()) for (const d of G) Number.isFinite(d) && (d < r && (r = d), d > k && (k = d));
        Number.isFinite(r) && (kt = Math.min(0, r), bt = Math.min(0, k), St = r >= -1e-9);
      }
      const Z = 9.80665, X = kt / Z, Ct = bt / Z, gt = Math.abs(X) / (t.q_adm || 1), Q = t.Bz ?? n, W = n * Q * l * 24 / 9.80665, u = I + W, x = (_b = e.deformOutputs.rawVal) == null ? void 0 : _b.deformations;
      let $ = 0, N = 0, et = 0, j = 0, dt = 0;
      if (x && x.size) {
        const r = e.nodes.rawVal, k = n / 2, G = Q / 2;
        let d = 1 / 0;
        for (const [yt, v] of x) {
          const w = r[yt];
          if (!w || Math.abs(w[2]) > 1e-6) continue;
          const S = v[2];
          if (!Number.isFinite(S)) continue;
          S < $ && ($ = S), (S > N || j === 0) && (N = S), j++, dt += Math.abs(S);
          const nt = w[0] - k, ut = w[1] - G, lt = Math.sqrt(nt * nt + ut * ut);
          lt < d && (d = lt, et = S);
        }
      }
      const Lt = n * Q / Math.max(j, 1), Pt = s * Lt * dt, Nt = $ * 1e3, vt = N * 1e3, Dt = et * 1e3, ot = (N - $) * 1e3, _t = Pt / 9.80665, O = e.analyzeOutputs.rawVal;
      let at = 0, p = 0, qt = 0;
      const st = (r) => {
        if (!r) return 0;
        let k = 0;
        for (const G of r.values()) for (const d of G) Number.isFinite(d) && Math.abs(d) > k && (k = Math.abs(d));
        return k;
      };
      return O && (at = st(O.bendingXX), p = st(O.bendingYY), qt = st(O.vonMises)), {
        "Patrones activos": mt,
        "ks (kN/m\xB3)": s.toFixed(0),
        "D (kN\xB7m)": f.toFixed(1),
        "k_r (Biot)": m.toFixed(3) + (m < 1 ? " FLEXIBLE" : " R\xCDGIDA"),
        "P total (tonf)": I.toFixed(2),
        "Peso propio losa (tonf)": W.toFixed(3),
        "P + SW (tonf)": u.toFixed(2) + " \u2190 match con SAFE",
        "q_max (tonf/m\xB2)": X.toFixed(2) + " (compresi\xF3n pico)",
        "q_min (tonf/m\xB2)": Ct.toFixed(2) + " (compresi\xF3n menor)",
        "q/q_adm": St ? "\u26A0 ZAPATA LEVANTADA (sin compresion en ningun nudo)" : gt.toFixed(2) + (gt > 1 ? " \u26A0 EXCEDE" : " \u2713 OK"),
        "\u0394z max losa (mm)": Nt.toFixed(2) + " \u2193 (m\xE1s negativo)",
        "\u0394z centro losa (mm)": Dt.toFixed(2),
        "\u0394z m\xEDn losa (mm)": vt.toFixed(2) + " (esquina/borde)",
        "Asiento diferencial (mm)": ot.toFixed(2) + (ot / Math.max(n, Q) / 1e3 > 1 / 300 ? " \u26A0 excede L/300" : " \u2713 < L/300"),
        "\u03A3Reacc Z (tonf) \u2248": _t.toFixed(2) + (Math.abs(_t - u) / Math.max(u, 1) < 0.1 ? " \u2713 \u2248 P+SW" : " \u26A0 verificar"),
        "|Mxx| max (kN\xB7m/m)": at.toFixed(2),
        "|Myy| max (kN\xB7m/m)": p.toFixed(2),
        "von Mises max (kPa)": qt.toFixed(1)
      };
    },
    onParamChange(t, e) {
      if (t === "soilType") {
        const s = Math.round(e.soilType ?? 0);
        if (s >= 0) {
          const l = jt[s];
          e.q_adm = l.q_adm, e.ks_factor = l.ks_factor, e.su = l.su, e.phi = l.phi, e.gamma = l.gamma, e.N_SPT = l.N_SPT, e.E_soil = l.E_soil, e.ks = Ut(e);
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
      ])).has(t) && Math.round(e.ks_method ?? 0) !== 3 && (e.ks = Ut(e)), t === "combo") {
        const s = Math.round(e.combo ?? 0), l = [
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
        s >= 0 && s < l.length && ([e.fD, e.fL, e.fS] = l[s]);
      }
    },
    build(t, e) {
      var _a;
      const { Lz: i, Bz: s, tz: l, bc: n, Hp: f } = t, m = t.q_adm, y = t.ks_factor, ct = m * h, A = t.ks ?? ct * y, rt = (t.useSimple ?? 0) >= 0.5, H = (t.useD ?? 0) >= 0.5, Mt = (t.useL ?? 0) >= 0.5, ht = (t.useS ?? 0) >= 0.5, B = (t.useFactors ?? 1) >= 0.5, Y = B ? t.fD ?? 1.2 : 1, K = B ? t.fL ?? 1.6 : 1, J = B ? t.fS ?? 0 : 1, I = H ? 1 : 0, b = Mt ? 1 : 0, mt = ht ? 1 : 0, kt = Y, bt = K, St = J;
      let T = 0, Z = 0, X = 0;
      rt ? (T = t.P_simple ?? 0, Z = t.Mx_simple ?? 0, X = t.My_simple ?? 0) : (T = I * Y * (t.P_D ?? 0) + b * K * (t.P_L ?? 0) + mt * J * (t.P_S ?? 0), Z = I * Y * (t.Mx_D ?? 0) + b * K * (t.Mx_L ?? 0) + mt * J * (t.Mx_S ?? 0), X = I * Y * (t.My_D ?? 0) + b * K * (t.My_L ?? 0) + mt * J * (t.My_S ?? 0));
      const Ct = T * h, gt = Z * h, Q = X * h, tt = Math.round(t.nSub), ft = i / 2, W = s / 2, u = [], x = [];
      for (let o = 0; o <= tt; o++) u.push(i * o / tt), x.push(s * o / tt);
      u.includes(ft) || (u.push(ft), u.sort((o, a) => o - a)), x.includes(W) || (x.push(W), x.sort((o, a) => o - a));
      const $ = [], N = [], et = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), Pt = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), vt = /* @__PURE__ */ new Map(), Dt = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), _t = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), at = (o, a, c) => {
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
        for (let c = 0; c < u.length; c++) a.push(at(u[c], x[o], 0));
        p.push(a);
      }
      for (let o = 0; o < x.length - 1; o++) for (let a = 0; a < u.length - 1; a++) {
        const c = N.length;
        N.push([
          p[o][a],
          p[o][a + 1],
          p[o + 1][a + 1],
          p[o + 1][a]
        ]), Lt.set(c, l), et.set(c, C), j.set(c, U), ot.set(c, Wt);
      }
      const qt = at(ft, W, 0), st = at(ft, W, f), r = N.length;
      N.push([
        qt,
        st
      ]), et.set(r, C), j.set(r, U), Dt.set(r, Me), dt.set(r, n * n), Pt.set(r, n ** 4 / 12), Nt.set(r, n ** 4 / 12), vt.set(r, 0.14 * n ** 4), ot.set(r, Wt), _t.set(r, {
        type: "rect",
        b: n,
        h: n
      });
      const k = /* @__PURE__ */ new Map();
      k.set(st, [
        0,
        0,
        -Ct,
        gt,
        Q,
        0
      ]);
      const G = i / tt, d = s / tt, yt = 0.5, v = [], w = [];
      for (let o = 0; o < x.length; o++) for (let a = 0; a < u.length; a++) {
        const c = G * d * (a === 0 || a === u.length - 1 ? 0.5 : 1) * (o === 0 || o === x.length - 1 ? 0.5 : 1), _ = A * c, R = A * c * yt;
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
      const S = A * G * d * 1e-4, nt = p[0][0];
      v.push({
        node: nt,
        dof: 3,
        k: S
      }), v.push({
        node: nt,
        dof: 4,
        k: S
      }), v.push({
        node: nt,
        dof: 5,
        k: S
      }), e.nodes.val = $.map((o) => [
        o[0],
        o[1],
        o[2]
      ]), e.elements.val = N, e.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: k,
        springs: v
      }, e.elementInputs.val = {
        elasticities: et,
        poissonsRatios: j,
        areas: dt,
        momentsOfInertiaY: Pt,
        momentsOfInertiaZ: Nt,
        torsionalConstants: vt,
        shearModuli: Dt,
        thicknesses: Lt,
        densities: ot,
        sectionShapes: _t
      };
      try {
        e.deformOutputs.val = xe(e.nodes.val, e.elements.val, e.nodeInputs.val, e.elementInputs.val, v);
        const o = _e(e.nodes.val, e.elements.val, e.elementInputs.val, e.deformOutputs.val), a = e.deformOutputs.rawVal.deformations, c = /* @__PURE__ */ new Map();
        let _ = 0;
        e.elements.rawVal.forEach((M, q) => {
          if (M.length !== 4) return;
          const E = [];
          for (const Bt of M) {
            const Ft = a == null ? void 0 : a.get(Bt), pt = A * (Ft ? Ft[2] : 0);
            E.push(pt), pt < _ && (_ = pt);
          }
          c.set(q, E);
        });
        const R = _ / h;
        o.pressure = c, e.analyzeOutputs.val = o;
        const g = Math.abs(R);
        let V = 1 / 0;
        c.forEach((M) => {
          for (const q of M) {
            const E = Math.abs(q);
            E < V && (V = E);
          }
        }), Number.isFinite(V) || (V = 0);
        const xt = V / h, wt = g / t.q_adm, it = C * l ** 3 / (12 * (1 - U ** 2)) / (A * i ** 4), L = [];
        rt ? L.push("Simple") : (H && L.push(`D${B ? "\xD7" + kt : ""}`), Mt && L.push(`L${B ? "\xD7" + bt : ""}`), ht && L.push(`S${B ? "\xD7" + St : ""}`), L.length || L.push("\u26A0 NINGUNO activo"));
        const D = L.join(" + ");
        console.log(`[Zapata Aislada]  Patrones activos: ${D}
  Cargas totales: P=${T.toFixed(2)} tonf, Mx=${Z.toFixed(2)} tonf\xB7m, My=${X.toFixed(2)} tonf\xB7m
  Patrones: D(${t.P_D}, ${t.Mx_D}, ${t.My_D}) L(${t.P_L}, ${t.Mx_L}, ${t.My_L}) S(${t.P_S}, ${t.Mx_S}, ${t.My_S})
  q_max (centro) = -${g.toFixed(2)} tonf/m\xB2
  q_min (bordes) = -${xt.toFixed(2)} tonf/m\xB2
  variaci\xF3n = ${((1 - xt / (g || 1)) * 100).toFixed(1)}%
  q_adm = -${t.q_adm} tonf/m\xB2 | ratio q_max/q_adm = ${wt.toFixed(2)}` + (wt > 1 ? " \u26A0 SOBREPASA" : " \u2713 OK") + `
  k_r\xEDgidez = ${it.toFixed(2)} (${it < 1 ? "FLEXIBLE" : "R\xCDGIDA"} \u2014 flexible muestra concentraci\xF3n, r\xEDgida uniforme)`);
      } catch (o) {
        console.error("Solver error zapata aislada:", o);
      }
      const ut = e.deformOutputs.rawVal.deformations;
      let lt = 1e-9;
      for (const o of w) {
        const a = ut == null ? void 0 : ut.get(o);
        a && Number.isFinite(a[2]) && (lt = Math.max(lt, Math.abs(a[2])));
      }
      const At = Yt * 12, Jt = new Set(w), zt = (_a = document.querySelector("#viewer")) == null ? void 0 : _a.__settings, $t = (o, a, c = 1) => {
        const _ = o ? a : 0, g = -(lt * Math.max(_, 1) + he), V = c > 0 ? c : c < 0 ? -1 / c : 1, xt = ke * V, wt = ge * V, Et = [];
        for (const it of w) {
          if (!Jt.has(it)) continue;
          const L = e.nodes.rawVal[it];
          if (!L) continue;
          const D = L[0], M = L[1], q = ut == null ? void 0 : ut.get(it), E = (P) => Number.isFinite(P) ? P : 0, Bt = q ? E(q[0]) : 0, Ft = q ? E(q[1]) : 0, pt = q ? E(q[2]) : 0, Ot = D + Bt * _, Gt = M + Ft * _, Rt = 0 + pt * _, te = Rt - g, It = (P) => [
            D + (Ot - D) * P,
            M + (Gt - M) * P,
            g + te * P
          ], [ee, oe, ae] = It(0), [se, ne, le] = It(0.05), Tt = [
            new F(ee, oe, ae),
            new F(se, ne, le)
          ];
          for (let P = 0; P <= At; P++) {
            const ce = 0.05 + 0.9 * (P / At), [re, me, fe] = It(ce), Vt = 2 * Math.PI * Yt * (P / At);
            Tt.push(new F(re + xt * Math.cos(Vt), me + xt * Math.sin(Vt), fe));
          }
          Tt.push(new F(Ot, Gt, Rt)), Et.push(new Ht(new Zt().setFromPoints(Tt), be));
          const z = wt, ie = [
            new F(D - z, M - z, g),
            new F(D + z, M - z, g),
            new F(D + z, M + z, g),
            new F(D - z, M + z, g),
            new F(D - z, M - z, g)
          ];
          Et.push(new Ht(new Zt().setFromPoints(ie), Se));
        }
        return Et;
      }, Qt = Xt.v;
      zt ? de.derive(() => {
        if (Xt.v !== Qt) return;
        const o = zt.deformedShape.val, a = zt.deformScale.val, c = zt.displayScale.val;
        e.objects3D.val = $t(o, a, c);
      }) : e.objects3D.val = $t(true, 1);
    },
    runModal(t, e, i) {
      var _a, _b;
      const s = e.nodes.val, l = e.elements.val, n = e.nodeInputs.val, f = e.elementInputs.val;
      if (!(!s.length || !l.length || !((_a = f.densities) == null ? void 0 : _a.size))) try {
        const m = ue(s, l, n, f, 12);
        i.render(m, {
          title: `Zapata Aislada ${t.Lz}\xD7${t.Bz}m t=${t.tz}m`,
          properties: [
            `E=25 GPa  \u03BD=0.2  \u03C1=24 kN/m\xB3  col=${t.bc}m  Hp=${t.Hp}m`
          ]
        }), console.log(`[Zapata Modal] f\u2081=${(_b = m.frequencies[0]) == null ? void 0 : _b.toFixed(4)} Hz`);
      } catch (m) {
        console.warn("Modal zapata error:", m.message);
      }
    }
  };
});
export {
  __tla,
  ze as z
};
