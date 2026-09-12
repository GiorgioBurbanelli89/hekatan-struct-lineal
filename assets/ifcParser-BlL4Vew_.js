function P(C) {
  const c = (E) => (C.match(E) || []).length;
  return { columnas: c(/=\s*IFCCOLUMN\b/gi), vigas: c(/=\s*IFCBEAM\b/gi), miembros: c(/=\s*IFCMEMBER\b/gi), losas: c(/=\s*IFCSLAB\b/gi), muros: c(/=\s*IFCWALL(STANDARDCASE)?\b/gi), zapatas: c(/=\s*IFCFOOTING\b/gi), proxies: c(/=\s*IFCBUILDINGELEMENTPROXY\b/gi) };
}
function x(C, c = 1e-3) {
  const E = C.slice(Math.max(0, C.indexOf("DATA;"))), D = /#(\d+)\s*=\s*([A-Z0-9]+)\s*\(([\s\S]*?)\);/g, A = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), a = (t) => {
    const r = [], s = /#(\d+)/g;
    let e;
    for (; e = s.exec(t); ) r.push(+e[1]);
    return r;
  };
  let I;
  for (; I = D.exec(E); ) {
    const t = +I[1], r = I[2], s = I[3];
    switch (r) {
      case "IFCCARTESIANPOINT": {
        const e = s.match(/\(([^)]*)\)/);
        if (e) {
          const o = e[1].split(",").map(Number);
          A.set(t, [o[0] || 0, o[1] || 0, o[2] || 0]);
        }
        break;
      }
      case "IFCPOLYLOOP":
        M.set(t, a(s));
        break;
      case "IFCFACEOUTERBOUND":
      case "IFCFACEBOUND":
        S.set(t, a(s)[0]);
        break;
      case "IFCFACE":
        N.set(t, a(s));
        break;
      case "IFCCLOSEDSHELL":
      case "IFCOPENSHELL":
        h.set(t, a(s));
        break;
      case "IFCFACETEDBREP":
        L.set(t, a(s)[0]);
        break;
      case "IFCSTYLEDITEM": {
        const e = a(s);
        e.length >= 2 && O.set(e[0], e[1]);
        break;
      }
      case "IFCPRESENTATIONSTYLEASSIGNMENT":
        T.set(t, a(s));
        break;
      case "IFCSURFACESTYLE":
        d.set(t, a(s));
        break;
      case "IFCSURFACESTYLESHADING":
      case "IFCSURFACESTYLERENDERING":
        m.set(t, a(s)[0]);
        break;
      case "IFCCOLOURRGB": {
        const e = s.split(",").map((o) => parseFloat(o)).filter((o) => !isNaN(o));
        e.length >= 3 && w.set(t, [e[e.length - 3], e[e.length - 2], e[e.length - 1]]);
        break;
      }
    }
  }
  const B = (t) => {
    const r = O.get(t);
    if (r == null) return [0.72, 0.77, 0.82];
    for (const s of T.get(r) || []) for (const e of d.get(s) || []) {
      const o = w.get(m.get(e) ?? -1);
      if (o) return o;
    }
    return [0.72, 0.77, 0.82];
  }, F = /* @__PURE__ */ new Map(), n = [[1e30, 1e30, 1e30], [-1e30, -1e30, -1e30]];
  let R = 0;
  for (const [t, r] of L) {
    const s = B(t), e = s.map((b) => Math.round(b * 255)).join(",");
    let o = F.get(e);
    o || (o = { positions: [], color: s }, F.set(e, o));
    for (const b of h.get(r) || []) for (const U of N.get(b) || []) {
      const k = M.get(S.get(U) ?? -1);
      if (!k) continue;
      const g = k.map((i) => A.get(i)).filter(Boolean);
      for (let i = 1; i < g.length - 1; i++) {
        for (const u of [g[0], g[i], g[i + 1]]) {
          const f = u[0] * c, l = u[1] * c, p = u[2] * c;
          o.positions.push(f, l, p), f < n[0][0] && (n[0][0] = f), l < n[0][1] && (n[0][1] = l), p < n[0][2] && (n[0][2] = p), f > n[1][0] && (n[1][0] = f), l > n[1][1] && (n[1][1] = l), p > n[1][2] && (n[1][2] = p);
        }
        R++;
      }
    }
  }
  return { grupos: [...F.values()], nTri: R, bbox: n, unidad: c, estructura: P(E) };
}
export {
  x as parseIfc
};
