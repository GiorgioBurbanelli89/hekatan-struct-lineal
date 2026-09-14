function B(m) {
  return m && parseFloat(m) || 0;
}
function wt(m) {
  const h = /* @__PURE__ */ new Map(), R = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let C;
  for (; (C = R.exec(m)) !== null; ) h.set(C[1], C[2] !== void 0 ? C[2] : C[3]);
  return h;
}
function os(m) {
  const h = m.split(/\r?\n/);
  return h.some((C) => C.trim().startsWith("TABLE:")) ? Xt(h) : Kt(h);
}
function Xt(m) {
  var _a, _b, _c, _d, _e, _f;
  const h = [];
  let R = "";
  for (const y of m) {
    const O = y.trimEnd();
    O.endsWith("_") ? R += O.slice(0, -1) + " " : (R += O, h.push(R), R = "");
  }
  R && h.push(R);
  const C = { force: "KN", length: "m" };
  let $ = "UX,UY,UZ,RX,RY,RZ";
  const H = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), q = [], K = [], te = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), ne = [], oe = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), i = [], I = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let v = "";
  for (const y of h) {
    const O = y.trim();
    if (!O || O.startsWith(";") || O.startsWith("File ")) continue;
    if (O.startsWith("TABLE:")) {
      const S = O.match(/TABLE:\s+"(.+?)"/);
      v = S ? S[1].toUpperCase() : "";
      continue;
    }
    if (O === "END TABLE DATA") {
      v = "";
      continue;
    }
    const f = wt(O);
    switch (v) {
      case "PROGRAM CONTROL": {
        const S = f.get("CurrUnits");
        if (S) {
          const b = S.split(",").map((d) => d.trim());
          b[0] && (C.force = b[0]), b[1] && (C.length = b[1]);
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
          b.E = B(f.get("E1")), b.G = B(f.get("G12")), b.nu = B(f.get("U12")), b.density = B(f.get("UnitMass")), H.set(S, b);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const S = f.get("Material");
        S && H.has(S) && (H.get(S).fy = B(f.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const S = f.get("SectionName");
        S && p.set(S, { material: f.get("Material") || "", shape: f.get("Shape") || "Rectangular", D: B(f.get("t3")), B: B(f.get("t2")), TF: B(f.get("tf")), TW: B(f.get("tw")), A: B(f.get("Area")), Iz: B(f.get("I33")), Iy: B(f.get("I22")), J: B(f.get("TorsConst")), As2: B(f.get("AS2")), As3: B(f.get("AS3")) });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const S = f.get("SectionName");
        S && W.set(S, { h: B(f.get("Height")), b: B(f.get("Width")), t: B(f.get("FlngThick")) || B(f.get("WebThick")), mat: f.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const S = f.get("SectionName");
        S && W.set(S, { h: 0, b: 0, D: B(f.get("OuterDiam")), t: B(f.get("WallThick")), mat: f.get("ShapeMat") || "" });
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
        S && Y.set(S, { material: f.get("Material") || "", type: f.get("Type") || "Shell", thickness: B(f.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const S = f.get("Joint");
        if (S) {
          const b = B(f.get("XorR")), d = B(f.get("Y")), r = B(f.get("Z"));
          V.set(S, [b, d, r]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const S = f.get("Frame"), b = f.get("JointI"), d = f.get("JointJ");
        S && b && d && q.push({ name: S, j1: b, j2: d });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const S = f.get("Area");
        if (S) {
          const b = parseInt(f.get("NumJoints") || "4"), d = [];
          for (let r = 1; r <= b; r++) {
            const a = f.get(`Joint${r}`);
            a && d.push(a);
          }
          d.length >= 3 && K.push({ name: S, joints: d });
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
        const S = f.get("Frame"), b = f.get("Dir"), d = B(f.get("FOverLA"));
        if (S && b && d) {
          const r = { X: 0, Y: 1, Z: 2 }[b];
          if (r !== void 0) {
            const a = Me.get(S) ?? [0, 0, 0];
            a[r] += d, Me.set(S, a);
          }
        }
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const S = f.get("Solid");
        if (S) {
          const b = [];
          for (let d = 1; d <= 8; d++) {
            const r = f.get(`Joint${d}`);
            r && b.push(r);
          }
          b.length === 8 && i.push({ name: S, joints: b });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const S = f.get("SolidProp");
        S && I.set(S, { material: f.get("Material") || "", incomp: (f.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const S = f.get("Solid"), b = f.get("SolidProp");
        S && b && D.set(S, b);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const S = f.get("Area");
        S && Se.set(S, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((b) => f.has(b) ? B(f.get(b)) : 1));
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const S = f.get("Frame");
        S && re.set(S, B(f.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const S = f.get("Frame");
        S && oe.set(S, [B(f.get("LengthI")), B(f.get("LengthJ")), B(f.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const S = f.get("Joint");
        S && ne.push({ joint: S, fx: B(f.get("F1")), fy: B(f.get("F2")), fz: B(f.get("F3")), mx: B(f.get("M1")), my: B(f.get("M2")), mz: B(f.get("M3")) });
        break;
      }
    }
  }
  return Gt(C, $, H, p, Y, V, q, K, te, ie, ce, ne, oe, re, Se, Me, i, I, D, W, ee, se);
}
function Kt(m) {
  const h = { force: "KN", length: "m" };
  let R = "UX,UY,UZ,RX,RY,RZ";
  const C = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), ee = [], p = [], Y = /* @__PURE__ */ new Map(), V = [], q = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ie = [], ce = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map();
  let oe = "", re = "";
  for (const i of m) {
    const I = i.trim();
    if (!I || I.startsWith(";")) continue;
    if (!i.startsWith(" ") && !i.startsWith("	")) {
      const y = I.toUpperCase();
      if (y === "END") break;
      y.startsWith("SHELL SECTION") ? oe = "SHELL SECTION" : y.startsWith("FRAME SECTION") ? oe = "FRAME SECTION" : oe = y.split(/\s+/)[0];
      continue;
    }
    const D = wt(I), v = I.split(/\s+/);
    switch (oe) {
      case "SYSTEM": {
        const y = D.get("DOF");
        y && (R = y);
        const O = D.get("LENGTH");
        O && (h.length = O);
        const f = D.get("FORCE");
        f && (h.force = f);
        break;
      }
      case "JOINT": {
        const y = v[0];
        W.set(y, [B(D.get("X")), B(D.get("Y")), B(D.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const y = D.get("ADD"), O = D.get("DOF");
        if (y && O) {
          const f = O.split(","), S = [false, false, false, false, false, false];
          for (const b of f) {
            const d = b.toUpperCase();
            (d === "UX" || d === "U1") && (S[0] = true), (d === "UY" || d === "U2") && (S[1] = true), (d === "UZ" || d === "U3") && (S[2] = true), (d === "RX" || d === "R1") && (S[3] = true), (d === "RY" || d === "R2") && (S[4] = true), (d === "RZ" || d === "R3") && (S[5] = true);
          }
          Y.set(y, S);
        }
        break;
      }
      case "MATERIAL": {
        const y = D.get("NAME");
        if (y) re = y, C.set(y, { E: 0, nu: 0, G: 0 });
        else if (re) {
          const O = C.get(re), f = D.get("E");
          f && (O.E = B(f));
          const S = D.get("U");
          S && (O.nu = B(S)), O.G = O.E / (2 * (1 + O.nu));
          const b = D.get("M");
          b && (O.density = B(b));
        }
        break;
      }
      case "SHELL": {
        const y = v[0], O = D.get("J");
        D.get("SEC"), O && p.push({ name: y, joints: O.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const y = D.get("NAME");
        y && H.set(y, { material: D.get("MAT") || "", type: D.get("TYPE") || "Shell", thickness: B(D.get("TH")) });
        break;
      }
      case "FRAME": {
        const y = v[0], O = D.get("J");
        if (O) {
          const f = O.split(",");
          f.length >= 2 && ee.push({ name: y, j1: f[0], j2: f[1] });
        }
        break;
      }
      case "LOAD": {
        const y = D.get("ADD");
        y && V.push({ joint: y, fx: B(D.get("UX")), fy: B(D.get("UY")), fz: B(D.get("UZ")), mx: B(D.get("MX")), my: B(D.get("MY")), mz: B(D.get("MZ")) });
        break;
      }
    }
  }
  return Gt(h, R, C, $, H, W, ee, p, Y, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), V, q, K, te, se, ie, ce, ne);
}
function Gt(m, h, R, C, $, H, W, ee, p, Y, V, q, K = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = [], ne = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), re, Se, Me = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const i = [], I = /* @__PURE__ */ new Map(), D = [];
  for (const [o, l] of H) I.set(o, D.length), i.push(o), D.push(l);
  const v = [], y = [], O = /* @__PURE__ */ new Map();
  for (const o of W) {
    const l = I.get(o.j1), u = I.get(o.j2);
    if (l !== void 0 && u !== void 0) {
      const U = v.length;
      v.push([l, u]), y.push(o.name);
      const L = Y.get(o.name);
      L && O.set(U, L);
    }
  }
  const f = v.length;
  for (const o of ee) {
    const l = o.joints.map((u) => I.get(u)).filter((u) => u !== void 0);
    if (l.length >= 3) {
      const u = v.length;
      v.push(l), y.push(o.name);
      const U = V.get(o.name);
      U && O.set(u, U);
    }
  }
  const S = v.length - f, b = [];
  for (const o of ce) {
    const l = o.joints.map((L) => I.get(L));
    if (l.some((L) => L === void 0)) continue;
    const u = v.length;
    v.push([l[0], l[1], l[3], l[2], l[4], l[5], l[7], l[6]]), y.push(o.name), b.push(u);
    const U = oe.get(o.name);
    U && O.set(u, U);
  }
  const d = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, r = /* @__PURE__ */ new Map(), a = R.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let o = 0; o < v.length; o++) {
    const l = O.get(o), u = l ? C.get(l) : null, U = l ? $.get(l) : null;
    if (u || v[o].length === 2) {
      const L = u || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, z = R.get(L.material) || a, F = z.E || a.E, _ = z.nu || 0.3, j = z.G || F / (2 * (1 + _));
      d.elasticities.set(o, F), d.shearModuli.set(o, j), d.areas.set(o, L.A || L.D * L.B), d.momentsOfInertiaZ.set(o, L.Iz || L.B * L.D ** 3 / 12), d.momentsOfInertiaY.set(o, L.Iy || L.D * L.B ** 3 / 12), d.torsionalConstants.set(o, L.J || 0), d.densities.set(o, z.density || 0), L.As2 && (d.shearAreasZ ?? (d.shearAreasZ = /* @__PURE__ */ new Map()), d.shearAreasZ.set(o, L.As2)), L.As3 && (d.shearAreasY ?? (d.shearAreasY = /* @__PURE__ */ new Map()), d.shearAreasY.set(o, L.As3));
      const k = K.get(y[o]);
      k && (d.endOffsets ?? (d.endOffsets = /* @__PURE__ */ new Map()), d.endOffsets.set(o, k));
      const Q = te.get(y[o]);
      Q && (d.localAngles ?? (d.localAngles = /* @__PURE__ */ new Map()), d.localAngles.set(o, Q)), ((_a = L.shape) == null ? void 0 : _a.includes("Wide Flange")) || L.shape === "I" ? r.set(o, { type: "I", b: L.B, h: L.D, name: l || "I-section" }) : r.set(o, { type: "rect", b: L.B, h: L.D });
      const Z = l ? re == null ? void 0 : re.get(l) : void 0;
      if (Z && Z.t > 0 && (Z.b > 0 && Z.h > 0 || (Z.D ?? 0) > 0)) {
        const le = l ? Se == null ? void 0 : Se.get(l) : void 0, he = le && ((_b = R.get(le.mat)) == null ? void 0 : _b.E) || 0;
        r.set(o, Z.D ? { type: "CFT", d: Z.D, tw: Z.t, name: l, ...he > 0 ? { fillE: he } : {} } : { type: "CFT", b: Z.b, h: Z.h, tw: Z.t, name: l, ...he > 0 ? { fillE: he } : {} });
      }
    } else if (U) {
      const L = R.get(U.material) || a, z = L.E || a.E, F = L.nu || 0.2, _ = L.G || z / (2 * (1 + F));
      d.elasticities.set(o, z), d.shearModuli.set(o, _), d.thicknesses.set(o, U.thickness), d.poissonsRatios.set(o, F), d.plateFormulations ?? (d.plateFormulations = /* @__PURE__ */ new Map()), d.plateFormulations.set(o, /thin/i.test(U.type) ? 1 : 0);
      const j = /membrane/i.test(U.type), k = se.get(y[o]), Q = k && j ? [k[0], k[1], k[2], 0, 0, 0, 0, 0] : k;
      Q ? (d.shellModifiers ?? (d.shellModifiers = /* @__PURE__ */ new Map()), d.shellModifiers.set(o, Q), d.membraneModifiers ?? (d.membraneModifiers = /* @__PURE__ */ new Map()), d.membraneModifiers.set(o, Q[0]), d.bendingModifiers ?? (d.bendingModifiers = /* @__PURE__ */ new Map()), d.bendingModifiers.set(o, Q[3])) : j && (d.membraneModifiers ?? (d.membraneModifiers = /* @__PURE__ */ new Map()), d.membraneModifiers.set(o, 1), d.bendingModifiers ?? (d.bendingModifiers = /* @__PURE__ */ new Map()), d.bendingModifiers.set(o, 0)), d.densities.set(o, L.density || 0);
    }
  }
  if (b.length) {
    let o = false;
    for (const l of b) {
      const u = ne.get(O.get(l) || ""), U = u && R.get(u.material) || a, L = U.E || a.E, z = U.nu || 0.2;
      d.elasticities.set(l, L), d.poissonsRatios.set(l, z), d.shearModuli.set(l, U.G || L / (2 * (1 + z))), d.densities.set(l, U.density || 0), (u == null ? void 0 : u.incomp) && (o = true);
    }
    d.solidIncompatible = o;
  }
  const c = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [o, l] of p) {
    const u = I.get(o);
    u !== void 0 && c.supports.set(u, l);
  }
  {
    const o = [];
    for (const [l, u] of Me) {
      const U = I.get(l);
      U !== void 0 && u.forEach((L, z) => {
        L > 0 && o.push({ node: U, dof: z, k: L });
      });
    }
    o.length && (c.springs = o);
  }
  for (const [o, l] of ie) {
    const u = y.indexOf(o);
    if (u < 0 || v[u].length !== 2) continue;
    d.frameLoads ?? (d.frameLoads = /* @__PURE__ */ new Map()), d.frameLoads.set(u, l);
    const U = D[v[u][0]], L = D[v[u][1]], z = [L[0] - U[0], L[1] - U[1], L[2] - U[2]], F = Math.hypot(z[0], z[1], z[2]);
    if (F < 1e-9) continue;
    const _ = [z[0] / F, z[1] / F, z[2] / F], j = F * F / 12, k = [_[1] * l[2] - _[2] * l[1], _[2] * l[0] - _[0] * l[2], _[0] * l[1] - _[1] * l[0]], Q = (Z, le) => {
      const he = c.loads.get(Z) || [0, 0, 0, 0, 0, 0];
      for (let $e = 0; $e < 6; $e++) he[$e] += le[$e];
      c.loads.set(Z, he);
    };
    Q(v[u][0], [l[0] * F / 2, l[1] * F / 2, l[2] * F / 2, j * k[0], j * k[1], j * k[2]]), Q(v[u][1], [l[0] * F / 2, l[1] * F / 2, l[2] * F / 2, -j * k[0], -j * k[1], -j * k[2]]);
  }
  for (const o of q) {
    const l = I.get(o.joint);
    if (l !== void 0) {
      const u = c.loads.get(l) || [0, 0, 0, 0, 0, 0];
      u[0] += o.fx, u[1] += o.fy, u[2] += o.fz, u[3] += o.mx, u[4] += o.my, u[5] += o.mz, c.loads.set(l, u);
    }
  }
  return { units: m, dof: h, materials: R, frameSections: C, shellSections: $, nodes: D, nodeNames: i, nodeNameToIdx: I, elements: v, elementNames: y, elementSections: O, nodeInputs: c, elementInputs: d, sectionShapes: r, info: { nNodes: D.length, nFrames: f, nShells: S, title: `SAP2000 (${f} frames, ${S} shells)` } };
}
function ns(m) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: h, elements: R, nodeInputs: C, elementInputs: $ } = m, H = { force: "KN", length: "m" };
  m.units && (m.units.force !== "KN" || m.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${m.units.force}, ${m.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const W = m.title || "Awatif Model", ee = [], p = (r) => ee.push(r), Y = () => ee.push(" ");
  p(`File ${W}.$2k was saved on m/d/yy at h:mm:ss`), Y(), p('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), p("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), Y();
  const V = [], q = (r) => {
    var _a2, _b2, _c2, _d2;
    const a = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(r)) || 0, c = (_b2 = $.poissonsRatios) == null ? void 0 : _b2.get(r), o = ((_c2 = $.shearModuli) == null ? void 0 : _c2.get(r)) || 0, l = c !== void 0 ? c : a > 0 && o > 0 ? Math.max(0, Math.min(0.5, a / (2 * o) - 1)) : 0.2, u = o > 0 ? o : a > 0 ? a / (2 * (1 + l)) : 0, U = ((_d2 = $.densities) == null ? void 0 : _d2.get(r)) || 0;
    return { E: a, nu: l, G: u, rho: U, key: `MAT_${Math.round(a)}_n${l.toFixed(4)}` };
  }, K = [], te = [];
  if (R.forEach((r, a) => {
    r.length === 2 ? V.push(a) : r.length === 8 ? te.push(a) : K.push(a);
  }), V.length > 0) {
    p('TABLE:  "CONNECTIVITY - FRAME"');
    for (const r of V) {
      const a = R[r];
      p(`   Frame=${r + 1}   JointI=${a[0] + 1}   JointJ=${a[1] + 1}   IsCurved=No`);
    }
    Y();
  }
  if (K.length > 0) {
    p('TABLE:  "CONNECTIVITY - AREA"');
    for (const r of K) {
      const a = R[r], c = a.map((o, l) => `Joint${l + 1}=${o + 1}`).join("   ");
      p(`   Area=${r + 1}   NumJoints=${a.length}   ${c}`);
    }
    Y();
  }
  if (te.length > 0) {
    p('TABLE:  "CONNECTIVITY - SOLID"');
    for (const r of te) {
      const a = R[r], c = [a[0], a[1], a[3], a[2], a[4], a[5], a[7], a[6]];
      p(`   Solid=${r + 1}   ${c.map((o, l) => `Joint${l + 1}=${o + 1}`).join("   ")}`);
    }
    Y();
  }
  p('TABLE:  "COORDINATE SYSTEMS"'), p("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), Y(), p('TABLE:  "DATABASE FORMAT TYPES"'), p("   UnitsCurr=Yes   OverrideE=No"), Y();
  const se = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map();
  for (const r of V) {
    const a = ((_a = $.areas) == null ? void 0 : _a.get(r)) || 0, c = ((_b = $.momentsOfInertiaZ) == null ? void 0 : _b.get(r)) || 0, o = ((_c = $.momentsOfInertiaY) == null ? void 0 : _c.get(r)) || 0, l = ((_d = $.torsionalConstants) == null ? void 0 : _d.get(r)) || 0, u = ((_e = $.elasticities) == null ? void 0 : _e.get(r)) || 0, U = q(r).key, L = ((_f = $.shearAreasZ) == null ? void 0 : _f.get(r)) ?? 0, z = ((_g = $.shearAreasY) == null ? void 0 : _g.get(r)) ?? 0, F = (_h = $.sectionShapes) == null ? void 0 : _h.get(r);
    let _;
    const j = (F == null ? void 0 : F.type) === "CFT" && F.d > 0 && F.tw > 0 && F.tw < F.d / 2 && !(F.b > 0 && F.h > 0);
    if (m.cftAs !== "general" && (F == null ? void 0 : F.type) === "CFT" && u > 0 && (j || F.b > 0 && F.h > 0 && F.tw > 0 && F.tw < Math.min(F.b, F.h) / 2)) {
      const Z = j ? F.d - 2 * F.tw : 0, le = j ? 0 : F.b - 2 * F.tw, he = j ? 0 : F.h - 2 * F.tw, $e = j ? Math.PI * (F.d * F.d - Z * Z) / 4 : F.b * F.h - le * he, ge = j ? Math.PI * Z * Z / 4 : le * he, Pe = F.fillE > 0 ? F.fillE / u : Math.max(0.01, Math.min(1, (a - $e) / ge)), de = Pe * u, Ie = 0.2, Le = `MAT_${Math.round(de)}_n${Ie.toFixed(4)}`, _e2 = q(r).rho;
      ie.has(Le) || ie.set(Le, { E: de, nu: Ie, G: de / (2 * (1 + Ie)), rho: _e2 * Pe }), _ = j ? { b: F.d, h: F.d, t: F.tw, Ec: de, nuC: Ie, matFill: Le, D: F.d } : { b: F.b, h: F.h, t: F.tw, Ec: de, nuC: Ie, matFill: Le };
    }
    const k = `A${a.toPrecision(6)}_Iz${c.toPrecision(6)}_s${L.toPrecision(6)}_${z.toPrecision(6)}${_ ? _.D ? `_SDC${_.D}x${_.t}` : `_SD${_.b}x${_.h}x${_.t}` : ""}`;
    if (!se.has(k)) {
      let Z = 0.3, le = 0.3;
      a > 0 && c > 0 && (Z = Math.sqrt(12 * c / a), le = a / Z), se.set(k, { A: a, Iz: c, Iy: o, J: l, b: le, h: Z, matKey: U, As2: L > 0 ? L : a * 5 / 6, As3: z > 0 ? z : a * 5 / 6, sd: _ });
    }
    const Q = [...se.keys()].indexOf(k) + 1;
    ce.set(r, `SEC${Q}`);
  }
  if (V.length > 0) {
    p('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const r of V) {
      const a = ce.get(r) || "SEC1";
      p(`   Frame=${r + 1}   AutoSelect=N.A.   AnalSect=${a}   MatProp=Default`);
    }
    Y();
  }
  if (se.size > 0) {
    p('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let r = 0;
    for (const [, a] of se) {
      if (r++, a.sd) {
        p(`   SectionName=SEC${r}   Material=${a.matKey}   Shape="SD Section"   Area=${P(a.A)}   TorsConst=${P(a.J)}   I33=${P(a.Iz)}   I22=${P(a.Iy)}   I23=0   AS2=${P(a.As2)}   AS3=${P(a.As3)} _`), p("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      p(`   SectionName=SEC${r}   Material=${a.matKey}   Shape=General   t3=${P(a.h)}   t2=${P(a.b)}   Area=${P(a.A)}   TorsConst=${P(a.J)}   I33=${P(a.Iz)}   I22=${P(a.Iy)}   I23=0   AS2=${P(a.As2)}   AS3=${P(a.As3)} _`), p("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    Y();
  }
  const ne = [...se.values()].map((r, a) => ({ sec: r, name: `SEC${a + 1}` })).filter((r) => r.sec.sd);
  if (ne.length > 0) {
    p('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: c } of ne) p(`   SectionName=${c}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    Y();
    const r = ne.filter((c) => !c.sec.sd.D), a = ne.filter((c) => c.sec.sd.D);
    if (r.length > 0) {
      p('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: c, name: o } of r) {
        const l = c.sd;
        p(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${c.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${P(l.h)}   Width=${P(l.b)}   FlngThick=${P(l.t)}   WebThick=${P(l.t)}   Rotation=0 _`), p('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      Y();
    }
    if (a.length > 0) {
      p('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: c, name: o } of a) {
        const l = c.sd;
        p(`   SectionName=${o}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${c.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${P(l.D)}   WallThick=${P(l.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), p("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      Y();
    }
    if (r.length > 0) {
      p('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: c, name: o } of r) {
        const l = c.sd;
        p(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${l.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${P(l.h - 2 * l.t)}   Width=${P(l.b - 2 * l.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), p("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      Y();
    }
    if (a.length > 0) {
      p('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: c, name: o } of a) {
        const l = c.sd;
        p(`   SectionName=${o}   ShapeName=RELLENO   ShapeMat=${l.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${P(l.D - 2 * l.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      Y();
    }
    p('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: c } of ne) p(`   SectionName=${c}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    Y();
  }
  {
    const r = V.filter((a) => {
      var _a2;
      const c = (_a2 = $.localAngles) == null ? void 0 : _a2.get(a);
      return c !== void 0 && isFinite(c) && Math.abs(c) > 1e-9;
    });
    if (r.length > 0) {
      p('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const a of r) p(`   Frame=${a + 1}   Angle=${P($.localAngles.get(a))}   AdvanceAxes=No`);
      Y();
    }
  }
  {
    const r = $.endOffsets, a = V.filter((c) => {
      const o = r == null ? void 0 : r.get(c);
      return !!o && (Math.abs(o[0]) > 1e-9 || Math.abs(o[1]) > 1e-9);
    });
    if (a.length > 0) {
      p('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const c of a) {
        const o = r.get(c);
        p(`   Frame=${c + 1}   Type=User   LengthI=${P(o[0])}   LengthJ=${P(o[1])}   RigidFactor=${P(o.length > 2 ? o[2] : 0)}`);
      }
      Y();
    }
  }
  const oe = !!m.layeredSection && K.length > 0, re = m.layeredSection, Se = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), i = $.shellModifiers, I = $.membraneModifiers, D = $.bendingModifiers, v = (r) => !(i == null ? void 0 : i.has(r)) && Math.abs((D == null ? void 0 : D.get(r)) ?? 1) < 1e-9;
  if (!oe) for (const r of K) {
    const a = ((_i = $.thicknesses) == null ? void 0 : _i.get(r)) || 0.1;
    (_j = $.elasticities) == null ? void 0 : _j.get(r);
    const c = q(r).key, o = v(r) ? 2 : ((_k = $.plateFormulations) == null ? void 0 : _k.get(r)) ?? 0, l = `t${a.toPrecision(6)}_f${o}`;
    Se.has(l) || Se.set(l, { t: a, matKey: c, formulacion: o });
    const u = [...Se.keys()].indexOf(l) + 1;
    Me.set(r, `SSEC${u}`);
  }
  if (K.length > 0) {
    p('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const c of K) {
      const o = oe ? re.name : Me.get(c) || "SSEC1";
      p(`   Area=${c + 1}   Section=${o}   MatProp=Default`);
    }
    Y();
    const r = (c) => {
      const o = i == null ? void 0 : i.get(c);
      if (o) return o;
      const l = (I == null ? void 0 : I.get(c)) ?? 1, u = v(c) ? 1 : (D == null ? void 0 : D.get(c)) ?? 1;
      return [l, l, l, u, u, u, u, u];
    }, a = K.filter((c) => {
      const o = r(c);
      return o && o.some((l) => Math.abs(l - 1) > 1e-12);
    });
    if (a.length > 0) {
      p('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const c of a) {
        const o = r(c);
        p(`   Area=${c + 1}   f11=${P(o[0])}   f22=${P(o[1])}   f12=${P(o[2])}   m11=${P(o[3])}   m22=${P(o[4])}   m12=${P(o[5])}   v13=${P(o[6])}   v23=${P(o[7])}   MassMod=1   WeightMod=1`);
      }
      Y();
    }
    if (p('TABLE:  "AREA SECTION PROPERTIES"'), oe) {
      const c = re, o = ((_l = c.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      p(`   Section=${c.name}   Material=${o}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${P(c.totalThickness)}   BendThick=${P(c.totalThickness)}   Color=Magenta`);
    } else {
      let c = 0;
      for (const [, o] of Se) {
        c++;
        const l = o.formulacion === 2 ? "Membrane" : o.formulacion === 3 ? "Plate-Thin" : o.formulacion === 4 ? "Plate-Thick" : o.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", u = o.formulacion === 3 || o.formulacion === 4 ? "No" : "Yes";
        p(`   Section=SSEC${c}   Material=${o.matKey}   MatAngle=0   AreaType=Shell   Type=${l}   DrillDOF=${u}   Thickness=${P(o.t)}   BendThick=${P(o.t)}   Color=Cyan`);
      }
    }
    if (Y(), oe) {
      p('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const c = re;
      for (const o of c.layers) {
        const l = o.angle ?? 0, u = o.numIntPts ?? 3;
        p(`   Section=${c.name}   LayerName=${o.name}   Distance=${P(o.distance)}   Thickness=${P(o.thickness)}   Type=Shell   NumIntPts=${u}   Material=${o.material}   MatAngle=${P(l * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      Y();
    }
  }
  p('TABLE:  "JOINT COORDINATES"');
  for (let r = 0; r < h.length; r++) {
    const a = h[r];
    p(`   Joint=${r + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${P(a[0])}   Y=${P(a[1])}   Z=${P(a[2])}   SpecialJt=No`);
  }
  if (Y(), C.supports && C.supports.size > 0) {
    p('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [r, a] of C.supports) {
      if (!a.some((o) => o)) continue;
      const c = (o) => o ? "Yes" : "No";
      p(`   Joint=${r + 1}   U1=${c(a[0])}   U2=${c(a[1])}   U3=${c(a[2])}   R1=${c(a[3])}   R2=${c(a[4])}   R3=${c(a[5])}`);
    }
    Y();
  }
  {
    const r = /* @__PURE__ */ new Map();
    for (const a of C.springs ?? []) {
      if (!(a.k > 0)) continue;
      const c = r.get(a.node) ?? [0, 0, 0, 0, 0, 0];
      c[a.dof] += a.k, r.set(a.node, c);
    }
    if (r.size > 0) {
      p('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [a, c] of [...r].sort((o, l) => o[0] - l[0])) p(`   Joint=${a + 1}   CoordSys=Global   U1=${P(c[0])}   U2=${P(c[1])}   U3=${P(c[2])}   R1=${P(c[3])}   R2=${P(c[4])}   R3=${P(c[5])}`);
      Y();
    }
  }
  const y = C.diaphragms;
  if (y && y.size > 0) {
    const r = /* @__PURE__ */ new Map();
    for (const [c, o] of y) {
      const l = Math.round(o);
      if (l === 0) continue;
      const u = Math.abs(l);
      r.has(u) || r.set(u, []), r.get(u).push(c);
    }
    const a = [...r].filter(([, c]) => c.length >= 2);
    if (a.length > 0) {
      p('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [c] of a) p(`   Name=DIAPH${c}   CoordSys=GLOBAL   Axis=Z`);
      Y(), p('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [c, o] of a) for (const l of o) p(`   Joint=${l + 1}   Constraint=DIAPH${c}`);
      Y();
    }
  }
  const O = m.selfWtMult ?? 1;
  p('TABLE:  "LOAD PATTERN DEFINITIONS"'), p(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${O}`), Y(), p('TABLE:  "LOAD CASE DEFINITIONS"'), p('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), Y(), p('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), p('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), Y();
  const f = $.frameLoads, S = /* @__PURE__ */ new Map();
  if ((_m = C.loads) == null ? void 0 : _m.forEach((r, a) => S.set(a, [...r])), f && f.size > 0) {
    const r = (a, c) => {
      const o = S.get(a) ?? [0, 0, 0, 0, 0, 0];
      S.set(a, o.map((l, u) => l - c[u]));
    };
    for (const [a, c] of f) {
      const o = R[a];
      if (!o || o.length !== 2) continue;
      const l = h[o[0]], u = h[o[1]], U = [u[0] - l[0], u[1] - l[1], u[2] - l[2]], L = Math.hypot(U[0], U[1], U[2]);
      if (L < 1e-9) continue;
      const z = [U[0] / L, U[1] / L, U[2] / L], F = L * L / 12, _ = [z[1] * c[2] - z[2] * c[1], z[2] * c[0] - z[0] * c[2], z[0] * c[1] - z[1] * c[0]];
      r(o[0], [c[0] * L / 2, c[1] * L / 2, c[2] * L / 2, F * _[0], F * _[1], F * _[2]]), r(o[1], [c[0] * L / 2, c[1] * L / 2, c[2] * L / 2, -F * _[0], -F * _[1], -F * _[2]]);
    }
  }
  if (S.size > 0) {
    p('TABLE:  "JOINT LOADS - FORCE"');
    for (const [r, a] of S) a.some((c) => Math.abs(c) > 1e-12) && p(`   Joint=${r + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${P(a[0])}   F2=${P(a[1])}   F3=${P(a[2])}   M1=${P(a[3])}   M2=${P(a[4])}   M3=${P(a[5])}`);
    Y();
  }
  const b = $.frameLoads;
  if (b && b.size > 0) {
    p('TABLE:  "FRAME LOADS - DISTRIBUTED"');
    for (const [r, a] of b) {
      const c = R[r];
      if (!c || c.length !== 2) continue;
      const o = h[c[0]], l = h[c[1]], u = Math.hypot(l[0] - o[0], l[1] - o[1], l[2] - o[2]);
      ["X", "Y", "Z"].forEach((U, L) => {
        Math.abs(a[L]) < 1e-12 || p(`   Frame=${r + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${U}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${P(u)}   FOverLA=${P(a[L])}   FOverLB=${P(a[L])}`);
      });
    }
    Y();
  }
  const d = /* @__PURE__ */ new Map();
  for (let r = 0; r < R.length; r++) {
    const { E: a, nu: c, G: o, rho: l, key: u } = q(r);
    d.has(u) || d.set(u, { E: a, nu: c, G: o, rho: l });
  }
  if (te.length > 0) {
    const r = $.solidIncompatible === false ? "No" : "Yes", a = /* @__PURE__ */ new Map();
    for (const c of te) {
      const { E: o, nu: l, G: u, rho: U, key: L } = q(c);
      d.has(L) || d.set(L, { E: o, nu: l, G: u, rho: U }), a.has(L) || a.set(L, `SOL${a.size + 1}`);
    }
    p('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [c, o] of a) p(`   SolidProp=${o}   Material=${c}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${r}   Color=Yellow`);
    Y(), p('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const c of te) p(`   Solid=${c + 1}   SolidProp=${a.get(q(c).key)}`);
    Y();
  }
  for (const [r, a] of ie) d.has(r) || d.set(r, a);
  p('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [r] of d) p(`   Material=${r}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  Y(), p('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [r, a] of d) p(`   Material=${r}   UnitWeight=${P(a.rho * 9.81)}   UnitMass=${P(a.rho)}   E1=${P(a.E)}   G12=${P(a.G)}   U12=${P(a.nu)}   A1=9.9E-06`);
  Y(), p('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [r] of d) p(`   Material=${r}   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0`);
  return Y(), p('TABLE:  "PROGRAM CONTROL"'), p(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${H.force}, ${H.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), Y(), p("END TABLE DATA"), p(""), ee.join(`\r
`);
}
function P(m) {
  return m === 0 || Math.abs(m) < 1e-15 ? "0" : Math.abs(m) >= 1e6 || Math.abs(m) < 1e-3 && Math.abs(m) > 0 ? m.toExponential(8) : parseFloat(m.toPrecision(10)).toString();
}
function Vt(m, h, R = 0.05) {
  const C = h.map(([$, H]) => `${(+$).toFixed(4)} ${(+H).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${m}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${R}  SPECTYPE "USER"  `, `  FUNCTION "${m}"  TIMEVAL "${C}"  `];
}
function qt(m) {
  const { name: h, func: R, modalCase: C = "Modal", sfX: $ = 9.81, sfY: H = 9.81 } = m, W = [`  LOADCASE "${h}"  TYPE  "Response Spectrum"  MODALCASE  "${C}"  `];
  return $ && W.push(`  LOADCASE "${h}"  ACCEL  "U1"  FUNC  "${R}"  SF  ${$}  `), H && W.push(`  LOADCASE "${h}"  ACCEL  "U2"  FUNC  "${R}"  SF  ${H}  `), W;
}
function Ft(m) {
  const { name: h = "Modal", ritz: R = false, nModes: C = 12 } = m;
  return R ? [`  LOADCASE "${h}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${h}"  MAXMODES  ${C} MINMODES  1 `, `  LOADCASE "${h}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${h}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${h}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${h}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${h}"  MAXMODES  ${C} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function as(m) {
  var _a;
  const h = (_a = m.e2kModel) == null ? void 0 : _a.rawSections;
  let R = h && h.size > 0 ? es(h, m.e2kModel) : ts(m);
  return m.seismicNEC && (R = Qt(R, m.seismicNEC)), R;
}
function Qt(m, h) {
  const R = m.includes(`\r
`) ? `\r
` : `
`, C = m.split(/\r?\n/), $ = h.name ?? "NEC", H = Vt($, h.points, h.dampRatio ?? 0.05), W = h.modalCase ?? "Modal", ee = qt({ name: h.caseName ?? "Sismo NEC", func: $, modalCase: W, sfX: h.sfX, sfY: h.sfY });
  let p = [];
  const Y = (V) => C.some((q) => V.test(q));
  if (h.modal) {
    const V = new RegExp(`^\\s*LOADCASE\\s+"${W}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let q = C.length - 1; q >= 0; q--) V.test(C[q]) && C.splice(q, 1);
    p = Ft({ name: W, ritz: !!h.modal.ritz, nModes: h.modal.nModes });
  } else Y(new RegExp(`LOADCASE\\s+"${W}"\\s+TYPE\\s+"Modal`)) || (p = Ft({ name: W }));
  return bt(C, "FUNCTIONS", H), bt(C, "LOAD CASES", [...p, ...ee]), C.join(R);
}
function bt(m, h, R) {
  const C = m.findIndex((W) => W.trim() === `$ ${h}`);
  if (C >= 0) {
    m.splice(C + 1, 0, ...R);
    return;
  }
  const $ = m.findIndex((W) => W.trim() === "END"), H = $ >= 0 ? $ : m.length;
  m.splice(H, 0, `$ ${h}`, ...R, "");
}
function es(m, h) {
  const R = [], C = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  R.push("$ File exported from Hekatan Struct Lineal (round-trip)"), R.push("");
  for (const $ of C) {
    const H = m.get($);
    if (!(!H || H.length === 0)) {
      R.push(`$ ${$}`);
      for (const W of H) R.push(W);
      R.push("");
    }
  }
  for (const [$, H] of m) if (!C.includes($) && H.length !== 0) {
    R.push(`$ ${$}`);
    for (const W of H) R.push(W);
    R.push("");
  }
  return R.push("  END"), R.push("$ END OF MODEL FILE"), R.join(`\r
`);
}
function ts(m) {
  var _a, _b, _c, _d, _e2, _f, _g;
  const { nodes: h, elements: R, nodeInputs: C, elementInputs: $, title: H, units: W } = m, ee = m.shellLoads ?? $.shellSurfaceLoads;
  let p;
  ee instanceof Map && (p = /* @__PURE__ */ new Map(), ee.forEach((e, t) => {
    p.set(t, typeof e == "number" ? { value: e } : e);
  }));
  const Y = m.shellAngles ?? $.shellAngles, V = $.cargaDeArea, q = !!(p && p.size > 0), K = $.selfWeight, te = $.frameLoads, se = (m.weightMode ?? "auto") === "auto" && K !== void 0, ie = /* @__PURE__ */ new Map(), ce = (e, t) => {
    const s = ie.get(e) ?? [0, 0, 0, 0, 0, 0];
    ie.set(e, s.map((n, E) => n + t[E]));
  }, ne = /* @__PURE__ */ new Set();
  if (se) {
    if (te) for (const [e, t] of te) {
      const s = R[e];
      if (!s || s.length !== 2) continue;
      const n = h[s[0]], E = h[s[1]], A = [E[0] - n[0], E[1] - n[1], E[2] - n[2]], T = Math.hypot(A[0], A[1], A[2]);
      if (T < 1e-9) continue;
      const M = [A[0] / T, A[1] / T, A[2] / T], g = T * T / 12, x = [M[1] * t[2] - M[2] * t[1], M[2] * t[0] - M[0] * t[2], M[0] * t[1] - M[1] * t[0]];
      ce(s[0], [t[0] * T / 2, t[1] * T / 2, t[2] * T / 2, g * x[0], g * x[1], g * x[2]]), ce(s[1], [t[0] * T / 2, t[1] * T / 2, t[2] * T / 2, -g * x[0], -g * x[1], -g * x[2]]), ne.add(e);
    }
    if (K && K > 0) {
      const t = $.endOffsets;
      R.forEach((s, n) => {
        var _a2, _b2, _c2;
        const E = ((_a2 = $.densities) == null ? void 0 : _a2.get(n)) ?? 0;
        if (E) {
          if (s.length === 2) {
            const A = ((_b2 = $.areas) == null ? void 0 : _b2.get(n)) ?? 0, T = h[s[0]], M = h[s[1]], g = [M[0] - T[0], M[1] - T[1], M[2] - T[2]];
            let x = Math.hypot(g[0], g[1], g[2]);
            const N = t == null ? void 0 : t.get(n);
            if (N) {
              const w = Math.hypot(g[0], g[1]);
              w > 1e-9 && Math.abs(Math.atan2(Math.abs(g[2]), w)) * 180 / Math.PI < 20 && (x = Math.max(x - N[0] - N[1], 0));
            }
            const G = A * x * E * 9.80665 * K;
            ce(s[0], [0, 0, -G / 2, 0, 0, 0]), ce(s[1], [0, 0, -G / 2, 0, 0, 0]);
          } else if (s.length === 4) {
            const A = ((_c2 = $.thicknesses) == null ? void 0 : _c2.get(n)) ?? 0, T = s.map((w) => h[w]);
            let M = 0, g = 0, x = 0;
            for (let w = 0; w < 4; w++) {
              const J = T[w], X = T[(w + 1) % 4];
              M += J[1] * X[2] - J[2] * X[1], g += J[2] * X[0] - J[0] * X[2], x += J[0] * X[1] - J[1] * X[0];
            }
            const N = Math.hypot(M, g, x) / 2, G = A * N * E * 9.80665 * K;
            for (const w of s) ce(w, [0, 0, -G / 4, 0, 0, 0]);
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
  }, Se = "N", Me = "MM", i = [], I = (e) => Math.round(e * 1e4) / 1e4, D = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), v = 1e3, y = 1e3, O = (e) => e * y, f = (e) => e * v, S = (e) => e * v, b = (e) => e * v * y, d = (e) => e * v / y ** 2, r = (e) => e * v / y ** 3, a = /* @__PURE__ */ new Date(), c = `${a.getMonth() + 1}/${a.getDate()}/${a.getFullYear()}  ${a.getHours()}:${String(a.getMinutes()).padStart(2, "0")}:${String(a.getSeconds()).padStart(2, "0")}`;
  i.push(`$ File   "Hekatan_export.e2k"  saved ${c} in ETABS 22.6.0`), i.push(""), i.push("$ PROGRAM INFORMATION"), i.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), i.push(""), i.push("$ CONTROLS"), i.push(`  UNITS  "${Se}"  "${Me}"  "C"  `), i.push('  TITLE1  "Hekatan Struct Lineal export"  '), H && i.push(`  TITLE2  "${H}"  `), i.push("  PREFERENCE  MERGETOL 0.001"), i.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), i.push("");
  const o = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  h.forEach((e) => {
    o.add(I(e[0])), l.add(I(e[1]));
  });
  const u = [...o].sort((e, t) => e - t), U = [...l].sort((e, t) => e - t);
  i.push("$ GRIDS"), i.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), u.forEach((e, t) => {
    const s = t < 26 ? String.fromCharCode(65 + t) : String.fromCharCode(65 + t % 26).repeat(Math.floor(t / 26) + 1);
    i.push(`  GRID "G1"  LABEL "${s}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), U.forEach((e, t) => {
    i.push(`  GRID "G1"  LABEL "${t + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), i.push("");
  const L = 3, z = 0.5, F = /* @__PURE__ */ new Map();
  h.forEach((e) => {
    const t = I(e[2]);
    F.set(t, (F.get(t) ?? 0) + 1);
  });
  const _ = /* @__PURE__ */ new Set();
  h.forEach((e) => _.add(I(e[2])));
  const j = [..._].sort((e, t) => e - t);
  let k = j.filter((e) => (F.get(e) ?? 0) >= L);
  if (k.length > 1) {
    const e = [k[0]];
    for (const t of k.slice(1)) t - e[e.length - 1] < z ? e[e.length - 1] = t : e.push(t);
    k = e;
  }
  j.length || j.push(0, 3), k.length || (k = [j[0], j[j.length - 1]]), k[0] !== j[0] && k.unshift(j[0]), k[k.length - 1] !== j[j.length - 1] && k.push(j[j.length - 1]);
  const Q = [], Z = /* @__PURE__ */ new Map();
  Q.push("Base"), Z.set(k[0], "Base");
  for (let e = 1; e < k.length; e++) {
    const t = `Level_${e}`;
    Q.push(t), Z.set(k[e], t);
  }
  const le = (e) => {
    const t = I(e);
    if (Z.has(t)) return { story: Z.get(t), dz: 0 };
    for (let n = 0; n < k.length; n++) if (k[n] >= t) return { story: Z.get(k[n]), dz: I(k[n] - t) };
    const s = k[k.length - 1];
    return { story: Z.get(s), dz: I(s - t) };
  };
  i.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = k.length - 1; e >= 1; e--) i.push(`  STORY "${Q[e]}"  HEIGHT ${I(O(k[e] - k[e - 1]))} MASTERSTORY "Yes"  `);
  k.length > 0 && i.push(`  STORY "Base"  ELEV ${I(O(k[0]))} `), i.push(""), R.some((e) => e.length === 4), i.push("$ DIAPHRAGM NAMES"), i.push('  DIAPHRAGM "D1"    TYPE RIGID'), i.push(""), i.push("$ MATERIAL PROPERTIES");
  const he = 980665e-8, $e = (e) => {
    var _a2, _b2;
    const t = (_a2 = $.densities) == null ? void 0 : _a2.get(e);
    if (t === void 0) return;
    const s = t > 100 ? t * he : t * 9.80665, n = (_b2 = $.deckSections) == null ? void 0 : _b2.get(e);
    if (n && n.tc > 0) {
      const E = n.tc + (n.sr > 0 ? n.hr * (n.wrt + n.wrb) / 2 / n.sr : 0);
      return (s * n.tc - n.w) / E;
    }
    return s;
  }, ge = (e) => {
    var _a2;
    const t = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, s = $e(e);
    return `${t}|${s === void 0 ? "-" : s.toFixed(4)}`;
  }, Pe = /* @__PURE__ */ new Set();
  (_a = $.elasticities) == null ? void 0 : _a.forEach((e, t) => Pe.add(ge(t)));
  const de = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map();
  let Le = 0, _e = 0;
  for (const e of Pe) {
    const t = parseFloat(e.split("|")[0]), s = e.split("|")[1], n = t >= 1e8, E = n ? `Steel_${++Le}` : `Conc_${++_e}`;
    de.set(e, E), Ie.set(e, n);
    const A = s !== "-" ? parseFloat(s) : n ? 76.97 : 24, T = d(t), M = r(A), g = (() => {
      const G = m.elementInputs.poissonsRatios;
      if (G) {
        for (const [w, J] of G) if (ge(w) === e) return J;
      }
    })(), x = g !== void 0 ? g : n ? 0.3 : 0.2, N = n ? 117e-7 : 1e-5;
    if (n) {
      i.push(`  MATERIAL  "${E}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${D(M)}`), i.push(`  MATERIAL  "${E}"    SYMTYPE "Isotropic"  E ${I(T)}  U ${x}  A ${N}`);
      const G = 345e3, w = 45e4;
      i.push(`  MATERIAL  "${E}"  FY ${I(d(G))}  FU ${I(d(w))}  FYE ${I(d(G * 1.1))}  FUE ${I(d(w * 1.1))}`);
    } else i.push(`  MATERIAL  "${E}"    TYPE "Concrete"    WEIGHTPERVOLUME ${D(M)}`), i.push(`  MATERIAL  "${E}"    SYMTYPE "Isotropic"  E ${I(T)}  U ${x}  A ${N}`), i.push(`  MATERIAL  "${E}"    FC ${I(d(24e3))}`);
  }
  const lt = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = $.sectionShapes) == null ? void 0 : _b.forEach((s, n) => {
      var _a2;
      if ((s == null ? void 0 : s.type) !== "CFT" || !(s.fillE > 0)) return;
      const E = ((_a2 = $.elasticities) == null ? void 0 : _a2.get(n)) ?? 0;
      if (!(E > 0)) return;
      const A = s.fillE / E, T = $e(n) ?? 76.97, M = `${s.fillE}|${(A * T).toFixed(4)}`;
      let g = e.get(M);
      g || (g = `ConcFill_${e.size + 1}`, e.set(M, g), i.push(`  MATERIAL  "${g}"    TYPE "Concrete"    WEIGHTPERVOLUME ${D(r(A * T))}`), i.push(`  MATERIAL  "${g}"    SYMTYPE "Isotropic"  E ${I(d(s.fillE))}  U 0.2  A 1.0e-5`), i.push(`  MATERIAL  "${g}"    FC ${I(d(24e3))}`)), lt.set(n, g);
    });
  }
  i.push(""), i.push("$ FRAME SECTIONS");
  const Ye = /* @__PURE__ */ new Set(), Ze = /* @__PURE__ */ new Map(), ke = /* @__PURE__ */ new Map(), Ne = 0.05;
  R.forEach((e, t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const s = (_a2 = $.sectionShapes) == null ? void 0 : _a2.get(t), n = ((_b2 = $.elasticities) == null ? void 0 : _b2.get(t)) ?? 0, E = de.get(ge(t)) || "Conc_1", A = Ie.get(ge(t)) ?? n >= 1e8, T = ((_c2 = $.areas) == null ? void 0 : _c2.get(t)) ?? 0, M = ((_d2 = $.momentsOfInertiaZ) == null ? void 0 : _d2.get(t)) ?? 0, g = ((_e3 = $.momentsOfInertiaY) == null ? void 0 : _e3.get(t)) ?? 0, x = ((_f2 = $.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
    let N = (s == null ? void 0 : s.type) || "rect", G = (s == null ? void 0 : s.h) ?? 0, w = (s == null ? void 0 : s.b) ?? 0, J = (s == null ? void 0 : s.d) ?? 0;
    const X = (s == null ? void 0 : s.tf) ?? 0, ae = (s == null ? void 0 : s.tw) ?? 0;
    if (!s && G <= 0 && w <= 0 && J <= 0 && T > 0 && M > 0 && g > 0) {
      const Te = (_g2 = $.cantos) == null ? void 0 : _g2.get(t), Be = (_h = $.anchos) == null ? void 0 : _h.get(t);
      G = Te && Te > 0 ? Te : Math.sqrt(12 * M / T), w = Be && Be > 0 ? Be : T / G, (!isFinite(G) || G < Ne) && (G = Ne), (!isFinite(w) || w < Ne) && (w = Ne), N = "general";
    } else G <= 0 && w <= 0 && J <= 0 && T > 0 && (M > 0 ? (G = Math.sqrt(12 * M / T), w = T / G) : G = w = Math.sqrt(T), (!isFinite(G) || G < Ne) && (G = Ne), (!isFinite(w) || w < Ne) && (w = Ne), N = "rect");
    G <= 0 && w <= 0 && J <= 0 && (G = 0.3, w = 0.3, N = "rect");
    const je = (s == null ? void 0 : s.name) ? `NAME_${s.name}` : `${N}_${I(G)}_${I(w)}_${I(J)}_${I(X)}_${I(ae)}_${E}`;
    (s == null ? void 0 : s.name) && !ke.has(je) && ke.set(je, s.name);
    let fe = ke.get(je);
    if (!fe) {
      const Te = A ? "S" : "C";
      N === "general" ? fe = `${Te}_G${Ye.size + 1}` : N === "rect" ? fe = `${Te}_R${Math.round(w * 100)}x${Math.round(G * 100)}` : N === "circ" ? fe = `${Te}_C_D${Math.round(J * 100)}` : N === "I" ? fe = `${Te}_I${Math.round(G * 100)}x${Math.round(w * 100)}` : N === "HSS" ? fe = `${Te}_HSS${Math.round(w * 100)}x${Math.round(G * 100)}x${Math.round(ae * 1e3)}` : fe = `${Te}_Sec${Ye.size + 1}`, ke.set(je, fe);
    }
    if (Ze.set(t, fe), Ye.has(fe)) return;
    Ye.add(fe);
    const Je = lt.get(t);
    if (N === "CFT" && Je && J > 0 && ae > 0 && !(G > 0 && w > 0)) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${E}"  SHAPE "Filled Steel Pipe"  D ${I(O(J))} T ${I(O(ae))} FILLMATERIAL "${Je}"`);
      return;
    }
    if (N === "CFT" && Je && G > 0 && w > 0 && ae > 0) {
      i.push(`  FRAMESECTION  "${fe}"  MATERIAL "${E}"  SHAPE "Filled Steel Tube"  D ${I(O(G))} B ${I(O(w))} TF ${I(O(ae))} TW ${I(O(ae))} FILLMATERIAL "${Je}"`);
      return;
    }
    const Zt = T > 0 && M > 0 && g > 0;
    let Ae;
    N === "general" || Zt ? Ae = "General" : N === "I" ? Ae = "Steel I/Wide Flange" : N === "HSS" ? Ae = "Steel Tube" : N === "CFT" ? Ae = "Filled Steel Tube" : N === "pipe" ? Ae = "Steel Pipe" : N === "L" ? Ae = "Steel Angle" : N === "C" ? Ae = "Steel Channel" : N === "2C" ? Ae = "Steel Double Channel" : N === "circ" ? Ae = "Concrete Circle" : Ae = "Concrete Rectangular";
    let Oe = `  FRAMESECTION  "${fe}"  MATERIAL "${E}"  SHAPE "${Ae}"`;
    if (Ae === "General") {
      const Te = ((_i = $.shearAreasZ) == null ? void 0 : _i.get(t)) || T * 5 / 6, Be = ((_j = $.shearAreasY) == null ? void 0 : _j.get(t)) || T * 5 / 6;
      Oe += `  D ${I(O(G))} B ${I(O(w))} AREA ${D(T * 1e6)} AS2 ${D(Te * 1e6)} AS3 ${D(Be * 1e6)} I33 ${D(M * 1e12)} I22 ${D(g * 1e12)} TORSION ${D((x || M + g) * 1e12)} S33POS ${D(2 * M / G * 1e9)} S33NEG ${D(2 * M / G * 1e9)} S22POS ${D(2 * g / w * 1e9)} S22NEG ${D(2 * g / w * 1e9)} Z33 ${D(2 * M / G * 1e9)} Z22 ${D(2 * g / w * 1e9)} R33 ${D(Math.sqrt(M / T) * 1e3)} R22 ${D(Math.sqrt(g / T) * 1e3)} `, i.push(Oe);
      return;
    }
    G && (Oe += `  D ${I(O(G))}`), w && (Oe += `  B ${I(O(w))}`), J && !G && (Oe += `  D ${I(O(J))}`), X && (Oe += `  TF ${I(O(X))}`), ae && (Oe += `  TW ${I(O(ae))}`), i.push(Oe);
  }), i.push("");
  const Ue = /* @__PURE__ */ new Map();
  let Bt = 0;
  h.forEach((e) => {
    const { dz: t } = le(e[2]), s = `${I(e[0])},${I(e[1])},${t}`;
    Ue.has(s) || Ue.set(s, `${++Bt}`);
  });
  const xe = /* @__PURE__ */ new Map(), Xe = [];
  {
    const e = /* @__PURE__ */ new Map();
    for (const s of C.springs ?? []) {
      if (!(s.k > 0)) continue;
      const n = e.get(s.node) ?? [0, 0, 0, 0, 0, 0];
      n[s.dof] += s.k, e.set(s.node, n);
    }
    const t = /* @__PURE__ */ new Map();
    for (const [s, n] of e) {
      const E = n.map((M, g) => g < 3 ? M * v / y : M * v * y), A = E.map((M) => +M.toPrecision(12)).join("|");
      let T = t.get(A);
      if (!T) {
        T = `SPR${t.size + 1}`, t.set(A, T);
        const M = ["UX", "UY", "UZ", "RX", "RY", "RZ"], g = E.map((x, N) => `${M[N]}  ${+x.toPrecision(12)}`);
        Xe.push(`  POINTSPRING  "${T}"  NONLINEARSPECOPTION  "LINKS"  ${g.join(" ")} `);
      }
      xe.set(s, T);
    }
    Xe.length && (i.push("$ POINT SPRING PROPERTIES"), Xe.forEach((s) => i.push(s)), i.push(""));
  }
  i.push("$ POINT COORDINATES");
  for (const [e, t] of Ue) {
    const [s, n, E] = e.split(",").map(Number);
    i.push(E ? `  POINT "${t}"  ${I(O(s))} ${I(O(n))} ${I(O(E))} ` : `  POINT "${t}"  ${I(O(s))} ${I(O(n))} `);
  }
  i.push("");
  const pe = (e) => {
    const t = h[e], { story: s, dz: n } = le(t[2]), E = `${I(t[0])},${I(t[1])},${n}`;
    return { pt: Ue.get(E) || "1", story: s };
  }, Et = (e) => {
    var _a2, _b2, _c2, _d2, _e3, _f2;
    const t = [], s = (_a2 = m.propertyModifiers) == null ? void 0 : _a2.get(e);
    s && s.some((N) => Math.abs(N - 1) > 1e-9) && t.push(`PROPMODIFIERS "${s.map((N) => I(N)).join(" ")}"`);
    const n = (_b2 = $.localAngles) == null ? void 0 : _b2.get(e);
    n !== void 0 && isFinite(n) && Math.abs(n) > 1e-9 && t.push(`ANG ${I(n)}`);
    const E = (_c2 = $.momentReleases) == null ? void 0 : _c2.get(e);
    if (E && E.some((N) => N)) {
      const N = [];
      E.length === 12 ? (E[0] && N.push("PI"), E[1] && N.push("V2I"), E[2] && N.push("V3I"), E[3] && N.push("TI"), E[4] && N.push("M2I"), E[5] && N.push("M3I"), E[6] && N.push("PJ"), E[7] && N.push("V2J"), E[8] && N.push("V3J"), E[9] && N.push("TJ"), E[10] && N.push("M2J"), E[11] && N.push("M3J")) : E.length === 6 && (E[0] && N.push("TI"), E[1] && N.push("M2I"), E[2] && N.push("M3I"), E[3] && N.push("TJ"), E[4] && N.push("M2J"), E[5] && N.push("M3J")), N.length > 0 && t.push(`RELEASE "${N.join(" ")}"`);
    }
    const A = (_d2 = $.insertionPoints) == null ? void 0 : _d2.get(e);
    A && (Math.abs(A[0]) > 1e-9 || Math.abs(A[1]) > 1e-9) && t.push(`LATEROFFSET ${I(O(A[0]))} TRANSOFFSET ${I(O(A[1]))}`);
    const T = (_e3 = $.rigidOffsets) == null ? void 0 : _e3.get(e), M = (_f2 = $.endOffsets) == null ? void 0 : _f2.get(e), g = M ? [M[0], M[1]] : T, x = M && M.length > 2 ? M[2] : 0;
    return g && (Math.abs(g[0]) > 1e-9 || Math.abs(g[1]) > 1e-9) && t.push(`LENGTHOFFI ${I(O(g[0]))} LENGTHOFFJ ${I(O(g[1]))} RIGIDZONE ${I(x)}`), t.length > 0 ? ` ${t.join(" ")} ` : "";
  }, Ke = [], ft = /* @__PURE__ */ new Set(), He = /* @__PURE__ */ new Map();
  R.forEach((e, t) => {
    if (e.length !== 2) return;
    const s = yt(h, e);
    if (s === "BEAM") return;
    const n = h[e[0]][2] <= h[e[1]][2] ? e[0] : e[1], E = h[e[0]][2] <= h[e[1]][2] ? e[1] : e[0];
    if (Math.abs(h[n][0] - h[E][0]) > 1e-6 || Math.abs(h[n][1] - h[E][1]) > 1e-6) return;
    const A = pe(n), T = Ze.get(t) || `Sec_${t}`, M = `${A.pt}_${T}_${s}`;
    He.has(M) || He.set(M, []), He.get(M).push({ i: t, bot: n, top: E, zBot: I(h[n][2]), zTop: I(h[E][2]), planPt: A.pt, secName: T, type: s });
  }), He.forEach((e, t) => {
    e.sort((n, E) => n.zBot - E.zBot);
    let s = 0;
    for (let n = 1; n <= e.length; n++) if (n === e.length || Math.abs(e[n].zBot - e[n - 1].zTop) > 1e-6) {
      const A = e.slice(s, n);
      A.length >= 1 && (Ke.push({ elemIndices: A.map((T) => T.i), planPt: A[0].planPt, bottomNodeIdx: A[0].bot, topNodeIdx: A[A.length - 1].top, secName: A[0].secName, type: A[0].type, nSegments: A.length }), A.forEach((T) => ft.add(T.i))), s = n;
    }
  }), i.push("$ LINE CONNECTIVITIES");
  const Ve = [], ve = (e) => Q.indexOf(e), St = /* @__PURE__ */ new Map(), ht = (e, t, s, n, E, A, T, M) => {
    const g = pe(n), x = pe(s);
    M !== void 0 && St.set(M, { name: e, story: g.story });
    const N = ve(g.story) - ve(x.story);
    N <= 0 ? i.push(`  LINE  "${e}"  BEAM  "${x.pt}"  "${g.pt}"  0`) : i.push(`  LINE  "${e}"  ${t}  "${x.pt}"  "${g.pt}"  ${N}`), Ve.push(`  LINEASSIGN  "${e}"  "${g.story}"  SECTION "${E}" ${A} MINNUMSTA ${T} AUTOMESH "YES"  MESHATINTERSECTIONS "${$.meshAtIntersections === false ? "NO" : "YES"}"  `);
  }, pt = /* @__PURE__ */ new Map();
  Ke.forEach((e, t) => {
    const s = Et(e.elemIndices[0]), n = [];
    let E = [];
    e.elemIndices.forEach((A, T) => {
      E.push(A);
      const [M, g] = R[A], x = h[M][2] >= h[g][2] ? M : g;
      (le(h[x][2]).dz === 0 || T === e.elemIndices.length - 1) && (n.push(E), E = []);
    }), n.forEach((A) => {
      const [T, M] = R[A[0]], g = h[T][2] <= h[M][2] ? T : M, [x, N] = R[A[A.length - 1]], G = h[x][2] >= h[N][2] ? x : N;
      ve(pe(G).story) - ve(pe(g).story);
      let w = `C${t + 1}`;
      for (let J = 1; ; J++) {
        const X = i.length;
        ht(w, e.type, g, G, e.secName, s, A.length);
        const ae = i[X], rt = pt.get(w);
        if (rt === void 0) {
          pt.set(w, ae);
          break;
        }
        if (i.splice(X, i.length - X), rt === ae) break;
        Ve.pop(), w = `C${t + 1}_${J}`;
      }
    });
  }), R.forEach((e, t) => {
    if (e.length !== 2 || ft.has(t)) return;
    const s = yt(h, e), n = Ze.get(t) || `Sec_${t}`, E = Et(t), A = h[e[0]][2] <= h[e[1]][2] ? e[0] : e[1], T = h[e[0]][2] <= h[e[1]][2] ? e[1] : e[0];
    ht(`E${t + 1}`, s === "BEAM" ? "BRACE" : s, A, T, n, E, 3, t);
  }), i.push("");
  const Fe = m.weightMode ?? "auto", me = /* @__PURE__ */ new Set();
  i.push("$ POINT ASSIGNS"), (_c = C.supports) == null ? void 0 : _c.forEach((e, t) => {
    const s = [];
    if (e[0] && s.push("UX"), e[1] && s.push("UY"), e[2] && s.push("UZ"), e[3] && s.push("RX"), e[4] && s.push("RY"), e[5] && s.push("RZ"), s.length > 0) {
      const n = pe(t), E = n.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", A = xe.has(t) ? ` SPRINGPROP "${xe.get(t)}" ` : "";
      i.push(`  POINTASSIGN  "${n.pt}"  "${n.story}"  RESTRAINT "${s.join(" ")}" ${E}${A} `), me.add(`${n.pt}@${n.story}`);
    }
  });
  for (const [e, t] of xe) {
    const s = pe(e);
    me.has(`${s.pt}@${s.story}`) || (i.push(`  POINTASSIGN  "${s.pt}"  "${s.story}"  SPRINGPROP "${t}" `), me.add(`${s.pt}@${s.story}`));
  }
  const Yt = !!(C.diaphragms && [...C.diaphragms.values()].some((e) => e !== 0)), At = m.diaphragm ?? "auto", qe = At === "d1" || At === "auto" && Yt, be = /* @__PURE__ */ new Set();
  C.diaphragms && C.diaphragms.forEach((e, t) => {
    e !== 0 && be.add(t);
  }), qe && be.size ? be.forEach((e) => {
    const t = pe(e), s = `${t.pt}@${t.story}`;
    !me.has(s) && t.story !== "Base" && (i.push(`  POINTASSIGN  "${t.pt}"  "${t.story}"  DIAPH "D1"  `), me.add(s));
  }) : qe && Ke.forEach((e) => {
    for (const t of e.elemIndices) {
      const [s, n] = R[t], E = h[s][2] >= h[n][2] ? s : n, A = pe(E), T = `${A.pt}@${A.story}`;
      !me.has(T) && A.story !== "Base" && (i.push(`  POINTASSIGN  "${A.pt}"  "${A.story}"  DIAPH "D1"  `), me.add(T));
    }
  }), Fe === "manual" && C.loads && C.loads.forEach((e, t) => {
    const [s, n, E] = oe(t, e);
    if (Math.abs(s) < 1e-10 && Math.abs(n) < 1e-10 && Math.abs(E) < 1e-10) return;
    const A = pe(t), T = `${A.pt}@${A.story}`;
    me.has(T) || (i.push(`  POINTASSIGN  "${A.pt}"  "${A.story}"  DIAPH "DISCONNECTED"  `), me.add(T));
  }), i.push(""), i.push("$ LINE ASSIGNS"), Ve.forEach((e) => i.push(e)), i.push("");
  const Ee = [], Tt = $.areaObjects, Mt = /* @__PURE__ */ new Set(), dt = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
  Tt == null ? void 0 : Tt.forEach((e) => e.cells.forEach((t) => Mt.add(t))), R.forEach((e, t) => {
    if (e.length === 4 || e.length === 3) {
      const s = h[e[0]], n = h[e[1]], E = h[e[2]], A = [n[0] - s[0], n[1] - s[1], n[2] - s[2]], T = [E[0] - s[0], E[1] - s[1], E[2] - s[2]], M = A[1] * T[2] - A[2] * T[1], g = A[2] * T[0] - A[0] * T[2], x = A[0] * T[1] - A[1] * T[0], N = Math.sqrt(M * M + g * g + x * x), G = N > 1e-10 && Math.abs(x) / N < 0.5;
      Ee.push({ idx: t, el: e, isWall: G }), Mt.has(t) && Ee.pop();
    }
  });
  const ue = (() => {
    for (const [e, t] of Ie) if (!t) return de.get(e);
    return de.values().next().value || "Conc_1";
  })();
  Tt == null ? void 0 : Tt.forEach((e, t) => {
    Ee.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && dt.set(e.cells[0], e.q), e.ang !== void 0 && It.set(e.cells[0], e.ang);
  });
  const De = "DECK";
  let Qe = false;
  const et = [], $t = (e) => {
    const t = m.elementInputs.plateFormulations, s = Ee.find((E) => E.isWall === e), n = t && s ? t.get(s.idx) : void 0;
    return n === 2 ? "Membrane" : n === 1 ? "ShellThin" : "ShellThick";
  }, mt = (e, t) => {
    const s = m.elementInputs.thicknesses, n = Ee.find((E) => E.isWall === e);
    return (n ? s == null ? void 0 : s.get(n.idx) : void 0) ?? (s == null ? void 0 : s.values().next().value) ?? t;
  }, ut = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], We = (e) => {
    var _a2;
    const s = (_a2 = $.shellModifiers) == null ? void 0 : _a2.get(e);
    if (s && s.length >= 8) return s.slice(0, 8);
    const n = $.membraneModifiers, E = $.bendingModifiers, A = n == null ? void 0 : n.get(e), T = E == null ? void 0 : E.get(e);
    if (A === void 0 && T === void 0) return null;
    const M = A ?? 1, g = T ?? 1;
    return [M, M, M, g, g, g, g, g];
  }, gt = (e, t) => {
    const s = Ee.filter((T) => T.isWall === t), n = /* @__PURE__ */ new Map();
    for (const T of s) {
      const M = We(T.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      n.set(M.map((g) => I(g)).join(","), M);
    }
    if (n.size === 0) return "";
    n.size > 1 && console.warn(`[e2k] "${e}": ${n.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const E = n.values().next().value, A = ut.map((T, M) => Math.abs(E[M] - 1) > 1e-9 ? `${T} ${I(E[M])}` : "").filter(Boolean);
    return A.length ? `  SHELLPROP  "${e}"  ${A.join(" ")} ` : "";
  }, Nt = m.elementInputs.thicknesses, Ot = m.elementInputs.plateFormulations, ye = (e) => {
    var _a2;
    const t = Nt == null ? void 0 : Nt.get(e.idx), s = Ot == null ? void 0 : Ot.get(e.idx), n = We(e.idx), E = (_a2 = m.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), A = E ? [E.tc, E.hr, E.wrt, E.wrb, E.sr, E.w].map((T) => I(T)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${t ?? "-"}|${s ?? "-"}|${n ? n.map((T) => I(T)).join(",") : "-"}|${ge(e.idx)}|${A}`;
  }, tt = (e) => {
    var _a2;
    if ((_a2 = m.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const t = We(e);
    return t ? Math.abs(t[3]) < 1e-9 && Math.abs(t[4]) < 1e-9 : false;
  }, we = /* @__PURE__ */ new Map();
  let kt = 0, Ut = 0, xt = 0;
  for (const e of Ee) {
    const t = ye(e);
    if (we.has(t)) continue;
    const s = e.isWall, n = !s && tt(e.idx), E = s ? ++Ut : n ? ++xt : ++kt, A = ge(e.idx);
    we.set(t, { nombre: (s ? "Muro" : n ? De : "Losa") + (E === 1 ? "" : String(E)), isWall: s, mem: n, t: Nt == null ? void 0 : Nt.get(e.idx), pf: Ot == null ? void 0 : Ot.get(e.idx), idx: e.idx, mat: de.get(A) ?? ue, acero: Ie.get(A) ?? false });
  }
  const ze = (e) => {
    var _a2;
    return ((_a2 = we.get(ye(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, Rt = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", Ht = (e, t) => {
    const s = Ee.find((A) => ye(A) === t), n = s ? We(s.idx) ?? null : null;
    if (!n) return "";
    const E = ut.map((A, T) => Math.abs(n[T] - 1) > 1e-9 ? `${A} ${I(n[T])}` : "").filter(Boolean);
    return E.length ? `  SHELLPROP  "${e}"  ${E.join(" ")} ` : "";
  }, Ge = Ee.find((e) => !e.isWall), Lt = Ee.find((e) => e.isWall), st = /* @__PURE__ */ new Set();
  Ge && st.add(ye(Ge)), Lt && st.add(ye(Lt));
  const Dt = [...we.entries()].filter(([e]) => !st.has(e)), ot = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = m.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, vt = (e) => e * v / y ** 2, Ct = (e, t) => {
    const s = (n) => D(O(n));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${ue}"  DECKMATERIAL "${ue}"  DECKSLABDEPTH ${s(t.tc)} DECKRIBDEPTH ${s(t.hr)} DECKRIBWIDTHTOP ${s(t.wrt)} DECKRIBWIDTHBOTTOM ${s(t.wrb)} DECKRIBSPACING ${s(t.sr)} DECKSHEARTHICKNESS ${s(76e-5)} DECKUNITWEIGHT ${D(vt(t.w))} SHEARSTUDDIAM ${s(0.019)} SHEARSTUDHEIGHT ${s(0.1)} SHEARSTUDFU 400 `;
  };
  if (Ee.some((e) => !e.isWall)) {
    Qe = !!Ge && tt(Ge.idx);
    const e = mt(false, 0.15);
    if (Qe) {
      i.push("$ DECK PROPERTIES");
      const s = [...we.values()].find((E) => E.nombre === De), n = ot(Ge == null ? void 0 : Ge.idx);
      (s == null ? void 0 : s.acero) ? i.push(`  SHELLPROP  "${De}"  PROPTYPE  "Slab"  MATERIAL "${s.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${I(O(e))} `) : n ? i.push(Ct(De, n)) : i.push(`  SHELLPROP  "${De}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${I(O(e))} `);
    } else i.push("$ SLAB PROPERTIES"), i.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${$t(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${I(O(e))} `);
    const t = gt(Qe ? De : "Losa", false);
    t && i.push(t), i.push("");
  }
  if (Ee.some((e) => e.isWall)) {
    i.push("$ WALL PROPERTIES");
    const e = mt(true, 0.2), t = $t(true);
    i.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${ue}"  MODELINGTYPE "${t}"  WALLTHICKNESS ${I(O(e))} `);
    const s = gt("Muro", true);
    s && i.push(s), i.push("");
  }
  if (Dt.length) {
    i.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, t] of Dt) {
      const s = t.t ?? (t.isWall ? 0.2 : 0.15);
      i.push(t.isWall ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Wall"  MATERIAL "${t.mat ?? ue}"  MODELINGTYPE "${Rt(t.pf)}"  WALLTHICKNESS ${I(O(s))} ` : t.mem && t.acero ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${t.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${I(O(s))} ` : t.mem && ot(t.idx) ? Ct(t.nombre, ot(t.idx)) : t.mem ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${I(O(s))} ` : `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${Rt(t.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${I(O(s))} `);
      const n = Ht(t.nombre, e);
      n && i.push(n);
    }
    i.push("");
  }
  if (Ee.length > 0) {
    i.push("$ AREA CONNECTIVITIES");
    const e = [];
    Ee.forEach((t, s) => {
      const { el: n, isWall: E } = t, A = E ? `W${s + 1}` : `F${s + 1}`, T = E ? "PANEL" : "FLOOR", M = n.map((g) => pe(g));
      if (E) {
        const g = (J) => Q.indexOf(J);
        if (new Set(M.map((J) => J.pt)).size === 4) {
          const J = Math.max(...M.map((ae) => g(ae.story))), X = M.map((ae) => J - g(ae.story));
          i.push(`  AREA "${A}"  ${T}  4  "${M[0].pt}"  "${M[1].pt}"  "${M[2].pt}"  "${M[3].pt}"  ${X.join("  ")}  `), e.push(`  AREAASSIGN  "${A}"  "${Q[J]}"  SECTION "${ze(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const N = h[n[0]][2] <= h[n[2]][2] ? 0 : 2, G = h[n[1]][2] <= h[n[3]][2] ? 1 : 3;
        i.push(`  AREA "${A}"  ${T}  4  "${M[N].pt}"  "${M[G].pt}"  "${M[G].pt}"  "${M[N].pt}"  1  1  0  0  `);
        const w = M[N === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${A}"  "${w}"  SECTION "${ze(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const g = M.length, x = (X) => Q.indexOf(X), N = Math.max(...M.map((X) => x(X.story))), G = M.map((X) => N - x(X.story)), w = Q[N] ?? M[0].story;
        i.push(`  AREA "${A}"  ${T}  ${g}  ` + M.map((X) => `"${X.pt}"`).join("  ") + "  " + G.join("  ") + "  ");
        const J = It.get(t.idx) ?? (Y == null ? void 0 : Y.get(t.idx));
        e.push(tt(t.idx) ? `  AREAASSIGN  "${A}"  "${w}"  SECTION "${ze(t)}"  ANG ${I(J ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${A}"  "${w}"  SECTION "${ze(t)}" ${qe && (!be.size || (R[t.idx] ?? []).every((X) => be.has(X))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), et.push({ name: A, story: w, idx: t.idx });
      }
    }), i.push(""), i.push("$ AREA ASSIGNS"), e.forEach((t) => i.push(t)), i.push("");
  }
  const Wt = Fe === "manual" ? 0 : K ?? 1;
  i.push("$ LOAD PATTERNS");
  const Re = ((_d = m.loadPatterns) == null ? void 0 : _d.length) ? m.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: Wt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Re) {
    let t;
    e.type === "Dead" ? t = Fe === "manual" ? 0 : e.selfWeightMultiplier ?? K ?? 1 : (t = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${e.type ?? "Other"}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), i.push(`  LOADPATTERN "${e.name}"  TYPE  "${e.type ?? "Other"}"  SELFWEIGHT  ${t}`);
  }
  i.push("");
  const Ce = m.loadPatternDestino && Re.some((e) => e.name === m.loadPatternDestino) ? m.loadPatternDestino : ((_e2 = Re.find((e) => e.type === "Dead")) == null ? void 0 : _e2.name) ?? Re[0].name, nt = [], at = /* @__PURE__ */ new Map(), Pt = (e, t) => {
    const s = at.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let n = 0; n < 6; n++) s[n] += t[n] ?? 0;
    at.set(e, s);
  }, zt = Ce === (((_f = Re.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Re[0].name), jt = Fe === "manual" || !zt || se;
  if (C.loads && C.loads.size > 0 && C.loads.forEach((e, t) => {
    const [s, n, E] = oe(t, e), [A, T, M] = re(t, e);
    Pt(t, [s, n, jt ? E : 0, A, T, M]);
  }), C.moments && C.moments.size > 0 && C.moments.forEach((e, t) => {
    Pt(t, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), at.forEach((e, t) => {
    if (e.every((n) => Math.abs(n) <= 1e-10)) return;
    const s = pe(t);
    nt.push(`  POINTLOAD  "${s.pt}"  "${s.story}"  TYPE "FORCE"  LC "${Ce}"  FX ${D(S(e[0]))}  FY ${D(S(e[1]))}  FZ ${D(S(e[2]))}  MX ${D(b(e[3]))}  MY ${D(b(e[4]))}  MZ ${D(b(e[5]))}`);
  }), nt.length > 0 && (i.push("$ POINT OBJECT LOADS"), nt.forEach((e) => i.push(e)), i.push("")), se && ne.size > 0) {
    const e = [];
    for (const t of ne) {
      const s = te.get(t), n = St.get(t);
      if (!n) continue;
      const E = (A) => D(f(A) / y);
      Math.abs(s[2]) > 1e-12 && e.push(`  LINELOAD  "${n.name}"  "${n.story}"  TYPE "UNIFF"  DIR "${s[2] < 0 ? "GRAV" : "Z"}"  LC "${Ce}"  FVAL ${E(Math.abs(s[2]))}`), Math.abs(s[0]) > 1e-12 && e.push(`  LINELOAD  "${n.name}"  "${n.story}"  TYPE "UNIFF"  DIR "X"  LC "${Ce}"  FVAL ${E(s[0])}`), Math.abs(s[1]) > 1e-12 && e.push(`  LINELOAD  "${n.name}"  "${n.story}"  TYPE "UNIFF"  DIR "Y"  LC "${Ce}"  FVAL ${E(s[1])}`);
    }
    e.length && (i.push("$ FRAME OBJECT LOADS"), e.forEach((t) => i.push(t)), i.push(""));
  }
  if (p && p.size > 0 && et.length > 0) {
    const e = [];
    for (const t of et) {
      const s = dt.get(t.idx), n = s !== void 0 ? { value: s } : p.get(t.idx);
      if (!n || Math.abs(n.value) < 1e-12) continue;
      const E = n.dir ?? "GRAV", A = E === "GRAV" ? -n.value : n.value;
      e.push(`  AREALOAD  "${t.name}"  "${t.story}"  TYPE "UNIFF"  DIR "${E}"  LC "${n.pattern ?? Ce}"  FVAL ${D(f(A) / (y * y))}`);
    }
    e.length > 0 && (i.push("$ SHELL OBJECT LOADS"), e.forEach((t) => i.push(t)), i.push(""));
  }
  i.push("$ ANALYSIS OPTIONS"), i.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), i.push('  PDELTA  METHOD "NONE"  '), i.push("");
  const it = Fe === "manual";
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
function yt(m, h) {
  const R = m[h[0]], C = m[h[1]], $ = Math.abs(C[2] - R[2]), H = Math.sqrt((C[0] - R[0]) ** 2 + (C[1] - R[1]) ** 2), W = $ > H * 0.5;
  return W && H > 0.01 ? "BRACE" : W ? "COLUMN" : "BEAM";
}
export {
  ns as a,
  as as e,
  os as p
};
