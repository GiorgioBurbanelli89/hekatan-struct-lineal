function G(u) {
  return u && parseFloat(u) || 0;
}
function Bt(u) {
  const A = /* @__PURE__ */ new Map(), D = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let F;
  for (; (F = D.exec(u)) !== null; ) A.set(F[1], F[2] !== void 0 ? F[2] : F[3]);
  return A;
}
function as(u) {
  const A = u.split(/\r?\n/);
  return A.some((F) => F.trim().startsWith("TABLE:")) ? Vt(A) : qt(A);
}
function Vt(u) {
  var _a, _b, _c, _d, _e, _f;
  const A = [];
  let D = "";
  for (const B of u) {
    const g = B.trimEnd();
    g.endsWith("_") ? D += g.slice(0, -1) + " " : (D += g, A.push(D), D = "");
  }
  D && A.push(D);
  const F = { force: "KN", length: "m" };
  let m = "UX,UY,UZ,RX,RY,RZ";
  const H = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), ee = [], V = [], oe = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), ie = [], ae = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), c = [], $ = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map();
  let v = "";
  for (const B of A) {
    const g = B.trim();
    if (!g || g.startsWith(";") || g.startsWith("File ")) continue;
    if (g.startsWith("TABLE:")) {
      const S = g.match(/TABLE:\s+"(.+?)"/);
      v = S ? S[1].toUpperCase() : "";
      continue;
    }
    if (g === "END TABLE DATA") {
      v = "";
      continue;
    }
    const f = Bt(g);
    switch (v) {
      case "PROGRAM CONTROL": {
        const S = f.get("CurrUnits");
        if (S) {
          const y = S.split(",").map((I) => I.trim());
          y[0] && (F.force = y[0]), y[1] && (F.length = y[1]);
        }
        break;
      }
      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const S = f.get("Material");
        S && !H.has(S) && H.set(S, { E: 0, nu: 0, G: 0 });
        break;
      }
      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const S = f.get("Material");
        if (S) {
          const y = H.get(S) || { E: 0, nu: 0, G: 0 };
          y.E = G(f.get("E1")), y.G = G(f.get("G12")), y.nu = G(f.get("U12")), y.density = G(f.get("UnitMass")), H.set(S, y);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const S = f.get("Material");
        S && H.has(S) && (H.get(S).fy = G(f.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const S = f.get("SectionName");
        S && h.set(S, { material: f.get("Material") || "", shape: f.get("Shape") || "Rectangular", D: G(f.get("t3")), B: G(f.get("t2")), TF: G(f.get("tf")), TW: G(f.get("tw")), T2B: G(f.get("t2b")), TFB: G(f.get("tfb")), A: G(f.get("Area")), Iz: G(f.get("I33")), Iy: G(f.get("I22")), J: G(f.get("TorsConst")), As2: G(f.get("AS2")), As3: G(f.get("AS3")) });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const S = f.get("SectionName");
        S && j.set(S, { h: G(f.get("Height")), b: G(f.get("Width")), t: G(f.get("WebThick")) || G(f.get("FlngThick")), tf: G(f.get("FlngThick")) || G(f.get("WebThick")), mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const S = f.get("SectionName");
        S && j.set(S, { h: 0, b: 0, D: G(f.get("OuterDiam")), t: G(f.get("WallThick")), mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const S = f.get("SectionName");
        S && se.set(S, { mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const S = f.get("SectionName");
        S && se.set(S, { mat: f.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const S = f.get("Section");
        S && k.set(S, { material: f.get("Material") || "", type: f.get("Type") || "Shell", thickness: G(f.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const S = f.get("Joint");
        if (S) {
          const y = G(f.get("XorR")), I = G(f.get("Y")), l = G(f.get("Z"));
          Q.set(S, [y, I, l]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const S = f.get("Frame"), y = f.get("JointI"), I = f.get("JointJ");
        S && y && I && ee.push({ name: S, j1: y, j2: I });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const S = f.get("Area");
        if (S) {
          const y = parseInt(f.get("NumJoints") || "4"), I = [];
          for (let l = 1; l <= y; l++) {
            const n = f.get(`Joint${l}`);
            n && I.push(n);
          }
          I.length >= 3 && V.push({ name: S, joints: I });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const S = f.get("Joint");
        if (S) {
          const y = [((_a = f.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = f.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = f.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = f.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = f.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = f.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          oe.set(S, y);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const S = f.get("Joint");
        S && ne.set(S, ["U1", "U2", "U3", "R1", "R2", "R3"].map((y) => parseFloat(f.get(y) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const S = f.get("Frame"), y = f.get("AnalSect");
        S && y && re.set(S, y);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const S = f.get("Area"), y = f.get("Section");
        S && y && le.set(S, y);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const S = f.get("Frame"), y = f.get("Dir"), I = G(f.get("FOverLA"));
        if (S && y && I) {
          const l = { X: 0, Y: 1, Z: 2 }[y];
          if (l !== void 0) {
            const n = Me.get(S) ?? [0, 0, 0];
            n[l] += I, Me.set(S, n);
          }
        }
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const S = f.get("Solid");
        if (S) {
          const y = [];
          for (let I = 1; I <= 8; I++) {
            const l = f.get(`Joint${I}`);
            l && y.push(l);
          }
          y.length === 8 && c.push({ name: S, joints: y });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const S = f.get("SolidProp");
        S && $.set(S, { material: f.get("Material") || "", incomp: (f.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const S = f.get("Solid"), y = f.get("SolidProp");
        S && y && P.set(S, y);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const S = f.get("Area");
        S && pe.set(S, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((y) => f.has(y) ? G(f.get(y)) : 1));
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const S = f.get("Frame");
        S && Ee.set(S, G(f.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const S = f.get("Frame");
        S && ae.set(S, [G(f.get("LengthI")), G(f.get("LengthJ")), G(f.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const S = f.get("Joint");
        S && ie.push({ joint: S, fx: G(f.get("F1")), fy: G(f.get("F2")), fz: G(f.get("F3")), mx: G(f.get("M1")), my: G(f.get("M2")), mz: G(f.get("M3")) });
        break;
      }
    }
  }
  return Gt(F, m, H, h, k, Q, ee, V, oe, re, le, ie, ae, Ee, pe, Me, c, $, P, j, se, ne);
}
function qt(u) {
  const A = { force: "KN", length: "m" };
  let D = "UX,UY,UZ,RX,RY,RZ";
  const F = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), se = [], h = [], k = /* @__PURE__ */ new Map(), Q = [], ee = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), re = [], le = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map();
  let ae = "", Ee = "";
  for (const c of u) {
    const $ = c.trim();
    if (!$ || $.startsWith(";")) continue;
    if (!c.startsWith(" ") && !c.startsWith("	")) {
      const B = $.toUpperCase();
      if (B === "END") break;
      B.startsWith("SHELL SECTION") ? ae = "SHELL SECTION" : B.startsWith("FRAME SECTION") ? ae = "FRAME SECTION" : ae = B.split(/\s+/)[0];
      continue;
    }
    const P = Bt($), v = $.split(/\s+/);
    switch (ae) {
      case "SYSTEM": {
        const B = P.get("DOF");
        B && (D = B);
        const g = P.get("LENGTH");
        g && (A.length = g);
        const f = P.get("FORCE");
        f && (A.force = f);
        break;
      }
      case "JOINT": {
        const B = v[0];
        j.set(B, [G(P.get("X")), G(P.get("Y")), G(P.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const B = P.get("ADD"), g = P.get("DOF");
        if (B && g) {
          const f = g.split(","), S = [false, false, false, false, false, false];
          for (const y of f) {
            const I = y.toUpperCase();
            (I === "UX" || I === "U1") && (S[0] = true), (I === "UY" || I === "U2") && (S[1] = true), (I === "UZ" || I === "U3") && (S[2] = true), (I === "RX" || I === "R1") && (S[3] = true), (I === "RY" || I === "R2") && (S[4] = true), (I === "RZ" || I === "R3") && (S[5] = true);
          }
          k.set(B, S);
        }
        break;
      }
      case "MATERIAL": {
        const B = P.get("NAME");
        if (B) Ee = B, F.set(B, { E: 0, nu: 0, G: 0 });
        else if (Ee) {
          const g = F.get(Ee), f = P.get("E");
          f && (g.E = G(f));
          const S = P.get("U");
          S && (g.nu = G(S)), g.G = g.E / (2 * (1 + g.nu));
          const y = P.get("M");
          y && (g.density = G(y));
        }
        break;
      }
      case "SHELL": {
        const B = v[0], g = P.get("J");
        P.get("SEC"), g && h.push({ name: B, joints: g.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const B = P.get("NAME");
        B && H.set(B, { material: P.get("MAT") || "", type: P.get("TYPE") || "Shell", thickness: G(P.get("TH")) });
        break;
      }
      case "FRAME": {
        const B = v[0], g = P.get("J");
        if (g) {
          const f = g.split(",");
          f.length >= 2 && se.push({ name: B, j1: f[0], j2: f[1] });
        }
        break;
      }
      case "LOAD": {
        const B = P.get("ADD");
        B && Q.push({ joint: B, fx: G(P.get("UX")), fy: G(P.get("UY")), fz: G(P.get("UZ")), mx: G(P.get("MX")), my: G(P.get("MY")), mz: G(P.get("MZ")) });
        break;
      }
    }
  }
  return Gt(A, D, F, m, H, j, se, h, k, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), Q, ee, V, oe, ne, re, le, ie);
}
function Gt(u, A, D, F, m, H, j, se, h, k, Q, ee, V = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = [], ie = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), Ee, pe, Me = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const c = [], $ = /* @__PURE__ */ new Map(), P = [];
  for (const [o, E] of H) $.set(o, P.length), c.push(o), P.push(E);
  const v = [], B = [], g = /* @__PURE__ */ new Map();
  for (const o of j) {
    const E = $.get(o.j1), R = $.get(o.j2);
    if (E !== void 0 && R !== void 0) {
      const U = v.length;
      v.push([E, R]), B.push(o.name);
      const O = k.get(o.name);
      O && g.set(U, O);
    }
  }
  const f = v.length;
  for (const o of se) {
    const E = o.joints.map((R) => $.get(R)).filter((R) => R !== void 0);
    if (E.length >= 3) {
      const R = v.length;
      v.push(E), B.push(o.name);
      const U = Q.get(o.name);
      U && g.set(R, U);
    }
  }
  const S = v.length - f, y = [];
  for (const o of le) {
    const E = o.joints.map((O) => $.get(O));
    if (E.some((O) => O === void 0)) continue;
    const R = v.length;
    v.push([E[0], E[1], E[3], E[2], E[4], E[5], E[7], E[6]]), B.push(o.name), y.push(R);
    const U = ae.get(o.name);
    U && g.set(R, U);
  }
  const I = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, l = /* @__PURE__ */ new Map(), n = D.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let o = 0; o < v.length; o++) {
    const E = g.get(o), R = E ? F.get(E) : null, U = E ? m.get(E) : null;
    if (R || v[o].length === 2) {
      const O = R || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, W = D.get(O.material) || n, d = W.E || n.E, J = W.nu || 0.3, _ = W.G || d / (2 * (1 + J));
      I.elasticities.set(o, d), I.shearModuli.set(o, _), I.areas.set(o, O.A || O.D * O.B), I.momentsOfInertiaZ.set(o, O.Iz || O.B * O.D ** 3 / 12), I.momentsOfInertiaY.set(o, O.Iy || O.D * O.B ** 3 / 12), I.torsionalConstants.set(o, O.J || 0), I.densities.set(o, W.density || 0), O.As2 && (I.shearAreasZ ?? (I.shearAreasZ = /* @__PURE__ */ new Map()), I.shearAreasZ.set(o, O.As2)), O.As3 && (I.shearAreasY ?? (I.shearAreasY = /* @__PURE__ */ new Map()), I.shearAreasY.set(o, O.As3));
      const Y = V.get(B[o]);
      Y && (I.endOffsets ?? (I.endOffsets = /* @__PURE__ */ new Map()), I.endOffsets.set(o, Y));
      const q = oe.get(B[o]);
      q && (I.localAngles ?? (I.localAngles = /* @__PURE__ */ new Map()), I.localAngles.set(o, q));
      const X = O;
      ((_a = O.shape) == null ? void 0 : _a.includes("Wide Flange")) || O.shape === "I" ? l.set(o, { type: "I", b: O.B, h: O.D, ...X.TF > 0 && X.TW > 0 ? { tf: X.TF, tw: X.TW, t2b: X.T2B > 0 ? X.T2B : O.B, tfb: X.TFB > 0 ? X.TFB : X.TF } : {}, name: E || "I-section" }) : /box|tube/i.test(O.shape ?? "") && X.TF > 0 && X.TW > 0 ? l.set(o, { type: "HSS", b: O.B, h: O.D, tf: X.TF, tw: X.TW, name: E }) : l.set(o, { type: "rect", b: O.B, h: O.D });
      const K = E ? Ee == null ? void 0 : Ee.get(E) : void 0;
      if (K && K.t > 0 && (K.b > 0 && K.h > 0 || (K.D ?? 0) > 0)) {
        const he = E ? pe == null ? void 0 : pe.get(E) : void 0, fe = he && ((_b = D.get(he.mat)) == null ? void 0 : _b.E) || 0;
        l.set(o, K.D ? { type: "CFT", d: K.D, tw: K.t, name: E, ...fe > 0 ? { fillE: fe } : {} } : { type: "CFT", b: K.b, h: K.h, tw: K.t, ...K.tf && K.tf !== K.t ? { tf: K.tf } : {}, name: E, ...fe > 0 ? { fillE: fe } : {} });
      }
    } else if (U) {
      const O = D.get(U.material) || n, W = O.E || n.E, d = O.nu || 0.2, J = O.G || W / (2 * (1 + d));
      I.elasticities.set(o, W), I.shearModuli.set(o, J), I.thicknesses.set(o, U.thickness), I.poissonsRatios.set(o, d), I.plateFormulations ?? (I.plateFormulations = /* @__PURE__ */ new Map()), I.plateFormulations.set(o, /thin/i.test(U.type) ? 1 : 0);
      const _ = /membrane/i.test(U.type), Y = ne.get(B[o]), q = Y && _ ? [Y[0], Y[1], Y[2], 0, 0, 0, 0, 0] : Y;
      q ? (I.shellModifiers ?? (I.shellModifiers = /* @__PURE__ */ new Map()), I.shellModifiers.set(o, q), I.membraneModifiers ?? (I.membraneModifiers = /* @__PURE__ */ new Map()), I.membraneModifiers.set(o, q[0]), I.bendingModifiers ?? (I.bendingModifiers = /* @__PURE__ */ new Map()), I.bendingModifiers.set(o, q[3])) : _ && (I.membraneModifiers ?? (I.membraneModifiers = /* @__PURE__ */ new Map()), I.membraneModifiers.set(o, 1), I.bendingModifiers ?? (I.bendingModifiers = /* @__PURE__ */ new Map()), I.bendingModifiers.set(o, 0)), I.densities.set(o, O.density || 0);
    }
  }
  if (y.length) {
    let o = false;
    for (const E of y) {
      const R = ie.get(g.get(E) || ""), U = R && D.get(R.material) || n, O = U.E || n.E, W = U.nu || 0.2;
      I.elasticities.set(E, O), I.poissonsRatios.set(E, W), I.shearModuli.set(E, U.G || O / (2 * (1 + W))), I.densities.set(E, U.density || 0), (R == null ? void 0 : R.incomp) && (o = true);
    }
    I.solidIncompatible = o;
  }
  const i = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [o, E] of h) {
    const R = $.get(o);
    R !== void 0 && i.supports.set(R, E);
  }
  {
    const o = [];
    for (const [E, R] of Me) {
      const U = $.get(E);
      U !== void 0 && R.forEach((O, W) => {
        O > 0 && o.push({ node: U, dof: W, k: O });
      });
    }
    o.length && (i.springs = o);
  }
  for (const [o, E] of re) {
    const R = B.indexOf(o);
    if (R < 0 || v[R].length !== 2) continue;
    I.frameLoads ?? (I.frameLoads = /* @__PURE__ */ new Map()), I.frameLoads.set(R, E);
    const U = P[v[R][0]], O = P[v[R][1]], W = [O[0] - U[0], O[1] - U[1], O[2] - U[2]], d = Math.hypot(W[0], W[1], W[2]);
    if (d < 1e-9) continue;
    const J = [W[0] / d, W[1] / d, W[2] / d], _ = d * d / 12, Y = [J[1] * E[2] - J[2] * E[1], J[2] * E[0] - J[0] * E[2], J[0] * E[1] - J[1] * E[0]], q = (X, K) => {
      const he = i.loads.get(X) || [0, 0, 0, 0, 0, 0];
      for (let fe = 0; fe < 6; fe++) he[fe] += K[fe];
      i.loads.set(X, he);
    };
    q(v[R][0], [E[0] * d / 2, E[1] * d / 2, E[2] * d / 2, _ * Y[0], _ * Y[1], _ * Y[2]]), q(v[R][1], [E[0] * d / 2, E[1] * d / 2, E[2] * d / 2, -_ * Y[0], -_ * Y[1], -_ * Y[2]]);
  }
  for (const o of ee) {
    const E = $.get(o.joint);
    if (E !== void 0) {
      const R = i.loads.get(E) || [0, 0, 0, 0, 0, 0];
      R[0] += o.fx, R[1] += o.fy, R[2] += o.fz, R[3] += o.mx, R[4] += o.my, R[5] += o.mz, i.loads.set(E, R);
    }
  }
  return { units: u, dof: A, materials: D, frameSections: F, shellSections: m, nodes: P, nodeNames: c, nodeNameToIdx: $, elements: v, elementNames: B, elementSections: g, nodeInputs: i, elementInputs: I, sectionShapes: l, info: { nNodes: P.length, nFrames: f, nShells: S, title: `SAP2000 (${f} frames, ${S} shells)` } };
}
function is(u) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: A, elements: D, nodeInputs: F, elementInputs: m } = u, H = { force: "KN", length: "m" };
  u.units && (u.units.force !== "KN" || u.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${u.units.force}, ${u.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const j = u.title || "Awatif Model", se = [], h = (l) => se.push(l), k = () => se.push(" ");
  h(`File ${j}.$2k was saved on m/d/yy at h:mm:ss`), k(), h('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), h("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), k();
  const Q = [], ee = (l) => {
    var _a2, _b2, _c2, _d2, _e2;
    const n = ((_a2 = m.elasticities) == null ? void 0 : _a2.get(l)) || 0, i = (_b2 = m.poissonsRatios) == null ? void 0 : _b2.get(l), o = ((_c2 = m.shearModuli) == null ? void 0 : _c2.get(l)) || 0, E = i !== void 0 ? i : n > 0 && o > 0 ? Math.max(0, Math.min(0.5, n / (2 * o) - 1)) : 0.2, R = o > 0 ? o : n > 0 ? n / (2 * (1 + E)) : 0, U = (_d2 = m.sectionShapes) == null ? void 0 : _d2.get(l), O = (U == null ? void 0 : U.type) === "CFT" && U.steelRho > 0 ? U.steelRho : ((_e2 = m.densities) == null ? void 0 : _e2.get(l)) || 0, W = O > 0 ? `_r${+O.toPrecision(6)}` : "_r0";
    return { E: n, nu: E, G: R, rho: O, key: `MAT_${Math.round(n)}_n${E.toFixed(4)}${W}` };
  }, V = [], oe = [];
  if (D.forEach((l, n) => {
    l.length === 2 ? Q.push(n) : l.length === 8 ? oe.push(n) : V.push(n);
  }), Q.length > 0) {
    h('TABLE:  "CONNECTIVITY - FRAME"');
    for (const l of Q) {
      const n = D[l];
      h(`   Frame=${l + 1}   JointI=${n[0] + 1}   JointJ=${n[1] + 1}   IsCurved=No`);
    }
    k();
  }
  if (V.length > 0) {
    h('TABLE:  "CONNECTIVITY - AREA"');
    for (const l of V) {
      const n = D[l], i = n.map((o, E) => `Joint${E + 1}=${o + 1}`).join("   ");
      h(`   Area=${l + 1}   NumJoints=${n.length}   ${i}`);
    }
    k();
  }
  if (oe.length > 0) {
    h('TABLE:  "CONNECTIVITY - SOLID"');
    for (const l of oe) {
      const n = D[l], i = [n[0], n[1], n[3], n[2], n[4], n[5], n[7], n[6]];
      h(`   Solid=${l + 1}   ${i.map((o, E) => `Joint${E + 1}=${o + 1}`).join("   ")}`);
    }
    k();
  }
  h('TABLE:  "COORDINATE SYSTEMS"'), h("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), k(), h('TABLE:  "DATABASE FORMAT TYPES"'), h("   UnitsCurr=Yes   OverrideE=No"), k();
  const ne = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map();
  for (const l of Q) {
    const n = ((_a = m.areas) == null ? void 0 : _a.get(l)) || 0, i = ((_b = m.momentsOfInertiaZ) == null ? void 0 : _b.get(l)) || 0, o = ((_c = m.momentsOfInertiaY) == null ? void 0 : _c.get(l)) || 0, E = ((_d = m.torsionalConstants) == null ? void 0 : _d.get(l)) || 0, R = ((_e = m.elasticities) == null ? void 0 : _e.get(l)) || 0, U = ee(l).key, O = ((_f = m.shearAreasZ) == null ? void 0 : _f.get(l)) ?? 0, W = ((_g = m.shearAreasY) == null ? void 0 : _g.get(l)) ?? 0, d = (_h = m.sectionShapes) == null ? void 0 : _h.get(l);
    let J;
    const _ = (d == null ? void 0 : d.type) === "CFT" && d.d > 0 && d.tw > 0 && d.tw < d.d / 2 && !(d.b > 0 && d.h > 0);
    if (u.cftAs !== "general" && (d == null ? void 0 : d.type) === "CFT" && R > 0 && (_ || d.b > 0 && d.h > 0 && d.tw > 0 && d.tw < Math.min(d.b, d.h) / 2)) {
      const K = _ ? d.d - 2 * d.tw : 0, he = _ ? 0 : d.b - 2 * d.tw, fe = _ ? 0 : d.h - 2 * (d.tf ?? d.tw), ue = _ ? Math.PI * (d.d * d.d - K * K) / 4 : d.b * d.h - he * fe, Ye = _ ? Math.PI * K * K / 4 : he * fe, Ie = (d.fillE > 0 ? d.fillE / R : Math.max(0.01, Math.min(1, (n - ue) / Ye))) * R, De = 0.2, ke = d.fillRho ?? 2.4, Oe = `FILL_${Math.round(Ie)}_r${ke}`;
      re.has(Oe) || re.set(Oe, { E: Ie, nu: De, G: Ie / (2 * (1 + De)), rho: ke }), J = _ ? { b: d.d, h: d.d, t: d.tw, Ec: Ie, nuC: De, matFill: Oe, D: d.d } : { b: d.b, h: d.h, t: d.tw, tf: d.tf ?? d.tw, Ec: Ie, nuC: De, matFill: Oe };
    }
    let Y;
    !J && (d == null ? void 0 : d.type) === "I" && d.h > 0 && d.b > 0 && d.tf > 0 && d.tw > 0 ? Y = { kind: "I", t3: d.h, t2: d.b, tf: d.tf, tw: d.tw, t2b: d.t2b ?? d.b, tfb: d.tfb ?? d.tf } : !J && (d == null ? void 0 : d.type) === "HSS" && d.h > 0 && d.b > 0 && d.tf > 0 && d.tw > 0 && (Y = { kind: "Box", t3: d.h, t2: d.b, tf: d.tf, tw: d.tw });
    const q = `A${n.toPrecision(6)}_Iz${i.toPrecision(6)}_s${O.toPrecision(6)}_${W.toPrecision(6)}${J ? J.D ? `_SDC${J.D}x${J.t}` : `_SD${J.b}x${J.h}x${J.t}` : ""}${Y ? `_P${Y.kind}${Y.t3}x${Y.t2}x${Y.tf}x${Y.tw}x${Y.t2b ?? ""}x${Y.tfb ?? ""}` : ""}`;
    if (!ne.has(q)) {
      let K = 0.3, he = 0.3;
      n > 0 && i > 0 && (K = Math.sqrt(12 * i / n), he = n / K), ne.set(q, { A: n, Iz: i, Iy: o, J: E, b: he, h: K, matKey: U, As2: O > 0 ? O : n * 5 / 6, As3: W > 0 ? W : n * 5 / 6, sd: J, param: Y });
    }
    const X = [...ne.keys()].indexOf(q) + 1;
    le.set(l, `SEC${X}`);
  }
  if (Q.length > 0) {
    h('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const l of Q) {
      const n = le.get(l) || "SEC1";
      h(`   Frame=${l + 1}   AutoSelect=N.A.   AnalSect=${n}   MatProp=Default`);
    }
    k();
  }
  if (ne.size > 0) {
    h('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let l = 0;
    for (const [, n] of ne) {
      if (l++, n.sd) {
        h(`   SectionName=SEC${l}   Material=${n.matKey}   Shape="SD Section"   Area=${N(n.A)}   TorsConst=${N(n.J)}   I33=${N(n.Iz)}   I22=${N(n.Iy)}   I23=0   AS2=${N(n.As2)}   AS3=${N(n.As3)} _`), h("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      if (n.param) {
        const i = n.param, o = i.kind === "I" ? `Shape="I/Wide Flange"   t3=${N(i.t3)}   t2=${N(i.t2)}   tf=${N(i.tf)}   tw=${N(i.tw)}   t2b=${N(i.t2b)}   tfb=${N(i.tfb)}` : `Shape=Box/Tube   t3=${N(i.t3)}   t2=${N(i.t2)}   tf=${N(i.tf)}   tw=${N(i.tw)}`;
        h(`   SectionName=SEC${l}   Material=${n.matKey}   ${o}   FilletRadius=0   Area=${N(n.A)}   TorsConst=${N(n.J)}   I33=${N(n.Iz)}   I22=${N(n.Iy)}   I23=0   AS2=${N(n.As2)}   AS3=${N(n.As3)} _`), h("        Color=Red   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      h(`   SectionName=SEC${l}   Material=${n.matKey}   Shape=General   t3=${N(n.h)}   t2=${N(n.b)}   Area=${N(n.A)}   TorsConst=${N(n.J)}   I33=${N(n.Iz)}   I22=${N(n.Iy)}   I23=0   AS2=${N(n.As2)}   AS3=${N(n.As3)} _`), h("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    k();
  }
  const ie = [...ne.values()].map((l, n) => ({ sec: l, name: `SEC${n + 1}` })).filter((l) => l.sec.sd);
  if (ie.length > 0) {
    h('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: i } of ie) h(`   SectionName=${i}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    k();
    const l = ie.filter((i) => !i.sec.sd.D), n = ie.filter((i) => i.sec.sd.D);
    if (l.length > 0) {
      h('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: i, name: o } of l) {
        const E = i.sd;
        h(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${i.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${N(E.h)}   Width=${N(E.b)}   FlngThick=${N(E.tf ?? E.t)}   WebThick=${N(E.t)}   Rotation=0 _`), h('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      k();
    }
    if (n.length > 0) {
      h('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: i, name: o } of n) {
        const E = i.sd;
        h(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${i.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${N(E.D)}   WallThick=${N(E.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), h("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      k();
    }
    if (l.length > 0) {
      h('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: i, name: o } of l) {
        const E = i.sd;
        h(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${E.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${N(E.h - 2 * (E.tf ?? E.t))}   Width=${N(E.b - 2 * E.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), h("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      k();
    }
    if (n.length > 0) {
      h('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: i, name: o } of n) {
        const E = i.sd;
        h(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${E.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${N(E.D - 2 * E.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      k();
    }
    h('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: i } of ie) h(`   SectionName=${i}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    k();
  }
  {
    const l = Q.filter((n) => {
      var _a2;
      const i = (_a2 = m.localAngles) == null ? void 0 : _a2.get(n);
      return i !== void 0 && isFinite(i) && Math.abs(i) > 1e-9;
    });
    if (l.length > 0) {
      h('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const n of l) h(`   Frame=${n + 1}   Angle=${N(m.localAngles.get(n))}   AdvanceAxes=No`);
      k();
    }
  }
  {
    const l = m.endOffsets, n = Q.filter((i) => {
      const o = l == null ? void 0 : l.get(i);
      return !!o && (Math.abs(o[0]) > 1e-9 || Math.abs(o[1]) > 1e-9);
    });
    if (n.length > 0) {
      h('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const i of n) {
        const o = l.get(i);
        h(`   Frame=${i + 1}   Type=User   LengthI=${N(o[0])}   LengthJ=${N(o[1])}   RigidFactor=${N(o.length > 2 ? o[2] : 0)}`);
      }
      k();
    }
  }
  const ae = !!u.layeredSection && V.length > 0, Ee = u.layeredSection, pe = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), c = m.shellModifiers, $ = m.membraneModifiers, P = m.bendingModifiers, v = (l) => !(c == null ? void 0 : c.has(l)) && Math.abs((P == null ? void 0 : P.get(l)) ?? 1) < 1e-9;
  if (!ae) for (const l of V) {
    const n = ((_i = m.thicknesses) == null ? void 0 : _i.get(l)) || 0.1;
    (_j = m.elasticities) == null ? void 0 : _j.get(l);
    const i = ee(l).key, o = v(l) ? 2 : ((_k = m.plateFormulations) == null ? void 0 : _k.get(l)) ?? 0, E = `t${n.toPrecision(6)}_f${o}`;
    pe.has(E) || pe.set(E, { t: n, matKey: i, formulacion: o });
    const R = [...pe.keys()].indexOf(E) + 1;
    Me.set(l, `SSEC${R}`);
  }
  if (V.length > 0) {
    h('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const i of V) {
      const o = ae ? Ee.name : Me.get(i) || "SSEC1";
      h(`   Area=${i + 1}   Section=${o}   MatProp=Default`);
    }
    k();
    const l = (i) => {
      const o = c == null ? void 0 : c.get(i);
      if (o) return o;
      const E = ($ == null ? void 0 : $.get(i)) ?? 1, R = v(i) ? 1 : (P == null ? void 0 : P.get(i)) ?? 1;
      return [E, E, E, R, R, R, R, R];
    }, n = V.filter((i) => {
      const o = l(i);
      return o && o.some((E) => Math.abs(E - 1) > 1e-12);
    });
    if (n.length > 0) {
      h('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const i of n) {
        const o = l(i);
        h(`   Area=${i + 1}   f11=${N(o[0])}   f22=${N(o[1])}   f12=${N(o[2])}   m11=${N(o[3])}   m22=${N(o[4])}   m12=${N(o[5])}   v13=${N(o[6])}   v23=${N(o[7])}   MassMod=1   WeightMod=1`);
      }
      k();
    }
    if (h('TABLE:  "AREA SECTION PROPERTIES"'), ae) {
      const i = Ee, o = ((_l = i.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      h(`   Section=${i.name}   Material=${o}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${N(i.totalThickness)}   BendThick=${N(i.totalThickness)}   Color=Magenta`);
    } else {
      let i = 0;
      for (const [, o] of pe) {
        i++;
        const E = o.formulacion === 2 ? "Membrane" : o.formulacion === 3 ? "Plate-Thin" : o.formulacion === 4 ? "Plate-Thick" : o.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", R = o.formulacion === 3 || o.formulacion === 4 ? "No" : "Yes";
        h(`   Section=SSEC${i}   Material=${o.matKey}   MatAngle=0   AreaType=Shell   Type=${E}   DrillDOF=${R}   Thickness=${N(o.t)}   BendThick=${N(o.t)}   Color=Cyan`);
      }
    }
    if (k(), ae) {
      h('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const i = Ee;
      for (const o of i.layers) {
        const E = o.angle ?? 0, R = o.numIntPts ?? 3;
        h(`   Section=${i.name}   LayerName=${o.name}   Distance=${N(o.distance)}   Thickness=${N(o.thickness)}   Type=Shell   NumIntPts=${R}   Material=${o.material}   MatAngle=${N(E * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      k();
    }
  }
  h('TABLE:  "JOINT COORDINATES"');
  for (let l = 0; l < A.length; l++) {
    const n = A[l];
    h(`   Joint=${l + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${N(n[0])}   Y=${N(n[1])}   Z=${N(n[2])}   SpecialJt=No`);
  }
  if (k(), F.supports && F.supports.size > 0) {
    h('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [l, n] of F.supports) {
      if (!n.some((o) => o)) continue;
      const i = (o) => o ? "Yes" : "No";
      h(`   Joint=${l + 1}   U1=${i(n[0])}   U2=${i(n[1])}   U3=${i(n[2])}   R1=${i(n[3])}   R2=${i(n[4])}   R3=${i(n[5])}`);
    }
    k();
  }
  {
    const l = /* @__PURE__ */ new Map();
    for (const n of F.springs ?? []) {
      if (!(n.k > 0)) continue;
      const i = l.get(n.node) ?? [0, 0, 0, 0, 0, 0];
      i[n.dof] += n.k, l.set(n.node, i);
    }
    if (l.size > 0) {
      h('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [n, i] of [...l].sort((o, E) => o[0] - E[0])) h(`   Joint=${n + 1}   CoordSys=Global   U1=${N(i[0])}   U2=${N(i[1])}   U3=${N(i[2])}   R1=${N(i[3])}   R2=${N(i[4])}   R3=${N(i[5])}`);
      k();
    }
  }
  const B = F.diaphragms;
  if (B && B.size > 0) {
    const l = /* @__PURE__ */ new Map();
    for (const [i, o] of B) {
      const E = Math.round(o);
      if (E === 0) continue;
      const R = Math.abs(E);
      l.has(R) || l.set(R, []), l.get(R).push(i);
    }
    const n = [...l].filter(([, i]) => i.length >= 2);
    if (n.length > 0) {
      h('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [i] of n) h(`   Name=DIAPH${i}   CoordSys=GLOBAL   Axis=Z`);
      k(), h('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [i, o] of n) for (const E of o) h(`   Joint=${E + 1}   Constraint=DIAPH${i}`);
      k();
    }
  }
  const g = u.selfWtMult ?? 1;
  h('TABLE:  "LOAD PATTERN DEFINITIONS"'), h(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${g}`), k(), h('TABLE:  "LOAD CASE DEFINITIONS"'), h('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), k(), h('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), h('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), k();
  const f = m.frameLoads, S = /* @__PURE__ */ new Map();
  if ((_m = F.loads) == null ? void 0 : _m.forEach((l, n) => S.set(n, [...l])), f && f.size > 0) {
    const l = (n, i) => {
      const o = S.get(n) ?? [0, 0, 0, 0, 0, 0];
      S.set(n, o.map((E, R) => E - i[R]));
    };
    for (const [n, i] of f) {
      const o = D[n];
      if (!o || o.length !== 2) continue;
      const E = A[o[0]], R = A[o[1]], U = [R[0] - E[0], R[1] - E[1], R[2] - E[2]], O = Math.hypot(U[0], U[1], U[2]);
      if (O < 1e-9) continue;
      const W = [U[0] / O, U[1] / O, U[2] / O], d = O * O / 12, J = [W[1] * i[2] - W[2] * i[1], W[2] * i[0] - W[0] * i[2], W[0] * i[1] - W[1] * i[0]];
      l(o[0], [i[0] * O / 2, i[1] * O / 2, i[2] * O / 2, d * J[0], d * J[1], d * J[2]]), l(o[1], [i[0] * O / 2, i[1] * O / 2, i[2] * O / 2, -d * J[0], -d * J[1], -d * J[2]]);
    }
  }
  if (S.size > 0) {
    h('TABLE:  "JOINT LOADS - FORCE"');
    for (const [l, n] of S) n.some((i) => Math.abs(i) > 1e-12) && h(`   Joint=${l + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${N(n[0])}   F2=${N(n[1])}   F3=${N(n[2])}   M1=${N(n[3])}   M2=${N(n[4])}   M3=${N(n[5])}`);
    k();
  }
  const y = m.frameLoads;
  if (y && y.size > 0) {
    h('TABLE:  "FRAME LOADS - DISTRIBUTED"');
    for (const [l, n] of y) {
      const i = D[l];
      if (!i || i.length !== 2) continue;
      const o = A[i[0]], E = A[i[1]], R = Math.hypot(E[0] - o[0], E[1] - o[1], E[2] - o[2]);
      ["X", "Y", "Z"].forEach((U, O) => {
        Math.abs(n[O]) < 1e-12 || h(`   Frame=${l + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${U}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${N(R)}   FOverLA=${N(n[O])}   FOverLB=${N(n[O])}`);
      });
    }
    k();
  }
  const I = /* @__PURE__ */ new Map();
  for (let l = 0; l < D.length; l++) {
    const { E: n, nu: i, G: o, rho: E, key: R } = ee(l);
    I.has(R) || I.set(R, { E: n, nu: i, G: o, rho: E });
  }
  if (oe.length > 0) {
    const l = m.solidIncompatible === false ? "No" : "Yes", n = /* @__PURE__ */ new Map();
    for (const i of oe) {
      const { E: o, nu: E, G: R, rho: U, key: O } = ee(i);
      I.has(O) || I.set(O, { E: o, nu: E, G: R, rho: U }), n.has(O) || n.set(O, `SOL${n.size + 1}`);
    }
    h('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [i, o] of n) h(`   SolidProp=${o}   Material=${i}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${l}   Color=Yellow`);
    k(), h('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const i of oe) h(`   Solid=${i + 1}   SolidProp=${n.get(ee(i).key)}`);
    k();
  }
  for (const [l, n] of re) I.has(l) || I.set(l, n);
  h('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [l] of I) h(`   Material=${l}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  k(), h('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [l, n] of I) h(`   Material=${l}   UnitWeight=${N(n.rho * 9.81)}   UnitMass=${N(n.rho)}   E1=${N(n.E)}   G12=${N(n.G)}   U12=${N(n.nu)}   A1=9.9E-06`);
  k(), h('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [l] of I) h(`   Material=${l}   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0`);
  return k(), h('TABLE:  "PROGRAM CONTROL"'), h(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${H.force}, ${H.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), k(), h("END TABLE DATA"), h(""), se.join(`\r
`);
}
function N(u) {
  return u === 0 || Math.abs(u) < 1e-15 ? "0" : Math.abs(u) >= 1e6 || Math.abs(u) < 1e-3 && Math.abs(u) > 0 ? u.toExponential(8) : parseFloat(u.toPrecision(10)).toString();
}
function Qt(u, A, D = 0.05) {
  const F = A.map(([m, H]) => `${(+m).toFixed(4)} ${(+H).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${u}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${D}  SPECTYPE "USER"  `, `  FUNCTION "${u}"  TIMEVAL "${F}"  `];
}
function es(u) {
  const { name: A, func: D, modalCase: F = "Modal", sfX: m = 9.81, sfY: H = 9.81 } = u, j = [`  LOADCASE "${A}"  TYPE  "Response Spectrum"  MODALCASE  "${F}"  `];
  return m && j.push(`  LOADCASE "${A}"  ACCEL  "U1"  FUNC  "${D}"  SF  ${m}  `), H && j.push(`  LOADCASE "${A}"  ACCEL  "U2"  FUNC  "${D}"  SF  ${H}  `), j;
}
function bt(u) {
  const { name: A = "Modal", ritz: D = false, nModes: F = 12 } = u;
  return D ? [`  LOADCASE "${A}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${F} MINMODES  1 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${A}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${F} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function cs(u) {
  var _a;
  const A = (_a = u.e2kModel) == null ? void 0 : _a.rawSections;
  let D = A && A.size > 0 ? ss(A, u.e2kModel) : os(u);
  return u.seismicNEC && (D = ts(D, u.seismicNEC)), D;
}
function ts(u, A) {
  const D = u.includes(`\r
`) ? `\r
` : `
`, F = u.split(/\r?\n/), m = A.name ?? "NEC", H = Qt(m, A.points, A.dampRatio ?? 0.05), j = A.modalCase ?? "Modal", se = es({ name: A.caseName ?? "Sismo NEC", func: m, modalCase: j, sfX: A.sfX, sfY: A.sfY });
  let h = [];
  const k = (Q) => F.some((ee) => Q.test(ee));
  if (A.modal) {
    const Q = new RegExp(`^\\s*LOADCASE\\s+"${j}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let ee = F.length - 1; ee >= 0; ee--) Q.test(F[ee]) && F.splice(ee, 1);
    h = bt({ name: j, ritz: !!A.modal.ritz, nModes: A.modal.nModes });
  } else k(new RegExp(`LOADCASE\\s+"${j}"\\s+TYPE\\s+"Modal`)) || (h = bt({ name: j }));
  return yt(F, "FUNCTIONS", H), yt(F, "LOAD CASES", [...h, ...se]), F.join(D);
}
function yt(u, A, D) {
  const F = u.findIndex((j) => j.trim() === `$ ${A}`);
  if (F >= 0) {
    u.splice(F + 1, 0, ...D);
    return;
  }
  const m = u.findIndex((j) => j.trim() === "END"), H = m >= 0 ? m : u.length;
  u.splice(H, 0, `$ ${A}`, ...D, "");
}
function ss(u, A) {
  const D = [], F = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  D.push("$ File exported from Hekatan Struct Lineal (round-trip)"), D.push("");
  for (const m of F) {
    const H = u.get(m);
    if (!(!H || H.length === 0)) {
      D.push(`$ ${m}`);
      for (const j of H) D.push(j);
      D.push("");
    }
  }
  for (const [m, H] of u) if (!F.includes(m) && H.length !== 0) {
    D.push(`$ ${m}`);
    for (const j of H) D.push(j);
    D.push("");
  }
  return D.push("  END"), D.push("$ END OF MODEL FILE"), D.join(`\r
`);
}
function os(u) {
  var _a, _b, _c, _d, _e, _f, _g;
  const { nodes: A, elements: D, nodeInputs: F, elementInputs: m, title: H, units: j } = u, se = u.shellLoads ?? m.shellSurfaceLoads;
  let h;
  se instanceof Map && (h = /* @__PURE__ */ new Map(), se.forEach((e, t) => {
    h.set(t, typeof e == "number" ? { value: e } : e);
  }));
  const k = u.shellAngles ?? m.shellAngles, Q = m.cargaDeArea, ee = !!(h && h.size > 0), V = m.selfWeight, oe = m.frameLoads, ne = (u.weightMode ?? "auto") === "auto" && V !== void 0, re = /* @__PURE__ */ new Map(), le = (e, t) => {
    const s = re.get(e) ?? [0, 0, 0, 0, 0, 0];
    re.set(e, s.map((a, r) => a + t[r]));
  }, ie = /* @__PURE__ */ new Set();
  if (ne) {
    if (oe) for (const [e, t] of oe) {
      const s = D[e];
      if (!s || s.length !== 2) continue;
      const a = A[s[0]], r = A[s[1]], p = [r[0] - a[0], r[1] - a[1], r[2] - a[2]], T = Math.hypot(p[0], p[1], p[2]);
      if (T < 1e-9) continue;
      const M = [p[0] / T, p[1] / T, p[2] / T], C = T * T / 12, x = [M[1] * t[2] - M[2] * t[1], M[2] * t[0] - M[0] * t[2], M[0] * t[1] - M[1] * t[0]];
      le(s[0], [t[0] * T / 2, t[1] * T / 2, t[2] * T / 2, C * x[0], C * x[1], C * x[2]]), le(s[1], [t[0] * T / 2, t[1] * T / 2, t[2] * T / 2, -C * x[0], -C * x[1], -C * x[2]]), ie.add(e);
    }
    if (V && V > 0) {
      const t = m.endOffsets;
      D.forEach((s, a) => {
        var _a2, _b2, _c2;
        const r = ((_a2 = m.densities) == null ? void 0 : _a2.get(a)) ?? 0;
        if (r) {
          if (s.length === 2) {
            const p = ((_b2 = m.areas) == null ? void 0 : _b2.get(a)) ?? 0, T = A[s[0]], M = A[s[1]], C = [M[0] - T[0], M[1] - T[1], M[2] - T[2]];
            let x = Math.hypot(C[0], C[1], C[2]);
            const L = t == null ? void 0 : t.get(a);
            if (L) {
              const b = Math.hypot(C[0], C[1]);
              b > 1e-9 && Math.abs(Math.atan2(Math.abs(C[2]), b)) * 180 / Math.PI < 20 && (x = Math.max(x - L[0] - L[1], 0));
            }
            const w = p * x * r * 9.80665 * V;
            le(s[0], [0, 0, -w / 2, 0, 0, 0]), le(s[1], [0, 0, -w / 2, 0, 0, 0]);
          } else if (s.length === 4) {
            const p = ((_c2 = m.thicknesses) == null ? void 0 : _c2.get(a)) ?? 0, T = s.map((b) => A[b]);
            let M = 0, C = 0, x = 0;
            for (let b = 0; b < 4; b++) {
              const Z = T[b], z = T[(b + 1) % 4];
              M += Z[1] * z[2] - Z[2] * z[1], C += Z[2] * z[0] - Z[0] * z[2], x += Z[0] * z[1] - Z[1] * z[0];
            }
            const L = Math.hypot(M, C, x) / 2, w = p * L * r * 9.80665 * V;
            for (const b of s) le(b, [0, 0, -w / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const ae = (e, t) => {
    const s = re.get(e);
    return [t[0] - ((s == null ? void 0 : s[0]) ?? 0), t[1] - ((s == null ? void 0 : s[1]) ?? 0), t[2] - (ee ? (Q == null ? void 0 : Q.get(e)) ?? 0 : 0) - ((s == null ? void 0 : s[2]) ?? 0)];
  }, Ee = (e, t) => {
    const s = re.get(e);
    return [(t[3] ?? 0) - ((s == null ? void 0 : s[3]) ?? 0), (t[4] ?? 0) - ((s == null ? void 0 : s[4]) ?? 0), (t[5] ?? 0) - ((s == null ? void 0 : s[5]) ?? 0)];
  }, pe = "N", Me = "MM", c = [], $ = (e) => Math.round(e * 1e4) / 1e4, P = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), v = 1e3, B = 1e3, g = (e) => e * B, f = (e) => e * v, S = (e) => e * v, y = (e) => e * v * B, I = (e) => e * v / B ** 2, l = (e) => e * v / B ** 3, n = /* @__PURE__ */ new Date(), i = `${n.getMonth() + 1}/${n.getDate()}/${n.getFullYear()}  ${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`;
  c.push(`$ File   "Hekatan_export.e2k"  saved ${i} in ETABS 22.6.0`), c.push(""), c.push("$ PROGRAM INFORMATION"), c.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), c.push(""), c.push("$ CONTROLS"), c.push(`  UNITS  "${pe}"  "${Me}"  "C"  `), c.push('  TITLE1  "Hekatan Struct Lineal export"  '), H && c.push(`  TITLE2  "${H}"  `), c.push("  PREFERENCE  MERGETOL 0.001"), c.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), c.push("");
  const o = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Set();
  A.forEach((e) => {
    o.add($(e[0])), E.add($(e[1]));
  });
  const R = [...o].sort((e, t) => e - t), U = [...E].sort((e, t) => e - t);
  c.push("$ GRIDS"), c.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), R.forEach((e, t) => {
    const s = t < 26 ? String.fromCharCode(65 + t) : String.fromCharCode(65 + t % 26).repeat(Math.floor(t / 26) + 1);
    c.push(`  GRID "G1"  LABEL "${s}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), U.forEach((e, t) => {
    c.push(`  GRID "G1"  LABEL "${t + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), c.push("");
  const O = 3, W = 0.5, d = /* @__PURE__ */ new Map();
  A.forEach((e) => {
    const t = $(e[2]);
    d.set(t, (d.get(t) ?? 0) + 1);
  });
  const J = /* @__PURE__ */ new Set();
  A.forEach((e) => J.add($(e[2])));
  const _ = [...J].sort((e, t) => e - t);
  let Y = _.filter((e) => (d.get(e) ?? 0) >= O);
  if (Y.length > 1) {
    const e = [Y[0]];
    for (const t of Y.slice(1)) t - e[e.length - 1] < W ? e[e.length - 1] = t : e.push(t);
    Y = e;
  }
  _.length || _.push(0, 3), Y.length || (Y = [_[0], _[_.length - 1]]), Y[0] !== _[0] && Y.unshift(_[0]), Y[Y.length - 1] !== _[_.length - 1] && Y.push(_[_.length - 1]);
  const q = [], X = /* @__PURE__ */ new Map();
  q.push("Base"), X.set(Y[0], "Base");
  for (let e = 1; e < Y.length; e++) {
    const t = `Level_${e}`;
    q.push(t), X.set(Y[e], t);
  }
  const K = (e) => {
    const t = $(e);
    if (X.has(t)) return { story: X.get(t), dz: 0 };
    for (let a = 0; a < Y.length; a++) if (Y[a] >= t) return { story: X.get(Y[a]), dz: $(Y[a] - t) };
    const s = Y[Y.length - 1];
    return { story: X.get(s), dz: $(s - t) };
  };
  c.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = Y.length - 1; e >= 1; e--) c.push(`  STORY "${q[e]}"  HEIGHT ${$(g(Y[e] - Y[e - 1]))} MASTERSTORY "Yes"  `);
  Y.length > 0 && c.push(`  STORY "Base"  ELEV ${$(g(Y[0]))} `), c.push(""), D.some((e) => e.length === 4), c.push("$ DIAPHRAGM NAMES"), c.push('  DIAPHRAGM "D1"    TYPE RIGID'), c.push(""), c.push("$ MATERIAL PROPERTIES");
  const he = 980665e-8, fe = (e) => {
    var _a2, _b2, _c2;
    const t = (_a2 = m.sectionShapes) == null ? void 0 : _a2.get(e);
    if ((t == null ? void 0 : t.type) === "CFT" && t.steelRho > 0) return t.steelRho * 9.80665;
    const s = (_b2 = m.densities) == null ? void 0 : _b2.get(e);
    if (s === void 0) return;
    const a = s > 100 ? s * he : s * 9.80665, r = (_c2 = m.deckSections) == null ? void 0 : _c2.get(e);
    if (r && r.tc > 0) {
      const p = r.tc + (r.sr > 0 ? r.hr * (r.wrt + r.wrb) / 2 / r.sr : 0);
      return (a * r.tc - r.w) / p;
    }
    return a;
  }, ue = (e) => {
    var _a2;
    const t = ((_a2 = m.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, s = fe(e);
    return `${t}|${s === void 0 ? "-" : s.toFixed(4)}`;
  }, Ye = /* @__PURE__ */ new Set();
  (_a = m.elasticities) == null ? void 0 : _a.forEach((e, t) => Ye.add(ue(t)));
  const Le = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map();
  let De = 0, ke = 0;
  for (const e of Ye) {
    const t = parseFloat(e.split("|")[0]), s = e.split("|")[1], a = t >= 1e8, r = a ? `Steel_${++De}` : `Conc_${++ke}`;
    Le.set(e, r), Ie.set(e, a);
    const p = s !== "-" ? parseFloat(s) : a ? 76.97 : 24, T = I(t), M = l(p), C = (() => {
      const w = u.elementInputs.poissonsRatios;
      if (w) {
        for (const [b, Z] of w) if (ue(b) === e) return Z;
      }
    })(), x = C !== void 0 ? C : a ? 0.3 : 0.2, L = a ? 117e-7 : 1e-5;
    if (a) {
      c.push(`  MATERIAL  "${r}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${P(M)}`), c.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${$(T)}  U ${x}  A ${L}`);
      const w = 345e3, b = 45e4;
      c.push(`  MATERIAL  "${r}"  FY ${$(I(w))}  FU ${$(I(b))}  FYE ${$(I(w * 1.1))}  FUE ${$(I(b * 1.1))}`);
    } else c.push(`  MATERIAL  "${r}"    TYPE "Concrete"    WEIGHTPERVOLUME ${P(M)}`), c.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${$(T)}  U ${x}  A ${L}`), c.push(`  MATERIAL  "${r}"    FC ${$(I(24e3))}`);
  }
  const Oe = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = m.sectionShapes) == null ? void 0 : _b.forEach((s, a) => {
      var _a2;
      if ((s == null ? void 0 : s.type) !== "CFT" || !(s.fillE > 0) || !((((_a2 = m.elasticities) == null ? void 0 : _a2.get(a)) ?? 0) > 0)) return;
      const p = (s.fillRho ?? 2.4) * 9.80665, T = `${s.fillE}|${p.toFixed(4)}`;
      let M = e.get(T);
      M || (M = `ConcFill_${e.size + 1}`, e.set(T, M), c.push(`  MATERIAL  "${M}"    TYPE "Concrete"    WEIGHTPERVOLUME ${P(l(p))}`), c.push(`  MATERIAL  "${M}"    SYMTYPE "Isotropic"  E ${$(I(s.fillE))}  U 0.2  A 1.0e-5`), c.push(`  MATERIAL  "${M}"    FC ${$(I(24e3))}`)), Oe.set(a, M);
    });
  }
  c.push(""), c.push("$ FRAME SECTIONS");
  const Ue = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), ge = 0.05;
  D.forEach((e, t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const s = (_a2 = m.sectionShapes) == null ? void 0 : _a2.get(t), a = ((_b2 = m.elasticities) == null ? void 0 : _b2.get(t)) ?? 0, r = Le.get(ue(t)) || "Conc_1", p = Ie.get(ue(t)) ?? a >= 1e8, T = ((_c2 = m.areas) == null ? void 0 : _c2.get(t)) ?? 0, M = ((_d2 = m.momentsOfInertiaZ) == null ? void 0 : _d2.get(t)) ?? 0, C = ((_e3 = m.momentsOfInertiaY) == null ? void 0 : _e3.get(t)) ?? 0, x = ((_f2 = m.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
    let L = (s == null ? void 0 : s.type) || "rect", w = (s == null ? void 0 : s.h) ?? 0, b = (s == null ? void 0 : s.b) ?? 0, Z = (s == null ? void 0 : s.d) ?? 0;
    const z = (s == null ? void 0 : s.tf) ?? 0, te = (s == null ? void 0 : s.tw) ?? 0;
    if (!s && w <= 0 && b <= 0 && Z <= 0 && T > 0 && M > 0 && C > 0) {
      const $e = (_g2 = m.cantos) == null ? void 0 : _g2.get(t), Ge = (_h = m.anchos) == null ? void 0 : _h.get(t);
      w = $e && $e > 0 ? $e : Math.sqrt(12 * M / T), b = Ge && Ge > 0 ? Ge : T / w, (!isFinite(w) || w < ge) && (w = ge), (!isFinite(b) || b < ge) && (b = ge), L = "general";
    } else w <= 0 && b <= 0 && Z <= 0 && T > 0 && (M > 0 ? (w = Math.sqrt(12 * M / T), b = T / w) : w = b = Math.sqrt(T), (!isFinite(w) || w < ge) && (w = ge), (!isFinite(b) || b < ge) && (b = ge), L = "rect");
    w <= 0 && b <= 0 && Z <= 0 && (w = 0.3, b = 0.3, L = "rect");
    const _e2 = (s == null ? void 0 : s.name) ? `NAME_${s.name}` : `${L}_${$(w)}_${$(b)}_${$(Z)}_${$(z)}_${$(te)}_${r}`;
    (s == null ? void 0 : s.name) && !xe.has(_e2) && xe.set(_e2, s.name);
    let ce = xe.get(_e2);
    if (!ce) {
      const $e = p ? "S" : "C";
      L === "general" ? ce = `${$e}_G${Ue.size + 1}` : L === "rect" ? ce = `${$e}_R${Math.round(b * 100)}x${Math.round(w * 100)}` : L === "circ" ? ce = `${$e}_C_D${Math.round(Z * 100)}` : L === "I" ? ce = `${$e}_I${Math.round(w * 100)}x${Math.round(b * 100)}` : L === "HSS" ? ce = `${$e}_HSS${Math.round(b * 100)}x${Math.round(w * 100)}x${Math.round(te * 1e3)}` : ce = `${$e}_Sec${Ue.size + 1}`, xe.set(_e2, ce);
    }
    if (Ke.set(t, ce), Ue.has(ce)) return;
    Ue.add(ce);
    const Ze = Oe.get(t);
    if (L === "CFT" && Ze && Z > 0 && te > 0 && !(w > 0 && b > 0)) {
      c.push(`  FRAMESECTION  "${ce}"  MATERIAL "${r}"  SHAPE "Filled Steel Pipe"  D ${$(g(Z))} T ${$(g(te))} FILLMATERIAL "${Ze}"`);
      return;
    }
    if (L === "CFT" && Ze && w > 0 && b > 0 && te > 0) {
      c.push(`  FRAMESECTION  "${ce}"  MATERIAL "${r}"  SHAPE "Filled Steel Tube"  D ${$(g(w))} B ${$(g(b))} TF ${$(g(z > 0 ? z : te))} TW ${$(g(te))} FILLMATERIAL "${Ze}"`);
      return;
    }
    const Et = s, Kt = !((Et == null ? void 0 : Et.t2b) > 0) || Math.abs(Et.t2b - b) < 1e-9 && Math.abs((Et.tfb ?? z) - z) < 1e-9;
    if (L === "I" && w > 0 && b > 0 && z > 0 && te > 0 && Kt) {
      c.push(`  FRAMESECTION  "${ce}"  MATERIAL "${r}"  SHAPE "Steel I/Wide Flange"  D ${$(g(w))} B ${$(g(b))} TF ${$(g(z))} TW ${$(g(te))} `);
      return;
    }
    if (L === "HSS" && w > 0 && b > 0 && z > 0 && te > 0) {
      c.push(`  FRAMESECTION  "${ce}"  MATERIAL "${r}"  SHAPE "Steel Tube"  D ${$(g(w))} B ${$(g(b))} TF ${$(g(z))} TW ${$(g(te))} `);
      return;
    }
    const Xt = T > 0 && M > 0 && C > 0;
    let Te;
    L === "general" || Xt ? Te = "General" : L === "I" ? Te = "Steel I/Wide Flange" : L === "HSS" ? Te = "Steel Tube" : L === "CFT" ? Te = "Filled Steel Tube" : L === "pipe" ? Te = "Steel Pipe" : L === "L" ? Te = "Steel Angle" : L === "C" ? Te = "Steel Channel" : L === "2C" ? Te = "Steel Double Channel" : L === "circ" ? Te = "Concrete Circle" : Te = "Concrete Rectangular";
    let Ne = `  FRAMESECTION  "${ce}"  MATERIAL "${r}"  SHAPE "${Te}"`;
    if (Te === "General") {
      const $e = ((_i = m.shearAreasZ) == null ? void 0 : _i.get(t)) || T * 5 / 6, Ge = ((_j = m.shearAreasY) == null ? void 0 : _j.get(t)) || T * 5 / 6;
      Ne += `  D ${$(g(w))} B ${$(g(b))} AREA ${P(T * 1e6)} AS2 ${P($e * 1e6)} AS3 ${P(Ge * 1e6)} I33 ${P(M * 1e12)} I22 ${P(C * 1e12)} TORSION ${P((x || M + C) * 1e12)} S33POS ${P(2 * M / w * 1e9)} S33NEG ${P(2 * M / w * 1e9)} S22POS ${P(2 * C / b * 1e9)} S22NEG ${P(2 * C / b * 1e9)} Z33 ${P(2 * M / w * 1e9)} Z22 ${P(2 * C / b * 1e9)} R33 ${P(Math.sqrt(M / T) * 1e3)} R22 ${P(Math.sqrt(C / T) * 1e3)} `, c.push(Ne);
      return;
    }
    w && (Ne += `  D ${$(g(w))}`), b && (Ne += `  B ${$(g(b))}`), Z && !w && (Ne += `  D ${$(g(Z))}`), z && (Ne += `  TF ${$(g(z))}`), te && (Ne += `  TW ${$(g(te))}`), c.push(Ne);
  }), c.push("");
  const He = /* @__PURE__ */ new Map();
  let Yt = 0;
  A.forEach((e) => {
    const { dz: t } = K(e[2]), s = `${$(e[0])},${$(e[1])},${t}`;
    He.has(s) || He.set(s, `${++Yt}`);
  });
  const ve = /* @__PURE__ */ new Map(), Xe = [];
  {
    const e = /* @__PURE__ */ new Map();
    for (const s of F.springs ?? []) {
      if (!(s.k > 0)) continue;
      const a = e.get(s.node) ?? [0, 0, 0, 0, 0, 0];
      a[s.dof] += s.k, e.set(s.node, a);
    }
    const t = /* @__PURE__ */ new Map();
    for (const [s, a] of e) {
      const r = a.map((M, C) => C < 3 ? M * v / B : M * v * B), p = r.map((M) => +M.toPrecision(12)).join("|");
      let T = t.get(p);
      if (!T) {
        T = `SPR${t.size + 1}`, t.set(p, T);
        const M = ["UX", "UY", "UZ", "RX", "RY", "RZ"], C = r.map((x, L) => `${M[L]}  ${+x.toPrecision(12)}`);
        Xe.push(`  POINTSPRING  "${T}"  NONLINEARSPECOPTION  "LINKS"  ${C.join(" ")} `);
      }
      ve.set(s, T);
    }
    Xe.length && (c.push("$ POINT SPRING PROPERTIES"), Xe.forEach((s) => c.push(s)), c.push(""));
  }
  c.push("$ POINT COORDINATES");
  for (const [e, t] of He) {
    const [s, a, r] = e.split(",").map(Number);
    c.push(r ? `  POINT "${t}"  ${$(g(s))} ${$(g(a))} ${$(g(r))} ` : `  POINT "${t}"  ${$(g(s))} ${$(g(a))} `);
  }
  c.push("");
  const Ae = (e) => {
    const t = A[e], { story: s, dz: a } = K(t[2]), r = `${$(t[0])},${$(t[1])},${a}`;
    return { pt: He.get(r) || "1", story: s };
  }, ft = (e) => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    const t = [], s = (_a2 = u.propertyModifiers) == null ? void 0 : _a2.get(e);
    s && s.some((L) => Math.abs(L - 1) > 1e-9) && t.push(`PROPMODIFIERS "${s.map((L) => $(L)).join(" ")}"`);
    const a = (_b2 = m.localAngles) == null ? void 0 : _b2.get(e);
    a !== void 0 && isFinite(a) && Math.abs(a) > 1e-9 && t.push(`ANG ${$(a)}`);
    const r = (_c2 = m.momentReleases) == null ? void 0 : _c2.get(e);
    if (r && r.some((L) => L)) {
      const L = [];
      r.length === 12 ? (r[0] && L.push("PI"), r[1] && L.push("V2I"), r[2] && L.push("V3I"), r[3] && L.push("TI"), r[4] && L.push("M2I"), r[5] && L.push("M3I"), r[6] && L.push("PJ"), r[7] && L.push("V2J"), r[8] && L.push("V3J"), r[9] && L.push("TJ"), r[10] && L.push("M2J"), r[11] && L.push("M3J")) : r.length === 6 && (r[0] && L.push("TI"), r[1] && L.push("M2I"), r[2] && L.push("M3I"), r[3] && L.push("TJ"), r[4] && L.push("M2J"), r[5] && L.push("M3J")), L.length > 0 && t.push(`RELEASE "${L.join(" ")}"`);
    }
    const p = (_d2 = m.insertionPoints) == null ? void 0 : _d2.get(e);
    p && (Math.abs(p[0]) > 1e-9 || Math.abs(p[1]) > 1e-9) && t.push(`LATEROFFSET ${$(g(p[0]))} TRANSOFFSET ${$(g(p[1]))}`);
    const T = (_e2 = m.rigidOffsets) == null ? void 0 : _e2.get(e), M = (_f2 = m.endOffsets) == null ? void 0 : _f2.get(e), C = M ? [M[0], M[1]] : T, x = M && M.length > 2 ? M[2] : 0;
    return C && (Math.abs(C[0]) > 1e-9 || Math.abs(C[1]) > 1e-9) && t.push(`LENGTHOFFI ${$(g(C[0]))} LENGTHOFFJ ${$(g(C[1]))} RIGIDZONE ${$(x)}`), t.length > 0 ? ` ${t.join(" ")} ` : "";
  }, Ve = [], St = /* @__PURE__ */ new Set(), We = /* @__PURE__ */ new Map();
  D.forEach((e, t) => {
    if (e.length !== 2) return;
    const s = wt(A, e);
    if (s === "BEAM") return;
    const a = A[e[0]][2] <= A[e[1]][2] ? e[0] : e[1], r = A[e[0]][2] <= A[e[1]][2] ? e[1] : e[0];
    if (Math.abs(A[a][0] - A[r][0]) > 1e-6 || Math.abs(A[a][1] - A[r][1]) > 1e-6) return;
    const p = Ae(a), T = Ke.get(t) || `Sec_${t}`, M = `${p.pt}_${T}_${s}`;
    We.has(M) || We.set(M, []), We.get(M).push({ i: t, bot: a, top: r, zBot: $(A[a][2]), zTop: $(A[r][2]), planPt: p.pt, secName: T, type: s });
  }), We.forEach((e, t) => {
    e.sort((a, r) => a.zBot - r.zBot);
    let s = 0;
    for (let a = 1; a <= e.length; a++) if (a === e.length || Math.abs(e[a].zBot - e[a - 1].zTop) > 1e-6) {
      const p = e.slice(s, a);
      p.length >= 1 && (Ve.push({ elemIndices: p.map((T) => T.i), planPt: p[0].planPt, bottomNodeIdx: p[0].bot, topNodeIdx: p[p.length - 1].top, secName: p[0].secName, type: p[0].type, nSegments: p.length }), p.forEach((T) => St.add(T.i))), s = a;
    }
  }), c.push("$ LINE CONNECTIVITIES");
  const qe = [], ze = (e) => q.indexOf(e), ht = /* @__PURE__ */ new Map(), pt = (e, t, s, a, r, p, T, M) => {
    const C = Ae(a), x = Ae(s);
    M !== void 0 && ht.set(M, { name: e, story: C.story });
    const L = ze(C.story) - ze(x.story);
    L <= 0 ? c.push(`  LINE  "${e}"  BEAM  "${x.pt}"  "${C.pt}"  0`) : c.push(`  LINE  "${e}"  ${t}  "${x.pt}"  "${C.pt}"  ${L}`), qe.push(`  LINEASSIGN  "${e}"  "${C.story}"  SECTION "${r}" ${p} MINNUMSTA ${T} AUTOMESH "YES"  MESHATINTERSECTIONS "${m.meshAtIntersections === false ? "NO" : "YES"}"  `);
  }, At = /* @__PURE__ */ new Map();
  Ve.forEach((e, t) => {
    const s = ft(e.elemIndices[0]), a = [];
    let r = [];
    e.elemIndices.forEach((p, T) => {
      r.push(p);
      const [M, C] = D[p], x = A[M][2] >= A[C][2] ? M : C;
      (K(A[x][2]).dz === 0 || T === e.elemIndices.length - 1) && (a.push(r), r = []);
    }), a.forEach((p) => {
      const [T, M] = D[p[0]], C = A[T][2] <= A[M][2] ? T : M, [x, L] = D[p[p.length - 1]], w = A[x][2] >= A[L][2] ? x : L;
      ze(Ae(w).story) - ze(Ae(C).story);
      let b = `C${t + 1}`;
      for (let Z = 1; ; Z++) {
        const z = c.length;
        pt(b, e.type, C, w, e.secName, s, p.length);
        const te = c[z], lt = At.get(b);
        if (lt === void 0) {
          At.set(b, te);
          break;
        }
        if (c.splice(z, c.length - z), lt === te) break;
        qe.pop(), b = `C${t + 1}_${Z}`;
      }
    });
  }), D.forEach((e, t) => {
    if (e.length !== 2 || St.has(t)) return;
    const s = wt(A, e), a = Ke.get(t) || `Sec_${t}`, r = ft(t), p = A[e[0]][2] <= A[e[1]][2] ? e[0] : e[1], T = A[e[0]][2] <= A[e[1]][2] ? e[1] : e[0];
    pt(`E${t + 1}`, s === "BEAM" ? "BRACE" : s, p, T, a, r, 3, t);
  }), c.push("");
  const Fe = u.weightMode ?? "auto", de = /* @__PURE__ */ new Set();
  c.push("$ POINT ASSIGNS"), (_c = F.supports) == null ? void 0 : _c.forEach((e, t) => {
    const s = [];
    if (e[0] && s.push("UX"), e[1] && s.push("UY"), e[2] && s.push("UZ"), e[3] && s.push("RX"), e[4] && s.push("RY"), e[5] && s.push("RZ"), s.length > 0) {
      const a = Ae(t), r = a.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", p = ve.has(t) ? ` SPRINGPROP "${ve.get(t)}" ` : "";
      c.push(`  POINTASSIGN  "${a.pt}"  "${a.story}"  RESTRAINT "${s.join(" ")}" ${r}${p} `), de.add(`${a.pt}@${a.story}`);
    }
  });
  for (const [e, t] of ve) {
    const s = Ae(e);
    de.has(`${s.pt}@${s.story}`) || (c.push(`  POINTASSIGN  "${s.pt}"  "${s.story}"  SPRINGPROP "${t}" `), de.add(`${s.pt}@${s.story}`));
  }
  const kt = !!(F.diaphragms && [...F.diaphragms.values()].some((e) => e !== 0)), Tt = u.diaphragm ?? "auto", Qe = Tt === "d1" || Tt === "auto" && kt, be = /* @__PURE__ */ new Set();
  F.diaphragms && F.diaphragms.forEach((e, t) => {
    e !== 0 && be.add(t);
  }), Qe && be.size ? be.forEach((e) => {
    const t = Ae(e), s = `${t.pt}@${t.story}`;
    !de.has(s) && t.story !== "Base" && (c.push(`  POINTASSIGN  "${t.pt}"  "${t.story}"  DIAPH "D1"  `), de.add(s));
  }) : Qe && Ve.forEach((e) => {
    for (const t of e.elemIndices) {
      const [s, a] = D[t], r = A[s][2] >= A[a][2] ? s : a, p = Ae(r), T = `${p.pt}@${p.story}`;
      !de.has(T) && p.story !== "Base" && (c.push(`  POINTASSIGN  "${p.pt}"  "${p.story}"  DIAPH "D1"  `), de.add(T));
    }
  }), Fe === "manual" && F.loads && F.loads.forEach((e, t) => {
    const [s, a, r] = ae(t, e);
    if (Math.abs(s) < 1e-10 && Math.abs(a) < 1e-10 && Math.abs(r) < 1e-10) return;
    const p = Ae(t), T = `${p.pt}@${p.story}`;
    de.has(T) || (c.push(`  POINTASSIGN  "${p.pt}"  "${p.story}"  DIAPH "DISCONNECTED"  `), de.add(T));
  }), c.push(""), c.push("$ LINE ASSIGNS"), qe.forEach((e) => c.push(e)), c.push("");
  const Se = [], $t = m.areaObjects, Mt = /* @__PURE__ */ new Set(), It = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map();
  $t == null ? void 0 : $t.forEach((e) => e.cells.forEach((t) => Mt.add(t))), D.forEach((e, t) => {
    if (e.length === 4 || e.length === 3) {
      const s = A[e[0]], a = A[e[1]], r = A[e[2]], p = [a[0] - s[0], a[1] - s[1], a[2] - s[2]], T = [r[0] - s[0], r[1] - s[1], r[2] - s[2]], M = p[1] * T[2] - p[2] * T[1], C = p[2] * T[0] - p[0] * T[2], x = p[0] * T[1] - p[1] * T[0], L = Math.sqrt(M * M + C * C + x * x), w = L > 1e-10 && Math.abs(x) / L < 0.5;
      Se.push({ idx: t, el: e, isWall: w }), Mt.has(t) && Se.pop();
    }
  });
  const me = (() => {
    for (const [e, t] of Ie) if (!t) return Le.get(e);
    return Le.values().next().value || "Conc_1";
  })();
  $t == null ? void 0 : $t.forEach((e, t) => {
    Se.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && It.set(e.cells[0], e.q), e.ang !== void 0 && dt.set(e.cells[0], e.ang);
  });
  const Ce = "DECK";
  let et = false;
  const tt = [], mt = (e) => {
    const t = u.elementInputs.plateFormulations, s = Se.find((r) => r.isWall === e), a = t && s ? t.get(s.idx) : void 0;
    return a === 2 ? "Membrane" : a === 1 ? "ShellThin" : "ShellThick";
  }, ut = (e, t) => {
    const s = u.elementInputs.thicknesses, a = Se.find((r) => r.isWall === e);
    return (a ? s == null ? void 0 : s.get(a.idx) : void 0) ?? (s == null ? void 0 : s.values().next().value) ?? t;
  }, gt = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], je = (e) => {
    var _a2;
    const s = (_a2 = m.shellModifiers) == null ? void 0 : _a2.get(e);
    if (s && s.length >= 8) return s.slice(0, 8);
    const a = m.membraneModifiers, r = m.bendingModifiers, p = a == null ? void 0 : a.get(e), T = r == null ? void 0 : r.get(e);
    if (p === void 0 && T === void 0) return null;
    const M = p ?? 1, C = T ?? 1;
    return [M, M, M, C, C, C, C, C];
  }, Nt = (e, t) => {
    const s = Se.filter((T) => T.isWall === t), a = /* @__PURE__ */ new Map();
    for (const T of s) {
      const M = je(T.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      a.set(M.map((C) => $(C)).join(","), M);
    }
    if (a.size === 0) return "";
    a.size > 1 && console.warn(`[e2k] "${e}": ${a.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const r = a.values().next().value, p = gt.map((T, M) => Math.abs(r[M] - 1) > 1e-9 ? `${T} ${$(r[M])}` : "").filter(Boolean);
    return p.length ? `  SHELLPROP  "${e}"  ${p.join(" ")} ` : "";
  }, Ot = u.elementInputs.thicknesses, Rt = u.elementInputs.plateFormulations, ye = (e) => {
    var _a2;
    const t = Ot == null ? void 0 : Ot.get(e.idx), s = Rt == null ? void 0 : Rt.get(e.idx), a = je(e.idx), r = (_a2 = u.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), p = r ? [r.tc, r.hr, r.wrt, r.wrb, r.sr, r.w].map((T) => $(T)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${t ?? "-"}|${s ?? "-"}|${a ? a.map((T) => $(T)).join(",") : "-"}|${ue(e.idx)}|${p}`;
  }, st = (e) => {
    var _a2;
    if ((_a2 = u.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const t = je(e);
    return t ? Math.abs(t[3]) < 1e-9 && Math.abs(t[4]) < 1e-9 : false;
  }, we = /* @__PURE__ */ new Map();
  let Ut = 0, xt = 0, Ht = 0;
  for (const e of Se) {
    const t = ye(e);
    if (we.has(t)) continue;
    const s = e.isWall, a = !s && st(e.idx), r = s ? ++xt : a ? ++Ht : ++Ut, p = ue(e.idx);
    we.set(t, { nombre: (s ? "Muro" : a ? Ce : "Losa") + (r === 1 ? "" : String(r)), isWall: s, mem: a, t: Ot == null ? void 0 : Ot.get(e.idx), pf: Rt == null ? void 0 : Rt.get(e.idx), idx: e.idx, mat: Le.get(p) ?? me, acero: Ie.get(p) ?? false });
  }
  const Je = (e) => {
    var _a2;
    return ((_a2 = we.get(ye(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, Lt = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", vt = (e, t) => {
    const s = Se.find((p) => ye(p) === t), a = s ? je(s.idx) ?? null : null;
    if (!a) return "";
    const r = gt.map((p, T) => Math.abs(a[T] - 1) > 1e-9 ? `${p} ${$(a[T])}` : "").filter(Boolean);
    return r.length ? `  SHELLPROP  "${e}"  ${r.join(" ")} ` : "";
  }, Be = Se.find((e) => !e.isWall), Dt = Se.find((e) => e.isWall), ot = /* @__PURE__ */ new Set();
  Be && ot.add(ye(Be)), Dt && ot.add(ye(Dt));
  const Ct = [...we.entries()].filter(([e]) => !ot.has(e)), nt = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = u.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, Wt = (e) => e * v / B ** 2, Pt = (e, t) => {
    const s = (a) => P(g(a));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${me}"  DECKMATERIAL "${me}"  DECKSLABDEPTH ${s(t.tc)} DECKRIBDEPTH ${s(t.hr)} DECKRIBWIDTHTOP ${s(t.wrt)} DECKRIBWIDTHBOTTOM ${s(t.wrb)} DECKRIBSPACING ${s(t.sr)} DECKSHEARTHICKNESS ${s(76e-5)} DECKUNITWEIGHT ${P(Wt(t.w))} SHEARSTUDDIAM ${s(0.019)} SHEARSTUDHEIGHT ${s(0.1)} SHEARSTUDFU 400 `;
  };
  if (Se.some((e) => !e.isWall)) {
    et = !!Be && st(Be.idx);
    const e = ut(false, 0.15);
    if (et) {
      c.push("$ DECK PROPERTIES");
      const s = [...we.values()].find((r) => r.nombre === Ce), a = nt(Be == null ? void 0 : Be.idx);
      (s == null ? void 0 : s.acero) ? c.push(`  SHELLPROP  "${Ce}"  PROPTYPE  "Slab"  MATERIAL "${s.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${$(g(e))} `) : a ? c.push(Pt(Ce, a)) : c.push(`  SHELLPROP  "${Ce}"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${$(g(e))} `);
    } else c.push("$ SLAB PROPERTIES"), c.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "${mt(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${$(g(e))} `);
    const t = Nt(et ? Ce : "Losa", false);
    t && c.push(t), c.push("");
  }
  if (Se.some((e) => e.isWall)) {
    c.push("$ WALL PROPERTIES");
    const e = ut(true, 0.2), t = mt(true);
    c.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${me}"  MODELINGTYPE "${t}"  WALLTHICKNESS ${$(g(e))} `);
    const s = Nt("Muro", true);
    s && c.push(s), c.push("");
  }
  if (Ct.length) {
    c.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, t] of Ct) {
      const s = t.t ?? (t.isWall ? 0.2 : 0.15);
      c.push(t.isWall ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Wall"  MATERIAL "${t.mat ?? me}"  MODELINGTYPE "${Lt(t.pf)}"  WALLTHICKNESS ${$(g(s))} ` : t.mem && t.acero ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${t.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${$(g(s))} ` : t.mem && nt(t.idx) ? Pt(t.nombre, nt(t.idx)) : t.mem ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${$(g(s))} ` : `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "${Lt(t.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${$(g(s))} `);
      const a = vt(t.nombre, e);
      a && c.push(a);
    }
    c.push("");
  }
  if (Se.length > 0) {
    c.push("$ AREA CONNECTIVITIES");
    const e = [];
    Se.forEach((t, s) => {
      const { el: a, isWall: r } = t, p = r ? `W${s + 1}` : `F${s + 1}`, T = r ? "PANEL" : "FLOOR", M = a.map((C) => Ae(C));
      if (r) {
        const C = (Z) => q.indexOf(Z);
        if (new Set(M.map((Z) => Z.pt)).size === 4) {
          const Z = Math.max(...M.map((te) => C(te.story))), z = M.map((te) => Z - C(te.story));
          c.push(`  AREA "${p}"  ${T}  4  "${M[0].pt}"  "${M[1].pt}"  "${M[2].pt}"  "${M[3].pt}"  ${z.join("  ")}  `), e.push(`  AREAASSIGN  "${p}"  "${q[Z]}"  SECTION "${Je(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const L = A[a[0]][2] <= A[a[2]][2] ? 0 : 2, w = A[a[1]][2] <= A[a[3]][2] ? 1 : 3;
        c.push(`  AREA "${p}"  ${T}  4  "${M[L].pt}"  "${M[w].pt}"  "${M[w].pt}"  "${M[L].pt}"  1  1  0  0  `);
        const b = M[L === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${p}"  "${b}"  SECTION "${Je(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const C = M.length, x = (z) => q.indexOf(z), L = Math.max(...M.map((z) => x(z.story))), w = M.map((z) => L - x(z.story)), b = q[L] ?? M[0].story;
        c.push(`  AREA "${p}"  ${T}  ${C}  ` + M.map((z) => `"${z.pt}"`).join("  ") + "  " + w.join("  ") + "  ");
        const Z = dt.get(t.idx) ?? (k == null ? void 0 : k.get(t.idx));
        e.push(st(t.idx) ? `  AREAASSIGN  "${p}"  "${b}"  SECTION "${Je(t)}"  ANG ${$(Z ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${p}"  "${b}"  SECTION "${Je(t)}" ${Qe && (!be.size || (D[t.idx] ?? []).every((z) => be.has(z))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), tt.push({ name: p, story: b, idx: t.idx });
      }
    }), c.push(""), c.push("$ AREA ASSIGNS"), e.forEach((t) => c.push(t)), c.push("");
  }
  const zt = Fe === "manual" ? 0 : V ?? 1;
  c.push("$ LOAD PATTERNS");
  const Re = ((_d = u.loadPatterns) == null ? void 0 : _d.length) ? u.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: zt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Re) {
    let t;
    e.type === "Dead" ? t = Fe === "manual" ? 0 : e.selfWeightMultiplier ?? V ?? 1 : (t = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${e.type ?? "Other"}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), c.push(`  LOADPATTERN "${e.name}"  TYPE  "${e.type ?? "Other"}"  SELFWEIGHT  ${t}`);
  }
  c.push("");
  const Pe = u.loadPatternDestino && Re.some((e) => e.name === u.loadPatternDestino) ? u.loadPatternDestino : ((_e = Re.find((e) => e.type === "Dead")) == null ? void 0 : _e.name) ?? Re[0].name, at = [], it = /* @__PURE__ */ new Map(), Ft = (e, t) => {
    const s = it.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let a = 0; a < 6; a++) s[a] += t[a] ?? 0;
    it.set(e, s);
  }, jt = Pe === (((_f = Re.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Re[0].name), Jt = Fe === "manual" || !jt || ne;
  if (F.loads && F.loads.size > 0 && F.loads.forEach((e, t) => {
    const [s, a, r] = ae(t, e), [p, T, M] = Ee(t, e);
    Ft(t, [s, a, Jt ? r : 0, p, T, M]);
  }), F.moments && F.moments.size > 0 && F.moments.forEach((e, t) => {
    Ft(t, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), it.forEach((e, t) => {
    if (e.every((a) => Math.abs(a) <= 1e-10)) return;
    const s = Ae(t);
    at.push(`  POINTLOAD  "${s.pt}"  "${s.story}"  TYPE "FORCE"  LC "${Pe}"  FX ${P(S(e[0]))}  FY ${P(S(e[1]))}  FZ ${P(S(e[2]))}  MX ${P(y(e[3]))}  MY ${P(y(e[4]))}  MZ ${P(y(e[5]))}`);
  }), at.length > 0 && (c.push("$ POINT OBJECT LOADS"), at.forEach((e) => c.push(e)), c.push("")), ne && ie.size > 0) {
    const e = [];
    for (const t of ie) {
      const s = oe.get(t), a = ht.get(t);
      if (!a) continue;
      const r = (p) => P(f(p) / B);
      Math.abs(s[2]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "${s[2] < 0 ? "GRAV" : "Z"}"  LC "${Pe}"  FVAL ${r(Math.abs(s[2]))}`), Math.abs(s[0]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "X"  LC "${Pe}"  FVAL ${r(s[0])}`), Math.abs(s[1]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "Y"  LC "${Pe}"  FVAL ${r(s[1])}`);
    }
    e.length && (c.push("$ FRAME OBJECT LOADS"), e.forEach((t) => c.push(t)), c.push(""));
  }
  if (h && h.size > 0 && tt.length > 0) {
    const e = [];
    for (const t of tt) {
      const s = It.get(t.idx), a = s !== void 0 ? { value: s } : h.get(t.idx);
      if (!a || Math.abs(a.value) < 1e-12) continue;
      const r = a.dir ?? "GRAV", p = r === "GRAV" ? -a.value : a.value;
      e.push(`  AREALOAD  "${t.name}"  "${t.story}"  TYPE "UNIFF"  DIR "${r}"  LC "${a.pattern ?? Pe}"  FVAL ${P(f(p) / (B * B))}`);
    }
    e.length > 0 && (c.push("$ SHELL OBJECT LOADS"), e.forEach((t) => c.push(t)), c.push(""));
  }
  c.push("$ ANALYSIS OPTIONS"), c.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), c.push('  PDELTA  METHOD "NONE"  '), c.push("");
  const ct = Fe === "manual";
  c.push("$ MASS SOURCE"), c.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${ct ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${ct ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "No"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"  `), ct || c.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), c.push(""), c.push("$ LOAD CASES");
  const _t = ((_g = u.loadCases) == null ? void 0 : _g.length) ? u.loadCases : Re.map((e) => ({ name: e.name, type: "Linear Static", patterns: [{ pattern: e.name, scaleFactor: 1 }] }));
  for (const e of _t) {
    c.push(`  LOADCASE "${e.name}"  TYPE  "${e.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const t of e.patterns ?? []) c.push(`  LOADCASE "${e.name}"  LOADPAT  "${t.pattern}"  SF ${t.scaleFactor} `);
  }
  const Zt = u.modalModes ?? 12;
  c.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), c.push(`  LOADCASE "Modal"  MAXMODES ${Zt}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), c.push("");
  const rt = u.loadCombinations;
  if (rt && rt.length) {
    c.push("$ LOAD COMBINATIONS");
    for (const e of rt) {
      c.push(`  COMBO "${e.name}"  TYPE "${e.type ?? "Linear Add"}"  `);
      for (const t of e.cases ?? []) c.push(`  COMBO "${e.name}"  LOADCASE  "${t.case}"  SF ${t.scaleFactor} `);
    }
    c.push("");
  }
  return c.push("  END"), c.push("$ END OF MODEL FILE"), c.join(`\r
`);
}
function wt(u, A) {
  const D = u[A[0]], F = u[A[1]], m = Math.abs(F[2] - D[2]), H = Math.sqrt((F[0] - D[0]) ** 2 + (F[1] - D[1]) ** 2), j = m > H * 0.5;
  return j && H > 0.01 ? "BRACE" : j ? "COLUMN" : "BEAM";
}
export {
  is as a,
  cs as e,
  as as p
};
