import { M as Bs, __tla as __tla_0 } from "./deform-DmQkkByq.js";
let it, lt, et, at, ct, nt;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function st(t) {
    const r = new Array(12).fill(0);
    if (!t) return r;
    if (t.length >= 12) {
      for (let s = 0; s < 12; s++) r[s] = t[s] ? 1 : 0;
      return r;
    }
    const e = [
      3,
      4,
      5,
      9,
      10,
      11
    ];
    for (let s = 0; s < 6 && s < t.length; s++) t[s] && (r[e[s]] = 1);
    return r;
  }
  const i = await Bs();
  et = function(t, r, e, s, n) {
    if (t.length === 0) return;
    const o = [], D = g(t.flat(), Float64Array, i.HEAPF64);
    o.push(D);
    const W = r.flat(), B = g(W, Uint32Array, i.HEAPU32);
    o.push(B);
    const J = r.map((p) => p.length), l = g(J, Uint32Array, i.HEAPU32);
    o.push(l);
    const C = e.supports ? Array.from(e.supports.keys()) : [], O = e.supports ? Array.from(e.supports.values()).flat().map((p) => p ? 1 : 0) : [], Q = g(C, Uint32Array, i.HEAPU32);
    o.push(Q);
    const P = g(O, Uint8Array, i.HEAPU8);
    o.push(P);
    const A = e.loads ? Array.from(e.loads.keys()) : [], F = e.loads ? Array.from(e.loads.values()).flat() : [], c = g(A, Uint32Array, i.HEAPU32);
    o.push(c);
    const k = g(F, Float64Array, i.HEAPF64);
    o.push(k);
    const m = (p) => {
      const cs = p ? Array.from(p.keys()) : [], Fs = p ? Array.from(p.values()) : [], Xs = g(cs, Uint32Array, i.HEAPU32);
      o.push(Xs);
      const js = g(Fs, Float64Array, i.HEAPF64);
      return o.push(js), {
        keysPtr: Xs,
        valuesPtr: js,
        size: cs.length
      };
    }, h = m(s.elasticities), H = m(s.elasticitiesOrthogonal), _ = m(s.areas), K = m(s.momentsOfInertiaZ), S = m(s.momentsOfInertiaY), b = m(s.shearModuli), f = m(s.torsionalConstants), N = m(s.thicknesses), T = m(s.poissonsRatios), Y = m(s.shearAreasY), L = m(s.shearAreasZ), $ = s.rigidOffsets ? Array.from(s.rigidOffsets.keys()) : [], q = s.rigidOffsets ? Array.from(s.rigidOffsets.values()).flat() : [], os = g($, Uint32Array, i.HEAPU32);
    o.push(os);
    const I = g(q, Float64Array, i.HEAPF64);
    o.push(I);
    const G = s.momentReleases ? Array.from(s.momentReleases.keys()) : [], w = s.momentReleases ? Array.from(s.momentReleases.values()).flatMap(st) : [], ss = g(G, Uint32Array, i.HEAPU32);
    o.push(ss);
    const ls = g(w, Uint8Array, i.HEAPU8);
    o.push(ls);
    const X = i._malloc(4);
    o.push(X);
    const j = i._malloc(4);
    o.push(j);
    const x = i._malloc(4);
    o.push(x);
    const ts = i._malloc(4);
    o.push(ts);
    const es = n ? n.flatMap((p) => [
      p.node,
      p.dof,
      p.k
    ]) : [], R = g(es.length > 0 ? es : [
      0
    ], Float64Array, i.HEAPF64);
    o.push(R);
    const rs = s.plateFormulations, ns = rs ? Array.from(rs.keys()) : [], U = rs ? Array.from(rs.values()) : [], z = g(ns, Uint32Array, i.HEAPU32);
    o.push(z);
    const y = g(U, Uint32Array, i.HEAPU32);
    o.push(y);
    const E = s.drillingTypes, v = E ? Array.from(E.keys()) : [], As = E ? Array.from(E.values()) : [], ys = g(v, Uint32Array, i.HEAPU32);
    o.push(ys);
    const vs = g(As, Uint32Array, i.HEAPU32);
    o.push(vs);
    const fs = s.drillingPenaltyScales, Us = fs ? Array.from(fs.keys()) : [], Cs = fs ? Array.from(fs.values()) : [], Qs = g(Us, Uint32Array, i.HEAPU32);
    o.push(Qs);
    const zs = g(Cs, Float64Array, i.HEAPF64);
    o.push(zs);
    const us = s.membraneModifiers, ms = s.bendingModifiers, Ms = us ? Array.from(us.keys()) : [], $s = us ? Array.from(us.values()) : [], bs = g(Ms, Uint32Array, i.HEAPU32);
    o.push(bs);
    const Os = g($s, Float64Array, i.HEAPF64);
    o.push(Os);
    const Ss = ms ? Array.from(ms.keys()) : [], ws = ms ? Array.from(ms.values()) : [], Hs = g(Ss, Uint32Array, i.HEAPU32);
    o.push(Hs);
    const gs = g(ws, Float64Array, i.HEAPF64);
    o.push(gs);
    const Es = s.shellModifiers, ps = Es ? Array.from(Es.keys()) : [], Ks = [];
    if (Es) for (const p of ps) {
      const cs = Es.get(p);
      for (let Fs = 0; Fs < 8; Fs++) Ks.push(cs[Fs] ?? 1);
    }
    const xs = g(ps, Uint32Array, i.HEAPU32);
    o.push(xs);
    const ks = g(Ks, Float64Array, i.HEAPF64);
    o.push(ks);
    const ds = s.localAngles, Ps = ds ? Array.from(ds.keys()) : [], Rs = ds ? Array.from(ds.values()) : [], Ds = g(Ps, Uint32Array, i.HEAPU32);
    o.push(Ds);
    const Ws = g(Rs, Float64Array, i.HEAPF64);
    o.push(Ws);
    const Vs = m(e.diaphragms);
    i._deform(D, t.length, B, W.length, l, r.length, Q, P, C.length, c, k, A.length, h.keysPtr, h.valuesPtr, h.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, S.keysPtr, S.valuesPtr, S.size, b.keysPtr, b.valuesPtr, b.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, T.keysPtr, T.valuesPtr, T.size, H.keysPtr, H.valuesPtr, H.size, Y.keysPtr, Y.valuesPtr, Y.size, L.keysPtr, L.valuesPtr, L.size, R, n ? n.length : 0, z, y, ns.length, ys, vs, v.length, Qs, zs, Us.length, bs, Os, Ms.length, Hs, gs, Ss.length, xs, ks, ps.length, Ds, Ws, Ps.length, ss, ls, G.length, s.etabsWallJoint === false ? 0 : 1, Vs.keysPtr, Vs.valuesPtr, Vs.size, s.solidIncompatible === false ? 0 : 1, X, j, x, ts);
    const Ts = i.HEAPU32[X / 4], Js = i.HEAPU32[j / 4], Ys = i.HEAPU32[x / 4], Ls = i.HEAPU32[ts / 4], Ns = new Float64Array(i.HEAPF64.buffer, Ts, Js), qs = new Float64Array(i.HEAPF64.buffer, Ys, Ls), M = /* @__PURE__ */ new Map();
    for (let p = 0; p < Js; p += 7) {
      const cs = Ns[p];
      M.set(cs, Array.from(Ns.slice(p + 1, p + 7)));
    }
    const Z = /* @__PURE__ */ new Map();
    for (let p = 0; p < Ls; p += 7) {
      const cs = qs[p];
      Z.set(cs, Array.from(qs.slice(p + 1, p + 7)));
    }
    return Ts && o.push(Ts), Ys && o.push(Ys), o.forEach((p) => i._free(p)), {
      deformations: M,
      reactions: Z
    };
  };
  function g(t, r, e) {
    const s = new r(t), n = i._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? i.HEAPF64 : r === Uint32Array ? i.HEAPU32 : r === Uint8Array ? i.HEAPU8 : e).set(s, n / s.BYTES_PER_ELEMENT), n;
  }
  const a = await Bs();
  at = function(t, r, e, s, n = 10, o = 0, D = 0, W = 1, B, J) {
    if (t.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const l = [], C = as(t.flat(), Float64Array, a.HEAPF64);
    l.push(C);
    const O = r.flat(), Q = as(O, Uint32Array, a.HEAPU32);
    l.push(Q);
    const P = r.map((M) => M.length), A = as(P, Uint32Array, a.HEAPU32);
    l.push(A);
    const F = e.supports ? Array.from(e.supports.keys()) : [], c = e.supports ? Array.from(e.supports.values()).flat().map((M) => M ? 1 : 0) : [], k = as(F, Uint32Array, a.HEAPU32);
    l.push(k);
    const m = as(c, Uint8Array, a.HEAPU8);
    l.push(m);
    const h = (M) => {
      const Z = M ? Array.from(M.keys()) : [], p = M ? Array.from(M.values()) : [], cs = as(Z, Uint32Array, a.HEAPU32);
      l.push(cs);
      const Fs = as(p, Float64Array, a.HEAPF64);
      return l.push(Fs), {
        keysPtr: cs,
        valuesPtr: Fs,
        size: Z.length
      };
    }, H = h(s.elasticities), _ = h(s.areas), K = h(s.momentsOfInertiaZ), S = h(s.momentsOfInertiaY), b = h(s.shearModuli), f = h(s.torsionalConstants), N = h(s.densities), T = h(s.thicknesses), Y = h(s.poissonsRatios), L = h(s.membraneModifiers), $ = h(s.bendingModifiers), q = s.plateFormulations, os = q ? Array.from(q.keys()) : [], I = q ? Array.from(q.values()) : [], G = as(os, Uint32Array, a.HEAPU32);
    l.push(G);
    const w = as(I, Uint32Array, a.HEAPU32);
    l.push(w);
    const ss = s.drillingTypes, ls = ss ? Array.from(ss.keys()) : [], X = ss ? Array.from(ss.values()) : [], j = as(ls, Uint32Array, a.HEAPU32);
    l.push(j);
    const x = as(X, Uint32Array, a.HEAPU32);
    l.push(x);
    const ts = s.drillingPenaltyScales, es = ts ? Array.from(ts.keys()) : [], R = ts ? Array.from(ts.values()) : [], rs = as(es, Uint32Array, a.HEAPU32);
    l.push(rs);
    const ns = as(R, Float64Array, a.HEAPF64);
    l.push(ns);
    const U = h(s.shearAreasY), z = h(s.shearAreasZ), y = h(s.localAngles), E = s.momentReleases ? Array.from(s.momentReleases.keys()) : [], v = s.momentReleases ? Array.from(s.momentReleases.values()).flatMap(st) : [], As = as(E, Uint32Array, a.HEAPU32);
    l.push(As);
    const ys = as(v, Uint8Array, a.HEAPU8);
    l.push(ys);
    const vs = h(e.masses), fs = h(B ?? e.diaphragms), Us = J ?? e.springs, Cs = Us ? Us.flatMap((M) => [
      M.node,
      M.dof,
      M.k
    ]) : [], Qs = as(Cs.length > 0 ? Cs : [
      0
    ], Float64Array, a.HEAPF64);
    l.push(Qs);
    const zs = a._malloc(4);
    l.push(zs);
    const us = a._malloc(4);
    l.push(us);
    const ms = a._malloc(4);
    l.push(ms);
    const Ms = a._malloc(4);
    l.push(Ms);
    const $s = a._malloc(4);
    l.push($s);
    const bs = a._malloc(4);
    l.push(bs);
    const Os = a._malloc(4);
    l.push(Os);
    const Ss = a._malloc(4);
    l.push(Ss);
    const ws = a._malloc(4);
    l.push(ws);
    const Hs = a._malloc(4);
    l.push(Hs);
    const gs = a._malloc(4);
    l.push(gs), a.HEAPU32[ws / 4] = 0, a.HEAPU32[Hs / 4] = 0, a.HEAPU32[gs / 4] = 0, a._modal(C, t.length, Q, O.length, A, r.length, k, m, F.length, H.keysPtr, H.valuesPtr, H.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, S.keysPtr, S.valuesPtr, S.size, b.keysPtr, b.valuesPtr, b.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, T.keysPtr, T.valuesPtr, T.size, Y.keysPtr, Y.valuesPtr, Y.size, L.keysPtr, L.valuesPtr, L.size, $.keysPtr, $.valuesPtr, $.size, G, w, os.length, j, x, ls.length, rs, ns, es.length, U.keysPtr, U.valuesPtr, U.size, z.keysPtr, z.valuesPtr, z.size, y.keysPtr, y.valuesPtr, y.size, As, ys, E.length, vs.keysPtr, vs.valuesPtr, vs.size, W, fs.keysPtr, fs.valuesPtr, fs.size, Qs, Us ? Us.length : 0, s.etabsWallJoint === false ? 0 : 1, n, o, D, zs, us, ms, Ms, $s, bs, Os, Ss, ws, Hs, gs);
    const Es = a.HEAPU32[zs / 4], ps = a.HEAPU32[us / 4], Ks = a.HEAPU32[ms / 4], xs = a.HEAPU32[Ms / 4], ks = a.HEAPU32[$s / 4], ds = a.HEAPU32[bs / 4], Ps = a.HEAPU32[Os / 4], Rs = a.HEAPU32[Ss / 4];
    let Ds = [], Ws = [], Vs = [];
    if (ps > 0 && Es) {
      const M = new Float64Array(a.HEAPF64.buffer, Es, ps);
      Ds = Array.from(M), l.push(Es);
    }
    if (xs > 0 && ks > 0 && Ks) {
      const M = new Float64Array(a.HEAPF64.buffer, Ks, xs * ks);
      for (let Z = 0; Z < xs; Z++) Ws.push(Array.from(M.slice(Z * ks, (Z + 1) * ks)));
      l.push(Ks);
    }
    if (Ps > 0 && Rs > 0 && ds) {
      const M = new Float64Array(a.HEAPF64.buffer, ds, Ps * Rs);
      for (let Z = 0; Z < Ps; Z++) Vs.push(Array.from(M.slice(Z * Rs, (Z + 1) * Rs)));
      l.push(ds);
    }
    let Ts = [], Js = [], Ys = [];
    const Ls = a.HEAPU32[ws / 4];
    if (Ls && Ps > 0) {
      const M = new Float64Array(a.HEAPF64.buffer, Ls, Ps * 6);
      for (let Z = 0; Z < Ps; Z++) Ts.push(Array.from(M.slice(Z * 6, (Z + 1) * 6)));
      l.push(Ls);
    }
    const Ns = a.HEAPU32[Hs / 4];
    Ns && (Js = Array.from(new Float64Array(a.HEAPF64.buffer, Ns, 6)), l.push(Ns));
    const qs = a.HEAPU32[gs / 4];
    return qs && ps > 0 && (Ys = Array.from(new Float64Array(a.HEAPF64.buffer, qs, ps)), l.push(qs)), l.forEach((M) => a._free(M)), {
      frequencies: Ds,
      modeShapes: Ws,
      massParticipation: Vs,
      participationFactors: Ts,
      totalMass: Js,
      modeScales: Ys
    };
  };
  function as(t, r, e) {
    const s = new r(t), n = a._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? a.HEAPF64 : r === Uint32Array ? a.HEAPU32 : r === Uint8Array ? a.HEAPU8 : e).set(s, n / s.BYTES_PER_ELEMENT), n;
  }
  const u = await Bs();
  lt = function(t, r, e, s, n = 10) {
    if (t.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const o = [], D = _s(t.flat(), Float64Array, u.HEAPF64);
    o.push(D);
    const W = r.flat(), B = _s(W, Uint32Array, u.HEAPU32);
    o.push(B);
    const J = r.map((U) => U.length), l = _s(J, Uint32Array, u.HEAPU32);
    o.push(l);
    const C = e.supports ? Array.from(e.supports.keys()) : [], O = e.supports ? Array.from(e.supports.values()).flat().map((U) => U ? 1 : 0) : [], Q = _s(C, Uint32Array, u.HEAPU32);
    o.push(Q);
    const P = _s(O, Uint8Array, u.HEAPU8);
    o.push(P);
    const A = (U) => {
      const z = U ? Array.from(U.keys()) : [], y = U ? Array.from(U.values()) : [], E = _s(z, Uint32Array, u.HEAPU32);
      o.push(E);
      const v = _s(y, Float64Array, u.HEAPF64);
      return o.push(v), {
        keysPtr: E,
        valuesPtr: v,
        size: z.length
      };
    }, F = A(s.elasticities), c = A(s.areas), k = A(s.momentsOfInertiaZ), m = A(s.momentsOfInertiaY), h = A(s.shearModuli), H = A(s.torsionalConstants), _ = A(s.densities), K = A(s.thicknesses), S = A(s.poissonsRatios), b = A(s.membraneModifiers), f = A(s.bendingModifiers), N = A(s.polarMomentsOfInertia), T = u._malloc(4);
    o.push(T);
    const Y = u._malloc(4);
    o.push(Y);
    const L = u._malloc(4);
    o.push(L);
    const $ = u._malloc(4);
    o.push($);
    const q = u._malloc(4);
    o.push(q);
    const os = u._malloc(4);
    o.push(os);
    const I = u._malloc(4);
    o.push(I);
    const G = u._malloc(4);
    o.push(G), u._modal_paz(D, t.length, B, W.length, l, r.length, Q, P, C.length, F.keysPtr, F.valuesPtr, F.size, c.keysPtr, c.valuesPtr, c.size, k.keysPtr, k.valuesPtr, k.size, m.keysPtr, m.valuesPtr, m.size, h.keysPtr, h.valuesPtr, h.size, H.keysPtr, H.valuesPtr, H.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, S.keysPtr, S.valuesPtr, S.size, b.keysPtr, b.valuesPtr, b.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, n, T, Y, L, $, q, os, I, G);
    const w = u.HEAPU32[T / 4], ss = u.HEAPU32[Y / 4], ls = u.HEAPU32[L / 4], X = u.HEAPU32[$ / 4], j = u.HEAPU32[q / 4], x = u.HEAPU32[os / 4], ts = u.HEAPU32[I / 4], es = u.HEAPU32[G / 4];
    let R = [], rs = [], ns = [];
    if (ss > 0 && w) {
      const U = new Float64Array(u.HEAPF64.buffer, w, ss);
      R = Array.from(U), o.push(w);
    }
    if (X > 0 && j > 0 && ls) {
      const U = new Float64Array(u.HEAPF64.buffer, ls, X * j);
      for (let z = 0; z < X; z++) rs.push(Array.from(U.slice(z * j, (z + 1) * j)));
      o.push(ls);
    }
    if (ts > 0 && es > 0 && x) {
      const U = new Float64Array(u.HEAPF64.buffer, x, ts * es);
      for (let z = 0; z < ts; z++) ns.push(Array.from(U.slice(z * es, (z + 1) * es)));
      o.push(x);
    }
    return o.forEach((U) => u._free(U)), {
      frequencies: R,
      modeShapes: rs,
      massParticipation: ns
    };
  };
  function _s(t, r, e) {
    const s = new r(t), n = u._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? u.HEAPF64 : r === Uint32Array ? u.HEAPU32 : r === Uint8Array ? u.HEAPU8 : e).set(s, n / s.BYTES_PER_ELEMENT), n;
  }
  const is = await Bs();
  nt = function(t) {
    const { nodes: r, elements: e, E: s, nu: n, gamma: o, c: D, phi: W, thickness: B = 1, supports: J, surcharge: l = 0, surfaceYThreshold: C = -1e10 } = t, O = [], Q = r.flat(), P = tt(Q);
    O.push(P);
    const A = e.flat(), F = Is(A);
    O.push(F);
    const c = [];
    for (const f of J) c.push(f.node, f.fixX ? 1 : 0, f.fixY ? 1 : 0);
    const k = Is(c);
    O.push(k);
    const m = e.length, h = r.length, H = is._slopeAllocDouble(m);
    O.push(H);
    const _ = is._slopeAllocDouble(h * 2);
    O.push(_);
    const K = is._slopeStabilitySolver(P, h, F, m, s, n, o, D, W, B, k, J.length, l, C, H, _), S = [];
    for (let f = 0; f < m; f++) S.push(is.HEAPF64[H / 8 + f]);
    const b = [];
    for (let f = 0; f < h; f++) b.push([
      is.HEAPF64[_ / 8 + 2 * f],
      is.HEAPF64[_ / 8 + 2 * f + 1]
    ]);
    return O.forEach((f) => is._free(f)), {
      fos: K,
      plasticStrain: S,
      displacements: b
    };
  };
  function tt(t) {
    const r = new Float64Array(t), e = is._malloc(r.length * r.BYTES_PER_ELEMENT);
    return is.HEAPF64.set(r, e / 8), e;
  }
  function Is(t) {
    const r = new Uint32Array(t), e = is._malloc(r.length * r.BYTES_PER_ELEMENT);
    return is.HEAPU32.set(r, e / 4), e;
  }
  const V = await Bs();
  function Zs(t, r, e) {
    const s = new r(t), n = V._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? V.HEAPF64 : r === Uint32Array ? V.HEAPU32 : r === Uint8Array ? V.HEAPU8 : e).set(s, n / s.BYTES_PER_ELEMENT), n;
  }
  ct = function(t) {
    const r = [];
    let e = [], s = 0;
    t.nodes && t.nodes.length > 0 && (s = t.nodes.length, e = t.nodes.flat());
    const n = Zs(e.length > 0 ? e : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(n);
    let o = [], D = 0;
    t.elements && t.elements.length > 0 && (D = t.elements.length, o = t.elements.flat());
    const W = Zs(o.length > 0 ? o : [
      0
    ], Int32Array, V.HEAPU32);
    r.push(W);
    const B = (y) => y === 1 ? 2 : y === 2 ? 1 : y;
    let J = [], l = 0;
    t.bcs && t.bcs.length > 0 && (l = t.bcs.length, J = t.bcs.flatMap((y) => [
      y.node,
      B(y.dof),
      y.dof === 2 ? -y.value : y.value
    ]));
    const C = Zs(J.length > 0 ? J : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(C);
    let O = [], Q = 0;
    t.pointLoads && t.pointLoads.length > 0 && (Q = t.pointLoads.length, O = t.pointLoads.flatMap((y) => [
      y.node,
      B(y.dof),
      y.dof === 2 ? -y.value : y.value
    ]));
    const P = Zs(O.length > 0 ? O : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(P);
    const A = t.meshLx ?? 0, F = t.meshLy ?? 0, c = t.meshNx ?? 0, k = t.meshNy ?? 0, h = {
      none: 0,
      "simply-supported": 1,
      clamped: 2
    }[t.bcType ?? "none"] ?? 0, H = t.theoryType ?? 0;
    let _ = [], K = 0;
    t.springs && t.springs.length > 0 && (K = t.springs.length, _ = t.springs.flatMap((y) => [
      y.node,
      B(y.dof),
      y.k
    ]));
    const S = Zs(_.length > 0 ? _ : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(S);
    let b = [], f = 0;
    t.thicknesses && t.thicknesses.length > 0 && (f = t.thicknesses.length, b = t.thicknesses.slice());
    const N = Zs(b.length > 0 ? b : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(N);
    const T = V._malloc(4);
    r.push(T);
    const Y = V._malloc(4);
    r.push(Y);
    const L = V._malloc(4);
    r.push(L);
    const $ = V._malloc(4);
    r.push($), V._plate_q4_solve(n, s, W, D, t.E, t.nu, t.thickness, C, l, t.pressure ?? 0, P, Q, A, F, c, k, h, H, S, K, N, f, T, Y, L, $);
    const q = V.HEAPU32[T / 4], os = V.HEAPU32[Y / 4], I = V.HEAPU32[L / 4], G = V.HEAPU32[$ / 4], w = new Float64Array(V.HEAPF64.buffer, q, os), ss = w[0], ls = w[1], X = [];
    let j = 0;
    for (let y = 0; y < ss; y++) {
      const E = 2 + y * 5, v = {
        x: w[E],
        y: w[E + 1],
        w: w[E + 2],
        bx: w[E + 3],
        by: w[E + 4],
        rx: w[E + 4],
        ry: -w[E + 3]
      };
      X.push(v), Math.abs(v.w) > Math.abs(j) && (j = v.w);
    }
    const x = new Float64Array(V.HEAPF64.buffer, I, G), ts = [];
    let es = 0, R = 0, rs = 0, ns = 0, U = 0;
    for (let y = 0; y < ls; y++) {
      const E = y * 9, v = {
        nodes: [
          x[E],
          x[E + 1],
          x[E + 2],
          x[E + 3]
        ],
        Mxx: x[E + 4],
        Myy: x[E + 5],
        Mxy: x[E + 6],
        Qx: x[E + 7],
        Qy: x[E + 8]
      };
      ts.push(v), Math.abs(v.Mxx) > Math.abs(es) && (es = v.Mxx), Math.abs(v.Myy) > Math.abs(R) && (R = v.Myy), Math.abs(v.Mxy) > Math.abs(rs) && (rs = v.Mxy), Math.abs(v.Qx) > Math.abs(ns) && (ns = v.Qx), Math.abs(v.Qy) > Math.abs(U) && (U = v.Qy);
    }
    let z;
    if (A > 0 && F > 0) {
      const y = A / 2, E = F / 2;
      let v = 1 / 0;
      for (const As of X) {
        const ys = Math.hypot(As.x - y, As.y - E);
        ys < v && (v = ys, z = As.w);
      }
    }
    return q && r.push(q), I && r.push(I), r.forEach((y) => V._free(y)), {
      nodeResults: X,
      elementResults: ts,
      maxW: j,
      maxMxx: es,
      maxMyy: R,
      maxMxy: rs,
      maxQx: ns,
      maxQy: U,
      centerW: z
    };
  };
  const d = await Bs();
  it = function(t, r, e, s) {
    if (t.length === 0) return {
      nNodes: 0,
      nElements: 0,
      nDOF: 0,
      elements: [],
      K_assembled_sparse: [],
      K_assembled_nnz: 0,
      F_applied: [],
      U_full: [],
      R_full: [],
      freeDOFs: [],
      fixedDOFs: []
    };
    const n = [], o = hs(t.flat(), Float64Array, d.HEAPF64);
    n.push(o);
    const D = r.flat(), W = hs(D, Uint32Array, d.HEAPU32);
    n.push(W);
    const B = r.map((R) => R.length), J = hs(B, Uint32Array, d.HEAPU32);
    n.push(J);
    const l = e.supports ? Array.from(e.supports.keys()) : [], C = e.supports ? Array.from(e.supports.values()).flat().map((R) => R ? 1 : 0) : [], O = hs(l, Uint32Array, d.HEAPU32);
    n.push(O);
    const Q = hs(C, Uint8Array, d.HEAPU8);
    n.push(Q);
    const P = e.loads ? Array.from(e.loads.keys()) : [], A = e.loads ? Array.from(e.loads.values()).flat() : [], F = hs(P, Uint32Array, d.HEAPU32);
    n.push(F);
    const c = hs(A, Float64Array, d.HEAPF64);
    n.push(c);
    const k = (R) => {
      const rs = R ? Array.from(R.keys()) : [], ns = R ? Array.from(R.values()) : [], U = hs(rs, Uint32Array, d.HEAPU32);
      n.push(U);
      const z = hs(ns, Float64Array, d.HEAPF64);
      return n.push(z), {
        keysPtr: U,
        valuesPtr: z,
        size: rs.length
      };
    }, m = k(s.elasticities), h = k(s.areas), H = k(s.momentsOfInertiaZ), _ = k(s.momentsOfInertiaY), K = k(s.shearModuli), S = k(s.torsionalConstants), b = k(s.thicknesses), f = k(s.poissonsRatios), N = k(s.shearAreasY), T = k(s.shearAreasZ), Y = d._malloc(4);
    n.push(Y);
    const L = d._malloc(4);
    n.push(L);
    const $ = d._malloc(4);
    n.push($);
    const q = d._malloc(4);
    n.push(q);
    const os = d._malloc(4);
    n.push(os);
    const I = d._malloc(4);
    n.push(I), d._didactic_solve(o, t.length, W, D.length, J, r.length, O, Q, l.length, F, c, P.length, m.keysPtr, m.valuesPtr, m.size, h.keysPtr, h.valuesPtr, h.size, H.keysPtr, H.valuesPtr, H.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, S.keysPtr, S.valuesPtr, S.size, b.keysPtr, b.valuesPtr, b.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, T.keysPtr, T.valuesPtr, T.size, Y, L, $, q, os, I);
    const G = d.HEAPU32[Y / 4], w = d.HEAPU32[L / 4], ss = d.HEAPU32[$ / 4], ls = d.HEAPU32[q / 4], X = d.HEAPU32[os / 4], j = d.HEAPU32[I / 4], x = G && w > 0 ? Array.from(new Float64Array(d.HEAPF64.buffer, G, w)) : [], ts = ss && ls > 0 ? Array.from(new Float64Array(d.HEAPF64.buffer, ss, ls)) : [], es = X && j > 0 ? Array.from(new Float64Array(d.HEAPF64.buffer, X, j)) : [];
    return G && n.push(G), ss && n.push(ss), X && n.push(X), n.forEach((R) => d._free(R)), rt(x, ts, es, t.length, r.length);
  };
  function rt(t, r, e, s, n) {
    const o = s * 6, D = [];
    if (t.length > 0) {
      const P = t[0], A = [];
      for (let F = 0; F < P; F++) A.push(t[1 + F]);
      for (let F = 0; F < P; F++) {
        let c = A[F];
        const k = t[c++], m = t[c++], h = t[c++], H = h * h, _ = Gs(t.slice(c, c + H), h);
        c += H;
        const K = Gs(t.slice(c, c + H), h);
        c += H;
        const S = Gs(t.slice(c, c + H), h);
        c += H;
        const b = Gs(t.slice(c, c + 9), 3);
        c += 9;
        const f = t[c++], N = t[c++], T = t[c++], Y = t[c++], L = t[c++], $ = t[c++], q = t[c++], os = t[c++], I = t[c++], G = t[c++], w = t[c++];
        D.push({
          index: k,
          type: m === 0 ? "frame" : "shell-Q4",
          nDOF: h,
          K_local: _,
          T: K,
          K_global: S,
          lambda: b,
          L: f,
          E: N,
          A: T,
          Iz: Y,
          Iy: L,
          G: $,
          J: q,
          t: os,
          nu: I,
          phiZ: G,
          phiY: w
        });
      }
    }
    const W = [];
    let B = 0;
    if (r.length > 0) {
      B = r[0];
      for (let P = 0; P < B; P++) {
        const A = 1 + P * 3;
        W.push({
          row: r[A],
          col: r[A + 1],
          value: r[A + 2]
        });
      }
    }
    let J = [], l = [], C = [], O = [], Q = [];
    if (e.length > 0) {
      let P = 0;
      const A = e[P++];
      J = e.slice(P, P + A), P += A, l = e.slice(P, P + A), P += A, C = e.slice(P, P + A), P += A;
      const F = e[P++];
      O = e.slice(P, P + F).map(Math.round), P += F;
      const c = e[P++];
      Q = e.slice(P, P + c).map(Math.round);
    }
    return {
      nNodes: s,
      nElements: n,
      nDOF: o,
      elements: D,
      K_assembled_sparse: W,
      K_assembled_nnz: B,
      F_applied: J,
      U_full: l,
      R_full: C,
      freeDOFs: O,
      fixedDOFs: Q
    };
  }
  function Gs(t, r) {
    const e = [];
    for (let s = 0; s < r; s++) e.push(t.slice(s * r, (s + 1) * r));
    return e;
  }
  function hs(t, r, e) {
    const s = new r(t), n = d._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? d.HEAPF64 : r === Uint32Array ? d.HEAPU32 : r === Uint8Array ? d.HEAPU8 : e).set(s, n / s.BYTES_PER_ELEMENT), n;
  }
});
export {
  __tla,
  it as a,
  lt as b,
  et as d,
  at as m,
  ct as p,
  nt as s
};
