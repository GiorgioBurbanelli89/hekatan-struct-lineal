import { b, B as y, V as P, d as E, g as F, h as L, i as B, j as M } from "./theme-DQ--CgsI.js";
function x(o, h, p, n, c = "#00e5ff") {
  const t = document.createElement("canvas"), e = t.getContext("2d");
  e.font = "bold 96px system-ui, -apple-system, sans-serif";
  const g = Math.ceil(e.measureText(o).width);
  t.width = g + 32 * 2, t.height = 96 + 32 * 2, e.font = "bold 96px system-ui, -apple-system, sans-serif", e.fillStyle = "rgba(0,0,0,0.75)";
  const l = t.height / 2;
  e.beginPath(), e.moveTo(l, 0), e.arcTo(t.width, 0, t.width, l, l), e.arcTo(t.width, t.height, t.width - l, t.height, l), e.arcTo(0, t.height, 0, t.height - l, l), e.arcTo(0, 0, l, 0, l), e.closePath(), e.fill(), e.fillStyle = c, e.textBaseline = "middle", e.fillText(o, 32, t.height / 2);
  const f = new F(t);
  f.minFilter = L, f.magFilter = L, f.anisotropy = 16, f.needsUpdate = true;
  const S = new B({ map: f, depthTest: false, depthWrite: false, transparent: true }), m = new M(S);
  m.position.set(h, p, n);
  const w = 0.45, T = t.width / t.height;
  return m.scale.set(w * T, w, 1), m.userData.isCota = true, m;
}
function r(o, h, p = 58879) {
  const n = new b({ color: p, depthTest: false }), c = new y().setFromPoints([new P(...o), new P(...h)]), a = new E(c, n);
  return a.renderOrder = 999, a.userData.isCota = true, a;
}
function v(o, h, p) {
  const n = [], c = h[h.length - 1] + 1, a = o[o.length - 1] + 1, i = p[0];
  for (let s = 0; s < o.length - 1; s++) {
    const t = o[s], e = o[s + 1], g = e - t;
    n.push(r([t, c, i], [e, c, i])), n.push(r([t, c - 0.15, i], [t, c + 0.15, i])), n.push(r([e, c - 0.15, i], [e, c + 0.15, i])), n.push(x(`${g.toFixed(2)} m`, (t + e) / 2, c + 0.35, i));
  }
  for (let s = 0; s < h.length - 1; s++) {
    const t = h[s], e = h[s + 1], g = e - t;
    n.push(r([a, t, i], [a, e, i])), n.push(r([a - 0.15, t, i], [a + 0.15, t, i])), n.push(r([a - 0.15, e, i], [a + 0.15, e, i])), n.push(x(`${g.toFixed(2)} m`, a + 0.35, (t + e) / 2, i));
  }
  const u = o[0] - 1, d = h[0];
  for (let s = 0; s < p.length - 1; s++) {
    const t = p[s], e = p[s + 1], g = e - t;
    n.push(r([u, d, t], [u, d, e])), n.push(r([u - 0.15, d, t], [u + 0.15, d, t])), n.push(r([u - 0.15, d, e], [u + 0.15, d, e])), n.push(x(`Piso ${s + 1}: ${g.toFixed(2)} m`, u - 0.5, d, (t + e) / 2));
  }
  return n;
}
export {
  x as a,
  v as b,
  r as m
};
