import { c as We, a as je } from "./cadSections-DVtTZU6U.js";
import { h as qe, a as Be, __tla as __tla_0 } from "./h8-CxkkFRzA.js";
import { a as Ne } from "./analyze-DgLgRmKg.js";
import { d as Re, __tla as __tla_1 } from "./didacticCpp-CnEP9H1T.js";
let Ke, _e;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  const Ae = {
    ux: 0,
    uy: 1,
    uz: 2,
    rx: 3,
    ry: 4,
    rz: 5,
    fx: 0,
    fy: 1,
    fz: 2,
    mx: 3,
    my: 4,
    mz: 5
  };
  function Oe(f) {
    const o = f.toLowerCase().trim();
    if (o === "fixed" || o === "empotrado") return [
      true,
      true,
      true,
      true,
      true,
      true
    ];
    if (o === "pinned" || o === "articulado") return [
      true,
      true,
      true,
      false,
      false,
      false
    ];
    if (o === "roller" || o === "rodillo") return [
      false,
      false,
      true,
      false,
      false,
      false
    ];
    const A = [
      false,
      false,
      false,
      false,
      false,
      false
    ], c = o.split(/[\s,]+/).filter(Boolean);
    if (c.length > 1 && c.length <= 6 && c.every((k) => k === "0" || k === "1")) return c.forEach((k, X) => {
      A[X] = k === "1";
    }), A;
    for (const k of c) Ae[k] !== void 0 && (A[Ae[k]] = true);
    if (/^[01]+$/.test(o) && o.length <= 6) for (let k = 0; k < o.length; k++) A[k] = o[k] === "1";
    return A;
  }
  _e = function(f) {
    const o = {
      nodes: /* @__PURE__ */ new Map(),
      frames: [],
      shells: [],
      shellLoads: /* @__PURE__ */ new Map(),
      shellTypes: /* @__PURE__ */ new Map(),
      shellMods: /* @__PURE__ */ new Map(),
      shellModsDir: /* @__PURE__ */ new Map(),
      shellAngles: /* @__PURE__ */ new Map(),
      frameAngles: /* @__PURE__ */ new Map(),
      frameShearAreas: /* @__PURE__ */ new Map(),
      frameCft: /* @__PURE__ */ new Map(),
      frameCftc: /* @__PURE__ */ new Map(),
      frameEndOffsets: /* @__PURE__ */ new Map(),
      selfWeight: 0,
      meshCross: true,
      deckEtabs: false,
      deckOneWay: false,
      torsionFactor: 1,
      deckTributario: /* @__PURE__ */ new Set(),
      areaSprings: [],
      edgeEtabs: false,
      solids: [],
      solidIncompatible: true,
      etabsWallJoint: true,
      frameReleases: /* @__PURE__ */ new Map(),
      areaObjs: [],
      supports: /* @__PURE__ */ new Map(),
      loads: /* @__PURE__ */ new Map(),
      frameLoads: /* @__PURE__ */ new Map(),
      springs: [],
      masses: /* @__PURE__ */ new Map(),
      diaphragms: /* @__PURE__ */ new Map(),
      doSolve: false,
      errors: []
    };
    let A = null, c = 0, k = 0, X = 0;
    const L = f.split(/\r?\n/);
    for (let R = 0; R < L.length; R++) {
      let w = L[R].trim();
      if (!w || w.startsWith("#") || w.startsWith("//")) continue;
      w = w.replace(/[;]+$/, "");
      const t = w.split(/\s+/), _ = t[0].toLowerCase();
      if (_ === "nodes" && t.length === 1) {
        A = "nodes";
        continue;
      }
      if ((_ === "elements" || _ === "frames") && t.length === 1) {
        A = "elements";
        continue;
      }
      if (_ === "areas" && t.length === 1) {
        A = "areas";
        continue;
      }
      if (_ === "supports" && t.length === 1) {
        A = "supports";
        continue;
      }
      if (_ === "loads" && t.length === 1) {
        A = "loads";
        continue;
      }
      if (_ === "springs" && t.length === 1) {
        A = "springs";
        continue;
      }
      if (A && /^[\-\d]/.test(t[0])) {
        const s = t.map(parseFloat);
        if (A === "nodes" && s.length >= 3) {
          c++, o.nodes.set(c, [
            s[0],
            s[1],
            s[2]
          ]);
          continue;
        }
        if (A === "elements" && s.length >= 2) {
          k++, o.frames.push({
            id: k,
            nI: s[0] + 1,
            nJ: s[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (A === "areas" && s.length >= 4) {
          X++, o.shells.push({
            id: X,
            pts: [
              s[0] + 1,
              s[1] + 1,
              s[2] + 1,
              s[3] + 1
            ],
            t: 0.2,
            E: 25e6
          });
          continue;
        }
        if (A === "loads" && s.length >= 4) {
          o.loads.set(s[0], [
            s[1] ?? 0,
            s[2] ?? 0,
            s[3] ?? 0,
            s[4] ?? 0,
            s[5] ?? 0,
            s[6] ?? 0
          ]);
          continue;
        }
        if (A === "springs" && s.length >= 3) {
          o.springs.push({
            node: s[0],
            dof: s[1],
            k: s[2]
          });
          continue;
        }
      }
      if (A === "supports" && /^\d/.test(t[0])) {
        const s = parseInt(t[0], 10), i = t.slice(1).join(" ");
        o.supports.set(s, Oe(i));
        continue;
      }
      A && !/^[\-\d]/.test(t[0]) && (A = null);
      try {
        switch (_) {
          case "node":
          case "n": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2]), a = parseFloat(t[3]), r = parseFloat(t[4]);
            !isFinite(s) || !isFinite(i) || !isFinite(a) || !isFinite(r) ? o.errors.push(`L${R + 1}: node mal formado: ${w}`) : o.nodes.set(s, [
              i,
              a,
              r
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const s = parseInt(t[1], 10), i = parseInt(t[2], 10), a = parseInt(t[3], 10), r = parseFloat(t[4] ?? "25e6"), u = parseFloat(t[5] ?? "0.16"), S = parseFloat(t[6] ?? "0.001"), C = t[7] !== void 0 ? parseFloat(t[7]) : void 0, y = t[8] !== void 0 ? parseFloat(t[8]) : void 0, D = t[9] !== void 0 ? parseFloat(t[9]) : void 0, b = t[10] !== void 0 ? parseFloat(t[10]) : void 0, $ = t[11] !== void 0 ? parseFloat(t[11]) : void 0, T = t[12] !== void 0 ? parseFloat(t[12]) : void 0, q = t.indexOf("#"), E = q >= 0 && t[q + 1] ? t[q + 1] : void 0;
            o.frames.push({
              id: s,
              nI: i,
              nJ: a,
              E: r,
              A: u,
              I: S,
              Iy: C,
              J: y,
              nu: D,
              rho: b,
              D: $,
              B: T,
              sec: E
            });
            break;
          }
          case "cftc": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? ""), a = parseFloat(t[3] ?? ""), r = parseFloat(t[4] ?? "25e6"), u = parseFloat(t[5] ?? "0.2");
            isFinite(s) && i > 0 && a > 0 && a < i / 2 && r > 0 ? o.frameCftc.set(s, {
              D: i,
              t: a,
              Ec: r,
              nuC: isFinite(u) ? u : 0.2
            }) : o.errors.push(`cftc ${t[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? ""), a = parseFloat(t[3] ?? ""), r = parseFloat(t[4] ?? ""), u = parseFloat(t[5] ?? "25e6"), S = parseFloat(t[6] ?? "0.2");
            isFinite(s) && i > 0 && a > 0 && r > 0 && r < Math.min(i, a) / 2 && u > 0 ? o.frameCft.set(s, {
              b: i,
              h: a,
              t: r,
              Ec: u,
              nuC: isFinite(S) ? S : 0.2
            }) : o.errors.push(`cft ${t[1]}: hace falta b h t (m) y Ec (kN/m2), con t < min(b,h)/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0");
            isFinite(s) && isFinite(i) && isFinite(a) && o.frameShearAreas.set(s, [
              i,
              a
            ]);
            break;
          }
          case "release":
          case "rel": {
            const s = parseInt(t[1], 10), i = t.slice(2).map((r) => r.toLowerCase());
            if (!isFinite(s) || i.length === 0) {
              o.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const a = new Array(12).fill(false);
            if (i.length === 2 && i.every((r) => /^(pin|fix|libre|rigido)$/.test(r))) i.forEach((r, u) => {
              (r === "pin" || r === "libre") && (a[u * 6 + 4] = true, a[u * 6 + 5] = true);
            });
            else {
              const r = i.filter((u) => u === "0" || u === "1");
              if (r.length !== 12) {
                o.errors.push(`release ${s}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${r.length}`);
                break;
              }
              for (let u = 0; u < 12; u++) a[u] = r[u] === "1";
            }
            a.some(Boolean) && o.frameReleases.set(s, a);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const s = parseInt(t[1], 10), i = t.slice(2, 10).map((a) => parseInt(a, 10));
            if (!isFinite(s) || i.length !== 8 || i.some((a) => !isFinite(a))) {
              o.errors.push(`hex ${t[1]}: hacen falta 8 nudos`);
              break;
            }
            o.solids.push({
              id: s,
              pts: i,
              E: parseFloat(t[10] ?? "25e6"),
              nu: parseFloat(t[11] ?? "0.2"),
              rho: parseFloat(t[12] ?? "2.45")
            });
            break;
          }
          case "incompatible": {
            const s = (t[1] ?? "1").toLowerCase();
            o.solidIncompatible = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "torsion":
          case "jmod": {
            const s = (t[1] ?? "safe").toLowerCase(), i = s === "safe" ? 0.1 : parseFloat(s);
            o.torsionFactor = isFinite(i) && i > 0 ? i : 1;
            break;
          }
          case "deck":
          case "deckmode": {
            const s = (t[1] ?? "etabs").toLowerCase();
            o.deckEtabs = s === "etabs" || s === "1" || s === "on" || s === "si", o.deckOneWay = t.slice(2).some((i) => /^(oneway|1way|unidireccional)$/i.test(i));
            break;
          }
          case "areaspring":
          case "winkler": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), a = t.slice(3).some((r) => /^(nodal|lumped|sap|etabs)$/i.test(r));
            isFinite(s) && isFinite(i) && i !== 0 ? o.areaSprings.push({
              id: s,
              ks: i,
              nodal: a
            }) : o.errors.push("areaspring: uso areaspring <shellID> <ks> [nodal]");
            break;
          }
          case "edge":
          case "edgeconstraint": {
            const s = (t[1] ?? "etabs").toLowerCase();
            o.edgeEtabs = s === "etabs" || s === "1" || s === "on" || s === "si" || s === "hermite";
            break;
          }
          case "meshcross":
          case "meshatintersections": {
            const s = (t[1] ?? "1").toLowerCase();
            o.meshCross = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "etabsjoint":
          case "etabswalljoint": {
            const s = (t[1] ?? "1").toLowerCase();
            o.etabsWallJoint = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "selfweight":
          case "peso":
          case "sw": {
            const s = parseFloat(t[1] ?? "1");
            o.selfWeight = isFinite(s) ? s : 1;
            break;
          }
          case "endoffset":
          case "offset":
          case "lengthoff": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0");
            if (!isFinite(s) || !isFinite(i) || !isFinite(a)) {
              o.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            o.frameEndOffsets.set(s, [
              i,
              a,
              isFinite(r) ? r : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0");
            isFinite(s) && isFinite(i) && o.frameAngles.set(s, i);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const s = parseInt(t[1], 10), i = [
              parseInt(t[2], 10),
              parseInt(t[3], 10),
              parseInt(t[4], 10),
              parseInt(t[5], 10)
            ], a = parseFloat(t[6] ?? "0.20"), r = parseFloat(t[7] ?? "25e6"), u = t[9] !== void 0 ? parseFloat(t[9]) : void 0, S = u !== void 0 && isFinite(u) ? u : void 0;
            if (o.shells.push({
              id: s,
              pts: i,
              t: a,
              E: r,
              rho: S
            }), t[8] !== void 0) {
              const C = parseFloat(t[8]);
              isFinite(C) && C !== 0 && o.shellLoads.set(s, C);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const s = parseInt(t[1], 10), i = (t[2] ?? "").toLowerCase();
            if (!isFinite(s)) break;
            let a;
            if (i === "thin" || i === "delgada" || i === "kirchhoff" || i === "1" ? a = 1 : (i === "thick" || i === "gruesa" || i === "mindlin" || i === "0") && (a = 0), a === void 0) {
              o.errors.push(`shelltype ${s}: se esperaba thin o thick`);
              break;
            }
            o.shellTypes.set(s, a);
            break;
          }
          case "shellmod": {
            const s = parseInt(t[1], 10);
            if (!isFinite(s)) break;
            const i = t.slice(2).map(parseFloat);
            if (i.length >= 8) o.shellModsDir.set(s, i.slice(0, 8).map((a) => isFinite(a) ? a : 1));
            else {
              const a = i[0], r = i[1];
              o.shellMods.set(s, [
                isFinite(a) ? a : 1,
                isFinite(r) ? r : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const s = t.slice(1).map((b) => parseInt(b, 10));
            if (s.length < 7 || s.some((b) => !isFinite(b))) {
              o.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [i, a, r, u, S, C, y] = s, D = [];
            for (let b = C; b <= y; b++) D.push(b);
            o.areaObjs.push({
              id: i,
              pts: [
                a,
                r,
                u,
                S
              ],
              cells: D
            });
            break;
          }
          case "shellang": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2]);
            if (!isFinite(s) || !isFinite(i)) {
              o.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            o.shellAngles.set(s, i);
            break;
          }
          case "areaload":
          case "qarea": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2]);
            if (!isFinite(s) || !isFinite(i)) {
              o.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            o.shellLoads.set(s, i);
            break;
          }
          case "support":
          case "fix": {
            const s = parseInt(t[1], 10), i = t.slice(2).join(" ");
            o.supports.set(s, Oe(i));
            break;
          }
          case "load":
          case "l": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0"), u = parseFloat(t[5] ?? "0"), S = parseFloat(t[6] ?? "0"), C = parseFloat(t[7] ?? "0");
            o.loads.set(s, [
              i,
              a,
              r,
              u,
              S,
              C
            ]);
            break;
          }
          case "frameload":
          case "fl": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0"), u = o.frameLoads.get(s) ?? [
              0,
              0,
              0
            ];
            o.frameLoads.set(s, [
              u[0] + i,
              u[1] + a,
              u[2] + r
            ]);
            break;
          }
          case "spring": {
            const s = parseInt(t[1], 10), i = (t[2] ?? "uz").toLowerCase(), a = Ae[i] ?? 2, r = parseFloat(t[3] ?? "1000");
            o.springs.push({
              node: s,
              dof: a,
              k: r
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const s = parseInt(t[1], 10), i = parseInt(t[2] ?? "1", 10);
            isFinite(s) && isFinite(i) && i > 0 && o.diaphragms.set(s, i);
            break;
          }
          case "mass": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0");
            Number.isFinite(s) && Number.isFinite(i) ? o.masses.set(s, (o.masses.get(s) ?? 0) + i) : o.errors.push(`L${R + 1}: mass necesita <nudo> <toneladas>`);
            break;
          }
          case "solve":
          case "run":
          case "analyze": {
            o.doSolve = true;
            break;
          }
          case "reset":
          case "clear":
            o.nodes.clear(), o.frames.length = 0, o.shells.length = 0, o.solids.length = 0, o.supports.clear(), o.loads.clear(), o.frameLoads.clear(), o.springs.length = 0, o.masses.clear(), o.diaphragms.clear();
            break;
          default:
            o.errors.push(`L${R + 1}: comando desconocido "${_}"`);
        }
      } catch (s) {
        o.errors.push(`L${R + 1}: error "${w}" \u2014 ${s.message}`);
      }
    }
    return o;
  };
  const Ue = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
# Ejemplo: p\xF3rtico 2D con carga lateral

# \u2500\u2500 Nodos (ID  X  Y  Z) \u2500\u2500
node 1   0   0   0
node 2   0   0   3
node 3   5   0   3
node 4   5   0   0

# \u2500\u2500 Apoyos \u2500\u2500
support 1 fixed
support 4 fixed

# \u2500\u2500 Frames (ID  nI  nJ  E  A  I) \u2500\u2500
# E=25e6 kN/m\xB2, A=0.16 m\xB2, I=0.0021 m\u2074 (col 0.40\xD70.40)
frame 1  1 2  25e6  0.16  0.0021
frame 2  2 3  25e6  0.15  0.0028
frame 3  3 4  25e6  0.16  0.0021

# \u2500\u2500 Cargas (ID  FX  FY  FZ  MX  MY  MZ) \u2500\u2500
load 2  10  0  -50  0  0  0
load 3  10  0  -50  0  0  0

solve
`, N = (f, o) => [
    f[0] - o[0],
    f[1] - o[1],
    f[2] - o[2]
  ], le = (f, o) => f[0] * o[0] + f[1] * o[1] + f[2] * o[2], pe = (f, o) => [
    f[1] * o[2] - f[2] * o[1],
    f[2] * o[0] - f[0] * o[2],
    f[0] * o[1] - f[1] * o[0]
  ], se = (f) => Math.hypot(f[0], f[1], f[2]), oe = (f, o) => [
    f[0] * o,
    f[1] * o,
    f[2] * o
  ];
  function ze(f, o) {
    const A = f.shellModsDir.get(o);
    return !!A && Math.abs(A[3]) < 1e-12 && Math.abs(A[4]) < 1e-12 && Math.abs(A[5]) < 1e-12;
  }
  function Xe(f, o = 200, A) {
    const c = [
      0,
      1,
      2
    ].map((y) => (f[0][y] + f[1][y] + f[2][y] + f[3][y]) / 4);
    let k = N(f[1], f[0]), X = pe(k, N(f[3], f[0]));
    X = oe(X, 1 / se(X)), k = oe(k, 1 / se(k));
    const L = pe(X, k), R = f.map((y) => [
      le(N(y, c), k),
      le(N(y, c), L)
    ]);
    let w = [
      0,
      1,
      2,
      3
    ];
    if (A) {
      const y = [
        0,
        1,
        2,
        3
      ].map((D) => {
        const b = N(f[(D + 1) % 4], f[D]);
        return Math.abs(le(b, A)) / se(b);
      });
      w = [
        0,
        1,
        2,
        3
      ].sort((D, b) => y[D] - y[b]).slice(0, 2);
    }
    const t = R.map((y) => y[0]), _ = R.map((y) => y[1]), s = Math.min(...t), i = Math.max(...t), a = Math.min(..._), r = Math.max(..._), u = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let S = 0;
    for (let y = 0; y < o; y++) for (let D = 0; D < o; D++) {
      const b = s + (i - s) * (y + 0.5) / o, $ = a + (r - a) * (D + 0.5) / o;
      let T = 0, q = 0;
      for (let J = 0; J < 4; J++) {
        const B = R[J], Q = R[(J + 1) % 4];
        (Q[0] - B[0]) * ($ - B[1]) - (Q[1] - B[1]) * (b - B[0]) >= 0 ? T++ : q++;
      }
      if (T !== 4 && q !== 4) continue;
      let E = w[0], O = 1 / 0;
      for (const J of w) {
        const B = R[J], Q = R[(J + 1) % 4], U = Q[0] - B[0], G = Q[1] - B[1], de = U * U + G * G, ne = Math.max(0, Math.min(1, ((b - B[0]) * U + ($ - B[1]) * G) / de)), H = Math.hypot(b - (B[0] + ne * U), $ - (B[1] + ne * G));
        H < O && (O = H, E = J);
      }
      u[E].pts.push([
        c[0] + b * k[0] + $ * L[0],
        c[1] + b * k[1] + $ * L[1],
        c[2] + b * k[2] + $ * L[2]
      ]), S++;
    }
    const C = 0.5 * se(pe(N(f[2], f[0]), N(f[3], f[1])));
    for (const y of u) y.dA = S ? C / S : 0;
    return u;
  }
  function Ge(f) {
    const A = (a) => f.nodes.get(a), c = [
      ...f.nodes.keys()
    ], k = (a, r, u) => {
      const S = N(r, a), C = se(S), y = oe(S, 1 / C), D = [];
      for (const b of c) {
        if (u.includes(b)) continue;
        const $ = N(A(b), a), T = le($, y);
        T > 1e-6 && T < C - 1e-6 && se(N($, oe(y, T))) < 1e-4 && D.push(T / C);
      }
      return D.sort((b, $) => b - $);
    }, X = (a, r) => {
      const u = [];
      for (const S of a) r.some((C) => Math.abs(S - C) < 1e-5) && !u.some((C) => Math.abs(S - C) < 1e-5) && u.push(S);
      return u;
    }, L = (a) => {
      for (const r of c) if (se(N(A(r), a)) < 1e-4) return r;
    };
    let R = f.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const w = [], t = (a, r) => {
      const u = f.shellModsDir.get(a);
      u && f.shellModsDir.set(r, [
        ...u
      ]);
      const S = f.shellMods.get(a);
      S && f.shellMods.set(r, [
        ...S
      ]);
      const C = f.shellLoads.get(a);
      C !== void 0 && f.shellLoads.set(r, C);
      const y = f.shellTypes.get(a);
      y !== void 0 && f.shellTypes.set(r, y);
      const D = f.shellAngles.get(a);
      D !== void 0 && f.shellAngles.set(r, D);
    };
    for (const a of f.shells) {
      if (!ze(f, a.id) || a.pts.length !== 4 || a.pts.some((E) => !f.nodes.has(E))) {
        w.push(a);
        continue;
      }
      const r = a.pts.map(A), u = k(r[0], r[1], a.pts), S = k(r[2], r[3], a.pts).map((E) => 1 - E), C = k(r[1], r[2], a.pts), y = k(r[3], r[0], a.pts).map((E) => 1 - E);
      let D = [
        0,
        ...X(u, S),
        1
      ], b = [
        0,
        ...X(C, y),
        1
      ];
      if (D.length === 2 && b.length === 2) {
        w.push(a);
        continue;
      }
      const $ = (E, O) => [
        0,
        1,
        2
      ].map((J) => (1 - E) * (1 - O) * r[0][J] + E * (1 - O) * r[1][J] + E * O * r[2][J] + (1 - E) * O * r[3][J]);
      let T = b.map((E) => D.map((O) => L($(O, E))));
      if (T.some((E) => E.some((O) => O === void 0)) && (D.length >= b.length ? b = [
        0,
        1
      ] : D = [
        0,
        1
      ], T = b.map((E) => D.map((O) => L($(O, E)))), T.some((E) => E.some((O) => O === void 0)))) {
        w.push(a);
        continue;
      }
      let q = true;
      for (let E = 0; E < b.length - 1; E++) for (let O = 0; O < D.length - 1; O++) {
        const J = [
          T[E][O],
          T[E][O + 1],
          T[E + 1][O + 1],
          T[E + 1][O]
        ], B = q ? a.id : R++;
        q || t(a.id, B), q = false, w.push({
          id: B,
          pts: J,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    f.shells = w;
    const _ = 9.80665, s = (a, r) => {
      const u = f.loads.get(a) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      f.loads.set(a, [
        u[0] + r[0],
        u[1] + r[1],
        u[2] + r[2],
        u[3] + r[3],
        u[4] + r[4],
        u[5] + r[5]
      ]);
    }, i = (a, r) => {
      const u = N(r, a), S = se(u), C = oe(u, 1 / S);
      return f.frames.filter((y) => [
        y.nI,
        y.nJ
      ].every((D) => {
        const b = f.nodes.get(D);
        if (!b) return false;
        const $ = N(b, a), T = le($, C);
        return T > -1e-4 && T < S + 1e-4 && se(N($, oe(C, T))) < 1e-4;
      }));
    };
    for (const a of f.shells) {
      if (!ze(f, a.id) || a.pts.length !== 4) continue;
      const r = f.selfWeight ? (a.rho ?? 2.45) * a.t * _ * f.selfWeight : 0, u = f.shellLoads.get(a.id) ?? 0, S = -r + u;
      if (Math.abs(S) < 1e-15) continue;
      const C = a.pts.map(A);
      let y;
      if (f.deckOneWay) {
        const b = N(C[1], C[0]);
        let $ = pe(b, N(C[3], C[0]));
        $ = oe($, 1 / se($));
        const T = oe(b, 1 / se(b)), q = pe($, T), E = (f.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        y = [
          0,
          1,
          2
        ].map((O) => Math.cos(E) * T[O] + Math.sin(E) * q[O]);
      }
      const D = Xe(C, 200, y);
      for (let b = 0; b < 4; b++) {
        const { pts: $, dA: T } = D[b];
        if (!$.length) continue;
        const q = C[b], E = C[(b + 1) % 4], O = i(q, E);
        if (!O.length) {
          const G = S * T * $.length;
          s(a.pts[b], [
            0,
            0,
            G / 2,
            0,
            0,
            0
          ]), s(a.pts[(b + 1) % 4], [
            0,
            0,
            G / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const J = N(E, q), B = se(J), Q = oe(J, 1 / B), U = $.map((G) => le(N(G, q), Q));
        for (const G of O) {
          const de = A(G.nI), ne = A(G.nJ), H = le(N(de, q), Q), he = le(N(ne, q), Q), ee = Math.min(H, he), P = Math.max(H, he), te = P - ee;
          if (te < 1e-9) continue;
          const ue = P >= B - 1e-6, Ie = oe(N(ne, de), 1 / te), ae = pe(Ie, [
            0,
            0,
            1
          ]);
          let me = 0, ce = 0, ge = 0, ie = 0;
          for (const l of U) {
            if (l < ee - 1e-9 || (ue ? l > P + 1e-9 : l >= P - 1e-9)) continue;
            let p = l - ee;
            H > he && (p = te - p);
            const n = p / te;
            me += 1 - 3 * n * n + 2 * n * n * n, ce += te * (n - 2 * n * n + n * n * n), ge += 3 * n * n - 2 * n * n * n, ie += te * (-n * n + n * n * n);
          }
          const e = S * T;
          s(G.nI, [
            0,
            0,
            e * me,
            ae[0] * e * ce,
            ae[1] * e * ce,
            ae[2] * e * ce
          ]), s(G.nJ, [
            0,
            0,
            e * ge,
            ae[0] * e * ie,
            ae[1] * e * ie,
            ae[2] * e * ie
          ]);
        }
      }
      f.deckTributario.add(a.id), f.shellLoads.delete(a.id);
    }
  }
  Ke = {
    id: "cli-modeler",
    name: "CLI Modeler (comandos)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [],
    params: {},
    build(f, o) {
      var _a, _b;
      const A = window.__hekatanCliScript ?? Ue;
      window.__hekatanCliLastScript = A;
      const c = _e(A);
      c.deckEtabs && Ge(c);
      const k = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), L = [], R = Array.from(c.nodes.keys()).sort((e, l) => e - l);
      for (const e of R) k.set(e, L.length), L.push(c.nodes.get(e));
      const w = [], t = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
      for (const e of c.frames) {
        const l = k.get(e.nI), p = k.get(e.nJ);
        if (l === void 0 || p === void 0) {
          const M = R.length ? `IDs disponibles: ${R.join(", ")}` : "ning\xFAn nodo definido", W = [];
          l === void 0 && W.push(e.nI), p === void 0 && W.push(e.nJ), c.errors.push(`frame ${e.id}: nodo(s) inexistente(s) [${W.join(", ")}] \u2014 ${M}`);
          continue;
        }
        const n = w.length;
        w.push([
          l,
          p
        ]);
        const F = e.nu ?? 0.2;
        t.set(n, e.E), _.set(n, e.E / (2 * (1 + F))), s.set(n, e.A), i.set(n, e.I), a.set(n, e.Iy ?? e.I), r.set(n, e.J ?? 0.14 * Math.pow(Math.sqrt(e.A), 4)), u.set(n, e.rho ?? 2.45), J.set(n, F), e.D !== void 0 && isFinite(e.D) && S.set(n, e.D), e.B !== void 0 && isFinite(e.B) && C.set(n, e.B);
        const g = c.frameAngles.get(e.id);
        g !== void 0 && isFinite(g) && D.set(n, g);
        const h = c.frameReleases.get(e.id);
        h && b.set(n, h);
        const d = c.frameEndOffsets.get(e.id);
        d && $.set(n, d);
        const m = c.frameLoads.get(e.id);
        m && q.set(n, m);
        const x = c.frameShearAreas.get(e.id);
        if (x && (O.set(n, x[0]), E.set(n, x[1])), e.sec || e.D !== void 0 && e.B !== void 0) {
          const M = {
            type: "general"
          };
          e.sec && (M.name = e.sec), e.D !== void 0 && isFinite(e.D) && (M.h = e.D), e.B !== void 0 && isFinite(e.B) && (M.b = e.B), y.set(n, M);
        }
        const I = c.frameCftc.get(e.id);
        if (I) {
          const M = We(I.D, I.t, e.E, F, I.Ec, I.nuC);
          s.set(n, M.A), a.set(n, M.Iz), i.set(n, M.Iy), r.set(n, M.J), O.set(n, M.As2), E.set(n, M.As3), S.set(n, I.D), C.set(n, I.D), y.set(n, {
            type: "CFT",
            d: I.D,
            tw: I.t,
            fillE: I.Ec,
            name: e.sec ?? `CFTC ${Math.round(I.D * 1e3)}X${Math.round(I.t * 1e3)}`
          });
        }
        const v = c.frameCft.get(e.id);
        if (v) {
          const M = je(v.b, v.h, v.t, e.E, F, v.Ec, v.nuC);
          s.set(n, M.A), a.set(n, M.Iz), i.set(n, M.Iy), r.set(n, M.J), O.set(n, M.As2), E.set(n, M.As3), S.set(n, v.h), C.set(n, v.b), y.set(n, {
            type: "CFT",
            b: v.b,
            h: v.h,
            tw: v.t,
            fillE: v.Ec,
            name: e.sec ?? `CFT ${Math.round(v.h * 1e3)}X${Math.round(v.b * 1e3)}X${Math.round(v.t * 1e3)}`
          });
        }
      }
      if (c.meshCross) {
        const e = (h, d) => h[0] * d[0] + h[1] * d[1] + h[2] * d[2], l = [
          t,
          _,
          s,
          i,
          a,
          r,
          u,
          J,
          S,
          C,
          D,
          E,
          O,
          y,
          q
        ], p = (h, d) => {
          for (const m of l) m.has(h) && m.set(d, m.get(h));
        }, n = (h) => {
          for (let d = 0; d < L.length; d++) if (Math.hypot(L[d][0] - h[0], L[d][1] - h[1], L[d][2] - h[2]) < 1e-6) return d;
          return L.push([
            h[0],
            h[1],
            h[2]
          ]), L.length - 1;
        }, F = (h) => {
          const d = L[h[0]], m = L[h[1]];
          return [
            Math.min(d[0], m[0]),
            Math.min(d[1], m[1]),
            Math.min(d[2], m[2]),
            Math.max(d[0], m[0]),
            Math.max(d[1], m[1]),
            Math.max(d[2], m[2])
          ];
        };
        let g = 0;
        for (let h = 0; h < w.length; h++) {
          if (w[h].length !== 2) continue;
          const d = F(w[h]);
          for (let m = h + 1; m < w.length; m++) {
            if (w[m].length !== 2) continue;
            const [x, I] = w[h], [v, M] = w[m];
            if (x === v || x === M || I === v || I === M) continue;
            const W = F(w[m]);
            if (d[0] > W[3] + 1e-6 || W[0] > d[3] + 1e-6 || d[1] > W[4] + 1e-6 || W[1] > d[4] + 1e-6 || d[2] > W[5] + 1e-6 || W[2] > d[5] + 1e-6) continue;
            const z = L[x], Z = L[I], j = L[v], V = L[M], Y = [
              Z[0] - z[0],
              Z[1] - z[1],
              Z[2] - z[2]
            ], K = [
              V[0] - j[0],
              V[1] - j[1],
              V[2] - j[2]
            ], re = [
              z[0] - j[0],
              z[1] - j[1],
              z[2] - j[2]
            ], xe = e(Y, Y), ve = e(Y, K), ke = e(K, K), Se = e(Y, re), $e = e(K, re), ye = xe * ke - ve * ve;
            if (ye < 1e-10 * xe * ke) continue;
            const Me = (ve * $e - ke * Se) / ye, be = (xe * $e - ve * Se) / ye;
            if (Me < 1e-6 || Me > 1 - 1e-6 || be < 1e-6 || be > 1 - 1e-6) continue;
            const we = [
              z[0] + Me * Y[0],
              z[1] + Me * Y[1],
              z[2] + Me * Y[2]
            ], Le = [
              j[0] + be * K[0],
              j[1] + be * K[1],
              j[2] + be * K[2]
            ];
            if (Math.hypot(we[0] - Le[0], we[1] - Le[1], we[2] - Le[2]) > 1e-6) continue;
            const De = n(we);
            for (const fe of [
              h,
              m
            ]) {
              const [Te, Je] = w[fe], Ee = w.length;
              w[fe] = [
                Te,
                De
              ], w.push([
                De,
                Je
              ]), p(fe, Ee);
              const Ce = b.get(fe);
              Ce && (b.set(fe, [
                ...Ce.slice(0, 6),
                ...Array(6).fill(false)
              ]), b.set(Ee, [
                ...Array(6).fill(false),
                ...Ce.slice(6)
              ]));
              const Fe = $.get(fe);
              Fe && ($.set(fe, [
                Fe[0],
                0,
                Fe[2]
              ]), $.set(Ee, [
                0,
                Fe[1],
                Fe[2]
              ]));
            }
            g++;
          }
        }
        g > 0 && console.log(`[CLI Modeler] ${g} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const e of c.shells) {
        const l = e.pts.map((F) => k.get(F));
        if (l.some((F) => F === void 0)) {
          c.errors.push(`shell ${e.id}: algun nodo inexistente`);
          continue;
        }
        const p = w.length;
        X.set(e.id, p), w.push(l), t.set(p, e.E), _.set(p, e.E / (2 * 1.2)), B.set(p, e.t), u.set(p, e.rho ?? 2.45), J.set(p, 0.2);
        const n = c.shellTypes.get(e.id);
        n !== void 0 && T.set(p, n);
      }
      const Q = /* @__PURE__ */ new Map();
      for (const [e, l] of c.supports.entries()) {
        const p = k.get(e);
        p !== void 0 && Q.set(p, l);
      }
      const U = /* @__PURE__ */ new Map();
      for (const [e, l] of c.loads.entries()) {
        const p = k.get(e);
        p !== void 0 && U.set(p, [
          ...l
        ]);
      }
      const G = /* @__PURE__ */ new Map();
      for (const [e, l] of c.diaphragms.entries()) {
        const p = k.get(e);
        p !== void 0 && G.set(p, l);
      }
      const de = /* @__PURE__ */ new Map();
      for (const [e, l] of c.masses.entries()) {
        const p = k.get(e);
        p !== void 0 && de.set(p, l);
      }
      if (c.frameLoads.size) {
        const e = (l, p) => {
          const n = U.get(l) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          U.set(l, [
            n[0] + p[0],
            n[1] + p[1],
            n[2] + p[2],
            n[3] + p[3],
            n[4] + p[4],
            n[5] + p[5]
          ]);
        };
        for (const [l, p] of c.frameLoads.entries()) {
          const n = c.frames.find((W) => W.id === l);
          if (!n) {
            c.errors.push(`frameload ${l}: no existe esa barra`);
            continue;
          }
          const F = k.get(n.nI), g = k.get(n.nJ);
          if (F === void 0 || g === void 0) continue;
          const h = L[F], d = L[g], m = [
            d[0] - h[0],
            d[1] - h[1],
            d[2] - h[2]
          ], x = Math.hypot(m[0], m[1], m[2]);
          if (x < 1e-9) continue;
          const I = [
            m[0] / x,
            m[1] / x,
            m[2] / x
          ], v = x * x / 12, M = [
            I[1] * p[2] - I[2] * p[1],
            I[2] * p[0] - I[0] * p[2],
            I[0] * p[1] - I[1] * p[0]
          ];
          e(F, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            v * M[0],
            v * M[1],
            v * M[2]
          ]), e(g, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            -v * M[0],
            -v * M[1],
            -v * M[2]
          ]);
        }
      }
      const ne = /* @__PURE__ */ new Map(), H = 1 / Math.sqrt(3), he = [
        [
          -H,
          -H
        ],
        [
          H,
          -H
        ],
        [
          H,
          H
        ],
        [
          -H,
          H
        ]
      ];
      for (const e of c.shells) {
        const l = c.shellLoads.get(e.id);
        if (!l || c.deckTributario.has(e.id)) continue;
        const p = e.pts.map((g) => k.get(g));
        if (p.some((g) => g === void 0)) {
          c.errors.push(`areaload ${e.id}: algun nodo inexistente`);
          continue;
        }
        const n = p.map((g) => L[g]), F = [
          0,
          0,
          0,
          0
        ];
        for (const [g, h] of he) {
          const d = [
            0.25 * (1 - g) * (1 - h),
            0.25 * (1 + g) * (1 - h),
            0.25 * (1 + g) * (1 + h),
            0.25 * (1 - g) * (1 + h)
          ], m = [
            -0.25 * (1 - h),
            0.25 * (1 - h),
            0.25 * (1 + h),
            -0.25 * (1 + h)
          ], x = [
            -0.25 * (1 - g),
            -0.25 * (1 + g),
            0.25 * (1 + g),
            0.25 * (1 - g)
          ], I = [
            0,
            1,
            2
          ].map((z) => m.reduce((Z, j, V) => Z + j * n[V][z], 0)), v = [
            0,
            1,
            2
          ].map((z) => x.reduce((Z, j, V) => Z + j * n[V][z], 0)), M = [
            I[1] * v[2] - I[2] * v[1],
            I[2] * v[0] - I[0] * v[2],
            I[0] * v[1] - I[1] * v[0]
          ], W = Math.hypot(M[0], M[1], M[2]);
          for (let z = 0; z < 4; z++) F[z] += d[z] * l * W;
        }
        for (let g = 0; g < 4; g++) {
          const h = p[g], d = U.get(h) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          d[2] += F[g], U.set(h, d), ne.set(h, (ne.get(h) ?? 0) + F[g]);
        }
      }
      if (c.selfWeight) {
        const l = /* @__PURE__ */ new Set();
        for (const [n, F] of X) c.deckTributario.has(n) && l.add(F);
        const p = (n, F) => {
          const g = U.get(n) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          g[2] += F, U.set(n, g);
        };
        w.forEach((n, F) => {
          const g = u.get(F) ?? 0;
          if (g && !l.has(F)) {
            if (n.length === 2) {
              const h = s.get(F) ?? 0, d = L[n[0]], m = L[n[1]], x = [
                m[0] - d[0],
                m[1] - d[1],
                m[2] - d[2]
              ];
              let I = Math.hypot(x[0], x[1], x[2]);
              const v = $.get(F);
              if (v) {
                const Y = Math.hypot(x[0], x[1]);
                Y > 1e-9 && Math.abs(Math.atan2(Math.abs(x[2]), Y)) * 180 / Math.PI < 20 && (I = Math.max(I - v[0] - v[1], 0));
              }
              const M = Math.hypot(x[0], x[1], x[2]), W = -h * g * 9.80665 * c.selfWeight, z = [
                x[0] / M,
                x[1] / M,
                x[2] / M
              ], Z = I * I / 12, j = [
                z[1] * W,
                -z[0] * W,
                0
              ], V = (Y, K) => {
                const re = U.get(Y) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                U.set(Y, [
                  re[0] + K[0],
                  re[1] + K[1],
                  re[2] + K[2],
                  re[3] + K[3],
                  re[4] + K[4],
                  re[5] + K[5]
                ]);
              };
              V(n[0], [
                0,
                0,
                W * I / 2,
                Z * j[0],
                Z * j[1],
                0
              ]), V(n[1], [
                0,
                0,
                W * I / 2,
                -Z * j[0],
                -Z * j[1],
                0
              ]);
            } else if (n.length === 4) {
              const h = B.get(F) ?? 0, d = n.map((I) => L[I]);
              let m = 0;
              for (let I = 1; I < 3; I++) {
                const v = [
                  d[I][0] - d[0][0],
                  d[I][1] - d[0][1],
                  d[I][2] - d[0][2]
                ], M = [
                  d[I + 1][0] - d[0][0],
                  d[I + 1][1] - d[0][1],
                  d[I + 1][2] - d[0][2]
                ], W = [
                  v[1] * M[2] - v[2] * M[1],
                  v[2] * M[0] - v[0] * M[2],
                  v[0] * M[1] - v[1] * M[0]
                ];
                m += Math.hypot(W[0], W[1], W[2]) / 2;
              }
              const x = m * h * g * 9.80665 * c.selfWeight;
              for (const I of n) p(I, -x / 4);
            }
          }
        });
      }
      const ee = [];
      for (const e of c.springs) {
        const l = k.get(e.node);
        l !== void 0 && ee.push({
          node: l,
          dof: e.dof,
          k: e.k
        });
      }
      for (const e of c.areaSprings) {
        const l = X.get(e.id);
        if (l === void 0) {
          c.errors.push(`areaspring ${e.id}: no existe esa cascara`);
          continue;
        }
        ee.push({
          node: -(l + 1),
          dof: e.nodal ? -3 : -1,
          k: e.ks
        });
      }
      if (c.edgeEtabs) {
        const e = /* @__PURE__ */ new Set(), l = [];
        w.forEach((n, F) => {
          if (n.length === 3 || n.length === 4) {
            l.push(F);
            for (const g of n) e.add(g);
          }
        });
        let p = 0;
        for (const n of l) {
          const F = w[n], g = F.map((d) => L[d]), h = [
            0,
            1,
            2
          ].map((d) => [
            Math.min(...g.map((m) => m[d])),
            Math.max(...g.map((m) => m[d]))
          ]);
          for (let d = 0; d < L.length; d++) {
            if (F.includes(d)) continue;
            const m = L[d];
            if (m[0] < h[0][0] - 1e-6 || m[0] > h[0][1] + 1e-6 || m[1] < h[1][0] - 1e-6 || m[1] > h[1][1] + 1e-6 || m[2] < h[2][0] - 1e-6 || m[2] > h[2][1] + 1e-6) continue;
            let x = false;
            for (let v = 0; v < F.length && !x; v++) {
              const M = g[v], W = g[(v + 1) % F.length], z = [
                W[0] - M[0],
                W[1] - M[1],
                W[2] - M[2]
              ], Z = z[0] * z[0] + z[1] * z[1] + z[2] * z[2];
              if (Z < 1e-24) continue;
              const j = [
                m[0] - M[0],
                m[1] - M[1],
                m[2] - M[2]
              ], V = (j[0] * z[0] + j[1] * z[1] + j[2] * z[2]) / Z;
              if (V <= 1e-6 || V >= 1 - 1e-6) continue;
              const Y = [
                j[0] - V * z[0],
                j[1] - V * z[1],
                j[2] - V * z[2]
              ];
              Math.hypot(Y[0], Y[1], Y[2]) <= 1e-6 * Math.sqrt(Z) && (x = true);
            }
            !x || !w.some((v, M) => M !== n && v.includes(d)) || (ee.push({
              node: -(n + 1),
              dof: -2,
              k: d
            }), p++);
          }
        }
        p && console.log(`[CLI Modeler] edge etabs: ${p} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const P = [];
      for (const e of c.solids) {
        const l = e.pts.map((n) => k.get(n));
        if (l.some((n) => n === void 0)) {
          c.errors.push(`hex ${e.id}: algun nodo inexistente`);
          continue;
        }
        const p = w.length;
        w.push(l), t.set(p, e.E), J.set(p, e.nu), _.set(p, e.E / (2 * (1 + e.nu))), u.set(p, e.rho), P.push(p);
      }
      o.nodes.val = L, o.elements.val = w, o.nodeInputs.val = {
        supports: Q,
        loads: U,
        masses: de,
        diaphragms: G,
        springs: ee
      }, o.springs && (o.springs.val = ee);
      const te = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const e of c.shells) {
        const l = X.get(e.id);
        if (l === void 0) continue;
        const p = c.shellLoads.get(e.id);
        p !== void 0 && ae.set(l, p);
        const n = c.shellAngles.get(e.id);
        n !== void 0 && me.set(l, n);
        const F = c.shellModsDir.get(e.id);
        if (F) {
          Ie.set(l, F), te.set(l, (F[0] + F[1]) / 2), ue.set(l, (F[3] + F[4]) / 2);
          continue;
        }
        const g = c.shellMods.get(e.id);
        g && (te.set(l, g[0]), ue.set(l, g[1]));
      }
      if (o.elementInputs.val = {
        elasticities: t,
        shearModuli: _,
        areas: s,
        momentsOfInertiaY: i,
        momentsOfInertiaZ: a,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([e, l]) => [
          e,
          l * c.torsionFactor
        ])) : r,
        densities: u,
        poissonsRatios: J,
        thicknesses: B,
        membraneModifiers: te,
        bendingModifiers: ue,
        shellModifiers: Ie,
        shellSurfaceLoads: ae,
        shellAngles: me,
        cargaDeArea: ne,
        cantos: S,
        anchos: C,
        sectionShapes: y,
        localAngles: D,
        shearAreasY: E,
        shearAreasZ: O,
        momentReleases: b,
        endOffsets: $,
        plateFormulations: T,
        frameLoads: q,
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((e) => ({
          nodes: e.pts.map((l) => k.get(l)).filter((l) => l !== void 0),
          cells: e.cells.map((l) => X.get(l)).filter((l) => l !== void 0),
          q: e.cells.map((l) => c.shellLoads.get(l)).find((l) => l !== void 0),
          ang: e.cells.map((l) => c.shellAngles.get(l)).find((l) => l !== void 0)
        })).filter((e) => e.nodes.length === 4 && e.cells.length > 0)
      }, c.doSolve && P.length > 0 && P.length === w.length) try {
        const e = t.get(P[0]) ?? 25e6, l = J.get(P[0]) ?? 0.2;
        P.some((h) => Math.abs((t.get(h) ?? e) - e) > 1e-9 * e || Math.abs((J.get(h) ?? l) - l) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const p = /* @__PURE__ */ new Map();
        for (const [h, d] of o.nodeInputs.val.supports ?? []) p.set(h, [
          !!d[0],
          !!d[1],
          !!d[2]
        ]);
        const n = /* @__PURE__ */ new Map();
        for (const [h, d] of o.nodeInputs.val.loads ?? []) n.set(h, [
          d[0] ?? 0,
          d[1] ?? 0,
          d[2] ?? 0
        ]);
        const F = qe({
          nodes: L,
          elements: w,
          E: e,
          nu: l,
          supports: p,
          loads: n,
          incompatible: c.solidIncompatible
        }), g = /* @__PURE__ */ new Map();
        F.displacements.forEach(([h, d, m], x) => g.set(x, [
          h,
          d,
          m,
          0,
          0,
          0
        ])), o.deformOutputs.val = {
          deformations: g,
          reactions: /* @__PURE__ */ new Map()
        }, o.analyzeOutputs.val = {
          solidStress: F.stressPerElement,
          solidVonMises: F.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${w.length} solidos H8, ${L.length} nodos (${F.elapsedMs.toFixed(0)} ms)`);
      } catch (e) {
        c.errors.push(`hex8Solve: ${(e == null ? void 0 : e.message) ?? e}`);
      }
      else if (c.doSolve && L.length && w.length) try {
        o.deformOutputs.val = Re(L, w, o.nodeInputs.val, o.elementInputs.val, ee.length ? ee : void 0);
        try {
          o.analyzeOutputs.val = Ne(L, w, o.elementInputs.val, o.deformOutputs.val);
        } catch (e) {
          console.warn("[CLI Modeler] analyze:", (e == null ? void 0 : e.message) ?? e);
        }
        if (P.length > 0) try {
          const e = o.deformOutputs.val.deformations, l = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
          for (const n of P) {
            const F = w[n], g = F.map((m) => L[m]), h = F.flatMap((m) => {
              const x = e.get(m) ?? [
                0,
                0,
                0
              ];
              return [
                x[0],
                x[1],
                x[2]
              ];
            }), d = Be(g, t.get(n) ?? 25e6, J.get(n) ?? 0.2, h, c.solidIncompatible);
            l.set(n, d.stress), p.set(n, d.vonMises);
          }
          o.analyzeOutputs.val = {
            ...o.analyzeOutputs.val ?? {},
            solidStress: l,
            solidVonMises: p
          };
        } catch (e) {
          console.warn("[CLI Modeler] tensiones de solidos:", (e == null ? void 0 : e.message) ?? e);
        }
        console.log("[CLI Modeler] Solve OK \u2014", w.length, "elementos,", L.length, "nodos");
      } catch (e) {
        c.errors.push(`solve fall\xF3: ${e.message}`);
      }
      if (o.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const e of c.errors) console.warn("  -", e);
      }
      window.__hekatanCliErrors = c.errors;
      let ce = 0, ge = 0;
      const ie = o.deformOutputs.val;
      if ((_a = ie == null ? void 0 : ie.deformations) == null ? void 0 : _a.size) for (const [, e] of ie.deformations) Math.abs(e[2]) > Math.abs(ce) && (ce = e[2]);
      if ((_b = ie == null ? void 0 : ie.reactions) == null ? void 0 : _b.size) for (const [, e] of ie.reactions) ge += e[2] || 0;
      window.__hekatanCliStats = {
        nodes: L.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: Q.size,
        loads: U.size,
        springs: ee.length,
        solved: c.doSolve,
        errors: c.errors.length,
        maxUzMm: +(ce * 1e3).toFixed(3),
        sumRz: +ge.toFixed(1)
      };
    }
  };
});
export {
  __tla,
  Ke as c,
  _e as p
};
