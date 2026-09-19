import "./modulepreload-polyfill-B5Qt9EMX.js";
import { d as n, B as r, b as d, v as t, F as m } from "./Text-BE1eWO-3.js";
import { a as c, g as p, __tla as __tla_0 } from "./aiAgent-Ocg1dyZM.js";
import "./tweakpane-BXg6ZhiP.js";
import { g as b, __tla as __tla_1 } from "./getTables-DH250fYl.js";
import { g as f, __tla as __tla_2 } from "./getDialog-CRn_x_hw.js";
import { __tla as __tla_3 } from "./didacticCpp-Czy7NlhT.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })()
]).then(async () => {
  const a = t.state([
    [
      0,
      0,
      0
    ],
    [
      5,
      0,
      5
    ],
    [
      10,
      0,
      0
    ]
  ]), i = new n(new r(), new d()), e = t.state([
    i
  ]), o = /* @__PURE__ */ new Map();
  o.set("polyline", {
    text: "Polyline",
    fields: [
      {
        field: "A",
        text: "X-coordinate",
        min: "25",
        editable: {
          type: "float"
        }
      },
      {
        field: "B",
        text: "Y-coordinate",
        editable: {
          type: "float"
        }
      },
      {
        field: "C",
        text: "Z-coordinate",
        editable: {
          type: "float"
        }
      }
    ],
    data: a
  });
  t.derive(() => a.val = o.get("polyline").data.val);
  t.derive(() => {
    i.geometry.setAttribute("position", new m(a.val.flat(), 3)), e.val = [
      ...e.rawVal
    ];
  });
  const l = t.state(""), s = t.state(void 0);
  t.derive(() => {
    l.val === "Tables" && (s.val = b({
      tables: o
    }));
  });
  document.body.append(c({
    clickedButton: l,
    buttons: [
      "Tables"
    ],
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/tables/main.ts",
    author: "https://www.linkedin.com/in/cal-mense/"
  }), f({
    dialogBody: s
  }), p({
    objects3D: e
  }));
});
