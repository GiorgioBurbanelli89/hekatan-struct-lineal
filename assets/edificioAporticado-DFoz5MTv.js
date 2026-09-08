import { a as Qe } from "./analyze-BFwM3Jvn.js";
import { m as We, d as be, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { a as ts } from "./cadSections-DVtTZU6U.js";
import { b as os, a as oo } from "./cotas3D-CP6xTezf.js";
import { S as es, f as ss, M as Ho, e as Uo, a as Kt, B as mo, V as X, d as Ce, b as ns, L as Co, E as as, I as is, D as cs } from "./theme-U-6D_qyI.js";
let bs, ys;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function Oo(t, n = 0.5) {
    const D = rs(n), p = t / D;
    let A = Math.max(2, Math.round(p));
    return t / A > D * 1.25 && (A = Math.ceil(p)), {
      n: A,
      dx: t / A
    };
  }
  function rs(t) {
    return typeof t == "number" ? t : t === "fine" ? 0.25 : 0.5;
  }
  const ls = {
    "Grueso (50 cm)": 0.5,
    "Medio (30 cm)": 0.3,
    "Fino (25 cm)": 0.25,
    "Muy fino (15 cm)": 0.15
  };
  function ds(t, n, D = {}) {
    const p = D.tol ?? 1e-5, A = 0, u = [], y = [], I = {
      areas: /* @__PURE__ */ new Map(),
      momentsOfInertiaY: /* @__PURE__ */ new Map(),
      momentsOfInertiaZ: /* @__PURE__ */ new Map(),
      torsionalConstants: /* @__PURE__ */ new Map(),
      elasticities: /* @__PURE__ */ new Map(),
      shearModuli: /* @__PURE__ */ new Map(),
      densities: /* @__PURE__ */ new Map()
    }, N = 1e8, K = 1e4, j = 1e4, J = 2 * j, at = N / (2 * (1 + 0.3));
    for (const ut of n) {
      const Q = [];
      let gt = 0, W = 0;
      for (let m = 0; m < t.length; m++) Math.abs(t[m][2] - ut) < p && (Q.push(m), gt += t[m][0], W += t[m][1]);
      if (Q.length < 2) continue;
      const it = gt / Q.length, g = W / Q.length, d = t.length + u.length;
      u.push({
        idx: d,
        z: ut,
        x: it,
        y: g
      });
      for (const m of Q) {
        const ct = t[m][0] - it, vt = t[m][1] - g;
        if (Math.hypot(ct, vt) < p) {
          console.info(`[diafragma] z = ${ut}: el nudo ${m} cae sobre el master (${it.toFixed(3)}, ${g.toFixed(3)}): sin link, un elemento de longitud cero no ata nada.`);
          continue;
        }
        y.push([
          d,
          m
        ]);
        const S = A + y.length - 1;
        I.areas.set(S, K), I.momentsOfInertiaY.set(S, j), I.momentsOfInertiaZ.set(S, j), I.torsionalConstants.set(S, J), I.elasticities.set(S, N), I.shearModuli.set(S, at), I.densities.set(S, 0);
      }
    }
    return D.linkStiffness, {
      masterNodes: u,
      rigidLinks: y,
      linkProps: I
    };
  }
  function fs(t, n, D) {
    const p = (A, u) => {
      A.forEach((y, I) => u.set(I + D, y));
    };
    n.areas = n.areas ?? /* @__PURE__ */ new Map(), n.momentsOfInertiaY = n.momentsOfInertiaY ?? /* @__PURE__ */ new Map(), n.momentsOfInertiaZ = n.momentsOfInertiaZ ?? /* @__PURE__ */ new Map(), n.torsionalConstants = n.torsionalConstants ?? /* @__PURE__ */ new Map(), n.elasticities = n.elasticities ?? /* @__PURE__ */ new Map(), n.shearModuli = n.shearModuli ?? /* @__PURE__ */ new Map(), n.densities = n.densities ?? /* @__PURE__ */ new Map(), p(t.linkProps.areas, n.areas), p(t.linkProps.momentsOfInertiaY, n.momentsOfInertiaY), p(t.linkProps.momentsOfInertiaZ, n.momentsOfInertiaZ), p(t.linkProps.torsionalConstants, n.torsionalConstants), p(t.linkProps.elasticities, n.elasticities), p(t.linkProps.shearModuli, n.shearModuli), p(t.linkProps.densities, n.densities);
  }
  function we(t) {
    const n = Math.abs(t);
    return n < 0.8 ? {
      state: "Elastic",
      color: 2278750,
      ratio: t,
      description: "El\xE1stico (sin da\xF1o)"
    } : n < 1 ? {
      state: "B",
      color: 15381256,
      ratio: t,
      description: "B \u2014 Inicio fluencia"
    } : n < 1.5 ? {
      state: "IO",
      color: 16347926,
      ratio: t,
      description: "IO \u2014 Immediate Occupancy"
    } : n < 2.5 ? {
      state: "LS",
      color: 15680580,
      ratio: t,
      description: "LS \u2014 Life Safety"
    } : {
      state: "CP",
      color: 10033947,
      ratio: t,
      description: "CP \u2014 Collapse Prevention"
    };
  }
  function ms(t, n, D) {
    if (t <= 0 || n <= 0) return 1e-12;
    const A = Math.sqrt(12 * n / t) / 2;
    return n / A * D;
  }
  function hs(t, n, D, p, A, u, y, I = {}) {
    var _a, _b;
    const N = I.Fy_steel ?? 345e3;
    I.fc_concrete;
    const K = I.Fy_rebar ?? 42e4, j = I.omega ?? 0.15, J = I.phi ?? 0.9, at = A < 0.5 ? J * j * K * (1 - 0.59 * j) : J * N, ut = u < 0.5 ? J * j * K * (1 - 0.59 * j) : J * N, Q = D.frameBendingMoments, gt = [];
    for (let W = 0; W < n.length; W++) {
      const it = n[W];
      if (it.length !== 2) continue;
      const [g, d] = it, m = y.has(W);
      let ct = 0, vt = 0;
      const S = Q == null ? void 0 : Q.get(W);
      S && (ct = S.Mi, vt = S.Mj);
      const x = ((_a = p.areas) == null ? void 0 : _a.get(W)) ?? 0.16, T = ((_b = p.momentsOfInertiaZ) == null ? void 0 : _b.get(W)) ?? 213e-5, ht = ms(x, T, m ? at : ut), wt = ct / ht, zt = vt / ht;
      gt.push({
        nodeIdx: g,
        elementIdx: W,
        end: "i",
        classification: we(wt)
      }), gt.push({
        nodeIdx: d,
        elementIdx: W,
        end: "j",
        classification: we(zt)
      });
    }
    return gt;
  }
  function us(t, n, D, p = {}) {
    const A = p.showElastic ?? false, u = (p.radiusFactor ?? 0.02) * D, y = [], I = new es(u, 12, 8);
    for (const N of t) {
      if (!A && N.classification.state === "Elastic") continue;
      const K = n[N.nodeIdx];
      if (!K) continue;
      const j = new ss({
        color: N.classification.color,
        transparent: true,
        opacity: 0.85
      }), J = new Ho(I, j);
      J.position.set(K[0], K[1], K[2]), J.userData = {
        hingeState: N.classification.state,
        ratio: N.classification.ratio.toFixed(3),
        element: N.elementIdx,
        end: N.end
      }, y.push(J);
    }
    return y;
  }
  function gs(t) {
    const n = {
      Elastic: 0,
      B: 0,
      IO: 0,
      LS: 0,
      CP: 0
    };
    for (const D of t) n[D.classification.state]++;
    return n;
  }
  const Qo = 9.80665;
  function $e(t, n, D, p, A = 0.01) {
    const u = Math.abs(t) < A, y = Math.abs(t - D) < A, I = Math.abs(n) < A, N = Math.abs(n - p) < A, K = [
      u,
      y,
      I,
      N
    ].filter(Boolean).length;
    return K >= 2 ? "esquinera" : K === 1 ? "lindero" : "central";
  }
  function Se(t) {
    const { P_kN: n, Mx_kN: D, My_kN: p, tipo: A, q_adm_tonf: u, ks: y } = t, I = t.Lz_min ?? 1, N = t.Lz_max ?? 4, K = t.t_min ?? 0.3;
    if (n <= 0) return {
      tipo: A,
      Lz: I,
      Bz: I,
      t: K,
      A: I ** 2,
      ex: 0,
      ey: 0,
      sigmaMax_tonf: 0,
      sigmaMin_tonf: 0,
      ratio: 0,
      fueraKern: false,
      status: "UPLIFT"
    };
    const j = u * Qo, J = Math.abs(p / n), at = Math.abs(D / n), ut = j * 0.95;
    let Q = Math.max(I, Math.sqrt(n / j)), gt = Q, W = 1 / 0, it = 0, g = false;
    for (let x = 0; x < 50 && Q <= N; x++) {
      const T = A === "esquinera" ? 0.3 : A === "lindero" ? 0.2 : 0, z = Q + T, ht = gt + T, wt = z * ht, zt = Math.max(J, at), $ = zt === J ? z : ht;
      if (g = zt > $ / 6, !g) W = n / wt * (1 + 6 * zt / $), it = n / wt * (1 - 6 * zt / $);
      else {
        const tt = 1.5 * $ - 3 * zt, It = zt === J ? ht : z;
        W = 2 * n / (It * Math.max(tt, 0.01)), it = 0;
      }
      if (W <= ut) break;
      Q += 0.05, gt += 0.05;
    }
    const d = Q * gt, m = Math.max(K, Q / 6), ct = W / j, vt = ct <= 1 ? "OK" : "OVERSTRESS";
    let S;
    return y && y > 0 && (S = W / y * 1e3), {
      tipo: A,
      Lz: Q,
      Bz: gt,
      t: m,
      A: d,
      ex: J,
      ey: at,
      sigmaMax_tonf: W / Qo,
      sigmaMin_tonf: it / Qo,
      ratio: ct,
      delta_mm: S,
      fueraKern: g,
      status: vt
    };
  }
  function Ro(t, n, D, p, A) {
    return t.map((u) => {
      const y = $e(u.x, u.y, n, D);
      return {
        ...Se({
          P_kN: u.P_kN,
          Mx_kN: u.Mx_kN,
          My_kN: u.My_kN,
          tipo: y,
          q_adm_tonf: p,
          ks: A
        }),
        idx: u.idx,
        x: u.x,
        y: u.y
      };
    });
  }
  let Wo, ho, ze, h, G;
  ys = Object.freeze(Object.defineProperty({
    __proto__: null,
    classifyFootingType: $e,
    designAllFootings: Ro,
    designFooting: Se
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Wo = 9.81;
  ho = 24 / Wo;
  ze = 78 / Wo;
  h = (t, n, D, p, A, u) => ({
    default: D,
    min: p,
    max: A,
    step: u,
    label: n,
    folder: t
  });
  G = (t, n, D, p) => ({
    default: D,
    label: n,
    folder: t,
    options: p
  });
  bs = {
    id: "edificio-aporticado",
    name: "Edificio Aporticado",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "pressure",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "displacementZ",
      "vonMises"
    ],
    hasModal: true,
    params: {
      nVanosX: {
        ...h("Geometr\xEDa", "Vanos X", 2, 1, 6, 1),
        regenOnChange: true
      },
      nVanosY: {
        ...h("Geometr\xEDa", "Vanos Y", 2, 1, 6, 1),
        regenOnChange: true
      },
      nPisos: {
        ...h("Geometr\xEDa", "N. Pisos", 3, 1, 8, 1),
        regenOnChange: true
      },
      spanX: h("Geometr\xEDa", "Luz X uniforme (m)", 5, 2, 12, 0.5),
      spanY: h("Geometr\xEDa", "Luz Y uniforme (m)", 5, 2, 12, 0.5),
      hPiso: h("Geometr\xEDa", "h piso uniforme (m)", 3, 2, 5, 0.1),
      Lvix: h("Geometr\xEDa", "Voladizo izq X (m)", 0, 0, 3, 0.25),
      Lvdx: h("Geometr\xEDa", "Voladizo der X (m)", 0, 0, 3, 0.25),
      Lviy: h("Geometr\xEDa", "Voladizo izq Y (m)", 0, 0, 3, 0.25),
      Lvdy: h("Geometr\xEDa", "Voladizo der Y (m)", 0, 0, 3, 0.25),
      hP_7: h("Alturas por piso", "Piso 7 (m)", 0, 0, 6, 0.1),
      hP_8: h("Alturas por piso", "Piso 8 (m)", 0, 0, 6, 0.1),
      matCol: G("Secciones (global)", "Material columna", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1,
        "CFT (tubo relleno)": 2
      }),
      tCft: h("Secciones (global)", "t pared CFT (m)", 0.01, 4e-3, 0.03, 1e-3),
      matViga: G("Secciones (global)", "Material viga", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1
      }),
      colShape: G("Secciones (global)", "Forma columna", 0, {
        Rectangular: 0,
        Circular: 1
      }),
      fcConcr: h("Secciones (global)", "f'c hormig\xF3n (kg/cm\xB2)", 240, 140, 420, 10),
      fyAcero: h("Secciones (global)", "fy acero (kg/cm\xB2)", 2530, 1800, 4200, 100),
      colSize: h("Secciones (global)", "b\xD7h columna (m)", 0.4, 0.25, 0.8, 0.05),
      vigaB: h("Secciones (global)", "b viga (m)", 0.3, 0.2, 0.6, 0.05),
      vigaH: h("Secciones (global)", "h viga (m)", 0.5, 0.3, 0.9, 0.05),
      nDivBeam: h("Mesh", "Div. Vigas (segmentos)", 1, 1, 8, 1),
      nDivCol: h("Mesh", "Div. Columnas (segmentos)", 1, 1, 8, 1),
      vigSecActivar: {
        ...G("Vigas Secundarias", "Activar", 0, {
          No: 0,
          S\u00ED: 1
        }),
        regenOnChange: true
      },
      vigSecDir: G("Vigas Secundarias", "Corren en", 2, {
        "Auto (lado corto)": 2,
        "X (entre ejes Y)": 0,
        "Y (entre ejes X)": 1
      }),
      vigSecCantidad: h("Vigas Secundarias", "Cantidad/vano", 2, 1, 5, 1),
      vigSecB: h("Vigas Secundarias", "b sec (m)", 0.2, 0.1, 0.4, 0.05),
      vigSecH: h("Vigas Secundarias", "h sec (m)", 0.3, 0.2, 0.6, 0.05),
      losaActivar: {
        ...G("Losas de Piso", "Activar losas", 0, {
          No: 0,
          S\u00ED: 1
        }),
        regenOnChange: true
      },
      losaEspesor: h("Losas de Piso", "Espesor (m)", 0.15, 0.08, 0.4, 0.01),
      losaSubdivX: h("Losas de Piso", "Subdiv. X", 2, 1, 6, 1),
      losaSubdivY: h("Losas de Piso", "Subdiv. Y", 2, 1, 6, 1),
      muroActivar: {
        ...G("Muros de Corte", "Activar", 0, {
          No: 0,
          Perimetrales: 1,
          "Centro X": 2,
          "Centro Y": 3,
          "Doble central": 4
        }),
        regenOnChange: true
      },
      muroEspesor: h("Muros de Corte", "Espesor (m)", 0.2, 0.1, 0.4, 0.01),
      muroSubdivV: h("Muros de Corte", "Subdiv. V (vert)", 2, 1, 6, 1),
      muroSubdivH: h("Muros de Corte", "Subdiv. H (horiz)", 2, 1, 6, 1),
      apoyo: G("Apoyo", "Tipo", 0, {
        Empotrado: 0,
        "Articulado (3 DOFs)": 1,
        "R\xF3tula completa": 2
      }),
      comparar: G("Apoyo", "Comparar con", 1, {
        "ETABS (uni\xF3n viga-muro de ETABS)": 1,
        "SAP2000 (sin sem\xE1nticas)": 0
      }),
      CM: h("Cargas", "CM (kN/nodo)", -5, -30, 0, 0.5),
      CV: h("Cargas", "CV (kN/nodo)", -2, -20, 0, 0.5),
      Ex: h("Cargas", "Ex sismo tope (kN)", 50, 0, 500, 10),
      Ey: h("Cargas", "Ey sismo tope (kN)", 0, 0, 500, 10),
      loadCase: G("Cargas", "Caso de carga", 0, {
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
      modoCimentacion: G("Cimentaci\xF3n", "\u{1F518} Vista (toggle)", 0, {
        "\u{1F3E2} Edificio completo (ver/editar)": 0,
        "\u{1FAA8} Solo cimentaci\xF3n (P,Mx,My)": 1
      }),
      q_adm_zapata: h("Cimentaci\xF3n", "q_adm (tonf/m\xB2)", 10, 1, 100, 1),
      ks_zapata: h("Cimentaci\xF3n", "ks (kN/m\xB3)", 1030, 100, 2e5, 10),
      Hf_pedestal: h("Cimentaci\xF3n", "Df col enterrada (m) (m)", 0.5, 0, 3, 0.05),
      t_zapata: h("Cimentaci\xF3n", "t zapata (m)", 0.3, 0.1, 1.5, 0.05),
      nSubZapata: h("Cimentaci\xF3n", "Subdiv. Q4 zapata", 4, 2, 12, 1),
      voladoExtra: h("Cimentaci\xF3n", "Volado extra esq./lin (m)", 0.3, 0, 1, 0.05),
      tipoZapataOverride: G("Cimentaci\xF3n", "Tipo (override)", 0, {
        "Auto (por posici\xF3n)": 0,
        "Todas central": 1,
        "Todas lindero": 2,
        "Todas esquinera": 3
      }),
      mostrarZapatas: G("Cimentaci\xF3n", "Mostrar zapatas 3D", 0, {
        On: 1,
        Off: 0
      }),
      mostrarLabelsZapatas: G("Cimentaci\xF3n", "Mostrar etiquetas zapatas", 1, {
        On: 1,
        Off: 0
      }),
      estiloZapata: G("Cimentaci\xF3n", "Estilo render", 1, {
        "S\xF3lido (caja transl\xFAcida)": 0,
        "Shellthick (Q4 + grilla)": 1
      }),
      sistemaCimentacion: G("Cimentaci\xF3n", "Sistema cim.", 0, {
        "Zapatas aisladas": 0,
        "Zapatas + vigas de amarre": 1,
        "Vigas T invertida (corrida)": 2,
        "Vigas rect. + zapata corrida": 3,
        "Losa de cimentaci\xF3n (raft)": 4
      }),
      vigaAmarre_pos: G("Cimentaci\xF3n", "Viga amarre \u2014 posici\xF3n", 0, {
        "Unida a zapatas (z=-Hf)": 0,
        "Conectada a pedestales (-Hf/2)": 1
      }),
      vigaAmarre_h: h("Cimentaci\xF3n", "Viga amarre h (m)", 0.4, 0.2, 1, 0.05),
      vigaAmarre_b: h("Cimentaci\xF3n", "Viga amarre b (m)", 0.25, 0.15, 0.6, 0.05),
      vigaCim_h: h("Cimentaci\xF3n", "Viga cim. h (m)", 0.8, 0.3, 2, 0.05),
      vigaCim_bw: h("Cimentaci\xF3n", "Viga cim. b alma (m)", 0.4, 0.2, 1, 0.05),
      vigaCim_bf: h("Cimentaci\xF3n", "Viga cim. b ala (m)", 1.2, 0.4, 3, 0.1),
      vigaCim_tf: h("Cimentaci\xF3n", "Viga cim. e ala (m)", 0.3, 0.1, 0.8, 0.05),
      nSubViga: h("Avanzado", "Div. vigas", 1, 1, 6, 1),
      nSubCol: h("Avanzado", "Div. columnas", 1, 1, 4, 1),
      vSecOn: G("Avanzado", "Vigas secundarias", 0, {
        Off: 0,
        On: 1
      }),
      nVSec: h("Avanzado", "N\xB0 vigas sec. por vano", 2, 1, 5, 1),
      vSecDir: G("Avanzado", "Dir secundarias", 2, {
        "Auto (lado corto)": 2,
        X: 0,
        Y: 1
      }),
      bracesMode: G("Avanzado", "Diagonales", 0, {
        ninguna: 0,
        perimetrales: 1,
        todas: 2,
        "solo X": 3,
        "solo Y": 4
      }),
      slabOn: G("Avanzado", "Losa", 0, {
        Off: 0,
        On: 1
      }),
      slabForm: G("Avanzado", "Formulaci\xF3n losa", 1, {
        "Thin (ETABS)": 1,
        Thick: 0
      }),
      slabT: h("Avanzado", "t losa (m)", 0.15, 0.08, 0.3, 0.01),
      murosMode: G("Avanzado", "Muros de corte (c\xE1scara)", 0, {
        ninguno: 0,
        "en X (fachadas Y)": 1,
        "en Y (fachadas X)": 2,
        "en X e Y": 3
      }),
      tMuro: h("Avanzado", "t muro (m)", 0.25, 0.15, 0.6, 0.05),
      slabType: G("Avanzado", "Tipo losa (ETABS)", 0, {
        "Shell (membrane+plate)": 0,
        "Membrane only": 1,
        "Plate only": 2
      }),
      slabDisc: G("Avanzado", "Discretizaci\xF3n losa", 0.5, ls),
      diafragmaRigido: G("Avanzado", "Diafragma r\xEDgido", 0, {
        Flexible: 0,
        "R\xEDgido (ASCE 7-22)": 1
      }),
      diafragmaNudos: G("Avanzado", "Diafragma: nudos atados", 1, {
        ninguno: 0,
        "ejes de columna (POINT D1, SAP2000)": 1,
        "toda la losa (AREA D1, ETABS)": 2
      }),
      massSource: G("Avanzado", "Mass Source", 0, {
        "Self-weight (peso propio)": 0,
        "From Loads (DEAD+0.25\xB7LIVE) ETABS": 1
      }),
      qDead: h("Avanzado", "qDead losa (kN/m\xB2)", 3.5, 0.5, 10, 0.5),
      qLive: h("Avanzado", "qLive losa (kN/m\xB2)", 1.5, 0, 6, 0.5),
      crackedSections: G("Avanzado", "Cracked Sections (ACI 318)", 0, {
        "Off (secci\xF3n bruta Ig)": 0,
        "On: 0.7\xB7Ig col / 0.35\xB7Ig viga / 0.25\xB7Ig losa": 1
      })
    },
    dynamicParams(t) {
      const n = {}, D = Math.round(t.nPisos ?? 3), p = Math.round(t.nVanosX ?? 2), A = Math.round(t.nVanosY ?? 2);
      for (let u = 1; u <= D; u++) n[`hP_${u}`] = h("Alturas por piso", `h Piso ${u} (m)`, 0, 0, 6, 0.1), n[`colB_p${u}`] = h("Secciones por piso", `b col P${u} (m)`, 0, 0, 1, 0.05), n[`colH_p${u}`] = h("Secciones por piso", `h col P${u} (m)`, 0, 0, 1, 0.05), n[`vigaB_p${u}`] = h("Secciones por piso", `b viga P${u} (m)`, 0, 0, 0.8, 0.05), n[`vigaH_p${u}`] = h("Secciones por piso", `h viga P${u} (m)`, 0, 0, 1, 0.05);
      for (let u = 1; u <= p; u++) n[`svX_${u}`] = h("Luces por vano", `svX #${u} (m)`, 0, 0, 12, 0.5);
      for (let u = 1; u <= A; u++) n[`svY_${u}`] = h("Luces por vano", `svY #${u} (m)`, 0, 0, 12, 0.5);
      return n;
    },
    computedLabels(t, n) {
      var _a;
      const p = (_a = n.deformOutputs.rawVal) == null ? void 0 : _a.reactions, A = n.nodes.rawVal;
      if (!p || !(A == null ? void 0 : A.length)) return {
        "Reacciones (\u2192 zapatas)": "\u2014"
      };
      let u = 0, y = 0, I = 0, N = -1, K = 0, j = -1;
      const J = [];
      let at = 0, ut = 0;
      p.forEach((ct, vt) => {
        const S = A[vt];
        if (!S || Math.abs(S[2]) > 1e-6) return;
        const x = ct[2], T = ct[3], z = ct[4];
        Math.abs(x) > Math.abs(u) && (u = x, N = vt, S[0], S[1]), x > 0 && x > Math.abs(K) && (K = x, j = vt), Math.abs(T) > Math.abs(y) && (y = T), Math.abs(z) > Math.abs(I) && (I = z), J.push({
          idx: vt,
          x: S[0],
          y: S[1],
          P_kN: Math.abs(x),
          Mx_kN: T,
          My_kN: z
        }), S[0] > at && (at = S[0]), S[1] > ut && (ut = S[1]);
      });
      const Q = Math.abs(u) / 9.80665, gt = Math.abs(y) / 9.80665, W = Math.abs(I) / 9.80665, it = K / 9.80665, g = Math.round(t.nPisos), d = {
        "\u2500\u2500 Reacciones m\xE1x (\u2192 zapatas) \u2500\u2500": "",
        "P (compresi\xF3n)": `${Q.toFixed(2)} tonf (nodo ${N})`,
        Mx: `${gt.toFixed(2)} tonf\xB7m`,
        My: `${W.toFixed(2)} tonf\xB7m`
      };
      if (it > 0.01 && (d["\u26A0 Uplift"] = `${it.toFixed(2)} tonf (nodo ${j})`), d.Pisos = `${g}`, d["Copiar a \u2192 zapata-aislada"] = `P=${Q.toFixed(1)}, Mx=${gt.toFixed(1)}, My=${W.toFixed(1)}`, J.length > 0 && at > 0 && ut > 0) {
        const ct = t.q_adm_zapata ?? 10, vt = t.ks_zapata ?? 1030;
        try {
          const S = Ro(J, at, ut, ct, vt);
          let x = 0, T = 0, z = 0, ht = 0, wt = -1, zt = "", $ = 0, tt = 0;
          for (const _t of S) _t.tipo === "esquinera" ? x++ : _t.tipo === "lindero" ? T++ : z++, _t.sigmaMax_tonf > ht && (ht = _t.sigmaMax_tonf, wt = _t.idx, zt = _t.tipo), _t.status === "OK" && $++, _t.Lz > tt && (tt = _t.Lz);
          d["\u2500\u2500 Cimentaci\xF3n (auto) \u2500\u2500"] = "", d["Tipos zapata"] = `${x} esquineras, ${T} linderas, ${z} centrales`, d["\u03C3_max global"] = `${ht.toFixed(2)} tonf/m\xB2 (nodo ${wt}, ${zt})`, d["\u03C3/q_adm"] = `${(ht / ct).toFixed(2)}` + (ht / ct <= 1 ? " \u2713" : " \u26A0"), d["Lz m\xE1x zapata"] = `${tt.toFixed(2)} m`, d.Cumplen = `${$}/${S.length}` + ($ === S.length ? " \u2713" : " \u26A0");
          const It = t.Hf_pedestal ?? 0.5, $t = t.t_zapata ?? 0.3, Lt = Math.round(t.nSubZapata ?? 4);
          d["Df col enterrada"] = `${It.toFixed(2)} m` + (It < 1e-3 ? " (sin pedestal)" : ""), d["t zapata"] = `${$t.toFixed(2)} m`, d["Subdiv. Q4"] = `${Lt}\xD7${Lt}`, d["Volado extra"] = `${(t.voladoExtra ?? 0.3).toFixed(2)} m`;
        } catch {
          d["\u2500\u2500 Cimentaci\xF3n \u2500\u2500"] = "module load error";
        }
      }
      const m = n.__plasticHinges;
      if (m) {
        const ct = (m.B ?? 0) + (m.IO ?? 0) + (m.LS ?? 0) + (m.CP ?? 0);
        d["\u2500\u2500 R\xF3tulas pl\xE1sticas (ASCE 41-17) \u2500\u2500"] = "", d["\u{1F7E2} El\xE1stico"] = `${m.Elastic ?? 0}`, d["\u{1F7E1} B \u2014 Yield"] = `${m.B ?? 0}`, d["\u{1F7E0} IO \u2014 Immed.Occ."] = `${m.IO ?? 0}`, d["\u{1F534} LS \u2014 Life Safety"] = `${m.LS ?? 0}`, d["\u26AB CP \u2014 Collapse Prev."] = `${m.CP ?? 0}`, d["Total r\xF3tulas formadas"] = `${ct}`;
      }
      return d;
    },
    build(t, n) {
      var _a, _b;
      const D = Math.round(t.nVanosX), p = Math.round(t.nVanosY), A = Math.round(t.nPisos), u = Math.max(1, Math.round(t.nSubViga)), y = Math.max(1, Math.round(t.nSubCol)), I = t.fcConcr * 0.0981, N = 4700 * Math.sqrt(I) * 1e3, K = 2e8, j = 0.2, J = 0.3, at = N / (2 * (1 + j)), ut = K / (2 * (1 + J)), Q = (o, s, e) => Array.from({
        length: s
      }, (l, i) => {
        const v = t[`${o}${i + 1}`];
        return typeof v == "number" && v > 0 ? v : e;
      }), gt = Q("svX_", D, t.spanX), W = Q("svY_", p, t.spanY), it = Q("hP_", A, t.hPiso), g = [];
      t.Lvix > 0 && g.push(-t.Lvix), g.push(0);
      for (let o = 0; o < D; o++) g.push(g[g.length - 1] + gt[o]);
      t.Lvdx > 0 && g.push(g[g.length - 1] + t.Lvdx);
      const d = [];
      t.Lviy > 0 && d.push(-t.Lviy), d.push(0);
      for (let o = 0; o < p; o++) d.push(d[d.length - 1] + W[o]);
      t.Lvdy > 0 && d.push(d[d.length - 1] + t.Lvdy);
      const m = [
        0
      ];
      for (let o = 0; o < A; o++) m.push(m[m.length - 1] + it[o]);
      const ct = (o) => t.Lvix > 0 && o === 0 || t.Lvdx > 0 && o === g.length - 1, vt = (o) => t.Lviy > 0 && o === 0 || t.Lvdy > 0 && o === d.length - 1, S = (o, s) => ct(o) || vt(s), x = [], T = {};
      for (let o = 0; o < m.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) o === 0 && S(e, s) || (T[`${e},${s},${o}`] = x.length, x.push([
        g[e],
        d[s],
        m[o]
      ]));
      const z = [], ht = /* @__PURE__ */ new Set(), wt = /* @__PURE__ */ new Set(), zt = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), tt = (o, s, e, l, i) => {
        if (e <= 1) {
          l.add(z.length), $.set(z.length, i), z.push([
            o,
            s
          ]);
          return;
        }
        const v = x[o], r = x[s];
        let f = o;
        for (let b = 1; b < e; b++) {
          const c = b / e, C = x.length;
          x.push([
            v[0] + (r[0] - v[0]) * c,
            v[1] + (r[1] - v[1]) * c,
            v[2] + (r[2] - v[2]) * c
          ]), l.add(z.length), $.set(z.length, i), z.push([
            f,
            C
          ]), f = C;
        }
        l.add(z.length), $.set(z.length, i), z.push([
          f,
          s
        ]);
      }, It = (o) => {
        const s = x[o];
        for (let e = z.length - 1; e >= 0; e--) {
          const l = z[e];
          if (l.length !== 2) continue;
          const [i, v] = l;
          if (i === o || v === o) continue;
          const r = x[i], f = x[v], b = [
            f[0] - r[0],
            f[1] - r[1],
            f[2] - r[2]
          ], c = [
            s[0] - r[0],
            s[1] - r[1],
            s[2] - r[2]
          ], C = b[0] ** 2 + b[1] ** 2 + b[2] ** 2;
          if (C < 1e-12) continue;
          const Y = (c[0] * b[0] + c[1] * b[1] + c[2] * b[2]) / C;
          if (Y < 1e-6 || Y > 1 - 1e-6 || Math.hypot(c[0] - Y * b[0], c[1] - Y * b[1], c[2] - Y * b[2]) > 1e-6) continue;
          z[e] = [
            i,
            o
          ];
          const B = z.length;
          z.push([
            o,
            v
          ]), wt.has(e) && wt.add(B), ht.has(e) && ht.add(B), $.has(e) && $.set(B, $.get(e));
        }
      };
      for (let o = 0; o < m.length - 1; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) S(e, s) || tt(T[`${e},${s},${o}`], T[`${e},${s},${o + 1}`], y, ht, o);
      for (let o = 1; o < m.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length - 1; e++) tt(T[`${e},${s},${o}`], T[`${e + 1},${s},${o}`], u, wt, o - 1);
      for (let o = 1; o < m.length; o++) for (let s = 0; s < g.length; s++) for (let e = 0; e < d.length - 1; e++) tt(T[`${s},${e},${o}`], T[`${s},${e + 1},${o}`], u, wt, o - 1);
      if (t.vSecOn >= 0.5 && t.nVSec >= 1) {
        const o = Math.round(t.nVSec), s = (l, i, v) => {
          for (let f = 0; f < x.length; f++) if (Math.abs(x[f][0] - l) < 1e-6 && Math.abs(x[f][1] - i) < 1e-6 && Math.abs(x[f][2] - v) < 1e-6) return f;
          const r = x.length;
          return x.push([
            l,
            i,
            v
          ]), It(r), r;
        }, e = (l, i) => t.vSecDir < 0.5 ? "x" : t.vSecDir < 1.5 ? "y" : g[l + 1] - g[l] <= d[i + 1] - d[i] ? "x" : "y";
        for (let l = 1; l < m.length; l++) for (let i = 0; i < g.length - 1; i++) for (let v = 0; v < d.length - 1; v++) {
          const r = g[i], f = g[i + 1], b = d[v], c = d[v + 1];
          for (let C = 1; C <= o; C++) {
            const Y = C / (o + 1), [B, rt] = e(i, v) === "x" ? [
              s(r, b + Y * (c - b), m[l]),
              s(f, b + Y * (c - b), m[l])
            ] : [
              s(r + Y * (f - r), b, m[l]),
              s(r + Y * (f - r), c, m[l])
            ];
            wt.add(z.length), z.push([
              B,
              rt
            ]);
          }
        }
      }
      const $t = Math.round(t.bracesMode);
      if ($t > 0) {
        const o = $t === 1 || $t === 2 || $t === 3, s = $t === 1 || $t === 2 || $t === 4, e = m.length - 1;
        for (let l = 0; l < e; l++) {
          if (o) for (let i = 0; i < d.length; i++) {
            if ($t === 1 && i !== 0 && i !== d.length - 1) continue;
            const v = Math.floor((g.length - 1) / 2);
            for (let r = 0; r < g.length - 1; r++) {
              if ($t === 1 && r !== v || S(r, i) || S(r + 1, i)) continue;
              const f = T[`${r},${i},${l}`], b = T[`${r + 1},${i},${l + 1}`], c = T[`${r + 1},${i},${l}`], C = T[`${r},${i},${l + 1}`];
              f !== void 0 && b !== void 0 && z.push([
                f,
                b
              ]), c !== void 0 && C !== void 0 && z.push([
                c,
                C
              ]);
            }
          }
          if (s) for (let i = 0; i < g.length; i++) {
            if ($t === 1 && i !== 0 && i !== g.length - 1) continue;
            const v = Math.floor((d.length - 1) / 2);
            for (let r = 0; r < d.length - 1; r++) {
              if ($t === 1 && r !== v || S(i, r) || S(i, r + 1)) continue;
              const f = T[`${i},${r},${l}`], b = T[`${i},${r + 1},${l + 1}`], c = T[`${i},${r + 1},${l}`], C = T[`${i},${r},${l + 1}`];
              f !== void 0 && b !== void 0 && z.push([
                f,
                b
              ]), c !== void 0 && C !== void 0 && z.push([
                c,
                C
              ]);
            }
          }
        }
      }
      const Lt = /* @__PURE__ */ new Map(), _t = (o, s, e) => `${Math.round(o * 1e4)},${Math.round(s * 1e4)},${Math.round(e * 1e4)}`;
      for (let o = 0; o < x.length; o++) Lt.set(_t(x[o][0], x[o][1], x[o][2]), o);
      const Rt = t.slabDisc > 0 ? t.slabDisc : 0.5;
      if (t.slabOn >= 0.5) for (let o = 1; o < m.length; o++) {
        const s = m[o];
        for (let e = 0; e < g.length - 1; e++) for (let l = 0; l < d.length - 1; l++) {
          const i = g[e], v = g[e + 1], r = d[l], f = d[l + 1], { n: b } = Oo(Math.abs(v - i), Rt), { n: c } = Oo(Math.abs(f - r), Rt), C = [];
          for (let Y = 0; Y <= c; Y++) {
            const B = [];
            for (let rt = 0; rt <= b; rt++) {
              const R = i + rt / b * (v - i), yt = r + Y / c * (f - r), Mt = _t(R, yt, s), St = Lt.get(Mt);
              if (St !== void 0) B.push(St);
              else {
                const Ot = x.length;
                x.push([
                  R,
                  yt,
                  s
                ]), Lt.set(Mt, Ot), B.push(Ot), It(Ot);
              }
            }
            C.push(B);
          }
          for (let Y = 0; Y < c; Y++) for (let B = 0; B < b; B++) zt.add(z.length), z.push([
            C[Y][B],
            C[Y][B + 1],
            C[Y + 1][B + 1],
            C[Y + 1][B]
          ]);
        }
      }
      const uo = /* @__PURE__ */ new Set(), go = [], Jt = Math.round(t.murosMode ?? 0);
      if (Jt > 0) {
        const o = Jt === 1 || Jt === 3, s = Jt === 2 || Jt === 3, e = (b, c, C) => {
          const Y = _t(b, c, C), B = Lt.get(Y);
          if (B !== void 0) return B;
          const rt = x.length;
          return x.push([
            b,
            c,
            C
          ]), Lt.set(Y, rt), It(rt), rt;
        }, l = (b, c, C, Y, B, rt, R, yt) => {
          const Mt = [];
          for (let St = 0; St <= yt; St++) {
            const Ot = [];
            for (let vo = 0; vo <= R; vo++) Ot.push(e(b + vo / R * (C - b), c + vo / R * (Y - c), B + St / yt * (rt - B)));
            Mt.push(Ot);
          }
          for (let St = 0; St < yt; St++) for (let Ot = 0; Ot < R; Ot++) uo.add(z.length), z.push([
            Mt[St][Ot],
            Mt[St][Ot + 1],
            Mt[St + 1][Ot + 1],
            Mt[St + 1][Ot]
          ]);
          Math.abs(B) < 1e-9 && go.push(...Mt[0]);
        }, i = t.Lvix > 0 ? 1 : 0, v = t.Lviy > 0 ? 1 : 0, r = g.length - 1 - (t.Lvdx > 0 ? 1 : 0), f = d.length - 1 - (t.Lvdy > 0 ? 1 : 0);
        for (let b = 0; b < m.length - 1; b++) {
          const c = m[b], C = m[b + 1], Y = Oo(C - c, Rt).n, B = Math.ceil(Y / y) * y;
          if (o && r > i) {
            const rt = g[i], R = g[i + 1], yt = Oo(R - rt, Rt).n;
            for (const Mt of /* @__PURE__ */ new Set([
              v,
              f
            ])) l(rt, d[Mt], R, d[Mt], c, C, yt, B);
          }
          if (s && f > v) {
            const rt = d[v], R = d[v + 1], yt = Oo(R - rt, Rt).n;
            for (const Mt of /* @__PURE__ */ new Set([
              i,
              r
            ])) l(g[Mt], rt, g[Mt], R, c, C, yt, B);
          }
        }
      }
      const Ao = Math.round(t.apoyo), Fo = Ao === 0 ? [
        true,
        true,
        true,
        true,
        true,
        true
      ] : Ao === 1 ? [
        true,
        true,
        true,
        false,
        false,
        false
      ] : [
        true,
        true,
        true,
        false,
        false,
        false
      ], wo = /* @__PURE__ */ new Map();
      for (let o = 0; o < d.length; o++) for (let s = 0; s < g.length; s++) S(s, o) || wo.set(T[`${s},${o},0`], [
        ...Fo
      ]);
      for (const o of go) wo.set(o, [
        ...Fo
      ]);
      const Vt = Math.round(t.loadCase ?? 0), ke = Vt === 1 ? [
        1,
        1,
        0,
        0
      ] : Vt === 2 ? [
        1,
        0,
        0,
        0
      ] : Vt === 3 ? [
        0,
        1,
        0,
        0
      ] : Vt === 4 ? [
        0,
        0,
        1,
        0
      ] : Vt === 5 ? [
        0,
        0,
        0,
        1
      ] : Vt === 6 ? [
        0,
        0,
        1,
        1
      ] : Vt === 7 ? [
        1.2,
        1.6,
        0,
        0
      ] : Vt === 8 ? [
        1.2,
        1,
        1,
        0
      ] : Vt === 9 ? [
        1.2,
        1,
        0,
        1
      ] : Vt === 10 ? [
        1.2,
        1,
        -1,
        0
      ] : Vt === 11 ? [
        1.2,
        1,
        0,
        -1
      ] : Vt === 12 ? [
        0.9,
        0,
        1,
        0
      ] : Vt === 13 ? [
        0.9,
        0,
        0,
        1
      ] : [
        1,
        1,
        1,
        1
      ], [Oe, Ae, Fe, Le] = ke, Lo = /* @__PURE__ */ new Map(), te = Oe * t.CM + Ae * t.CV;
      if (te !== 0) for (let o = 1; o < m.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) {
        const l = `${e},${s},${o}`;
        T[l] !== void 0 && Lo.set(T[l], [
          0,
          0,
          te,
          0,
          0,
          0
        ]);
      }
      const oe = Fe * t.Ex, ee = Le * t.Ey;
      if (oe !== 0 || ee !== 0) {
        const o = T[`${g.length - 1 - (t.Lvdx > 0 ? 1 : 0)},${t.Lviy > 0 ? 1 : 0},${A}`];
        if (o !== void 0) {
          const s = Lo.get(o) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          Lo.set(o, [
            s[0] + oe,
            s[1] + ee,
            s[2],
            s[3],
            s[4],
            s[5]
          ]);
        }
      }
      const Zo = [
        t.colB_1,
        t.colB_2,
        t.colB_3,
        t.colB_4,
        t.colB_5,
        t.colB_6,
        t.colB_7,
        t.colB_8
      ].map((o) => o > 0 ? o : t.colSize), jo = [
        t.colH_1,
        t.colH_2,
        t.colH_3,
        t.colH_4,
        t.colH_5,
        t.colH_6,
        t.colH_7,
        t.colH_8
      ].map((o) => o > 0 ? o : t.colSize), Ee = [
        t.vigaB_1,
        t.vigaB_2,
        t.vigaB_3,
        t.vigaB_4,
        t.vigaB_5,
        t.vigaB_6,
        t.vigaB_7,
        t.vigaB_8
      ].map((o) => o > 0 ? o : t.vigaB), Pe = [
        t.vigaH_1,
        t.vigaH_2,
        t.vigaH_3,
        t.vigaH_4,
        t.vigaH_5,
        t.vigaH_6,
        t.vigaH_7,
        t.vigaH_8
      ].map((o) => o > 0 ? o : t.vigaH), Xo = Math.round(t.matCol) === 2, Ie = (o) => {
        const s = Zo[o] ?? t.colSize, e = jo[o] ?? t.colSize;
        if (Xo) {
          const l = Math.min(t.tCft, Math.min(s, e) / 2 - 1e-3), i = ts(s, e, l, K, J, N, j);
          return {
            A: i.A,
            Iz: i.Iz,
            Iy: i.Iy,
            J: i.J,
            As2: i.As2,
            As3: i.As3,
            b: s,
            h: e,
            t: l
          };
        }
        return {
          A: s * e,
          Iz: s * e ** 3 / 12,
          Iy: e * s ** 3 / 12,
          J: 0.14 * Math.pow(Math.min(s, e), 4)
        };
      }, Ve = (o) => {
        const s = Ee[o] ?? t.vigaB, e = Pe[o] ?? t.vigaH;
        return {
          A: s * e,
          Iy: s * e ** 3 / 12,
          Iz: e * s ** 3 / 12,
          J: 0.21 * Math.pow(Math.min(s, e), 3) * Math.max(s, e)
        };
      }, Ne = t.matCol < 0.5 ? N : K, Te = t.matCol < 0.5 ? at : ut, Be = t.matCol < 0.5 ? j : J, De = t.matCol < 0.5 ? ho : ze, Ye = t.matViga < 0.5 ? N : K, qe = t.matViga < 0.5 ? at : ut, He = t.matViga < 0.5 ? j : J, Re = t.matViga < 0.5 ? ho : ze, Mo = /* @__PURE__ */ new Map(), po = /* @__PURE__ */ new Map(), Eo = /* @__PURE__ */ new Map(), Po = /* @__PURE__ */ new Map(), Io = /* @__PURE__ */ new Map(), Vo = /* @__PURE__ */ new Map(), xo = /* @__PURE__ */ new Map(), zo = /* @__PURE__ */ new Map(), Go = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = Math.round(t.slabType), Ze = le === 2 ? 0 : 1, je = le === 1 ? 0 : 1, No = t.crackedSections > 0.5, de = t.matCol < 0.5 && No ? 0.7 : 1, fe = t.matViga < 0.5 && No ? 0.35 : 1, Xe = No ? 0.25 : 1, Ge = 1, To = t.massSource > 0.5, Ke = t.qDead + 0.25 * t.qLive, Je = To ? Ke / Wo / Math.max(t.slabT, 0.05) : ho;
      for (let o = 0; o < z.length; o++) {
        const s = $.get(o) ?? 0;
        if (zt.has(o)) Mo.set(o, N), po.set(o, at), zo.set(o, j), Go.set(o, t.slabT), ce.set(o, Ze * Ge), re.set(o, je * Xe), ie.set(o, Math.round(t.slabForm ?? 1)), xo.set(o, Je);
        else if (uo.has(o)) Mo.set(o, N), po.set(o, at), zo.set(o, j), Go.set(o, t.tMuro ?? 0.25), xo.set(o, To ? 0 : ho);
        else if (ht.has(o)) {
          const e = Ie(Math.min(s, 7));
          Mo.set(o, Ne), po.set(o, Te), zo.set(o, Be), Eo.set(o, e.A), Po.set(o, e.Iz * de), Io.set(o, e.Iy * de), Vo.set(o, e.J), Xo && (ne.set(o, e.As2), se.set(o, e.As3), ae.set(o, {
            type: "CFT",
            b: e.b,
            h: e.h,
            tw: e.t,
            tf: e.t,
            fillE: N,
            d: 0
          })), xo.set(o, To ? 0 : De);
        } else {
          const e = Ve(Math.min(s, 7));
          Mo.set(o, Ye), po.set(o, qe), zo.set(o, He), Eo.set(o, e.A), Po.set(o, e.Iz * fe), Io.set(o, e.Iy * fe), Vo.set(o, e.J), xo.set(o, To ? 0 : Re);
        }
      }
      if (t.diafragmaRigido >= 0.5) {
        const o = [];
        for (let i = 1; i < m.length; i++) o.push(m[i]);
        const s = ds(x, o), e = z.length;
        for (const i of s.masterNodes) x.push([
          i.x,
          i.y,
          i.z
        ]);
        for (const i of s.rigidLinks) z.push(i);
        fs(s, {
          elasticities: Mo,
          shearModuli: po,
          areas: Eo,
          momentsOfInertiaY: Po,
          momentsOfInertiaZ: Io,
          torsionalConstants: Vo,
          densities: xo
        }, e);
      }
      n.nodes.val = x, n.elements.val = z;
      const Bo = /* @__PURE__ */ new Map(), me = Math.round(t.diafragmaNudos ?? 1);
      if (t.slabOn >= 0.5 && me === 1) for (let o = 1; o < m.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) {
        const l = T[`${e},${s},${o}`];
        l !== void 0 && Bo.set(l, o);
      }
      if (t.slabOn >= 0.5 && me === 2) for (let o = 1; o < m.length; o++) {
        const s = m[o];
        x.forEach((e, l) => {
          Math.abs(e[2] - s) < 1e-6 && Bo.set(l, o);
        });
      }
      n.nodeInputs.val = {
        supports: wo,
        loads: Lo,
        ...Bo.size ? {
          diaphragms: Bo
        } : {}
      }, n.elementInputs.val = {
        etabsWallJoint: Math.round(t.comparar ?? 1) === 1,
        elasticities: Mo,
        shearModuli: po,
        areas: Eo,
        momentsOfInertiaY: Po,
        momentsOfInertiaZ: Io,
        torsionalConstants: Vo,
        densities: xo,
        poissonsRatios: zo,
        thicknesses: Go,
        membraneModifiers: ce,
        bendingModifiers: re,
        plateFormulations: ie,
        ...Xo ? {
          shearAreasY: se,
          shearAreasZ: ne,
          sectionShapes: ae
        } : {}
      };
      const he = be(x, z, n.nodeInputs.val, n.elementInputs.val);
      n.deformOutputs.val = he, n.analyzeOutputs.val = Qe(x, z, n.elementInputs.val, he);
      const Ko = os(g, d, m);
      try {
        const o = hs(x, z, n.analyzeOutputs.rawVal, n.elementInputs.rawVal, Math.round(t.matCol), Math.round(t.matViga), ht);
        let s = 1 / 0, e = 1 / 0, l = 1 / 0, i = -1 / 0, v = -1 / 0, r = -1 / 0;
        for (const c of x) c[0] < s && (s = c[0]), c[0] > i && (i = c[0]), c[1] < e && (e = c[1]), c[1] > v && (v = c[1]), c[2] < l && (l = c[2]), c[2] > r && (r = c[2]);
        const f = Math.sqrt((i - s) ** 2 + (v - e) ** 2 + (r - l) ** 2) || 1, b = us(o, x, f, {
          showElastic: false,
          radiusFactor: 0.015
        });
        Ko.push(...b), n.__plasticHinges = gs(o);
      } catch (o) {
        console.warn("[Plastic Hinges]", o);
      }
      if ((t.mostrarZapatas ?? 1) >= 0.5) try {
        const o = (_a = n.deformOutputs.rawVal) == null ? void 0 : _a.reactions;
        if (o) {
          const s = [];
          let e = 0, l = 0;
          if (o.forEach((i, v) => {
            const r = x[v];
            !r || Math.abs(r[2]) > 1e-6 || (s.push({
              idx: v,
              x: r[0],
              y: r[1],
              P_kN: Math.abs(i[2]),
              Mx_kN: i[3],
              My_kN: i[4]
            }), r[0] > e && (e = r[0]), r[1] > l && (l = r[1]));
          }), s.length > 0) {
            const i = t.q_adm_zapata ?? 10, v = t.ks_zapata ?? 1030, r = Math.max(0, t.Hf_pedestal ?? 0.5), f = Math.max(0.1, t.t_zapata ?? 0.3), b = Math.max(2, Math.round(t.nSubZapata ?? 4)), c = Math.max(0, t.voladoExtra ?? 0.3), C = Math.round(t.tipoZapataOverride ?? 0) | 0, Y = Math.round(t.estiloZapata ?? 1), B = Ro(s, e, l, i, v), rt = [
              "central",
              "lindero",
              "esquinera"
            ];
            for (const E of B) C > 0 && (E.tipo = rt[C - 1]), E.t = f;
            const R = [], yt = (E) => new Uo({
              color: E,
              transparent: true,
              opacity: 0.55,
              roughness: 0.7
            }), Mt = new Kt({
              color: 0,
              linewidth: 2
            }), St = new Kt({
              color: 2236962,
              linewidth: 1,
              transparent: true,
              opacity: 0.5
            }), Ot = new Uo({
              color: 10265519,
              transparent: true,
              opacity: 0.75,
              roughness: 0.5
            }), vo = new Kt({
              color: 1118481,
              linewidth: 2
            }), ue = Zo[0] ?? t.colSize, ge = jo[0] ?? t.colSize;
            for (const E of B) {
              const Z = E.Lz, st = E.Bz, Gt = E.t;
              let Zt = 0, jt = 0;
              E.tipo === "esquinera" ? (Zt = E.x < e / 2 ? -(Z / 2 - c) : Z / 2 - c, jt = E.y < l / 2 ? -(st / 2 - c) : st / 2 - c) : E.tipo === "lindero" && (Math.abs(E.x) < 1e-3 || Math.abs(E.x - e) < 1e-3 ? Zt = E.x < e / 2 ? -(Z / 2 - c) : Z / 2 - c : (Math.abs(E.y) < 1e-3 || Math.abs(E.y - l) < 1e-3) && (jt = E.y < l / 2 ? -(st / 2 - c) : st / 2 - c));
              const U = E.x - Zt, F = E.y - jt, V = -r, Nt = V - Gt / 2, qt = V - Gt, eo = E.ratio;
              let so = 4906624;
              if (eo > 1.5 ? so = 15680580 : eo > 1 ? so = 16096779 : eo > 0.8 && (so = 16498468), r > 1e-3) {
                const xt = new mo().setFromPoints([
                  new X(E.x, E.y, 0),
                  new X(E.x, E.y, -r)
                ]);
                R.push(new Ce(xt, new Kt({
                  color: 6333946,
                  linewidth: 4
                }))), R.push(oo(`Df=${r.toFixed(2)}m`, E.x + 0.1, E.y + 0.1, -r / 2, "#60a5fa"));
              }
              if (Y === 0) {
                const xt = new ns(Z, st, Gt), Ut = new Ho(xt, yt(so));
                Ut.position.set(U, F, Nt), R.push(Ut);
                const Qt = new Co(new as(xt), Mt);
                Qt.position.copy(Ut.position), R.push(Qt);
              } else {
                const xt = new is(Z, st), Ut = new Uo({
                  color: so,
                  transparent: true,
                  opacity: 0.45,
                  roughness: 0.6,
                  side: cs
                }), Qt = new Ho(xt, Ut);
                Qt.position.set(U, F, V), R.push(Qt);
                const no = new Ho(xt.clone(), Ut.clone());
                no.position.set(U, F, qt), R.push(no);
                const pe = Z / b, xe = st / b, Xt = [];
                for (let kt = 0; kt <= b; kt++) {
                  const bt = -Z / 2 + kt * pe;
                  Xt.push(new X(U + bt, F - st / 2, V), new X(U + bt, F + st / 2, V)), Xt.push(new X(U + bt, F - st / 2, qt), new X(U + bt, F + st / 2, qt));
                }
                for (let kt = 0; kt <= b; kt++) {
                  const bt = -st / 2 + kt * xe;
                  Xt.push(new X(U - Z / 2, F + bt, V), new X(U + Z / 2, F + bt, V)), Xt.push(new X(U - Z / 2, F + bt, qt), new X(U + Z / 2, F + bt, qt));
                }
                const So = new mo().setFromPoints(Xt);
                R.push(new Co(So, St));
                const _o = [
                  [
                    -Z / 2,
                    -st / 2
                  ],
                  [
                    Z / 2,
                    -st / 2
                  ],
                  [
                    Z / 2,
                    st / 2
                  ],
                  [
                    -Z / 2,
                    st / 2
                  ]
                ], ro = [];
                for (let kt = 0; kt < 4; kt++) {
                  const [bt, a] = _o[kt], [k, M] = _o[(kt + 1) % 4];
                  ro.push(new X(U + bt, F + a, V), new X(U + k, F + M, V)), ro.push(new X(U + bt, F + a, qt), new X(U + k, F + M, qt)), ro.push(new X(U + bt, F + a, V), new X(U + bt, F + a, qt));
                }
                const yo = new mo().setFromPoints(ro);
                R.push(new Co(yo, Mt));
              }
              (t.mostrarLabelsZapatas ?? 1) >= 0.5 && R.push(oo(`${E.tipo[0].toUpperCase()} ${Z.toFixed(2)}\xD7${st.toFixed(2)}\xD7${Gt.toFixed(2)}m \u03C3/q=${E.ratio.toFixed(2)}`, U, F, qt - 0.2, eo <= 1 ? "#4ade80" : eo <= 1.5 ? "#f59e0b" : "#ef4444"));
            }
            if (Math.round(t.sistemaCimentacion ?? 0) === 1) {
              const E = Math.round(t.vigaAmarre_pos ?? 0), Z = E === 0 ? -r : -r / 2, st = t.vigaAmarre_b ?? 0.25, Gt = t.vigaAmarre_h ?? 0.4, Zt = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Map();
              for (const F of s) {
                const V = F.y.toFixed(4), Nt = F.x.toFixed(4);
                Zt.has(V) || Zt.set(V, []), jt.has(Nt) || jt.set(Nt, []), Zt.get(V).push(F), jt.get(Nt).push(F);
              }
              const U = [];
              for (const F of Zt.values()) {
                F.sort((V, Nt) => V.x - Nt.x);
                for (let V = 0; V < F.length - 1; V++) U.push(new X(F[V].x, F[V].y, Z)), U.push(new X(F[V + 1].x, F[V + 1].y, Z));
              }
              for (const F of jt.values()) {
                F.sort((V, Nt) => V.y - Nt.y);
                for (let V = 0; V < F.length - 1; V++) U.push(new X(F[V].x, F[V].y, Z)), U.push(new X(F[V + 1].x, F[V + 1].y, Z));
              }
              U.length > 0 && (R.push(new Co(new mo().setFromPoints(U), new Kt({
                color: 2282478,
                linewidth: 3
              }))), R.push(oo(`Vigas amarre ${(st * 100).toFixed(0)}\xD7${(Gt * 100).toFixed(0)} cm @ ${E === 0 ? "zapatas" : "pedestales"}`, e / 2, l / 2, Z + 0.2, "#22d3ee")));
            }
            Ko.push(...R);
          }
        }
      } catch (o) {
        console.warn("[Zapatas 3D]", o);
      }
      if ((t.modoCimentacion ?? 0) >= 0.5) try {
        const s = (_b = n.deformOutputs.rawVal) == null ? void 0 : _b.reactions;
        if (s && s.size > 0) {
          const e = [];
          let l = 0, i = 0;
          if (s.forEach((v, r) => {
            const f = x[r];
            !f || Math.abs(f[2]) > 1e-6 || (e.push({
              idx: r,
              x: f[0],
              y: f[1],
              P_kN: Math.abs(v[2]),
              Mx_kN: v[3],
              My_kN: v[4]
            }), f[0] > l && (l = f[0]), f[1] > i && (i = f[1]));
          }), e.length > 0) {
            const v = t.q_adm_zapata ?? 10, r = t.ks_zapata ?? 1030, f = Math.max(0, t.Hf_pedestal ?? 0.5), b = Math.max(0.1, t.t_zapata ?? 0.3), c = Math.max(2, Math.round(t.nSubZapata ?? 4)), C = Math.max(0, t.voladoExtra ?? 0.3), Y = Math.round(t.tipoZapataOverride ?? 0) | 0, B = Ro(e, l, i, v, r), rt = [
              "central",
              "lindero",
              "esquinera"
            ];
            for (const a of B) Y > 0 && (a.tipo = rt[Y - 1]), a.t = b;
            const R = Zo[0] ?? t.colSize, yt = jo[0] ?? t.colSize, Mt = R * yt, St = R * yt ** 3 / 12, Ot = yt * R ** 3 / 12, vo = 0.14 * Math.pow(Math.min(R, yt), 4), ue = t.matCol < 0.5 ? N : K, ge = t.matCol < 0.5 ? at : ut, Me = t.matCol < 0.5 ? j : J, E = [], Z = [], st = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Map(), eo = /* @__PURE__ */ new Map(), so = /* @__PURE__ */ new Map(), $o = [], xt = [], Ut = (a, k, M) => `${Math.round(a * 1e4)},${Math.round(k * 1e4)},${Math.round(M * 1e4)}`, Qt = /* @__PURE__ */ new Map(), no = (a, k, M) => {
              const L = Ut(a, k, M), q = Qt.get(L);
              if (q !== void 0) return q;
              const nt = E.length;
              return E.push([
                a,
                k,
                M
              ]), Qt.set(L, nt), nt;
            }, pe = new Kt({
              color: 0,
              linewidth: 2
            }), xe = new Kt({
              color: 1118481,
              linewidth: 2
            });
            for (const a of B) {
              const k = a.Lz, M = a.Bz, L = a.t;
              let q = 0, nt = 0;
              a.tipo === "esquinera" ? (q = a.x < l / 2 ? -(k / 2 - C) : k / 2 - C, nt = a.y < i / 2 ? -(M / 2 - C) : M / 2 - C) : a.tipo === "lindero" && (Math.abs(a.x) < 1e-3 || Math.abs(a.x - l) < 1e-3 ? q = a.x < l / 2 ? -(k / 2 - C) : k / 2 - C : (Math.abs(a.y) < 1e-3 || Math.abs(a.y - i) < 1e-3) && (nt = a.y < i / 2 ? -(M / 2 - C) : M / 2 - C));
              const Tt = a.x - q, Et = a.y - nt, Wt = -f, Bt = k / c, to = M / c, lt = [];
              for (let H = 0; H <= c; H++) {
                const ot = [];
                for (let ft = 0; ft <= c; ft++) {
                  const Yt = Tt - k / 2 + ft * Bt, Ct = Et - M / 2 + H * to;
                  ot.push(no(Yt, Ct, Wt));
                }
                lt.push(ot);
              }
              for (let H = 0; H < c; H++) for (let ot = 0; ot < c; ot++) {
                const ft = Z.length;
                Z.push([
                  lt[H][ot],
                  lt[H][ot + 1],
                  lt[H + 1][ot + 1],
                  lt[H + 1][ot]
                ]), qt.set(ft, L), st.set(ft, N), Nt.set(ft, j), Gt.set(ft, at), V.set(ft, ho);
              }
              const ao = 0.5;
              for (let H = 0; H <= c; H++) for (let ot = 0; ot <= c; ot++) {
                const ft = Bt * to * (ot === 0 || ot === c ? 0.5 : 1) * (H === 0 || H === c ? 0.5 : 1), Yt = r * ft, Ct = Yt * ao, O = lt[H][ot];
                $o.push({
                  node: O,
                  dof: 0,
                  k: Ct
                }), $o.push({
                  node: O,
                  dof: 1,
                  k: Ct
                }), $o.push({
                  node: O,
                  dof: 2,
                  k: Yt
                }), $o.push({
                  node: O,
                  dof: 5,
                  k: Yt * 0.1
                });
              }
              const Dt = lt[0][0];
              eo.set(Dt, [
                false,
                false,
                false,
                true,
                true,
                true
              ]);
              let w = 0, P = 0, _ = 1 / 0;
              for (let H = 0; H <= c; H++) for (let ot = 0; ot <= c; ot++) {
                const ft = lt[H][ot], Yt = E[ft][0], Ct = E[ft][1], O = Math.sqrt((Yt - a.x) ** 2 + (Ct - a.y) ** 2);
                O < _ && (_ = O, w = H, P = ot);
              }
              const Ht = lt[w][P], At = e.find((H) => H.idx === a.idx);
              so.set(Ht, [
                0,
                0,
                -At.P_kN,
                At.Mx_kN,
                At.My_kN,
                0
              ]);
              const io = a.ratio;
              let bo = 4906624;
              if (io > 1.5 ? bo = 15680580 : io > 1 ? bo = 16096779 : io > 0.8 && (bo = 16498468), f > 1e-3) {
                const H = new mo().setFromPoints([
                  new X(a.x, a.y, 0),
                  new X(a.x, a.y, -f)
                ]);
                xt.push(new Ce(H, new Kt({
                  color: 6333946,
                  linewidth: 4
                }))), xt.push(oo(`Df=${f.toFixed(2)}m`, a.x + 0.1, a.y + 0.1, -f / 2, "#60a5fa"));
              }
              {
                const H = new Kt({
                  color: 11184810,
                  linewidth: 1,
                  transparent: true,
                  opacity: 0.6
                }), ot = k / c, ft = M / c, Yt = [];
                for (let Ct = 0; Ct <= c; Ct++) {
                  const O = -k / 2 + Ct * ot;
                  Yt.push(new X(Tt + O, Et - M / 2, -f), new X(Tt + O, Et + M / 2, -f));
                }
                for (let Ct = 0; Ct <= c; Ct++) {
                  const O = -M / 2 + Ct * ft;
                  Yt.push(new X(Tt - k / 2, Et + O, -f), new X(Tt + k / 2, Et + O, -f));
                }
                xt.push(new Co(new mo().setFromPoints(Yt), H));
              }
              if ((t.mostrarLabelsZapatas ?? 1) >= 0.5) {
                const H = At.P_kN / 9.80665, ot = At.Mx_kN / 9.80665, ft = At.My_kN / 9.80665;
                xt.push(oo(`P=${H.toFixed(2)} tonf`, a.x, a.y, 0.3, "#fbbf24")), xt.push(oo(`Mx=${ot.toFixed(2)}  My=${ft.toFixed(2)} tonf\xB7m`, a.x, a.y, 0.1, "#fbbf24")), xt.push(oo(`${a.tipo[0].toUpperCase()} ${k.toFixed(2)}\xD7${M.toFixed(2)}\xD7${L.toFixed(2)}m \u03C3/q=${io.toFixed(2)}`, Tt, Et, -f - L - 0.2, io <= 1 ? "#4ade80" : io <= 1.5 ? "#f59e0b" : "#ef4444"));
              }
            }
            const Xt = Math.round(t.sistemaCimentacion ?? 0);
            if (Xt === 1) {
              const a = Math.round(t.vigaAmarre_pos ?? 0), k = t.vigaAmarre_h ?? 0.4, M = t.vigaAmarre_b ?? 0.25, L = M * k, q = M * k ** 3 / 12, nt = k * M ** 3 / 12, Tt = 0.21 * Math.pow(Math.min(M, k), 3) * Math.max(M, k), Et = /* @__PURE__ */ new Map();
              for (const w of B) {
                let P;
                a === 0 ? P = -f : P = -f / 2;
                const _ = no(w.x, w.y, P);
                if (Et.set(w.idx, _), a === 1 && f > 1e-3) {
                  const dt = no(w.x, w.y, -f / 2), Ht = no(w.x, w.y, 0), At = no(w.x, w.y, -f);
                }
              }
              const Wt = /* @__PURE__ */ new Map(), Bt = /* @__PURE__ */ new Map();
              for (const w of e) {
                const P = w.y.toFixed(4), _ = w.x.toFixed(4);
                Wt.has(P) || Wt.set(P, []), Bt.has(_) || Bt.set(_, []), Wt.get(P).push(w), Bt.get(_).push(w);
              }
              const to = (w, P) => {
                const _ = Z.length;
                Z.push([
                  w,
                  P
                ]), st.set(_, ue), Gt.set(_, ge), Nt.set(_, Me), Zt.set(_, L), jt.set(_, nt), U.set(_, q), F.set(_, Tt), V.set(_, ho);
              };
              let lt = 0;
              for (const w of Wt.values()) {
                w.sort((P, _) => P.x - _.x);
                for (let P = 0; P < w.length - 1; P++) {
                  const _ = Et.get(w[P].idx), dt = Et.get(w[P + 1].idx);
                  _ !== void 0 && dt !== void 0 && (to(_, dt), lt++);
                }
              }
              for (const w of Bt.values()) {
                w.sort((P, _) => P.y - _.y);
                for (let P = 0; P < w.length - 1; P++) {
                  const _ = Et.get(w[P].idx), dt = Et.get(w[P + 1].idx);
                  _ !== void 0 && dt !== void 0 && (to(_, dt), lt++);
                }
              }
              const ao = new Kt({
                color: 2282478,
                linewidth: 3
              }), Dt = [];
              for (const w of Wt.values()) {
                const P = [
                  ...w
                ].sort((_, dt) => _.x - dt.x);
                for (let _ = 0; _ < P.length - 1; _++) {
                  const dt = P[_], Ht = P[_ + 1], At = a === 0 ? -f : -f / 2;
                  Dt.push(new X(dt.x, dt.y, At)), Dt.push(new X(Ht.x, Ht.y, At));
                }
              }
              for (const w of Bt.values()) {
                const P = [
                  ...w
                ].sort((_, dt) => _.y - dt.y);
                for (let _ = 0; _ < P.length - 1; _++) {
                  const dt = P[_], Ht = P[_ + 1], At = a === 0 ? -f : -f / 2;
                  Dt.push(new X(dt.x, dt.y, At)), Dt.push(new X(Ht.x, Ht.y, At));
                }
              }
              if (Dt.length > 0) {
                const w = new mo().setFromPoints(Dt);
                xt.push(new Co(w, ao));
              }
              xt.push(oo(`+${lt} vigas de amarre ${(M * 100).toFixed(0)}\xD7${(k * 100).toFixed(0)} cm @ ${a === 0 ? "zapatas" : "pedestales"}`, l / 2, i / 2, a === 1 ? -f / 2 + 0.3 : -f + 0.3, "#22d3ee")), console.log(`[Cimentaci\xF3n] Sistema 1 \u2014 ${lt} vigas de amarre ${(M * 100).toFixed(0)}\xD7${(k * 100).toFixed(0)} cm en posici\xF3n ${a === 0 ? "zapatas" : "pedestales"}`);
            } else Xt >= 2 && (console.warn(`[Cimentaci\xF3n] Sistema ${Xt} (${[
              "",
              "",
              "Vigas T invertida",
              "Vigas rect. + zapata corrida",
              "Losa de cimentaci\xF3n"
            ][Xt]}) a\xFAn no implementado completamente. Mostrando zapatas aisladas. Pr\xF3ximamente: malla shell continua + frames T-invertida.`), xt.push(oo(`Sistema ${Xt} (TODO) \u2014 usando zapatas aisladas`, l / 2, i / 2, 1.5, "#fbbf24")));
            const So = Math.round(t.sistemaCimentacion ?? 0), _o = 0.3, ro = Math.round(t.vigaAmarre_pos ?? 0), yo = /* @__PURE__ */ new Map();
            if (So === 1) {
              const a = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map();
              for (const L of e) {
                const q = L.y.toFixed(4), nt = L.x.toFixed(4);
                a.has(q) || a.set(q, []), k.has(nt) || k.set(nt, []), a.get(q).push(L), k.get(nt).push(L);
              }
              const M = (L) => yo.set(L, (yo.get(L) ?? 0) + 1);
              for (const L of a.values()) {
                L.sort((q, nt) => q.x - nt.x);
                for (let q = 0; q < L.length - 1; q++) M(L[q].idx), M(L[q + 1].idx);
              }
              for (const L of k.values()) {
                L.sort((q, nt) => q.y - nt.y);
                for (let q = 0; q < L.length - 1; q++) M(L[q].idx), M(L[q + 1].idx);
              }
              console.log(`[Cimentaci\xF3n] Vigas de amarre activas \u2014 momentos en zapatas reducidos por factor (1 - ${_o} \xB7 n_vigas/4):`), yo.forEach((L, q) => {
                const nt = (_o * L / 4 * 100).toFixed(0);
                console.log(`   Zapata ${q}: ${L} vigas conectadas \u2192 momento reducido ${nt}%`);
              }), ro === 0 && console.log("   \u21B3 vigaAmarre_pos=0 (mismo nivel zapata) \u2192 en F2K se exportar\xE1 como cimentaci\xF3n corrida con ks\xB7b\xB7dL distribuido por nodo");
            }
            const kt = /* @__PURE__ */ new Map(), bt = /* @__PURE__ */ new Map();
            for (const a of B) {
              const k = e.find((O) => O.idx === a.idx), M = a.Lz, L = a.Bz, q = a.t;
              let nt = 0, Tt = 0;
              a.tipo === "esquinera" ? (nt = a.x < l / 2 ? -(M / 2 - C) : M / 2 - C, Tt = a.y < i / 2 ? -(L / 2 - C) : L / 2 - C) : a.tipo === "lindero" && (Math.abs(a.x) < 1e-3 || Math.abs(a.x - l) < 1e-3 ? nt = a.x < l / 2 ? -(M / 2 - C) : M / 2 - C : (Math.abs(a.y) < 1e-3 || Math.abs(a.y - i) < 1e-3) && (Tt = a.y < i / 2 ? -(L / 2 - C) : L / 2 - C));
              const Et = a.x - nt, Wt = a.y - Tt, Bt = [], to = [], lt = {
                elasticities: /* @__PURE__ */ new Map(),
                shearModuli: /* @__PURE__ */ new Map(),
                poissonsRatios: /* @__PURE__ */ new Map(),
                thicknesses: /* @__PURE__ */ new Map(),
                densities: /* @__PURE__ */ new Map()
              }, ao = M / c, Dt = L / c, w = [], P = [];
              for (let O = 0; O <= c; O++) {
                const et = [];
                for (let mt = 0; mt <= c; mt++) {
                  const Pt = -M / 2 + mt * ao, Ft = -L / 2 + O * Dt;
                  et.push(Bt.length), Bt.push([
                    Pt,
                    Ft,
                    0
                  ]);
                  const Do = Et + Pt, Yo = Wt + Ft, qo = Ut(Do, Yo, -f), lo = Qt.get(qo);
                  lo !== void 0 ? P.push(lo) : P.push(-1);
                }
                w.push(et);
              }
              for (let O = 0; O < c; O++) for (let et = 0; et < c; et++) {
                const mt = to.length;
                to.push([
                  w[O][et],
                  w[O][et + 1],
                  w[O + 1][et + 1],
                  w[O + 1][et]
                ]), lt.thicknesses.set(mt, q), lt.elasticities.set(mt, N), lt.poissonsRatios.set(mt, j), lt.shearModuli.set(mt, at), lt.densities.set(mt, ho);
              }
              const _ = [], dt = 0.5;
              for (let O = 0; O <= c; O++) for (let et = 0; et <= c; et++) {
                const mt = ao * Dt * (et === 0 || et === c ? 0.5 : 1) * (O === 0 || O === c ? 0.5 : 1), Pt = r * mt, Ft = w[O][et];
                _.push({
                  node: Ft,
                  dof: 0,
                  k: Pt * dt
                }), _.push({
                  node: Ft,
                  dof: 1,
                  k: Pt * dt
                }), _.push({
                  node: Ft,
                  dof: 2,
                  k: Pt
                });
              }
              if (So === 1 && ro === 0) {
                const O = t.vigaAmarre_b ?? 0.25, et = a.idx, mt = e.filter((pt) => Math.abs(pt.y - a.y) < 1e-3 && pt.idx !== et).sort((pt, ko) => pt.x - ko.x), Pt = e.filter((pt) => Math.abs(pt.x - a.x) < 1e-3 && pt.idx !== et).sort((pt, ko) => pt.y - ko.y), Ft = mt.find((pt) => pt.x > a.x), Do = [
                  ...mt
                ].reverse().find((pt) => pt.x < a.x), Yo = Pt.find((pt) => pt.y > a.y), qo = [
                  ...Pt
                ].reverse().find((pt) => pt.y < a.y), lo = (pt, ko) => {
                  const ve = ko / 2;
                  for (let co = 0; co <= c; co++) {
                    const Ue = co === 0 || co === c ? ve / (2 * c) : ve / c, _e = r * O * Ue, ye = _e * dt;
                    let fo;
                    switch (pt) {
                      case "x+":
                        fo = w[co][c];
                        break;
                      case "x-":
                        fo = w[co][0];
                        break;
                      case "y+":
                        fo = w[c][co];
                        break;
                      case "y-":
                        fo = w[0][co];
                        break;
                    }
                    _.push({
                      node: fo,
                      dof: 0,
                      k: ye
                    }), _.push({
                      node: fo,
                      dof: 1,
                      k: ye
                    }), _.push({
                      node: fo,
                      dof: 2,
                      k: _e
                    });
                  }
                };
                Ft && lo("x+", Ft.x - a.x), Do && lo("x-", a.x - Do.x), Yo && lo("y+", Yo.y - a.y), qo && lo("y-", a.y - qo.y);
              }
              const Ht = r * ao * Dt * 1e-4;
              _.push({
                node: w[0][0],
                dof: 3,
                k: Ht
              }), _.push({
                node: w[0][0],
                dof: 4,
                k: Ht
              }), _.push({
                node: w[0][0],
                dof: 5,
                k: Ht
              });
              const At = -nt, io = -Tt;
              let bo = 0, Jo = 0, H = 1 / 0;
              for (let O = 0; O <= c; O++) for (let et = 0; et <= c; et++) {
                const mt = -M / 2 + et * ao, Pt = -L / 2 + O * Dt, Ft = (mt - At) ** 2 + (Pt - io) ** 2;
                Ft < H && (H = Ft, bo = O, Jo = et);
              }
              const ot = w[bo][Jo], ft = /* @__PURE__ */ new Map(), Yt = yo.get(a.idx) ?? 0, Ct = So === 1 ? Math.max(0.4, 1 - _o * Yt / 4) : 1;
              ft.set(ot, [
                0,
                0,
                -k.P_kN,
                k.Mx_kN * Ct,
                k.My_kN * Ct,
                0
              ]);
              try {
                const et = be(Bt, to, {
                  supports: /* @__PURE__ */ new Map(),
                  loads: ft
                }, lt, _).deformations;
                for (let mt = 0; mt < Bt.length; mt++) {
                  const Pt = P[mt];
                  if (Pt >= 0) {
                    const Ft = et.get(mt);
                    Ft && kt.set(Pt, [
                      ...Ft
                    ]);
                  }
                }
              } catch (O) {
                console.warn(`[Zapata ${a.idx}] solver fall\xF3:`, O);
              }
            }
            for (let a = 0; a < Z.length; a++) {
              const k = Z[a];
              if (k.length !== 4) continue;
              const M = [];
              for (const L of k) {
                const q = kt.get(L);
                M.push(r * (q ? q[2] : 0) / 9.80665);
              }
              bt.set(a, M);
            }
            n.nodes.val = E, n.elements.val = Z, n.nodeInputs.val = {
              supports: eo,
              loads: so
            }, n.elementInputs.val = {
              etabsWallJoint: Math.round(t.comparar ?? 1) === 1,
              elasticities: st,
              shearModuli: Gt,
              areas: Zt,
              momentsOfInertiaY: jt,
              momentsOfInertiaZ: U,
              torsionalConstants: F,
              densities: V,
              poissonsRatios: Nt,
              thicknesses: qt
            }, n.deformOutputs.val = {
              deformations: kt,
              reactions: /* @__PURE__ */ new Map()
            }, n.analyzeOutputs.val = {
              pressure: bt,
              colorMapRanges: {
                pressure: [
                  -v,
                  0
                ]
              }
            }, n.objects3D.val = xt, console.log(`[Modo Cimentaci\xF3n] ${e.length} zapatas + pedestales (Hf=${f} m, t=${b} m, q_adm=${v} tonf/m\xB2, ks=${r} kN/m\xB3) \u2014 reemplaza superestructura`);
            try {
              const a = () => {
                var _a2;
                const M = (_a2 = document.querySelector("#viewer")) == null ? void 0 : _a2.__settings;
                M && (M.shellResults && (M.shellResults.val = "pressure"), M.deformedShape && (M.deformedShape.val = false), M.deformScale && (M.deformScale.val = 5), M.frameResults && (M.frameResults.val = "none"), M.custom3D && (M.custom3D.val = true));
              };
              [
                0,
                100,
                300
              ].forEach((k) => setTimeout(a, k));
            } catch {
            }
            return;
          }
        }
      } catch (o) {
        console.warn("[Modo Cimentaci\xF3n] error:", o);
      }
      n.objects3D.val = Ko;
    },
    runModal(t, n, D) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      const p = n.nodes.val, A = n.elements.val, u = n.nodeInputs.val, y = n.elementInputs.val;
      if (!(!p.length || !A.length || !((_a = u.supports) == null ? void 0 : _a.size) || !((_b = y.densities) == null ? void 0 : _b.size))) try {
        const I = [], N = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), gt = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map();
        let it = 0, g = 0;
        const d = [];
        let m = 0;
        for (let $ = 0; $ < A.length; $++) {
          const tt = A[$];
          let It = false, $t = false;
          if (tt.length === 4) {
            const Lt = tt.map((Rt) => p[Rt][2]);
            if (Math.max(...Lt) - Math.min(...Lt) < 0.02) {
              const Rt = p[tt[0]][0], uo = p[tt[0]][1], go = p[tt[2]][0], Jt = p[tt[2]][1], Ao = Math.abs((go - Rt) * (Jt - uo)), Fo = ((_c = y.thicknesses) == null ? void 0 : _c.get($)) ?? 0.15, wo = ((_d = y.densities) == null ? void 0 : _d.get($)) ?? 24;
              it += wo * Ao * Fo, It = true;
            }
          } else if (tt.length === 2) {
            const Lt = p[tt[0]][2], _t = p[tt[1]][2], Rt = Math.sqrt((p[tt[1]][0] - p[tt[0]][0]) ** 2 + (p[tt[1]][1] - p[tt[0]][1]) ** 2);
            if (Math.abs(_t - Lt) > Rt) {
              $t = true;
              const uo = Math.abs(_t - Lt), go = ((_e = y.areas) == null ? void 0 : _e.get($)) ?? 0, Jt = ((_f = y.densities) == null ? void 0 : _f.get($)) ?? 24;
              g += Jt * go * uo;
            }
          }
          It || (I.push(tt), ((_g = y.areas) == null ? void 0 : _g.has($)) && N.set(m, y.areas.get($)), ((_h = y.momentsOfInertiaY) == null ? void 0 : _h.has($)) && K.set(m, y.momentsOfInertiaY.get($)), ((_i = y.momentsOfInertiaZ) == null ? void 0 : _i.has($)) && j.set(m, y.momentsOfInertiaZ.get($)), ((_j = y.torsionalConstants) == null ? void 0 : _j.has($)) && J.set(m, y.torsionalConstants.get($)), ((_k = y.elasticities) == null ? void 0 : _k.has($)) && at.set(m, y.elasticities.get($)), ((_l = y.shearModuli) == null ? void 0 : _l.has($)) && ut.set(m, y.shearModuli.get($)), ((_m = y.densities) == null ? void 0 : _m.has($)) && Q.set(m, y.densities.get($)), ((_n = y.thicknesses) == null ? void 0 : _n.has($)) && gt.set(m, y.thicknesses.get($)), ((_o = y.poissonsRatios) == null ? void 0 : _o.has($)) && W.set(m, y.poissonsRatios.get($)), $t && d.push(m), m++);
        }
        if (it > 0 && g > 0 && d.length > 0) {
          const $ = 1 + it / g;
          for (const tt of d) {
            const It = Q.get(tt) ?? 24;
            Q.set(tt, It * $);
          }
        }
        const ct = {
          areas: N,
          momentsOfInertiaY: K,
          momentsOfInertiaZ: j,
          torsionalConstants: J,
          elasticities: at,
          shearModuli: ut,
          densities: Q,
          thicknesses: gt,
          poissonsRatios: W
        }, vt = Math.round(t.nPisos), S = Math.min(60, Math.max(15, 3 * vt + 6)), x = We(p, I, u, ct, S), T = Math.round(t.nVanosX), z = Math.round(t.nVanosY), ht = Math.round(t.nPisos), wt = g > 0 ? 1 + it / g : 1;
        D.render(x, {
          title: `Edificio ${T}\xD7${z} vanos \xD7 ${ht} pisos \xB7 ${S} modos`,
          properties: [
            `Material cols=${t.matCol < 0.5 ? "Hormig\xF3n" : "Acero"} vigas=${t.matViga < 0.5 ? "Hormig\xF3n" : "Acero"}  f'c=${t.fcConcr} kg/cm\xB2`,
            `Apoyo: ${[
              "Empotrado",
              "Articulado",
              "R\xF3tula"
            ][Math.round(t.apoyo)]}${t.slabOn >= 0.5 ? ` + Losa (lumped: \xD7${wt.toFixed(2)} dens cols, ${it.toFixed(0)} kN/g)` : ""}${t.bracesMode > 0 ? " + Diagonales" : ""}${(t.murosMode ?? 0) > 0 ? " + Muros Q4" : ""}`,
            "Estilo ETABS: losas filtradas del modal + masa transferida a columnas (igual que membrane diaphragm en ETABS/SAP)"
          ]
        });
        const zt = x.frequencies[0] ?? 0;
        console.log(`[Edificio Modal] ${S} modos \xB7 f\u2081=${zt.toFixed(4)} Hz \xB7 m_slab=${it.toFixed(0)} m_cols=${g.toFixed(0)} factor=${wt.toFixed(2)}`);
      } catch (I) {
        console.warn("Modal edificio error:", I.message);
      }
    }
  };
});
export {
  __tla,
  bs as e,
  ys as f
};
