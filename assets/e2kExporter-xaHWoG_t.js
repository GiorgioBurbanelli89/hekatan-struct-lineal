function b(M) {
  return M && parseFloat(M) || 0;
}
function yt(M) {
  const l = /* @__PURE__ */ new Map(), N = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let L;
  for (; (L = N.exec(M)) !== null; ) l.set(L[1], L[2] !== void 0 ? L[2] : L[3]);
  return l;
}
function os(M) {
  const l = M.split(/\r?\n/);
  return l.some((L) => L.trim().startsWith("TABLE:")) ? Xt(l) : Kt(l);
}
function Xt(M) {
  var _a, _b, _c, _d, _e, _f;
  const l = [];
  let N = "";
  for (const C of M) {
    const d = C.trimEnd();
    d.endsWith("_") ? N += d.slice(0, -1) + " " : (N += d, l.push(N), N = "");
  }
  N && l.push(N);
  const L = { force: "KN", length: "m" };
  let I = "UX,UY,UZ,RX,RY,RZ";
  const x = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), V = [], Z = [], ee = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), oe = [], se = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), r = [], T = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
  let Y = "";
  for (const C of l) {
    const d = C.trim();
    if (!d || d.startsWith(";") || d.startsWith("File ")) continue;
    if (d.startsWith("TABLE:")) {
      const s = d.match(/TABLE:\s+"(.+?)"/);
      Y = s ? s[1].toUpperCase() : "";
      continue;
    }
    if (d === "END TABLE DATA") {
      Y = "";
      continue;
    }
    const o = yt(d);
    switch (Y) {
      case "PROGRAM CONTROL": {
        const s = o.get("CurrUnits");
        if (s) {
          const a = s.split(",").map((i) => i.trim());
          a[0] && (L.force = a[0]), a[1] && (L.length = a[1]);
        }
        break;
      }
      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const s = o.get("Material");
        s && !x.has(s) && x.set(s, { E: 0, nu: 0, G: 0 });
        break;
      }
      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const s = o.get("Material");
        if (s) {
          const a = x.get(s) || { E: 0, nu: 0, G: 0 };
          a.E = b(o.get("E1")), a.G = b(o.get("G12")), a.nu = b(o.get("U12")), a.density = b(o.get("UnitMass")), x.set(s, a);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const s = o.get("Material");
        s && x.has(s) && (x.get(s).fy = b(o.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const s = o.get("SectionName");
        s && f.set(s, { material: o.get("Material") || "", shape: o.get("Shape") || "Rectangular", D: b(o.get("t3")), B: b(o.get("t2")), TF: b(o.get("tf")), TW: b(o.get("tw")), A: b(o.get("Area")), Iz: b(o.get("I33")), Iy: b(o.get("I22")), J: b(o.get("TorsConst")), As2: b(o.get("AS2")), As3: b(o.get("AS3")) });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const s = o.get("SectionName");
        s && H.set(s, { h: b(o.get("Height")), b: b(o.get("Width")), t: b(o.get("FlngThick")) || b(o.get("WebThick")), mat: o.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const s = o.get("SectionName");
        s && H.set(s, { h: 0, b: 0, D: b(o.get("OuterDiam")), t: b(o.get("WallThick")), mat: o.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const s = o.get("SectionName");
        s && Q.set(s, { mat: o.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const s = o.get("SectionName");
        s && Q.set(s, { mat: o.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const s = o.get("Section");
        s && w.set(s, { material: o.get("Material") || "", type: o.get("Type") || "Shell", thickness: b(o.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const s = o.get("Joint");
        if (s) {
          const a = b(o.get("XorR")), i = b(o.get("Y")), u = b(o.get("Z"));
          K.set(s, [a, i, u]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const s = o.get("Frame"), a = o.get("JointI"), i = o.get("JointJ");
        s && a && i && V.push({ name: s, j1: a, j2: i });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const s = o.get("Area");
        if (s) {
          const a = parseInt(o.get("NumJoints") || "4"), i = [];
          for (let u = 1; u <= a; u++) {
            const G = o.get(`Joint${u}`);
            G && i.push(G);
          }
          i.length >= 3 && Z.push({ name: s, joints: i });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const s = o.get("Joint");
        if (s) {
          const a = [((_a = o.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = o.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = o.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = o.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = o.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = o.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          ee.set(s, a);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const s = o.get("Joint");
        s && te.set(s, ["U1", "U2", "U3", "R1", "R2", "R3"].map((a) => parseFloat(o.get(a) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const s = o.get("Frame"), a = o.get("AnalSect");
        s && a && ie.set(s, a);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const s = o.get("Area"), a = o.get("Section");
        s && a && ce.set(s, a);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const s = o.get("Frame"), a = o.get("Dir"), i = b(o.get("FOverLA"));
        if (s && a && i) {
          const u = { X: 0, Y: 1, Z: 2 }[a];
          if (u !== void 0) {
            const G = Me.get(s) ?? [0, 0, 0];
            G[u] += i, Me.set(s, G);
          }
        }
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const s = o.get("Solid");
        if (s) {
          const a = [];
          for (let i = 1; i <= 8; i++) {
            const u = o.get(`Joint${i}`);
            u && a.push(u);
          }
          a.length === 8 && r.push({ name: s, joints: a });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const s = o.get("SolidProp");
        s && T.set(s, { material: o.get("Material") || "", incomp: (o.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const s = o.get("Solid"), a = o.get("SolidProp");
        s && a && R.set(s, a);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const s = o.get("Area");
        s && he.set(s, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((a) => o.has(a) ? b(o.get(a)) : 1));
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const s = o.get("Frame");
        s && Ee.set(s, b(o.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const s = o.get("Frame");
        s && se.set(s, [b(o.get("LengthI")), b(o.get("LengthJ")), b(o.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const s = o.get("Joint");
        s && oe.push({ joint: s, fx: b(o.get("F1")), fy: b(o.get("F2")), fz: b(o.get("F3")), mx: b(o.get("M1")), my: b(o.get("M2")), mz: b(o.get("M3")) });
        break;
      }
    }
  }
  return bt(L, I, x, f, w, K, V, Z, ee, ie, ce, oe, se, Ee, he, Me, r, T, R, H, Q, te);
}
function Kt(M) {
  const l = { force: "KN", length: "m" };
  let N = "UX,UY,UZ,RX,RY,RZ";
  const L = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), Q = [], f = [], w = /* @__PURE__ */ new Map(), K = [], V = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), ie = [], ce = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map();
  let se = "", Ee = "";
  for (const r of M) {
    const T = r.trim();
    if (!T || T.startsWith(";")) continue;
    if (!r.startsWith(" ") && !r.startsWith("	")) {
      const C = T.toUpperCase();
      if (C === "END") break;
      C.startsWith("SHELL SECTION") ? se = "SHELL SECTION" : C.startsWith("FRAME SECTION") ? se = "FRAME SECTION" : se = C.split(/\s+/)[0];
      continue;
    }
    const R = yt(T), Y = T.split(/\s+/);
    switch (se) {
      case "SYSTEM": {
        const C = R.get("DOF");
        C && (N = C);
        const d = R.get("LENGTH");
        d && (l.length = d);
        const o = R.get("FORCE");
        o && (l.force = o);
        break;
      }
      case "JOINT": {
        const C = Y[0];
        H.set(C, [b(R.get("X")), b(R.get("Y")), b(R.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const C = R.get("ADD"), d = R.get("DOF");
        if (C && d) {
          const o = d.split(","), s = [false, false, false, false, false, false];
          for (const a of o) {
            const i = a.toUpperCase();
            (i === "UX" || i === "U1") && (s[0] = true), (i === "UY" || i === "U2") && (s[1] = true), (i === "UZ" || i === "U3") && (s[2] = true), (i === "RX" || i === "R1") && (s[3] = true), (i === "RY" || i === "R2") && (s[4] = true), (i === "RZ" || i === "R3") && (s[5] = true);
          }
          w.set(C, s);
        }
        break;
      }
      case "MATERIAL": {
        const C = R.get("NAME");
        if (C) Ee = C, L.set(C, { E: 0, nu: 0, G: 0 });
        else if (Ee) {
          const d = L.get(Ee), o = R.get("E");
          o && (d.E = b(o));
          const s = R.get("U");
          s && (d.nu = b(s)), d.G = d.E / (2 * (1 + d.nu));
          const a = R.get("M");
          a && (d.density = b(a));
        }
        break;
      }
      case "SHELL": {
        const C = Y[0], d = R.get("J");
        R.get("SEC"), d && f.push({ name: C, joints: d.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const C = R.get("NAME");
        C && x.set(C, { material: R.get("MAT") || "", type: R.get("TYPE") || "Shell", thickness: b(R.get("TH")) });
        break;
      }
      case "FRAME": {
        const C = Y[0], d = R.get("J");
        if (d) {
          const o = d.split(",");
          o.length >= 2 && Q.push({ name: C, j1: o[0], j2: o[1] });
        }
        break;
      }
      case "LOAD": {
        const C = R.get("ADD");
        C && K.push({ joint: C, fx: b(R.get("UX")), fy: b(R.get("UY")), fz: b(R.get("UZ")), mx: b(R.get("MX")), my: b(R.get("MY")), mz: b(R.get("MZ")) });
        break;
      }
    }
  }
  return bt(l, N, L, I, x, H, Q, f, w, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), K, V, Z, ee, te, ie, ce, oe);
}
function bt(M, l, N, L, I, x, H, Q, f, w, K, V, Z = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = [], oe = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), Ee, he, Me = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const r = [], T = /* @__PURE__ */ new Map(), R = [];
  for (const [A, O] of x) T.set(A, R.length), r.push(A), R.push(O);
  const Y = [], C = [], d = /* @__PURE__ */ new Map();
  for (const A of H) {
    const O = T.get(A.j1), $ = T.get(A.j2);
    if (O !== void 0 && $ !== void 0) {
      const B = Y.length;
      Y.push([O, $]), C.push(A.name);
      const F = w.get(A.name);
      F && d.set(B, F);
    }
  }
  const o = Y.length;
  for (const A of Q) {
    const O = A.joints.map(($) => T.get($)).filter(($) => $ !== void 0);
    if (O.length >= 3) {
      const $ = Y.length;
      Y.push(O), C.push(A.name);
      const B = K.get(A.name);
      B && d.set($, B);
    }
  }
  const s = Y.length - o, a = [];
  for (const A of ce) {
    const O = A.joints.map((F) => T.get(F));
    if (O.some((F) => F === void 0)) continue;
    const $ = Y.length;
    Y.push([O[0], O[1], O[3], O[2], O[4], O[5], O[7], O[6]]), C.push(A.name), a.push($);
    const B = se.get(A.name);
    B && d.set($, B);
  }
  const i = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, u = /* @__PURE__ */ new Map(), G = N.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let A = 0; A < Y.length; A++) {
    const O = d.get(A), $ = O ? L.get(O) : null, B = O ? I.get(O) : null;
    if ($ || Y[A].length === 2) {
      const F = $ || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, j = N.get(F.material) || G, _ = j.E || G.E, q = j.nu || 0.3, v = j.G || _ / (2 * (1 + q));
      i.elasticities.set(A, _), i.shearModuli.set(A, v), i.areas.set(A, F.A || F.D * F.B), i.momentsOfInertiaZ.set(A, F.Iz || F.B * F.D ** 3 / 12), i.momentsOfInertiaY.set(A, F.Iy || F.D * F.B ** 3 / 12), i.torsionalConstants.set(A, F.J || 0), i.densities.set(A, j.density || 0), F.As2 && (i.shearAreasZ ?? (i.shearAreasZ = /* @__PURE__ */ new Map()), i.shearAreasZ.set(A, F.As2)), F.As3 && (i.shearAreasY ?? (i.shearAreasY = /* @__PURE__ */ new Map()), i.shearAreasY.set(A, F.As3));
      const U = Z.get(C[A]);
      U && (i.endOffsets ?? (i.endOffsets = /* @__PURE__ */ new Map()), i.endOffsets.set(A, U));
      const ne = ee.get(C[A]);
      ne && (i.localAngles ?? (i.localAngles = /* @__PURE__ */ new Map()), i.localAngles.set(A, ne)), ((_a = F.shape) == null ? void 0 : _a.includes("Wide Flange")) || F.shape === "I" ? u.set(A, { type: "I", b: F.B, h: F.D, name: O || "I-section" }) : u.set(A, { type: "rect", b: F.B, h: F.D });
      const X = O ? Ee == null ? void 0 : Ee.get(O) : void 0;
      if (X && X.t > 0 && (X.b > 0 && X.h > 0 || (X.D ?? 0) > 0)) {
        const Ie = O ? he == null ? void 0 : he.get(O) : void 0, re = Ie && ((_b = N.get(Ie.mat)) == null ? void 0 : _b.E) || 0;
        u.set(A, X.D ? { type: "CFT", d: X.D, tw: X.t, name: O, ...re > 0 ? { fillE: re } : {} } : { type: "CFT", b: X.b, h: X.h, tw: X.t, name: O, ...re > 0 ? { fillE: re } : {} });
      }
    } else if (B) {
      const F = N.get(B.material) || G, j = F.E || G.E, _ = F.nu || 0.2, q = F.G || j / (2 * (1 + _));
      i.elasticities.set(A, j), i.shearModuli.set(A, q), i.thicknesses.set(A, B.thickness), i.poissonsRatios.set(A, _), i.plateFormulations ?? (i.plateFormulations = /* @__PURE__ */ new Map()), i.plateFormulations.set(A, /thin/i.test(B.type) ? 1 : 0);
      const v = te.get(C[A]);
      v && (i.shellModifiers ?? (i.shellModifiers = /* @__PURE__ */ new Map()), i.shellModifiers.set(A, v), i.membraneModifiers ?? (i.membraneModifiers = /* @__PURE__ */ new Map()), i.membraneModifiers.set(A, v[0]), i.bendingModifiers ?? (i.bendingModifiers = /* @__PURE__ */ new Map()), i.bendingModifiers.set(A, v[3])), i.densities.set(A, F.density || 0);
    }
  }
  if (a.length) {
    let A = false;
    for (const O of a) {
      const $ = oe.get(d.get(O) || ""), B = $ && N.get($.material) || G, F = B.E || G.E, j = B.nu || 0.2;
      i.elasticities.set(O, F), i.poissonsRatios.set(O, j), i.shearModuli.set(O, B.G || F / (2 * (1 + j))), i.densities.set(O, B.density || 0), ($ == null ? void 0 : $.incomp) && (A = true);
    }
    i.solidIncompatible = A;
  }
  const J = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [A, O] of f) {
    const $ = T.get(A);
    $ !== void 0 && J.supports.set($, O);
  }
  {
    const A = [];
    for (const [O, $] of Me) {
      const B = T.get(O);
      B !== void 0 && $.forEach((F, j) => {
        F > 0 && A.push({ node: B, dof: j, k: F });
      });
    }
    A.length && (J.springs = A);
  }
  for (const [A, O] of ie) {
    const $ = C.indexOf(A);
    if ($ < 0 || Y[$].length !== 2) continue;
    i.frameLoads ?? (i.frameLoads = /* @__PURE__ */ new Map()), i.frameLoads.set($, O);
    const B = R[Y[$][0]], F = R[Y[$][1]], j = [F[0] - B[0], F[1] - B[1], F[2] - B[2]], _ = Math.hypot(j[0], j[1], j[2]);
    if (_ < 1e-9) continue;
    const q = [j[0] / _, j[1] / _, j[2] / _], v = _ * _ / 12, U = [q[1] * O[2] - q[2] * O[1], q[2] * O[0] - q[0] * O[2], q[0] * O[1] - q[1] * O[0]], ne = (X, Ie) => {
      const re = J.loads.get(X) || [0, 0, 0, 0, 0, 0];
      for (let Se = 0; Se < 6; Se++) re[Se] += Ie[Se];
      J.loads.set(X, re);
    };
    ne(Y[$][0], [O[0] * _ / 2, O[1] * _ / 2, O[2] * _ / 2, v * U[0], v * U[1], v * U[2]]), ne(Y[$][1], [O[0] * _ / 2, O[1] * _ / 2, O[2] * _ / 2, -v * U[0], -v * U[1], -v * U[2]]);
  }
  for (const A of V) {
    const O = T.get(A.joint);
    if (O !== void 0) {
      const $ = J.loads.get(O) || [0, 0, 0, 0, 0, 0];
      $[0] += A.fx, $[1] += A.fy, $[2] += A.fz, $[3] += A.mx, $[4] += A.my, $[5] += A.mz, J.loads.set(O, $);
    }
  }
  return { units: M, dof: l, materials: N, frameSections: L, shellSections: I, nodes: R, nodeNames: r, nodeNameToIdx: T, elements: Y, elementNames: C, elementSections: d, nodeInputs: J, elementInputs: i, sectionShapes: u, info: { nNodes: R.length, nFrames: o, nShells: s, title: `SAP2000 (${o} frames, ${s} shells)` } };
}
function ns(M) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const { nodes: l, elements: N, nodeInputs: L, elementInputs: I } = M, x = { force: "KN", length: "m" };
  M.units && (M.units.force !== "KN" || M.units.length !== "m") && console.warn(`[s2k] el modelo va en kN\xB7m y el exportador NO convierte: se declara CurrUnits="KN, m, C" y se ignora "${M.units.force}, ${M.units.length}". Etiquetarlo de otra forma hace que SAP2000 lea las fuerzas escaladas.`);
  const H = M.title || "Awatif Model", Q = [], f = (o) => Q.push(o), w = () => Q.push(" ");
  f(`File ${H}.$2k was saved on m/d/yy at h:mm:ss`), w(), f('TABLE:  "ACTIVE DEGREES OF FREEDOM"'), f("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes"), w();
  const K = [], V = (o) => {
    var _a2, _b2, _c2, _d2;
    const s = ((_a2 = I.elasticities) == null ? void 0 : _a2.get(o)) || 0, a = (_b2 = I.poissonsRatios) == null ? void 0 : _b2.get(o), i = ((_c2 = I.shearModuli) == null ? void 0 : _c2.get(o)) || 0, u = a !== void 0 ? a : s > 0 && i > 0 ? Math.max(0, Math.min(0.5, s / (2 * i) - 1)) : 0.2, G = i > 0 ? i : s > 0 ? s / (2 * (1 + u)) : 0, J = ((_d2 = I.densities) == null ? void 0 : _d2.get(o)) || 0;
    return { E: s, nu: u, G, rho: J, key: `MAT_${Math.round(s)}_n${u.toFixed(4)}` };
  }, Z = [], ee = [];
  if (N.forEach((o, s) => {
    o.length === 2 ? K.push(s) : o.length === 8 ? ee.push(s) : Z.push(s);
  }), K.length > 0) {
    f('TABLE:  "CONNECTIVITY - FRAME"');
    for (const o of K) {
      const s = N[o];
      f(`   Frame=${o + 1}   JointI=${s[0] + 1}   JointJ=${s[1] + 1}   IsCurved=No`);
    }
    w();
  }
  if (Z.length > 0) {
    f('TABLE:  "CONNECTIVITY - AREA"');
    for (const o of Z) {
      const s = N[o], a = s.map((i, u) => `Joint${u + 1}=${i + 1}`).join("   ");
      f(`   Area=${o + 1}   NumJoints=${s.length}   ${a}`);
    }
    w();
  }
  if (ee.length > 0) {
    f('TABLE:  "CONNECTIVITY - SOLID"');
    for (const o of ee) {
      const s = N[o], a = [s[0], s[1], s[3], s[2], s[4], s[5], s[7], s[6]];
      f(`   Solid=${o + 1}   ${a.map((i, u) => `Joint${u + 1}=${i + 1}`).join("   ")}`);
    }
    w();
  }
  f('TABLE:  "COORDINATE SYSTEMS"'), f("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0"), w(), f('TABLE:  "DATABASE FORMAT TYPES"'), f("   UnitsCurr=Yes   OverrideE=No"), w();
  const te = /* @__PURE__ */ new Map(), ie = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map();
  for (const o of K) {
    const s = ((_a = I.areas) == null ? void 0 : _a.get(o)) || 0, a = ((_b = I.momentsOfInertiaZ) == null ? void 0 : _b.get(o)) || 0, i = ((_c = I.momentsOfInertiaY) == null ? void 0 : _c.get(o)) || 0, u = ((_d = I.torsionalConstants) == null ? void 0 : _d.get(o)) || 0, G = ((_e = I.elasticities) == null ? void 0 : _e.get(o)) || 0, J = V(o).key, A = ((_f = I.shearAreasZ) == null ? void 0 : _f.get(o)) ?? 0, O = ((_g = I.shearAreasY) == null ? void 0 : _g.get(o)) ?? 0, $ = (_h = I.sectionShapes) == null ? void 0 : _h.get(o);
    let B;
    const F = ($ == null ? void 0 : $.type) === "CFT" && $.d > 0 && $.tw > 0 && $.tw < $.d / 2 && !($.b > 0 && $.h > 0);
    if (M.cftAs !== "general" && ($ == null ? void 0 : $.type) === "CFT" && G > 0 && (F || $.b > 0 && $.h > 0 && $.tw > 0 && $.tw < Math.min($.b, $.h) / 2)) {
      const q = F ? $.d - 2 * $.tw : 0, v = F ? 0 : $.b - 2 * $.tw, U = F ? 0 : $.h - 2 * $.tw, ne = F ? Math.PI * ($.d * $.d - q * q) / 4 : $.b * $.h - v * U, X = F ? Math.PI * q * q / 4 : v * U, Ie = $.fillE > 0 ? $.fillE / G : Math.max(0.01, Math.min(1, (s - ne) / X)), re = Ie * G, Se = 0.2, $e = `MAT_${Math.round(re)}_n${Se.toFixed(4)}`, we = V(o).rho;
      ie.has($e) || ie.set($e, { E: re, nu: Se, G: re / (2 * (1 + Se)), rho: we * Ie }), B = F ? { b: $.d, h: $.d, t: $.tw, Ec: re, nuC: Se, matFill: $e, D: $.d } : { b: $.b, h: $.h, t: $.tw, Ec: re, nuC: Se, matFill: $e };
    }
    const j = `A${s.toPrecision(6)}_Iz${a.toPrecision(6)}_s${A.toPrecision(6)}_${O.toPrecision(6)}${B ? B.D ? `_SDC${B.D}x${B.t}` : `_SD${B.b}x${B.h}x${B.t}` : ""}`;
    if (!te.has(j)) {
      let q = 0.3, v = 0.3;
      s > 0 && a > 0 && (q = Math.sqrt(12 * a / s), v = s / q), te.set(j, { A: s, Iz: a, Iy: i, J: u, b: v, h: q, matKey: J, As2: A > 0 ? A : s * 5 / 6, As3: O > 0 ? O : s * 5 / 6, sd: B });
    }
    const _ = [...te.keys()].indexOf(j) + 1;
    ce.set(o, `SEC${_}`);
  }
  if (K.length > 0) {
    f('TABLE:  "FRAME SECTION ASSIGNMENTS"');
    for (const o of K) {
      const s = ce.get(o) || "SEC1";
      f(`   Frame=${o + 1}   AutoSelect=N.A.   AnalSect=${s}   MatProp=Default`);
    }
    w();
  }
  if (te.size > 0) {
    f('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"');
    let o = 0;
    for (const [, s] of te) {
      if (o++, s.sd) {
        f(`   SectionName=SEC${o}   Material=${s.matKey}   Shape="SD Section"   Area=${D(s.A)}   TorsConst=${D(s.J)}   I33=${D(s.Iz)}   I22=${D(s.Iy)}   I23=0   AS2=${D(s.As2)}   AS3=${D(s.As3)} _`), f("        Color=Cyan   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
        continue;
      }
      f(`   SectionName=SEC${o}   Material=${s.matKey}   Shape=General   t3=${D(s.h)}   t2=${D(s.b)}   Area=${D(s.A)}   TorsConst=${D(s.J)}   I33=${D(s.Iz)}   I22=${D(s.Iy)}   I23=0   AS2=${D(s.As2)}   AS3=${D(s.As3)} _`), f("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1");
    }
    w();
  }
  const oe = [...te.values()].map((o, s) => ({ sec: o, name: `SEC${s + 1}` })).filter((o) => o.sec.sd);
  if (oe.length > 0) {
    f('TABLE:  "SECTION DESIGNER PROPERTIES 01 - GENERAL"');
    for (const { name: a } of oe) f(`   SectionName=${a}   DesignType="No Check/Design"   DsgnOrChck=Check   IncludeVStr=No   AxisAngle=90   MeshSzAbs=0   MeshSzRel=0.05`);
    w();
    const o = oe.filter((a) => !a.sec.sd.D), s = oe.filter((a) => a.sec.sd.D);
    if (o.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE"');
      for (const { sec: a, name: i } of o) {
        const u = a.sd;
        f(`   SectionName=${i}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${a.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   Height=${D(u.h)}   Width=${D(u.b)}   FlngThick=${D(u.t)}   WebThick=${D(u.t)}   Rotation=0 _`), f('        CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0   DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0');
      }
      w();
    }
    if (s.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE"');
      for (const { sec: a, name: i } of s) {
        const u = a.sd;
        f(`   SectionName=${i}   ShapeName=TUBO   ShapeType="User Defined"   ShapeMat=${a.matKey}   ZOrder=1   FillColor=Gray4   XCenter=0   YCenter=0   OuterDiam=${D(u.D)}   WallThick=${D(u.t)}   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), f("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      w();
    }
    if (o.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE"');
      for (const { sec: a, name: i } of o) {
        const u = a.sd;
        f(`   SectionName=${i}   ShapeName=RELLENO   ShapeMat=${u.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Height=${D(u.h - 2 * u.t)}   Width=${D(u.b - 2 * u.t)}   Rotation=0   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   BCoreMinor=0 _`), f("        DCoreMajorPositive=0   DCoreMajorNegative=0   DCoreMinorPositive=0   DCoreMinorNegative=0");
      }
      w();
    }
    if (s.length > 0) {
      f('TABLE:  "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE"');
      for (const { sec: a, name: i } of s) {
        const u = a.sd;
        f(`   SectionName=${i}   ShapeName=RELLENO   ShapeMat=${u.matFill}   ZOrder=2   FillColor=Gray4   XCenter=0   YCenter=0   Diameter=${D(u.D - 2 * u.t)}   Reinforcing=No   CoreDim="Program Determined"   BCoreMajor=0   DCoreMajorPositive=0`);
      }
      w();
    }
    f('TABLE:  "SECTION DESIGNER PROPERTIES 30 - FIBER GENERAL"');
    for (const { name: a } of oe) f(`   SectionName=${a}   NumFibersD2=3   NumFibersD3=3   CoordSys=Cartesian   GridAngle=0   LumpRebar=No   FiberPMM=No   FiberMC=No`);
    w();
  }
  {
    const o = K.filter((s) => {
      var _a2;
      const a = (_a2 = I.localAngles) == null ? void 0 : _a2.get(s);
      return a !== void 0 && isFinite(a) && Math.abs(a) > 1e-9;
    });
    if (o.length > 0) {
      f('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"');
      for (const s of o) f(`   Frame=${s + 1}   Angle=${D(I.localAngles.get(s))}   AdvanceAxes=No`);
      w();
    }
  }
  {
    const o = I.endOffsets, s = K.filter((a) => {
      const i = o == null ? void 0 : o.get(a);
      return !!i && (Math.abs(i[0]) > 1e-9 || Math.abs(i[1]) > 1e-9);
    });
    if (s.length > 0) {
      f('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"');
      for (const a of s) {
        const i = o.get(a);
        f(`   Frame=${a + 1}   Type=User   LengthI=${D(i[0])}   LengthJ=${D(i[1])}   RigidFactor=${D(i.length > 2 ? i[2] : 0)}`);
      }
      w();
    }
  }
  const se = !!M.layeredSection && Z.length > 0, Ee = M.layeredSection, he = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map();
  if (!se) for (const o of Z) {
    const s = ((_i = I.thicknesses) == null ? void 0 : _i.get(o)) || 0.1;
    (_j = I.elasticities) == null ? void 0 : _j.get(o);
    const a = V(o).key, i = ((_k = I.plateFormulations) == null ? void 0 : _k.get(o)) ?? 0, u = `t${s.toPrecision(6)}_f${i}`;
    he.has(u) || he.set(u, { t: s, matKey: a, formulacion: i });
    const G = [...he.keys()].indexOf(u) + 1;
    Me.set(o, `SSEC${G}`);
  }
  if (Z.length > 0) {
    f('TABLE:  "AREA SECTION ASSIGNMENTS"');
    for (const a of Z) {
      const i = se ? Ee.name : Me.get(a) || "SSEC1";
      f(`   Area=${a + 1}   Section=${i}   MatProp=Default`);
    }
    w();
    const o = I.shellModifiers, s = Z.filter((a) => {
      const i = o == null ? void 0 : o.get(a);
      return i && i.some((u) => Math.abs(u - 1) > 1e-12);
    });
    if (s.length > 0) {
      f('TABLE:  "AREA STIFFNESS MODIFIERS"');
      for (const a of s) {
        const i = o.get(a);
        f(`   Area=${a + 1}   f11=${D(i[0])}   f22=${D(i[1])}   f12=${D(i[2])}   m11=${D(i[3])}   m22=${D(i[4])}   m12=${D(i[5])}   v13=${D(i[6])}   v23=${D(i[7])}   MassMod=1   WeightMod=1`);
      }
      w();
    }
    if (f('TABLE:  "AREA SECTION PROPERTIES"'), se) {
      const a = Ee, i = ((_l = a.layers[0]) == null ? void 0 : _l.material) || "MAT_DEFAULT";
      f(`   Section=${a.name}   Material=${i}   MatAngle=0   AreaType=Shell   Type=Shell-Layered   Thickness=${D(a.totalThickness)}   BendThick=${D(a.totalThickness)}   Color=Magenta`);
    } else {
      let a = 0;
      for (const [, i] of he) {
        a++;
        const u = i.formulacion === 2 ? "Membrane" : i.formulacion === 3 ? "Plate-Thin" : i.formulacion === 4 ? "Plate-Thick" : i.formulacion === 1 ? "Shell-Thin" : "Shell-Thick", G = i.formulacion === 3 || i.formulacion === 4 ? "No" : "Yes";
        f(`   Section=SSEC${a}   Material=${i.matKey}   MatAngle=0   AreaType=Shell   Type=${u}   DrillDOF=${G}   Thickness=${D(i.t)}   BendThick=${D(i.t)}   Color=Cyan`);
      }
    }
    if (w(), se) {
      f('TABLE:  "AREA SECTION PROPERTY LAYERS"');
      const a = Ee;
      for (const i of a.layers) {
        const u = i.angle ?? 0, G = i.numIntPts ?? 3;
        f(`   Section=${a.name}   LayerName=${i.name}   Distance=${D(i.distance)}   Thickness=${D(i.thickness)}   Type=Shell   NumIntPts=${G}   Material=${i.material}   MatAngle=${D(u * 180 / Math.PI)}   MatBehave=Directional   S11Opt=Linear   S22Opt=Linear   S12Opt=Linear`);
      }
      w();
    }
  }
  f('TABLE:  "JOINT COORDINATES"');
  for (let o = 0; o < l.length; o++) {
    const s = l[o];
    f(`   Joint=${o + 1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR=${D(s[0])}   Y=${D(s[1])}   Z=${D(s[2])}   SpecialJt=No`);
  }
  if (w(), L.supports && L.supports.size > 0) {
    f('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"');
    for (const [o, s] of L.supports) {
      if (!s.some((i) => i)) continue;
      const a = (i) => i ? "Yes" : "No";
      f(`   Joint=${o + 1}   U1=${a(s[0])}   U2=${a(s[1])}   U3=${a(s[2])}   R1=${a(s[3])}   R2=${a(s[4])}   R3=${a(s[5])}`);
    }
    w();
  }
  {
    const o = /* @__PURE__ */ new Map();
    for (const s of L.springs ?? []) {
      if (!(s.k > 0)) continue;
      const a = o.get(s.node) ?? [0, 0, 0, 0, 0, 0];
      a[s.dof] += s.k, o.set(s.node, a);
    }
    if (o.size > 0) {
      f('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"');
      for (const [s, a] of [...o].sort((i, u) => i[0] - u[0])) f(`   Joint=${s + 1}   CoordSys=Global   U1=${D(a[0])}   U2=${D(a[1])}   U3=${D(a[2])}   R1=${D(a[3])}   R2=${D(a[4])}   R3=${D(a[5])}`);
      w();
    }
  }
  const r = L.diaphragms;
  if (r && r.size > 0) {
    const o = /* @__PURE__ */ new Map();
    for (const [a, i] of r) {
      const u = Math.round(i);
      if (u === 0) continue;
      const G = Math.abs(u);
      o.has(G) || o.set(G, []), o.get(G).push(a);
    }
    const s = [...o].filter(([, a]) => a.length >= 2);
    if (s.length > 0) {
      f('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"');
      for (const [a] of s) f(`   Name=DIAPH${a}   CoordSys=GLOBAL   Axis=Z`);
      w(), f('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"');
      for (const [a, i] of s) for (const u of i) f(`   Joint=${u + 1}   Constraint=DIAPH${a}`);
      w();
    }
  }
  const T = M.selfWtMult ?? 1;
  f('TABLE:  "LOAD PATTERN DEFINITIONS"'), f(`   LoadPat=DEAD   DesignType=Dead   SelfWtMult=${T}`), w(), f('TABLE:  "LOAD CASE DEFINITIONS"'), f('   Case=DEAD   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Dead   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'), w(), f('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"'), f('   Case=DEAD   LoadType="Load pattern"   LoadName=DEAD   LoadSF=1'), w();
  const R = I.frameLoads, Y = /* @__PURE__ */ new Map();
  if ((_m = L.loads) == null ? void 0 : _m.forEach((o, s) => Y.set(s, [...o])), R && R.size > 0) {
    const o = (s, a) => {
      const i = Y.get(s) ?? [0, 0, 0, 0, 0, 0];
      Y.set(s, i.map((u, G) => u - a[G]));
    };
    for (const [s, a] of R) {
      const i = N[s];
      if (!i || i.length !== 2) continue;
      const u = l[i[0]], G = l[i[1]], J = [G[0] - u[0], G[1] - u[1], G[2] - u[2]], A = Math.hypot(J[0], J[1], J[2]);
      if (A < 1e-9) continue;
      const O = [J[0] / A, J[1] / A, J[2] / A], $ = A * A / 12, B = [O[1] * a[2] - O[2] * a[1], O[2] * a[0] - O[0] * a[2], O[0] * a[1] - O[1] * a[0]];
      o(i[0], [a[0] * A / 2, a[1] * A / 2, a[2] * A / 2, $ * B[0], $ * B[1], $ * B[2]]), o(i[1], [a[0] * A / 2, a[1] * A / 2, a[2] * A / 2, -$ * B[0], -$ * B[1], -$ * B[2]]);
    }
  }
  if (Y.size > 0) {
    f('TABLE:  "JOINT LOADS - FORCE"');
    for (const [o, s] of Y) s.some((a) => Math.abs(a) > 1e-12) && f(`   Joint=${o + 1}   LoadPat=DEAD   CoordSys=GLOBAL   F1=${D(s[0])}   F2=${D(s[1])}   F3=${D(s[2])}   M1=${D(s[3])}   M2=${D(s[4])}   M3=${D(s[5])}`);
    w();
  }
  const C = I.frameLoads;
  if (C && C.size > 0) {
    f('TABLE:  "FRAME LOADS - DISTRIBUTED"');
    for (const [o, s] of C) {
      const a = N[o];
      if (!a || a.length !== 2) continue;
      const i = l[a[0]], u = l[a[1]], G = Math.hypot(u[0] - i[0], u[1] - i[1], u[2] - i[2]);
      ["X", "Y", "Z"].forEach((J, A) => {
        Math.abs(s[A]) < 1e-12 || f(`   Frame=${o + 1}   LoadPat=DEAD   CoordSys=GLOBAL   Type=Force   Dir=${J}   DistType=RelDist   RelDistA=0   RelDistB=1   AbsDistA=0   AbsDistB=${D(G)}   FOverLA=${D(s[A])}   FOverLB=${D(s[A])}`);
      });
    }
    w();
  }
  const d = /* @__PURE__ */ new Map();
  for (let o = 0; o < N.length; o++) {
    const { E: s, nu: a, G: i, rho: u, key: G } = V(o);
    d.has(G) || d.set(G, { E: s, nu: a, G: i, rho: u });
  }
  if (ee.length > 0) {
    const o = I.solidIncompatible === false ? "No" : "Yes", s = /* @__PURE__ */ new Map();
    for (const a of ee) {
      const { E: i, nu: u, G, rho: J, key: A } = V(a);
      d.has(A) || d.set(A, { E: i, nu: u, G, rho: J }), s.has(A) || s.set(A, `SOL${s.size + 1}`);
    }
    f('TABLE:  "SOLID PROPERTY DEFINITIONS"');
    for (const [a, i] of s) f(`   SolidProp=${i}   Material=${a}   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=${o}   Color=Yellow`);
    w(), f('TABLE:  "SOLID PROPERTY ASSIGNMENTS"');
    for (const a of ee) f(`   Solid=${a + 1}   SolidProp=${s.get(V(a).key)}`);
    w();
  }
  for (const [o, s] of ie) d.has(o) || d.set(o, s);
  f('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"');
  for (const [o] of d) f(`   Material=${o}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green`);
  w(), f('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"');
  for (const [o, s] of d) f(`   Material=${o}   UnitWeight=${D(s.rho * 9.81)}   UnitMass=${D(s.rho)}   E1=${D(s.E)}   G12=${D(s.G)}   U12=${D(s.nu)}   A1=9.9E-06`);
  w(), f('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"');
  for (const [o] of d) f(`   Material=${o}   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0`);
  return w(), f('TABLE:  "PROGRAM CONTROL"'), f(`   ProgramName=SAP2000   Version=24.1.0   CurrUnits="${x.force}, ${x.length}, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes`), w(), f("END TABLE DATA"), f(""), Q.join(`\r
`);
}
function D(M) {
  return M === 0 || Math.abs(M) < 1e-15 ? "0" : Math.abs(M) >= 1e6 || Math.abs(M) < 1e-3 && Math.abs(M) > 0 ? M.toExponential(8) : parseFloat(M.toPrecision(10)).toString();
}
function Vt(M, l, N = 0.05) {
  const L = l.map(([I, x]) => `${(+I).toFixed(4)} ${(+x).toFixed(5)}`).join("  ");
  return [`  FUNCTION "${M}"  FUNCTYPE "SPECTRUM"  DAMPRATIO ${N}  SPECTYPE "USER"  `, `  FUNCTION "${M}"  TIMEVAL "${L}"  `];
}
function qt(M) {
  const { name: l, func: N, modalCase: L = "Modal", sfX: I = 9.81, sfY: x = 9.81 } = M, H = [`  LOADCASE "${l}"  TYPE  "Response Spectrum"  MODALCASE  "${L}"  `];
  return I && H.push(`  LOADCASE "${l}"  ACCEL  "U1"  FUNC  "${N}"  SF  ${I}  `), x && H.push(`  LOADCASE "${l}"  ACCEL  "U2"  FUNC  "${N}"  SF  ${x}  `), H;
}
function Ct(M) {
  const { name: l = "Modal", ritz: N = false, nModes: L = 12 } = M;
  return N ? [`  LOADCASE "${l}"  TYPE  "Modal - Ritz"  INITCOND  "PRESET"  `, `  LOADCASE "${l}"  MAXMODES  ${L} MINMODES  1 `, `  LOADCASE "${l}"  LOADTYPE  "Accel"  LOADNAME  "UX"  RITZMAXCYCLES  0 `, `  LOADCASE "${l}"  LOADTYPE  "Accel"  LOADNAME  "UY"  RITZMAXCYCLES  0 `, `  LOADCASE "${l}"  LOADTYPE  "Accel"  LOADNAME  "UZ"  RITZMAXCYCLES  0 `] : [`  LOADCASE "${l}"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `, `  LOADCASE "${l}"  MAXMODES  ${L} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `];
}
function as(M) {
  var _a;
  const l = (_a = M.e2kModel) == null ? void 0 : _a.rawSections;
  let N = l && l.size > 0 ? es(l, M.e2kModel) : ts(M);
  return M.seismicNEC && (N = Qt(N, M.seismicNEC)), N;
}
function Qt(M, l) {
  const N = M.includes(`\r
`) ? `\r
` : `
`, L = M.split(/\r?\n/), I = l.name ?? "NEC", x = Vt(I, l.points, l.dampRatio ?? 0.05), H = l.modalCase ?? "Modal", Q = qt({ name: l.caseName ?? "Sismo NEC", func: I, modalCase: H, sfX: l.sfX, sfY: l.sfY });
  let f = [];
  const w = (K) => L.some((V) => K.test(V));
  if (l.modal) {
    const K = new RegExp(`^\\s*LOADCASE\\s+"${H}"\\s+(TYPE\\s+"Modal|MAXMODES|MINMODES|EIGEN|LOADTYPE|RITZ)`, "i");
    for (let V = L.length - 1; V >= 0; V--) K.test(L[V]) && L.splice(V, 1);
    f = Ct({ name: H, ritz: !!l.modal.ritz, nModes: l.modal.nModes });
  } else w(new RegExp(`LOADCASE\\s+"${H}"\\s+TYPE\\s+"Modal`)) || (f = Ct({ name: H }));
  return Pt(L, "FUNCTIONS", x), Pt(L, "LOAD CASES", [...f, ...Q]), L.join(N);
}
function Pt(M, l, N) {
  const L = M.findIndex((H) => H.trim() === `$ ${l}`);
  if (L >= 0) {
    M.splice(L + 1, 0, ...N);
    return;
  }
  const I = M.findIndex((H) => H.trim() === "END"), x = I >= 0 ? I : M.length;
  M.splice(x, 0, `$ ${l}`, ...N, "");
}
function es(M, l) {
  const N = [], L = ["PROGRAM INFORMATION", "CONTROLS", "STORIES - IN SEQUENCE FROM TOP", "GRIDS", "DIAPHRAGM NAMES", "MATERIAL PROPERTIES", "REBAR DEFINITIONS", "FRAME SECTIONS", "AUTO SELECT SECTION LISTS", "CONCRETE SECTIONS", "WALL/SLAB/DECK SECTIONS", "POINT COORDINATES", "LINE CONNECTIVITIES", "AREA CONNECTIVITIES", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "LOAD PATTERNS", "POINT OBJECT LOADS", "FRAME OBJECT LOADS", "SHELL OBJECT LOADS", "ANALYSIS OPTIONS", "MASS SOURCE", "FUNCTIONS", "LOAD CASES", "LOAD COMBINATIONS"];
  N.push("$ File exported from Hekatan Struct Lineal (round-trip)"), N.push("");
  for (const I of L) {
    const x = M.get(I);
    if (!(!x || x.length === 0)) {
      N.push(`$ ${I}`);
      for (const H of x) N.push(H);
      N.push("");
    }
  }
  for (const [I, x] of M) if (!L.includes(I) && x.length !== 0) {
    N.push(`$ ${I}`);
    for (const H of x) N.push(H);
    N.push("");
  }
  return N.push("  END"), N.push("$ END OF MODEL FILE"), N.join(`\r
`);
}
function ts(M) {
  var _a, _b, _c, _d, _e2, _f, _g;
  const { nodes: l, elements: N, nodeInputs: L, elementInputs: I, title: x, units: H } = M, Q = M.shellLoads ?? I.shellSurfaceLoads;
  let f;
  Q instanceof Map && (f = /* @__PURE__ */ new Map(), Q.forEach((e, t) => {
    f.set(t, typeof e == "number" ? { value: e } : e);
  }));
  const w = M.shellAngles ?? I.shellAngles, K = I.cargaDeArea, V = !!(f && f.size > 0), Z = I.selfWeight, ee = I.frameLoads, te = (M.weightMode ?? "auto") === "auto" && Z !== void 0, ie = /* @__PURE__ */ new Map(), ce = (e, t) => {
    const n = ie.get(e) ?? [0, 0, 0, 0, 0, 0];
    ie.set(e, n.map((c, E) => c + t[E]));
  }, oe = /* @__PURE__ */ new Set();
  if (te) {
    if (ee) for (const [e, t] of ee) {
      const n = N[e];
      if (!n || n.length !== 2) continue;
      const c = l[n[0]], E = l[n[1]], S = [E[0] - c[0], E[1] - c[1], E[2] - c[2]], h = Math.hypot(S[0], S[1], S[2]);
      if (h < 1e-9) continue;
      const p = [S[0] / h, S[1] / h, S[2] / h], m = h * h / 12, k = [p[1] * t[2] - p[2] * t[1], p[2] * t[0] - p[0] * t[2], p[0] * t[1] - p[1] * t[0]];
      ce(n[0], [t[0] * h / 2, t[1] * h / 2, t[2] * h / 2, m * k[0], m * k[1], m * k[2]]), ce(n[1], [t[0] * h / 2, t[1] * h / 2, t[2] * h / 2, -m * k[0], -m * k[1], -m * k[2]]), oe.add(e);
    }
    if (Z && Z > 0) {
      const t = I.endOffsets;
      N.forEach((n, c) => {
        var _a2, _b2, _c2;
        const E = ((_a2 = I.densities) == null ? void 0 : _a2.get(c)) ?? 0;
        if (E) {
          if (n.length === 2) {
            const S = ((_b2 = I.areas) == null ? void 0 : _b2.get(c)) ?? 0, h = l[n[0]], p = l[n[1]], m = [p[0] - h[0], p[1] - h[1], p[2] - h[2]];
            let k = Math.hypot(m[0], m[1], m[2]);
            const g = t == null ? void 0 : t.get(c);
            if (g) {
              const P = Math.hypot(m[0], m[1]);
              P > 1e-9 && Math.abs(Math.atan2(Math.abs(m[2]), P)) * 180 / Math.PI < 20 && (k = Math.max(k - g[0] - g[1], 0));
            }
            const y = S * k * E * 9.80665 * Z;
            ce(n[0], [0, 0, -y / 2, 0, 0, 0]), ce(n[1], [0, 0, -y / 2, 0, 0, 0]);
          } else if (n.length === 4) {
            const S = ((_c2 = I.thicknesses) == null ? void 0 : _c2.get(c)) ?? 0, h = n.map((P) => l[P]);
            let p = 0, m = 0, k = 0;
            for (let P = 0; P < 4; P++) {
              const W = h[P], z = h[(P + 1) % 4];
              p += W[1] * z[2] - W[2] * z[1], m += W[2] * z[0] - W[0] * z[2], k += W[0] * z[1] - W[1] * z[0];
            }
            const g = Math.hypot(p, m, k) / 2, y = S * g * E * 9.80665 * Z;
            for (const P of n) ce(P, [0, 0, -y / 4, 0, 0, 0]);
          }
        }
      });
    }
  }
  const se = (e, t) => {
    const n = ie.get(e);
    return [t[0] - ((n == null ? void 0 : n[0]) ?? 0), t[1] - ((n == null ? void 0 : n[1]) ?? 0), t[2] - (V ? (K == null ? void 0 : K.get(e)) ?? 0 : 0) - ((n == null ? void 0 : n[2]) ?? 0)];
  }, Ee = (e, t) => {
    const n = ie.get(e);
    return [(t[3] ?? 0) - ((n == null ? void 0 : n[3]) ?? 0), (t[4] ?? 0) - ((n == null ? void 0 : n[4]) ?? 0), (t[5] ?? 0) - ((n == null ? void 0 : n[5]) ?? 0)];
  }, he = "N", Me = "MM", r = [], T = (e) => Math.round(e * 1e4) / 1e4, R = (e) => !isFinite(e) || e === 0 ? "0" : Number(e.toPrecision(10)).toString(), Y = 1e3, C = 1e3, d = (e) => e * C, o = (e) => e * Y, s = (e) => e * Y, a = (e) => e * Y * C, i = (e) => e * Y / C ** 2, u = (e) => e * Y / C ** 3, G = /* @__PURE__ */ new Date(), J = `${G.getMonth() + 1}/${G.getDate()}/${G.getFullYear()}  ${G.getHours()}:${String(G.getMinutes()).padStart(2, "0")}:${String(G.getSeconds()).padStart(2, "0")}`;
  r.push(`$ File   "Hekatan_export.e2k"  saved ${J} in ETABS 22.6.0`), r.push(""), r.push("$ PROGRAM INFORMATION"), r.push('  PROGRAM  "ETABS"  VERSION "22.6.0"  '), r.push(""), r.push("$ CONTROLS"), r.push(`  UNITS  "${he}"  "${Me}"  "C"  `), r.push('  TITLE1  "Hekatan Struct Lineal export"  '), x && r.push(`  TITLE2  "${x}"  `), r.push("  PREFERENCE  MERGETOL 0.001"), r.push('  RLLF  METHOD "ASCE7-10"  USEDEFAULTMIN "YES"  '), r.push("");
  const A = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Set();
  l.forEach((e) => {
    A.add(T(e[0])), O.add(T(e[1]));
  });
  const $ = [...A].sort((e, t) => e - t), B = [...O].sort((e, t) => e - t);
  r.push("$ GRIDS"), r.push('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 '), $.forEach((e, t) => {
    const n = t < 26 ? String.fromCharCode(65 + t) : String.fromCharCode(65 + t % 26).repeat(Math.floor(t / 26) + 1);
    r.push(`  GRID "G1"  LABEL "${n}"  DIR "X"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), B.forEach((e, t) => {
    r.push(`  GRID "G1"  LABEL "${t + 1}"  DIR "Y"  COORD ${e}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  `);
  }), r.push("");
  const F = 3, j = 0.5, _ = /* @__PURE__ */ new Map();
  l.forEach((e) => {
    const t = T(e[2]);
    _.set(t, (_.get(t) ?? 0) + 1);
  });
  const q = /* @__PURE__ */ new Set();
  l.forEach((e) => q.add(T(e[2])));
  const v = [...q].sort((e, t) => e - t);
  let U = v.filter((e) => (_.get(e) ?? 0) >= F);
  if (U.length > 1) {
    const e = [U[0]];
    for (const t of U.slice(1)) t - e[e.length - 1] < j ? e[e.length - 1] = t : e.push(t);
    U = e;
  }
  v.length || v.push(0, 3), U.length || (U = [v[0], v[v.length - 1]]), U[0] !== v[0] && U.unshift(v[0]), U[U.length - 1] !== v[v.length - 1] && U.push(v[v.length - 1]);
  const ne = [], X = /* @__PURE__ */ new Map();
  ne.push("Base"), X.set(U[0], "Base");
  for (let e = 1; e < U.length; e++) {
    const t = `Level_${e}`;
    ne.push(t), X.set(U[e], t);
  }
  const Ie = (e) => {
    const t = T(e);
    if (X.has(t)) return { story: X.get(t), dz: 0 };
    for (let c = 0; c < U.length; c++) if (U[c] >= t) return { story: X.get(U[c]), dz: T(U[c] - t) };
    const n = U[U.length - 1];
    return { story: X.get(n), dz: T(n - t) };
  };
  r.push("$ STORIES - IN SEQUENCE FROM TOP");
  for (let e = U.length - 1; e >= 1; e--) r.push(`  STORY "${ne[e]}"  HEIGHT ${T(d(U[e] - U[e - 1]))} MASTERSTORY "Yes"  `);
  U.length > 0 && r.push(`  STORY "Base"  ELEV ${T(d(U[0]))} `), r.push(""), N.some((e) => e.length === 4), r.push("$ DIAPHRAGM NAMES"), r.push('  DIAPHRAGM "D1"    TYPE RIGID'), r.push(""), r.push("$ MATERIAL PROPERTIES");
  const re = 980665e-8, Se = (e) => {
    var _a2, _b2;
    const t = (_a2 = I.densities) == null ? void 0 : _a2.get(e);
    if (t === void 0) return;
    const n = t > 100 ? t * re : t * 9.80665, c = (_b2 = I.deckSections) == null ? void 0 : _b2.get(e);
    if (c && c.tc > 0) {
      const E = c.tc + (c.sr > 0 ? c.hr * (c.wrt + c.wrb) / 2 / c.sr : 0);
      return (n * c.tc - c.w) / E;
    }
    return n;
  }, $e = (e) => {
    var _a2;
    const t = ((_a2 = I.elasticities) == null ? void 0 : _a2.get(e)) ?? 0, n = Se(e);
    return `${t}|${n === void 0 ? "-" : n.toFixed(4)}`;
  }, we = /* @__PURE__ */ new Set();
  (_a = I.elasticities) == null ? void 0 : _a.forEach((e, t) => we.add($e(t)));
  const Le = /* @__PURE__ */ new Map(), Ge = /* @__PURE__ */ new Map();
  let wt = 0, Gt = 0;
  for (const e of we) {
    const t = parseFloat(e.split("|")[0]), n = e.split("|")[1], c = t >= 1e8, E = c ? `Steel_${++wt}` : `Conc_${++Gt}`;
    Le.set(e, E), Ge.set(e, c);
    const S = n !== "-" ? parseFloat(n) : c ? 76.97 : 24, h = i(t), p = u(S), m = (() => {
      const y = M.elementInputs.poissonsRatios;
      if (y) {
        for (const [P, W] of y) if ($e(P) === e) return W;
      }
    })(), k = m !== void 0 ? m : c ? 0.3 : 0.2, g = c ? 117e-7 : 1e-5;
    if (c) {
      r.push(`  MATERIAL  "${E}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${R(p)}`), r.push(`  MATERIAL  "${E}"    SYMTYPE "Isotropic"  E ${T(h)}  U ${k}  A ${g}`);
      const y = 345e3, P = 45e4;
      r.push(`  MATERIAL  "${E}"  FY ${T(i(y))}  FU ${T(i(P))}  FYE ${T(i(y * 1.1))}  FUE ${T(i(P * 1.1))}`);
    } else r.push(`  MATERIAL  "${E}"    TYPE "Concrete"    WEIGHTPERVOLUME ${R(p)}`), r.push(`  MATERIAL  "${E}"    SYMTYPE "Isotropic"  E ${T(h)}  U ${k}  A ${g}`), r.push(`  MATERIAL  "${E}"    FC ${T(i(24e3))}`);
  }
  const ct = /* @__PURE__ */ new Map();
  {
    const e = /* @__PURE__ */ new Map();
    (_b = I.sectionShapes) == null ? void 0 : _b.forEach((n, c) => {
      var _a2;
      if ((n == null ? void 0 : n.type) !== "CFT" || !(n.fillE > 0)) return;
      const E = ((_a2 = I.elasticities) == null ? void 0 : _a2.get(c)) ?? 0;
      if (!(E > 0)) return;
      const S = n.fillE / E, h = Se(c) ?? 76.97, p = `${n.fillE}|${(S * h).toFixed(4)}`;
      let m = e.get(p);
      m || (m = `ConcFill_${e.size + 1}`, e.set(p, m), r.push(`  MATERIAL  "${m}"    TYPE "Concrete"    WEIGHTPERVOLUME ${R(u(S * h))}`), r.push(`  MATERIAL  "${m}"    SYMTYPE "Isotropic"  E ${T(i(n.fillE))}  U 0.2  A 1.0e-5`), r.push(`  MATERIAL  "${m}"    FC ${T(i(24e3))}`)), ct.set(c, m);
    });
  }
  r.push(""), r.push("$ FRAME SECTIONS");
  const Be = /* @__PURE__ */ new Set(), Je = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), me = 0.05;
  N.forEach((e, t) => {
    var _a2, _b2, _c2, _d2, _e3, _f2, _g2, _h, _i, _j;
    if (e.length !== 2) return;
    const n = (_a2 = I.sectionShapes) == null ? void 0 : _a2.get(t), c = ((_b2 = I.elasticities) == null ? void 0 : _b2.get(t)) ?? 0, E = Le.get($e(t)) || "Conc_1", S = Ge.get($e(t)) ?? c >= 1e8, h = ((_c2 = I.areas) == null ? void 0 : _c2.get(t)) ?? 0, p = ((_d2 = I.momentsOfInertiaZ) == null ? void 0 : _d2.get(t)) ?? 0, m = ((_e3 = I.momentsOfInertiaY) == null ? void 0 : _e3.get(t)) ?? 0, k = ((_f2 = I.torsionalConstants) == null ? void 0 : _f2.get(t)) ?? 0;
    let g = (n == null ? void 0 : n.type) || "rect", y = (n == null ? void 0 : n.h) ?? 0, P = (n == null ? void 0 : n.b) ?? 0, W = (n == null ? void 0 : n.d) ?? 0;
    const z = (n == null ? void 0 : n.tf) ?? 0, ae = (n == null ? void 0 : n.tw) ?? 0;
    if (!n && y <= 0 && P <= 0 && W <= 0 && h > 0 && p > 0 && m > 0) {
      const Te = (_g2 = I.cantos) == null ? void 0 : _g2.get(t), be = (_h = I.anchos) == null ? void 0 : _h.get(t);
      y = Te && Te > 0 ? Te : Math.sqrt(12 * p / h), P = be && be > 0 ? be : h / y, (!isFinite(y) || y < me) && (y = me), (!isFinite(P) || P < me) && (P = me), g = "general";
    } else y <= 0 && P <= 0 && W <= 0 && h > 0 && (p > 0 ? (y = Math.sqrt(12 * p / h), P = h / y) : y = P = Math.sqrt(h), (!isFinite(y) || y < me) && (y = me), (!isFinite(P) || P < me) && (P = me), g = "rect");
    y <= 0 && P <= 0 && W <= 0 && (y = 0.3, P = 0.3, g = "rect");
    const ze = (n == null ? void 0 : n.name) ? `NAME_${n.name}` : `${g}_${T(y)}_${T(P)}_${T(W)}_${T(z)}_${T(ae)}_${E}`;
    (n == null ? void 0 : n.name) && !Ye.has(ze) && Ye.set(ze, n.name);
    let fe = Ye.get(ze);
    if (!fe) {
      const Te = S ? "S" : "C";
      g === "general" ? fe = `${Te}_G${Be.size + 1}` : g === "rect" ? fe = `${Te}_R${Math.round(P * 100)}x${Math.round(y * 100)}` : g === "circ" ? fe = `${Te}_C_D${Math.round(W * 100)}` : g === "I" ? fe = `${Te}_I${Math.round(y * 100)}x${Math.round(P * 100)}` : g === "HSS" ? fe = `${Te}_HSS${Math.round(P * 100)}x${Math.round(y * 100)}x${Math.round(ae * 1e3)}` : fe = `${Te}_Sec${Be.size + 1}`, Ye.set(ze, fe);
    }
    if (Je.set(t, fe), Be.has(fe)) return;
    Be.add(fe);
    const je = ct.get(t);
    if (g === "CFT" && je && W > 0 && ae > 0 && !(y > 0 && P > 0)) {
      r.push(`  FRAMESECTION  "${fe}"  MATERIAL "${E}"  SHAPE "Filled Steel Pipe"  D ${T(d(W))} T ${T(d(ae))} FILLMATERIAL "${je}"`);
      return;
    }
    if (g === "CFT" && je && y > 0 && P > 0 && ae > 0) {
      r.push(`  FRAMESECTION  "${fe}"  MATERIAL "${E}"  SHAPE "Filled Steel Tube"  D ${T(d(y))} B ${T(d(P))} TF ${T(d(ae))} TW ${T(d(ae))} FILLMATERIAL "${je}"`);
      return;
    }
    const Zt = h > 0 && p > 0 && m > 0;
    let pe;
    g === "general" || Zt ? pe = "General" : g === "I" ? pe = "Steel I/Wide Flange" : g === "HSS" ? pe = "Steel Tube" : g === "CFT" ? pe = "Filled Steel Tube" : g === "pipe" ? pe = "Steel Pipe" : g === "L" ? pe = "Steel Angle" : g === "C" ? pe = "Steel Channel" : g === "2C" ? pe = "Steel Double Channel" : g === "circ" ? pe = "Concrete Circle" : pe = "Concrete Rectangular";
    let ge = `  FRAMESECTION  "${fe}"  MATERIAL "${E}"  SHAPE "${pe}"`;
    if (pe === "General") {
      const Te = ((_i = I.shearAreasZ) == null ? void 0 : _i.get(t)) || h * 5 / 6, be = ((_j = I.shearAreasY) == null ? void 0 : _j.get(t)) || h * 5 / 6;
      ge += `  D ${T(d(y))} B ${T(d(P))} AREA ${R(h * 1e6)} AS2 ${R(Te * 1e6)} AS3 ${R(be * 1e6)} I33 ${R(p * 1e12)} I22 ${R(m * 1e12)} TORSION ${R((k || p + m) * 1e12)} S33POS ${R(2 * p / y * 1e9)} S33NEG ${R(2 * p / y * 1e9)} S22POS ${R(2 * m / P * 1e9)} S22NEG ${R(2 * m / P * 1e9)} Z33 ${R(2 * p / y * 1e9)} Z22 ${R(2 * m / P * 1e9)} R33 ${R(Math.sqrt(p / h) * 1e3)} R22 ${R(Math.sqrt(m / h) * 1e3)} `, r.push(ge);
      return;
    }
    y && (ge += `  D ${T(d(y))}`), P && (ge += `  B ${T(d(P))}`), W && !y && (ge += `  D ${T(d(W))}`), z && (ge += `  TF ${T(d(z))}`), ae && (ge += `  TW ${T(d(ae))}`), r.push(ge);
  }), r.push("");
  const ke = /* @__PURE__ */ new Map();
  let Bt = 0;
  l.forEach((e) => {
    const { dz: t } = Ie(e[2]), n = `${T(e[0])},${T(e[1])},${t}`;
    ke.has(n) || ke.set(n, `${++Bt}`);
  });
  const Ue = /* @__PURE__ */ new Map(), _e = [];
  {
    const e = /* @__PURE__ */ new Map();
    for (const n of L.springs ?? []) {
      if (!(n.k > 0)) continue;
      const c = e.get(n.node) ?? [0, 0, 0, 0, 0, 0];
      c[n.dof] += n.k, e.set(n.node, c);
    }
    const t = /* @__PURE__ */ new Map();
    for (const [n, c] of e) {
      const E = c.map((p, m) => m < 3 ? p * Y / C : p * Y * C), S = E.map((p) => +p.toPrecision(12)).join("|");
      let h = t.get(S);
      if (!h) {
        h = `SPR${t.size + 1}`, t.set(S, h);
        const p = ["UX", "UY", "UZ", "RX", "RY", "RZ"], m = E.map((k, g) => `${p[g]}  ${+k.toPrecision(12)}`);
        _e.push(`  POINTSPRING  "${h}"  NONLINEARSPECOPTION  "LINKS"  ${m.join(" ")} `);
      }
      Ue.set(n, h);
    }
    _e.length && (r.push("$ POINT SPRING PROPERTIES"), _e.forEach((n) => r.push(n)), r.push(""));
  }
  r.push("$ POINT COORDINATES");
  for (const [e, t] of ke) {
    const [n, c, E] = e.split(",").map(Number);
    r.push(E ? `  POINT "${t}"  ${T(d(n))} ${T(d(c))} ${T(d(E))} ` : `  POINT "${t}"  ${T(d(n))} ${T(d(c))} `);
  }
  r.push("");
  const Ae = (e) => {
    const t = l[e], { story: n, dz: c } = Ie(t[2]), E = `${T(t[0])},${T(t[1])},${c}`;
    return { pt: ke.get(E) || "1", story: n };
  }, rt = (e) => {
    var _a2, _b2, _c2, _d2, _e3, _f2;
    const t = [], n = (_a2 = M.propertyModifiers) == null ? void 0 : _a2.get(e);
    n && n.some((g) => Math.abs(g - 1) > 1e-9) && t.push(`PROPMODIFIERS "${n.map((g) => T(g)).join(" ")}"`);
    const c = (_b2 = I.localAngles) == null ? void 0 : _b2.get(e);
    c !== void 0 && isFinite(c) && Math.abs(c) > 1e-9 && t.push(`ANG ${T(c)}`);
    const E = (_c2 = I.momentReleases) == null ? void 0 : _c2.get(e);
    if (E && E.some((g) => g)) {
      const g = [];
      E.length === 12 ? (E[0] && g.push("PI"), E[1] && g.push("V2I"), E[2] && g.push("V3I"), E[3] && g.push("TI"), E[4] && g.push("M2I"), E[5] && g.push("M3I"), E[6] && g.push("PJ"), E[7] && g.push("V2J"), E[8] && g.push("V3J"), E[9] && g.push("TJ"), E[10] && g.push("M2J"), E[11] && g.push("M3J")) : E.length === 6 && (E[0] && g.push("TI"), E[1] && g.push("M2I"), E[2] && g.push("M3I"), E[3] && g.push("TJ"), E[4] && g.push("M2J"), E[5] && g.push("M3J")), g.length > 0 && t.push(`RELEASE "${g.join(" ")}"`);
    }
    const S = (_d2 = I.insertionPoints) == null ? void 0 : _d2.get(e);
    S && (Math.abs(S[0]) > 1e-9 || Math.abs(S[1]) > 1e-9) && t.push(`LATEROFFSET ${T(d(S[0]))} TRANSOFFSET ${T(d(S[1]))}`);
    const h = (_e3 = I.rigidOffsets) == null ? void 0 : _e3.get(e), p = (_f2 = I.endOffsets) == null ? void 0 : _f2.get(e), m = p ? [p[0], p[1]] : h, k = p && p.length > 2 ? p[2] : 0;
    return m && (Math.abs(m[0]) > 1e-9 || Math.abs(m[1]) > 1e-9) && t.push(`LENGTHOFFI ${T(d(m[0]))} LENGTHOFFJ ${T(d(m[1]))} RIGIDZONE ${T(k)}`), t.length > 0 ? ` ${t.join(" ")} ` : "";
  }, Ze = [], Et = /* @__PURE__ */ new Set(), xe = /* @__PURE__ */ new Map();
  N.forEach((e, t) => {
    if (e.length !== 2) return;
    const n = Ft(l, e);
    if (n === "BEAM") return;
    const c = l[e[0]][2] <= l[e[1]][2] ? e[0] : e[1], E = l[e[0]][2] <= l[e[1]][2] ? e[1] : e[0];
    if (Math.abs(l[c][0] - l[E][0]) > 1e-6 || Math.abs(l[c][1] - l[E][1]) > 1e-6) return;
    const S = Ae(c), h = Je.get(t) || `Sec_${t}`, p = `${S.pt}_${h}_${n}`;
    xe.has(p) || xe.set(p, []), xe.get(p).push({ i: t, bot: c, top: E, zBot: T(l[c][2]), zTop: T(l[E][2]), planPt: S.pt, secName: h, type: n });
  }), xe.forEach((e, t) => {
    e.sort((c, E) => c.zBot - E.zBot);
    let n = 0;
    for (let c = 1; c <= e.length; c++) if (c === e.length || Math.abs(e[c].zBot - e[c - 1].zTop) > 1e-6) {
      const S = e.slice(n, c);
      S.length >= 1 && (Ze.push({ elemIndices: S.map((h) => h.i), planPt: S[0].planPt, bottomNodeIdx: S[0].bot, topNodeIdx: S[S.length - 1].top, secName: S[0].secName, type: S[0].type, nSegments: S.length }), S.forEach((h) => Et.add(h.i))), n = c;
    }
  }), r.push("$ LINE CONNECTIVITIES");
  const Xe = [], He = (e) => ne.indexOf(e), lt = /* @__PURE__ */ new Map(), ft = (e, t, n, c, E, S, h, p) => {
    const m = Ae(c), k = Ae(n);
    p !== void 0 && lt.set(p, { name: e, story: m.story });
    const g = He(m.story) - He(k.story);
    g <= 0 ? r.push(`  LINE  "${e}"  BEAM  "${k.pt}"  "${m.pt}"  0`) : r.push(`  LINE  "${e}"  ${t}  "${k.pt}"  "${m.pt}"  ${g}`), Xe.push(`  LINEASSIGN  "${e}"  "${m.story}"  SECTION "${E}" ${S} MINNUMSTA ${h} AUTOMESH "YES"  MESHATINTERSECTIONS "${I.meshAtIntersections === false ? "NO" : "YES"}"  `);
  }, St = /* @__PURE__ */ new Map();
  Ze.forEach((e, t) => {
    const n = rt(e.elemIndices[0]), c = [];
    let E = [];
    e.elemIndices.forEach((S, h) => {
      E.push(S);
      const [p, m] = N[S], k = l[p][2] >= l[m][2] ? p : m;
      (Ie(l[k][2]).dz === 0 || h === e.elemIndices.length - 1) && (c.push(E), E = []);
    }), c.forEach((S) => {
      const [h, p] = N[S[0]], m = l[h][2] <= l[p][2] ? h : p, [k, g] = N[S[S.length - 1]], y = l[k][2] >= l[g][2] ? k : g;
      He(Ae(y).story) - He(Ae(m).story);
      let P = `C${t + 1}`;
      for (let W = 1; ; W++) {
        const z = r.length;
        ft(P, e.type, m, y, e.secName, n, S.length);
        const ae = r[z], it = St.get(P);
        if (it === void 0) {
          St.set(P, ae);
          break;
        }
        if (r.splice(z, r.length - z), it === ae) break;
        Xe.pop(), P = `C${t + 1}_${W}`;
      }
    });
  }), N.forEach((e, t) => {
    if (e.length !== 2 || Et.has(t)) return;
    const n = Ft(l, e), c = Je.get(t) || `Sec_${t}`, E = rt(t), S = l[e[0]][2] <= l[e[1]][2] ? e[0] : e[1], h = l[e[0]][2] <= l[e[1]][2] ? e[1] : e[0];
    ft(`E${t + 1}`, n === "BEAM" ? "BRACE" : n, S, h, c, E, 3, t);
  }), r.push("");
  const De = M.weightMode ?? "auto", de = /* @__PURE__ */ new Set();
  r.push("$ POINT ASSIGNS"), (_c = L.supports) == null ? void 0 : _c.forEach((e, t) => {
    const n = [];
    if (e[0] && n.push("UX"), e[1] && n.push("UY"), e[2] && n.push("UZ"), e[3] && n.push("RX"), e[4] && n.push("RY"), e[5] && n.push("RZ"), n.length > 0) {
      const c = Ae(t), E = c.story === "Base" ? ' DIAPH "DISCONNECTED" ' : "", S = Ue.has(t) ? ` SPRINGPROP "${Ue.get(t)}" ` : "";
      r.push(`  POINTASSIGN  "${c.pt}"  "${c.story}"  RESTRAINT "${n.join(" ")}" ${E}${S} `), de.add(`${c.pt}@${c.story}`);
    }
  });
  for (const [e, t] of Ue) {
    const n = Ae(e);
    de.has(`${n.pt}@${n.story}`) || (r.push(`  POINTASSIGN  "${n.pt}"  "${n.story}"  SPRINGPROP "${t}" `), de.add(`${n.pt}@${n.story}`));
  }
  const Yt = !!(L.diaphragms && [...L.diaphragms.values()].some((e) => e !== 0)), ht = M.diaphragm ?? "auto", Ke = ht === "d1" || ht === "auto" && Yt, Ce = /* @__PURE__ */ new Set();
  L.diaphragms && L.diaphragms.forEach((e, t) => {
    e !== 0 && Ce.add(t);
  }), Ke && Ce.size ? Ce.forEach((e) => {
    const t = Ae(e), n = `${t.pt}@${t.story}`;
    !de.has(n) && t.story !== "Base" && (r.push(`  POINTASSIGN  "${t.pt}"  "${t.story}"  DIAPH "D1"  `), de.add(n));
  }) : Ke && Ze.forEach((e) => {
    for (const t of e.elemIndices) {
      const [n, c] = N[t], E = l[n][2] >= l[c][2] ? n : c, S = Ae(E), h = `${S.pt}@${S.story}`;
      !de.has(h) && S.story !== "Base" && (r.push(`  POINTASSIGN  "${S.pt}"  "${S.story}"  DIAPH "D1"  `), de.add(h));
    }
  }), De === "manual" && L.loads && L.loads.forEach((e, t) => {
    const [n, c, E] = se(t, e);
    if (Math.abs(n) < 1e-10 && Math.abs(c) < 1e-10 && Math.abs(E) < 1e-10) return;
    const S = Ae(t), h = `${S.pt}@${S.story}`;
    de.has(h) || (r.push(`  POINTASSIGN  "${S.pt}"  "${S.story}"  DIAPH "DISCONNECTED"  `), de.add(h));
  }), r.push(""), r.push("$ LINE ASSIGNS"), Xe.forEach((e) => r.push(e)), r.push("");
  const le = [], At = I.areaObjects, pt = /* @__PURE__ */ new Set(), Tt = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Map();
  At == null ? void 0 : At.forEach((e) => e.cells.forEach((t) => pt.add(t))), N.forEach((e, t) => {
    if (e.length === 4 || e.length === 3) {
      const n = l[e[0]], c = l[e[1]], E = l[e[2]], S = [c[0] - n[0], c[1] - n[1], c[2] - n[2]], h = [E[0] - n[0], E[1] - n[1], E[2] - n[2]], p = S[1] * h[2] - S[2] * h[1], m = S[2] * h[0] - S[0] * h[2], k = S[0] * h[1] - S[1] * h[0], g = Math.sqrt(p * p + m * m + k * k), y = g > 1e-10 && Math.abs(k) / g < 0.5;
      le.push({ idx: t, el: e, isWall: y }), pt.has(t) && le.pop();
    }
  });
  const ue = (() => {
    for (const [e, t] of Ge) if (!t) return Le.get(e);
    return Le.values().next().value || "Conc_1";
  })();
  At == null ? void 0 : At.forEach((e, t) => {
    le.push({ idx: e.cells[0], el: e.nodes, isWall: false }), e.q !== void 0 && Tt.set(e.cells[0], e.q), e.ang !== void 0 && Mt.set(e.cells[0], e.ang);
  });
  const Oe = "DECK";
  let Ve = false;
  const qe = [], It = (e) => {
    const t = M.elementInputs.plateFormulations, n = le.find((E) => E.isWall === e), c = t && n ? t.get(n.idx) : void 0;
    return c === 2 ? "Membrane" : c === 1 ? "ShellThin" : "ShellThick";
  }, $t = (e, t) => {
    const n = M.elementInputs.thicknesses, c = le.find((E) => E.isWall === e);
    return (c ? n == null ? void 0 : n.get(c.idx) : void 0) ?? (n == null ? void 0 : n.values().next().value) ?? t;
  }, dt = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"], ve = (e) => {
    var _a2;
    const n = (_a2 = I.shellModifiers) == null ? void 0 : _a2.get(e);
    if (n && n.length >= 8) return n.slice(0, 8);
    const c = I.membraneModifiers, E = I.bendingModifiers, S = c == null ? void 0 : c.get(e), h = E == null ? void 0 : E.get(e);
    if (S === void 0 && h === void 0) return null;
    const p = S ?? 1, m = h ?? 1;
    return [p, p, p, m, m, m, m, m];
  }, ut = (e, t) => {
    const n = le.filter((h) => h.isWall === t), c = /* @__PURE__ */ new Map();
    for (const h of n) {
      const p = ve(h.idx) ?? [1, 1, 1, 1, 1, 1, 1, 1];
      c.set(p.map((m) => T(m)).join(","), p);
    }
    if (c.size === 0) return "";
    c.size > 1 && console.warn(`[e2k] "${e}": ${c.size} juegos de modificadores distintos en la misma propiedad. ETABS los guarda POR PROPIEDAD, asi que se exporta el primero y los demas se pierden.`);
    const E = c.values().next().value, S = dt.map((h, p) => Math.abs(E[p] - 1) > 1e-9 ? `${h} ${T(E[p])}` : "").filter(Boolean);
    return S.length ? `  SHELLPROP  "${e}"  ${S.join(" ")} ` : "";
  }, mt = M.elementInputs.thicknesses, gt = M.elementInputs.plateFormulations, Pe = (e) => {
    var _a2;
    const t = mt == null ? void 0 : mt.get(e.idx), n = gt == null ? void 0 : gt.get(e.idx), c = ve(e.idx), E = (_a2 = M.elementInputs.deckSections) == null ? void 0 : _a2.get(e.idx), S = E ? [E.tc, E.hr, E.wrt, E.wrb, E.sr, E.w].map((h) => T(h)).join(",") : "-";
    return `${e.isWall ? "W" : "F"}|${t ?? "-"}|${n ?? "-"}|${c ? c.map((h) => T(h)).join(",") : "-"}|${$e(e.idx)}|${S}`;
  }, Qe = (e) => {
    var _a2;
    if ((_a2 = M.elementInputs.deckSections) == null ? void 0 : _a2.has(e)) return true;
    const t = ve(e);
    return t ? Math.abs(t[3]) < 1e-9 && Math.abs(t[4]) < 1e-9 : false;
  }, Fe = /* @__PURE__ */ new Map();
  let kt = 0, Ut = 0, xt = 0;
  for (const e of le) {
    const t = Pe(e);
    if (Fe.has(t)) continue;
    const n = e.isWall, c = !n && Qe(e.idx), E = n ? ++Ut : c ? ++xt : ++kt, S = $e(e.idx);
    Fe.set(t, { nombre: (n ? "Muro" : c ? Oe : "Losa") + (E === 1 ? "" : String(E)), isWall: n, mem: c, t: mt == null ? void 0 : mt.get(e.idx), pf: gt == null ? void 0 : gt.get(e.idx), idx: e.idx, mat: Le.get(S) ?? ue, acero: Ge.get(S) ?? false });
  }
  const We = (e) => {
    var _a2;
    return ((_a2 = Fe.get(Pe(e))) == null ? void 0 : _a2.nombre) ?? (e.isWall ? "Muro" : "Losa");
  }, Nt = (e) => e === 2 ? "Membrane" : e === 1 ? "ShellThin" : "ShellThick", Ht = (e, t) => {
    const n = le.find((S) => Pe(S) === t), c = n ? ve(n.idx) ?? null : null;
    if (!c) return "";
    const E = dt.map((S, h) => Math.abs(c[h] - 1) > 1e-9 ? `${S} ${T(c[h])}` : "").filter(Boolean);
    return E.length ? `  SHELLPROP  "${e}"  ${E.join(" ")} ` : "";
  }, ye = le.find((e) => !e.isWall), Ot = le.find((e) => e.isWall), et = /* @__PURE__ */ new Set();
  ye && et.add(Pe(ye)), Ot && et.add(Pe(Ot));
  const Rt = [...Fe.entries()].filter(([e]) => !et.has(e)), tt = (e) => {
    var _a2;
    return e === void 0 ? void 0 : (_a2 = M.elementInputs.deckSections) == null ? void 0 : _a2.get(e);
  }, vt = (e) => e * Y / C ** 2, Lt = (e, t) => {
    const n = (c) => R(d(c));
    return `  SHELLPROP  "${e}"  PROPTYPE  "Deck"  DECKTYPE "Filled"  CONCMATERIAL "${ue}"  DECKMATERIAL "${ue}"  DECKSLABDEPTH ${n(t.tc)} DECKRIBDEPTH ${n(t.hr)} DECKRIBWIDTHTOP ${n(t.wrt)} DECKRIBWIDTHBOTTOM ${n(t.wrb)} DECKRIBSPACING ${n(t.sr)} DECKSHEARTHICKNESS ${n(76e-5)} DECKUNITWEIGHT ${R(vt(t.w))} SHEARSTUDDIAM ${n(0.019)} SHEARSTUDHEIGHT ${n(0.1)} SHEARSTUDFU 400 `;
  };
  if (le.some((e) => !e.isWall)) {
    Ve = !!ye && Qe(ye.idx);
    const e = $t(false, 0.15);
    if (Ve) {
      r.push("$ DECK PROPERTIES");
      const n = [...Fe.values()].find((E) => E.nombre === Oe), c = tt(ye == null ? void 0 : ye.idx);
      (n == null ? void 0 : n.acero) ? r.push(`  SHELLPROP  "${Oe}"  PROPTYPE  "Slab"  MATERIAL "${n.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${T(d(e))} `) : c ? r.push(Lt(Oe, c)) : r.push(`  SHELLPROP  "${Oe}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${T(d(e))} `);
    } else r.push("$ SLAB PROPERTIES"), r.push(`  SHELLPROP  "Losa"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${It(false)}"  SLABTYPE "Slab"  SLABTHICKNESS ${T(d(e))} `);
    const t = ut(Ve ? Oe : "Losa", false);
    t && r.push(t), r.push("");
  }
  if (le.some((e) => e.isWall)) {
    r.push("$ WALL PROPERTIES");
    const e = $t(true, 0.2), t = It(true);
    r.push(`  SHELLPROP  "Muro"  PROPTYPE  "Wall"  MATERIAL "${ue}"  MODELINGTYPE "${t}"  WALLTHICKNESS ${T(d(e))} `);
    const n = ut("Muro", true);
    n && r.push(n), r.push("");
  }
  if (Rt.length) {
    r.push("$ OTRAS SECCIONES DE CASCARA");
    for (const [e, t] of Rt) {
      const n = t.t ?? (t.isWall ? 0.2 : 0.15);
      r.push(t.isWall ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Wall"  MATERIAL "${t.mat ?? ue}"  MODELINGTYPE "${Nt(t.pf)}"  WALLTHICKNESS ${T(d(n))} ` : t.mem && t.acero ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${t.mat}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${T(d(n))} ` : t.mem && tt(t.idx) ? Lt(t.nombre, tt(t.idx)) : t.mem ? `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "Membrane"  SLABTYPE "Slab"  SLABTHICKNESS ${T(d(n))} ` : `  SHELLPROP  "${t.nombre}"  PROPTYPE  "Slab"  MATERIAL "${ue}"  MODELINGTYPE "${Nt(t.pf)}"  SLABTYPE "Slab"  SLABTHICKNESS ${T(d(n))} `);
      const c = Ht(t.nombre, e);
      c && r.push(c);
    }
    r.push("");
  }
  if (le.length > 0) {
    r.push("$ AREA CONNECTIVITIES");
    const e = [];
    le.forEach((t, n) => {
      const { el: c, isWall: E } = t, S = E ? `W${n + 1}` : `F${n + 1}`, h = E ? "PANEL" : "FLOOR", p = c.map((m) => Ae(m));
      if (E) {
        const m = (W) => ne.indexOf(W);
        if (new Set(p.map((W) => W.pt)).size === 4) {
          const W = Math.max(...p.map((ae) => m(ae.story))), z = p.map((ae) => W - m(ae.story));
          r.push(`  AREA "${S}"  ${h}  4  "${p[0].pt}"  "${p[1].pt}"  "${p[2].pt}"  "${p[3].pt}"  ${z.join("  ")}  `), e.push(`  AREAASSIGN  "${S}"  "${ne[W]}"  SECTION "${We(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
          return;
        }
        const g = l[c[0]][2] <= l[c[2]][2] ? 0 : 2, y = l[c[1]][2] <= l[c[3]][2] ? 1 : 3;
        r.push(`  AREA "${S}"  ${h}  4  "${p[g].pt}"  "${p[y].pt}"  "${p[y].pt}"  "${p[g].pt}"  1  1  0  0  `);
        const P = p[g === 0 ? 2 : 0].story;
        e.push(`  AREAASSIGN  "${S}"  "${P}"  SECTION "${We(t)}"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `);
      } else {
        const m = p.length, k = (z) => ne.indexOf(z), g = Math.max(...p.map((z) => k(z.story))), y = p.map((z) => g - k(z.story)), P = ne[g] ?? p[0].story;
        r.push(`  AREA "${S}"  ${h}  ${m}  ` + p.map((z) => `"${z.pt}"`).join("  ") + "  " + y.join("  ") + "  ");
        const W = Mt.get(t.idx) ?? (w == null ? void 0 : w.get(t.idx));
        e.push(Qe(t.idx) ? `  AREAASSIGN  "${S}"  "${P}"  SECTION "${We(t)}"  ANG ${T(W ?? 0)} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ` : `  AREAASSIGN  "${S}"  "${P}"  SECTION "${We(t)}" ${Ke && (!Ce.size || (N[t.idx] ?? []).every((z) => Ce.has(z))) ? ' DIAPH  "D1" ' : ""} OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "TOP"  TRANSFORMSTIFFNESSFOROFFSETS "No"  `), qe.push({ name: S, story: P, idx: t.idx });
      }
    }), r.push(""), r.push("$ AREA ASSIGNS"), e.forEach((t) => r.push(t)), r.push("");
  }
  const Wt = De === "manual" ? 0 : Z ?? 1;
  r.push("$ LOAD PATTERNS");
  const Ne = ((_d = M.loadPatterns) == null ? void 0 : _d.length) ? M.loadPatterns : [{ name: "Dead", type: "Dead", selfWeightMultiplier: Wt }, { name: "Live", type: "Live", selfWeightMultiplier: 0 }];
  for (const e of Ne) {
    let t;
    e.type === "Dead" ? t = De === "manual" ? 0 : e.selfWeightMultiplier ?? Z ?? 1 : (t = 0, (e.selfWeightMultiplier ?? 0) !== 0 && console.warn(`[e2k] El patron "${e.name}" (tipo ${e.type ?? "Other"}) pedia SELFWEIGHT ${e.selfWeightMultiplier}. Se exporta 0: el peso propio va solo en Dead.`)), r.push(`  LOADPATTERN "${e.name}"  TYPE  "${e.type ?? "Other"}"  SELFWEIGHT  ${t}`);
  }
  r.push("");
  const Re = M.loadPatternDestino && Ne.some((e) => e.name === M.loadPatternDestino) ? M.loadPatternDestino : ((_e2 = Ne.find((e) => e.type === "Dead")) == null ? void 0 : _e2.name) ?? Ne[0].name, st = [], ot = /* @__PURE__ */ new Map(), Dt = (e, t) => {
    const n = ot.get(e) ?? [0, 0, 0, 0, 0, 0];
    for (let c = 0; c < 6; c++) n[c] += t[c] ?? 0;
    ot.set(e, n);
  }, zt = Re === (((_f = Ne.find((e) => e.type === "Dead")) == null ? void 0 : _f.name) ?? Ne[0].name), jt = De === "manual" || !zt || te;
  if (L.loads && L.loads.size > 0 && L.loads.forEach((e, t) => {
    const [n, c, E] = se(t, e), [S, h, p] = Ee(t, e);
    Dt(t, [n, c, jt ? E : 0, S, h, p]);
  }), L.moments && L.moments.size > 0 && L.moments.forEach((e, t) => {
    Dt(t, [0, 0, 0, e[0] ?? 0, e[1] ?? 0, e[2] ?? 0]);
  }), ot.forEach((e, t) => {
    if (e.every((c) => Math.abs(c) <= 1e-10)) return;
    const n = Ae(t);
    st.push(`  POINTLOAD  "${n.pt}"  "${n.story}"  TYPE "FORCE"  LC "${Re}"  FX ${R(s(e[0]))}  FY ${R(s(e[1]))}  FZ ${R(s(e[2]))}  MX ${R(a(e[3]))}  MY ${R(a(e[4]))}  MZ ${R(a(e[5]))}`);
  }), st.length > 0 && (r.push("$ POINT OBJECT LOADS"), st.forEach((e) => r.push(e)), r.push("")), te && oe.size > 0) {
    const e = [];
    for (const t of oe) {
      const n = ee.get(t), c = lt.get(t);
      if (!c) continue;
      const E = (S) => R(o(S) / C);
      Math.abs(n[2]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "${n[2] < 0 ? "GRAV" : "Z"}"  LC "${Re}"  FVAL ${E(Math.abs(n[2]))}`), Math.abs(n[0]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "X"  LC "${Re}"  FVAL ${E(n[0])}`), Math.abs(n[1]) > 1e-12 && e.push(`  LINELOAD  "${c.name}"  "${c.story}"  TYPE "UNIFF"  DIR "Y"  LC "${Re}"  FVAL ${E(n[1])}`);
    }
    e.length && (r.push("$ FRAME OBJECT LOADS"), e.forEach((t) => r.push(t)), r.push(""));
  }
  if (f && f.size > 0 && qe.length > 0) {
    const e = [];
    for (const t of qe) {
      const n = Tt.get(t.idx), c = n !== void 0 ? { value: n } : f.get(t.idx);
      if (!c || Math.abs(c.value) < 1e-12) continue;
      const E = c.dir ?? "GRAV", S = E === "GRAV" ? -c.value : c.value;
      e.push(`  AREALOAD  "${t.name}"  "${t.story}"  TYPE "UNIFF"  DIR "${E}"  LC "${c.pattern ?? Re}"  FVAL ${R(o(S) / (C * C))}`);
    }
    e.length > 0 && (r.push("$ SHELL OBJECT LOADS"), e.forEach((t) => r.push(t)), r.push(""));
  }
  r.push("$ ANALYSIS OPTIONS"), r.push('  ACTIVEDOF "UX UY UZ RX RY RZ"  '), r.push('  PDELTA  METHOD "NONE"  '), r.push("");
  const nt = De === "manual";
  r.push("$ MASS SOURCE"), r.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "${nt ? "Yes" : "No"}"    INCLUDEADDEDMASS "No"    INCLUDELOADS "${nt ? "No" : "Yes"}"    INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "No"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"  `), nt || r.push('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 '), r.push(""), r.push("$ LOAD CASES");
  const Jt = ((_g = M.loadCases) == null ? void 0 : _g.length) ? M.loadCases : Ne.map((e) => ({ name: e.name, type: "Linear Static", patterns: [{ pattern: e.name, scaleFactor: 1 }] }));
  for (const e of Jt) {
    r.push(`  LOADCASE "${e.name}"  TYPE  "${e.type ?? "Linear Static"}"  INITCOND  "PRESET"  `);
    for (const t of e.patterns ?? []) r.push(`  LOADCASE "${e.name}"  LOADPAT  "${t.pattern}"  SF ${t.scaleFactor} `);
  }
  const _t = M.modalModes ?? 12;
  r.push('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  '), r.push(`  LOADCASE "Modal"  MAXMODES ${_t}  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  `), r.push("");
  const at = M.loadCombinations;
  if (at && at.length) {
    r.push("$ LOAD COMBINATIONS");
    for (const e of at) {
      r.push(`  COMBO "${e.name}"  TYPE "${e.type ?? "Linear Add"}"  `);
      for (const t of e.cases ?? []) r.push(`  COMBO "${e.name}"  LOADCASE  "${t.case}"  SF ${t.scaleFactor} `);
    }
    r.push("");
  }
  return r.push("  END"), r.push("$ END OF MODEL FILE"), r.join(`\r
`);
}
function Ft(M, l) {
  const N = M[l[0]], L = M[l[1]], I = Math.abs(L[2] - N[2]), x = Math.sqrt((L[0] - N[0]) ** 2 + (L[1] - N[1]) ** 2), H = I > x * 0.5;
  return H && x > 0.01 ? "BRACE" : H ? "COLUMN" : "BEAM";
}
export {
  ns as a,
  as as e,
  os as p
};
