function a(w) {
  return w && parseFloat(w) || 0;
}
function _(w) {
  const I = /* @__PURE__ */ new Map(), M = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let d;
  for (; (d = M.exec(w)) !== null; ) I.set(d[1], d[2] !== void 0 ? d[2] : d[3]);
  return I;
}
function te(w) {
  const I = w.split(/\r?\n/);
  return I.some((d) => d.trim().startsWith("TABLE:")) ? Q(I) : ee(I);
}
function Q(w) {
  var _a, _b, _c, _d, _e, _f;
  const I = [];
  let M = "";
  for (const r of w) {
    const g = r.trimEnd();
    g.endsWith("_") ? M += g.slice(0, -1) + " " : (M += g, I.push(M), M = "");
  }
  M && I.push(M);
  const d = { force: "KN", length: "m" };
  let Y = "UX,UY,UZ,RX,RY,RZ";
  const N = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), x = [], v = [], J = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), z = [], L = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), k = [], T = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  let E = "";
  for (const r of I) {
    const g = r.trim();
    if (!g || g.startsWith(";") || g.startsWith("File ")) continue;
    if (g.startsWith("TABLE:")) {
      const t = g.match(/TABLE:\s+"(.+?)"/);
      E = t ? t[1].toUpperCase() : "";
      continue;
    }
    if (g === "END TABLE DATA") {
      E = "";
      continue;
    }
    const e = _(g);
    switch (E) {
      case "PROGRAM CONTROL": {
        const t = e.get("CurrUnits");
        if (t) {
          const c = t.split(",").map((s) => s.trim());
          c[0] && (d.force = c[0]), c[1] && (d.length = c[1]);
        }
        break;
      }
      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const t = e.get("Material");
        t && !N.has(t) && N.set(t, { E: 0, nu: 0, G: 0 });
        break;
      }
      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const t = e.get("Material");
        if (t) {
          const c = N.get(t) || { E: 0, nu: 0, G: 0 };
          c.E = a(e.get("E1")), c.G = a(e.get("G12")), c.nu = a(e.get("U12")), c.density = a(e.get("UnitMass")), N.set(t, c);
        }
        break;
      }
      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const t = e.get("Material");
        t && N.has(t) && (N.get(t).fy = a(e.get("Fy")));
        break;
      }
      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const t = e.get("SectionName");
        t && G.set(t, { material: e.get("Material") || "", shape: e.get("Shape") || "Rectangular", D: a(e.get("t3")), B: a(e.get("t2")), TF: a(e.get("tf")), TW: a(e.get("tw")), T2B: a(e.get("t2b")), TFB: a(e.get("tfb")), DIS: a(e.get("dis")), A: a(e.get("Area")), Iz: a(e.get("I33")), Iy: a(e.get("I22")), J: a(e.get("TorsConst")), As2: a(e.get("AS2")), As3: a(e.get("AS3")) });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        const t = e.get("SectionName");
        t && P.set(t, { h: a(e.get("Height")), b: a(e.get("Width")), t: a(e.get("WebThick")) || a(e.get("FlngThick")), tf: a(e.get("FlngThick")) || a(e.get("WebThick")), mat: e.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const t = e.get("SectionName");
        t && P.set(t, { h: 0, b: 0, D: a(e.get("OuterDiam")), t: a(e.get("WallThick")), mat: e.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const t = e.get("SectionName");
        t && y.set(t, { mat: e.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const t = e.get("SectionName");
        t && y.set(t, { mat: e.get("ShapeMat") || "" });
        break;
      }
      case "AREA SECTION PROPERTIES": {
        const t = e.get("Section");
        t && j.set(t, { material: e.get("Material") || "", type: e.get("Type") || "Shell", thickness: a(e.get("Thickness")) });
        break;
      }
      case "JOINT COORDINATES": {
        const t = e.get("Joint");
        if (t) {
          const c = a(e.get("XorR")), s = a(e.get("Y")), S = a(e.get("Z"));
          B.set(t, [c, s, S]);
        }
        break;
      }
      case "CONNECTIVITY - FRAME": {
        const t = e.get("Frame"), c = e.get("JointI"), s = e.get("JointJ");
        t && c && s && x.push({ name: t, j1: c, j2: s });
        break;
      }
      case "CONNECTIVITY - AREA": {
        const t = e.get("Area");
        if (t) {
          const c = parseInt(e.get("NumJoints") || "4"), s = [];
          for (let S = 1; S <= c; S++) {
            const b = e.get(`Joint${S}`);
            b && s.push(b);
          }
          s.length >= 3 && v.push({ name: t, joints: s });
        }
        break;
      }
      case "JOINT RESTRAINT ASSIGNMENTS": {
        const t = e.get("Joint");
        if (t) {
          const c = [((_a = e.get("U1")) == null ? void 0 : _a.toLowerCase()) === "yes", ((_b = e.get("U2")) == null ? void 0 : _b.toLowerCase()) === "yes", ((_c = e.get("U3")) == null ? void 0 : _c.toLowerCase()) === "yes", ((_d = e.get("R1")) == null ? void 0 : _d.toLowerCase()) === "yes", ((_e = e.get("R2")) == null ? void 0 : _e.toLowerCase()) === "yes", ((_f = e.get("R3")) == null ? void 0 : _f.toLowerCase()) === "yes"];
          J.set(t, c);
        }
        break;
      }
      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const t = e.get("Joint");
        t && Z.set(t, ["U1", "U2", "U3", "R1", "R2", "R3"].map((c) => parseFloat(e.get(c) ?? "0") || 0));
        break;
      }
      case "FRAME SECTION ASSIGNMENTS": {
        const t = e.get("Frame"), c = e.get("AnalSect");
        t && c && H.set(t, c);
        break;
      }
      case "AREA SECTION ASSIGNMENTS": {
        const t = e.get("Area"), c = e.get("Section");
        t && c && X.set(t, c);
        break;
      }
      case "FRAME LOADS - DISTRIBUTED": {
        const t = e.get("Frame"), c = e.get("Dir"), s = a(e.get("FOverLA"));
        if (t && c && s) {
          const S = { X: 0, Y: 1, Z: 2 }[c];
          if (S !== void 0) {
            const b = $.get(t) ?? [0, 0, 0];
            b[S] += s, $.set(t, b);
          }
        }
        break;
      }
      case "CONNECTIVITY - SOLID": {
        const t = e.get("Solid");
        if (t) {
          const c = [];
          for (let s = 1; s <= 8; s++) {
            const S = e.get(`Joint${s}`);
            S && c.push(S);
          }
          c.length === 8 && k.push({ name: t, joints: c });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const t = e.get("SolidProp");
        t && T.set(t, { material: e.get("Material") || "", incomp: (e.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const t = e.get("Solid"), c = e.get("SolidProp");
        t && c && l.set(t, c);
        break;
      }
      case "AREA STIFFNESS MODIFIERS": {
        const t = e.get("Area");
        t && V.set(t, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map((c) => e.has(c) ? a(e.get(c)) : 1));
        break;
      }
      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const t = e.get("Frame");
        t && U.set(t, a(e.get("Angle")));
        break;
      }
      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const t = e.get("Frame");
        t && L.set(t, [a(e.get("LengthI")), a(e.get("LengthJ")), a(e.get("RigidFactor"))]);
        break;
      }
      case "JOINT LOADS - FORCE": {
        const t = e.get("Joint");
        t && z.push({ joint: t, fx: a(e.get("F1")), fy: a(e.get("F2")), fz: a(e.get("F3")), mx: a(e.get("M1")), my: a(e.get("M2")), mz: a(e.get("M3")) });
        break;
      }
    }
  }
  return q(d, Y, N, G, j, B, x, v, J, H, X, z, L, U, V, $, k, T, l, P, y, Z);
}
function ee(w) {
  const I = { force: "KN", length: "m" };
  let M = "UX,UY,UZ,RX,RY,RZ";
  const d = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), y = [], G = [], j = /* @__PURE__ */ new Map(), B = [], x = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), H = [], X = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
  let L = "", U = "";
  for (const k of w) {
    const T = k.trim();
    if (!T || T.startsWith(";")) continue;
    if (!k.startsWith(" ") && !k.startsWith("	")) {
      const r = T.toUpperCase();
      if (r === "END") break;
      r.startsWith("SHELL SECTION") ? L = "SHELL SECTION" : r.startsWith("FRAME SECTION") ? L = "FRAME SECTION" : L = r.split(/\s+/)[0];
      continue;
    }
    const l = _(T), E = T.split(/\s+/);
    switch (L) {
      case "SYSTEM": {
        const r = l.get("DOF");
        r && (M = r);
        const g = l.get("LENGTH");
        g && (I.length = g);
        const e = l.get("FORCE");
        e && (I.force = e);
        break;
      }
      case "JOINT": {
        const r = E[0];
        P.set(r, [a(l.get("X")), a(l.get("Y")), a(l.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const r = l.get("ADD"), g = l.get("DOF");
        if (r && g) {
          const e = g.split(","), t = [false, false, false, false, false, false];
          for (const c of e) {
            const s = c.toUpperCase();
            (s === "UX" || s === "U1") && (t[0] = true), (s === "UY" || s === "U2") && (t[1] = true), (s === "UZ" || s === "U3") && (t[2] = true), (s === "RX" || s === "R1") && (t[3] = true), (s === "RY" || s === "R2") && (t[4] = true), (s === "RZ" || s === "R3") && (t[5] = true);
          }
          j.set(r, t);
        }
        break;
      }
      case "MATERIAL": {
        const r = l.get("NAME");
        if (r) U = r, d.set(r, { E: 0, nu: 0, G: 0 });
        else if (U) {
          const g = d.get(U), e = l.get("E");
          e && (g.E = a(e));
          const t = l.get("U");
          t && (g.nu = a(t)), g.G = g.E / (2 * (1 + g.nu));
          const c = l.get("M");
          c && (g.density = a(c));
        }
        break;
      }
      case "SHELL": {
        const r = E[0], g = l.get("J");
        l.get("SEC"), g && G.push({ name: r, joints: g.split(",") });
        break;
      }
      case "SHELL SECTION": {
        const r = l.get("NAME");
        r && N.set(r, { material: l.get("MAT") || "", type: l.get("TYPE") || "Shell", thickness: a(l.get("TH")) });
        break;
      }
      case "FRAME": {
        const r = E[0], g = l.get("J");
        if (g) {
          const e = g.split(",");
          e.length >= 2 && y.push({ name: r, j1: e[0], j2: e[1] });
        }
        break;
      }
      case "LOAD": {
        const r = l.get("ADD");
        r && B.push({ joint: r, fx: a(l.get("UX")), fy: a(l.get("UY")), fz: a(l.get("UZ")), mx: a(l.get("MX")), my: a(l.get("MY")), mz: a(l.get("MZ")) });
        break;
      }
    }
  }
  return q(I, M, d, Y, N, P, y, G, j, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Map(), B, x, v, J, Z, H, X, z);
}
function q(w, I, M, d, Y, N, P, y, G, j, B, x, v = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), X = [], z = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), U, V, $ = /* @__PURE__ */ new Map()) {
  var _a, _b;
  const k = [], T = /* @__PURE__ */ new Map(), l = [];
  for (const [n, o] of N) T.set(n, l.length), k.push(n), l.push(o);
  const E = [], r = [], g = /* @__PURE__ */ new Map();
  for (const n of P) {
    const o = T.get(n.j1), f = T.get(n.j2);
    if (o !== void 0 && f !== void 0) {
      const p = E.length;
      E.push([o, f]), r.push(n.name);
      const i = j.get(n.name);
      i && g.set(p, i);
    }
  }
  const e = E.length;
  for (const n of y) {
    const o = n.joints.map((f) => T.get(f)).filter((f) => f !== void 0);
    if (o.length >= 3) {
      const f = E.length;
      E.push(o), r.push(n.name);
      const p = B.get(n.name);
      p && g.set(f, p);
    }
  }
  const t = E.length - e, c = [];
  for (const n of X) {
    const o = n.joints.map((i) => T.get(i));
    if (o.some((i) => i === void 0)) continue;
    const f = E.length;
    E.push([o[0], o[1], o[3], o[2], o[4], o[5], o[7], o[6]]), r.push(n.name), c.push(f);
    const p = L.get(n.name);
    p && g.set(f, p);
  }
  const s = { elasticities: /* @__PURE__ */ new Map(), shearModuli: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), momentsOfInertiaZ: /* @__PURE__ */ new Map(), momentsOfInertiaY: /* @__PURE__ */ new Map(), torsionalConstants: /* @__PURE__ */ new Map(), densities: /* @__PURE__ */ new Map(), thicknesses: /* @__PURE__ */ new Map(), poissonsRatios: /* @__PURE__ */ new Map() }, S = /* @__PURE__ */ new Map(), b = M.values().next().value || { E: 29e3, nu: 0.3, G: 11153 };
  for (let n = 0; n < E.length; n++) {
    const o = g.get(n), f = o ? d.get(o) : null, p = o ? Y.get(o) : null;
    if (f || E[n].length === 2) {
      const i = f || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" }, h = M.get(i.material) || b, u = h.E || b.E, F = h.nu || 0.3, O = h.G || u / (2 * (1 + F));
      s.elasticities.set(n, u), s.shearModuli.set(n, O), s.areas.set(n, i.A || i.D * i.B), s.momentsOfInertiaZ.set(n, i.Iz || i.B * i.D ** 3 / 12), s.momentsOfInertiaY.set(n, i.Iy || i.D * i.B ** 3 / 12), s.torsionalConstants.set(n, i.J || 0), s.densities.set(n, h.density || 0), i.As2 && (s.shearAreasZ ?? (s.shearAreasZ = /* @__PURE__ */ new Map()), s.shearAreasZ.set(n, i.As2)), i.As3 && (s.shearAreasY ?? (s.shearAreasY = /* @__PURE__ */ new Map()), s.shearAreasY.set(n, i.As3));
      const R = v.get(r[n]);
      R && (s.endOffsets ?? (s.endOffsets = /* @__PURE__ */ new Map()), s.endOffsets.set(n, R));
      const C = J.get(r[n]);
      C && (s.localAngles ?? (s.localAngles = /* @__PURE__ */ new Map()), s.localAngles.set(n, C));
      const m = i;
      ((_a = i.shape) == null ? void 0 : _a.includes("Wide Flange")) || i.shape === "I" ? S.set(n, { type: "I", b: i.B, h: i.D, ...m.TF > 0 && m.TW > 0 ? { tf: m.TF, tw: m.TW, t2b: m.T2B > 0 ? m.T2B : i.B, tfb: m.TFB > 0 ? m.TFB : m.TF } : {}, name: o || "I-section" }) : /box|tube/i.test(i.shape ?? "") && m.TF > 0 && m.TW > 0 ? S.set(n, { type: "HSS", b: i.B, h: i.D, tf: m.TF, tw: m.TW, name: o }) : /^channel$/i.test(i.shape ?? "") && m.TF > 0 && m.TW > 0 ? S.set(n, { type: "C", b: i.B, h: i.D, tf: m.TF, tw: m.TW, name: o }) : /double angle/i.test(i.shape ?? "") && m.TF > 0 && m.TW > 0 ? S.set(n, { type: "2L", b: i.B, h: i.D, tf: m.TF, tw: m.TW, dis: m.DIS || 0, name: o }) : S.set(n, { type: "rect", b: i.B, h: i.D });
      const A = o ? U == null ? void 0 : U.get(o) : void 0;
      if (A && A.t > 0 && (A.b > 0 && A.h > 0 || (A.D ?? 0) > 0)) {
        const K = o ? V == null ? void 0 : V.get(o) : void 0, D = K && ((_b = M.get(K.mat)) == null ? void 0 : _b.E) || 0;
        S.set(n, A.D ? { type: "CFT", d: A.D, tw: A.t, name: o, ...D > 0 ? { fillE: D } : {} } : { type: "CFT", b: A.b, h: A.h, tw: A.t, ...A.tf && A.tf !== A.t ? { tf: A.tf } : {}, name: o, ...D > 0 ? { fillE: D } : {} });
      }
    } else if (p) {
      const i = M.get(p.material) || b, h = i.E || b.E, u = i.nu || 0.2, F = i.G || h / (2 * (1 + u));
      s.elasticities.set(n, h), s.shearModuli.set(n, F), s.thicknesses.set(n, p.thickness), s.poissonsRatios.set(n, u), s.plateFormulations ?? (s.plateFormulations = /* @__PURE__ */ new Map()), s.plateFormulations.set(n, /thin/i.test(p.type) ? 1 : 0);
      const O = /membrane/i.test(p.type), R = Z.get(r[n]), C = R && O ? [R[0], R[1], R[2], 0, 0, 0, 0, 0] : R;
      C ? (s.shellModifiers ?? (s.shellModifiers = /* @__PURE__ */ new Map()), s.shellModifiers.set(n, C), s.membraneModifiers ?? (s.membraneModifiers = /* @__PURE__ */ new Map()), s.membraneModifiers.set(n, C[0]), s.bendingModifiers ?? (s.bendingModifiers = /* @__PURE__ */ new Map()), s.bendingModifiers.set(n, C[3])) : O && (s.membraneModifiers ?? (s.membraneModifiers = /* @__PURE__ */ new Map()), s.membraneModifiers.set(n, 1), s.bendingModifiers ?? (s.bendingModifiers = /* @__PURE__ */ new Map()), s.bendingModifiers.set(n, 0)), s.densities.set(n, i.density || 0);
    }
  }
  if (c.length) {
    let n = false;
    for (const o of c) {
      const f = z.get(g.get(o) || ""), p = f && M.get(f.material) || b, i = p.E || b.E, h = p.nu || 0.2;
      s.elasticities.set(o, i), s.poissonsRatios.set(o, h), s.shearModuli.set(o, p.G || i / (2 * (1 + h))), s.densities.set(o, p.density || 0), (f == null ? void 0 : f.incomp) && (n = true);
    }
    s.solidIncompatible = n;
  }
  const W = { supports: /* @__PURE__ */ new Map(), loads: /* @__PURE__ */ new Map() };
  for (const [n, o] of G) {
    const f = T.get(n);
    f !== void 0 && W.supports.set(f, o);
  }
  {
    const n = [];
    for (const [o, f] of $) {
      const p = T.get(o);
      p !== void 0 && f.forEach((i, h) => {
        i > 0 && n.push({ node: p, dof: h, k: i });
      });
    }
    n.length && (W.springs = n);
  }
  for (const [n, o] of H) {
    const f = r.indexOf(n);
    if (f < 0 || E[f].length !== 2) continue;
    s.frameLoads ?? (s.frameLoads = /* @__PURE__ */ new Map()), s.frameLoads.set(f, o);
    const p = l[E[f][0]], i = l[E[f][1]], h = [i[0] - p[0], i[1] - p[1], i[2] - p[2]], u = Math.hypot(h[0], h[1], h[2]);
    if (u < 1e-9) continue;
    const F = [h[0] / u, h[1] / u, h[2] / u], O = u * u / 12, R = [F[1] * o[2] - F[2] * o[1], F[2] * o[0] - F[0] * o[2], F[0] * o[1] - F[1] * o[0]], C = (m, A) => {
      const K = W.loads.get(m) || [0, 0, 0, 0, 0, 0];
      for (let D = 0; D < 6; D++) K[D] += A[D];
      W.loads.set(m, K);
    };
    C(E[f][0], [o[0] * u / 2, o[1] * u / 2, o[2] * u / 2, O * R[0], O * R[1], O * R[2]]), C(E[f][1], [o[0] * u / 2, o[1] * u / 2, o[2] * u / 2, -O * R[0], -O * R[1], -O * R[2]]);
  }
  for (const n of x) {
    const o = T.get(n.joint);
    if (o !== void 0) {
      const f = W.loads.get(o) || [0, 0, 0, 0, 0, 0];
      f[0] += n.fx, f[1] += n.fy, f[2] += n.fz, f[3] += n.mx, f[4] += n.my, f[5] += n.mz, W.loads.set(o, f);
    }
  }
  return { units: w, dof: I, materials: M, frameSections: d, shellSections: Y, nodes: l, nodeNames: k, nodeNameToIdx: T, elements: E, elementNames: r, elementSections: g, nodeInputs: W, elementInputs: s, sectionShapes: S, info: { nNodes: l.length, nFrames: e, nShells: t, title: `SAP2000 (${e} frames, ${t} shells)` } };
}
export {
  te as p
};
