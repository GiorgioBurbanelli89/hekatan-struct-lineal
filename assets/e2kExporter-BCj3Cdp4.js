import { a as we, c as Be } from "./e2kParser-2L7GKQGH.js";
function G(N) {
  return N && parseFloat(N) || 0;
}
function Ye(N) {
  const A = /* @__PURE__ */ new Map(), R = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let B;
  for (; (B = R.exec(N)) !== null; ) A.set(B[1], B[2] !== void 0 ? B[2] : B[3]);
  return A;
}
function ls(N) {
  const A = N.split(/\r?\n/);
  return A.some((B) => B.trim().startsWith("TABLE:")) ? es(A) : ss(A);
}
function es(N) {
  var _a, _b, _c, _d, _e, _f;
  const A = [];
  let R = "";
  for (const g of N) {
    const J = g.trimEnd();
    J.endsWith("_") ? R += J.slice(0, -1) + " " : (R += J, A.push(R), R = "");
  }
  R && A.push(R);
  const B = { force: "KN", length: "m" };
  let $ = "UX,UY,UZ,RX,RY,RZ";
  const et = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), Et = /* @__PURE__ */ new Map(), rt = [], ct = [], nt = /* @__PURE__ */ new Map(), ft = /* @__PURE__ */ new Map(), At = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map(), Mt = [], dt = /* @__PURE__ */ new Map(), Tt = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map(), Pt = /* @__PURE__ */ new Map(), i = [], S = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let V = "";
  const P = { barras: [], areas: [], selfWtMult: 0, areaMW: /* @__PURE__ */ new Map(), autoMeshJoints: /* @__PURE__ */ new Set(), windPats: /* @__PURE__ */ new Set() };
  for (const g of A) {
    const J = g.trim();
    if (!J || J.startsWith(";") || J.startsWith("File ")) continue;
    if (J.startsWith("TABLE:")) {
      const o = J.match(/TABLE:\s+"(.+?)"/);
      V = o ? o[1].toUpperCase() : "";
      continue;
    }
    if (J === "END TABLE DATA") {
      V = "";
      continue;
    }
    const e = Ye(J);
    switch (V) {
      case "PROGRAM CONTROL": {
        const o = e.get("CurrUnits");
        if (o) {
          const n = o.split(",").map((l) => l.trim());
          n[0] && (B.force = n[0]), n[1] && (B.length = n[1]);
        }
        break;
      }
      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const o = e.get("Material");
        o && !et.has(o) && et.set(o, { E: 0, nu: 0, G: 0 });
        break;
      }
      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const o = e.get("Material");
        if (o) {
          const n = et.get(o) || { E: 0, nu: 0, G: 0 };
          n.E = G(e.get("E1")), n.G = G(e.get("G12")), n.nu = G(e.get("U12")), n.density = G(e.get("UnitMass")), n.weight = G(e.get("UnitWeight")), et.set(o, n);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const o = e.get("Material");
        o && et.has(o) && (et.get(o).fy = G(e.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const o = e.get("SectionName");
        o && f.set(o, { material: e.get("Material") || "", shape: e.get("Shape") || "Rectangular", D: G(e.get("t3")), B: G(e.get("t2")), TF: G(e.get("tf")), TW: G(e.get("tw")), T2B: G(e.get("t2b")), TFB: G(e.get("tfb")), DIS: G(e.get("dis")), A: G(e.get("Area")), Iz: G(e.get("I33")), Iy: G(e.get("I22")), J: G(e.get("TorsConst")), As2: G(e.get("AS2")), As3: G(e.get("AS3")), MMod: e.has("MMod") ? G(e.get("MMod")) : 1, WMod: e.has("WMod") ? G(e.get("WMod")) : 1 });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const o = e.get("SectionName");
        o && at.set(o, { h: G(e.get("Height")), b: G(e.get("Width")), t: G(e.get("WebThick")) || G(e.get("FlngThick")), tf: G(e.get("FlngThick")) || G(e.get("WebThick")), mat: e.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const o = e.get("SectionName");
        o && at.set(o, { h: 0, b: 0, D: G(e.get("OuterDiam")), t: G(e.get("WallThick")), mat: e.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const o = e.get("SectionName");
        o && mt.set(o, { mat: e.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const o = e.get("SectionName");
        o && mt.set(o, { mat: e.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const o = e.get("Section");
        o && F.set(o, { material: e.get("Material") || "", type: e.get("Type") || "Shell", thickness: G(e.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const o = e.get("Joint");
        if (o) {
          const n = G(e.get("XorR")), l = G(e.get("Y")), I = G(e.get("Z"));
          Et.set(o, [n, l, I]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const o = e.get("Frame"), n = e.get("JointI"), l = e.get("JointJ");
        o && n && l && rt.push({ name: o, j1: n, j2: l });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const o = e.get("Area");
        if (o) {
          const n = parseInt(e.get("NumJoints") || "4"), l = [];
          for (let I = 1; I <= n; I++) {
            const p = e.get(`Joint${I}`);
            p && l.push(p);
          }
          l.length >= 3 && ct.push({ name: o, joints: l });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const o = e.get("Joint");
        if (o) {
          const n = [((_a = e.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = e.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = e.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = e.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = e.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = e.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          nt.set(o, n);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const o = e.get("Joint");
        o && ft.set(o, ["U1", "U2", "U3", "R1", "R2", "R3"].map((n) => parseFloat(e.get(n) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const o = e.get("Frame"), n = e.get("AnalSect");
        o && n && At.set(o, n);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const o = e.get("Area"), n = e.get("Section");
        o && n && It.set(o, n);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const o = e.get("Frame"), n = e.get("Dir"), l = e.get("LoadPat") ?? "", I = G(e.get("FOverLA")), p = e.has("FOverLB") ? G(e.get("FOverLB")) : I, X = (e.get("CoordSys") ?? "GLOBAL").toUpperCase();
        if (!o || !n || !I && !p || X !== "GLOBAL") break;
        const x = (e.get("DistType") ?? "RelDist") !== "AbsDist", it = G(x ? e.get("RelDistA") : e.get("AbsDistA")), h = x ? e.has("RelDistB") ? G(e.get("RelDistB")) : 1 : G(e.get("AbsDistB")), E = { X: 0, Y: 1, Z: 2 }[n];
        if (E !== void 0 && x && it === 0 && h === 1 && I === p) {
          const d = Pt.get(o) ?? [0, 0, 0];
          d[E] += I, Pt.set(o, d);
        } else {
          const d = E !== void 0 ? [0, 1, 2].map((b) => b === E ? 1 : 0) : /^grav/i.test(n) ? [0, 0, -1] : null;
          d && P.barras.push({ frame: o, dir: d, a: it, b: h, rel: x, fa: I, fb: p, pat: l });
        }
        break;
      }
      case "FRAME AUTO MESH ASSIGNMENTS": {
        const o = e.get("Frame");
        o && /^yes$/i.test(e.get("AutoMesh") ?? "") && /^yes$/i.test(e.get("AtJoints") ?? "") && P.autoMeshJoints.add(o);
        break;
      }
      case "AREA LOADS - UNIFORM": {
        const o = e.get("Area"), n = e.get("Dir") ?? "", l = G(e.get("UnifLoad"));
        if (!o || !l) break;
        const p = /^local/i.test(e.get("CoordSys") ?? "GLOBAL") ? n === "3" ? null : void 0 : n === "X" ? [1, 0, 0] : n === "Y" ? [0, 1, 0] : n === "Z" ? [0, 0, 1] : /^grav/i.test(n) ? [0, 0, -1] : void 0;
        p !== void 0 && P.areas.push({ area: o, dir: p, q: l });
        break;
      }
      case "LOAD PATTERN DEFINITIONS": {
        const o = G(e.get("SelfWtMult"));
        o > P.selfWtMult && (P.selfWtMult = o);
        const n = e.get("LoadPat");
        n && /wind/i.test(e.get("DesignType") ?? "") && P.windPats.add(n);
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const o = e.get("Solid");
        if (o) {
          const n = [];
          for (let l = 1; l <= 8; l++) {
            const I = e.get(`Joint${l}`);
            I && n.push(I);
          }
          n.length === 8 && i.push({ name: o, joints: n });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const o = e.get("SolidProp");
        o && S.set(o, { material: e.get("Material") || "", incomp: (e.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const o = e.get("Solid"), n = e.get("SolidProp");
        o && n && D.set(o, n);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const o = e.get("Area");
        o && Ct.set(o, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((n) => e.has(n) ? G(e.get(n)) : 1)), o && (e.has("MassMod") || e.has("WeightMod")) && P.areaMW.set(o, [e.has("MassMod") ? G(e.get("MassMod")) : 1, e.has("WeightMod") ? G(e.get("WeightMod")) : 1]);
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const o = e.get("Frame");
        o && Tt.set(o, G(e.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const o = e.get("Frame");
        o && dt.set(o, [G(e.get("LengthI")), G(e.get("LengthJ")), G(e.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const o = e.get("Joint");
        o && Mt.push({ joint: o, fx: G(e.get("F1")), fy: G(e.get("F2")), fz: G(e.get("F3")), mx: G(e.get("M1")), my: G(e.get("M2")), mz: G(e.get("M3")) });
        break;
      }
    }
  }
  return Ue(B, $, et, f, F, Et, rt, ct, nt, At, It, Mt, dt, Tt, Ct, Pt, i, S, D, at, mt, ft, P);
}
function ss(N) {
  const A = { force: "KN", length: "m" };
  let R = "UX,UY,UZ,RX,RY,RZ";
  const B = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), et = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), mt = [], f = [], F = /* @__PURE__ */ new Map(), Et = [], rt = /* @__PURE__ */ new Map(), ct = /* @__PURE__ */ new Map(), nt = /* @__PURE__ */ new Map(), ft = /* @__PURE__ */ new Map(), At = [], It = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Map();
  let dt = "", Tt = "";
  for (const i of N) {
    const S = i.trim();
    if (!S || S.startsWith(";")) continue;
    if (!i.startsWith(" ") && !i.startsWith("	")) {
      const P = S.toUpperCase();
      if (P === "END") break;
      P.startsWith("SHELL SECTION") ? dt = "SHELL SECTION" : P.startsWith("FRAME SECTION") ? dt = "FRAME SECTION" : dt = P.split(/\s+/)[0];
      continue;
    }
    const D = Ye(S), V = S.split(/\s+/);
    switch (dt) {
      case "SYSTEM": {
        const P = D.get("DOF");
        P && (R = P);
        const g = D.get("LENGTH");
        g && (A.length = g);
        const J = D.get("FORCE");
        J && (A.force = J);
        break;
      }
      case "JOINT": {
        const P = V[0];
        at.set(P, [G(D.get("X")), G(D.get("Y")), G(D.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const P = D.get("ADD"), g = D.get("DOF");
        if (P && g) {
          const J = g.split(","), e = [false, false, false, false, false, false];
          for (const o of J) {
            const n = o.toUpperCase();
            (n === "UX" || n === "U1") && (e[0] = true), (n === "UY" || n === "U2") && (e[1] = true), (n === "UZ" || n === "U3") && (e[2] = true), (n === "RX" || n === "R1") && (e[3] = true), (n === "RY" || n === "R2") && (e[4] = true), (n === "RZ" || n === "R3") && (e[5] = true);
          }
          F.set(P, e);
        }
        break;
      }
      case "MATERIAL": {
        const P = D.get("NAME");
        if (P) Tt = P, B.set(P, { E: 0, nu: 0, G: 0 });
        else if (Tt) {
          const g = B.get(Tt), J = D.get("E");
          J && (g.E = G(J));
          const e = D.get("U");
          e && (g.nu = G(e)), g.G = g.E / (2 * (1 + g.nu));
          const o = D.get("M");
          o && (g.density = G(o));
        }
        break;
      }
      case "SHELL": {
        const P = V[0], g = D.get("J");
        D.get("SEC"), g && f.push({ name: P, joints: g.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const P = D.get("NAME");
        P && et.set(P, { material: D.get("MAT") || "", type: D.get("TYPE") || "Shell", thickness: G(D.get("TH")) });
        break;
      }
      case "FRAME": {
        const P = V[0], g = D.get("J");
        if (g) {
          const J = g.split(",");
          J.length >= 2 && mt.push({ name: P, j1: J[0], j2: J[1] });
        }
        break;
      }
      case "LOAD": {
        const P = D.get("ADD");
        P && Et.push({ joint: P, fx: G(D.get("UX")), fy: G(D.get("UY")), fz: G(D.get("UZ")), mx: G(D.get("MX")), my: G(D.get("MY")), mz: G(D.get("MZ")) });
        break;
      }
    }
  }
  return Ue(A, R, B, $, et, at, mt, f, F, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), Et, rt, ct, nt, ft, At, It, Mt);
}
function Ue(N, A, R, B, $, et, at, mt, f, F, Et, rt, ct = /* @__PURE__ */ new Map(), nt = /* @__PURE__ */ new Map(), ft = /* @__PURE__ */ new Map(), At = /* @__PURE__ */ new Map(), It = [], Mt = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map(), Tt, Ct, Pt = /* @__PURE__ */ new Map(), i) {
  var _a, _b, _c, _d, _e, _f, _g;
  const S = [], D = /* @__PURE__ */ new Map(), V = [];
  for (const [E, d] of et) D.set(E, V.length), S.push(E), V.push(d);
  const P = [], g = [], J = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), o = (E) => E.replace(/~\d+$/, "");
  for (const E of at) {
    const d = D.get(E.j1), b = D.get(E.j2);
    if (d !== void 0 && b !== void 0) {
      const j = [];
      if ((_a = i == null ? void 0 : i.autoMeshJoints) == null ? void 0 : _a.has(E.name)) {
        const Z = V[d], y = V[b], H = [y[0] - Z[0], y[1] - Z[1], y[2] - Z[2]], z = H[0] ** 2 + H[1] ** 2 + H[2] ** 2;
        z > 1e-12 && V.forEach((O, _) => {
          if (_ === d || _ === b) return;
          const K = ((O[0] - Z[0]) * H[0] + (O[1] - Z[1]) * H[1] + (O[2] - Z[2]) * H[2]) / z;
          if (K <= 1e-9 || K >= 1 - 1e-9) return;
          Math.hypot(O[0] - Z[0] - K * H[0], O[1] - Z[1] - K * H[1], O[2] - Z[2] - K * H[2]) < 1e-3 && j.push({ s: K, n: _ });
        }), j.sort((O, _) => O.s - _.s);
      }
      const L = [0, ...j.map((Z) => Z.s), 1], k = [d, ...j.map((Z) => Z.n), b], st = [];
      for (let Z = 0; Z < k.length - 1; Z++) {
        const y = P.length;
        P.push([k[Z], k[Z + 1]]), g.push(Z === 0 ? E.name : `${E.name}~${Z + 1}`);
        const H = F.get(E.name);
        H && J.set(y, H), st.push({ i: y, s0: L[Z], s1: L[Z + 1] });
      }
      e.set(E.name, st);
    }
  }
  const n = P.length;
  for (const E of mt) {
    const d = E.joints.map((b) => D.get(b)).filter((b) => b !== void 0);
    if (d.length >= 3) {
      const b = P.length;
      P.push(d), g.push(E.name);
      const j = Et.get(E.name);
      j && J.set(b, j);
    }
  }
  const l = P.length - n, I = [];
  for (const E of It) {
    const d = E.joints.map((L) => D.get(L));
    if (d.some((L) => L === void 0)) continue;
    const b = P.length;
    P.push([d[0], d[1], d[3], d[2], d[4], d[5], d[7], d[6]]), g.push(E.name), I.push(b);
    const j = dt.get(E.name);
    j && J.set(b, j);
  }
  const p = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, X = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), it = R.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let E = 0; E < P.length; E++) {
    const d = J.get(E), b = d ? B.get(d) : null, j = d ? $.get(d) : null;
    if (b || P[E].length === 2) {
      const L = b || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, k = R.get(L.material) || it, st = k.E || it.E, Z = k.nu || 0.3, y = k.G || st / (2 * (1 + Z));
      p.elasticities.set(E, st), p.shearModuli.set(E, y), p.areas.set(E, L.A || L.D * L.B), p.momentsOfInertiaZ.set(E, L.Iz || L.B * L.D ** 3 / 12), p.momentsOfInertiaY.set(E, L.Iy || L.D * L.B ** 3 / 12), p.torsionalConstants.set(E, L.J || 0), p.densities.set(E, k.density || 0), L.As2 && (p.shearAreasZ ?? (p.shearAreasZ = /* @__PURE__ */ new Map()), p.shearAreasZ.set(E, L.As2)), L.As3 && (p.shearAreasY ?? (p.shearAreasY = /* @__PURE__ */ new Map()), p.shearAreasY.set(E, L.As3));
      const H = (((_b = e.get(g[E])) == null ? void 0 : _b.length) ?? 1) === 1 ? ct.get(g[E]) : void 0;
      H && (p.endOffsets ?? (p.endOffsets = /* @__PURE__ */ new Map()), p.endOffsets.set(E, H));
      const z = nt.get(o(g[E]));
      z && (p.localAngles ?? (p.localAngles = /* @__PURE__ */ new Map()), p.localAngles.set(E, z));
      const O = L;
      ((_c = L.shape) == null ? void 0 : _c.includes("Wide Flange")) || L.shape === "I" ? X.set(E, { type: "I", b: L.B, h: L.D, ...O.TF > 0 && O.TW > 0 ? { tf: O.TF, tw: O.TW, t2b: O.T2B > 0 ? O.T2B : L.B, tfb: O.TFB > 0 ? O.TFB : O.TF } : {}, name: d || "I-section" }) : /box|tube/i.test(L.shape ?? "") && O.TF > 0 && O.TW > 0 ? X.set(E, { type: "HSS", b: L.B, h: L.D, tf: O.TF, tw: O.TW, name: d }) : /^channel$/i.test(L.shape ?? "") && O.TF > 0 && O.TW > 0 ? X.set(E, { type: "C", b: L.B, h: L.D, tf: O.TF, tw: O.TW, name: d }) : /double angle/i.test(L.shape ?? "") && O.TF > 0 && O.TW > 0 ? X.set(E, { type: "2L", b: L.B, h: L.D, tf: O.TF, tw: O.TW, dis: O.DIS || 0, name: d }) : X.set(E, { type: "rect", b: L.B, h: L.D }), x.set(E, { name: d || L.shape, shape: L.shape, D: L.D > 0 ? L.D : void 0, B: L.B > 0 ? L.B : void 0, TF: O.TF > 0 ? O.TF : void 0, TW: O.TW > 0 ? O.TW : void 0, ...L.material ? { material: L.material } : {} });
      const _ = d ? Tt == null ? void 0 : Tt.get(d) : void 0;
      if (_ && _.t > 0 && (_.b > 0 && _.h > 0 || (_.D ?? 0) > 0)) {
        const K = d ? Ct == null ? void 0 : Ct.get(d) : void 0, q = K && ((_d = R.get(K.mat)) == null ? void 0 : _d.E) || 0;
        X.set(E, _.D ? { type: "CFT", d: _.D, tw: _.t, name: d, ...q > 0 ? { fillE: q } : {} } : { type: "CFT", b: _.b, h: _.h, tw: _.t, ..._.tf && _.tf !== _.t ? { tf: _.tf } : {}, name: d, ...q > 0 ? { fillE: q } : {} });
      }
    } else if (j) {
      const L = R.get(j.material) || it, k = L.E || it.E, st = L.nu || 0.2, Z = L.G || k / (2 * (1 + st));
      p.elasticities.set(E, k), p.shearModuli.set(E, Z), p.thicknesses.set(E, j.thickness), p.poissonsRatios.set(E, st), p.plateFormulations ?? (p.plateFormulations = /* @__PURE__ */ new Map()), p.plateFormulations.set(E, /thin/i.test(j.type) ? 1 : 0);
      const y = /membrane/i.test(j.type), H = ft.get(g[E]), z = H && y ? [H[0], H[1], H[2], 0, 0, 0, 0, 0] : H;
      z ? (p.shellModifiers ?? (p.shellModifiers = /* @__PURE__ */ new Map()), p.shellModifiers.set(E, z), p.membraneModifiers ?? (p.membraneModifiers = /* @__PURE__ */ new Map()), p.membraneModifiers.set(E, z[0]), p.bendingModifiers ?? (p.bendingModifiers = /* @__PURE__ */ new Map()), p.bendingModifiers.set(E, z[3])) : y && (p.membraneModifiers ?? (p.membraneModifiers = /* @__PURE__ */ new Map()), p.membraneModifiers.set(E, 1), p.bendingModifiers ?? (p.bendingModifiers = /* @__PURE__ */ new Map()), p.bendingModifiers.set(E, 0)), p.densities.set(E, L.density || 0), x.set(E, { name: d, shape: j.type, t: j.thickness > 0 ? j.thickness : void 0, ...j.material ? { material: j.material } : {} });
    }
  }
  if (I.length) {
    let E = false;
    for (const d of I) {
      const b = Mt.get(J.get(d) || ""), j = b && R.get(b.material) || it, L = j.E || it.E, k = j.nu || 0.2;
      p.elasticities.set(d, L), p.poissonsRatios.set(d, k), p.shearModuli.set(d, j.G || L / (2 * (1 + k))), p.densities.set(d, j.density || 0), (b == null ? void 0 : b.incomp) && (E = true), x.set(d, { name: J.get(d) || void 0, shape: "Solid", ...(b == null ? void 0 : b.material) ? { material: b.material } : {} });
    }
    p.solidIncompatible = E;
  }
  x.size && (p.sectionInfo = x);
  const h = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [E, d] of f) {
    const b = D.get(E);
    b !== void 0 && h.supports.set(b, d);
  }
  {
    const E = [];
    for (const [d, b] of Pt) {
      const j = D.get(d);
      j !== void 0 && b.forEach((L, k) => {
        L > 0 && E.push({ node: j, dof: k, k: L });
      });
    }
    E.length && (h.springs = E);
  }
  for (const [E, d] of At) for (const { i: b } of e.get(E) ?? []) {
    if (P[b].length !== 2) continue;
    p.frameLoads ?? (p.frameLoads = /* @__PURE__ */ new Map()), p.frameLoads.set(b, d);
    const j = V[P[b][0]], L = V[P[b][1]], k = [L[0] - j[0], L[1] - j[1], L[2] - j[2]], st = Math.hypot(k[0], k[1], k[2]);
    if (st < 1e-9) continue;
    const Z = [k[0] / st, k[1] / st, k[2] / st], y = st * st / 12, H = [Z[1] * d[2] - Z[2] * d[1], Z[2] * d[0] - Z[0] * d[2], Z[0] * d[1] - Z[1] * d[0]], z = (O, _) => {
      const K = h.loads.get(O) || [0, 0, 0, 0, 0, 0];
      for (let q = 0; q < 6; q++) K[q] += _[q];
      h.loads.set(O, K);
    };
    z(P[b][0], [d[0] * st / 2, d[1] * st / 2, d[2] * st / 2, y * H[0], y * H[1], y * H[2]]), z(P[b][1], [d[0] * st / 2, d[1] * st / 2, d[2] * st / 2, -y * H[0], -y * H[1], -y * H[2]]);
  }
  for (const E of rt) {
    const d = D.get(E.joint);
    if (d !== void 0) {
      const b = h.loads.get(d) || [0, 0, 0, 0, 0, 0];
      b[0] += E.fx, b[1] += E.fy, b[2] += E.fz, b[3] += E.mx, b[4] += E.my, b[5] += E.mz, h.loads.set(d, b);
    }
  }
  if (i) {
    const E = h.loads, d = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
    g.forEach((y, H) => (H < n ? b : H < n + l ? j : /* @__PURE__ */ new Map()).set(y, H));
    const L = (y) => y !== void 0 && y < n;
    if ((_e = i.windPats) == null ? void 0 : _e.size) {
      const y = (z) => z[0] === 0 && z[1] === 0 && z[2] === -1, H = i.barras.filter((z) => z.pat !== void 0 && i.windPats.has(z.pat) && y(z.dir));
      if (H.length) {
        let z = [0, 0, 0];
        for (const W of V) z[0] += W[0], z[1] += W[1], z[2] += W[2];
        z = z.map((W) => W / (V.length || 1));
        const O = /* @__PURE__ */ new Map(), _ = [];
        for (const W of H) {
          const Y = e.get(W.frame);
          if (!(Y == null ? void 0 : Y.length)) continue;
          const St = (_f = P[Y[0].i]) == null ? void 0 : _f[0], Ot = (_g = P[Y[Y.length - 1].i]) == null ? void 0 : _g[1];
          if (St === void 0 || Ot === void 0) continue;
          const Rt = V[St], Lt = V[Ot], gt = [Lt[0] - Rt[0], Lt[1] - Rt[1], Lt[2] - Rt[2]], Dt = Math.hypot(gt[0], gt[1], gt[2]);
          if (Dt < 1e-9) continue;
          const bt = [gt[0] / Dt, gt[1] / Dt, gt[2] / Dt];
          for (const ot of [Rt, Lt]) {
            const ut = ot[1].toFixed(3);
            let ht = O.get(ut);
            ht || (ht = [], O.set(ut, ht)), ht.some(($t) => Math.abs($t.x - ot[0]) < 1e-6 && Math.abs($t.z - ot[2]) < 1e-6) || ht.push({ x: ot[0], z: ot[2] }), _.push({ c: W, yKey: ut, xz: [ot[0], ot[2]], p: ot, eje: bt });
          }
        }
        for (const [, W] of O) W.sort((Y, St) => Y.x - St.x);
        const K = /* @__PURE__ */ new Map();
        for (const W of _) {
          const Y = O.get(W.yKey), St = Y.findIndex((Ut) => Math.abs(Ut.x - W.xz[0]) < 1e-6 && Math.abs(Ut.z - W.xz[1]) < 1e-6);
          if (St < 0) continue;
          const Ot = Y[Math.max(0, St - 1)], Rt = Y[Math.min(Y.length - 1, St + 1)], Lt = Rt.x - Ot.x, gt = Rt.z - Ot.z, Dt = Math.hypot(Lt, gt);
          if (Dt < 1e-9) continue;
          const bt = [Lt / Dt, 0, gt / Dt], ot = W.eje, ut = [ot[1] * bt[2] - ot[2] * bt[1], ot[2] * bt[0] - ot[0] * bt[2], ot[0] * bt[1] - ot[1] * bt[0]], ht = Math.hypot(ut[0], ut[1], ut[2]);
          if (ht < 1e-7) continue;
          const $t = [ut[0] / ht, ut[1] / ht, ut[2] / ht], xt = [z[0] - W.p[0], z[1] - W.p[1], z[2] - W.p[2]];
          $t[0] * xt[0] + $t[1] * xt[1] + $t[2] * xt[2] < 0 && ($t[0] = -$t[0], $t[1] = -$t[1], $t[2] = -$t[2]);
          const Yt = K.get(W.c);
          K.set(W.c, Yt ? [Yt[0] + $t[0], Yt[1] + $t[1], Yt[2] + $t[2]] : $t);
        }
        let q = 0;
        for (const W of H) {
          const Y = K.get(W);
          if (!Y) continue;
          const St = Math.hypot(Y[0], Y[1], Y[2]);
          St < 1e-7 || (W.dir = [Y[0] / St, Y[1] / St, Y[2] / St], q++);
        }
        q && console.log(`[s2kParser] viento: ${q}/${H.length} cargas de patrones Wind rotadas a la normal del zinc.`);
      }
    }
    for (const y of i.barras) {
      const H = e.get(y.frame);
      if (!(H == null ? void 0 : H.length) || !L(H[0].i)) continue;
      const z = V[P[H[0].i][0]], O = V[P[H[H.length - 1].i][1]], _ = Math.hypot(O[0] - z[0], O[1] - z[1], O[2] - z[2]), K = y.rel ? y.a * _ : y.a, q = y.rel ? y.b * _ : y.b, W = (Y) => q > K ? y.fa + (y.fb - y.fa) * (Y - K) / (q - K) : y.fa;
      for (const Y of H) {
        const St = Math.max(K, Y.s0 * _), Ot = Math.min(q, Y.s1 * _);
        if (Ot - St <= 1e-12) continue;
        const [Rt, Lt] = P[Y.i];
        we(E, d, Y.i, Rt, Lt, Be(V[Rt], V[Lt], St - Y.s0 * _, Ot - Y.s0 * _, W(St), W(Ot), y.dir));
      }
    }
    const k = (y) => {
      const H = (W, Y) => [W[1] * Y[2] - W[2] * Y[1], W[2] * Y[0] - W[0] * Y[2], W[0] * Y[1] - W[1] * Y[0]], z = (W, Y) => [W[0] - Y[0], W[1] - Y[1], W[2] - Y[2]];
      if (y.length === 3) {
        const W = H(z(y[1], y[0]), z(y[2], y[0])), Y = Math.hypot(...W);
        return { w: [Y / 6, Y / 6, Y / 6], n: W.map((St) => St / (Y || 1)) };
      }
      const O = [0, 0, 0, 0], _ = 1 / Math.sqrt(3);
      let K = [0, 0, 0];
      for (const W of [-_, _]) for (const Y of [-_, _]) {
        const St = [(1 - W) * (1 - Y), (1 + W) * (1 - Y), (1 + W) * (1 + Y), (1 - W) * (1 + Y)].map((ot) => ot / 4), Ot = [-(1 - Y), 1 - Y, 1 + Y, -(1 + Y)].map((ot) => ot / 4), Rt = [-(1 - W), -(1 + W), 1 + W, 1 - W].map((ot) => ot / 4), Lt = [0, 1, 2].map((ot) => y.reduce((ut, ht, $t) => ut + Ot[$t] * ht[ot], 0)), gt = [0, 1, 2].map((ot) => y.reduce((ut, ht, $t) => ut + Rt[$t] * ht[ot], 0)), Dt = H(Lt, gt), bt = Math.hypot(...Dt);
        K = K.map((ot, ut) => ot + Dt[ut]);
        for (let ot = 0; ot < 4; ot++) O[ot] += St[ot] * bt;
      }
      const q = Math.hypot(...K) || 1;
      return { w: O, n: K.map((W) => W / q) };
    }, st = (y, H) => {
      const z = E.get(y) ?? [0, 0, 0, 0, 0, 0];
      for (let O = 0; O < 3; O++) z[O] += H[O];
      E.set(y, z);
    };
    for (const y of i.areas) {
      const H = j.get(y.area);
      if (H === void 0) continue;
      const z = P[H];
      if (z.length !== 3 && z.length !== 4) continue;
      const { w: O, n: _ } = k(z.map((q) => V[q])), K = y.dir ?? _;
      z.forEach((q, W) => st(q, K.map((Y) => Y * y.q * O[W])));
    }
    const Z = i.selfWtMult;
    for (let y = 0; y < P.length; y++) {
      const H = J.get(y), z = P[y];
      if (y < n) {
        const O = H ? B.get(H) : null, _ = O ? R.get(O.material) : null;
        O && O.MMod !== void 0 && O.MMod !== 1 && p.densities.has(y) && p.densities.set(y, p.densities.get(y) * O.MMod);
        const K = Z * ((_ == null ? void 0 : _.weight) ?? 0) * (p.areas.get(y) ?? 0) * ((O == null ? void 0 : O.WMod) ?? 1);
        if (!K) continue;
        const q = V[z[0]], W = V[z[1]], Y = Math.hypot(W[0] - q[0], W[1] - q[1], W[2] - q[2]);
        we(E, d, y, z[0], z[1], Be(q, W, 0, Y, K, K, [0, 0, -1]));
      } else if (z.length === 3 || z.length === 4) {
        const O = H ? $.get(H) : null, _ = O ? R.get(O.material) : null, K = i.areaMW.get(g[y]);
        K && p.densities.has(y) && p.densities.set(y, p.densities.get(y) * K[0]);
        const q = Z * ((_ == null ? void 0 : _.weight) ?? 0) * ((O == null ? void 0 : O.thickness) ?? 0) * (K ? K[1] : 1);
        if (!q) continue;
        const { w: W } = k(z.map((Y) => V[Y]));
        z.forEach((Y, St) => st(Y, [0, 0, -q * W[St]]));
      }
    }
    d.size && (p.frameFixedEnd = d);
  }
  return { units: N, dof: A, materials: R, frameSections: B, shellSections: $, nodes: V, nodeNames: S, nodeNameToIdx: D, elements: P, elementNames: g, elementSections: J, nodeInputs: h, elementInputs: p, sectionShapes: X, info: { nNodes: V.length, nFrames: n, nShells: l, title: `SAP2000 (${n} frames, ${l} shells)` } };
}
function ve(N, A, R, B = {}) {
  const $ = /* @__PURE__ */ new Map(), et = [];
  let at = 0;
  const mt = (F, Et, rt) => {
    const ct = $.get(F) ?? [0, 0, 0, 0, 0, 0];
    ct[Et] += rt, $.set(F, ct);
  }, f = 1 / Math.sqrt(3);
  for (const F of R ?? []) {
    if (F.node >= 0) {
      F.dof >= 0 && F.dof <= 5 && F.k > 0 && mt(F.node, F.dof, F.k);
      continue;
    }
    const Et = -F.node - 1, rt = A[Et];
    if (!rt) continue;
    if (F.dof === -2 || F.dof === -4) {
      et.push([Et, Math.round(F.k), F.dof === -4]);
      continue;
    }
    if (F.dof !== -1 && F.dof !== -3 || !(F.k > 0) || rt.length !== 3 && rt.length !== 4 || B.sinArea) continue;
    at++;
    const ct = rt.map((i) => N[i]), nt = ct[0], ft = ct[1], At = ct[2], It = rt.length === 4 ? ct[3] : ct[0], Mt = [At[0] - nt[0], At[1] - nt[1], At[2] - nt[2]], dt = rt.length === 4 ? [It[0] - ft[0], It[1] - ft[1], It[2] - ft[2]] : [ft[0] - nt[0], ft[1] - nt[1], ft[2] - nt[2]];
    let Tt = [Mt[1] * dt[2] - Mt[2] * dt[1], Mt[2] * dt[0] - Mt[0] * dt[2], Mt[0] * dt[1] - Mt[1] * dt[0]];
    const Ct = Math.hypot(Tt[0], Tt[1], Tt[2]);
    Tt = Ct > 1e-30 ? Tt.map((i) => i / Ct) : [0, 0, 1];
    const Pt = new Array(rt.length).fill(0);
    if (rt.length === 3) {
      const i = [(ft[1] - nt[1]) * (At[2] - nt[2]) - (ft[2] - nt[2]) * (At[1] - nt[1]), (ft[2] - nt[2]) * (At[0] - nt[0]) - (ft[0] - nt[0]) * (At[2] - nt[2]), (ft[0] - nt[0]) * (At[1] - nt[1]) - (ft[1] - nt[1]) * (At[0] - nt[0])];
      Pt.fill(0.5 * Math.hypot(i[0], i[1], i[2]) / 3);
    } else for (const i of [-f, f]) for (const S of [-f, f]) {
      const D = [0.25 * (1 - i) * (1 - S), 0.25 * (1 + i) * (1 - S), 0.25 * (1 + i) * (1 + S), 0.25 * (1 - i) * (1 + S)], V = [-0.25 * (1 - S), 0.25 * (1 - S), 0.25 * (1 + S), -0.25 * (1 + S)], P = [-0.25 * (1 - i), -0.25 * (1 + i), 0.25 * (1 + i), 0.25 * (1 - i)], g = [0, 0, 0], J = [0, 0, 0];
      for (let n = 0; n < 4; n++) for (let l = 0; l < 3; l++) g[l] += V[n] * ct[n][l], J[l] += P[n] * ct[n][l];
      const e = [g[1] * J[2] - g[2] * J[1], g[2] * J[0] - g[0] * J[2], g[0] * J[1] - g[1] * J[0]], o = Math.hypot(e[0], e[1], e[2]);
      for (let n = 0; n < 4; n++) Pt[n] += D[n] * o;
    }
    rt.forEach((i, S) => {
      for (let D = 0; D < 3; D++) Math.abs(Tt[D]) > 1e-12 && mt(i, D, F.k * Pt[S] * Tt[D] * Tt[D]);
    });
  }
  return { nodales: $, colgados: et, deArea: at };
}
function fs(N) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: A, elements: R, nodeInputs: B, elementInputs: $ } = N, et = { force: "KN", length: "m" };
  N.units && (N.units.force !== "KN" || N.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${N.units.force}, ${N.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const at = N.title || "Hekatan Model", mt = [], f = (e) => mt.push(e), F = () => mt.push(" ");
  f(`File ${at}.$2k was saved on m/d/yy at h:mm:ss`), F(), f('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), f("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), F();
  const Et = [], rt = (e) => {
    var _a2, _b2, _c2, _d2, _e2;
    const o = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(e)) || 0, n = (_b2 = $.poissonsRatios) == null ? void 0 : _b2.get(e), l = ((_c2 = $.shearModuli) == null ? void 0 : _c2.get(e)) || 0, I = n !== void 0 ? n : o > 0 && l > 0 ? Math.max(0, Math.min(0.5, o / (2 * l) - 1)) : 0.2, p = l > 0 ? l : o > 0 ? o / (2 * (1 + I)) : 0, X = (_d2 = $.sectionShapes) == null ? void 0 : _d2.get(e), x = (X == null ? void 0 : X.type) === "CFT" && X.steelRho > 0 ? X.steelRho : ((_e2 = $.densities) == null ? void 0 : _e2.get(e)) || 0, it = x > 0 ? `_r${+x.toPrecision(6)}` : "_r0";
    return { E: o, nu: I, G: p, rho: x, key: `MAT_${Math.round(o)}_n${I.toFixed(4)}${it}` };
  }, ct = [], nt = [];
  if (R.forEach((e, o) => {
    e.length === 2 ? Et.push(o) : e.length === 8 ? nt.push(o) : ct.push(o);
  }), Et.length > 0) {
    f('TABLE:  "CONNECTIVITY - FRAME"');
    for (const e of Et) {
      const o = R[e];
      f(`   Frame=${e + 1}   JointI=${o[0] + 1}   JointJ=${o[1] + 1}   IsCurved=No`);
    }
    F();
  }
  if (ct.length > 0) {
    f('TABLE:  "CONNECTIVITY - AREA"');
    for (const e of ct) {
      const o = R[e], n = o.map((l, I) => `Joint${I + 1}=${l + 1}`).join("   ");
      f(`   Area=${e + 1}   NumJoints=${o.length}   ${n}`);
    }
    F();
  }
  if (nt.length > 0) {
    f('TABLE:  "CONNECTIVITY - SOLID"');
    for (const e of nt) {
      const o = R[e], n = [o[0], o[1], o[3], o[2], o[4], o[5], o[7], o[6]];
      f(`   Solid=${e + 1}   ${n.map((l, I) => `Joint${I + 1}=${l + 1}`).join("   ")}`);
    }
    F();
  }
  f('TABLE:  "COORDINATE SYSTEMS"'), f("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), F(), f('TABLE:  "DATABASE FORMAT TYPES"'), f("   UnitsCurr=Yes   OverrideE=No"), F();
  const ft = /* @__PURE__ */ new Map(), At = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
  for (const e of Et) {
    const o = ((_a = $.areas) == null ? void 0 : _a.get(e)) || 0, n = ((_b = $.momentsOfInertiaZ) == null ? void 0 : _b.get(e)) || 0, l = ((_c = $.momentsOfInertiaY) == null ? void 0 : _c.get(e)) || 0, I = ((_d = $.torsionalConstants) == null ? void 0 : _d.get(e)) || 0, p = ((_e = $.elasticities) == null ? void 0 : _e.get(e)) || 0, X = rt(e).key, x = ((_f = $.shearAreasZ) == null ? void 0 : _f.get(e)) ?? 0, it = ((_g = $.shearAreasY) == null ? void 0 : _g.get(e)) ?? 0, h = (_h = $.sectionShapes) == null ? void 0 : _h.get(e);
    let E;
    const d = (h == null ? void 0 : h.type) === "CFT" && h.d > 0 && h.tw > 0 && h.tw < h.d / 2 && !(h.b > 0 && h.h > 0);
    if (N.cftAs !== "general" && (h == null ? void 0 : h.type) === "CFT" && p > 0 && (d || h.b > 0 && h.h > 0 && h.tw > 0 && h.tw < Math.min(h.b, h.h) / 2)) {
      const k = d ? h.d - 2 * h.tw : 0, st = d ? 0 : h.b - 2 * h.tw, Z = d ? 0 : h.h - 2 * (h.tf ?? h.tw), y = d ? Math.PI * (h.d * h.d - k * k) / 4 : h.b * h.h - st * Z, H = d ? Math.PI * k * k / 4 : st * Z, O = (h.fillE > 0 ? h.fillE / p : Math.max(0.01, Math.min(1, (o - y) / H))) * p, _ = 0.2, K = h.fillRho ?? 2.4, q = `FILL_${Math.round(O)}_r${K}`;
      At.has(q) || At.set(q, { E: O, nu: _, G: O / (2 * (1 + _)), rho: K }), E = d ? { b: h.d, h: h.d, t: h.tw, Ec: O, nuC: _, matFill: q, D: h.d } : { b: h.b, h: h.h, t: h.tw, tf: h.tf ?? h.tw, Ec: O, nuC: _, matFill: q };
    }
    let b;
    !E && (h == null ? void 0 : h.type) === "I" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 ? b = { kind: "I", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw, t2b: h.t2b ?? h.b, tfb: h.tfb ?? h.tf } : !E && (h == null ? void 0 : h.type) === "HSS" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 ? b = { kind: "Box", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw } : !E && (h == null ? void 0 : h.type) === "C" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 ? b = { kind: "C", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw } : !E && (h == null ? void 0 : h.type) === "2L" && h.h > 0 && h.b > 0 && h.tf > 0 && h.tw > 0 && (b = { kind: "2L", t3: h.h, t2: h.b, tf: h.tf, tw: h.tw, dis: h.dis ?? 0 });
    const j = `A${o.toPrecision(6)}_Iz${n.toPrecision(6)}_s${x.toPrecision(6)}_${it.toPrecision(6)}${E ? E.D ? `_SDC${E.D}x${E.t}` : `_SD${E.b}x${E.h}x${E.t}` : ""}${b ? `_P${b.kind}${b.t3}x${b.t2}x${b.tf}x${b.tw}x${b.t2b ?? ""}x${b.tfb ?? ""}x${b.dis ?? ""}` : ""}`;
    if (!ft.has(j)) {
      let k = 0.3, st = 0.3;
      o > 0 && n > 0 && (k = Math.sqrt(12 * n / o), st = o / k), ft.set(j, { A: o, Iz: n, Iy: l, J: I, b: st, h: k, matKey: X, As2: x > 0 ? x : o * 5 / 6, As3: it > 0 ? it : o * 5 / 6, sd: E, param: b });
    }
    const L = [...ft.keys()].indexOf(j) + 1;
    It.set(e, `SEC${L}`);
  }
  if (Et.length > 0) {
    f('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const e of Et) {
      const o = It.get(e) || "SEC1";
      f(`   Frame=${e + 1}   AutoSelect=N.A.   AnalSect=${o}   MatProp=Default`);
    }
    F();
  }
  if (ft.size > 0) {
    f('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let e = 0;
    for (const [, o] of ft) {
      if (e++, o.sd) {
        f(`   SectionName=SEC${e}   Material=${o.matKey}   Shape="SD Section"   Area=${M(o.A)}   TorsConst=${M(o.J)}   I33=${M(o.Iz)}   I22=${M(o.Iy)}   I23=0   AS2=${M(o.As2)}   AS3=${M(o.As3)} _`), f("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      if (o.param) {
        const n = o.param, l = n.kind === "I" ? `Shape="I/Wide Flange"   t3=${M(n.t3)}   t2=${M(n.t2)}   tf=${M(n.tf)}   tw=${M(n.tw)}   t2b=${M(n.t2b)}   tfb=${M(n.tfb)}` : n.kind === "C" ? `Shape=Channel   t3=${M(n.t3)}   t2=${M(n.t2)}   tf=${M(n.tf)}   tw=${M(n.tw)}` : n.kind === "2L" ? `Shape="Double Angle"   t3=${M(n.t3)}   t2=${M(n.t2)}   SngAngWid=${M((n.t2 - (n.dis ?? 0)) / 2)}   tf=${M(n.tf)}   tw=${M(n.tw)}   dis=${M(n.dis ?? 0)}` : `Shape=Box/Tube   t3=${M(n.t3)}   t2=${M(n.t2)}   tf=${M(n.tf)}   tw=${M(n.tw)}`;
        f(`   SectionName=SEC${e}   Material=${o.matKey}   ${l}   FilletRadius=0   Area=${M(o.A)}   TorsConst=${M(o.J)}   I33=${M(o.Iz)}   I22=${M(o.Iy)}   I23=0   AS2=${M(o.As2)}   AS3=${M(o.As3)} _`), f("        Color=Red   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      f(`   SectionName=SEC${e}   Material=${o.matKey}   Shape=General   t3=${M(o.h)}   t2=${M(o.b)}   Area=${M(o.A)}   TorsConst=${M(o.J)}   I33=${M(o.Iz)}   I22=${M(o.Iy)}   I23=0   AS2=${M(o.As2)}   AS3=${M(o.As3)} _`), f("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    F();
  }
  const Mt = [...ft.values()].map((e, o) => ({ sec: e, name: `SEC${o + 1}` })).filter((e) => e.sec.sd);
  if (Mt.length > 0) {
    f('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: n } of Mt) f(`   SectionName=${n}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    F();
    const e = Mt.filter((n) => !n.sec.sd.D), o = Mt.filter((n) => n.sec.sd.D);
    if (e.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: n, name: l } of e) {
        const I = n.sd;
        f(`   SectionName=${l}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${n.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${M(I.h)}   Width=${M(I.b)}   FlngThick=${M(I.tf ?? I.t)}   WebThick=${M(I.t)}   Rotation=0 _`), f('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      F();
    }
    if (o.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: n, name: l } of o) {
        const I = n.sd;
        f(`   SectionName=${l}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${n.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${M(I.D)}   WallThick=${M(I.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), f("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      F();
    }
    if (e.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: n, name: l } of e) {
        const I = n.sd;
        f(`   SectionName=${l}   ShapeName=RELLENO   ShapeMat=${I.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${M(I.h - 2 * (I.tf ?? I.t))}   Width=${M(I.b - 2 * I.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), f("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      F();
    }
    if (o.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: n, name: l } of o) {
        const I = n.sd;
        f(`   SectionName=${l}   ShapeName=RELLENO   ShapeMat=${I.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${M(I.D - 2 * I.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      F();
    }
    f('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: n } of Mt) f(`   SectionName=${n}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    F();
  }
  {
    const e = Et.filter((o) => {
      var _a2;
      const n = (_a2 = $.localAngles) == null ? void 0 : _a2.get(o);
      return n !== void 0 && isFinite(n) && Math.abs(n) > 1e-9;
    });
    if (e.length > 0) {
      f('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const o of e) f(`   Frame=${o + 1}   Angle=${M($.localAngles.get(o))}   AdvanceAxes=No`);
      F();
    }
  }
  {
    const e = $.endOffsets, o = Et.filter((n) => {
      const l = e == null ? void 0 : e.get(n);
      return !!l && (Math.abs(l[0]) > 1e-9 || Math.abs(l[1]) > 1e-9);
    });
    if (o.length > 0) {
      f('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const n of o) {
        const l = e.get(n);
        f(`   Frame=${n + 1}   Type=User   LengthI=${M(l[0])}   LengthJ=${M(l[1])}   RigidFactor=${M(l.length > 2 ? l[2] : 0)}`);
      }
      F();
    }
  }
  const dt = !!N.layeredSection && ct.length > 0, Tt = N.layeredSection, Ct = /* @__PURE__ */ new Map(), Pt = /* @__PURE__ */ new Map(), i = $.shellModifiers, S = $.membraneModifiers, D = $.bendingModifiers, V = (e) => !(i == null ? void 0 : i.has(e)) && Math.abs((D == null ? void 0 : D.get(e)) ?? 1) < 1e-9;
  if (!dt) for (const e of ct) {
    const o = ((_i = $.thicknesses) == null ? void 0 : _i.get(e)) || 0.1;
    (_j = $.elasticities) == null ? void 0 : _j.get(e);
    const n = rt(e).key, l = V(e) ? 2 : ((_k = $.plateFormulations) == null ? void 0 : _k.get(e)) ?? 0, I = `t${o.toPrecision(6)}_f${l}`;
    Ct.has(I) || Ct.set(I, { t: o, matKey: n, formulacion: l });
    const p = [...Ct.keys()].indexOf(I) + 1;
    Pt.set(e, `SSEC${p}`);
  }
  if (ct.length > 0) {
    f('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const n of ct) {
      const l = dt ? Tt.name : Pt.get(n) || "SSEC1";
      f(`   Area=${n + 1}   Section=${l}   MatProp=Default`);
    }
    F();
    const e = (n) => {
      const l = i == null ? void 0 : i.get(n);
      if (l) return l;
      const I = (S == null ? void 0 : S.get(n)) ?? 1, p = V(n) ? 1 : (D == null ? void 0 : D.get(n)) ?? 1;
      return [I, I, I, p, p, p, p, p];
    }, o = ct.filter((n) => {
      const l = e(n);
      return l && l.some((I) => Math.abs(I - 1) > 1e-12);
    });
    if (o.length > 0) {
      f('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const n of o) {
        const l = e(n);
        f(`   Area=${n + 1}   f11=${M(l[0])}   f22=${M(l[1])}   f12=${M(l[2])}   m11=${M(l[3])}   m22=${M(l[4])}   m12=${M(l[5])}   v13=${M(l[6])}   v23=${M(l[7])}   MassMod=1   WeightMod=1`);
      }
      F();
    }
    if (f('TABLE:  "AREA SECTION PROPERTIES"'), dt) {
      const n = Tt, l = ((_l = n.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      f(`   Section=${n.name}   Material=${l}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${M(n.totalThickness)}   BendThick=${M(n.totalThickness)}   Color=Magenta`);
    } else {
      let n = 0;
      for (const [, l] of Ct) {
        n++;
        const I = l.formulacion === 2 ? "Membrane" : l.formulacion === 3 ? "Plate-Thin" : l.formulacion === 4 ? "Plate-Thick" : l.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", p = l.formulacion === 3 || l.formulacion === 4 ? "No" : "Yes";
        f(`   Section=SSEC${n}   Material=${l.matKey}   MatAngle=0   AreaType=Shell   Type=${I}   DrillDOF=${p}   Thickness=${M(l.t)}   BendThick=${M(l.t)}   Color=Cyan`);
      }
    }
    if (F(), dt) {
      f('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const n = Tt;
      for (const l of n.layers) {
        const I = l.angle ?? 0, p = l.numIntPts ?? 3;
        f(`   Section=${n.name}   LayerName=${l.name}   Distance=${M(l.distance)}   Thickness=${M(l.thickness)}   Type=Shell   NumIntPts=${p}   Material=${l.material}   MatAngle=${M(I * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      F();
    }
  }
  f('TABLE:  "JOINT COORDINATES"');
  for (let e = 0; e < A.length; e++) {
    const o = A[e];
    f(`   Joint=${e + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${M(o[0])}   Y=${M(o[1])}   Z=${M(o[2])}   SpecialJt=No`);
  }
  if (F(), B.supports && B.supports.size > 0) {
    f('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [e, o] of B.supports) {
      if (!o.some((l) => l)) continue;
      const n = (l) => l ? "Yes" : "No";
      f(`   Joint=${e + 1}   U1=${n(o[0])}   U2=${n(o[1])}   U3=${n(o[2])}   R1=${n(o[3])}   R2=${n(o[4])}   R3=${n(o[5])}`);
    }
    F();
  }
  {
    const e = N.patrones ? $.areaSpringsExport : void 0, o = ve(A, R, B.springs, { sinArea: !!(e == null ? void 0 : e.size) }).nodales;
    if (e == null ? void 0 : e.size) {
      f('TABLE:  "AREA SPRING ASSIGNMENTS"');
      for (const [n, l] of e) f(`   Area=${n + 1}   Type=Simple   Stiffness=${M(l.ks)}   SimpleType=${l.comp ? '"Compression Only"' : '"Tension and Compression"'}   Face=Bottom   Dir1Type="Object Axes"   Dir=3`);
      F();
    }
    if (o.size > 0) {
      f('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [n, l] of [...o].sort((I, p) => I[0] - p[0])) f(`   Joint=${n + 1}   CoordSys=Global   U1=${M(l[0])}   U2=${M(l[1])}   U3=${M(l[2])}   R1=${M(l[3])}   R2=${M(l[4])}   R3=${M(l[5])}`);
      F();
    }
  }
  const P = B.diaphragms;
  if (P && P.size > 0) {
    const e = /* @__PURE__ */ new Map();
    for (const [n, l] of P) {
      const I = Math.round(l);
      if (I === 0) continue;
      const p = Math.abs(I);
      e.has(p) || e.set(p, []), e.get(p).push(n);
    }
    const o = [...e].filter(([, n]) => n.length >= 2);
    if (o.length > 0) {
      f('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [n] of o) f(`   Name=DIAPH${n}   CoordSys=GLOBAL   Axis=Z`);
      F(), f('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [n, l] of o) for (const I of l) f(`   Joint=${I + 1}   Constraint=DIAPH${n}`);
      F();
    }
  }
  const g = B.cargasPorPatron;
  if (N.patrones && g) {
    const e = $.frameLoadsPorPatron ?? {}, o = [.../* @__PURE__ */ new Set([...Object.keys(g), ...Object.keys(e)])], n = (x) => /^dead$/i.test(x) ? "Dead" : /^(dne|sdead|scm|superdead)$/i.test(x) ? '"Super Dead"' : /^(live|viva|l)$/i.test(x) ? "Live" : "Other", l = $.selfWeight ?? 0;
    f('TABLE:  "LOAD PATTERN DEFINITIONS"');
    for (const x of o) f(`   LoadPat=${x}   DesignType=${n(x)}   SelfWtMult=${/^dead$/i.test(x) ? M(l) : 0}`);
    F(), f('TABLE:  "LOAD CASE DEFINITIONS"');
    for (const x of o) f(`   Case=${x}   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=${n(x)}   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes`);
    F(), f('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"');
    for (const x of o) f(`   Case=${x}   LoadType="Load pattern"   LoadName=${x}   LoadSF=1`);
    F();
    const I = [];
    for (const x of o) for (const [it, h] of g[x] ?? /* @__PURE__ */ new Map()) h.some((E) => Math.abs(E) > 1e-12) && I.push(`   Joint=${it + 1}   LoadPat=${x}   CoordSys=GLOBAL   F1=${M(h[0])}   F2=${M(h[1])}   F3=${M(h[2])}   M1=${M(h[3])}   M2=${M(h[4])}   M3=${M(h[5])}`);
    I.length && (f('TABLE:  "JOINT LOADS - FORCE"'), I.forEach(f), F());
    const p = [];
    for (const x of o) for (const [it, h] of e[x] ?? /* @__PURE__ */ new Map()) {
      const E = R[it];
      if (!E || E.length !== 2) continue;
      const d = A[E[0]], b = A[E[1]], j = Math.hypot(b[0] - d[0], b[1] - d[1], b[2] - d[2]);
      ["X", "Y", "Z"].forEach((L, k) => {
        Math.abs(h[k]) < 1e-12 || p.push(`   Frame=${it + 1}   LoadPat=${x}   CoordSys=GLOBAL   Type=Force   Dir=${L}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${M(j)}   FOverLA=${M(h[k])}   FOverLB=${M(h[k])}`);
      });
    }
    p.length && (f('TABLE:  "FRAME LOADS - DISTRIBUTED"'), p.forEach(f), F());
    const X = $.combos ?? [];
    if (X.length) {
      f('TABLE:  "COMBINATION DEFINITIONS"');
      for (const x of X) x.items.forEach(([it, h], E) => f(E === 0 ? `   ComboName=${x.name}   ComboType="Linear Add"   AutoDesign=No   CaseType="Linear Static"   CaseName=${it}   ScaleFactor=${M(h)}   SteelDesign=None   ConcDesign=None   AlumDesign=None   ColdDesign=None` : `   ComboName=${x.name}   CaseType="Linear Static"   CaseName=${it}   ScaleFactor=${M(h)}`));
      F();
    }
  } else {
    const e = N.selfWtMult ?? 1;
    f('TABLE:  "LOAD PATTERN DEFINITIONS"'), f(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${e}`), F(), f('TABLE:  "LOAD CASE DEFINITIONS"'), f('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), F(), f('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), f('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), F();
    const o = $.frameLoads, n = /* @__PURE__ */ new Map();
    if ((_m = B.loads) == null ? void 0 : _m.forEach((I, p) => n.set(p, [...I])), o && o.size > 0) {
      const I = (p, X) => {
        const x = n.get(p) ?? [0, 0, 0, 0, 0, 0];
        n.set(p, x.map((it, h) => it - X[h]));
      };
      for (const [p, X] of o) {
        const x = R[p];
        if (!x || x.length !== 2) continue;
        const it = A[x[0]], h = A[x[1]], E = [h[0] - it[0], h[1] - it[1], h[2] - it[2]], d = Math.hypot(E[0], E[1], E[2]);
        if (d < 1e-9) continue;
        const b = [E[0] / d, E[1] / d, E[2] / d], j = d * d / 12, L = [b[1] * X[2] - b[2] * X[1], b[2] * X[0] - b[0] * X[2], b[0] * X[1] - b[1] * X[0]];
        I(x[0], [X[0] * d / 2, X[1] * d / 2, X[2] * d / 2, j * L[0], j * L[1], j * L[2]]), I(x[1], [X[0] * d / 2, X[1] * d / 2, X[2] * d / 2, -j * L[0], -j * L[1], -j * L[2]]);
      }
    }
    if (n.size > 0) {
      f('TABLE:  "JOINT LOADS - FORCE"');
      for (const [I, p] of n) p.some((X) => Math.abs(X) > 1e-12) && f(`   Joint=${I + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${M(p[0])}   F2=${M(p[1])}   F3=${M(p[2])}   M1=${M(p[3])}   M2=${M(p[4])}   M3=${M(p[5])}`);
      F();
    }
    const l = $.frameLoads;
    if (l && l.size > 0) {
      f('TABLE:  "FRAME LOADS - DISTRIBUTED"');
      for (const [I, p] of l) {
        const X = R[I];
        if (!X || X.length !== 2) continue;
        const x = A[X[0]], it = A[X[1]], h = Math.hypot(it[0] - x[0], it[1] - x[1], it[2] - x[2]);
        ["X", "Y", "Z"].forEach((E, d) => {
          Math.abs(p[d]) < 1e-12 || f(`   Frame=${I + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${E}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${M(h)}   FOverLA=${M(p[d])}   FOverLB=${M(p[d])}`);
        });
      }
      F();
    }
  }
  const J = /* @__PURE__ */ new Map();
  for (let e = 0; e < R.length; e++) {
    const { E: o, nu: n, G: l, rho: I, key: p } = rt(e);
    J.has(p) || J.set(p, { E: o, nu: n, G: l, rho: I });
  }
  if (nt.length > 0) {
    const e = $.solidIncompatible === false ? "No" : "Yes", o = /* @__PURE__ */ new Map();
    for (const n of nt) {
      const { E: l, nu: I, G: p, rho: X, key: x } = rt(n);
      J.has(x) || J.set(x, { E: l, nu: I, G: p, rho: X }), o.has(x) || o.set(x, `SOL${o.size + 1}`);
    }
    f('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [n, l] of o) f(`   SolidProp=${l}   Material=${n}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${e}   Color=Yellow`);
    F(), f('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const n of nt) f(`   Solid=${n + 1}   SolidProp=${o.get(rt(n).key)}`);
    F();
  }
  for (const [e, o] of At) J.has(e) || J.set(e, o);
  f('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [e] of J) f(`   Material=${e}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  F(), f('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [e, o] of J) f(`   Material=${e}   UnitWeight=${M(o.rho * 9.80665)}   UnitMass=${M(o.rho)}   E1=${M(o.E)}   G12=${M(o.G)}   U12=${M(o.nu)}   A1=9.9E-06`);
  F(), f('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [e] of J) f(`   Material=${e}   Fc=${M($.fcExport ?? 27579)}   eFc=${M($.fcExport ?? 27579)}   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0   CoupModType="Modified Darwin-Pecknold"`);
  return F(), f('TABLE:  "PROGRAM CONTROL"'), f(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${et.force}, ${et.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), F(), f("END TABLE DATA"), f(""), mt.join(`\r
`);
}
function M(N) {
  return N === 0 || Math.abs(N) < 1e-15 ? "0" : Math.abs(N) >= 1e6 || Math.abs(N) < 1e-3 && Math.abs(N) > 0 ? N.toExponential(8) : parseFloat(N.toPrecision(10)).toString();
}
function os(N, A, R = 0.05) {
  const B = A.map(([$, et]) => `${(+$).toFixed(4)} ${(+et).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${N}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${R}  SPECTYPE "USER"  `, `  FUNCTION "${N}"  TIMEVAL "${B}"  `];
}
function ns(N) {
  const { name: A, func: R, modalCase: B = "Modal", sfX: $ = 9.81, sfY: et = 9.81 } = N, at = [`  LOADCASE "${A}"  TYPE  "Response Spectrum"  MODALCASE  "${B}"  `];
  return $ && at.push(`  LOADCASE "${A}"  ACCEL  "U1"  FUNC  "${R}"  SF  ${$}  `), et && at.push(`  LOADCASE "${A}"  ACCEL  "U2"  FUNC  "${R}"  SF  ${et}  `), at;
}
function Ge(N) {
  const { name: A = "Modal", ritz: R = false, nModes: B = 12 } = N;
  return R ? [`  LOADCASE "${A}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${B} MINMODES  1 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${A}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${B} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function Es(N) {
  var _a;
  const A = (_a = N.e2kModel) == null ? void 0 : _a.rawSections;
  let R = A && A.size > 0 ? is(A, N.e2kModel) : cs(N);
  return N.seismicNEC && (R = as(R, N.seismicNEC)), R;
}
function as(N, A) {
  const R = N.includes(`\r
`) ? `\r
` : `
`, B = N.split(/\r?\n/), $ = A.name ?? "NEC", et = os($, A.points, A.dampRatio ?? 0.05), at = A.modalCase ?? "Modal", mt = ns({ name: A.caseName ?? "Sismo NEC", func: $, modalCase: at, sfX: A.sfX, sfY: A.sfY });
  let f = [];
  const F = (Et) => B.some((rt) => Et.test(rt));
  if (A.modal) {
    const Et = new RegExp(`^\\s*LOADCASE\\s+"${at}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let rt = B.length - 1; rt >= 0; rt--) Et.test(B[rt]) && B.splice(rt, 1);
    f = Ge({ name: at, ritz: !!A.modal.ritz, nModes: A.modal.nModes });
  } else F(new RegExp(`LOADCASE\\s+"${at}"\\s+TYPE\\s+"Modal`)) || (f = Ge({ name: at }));
  return ke(B, "FUNCTIONS", et), ke(B, "LOAD CASES", [...f, ...mt]), B.join(R);
}
function ke(N, A, R) {
  const B = N.findIndex((at) => at.trim() === `$ ${A}`);
  if (B >= 0) {
    N.splice(B + 1, 0, ...R);
    return;
  }
  const $ = N.findIndex((at) => at.trim() === "END"), et = $ >= 0 ? $ : N.length;
  N.splice(et, 0, `$ ${A}`, ...R, "");
}
function is(N, A) {
  const R = [], B = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  R.push("$ File exported from Hekatan Struct Lineal (round-trip)"), R.push("");
  for (const $ of B) {
    const et = N.get($);
    if (!(!et || et.length === 0)) {
      R.push(`$ ${$}`);
      for (const at of et) R.push(at);
      R.push("");
    }
  }
  for (const [$, et] of N) if (!B.includes($) && et.length !== 0) {
    R.push(`$ ${$}`);
    for (const at of et) R.push(at);
    R.push("");
  }
  return R.push("  END"), R.push("$ END OF MODEL FILE"), R.join(`\r
`);
}
function cs(N) {
  var _a, _b, _c, _d, _e2, _f, _g;
  const { nodes: A, elements: R, nodeInputs: B, elementInputs: $, title: et, units: at } = N, mt = N.shellLoads ?? $.shellSurfaceLoads;
  let f;
  mt instanceof Map && (f = /* @__PURE__ */ new Map(), mt.forEach((t, s) => {
    f.set(s, typeof t == "number" ? { value: t } : t);
  }));
  const F = N.shellAngles ?? $.shellAngles, Et = $.cargaDeArea, rt = !!(f && f.size > 0), ct = $.selfWeight, nt = $.frameLoads, ft = (N.weightMode ?? "auto") === "auto" && ct !== void 0, At = /* @__PURE__ */ new Map(), It = (t, s) => {
    const a = At.get(t) ?? [0, 0, 0, 0, 0, 0];
    At.set(t, a.map((c, r) => c + s[r]));
  }, Mt = /* @__PURE__ */ new Set();
  if (ft) {
    if (nt) for (const [t, s] of nt) {
      const a = R[t];
      if (!a || a.length !== 2) continue;
      const c = A[a[0]], r = A[a[1]], T = [r[0] - c[0], r[1] - c[1], r[2] - c[2]], m = Math.hypot(T[0], T[1], T[2]);
      if (m < 1e-9) continue;
      const u = [T[0] / m, T[1] / m, T[2] / m], w = m * m / 12, Q = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]];
      It(a[0], [s[0] * m / 2, s[1] * m / 2, s[2] * m / 2, w * Q[0], w * Q[1], w * Q[2]]), It(a[1], [s[0] * m / 2, s[1] * m / 2, s[2] * m / 2, -w * Q[0], -w * Q[1], -w * Q[2]]), Mt.add(t);
    }
    if (ct && ct > 0) {
      const s = $.endOffsets;
      R.forEach((a, c) => {
        var _a2, _b2, _c2;
        const r = ((_a2 = $.densities) == null ? void 0 : _a2.get(c)) ?? 0;
        if (r) {
          if (a.length === 2) {
            const T = ((_b2 = $.areas) == null ? void 0 : _b2.get(c)) ?? 0, m = A[a[0]], u = A[a[1]], w = [u[0] - m[0], u[1] - m[1], u[2] - m[2]];
            let Q = Math.hypot(w[0], w[1], w[2]);
            const C = s == null ? void 0 : s.get(c);
            if (C) {
              const Wt = Math.hypot(w[0], w[1]);
              Wt > 1e-9 && Math.abs(Math.atan2(Math.abs(w[2]), Wt)) * 180 / Math.PI < 20 && (Q = Math.max(Q - C[0] - C[1], 0));
            }
            const U = T * Q * r * 9.80665 * ct, v = Math.hypot(w[0], w[1], w[2]) || 1, lt = [w[0] / v, w[1] / v], tt = Q * Q / 12, pt = -U / (Q || 1), Jt = tt * lt[1] * pt, Se = -tt * lt[0] * pt;
            It(a[0], [0, 0, -U / 2, Jt, Se, 0]), It(a[1], [0, 0, -U / 2, -Jt, -Se, 0]);
          } else if (a.length === 4) {
            const T = ((_c2 = $.thicknesses) == null ? void 0 : _c2.get(c)) ?? 0, m = a.map((v) => A[v]);
            let u = 0, w = 0, Q = 0;
            for (let v = 0; v < 4; v++) {
              const lt = m[v], tt = m[(v + 1) % 4];
              u += lt[1] * tt[2] - lt[2] * tt[1], w += lt[2] * tt[0] - lt[0] * tt[2], Q += lt[0] * tt[1] - lt[1] * tt[0];
            }
            const C = Math.hypot(u, w, Q) / 2, U = T * C * r * 9.80665 * ct;
            for (const v of a) It(v, [0, 0, -U / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const dt = (t, s) => {
    const a = At.get(t);
    return [s[0] - ((a == null ? void 0 : a[0]) ?? 0), s[1] - ((a == null ? void 0 : a[1]) ?? 0), s[2] - (rt ? (Et == null ? void 0 : Et.get(t)) ?? 0 : 0) - ((a == null ? void 0 : a[2]) ?? 0)];
  }, Tt = (t, s) => {
    const a = At.get(t);
    return [(s[3] ?? 0) - ((a == null ? void 0 : a[3]) ?? 0), (s[4] ?? 0) - ((a == null ? void 0 : a[4]) ?? 0), (s[5] ?? 0) - ((a == null ? void 0 : a[5]) ?? 0)];
  }, Ct = "N", Pt = "MM", i = [], S = (t) => Math.round(t * 1e4) / 1e4, D = (t) => !isFinite(t) || t === 0 ? "0" : Number(t.toPrecision(10)).toString(), V = 1e3, P = 1e3, g = (t) => t * P, J = (t) => t * V, e = (t) => t * V, o = (t) => t * V * P, n = (t) => t * V / P ** 2, l = (t) => t * V / P ** 3, I = /* @__PURE__ */ new Date(), p = `${I.getMonth() + 1}/${I.getDate()}/${I.getFullYear()}  ${I.getHours()}:${String(I.getMinutes()).padStart(2, "0")}:${String(I.getSeconds()).padStart(2, "0")}`;
  i.push(`$ File   "Hekatan_export.e2k"  saved ${p} in ETABS 22.6.0`), i.push(""), i.push("$ PROGRAM INFORMATION"), i.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), i.push(""), i.push("$ CONTROLS"), i.push(`  UNITS  "${Ct}"  "${Pt}"  "C"  `), i.push('  TITLE1  "Hekatan Struct Lineal export"  '), et && i.push(`  TITLE2  "${et}"  `), i.push("  PREFERENCE  MERGETOL 0.001"), i.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), i.push("");
  const X = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set();
  A.forEach((t) => {
    X.add(S(t[0])), x.add(S(t[1]));
  });
  const it = [...X].sort((t, s) => t - s), h = [...x].sort((t, s) => t - s);
  i.push("$ GRIDS"), i.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), it.forEach((t, s) => {
    const a = s < 26 ? String.fromCharCode(65 + s) : String.fromCharCode(65 + s % 26).repeat(Math.floor(s / 26) + 1);
    i.push(`  GRID "G1"  LABEL "${a}"  DIR "X"  COORD ${t}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), h.forEach((t, s) => {
    i.push(`  GRID "G1"  LABEL "${s + 1}"  DIR "Y"  COORD ${t}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), i.push("");
  const E = 3, d = 0.5, b = /* @__PURE__ */ new Map();
  A.forEach((t) => {
    const s = S(t[2]);
    b.set(s, (b.get(s) ?? 0) + 1);
  });
  const j = /* @__PURE__ */ new Set();
  A.forEach((t) => j.add(S(t[2])));
  const L = [...j].sort((t, s) => t - s);
  let k = L.filter((t) => (b.get(t) ?? 0) >= E);
  if (k.length > 1) {
    const t = [k[0]];
    for (const s of k.slice(1)) s - t[t.length - 1] < d ? t[t.length - 1] = s : t.push(s);
    k = t;
  }
  L.length || L.push(0, 3), k.length || (k = [L[0], L[L.length - 1]]), k[0] !== L[0] && k.unshift(L[0]), k[k.length - 1] !== L[L.length - 1] && k.push(L[L.length - 1]);
  const st = [], Z = /* @__PURE__ */ new Map();
  st.push("Base"), Z.set(k[0], "Base");
  for (let t = 1; t < k.length; t++) {
    const s = `Level_${t}`;
    st.push(s), Z.set(k[t], s);
  }
  const y = (t) => {
    const s = S(t);
    if (Z.has(s)) return { story: Z.get(s), dz: 0 };
    for (let c = 0; c < k.length; c++) if (k[c] >= s) return { story: Z.get(k[c]), dz: S(k[c] - s) };
    const a = k[k.length - 1];
    return { story: Z.get(a), dz: S(a - s) };
  };
  i.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let t = k.length - 1; t >= 1; t--) i.push(`  STORY "${st[t]}"  HEIGHT ${S(g(k[t] - k[t - 1]))} MASTERSTORY "Yes"  `);
  k.length > 0 && i.push(`  STORY "Base"  ELEV ${S(g(k[0]))} `), i.push(""), R.some((t) => t.length === 4), i.push("$ DIAPHRAGM NAMES"), i.push('  DIAPHRAGM "D1"    TYPE RIGID'), i.push(""), i.push("$ MATERIAL PROPERTIES");
  const H = 980665e-8, z = (t) => {
    var _a2, _b2, _c2;
    const s = (_a2 = $.sectionShapes) == null ? void 0 : _a2.get(t);
    if ((s == null ? void 0 : s.type) === "CFT" && s.steelRho > 0) return s.steelRho * 9.80665;
    const a = (_b2 = $.densities) == null ? void 0 : _b2.get(t);
    if (a === void 0) return;
    const c = a > 100 ? a * H : a * 9.80665, r = (_c2 = $.deckSections) == null ? void 0 : _c2.get(t);
    if (r && r.tc > 0) {
      const T = r.tc + (r.sr > 0 ? r.hr * (r.wrt + r.wrb) / 2 / r.sr : 0);
      return (c * r.tc - r.w) / T;
    }
    return c;
  }, O = (t) => {
    var _a2;
    const s = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(t)) ?? 0, a = z(t);
    return `${s}|${a === void 0 ? "-" : a.toFixed(4)}`;
  }, _ = /* @__PURE__ */ new Set();
  (_a = $.elasticities) == null ? void 0 : _a.forEach((t, s) => _.add(O(s)));
  const K = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map();
  let W = 0, Y = 0;
  for (const t of _) {
    const s = parseFloat(t.split("|")[0]), a = t.split("|")[1], c = s >= 1e8, r = c ? `Steel_${++W}` : `Conc_${++Y}`;
    K.set(t, r), q.set(t, c);
    const T = a !== "-" ? parseFloat(a) : c ? 76.97 : 24, m = n(s), u = l(T), w = (() => {
      const U = N.elementInputs.poissonsRatios;
      if (U) {
        for (const [v, lt] of U) if (O(v) === t) return lt;
      }
    })(), Q = w !== void 0 ? w : c ? 0.3 : 0.2, C = c ? 117e-7 : 1e-5;
    if (c) {
      i.push(`  MATERIAL  "${r}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${D(u)}`), i.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${S(m)}  U ${Q}  A ${C}`);
      const U = 345e3, v = 45e4;
      i.push(`  MATERIAL  "${r}"  FY ${S(n(U))}  FU ${S(n(v))}  FYE ${S(n(U * 1.1))}  FUE ${S(n(v * 1.1))}`);
    } else i.push(`  MATERIAL  "${r}"    TYPE "Concrete"    WEIGHTPERVOLUME ${D(u)}`), i.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${S(m)}  U ${Q}  A ${C}`), i.push(`  MATERIAL  "${r}"    FC ${S(n(24e3))}`);
  }
  const St = /* @__PURE__ */ new Map();
  {
    const t = /* @__PURE__ */ new Map();
    (_b = $.sectionShapes) == null ? void 0 : _b.forEach((a, c) => {
      var _a2;
      if ((a == null ? void 0 : a.type) !== "CFT" || !(a.fillE > 0) || !((((_a2 = $.elasticities) == null ? void 0 : _a2.get(c)) ?? 0) > 0)) return;
      const T = (a.fillRho ?? 2.4) * 9.80665, m = `${a.fillE}|${T.toFixed(4)}`;
      let u = t.get(m);
      u || (u = `ConcFill_${t.size + 1}`, t.set(m, u), i.push(`  MATERIAL  "${u}"    TYPE "Concrete"    WEIGHTPERVOLUME ${D(l(T))}`), i.push(`  MATERIAL  "${u}"    SYMTYPE "Isotropic"  E ${S(n(a.fillE))}  U 0.2  A 1.0e-5`), i.push(`  MATERIAL  "${u}"    FC ${S(n(24e3))}`)), St.set(c, u);
    });
  }
  i.push(""), i.push("$ FRAME SECTIONS");
  const Ot = /* @__PURE__ */ new Set(), Rt = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), gt = 0.05;
  R.forEach((t, s) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (t.length !== 2) return;
    const a = (_a2 = $.sectionShapes) == null ? void 0 : _a2.get(s), c = ((_b2 = $.elasticities) == null ? void 0 : _b2.get(s)) ?? 0, r = K.get(O(s)) || "Conc_1", T = q.get(O(s)) ?? c >= 1e8, m = ((_c2 = $.areas) == null ? void 0 : _c2.get(s)) ?? 0, u = ((_d2 = $.momentsOfInertiaZ) == null ? void 0 : _d2.get(s)) ?? 0, w = ((_e3 = $.momentsOfInertiaY) == null ? void 0 : _e3.get(s)) ?? 0, Q = ((_f2 = $.torsionalConstants) == null ? void 0 : _f2.get(s)) ?? 0;
    let C = (a == null ? void 0 : a.type) || "rect", U = (a == null ? void 0 : a.h) ?? 0, v = (a == null ? void 0 : a.b) ?? 0, lt = (a == null ? void 0 : a.d) ?? 0;
    const tt = (a == null ? void 0 : a.tf) ?? 0, pt = (a == null ? void 0 : a.tw) ?? 0;
    if (!a && U <= 0 && v <= 0 && lt <= 0 && m > 0 && u > 0 && w > 0) {
      const wt = (_g2 = $.cantos) == null ? void 0 : _g2.get(s), Vt = (_h = $.anchos) == null ? void 0 : _h.get(s);
      U = wt && wt > 0 ? wt : Math.sqrt(12 * u / m), v = Vt && Vt > 0 ? Vt : m / U, (!isFinite(U) || U < gt) && (U = gt), (!isFinite(v) || v < gt) && (v = gt), C = "general";
    } else U <= 0 && v <= 0 && lt <= 0 && m > 0 && (u > 0 ? (U = Math.sqrt(12 * u / m), v = m / U) : U = v = Math.sqrt(m), (!isFinite(U) || U < gt) && (U = gt), (!isFinite(v) || v < gt) && (v = gt), C = "rect");
    U <= 0 && v <= 0 && lt <= 0 && (U = 0.3, v = 0.3, C = "rect");
    const Wt = (a == null ? void 0 : a.name) ? `NAME_${a.name}` : `${C}_${S(U)}_${S(v)}_${S(lt)}_${S(tt)}_${S(pt)}_${r}`;
    (a == null ? void 0 : a.name) && !Lt.has(Wt) && Lt.set(Wt, a.name);
    let Nt = Lt.get(Wt);
    if (!Nt) {
      const wt = T ? "S" : "C";
      C === "general" ? Nt = `${wt}_G${Ot.size + 1}` : C === "rect" ? Nt = `${wt}_R${Math.round(v * 100)}x${Math.round(U * 100)}` : C === "circ" ? Nt = `${wt}_C_D${Math.round(lt * 100)}` : C === "I" ? Nt = `${wt}_I${Math.round(U * 100)}x${Math.round(v * 100)}` : C === "HSS" ? Nt = `${wt}_HSS${Math.round(v * 100)}x${Math.round(U * 100)}x${Math.round(pt * 1e3)}` : Nt = `${wt}_Sec${Ot.size + 1}`, Lt.set(Wt, Nt);
    }
    if (Rt.set(s, Nt), Ot.has(Nt)) return;
    Ot.add(Nt);
    const ee = St.get(s);
    if (C === "CFT" && ee && lt > 0 && pt > 0 && !(U > 0 && v > 0)) {
      i.push(`  FRAMESECTION  "${Nt}"  MATERIAL "${r}"  SHAPE "Filled Steel Pipe"  D ${S(g(lt))} T ${S(g(pt))} FILLMATERIAL "${ee}"`);
      return;
    }
    if (C === "CFT" && ee && U > 0 && v > 0 && pt > 0) {
      i.push(`  FRAMESECTION  "${Nt}"  MATERIAL "${r}"  SHAPE "Filled Steel Tube"  D ${S(g(U))} B ${S(g(v))} TF ${S(g(tt > 0 ? tt : pt))} TW ${S(g(pt))} FILLMATERIAL "${ee}"`);
      return;
    }
    const se = a, Qe = !((se == null ? void 0 : se.t2b) > 0) || Math.abs(se.t2b - v) < 1e-9 && Math.abs((se.tfb ?? tt) - tt) < 1e-9;
    if (C === "I" && U > 0 && v > 0 && tt > 0 && pt > 0 && Qe) {
      i.push(`  FRAMESECTION  "${Nt}"  MATERIAL "${r}"  SHAPE "Steel I/Wide Flange"  D ${S(g(U))} B ${S(g(v))} TF ${S(g(tt))} TW ${S(g(pt))} `);
      return;
    }
    if (C === "HSS" && U > 0 && v > 0 && tt > 0 && pt > 0) {
      i.push(`  FRAMESECTION  "${Nt}"  MATERIAL "${r}"  SHAPE "Steel Tube"  D ${S(g(U))} B ${S(g(v))} TF ${S(g(tt))} TW ${S(g(pt))} `);
      return;
    }
    if (C === "C" && U > 0 && v > 0 && tt > 0 && pt > 0) {
      i.push(`  FRAMESECTION  "${Nt}"  MATERIAL "${r}"  SHAPE "Steel Channel"  D ${S(g(U))} B ${S(g(v))} TF ${S(g(tt))} TW ${S(g(pt))} `);
      return;
    }
    if (C === "2L" && U > 0 && v > 0 && tt > 0 && pt > 0) {
      i.push(`  FRAMESECTION  "${Nt}"  MATERIAL "${r}"  SHAPE "Steel Double Angle"  D ${S(g(U))} B ${S(g(v))} TF ${S(g(tt))} TW ${S(g(pt))} DIS ${S(g((se == null ? void 0 : se.dis) ?? 0))} `);
      return;
    }
    const ts = m > 0 && u > 0 && w > 0;
    let yt;
    C === "general" || ts ? yt = "General" : C === "I" ? yt = "Steel I/Wide Flange" : C === "HSS" ? yt = "Steel Tube" : C === "CFT" ? yt = "Filled Steel Tube" : C === "pipe" ? yt = "Steel Pipe" : C === "L" ? yt = "Steel Angle" : C === "C" ? yt = "Steel Channel" : C === "2C" ? yt = "Steel Double Channel" : C === "circ" ? yt = "Concrete Circle" : yt = "Concrete Rectangular";
    let kt = `  FRAMESECTION  "${Nt}"  MATERIAL "${r}"  SHAPE "${yt}"`;
    if (yt === "General") {
      const wt = ((_i = $.shearAreasZ) == null ? void 0 : _i.get(s)) || m * 5 / 6, Vt = ((_j = $.shearAreasY) == null ? void 0 : _j.get(s)) || m * 5 / 6;
      kt += `  D ${S(g(U))} B ${S(g(v))} AREA ${D(m * 1e6)} AS2 ${D(wt * 1e6)} AS3 ${D(Vt * 1e6)} I33 ${D(u * 1e12)} I22 ${D(w * 1e12)} TORSION ${D((Q || u + w) * 1e12)} S33POS ${D(2 * u / U * 1e9)} S33NEG ${D(2 * u / U * 1e9)} S22POS ${D(2 * w / v * 1e9)} S22NEG ${D(2 * w / v * 1e9)} Z33 ${D(2 * u / U * 1e9)} Z22 ${D(2 * w / v * 1e9)} R33 ${D(Math.sqrt(u / m) * 1e3)} R22 ${D(Math.sqrt(w / m) * 1e3)} `, i.push(kt);
      return;
    }
    U && (kt += `  D ${S(g(U))}`), v && (kt += `  B ${S(g(v))}`), lt && !U && (kt += `  D ${S(g(lt))}`), tt && (kt += `  TF ${S(g(tt))}`), pt && (kt += `  TW ${S(g(pt))}`), i.push(kt);
  }), i.push("");
  const Dt = /* @__PURE__ */ new Map();
  let bt = 0;
  A.forEach((t) => {
    const { dz: s } = y(t[2]), a = `${S(t[0])},${S(t[1])},${s}`;
    Dt.has(a) || Dt.set(a, `${++bt}`);
  });
  const ot = /* @__PURE__ */ new Map(), ut = [];
  {
    const t = ve(A, R, B.springs).nodales, s = /* @__PURE__ */ new Map();
    for (const [a, c] of t) {
      const r = c.map((u, w) => w < 3 ? u * V / P : u * V * P), T = r.map((u) => +u.toPrecision(12)).join("|");
      let m = s.get(T);
      if (!m) {
        m = `SPR${s.size + 1}`, s.set(T, m);
        const u = ["UX", "UY", "UZ", "RX", "RY", "RZ"], w = r.map((Q, C) => `${u[C]}  ${+Q.toPrecision(12)}`);
        ut.push(`  POINTSPRING  "${m}"  NONLINEARSPECOPTION  "LINKS"  ${w.join(" ")} `);
      }
      ot.set(a, m);
    }
    ut.length && (i.push("$ POINT SPRING PROPERTIES"), ut.forEach((a) => i.push(a)), i.push(""));
  }
  i.push("$ POINT COORDINATES");
  for (const [t, s] of Dt) {
    const [a, c, r] = t.split(",").map(Number);
    i.push(r ? `  POINT "${s}"  ${S(g(a))} ${S(g(c))} ${S(g(r))} ` : `  POINT "${s}"  ${S(g(a))} ${S(g(c))} `);
  }
  i.push("");
  const ht = (t) => {
    const s = A[t], { story: a, dz: c } = y(s[2]), r = `${S(s[0])},${S(s[1])},${c}`;
    return { pt: Dt.get(r) || "1", story: a };
  }, $t = (t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2;
    const s = [], a = (_a2 = N.propertyModifiers) == null ? void 0 : _a2.get(t);
    a && a.some((C) => Math.abs(C - 1) > 1e-9) && s.push(`PROPMODIFIERS "${a.map((C) => S(C)).join(" ")}"`);
    const c = (_b2 = $.localAngles) == null ? void 0 : _b2.get(t);
    c !== void 0 && isFinite(c) && Math.abs(c) > 1e-9 && s.push(`ANG ${S(c)}`);
    const r = (_c2 = $.momentReleases) == null ? void 0 : _c2.get(t);
    if (r && r.some((C) => C)) {
      const C = [];
      r.length === 12 ? (r[0] && C.push("PI"), r[1] && C.push("V2I"), r[2] && C.push("V3I"), r[3] && C.push("TI"), r[4] && C.push("M2I"), r[5] && C.push("M3I"), r[6] && C.push("PJ"), r[7] && C.push("V2J"), r[8] && C.push("V3J"), r[9] && C.push("TJ"), r[10] && C.push("M2J"), r[11] && C.push("M3J")) : r.length === 6 && (r[0] && C.push("TI"), r[1] && C.push("M2I"), r[2] && C.push("M3I"), r[3] && C.push("TJ"), r[4] && C.push("M2J"), r[5] && C.push("M3J")), C.length > 0 && s.push(`RELEASE "${C.join(" ")}"`);
    }
    const T = (_d2 = $.insertionPoints) == null ? void 0 : _d2.get(t);
    T && (Math.abs(T[0]) > 1e-9 || Math.abs(T[1]) > 1e-9) && s.push(`LATEROFFSET ${S(g(T[0]))} TRANSOFFSET ${S(g(T[1]))}`);
    const m = (_e3 = $.rigidOffsets) == null ? void 0 : _e3.get(t), u = (_f2 = $.endOffsets) == null ? void 0 : _f2.get(t), w = u ? [u[0], u[1]] : m, Q = u && u.length > 2 ? u[2] : 0;
    return w && (Math.abs(w[0]) > 1e-9 || Math.abs(w[1]) > 1e-9) && s.push(`LENGTHOFFI ${S(g(w[0]))} LENGTHOFFJ ${S(g(w[1]))} RIGIDZONE ${S(Q)}`), s.length > 0 ? ` ${s.join(" ")} ` : "";
  }, xt = [], Yt = /* @__PURE__ */ new Set(), Ut = /* @__PURE__ */ new Map();
  R.forEach((t, s) => {
    if (t.length !== 2) return;
    const a = xe(A, t);
    if (a === "BEAM") return;
    const c = A[t[0]][2] <= A[t[1]][2] ? t[0] : t[1], r = A[t[0]][2] <= A[t[1]][2] ? t[1] : t[0];
    if (Math.abs(A[c][0] - A[r][0]) > 1e-6 || Math.abs(A[c][1] - A[r][1]) > 1e-6) return;
    const T = ht(c), m = Rt.get(s) || `Sec_${s}`, u = `${T.pt}_${m}_${a}`;
    Ut.has(u) || Ut.set(u, []), Ut.get(u).push({ i: s, bot: c, top: r, zBot: S(A[c][2]), zTop: S(A[r][2]), planPt: T.pt, secName: m, type: a });
  }), Ut.forEach((t, s) => {
    t.sort((c, r) => c.zBot - r.zBot);
    let a = 0;
    for (let c = 1; c <= t.length; c++) if (c === t.length || Math.abs(t[c].zBot - t[c - 1].zTop) > 1e-6) {
      const T = t.slice(a, c);
      T.length >= 1 && (xt.push({ elemIndices: T.map((m) => m.i), planPt: T[0].planPt, bottomNodeIdx: T[0].bot, topNodeIdx: T[T.length - 1].top, secName: T[0].secName, type: T[0].type, nSegments: T.length }), T.forEach((m) => Yt.add(m.i))), a = c;
    }
  }), i.push("$ LINE CONNECTIVITIES");
  const oe = [], qt = (t) => st.indexOf(t), Ae = /* @__PURE__ */ new Map(), de = (t, s, a, c, r, T, m, u) => {
    const w = ht(c), Q = ht(a);
    u !== void 0 && Ae.set(u, { name: t, story: w.story });
    const C = qt(w.story) - qt(Q.story);
    C <= 0 ? i.push(`  LINE  "${t}"  BEAM  "${Q.pt}"  "${w.pt}"  0`) : i.push(`  LINE  "${t}"  ${s}  "${Q.pt}"  "${w.pt}"  ${C}`);
    const U = $.meshAtIntersections === false;
    oe.push(`  LINEASSIGN  "${t}"  "${w.story}"  SECTION "${r}" ${T} MINNUMSTA ${m} AUTOMESH "${U ? "NO" : "YES"}"  MESHATINTERSECTIONS "${U ? "NO" : "YES"}"  `);
  }, Me = /* @__PURE__ */ new Map();
  xt.forEach((t, s) => {
    const a = $t(t.elemIndices[0]), c = [];
    let r = [];
    t.elemIndices.forEach((T, m) => {
      r.push(T);
      const [u, w] = R[T], Q = A[u][2] >= A[w][2] ? u : w;
      (y(A[Q][2]).dz === 0 || m === t.elemIndices.length - 1) && (c.push(r), r = []);
    }), c.forEach((T) => {
      const [m, u] = R[T[0]], w = A[m][2] <= A[u][2] ? m : u, [Q, C] = R[T[T.length - 1]], U = A[Q][2] >= A[C][2] ? Q : C;
      qt(ht(U).story) - qt(ht(w).story);
      let v = `C${s + 1}`;
      for (let lt = 1; ; lt++) {
        const tt = i.length;
        de(v, t.type, w, U, t.secName, a, T.length);
        const pt = i[tt], Jt = Me.get(v);
        if (Jt === void 0) {
          Me.set(v, pt);
          break;
        }
        if (i.splice(tt, i.length - tt), Jt === pt) break;
        oe.pop(), v = `C${s + 1}_${lt}`;
      }
    });
  }), R.forEach((t, s) => {
    if (t.length !== 2 || Yt.has(s)) return;
    const a = xe(A, t), c = Rt.get(s) || `Sec_${s}`, r = $t(s), T = A[t[0]][2] <= A[t[1]][2] ? t[0] : t[1], m = A[t[0]][2] <= A[t[1]][2] ? t[1] : t[0];
    de(`E${s + 1}`, a === "BEAM" ? "BRACE" : a, T, m, c, r, 3, s);
  }), i.push("");
  const jt = N.weightMode ?? "auto", Bt = /* @__PURE__ */ new Set();
  i.push("$ POINT ASSIGNS"), (_c = B.supports) == null ? void 0 : _c.forEach((t, s) => {
    const a = [];
    if (t[0] && a.push("UX"), t[1] && a.push("UY"), t[2] && a.push("UZ"), t[3] && a.push("RX"), t[4] && a.push("RY"), t[5] && a.push("RZ"), a.length > 0) {
      const c = ht(s), r = c.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", T = ot.has(s) ? ` SPRINGPROP "${ot.get(s)}" ` : "";
      i.push(`  POINTASSIGN  "${c.pt}"  "${c.story}"  RESTRAINT "${a.join(" ")}" ${r}${T} `), Bt.add(`${c.pt}@${c.story}`);
    }
  });
  for (const [t, s] of ot) {
    const a = ht(t);
    Bt.has(`${a.pt}@${a.story}`) || (i.push(`  POINTASSIGN  "${a.pt}"  "${a.story}"  SPRINGPROP "${s}" `), Bt.add(`${a.pt}@${a.story}`));
  }
  const We = !!(B.diaphragms && [...B.diaphragms.values()].some((t) => t !== 0)), Te = N.diaphragm ?? "auto", ne = Te === "d1" || Te === "auto" && We, _t = /* @__PURE__ */ new Set();
  B.diaphragms && B.diaphragms.forEach((t, s) => {
    t !== 0 && _t.add(s);
  }), ne && _t.size ? _t.forEach((t) => {
    const s = ht(t), a = `${s.pt}@${s.story}`;
    !Bt.has(a) && s.story !== "Base" && (i.push(`  POINTASSIGN  "${s.pt}"  "${s.story}"  DIAPH "D1"  `), Bt.add(a));
  }) : ne && xt.forEach((t) => {
    for (const s of t.elemIndices) {
      const [a, c] = R[s], r = A[a][2] >= A[c][2] ? a : c, T = ht(r), m = `${T.pt}@${T.story}`;
      !Bt.has(m) && T.story !== "Base" && (i.push(`  POINTASSIGN  "${T.pt}"  "${T.story}"  DIAPH "D1"  `), Bt.add(m));
    }
  }), jt === "manual" && B.loads && B.loads.forEach((t, s) => {
    const [a, c, r] = dt(s, t);
    if (Math.abs(a) < 1e-10 && Math.abs(c) < 1e-10 && Math.abs(r) < 1e-10) return;
    const T = ht(s), m = `${T.pt}@${T.story}`;
    Bt.has(m) || (i.push(`  POINTASSIGN  "${T.pt}"  "${T.story}"  DIAPH "DISCONNECTED"  `), Bt.add(m));
  }), i.push(""), i.push("$ LINE ASSIGNS"), oe.forEach((t) => i.push(t)), i.push("");
  const Ft = [], $e = $.areaObjects, me = /* @__PURE__ */ new Set(), ge = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map();
  $e == null ? void 0 : $e.forEach((t) => t.cells.forEach((s) => me.add(s))), R.forEach((t, s) => {
    if (t.length === 4 || t.length === 3) {
      const a = A[t[0]], c = A[t[1]], r = A[t[2]], T = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], m = [r[0] - a[0], r[1] - a[1], r[2] - a[2]], u = T[1] * m[2] - T[2] * m[1], w = T[2] * m[0] - T[0] * m[2], Q = T[0] * m[1] - T[1] * m[0], C = Math.sqrt(u * u + w * w + Q * Q), U = C > 1e-10 && Math.abs(Q) / C < 0.5;
      Ft.push({ idx: s, el: t, isWall: U }), me.has(s) && Ft.pop();
    }
  });
  const Gt = (() => {
    for (const [t, s] of q) if (!s) return K.get(t);
    return K.values().next().value || "Conc_1";
  })();
  $e == null ? void 0 : $e.forEach((t, s) => {
    Ft.push({ idx: t.cells[0], el: t.nodes, isWall: false }), t.q !== void 0 && ge.set(t.cells[0], t.q), t.ang !== void 0 && ue.set(t.cells[0], t.ang);
  });
  const Ht = "DECK";
  let ae = false;
  const ie = [], Ie = (t) => {
    const s = N.elementInputs.plateFormulations, a = Ft.find((r) => r.isWall === t), c = s && a ? s.get(a.idx) : void 0;
    return c === 2 ? "Membrane" : c === 1 ? "ShellThin" : "ShellThick";
  }, Ne = (t, s) => {
    const a = N.elementInputs.thicknesses, c = Ft.find((r) => r.isWall === t);
    return (c ? a == null ? void 0 : a.get(c.idx) : void 0) ?? (a == null ? void 0 : a.values().next().value) ?? s;
  }, Le = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], Qt = (t) => {
    var _a2;
    const a = (_a2 = $.shellModifiers) == null ? void 0 : _a2.get(t);
    if (a && a.length >= 8) return a.slice(0, 8);
    const c = $.membraneModifiers, r = $.bendingModifiers, T = c == null ? void 0 : c.get(t), m = r == null ? void 0 : r.get(t);
    if (T === void 0 && m === void 0) return null;
    const u = T ?? 1, w = m ?? 1;
    return [u, u, u, w, w, w, w, w];
  }, Oe = (t, s) => {
    const a = Ft.filter((m) => m.isWall === s), c = /* @__PURE__ */ new Map();
    for (const m of a) {
      const u = Qt(m.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      c.set(u.map((w) => S(w)).join(","), u);
    }
    if (c.size === 0) return "";
    c.size > 1 && console.warn(`[e2k] "${t}": ${c.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const r = c.values().next().value, T = Le.map((m, u) => Math.abs(r[u] - 1) > 1e-9 ? `${m} ${S(r[u])}` : "").filter(Boolean);
    return T.length ? `  SHELLPROP  "${t}"  ${T.join(" ")} ` : "";
  }, Re = N.elementInputs.thicknesses, De = N.elementInputs.plateFormulations, Zt = (t) => {
    var _a2;
    const s = Re == null ? void 0 : Re.get(t.idx), a = De == null ? void 0 : De.get(t.idx), c = Qt(t.idx), r = (_a2 = N.elementInputs.deckSections) == null ? void 0 : _a2.get(t.idx), T = r ? [r.tc, r.hr, r.wrt, r.wrb, r.sr, r.w].map((m) => S(m)).join(",") : "-";
    return `${t.isWall ? "W" : "F"}|${s ?? "-"}|${a ?? "-"}|${c ? c.map((m) => S(m)).join(",") : "-"}|${O(t.idx)}|${T}`;
  }, ce = (t) => {
    var _a2;
    if ((_a2 = N.elementInputs.deckSections) == null ? void 0 : _a2.has(t)) return true;
    const s = Qt(t);
    return s ? Math.abs(s[3]) < 1e-9 && Math.abs(s[4]) < 1e-9 : false;
  }, Kt = /* @__PURE__ */ new Map();
  let He = 0, ze = 0, Je = 0;
  for (const t of Ft) {
    const s = Zt(t);
    if (Kt.has(s)) continue;
    const a = t.isWall, c = !a && ce(t.idx), r = a ? ++ze : c ? ++Je : ++He, T = O(t.idx);
    Kt.set(s, { nombre: (a ? "Muro" : c ? Ht : "Losa") + (r === 1 ? "" : String(r)), isWall: a, mem: c, t: Re == null ? void 0 : Re.get(t.idx), pf: De == null ? void 0 : De.get(t.idx), idx: t.idx, mat: K.get(T) ?? Gt, acero: q.get(T) ?? false });
  }
  const te = (t) => {
    var _a2;
    return ((_a2 = Kt.get(Zt(t))) == null ? void 0 : _a2.nombre) ?? (t.isWall ? "Muro" : "Losa");
  }, Ce = (t) => t === 2 ? "Membrane" : t === 1 ? "ShellThin" : "ShellThick", je = (t, s) => {
    const a = Ft.find((T) => Zt(T) === s), c = a ? Qt(a.idx) ?? null : null;
    if (!c) return "";
    const r = Le.map((T, m) => Math.abs(c[m] - 1) > 1e-9 ? `${T} ${S(c[m])}` : "").filter(Boolean);
    return r.length ? `  SHELLPROP  "${t}"  ${r.join(" ")} ` : "";
  }, Xt = Ft.find((t) => !t.isWall), Pe = Ft.find((t) => t.isWall), re = /* @__PURE__ */ new Set();
  Xt && re.add(Zt(Xt)), Pe && re.add(Zt(Pe));
  const Fe = [...Kt.entries()].filter(([t]) => !re.has(t)), le = (t) => {
    var _a2;
    return t === void 0 ? void 0 : (_a2 = N.elementInputs.deckSections) == null ? void 0 : _a2.get(t);
  }, _e = (t) => t * V / P ** 2, be = (t, s) => {
    const a = (c) => D(g(c));
    return `  SHELLPROP  "${t}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${Gt}"  DECKMATERIAL "${Gt}"  DECKSLABDEPTH ${a(s.tc)} DECKRIBDEPTH ${a(s.hr)} DECKRIBWIDTHTOP ${a(s.wrt)} DECKRIBWIDTHBOTTOM ${a(s.wrb)} DECKRIBSPACING ${a(s.sr)} DECKSHEARTHICKNESS ${a(76e-5)} DECKUNITWEIGHT ${D(_e(s.w))} SHEARSTUDDIAM ${a(0.019)} SHEARSTUDHEIGHT ${a(0.1)} SHEARSTUDFU 400 `;
  };
  if (Ft.some((t) => !t.isWall)) {
    ae = !!Xt && ce(Xt.idx);
    const t = Ne(false, 0.15);
    if (ae) {
      i.push("$ DECK PROPERTIES");
      const a = [...Kt.values()].find((r) => r.nombre === Ht), c = le(Xt == null ? void 0 : Xt.idx);
      (a == null ? void 0 : a.acero) ? i.push(`  SHELLPROP  "${Ht}"  PROPTYPE  "Slab"  MATERIAL "${a.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${S(g(t))} `) : c ? i.push(be(Ht, c)) : i.push(`  SHELLPROP  "${Ht}"  PROPTYPE  "Slab"  MATERIAL "${Gt}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${S(g(t))} `);
    } else i.push("$ SLAB PROPERTIES"), i.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${Gt}"  MODELINGTYPE "${Ie(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${S(g(t))} `);
    const s = Oe(ae ? Ht : "Losa", false);
    s && i.push(s), i.push("");
  }
  if (Ft.some((t) => t.isWall)) {
    i.push("$ WALL PROPERTIES");
    const t = Ne(true, 0.2), s = Ie(true);
    i.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${Gt}"  MODELINGTYPE "${s}"  WALLTHICKNESS ${S(g(t))} `);
    const a = Oe("Muro", true);
    a && i.push(a), i.push("");
  }
  if (Fe.length) {
    i.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [t, s] of Fe) {
      const a = s.t ?? (s.isWall ? 0.2 : 0.15);
      i.push(s.isWall ? `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Wall"  MATERIAL "${s.mat ?? Gt}"  MODELINGTYPE "${Ce(s.pf)}"  WALLTHICKNESS ${S(g(a))} ` : s.mem && s.acero ? `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Slab"  MATERIAL "${s.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${S(g(a))} ` : s.mem && le(s.idx) ? be(s.nombre, le(s.idx)) : s.mem ? `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Slab"  MATERIAL "${Gt}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${S(g(a))} ` : `  SHELLPROP  "${s.nombre}"  PROPTYPE  "Slab"  MATERIAL "${Gt}"  MODELINGTYPE "${Ce(s.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${S(g(a))} `);
      const c = je(s.nombre, t);
      c && i.push(c);
    }
    i.push("");
  }
  if (Ft.length > 0) {
    i.push("$ AREA CONNECTIVITIES");
    const t = [];
    Ft.forEach((s, a) => {
      const { el: c, isWall: r } = s, T = r ? `W${a + 1}` : `F${a + 1}`, m = r ? "PANEL" : "FLOOR", u = c.map((w) => ht(w));
      if (r) {
        const w = (lt) => st.indexOf(lt);
        if (new Set(u.map((lt) => lt.pt)).size === 4) {
          const lt = Math.max(...u.map((pt) => w(pt.story))), tt = u.map((pt) => lt - w(pt.story));
          i.push(`  AREA "${T}"  ${m}  4  "${u[0].pt}"  "${u[1].pt}"  "${u[2].pt}"  "${u[3].pt}"  ${tt.join("  ")}  `), t.push(`  AREAASSIGN  "${T}"  "${st[lt]}"  SECTION "${te(s)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const C = A[c[0]][2] <= A[c[2]][2] ? 0 : 2, U = A[c[1]][2] <= A[c[3]][2] ? 1 : 3;
        i.push(`  AREA "${T}"  ${m}  4  "${u[C].pt}"  "${u[U].pt}"  "${u[U].pt}"  "${u[C].pt}"  1  1  0  0  `);
        const v = u[C === 0 ? 2 : 0].story;
        t.push(`  AREAASSIGN  "${T}"  "${v}"  SECTION "${te(s)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const w = u.length, Q = (tt) => st.indexOf(tt), C = Math.max(...u.map((tt) => Q(tt.story))), U = u.map((tt) => C - Q(tt.story)), v = st[C] ?? u[0].story;
        i.push(`  AREA "${T}"  ${m}  ${w}  ` + u.map((tt) => `"${tt.pt}"`).join("  ") + "  " + U.join("  ") + "  ");
        const lt = ue.get(s.idx) ?? (F == null ? void 0 : F.get(s.idx));
        t.push(ce(s.idx) ? `  AREAASSIGN  "${T}"  "${v}"  SECTION "${te(s)}"  ANG ${S(lt ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${T}"  "${v}"  SECTION "${te(s)}" ${ne && (!_t.size || (R[s.idx] ?? []).every((tt) => _t.has(tt))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), ie.push({ name: T, story: v, idx: s.idx });
      }
    }), i.push(""), i.push("$ AREA ASSIGNS"), t.forEach((s) => i.push(s)), i.push("");
  }
  const Ze = jt === "manual" ? 0 : ct ?? 1;
  i.push("$ LOAD PATTERNS");
  const vt = ((_d = N.loadPatterns) == null ? void 0 : _d.length) ? N.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: Ze }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const t of vt) {
    let s;
    t.type === "Dead" ? s = jt === "manual" ? 0 : t.selfWeightMultiplier ?? ct ?? 1 : (s = 0, (t.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${t.name}" (tipo ${t.type ?? "Other"}) pedia SELFWEIGHT ${t.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), i.push(`  LOADPATTERN "${t.name}"  TYPE  "${t.type ?? "Other"}"  SELFWEIGHT  ${s}`);
  }
  i.push("");
  const zt = N.loadPatternDestino && vt.some((t) => t.name === N.loadPatternDestino) ? N.loadPatternDestino : ((_e2 = vt.find((t) => t.type === "Dead")) == null ? void 0 : _e2.name) ?? vt[0].name, fe = [], Ee = /* @__PURE__ */ new Map(), ye = (t, s) => {
    const a = Ee.get(t) ?? [0, 0, 0, 0, 0, 0];
    for (let c = 0; c < 6; c++) a[c] += s[c] ?? 0;
    Ee.set(t, a);
  }, Ke = zt === (((_f = vt.find((t) => t.type === "Dead")) == null ? void 0 : _f.name) ?? vt[0].name), Xe = jt === "manual" || !Ke || ft;
  if (B.loads && B.loads.size > 0 && B.loads.forEach((t, s) => {
    const [a, c, r] = dt(s, t), [T, m, u] = Tt(s, t);
    ye(s, [a, c, Xe ? r : 0, T, m, u]);
  }), B.moments && B.moments.size > 0 && B.moments.forEach((t, s) => {
    ye(s, [0, 0, 0, t[0] ?? 0, t[1] ?? 0, t[2] ?? 0]);
  }), Ee.forEach((t, s) => {
    if (t.every((c) => Math.abs(c) <= 1e-10)) return;
    const a = ht(s);
    fe.push(`  POINTLOAD  "${a.pt}"  "${a.story}"  TYPE "FORCE"  LC "${zt}"  FX ${D(e(t[0]))}  FY ${D(e(t[1]))}  FZ ${D(e(t[2]))}  MX ${D(o(t[3]))}  MY ${D(o(t[4]))}  MZ ${D(o(t[5]))}`);
  }), fe.length > 0 && (i.push("$ POINT OBJECT LOADS"), fe.forEach((t) => i.push(t)), i.push("")), ft && Mt.size > 0) {
    const t = [];
    for (const s of Mt) {
      const a = nt.get(s), c = Ae.get(s);
      if (!c) continue;
      const r = (T) => D(J(T) / P);
      Math.abs(a[2]) > 1e-12 && t.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "${a[2] < 0 ? "GRAV" : "Z"}"  LC "${zt}"  FVAL ${r(Math.abs(a[2]))}`), Math.abs(a[0]) > 1e-12 && t.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "X"  LC "${zt}"  FVAL ${r(a[0])}`), Math.abs(a[1]) > 1e-12 && t.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "Y"  LC "${zt}"  FVAL ${r(a[1])}`);
    }
    t.length && (i.push("$ FRAME OBJECT LOADS"), t.forEach((s) => i.push(s)), i.push(""));
  }
  if (f && f.size > 0 && ie.length > 0) {
    const t = [];
    for (const s of ie) {
      const a = ge.get(s.idx), c = a !== void 0 ? { value: a } : f.get(s.idx);
      if (!c || Math.abs(c.value) < 1e-12) continue;
      const r = c.dir ?? "GRAV", T = r === "GRAV" ? -c.value : c.value;
      t.push(`  AREALOAD  "${s.name}"  "${s.story}"  TYPE "UNIFF"  DIR "${r}"  LC "${c.pattern ?? zt}"  FVAL ${D(J(T) / (P * P))}`);
    }
    t.length > 0 && (i.push("$ SHELL OBJECT LOADS"), t.forEach((s) => i.push(s)), i.push(""));
  }
  i.push("$ ANALYSIS OPTIONS"), i.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), i.push('  PDELTA  METHOD "NONE"  '), i.push("");
  const he = jt === "manual";
  i.push("$ MASS SOURCE"), i.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${he ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${he ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "Yes"    LUMPATSTORIES "No"    ISDEFAULT "Yes"  `), he || i.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), i.push(""), i.push("$ LOAD CASES");
  const Ve = ((_g = N.loadCases) == null ? void 0 : _g.length) ? N.loadCases : vt.map((t) => ({ name: t.name, type: "Linear Static", patterns: [{ pattern: t.name, scaleFactor: 1 }] }));
  for (const t of Ve) {
    i.push(`  LOADCASE "${t.name}"  TYPE  "${t.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const s of t.patterns ?? []) i.push(`  LOADCASE "${t.name}"  LOADPAT  "${s.pattern}"  SF ${s.scaleFactor} `);
  }
  const qe = N.modalModes ?? 12;
  i.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), i.push(`  LOADCASE "Modal"  MAXMODES ${qe}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), i.push("");
  const pe = N.loadCombinations;
  if (pe && pe.length) {
    i.push("$ LOAD COMBINATIONS");
    for (const t of pe) {
      i.push(`  COMBO "${t.name}"  TYPE "${t.type ?? "Linear Add"}"  `);
      for (const s of t.cases ?? []) i.push(`  COMBO "${t.name}"  LOADCASE  "${s.case}"  SF ${s.scaleFactor} `);
    }
    i.push("");
  }
  return i.push("  END"), i.push("$ END OF MODEL FILE"), i.join(`\r
`);
}
function xe(N, A) {
  const R = N[A[0]], B = N[A[1]], $ = Math.abs(B[2] - R[2]), et = Math.sqrt((B[0] - R[0]) ** 2 + (B[1] - R[1]) ** 2), at = $ > et * 0.5;
  return at && et > 0.01 ? "BRACE" : at ? "COLUMN" : "BEAM";
}
export {
  fs as a,
  Es as e,
  ve as m,
  ls as p
};
