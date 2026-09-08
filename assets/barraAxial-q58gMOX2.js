import { a as A } from "./analyze-DgLgRmKg.js";
import { m as S, d as _, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { p as G, F as O, n as $, s as d, e as y } from "./paramsSeccion-Bn-RQEWN.js";
import { t as z } from "./cadSections-DVtTZU6U.js";
let W;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let R, g, C, D, k, B;
  R = 2e8;
  g = 0.3;
  C = R / (2 * (1 + g));
  D = 78;
  k = 9.81;
  B = D / k;
  W = {
    id: "W1_barra_axial",
    name: "W1 \u2014 Barra axial (1 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 1 GDL Axial",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      L: {
        default: 5,
        min: 1,
        max: 20,
        step: 0.5,
        label: "Longitud L (m)",
        folder: "Geometr\xEDa"
      },
      nElem: {
        default: 3,
        min: 1,
        max: 20,
        step: 1,
        label: "N\xB0 elementos",
        folder: "Geometr\xEDa"
      },
      ...G("Secci\xF3n", {
        forma: O["Tubo rectangular"],
        h: 100,
        b: 100,
        t: 5
      }),
      E: {
        default: 2e8,
        min: 25e6,
        max: 21e7,
        step: 1e6,
        label: "E (kN/m\xB2)",
        folder: "Secci\xF3n"
      },
      F: {
        default: 100,
        min: -500,
        max: 500,
        step: 10,
        label: "F axial extremo (kN)",
        folder: "Cargas"
      }
    },
    build(o, a) {
      var _a, _b;
      const n = Math.round(o.nElem), r = o.L / n, s = [], t = [];
      for (let e = 0; e <= n; e++) s.push([
        r * e,
        0,
        0
      ]);
      for (let e = 0; e < n; e++) t.push([
        e,
        e + 1
      ]);
      const m = /* @__PURE__ */ new Map([
        [
          0,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]), l = /* @__PURE__ */ new Map([
        [
          n,
          [
            o.F,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ]), u = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), i = d(o), w = i.A, { moiZ: E, moiY: L } = z(i);
      for (let e = 0; e < t.length; e++) u.set(e, o.E), p.set(e, C), h.set(e, g), v.set(e, B), f.set(e, w), x.set(e, E), M.set(e, L), b.set(e, i.J);
      a.nodes.val = s, a.elements.val = t, a.nodeInputs.val = {
        supports: m,
        loads: l
      }, a.elementInputs.val = {
        elasticities: u,
        shearModuli: p,
        areas: f,
        momentsOfInertiaY: M,
        momentsOfInertiaZ: x,
        torsionalConstants: b,
        densities: v,
        poissonsRatios: h
      };
      const c = _(s, t, a.nodeInputs.val, a.elementInputs.val);
      a.deformOutputs.val = c, a.analyzeOutputs.val = A(s, t, a.elementInputs.val, c), a.objects3D.val = [];
      const F = o.F * o.L / (d(o).A * o.E), I = ((_b = (_a = c.deformations) == null ? void 0 : _a.get(n)) == null ? void 0 : _b[0]) ?? 0;
      console.log(`[Barra axial] \u03B4 te\xF3rico=${(F * 1e3).toFixed(4)} mm  FEM=${(I * 1e3).toFixed(4)} mm  ratio=${(I / F).toFixed(3)}`);
    },
    computedLabels: (o) => y(o),
    runModal(o, a, n) {
      var _a, _b;
      const r = a.nodes.val, s = a.elements.val, t = a.nodeInputs.val, m = a.elementInputs.val;
      if (!(!r.length || !s.length || !((_a = t.supports) == null ? void 0 : _a.size) || !((_b = m.densities) == null ? void 0 : _b.size))) try {
        const l = S(r, s, t, m, 8);
        n.render(l, {
          title: `Barra axial L=${o.L}m`,
          properties: [
            `E=${(o.E / 1e6).toFixed(0)} GPa  ${$(o)}  A=${(d(o).A * 1e4).toFixed(1)} cm\xB2`
          ]
        });
      } catch (l) {
        console.warn("Modal barra error:", l.message);
      }
    }
  };
});
export {
  __tla,
  W as b
};
