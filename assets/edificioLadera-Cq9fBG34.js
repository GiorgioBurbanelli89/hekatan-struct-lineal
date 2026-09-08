import { a as mo } from "./analyze-CRH7D0Bs.js";
import { m as uo, d as fo, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let go;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let Co, Q, s, U;
  Co = 9.81;
  Q = 24 / Co;
  s = (t, n, d, r, C, y) => ({
    default: d,
    min: r,
    max: C,
    step: y,
    label: n,
    folder: t
  });
  U = (t, n, d, r) => ({
    default: d,
    label: n,
    folder: t,
    options: r
  });
  go = {
    id: "edificio-ladera",
    name: "Edificio en Ladera",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      nVanosX: {
        ...s("Geometr\xEDa", "Vanos X (eje ladera)", 3, 1, 6, 1),
        regenOnChange: true
      },
      nVanosY: {
        ...s("Geometr\xEDa", "Vanos Y", 2, 1, 6, 1),
        regenOnChange: true
      },
      nPisos: {
        ...s("Geometr\xEDa", "N. Pisos", 3, 1, 8, 1),
        regenOnChange: true
      },
      spanX: s("Geometr\xEDa", "Luz X (m)", 5, 2, 12, 0.5),
      spanY: s("Geometr\xEDa", "Luz Y (m)", 5, 2, 12, 0.5),
      hPiso: s("Geometr\xEDa", "h piso (m)", 3, 2, 5, 0.1),
      cotaCubierta: s("Ladera", "Cota cubierta (m)", 9, 0, 30, 0.25),
      cotaPortico1: s("Ladera", "Cota cim. eje X1 (m)", -3, -10, 5, 0.25),
      cotaPortico2: s("Ladera", "Cota cim. eje X2 (m)", -2, -10, 5, 0.25),
      cotaPortico3: s("Ladera", "Cota cim. eje X3 (m)", -1, -10, 5, 0.25),
      cotaPortico4: s("Ladera", "Cota cim. eje X4 (m)", 0, -10, 5, 0.25),
      cotaPortico5: s("Ladera", "Cota cim. eje X5 (m)", 0, -10, 5, 0.25),
      cotaPortico6: s("Ladera", "Cota cim. eje X6 (m)", 0, -10, 5, 0.25),
      cotaPortico7: s("Ladera", "Cota cim. eje X7 (m)", 0, -10, 5, 0.25),
      fcConcr: s("Secciones", "f'c (kg/cm\xB2)", 240, 140, 420, 10),
      colSize: s("Secciones", "b\xD7h columna (m)", 0.4, 0.25, 0.8, 0.05),
      vigaB: s("Secciones", "b viga (m)", 0.3, 0.2, 0.6, 0.05),
      vigaH: s("Secciones", "h viga (m)", 0.5, 0.3, 0.9, 0.05),
      apoyo: U("Apoyos", "Tipo", 0, {
        Empotrado: 0,
        "Articulado (3 DOFs)": 1
      }),
      CM: s("Cargas", "CM (kN/nodo cubierta)", -10, -50, 0, 0.5),
      CV: s("Cargas", "CV (kN/nodo cubierta)", -3, -20, 0, 0.5),
      Ex: s("Cargas", "Ex sismo X tope (kN)", 80, 0, 500, 10),
      Ey: s("Cargas", "Ey sismo Y tope (kN)", 0, 0, 500, 10),
      loadCase: U("Cargas", "Caso de carga", 0, {
        "Combinada (CM+CV+Ex+Ey)": 0,
        "Solo Vertical (CM+CV)": 1,
        "Solo Dead (CM)": 2,
        "Solo Live (CV)": 3,
        "Solo Sismo Ex": 4,
        "Solo Sismo Ey": 5,
        "Sismo XY (Ex+Ey)": 6,
        "1.2 CM + 1.6 CV (ASCE)": 7,
        "1.2 CM + 1.0 CV + 1.0 Ex": 8,
        "1.2 CM + 1.0 CV + 1.0 Ey": 9,
        "1.2 CM + 1.0 CV - 1.0 Ex": 10,
        "1.2 CM + 1.0 CV - 1.0 Ey": 11,
        "0.9 CM + 1.0 Ex": 12,
        "0.9 CM + 1.0 Ey": 13
      }),
      q_adm_zapata: s("Cimentaci\xF3n", "q_adm (tonf/m\xB2)", 10, 1, 100, 1),
      ks_zapata: s("Cimentaci\xF3n", "ks (kN/m\xB3)", 1030, 100, 2e5, 10)
    },
    computedLabels(t, n) {
      var _a;
      const r = (_a = n.deformOutputs.rawVal) == null ? void 0 : _a.reactions, C = n.nodes.rawVal;
      if (!r || !(C == null ? void 0 : C.length)) return {
        Reacciones: "\u2014"
      };
      const y = /* @__PURE__ */ new Set();
      r.forEach((i, l) => {
        const m = C[l];
        m && y.add(Math.round(m[2] * 100) / 100);
      });
      const x = /* @__PURE__ */ new Map();
      r.forEach((i, l) => {
        const m = C[l];
        if (!m) return;
        const v = Math.round(m[2] * 100) / 100;
        let F = true;
        for (let M = 0; M < C.length; M++) {
          if (M === l) continue;
          const V = C[M];
          if (Math.abs(V[0] - m[0]) < 1e-3 && Math.abs(V[1] - m[1]) < 1e-3 && V[2] < m[2] - 1e-6) {
            F = false;
            break;
          }
        }
        if (!F) return;
        const O = i[2], N = i[0], L = i[1], b = Math.abs(O), w = Math.sqrt(N * N + L * L), h = x.get(v) ?? {
          count: 0,
          maxP: 0,
          sumP: 0,
          maxV: 0
        };
        h.count += 1, h.sumP += b, b > h.maxP && (h.maxP = b), w > h.maxV && (h.maxV = w), x.set(v, h);
      });
      const g = {
        "\u2500\u2500 Reacciones por cota \u2500\u2500": ""
      }, _ = Array.from(x.keys()).sort((i, l) => i - l);
      for (const i of _) {
        const l = x.get(i), m = l.maxP / 9.80665, v = l.maxV / 9.80665;
        g[`z=${i.toFixed(2)} m`] = `${l.count} cols, P_max=${m.toFixed(1)} tonf, V_max=${v.toFixed(2)} tonf`;
      }
      let p = 1 / 0, E = -1 / 0;
      for (const i of _) i < p && (p = i), i > E && (E = i);
      const P = E - p;
      if (P > 0.1) {
        const i = t.hPiso ?? 3, l = (t.cotaCubierta - E) / i, m = (t.cotaCubierta - p) / i;
        g["\u2500\u2500 Asimetr\xEDa ladera \u2500\u2500"] = "", g["Desnivel cim."] = `${P.toFixed(2)} m`, g["Col. m\xE1s corta"] = `~${l.toFixed(1)} pisos`, g["Col. m\xE1s larga"] = `~${m.toFixed(1)} pisos`;
        const v = Math.pow(m / Math.max(l, 0.5), 3);
        g["k_corta/k_larga"] = `${v.toFixed(1)}\xD7 \u26A0 torsi\xF3n`;
      }
      return g;
    },
    build(t, n) {
      const d = Math.round(t.nVanosX), r = Math.round(t.nVanosY), C = Math.round(t.nPisos), y = t.spanX, x = t.spanY, g = t.hPiso, _ = t.cotaCubierta, p = [];
      for (let e = 0; e <= d; e++) {
        const a = `cotaPortico${e + 1}`;
        p.push(t[a] ?? 0);
      }
      const E = t.fcConcr * 0.0981, P = 4700 * Math.sqrt(E) * 1e3, i = 0.2, l = P / (2 * (1 + i)), m = t.colSize * t.colSize, v = t.vigaB * t.vigaH, F = t.colSize ** 4 / 12, O = t.colSize ** 4 / 12, N = 0.14 * t.colSize ** 4, L = t.vigaB * t.vigaH ** 3 / 12, b = t.vigaH * t.vigaB ** 3 / 12, w = 0.14 * Math.min(t.vigaB, t.vigaH) ** 3 * Math.max(t.vigaB, t.vigaH), h = [], M = /* @__PURE__ */ new Map(), V = (e, a, o) => {
        const c = `${e.toFixed(3)},${a.toFixed(3)},${o.toFixed(3)}`;
        if (M.has(c)) return M.get(c);
        const u = h.length;
        return h.push([
          e,
          a,
          o
        ]), M.set(c, u), u;
      }, I = [];
      for (let e = 0; e <= C; e++) I.push(_ - e * g);
      const X = /* @__PURE__ */ new Map();
      for (let e = 0; e <= d; e++) for (let a = 0; a <= r; a++) {
        const o = e * y, c = a * x, u = p[e], S = [];
        S.push(V(o, c, u));
        const ro = I.filter((z) => z > u + 1e-3).sort((z, lo) => z - lo);
        for (const z of ro) S.push(V(o, c, z));
        X.set(`${e},${a}`, S);
      }
      const $ = [], B = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), W = (e, a) => {
        const o = $.length;
        $.push([
          e,
          a
        ]), B.set(o, P), G.set(o, i), Y.set(o, m), j.set(o, F), A.set(o, O), T.set(o, N), H.set(o, l), R.set(o, Q), q.set(o, {
          type: "rect",
          b: t.colSize,
          h: t.colSize
        });
      }, K = (e, a) => {
        const o = $.length;
        $.push([
          e,
          a
        ]), B.set(o, P), G.set(o, i), Y.set(o, v), j.set(o, L), A.set(o, b), T.set(o, w), H.set(o, l), R.set(o, Q), q.set(o, {
          type: "rect",
          b: t.vigaB,
          h: t.vigaH
        });
      };
      for (let e = 0; e <= d; e++) for (let a = 0; a <= r; a++) {
        const o = X.get(`${e},${a}`);
        for (let c = 0; c < o.length - 1; c++) W(o[c], o[c + 1]);
      }
      const k = (e, a, o) => {
        const c = e * y, u = a * x, S = `${c.toFixed(3)},${u.toFixed(3)},${o.toFixed(3)}`;
        return M.has(S) ? M.get(S) : null;
      };
      for (const e of I) {
        for (let a = 0; a < d; a++) for (let o = 0; o <= r; o++) {
          const c = k(a, o, e), u = k(a + 1, o, e);
          c !== null && u !== null && K(c, u);
        }
        for (let a = 0; a <= d; a++) for (let o = 0; o < r; o++) {
          const c = k(a, o, e), u = k(a, o + 1, e);
          c !== null && u !== null && K(c, u);
        }
      }
      const D = /* @__PURE__ */ new Map();
      for (let e = 0; e <= d; e++) for (let a = 0; a <= r; a++) {
        const c = X.get(`${e},${a}`)[0];
        (Math.round(t.apoyo) | 0) === 0 ? D.set(c, [
          true,
          true,
          true,
          true,
          true,
          true
        ]) : D.set(c, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
      }
      const f = Math.round(t.loadCase ?? 0), oo = f === 1 ? [
        1,
        1,
        0,
        0
      ] : f === 2 ? [
        1,
        0,
        0,
        0
      ] : f === 3 ? [
        0,
        1,
        0,
        0
      ] : f === 4 ? [
        0,
        0,
        1,
        0
      ] : f === 5 ? [
        0,
        0,
        0,
        1
      ] : f === 6 ? [
        0,
        0,
        1,
        1
      ] : f === 7 ? [
        1.2,
        1.6,
        0,
        0
      ] : f === 8 ? [
        1.2,
        1,
        1,
        0
      ] : f === 9 ? [
        1.2,
        1,
        0,
        1
      ] : f === 10 ? [
        1.2,
        1,
        -1,
        0
      ] : f === 11 ? [
        1.2,
        1,
        0,
        -1
      ] : f === 12 ? [
        0.9,
        0,
        1,
        0
      ] : f === 13 ? [
        0.9,
        0,
        0,
        1
      ] : [
        1,
        1,
        1,
        1
      ], [to, eo, ao, no] = oo, J = /* @__PURE__ */ new Map(), Z = (d + 1) * (r + 1), so = ao * (t.Ex ?? 0) / Z, co = no * (t.Ey ?? 0) / Z, io = to * t.CM + eo * t.CV;
      for (let e = 0; e <= d; e++) for (let a = 0; a <= r; a++) {
        const o = k(e, a, _);
        o !== null && J.set(o, [
          so,
          co,
          io,
          0,
          0,
          0
        ]);
      }
      n.nodes.val = h, n.elements.val = $, n.nodeInputs.val = {
        supports: D,
        loads: J
      }, n.elementInputs.val = {
        elasticities: B,
        poissonsRatios: G,
        areas: Y,
        momentsOfInertiaZ: A,
        momentsOfInertiaY: j,
        torsionalConstants: T,
        shearModuli: H,
        densities: R,
        sectionShapes: q
      };
      try {
        n.deformOutputs.val = fo(n.nodes.val, n.elements.val, n.nodeInputs.val, n.elementInputs.val, []), n.analyzeOutputs.val = mo(n.nodes.val, n.elements.val, n.elementInputs.val, n.deformOutputs.val);
      } catch (e) {
        console.error("[edificio-ladera] analysis failed:", e);
      }
    },
    runModal(t, n, d) {
      try {
        const r = uo(n.nodes.val, n.elements.val, n.nodeInputs.val, n.elementInputs.val, 12), C = n.modalOutputs;
        C && (C.val = r), d == null ? void 0 : d.render(r, {
          title: `Edificio en ladera \u2014 ${Math.round(t.nPisos)} pisos`,
          properties: [
            `${n.nodes.val.length} nudos \xB7 ${n.elements.val.length} elementos`
          ]
        });
      } catch (r) {
        console.error("[edificio-ladera] modal failed:", r);
      }
    }
  };
});
export {
  __tla,
  go as e
};
