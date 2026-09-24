import { p as O, __tla as __tla_0 } from "./didacticCpp-BoYi16rL.js";
import { f as j } from "./f2kPlateQ4-BZ9dGpgS.js";
import { c as I } from "./cargaColumnaConsistente-DPcPMAlx.js";
let Z;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const D = 9.80665;
  function R(e, t, r, c) {
    const p = r + 1, u = c + 1, d = e / r, k = t / c, M = [];
    for (let m = 0; m < u; ++m) for (let i = 0; i < p; ++i) M.push([
      i * d,
      m * k
    ]);
    const f = [];
    for (let m = 0; m < c; ++m) for (let i = 0; i < r; ++i) {
      const x = m * p + i;
      f.push([
        x,
        x + 1,
        x + p + 1,
        x + p
      ]);
    }
    return {
      nxn: p,
      nyn: u,
      dx: d,
      dy: k,
      nodes: M,
      elements: f
    };
  }
  function V(e, t, r, c, p, u, d, k, M, f, m) {
    const { nxn: i, nyn: x, dx: S, dy: N, nodes: z, elements: v } = R(t, r, M, f), E = [], y = [], g = I(z, v, k, t / 2, r / 2, m).pointLoads, _ = (l, a, o, s) => {
      if (E.push({
        node: l,
        dof: 0,
        k: d * a
      }), o) {
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
      if (s) {
        const h = 1e-6 * d * S * N;
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
    for (let l = 0; l < x; ++l) for (let a = 0; a < i; ++a) {
      const o = a === 0 || a === i - 1, s = l === 0 || l === x - 1, h = o && s ? 0.25 : o || s ? 0.5 : 1, P = S * N * h, C = l * i + a, U = o && s;
      switch (e) {
        case 0:
          y.push({
            node: C,
            dof: 0,
            value: 0
          });
          break;
        case 1:
          _(C, P, false, false);
          break;
        case 2:
          _(C, P, true, false);
          break;
        case 3:
          _(C, P, false, false);
          break;
        case 4:
          _(C, P, false, U);
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
    const q = O({
      E: p,
      nu: u,
      thickness: c,
      theoryType: 0,
      bcType: "none",
      nodes: z,
      elements: v,
      bcs: y,
      pointLoads: g,
      springs: E
    });
    let b = 0, n = 0, w = 1 / 0, B = 0, W = 0;
    for (const l of q.nodeResults) {
      Math.abs(l.w) > Math.abs(b) && (b = l.w);
      const a = d * Math.abs(l.w);
      a > n && (n = a), a < w && a > 0 && (w = a), B += a, W++;
    }
    isFinite(w) || (w = 0);
    const L = W > 0 ? B / W : 0, X = n > 0 ? w / n : 1;
    return {
      w_max_mm: b * 1e3,
      q_max_kNm2: n,
      q_avg_kNm2: L,
      uniformidad: X,
      output: q,
      springs: E,
      pointLoads: g
    };
  }
  let T;
  T = {
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
      const t = e.Lz, r = e.Bz, c = e.tz, p = e.q_adm_tonf * D, u = e.P_tonf * D, d = Math.round(e.nx), k = Math.round(e.ny), M = e.col_size, f = 24855e3, m = 0.2, i = p * e.ks_factor_Bowles, x = e.E_suelo_kPa, S = e.nu_suelo, N = f, z = c ** 3 / 12, v = Math.min(t, r), y = 0.65 * Math.pow(x * v ** 4 / (N * z), 1 / 12) * x / (v * (1 - S * S)), Y = V(0, t, r, c, f, m, i, u, d, k, M), g = V(1, t, r, c, f, m, i, u, d, k, M), _ = V(2, t, r, c, f, m, i, u, d, k, M), q = V(3, t, r, c, f, m, y, u, d, k, M), b = V(4, t, r, c, f, m, i, u, d, k, M), n = (w, B = 2) => Number.isFinite(w) ? w.toFixed(B) : "\u2014";
      return {
        "\u2500\u2500 \u{1F4DA} Comparativa ISSE 5 autores \u2500\u2500": "",
        "Modelo activo (vista 3D)": T[e.model | 0] ?? "\u2014",
        "ks Bowles (kN/m\xB3)": n(i, 0),
        "ks Vesic (kN/m\xB3)": n(y, 0),
        "\u2500\u2500 w_max [mm] por modelo \u2500\u2500": "",
        "1. Empotrada": `${n(Math.abs(Y.w_max_mm), 4)} (rigid)`,
        "2. Winkler vert.": n(Math.abs(g.w_max_mm), 4),
        "3. Winkler 3D Bow.": n(Math.abs(_.w_max_mm), 4),
        "4. Vesic ks-analit.": n(Math.abs(q.w_max_mm), 4),
        "5. Winkler+antisig.": n(Math.abs(b.w_max_mm), 4),
        "\u2500\u2500 q_max [kN/m\xB2] por modelo \u2500\u2500": "",
        "q_max 1. Empot.": "0 (no hay springs)",
        "q_max 2. Winkler": n(g.q_max_kNm2, 2),
        "q_max 3. W3D Bow.": n(_.q_max_kNm2, 2),
        "q_max 4. Vesic": n(q.q_max_kNm2, 2),
        "q_max 5. W+antis.": n(b.q_max_kNm2, 2),
        "\u2500\u2500 Uniformidad q_min/q_max \u2500\u2500": "",
        "Unif. 2. Winkler": n(g.uniformidad, 3),
        "Unif. 3. W3D Bow.": n(_.uniformidad, 3),
        "Unif. 4. Vesic": n(q.uniformidad, 3),
        "Unif. 5. W+antis.": n(b.uniformidad, 3),
        "\u2500\u2500 An\xE1lisis \u2500\u2500": "",
        "Era 1960 (1)": "Subestima asentamiento, sobreestima fuerzas en columna",
        "Era Bowles (2-3,5)": "Asentamiento realista, distribuci\xF3n uniforme",
        "Era Vesic (4)": "ks computado de E_s \u2192 mejor para suelos blandos",
        "Recomendaci\xF3n moderna": "Modelo 5 (Winkler + anti-sing)"
      };
    },
    build(e, t) {
      const r = e.Lz, c = e.Bz, p = e.tz, u = 24855e3, d = 0.2, k = e.q_adm_tonf * D * e.ks_factor_Bowles, M = e.E_suelo_kPa, f = e.nu_suelo, m = u, i = p ** 3 / 12, x = Math.min(r, c), N = 0.65 * Math.pow(M * x ** 4 / (m * i), 1 / 12) * M / (x * (1 - f * f)), z = Math.round(e.model), v = z === 3 ? N : k, E = e.P_tonf * D, y = Math.round(e.nx), Y = Math.round(e.ny), g = e.col_size, _ = V(z, r, c, p, u, d, v, E, y, Y, g), { nodes: q, elements: b } = R(r, c, y, Y), n = q.map((a) => [
        a[0],
        a[1],
        0
      ]);
      t.nodes.val = n, t.elements.val = b, t.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map(),
        ...j(_.springs, _.pointLoads)
      }, t.elementInputs.val = {
        elasticities: new Map(b.map((a, o) => [
          o,
          u
        ])),
        poissonsRatios: new Map(b.map((a, o) => [
          o,
          d
        ])),
        thicknesses: new Map(b.map((a, o) => [
          o,
          p
        ]))
      };
      const w = /* @__PURE__ */ new Map();
      _.output.nodeResults.forEach((a, o) => {
        w.set(o, [
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
      const B = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
      b.forEach((a, o) => {
        B.set(o, a.map((P) => v * _.output.nodeResults[P].w));
        const s = _.output.elementResults[o];
        W.set(o, [
          s.Mxx,
          s.Mxx,
          s.Mxx,
          s.Mxx
        ]), L.set(o, [
          s.Myy,
          s.Myy,
          s.Myy,
          s.Myy
        ]), X.set(o, [
          s.Mxy,
          s.Mxy,
          s.Mxy,
          s.Mxy
        ]);
        const h = Math.sqrt(s.Mxx ** 2 + s.Myy ** 2 - s.Mxx * s.Myy + 3 * s.Mxy ** 2);
        l.set(o, [
          h,
          h,
          h,
          h
        ]);
      }), t.analyzeOutputs.val = {
        pressure: B,
        bendingXX: W,
        bendingYY: L,
        bendingXY: X,
        vonMises: l
      }, t.objects3D.val = [];
    }
  };
});
export {
  __tla,
  Z as s
};
