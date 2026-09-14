function G(m) {
  return m && parseFloat(m) || 0;
}
function wt(m) {
  const p = /* @__PURE__ */ new Map(), R = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let P;
  for (; (P = R.exec(m)) !== null; ) p.set(P[1], P[2] !== void 0 ? P[2] : P[3]);
  return p;
}
function os(m) {
  const p = m.split(/\r?\n/);
  return p.some((P) => P.trim().startsWith("TABLE:")) ? Xt(p) : Kt(p);
}
function Xt(m) {
  var _a, _b, _c, _d, _e, _f;
  const p = [];
  let R = "";
  for (const y of m) {
    const N = y.trimEnd();
    N.endsWith("_") ? R += N.slice(0, -1) + " " : (R += N, p.push(R), R = "");
  }
  R && p.push(R);
  const P = { force: "KN", length: "m" };
  let $ = "UX,UY,UZ,RX,RY,RZ";
  const H = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), q = [], K = [], te = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), ne = [], oe = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), i = [], d = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let v = "";
  for (const y of p) {
    const N = y.trim();
    if (!N || N.startsWith(";") || N.startsWith("File ")) continue;
    if (N.startsWith("TABLE:")) {
      const S = N.match(/TABLE:\s+"(.+?)"/);
      v = S ? S[1].toUpperCase() : "";
      continue;
    }
    if (N === "END TABLE DATA") {
      v = "";
      continue;
    }
    const f = wt(N);
    switch (v) {
      case "PROGRAM CONTROL": {
        const S = f.get("CurrUnits");
        if (S) {
          const b = S.split(",").map((I) => I.trim());
          b[0] && (P.force = b[0]), b[1] && (P.length = b[1]);
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
          const b = H.get(S) || { E: 0, nu: 0, G: 0 };
          b.E = G(f.get("E1")), b.G = G(f.get("G12")), b.nu = G(f.get("U12")), b.density = G(f.get("UnitMass")), H.set(S, b);
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
        S && A.set(S, { material: f.get("Material") || "", shape: f.get("Shape") || "Rectangular", D: G(f.get("t3")), B: G(f.get("t2")), TF: G(f.get("tf")), TW: G(f.get("tw")), A: G(f.get("Area")), Iz: G(f.get("I33")), Iy: G(f.get("I22")), J: G(f.get("TorsConst")), As2: G(f.get("AS2")), As3: G(f.get("AS3")) });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const S = f.get("SectionName");
        S && z.set(S, { h: G(f.get("Height")), b: G(f.get("Width")), t: G(f.get("WebThick")) || G(f.get("FlngThick")), tf: G(f.get("FlngThick")) || G(f.get("WebThick")), mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const S = f.get("SectionName");
        S && z.set(S, { h: 0, b: 0, D: G(f.get("OuterDiam")), t: G(f.get("WallThick")), mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const S = f.get("SectionName");
        S && ee.set(S, { mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const S = f.get("SectionName");
        S && ee.set(S, { mat: f.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const S = f.get("Section");
        S && Y.set(S, { material: f.get("Material") || "", type: f.get("Type") || "Shell", thickness: G(f.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const S = f.get("Joint");
        if (S) {
          const b = G(f.get("XorR")), I = G(f.get("Y")), l = G(f.get("Z"));
          V.set(S, [b, I, l]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const S = f.get("Frame"), b = f.get("JointI"), I = f.get("JointJ");
        S && b && I && q.push({ name: S, j1: b, j2: I });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const S = f.get("Area");
        if (S) {
          const b = parseInt(f.get("NumJoints") || "4"), I = [];
          for (let l = 1; l <= b; l++) {
            const n = f.get(`Joint${l}`);
            n && I.push(n);
          }
          I.length >= 3 && K.push({ name: S, joints: I });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const S = f.get("Joint");
        if (S) {
          const b = [((_a = f.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = f.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = f.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = f.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = f.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = f.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          te.set(S, b);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const S = f.get("Joint");
        S && se.set(S, ["U1", "U2", "U3", "R1", "R2", "R3"].map((b) => parseFloat(f.get(b) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const S = f.get("Frame"), b = f.get("AnalSect");
        S && b && ie.set(S, b);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const S = f.get("Area"), b = f.get("Section");
        S && b && ce.set(S, b);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const S = f.get("Frame"), b = f.get("Dir"), I = G(f.get("FOverLA"));
        if (S && b && I) {
          const l = { X: 0, Y: 1, Z: 2 }[b];
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
          const b = [];
          for (let I = 1; I <= 8; I++) {
            const l = f.get(`Joint${I}`);
            l && b.push(l);
          }
          b.length === 8 && i.push({ name: S, joints: b });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const S = f.get("SolidProp");
        S && d.set(S, { material: f.get("Material") || "", incomp: (f.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const S = f.get("Solid"), b = f.get("SolidProp");
        S && b && D.set(S, b);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const S = f.get("Area");
        S && Se.set(S, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((b) => f.has(b) ? G(f.get(b)) : 1));
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const S = f.get("Frame");
        S && re.set(S, G(f.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const S = f.get("Frame");
        S && oe.set(S, [G(f.get("LengthI")), G(f.get("LengthJ")), G(f.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const S = f.get("Joint");
        S && ne.push({ joint: S, fx: G(f.get("F1")), fy: G(f.get("F2")), fz: G(f.get("F3")), mx: G(f.get("M1")), my: G(f.get("M2")), mz: G(f.get("M3")) });
        break;
      }
    }
  }
  return Gt(P, $, H, A, Y, V, q, K, te, ie, ce, ne, oe, re, Se, Me, i, d, D, z, ee, se);
}
function Kt(m) {
  const p = { force: "KN", length: "m" };
  let R = "UX,UY,UZ,RX,RY,RZ";
  const P = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), ee = [], A = [], Y = /* @__PURE__ */ new Map(), V = [], q = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ie = [], ce = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map();
  let oe = "", re = "";
  for (const i of m) {
    const d = i.trim();
    if (!d || d.startsWith(";")) continue;
    if (!i.startsWith(" ") && !i.startsWith("	")) {
      const y = d.toUpperCase();
      if (y === "END") break;
      y.startsWith("SHELL SECTION") ? oe = "SHELL SECTION" : y.startsWith("FRAME SECTION") ? oe = "FRAME SECTION" : oe = y.split(/\s+/)[0];
      continue;
    }
    const D = wt(d), v = d.split(/\s+/);
    switch (oe) {
      case "SYSTEM": {
        const y = D.get("DOF");
        y && (R = y);
        const N = D.get("LENGTH");
        N && (p.length = N);
        const f = D.get("FORCE");
        f && (p.force = f);
        break;
      }
      case "JOINT": {
        const y = v[0];
        z.set(y, [G(D.get("X")), G(D.get("Y")), G(D.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const y = D.get("ADD"), N = D.get("DOF");
        if (y && N) {
          const f = N.split(","), S = [false, false, false, false, false, false];
          for (const b of f) {
            const I = b.toUpperCase();
            (I === "UX" || I === "U1") && (S[0] = true), (I === "UY" || I === "U2") && (S[1] = true), (I === "UZ" || I === "U3") && (S[2] = true), (I === "RX" || I === "R1") && (S[3] = true), (I === "RY" || I === "R2") && (S[4] = true), (I === "RZ" || I === "R3") && (S[5] = true);
          }
          Y.set(y, S);
        }
        break;
      }
      case "MATERIAL": {
        const y = D.get("NAME");
        if (y) re = y, P.set(y, { E: 0, nu: 0, G: 0 });
        else if (re) {
          const N = P.get(re), f = D.get("E");
          f && (N.E = G(f));
          const S = D.get("U");
          S && (N.nu = G(S)), N.G = N.E / (2 * (1 + N.nu));
          const b = D.get("M");
          b && (N.density = G(b));
        }
        break;
      }
      case "SHELL": {
        const y = v[0], N = D.get("J");
        D.get("SEC"), N && A.push({ name: y, joints: N.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const y = D.get("NAME");
        y && H.set(y, { material: D.get("MAT") || "", type: D.get("TYPE") || "Shell", thickness: G(D.get("TH")) });
        break;
      }
      case "FRAME": {
        const y = v[0], N = D.get("J");
        if (N) {
          const f = N.split(",");
          f.length >= 2 && ee.push({ name: y, j1: f[0], j2: f[1] });
        }
        break;
      }
      case "LOAD": {
        const y = D.get("ADD");
        y && V.push({ joint: y, fx: G(D.get("UX")), fy: G(D.get("UY")), fz: G(D.get("UZ")), mx: G(D.get("MX")), my: G(D.get("MY")), mz: G(D.get("MZ")) });
        break;
      }
    }
  }
  return Gt(p, R, P, $, H, z, ee, A, Y, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), V, q, K, te, se, ie, ce, ne);
}
function Gt(m, p, R, P, $, H, z, ee, A, Y, V, q, K = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = [], ne = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), re, Se, Me = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const i = [], d = /* @__PURE__ */ new Map(), D = [];
  for (const [o, E] of H) d.set(o, D.length), i.push(o), D.push(E);
  const v = [], y = [], N = /* @__PURE__ */ new Map();
  for (const o of z) {
    const E = d.get(o.j1), u = d.get(o.j2);
    if (E !== void 0 && u !== void 0) {
      const U = v.length;
      v.push([E, u]), y.push(o.name);
      const O = Y.get(o.name);
      O && N.set(U, O);
    }
  }
  const f = v.length;
  for (const o of ee) {
    const E = o.joints.map((u) => d.get(u)).filter((u) => u !== void 0);
    if (E.length >= 3) {
      const u = v.length;
      v.push(E), y.push(o.name);
      const U = V.get(o.name);
      U && N.set(u, U);
    }
  }
  const S = v.length - f, b = [];
  for (const o of ce) {
    const E = o.joints.map((O) => d.get(O));
    if (E.some((O) => O === void 0)) continue;
    const u = v.length;
    v.push([E[0], E[1], E[3], E[2], E[4], E[5], E[7], E[6]]), y.push(o.name), b.push(u);
    const U = oe.get(o.name);
    U && N.set(u, U);
  }
  const I = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, l = /* @__PURE__ */ new Map(), n = R.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let o = 0; o < v.length; o++) {
    const E = N.get(o), u = E ? P.get(E) : null, U = E ? $.get(E) : null;
    if (u || v[o].length === 2) {
      const O = u || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, j = R.get(O.material) || n, C = j.E || n.E, Z = j.nu || 0.3, J = j.G || C / (2 * (1 + Z));
      I.elasticities.set(o, C), I.shearModuli.set(o, J), I.areas.set(o, O.A || O.D * O.B), I.momentsOfInertiaZ.set(o, O.Iz || O.B * O.D ** 3 / 12), I.momentsOfInertiaY.set(o, O.Iy || O.D * O.B ** 3 / 12), I.torsionalConstants.set(o, O.J || 0), I.densities.set(o, j.density || 0), O.As2 && (I.shearAreasZ ?? (I.shearAreasZ = /* @__PURE__ */ new Map()), I.shearAreasZ.set(o, O.As2)), O.As3 && (I.shearAreasY ?? (I.shearAreasY = /* @__PURE__ */ new Map()), I.shearAreasY.set(o, O.As3));
      const k = K.get(y[o]);
      k && (I.endOffsets ?? (I.endOffsets = /* @__PURE__ */ new Map()), I.endOffsets.set(o, k));
      const Q = te.get(y[o]);
      Q && (I.localAngles ?? (I.localAngles = /* @__PURE__ */ new Map()), I.localAngles.set(o, Q)), ((_a = O.shape) == null ? void 0 : _a.includes("Wide Flange")) || O.shape === "I" ? l.set(o, { type: "I", b: O.B, h: O.D, name: E || "I-section" }) : l.set(o, { type: "rect", b: O.B, h: O.D });
      const W = E ? re == null ? void 0 : re.get(E) : void 0;
      if (W && W.t > 0 && (W.b > 0 && W.h > 0 || (W.D ?? 0) > 0)) {
        const le = E ? Se == null ? void 0 : Se.get(E) : void 0, he = le && ((_b = R.get(le.mat)) == null ? void 0 : _b.E) || 0;
        l.set(o, W.D ? { type: "CFT", d: W.D, tw: W.t, name: E, ...he > 0 ? { fillE: he } : {} } : { type: "CFT", b: W.b, h: W.h, tw: W.t, ...W.tf && W.tf !== W.t ? { tf: W.tf } : {}, name: E, ...he > 0 ? { fillE: he } : {} });
      }
    } else if (U) {
      const O = R.get(U.material) || n, j = O.E || n.E, C = O.nu || 0.2, Z = O.G || j / (2 * (1 + C));
      I.elasticities.set(o, j), I.shearModuli.set(o, Z), I.thicknesses.set(o, U.thickness), I.poissonsRatios.set(o, C), I.plateFormulations ?? (I.plateFormulations = /* @__PURE__ */ new Map()), I.plateFormulations.set(o, /thin/i.test(U.type) ? 1 : 0);
      const J = /membrane/i.test(U.type), k = se.get(y[o]), Q = k && J ? [k[0], k[1], k[2], 0, 0, 0, 0, 0] : k;
      Q ? (I.shellModifiers ?? (I.shellModifiers = /* @__PURE__ */ new Map()), I.shellModifiers.set(o, Q), I.membraneModifiers ?? (I.membraneModifiers = /* @__PURE__ */ new Map()), I.membraneModifiers.set(o, Q[0]), I.bendingModifiers ?? (I.bendingModifiers = /* @__PURE__ */ new Map()), I.bendingModifiers.set(o, Q[3])) : J && (I.membraneModifiers ?? (I.membraneModifiers = /* @__PURE__ */ new Map()), I.membraneModifiers.set(o, 1), I.bendingModifiers ?? (I.bendingModifiers = /* @__PURE__ */ new Map()), I.bendingModifiers.set(o, 0)), I.densities.set(o, O.density || 0);
    }
  }
  if (b.length) {
    let o = false;
    for (const E of b) {
      const u = ne.get(N.get(E) || ""), U = u && R.get(u.material) || n, O = U.E || n.E, j = U.nu || 0.2;
      I.elasticities.set(E, O), I.poissonsRatios.set(E, j), I.shearModuli.set(E, U.G || O / (2 * (1 + j))), I.densities.set(E, U.density || 0), (u == null ? void 0 : u.incomp) && (o = true);
    }
    I.solidIncompatible = o;
  }
  const c = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [o, E] of A) {
    const u = d.get(o);
    u !== void 0 && c.supports.set(u, E);
  }
  {
    const o = [];
    for (const [E, u] of Me) {
      const U = d.get(E);
      U !== void 0 && u.forEach((O, j) => {
        O > 0 && o.push({ node: U, dof: j, k: O });
      });
    }
    o.length && (c.springs = o);
  }
  for (const [o, E] of ie) {
    const u = y.indexOf(o);
    if (u < 0 || v[u].length !== 2) continue;
    I.frameLoads ?? (I.frameLoads = /* @__PURE__ */ new Map()), I.frameLoads.set(u, E);
    const U = D[v[u][0]], O = D[v[u][1]], j = [O[0] - U[0], O[1] - U[1], O[2] - U[2]], C = Math.hypot(j[0], j[1], j[2]);
    if (C < 1e-9) continue;
    const Z = [j[0] / C, j[1] / C, j[2] / C], J = C * C / 12, k = [Z[1] * E[2] - Z[2] * E[1], Z[2] * E[0] - Z[0] * E[2], Z[0] * E[1] - Z[1] * E[0]], Q = (W, le) => {
      const he = c.loads.get(W) || [0, 0, 0, 0, 0, 0];
      for (let ue = 0; ue < 6; ue++) he[ue] += le[ue];
      c.loads.set(W, he);
    };
    Q(v[u][0], [E[0] * C / 2, E[1] * C / 2, E[2] * C / 2, J * k[0], J * k[1], J * k[2]]), Q(v[u][1], [E[0] * C / 2, E[1] * C / 2, E[2] * C / 2, -J * k[0], -J * k[1], -J * k[2]]);
  }
  for (const o of q) {
    const E = d.get(o.joint);
    if (E !== void 0) {
      const u = c.loads.get(E) || [0, 0, 0, 0, 0, 0];
      u[0] += o.fx, u[1] += o.fy, u[2] += o.fz, u[3] += o.mx, u[4] += o.my, u[5] += o.mz, c.loads.set(E, u);
    }
  }
  return { units: m, dof: p, materials: R, frameSections: P, shellSections: $, nodes: D, nodeNames: i, nodeNameToIdx: d, elements: v, elementNames: y, elementSections: N, nodeInputs: c, elementInputs: I, sectionShapes: l, info: { nNodes: D.length, nFrames: f, nShells: S, title: `SAP2000 (${f} frames, ${S} shells)` } };
}
function ns(m) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: p, elements: R, nodeInputs: P, elementInputs: $ } = m, H = { force: "KN", length: "m" };
  m.units && (m.units.force !== "KN" || m.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${m.units.force}, ${m.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const z = m.title || "Awatif Model", ee = [], A = (l) => ee.push(l), Y = () => ee.push(" ");
  A(`File ${z}.$2k was saved on m/d/yy at h:mm:ss`), Y(), A('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), A("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), Y();
  const V = [], q = (l) => {
    var _a2, _b2, _c2, _d2, _e2;
    const n = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(l)) || 0, c = (_b2 = $.poissonsRatios) == null ? void 0 : _b2.get(l), o = ((_c2 = $.shearModuli) == null ? void 0 : _c2.get(l)) || 0, E = c !== void 0 ? c : n > 0 && o > 0 ? Math.max(0, Math.min(0.5, n / (2 * o) - 1)) : 0.2, u = o > 0 ? o : n > 0 ? n / (2 * (1 + E)) : 0, U = (_d2 = $.sectionShapes) == null ? void 0 : _d2.get(l), O = (U == null ? void 0 : U.type) === "CFT" && U.steelRho > 0 ? U.steelRho : ((_e2 = $.densities) == null ? void 0 : _e2.get(l)) || 0;
    return { E: n, nu: E, G: u, rho: O, key: `MAT_${Math.round(n)}_n${E.toFixed(4)}` };
  }, K = [], te = [];
  if (R.forEach((l, n) => {
    l.length === 2 ? V.push(n) : l.length === 8 ? te.push(n) : K.push(n);
  }), V.length > 0) {
    A('TABLE:  "CONNECTIVITY - FRAME"');
    for (const l of V) {
      const n = R[l];
      A(`   Frame=${l + 1}   JointI=${n[0] + 1}   JointJ=${n[1] + 1}   IsCurved=No`);
    }
    Y();
  }
  if (K.length > 0) {
    A('TABLE:  "CONNECTIVITY - AREA"');
    for (const l of K) {
      const n = R[l], c = n.map((o, E) => `Joint${E + 1}=${o + 1}`).join("   ");
      A(`   Area=${l + 1}   NumJoints=${n.length}   ${c}`);
    }
    Y();
  }
  if (te.length > 0) {
    A('TABLE:  "CONNECTIVITY - SOLID"');
    for (const l of te) {
      const n = R[l], c = [n[0], n[1], n[3], n[2], n[4], n[5], n[7], n[6]];
      A(`   Solid=${l + 1}   ${c.map((o, E) => `Joint${E + 1}=${o + 1}`).join("   ")}`);
    }
    Y();
  }
  A('TABLE:  "COORDINATE SYSTEMS"'), A("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), Y(), A('TABLE:  "DATABASE FORMAT TYPES"'), A("   UnitsCurr=Yes   OverrideE=No"), Y();
  const se = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map();
  for (const l of V) {
    const n = ((_a = $.areas) == null ? void 0 : _a.get(l)) || 0, c = ((_b = $.momentsOfInertiaZ) == null ? void 0 : _b.get(l)) || 0, o = ((_c = $.momentsOfInertiaY) == null ? void 0 : _c.get(l)) || 0, E = ((_d = $.torsionalConstants) == null ? void 0 : _d.get(l)) || 0, u = ((_e = $.elasticities) == null ? void 0 : _e.get(l)) || 0, U = q(l).key, O = ((_f = $.shearAreasZ) == null ? void 0 : _f.get(l)) ?? 0, j = ((_g = $.shearAreasY) == null ? void 0 : _g.get(l)) ?? 0, C = (_h = $.sectionShapes) == null ? void 0 : _h.get(l);
    let Z;
    const J = (C == null ? void 0 : C.type) === "CFT" && C.d > 0 && C.tw > 0 && C.tw < C.d / 2 && !(C.b > 0 && C.h > 0);
    if (m.cftAs !== "general" && (C == null ? void 0 : C.type) === "CFT" && u > 0 && (J || C.b > 0 && C.h > 0 && C.tw > 0 && C.tw < Math.min(C.b, C.h) / 2)) {
      const W = J ? C.d - 2 * C.tw : 0, le = J ? 0 : C.b - 2 * C.tw, he = J ? 0 : C.h - 2 * (C.tf ?? C.tw), ue = J ? Math.PI * (C.d * C.d - W * W) / 4 : C.b * C.h - le * he, ge = J ? Math.PI * W * W / 4 : le * he, Ie = (C.fillE > 0 ? C.fillE / u : Math.max(0.01, Math.min(1, (n - ue) / ge))) * u, de = 0.2, Be = C.fillRho ?? 2.4, Le = `FILL_${Math.round(Ie)}_r${Be}`;
      ie.has(Le) || ie.set(Le, { E: Ie, nu: de, G: Ie / (2 * (1 + de)), rho: Be }), Z = J ? { b: C.d, h: C.d, t: C.tw, Ec: Ie, nuC: de, matFill: Le, D: C.d } : { b: C.b, h: C.h, t: C.tw, tf: C.tf ?? C.tw, Ec: Ie, nuC: de, matFill: Le };
    }
    const k = `A${n.toPrecision(6)}_Iz${c.toPrecision(6)}_s${O.toPrecision(6)}_${j.toPrecision(6)}${Z ? Z.D ? `_SDC${Z.D}x${Z.t}` : `_SD${Z.b}x${Z.h}x${Z.t}` : ""}`;
    if (!se.has(k)) {
      let W = 0.3, le = 0.3;
      n > 0 && c > 0 && (W = Math.sqrt(12 * c / n), le = n / W), se.set(k, { A: n, Iz: c, Iy: o, J: E, b: le, h: W, matKey: U, As2: O > 0 ? O : n * 5 / 6, As3: j > 0 ? j : n * 5 / 6, sd: Z });
    }
    const Q = [...se.keys()].indexOf(k) + 1;
    ce.set(l, `SEC${Q}`);
  }
  if (V.length > 0) {
    A('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const l of V) {
      const n = ce.get(l) || "SEC1";
      A(`   Frame=${l + 1}   AutoSelect=N.A.   AnalSect=${n}   MatProp=Default`);
    }
    Y();
  }
  if (se.size > 0) {
    A('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let l = 0;
    for (const [, n] of se) {
      if (l++, n.sd) {
        A(`   SectionName=SEC${l}   Material=${n.matKey}   Shape="SD Section"   Area=${F(n.A)}   TorsConst=${F(n.J)}   I33=${F(n.Iz)}   I22=${F(n.Iy)}   I23=0   AS2=${F(n.As2)}   AS3=${F(n.As3)} _`), A("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      A(`   SectionName=SEC${l}   Material=${n.matKey}   Shape=General   t3=${F(n.h)}   t2=${F(n.b)}   Area=${F(n.A)}   TorsConst=${F(n.J)}   I33=${F(n.Iz)}   I22=${F(n.Iy)}   I23=0   AS2=${F(n.As2)}   AS3=${F(n.As3)} _`), A("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    Y();
  }
  const ne = [...se.values()].map((l, n) => ({ sec: l, name: `SEC${n + 1}` })).filter((l) => l.sec.sd);
  if (ne.length > 0) {
    A('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: c } of ne) A(`   SectionName=${c}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    Y();
    const l = ne.filter((c) => !c.sec.sd.D), n = ne.filter((c) => c.sec.sd.D);
    if (l.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: c, name: o } of l) {
        const E = c.sd;
        A(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${c.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${F(E.h)}   Width=${F(E.b)}   FlngThick=${F(E.tf ?? E.t)}   WebThick=${F(E.t)}   Rotation=0 _`), A('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      Y();
    }
    if (n.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: c, name: o } of n) {
        const E = c.sd;
        A(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${c.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${F(E.D)}   WallThick=${F(E.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), A("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      Y();
    }
    if (l.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: c, name: o } of l) {
        const E = c.sd;
        A(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${E.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${F(E.h - 2 * (E.tf ?? E.t))}   Width=${F(E.b - 2 * E.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), A("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      Y();
    }
    if (n.length > 0) {
      A('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: c, name: o } of n) {
        const E = c.sd;
        A(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${E.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${F(E.D - 2 * E.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      Y();
    }
    A('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: c } of ne) A(`   SectionName=${c}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    Y();
  }
  {
    const l = V.filter((n) => {
      var _a2;
      const c = (_a2 = $.localAngles) == null ? void 0 : _a2.get(n);
      return c !== void 0 && isFinite(c) && Math.abs(c) > 1e-9;
    });
    if (l.length > 0) {
      A('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const n of l) A(`   Frame=${n + 1}   Angle=${F($.localAngles.get(n))}   AdvanceAxes=No`);
      Y();
    }
  }
  {
    const l = $.endOffsets, n = V.filter((c) => {
      const o = l == null ? void 0 : l.get(c);
      return !!o && (Math.abs(o[0]) > 1e-9 || Math.abs(o[1]) > 1e-9);
    });
    if (n.length > 0) {
      A('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const c of n) {
        const o = l.get(c);
        A(`   Frame=${c + 1}   Type=User   LengthI=${F(o[0])}   LengthJ=${F(o[1])}   RigidFactor=${F(o.length > 2 ? o[2] : 0)}`);
      }
      Y();
    }
  }
  const oe = !!m.layeredSection && K.length > 0, re = m.layeredSection, Se = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), i = $.shellModifiers, d = $.membraneModifiers, D = $.bendingModifiers, v = (l) => !(i == null ? void 0 : i.has(l)) && Math.abs((D == null ? void 0 : D.get(l)) ?? 1) < 1e-9;
  if (!oe) for (const l of K) {
    const n = ((_i = $.thicknesses) == null ? void 0 : _i.get(l)) || 0.1;
    (_j = $.elasticities) == null ? void 0 : _j.get(l);
    const c = q(l).key, o = v(l) ? 2 : ((_k = $.plateFormulations) == null ? void 0 : _k.get(l)) ?? 0, E = `t${n.toPrecision(6)}_f${o}`;
    Se.has(E) || Se.set(E, { t: n, matKey: c, formulacion: o });
    const u = [...Se.keys()].indexOf(E) + 1;
    Me.set(l, `SSEC${u}`);
  }
  if (K.length > 0) {
    A('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const c of K) {
      const o = oe ? re.name : Me.get(c) || "SSEC1";
      A(`   Area=${c + 1}   Section=${o}   MatProp=Default`);
    }
    Y();
    const l = (c) => {
      const o = i == null ? void 0 : i.get(c);
      if (o) return o;
      const E = (d == null ? void 0 : d.get(c)) ?? 1, u = v(c) ? 1 : (D == null ? void 0 : D.get(c)) ?? 1;
      return [E, E, E, u, u, u, u, u];
    }, n = K.filter((c) => {
      const o = l(c);
      return o && o.some((E) => Math.abs(E - 1) > 1e-12);
    });
    if (n.length > 0) {
      A('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const c of n) {
        const o = l(c);
        A(`   Area=${c + 1}   f11=${F(o[0])}   f22=${F(o[1])}   f12=${F(o[2])}   m11=${F(o[3])}   m22=${F(o[4])}   m12=${F(o[5])}   v13=${F(o[6])}   v23=${F(o[7])}   MassMod=1   WeightMod=1`);
      }
      Y();
    }
    if (A('TABLE:  "AREA SECTION PROPERTIES"'), oe) {
      const c = re, o = ((_l = c.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      A(`   Section=${c.name}   Material=${o}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${F(c.totalThickness)}   BendThick=${F(c.totalThickness)}   Color=Magenta`);
    } else {
      let c = 0;
      for (const [, o] of Se) {
        c++;
        const E = o.formulacion === 2 ? "Membrane" : o.formulacion === 3 ? "Plate-Thin" : o.formulacion === 4 ? "Plate-Thick" : o.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", u = o.formulacion === 3 || o.formulacion === 4 ? "No" : "Yes";
        A(`   Section=SSEC${c}   Material=${o.matKey}   MatAngle=0   AreaType=Shell   Type=${E}   DrillDOF=${u}   Thickness=${F(o.t)}   BendThick=${F(o.t)}   Color=Cyan`);
      }
    }
    if (Y(), oe) {
      A('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const c = re;
      for (const o of c.layers) {
        const E = o.angle ?? 0, u = o.numIntPts ?? 3;
        A(`   Section=${c.name}   LayerName=${o.name}   Distance=${F(o.distance)}   Thickness=${F(o.thickness)}   Type=Shell   NumIntPts=${u}   Material=${o.material}   MatAngle=${F(E * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      Y();
    }
  }
  A('TABLE:  "JOINT COORDINATES"');
  for (let l = 0; l < p.length; l++) {
    const n = p[l];
    A(`   Joint=${l + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${F(n[0])}   Y=${F(n[1])}   Z=${F(n[2])}   SpecialJt=No`);
  }
  if (Y(), P.supports && P.supports.size > 0) {
    A('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [l, n] of P.supports) {
      if (!n.some((o) => o)) continue;
      const c = (o) => o ? "Yes" : "No";
      A(`   Joint=${l + 1}   U1=${c(n[0])}   U2=${c(n[1])}   U3=${c(n[2])}   R1=${c(n[3])}   R2=${c(n[4])}   R3=${c(n[5])}`);
    }
    Y();
  }
  {
    const l = /* @__PURE__ */ new Map();
    for (const n of P.springs ?? []) {
      if (!(n.k > 0)) continue;
      const c = l.get(n.node) ?? [0, 0, 0, 0, 0, 0];
      c[n.dof] += n.k, l.set(n.node, c);
    }
    if (l.size > 0) {
      A('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [n, c] of [...l].sort((o, E) => o[0] - E[0])) A(`   Joint=${n + 1}   CoordSys=Global   U1=${F(c[0])}   U2=${F(c[1])}   U3=${F(c[2])}   R1=${F(c[3])}   R2=${F(c[4])}   R3=${F(c[5])}`);
      Y();
    }
  }
  const y = P.diaphragms;
  if (y && y.size > 0) {
    const l = /* @__PURE__ */ new Map();
    for (const [c, o] of y) {
      const E = Math.round(o);
      if (E === 0) continue;
      const u = Math.abs(E);
      l.has(u) || l.set(u, []), l.get(u).push(c);
    }
    const n = [...l].filter(([, c]) => c.length >= 2);
    if (n.length > 0) {
      A('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [c] of n) A(`   Name=DIAPH${c}   CoordSys=GLOBAL   Axis=Z`);
      Y(), A('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [c, o] of n) for (const E of o) A(`   Joint=${E + 1}   Constraint=DIAPH${c}`);
      Y();
    }
  }
  const N = m.selfWtMult ?? 1;
  A('TABLE:  "LOAD PATTERN DEFINITIONS"'), A(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${N}`), Y(), A('TABLE:  "LOAD CASE DEFINITIONS"'), A('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), Y(), A('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), A('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), Y();
  const f = $.frameLoads, S = /* @__PURE__ */ new Map();
  if ((_m = P.loads) == null ? void 0 : _m.forEach((l, n) => S.set(n, [...l])), f && f.size > 0) {
    const l = (n, c) => {
      const o = S.get(n) ?? [0, 0, 0, 0, 0, 0];
      S.set(n, o.map((E, u) => E - c[u]));
    };
    for (const [n, c] of f) {
      const o = R[n];
      if (!o || o.length !== 2) continue;
      const E = p[o[0]], u = p[o[1]], U = [u[0] - E[0], u[1] - E[1], u[2] - E[2]], O = Math.hypot(U[0], U[1], U[2]);
      if (O < 1e-9) continue;
      const j = [U[0] / O, U[1] / O, U[2] / O], C = O * O / 12, Z = [j[1] * c[2] - j[2] * c[1], j[2] * c[0] - j[0] * c[2], j[0] * c[1] - j[1] * c[0]];
      l(o[0], [c[0] * O / 2, c[1] * O / 2, c[2] * O / 2, C * Z[0], C * Z[1], C * Z[2]]), l(o[1], [c[0] * O / 2, c[1] * O / 2, c[2] * O / 2, -C * Z[0], -C * Z[1], -C * Z[2]]);
    }
  }
  if (S.size > 0) {
    A('TABLE:  "JOINT LOADS - FORCE"');
    for (const [l, n] of S) n.some((c) => Math.abs(c) > 1e-12) && A(`   Joint=${l + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${F(n[0])}   F2=${F(n[1])}   F3=${F(n[2])}   M1=${F(n[3])}   M2=${F(n[4])}   M3=${F(n[5])}`);
    Y();
  }
  const b = $.frameLoads;
  if (b && b.size > 0) {
    A('TABLE:  "FRAME LOADS - DISTRIBUTED"');
    for (const [l, n] of b) {
      const c = R[l];
      if (!c || c.length !== 2) continue;
      const o = p[c[0]], E = p[c[1]], u = Math.hypot(E[0] - o[0], E[1] - o[1], E[2] - o[2]);
      ["X", "Y", "Z"].forEach((U, O) => {
        Math.abs(n[O]) < 1e-12 || A(`   Frame=${l + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${U}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${F(u)}   FOverLA=${F(n[O])}   FOverLB=${F(n[O])}`);
      });
    }
    Y();
  }
  const I = /* @__PURE__ */ new Map();
  for (let l = 0; l < R.length; l++) {
    const { E: n, nu: c, G: o, rho: E, key: u } = q(l);
    I.has(u) || I.set(u, { E: n, nu: c, G: o, rho: E });
  }
  if (te.length > 0) {
    const l = $.solidIncompatible === false ? "No" : "Yes", n = /* @__PURE__ */ new Map();
    for (const c of te) {
      const { E: o, nu: E, G: u, rho: U, key: O } = q(c);
      I.has(O) || I.set(O, { E: o, nu: E, G: u, rho: U }), n.has(O) || n.set(O, `SOL${n.size + 1}`);
    }
    A('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [c, o] of n) A(`   SolidProp=${o}   Material=${c}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${l}   Color=Yellow`);
    Y(), A('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const c of te) A(`   Solid=${c + 1}   SolidProp=${n.get(q(c).key)}`);
    Y();
  }
  for (const [l, n] of ie) I.has(l) || I.set(l, n);
  A('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [l] of I) A(`   Material=${l}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  Y(), A('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [l, n] of I) A(`   Material=${l}   UnitWeight=${F(n.rho * 9.81)}   UnitMass=${F(n.rho)}   E1=${F(n.E)}   G12=${F(n.G)}   U12=${F(n.nu)}   A1=9.9E-06`);
  Y(), A('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [l] of I) A(`   Material=${l}   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0`);
  return Y(), A('TABLE:  "PROGRAM CONTROL"'), A(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${H.force}, ${H.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), Y(), A("END TABLE DATA"), A(""), ee.join(`\r
`);
}
function F(m) {
  return m === 0 || Math.abs(m) < 1e-15 ? "0" : Math.abs(m) >= 1e6 || Math.abs(m) < 1e-3 && Math.abs(m) > 0 ? m.toExponential(8) : parseFloat(m.toPrecision(10)).toString();
}
function Vt(m, p, R = 0.05) {
  const P = p.map(([$, H]) => `${(+$).toFixed(4)} ${(+H).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${m}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${R}  SPECTYPE "USER"  `, `  FUNCTION "${m}"  TIMEVAL "${P}"  `];
}
function qt(m) {
  const { name: p, func: R, modalCase: P = "Modal", sfX: $ = 9.81, sfY: H = 9.81 } = m, z = [`  LOADCASE "${p}"  TYPE  "Response Spectrum"  MODALCASE  "${P}"  `];
  return $ && z.push(`  LOADCASE "${p}"  ACCEL  "U1"  FUNC  "${R}"  SF  ${$}  `), H && z.push(`  LOADCASE "${p}"  ACCEL  "U2"  FUNC  "${R}"  SF  ${H}  `), z;
}
function Ft(m) {
  const { name: p = "Modal", ritz: R = false, nModes: P = 12 } = m;
  return R ? [`  LOADCASE "${p}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${p}"  MAXMODES  ${P} MINMODES  1 `, `  LOADCASE "${p}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${p}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${p}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${p}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${p}"  MAXMODES  ${P} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function as(m) {
  var _a;
  const p = (_a = m.e2kModel) == null ? void 0 : _a.rawSections;
  let R = p && p.size > 0 ? es(p, m.e2kModel) : ts(m);
  return m.seismicNEC && (R = Qt(R, m.seismicNEC)), R;
}
function Qt(m, p) {
  const R = m.includes(`\r
`) ? `\r
` : `
`, P = m.split(/\r?\n/), $ = p.name ?? "NEC", H = Vt($, p.points, p.dampRatio ?? 0.05), z = p.modalCase ?? "Modal", ee = qt({ name: p.caseName ?? "Sismo NEC", func: $, modalCase: z, sfX: p.sfX, sfY: p.sfY });
  let A = [];
  const Y = (V) => P.some((q) => V.test(q));
  if (p.modal) {
    const V = new RegExp(`^\\s*LOADCASE\\s+"${z}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let q = P.length - 1; q >= 0; q--) V.test(P[q]) && P.splice(q, 1);
    A = Ft({ name: z, ritz: !!p.modal.ritz, nModes: p.modal.nModes });
  } else Y(new RegExp(`LOADCASE\\s+"${z}"\\s+TYPE\\s+"Modal`)) || (A = Ft({ name: z }));
  return bt(P, "FUNCTIONS", H), bt(P, "LOAD CASES", [...A, ...ee]), P.join(R);
}
function bt(m, p, R) {
  const P = m.findIndex((z) => z.trim() === `$ ${p}`);
  if (P >= 0) {
    m.splice(P + 1, 0, ...R);
    return;
  }
  const $ = m.findIndex((z) => z.trim() === "END"), H = $ >= 0 ? $ : m.length;
  m.splice(H, 0, `$ ${p}`, ...R, "");
}
function es(m, p) {
  const R = [], P = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  R.push("$ File exported from Hekatan Struct Lineal (round-trip)"), R.push("");
  for (const $ of P) {
    const H = m.get($);
    if (!(!H || H.length === 0)) {
      R.push(`$ ${$}`);
      for (const z of H) R.push(z);
      R.push("");
    }
  }
  for (const [$, H] of m) if (!P.includes($) && H.length !== 0) {
    R.push(`$ ${$}`);
    for (const z of H) R.push(z);
    R.push("");
  }
  return R.push("  END"), R.push("$ END OF MODEL FILE"), R.join(`\r
`);
}
function ts(m) {
  var _a, _b, _c, _d, _e2, _f, _g;
  const { nodes: p, elements: R, nodeInputs: P, elementInputs: $, title: H, units: z } = m, ee = m.shellLoads ?? $.shellSurfaceLoads;
  let A;
  ee instanceof Map && (A = /* @__PURE__ */ new Map(), ee.forEach((e, t) => {
    A.set(t, typeof e == "number" ? { value: e } : e);
  }));
  const Y = m.shellAngles ?? $.shellAngles, V = $.cargaDeArea, q = !!(A && A.size > 0), K = $.selfWeight, te = $.frameLoads, se = (m.weightMode ?? "auto") === "auto" && K !== void 0, ie = /* @__PURE__ */ new Map(), ce = (e, t) => {
    const s = ie.get(e) ?? [0, 0, 0, 0, 0, 0];
    ie.set(e, s.map((a, r) => a + t[r]));
  }, ne = /* @__PURE__ */ new Set();
  if (se) {
    if (te) for (const [e, t] of te) {
      const s = R[e];
      if (!s || s.length !== 2) continue;
      const a = p[s[0]], r = p[s[1]], h = [r[0] - a[0], r[1] - a[1], r[2] - a[2]], T = Math.hypot(h[0], h[1], h[2]);
      if (T < 1e-9) continue;
      const M = [h[0] / T, h[1] / T, h[2] / T], L = T * T / 12, x = [M[1] * t[2] - M[2] * t[1], M[2] * t[0] - M[0] * t[2], M[0] * t[1] - M[1] * t[0]];
      ce(s[0], [t[0] * T / 2, t[1] * T / 2, t[2] * T / 2, L * x[0], L * x[1], L * x[2]]), ce(s[1], [t[0] * T / 2, t[1] * T / 2, t[2] * T / 2, -L * x[0], -L * x[1], -L * x[2]]), ne.add(e);
    }
    if (K && K > 0) {
      const t = $.endOffsets;
      R.forEach((s, a) => {
        var _a2, _b2, _c2;
        const r = ((_a2 = $.densities) == null ? void 0 : _a2.get(a)) ?? 0;
        if (r) {
          if (s.length === 2) {
            const h = ((_b2 = $.areas) == null ? void 0 : _b2.get(a)) ?? 0, T = p[s[0]], M = p[s[1]], L = [M[0] - T[0], M[1] - T[1], M[2] - T[2]];
            let x = Math.hypot(L[0], L[1], L[2]);
            const g = t == null ? void 0 : t.get(a);
            if (g) {
              const w = Math.hypot(L[0], L[1]);
              w > 1e-9 && Math.abs(Math.atan2(Math.abs(L[2]), w)) * 180 / Math.PI < 20 && (x = Math.max(x - g[0] - g[1], 0));
            }
            const B = h * x * r * 9.80665 * K;
            ce(s[0], [0, 0, -B / 2, 0, 0, 0]), ce(s[1], [0, 0, -B / 2, 0, 0, 0]);
          } else if (s.length === 4) {
            const h = ((_c2 = $.thicknesses) == null ? void 0 : _c2.get(a)) ?? 0, T = s.map((w) => p[w]);
            let M = 0, L = 0, x = 0;
            for (let w = 0; w < 4; w++) {
              const _ = T[w], X = T[(w + 1) % 4];
              M += _[1] * X[2] - _[2] * X[1], L += _[2] * X[0] - _[0] * X[2], x += _[0] * X[1] - _[1] * X[0];
            }
            const g = Math.hypot(M, L, x) / 2, B = h * g * r * 9.80665 * K;
            for (const w of s) ce(w, [0, 0, -B / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const oe = (e, t) => {
    const s = ie.get(e);
    return [t[0] - ((s == null ? void 0 : s[0]) ?? 0), t[1] - ((s == null ? void 0 : s[1]) ?? 0), t[2] - (q ? (V == null ? void 0 : V.get(e)) ?? 0 : 0) - ((s == null ? void 0 : s[2]) ?? 0)];
  }, re = (e, t) => {
    const s = ie.get(e);
    return [(t[3] ?? 0) - ((s == null ? void 0 : s[3]) ?? 0), (t[4] ?? 0) - ((s == null ? void 0 : s[4]) ?? 0), (t[5] ?? 0) - ((s == null ? void 0 : s[5]) ?? 0)];
  }, Se = "N", Me = "MM", i = [], d = (e) => Math.round(e * 1e4) / 1e4, D = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), v = 1e3, y = 1e3, N = (e) => e * y, f = (e) => e * v, S = (e) => e * v, b = (e) => e * v * y, I = (e) => e * v / y ** 2, l = (e) => e * v / y ** 3, n = /* @__PURE__ */ new Date(), c = `${n.getMonth() + 1}/${n.getDate()}/${n.getFullYear()}  ${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`;
  i.push(`$ File   "Hekatan_export.e2k"  saved ${c} in ETABS 22.6.0`), i.push(""), i.push("$ PROGRAM INFORMATION"), i.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), i.push(""), i.push("$ CONTROLS"), i.push(`  UNITS  "${Se}"  "${Me}"  "C"  `), i.push('  TITLE1  "Hekatan Struct Lineal export"  '), H && i.push(`  TITLE2  "${H}"  `), i.push("  PREFERENCE  MERGETOL 0.001"), i.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), i.push("");
  const o = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Set();
  p.forEach((e) => {
    o.add(d(e[0])), E.add(d(e[1]));
  });
  const u = [...o].sort((e, t) => e - t), U = [...E].sort((e, t) => e - t);
  i.push("$ GRIDS"), i.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), u.forEach((e, t) => {
    const s = t < 26 ? String.fromCharCode(65 + t) : String.fromCharCode(65 + t % 26).repeat(Math.floor(t / 26) + 1);
    i.push(`  GRID "G1"  LABEL "${s}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), U.forEach((e, t) => {
    i.push(`  GRID "G1"  LABEL "${t + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), i.push("");
  const O = 3, j = 0.5, C = /* @__PURE__ */ new Map();
  p.forEach((e) => {
    const t = d(e[2]);
    C.set(t, (C.get(t) ?? 0) + 1);
  });
  const Z = /* @__PURE__ */ new Set();
  p.forEach((e) => Z.add(d(e[2])));
  const J = [...Z].sort((e, t) => e - t);
  let k = J.filter((e) => (C.get(e) ?? 0) >= O);
  if (k.length > 1) {
    const e = [k[0]];
    for (const t of k.slice(1)) t - e[e.length - 1] < j ? e[e.length - 1] = t : e.push(t);
    k = e;
  }
  J.length || J.push(0, 3), k.length || (k = [J[0], J[J.length - 1]]), k[0] !== J[0] && k.unshift(J[0]), k[k.length - 1] !== J[J.length - 1] && k.push(J[J.length - 1]);
  const Q = [], W = /* @__PURE__ */ new Map();
  Q.push("Base"), W.set(k[0], "Base");
  for (let e = 1; e < k.length; e++) {
    const t = `Level_${e}`;
    Q.push(t), W.set(k[e], t);
  }
  const le = (e) => {
    const t = d(e);
    if (W.has(t)) return { story: W.get(t), dz: 0 };
    for (let a = 0; a < k.length; a++) if (k[a] >= t) return { story: W.get(k[a]), dz: d(k[a] - t) };
    const s = k[k.length - 1];
    return { story: W.get(s), dz: d(s - t) };
  };
  i.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = k.length - 1; e >= 1; e--) i.push(`  STORY "${Q[e]}"  HEIGHT ${d(N(k[e] - k[e - 1]))} MASTERSTORY "Yes"  `);
  k.length > 0 && i.push(`  STORY "Base"  ELEV ${d(N(k[0]))} `), i.push(""), R.some((e) => e.length === 4), i.push("$ DIAPHRAGM NAMES"), i.push('  DIAPHRAGM "D1"    TYPE RIGID'), i.push(""), i.push("$ MATERIAL PROPERTIES");
  const he = 980665e-8, ue = (e) => {
    var _a2, _b2, _c2;
    const t = (_a2 = $.sectionShapes) == null ? void 0 : _a2.get(e);
    if ((t == null ? void 0 : t.type) === "CFT" && t.steelRho > 0) return t.steelRho * 9.80665;
    const s = (_b2 = $.densities) == null ? void 0 : _b2.get(e);
    if (s === void 0) return;
    const a = s > 100 ? s * he : s * 9.80665, r = (_c2 = $.deckSections) == null ? void 0 : _c2.get(e);
    if (r && r.tc > 0) {
      const h = r.tc + (r.sr > 0 ? r.hr * (r.wrt + r.wrb) / 2 / r.sr : 0);
      return (a * r.tc - r.w) / h;
    }
    return a;
  }, ge = (e) => {
    var _a2;
    const t = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, s = ue(e);
    return `${t}|${s === void 0 ? "-" : s.toFixed(4)}`;
  }, _e = /* @__PURE__ */ new Set();
  (_a = $.elasticities) == null ? void 0 : _a.forEach((e, t) => _e.add(ge(t)));
  const Ie = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map();
  let Be = 0, Le = 0;
  for (const e of _e) {
    const t = parseFloat(e.split("|")[0]), s = e.split("|")[1], a = t >= 1e8, r = a ? `Steel_${++Be}` : `Conc_${++Le}`;
    Ie.set(e, r), de.set(e, a);
    const h = s !== "-" ? parseFloat(s) : a ? 76.97 : 24, T = I(t), M = l(h), L = (() => {
      const B = m.elementInputs.poissonsRatios;
      if (B) {
        for (const [w, _] of B) if (ge(w) === e) return _;
      }
    })(), x = L !== void 0 ? L : a ? 0.3 : 0.2, g = a ? 117e-7 : 1e-5;
    if (a) {
      i.push(`  MATERIAL  "${r}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${D(M)}`), i.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${d(T)}  U ${x}  A ${g}`);
      const B = 345e3, w = 45e4;
      i.push(`  MATERIAL  "${r}"  FY ${d(I(B))}  FU ${d(I(w))}  FYE ${d(I(B * 1.1))}  FUE ${d(I(w * 1.1))}`);
    } else i.push(`  MATERIAL  "${r}"    TYPE "Concrete"    WEIGHTPERVOLUME ${D(M)}`), i.push(`  MATERIAL  "${r}"    SYMTYPE "Isotropic"  E ${d(T)}  U ${x}  A ${g}`), i.push(`  MATERIAL  "${r}"    FC ${d(I(24e3))}`);
  }
  const lt = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = $.sectionShapes) == null ? void 0 : _b.forEach((s, a) => {
      var _a2;
      if ((s == null ? void 0 : s.type) !== "CFT" || !(s.fillE > 0) || !((((_a2 = $.elasticities) == null ? void 0 : _a2.get(a)) ?? 0) > 0)) return;
      const h = (s.fillRho ?? 2.4) * 9.80665, T = `${s.fillE}|${h.toFixed(4)}`;
      let M = e.get(T);
      M || (M = `ConcFill_${e.size + 1}`, e.set(T, M), i.push(`  MATERIAL  "${M}"    TYPE "Concrete"    WEIGHTPERVOLUME ${D(l(h))}`), i.push(`  MATERIAL  "${M}"    SYMTYPE "Isotropic"  E ${d(I(s.fillE))}  U 0.2  A 1.0e-5`), i.push(`  MATERIAL  "${M}"    FC ${d(I(24e3))}`)), lt.set(a, M);
    });
  }
  i.push(""), i.push("$ FRAME SECTIONS");
  const Ye = /* @__PURE__ */ new Set(), Ze = /* @__PURE__ */ new Map(), ke = /* @__PURE__ */ new Map(), Ne = 0.05;
  R.forEach((e, t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const s = (_a2 = $.sectionShapes) == null ? void 0 : _a2.get(t), a = ((_b2 = $.elasticities) == null ? void 0 : _b2.get(t)) ?? 0, r = Ie.get(ge(t)) || "Conc_1", h = de.get(ge(t)) ?? a >= 1e8, T = ((_c2 = $.areas) == null ? void 0 : _c2.get(t)) ?? 0, M = ((_d2 = $.momentsOfInertiaZ) == null ? void 0 : _d2.get(t)) ?? 0, L = ((_e3 = $.momentsOfInertiaY) == null ? void 0 : _e3.get(t)) ?? 0, x = ((_f2 = $.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
    let g = (s == null ? void 0 : s.type) || "rect", B = (s == null ? void 0 : s.h) ?? 0, w = (s == null ? void 0 : s.b) ?? 0, _ = (s == null ? void 0 : s.d) ?? 0;
    const X = (s == null ? void 0 : s.tf) ?? 0, ae = (s == null ? void 0 : s.tw) ?? 0;
    if (!s && B <= 0 && w <= 0 && _ <= 0 && T > 0 && M > 0 && L > 0) {
      const Te = (_g2 = $.cantos) == null ? void 0 : _g2.get(t), Ge = (_h = $.anchos) == null ? void 0 : _h.get(t);
      B = Te && Te > 0 ? Te : Math.sqrt(12 * M / T), w = Ge && Ge > 0 ? Ge : T / B, (!isFinite(B) || B < Ne) && (B = Ne), (!isFinite(w) || w < Ne) && (w = Ne), g = "general";
    } else B <= 0 && w <= 0 && _ <= 0 && T > 0 && (M > 0 ? (B = Math.sqrt(12 * M / T), w = T / B) : B = w = Math.sqrt(T), (!isFinite(B) || B < Ne) && (B = Ne), (!isFinite(w) || w < Ne) && (w = Ne), g = "rect");
    B <= 0 && w <= 0 && _ <= 0 && (B = 0.3, w = 0.3, g = "rect");
    const je = (s == null ? void 0 : s.name) ? `NAME_${s.name}` : `${g}_${d(B)}_${d(w)}_${d(_)}_${d(X)}_${d(ae)}_${r}`;
    (s == null ? void 0 : s.name) && !ke.has(je) && ke.set(je, s.name);
    let fe = ke.get(je);
    if (!fe) {
      const Te = h ? "S" : "C";
      g === "general" ? fe = `${Te}_G${Ye.size + 1}` : g === "rect" ? fe = `${Te}_R${Math.round(w * 100)}x${Math.round(B * 100)}` : g === "circ" ? fe = `${Te}_C_D${Math.round(_ * 100)}` : g === "I" ? fe = `${Te}_I${Math.round(B * 100)}x${Math.round(w * 100)}` : g === "HSS" ? fe = `${Te}_HSS${Math.round(w * 100)}x${Math.round(B * 100)}x${Math.round(ae * 1e3)}` : fe = `${Te}_Sec${Ye.size + 1}`, ke.set(je, fe);
    }
    if (Ze.set(t, fe), Ye.has(fe)) return;
    Ye.add(fe);
    const Je = lt.get(t);
    if (g === "CFT" && Je && _ > 0 && ae > 0 && !(B > 0 && w > 0)) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Filled Steel Pipe"  D ${d(N(_))} T ${d(N(ae))} FILLMATERIAL "${Je}"`);
      return;
    }
    if (g === "CFT" && Je && B > 0 && w > 0 && ae > 0) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "Filled Steel Tube"  D ${d(N(B))} B ${d(N(w))} TF ${d(N(X > 0 ? X : ae))} TW ${d(N(ae))} FILLMATERIAL "${Je}"`);
      return;
    }
    const Zt = T > 0 && M > 0 && L > 0;
    let Ae;
    g === "general" || Zt ? Ae = "General" : g === "I" ? Ae = "Steel I/Wide Flange" : g === "HSS" ? Ae = "Steel Tube" : g === "CFT" ? Ae = "Filled Steel Tube" : g === "pipe" ? Ae = "Steel Pipe" : g === "L" ? Ae = "Steel Angle" : g === "C" ? Ae = "Steel Channel" : g === "2C" ? Ae = "Steel Double Channel" : g === "circ" ? Ae = "Concrete Circle" : Ae = "Concrete Rectangular";
    let Oe = `  FRAMESECTION  "${fe}"  MATERIAL "${r}"  SHAPE "${Ae}"`;
    if (Ae === "General") {
      const Te = ((_i = $.shearAreasZ) == null ? void 0 : _i.get(t)) || T * 5 / 6, Ge = ((_j = $.shearAreasY) == null ? void 0 : _j.get(t)) || T * 5 / 6;
      Oe += `  D ${d(N(B))} B ${d(N(w))} AREA ${D(T * 1e6)} AS2 ${D(Te * 1e6)} AS3 ${D(Ge * 1e6)} I33 ${D(M * 1e12)} I22 ${D(L * 1e12)} TORSION ${D((x || M + L) * 1e12)} S33POS ${D(2 * M / B * 1e9)} S33NEG ${D(2 * M / B * 1e9)} S22POS ${D(2 * L / w * 1e9)} S22NEG ${D(2 * L / w * 1e9)} Z33 ${D(2 * M / B * 1e9)} Z22 ${D(2 * L / w * 1e9)} R33 ${D(Math.sqrt(M / T) * 1e3)} R22 ${D(Math.sqrt(L / T) * 1e3)} `, i.push(Oe);
      return;
    }
    B && (Oe += `  D ${d(N(B))}`), w && (Oe += `  B ${d(N(w))}`), _ && !B && (Oe += `  D ${d(N(_))}`), X && (Oe += `  TF ${d(N(X))}`), ae && (Oe += `  TW ${d(N(ae))}`), i.push(Oe);
  }), i.push("");
  const Ue = /* @__PURE__ */ new Map();
  let Bt = 0;
  p.forEach((e) => {
    const { dz: t } = le(e[2]), s = `${d(e[0])},${d(e[1])},${t}`;
    Ue.has(s) || Ue.set(s, `${++Bt}`);
  });
  const xe = /* @__PURE__ */ new Map(), Xe = [];
  {
    const e = /* @__PURE__ */ new Map();
    for (const s of P.springs ?? []) {
      if (!(s.k > 0)) continue;
      const a = e.get(s.node) ?? [0, 0, 0, 0, 0, 0];
      a[s.dof] += s.k, e.set(s.node, a);
    }
    const t = /* @__PURE__ */ new Map();
    for (const [s, a] of e) {
      const r = a.map((M, L) => L < 3 ? M * v / y : M * v * y), h = r.map((M) => +M.toPrecision(12)).join("|");
      let T = t.get(h);
      if (!T) {
        T = `SPR${t.size + 1}`, t.set(h, T);
        const M = ["UX", "UY", "UZ", "RX", "RY", "RZ"], L = r.map((x, g) => `${M[g]}  ${+x.toPrecision(12)}`);
        Xe.push(`  POINTSPRING  "${T}"  NONLINEARSPECOPTION  "LINKS"  ${L.join(" ")} `);
      }
      xe.set(s, T);
    }
    Xe.length && (i.push("$ POINT SPRING PROPERTIES"), Xe.forEach((s) => i.push(s)), i.push(""));
  }
  i.push("$ POINT COORDINATES");
  for (const [e, t] of Ue) {
    const [s, a, r] = e.split(",").map(Number);
    i.push(r ? `  POINT "${t}"  ${d(N(s))} ${d(N(a))} ${d(N(r))} ` : `  POINT "${t}"  ${d(N(s))} ${d(N(a))} `);
  }
  i.push("");
  const pe = (e) => {
    const t = p[e], { story: s, dz: a } = le(t[2]), r = `${d(t[0])},${d(t[1])},${a}`;
    return { pt: Ue.get(r) || "1", story: s };
  }, Et = (e) => {
    var _a2, _b2, _c2, _d2, _e3, _f2;
    const t = [], s = (_a2 = m.propertyModifiers) == null ? void 0 : _a2.get(e);
    s && s.some((g) => Math.abs(g - 1) > 1e-9) && t.push(`PROPMODIFIERS "${s.map((g) => d(g)).join(" ")}"`);
    const a = (_b2 = $.localAngles) == null ? void 0 : _b2.get(e);
    a !== void 0 && isFinite(a) && Math.abs(a) > 1e-9 && t.push(`ANG ${d(a)}`);
    const r = (_c2 = $.momentReleases) == null ? void 0 : _c2.get(e);
    if (r && r.some((g) => g)) {
      const g = [];
      r.length === 12 ? (r[0] && g.push("PI"), r[1] && g.push("V2I"), r[2] && g.push("V3I"), r[3] && g.push("TI"), r[4] && g.push("M2I"), r[5] && g.push("M3I"), r[6] && g.push("PJ"), r[7] && g.push("V2J"), r[8] && g.push("V3J"), r[9] && g.push("TJ"), r[10] && g.push("M2J"), r[11] && g.push("M3J")) : r.length === 6 && (r[0] && g.push("TI"), r[1] && g.push("M2I"), r[2] && g.push("M3I"), r[3] && g.push("TJ"), r[4] && g.push("M2J"), r[5] && g.push("M3J")), g.length > 0 && t.push(`RELEASE "${g.join(" ")}"`);
    }
    const h = (_d2 = $.insertionPoints) == null ? void 0 : _d2.get(e);
    h && (Math.abs(h[0]) > 1e-9 || Math.abs(h[1]) > 1e-9) && t.push(`LATEROFFSET ${d(N(h[0]))} TRANSOFFSET ${d(N(h[1]))}`);
    const T = (_e3 = $.rigidOffsets) == null ? void 0 : _e3.get(e), M = (_f2 = $.endOffsets) == null ? void 0 : _f2.get(e), L = M ? [M[0], M[1]] : T, x = M && M.length > 2 ? M[2] : 0;
    return L && (Math.abs(L[0]) > 1e-9 || Math.abs(L[1]) > 1e-9) && t.push(`LENGTHOFFI ${d(N(L[0]))} LENGTHOFFJ ${d(N(L[1]))} RIGIDZONE ${d(x)}`), t.length > 0 ? ` ${t.join(" ")} ` : "";
  }, Ke = [], ft = /* @__PURE__ */ new Set(), He = /* @__PURE__ */ new Map();
  R.forEach((e, t) => {
    if (e.length !== 2) return;
    const s = yt(p, e);
    if (s === "BEAM") return;
    const a = p[e[0]][2] <= p[e[1]][2] ? e[0] : e[1], r = p[e[0]][2] <= p[e[1]][2] ? e[1] : e[0];
    if (Math.abs(p[a][0] - p[r][0]) > 1e-6 || Math.abs(p[a][1] - p[r][1]) > 1e-6) return;
    const h = pe(a), T = Ze.get(t) || `Sec_${t}`, M = `${h.pt}_${T}_${s}`;
    He.has(M) || He.set(M, []), He.get(M).push({ i: t, bot: a, top: r, zBot: d(p[a][2]), zTop: d(p[r][2]), planPt: h.pt, secName: T, type: s });
  }), He.forEach((e, t) => {
    e.sort((a, r) => a.zBot - r.zBot);
    let s = 0;
    for (let a = 1; a <= e.length; a++) if (a === e.length || Math.abs(e[a].zBot - e[a - 1].zTop) > 1e-6) {
      const h = e.slice(s, a);
      h.length >= 1 && (Ke.push({ elemIndices: h.map((T) => T.i), planPt: h[0].planPt, bottomNodeIdx: h[0].bot, topNodeIdx: h[h.length - 1].top, secName: h[0].secName, type: h[0].type, nSegments: h.length }), h.forEach((T) => ft.add(T.i))), s = a;
    }
  }), i.push("$ LINE CONNECTIVITIES");
  const Ve = [], ve = (e) => Q.indexOf(e), St = /* @__PURE__ */ new Map(), ht = (e, t, s, a, r, h, T, M) => {
    const L = pe(a), x = pe(s);
    M !== void 0 && St.set(M, { name: e, story: L.story });
    const g = ve(L.story) - ve(x.story);
    g <= 0 ? i.push(`  LINE  "${e}"  BEAM  "${x.pt}"  "${L.pt}"  0`) : i.push(`  LINE  "${e}"  ${t}  "${x.pt}"  "${L.pt}"  ${g}`), Ve.push(`  LINEASSIGN  "${e}"  "${L.story}"  SECTION "${r}" ${h} MINNUMSTA ${T} AUTOMESH "YES"  MESHATINTERSECTIONS "${$.meshAtIntersections === false ? "NO" : "YES"}"  `);
  }, pt = /* @__PURE__ */ new Map();
  Ke.forEach((e, t) => {
    const s = Et(e.elemIndices[0]), a = [];
    let r = [];
    e.elemIndices.forEach((h, T) => {
      r.push(h);
      const [M, L] = R[h], x = p[M][2] >= p[L][2] ? M : L;
      (le(p[x][2]).dz === 0 || T === e.elemIndices.length - 1) && (a.push(r), r = []);
    }), a.forEach((h) => {
      const [T, M] = R[h[0]], L = p[T][2] <= p[M][2] ? T : M, [x, g] = R[h[h.length - 1]], B = p[x][2] >= p[g][2] ? x : g;
      ve(pe(B).story) - ve(pe(L).story);
      let w = `C${t + 1}`;
      for (let _ = 1; ; _++) {
        const X = i.length;
        ht(w, e.type, L, B, e.secName, s, h.length);
        const ae = i[X], rt = pt.get(w);
        if (rt === void 0) {
          pt.set(w, ae);
          break;
        }
        if (i.splice(X, i.length - X), rt === ae) break;
        Ve.pop(), w = `C${t + 1}_${_}`;
      }
    });
  }), R.forEach((e, t) => {
    if (e.length !== 2 || ft.has(t)) return;
    const s = yt(p, e), a = Ze.get(t) || `Sec_${t}`, r = Et(t), h = p[e[0]][2] <= p[e[1]][2] ? e[0] : e[1], T = p[e[0]][2] <= p[e[1]][2] ? e[1] : e[0];
    ht(`E${t + 1}`, s === "BEAM" ? "BRACE" : s, h, T, a, r, 3, t);
  }), i.push("");
  const Pe = m.weightMode ?? "auto", $e = /* @__PURE__ */ new Set();
  i.push("$ POINT ASSIGNS"), (_c = P.supports) == null ? void 0 : _c.forEach((e, t) => {
    const s = [];
    if (e[0] && s.push("UX"), e[1] && s.push("UY"), e[2] && s.push("UZ"), e[3] && s.push("RX"), e[4] && s.push("RY"), e[5] && s.push("RZ"), s.length > 0) {
      const a = pe(t), r = a.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", h = xe.has(t) ? ` SPRINGPROP "${xe.get(t)}" ` : "";
      i.push(`  POINTASSIGN  "${a.pt}"  "${a.story}"  RESTRAINT "${s.join(" ")}" ${r}${h} `), $e.add(`${a.pt}@${a.story}`);
    }
  });
  for (const [e, t] of xe) {
    const s = pe(e);
    $e.has(`${s.pt}@${s.story}`) || (i.push(`  POINTASSIGN  "${s.pt}"  "${s.story}"  SPRINGPROP "${t}" `), $e.add(`${s.pt}@${s.story}`));
  }
  const Yt = !!(P.diaphragms && [...P.diaphragms.values()].some((e) => e !== 0)), At = m.diaphragm ?? "auto", qe = At === "d1" || At === "auto" && Yt, Fe = /* @__PURE__ */ new Set();
  P.diaphragms && P.diaphragms.forEach((e, t) => {
    e !== 0 && Fe.add(t);
  }), qe && Fe.size ? Fe.forEach((e) => {
    const t = pe(e), s = `${t.pt}@${t.story}`;
    !$e.has(s) && t.story !== "Base" && (i.push(`  POINTASSIGN  "${t.pt}"  "${t.story}"  DIAPH "D1"  `), $e.add(s));
  }) : qe && Ke.forEach((e) => {
    for (const t of e.elemIndices) {
      const [s, a] = R[t], r = p[s][2] >= p[a][2] ? s : a, h = pe(r), T = `${h.pt}@${h.story}`;
      !$e.has(T) && h.story !== "Base" && (i.push(`  POINTASSIGN  "${h.pt}"  "${h.story}"  DIAPH "D1"  `), $e.add(T));
    }
  }), Pe === "manual" && P.loads && P.loads.forEach((e, t) => {
    const [s, a, r] = oe(t, e);
    if (Math.abs(s) < 1e-10 && Math.abs(a) < 1e-10 && Math.abs(r) < 1e-10) return;
    const h = pe(t), T = `${h.pt}@${h.story}`;
    $e.has(T) || (i.push(`  POINTASSIGN  "${h.pt}"  "${h.story}"  DIAPH "DISCONNECTED"  `), $e.add(T));
  }), i.push(""), i.push("$ LINE ASSIGNS"), Ve.forEach((e) => i.push(e)), i.push("");
  const Ee = [], Tt = $.areaObjects, Mt = /* @__PURE__ */ new Set(), It = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map();
  Tt == null ? void 0 : Tt.forEach((e) => e.cells.forEach((t) => Mt.add(t))), R.forEach((e, t) => {
    if (e.length === 4 || e.length === 3) {
      const s = p[e[0]], a = p[e[1]], r = p[e[2]], h = [a[0] - s[0], a[1] - s[1], a[2] - s[2]], T = [r[0] - s[0], r[1] - s[1], r[2] - s[2]], M = h[1] * T[2] - h[2] * T[1], L = h[2] * T[0] - h[0] * T[2], x = h[0] * T[1] - h[1] * T[0], g = Math.sqrt(M * M + L * L + x * x), B = g > 1e-10 && Math.abs(x) / g < 0.5;
      Ee.push({ idx: t, el: e, isWall: B }), Mt.has(t) && Ee.pop();
    }
  });
  const me = (() => {
    for (const [e, t] of de) if (!t) return Ie.get(e);
    return Ie.values().next().value || "Conc_1";
  })();
  Tt == null ? void 0 : Tt.forEach((e, t) => {
    Ee.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && It.set(e.cells[0], e.q), e.ang !== void 0 && dt.set(e.cells[0], e.ang);
  });
  const De = "DECK";
  let Qe = false;
  const et = [], $t = (e) => {
    const t = m.elementInputs.plateFormulations, s = Ee.find((r) => r.isWall === e), a = t && s ? t.get(s.idx) : void 0;
    return a === 2 ? "Membrane" : a === 1 ? "ShellThin" : "ShellThick";
  }, mt = (e, t) => {
    const s = m.elementInputs.thicknesses, a = Ee.find((r) => r.isWall === e);
    return (a ? s == null ? void 0 : s.get(a.idx) : void 0) ?? (s == null ? void 0 : s.values().next().value) ?? t;
  }, ut = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], We = (e) => {
    var _a2;
    const s = (_a2 = $.shellModifiers) == null ? void 0 : _a2.get(e);
    if (s && s.length >= 8) return s.slice(0, 8);
    const a = $.membraneModifiers, r = $.bendingModifiers, h = a == null ? void 0 : a.get(e), T = r == null ? void 0 : r.get(e);
    if (h === void 0 && T === void 0) return null;
    const M = h ?? 1, L = T ?? 1;
    return [M, M, M, L, L, L, L, L];
  }, gt = (e, t) => {
    const s = Ee.filter((T) => T.isWall === t), a = /* @__PURE__ */ new Map();
    for (const T of s) {
      const M = We(T.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      a.set(M.map((L) => d(L)).join(","), M);
    }
    if (a.size === 0) return "";
    a.size > 1 && console.warn(`[e2k] "${e}": ${a.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const r = a.values().next().value, h = ut.map((T, M) => Math.abs(r[M] - 1) > 1e-9 ? `${T} ${d(r[M])}` : "").filter(Boolean);
    return h.length ? `  SHELLPROP  "${e}"  ${h.join(" ")} ` : "";
  }, Nt = m.elementInputs.thicknesses, Ot = m.elementInputs.plateFormulations, be = (e) => {
    var _a2;
    const t = Nt == null ? void 0 : Nt.get(e.idx), s = Ot == null ? void 0 : Ot.get(e.idx), a = We(e.idx), r = (_a2 = m.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), h = r ? [r.tc, r.hr, r.wrt, r.wrb, r.sr, r.w].map((T) => d(T)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${t ?? "-"}|${s ?? "-"}|${a ? a.map((T) => d(T)).join(",") : "-"}|${ge(e.idx)}|${h}`;
  }, tt = (e) => {
    var _a2;
    if ((_a2 = m.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const t = We(e);
    return t ? Math.abs(t[3]) < 1e-9 && Math.abs(t[4]) < 1e-9 : false;
  }, ye = /* @__PURE__ */ new Map();
  let kt = 0, Ut = 0, xt = 0;
  for (const e of Ee) {
    const t = be(e);
    if (ye.has(t)) continue;
    const s = e.isWall, a = !s && tt(e.idx), r = s ? ++Ut : a ? ++xt : ++kt, h = ge(e.idx);
    ye.set(t, { nombre: (s ? "Muro" : a ? De : "Losa") + (r === 1 ? "" : String(r)), isWall: s, mem: a, t: Nt == null ? void 0 : Nt.get(e.idx), pf: Ot == null ? void 0 : Ot.get(e.idx), idx: e.idx, mat: Ie.get(h) ?? me, acero: de.get(h) ?? false });
  }
  const ze = (e) => {
    var _a2;
    return ((_a2 = ye.get(be(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, Rt = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", Ht = (e, t) => {
    const s = Ee.find((h) => be(h) === t), a = s ? We(s.idx) ?? null : null;
    if (!a) return "";
    const r = ut.map((h, T) => Math.abs(a[T] - 1) > 1e-9 ? `${h} ${d(a[T])}` : "").filter(Boolean);
    return r.length ? `  SHELLPROP  "${e}"  ${r.join(" ")} ` : "";
  }, we = Ee.find((e) => !e.isWall), Lt = Ee.find((e) => e.isWall), st = /* @__PURE__ */ new Set();
  we && st.add(be(we)), Lt && st.add(be(Lt));
  const Dt = [...ye.entries()].filter(([e]) => !st.has(e)), ot = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = m.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, vt = (e) => e * v / y ** 2, Ct = (e, t) => {
    const s = (a) => D(N(a));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${me}"  DECKMATERIAL "${me}"  DECKSLABDEPTH ${s(t.tc)} DECKRIBDEPTH ${s(t.hr)} DECKRIBWIDTHTOP ${s(t.wrt)} DECKRIBWIDTHBOTTOM ${s(t.wrb)} DECKRIBSPACING ${s(t.sr)} DECKSHEARTHICKNESS ${s(76e-5)} DECKUNITWEIGHT ${D(vt(t.w))} SHEARSTUDDIAM ${s(0.019)} SHEARSTUDHEIGHT ${s(0.1)} SHEARSTUDFU 400 `;
  };
  if (Ee.some((e) => !e.isWall)) {
    Qe = !!we && tt(we.idx);
    const e = mt(false, 0.15);
    if (Qe) {
      i.push("$ DECK PROPERTIES");
      const s = [...ye.values()].find((r) => r.nombre === De), a = ot(we == null ? void 0 : we.idx);
      (s == null ? void 0 : s.acero) ? i.push(`  SHELLPROP  "${De}"  PROPTYPE  "Slab"  MATERIAL "${s.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(N(e))} `) : a ? i.push(Ct(De, a)) : i.push(`  SHELLPROP  "${De}"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(N(e))} `);
    } else i.push("$ SLAB PROPERTIES"), i.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "${$t(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${d(N(e))} `);
    const t = gt(Qe ? De : "Losa", false);
    t && i.push(t), i.push("");
  }
  if (Ee.some((e) => e.isWall)) {
    i.push("$ WALL PROPERTIES");
    const e = mt(true, 0.2), t = $t(true);
    i.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${me}"  MODELINGTYPE "${t}"  WALLTHICKNESS ${d(N(e))} `);
    const s = gt("Muro", true);
    s && i.push(s), i.push("");
  }
  if (Dt.length) {
    i.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, t] of Dt) {
      const s = t.t ?? (t.isWall ? 0.2 : 0.15);
      i.push(t.isWall ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Wall"  MATERIAL "${t.mat ?? me}"  MODELINGTYPE "${Rt(t.pf)}"  WALLTHICKNESS ${d(N(s))} ` : t.mem && t.acero ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${t.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(N(s))} ` : t.mem && ot(t.idx) ? Ct(t.nombre, ot(t.idx)) : t.mem ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${d(N(s))} ` : `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${me}"  MODELINGTYPE "${Rt(t.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${d(N(s))} `);
      const a = Ht(t.nombre, e);
      a && i.push(a);
    }
    i.push("");
  }
  if (Ee.length > 0) {
    i.push("$ AREA CONNECTIVITIES");
    const e = [];
    Ee.forEach((t, s) => {
      const { el: a, isWall: r } = t, h = r ? `W${s + 1}` : `F${s + 1}`, T = r ? "PANEL" : "FLOOR", M = a.map((L) => pe(L));
      if (r) {
        const L = (_) => Q.indexOf(_);
        if (new Set(M.map((_) => _.pt)).size === 4) {
          const _ = Math.max(...M.map((ae) => L(ae.story))), X = M.map((ae) => _ - L(ae.story));
          i.push(`  AREA "${h}"  ${T}  4  "${M[0].pt}"  "${M[1].pt}"  "${M[2].pt}"  "${M[3].pt}"  ${X.join("  ")}  `), e.push(`  AREAASSIGN  "${h}"  "${Q[_]}"  SECTION "${ze(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const g = p[a[0]][2] <= p[a[2]][2] ? 0 : 2, B = p[a[1]][2] <= p[a[3]][2] ? 1 : 3;
        i.push(`  AREA "${h}"  ${T}  4  "${M[g].pt}"  "${M[B].pt}"  "${M[B].pt}"  "${M[g].pt}"  1  1  0  0  `);
        const w = M[g === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${h}"  "${w}"  SECTION "${ze(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const L = M.length, x = (X) => Q.indexOf(X), g = Math.max(...M.map((X) => x(X.story))), B = M.map((X) => g - x(X.story)), w = Q[g] ?? M[0].story;
        i.push(`  AREA "${h}"  ${T}  ${L}  ` + M.map((X) => `"${X.pt}"`).join("  ") + "  " + B.join("  ") + "  ");
        const _ = dt.get(t.idx) ?? (Y == null ? void 0 : Y.get(t.idx));
        e.push(tt(t.idx) ? `  AREAASSIGN  "${h}"  "${w}"  SECTION "${ze(t)}"  ANG ${d(_ ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${h}"  "${w}"  SECTION "${ze(t)}" ${qe && (!Fe.size || (R[t.idx] ?? []).every((X) => Fe.has(X))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), et.push({ name: h, story: w, idx: t.idx });
      }
    }), i.push(""), i.push("$ AREA ASSIGNS"), e.forEach((t) => i.push(t)), i.push("");
  }
  const Wt = Pe === "manual" ? 0 : K ?? 1;
  i.push("$ LOAD PATTERNS");
  const Re = ((_d = m.loadPatterns) == null ? void 0 : _d.length) ? m.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: Wt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Re) {
    let t;
    e.type === "Dead" ? t = Pe === "manual" ? 0 : e.selfWeightMultiplier ?? K ?? 1 : (t = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${e.type ?? "Other"}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), i.push(`  LOADPATTERN "${e.name}"  TYPE  "${e.type ?? "Other"}"  SELFWEIGHT  ${t}`);
  }
  i.push("");
  const Ce = m.loadPatternDestino && Re.some((e) => e.name === m.loadPatternDestino) ? m.loadPatternDestino : ((_e2 = Re.find((e) => e.type === "Dead")) == null ? void 0 : _e2.name) ?? Re[0].name, nt = [], at = /* @__PURE__ */ new Map(), Pt = (e, t) => {
    const s = at.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let a = 0; a < 6; a++) s[a] += t[a] ?? 0;
    at.set(e, s);
  }, zt = Ce === (((_f = Re.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Re[0].name), jt = Pe === "manual" || !zt || se;
  if (P.loads && P.loads.size > 0 && P.loads.forEach((e, t) => {
    const [s, a, r] = oe(t, e), [h, T, M] = re(t, e);
    Pt(t, [s, a, jt ? r : 0, h, T, M]);
  }), P.moments && P.moments.size > 0 && P.moments.forEach((e, t) => {
    Pt(t, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), at.forEach((e, t) => {
    if (e.every((a) => Math.abs(a) <= 1e-10)) return;
    const s = pe(t);
    nt.push(`  POINTLOAD  "${s.pt}"  "${s.story}"  TYPE "FORCE"  LC "${Ce}"  FX ${D(S(e[0]))}  FY ${D(S(e[1]))}  FZ ${D(S(e[2]))}  MX ${D(b(e[3]))}  MY ${D(b(e[4]))}  MZ ${D(b(e[5]))}`);
  }), nt.length > 0 && (i.push("$ POINT OBJECT LOADS"), nt.forEach((e) => i.push(e)), i.push("")), se && ne.size > 0) {
    const e = [];
    for (const t of ne) {
      const s = te.get(t), a = St.get(t);
      if (!a) continue;
      const r = (h) => D(f(h) / y);
      Math.abs(s[2]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "${s[2] < 0 ? "GRAV" : "Z"}"  LC "${Ce}"  FVAL ${r(Math.abs(s[2]))}`), Math.abs(s[0]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "X"  LC "${Ce}"  FVAL ${r(s[0])}`), Math.abs(s[1]) > 1e-12 && e.push(`  LINELOAD  "${a.name}"  "${a.story}"  TYPE "UNIFF"  DIR "Y"  LC "${Ce}"  FVAL ${r(s[1])}`);
    }
    e.length && (i.push("$ FRAME OBJECT LOADS"), e.forEach((t) => i.push(t)), i.push(""));
  }
  if (A && A.size > 0 && et.length > 0) {
    const e = [];
    for (const t of et) {
      const s = It.get(t.idx), a = s !== void 0 ? { value: s } : A.get(t.idx);
      if (!a || Math.abs(a.value) < 1e-12) continue;
      const r = a.dir ?? "GRAV", h = r === "GRAV" ? -a.value : a.value;
      e.push(`  AREALOAD  "${t.name}"  "${t.story}"  TYPE "UNIFF"  DIR "${r}"  LC "${a.pattern ?? Ce}"  FVAL ${D(f(h) / (y * y))}`);
    }
    e.length > 0 && (i.push("$ SHELL OBJECT LOADS"), e.forEach((t) => i.push(t)), i.push(""));
  }
  i.push("$ ANALYSIS OPTIONS"), i.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), i.push('  PDELTA  METHOD "NONE"  '), i.push("");
  const it = Pe === "manual";
  i.push("$ MASS SOURCE"), i.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${it ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${it ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "No"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"  `), it || i.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), i.push(""), i.push("$ LOAD CASES");
  const Jt = ((_g = m.loadCases) == null ? void 0 : _g.length) ? m.loadCases : Re.map((e) => ({ name: e.name, type: "Linear Static", patterns: [{ pattern: e.name, scaleFactor: 1 }] }));
  for (const e of Jt) {
    i.push(`  LOADCASE "${e.name}"  TYPE  "${e.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const t of e.patterns ?? []) i.push(`  LOADCASE "${e.name}"  LOADPAT  "${t.pattern}"  SF ${t.scaleFactor} `);
  }
  const _t = m.modalModes ?? 12;
  i.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), i.push(`  LOADCASE "Modal"  MAXMODES ${_t}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), i.push("");
  const ct = m.loadCombinations;
  if (ct && ct.length) {
    i.push("$ LOAD COMBINATIONS");
    for (const e of ct) {
      i.push(`  COMBO "${e.name}"  TYPE "${e.type ?? "Linear Add"}"  `);
      for (const t of e.cases ?? []) i.push(`  COMBO "${e.name}"  LOADCASE  "${t.case}"  SF ${t.scaleFactor} `);
    }
    i.push("");
  }
  return i.push("  END"), i.push("$ END OF MODEL FILE"), i.join(`\r
`);
}
function yt(m, p) {
  const R = m[p[0]], P = m[p[1]], $ = Math.abs(P[2] - R[2]), H = Math.sqrt((P[0] - R[0]) ** 2 + (P[1] - R[1]) ** 2), z = $ > H * 0.5;
  return z && H > 0.01 ? "BRACE" : z ? "COLUMN" : "BEAM";
}
export {
  ns as a,
  as as e,
  os as p
};
