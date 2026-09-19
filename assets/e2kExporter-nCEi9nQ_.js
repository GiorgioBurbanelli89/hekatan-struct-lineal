function Y(g) {
  return g && parseFloat(g) || 0;
}
function yt(g) {
  const A = /* @__PURE__ */ new Map(), R = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let P;
  for (; (P = R.exec(g)) !== null; ) A.set(P[1], P[2] !== void 0 ? P[2] : P[3]);
  return A;
}
function is(g) {
  const A = g.split(/\r?\n/);
  return A.some((P) => P.trim().startsWith("TABLE:")) ? qt(A) : Qt(A);
}
function qt(g) {
  var _a, _b, _c, _d, _e, _f;
  const A = [];
  let R = "";
  for (const G of g) {
    const M = G.trimEnd();
    M.endsWith("_") ? R += M.slice(0, -1) + " " : (R += M, A.push(R), R = "");
  }
  R && A.push(R);
  const P = { force: "KN", length: "m" };
  let m = "UX,UY,UZ,RX,RY,RZ";
  const v = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), K = [], X = [], j = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), ae = [], oe = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), i = [], h = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
  let W = "";
  for (const G of A) {
    const M = G.trim();
    if (!M || M.startsWith(";") || M.startsWith("File ")) continue;
    if (M.startsWith("TABLE:")) {
      const o = M.match(/TABLE:\s+"(.+?)"/);
      W = o ? o[1].toUpperCase() : "";
      continue;
    }
    if (M === "END TABLE DATA") {
      W = "";
      continue;
    }
    const l = yt(M);
    switch (W) {
      case "PROGRAM CONTROL": {
        const o = l.get("CurrUnits");
        if (o) {
          const a = o.split(",").map((s) => s.trim());
          a[0] && (P.force = a[0]), a[1] && (P.length = a[1]);
        }
        break;
      }
      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const o = l.get("Material");
        o && !v.has(o) && v.set(o, { E: 0, nu: 0, G: 0 });
        break;
      }
      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const o = l.get("Material");
        if (o) {
          const a = v.get(o) || { E: 0, nu: 0, G: 0 };
          a.E = Y(l.get("E1")), a.G = Y(l.get("G12")), a.nu = Y(l.get("U12")), a.density = Y(l.get("UnitMass")), v.set(o, a);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const o = l.get("Material");
        o && v.has(o) && (v.get(o).fy = Y(l.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const o = l.get("SectionName");
        o && S.set(o, { material: l.get("Material") || "", shape: l.get("Shape") || "Rectangular", D: Y(l.get("t3")), B: Y(l.get("t2")), TF: Y(l.get("tf")), TW: Y(l.get("tw")), T2B: Y(l.get("t2b")), TFB: Y(l.get("tfb")), DIS: Y(l.get("dis")), A: Y(l.get("Area")), Iz: Y(l.get("I33")), Iy: Y(l.get("I22")), J: Y(l.get("TorsConst")), As2: Y(l.get("AS2")), As3: Y(l.get("AS3")) });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const o = l.get("SectionName");
        o && J.set(o, { h: Y(l.get("Height")), b: Y(l.get("Width")), t: Y(l.get("WebThick")) || Y(l.get("FlngThick")), tf: Y(l.get("FlngThick")) || Y(l.get("WebThick")), mat: l.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const o = l.get("SectionName");
        o && J.set(o, { h: 0, b: 0, D: Y(l.get("OuterDiam")), t: Y(l.get("WallThick")), mat: l.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const o = l.get("SectionName");
        o && re.set(o, { mat: l.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const o = l.get("SectionName");
        o && re.set(o, { mat: l.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const o = l.get("Section");
        o && D.set(o, { material: l.get("Material") || "", type: l.get("Type") || "Shell", thickness: Y(l.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const o = l.get("Joint");
        if (o) {
          const a = Y(l.get("XorR")), s = Y(l.get("Y")), E = Y(l.get("Z"));
          Q.set(o, [a, s, E]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const o = l.get("Frame"), a = l.get("JointI"), s = l.get("JointJ");
        o && a && s && K.push({ name: o, j1: a, j2: s });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const o = l.get("Area");
        if (o) {
          const a = parseInt(l.get("NumJoints") || "4"), s = [];
          for (let E = 1; E <= a; E++) {
            const N = l.get(`Joint${E}`);
            N && s.push(N);
          }
          s.length >= 3 && X.push({ name: o, joints: s });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const o = l.get("Joint");
        if (o) {
          const a = [((_a = l.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = l.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = l.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = l.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = l.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = l.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          j.set(o, a);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const o = l.get("Joint");
        o && q.set(o, ["U1", "U2", "U3", "R1", "R2", "R3"].map((a) => parseFloat(l.get(a) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const o = l.get("Frame"), a = l.get("AnalSect");
        o && a && te.set(o, a);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const o = l.get("Area"), a = l.get("Section");
        o && a && le.set(o, a);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const o = l.get("Frame"), a = l.get("Dir"), s = Y(l.get("FOverLA"));
        if (o && a && s) {
          const E = { X: 0, Y: 1, Z: 2 }[a];
          if (E !== void 0) {
            const N = Se.get(o) ?? [0, 0, 0];
            N[E] += s, Se.set(o, N);
          }
        }
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const o = l.get("Solid");
        if (o) {
          const a = [];
          for (let s = 1; s <= 8; s++) {
            const E = l.get(`Joint${s}`);
            E && a.push(E);
          }
          a.length === 8 && i.push({ name: o, joints: a });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const o = l.get("SolidProp");
        o && h.set(o, { material: l.get("Material") || "", incomp: (l.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const o = l.get("Solid"), a = l.get("SolidProp");
        o && a && C.set(o, a);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const o = l.get("Area");
        o && Ee.set(o, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((a) => l.has(a) ? Y(l.get(a)) : 1));
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const o = l.get("Frame");
        o && ie.set(o, Y(l.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const o = l.get("Frame");
        o && oe.set(o, [Y(l.get("LengthI")), Y(l.get("LengthJ")), Y(l.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const o = l.get("Joint");
        o && ae.push({ joint: o, fx: Y(l.get("F1")), fy: Y(l.get("F2")), fz: Y(l.get("F3")), mx: Y(l.get("M1")), my: Y(l.get("M2")), mz: Y(l.get("M3")) });
        break;
      }
    }
  }
  return wt(P, m, v, S, D, Q, K, X, j, te, le, ae, oe, ie, Ee, Se, i, h, C, J, re, q);
}
function Qt(g) {
  const A = { force: "KN", length: "m" };
  let R = "UX,UY,UZ,RX,RY,RZ";
  const P = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), re = [], S = [], D = /* @__PURE__ */ new Map(), Q = [], K = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), te = [], le = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map();
  let oe = "", ie = "";
  for (const i of g) {
    const h = i.trim();
    if (!h || h.startsWith(";")) continue;
    if (!i.startsWith(" ") && !i.startsWith("	")) {
      const G = h.toUpperCase();
      if (G === "END") break;
      G.startsWith("SHELL SECTION") ? oe = "SHELL SECTION" : G.startsWith("FRAME SECTION") ? oe = "FRAME SECTION" : oe = G.split(/\s+/)[0];
      continue;
    }
    const C = yt(h), W = h.split(/\s+/);
    switch (oe) {
      case "SYSTEM": {
        const G = C.get("DOF");
        G && (R = G);
        const M = C.get("LENGTH");
        M && (A.length = M);
        const l = C.get("FORCE");
        l && (A.force = l);
        break;
      }
      case "JOINT": {
        const G = W[0];
        J.set(G, [Y(C.get("X")), Y(C.get("Y")), Y(C.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const G = C.get("ADD"), M = C.get("DOF");
        if (G && M) {
          const l = M.split(","), o = [false, false, false, false, false, false];
          for (const a of l) {
            const s = a.toUpperCase();
            (s === "UX" || s === "U1") && (o[0] = true), (s === "UY" || s === "U2") && (o[1] = true), (s === "UZ" || s === "U3") && (o[2] = true), (s === "RX" || s === "R1") && (o[3] = true), (s === "RY" || s === "R2") && (o[4] = true), (s === "RZ" || s === "R3") && (o[5] = true);
          }
          D.set(G, o);
        }
        break;
      }
      case "MATERIAL": {
        const G = C.get("NAME");
        if (G) ie = G, P.set(G, { E: 0, nu: 0, G: 0 });
        else if (ie) {
          const M = P.get(ie), l = C.get("E");
          l && (M.E = Y(l));
          const o = C.get("U");
          o && (M.nu = Y(o)), M.G = M.E / (2 * (1 + M.nu));
          const a = C.get("M");
          a && (M.density = Y(a));
        }
        break;
      }
      case "SHELL": {
        const G = W[0], M = C.get("J");
        C.get("SEC"), M && S.push({ name: G, joints: M.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const G = C.get("NAME");
        G && v.set(G, { material: C.get("MAT") || "", type: C.get("TYPE") || "Shell", thickness: Y(C.get("TH")) });
        break;
      }
      case "FRAME": {
        const G = W[0], M = C.get("J");
        if (M) {
          const l = M.split(",");
          l.length >= 2 && re.push({ name: G, j1: l[0], j2: l[1] });
        }
        break;
      }
      case "LOAD": {
        const G = C.get("ADD");
        G && Q.push({ joint: G, fx: Y(C.get("UX")), fy: Y(C.get("UY")), fz: Y(C.get("UZ")), mx: Y(C.get("MX")), my: Y(C.get("MY")), mz: Y(C.get("MZ")) });
        break;
      }
    }
  }
  return wt(A, R, P, m, v, J, re, S, D, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), Q, K, X, j, q, te, le, ae);
}
function wt(g, A, R, P, m, v, J, re, S, D, Q, K, X = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), le = [], ae = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), ie, Ee, Se = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const i = [], h = /* @__PURE__ */ new Map(), C = [];
  for (const [T, p] of v) h.set(T, C.length), i.push(T), C.push(p);
  const W = [], G = [], M = /* @__PURE__ */ new Map();
  for (const T of J) {
    const p = h.get(T.j1), b = h.get(T.j2);
    if (p !== void 0 && b !== void 0) {
      const f = W.length;
      W.push([p, b]), G.push(T.name);
      const O = D.get(T.name);
      O && M.set(f, O);
    }
  }
  const l = W.length;
  for (const T of re) {
    const p = T.joints.map((b) => h.get(b)).filter((b) => b !== void 0);
    if (p.length >= 3) {
      const b = W.length;
      W.push(p), G.push(T.name);
      const f = Q.get(T.name);
      f && M.set(b, f);
    }
  }
  const o = W.length - l, a = [];
  for (const T of le) {
    const p = T.joints.map((O) => h.get(O));
    if (p.some((O) => O === void 0)) continue;
    const b = W.length;
    W.push([p[0], p[1], p[3], p[2], p[4], p[5], p[7], p[6]]), G.push(T.name), a.push(b);
    const f = oe.get(T.name);
    f && M.set(b, f);
  }
  const s = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, E = /* @__PURE__ */ new Map(), N = R.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let T = 0; T < W.length; T++) {
    const p = M.get(T), b = p ? P.get(p) : null, f = p ? m.get(p) : null;
    if (b || W[T].length === 2) {
      const O = b || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, x = R.get(O.material) || N, U = x.E || N.E, ee = x.nu || 0.3, _ = x.G || U / (2 * (1 + ee));
      s.elasticities.set(T, U), s.shearModuli.set(T, _), s.areas.set(T, O.A || O.D * O.B), s.momentsOfInertiaZ.set(T, O.Iz || O.B * O.D ** 3 / 12), s.momentsOfInertiaY.set(T, O.Iy || O.D * O.B ** 3 / 12), s.torsionalConstants.set(T, O.J || 0), s.densities.set(T, x.density || 0), O.As2 && (s.shearAreasZ ?? (s.shearAreasZ = /* @__PURE__ */ new Map()), s.shearAreasZ.set(T, O.As2)), O.As3 && (s.shearAreasY ?? (s.shearAreasY = /* @__PURE__ */ new Map()), s.shearAreasY.set(T, O.As3));
      const k = X.get(G[T]);
      k && (s.endOffsets ?? (s.endOffsets = /* @__PURE__ */ new Map()), s.endOffsets.set(T, k));
      const se = j.get(G[T]);
      se && (s.localAngles ?? (s.localAngles = /* @__PURE__ */ new Map()), s.localAngles.set(T, se));
      const Z = O;
      ((_a = O.shape) == null ? void 0 : _a.includes("Wide Flange")) || O.shape === "I" ? E.set(T, { type: "I", b: O.B, h: O.D, ...Z.TF > 0 && Z.TW > 0 ? { tf: Z.TF, tw: Z.TW, t2b: Z.T2B > 0 ? Z.T2B : O.B, tfb: Z.TFB > 0 ? Z.TFB : Z.TF } : {}, name: p || "I-section" }) : /box|tube/i.test(O.shape ?? "") && Z.TF > 0 && Z.TW > 0 ? E.set(T, { type: "HSS", b: O.B, h: O.D, tf: Z.TF, tw: Z.TW, name: p }) : /^channel$/i.test(O.shape ?? "") && Z.TF > 0 && Z.TW > 0 ? E.set(T, { type: "C", b: O.B, h: O.D, tf: Z.TF, tw: Z.TW, name: p }) : /double angle/i.test(O.shape ?? "") && Z.TF > 0 && Z.TW > 0 ? E.set(T, { type: "2L", b: O.B, h: O.D, tf: Z.TF, tw: Z.TW, dis: Z.DIS || 0, name: p }) : E.set(T, { type: "rect", b: O.B, h: O.D });
      const ce = p ? ie == null ? void 0 : ie.get(p) : void 0;
      if (ce && ce.t > 0 && (ce.b > 0 && ce.h > 0 || (ce.D ?? 0) > 0)) {
        const Me = p ? Ee == null ? void 0 : Ee.get(p) : void 0, pe = Me && ((_b = R.get(Me.mat)) == null ? void 0 : _b.E) || 0;
        E.set(T, ce.D ? { type: "CFT", d: ce.D, tw: ce.t, name: p, ...pe > 0 ? { fillE: pe } : {} } : { type: "CFT", b: ce.b, h: ce.h, tw: ce.t, ...ce.tf && ce.tf !== ce.t ? { tf: ce.tf } : {}, name: p, ...pe > 0 ? { fillE: pe } : {} });
      }
    } else if (f) {
      const O = R.get(f.material) || N, x = O.E || N.E, U = O.nu || 0.2, ee = O.G || x / (2 * (1 + U));
      s.elasticities.set(T, x), s.shearModuli.set(T, ee), s.thicknesses.set(T, f.thickness), s.poissonsRatios.set(T, U), s.plateFormulations ?? (s.plateFormulations = /* @__PURE__ */ new Map()), s.plateFormulations.set(T, /thin/i.test(f.type) ? 1 : 0);
      const _ = /membrane/i.test(f.type), k = q.get(G[T]), se = k && _ ? [k[0], k[1], k[2], 0, 0, 0, 0, 0] : k;
      se ? (s.shellModifiers ?? (s.shellModifiers = /* @__PURE__ */ new Map()), s.shellModifiers.set(T, se), s.membraneModifiers ?? (s.membraneModifiers = /* @__PURE__ */ new Map()), s.membraneModifiers.set(T, se[0]), s.bendingModifiers ?? (s.bendingModifiers = /* @__PURE__ */ new Map()), s.bendingModifiers.set(T, se[3])) : _ && (s.membraneModifiers ?? (s.membraneModifiers = /* @__PURE__ */ new Map()), s.membraneModifiers.set(T, 1), s.bendingModifiers ?? (s.bendingModifiers = /* @__PURE__ */ new Map()), s.bendingModifiers.set(T, 0)), s.densities.set(T, O.density || 0);
    }
  }
  if (a.length) {
    let T = false;
    for (const p of a) {
      const b = ae.get(M.get(p) || ""), f = b && R.get(b.material) || N, O = f.E || N.E, x = f.nu || 0.2;
      s.elasticities.set(p, O), s.poissonsRatios.set(p, x), s.shearModuli.set(p, f.G || O / (2 * (1 + x))), s.densities.set(p, f.density || 0), (b == null ? void 0 : b.incomp) && (T = true);
    }
    s.solidIncompatible = T;
  }
  const B = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [T, p] of S) {
    const b = h.get(T);
    b !== void 0 && B.supports.set(b, p);
  }
  {
    const T = [];
    for (const [p, b] of Se) {
      const f = h.get(p);
      f !== void 0 && b.forEach((O, x) => {
        O > 0 && T.push({ node: f, dof: x, k: O });
      });
    }
    T.length && (B.springs = T);
  }
  for (const [T, p] of te) {
    const b = G.indexOf(T);
    if (b < 0 || W[b].length !== 2) continue;
    s.frameLoads ?? (s.frameLoads = /* @__PURE__ */ new Map()), s.frameLoads.set(b, p);
    const f = C[W[b][0]], O = C[W[b][1]], x = [O[0] - f[0], O[1] - f[1], O[2] - f[2]], U = Math.hypot(x[0], x[1], x[2]);
    if (U < 1e-9) continue;
    const ee = [x[0] / U, x[1] / U, x[2] / U], _ = U * U / 12, k = [ee[1] * p[2] - ee[2] * p[1], ee[2] * p[0] - ee[0] * p[2], ee[0] * p[1] - ee[1] * p[0]], se = (Z, ce) => {
      const Me = B.loads.get(Z) || [0, 0, 0, 0, 0, 0];
      for (let pe = 0; pe < 6; pe++) Me[pe] += ce[pe];
      B.loads.set(Z, Me);
    };
    se(W[b][0], [p[0] * U / 2, p[1] * U / 2, p[2] * U / 2, _ * k[0], _ * k[1], _ * k[2]]), se(W[b][1], [p[0] * U / 2, p[1] * U / 2, p[2] * U / 2, -_ * k[0], -_ * k[1], -_ * k[2]]);
  }
  for (const T of K) {
    const p = h.get(T.joint);
    if (p !== void 0) {
      const b = B.loads.get(p) || [0, 0, 0, 0, 0, 0];
      b[0] += T.fx, b[1] += T.fy, b[2] += T.fz, b[3] += T.mx, b[4] += T.my, b[5] += T.mz, B.loads.set(p, b);
    }
  }
  return { units: g, dof: A, materials: R, frameSections: P, shellSections: m, nodes: C, nodeNames: i, nodeNameToIdx: h, elements: W, elementNames: G, elementSections: M, nodeInputs: B, elementInputs: s, sectionShapes: E, info: { nNodes: C.length, nFrames: l, nShells: o, title: `SAP2000 (${l} frames, ${o} shells)` } };
}
function Bt(g, A, R, P = {}) {
  const m = /* @__PURE__ */ new Map(), v = [];
  let J = 0;
  const re = (D, Q, K) => {
    const X = m.get(D) ?? [0, 0, 0, 0, 0, 0];
    X[Q] += K, m.set(D, X);
  }, S = 1 / Math.sqrt(3);
  for (const D of R ?? []) {
    if (D.node >= 0) {
      D.dof >= 0 && D.dof <= 5 && D.k > 0 && re(D.node, D.dof, D.k);
      continue;
    }
    const Q = -D.node - 1, K = A[Q];
    if (!K) continue;
    if (D.dof === -2 || D.dof === -4) {
      v.push([Q, Math.round(D.k), D.dof === -4]);
      continue;
    }
    if (D.dof !== -1 && D.dof !== -3 || !(D.k > 0) || K.length !== 3 && K.length !== 4 || P.sinArea) continue;
    J++;
    const X = K.map((i) => g[i]), j = X[0], q = X[1], te = X[2], le = K.length === 4 ? X[3] : X[0], ae = [te[0] - j[0], te[1] - j[1], te[2] - j[2]], oe = K.length === 4 ? [le[0] - q[0], le[1] - q[1], le[2] - q[2]] : [q[0] - j[0], q[1] - j[1], q[2] - j[2]];
    let ie = [ae[1] * oe[2] - ae[2] * oe[1], ae[2] * oe[0] - ae[0] * oe[2], ae[0] * oe[1] - ae[1] * oe[0]];
    const Ee = Math.hypot(ie[0], ie[1], ie[2]);
    ie = Ee > 1e-30 ? ie.map((i) => i / Ee) : [0, 0, 1];
    const Se = new Array(K.length).fill(0);
    if (K.length === 3) {
      const i = [(q[1] - j[1]) * (te[2] - j[2]) - (q[2] - j[2]) * (te[1] - j[1]), (q[2] - j[2]) * (te[0] - j[0]) - (q[0] - j[0]) * (te[2] - j[2]), (q[0] - j[0]) * (te[1] - j[1]) - (q[1] - j[1]) * (te[0] - j[0])];
      Se.fill(0.5 * Math.hypot(i[0], i[1], i[2]) / 3);
    } else for (const i of [-S, S]) for (const h of [-S, S]) {
      const C = [0.25 * (1 - i) * (1 - h), 0.25 * (1 + i) * (1 - h), 0.25 * (1 + i) * (1 + h), 0.25 * (1 - i) * (1 + h)], W = [-0.25 * (1 - h), 0.25 * (1 - h), 0.25 * (1 + h), -0.25 * (1 + h)], G = [-0.25 * (1 - i), -0.25 * (1 + i), 0.25 * (1 + i), 0.25 * (1 - i)], M = [0, 0, 0], l = [0, 0, 0];
      for (let s = 0; s < 4; s++) for (let E = 0; E < 3; E++) M[E] += W[s] * X[s][E], l[E] += G[s] * X[s][E];
      const o = [M[1] * l[2] - M[2] * l[1], M[2] * l[0] - M[0] * l[2], M[0] * l[1] - M[1] * l[0]], a = Math.hypot(o[0], o[1], o[2]);
      for (let s = 0; s < 4; s++) Se[s] += C[s] * a;
    }
    K.forEach((i, h) => {
      for (let C = 0; C < 3; C++) Math.abs(ie[C]) > 1e-12 && re(i, C, D.k * Se[h] * ie[C] * ie[C]);
    });
  }
  return { nodales: m, colgados: v, deArea: J };
}
function cs(g) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: A, elements: R, nodeInputs: P, elementInputs: m } = g, v = { force: "KN", length: "m" };
  g.units && (g.units.force !== "KN" || g.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${g.units.force}, ${g.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const J = g.title || "Hekatan Model", re = [], S = (o) => re.push(o), D = () => re.push(" ");
  S(`File ${J}.$2k was saved on m/d/yy at h:mm:ss`), D(), S('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), S("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), D();
  const Q = [], K = (o) => {
    var _a2, _b2, _c2, _d2, _e2;
    const a = ((_a2 = m.elasticities) == null ? void 0 : _a2.get(o)) || 0, s = (_b2 = m.poissonsRatios) == null ? void 0 : _b2.get(o), E = ((_c2 = m.shearModuli) == null ? void 0 : _c2.get(o)) || 0, N = s !== void 0 ? s : a > 0 && E > 0 ? Math.max(0, Math.min(0.5, a / (2 * E) - 1)) : 0.2, B = E > 0 ? E : a > 0 ? a / (2 * (1 + N)) : 0, T = (_d2 = m.sectionShapes) == null ? void 0 : _d2.get(o), p = (T == null ? void 0 : T.type) === "CFT" && T.steelRho > 0 ? T.steelRho : ((_e2 = m.densities) == null ? void 0 : _e2.get(o)) || 0, b = p > 0 ? `_r${+p.toPrecision(6)}` : "_r0";
    return { E: a, nu: N, G: B, rho: p, key: `MAT_${Math.round(a)}_n${N.toFixed(4)}${b}` };
  }, X = [], j = [];
  if (R.forEach((o, a) => {
    o.length === 2 ? Q.push(a) : o.length === 8 ? j.push(a) : X.push(a);
  }), Q.length > 0) {
    S('TABLE:  "CONNECTIVITY - FRAME"');
    for (const o of Q) {
      const a = R[o];
      S(`   Frame=${o + 1}   JointI=${a[0] + 1}   JointJ=${a[1] + 1}   IsCurved=No`);
    }
    D();
  }
  if (X.length > 0) {
    S('TABLE:  "CONNECTIVITY - AREA"');
    for (const o of X) {
      const a = R[o], s = a.map((E, N) => `Joint${N + 1}=${E + 1}`).join("   ");
      S(`   Area=${o + 1}   NumJoints=${a.length}   ${s}`);
    }
    D();
  }
  if (j.length > 0) {
    S('TABLE:  "CONNECTIVITY - SOLID"');
    for (const o of j) {
      const a = R[o], s = [a[0], a[1], a[3], a[2], a[4], a[5], a[7], a[6]];
      S(`   Solid=${o + 1}   ${s.map((E, N) => `Joint${N + 1}=${E + 1}`).join("   ")}`);
    }
    D();
  }
  S('TABLE:  "COORDINATE SYSTEMS"'), S("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), D(), S('TABLE:  "DATABASE FORMAT TYPES"'), S("   UnitsCurr=Yes   OverrideE=No"), D();
  const q = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map();
  for (const o of Q) {
    const a = ((_a = m.areas) == null ? void 0 : _a.get(o)) || 0, s = ((_b = m.momentsOfInertiaZ) == null ? void 0 : _b.get(o)) || 0, E = ((_c = m.momentsOfInertiaY) == null ? void 0 : _c.get(o)) || 0, N = ((_d = m.torsionalConstants) == null ? void 0 : _d.get(o)) || 0, B = ((_e = m.elasticities) == null ? void 0 : _e.get(o)) || 0, T = K(o).key, p = ((_f = m.shearAreasZ) == null ? void 0 : _f.get(o)) ?? 0, b = ((_g = m.shearAreasY) == null ? void 0 : _g.get(o)) ?? 0, f = (_h = m.sectionShapes) == null ? void 0 : _h.get(o);
    let O;
    const x = (f == null ? void 0 : f.type) === "CFT" && f.d > 0 && f.tw > 0 && f.tw < f.d / 2 && !(f.b > 0 && f.h > 0);
    if (g.cftAs !== "general" && (f == null ? void 0 : f.type) === "CFT" && B > 0 && (x || f.b > 0 && f.h > 0 && f.tw > 0 && f.tw < Math.min(f.b, f.h) / 2)) {
      const k = x ? f.d - 2 * f.tw : 0, se = x ? 0 : f.b - 2 * f.tw, Z = x ? 0 : f.h - 2 * (f.tf ?? f.tw), ce = x ? Math.PI * (f.d * f.d - k * k) / 4 : f.b * f.h - se * Z, Me = x ? Math.PI * k * k / 4 : se * Z, Ae = (f.fillE > 0 ? f.fillE / B : Math.max(0.01, Math.min(1, (a - ce) / Me))) * B, Le = 0.2, ge = f.fillRho ?? 2.4, Ie = `FILL_${Math.round(Ae)}_r${ge}`;
      te.has(Ie) || te.set(Ie, { E: Ae, nu: Le, G: Ae / (2 * (1 + Le)), rho: ge }), O = x ? { b: f.d, h: f.d, t: f.tw, Ec: Ae, nuC: Le, matFill: Ie, D: f.d } : { b: f.b, h: f.h, t: f.tw, tf: f.tf ?? f.tw, Ec: Ae, nuC: Le, matFill: Ie };
    }
    let U;
    !O && (f == null ? void 0 : f.type) === "I" && f.h > 0 && f.b > 0 && f.tf > 0 && f.tw > 0 ? U = { kind: "I", t3: f.h, t2: f.b, tf: f.tf, tw: f.tw, t2b: f.t2b ?? f.b, tfb: f.tfb ?? f.tf } : !O && (f == null ? void 0 : f.type) === "HSS" && f.h > 0 && f.b > 0 && f.tf > 0 && f.tw > 0 ? U = { kind: "Box", t3: f.h, t2: f.b, tf: f.tf, tw: f.tw } : !O && (f == null ? void 0 : f.type) === "C" && f.h > 0 && f.b > 0 && f.tf > 0 && f.tw > 0 ? U = { kind: "C", t3: f.h, t2: f.b, tf: f.tf, tw: f.tw } : !O && (f == null ? void 0 : f.type) === "2L" && f.h > 0 && f.b > 0 && f.tf > 0 && f.tw > 0 && (U = { kind: "2L", t3: f.h, t2: f.b, tf: f.tf, tw: f.tw, dis: f.dis ?? 0 });
    const ee = `A${a.toPrecision(6)}_Iz${s.toPrecision(6)}_s${p.toPrecision(6)}_${b.toPrecision(6)}${O ? O.D ? `_SDC${O.D}x${O.t}` : `_SD${O.b}x${O.h}x${O.t}` : ""}${U ? `_P${U.kind}${U.t3}x${U.t2}x${U.tf}x${U.tw}x${U.t2b ?? ""}x${U.tfb ?? ""}x${U.dis ?? ""}` : ""}`;
    if (!q.has(ee)) {
      let k = 0.3, se = 0.3;
      a > 0 && s > 0 && (k = Math.sqrt(12 * s / a), se = a / k), q.set(ee, { A: a, Iz: s, Iy: E, J: N, b: se, h: k, matKey: T, As2: p > 0 ? p : a * 5 / 6, As3: b > 0 ? b : a * 5 / 6, sd: O, param: U });
    }
    const _ = [...q.keys()].indexOf(ee) + 1;
    le.set(o, `SEC${_}`);
  }
  if (Q.length > 0) {
    S('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const o of Q) {
      const a = le.get(o) || "SEC1";
      S(`   Frame=${o + 1}   AutoSelect=N.A.   AnalSect=${a}   MatProp=Default`);
    }
    D();
  }
  if (q.size > 0) {
    S('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let o = 0;
    for (const [, a] of q) {
      if (o++, a.sd) {
        S(`   SectionName=SEC${o}   Material=${a.matKey}   Shape="SD Section"   Area=${$(a.A)}   TorsConst=${$(a.J)}   I33=${$(a.Iz)}   I22=${$(a.Iy)}   I23=0   AS2=${$(a.As2)}   AS3=${$(a.As3)} _`), S("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      if (a.param) {
        const s = a.param, E = s.kind === "I" ? `Shape="I/Wide Flange"   t3=${$(s.t3)}   t2=${$(s.t2)}   tf=${$(s.tf)}   tw=${$(s.tw)}   t2b=${$(s.t2b)}   tfb=${$(s.tfb)}` : s.kind === "C" ? `Shape=Channel   t3=${$(s.t3)}   t2=${$(s.t2)}   tf=${$(s.tf)}   tw=${$(s.tw)}` : s.kind === "2L" ? `Shape="Double Angle"   t3=${$(s.t3)}   t2=${$(s.t2)}   SngAngWid=${$((s.t2 - (s.dis ?? 0)) / 2)}   tf=${$(s.tf)}   tw=${$(s.tw)}   dis=${$(s.dis ?? 0)}` : `Shape=Box/Tube   t3=${$(s.t3)}   t2=${$(s.t2)}   tf=${$(s.tf)}   tw=${$(s.tw)}`;
        S(`   SectionName=SEC${o}   Material=${a.matKey}   ${E}   FilletRadius=0   Area=${$(a.A)}   TorsConst=${$(a.J)}   I33=${$(a.Iz)}   I22=${$(a.Iy)}   I23=0   AS2=${$(a.As2)}   AS3=${$(a.As3)} _`), S("        Color=Red   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      S(`   SectionName=SEC${o}   Material=${a.matKey}   Shape=General   t3=${$(a.h)}   t2=${$(a.b)}   Area=${$(a.A)}   TorsConst=${$(a.J)}   I33=${$(a.Iz)}   I22=${$(a.Iy)}   I23=0   AS2=${$(a.As2)}   AS3=${$(a.As3)} _`), S("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    D();
  }
  const ae = [...q.values()].map((o, a) => ({ sec: o, name: `SEC${a + 1}` })).filter((o) => o.sec.sd);
  if (ae.length > 0) {
    S('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: s } of ae) S(`   SectionName=${s}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    D();
    const o = ae.filter((s) => !s.sec.sd.D), a = ae.filter((s) => s.sec.sd.D);
    if (o.length > 0) {
      S('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: s, name: E } of o) {
        const N = s.sd;
        S(`   SectionName=${E}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${s.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${$(N.h)}   Width=${$(N.b)}   FlngThick=${$(N.tf ?? N.t)}   WebThick=${$(N.t)}   Rotation=0 _`), S('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      D();
    }
    if (a.length > 0) {
      S('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: s, name: E } of a) {
        const N = s.sd;
        S(`   SectionName=${E}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${s.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${$(N.D)}   WallThick=${$(N.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), S("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      D();
    }
    if (o.length > 0) {
      S('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: s, name: E } of o) {
        const N = s.sd;
        S(`   SectionName=${E}   ShapeName=RELLENO   ShapeMat=${N.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${$(N.h - 2 * (N.tf ?? N.t))}   Width=${$(N.b - 2 * N.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), S("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      D();
    }
    if (a.length > 0) {
      S('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: s, name: E } of a) {
        const N = s.sd;
        S(`   SectionName=${E}   ShapeName=RELLENO   ShapeMat=${N.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${$(N.D - 2 * N.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      D();
    }
    S('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: s } of ae) S(`   SectionName=${s}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    D();
  }
  {
    const o = Q.filter((a) => {
      var _a2;
      const s = (_a2 = m.localAngles) == null ? void 0 : _a2.get(a);
      return s !== void 0 && isFinite(s) && Math.abs(s) > 1e-9;
    });
    if (o.length > 0) {
      S('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const a of o) S(`   Frame=${a + 1}   Angle=${$(m.localAngles.get(a))}   AdvanceAxes=No`);
      D();
    }
  }
  {
    const o = m.endOffsets, a = Q.filter((s) => {
      const E = o == null ? void 0 : o.get(s);
      return !!E && (Math.abs(E[0]) > 1e-9 || Math.abs(E[1]) > 1e-9);
    });
    if (a.length > 0) {
      S('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const s of a) {
        const E = o.get(s);
        S(`   Frame=${s + 1}   Type=User   LengthI=${$(E[0])}   LengthJ=${$(E[1])}   RigidFactor=${$(E.length > 2 ? E[2] : 0)}`);
      }
      D();
    }
  }
  const oe = !!g.layeredSection && X.length > 0, ie = g.layeredSection, Ee = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), i = m.shellModifiers, h = m.membraneModifiers, C = m.bendingModifiers, W = (o) => !(i == null ? void 0 : i.has(o)) && Math.abs((C == null ? void 0 : C.get(o)) ?? 1) < 1e-9;
  if (!oe) for (const o of X) {
    const a = ((_i = m.thicknesses) == null ? void 0 : _i.get(o)) || 0.1;
    (_j = m.elasticities) == null ? void 0 : _j.get(o);
    const s = K(o).key, E = W(o) ? 2 : ((_k = m.plateFormulations) == null ? void 0 : _k.get(o)) ?? 0, N = `t${a.toPrecision(6)}_f${E}`;
    Ee.has(N) || Ee.set(N, { t: a, matKey: s, formulacion: E });
    const B = [...Ee.keys()].indexOf(N) + 1;
    Se.set(o, `SSEC${B}`);
  }
  if (X.length > 0) {
    S('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const s of X) {
      const E = oe ? ie.name : Se.get(s) || "SSEC1";
      S(`   Area=${s + 1}   Section=${E}   MatProp=Default`);
    }
    D();
    const o = (s) => {
      const E = i == null ? void 0 : i.get(s);
      if (E) return E;
      const N = (h == null ? void 0 : h.get(s)) ?? 1, B = W(s) ? 1 : (C == null ? void 0 : C.get(s)) ?? 1;
      return [N, N, N, B, B, B, B, B];
    }, a = X.filter((s) => {
      const E = o(s);
      return E && E.some((N) => Math.abs(N - 1) > 1e-12);
    });
    if (a.length > 0) {
      S('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const s of a) {
        const E = o(s);
        S(`   Area=${s + 1}   f11=${$(E[0])}   f22=${$(E[1])}   f12=${$(E[2])}   m11=${$(E[3])}   m22=${$(E[4])}   m12=${$(E[5])}   v13=${$(E[6])}   v23=${$(E[7])}   MassMod=1   WeightMod=1`);
      }
      D();
    }
    if (S('TABLE:  "AREA SECTION PROPERTIES"'), oe) {
      const s = ie, E = ((_l = s.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      S(`   Section=${s.name}   Material=${E}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${$(s.totalThickness)}   BendThick=${$(s.totalThickness)}   Color=Magenta`);
    } else {
      let s = 0;
      for (const [, E] of Ee) {
        s++;
        const N = E.formulacion === 2 ? "Membrane" : E.formulacion === 3 ? "Plate-Thin" : E.formulacion === 4 ? "Plate-Thick" : E.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", B = E.formulacion === 3 || E.formulacion === 4 ? "No" : "Yes";
        S(`   Section=SSEC${s}   Material=${E.matKey}   MatAngle=0   AreaType=Shell   Type=${N}   DrillDOF=${B}   Thickness=${$(E.t)}   BendThick=${$(E.t)}   Color=Cyan`);
      }
    }
    if (D(), oe) {
      S('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const s = ie;
      for (const E of s.layers) {
        const N = E.angle ?? 0, B = E.numIntPts ?? 3;
        S(`   Section=${s.name}   LayerName=${E.name}   Distance=${$(E.distance)}   Thickness=${$(E.thickness)}   Type=Shell   NumIntPts=${B}   Material=${E.material}   MatAngle=${$(N * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      D();
    }
  }
  S('TABLE:  "JOINT COORDINATES"');
  for (let o = 0; o < A.length; o++) {
    const a = A[o];
    S(`   Joint=${o + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${$(a[0])}   Y=${$(a[1])}   Z=${$(a[2])}   SpecialJt=No`);
  }
  if (D(), P.supports && P.supports.size > 0) {
    S('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [o, a] of P.supports) {
      if (!a.some((E) => E)) continue;
      const s = (E) => E ? "Yes" : "No";
      S(`   Joint=${o + 1}   U1=${s(a[0])}   U2=${s(a[1])}   U3=${s(a[2])}   R1=${s(a[3])}   R2=${s(a[4])}   R3=${s(a[5])}`);
    }
    D();
  }
  {
    const o = g.patrones ? m.areaSpringsExport : void 0, a = Bt(A, R, P.springs, { sinArea: !!(o == null ? void 0 : o.size) }).nodales;
    if (o == null ? void 0 : o.size) {
      S('TABLE:  "AREA SPRING ASSIGNMENTS"');
      for (const [s, E] of o) S(`   Area=${s + 1}   Type=Simple   Stiffness=${$(E.ks)}   SimpleType=${E.comp ? '"Compression Only"' : '"Tension and Compression"'}   Face=Bottom   Dir1Type="Object Axes"   Dir=3`);
      D();
    }
    if (a.size > 0) {
      S('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [s, E] of [...a].sort((N, B) => N[0] - B[0])) S(`   Joint=${s + 1}   CoordSys=Global   U1=${$(E[0])}   U2=${$(E[1])}   U3=${$(E[2])}   R1=${$(E[3])}   R2=${$(E[4])}   R3=${$(E[5])}`);
      D();
    }
  }
  const G = P.diaphragms;
  if (G && G.size > 0) {
    const o = /* @__PURE__ */ new Map();
    for (const [s, E] of G) {
      const N = Math.round(E);
      if (N === 0) continue;
      const B = Math.abs(N);
      o.has(B) || o.set(B, []), o.get(B).push(s);
    }
    const a = [...o].filter(([, s]) => s.length >= 2);
    if (a.length > 0) {
      S('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [s] of a) S(`   Name=DIAPH${s}   CoordSys=GLOBAL   Axis=Z`);
      D(), S('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [s, E] of a) for (const N of E) S(`   Joint=${N + 1}   Constraint=DIAPH${s}`);
      D();
    }
  }
  const M = P.cargasPorPatron;
  if (g.patrones && M) {
    const o = m.frameLoadsPorPatron ?? {}, a = [.../* @__PURE__ */ new Set([...Object.keys(M), ...Object.keys(o)])], s = (p) => /^dead$/i.test(p) ? "Dead" : /^(dne|sdead|scm|superdead)$/i.test(p) ? '"Super Dead"' : /^(live|viva|l)$/i.test(p) ? "Live" : "Other", E = m.selfWeight ?? 0;
    S('TABLE:  "LOAD PATTERN DEFINITIONS"');
    for (const p of a) S(`   LoadPat=${p}   DesignType=${s(p)}   SelfWtMult=${/^dead$/i.test(p) ? $(E) : 0}`);
    D(), S('TABLE:  "LOAD CASE DEFINITIONS"');
    for (const p of a) S(`   Case=${p}   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=${s(p)}   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes`);
    D(), S('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"');
    for (const p of a) S(`   Case=${p}   LoadType="Load pattern"   LoadName=${p}   LoadSF=1`);
    D();
    const N = [];
    for (const p of a) for (const [b, f] of M[p] ?? /* @__PURE__ */ new Map()) f.some((O) => Math.abs(O) > 1e-12) && N.push(`   Joint=${b + 1}   LoadPat=${p}   CoordSys=GLOBAL   F1=${$(f[0])}   F2=${$(f[1])}   F3=${$(f[2])}   M1=${$(f[3])}   M2=${$(f[4])}   M3=${$(f[5])}`);
    N.length && (S('TABLE:  "JOINT LOADS - FORCE"'), N.forEach(S), D());
    const B = [];
    for (const p of a) for (const [b, f] of o[p] ?? /* @__PURE__ */ new Map()) {
      const O = R[b];
      if (!O || O.length !== 2) continue;
      const x = A[O[0]], U = A[O[1]], ee = Math.hypot(U[0] - x[0], U[1] - x[1], U[2] - x[2]);
      ["X", "Y", "Z"].forEach((_, k) => {
        Math.abs(f[k]) < 1e-12 || B.push(`   Frame=${b + 1}   LoadPat=${p}   CoordSys=GLOBAL   Type=Force   Dir=${_}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${$(ee)}   FOverLA=${$(f[k])}   FOverLB=${$(f[k])}`);
      });
    }
    B.length && (S('TABLE:  "FRAME LOADS - DISTRIBUTED"'), B.forEach(S), D());
    const T = m.combos ?? [];
    if (T.length) {
      S('TABLE:  "COMBINATION DEFINITIONS"');
      for (const p of T) p.items.forEach(([b, f], O) => S(O === 0 ? `   ComboName=${p.name}   ComboType="Linear Add"   AutoDesign=No   CaseType="Linear Static"   CaseName=${b}   ScaleFactor=${$(f)}   SteelDesign=None   ConcDesign=None   AlumDesign=None   ColdDesign=None` : `   ComboName=${p.name}   CaseType="Linear Static"   CaseName=${b}   ScaleFactor=${$(f)}`));
      D();
    }
  } else {
    const o = g.selfWtMult ?? 1;
    S('TABLE:  "LOAD PATTERN DEFINITIONS"'), S(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${o}`), D(), S('TABLE:  "LOAD CASE DEFINITIONS"'), S('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), D(), S('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), S('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), D();
    const a = m.frameLoads, s = /* @__PURE__ */ new Map();
    if ((_m = P.loads) == null ? void 0 : _m.forEach((N, B) => s.set(B, [...N])), a && a.size > 0) {
      const N = (B, T) => {
        const p = s.get(B) ?? [0, 0, 0, 0, 0, 0];
        s.set(B, p.map((b, f) => b - T[f]));
      };
      for (const [B, T] of a) {
        const p = R[B];
        if (!p || p.length !== 2) continue;
        const b = A[p[0]], f = A[p[1]], O = [f[0] - b[0], f[1] - b[1], f[2] - b[2]], x = Math.hypot(O[0], O[1], O[2]);
        if (x < 1e-9) continue;
        const U = [O[0] / x, O[1] / x, O[2] / x], ee = x * x / 12, _ = [U[1] * T[2] - U[2] * T[1], U[2] * T[0] - U[0] * T[2], U[0] * T[1] - U[1] * T[0]];
        N(p[0], [T[0] * x / 2, T[1] * x / 2, T[2] * x / 2, ee * _[0], ee * _[1], ee * _[2]]), N(p[1], [T[0] * x / 2, T[1] * x / 2, T[2] * x / 2, -ee * _[0], -ee * _[1], -ee * _[2]]);
      }
    }
    if (s.size > 0) {
      S('TABLE:  "JOINT LOADS - FORCE"');
      for (const [N, B] of s) B.some((T) => Math.abs(T) > 1e-12) && S(`   Joint=${N + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${$(B[0])}   F2=${$(B[1])}   F3=${$(B[2])}   M1=${$(B[3])}   M2=${$(B[4])}   M3=${$(B[5])}`);
      D();
    }
    const E = m.frameLoads;
    if (E && E.size > 0) {
      S('TABLE:  "FRAME LOADS - DISTRIBUTED"');
      for (const [N, B] of E) {
        const T = R[N];
        if (!T || T.length !== 2) continue;
        const p = A[T[0]], b = A[T[1]], f = Math.hypot(b[0] - p[0], b[1] - p[1], b[2] - p[2]);
        ["X", "Y", "Z"].forEach((O, x) => {
          Math.abs(B[x]) < 1e-12 || S(`   Frame=${N + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${O}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${$(f)}   FOverLA=${$(B[x])}   FOverLB=${$(B[x])}`);
        });
      }
      D();
    }
  }
  const l = /* @__PURE__ */ new Map();
  for (let o = 0; o < R.length; o++) {
    const { E: a, nu: s, G: E, rho: N, key: B } = K(o);
    l.has(B) || l.set(B, { E: a, nu: s, G: E, rho: N });
  }
  if (j.length > 0) {
    const o = m.solidIncompatible === false ? "No" : "Yes", a = /* @__PURE__ */ new Map();
    for (const s of j) {
      const { E, nu: N, G: B, rho: T, key: p } = K(s);
      l.has(p) || l.set(p, { E, nu: N, G: B, rho: T }), a.has(p) || a.set(p, `SOL${a.size + 1}`);
    }
    S('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [s, E] of a) S(`   SolidProp=${E}   Material=${s}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${o}   Color=Yellow`);
    D(), S('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const s of j) S(`   Solid=${s + 1}   SolidProp=${a.get(K(s).key)}`);
    D();
  }
  for (const [o, a] of te) l.has(o) || l.set(o, a);
  S('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [o] of l) S(`   Material=${o}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  D(), S('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [o, a] of l) S(`   Material=${o}   UnitWeight=${$(a.rho * 9.80665)}   UnitMass=${$(a.rho)}   E1=${$(a.E)}   G12=${$(a.G)}   U12=${$(a.nu)}   A1=9.9E-06`);
  D(), S('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [o] of l) S(`   Material=${o}   Fc=${$(m.fcExport ?? 27579)}   eFc=${$(m.fcExport ?? 27579)}   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0   CoupModType="Modified Darwin-Pecknold"`);
  return D(), S('TABLE:  "PROGRAM CONTROL"'), S(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${v.force}, ${v.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), D(), S("END TABLE DATA"), S(""), re.join(`\r
`);
}
function $(g) {
  return g === 0 || Math.abs(g) < 1e-15 ? "0" : Math.abs(g) >= 1e6 || Math.abs(g) < 1e-3 && Math.abs(g) > 0 ? g.toExponential(8) : parseFloat(g.toPrecision(10)).toString();
}
function es(g, A, R = 0.05) {
  const P = A.map(([m, v]) => `${(+m).toFixed(4)} ${(+v).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${g}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${R}  SPECTYPE "USER"  `, `  FUNCTION "${g}"  TIMEVAL "${P}"  `];
}
function ts(g) {
  const { name: A, func: R, modalCase: P = "Modal", sfX: m = 9.81, sfY: v = 9.81 } = g, J = [`  LOADCASE "${A}"  TYPE  "Response Spectrum"  MODALCASE  "${P}"  `];
  return m && J.push(`  LOADCASE "${A}"  ACCEL  "U1"  FUNC  "${R}"  SF  ${m}  `), v && J.push(`  LOADCASE "${A}"  ACCEL  "U2"  FUNC  "${R}"  SF  ${v}  `), J;
}
function Pt(g) {
  const { name: A = "Modal", ritz: R = false, nModes: P = 12 } = g;
  return R ? [`  LOADCASE "${A}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${P} MINMODES  1 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${A}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${A}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${A}"  MAXMODES  ${P} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function rs(g) {
  var _a;
  const A = (_a = g.e2kModel) == null ? void 0 : _a.rawSections;
  let R = A && A.size > 0 ? os(A, g.e2kModel) : ns(g);
  return g.seismicNEC && (R = ss(R, g.seismicNEC)), R;
}
function ss(g, A) {
  const R = g.includes(`\r
`) ? `\r
` : `
`, P = g.split(/\r?\n/), m = A.name ?? "NEC", v = es(m, A.points, A.dampRatio ?? 0.05), J = A.modalCase ?? "Modal", re = ts({ name: A.caseName ?? "Sismo NEC", func: m, modalCase: J, sfX: A.sfX, sfY: A.sfY });
  let S = [];
  const D = (Q) => P.some((K) => Q.test(K));
  if (A.modal) {
    const Q = new RegExp(`^\\s*LOADCASE\\s+"${J}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let K = P.length - 1; K >= 0; K--) Q.test(P[K]) && P.splice(K, 1);
    S = Pt({ name: J, ritz: !!A.modal.ritz, nModes: A.modal.nModes });
  } else D(new RegExp(`LOADCASE\\s+"${J}"\\s+TYPE\\s+"Modal`)) || (S = Pt({ name: J }));
  return Ft(P, "FUNCTIONS", v), Ft(P, "LOAD CASES", [...S, ...re]), P.join(R);
}
function Ft(g, A, R) {
  const P = g.findIndex((J) => J.trim() === `$ ${A}`);
  if (P >= 0) {
    g.splice(P + 1, 0, ...R);
    return;
  }
  const m = g.findIndex((J) => J.trim() === "END"), v = m >= 0 ? m : g.length;
  g.splice(v, 0, `$ ${A}`, ...R, "");
}
function os(g, A) {
  const R = [], P = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  R.push("$ File exported from Hekatan Struct Lineal (round-trip)"), R.push("");
  for (const m of P) {
    const v = g.get(m);
    if (!(!v || v.length === 0)) {
      R.push(`$ ${m}`);
      for (const J of v) R.push(J);
      R.push("");
    }
  }
  for (const [m, v] of g) if (!P.includes(m) && v.length !== 0) {
    R.push(`$ ${m}`);
    for (const J of v) R.push(J);
    R.push("");
  }
  return R.push("  END"), R.push("$ END OF MODEL FILE"), R.join(`\r
`);
}
function ns(g) {
  var _a, _b, _c, _d, _e2, _f, _g;
  const { nodes: A, elements: R, nodeInputs: P, elementInputs: m, title: v, units: J } = g, re = g.shellLoads ?? m.shellSurfaceLoads;
  let S;
  re instanceof Map && (S = /* @__PURE__ */ new Map(), re.forEach((e, t) => {
    S.set(t, typeof e == "number" ? { value: e } : e);
  }));
  const D = g.shellAngles ?? m.shellAngles, Q = m.cargaDeArea, K = !!(S && S.size > 0), X = m.selfWeight, j = m.frameLoads, q = (g.weightMode ?? "auto") === "auto" && X !== void 0, te = /* @__PURE__ */ new Map(), le = (e, t) => {
    const n = te.get(e) ?? [0, 0, 0, 0, 0, 0];
    te.set(e, n.map((c, r) => c + t[r]));
  }, ae = /* @__PURE__ */ new Set();
  if (q) {
    if (j) for (const [e, t] of j) {
      const n = R[e];
      if (!n || n.length !== 2) continue;
      const c = A[n[0]], r = A[n[1]], d = [r[0] - c[0], r[1] - c[1], r[2] - c[2]], I = Math.hypot(d[0], d[1], d[2]);
      if (I < 1e-9) continue;
      const u = [d[0] / I, d[1] / I, d[2] / I], F = I * I / 12, H = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]];
      le(n[0], [t[0] * I / 2, t[1] * I / 2, t[2] * I / 2, F * H[0], F * H[1], F * H[2]]), le(n[1], [t[0] * I / 2, t[1] * I / 2, t[2] * I / 2, -F * H[0], -F * H[1], -F * H[2]]), ae.add(e);
    }
    if (X && X > 0) {
      const t = m.endOffsets;
      R.forEach((n, c) => {
        var _a2, _b2, _c2;
        const r = ((_a2 = m.densities) == null ? void 0 : _a2.get(c)) ?? 0;
        if (r) {
          if (n.length === 2) {
            const d = ((_b2 = m.areas) == null ? void 0 : _b2.get(c)) ?? 0, I = A[n[0]], u = A[n[1]], F = [u[0] - I[0], u[1] - I[1], u[2] - I[2]];
            let H = Math.hypot(F[0], F[1], F[2]);
            const L = t == null ? void 0 : t.get(c);
            if (L) {
              const y = Math.hypot(F[0], F[1]);
              y > 1e-9 && Math.abs(Math.atan2(Math.abs(F[2]), y)) * 180 / Math.PI < 20 && (H = Math.max(H - L[0] - L[1], 0));
            }
            const w = d * H * r * 9.80665 * X;
            le(n[0], [0, 0, -w / 2, 0, 0, 0]), le(n[1], [0, 0, -w / 2, 0, 0, 0]);
          } else if (n.length === 4) {
            const d = ((_c2 = m.thicknesses) == null ? void 0 : _c2.get(c)) ?? 0, I = n.map((y) => A[y]);
            let u = 0, F = 0, H = 0;
            for (let y = 0; y < 4; y++) {
              const V = I[y], z = I[(y + 1) % 4];
              u += V[1] * z[2] - V[2] * z[1], F += V[2] * z[0] - V[0] * z[2], H += V[0] * z[1] - V[1] * z[0];
            }
            const L = Math.hypot(u, F, H) / 2, w = d * L * r * 9.80665 * X;
            for (const y of n) le(y, [0, 0, -w / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const oe = (e, t) => {
    const n = te.get(e);
    return [t[0] - ((n == null ? void 0 : n[0]) ?? 0), t[1] - ((n == null ? void 0 : n[1]) ?? 0), t[2] - (K ? (Q == null ? void 0 : Q.get(e)) ?? 0 : 0) - ((n == null ? void 0 : n[2]) ?? 0)];
  }, ie = (e, t) => {
    const n = te.get(e);
    return [(t[3] ?? 0) - ((n == null ? void 0 : n[3]) ?? 0), (t[4] ?? 0) - ((n == null ? void 0 : n[4]) ?? 0), (t[5] ?? 0) - ((n == null ? void 0 : n[5]) ?? 0)];
  }, Ee = "N", Se = "MM", i = [], h = (e) => Math.round(e * 1e4) / 1e4, C = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), W = 1e3, G = 1e3, M = (e) => e * G, l = (e) => e * W, o = (e) => e * W, a = (e) => e * W * G, s = (e) => e * W / G ** 2, E = (e) => e * W / G ** 3, N = /* @__PURE__ */ new Date(), B = `${N.getMonth() + 1}/${N.getDate()}/${N.getFullYear()}  ${N.getHours()}:${String(N.getMinutes()).padStart(2, "0")}:${String(N.getSeconds()).padStart(2, "0")}`;
  i.push(`$ File   "Hekatan_export.e2k"  saved ${B} in ETABS 22.6.0`), i.push(""), i.push("$ PROGRAM INFORMATION"), i.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), i.push(""), i.push("$ CONTROLS"), i.push(`  UNITS  "${Ee}"  "${Se}"  "C"  `), i.push('  TITLE1  "Hekatan Struct Lineal export"  '), v && i.push(`  TITLE2  "${v}"  `), i.push("  PREFERENCE  MERGETOL 0.001"), i.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), i.push("");
  const T = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  A.forEach((e) => {
    T.add(h(e[0])), p.add(h(e[1]));
  });
  const b = [...T].sort((e, t) => e - t), f = [...p].sort((e, t) => e - t);
  i.push("$ GRIDS"), i.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), b.forEach((e, t) => {
    const n = t < 26 ? String.fromCharCode(65 + t) : String.fromCharCode(65 + t % 26).repeat(Math.floor(t / 26) + 1);
    i.push(`  GRID "G1"  LABEL "${n}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), f.forEach((e, t) => {
    i.push(`  GRID "G1"  LABEL "${t + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), i.push("");
  const O = 3, x = 0.5, U = /* @__PURE__ */ new Map();
  A.forEach((e) => {
    const t = h(e[2]);
    U.set(t, (U.get(t) ?? 0) + 1);
  });
  const ee = /* @__PURE__ */ new Set();
  A.forEach((e) => ee.add(h(e[2])));
  const _ = [...ee].sort((e, t) => e - t);
  let k = _.filter((e) => (U.get(e) ?? 0) >= O);
  if (k.length > 1) {
    const e = [k[0]];
    for (const t of k.slice(1)) t - e[e.length - 1] < x ? e[e.length - 1] = t : e.push(t);
    k = e;
  }
  _.length || _.push(0, 3), k.length || (k = [_[0], _[_.length - 1]]), k[0] !== _[0] && k.unshift(_[0]), k[k.length - 1] !== _[_.length - 1] && k.push(_[_.length - 1]);
  const se = [], Z = /* @__PURE__ */ new Map();
  se.push("Base"), Z.set(k[0], "Base");
  for (let e = 1; e < k.length; e++) {
    const t = `Level_${e}`;
    se.push(t), Z.set(k[e], t);
  }
  const ce = (e) => {
    const t = h(e);
    if (Z.has(t)) return { story: Z.get(t), dz: 0 };
    for (let c = 0; c < k.length; c++) if (k[c] >= t) return { story: Z.get(k[c]), dz: h(k[c] - t) };
    const n = k[k.length - 1];
    return { story: Z.get(n), dz: h(n - t) };
  };
  i.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = k.length - 1; e >= 1; e--) i.push(`  STORY "${se[e]}"  HEIGHT ${h(M(k[e] - k[e - 1]))} MASTERSTORY "Yes"  `);
  k.length > 0 && i.push(`  STORY "Base"  ELEV ${h(M(k[0]))} `), i.push(""), R.some((e) => e.length === 4), i.push("$ DIAPHRAGM NAMES"), i.push('  DIAPHRAGM "D1"    TYPE RIGID'), i.push(""), i.push("$ MATERIAL PROPERTIES");
  const Me = 980665e-8, pe = (e) => {
    var _a2, _b2, _c2;
    const t = (_a2 = m.sectionShapes) == null ? void 0 : _a2.get(e);
    if ((t == null ? void 0 : t.type) === "CFT" && t.steelRho > 0) return t.steelRho * 9.80665;
    const n = (_b2 = m.densities) == null ? void 0 : _b2.get(e);
    if (n === void 0) return;
    const c = n > 100 ? n * Me : n * 9.80665, r = (_c2 = m.deckSections) == null ? void 0 : _c2.get(e);
    if (r && r.tc > 0) {
      const d = r.tc + (r.sr > 0 ? r.hr * (r.wrt + r.wrb) / 2 / r.sr : 0);
      return (c * r.tc - r.w) / d;
    }
    return c;
  }, Ae = (e) => {
    var _a2;
    const t = ((_a2 = m.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, n = pe(e);
    return `${t}|${n === void 0 ? "-" : n.toFixed(4)}`;
  }, Le = /* @__PURE__ */ new Set();
  (_a = m.elasticities) == null ? void 0 : _a.forEach((e, t) => Le.add(Ae(t)));
  const ge = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map();
  let Gt = 0, Yt = 0;
  for (const e of Le) {
    const t = parseFloat(e.split("|")[0]), n = e.split("|")[1], c = t >= 1e8, r = c ? `Steel_${++Gt}` : `Conc_${++Yt}`;
    ge.set(e, r), Ie.set(e, c);
    const d = n !== "-" ? parseFloat(n) : c ? 76.97 : 24, I = s(t), u = E(d), F = (() => {
      const w = g.elementInputs.poissonsRatios;
      if (w) {
        for (const [y, V] of w) if (Ae(y) === e) return V;
      }
    })(), H = F !== void 0 ? F : c ? 0.3 : 0.2, L = c ? 117e-7 : 1e-5;
    if (c) {
      i.push(`  MATERIAL  "${r}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${C(u)}`), i.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${h(I)}  U ${H}  A ${L}`);
      const w = 345e3, y = 45e4;
      i.push(`  MATERIAL  "${r}"  FY ${h(s(w))}  FU ${h(s(y))}  FYE ${h(s(w * 1.1))}  FUE ${h(s(y * 1.1))}`);
    } else i.push(`  MATERIAL  "${r}"    TYPE "Concrete"    WEIGHTPERVOLUME ${C(u)}`), i.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${h(I)}  U ${H}  A ${L}`), i.push(`  MATERIAL  "${r}"    FC ${h(s(24e3))}`);
  }
  const rt = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = m.sectionShapes) == null ? void 0 : _b.forEach((n, c) => {
      var _a2;
      if ((n == null ? void 0 : n.type) !== "CFT" || !(n.fillE > 0) || !((((_a2 = m.elasticities) == null ? void 0 : _a2.get(c)) ?? 0) > 0)) return;
      const d = (n.fillRho ?? 2.4) * 9.80665, I = `${n.fillE}|${d.toFixed(4)}`;
      let u = e.get(I);
      u || (u = `ConcFill_${e.size + 1}`, e.set(I, u), i.push(`  MATERIAL  "${u}"    TYPE "Concrete"    WEIGHTPERVOLUME ${C(E(d))}`), i.push(`  MATERIAL  "${u}"    SYMTYPE "Isotropic"  E ${h(s(n.fillE))}  U 0.2  A 1.0e-5`), i.push(`  MATERIAL  "${u}"    FC ${h(s(24e3))}`)), rt.set(c, u);
    });
  }
  i.push(""), i.push("$ FRAME SECTIONS");
  const Ge = /* @__PURE__ */ new Set(), _e = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), Ne = 0.05;
  R.forEach((e, t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const n = (_a2 = m.sectionShapes) == null ? void 0 : _a2.get(t), c = ((_b2 = m.elasticities) == null ? void 0 : _b2.get(t)) ?? 0, r = ge.get(Ae(t)) || "Conc_1", d = Ie.get(Ae(t)) ?? c >= 1e8, I = ((_c2 = m.areas) == null ? void 0 : _c2.get(t)) ?? 0, u = ((_d2 = m.momentsOfInertiaZ) == null ? void 0 : _d2.get(t)) ?? 0, F = ((_e3 = m.momentsOfInertiaY) == null ? void 0 : _e3.get(t)) ?? 0, H = ((_f2 = m.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
    let L = (n == null ? void 0 : n.type) || "rect", w = (n == null ? void 0 : n.h) ?? 0, y = (n == null ? void 0 : n.b) ?? 0, V = (n == null ? void 0 : n.d) ?? 0;
    const z = (n == null ? void 0 : n.tf) ?? 0, ne = (n == null ? void 0 : n.tw) ?? 0;
    if (!n && w <= 0 && y <= 0 && V <= 0 && I > 0 && u > 0 && F > 0) {
      const de = (_g2 = m.cantos) == null ? void 0 : _g2.get(t), Be = (_h = m.anchos) == null ? void 0 : _h.get(t);
      w = de && de > 0 ? de : Math.sqrt(12 * u / I), y = Be && Be > 0 ? Be : I / w, (!isFinite(w) || w < Ne) && (w = Ne), (!isFinite(y) || y < Ne) && (y = Ne), L = "general";
    } else w <= 0 && y <= 0 && V <= 0 && I > 0 && (u > 0 ? (w = Math.sqrt(12 * u / I), y = I / w) : w = y = Math.sqrt(I), (!isFinite(w) || w < Ne) && (w = Ne), (!isFinite(y) || y < Ne) && (y = Ne), L = "rect");
    w <= 0 && y <= 0 && V <= 0 && (w = 0.3, y = 0.3, L = "rect");
    const ze = (n == null ? void 0 : n.name) ? `NAME_${n.name}` : `${L}_${h(w)}_${h(y)}_${h(V)}_${h(z)}_${h(ne)}_${r}`;
    (n == null ? void 0 : n.name) && !Ye.has(ze) && Ye.set(ze, n.name);
    let fe = Ye.get(ze);
    if (!fe) {
      const de = d ? "S" : "C";
      L === "general" ? fe = `${de}_G${Ge.size + 1}` : L === "rect" ? fe = `${de}_R${Math.round(y * 100)}x${Math.round(w * 100)}` : L === "circ" ? fe = `${de}_C_D${Math.round(V * 100)}` : L === "I" ? fe = `${de}_I${Math.round(w * 100)}x${Math.round(y * 100)}` : L === "HSS" ? fe = `${de}_HSS${Math.round(y * 100)}x${Math.round(w * 100)}x${Math.round(ne * 1e3)}` : fe = `${de}_Sec${Ge.size + 1}`, Ye.set(ze, fe);
    }
    if (_e.set(t, fe), Ge.has(fe)) return;
    Ge.add(fe);
    const je = rt.get(t);
    if (L === "CFT" && je && V > 0 && ne > 0 && !(w > 0 && y > 0)) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Filled Steel Pipe"  D ${h(M(V))} T ${h(M(ne))} FILLMATERIAL "${je}"`);
      return;
    }
    if (L === "CFT" && je && w > 0 && y > 0 && ne > 0) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Filled Steel Tube"  D ${h(M(w))} B ${h(M(y))} TF ${h(M(z > 0 ? z : ne))} TW ${h(M(ne))} FILLMATERIAL "${je}"`);
      return;
    }
    const Je = n, Kt = !((Je == null ? void 0 : Je.t2b) > 0) || Math.abs(Je.t2b - y) < 1e-9 && Math.abs((Je.tfb ?? z) - z) < 1e-9;
    if (L === "I" && w > 0 && y > 0 && z > 0 && ne > 0 && Kt) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Steel I/Wide Flange"  D ${h(M(w))} B ${h(M(y))} TF ${h(M(z))} TW ${h(M(ne))} `);
      return;
    }
    if (L === "HSS" && w > 0 && y > 0 && z > 0 && ne > 0) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Steel Tube"  D ${h(M(w))} B ${h(M(y))} TF ${h(M(z))} TW ${h(M(ne))} `);
      return;
    }
    if (L === "C" && w > 0 && y > 0 && z > 0 && ne > 0) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Steel Channel"  D ${h(M(w))} B ${h(M(y))} TF ${h(M(z))} TW ${h(M(ne))} `);
      return;
    }
    if (L === "2L" && w > 0 && y > 0 && z > 0 && ne > 0) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Steel Double Angle"  D ${h(M(w))} B ${h(M(y))} TF ${h(M(z))} TW ${h(M(ne))} DIS ${h(M((Je == null ? void 0 : Je.dis) ?? 0))} `);
      return;
    }
    const Vt = I > 0 && u > 0 && F > 0;
    let $e;
    L === "general" || Vt ? $e = "General" : L === "I" ? $e = "Steel I/Wide Flange" : L === "HSS" ? $e = "Steel Tube" : L === "CFT" ? $e = "Filled Steel Tube" : L === "pipe" ? $e = "Steel Pipe" : L === "L" ? $e = "Steel Angle" : L === "C" ? $e = "Steel Channel" : L === "2C" ? $e = "Steel Double Channel" : L === "circ" ? $e = "Concrete Circle" : $e = "Concrete Rectangular";
    let Oe = `  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "${$e}"`;
    if ($e === "General") {
      const de = ((_i = m.shearAreasZ) == null ? void 0 : _i.get(t)) || I * 5 / 6, Be = ((_j = m.shearAreasY) == null ? void 0 : _j.get(t)) || I * 5 / 6;
      Oe += `  D ${h(M(w))} B ${h(M(y))} AREA ${C(I * 1e6)} AS2 ${C(de * 1e6)} AS3 ${C(Be * 1e6)} I33 ${C(u * 1e12)} I22 ${C(F * 1e12)} TORSION ${C((H || u + F) * 1e12)} S33POS ${C(2 * u / w * 1e9)} S33NEG ${C(2 * u / w * 1e9)} S22POS ${C(2 * F / y * 1e9)} S22NEG ${C(2 * F / y * 1e9)} Z33 ${C(2 * u / w * 1e9)} Z22 ${C(2 * F / y * 1e9)} R33 ${C(Math.sqrt(u / I) * 1e3)} R22 ${C(Math.sqrt(F / I) * 1e3)} `, i.push(Oe);
      return;
    }
    w && (Oe += `  D ${h(M(w))}`), y && (Oe += `  B ${h(M(y))}`), V && !w && (Oe += `  D ${h(M(V))}`), z && (Oe += `  TF ${h(M(z))}`), ne && (Oe += `  TW ${h(M(ne))}`), i.push(Oe);
  }), i.push("");
  const ke = /* @__PURE__ */ new Map();
  let kt = 0;
  A.forEach((e) => {
    const { dz: t } = ce(e[2]), n = `${h(e[0])},${h(e[1])},${t}`;
    ke.has(n) || ke.set(n, `${++kt}`);
  });
  const xe = /* @__PURE__ */ new Map(), Ze = [];
  {
    const e = Bt(A, R, P.springs).nodales, t = /* @__PURE__ */ new Map();
    for (const [n, c] of e) {
      const r = c.map((u, F) => F < 3 ? u * W / G : u * W * G), d = r.map((u) => +u.toPrecision(12)).join("|");
      let I = t.get(d);
      if (!I) {
        I = `SPR${t.size + 1}`, t.set(d, I);
        const u = ["UX", "UY", "UZ", "RX", "RY", "RZ"], F = r.map((H, L) => `${u[L]}  ${+H.toPrecision(12)}`);
        Ze.push(`  POINTSPRING  "${I}"  NONLINEARSPECOPTION  "LINKS"  ${F.join(" ")} `);
      }
      xe.set(n, I);
    }
    Ze.length && (i.push("$ POINT SPRING PROPERTIES"), Ze.forEach((n) => i.push(n)), i.push(""));
  }
  i.push("$ POINT COORDINATES");
  for (const [e, t] of ke) {
    const [n, c, r] = e.split(",").map(Number);
    i.push(r ? `  POINT "${t}"  ${h(M(n))} ${h(M(c))} ${h(M(r))} ` : `  POINT "${t}"  ${h(M(n))} ${h(M(c))} `);
  }
  i.push("");
  const Te = (e) => {
    const t = A[e], { story: n, dz: c } = ce(t[2]), r = `${h(t[0])},${h(t[1])},${c}`;
    return { pt: ke.get(r) || "1", story: n };
  }, lt = (e) => {
    var _a2, _b2, _c2, _d2, _e3, _f2;
    const t = [], n = (_a2 = g.propertyModifiers) == null ? void 0 : _a2.get(e);
    n && n.some((L) => Math.abs(L - 1) > 1e-9) && t.push(`PROPMODIFIERS "${n.map((L) => h(L)).join(" ")}"`);
    const c = (_b2 = m.localAngles) == null ? void 0 : _b2.get(e);
    c !== void 0 && isFinite(c) && Math.abs(c) > 1e-9 && t.push(`ANG ${h(c)}`);
    const r = (_c2 = m.momentReleases) == null ? void 0 : _c2.get(e);
    if (r && r.some((L) => L)) {
      const L = [];
      r.length === 12 ? (r[0] && L.push("PI"), r[1] && L.push("V2I"), r[2] && L.push("V3I"), r[3] && L.push("TI"), r[4] && L.push("M2I"), r[5] && L.push("M3I"), r[6] && L.push("PJ"), r[7] && L.push("V2J"), r[8] && L.push("V3J"), r[9] && L.push("TJ"), r[10] && L.push("M2J"), r[11] && L.push("M3J")) : r.length === 6 && (r[0] && L.push("TI"), r[1] && L.push("M2I"), r[2] && L.push("M3I"), r[3] && L.push("TJ"), r[4] && L.push("M2J"), r[5] && L.push("M3J")), L.length > 0 && t.push(`RELEASE "${L.join(" ")}"`);
    }
    const d = (_d2 = m.insertionPoints) == null ? void 0 : _d2.get(e);
    d && (Math.abs(d[0]) > 1e-9 || Math.abs(d[1]) > 1e-9) && t.push(`LATEROFFSET ${h(M(d[0]))} TRANSOFFSET ${h(M(d[1]))}`);
    const I = (_e3 = m.rigidOffsets) == null ? void 0 : _e3.get(e), u = (_f2 = m.endOffsets) == null ? void 0 : _f2.get(e), F = u ? [u[0], u[1]] : I, H = u && u.length > 2 ? u[2] : 0;
    return F && (Math.abs(F[0]) > 1e-9 || Math.abs(F[1]) > 1e-9) && t.push(`LENGTHOFFI ${h(M(F[0]))} LENGTHOFFJ ${h(M(F[1]))} RIGIDZONE ${h(H)}`), t.length > 0 ? ` ${t.join(" ")} ` : "";
  }, Xe = [], ft = /* @__PURE__ */ new Set(), Ue = /* @__PURE__ */ new Map();
  R.forEach((e, t) => {
    if (e.length !== 2) return;
    const n = bt(A, e);
    if (n === "BEAM") return;
    const c = A[e[0]][2] <= A[e[1]][2] ? e[0] : e[1], r = A[e[0]][2] <= A[e[1]][2] ? e[1] : e[0];
    if (Math.abs(A[c][0] - A[r][0]) > 1e-6 || Math.abs(A[c][1] - A[r][1]) > 1e-6) return;
    const d = Te(c), I = _e.get(t) || `Sec_${t}`, u = `${d.pt}_${I}_${n}`;
    Ue.has(u) || Ue.set(u, []), Ue.get(u).push({ i: t, bot: c, top: r, zBot: h(A[c][2]), zTop: h(A[r][2]), planPt: d.pt, secName: I, type: n });
  }), Ue.forEach((e, t) => {
    e.sort((c, r) => c.zBot - r.zBot);
    let n = 0;
    for (let c = 1; c <= e.length; c++) if (c === e.length || Math.abs(e[c].zBot - e[c - 1].zTop) > 1e-6) {
      const d = e.slice(n, c);
      d.length >= 1 && (Xe.push({ elemIndices: d.map((I) => I.i), planPt: d[0].planPt, bottomNodeIdx: d[0].bot, topNodeIdx: d[d.length - 1].top, secName: d[0].secName, type: d[0].type, nSegments: d.length }), d.forEach((I) => ft.add(I.i))), n = c;
    }
  }), i.push("$ LINE CONNECTIVITIES");
  const Ke = [], ve = (e) => se.indexOf(e), Et = /* @__PURE__ */ new Map(), St = (e, t, n, c, r, d, I, u) => {
    const F = Te(c), H = Te(n);
    u !== void 0 && Et.set(u, { name: e, story: F.story });
    const L = ve(F.story) - ve(H.story);
    L <= 0 ? i.push(`  LINE  "${e}"  BEAM  "${H.pt}"  "${F.pt}"  0`) : i.push(`  LINE  "${e}"  ${t}  "${H.pt}"  "${F.pt}"  ${L}`);
    const w = m.meshAtIntersections === false;
    Ke.push(`  LINEASSIGN  "${e}"  "${F.story}"  SECTION "${r}" ${d} MINNUMSTA ${I} AUTOMESH "${w ? "NO" : "YES"}"  MESHATINTERSECTIONS "${w ? "NO" : "YES"}"  `);
  }, ht = /* @__PURE__ */ new Map();
  Xe.forEach((e, t) => {
    const n = lt(e.elemIndices[0]), c = [];
    let r = [];
    e.elemIndices.forEach((d, I) => {
      r.push(d);
      const [u, F] = R[d], H = A[u][2] >= A[F][2] ? u : F;
      (ce(A[H][2]).dz === 0 || I === e.elemIndices.length - 1) && (c.push(r), r = []);
    }), c.forEach((d) => {
      const [I, u] = R[d[0]], F = A[I][2] <= A[u][2] ? I : u, [H, L] = R[d[d.length - 1]], w = A[H][2] >= A[L][2] ? H : L;
      ve(Te(w).story) - ve(Te(F).story);
      let y = `C${t + 1}`;
      for (let V = 1; ; V++) {
        const z = i.length;
        St(y, e.type, F, w, e.secName, n, d.length);
        const ne = i[z], ct = ht.get(y);
        if (ct === void 0) {
          ht.set(y, ne);
          break;
        }
        if (i.splice(z, i.length - z), ct === ne) break;
        Ke.pop(), y = `C${t + 1}_${V}`;
      }
    });
  }), R.forEach((e, t) => {
    if (e.length !== 2 || ft.has(t)) return;
    const n = bt(A, e), c = _e.get(t) || `Sec_${t}`, r = lt(t), d = A[e[0]][2] <= A[e[1]][2] ? e[0] : e[1], I = A[e[0]][2] <= A[e[1]][2] ? e[1] : e[0];
    St(`E${t + 1}`, n === "BEAM" ? "BRACE" : n, d, I, c, r, 3, t);
  }), i.push("");
  const Pe = g.weightMode ?? "auto", me = /* @__PURE__ */ new Set();
  i.push("$ POINT ASSIGNS"), (_c = P.supports) == null ? void 0 : _c.forEach((e, t) => {
    const n = [];
    if (e[0] && n.push("UX"), e[1] && n.push("UY"), e[2] && n.push("UZ"), e[3] && n.push("RX"), e[4] && n.push("RY"), e[5] && n.push("RZ"), n.length > 0) {
      const c = Te(t), r = c.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", d = xe.has(t) ? ` SPRINGPROP "${xe.get(t)}" ` : "";
      i.push(`  POINTASSIGN  "${c.pt}"  "${c.story}"  RESTRAINT "${n.join(" ")}" ${r}${d} `), me.add(`${c.pt}@${c.story}`);
    }
  });
  for (const [e, t] of xe) {
    const n = Te(e);
    me.has(`${n.pt}@${n.story}`) || (i.push(`  POINTASSIGN  "${n.pt}"  "${n.story}"  SPRINGPROP "${t}" `), me.add(`${n.pt}@${n.story}`));
  }
  const xt = !!(P.diaphragms && [...P.diaphragms.values()].some((e) => e !== 0)), pt = g.diaphragm ?? "auto", Ve = pt === "d1" || pt === "auto" && xt, Fe = /* @__PURE__ */ new Set();
  P.diaphragms && P.diaphragms.forEach((e, t) => {
    e !== 0 && Fe.add(t);
  }), Ve && Fe.size ? Fe.forEach((e) => {
    const t = Te(e), n = `${t.pt}@${t.story}`;
    !me.has(n) && t.story !== "Base" && (i.push(`  POINTASSIGN  "${t.pt}"  "${t.story}"  DIAPH "D1"  `), me.add(n));
  }) : Ve && Xe.forEach((e) => {
    for (const t of e.elemIndices) {
      const [n, c] = R[t], r = A[n][2] >= A[c][2] ? n : c, d = Te(r), I = `${d.pt}@${d.story}`;
      !me.has(I) && d.story !== "Base" && (i.push(`  POINTASSIGN  "${d.pt}"  "${d.story}"  DIAPH "D1"  `), me.add(I));
    }
  }), Pe === "manual" && P.loads && P.loads.forEach((e, t) => {
    const [n, c, r] = oe(t, e);
    if (Math.abs(n) < 1e-10 && Math.abs(c) < 1e-10 && Math.abs(r) < 1e-10) return;
    const d = Te(t), I = `${d.pt}@${d.story}`;
    me.has(I) || (i.push(`  POINTASSIGN  "${d.pt}"  "${d.story}"  DIAPH "DISCONNECTED"  `), me.add(I));
  }), i.push(""), i.push("$ LINE ASSIGNS"), Ke.forEach((e) => i.push(e)), i.push("");
  const he = [], At = m.areaObjects, Tt = /* @__PURE__ */ new Set(), $t = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map();
  At == null ? void 0 : At.forEach((e) => e.cells.forEach((t) => Tt.add(t))), R.forEach((e, t) => {
    if (e.length === 4 || e.length === 3) {
      const n = A[e[0]], c = A[e[1]], r = A[e[2]], d = [c[0] - n[0], c[1] - n[1], c[2] - n[2]], I = [r[0] - n[0], r[1] - n[1], r[2] - n[2]], u = d[1] * I[2] - d[2] * I[1], F = d[2] * I[0] - d[0] * I[2], H = d[0] * I[1] - d[1] * I[0], L = Math.sqrt(u * u + F * F + H * H), w = L > 1e-10 && Math.abs(H) / L < 0.5;
      he.push({ idx: t, el: e, isWall: w }), Tt.has(t) && he.pop();
    }
  });
  const ue = (() => {
    for (const [e, t] of Ie) if (!t) return ge.get(e);
    return ge.values().next().value || "Conc_1";
  })();
  At == null ? void 0 : At.forEach((e, t) => {
    he.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && $t.set(e.cells[0], e.q), e.ang !== void 0 && dt.set(e.cells[0], e.ang);
  });
  const De = "DECK";
  let qe = false;
  const Qe = [], Mt = (e) => {
    const t = g.elementInputs.plateFormulations, n = he.find((r) => r.isWall === e), c = t && n ? t.get(n.idx) : void 0;
    return c === 2 ? "Membrane" : c === 1 ? "ShellThin" : "ShellThick";
  }, It = (e, t) => {
    const n = g.elementInputs.thicknesses, c = he.find((r) => r.isWall === e);
    return (c ? n == null ? void 0 : n.get(c.idx) : void 0) ?? (n == null ? void 0 : n.values().next().value) ?? t;
  }, mt = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], He = (e) => {
    var _a2;
    const n = (_a2 = m.shellModifiers) == null ? void 0 : _a2.get(e);
    if (n && n.length >= 8) return n.slice(0, 8);
    const c = m.membraneModifiers, r = m.bendingModifiers, d = c == null ? void 0 : c.get(e), I = r == null ? void 0 : r.get(e);
    if (d === void 0 && I === void 0) return null;
    const u = d ?? 1, F = I ?? 1;
    return [u, u, u, F, F, F, F, F];
  }, ut = (e, t) => {
    const n = he.filter((I) => I.isWall === t), c = /* @__PURE__ */ new Map();
    for (const I of n) {
      const u = He(I.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      c.set(u.map((F) => h(F)).join(","), u);
    }
    if (c.size === 0) return "";
    c.size > 1 && console.warn(`[e2k] "${e}": ${c.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const r = c.values().next().value, d = mt.map((I, u) => Math.abs(r[u] - 1) > 1e-9 ? `${I} ${h(r[u])}` : "").filter(Boolean);
    return d.length ? `  SHELLPROP  "${e}"  ${d.join(" ")} ` : "";
  }, gt = g.elementInputs.thicknesses, Nt = g.elementInputs.plateFormulations, be = (e) => {
    var _a2;
    const t = gt == null ? void 0 : gt.get(e.idx), n = Nt == null ? void 0 : Nt.get(e.idx), c = He(e.idx), r = (_a2 = g.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), d = r ? [r.tc, r.hr, r.wrt, r.wrb, r.sr, r.w].map((I) => h(I)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${t ?? "-"}|${n ?? "-"}|${c ? c.map((I) => h(I)).join(",") : "-"}|${Ae(e.idx)}|${d}`;
  }, et = (e) => {
    var _a2;
    if ((_a2 = g.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const t = He(e);
    return t ? Math.abs(t[3]) < 1e-9 && Math.abs(t[4]) < 1e-9 : false;
  }, ye = /* @__PURE__ */ new Map();
  let Ut = 0, vt = 0, Ht = 0;
  for (const e of he) {
    const t = be(e);
    if (ye.has(t)) continue;
    const n = e.isWall, c = !n && et(e.idx), r = n ? ++vt : c ? ++Ht : ++Ut, d = Ae(e.idx);
    ye.set(t, { nombre: (n ? "Muro" : c ? De : "Losa") + (r === 1 ? "" : String(r)), isWall: n, mem: c, t: gt == null ? void 0 : gt.get(e.idx), pf: Nt == null ? void 0 : Nt.get(e.idx), idx: e.idx, mat: ge.get(d) ?? ue, acero: Ie.get(d) ?? false });
  }
  const We = (e) => {
    var _a2;
    return ((_a2 = ye.get(be(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, Ot = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", Wt = (e, t) => {
    const n = he.find((d) => be(d) === t), c = n ? He(n.idx) ?? null : null;
    if (!c) return "";
    const r = mt.map((d, I) => Math.abs(c[I] - 1) > 1e-9 ? `${d} ${h(c[I])}` : "").filter(Boolean);
    return r.length ? `  SHELLPROP  "${e}"  ${r.join(" ")} ` : "";
  }, we = he.find((e) => !e.isWall), Lt = he.find((e) => e.isWall), tt = /* @__PURE__ */ new Set();
  we && tt.add(be(we)), Lt && tt.add(be(Lt));
  const Rt = [...ye.entries()].filter(([e]) => !tt.has(e)), st = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = g.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, zt = (e) => e * W / G ** 2, Dt = (e, t) => {
    const n = (c) => C(M(c));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${ue}"  DECKMATERIAL "${ue}"  DECKSLABDEPTH ${n(t.tc)} DECKRIBDEPTH ${n(t.hr)} DECKRIBWIDTHTOP ${n(t.wrt)} DECKRIBWIDTHBOTTOM ${n(t.wrb)} DECKRIBSPACING ${n(t.sr)} DECKSHEARTHICKNESS ${n(76e-5)} DECKUNITWEIGHT ${C(zt(t.w))} SHEARSTUDDIAM ${n(0.019)} SHEARSTUDHEIGHT ${n(0.1)} SHEARSTUDFU 400 `;
  };
  if (he.some((e) => !e.isWall)) {
    qe = !!we && et(we.idx);
    const e = It(false, 0.15);
    if (qe) {
      i.push("$ DECK PROPERTIES");
      const n = [...ye.values()].find((r) => r.nombre === De), c = st(we == null ? void 0 : we.idx);
      (n == null ? void 0 : n.acero) ? i.push(`  SHELLPROP  "${De}"  PROPTYPE  "Slab"  MATERIAL "${n.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(M(e))} `) : c ? i.push(Dt(De, c)) : i.push(`  SHELLPROP  "${De}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(M(e))} `);
    } else i.push("$ SLAB PROPERTIES"), i.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${Mt(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${h(M(e))} `);
    const t = ut(qe ? De : "Losa", false);
    t && i.push(t), i.push("");
  }
  if (he.some((e) => e.isWall)) {
    i.push("$ WALL PROPERTIES");
    const e = It(true, 0.2), t = Mt(true);
    i.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${ue}"  MODELINGTYPE "${t}"  WALLTHICKNESS ${h(M(e))} `);
    const n = ut("Muro", true);
    n && i.push(n), i.push("");
  }
  if (Rt.length) {
    i.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, t] of Rt) {
      const n = t.t ?? (t.isWall ? 0.2 : 0.15);
      i.push(t.isWall ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Wall"  MATERIAL "${t.mat ?? ue}"  MODELINGTYPE "${Ot(t.pf)}"  WALLTHICKNESS ${h(M(n))} ` : t.mem && t.acero ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${t.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(M(n))} ` : t.mem && st(t.idx) ? Dt(t.nombre, st(t.idx)) : t.mem ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(M(n))} ` : `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${Ot(t.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${h(M(n))} `);
      const c = Wt(t.nombre, e);
      c && i.push(c);
    }
    i.push("");
  }
  if (he.length > 0) {
    i.push("$ AREA CONNECTIVITIES");
    const e = [];
    he.forEach((t, n) => {
      const { el: c, isWall: r } = t, d = r ? `W${n + 1}` : `F${n + 1}`, I = r ? "PANEL" : "FLOOR", u = c.map((F) => Te(F));
      if (r) {
        const F = (V) => se.indexOf(V);
        if (new Set(u.map((V) => V.pt)).size === 4) {
          const V = Math.max(...u.map((ne) => F(ne.story))), z = u.map((ne) => V - F(ne.story));
          i.push(`  AREA "${d}"  ${I}  4  "${u[0].pt}"  "${u[1].pt}"  "${u[2].pt}"  "${u[3].pt}"  ${z.join("  ")}  `), e.push(`  AREAASSIGN  "${d}"  "${se[V]}"  SECTION "${We(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const L = A[c[0]][2] <= A[c[2]][2] ? 0 : 2, w = A[c[1]][2] <= A[c[3]][2] ? 1 : 3;
        i.push(`  AREA "${d}"  ${I}  4  "${u[L].pt}"  "${u[w].pt}"  "${u[w].pt}"  "${u[L].pt}"  1  1  0  0  `);
        const y = u[L === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${d}"  "${y}"  SECTION "${We(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const F = u.length, H = (z) => se.indexOf(z), L = Math.max(...u.map((z) => H(z.story))), w = u.map((z) => L - H(z.story)), y = se[L] ?? u[0].story;
        i.push(`  AREA "${d}"  ${I}  ${F}  ` + u.map((z) => `"${z.pt}"`).join("  ") + "  " + w.join("  ") + "  ");
        const V = dt.get(t.idx) ?? (D == null ? void 0 : D.get(t.idx));
        e.push(et(t.idx) ? `  AREAASSIGN  "${d}"  "${y}"  SECTION "${We(t)}"  ANG ${h(V ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${d}"  "${y}"  SECTION "${We(t)}" ${Ve && (!Fe.size || (R[t.idx] ?? []).every((z) => Fe.has(z))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), Qe.push({ name: d, story: y, idx: t.idx });
      }
    }), i.push(""), i.push("$ AREA ASSIGNS"), e.forEach((t) => i.push(t)), i.push("");
  }
  const jt = Pe === "manual" ? 0 : X ?? 1;
  i.push("$ LOAD PATTERNS");
  const Re = ((_d = g.loadPatterns) == null ? void 0 : _d.length) ? g.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: jt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Re) {
    const t = e.type && e.type !== "Other" ? e.type : /^(dne|sdead|scm|superdead)$/i.test(e.name) ? "Super Dead" : /^dead$/i.test(e.name) ? "Dead" : /^(live|viva|l)$/i.test(e.name) ? "Live" : "Other";
    let n;
    t === "Dead" ? n = Pe === "manual" ? 0 : e.selfWeightMultiplier ?? X ?? 1 : (n = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${t}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), i.push(`  LOADPATTERN "${e.name}"  TYPE  "${t}"  SELFWEIGHT  ${n}`);
  }
  i.push("");
  const Ce = g.loadPatternDestino && Re.some((e) => e.name === g.loadPatternDestino) ? g.loadPatternDestino : ((_e2 = Re.find((e) => e.type === "Dead")) == null ? void 0 : _e2.name) ?? Re[0].name, ot = [], nt = /* @__PURE__ */ new Map(), Ct = (e, t) => {
    const n = nt.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let c = 0; c < 6; c++) n[c] += t[c] ?? 0;
    nt.set(e, n);
  }, Jt = Ce === (((_f = Re.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Re[0].name), _t = Pe === "manual" || !Jt || q;
  if (P.loads && P.loads.size > 0 && P.loads.forEach((e, t) => {
    const [n, c, r] = oe(t, e), [d, I, u] = ie(t, e);
    Ct(t, [n, c, _t ? r : 0, d, I, u]);
  }), P.moments && P.moments.size > 0 && P.moments.forEach((e, t) => {
    Ct(t, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), nt.forEach((e, t) => {
    if (e.every((c) => Math.abs(c) <= 1e-10)) return;
    const n = Te(t);
    ot.push(`  POINTLOAD  "${n.pt}"  "${n.story}"  TYPE "FORCE"  LC "${Ce}"  FX ${C(o(e[0]))}  FY ${C(o(e[1]))}  FZ ${C(o(e[2]))}  MX ${C(a(e[3]))}  MY ${C(a(e[4]))}  MZ ${C(a(e[5]))}`);
  }), ot.length > 0 && (i.push("$ POINT OBJECT LOADS"), ot.forEach((e) => i.push(e)), i.push("")), q && ae.size > 0) {
    const e = [];
    for (const t of ae) {
      const n = j.get(t), c = Et.get(t);
      if (!c) continue;
      const r = (d) => C(l(d) / G);
      Math.abs(n[2]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "${n[2] < 0 ? "GRAV" : "Z"}"  LC "${Ce}"  FVAL ${r(Math.abs(n[2]))}`), Math.abs(n[0]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "X"  LC "${Ce}"  FVAL ${r(n[0])}`), Math.abs(n[1]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "Y"  LC "${Ce}"  FVAL ${r(n[1])}`);
    }
    e.length && (i.push("$ FRAME OBJECT LOADS"), e.forEach((t) => i.push(t)), i.push(""));
  }
  if (S && S.size > 0 && Qe.length > 0) {
    const e = [];
    for (const t of Qe) {
      const n = $t.get(t.idx), c = n !== void 0 ? { value: n } : S.get(t.idx);
      if (!c || Math.abs(c.value) < 1e-12) continue;
      const r = c.dir ?? "GRAV", d = r === "GRAV" ? -c.value : c.value;
      e.push(`  AREALOAD  "${t.name}"  "${t.story}"  TYPE "UNIFF"  DIR "${r}"  LC "${c.pattern ?? Ce}"  FVAL ${C(l(d) / (G * G))}`);
    }
    e.length > 0 && (i.push("$ SHELL OBJECT LOADS"), e.forEach((t) => i.push(t)), i.push(""));
  }
  i.push("$ ANALYSIS OPTIONS"), i.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), i.push('  PDELTA  METHOD "NONE"  '), i.push("");
  const at = Pe === "manual";
  i.push("$ MASS SOURCE"), i.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${at ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${at ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "Yes"    LUMPATSTORIES "No"    ISDEFAULT "Yes"  `), at || i.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), i.push(""), i.push("$ LOAD CASES");
  const Zt = ((_g = g.loadCases) == null ? void 0 : _g.length) ? g.loadCases : Re.map((e) => ({ name: e.name, type: "Linear Static", patterns: [{ pattern: e.name, scaleFactor: 1 }] }));
  for (const e of Zt) {
    i.push(`  LOADCASE "${e.name}"  TYPE  "${e.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const t of e.patterns ?? []) i.push(`  LOADCASE "${e.name}"  LOADPAT  "${t.pattern}"  SF ${t.scaleFactor} `);
  }
  const Xt = g.modalModes ?? 12;
  i.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), i.push(`  LOADCASE "Modal"  MAXMODES ${Xt}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), i.push("");
  const it = g.loadCombinations;
  if (it && it.length) {
    i.push("$ LOAD COMBINATIONS");
    for (const e of it) {
      i.push(`  COMBO "${e.name}"  TYPE "${e.type ?? "Linear Add"}"  `);
      for (const t of e.cases ?? []) i.push(`  COMBO "${e.name}"  LOADCASE  "${t.case}"  SF ${t.scaleFactor} `);
    }
    i.push("");
  }
  return i.push("  END"), i.push("$ END OF MODEL FILE"), i.join(`\r
`);
}
function bt(g, A) {
  const R = g[A[0]], P = g[A[1]], m = Math.abs(P[2] - R[2]), v = Math.sqrt((P[0] - R[0]) ** 2 + (P[1] - R[1]) ** 2), J = m > v * 0.5;
  return J && v > 0.01 ? "BRACE" : J ? "COLUMN" : "BEAM";
}
export {
  cs as a,
  rs as e,
  Bt as m,
  is as p
};
