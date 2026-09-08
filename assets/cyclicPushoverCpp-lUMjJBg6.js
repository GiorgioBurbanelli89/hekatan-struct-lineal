import { M as P } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
let m = null;
async function y() {
  return m || (m = await P()), m;
}
function A(s, t) {
  const r = t.length * 8, e = s._malloc(r);
  return s.HEAPF64.set(new Float64Array(t), e / 8), e;
}
async function M(s) {
  const t = await y(), { col: r, beam: e, steelCol: a, dispHistory: b } = s, u = 2 * Math.abs(r.fpc) / (r.epsc0 ?? 2e-3), c = 2 * Math.abs(e.fpc) / (e.epsc0 ?? 2e-3), p = A(t, b), n = t._malloc(4), f = t._malloc(4), _ = t._malloc(4);
  t._cyclic_pushover(s.colHeight, s.beamLength, r.b, r.h, r.fpc, r.epsc0 ?? -2e-3, r.fpcu ?? r.fpc * 0.2, r.epsU ?? -5e-3, r.ft ?? Math.abs(r.fpc) * 0.1, r.Ets ?? u * 0.1, r.Fy_rebar, r.E_rebar, r.b_rebar ?? 0.01, r.rebar_area, r.cover, r.n_rebar, e.b, e.h, e.fpc, e.epsc0 ?? -2e-3, e.fpcu ?? e.fpc * 0.2, e.epsU ?? -5e-3, e.ft ?? Math.abs(e.fpc) * 0.1, e.Ets ?? c * 0.1, e.Fy_rebar, e.E_rebar, e.b_rebar ?? 0.01, e.rebar_area, e.cover, e.n_rebar, (a == null ? void 0 : a.Fy) ?? 0, (a == null ? void 0 : a.E) ?? 0, (a == null ? void 0 : a.b) ?? 0, (a == null ? void 0 : a.A) ?? 0, (a == null ? void 0 : a.I) ?? 0, p, b.length, n, f, _);
  const o = new Int32Array(t.HEAPU8.buffer, _, 1)[0], l = t.HEAPU32[n / 4], i = t.HEAPU32[f / 4], E = Array.from(t.HEAPF64.subarray(l / 8, l / 8 + o)), h = Array.from(t.HEAPF64.subarray(i / 8, i / 8 + o));
  return t._free(p), l && t._free(l), i && t._free(i), t._free(n), t._free(f), t._free(_), { displacements: h, forces: E, nSteps: o };
}
async function U(s, t, r, e, a, b, u) {
  const c = await y(), p = A(c, u), n = c._malloc(4), f = c._malloc(4);
  c._concrete02_test(s, t, r, e, a, b, p, u.length, n, f);
  const _ = new Int32Array(c.HEAPU8.buffer, f, 1)[0], o = c.HEAPU32[n / 4], l = Array.from(c.HEAPF64.subarray(o / 8, o / 8 + _));
  return c._free(p), o && c._free(o), c._free(n), c._free(f), l;
}
export {
  U as concrete02Test,
  M as cyclicPushover
};
