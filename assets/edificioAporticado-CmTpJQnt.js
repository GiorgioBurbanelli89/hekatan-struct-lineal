import { a as ts } from "./analyze-DgLgRmKg.js";
import { m as os, d as we, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { a as es } from "./cadSections-DVtTZU6U.js";
import { b as ss, a as oo } from "./cotas3D-CP6xTezf.js";
import { S as ns, f as as, M as Ho, e as Qo, a as Kt, B as ho, V as X, d as ze, b as is, L as Co, E as cs, I as rs, D as ls } from "./theme-U-6D_qyI.js";
let ws, Cs;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function Ao(t, n = 0.5) {
    const D = ds(n), y = t / D;
    let O = Math.max(2, Math.round(y));
    return t / O > D * 1.25 && (O = Math.ceil(y)), {
      n: O,
      dx: t / O
    };
  }
  function ds(t) {
    return typeof t == "number" ? t : t === "fine" ? 0.25 : 0.5;
  }
  const fs = {
    "Grueso (50 cm)": 0.5,
    "Medio (30 cm)": 0.3,
    "Fino (25 cm)": 0.25,
    "Muy fino (15 cm)": 0.15
  };
  function hs(t, n, D = {}) {
    const y = D.tol ?? 1e-5, O = 0, g = [], b = [], I = {
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
      for (let h = 0; h < t.length; h++) Math.abs(t[h][2] - ut) < y && (Q.push(h), gt += t[h][0], W += t[h][1]);
      if (Q.length < 2) continue;
      const it = gt / Q.length, p = W / Q.length, f = t.length + g.length;
      g.push({
        idx: f,
        z: ut,
        x: it,
        y: p
      });
      for (const h of Q) {
        const ct = t[h][0] - it, vt = t[h][1] - p;
        if (Math.hypot(ct, vt) < y) {
          console.info(`[diafragma] z = ${ut}: el nudo ${h} cae sobre el master (${it.toFixed(3)}, ${p.toFixed(3)}): sin link, un elemento de longitud cero no ata nada.`);
          continue;
        }
        b.push([
          f,
          h
        ]);
        const S = O + b.length - 1;
        I.areas.set(S, K), I.momentsOfInertiaY.set(S, j), I.momentsOfInertiaZ.set(S, j), I.torsionalConstants.set(S, J), I.elasticities.set(S, N), I.shearModuli.set(S, at), I.densities.set(S, 0);
      }
    }
    return D.linkStiffness, {
      masterNodes: g,
      rigidLinks: b,
      linkProps: I
    };
  }
  function ms(t, n, D) {
    const y = (O, g) => {
      O.forEach((b, I) => g.set(I + D, b));
    };
    n.areas = n.areas ?? /* @__PURE__ */ new Map(), n.momentsOfInertiaY = n.momentsOfInertiaY ?? /* @__PURE__ */ new Map(), n.momentsOfInertiaZ = n.momentsOfInertiaZ ?? /* @__PURE__ */ new Map(), n.torsionalConstants = n.torsionalConstants ?? /* @__PURE__ */ new Map(), n.elasticities = n.elasticities ?? /* @__PURE__ */ new Map(), n.shearModuli = n.shearModuli ?? /* @__PURE__ */ new Map(), n.densities = n.densities ?? /* @__PURE__ */ new Map(), y(t.linkProps.areas, n.areas), y(t.linkProps.momentsOfInertiaY, n.momentsOfInertiaY), y(t.linkProps.momentsOfInertiaZ, n.momentsOfInertiaZ), y(t.linkProps.torsionalConstants, n.torsionalConstants), y(t.linkProps.elasticities, n.elasticities), y(t.linkProps.shearModuli, n.shearModuli), y(t.linkProps.densities, n.densities);
  }
  function $e(t) {
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
  function us(t, n, D) {
    if (t <= 0 || n <= 0) return 1e-12;
    const O = Math.sqrt(12 * n / t) / 2;
    return n / O * D;
  }
  function gs(t, n, D, y, O, g, b, I = {}) {
    var _a, _b;
    const N = I.Fy_steel ?? 345e3;
    I.fc_concrete;
    const K = I.Fy_rebar ?? 42e4, j = I.omega ?? 0.15, J = I.phi ?? 0.9, at = O < 0.5 ? J * j * K * (1 - 0.59 * j) : J * N, ut = g < 0.5 ? J * j * K * (1 - 0.59 * j) : J * N, Q = D.frameBendingMoments, gt = [];
    for (let W = 0; W < n.length; W++) {
      const it = n[W];
      if (it.length !== 2) continue;
      const [p, f] = it, h = b.has(W);
      let ct = 0, vt = 0;
      const S = Q == null ? void 0 : Q.get(W);
      S && (ct = S.Mi, vt = S.Mj);
      const u = ((_a = y.areas) == null ? void 0 : _a.get(W)) ?? 0.16, T = ((_b = y.momentsOfInertiaZ) == null ? void 0 : _b.get(W)) ?? 213e-5, rt = us(u, T, h ? at : ut), wt = ct / rt, zt = vt / rt;
      gt.push({
        nodeIdx: p,
        elementIdx: W,
        end: "i",
        classification: $e(wt)
      }), gt.push({
        nodeIdx: f,
        elementIdx: W,
        end: "j",
        classification: $e(zt)
      });
    }
    return gt;
  }
  function Ms(t, n, D, y = {}) {
    const O = y.showElastic ?? false, g = (y.radiusFactor ?? 0.02) * D, b = [], I = new ns(g, 12, 8);
    for (const N of t) {
      if (!O && N.classification.state === "Elastic") continue;
      const K = n[N.nodeIdx];
      if (!K) continue;
      const j = new as({
        color: N.classification.color,
        transparent: true,
        opacity: 0.85
      }), J = new Ho(I, j);
      J.position.set(K[0], K[1], K[2]), J.userData = {
        hingeState: N.classification.state,
        ratio: N.classification.ratio.toFixed(3),
        element: N.elementIdx,
        end: N.end
      }, b.push(J);
    }
    return b;
  }
  function ps(t) {
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
  const Wo = 9.80665;
  function ke(t, n, D, y, O = 0.01) {
    const g = Math.abs(t) < O, b = Math.abs(t - D) < O, I = Math.abs(n) < O, N = Math.abs(n - y) < O, K = [
      g,
      b,
      I,
      N
    ].filter(Boolean).length;
    return K >= 2 ? "esquinera" : K === 1 ? "lindero" : "central";
  }
  function Ae(t) {
    const { P_kN: n, Mx_kN: D, My_kN: y, tipo: O, q_adm_tonf: g, ks: b } = t, I = t.Lz_min ?? 1, N = t.Lz_max ?? 4, K = t.t_min ?? 0.3;
    if (n <= 0) return {
      tipo: O,
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
    const j = g * Wo, J = Math.abs(y / n), at = Math.abs(D / n), ut = j * 0.95;
    let Q = Math.max(I, Math.sqrt(n / j)), gt = Q, W = 1 / 0, it = 0, p = false;
    for (let u = 0; u < 50 && Q <= N; u++) {
      const T = O === "esquinera" ? 0.3 : O === "lindero" ? 0.2 : 0, z = Q + T, rt = gt + T, wt = z * rt, zt = Math.max(J, at), $ = zt === J ? z : rt;
      if (p = zt > $ / 6, !p) W = n / wt * (1 + 6 * zt / $), it = n / wt * (1 - 6 * zt / $);
      else {
        const tt = 1.5 * $ - 3 * zt, It = zt === J ? rt : z;
        W = 2 * n / (It * Math.max(tt, 0.01)), it = 0;
      }
      if (W <= ut) break;
      Q += 0.05, gt += 0.05;
    }
    const f = Q * gt, h = Math.max(K, Q / 6), ct = W / j, vt = ct <= 1 ? "OK" : "OVERSTRESS";
    let S;
    return b && b > 0 && (S = W / b * 1e3), {
      tipo: O,
      Lz: Q,
      Bz: gt,
      t: h,
      A: f,
      ex: J,
      ey: at,
      sigmaMax_tonf: W / Wo,
      sigmaMin_tonf: it / Wo,
      ratio: ct,
      delta_mm: S,
      fueraKern: p,
      status: vt
    };
  }
  function Ro(t, n, D, y, O) {
    return t.map((g) => {
      const b = ke(g.x, g.y, n, D);
      return {
        ...Ae({
          P_kN: g.P_kN,
          Mx_kN: g.Mx_kN,
          My_kN: g.My_kN,
          tipo: b,
          q_adm_tonf: y,
          ks: O
        }),
        idx: g.idx,
        x: g.x,
        y: g.y
      };
    });
  }
  let te, mo, Se, m, G;
  Cs = Object.freeze(Object.defineProperty({
    __proto__: null,
    classifyFootingType: ke,
    designAllFootings: Ro,
    designFooting: Ae
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  te = 9.81;
  mo = 24 / te;
  Se = 78 / te;
  m = (t, n, D, y, O, g) => ({
    default: D,
    min: y,
    max: O,
    step: g,
    label: n,
    folder: t
  });
  G = (t, n, D, y) => ({
    default: D,
    label: n,
    folder: t,
    options: y
  });
  ws = {
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
        ...m("Geometr\xEDa", "Vanos X", 2, 1, 6, 1),
        regenOnChange: true
      },
      nVanosY: {
        ...m("Geometr\xEDa", "Vanos Y", 2, 1, 6, 1),
        regenOnChange: true
      },
      nPisos: {
        ...m("Geometr\xEDa", "N. Pisos", 3, 1, 8, 1),
        regenOnChange: true
      },
      spanX: m("Geometr\xEDa", "Luz X uniforme (m)", 5, 2, 12, 0.5),
      spanY: m("Geometr\xEDa", "Luz Y uniforme (m)", 5, 2, 12, 0.5),
      hPiso: m("Geometr\xEDa", "h piso uniforme (m)", 3, 2, 5, 0.1),
      Lvix: m("Geometr\xEDa", "Voladizo izq X (m)", 0, 0, 3, 0.25),
      Lvdx: m("Geometr\xEDa", "Voladizo der X (m)", 0, 0, 3, 0.25),
      Lviy: m("Geometr\xEDa", "Voladizo izq Y (m)", 0, 0, 3, 0.25),
      Lvdy: m("Geometr\xEDa", "Voladizo der Y (m)", 0, 0, 3, 0.25),
      hP_7: m("Alturas por piso", "Piso 7 (m)", 0, 0, 6, 0.1),
      hP_8: m("Alturas por piso", "Piso 8 (m)", 0, 0, 6, 0.1),
      matCol: G("Secciones (global)", "Material columna", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1,
        "CFT (tubo relleno)": 2
      }),
      tCft: m("Secciones (global)", "t pared CFT (m)", 0.01, 4e-3, 0.03, 1e-3),
      matViga: G("Secciones (global)", "Material viga", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1
      }),
      colShape: G("Secciones (global)", "Forma columna", 0, {
        Rectangular: 0,
        Circular: 1
      }),
      fcConcr: m("Secciones (global)", "f'c hormig\xF3n (kg/cm\xB2)", 240, 140, 420, 10),
      fyAcero: m("Secciones (global)", "fy acero (kg/cm\xB2)", 2530, 1800, 4200, 100),
      colSize: m("Secciones (global)", "b\xD7h columna (m)", 0.4, 0.25, 0.8, 0.05),
      vigaB: m("Secciones (global)", "b viga (m)", 0.3, 0.2, 0.6, 0.05),
      vigaH: m("Secciones (global)", "h viga (m)", 0.5, 0.3, 0.9, 0.05),
      nDivBeam: m("Mesh", "Div. Vigas (segmentos)", 1, 1, 8, 1),
      nDivCol: m("Mesh", "Div. Columnas (segmentos)", 1, 1, 8, 1),
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
      vigSecCantidad: m("Vigas Secundarias", "Cantidad/vano", 2, 1, 5, 1),
      vigSecB: m("Vigas Secundarias", "b sec (m)", 0.2, 0.1, 0.4, 0.05),
      vigSecH: m("Vigas Secundarias", "h sec (m)", 0.3, 0.2, 0.6, 0.05),
      losaActivar: {
        ...G("Losas de Piso", "Activar losas", 0, {
          No: 0,
          S\u00ED: 1
        }),
        regenOnChange: true
      },
      losaEspesor: m("Losas de Piso", "Espesor (m)", 0.15, 0.08, 0.4, 0.01),
      losaSubdivX: m("Losas de Piso", "Subdiv. X", 2, 1, 6, 1),
      losaSubdivY: m("Losas de Piso", "Subdiv. Y", 2, 1, 6, 1),
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
      muroEspesor: m("Muros de Corte", "Espesor (m)", 0.2, 0.1, 0.4, 0.01),
      muroSubdivV: m("Muros de Corte", "Subdiv. V (vert)", 2, 1, 6, 1),
      muroSubdivH: m("Muros de Corte", "Subdiv. H (horiz)", 2, 1, 6, 1),
      apoyo: G("Apoyo", "Tipo", 0, {
        Empotrado: 0,
        "Articulado (3 DOFs)": 1,
        "R\xF3tula completa": 2
      }),
      comparar: G("Apoyo", "Comparar con", 1, {
        "ETABS (uni\xF3n viga-muro de ETABS)": 1,
        "SAP2000 (sin sem\xE1nticas)": 0
      }),
      offsets: G("Apoyo", "Brazos r\xEDgidos", 1, {
        "ETABS (autom\xE1ticos: solo peso y masa)": 1,
        "Ninguno (SAP2000)": 0
      }),
      CM: m("Cargas", "CM (kN/nodo)", -5, -30, 0, 0.5),
      CV: m("Cargas", "CV (kN/nodo)", -2, -20, 0, 0.5),
      Ex: m("Cargas", "Ex sismo tope (kN)", 50, 0, 500, 10),
      Ey: m("Cargas", "Ey sismo tope (kN)", 0, 0, 500, 10),
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
      q_adm_zapata: m("Cimentaci\xF3n", "q_adm (tonf/m\xB2)", 10, 1, 100, 1),
      ks_zapata: m("Cimentaci\xF3n", "ks (kN/m\xB3)", 1030, 100, 2e5, 10),
      Hf_pedestal: m("Cimentaci\xF3n", "Df col enterrada (m) (m)", 0.5, 0, 3, 0.05),
      t_zapata: m("Cimentaci\xF3n", "t zapata (m)", 0.3, 0.1, 1.5, 0.05),
      nSubZapata: m("Cimentaci\xF3n", "Subdiv. Q4 zapata", 4, 2, 12, 1),
      voladoExtra: m("Cimentaci\xF3n", "Volado extra esq./lin (m)", 0.3, 0, 1, 0.05),
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
      vigaAmarre_h: m("Cimentaci\xF3n", "Viga amarre h (m)", 0.4, 0.2, 1, 0.05),
      vigaAmarre_b: m("Cimentaci\xF3n", "Viga amarre b (m)", 0.25, 0.15, 0.6, 0.05),
      vigaCim_h: m("Cimentaci\xF3n", "Viga cim. h (m)", 0.8, 0.3, 2, 0.05),
      vigaCim_bw: m("Cimentaci\xF3n", "Viga cim. b alma (m)", 0.4, 0.2, 1, 0.05),
      vigaCim_bf: m("Cimentaci\xF3n", "Viga cim. b ala (m)", 1.2, 0.4, 3, 0.1),
      vigaCim_tf: m("Cimentaci\xF3n", "Viga cim. e ala (m)", 0.3, 0.1, 0.8, 0.05),
      nSubViga: m("Avanzado", "Div. vigas", 1, 1, 6, 1),
      nSubCol: m("Avanzado", "Div. columnas", 1, 1, 4, 1),
      vSecOn: G("Avanzado", "Vigas secundarias", 0, {
        Off: 0,
        On: 1
      }),
      nVSec: m("Avanzado", "N\xB0 vigas sec. por vano", 2, 1, 5, 1),
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
      slabT: m("Avanzado", "t losa (m)", 0.15, 0.08, 0.3, 0.01),
      murosMode: G("Avanzado", "Muros de corte (c\xE1scara)", 0, {
        ninguno: 0,
        "en X (fachadas Y)": 1,
        "en Y (fachadas X)": 2,
        "en X e Y": 3
      }),
      tMuro: m("Avanzado", "t muro (m)", 0.25, 0.15, 0.6, 0.05),
      slabType: G("Avanzado", "Tipo losa (ETABS)", 0, {
        "Shell (membrane+plate)": 0,
        "Membrane only": 1,
        "Plate only": 2
      }),
      slabDisc: G("Avanzado", "Discretizaci\xF3n losa", 0.5, fs),
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
      qDead: m("Avanzado", "qDead losa (kN/m\xB2)", 3.5, 0.5, 10, 0.5),
      qLive: m("Avanzado", "qLive losa (kN/m\xB2)", 1.5, 0, 6, 0.5),
      crackedSections: G("Avanzado", "Cracked Sections (ACI 318)", 0, {
        "Off (secci\xF3n bruta Ig)": 0,
        "On: 0.7\xB7Ig col / 0.35\xB7Ig viga / 0.25\xB7Ig losa": 1
      })
    },
    dynamicParams(t) {
      const n = {}, D = Math.round(t.nPisos ?? 3), y = Math.round(t.nVanosX ?? 2), O = Math.round(t.nVanosY ?? 2);
      for (let g = 1; g <= D; g++) n[`hP_${g}`] = m("Alturas por piso", `h Piso ${g} (m)`, 0, 0, 6, 0.1), n[`colB_p${g}`] = m("Secciones por piso", `b col P${g} (m)`, 0, 0, 1, 0.05), n[`colH_p${g}`] = m("Secciones por piso", `h col P${g} (m)`, 0, 0, 1, 0.05), n[`vigaB_p${g}`] = m("Secciones por piso", `b viga P${g} (m)`, 0, 0, 0.8, 0.05), n[`vigaH_p${g}`] = m("Secciones por piso", `h viga P${g} (m)`, 0, 0, 1, 0.05);
      for (let g = 1; g <= y; g++) n[`svX_${g}`] = m("Luces por vano", `svX #${g} (m)`, 0, 0, 12, 0.5);
      for (let g = 1; g <= O; g++) n[`svY_${g}`] = m("Luces por vano", `svY #${g} (m)`, 0, 0, 12, 0.5);
      return n;
    },
    computedLabels(t, n) {
      var _a;
      const y = (_a = n.deformOutputs.rawVal) == null ? void 0 : _a.reactions, O = n.nodes.rawVal;
      if (!y || !(O == null ? void 0 : O.length)) return {
        "Reacciones (\u2192 zapatas)": "\u2014"
      };
      let g = 0, b = 0, I = 0, N = -1, K = 0, j = -1;
      const J = [];
      let at = 0, ut = 0;
      y.forEach((ct, vt) => {
        const S = O[vt];
        if (!S || Math.abs(S[2]) > 1e-6) return;
        const u = ct[2], T = ct[3], z = ct[4];
        Math.abs(u) > Math.abs(g) && (g = u, N = vt, S[0], S[1]), u > 0 && u > Math.abs(K) && (K = u, j = vt), Math.abs(T) > Math.abs(b) && (b = T), Math.abs(z) > Math.abs(I) && (I = z), J.push({
          idx: vt,
          x: S[0],
          y: S[1],
          P_kN: Math.abs(u),
          Mx_kN: T,
          My_kN: z
        }), S[0] > at && (at = S[0]), S[1] > ut && (ut = S[1]);
      });
      const Q = Math.abs(g) / 9.80665, gt = Math.abs(b) / 9.80665, W = Math.abs(I) / 9.80665, it = K / 9.80665, p = Math.round(t.nPisos), f = {
        "\u2500\u2500 Reacciones m\xE1x (\u2192 zapatas) \u2500\u2500": "",
        "P (compresi\xF3n)": `${Q.toFixed(2)} tonf (nodo ${N})`,
        Mx: `${gt.toFixed(2)} tonf\xB7m`,
        My: `${W.toFixed(2)} tonf\xB7m`
      };
      if (it > 0.01 && (f["\u26A0 Uplift"] = `${it.toFixed(2)} tonf (nodo ${j})`), f.Pisos = `${p}`, f["Copiar a \u2192 zapata-aislada"] = `P=${Q.toFixed(1)}, Mx=${gt.toFixed(1)}, My=${W.toFixed(1)}`, J.length > 0 && at > 0 && ut > 0) {
        const ct = t.q_adm_zapata ?? 10, vt = t.ks_zapata ?? 1030;
        try {
          const S = Ro(J, at, ut, ct, vt);
          let u = 0, T = 0, z = 0, rt = 0, wt = -1, zt = "", $ = 0, tt = 0;
          for (const yt of S) yt.tipo === "esquinera" ? u++ : yt.tipo === "lindero" ? T++ : z++, yt.sigmaMax_tonf > rt && (rt = yt.sigmaMax_tonf, wt = yt.idx, zt = yt.tipo), yt.status === "OK" && $++, yt.Lz > tt && (tt = yt.Lz);
          f["\u2500\u2500 Cimentaci\xF3n (auto) \u2500\u2500"] = "", f["Tipos zapata"] = `${u} esquineras, ${T} linderas, ${z} centrales`, f["\u03C3_max global"] = `${rt.toFixed(2)} tonf/m\xB2 (nodo ${wt}, ${zt})`, f["\u03C3/q_adm"] = `${(rt / ct).toFixed(2)}` + (rt / ct <= 1 ? " \u2713" : " \u26A0"), f["Lz m\xE1x zapata"] = `${tt.toFixed(2)} m`, f.Cumplen = `${$}/${S.length}` + ($ === S.length ? " \u2713" : " \u26A0");
          const It = t.Hf_pedestal ?? 0.5, $t = t.t_zapata ?? 0.3, Lt = Math.round(t.nSubZapata ?? 4);
          f["Df col enterrada"] = `${It.toFixed(2)} m` + (It < 1e-3 ? " (sin pedestal)" : ""), f["t zapata"] = `${$t.toFixed(2)} m`, f["Subdiv. Q4"] = `${Lt}\xD7${Lt}`, f["Volado extra"] = `${(t.voladoExtra ?? 0.3).toFixed(2)} m`;
        } catch {
          f["\u2500\u2500 Cimentaci\xF3n \u2500\u2500"] = "module load error";
        }
      }
      const h = n.__plasticHinges;
      if (h) {
        const ct = (h.B ?? 0) + (h.IO ?? 0) + (h.LS ?? 0) + (h.CP ?? 0);
        f["\u2500\u2500 R\xF3tulas pl\xE1sticas (ASCE 41-17) \u2500\u2500"] = "", f["\u{1F7E2} El\xE1stico"] = `${h.Elastic ?? 0}`, f["\u{1F7E1} B \u2014 Yield"] = `${h.B ?? 0}`, f["\u{1F7E0} IO \u2014 Immed.Occ."] = `${h.IO ?? 0}`, f["\u{1F534} LS \u2014 Life Safety"] = `${h.LS ?? 0}`, f["\u26AB CP \u2014 Collapse Prev."] = `${h.CP ?? 0}`, f["Total r\xF3tulas formadas"] = `${ct}`;
      }
      return f;
    },
    build(t, n) {
      var _a, _b;
      const D = Math.round(t.nVanosX), y = Math.round(t.nVanosY), O = Math.round(t.nPisos), g = Math.max(1, Math.round(t.nSubViga)), b = Math.max(1, Math.round(t.nSubCol)), I = t.fcConcr * 0.0981, N = 4700 * Math.sqrt(I) * 1e3, K = 2e8, j = 0.2, J = 0.3, at = N / (2 * (1 + j)), ut = K / (2 * (1 + J)), Q = (o, s, e) => Array.from({
        length: s
      }, (l, a) => {
        const M = t[`${o}${a + 1}`];
        return typeof M == "number" && M > 0 ? M : e;
      }), gt = Q("svX_", D, t.spanX), W = Q("svY_", y, t.spanY), it = Q("hP_", O, t.hPiso), p = [];
      t.Lvix > 0 && p.push(-t.Lvix), p.push(0);
      for (let o = 0; o < D; o++) p.push(p[p.length - 1] + gt[o]);
      t.Lvdx > 0 && p.push(p[p.length - 1] + t.Lvdx);
      const f = [];
      t.Lviy > 0 && f.push(-t.Lviy), f.push(0);
      for (let o = 0; o < y; o++) f.push(f[f.length - 1] + W[o]);
      t.Lvdy > 0 && f.push(f[f.length - 1] + t.Lvdy);
      const h = [
        0
      ];
      for (let o = 0; o < O; o++) h.push(h[h.length - 1] + it[o]);
      const ct = (o) => t.Lvix > 0 && o === 0 || t.Lvdx > 0 && o === p.length - 1, vt = (o) => t.Lviy > 0 && o === 0 || t.Lvdy > 0 && o === f.length - 1, S = (o, s) => ct(o) || vt(s), u = [], T = {};
      for (let o = 0; o < h.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < p.length; e++) o === 0 && S(e, s) || (T[`${e},${s},${o}`] = u.length, u.push([
        p[e],
        f[s],
        h[o]
      ]));
      const z = [], rt = /* @__PURE__ */ new Set(), wt = /* @__PURE__ */ new Set(), zt = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), tt = (o, s, e, l, a) => {
        if (e <= 1) {
          l.add(z.length), $.set(z.length, a), z.push([
            o,
            s
          ]);
          return;
        }
        const M = u[o], r = u[s];
        let d = o;
        for (let v = 1; v < e; v++) {
          const i = v / e, C = u.length;
          u.push([
            M[0] + (r[0] - M[0]) * i,
            M[1] + (r[1] - M[1]) * i,
            M[2] + (r[2] - M[2]) * i
          ]), l.add(z.length), $.set(z.length, a), z.push([
            d,
            C
          ]), d = C;
        }
        l.add(z.length), $.set(z.length, a), z.push([
          d,
          s
        ]);
      }, It = (o) => {
        const s = u[o];
        for (let e = z.length - 1; e >= 0; e--) {
          const l = z[e];
          if (l.length !== 2) continue;
          const [a, M] = l;
          if (a === o || M === o) continue;
          const r = u[a], d = u[M], v = [
            d[0] - r[0],
            d[1] - r[1],
            d[2] - r[2]
          ], i = [
            s[0] - r[0],
            s[1] - r[1],
            s[2] - r[2]
          ], C = v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
          if (C < 1e-12) continue;
          const Y = (i[0] * v[0] + i[1] * v[1] + i[2] * v[2]) / C;
          if (Y < 1e-6 || Y > 1 - 1e-6 || Math.hypot(i[0] - Y * v[0], i[1] - Y * v[1], i[2] - Y * v[2]) > 1e-6) continue;
          z[e] = [
            a,
            o
          ];
          const B = z.length;
          z.push([
            o,
            M
          ]), wt.has(e) && wt.add(B), rt.has(e) && rt.add(B), $.has(e) && $.set(B, $.get(e));
        }
      };
      for (let o = 0; o < h.length - 1; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < p.length; e++) S(e, s) || tt(T[`${e},${s},${o}`], T[`${e},${s},${o + 1}`], b, rt, o);
      for (let o = 1; o < h.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < p.length - 1; e++) tt(T[`${e},${s},${o}`], T[`${e + 1},${s},${o}`], g, wt, o - 1);
      for (let o = 1; o < h.length; o++) for (let s = 0; s < p.length; s++) for (let e = 0; e < f.length - 1; e++) tt(T[`${s},${e},${o}`], T[`${s},${e + 1},${o}`], g, wt, o - 1);
      if (t.vSecOn >= 0.5 && t.nVSec >= 1) {
        const o = Math.round(t.nVSec), s = (l, a, M) => {
          for (let d = 0; d < u.length; d++) if (Math.abs(u[d][0] - l) < 1e-6 && Math.abs(u[d][1] - a) < 1e-6 && Math.abs(u[d][2] - M) < 1e-6) return d;
          const r = u.length;
          return u.push([
            l,
            a,
            M
          ]), It(r), r;
        }, e = (l, a) => t.vSecDir < 0.5 ? "x" : t.vSecDir < 1.5 ? "y" : p[l + 1] - p[l] <= f[a + 1] - f[a] ? "x" : "y";
        for (let l = 1; l < h.length; l++) for (let a = 0; a < p.length - 1; a++) for (let M = 0; M < f.length - 1; M++) {
          const r = p[a], d = p[a + 1], v = f[M], i = f[M + 1];
          for (let C = 1; C <= o; C++) {
            const Y = C / (o + 1), [B, lt] = e(a, M) === "x" ? [
              s(r, v + Y * (i - v), h[l]),
              s(d, v + Y * (i - v), h[l])
            ] : [
              s(r + Y * (d - r), v, h[l]),
              s(r + Y * (d - r), i, h[l])
            ];
            wt.add(z.length), z.push([
              B,
              lt
            ]);
          }
        }
      }
      const $t = Math.round(t.bracesMode);
      if ($t > 0) {
        const o = $t === 1 || $t === 2 || $t === 3, s = $t === 1 || $t === 2 || $t === 4, e = h.length - 1;
        for (let l = 0; l < e; l++) {
          if (o) for (let a = 0; a < f.length; a++) {
            if ($t === 1 && a !== 0 && a !== f.length - 1) continue;
            const M = Math.floor((p.length - 1) / 2);
            for (let r = 0; r < p.length - 1; r++) {
              if ($t === 1 && r !== M || S(r, a) || S(r + 1, a)) continue;
              const d = T[`${r},${a},${l}`], v = T[`${r + 1},${a},${l + 1}`], i = T[`${r + 1},${a},${l}`], C = T[`${r},${a},${l + 1}`];
              d !== void 0 && v !== void 0 && z.push([
                d,
                v
              ]), i !== void 0 && C !== void 0 && z.push([
                i,
                C
              ]);
            }
          }
          if (s) for (let a = 0; a < p.length; a++) {
            if ($t === 1 && a !== 0 && a !== p.length - 1) continue;
            const M = Math.floor((f.length - 1) / 2);
            for (let r = 0; r < f.length - 1; r++) {
              if ($t === 1 && r !== M || S(a, r) || S(a, r + 1)) continue;
              const d = T[`${a},${r},${l}`], v = T[`${a},${r + 1},${l + 1}`], i = T[`${a},${r + 1},${l}`], C = T[`${a},${r},${l + 1}`];
              d !== void 0 && v !== void 0 && z.push([
                d,
                v
              ]), i !== void 0 && C !== void 0 && z.push([
                i,
                C
              ]);
            }
          }
        }
      }
      const Lt = /* @__PURE__ */ new Map(), yt = (o, s, e) => `${Math.round(o * 1e4)},${Math.round(s * 1e4)},${Math.round(e * 1e4)}`;
      for (let o = 0; o < u.length; o++) Lt.set(yt(u[o][0], u[o][1], u[o][2]), o);
      const Rt = t.slabDisc > 0 ? t.slabDisc : 0.5;
      if (t.slabOn >= 0.5) for (let o = 1; o < h.length; o++) {
        const s = h[o];
        for (let e = 0; e < p.length - 1; e++) for (let l = 0; l < f.length - 1; l++) {
          const a = p[e], M = p[e + 1], r = f[l], d = f[l + 1], { n: v } = Ao(Math.abs(M - a), Rt), { n: i } = Ao(Math.abs(d - r), Rt), C = [];
          for (let Y = 0; Y <= i; Y++) {
            const B = [];
            for (let lt = 0; lt <= v; lt++) {
              const R = a + lt / v * (M - a), _t = r + Y / i * (d - r), Mt = yt(R, _t, s), St = Lt.get(Mt);
              if (St !== void 0) B.push(St);
              else {
                const At = u.length;
                u.push([
                  R,
                  _t,
                  s
                ]), Lt.set(Mt, At), B.push(At), It(At);
              }
            }
            C.push(B);
          }
          for (let Y = 0; Y < i; Y++) for (let B = 0; B < v; B++) zt.add(z.length), z.push([
            C[Y][B],
            C[Y][B + 1],
            C[Y + 1][B + 1],
            C[Y + 1][B]
          ]);
        }
      }
      const uo = /* @__PURE__ */ new Set(), go = [], Jt = Math.round(t.murosMode ?? 0);
      if (Jt > 0) {
        const o = Jt === 1 || Jt === 3, s = Jt === 2 || Jt === 3, e = (v, i, C) => {
          const Y = yt(v, i, C), B = Lt.get(Y);
          if (B !== void 0) return B;
          const lt = u.length;
          return u.push([
            v,
            i,
            C
          ]), Lt.set(Y, lt), It(lt), lt;
        }, l = (v, i, C, Y, B, lt, R, _t) => {
          const Mt = [];
          for (let St = 0; St <= _t; St++) {
            const At = [];
            for (let vo = 0; vo <= R; vo++) At.push(e(v + vo / R * (C - v), i + vo / R * (Y - i), B + St / _t * (lt - B)));
            Mt.push(At);
          }
          for (let St = 0; St < _t; St++) for (let At = 0; At < R; At++) uo.add(z.length), z.push([
            Mt[St][At],
            Mt[St][At + 1],
            Mt[St + 1][At + 1],
            Mt[St + 1][At]
          ]);
          Math.abs(B) < 1e-9 && go.push(...Mt[0]);
        }, a = t.Lvix > 0 ? 1 : 0, M = t.Lviy > 0 ? 1 : 0, r = p.length - 1 - (t.Lvdx > 0 ? 1 : 0), d = f.length - 1 - (t.Lvdy > 0 ? 1 : 0);
        for (let v = 0; v < h.length - 1; v++) {
          const i = h[v], C = h[v + 1], Y = Ao(C - i, Rt).n, B = Math.ceil(Y / b) * b;
          if (o && r > a) {
            const lt = p[a], R = p[a + 1], _t = Ao(R - lt, Rt).n;
            for (const Mt of /* @__PURE__ */ new Set([
              M,
              d
            ])) l(lt, f[Mt], R, f[Mt], i, C, _t, B);
          }
          if (s && d > M) {
            const lt = f[M], R = f[M + 1], _t = Ao(R - lt, Rt).n;
            for (const Mt of /* @__PURE__ */ new Set([
              a,
              r
            ])) l(p[Mt], lt, p[Mt], R, i, C, _t, B);
          }
        }
      }
      const Oo = Math.round(t.apoyo), Fo = Oo === 0 ? [
        true,
        true,
        true,
        true,
        true,
        true
      ] : Oo === 1 ? [
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
      for (let o = 0; o < f.length; o++) for (let s = 0; s < p.length; s++) S(s, o) || wo.set(T[`${s},${o},0`], [
        ...Fo
      ]);
      for (const o of go) wo.set(o, [
        ...Fo
      ]);
      const Vt = Math.round(t.loadCase ?? 0), Oe = Vt === 1 ? [
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
      ], [Fe, Le, Ee, Pe] = Oe, Lo = /* @__PURE__ */ new Map(), oe = Fe * t.CM + Le * t.CV;
      if (oe !== 0) for (let o = 1; o < h.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < p.length; e++) {
        const l = `${e},${s},${o}`;
        T[l] !== void 0 && Lo.set(T[l], [
          0,
          0,
          oe,
          0,
          0,
          0
        ]);
      }
      const ee = Ee * t.Ex, se = Pe * t.Ey;
      if (ee !== 0 || se !== 0) {
        const o = T[`${p.length - 1 - (t.Lvdx > 0 ? 1 : 0)},${t.Lviy > 0 ? 1 : 0},${O}`];
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
            s[0] + ee,
            s[1] + se,
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
      ].map((o) => o > 0 ? o : t.colSize), Ie = [
        t.vigaB_1,
        t.vigaB_2,
        t.vigaB_3,
        t.vigaB_4,
        t.vigaB_5,
        t.vigaB_6,
        t.vigaB_7,
        t.vigaB_8
      ].map((o) => o > 0 ? o : t.vigaB), Ve = [
        t.vigaH_1,
        t.vigaH_2,
        t.vigaH_3,
        t.vigaH_4,
        t.vigaH_5,
        t.vigaH_6,
        t.vigaH_7,
        t.vigaH_8
      ].map((o) => o > 0 ? o : t.vigaH), Xo = Math.round(t.matCol) === 2, ne = (o) => {
        const s = Zo[o] ?? t.colSize, e = jo[o] ?? t.colSize;
        if (Xo) {
          const l = Math.min(t.tCft, Math.min(s, e) / 2 - 1e-3), a = es(s, e, l, K, J, N, j);
          return {
            A: a.A,
            Iz: a.Iz,
            Iy: a.Iy,
            J: a.J,
            As2: a.As2,
            As3: a.As3,
            b: s,
            h: e,
            t: l
          };
        }
        return {
          A: s * e,
          Iz: s * e ** 3 / 12,
          Iy: e * s ** 3 / 12,
          J: 0.14 * Math.pow(Math.min(s, e), 4),
          b: s,
          h: e
        };
      }, Ne = (o) => {
        const s = Ie[o] ?? t.vigaB, e = Ve[o] ?? t.vigaH;
        return {
          A: s * e,
          Iy: s * e ** 3 / 12,
          Iz: e * s ** 3 / 12,
          J: 0.21 * Math.pow(Math.min(s, e), 3) * Math.max(s, e)
        };
      }, Te = t.matCol < 0.5 ? N : K, Be = t.matCol < 0.5 ? at : ut, De = t.matCol < 0.5 ? j : J, Ye = t.matCol < 0.5 ? mo : Se, qe = t.matViga < 0.5 ? N : K, He = t.matViga < 0.5 ? at : ut, Re = t.matViga < 0.5 ? j : J, Ze = t.matViga < 0.5 ? mo : Se, Mo = /* @__PURE__ */ new Map(), po = /* @__PURE__ */ new Map(), Eo = /* @__PURE__ */ new Map(), Po = /* @__PURE__ */ new Map(), Io = /* @__PURE__ */ new Map(), Vo = /* @__PURE__ */ new Map(), xo = /* @__PURE__ */ new Map(), zo = /* @__PURE__ */ new Map(), Go = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), fe = Math.round(t.slabType), je = fe === 2 ? 0 : 1, Xe = fe === 1 ? 0 : 1, No = t.crackedSections > 0.5, he = t.matCol < 0.5 && No ? 0.7 : 1, me = t.matViga < 0.5 && No ? 0.35 : 1, Ge = No ? 0.25 : 1, Ke = 1, To = t.massSource > 0.5, Je = t.qDead + 0.25 * t.qLive, Ue = To ? Je / te / Math.max(t.slabT, 0.05) : mo, Ko = /* @__PURE__ */ new Map();
      for (const o of rt) for (const s of z[o]) Ko.set(s, $.get(o) ?? 0);
      const Qe = (o) => {
        if (Math.round(t.offsets ?? 1) !== 1) return 1;
        const [s, e] = z[o], l = Math.abs(u[e][0] - u[s][0]), a = Math.abs(u[e][1] - u[s][1]), M = Math.hypot(l, a, u[e][2] - u[s][2]), r = l >= a, d = (v) => {
          if (!Ko.has(v)) return 0;
          const i = ne(Math.min(Ko.get(v), 7));
          return (r ? i.b : i.h) / 2;
        };
        return M > 1e-9 ? Math.max(0, M - d(s) - d(e)) / M : 1;
      };
      for (let o = 0; o < z.length; o++) {
        const s = $.get(o) ?? 0;
        if (zt.has(o)) Mo.set(o, N), po.set(o, at), zo.set(o, j), Go.set(o, t.slabT), le.set(o, je * Ke), de.set(o, Xe * Ge), re.set(o, Math.round(t.slabForm ?? 1)), xo.set(o, Ue);
        else if (uo.has(o)) Mo.set(o, N), po.set(o, at), zo.set(o, j), Go.set(o, t.tMuro ?? 0.25), xo.set(o, To ? 0 : mo);
        else if (rt.has(o)) {
          const e = ne(Math.min(s, 7));
          Mo.set(o, Te), po.set(o, Be), zo.set(o, De), Eo.set(o, e.A), Po.set(o, e.Iz * he), Io.set(o, e.Iy * he), Vo.set(o, e.J), Xo && (ie.set(o, e.As2), ae.set(o, e.As3), ce.set(o, {
            type: "CFT",
            b: e.b,
            h: e.h,
            tw: e.t,
            tf: e.t,
            fillE: N,
            d: 0
          })), xo.set(o, To ? 0 : Ye);
        } else {
          const e = Ne(Math.min(s, 7));
          Mo.set(o, qe), po.set(o, He), zo.set(o, Re), Eo.set(o, e.A), Po.set(o, e.Iz * me), Io.set(o, e.Iy * me), Vo.set(o, e.J), xo.set(o, To ? 0 : Ze * Qe(o));
        }
      }
      if (t.diafragmaRigido >= 0.5) {
        const o = [];
        for (let a = 1; a < h.length; a++) o.push(h[a]);
        const s = hs(u, o), e = z.length;
        for (const a of s.masterNodes) u.push([
          a.x,
          a.y,
          a.z
        ]);
        for (const a of s.rigidLinks) z.push(a);
        ms(s, {
          elasticities: Mo,
          shearModuli: po,
          areas: Eo,
          momentsOfInertiaY: Po,
          momentsOfInertiaZ: Io,
          torsionalConstants: Vo,
          densities: xo
        }, e);
      }
      n.nodes.val = u, n.elements.val = z;
      const Bo = /* @__PURE__ */ new Map(), ue = Math.round(t.diafragmaNudos ?? 1);
      if (t.slabOn >= 0.5 && ue === 1) for (let o = 1; o < h.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < p.length; e++) {
        const l = T[`${e},${s},${o}`];
        l !== void 0 && Bo.set(l, o);
      }
      if (t.slabOn >= 0.5 && ue === 2) for (let o = 1; o < h.length; o++) {
        const s = h[o];
        u.forEach((e, l) => {
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
        membraneModifiers: le,
        bendingModifiers: de,
        plateFormulations: re,
        ...Xo ? {
          shearAreasY: ae,
          shearAreasZ: ie,
          sectionShapes: ce
        } : {}
      };
      const ge = we(u, z, n.nodeInputs.val, n.elementInputs.val);
      n.deformOutputs.val = ge, n.analyzeOutputs.val = ts(u, z, n.elementInputs.val, ge);
      const Jo = ss(p, f, h);
      try {
        const o = gs(u, z, n.analyzeOutputs.rawVal, n.elementInputs.rawVal, Math.round(t.matCol), Math.round(t.matViga), rt);
        let s = 1 / 0, e = 1 / 0, l = 1 / 0, a = -1 / 0, M = -1 / 0, r = -1 / 0;
        for (const i of u) i[0] < s && (s = i[0]), i[0] > a && (a = i[0]), i[1] < e && (e = i[1]), i[1] > M && (M = i[1]), i[2] < l && (l = i[2]), i[2] > r && (r = i[2]);
        const d = Math.sqrt((a - s) ** 2 + (M - e) ** 2 + (r - l) ** 2) || 1, v = Ms(o, u, d, {
          showElastic: false,
          radiusFactor: 0.015
        });
        Jo.push(...v), n.__plasticHinges = ps(o);
      } catch (o) {
        console.warn("[Plastic Hinges]", o);
      }
      if ((t.mostrarZapatas ?? 1) >= 0.5) try {
        const o = (_a = n.deformOutputs.rawVal) == null ? void 0 : _a.reactions;
        if (o) {
          const s = [];
          let e = 0, l = 0;
          if (o.forEach((a, M) => {
            const r = u[M];
            !r || Math.abs(r[2]) > 1e-6 || (s.push({
              idx: M,
              x: r[0],
              y: r[1],
              P_kN: Math.abs(a[2]),
              Mx_kN: a[3],
              My_kN: a[4]
            }), r[0] > e && (e = r[0]), r[1] > l && (l = r[1]));
          }), s.length > 0) {
            const a = t.q_adm_zapata ?? 10, M = t.ks_zapata ?? 1030, r = Math.max(0, t.Hf_pedestal ?? 0.5), d = Math.max(0.1, t.t_zapata ?? 0.3), v = Math.max(2, Math.round(t.nSubZapata ?? 4)), i = Math.max(0, t.voladoExtra ?? 0.3), C = Math.round(t.tipoZapataOverride ?? 0) | 0, Y = Math.round(t.estiloZapata ?? 1), B = Ro(s, e, l, a, M), lt = [
              "central",
              "lindero",
              "esquinera"
            ];
            for (const E of B) C > 0 && (E.tipo = lt[C - 1]), E.t = d;
            const R = [], _t = (E) => new Qo({
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
            }), At = new Qo({
              color: 10265519,
              transparent: true,
              opacity: 0.75,
              roughness: 0.5
            }), vo = new Kt({
              color: 1118481,
              linewidth: 2
            }), Me = Zo[0] ?? t.colSize, pe = jo[0] ?? t.colSize;
            for (const E of B) {
              const Z = E.Lz, st = E.Bz, Gt = E.t;
              let Zt = 0, jt = 0;
              E.tipo === "esquinera" ? (Zt = E.x < e / 2 ? -(Z / 2 - i) : Z / 2 - i, jt = E.y < l / 2 ? -(st / 2 - i) : st / 2 - i) : E.tipo === "lindero" && (Math.abs(E.x) < 1e-3 || Math.abs(E.x - e) < 1e-3 ? Zt = E.x < e / 2 ? -(Z / 2 - i) : Z / 2 - i : (Math.abs(E.y) < 1e-3 || Math.abs(E.y - l) < 1e-3) && (jt = E.y < l / 2 ? -(st / 2 - i) : st / 2 - i));
              const U = E.x - Zt, F = E.y - jt, V = -r, Nt = V - Gt / 2, qt = V - Gt, eo = E.ratio;
              let so = 4906624;
              if (eo > 1.5 ? so = 15680580 : eo > 1 ? so = 16096779 : eo > 0.8 && (so = 16498468), r > 1e-3) {
                const xt = new ho().setFromPoints([
                  new X(E.x, E.y, 0),
                  new X(E.x, E.y, -r)
                ]);
                R.push(new ze(xt, new Kt({
                  color: 6333946,
                  linewidth: 4
                }))), R.push(oo(`Df=${r.toFixed(2)}m`, E.x + 0.1, E.y + 0.1, -r / 2, "#60a5fa"));
              }
              if (Y === 0) {
                const xt = new is(Z, st, Gt), Ut = new Ho(xt, _t(so));
                Ut.position.set(U, F, Nt), R.push(Ut);
                const Qt = new Co(new cs(xt), Mt);
                Qt.position.copy(Ut.position), R.push(Qt);
              } else {
                const xt = new rs(Z, st), Ut = new Qo({
                  color: so,
                  transparent: true,
                  opacity: 0.45,
                  roughness: 0.6,
                  side: ls
                }), Qt = new Ho(xt, Ut);
                Qt.position.set(U, F, V), R.push(Qt);
                const no = new Ho(xt.clone(), Ut.clone());
                no.position.set(U, F, qt), R.push(no);
                const ve = Z / v, ye = st / v, Xt = [];
                for (let kt = 0; kt <= v; kt++) {
                  const bt = -Z / 2 + kt * ve;
                  Xt.push(new X(U + bt, F - st / 2, V), new X(U + bt, F + st / 2, V)), Xt.push(new X(U + bt, F - st / 2, qt), new X(U + bt, F + st / 2, qt));
                }
                for (let kt = 0; kt <= v; kt++) {
                  const bt = -st / 2 + kt * ye;
                  Xt.push(new X(U - Z / 2, F + bt, V), new X(U + Z / 2, F + bt, V)), Xt.push(new X(U - Z / 2, F + bt, qt), new X(U + Z / 2, F + bt, qt));
                }
                const So = new ho().setFromPoints(Xt);
                R.push(new Co(So, St));
                const yo = [
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
                  const [bt, c] = yo[kt], [k, x] = yo[(kt + 1) % 4];
                  ro.push(new X(U + bt, F + c, V), new X(U + k, F + x, V)), ro.push(new X(U + bt, F + c, qt), new X(U + k, F + x, qt)), ro.push(new X(U + bt, F + c, V), new X(U + bt, F + c, qt));
                }
                const _o = new ho().setFromPoints(ro);
                R.push(new Co(_o, Mt));
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
              U.length > 0 && (R.push(new Co(new ho().setFromPoints(U), new Kt({
                color: 2282478,
                linewidth: 3
              }))), R.push(oo(`Vigas amarre ${(st * 100).toFixed(0)}\xD7${(Gt * 100).toFixed(0)} cm @ ${E === 0 ? "zapatas" : "pedestales"}`, e / 2, l / 2, Z + 0.2, "#22d3ee")));
            }
            Jo.push(...R);
          }
        }
      } catch (o) {
        console.warn("[Zapatas 3D]", o);
      }
      if ((t.modoCimentacion ?? 0) >= 0.5) try {
        const s = (_b = n.deformOutputs.rawVal) == null ? void 0 : _b.reactions;
        if (s && s.size > 0) {
          const e = [];
          let l = 0, a = 0;
          if (s.forEach((M, r) => {
            const d = u[r];
            !d || Math.abs(d[2]) > 1e-6 || (e.push({
              idx: r,
              x: d[0],
              y: d[1],
              P_kN: Math.abs(M[2]),
              Mx_kN: M[3],
              My_kN: M[4]
            }), d[0] > l && (l = d[0]), d[1] > a && (a = d[1]));
          }), e.length > 0) {
            const M = t.q_adm_zapata ?? 10, r = t.ks_zapata ?? 1030, d = Math.max(0, t.Hf_pedestal ?? 0.5), v = Math.max(0.1, t.t_zapata ?? 0.3), i = Math.max(2, Math.round(t.nSubZapata ?? 4)), C = Math.max(0, t.voladoExtra ?? 0.3), Y = Math.round(t.tipoZapataOverride ?? 0) | 0, B = Ro(e, l, a, M, r), lt = [
              "central",
              "lindero",
              "esquinera"
            ];
            for (const c of B) Y > 0 && (c.tipo = lt[Y - 1]), c.t = v;
            const R = Zo[0] ?? t.colSize, _t = jo[0] ?? t.colSize, Mt = R * _t, St = R * _t ** 3 / 12, At = _t * R ** 3 / 12, vo = 0.14 * Math.pow(Math.min(R, _t), 4), Me = t.matCol < 0.5 ? N : K, pe = t.matCol < 0.5 ? at : ut, xe = t.matCol < 0.5 ? j : J, E = [], Z = [], st = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Map(), eo = /* @__PURE__ */ new Map(), so = /* @__PURE__ */ new Map(), $o = [], xt = [], Ut = (c, k, x) => `${Math.round(c * 1e4)},${Math.round(k * 1e4)},${Math.round(x * 1e4)}`, Qt = /* @__PURE__ */ new Map(), no = (c, k, x) => {
              const L = Ut(c, k, x), q = Qt.get(L);
              if (q !== void 0) return q;
              const nt = E.length;
              return E.push([
                c,
                k,
                x
              ]), Qt.set(L, nt), nt;
            }, ve = new Kt({
              color: 0,
              linewidth: 2
            }), ye = new Kt({
              color: 1118481,
              linewidth: 2
            });
            for (const c of B) {
              const k = c.Lz, x = c.Bz, L = c.t;
              let q = 0, nt = 0;
              c.tipo === "esquinera" ? (q = c.x < l / 2 ? -(k / 2 - C) : k / 2 - C, nt = c.y < a / 2 ? -(x / 2 - C) : x / 2 - C) : c.tipo === "lindero" && (Math.abs(c.x) < 1e-3 || Math.abs(c.x - l) < 1e-3 ? q = c.x < l / 2 ? -(k / 2 - C) : k / 2 - C : (Math.abs(c.y) < 1e-3 || Math.abs(c.y - a) < 1e-3) && (nt = c.y < a / 2 ? -(x / 2 - C) : x / 2 - C));
              const Tt = c.x - q, Et = c.y - nt, Wt = -d, Bt = k / i, to = x / i, dt = [];
              for (let H = 0; H <= i; H++) {
                const ot = [];
                for (let ht = 0; ht <= i; ht++) {
                  const Yt = Tt - k / 2 + ht * Bt, Ct = Et - x / 2 + H * to;
                  ot.push(no(Yt, Ct, Wt));
                }
                dt.push(ot);
              }
              for (let H = 0; H < i; H++) for (let ot = 0; ot < i; ot++) {
                const ht = Z.length;
                Z.push([
                  dt[H][ot],
                  dt[H][ot + 1],
                  dt[H + 1][ot + 1],
                  dt[H + 1][ot]
                ]), qt.set(ht, L), st.set(ht, N), Nt.set(ht, j), Gt.set(ht, at), V.set(ht, mo);
              }
              const ao = 0.5;
              for (let H = 0; H <= i; H++) for (let ot = 0; ot <= i; ot++) {
                const ht = Bt * to * (ot === 0 || ot === i ? 0.5 : 1) * (H === 0 || H === i ? 0.5 : 1), Yt = r * ht, Ct = Yt * ao, A = dt[H][ot];
                $o.push({
                  node: A,
                  dof: 0,
                  k: Ct
                }), $o.push({
                  node: A,
                  dof: 1,
                  k: Ct
                }), $o.push({
                  node: A,
                  dof: 2,
                  k: Yt
                }), $o.push({
                  node: A,
                  dof: 5,
                  k: Yt * 0.1
                });
              }
              const Dt = dt[0][0];
              eo.set(Dt, [
                false,
                false,
                false,
                true,
                true,
                true
              ]);
              let w = 0, P = 0, _ = 1 / 0;
              for (let H = 0; H <= i; H++) for (let ot = 0; ot <= i; ot++) {
                const ht = dt[H][ot], Yt = E[ht][0], Ct = E[ht][1], A = Math.sqrt((Yt - c.x) ** 2 + (Ct - c.y) ** 2);
                A < _ && (_ = A, w = H, P = ot);
              }
              const Ht = dt[w][P], Ot = e.find((H) => H.idx === c.idx);
              so.set(Ht, [
                0,
                0,
                -Ot.P_kN,
                Ot.Mx_kN,
                Ot.My_kN,
                0
              ]);
              const io = c.ratio;
              let bo = 4906624;
              if (io > 1.5 ? bo = 15680580 : io > 1 ? bo = 16096779 : io > 0.8 && (bo = 16498468), d > 1e-3) {
                const H = new ho().setFromPoints([
                  new X(c.x, c.y, 0),
                  new X(c.x, c.y, -d)
                ]);
                xt.push(new ze(H, new Kt({
                  color: 6333946,
                  linewidth: 4
                }))), xt.push(oo(`Df=${d.toFixed(2)}m`, c.x + 0.1, c.y + 0.1, -d / 2, "#60a5fa"));
              }
              {
                const H = new Kt({
                  color: 11184810,
                  linewidth: 1,
                  transparent: true,
                  opacity: 0.6
                }), ot = k / i, ht = x / i, Yt = [];
                for (let Ct = 0; Ct <= i; Ct++) {
                  const A = -k / 2 + Ct * ot;
                  Yt.push(new X(Tt + A, Et - x / 2, -d), new X(Tt + A, Et + x / 2, -d));
                }
                for (let Ct = 0; Ct <= i; Ct++) {
                  const A = -x / 2 + Ct * ht;
                  Yt.push(new X(Tt - k / 2, Et + A, -d), new X(Tt + k / 2, Et + A, -d));
                }
                xt.push(new Co(new ho().setFromPoints(Yt), H));
              }
              if ((t.mostrarLabelsZapatas ?? 1) >= 0.5) {
                const H = Ot.P_kN / 9.80665, ot = Ot.Mx_kN / 9.80665, ht = Ot.My_kN / 9.80665;
                xt.push(oo(`P=${H.toFixed(2)} tonf`, c.x, c.y, 0.3, "#fbbf24")), xt.push(oo(`Mx=${ot.toFixed(2)}  My=${ht.toFixed(2)} tonf\xB7m`, c.x, c.y, 0.1, "#fbbf24")), xt.push(oo(`${c.tipo[0].toUpperCase()} ${k.toFixed(2)}\xD7${x.toFixed(2)}\xD7${L.toFixed(2)}m \u03C3/q=${io.toFixed(2)}`, Tt, Et, -d - L - 0.2, io <= 1 ? "#4ade80" : io <= 1.5 ? "#f59e0b" : "#ef4444"));
              }
            }
            const Xt = Math.round(t.sistemaCimentacion ?? 0);
            if (Xt === 1) {
              const c = Math.round(t.vigaAmarre_pos ?? 0), k = t.vigaAmarre_h ?? 0.4, x = t.vigaAmarre_b ?? 0.25, L = x * k, q = x * k ** 3 / 12, nt = k * x ** 3 / 12, Tt = 0.21 * Math.pow(Math.min(x, k), 3) * Math.max(x, k), Et = /* @__PURE__ */ new Map();
              for (const w of B) {
                let P;
                c === 0 ? P = -d : P = -d / 2;
                const _ = no(w.x, w.y, P);
                if (Et.set(w.idx, _), c === 1 && d > 1e-3) {
                  const ft = no(w.x, w.y, -d / 2), Ht = no(w.x, w.y, 0), Ot = no(w.x, w.y, -d);
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
                ]), st.set(_, Me), Gt.set(_, pe), Nt.set(_, xe), Zt.set(_, L), jt.set(_, nt), U.set(_, q), F.set(_, Tt), V.set(_, mo);
              };
              let dt = 0;
              for (const w of Wt.values()) {
                w.sort((P, _) => P.x - _.x);
                for (let P = 0; P < w.length - 1; P++) {
                  const _ = Et.get(w[P].idx), ft = Et.get(w[P + 1].idx);
                  _ !== void 0 && ft !== void 0 && (to(_, ft), dt++);
                }
              }
              for (const w of Bt.values()) {
                w.sort((P, _) => P.y - _.y);
                for (let P = 0; P < w.length - 1; P++) {
                  const _ = Et.get(w[P].idx), ft = Et.get(w[P + 1].idx);
                  _ !== void 0 && ft !== void 0 && (to(_, ft), dt++);
                }
              }
              const ao = new Kt({
                color: 2282478,
                linewidth: 3
              }), Dt = [];
              for (const w of Wt.values()) {
                const P = [
                  ...w
                ].sort((_, ft) => _.x - ft.x);
                for (let _ = 0; _ < P.length - 1; _++) {
                  const ft = P[_], Ht = P[_ + 1], Ot = c === 0 ? -d : -d / 2;
                  Dt.push(new X(ft.x, ft.y, Ot)), Dt.push(new X(Ht.x, Ht.y, Ot));
                }
              }
              for (const w of Bt.values()) {
                const P = [
                  ...w
                ].sort((_, ft) => _.y - ft.y);
                for (let _ = 0; _ < P.length - 1; _++) {
                  const ft = P[_], Ht = P[_ + 1], Ot = c === 0 ? -d : -d / 2;
                  Dt.push(new X(ft.x, ft.y, Ot)), Dt.push(new X(Ht.x, Ht.y, Ot));
                }
              }
              if (Dt.length > 0) {
                const w = new ho().setFromPoints(Dt);
                xt.push(new Co(w, ao));
              }
              xt.push(oo(`+${dt} vigas de amarre ${(x * 100).toFixed(0)}\xD7${(k * 100).toFixed(0)} cm @ ${c === 0 ? "zapatas" : "pedestales"}`, l / 2, a / 2, c === 1 ? -d / 2 + 0.3 : -d + 0.3, "#22d3ee")), console.log(`[Cimentaci\xF3n] Sistema 1 \u2014 ${dt} vigas de amarre ${(x * 100).toFixed(0)}\xD7${(k * 100).toFixed(0)} cm en posici\xF3n ${c === 0 ? "zapatas" : "pedestales"}`);
            } else Xt >= 2 && (console.warn(`[Cimentaci\xF3n] Sistema ${Xt} (${[
              "",
              "",
              "Vigas T invertida",
              "Vigas rect. + zapata corrida",
              "Losa de cimentaci\xF3n"
            ][Xt]}) a\xFAn no implementado completamente. Mostrando zapatas aisladas. Pr\xF3ximamente: malla shell continua + frames T-invertida.`), xt.push(oo(`Sistema ${Xt} (TODO) \u2014 usando zapatas aisladas`, l / 2, a / 2, 1.5, "#fbbf24")));
            const So = Math.round(t.sistemaCimentacion ?? 0), yo = 0.3, ro = Math.round(t.vigaAmarre_pos ?? 0), _o = /* @__PURE__ */ new Map();
            if (So === 1) {
              const c = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map();
              for (const L of e) {
                const q = L.y.toFixed(4), nt = L.x.toFixed(4);
                c.has(q) || c.set(q, []), k.has(nt) || k.set(nt, []), c.get(q).push(L), k.get(nt).push(L);
              }
              const x = (L) => _o.set(L, (_o.get(L) ?? 0) + 1);
              for (const L of c.values()) {
                L.sort((q, nt) => q.x - nt.x);
                for (let q = 0; q < L.length - 1; q++) x(L[q].idx), x(L[q + 1].idx);
              }
              for (const L of k.values()) {
                L.sort((q, nt) => q.y - nt.y);
                for (let q = 0; q < L.length - 1; q++) x(L[q].idx), x(L[q + 1].idx);
              }
              console.log(`[Cimentaci\xF3n] Vigas de amarre activas \u2014 momentos en zapatas reducidos por factor (1 - ${yo} \xB7 n_vigas/4):`), _o.forEach((L, q) => {
                const nt = (yo * L / 4 * 100).toFixed(0);
                console.log(`   Zapata ${q}: ${L} vigas conectadas \u2192 momento reducido ${nt}%`);
              }), ro === 0 && console.log("   \u21B3 vigaAmarre_pos=0 (mismo nivel zapata) \u2192 en F2K se exportar\xE1 como cimentaci\xF3n corrida con ks\xB7b\xB7dL distribuido por nodo");
            }
            const kt = /* @__PURE__ */ new Map(), bt = /* @__PURE__ */ new Map();
            for (const c of B) {
              const k = e.find((A) => A.idx === c.idx), x = c.Lz, L = c.Bz, q = c.t;
              let nt = 0, Tt = 0;
              c.tipo === "esquinera" ? (nt = c.x < l / 2 ? -(x / 2 - C) : x / 2 - C, Tt = c.y < a / 2 ? -(L / 2 - C) : L / 2 - C) : c.tipo === "lindero" && (Math.abs(c.x) < 1e-3 || Math.abs(c.x - l) < 1e-3 ? nt = c.x < l / 2 ? -(x / 2 - C) : x / 2 - C : (Math.abs(c.y) < 1e-3 || Math.abs(c.y - a) < 1e-3) && (Tt = c.y < a / 2 ? -(L / 2 - C) : L / 2 - C));
              const Et = c.x - nt, Wt = c.y - Tt, Bt = [], to = [], dt = {
                elasticities: /* @__PURE__ */ new Map(),
                shearModuli: /* @__PURE__ */ new Map(),
                poissonsRatios: /* @__PURE__ */ new Map(),
                thicknesses: /* @__PURE__ */ new Map(),
                densities: /* @__PURE__ */ new Map()
              }, ao = x / i, Dt = L / i, w = [], P = [];
              for (let A = 0; A <= i; A++) {
                const et = [];
                for (let mt = 0; mt <= i; mt++) {
                  const Pt = -x / 2 + mt * ao, Ft = -L / 2 + A * Dt;
                  et.push(Bt.length), Bt.push([
                    Pt,
                    Ft,
                    0
                  ]);
                  const Do = Et + Pt, Yo = Wt + Ft, qo = Ut(Do, Yo, -d), lo = Qt.get(qo);
                  lo !== void 0 ? P.push(lo) : P.push(-1);
                }
                w.push(et);
              }
              for (let A = 0; A < i; A++) for (let et = 0; et < i; et++) {
                const mt = to.length;
                to.push([
                  w[A][et],
                  w[A][et + 1],
                  w[A + 1][et + 1],
                  w[A + 1][et]
                ]), dt.thicknesses.set(mt, q), dt.elasticities.set(mt, N), dt.poissonsRatios.set(mt, j), dt.shearModuli.set(mt, at), dt.densities.set(mt, mo);
              }
              const _ = [], ft = 0.5;
              for (let A = 0; A <= i; A++) for (let et = 0; et <= i; et++) {
                const mt = ao * Dt * (et === 0 || et === i ? 0.5 : 1) * (A === 0 || A === i ? 0.5 : 1), Pt = r * mt, Ft = w[A][et];
                _.push({
                  node: Ft,
                  dof: 0,
                  k: Pt * ft
                }), _.push({
                  node: Ft,
                  dof: 1,
                  k: Pt * ft
                }), _.push({
                  node: Ft,
                  dof: 2,
                  k: Pt
                });
              }
              if (So === 1 && ro === 0) {
                const A = t.vigaAmarre_b ?? 0.25, et = c.idx, mt = e.filter((pt) => Math.abs(pt.y - c.y) < 1e-3 && pt.idx !== et).sort((pt, ko) => pt.x - ko.x), Pt = e.filter((pt) => Math.abs(pt.x - c.x) < 1e-3 && pt.idx !== et).sort((pt, ko) => pt.y - ko.y), Ft = mt.find((pt) => pt.x > c.x), Do = [
                  ...mt
                ].reverse().find((pt) => pt.x < c.x), Yo = Pt.find((pt) => pt.y > c.y), qo = [
                  ...Pt
                ].reverse().find((pt) => pt.y < c.y), lo = (pt, ko) => {
                  const _e = ko / 2;
                  for (let co = 0; co <= i; co++) {
                    const We = co === 0 || co === i ? _e / (2 * i) : _e / i, be = r * A * We, Ce = be * ft;
                    let fo;
                    switch (pt) {
                      case "x+":
                        fo = w[co][i];
                        break;
                      case "x-":
                        fo = w[co][0];
                        break;
                      case "y+":
                        fo = w[i][co];
                        break;
                      case "y-":
                        fo = w[0][co];
                        break;
                    }
                    _.push({
                      node: fo,
                      dof: 0,
                      k: Ce
                    }), _.push({
                      node: fo,
                      dof: 1,
                      k: Ce
                    }), _.push({
                      node: fo,
                      dof: 2,
                      k: be
                    });
                  }
                };
                Ft && lo("x+", Ft.x - c.x), Do && lo("x-", c.x - Do.x), Yo && lo("y+", Yo.y - c.y), qo && lo("y-", c.y - qo.y);
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
              const Ot = -nt, io = -Tt;
              let bo = 0, Uo = 0, H = 1 / 0;
              for (let A = 0; A <= i; A++) for (let et = 0; et <= i; et++) {
                const mt = -x / 2 + et * ao, Pt = -L / 2 + A * Dt, Ft = (mt - Ot) ** 2 + (Pt - io) ** 2;
                Ft < H && (H = Ft, bo = A, Uo = et);
              }
              const ot = w[bo][Uo], ht = /* @__PURE__ */ new Map(), Yt = _o.get(c.idx) ?? 0, Ct = So === 1 ? Math.max(0.4, 1 - yo * Yt / 4) : 1;
              ht.set(ot, [
                0,
                0,
                -k.P_kN,
                k.Mx_kN * Ct,
                k.My_kN * Ct,
                0
              ]);
              try {
                const et = we(Bt, to, {
                  supports: /* @__PURE__ */ new Map(),
                  loads: ht
                }, dt, _).deformations;
                for (let mt = 0; mt < Bt.length; mt++) {
                  const Pt = P[mt];
                  if (Pt >= 0) {
                    const Ft = et.get(mt);
                    Ft && kt.set(Pt, [
                      ...Ft
                    ]);
                  }
                }
              } catch (A) {
                console.warn(`[Zapata ${c.idx}] solver fall\xF3:`, A);
              }
            }
            for (let c = 0; c < Z.length; c++) {
              const k = Z[c];
              if (k.length !== 4) continue;
              const x = [];
              for (const L of k) {
                const q = kt.get(L);
                x.push(r * (q ? q[2] : 0) / 9.80665);
              }
              bt.set(c, x);
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
                  -M,
                  0
                ]
              }
            }, n.objects3D.val = xt, console.log(`[Modo Cimentaci\xF3n] ${e.length} zapatas + pedestales (Hf=${d} m, t=${v} m, q_adm=${M} tonf/m\xB2, ks=${r} kN/m\xB3) \u2014 reemplaza superestructura`);
            try {
              const c = () => {
                var _a2;
                const x = (_a2 = document.querySelector("#viewer")) == null ? void 0 : _a2.__settings;
                x && (x.shellResults && (x.shellResults.val = "pressure"), x.deformedShape && (x.deformedShape.val = false), x.deformScale && (x.deformScale.val = 5), x.frameResults && (x.frameResults.val = "none"), x.custom3D && (x.custom3D.val = true));
              };
              [
                0,
                100,
                300
              ].forEach((k) => setTimeout(c, k));
            } catch {
            }
            return;
          }
        }
      } catch (o) {
        console.warn("[Modo Cimentaci\xF3n] error:", o);
      }
      n.objects3D.val = Jo;
    },
    runModal(t, n, D) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      const y = n.nodes.val, O = n.elements.val, g = n.nodeInputs.val, b = n.elementInputs.val;
      if (!(!y.length || !O.length || !((_a = g.supports) == null ? void 0 : _a.size) || !((_b = b.densities) == null ? void 0 : _b.size))) try {
        const I = [], N = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), gt = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map();
        let it = 0, p = 0;
        const f = [];
        let h = 0;
        for (let $ = 0; $ < O.length; $++) {
          const tt = O[$];
          let It = false, $t = false;
          if (tt.length === 4) {
            const Lt = tt.map((Rt) => y[Rt][2]);
            if (Math.max(...Lt) - Math.min(...Lt) < 0.02) {
              const Rt = y[tt[0]][0], uo = y[tt[0]][1], go = y[tt[2]][0], Jt = y[tt[2]][1], Oo = Math.abs((go - Rt) * (Jt - uo)), Fo = ((_c = b.thicknesses) == null ? void 0 : _c.get($)) ?? 0.15, wo = ((_d = b.densities) == null ? void 0 : _d.get($)) ?? 24;
              it += wo * Oo * Fo, It = true;
            }
          } else if (tt.length === 2) {
            const Lt = y[tt[0]][2], yt = y[tt[1]][2], Rt = Math.sqrt((y[tt[1]][0] - y[tt[0]][0]) ** 2 + (y[tt[1]][1] - y[tt[0]][1]) ** 2);
            if (Math.abs(yt - Lt) > Rt) {
              $t = true;
              const uo = Math.abs(yt - Lt), go = ((_e = b.areas) == null ? void 0 : _e.get($)) ?? 0, Jt = ((_f = b.densities) == null ? void 0 : _f.get($)) ?? 24;
              p += Jt * go * uo;
            }
          }
          It || (I.push(tt), ((_g = b.areas) == null ? void 0 : _g.has($)) && N.set(h, b.areas.get($)), ((_h = b.momentsOfInertiaY) == null ? void 0 : _h.has($)) && K.set(h, b.momentsOfInertiaY.get($)), ((_i = b.momentsOfInertiaZ) == null ? void 0 : _i.has($)) && j.set(h, b.momentsOfInertiaZ.get($)), ((_j = b.torsionalConstants) == null ? void 0 : _j.has($)) && J.set(h, b.torsionalConstants.get($)), ((_k = b.elasticities) == null ? void 0 : _k.has($)) && at.set(h, b.elasticities.get($)), ((_l = b.shearModuli) == null ? void 0 : _l.has($)) && ut.set(h, b.shearModuli.get($)), ((_m = b.densities) == null ? void 0 : _m.has($)) && Q.set(h, b.densities.get($)), ((_n = b.thicknesses) == null ? void 0 : _n.has($)) && gt.set(h, b.thicknesses.get($)), ((_o = b.poissonsRatios) == null ? void 0 : _o.has($)) && W.set(h, b.poissonsRatios.get($)), $t && f.push(h), h++);
        }
        if (it > 0 && p > 0 && f.length > 0) {
          const $ = 1 + it / p;
          for (const tt of f) {
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
        }, vt = Math.round(t.nPisos), S = Math.min(60, Math.max(15, 3 * vt + 6)), u = os(y, I, g, ct, S), T = Math.round(t.nVanosX), z = Math.round(t.nVanosY), rt = Math.round(t.nPisos), wt = p > 0 ? 1 + it / p : 1;
        D.render(u, {
          title: `Edificio ${T}\xD7${z} vanos \xD7 ${rt} pisos \xB7 ${S} modos`,
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
        const zt = u.frequencies[0] ?? 0;
        console.log(`[Edificio Modal] ${S} modos \xB7 f\u2081=${zt.toFixed(4)} Hz \xB7 m_slab=${it.toFixed(0)} m_cols=${p.toFixed(0)} factor=${wt.toFixed(2)}`);
      } catch (I) {
        console.warn("Modal edificio error:", I.message);
      }
    }
  };
});
export {
  __tla,
  ws as e,
  Cs as f
};
