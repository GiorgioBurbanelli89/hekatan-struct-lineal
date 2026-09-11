import { c as Je, a as We } from "./cadSections-DVtTZU6U.js";
import { h as Be, a as Ne, __tla as __tla_0 } from "./h8-CxkkFRzA.js";
import { a as Re } from "./analyze-DgLgRmKg.js";
import { d as qe, __tla as __tla_1 } from "./didacticCpp-CnEP9H1T.js";
let Ke, Xe;
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
  function ze(r) {
    const t = r.toLowerCase().trim();
    if (t === "fixed" || t === "empotrado") return [
      true,
      true,
      true,
      true,
      true,
      true
    ];
    if (t === "pinned" || t === "articulado") return [
      true,
      true,
      true,
      false,
      false,
      false
    ];
    if (t === "roller" || t === "rodillo") return [
      false,
      false,
      true,
      false,
      false,
      false
    ];
    const D = [
      false,
      false,
      false,
      false,
      false,
      false
    ], l = t.split(/[\s,]+/).filter(Boolean);
    if (l.length > 1 && l.length <= 6 && l.every((L) => L === "0" || L === "1")) return l.forEach((L, X) => {
      D[X] = L === "1";
    }), D;
    for (const L of l) Ae[L] !== void 0 && (D[Ae[L]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let L = 0; L < t.length; L++) D[L] = t[L] === "1";
    return D;
  }
  Xe = function(r) {
    const t = {
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
      autoMesh: 0,
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
    let D = null, l = 0, L = 0, X = 0;
    const C = r.split(/\r?\n/);
    for (let R = 0; R < C.length; R++) {
      let F = C[R].trim();
      if (!F || F.startsWith("#") || F.startsWith("//")) continue;
      F = F.replace(/[;]+$/, "");
      const o = F.split(/\s+/), A = o[0].toLowerCase();
      if (A === "nodes" && o.length === 1) {
        D = "nodes";
        continue;
      }
      if ((A === "elements" || A === "frames") && o.length === 1) {
        D = "elements";
        continue;
      }
      if (A === "areas" && o.length === 1) {
        D = "areas";
        continue;
      }
      if (A === "supports" && o.length === 1) {
        D = "supports";
        continue;
      }
      if (A === "loads" && o.length === 1) {
        D = "loads";
        continue;
      }
      if (A === "springs" && o.length === 1) {
        D = "springs";
        continue;
      }
      if (D && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if (D === "nodes" && e.length >= 3) {
          l++, t.nodes.set(l, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (D === "elements" && e.length >= 2) {
          L++, t.frames.push({
            id: L,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (D === "areas" && e.length >= 4) {
          X++, t.shells.push({
            id: X,
            pts: [
              e[0] + 1,
              e[1] + 1,
              e[2] + 1,
              e[3] + 1
            ],
            t: 0.2,
            E: 25e6
          });
          continue;
        }
        if (D === "loads" && e.length >= 4) {
          t.loads.set(e[0], [
            e[1] ?? 0,
            e[2] ?? 0,
            e[3] ?? 0,
            e[4] ?? 0,
            e[5] ?? 0,
            e[6] ?? 0
          ]);
          continue;
        }
        if (D === "springs" && e.length >= 3) {
          t.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if (D === "supports" && /^\d/.test(o[0])) {
        const e = parseInt(o[0], 10), i = o.slice(1).join(" ");
        t.supports.set(e, ze(i));
        continue;
      }
      D && !/^[\-\d]/.test(o[0]) && (D = null);
      try {
        switch (A) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2]), n = parseFloat(o[3]), c = parseFloat(o[4]);
            !isFinite(e) || !isFinite(i) || !isFinite(n) || !isFinite(c) ? t.errors.push(`L${R + 1}: node mal formado: ${F}`) : t.nodes.set(e, [
              i,
              n,
              c
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const e = parseInt(o[1], 10), i = parseInt(o[2], 10), n = parseInt(o[3], 10), c = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.16"), S = parseFloat(o[6] ?? "0.001"), E = o[7] !== void 0 ? parseFloat(o[7]) : void 0, m = o[8] !== void 0 ? parseFloat(o[8]) : void 0, k = o[9] !== void 0 ? parseFloat(o[9]) : void 0, g = o[10] !== void 0 ? parseFloat(o[10]) : void 0, z = o[11] !== void 0 ? parseFloat(o[11]) : void 0, j = o[12] !== void 0 ? parseFloat(o[12]) : void 0, q = o.indexOf("#"), $ = q >= 0 && o[q + 1] ? o[q + 1] : void 0;
            t.frames.push({
              id: e,
              nI: i,
              nJ: n,
              E: c,
              A: h,
              I: S,
              Iy: E,
              J: m,
              nu: k,
              rho: g,
              D: z,
              B: j,
              sec: $
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), c = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.2");
            isFinite(e) && i > 0 && n > 0 && n < i / 2 && c > 0 ? t.frameCftc.set(e, {
              D: i,
              t: n,
              Ec: c,
              nuC: isFinite(h) ? h : 0.2
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), c = parseFloat(o[4] ?? ""), h = parseFloat(o[5] ?? "25e6"), S = parseFloat(o[6] ?? "0.2");
            isFinite(e) && i > 0 && n > 0 && c > 0 && c < Math.min(i, n) / 2 && h > 0 ? t.frameCft.set(e, {
              b: i,
              h: n,
              t: c,
              Ec: h,
              nuC: isFinite(S) ? S : 0.2
            }) : t.errors.push(`cft ${o[1]}: hace falta b h t (m) y Ec (kN/m2), con t < min(b,h)/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0");
            isFinite(e) && isFinite(i) && isFinite(n) && t.frameShearAreas.set(e, [
              i,
              n
            ]);
            break;
          }
          case "release":
          case "rel": {
            const e = parseInt(o[1], 10), i = o.slice(2).map((c) => c.toLowerCase());
            if (!isFinite(e) || i.length === 0) {
              t.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const n = new Array(12).fill(false);
            if (i.length === 2 && i.every((c) => /^(pin|fix|libre|rigido)$/.test(c))) i.forEach((c, h) => {
              (c === "pin" || c === "libre") && (n[h * 6 + 4] = true, n[h * 6 + 5] = true);
            });
            else {
              const c = i.filter((h) => h === "0" || h === "1");
              if (c.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${c.length}`);
                break;
              }
              for (let h = 0; h < 12; h++) n[h] = c[h] === "1";
            }
            n.some(Boolean) && t.frameReleases.set(e, n);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const e = parseInt(o[1], 10), i = o.slice(2, 10).map((n) => parseInt(n, 10));
            if (!isFinite(e) || i.length !== 8 || i.some((n) => !isFinite(n))) {
              t.errors.push(`hex ${o[1]}: hacen falta 8 nudos`);
              break;
            }
            t.solids.push({
              id: e,
              pts: i,
              E: parseFloat(o[10] ?? "25e6"),
              nu: parseFloat(o[11] ?? "0.2"),
              rho: parseFloat(o[12] ?? "2.45")
            });
            break;
          }
          case "incompatible": {
            const e = (o[1] ?? "1").toLowerCase();
            t.solidIncompatible = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "torsion":
          case "jmod": {
            const e = (o[1] ?? "safe").toLowerCase(), i = e === "safe" ? 0.1 : parseFloat(e);
            t.torsionFactor = isFinite(i) && i > 0 ? i : 1;
            break;
          }
          case "deck":
          case "deckmode": {
            const e = (o[1] ?? "etabs").toLowerCase();
            t.deckEtabs = e === "etabs" || e === "1" || e === "on" || e === "si", t.deckOneWay = o.slice(2).some((i) => /^(oneway|1way|unidireccional)$/i.test(i));
            break;
          }
          case "areaspring":
          case "winkler":
          case "springarea":
          case "winklerarea": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? "0"), n = o.slice(3).some((c) => /^(nodal|lumped|sap|etabs)$/i.test(c));
            isFinite(e) && isFinite(i) && i !== 0 ? t.areaSprings.push({
              id: e,
              ks: i,
              nodal: n
            }) : t.errors.push("areaspring: uso areaspring <shellID> <ks> [nodal]");
            break;
          }
          case "edge":
          case "edgeconstraint": {
            const e = (o[1] ?? "etabs").toLowerCase();
            t.edgeEtabs = e === "etabs" || e === "1" || e === "on" || e === "si" || e === "hermite";
            break;
          }
          case "automesh":
          case "automallado": {
            const e = (o[1] ?? "1.25").toLowerCase();
            if (e === "off" || e === "no" || e === "0") {
              t.autoMesh = 0;
              break;
            }
            const i = parseFloat(e);
            t.autoMesh = isFinite(i) && i > 0 ? i : 1.25;
            break;
          }
          case "meshcross":
          case "meshatintersections": {
            const e = (o[1] ?? "1").toLowerCase();
            t.meshCross = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "etabsjoint":
          case "etabswalljoint": {
            const e = (o[1] ?? "1").toLowerCase();
            t.etabsWallJoint = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "selfweight":
          case "peso":
          case "sw": {
            const e = parseFloat(o[1] ?? "1");
            t.selfWeight = isFinite(e) ? e : 1;
            break;
          }
          case "endoffset":
          case "offset":
          case "lengthoff": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0");
            if (!isFinite(e) || !isFinite(i) || !isFinite(n)) {
              t.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            t.frameEndOffsets.set(e, [
              i,
              n,
              isFinite(c) ? c : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? "0");
            isFinite(e) && isFinite(i) && t.frameAngles.set(e, i);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const e = parseInt(o[1], 10), i = [
              parseInt(o[2], 10),
              parseInt(o[3], 10),
              parseInt(o[4], 10),
              parseInt(o[5], 10)
            ], n = parseFloat(o[6] ?? "0.20"), c = parseFloat(o[7] ?? "25e6"), h = o[9] !== void 0 ? parseFloat(o[9]) : void 0, S = h !== void 0 && isFinite(h) ? h : void 0;
            if (t.shells.push({
              id: e,
              pts: i,
              t: n,
              E: c,
              rho: S
            }), o[8] !== void 0) {
              const E = parseFloat(o[8]);
              isFinite(E) && E !== 0 && t.shellLoads.set(e, E);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const e = parseInt(o[1], 10), i = (o[2] ?? "").toLowerCase();
            if (!isFinite(e)) break;
            let n;
            if (i === "thin" || i === "delgada" || i === "kirchhoff" || i === "1" ? n = 1 : (i === "thick" || i === "gruesa" || i === "mindlin" || i === "0") && (n = 0), n === void 0) {
              t.errors.push(`shelltype ${e}: se esperaba thin o thick`);
              break;
            }
            t.shellTypes.set(e, n);
            break;
          }
          case "shellmod": {
            const e = parseInt(o[1], 10);
            if (!isFinite(e)) break;
            const i = o.slice(2).map(parseFloat);
            if (i.length >= 8) t.shellModsDir.set(e, i.slice(0, 8).map((n) => isFinite(n) ? n : 1));
            else {
              const n = i[0], c = i[1];
              t.shellMods.set(e, [
                isFinite(n) ? n : 1,
                isFinite(c) ? c : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const e = o.slice(1).map((g) => parseInt(g, 10));
            if (e.length < 7 || e.some((g) => !isFinite(g))) {
              t.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [i, n, c, h, S, E, m] = e, k = [];
            for (let g = E; g <= m; g++) k.push(g);
            t.areaObjs.push({
              id: i,
              pts: [
                n,
                c,
                h,
                S
              ],
              cells: k
            });
            break;
          }
          case "shellang": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2]);
            if (!isFinite(e) || !isFinite(i)) {
              t.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            t.shellAngles.set(e, i);
            break;
          }
          case "areaload":
          case "qarea": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2]);
            if (!isFinite(e) || !isFinite(i)) {
              t.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            t.shellLoads.set(e, i);
            break;
          }
          case "support":
          case "fix": {
            const e = parseInt(o[1], 10), i = o.slice(2).join(" ");
            t.supports.set(e, ze(i));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), h = parseFloat(o[5] ?? "0"), S = parseFloat(o[6] ?? "0"), E = parseFloat(o[7] ?? "0");
            t.loads.set(e, [
              i,
              n,
              c,
              h,
              S,
              E
            ]);
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), h = t.frameLoads.get(e) ?? [
              0,
              0,
              0
            ];
            t.frameLoads.set(e, [
              h[0] + i,
              h[1] + n,
              h[2] + c
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(o[1], 10), i = (o[2] ?? "uz").toLowerCase(), n = Ae[i] ?? 2, c = parseFloat(o[3] ?? "1000");
            t.springs.push({
              node: e,
              dof: n,
              k: c
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const e = parseInt(o[1], 10), i = parseInt(o[2] ?? "1", 10);
            isFinite(e) && isFinite(i) && i > 0 && t.diaphragms.set(e, i);
            break;
          }
          case "mass": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2] ?? "0");
            Number.isFinite(e) && Number.isFinite(i) ? t.masses.set(e, (t.masses.get(e) ?? 0) + i) : t.errors.push(`L${R + 1}: mass necesita <nudo> <toneladas>`);
            break;
          }
          case "solve":
          case "run":
          case "analyze": {
            t.doSolve = true;
            break;
          }
          case "reset":
          case "clear":
            t.nodes.clear(), t.frames.length = 0, t.shells.length = 0, t.solids.length = 0, t.supports.clear(), t.loads.clear(), t.frameLoads.clear(), t.springs.length = 0, t.masses.clear(), t.diaphragms.clear();
            break;
          default:
            t.errors.push(`L${R + 1}: comando desconocido "${A}"`);
        }
      } catch (e) {
        t.errors.push(`L${R + 1}: error "${F}" \u2014 ${e.message}`);
      }
    }
    return t;
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
`, B = (r, t) => [
    r[0] - t[0],
    r[1] - t[1],
    r[2] - t[2]
  ], le = (r, t) => r[0] * t[0] + r[1] * t[1] + r[2] * t[2], pe = (r, t) => [
    r[1] * t[2] - r[2] * t[1],
    r[2] * t[0] - r[0] * t[2],
    r[0] * t[1] - r[1] * t[0]
  ], Z = (r) => Math.hypot(r[0], r[1], r[2]), oe = (r, t) => [
    r[0] * t,
    r[1] * t,
    r[2] * t
  ];
  function Oe(r, t) {
    const D = r.shellModsDir.get(t);
    return !!D && Math.abs(D[3]) < 1e-12 && Math.abs(D[4]) < 1e-12 && Math.abs(D[5]) < 1e-12;
  }
  function _e(r, t = 200, D) {
    const l = [
      0,
      1,
      2
    ].map((m) => (r[0][m] + r[1][m] + r[2][m] + r[3][m]) / 4);
    let L = B(r[1], r[0]), X = pe(L, B(r[3], r[0]));
    X = oe(X, 1 / Z(X)), L = oe(L, 1 / Z(L));
    const C = pe(X, L), R = r.map((m) => [
      le(B(m, l), L),
      le(B(m, l), C)
    ]);
    let F = [
      0,
      1,
      2,
      3
    ];
    if (D) {
      const m = [
        0,
        1,
        2,
        3
      ].map((k) => {
        const g = B(r[(k + 1) % 4], r[k]);
        return Math.abs(le(g, D)) / Z(g);
      });
      F = [
        0,
        1,
        2,
        3
      ].sort((k, g) => m[k] - m[g]).slice(0, 2);
    }
    const o = R.map((m) => m[0]), A = R.map((m) => m[1]), e = Math.min(...o), i = Math.max(...o), n = Math.min(...A), c = Math.max(...A), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let S = 0;
    for (let m = 0; m < t; m++) for (let k = 0; k < t; k++) {
      const g = e + (i - e) * (m + 0.5) / t, z = n + (c - n) * (k + 0.5) / t;
      let j = 0, q = 0;
      for (let J = 0; J < 4; J++) {
        const U = R[J], P = R[(J + 1) % 4];
        (P[0] - U[0]) * (z - U[1]) - (P[1] - U[1]) * (g - U[0]) >= 0 ? j++ : q++;
      }
      if (j !== 4 && q !== 4) continue;
      let $ = F[0], O = 1 / 0;
      for (const J of F) {
        const U = R[J], P = R[(J + 1) % 4], _ = P[0] - U[0], Y = P[1] - U[1], de = _ * _ + Y * Y, ne = Math.max(0, Math.min(1, ((g - U[0]) * _ + (z - U[1]) * Y) / de)), H = Math.hypot(g - (U[0] + ne * _), z - (U[1] + ne * Y));
        H < O && (O = H, $ = J);
      }
      h[$].pts.push([
        l[0] + g * L[0] + z * C[0],
        l[1] + g * L[1] + z * C[1],
        l[2] + g * L[2] + z * C[2]
      ]), S++;
    }
    const E = 0.5 * Z(pe(B(r[2], r[0]), B(r[3], r[1])));
    for (const m of h) m.dA = S ? E / S : 0;
    return h;
  }
  function Ye(r, t) {
    if (!(t > 0)) return;
    const D = 1e-6, l = (A) => r.nodes.get(A);
    let L = Math.max(0, ...r.nodes.keys()) + 1, X = r.shells.reduce((A, e) => Math.max(A, e.id), 0) + 1;
    const C = (A) => {
      for (const [i, n] of r.nodes) if (Z(B(n, A)) < D) return i;
      const e = L++;
      return r.nodes.set(e, [
        A[0],
        A[1],
        A[2]
      ]), e;
    }, R = (A, e) => {
      const i = r.shellModsDir.get(A);
      i && r.shellModsDir.set(e, [
        ...i
      ]);
      const n = r.shellMods.get(A);
      n && r.shellMods.set(e, [
        ...n
      ]);
      const c = r.shellLoads.get(A);
      c !== void 0 && r.shellLoads.set(e, c);
      const h = r.shellTypes.get(A);
      h !== void 0 && r.shellTypes.set(e, h);
      const S = r.shellAngles.get(A);
      S !== void 0 && r.shellAngles.set(e, S);
    }, F = [];
    let o = 0;
    for (const A of r.shells) {
      if (A.pts.length !== 4) {
        F.push(A);
        continue;
      }
      const e = A.pts.map(l);
      if (e.some((m) => !m)) {
        F.push(A);
        continue;
      }
      const i = (Z(B(e[1], e[0])) + Z(B(e[2], e[3]))) / 2, n = (Z(B(e[3], e[0])) + Z(B(e[2], e[1]))) / 2, c = Math.max(1, Math.ceil(i / t - 1e-9)), h = Math.max(1, Math.ceil(n / t - 1e-9));
      if (c === 1 && h === 1) {
        F.push(A);
        continue;
      }
      const S = (m, k) => [
        0,
        1,
        2
      ].map((g) => e[0][g] * (1 - m) * (1 - k) + e[1][g] * m * (1 - k) + e[2][g] * m * k + e[3][g] * (1 - m) * k), E = [];
      for (let m = 0; m <= c; m++) {
        const k = [];
        for (let g = 0; g <= h; g++) k.push(C(S(m / c, g / h)));
        E.push(k);
      }
      for (let m = 0; m < c; m++) for (let k = 0; k < h; k++) {
        const g = m === 0 && k === 0 ? A.id : X++;
        F.push({
          ...A,
          id: g,
          pts: [
            E[m][k],
            E[m + 1][k],
            E[m + 1][k + 1],
            E[m][k + 1]
          ]
        }), g !== A.id && R(A.id, g);
      }
      o++;
    }
    o && (r.shells = F, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${r.shells.length} cascaras, ${r.nodes.size} nudos`));
  }
  function Ge(r) {
    const D = (n) => r.nodes.get(n), l = [
      ...r.nodes.keys()
    ], L = (n, c, h) => {
      const S = B(c, n), E = Z(S), m = oe(S, 1 / E), k = [];
      for (const g of l) {
        if (h.includes(g)) continue;
        const z = B(D(g), n), j = le(z, m);
        j > 1e-6 && j < E - 1e-6 && Z(B(z, oe(m, j))) < 1e-4 && k.push(j / E);
      }
      return k.sort((g, z) => g - z);
    }, X = (n, c) => {
      const h = [];
      for (const S of n) c.some((E) => Math.abs(S - E) < 1e-5) && !h.some((E) => Math.abs(S - E) < 1e-5) && h.push(S);
      return h;
    }, C = (n) => {
      for (const c of l) if (Z(B(D(c), n)) < 1e-4) return c;
    };
    let R = r.shells.reduce((n, c) => Math.max(n, c.id), 0) + 1;
    const F = [], o = (n, c) => {
      const h = r.shellModsDir.get(n);
      h && r.shellModsDir.set(c, [
        ...h
      ]);
      const S = r.shellMods.get(n);
      S && r.shellMods.set(c, [
        ...S
      ]);
      const E = r.shellLoads.get(n);
      E !== void 0 && r.shellLoads.set(c, E);
      const m = r.shellTypes.get(n);
      m !== void 0 && r.shellTypes.set(c, m);
      const k = r.shellAngles.get(n);
      k !== void 0 && r.shellAngles.set(c, k);
    };
    for (const n of r.shells) {
      if (!Oe(r, n.id) || n.pts.length !== 4 || n.pts.some(($) => !r.nodes.has($))) {
        F.push(n);
        continue;
      }
      const c = n.pts.map(D), h = L(c[0], c[1], n.pts), S = L(c[2], c[3], n.pts).map(($) => 1 - $), E = L(c[1], c[2], n.pts), m = L(c[3], c[0], n.pts).map(($) => 1 - $);
      let k = [
        0,
        ...X(h, S),
        1
      ], g = [
        0,
        ...X(E, m),
        1
      ];
      if (k.length === 2 && g.length === 2) {
        F.push(n);
        continue;
      }
      const z = ($, O) => [
        0,
        1,
        2
      ].map((J) => (1 - $) * (1 - O) * c[0][J] + $ * (1 - O) * c[1][J] + $ * O * c[2][J] + (1 - $) * O * c[3][J]);
      let j = g.map(($) => k.map((O) => C(z(O, $))));
      if (j.some(($) => $.some((O) => O === void 0)) && (k.length >= g.length ? g = [
        0,
        1
      ] : k = [
        0,
        1
      ], j = g.map(($) => k.map((O) => C(z(O, $)))), j.some(($) => $.some((O) => O === void 0)))) {
        F.push(n);
        continue;
      }
      let q = true;
      for (let $ = 0; $ < g.length - 1; $++) for (let O = 0; O < k.length - 1; O++) {
        const J = [
          j[$][O],
          j[$][O + 1],
          j[$ + 1][O + 1],
          j[$ + 1][O]
        ], U = q ? n.id : R++;
        q || o(n.id, U), q = false, F.push({
          id: U,
          pts: J,
          t: n.t,
          E: n.E,
          rho: n.rho
        });
      }
    }
    r.shells = F;
    const A = 9.80665, e = (n, c) => {
      const h = r.loads.get(n) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      r.loads.set(n, [
        h[0] + c[0],
        h[1] + c[1],
        h[2] + c[2],
        h[3] + c[3],
        h[4] + c[4],
        h[5] + c[5]
      ]);
    }, i = (n, c) => {
      const h = B(c, n), S = Z(h), E = oe(h, 1 / S);
      return r.frames.filter((m) => [
        m.nI,
        m.nJ
      ].every((k) => {
        const g = r.nodes.get(k);
        if (!g) return false;
        const z = B(g, n), j = le(z, E);
        return j > -1e-4 && j < S + 1e-4 && Z(B(z, oe(E, j))) < 1e-4;
      }));
    };
    for (const n of r.shells) {
      if (!Oe(r, n.id) || n.pts.length !== 4) continue;
      const c = r.selfWeight ? (n.rho ?? 2.45) * n.t * A * r.selfWeight : 0, h = r.shellLoads.get(n.id) ?? 0, S = -c + h;
      if (Math.abs(S) < 1e-15) continue;
      const E = n.pts.map(D);
      let m;
      if (r.deckOneWay) {
        const g = B(E[1], E[0]);
        let z = pe(g, B(E[3], E[0]));
        z = oe(z, 1 / Z(z));
        const j = oe(g, 1 / Z(g)), q = pe(z, j), $ = (r.shellAngles.get(n.id) ?? 0) * Math.PI / 180;
        m = [
          0,
          1,
          2
        ].map((O) => Math.cos($) * j[O] + Math.sin($) * q[O]);
      }
      const k = _e(E, 200, m);
      for (let g = 0; g < 4; g++) {
        const { pts: z, dA: j } = k[g];
        if (!z.length) continue;
        const q = E[g], $ = E[(g + 1) % 4], O = i(q, $);
        if (!O.length) {
          const Y = S * j * z.length;
          e(n.pts[g], [
            0,
            0,
            Y / 2,
            0,
            0,
            0
          ]), e(n.pts[(g + 1) % 4], [
            0,
            0,
            Y / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const J = B($, q), U = Z(J), P = oe(J, 1 / U), _ = z.map((Y) => le(B(Y, q), P));
        for (const Y of O) {
          const de = D(Y.nI), ne = D(Y.nJ), H = le(B(de, q), P), he = le(B(ne, q), P), se = Math.min(H, he), ee = Math.max(H, he), te = ee - se;
          if (te < 1e-9) continue;
          const ue = ee >= U - 1e-6, Ie = oe(B(ne, de), 1 / te), ae = pe(Ie, [
            0,
            0,
            1
          ]);
          let ge = 0, ce = 0, me = 0, ie = 0;
          for (const d of _) {
            if (d < se - 1e-9 || (ue ? d > ee + 1e-9 : d >= ee - 1e-9)) continue;
            let p = d - se;
            H > he && (p = te - p);
            const a = p / te;
            ge += 1 - 3 * a * a + 2 * a * a * a, ce += te * (a - 2 * a * a + a * a * a), me += 3 * a * a - 2 * a * a * a, ie += te * (-a * a + a * a * a);
          }
          const s = S * j;
          e(Y.nI, [
            0,
            0,
            s * ge,
            ae[0] * s * ce,
            ae[1] * s * ce,
            ae[2] * s * ce
          ]), e(Y.nJ, [
            0,
            0,
            s * me,
            ae[0] * s * ie,
            ae[1] * s * ie,
            ae[2] * s * ie
          ]);
        }
      }
      r.deckTributario.add(n.id), r.shellLoads.delete(n.id);
    }
  }
  Ke = {
    id: "cli-modeler",
    name: "CLI Modeler (comandos)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "pressure",
      "displacementZ",
      "vonMises",
      "bendingXX",
      "bendingYY",
      "membraneXX"
    ],
    params: {},
    build(r, t) {
      var _a, _b;
      const D = window.__hekatanCliScript ?? Ue;
      window.__hekatanCliLastScript = D;
      const l = Xe(D);
      l.autoMesh > 0 && Ye(l, l.autoMesh), l.deckEtabs && Ge(l);
      const L = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), C = [], R = Array.from(l.nodes.keys()).sort((s, d) => s - d);
      for (const s of R) L.set(s, C.length), C.push(l.nodes.get(s));
      const F = [], o = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map();
      for (const s of l.frames) {
        const d = L.get(s.nI), p = L.get(s.nJ);
        if (d === void 0 || p === void 0) {
          const w = R.length ? `IDs disponibles: ${R.join(", ")}` : "ning\xFAn nodo definido", W = [];
          d === void 0 && W.push(s.nI), p === void 0 && W.push(s.nJ), l.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${W.join(", ")}] \u2014 ${w}`);
          continue;
        }
        const a = F.length;
        F.push([
          d,
          p
        ]);
        const v = s.nu ?? 0.2;
        o.set(a, s.E), A.set(a, s.E / (2 * (1 + v))), e.set(a, s.A), i.set(a, s.I), n.set(a, s.Iy ?? s.I), c.set(a, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), h.set(a, s.rho ?? 2.45), J.set(a, v), s.D !== void 0 && isFinite(s.D) && S.set(a, s.D), s.B !== void 0 && isFinite(s.B) && E.set(a, s.B);
        const M = l.frameAngles.get(s.id);
        M !== void 0 && isFinite(M) && k.set(a, M);
        const u = l.frameReleases.get(s.id);
        u && g.set(a, u);
        const f = l.frameEndOffsets.get(s.id);
        f && z.set(a, f);
        const b = l.frameLoads.get(s.id);
        b && q.set(a, b);
        const y = l.frameShearAreas.get(s.id);
        if (y && (O.set(a, y[0]), $.set(a, y[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const w = {
            type: "general"
          };
          s.sec && (w.name = s.sec), s.D !== void 0 && isFinite(s.D) && (w.h = s.D), s.B !== void 0 && isFinite(s.B) && (w.b = s.B), m.set(a, w);
        }
        const x = l.frameCftc.get(s.id);
        if (x) {
          const w = Je(x.D, x.t, s.E, v, x.Ec, x.nuC);
          e.set(a, w.A), n.set(a, w.Iz), i.set(a, w.Iy), c.set(a, w.J), O.set(a, w.As2), $.set(a, w.As3), S.set(a, x.D), E.set(a, x.D), m.set(a, {
            type: "CFT",
            d: x.D,
            tw: x.t,
            fillE: x.Ec,
            name: s.sec ?? `CFTC ${Math.round(x.D * 1e3)}X${Math.round(x.t * 1e3)}`
          });
        }
        const I = l.frameCft.get(s.id);
        if (I) {
          const w = We(I.b, I.h, I.t, s.E, v, I.Ec, I.nuC);
          e.set(a, w.A), n.set(a, w.Iz), i.set(a, w.Iy), c.set(a, w.J), O.set(a, w.As2), $.set(a, w.As3), S.set(a, I.h), E.set(a, I.b), m.set(a, {
            type: "CFT",
            b: I.b,
            h: I.h,
            tw: I.t,
            fillE: I.Ec,
            name: s.sec ?? `CFT ${Math.round(I.h * 1e3)}X${Math.round(I.b * 1e3)}X${Math.round(I.t * 1e3)}`
          });
        }
      }
      if (l.meshCross) {
        const s = (u, f) => u[0] * f[0] + u[1] * f[1] + u[2] * f[2], d = [
          o,
          A,
          e,
          i,
          n,
          c,
          h,
          J,
          S,
          E,
          k,
          $,
          O,
          m,
          q
        ], p = (u, f) => {
          for (const b of d) b.has(u) && b.set(f, b.get(u));
        }, a = (u) => {
          for (let f = 0; f < C.length; f++) if (Math.hypot(C[f][0] - u[0], C[f][1] - u[1], C[f][2] - u[2]) < 1e-6) return f;
          return C.push([
            u[0],
            u[1],
            u[2]
          ]), C.length - 1;
        }, v = (u) => {
          const f = C[u[0]], b = C[u[1]];
          return [
            Math.min(f[0], b[0]),
            Math.min(f[1], b[1]),
            Math.min(f[2], b[2]),
            Math.max(f[0], b[0]),
            Math.max(f[1], b[1]),
            Math.max(f[2], b[2])
          ];
        };
        let M = 0;
        for (let u = 0; u < F.length; u++) {
          if (F[u].length !== 2) continue;
          const f = v(F[u]);
          for (let b = u + 1; b < F.length; b++) {
            if (F[b].length !== 2) continue;
            const [y, x] = F[u], [I, w] = F[b];
            if (y === I || y === w || x === I || x === w) continue;
            const W = v(F[b]);
            if (f[0] > W[3] + 1e-6 || W[0] > f[3] + 1e-6 || f[1] > W[4] + 1e-6 || W[1] > f[4] + 1e-6 || f[2] > W[5] + 1e-6 || W[2] > f[5] + 1e-6) continue;
            const T = C[y], V = C[x], N = C[I], Q = C[w], G = [
              V[0] - T[0],
              V[1] - T[1],
              V[2] - T[2]
            ], K = [
              Q[0] - N[0],
              Q[1] - N[1],
              Q[2] - N[2]
            ], re = [
              T[0] - N[0],
              T[1] - N[1],
              T[2] - N[2]
            ], xe = s(G, G), ve = s(G, K), ke = s(K, K), Se = s(G, re), $e = s(K, re), ye = xe * ke - ve * ve;
            if (ye < 1e-10 * xe * ke) continue;
            const Me = (ve * $e - ke * Se) / ye, be = (xe * $e - ve * Se) / ye;
            if (Me < 1e-6 || Me > 1 - 1e-6 || be < 1e-6 || be > 1 - 1e-6) continue;
            const we = [
              T[0] + Me * G[0],
              T[1] + Me * G[1],
              T[2] + Me * G[2]
            ], Le = [
              N[0] + be * K[0],
              N[1] + be * K[1],
              N[2] + be * K[2]
            ];
            if (Math.hypot(we[0] - Le[0], we[1] - Le[1], we[2] - Le[2]) > 1e-6) continue;
            const De = a(we);
            for (const fe of [
              u,
              b
            ]) {
              const [Te, je] = F[fe], Ee = F.length;
              F[fe] = [
                Te,
                De
              ], F.push([
                De,
                je
              ]), p(fe, Ee);
              const Ce = g.get(fe);
              Ce && (g.set(fe, [
                ...Ce.slice(0, 6),
                ...Array(6).fill(false)
              ]), g.set(Ee, [
                ...Array(6).fill(false),
                ...Ce.slice(6)
              ]));
              const Fe = z.get(fe);
              Fe && (z.set(fe, [
                Fe[0],
                0,
                Fe[2]
              ]), z.set(Ee, [
                0,
                Fe[1],
                Fe[2]
              ]));
            }
            M++;
          }
        }
        M > 0 && console.log(`[CLI Modeler] ${M} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of l.shells) {
        const d = s.pts.map((v) => L.get(v));
        if (d.some((v) => v === void 0)) {
          l.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = F.length;
        X.set(s.id, p), F.push(d), o.set(p, s.E), A.set(p, s.E / (2 * 1.2)), U.set(p, s.t), h.set(p, s.rho ?? 2.45), J.set(p, 0.2);
        const a = l.shellTypes.get(s.id);
        a !== void 0 && j.set(p, a);
      }
      const P = /* @__PURE__ */ new Map();
      for (const [s, d] of l.supports.entries()) {
        const p = L.get(s);
        p !== void 0 && P.set(p, d);
      }
      const _ = /* @__PURE__ */ new Map();
      for (const [s, d] of l.loads.entries()) {
        const p = L.get(s);
        p !== void 0 && _.set(p, [
          ...d
        ]);
      }
      const Y = /* @__PURE__ */ new Map();
      for (const [s, d] of l.diaphragms.entries()) {
        const p = L.get(s);
        p !== void 0 && Y.set(p, d);
      }
      const de = /* @__PURE__ */ new Map();
      for (const [s, d] of l.masses.entries()) {
        const p = L.get(s);
        p !== void 0 && de.set(p, d);
      }
      if (l.frameLoads.size) {
        const s = (d, p) => {
          const a = _.get(d) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          _.set(d, [
            a[0] + p[0],
            a[1] + p[1],
            a[2] + p[2],
            a[3] + p[3],
            a[4] + p[4],
            a[5] + p[5]
          ]);
        };
        for (const [d, p] of l.frameLoads.entries()) {
          const a = l.frames.find((W) => W.id === d);
          if (!a) {
            l.errors.push(`frameload ${d}: no existe esa barra`);
            continue;
          }
          const v = L.get(a.nI), M = L.get(a.nJ);
          if (v === void 0 || M === void 0) continue;
          const u = C[v], f = C[M], b = [
            f[0] - u[0],
            f[1] - u[1],
            f[2] - u[2]
          ], y = Math.hypot(b[0], b[1], b[2]);
          if (y < 1e-9) continue;
          const x = [
            b[0] / y,
            b[1] / y,
            b[2] / y
          ], I = y * y / 12, w = [
            x[1] * p[2] - x[2] * p[1],
            x[2] * p[0] - x[0] * p[2],
            x[0] * p[1] - x[1] * p[0]
          ];
          s(v, [
            p[0] * y / 2,
            p[1] * y / 2,
            p[2] * y / 2,
            I * w[0],
            I * w[1],
            I * w[2]
          ]), s(M, [
            p[0] * y / 2,
            p[1] * y / 2,
            p[2] * y / 2,
            -I * w[0],
            -I * w[1],
            -I * w[2]
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
      for (const s of l.shells) {
        const d = l.shellLoads.get(s.id);
        if (!d || l.deckTributario.has(s.id)) continue;
        const p = s.pts.map((M) => L.get(M));
        if (p.some((M) => M === void 0)) {
          l.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const a = p.map((M) => C[M]), v = [
          0,
          0,
          0,
          0
        ];
        for (const [M, u] of he) {
          const f = [
            0.25 * (1 - M) * (1 - u),
            0.25 * (1 + M) * (1 - u),
            0.25 * (1 + M) * (1 + u),
            0.25 * (1 - M) * (1 + u)
          ], b = [
            -0.25 * (1 - u),
            0.25 * (1 - u),
            0.25 * (1 + u),
            -0.25 * (1 + u)
          ], y = [
            -0.25 * (1 - M),
            -0.25 * (1 + M),
            0.25 * (1 + M),
            0.25 * (1 - M)
          ], x = [
            0,
            1,
            2
          ].map((T) => b.reduce((V, N, Q) => V + N * a[Q][T], 0)), I = [
            0,
            1,
            2
          ].map((T) => y.reduce((V, N, Q) => V + N * a[Q][T], 0)), w = [
            x[1] * I[2] - x[2] * I[1],
            x[2] * I[0] - x[0] * I[2],
            x[0] * I[1] - x[1] * I[0]
          ], W = Math.hypot(w[0], w[1], w[2]);
          for (let T = 0; T < 4; T++) v[T] += f[T] * d * W;
        }
        for (let M = 0; M < 4; M++) {
          const u = p[M], f = _.get(u) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          f[2] += v[M], _.set(u, f), ne.set(u, (ne.get(u) ?? 0) + v[M]);
        }
      }
      if (l.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [a, v] of X) l.deckTributario.has(a) && d.add(v);
        const p = (a, v) => {
          const M = _.get(a) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          M[2] += v, _.set(a, M);
        };
        F.forEach((a, v) => {
          const M = h.get(v) ?? 0;
          if (M && !d.has(v)) {
            if (a.length === 2) {
              const u = e.get(v) ?? 0, f = C[a[0]], b = C[a[1]], y = [
                b[0] - f[0],
                b[1] - f[1],
                b[2] - f[2]
              ];
              let x = Math.hypot(y[0], y[1], y[2]);
              const I = z.get(v);
              if (I) {
                const G = Math.hypot(y[0], y[1]);
                G > 1e-9 && Math.abs(Math.atan2(Math.abs(y[2]), G)) * 180 / Math.PI < 20 && (x = Math.max(x - I[0] - I[1], 0));
              }
              const w = Math.hypot(y[0], y[1], y[2]), W = -u * M * 9.80665 * l.selfWeight, T = [
                y[0] / w,
                y[1] / w,
                y[2] / w
              ], V = x * x / 12, N = [
                T[1] * W,
                -T[0] * W,
                0
              ], Q = (G, K) => {
                const re = _.get(G) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                _.set(G, [
                  re[0] + K[0],
                  re[1] + K[1],
                  re[2] + K[2],
                  re[3] + K[3],
                  re[4] + K[4],
                  re[5] + K[5]
                ]);
              };
              Q(a[0], [
                0,
                0,
                W * x / 2,
                V * N[0],
                V * N[1],
                0
              ]), Q(a[1], [
                0,
                0,
                W * x / 2,
                -V * N[0],
                -V * N[1],
                0
              ]);
            } else if (a.length === 4) {
              const u = U.get(v) ?? 0, f = a.map((x) => C[x]);
              let b = 0;
              for (let x = 1; x < 3; x++) {
                const I = [
                  f[x][0] - f[0][0],
                  f[x][1] - f[0][1],
                  f[x][2] - f[0][2]
                ], w = [
                  f[x + 1][0] - f[0][0],
                  f[x + 1][1] - f[0][1],
                  f[x + 1][2] - f[0][2]
                ], W = [
                  I[1] * w[2] - I[2] * w[1],
                  I[2] * w[0] - I[0] * w[2],
                  I[0] * w[1] - I[1] * w[0]
                ];
                b += Math.hypot(W[0], W[1], W[2]) / 2;
              }
              const y = b * u * M * 9.80665 * l.selfWeight;
              for (const x of a) p(x, -y / 4);
            }
          }
        });
      }
      const se = [];
      for (const s of l.springs) {
        const d = L.get(s.node);
        d !== void 0 && se.push({
          node: d,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of l.areaSprings) {
        const d = X.get(s.id);
        if (d === void 0) {
          l.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        se.push({
          node: -(d + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (l.edgeEtabs) {
        const s = /* @__PURE__ */ new Set(), d = [];
        F.forEach((a, v) => {
          if (a.length === 3 || a.length === 4) {
            d.push(v);
            for (const M of a) s.add(M);
          }
        });
        let p = 0;
        for (const a of d) {
          const v = F[a], M = v.map((f) => C[f]), u = [
            0,
            1,
            2
          ].map((f) => [
            Math.min(...M.map((b) => b[f])),
            Math.max(...M.map((b) => b[f]))
          ]);
          for (let f = 0; f < C.length; f++) {
            if (v.includes(f)) continue;
            const b = C[f];
            if (b[0] < u[0][0] - 1e-6 || b[0] > u[0][1] + 1e-6 || b[1] < u[1][0] - 1e-6 || b[1] > u[1][1] + 1e-6 || b[2] < u[2][0] - 1e-6 || b[2] > u[2][1] + 1e-6) continue;
            let y = false;
            for (let I = 0; I < v.length && !y; I++) {
              const w = M[I], W = M[(I + 1) % v.length], T = [
                W[0] - w[0],
                W[1] - w[1],
                W[2] - w[2]
              ], V = T[0] * T[0] + T[1] * T[1] + T[2] * T[2];
              if (V < 1e-24) continue;
              const N = [
                b[0] - w[0],
                b[1] - w[1],
                b[2] - w[2]
              ], Q = (N[0] * T[0] + N[1] * T[1] + N[2] * T[2]) / V;
              if (Q <= 1e-6 || Q >= 1 - 1e-6) continue;
              const G = [
                N[0] - Q * T[0],
                N[1] - Q * T[1],
                N[2] - Q * T[2]
              ];
              Math.hypot(G[0], G[1], G[2]) <= 1e-6 * Math.sqrt(V) && (y = true);
            }
            !y || !F.some((I, w) => w !== a && I.includes(f)) || (se.push({
              node: -(a + 1),
              dof: -2,
              k: f
            }), p++);
          }
        }
        p && console.log(`[CLI Modeler] edge etabs: ${p} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const ee = [];
      for (const s of l.solids) {
        const d = s.pts.map((a) => L.get(a));
        if (d.some((a) => a === void 0)) {
          l.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = F.length;
        F.push(d), o.set(p, s.E), J.set(p, s.nu), A.set(p, s.E / (2 * (1 + s.nu))), h.set(p, s.rho), ee.push(p);
      }
      t.nodes.val = C, t.elements.val = F, t.nodeInputs.val = {
        supports: P,
        loads: _,
        masses: de,
        diaphragms: Y,
        springs: se
      }, t.springs && (t.springs.val = se);
      const te = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map();
      for (const s of l.shells) {
        const d = X.get(s.id);
        if (d === void 0) continue;
        const p = l.shellLoads.get(s.id);
        p !== void 0 && ae.set(d, p);
        const a = l.shellAngles.get(s.id);
        a !== void 0 && ge.set(d, a);
        const v = l.shellModsDir.get(s.id);
        if (v) {
          Ie.set(d, v), te.set(d, (v[0] + v[1]) / 2), ue.set(d, (v[3] + v[4]) / 2);
          continue;
        }
        const M = l.shellMods.get(s.id);
        M && (te.set(d, M[0]), ue.set(d, M[1]));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: A,
        areas: e,
        momentsOfInertiaY: i,
        momentsOfInertiaZ: n,
        torsionalConstants: l.torsionFactor !== 1 ? new Map([
          ...c
        ].map(([s, d]) => [
          s,
          d * l.torsionFactor
        ])) : c,
        densities: h,
        poissonsRatios: J,
        thicknesses: U,
        membraneModifiers: te,
        bendingModifiers: ue,
        shellModifiers: Ie,
        shellSurfaceLoads: ae,
        shellAngles: ge,
        cargaDeArea: ne,
        cantos: S,
        anchos: E,
        sectionShapes: m,
        localAngles: k,
        shearAreasY: $,
        shearAreasZ: O,
        momentReleases: g,
        endOffsets: z,
        plateFormulations: j,
        frameLoads: q,
        meshAtIntersections: l.meshCross,
        solidIncompatible: l.solidIncompatible,
        selfWeight: l.selfWeight,
        etabsWallJoint: l.etabsWallJoint,
        areaObjects: l.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => L.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => X.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => l.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => l.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, l.doSolve && ee.length > 0 && ee.length === F.length) try {
        const s = o.get(ee[0]) ?? 25e6, d = J.get(ee[0]) ?? 0.2;
        ee.some((u) => Math.abs((o.get(u) ?? s) - s) > 1e-9 * s || Math.abs((J.get(u) ?? d) - d) > 1e-12) && l.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const p = /* @__PURE__ */ new Map();
        for (const [u, f] of t.nodeInputs.val.supports ?? []) p.set(u, [
          !!f[0],
          !!f[1],
          !!f[2]
        ]);
        const a = /* @__PURE__ */ new Map();
        for (const [u, f] of t.nodeInputs.val.loads ?? []) a.set(u, [
          f[0] ?? 0,
          f[1] ?? 0,
          f[2] ?? 0
        ]);
        const v = Be({
          nodes: C,
          elements: F,
          E: s,
          nu: d,
          supports: p,
          loads: a,
          incompatible: l.solidIncompatible
        }), M = /* @__PURE__ */ new Map();
        v.displacements.forEach(([u, f, b], y) => M.set(y, [
          u,
          f,
          b,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: M,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: v.stressPerElement,
          solidVonMises: v.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${F.length} solidos H8, ${C.length} nodos (${v.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        l.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (l.doSolve && C.length && F.length) try {
        t.deformOutputs.val = qe(C, F, t.nodeInputs.val, t.elementInputs.val, se.length ? se : void 0);
        try {
          t.analyzeOutputs.val = Re(C, F, t.elementInputs.val, t.deformOutputs.val);
        } catch (s) {
          console.warn("[CLI Modeler] analyze:", (s == null ? void 0 : s.message) ?? s);
        }
        if (l.areaSprings.length > 0) try {
          const s = t.deformOutputs.val.deformations, d = t.analyzeOutputs.val ?? {}, p = d.pressure instanceof Map ? d.pressure : /* @__PURE__ */ new Map();
          let a = 0, v = 0;
          for (const M of l.areaSprings) {
            const u = X.get(M.id);
            if (u === void 0) continue;
            const b = F[u].map((y) => {
              var _a2;
              const x = ((_a2 = s.get(y)) == null ? void 0 : _a2[2]) ?? 0, I = M.ks * x;
              return I < a && (a = I), I > v && (v = I), I;
            });
            p.set(u, b);
          }
          p.size > 0 && (d.pressure = p, d.colorMapRanges = {
            ...d.colorMapRanges ?? {},
            pressure: [
              v,
              a
            ]
          }, t.analyzeOutputs.val = d, console.log(`[CLI Modeler] presi\xF3n Winkler: ${p.size} shells, \u03C3 ${a.toFixed(0)}..${v.toFixed(0)} kN/m\xB2`));
        } catch (s) {
          console.warn("[CLI Modeler] presi\xF3n:", (s == null ? void 0 : s.message) ?? s);
        }
        if (ee.length > 0) try {
          const s = t.deformOutputs.val.deformations, d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
          for (const a of ee) {
            const v = F[a], M = v.map((b) => C[b]), u = v.flatMap((b) => {
              const y = s.get(b) ?? [
                0,
                0,
                0
              ];
              return [
                y[0],
                y[1],
                y[2]
              ];
            }), f = Ne(M, o.get(a) ?? 25e6, J.get(a) ?? 0.2, u, l.solidIncompatible);
            d.set(a, f.stress), p.set(a, f.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: d,
            solidVonMises: p
          };
        } catch (s) {
          console.warn("[CLI Modeler] tensiones de solidos:", (s == null ? void 0 : s.message) ?? s);
        }
        console.log("[CLI Modeler] Solve OK \u2014", F.length, "elementos,", C.length, "nodos");
      } catch (s) {
        l.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (t.objects3D.val = [], l.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of l.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = l.errors;
      let ce = 0, me = 0;
      const ie = t.deformOutputs.val;
      if ((_a = ie == null ? void 0 : ie.deformations) == null ? void 0 : _a.size) for (const [, s] of ie.deformations) Math.abs(s[2]) > Math.abs(ce) && (ce = s[2]);
      if ((_b = ie == null ? void 0 : ie.reactions) == null ? void 0 : _b.size) for (const [, s] of ie.reactions) me += s[2] || 0;
      window.__hekatanCliStats = {
        nodes: C.length,
        frames: l.frames.length,
        shells: l.shells.length,
        supports: P.size,
        loads: _.size,
        springs: se.length,
        solved: l.doSolve,
        errors: l.errors.length,
        maxUzMm: +(ce * 1e3).toFixed(3),
        sumRz: +me.toFixed(1)
      };
    }
  };
});
export {
  __tla,
  Ke as c,
  Xe as p
};
