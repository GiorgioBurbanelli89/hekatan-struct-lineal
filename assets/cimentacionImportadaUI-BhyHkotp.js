import { d as R, a as X, __tla as __tla_0 } from "./aiAgent-CjfWDbux.js";
import { montarPanelPlanta as Z, __tla as __tla_1 } from "./cimentacionPlanta-DnqWQlDv.js";
import { __tla as __tla_2 } from "./workspace-ChbWH61x.js";
import "./__vite-browser-external-D7Ct-6yo.js";
let ro;
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })()
]).then(async () => {
  const K = (o, n, t = 1e-6) => Math.abs(o - n) < t;
  function P(o) {
    const n = {};
    for (const [t, c] of Object.entries(o.ei)) n[t] = new Map(c);
    return {
      nodes: o.nodes.map((t) => [
        ...t
      ]),
      elements: o.elements.map((t) => t ? [
        ...t
      ] : null),
      supports: new Map([
        ...o.supports
      ].map(([t, c]) => [
        t,
        [
          ...c
        ]
      ])),
      loads: new Map([
        ...o.loads
      ].map(([t, c]) => [
        t,
        [
          ...c
        ]
      ])),
      springs: o.springs.map((t) => ({
        ...t
      })),
      ei: n
    };
  }
  function C(o) {
    const n = (t, c, p) => {
      const u = [
        c[0] - t[0],
        c[1] - t[1],
        c[2] - t[2]
      ], h = [
        p[0] - t[0],
        p[1] - t[1],
        p[2] - t[2]
      ];
      return 0.5 * Math.hypot(u[1] * h[2] - u[2] * h[1], u[2] * h[0] - u[0] * h[2], u[0] * h[1] - u[1] * h[0]);
    };
    return n(o[0], o[1], o[2]) + n(o[0], o[2], o[3]);
  }
  function B(o, n) {
    var _a, _b, _c, _d;
    const t = ((_a = o.ei.areas) == null ? void 0 : _a.get(n)) ?? 0, c = ((_b = o.ei.momentsOfInertiaZ) == null ? void 0 : _b.get(n)) ?? 0, p = ((_c = o.ei.momentsOfInertiaY) == null ? void 0 : _c.get(n)) ?? 0;
    if (t <= 0 || c <= 0 || p <= 0) {
      const f = Math.sqrt(Math.max(t, 1e-6));
      return {
        bx: f,
        by: f
      };
    }
    const u = Math.sqrt(12 * c / t), h = Math.sqrt(12 * p / t), x = Math.abs((((_d = o.ei.localAngles) == null ? void 0 : _d.get(n)) ?? 0) % 180);
    return Math.abs(x - 90) < 1e-6 ? {
      bx: h,
      by: u
    } : {
      bx: u,
      by: h
    };
  }
  function G(o) {
    var _a;
    const n = /* @__PURE__ */ new Set();
    for (const f of o.springs) f.dof === 2 && f.node >= 0 && n.add(f.node);
    const t = [];
    o.elements.forEach((f, s) => {
      f && f.length === 4 && f.every((m) => n.has(m)) && t.push(s);
    });
    const c = new Map(t.map((f) => [
      f,
      f
    ])), p = (f) => {
      let s = f;
      for (; c.get(s) !== s; ) s = c.get(s);
      return c.set(f, s), s;
    }, u = /* @__PURE__ */ new Map();
    for (const f of t) for (const s of o.elements[f]) {
      const m = u.get(s);
      m === void 0 ? u.set(s, f) : c.set(p(f), p(m));
    }
    const h = /* @__PURE__ */ new Map();
    for (const f of t) {
      const s = p(f);
      (h.get(s) ?? h.set(s, []).get(s)).push(f);
    }
    const x = [];
    for (const f of h.values()) {
      const s = /* @__PURE__ */ new Set();
      let m = 0;
      for (const d of f) {
        for (const b of o.elements[d]) s.add(b);
        m += C(o.elements[d].map((b) => o.nodes[b]));
      }
      const l = [
        ...s
      ].map((d) => o.nodes[d]), r = Math.min(...l.map((d) => d[0])), y = Math.max(...l.map((d) => d[0])), v = Math.min(...l.map((d) => d[1])), k = Math.max(...l.map((d) => d[1])), z = l[0][2], D = l.every((d) => K(d[2], z, 1e-6)) && Math.abs(m - (y - r) * (k - v)) < 1e-6 * Math.max(1, m), F = ((_a = o.ei.thicknesses) == null ? void 0 : _a.get(f[0])) ?? 0, $ = [];
      o.elements.forEach((d, b) => {
        if (!d || d.length !== 2) return;
        const w = o.nodes[d[0]], j = o.nodes[d[1]];
        if (Math.hypot(j[0] - w[0], j[1] - w[1]) > 1e-6) return;
        const E = w[2] <= j[2] ? d[0] : d[1];
        if (!s.has(E)) return;
        const { bx: q, by: S } = B(o, b);
        $.push({
          x: o.nodes[E][0],
          y: o.nodes[E][1],
          bx: q,
          by: S
        });
      });
      const A = /* @__PURE__ */ new Map();
      for (const d of f) {
        const b = C(o.elements[d].map((w) => o.nodes[w]));
        for (const w of o.elements[d]) A.set(w, (A.get(w) ?? 0) + b / 4);
      }
      const O = o.springs.filter((d) => d.dof === 2 && A.has(d.node)).map((d) => d.k / A.get(d.node)).sort((d, b) => d - b);
      x.push({
        id: x.length,
        elems: f,
        nodos: s,
        x0: r,
        y0: v,
        x1: y,
        y1: k,
        z,
        t: F,
        rectangular: D,
        ks: O.length ? O[Math.floor(O.length / 2)] : 0,
        columnas: $
      });
    }
    return x.sort((f, s) => f.y0 - s.y0 || f.x0 - s.x0), x.forEach((f, s) => f.id = s), x;
  }
  function L(o) {
    if (!o.columnas.length) {
      const n = (o.x0 + o.x1) / 2, t = (o.y0 + o.y1) / 2;
      return {
        x0: n,
        x1: n,
        y0: t,
        y1: t
      };
    }
    return {
      x0: Math.min(...o.columnas.map((n) => n.x - n.bx / 2)),
      x1: Math.max(...o.columnas.map((n) => n.x + n.bx / 2)),
      y0: Math.min(...o.columnas.map((n) => n.y - n.by / 2)),
      y1: Math.max(...o.columnas.map((n) => n.y + n.by / 2))
    };
  }
  function N(o, n = o) {
    const t = L(o);
    return {
      w: t.x0 - n.x0,
      e: n.x1 - t.x1,
      s: t.y0 - n.y0,
      n: n.y1 - t.y1
    };
  }
  function H(o, n) {
    const t = L(o);
    return {
      x0: t.x0 - Math.max(0, n.w),
      x1: t.x1 + Math.max(0, n.e),
      y0: t.y0 - Math.max(0, n.s),
      y1: t.y1 + Math.max(0, n.n)
    };
  }
  function _(o, n, t, c, p) {
    const u = o[0], h = o[o.length - 1], x = (l) => p.some((r) => K(r, l, 1e-6)), f = o.filter((l) => l > n + 1e-9 && l < t - 1e-9 && (x(l) || l - n >= 0.3 * c && t - l >= 0.3 * c)), s = [
      n,
      ...f,
      t
    ], m = [
      n
    ];
    for (let l = 1; l < s.length; l++) {
      const r = s[l - 1], y = s[l], v = y - r, z = r < u - 1e-9 || y > h + 1e-9 ? Math.max(1, Math.ceil(v / c - 1e-9)) : 1;
      for (let I = 1; I <= z; I++) m.push(r + v * I / z);
    }
    return [
      ...new Set(m.map((l) => +l.toFixed(9)))
    ].sort((l, r) => l - r);
  }
  function J(o, n, t) {
    var _a, _b;
    if (!n.rectangular) return {
      ok: false,
      aviso: "la zapata no es un rect\xE1ngulo: no se edita"
    };
    const c = L(n), p = {
      x0: Math.min(t.x0, c.x0),
      x1: Math.max(t.x1, c.x1),
      y0: Math.min(t.y0, c.y0),
      y1: Math.max(t.y1, c.y1)
    }, u = n.elems.filter((e) => o.elements[e]);
    if (!u.length) return {
      ok: false,
      aviso: "zapata ya reconstruida"
    };
    const h = u[0], x = new Set(u), f = /* @__PURE__ */ new Set();
    o.elements.forEach((e, a) => {
      if (e && !x.has(a)) for (const i of e) n.nodos.has(i) && f.add(i);
    });
    const s = /* @__PURE__ */ new Map();
    for (const e of u) {
      const a = C(o.elements[e].map((i) => o.nodes[i]));
      for (const i of o.elements[e]) s.set(i, (s.get(i) ?? 0) + a / 4);
    }
    const m = [
      0,
      0,
      0
    ];
    for (const e of [
      0,
      1,
      2
    ]) {
      const a = [];
      for (const i of o.springs) i.dof === e && i.node >= 0 && s.has(i.node) && a.push(i.k / s.get(i.node));
      a.length && (a.sort((i, g) => i - g), m[e] = a[Math.floor(a.length / 2)]);
    }
    const l = ((_a = o.ei.pesoArea) == null ? void 0 : _a.get(h)) ?? 0, r = [];
    for (const e of u) {
      const a = o.elements[e].map((i) => o.nodes[i]);
      r.push(Math.hypot(a[1][0] - a[0][0], a[1][1] - a[0][1]), Math.hypot(a[3][0] - a[0][0], a[3][1] - a[0][1]));
    }
    r.sort((e, a) => e - a);
    const y = Math.max(0.1, r[Math.floor(r.length / 2)] || 0.4);
    for (const [e, a] of s) {
      const i = o.loads.get(e);
      i && l && (i[2] += l * a);
    }
    const v = [
      ...n.nodos
    ].filter((e) => o.supports.has(e)).map((e) => ({
      p: [
        ...o.nodes[e]
      ],
      v: [
        ...o.supports.get(e)
      ],
      ajeno: f.has(e)
    })), k = [];
    for (const e of u) o.elements[e] = null;
    o.springs = o.springs.filter((e) => !(e.node >= 0 && n.nodos.has(e.node)));
    const z = [
      ...n.nodos
    ].filter((e) => !f.has(e));
    for (const e of z) {
      const a = o.loads.get(e);
      a && a.slice(0, 6).some((i) => Math.abs(i) > 1e-6) && k.push({
        p: [
          ...o.nodes[e]
        ],
        f: [
          ...a
        ]
      }), o.loads.delete(e), o.supports.delete(e), o.nodes[e][3] = "borrado";
    }
    for (const e of u) for (const a of Object.keys(o.ei)) o.ei[a].delete(e);
    const I = [
      ...new Set([
        ...n.nodos
      ].map((e) => +o.nodes[e][0].toFixed(9)))
    ].sort((e, a) => e - a), D = [
      ...new Set([
        ...n.nodos
      ].map((e) => +o.nodes[e][1].toFixed(9)))
    ].sort((e, a) => e - a), F = [
      ...f
    ].map((e) => o.nodes[e][0]), $ = [
      ...f
    ].map((e) => o.nodes[e][1]), A = _(I, p.x0, p.x1, y, F), O = _(D, p.y0, p.y1, y, $), d = /* @__PURE__ */ new Map(), b = (e, a) => `${e.toFixed(6)},${a.toFixed(6)}`;
    for (const e of f) d.set(b(o.nodes[e][0], o.nodes[e][1]), e);
    const w = (e, a) => {
      const i = b(e, a);
      let g = d.get(i);
      return g === void 0 && (g = o.nodes.length, o.nodes.push([
        e,
        a,
        n.z
      ]), d.set(i, g)), g;
    }, j = O.map((e) => A.map((a) => w(a, e))), E = [];
    for (let e = 0; e < O.length - 1; e++) for (let a = 0; a < A.length - 1; a++) {
      const i = o.elements.length;
      o.elements.push([
        j[e][a],
        j[e][a + 1],
        j[e + 1][a + 1],
        j[e + 1][a]
      ]), E.push(i);
    }
    const q = n.prop;
    if (q) for (const e of E) for (const [a, i] of Object.entries(q)) ((_b = o.ei)[a] ?? (_b[a] = /* @__PURE__ */ new Map())).set(e, i);
    const S = /* @__PURE__ */ new Map();
    for (const e of E) {
      const a = C(o.elements[e].map((i) => o.nodes[i]));
      for (const i of o.elements[e]) S.set(i, (S.get(i) ?? 0) + a / 4);
    }
    for (const [e, a] of S) {
      for (const i of [
        0,
        1,
        2
      ]) m[i] > 0 && o.springs.push({
        node: e,
        dof: i,
        k: m[i] * a
      });
      if (l) {
        const i = o.loads.get(e) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        i[2] -= l * a, o.loads.set(e, i);
      }
    }
    const Q = (e) => {
      let a = -1, i = 1e9;
      for (const g of S.keys()) {
        const V = Math.hypot(o.nodes[g][0] - e[0], o.nodes[g][1] - e[1]);
        V < i && (i = V, a = g);
      }
      return a;
    };
    for (const e of v) {
      if (e.ajeno) continue;
      const a = d.get(b(e.p[0], e.p[1]));
      a !== void 0 && !o.supports.has(a) && o.supports.set(a, e.v);
    }
    for (const e of k) {
      const a = Q(e.p);
      if (a < 0) continue;
      const i = o.loads.get(a) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      for (let g = 0; g < 6; g++) i[g] += e.f[g] ?? 0;
      o.loads.set(a, i);
    }
    return {
      ok: true
    };
  }
  function U(o) {
    const n = new Array(o.nodes.length).fill(true);
    o.nodes.forEach((r, y) => {
      r[3] === "borrado" && (n[y] = false);
    });
    const t = new Array(o.nodes.length).fill(-1);
    let c = 0;
    for (let r = 0; r < o.nodes.length; r++) n[r] && (t[r] = c++);
    const p = new Array(o.elements.length).fill(-1);
    let u = 0;
    for (let r = 0; r < o.elements.length; r++) o.elements[r] && (p[r] = u++);
    const h = o.nodes.filter((r, y) => n[y]).map((r) => [
      r[0],
      r[1],
      r[2]
    ]), x = o.elements.filter((r) => r).map((r) => r.map((y) => t[y])), f = {};
    for (const [r, y] of Object.entries(o.ei)) {
      const v = /* @__PURE__ */ new Map();
      for (const [k, z] of y) p[k] >= 0 && v.set(p[k], z);
      f[r] = v;
    }
    const s = /* @__PURE__ */ new Map();
    for (const [r, y] of o.supports) t[r] >= 0 && s.set(t[r], y);
    const m = /* @__PURE__ */ new Map();
    for (const [r, y] of o.loads) t[r] >= 0 && m.set(t[r], y);
    const l = o.springs.filter((r) => r.node < 0 || t[r.node] >= 0).map((r) => ({
      ...r,
      node: r.node < 0 ? r.node : t[r.node]
    }));
    return {
      nodes: h,
      elements: x,
      supports: s,
      loads: m,
      springs: l,
      ei: f
    };
  }
  function W(o, n) {
    for (const t of n) {
      const c = {};
      for (const [p, u] of Object.entries(o.ei)) u.has(t.elems[0]) && (c[p] = u.get(t.elems[0]));
      t.prop = c;
    }
  }
  function M(o, n, t) {
    const c = P(o), p = [];
    for (const [u, h] of t) {
      const x = n[u];
      if (!x) continue;
      const f = J(c, x, h);
      f.ok || p.push(`zapata ${u + 1}: ${f.aviso}`);
    }
    return {
      modelo: U(c),
      avisos: p
    };
  }
  function oo(o, n) {
    const t = {
      supports: o.supports,
      loads: o.loads,
      springs: o.springs
    }, c = o.ei, p = R(o.nodes, o.elements, t, c, o.springs), u = X(o.nodes, o.elements, c, p), h = p == null ? void 0 : p.deformations;
    if (h) {
      const x = /* @__PURE__ */ new Map();
      o.elements.forEach((f, s) => {
        !f || f.length !== 4 || !f.every((l) => o.springs.some((r) => r.node === l && r.dof === 2)) || x.set(s, f.map((l) => {
          var _a;
          return n * (((_a = h.get ? h.get(l) : h[l]) == null ? void 0 : _a[2]) ?? 0);
        }));
      }), u.pressure = x;
    }
    return {
      out: p,
      an: u
    };
  }
  const T = /* @__PURE__ */ new Map();
  function eo(o) {
    const n = o.nodeInputs.val ?? {}, t = {};
    for (const [c, p] of Object.entries(o.elementInputs.val ?? {})) p instanceof Map && (t[c] = new Map(p));
    return {
      nodes: o.nodes.val.map((c) => [
        c[0],
        c[1],
        c[2]
      ]),
      elements: o.elements.val.map((c) => [
        ...c
      ]),
      supports: new Map(n.supports ?? []),
      loads: new Map([
        ...n.loads ?? /* @__PURE__ */ new Map()
      ].map(([c, p]) => [
        c,
        [
          ...p
        ]
      ])),
      springs: (n.springs ?? []).map((c) => ({
        ...c
      })),
      ei: t
    };
  }
  function Y(o, n, t) {
    const { out: c, an: p } = oo(n, t);
    o.nodes.val = n.nodes, o.elements.val = n.elements, o.nodeInputs.val = {
      supports: n.supports,
      loads: n.loads,
      springs: n.springs
    }, o.elementInputs.val = n.ei, o.deformOutputs.val = c, o.analyzeOutputs.val = p;
  }
  ro = function(o, n) {
    var _a;
    if (typeof document > "u") return;
    const t = eo(o);
    if (!t.springs.some((s) => s.dof === 2 && s.node >= 0)) return;
    const c = G(t);
    if (!c.length) return;
    W(t, c);
    const p = T.get(n) ?? T.set(n, /* @__PURE__ */ new Map()).get(n), u = ((_a = c.find((s) => s.ks > 0)) == null ? void 0 : _a.ks) ?? 1e4, h = (s) => p.get(s.id) ?? {
      x0: s.x0,
      y0: s.y0,
      x1: s.x1,
      y1: s.y1
    }, x = () => {
      o.__cimPlanta = {
        sub: 200,
        siempre: true,
        bcol: 0.25,
        zapatas: c.map((s) => {
          const m = h(s);
          return {
            ...m,
            t: s.t,
            vuelos: N(s, m),
            base: N(s)
          };
        }),
        columnas: c.flatMap((s) => s.columnas.map((m) => ({
          ...m,
          b: Math.max(m.bx, m.by)
        }))),
        vigas: [],
        aplicar: (s, m) => {
          const l = c[s];
          if (!l || !l.rectangular) return;
          const r = H(l, m);
          Math.abs(r.x0 - l.x0) + Math.abs(r.x1 - l.x1) + Math.abs(r.y0 - l.y0) + Math.abs(r.y1 - l.y1) < 1e-6 ? p.delete(s) : p.set(s, r), f(), x(), Z(o);
        }
      };
    }, f = () => {
      if (!p.size) {
        Y(o, P(t), u);
        return;
      }
      const { modelo: s, avisos: m } = M(t, c, p);
      m.length && console.warn("[Zapatas] " + m.join(" \xB7 ")), Y(o, s, u), console.info(`[Zapatas] ${p.size} zapata(s) editada(s): ${s.nodes.length} nudos, ${s.elements.length} elementos.`);
    };
    f(), x(), Z(o);
  };
});
export {
  __tla,
  ro as montarEditorImportado
};
