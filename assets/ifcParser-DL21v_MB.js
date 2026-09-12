function x(b, l = 1e-3) {
  const m = b.slice(Math.max(0, b.indexOf("DATA;"))), D = /#(\d+)\s*=\s*([A-Z0-9]+)\s*\(([\s\S]*?)\);/g, u = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), c = (s) => {
    const a = [], t = /#(\d+)/g;
    let e;
    for (; e = t.exec(s); ) a.push(+e[1]);
    return a;
  };
  let E;
  for (; E = D.exec(m); ) {
    const s = +E[1], a = E[2], t = E[3];
    switch (a) {
      case "IFCCARTESIANPOINT": {
        const e = t.match(/\(([^)]*)\)/);
        if (e) {
          const o = e[1].split(",").map(Number);
          u.set(s, [o[0] || 0, o[1] || 0, o[2] || 0]);
        }
        break;
      }
      case "IFCPOLYLOOP":
        S.set(s, c(t));
        break;
      case "IFCFACEOUTERBOUND":
      case "IFCFACEBOUND":
        h.set(s, c(t)[0]);
        break;
      case "IFCFACE":
        M.set(s, c(t));
        break;
      case "IFCCLOSEDSHELL":
      case "IFCOPENSHELL":
        d.set(s, c(t));
        break;
      case "IFCFACETEDBREP":
        w.set(s, c(t)[0]);
        break;
      case "IFCSTYLEDITEM": {
        const e = c(t);
        e.length >= 2 && A.set(e[0], e[1]);
        break;
      }
      case "IFCPRESENTATIONSTYLEASSIGNMENT":
        N.set(s, c(t));
        break;
      case "IFCSURFACESTYLE":
        T.set(s, c(t));
        break;
      case "IFCSURFACESTYLESHADING":
      case "IFCSURFACESTYLERENDERING":
        O.set(s, c(t)[0]);
        break;
      case "IFCCOLOURRGB": {
        const e = t.split(",").map((o) => parseFloat(o)).filter((o) => !isNaN(o));
        e.length >= 3 && L.set(s, [e[e.length - 3], e[e.length - 2], e[e.length - 1]]);
        break;
      }
    }
  }
  const P = (s) => {
    const a = A.get(s);
    if (a == null) return [0.72, 0.77, 0.82];
    for (const t of N.get(a) || []) for (const e of T.get(t) || []) {
      const o = L.get(O.get(e) ?? -1);
      if (o) return o;
    }
    return [0.72, 0.77, 0.82];
  }, g = /* @__PURE__ */ new Map(), n = [[1e30, 1e30, 1e30], [-1e30, -1e30, -1e30]];
  let k = 0;
  for (const [s, a] of w) {
    const t = P(s), e = t.map((F) => Math.round(F * 255)).join(",");
    let o = g.get(e);
    o || (o = { positions: [], color: t }, g.set(e, o));
    for (const F of d.get(a) || []) for (const U of M.get(F) || []) {
      const R = S.get(h.get(U) ?? -1);
      if (!R) continue;
      const C = R.map((r) => u.get(r)).filter(Boolean);
      for (let r = 1; r < C.length - 1; r++) {
        for (const I of [C[0], C[r], C[r + 1]]) {
          const i = I[0] * l, f = I[1] * l, p = I[2] * l;
          o.positions.push(i, f, p), i < n[0][0] && (n[0][0] = i), f < n[0][1] && (n[0][1] = f), p < n[0][2] && (n[0][2] = p), i > n[1][0] && (n[1][0] = i), f > n[1][1] && (n[1][1] = f), p > n[1][2] && (n[1][2] = p);
        }
        k++;
      }
    }
  }
  return { grupos: [...g.values()], nTri: k, bbox: n, unidad: l };
}
export {
  x as parseIfc
};
