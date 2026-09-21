import { a as ss } from "./analyze-C-HJ03ae.js";
import { m as ns, d as Ie, __tla as __tla_0 } from "./didacticCpp-CzlDWovh.js";
import { b as as, t as is, i as cs } from "./cadSections-BcRFaG1j.js";
import { b as rs, a as to } from "./cotas3D-BdlSa8JM.js";
import { S as ls, f as ds, M as Go, e as ae, b as jt, B as uo, V as G, d as Oe, c as fs, L as Co, E as hs, w as ms, D as us } from "./Text-Br8EG2up.js";
import { e as gs } from "./materials-VwssM8Vw.js";
let Os, Is;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function ko(t, a = 0.5) {
    const D = Ms(a), y = t / D;
    let k = Math.max(2, Math.round(y));
    return t / k > D * 1.25 && (k = Math.ceil(y)), {
      n: k,
      dx: t / k
    };
  }
  function Ms(t) {
    return typeof t == "number" ? t : t === "fine" ? 0.25 : 0.5;
  }
  const ps = {
    "Grueso (50 cm)": 0.5,
    "Medio (30 cm)": 0.3,
    "Fino (25 cm)": 0.25,
    "Muy fino (15 cm)": 0.15
  };
  function xs(t, a, D = {}) {
    const y = D.tol ?? 1e-5, k = 0, p = [], _ = [], P = {
      areas: /* @__PURE__ */ new Map(),
      momentsOfInertiaY: /* @__PURE__ */ new Map(),
      momentsOfInertiaZ: /* @__PURE__ */ new Map(),
      torsionalConstants: /* @__PURE__ */ new Map(),
      elasticities: /* @__PURE__ */ new Map(),
      shearModuli: /* @__PURE__ */ new Map(),
      densities: /* @__PURE__ */ new Map()
    }, N = 1e8, K = 1e4, j = 1e4, U = 2 * j, at = N / (2 * (1 + 0.3));
    for (const gt of a) {
      const W = [];
      let Mt = 0, tt = 0;
      for (let m = 0; m < t.length; m++) Math.abs(t[m][2] - gt) < y && (W.push(m), Mt += t[m][0], tt += t[m][1]);
      if (W.length < 2) continue;
      const it = Mt / W.length, x = tt / W.length, f = t.length + p.length;
      p.push({
        idx: f,
        z: gt,
        x: it,
        y: x
      });
      for (const m of W) {
        const ct = t[m][0] - it, _t = t[m][1] - x;
        if (Math.hypot(ct, _t) < y) {
          console.info(`[diafragma] z = ${gt}: el nudo ${m} cae sobre el master (${it.toFixed(3)}, ${x.toFixed(3)}): sin link, un elemento de longitud cero no ata nada.`);
          continue;
        }
        _.push([
          f,
          m
        ]);
        const $ = k + _.length - 1;
        P.areas.set($, K), P.momentsOfInertiaY.set($, j), P.momentsOfInertiaZ.set($, j), P.torsionalConstants.set($, U), P.elasticities.set($, N), P.shearModuli.set($, at), P.densities.set($, 0);
      }
    }
    return D.linkStiffness, {
      masterNodes: p,
      rigidLinks: _,
      linkProps: P
    };
  }
  function vs(t, a, D) {
    const y = (k, p) => {
      k.forEach((_, P) => p.set(P + D, _));
    };
    a.areas = a.areas ?? /* @__PURE__ */ new Map(), a.momentsOfInertiaY = a.momentsOfInertiaY ?? /* @__PURE__ */ new Map(), a.momentsOfInertiaZ = a.momentsOfInertiaZ ?? /* @__PURE__ */ new Map(), a.torsionalConstants = a.torsionalConstants ?? /* @__PURE__ */ new Map(), a.elasticities = a.elasticities ?? /* @__PURE__ */ new Map(), a.shearModuli = a.shearModuli ?? /* @__PURE__ */ new Map(), a.densities = a.densities ?? /* @__PURE__ */ new Map(), y(t.linkProps.areas, a.areas), y(t.linkProps.momentsOfInertiaY, a.momentsOfInertiaY), y(t.linkProps.momentsOfInertiaZ, a.momentsOfInertiaZ), y(t.linkProps.torsionalConstants, a.torsionalConstants), y(t.linkProps.elasticities, a.elasticities), y(t.linkProps.shearModuli, a.shearModuli), y(t.linkProps.densities, a.densities);
  }
  function Le(t) {
    const a = Math.abs(t);
    return a < 0.8 ? {
      state: "Elastic",
      color: 2278750,
      ratio: t,
      description: "El\xE1stico (sin da\xF1o)"
    } : a < 1 ? {
      state: "B",
      color: 15381256,
      ratio: t,
      description: "B \u2014 Inicio fluencia"
    } : a < 1.5 ? {
      state: "IO",
      color: 16347926,
      ratio: t,
      description: "IO \u2014 Immediate Occupancy"
    } : a < 2.5 ? {
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
  function ys(t, a, D) {
    if (t <= 0 || a <= 0) return 1e-12;
    const k = Math.sqrt(12 * a / t) / 2;
    return a / k * D;
  }
  function bs(t, a, D, y, k, p, _, P = {}) {
    var _a, _b;
    const N = P.Fy_steel ?? 345e3;
    P.fc_concrete;
    const K = P.Fy_rebar ?? 42e4, j = P.omega ?? 0.15, U = P.phi ?? 0.9, at = k < 0.5 ? U * j * K * (1 - 0.59 * j) : U * N, gt = p < 0.5 ? U * j * K * (1 - 0.59 * j) : U * N, W = D.frameBendingMoments, Mt = [];
    for (let tt = 0; tt < a.length; tt++) {
      const it = a[tt];
      if (it.length !== 2) continue;
      const [x, f] = it, m = _.has(tt);
      let ct = 0, _t = 0;
      const $ = W == null ? void 0 : W.get(tt);
      $ && (ct = $.Mi, _t = $.Mj);
      const M = ((_a = y.areas) == null ? void 0 : _a.get(tt)) ?? 0.16, B = ((_b = y.momentsOfInertiaZ) == null ? void 0 : _b.get(tt)) ?? 213e-5, rt = ys(M, B, m ? at : gt), $t = ct / rt, yt = _t / rt;
      Mt.push({
        nodeIdx: x,
        elementIdx: tt,
        end: "i",
        classification: Le($t)
      }), Mt.push({
        nodeIdx: f,
        elementIdx: tt,
        end: "j",
        classification: Le(yt)
      });
    }
    return Mt;
  }
  function _s(t, a, D, y = {}) {
    const k = y.showElastic ?? false, p = (y.radiusFactor ?? 0.02) * D, _ = [], P = new ls(p, 12, 8);
    for (const N of t) {
      if (!k && N.classification.state === "Elastic") continue;
      const K = a[N.nodeIdx];
      if (!K) continue;
      const j = new ds({
        color: N.classification.color,
        transparent: true,
        opacity: 0.85
      }), U = new Go(P, j);
      U.position.set(K[0], K[1], K[2]), U.userData = {
        hingeState: N.classification.state,
        ratio: N.classification.ratio.toFixed(3),
        element: N.elementIdx,
        end: N.end
      }, _.push(U);
    }
    return _;
  }
  function ws(t) {
    const a = {
      Elastic: 0,
      B: 0,
      IO: 0,
      LS: 0,
      CP: 0
    };
    for (const D of t) a[D.classification.state]++;
    return a;
  }
  const ie = 9.80665;
  function Fe(t, a, D, y, k = 0.01) {
    const p = Math.abs(t) < k, _ = Math.abs(t - D) < k, P = Math.abs(a) < k, N = Math.abs(a - y) < k, K = [
      p,
      _,
      P,
      N
    ].filter(Boolean).length;
    return K >= 2 ? "esquinera" : K === 1 ? "lindero" : "central";
  }
  function Ee(t) {
    const { P_kN: a, Mx_kN: D, My_kN: y, tipo: k, q_adm_tonf: p, ks: _ } = t, P = t.Lz_min ?? 1, N = t.Lz_max ?? 4, K = t.t_min ?? 0.3;
    if (a <= 0) return {
      tipo: k,
      Lz: P,
      Bz: P,
      t: K,
      A: P ** 2,
      ex: 0,
      ey: 0,
      sigmaMax_tonf: 0,
      sigmaMin_tonf: 0,
      ratio: 0,
      fueraKern: false,
      status: "UPLIFT"
    };
    const j = p * ie, U = Math.abs(y / a), at = Math.abs(D / a), gt = j * 0.95;
    let W = Math.max(P, Math.sqrt(a / j)), Mt = W, tt = 1 / 0, it = 0, x = false;
    for (let M = 0; M < 50 && W <= N; M++) {
      const B = k === "esquinera" ? 0.3 : k === "lindero" ? 0.2 : 0, z = W + B, rt = Mt + B, $t = z * rt, yt = Math.max(U, at), O = yt === U ? z : rt;
      if (x = yt > O / 6, !x) tt = a / $t * (1 + 6 * yt / O), it = a / $t * (1 - 6 * yt / O);
      else {
        const q = 1.5 * O - 3 * yt, Et = yt === U ? rt : z;
        tt = 2 * a / (Et * Math.max(q, 0.01)), it = 0;
      }
      if (tt <= gt) break;
      W += 0.05, Mt += 0.05;
    }
    const f = W * Mt, m = Math.max(K, W / 6), ct = tt / j, _t = ct <= 1 ? "OK" : "OVERSTRESS";
    let $;
    return _ && _ > 0 && ($ = tt / _ * 1e3), {
      tipo: k,
      Lz: W,
      Bz: Mt,
      t: m,
      A: f,
      ex: U,
      ey: at,
      sigmaMax_tonf: tt / ie,
      sigmaMin_tonf: it / ie,
      ratio: ct,
      delta_mm: $,
      fueraKern: x,
      status: _t
    };
  }
  function Jo(t, a, D, y, k) {
    return t.map((p) => {
      const _ = Fe(p.x, p.y, a, D);
      return {
        ...Ee({
          P_kN: p.P_kN,
          Mx_kN: p.Mx_kN,
          My_kN: p.My_kN,
          tipo: _,
          q_adm_tonf: y,
          ks: k
        }),
        idx: p.idx,
        x: p.x,
        y: p.y
      };
    });
  }
  let ce, oo, jo, u, J;
  Is = Object.freeze(Object.defineProperty({
    __proto__: null,
    classifyFootingType: Fe,
    designAllFootings: Jo,
    designFooting: Ee
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  ce = 9.81;
  oo = 24 / ce;
  jo = 78 / ce;
  u = (t, a, D, y, k, p) => ({
    default: D,
    min: y,
    max: k,
    step: p,
    label: a,
    folder: t
  });
  J = (t, a, D, y) => ({
    default: D,
    label: a,
    folder: t,
    options: y
  });
  Os = {
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
        ...u("Geometr\xEDa", "Vanos X", 2, 1, 6, 1),
        regenOnChange: true
      },
      nVanosY: {
        ...u("Geometr\xEDa", "Vanos Y", 2, 1, 6, 1),
        regenOnChange: true
      },
      nPisos: {
        ...u("Geometr\xEDa", "N. Pisos", 3, 1, 8, 1),
        regenOnChange: true
      },
      spanX: u("Geometr\xEDa", "Luz X uniforme (m)", 5, 2, 12, 0.5),
      spanY: u("Geometr\xEDa", "Luz Y uniforme (m)", 5, 2, 12, 0.5),
      hPiso: u("Geometr\xEDa", "h piso uniforme (m)", 3, 2, 5, 0.1),
      Lvix: u("Geometr\xEDa", "Voladizo izq X (m)", 0, 0, 3, 0.25),
      Lvdx: u("Geometr\xEDa", "Voladizo der X (m)", 0, 0, 3, 0.25),
      Lviy: u("Geometr\xEDa", "Voladizo izq Y (m)", 0, 0, 3, 0.25),
      Lvdy: u("Geometr\xEDa", "Voladizo der Y (m)", 0, 0, 3, 0.25),
      matCol: J("Secciones (global)", "Material columna", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1,
        "CFT (tubo relleno)": 2,
        "Acero tubo (cotas)": 3
      }),
      tCft: u("Secciones (global)", "t pared CFT (m)", 0.01, 4e-3, 0.03, 1e-3),
      colTf: u("Secciones (global)", "tubo: tf paredes \u2225 b (m)", 0.01, 3e-3, 0.04, 1e-3),
      colTw: u("Secciones (global)", "tubo: tw paredes \u2225 h (m)", 0.01, 3e-3, 0.04, 1e-3),
      matViga: J("Secciones (global)", "Material viga", 0, {
        Hormig\u00F3n: 0,
        "Acero W": 1,
        "Acero perfil I (cotas)": 2
      }),
      vigaTf: u("Secciones (global)", "perfil I: tf ala (m)", 0.012, 3e-3, 0.05, 1e-3),
      vigaTw: u("Secciones (global)", "perfil I: tw alma (m)", 8e-3, 3e-3, 0.03, 1e-3),
      vigSecTf: u("Vigas Secundarias", "perfil I sec: tf ala (m)", 8e-3, 3e-3, 0.04, 1e-3),
      vigSecTw: u("Vigas Secundarias", "perfil I sec: tw alma (m)", 6e-3, 3e-3, 0.03, 1e-3),
      colShape: J("Secciones (global)", "Forma columna", 0, {
        Rectangular: 0,
        Circular: 1
      }),
      fcConcr: u("Secciones (global)", "f'c hormig\xF3n (kg/cm\xB2)", 240, 140, 420, 10),
      fyAcero: u("Secciones (global)", "fy acero (kg/cm\xB2)", 2530, 1800, 4200, 100),
      colSize: u("Secciones (global)", "b\xD7h columna (m)", 0.4, 0.25, 0.8, 0.05),
      vigaB: u("Secciones (global)", "b viga (m)", 0.3, 0.2, 0.6, 0.05),
      vigaH: u("Secciones (global)", "h viga (m)", 0.5, 0.3, 0.9, 0.05),
      nDivBeam: u("Mesh", "Div. Vigas (segmentos)", 1, 1, 8, 1),
      nDivCol: u("Mesh", "Div. Columnas (segmentos)", 1, 1, 8, 1),
      vigSecActivar: {
        ...J("Vigas Secundarias", "Activar", 0, {
          No: 0,
          S\u00ED: 1
        }),
        regenOnChange: true
      },
      vigSecDir: J("Vigas Secundarias", "Corren en", 2, {
        "Auto (lado corto)": 2,
        "X (entre ejes Y)": 0,
        "Y (entre ejes X)": 1
      }),
      vigSecCantidad: u("Vigas Secundarias", "Cantidad/vano", 2, 1, 5, 1),
      vigSecB: u("Vigas Secundarias", "b sec (m)", 0.2, 0.1, 0.4, 0.05),
      vigSecH: u("Vigas Secundarias", "h sec (m)", 0.3, 0.2, 0.6, 0.05),
      losaActivar: {
        ...J("Losas de Piso", "Activar losas", 0, {
          No: 0,
          S\u00ED: 1
        }),
        regenOnChange: true
      },
      losaEspesor: u("Losas de Piso", "Espesor (m)", 0.15, 0.08, 0.4, 0.01),
      losaSubdivX: u("Losas de Piso", "Subdiv. X", 2, 1, 6, 1),
      losaSubdivY: u("Losas de Piso", "Subdiv. Y", 2, 1, 6, 1),
      muroActivar: {
        ...J("Muros de Corte", "Activar", 0, {
          No: 0,
          Perimetrales: 1,
          "Centro X": 2,
          "Centro Y": 3,
          "Doble central": 4
        }),
        regenOnChange: true
      },
      muroEspesor: u("Muros de Corte", "Espesor (m)", 0.2, 0.1, 0.4, 0.01),
      muroSubdivV: u("Muros de Corte", "Subdiv. V (vert)", 2, 1, 6, 1),
      muroSubdivH: u("Muros de Corte", "Subdiv. H (horiz)", 2, 1, 6, 1),
      apoyo: J("Apoyo", "Tipo", 0, {
        Empotrado: 0,
        "Articulado (3 DOFs)": 1,
        "R\xF3tula completa": 2
      }),
      comparar: J("Apoyo", "Comparar con", 1, {
        "ETABS (uni\xF3n viga-muro de ETABS)": 1,
        "SAP2000 (sin sem\xE1nticas)": 0
      }),
      offsets: J("Apoyo", "Brazos r\xEDgidos", 1, {
        "ETABS (autom\xE1ticos: solo peso y masa)": 1,
        "Ninguno (SAP2000)": 0
      }),
      CM: u("Cargas", "CM (kN/nodo)", -5, -30, 0, 0.5),
      CV: u("Cargas", "CV (kN/nodo)", -2, -20, 0, 0.5),
      Ex: u("Cargas", "Ex sismo tope (kN)", 50, 0, 500, 10),
      Ey: u("Cargas", "Ey sismo tope (kN)", 0, 0, 500, 10),
      loadCase: J("Cargas", "Caso de carga", 0, {
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
      modoCimentacion: J("Cimentaci\xF3n", "\u{1F518} Vista (toggle)", 0, {
        "\u{1F3E2} Edificio completo (ver/editar)": 0,
        "\u{1FAA8} Solo cimentaci\xF3n (P,Mx,My)": 1
      }),
      q_adm_zapata: u("Cimentaci\xF3n", "q_adm (tonf/m\xB2)", 10, 1, 100, 1),
      ks_zapata: u("Cimentaci\xF3n", "ks (kN/m\xB3)", 1030, 100, 2e5, 10),
      Hf_pedestal: u("Cimentaci\xF3n", "Df col enterrada (m) (m)", 0.5, 0, 3, 0.05),
      t_zapata: u("Cimentaci\xF3n", "t zapata (m)", 0.3, 0.1, 1.5, 0.05),
      nSubZapata: u("Cimentaci\xF3n", "Subdiv. Q4 zapata", 4, 2, 12, 1),
      voladoExtra: u("Cimentaci\xF3n", "Volado extra esq./lin (m)", 0.3, 0, 1, 0.05),
      tipoZapataOverride: J("Cimentaci\xF3n", "Tipo (override)", 0, {
        "Auto (por posici\xF3n)": 0,
        "Todas central": 1,
        "Todas lindero": 2,
        "Todas esquinera": 3
      }),
      mostrarZapatas: J("Cimentaci\xF3n", "Mostrar zapatas 3D", 0, {
        On: 1,
        Off: 0
      }),
      mostrarLabelsZapatas: J("Cimentaci\xF3n", "Mostrar etiquetas zapatas", 1, {
        On: 1,
        Off: 0
      }),
      estiloZapata: J("Cimentaci\xF3n", "Estilo render", 1, {
        "S\xF3lido (caja transl\xFAcida)": 0,
        "Shellthick (Q4 + grilla)": 1
      }),
      sistemaCimentacion: J("Cimentaci\xF3n", "Sistema cim.", 0, {
        "Zapatas aisladas": 0,
        "Zapatas + vigas de amarre": 1,
        "Vigas T invertida (corrida)": 2,
        "Vigas rect. + zapata corrida": 3,
        "Losa de cimentaci\xF3n (raft)": 4
      }),
      vigaAmarre_pos: J("Cimentaci\xF3n", "Viga amarre \u2014 posici\xF3n", 0, {
        "Unida a zapatas (z=-Hf)": 0,
        "Conectada a pedestales (-Hf/2)": 1
      }),
      vigaAmarre_h: u("Cimentaci\xF3n", "Viga amarre h (m)", 0.4, 0.2, 1, 0.05),
      vigaAmarre_b: u("Cimentaci\xF3n", "Viga amarre b (m)", 0.25, 0.15, 0.6, 0.05),
      vigaCim_h: u("Cimentaci\xF3n", "Viga cim. h (m)", 0.8, 0.3, 2, 0.05),
      vigaCim_bw: u("Cimentaci\xF3n", "Viga cim. b alma (m)", 0.4, 0.2, 1, 0.05),
      vigaCim_bf: u("Cimentaci\xF3n", "Viga cim. b ala (m)", 1.2, 0.4, 3, 0.1),
      vigaCim_tf: u("Cimentaci\xF3n", "Viga cim. e ala (m)", 0.3, 0.1, 0.8, 0.05),
      nSubViga: u("Avanzado", "Div. vigas", 1, 1, 6, 1),
      nSubCol: u("Avanzado", "Div. columnas", 1, 1, 4, 1),
      vSecOn: J("Avanzado", "Vigas secundarias", 0, {
        Off: 0,
        On: 1
      }),
      nVSec: u("Avanzado", "N\xB0 vigas sec. por vano", 2, 1, 5, 1),
      vSecDir: J("Avanzado", "Dir secundarias", 2, {
        "Auto (lado corto)": 2,
        X: 0,
        Y: 1
      }),
      bracesMode: J("Avanzado", "Diagonales", 0, {
        ninguna: 0,
        perimetrales: 1,
        todas: 2,
        "solo X": 3,
        "solo Y": 4
      }),
      slabOn: J("Avanzado", "Losa", 0, {
        Off: 0,
        On: 1
      }),
      slabForm: J("Avanzado", "Formulaci\xF3n losa", 1, {
        "Thin (ETABS)": 1,
        Thick: 0
      }),
      slabT: u("Avanzado", "t losa (m)", 0.15, 0.08, 0.3, 0.01),
      murosMode: J("Avanzado", "Muros de corte (c\xE1scara)", 0, {
        ninguno: 0,
        "en X (fachadas Y)": 1,
        "en Y (fachadas X)": 2,
        "en X e Y": 3
      }),
      tMuro: u("Avanzado", "t muro (m)", 0.25, 0.15, 0.6, 0.05),
      slabType: J("Avanzado", "Tipo losa (ETABS)", 0, {
        "Shell (membrane+plate)": 0,
        "Membrane only": 1,
        "Plate only": 2
      }),
      slabDisc: J("Avanzado", "Discretizaci\xF3n losa", 0.5, ps),
      diafragmaRigido: J("Avanzado", "Diafragma r\xEDgido", 0, {
        Flexible: 0,
        "R\xEDgido (ASCE 7-22)": 1
      }),
      diafragmaNudos: J("Avanzado", "Diafragma: nudos atados", 1, {
        ninguno: 0,
        "ejes de columna (POINT D1, SAP2000)": 1,
        "toda la losa (AREA D1, ETABS)": 2
      }),
      massSource: J("Avanzado", "Mass Source", 0, {
        "Self-weight (peso propio)": 0,
        "From Loads (DEAD+0.25\xB7LIVE) ETABS": 1
      }),
      qDead: u("Avanzado", "qDead losa (kN/m\xB2)", 3.5, 0.5, 10, 0.5),
      qLive: u("Avanzado", "qLive losa (kN/m\xB2)", 1.5, 0, 6, 0.5),
      crackedSections: J("Avanzado", "Cracked Sections (ACI 318)", 0, {
        "Off (secci\xF3n bruta Ig)": 0,
        "On: 0.7\xB7Ig col / 0.35\xB7Ig viga / 0.25\xB7Ig losa": 1
      })
    },
    dynamicParams(t) {
      const a = {}, D = Math.round(t.nPisos ?? 3), y = Math.round(t.nVanosX ?? 2), k = Math.round(t.nVanosY ?? 2);
      for (let p = 1; p <= D; p++) a[`hP_${p}`] = u("Alturas por piso", `h Piso ${p} (m) \xB7 0 = usa la uniforme`, 0, 0, 6, 0.1), a[`colB_p${p}`] = u("Secciones por piso", `b col P${p} (m) \xB7 0 = usa la global`, 0, 0, 1, 0.05), a[`colH_p${p}`] = u("Secciones por piso", `h col P${p} (m) \xB7 0 = usa la global`, 0, 0, 1, 0.05), a[`vigaB_p${p}`] = u("Secciones por piso", `b viga P${p} (m) \xB7 0 = usa la global`, 0, 0, 0.8, 0.05), a[`vigaH_p${p}`] = u("Secciones por piso", `h viga P${p} (m) \xB7 0 = usa la global`, 0, 0, 1, 0.05);
      for (let p = 1; p <= y; p++) a[`svX_${p}`] = u("Luces por vano", `Luz X vano ${p} (m) \xB7 0 = usa la uniforme`, 0, 0, 12, 0.5);
      for (let p = 1; p <= k; p++) a[`svY_${p}`] = u("Luces por vano", `Luz Y vano ${p} (m) \xB7 0 = usa la uniforme`, 0, 0, 12, 0.5);
      return a;
    },
    computedLabels(t, a) {
      var _a;
      const y = (_a = a.deformOutputs.rawVal) == null ? void 0 : _a.reactions, k = a.nodes.rawVal;
      if (!y || !(k == null ? void 0 : k.length)) return {
        "Reacciones (\u2192 zapatas)": "\u2014"
      };
      let p = 0, _ = 0, P = 0, N = -1, K = 0, j = -1;
      const U = [];
      let at = 0, gt = 0;
      y.forEach((ct, _t) => {
        const $ = k[_t];
        if (!$ || Math.abs($[2]) > 1e-6) return;
        const M = ct[2], B = ct[3], z = ct[4];
        Math.abs(M) > Math.abs(p) && (p = M, N = _t, $[0], $[1]), M > 0 && M > Math.abs(K) && (K = M, j = _t), Math.abs(B) > Math.abs(_) && (_ = B), Math.abs(z) > Math.abs(P) && (P = z), U.push({
          idx: _t,
          x: $[0],
          y: $[1],
          P_kN: Math.abs(M),
          Mx_kN: B,
          My_kN: z
        }), $[0] > at && (at = $[0]), $[1] > gt && (gt = $[1]);
      });
      const W = Math.abs(p) / 9.80665, Mt = Math.abs(_) / 9.80665, tt = Math.abs(P) / 9.80665, it = K / 9.80665, x = Math.round(t.nPisos), f = {
        "\u2500\u2500 Reacciones m\xE1x (\u2192 zapatas) \u2500\u2500": "",
        "P (compresi\xF3n)": `${W.toFixed(2)} tonf (nodo ${N})`,
        Mx: `${Mt.toFixed(2)} tonf\xB7m`,
        My: `${tt.toFixed(2)} tonf\xB7m`
      };
      if (it > 0.01 && (f["\u26A0 Uplift"] = `${it.toFixed(2)} tonf (nodo ${j})`), f.Pisos = `${x}`, f["Copiar a \u2192 zapata-aislada"] = `P=${W.toFixed(1)}, Mx=${Mt.toFixed(1)}, My=${tt.toFixed(1)}`, U.length > 0 && at > 0 && gt > 0) {
        const ct = t.q_adm_zapata ?? 10, _t = t.ks_zapata ?? 1030;
        try {
          const $ = Jo(U, at, gt, ct, _t);
          let M = 0, B = 0, z = 0, rt = 0, $t = -1, yt = "", O = 0, q = 0;
          for (const pt of $) pt.tipo === "esquinera" ? M++ : pt.tipo === "lindero" ? B++ : z++, pt.sigmaMax_tonf > rt && (rt = pt.sigmaMax_tonf, $t = pt.idx, yt = pt.tipo), pt.status === "OK" && O++, pt.Lz > q && (q = pt.Lz);
          f["\u2500\u2500 Cimentaci\xF3n (auto) \u2500\u2500"] = "", f["Tipos zapata"] = `${M} esquineras, ${B} linderas, ${z} centrales`, f["\u03C3_max global"] = `${rt.toFixed(2)} tonf/m\xB2 (nodo ${$t}, ${yt})`, f["\u03C3/q_adm"] = `${(rt / ct).toFixed(2)}` + (rt / ct <= 1 ? " \u2713" : " \u26A0"), f["Lz m\xE1x zapata"] = `${q.toFixed(2)} m`, f.Cumplen = `${O}/${$.length}` + (O === $.length ? " \u2713" : " \u26A0");
          const Et = t.Hf_pedestal ?? 0.5, eo = t.t_zapata ?? 0.3, ut = Math.round(t.nSubZapata ?? 4);
          f["Df col enterrada"] = `${Et.toFixed(2)} m` + (Et < 1e-3 ? " (sin pedestal)" : ""), f["t zapata"] = `${eo.toFixed(2)} m`, f["Subdiv. Q4"] = `${ut}\xD7${ut}`, f["Volado extra"] = `${(t.voladoExtra ?? 0.3).toFixed(2)} m`;
        } catch {
          f["\u2500\u2500 Cimentaci\xF3n \u2500\u2500"] = "module load error";
        }
      }
      const m = a.__plasticHinges;
      if (m) {
        const ct = (m.B ?? 0) + (m.IO ?? 0) + (m.LS ?? 0) + (m.CP ?? 0);
        f["\u2500\u2500 R\xF3tulas pl\xE1sticas (ASCE 41-17) \u2500\u2500"] = "", f["\u{1F7E2} El\xE1stico"] = `${m.Elastic ?? 0}`, f["\u{1F7E1} B \u2014 Yield"] = `${m.B ?? 0}`, f["\u{1F7E0} IO \u2014 Immed.Occ."] = `${m.IO ?? 0}`, f["\u{1F534} LS \u2014 Life Safety"] = `${m.LS ?? 0}`, f["\u26AB CP \u2014 Collapse Prev."] = `${m.CP ?? 0}`, f["Total r\xF3tulas formadas"] = `${ct}`;
      }
      return f;
    },
    build(t, a) {
      var _a, _b;
      const D = Math.round(t.nVanosX), y = Math.round(t.nVanosY), k = Math.round(t.nPisos), p = Math.max(1, Math.round(t.nSubViga)), _ = Math.max(1, Math.round(t.nSubCol)), P = t.fcConcr * 0.0981, N = gs(P), K = 2e8, j = 0.2, U = 0.3, at = N / (2 * (1 + j)), gt = K / (2 * (1 + U)), W = (o, s, e) => Array.from({
        length: s
      }, (i, n) => {
        const h = t[`${o}${n + 1}`];
        return typeof h == "number" && h > 0 ? h : e;
      }), Mt = W("svX_", D, t.spanX), tt = W("svY_", y, t.spanY), it = W("hP_", k, t.hPiso), x = [];
      t.Lvix > 0 && x.push(-t.Lvix), x.push(0);
      for (let o = 0; o < D; o++) x.push(x[x.length - 1] + Mt[o]);
      t.Lvdx > 0 && x.push(x[x.length - 1] + t.Lvdx);
      const f = [];
      t.Lviy > 0 && f.push(-t.Lviy), f.push(0);
      for (let o = 0; o < y; o++) f.push(f[f.length - 1] + tt[o]);
      t.Lvdy > 0 && f.push(f[f.length - 1] + t.Lvdy);
      const m = [
        0
      ];
      for (let o = 0; o < k; o++) m.push(m[m.length - 1] + it[o]);
      const ct = (o) => t.Lvix > 0 && o === 0 || t.Lvdx > 0 && o === x.length - 1, _t = (o) => t.Lviy > 0 && o === 0 || t.Lvdy > 0 && o === f.length - 1, $ = (o, s) => ct(o) || _t(s), M = [], B = {};
      for (let o = 0; o < m.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < x.length; e++) o === 0 && $(e, s) || (B[`${e},${s},${o}`] = M.length, M.push([
        x[e],
        f[s],
        m[o]
      ]));
      const z = [], rt = /* @__PURE__ */ new Set(), $t = /* @__PURE__ */ new Set(), yt = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Set(), q = /* @__PURE__ */ new Map(), Et = (o, s, e, i, n) => {
        if (e <= 1) {
          i.add(z.length), q.set(z.length, n), z.push([
            o,
            s
          ]);
          return;
        }
        const h = M[o], l = M[s];
        let d = o;
        for (let g = 1; g < e; g++) {
          const c = g / e, w = M.length;
          M.push([
            h[0] + (l[0] - h[0]) * c,
            h[1] + (l[1] - h[1]) * c,
            h[2] + (l[2] - h[2]) * c
          ]), i.add(z.length), q.set(z.length, n), z.push([
            d,
            w
          ]), d = w;
        }
        i.add(z.length), q.set(z.length, n), z.push([
          d,
          s
        ]);
      }, eo = (o) => {
        const s = M[o];
        for (let e = z.length - 1; e >= 0; e--) {
          const i = z[e];
          if (i.length !== 2) continue;
          const [n, h] = i;
          if (n === o || h === o) continue;
          const l = M[n], d = M[h], g = [
            d[0] - l[0],
            d[1] - l[1],
            d[2] - l[2]
          ], c = [
            s[0] - l[0],
            s[1] - l[1],
            s[2] - l[2]
          ], w = g[0] ** 2 + g[1] ** 2 + g[2] ** 2;
          if (w < 1e-12) continue;
          const Y = (c[0] * g[0] + c[1] * g[1] + c[2] * g[2]) / w;
          if (Y < 1e-6 || Y > 1 - 1e-6 || Math.hypot(c[0] - Y * g[0], c[1] - Y * g[1], c[2] - Y * g[2]) > 1e-6) continue;
          z[e] = [
            n,
            o
          ];
          const T = z.length;
          z.push([
            o,
            h
          ]), $t.has(e) && $t.add(T), yt.has(e) && yt.add(T), rt.has(e) && rt.add(T), q.has(e) && q.set(T, q.get(e));
        }
      };
      for (let o = 0; o < m.length - 1; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < x.length; e++) $(e, s) || Et(B[`${e},${s},${o}`], B[`${e},${s},${o + 1}`], _, rt, o);
      for (let o = 1; o < m.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < x.length - 1; e++) Et(B[`${e},${s},${o}`], B[`${e + 1},${s},${o}`], p, $t, o - 1);
      for (let o = 1; o < m.length; o++) for (let s = 0; s < x.length; s++) for (let e = 0; e < f.length - 1; e++) Et(B[`${s},${e},${o}`], B[`${s},${e + 1},${o}`], p, $t, o - 1);
      if (t.vSecOn >= 0.5 && t.nVSec >= 1) {
        const o = Math.round(t.nVSec), s = (i, n, h) => {
          for (let d = 0; d < M.length; d++) if (Math.abs(M[d][0] - i) < 1e-6 && Math.abs(M[d][1] - n) < 1e-6 && Math.abs(M[d][2] - h) < 1e-6) return d;
          const l = M.length;
          return M.push([
            i,
            n,
            h
          ]), eo(l), l;
        }, e = (i, n) => t.vSecDir < 0.5 ? "x" : t.vSecDir < 1.5 ? "y" : x[i + 1] - x[i] <= f[n + 1] - f[n] ? "x" : "y";
        for (let i = 1; i < m.length; i++) for (let n = 0; n < x.length - 1; n++) for (let h = 0; h < f.length - 1; h++) {
          const l = x[n], d = x[n + 1], g = f[h], c = f[h + 1];
          for (let w = 1; w <= o; w++) {
            const Y = w / (o + 1), [T, lt] = e(n, h) === "x" ? [
              s(l, g + Y * (c - g), m[i]),
              s(d, g + Y * (c - g), m[i])
            ] : [
              s(l + Y * (d - l), g, m[i]),
              s(l + Y * (d - l), c, m[i])
            ];
            $t.add(z.length), yt.add(z.length), z.push([
              T,
              lt
            ]);
          }
        }
      }
      const ut = Math.round(t.bracesMode);
      if (ut > 0) {
        const o = ut === 1 || ut === 2 || ut === 3, s = ut === 1 || ut === 2 || ut === 4, e = m.length - 1;
        for (let i = 0; i < e; i++) {
          if (o) for (let n = 0; n < f.length; n++) {
            if (ut === 1 && n !== 0 && n !== f.length - 1) continue;
            const h = Math.floor((x.length - 1) / 2);
            for (let l = 0; l < x.length - 1; l++) {
              if (ut === 1 && l !== h || $(l, n) || $(l + 1, n)) continue;
              const d = B[`${l},${n},${i}`], g = B[`${l + 1},${n},${i + 1}`], c = B[`${l + 1},${n},${i}`], w = B[`${l},${n},${i + 1}`];
              d !== void 0 && g !== void 0 && z.push([
                d,
                g
              ]), c !== void 0 && w !== void 0 && z.push([
                c,
                w
              ]);
            }
          }
          if (s) for (let n = 0; n < x.length; n++) {
            if (ut === 1 && n !== 0 && n !== x.length - 1) continue;
            const h = Math.floor((f.length - 1) / 2);
            for (let l = 0; l < f.length - 1; l++) {
              if (ut === 1 && l !== h || $(n, l) || $(n, l + 1)) continue;
              const d = B[`${n},${l},${i}`], g = B[`${n},${l + 1},${i + 1}`], c = B[`${n},${l + 1},${i}`], w = B[`${n},${l},${i + 1}`];
              d !== void 0 && g !== void 0 && z.push([
                d,
                g
              ]), c !== void 0 && w !== void 0 && z.push([
                c,
                w
              ]);
            }
          }
        }
      }
      const pt = /* @__PURE__ */ new Map(), Gt = (o, s, e) => `${Math.round(o * 1e4)},${Math.round(s * 1e4)},${Math.round(e * 1e4)}`;
      for (let o = 0; o < M.length; o++) pt.set(Gt(M[o][0], M[o][1], M[o][2]), o);
      const Jt = t.slabDisc > 0 ? t.slabDisc : 0.5;
      if (t.slabOn >= 0.5) for (let o = 1; o < m.length; o++) {
        const s = m[o];
        for (let e = 0; e < x.length - 1; e++) for (let i = 0; i < f.length - 1; i++) {
          const n = x[e], h = x[e + 1], l = f[i], d = f[i + 1], { n: g } = ko(Math.abs(h - n), Jt), { n: c } = ko(Math.abs(d - l), Jt), w = [];
          for (let Y = 0; Y <= c; Y++) {
            const T = [];
            for (let lt = 0; lt <= g; lt++) {
              const X = n + lt / g * (h - n), wt = l + Y / c * (d - l), xt = Gt(X, wt, s), St = pt.get(xt);
              if (St !== void 0) T.push(St);
              else {
                const kt = M.length;
                M.push([
                  X,
                  wt,
                  s
                ]), pt.set(xt, kt), T.push(kt), eo(kt);
              }
            }
            w.push(T);
          }
          for (let Y = 0; Y < c; Y++) for (let T = 0; T < g; T++) O.add(z.length), z.push([
            w[Y][T],
            w[Y][T + 1],
            w[Y + 1][T + 1],
            w[Y + 1][T]
          ]);
        }
      }
      const go = /* @__PURE__ */ new Set(), Mo = [], lo = Math.round(t.murosMode ?? 0);
      if (lo > 0) {
        const o = lo === 1 || lo === 3, s = lo === 2 || lo === 3, e = (g, c, w) => {
          const Y = Gt(g, c, w), T = pt.get(Y);
          if (T !== void 0) return T;
          const lt = M.length;
          return M.push([
            g,
            c,
            w
          ]), pt.set(Y, lt), eo(lt), lt;
        }, i = (g, c, w, Y, T, lt, X, wt) => {
          const xt = [];
          for (let St = 0; St <= wt; St++) {
            const kt = [];
            for (let yo = 0; yo <= X; yo++) kt.push(e(g + yo / X * (w - g), c + yo / X * (Y - c), T + St / wt * (lt - T)));
            xt.push(kt);
          }
          for (let St = 0; St < wt; St++) for (let kt = 0; kt < X; kt++) go.add(z.length), z.push([
            xt[St][kt],
            xt[St][kt + 1],
            xt[St + 1][kt + 1],
            xt[St + 1][kt]
          ]);
          Math.abs(T) < 1e-9 && Mo.push(...xt[0]);
        }, n = t.Lvix > 0 ? 1 : 0, h = t.Lviy > 0 ? 1 : 0, l = x.length - 1 - (t.Lvdx > 0 ? 1 : 0), d = f.length - 1 - (t.Lvdy > 0 ? 1 : 0);
        for (let g = 0; g < m.length - 1; g++) {
          const c = m[g], w = m[g + 1], Y = ko(w - c, Jt).n, T = Math.ceil(Y / _) * _;
          if (o && l > n) {
            const lt = x[n], X = x[n + 1], wt = ko(X - lt, Jt).n;
            for (const xt of /* @__PURE__ */ new Set([
              h,
              d
            ])) i(lt, f[xt], X, f[xt], c, w, wt, T);
          }
          if (s && d > h) {
            const lt = f[h], X = f[h + 1], wt = ko(X - lt, Jt).n;
            for (const xt of /* @__PURE__ */ new Set([
              n,
              l
            ])) i(x[xt], lt, x[xt], X, c, w, wt, T);
          }
        }
      }
      const Io = Math.round(t.apoyo), Oo = Io === 0 ? [
        true,
        true,
        true,
        true,
        true,
        true
      ] : Io === 1 ? [
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
      ], Ko = /* @__PURE__ */ new Map();
      for (let o = 0; o < f.length; o++) for (let s = 0; s < x.length; s++) $(s, o) || Ko.set(B[`${s},${o},0`], [
        ...Oo
      ]);
      for (const o of Mo) Ko.set(o, [
        ...Oo
      ]);
      const Pt = Math.round(t.loadCase ?? 0), Pe = Pt === 1 ? [
        1,
        1,
        0,
        0
      ] : Pt === 2 ? [
        1,
        0,
        0,
        0
      ] : Pt === 3 ? [
        0,
        1,
        0,
        0
      ] : Pt === 4 ? [
        0,
        0,
        1,
        0
      ] : Pt === 5 ? [
        0,
        0,
        0,
        1
      ] : Pt === 6 ? [
        0,
        0,
        1,
        1
      ] : Pt === 7 ? [
        1.2,
        1.6,
        0,
        0
      ] : Pt === 8 ? [
        1.2,
        1,
        1,
        0
      ] : Pt === 9 ? [
        1.2,
        1,
        0,
        1
      ] : Pt === 10 ? [
        1.2,
        1,
        -1,
        0
      ] : Pt === 11 ? [
        1.2,
        1,
        0,
        -1
      ] : Pt === 12 ? [
        0.9,
        0,
        1,
        0
      ] : Pt === 13 ? [
        0.9,
        0,
        0,
        1
      ] : [
        1,
        1,
        1,
        1
      ], [Ve, Te, Ne, Be] = Pe, Lo = /* @__PURE__ */ new Map(), re = Ve * t.CM + Te * t.CV;
      if (re !== 0) for (let o = 1; o < m.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < x.length; e++) {
        const i = `${e},${s},${o}`;
        B[i] !== void 0 && Lo.set(B[i], [
          0,
          0,
          re,
          0,
          0,
          0
        ]);
      }
      const le = Ne * t.Ex, de = Be * t.Ey;
      if (le !== 0 || de !== 0) {
        const o = B[`${x.length - 1 - (t.Lvdx > 0 ? 1 : 0)},${t.Lviy > 0 ? 1 : 0},${k}`];
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
            s[0] + le,
            s[1] + de,
            s[2],
            s[3],
            s[4],
            s[5]
          ]);
        }
      }
      const Uo = [
        t.colB_1,
        t.colB_2,
        t.colB_3,
        t.colB_4,
        t.colB_5,
        t.colB_6,
        t.colB_7,
        t.colB_8
      ].map((o) => o > 0 ? o : t.colSize), Qo = [
        t.colH_1,
        t.colH_2,
        t.colH_3,
        t.colH_4,
        t.colH_5,
        t.colH_6,
        t.colH_7,
        t.colH_8
      ].map((o) => o > 0 ? o : t.colSize), fe = [
        t.vigaB_1,
        t.vigaB_2,
        t.vigaB_3,
        t.vigaB_4,
        t.vigaB_5,
        t.vigaB_6,
        t.vigaB_7,
        t.vigaB_8
      ].map((o) => o > 0 ? o : t.vigaB), he = [
        t.vigaH_1,
        t.vigaH_2,
        t.vigaH_3,
        t.vigaH_4,
        t.vigaH_5,
        t.vigaH_6,
        t.vigaH_7,
        t.vigaH_8
      ].map((o) => o > 0 ? o : t.vigaH), Fo = Math.round(t.matCol) === 2, Wo = Math.round(t.matCol) === 3, te = Math.round(t.matViga) === 2, me = (o) => {
        const s = Uo[o] ?? t.colSize, e = Qo[o] ?? t.colSize;
        if (Fo) {
          const i = Math.min(t.tCft, Math.min(s, e) / 2 - 1e-3), n = as(s, e, i, K, U, N, j);
          return {
            A: n.A,
            Iz: n.Iz,
            Iy: n.Iy,
            J: n.J,
            As2: n.As2,
            As3: n.As3,
            b: s,
            h: e,
            t: i
          };
        }
        if (Wo) {
          const i = Math.min(t.colTf ?? 0.01, e / 2 - 1e-3), n = Math.min(t.colTw ?? 0.01, s / 2 - 1e-3), h = is(s, e, i, n);
          return {
            A: h.A,
            Iz: h.Iz,
            Iy: h.Iy,
            J: h.J,
            As2: h.As2,
            As3: h.As3,
            b: s,
            h: e,
            t: n,
            tf: i,
            tw: n
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
      }, De = (o, s = false) => {
        if (te) {
          const n = s ? t.vigSecH ?? 0.3 : he[o] ?? t.vigaH, h = s ? t.vigSecB ?? 0.2 : fe[o] ?? t.vigaB, l = Math.min(s ? t.vigSecTf ?? 8e-3 : t.vigaTf ?? 0.012, n / 2 - 1e-3), d = Math.min(s ? t.vigSecTw ?? 6e-3 : t.vigaTw ?? 8e-3, h - 1e-3), g = cs(n, h, l, d);
          return {
            A: g.A,
            Iy: g.Iz,
            Iz: g.Iy,
            J: g.J,
            As2: g.As2,
            As3: g.As3,
            d: n,
            bf: h,
            tf: l,
            tw: d
          };
        }
        const e = fe[o] ?? t.vigaB, i = he[o] ?? t.vigaH;
        return {
          A: e * i,
          Iy: e * i ** 3 / 12,
          Iz: i * e ** 3 / 12,
          J: 0.21 * Math.pow(Math.min(e, i), 3) * Math.max(e, i)
        };
      }, Ye = t.matCol < 0.5 ? N : K, He = t.matCol < 0.5 ? at : gt, qe = t.matCol < 0.5 ? j : U, Re = t.matCol < 0.5 ? oo : jo, Xe = t.matViga < 0.5 ? N : K, Ze = t.matViga < 0.5 ? at : gt, je = t.matViga < 0.5 ? j : U, Ge = t.matViga < 0.5 ? oo : jo, po = /* @__PURE__ */ new Map(), xo = /* @__PURE__ */ new Map(), Eo = /* @__PURE__ */ new Map(), Po = /* @__PURE__ */ new Map(), Vo = /* @__PURE__ */ new Map(), To = /* @__PURE__ */ new Map(), vo = /* @__PURE__ */ new Map(), zo = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), No = /* @__PURE__ */ new Map(), Bo = /* @__PURE__ */ new Map(), Do = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), pe = Math.round(t.slabType), Je = pe === 2 ? 0 : 1, Ke = pe === 1 ? 0 : 1, Yo = t.crackedSections > 0.5, xe = t.matCol < 0.5 && Yo ? 0.7 : 1, ve = t.matViga < 0.5 && Yo ? 0.35 : 1, Ue = Yo ? 0.25 : 1, Qe = 1, Ho = t.massSource > 0.5, We = t.qDead + 0.25 * t.qLive, ts = Ho ? We / ce / Math.max(t.slabT, 0.05) : oo, ee = /* @__PURE__ */ new Map();
      for (const o of rt) for (const s of z[o]) ee.set(s, q.get(o) ?? 0);
      const os = (o) => {
        if (Math.round(t.offsets ?? 1) !== 1) return 1;
        const [s, e] = z[o], i = Math.abs(M[e][0] - M[s][0]), n = Math.abs(M[e][1] - M[s][1]), h = Math.hypot(i, n, M[e][2] - M[s][2]), l = i >= n, d = (g) => {
          if (!ee.has(g)) return 0;
          const c = me(Math.min(ee.get(g), 7));
          return (l ? c.b : c.h) / 2;
        };
        return h > 1e-9 ? Math.max(0, h - d(s) - d(e)) / h : 1;
      };
      for (let o = 0; o < z.length; o++) {
        const s = q.get(o) ?? 0;
        if (O.has(o)) po.set(o, N), xo.set(o, at), zo.set(o, j), oe.set(o, t.slabT), ge.set(o, Je * Qe), Me.set(o, Ke * Ue), ue.set(o, Math.round(t.slabForm ?? 1)), vo.set(o, ts);
        else if (go.has(o)) po.set(o, N), xo.set(o, at), zo.set(o, j), oe.set(o, t.tMuro ?? 0.25), vo.set(o, Ho ? 0 : oo);
        else if (rt.has(o)) {
          const e = me(Math.min(s, 7));
          po.set(o, Ye), xo.set(o, He), zo.set(o, qe), Eo.set(o, e.A), Po.set(o, e.Iz * xe), Vo.set(o, e.Iy * xe), To.set(o, e.J), Wo && (Bo.set(o, e.As2), No.set(o, e.As3), Do.set(o, {
            type: "HSS",
            b: e.b,
            h: e.h,
            tf: e.tf,
            tw: e.tw,
            name: `TUBO${Math.round(e.h * 1e3)}X${Math.round(e.b * 1e3)}X${Math.round(e.tf * 1e3)}X${Math.round(e.tw * 1e3)}`
          })), Fo && (Bo.set(o, e.As2), No.set(o, e.As3), Do.set(o, {
            type: "CFT",
            b: e.b,
            h: e.h,
            tw: e.t,
            tf: e.t,
            fillE: N,
            fillRho: oo,
            steelRho: jo,
            d: 0
          }));
          const i = Fo ? (jo * (e.b * e.h - (e.b - 2 * e.t) * (e.h - 2 * e.t)) + oo * (e.b - 2 * e.t) * (e.h - 2 * e.t)) / e.A : Re;
          vo.set(o, Ho ? 0 : i);
        } else {
          const e = De(Math.min(s, 7), yt.has(o));
          if (po.set(o, Xe), xo.set(o, Ze), zo.set(o, je), Eo.set(o, e.A), Po.set(o, e.Iz * ve), Vo.set(o, e.Iy * ve), To.set(o, e.J), te) {
            Bo.set(o, e.As2), No.set(o, e.As3);
            const i = (n) => Math.round(n * 1e4) / 10;
            Do.set(o, {
              type: "I",
              h: e.d,
              b: e.bf,
              tf: e.tf,
              tw: e.tw,
              t2b: e.bf,
              tfb: e.tf,
              name: `I${i(e.d)}X${i(e.bf)}X${i(e.tf)}X${i(e.tw)}`
            });
          }
          vo.set(o, Ho ? 0 : Ge * os(o));
        }
      }
      if (t.diafragmaRigido >= 0.5) {
        const o = [];
        for (let n = 1; n < m.length; n++) o.push(m[n]);
        const s = xs(M, o), e = z.length;
        for (const n of s.masterNodes) M.push([
          n.x,
          n.y,
          n.z
        ]);
        for (const n of s.rigidLinks) z.push(n);
        vs(s, {
          elasticities: po,
          shearModuli: xo,
          areas: Eo,
          momentsOfInertiaY: Po,
          momentsOfInertiaZ: Vo,
          torsionalConstants: To,
          densities: vo
        }, e);
      }
      a.nodes.val = M, a.elements.val = z;
      const qo = /* @__PURE__ */ new Map(), ye = Math.round(t.diafragmaNudos ?? 1);
      if (t.slabOn >= 0.5 && ye === 1) for (let o = 1; o < m.length; o++) for (let s = 0; s < f.length; s++) for (let e = 0; e < x.length; e++) {
        const i = B[`${e},${s},${o}`];
        i !== void 0 && qo.set(i, o);
      }
      if (t.slabOn >= 0.5 && ye === 2) for (let o = 1; o < m.length; o++) {
        const s = m[o];
        M.forEach((e, i) => {
          Math.abs(e[2] - s) < 1e-6 && qo.set(i, o);
        });
      }
      a.nodeInputs.val = {
        supports: Ko,
        loads: Lo,
        ...qo.size ? {
          diaphragms: qo
        } : {}
      }, a.elementInputs.val = {
        etabsWallJoint: Math.round(t.comparar ?? 1) === 1,
        elasticities: po,
        shearModuli: xo,
        areas: Eo,
        momentsOfInertiaY: Po,
        momentsOfInertiaZ: Vo,
        torsionalConstants: To,
        densities: vo,
        poissonsRatios: zo,
        thicknesses: oe,
        membraneModifiers: ge,
        bendingModifiers: Me,
        plateFormulations: ue,
        ...Fo || Wo || te ? {
          shearAreasY: No,
          shearAreasZ: Bo,
          sectionShapes: Do
        } : {}
      };
      const be = Ie(M, z, a.nodeInputs.val, a.elementInputs.val);
      a.deformOutputs.val = be, a.analyzeOutputs.val = ss(M, z, a.elementInputs.val, be);
      const se = rs(x, f, m);
      try {
        const o = bs(M, z, a.analyzeOutputs.rawVal, a.elementInputs.rawVal, Math.round(t.matCol), Math.round(t.matViga), rt);
        let s = 1 / 0, e = 1 / 0, i = 1 / 0, n = -1 / 0, h = -1 / 0, l = -1 / 0;
        for (const c of M) c[0] < s && (s = c[0]), c[0] > n && (n = c[0]), c[1] < e && (e = c[1]), c[1] > h && (h = c[1]), c[2] < i && (i = c[2]), c[2] > l && (l = c[2]);
        const d = Math.sqrt((n - s) ** 2 + (h - e) ** 2 + (l - i) ** 2) || 1, g = _s(o, M, d, {
          showElastic: false,
          radiusFactor: 0.015
        });
        se.push(...g), a.__plasticHinges = ws(o);
      } catch (o) {
        console.warn("[Plastic Hinges]", o);
      }
      if ((t.mostrarZapatas ?? 1) >= 0.5) try {
        const o = (_a = a.deformOutputs.rawVal) == null ? void 0 : _a.reactions;
        if (o) {
          const s = [];
          let e = 0, i = 0;
          if (o.forEach((n, h) => {
            const l = M[h];
            !l || Math.abs(l[2]) > 1e-6 || (s.push({
              idx: h,
              x: l[0],
              y: l[1],
              P_kN: Math.abs(n[2]),
              Mx_kN: n[3],
              My_kN: n[4]
            }), l[0] > e && (e = l[0]), l[1] > i && (i = l[1]));
          }), s.length > 0) {
            const n = t.q_adm_zapata ?? 10, h = t.ks_zapata ?? 1030, l = Math.max(0, t.Hf_pedestal ?? 0.5), d = Math.max(0.1, t.t_zapata ?? 0.3), g = Math.max(2, Math.round(t.nSubZapata ?? 4)), c = Math.max(0, t.voladoExtra ?? 0.3), w = Math.round(t.tipoZapataOverride ?? 0) | 0, Y = Math.round(t.estiloZapata ?? 1), T = Jo(s, e, i, n, h), lt = [
              "central",
              "lindero",
              "esquinera"
            ];
            for (const F of T) w > 0 && (F.tipo = lt[w - 1]), F.t = d;
            const X = [], wt = (F) => new ae({
              color: F,
              transparent: true,
              opacity: 0.55,
              roughness: 0.7
            }), xt = new jt({
              color: 0,
              linewidth: 2
            }), St = new jt({
              color: 2236962,
              linewidth: 1,
              transparent: true,
              opacity: 0.5
            }), kt = new ae({
              color: 10265519,
              transparent: true,
              opacity: 0.75,
              roughness: 0.5
            }), yo = new jt({
              color: 1118481,
              linewidth: 2
            }), _e = Uo[0] ?? t.colSize, we = Qo[0] ?? t.colSize;
            for (const F of T) {
              const Z = F.Lz, st = F.Bz, Zt = F.t;
              let qt = 0, Rt = 0;
              F.tipo === "esquinera" ? (qt = F.x < e / 2 ? -(Z / 2 - c) : Z / 2 - c, Rt = F.y < i / 2 ? -(st / 2 - c) : st / 2 - c) : F.tipo === "lindero" && (Math.abs(F.x) < 1e-3 || Math.abs(F.x - e) < 1e-3 ? qt = F.x < e / 2 ? -(Z / 2 - c) : Z / 2 - c : (Math.abs(F.y) < 1e-3 || Math.abs(F.y - i) < 1e-3) && (Rt = F.y < i / 2 ? -(st / 2 - c) : st / 2 - c));
              const Q = F.x - qt, I = F.y - Rt, V = -l, Vt = V - Zt / 2, Yt = V - Zt, so = F.ratio;
              let no = 4906624;
              if (so > 1.5 ? no = 15680580 : so > 1 ? no = 16096779 : so > 0.8 && (no = 16498468), l > 1e-3) {
                const bt = new uo().setFromPoints([
                  new G(F.x, F.y, 0),
                  new G(F.x, F.y, -l)
                ]);
                X.push(new Oe(bt, new jt({
                  color: 6333946,
                  linewidth: 4
                }))), X.push(to(`Df=${l.toFixed(2)}m`, F.x + 0.1, F.y + 0.1, -l / 2, "#60a5fa"));
              }
              if (Y === 0) {
                const bt = new fs(Z, st, Zt), Kt = new Go(bt, wt(no));
                Kt.position.set(Q, I, Vt), X.push(Kt);
                const Ut = new Co(new hs(bt), xt);
                Ut.position.copy(Kt.position), X.push(Ut);
              } else {
                const bt = new ms(Z, st), Kt = new ae({
                  color: no,
                  transparent: true,
                  opacity: 0.45,
                  roughness: 0.6,
                  side: us
                }), Ut = new Go(bt, Kt);
                Ut.position.set(Q, I, V), X.push(Ut);
                const ao = new Go(bt.clone(), Kt.clone());
                ao.position.set(Q, I, Yt), X.push(ao);
                const ze = Z / g, $e = st / g, Xt = [];
                for (let At = 0; At <= g; At++) {
                  const Ct = -Z / 2 + At * ze;
                  Xt.push(new G(Q + Ct, I - st / 2, V), new G(Q + Ct, I + st / 2, V)), Xt.push(new G(Q + Ct, I - st / 2, Yt), new G(Q + Ct, I + st / 2, Yt));
                }
                for (let At = 0; At <= g; At++) {
                  const Ct = -st / 2 + At * $e;
                  Xt.push(new G(Q - Z / 2, I + Ct, V), new G(Q + Z / 2, I + Ct, V)), Xt.push(new G(Q - Z / 2, I + Ct, Yt), new G(Q + Z / 2, I + Ct, Yt));
                }
                const So = new uo().setFromPoints(Xt);
                X.push(new Co(So, St));
                const bo = [
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
                ], fo = [];
                for (let At = 0; At < 4; At++) {
                  const [Ct, r] = bo[At], [S, v] = bo[(At + 1) % 4];
                  fo.push(new G(Q + Ct, I + r, V), new G(Q + S, I + v, V)), fo.push(new G(Q + Ct, I + r, Yt), new G(Q + S, I + v, Yt)), fo.push(new G(Q + Ct, I + r, V), new G(Q + Ct, I + r, Yt));
                }
                const _o = new uo().setFromPoints(fo);
                X.push(new Co(_o, xt));
              }
              (t.mostrarLabelsZapatas ?? 1) >= 0.5 && X.push(to(`${F.tipo[0].toUpperCase()} ${Z.toFixed(2)}\xD7${st.toFixed(2)}\xD7${Zt.toFixed(2)}m \u03C3/q=${F.ratio.toFixed(2)}`, Q, I, Yt - 0.2, so <= 1 ? "#4ade80" : so <= 1.5 ? "#f59e0b" : "#ef4444"));
            }
            if (Math.round(t.sistemaCimentacion ?? 0) === 1) {
              const F = Math.round(t.vigaAmarre_pos ?? 0), Z = F === 0 ? -l : -l / 2, st = t.vigaAmarre_b ?? 0.25, Zt = t.vigaAmarre_h ?? 0.4, qt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map();
              for (const I of s) {
                const V = I.y.toFixed(4), Vt = I.x.toFixed(4);
                qt.has(V) || qt.set(V, []), Rt.has(Vt) || Rt.set(Vt, []), qt.get(V).push(I), Rt.get(Vt).push(I);
              }
              const Q = [];
              for (const I of qt.values()) {
                I.sort((V, Vt) => V.x - Vt.x);
                for (let V = 0; V < I.length - 1; V++) Q.push(new G(I[V].x, I[V].y, Z)), Q.push(new G(I[V + 1].x, I[V + 1].y, Z));
              }
              for (const I of Rt.values()) {
                I.sort((V, Vt) => V.y - Vt.y);
                for (let V = 0; V < I.length - 1; V++) Q.push(new G(I[V].x, I[V].y, Z)), Q.push(new G(I[V + 1].x, I[V + 1].y, Z));
              }
              Q.length > 0 && (X.push(new Co(new uo().setFromPoints(Q), new jt({
                color: 2282478,
                linewidth: 3
              }))), X.push(to(`Vigas amarre ${(st * 100).toFixed(0)}\xD7${(Zt * 100).toFixed(0)} cm @ ${F === 0 ? "zapatas" : "pedestales"}`, e / 2, i / 2, Z + 0.2, "#22d3ee")));
            }
            se.push(...X);
          }
        }
      } catch (o) {
        console.warn("[Zapatas 3D]", o);
      }
      if ((t.modoCimentacion ?? 0) >= 0.5) try {
        const s = (_b = a.deformOutputs.rawVal) == null ? void 0 : _b.reactions;
        if (s && s.size > 0) {
          const e = [];
          let i = 0, n = 0;
          if (s.forEach((h, l) => {
            const d = M[l];
            !d || Math.abs(d[2]) > 1e-6 || (e.push({
              idx: l,
              x: d[0],
              y: d[1],
              P_kN: Math.abs(h[2]),
              Mx_kN: h[3],
              My_kN: h[4]
            }), d[0] > i && (i = d[0]), d[1] > n && (n = d[1]));
          }), e.length > 0) {
            const h = t.q_adm_zapata ?? 10, l = t.ks_zapata ?? 1030, d = Math.max(0, t.Hf_pedestal ?? 0.5), g = Math.max(0.1, t.t_zapata ?? 0.3), c = Math.max(2, Math.round(t.nSubZapata ?? 4)), w = Math.max(0, t.voladoExtra ?? 0.3), Y = Math.round(t.tipoZapataOverride ?? 0) | 0, T = Jo(e, i, n, h, l), lt = [
              "central",
              "lindero",
              "esquinera"
            ];
            for (const r of T) Y > 0 && (r.tipo = lt[Y - 1]), r.t = g;
            const X = Uo[0] ?? t.colSize, wt = Qo[0] ?? t.colSize, xt = X * wt, St = X * wt ** 3 / 12, kt = wt * X ** 3 / 12, yo = 0.14 * Math.pow(Math.min(X, wt), 4), _e = t.matCol < 0.5 ? N : K, we = t.matCol < 0.5 ? at : gt, Ce = t.matCol < 0.5 ? j : U, F = [], Z = [], st = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), Vt = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map(), so = /* @__PURE__ */ new Map(), no = /* @__PURE__ */ new Map(), $o = [], bt = [], Kt = (r, S, v) => `${Math.round(r * 1e4)},${Math.round(S * 1e4)},${Math.round(v * 1e4)}`, Ut = /* @__PURE__ */ new Map(), ao = (r, S, v) => {
              const L = Kt(r, S, v), H = Ut.get(L);
              if (H !== void 0) return H;
              const nt = F.length;
              return F.push([
                r,
                S,
                v
              ]), Ut.set(L, nt), nt;
            }, ze = new jt({
              color: 0,
              linewidth: 2
            }), $e = new jt({
              color: 1118481,
              linewidth: 2
            });
            for (const r of T) {
              const S = r.Lz, v = r.Bz, L = r.t;
              let H = 0, nt = 0;
              r.tipo === "esquinera" ? (H = r.x < i / 2 ? -(S / 2 - w) : S / 2 - w, nt = r.y < n / 2 ? -(v / 2 - w) : v / 2 - w) : r.tipo === "lindero" && (Math.abs(r.x) < 1e-3 || Math.abs(r.x - i) < 1e-3 ? H = r.x < i / 2 ? -(S / 2 - w) : S / 2 - w : (Math.abs(r.y) < 1e-3 || Math.abs(r.y - n) < 1e-3) && (nt = r.y < n / 2 ? -(v / 2 - w) : v / 2 - w));
              const Tt = r.x - H, Lt = r.y - nt, Qt = -d, Nt = S / c, Wt = v / c, dt = [];
              for (let R = 0; R <= c; R++) {
                const ot = [];
                for (let ht = 0; ht <= c; ht++) {
                  const Dt = Tt - S / 2 + ht * Nt, zt = Lt - v / 2 + R * Wt;
                  ot.push(ao(Dt, zt, Qt));
                }
                dt.push(ot);
              }
              for (let R = 0; R < c; R++) for (let ot = 0; ot < c; ot++) {
                const ht = Z.length;
                Z.push([
                  dt[R][ot],
                  dt[R][ot + 1],
                  dt[R + 1][ot + 1],
                  dt[R + 1][ot]
                ]), Yt.set(ht, L), st.set(ht, N), Vt.set(ht, j), Zt.set(ht, at), V.set(ht, oo);
              }
              const io = 0.5;
              for (let R = 0; R <= c; R++) for (let ot = 0; ot <= c; ot++) {
                const ht = Nt * Wt * (ot === 0 || ot === c ? 0.5 : 1) * (R === 0 || R === c ? 0.5 : 1), Dt = l * ht, zt = Dt * io, A = dt[R][ot];
                $o.push({
                  node: A,
                  dof: 0,
                  k: zt
                }), $o.push({
                  node: A,
                  dof: 1,
                  k: zt
                }), $o.push({
                  node: A,
                  dof: 2,
                  k: Dt
                }), $o.push({
                  node: A,
                  dof: 5,
                  k: Dt * 0.1
                });
              }
              const Bt = dt[0][0];
              so.set(Bt, [
                false,
                false,
                false,
                true,
                true,
                true
              ]);
              let C = 0, E = 0, b = 1 / 0;
              for (let R = 0; R <= c; R++) for (let ot = 0; ot <= c; ot++) {
                const ht = dt[R][ot], Dt = F[ht][0], zt = F[ht][1], A = Math.sqrt((Dt - r.x) ** 2 + (zt - r.y) ** 2);
                A < b && (b = A, C = R, E = ot);
              }
              const Ht = dt[C][E], It = e.find((R) => R.idx === r.idx);
              no.set(Ht, [
                0,
                0,
                -It.P_kN,
                It.Mx_kN,
                It.My_kN,
                0
              ]);
              const co = r.ratio;
              let wo = 4906624;
              if (co > 1.5 ? wo = 15680580 : co > 1 ? wo = 16096779 : co > 0.8 && (wo = 16498468), d > 1e-3) {
                const R = new uo().setFromPoints([
                  new G(r.x, r.y, 0),
                  new G(r.x, r.y, -d)
                ]);
                bt.push(new Oe(R, new jt({
                  color: 6333946,
                  linewidth: 4
                }))), bt.push(to(`Df=${d.toFixed(2)}m`, r.x + 0.1, r.y + 0.1, -d / 2, "#60a5fa"));
              }
              {
                const R = new jt({
                  color: 11184810,
                  linewidth: 1,
                  transparent: true,
                  opacity: 0.6
                }), ot = S / c, ht = v / c, Dt = [];
                for (let zt = 0; zt <= c; zt++) {
                  const A = -S / 2 + zt * ot;
                  Dt.push(new G(Tt + A, Lt - v / 2, -d), new G(Tt + A, Lt + v / 2, -d));
                }
                for (let zt = 0; zt <= c; zt++) {
                  const A = -v / 2 + zt * ht;
                  Dt.push(new G(Tt - S / 2, Lt + A, -d), new G(Tt + S / 2, Lt + A, -d));
                }
                bt.push(new Co(new uo().setFromPoints(Dt), R));
              }
              if ((t.mostrarLabelsZapatas ?? 1) >= 0.5) {
                const R = It.P_kN / 9.80665, ot = It.Mx_kN / 9.80665, ht = It.My_kN / 9.80665;
                bt.push(to(`P=${R.toFixed(2)} tonf`, r.x, r.y, 0.3, "#fbbf24")), bt.push(to(`Mx=${ot.toFixed(2)}  My=${ht.toFixed(2)} tonf\xB7m`, r.x, r.y, 0.1, "#fbbf24")), bt.push(to(`${r.tipo[0].toUpperCase()} ${S.toFixed(2)}\xD7${v.toFixed(2)}\xD7${L.toFixed(2)}m \u03C3/q=${co.toFixed(2)}`, Tt, Lt, -d - L - 0.2, co <= 1 ? "#4ade80" : co <= 1.5 ? "#f59e0b" : "#ef4444"));
              }
            }
            const Xt = Math.round(t.sistemaCimentacion ?? 0);
            if (Xt === 1) {
              const r = Math.round(t.vigaAmarre_pos ?? 0), S = t.vigaAmarre_h ?? 0.4, v = t.vigaAmarre_b ?? 0.25, L = v * S, H = v * S ** 3 / 12, nt = S * v ** 3 / 12, Tt = 0.21 * Math.pow(Math.min(v, S), 3) * Math.max(v, S), Lt = /* @__PURE__ */ new Map();
              for (const C of T) {
                let E;
                r === 0 ? E = -d : E = -d / 2;
                const b = ao(C.x, C.y, E);
                if (Lt.set(C.idx, b), r === 1 && d > 1e-3) {
                  const ft = ao(C.x, C.y, -d / 2), Ht = ao(C.x, C.y, 0), It = ao(C.x, C.y, -d);
                }
              }
              const Qt = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map();
              for (const C of e) {
                const E = C.y.toFixed(4), b = C.x.toFixed(4);
                Qt.has(E) || Qt.set(E, []), Nt.has(b) || Nt.set(b, []), Qt.get(E).push(C), Nt.get(b).push(C);
              }
              const Wt = (C, E) => {
                const b = Z.length;
                Z.push([
                  C,
                  E
                ]), st.set(b, _e), Zt.set(b, we), Vt.set(b, Ce), qt.set(b, L), Rt.set(b, nt), Q.set(b, H), I.set(b, Tt), V.set(b, oo);
              };
              let dt = 0;
              for (const C of Qt.values()) {
                C.sort((E, b) => E.x - b.x);
                for (let E = 0; E < C.length - 1; E++) {
                  const b = Lt.get(C[E].idx), ft = Lt.get(C[E + 1].idx);
                  b !== void 0 && ft !== void 0 && (Wt(b, ft), dt++);
                }
              }
              for (const C of Nt.values()) {
                C.sort((E, b) => E.y - b.y);
                for (let E = 0; E < C.length - 1; E++) {
                  const b = Lt.get(C[E].idx), ft = Lt.get(C[E + 1].idx);
                  b !== void 0 && ft !== void 0 && (Wt(b, ft), dt++);
                }
              }
              const io = new jt({
                color: 2282478,
                linewidth: 3
              }), Bt = [];
              for (const C of Qt.values()) {
                const E = [
                  ...C
                ].sort((b, ft) => b.x - ft.x);
                for (let b = 0; b < E.length - 1; b++) {
                  const ft = E[b], Ht = E[b + 1], It = r === 0 ? -d : -d / 2;
                  Bt.push(new G(ft.x, ft.y, It)), Bt.push(new G(Ht.x, Ht.y, It));
                }
              }
              for (const C of Nt.values()) {
                const E = [
                  ...C
                ].sort((b, ft) => b.y - ft.y);
                for (let b = 0; b < E.length - 1; b++) {
                  const ft = E[b], Ht = E[b + 1], It = r === 0 ? -d : -d / 2;
                  Bt.push(new G(ft.x, ft.y, It)), Bt.push(new G(Ht.x, Ht.y, It));
                }
              }
              if (Bt.length > 0) {
                const C = new uo().setFromPoints(Bt);
                bt.push(new Co(C, io));
              }
              bt.push(to(`+${dt} vigas de amarre ${(v * 100).toFixed(0)}\xD7${(S * 100).toFixed(0)} cm @ ${r === 0 ? "zapatas" : "pedestales"}`, i / 2, n / 2, r === 1 ? -d / 2 + 0.3 : -d + 0.3, "#22d3ee")), console.log(`[Cimentaci\xF3n] Sistema 1 \u2014 ${dt} vigas de amarre ${(v * 100).toFixed(0)}\xD7${(S * 100).toFixed(0)} cm en posici\xF3n ${r === 0 ? "zapatas" : "pedestales"}`);
            } else Xt >= 2 && (console.warn(`[Cimentaci\xF3n] Sistema ${Xt} (${[
              "",
              "",
              "Vigas T invertida",
              "Vigas rect. + zapata corrida",
              "Losa de cimentaci\xF3n"
            ][Xt]}) a\xFAn no implementado completamente. Mostrando zapatas aisladas. Pr\xF3ximamente: malla shell continua + frames T-invertida.`), bt.push(to(`Sistema ${Xt} (TODO) \u2014 usando zapatas aisladas`, i / 2, n / 2, 1.5, "#fbbf24")));
            const So = Math.round(t.sistemaCimentacion ?? 0), bo = 0.3, fo = Math.round(t.vigaAmarre_pos ?? 0), _o = /* @__PURE__ */ new Map();
            if (So === 1) {
              const r = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
              for (const L of e) {
                const H = L.y.toFixed(4), nt = L.x.toFixed(4);
                r.has(H) || r.set(H, []), S.has(nt) || S.set(nt, []), r.get(H).push(L), S.get(nt).push(L);
              }
              const v = (L) => _o.set(L, (_o.get(L) ?? 0) + 1);
              for (const L of r.values()) {
                L.sort((H, nt) => H.x - nt.x);
                for (let H = 0; H < L.length - 1; H++) v(L[H].idx), v(L[H + 1].idx);
              }
              for (const L of S.values()) {
                L.sort((H, nt) => H.y - nt.y);
                for (let H = 0; H < L.length - 1; H++) v(L[H].idx), v(L[H + 1].idx);
              }
              console.log(`[Cimentaci\xF3n] Vigas de amarre activas \u2014 momentos en zapatas reducidos por factor (1 - ${bo} \xB7 n_vigas/4):`), _o.forEach((L, H) => {
                const nt = (bo * L / 4 * 100).toFixed(0);
                console.log(`   Zapata ${H}: ${L} vigas conectadas \u2192 momento reducido ${nt}%`);
              }), fo === 0 && console.log("   \u21B3 vigaAmarre_pos=0 (mismo nivel zapata) \u2192 en F2K se exportar\xE1 como cimentaci\xF3n corrida con ks\xB7b\xB7dL distribuido por nodo");
            }
            const At = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map();
            for (const r of T) {
              const S = e.find((A) => A.idx === r.idx), v = r.Lz, L = r.Bz, H = r.t;
              let nt = 0, Tt = 0;
              r.tipo === "esquinera" ? (nt = r.x < i / 2 ? -(v / 2 - w) : v / 2 - w, Tt = r.y < n / 2 ? -(L / 2 - w) : L / 2 - w) : r.tipo === "lindero" && (Math.abs(r.x) < 1e-3 || Math.abs(r.x - i) < 1e-3 ? nt = r.x < i / 2 ? -(v / 2 - w) : v / 2 - w : (Math.abs(r.y) < 1e-3 || Math.abs(r.y - n) < 1e-3) && (Tt = r.y < n / 2 ? -(L / 2 - w) : L / 2 - w));
              const Lt = r.x - nt, Qt = r.y - Tt, Nt = [], Wt = [], dt = {
                elasticities: /* @__PURE__ */ new Map(),
                shearModuli: /* @__PURE__ */ new Map(),
                poissonsRatios: /* @__PURE__ */ new Map(),
                thicknesses: /* @__PURE__ */ new Map(),
                densities: /* @__PURE__ */ new Map()
              }, io = v / c, Bt = L / c, C = [], E = [];
              for (let A = 0; A <= c; A++) {
                const et = [];
                for (let mt = 0; mt <= c; mt++) {
                  const Ft = -v / 2 + mt * io, Ot = -L / 2 + A * Bt;
                  et.push(Nt.length), Nt.push([
                    Ft,
                    Ot,
                    0
                  ]);
                  const Ro = Lt + Ft, Xo = Qt + Ot, Zo = Kt(Ro, Xo, -d), ho = Ut.get(Zo);
                  ho !== void 0 ? E.push(ho) : E.push(-1);
                }
                C.push(et);
              }
              for (let A = 0; A < c; A++) for (let et = 0; et < c; et++) {
                const mt = Wt.length;
                Wt.push([
                  C[A][et],
                  C[A][et + 1],
                  C[A + 1][et + 1],
                  C[A + 1][et]
                ]), dt.thicknesses.set(mt, H), dt.elasticities.set(mt, N), dt.poissonsRatios.set(mt, j), dt.shearModuli.set(mt, at), dt.densities.set(mt, oo);
              }
              const b = [], ft = 0.5;
              for (let A = 0; A <= c; A++) for (let et = 0; et <= c; et++) {
                const mt = io * Bt * (et === 0 || et === c ? 0.5 : 1) * (A === 0 || A === c ? 0.5 : 1), Ft = l * mt, Ot = C[A][et];
                b.push({
                  node: Ot,
                  dof: 0,
                  k: Ft * ft
                }), b.push({
                  node: Ot,
                  dof: 1,
                  k: Ft * ft
                }), b.push({
                  node: Ot,
                  dof: 2,
                  k: Ft
                });
              }
              if (So === 1 && fo === 0) {
                const A = t.vigaAmarre_b ?? 0.25, et = r.idx, mt = e.filter((vt) => Math.abs(vt.y - r.y) < 1e-3 && vt.idx !== et).sort((vt, Ao) => vt.x - Ao.x), Ft = e.filter((vt) => Math.abs(vt.x - r.x) < 1e-3 && vt.idx !== et).sort((vt, Ao) => vt.y - Ao.y), Ot = mt.find((vt) => vt.x > r.x), Ro = [
                  ...mt
                ].reverse().find((vt) => vt.x < r.x), Xo = Ft.find((vt) => vt.y > r.y), Zo = [
                  ...Ft
                ].reverse().find((vt) => vt.y < r.y), ho = (vt, Ao) => {
                  const Se = Ao / 2;
                  for (let ro = 0; ro <= c; ro++) {
                    const es = ro === 0 || ro === c ? Se / (2 * c) : Se / c, Ae = l * A * es, ke = Ae * ft;
                    let mo;
                    switch (vt) {
                      case "x+":
                        mo = C[ro][c];
                        break;
                      case "x-":
                        mo = C[ro][0];
                        break;
                      case "y+":
                        mo = C[c][ro];
                        break;
                      case "y-":
                        mo = C[0][ro];
                        break;
                    }
                    b.push({
                      node: mo,
                      dof: 0,
                      k: ke
                    }), b.push({
                      node: mo,
                      dof: 1,
                      k: ke
                    }), b.push({
                      node: mo,
                      dof: 2,
                      k: Ae
                    });
                  }
                };
                Ot && ho("x+", Ot.x - r.x), Ro && ho("x-", r.x - Ro.x), Xo && ho("y+", Xo.y - r.y), Zo && ho("y-", r.y - Zo.y);
              }
              const Ht = l * io * Bt * 1e-4;
              b.push({
                node: C[0][0],
                dof: 3,
                k: Ht
              }), b.push({
                node: C[0][0],
                dof: 4,
                k: Ht
              }), b.push({
                node: C[0][0],
                dof: 5,
                k: Ht
              });
              const It = -nt, co = -Tt;
              let wo = 0, ne = 0, R = 1 / 0;
              for (let A = 0; A <= c; A++) for (let et = 0; et <= c; et++) {
                const mt = -v / 2 + et * io, Ft = -L / 2 + A * Bt, Ot = (mt - It) ** 2 + (Ft - co) ** 2;
                Ot < R && (R = Ot, wo = A, ne = et);
              }
              const ot = C[wo][ne], ht = /* @__PURE__ */ new Map(), Dt = _o.get(r.idx) ?? 0, zt = So === 1 ? Math.max(0.4, 1 - bo * Dt / 4) : 1;
              ht.set(ot, [
                0,
                0,
                -S.P_kN,
                S.Mx_kN * zt,
                S.My_kN * zt,
                0
              ]);
              try {
                const et = Ie(Nt, Wt, {
                  supports: /* @__PURE__ */ new Map(),
                  loads: ht
                }, dt, b).deformations;
                for (let mt = 0; mt < Nt.length; mt++) {
                  const Ft = E[mt];
                  if (Ft >= 0) {
                    const Ot = et.get(mt);
                    Ot && At.set(Ft, [
                      ...Ot
                    ]);
                  }
                }
              } catch (A) {
                console.warn(`[Zapata ${r.idx}] solver fall\xF3:`, A);
              }
            }
            for (let r = 0; r < Z.length; r++) {
              const S = Z[r];
              if (S.length !== 4) continue;
              const v = [];
              for (const L of S) {
                const H = At.get(L);
                v.push(l * (H ? H[2] : 0) / 9.80665);
              }
              Ct.set(r, v);
            }
            a.nodes.val = F, a.elements.val = Z, a.nodeInputs.val = {
              supports: so,
              loads: no
            }, a.elementInputs.val = {
              etabsWallJoint: Math.round(t.comparar ?? 1) === 1,
              elasticities: st,
              shearModuli: Zt,
              areas: qt,
              momentsOfInertiaY: Rt,
              momentsOfInertiaZ: Q,
              torsionalConstants: I,
              densities: V,
              poissonsRatios: Vt,
              thicknesses: Yt
            }, a.deformOutputs.val = {
              deformations: At,
              reactions: /* @__PURE__ */ new Map()
            }, a.analyzeOutputs.val = {
              pressure: Ct,
              colorMapRanges: {
                pressure: [
                  -h,
                  0
                ]
              }
            }, a.objects3D.val = bt, console.log(`[Modo Cimentaci\xF3n] ${e.length} zapatas + pedestales (Hf=${d} m, t=${g} m, q_adm=${h} tonf/m\xB2, ks=${l} kN/m\xB3) \u2014 reemplaza superestructura`);
            try {
              const r = () => {
                var _a2;
                const v = (_a2 = document.querySelector("#viewer")) == null ? void 0 : _a2.__settings;
                v && (v.shellResults && (v.shellResults.val = "pressure"), v.deformedShape && (v.deformedShape.val = false), v.deformScale && (v.deformScale.val = 5), v.frameResults && (v.frameResults.val = "none"), v.custom3D && (v.custom3D.val = true));
              };
              [
                0,
                100,
                300
              ].forEach((S) => setTimeout(r, S));
            } catch {
            }
            return;
          }
        }
      } catch (o) {
        console.warn("[Modo Cimentaci\xF3n] error:", o);
      }
      a.objects3D.val = se;
    },
    runModal(t, a, D) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      const y = a.nodes.val, k = a.elements.val, p = a.nodeInputs.val, _ = a.elementInputs.val;
      if (!(!y.length || !k.length || !((_a = p.supports) == null ? void 0 : _a.size) || !((_b = _.densities) == null ? void 0 : _b.size))) try {
        const P = [], N = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), gt = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map();
        let it = 0, x = 0;
        const f = [];
        let m = 0;
        for (let O = 0; O < k.length; O++) {
          const q = k[O];
          let Et = false, eo = false;
          if (q.length === 4) {
            const ut = q.map((Gt) => y[Gt][2]);
            if (Math.max(...ut) - Math.min(...ut) < 0.02) {
              const Gt = y[q[0]][0], Jt = y[q[0]][1], go = y[q[2]][0], Mo = y[q[2]][1], lo = Math.abs((go - Gt) * (Mo - Jt)), Io = ((_c = _.thicknesses) == null ? void 0 : _c.get(O)) ?? 0.15, Oo = ((_d = _.densities) == null ? void 0 : _d.get(O)) ?? 24;
              it += Oo * lo * Io, Et = true;
            }
          } else if (q.length === 2) {
            const ut = y[q[0]][2], pt = y[q[1]][2], Gt = Math.sqrt((y[q[1]][0] - y[q[0]][0]) ** 2 + (y[q[1]][1] - y[q[0]][1]) ** 2);
            if (Math.abs(pt - ut) > Gt) {
              eo = true;
              const Jt = Math.abs(pt - ut), go = ((_e = _.areas) == null ? void 0 : _e.get(O)) ?? 0, Mo = ((_f = _.densities) == null ? void 0 : _f.get(O)) ?? 24;
              x += Mo * go * Jt;
            }
          }
          Et || (P.push(q), ((_g = _.areas) == null ? void 0 : _g.has(O)) && N.set(m, _.areas.get(O)), ((_h = _.momentsOfInertiaY) == null ? void 0 : _h.has(O)) && K.set(m, _.momentsOfInertiaY.get(O)), ((_i = _.momentsOfInertiaZ) == null ? void 0 : _i.has(O)) && j.set(m, _.momentsOfInertiaZ.get(O)), ((_j = _.torsionalConstants) == null ? void 0 : _j.has(O)) && U.set(m, _.torsionalConstants.get(O)), ((_k = _.elasticities) == null ? void 0 : _k.has(O)) && at.set(m, _.elasticities.get(O)), ((_l = _.shearModuli) == null ? void 0 : _l.has(O)) && gt.set(m, _.shearModuli.get(O)), ((_m = _.densities) == null ? void 0 : _m.has(O)) && W.set(m, _.densities.get(O)), ((_n = _.thicknesses) == null ? void 0 : _n.has(O)) && Mt.set(m, _.thicknesses.get(O)), ((_o = _.poissonsRatios) == null ? void 0 : _o.has(O)) && tt.set(m, _.poissonsRatios.get(O)), eo && f.push(m), m++);
        }
        if (it > 0 && x > 0 && f.length > 0) {
          const O = 1 + it / x;
          for (const q of f) {
            const Et = W.get(q) ?? 24;
            W.set(q, Et * O);
          }
        }
        const ct = {
          areas: N,
          momentsOfInertiaY: K,
          momentsOfInertiaZ: j,
          torsionalConstants: U,
          elasticities: at,
          shearModuli: gt,
          densities: W,
          thicknesses: Mt,
          poissonsRatios: tt
        }, _t = Math.round(t.nPisos), $ = Math.min(60, Math.max(15, 3 * _t + 6)), M = ns(y, P, p, ct, $), B = Math.round(t.nVanosX), z = Math.round(t.nVanosY), rt = Math.round(t.nPisos), $t = x > 0 ? 1 + it / x : 1;
        D.render(M, {
          title: `Edificio ${B}\xD7${z} vanos \xD7 ${rt} pisos \xB7 ${$} modos`,
          properties: [
            `Material cols=${t.matCol < 0.5 ? "Hormig\xF3n" : "Acero"} vigas=${t.matViga < 0.5 ? "Hormig\xF3n" : "Acero"}  f'c=${t.fcConcr} kg/cm\xB2`,
            `Apoyo: ${[
              "Empotrado",
              "Articulado",
              "R\xF3tula"
            ][Math.round(t.apoyo)]}${t.slabOn >= 0.5 ? ` + Losa (lumped: \xD7${$t.toFixed(2)} dens cols, ${it.toFixed(0)} kN/g)` : ""}${t.bracesMode > 0 ? " + Diagonales" : ""}${(t.murosMode ?? 0) > 0 ? " + Muros Q4" : ""}`,
            "Estilo ETABS: losas filtradas del modal + masa transferida a columnas (igual que membrane diaphragm en ETABS/SAP)"
          ]
        });
        const yt = M.frequencies[0] ?? 0;
        console.log(`[Edificio Modal] ${$} modos \xB7 f\u2081=${yt.toFixed(4)} Hz \xB7 m_slab=${it.toFixed(0)} m_cols=${x.toFixed(0)} factor=${$t.toFixed(2)}`);
      } catch (P) {
        console.warn("Modal edificio error:", P.message);
      }
    }
  };
});
export {
  __tla,
  Os as e,
  Is as f
};
