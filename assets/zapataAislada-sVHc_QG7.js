import { a as Kt, v as de, V as E, d as Ht, B as Zt } from "./theme-Dxpmbnyd.js";
import { a as _e } from "./analyze-DgLgRmKg.js";
import { m as ue, d as xe, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { a as Xt } from "./exampleVersion-D1A_5i59.js";
let ze;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const Me = 9.81, F = 25e6, U = 0.2, he = F / (2 * (1 + U)), Wt = 24 / Me, k = 9.80665, jt = [
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
    if (e === 0) return (t.q_adm ?? 20) * k * (t.ks_factor ?? 10.5);
    if (e === 1) {
      const i = t.E_soil ?? 25e3, s = t.nu_soil ?? 0.3, l = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5), n = t.tz ?? 0.3, f = F, m = n ** 3 / 12, C = i * l ** 4 / (f * m);
      return 0.65 * Math.pow(C, 1 / 12) * i / (l * (1 - s ** 2));
    }
    if (e === 2) {
      const i = (t.q_plate ?? 5) * k, l = (t.delta_plate ?? 5) / 1e3, n = i / l, f = t.B_plate ?? 0.3, m = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5);
      return (t.soilGranular ?? 1) >= 0.5 ? n * Math.pow((m + f) / (2 * m), 2) : n * (f / m);
    }
    return 2059;
  }
  let pe, ke, Yt, be, Se, ge;
  pe = 0.2;
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
          e === 0 ? i = (t.q_adm ?? 20) * k * (t.ks_factor ?? 10.5) : i = t.ks ?? 2059;
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
        compute: (t) => ((t.q_adm ?? 20) * k * (t.ks_factor ?? 10.5)).toFixed(0)
      },
      {
        after: "nu_soil",
        label: "ks Vesic ref. (kN/m\xB3)",
        compute: (t) => {
          const e = t.E_soil ?? 25e3, i = t.nu_soil ?? 0.3, s = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5), n = (t.tz ?? 0.3) ** 3 / 12, f = e * s ** 4 / (F * n);
          return (0.65 * Math.pow(f, 1 / 12) * e / (s * (1 - i ** 2))).toFixed(0);
        }
      },
      {
        after: "B_plate",
        label: "ks Placa ref. (kN/m\xB3)",
        compute: (t) => {
          const e = (t.q_plate ?? 5) * k, i = (t.delta_plate ?? 5) / 1e3, s = e / i, l = t.B_plate ?? 0.3, n = Math.min(t.Lz ?? 1.5, t.Bz ?? 1.5);
          return ((t.soilGranular ?? 1) >= 0.5 ? s * Math.pow((n + l) / (2 * n), 2) : s * (l / n)).toFixed(0);
        }
      },
      {
        after: "tz",
        label: "D flexural (kN\xB7m)",
        compute: (t) => {
          const e = t.tz ?? 0.15;
          return (F * e ** 3 / (12 * (1 - U ** 2))).toFixed(1);
        }
      },
      {
        after: "ks",
        label: "\u21B3 ks SAFE (tonf/m\xB3)",
        compute: (t) => ((t.ks ?? 2059) / k).toFixed(2)
      },
      {
        after: "ks",
        label: "k_r Biot",
        compute: (t) => {
          const e = t.tz ?? 0.15, i = t.Lz ?? 2.5, s = t.ks ?? 2059, n = F * e ** 3 / (12 * (1 - U ** 2)) / (s * i ** 4);
          return n.toFixed(3) + (n < 1 ? " FLEX" : " R\xCDG");
        }
      }
    ],
    computedLabels(t, e) {
      var _a, _b;
      const i = (t.q_adm ?? 20) * k, s = t.ks ?? i * (t.ks_factor ?? 10.5), l = t.tz ?? 0.15, n = t.Lz ?? 2.5, f = F * l ** 3 / (12 * (1 - U ** 2)), m = f / (s * n ** 4), C = (t.useSimple ?? 0) >= 0.5, mt = (t.useD ?? 0) >= 0.5, y = (t.useL ?? 0) >= 0.5, ft = (t.useS ?? 0) >= 0.5, R = (t.useFactors ?? 1) >= 0.5, kt = R ? t.fD ?? 1.2 : 1, bt = R ? t.fL ?? 1.6 : 1, B = R ? t.fS ?? 0 : 1, Y = mt ? 1 : 0, K = y ? 1 : 0, J = ft ? 1 : 0;
      let I = 0;
      C ? I = t.P_simple ?? 0 : I = Y * kt * (t.P_D ?? 0) + K * bt * (t.P_L ?? 0) + J * B * (t.P_S ?? 0);
      const S = [];
      C ? S.push("Simple") : (mt && S.push("D"), y && S.push("L"), ft && S.push("S"), S.length || S.push("NINGUNO"));
      const dt = S.join("+") + (R && !C ? " (factor)" : "");
      let _t = 0, V = 0;
      const Q = (_a = e.analyzeOutputs.rawVal) == null ? void 0 : _a.pressure;
      if (Q && Q.size) {
        for (const r of Q.values()) for (const _ of r) _ < _t && (_t = _), (_ < V || V === 0) && (V = _);
        let g = 1 / 0;
        for (const r of Q.values()) for (const _ of r) Math.abs(_) < g && (g = Math.abs(_));
        V = -g;
      }
      const H = 9.80665, Z = _t / H, tt = V / H, St = Math.abs(Z) / (t.q_adm || 1), et = t.Bz ?? n, X = n * et * l * 24 / 9.80665, T = I + X, x = (_b = e.deformOutputs.rawVal) == null ? void 0 : _b.deformations;
      let d = 0, A = 0, $ = 0, W = 0, at = 0;
      if (x && x.size) {
        const g = e.nodes.rawVal, r = n / 2, _ = et / 2;
        let z = 1 / 0;
        for (const [qt, Ft] of x) {
          const h = g[qt];
          if (!h || Math.abs(h[2]) > 1e-6) continue;
          const b = Ft[2];
          if (!Number.isFinite(b)) continue;
          b < d && (d = b), (b > A || W === 0) && (A = b), W++, at += Math.abs(b);
          const it = h[0] - r, ct = h[1] - _, Mt = Math.sqrt(it * it + ct * ct);
          Mt < z && (z = Mt, $ = b);
        }
      }
      const gt = n * et / Math.max(W, 1), Lt = s * gt * at, Pt = d * 1e3, Nt = A * 1e3, vt = $ * 1e3, ut = (A - d) * 1e3, st = Lt / 9.80665, j = e.analyzeOutputs.rawVal;
      let nt = 0, lt = 0, M = 0;
      const xt = (g) => {
        if (!g) return 0;
        let r = 0;
        for (const _ of g.values()) for (const z of _) Number.isFinite(z) && Math.abs(z) > r && (r = Math.abs(z));
        return r;
      };
      return j && (nt = xt(j.bendingXX), lt = xt(j.bendingYY), M = xt(j.vonMises)), {
        "Patrones activos": dt,
        "ks (kN/m\xB3)": s.toFixed(0),
        "D (kN\xB7m)": f.toFixed(1),
        "k_r (Biot)": m.toFixed(3) + (m < 1 ? " FLEXIBLE" : " R\xCDGIDA"),
        "P total (tonf)": I.toFixed(2),
        "Peso propio losa (tonf)": X.toFixed(3),
        "P + SW (tonf)": T.toFixed(2) + " \u2190 match con SAFE",
        "q_max (tonf/m\xB2)": Z.toFixed(2) + " (compresi\xF3n pico)",
        "q_min (tonf/m\xB2)": tt.toFixed(2) + " (compresi\xF3n menor)",
        "q/q_adm": St.toFixed(2) + (St > 1 ? " \u26A0 EXCEDE" : " \u2713 OK"),
        "\u0394z max losa (mm)": Pt.toFixed(2) + " \u2193 (m\xE1s negativo)",
        "\u0394z centro losa (mm)": vt.toFixed(2),
        "\u0394z m\xEDn losa (mm)": Nt.toFixed(2) + " (esquina/borde)",
        "Asiento diferencial (mm)": ut.toFixed(2) + (ut / Math.max(n, et) / 1e3 > 1 / 300 ? " \u26A0 excede L/300" : " \u2713 < L/300"),
        "\u03A3Reacc Z (tonf) \u2248": st.toFixed(2) + (Math.abs(st - T) / Math.max(T, 1) < 0.1 ? " \u2713 \u2248 P+SW" : " \u26A0 verificar"),
        "|Mxx| max (kN\xB7m/m)": nt.toFixed(2),
        "|Myy| max (kN\xB7m/m)": lt.toFixed(2),
        "von Mises max (kPa)": M.toFixed(1)
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
      const { Lz: i, Bz: s, tz: l, bc: n, Hp: f } = t, m = t.q_adm, C = t.ks_factor, mt = m * k, y = t.ks ?? mt * C, ft = (t.useSimple ?? 0) >= 0.5, R = (t.useD ?? 0) >= 0.5, kt = (t.useL ?? 0) >= 0.5, bt = (t.useS ?? 0) >= 0.5, B = (t.useFactors ?? 1) >= 0.5, Y = B ? t.fD ?? 1.2 : 1, K = B ? t.fL ?? 1.6 : 1, J = B ? t.fS ?? 0 : 1, I = R ? 1 : 0, S = kt ? 1 : 0, dt = bt ? 1 : 0, _t = Y, V = K, Q = J;
      let H = 0, Z = 0, tt = 0;
      ft ? (H = t.P_simple ?? 0, Z = t.Mx_simple ?? 0, tt = t.My_simple ?? 0) : (H = I * Y * (t.P_D ?? 0) + S * K * (t.P_L ?? 0) + dt * J * (t.P_S ?? 0), Z = I * Y * (t.Mx_D ?? 0) + S * K * (t.Mx_L ?? 0) + dt * J * (t.Mx_S ?? 0), tt = I * Y * (t.My_D ?? 0) + S * K * (t.My_L ?? 0) + dt * J * (t.My_S ?? 0));
      const St = H * k, et = Z * k, At = tt * k, ot = Math.round(t.nSub), X = i / 2, T = s / 2, x = [], d = [];
      for (let o = 0; o <= ot; o++) x.push(i * o / ot), d.push(s * o / ot);
      x.includes(X) || (x.push(X), x.sort((o, a) => o - a)), d.includes(T) || (d.push(T), d.sort((o, a) => o - a));
      const A = [], $ = [], W = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), gt = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), Pt = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), vt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), nt = /* @__PURE__ */ new Map(), lt = (o, a, c) => {
        const u = `${o.toFixed(4)},${a.toFixed(4)},${c.toFixed(4)}`;
        if (nt.has(u)) return nt.get(u);
        const O = A.length;
        return A.push([
          o,
          a,
          c
        ]), nt.set(u, O), O;
      }, M = [];
      for (let o = 0; o < d.length; o++) {
        const a = [];
        for (let c = 0; c < x.length; c++) a.push(lt(x[c], d[o], 0));
        M.push(a);
      }
      for (let o = 0; o < d.length - 1; o++) for (let a = 0; a < x.length - 1; a++) {
        const c = $.length;
        $.push([
          M[o][a],
          M[o][a + 1],
          M[o + 1][a + 1],
          M[o + 1][a]
        ]), Lt.set(c, l), W.set(c, F), at.set(c, U), st.set(c, Wt);
      }
      const xt = lt(X, T, 0), g = lt(X, T, f), r = $.length;
      $.push([
        xt,
        g
      ]), W.set(r, F), at.set(r, U), ut.set(r, he), gt.set(r, n * n), Pt.set(r, n ** 4 / 12), Nt.set(r, n ** 4 / 12), vt.set(r, 0.14 * n ** 4), st.set(r, Wt), j.set(r, {
        type: "rect",
        b: n,
        h: n
      });
      const _ = /* @__PURE__ */ new Map();
      _.set(g, [
        0,
        0,
        -St,
        et,
        At,
        0
      ]);
      const z = i / ot, qt = s / ot, Ft = 0.5, h = [], b = [];
      for (let o = 0; o < d.length; o++) for (let a = 0; a < x.length; a++) {
        const c = z * qt * (a === 0 || a === x.length - 1 ? 0.5 : 1) * (o === 0 || o === d.length - 1 ? 0.5 : 1), u = y * c, O = y * c * Ft;
        h.push({
          node: M[o][a],
          dof: 0,
          k: O
        }), h.push({
          node: M[o][a],
          dof: 1,
          k: O
        }), h.push({
          node: M[o][a],
          dof: 2,
          k: u
        }), b.push(M[o][a]);
      }
      const it = y * z * qt * 1e-4, ct = M[0][0];
      h.push({
        node: ct,
        dof: 3,
        k: it
      }), h.push({
        node: ct,
        dof: 4,
        k: it
      }), h.push({
        node: ct,
        dof: 5,
        k: it
      }), e.nodes.val = A.map((o) => [
        o[0],
        o[1],
        o[2]
      ]), e.elements.val = $, e.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: _,
        springs: h
      }, e.elementInputs.val = {
        elasticities: W,
        poissonsRatios: at,
        areas: gt,
        momentsOfInertiaY: Pt,
        momentsOfInertiaZ: Nt,
        torsionalConstants: vt,
        shearModuli: ut,
        thicknesses: Lt,
        densities: st,
        sectionShapes: j
      };
      try {
        e.deformOutputs.val = xe(e.nodes.val, e.elements.val, e.nodeInputs.val, e.elementInputs.val, h);
        const o = _e(e.nodes.val, e.elements.val, e.elementInputs.val, e.deformOutputs.val), a = e.deformOutputs.rawVal.deformations, c = /* @__PURE__ */ new Map();
        let u = 0;
        e.elements.rawVal.forEach((p, q) => {
          if (p.length !== 4) return;
          const w = [];
          for (const Bt of p) {
            const Et = a == null ? void 0 : a.get(Bt), pt = y * (Et ? Et[2] : 0);
            w.push(pt), pt < u && (u = pt);
          }
          c.set(q, w);
        });
        const O = u / k;
        o.pressure = c, e.analyzeOutputs.val = o;
        const L = Math.abs(O);
        let G = 1 / 0;
        c.forEach((p) => {
          for (const q of p) {
            const w = Math.abs(q);
            w < G && (G = w);
          }
        }), Number.isFinite(G) || (G = 0);
        const ht = G / k, zt = L / t.q_adm, rt = F * l ** 3 / (12 * (1 - U ** 2)) / (y * i ** 4), P = [];
        ft ? P.push("Simple") : (R && P.push(`D${B ? "\xD7" + _t : ""}`), kt && P.push(`L${B ? "\xD7" + V : ""}`), bt && P.push(`S${B ? "\xD7" + Q : ""}`), P.length || P.push("\u26A0 NINGUNO activo"));
        const v = P.join(" + ");
        console.log(`[Zapata Aislada]  Patrones activos: ${v}
  Cargas totales: P=${H.toFixed(2)} tonf, Mx=${Z.toFixed(2)} tonf\xB7m, My=${tt.toFixed(2)} tonf\xB7m
  Patrones: D(${t.P_D}, ${t.Mx_D}, ${t.My_D}) L(${t.P_L}, ${t.Mx_L}, ${t.My_L}) S(${t.P_S}, ${t.Mx_S}, ${t.My_S})
  q_max (centro) = -${L.toFixed(2)} tonf/m\xB2
  q_min (bordes) = -${ht.toFixed(2)} tonf/m\xB2
  variaci\xF3n = ${((1 - ht / (L || 1)) * 100).toFixed(1)}%
  q_adm = -${t.q_adm} tonf/m\xB2 | ratio q_max/q_adm = ${zt.toFixed(2)}` + (zt > 1 ? " \u26A0 SOBREPASA" : " \u2713 OK") + `
  k_r\xEDgidez = ${rt.toFixed(2)} (${rt < 1 ? "FLEXIBLE" : "R\xCDGIDA"} \u2014 flexible muestra concentraci\xF3n, r\xEDgida uniforme)`);
      } catch (o) {
        console.error("Solver error zapata aislada:", o);
      }
      const Mt = e.deformOutputs.rawVal.deformations;
      let Ct = 1e-9;
      for (const o of b) {
        const a = Mt == null ? void 0 : Mt.get(o);
        a && Number.isFinite(a[2]) && (Ct = Math.max(Ct, Math.abs(a[2])));
      }
      const yt = Yt * 12, Jt = new Set(b), Dt = (_a = document.querySelector("#viewer")) == null ? void 0 : _a.__settings, $t = (o, a, c = 1) => {
        const u = o ? a : 0, L = -(Ct * Math.max(u, 1) + pe), G = c > 0 ? c : c < 0 ? -1 / c : 1, ht = ke * G, zt = ge * G, wt = [];
        for (const rt of b) {
          if (!Jt.has(rt)) continue;
          const P = e.nodes.rawVal[rt];
          if (!P) continue;
          const v = P[0], p = P[1], q = Mt == null ? void 0 : Mt.get(rt), w = (N) => Number.isFinite(N) ? N : 0, Bt = q ? w(q[0]) : 0, Et = q ? w(q[1]) : 0, pt = q ? w(q[2]) : 0, Ot = v + Bt * u, Gt = p + Et * u, Rt = 0 + pt * u, te = Rt - L, It = (N) => [
            v + (Ot - v) * N,
            p + (Gt - p) * N,
            L + te * N
          ], [ee, oe, ae] = It(0), [se, ne, le] = It(0.05), Tt = [
            new E(ee, oe, ae),
            new E(se, ne, le)
          ];
          for (let N = 0; N <= yt; N++) {
            const ce = 0.05 + 0.9 * (N / yt), [re, me, fe] = It(ce), Vt = 2 * Math.PI * Yt * (N / yt);
            Tt.push(new E(re + ht * Math.cos(Vt), me + ht * Math.sin(Vt), fe));
          }
          Tt.push(new E(Ot, Gt, Rt)), wt.push(new Ht(new Zt().setFromPoints(Tt), be));
          const D = zt, ie = [
            new E(v - D, p - D, L),
            new E(v + D, p - D, L),
            new E(v + D, p + D, L),
            new E(v - D, p + D, L),
            new E(v - D, p - D, L)
          ];
          wt.push(new Ht(new Zt().setFromPoints(ie), Se));
        }
        return wt;
      }, Qt = Xt.v;
      Dt ? de.derive(() => {
        if (Xt.v !== Qt) return;
        const o = Dt.deformedShape.val, a = Dt.deformScale.val, c = Dt.displayScale.val;
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
