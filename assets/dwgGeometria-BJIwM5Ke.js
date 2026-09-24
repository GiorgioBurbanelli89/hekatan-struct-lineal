let J, H, W, v, X, Z, k, Y;
let __tla = (async () => {
  J = /(^|[^A-Z])(EJE|EJES|GRID|AXIS|COTA|COTAS|DIM|TEXT|TEXTO|HATCH|RAYAD|TITUL|ROTUL|MARCO|DEFPOINTS|NIVEL|VIEWPORT|VPORT|CAJETIN|MOBIL|PUERT|VENTAN)/i;
  H = function(a, f = {}) {
    const l = (t) => a.layers[t] && a.layers[t].name || "0", n = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set(), o = [], c = [], r = (t) => [
      t[0],
      t[1],
      t[2] || 0
    ], d = a.layers.some((t) => /ANALITIC/i.test(t.name || "")), h = (t) => /ANALITIC|^SHELL/i.test(t);
    for (const t of a.entities) {
      const e = l(t.li || 0), A = t.type;
      if ([
        "LINE",
        "POLYLINE",
        "ARC"
      ].includes(A)) {
        if (J.test(e) || d && !h(e)) {
          I.add(e);
          continue;
        }
        if (n.add(e), A === "LINE") o.push([
          r(t.start),
          r(t.end)
        ]);
        else if (A === "POLYLINE") {
          const s = [];
          for (const p of (t.points || []).map(r)) (!s.length || D(s[s.length - 1], p) > 1e-9) && s.push(p);
          if (s.length > 2 && D(s[0], s[s.length - 1]) < 1e-9 && s.pop(), t.closed && (s.length === 3 || s.length === 4)) c.push(s);
          else {
            for (let p = 0; p < s.length - 1; p++) o.push([
              s[p],
              s[p + 1]
            ]);
            t.closed && s.length > 2 && o.push([
              s[s.length - 1],
              s[0]
            ]);
          }
        } else if (A === "ARC") {
          const s = r(t.center), p = t.radius;
          if (!(p > 0)) continue;
          let O = ((t.end_angle - t.start_angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) || 2 * Math.PI;
          const T = Math.max(2, Math.round(O / (2 * Math.PI) * 12));
          for (let C = 0; C < T; C++) {
            const $ = t.start_angle + O * C / T, z = t.start_angle + O * (C + 1) / T;
            o.push([
              [
                s[0] + p * Math.cos($),
                s[1] + p * Math.sin($),
                s[2]
              ],
              [
                s[0] + p * Math.cos(z),
                s[1] + p * Math.sin(z),
                s[2]
              ]
            ]);
          }
        }
      }
    }
    const u = [
      ...o.flat(),
      ...c.flat()
    ];
    let g = [
      1 / 0,
      1 / 0,
      1 / 0
    ], L = [
      -1 / 0,
      -1 / 0,
      -1 / 0
    ];
    for (const t of u) for (let e = 0; e < 3; e++) t[e] < g[e] && (g[e] = t[e]), t[e] > L[e] && (L[e] = t[e]);
    const y = u.length ? Math.max(L[0] - g[0], L[1] - g[1], L[2] - g[2]) : 0, E = f.escala ?? (y > 1e3 ? 1e-3 : 1), w = u.length > 0 && L[2] - g[2] > 1e-6 * Math.max(1, y), P = f.plano && f.plano !== "auto" ? f.plano : "xy", _ = (t) => {
      const e = t[0] * E, A = t[1] * E, s = t[2] * E;
      return P === "xz" && !w ? [
        e,
        0,
        A
      ] : [
        e,
        A,
        s
      ];
    }, M = f.tol ?? 1e-3, i = [], m = /* @__PURE__ */ new Map(), S = (t) => t.map((e) => Math.round(e / M)).join(","), N = (t) => {
      const e = _(t), A = e.map((p) => Math.round(p / M));
      for (let p = -1; p <= 1; p++) for (let O = -1; O <= 1; O++) for (let T = -1; T <= 1; T++) {
        const C = m.get(`${A[0] + p},${A[1] + O},${A[2] + T}`);
        if (C) {
          for (const $ of C) if (D(i[$], e) <= M) return $;
        }
      }
      i.push(e);
      const s = S(e);
      return (m.get(s) ?? m.set(s, []).get(s)).push(i.length - 1), i.length - 1;
    };
    let U = [];
    for (const [t, e] of o) {
      const A = N(t), s = N(e);
      A !== s && U.push([
        A,
        s
      ]);
    }
    const G = [];
    for (const t of c) {
      const e = t.map(N);
      new Set(e).size === e.length && G.push(e);
    }
    U = Y(i, U, M);
    const V = /* @__PURE__ */ new Set(), R = [], x = [];
    for (const [t, e] of U) {
      const A = t < e ? `${t}-${e}` : `${e}-${t}`;
      V.has(A) || (V.add(A), R.push([
        t,
        e
      ]));
    }
    for (const t of G) R.push([
      ...t,
      t[0]
    ]), x.push(R.length - 1);
    const F = R.length - x.length;
    return {
      nodes: i,
      polylines: R,
      areas: x,
      escala: E,
      capasUsadas: [
        ...n
      ],
      capasSaltadas: [
        ...I
      ],
      resumen: `${i.length} nudos \xB7 ${F} barras \xB7 ${x.length} \xE1reas` + (E !== 1 ? ` \xB7 unidades del dibujo \xD7 ${E}` : "") + (w ? " \xB7 3D" : ` \xB7 plano ${P.toUpperCase()}`)
    };
  };
  function D(a, f) {
    return Math.hypot(a[0] - f[0], a[1] - f[1], a[2] - f[2]);
  }
  Y = function(a, f, l) {
    const n = Math.max(l * 50, 0.5), I = /* @__PURE__ */ new Map(), o = (r, d, h) => `${Math.floor(r / n)},${Math.floor(d / n)},${Math.floor(h / n)}`;
    a.forEach((r, d) => {
      const h = o(r[0], r[1], r[2]);
      (I.get(h) ?? I.set(h, []).get(h)).push(d);
    });
    const c = [];
    for (const [r, d] of f) {
      const h = a[r], u = a[d], g = [
        u[0] - h[0],
        u[1] - h[1],
        u[2] - h[2]
      ], L = g[0] ** 2 + g[1] ** 2 + g[2] ** 2;
      if (L === 0) continue;
      const y = [
        0,
        1,
        2
      ].map((i) => Math.floor((Math.min(h[i], u[i]) - l) / n)), E = [
        0,
        1,
        2
      ].map((i) => Math.floor((Math.max(h[i], u[i]) + l) / n)), w = [], _ = (E[0] - y[0] + 1) * (E[1] - y[1] + 1) * (E[2] - y[2] + 1) > a.length ? a.keys() : function* () {
        for (let i = y[0]; i <= E[0]; i++) for (let m = y[1]; m <= E[1]; m++) for (let S = y[2]; S <= E[2]; S++) {
          const N = I.get(`${i},${m},${S}`);
          N && (yield* N);
        }
      }();
      for (const i of _) {
        if (i === r || i === d) continue;
        const m = a[i], S = ((m[0] - h[0]) * g[0] + (m[1] - h[1]) * g[1] + (m[2] - h[2]) * g[2]) / L;
        if (S <= 1e-9 || S >= 1 - 1e-9) continue;
        const N = [
          h[0] + S * g[0],
          h[1] + S * g[1],
          h[2] + S * g[2]
        ];
        D(N, m) <= l && w.push([
          S,
          i
        ]);
      }
      w.sort((i, m) => i[0] - m[0]);
      let M = r;
      for (const [, i] of w) i !== M && c.push([
        M,
        i
      ]), M = i;
      M !== d && c.push([
        M,
        d
      ]);
    }
    return c;
  };
  const b = {
    COLUMNAS: 16724016,
    VIGAS: 3211056,
    DIAGONALES: 3203327,
    LOSAS: 3195135,
    MUROS: 12615935
  };
  X = function(a, f) {
    const l = f[0] - a[0], n = f[1] - a[1], I = f[2] - a[2], o = Math.hypot(l, n), c = Math.hypot(o, I);
    return c === 0 ? "VIGAS" : o / c < 0.02 ? "COLUMNAS" : Math.abs(I) / c < 0.02 ? "VIGAS" : "DIAGONALES";
  };
  k = function(a, f) {
    const l = [], n = /* @__PURE__ */ new Set();
    for (const o of f) if (!(!o || o.length < 2)) {
      if (o.length === 2) {
        const c = a[o[0]], r = a[o[1]];
        if (!c || !r) continue;
        const d = X(c, r);
        n.add(d), l.push({
          t: "LINE",
          l: d,
          c: b[d],
          p: [
            [
              c[0],
              c[1],
              c[2]
            ],
            [
              r[0],
              r[1],
              r[2]
            ]
          ]
        });
      } else if (o.length === 3 || o.length === 4) {
        const c = o.map((u) => a[u]);
        if (c.some((u) => !u)) continue;
        const r = c.map((u) => u[2]), d = Math.max(...r) - Math.min(...r) < 1e-6 ? "LOSAS" : "MUROS";
        n.add(d);
        const h = c.length === 3 ? [
          ...c,
          c[2]
        ] : c;
        l.push({
          t: "FACE",
          l: d,
          c: b[d],
          p: h.map((u) => [
            u[0],
            u[1],
            u[2]
          ])
        });
      }
    }
    return {
      layers: [
        ...n
      ].map((o) => ({
        name: o,
        color: b[o]
      })),
      entities: l
    };
  };
  W = function(a) {
    const f = {
      COLUMNAS: 1,
      VIGAS: 3,
      DIAGONALES: 4,
      LOSAS: 5,
      MUROS: 6
    }, l = [], n = (o, c) => {
      l.push(String(o), typeof c == "number" ? I(c) : c);
    }, I = (o) => Number.isInteger(o) ? String(o) : o.toFixed(6);
    n(0, "SECTION"), n(2, "TABLES"), n(0, "TABLE"), n(2, "LAYER"), n(70, a.layers.length);
    for (const o of a.layers) n(0, "LAYER"), n(2, o.name), n(70, 0), n(62, f[o.name] ?? 7), n(6, "CONTINUOUS");
    n(0, "ENDTAB"), n(0, "ENDSEC"), n(0, "SECTION"), n(2, "ENTITIES");
    for (const o of a.entities) o.t === "LINE" ? (n(0, "LINE"), n(8, o.l), n(10, o.p[0][0]), n(20, o.p[0][1]), n(30, o.p[0][2]), n(11, o.p[1][0]), n(21, o.p[1][1]), n(31, o.p[1][2])) : (n(0, "3DFACE"), n(8, o.l), o.p.forEach((c, r) => {
      n(10 + r, c[0]), n(20 + r, c[1]), n(30 + r, c[2]);
    }));
    return n(0, "ENDSEC"), n(0, "EOF"), l.join(`
`) + `
`;
  };
  let j = null;
  async function B(a) {
    if (j) return j;
    const l = await import(new URL(`${a}dwg/_native.js`, document.baseURI).href).then(async (m) => {
      await m.__tla;
      return m;
    });
    return await l.default(), j = l, l;
  }
  Z = async function(a, f) {
    const l = new Uint8Array(await a.arrayBuffer());
    if (/\.dxf$/i.test(a.name)) {
      const { importarDXF: I } = await import(new URL(`${f}dwg/dxf_in.js`, document.baseURI).href).then(async (m) => {
        await m.__tla;
        return m;
      });
      return (await I(new TextDecoder().decode(l))).doc;
    }
    const n = await B(f);
    return JSON.parse(n.read_dwg_full(l));
  };
  v = async function(a, f, l) {
    return (await B(l)).write_dwg(JSON.stringify(k(a, f)));
  };
})();
export {
  J as CAPAS_NO_ESTRUCTURA,
  __tla,
  H as docAGeometria,
  W as entidadesADxf,
  v as escribirDwg,
  X as familiaBarra,
  Z as leerPlano,
  k as modeloAEntidades,
  Y as partirEnNudos
};
