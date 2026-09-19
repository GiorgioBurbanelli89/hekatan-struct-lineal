import { c as bt, __tla as __tla_0 } from "./cliModeler-D9AgmNSt.js";
import { a as Nn } from "./exampleVersion-D1A_5i59.js";
import { a as Xn, __tla as __tla_1 } from "./analyze-BXBBJMWG.js";
import { d as Zn, __tla as __tla_2 } from "./didacticCpp-Czy7NlhT.js";
import { G as mn, f as Ee, D as fn, B as Ce, M as Se, L as _e, b as ze, q as ie, C as Hn, w as wt, V as hn, j as _n, i as zn, g as gn, c as Un, E as Bn } from "./Text-CU8HL4cE.js";
import { v as $t } from "./menuDiseno-DjPLZbn7.js";
import { c as Jn, e as Ft, a as kt } from "./e2kExporter-DsjSDGmO.js";
let Yt, Qt;
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
  const At = (n, l) => Math.abs(n / l - Math.round(n / l)) < 1e-6;
  function Et(n) {
    const l = [], d = Math.max(1, Math.round(n.nCeldas)), a = n.L, x = n.H, h = n.dx;
    At(a, h) || l.push(`La luz ${a} m no es m\xFAltiplo del paso ${h} m: los muros no caen en nudo del tablero.`);
    const e = d * a, c = Math.round(e / h), p = Math.max(2, Math.ceil(a / n.dxInf - 1e-9)), g = Math.max(2, Math.ceil(x / n.dxInf - 1e-9)), r = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), b = [];
    let L = 0;
    const N = (y, v) => {
      const w = `${y.toFixed(6)},${v.toFixed(6)}`;
      let _ = $.get(w);
      return _ || (_ = ++L, $.set(w, _), r.set(_, [
        y,
        0,
        v
      ]), b.push(`node ${_} ${+y.toFixed(6)} 0 ${+v.toFixed(6)}`)), _;
    }, H = [];
    for (let y = 0; y <= c; y++) H.push(N(+(y * e / c).toFixed(9), x));
    const U = [];
    for (let y = 0; y < d; y++) for (let v = 0; v < p; v++) U.push(y * a + v * a / p);
    U.push(e);
    const ee = U.map((y) => N(y, 0)), ce = [];
    for (let y = 0; y <= d; y++) {
      const v = [];
      for (let w = 0; w <= g; w++) v.push(N(y * a, w * x / g));
      ce.push(v);
    }
    const X = [];
    let T = 0;
    const P = (y) => {
      const w = Math.max(1, y), _ = Math.min(1, y);
      return {
        A: 1 * y,
        I33: 1 * y ** 3 / 12,
        I22: y * 1 ** 3 / 12,
        J: w * _ ** 3 * (1 / 3 - 0.21 * _ / w * (1 - _ ** 4 / (12 * w ** 4)))
      };
    }, B = (y, v, w, _) => {
      const m = P(w);
      T++;
      const Z = `${_ === "sup" ? "LOSA_SUP" : _ === "inf" ? "LOSA_INF" : "MURO"}_${Math.round(w * 100)}`;
      b.push(`frame ${T} ${y} ${v} ${n.E} ${+m.A.toPrecision(10)} ${+m.I22.toPrecision(10)} ${+m.I33.toPrecision(10)} ${+m.J.toPrecision(10)} ${n.nu} 2.4 ${w} 1 # ${Z}`), X.push({
        id: T,
        i: y,
        j: v,
        pieza: _,
        t: w
      });
    };
    for (let y = 0; y < H.length - 1; y++) B(H[y], H[y + 1], n.tSup, "sup");
    for (let y = 0; y < ee.length - 1; y++) B(ee[y], ee[y + 1], n.tInf, "inf");
    for (const y of ce) for (let v = 0; v < y.length - 1; v++) B(y[v], y[v + 1], n.tMuro, "muro");
    const J = [];
    U.forEach((y, v) => {
      const w = ((v > 0 ? y - U[v - 1] : 0) + (v < U.length - 1 ? U[v + 1] - y : 0)) / 2, _ = n.ks * w * 1, m = ee[v];
      J.push({
        id: m,
        k: _
      }), b.push(`support ${m} ${v === 0 ? 1 : 0} 1 0 1 0 1`), b.push(`spring ${m} uz ${+_.toPrecision(10)}`);
    });
    const q = /* @__PURE__ */ new Map();
    n.hRelleno > 0 && H.forEach((y, v) => {
      const w = r.get(y)[0], _ = v > 0 ? r.get(H[v - 1])[0] : w, m = v < H.length - 1 ? r.get(H[v + 1])[0] : w;
      q.set(y, n.gRelleno * n.hRelleno * (m - _) / 2);
    });
    const re = [
      `# Alcantarilla caj\xF3n \xB7 ${d} celda(s) de ${a} m \xD7 ${x} m (a ejes) \xB7 franja de 1 m`,
      `# losa sup ${n.tSup} m \xB7 losa inf ${n.tInf} m \xB7 muros ${n.tMuro} m \xB7 E ${n.E} kN/m\xB2 \xB7 ks ${n.ks} kN/m\xB3`,
      `# tablero con un nudo cada ${h} m (los ejes del cami\xF3n caen en nudo) \xB7 unidades kN, m`,
      "# Carga m\xF3vil HL-93: se calcula aparte, por l\xEDneas de influencia (examples/src/shared/cargaMovil.ts)"
    ], K = [
      ...q
    ].map(([y, v]) => `load ${y} 0 0 ${-+v.toFixed(6)} 0 0 0`);
    return {
      heks: [
        ...re,
        ...b,
        ...K,
        "solve"
      ].join(`
`) + `
`,
      nudos: r,
      tablero: H,
      muelles: J,
      barras: X,
      relleno: q,
      largo: e,
      avisos: l
    };
  }
  const le = {
    ejes: [
      35,
      145,
      145
    ],
    sepDelantera: 4.3,
    sepTraseraMin: 4.3,
    sepTraseraMax: 9,
    carril: 9.3,
    fuente: "HL-93K (AASHTO LRFD, SI). En la PC: CSI Analysis Reference Manual, SAP2000 24, cap. XXVI, p. 515 y Fig. 92 p. 517"
  };
  function Vn(n = {}) {
    const l = n.sepTrasera ?? le.sepTraseraMin, d = 1 + (n.IM ?? 0) / 100, a = n.ancho && n.ancho > 0 ? n.ancho : 1;
    return {
      nombre: `HL-93 (35/145/145 kN \xB7 4.3/${l.toFixed(2)} m${n.IM ? ` \xB7 IM ${n.IM} %` : ""}${a !== 1 ? ` \xB7 \xF7${a} m` : ""})`,
      ejes: [
        {
          d: 0,
          P: le.ejes[0] * d / a
        },
        {
          d: le.sepDelantera,
          P: le.ejes[1] * d / a
        },
        {
          d: le.sepDelantera + l,
          P: le.ejes[2] * d / a
        }
      ],
      carril: n.conCarril ?? true ? le.carril / a : 0,
      fuente: le.fuente
    };
  }
  const Qe = (n) => Math.max(0, ...n.ejes.map((l) => l.d));
  function Ct(n, l, d = 0) {
    const a = n.map((h, e) => l(h, e) ? e : -1).filter((h) => h >= 0);
    a.sort((h, e) => n[h][d] - n[e][d]);
    const x = a.length ? n[a[0]][d] : 0;
    return {
      nudos: a,
      s: a.map((h) => n[h][d] - x)
    };
  }
  function St(n) {
    const l = n.s;
    return l.map((d, a) => ((a > 0 ? l[a] - l[a - 1] : 0) + (a < l.length - 1 ? l[a + 1] - l[a] : 0)) / 2);
  }
  const W = 6;
  function jt(n) {
    const l = n.nodes.length, d = new Int32Array(l).fill(-1), a = Array.from({
      length: l
    }, () => []);
    n.elements.forEach((e) => {
      e.length === 2 && (a[e[0]].push(e[1]), a[e[1]].push(e[0]));
    });
    let x = 0;
    for (let e = 0; e < l; e++) {
      const c = new Set(a[e].map((g) => d[g]));
      let p = 0;
      for (; c.has(p); ) p++;
      d[e] = p, x = Math.max(x, p + 1);
    }
    const h = n.elements.map(() => new Float64Array(W * 12));
    for (let e = 0; e < x; e++) for (let c = 0; c < 6; c++) {
      const p = /* @__PURE__ */ new Map();
      for (let r = 0; r < l; r++) {
        const $ = [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        d[r] === e && ($[c] = 1), p.set(r, $);
      }
      const g = Xn(n.nodes, n.elements, n.elementInputs, {
        deformations: p
      });
      n.elements.forEach((r, $) => {
        if (r.length !== 2) return;
        const b = d[r[0]] === e ? c : d[r[1]] === e ? 6 + c : -1;
        if (b < 0) return;
        const L = [
          [
            g == null ? void 0 : g.normals,
            0
          ],
          [
            g == null ? void 0 : g.shearsY,
            2
          ],
          [
            g == null ? void 0 : g.bendingsZ,
            4
          ]
        ];
        for (const [N, H] of L) {
          const U = (N == null ? void 0 : N.get($)) ?? [
            0,
            0
          ];
          h[$][H * 12 + b] = -(U[0] ?? 0), h[$][(H + 1) * 12 + b] = U[1] ?? 0;
        }
      });
    }
    return h;
  }
  async function It(n, l, d = {}) {
    var _a, _b;
    const a = (globalThis.performance ?? Date).now(), x = n.nodes.length, h = n.elements.length, e = [], c = [], p = [], g = new Float64Array(l.nudos.length), r = n.springs ?? [], $ = jt(n);
    for (let b = 0; b < l.nudos.length; b++) {
      const L = l.nudos[b], N = /* @__PURE__ */ new Map([
        [
          L,
          [
            0,
            0,
            -1,
            0,
            0,
            0
          ]
        ]
      ]), H = Zn(n.nodes, n.elements, {
        ...n.nodeInputs,
        loads: N
      }, n.elementInputs, r.length ? r : void 0), U = new Float64Array(x * 6);
      (_a = H.deformations) == null ? void 0 : _a.forEach((T, P) => {
        for (let B = 0; B < 6; B++) U[P * 6 + B] = T[B] ?? 0;
      }), e.push(U);
      let ee = 0;
      (_b = H.reactions) == null ? void 0 : _b.forEach((T, P) => {
        var _a2, _b2;
        ((_b2 = (_a2 = n.nodeInputs.supports) == null ? void 0 : _a2.get(P)) == null ? void 0 : _b2[2]) && (ee += T[2] ?? 0);
      }), g[b] = ee;
      const ce = new Float64Array(h * W);
      n.elements.forEach((T, P) => {
        if (T.length !== 2) return;
        const B = $[P], J = T[0] * 6, q = T[1] * 6;
        for (let re = 0; re < W; re++) {
          let K = 0;
          for (let G = 0; G < 6; G++) K += B[re * 12 + G] * U[J + G] + B[re * 12 + 6 + G] * U[q + G];
          ce[P * W + re] = K;
        }
      }), c.push(ce);
      const X = new Float64Array(r.length);
      r.forEach((T, P) => {
        X[P] = -T.k * U[T.node * 6 + T.dof];
      }), p.push(X), d.progreso && (b % 16 === 15 || b === l.nudos.length - 1) && await d.progreso((b + 1) / l.nudos.length);
    }
    return {
      camino: l,
      nN: x,
      nE: h,
      U: e,
      F: c,
      R: p,
      RzApoyos: g,
      ms: (globalThis.performance ?? Date).now() - a
    };
  }
  function Pt(n, l) {
    var _a;
    const d = n.nodes.length, a = n.elements.length, x = n.springs ?? [], h = Zn(n.nodes, n.elements, {
      ...n.nodeInputs,
      loads: l
    }, n.elementInputs, x.length ? x : void 0), e = new Float64Array(d * 6);
    (_a = h.deformations) == null ? void 0 : _a.forEach(($, b) => {
      for (let L = 0; L < 6; L++) e[b * 6 + L] = $[L] ?? 0;
    });
    const c = Xn(n.nodes, n.elements, n.elementInputs, h), p = new Float64Array(a * W), g = ($, b) => $ == null ? void 0 : $.forEach((L, N) => {
      p[N * W + b] = -(L[0] ?? 0), p[N * W + b + 1] = L[1] ?? 0;
    });
    g(c == null ? void 0 : c.normals, 0), g(c == null ? void 0 : c.shearsY, 2), g(c == null ? void 0 : c.bendingsZ, 4);
    const r = new Float64Array(x.length);
    return x.forEach(($, b) => {
      r[b] = -$.k * e[$.node * 6 + $.dof];
    }), {
      U: e,
      F: p,
      R: r
    };
  }
  function Mn(n, l, d, a = 1e-6) {
    const x = new Float64Array(n.nudos.length);
    let h = 0, e = 0;
    const c = n.s, p = c.length, g = [];
    for (const r of l.ejes) {
      const $ = d - r.d;
      if (g.push($), p === 0 || $ < c[0] - a || $ > c[p - 1] + a) {
        h += r.P;
        continue;
      }
      let b = 0, L = p - 1;
      for (; L - b > 1; ) {
        const H = b + L >> 1;
        c[H] <= $ ? b = H : L = H;
      }
      if (Math.abs($ - c[b]) <= a) {
        x[b] += r.P;
        continue;
      }
      if (Math.abs($ - c[L]) <= a) {
        x[L] += r.P;
        continue;
      }
      const N = ($ - c[b]) / (c[L] - c[b]);
      x[b] += r.P * (1 - N), x[L] += r.P * N, e += r.P;
    }
    return {
      w: x,
      fuera: h,
      repartido: e,
      xEjes: g
    };
  }
  function Kn(n, l, d) {
    const x = (n.s.length ? n.s[n.s.length - 1] : 0) + Qe(l), h = Math.max(1, Math.round(x / d));
    return Array.from({
      length: h + 1
    }, (e, c) => +(c * x / h).toFixed(9));
  }
  function Ue(n, l, d) {
    for (let a = 0; a < n.length; a++) n[a] += d * l[a];
  }
  function Rt(n, l, d) {
    var _a;
    const a = Mn(n.camino, l, d), x = new Float64Array(n.nN * 6), h = new Float64Array(n.nE * W), e = new Float64Array(((_a = n.R[0]) == null ? void 0 : _a.length) ?? 0);
    let c = 0, p = 0;
    a.w.forEach((g, r) => {
      g !== 0 && (Ue(x, n.U[r], g), Ue(h, n.F[r], g), Ue(e, n.R[r], g), c += g, p += g * n.RzApoyos[r]);
    });
    for (let g = 0; g < e.length; g++) p += e[g];
    return {
      xF: d,
      U: x,
      F: h,
      R: e,
      sumaCargas: c,
      sumaReacciones: p,
      pesos: a
    };
  }
  function Lt(n, l, d, a = {}) {
    var _a, _b;
    const x = (globalThis.performance ?? Date).now(), h = n.nN * 6, e = n.nE * W, c = ((_a = n.R[0]) == null ? void 0 : _a.length) ?? 0, p = new Float64Array(h).fill(-1 / 0), g = new Float64Array(h).fill(1 / 0), r = new Float64Array(e).fill(-1 / 0), $ = new Float64Array(e).fill(1 / 0), b = new Float64Array(c).fill(-1 / 0), L = new Float64Array(c).fill(1 / 0), N = new Float64Array(h).fill(NaN), H = new Float64Array(h).fill(NaN), U = new Float64Array(e).fill(NaN), ee = new Float64Array(e).fill(NaN), ce = ((_b = a.separacionesTraseras) == null ? void 0 : _b.length) && a.vehiculoCon ? a.separacionesTraseras : [
      NaN
    ], X = new Float64Array(h), T = new Float64Array(e), P = new Float64Array(c);
    let B = 0;
    const J = d.length > 1 ? d[1] - d[0] : 0.1;
    for (const G of ce) {
      const y = Number.isFinite(G) ? a.vehiculoCon(G) : l, v = Number.isFinite(G) ? Kn(n.camino, y, J) : d;
      for (const w of v) {
        const _ = Mn(n.camino, y, w);
        X.fill(0), T.fill(0), P.fill(0), _.w.forEach((m, Z) => {
          m && (Ue(X, n.U[Z], m), Ue(T, n.F[Z], m), Ue(P, n.R[Z], m));
        });
        for (let m = 0; m < h; m++) X[m] > p[m] && (p[m] = X[m], N[m] = w), X[m] < g[m] && (g[m] = X[m], H[m] = w);
        for (let m = 0; m < e; m++) T[m] > r[m] && (r[m] = T[m], U[m] = w), T[m] < $[m] && ($[m] = T[m], ee[m] = w);
        for (let m = 0; m < c; m++) P[m] > b[m] && (b[m] = P[m]), P[m] < L[m] && (L[m] = P[m]);
        B++;
      }
    }
    const q = (G, y) => {
      for (let v = 0; v < G.length; v++) Number.isFinite(G[v]) || (G[v] = 0);
    };
    q(p), q(g), q(r), q($), q(b), q(L);
    const re = {
      Umin: g.slice(),
      Umax: p.slice(),
      Fmax: r.slice(),
      Fmin: $.slice()
    }, K = a.carril ?? true ? l.carril : 0;
    if (K > 0) {
      const G = St(n.camino);
      n.camino.nudos.forEach((y, v) => {
        const w = K * G[v];
        if (!w) return;
        const _ = (m, Z, F) => {
          for (let Y = 0; Y < m.length; Y++) {
            const ue = w * m[Y];
            ue > 0 ? Z[Y] += ue : F[Y] += ue;
          }
        };
        _(n.U[v], p, g), _(n.F[v], r, $), _(n.R[v], b, L);
      });
    }
    return {
      Umax: p,
      Umin: g,
      Fmax: r,
      Fmin: $,
      Rmax: b,
      Rmin: L,
      xFUmax: N,
      xFUmin: H,
      xFFmax: U,
      xFFmin: ee,
      separaciones: ce.filter(Number.isFinite),
      nPosiciones: B,
      soloCamion: re,
      carril: K,
      ms: (globalThis.performance ?? Date).now() - x
    };
  }
  function Tt(n, l = le.sepTraseraMin, d = le.sepTraseraMax) {
    const a = Math.max(0, Math.round((d - l) / n));
    return Array.from({
      length: a + 1
    }, (x, h) => +(l + h * (d - l) / Math.max(1, a)).toFixed(9));
  }
  function Yn(n, l, d) {
    const a = [];
    return d.forEach((x, h) => {
      const e = Mn(n, l, x);
      if (e.repartido > 1e-9) return;
      const c = [];
      e.w.forEach((p, g) => {
        p && c.push([
          n.nudos[g],
          p
        ]);
      }), c.length && a.push({
        nombre: `POS${String(h).padStart(3, "0")}`,
        xF: x,
        cargas: c
      });
    }), a;
  }
  const xn = typeof window < "u" ? window : globalThis, I = (n, l) => Jn() === "en" ? l : n;
  function On(n, l) {
    const d = Math.min(1, Math.max(0, n)), a = Math.min(1, Math.max(0, 1.5 - Math.abs(4 * d - 3))), x = Math.min(1, Math.max(0, 1.5 - Math.abs(4 * d - 2))), h = Math.min(1, Math.max(0, 1.5 - Math.abs(4 * d - 1)));
    l[0] = a, l[1] = x, l[2] = h;
  }
  function Dn(n, l) {
    const d = Math.hypot(n, l) || 1, a = n / d, x = l / d, h = Math.abs(a) < 1e-9 ? [
      1,
      0
    ] : [
      -Math.sign(a) * x,
      Math.abs(a)
    ];
    return [
      -h[0],
      -h[1]
    ];
  }
  function Nt() {
    for (const n of document.querySelectorAll("div")) if (n.__settings && n.__ctx) return n;
    return null;
  }
  let Xe = null;
  function Qn() {
    try {
      Xe == null ? void 0 : Xe.dispose();
    } catch {
    }
    Xe = null;
  }
  function Ht(n) {
    var _a, _b, _c;
    Qn();
    const l = Nt(), d = l == null ? void 0 : l.__ctx, a = (l == null ? void 0 : l.__settings) ?? (d == null ? void 0 : d.settings), x = new mn();
    x.name = "hk-carga-movil", (_a = d == null ? void 0 : d.scene) == null ? void 0 : _a.add(x);
    const h = () => {
      var _a2;
      try {
        (_a2 = d == null ? void 0 : d.render) == null ? void 0 : _a2.call(d);
      } catch {
      }
    };
    let e = null, c = null, p = 0, g = true, r = 0, $ = 0, b = 0, L = 12, N = 0, H = 1, U = 1, ee = true, ce = true, X = true, T = "tonf", P = false, B = 0, J = 1e-12, q = 1e-12, re = 10;
    const K = [], G = {
      def: (_b = a == null ? void 0 : a.deformedShape) == null ? void 0 : _b.rawVal,
      fr: (_c = a == null ? void 0 : a.frameResults) == null ? void 0 : _c.rawVal
    };
    (a == null ? void 0 : a.deformedShape) && (a.deformedShape.val = false), (a == null ? void 0 : a.frameResults) && (a.frameResults.val = "none");
    const y = document.createElement("div");
    y.textContent = "Hekatan Struct", y.style.cssText = "position:fixed;left:62%;bottom:96px;transform:translateX(-50%);z-index:900;font:600 16px sans-serif;color:rgba(255,255,255,.42);pointer-events:none;letter-spacing:.5px", document.body.appendChild(y);
    const v = document.createElement("div");
    v.id = "hk-carga-movil", v.style.cssText = "position:fixed;bottom:84px;left:312px;z-index:950;width:300px;max-height:78vh;overflow:auto;background:rgba(22,26,32,.95);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:8px", document.body.appendChild(v);
    const w = "background:#2a3340;color:#e8e8e8;border:1px solid #4a5a6a;border-radius:4px;padding:3px 7px;cursor:pointer;font:12px sans-serif";
    v.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center"><b>\u{1F69A} ${I("Carga m\xF3vil", "Moving load")}</b>
      <span><span data-plegar title="${I("Plegar / desplegar", "Fold / unfold")}" style="cursor:pointer;margin-right:12px">\u2581</span><span id="hkcm-x" style="cursor:pointer" title="${I("Cerrar", "Close")}">\u2715</span></span></div>
    <div>
      <div id="hkcm-tit" style="color:#9fc3e6;margin:4px 0"></div>
      <div id="hkcm-avisos" style="margin:4px 0;color:#f0a050;line-height:1.35"></div>
      <div id="hkcm-prog" style="margin:4px 0;color:#e0c070"></div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin:6px 0">
        <button id="hkcm-ini" style="${w}" title="${I("Al inicio", "To start")}">\u23EE</button>
        <button id="hkcm-ant" style="${w}" title="${I("Paso atr\xE1s", "Step back")}">\u25C0</button>
        <button id="hkcm-play" style="${w};min-width:70px"></button>
        <button id="hkcm-sig" style="${w}" title="${I("Paso adelante", "Step forward")}">\u25B6</button>
        <button id="hkcm-env" style="${w}" title="${I("Ver envolventes", "Show envelopes")}">${I("Envolvente", "Envelope")}</button>
      </div>
      <input id="hkcm-pos" type="range" min="0" max="0" value="0" style="width:100%">
      <div style="display:grid;grid-template-columns:110px 1fr 44px;gap:3px;align-items:center;margin-top:4px">
        <span>${I("Velocidad", "Speed")}</span><input id="hkcm-vel" type="range" min="1" max="60" value="12"><span id="hkcm-velv"></span>
        <span>${I("Escala deformada", "Deformed scale")}</span><input id="hkcm-esc" type="range" min="-10" max="10" value="0"><span id="hkcm-escv"></span>
        <span>${I("Escala de M", "M scale")}</span><input id="hkcm-escm" type="range" min="-10" max="10" value="0"><span id="hkcm-escmv"></span>
      </div>
      <div style="margin:6px 0">
        <label><input id="hkcm-vdef" type="checkbox" checked> ${I("Deformada", "Deformed")}</label>
        <label style="margin-left:8px"><input id="hkcm-vm" type="checkbox" checked> ${I("Momento M", "Moment M")}</label>
        <label style="margin-left:8px"><input id="hkcm-venv" type="checkbox" checked> ${I("Envolvente al final", "Envelope at the end")}</label>
        <select id="hkcm-uni" style="margin-left:6px" title="${I("Unidades", "Units")}"><option value="tonf">tonf\xB7m</option><option value="kN">kN\xB7m</option></select>
      </div>
      <div id="hkcm-est" style="font:12px ui-monospace,Consolas,monospace;line-height:1.5;margin:6px 0;white-space:pre"></div>
      <canvas id="hkcm-cbar" width="300" height="34" style="width:100%;height:34px"></canvas>
      <div id="hkcm-envtxt" style="font:12px ui-monospace,Consolas,monospace;line-height:1.45;white-space:pre;color:#cfe3f5"></div>
      <div id="hkcm-exp" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px"></div>
      <details style="margin-top:6px"><summary style="cursor:pointer;color:#9fc3e6">${I("Fuente, notas y tiempos", "Source, notes and timing")}</summary>
        <div id="hkcm-notas" style="color:#9aa1ad;margin-top:6px;line-height:1.4"></div>
        <div id="hkcm-perf" style="color:#7d8a99;margin-top:4px;font:11px ui-monospace,Consolas,monospace;white-space:pre"></div>
      </details>
    </div>`, $t(v);
    let _ = false;
    v.addEventListener("pointerdown", (t) => {
      var _a2;
      ((_a2 = v.firstElementChild) == null ? void 0 : _a2.contains(t.target)) && (_ = true);
    });
    const m = () => {
      if (_ || !v.isConnected) return;
      const t = document.getElementById("hk-ribbon"), i = t && t.offsetParent !== null ? t.getBoundingClientRect() : null, o = Math.max(40, (i && i.height > 0 ? i.bottom : 0) + 6);
      v.style.top = o + "px", v.style.bottom = "auto", v.style.maxHeight = Math.max(160, innerHeight - o - 90) + "px";
    }, Z = setInterval(m, 400);
    m();
    const F = (t) => v.querySelector("#" + t), Y = new Ee({
      vertexColors: true,
      side: fn
    }), ue = new Ce(), he = new Se(ue, Y);
    x.add(he);
    const je = new Ce(), nt = new _e(je, new ze({
      color: 724756,
      transparent: true,
      opacity: 0.55
    }));
    x.add(nt);
    const nn = new Ce(), yn = new _e(nn, new ze({
      color: 16777215,
      depthTest: false,
      transparent: true,
      opacity: 0.95
    }));
    yn.renderOrder = 5, x.add(yn);
    const Be = new Ce(), tn = new Se(Be, new Ee({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      side: fn,
      depthWrite: false
    }));
    x.add(tn);
    const Ze = new Ce(), bn = new _e(Ze, new ze({
      color: 16777215,
      transparent: true,
      opacity: 0.8
    }));
    x.add(bn);
    const Ve = new Ce(), tt = new _e(Ve, new ze({
      vertexColors: true
    }));
    x.add(tt);
    const Oe = new Ce(), ot = new Se(Oe, new Ee({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      side: fn,
      depthWrite: false
    }));
    x.add(ot);
    const de = new mn();
    x.add(de);
    let De = [], on = 0, ve = new Float32Array(0), xe = new Float32Array(0), Je = new Float32Array(0), ye = 9;
    const at = 0.015, st = [
      1,
      0.82,
      0.62,
      0.7
    ];
    function rt() {
      if (!e) return;
      De = [];
      let t = 0;
      e.elements.forEach((u, f) => {
        if (u.length !== 2) return;
        const M = e.nodes[u[0]], s = e.nodes[u[1]], k = Math.hypot(s[0] - M[0], s[2] - M[2]), A = Math.max(1, Math.min(12, Math.ceil(k / 0.1 - 1e-9)));
        De.push({
          e: f,
          nSeg: A,
          off: t
        }), t += (A + 1) * 8;
      }), on = t, ve = new Float32Array(on * 3), xe = new Float32Array(on * 3);
      const i = [];
      for (const u of De) for (let f = 0; f < u.nSeg; f++) for (let M = 0; M < 4; M++) {
        const s = u.off + f * 8 + M * 2, k = s + 1, A = s + 8, E = k + 8;
        i.push(s, A, E, s, E, k);
      }
      ue.setIndex(i), ue.setAttribute("position", new ie(ve, 3)), ue.setAttribute("color", new ie(xe, 3));
      let o = 0;
      for (const u of De) o += u.nSeg * 4;
      Je = new Float32Array(o * 2 * 3), je.setAttribute("position", new ie(Je, 3));
    }
    const Ie = [
      0,
      0,
      0
    ];
    function wn(t, i, o, u) {
      if (!e) return;
      let f = 0;
      const M = [];
      let s = [];
      for (const k of De) {
        const A = e.elements[k.e], E = e.nodes[A[0]], V = e.nodes[A[1]], R = V[0] - E[0], z = V[2] - E[2], C = Math.hypot(R, z) || 1, pe = R / C, te = z / C, Q = te, S = -pe, j = e.canto(k.e) / 2, O = t ? [
          t[A[0] * 6],
          t[A[0] * 6 + 2],
          t[A[0] * 6 + 4]
        ] : [
          0,
          0,
          0
        ], D = t ? [
          t[A[1] * 6],
          t[A[1] * 6 + 2],
          t[A[1] * 6 + 4]
        ] : [
          0,
          0,
          0
        ], me = O[0] * pe + O[1] * te, Pe = D[0] * pe + D[1] * te, we = O[0] * Q + O[1] * S, Ge = D[0] * Q + D[1] * S, ke = O[2], be = D[2], Ae = u ? u(A[0]) : Math.hypot(O[0], O[1]), Ye = u ? u(A[1]) : Math.hypot(D[0], D[1]), [We, ft] = e.extremos ? e.extremos(k.e) : [
          0,
          0
        ];
        for (let Re = 0; Re <= k.nSeg; Re++) {
          const $e = -We + (C + We + ft) * Re / k.nSeg, oe = Math.min(1, Math.max(0, $e / C)), jn = $e < 0 ? $e : $e > C ? $e - C : 0, ht = 1 - 3 * oe * oe + 2 * oe ** 3, gt = C * (oe - 2 * oe * oe + oe ** 3), xt = 3 * oe * oe - 2 * oe ** 3, vt = C * (-oe * oe + oe ** 3), Mt = $e < 0 ? ke : be, In = ht * we + gt * ke + xt * Ge + vt * be + (jn ? Mt * jn : 0), Pn = (1 - oe) * me + oe * Pe, Rn = Pn * pe + In * Q, Ln = Pn * te + In * S, Le = E[0] + $e * pe + i * Rn, Te = E[2] + $e * te + i * Ln, yt = u ? (1 - oe) * Ae + oe * Ye : Math.hypot(Rn, Ln);
          On(yt / (o || 1), Ie);
          const Tn = [
            [
              Le - Q * j,
              -ye / 2,
              Te - S * j
            ],
            [
              Le + Q * j,
              -ye / 2,
              Te + S * j
            ],
            [
              Le + Q * j,
              ye / 2,
              Te + S * j
            ],
            [
              Le - Q * j,
              ye / 2,
              Te - S * j
            ]
          ], un = k.off + Re * 8;
          for (let fe = 0; fe < 4; fe++) {
            const ge = Tn[fe], Ne = Tn[(fe + 1) % 4], Me = (un + fe * 2) * 3, He = Me + 3;
            ve[Me] = ge[0], ve[Me + 1] = ge[1], ve[Me + 2] = ge[2], ve[He] = Ne[0], ve[He + 1] = Ne[1], ve[He + 2] = Ne[2];
            const pn = st[fe];
            xe[Me] = Ie[0] * pn, xe[Me + 1] = Ie[1] * pn, xe[Me + 2] = Ie[2] * pn, xe[He] = xe[Me], xe[He + 1] = xe[Me + 1], xe[He + 2] = xe[Me + 2];
          }
          const dn = [
            [
              Le - Q * j,
              Te - S * j
            ],
            [
              Le + Q * j,
              Te + S * j
            ]
          ];
          if (Re > 0) for (const fe of [
            -0.5,
            0.5
          ]) for (let ge = 0; ge < 2; ge++) M.push(s[ge][0], fe, s[ge][1], dn[ge][0], fe, dn[ge][1]);
          if (s = dn, Re > 0) for (let fe = 0; fe < 4; fe++) {
            const ge = (un - 8 + fe * 2) * 3, Ne = (un + fe * 2) * 3;
            Je.set(ve.subarray(ge, ge + 3), f), Je.set(ve.subarray(Ne, Ne + 3), f + 3), f += 6;
          }
        }
      }
      ue.attributes.position.needsUpdate = true, ue.attributes.color.needsUpdate = true, je.attributes.position.needsUpdate = true, ue.computeBoundingSphere(), je.computeBoundingSphere(), nn.setAttribute("position", new ie(new Float32Array(M), 3)), nn.computeBoundingSphere();
    }
    function $n(t, i) {
      if (!e || !t) {
        Be.setAttribute("position", new ie(new Float32Array(0), 3)), Ze.setAttribute("position", new ie(new Float32Array(0), 3));
        return;
      }
      const o = [], u = [], f = [], M = -ye / 2 - 0.05;
      e.elements.forEach((s, k) => {
        if (s.length !== 2) return;
        const A = e.nodes[s[0]], E = e.nodes[s[1]], V = E[0] - A[0], R = E[2] - A[2], z = Dn(V, R), C = t[k * W + 4] * i, pe = t[k * W + 5] * i, te = (j, O) => o.push(j, M, O), Q = (j) => j >= 0 ? [
          0.95,
          0.35,
          0.3
        ] : [
          0.3,
          0.55,
          0.95
        ], S = (j, O, D, me, Pe, we) => {
          if (D * we < 0) {
            const Ae = D / (D - we), Ye = j + Ae * (me - j), We = O + Ae * (Pe - O);
            S(j, O, D, Ye, We, 0), S(Ye, We, 0, me, Pe, we);
            return;
          }
          const Ge = Q(D + we), ke = [
            j + z[0] * D,
            O + z[1] * D
          ], be = [
            me + z[0] * we,
            Pe + z[1] * we
          ];
          te(j, O), te(me, Pe), te(be[0], be[1]), te(j, O), te(be[0], be[1]), te(ke[0], ke[1]);
          for (let Ae = 0; Ae < 6; Ae++) u.push(Ge[0], Ge[1], Ge[2]);
          f.push(ke[0], M, ke[1], be[0], M, be[1]);
        };
        S(A[0], A[2], C, E[0], E[2], pe);
      }), Be.setAttribute("position", new ie(new Float32Array(o), 3)), Be.setAttribute("color", new ie(new Float32Array(u), 3)), Ze.setAttribute("position", new ie(new Float32Array(f), 3)), Be.computeBoundingSphere(), Ze.computeBoundingSphere();
    }
    function Fn(t, i) {
      if (!e || !c || !t) {
        Ve.setAttribute("position", new ie(new Float32Array(0), 3)), Oe.setAttribute("position", new ie(new Float32Array(0), 3));
        return;
      }
      const o = [], u = [], f = [], M = [], s = -ye / 2 - 0.08;
      e.elements.forEach((k, A) => {
        var _a2, _b2;
        if (k.length !== 2) return;
        const E = e.nodes[k[0]], V = e.nodes[k[1]], R = Dn(V[0] - E[0], V[2] - E[2]);
        for (const [z, C] of [
          [
            c.Fmax,
            [
              1,
              0.35,
              0.3
            ]
          ],
          [
            c.Fmin,
            [
              0.35,
              0.6,
              1
            ]
          ]
        ]) {
          const pe = (z[A * W + 4] + (((_a2 = e.fija) == null ? void 0 : _a2.F[A * W + 4]) ?? 0)) * i, te = (z[A * W + 5] + (((_b2 = e.fija) == null ? void 0 : _b2.F[A * W + 5]) ?? 0)) * i, Q = [
            E[0] + R[0] * pe,
            E[2] + R[1] * pe
          ], S = [
            V[0] + R[0] * te,
            V[2] + R[1] * te
          ];
          o.push(Q[0], s, Q[1], S[0], s, S[1]), u.push(C[0], C[1], C[2], C[0], C[1], C[2]), f.push(E[0], s, E[2], V[0], s, V[2], S[0], s, S[1], E[0], s, E[2], S[0], s, S[1], Q[0], s, Q[1]);
          for (let j = 0; j < 6; j++) M.push(C[0], C[1], C[2]);
        }
      }), Ve.setAttribute("position", new ie(new Float32Array(o), 3)), Ve.setAttribute("color", new ie(new Float32Array(u), 3)), Ve.computeBoundingSphere(), Oe.setAttribute("position", new ie(new Float32Array(f), 3)), Oe.setAttribute("color", new ie(new Float32Array(M), 3)), Oe.computeBoundingSphere();
    }
    const Ke = new mn();
    x.add(Ke);
    function it() {
      if (Ke.clear(), !e) return;
      {
        const f = document.createElement("canvas");
        f.width = 512, f.height = 64;
        const M = f.getContext("2d");
        M.font = "bold 34px sans-serif", M.fillStyle = "#ffffff", M.textAlign = "center", M.textBaseline = "middle", M.fillText(I("franja de c\xE1lculo 1 m", "1 m design strip"), 256, 32);
        const s = new _n(new zn({
          map: new gn(f),
          depthTest: false,
          transparent: true
        }));
        let k = 1 / 0, A = 1 / 0;
        for (const E of e.nodes) k = Math.min(k, E[0]), A = Math.min(A, E[2]);
        s.scale.set(4.8, 0.6, 1), s.position.set(k + 1.2, -0.5, A - 0.7), s.renderOrder = 6, Ke.add(s);
      }
      const t = e.IL.camino.s, i = t[t.length - 1] - t[0], o = Qe(e.vehiculo) + 4, u = new Ee({
        color: 4869975
      });
      for (const [f, M] of [
        [
          e.x0 - o,
          e.x0 - 0.3
        ],
        [
          e.x0 + i + 0.3,
          e.x0 + i + o
        ]
      ]) {
        const s = new Se(new Un(M - f, ye, 0.12), u);
        s.position.set((f + M) / 2, 0, e.zRodadura - 0.06), Ke.add(s);
        const k = new _e(new Bn(s.geometry), new ze({
          color: 7830918
        }));
        s.add(k);
      }
    }
    const an = [], sn = [];
    function lt(t, i = "#ffdddd") {
      const o = document.createElement("canvas");
      o.width = 256, o.height = 64;
      const u = o.getContext("2d");
      u.font = "bold 40px sans-serif", u.fillStyle = i, u.textAlign = "center", u.textBaseline = "middle", u.fillText(t, 128, 32);
      const f = new _n(new zn({
        map: new gn(o),
        depthTest: false,
        transparent: true
      }));
      return f.scale.set(2.4, 0.6, 1), f;
    }
    function ct() {
      if (de.clear(), sn.length = 0, !e) return;
      const t = e.vehiculo, i = Qe(t), o = 0.5, u = 2.6, f = 0.9, M = (S, j, O, D) => new Se(new Un(S, O, j), new Ee({
        color: D
      })), s = (S) => {
        const j = new _e(new Bn(S.geometry), new ze({
          color: 2236962
        }));
        return S.add(j), S;
      }, k = s(M(2.3, 2.6, u, 12986408));
      k.position.set(0.1, 0, o + 0.5 + 1.3), de.add(k);
      const A = M(0.05, 0.9, u * 0.8, 8369120);
      A.position.set(1.26, 0, o + 0.5 + 1.9), de.add(A);
      const E = i + 1.6 - 1.4, V = s(M(E, 2.9, u, 14474460));
      V.position.set(-1.4 - E / 2, 0, o + 0.7 + 1.45), de.add(V);
      for (let S = 1; S <= 5; S++) {
        const j = M(E * 0.96, 0.03, 0.02, 10132122);
        j.position.set(-1.4 - E / 2, -u / 2 - 0.01, o + 0.7 + S * 0.48), de.add(j);
      }
      const R = M(i + 2.2, 0.25, 1.4, 4473924);
      R.position.set(-i / 2 + 0.2, 0, o + 0.35), de.add(R);
      const z = new Hn(o, o, 0.4, 20), C = new Ee({
        color: 1776411
      }), pe = new Hn(o * 0.45, o * 0.45, 0.42, 14), te = new Ee({
        color: 10132122
      });
      an.length = 0, t.ejes.forEach((S, j) => {
        for (const O of [
          -1,
          1
        ]) {
          const D = new Se(z, C);
          D.position.set(-S.d, O * f, o), de.add(D);
          const me = new Se(pe, te);
          me.position.set(-S.d, O * (f + 0.01), o), de.add(me), an.push({
            m: D,
            k: j,
            z0: o
          }, {
            m: me,
            k: j,
            z0: o
          });
        }
      });
      const Q = Math.max(...t.ejes.map((S) => S.P)) || 1;
      for (const S of t.ejes) {
        const j = 1 + 2.2 * S.P / Q, O = o + 0.7 + 2.9 + 0.3 + j, D = new wt(new hn(0, 0, -1), new hn(-S.d, 0, O), j, 16726832, 0.45, 0.3);
        de.add(D);
        const me = lt("");
        me.position.set(-S.d, 0, O + 0.45), de.add(me), sn.push(me);
      }
      kn();
    }
    function kn() {
      e && e.vehiculo.ejes.forEach((t, i) => {
        var _a2;
        const o = sn[i];
        if (!o) return;
        const u = T === "tonf" ? `${(t.P / 9.80665).toFixed(2)} tonf` : `${t.P.toFixed(1)} kN`, f = document.createElement("canvas");
        f.width = 256, f.height = 64;
        const M = f.getContext("2d");
        M.font = "bold 40px sans-serif", M.fillStyle = "#ffd0d0", M.textAlign = "center", M.textBaseline = "middle", M.fillText(u, 128, 32), (_a2 = o.material.map) == null ? void 0 : _a2.dispose(), o.material.map = new gn(f), o.material.needsUpdate = true;
      });
    }
    function ut() {
      if (!e) return;
      let t = 1 / 0, i = -1 / 0, o = 1 / 0, u = -1 / 0;
      for (const f of e.nodes) t = Math.min(t, f[0]), i = Math.max(i, f[0]), o = Math.min(o, f[2]), u = Math.max(u, f[2]);
      re = Math.hypot(i - t, u - o) || 10, J = 1e-12, q = 1e-12;
      for (const f of e.xs) {
        const M = An(f);
        for (let s = 0; s < e.nodes.length; s++) J = Math.max(J, Math.hypot(M.U[s * 6], M.U[s * 6 + 2]));
        for (let s = 0; s < e.elements.length; s++) q = Math.max(q, Math.abs(M.F[s * W + 4]), Math.abs(M.F[s * W + 5]));
      }
      H = at * re / J;
    }
    const rn = /* @__PURE__ */ new Map();
    function An(t) {
      let i = rn.get(t);
      if (i) return i;
      if (i = Rt(e.IL, e.vehiculo, t), e.fija) {
        for (let o = 0; o < i.U.length; o++) i.U[o] += e.fija.U[o];
        for (let o = 0; o < i.F.length; o++) i.F[o] += e.fija.F[o];
      }
      return rn.set(t, i), i;
    }
    const ln = (t) => Math.pow(10, t / 10), En = () => U * 0.12 * re / (c ? Math.max(q, ...[
      ...c.Fmax,
      ...c.Fmin
    ].map(Math.abs)) : q);
    function qe(t) {
      return T === "tonf" ? `${(t / 9.80665).toFixed(2)} tonf\xB7m` : `${t.toFixed(1)} kN\xB7m`;
    }
    function ae() {
      if (!e) return;
      const t = performance.now(), i = e.xs.length;
      p = Math.max(0, Math.min(i - 1, p));
      const o = e.xs[p], u = An(o), f = 1 * H * ln(N);
      if (P && c) {
        const R = (C) => {
          var _a2;
          return Math.abs(Math.min(0, c.Umin[C * 6 + 2] + (((_a2 = e.fija) == null ? void 0 : _a2.U[C * 6 + 2]) ?? 0)));
        };
        let z = 1e-12;
        for (let C = 0; C < e.nodes.length; C++) z = Math.max(z, R(C));
        wn(null, 0, z, R), $n(null, 0), Fn(true, En()), de.visible = false;
      } else {
        wn(ee ? u.U : null, ee ? f : 0, J), $n(ce ? u.F : null, En()), Fn(false, 0), de.visible = true;
        const R = u.pesos.xEjes.map((C) => dt(C, u.U, ee ? f : 0)), z = R.reduce((C, pe) => C + pe, 0) / R.length;
        de.position.set(e.x0 + o, 0, e.zRodadura + z), an.forEach((C) => {
          C.m.position.z = C.z0 + R[C.k] - z;
        });
      }
      he.visible = true, tn.visible = ce && !P, bn.visible = tn.visible, h();
      let M = 0, s = -1 / 0, k = 1 / 0;
      for (let R = 0; R < e.nodes.length; R++) M = Math.min(M, u.U[R * 6 + 2]);
      for (let R = 0; R < e.elements.length; R++) {
        const z = u.F[R * W + 4], C = u.F[R * W + 5];
        s = Math.max(s, z, C), k = Math.min(k, z, C);
      }
      const A = u.sumaCargas - u.sumaReacciones;
      F("hkcm-est").textContent = P ? I("ENVOLVENTE (cami\xF3n + carril)", "ENVELOPE (truck + lane)") : `${I("Posici\xF3n", "Position")} ${p + 1}/${i}   x = ${o.toFixed(2)} m
\u03A3P ${I("ejes", "axles")} = ${qe(u.sumaCargas).replace("\xB7m", "")}
\u03A3R \u2212 \u03A3P = ${A.toExponential(1)} kN
Uz ${I("m\xEDn", "min")} = ${(M * 1e3).toFixed(3)} mm
M3 ${I("m\xE1x", "max")} = ${qe(s)}
M3 ${I("m\xEDn", "min")} = ${qe(k)}`, F("hkcm-play").textContent = g ? `\u23F8 ${I("Pausa", "Pause")}` : `\u25B6 ${I("Play", "Play")}`, F("hkcm-pos").max = String(i - 1), F("hkcm-pos").value = String(p), F("hkcm-velv").textContent = `${L}/s`, F("hkcm-escv").textContent = `\xD7${f.toPrecision(3)}`, F("hkcm-escmv").textContent = `\xD7${ln(Math.log10(U) * 10).toFixed(2)}`;
      const E = performance.now() - t;
      K.push(E), K.length > 60 && K.shift();
      const V = K.reduce((R, z) => R + z, 0) / K.length;
      xn.__hekatanCargaMovilPerf = {
        msCuadro: V,
        i: p,
        n: i
      }, F("hkcm-perf").textContent = `${I("IL", "IL")}: ${e.IL.camino.nudos.length} ${I("casos", "cases")} \xB7 ${e.IL.ms.toFixed(0)} ms` + (c ? `
${I("envolvente", "envelope")}: ${c.nPosiciones} ${I("posiciones", "positions")} \xB7 ${c.ms.toFixed(0)} ms` : "") + `
${I("cuadro", "frame")}: ${V.toFixed(1)} ms (${I("m\xE1x.", "max")} ${(1e3 / Math.max(V, 1e-3)).toFixed(0)} fps)`, pt(P ? null : J);
    }
    function dt(t, i, o) {
      if (!e) return 0;
      const u = e.IL.camino, f = u.s, M = f.length;
      if (t <= f[0] || t >= f[M - 1]) return 0;
      let s = 0, k = M - 1;
      for (; k - s > 1; ) {
        const E = s + k >> 1;
        f[E] <= t ? s = E : k = E;
      }
      const A = (t - f[s]) / (f[k] - f[s]);
      return o * ((1 - A) * i[u.nudos[s] * 6 + 2] + A * i[u.nudos[k] * 6 + 2]);
    }
    function pt(t) {
      var _a2;
      const i = F("hkcm-cbar"), o = i.getContext("2d");
      o.clearRect(0, 0, i.width, i.height);
      for (let f = 0; f < i.width; f++) On(f / (i.width - 1), Ie), o.fillStyle = `rgb(${Ie.map((M) => Math.round(M * 255)).join(",")})`, o.fillRect(f, 0, 1, 14);
      o.fillStyle = "#ddd", o.font = "11px sans-serif";
      let u = t;
      if (u === null && c && e) {
        u = 0;
        for (let f = 0; f < e.nodes.length; f++) u = Math.max(u, Math.abs(Math.min(0, c.Umin[f * 6 + 2] + (((_a2 = e.fija) == null ? void 0 : _a2.U[f * 6 + 2]) ?? 0))));
      }
      o.textAlign = "left", o.fillText("0", 2, 28), o.textAlign = "right", o.fillText(`${((u ?? 0) * 1e3).toFixed(2)} mm  ${t === null ? I("(Uz m\xEDn., envolvente)", "(min Uz, envelope)") : "|u|"}`, i.width - 2, 28);
    }
    function Cn(t) {
      var _a2, _b2;
      let i = -1 / 0, o = 1 / 0, u = -1, f = -1, M = 0;
      for (let s = 0; s < e.elements.length; s++) for (const k of [
        4,
        5
      ]) {
        const A = ((_a2 = e.fija) == null ? void 0 : _a2.F[s * W + k]) ?? 0, E = t.Fmax[s * W + k] + A, V = t.Fmin[s * W + k] + A;
        E > i && (i = E, u = s), V < o && (o = V, f = s);
      }
      for (let s = 0; s < e.nodes.length; s++) M = Math.min(M, t.Umin[s * 6 + 2] + (((_b2 = e.fija) == null ? void 0 : _b2.U[s * 6 + 2]) ?? 0));
      return {
        mx: i,
        mn: o,
        eMx: u,
        eMn: f,
        uz: M
      };
    }
    function cn() {
      if (!c || !e) {
        F("hkcm-envtxt").textContent = I("Envolvente: calculando\u2026", "Envelope: computing\u2026");
        return;
      }
      const t = (M) => {
        const s = e.elements[M], k = e.nodes[s[0]], A = e.nodes[s[1]];
        return `x\u2248${((k[0] + A[0]) / 2).toFixed(2)}`;
      }, i = c.separaciones.length > 1 ? `${c.separaciones[0]}\u2013${c.separaciones[c.separaciones.length - 1]} m` : I("fija", "fixed"), o = Cn(c.soloCamion), u = Cn(c), f = (M, s) => `${M}
  M3 m\xE1x ${qe(s.mx)} (${t(s.eMx)})
  M3 m\xEDn ${qe(s.mn)} (${t(s.eMn)})
  Uz m\xEDn ${(s.uz * 1e3).toFixed(3)} mm`;
      F("hkcm-envtxt").textContent = `${I("ENVOLVENTES", "ENVELOPES")} \xB7 ${c.nPosiciones} ${I("posiciones", "positions")} \xB7 ${I("trasera", "rear")} ${i}
` + f(I("\u2460 Cami\xF3n solo", "\u2460 Truck only"), o) + (c.carril > 0 ? `
` + f(I(`\u2461 Cami\xF3n + carril ${c.carril.toFixed(2)} kN/m (la del dibujo)`, `\u2461 Truck + lane ${c.carril.toFixed(2)} kN/m (drawn)`), u) : "");
    }
    function mt() {
      var _a2;
      if (!e || !(d == null ? void 0 : d.camera) || !(d == null ? void 0 : d.controls)) return;
      let t = 1 / 0, i = -1 / 0, o = 1 / 0, u = -1 / 0;
      for (const z of e.nodes) t = Math.min(t, z[0]), i = Math.max(i, z[0]), o = Math.min(o, z[2]), u = Math.max(u, z[2]);
      const f = Qe(e.vehiculo) + 2.5;
      t -= f * 0.5, i += f * 0.5, u += 5.5;
      const M = (t + i) / 2, s = (o + u) / 2, k = Math.hypot(i - t, u - o, ye), A = new hn(0.28, -1, 0.42).normalize(), E = d.camera, V = M - 0.22 * k, R = 1.55 * k;
      d.controls.target.set(V, 0, s), E.position.set(V + A.x * R, A.y * R, s + A.z * R), E.up.set(0, 0, 1), E.lookAt(V, 0, s), (_a2 = E.updateProjectionMatrix) == null ? void 0 : _a2.call(E), d.controls.update();
    }
    function Sn(t) {
      if (r = requestAnimationFrame(Sn), n && !n()) {
        ne.dispose();
        return;
      }
      if (!e || !g) {
        $ = t;
        return;
      }
      const i = Math.min(0.25, (t - ($ || t)) / 1e3);
      if ($ = t, P) {
        B += i, B > 3.5 && (P = false, p = 0, ae());
        return;
      }
      if (b += i * L, b < 1) return;
      const o = Math.floor(b);
      if (b -= o, p + o >= e.xs.length) {
        if (X && c) {
          P = true, B = 0, p = e.xs.length - 1, ae();
          return;
        }
        p = 0;
      } else p += o;
      ae();
    }
    r = requestAnimationFrame(Sn), F("hkcm-x").onclick = () => ne.dispose(), F("hkcm-play").onclick = () => {
      g ? ne.pausa() : ne.play();
    }, F("hkcm-ini").onclick = () => {
      P = false, ne.pausa(), ne.ir(0);
    }, F("hkcm-ant").onclick = () => {
      ne.pausa(), ne.paso(-1);
    }, F("hkcm-sig").onclick = () => {
      ne.pausa(), ne.paso(1);
    }, F("hkcm-env").onclick = () => {
      c && (ne.pausa(), P = true, ae());
    }, F("hkcm-pos").oninput = (t) => {
      P = false, ne.pausa(), ne.ir(+t.target.value);
    }, F("hkcm-vel").oninput = (t) => {
      L = +t.target.value, ae();
    }, F("hkcm-esc").oninput = (t) => {
      N = +t.target.value, ae();
    }, F("hkcm-escm").oninput = (t) => {
      U = ln(+t.target.value), ae();
    }, F("hkcm-vdef").onchange = (t) => {
      ee = t.target.checked, ae();
    }, F("hkcm-vm").onchange = (t) => {
      ce = t.target.checked, ae();
    }, F("hkcm-venv").onchange = (t) => {
      X = t.target.checked;
    }, F("hkcm-uni").onchange = (t) => {
      T = t.target.value, kn(), cn(), ae();
    };
    const ne = {
      cargar(t) {
        e = t, rn.clear(), p = 0, P = false, F("hkcm-tit").textContent = t.titulo, F("hkcm-prog").textContent = "", F("hkcm-avisos").innerHTML = (t.avisos ?? []).map((o) => `<div>\u26A0 ${o}</div>`).join(""), F("hkcm-notas").innerHTML = (t.notas ?? []).map((o) => `<div>${o}</div>`).join("");
        const i = F("hkcm-exp");
        i.innerHTML = "";
        for (const o of t.exportar ?? []) {
          const u = document.createElement("button");
          u.textContent = o.etiqueta, u.style.cssText = w, u.onclick = o.accion, i.appendChild(u);
        }
        ye = t.fondo ?? 9, rt(), ut(), ct(), it(), cn(), t.encuadrar && mt(), ae();
      },
      ponerEnvolvente(t) {
        c = t, cn(), ae();
      },
      progreso(t, i) {
        F("hkcm-prog").textContent = `${t} ${(i * 100).toFixed(0)} %`;
      },
      play() {
        g = true, $ = 0, ae();
      },
      pausa() {
        g = false, ae();
      },
      paso(t) {
        e && (P = false, p = (p + t + e.xs.length) % e.xs.length, ae());
      },
      ir(t) {
        p = t, ae();
      },
      estado() {
        const t = K.length ? K.reduce((i, o) => i + o, 0) / K.length : 0;
        return {
          i: p,
          n: (e == null ? void 0 : e.xs.length) ?? 0,
          xF: (e == null ? void 0 : e.xs[p]) ?? 0,
          jugando: g,
          msCuadro: t,
          fps: t ? 1e3 / t : 0
        };
      },
      dispose() {
        var _a2;
        cancelAnimationFrame(r), clearInterval(Z), (_a2 = d == null ? void 0 : d.scene) == null ? void 0 : _a2.remove(x), x.traverse((t) => {
          var _a3, _b2;
          (_b2 = (_a3 = t.geometry) == null ? void 0 : _a3.dispose) == null ? void 0 : _b2.call(_a3), t.material && (Array.isArray(t.material) ? t.material : [
            t.material
          ]).forEach((i) => {
            var _a4, _b3, _c2;
            (_b3 = (_a4 = i.map) == null ? void 0 : _a4.dispose) == null ? void 0 : _b3.call(_a4), (_c2 = i.dispose) == null ? void 0 : _c2.call(i);
          });
        }), v.remove(), y.remove(), (a == null ? void 0 : a.deformedShape) && G.def !== void 0 && (a.deformedShape.val = G.def), h(), Xe === ne && (Xe = null), xn.__hekatanCargaMovil = void 0;
      }
    };
    return Xe = ne, xn.__hekatanCargaMovil = ne, ne;
  }
  const Fe = (n, l) => Jn() === "en" ? l : n, _t = 98.0665, zt = 9806.65, vn = typeof window < "u" ? window : globalThis, se = (n, l, d, a, x, h, e) => ({
    default: d,
    min: a,
    max: x,
    step: h,
    label: l,
    folder: n,
    description: e
  });
  function Ut(n) {
    return {
      nCeldas: {
        ...se("Geometr\xEDa", "N.\xBA de celdas", n.nC, 1, 4, 1),
        regenOnChange: false
      },
      L: se("Geometr\xEDa", "Luz de cada celda, a ejes (m)", n.L, 1.5, 12, 0.1, "Distancia entre ejes de muros. M\xFAltiplo del paso del tablero."),
      H: se("Geometr\xEDa", "Alto, a ejes (m)", n.H, 1, 8, 0.1),
      tSup: se("Geometr\xEDa", "Espesor losa superior (m)", n.tS, 0.15, 1, 0.01),
      tInf: se("Geometr\xEDa", "Espesor losa inferior (m)", n.tI, 0.15, 1, 0.01),
      tMuro: se("Geometr\xEDa", "Espesor muros (m)", n.tM, 0.15, 1, 0.01),
      Ekg: se("Material y suelo", "E hormig\xF3n (kgf/cm\xB2)", 25e4, 1e5, 4e5, 1e3),
      nu: se("Material y suelo", "\u03BD", 0.2, 0, 0.3, 0.01),
      kskg: se("Material y suelo", "ks balasto (kgf/cm\xB3)", n.ks, 0.3, 20, 0.1, "M\xF3dulo de balasto vertical. 1 kgf/cm\xB3 = 9806.65 kN/m\xB3."),
      hRel: se("Relleno", "Relleno encima (m)", 0, 0, 5, 0.1, "Carga permanente \u03B3\xB7h sobre la losa superior (sin reparto del cami\xF3n por el relleno)."),
      gRel: se("Relleno", "\u03B3 relleno (kN/m\xB3)", 19, 14, 22, 0.5),
      sep2: se("Cami\xF3n HL-93", "Separaci\xF3n trasera (m)", le.sepTraseraMin, le.sepTraseraMin, le.sepTraseraMax, 0.1, "AASHTO: 4.3 a 9.0 m. La de la animaci\xF3n."),
      varSep: {
        default: 1,
        boolean: true,
        label: "Envolvente: probar 4.3\u20139.0 m",
        folder: "Cami\xF3n HL-93"
      },
      IM: se("Cami\xF3n HL-93", "IM factor din\xE1mico (%)", 0, 0, 75, 1, "Solo a los ejes (CSI Analysis Reference, p. 515)."),
      ancho: se("Cami\xF3n HL-93", "Ancho de reparto E (m)", 1, 0.5, 6, 0.05, "Las cargas de eje se dividen por E para dar kN por metro de franja. 1 = sin reparto (el eje entero sobre 1 m, del lado seguro). El ancho de AASHTO LRFD para alcantarillas (franja equivalente y propagaci\xF3n por el relleno) est\xE1 PENDIENTE DE FUENTE: no hay PDF de AASHTO en la PC y los manuales de CSI no lo traen; pon aqu\xED el E de tu norma."),
      carril: {
        default: 1,
        boolean: true,
        label: "Carga de carril 9.3 kN/m en la envolvente",
        folder: "Cami\xF3n HL-93"
      },
      paso: {
        default: n.paso,
        options: {
          "0.10 m": 0.1,
          "0.05 m": 0.05
        },
        label: "Paso del cami\xF3n = malla del tablero",
        folder: "Malla"
      },
      dxInf: se("Malla", "Malla losa inferior y muros (m)", 0.5, 0.1, 1, 0.05),
      fondo: se("Dibujo", "Ancho de calzada dibujado (m)", 9, 2, 20, 0.5, "Solo dibujo: largo de la alcantarilla a lo largo de la v\xEDa. El c\xE1lculo es la franja de 1 m, marcada en blanco.")
    };
  }
  function Bt(n) {
    return {
      nCeldas: Math.round(n.nCeldas),
      L: n.L,
      H: n.H,
      tSup: n.tSup,
      tInf: n.tInf,
      tMuro: n.tMuro,
      E: n.Ekg * _t,
      nu: n.nu,
      ks: n.kskg * zt,
      dx: n.paso || 0.1,
      dxInf: n.dxInf,
      hRelleno: n.hRel,
      gRelleno: n.gRel
    };
  }
  let qn = 0, Gn = -1;
  const Wn = () => new Promise((n) => setTimeout(n, 0));
  function en(n, l, d = "text/plain") {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([
      n
    ], {
      type: d
    })), a.download = l, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 2e3);
  }
  function Vt(n, l, d, a, x, h) {
    var _a;
    const e = [], c = Yn(l, d, a);
    return e.push("# OpenSeesPy \u2014 alcantarilla caj\xF3n con carga m\xF3vil HL-93 (exportado desde Hekatan Struct)"), e.push("# 2D (ndm 2, ndf 3): X horizontal, Y del script = Z de Hekatan. Unidades kN, m."), e.push("# Barras elasticTimoshenkoBeam (As = 5/6\xB7A, como SAP2000 en un rect\xE1ngulo). Un an\xE1lisis por posici\xF3n."), e.push("import json, openseespy.opensees as ops"), e.push(`E, G = ${x}, ${x / (2 * (1 + h))}`), e.push("def modelo():"), e.push("    ops.wipe(); ops.model('basic', '-ndm', 2, '-ndf', 3)"), n.nodes.forEach((p, g) => e.push(`    ops.node(${g + 1}, ${p[0]}, ${p[2]})`)), e.push("    ops.geomTransf('Linear', 1)"), n.elements.forEach((p, g) => {
      const r = n.elementInputs.areas.get(g), $ = n.elementInputs.momentsOfInertiaZ.get(g);
      e.push(`    ops.element('ElasticTimoshenkoBeam', ${g + 1}, ${p[0] + 1}, ${p[1] + 1}, E, G, ${r}, ${$}, ${r * 5 / 6}, 1)`);
    }), e.push("    ops.uniaxialMaterial('Elastic', 1, 1.0)"), (n.springs ?? []).forEach((p, g) => {
      const r = n.nodes[p.node];
      e.push(`    ops.node(${1e5 + g}, ${r[0]}, ${r[2]}); ops.fix(${1e5 + g}, 1, 1, 1)`), e.push(`    ops.uniaxialMaterial('Elastic', ${1e3 + g}, ${p.k})`), e.push(`    ops.element('zeroLength', ${1e5 + g}, ${1e5 + g}, ${p.node + 1}, '-mat', ${1e3 + g}, '-dir', 2)`);
    }), (_a = n.nodeInputs.supports) == null ? void 0 : _a.forEach((p, g) => {
      p[0] && e.push(`    ops.fix(${g + 1}, 1, 0, 0)`);
    }), e.push(`casos = ${JSON.stringify(c.map((p) => ({
      n: p.nombre,
      x: p.xF,
      c: p.cargas.map(([g, r]) => [
        g + 1,
        r
      ])
    })))}`), e.push("res = {}"), e.push("for caso in casos:"), e.push("    modelo(); ops.timeSeries('Linear', 1); ops.pattern('Plain', 1, 1)"), e.push("    for nd, P in caso['c']: ops.load(nd, 0.0, -P, 0.0)"), e.push("    ops.system('BandGeneral'); ops.numberer('RCM'); ops.constraints('Plain'); ops.integrator('LoadControl', 1.0)"), e.push("    ops.algorithm('Linear'); ops.analysis('Static'); ops.analyze(1)"), e.push(`    U = [ops.nodeDisp(i + 1) for i in range(${n.nodes.length})]`), e.push(`    F = [ops.eleResponse(e + 1, 'localForce') for e in range(${n.elements.length})]`), e.push("    res[caso['n']] = {'x': caso['x'], 'U': U, 'F': F}"), e.push("json.dump(res, open('opensees_carga_movil.json', 'w'))"), e.push("print('OK', len(res), 'posiciones')"), e.join(`
`) + `
`;
  }
  function et(n, l, d, a, x) {
    return {
      id: n,
      name: l,
      category: "1\uFE0F\u20E3 Frames \xB7 \u{1F69A} Carga m\xF3vil y puentes",
      params: Ut(d),
      guide: a,
      viewFrom: [
        0.3,
        -1,
        0.3
      ],
      defaultFrameResult: "none",
      availableShellResults: [
        "none"
      ],
      build(h, e, c) {
        Qn();
        const p = ++qn, g = Nn.v, r = Bt(h), $ = Et(r);
        vn.__hekatanCliScript = $.heks, bt.build({}, e, c);
        const b = () => p === qn && Nn.v === g, L = g !== Gn;
        Gn = g, setTimeout(async () => {
          if (!b() || typeof document > "u" || typeof requestAnimationFrame > "u") return;
          const N = e.nodes.rawVal ?? e.nodes.val, H = e.elements.rawVal ?? e.elements.val, U = e.nodeInputs.rawVal ?? e.nodeInputs.val, ee = e.elementInputs.rawVal ?? e.elementInputs.val, ce = vn.__hekatanCliSprings ?? [], X = {
            nodes: N,
            elements: H,
            nodeInputs: U,
            elementInputs: ee,
            springs: ce
          }, T = Ct(N, (m) => Math.abs(m[2] - r.H) < 1e-6), P = Vn({
            sepTrasera: h.sep2,
            IM: h.IM,
            ancho: h.ancho,
            conCarril: !!h.carril
          }), B = Kn(T, P, r.dx), J = Ht(b);
          J.progreso(Fe("L\xEDneas de influencia:", "Influence lines:"), 0);
          const q = await It(X, T, {
            progreso: async (m) => {
              J.progreso(Fe("L\xEDneas de influencia:", "Influence lines:"), m), await Wn();
            }
          });
          if (!b()) {
            J.dispose();
            return;
          }
          const re = $.relleno.size ? Pt(X, new Map([
            ...$.relleno
          ].map(([m, Z]) => [
            N.findIndex((F) => {
              const Y = $.nudos.get(m);
              return Math.abs(F[0] - Y[0]) < 1e-9 && Math.abs(F[2] - Y[2]) < 1e-9;
            }),
            [
              0,
              0,
              -Z,
              0,
              0,
              0
            ]
          ]))) : null, K = (m) => {
            const Z = H[m], F = N[Z[0]], Y = N[Z[1]];
            return Math.abs(F[0] - Y[0]) < 1e-9 ? r.tMuro : Math.abs(F[2] - r.H) < 1e-6 ? r.tSup : r.tInf;
          }, G = r.nCeldas * r.L, y = (m) => {
            const Z = H[m], F = N[Z[0]], Y = N[Z[1]];
            return Math.abs(F[0] - Y[0]) < 1e-9 ? [
              F[2] < 1e-9 ? -r.tInf / 2 : 0,
              Y[2] > r.H - 1e-9 ? -r.tSup / 2 : 0
            ] : [
              F[0] < 1e-9 ? r.tMuro / 2 : 0,
              Y[0] > G - 1e-9 ? r.tMuro / 2 : 0
            ];
          }, v = [
            {
              etiqueta: "SAP2000 .s2k",
              accion: () => Ot(e, X, T, P, B, n)
            },
            {
              etiqueta: "ETABS .e2k",
              accion: () => Dt(e, n)
            },
            {
              etiqueta: "OpenSeesPy .py",
              accion: () => en(Vt(X, T, P, B, r.E, r.nu), `${n}_opensees.py`, "text/x-python")
            },
            {
              etiqueta: Fe("Envolvente .csv", "Envelope .csv"),
              accion: () => w && en(_(), `${n}_envolvente.csv`, "text/csv")
            }
          ];
          let w = null;
          const _ = () => {
            const m = [
              "barra,xi,zi,xj,zj,M3i_max,M3i_min,M3j_max,M3j_min,V2i_max,V2i_min,V2j_max,V2j_min,Pi_max,Pi_min (kN, kN\xB7m)"
            ];
            return H.forEach((Z, F) => {
              const Y = N[Z[0]], ue = N[Z[1]], he = F * 6;
              m.push([
                F + 1,
                Y[0],
                Y[2],
                ue[0],
                ue[2],
                w.Fmax[he + 4],
                w.Fmin[he + 4],
                w.Fmax[he + 5],
                w.Fmin[he + 5],
                w.Fmax[he + 2],
                w.Fmin[he + 2],
                w.Fmax[he + 3],
                w.Fmin[he + 3],
                w.Fmax[he],
                w.Fmin[he]
              ].map((je) => +(+je).toFixed(6)).join(","));
            }), m.join(`
`) + `
`;
          };
          J.cargar({
            nodes: N,
            elements: H,
            IL: q,
            vehiculo: P,
            xs: B,
            fija: re,
            canto: K,
            zRodadura: r.H + r.tSup / 2 + (r.hRelleno || 0),
            extremos: y,
            fondo: h.fondo ?? 9,
            x0: N[T.nudos[0]][0],
            titulo: `${Fe("Alcantarilla", "Box culvert")} ${r.nCeldas}\xD7${r.L} m \xD7 ${r.H} m \xB7 ${P.nombre}`,
            exportar: v,
            encuadrar: L,
            avisos: [
              ...x ? [
                x
              ] : [],
              ...Math.abs(h.ancho - 1) < 1e-9 ? [
                Fe("Ancho de reparto AASHTO pendiente de fuente: el eje entero va sobre la franja de 1 m (E = 1 m, del lado seguro).", "AASHTO distribution width pending a source: the whole axle acts on the 1 m strip (E = 1 m, conservative).")
              ] : [
                Fe(`Ejes repartidos en E = ${h.ancho} m (dato del usuario).`, `Axles spread over E = ${h.ancho} m (user input).`)
              ]
            ],
            notas: [
              Fe("Franja de 1 m, dibujada con 3 m de fondo para verla. Suelo lineal (Winkler).", "1 m strip, drawn 3 m deep to be seen. Linear soil (Winkler)."),
              Fe(`Cami\xF3n y carril: ${le.fuente}.`, `Truck and lane: ${le.fuente}.`),
              ...$.avisos
            ]
          }), await Wn(), b() && (w = Lt(q, P, B, {
            carril: !!h.carril,
            separacionesTraseras: h.varSep ? Tt(0.1) : void 0,
            vehiculoCon: (m) => Vn({
              sepTrasera: m,
              IM: h.IM,
              ancho: h.ancho,
              conCarril: !!h.carril
            })
          }), b() && (J.ponerEnvolvente(w), vn.__hekatanCargaMovilDatos = {
            IL: q,
            env: w,
            xs: B,
            veh: P,
            cam: T,
            modelo: X
          }));
        }, 30);
      }
    };
  }
  function Ot(n, l, d, a, x, h) {
    {
      const e = Yn(d, a, x), c = {};
      for (const r of e) c[r.nombre] = new Map(r.cargas.map(([$, b]) => [
        $,
        [
          0,
          0,
          -b,
          0,
          0,
          0
        ]
      ]));
      const p = {
        ...n.nodeInputs.rawVal,
        cargasPorPatron: c
      }, g = Ft({
        nodes: l.nodes,
        elements: l.elements,
        nodeInputs: p,
        elementInputs: {
          ...l.elementInputs,
          frameLoadsPorPatron: {}
        },
        title: `Alcantarilla + HL-93 (${e.length} posiciones) \u2014 Hekatan`,
        patrones: true
      });
      en(g, `${h}_${e.length}pos.s2k`);
    }
  }
  function Dt(n, l) {
    {
      const d = kt({
        nodes: n.nodes.rawVal,
        elements: n.elements.rawVal,
        nodeInputs: n.nodeInputs.rawVal,
        elementInputs: n.elementInputs.rawVal,
        title: "Alcantarilla \u2014 Hekatan"
      });
      en(d, `${l}.e2k`);
    }
  }
  Yt = et("alcantarilla-carga-movil", "Alcantarilla caj\xF3n con carga m\xF3vil HL-93", {
    nC: 2,
    L: 3,
    H: 2.5,
    tS: 0.3,
    tI: 0.3,
    tM: 0.3,
    ks: 2,
    paso: 0.1
  }, [
    "Abre calculada: alcantarilla t\xEDpica de 2 celdas de 3.0 \xD7 2.5 m, losas y muros de 0.30 m.",
    "El cami\xF3n HL-93 cruza la losa superior paso a paso (un nudo cada 10 cm: los ejes caen en nudo).",
    "Colores = desplazamiento |u| (escala fija para todo el recorrido). Rojo/azul = momento M3.",
    "Al final de la pasada se ven las envolventes (cami\xF3n + carril).",
    "Ancho de reparto E: 1 m por defecto (el eje entero); el de AASHTO est\xE1 pendiente de fuente."
  ]);
  Qt = et("plantilla-alcantarilla-carga-movil", "Plantilla \xB7 Alcantarilla caj\xF3n + carga m\xF3vil (caso grande del v\xEDdeo, tus datos)", {
    nC: 2,
    L: 9.5,
    H: 6,
    tS: 0.5,
    tI: 0.55,
    tM: 0.45,
    ks: 2,
    paso: 0.1
  }, [
    "Caso grande (luz de puente): r\xE9plica de las medidas del v\xEDdeo, 2 celdas de 9.5 \xD7 6 m.",
    "Pon tus celdas, luces, espesores y el balasto ks.",
    "El paso del cami\xF3n es la malla del tablero: los ejes caen siempre en nudo."
  ], "Caso grande (luz de puente), r\xE9plica del v\xEDdeo.");
});
export {
  __tla,
  Yt as a,
  Qt as p
};
