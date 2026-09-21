import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as o } from "./Text-Br8EG2up.js";
import { i as k, g as x, a as C } from "./aiAgent-_ArHj5zk.js";
import { g as P } from "./getParameters-BwnrNJjy.js";
import "./tweakpane-BXg6ZhiP.js";
function T({ onToolbarClick: t }) {
  const n = document.createElement("div");
  return n.id = "drawing-toolbar", new k({ name: "toolbar", box: n, items: [{ type: "radio", id: "1st-floor", text: "1st Floor", checked: true }, { type: "radio", id: "2nd-floor", text: "2nd Floor" }], onClick(s) {
    t(s.target);
  } }), n;
}
const m = o.state([]), v = o.state([]), u = o.state([[5, 5, 0], [10, 15, 0], [15, 10, 0]]), g = o.state([[10, 2, 5], [2, 2, 5], [2, 10, 5], [7, 10, 5]]), w = o.state([]), h = o.state([[0, 1, 2, 3], []]), c = o.state([]), p = o.state([]), b = { width: { value: o.state(2), min: 0.5, max: 5, step: 0.1 } }, y = o.state({ position: [10, 10, 0], rotation: [Math.PI / 2, 0, 0] }), E = 5;
c.val = u.val;
let f = "1st-floor";
function F(t) {
  f = t, y.val = { position: [10, 10, t === "1st-floor" ? 0 : E], rotation: [Math.PI / 2, 0, 0] }, c.val = t === "1st-floor" ? u.val : g.val, p.val = t === "1st-floor" ? w.val : h.val;
}
o.derive(() => {
  f == "1st-floor" && (u.val = c.val, w.val = p.val), f == "2nd-floor" && (g.val = c.val, h.val = p.val);
});
o.derive(() => {
  m.val = [], v.val = [];
  const t = [], n = [];
  u.val.forEach((a, r) => {
    const { columnNodes: i, columnElements: d } = N(r * 4, a, E, b.width.value.val);
    t.push(...i), n.push(...d);
  });
  const s = [];
  g.val.forEach((a, r) => {
    s.push(a);
  });
  const e = [], l = t.length;
  h.val.forEach((a, r) => {
    const i = a.map((d) => l + d);
    e.push(i);
  }), m.val = [...m.rawVal, ...t, ...s], v.val = [...v.rawVal, ...n, ...e];
});
document.body.append(P(b), x({ mesh: { nodes: m, elements: v }, drawingObj: { points: c, polylines: p, gridTarget: y } }), T({ onToolbarClick: F }), C({ sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/drawing/main.ts", author: "https://www.linkedin.com/in/jorge-burbano-037444113/" }));
function N(t, n, s, e) {
  const l = n[0], a = n[1], r = [n, [l - 0.5 * e, a - 0.5 * e, s], [l + 0.5 * e, a - 0.5 * e, s], [l, a + 0.5 * e, s]], i = [[t, t + 1], [t, t + 2], [t, t + 3]];
  return { columnNodes: r, columnElements: i };
}
