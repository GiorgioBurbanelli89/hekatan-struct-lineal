import { a as Ue } from "./analyze-BFwM3Jvn.js";
import { m as Qe, d as ye, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { a as We } from "./cadSections-DVtTZU6U.js";
import { b as ts, a as oo } from "./cotas3D-CP6xTezf.js";
import { S as os, f as es, M as qo, e as Uo, a as Kt, B as ho, V as X, d as be, b as ss, L as Co, E as ns, I as as, D as is } from "./theme-U-6D_qyI.js";
let ys, _s;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function Oo(t, n = 0.5) {
    const D = cs(n), p = t / D;
    let F = Math.max(2, Math.round(p));
    return t / F > D * 1.25 && (F = Math.ceil(p)), {
      n: F,
      dx: t / F
    };
  }
  function cs(t) {
    return typeof t == "number" ? t : t === "fine" ? 0.25 : 0.5;
  }
  const rs = {
    "Grueso (50 cm)": 0.5,
    "Medio (30 cm)": 0.3,
    "Fino (25 cm)": 0.25,
    "Muy fino (15 cm)": 0.15
  };
  function ls(t, n, D = {}) {
    const p = D.tol ?? 1e-5, F = 0, u = [], y = [], I = {
      areas: /* @__PURE__ */ new Map(),
      momentsOfInertiaY: /* @__PURE__ */ new Map(),
      momentsOfInertiaZ: /* @__PURE__ */ new Map(),
      torsionalConstants: /* @__PURE__ */ new Map(),
      elasticities: /* @__PURE__ */ new Map(),
      shearModuli: /* @__PURE__ */ new Map(),
      densities: /* @__PURE__ */ new Map()
    }, N = 1e8, G = 1e4, j = 1e4, K = 2 * j, at = N / (2 * (1 + 0.3));
    for (const ut of n) {
      const Q = [];
      let gt = 0, W = 0;
      for (let h = 0; h < t.length; h++) Math.abs(t[h][2] - ut) < p && (Q.push(h), gt += t[h][0], W += t[h][1]);
      if (Q.length < 2) continue;
      const it = gt / Q.length, g = W / Q.length, d = t.length + u.length;
      u.push({
        idx: d,
        z: ut,
        x: it,
        y: g
      });
      for (const h of Q) {
        const ct = t[h][0] - it, vt = t[h][1] - g;
        if (Math.hypot(ct, vt) < p) {
          console.info(`[diafragma] z = ${ut}: el nudo ${h} cae sobre el master (${it.toFixed(3)}, ${g.toFixed(3)}): sin link, un elemento de longitud cero no ata nada.`);
          continue;
        }
        y.push([
          d,
          h
        ]);
        const S = F + y.length - 1;
        I.areas.set(S, G), I.momentsOfInertiaY.set(S, j), I.momentsOfInertiaZ.set(S, j), I.torsionalConstants.set(S, K), I.elasticities.set(S, N), I.shearModuli.set(S, at), I.densities.set(S, 0);
      }
    }
    return D.linkStiffness, {
      masterNodes: u,
      rigidLinks: y,
      linkProps: I
    };
  }
  function ds(t, n, D) {
    const p = (F, u) => {
      F.forEach((y, I) => u.set(I + D, y));
    };
    n.areas = n.areas ?? /* @__PURE__ */ new Map(), n.momentsOfInertiaY = n.momentsOfInertiaY ?? /* @__PURE__ */ new Map(), n.momentsOfInertiaZ = n.momentsOfInertiaZ ?? /* @__PURE__ */ new Map(), n.torsionalConstants = n.torsionalConstants ?? /* @__PURE__ */ new Map(), n.elasticities = n.elasticities ?? /* @__PURE__ */ new Map(), n.shearModuli = n.shearModuli ?? /* @__PURE__ */ new Map(), n.densities = n.densities ?? /* @__PURE__ */ new Map(), p(t.linkProps.areas, n.areas), p(t.linkProps.momentsOfInertiaY, n.momentsOfInertiaY), p(t.linkProps.momentsOfInertiaZ, n.momentsOfInertiaZ), p(t.linkProps.torsionalConstants, n.torsionalConstants), p(t.linkProps.elasticities, n.elasticities), p(t.linkProps.shearModuli, n.shearModuli), p(t.linkProps.densities, n.densities);
  }
  function Ce(t) {
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
  function fs(t, n, D) {
    if (t <= 0 || n <= 0) return 1e-12;
    const F = Math.sqrt(12 * n / t) / 2;
    return n / F * D;
  }
  function hs(t, n, D, p, F, u, y, I = {}) {
    var _a, _b;
    const N = I.Fy_steel ?? 345e3;
    I.fc_concrete;
    const G = I.Fy_rebar ?? 42e4, j = I.omega ?? 0.15, K = I.phi ?? 0.9, at = F < 0.5 ? K * j * G * (1 - 0.59 * j) : K * N, ut = u < 0.5 ? K * j * G * (1 - 0.59 * j) : K * N, Q = D.frameBendingMoments, gt = [];
    for (let W = 0; W < n.length; W++) {
      const it = n[W];
      if (it.length !== 2) continue;
      const [g, d] = it, h = y.has(W);
      let ct = 0, vt = 0;
      const S = Q == null ? void 0 : Q.get(W);
      S && (ct = S.Mi, vt = S.Mj);
      const _ = ((_a = p.areas) == null ? void 0 : _a.get(W)) ?? 0.16, T = ((_b = p.momentsOfInertiaZ) == null ? void 0 : _b.get(W)) ?? 213e-5, mt = fs(_, T, h ? at : ut), wt = ct / mt, zt = vt / mt;
      gt.push({
        nodeIdx: g,
        elementIdx: W,
        end: "i",
        classification: Ce(wt)
      }), gt.push({
        nodeIdx: d,
        elementIdx: W,
        end: "j",
        classification: Ce(zt)
      });
    }
    return gt;
  }
  function ms(t, n, D, p = {}) {
    const F = p.showElastic ?? false, u = (p.radiusFactor ?? 0.02) * D, y = [], I = new os(u, 12, 8);
    for (const N of t) {
      if (!F && N.classification.state === "Elastic") continue;
      const G = n[N.nodeIdx];
      if (!G) continue;
      const j = new es({
        color: N.classification.color,
        transparent: true,
        opacity: 0.85
      }), K = new qo(I, j);
      K.position.set(G[0], G[1], G[2]), K.userData = {
        hingeState: N.classification.state,
        ratio: N.classification.ratio.toFixed(3),
        element: N.elementIdx,
        end: N.end
      }, y.push(K);
    }
    return y;
  }
  function us(t) {
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
  function ze(t, n, D, p, F = 0.01) {
    const u = Math.abs(t) < F, y = Math.abs(t - D) < F, I = Math.abs(n) < F, N = Math.abs(n - p) < F, G = [
      u,
      y,
      I,
      N
    ].filter(Boolean).length;
    return G >= 2 ? "esquinera" : G === 1 ? "lindero" : "central";
  }
  function $e(t) {
    const { P_kN: n, Mx_kN: D, My_kN: p, tipo: F, q_adm_tonf: u, ks: y } = t, I = t.Lz_min ?? 1, N = t.Lz_max ?? 4, G = t.t_min ?? 0.3;
    if (n <= 0) return {
      tipo: F,
      Lz: I,
      Bz: I,
      t: G,
      A: I ** 2,
      ex: 0,
      ey: 0,
      sigmaMax_tonf: 0,
      sigmaMin_tonf: 0,
      ratio: 0,
      fueraKern: false,
      status: "UPLIFT"
    };
    const j = u * Qo, K = Math.abs(p / n), at = Math.abs(D / n), ut = j * 0.95;
    let Q = Math.max(I, Math.sqrt(n / j)), gt = Q, W = 1 / 0, it = 0, g = false;
    for (let _ = 0; _ < 50 && Q <= N; _++) {
      const T = F === "esquinera" ? 0.3 : F === "lindero" ? 0.2 : 0, z = Q + T, mt = gt + T, wt = z * mt, zt = Math.max(K, at), $ = zt === K ? z : mt;
      if (g = zt > $ / 6, !g) W = n / wt * (1 + 6 * zt / $), it = n / wt * (1 - 6 * zt / $);
      else {
        const tt = 1.5 * $ - 3 * zt, It = zt === K ? mt : z;
        W = 2 * n / (It * Math.max(tt, 0.01)), it = 0;
      }
      if (W <= ut) break;
      Q += 0.05, gt += 0.05;
    }
    const d = Q * gt, h = Math.max(G, Q / 6), ct = W / j, vt = ct <= 1 ? "OK" : "OVERSTRESS";
    let S;
    return y && y > 0 && (S = W / y * 1e3), {
      tipo: F,
      Lz: Q,
      Bz: gt,
      t: h,
      A: d,
      ex: K,
      ey: at,
      sigmaMax_tonf: W / Qo,
      sigmaMin_tonf: it / Qo,
      ratio: ct,
      delta_mm: S,
      fueraKern: g,
      status: vt
    };
  }
  function Ho(t, n, D, p, F) {
    return t.map((u) => {
      const y = ze(u.x, u.y, n, D);
      return {
        ...$e({
          P_kN: u.P_kN,
          Mx_kN: u.Mx_kN,
          My_kN: u.My_kN,
          tipo: y,
          q_adm_tonf: p,
          ks: F
        }),
        idx: u.idx,
        x: u.x,
        y: u.y
      };
    });
  }
  let Wo, mo, we, m, U;
  _s = Object.freeze(Object.defineProperty({
    __proto__: null,
    classifyFootingType: ze,
    designAllFootings: Ho,
    designFooting: $e
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Wo = 9.81;
  mo = 24 / Wo;
  we = 78 / Wo;
  m = (t, n, D, p, F, u) => ({
    default: D,
    min: p,
    max: F,
    step: u,
    label: n,
    folder: t
  });
  U = (t, n, D, p) => ({
    default: D,
    label: n,
    folder: t,
    options: p
  });
  ys = {
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
      matCol: U("Secciones (global)", "Material columna", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1,
        "CFT (tubo relleno)": 2
      }),
      tCft: m("Secciones (global)", "t pared CFT (m)", 0.01, 4e-3, 0.03, 1e-3),
      matViga: U("Secciones (global)", "Material viga", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1
      }),
      colShape: U("Secciones (global)", "Forma columna", 0, {
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
        ...U("Vigas Secundarias", "Activar", 0, {
          No: 0,
          S\u00ED: 1
        }),
        regenOnChange: true
      },
      vigSecDir: U("Vigas Secundarias", "Corren en", 2, {
        "Auto (lado corto)": 2,
        "X (entre ejes Y)": 0,
        "Y (entre ejes X)": 1
      }),
      vigSecCantidad: m("Vigas Secundarias", "Cantidad/vano", 2, 1, 5, 1),
      vigSecB: m("Vigas Secundarias", "b sec (m)", 0.2, 0.1, 0.4, 0.05),
      vigSecH: m("Vigas Secundarias", "h sec (m)", 0.3, 0.2, 0.6, 0.05),
      losaActivar: {
        ...U("Losas de Piso", "Activar losas", 0, {
          No: 0,
          S\u00ED: 1
        }),
        regenOnChange: true
      },
      losaEspesor: m("Losas de Piso", "Espesor (m)", 0.15, 0.08, 0.4, 0.01),
      losaSubdivX: m("Losas de Piso", "Subdiv. X", 2, 1, 6, 1),
      losaSubdivY: m("Losas de Piso", "Subdiv. Y", 2, 1, 6, 1),
      muroActivar: {
        ...U("Muros de Corte", "Activar", 0, {
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
      apoyo: U("Apoyo", "Tipo", 0, {
        Empotrado: 0,
        "Articulado (3 DOFs)": 1,
        "R\xF3tula completa": 2
      }),
      comparar: U("Apoyo", "Comparar con", 1, {
        "ETABS (uni\xF3n viga-muro de ETABS)": 1,
        "SAP2000 (sin sem\xE1nticas)": 0
      }),
      CM: m("Cargas", "CM (kN/nodo)", -5, -30, 0, 0.5),
      CV: m("Cargas", "CV (kN/nodo)", -2, -20, 0, 0.5),
      Ex: m("Cargas", "Ex sismo tope (kN)", 50, 0, 500, 10),
      Ey: m("Cargas", "Ey sismo tope (kN)", 0, 0, 500, 10),
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
      modoCimentacion: U("Cimentaci\xF3n", "\u{1F518} Vista (toggle)", 0, {
        "\u{1F3E2} Edificio completo (ver/editar)": 0,
        "\u{1FAA8} Solo cimentaci\xF3n (P,Mx,My)": 1
      }),
      q_adm_zapata: m("Cimentaci\xF3n", "q_adm (tonf/m\xB2)", 10, 1, 100, 1),
      ks_zapata: m("Cimentaci\xF3n", "ks (kN/m\xB3)", 1030, 100, 2e5, 10),
      Hf_pedestal: m("Cimentaci\xF3n", "Df col enterrada (m) (m)", 0.5, 0, 3, 0.05),
      t_zapata: m("Cimentaci\xF3n", "t zapata (m)", 0.3, 0.1, 1.5, 0.05),
      nSubZapata: m("Cimentaci\xF3n", "Subdiv. Q4 zapata", 4, 2, 12, 1),
      voladoExtra: m("Cimentaci\xF3n", "Volado extra esq./lin (m)", 0.3, 0, 1, 0.05),
      tipoZapataOverride: U("Cimentaci\xF3n", "Tipo (override)", 0, {
        "Auto (por posici\xF3n)": 0,
        "Todas central": 1,
        "Todas lindero": 2,
        "Todas esquinera": 3
      }),
      mostrarZapatas: U("Cimentaci\xF3n", "Mostrar zapatas 3D", 0, {
        On: 1,
        Off: 0
      }),
      mostrarLabelsZapatas: U("Cimentaci\xF3n", "Mostrar etiquetas zapatas", 1, {
        On: 1,
        Off: 0
      }),
      estiloZapata: U("Cimentaci\xF3n", "Estilo render", 1, {
        "S\xF3lido (caja transl\xFAcida)": 0,
        "Shellthick (Q4 + grilla)": 1
      }),
      sistemaCimentacion: U("Cimentaci\xF3n", "Sistema cim.", 0, {
        "Zapatas aisladas": 0,
        "Zapatas + vigas de amarre": 1,
        "Vigas T invertida (corrida)": 2,
        "Vigas rect. + zapata corrida": 3,
        "Losa de cimentaci\xF3n (raft)": 4
      }),
      vigaAmarre_pos: U("Cimentaci\xF3n", "Viga amarre \u2014 posici\xF3n", 0, {
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
      vSecOn: U("Avanzado", "Vigas secundarias", 0, {
        Off: 0,
        On: 1
      }),
      nVSec: m("Avanzado", "N\xB0 vigas sec. por vano", 2, 1, 5, 1),
      vSecDir: U("Avanzado", "Dir secundarias", 2, {
        "Auto (lado corto)": 2,
        X: 0,
        Y: 1
      }),
      bracesMode: U("Avanzado", "Diagonales", 0, {
        ninguna: 0,
        perimetrales: 1,
        todas: 2,
        "solo X": 3,
        "solo Y": 4
      }),
      slabOn: U("Avanzado", "Losa", 0, {
        Off: 0,
        On: 1
      }),
      slabForm: U("Avanzado", "Formulaci\xF3n losa", 1, {
        "Thin (ETABS)": 1,
        Thick: 0
      }),
      slabT: m("Avanzado", "t losa (m)", 0.15, 0.08, 0.3, 0.01),
      murosMode: U("Avanzado", "Muros de corte (c\xE1scara)", 0, {
        ninguno: 0,
        "en X (fachadas Y)": 1,
        "en Y (fachadas X)": 2,
        "en X e Y": 3
      }),
      tMuro: m("Avanzado", "t muro (m)", 0.25, 0.15, 0.6, 0.05),
      slabType: U("Avanzado", "Tipo losa (ETABS)", 0, {
        "Shell (membrane+plate)": 0,
        "Membrane only": 1,
        "Plate only": 2
      }),
      slabDisc: U("Avanzado", "Discretizaci\xF3n losa", 0.5, rs),
      diafragmaRigido: U("Avanzado", "Diafragma r\xEDgido", 0, {
        Flexible: 0,
        "R\xEDgido (ASCE 7-22)": 1
      }),
      massSource: U("Avanzado", "Mass Source", 0, {
        "Self-weight (peso propio)": 0,
        "From Loads (DEAD+0.25\xB7LIVE) ETABS": 1
      }),
      qDead: m("Avanzado", "qDead losa (kN/m\xB2)", 3.5, 0.5, 10, 0.5),
      qLive: m("Avanzado", "qLive losa (kN/m\xB2)", 1.5, 0, 6, 0.5),
      crackedSections: U("Avanzado", "Cracked Sections (ACI 318)", 0, {
        "Off (secci\xF3n bruta Ig)": 0,
        "On: 0.7\xB7Ig col / 0.35\xB7Ig viga / 0.25\xB7Ig losa": 1
      })
    },
    dynamicParams(t) {
      const n = {}, D = Math.round(t.nPisos ?? 3), p = Math.round(t.nVanosX ?? 2), F = Math.round(t.nVanosY ?? 2);
      for (let u = 1; u <= D; u++) n[`hP_${u}`] = m("Alturas por piso", `h Piso ${u} (m)`, 0, 0, 6, 0.1), n[`colB_p${u}`] = m("Secciones por piso", `b col P${u} (m)`, 0, 0, 1, 0.05), n[`colH_p${u}`] = m("Secciones por piso", `h col P${u} (m)`, 0, 0, 1, 0.05), n[`vigaB_p${u}`] = m("Secciones por piso", `b viga P${u} (m)`, 0, 0, 0.8, 0.05), n[`vigaH_p${u}`] = m("Secciones por piso", `h viga P${u} (m)`, 0, 0, 1, 0.05);
      for (let u = 1; u <= p; u++) n[`svX_${u}`] = m("Luces por vano", `svX #${u} (m)`, 0, 0, 12, 0.5);
      for (let u = 1; u <= F; u++) n[`svY_${u}`] = m("Luces por vano", `svY #${u} (m)`, 0, 0, 12, 0.5);
      return n;
    },
    computedLabels(t, n) {
      var _a;
      const p = (_a = n.deformOutputs.rawVal) == null ? void 0 : _a.reactions, F = n.nodes.rawVal;
      if (!p || !(F == null ? void 0 : F.length)) return {
        "Reacciones (\u2192 zapatas)": "\u2014"
      };
      let u = 0, y = 0, I = 0, N = -1, G = 0, j = -1;
      const K = [];
      let at = 0, ut = 0;
      p.forEach((ct, vt) => {
        const S = F[vt];
        if (!S || Math.abs(S[2]) > 1e-6) return;
        const _ = ct[2], T = ct[3], z = ct[4];
        Math.abs(_) > Math.abs(u) && (u = _, N = vt, S[0], S[1]), _ > 0 && _ > Math.abs(G) && (G = _, j = vt), Math.abs(T) > Math.abs(y) && (y = T), Math.abs(z) > Math.abs(I) && (I = z), K.push({
          idx: vt,
          x: S[0],
          y: S[1],
          P_kN: Math.abs(_),
          Mx_kN: T,
          My_kN: z
        }), S[0] > at && (at = S[0]), S[1] > ut && (ut = S[1]);
      });
      const Q = Math.abs(u) / 9.80665, gt = Math.abs(y) / 9.80665, W = Math.abs(I) / 9.80665, it = G / 9.80665, g = Math.round(t.nPisos), d = {
        "\u2500\u2500 Reacciones m\xE1x (\u2192 zapatas) \u2500\u2500": "",
        "P (compresi\xF3n)": `${Q.toFixed(2)} tonf (nodo ${N})`,
        Mx: `${gt.toFixed(2)} tonf\xB7m`,
        My: `${W.toFixed(2)} tonf\xB7m`
      };
      if (it > 0.01 && (d["\u26A0 Uplift"] = `${it.toFixed(2)} tonf (nodo ${j})`), d.Pisos = `${g}`, d["Copiar a \u2192 zapata-aislada"] = `P=${Q.toFixed(1)}, Mx=${gt.toFixed(1)}, My=${W.toFixed(1)}`, K.length > 0 && at > 0 && ut > 0) {
        const ct = t.q_adm_zapata ?? 10, vt = t.ks_zapata ?? 1030;
        try {
          const S = Ho(K, at, ut, ct, vt);
          let _ = 0, T = 0, z = 0, mt = 0, wt = -1, zt = "", $ = 0, tt = 0;
          for (const _t of S) _t.tipo === "esquinera" ? _++ : _t.tipo === "lindero" ? T++ : z++, _t.sigmaMax_tonf > mt && (mt = _t.sigmaMax_tonf, wt = _t.idx, zt = _t.tipo), _t.status === "OK" && $++, _t.Lz > tt && (tt = _t.Lz);
          d["\u2500\u2500 Cimentaci\xF3n (auto) \u2500\u2500"] = "", d["Tipos zapata"] = `${_} esquineras, ${T} linderas, ${z} centrales`, d["\u03C3_max global"] = `${mt.toFixed(2)} tonf/m\xB2 (nodo ${wt}, ${zt})`, d["\u03C3/q_adm"] = `${(mt / ct).toFixed(2)}` + (mt / ct <= 1 ? " \u2713" : " \u26A0"), d["Lz m\xE1x zapata"] = `${tt.toFixed(2)} m`, d.Cumplen = `${$}/${S.length}` + ($ === S.length ? " \u2713" : " \u26A0");
          const It = t.Hf_pedestal ?? 0.5, $t = t.t_zapata ?? 0.3, At = Math.round(t.nSubZapata ?? 4);
          d["Df col enterrada"] = `${It.toFixed(2)} m` + (It < 1e-3 ? " (sin pedestal)" : ""), d["t zapata"] = `${$t.toFixed(2)} m`, d["Subdiv. Q4"] = `${At}\xD7${At}`, d["Volado extra"] = `${(t.voladoExtra ?? 0.3).toFixed(2)} m`;
        } catch {
          d["\u2500\u2500 Cimentaci\xF3n \u2500\u2500"] = "module load error";
        }
      }
      const h = n.__plasticHinges;
      if (h) {
        const ct = (h.B ?? 0) + (h.IO ?? 0) + (h.LS ?? 0) + (h.CP ?? 0);
        d["\u2500\u2500 R\xF3tulas pl\xE1sticas (ASCE 41-17) \u2500\u2500"] = "", d["\u{1F7E2} El\xE1stico"] = `${h.Elastic ?? 0}`, d["\u{1F7E1} B \u2014 Yield"] = `${h.B ?? 0}`, d["\u{1F7E0} IO \u2014 Immed.Occ."] = `${h.IO ?? 0}`, d["\u{1F534} LS \u2014 Life Safety"] = `${h.LS ?? 0}`, d["\u26AB CP \u2014 Collapse Prev."] = `${h.CP ?? 0}`, d["Total r\xF3tulas formadas"] = `${ct}`;
      }
      return d;
    },
    build(t, n) {
      var _a, _b;
      const D = Math.round(t.nVanosX), p = Math.round(t.nVanosY), F = Math.round(t.nPisos), u = Math.max(1, Math.round(t.nSubViga)), y = Math.max(1, Math.round(t.nSubCol)), I = t.fcConcr * 0.0981, N = 4700 * Math.sqrt(I) * 1e3, G = 2e8, j = 0.2, K = 0.3, at = N / (2 * (1 + j)), ut = G / (2 * (1 + K)), Q = (o, s, e) => Array.from({
        length: s
      }, (l, i) => {
        const x = t[`${o}${i + 1}`];
        return typeof x == "number" && x > 0 ? x : e;
      }), gt = Q("svX_", D, t.spanX), W = Q("svY_", p, t.spanY), it = Q("hP_", F, t.hPiso), g = [];
      t.Lvix > 0 && g.push(-t.Lvix), g.push(0);
      for (let o = 0; o < D; o++) g.push(g[g.length - 1] + gt[o]);
      t.Lvdx > 0 && g.push(g[g.length - 1] + t.Lvdx);
      const d = [];
      t.Lviy > 0 && d.push(-t.Lviy), d.push(0);
      for (let o = 0; o < p; o++) d.push(d[d.length - 1] + W[o]);
      t.Lvdy > 0 && d.push(d[d.length - 1] + t.Lvdy);
      const h = [
        0
      ];
      for (let o = 0; o < F; o++) h.push(h[h.length - 1] + it[o]);
      const ct = (o) => t.Lvix > 0 && o === 0 || t.Lvdx > 0 && o === g.length - 1, vt = (o) => t.Lviy > 0 && o === 0 || t.Lvdy > 0 && o === d.length - 1, S = (o, s) => ct(o) || vt(s), _ = [], T = {};
      for (let o = 0; o < h.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) o === 0 && S(e, s) || (T[`${e},${s},${o}`] = _.length, _.push([
        g[e],
        d[s],
        h[o]
      ]));
      const z = [], mt = /* @__PURE__ */ new Set(), wt = /* @__PURE__ */ new Set(), zt = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), tt = (o, s, e, l, i) => {
        if (e <= 1) {
          l.add(z.length), $.set(z.length, i), z.push([
            o,
            s
          ]);
          return;
        }
        const x = _[o], r = _[s];
        let f = o;
        for (let b = 1; b < e; b++) {
          const c = b / e, C = _.length;
          _.push([
            x[0] + (r[0] - x[0]) * c,
            x[1] + (r[1] - x[1]) * c,
            x[2] + (r[2] - x[2]) * c
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
        const s = _[o];
        for (let e = z.length - 1; e >= 0; e--) {
          const l = z[e];
          if (l.length !== 2) continue;
          const [i, x] = l;
          if (i === o || x === o) continue;
          const r = _[i], f = _[x], b = [
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
            x
          ]), wt.has(e) && wt.add(B), mt.has(e) && mt.add(B), $.has(e) && $.set(B, $.get(e));
        }
      };
      for (let o = 0; o < h.length - 1; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) S(e, s) || tt(T[`${e},${s},${o}`], T[`${e},${s},${o + 1}`], y, mt, o);
      for (let o = 1; o < h.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length - 1; e++) tt(T[`${e},${s},${o}`], T[`${e + 1},${s},${o}`], u, wt, o - 1);
      for (let o = 1; o < h.length; o++) for (let s = 0; s < g.length; s++) for (let e = 0; e < d.length - 1; e++) tt(T[`${s},${e},${o}`], T[`${s},${e + 1},${o}`], u, wt, o - 1);
      if (t.vSecOn >= 0.5 && t.nVSec >= 1) {
        const o = Math.round(t.nVSec), s = (l, i, x) => {
          for (let f = 0; f < _.length; f++) if (Math.abs(_[f][0] - l) < 1e-6 && Math.abs(_[f][1] - i) < 1e-6 && Math.abs(_[f][2] - x) < 1e-6) return f;
          const r = _.length;
          return _.push([
            l,
            i,
            x
          ]), It(r), r;
        }, e = (l, i) => t.vSecDir < 0.5 ? "x" : t.vSecDir < 1.5 ? "y" : g[l + 1] - g[l] <= d[i + 1] - d[i] ? "x" : "y";
        for (let l = 1; l < h.length; l++) for (let i = 0; i < g.length - 1; i++) for (let x = 0; x < d.length - 1; x++) {
          const r = g[i], f = g[i + 1], b = d[x], c = d[x + 1];
          for (let C = 1; C <= o; C++) {
            const Y = C / (o + 1), [B, rt] = e(i, x) === "x" ? [
              s(r, b + Y * (c - b), h[l]),
              s(f, b + Y * (c - b), h[l])
            ] : [
              s(r + Y * (f - r), b, h[l]),
              s(r + Y * (f - r), c, h[l])
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
        const o = $t === 1 || $t === 2 || $t === 3, s = $t === 1 || $t === 2 || $t === 4, e = h.length - 1;
        for (let l = 0; l < e; l++) {
          if (o) for (let i = 0; i < d.length; i++) {
            if ($t === 1 && i !== 0 && i !== d.length - 1) continue;
            const x = Math.floor((g.length - 1) / 2);
            for (let r = 0; r < g.length - 1; r++) {
              if ($t === 1 && r !== x || S(r, i) || S(r + 1, i)) continue;
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
            const x = Math.floor((d.length - 1) / 2);
            for (let r = 0; r < d.length - 1; r++) {
              if ($t === 1 && r !== x || S(i, r) || S(i, r + 1)) continue;
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
      const At = /* @__PURE__ */ new Map(), _t = (o, s, e) => `${Math.round(o * 1e4)},${Math.round(s * 1e4)},${Math.round(e * 1e4)}`;
      for (let o = 0; o < _.length; o++) At.set(_t(_[o][0], _[o][1], _[o][2]), o);
      const Rt = t.slabDisc > 0 ? t.slabDisc : 0.5;
      if (t.slabOn >= 0.5) for (let o = 1; o < h.length; o++) {
        const s = h[o];
        for (let e = 0; e < g.length - 1; e++) for (let l = 0; l < d.length - 1; l++) {
          const i = g[e], x = g[e + 1], r = d[l], f = d[l + 1], { n: b } = Oo(Math.abs(x - i), Rt), { n: c } = Oo(Math.abs(f - r), Rt), C = [];
          for (let Y = 0; Y <= c; Y++) {
            const B = [];
            for (let rt = 0; rt <= b; rt++) {
              const R = i + rt / b * (x - i), yt = r + Y / c * (f - r), Mt = _t(R, yt, s), St = At.get(Mt);
              if (St !== void 0) B.push(St);
              else {
                const Ot = _.length;
                _.push([
                  R,
                  yt,
                  s
                ]), At.set(Mt, Ot), B.push(Ot), It(Ot);
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
          const Y = _t(b, c, C), B = At.get(Y);
          if (B !== void 0) return B;
          const rt = _.length;
          return _.push([
            b,
            c,
            C
          ]), At.set(Y, rt), It(rt), rt;
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
        }, i = t.Lvix > 0 ? 1 : 0, x = t.Lviy > 0 ? 1 : 0, r = g.length - 1 - (t.Lvdx > 0 ? 1 : 0), f = d.length - 1 - (t.Lvdy > 0 ? 1 : 0);
        for (let b = 0; b < h.length - 1; b++) {
          const c = h[b], C = h[b + 1], Y = Oo(C - c, Rt).n, B = Math.ceil(Y / y) * y;
          if (o && r > i) {
            const rt = g[i], R = g[i + 1], yt = Oo(R - rt, Rt).n;
            for (const Mt of /* @__PURE__ */ new Set([
              x,
              f
            ])) l(rt, d[Mt], R, d[Mt], c, C, yt, B);
          }
          if (s && f > x) {
            const rt = d[x], R = d[x + 1], yt = Oo(R - rt, Rt).n;
            for (const Mt of /* @__PURE__ */ new Set([
              i,
              r
            ])) l(g[Mt], rt, g[Mt], R, c, C, yt, B);
          }
        }
      }
      const Fo = Math.round(t.apoyo), Lo = Fo === 0 ? [
        true,
        true,
        true,
        true,
        true,
        true
      ] : Fo === 1 ? [
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
        ...Lo
      ]);
      for (const o of go) wo.set(o, [
        ...Lo
      ]);
      const Vt = Math.round(t.loadCase ?? 0), Se = Vt === 1 ? [
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
      ], [ke, Oe, Fe, Le] = Se, Ao = /* @__PURE__ */ new Map(), te = ke * t.CM + Oe * t.CV;
      if (te !== 0) for (let o = 1; o < h.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) {
        const l = `${e},${s},${o}`;
        T[l] !== void 0 && Ao.set(T[l], [
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
        const o = T[`${g.length - 1 - (t.Lvdx > 0 ? 1 : 0)},${t.Lviy > 0 ? 1 : 0},${F}`];
        if (o !== void 0) {
          const s = Ao.get(o) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          Ao.set(o, [
            s[0] + oe,
            s[1] + ee,
            s[2],
            s[3],
            s[4],
            s[5]
          ]);
        }
      }
      const Ro = [
        t.colB_1,
        t.colB_2,
        t.colB_3,
        t.colB_4,
        t.colB_5,
        t.colB_6,
        t.colB_7,
        t.colB_8
      ].map((o) => o > 0 ? o : t.colSize), Zo = [
        t.colH_1,
        t.colH_2,
        t.colH_3,
        t.colH_4,
        t.colH_5,
        t.colH_6,
        t.colH_7,
        t.colH_8
      ].map((o) => o > 0 ? o : t.colSize), Ae = [
        t.vigaB_1,
        t.vigaB_2,
        t.vigaB_3,
        t.vigaB_4,
        t.vigaB_5,
        t.vigaB_6,
        t.vigaB_7,
        t.vigaB_8
      ].map((o) => o > 0 ? o : t.vigaB), Ee = [
        t.vigaH_1,
        t.vigaH_2,
        t.vigaH_3,
        t.vigaH_4,
        t.vigaH_5,
        t.vigaH_6,
        t.vigaH_7,
        t.vigaH_8
      ].map((o) => o > 0 ? o : t.vigaH), jo = Math.round(t.matCol) === 2, Pe = (o) => {
        const s = Ro[o] ?? t.colSize, e = Zo[o] ?? t.colSize;
        if (jo) {
          const l = Math.min(t.tCft, Math.min(s, e) / 2 - 1e-3), i = We(s, e, l, G, K, N, j);
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
      }, Ie = (o) => {
        const s = Ae[o] ?? t.vigaB, e = Ee[o] ?? t.vigaH;
        return {
          A: s * e,
          Iy: s * e ** 3 / 12,
          Iz: e * s ** 3 / 12,
          J: 0.21 * Math.pow(Math.min(s, e), 3) * Math.max(s, e)
        };
      }, Ve = t.matCol < 0.5 ? N : G, Ne = t.matCol < 0.5 ? at : ut, Te = t.matCol < 0.5 ? j : K, Be = t.matCol < 0.5 ? mo : we, De = t.matViga < 0.5 ? N : G, Ye = t.matViga < 0.5 ? at : ut, qe = t.matViga < 0.5 ? j : K, He = t.matViga < 0.5 ? mo : we, Mo = /* @__PURE__ */ new Map(), po = /* @__PURE__ */ new Map(), Eo = /* @__PURE__ */ new Map(), Po = /* @__PURE__ */ new Map(), Io = /* @__PURE__ */ new Map(), Vo = /* @__PURE__ */ new Map(), xo = /* @__PURE__ */ new Map(), zo = /* @__PURE__ */ new Map(), Xo = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = Math.round(t.slabType), Re = le === 2 ? 0 : 1, Ze = le === 1 ? 0 : 1, No = t.crackedSections > 0.5, de = t.matCol < 0.5 && No ? 0.7 : 1, fe = t.matViga < 0.5 && No ? 0.35 : 1, je = No ? 0.25 : 1, Xe = 1, To = t.massSource > 0.5, Ge = t.qDead + 0.25 * t.qLive, Ke = To ? Ge / Wo / Math.max(t.slabT, 0.05) : mo;
      for (let o = 0; o < z.length; o++) {
        const s = $.get(o) ?? 0;
        if (zt.has(o)) Mo.set(o, N), po.set(o, at), zo.set(o, j), Xo.set(o, t.slabT), ce.set(o, Re * Xe), re.set(o, Ze * je), ie.set(o, Math.round(t.slabForm ?? 1)), xo.set(o, Ke);
        else if (uo.has(o)) Mo.set(o, N), po.set(o, at), zo.set(o, j), Xo.set(o, t.tMuro ?? 0.25), xo.set(o, To ? 0 : mo);
        else if (mt.has(o)) {
          const e = Pe(Math.min(s, 7));
          Mo.set(o, Ve), po.set(o, Ne), zo.set(o, Te), Eo.set(o, e.A), Po.set(o, e.Iz * de), Io.set(o, e.Iy * de), Vo.set(o, e.J), jo && (ne.set(o, e.As2), se.set(o, e.As3), ae.set(o, {
            type: "CFT",
            b: e.b,
            h: e.h,
            tw: e.t,
            tf: e.t,
            fillE: N,
            d: 0
          })), xo.set(o, To ? 0 : Be);
        } else {
          const e = Ie(Math.min(s, 7));
          Mo.set(o, De), po.set(o, Ye), zo.set(o, qe), Eo.set(o, e.A), Po.set(o, e.Iz * fe), Io.set(o, e.Iy * fe), Vo.set(o, e.J), xo.set(o, To ? 0 : He);
        }
      }
      if (t.diafragmaRigido >= 0.5) {
        const o = [];
        for (let i = 1; i < h.length; i++) o.push(h[i]);
        const s = ls(_, o), e = z.length;
        for (const i of s.masterNodes) _.push([
          i.x,
          i.y,
          i.z
        ]);
        for (const i of s.rigidLinks) z.push(i);
        ds(s, {
          elasticities: Mo,
          shearModuli: po,
          areas: Eo,
          momentsOfInertiaY: Po,
          momentsOfInertiaZ: Io,
          torsionalConstants: Vo,
          densities: xo
        }, e);
      }
      n.nodes.val = _, n.elements.val = z;
      const Go = /* @__PURE__ */ new Map();
      if (t.slabOn >= 0.5) for (let o = 1; o < h.length; o++) for (let s = 0; s < d.length; s++) for (let e = 0; e < g.length; e++) {
        const l = T[`${e},${s},${o}`];
        l !== void 0 && Go.set(l, o);
      }
      n.nodeInputs.val = {
        supports: wo,
        loads: Ao,
        ...Go.size ? {
          diaphragms: Go
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
        thicknesses: Xo,
        membraneModifiers: ce,
        bendingModifiers: re,
        plateFormulations: ie,
        ...jo ? {
          shearAreasY: se,
          shearAreasZ: ne,
          sectionShapes: ae
        } : {}
      };
      const he = ye(_, z, n.nodeInputs.val, n.elementInputs.val);
      n.deformOutputs.val = he, n.analyzeOutputs.val = Ue(_, z, n.elementInputs.val, he);
      const Ko = ts(g, d, h);
      try {
        const o = hs(_, z, n.analyzeOutputs.rawVal, n.elementInputs.rawVal, Math.round(t.matCol), Math.round(t.matViga), mt);
        let s = 1 / 0, e = 1 / 0, l = 1 / 0, i = -1 / 0, x = -1 / 0, r = -1 / 0;
        for (const c of _) c[0] < s && (s = c[0]), c[0] > i && (i = c[0]), c[1] < e && (e = c[1]), c[1] > x && (x = c[1]), c[2] < l && (l = c[2]), c[2] > r && (r = c[2]);
        const f = Math.sqrt((i - s) ** 2 + (x - e) ** 2 + (r - l) ** 2) || 1, b = ms(o, _, f, {
          showElastic: false,
          radiusFactor: 0.015
        });
        Ko.push(...b), n.__plasticHinges = us(o);
      } catch (o) {
        console.warn("[Plastic Hinges]", o);
      }
      if ((t.mostrarZapatas ?? 1) >= 0.5) try {
        const o = (_a = n.deformOutputs.rawVal) == null ? void 0 : _a.reactions;
        if (o) {
          const s = [];
          let e = 0, l = 0;
          if (o.forEach((i, x) => {
            const r = _[x];
            !r || Math.abs(r[2]) > 1e-6 || (s.push({
              idx: x,
              x: r[0],
              y: r[1],
              P_kN: Math.abs(i[2]),
              Mx_kN: i[3],
              My_kN: i[4]
            }), r[0] > e && (e = r[0]), r[1] > l && (l = r[1]));
          }), s.length > 0) {
            const i = t.q_adm_zapata ?? 10, x = t.ks_zapata ?? 1030, r = Math.max(0, t.Hf_pedestal ?? 0.5), f = Math.max(0.1, t.t_zapata ?? 0.3), b = Math.max(2, Math.round(t.nSubZapata ?? 4)), c = Math.max(0, t.voladoExtra ?? 0.3), C = Math.round(t.tipoZapataOverride ?? 0) | 0, Y = Math.round(t.estiloZapata ?? 1), B = Ho(s, e, l, i, x), rt = [
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
            }), me = Ro[0] ?? t.colSize, ue = Zo[0] ?? t.colSize;
            for (const E of B) {
              const Z = E.Lz, st = E.Bz, Gt = E.t;
              let Zt = 0, jt = 0;
              E.tipo === "esquinera" ? (Zt = E.x < e / 2 ? -(Z / 2 - c) : Z / 2 - c, jt = E.y < l / 2 ? -(st / 2 - c) : st / 2 - c) : E.tipo === "lindero" && (Math.abs(E.x) < 1e-3 || Math.abs(E.x - e) < 1e-3 ? Zt = E.x < e / 2 ? -(Z / 2 - c) : Z / 2 - c : (Math.abs(E.y) < 1e-3 || Math.abs(E.y - l) < 1e-3) && (jt = E.y < l / 2 ? -(st / 2 - c) : st / 2 - c));
              const J = E.x - Zt, L = E.y - jt, V = -r, Nt = V - Gt / 2, qt = V - Gt, eo = E.ratio;
              let so = 4906624;
              if (eo > 1.5 ? so = 15680580 : eo > 1 ? so = 16096779 : eo > 0.8 && (so = 16498468), r > 1e-3) {
                const xt = new ho().setFromPoints([
                  new X(E.x, E.y, 0),
                  new X(E.x, E.y, -r)
                ]);
                R.push(new be(xt, new Kt({
                  color: 6333946,
                  linewidth: 4
                }))), R.push(oo(`Df=${r.toFixed(2)}m`, E.x + 0.1, E.y + 0.1, -r / 2, "#60a5fa"));
              }
              if (Y === 0) {
                const xt = new ss(Z, st, Gt), Ut = new qo(xt, yt(so));
                Ut.position.set(J, L, Nt), R.push(Ut);
                const Qt = new Co(new ns(xt), Mt);
                Qt.position.copy(Ut.position), R.push(Qt);
              } else {
                const xt = new as(Z, st), Ut = new Uo({
                  color: so,
                  transparent: true,
                  opacity: 0.45,
                  roughness: 0.6,
                  side: is
                }), Qt = new qo(xt, Ut);
                Qt.position.set(J, L, V), R.push(Qt);
                const no = new qo(xt.clone(), Ut.clone());
                no.position.set(J, L, qt), R.push(no);
                const Me = Z / b, pe = st / b, Xt = [];
                for (let kt = 0; kt <= b; kt++) {
                  const bt = -Z / 2 + kt * Me;
                  Xt.push(new X(J + bt, L - st / 2, V), new X(J + bt, L + st / 2, V)), Xt.push(new X(J + bt, L - st / 2, qt), new X(J + bt, L + st / 2, qt));
                }
                for (let kt = 0; kt <= b; kt++) {
                  const bt = -st / 2 + kt * pe;
                  Xt.push(new X(J - Z / 2, L + bt, V), new X(J + Z / 2, L + bt, V)), Xt.push(new X(J - Z / 2, L + bt, qt), new X(J + Z / 2, L + bt, qt));
                }
                const So = new ho().setFromPoints(Xt);
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
                  ro.push(new X(J + bt, L + a, V), new X(J + k, L + M, V)), ro.push(new X(J + bt, L + a, qt), new X(J + k, L + M, qt)), ro.push(new X(J + bt, L + a, V), new X(J + bt, L + a, qt));
                }
                const yo = new ho().setFromPoints(ro);
                R.push(new Co(yo, Mt));
              }
              (t.mostrarLabelsZapatas ?? 1) >= 0.5 && R.push(oo(`${E.tipo[0].toUpperCase()} ${Z.toFixed(2)}\xD7${st.toFixed(2)}\xD7${Gt.toFixed(2)}m \u03C3/q=${E.ratio.toFixed(2)}`, J, L, qt - 0.2, eo <= 1 ? "#4ade80" : eo <= 1.5 ? "#f59e0b" : "#ef4444"));
            }
            if (Math.round(t.sistemaCimentacion ?? 0) === 1) {
              const E = Math.round(t.vigaAmarre_pos ?? 0), Z = E === 0 ? -r : -r / 2, st = t.vigaAmarre_b ?? 0.25, Gt = t.vigaAmarre_h ?? 0.4, Zt = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Map();
              for (const L of s) {
                const V = L.y.toFixed(4), Nt = L.x.toFixed(4);
                Zt.has(V) || Zt.set(V, []), jt.has(Nt) || jt.set(Nt, []), Zt.get(V).push(L), jt.get(Nt).push(L);
              }
              const J = [];
              for (const L of Zt.values()) {
                L.sort((V, Nt) => V.x - Nt.x);
                for (let V = 0; V < L.length - 1; V++) J.push(new X(L[V].x, L[V].y, Z)), J.push(new X(L[V + 1].x, L[V + 1].y, Z));
              }
              for (const L of jt.values()) {
                L.sort((V, Nt) => V.y - Nt.y);
                for (let V = 0; V < L.length - 1; V++) J.push(new X(L[V].x, L[V].y, Z)), J.push(new X(L[V + 1].x, L[V + 1].y, Z));
              }
              J.length > 0 && (R.push(new Co(new ho().setFromPoints(J), new Kt({
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
          if (s.forEach((x, r) => {
            const f = _[r];
            !f || Math.abs(f[2]) > 1e-6 || (e.push({
              idx: r,
              x: f[0],
              y: f[1],
              P_kN: Math.abs(x[2]),
              Mx_kN: x[3],
              My_kN: x[4]
            }), f[0] > l && (l = f[0]), f[1] > i && (i = f[1]));
          }), e.length > 0) {
            const x = t.q_adm_zapata ?? 10, r = t.ks_zapata ?? 1030, f = Math.max(0, t.Hf_pedestal ?? 0.5), b = Math.max(0.1, t.t_zapata ?? 0.3), c = Math.max(2, Math.round(t.nSubZapata ?? 4)), C = Math.max(0, t.voladoExtra ?? 0.3), Y = Math.round(t.tipoZapataOverride ?? 0) | 0, B = Ho(e, l, i, x, r), rt = [
              "central",
              "lindero",
              "esquinera"
            ];
            for (const a of B) Y > 0 && (a.tipo = rt[Y - 1]), a.t = b;
            const R = Ro[0] ?? t.colSize, yt = Zo[0] ?? t.colSize, Mt = R * yt, St = R * yt ** 3 / 12, Ot = yt * R ** 3 / 12, vo = 0.14 * Math.pow(Math.min(R, yt), 4), me = t.matCol < 0.5 ? N : G, ue = t.matCol < 0.5 ? at : ut, ge = t.matCol < 0.5 ? j : K, E = [], Z = [], st = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Map(), eo = /* @__PURE__ */ new Map(), so = /* @__PURE__ */ new Map(), $o = [], xt = [], Ut = (a, k, M) => `${Math.round(a * 1e4)},${Math.round(k * 1e4)},${Math.round(M * 1e4)}`, Qt = /* @__PURE__ */ new Map(), no = (a, k, M) => {
              const A = Ut(a, k, M), q = Qt.get(A);
              if (q !== void 0) return q;
              const nt = E.length;
              return E.push([
                a,
                k,
                M
              ]), Qt.set(A, nt), nt;
            }, Me = new Kt({
              color: 0,
              linewidth: 2
            }), pe = new Kt({
              color: 1118481,
              linewidth: 2
            });
            for (const a of B) {
              const k = a.Lz, M = a.Bz, A = a.t;
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
                ]), qt.set(ft, A), st.set(ft, N), Nt.set(ft, j), Gt.set(ft, at), V.set(ft, mo);
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
              let w = 0, P = 0, v = 1 / 0;
              for (let H = 0; H <= c; H++) for (let ot = 0; ot <= c; ot++) {
                const ft = lt[H][ot], Yt = E[ft][0], Ct = E[ft][1], O = Math.sqrt((Yt - a.x) ** 2 + (Ct - a.y) ** 2);
                O < v && (v = O, w = H, P = ot);
              }
              const Ht = lt[w][P], Ft = e.find((H) => H.idx === a.idx);
              so.set(Ht, [
                0,
                0,
                -Ft.P_kN,
                Ft.Mx_kN,
                Ft.My_kN,
                0
              ]);
              const io = a.ratio;
              let bo = 4906624;
              if (io > 1.5 ? bo = 15680580 : io > 1 ? bo = 16096779 : io > 0.8 && (bo = 16498468), f > 1e-3) {
                const H = new ho().setFromPoints([
                  new X(a.x, a.y, 0),
                  new X(a.x, a.y, -f)
                ]);
                xt.push(new be(H, new Kt({
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
                xt.push(new Co(new ho().setFromPoints(Yt), H));
              }
              if ((t.mostrarLabelsZapatas ?? 1) >= 0.5) {
                const H = Ft.P_kN / 9.80665, ot = Ft.Mx_kN / 9.80665, ft = Ft.My_kN / 9.80665;
                xt.push(oo(`P=${H.toFixed(2)} tonf`, a.x, a.y, 0.3, "#fbbf24")), xt.push(oo(`Mx=${ot.toFixed(2)}  My=${ft.toFixed(2)} tonf\xB7m`, a.x, a.y, 0.1, "#fbbf24")), xt.push(oo(`${a.tipo[0].toUpperCase()} ${k.toFixed(2)}\xD7${M.toFixed(2)}\xD7${A.toFixed(2)}m \u03C3/q=${io.toFixed(2)}`, Tt, Et, -f - A - 0.2, io <= 1 ? "#4ade80" : io <= 1.5 ? "#f59e0b" : "#ef4444"));
              }
            }
            const Xt = Math.round(t.sistemaCimentacion ?? 0);
            if (Xt === 1) {
              const a = Math.round(t.vigaAmarre_pos ?? 0), k = t.vigaAmarre_h ?? 0.4, M = t.vigaAmarre_b ?? 0.25, A = M * k, q = M * k ** 3 / 12, nt = k * M ** 3 / 12, Tt = 0.21 * Math.pow(Math.min(M, k), 3) * Math.max(M, k), Et = /* @__PURE__ */ new Map();
              for (const w of B) {
                let P;
                a === 0 ? P = -f : P = -f / 2;
                const v = no(w.x, w.y, P);
                if (Et.set(w.idx, v), a === 1 && f > 1e-3) {
                  const dt = no(w.x, w.y, -f / 2), Ht = no(w.x, w.y, 0), Ft = no(w.x, w.y, -f);
                }
              }
              const Wt = /* @__PURE__ */ new Map(), Bt = /* @__PURE__ */ new Map();
              for (const w of e) {
                const P = w.y.toFixed(4), v = w.x.toFixed(4);
                Wt.has(P) || Wt.set(P, []), Bt.has(v) || Bt.set(v, []), Wt.get(P).push(w), Bt.get(v).push(w);
              }
              const to = (w, P) => {
                const v = Z.length;
                Z.push([
                  w,
                  P
                ]), st.set(v, me), Gt.set(v, ue), Nt.set(v, ge), Zt.set(v, A), jt.set(v, nt), J.set(v, q), L.set(v, Tt), V.set(v, mo);
              };
              let lt = 0;
              for (const w of Wt.values()) {
                w.sort((P, v) => P.x - v.x);
                for (let P = 0; P < w.length - 1; P++) {
                  const v = Et.get(w[P].idx), dt = Et.get(w[P + 1].idx);
                  v !== void 0 && dt !== void 0 && (to(v, dt), lt++);
                }
              }
              for (const w of Bt.values()) {
                w.sort((P, v) => P.y - v.y);
                for (let P = 0; P < w.length - 1; P++) {
                  const v = Et.get(w[P].idx), dt = Et.get(w[P + 1].idx);
                  v !== void 0 && dt !== void 0 && (to(v, dt), lt++);
                }
              }
              const ao = new Kt({
                color: 2282478,
                linewidth: 3
              }), Dt = [];
              for (const w of Wt.values()) {
                const P = [
                  ...w
                ].sort((v, dt) => v.x - dt.x);
                for (let v = 0; v < P.length - 1; v++) {
                  const dt = P[v], Ht = P[v + 1], Ft = a === 0 ? -f : -f / 2;
                  Dt.push(new X(dt.x, dt.y, Ft)), Dt.push(new X(Ht.x, Ht.y, Ft));
                }
              }
              for (const w of Bt.values()) {
                const P = [
                  ...w
                ].sort((v, dt) => v.y - dt.y);
                for (let v = 0; v < P.length - 1; v++) {
                  const dt = P[v], Ht = P[v + 1], Ft = a === 0 ? -f : -f / 2;
                  Dt.push(new X(dt.x, dt.y, Ft)), Dt.push(new X(Ht.x, Ht.y, Ft));
                }
              }
              if (Dt.length > 0) {
                const w = new ho().setFromPoints(Dt);
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
              for (const A of e) {
                const q = A.y.toFixed(4), nt = A.x.toFixed(4);
                a.has(q) || a.set(q, []), k.has(nt) || k.set(nt, []), a.get(q).push(A), k.get(nt).push(A);
              }
              const M = (A) => yo.set(A, (yo.get(A) ?? 0) + 1);
              for (const A of a.values()) {
                A.sort((q, nt) => q.x - nt.x);
                for (let q = 0; q < A.length - 1; q++) M(A[q].idx), M(A[q + 1].idx);
              }
              for (const A of k.values()) {
                A.sort((q, nt) => q.y - nt.y);
                for (let q = 0; q < A.length - 1; q++) M(A[q].idx), M(A[q + 1].idx);
              }
              console.log(`[Cimentaci\xF3n] Vigas de amarre activas \u2014 momentos en zapatas reducidos por factor (1 - ${_o} \xB7 n_vigas/4):`), yo.forEach((A, q) => {
                const nt = (_o * A / 4 * 100).toFixed(0);
                console.log(`   Zapata ${q}: ${A} vigas conectadas \u2192 momento reducido ${nt}%`);
              }), ro === 0 && console.log("   \u21B3 vigaAmarre_pos=0 (mismo nivel zapata) \u2192 en F2K se exportar\xE1 como cimentaci\xF3n corrida con ks\xB7b\xB7dL distribuido por nodo");
            }
            const kt = /* @__PURE__ */ new Map(), bt = /* @__PURE__ */ new Map();
            for (const a of B) {
              const k = e.find((O) => O.idx === a.idx), M = a.Lz, A = a.Bz, q = a.t;
              let nt = 0, Tt = 0;
              a.tipo === "esquinera" ? (nt = a.x < l / 2 ? -(M / 2 - C) : M / 2 - C, Tt = a.y < i / 2 ? -(A / 2 - C) : A / 2 - C) : a.tipo === "lindero" && (Math.abs(a.x) < 1e-3 || Math.abs(a.x - l) < 1e-3 ? nt = a.x < l / 2 ? -(M / 2 - C) : M / 2 - C : (Math.abs(a.y) < 1e-3 || Math.abs(a.y - i) < 1e-3) && (Tt = a.y < i / 2 ? -(A / 2 - C) : A / 2 - C));
              const Et = a.x - nt, Wt = a.y - Tt, Bt = [], to = [], lt = {
                elasticities: /* @__PURE__ */ new Map(),
                shearModuli: /* @__PURE__ */ new Map(),
                poissonsRatios: /* @__PURE__ */ new Map(),
                thicknesses: /* @__PURE__ */ new Map(),
                densities: /* @__PURE__ */ new Map()
              }, ao = M / c, Dt = A / c, w = [], P = [];
              for (let O = 0; O <= c; O++) {
                const et = [];
                for (let ht = 0; ht <= c; ht++) {
                  const Pt = -M / 2 + ht * ao, Lt = -A / 2 + O * Dt;
                  et.push(Bt.length), Bt.push([
                    Pt,
                    Lt,
                    0
                  ]);
                  const Bo = Et + Pt, Do = Wt + Lt, Yo = Ut(Bo, Do, -f), lo = Qt.get(Yo);
                  lo !== void 0 ? P.push(lo) : P.push(-1);
                }
                w.push(et);
              }
              for (let O = 0; O < c; O++) for (let et = 0; et < c; et++) {
                const ht = to.length;
                to.push([
                  w[O][et],
                  w[O][et + 1],
                  w[O + 1][et + 1],
                  w[O + 1][et]
                ]), lt.thicknesses.set(ht, q), lt.elasticities.set(ht, N), lt.poissonsRatios.set(ht, j), lt.shearModuli.set(ht, at), lt.densities.set(ht, mo);
              }
              const v = [], dt = 0.5;
              for (let O = 0; O <= c; O++) for (let et = 0; et <= c; et++) {
                const ht = ao * Dt * (et === 0 || et === c ? 0.5 : 1) * (O === 0 || O === c ? 0.5 : 1), Pt = r * ht, Lt = w[O][et];
                v.push({
                  node: Lt,
                  dof: 0,
                  k: Pt * dt
                }), v.push({
                  node: Lt,
                  dof: 1,
                  k: Pt * dt
                }), v.push({
                  node: Lt,
                  dof: 2,
                  k: Pt
                });
              }
              if (So === 1 && ro === 0) {
                const O = t.vigaAmarre_b ?? 0.25, et = a.idx, ht = e.filter((pt) => Math.abs(pt.y - a.y) < 1e-3 && pt.idx !== et).sort((pt, ko) => pt.x - ko.x), Pt = e.filter((pt) => Math.abs(pt.x - a.x) < 1e-3 && pt.idx !== et).sort((pt, ko) => pt.y - ko.y), Lt = ht.find((pt) => pt.x > a.x), Bo = [
                  ...ht
                ].reverse().find((pt) => pt.x < a.x), Do = Pt.find((pt) => pt.y > a.y), Yo = [
                  ...Pt
                ].reverse().find((pt) => pt.y < a.y), lo = (pt, ko) => {
                  const xe = ko / 2;
                  for (let co = 0; co <= c; co++) {
                    const Je = co === 0 || co === c ? xe / (2 * c) : xe / c, ve = r * O * Je, _e = ve * dt;
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
                    v.push({
                      node: fo,
                      dof: 0,
                      k: _e
                    }), v.push({
                      node: fo,
                      dof: 1,
                      k: _e
                    }), v.push({
                      node: fo,
                      dof: 2,
                      k: ve
                    });
                  }
                };
                Lt && lo("x+", Lt.x - a.x), Bo && lo("x-", a.x - Bo.x), Do && lo("y+", Do.y - a.y), Yo && lo("y-", a.y - Yo.y);
              }
              const Ht = r * ao * Dt * 1e-4;
              v.push({
                node: w[0][0],
                dof: 3,
                k: Ht
              }), v.push({
                node: w[0][0],
                dof: 4,
                k: Ht
              }), v.push({
                node: w[0][0],
                dof: 5,
                k: Ht
              });
              const Ft = -nt, io = -Tt;
              let bo = 0, Jo = 0, H = 1 / 0;
              for (let O = 0; O <= c; O++) for (let et = 0; et <= c; et++) {
                const ht = -M / 2 + et * ao, Pt = -A / 2 + O * Dt, Lt = (ht - Ft) ** 2 + (Pt - io) ** 2;
                Lt < H && (H = Lt, bo = O, Jo = et);
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
                const et = ye(Bt, to, {
                  supports: /* @__PURE__ */ new Map(),
                  loads: ft
                }, lt, v).deformations;
                for (let ht = 0; ht < Bt.length; ht++) {
                  const Pt = P[ht];
                  if (Pt >= 0) {
                    const Lt = et.get(ht);
                    Lt && kt.set(Pt, [
                      ...Lt
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
              for (const A of k) {
                const q = kt.get(A);
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
              momentsOfInertiaZ: J,
              torsionalConstants: L,
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
                  -x,
                  0
                ]
              }
            }, n.objects3D.val = xt, console.log(`[Modo Cimentaci\xF3n] ${e.length} zapatas + pedestales (Hf=${f} m, t=${b} m, q_adm=${x} tonf/m\xB2, ks=${r} kN/m\xB3) \u2014 reemplaza superestructura`);
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
      const p = n.nodes.val, F = n.elements.val, u = n.nodeInputs.val, y = n.elementInputs.val;
      if (!(!p.length || !F.length || !((_a = u.supports) == null ? void 0 : _a.size) || !((_b = y.densities) == null ? void 0 : _b.size))) try {
        const I = [], N = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), gt = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map();
        let it = 0, g = 0;
        const d = [];
        let h = 0;
        for (let $ = 0; $ < F.length; $++) {
          const tt = F[$];
          let It = false, $t = false;
          if (tt.length === 4) {
            const At = tt.map((Rt) => p[Rt][2]);
            if (Math.max(...At) - Math.min(...At) < 0.02) {
              const Rt = p[tt[0]][0], uo = p[tt[0]][1], go = p[tt[2]][0], Jt = p[tt[2]][1], Fo = Math.abs((go - Rt) * (Jt - uo)), Lo = ((_c = y.thicknesses) == null ? void 0 : _c.get($)) ?? 0.15, wo = ((_d = y.densities) == null ? void 0 : _d.get($)) ?? 24;
              it += wo * Fo * Lo, It = true;
            }
          } else if (tt.length === 2) {
            const At = p[tt[0]][2], _t = p[tt[1]][2], Rt = Math.sqrt((p[tt[1]][0] - p[tt[0]][0]) ** 2 + (p[tt[1]][1] - p[tt[0]][1]) ** 2);
            if (Math.abs(_t - At) > Rt) {
              $t = true;
              const uo = Math.abs(_t - At), go = ((_e = y.areas) == null ? void 0 : _e.get($)) ?? 0, Jt = ((_f = y.densities) == null ? void 0 : _f.get($)) ?? 24;
              g += Jt * go * uo;
            }
          }
          It || (I.push(tt), ((_g = y.areas) == null ? void 0 : _g.has($)) && N.set(h, y.areas.get($)), ((_h = y.momentsOfInertiaY) == null ? void 0 : _h.has($)) && G.set(h, y.momentsOfInertiaY.get($)), ((_i = y.momentsOfInertiaZ) == null ? void 0 : _i.has($)) && j.set(h, y.momentsOfInertiaZ.get($)), ((_j = y.torsionalConstants) == null ? void 0 : _j.has($)) && K.set(h, y.torsionalConstants.get($)), ((_k = y.elasticities) == null ? void 0 : _k.has($)) && at.set(h, y.elasticities.get($)), ((_l = y.shearModuli) == null ? void 0 : _l.has($)) && ut.set(h, y.shearModuli.get($)), ((_m = y.densities) == null ? void 0 : _m.has($)) && Q.set(h, y.densities.get($)), ((_n = y.thicknesses) == null ? void 0 : _n.has($)) && gt.set(h, y.thicknesses.get($)), ((_o = y.poissonsRatios) == null ? void 0 : _o.has($)) && W.set(h, y.poissonsRatios.get($)), $t && d.push(h), h++);
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
          momentsOfInertiaY: G,
          momentsOfInertiaZ: j,
          torsionalConstants: K,
          elasticities: at,
          shearModuli: ut,
          densities: Q,
          thicknesses: gt,
          poissonsRatios: W
        }, vt = Math.round(t.nPisos), S = Math.min(60, Math.max(15, 3 * vt + 6)), _ = Qe(p, I, u, ct, S), T = Math.round(t.nVanosX), z = Math.round(t.nVanosY), mt = Math.round(t.nPisos), wt = g > 0 ? 1 + it / g : 1;
        D.render(_, {
          title: `Edificio ${T}\xD7${z} vanos \xD7 ${mt} pisos \xB7 ${S} modos`,
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
        const zt = _.frequencies[0] ?? 0;
        console.log(`[Edificio Modal] ${S} modos \xB7 f\u2081=${zt.toFixed(4)} Hz \xB7 m_slab=${it.toFixed(0)} m_cols=${g.toFixed(0)} factor=${wt.toFixed(2)}`);
      } catch (I) {
        console.warn("Modal edificio error:", I.message);
      }
    }
  };
});
export {
  __tla,
  ys as e,
  _s as f
};
