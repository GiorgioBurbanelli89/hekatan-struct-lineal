import { M as Ks, __tla as __tla_0 } from "./deform-CK_Uh0DH.js";
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
  const c = await Ks();
  et = function(t, r, e, s, a) {
    if (t.length === 0) return;
    const o = [], $ = H(t.flat(), Float64Array, c.HEAPF64);
    o.push($);
    const D = r.flat(), Z = H(D, Uint32Array, c.HEAPU32);
    o.push(Z);
    const W = r.map((g) => g.length), l = H(W, Uint32Array, c.HEAPU32);
    o.push(l);
    const J = e.supports ? Array.from(e.supports.keys()) : [], b = e.supports ? Array.from(e.supports.values()).flat().map((g) => g ? 1 : 0) : [], B = H(J, Uint32Array, c.HEAPU32);
    o.push(B);
    const i = H(b, Uint8Array, c.HEAPU8);
    o.push(i);
    const y = e.loads ? Array.from(e.loads.keys()) : [], d = e.loads ? Array.from(e.loads.values()).flat() : [], n = H(y, Uint32Array, c.HEAPU32);
    o.push(n);
    const k = H(d, Float64Array, c.HEAPF64);
    o.push(k);
    const m = (g) => {
      const Es = g ? Array.from(g.keys()) : [], qs = g ? Array.from(g.values()) : [], Xs = H(Es, Uint32Array, c.HEAPU32);
      o.push(Xs);
      const js = H(qs, Float64Array, c.HEAPF64);
      return o.push(js), {
        keysPtr: Xs,
        valuesPtr: js,
        size: Es.length
      };
    }, P = m(s.elasticities), U = m(s.elasticitiesOrthogonal), _ = m(s.areas), K = m(s.momentsOfInertiaZ), O = m(s.momentsOfInertiaY), M = m(s.shearModuli), f = m(s.torsionalConstants), N = m(s.thicknesses), T = m(s.poissonsRatios), Y = m(s.shearAreasY), L = m(s.shearAreasZ), Q = s.rigidOffsets ? Array.from(s.rigidOffsets.keys()) : [], q = s.rigidOffsets ? Array.from(s.rigidOffsets.values()).flat() : [], rs = H(Q, Uint32Array, c.HEAPU32);
    o.push(rs);
    const j = H(q, Float64Array, c.HEAPF64);
    o.push(j);
    const C = s.momentReleases ? Array.from(s.momentReleases.keys()) : [], S = s.momentReleases ? Array.from(s.momentReleases.values()).flatMap(st) : [], I = H(C, Uint32Array, c.HEAPU32);
    o.push(I);
    const ls = H(S, Uint8Array, c.HEAPU8);
    o.push(ls);
    const G = c._malloc(4);
    o.push(G);
    const X = c._malloc(4);
    o.push(X);
    const x = c._malloc(4);
    o.push(x);
    const ss = c._malloc(4);
    o.push(ss);
    const os = a ? a.flatMap((g) => [
      g.node,
      g.dof,
      g.k
    ]) : [], R = H(os.length > 0 ? os : [
      0
    ], Float64Array, c.HEAPF64);
    o.push(R);
    const ts = s.plateFormulations, ns = ts ? Array.from(ts.keys()) : [], F = ts ? Array.from(ts.values()) : [], z = H(ns, Uint32Array, c.HEAPU32);
    o.push(z);
    const A = H(F, Uint32Array, c.HEAPU32);
    o.push(A);
    const E = s.drillingTypes, v = E ? Array.from(E.keys()) : [], Ps = E ? Array.from(E.values()) : [], hs = H(v, Uint32Array, c.HEAPU32);
    o.push(hs);
    const gs = H(Ps, Uint32Array, c.HEAPU32);
    o.push(gs);
    const ys = s.drillingPenaltyScales, ps = ys ? Array.from(ys.keys()) : [], Zs = ys ? Array.from(ys.values()) : [], xs = H(ps, Uint32Array, c.HEAPU32);
    o.push(xs);
    const Hs = H(Zs, Float64Array, c.HEAPF64);
    o.push(Hs);
    const As = s.membraneModifiers, fs = s.bendingModifiers, ks = As ? Array.from(As.keys()) : [], Rs = As ? Array.from(As.values()) : [], _s = H(ks, Uint32Array, c.HEAPU32);
    o.push(_s);
    const vs = H(Rs, Float64Array, c.HEAPF64);
    o.push(vs);
    const zs = fs ? Array.from(fs.keys()) : [], Vs = fs ? Array.from(fs.values()) : [], Ts = H(zs, Uint32Array, c.HEAPU32);
    o.push(Ts);
    const Ms = H(Vs, Float64Array, c.HEAPF64);
    o.push(Ms);
    const us = s.shellModifiers, ms = us ? Array.from(us.keys()) : [], bs = [];
    if (us) for (const g of ms) {
      const Es = us.get(g);
      for (let qs = 0; qs < 8; qs++) bs.push(Es[qs] ?? 1);
    }
    const Os = H(ms, Uint32Array, c.HEAPU32);
    o.push(Os);
    const ds = H(bs, Float64Array, c.HEAPF64);
    o.push(ds);
    const Fs = s.localAngles, Ys = Fs ? Array.from(Fs.keys()) : [], Bs = Fs ? Array.from(Fs.values()) : [], w = H(Ys, Uint32Array, c.HEAPU32);
    o.push(w);
    const as = H(Bs, Float64Array, c.HEAPF64);
    o.push(as);
    const Ls = m(e.diaphragms);
    c._deform($, t.length, Z, D.length, l, r.length, B, i, J.length, n, k, y.length, P.keysPtr, P.valuesPtr, P.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, O.keysPtr, O.valuesPtr, O.size, M.keysPtr, M.valuesPtr, M.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, T.keysPtr, T.valuesPtr, T.size, U.keysPtr, U.valuesPtr, U.size, Y.keysPtr, Y.valuesPtr, Y.size, L.keysPtr, L.valuesPtr, L.size, R, a ? a.length : 0, z, A, ns.length, hs, gs, v.length, xs, Hs, ps.length, _s, vs, ks.length, Ts, Ms, zs.length, Os, ds, ms.length, w, as, Ys.length, I, ls, C.length, s.etabsWallJoint === false ? 0 : 1, Ls.keysPtr, Ls.valuesPtr, Ls.size, s.solidIncompatible === false ? 0 : 1, G, X, x, ss);
    const Ss = c.HEAPU32[G / 4], Ns = c.HEAPU32[X / 4], $s = c.HEAPU32[x / 4], Ds = c.HEAPU32[ss / 4], Ws = new Float64Array(c.HEAPF64.buffer, Ss, Ns), Js = new Float64Array(c.HEAPF64.buffer, $s, Ds), Cs = /* @__PURE__ */ new Map();
    for (let g = 0; g < Ns; g += 7) {
      const Es = Ws[g];
      Cs.set(Es, Array.from(Ws.slice(g + 1, g + 7)));
    }
    const Gs = /* @__PURE__ */ new Map();
    for (let g = 0; g < Ds; g += 7) {
      const Es = Js[g];
      Gs.set(Es, Array.from(Js.slice(g + 1, g + 7)));
    }
    return Ss && o.push(Ss), $s && o.push($s), o.forEach((g) => c._free(g)), {
      deformations: Cs,
      reactions: Gs
    };
  };
  function H(t, r, e) {
    const s = new r(t), a = c._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? c.HEAPF64 : r === Uint32Array ? c.HEAPU32 : r === Uint8Array ? c.HEAPU8 : e).set(s, a / s.BYTES_PER_ELEMENT), a;
  }
  const h = await Ks();
  at = function(t, r, e, s, a = 10, o = 0, $ = 0, D = 1, Z, W) {
    if (t.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const l = [], J = es(t.flat(), Float64Array, h.HEAPF64);
    l.push(J);
    const b = r.flat(), B = es(b, Uint32Array, h.HEAPU32);
    l.push(B);
    const i = r.map((w) => w.length), y = es(i, Uint32Array, h.HEAPU32);
    l.push(y);
    const d = e.supports ? Array.from(e.supports.keys()) : [], n = e.supports ? Array.from(e.supports.values()).flat().map((w) => w ? 1 : 0) : [], k = es(d, Uint32Array, h.HEAPU32);
    l.push(k);
    const m = es(n, Uint8Array, h.HEAPU8);
    l.push(m);
    const P = (w) => {
      const as = w ? Array.from(w.keys()) : [], Ls = w ? Array.from(w.values()) : [], Ss = es(as, Uint32Array, h.HEAPU32);
      l.push(Ss);
      const Ns = es(Ls, Float64Array, h.HEAPF64);
      return l.push(Ns), {
        keysPtr: Ss,
        valuesPtr: Ns,
        size: as.length
      };
    }, U = P(s.elasticities), _ = P(s.areas), K = P(s.momentsOfInertiaZ), O = P(s.momentsOfInertiaY), M = P(s.shearModuli), f = P(s.torsionalConstants), N = P(s.densities), T = P(s.thicknesses), Y = P(s.poissonsRatios), L = P(s.membraneModifiers), Q = P(s.bendingModifiers), q = s.plateFormulations, rs = q ? Array.from(q.keys()) : [], j = q ? Array.from(q.values()) : [], C = es(rs, Uint32Array, h.HEAPU32);
    l.push(C);
    const S = es(j, Uint32Array, h.HEAPU32);
    l.push(S);
    const I = s.drillingTypes, ls = I ? Array.from(I.keys()) : [], G = I ? Array.from(I.values()) : [], X = es(ls, Uint32Array, h.HEAPU32);
    l.push(X);
    const x = es(G, Uint32Array, h.HEAPU32);
    l.push(x);
    const ss = s.drillingPenaltyScales, os = ss ? Array.from(ss.keys()) : [], R = ss ? Array.from(ss.values()) : [], ts = es(os, Uint32Array, h.HEAPU32);
    l.push(ts);
    const ns = es(R, Float64Array, h.HEAPF64);
    l.push(ns);
    const F = P(s.shearAreasY), z = P(s.shearAreasZ), A = P(s.localAngles), E = s.momentReleases ? Array.from(s.momentReleases.keys()) : [], v = s.momentReleases ? Array.from(s.momentReleases.values()).flatMap(st) : [], Ps = es(E, Uint32Array, h.HEAPU32);
    l.push(Ps);
    const hs = es(v, Uint8Array, h.HEAPU8);
    l.push(hs);
    const gs = P(e.masses), ys = P(Z ?? e.diaphragms), ps = W ?? e.springs, Zs = ps ? ps.flatMap((w) => [
      w.node,
      w.dof,
      w.k
    ]) : [], xs = es(Zs.length > 0 ? Zs : [
      0
    ], Float64Array, h.HEAPF64);
    l.push(xs);
    const Hs = h._malloc(4);
    l.push(Hs);
    const As = h._malloc(4);
    l.push(As);
    const fs = h._malloc(4);
    l.push(fs);
    const ks = h._malloc(4);
    l.push(ks);
    const Rs = h._malloc(4);
    l.push(Rs);
    const _s = h._malloc(4);
    l.push(_s);
    const vs = h._malloc(4);
    l.push(vs);
    const zs = h._malloc(4);
    l.push(zs), h._modal(J, t.length, B, b.length, y, r.length, k, m, d.length, U.keysPtr, U.valuesPtr, U.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, O.keysPtr, O.valuesPtr, O.size, M.keysPtr, M.valuesPtr, M.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, T.keysPtr, T.valuesPtr, T.size, Y.keysPtr, Y.valuesPtr, Y.size, L.keysPtr, L.valuesPtr, L.size, Q.keysPtr, Q.valuesPtr, Q.size, C, S, rs.length, X, x, ls.length, ts, ns, os.length, F.keysPtr, F.valuesPtr, F.size, z.keysPtr, z.valuesPtr, z.size, A.keysPtr, A.valuesPtr, A.size, Ps, hs, E.length, gs.keysPtr, gs.valuesPtr, gs.size, D, ys.keysPtr, ys.valuesPtr, ys.size, xs, ps ? ps.length : 0, s.etabsWallJoint === false ? 0 : 1, a, o, $, Hs, As, fs, ks, Rs, _s, vs, zs);
    const Vs = h.HEAPU32[Hs / 4], Ts = h.HEAPU32[As / 4], Ms = h.HEAPU32[fs / 4], us = h.HEAPU32[ks / 4], ms = h.HEAPU32[Rs / 4], bs = h.HEAPU32[_s / 4], Os = h.HEAPU32[vs / 4], ds = h.HEAPU32[zs / 4];
    let Fs = [], Ys = [], Bs = [];
    if (Ts > 0 && Vs) {
      const w = new Float64Array(h.HEAPF64.buffer, Vs, Ts);
      Fs = Array.from(w), l.push(Vs);
    }
    if (us > 0 && ms > 0 && Ms) {
      const w = new Float64Array(h.HEAPF64.buffer, Ms, us * ms);
      for (let as = 0; as < us; as++) Ys.push(Array.from(w.slice(as * ms, (as + 1) * ms)));
      l.push(Ms);
    }
    if (Os > 0 && ds > 0 && bs) {
      const w = new Float64Array(h.HEAPF64.buffer, bs, Os * ds);
      for (let as = 0; as < Os; as++) Bs.push(Array.from(w.slice(as * ds, (as + 1) * ds)));
      l.push(bs);
    }
    return l.forEach((w) => h._free(w)), {
      frequencies: Fs,
      modeShapes: Ys,
      massParticipation: Bs
    };
  };
  function es(t, r, e) {
    const s = new r(t), a = h._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? h.HEAPF64 : r === Uint32Array ? h.HEAPU32 : r === Uint8Array ? h.HEAPU8 : e).set(s, a / s.BYTES_PER_ELEMENT), a;
  }
  const u = await Ks();
  lt = function(t, r, e, s, a = 10) {
    if (t.length === 0) return {
      frequencies: [],
      modeShapes: [],
      massParticipation: []
    };
    const o = [], $ = Us(t.flat(), Float64Array, u.HEAPF64);
    o.push($);
    const D = r.flat(), Z = Us(D, Uint32Array, u.HEAPU32);
    o.push(Z);
    const W = r.map((F) => F.length), l = Us(W, Uint32Array, u.HEAPU32);
    o.push(l);
    const J = e.supports ? Array.from(e.supports.keys()) : [], b = e.supports ? Array.from(e.supports.values()).flat().map((F) => F ? 1 : 0) : [], B = Us(J, Uint32Array, u.HEAPU32);
    o.push(B);
    const i = Us(b, Uint8Array, u.HEAPU8);
    o.push(i);
    const y = (F) => {
      const z = F ? Array.from(F.keys()) : [], A = F ? Array.from(F.values()) : [], E = Us(z, Uint32Array, u.HEAPU32);
      o.push(E);
      const v = Us(A, Float64Array, u.HEAPF64);
      return o.push(v), {
        keysPtr: E,
        valuesPtr: v,
        size: z.length
      };
    }, d = y(s.elasticities), n = y(s.areas), k = y(s.momentsOfInertiaZ), m = y(s.momentsOfInertiaY), P = y(s.shearModuli), U = y(s.torsionalConstants), _ = y(s.densities), K = y(s.thicknesses), O = y(s.poissonsRatios), M = y(s.membraneModifiers), f = y(s.bendingModifiers), N = y(s.polarMomentsOfInertia), T = u._malloc(4);
    o.push(T);
    const Y = u._malloc(4);
    o.push(Y);
    const L = u._malloc(4);
    o.push(L);
    const Q = u._malloc(4);
    o.push(Q);
    const q = u._malloc(4);
    o.push(q);
    const rs = u._malloc(4);
    o.push(rs);
    const j = u._malloc(4);
    o.push(j);
    const C = u._malloc(4);
    o.push(C), u._modal_paz($, t.length, Z, D.length, l, r.length, B, i, J.length, d.keysPtr, d.valuesPtr, d.size, n.keysPtr, n.valuesPtr, n.size, k.keysPtr, k.valuesPtr, k.size, m.keysPtr, m.valuesPtr, m.size, P.keysPtr, P.valuesPtr, P.size, U.keysPtr, U.valuesPtr, U.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, O.keysPtr, O.valuesPtr, O.size, M.keysPtr, M.valuesPtr, M.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, a, T, Y, L, Q, q, rs, j, C);
    const S = u.HEAPU32[T / 4], I = u.HEAPU32[Y / 4], ls = u.HEAPU32[L / 4], G = u.HEAPU32[Q / 4], X = u.HEAPU32[q / 4], x = u.HEAPU32[rs / 4], ss = u.HEAPU32[j / 4], os = u.HEAPU32[C / 4];
    let R = [], ts = [], ns = [];
    if (I > 0 && S) {
      const F = new Float64Array(u.HEAPF64.buffer, S, I);
      R = Array.from(F), o.push(S);
    }
    if (G > 0 && X > 0 && ls) {
      const F = new Float64Array(u.HEAPF64.buffer, ls, G * X);
      for (let z = 0; z < G; z++) ts.push(Array.from(F.slice(z * X, (z + 1) * X)));
      o.push(ls);
    }
    if (ss > 0 && os > 0 && x) {
      const F = new Float64Array(u.HEAPF64.buffer, x, ss * os);
      for (let z = 0; z < ss; z++) ns.push(Array.from(F.slice(z * os, (z + 1) * os)));
      o.push(x);
    }
    return o.forEach((F) => u._free(F)), {
      frequencies: R,
      modeShapes: ts,
      massParticipation: ns
    };
  };
  function Us(t, r, e) {
    const s = new r(t), a = u._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? u.HEAPF64 : r === Uint32Array ? u.HEAPU32 : r === Uint8Array ? u.HEAPU8 : e).set(s, a / s.BYTES_PER_ELEMENT), a;
  }
  const cs = await Ks();
  nt = function(t) {
    const { nodes: r, elements: e, E: s, nu: a, gamma: o, c: $, phi: D, thickness: Z = 1, supports: W, surcharge: l = 0, surfaceYThreshold: J = -1e10 } = t, b = [], B = r.flat(), i = tt(B);
    b.push(i);
    const y = e.flat(), d = Is(y);
    b.push(d);
    const n = [];
    for (const f of W) n.push(f.node, f.fixX ? 1 : 0, f.fixY ? 1 : 0);
    const k = Is(n);
    b.push(k);
    const m = e.length, P = r.length, U = cs._slopeAllocDouble(m);
    b.push(U);
    const _ = cs._slopeAllocDouble(P * 2);
    b.push(_);
    const K = cs._slopeStabilitySolver(i, P, d, m, s, a, o, $, D, Z, k, W.length, l, J, U, _), O = [];
    for (let f = 0; f < m; f++) O.push(cs.HEAPF64[U / 8 + f]);
    const M = [];
    for (let f = 0; f < P; f++) M.push([
      cs.HEAPF64[_ / 8 + 2 * f],
      cs.HEAPF64[_ / 8 + 2 * f + 1]
    ]);
    return b.forEach((f) => cs._free(f)), {
      fos: K,
      plasticStrain: O,
      displacements: M
    };
  };
  function tt(t) {
    const r = new Float64Array(t), e = cs._malloc(r.length * r.BYTES_PER_ELEMENT);
    return cs.HEAPF64.set(r, e / 8), e;
  }
  function Is(t) {
    const r = new Uint32Array(t), e = cs._malloc(r.length * r.BYTES_PER_ELEMENT);
    return cs.HEAPU32.set(r, e / 4), e;
  }
  const V = await Ks();
  function ws(t, r, e) {
    const s = new r(t), a = V._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? V.HEAPF64 : r === Uint32Array ? V.HEAPU32 : r === Uint8Array ? V.HEAPU8 : e).set(s, a / s.BYTES_PER_ELEMENT), a;
  }
  ct = function(t) {
    const r = [];
    let e = [], s = 0;
    t.nodes && t.nodes.length > 0 && (s = t.nodes.length, e = t.nodes.flat());
    const a = ws(e.length > 0 ? e : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(a);
    let o = [], $ = 0;
    t.elements && t.elements.length > 0 && ($ = t.elements.length, o = t.elements.flat());
    const D = ws(o.length > 0 ? o : [
      0
    ], Int32Array, V.HEAPU32);
    r.push(D);
    const Z = (A) => A === 1 ? 2 : A === 2 ? 1 : A;
    let W = [], l = 0;
    t.bcs && t.bcs.length > 0 && (l = t.bcs.length, W = t.bcs.flatMap((A) => [
      A.node,
      Z(A.dof),
      A.dof === 2 ? -A.value : A.value
    ]));
    const J = ws(W.length > 0 ? W : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(J);
    let b = [], B = 0;
    t.pointLoads && t.pointLoads.length > 0 && (B = t.pointLoads.length, b = t.pointLoads.flatMap((A) => [
      A.node,
      Z(A.dof),
      A.dof === 2 ? -A.value : A.value
    ]));
    const i = ws(b.length > 0 ? b : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(i);
    const y = t.meshLx ?? 0, d = t.meshLy ?? 0, n = t.meshNx ?? 0, k = t.meshNy ?? 0, P = {
      none: 0,
      "simply-supported": 1,
      clamped: 2
    }[t.bcType ?? "none"] ?? 0, U = t.theoryType ?? 0;
    let _ = [], K = 0;
    t.springs && t.springs.length > 0 && (K = t.springs.length, _ = t.springs.flatMap((A) => [
      A.node,
      Z(A.dof),
      A.k
    ]));
    const O = ws(_.length > 0 ? _ : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(O);
    let M = [], f = 0;
    t.thicknesses && t.thicknesses.length > 0 && (f = t.thicknesses.length, M = t.thicknesses.slice());
    const N = ws(M.length > 0 ? M : [
      0
    ], Float64Array, V.HEAPF64);
    r.push(N);
    const T = V._malloc(4);
    r.push(T);
    const Y = V._malloc(4);
    r.push(Y);
    const L = V._malloc(4);
    r.push(L);
    const Q = V._malloc(4);
    r.push(Q), V._plate_q4_solve(a, s, D, $, t.E, t.nu, t.thickness, J, l, t.pressure ?? 0, i, B, y, d, n, k, P, U, O, K, N, f, T, Y, L, Q);
    const q = V.HEAPU32[T / 4], rs = V.HEAPU32[Y / 4], j = V.HEAPU32[L / 4], C = V.HEAPU32[Q / 4], S = new Float64Array(V.HEAPF64.buffer, q, rs), I = S[0], ls = S[1], G = [];
    let X = 0;
    for (let A = 0; A < I; A++) {
      const E = 2 + A * 5, v = {
        x: S[E],
        y: S[E + 1],
        w: S[E + 2],
        bx: S[E + 3],
        by: S[E + 4],
        rx: S[E + 4],
        ry: -S[E + 3]
      };
      G.push(v), Math.abs(v.w) > Math.abs(X) && (X = v.w);
    }
    const x = new Float64Array(V.HEAPF64.buffer, j, C), ss = [];
    let os = 0, R = 0, ts = 0, ns = 0, F = 0;
    for (let A = 0; A < ls; A++) {
      const E = A * 9, v = {
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
      ss.push(v), Math.abs(v.Mxx) > Math.abs(os) && (os = v.Mxx), Math.abs(v.Myy) > Math.abs(R) && (R = v.Myy), Math.abs(v.Mxy) > Math.abs(ts) && (ts = v.Mxy), Math.abs(v.Qx) > Math.abs(ns) && (ns = v.Qx), Math.abs(v.Qy) > Math.abs(F) && (F = v.Qy);
    }
    let z;
    if (y > 0 && d > 0) {
      const A = y / 2, E = d / 2;
      let v = 1 / 0;
      for (const Ps of G) {
        const hs = Math.hypot(Ps.x - A, Ps.y - E);
        hs < v && (v = hs, z = Ps.w);
      }
    }
    return q && r.push(q), j && r.push(j), r.forEach((A) => V._free(A)), {
      nodeResults: G,
      elementResults: ss,
      maxW: X,
      maxMxx: os,
      maxMyy: R,
      maxMxy: ts,
      maxQx: ns,
      maxQy: F,
      centerW: z
    };
  };
  const p = await Ks();
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
    const a = [], o = is(t.flat(), Float64Array, p.HEAPF64);
    a.push(o);
    const $ = r.flat(), D = is($, Uint32Array, p.HEAPU32);
    a.push(D);
    const Z = r.map((R) => R.length), W = is(Z, Uint32Array, p.HEAPU32);
    a.push(W);
    const l = e.supports ? Array.from(e.supports.keys()) : [], J = e.supports ? Array.from(e.supports.values()).flat().map((R) => R ? 1 : 0) : [], b = is(l, Uint32Array, p.HEAPU32);
    a.push(b);
    const B = is(J, Uint8Array, p.HEAPU8);
    a.push(B);
    const i = e.loads ? Array.from(e.loads.keys()) : [], y = e.loads ? Array.from(e.loads.values()).flat() : [], d = is(i, Uint32Array, p.HEAPU32);
    a.push(d);
    const n = is(y, Float64Array, p.HEAPF64);
    a.push(n);
    const k = (R) => {
      const ts = R ? Array.from(R.keys()) : [], ns = R ? Array.from(R.values()) : [], F = is(ts, Uint32Array, p.HEAPU32);
      a.push(F);
      const z = is(ns, Float64Array, p.HEAPF64);
      return a.push(z), {
        keysPtr: F,
        valuesPtr: z,
        size: ts.length
      };
    }, m = k(s.elasticities), P = k(s.areas), U = k(s.momentsOfInertiaZ), _ = k(s.momentsOfInertiaY), K = k(s.shearModuli), O = k(s.torsionalConstants), M = k(s.thicknesses), f = k(s.poissonsRatios), N = k(s.shearAreasY), T = k(s.shearAreasZ), Y = p._malloc(4);
    a.push(Y);
    const L = p._malloc(4);
    a.push(L);
    const Q = p._malloc(4);
    a.push(Q);
    const q = p._malloc(4);
    a.push(q);
    const rs = p._malloc(4);
    a.push(rs);
    const j = p._malloc(4);
    a.push(j), p._didactic_solve(o, t.length, D, $.length, W, r.length, b, B, l.length, d, n, i.length, m.keysPtr, m.valuesPtr, m.size, P.keysPtr, P.valuesPtr, P.size, U.keysPtr, U.valuesPtr, U.size, _.keysPtr, _.valuesPtr, _.size, K.keysPtr, K.valuesPtr, K.size, O.keysPtr, O.valuesPtr, O.size, M.keysPtr, M.valuesPtr, M.size, f.keysPtr, f.valuesPtr, f.size, N.keysPtr, N.valuesPtr, N.size, T.keysPtr, T.valuesPtr, T.size, Y, L, Q, q, rs, j);
    const C = p.HEAPU32[Y / 4], S = p.HEAPU32[L / 4], I = p.HEAPU32[Q / 4], ls = p.HEAPU32[q / 4], G = p.HEAPU32[rs / 4], X = p.HEAPU32[j / 4], x = C && S > 0 ? Array.from(new Float64Array(p.HEAPF64.buffer, C, S)) : [], ss = I && ls > 0 ? Array.from(new Float64Array(p.HEAPF64.buffer, I, ls)) : [], os = G && X > 0 ? Array.from(new Float64Array(p.HEAPF64.buffer, G, X)) : [];
    return C && a.push(C), I && a.push(I), G && a.push(G), a.forEach((R) => p._free(R)), rt(x, ss, os, t.length, r.length);
  };
  function rt(t, r, e, s, a) {
    const o = s * 6, $ = [];
    if (t.length > 0) {
      const i = t[0], y = [];
      for (let d = 0; d < i; d++) y.push(t[1 + d]);
      for (let d = 0; d < i; d++) {
        let n = y[d];
        const k = t[n++], m = t[n++], P = t[n++], U = P * P, _ = Qs(t.slice(n, n + U), P);
        n += U;
        const K = Qs(t.slice(n, n + U), P);
        n += U;
        const O = Qs(t.slice(n, n + U), P);
        n += U;
        const M = Qs(t.slice(n, n + 9), 3);
        n += 9;
        const f = t[n++], N = t[n++], T = t[n++], Y = t[n++], L = t[n++], Q = t[n++], q = t[n++], rs = t[n++], j = t[n++], C = t[n++], S = t[n++];
        $.push({
          index: k,
          type: m === 0 ? "frame" : "shell-Q4",
          nDOF: P,
          K_local: _,
          T: K,
          K_global: O,
          lambda: M,
          L: f,
          E: N,
          A: T,
          Iz: Y,
          Iy: L,
          G: Q,
          J: q,
          t: rs,
          nu: j,
          phiZ: C,
          phiY: S
        });
      }
    }
    const D = [];
    let Z = 0;
    if (r.length > 0) {
      Z = r[0];
      for (let i = 0; i < Z; i++) {
        const y = 1 + i * 3;
        D.push({
          row: r[y],
          col: r[y + 1],
          value: r[y + 2]
        });
      }
    }
    let W = [], l = [], J = [], b = [], B = [];
    if (e.length > 0) {
      let i = 0;
      const y = e[i++];
      W = e.slice(i, i + y), i += y, l = e.slice(i, i + y), i += y, J = e.slice(i, i + y), i += y;
      const d = e[i++];
      b = e.slice(i, i + d).map(Math.round), i += d;
      const n = e[i++];
      B = e.slice(i, i + n).map(Math.round);
    }
    return {
      nNodes: s,
      nElements: a,
      nDOF: o,
      elements: $,
      K_assembled_sparse: D,
      K_assembled_nnz: Z,
      F_applied: W,
      U_full: l,
      R_full: J,
      freeDOFs: b,
      fixedDOFs: B
    };
  }
  function Qs(t, r) {
    const e = [];
    for (let s = 0; s < r; s++) e.push(t.slice(s * r, (s + 1) * r));
    return e;
  }
  function is(t, r, e) {
    const s = new r(t), a = p._malloc(s.length * s.BYTES_PER_ELEMENT);
    return (r === Float64Array ? p.HEAPF64 : r === Uint32Array ? p.HEAPU32 : r === Uint8Array ? p.HEAPU8 : e).set(s, a / s.BYTES_PER_ELEMENT), a;
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
