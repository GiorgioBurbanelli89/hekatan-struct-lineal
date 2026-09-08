import { a as st } from "./analyze-CRH7D0Bs.js";
import { m as ct, d as rt, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { m as f, a as q } from "./cotas3D-CP6xTezf.js";
let dt;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let T, i;
  T = 98.0665;
  i = (t, e, h, a, x, p) => ({
    default: h,
    min: a,
    max: x,
    step: p,
    label: e,
    folder: t
  });
  dt = {
    id: "cerramiento",
    name: "Cerramiento (p\xF3rtico plano N vanos)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Cambi\xE1 'N vanos' para agregar/quitar columnas \u2014 se regeneran los sliders de luces.",
      "Cada vano (L\u2081, L\u2082, \u2026) ajusta su luz independientemente.",
      "Columnas: hormig\xF3n 30\xD730 cm por defecto (b_col, h_col editables).",
      "E = factor\xB7\u221A(f'c) en kgf/cm\xB2. Factor=14100 (NEC Ecuador). f'c=210 kgf/cm\xB2 t\xEDpico.",
      "Empotrado en la base. La zapata se dise\xF1a aparte (pr\xF3ximo m\xF3dulo)."
    ],
    params: {
      nVanos: {
        ...i("Geometr\xEDa", "N vanos", 3, 1, 10, 1),
        regenOnChange: true
      },
      H: i("Geometr\xEDa", "Altura H (m)", 3, 2, 6, 0.1),
      nSubV: i("Geometr\xEDa", "Div. viga (1=sin discretizar)", 1, 1, 8, 1),
      nSubC: i("Geometr\xEDa", "Div. columna (1=sin discretizar)", 1, 1, 8, 1),
      bCol: i("Secciones", "b columna (m)", 0.3, 0.2, 0.6, 0.05),
      hCol: i("Secciones", "h columna (m)", 0.3, 0.2, 0.6, 0.05),
      bViga: i("Secciones", "b viga (m)", 0.2, 0.15, 0.4, 0.05),
      hViga: i("Secciones", "h viga (m)", 0.3, 0.2, 0.6, 0.05),
      factorE: i("Materiales", "factor E (NEC=14100)", 14100, 8e3, 18e3, 100),
      fc_kgcm2: i("Materiales", "f'c (kgf/cm\xB2)", 210, 140, 420, 10),
      nu: i("Materiales", "\u03BD Poisson", 0.2, 0.15, 0.25, 0.01),
      rho: i("Materiales", "\u03B3 (kN/m\xB3)", 24, 20, 26, 0.5),
      q_vert: i("Cargas", "q viga (kN/m)", -7, -50, 0, 0.5),
      Ex: i("Cargas", "Ex lateral tope X (kN, in-plane\u2192My)", 0, -100, 100, 1),
      Ey: i("Cargas", "Ey lateral tope Y (kN, out-of-plane\u2192Mz)", 0, -100, 100, 1)
    },
    dynamicParams(t) {
      const e = {}, h = Math.max(1, Math.round(t.nVanos ?? 3));
      for (let a = 1; a <= h; a++) e[`L_v${a}`] = i("Luces de vano", `L vano ${a} (m)`, 4, 1, 12, 0.25);
      return e;
    },
    computedLabels(t) {
      const e = t.factorE * Math.sqrt(t.fc_kgcm2), a = e * T / 1e3;
      return {
        "E = factor\xB7\u221A(f'c)": `${t.factorE.toFixed(0)} \xB7 \u221A${t.fc_kgcm2.toFixed(0)} = ${e.toFixed(0)} kgf/cm\xB2`,
        "E (MPa)": `${a.toFixed(0)} MPa  (\u2248 ${(a / 1e3).toFixed(2)} GPa)`,
        "G = E/(2(1+\u03BD))": `${(e / (2 * (1 + t.nu))).toFixed(0)} kgf/cm\xB2`
      };
    },
    build(t, e) {
      const h = Math.max(1, Math.round(t.nVanos)), a = t.H, x = Math.max(1, Math.round(t.nSubV)), p = Math.max(1, Math.round(t.nSubC ?? 1)), c = [
        0
      ];
      for (let o = 1; o <= h; o++) {
        const n = t[`L_v${o}`] ?? 4;
        c.push(c[c.length - 1] + n);
      }
      const s = [], k = [], g = [];
      for (let o = 0; o < c.length; o++) k.push(s.length), s.push([
        c[o],
        0,
        0
      ]), g.push(s.length), s.push([
        c[o],
        0,
        a
      ]);
      const l = [], C = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set();
      for (let o = 0; o < c.length; o++) {
        let n = k[o];
        for (let r = 1; r < p; r++) {
          const d = r / p, m = s.length;
          s.push([
            c[o],
            0,
            d * a
          ]), C.add(l.length), l.push([
            n,
            m
          ]), n = m;
        }
        C.add(l.length), l.push([
          n,
          g[o]
        ]);
      }
      for (let o = 0; o < h; o++) {
        const n = c[o], r = c[o + 1];
        let d = g[o];
        for (let m = 1; m < x; m++) {
          const v = m / x, I = s.length;
          s.push([
            n + v * (r - n),
            0,
            a
          ]), w.add(l.length), l.push([
            d,
            I
          ]), d = I;
        }
        w.add(l.length), l.push([
          d,
          g[o + 1]
        ]);
      }
      const G = /* @__PURE__ */ new Map();
      for (const o of k) G.set(o, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const F = /* @__PURE__ */ new Map(), V = (o, n, r, d, m, v, I) => {
        const M = F.get(o) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        F.set(o, [
          M[0] + n,
          M[1] + r,
          M[2] + d,
          M[3] + m,
          M[4] + v,
          M[5] + I
        ]);
      };
      if (t.q_vert !== 0) for (const o of w) {
        const [n, r] = l[o], d = s[n][0], m = s[r][0], v = Math.abs(m - d);
        if (v < 1e-12) continue;
        const I = d < m ? n : r, M = d < m ? r : n, R = t.q_vert * v / 2, K = t.q_vert * v * v / 12;
        V(I, 0, 0, R, 0, K, 0), V(M, 0, 0, R, 0, -K, 0);
      }
      const H = g.reduce((o, n) => s[n][0] < s[o][0] ? n : o, g[0]);
      t.Ex !== 0 && V(H, t.Ex, 0, 0, 0, 0, 0), t.Ey !== 0 && V(H, 0, t.Ey, 0, 0, 0, 0);
      const O = t.factorE * Math.sqrt(t.fc_kgcm2) * T, P = t.nu, Y = O / (2 * (1 + P)), X = t.rho / 9.81, Z = t.bCol * t.hCol, Q = t.bCol * t.hCol ** 3 / 12, U = t.hCol * t.bCol ** 3 / 12, W = 0.14 * Math.pow(Math.min(t.bCol, t.hCol), 4), tt = t.bViga * t.hViga, ot = t.bViga * t.hViga ** 3 / 12, et = t.hViga * t.bViga ** 3 / 12, nt = 0.14 * Math.pow(Math.min(t.bViga, t.hViga), 4), A = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
      for (let o = 0; o < l.length; o++) A.set(o, O), D.set(o, Y), j.set(o, P), B.set(o, X), C.has(o) ? (S.set(o, Z), N.set(o, Q), y.set(o, U), z.set(o, W)) : (S.set(o, tt), N.set(o, ot), y.set(o, et), z.set(o, nt));
      e.nodes.val = s, e.elements.val = l, e.nodeInputs.val = {
        supports: G,
        loads: F
      }, e.elementInputs.val = {
        elasticities: A,
        shearModuli: D,
        areas: S,
        momentsOfInertiaY: y,
        momentsOfInertiaZ: N,
        torsionalConstants: z,
        densities: B,
        poissonsRatios: j
      };
      const J = rt(s, l, e.nodeInputs.val, e.elementInputs.val);
      e.deformOutputs.val = J, e.analyzeOutputs.val = st(s, l, e.elementInputs.val, J);
      const u = [], E = -0.8, _ = -1.5, b = -0.8;
      for (let o = 0; o < h; o++) {
        const n = c[o], r = c[o + 1], d = r - n;
        u.push(f([
          n,
          E,
          0
        ], [
          r,
          E,
          0
        ], 58879)), u.push(f([
          n,
          E - 0.15,
          0
        ], [
          n,
          E + 0.15,
          0
        ], 58879)), u.push(f([
          r,
          E - 0.15,
          0
        ], [
          r,
          E + 0.15,
          0
        ], 58879));
        const m = (n + r) / 2;
        u.push(q(`L${o + 1} = ${d.toFixed(2)} m`, m, E - 0.05, 0, "#00e5ff"));
      }
      const $ = c[0], L = c[c.length - 1], at = L - $;
      u.push(f([
        $,
        _,
        0
      ], [
        L,
        _,
        0
      ], 16755200)), u.push(f([
        $,
        _ - 0.15,
        0
      ], [
        $,
        _ + 0.15,
        0
      ], 16755200)), u.push(f([
        L,
        _ - 0.15,
        0
      ], [
        L,
        _ + 0.15,
        0
      ], 16755200)), u.push(q(`L_tot = ${at.toFixed(2)} m  (${h} vanos)`, ($ + L) / 2, _ - 0.05, 0, "#ffaa00")), u.push(f([
        b,
        0,
        0
      ], [
        b,
        a,
        0
      ], 8454016)), u.push(f([
        b - 0.15,
        0,
        0
      ], [
        b + 0.15,
        0,
        0
      ], 8454016)), u.push(f([
        b - 0.15,
        a,
        0
      ], [
        b + 0.15,
        a,
        0
      ], 8454016)), u.push(q(`H = ${a.toFixed(2)} m`, b - 0.4, a / 2, 0, "#80ff80")), e.objects3D.val = u;
    },
    runModal(t, e, h) {
      var _a, _b;
      const a = e.nodes.val, x = e.elements.val, p = e.nodeInputs.val, c = e.elementInputs.val;
      if (!(!a.length || !x.length || !((_a = p.supports) == null ? void 0 : _a.size) || !((_b = c.densities) == null ? void 0 : _b.size))) try {
        const s = ct(a, x, p, c, 8), k = Math.round(t.nVanos), g = (() => {
          let l = 0;
          for (let C = 1; C <= k; C++) l += t[`L_v${C}`] ?? 4;
          return l;
        })();
        h.render(s, {
          title: `Cerramiento ${k} vanos \xB7 L_tot=${g.toFixed(2)} m \xB7 H=${t.H} m`,
          properties: [
            `Hormig\xF3n col ${t.bCol}\xD7${t.hCol} m \xB7 viga ${t.bViga}\xD7${t.hViga} m`,
            `E = ${t.factorE}\xB7\u221A${t.fc_kgcm2} = ${(t.factorE * Math.sqrt(t.fc_kgcm2)).toFixed(0)} kgf/cm\xB2`
          ]
        });
      } catch (s) {
        console.warn("Modal cerramiento error:", s.message);
      }
    }
  };
});
export {
  __tla,
  dt as c
};
