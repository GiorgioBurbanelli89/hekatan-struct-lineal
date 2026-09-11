function i() {
  const t = globalThis.__hekatanFactoresPatron;
  return t && Object.keys(t).length ? t : null;
}
function l(t) {
  const e = i(), n = /* @__PURE__ */ new Map();
  for (const [s, o] of Object.entries(t)) {
    const r = e ? e[s] ?? 0 : 1;
    r && o.forEach((u, a) => {
      const f = n.get(a) ?? [0, 0, 0, 0, 0, 0];
      for (let c = 0; c < 6; c++) f[c] += r * u[c];
      n.set(a, f);
    });
  }
  return n;
}
function g(t, e, n) {
  const s = t.get(e) ?? [0, 0, 0, 0, 0, 0];
  for (let o = 0; o < 6; o++) s[o] += Number(n[o] ?? 0);
  t.set(e, s);
}
export {
  l as c,
  g as s
};
