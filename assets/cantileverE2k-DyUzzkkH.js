import { a as j } from "./analyze-CRH7D0Bs.js";
import { d as W, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let k, Q;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  function w(t, a) {
    const s = t.D_out, i = t.t_HSS;
    if (a === 0) {
      const n = s - 2 * i, u = s * s - n * n, A = (s ** 4 - n ** 4) / 12, l = 2 * A, _ = u, e = A, I = l, M = t.E_s, h = M / 2.6, c = t.gamma_s * u, r = `HSS${(s * 1e3).toFixed(0)}x${(s * 1e3).toFixed(0)}x${(i * 1e3).toFixed(0)}`;
      return {
        matKey: a,
        A_eq: _,
        I_eq: e,
        J_eq: I,
        E_col: M,
        G_col: h,
        q: c,
        sectionLabel: `HSS ${(s * 1e3).toFixed(0)}\xD7${(s * 1e3).toFixed(0)}\xD7${(i * 1e3).toFixed(0)}mm`,
        materialType: "Acero",
        sectionInfoObj: {
          name: r,
          shape: "Steel Tube",
          D: s,
          B: s,
          TF: i,
          TW: i,
          material: "A572Gr50"
        }
      };
    } else if (a === 1) {
      const n = s * s, u = s * s * s * s / 12, A = 0.141 * s * s * s * s, l = t.E_c, _ = l / 2.4, e = t.gamma_c * n, I = `C${(s * 1e3).toFixed(0)}x${(s * 1e3).toFixed(0)}`;
      return {
        matKey: a,
        A_eq: n,
        I_eq: u,
        J_eq: A,
        E_col: l,
        G_col: _,
        q: e,
        sectionLabel: `Concrete Rectangular ${(s * 1e3).toFixed(0)}\xD7${(s * 1e3).toFixed(0)}mm`,
        materialType: "Hormig\xF3n",
        sectionInfoObj: {
          name: I,
          shape: "Concrete Rectangular",
          D: s,
          B: s,
          material: "concrete"
        }
      };
    } else {
      const n = s - 2 * i, u = s * s - n * n, A = n * n, l = (s ** 4 - n ** 4) / 12, _ = n ** 4 / 12, e = 2 * l, I = t.E_s / t.E_c, M = u + A / I, h = l + _ / I, c = e, r = t.E_s, T = r / 2.6, O = t.gamma_s * u + t.gamma_c * A, m = `CR${(s * 1e3).toFixed(0)}X${(s * 1e3).toFixed(0)}X${(i * 1e3).toFixed(0)}1mm`;
      return {
        matKey: a,
        A_eq: M,
        I_eq: h,
        J_eq: c,
        E_col: r,
        G_col: T,
        q: O,
        sectionLabel: `CFT ${(s * 1e3).toFixed(0)}\xD7${(s * 1e3).toFixed(0)}\xD7${(i * 1e3).toFixed(0)}mm + concrete fill`,
        materialType: "Mixta (Filled Steel Tube)",
        sectionInfoObj: {
          name: m,
          shape: "Filled Steel Tube",
          D: s,
          B: s,
          TF: i,
          TW: i,
          material: "A572Gr50",
          fillMaterial: "4000Psi"
        }
      };
    }
  }
  k = function(t, a, s, i = 1) {
    const n = w(t, s), u = t.L, A = Math.max(1, Math.round(t.nSegments)), l = u / A, _ = [];
    for (let o = 0; o <= A; o++) _.push([
      0,
      0,
      o * l
    ]);
    const e = [];
    for (let o = 0; o < A; o++) e.push([
      o,
      o + 1
    ]);
    const I = /* @__PURE__ */ new Map();
    I.set(0, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const M = /* @__PURE__ */ new Map();
    for (let o = 0; o <= A; o++) {
      const B = o === 0 || o === A, J = -n.q * l * (B ? 0.5 : 1) * i;
      M.set(o, [
        0,
        0,
        J,
        0,
        0,
        0
      ]);
    }
    const h = t.P_lat_y ?? 0, c = t.M_top_x ?? 0, r = t.M_top_y ?? 0, T = t.M_top_z ?? 0;
    if (Math.abs(t.P_lat) > 1e-9 || Math.abs(h) > 1e-9 || Math.abs(c) > 1e-9 || Math.abs(r) > 1e-9 || Math.abs(T) > 1e-9) {
      const o = M.get(A) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      o[0] += t.P_lat, o[1] += h, o[3] += c, o[4] += r, o[5] += T, M.set(A, o);
    }
    const O = t.A_mod ?? 1, m = t.As2_mod ?? 1, L = t.As3_mod ?? 1, f = t.J_mod ?? 1, R = t.I22_mod ?? 1, $ = t.I33_mod ?? 1, D = n.q / (n.A_eq * 9.80665), p = 5 / 6 * n.A_eq, d = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
    for (let o = 0; o < e.length; o++) d.set(o, n.E_col), N.set(o, n.G_col), P.set(o, n.A_eq * O), G.set(o, n.I_eq * $), Y.set(o, n.I_eq * R), x.set(o, n.J_eq * f), U.set(o, D), m < 1e-3 ? C.set(o, -1) : C.set(o, p * m), L < 1e-3 ? b.set(o, -1) : b.set(o, p * L), g.set(o, n.sectionLabel), v.set(o, n.materialType), y.set(o, n.sectionInfoObj);
    a.nodes.val = _, a.elements.val = e, a.nodeInputs.val = {
      supports: I,
      loads: M
    }, a.elementInputs.val = {
      elasticities: d,
      shearModuli: N,
      areas: P,
      momentsOfInertiaZ: G,
      momentsOfInertiaY: Y,
      torsionalConstants: x,
      shearAreasY: C,
      shearAreasZ: b,
      densities: U,
      sectionLabels: g,
      materialTypes: v,
      sectionInfo: y
    };
    try {
      a.deformOutputs.val = W(_, e, {
        supports: I,
        loads: M
      }, a.elementInputs.val), a.analyzeOutputs.val = j(_, e, a.elementInputs.val, a.deformOutputs.val);
    } catch (o) {
      console.error(`[Cantilever ${n.materialType}] solver error:`, o.message);
    }
    return a.objects3D.val = [], {
      sec: n
    };
  };
  const S = 1 / 9.80665, q = S, H = S;
  function E(t, a = 6) {
    if (Math.abs(t) < 1e-12) return "0";
    const s = Math.abs(t);
    return s >= 1e6 || s < 1e-3 ? t.toExponential(6).replace(/e\+?/, "E+").replace(/E\+?-/, "E-") : parseFloat(t.toFixed(a)).toString();
  }
  function X(t, a) {
    const s = w(t, a), i = t.L;
    t.D_out, t.t_HSS;
    const n = t.E_s * H, u = t.E_c * H, A = t.gamma_s * q, l = t.gamma_c * q, _ = t.P_lat * S, e = [], I = /* @__PURE__ */ new Date(), M = `${I.getMonth() + 1}/${I.getDate()}/${I.getFullYear()}`, h = `${I.getHours()}:${String(I.getMinutes()).padStart(2, "0")}:${String(I.getSeconds()).padStart(2, "0")}`;
    e.push(`$ File Cantilever_${s.sectionInfoObj.name}.e2k saved ${M} ${h}`), e.push(""), e.push("$ PROGRAM INFORMATION"), e.push('  PROGRAM  "ETABS"  VERSION "19.1.0"  '), e.push(""), e.push("$ CONTROLS"), e.push('  UNITS  "TONF"  "M"  "C"  '), e.push(`  TITLE1  "Hekatan Struct Lineal \u2014 Cantilever ${s.materialType}"  `), e.push('  TITLE2  "Validacion vs ETABS"  '), e.push(""), e.push("$ STORIES - IN SEQUENCE FROM TOP"), e.push(`  STORY "Story1"  HEIGHT ${E(i)} MASTERSTORY "Yes"  `), e.push('  STORY "Base"  ELEV 0 '), e.push(""), e.push("$ GRIDS"), e.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), e.push(""), e.push("$ DIAPHRAGM NAMES"), e.push('  DIAPHRAGM "D1"    TYPE RIGID'), e.push(""), e.push("$ MATERIAL PROPERTIES"), (a === 0 || a === 2) && (e.push(`  MATERIAL  "A572Gr50"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${E(A)}`), e.push(`  MATERIAL  "A572Gr50"    SYMTYPE "Isotropic"  E ${E(n)}  U 0.3  A 1.16999999590917E-05`), e.push('  MATERIAL  "A572Gr50"  FY 35153.48  FU 45699.53 FYE 38668.83  FUE 50269.48')), a === 1 && (e.push(`  MATERIAL  "concrete"    TYPE "Concrete"    WEIGHTPERVOLUME ${E(l)}`), e.push(`  MATERIAL  "concrete"    SYMTYPE "Isotropic"  E ${E(u)}  U 0.2  A 9.99999974737875E-06`), e.push('  MATERIAL  "concrete"    FC 2855.205')), a === 2 && (e.push(`  MATERIAL  "4000Psi"    TYPE "Concrete"    GRADE "f'c 4000 psi"    WEIGHTPERVOLUME ${E(l)}`), e.push(`  MATERIAL  "4000Psi"    SYMTYPE "Isotropic"  E ${E(u)}  U 0.2  A 9.89999989542412E-06`), e.push('  MATERIAL  "4000Psi"    FC 2812.279')), e.push(""), e.push("$ FRAME SECTIONS");
    const c = s.sectionInfoObj;
    let r = `  FRAMESECTION  "${c.name}"  MATERIAL "${c.material}"  SHAPE "${c.shape}"`;
    c.D !== void 0 && (r += `  D ${E(c.D)}`), c.B !== void 0 && (r += ` B ${E(c.B)}`), c.TF !== void 0 && (r += ` TF ${E(c.TF)}`), c.TW !== void 0 && (r += ` TW ${E(c.TW)}`), c.fillMaterial && (r += ` FILLMATERIAL "${c.fillMaterial}"  `), e.push(r);
    const T = [];
    Math.abs(t.A_mod - 1) > 1e-6 && T.push(`AREAMODIFIER ${E(t.A_mod)}`), Math.abs(t.As2_mod - 1) > 1e-6 && T.push(`AS2MODIFIER ${E(t.As2_mod)}`), Math.abs(t.As3_mod - 1) > 1e-6 && T.push(`AS3MODIFIER ${E(t.As3_mod)}`), Math.abs(t.J_mod - 1) > 1e-6 && T.push(`JMODIFIER ${E(t.J_mod)}`), Math.abs(t.I22_mod - 1) > 1e-6 && T.push(`I22MODIFIER ${E(t.I22_mod)}`), Math.abs(t.I33_mod - 1) > 1e-6 && T.push(`I33MODIFIER ${E(t.I33_mod)}`), T.length > 0 && e.push(`  FRAMESECTION  "${c.name}"  ${T.join("  ")}  `), e.push(""), e.push("$ POINT COORDINATES"), e.push('  POINT "1"  0 0 '), e.push(""), e.push("$ LINE CONNECTIVITIES"), e.push('  LINE  "C1"  COLUMN  "1"  "1"  1'), e.push(""), e.push("$ POINT ASSIGNS"), e.push('  POINTASSIGN  "1"  "Story1"  DIAPH "D1"  '), e.push('  POINTASSIGN  "1"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  '), e.push(""), e.push("$ LINE ASSIGNS"), e.push(`  LINEASSIGN  "C1"  "Story1"  SECTION "${c.name}"  RIGIDZONE 0.5 MINNUMSTA ${Math.max(2, t.nSegments)} AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `), e.push("");
    const O = (t.P_lat_y ?? 0) * S, m = (t.M_top_x ?? 0) * S, L = (t.M_top_y ?? 0) * S, f = (t.M_top_z ?? 0) * S, R = Math.abs(t.P_lat) > 1e-9, $ = Math.abs(t.P_lat_y ?? 0) > 1e-9, F = Math.abs(t.M_top_x ?? 0) > 1e-9, D = Math.abs(t.M_top_y ?? 0) > 1e-9, p = Math.abs(t.M_top_z ?? 0) > 1e-9, d = R || $ || F || D || p;
    e.push("$ LOAD PATTERNS"), e.push('  LOADPATTERN "DEAD"  TYPE  "Dead"  SELFWEIGHT  1'), d && e.push('  LOADPATTERN "LATERAL"  TYPE  "Other"  SELFWEIGHT  0'), e.push(""), d && (e.push("$ POINT OBJECT LOADS"), (R || $) && e.push(`  POINTLOAD  "1"  "Story1"  TYPE "FORCE"  LC "LATERAL"  FX ${E(_)} FY ${E(O)} FZ 0`), (F || D || p) && e.push(`  POINTLOAD  "1"  "Story1"  TYPE "MOMENT"  LC "LATERAL"  MX ${E(m)} MY ${E(L)} MZ ${E(f)}`), e.push("")), e.push("$ ANALYSIS OPTIONS"), e.push('  ACTIVEDOF  "UX UY UZ RX RY RZ"  '), e.push(""), e.push("$ MASS SOURCE"), e.push('  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "No"    INCLUDEADDEDMASS "No"    INCLUDELOADS "Yes"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"  '), e.push('  MASSSOURCELOAD  "MsSrc1"  "DEAD"  1 '), e.push(""), e.push("$ LOAD CASES"), e.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), e.push('  LOADCASE "Modal"  MAXMODES  3 MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 '), e.push('  LOADCASE "Dead"  TYPE  "Linear Static"  INITCOND  "PRESET"  '), e.push('  LOADCASE "Dead"  LOADPAT  "DEAD"  SF  1 '), Math.abs(t.P_lat) > 1e-9 && (e.push('  LOADCASE "Lateral"  TYPE  "Linear Static"  INITCOND  "PRESET"  '), e.push('  LOADCASE "Lateral"  LOADPAT  "LATERAL"  SF  1 ')), e.push(""), e.push("  END"), e.push("$ END OF MODEL FILE");
    const N = e.join(`\r
`);
    return {
      filename: `Cantilever_${s.sectionInfoObj.name}.e2k`,
      content: N
    };
  }
  function Z(t, a) {
    const s = new Blob([
      a
    ], {
      type: "text/plain;charset=utf-8"
    }), i = URL.createObjectURL(s), n = document.createElement("a");
    n.href = i, n.download = t, document.body.appendChild(n), n.click(), document.body.removeChild(n), setTimeout(() => URL.revokeObjectURL(i), 1e3);
  }
  Q = function(t, a) {
    const { filename: s, content: i } = X(t, a);
    Z(s, i), console.log(`[E2K Export] ${s} (${i.length} bytes) \u2014 abrir en ETABS para validar`);
  };
});
export {
  __tla,
  k as b,
  Q as e
};
