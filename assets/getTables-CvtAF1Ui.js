import { w as g, a as h } from "./styles-0iLl92Fx.js";
import { v } from "./theme-DQ--CgsI.js";
function E({ fields: o, data: l }) {
  const r = document.createElement("div"), e = new g({ name: Math.random().toString().substring(2), box: r, selectType: "cell", recordHeight: 26, show: { columnMenu: false, lineNumbers: true }, columns: w(o), records: b(l.rawVal, o) });
  return r.setAttribute("id", "table"), new ResizeObserver(() => e.refresh()).observe(r), e.onChange = (s) => {
    if (!o[s.detail.column]) return;
    const t = m[s.detail.column];
    e.records[s.detail.index][t] = s.detail.value.new, l.val = f(e.records, o);
  }, e.onDelete = (s) => {
    s.detail.force = true, s.onComplete = () => {
      l.val = f(e.records, o);
    };
  }, e.onPaste = (s) => {
    s.onComplete = () => {
      e.mergeChanges(), l.val = f(e.records, o);
    };
  }, v.derive(() => {
    e.records = b(l.val, o), e.refresh();
  }), r;
}
const m = "ABCDEFGHIJKLMNOPRST";
function w(o) {
  return m.split("").map((r) => ({ field: r, text: '<div style="text-align: center">' + r + "</div>", size: "90px", resizable: true, sortable: true, editable: { type: "text" } })).map((r) => {
    const e = o.find((i) => i.field === r.field);
    return e ? { ...r, ...e } : r;
  });
}
function b(o, l) {
  const r = Array.isArray(o) ? o : s(o, l), e = Array(50).fill(0).map((t, n) => ({ recid: n })), i = m.split("");
  for (let t = 0; t < r.length; t++) for (let n = 0; n < r[t].length; n++) e[t][i[n]] = r[t][n];
  return e;
  function s(t, n) {
    const d = /* @__PURE__ */ new Map();
    return n.forEach((u) => d.set(u.field, u)), Object.keys(t).map((u) => [d.get(u).text, t[u]]);
  }
}
function f(o, l) {
  if (m.includes(l[0].field)) return e(o, l);
  return i(o, l);
  function e(s, t) {
    let n = [...Array(s.length)].map(() => [...Array(t.length)]);
    const d = m.split("");
    for (let c = 0; c < n.length; c++) for (let a = 0; a < n[c].length; a++) n[c][a] = s[c][d[a]] ?? "";
    return n.slice(0, u(n) + 1);
    function u(c) {
      for (let a = c.length - 1; a >= 0; a--) if (c[a].some((p) => p !== "")) return a;
    }
  }
  function i(s, t) {
    return Object.fromEntries(t.map(({ field: n }, d) => [n, s[d].B]));
  }
}
function T({ tables: o }) {
  const l = document.createElement("div"), r = document.createElement("div"), e = [], i = /* @__PURE__ */ new Map();
  o.forEach((t, n) => {
    e.push({ id: n, text: t.text }), i.set(n, E({ fields: t.fields, data: t.data }));
  });
  const s = new h({ box: r, name: "tabs", active: e[0].id, flow: "up", tabs: e });
  return l.id = "tables", r.id = "tabs", l.append(i.values().next().value, r), s.onClick = (t) => {
    l.firstChild.replaceWith(i.get(t.target));
  }, l;
}
export {
  T as g
};
