import { P as r } from "./tweakpane-BXg6ZhiP.js";
import "./styles-SbI03m7S.js";
function f(o) {
  const t = document.createElement("div"), n = new r({ title: "Parameters", container: t }), d = c(o), s = /* @__PURE__ */ new Map();
  return t.setAttribute("id", "parameters"), s.set("root", n), Object.entries(o).forEach(([l, e]) => {
    var _a;
    e.folder && !s.get(e.folder) && s.set(e.folder, n.addFolder({ title: e.folder })), (_a = s.get(e.folder ?? "root")) == null ? void 0 : _a.addBinding(d, l, { min: e.min || 0, max: e.max || 50, step: e.step || 0.5, label: e.label || l });
  }), n.on("change", (l) => {
    o[l.target.key].value.val = l.value;
  }), t;
}
const c = (o) => Object.entries(o).reduce((t, [n, d]) => (t[n] = d.value.val, t), {});
export {
  f as g
};
