import { p as j, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { f as I } from "./f2kPlateQ4-BZ9dGpgS.js";
import { c as T } from "./cargaColumnaConsistente-DPcPMAlx.js";
let Z;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const U = 9.80665;
  function O(e, t, m, r) {
    const p = m + 1, u = r + 1, d = e / m, b = t / r, M = [];
    for (let c = 0; c < u; ++c) for (let i = 0; i < p; ++i) M.push([
      i * d,
      c * b
    ]);
    const f = [];
    for (let c = 0; c < r; ++c) for (let i = 0; i < m; ++i) {
      const k = c * p + i;
      f.push([
        k,
        k + 1,
        k + p + 1,
        k + p
      ]);
    }
    return {
      nxn: p,
      nyn: u,
      dx: d,
      dy: b,
      nodes: M,
      elements: f
    };
  }
  function C(e, t, m, r, p, u, d, b, M, f, c) {
    const { nxn: i, nyn: k, dx: N, dy: W, nodes: z, elements: v } = O(t, m, M, f), E = [], y = [], q = T(z, v, b, t / 2, m / 2, c).pointLoads, _ = (l, a, n, o) => {
      if (E.push({
        node: l,
        dof: 0,
        k: d * a
      }), n) {
        const h = 0.5 * d * a;
        E.push({
          node: l,
          dof: 1,
          k: h * 1e-3
        }), E.push({
          node: l,
          dof: 2,
          k: h * 1e-3
        });
      }
      if (o) {
        const h = 1e-6 * d * N * W;
        E.push({
          node: l,
          dof: 1,
          k: h
        }), E.push({
          node: l,
          dof: 2,
          k: h
        });
      }
    };
    for (let l = 0; l < k; ++l) for (let a = 0; a < i; ++a) {
      const n = a === 0 || a === i - 1, o = l === 0 || l === k - 1, h = n && o ? 0.25 : n || o ? 0.5 : 1, V = N * W * h, P = l * i + a, Y = n && o;
      switch (e) {
        case 0:
          y.push({
            node: P,
            dof: 0,
            value: 0
          });
          break;
        case 1:
          _(P, V, false, false);
          break;
        case 2:
          _(P, V, true, false);
          break;
        case 3:
          _(P, V, false, false);
          break;
        case 4:
          _(P, V, false, Y);
          break;
      }
    }
    e !== 0 && (e === 1 || e === 2 || e === 3) && (y.push({
      node: 0,
      dof: 1,
      value: 0
    }), y.push({
      node: 0,
      dof: 2,
      value: 0
    }));
    const g = j({
      E: p,
      nu: u,
      thickness: r,
      theoryType: 0,
      bcType: "none",
      nodes: z,
      elements: v,
      bcs: y,
      pointLoads: q,
      springs: E
    });
    let x = 0, s = 0, w = 1 / 0, B = 0, S = 0;
    for (const l of g.nodeResults) {
      Math.abs(l.w) > Math.abs(x) && (x = l.w);
      const a = d * Math.abs(l.w);
      a > s && (s = a), a < w && a > 0 && (w = a), B += a, S++;
    }
    isFinite(w) || (w = 0);
    const D = S > 0 ? B / S : 0, R = s > 0 ? w / s : 1;
    return {
      w_max_mm: x * 1e3,
      q_max_kNm2: s,
      q_avg_kNm2: D,
      uniformidad: R,
      output: g,
      springs: E,
      pointLoads: q
    };
  }
  let X;
  X = {
    0: "1\uFE0F\u20E3 Empotrada (UBC 1960)",
    1: "2\uFE0F\u20E3 Winkler vertical (1867)",
    2: "3\uFE0F\u20E3 Winkler 3D Bowles (1996)",
    3: "4\uFE0F\u20E3 Vesic ks-anal\xEDtico (1973)",
    4: "5\uFE0F\u20E3 Winkler + anti-sing (moderno)"
  };
  Z = {
    id: "safe-bench-zapata-comparativa",
    name: "\u{1F393} Zapata ISSE Comparativa: Empotrada vs Winkler vs Vesic (5 autores)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F0} Cimentaciones",
    benchmark: true,
    defaultShellResult: "pressure",
    availableShellResults: [
      "pressure",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "vonMises",
      "displacementZ"
    ],
    hasModal: false,
    guide: [
      "Ejemplo did\xE1ctico para mostrar la EVOLUCI\xD3N HIST\xD3RICA de modelos ISSE",
      "Selector 'Modelo' cambia entre 5 enfoques cl\xE1sicos (1867-presente)",
      "Empotrada da MENOS asentamiento pero MAYORES momentos en columna (rigidez sobreestimada)",
      "Winkler/Vesic dan asentamientos realistas + redistribuci\xF3n a la zapata",
      "Tabla 'Comparativa autores' muestra los 5 modelos corridos en paralelo",
      "Use ks_factor=10.5 Bowles para arena media (default), 12 para arena densa, 15 para roca"
    ],
    params: {
      model: {
        default: 4,
        options: {
          "1\uFE0F\u20E3 Empotrada (UBC 1960)": 0,
          "2\uFE0F\u20E3 Winkler vertical (1867)": 1,
          "3\uFE0F\u20E3 Winkler 3D Bowles (1996)": 2,
          "4\uFE0F\u20E3 Vesic ks-anal\xEDtico (1973)": 3,
          "5\uFE0F\u20E3 Winkler + anti-sing (moderno)": 4
        },
        label: "\u{1F4DA} Modelo hist\xF3rico"
      },
      Lz: {
        default: 1.5,
        min: 1,
        max: 4,
        step: 0.05,
        label: "Lz (m)"
      },
      Bz: {
        default: 1.5,
        min: 1,
        max: 4,
        step: 0.05,
        label: "Bz (m)"
      },
      tz: {
        default: 0.3,
        min: 0.1,
        max: 1,
        step: 0.05,
        label: "t (m)"
      },
      q_adm_tonf: {
        default: 20,
        min: 1,
        max: 100,
        step: 1,
        label: "q_adm (tonf/m\xB2)"
      },
      ks_factor_Bowles: {
        default: 10.5,
        min: 5,
        max: 20,
        step: 0.5,
        label: "ks_factor Bowles"
      },
      E_suelo_kPa: {
        default: 25e3,
        min: 1e3,
        max: 5e5,
        step: 1e3,
        label: "E suelo (kPa) \u2014 Vesic"
      },
      nu_suelo: {
        default: 0.3,
        min: 0.1,
        max: 0.45,
        step: 0.05,
        label: "\u03BD suelo \u2014 Vesic"
      },
      P_tonf: {
        default: 20,
        min: 1,
        max: 100,
        step: 1,
        label: "P central (tonf)"
      },
      col_size: {
        default: 0.3,
        min: 0.15,
        max: 1,
        step: 0.05,
        label: "lado de la columna (m)"
      },
      nx: {
        default: 12,
        min: 6,
        max: 24,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 12,
        min: 6,
        max: 24,
        step: 2,
        label: "ny mesh"
      }
    },
    computedLabels(e) {
      const t = e.Lz, m = e.Bz, r = e.tz, p = e.q_adm_tonf * U, u = e.P_tonf * U, d = Math.round(e.nx), b = Math.round(e.ny), M = e.col_size, f = 24855e3, c = 0.2, i = p * e.ks_factor_Bowles, k = e.E_suelo_kPa, N = e.nu_suelo, W = f, z = r ** 3 / 12, v = Math.min(t, m), y = 0.65 * Math.pow(k * v ** 4 / (W * z), 1 / 12) * k / (v * (1 - N * N)), L = C(0, t, m, r, f, c, i, u, d, b, M), q = C(1, t, m, r, f, c, i, u, d, b, M), _ = C(2, t, m, r, f, c, i, u, d, b, M), g = C(3, t, m, r, f, c, y, u, d, b, M), x = C(4, t, m, r, f, c, i, u, d, b, M), s = (w, B = 2) => Number.isFinite(w) ? w.toFixed(B) : "\u2014";
      return {
        "\u2500\u2500 \u{1F4DA} Comparativa ISSE 5 autores \u2500\u2500": "",
        "Modelo activo (vista 3D)": X[e.model | 0] ?? "\u2014",
        "ks Bowles (kN/m\xB3)": s(i, 0),
        "ks Vesic (kN/m\xB3)": s(y, 0),
        "\u2500\u2500 w_max [mm] por modelo \u2500\u2500": "",
        "1. Empotrada": `${s(Math.abs(L.w_max_mm), 4)} (rigid)`,
        "2. Winkler vert.": s(Math.abs(q.w_max_mm), 4),
        "3. Winkler 3D Bow.": s(Math.abs(_.w_max_mm), 4),
        "4. Vesic ks-analit.": s(Math.abs(g.w_max_mm), 4),
        "5. Winkler+antisig.": s(Math.abs(x.w_max_mm), 4),
        "\u2500\u2500 q_max [kN/m\xB2] por modelo \u2500\u2500": "",
        "q_max 1. Empot.": "0 (no hay springs)",
        "q_max 2. Winkler": s(q.q_max_kNm2, 2),
        "q_max 3. W3D Bow.": s(_.q_max_kNm2, 2),
        "q_max 4. Vesic": s(g.q_max_kNm2, 2),
        "q_max 5. W+antis.": s(x.q_max_kNm2, 2),
        "\u2500\u2500 Uniformidad q_min/q_max \u2500\u2500": "",
        "Unif. 2. Winkler": s(q.uniformidad, 3),
        "Unif. 3. W3D Bow.": s(_.uniformidad, 3),
        "Unif. 4. Vesic": s(g.uniformidad, 3),
        "Unif. 5. W+antis.": s(x.uniformidad, 3),
        "\u2500\u2500 An\xE1lisis \u2500\u2500": "",
        "Era 1960 (1)": "Subestima asentamiento, sobreestima fuerzas en columna",
        "Era Bowles (2-3,5)": "Asentamiento realista, distribuci\xF3n uniforme",
        "Era Vesic (4)": "ks computado de E_s \u2192 mejor para suelos blandos",
        "Recomendaci\xF3n moderna": "Modelo 5 (Winkler + anti-sing)"
      };
    },
    build(e, t) {
      const m = e.Lz, r = e.Bz, p = e.tz, u = 24855e3, d = 0.2, b = e.q_adm_tonf * U * e.ks_factor_Bowles, M = e.E_suelo_kPa, f = e.nu_suelo, c = u, i = p ** 3 / 12, k = Math.min(m, r), W = 0.65 * Math.pow(M * k ** 4 / (c * i), 1 / 12) * M / (k * (1 - f * f)), z = Math.round(e.model), v = z === 3 ? W : b, E = e.P_tonf * U, y = Math.round(e.nx), L = Math.round(e.ny), q = e.col_size, _ = C(z, m, r, p, u, d, v, E, y, L, q), { nodes: g, elements: x } = O(m, r, y, L), s = g.map((a) => [
        a[0],
        a[1],
        0
      ]);
      t.nodes.val = s, t.elements.val = x, t.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map(),
        ...I(_.springs, _.pointLoads)
      }, t.elementInputs.val = {
        elasticities: new Map(x.map((a, n) => [
          n,
          u
        ])),
        poissonsRatios: new Map(x.map((a, n) => [
          n,
          d
        ])),
        thicknesses: new Map(x.map((a, n) => [
          n,
          p
        ]))
      };
      const w = /* @__PURE__ */ new Map();
      _.output.nodeResults.forEach((a, n) => {
        w.set(n, [
          0,
          0,
          a.w,
          a.bx,
          a.by,
          0
        ]);
      }), t.deformOutputs.val = {
        deformations: w,
        reactions: /* @__PURE__ */ new Map()
      };
      const B = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
      x.forEach((a, n) => {
        B.set(n, a.map((V) => v * _.output.nodeResults[V].w));
        const o = _.output.elementResults[n];
        S.set(n, [
          o.Mxx,
          o.Mxx,
          o.Mxx,
          o.Mxx
        ]), D.set(n, [
          o.Myy,
          o.Myy,
          o.Myy,
          o.Myy
        ]), R.set(n, [
          o.Mxy,
          o.Mxy,
          o.Mxy,
          o.Mxy
        ]);
        const h = Math.sqrt(o.Mxx ** 2 + o.Myy ** 2 - o.Mxx * o.Myy + 3 * o.Mxy ** 2);
        l.set(n, [
          h,
          h,
          h,
          h
        ]);
      }), t.analyzeOutputs.val = {
        pressure: B,
        bendingXX: S,
        bendingYY: D,
        bendingXY: R,
        vonMises: l
      }, t.objects3D.val = [];
    }
  };
});
export {
  __tla,
  Z as s
};
