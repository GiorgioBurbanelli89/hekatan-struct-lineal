import { _ as La } from "./preload-helper-V2P8TQsQ.js";
import { a as qe, v as ba, V as $, d as Te, B as Ze } from "./theme-Dxpmbnyd.js";
import { a as Ca } from "./analyze-DgLgRmKg.js";
import { m as Pa, d as za, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { a as He } from "./exampleVersion-D1A_5i59.js";
let $a;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let W, oe, Ye, ya, ke, ka, Ia, Xe, wa, Na, Sa;
  W = 2004e4;
  oe = 0.2;
  Ye = W / (2 * (1 + oe));
  ya = 9.81;
  ke = 24 / ya;
  ka = 0.2;
  Ia = 0.035;
  Xe = 8;
  wa = 0.04;
  Na = new qe({
    color: 16711731,
    linewidth: 2
  });
  Sa = new qe({
    color: 52224,
    linewidth: 2
  });
  $a = {
    id: "zapata-viga-amarre",
    name: "Zapata + Viga de Amarre + Pedestal",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    defaultShellResult: "pressure",
    availableShellResults: [
      "pressure",
      "bendingXX",
      "bendingYY",
      "displacementZ",
      "vonMises"
    ],
    hasModal: true,
    params: {
      Lz1: {
        default: 2,
        min: 1,
        max: 4,
        step: 0.1,
        label: "Lz1 (m)",
        folder: "\u{1F4D0} Geometr\xEDa zapatas",
        description: "Lado X de la Zapata 1 (medianera). Dimensi\xF3n paralela al eje viga amarre. T\xEDpico 2-4 m."
      },
      Bz1: {
        default: 2,
        min: 1,
        max: 4,
        step: 0.1,
        label: "Bz1 (m)",
        folder: "\u{1F4D0} Geometr\xEDa zapatas",
        description: "Lado Y de la Zapata 1. Dimensi\xF3n perpendicular al eje viga amarre. T\xEDpico 2-4 m."
      },
      Lz2: {
        default: 2.5,
        min: 1,
        max: 4,
        step: 0.1,
        label: "Lz2 (m)",
        folder: "\u{1F4D0} Geometr\xEDa zapatas",
        description: "Lado X de la Zapata 2 (interna). Dimensi\xF3n paralela al eje viga amarre."
      },
      Bz2: {
        default: 2,
        min: 1,
        max: 4,
        step: 0.1,
        label: "Bz2 (m)",
        folder: "\u{1F4D0} Geometr\xEDa zapatas",
        description: "Lado Y de la Zapata 2. Dimensi\xF3n perpendicular al eje viga amarre."
      },
      tz: {
        default: 0.5,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "tz espesor (m)",
        folder: "\u{1F4D0} Geometr\xEDa zapatas",
        description: "Espesor (canto) com\xFAn de ambas zapatas, en metros. T\xEDpico 0.30-0.80 m. Afecta rigidez flexural y peso propio del slab."
      },
      Lv: {
        default: 3,
        min: 1,
        max: 6,
        step: 0.1,
        label: "Lv claro (m)",
        folder: "\u{1F3D7} Viga de amarre",
        description: "Distancia LIBRE entre borde derecho de Z1 y borde izquierdo de Z2 (el gap). NO es la longitud total de la viga (que va col-a-col, atravesando ambas zapatas)."
      },
      Bv: {
        default: 0.25,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "Bv ancho (m)",
        folder: "\u{1F3D7} Viga de amarre",
        description: "Ancho (dimensi\xF3n horizontal) de la secci\xF3n rectangular de la viga de amarre. T\xEDpico 0.25-0.45 m."
      },
      Hv: {
        default: 0.3,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "Hv canto (m)",
        folder: "\u{1F3D7} Viga de amarre",
        description: "Canto (dimensi\xF3n vertical) de la secci\xF3n rectangular de la viga. Mayor canto = m\xE1s rigidez flexural. T\xEDpico 0.40-0.95 m."
      },
      vigaLevel: {
        default: 0,
        min: 0,
        max: 1,
        step: 1,
        label: "Viga: 0=baja 1=alta",
        folder: "\u{1F3D7} Viga de amarre",
        description: "0 = viga al nivel del slab (z=0). 1 = viga elevada al nivel del pedestal. La convenci\xF3n SAFE es 0 (mismo plano que la zapata)."
      },
      bc: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "bc columna (m)",
        folder: "\u{1F3DB} Columna + pedestal",
        description: "Lado de la secci\xF3n CUADRADA de la columna. La columna NO va como frame: se modela como un Stiff patch en el slab (\xE1rea r\xEDgida que distribuye la carga axial)."
      },
      Hp: {
        default: 0.8,
        min: 0.3,
        max: 2,
        step: 0.1,
        label: "Hp pedestal (m)",
        folder: "\u{1F3DB} Columna + pedestal",
        description: "Altura del pedestal (frame vertical) sobre la zapata, en metros. Las cargas P/M se aplican en el TOPE del pedestal a z=Hp."
      },
      ks: {
        default: 2e3,
        min: 500,
        max: 3e4,
        step: 500,
        label: "ks Winkler (kN/m\xB3)",
        folder: "\u{1F30D} Suelo",
        description: "M\xF3dulo de balasto vertical kv del suelo (modelo Winkler). T\xEDpico: 10000 (suelo blando) - 50000 kN/m\xB3 (suelo denso). Para Guerra Ej6 = 37461 kN/m\xB3."
      },
      useDead: {
        default: 1,
        boolean: true,
        label: "Activar Dead (CM)",
        folder: "\u{1F534} Cargas Dead (CM)",
        description: "Activa/desactiva el patr\xF3n Dead. Si OFF las cargas P_dead/M_dead se ignoran en el an\xE1lisis Y en el F2K. Default ON."
      },
      P1: {
        default: 25,
        min: 1,
        max: 200,
        step: 1,
        label: "P1 Dead (tonf)",
        folder: "\u{1F534} Cargas Dead (CM)",
        hiddenIf: (e) => (e.useDead ?? 1) < 0.5,
        description: "Carga axial muerta (peso propio + CM) sobre Columna 1, en tonf. +compresi\xF3n. Para Guerra Ej6 Col1 = 70 t."
      },
      M1x: {
        default: 1,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M1x Dead (tonf\xB7m)",
        folder: "\u{1F534} Cargas Dead (CM)",
        hiddenIf: (e) => (e.useDead ?? 1) < 0.5,
        description: "Momento muerto en eje X de Columna 1, tonf\xB7m. Genera flexi\xF3n My en la zapata."
      },
      M1y: {
        default: 2.5,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M1y Dead (tonf\xB7m)",
        folder: "\u{1F534} Cargas Dead (CM)",
        hiddenIf: (e) => (e.useDead ?? 1) < 0.5,
        description: "Momento muerto en eje Y de Columna 1, tonf\xB7m. Genera flexi\xF3n Mx en la zapata."
      },
      P2: {
        default: 40,
        min: 1,
        max: 200,
        step: 1,
        label: "P2 Dead (tonf)",
        folder: "\u{1F534} Cargas Dead (CM)",
        hiddenIf: (e) => (e.useDead ?? 1) < 0.5,
        description: "Carga axial muerta sobre Columna 2. Para Guerra Ej6 Col2 = 89 t."
      },
      M2x: {
        default: 1,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M2x Dead (tonf\xB7m)",
        folder: "\u{1F534} Cargas Dead (CM)",
        hiddenIf: (e) => (e.useDead ?? 1) < 0.5,
        description: "Momento muerto en eje X de Columna 2."
      },
      M2y: {
        default: 2.5,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M2y Dead (tonf\xB7m)",
        folder: "\u{1F534} Cargas Dead (CM)",
        hiddenIf: (e) => (e.useDead ?? 1) < 0.5,
        description: "Momento muerto en eje Y de Columna 2."
      },
      useLive: {
        default: 1,
        boolean: true,
        label: "Activar Live (CV)",
        folder: "\u{1F535} Cargas Live (CV)",
        description: "Activa/desactiva el patr\xF3n Live. Si OFF las cargas P_live/M_live se ignoran en an\xE1lisis Y en F2K. La combinaci\xF3n Pu=1.4D+1.7L solo aplica si ambos est\xE1n activos."
      },
      P1_L: {
        default: 0,
        min: 0,
        max: 200,
        step: 1,
        label: "P1 Live (tonf)",
        folder: "\u{1F535} Cargas Live (CV)",
        hiddenIf: (e) => (e.useLive ?? 1) < 0.5,
        description: "Carga axial viva (CV) sobre Columna 1. Para Guerra Ej6 Col1 = 40 t."
      },
      M1x_L: {
        default: 0,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M1x Live (tonf\xB7m)",
        folder: "\u{1F535} Cargas Live (CV)",
        hiddenIf: (e) => (e.useLive ?? 1) < 0.5,
        description: "Momento vivo en eje X de Columna 1."
      },
      M1y_L: {
        default: 0,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M1y Live (tonf\xB7m)",
        folder: "\u{1F535} Cargas Live (CV)",
        hiddenIf: (e) => (e.useLive ?? 1) < 0.5,
        description: "Momento vivo en eje Y de Columna 1."
      },
      P2_L: {
        default: 0,
        min: 0,
        max: 200,
        step: 1,
        label: "P2 Live (tonf)",
        folder: "\u{1F535} Cargas Live (CV)",
        hiddenIf: (e) => (e.useLive ?? 1) < 0.5,
        description: "Carga axial viva sobre Columna 2. Para Guerra Ej6 Col2 = 51 t."
      },
      M2x_L: {
        default: 0,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M2x Live (tonf\xB7m)",
        folder: "\u{1F535} Cargas Live (CV)",
        hiddenIf: (e) => (e.useLive ?? 1) < 0.5,
        description: "Momento vivo en eje X de Columna 2."
      },
      M2y_L: {
        default: 0,
        min: -5,
        max: 5,
        step: 0.1,
        label: "M2y Live (tonf\xB7m)",
        folder: "\u{1F535} Cargas Live (CV)",
        hiddenIf: (e) => (e.useLive ?? 1) < 0.5,
        description: "Momento vivo en eje Y de Columna 2."
      },
      nSubX: {
        default: 8,
        min: 2,
        max: 12,
        step: 1,
        label: "nx subdivisiones",
        folder: "\u{1F527} Mallado FEM",
        description: "Subdivisiones del mesh Q4 en X. El pico del borde de la medianera es SINGULAR: con 4\xD74 se subestima (~18); con 8\xD78 llega a ~26 como el libro (validado nodo-a-nodo vs SAFE)."
      },
      nSubY: {
        default: 8,
        min: 2,
        max: 12,
        step: 1,
        label: "ny subdivisiones",
        folder: "\u{1F527} Mallado FEM",
        description: "Subdivisiones en Y. 8\xD78 reproduce el pico del libro (24-26 t/m\xB2); 4\xD74 lo subestima."
      }
    },
    build(e, s) {
      var _a;
      const r = e.Lz1, u = e.Bz1, f = e.Lv, M = e.Bv, h = e.Hv, x = e.Lz2, y = e.Bz2, A = e.tz, k = e.bc;
      e.Hp;
      const I = 9.80665, w = (e.useDead ?? 1) >= 0.5 ? 1 : 0, B = (e.useLive ?? 1) >= 0.5 ? 1 : 0, ne = (w * (e.P1 ?? 0) + B * (e.P1_L ?? 0)) * I, te = (w * (e.P2 ?? 0) + B * (e.P2_L ?? 0)) * I, G = e.ks, se = (w * (e.M1x ?? 0) + B * (e.M1x_L ?? 0)) * I, re = (w * (e.M1y ?? 0) + B * (e.M1y_L ?? 0)) * I, de = (w * (e.M2x ?? 0) + B * (e.M2x_L ?? 0)) * I, ce = (w * (e.M2y ?? 0) + B * (e.M2y_L ?? 0)) * I, T = Math.round(e.nSubX), _ = Math.round(e.nSubY), N = (u - y) / 2, Z = k / 2, O = u / 2, L = r + f + x / 2, H = y / 2 + N, le = O;
      function Y(a, o, n, t) {
        const d = [
          a,
          ...n.filter((l) => l > a && l < o),
          o
        ].sort((l, m) => l - m), c = d.filter((l, m) => m === 0 || l - d[m - 1] > 1e-6), C = [];
        for (let l = 0; l < c.length - 1; l++) {
          const m = c[l], D = c[l + 1], P = Math.max(1, Math.round((D - m) / ((o - a) / t)));
          for (let v = 0; v < P; v++) C.push(m + (D - m) * v / P);
        }
        return C.push(c[c.length - 1]), C;
      }
      const R = Y(0, r, [
        Z
      ], T), X = Y(0, u, [
        O,
        le
      ], _), j = Y(r + f, r + f + x, [
        L
      ], T), q = Y(N, N + y, [
        H,
        le
      ], _), me = [], V = [], Ke = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Map(), K = (a, o, n) => {
        const t = `${a.toFixed(4)},${o.toFixed(4)},${n.toFixed(4)}`;
        if (_e.has(t)) return _e.get(t);
        const d = me.length;
        return me.push([
          a,
          o,
          n
        ]), _e.set(t, d), d;
      }, p = [];
      for (let a = 0; a < X.length; a++) {
        const o = [];
        for (let n = 0; n < R.length; n++) o.push(K(R[n], X[a], 0));
        p.push(o);
      }
      for (let a = 0; a < X.length - 1; a++) for (let o = 0; o < R.length - 1; o++) {
        const n = V.length;
        V.push([
          p[a][o],
          p[a][o + 1],
          p[a + 1][o + 1],
          p[a + 1][o]
        ]), pe.set(n, A), U.set(n, W), J.set(n, oe), Q.set(n, ke);
      }
      const S = [];
      for (let a = 0; a < q.length; a++) {
        const o = [];
        for (let n = 0; n < j.length; n++) o.push(K(j[n], q[a], 0));
        S.push(o);
      }
      for (let a = 0; a < q.length - 1; a++) for (let o = 0; o < j.length - 1; o++) {
        const n = V.length;
        V.push([
          S[a][o],
          S[a][o + 1],
          S[a + 1][o + 1],
          S[a + 1][o]
        ]), pe.set(n, A), U.set(n, W), J.set(n, oe), Q.set(n, ke);
      }
      const Ie = K(Z, O, 0), we = K(L, H, 0), ee = [];
      for (const a of R) a >= Z - 1e-6 && ee.push(K(a, O, 0));
      for (const a of j) a <= L + 1e-6 && ee.push(K(a, H, 0));
      let Ne = 0;
      for (let a = 0; a < ee.length - 1; a++) {
        const o = ee[a], n = ee[a + 1];
        if (o === n) continue;
        const t = V.length;
        V.push([
          o,
          n
        ]), U.set(t, W), J.set(t, oe), he.set(t, Ye), fe.set(t, M * h), ge.set(t, M * h ** 3 / 12), ve.set(t, h * M ** 3 / 12), Me.set(t, 0.28 * M * h ** 3), Q.set(t, ke), xe.set(t, {
          type: "rect",
          b: M,
          h
        }), Ne++;
      }
      console.log(`[viga amarre] ${Ne} segmentos col-a-col compartiendo nodos con slab`);
      const Se = 0.5, We = W * 1e3, Ue = Ye * 1e3, Je = k * k * 100, De = k ** 4 / 12 * 100, Qe = 0.14 * k ** 4 * 100;
      function Ee(a, o, n, t, d, c) {
        let C = 0;
        for (let l = 0; l < d.length; l++) for (let m = 0; m < t.length; m++) {
          const D = t[m], P = d[l];
          if (Math.abs(D - o) > Se / 2 + 1e-6 || Math.abs(P - n) > Se / 2 + 1e-6) continue;
          const v = c[l][m];
          if (v === a) continue;
          const i = V.length;
          V.push([
            a,
            v
          ]), U.set(i, We), J.set(i, oe), he.set(i, Ue), fe.set(i, Je), ve.set(i, De), ge.set(i, De), Me.set(i, Qe), Q.set(i, 0), xe.set(i, {
            type: "rect",
            b: k,
            h: k
          }), C++;
        }
        return C;
      }
      const ea = Ee(Ie, Z, O, R, X, p), aa = Ee(we, L, H, j, q, S);
      console.log(`[Rigid links] Col1:${ea} Col2:${aa}  (viga col-a-col directa nCol1Bot\u2194nCol2Bot)`), ue.set(Ie, [
        0,
        0,
        -ne,
        se,
        re,
        0
      ]), ue.set(we, [
        0,
        0,
        -te,
        de,
        ce,
        0
      ]);
      const Fe = r / T, Ae = u / _, oa = x / T, na = y / _, Be = 0.5, b = [], ae = [];
      for (let a = 0; a < X.length; a++) for (let o = 0; o < R.length; o++) {
        const n = Fe * Ae * (o === 0 || o === R.length - 1 ? 0.5 : 1) * (a === 0 || a === X.length - 1 ? 0.5 : 1), t = G * n, d = G * n * Be;
        b.push({
          node: p[a][o],
          dof: 0,
          k: d
        }), b.push({
          node: p[a][o],
          dof: 1,
          k: d
        }), b.push({
          node: p[a][o],
          dof: 2,
          k: t
        }), ae.push(p[a][o]);
      }
      for (let a = 0; a < q.length; a++) for (let o = 0; o < j.length; o++) {
        const n = oa * na * (o === 0 || o === j.length - 1 ? 0.5 : 1) * (a === 0 || a === q.length - 1 ? 0.5 : 1), t = G * n, d = G * n * Be;
        b.push({
          node: S[a][o],
          dof: 0,
          k: d
        }), b.push({
          node: S[a][o],
          dof: 1,
          k: d
        }), b.push({
          node: S[a][o],
          dof: 2,
          k: t
        }), ae.push(S[a][o]);
      }
      const Le = G * Fe * Ae * 1e-4;
      b.push({
        node: p[0][0],
        dof: 3,
        k: Le
      }), b.push({
        node: p[0][0],
        dof: 4,
        k: Le
      }), b.push({
        node: p[0][0],
        dof: 5,
        k: Le
      }), s.nodes.val = me.map((a) => [
        a[0],
        a[1],
        a[2]
      ]), s.elements.val = V, s.nodeInputs.val = {
        supports: Ke,
        loads: ue,
        springs: b
      }, s.elementInputs.val = {
        elasticities: U,
        poissonsRatios: J,
        areas: fe,
        momentsOfInertiaY: ve,
        momentsOfInertiaZ: ge,
        torsionalConstants: Me,
        shearModuli: he,
        thicknesses: pe,
        densities: Q,
        sectionShapes: xe
      };
      try {
        s.deformOutputs.val = za(s.nodes.val, s.elements.val, s.nodeInputs.val, s.elementInputs.val, b);
        const a = Ca(s.nodes.val, s.elements.val, s.elementInputs.val, s.deformOutputs.val), o = s.deformOutputs.rawVal.deformations, n = /* @__PURE__ */ new Map();
        let t = 0, d = 0;
        s.elements.rawVal.forEach((m, D) => {
          if (m.length !== 4) return;
          const P = [];
          for (const v of m) {
            const i = o == null ? void 0 : o.get(v), E = i ? i[2] : 0, g = G * E;
            P.push(g), g < t && (t = g), g > d && (d = g);
          }
          n.set(D, P);
        }), a.pressure = n;
        const c = 9.80665, C = Math.min(-12 * c, d), l = Math.max(-26 * c, t);
        a.colorMapRanges = {
          pressure: [
            l,
            C
          ]
        }, s.analyzeOutputs.val = a;
      } catch (a) {
        console.error("Solver error:", a);
      }
      const Ge = s.deformOutputs.rawVal.deformations;
      let be = 1e-9;
      for (const a of ae) {
        const o = Ge == null ? void 0 : Ge.get(a);
        o && Number.isFinite(o[2]) && (be = Math.max(be, Math.abs(o[2])));
      }
      const ta = new Set(ae), Ce = Xe * 12, ie = (_a = document.querySelector("#viewer")) == null ? void 0 : _a.__settings, Ve = (a, o, n = 1) => {
        const t = a ? o : 0, c = -(be * Math.max(t, 1) + ka), C = n > 0 ? n : n < 0 ? -1 / n : 1, l = Ia * C, m = wa * C, D = [];
        for (const P of ae) {
          if (!ta.has(P)) continue;
          const v = s.nodes.rawVal[P];
          if (!v) continue;
          const i = v[0], E = v[1], g = Ge == null ? void 0 : Ge.get(P), Pe = (z) => Number.isFinite(z) ? z : 0, la = g ? Pe(g[0]) : 0, ia = g ? Pe(g[1]) : 0, ra = g ? Pe(g[2]) : 0, $e = i + la * t, Oe = E + ia * t, Re = 0 + ra * t, da = Re - c, ze = (z) => [
            i + ($e - i) * z,
            E + (Oe - E) * z,
            c + da * z
          ], [ca, ma, ua] = ze(0), [fa, pa, va] = ze(0.05), ye = [
            new $(ca, ma, ua),
            new $(fa, pa, va)
          ];
          for (let z = 0; z <= Ce; z++) {
            const Ma = 0.05 + 0.9 * (z / Ce), [ha, xa, _a2] = ze(Ma), je = 2 * Math.PI * Xe * (z / Ce);
            ye.push(new $(ha + l * Math.cos(je), xa + l * Math.sin(je), _a2));
          }
          ye.push(new $($e, Oe, Re)), D.push(new Te(new Ze().setFromPoints(ye), Na));
          const F = m, ga = [
            new $(i - F, E - F, c),
            new $(i + F, E - F, c),
            new $(i + F, E + F, c),
            new $(i - F, E + F, c),
            new $(i - F, E - F, c)
          ];
          D.push(new Te(new Ze().setFromPoints(ga), Sa));
        }
        return D;
      }, sa = He.v;
      ie ? ba.derive(() => {
        if (He.v !== sa) return;
        const a = ie.deformedShape.val, o = ie.deformScale.val, n = ie.displayScale.val;
        s.objects3D.val = Ve(a, o, n);
      }) : s.objects3D.val = Ve(true, 1, 1);
    },
    runModal(e, s, r) {
      var _a, _b;
      const u = s.nodes.val, f = s.elements.val, M = s.nodeInputs.val, h = s.elementInputs.val;
      if (!(!u.length || !f.length || !((_a = h.densities) == null ? void 0 : _a.size))) try {
        const x = Pa(u, f, M, h, 12);
        r.render(x, {
          title: `Zapata + Viga amarre Lv=${e.Lv}m`,
          properties: [
            `E=25 GPa  \u03BD=0.2  \u03C1=24 kN/m\xB3  Viga ${e.Bv}\xD7${e.Hv}m`
          ]
        }), console.log(`[Zapata+Viga Modal] f\u2081=${(_b = x.frequencies[0]) == null ? void 0 : _b.toFixed(4)} Hz`);
      } catch (x) {
        console.warn("Modal zapata-viga error:", x.message);
      }
    },
    async exportF2k(e) {
      const { downloadEdificioCimentacionF2k: s } = await La(async () => {
        const { downloadEdificioCimentacionF2k: L } = await import("./f2kCimentacionCompleta-Ct_BuFMO.js");
        return {
          downloadEdificioCimentacionF2k: L
        };
      }, []), r = 9.80665, u = e.Lz1, f = e.Bz1, M = e.Lv, h = e.Bv, x = e.Hv, y = e.Lz2, A = e.Bz2, k = e.tz, I = e.bc, w = e.ks, B = (f - A) / 2, ne = I / 2, te = f / 2, G = u + M + y / 2, se = A / 2 + B, re = u / 2, de = f / 2, ce = u + M + y / 2, T = B + A / 2, _ = (e.useDead ?? 1) >= 0.5 ? 1 : 0, N = (e.useLive ?? 1) >= 0.5 ? 1 : 0, Z = [
        {
          xC: re,
          yC: de,
          xCol: ne,
          yCol: te,
          Lz: u,
          Bz: f,
          tz: k,
          bc: I,
          P_dead_kN: _ * (e.P1 ?? 0) * r,
          Mx_dead_kNm: _ * (e.M1x ?? 0) * r,
          My_dead_kNm: _ * (e.M1y ?? 0) * r,
          P_live_kN: N * (e.P1_L ?? 0) * r,
          Mx_live_kNm: N * (e.M1x_L ?? 0) * r,
          My_live_kNm: N * (e.M1y_L ?? 0) * r,
          label: 1
        },
        {
          xC: ce,
          yC: T,
          xCol: G,
          yCol: se,
          Lz: y,
          Bz: A,
          tz: k,
          bc: I,
          P_dead_kN: _ * (e.P2 ?? 0) * r,
          Mx_dead_kNm: _ * (e.M2x ?? 0) * r,
          My_dead_kNm: _ * (e.M2y ?? 0) * r,
          P_live_kN: N * (e.P2_L ?? 0) * r,
          Mx_live_kNm: N * (e.M2x_L ?? 0) * r,
          My_live_kNm: N * (e.M2y_L ?? 0) * r,
          label: 2
        }
      ], O = [
        {
          x1: ne,
          y1: te,
          x2: G,
          y2: se,
          h: x,
          b: h,
          z: 0
        }
      ];
      try {
        s({
          zapatas: Z,
          vigasAmarre: O,
          ks_kNm3: w,
          Z: 0,
          E_concreto_MPa: W / 1e3
        }, `ZapataVigaAmarre_Hekatan_${Date.now()}.f2k`);
        const L = (e.P1 ?? 0) + (e.P1_L ?? 0), H = (e.P2 ?? 0) + (e.P2_L ?? 0), le = 1.4 * (e.P1 ?? 0) + 1.7 * (e.P1_L ?? 0), Y = 1.4 * (e.P2 ?? 0) + 1.7 * (e.P2_L ?? 0);
        alert(`\u2705 F2K exportado con 2 zapatas + viga de amarre:

\u2022 Z1 ${u}\xD7${f} m \u2014 PD=${e.P1} + PL=${e.P1_L ?? 0} = ${L} tonf | Pu=${le.toFixed(1)} tonf
\u2022 Z2 ${y}\xD7${A} m \u2014 PD=${e.P2} + PL=${e.P2_L ?? 0} = ${H} tonf | Pu=${Y.toFixed(1)} tonf
\u2022 Viga amarre ${h}\xD7${x} m, Lv=${M} m
\u2022 ks = ${w.toFixed(0)} kN/m\xB3

Patrones de carga incluidos: Dead (+peso propio), Live
Combinaci\xF3n: Pu = 1.4D + 1.7L (ACI 318 nominal Guerra MDI)

Abrilo en SAFE 20.x: File \u2192 Import \u2192 SAFE Text File (.f2k)`), console.log(`[F2K Zapata+Viga] exportado: Z1=${u}\xD7${f}, Z2=${y}\xD7${A}, ks=${w} kN/m\xB3`);
      } catch (L) {
        alert(`\u274C Error exportando F2K: ${L.message}`), console.error(L);
      }
    }
  };
});
export {
  __tla,
  $a as z
};
