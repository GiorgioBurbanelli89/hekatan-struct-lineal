import { a as wt, c as Bt } from "./e2kParser-2L7GKQGH.js";
function G(N) {
  return N && parseFloat(N) || 0;
}
function xt(N) {
  const A = /* @__PURE__ */ new Map(), L = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let B;
  for (; (B = L.exec(N)) !== null; ) A.set(B[1], B[2] !== void 0 ? B[2] : B[3]);
  return A;
}
function ls(N) {
  const A = N.split(/\r?\n/);
  return A.some((B) => B.trim().startsWith("TABLE:")) ? ts(A) : ss(A);
}
function ts(N) {
  var _a, _b, _c, _d, _e, _f;
  const A = [];
  let L = "";
  for (const g of N) {
    const W = g.trimEnd();
    W.endsWith("_") ? L += W.slice(0, -1) + " " : (L += W, A.push(L), L = "");
  }
  L && A.push(L);
  const B = { force: "KN", length: "m" };
  let $ = "UX,UY,UZ,RX,RY,RZ";
  const V = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Map(), ce = [], ie = [], oe = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), pe = [], Se = /* @__PURE__ */ new Map(), Ae = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), i = [], p = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
  let Q = "";
  const F = { barras: [], areas: [], selfWtMult: 0, areaMW: /* @__PURE__ */ new Map(), autoMeshJoints: /* @__PURE__ */ new Set() };
  for (const g of A) {
    const W = g.trim();
    if (!W || W.startsWith(";") || W.startsWith("File ")) continue;
    if (W.startsWith("TABLE:")) {
      const o = W.match(/TABLE:\s+"(.+?)"/);
      Q = o ? o[1].toUpperCase() : "";
      continue;
    }
    if (W === "END TABLE DATA") {
      Q = "";
      continue;
    }
    const t = xt(W);
    switch (Q) {
      case "PROGRAM CONTROL": {
        const o = t.get("CurrUnits");
        if (o) {
          const n = o.split(",").map((r) => r.trim());
          n[0] && (B.force = n[0]), n[1] && (B.length = n[1]);
        }
        break;
      }
      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const o = t.get("Material");
        o && !V.has(o) && V.set(o, { E: 0, nu: 0, G: 0 });
        break;
      }
      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const o = t.get("Material");
        if (o) {
          const n = V.get(o) || { E: 0, nu: 0, G: 0 };
          n.E = G(t.get("E1")), n.G = G(t.get("G12")), n.nu = G(t.get("U12")), n.density = G(t.get("UnitMass")), n.weight = G(t.get("UnitWeight")), V.set(o, n);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const o = t.get("Material");
        o && V.has(o) && (V.get(o).fy = G(t.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const o = t.get("SectionName");
        o && f.set(o, { material: t.get("Material") || "", shape: t.get("Shape") || "Rectangular", D: G(t.get("t3")), B: G(t.get("t2")), TF: G(t.get("tf")), TW: G(t.get("tw")), T2B: G(t.get("t2b")), TFB: G(t.get("tfb")), DIS: G(t.get("dis")), A: G(t.get("Area")), Iz: G(t.get("I33")), Iy: G(t.get("I22")), J: G(t.get("TorsConst")), As2: G(t.get("AS2")), As3: G(t.get("AS3")), MMod: t.has("MMod") ? G(t.get("MMod")) : 1, WMod: t.has("WMod") ? G(t.get("WMod")) : 1 });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const o = t.get("SectionName");
        o && ne.set(o, { h: G(t.get("Height")), b: G(t.get("Width")), t: G(t.get("WebThick")) || G(t.get("FlngThick")), tf: G(t.get("FlngThick")) || G(t.get("WebThick")), mat: t.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const o = t.get("SectionName");
        o && ne.set(o, { h: 0, b: 0, D: G(t.get("OuterDiam")), t: G(t.get("WallThick")), mat: t.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const o = t.get("SectionName");
        o && de.set(o, { mat: t.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const o = t.get("SectionName");
        o && de.set(o, { mat: t.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const o = t.get("Section");
        o && P.set(o, { material: t.get("Material") || "", type: t.get("Type") || "Shell", thickness: G(t.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const o = t.get("Joint");
        if (o) {
          const n = G(t.get("XorR")), r = G(t.get("Y")), I = G(t.get("Z"));
          fe.set(o, [n, r, I]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const o = t.get("Frame"), n = t.get("JointI"), r = t.get("JointJ");
        o && n && r && ce.push({ name: o, j1: n, j2: r });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const o = t.get("Area");
        if (o) {
          const n = parseInt(t.get("NumJoints") || "4"), r = [];
          for (let I = 1; I <= n; I++) {
            const S = t.get(`Joint${I}`);
            S && r.push(S);
          }
          r.length >= 3 && ie.push({ name: o, joints: r });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const o = t.get("Joint");
        if (o) {
          const n = [((_a = t.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = t.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = t.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = t.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = t.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = t.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          oe.set(o, n);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const o = t.get("Joint");
        o && le.set(o, ["U1", "U2", "U3", "R1", "R2", "R3"].map((n) => parseFloat(t.get(n) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const o = t.get("Frame"), n = t.get("AnalSect");
        o && n && he.set(o, n);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const o = t.get("Area"), n = t.get("Section");
        o && n && Me.set(o, n);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const o = t.get("Frame"), n = t.get("Dir"), r = G(t.get("FOverLA")), I = t.has("FOverLB") ? G(t.get("FOverLB")) : r, S = (t.get("CoordSys") ?? "GLOBAL").toUpperCase();
        if (!o || !n || !r && !I || S !== "GLOBAL") break;
        const J = (t.get("DistType") ?? "RelDist") !== "AbsDist", U = G(J ? t.get("RelDistA") : t.get("AbsDistA")), ae = J ? t.has("RelDistB") ? G(t.get("RelDistB")) : 1 : G(t.get("AbsDistB")), h = { X: 0, Y: 1, Z: 2 }[n];
        if (h !== void 0 && J && U === 0 && ae === 1 && r === I) {
          const E = ue.get(o) ?? [0, 0, 0];
          E[h] += r, ue.set(o, E);
        } else {
          const E = h !== void 0 ? [0, 1, 2].map((T) => T === h ? 1 : 0) : /^grav/i.test(n) ? [0, 0, -1] : null;
          E && F.barras.push({ frame: o, dir: E, a: U, b: ae, rel: J, fa: r, fb: I });
        }
        break;
      }
      case "FRAME AUTO MESH ASSIGNMENTS": {
        const o = t.get("Frame");
        o && /^yes$/i.test(t.get("AutoMesh") ?? "") && /^yes$/i.test(t.get("AtJoints") ?? "") && F.autoMeshJoints.add(o);
        break;
      }
      case "AREA LOADS - UNIFORM": {
        const o = t.get("Area"), n = t.get("Dir") ?? "", r = G(t.get("UnifLoad"));
        if (!o || !r) break;
        const S = /^local/i.test(t.get("CoordSys") ?? "GLOBAL") ? n === "3" ? null : void 0 : n === "X" ? [1, 0, 0] : n === "Y" ? [0, 1, 0] : n === "Z" ? [0, 0, 1] : /^grav/i.test(n) ? [0, 0, -1] : void 0;
        S !== void 0 && F.areas.push({ area: o, dir: S, q: r });
        break;
      }
      case "LOAD PATTERN DEFINITIONS": {
        const o = G(t.get("SelfWtMult"));
        o > F.selfWtMult && (F.selfWtMult = o);
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const o = t.get("Solid");
        if (o) {
          const n = [];
          for (let r = 1; r <= 8; r++) {
            const I = t.get(`Joint${r}`);
            I && n.push(I);
          }
          n.length === 8 && i.push({ name: o, joints: n });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const o = t.get("SolidProp");
        o && p.set(o, { material: t.get("Material") || "", incomp: (t.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const o = t.get("Solid"), n = t.get("SolidProp");
        o && n && R.set(o, n);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const o = t.get("Area");
        o && ge.set(o, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((n) => t.has(n) ? G(t.get(n)) : 1)), o && (t.has("MassMod") || t.has("WeightMod")) && F.areaMW.set(o, [t.has("MassMod") ? G(t.get("MassMod")) : 1, t.has("WeightMod") ? G(t.get("WeightMod")) : 1]);
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const o = t.get("Frame");
        o && Ae.set(o, G(t.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const o = t.get("Frame");
        o && Se.set(o, [G(t.get("LengthI")), G(t.get("LengthJ")), G(t.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const o = t.get("Joint");
        o && pe.push({ joint: o, fx: G(t.get("F1")), fy: G(t.get("F2")), fz: G(t.get("F3")), mx: G(t.get("M1")), my: G(t.get("M2")), mz: G(t.get("M3")) });
        break;
      }
    }
  }
  return Ut(B, $, V, f, P, fe, ce, ie, oe, he, Me, pe, Se, Ae, ge, ue, i, p, R, ne, de, le, F);
}
function ss(N) {
  const A = { force: "KN", length: "m" };
  let L = "UX,UY,UZ,RX,RY,RZ";
  const B = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), de = [], f = [], P = /* @__PURE__ */ new Map(), fe = [], ce = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), he = [], Me = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map();
  let Se = "", Ae = "";
  for (const i of N) {
    const p = i.trim();
    if (!p || p.startsWith(";")) continue;
    if (!i.startsWith(" ") && !i.startsWith("	")) {
      const F = p.toUpperCase();
      if (F === "END") break;
      F.startsWith("SHELL SECTION") ? Se = "SHELL SECTION" : F.startsWith("FRAME SECTION") ? Se = "FRAME SECTION" : Se = F.split(/\s+/)[0];
      continue;
    }
    const R = xt(p), Q = p.split(/\s+/);
    switch (Se) {
      case "SYSTEM": {
        const F = R.get("DOF");
        F && (L = F);
        const g = R.get("LENGTH");
        g && (A.length = g);
        const W = R.get("FORCE");
        W && (A.force = W);
        break;
      }
      case "JOINT": {
        const F = Q[0];
        ne.set(F, [G(R.get("X")), G(R.get("Y")), G(R.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const F = R.get("ADD"), g = R.get("DOF");
        if (F && g) {
          const W = g.split(","), t = [false, false, false, false, false, false];
          for (const o of W) {
            const n = o.toUpperCase();
            (n === "UX" || n === "U1") && (t[0] = true), (n === "UY" || n === "U2") && (t[1] = true), (n === "UZ" || n === "U3") && (t[2] = true), (n === "RX" || n === "R1") && (t[3] = true), (n === "RY" || n === "R2") && (t[4] = true), (n === "RZ" || n === "R3") && (t[5] = true);
          }
          P.set(F, t);
        }
        break;
      }
      case "MATERIAL": {
        const F = R.get("NAME");
        if (F) Ae = F, B.set(F, { E: 0, nu: 0, G: 0 });
        else if (Ae) {
          const g = B.get(Ae), W = R.get("E");
          W && (g.E = G(W));
          const t = R.get("U");
          t && (g.nu = G(t)), g.G = g.E / (2 * (1 + g.nu));
          const o = R.get("M");
          o && (g.density = G(o));
        }
        break;
      }
      case "SHELL": {
        const F = Q[0], g = R.get("J");
        R.get("SEC"), g && f.push({ name: F, joints: g.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const F = R.get("NAME");
        F && V.set(F, { material: R.get("MAT") || "", type: R.get("TYPE") || "Shell", thickness: G(R.get("TH")) });
        break;
      }
      case "FRAME": {
        const F = Q[0], g = R.get("J");
        if (g) {
          const W = g.split(",");
          W.length >= 2 && de.push({ name: F, j1: W[0], j2: W[1] });
        }
        break;
      }
      case "LOAD": {
        const F = R.get("ADD");
        F && fe.push({ joint: F, fx: G(R.get("UX")), fy: G(R.get("UY")), fz: G(R.get("UZ")), mx: G(R.get("MX")), my: G(R.get("MY")), mz: G(R.get("MZ")) });
        break;
      }
    }
  }
  return Ut(A, L, B, $, V, ne, de, f, P, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), fe, ce, ie, oe, le, he, Me, pe);
}
function Ut(N, A, L, B, $, V, ne, de, f, P, fe, ce, ie = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), Me = [], pe = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Ae, ge, ue = /* @__PURE__ */ new Map(), i) {
  var _a, _b, _c, _d;
  const p = [], R = /* @__PURE__ */ new Map(), Q = [];
  for (const [E, T] of V) R.set(E, Q.length), p.push(E), Q.push(T);
  const F = [], g = [], W = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), o = (E) => E.replace(/~\d+$/, "");
  for (const E of ne) {
    const T = R.get(E.j1), b = R.get(E.j2);
    if (T !== void 0 && b !== void 0) {
      const H = [];
      if ((_a = i == null ? void 0 : i.autoMeshJoints) == null ? void 0 : _a.has(E.name)) {
        const j = Q[T], w = Q[b], v = [w[0] - j[0], w[1] - j[1], w[2] - j[2]], q = v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
        q > 1e-12 && Q.forEach((C, z) => {
          if (z === T || z === b) return;
          const Z = ((C[0] - j[0]) * v[0] + (C[1] - j[1]) * v[1] + (C[2] - j[2]) * v[2]) / q;
          if (Z <= 1e-9 || Z >= 1 - 1e-9) return;
          Math.hypot(C[0] - j[0] - Z * v[0], C[1] - j[1] - Z * v[1], C[2] - j[2] - Z * v[2]) < 1e-3 && H.push({ s: Z, n: z });
        }), H.sort((C, z) => C.s - z.s);
      }
      const O = [0, ...H.map((j) => j.s), 1], k = [T, ...H.map((j) => j.n), b], ee = [];
      for (let j = 0; j < k.length - 1; j++) {
        const w = F.length;
        F.push([k[j], k[j + 1]]), g.push(j === 0 ? E.name : `${E.name}~${j + 1}`);
        const v = P.get(E.name);
        v && W.set(w, v), ee.push({ i: w, s0: O[j], s1: O[j + 1] });
      }
      t.set(E.name, ee);
    }
  }
  const n = F.length;
  for (const E of de) {
    const T = E.joints.map((b) => R.get(b)).filter((b) => b !== void 0);
    if (T.length >= 3) {
      const b = F.length;
      F.push(T), g.push(E.name);
      const H = fe.get(E.name);
      H && W.set(b, H);
    }
  }
  const r = F.length - n, I = [];
  for (const E of Me) {
    const T = E.joints.map((O) => R.get(O));
    if (T.some((O) => O === void 0)) continue;
    const b = F.length;
    F.push([T[0], T[1], T[3], T[2], T[4], T[5], T[7], T[6]]), g.push(E.name), I.push(b);
    const H = Se.get(E.name);
    H && W.set(b, H);
  }
  const S = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, J = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), ae = L.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let E = 0; E < F.length; E++) {
    const T = W.get(E), b = T ? B.get(T) : null, H = T ? $.get(T) : null;
    if (b || F[E].length === 2) {
      const O = b || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, k = L.get(O.material) || ae, ee = k.E || ae.E, j = k.nu || 0.3, w = k.G || ee / (2 * (1 + j));
      S.elasticities.set(E, ee), S.shearModuli.set(E, w), S.areas.set(E, O.A || O.D * O.B), S.momentsOfInertiaZ.set(E, O.Iz || O.B * O.D ** 3 / 12), S.momentsOfInertiaY.set(E, O.Iy || O.D * O.B ** 3 / 12), S.torsionalConstants.set(E, O.J || 0), S.densities.set(E, k.density || 0), O.As2 && (S.shearAreasZ ?? (S.shearAreasZ = /* @__PURE__ */ new Map()), S.shearAreasZ.set(E, O.As2)), O.As3 && (S.shearAreasY ?? (S.shearAreasY = /* @__PURE__ */ new Map()), S.shearAreasY.set(E, O.As3));
      const v = (((_b = t.get(g[E])) == null ? void 0 : _b.length) ?? 1) === 1 ? ie.get(g[E]) : void 0;
      v && (S.endOffsets ?? (S.endOffsets = /* @__PURE__ */ new Map()), S.endOffsets.set(E, v));
      const q = oe.get(o(g[E]));
      q && (S.localAngles ?? (S.localAngles = /* @__PURE__ */ new Map()), S.localAngles.set(E, q));
      const C = O;
      ((_c = O.shape) == null ? void 0 : _c.includes("Wide Flange")) || O.shape === "I" ? J.set(E, { type: "I", b: O.B, h: O.D, ...C.TF > 0 && C.TW > 0 ? { tf: C.TF, tw: C.TW, t2b: C.T2B > 0 ? C.T2B : O.B, tfb: C.TFB > 0 ? C.TFB : C.TF } : {}, name: T || "I-section" }) : /box|tube/i.test(O.shape ?? "") && C.TF > 0 && C.TW > 0 ? J.set(E, { type: "HSS", b: O.B, h: O.D, tf: C.TF, tw: C.TW, name: T }) : /^channel$/i.test(O.shape ?? "") && C.TF > 0 && C.TW > 0 ? J.set(E, { type: "C", b: O.B, h: O.D, tf: C.TF, tw: C.TW, name: T }) : /double angle/i.test(O.shape ?? "") && C.TF > 0 && C.TW > 0 ? J.set(E, { type: "2L", b: O.B, h: O.D, tf: C.TF, tw: C.TW, dis: C.DIS || 0, name: T }) : J.set(E, { type: "rect", b: O.B, h: O.D }), U.set(E, { name: T || O.shape, shape: O.shape, D: O.D > 0 ? O.D : void 0, B: O.B > 0 ? O.B : void 0, TF: C.TF > 0 ? C.TF : void 0, TW: C.TW > 0 ? C.TW : void 0, ...O.material ? { material: O.material } : {} });
      const z = T ? Ae == null ? void 0 : Ae.get(T) : void 0;
      if (z && z.t > 0 && (z.b > 0 && z.h > 0 || (z.D ?? 0) > 0)) {
        const Z = T ? ge == null ? void 0 : ge.get(T) : void 0, te = Z && ((_d = L.get(Z.mat)) == null ? void 0 : _d.E) || 0;
        J.set(E, z.D ? { type: "CFT", d: z.D, tw: z.t, name: T, ...te > 0 ? { fillE: te } : {} } : { type: "CFT", b: z.b, h: z.h, tw: z.t, ...z.tf && z.tf !== z.t ? { tf: z.tf } : {}, name: T, ...te > 0 ? { fillE: te } : {} });
      }
    } else if (H) {
      const O = L.get(H.material) || ae, k = O.E || ae.E, ee = O.nu || 0.2, j = O.G || k / (2 * (1 + ee));
      S.elasticities.set(E, k), S.shearModuli.set(E, j), S.thicknesses.set(E, H.thickness), S.poissonsRatios.set(E, ee), S.plateFormulations ?? (S.plateFormulations = /* @__PURE__ */ new Map()), S.plateFormulations.set(E, /thin/i.test(H.type) ? 1 : 0);
      const w = /membrane/i.test(H.type), v = le.get(g[E]), q = v && w ? [v[0], v[1], v[2], 0, 0, 0, 0, 0] : v;
      q ? (S.shellModifiers ?? (S.shellModifiers = /* @__PURE__ */ new Map()), S.shellModifiers.set(E, q), S.membraneModifiers ?? (S.membraneModifiers = /* @__PURE__ */ new Map()), S.membraneModifiers.set(E, q[0]), S.bendingModifiers ?? (S.bendingModifiers = /* @__PURE__ */ new Map()), S.bendingModifiers.set(E, q[3])) : w && (S.membraneModifiers ?? (S.membraneModifiers = /* @__PURE__ */ new Map()), S.membraneModifiers.set(E, 1), S.bendingModifiers ?? (S.bendingModifiers = /* @__PURE__ */ new Map()), S.bendingModifiers.set(E, 0)), S.densities.set(E, O.density || 0), U.set(E, { name: T, shape: H.type, t: H.thickness > 0 ? H.thickness : void 0, ...H.material ? { material: H.material } : {} });
    }
  }
  if (I.length) {
    let E = false;
    for (const T of I) {
      const b = pe.get(W.get(T) || ""), H = b && L.get(b.material) || ae, O = H.E || ae.E, k = H.nu || 0.2;
      S.elasticities.set(T, O), S.poissonsRatios.set(T, k), S.shearModuli.set(T, H.G || O / (2 * (1 + k))), S.densities.set(T, H.density || 0), (b == null ? void 0 : b.incomp) && (E = true), U.set(T, { name: W.get(T) || void 0, shape: "Solid", ...(b == null ? void 0 : b.material) ? { material: b.material } : {} });
    }
    S.solidIncompatible = E;
  }
  U.size && (S.sectionInfo = U);
  const h = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [E, T] of f) {
    const b = R.get(E);
    b !== void 0 && h.supports.set(b, T);
  }
  {
    const E = [];
    for (const [T, b] of ue) {
      const H = R.get(T);
      H !== void 0 && b.forEach((O, k) => {
        O > 0 && E.push({ node: H, dof: k, k: O });
      });
    }
    E.length && (h.springs = E);
  }
  for (const [E, T] of he) for (const { i: b } of t.get(E) ?? []) {
    if (F[b].length !== 2) continue;
    S.frameLoads ?? (S.frameLoads = /* @__PURE__ */ new Map()), S.frameLoads.set(b, T);
    const H = Q[F[b][0]], O = Q[F[b][1]], k = [O[0] - H[0], O[1] - H[1], O[2] - H[2]], ee = Math.hypot(k[0], k[1], k[2]);
    if (ee < 1e-9) continue;
    const j = [k[0] / ee, k[1] / ee, k[2] / ee], w = ee * ee / 12, v = [j[1] * T[2] - j[2] * T[1], j[2] * T[0] - j[0] * T[2], j[0] * T[1] - j[1] * T[0]], q = (C, z) => {
      const Z = h.loads.get(C) || [0, 0, 0, 0, 0, 0];
      for (let te = 0; te < 6; te++) Z[te] += z[te];
      h.loads.set(C, Z);
    };
    q(F[b][0], [T[0] * ee / 2, T[1] * ee / 2, T[2] * ee / 2, w * v[0], w * v[1], w * v[2]]), q(F[b][1], [T[0] * ee / 2, T[1] * ee / 2, T[2] * ee / 2, -w * v[0], -w * v[1], -w * v[2]]);
  }
  for (const E of ce) {
    const T = R.get(E.joint);
    if (T !== void 0) {
      const b = h.loads.get(T) || [0, 0, 0, 0, 0, 0];
      b[0] += E.fx, b[1] += E.fy, b[2] += E.fz, b[3] += E.mx, b[4] += E.my, b[5] += E.mz, h.loads.set(T, b);
    }
  }
  if (i) {
    const E = h.loads, T = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map();
    g.forEach((w, v) => (v < n ? b : v < n + r ? H : /* @__PURE__ */ new Map()).set(w, v));
    const O = (w) => w !== void 0 && w < n;
    for (const w of i.barras) {
      const v = t.get(w.frame);
      if (!(v == null ? void 0 : v.length) || !O(v[0].i)) continue;
      const q = Q[F[v[0].i][0]], C = Q[F[v[v.length - 1].i][1]], z = Math.hypot(C[0] - q[0], C[1] - q[1], C[2] - q[2]), Z = w.rel ? w.a * z : w.a, te = w.rel ? w.b * z : w.b, se = (_) => te > Z ? w.fa + (w.fb - w.fa) * (_ - Z) / (te - Z) : w.fa;
      for (const _ of v) {
        const Ne = Math.max(Z, _.s0 * z), Re = Math.min(te, _.s1 * z);
        if (Re - Ne <= 1e-12) continue;
        const [ye, Ce] = F[_.i];
        wt(E, T, _.i, ye, Ce, Bt(Q[ye], Q[Ce], Ne - _.s0 * z, Re - _.s0 * z, se(Ne), se(Re), w.dir));
      }
    }
    const k = (w) => {
      const v = (se, _) => [se[1] * _[2] - se[2] * _[1], se[2] * _[0] - se[0] * _[2], se[0] * _[1] - se[1] * _[0]], q = (se, _) => [se[0] - _[0], se[1] - _[1], se[2] - _[2]];
      if (w.length === 3) {
        const se = v(q(w[1], w[0]), q(w[2], w[0])), _ = Math.hypot(...se);
        return { w: [_ / 6, _ / 6, _ / 6], n: se.map((Ne) => Ne / (_ || 1)) };
      }
      const C = [0, 0, 0, 0], z = 1 / Math.sqrt(3);
      let Z = [0, 0, 0];
      for (const se of [-z, z]) for (const _ of [-z, z]) {
        const Ne = [(1 - se) * (1 - _), (1 + se) * (1 - _), (1 + se) * (1 + _), (1 - se) * (1 + _)].map((Te) => Te / 4), Re = [-(1 - _), 1 - _, 1 + _, -(1 + _)].map((Te) => Te / 4), ye = [-(1 - se), -(1 + se), 1 + se, 1 - se].map((Te) => Te / 4), Ce = [0, 1, 2].map((Te) => w.reduce((Pe, me, Ye) => Pe + Re[Ye] * me[Te], 0)), De = [0, 1, 2].map((Te) => w.reduce((Pe, me, Ye) => Pe + ye[Ye] * me[Te], 0)), Be = v(Ce, De), et = Math.hypot(...Be);
        Z = Z.map((Te, Pe) => Te + Be[Pe]);
        for (let Te = 0; Te < 4; Te++) C[Te] += Ne[Te] * et;
      }
      const te = Math.hypot(...Z) || 1;
      return { w: C, n: Z.map((se) => se / te) };
    }, ee = (w, v) => {
      const q = E.get(w) ?? [0, 0, 0, 0, 0, 0];
      for (let C = 0; C < 3; C++) q[C] += v[C];
      E.set(w, q);
    };
    for (const w of i.areas) {
      const v = H.get(w.area);
      if (v === void 0) continue;
      const q = F[v];
      if (q.length !== 3 && q.length !== 4) continue;
      const { w: C, n: z } = k(q.map((te) => Q[te])), Z = w.dir ?? z;
      q.forEach((te, se) => ee(te, Z.map((_) => _ * w.q * C[se])));
    }
    const j = i.selfWtMult;
    for (let w = 0; w < F.length; w++) {
      const v = W.get(w), q = F[w];
      if (w < n) {
        const C = v ? B.get(v) : null, z = C ? L.get(C.material) : null;
        C && C.MMod !== void 0 && C.MMod !== 1 && S.densities.has(w) && S.densities.set(w, S.densities.get(w) * C.MMod);
        const Z = j * ((z == null ? void 0 : z.weight) ?? 0) * (S.areas.get(w) ?? 0) * ((C == null ? void 0 : C.WMod) ?? 1);
        if (!Z) continue;
        const te = Q[q[0]], se = Q[q[1]], _ = Math.hypot(se[0] - te[0], se[1] - te[1], se[2] - te[2]);
        wt(E, T, w, q[0], q[1], Bt(te, se, 0, _, Z, Z, [0, 0, -1]));
      } else if (q.length === 3 || q.length === 4) {
        const C = v ? $.get(v) : null, z = C ? L.get(C.material) : null, Z = i.areaMW.get(g[w]);
        Z && S.densities.has(w) && S.densities.set(w, S.densities.get(w) * Z[0]);
        const te = j * ((z == null ? void 0 : z.weight) ?? 0) * ((C == null ? void 0 : C.thickness) ?? 0) * (Z ? Z[1] : 1);
        if (!te) continue;
        const { w: se } = k(q.map((_) => Q[_]));
        q.forEach((_, Ne) => ee(_, [0, 0, -te * se[Ne]]));
      }
    }
    T.size && (S.frameFixedEnd = T);
  }
  return { units: N, dof: A, materials: L, frameSections: B, shellSections: $, nodes: Q, nodeNames: p, nodeNameToIdx: R, elements: F, elementNames: g, elementSections: W, nodeInputs: h, elementInputs: S, sectionShapes: J, info: { nNodes: Q.length, nFrames: n, nShells: r, title: `SAP2000 (${n} frames, ${r} shells)` } };
}
function vt(N, A, L, B = {}) {
  const $ = /* @__PURE__ */ new Map(), V = [];
  let ne = 0;
  const de = (P, fe, ce) => {
    const ie = $.get(P) ?? [0, 0, 0, 0, 0, 0];
    ie[fe] += ce, $.set(P, ie);
  }, f = 1 / Math.sqrt(3);
  for (const P of L ?? []) {
    if (P.node >= 0) {
      P.dof >= 0 && P.dof <= 5 && P.k > 0 && de(P.node, P.dof, P.k);
      continue;
    }
    const fe = -P.node - 1, ce = A[fe];
    if (!ce) continue;
    if (P.dof === -2 || P.dof === -4) {
      V.push([fe, Math.round(P.k), P.dof === -4]);
      continue;
    }
    if (P.dof !== -1 && P.dof !== -3 || !(P.k > 0) || ce.length !== 3 && ce.length !== 4 || B.sinArea) continue;
    ne++;
    const ie = ce.map((i) => N[i]), oe = ie[0], le = ie[1], he = ie[2], Me = ce.length === 4 ? ie[3] : ie[0], pe = [he[0] - oe[0], he[1] - oe[1], he[2] - oe[2]], Se = ce.length === 4 ? [Me[0] - le[0], Me[1] - le[1], Me[2] - le[2]] : [le[0] - oe[0], le[1] - oe[1], le[2] - oe[2]];
    let Ae = [pe[1] * Se[2] - pe[2] * Se[1], pe[2] * Se[0] - pe[0] * Se[2], pe[0] * Se[1] - pe[1] * Se[0]];
    const ge = Math.hypot(Ae[0], Ae[1], Ae[2]);
    Ae = ge > 1e-30 ? Ae.map((i) => i / ge) : [0, 0, 1];
    const ue = new Array(ce.length).fill(0);
    if (ce.length === 3) {
      const i = [(le[1] - oe[1]) * (he[2] - oe[2]) - (le[2] - oe[2]) * (he[1] - oe[1]), (le[2] - oe[2]) * (he[0] - oe[0]) - (le[0] - oe[0]) * (he[2] - oe[2]), (le[0] - oe[0]) * (he[1] - oe[1]) - (le[1] - oe[1]) * (he[0] - oe[0])];
      ue.fill(0.5 * Math.hypot(i[0], i[1], i[2]) / 3);
    } else for (const i of [-f, f]) for (const p of [-f, f]) {
      const R = [0.25 * (1 - i) * (1 - p), 0.25 * (1 + i) * (1 - p), 0.25 * (1 + i) * (1 + p), 0.25 * (1 - i) * (1 + p)], Q = [-0.25 * (1 - p), 0.25 * (1 - p), 0.25 * (1 + p), -0.25 * (1 + p)], F = [-0.25 * (1 - i), -0.25 * (1 + i), 0.25 * (1 + i), 0.25 * (1 - i)], g = [0, 0, 0], W = [0, 0, 0];
      for (let n = 0; n < 4; n++) for (let r = 0; r < 3; r++) g[r] += Q[n] * ie[n][r], W[r] += F[n] * ie[n][r];
      const t = [g[1] * W[2] - g[2] * W[1], g[2] * W[0] - g[0] * W[2], g[0] * W[1] - g[1] * W[0]], o = Math.hypot(t[0], t[1], t[2]);
      for (let n = 0; n < 4; n++) ue[n] += R[n] * o;
    }
    ce.forEach((i, p) => {
      for (let R = 0; R < 3; R++) Math.abs(Ae[R]) > 1e-12 && de(i, R, P.k * ue[p] * Ae[R] * Ae[R]);
    });
  }
  return { nodales: $, colgados: V, deArea: ne };
}
function fs(N) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: A, elements: L, nodeInputs: B, elementInputs: $ } = N, V = { force: "KN", length: "m" };
  N.units && (N.units.force !== "KN" || N.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${N.units.force}, ${N.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const ne = N.title || "Hekatan Model", de = [], f = (t) => de.push(t), P = () => de.push(" ");
  f(`File ${ne}.$2k was saved on m/d/yy at h:mm:ss`), P(), f('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), f("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), P();
  const fe = [], ce = (t) => {
    var _a2, _b2, _c2, _d2, _e2;
    const o = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(t)) || 0, n = (_b2 = $.poissonsRatios) == null ? void 0 : _b2.get(t), r = ((_c2 = $.shearModuli) == null ? void 0 : _c2.get(t)) || 0, I = n !== void 0 ? n : o > 0 && r > 0 ? Math.max(0, Math.min(0.5, o / (2 * r) - 1)) : 0.2, S = r > 0 ? r : o > 0 ? o / (2 * (1 + I)) : 0, J = (_d2 = $.sectionShapes) == null ? void 0 : _d2.get(t), U = (J == null ? void 0 : J.type) === "CFT" && J.steelRho > 0 ? J.steelRho : ((_e2 = $.densities) == null ? void 0 : _e2.get(t)) || 0, ae = U > 0 ? `_r${+U.toPrecision(6)}` : "_r0";
    return { E: o, nu: I, G: S, rho: U, key: `MAT_${Math.round(o)}_n${I.toFixed(4)}${ae}` };
  }, ie = [], oe = [];
  if (L.forEach((t, o) => {
    t.length === 2 ? fe.push(o) : t.length === 8 ? oe.push(o) : ie.push(o);
  }), fe.length > 0) {
    f('TABLE:  "CONNECTIVITY - FRAME"');
    for (const t of fe) {
      const o = L[t];
      f(`   Frame=${t + 1}   JointI=${o[0] + 1}   JointJ=${o[1] + 1}   IsCurved=No`);
    }
    P();
  }
  if (ie.length > 0) {
    f('TABLE:  "CONNECTIVITY - AREA"');
    for (const t of ie) {
      const o = L[t], n = o.map((r, I) => `Joint${I + 1}=${r + 1}`).join("   ");
      f(`   Area=${t + 1}   NumJoints=${o.length}   ${n}`);
    }
    P();
  }
  if (oe.length > 0) {
    f('TABLE:  "CONNECTIVITY - SOLID"');
    for (const t of oe) {
      const o = L[t], n = [o[0], o[1], o[3], o[2], o[4], o[5], o[7], o[6]];
      f(`   Solid=${t + 1}   ${n.map((r, I) => `Joint${I + 1}=${r + 1}`).join("   ")}`);
    }
    P();
  }
  f('TABLE:  "COORDINATE SYSTEMS"'), f("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), P(), f('TABLE:  "DATABASE FORMAT TYPES"'), f("   UnitsCurr=Yes   OverrideE=No"), P();
  const le = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map();
  for (const t of fe) {
    const o = ((_a = $.areas) == null ? void 0 : _a.get(t)) || 0, n = ((_b = $.momentsOfInertiaZ) == null ? void 0 : _b.get(t)) || 0, r = ((_c = $.momentsOfInertiaY) == null ? void 0 : _c.get(t)) || 0, I = ((_d = $.torsionalConstants) == null ? void 0 : _d.get(t)) || 0, S = ((_e = $.elasticities) == null ? void 0 : _e.get(t)) || 0, J = ce(t).key, U = ((_f = $.shearAreasZ) == null ? void 0 : _f.get(t)) ?? 0, ae = ((_g = $.shearAreasY) == null ? void 0 : _g.get(t)) ?? 0, h = (_h = $.sectionShapes) == null ? void 0 : _h.get(t);
    let E;
    const T = (h == null ? void 0 : h.type) === "CFT" && h.d > 0 && h.tw > 0 && h.tw < h.d / 2 && !(h.b > 0 && h.h > 0);
    if (N.cftAs !== "general" && (h == null ? void 0 : h.type) === "CFT" && S > 0 && (T || h.b > 0 && h.h > 0 && h.tw > 0 && h.tw < Math.min(h.b, h.h) / 2)) {
      const k = T ? h.d - 2 * h.tw : 0, ee = T ? 0 : h.b - 2 * h.tw, j = T ? 0 : h.h - 2 * (h.tf ?? h.tw), w = T ? Math.PI * (h.d * h.d - k * k) / 4 : h.b * h.h - ee * j, v = T ? Math.PI * k * k / 4 : ee * j, C = (h.fillE > 0 ? h.fillE / S : Math.max(0.01, Math.min(1, (o - w) / v))) * S, z = 0.2, Z = h.fillRho ?? 2.4, te = `FILL_${Math.round(C)}_r${Z}`;
      he.has(te) || he.set(te, { E: C, nu: z, G: C / (2 * (1 + z)), rho: Z }), E = T ? { b: h.d, h: h.d, t: h.tw, Ec: C, nuC: z, matFill: te, D: h.d } : { b: h.b, h: h.h, t: h.tw, tf: h.tf ?? h.tw, Ec: C, nuC: z, matFill: te };
    }
    let b;
    !E && (h == null ? void 0 : h.type) === "I" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 ? b = { kind: "I", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw, t2b: h.t2b ?? h.b, tfb: h.tfb ?? h.tf } : !E && (h == null ? void 0 : h.type) === "HSS" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 ? b = { kind: "Box", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw } : !E && (h == null ? void 0 : h.type) === "C" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 ? b = { kind: "C", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw } : !E && (h == null ? void 0 : h.type) === "2L" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 && (b = { kind: "2L", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw, dis: h.dis ?? 0 });
    const H = `A${o.toPrecision(6)}_Iz${n.toPrecision(6)}_s${U.toPrecision(6)}_${ae.toPrecision(6)}${E ? E.D ? `_SDC${E.D}x${E.t}` : `_SD${E.b}x${E.h}x${E.t}` : ""}${b ? `_P${b.kind}${b.t3}x${b.t2}x${b.tf}x${b.tw}x${b.t2b ?? ""}x${b.tfb ?? ""}x${b.dis ?? ""}` : ""}`;
    if (!le.has(H)) {
      let k = 0.3, ee = 0.3;
      o > 0 && n > 0 && (k = Math.sqrt(12 * n / o), ee = o / k), le.set(H, { A: o, Iz: n, Iy: r, J: I, b: ee, h: k, matKey: J, As2: U > 0 ? U : o * 5 / 6, As3: ae > 0 ? ae : o * 5 / 6, sd: E, param: b });
    }
    const O = [...le.keys()].indexOf(H) + 1;
    Me.set(t, `SEC${O}`);
  }
  if (fe.length > 0) {
    f('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const t of fe) {
      const o = Me.get(t) || "SEC1";
      f(`   Frame=${t + 1}   AutoSelect=N.A.   AnalSect=${o}   MatProp=Default`);
    }
    P();
  }
  if (le.size > 0) {
    f('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let t = 0;
    for (const [, o] of le) {
      if (t++, o.sd) {
        f(`   SectionName=SEC${t}   Material=${o.matKey}   Shape="SD Section"   Area=${d(o.A)}   TorsConst=${d(o.J)}   I33=${d(o.Iz)}   I22=${d(o.Iy)}   I23=0   AS2=${d(o.As2)}   AS3=${d(o.As3)} _`), f("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      if (o.param) {
        const n = o.param, r = n.kind === "I" ? `Shape="I/Wide Flange"   t3=${d(n.t3)}   t2=${d(n.t2)}   tf=${d(n.tf)}   tw=${d(n.tw)}   t2b=${d(n.t2b)}   tfb=${d(n.tfb)}` : n.kind === "C" ? `Shape=Channel   t3=${d(n.t3)}   t2=${d(n.t2)}   tf=${d(n.tf)}   tw=${d(n.tw)}` : n.kind === "2L" ? `Shape="Double Angle"   t3=${d(n.t3)}   t2=${d(n.t2)}   SngAngWid=${d((n.t2 - (n.dis ?? 0)) / 2)}   tf=${d(n.tf)}   tw=${d(n.tw)}   dis=${d(n.dis ?? 0)}` : `Shape=Box/Tube   t3=${d(n.t3)}   t2=${d(n.t2)}   tf=${d(n.tf)}   tw=${d(n.tw)}`;
        f(`   SectionName=SEC${t}   Material=${o.matKey}   ${r}   FilletRadius=0   Area=${d(o.A)}   TorsConst=${d(o.J)}   I33=${d(o.Iz)}   I22=${d(o.Iy)}   I23=0   AS2=${d(o.As2)}   AS3=${d(o.As3)} _`), f("        Color=Red   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      f(`   SectionName=SEC${t}   Material=${o.matKey}   Shape=General   t3=${d(o.h)}   t2=${d(o.b)}   Area=${d(o.A)}   TorsConst=${d(o.J)}   I33=${d(o.Iz)}   I22=${d(o.Iy)}   I23=0   AS2=${d(o.As2)}   AS3=${d(o.As3)} _`), f("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    P();
  }
  const pe = [...le.values()].map((t, o) => ({ sec: t, name: `SEC${o + 1}` })).filter((t) => t.sec.sd);
  if (pe.length > 0) {
    f('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: n } of pe) f(`   SectionName=${n}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    P();
    const t = pe.filter((n) => !n.sec.sd.D), o = pe.filter((n) => n.sec.sd.D);
    if (t.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: n, name: r } of t) {
        const I = n.sd;
        f(`   SectionName=${r}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${n.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${d(I.h)}   Width=${d(I.b)}   FlngThick=${d(I.tf ?? I.t)}   WebThick=${d(I.t)}   Rotation=0 _`), f('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      P();
    }
    if (o.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: n, name: r } of o) {
        const I = n.sd;
        f(`   SectionName=${r}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${n.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${d(I.D)}   WallThick=${d(I.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), f("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      P();
    }
    if (t.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: n, name: r } of t) {
        const I = n.sd;
        f(`   SectionName=${r}   ShapeName=RELLENO   ShapeMat=${I.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${d(I.h - 2 * (I.tf ?? I.t))}   Width=${d(I.b - 2 * I.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), f("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      P();
    }
    if (o.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: n, name: r } of o) {
        const I = n.sd;
        f(`   SectionName=${r}   ShapeName=RELLENO   ShapeMat=${I.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${d(I.D - 2 * I.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      P();
    }
    f('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: n } of pe) f(`   SectionName=${n}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    P();
  }
  {
    const t = fe.filter((o) => {
      var _a2;
      const n = (_a2 = $.localAngles) == null ? void 0 : _a2.get(o);
      return n !== void 0 && isFinite(n) && Math.abs(n) > 1e-9;
    });
    if (t.length > 0) {
      f('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const o of t) f(`   Frame=${o + 1}   Angle=${d($.localAngles.get(o))}   AdvanceAxes=No`);
      P();
    }
  }
  {
    const t = $.endOffsets, o = fe.filter((n) => {
      const r = t == null ? void 0 : t.get(n);
      return !!r && (Math.abs(r[0]) > 1e-9 || Math.abs(r[1]) > 1e-9);
    });
    if (o.length > 0) {
      f('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const n of o) {
        const r = t.get(n);
        f(`   Frame=${n + 1}   Type=User   LengthI=${d(r[0])}   LengthJ=${d(r[1])}   RigidFactor=${d(r.length > 2 ? r[2] : 0)}`);
      }
      P();
    }
  }
  const Se = !!N.layeredSection && ie.length > 0, Ae = N.layeredSection, ge = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), i = $.shellModifiers, p = $.membraneModifiers, R = $.bendingModifiers, Q = (t) => !(i == null ? void 0 : i.has(t)) && Math.abs((R == null ? void 0 : R.get(t)) ?? 1) < 1e-9;
  if (!Se) for (const t of ie) {
    const o = ((_i = $.thicknesses) == null ? void 0 : _i.get(t)) || 0.1;
    (_j = $.elasticities) == null ? void 0 : _j.get(t);
    const n = ce(t).key, r = Q(t) ? 2 : ((_k = $.plateFormulations) == null ? void 0 : _k.get(t)) ?? 0, I = `t${o.toPrecision(6)}_f${r}`;
    ge.has(I) || ge.set(I, { t: o, matKey: n, formulacion: r });
    const S = [...ge.keys()].indexOf(I) + 1;
    ue.set(t, `SSEC${S}`);
  }
  if (ie.length > 0) {
    f('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const n of ie) {
      const r = Se ? Ae.name : ue.get(n) || "SSEC1";
      f(`   Area=${n + 1}   Section=${r}   MatProp=Default`);
    }
    P();
    const t = (n) => {
      const r = i == null ? void 0 : i.get(n);
      if (r) return r;
      const I = (p == null ? void 0 : p.get(n)) ?? 1, S = Q(n) ? 1 : (R == null ? void 0 : R.get(n)) ?? 1;
      return [I, I, I, S, S, S, S, S];
    }, o = ie.filter((n) => {
      const r = t(n);
      return r && r.some((I) => Math.abs(I - 1) > 1e-12);
    });
    if (o.length > 0) {
      f('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const n of o) {
        const r = t(n);
        f(`   Area=${n + 1}   f11=${d(r[0])}   f22=${d(r[1])}   f12=${d(r[2])}   m11=${d(r[3])}   m22=${d(r[4])}   m12=${d(r[5])}   v13=${d(r[6])}   v23=${d(r[7])}   MassMod=1   WeightMod=1`);
      }
      P();
    }
    if (f('TABLE:  "AREA SECTION PROPERTIES"'), Se) {
      const n = Ae, r = ((_l = n.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      f(`   Section=${n.name}   Material=${r}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${d(n.totalThickness)}   BendThick=${d(n.totalThickness)}   Color=Magenta`);
    } else {
      let n = 0;
      for (const [, r] of ge) {
        n++;
        const I = r.formulacion === 2 ? "Membrane" : r.formulacion === 3 ? "Plate-Thin" : r.formulacion === 4 ? "Plate-Thick" : r.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", S = r.formulacion === 3 || r.formulacion === 4 ? "No" : "Yes";
        f(`   Section=SSEC${n}   Material=${r.matKey}   MatAngle=0   AreaType=Shell   Type=${I}   DrillDOF=${S}   Thickness=${d(r.t)}   BendThick=${d(r.t)}   Color=Cyan`);
      }
    }
    if (P(), Se) {
      f('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const n = Ae;
      for (const r of n.layers) {
        const I = r.angle ?? 0, S = r.numIntPts ?? 3;
        f(`   Section=${n.name}   LayerName=${r.name}   Distance=${d(r.distance)}   Thickness=${d(r.thickness)}   Type=Shell   NumIntPts=${S}   Material=${r.material}   MatAngle=${d(I * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      P();
    }
  }
  f('TABLE:  "JOINT COORDINATES"');
  for (let t = 0; t < A.length; t++) {
    const o = A[t];
    f(`   Joint=${t + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${d(o[0])}   Y=${d(o[1])}   Z=${d(o[2])}   SpecialJt=No`);
  }
  if (P(), B.supports && B.supports.size > 0) {
    f('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [t, o] of B.supports) {
      if (!o.some((r) => r)) continue;
      const n = (r) => r ? "Yes" : "No";
      f(`   Joint=${t + 1}   U1=${n(o[0])}   U2=${n(o[1])}   U3=${n(o[2])}   R1=${n(o[3])}   R2=${n(o[4])}   R3=${n(o[5])}`);
    }
    P();
  }
  {
    const t = N.patrones ? $.areaSpringsExport : void 0, o = vt(A, L, B.springs, { sinArea: !!(t == null ? void 0 : t.size) }).nodales;
    if (t == null ? void 0 : t.size) {
      f('TABLE:  "AREA SPRING ASSIGNMENTS"');
      for (const [n, r] of t) f(`   Area=${n + 1}   Type=Simple   Stiffness=${d(r.ks)}   SimpleType=${r.comp ? '"Compression Only"' : '"Tension and Compression"'}   Face=Bottom   Dir1Type="Object Axes"   Dir=3`);
      P();
    }
    if (o.size > 0) {
      f('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [n, r] of [...o].sort((I, S) => I[0] - S[0])) f(`   Joint=${n + 1}   CoordSys=Global   U1=${d(r[0])}   U2=${d(r[1])}   U3=${d(r[2])}   R1=${d(r[3])}   R2=${d(r[4])}   R3=${d(r[5])}`);
      P();
    }
  }
  const F = B.diaphragms;
  if (F && F.size > 0) {
    const t = /* @__PURE__ */ new Map();
    for (const [n, r] of F) {
      const I = Math.round(r);
      if (I === 0) continue;
      const S = Math.abs(I);
      t.has(S) || t.set(S, []), t.get(S).push(n);
    }
    const o = [...t].filter(([, n]) => n.length >= 2);
    if (o.length > 0) {
      f('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [n] of o) f(`   Name=DIAPH${n}   CoordSys=GLOBAL   Axis=Z`);
      P(), f('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [n, r] of o) for (const I of r) f(`   Joint=${I + 1}   Constraint=DIAPH${n}`);
      P();
    }
  }
  const g = B.cargasPorPatron;
  if (N.patrones && g) {
    const t = $.frameLoadsPorPatron ?? {}, o = [.../* @__PURE__ */ new Set([...Object.keys(g), ...Object.keys(t)])], n = (U) => /^dead$/i.test(U) ? "Dead" : /^(dne|sdead|scm|superdead)$/i.test(U) ? '"Super Dead"' : /^(live|viva|l)$/i.test(U) ? "Live" : "Other", r = $.selfWeight ?? 0;
    f('TABLE:  "LOAD PATTERN DEFINITIONS"');
    for (const U of o) f(`   LoadPat=${U}   DesignType=${n(U)}   SelfWtMult=${/^dead$/i.test(U) ? d(r) : 0}`);
    P(), f('TABLE:  "LOAD CASE DEFINITIONS"');
    for (const U of o) f(`   Case=${U}   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=${n(U)}   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes`);
    P(), f('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"');
    for (const U of o) f(`   Case=${U}   LoadType="Load pattern"   LoadName=${U}   LoadSF=1`);
    P();
    const I = [];
    for (const U of o) for (const [ae, h] of g[U] ?? /* @__PURE__ */ new Map()) h.some((E) => Math.abs(E) > 1e-12) && I.push(`   Joint=${ae + 1}   LoadPat=${U}   CoordSys=GLOBAL   F1=${d(h[0])}   F2=${d(h[1])}   F3=${d(h[2])}   M1=${d(h[3])}   M2=${d(h[4])}   M3=${d(h[5])}`);
    I.length && (f('TABLE:  "JOINT LOADS - FORCE"'), I.forEach(f), P());
    const S = [];
    for (const U of o) for (const [ae, h] of t[U] ?? /* @__PURE__ */ new Map()) {
      const E = L[ae];
      if (!E || E.length !== 2) continue;
      const T = A[E[0]], b = A[E[1]], H = Math.hypot(b[0] - T[0], b[1] - T[1], b[2] - T[2]);
      ["X", "Y", "Z"].forEach((O, k) => {
        Math.abs(h[k]) < 1e-12 || S.push(`   Frame=${ae + 1}   LoadPat=${U}   CoordSys=GLOBAL   Type=Force   Dir=${O}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${d(H)}   FOverLA=${d(h[k])}   FOverLB=${d(h[k])}`);
      });
    }
    S.length && (f('TABLE:  "FRAME LOADS - DISTRIBUTED"'), S.forEach(f), P());
    const J = $.combos ?? [];
    if (J.length) {
      f('TABLE:  "COMBINATION DEFINITIONS"');
      for (const U of J) U.items.forEach(([ae, h], E) => f(E === 0 ? `   ComboName=${U.name}   ComboType="Linear Add"   AutoDesign=No   CaseType="Linear Static"   CaseName=${ae}   ScaleFactor=${d(h)}   SteelDesign=None   ConcDesign=None   AlumDesign=None   ColdDesign=None` : `   ComboName=${U.name}   CaseType="Linear Static"   CaseName=${ae}   ScaleFactor=${d(h)}`));
      P();
    }
  } else {
    const t = N.selfWtMult ?? 1;
    f('TABLE:  "LOAD PATTERN DEFINITIONS"'), f(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${t}`), P(), f('TABLE:  "LOAD CASE DEFINITIONS"'), f('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), P(), f('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), f('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), P();
    const o = $.frameLoads, n = /* @__PURE__ */ new Map();
    if ((_m = B.loads) == null ? void 0 : _m.forEach((I, S) => n.set(S, [...I])), o && o.size > 0) {
      const I = (S, J) => {
        const U = n.get(S) ?? [0, 0, 0, 0, 0, 0];
        n.set(S, U.map((ae, h) => ae - J[h]));
      };
      for (const [S, J] of o) {
        const U = L[S];
        if (!U || U.length !== 2) continue;
        const ae = A[U[0]], h = A[U[1]], E = [h[0] - ae[0], h[1] - ae[1], h[2] - ae[2]], T = Math.hypot(E[0], E[1], E[2]);
        if (T < 1e-9) continue;
        const b = [E[0] / T, E[1] / T, E[2] / T], H = T * T / 12, O = [b[1] * J[2] - b[2] * J[1], b[2] * J[0] - b[0] * J[2], b[0] * J[1] - b[1] * J[0]];
        I(U[0], [J[0] * T / 2, J[1] * T / 2, J[2] * T / 2, H * O[0], H * O[1], H * O[2]]), I(U[1], [J[0] * T / 2, J[1] * T / 2, J[2] * T / 2, -H * O[0], -H * O[1], -H * O[2]]);
      }
    }
    if (n.size > 0) {
      f('TABLE:  "JOINT LOADS - FORCE"');
      for (const [I, S] of n) S.some((J) => Math.abs(J) > 1e-12) && f(`   Joint=${I + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${d(S[0])}   F2=${d(S[1])}   F3=${d(S[2])}   M1=${d(S[3])}   M2=${d(S[4])}   M3=${d(S[5])}`);
      P();
    }
    const r = $.frameLoads;
    if (r && r.size > 0) {
      f('TABLE:  "FRAME LOADS - DISTRIBUTED"');
      for (const [I, S] of r) {
        const J = L[I];
        if (!J || J.length !== 2) continue;
        const U = A[J[0]], ae = A[J[1]], h = Math.hypot(ae[0] - U[0], ae[1] - U[1], ae[2] - U[2]);
        ["X", "Y", "Z"].forEach((E, T) => {
          Math.abs(S[T]) < 1e-12 || f(`   Frame=${I + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${E}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${d(h)}   FOverLA=${d(S[T])}   FOverLB=${d(S[T])}`);
        });
      }
      P();
    }
  }
  const W = /* @__PURE__ */ new Map();
  for (let t = 0; t < L.length; t++) {
    const { E: o, nu: n, G: r, rho: I, key: S } = ce(t);
    W.has(S) || W.set(S, { E: o, nu: n, G: r, rho: I });
  }
  if (oe.length > 0) {
    const t = $.solidIncompatible === false ? "No" : "Yes", o = /* @__PURE__ */ new Map();
    for (const n of oe) {
      const { E: r, nu: I, G: S, rho: J, key: U } = ce(n);
      W.has(U) || W.set(U, { E: r, nu: I, G: S, rho: J }), o.has(U) || o.set(U, `SOL${o.size + 1}`);
    }
    f('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [n, r] of o) f(`   SolidProp=${r}   Material=${n}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${t}   Color=Yellow`);
    P(), f('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const n of oe) f(`   Solid=${n + 1}   SolidProp=${o.get(ce(n).key)}`);
    P();
  }
  for (const [t, o] of he) W.has(t) || W.set(t, o);
  f('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [t] of W) f(`   Material=${t}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  P(), f('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [t, o] of W) f(`   Material=${t}   UnitWeight=${d(o.rho * 9.80665)}   UnitMass=${d(o.rho)}   E1=${d(o.E)}   G12=${d(o.G)}   U12=${d(o.nu)}   A1=9.9E-06`);
  P(), f('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [t] of W) f(`   Material=${t}   Fc=${d($.fcExport ?? 27579)}   eFc=${d($.fcExport ?? 27579)}   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0   CoupModType="Modified Darwin-Pecknold"`);
  return P(), f('TABLE:  "PROGRAM CONTROL"'), f(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${V.force}, ${V.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), P(), f("END TABLE DATA"), f(""), de.join(`\r
`);
}
function d(N) {
  return N === 0 || Math.abs(N) < 1e-15 ? "0" : Math.abs(N) >= 1e6 || Math.abs(N) < 1e-3 && Math.abs(N) > 0 ? N.toExponential(8) : parseFloat(N.toPrecision(10)).toString();
}
function os(N, A, L = 0.05) {
  const B = A.map(([$, V]) => `${(+$).toFixed(4)} ${(+V).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${N}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${L}  SPECTYPE "USER"  `, `  FUNCTION "${N}"  TIMEVAL "${B}"  `];
}
function ns(N) {
  const { name: A, func: L, modalCase: B = "Modal", sfX: $ = 9.81, sfY: V = 9.81 } = N, ne = [`  LOADCASE "${A}"  TYPE  "Response Spectrum"  MODALCASE  "${B}"  `];
  return $ && ne.push(`  LOADCASE "${A}"  ACCEL  "U1"  FUNC  "${L}"  SF  ${$}  `), V && ne.push(`  LOADCASE "${A}"  ACCEL  "U2"  FUNC  "${L}"  SF  ${V}  `), ne;
}
function Gt(N) {
  const { name: A = "Modal", ritz: L = false, nModes: B = 12 } = N;
  return L ? [`  LOADCASE "${A}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${B} MINMODES  1 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${A}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${B} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function Es(N) {
  var _a;
  const A = (_a = N.e2kModel) == null ? void 0 : _a.rawSections;
  let L = A && A.size > 0 ? is(A, N.e2kModel) : cs(N);
  return N.seismicNEC && (L = as(L, N.seismicNEC)), L;
}
function as(N, A) {
  const L = N.includes(`\r
`) ? `\r
` : `
`, B = N.split(/\r?\n/), $ = A.name ?? "NEC", V = os($, A.points, A.dampRatio ?? 0.05), ne = A.modalCase ?? "Modal", de = ns({ name: A.caseName ?? "Sismo NEC", func: $, modalCase: ne, sfX: A.sfX, sfY: A.sfY });
  let f = [];
  const P = (fe) => B.some((ce) => fe.test(ce));
  if (A.modal) {
    const fe = new RegExp(`^\\s*LOADCASE\\s+"${ne}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let ce = B.length - 1; ce >= 0; ce--) fe.test(B[ce]) && B.splice(ce, 1);
    f = Gt({ name: ne, ritz: !!A.modal.ritz, nModes: A.modal.nModes });
  } else P(new RegExp(`LOADCASE\\s+"${ne}"\\s+TYPE\\s+"Modal`)) || (f = Gt({ name: ne }));
  return kt(B, "FUNCTIONS", V), kt(B, "LOAD CASES", [...f, ...de]), B.join(L);
}
function kt(N, A, L) {
  const B = N.findIndex((ne) => ne.trim() === `$ ${A}`);
  if (B >= 0) {
    N.splice(B + 1, 0, ...L);
    return;
  }
  const $ = N.findIndex((ne) => ne.trim() === "END"), V = $ >= 0 ? $ : N.length;
  N.splice(V, 0, `$ ${A}`, ...L, "");
}
function is(N, A) {
  const L = [], B = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  L.push("$ File exported from Hekatan Struct Lineal (round-trip)"), L.push("");
  for (const $ of B) {
    const V = N.get($);
    if (!(!V || V.length === 0)) {
      L.push(`$ ${$}`);
      for (const ne of V) L.push(ne);
      L.push("");
    }
  }
  for (const [$, V] of N) if (!B.includes($) && V.length !== 0) {
    L.push(`$ ${$}`);
    for (const ne of V) L.push(ne);
    L.push("");
  }
  return L.push("  END"), L.push("$ END OF MODEL FILE"), L.join(`\r
`);
}
function cs(N) {
  var _a, _b, _c, _d, _e, _f, _g;
  const { nodes: A, elements: L, nodeInputs: B, elementInputs: $, title: V, units: ne } = N, de = N.shellLoads ?? $.shellSurfaceLoads;
  let f;
  de instanceof Map && (f = /* @__PURE__ */ new Map(), de.forEach((e, s) => {
    f.set(s, typeof e == "number" ? { value: e } : e);
  }));
  const P = N.shellAngles ?? $.shellAngles, fe = $.cargaDeArea, ce = !!(f && f.size > 0), ie = $.selfWeight, oe = $.frameLoads, le = (N.weightMode ?? "auto") === "auto" && ie !== void 0, he = /* @__PURE__ */ new Map(), Me = (e, s) => {
    const a = he.get(e) ?? [0, 0, 0, 0, 0, 0];
    he.set(e, a.map((c, l) => c + s[l]));
  }, pe = /* @__PURE__ */ new Set();
  if (le) {
    if (oe) for (const [e, s] of oe) {
      const a = L[e];
      if (!a || a.length !== 2) continue;
      const c = A[a[0]], l = A[a[1]], M = [l[0] - c[0], l[1] - c[1], l[2] - c[2]], m = Math.hypot(M[0], M[1], M[2]);
      if (m < 1e-9) continue;
      const u = [M[0] / m, M[1] / m, M[2] / m], y = m * m / 12, X = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]];
      Me(a[0], [s[0] * m / 2, s[1] * m / 2, s[2] * m / 2, y * X[0], y * X[1], y * X[2]]), Me(a[1], [s[0] * m / 2, s[1] * m / 2, s[2] * m / 2, -y * X[0], -y * X[1], -y * X[2]]), pe.add(e);
    }
    if (ie && ie > 0) {
      const s = $.endOffsets;
      L.forEach((a, c) => {
        var _a2, _b2, _c2;
        const l = ((_a2 = $.densities) == null ? void 0 : _a2.get(c)) ?? 0;
        if (l) {
          if (a.length === 2) {
            const M = ((_b2 = $.areas) == null ? void 0 : _b2.get(c)) ?? 0, m = A[a[0]], u = A[a[1]], y = [u[0] - m[0], u[1] - m[1], u[2] - m[2]];
            let X = Math.hypot(y[0], y[1], y[2]);
            const D = s == null ? void 0 : s.get(c);
            if (D) {
              const ke = Math.hypot(y[0], y[1]);
              ke > 1e-9 && Math.abs(Math.atan2(Math.abs(y[2]), ke)) * 180 / Math.PI < 20 && (X = Math.max(X - D[0] - D[1], 0));
            }
            const Y = M * X * l * 9.80665 * ie, x = Math.hypot(y[0], y[1], y[2]) || 1, re = [y[0] / x, y[1] / x], K = X * X / 12, Ee = -Y / (X || 1), ve = K * re[1] * Ee, St = -K * re[0] * Ee;
            Me(a[0], [0, 0, -Y / 2, ve, St, 0]), Me(a[1], [0, 0, -Y / 2, -ve, -St, 0]);
          } else if (a.length === 4) {
            const M = ((_c2 = $.thicknesses) == null ? void 0 : _c2.get(c)) ?? 0, m = a.map((x) => A[x]);
            let u = 0, y = 0, X = 0;
            for (let x = 0; x < 4; x++) {
              const re = m[x], K = m[(x + 1) % 4];
              u += re[1] * K[2] - re[2] * K[1], y += re[2] * K[0] - re[0] * K[2], X += re[0] * K[1] - re[1] * K[0];
            }
            const D = Math.hypot(u, y, X) / 2, Y = M * D * l * 9.80665 * ie;
            for (const x of a) Me(x, [0, 0, -Y / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const Se = (e, s) => {
    const a = he.get(e);
    return [s[0] - ((a == null ? void 0 : a[0]) ?? 0), s[1] - ((a == null ? void 0 : a[1]) ?? 0), s[2] - (ce ? (fe == null ? void 0 : fe.get(e)) ?? 0 : 0) - ((a == null ? void 0 : a[2]) ?? 0)];
  }, Ae = (e, s) => {
    const a = he.get(e);
    return [(s[3] ?? 0) - ((a == null ? void 0 : a[3]) ?? 0), (s[4] ?? 0) - ((a == null ? void 0 : a[4]) ?? 0), (s[5] ?? 0) - ((a == null ? void 0 : a[5]) ?? 0)];
  }, ge = "N", ue = "MM", i = [], p = (e) => Math.round(e * 1e4) / 1e4, R = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), Q = 1e3, F = 1e3, g = (e) => e * F, W = (e) => e * Q, t = (e) => e * Q, o = (e) => e * Q * F, n = (e) => e * Q / F ** 2, r = (e) => e * Q / F ** 3, I = /* @__PURE__ */ new Date(), S = `${I.getMonth() + 1}/${I.getDate()}/${I.getFullYear()}  ${I.getHours()}:${String(I.getMinutes()).padStart(2, "0")}:${String(I.getSeconds()).padStart(2, "0")}`;
  i.push(`$ File   "Hekatan_export.e2k"  saved ${S} in ETABS 22.6.0`), i.push(""), i.push("$ PROGRAM INFORMATION"), i.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), i.push(""), i.push("$ CONTROLS"), i.push(`  UNITS  "${ge}"  "${ue}"  "C"  `), i.push('  TITLE1  "Hekatan Struct Lineal export"  '), V && i.push(`  TITLE2  "${V}"  `), i.push("  PREFERENCE  MERGETOL 0.001"), i.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), i.push("");
  const J = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set();
  A.forEach((e) => {
    J.add(p(e[0])), U.add(p(e[1]));
  });
  const ae = [...J].sort((e, s) => e - s), h = [...U].sort((e, s) => e - s);
  i.push("$ GRIDS"), i.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), ae.forEach((e, s) => {
    const a = s < 26 ? String.fromCharCode(65 + s) : String.fromCharCode(65 + s % 26).repeat(Math.floor(s / 26) + 1);
    i.push(`  GRID "G1"  LABEL "${a}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), h.forEach((e, s) => {
    i.push(`  GRID "G1"  LABEL "${s + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), i.push("");
  const E = 3, T = 0.5, b = /* @__PURE__ */ new Map();
  A.forEach((e) => {
    const s = p(e[2]);
    b.set(s, (b.get(s) ?? 0) + 1);
  });
  const H = /* @__PURE__ */ new Set();
  A.forEach((e) => H.add(p(e[2])));
  const O = [...H].sort((e, s) => e - s);
  let k = O.filter((e) => (b.get(e) ?? 0) >= E);
  if (k.length > 1) {
    const e = [k[0]];
    for (const s of k.slice(1)) s - e[e.length - 1] < T ? e[e.length - 1] = s : e.push(s);
    k = e;
  }
  O.length || O.push(0, 3), k.length || (k = [O[0], O[O.length - 1]]), k[0] !== O[0] && k.unshift(O[0]), k[k.length - 1] !== O[O.length - 1] && k.push(O[O.length - 1]);
  const ee = [], j = /* @__PURE__ */ new Map();
  ee.push("Base"), j.set(k[0], "Base");
  for (let e = 1; e < k.length; e++) {
    const s = `Level_${e}`;
    ee.push(s), j.set(k[e], s);
  }
  const w = (e) => {
    const s = p(e);
    if (j.has(s)) return { story: j.get(s), dz: 0 };
    for (let c = 0; c < k.length; c++) if (k[c] >= s) return { story: j.get(k[c]), dz: p(k[c] - s) };
    const a = k[k.length - 1];
    return { story: j.get(a), dz: p(a - s) };
  };
  i.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = k.length - 1; e >= 1; e--) i.push(`  STORY "${ee[e]}"  HEIGHT ${p(g(k[e] - k[e - 1]))} MASTERSTORY "Yes"  `);
  k.length > 0 && i.push(`  STORY "Base"  ELEV ${p(g(k[0]))} `), i.push(""), L.some((e) => e.length === 4), i.push("$ DIAPHRAGM NAMES"), i.push('  DIAPHRAGM "D1"    TYPE RIGID'), i.push(""), i.push("$ MATERIAL PROPERTIES");
  const v = 980665e-8, q = (e) => {
    var _a2, _b2, _c2;
    const s = (_a2 = $.sectionShapes) == null ? void 0 : _a2.get(e);
    if ((s == null ? void 0 : s.type) === "CFT" && s.steelRho > 0) return s.steelRho * 9.80665;
    const a = (_b2 = $.densities) == null ? void 0 : _b2.get(e);
    if (a === void 0) return;
    const c = a > 100 ? a * v : a * 9.80665, l = (_c2 = $.deckSections) == null ? void 0 : _c2.get(e);
    if (l && l.tc > 0) {
      const M = l.tc + (l.sr > 0 ? l.hr * (l.wrt + l.wrb) / 2 / l.sr : 0);
      return (c * l.tc - l.w) / M;
    }
    return c;
  }, C = (e) => {
    var _a2;
    const s = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, a = q(e);
    return `${s}|${a === void 0 ? "-" : a.toFixed(4)}`;
  }, z = /* @__PURE__ */ new Set();
  (_a = $.elasticities) == null ? void 0 : _a.forEach((e, s) => z.add(C(s)));
  const Z = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map();
  let se = 0, _ = 0;
  for (const e of z) {
    const s = parseFloat(e.split("|")[0]), a = e.split("|")[1], c = s >= 1e8, l = c ? `Steel_${++se}` : `Conc_${++_}`;
    Z.set(e, l), te.set(e, c);
    const M = a !== "-" ? parseFloat(a) : c ? 76.97 : 24, m = n(s), u = r(M), y = (() => {
      const Y = N.elementInputs.poissonsRatios;
      if (Y) {
        for (const [x, re] of Y) if (C(x) === e) return re;
      }
    })(), X = y !== void 0 ? y : c ? 0.3 : 0.2, D = c ? 117e-7 : 1e-5;
    if (c) {
      i.push(`  MATERIAL  "${l}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${R(u)}`), i.push(`  MATERIAL  "${l}"    SYMTYPE "Isotropic"  E ${p(m)}  U ${X}  A ${D}`);
      const Y = 345e3, x = 45e4;
      i.push(`  MATERIAL  "${l}"  FY ${p(n(Y))}  FU ${p(n(x))}  FYE ${p(n(Y * 1.1))}  FUE ${p(n(x * 1.1))}`);
    } else i.push(`  MATERIAL  "${l}"    TYPE "Concrete"    WEIGHTPERVOLUME ${R(u)}`), i.push(`  MATERIAL  "${l}"    SYMTYPE "Isotropic"  E ${p(m)}  U ${X}  A ${D}`), i.push(`  MATERIAL  "${l}"    FC ${p(n(24e3))}`);
  }
  const Ne = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = $.sectionShapes) == null ? void 0 : _b.forEach((a, c) => {
      var _a2;
      if ((a == null ? void 0 : a.type) !== "CFT" || !(a.fillE > 0) || !((((_a2 = $.elasticities) == null ? void 0 : _a2.get(c)) ?? 0) > 0)) return;
      const M = (a.fillRho ?? 2.4) * 9.80665, m = `${a.fillE}|${M.toFixed(4)}`;
      let u = e.get(m);
      u || (u = `ConcFill_${e.size + 1}`, e.set(m, u), i.push(`  MATERIAL  "${u}"    TYPE "Concrete"    WEIGHTPERVOLUME ${R(r(M))}`), i.push(`  MATERIAL  "${u}"    SYMTYPE "Isotropic"  E ${p(n(a.fillE))}  U 0.2  A 1.0e-5`), i.push(`  MATERIAL  "${u}"    FC ${p(n(24e3))}`)), Ne.set(c, u);
    });
  }
  i.push(""), i.push("$ FRAME SECTIONS");
  const Re = /* @__PURE__ */ new Set(), ye = /* @__PURE__ */ new Map(), Ce = /* @__PURE__ */ new Map(), De = 0.05;
  L.forEach((e, s) => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const a = (_a2 = $.sectionShapes) == null ? void 0 : _a2.get(s), c = ((_b2 = $.elasticities) == null ? void 0 : _b2.get(s)) ?? 0, l = Z.get(C(s)) || "Conc_1", M = te.get(C(s)) ?? c >= 1e8, m = ((_c2 = $.areas) == null ? void 0 : _c2.get(s)) ?? 0, u = ((_d2 = $.momentsOfInertiaZ) == null ? void 0 : _d2.get(s)) ?? 0, y = ((_e2 = $.momentsOfInertiaY) == null ? void 0 : _e2.get(s)) ?? 0, X = ((_f2 = $.torsionalConstants) == null ? void 0 : _f2.get(s)) ?? 0;
    let D = (a == null ? void 0 : a.type) || "rect", Y = (a == null ? void 0 : a.h) ?? 0, x = (a == null ? void 0 : a.b) ?? 0, re = (a == null ? void 0 : a.d) ?? 0;
    const K = (a == null ? void 0 : a.tf) ?? 0, Ee = (a == null ? void 0 : a.tw) ?? 0;
    if (!a && Y <= 0 && x <= 0 && re <= 0 && m > 0 && u > 0 && y > 0) {
      const Le = (_g2 = $.cantos) == null ? void 0 : _g2.get(s), _e3 = (_h = $.anchos) == null ? void 0 : _h.get(s);
      Y = Le && Le > 0 ? Le : Math.sqrt(12 * u / m), x = _e3 && _e3 > 0 ? _e3 : m / Y, (!isFinite(Y) || Y < De) && (Y = De), (!isFinite(x) || x < De) && (x = De), D = "general";
    } else Y <= 0 && x <= 0 && re <= 0 && m > 0 && (u > 0 ? (Y = Math.sqrt(12 * u / m), x = m / Y) : Y = x = Math.sqrt(m), (!isFinite(Y) || Y < De) && (Y = De), (!isFinite(x) || x < De) && (x = De), D = "rect");
    Y <= 0 && x <= 0 && re <= 0 && (Y = 0.3, x = 0.3, D = "rect");
    const ke = (a == null ? void 0 : a.name) ? `NAME_${a.name}` : `${D}_${p(Y)}_${p(x)}_${p(re)}_${p(K)}_${p(Ee)}_${l}`;
    (a == null ? void 0 : a.name) && !Ce.has(ke) && Ce.set(ke, a.name);
    let $e = Ce.get(ke);
    if (!$e) {
      const Le = M ? "S" : "C";
      D === "general" ? $e = `${Le}_G${Re.size + 1}` : D === "rect" ? $e = `${Le}_R${Math.round(x * 100)}x${Math.round(Y * 100)}` : D === "circ" ? $e = `${Le}_C_D${Math.round(re * 100)}` : D === "I" ? $e = `${Le}_I${Math.round(Y * 100)}x${Math.round(x * 100)}` : D === "HSS" ? $e = `${Le}_HSS${Math.round(x * 100)}x${Math.round(Y * 100)}x${Math.round(Ee * 1e3)}` : $e = `${Le}_Sec${Re.size + 1}`, Ce.set(ke, $e);
    }
    if (ye.set(s, $e), Re.has($e)) return;
    Re.add($e);
    const qe = Ne.get(s);
    if (D === "CFT" && qe && re > 0 && Ee > 0 && !(Y > 0 && x > 0)) {
      i.push(`  FRAMESECTION  "${$e}"  MATERIAL "${l}"  SHAPE "Filled Steel Pipe"  D ${p(g(re))} T ${p(g(Ee))} FILLMATERIAL "${qe}"`);
      return;
    }
    if (D === "CFT" && qe && Y > 0 && x > 0 && Ee > 0) {
      i.push(`  FRAMESECTION  "${$e}"  MATERIAL "${l}"  SHAPE "Filled Steel Tube"  D ${p(g(Y))} B ${p(g(x))} TF ${p(g(K > 0 ? K : Ee))} TW ${p(g(Ee))} FILLMATERIAL "${qe}"`);
      return;
    }
    const Qe = a, Qt = !((Qe == null ? void 0 : Qe.t2b) > 0) || Math.abs(Qe.t2b - x) < 1e-9 && Math.abs((Qe.tfb ?? K) - K) < 1e-9;
    if (D === "I" && Y > 0 && x > 0 && K > 0 && Ee > 0 && Qt) {
      i.push(`  FRAMESECTION  "${$e}"  MATERIAL "${l}"  SHAPE "Steel I/Wide Flange"  D ${p(g(Y))} B ${p(g(x))} TF ${p(g(K))} TW ${p(g(Ee))} `);
      return;
    }
    if (D === "HSS" && Y > 0 && x > 0 && K > 0 && Ee > 0) {
      i.push(`  FRAMESECTION  "${$e}"  MATERIAL "${l}"  SHAPE "Steel Tube"  D ${p(g(Y))} B ${p(g(x))} TF ${p(g(K))} TW ${p(g(Ee))} `);
      return;
    }
    if (D === "C" && Y > 0 && x > 0 && K > 0 && Ee > 0) {
      i.push(`  FRAMESECTION  "${$e}"  MATERIAL "${l}"  SHAPE "Steel Channel"  D ${p(g(Y))} B ${p(g(x))} TF ${p(g(K))} TW ${p(g(Ee))} `);
      return;
    }
    if (D === "2L" && Y > 0 && x > 0 && K > 0 && Ee > 0) {
      i.push(`  FRAMESECTION  "${$e}"  MATERIAL "${l}"  SHAPE "Steel Double Angle"  D ${p(g(Y))} B ${p(g(x))} TF ${p(g(K))} TW ${p(g(Ee))} DIS ${p(g((Qe == null ? void 0 : Qe.dis) ?? 0))} `);
      return;
    }
    const es = m > 0 && u > 0 && y > 0;
    let Oe;
    D === "general" || es ? Oe = "General" : D === "I" ? Oe = "Steel I/Wide Flange" : D === "HSS" ? Oe = "Steel Tube" : D === "CFT" ? Oe = "Filled Steel Tube" : D === "pipe" ? Oe = "Steel Pipe" : D === "L" ? Oe = "Steel Angle" : D === "C" ? Oe = "Steel Channel" : D === "2C" ? Oe = "Steel Double Channel" : D === "circ" ? Oe = "Concrete Circle" : Oe = "Concrete Rectangular";
    let we = `  FRAMESECTION  "${$e}"  MATERIAL "${l}"  SHAPE "${Oe}"`;
    if (Oe === "General") {
      const Le = ((_i = $.shearAreasZ) == null ? void 0 : _i.get(s)) || m * 5 / 6, _e3 = ((_j = $.shearAreasY) == null ? void 0 : _j.get(s)) || m * 5 / 6;
      we += `  D ${p(g(Y))} B ${p(g(x))} AREA ${R(m * 1e6)} AS2 ${R(Le * 1e6)} AS3 ${R(_e3 * 1e6)} I33 ${R(u * 1e12)} I22 ${R(y * 1e12)} TORSION ${R((X || u + y) * 1e12)} S33POS ${R(2 * u / Y * 1e9)} S33NEG ${R(2 * u / Y * 1e9)} S22POS ${R(2 * y / x * 1e9)} S22NEG ${R(2 * y / x * 1e9)} Z33 ${R(2 * u / Y * 1e9)} Z22 ${R(2 * y / x * 1e9)} R33 ${R(Math.sqrt(u / m) * 1e3)} R22 ${R(Math.sqrt(y / m) * 1e3)} `, i.push(we);
      return;
    }
    Y && (we += `  D ${p(g(Y))}`), x && (we += `  B ${p(g(x))}`), re && !Y && (we += `  D ${p(g(re))}`), K && (we += `  TF ${p(g(K))}`), Ee && (we += `  TW ${p(g(Ee))}`), i.push(we);
  }), i.push("");
  const Be = /* @__PURE__ */ new Map();
  let et = 0;
  A.forEach((e) => {
    const { dz: s } = w(e[2]), a = `${p(e[0])},${p(e[1])},${s}`;
    Be.has(a) || Be.set(a, `${++et}`);
  });
  const Te = /* @__PURE__ */ new Map(), Pe = [];
  {
    const e = vt(A, L, B.springs).nodales, s = /* @__PURE__ */ new Map();
    for (const [a, c] of e) {
      const l = c.map((u, y) => y < 3 ? u * Q / F : u * Q * F), M = l.map((u) => +u.toPrecision(12)).join("|");
      let m = s.get(M);
      if (!m) {
        m = `SPR${s.size + 1}`, s.set(M, m);
        const u = ["UX", "UY", "UZ", "RX", "RY", "RZ"], y = l.map((X, D) => `${u[D]}  ${+X.toPrecision(12)}`);
        Pe.push(`  POINTSPRING  "${m}"  NONLINEARSPECOPTION  "LINKS"  ${y.join(" ")} `);
      }
      Te.set(a, m);
    }
    Pe.length && (i.push("$ POINT SPRING PROPERTIES"), Pe.forEach((a) => i.push(a)), i.push(""));
  }
  i.push("$ POINT COORDINATES");
  for (const [e, s] of Be) {
    const [a, c, l] = e.split(",").map(Number);
    i.push(l ? `  POINT "${s}"  ${p(g(a))} ${p(g(c))} ${p(g(l))} ` : `  POINT "${s}"  ${p(g(a))} ${p(g(c))} `);
  }
  i.push("");
  const me = (e) => {
    const s = A[e], { story: a, dz: c } = w(s[2]), l = `${p(s[0])},${p(s[1])},${c}`;
    return { pt: Be.get(l) || "1", story: a };
  }, Ye = (e) => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    const s = [], a = (_a2 = N.propertyModifiers) == null ? void 0 : _a2.get(e);
    a && a.some((D) => Math.abs(D - 1) > 1e-9) && s.push(`PROPMODIFIERS "${a.map((D) => p(D)).join(" ")}"`);
    const c = (_b2 = $.localAngles) == null ? void 0 : _b2.get(e);
    c !== void 0 && isFinite(c) && Math.abs(c) > 1e-9 && s.push(`ANG ${p(c)}`);
    const l = (_c2 = $.momentReleases) == null ? void 0 : _c2.get(e);
    if (l && l.some((D) => D)) {
      const D = [];
      l.length === 12 ? (l[0] && D.push("PI"), l[1] && D.push("V2I"), l[2] && D.push("V3I"), l[3] && D.push("TI"), l[4] && D.push("M2I"), l[5] && D.push("M3I"), l[6] && D.push("PJ"), l[7] && D.push("V2J"), l[8] && D.push("V3J"), l[9] && D.push("TJ"), l[10] && D.push("M2J"), l[11] && D.push("M3J")) : l.length === 6 && (l[0] && D.push("TI"), l[1] && D.push("M2I"), l[2] && D.push("M3I"), l[3] && D.push("TJ"), l[4] && D.push("M2J"), l[5] && D.push("M3J")), D.length > 0 && s.push(`RELEASE "${D.join(" ")}"`);
    }
    const M = (_d2 = $.insertionPoints) == null ? void 0 : _d2.get(e);
    M && (Math.abs(M[0]) > 1e-9 || Math.abs(M[1]) > 1e-9) && s.push(`LATEROFFSET ${p(g(M[0]))} TRANSOFFSET ${p(g(M[1]))}`);
    const m = (_e2 = $.rigidOffsets) == null ? void 0 : _e2.get(e), u = (_f2 = $.endOffsets) == null ? void 0 : _f2.get(e), y = u ? [u[0], u[1]] : m, X = u && u.length > 2 ? u[2] : 0;
    return y && (Math.abs(y[0]) > 1e-9 || Math.abs(y[1]) > 1e-9) && s.push(`LENGTHOFFI ${p(g(y[0]))} LENGTHOFFJ ${p(g(y[1]))} RIGIDZONE ${p(X)}`), s.length > 0 ? ` ${s.join(" ")} ` : "";
  }, tt = [], pt = /* @__PURE__ */ new Set(), Ze = /* @__PURE__ */ new Map();
  L.forEach((e, s) => {
    if (e.length !== 2) return;
    const a = Yt(A, e);
    if (a === "BEAM") return;
    const c = A[e[0]][2] <= A[e[1]][2] ? e[0] : e[1], l = A[e[0]][2] <= A[e[1]][2] ? e[1] : e[0];
    if (Math.abs(A[c][0] - A[l][0]) > 1e-6 || Math.abs(A[c][1] - A[l][1]) > 1e-6) return;
    const M = me(c), m = ye.get(s) || `Sec_${s}`, u = `${M.pt}_${m}_${a}`;
    Ze.has(u) || Ze.set(u, []), Ze.get(u).push({ i: s, bot: c, top: l, zBot: p(A[c][2]), zTop: p(A[l][2]), planPt: M.pt, secName: m, type: a });
  }), Ze.forEach((e, s) => {
    e.sort((c, l) => c.zBot - l.zBot);
    let a = 0;
    for (let c = 1; c <= e.length; c++) if (c === e.length || Math.abs(e[c].zBot - e[c - 1].zTop) > 1e-6) {
      const M = e.slice(a, c);
      M.length >= 1 && (tt.push({ elemIndices: M.map((m) => m.i), planPt: M[0].planPt, bottomNodeIdx: M[0].bot, topNodeIdx: M[M.length - 1].top, secName: M[0].secName, type: M[0].type, nSegments: M.length }), M.forEach((m) => pt.add(m.i))), a = c;
    }
  }), i.push("$ LINE CONNECTIVITIES");
  const st = [], Xe = (e) => ee.indexOf(e), At = /* @__PURE__ */ new Map(), dt = (e, s, a, c, l, M, m, u) => {
    const y = me(c), X = me(a);
    u !== void 0 && At.set(u, { name: e, story: y.story });
    const D = Xe(y.story) - Xe(X.story);
    D <= 0 ? i.push(`  LINE  "${e}"  BEAM  "${X.pt}"  "${y.pt}"  0`) : i.push(`  LINE  "${e}"  ${s}  "${X.pt}"  "${y.pt}"  ${D}`);
    const Y = $.meshAtIntersections === false;
    st.push(`  LINEASSIGN  "${e}"  "${y.story}"  SECTION "${l}" ${M} MINNUMSTA ${m} AUTOMESH "${Y ? "NO" : "YES"}"  MESHATINTERSECTIONS "${Y ? "NO" : "YES"}"  `);
  }, Tt = /* @__PURE__ */ new Map();
  tt.forEach((e, s) => {
    const a = Ye(e.elemIndices[0]), c = [];
    let l = [];
    e.elemIndices.forEach((M, m) => {
      l.push(M);
      const [u, y] = L[M], X = A[u][2] >= A[y][2] ? u : y;
      (w(A[X][2]).dz === 0 || m === e.elemIndices.length - 1) && (c.push(l), l = []);
    }), c.forEach((M) => {
      const [m, u] = L[M[0]], y = A[m][2] <= A[u][2] ? m : u, [X, D] = L[M[M.length - 1]], Y = A[X][2] >= A[D][2] ? X : D;
      Xe(me(Y).story) - Xe(me(y).story);
      let x = `C${s + 1}`;
      for (let re = 1; ; re++) {
        const K = i.length;
        dt(x, e.type, y, Y, e.secName, a, M.length);
        const Ee = i[K], ve = Tt.get(x);
        if (ve === void 0) {
          Tt.set(x, Ee);
          break;
        }
        if (i.splice(K, i.length - K), ve === Ee) break;
        st.pop(), x = `C${s + 1}_${re}`;
      }
    });
  }), L.forEach((e, s) => {
    if (e.length !== 2 || pt.has(s)) return;
    const a = Yt(A, e), c = ye.get(s) || `Sec_${s}`, l = Ye(s), M = A[e[0]][2] <= A[e[1]][2] ? e[0] : e[1], m = A[e[0]][2] <= A[e[1]][2] ? e[1] : e[0];
    dt(`E${s + 1}`, a === "BEAM" ? "BRACE" : a, M, m, c, l, 3, s);
  }), i.push("");
  const We = N.weightMode ?? "auto", Fe = /* @__PURE__ */ new Set();
  i.push("$ POINT ASSIGNS"), (_c = B.supports) == null ? void 0 : _c.forEach((e, s) => {
    const a = [];
    if (e[0] && a.push("UX"), e[1] && a.push("UY"), e[2] && a.push("UZ"), e[3] && a.push("RX"), e[4] && a.push("RY"), e[5] && a.push("RZ"), a.length > 0) {
      const c = me(s), l = c.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", M = Te.has(s) ? ` SPRINGPROP "${Te.get(s)}" ` : "";
      i.push(`  POINTASSIGN  "${c.pt}"  "${c.story}"  RESTRAINT "${a.join(" ")}" ${l}${M} `), Fe.add(`${c.pt}@${c.story}`);
    }
  });
  for (const [e, s] of Te) {
    const a = me(e);
    Fe.has(`${a.pt}@${a.story}`) || (i.push(`  POINTASSIGN  "${a.pt}"  "${a.story}"  SPRINGPROP "${s}" `), Fe.add(`${a.pt}@${a.story}`));
  }
  const Wt = !!(B.diaphragms && [...B.diaphragms.values()].some((e) => e !== 0)), Mt = N.diaphragm ?? "auto", ot = Mt === "d1" || Mt === "auto" && Wt, He = /* @__PURE__ */ new Set();
  B.diaphragms && B.diaphragms.forEach((e, s) => {
    e !== 0 && He.add(s);
  }), ot && He.size ? He.forEach((e) => {
    const s = me(e), a = `${s.pt}@${s.story}`;
    !Fe.has(a) && s.story !== "Base" && (i.push(`  POINTASSIGN  "${s.pt}"  "${s.story}"  DIAPH "D1"  `), Fe.add(a));
  }) : ot && tt.forEach((e) => {
    for (const s of e.elemIndices) {
      const [a, c] = L[s], l = A[a][2] >= A[c][2] ? a : c, M = me(l), m = `${M.pt}@${M.story}`;
      !Fe.has(m) && M.story !== "Base" && (i.push(`  POINTASSIGN  "${M.pt}"  "${M.story}"  DIAPH "D1"  `), Fe.add(m));
    }
  }), We === "manual" && B.loads && B.loads.forEach((e, s) => {
    const [a, c, l] = Se(s, e);
    if (Math.abs(a) < 1e-10 && Math.abs(c) < 1e-10 && Math.abs(l) < 1e-10) return;
    const M = me(s), m = `${M.pt}@${M.story}`;
    Fe.has(m) || (i.push(`  POINTASSIGN  "${M.pt}"  "${M.story}"  DIAPH "DISCONNECTED"  `), Fe.add(m));
  }), i.push(""), i.push("$ LINE ASSIGNS"), st.forEach((e) => i.push(e)), i.push("");
  const Ie = [], $t = $.areaObjects, mt = /* @__PURE__ */ new Set(), gt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map();
  $t == null ? void 0 : $t.forEach((e) => e.cells.forEach((s) => mt.add(s))), L.forEach((e, s) => {
    if (e.length === 4 || e.length === 3) {
      const a = A[e[0]], c = A[e[1]], l = A[e[2]], M = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], m = [l[0] - a[0], l[1] - a[1], l[2] - a[2]], u = M[1] * m[2] - M[2] * m[1], y = M[2] * m[0] - M[0] * m[2], X = M[0] * m[1] - M[1] * m[0], D = Math.sqrt(u * u + y * y + X * X), Y = D > 1e-10 && Math.abs(X) / D < 0.5;
      Ie.push({ idx: s, el: e, isWall: Y }), mt.has(s) && Ie.pop();
    }
  });
  const be = (() => {
    for (const [e, s] of te) if (!s) return Z.get(e);
    return Z.values().next().value || "Conc_1";
  })();
  $t == null ? void 0 : $t.forEach((e, s) => {
    Ie.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && gt.set(e.cells[0], e.q), e.ang !== void 0 && ut.set(e.cells[0], e.ang);
  });
  const xe = "DECK";
  let nt = false;
  const at = [], It = (e) => {
    const s = N.elementInputs.plateFormulations, a = Ie.find((l) => l.isWall === e), c = s && a ? s.get(a.idx) : void 0;
    return c === 2 ? "Membrane" : c === 1 ? "ShellThin" : "ShellThick";
  }, Nt = (e, s) => {
    const a = N.elementInputs.thicknesses, c = Ie.find((l) => l.isWall === e);
    return (c ? a == null ? void 0 : a.get(c.idx) : void 0) ?? (a == null ? void 0 : a.values().next().value) ?? s;
  }, Ot = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], Ke = (e) => {
    var _a2;
    const a = (_a2 = $.shellModifiers) == null ? void 0 : _a2.get(e);
    if (a && a.length >= 8) return a.slice(0, 8);
    const c = $.membraneModifiers, l = $.bendingModifiers, M = c == null ? void 0 : c.get(e), m = l == null ? void 0 : l.get(e);
    if (M === void 0 && m === void 0) return null;
    const u = M ?? 1, y = m ?? 1;
    return [u, u, u, y, y, y, y, y];
  }, Lt = (e, s) => {
    const a = Ie.filter((m) => m.isWall === s), c = /* @__PURE__ */ new Map();
    for (const m of a) {
      const u = Ke(m.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      c.set(u.map((y) => p(y)).join(","), u);
    }
    if (c.size === 0) return "";
    c.size > 1 && console.warn(`[e2k] "${e}": ${c.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const l = c.values().next().value, M = Ot.map((m, u) => Math.abs(l[u] - 1) > 1e-9 ? `${m} ${p(l[u])}` : "").filter(Boolean);
    return M.length ? `  SHELLPROP  "${e}"  ${M.join(" ")} ` : "";
  }, Rt = N.elementInputs.thicknesses, Dt = N.elementInputs.plateFormulations, ze = (e) => {
    var _a2;
    const s = Rt == null ? void 0 : Rt.get(e.idx), a = Dt == null ? void 0 : Dt.get(e.idx), c = Ke(e.idx), l = (_a2 = N.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), M = l ? [l.tc, l.hr, l.wrt, l.wrb, l.sr, l.w].map((m) => p(m)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${s ?? "-"}|${a ?? "-"}|${c ? c.map((m) => p(m)).join(",") : "-"}|${C(e.idx)}|${M}`;
  }, it = (e) => {
    var _a2;
    if ((_a2 = N.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const s = Ke(e);
    return s ? Math.abs(s[3]) < 1e-9 && Math.abs(s[4]) < 1e-9 : false;
  }, Je = /* @__PURE__ */ new Map();
  let Ht = 0, zt = 0, Jt = 0;
  for (const e of Ie) {
    const s = ze(e);
    if (Je.has(s)) continue;
    const a = e.isWall, c = !a && it(e.idx), l = a ? ++zt : c ? ++Jt : ++Ht, M = C(e.idx);
    Je.set(s, { nombre: (a ? "Muro" : c ? xe : "Losa") + (l === 1 ? "" : String(l)), isWall: a, mem: c, t: Rt == null ? void 0 : Rt.get(e.idx), pf: Dt == null ? void 0 : Dt.get(e.idx), idx: e.idx, mat: Z.get(M) ?? be, acero: te.get(M) ?? false });
  }
  const Ve = (e) => {
    var _a2;
    return ((_a2 = Je.get(ze(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, Ct = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", jt = (e, s) => {
    const a = Ie.find((M) => ze(M) === s), c = a ? Ke(a.idx) ?? null : null;
    if (!c) return "";
    const l = Ot.map((M, m) => Math.abs(c[m] - 1) > 1e-9 ? `${M} ${p(c[m])}` : "").filter(Boolean);
    return l.length ? `  SHELLPROP  "${e}"  ${l.join(" ")} ` : "";
  }, je = Ie.find((e) => !e.isWall), Pt = Ie.find((e) => e.isWall), ct = /* @__PURE__ */ new Set();
  je && ct.add(ze(je)), Pt && ct.add(ze(Pt));
  const Ft = [...Je.entries()].filter(([e]) => !ct.has(e)), rt = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = N.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, _t = (e) => e * Q / F ** 2, bt = (e, s) => {
    const a = (c) => R(g(c));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${be}"  DECKMATERIAL "${be}"  DECKSLABDEPTH ${a(s.tc)} DECKRIBDEPTH ${a(s.hr)} DECKRIBWIDTHTOP ${a(s.wrt)} DECKRIBWIDTHBOTTOM ${a(s.wrb)} DECKRIBSPACING ${a(s.sr)} DECKSHEARTHICKNESS ${a(76e-5)} DECKUNITWEIGHT ${R(_t(s.w))} SHEARSTUDDIAM ${a(0.019)} SHEARSTUDHEIGHT ${a(0.1)} SHEARSTUDFU 400 `;
  };
  if (Ie.some((e) => !e.isWall)) {
    nt = !!je && it(je.idx);
    const e = Nt(false, 0.15);
    if (nt) {
      i.push("$ DECK PROPERTIES");
      const a = [...Je.values()].find((l) => l.nombre === xe), c = rt(je == null ? void 0 : je.idx);
      (a == null ? void 0 : a.acero) ? i.push(`  SHELLPROP  "${xe}"  PROPTYPE  "Slab"  MATERIAL "${a.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${p(g(e))} `) : c ? i.push(bt(xe, c)) : i.push(`  SHELLPROP  "${xe}"  PROPTYPE  "Slab"  MATERIAL "${be}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${p(g(e))} `);
    } else i.push("$ SLAB PROPERTIES"), i.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${be}"  MODELINGTYPE "${It(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${p(g(e))} `);
    const s = Lt(nt ? xe : "Losa", false);
    s && i.push(s), i.push("");
  }
  if (Ie.some((e) => e.isWall)) {
    i.push("$ WALL PROPERTIES");
    const e = Nt(true, 0.2), s = It(true);
    i.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${be}"  MODELINGTYPE "${s}"  WALLTHICKNESS ${p(g(e))} `);
    const a = Lt("Muro", true);
    a && i.push(a), i.push("");
  }
  if (Ft.length) {
    i.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, s] of Ft) {
      const a = s.t ?? (s.isWall ? 0.2 : 0.15);
      i.push(s.isWall ? `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Wall"  MATERIAL "${s.mat ?? be}"  MODELINGTYPE "${Ct(s.pf)}"  WALLTHICKNESS ${p(g(a))} ` : s.mem && s.acero ? `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Slab"  MATERIAL "${s.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${p(g(a))} ` : s.mem && rt(s.idx) ? bt(s.nombre, rt(s.idx)) : s.mem ? `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Slab"  MATERIAL "${be}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${p(g(a))} ` : `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Slab"  MATERIAL "${be}"  MODELINGTYPE "${Ct(s.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${p(g(a))} `);
      const c = jt(s.nombre, e);
      c && i.push(c);
    }
    i.push("");
  }
  if (Ie.length > 0) {
    i.push("$ AREA CONNECTIVITIES");
    const e = [];
    Ie.forEach((s, a) => {
      const { el: c, isWall: l } = s, M = l ? `W${a + 1}` : `F${a + 1}`, m = l ? "PANEL" : "FLOOR", u = c.map((y) => me(y));
      if (l) {
        const y = (re) => ee.indexOf(re);
        if (new Set(u.map((re) => re.pt)).size === 4) {
          const re = Math.max(...u.map((Ee) => y(Ee.story))), K = u.map((Ee) => re - y(Ee.story));
          i.push(`  AREA "${M}"  ${m}  4  "${u[0].pt}"  "${u[1].pt}"  "${u[2].pt}"  "${u[3].pt}"  ${K.join("  ")}  `), e.push(`  AREAASSIGN  "${M}"  "${ee[re]}"  SECTION "${Ve(s)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const D = A[c[0]][2] <= A[c[2]][2] ? 0 : 2, Y = A[c[1]][2] <= A[c[3]][2] ? 1 : 3;
        i.push(`  AREA "${M}"  ${m}  4  "${u[D].pt}"  "${u[Y].pt}"  "${u[Y].pt}"  "${u[D].pt}"  1  1  0  0  `);
        const x = u[D === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${M}"  "${x}"  SECTION "${Ve(s)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const y = u.length, X = (K) => ee.indexOf(K), D = Math.max(...u.map((K) => X(K.story))), Y = u.map((K) => D - X(K.story)), x = ee[D] ?? u[0].story;
        i.push(`  AREA "${M}"  ${m}  ${y}  ` + u.map((K) => `"${K.pt}"`).join("  ") + "  " + Y.join("  ") + "  ");
        const re = ut.get(s.idx) ?? (P == null ? void 0 : P.get(s.idx));
        e.push(it(s.idx) ? `  AREAASSIGN  "${M}"  "${x}"  SECTION "${Ve(s)}"  ANG ${p(re ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${M}"  "${x}"  SECTION "${Ve(s)}" ${ot && (!He.size || (L[s.idx] ?? []).every((K) => He.has(K))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), at.push({ name: M, story: x, idx: s.idx });
      }
    }), i.push(""), i.push("$ AREA ASSIGNS"), e.forEach((s) => i.push(s)), i.push("");
  }
  const Zt = We === "manual" ? 0 : ie ?? 1;
  i.push("$ LOAD PATTERNS");
  const Ge = ((_d = N.loadPatterns) == null ? void 0 : _d.length) ? N.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: Zt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Ge) {
    let s;
    e.type === "Dead" ? s = We === "manual" ? 0 : e.selfWeightMultiplier ?? ie ?? 1 : (s = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${e.type ?? "Other"}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), i.push(`  LOADPATTERN "${e.name}"  TYPE  "${e.type ?? "Other"}"  SELFWEIGHT  ${s}`);
  }
  i.push("");
  const Ue = N.loadPatternDestino && Ge.some((e) => e.name === N.loadPatternDestino) ? N.loadPatternDestino : ((_e = Ge.find((e) => e.type === "Dead")) == null ? void 0 : _e.name) ?? Ge[0].name, lt = [], ft = /* @__PURE__ */ new Map(), yt = (e, s) => {
    const a = ft.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let c = 0; c < 6; c++) a[c] += s[c] ?? 0;
    ft.set(e, a);
  }, Xt = Ue === (((_f = Ge.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Ge[0].name), Kt = We === "manual" || !Xt || le;
  if (B.loads && B.loads.size > 0 && B.loads.forEach((e, s) => {
    const [a, c, l] = Se(s, e), [M, m, u] = Ae(s, e);
    yt(s, [a, c, Kt ? l : 0, M, m, u]);
  }), B.moments && B.moments.size > 0 && B.moments.forEach((e, s) => {
    yt(s, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), ft.forEach((e, s) => {
    if (e.every((c) => Math.abs(c) <= 1e-10)) return;
    const a = me(s);
    lt.push(`  POINTLOAD  "${a.pt}"  "${a.story}"  TYPE "FORCE"  LC "${Ue}"  FX ${R(t(e[0]))}  FY ${R(t(e[1]))}  FZ ${R(t(e[2]))}  MX ${R(o(e[3]))}  MY ${R(o(e[4]))}  MZ ${R(o(e[5]))}`);
  }), lt.length > 0 && (i.push("$ POINT OBJECT LOADS"), lt.forEach((e) => i.push(e)), i.push("")), le && pe.size > 0) {
    const e = [];
    for (const s of pe) {
      const a = oe.get(s), c = At.get(s);
      if (!c) continue;
      const l = (M) => R(W(M) / F);
      Math.abs(a[2]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "${a[2] < 0 ? "GRAV" : "Z"}"  LC "${Ue}"  FVAL ${l(Math.abs(a[2]))}`), Math.abs(a[0]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "X"  LC "${Ue}"  FVAL ${l(a[0])}`), Math.abs(a[1]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "Y"  LC "${Ue}"  FVAL ${l(a[1])}`);
    }
    e.length && (i.push("$ FRAME OBJECT LOADS"), e.forEach((s) => i.push(s)), i.push(""));
  }
  if (f && f.size > 0 && at.length > 0) {
    const e = [];
    for (const s of at) {
      const a = gt.get(s.idx), c = a !== void 0 ? { value: a } : f.get(s.idx);
      if (!c || Math.abs(c.value) < 1e-12) continue;
      const l = c.dir ?? "GRAV", M = l === "GRAV" ? -c.value : c.value;
      e.push(`  AREALOAD  "${s.name}"  "${s.story}"  TYPE "UNIFF"  DIR "${l}"  LC "${c.pattern ?? Ue}"  FVAL ${R(W(M) / (F * F))}`);
    }
    e.length > 0 && (i.push("$ SHELL OBJECT LOADS"), e.forEach((s) => i.push(s)), i.push(""));
  }
  i.push("$ ANALYSIS OPTIONS"), i.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), i.push('  PDELTA  METHOD "NONE"  '), i.push("");
  const Et = We === "manual";
  i.push("$ MASS SOURCE"), i.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${Et ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${Et ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "Yes"    LUMPATSTORIES "No"    ISDEFAULT "Yes"  `), Et || i.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), i.push(""), i.push("$ LOAD CASES");
  const Vt = ((_g = N.loadCases) == null ? void 0 : _g.length) ? N.loadCases : Ge.map((e) => ({ name: e.name, type: "Linear Static", patterns: [{ pattern: e.name, scaleFactor: 1 }] }));
  for (const e of Vt) {
    i.push(`  LOADCASE "${e.name}"  TYPE  "${e.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const s of e.patterns ?? []) i.push(`  LOADCASE "${e.name}"  LOADPAT  "${s.pattern}"  SF ${s.scaleFactor} `);
  }
  const qt = N.modalModes ?? 12;
  i.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), i.push(`  LOADCASE "Modal"  MAXMODES ${qt}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), i.push("");
  const ht = N.loadCombinations;
  if (ht && ht.length) {
    i.push("$ LOAD COMBINATIONS");
    for (const e of ht) {
      i.push(`  COMBO "${e.name}"  TYPE "${e.type ?? "Linear Add"}"  `);
      for (const s of e.cases ?? []) i.push(`  COMBO "${e.name}"  LOADCASE  "${s.case}"  SF ${s.scaleFactor} `);
    }
    i.push("");
  }
  return i.push("  END"), i.push("$ END OF MODEL FILE"), i.join(`\r
`);
}
function Yt(N, A) {
  const L = N[A[0]], B = N[A[1]], $ = Math.abs(B[2] - L[2]), V = Math.sqrt((B[0] - L[0]) ** 2 + (B[1] - L[1]) ** 2), ne = $ > V * 0.5;
  return ne && V > 0.01 ? "BRACE" : ne ? "COLUMN" : "BEAM";
}
export {
  fs as a,
  Es as e,
  vt as m,
  ls as p
};
