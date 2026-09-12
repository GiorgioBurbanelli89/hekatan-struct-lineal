import "./modulepreload-polyfill-B5Qt9EMX.js";
import { d as n, B as r, b as d, v as t, F as m } from "./theme-DQ--CgsI.js";
import { g as p } from "./getViewer-Cc148UfG.js";
import "./tweakpane-BXg6ZhiP.js";
import { g as c } from "./styles-0iLl92Fx.js";
import { g as f } from "./getTables-CvtAF1Ui.js";
import { g as b } from "./getDialog-DQYmd6yA.js";
import "./Text-ERv22veQ.js";
const a = t.state([[0, 0, 0], [5, 0, 5], [10, 0, 0]]), i = new n(new r(), new d()), e = t.state([i]), o = /* @__PURE__ */ new Map();
o.set("polyline", { text: "Polyline", fields: [{ field: "A", text: "X-coordinate", min: "25", editable: { type: "float" } }, { field: "B", text: "Y-coordinate", editable: { type: "float" } }, { field: "C", text: "Z-coordinate", editable: { type: "float" } }], data: a });
t.derive(() => a.val = o.get("polyline").data.val);
t.derive(() => {
  i.geometry.setAttribute("position", new m(a.val.flat(), 3)), e.val = [...e.rawVal];
});
const l = t.state(""), s = t.state(void 0);
t.derive(() => {
  l.val === "Tables" && (s.val = f({ tables: o }));
});
document.body.append(c({ clickedButton: l, buttons: ["Tables"], sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/tables/main.ts", author: "https://www.linkedin.com/in/cal-mense/" }), b({ dialogBody: s }), p({ objects3D: e }));
