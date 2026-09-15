function G(O) {
  return O && parseFloat(O) || 0;
}
function Bt(O) {
  const $ = /* @__PURE__ */ new Map(), D = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let F;
  for (; (F = D.exec(O)) !== null; ) $.set(F[1], F[2] !== void 0 ? F[2] : F[3]);
  return $;
}
function as(O) {
  const $ = O.split(/\r?\n/);
  return $.some((F) => F.trim().startsWith("TABLE:")) ? Vt($) : qt($);
}
function Vt(O) {
  var _a, _b, _c, _d, _e, _f;
  const $ = [];
  let D = "";
  for (const Y of O) {
    const u = Y.trimEnd();
    u.endsWith("_") ? D += u.slice(0, -1) + " " : (D += u, $.push(D), D = "");
  }
  D && $.push(D);
  const F = { force: "KN", length: "m" };
  let g = "UX,UY,UZ,RX,RY,RZ";
  const v = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), te = [], q = [], ne = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map(), ce = [], ie = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), c = [], h = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map();
  let W = "";
  for (const Y of $) {
    const u = Y.trim();
    if (!u || u.startsWith(";") || u.startsWith("File ")) continue;
    if (u.startsWith("TABLE:")) {
      const p = u.match(/TABLE:\s+"(.+?)"/);
      W = p ? p[1].toUpperCase() : "";
      continue;
    }
    if (u === "END TABLE DATA") {
      W = "";
      continue;
    }
    const f = Bt(u);
    switch (W) {
      case "PROGRAM CONTROL": {
        const p = f.get("CurrUnits");
        if (p) {
          const w = p.split(",").map((m) => m.trim());
          w[0] && (F.force = w[0]), w[1] && (F.length = w[1]);
        }
        break;
      }
      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const p = f.get("Material");
        p && !v.has(p) && v.set(p, { E: 0, nu: 0, G: 0 });
        break;
      }
      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const p = f.get("Material");
        if (p) {
          const w = v.get(p) || { E: 0, nu: 0, G: 0 };
          w.E = G(f.get("E1")), w.G = G(f.get("G12")), w.nu = G(f.get("U12")), w.density = G(f.get("UnitMass")), v.set(p, w);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const p = f.get("Material");
        p && v.has(p) && (v.get(p).fy = G(f.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const p = f.get("SectionName");
        p && A.set(p, { material: f.get("Material") || "", shape: f.get("Shape") || "Rectangular", D: G(f.get("t3")), B: G(f.get("t2")), TF: G(f.get("tf")), TW: G(f.get("tw")), T2B: G(f.get("t2b")), TFB: G(f.get("tfb")), DIS: G(f.get("dis")), A: G(f.get("Area")), Iz: G(f.get("I33")), Iy: G(f.get("I22")), J: G(f.get("TorsConst")), As2: G(f.get("AS2")), As3: G(f.get("AS3")) });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const p = f.get("SectionName");
        p && _.set(p, { h: G(f.get("Height")), b: G(f.get("Width")), t: G(f.get("WebThick")) || G(f.get("FlngThick")), tf: G(f.get("FlngThick")) || G(f.get("WebThick")), mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const p = f.get("SectionName");
        p && _.set(p, { h: 0, b: 0, D: G(f.get("OuterDiam")), t: G(f.get("WallThick")), mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const p = f.get("SectionName");
        p && se.set(p, { mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const p = f.get("SectionName");
        p && se.set(p, { mat: f.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const p = f.get("Section");
        p && k.set(p, { material: f.get("Material") || "", type: f.get("Type") || "Shell", thickness: G(f.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const p = f.get("Joint");
        if (p) {
          const w = G(f.get("XorR")), m = G(f.get("Y")), l = G(f.get("Z"));
          ee.set(p, [w, m, l]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const p = f.get("Frame"), w = f.get("JointI"), m = f.get("JointJ");
        p && w && m && te.push({ name: p, j1: w, j2: m });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const p = f.get("Area");
        if (p) {
          const w = parseInt(f.get("NumJoints") || "4"), m = [];
          for (let l = 1; l <= w; l++) {
            const n = f.get(`Joint${l}`);
            n && m.push(n);
          }
          m.length >= 3 && q.push({ name: p, joints: m });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const p = f.get("Joint");
        if (p) {
          const w = [((_a = f.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = f.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = f.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = f.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = f.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = f.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          ne.set(p, w);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const p = f.get("Joint");
        p && ae.set(p, ["U1", "U2", "U3", "R1", "R2", "R3"].map((w) => parseFloat(f.get(w) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const p = f.get("Frame"), w = f.get("AnalSect");
        p && w && re.set(p, w);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const p = f.get("Area"), w = f.get("Section");
        p && w && le.set(p, w);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const p = f.get("Frame"), w = f.get("Dir"), m = G(f.get("FOverLA"));
        if (p && w && m) {
          const l = { X: 0, Y: 1, Z: 2 }[w];
          if (l !== void 0) {
            const n = Me.get(p) ?? [0, 0, 0];
            n[l] += m, Me.set(p, n);
          }
        }
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const p = f.get("Solid");
        if (p) {
          const w = [];
          for (let m = 1; m <= 8; m++) {
            const l = f.get(`Joint${m}`);
            l && w.push(l);
          }
          w.length === 8 && c.push({ name: p, joints: w });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const p = f.get("SolidProp");
        p && h.set(p, { material: f.get("Material") || "", incomp: (f.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const p = f.get("Solid"), w = f.get("SolidProp");
        p && w && P.set(p, w);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const p = f.get("Area");
        p && pe.set(p, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((w) => f.has(w) ? G(f.get(w)) : 1));
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const p = f.get("Frame");
        p && Ee.set(p, G(f.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const p = f.get("Frame");
        p && ie.set(p, [G(f.get("LengthI")), G(f.get("LengthJ")), G(f.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const p = f.get("Joint");
        p && ce.push({ joint: p, fx: G(f.get("F1")), fy: G(f.get("F2")), fz: G(f.get("F3")), mx: G(f.get("M1")), my: G(f.get("M2")), mz: G(f.get("M3")) });
        break;
      }
    }
  }
  return Gt(F, g, v, A, k, ee, te, q, ne, re, le, ce, ie, Ee, pe, Me, c, h, P, _, se, ae);
}
function qt(O) {
  const $ = { force: "KN", length: "m" };
  let D = "UX,UY,UZ,RX,RY,RZ";
  const F = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), se = [], A = [], k = /* @__PURE__ */ new Map(), ee = [], te = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), re = [], le = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map();
  let ie = "", Ee = "";
  for (const c of O) {
    const h = c.trim();
    if (!h || h.startsWith(";")) continue;
    if (!c.startsWith(" ") && !c.startsWith("	")) {
      const Y = h.toUpperCase();
      if (Y === "END") break;
      Y.startsWith("SHELL SECTION") ? ie = "SHELL SECTION" : Y.startsWith("FRAME SECTION") ? ie = "FRAME SECTION" : ie = Y.split(/\s+/)[0];
      continue;
    }
    const P = Bt(h), W = h.split(/\s+/);
    switch (ie) {
      case "SYSTEM": {
        const Y = P.get("DOF");
        Y && (D = Y);
        const u = P.get("LENGTH");
        u && ($.length = u);
        const f = P.get("FORCE");
        f && ($.force = f);
        break;
      }
      case "JOINT": {
        const Y = W[0];
        _.set(Y, [G(P.get("X")), G(P.get("Y")), G(P.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const Y = P.get("ADD"), u = P.get("DOF");
        if (Y && u) {
          const f = u.split(","), p = [false, false, false, false, false, false];
          for (const w of f) {
            const m = w.toUpperCase();
            (m === "UX" || m === "U1") && (p[0] = true), (m === "UY" || m === "U2") && (p[1] = true), (m === "UZ" || m === "U3") && (p[2] = true), (m === "RX" || m === "R1") && (p[3] = true), (m === "RY" || m === "R2") && (p[4] = true), (m === "RZ" || m === "R3") && (p[5] = true);
          }
          k.set(Y, p);
        }
        break;
      }
      case "MATERIAL": {
        const Y = P.get("NAME");
        if (Y) Ee = Y, F.set(Y, { E: 0, nu: 0, G: 0 });
        else if (Ee) {
          const u = F.get(Ee), f = P.get("E");
          f && (u.E = G(f));
          const p = P.get("U");
          p && (u.nu = G(p)), u.G = u.E / (2 * (1 + u.nu));
          const w = P.get("M");
          w && (u.density = G(w));
        }
        break;
      }
      case "SHELL": {
        const Y = W[0], u = P.get("J");
        P.get("SEC"), u && A.push({ name: Y, joints: u.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const Y = P.get("NAME");
        Y && v.set(Y, { material: P.get("MAT") || "", type: P.get("TYPE") || "Shell", thickness: G(P.get("TH")) });
        break;
      }
      case "FRAME": {
        const Y = W[0], u = P.get("J");
        if (u) {
          const f = u.split(",");
          f.length >= 2 && se.push({ name: Y, j1: f[0], j2: f[1] });
        }
        break;
      }
      case "LOAD": {
        const Y = P.get("ADD");
        Y && ee.push({ joint: Y, fx: G(P.get("UX")), fy: G(P.get("UY")), fz: G(P.get("UZ")), mx: G(P.get("MX")), my: G(P.get("MY")), mz: G(P.get("MZ")) });
        break;
      }
    }
  }
  return Gt($, D, F, g, v, _, se, A, k, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), ee, te, q, ne, ae, re, le, ce);
}
function Gt(O, $, D, F, g, v, _, se, A, k, ee, te, q = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = [], ce = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), Ee, pe, Me = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const c = [], h = /* @__PURE__ */ new Map(), P = [];
  for (const [o, E] of v) h.set(o, P.length), c.push(o), P.push(E);
  const W = [], Y = [], u = /* @__PURE__ */ new Map();
  for (const o of _) {
    const E = h.get(o.j1), L = h.get(o.j2);
    if (E !== void 0 && L !== void 0) {
      const U = W.length;
      W.push([E, L]), Y.push(o.name);
      const N = k.get(o.name);
      N && u.set(U, N);
    }
  }
  const f = W.length;
  for (const o of se) {
    const E = o.joints.map((L) => h.get(L)).filter((L) => L !== void 0);
    if (E.length >= 3) {
      const L = W.length;
      W.push(E), Y.push(o.name);
      const U = ee.get(o.name);
      U && u.set(L, U);
    }
  }
  const p = W.length - f, w = [];
  for (const o of le) {
    const E = o.joints.map((N) => h.get(N));
    if (E.some((N) => N === void 0)) continue;
    const L = W.length;
    W.push([E[0], E[1], E[3], E[2], E[4], E[5], E[7], E[6]]), Y.push(o.name), w.push(L);
    const U = ie.get(o.name);
    U && u.set(L, U);
  }
  const m = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, l = /* @__PURE__ */ new Map(), n = D.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let o = 0; o < W.length; o++) {
    const E = u.get(o), L = E ? F.get(E) : null, U = E ? g.get(E) : null;
    if (L || W[o].length === 2) {
      const N = L || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, z = D.get(N.material) || n, S = z.E || n.E, j = z.nu || 0.3, Z = z.G || S / (2 * (1 + j));
      m.elasticities.set(o, S), m.shearModuli.set(o, Z), m.areas.set(o, N.A || N.D * N.B), m.momentsOfInertiaZ.set(o, N.Iz || N.B * N.D ** 3 / 12), m.momentsOfInertiaY.set(o, N.Iy || N.D * N.B ** 3 / 12), m.torsionalConstants.set(o, N.J || 0), m.densities.set(o, z.density || 0), N.As2 && (m.shearAreasZ ?? (m.shearAreasZ = /* @__PURE__ */ new Map()), m.shearAreasZ.set(o, N.As2)), N.As3 && (m.shearAreasY ?? (m.shearAreasY = /* @__PURE__ */ new Map()), m.shearAreasY.set(o, N.As3));
      const B = q.get(Y[o]);
      B && (m.endOffsets ?? (m.endOffsets = /* @__PURE__ */ new Map()), m.endOffsets.set(o, B));
      const Q = ne.get(Y[o]);
      Q && (m.localAngles ?? (m.localAngles = /* @__PURE__ */ new Map()), m.localAngles.set(o, Q));
      const J = N;
      ((_a = N.shape) == null ? void 0 : _a.includes("Wide Flange")) || N.shape === "I" ? l.set(o, { type: "I", b: N.B, h: N.D, ...J.TF > 0 && J.TW > 0 ? { tf: J.TF, tw: J.TW, t2b: J.T2B > 0 ? J.T2B : N.B, tfb: J.TFB > 0 ? J.TFB : J.TF } : {}, name: E || "I-section" }) : /box|tube/i.test(N.shape ?? "") && J.TF > 0 && J.TW > 0 ? l.set(o, { type: "HSS", b: N.B, h: N.D, tf: J.TF, tw: J.TW, name: E }) : /^channel$/i.test(N.shape ?? "") && J.TF > 0 && J.TW > 0 ? l.set(o, { type: "C", b: N.B, h: N.D, tf: J.TF, tw: J.TW, name: E }) : /double angle/i.test(N.shape ?? "") && J.TF > 0 && J.TW > 0 ? l.set(o, { type: "2L", b: N.B, h: N.D, tf: J.TF, tw: J.TW, dis: J.DIS || 0, name: E }) : l.set(o, { type: "rect", b: N.B, h: N.D });
      const X = E ? Ee == null ? void 0 : Ee.get(E) : void 0;
      if (X && X.t > 0 && (X.b > 0 && X.h > 0 || (X.D ?? 0) > 0)) {
        const he = E ? pe == null ? void 0 : pe.get(E) : void 0, fe = he && ((_b = D.get(he.mat)) == null ? void 0 : _b.E) || 0;
        l.set(o, X.D ? { type: "CFT", d: X.D, tw: X.t, name: E, ...fe > 0 ? { fillE: fe } : {} } : { type: "CFT", b: X.b, h: X.h, tw: X.t, ...X.tf && X.tf !== X.t ? { tf: X.tf } : {}, name: E, ...fe > 0 ? { fillE: fe } : {} });
      }
    } else if (U) {
      const N = D.get(U.material) || n, z = N.E || n.E, S = N.nu || 0.2, j = N.G || z / (2 * (1 + S));
      m.elasticities.set(o, z), m.shearModuli.set(o, j), m.thicknesses.set(o, U.thickness), m.poissonsRatios.set(o, S), m.plateFormulations ?? (m.plateFormulations = /* @__PURE__ */ new Map()), m.plateFormulations.set(o, /thin/i.test(U.type) ? 1 : 0);
      const Z = /membrane/i.test(U.type), B = ae.get(Y[o]), Q = B && Z ? [B[0], B[1], B[2], 0, 0, 0, 0, 0] : B;
      Q ? (m.shellModifiers ?? (m.shellModifiers = /* @__PURE__ */ new Map()), m.shellModifiers.set(o, Q), m.membraneModifiers ?? (m.membraneModifiers = /* @__PURE__ */ new Map()), m.membraneModifiers.set(o, Q[0]), m.bendingModifiers ?? (m.bendingModifiers = /* @__PURE__ */ new Map()), m.bendingModifiers.set(o, Q[3])) : Z && (m.membraneModifiers ?? (m.membraneModifiers = /* @__PURE__ */ new Map()), m.membraneModifiers.set(o, 1), m.bendingModifiers ?? (m.bendingModifiers = /* @__PURE__ */ new Map()), m.bendingModifiers.set(o, 0)), m.densities.set(o, N.density || 0);
    }
  }
  if (w.length) {
    let o = false;
    for (const E of w) {
      const L = ce.get(u.get(E) || ""), U = L && D.get(L.material) || n, N = U.E || n.E, z = U.nu || 0.2;
      m.elasticities.set(E, N), m.poissonsRatios.set(E, z), m.shearModuli.set(E, U.G || N / (2 * (1 + z))), m.densities.set(E, U.density || 0), (L == null ? void 0 : L.incomp) && (o = true);
    }
    m.solidIncompatible = o;
  }
  const a = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [o, E] of A) {
    const L = h.get(o);
    L !== void 0 && a.supports.set(L, E);
  }
  {
    const o = [];
    for (const [E, L] of Me) {
      const U = h.get(E);
      U !== void 0 && L.forEach((N, z) => {
        N > 0 && o.push({ node: U, dof: z, k: N });
      });
    }
    o.length && (a.springs = o);
  }
  for (const [o, E] of re) {
    const L = Y.indexOf(o);
    if (L < 0 || W[L].length !== 2) continue;
    m.frameLoads ?? (m.frameLoads = /* @__PURE__ */ new Map()), m.frameLoads.set(L, E);
    const U = P[W[L][0]], N = P[W[L][1]], z = [N[0] - U[0], N[1] - U[1], N[2] - U[2]], S = Math.hypot(z[0], z[1], z[2]);
    if (S < 1e-9) continue;
    const j = [z[0] / S, z[1] / S, z[2] / S], Z = S * S / 12, B = [j[1] * E[2] - j[2] * E[1], j[2] * E[0] - j[0] * E[2], j[0] * E[1] - j[1] * E[0]], Q = (J, X) => {
      const he = a.loads.get(J) || [0, 0, 0, 0, 0, 0];
      for (let fe = 0; fe < 6; fe++) he[fe] += X[fe];
      a.loads.set(J, he);
    };
    Q(W[L][0], [E[0] * S / 2, E[1] * S / 2, E[2] * S / 2, Z * B[0], Z * B[1], Z * B[2]]), Q(W[L][1], [E[0] * S / 2, E[1] * S / 2, E[2] * S / 2, -Z * B[0], -Z * B[1], -Z * B[2]]);
  }
  for (const o of te) {
    const E = h.get(o.joint);
    if (E !== void 0) {
      const L = a.loads.get(E) || [0, 0, 0, 0, 0, 0];
      L[0] += o.fx, L[1] += o.fy, L[2] += o.fz, L[3] += o.mx, L[4] += o.my, L[5] += o.mz, a.loads.set(E, L);
    }
  }
  return { units: O, dof: $, materials: D, frameSections: F, shellSections: g, nodes: P, nodeNames: c, nodeNameToIdx: h, elements: W, elementNames: Y, elementSections: u, nodeInputs: a, elementInputs: m, sectionShapes: l, info: { nNodes: P.length, nFrames: f, nShells: p, title: `SAP2000 (${f} frames, ${p} shells)` } };
}
function is(O) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: $, elements: D, nodeInputs: F, elementInputs: g } = O, v = { force: "KN", length: "m" };
  O.units && (O.units.force !== "KN" || O.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${O.units.force}, ${O.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const _ = O.title || "Awatif Model", se = [], A = (l) => se.push(l), k = () => se.push(" ");
  A(`File ${_}.$2k was saved on m/d/yy at h:mm:ss`), k(), A('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), A("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), k();
  const ee = [], te = (l) => {
    var _a2, _b2, _c2, _d2, _e2;
    const n = ((_a2 = g.elasticities) == null ? void 0 : _a2.get(l)) || 0, a = (_b2 = g.poissonsRatios) == null ? void 0 : _b2.get(l), o = ((_c2 = g.shearModuli) == null ? void 0 : _c2.get(l)) || 0, E = a !== void 0 ? a : n > 0 && o > 0 ? Math.max(0, Math.min(0.5, n / (2 * o) - 1)) : 0.2, L = o > 0 ? o : n > 0 ? n / (2 * (1 + E)) : 0, U = (_d2 = g.sectionShapes) == null ? void 0 : _d2.get(l), N = (U == null ? void 0 : U.type) === "CFT" && U.steelRho > 0 ? U.steelRho : ((_e2 = g.densities) == null ? void 0 : _e2.get(l)) || 0, z = N > 0 ? `_r${+N.toPrecision(6)}` : "_r0";
    return { E: n, nu: E, G: L, rho: N, key: `MAT_${Math.round(n)}_n${E.toFixed(4)}${z}` };
  }, q = [], ne = [];
  if (D.forEach((l, n) => {
    l.length === 2 ? ee.push(n) : l.length === 8 ? ne.push(n) : q.push(n);
  }), ee.length > 0) {
    A('TABLE:  "CONNECTIVITY - FRAME"');
    for (const l of ee) {
      const n = D[l];
      A(`   Frame=${l + 1}   JointI=${n[0] + 1}   JointJ=${n[1] + 1}   IsCurved=No`);
    }
    k();
  }
  if (q.length > 0) {
    A('TABLE:  "CONNECTIVITY - AREA"');
    for (const l of q) {
      const n = D[l], a = n.map((o, E) => `Joint${E + 1}=${o + 1}`).join("   ");
      A(`   Area=${l + 1}   NumJoints=${n.length}   ${a}`);
    }
    k();
  }
  if (ne.length > 0) {
    A('TABLE:  "CONNECTIVITY - SOLID"');
    for (const l of ne) {
      const n = D[l], a = [n[0], n[1], n[3], n[2], n[4], n[5], n[7], n[6]];
      A(`   Solid=${l + 1}   ${a.map((o, E) => `Joint${E + 1}=${o + 1}`).join("   ")}`);
    }
    k();
  }
  A('TABLE:  "COORDINATE SYSTEMS"'), A("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), k(), A('TABLE:  "DATABASE FORMAT TYPES"'), A("   UnitsCurr=Yes   OverrideE=No"), k();
  const ae = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map();
  for (const l of ee) {
    const n = ((_a = g.areas) == null ? void 0 : _a.get(l)) || 0, a = ((_b = g.momentsOfInertiaZ) == null ? void 0 : _b.get(l)) || 0, o = ((_c = g.momentsOfInertiaY) == null ? void 0 : _c.get(l)) || 0, E = ((_d = g.torsionalConstants) == null ? void 0 : _d.get(l)) || 0, L = ((_e = g.elasticities) == null ? void 0 : _e.get(l)) || 0, U = te(l).key, N = ((_f = g.shearAreasZ) == null ? void 0 : _f.get(l)) ?? 0, z = ((_g = g.shearAreasY) == null ? void 0 : _g.get(l)) ?? 0, S = (_h = g.sectionShapes) == null ? void 0 : _h.get(l);
    let j;
    const Z = (S == null ? void 0 : S.type) === "CFT" && S.d > 0 && S.tw > 0 && S.tw < S.d / 2 && !(S.b > 0 && S.h > 0);
    if (O.cftAs !== "general" && (S == null ? void 0 : S.type) === "CFT" && L > 0 && (Z || S.b > 0 && S.h > 0 && S.tw > 0 && S.tw < Math.min(S.b, S.h) / 2)) {
      const X = Z ? S.d - 2 * S.tw : 0, he = Z ? 0 : S.b - 2 * S.tw, fe = Z ? 0 : S.h - 2 * (S.tf ?? S.tw), me = Z ? Math.PI * (S.d * S.d - X * X) / 4 : S.b * S.h - he * fe, Ye = Z ? Math.PI * X * X / 4 : he * fe, de = (S.fillE > 0 ? S.fillE / L : Math.max(0.01, Math.min(1, (n - me) / Ye))) * L, De = 0.2, ke = S.fillRho ?? 2.4, Oe = `FILL_${Math.round(de)}_r${ke}`;
      re.has(Oe) || re.set(Oe, { E: de, nu: De, G: de / (2 * (1 + De)), rho: ke }), j = Z ? { b: S.d, h: S.d, t: S.tw, Ec: de, nuC: De, matFill: Oe, D: S.d } : { b: S.b, h: S.h, t: S.tw, tf: S.tf ?? S.tw, Ec: de, nuC: De, matFill: Oe };
    }
    let B;
    !j && (S == null ? void 0 : S.type) === "I" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 ? B = { kind: "I", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw, t2b: S.t2b ?? S.b, tfb: S.tfb ?? S.tf } : !j && (S == null ? void 0 : S.type) === "HSS" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 ? B = { kind: "Box", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw } : !j && (S == null ? void 0 : S.type) === "C" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 ? B = { kind: "C", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw } : !j && (S == null ? void 0 : S.type) === "2L" && S.h > 0 && S.b > 0 && S.tf > 0 && S.tw > 0 && (B = { kind: "2L", t3: S.h, t2: S.b, tf: S.tf, tw: S.tw, dis: S.dis ?? 0 });
    const Q = `A${n.toPrecision(6)}_Iz${a.toPrecision(6)}_s${N.toPrecision(6)}_${z.toPrecision(6)}${j ? j.D ? `_SDC${j.D}x${j.t}` : `_SD${j.b}x${j.h}x${j.t}` : ""}${B ? `_P${B.kind}${B.t3}x${B.t2}x${B.tf}x${B.tw}x${B.t2b ?? ""}x${B.tfb ?? ""}x${B.dis ?? ""}` : ""}`;
    if (!ae.has(Q)) {
      let X = 0.3, he = 0.3;
      n > 0 && a > 0 && (X = Math.sqrt(12 * a / n), he = n / X), ae.set(Q, { A: n, Iz: a, Iy: o, J: E, b: he, h: X, matKey: U, As2: N > 0 ? N : n * 5 / 6, As3: z > 0 ? z : n * 5 / 6, sd: j, param: B });
    }
    const J = [...ae.keys()].indexOf(Q) + 1;
    le.set(l, `SEC${J}`);
  }
  if (ee.length > 0) {
    A('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const l of ee) {
      const n = le.get(l) || "SEC1";
      A(`   Frame=${l + 1}   AutoSelect=N.A.   AnalSect=${n}   MatProp=Default`);
    }
    k();
  }
  if (ae.size > 0) {
    A('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let l = 0;
    for (const [, n] of ae) {
      if (l++, n.sd) {
        A(`   SectionName=SEC${l}   Material=${n.matKey}   Shape="SD Section"   Area=${I(n.A)}   TorsConst=${I(n.J)}   I33=${I(n.Iz)}   I22=${I(n.Iy)}   I23=0   AS2=${I(n.As2)}   AS3=${I(n.As3)} _`), A("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      if (n.param) {
        const a = n.param, o = a.kind === "I" ? `Shape="I/Wide Flange"   t3=${I(a.t3)}   t2=${I(a.t2)}   tf=${I(a.tf)}   tw=${I(a.tw)}   t2b=${I(a.t2b)}   tfb=${I(a.tfb)}` : a.kind === "C" ? `Shape=Channel   t3=${I(a.t3)}   t2=${I(a.t2)}   tf=${I(a.tf)}   tw=${I(a.tw)}` : a.kind === "2L" ? `Shape="Double Angle"   t3=${I(a.t3)}   t2=${I(a.t2)}   SngAngWid=${I((a.t2 - (a.dis ?? 0)) / 2)}   tf=${I(a.tf)}   tw=${I(a.tw)}   dis=${I(a.dis ?? 0)}` : `Shape=Box/Tube   t3=${I(a.t3)}   t2=${I(a.t2)}   tf=${I(a.tf)}   tw=${I(a.tw)}`;
        A(`   SectionName=SEC${l}   Material=${n.matKey}   ${o}   FilletRadius=0   Area=${I(n.A)}   TorsConst=${I(n.J)}   I33=${I(n.Iz)}   I22=${I(n.Iy)}   I23=0   AS2=${I(n.As2)}   AS3=${I(n.As3)} _`), A("        Color=Red   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      A(`   SectionName=SEC${l}   Material=${n.matKey}   Shape=General   t3=${I(n.h)}   t2=${I(n.b)}   Area=${I(n.A)}   TorsConst=${I(n.J)}   I33=${I(n.Iz)}   I22=${I(n.Iy)}   I23=0   AS2=${I(n.As2)}   AS3=${I(n.As3)} _`), A("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    k();
  }
  const ce = [...ae.values()].map((l, n) => ({ sec: l, name: `SEC${n + 1}` })).filter((l) => l.sec.sd);
  if (ce.length > 0) {
    A('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: a } of ce) A(`   SectionName=${a}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    k();
    const l = ce.filter((a) => !a.sec.sd.D), n = ce.filter((a) => a.sec.sd.D);
    if (l.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: a, name: o } of l) {
        const E = a.sd;
        A(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${a.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${I(E.h)}   Width=${I(E.b)}   FlngThick=${I(E.tf ?? E.t)}   WebThick=${I(E.t)}   Rotation=0 _`), A('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      k();
    }
    if (n.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: a, name: o } of n) {
        const E = a.sd;
        A(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${a.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${I(E.D)}   WallThick=${I(E.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), A("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      k();
    }
    if (l.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: a, name: o } of l) {
        const E = a.sd;
        A(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${E.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${I(E.h - 2 * (E.tf ?? E.t))}   Width=${I(E.b - 2 * E.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), A("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      k();
    }
    if (n.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: a, name: o } of n) {
        const E = a.sd;
        A(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${E.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${I(E.D - 2 * E.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      k();
    }
    A('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: a } of ce) A(`   SectionName=${a}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    k();
  }
  {
    const l = ee.filter((n) => {
      var _a2;
      const a = (_a2 = g.localAngles) == null ? void 0 : _a2.get(n);
      return a !== void 0 && isFinite(a) && Math.abs(a) > 1e-9;
    });
    if (l.length > 0) {
      A('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const n of l) A(`   Frame=${n + 1}   Angle=${I(g.localAngles.get(n))}   AdvanceAxes=No`);
      k();
    }
  }
  {
    const l = g.endOffsets, n = ee.filter((a) => {
      const o = l == null ? void 0 : l.get(a);
      return !!o && (Math.abs(o[0]) > 1e-9 || Math.abs(o[1]) > 1e-9);
    });
    if (n.length > 0) {
      A('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const a of n) {
        const o = l.get(a);
        A(`   Frame=${a + 1}   Type=User   LengthI=${I(o[0])}   LengthJ=${I(o[1])}   RigidFactor=${I(o.length > 2 ? o[2] : 0)}`);
      }
      k();
    }
  }
  const ie = !!O.layeredSection && q.length > 0, Ee = O.layeredSection, pe = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), c = g.shellModifiers, h = g.membraneModifiers, P = g.bendingModifiers, W = (l) => !(c == null ? void 0 : c.has(l)) && Math.abs((P == null ? void 0 : P.get(l)) ?? 1) < 1e-9;
  if (!ie) for (const l of q) {
    const n = ((_i = g.thicknesses) == null ? void 0 : _i.get(l)) || 0.1;
    (_j = g.elasticities) == null ? void 0 : _j.get(l);
    const a = te(l).key, o = W(l) ? 2 : ((_k = g.plateFormulations) == null ? void 0 : _k.get(l)) ?? 0, E = `t${n.toPrecision(6)}_f${o}`;
    pe.has(E) || pe.set(E, { t: n, matKey: a, formulacion: o });
    const L = [...pe.keys()].indexOf(E) + 1;
    Me.set(l, `SSEC${L}`);
  }
  if (q.length > 0) {
    A('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const a of q) {
      const o = ie ? Ee.name : Me.get(a) || "SSEC1";
      A(`   Area=${a + 1}   Section=${o}   MatProp=Default`);
    }
    k();
    const l = (a) => {
      const o = c == null ? void 0 : c.get(a);
      if (o) return o;
      const E = (h == null ? void 0 : h.get(a)) ?? 1, L = W(a) ? 1 : (P == null ? void 0 : P.get(a)) ?? 1;
      return [E, E, E, L, L, L, L, L];
    }, n = q.filter((a) => {
      const o = l(a);
      return o && o.some((E) => Math.abs(E - 1) > 1e-12);
    });
    if (n.length > 0) {
      A('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const a of n) {
        const o = l(a);
        A(`   Area=${a + 1}   f11=${I(o[0])}   f22=${I(o[1])}   f12=${I(o[2])}   m11=${I(o[3])}   m22=${I(o[4])}   m12=${I(o[5])}   v13=${I(o[6])}   v23=${I(o[7])}   MassMod=1   WeightMod=1`);
      }
      k();
    }
    if (A('TABLE:  "AREA SECTION PROPERTIES"'), ie) {
      const a = Ee, o = ((_l = a.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      A(`   Section=${a.name}   Material=${o}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${I(a.totalThickness)}   BendThick=${I(a.totalThickness)}   Color=Magenta`);
    } else {
      let a = 0;
      for (const [, o] of pe) {
        a++;
        const E = o.formulacion === 2 ? "Membrane" : o.formulacion === 3 ? "Plate-Thin" : o.formulacion === 4 ? "Plate-Thick" : o.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", L = o.formulacion === 3 || o.formulacion === 4 ? "No" : "Yes";
        A(`   Section=SSEC${a}   Material=${o.matKey}   MatAngle=0   AreaType=Shell   Type=${E}   DrillDOF=${L}   Thickness=${I(o.t)}   BendThick=${I(o.t)}   Color=Cyan`);
      }
    }
    if (k(), ie) {
      A('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const a = Ee;
      for (const o of a.layers) {
        const E = o.angle ?? 0, L = o.numIntPts ?? 3;
        A(`   Section=${a.name}   LayerName=${o.name}   Distance=${I(o.distance)}   Thickness=${I(o.thickness)}   Type=Shell   NumIntPts=${L}   Material=${o.material}   MatAngle=${I(E * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      k();
    }
  }
  A('TABLE:  "JOINT COORDINATES"');
  for (let l = 0; l < $.length; l++) {
    const n = $[l];
    A(`   Joint=${l + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${I(n[0])}   Y=${I(n[1])}   Z=${I(n[2])}   SpecialJt=No`);
  }
  if (k(), F.supports && F.supports.size > 0) {
    A('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [l, n] of F.supports) {
      if (!n.some((o) => o)) continue;
      const a = (o) => o ? "Yes" : "No";
      A(`   Joint=${l + 1}   U1=${a(n[0])}   U2=${a(n[1])}   U3=${a(n[2])}   R1=${a(n[3])}   R2=${a(n[4])}   R3=${a(n[5])}`);
    }
    k();
  }
  {
    const l = /* @__PURE__ */ new Map();
    for (const n of F.springs ?? []) {
      if (!(n.k > 0)) continue;
      const a = l.get(n.node) ?? [0, 0, 0, 0, 0, 0];
      a[n.dof] += n.k, l.set(n.node, a);
    }
    if (l.size > 0) {
      A('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [n, a] of [...l].sort((o, E) => o[0] - E[0])) A(`   Joint=${n + 1}   CoordSys=Global   U1=${I(a[0])}   U2=${I(a[1])}   U3=${I(a[2])}   R1=${I(a[3])}   R2=${I(a[4])}   R3=${I(a[5])}`);
      k();
    }
  }
  const Y = F.diaphragms;
  if (Y && Y.size > 0) {
    const l = /* @__PURE__ */ new Map();
    for (const [a, o] of Y) {
      const E = Math.round(o);
      if (E === 0) continue;
      const L = Math.abs(E);
      l.has(L) || l.set(L, []), l.get(L).push(a);
    }
    const n = [...l].filter(([, a]) => a.length >= 2);
    if (n.length > 0) {
      A('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [a] of n) A(`   Name=DIAPH${a}   CoordSys=GLOBAL   Axis=Z`);
      k(), A('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [a, o] of n) for (const E of o) A(`   Joint=${E + 1}   Constraint=DIAPH${a}`);
      k();
    }
  }
  const u = O.selfWtMult ?? 1;
  A('TABLE:  "LOAD PATTERN DEFINITIONS"'), A(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${u}`), k(), A('TABLE:  "LOAD CASE DEFINITIONS"'), A('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), k(), A('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), A('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), k();
  const f = g.frameLoads, p = /* @__PURE__ */ new Map();
  if ((_m = F.loads) == null ? void 0 : _m.forEach((l, n) => p.set(n, [...l])), f && f.size > 0) {
    const l = (n, a) => {
      const o = p.get(n) ?? [0, 0, 0, 0, 0, 0];
      p.set(n, o.map((E, L) => E - a[L]));
    };
    for (const [n, a] of f) {
      const o = D[n];
      if (!o || o.length !== 2) continue;
      const E = $[o[0]], L = $[o[1]], U = [L[0] - E[0], L[1] - E[1], L[2] - E[2]], N = Math.hypot(U[0], U[1], U[2]);
      if (N < 1e-9) continue;
      const z = [U[0] / N, U[1] / N, U[2] / N], S = N * N / 12, j = [z[1] * a[2] - z[2] * a[1], z[2] * a[0] - z[0] * a[2], z[0] * a[1] - z[1] * a[0]];
      l(o[0], [a[0] * N / 2, a[1] * N / 2, a[2] * N / 2, S * j[0], S * j[1], S * j[2]]), l(o[1], [a[0] * N / 2, a[1] * N / 2, a[2] * N / 2, -S * j[0], -S * j[1], -S * j[2]]);
    }
  }
  if (p.size > 0) {
    A('TABLE:  "JOINT LOADS - FORCE"');
    for (const [l, n] of p) n.some((a) => Math.abs(a) > 1e-12) && A(`   Joint=${l + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${I(n[0])}   F2=${I(n[1])}   F3=${I(n[2])}   M1=${I(n[3])}   M2=${I(n[4])}   M3=${I(n[5])}`);
    k();
  }
  const w = g.frameLoads;
  if (w && w.size > 0) {
    A('TABLE:  "FRAME LOADS - DISTRIBUTED"');
    for (const [l, n] of w) {
      const a = D[l];
      if (!a || a.length !== 2) continue;
      const o = $[a[0]], E = $[a[1]], L = Math.hypot(E[0] - o[0], E[1] - o[1], E[2] - o[2]);
      ["X", "Y", "Z"].forEach((U, N) => {
        Math.abs(n[N]) < 1e-12 || A(`   Frame=${l + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${U}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${I(L)}   FOverLA=${I(n[N])}   FOverLB=${I(n[N])}`);
      });
    }
    k();
  }
  const m = /* @__PURE__ */ new Map();
  for (let l = 0; l < D.length; l++) {
    const { E: n, nu: a, G: o, rho: E, key: L } = te(l);
    m.has(L) || m.set(L, { E: n, nu: a, G: o, rho: E });
  }
  if (ne.length > 0) {
    const l = g.solidIncompatible === false ? "No" : "Yes", n = /* @__PURE__ */ new Map();
    for (const a of ne) {
      const { E: o, nu: E, G: L, rho: U, key: N } = te(a);
      m.has(N) || m.set(N, { E: o, nu: E, G: L, rho: U }), n.has(N) || n.set(N, `SOL${n.size + 1}`);
    }
    A('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [a, o] of n) A(`   SolidProp=${o}   Material=${a}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${l}   Color=Yellow`);
    k(), A('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const a of ne) A(`   Solid=${a + 1}   SolidProp=${n.get(te(a).key)}`);
    k();
  }
  for (const [l, n] of re) m.has(l) || m.set(l, n);
  A('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [l] of m) A(`   Material=${l}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  k(), A('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [l, n] of m) A(`   Material=${l}   UnitWeight=${I(n.rho * 9.81)}   UnitMass=${I(n.rho)}   E1=${I(n.E)}   G12=${I(n.G)}   U12=${I(n.nu)}   A1=9.9E-06`);
  k(), A('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [l] of m) A(`   Material=${l}   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0`);
  return k(), A('TABLE:  "PROGRAM CONTROL"'), A(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${v.force}, ${v.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), k(), A("END TABLE DATA"), A(""), se.join(`\r
`);
}
function I(O) {
  return O === 0 || Math.abs(O) < 1e-15 ? "0" : Math.abs(O) >= 1e6 || Math.abs(O) < 1e-3 && Math.abs(O) > 0 ? O.toExponential(8) : parseFloat(O.toPrecision(10)).toString();
}
function Qt(O, $, D = 0.05) {
  const F = $.map(([g, v]) => `${(+g).toFixed(4)} ${(+v).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${O}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${D}  SPECTYPE "USER"  `, `  FUNCTION "${O}"  TIMEVAL "${F}"  `];
}
function es(O) {
  const { name: $, func: D, modalCase: F = "Modal", sfX: g = 9.81, sfY: v = 9.81 } = O, _ = [`  LOADCASE "${$}"  TYPE  "Response Spectrum"  MODALCASE  "${F}"  `];
  return g && _.push(`  LOADCASE "${$}"  ACCEL  "U1"  FUNC  "${D}"  SF  ${g}  `), v && _.push(`  LOADCASE "${$}"  ACCEL  "U2"  FUNC  "${D}"  SF  ${v}  `), _;
}
function bt(O) {
  const { name: $ = "Modal", ritz: D = false, nModes: F = 12 } = O;
  return D ? [`  LOADCASE "${$}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${$}"  MAXMODES  ${F} MINMODES  1 `, `  LOADCASE "${$}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${$}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${$}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${$}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${$}"  MAXMODES  ${F} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function cs(O) {
  var _a;
  const $ = (_a = O.e2kModel) == null ? void 0 : _a.rawSections;
  let D = $ && $.size > 0 ? ss($, O.e2kModel) : os(O);
  return O.seismicNEC && (D = ts(D, O.seismicNEC)), D;
}
function ts(O, $) {
  const D = O.includes(`\r
`) ? `\r
` : `
`, F = O.split(/\r?\n/), g = $.name ?? "NEC", v = Qt(g, $.points, $.dampRatio ?? 0.05), _ = $.modalCase ?? "Modal", se = es({ name: $.caseName ?? "Sismo NEC", func: g, modalCase: _, sfX: $.sfX, sfY: $.sfY });
  let A = [];
  const k = (ee) => F.some((te) => ee.test(te));
  if ($.modal) {
    const ee = new RegExp(`^\\s*LOADCASE\\s+"${_}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let te = F.length - 1; te >= 0; te--) ee.test(F[te]) && F.splice(te, 1);
    A = bt({ name: _, ritz: !!$.modal.ritz, nModes: $.modal.nModes });
  } else k(new RegExp(`LOADCASE\\s+"${_}"\\s+TYPE\\s+"Modal`)) || (A = bt({ name: _ }));
  return yt(F, "FUNCTIONS", v), yt(F, "LOAD CASES", [...A, ...se]), F.join(D);
}
function yt(O, $, D) {
  const F = O.findIndex((_) => _.trim() === `$ ${$}`);
  if (F >= 0) {
    O.splice(F + 1, 0, ...D);
    return;
  }
  const g = O.findIndex((_) => _.trim() === "END"), v = g >= 0 ? g : O.length;
  O.splice(v, 0, `$ ${$}`, ...D, "");
}
function ss(O, $) {
  const D = [], F = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  D.push("$ File exported from Hekatan Struct Lineal (round-trip)"), D.push("");
  for (const g of F) {
    const v = O.get(g);
    if (!(!v || v.length === 0)) {
      D.push(`$ ${g}`);
      for (const _ of v) D.push(_);
      D.push("");
    }
  }
  for (const [g, v] of O) if (!F.includes(g) && v.length !== 0) {
    D.push(`$ ${g}`);
    for (const _ of v) D.push(_);
    D.push("");
  }
  return D.push("  END"), D.push("$ END OF MODEL FILE"), D.join(`\r
`);
}
function os(O) {
  var _a, _b, _c, _d, _e, _f, _g;
  const { nodes: $, elements: D, nodeInputs: F, elementInputs: g, title: v, units: _ } = O, se = O.shellLoads ?? g.shellSurfaceLoads;
  let A;
  se instanceof Map && (A = /* @__PURE__ */ new Map(), se.forEach((e, t) => {
    A.set(t, typeof e == "number" ? { value: e } : e);
  }));
  const k = O.shellAngles ?? g.shellAngles, ee = g.cargaDeArea, te = !!(A && A.size > 0), q = g.selfWeight, ne = g.frameLoads, ae = (O.weightMode ?? "auto") === "auto" && q !== void 0, re = /* @__PURE__ */ new Map(), le = (e, t) => {
    const s = re.get(e) ?? [0, 0, 0, 0, 0, 0];
    re.set(e, s.map((i, r) => i + t[r]));
  }, ce = /* @__PURE__ */ new Set();
  if (ae) {
    if (ne) for (const [e, t] of ne) {
      const s = D[e];
      if (!s || s.length !== 2) continue;
      const i = $[s[0]], r = $[s[1]], T = [r[0] - i[0], r[1] - i[1], r[2] - i[2]], M = Math.hypot(T[0], T[1], T[2]);
      if (M < 1e-9) continue;
      const d = [T[0] / M, T[1] / M, T[2] / M], C = M * M / 12, x = [d[1] * t[2] - d[2] * t[1], d[2] * t[0] - d[0] * t[2], d[0] * t[1] - d[1] * t[0]];
      le(s[0], [t[0] * M / 2, t[1] * M / 2, t[2] * M / 2, C * x[0], C * x[1], C * x[2]]), le(s[1], [t[0] * M / 2, t[1] * M / 2, t[2] * M / 2, -C * x[0], -C * x[1], -C * x[2]]), ce.add(e);
    }
    if (q && q > 0) {
      const t = g.endOffsets;
      D.forEach((s, i) => {
        var _a2, _b2, _c2;
        const r = ((_a2 = g.densities) == null ? void 0 : _a2.get(i)) ?? 0;
        if (r) {
          if (s.length === 2) {
            const T = ((_b2 = g.areas) == null ? void 0 : _b2.get(i)) ?? 0, M = $[s[0]], d = $[s[1]], C = [d[0] - M[0], d[1] - M[1], d[2] - M[2]];
            let x = Math.hypot(C[0], C[1], C[2]);
            const R = t == null ? void 0 : t.get(i);
            if (R) {
              const b = Math.hypot(C[0], C[1]);
              b > 1e-9 && Math.abs(Math.atan2(Math.abs(C[2]), b)) * 180 / Math.PI < 20 && (x = Math.max(x - R[0] - R[1], 0));
            }
            const y = T * x * r * 9.80665 * q;
            le(s[0], [0, 0, -y / 2, 0, 0, 0]), le(s[1], [0, 0, -y / 2, 0, 0, 0]);
          } else if (s.length === 4) {
            const T = ((_c2 = g.thicknesses) == null ? void 0 : _c2.get(i)) ?? 0, M = s.map((b) => $[b]);
            let d = 0, C = 0, x = 0;
            for (let b = 0; b < 4; b++) {
              const K = M[b], H = M[(b + 1) % 4];
              d += K[1] * H[2] - K[2] * H[1], C += K[2] * H[0] - K[0] * H[2], x += K[0] * H[1] - K[1] * H[0];
            }
            const R = Math.hypot(d, C, x) / 2, y = T * R * r * 9.80665 * q;
            for (const b of s) le(b, [0, 0, -y / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const ie = (e, t) => {
    const s = re.get(e);
    return [t[0] - ((s == null ? void 0 : s[0]) ?? 0), t[1] - ((s == null ? void 0 : s[1]) ?? 0), t[2] - (te ? (ee == null ? void 0 : ee.get(e)) ?? 0 : 0) - ((s == null ? void 0 : s[2]) ?? 0)];
  }, Ee = (e, t) => {
    const s = re.get(e);
    return [(t[3] ?? 0) - ((s == null ? void 0 : s[3]) ?? 0), (t[4] ?? 0) - ((s == null ? void 0 : s[4]) ?? 0), (t[5] ?? 0) - ((s == null ? void 0 : s[5]) ?? 0)];
  }, pe = "N", Me = "MM", c = [], h = (e) => Math.round(e * 1e4) / 1e4, P = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), W = 1e3, Y = 1e3, u = (e) => e * Y, f = (e) => e * W, p = (e) => e * W, w = (e) => e * W * Y, m = (e) => e * W / Y ** 2, l = (e) => e * W / Y ** 3, n = /* @__PURE__ */ new Date(), a = `${n.getMonth() + 1}/${n.getDate()}/${n.getFullYear()}  ${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`;
  c.push(`$ File   "Hekatan_export.e2k"  saved ${a} in ETABS 22.6.0`), c.push(""), c.push("$ PROGRAM INFORMATION"), c.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), c.push(""), c.push("$ CONTROLS"), c.push(`  UNITS  "${pe}"  "${Me}"  "C"  `), c.push('  TITLE1  "Hekatan Struct Lineal export"  '), v && c.push(`  TITLE2  "${v}"  `), c.push("  PREFERENCE  MERGETOL 0.001"), c.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), c.push("");
  const o = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Set();
  $.forEach((e) => {
    o.add(h(e[0])), E.add(h(e[1]));
  });
  const L = [...o].sort((e, t) => e - t), U = [...E].sort((e, t) => e - t);
  c.push("$ GRIDS"), c.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), L.forEach((e, t) => {
    const s = t < 26 ? String.fromCharCode(65 + t) : String.fromCharCode(65 + t % 26).repeat(Math.floor(t / 26) + 1);
    c.push(`  GRID "G1"  LABEL "${s}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), U.forEach((e, t) => {
    c.push(`  GRID "G1"  LABEL "${t + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), c.push("");
  const N = 3, z = 0.5, S = /* @__PURE__ */ new Map();
  $.forEach((e) => {
    const t = h(e[2]);
    S.set(t, (S.get(t) ?? 0) + 1);
  });
  const j = /* @__PURE__ */ new Set();
  $.forEach((e) => j.add(h(e[2])));
  const Z = [...j].sort((e, t) => e - t);
  let B = Z.filter((e) => (S.get(e) ?? 0) >= N);
  if (B.length > 1) {
    const e = [B[0]];
    for (const t of B.slice(1)) t - e[e.length - 1] < z ? e[e.length - 1] = t : e.push(t);
    B = e;
  }
  Z.length || Z.push(0, 3), B.length || (B = [Z[0], Z[Z.length - 1]]), B[0] !== Z[0] && B.unshift(Z[0]), B[B.length - 1] !== Z[Z.length - 1] && B.push(Z[Z.length - 1]);
  const Q = [], J = /* @__PURE__ */ new Map();
  Q.push("Base"), J.set(B[0], "Base");
  for (let e = 1; e < B.length; e++) {
    const t = `Level_${e}`;
    Q.push(t), J.set(B[e], t);
  }
  const X = (e) => {
    const t = h(e);
    if (J.has(t)) return { story: J.get(t), dz: 0 };
    for (let i = 0; i < B.length; i++) if (B[i] >= t) return { story: J.get(B[i]), dz: h(B[i] - t) };
    const s = B[B.length - 1];
    return { story: J.get(s), dz: h(s - t) };
  };
  c.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = B.length - 1; e >= 1; e--) c.push(`  STORY "${Q[e]}"  HEIGHT ${h(u(B[e] - B[e - 1]))} MASTERSTORY "Yes"  `);
  B.length > 0 && c.push(`  STORY "Base"  ELEV ${h(u(B[0]))} `), c.push(""), D.some((e) => e.length === 4), c.push("$ DIAPHRAGM NAMES"), c.push('  DIAPHRAGM "D1"    TYPE RIGID'), c.push(""), c.push("$ MATERIAL PROPERTIES");
  const he = 980665e-8, fe = (e) => {
    var _a2, _b2, _c2;
    const t = (_a2 = g.sectionShapes) == null ? void 0 : _a2.get(e);
    if ((t == null ? void 0 : t.type) === "CFT" && t.steelRho > 0) return t.steelRho * 9.80665;
    const s = (_b2 = g.densities) == null ? void 0 : _b2.get(e);
    if (s === void 0) return;
    const i = s > 100 ? s * he : s * 9.80665, r = (_c2 = g.deckSections) == null ? void 0 : _c2.get(e);
    if (r && r.tc > 0) {
      const T = r.tc + (r.sr > 0 ? r.hr * (r.wrt + r.wrb) / 2 / r.sr : 0);
      return (i * r.tc - r.w) / T;
    }
    return i;
  }, me = (e) => {
    var _a2;
    const t = ((_a2 = g.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, s = fe(e);
    return `${t}|${s === void 0 ? "-" : s.toFixed(4)}`;
  }, Ye = /* @__PURE__ */ new Set();
  (_a = g.elasticities) == null ? void 0 : _a.forEach((e, t) => Ye.add(me(t)));
  const Le = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map();
  let De = 0, ke = 0;
  for (const e of Ye) {
    const t = parseFloat(e.split("|")[0]), s = e.split("|")[1], i = t >= 1e8, r = i ? `Steel_${++De}` : `Conc_${++ke}`;
    Le.set(e, r), de.set(e, i);
    const T = s !== "-" ? parseFloat(s) : i ? 76.97 : 24, M = m(t), d = l(T), C = (() => {
      const y = O.elementInputs.poissonsRatios;
      if (y) {
        for (const [b, K] of y) if (me(b) === e) return K;
      }
    })(), x = C !== void 0 ? C : i ? 0.3 : 0.2, R = i ? 117e-7 : 1e-5;
    if (i) {
      c.push(`  MATERIAL  "${r}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${P(d)}`), c.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${h(M)}  U ${x}  A ${R}`);
      const y = 345e3, b = 45e4;
      c.push(`  MATERIAL  "${r}"  FY ${h(m(y))}  FU ${h(m(b))}  FYE ${h(m(y * 1.1))}  FUE ${h(m(b * 1.1))}`);
    } else c.push(`  MATERIAL  "${r}"    TYPE "Concrete"    WEIGHTPERVOLUME ${P(d)}`), c.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${h(M)}  U ${x}  A ${R}`), c.push(`  MATERIAL  "${r}"    FC ${h(m(24e3))}`);
  }
  const Oe = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = g.sectionShapes) == null ? void 0 : _b.forEach((s, i) => {
      var _a2;
      if ((s == null ? void 0 : s.type) !== "CFT" || !(s.fillE > 0) || !((((_a2 = g.elasticities) == null ? void 0 : _a2.get(i)) ?? 0) > 0)) return;
      const T = (s.fillRho ?? 2.4) * 9.80665, M = `${s.fillE}|${T.toFixed(4)}`;
      let d = e.get(M);
      d || (d = `ConcFill_${e.size + 1}`, e.set(M, d), c.push(`  MATERIAL  "${d}"    TYPE "Concrete"    WEIGHTPERVOLUME ${P(l(T))}`), c.push(`  MATERIAL  "${d}"    SYMTYPE "Isotropic"  E ${h(m(s.fillE))}  U 0.2  A 1.0e-5`), c.push(`  MATERIAL  "${d}"    FC ${h(m(24e3))}`)), Oe.set(i, d);
    });
  }
  c.push(""), c.push("$ FRAME SECTIONS");
  const Ue = /* @__PURE__ */ new Set(), Xe = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), ge = 0.05;
  D.forEach((e, t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const s = (_a2 = g.sectionShapes) == null ? void 0 : _a2.get(t), i = ((_b2 = g.elasticities) == null ? void 0 : _b2.get(t)) ?? 0, r = Le.get(me(t)) || "Conc_1", T = de.get(me(t)) ?? i >= 1e8, M = ((_c2 = g.areas) == null ? void 0 : _c2.get(t)) ?? 0, d = ((_d2 = g.momentsOfInertiaZ) == null ? void 0 : _d2.get(t)) ?? 0, C = ((_e3 = g.momentsOfInertiaY) == null ? void 0 : _e3.get(t)) ?? 0, x = ((_f2 = g.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
    let R = (s == null ? void 0 : s.type) || "rect", y = (s == null ? void 0 : s.h) ?? 0, b = (s == null ? void 0 : s.b) ?? 0, K = (s == null ? void 0 : s.d) ?? 0;
    const H = (s == null ? void 0 : s.tf) ?? 0, V = (s == null ? void 0 : s.tw) ?? 0;
    if (!s && y <= 0 && b <= 0 && K <= 0 && M > 0 && d > 0 && C > 0) {
      const $e = (_g2 = g.cantos) == null ? void 0 : _g2.get(t), Ge = (_h = g.anchos) == null ? void 0 : _h.get(t);
      y = $e && $e > 0 ? $e : Math.sqrt(12 * d / M), b = Ge && Ge > 0 ? Ge : M / y, (!isFinite(y) || y < ge) && (y = ge), (!isFinite(b) || b < ge) && (b = ge), R = "general";
    } else y <= 0 && b <= 0 && K <= 0 && M > 0 && (d > 0 ? (y = Math.sqrt(12 * d / M), b = M / y) : y = b = Math.sqrt(M), (!isFinite(y) || y < ge) && (y = ge), (!isFinite(b) || b < ge) && (b = ge), R = "rect");
    y <= 0 && b <= 0 && K <= 0 && (y = 0.3, b = 0.3, R = "rect");
    const _e2 = (s == null ? void 0 : s.name) ? `NAME_${s.name}` : `${R}_${h(y)}_${h(b)}_${h(K)}_${h(H)}_${h(V)}_${r}`;
    (s == null ? void 0 : s.name) && !xe.has(_e2) && xe.set(_e2, s.name);
    let oe = xe.get(_e2);
    if (!oe) {
      const $e = T ? "S" : "C";
      R === "general" ? oe = `${$e}_G${Ue.size + 1}` : R === "rect" ? oe = `${$e}_R${Math.round(b * 100)}x${Math.round(y * 100)}` : R === "circ" ? oe = `${$e}_C_D${Math.round(K * 100)}` : R === "I" ? oe = `${$e}_I${Math.round(y * 100)}x${Math.round(b * 100)}` : R === "HSS" ? oe = `${$e}_HSS${Math.round(b * 100)}x${Math.round(y * 100)}x${Math.round(V * 1e3)}` : oe = `${$e}_Sec${Ue.size + 1}`, xe.set(_e2, oe);
    }
    if (Xe.set(t, oe), Ue.has(oe)) return;
    Ue.add(oe);
    const Ze = Oe.get(t);
    if (R === "CFT" && Ze && K > 0 && V > 0 && !(y > 0 && b > 0)) {
      c.push(`  FRAMESECTION  "${oe}"  MATERIAL "${r}"  SHAPE "Filled Steel Pipe"  D ${h(u(K))} T ${h(u(V))} FILLMATERIAL "${Ze}"`);
      return;
    }
    if (R === "CFT" && Ze && y > 0 && b > 0 && V > 0) {
      c.push(`  FRAMESECTION  "${oe}"  MATERIAL "${r}"  SHAPE "Filled Steel Tube"  D ${h(u(y))} B ${h(u(b))} TF ${h(u(H > 0 ? H : V))} TW ${h(u(V))} FILLMATERIAL "${Ze}"`);
      return;
    }
    const Ke = s, Kt = !((Ke == null ? void 0 : Ke.t2b) > 0) || Math.abs(Ke.t2b - b) < 1e-9 && Math.abs((Ke.tfb ?? H) - H) < 1e-9;
    if (R === "I" && y > 0 && b > 0 && H > 0 && V > 0 && Kt) {
      c.push(`  FRAMESECTION  "${oe}"  MATERIAL "${r}"  SHAPE "Steel I/Wide Flange"  D ${h(u(y))} B ${h(u(b))} TF ${h(u(H))} TW ${h(u(V))} `);
      return;
    }
    if (R === "HSS" && y > 0 && b > 0 && H > 0 && V > 0) {
      c.push(`  FRAMESECTION  "${oe}"  MATERIAL "${r}"  SHAPE "Steel Tube"  D ${h(u(y))} B ${h(u(b))} TF ${h(u(H))} TW ${h(u(V))} `);
      return;
    }
    if (R === "C" && y > 0 && b > 0 && H > 0 && V > 0) {
      c.push(`  FRAMESECTION  "${oe}"  MATERIAL "${r}"  SHAPE "Steel Channel"  D ${h(u(y))} B ${h(u(b))} TF ${h(u(H))} TW ${h(u(V))} `);
      return;
    }
    if (R === "2L" && y > 0 && b > 0 && H > 0 && V > 0) {
      c.push(`  FRAMESECTION  "${oe}"  MATERIAL "${r}"  SHAPE "Steel Double Angle"  D ${h(u(y))} B ${h(u(b))} TF ${h(u(H))} TW ${h(u(V))} DIS ${h(u((Ke == null ? void 0 : Ke.dis) ?? 0))} `);
      return;
    }
    const Xt = M > 0 && d > 0 && C > 0;
    let Te;
    R === "general" || Xt ? Te = "General" : R === "I" ? Te = "Steel I/Wide Flange" : R === "HSS" ? Te = "Steel Tube" : R === "CFT" ? Te = "Filled Steel Tube" : R === "pipe" ? Te = "Steel Pipe" : R === "L" ? Te = "Steel Angle" : R === "C" ? Te = "Steel Channel" : R === "2C" ? Te = "Steel Double Channel" : R === "circ" ? Te = "Concrete Circle" : Te = "Concrete Rectangular";
    let Ne = `  FRAMESECTION  "${oe}"  MATERIAL "${r}"  SHAPE "${Te}"`;
    if (Te === "General") {
      const $e = ((_i = g.shearAreasZ) == null ? void 0 : _i.get(t)) || M * 5 / 6, Ge = ((_j = g.shearAreasY) == null ? void 0 : _j.get(t)) || M * 5 / 6;
      Ne += `  D ${h(u(y))} B ${h(u(b))} AREA ${P(M * 1e6)} AS2 ${P($e * 1e6)} AS3 ${P(Ge * 1e6)} I33 ${P(d * 1e12)} I22 ${P(C * 1e12)} TORSION ${P((x || d + C) * 1e12)} S33POS ${P(2 * d / y * 1e9)} S33NEG ${P(2 * d / y * 1e9)} S22POS ${P(2 * C / b * 1e9)} S22NEG ${P(2 * C / b * 1e9)} Z33 ${P(2 * d / y * 1e9)} Z22 ${P(2 * C / b * 1e9)} R33 ${P(Math.sqrt(d / M) * 1e3)} R22 ${P(Math.sqrt(C / M) * 1e3)} `, c.push(Ne);
      return;
    }
    y && (Ne += `  D ${h(u(y))}`), b && (Ne += `  B ${h(u(b))}`), K && !y && (Ne += `  D ${h(u(K))}`), H && (Ne += `  TF ${h(u(H))}`), V && (Ne += `  TW ${h(u(V))}`), c.push(Ne);
  }), c.push("");
  const He = /* @__PURE__ */ new Map();
  let Yt = 0;
  $.forEach((e) => {
    const { dz: t } = X(e[2]), s = `${h(e[0])},${h(e[1])},${t}`;
    He.has(s) || He.set(s, `${++Yt}`);
  });
  const ve = /* @__PURE__ */ new Map(), Ve = [];
  {
    const e = /* @__PURE__ */ new Map();
    for (const s of F.springs ?? []) {
      if (!(s.k > 0)) continue;
      const i = e.get(s.node) ?? [0, 0, 0, 0, 0, 0];
      i[s.dof] += s.k, e.set(s.node, i);
    }
    const t = /* @__PURE__ */ new Map();
    for (const [s, i] of e) {
      const r = i.map((d, C) => C < 3 ? d * W / Y : d * W * Y), T = r.map((d) => +d.toPrecision(12)).join("|");
      let M = t.get(T);
      if (!M) {
        M = `SPR${t.size + 1}`, t.set(T, M);
        const d = ["UX", "UY", "UZ", "RX", "RY", "RZ"], C = r.map((x, R) => `${d[R]}  ${+x.toPrecision(12)}`);
        Ve.push(`  POINTSPRING  "${M}"  NONLINEARSPECOPTION  "LINKS"  ${C.join(" ")} `);
      }
      ve.set(s, M);
    }
    Ve.length && (c.push("$ POINT SPRING PROPERTIES"), Ve.forEach((s) => c.push(s)), c.push(""));
  }
  c.push("$ POINT COORDINATES");
  for (const [e, t] of He) {
    const [s, i, r] = e.split(",").map(Number);
    c.push(r ? `  POINT "${t}"  ${h(u(s))} ${h(u(i))} ${h(u(r))} ` : `  POINT "${t}"  ${h(u(s))} ${h(u(i))} `);
  }
  c.push("");
  const Ae = (e) => {
    const t = $[e], { story: s, dz: i } = X(t[2]), r = `${h(t[0])},${h(t[1])},${i}`;
    return { pt: He.get(r) || "1", story: s };
  }, ft = (e) => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    const t = [], s = (_a2 = O.propertyModifiers) == null ? void 0 : _a2.get(e);
    s && s.some((R) => Math.abs(R - 1) > 1e-9) && t.push(`PROPMODIFIERS "${s.map((R) => h(R)).join(" ")}"`);
    const i = (_b2 = g.localAngles) == null ? void 0 : _b2.get(e);
    i !== void 0 && isFinite(i) && Math.abs(i) > 1e-9 && t.push(`ANG ${h(i)}`);
    const r = (_c2 = g.momentReleases) == null ? void 0 : _c2.get(e);
    if (r && r.some((R) => R)) {
      const R = [];
      r.length === 12 ? (r[0] && R.push("PI"), r[1] && R.push("V2I"), r[2] && R.push("V3I"), r[3] && R.push("TI"), r[4] && R.push("M2I"), r[5] && R.push("M3I"), r[6] && R.push("PJ"), r[7] && R.push("V2J"), r[8] && R.push("V3J"), r[9] && R.push("TJ"), r[10] && R.push("M2J"), r[11] && R.push("M3J")) : r.length === 6 && (r[0] && R.push("TI"), r[1] && R.push("M2I"), r[2] && R.push("M3I"), r[3] && R.push("TJ"), r[4] && R.push("M2J"), r[5] && R.push("M3J")), R.length > 0 && t.push(`RELEASE "${R.join(" ")}"`);
    }
    const T = (_d2 = g.insertionPoints) == null ? void 0 : _d2.get(e);
    T && (Math.abs(T[0]) > 1e-9 || Math.abs(T[1]) > 1e-9) && t.push(`LATEROFFSET ${h(u(T[0]))} TRANSOFFSET ${h(u(T[1]))}`);
    const M = (_e2 = g.rigidOffsets) == null ? void 0 : _e2.get(e), d = (_f2 = g.endOffsets) == null ? void 0 : _f2.get(e), C = d ? [d[0], d[1]] : M, x = d && d.length > 2 ? d[2] : 0;
    return C && (Math.abs(C[0]) > 1e-9 || Math.abs(C[1]) > 1e-9) && t.push(`LENGTHOFFI ${h(u(C[0]))} LENGTHOFFJ ${h(u(C[1]))} RIGIDZONE ${h(x)}`), t.length > 0 ? ` ${t.join(" ")} ` : "";
  }, qe = [], St = /* @__PURE__ */ new Set(), We = /* @__PURE__ */ new Map();
  D.forEach((e, t) => {
    if (e.length !== 2) return;
    const s = wt($, e);
    if (s === "BEAM") return;
    const i = $[e[0]][2] <= $[e[1]][2] ? e[0] : e[1], r = $[e[0]][2] <= $[e[1]][2] ? e[1] : e[0];
    if (Math.abs($[i][0] - $[r][0]) > 1e-6 || Math.abs($[i][1] - $[r][1]) > 1e-6) return;
    const T = Ae(i), M = Xe.get(t) || `Sec_${t}`, d = `${T.pt}_${M}_${s}`;
    We.has(d) || We.set(d, []), We.get(d).push({ i: t, bot: i, top: r, zBot: h($[i][2]), zTop: h($[r][2]), planPt: T.pt, secName: M, type: s });
  }), We.forEach((e, t) => {
    e.sort((i, r) => i.zBot - r.zBot);
    let s = 0;
    for (let i = 1; i <= e.length; i++) if (i === e.length || Math.abs(e[i].zBot - e[i - 1].zTop) > 1e-6) {
      const T = e.slice(s, i);
      T.length >= 1 && (qe.push({ elemIndices: T.map((M) => M.i), planPt: T[0].planPt, bottomNodeIdx: T[0].bot, topNodeIdx: T[T.length - 1].top, secName: T[0].secName, type: T[0].type, nSegments: T.length }), T.forEach((M) => St.add(M.i))), s = i;
    }
  }), c.push("$ LINE CONNECTIVITIES");
  const Qe = [], ze = (e) => Q.indexOf(e), ht = /* @__PURE__ */ new Map(), pt = (e, t, s, i, r, T, M, d) => {
    const C = Ae(i), x = Ae(s);
    d !== void 0 && ht.set(d, { name: e, story: C.story });
    const R = ze(C.story) - ze(x.story);
    R <= 0 ? c.push(`  LINE  "${e}"  BEAM  "${x.pt}"  "${C.pt}"  0`) : c.push(`  LINE  "${e}"  ${t}  "${x.pt}"  "${C.pt}"  ${R}`);
    const y = g.meshAtIntersections === false;
    Qe.push(`  LINEASSIGN  "${e}"  "${C.story}"  SECTION "${r}" ${T} MINNUMSTA ${M} AUTOMESH "${y ? "NO" : "YES"}"  MESHATINTERSECTIONS "${y ? "NO" : "YES"}"  `);
  }, At = /* @__PURE__ */ new Map();
  qe.forEach((e, t) => {
    const s = ft(e.elemIndices[0]), i = [];
    let r = [];
    e.elemIndices.forEach((T, M) => {
      r.push(T);
      const [d, C] = D[T], x = $[d][2] >= $[C][2] ? d : C;
      (X($[x][2]).dz === 0 || M === e.elemIndices.length - 1) && (i.push(r), r = []);
    }), i.forEach((T) => {
      const [M, d] = D[T[0]], C = $[M][2] <= $[d][2] ? M : d, [x, R] = D[T[T.length - 1]], y = $[x][2] >= $[R][2] ? x : R;
      ze(Ae(y).story) - ze(Ae(C).story);
      let b = `C${t + 1}`;
      for (let K = 1; ; K++) {
        const H = c.length;
        pt(b, e.type, C, y, e.secName, s, T.length);
        const V = c[H], Et = At.get(b);
        if (Et === void 0) {
          At.set(b, V);
          break;
        }
        if (c.splice(H, c.length - H), Et === V) break;
        Qe.pop(), b = `C${t + 1}_${K}`;
      }
    });
  }), D.forEach((e, t) => {
    if (e.length !== 2 || St.has(t)) return;
    const s = wt($, e), i = Xe.get(t) || `Sec_${t}`, r = ft(t), T = $[e[0]][2] <= $[e[1]][2] ? e[0] : e[1], M = $[e[0]][2] <= $[e[1]][2] ? e[1] : e[0];
    pt(`E${t + 1}`, s === "BEAM" ? "BRACE" : s, T, M, i, r, 3, t);
  }), c.push("");
  const Fe = O.weightMode ?? "auto", Ie = /* @__PURE__ */ new Set();
  c.push("$ POINT ASSIGNS"), (_c = F.supports) == null ? void 0 : _c.forEach((e, t) => {
    const s = [];
    if (e[0] && s.push("UX"), e[1] && s.push("UY"), e[2] && s.push("UZ"), e[3] && s.push("RX"), e[4] && s.push("RY"), e[5] && s.push("RZ"), s.length > 0) {
      const i = Ae(t), r = i.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", T = ve.has(t) ? ` SPRINGPROP "${ve.get(t)}" ` : "";
      c.push(`  POINTASSIGN  "${i.pt}"  "${i.story}"  RESTRAINT "${s.join(" ")}" ${r}${T} `), Ie.add(`${i.pt}@${i.story}`);
    }
  });
  for (const [e, t] of ve) {
    const s = Ae(e);
    Ie.has(`${s.pt}@${s.story}`) || (c.push(`  POINTASSIGN  "${s.pt}"  "${s.story}"  SPRINGPROP "${t}" `), Ie.add(`${s.pt}@${s.story}`));
  }
  const kt = !!(F.diaphragms && [...F.diaphragms.values()].some((e) => e !== 0)), Tt = O.diaphragm ?? "auto", et = Tt === "d1" || Tt === "auto" && kt, be = /* @__PURE__ */ new Set();
  F.diaphragms && F.diaphragms.forEach((e, t) => {
    e !== 0 && be.add(t);
  }), et && be.size ? be.forEach((e) => {
    const t = Ae(e), s = `${t.pt}@${t.story}`;
    !Ie.has(s) && t.story !== "Base" && (c.push(`  POINTASSIGN  "${t.pt}"  "${t.story}"  DIAPH "D1"  `), Ie.add(s));
  }) : et && qe.forEach((e) => {
    for (const t of e.elemIndices) {
      const [s, i] = D[t], r = $[s][2] >= $[i][2] ? s : i, T = Ae(r), M = `${T.pt}@${T.story}`;
      !Ie.has(M) && T.story !== "Base" && (c.push(`  POINTASSIGN  "${T.pt}"  "${T.story}"  DIAPH "D1"  `), Ie.add(M));
    }
  }), Fe === "manual" && F.loads && F.loads.forEach((e, t) => {
    const [s, i, r] = ie(t, e);
    if (Math.abs(s) < 1e-10 && Math.abs(i) < 1e-10 && Math.abs(r) < 1e-10) return;
    const T = Ae(t), M = `${T.pt}@${T.story}`;
    Ie.has(M) || (c.push(`  POINTASSIGN  "${T.pt}"  "${T.story}"  DIAPH "DISCONNECTED"  `), Ie.add(M));
  }), c.push(""), c.push("$ LINE ASSIGNS"), Qe.forEach((e) => c.push(e)), c.push("");
  const Se = [], $t = g.areaObjects, Mt = /* @__PURE__ */ new Set(), dt = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
  $t == null ? void 0 : $t.forEach((e) => e.cells.forEach((t) => Mt.add(t))), D.forEach((e, t) => {
    if (e.length === 4 || e.length === 3) {
      const s = $[e[0]], i = $[e[1]], r = $[e[2]], T = [i[0] - s[0], i[1] - s[1], i[2] - s[2]], M = [r[0] - s[0], r[1] - s[1], r[2] - s[2]], d = T[1] * M[2] - T[2] * M[1], C = T[2] * M[0] - T[0] * M[2], x = T[0] * M[1] - T[1] * M[0], R = Math.sqrt(d * d + C * C + x * x), y = R > 1e-10 && Math.abs(x) / R < 0.5;
      Se.push({ idx: t, el: e, isWall: y }), Mt.has(t) && Se.pop();
    }
  });
  const ue = (() => {
    for (const [e, t] of de) if (!t) return Le.get(e);
    return Le.values().next().value || "Conc_1";
  })();
  $t == null ? void 0 : $t.forEach((e, t) => {
    Se.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && dt.set(e.cells[0], e.q), e.ang !== void 0 && It.set(e.cells[0], e.ang);
  });
  const Ce = "DECK";
  let tt = false;
  const st = [], ut = (e) => {
    const t = O.elementInputs.plateFormulations, s = Se.find((r) => r.isWall === e), i = t && s ? t.get(s.idx) : void 0;
    return i === 2 ? "Membrane" : i === 1 ? "ShellThin" : "ShellThick";
  }, mt = (e, t) => {
    const s = O.elementInputs.thicknesses, i = Se.find((r) => r.isWall === e);
    return (i ? s == null ? void 0 : s.get(i.idx) : void 0) ?? (s == null ? void 0 : s.values().next().value) ?? t;
  }, gt = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], je = (e) => {
    var _a2;
    const s = (_a2 = g.shellModifiers) == null ? void 0 : _a2.get(e);
    if (s && s.length >= 8) return s.slice(0, 8);
    const i = g.membraneModifiers, r = g.bendingModifiers, T = i == null ? void 0 : i.get(e), M = r == null ? void 0 : r.get(e);
    if (T === void 0 && M === void 0) return null;
    const d = T ?? 1, C = M ?? 1;
    return [d, d, d, C, C, C, C, C];
  }, Nt = (e, t) => {
    const s = Se.filter((M) => M.isWall === t), i = /* @__PURE__ */ new Map();
    for (const M of s) {
      const d = je(M.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      i.set(d.map((C) => h(C)).join(","), d);
    }
    if (i.size === 0) return "";
    i.size > 1 && console.warn(`[e2k] "${e}": ${i.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const r = i.values().next().value, T = gt.map((M, d) => Math.abs(r[d] - 1) > 1e-9 ? `${M} ${h(r[d])}` : "").filter(Boolean);
    return T.length ? `  SHELLPROP  "${e}"  ${T.join(" ")} ` : "";
  }, Ot = O.elementInputs.thicknesses, Rt = O.elementInputs.plateFormulations, ye = (e) => {
    var _a2;
    const t = Ot == null ? void 0 : Ot.get(e.idx), s = Rt == null ? void 0 : Rt.get(e.idx), i = je(e.idx), r = (_a2 = O.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), T = r ? [r.tc, r.hr, r.wrt, r.wrb, r.sr, r.w].map((M) => h(M)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${t ?? "-"}|${s ?? "-"}|${i ? i.map((M) => h(M)).join(",") : "-"}|${me(e.idx)}|${T}`;
  }, ot = (e) => {
    var _a2;
    if ((_a2 = O.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const t = je(e);
    return t ? Math.abs(t[3]) < 1e-9 && Math.abs(t[4]) < 1e-9 : false;
  }, we = /* @__PURE__ */ new Map();
  let Ut = 0, xt = 0, Ht = 0;
  for (const e of Se) {
    const t = ye(e);
    if (we.has(t)) continue;
    const s = e.isWall, i = !s && ot(e.idx), r = s ? ++xt : i ? ++Ht : ++Ut, T = me(e.idx);
    we.set(t, { nombre: (s ? "Muro" : i ? Ce : "Losa") + (r === 1 ? "" : String(r)), isWall: s, mem: i, t: Ot == null ? void 0 : Ot.get(e.idx), pf: Rt == null ? void 0 : Rt.get(e.idx), idx: e.idx, mat: Le.get(T) ?? ue, acero: de.get(T) ?? false });
  }
  const Je = (e) => {
    var _a2;
    return ((_a2 = we.get(ye(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, Lt = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", vt = (e, t) => {
    const s = Se.find((T) => ye(T) === t), i = s ? je(s.idx) ?? null : null;
    if (!i) return "";
    const r = gt.map((T, M) => Math.abs(i[M] - 1) > 1e-9 ? `${T} ${h(i[M])}` : "").filter(Boolean);
    return r.length ? `  SHELLPROP  "${e}"  ${r.join(" ")} ` : "";
  }, Be = Se.find((e) => !e.isWall), Dt = Se.find((e) => e.isWall), nt = /* @__PURE__ */ new Set();
  Be && nt.add(ye(Be)), Dt && nt.add(ye(Dt));
  const Ct = [...we.entries()].filter(([e]) => !nt.has(e)), at = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = O.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, Wt = (e) => e * W / Y ** 2, Pt = (e, t) => {
    const s = (i) => P(u(i));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${ue}"  DECKMATERIAL "${ue}"  DECKSLABDEPTH ${s(t.tc)} DECKRIBDEPTH ${s(t.hr)} DECKRIBWIDTHTOP ${s(t.wrt)} DECKRIBWIDTHBOTTOM ${s(t.wrb)} DECKRIBSPACING ${s(t.sr)} DECKSHEARTHICKNESS ${s(76e-5)} DECKUNITWEIGHT ${P(Wt(t.w))} SHEARSTUDDIAM ${s(0.019)} SHEARSTUDHEIGHT ${s(0.1)} SHEARSTUDFU 400 `;
  };
  if (Se.some((e) => !e.isWall)) {
    tt = !!Be && ot(Be.idx);
    const e = mt(false, 0.15);
    if (tt) {
      c.push("$ DECK PROPERTIES");
      const s = [...we.values()].find((r) => r.nombre === Ce), i = at(Be == null ? void 0 : Be.idx);
      (s == null ? void 0 : s.acero) ? c.push(`  SHELLPROP  "${Ce}"  PROPTYPE  "Slab"  MATERIAL "${s.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(u(e))} `) : i ? c.push(Pt(Ce, i)) : c.push(`  SHELLPROP  "${Ce}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(u(e))} `);
    } else c.push("$ SLAB PROPERTIES"), c.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${ut(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${h(u(e))} `);
    const t = Nt(tt ? Ce : "Losa", false);
    t && c.push(t), c.push("");
  }
  if (Se.some((e) => e.isWall)) {
    c.push("$ WALL PROPERTIES");
    const e = mt(true, 0.2), t = ut(true);
    c.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${ue}"  MODELINGTYPE "${t}"  WALLTHICKNESS ${h(u(e))} `);
    const s = Nt("Muro", true);
    s && c.push(s), c.push("");
  }
  if (Ct.length) {
    c.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, t] of Ct) {
      const s = t.t ?? (t.isWall ? 0.2 : 0.15);
      c.push(t.isWall ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Wall"  MATERIAL "${t.mat ?? ue}"  MODELINGTYPE "${Lt(t.pf)}"  WALLTHICKNESS ${h(u(s))} ` : t.mem && t.acero ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${t.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(u(s))} ` : t.mem && at(t.idx) ? Pt(t.nombre, at(t.idx)) : t.mem ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${h(u(s))} ` : `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${Lt(t.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${h(u(s))} `);
      const i = vt(t.nombre, e);
      i && c.push(i);
    }
    c.push("");
  }
  if (Se.length > 0) {
    c.push("$ AREA CONNECTIVITIES");
    const e = [];
    Se.forEach((t, s) => {
      const { el: i, isWall: r } = t, T = r ? `W${s + 1}` : `F${s + 1}`, M = r ? "PANEL" : "FLOOR", d = i.map((C) => Ae(C));
      if (r) {
        const C = (K) => Q.indexOf(K);
        if (new Set(d.map((K) => K.pt)).size === 4) {
          const K = Math.max(...d.map((V) => C(V.story))), H = d.map((V) => K - C(V.story));
          c.push(`  AREA "${T}"  ${M}  4  "${d[0].pt}"  "${d[1].pt}"  "${d[2].pt}"  "${d[3].pt}"  ${H.join("  ")}  `), e.push(`  AREAASSIGN  "${T}"  "${Q[K]}"  SECTION "${Je(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const R = $[i[0]][2] <= $[i[2]][2] ? 0 : 2, y = $[i[1]][2] <= $[i[3]][2] ? 1 : 3;
        c.push(`  AREA "${T}"  ${M}  4  "${d[R].pt}"  "${d[y].pt}"  "${d[y].pt}"  "${d[R].pt}"  1  1  0  0  `);
        const b = d[R === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${T}"  "${b}"  SECTION "${Je(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const C = d.length, x = (H) => Q.indexOf(H), R = Math.max(...d.map((H) => x(H.story))), y = d.map((H) => R - x(H.story)), b = Q[R] ?? d[0].story;
        c.push(`  AREA "${T}"  ${M}  ${C}  ` + d.map((H) => `"${H.pt}"`).join("  ") + "  " + y.join("  ") + "  ");
        const K = It.get(t.idx) ?? (k == null ? void 0 : k.get(t.idx));
        e.push(ot(t.idx) ? `  AREAASSIGN  "${T}"  "${b}"  SECTION "${Je(t)}"  ANG ${h(K ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${T}"  "${b}"  SECTION "${Je(t)}" ${et && (!be.size || (D[t.idx] ?? []).every((H) => be.has(H))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), st.push({ name: T, story: b, idx: t.idx });
      }
    }), c.push(""), c.push("$ AREA ASSIGNS"), e.forEach((t) => c.push(t)), c.push("");
  }
  const zt = Fe === "manual" ? 0 : q ?? 1;
  c.push("$ LOAD PATTERNS");
  const Re = ((_d = O.loadPatterns) == null ? void 0 : _d.length) ? O.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: zt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Re) {
    let t;
    e.type === "Dead" ? t = Fe === "manual" ? 0 : e.selfWeightMultiplier ?? q ?? 1 : (t = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${e.type ?? "Other"}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), c.push(`  LOADPATTERN "${e.name}"  TYPE  "${e.type ?? "Other"}"  SELFWEIGHT  ${t}`);
  }
  c.push("");
  const Pe = O.loadPatternDestino && Re.some((e) => e.name === O.loadPatternDestino) ? O.loadPatternDestino : ((_e = Re.find((e) => e.type === "Dead")) == null ? void 0 : _e.name) ?? Re[0].name, it = [], ct = /* @__PURE__ */ new Map(), Ft = (e, t) => {
    const s = ct.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i++) s[i] += t[i] ?? 0;
    ct.set(e, s);
  }, jt = Pe === (((_f = Re.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Re[0].name), Jt = Fe === "manual" || !jt || ae;
  if (F.loads && F.loads.size > 0 && F.loads.forEach((e, t) => {
    const [s, i, r] = ie(t, e), [T, M, d] = Ee(t, e);
    Ft(t, [s, i, Jt ? r : 0, T, M, d]);
  }), F.moments && F.moments.size > 0 && F.moments.forEach((e, t) => {
    Ft(t, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), ct.forEach((e, t) => {
    if (e.every((i) => Math.abs(i) <= 1e-10)) return;
    const s = Ae(t);
    it.push(`  POINTLOAD  "${s.pt}"  "${s.story}"  TYPE "FORCE"  LC "${Pe}"  FX ${P(p(e[0]))}  FY ${P(p(e[1]))}  FZ ${P(p(e[2]))}  MX ${P(w(e[3]))}  MY ${P(w(e[4]))}  MZ ${P(w(e[5]))}`);
  }), it.length > 0 && (c.push("$ POINT OBJECT LOADS"), it.forEach((e) => c.push(e)), c.push("")), ae && ce.size > 0) {
    const e = [];
    for (const t of ce) {
      const s = ne.get(t), i = ht.get(t);
      if (!i) continue;
      const r = (T) => P(f(T) / Y);
      Math.abs(s[2]) > 1e-12 && e.push(`  LINELOAD  "${i.name}"  "${i.story}"  TYPE "UNIFF"  DIR "${s[2] < 0 ? "GRAV" : "Z"}"  LC "${Pe}"  FVAL ${r(Math.abs(s[2]))}`), Math.abs(s[0]) > 1e-12 && e.push(`  LINELOAD  "${i.name}"  "${i.story}"  TYPE "UNIFF"  DIR "X"  LC "${Pe}"  FVAL ${r(s[0])}`), Math.abs(s[1]) > 1e-12 && e.push(`  LINELOAD  "${i.name}"  "${i.story}"  TYPE "UNIFF"  DIR "Y"  LC "${Pe}"  FVAL ${r(s[1])}`);
    }
    e.length && (c.push("$ FRAME OBJECT LOADS"), e.forEach((t) => c.push(t)), c.push(""));
  }
  if (A && A.size > 0 && st.length > 0) {
    const e = [];
    for (const t of st) {
      const s = dt.get(t.idx), i = s !== void 0 ? { value: s } : A.get(t.idx);
      if (!i || Math.abs(i.value) < 1e-12) continue;
      const r = i.dir ?? "GRAV", T = r === "GRAV" ? -i.value : i.value;
      e.push(`  AREALOAD  "${t.name}"  "${t.story}"  TYPE "UNIFF"  DIR "${r}"  LC "${i.pattern ?? Pe}"  FVAL ${P(f(T) / (Y * Y))}`);
    }
    e.length > 0 && (c.push("$ SHELL OBJECT LOADS"), e.forEach((t) => c.push(t)), c.push(""));
  }
  c.push("$ ANALYSIS OPTIONS"), c.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), c.push('  PDELTA  METHOD "NONE"  '), c.push("");
  const rt = Fe === "manual";
  c.push("$ MASS SOURCE"), c.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${rt ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${rt ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "No"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"  `), rt || c.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), c.push(""), c.push("$ LOAD CASES");
  const _t = ((_g = O.loadCases) == null ? void 0 : _g.length) ? O.loadCases : Re.map((e) => ({ name: e.name, type: "Linear Static", patterns: [{ pattern: e.name, scaleFactor: 1 }] }));
  for (const e of _t) {
    c.push(`  LOADCASE "${e.name}"  TYPE  "${e.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const t of e.patterns ?? []) c.push(`  LOADCASE "${e.name}"  LOADPAT  "${t.pattern}"  SF ${t.scaleFactor} `);
  }
  const Zt = O.modalModes ?? 12;
  c.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), c.push(`  LOADCASE "Modal"  MAXMODES ${Zt}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), c.push("");
  const lt = O.loadCombinations;
  if (lt && lt.length) {
    c.push("$ LOAD COMBINATIONS");
    for (const e of lt) {
      c.push(`  COMBO "${e.name}"  TYPE "${e.type ?? "Linear Add"}"  `);
      for (const t of e.cases ?? []) c.push(`  COMBO "${e.name}"  LOADCASE  "${t.case}"  SF ${t.scaleFactor} `);
    }
    c.push("");
  }
  return c.push("  END"), c.push("$ END OF MODEL FILE"), c.join(`\r
`);
}
function wt(O, $) {
  const D = O[$[0]], F = O[$[1]], g = Math.abs(F[2] - D[2]), v = Math.sqrt((F[0] - D[0]) ** 2 + (F[1] - D[1]) ** 2), _ = g > v * 0.5;
  return _ && v > 0.01 ? "BRACE" : _ ? "COLUMN" : "BEAM";
}
export {
  is as a,
  cs as e,
  as as p
};
