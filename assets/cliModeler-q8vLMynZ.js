import { c as Je, a as We } from "./cadSections-DVtTZU6U.js";
import { h as Be, a as qe, __tla as __tla_0 } from "./h8-CxkkFRzA.js";
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
  function Oe(r) {
    const o = r.toLowerCase().trim();
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
    const D = [
      false,
      false,
      false,
      false,
      false,
      false
    ], l = o.split(/[\s,]+/).filter(Boolean);
    if (l.length > 1 && l.length <= 6 && l.every((y) => y === "0" || y === "1")) return l.forEach((y, U) => {
      D[U] = y === "1";
    }), D;
    for (const y of l) Ae[y] !== void 0 && (D[Ae[y]] = true);
    if (/^[01]+$/.test(o) && o.length <= 6) for (let y = 0; y < o.length; y++) D[y] = o[y] === "1";
    return D;
  }
  _e = function(r) {
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
    let D = null, l = 0, y = 0, U = 0;
    const C = r.split(/\r?\n/);
    for (let N = 0; N < C.length; N++) {
      let M = C[N].trim();
      if (!M || M.startsWith("#") || M.startsWith("//")) continue;
      M = M.replace(/[;]+$/, "");
      const t = M.split(/\s+/), A = t[0].toLowerCase();
      if (A === "nodes" && t.length === 1) {
        D = "nodes";
        continue;
      }
      if ((A === "elements" || A === "frames") && t.length === 1) {
        D = "elements";
        continue;
      }
      if (A === "areas" && t.length === 1) {
        D = "areas";
        continue;
      }
      if (A === "supports" && t.length === 1) {
        D = "supports";
        continue;
      }
      if (A === "loads" && t.length === 1) {
        D = "loads";
        continue;
      }
      if (A === "springs" && t.length === 1) {
        D = "springs";
        continue;
      }
      if (D && /^[\-\d]/.test(t[0])) {
        const e = t.map(parseFloat);
        if (D === "nodes" && e.length >= 3) {
          l++, o.nodes.set(l, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (D === "elements" && e.length >= 2) {
          y++, o.frames.push({
            id: y,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (D === "areas" && e.length >= 4) {
          U++, o.shells.push({
            id: U,
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
          o.loads.set(e[0], [
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
          o.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if (D === "supports" && /^\d/.test(t[0])) {
        const e = parseInt(t[0], 10), i = t.slice(1).join(" ");
        o.supports.set(e, Oe(i));
        continue;
      }
      D && !/^[\-\d]/.test(t[0]) && (D = null);
      try {
        switch (A) {
          case "node":
          case "n": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2]), n = parseFloat(t[3]), c = parseFloat(t[4]);
            !isFinite(e) || !isFinite(i) || !isFinite(n) || !isFinite(c) ? o.errors.push(`L${N + 1}: node mal formado: ${M}`) : o.nodes.set(e, [
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
            const e = parseInt(t[1], 10), i = parseInt(t[2], 10), n = parseInt(t[3], 10), c = parseFloat(t[4] ?? "25e6"), h = parseFloat(t[5] ?? "0.16"), S = parseFloat(t[6] ?? "0.001"), L = t[7] !== void 0 ? parseFloat(t[7]) : void 0, m = t[8] !== void 0 ? parseFloat(t[8]) : void 0, k = t[9] !== void 0 ? parseFloat(t[9]) : void 0, u = t[10] !== void 0 ? parseFloat(t[10]) : void 0, O = t[11] !== void 0 ? parseFloat(t[11]) : void 0, j = t[12] !== void 0 ? parseFloat(t[12]) : void 0, R = t.indexOf("#"), $ = R >= 0 && t[R + 1] ? t[R + 1] : void 0;
            o.frames.push({
              id: e,
              nI: i,
              nJ: n,
              E: c,
              A: h,
              I: S,
              Iy: L,
              J: m,
              nu: k,
              rho: u,
              D: O,
              B: j,
              sec: $
            });
            break;
          }
          case "cftc": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? ""), n = parseFloat(t[3] ?? ""), c = parseFloat(t[4] ?? "25e6"), h = parseFloat(t[5] ?? "0.2");
            isFinite(e) && i > 0 && n > 0 && n < i / 2 && c > 0 ? o.frameCftc.set(e, {
              D: i,
              t: n,
              Ec: c,
              nuC: isFinite(h) ? h : 0.2
            }) : o.errors.push(`cftc ${t[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? ""), n = parseFloat(t[3] ?? ""), c = parseFloat(t[4] ?? ""), h = parseFloat(t[5] ?? "25e6"), S = parseFloat(t[6] ?? "0.2");
            isFinite(e) && i > 0 && n > 0 && c > 0 && c < Math.min(i, n) / 2 && h > 0 ? o.frameCft.set(e, {
              b: i,
              h: n,
              t: c,
              Ec: h,
              nuC: isFinite(S) ? S : 0.2
            }) : o.errors.push(`cft ${t[1]}: hace falta b h t (m) y Ec (kN/m2), con t < min(b,h)/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0");
            isFinite(e) && isFinite(i) && isFinite(n) && o.frameShearAreas.set(e, [
              i,
              n
            ]);
            break;
          }
          case "release":
          case "rel": {
            const e = parseInt(t[1], 10), i = t.slice(2).map((c) => c.toLowerCase());
            if (!isFinite(e) || i.length === 0) {
              o.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const n = new Array(12).fill(false);
            if (i.length === 2 && i.every((c) => /^(pin|fix|libre|rigido)$/.test(c))) i.forEach((c, h) => {
              (c === "pin" || c === "libre") && (n[h * 6 + 4] = true, n[h * 6 + 5] = true);
            });
            else {
              const c = i.filter((h) => h === "0" || h === "1");
              if (c.length !== 12) {
                o.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${c.length}`);
                break;
              }
              for (let h = 0; h < 12; h++) n[h] = c[h] === "1";
            }
            n.some(Boolean) && o.frameReleases.set(e, n);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const e = parseInt(t[1], 10), i = t.slice(2, 10).map((n) => parseInt(n, 10));
            if (!isFinite(e) || i.length !== 8 || i.some((n) => !isFinite(n))) {
              o.errors.push(`hex ${t[1]}: hacen falta 8 nudos`);
              break;
            }
            o.solids.push({
              id: e,
              pts: i,
              E: parseFloat(t[10] ?? "25e6"),
              nu: parseFloat(t[11] ?? "0.2"),
              rho: parseFloat(t[12] ?? "2.45")
            });
            break;
          }
          case "incompatible": {
            const e = (t[1] ?? "1").toLowerCase();
            o.solidIncompatible = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "torsion":
          case "jmod": {
            const e = (t[1] ?? "safe").toLowerCase(), i = e === "safe" ? 0.1 : parseFloat(e);
            o.torsionFactor = isFinite(i) && i > 0 ? i : 1;
            break;
          }
          case "deck":
          case "deckmode": {
            const e = (t[1] ?? "etabs").toLowerCase();
            o.deckEtabs = e === "etabs" || e === "1" || e === "on" || e === "si", o.deckOneWay = t.slice(2).some((i) => /^(oneway|1way|unidireccional)$/i.test(i));
            break;
          }
          case "areaspring":
          case "winkler":
          case "springarea":
          case "winklerarea": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = t.slice(3).some((c) => /^(nodal|lumped|sap|etabs)$/i.test(c));
            isFinite(e) && isFinite(i) && i !== 0 ? o.areaSprings.push({
              id: e,
              ks: i,
              nodal: n
            }) : o.errors.push("areaspring: uso areaspring <shellID> <ks> [nodal]");
            break;
          }
          case "edge":
          case "edgeconstraint": {
            const e = (t[1] ?? "etabs").toLowerCase();
            o.edgeEtabs = e === "etabs" || e === "1" || e === "on" || e === "si" || e === "hermite";
            break;
          }
          case "automesh":
          case "automallado": {
            const e = (t[1] ?? "1.25").toLowerCase();
            if (e === "off" || e === "no" || e === "0") {
              o.autoMesh = 0;
              break;
            }
            const i = parseFloat(e);
            o.autoMesh = isFinite(i) && i > 0 ? i : 1.25;
            break;
          }
          case "meshcross":
          case "meshatintersections": {
            const e = (t[1] ?? "1").toLowerCase();
            o.meshCross = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "etabsjoint":
          case "etabswalljoint": {
            const e = (t[1] ?? "1").toLowerCase();
            o.etabsWallJoint = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "selfweight":
          case "peso":
          case "sw": {
            const e = parseFloat(t[1] ?? "1");
            o.selfWeight = isFinite(e) ? e : 1;
            break;
          }
          case "endoffset":
          case "offset":
          case "lengthoff": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0"), c = parseFloat(t[4] ?? "0");
            if (!isFinite(e) || !isFinite(i) || !isFinite(n)) {
              o.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            o.frameEndOffsets.set(e, [
              i,
              n,
              isFinite(c) ? c : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0");
            isFinite(e) && isFinite(i) && o.frameAngles.set(e, i);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const e = parseInt(t[1], 10), i = [
              parseInt(t[2], 10),
              parseInt(t[3], 10),
              parseInt(t[4], 10),
              parseInt(t[5], 10)
            ], n = parseFloat(t[6] ?? "0.20"), c = parseFloat(t[7] ?? "25e6"), h = t[9] !== void 0 ? parseFloat(t[9]) : void 0, S = h !== void 0 && isFinite(h) ? h : void 0;
            if (o.shells.push({
              id: e,
              pts: i,
              t: n,
              E: c,
              rho: S
            }), t[8] !== void 0) {
              const L = parseFloat(t[8]);
              isFinite(L) && L !== 0 && o.shellLoads.set(e, L);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const e = parseInt(t[1], 10), i = (t[2] ?? "").toLowerCase();
            if (!isFinite(e)) break;
            let n;
            if (i === "thin" || i === "delgada" || i === "kirchhoff" || i === "1" ? n = 1 : (i === "thick" || i === "gruesa" || i === "mindlin" || i === "0") && (n = 0), n === void 0) {
              o.errors.push(`shelltype ${e}: se esperaba thin o thick`);
              break;
            }
            o.shellTypes.set(e, n);
            break;
          }
          case "shellmod": {
            const e = parseInt(t[1], 10);
            if (!isFinite(e)) break;
            const i = t.slice(2).map(parseFloat);
            if (i.length >= 8) o.shellModsDir.set(e, i.slice(0, 8).map((n) => isFinite(n) ? n : 1));
            else {
              const n = i[0], c = i[1];
              o.shellMods.set(e, [
                isFinite(n) ? n : 1,
                isFinite(c) ? c : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const e = t.slice(1).map((u) => parseInt(u, 10));
            if (e.length < 7 || e.some((u) => !isFinite(u))) {
              o.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [i, n, c, h, S, L, m] = e, k = [];
            for (let u = L; u <= m; u++) k.push(u);
            o.areaObjs.push({
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
            const e = parseInt(t[1], 10), i = parseFloat(t[2]);
            if (!isFinite(e) || !isFinite(i)) {
              o.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            o.shellAngles.set(e, i);
            break;
          }
          case "areaload":
          case "qarea": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2]);
            if (!isFinite(e) || !isFinite(i)) {
              o.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            o.shellLoads.set(e, i);
            break;
          }
          case "support":
          case "fix": {
            const e = parseInt(t[1], 10), i = t.slice(2).join(" ");
            o.supports.set(e, Oe(i));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0"), c = parseFloat(t[4] ?? "0"), h = parseFloat(t[5] ?? "0"), S = parseFloat(t[6] ?? "0"), L = parseFloat(t[7] ?? "0");
            o.loads.set(e, [
              i,
              n,
              c,
              h,
              S,
              L
            ]);
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0"), c = parseFloat(t[4] ?? "0"), h = o.frameLoads.get(e) ?? [
              0,
              0,
              0
            ];
            o.frameLoads.set(e, [
              h[0] + i,
              h[1] + n,
              h[2] + c
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(t[1], 10), i = (t[2] ?? "uz").toLowerCase(), n = Ae[i] ?? 2, c = parseFloat(t[3] ?? "1000");
            o.springs.push({
              node: e,
              dof: n,
              k: c
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const e = parseInt(t[1], 10), i = parseInt(t[2] ?? "1", 10);
            isFinite(e) && isFinite(i) && i > 0 && o.diaphragms.set(e, i);
            break;
          }
          case "mass": {
            const e = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0");
            Number.isFinite(e) && Number.isFinite(i) ? o.masses.set(e, (o.masses.get(e) ?? 0) + i) : o.errors.push(`L${N + 1}: mass necesita <nudo> <toneladas>`);
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
            o.errors.push(`L${N + 1}: comando desconocido "${A}"`);
        }
      } catch (e) {
        o.errors.push(`L${N + 1}: error "${M}" \u2014 ${e.message}`);
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
`, B = (r, o) => [
    r[0] - o[0],
    r[1] - o[1],
    r[2] - o[2]
  ], le = (r, o) => r[0] * o[0] + r[1] * o[1] + r[2] * o[2], pe = (r, o) => [
    r[1] * o[2] - r[2] * o[1],
    r[2] * o[0] - r[0] * o[2],
    r[0] * o[1] - r[1] * o[0]
  ], Z = (r) => Math.hypot(r[0], r[1], r[2]), oe = (r, o) => [
    r[0] * o,
    r[1] * o,
    r[2] * o
  ];
  function ze(r, o) {
    const D = r.shellModsDir.get(o);
    return !!D && Math.abs(D[3]) < 1e-12 && Math.abs(D[4]) < 1e-12 && Math.abs(D[5]) < 1e-12;
  }
  function Xe(r, o = 200, D) {
    const l = [
      0,
      1,
      2
    ].map((m) => (r[0][m] + r[1][m] + r[2][m] + r[3][m]) / 4);
    let y = B(r[1], r[0]), U = pe(y, B(r[3], r[0]));
    U = oe(U, 1 / Z(U)), y = oe(y, 1 / Z(y));
    const C = pe(U, y), N = r.map((m) => [
      le(B(m, l), y),
      le(B(m, l), C)
    ]);
    let M = [
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
        const u = B(r[(k + 1) % 4], r[k]);
        return Math.abs(le(u, D)) / Z(u);
      });
      M = [
        0,
        1,
        2,
        3
      ].sort((k, u) => m[k] - m[u]).slice(0, 2);
    }
    const t = N.map((m) => m[0]), A = N.map((m) => m[1]), e = Math.min(...t), i = Math.max(...t), n = Math.min(...A), c = Math.max(...A), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let S = 0;
    for (let m = 0; m < o; m++) for (let k = 0; k < o; k++) {
      const u = e + (i - e) * (m + 0.5) / o, O = n + (c - n) * (k + 0.5) / o;
      let j = 0, R = 0;
      for (let J = 0; J < 4; J++) {
        const _ = N[J], P = N[(J + 1) % 4];
        (P[0] - _[0]) * (O - _[1]) - (P[1] - _[1]) * (u - _[0]) >= 0 ? j++ : R++;
      }
      if (j !== 4 && R !== 4) continue;
      let $ = M[0], z = 1 / 0;
      for (const J of M) {
        const _ = N[J], P = N[(J + 1) % 4], X = P[0] - _[0], G = P[1] - _[1], de = X * X + G * G, ne = Math.max(0, Math.min(1, ((u - _[0]) * X + (O - _[1]) * G) / de)), H = Math.hypot(u - (_[0] + ne * X), O - (_[1] + ne * G));
        H < z && (z = H, $ = J);
      }
      h[$].pts.push([
        l[0] + u * y[0] + O * C[0],
        l[1] + u * y[1] + O * C[1],
        l[2] + u * y[2] + O * C[2]
      ]), S++;
    }
    const L = 0.5 * Z(pe(B(r[2], r[0]), B(r[3], r[1])));
    for (const m of h) m.dA = S ? L / S : 0;
    return h;
  }
  function Ge(r, o) {
    if (!(o > 0)) return;
    const D = 1e-6, l = (A) => r.nodes.get(A);
    let y = Math.max(0, ...r.nodes.keys()) + 1, U = r.shells.reduce((A, e) => Math.max(A, e.id), 0) + 1;
    const C = (A) => {
      for (const [i, n] of r.nodes) if (Z(B(n, A)) < D) return i;
      const e = y++;
      return r.nodes.set(e, [
        A[0],
        A[1],
        A[2]
      ]), e;
    }, N = (A, e) => {
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
    }, M = [];
    let t = 0;
    for (const A of r.shells) {
      if (A.pts.length !== 4) {
        M.push(A);
        continue;
      }
      const e = A.pts.map(l);
      if (e.some((m) => !m)) {
        M.push(A);
        continue;
      }
      const i = (Z(B(e[1], e[0])) + Z(B(e[2], e[3]))) / 2, n = (Z(B(e[3], e[0])) + Z(B(e[2], e[1]))) / 2, c = Math.max(1, Math.ceil(i / o - 1e-9)), h = Math.max(1, Math.ceil(n / o - 1e-9));
      if (c === 1 && h === 1) {
        M.push(A);
        continue;
      }
      const S = (m, k) => [
        0,
        1,
        2
      ].map((u) => e[0][u] * (1 - m) * (1 - k) + e[1][u] * m * (1 - k) + e[2][u] * m * k + e[3][u] * (1 - m) * k), L = [];
      for (let m = 0; m <= c; m++) {
        const k = [];
        for (let u = 0; u <= h; u++) k.push(C(S(m / c, u / h)));
        L.push(k);
      }
      for (let m = 0; m < c; m++) for (let k = 0; k < h; k++) {
        const u = m === 0 && k === 0 ? A.id : U++;
        M.push({
          ...A,
          id: u,
          pts: [
            L[m][k],
            L[m + 1][k],
            L[m + 1][k + 1],
            L[m][k + 1]
          ]
        }), u !== A.id && N(A.id, u);
      }
      t++;
    }
    t && (r.shells = M, console.log(`[CLI Modeler] automesh ${o} m: ${t} pano(s) partido(s) -> ${r.shells.length} cascaras, ${r.nodes.size} nudos`));
  }
  function Ye(r) {
    const D = (n) => r.nodes.get(n), l = [
      ...r.nodes.keys()
    ], y = (n, c, h) => {
      const S = B(c, n), L = Z(S), m = oe(S, 1 / L), k = [];
      for (const u of l) {
        if (h.includes(u)) continue;
        const O = B(D(u), n), j = le(O, m);
        j > 1e-6 && j < L - 1e-6 && Z(B(O, oe(m, j))) < 1e-4 && k.push(j / L);
      }
      return k.sort((u, O) => u - O);
    }, U = (n, c) => {
      const h = [];
      for (const S of n) c.some((L) => Math.abs(S - L) < 1e-5) && !h.some((L) => Math.abs(S - L) < 1e-5) && h.push(S);
      return h;
    }, C = (n) => {
      for (const c of l) if (Z(B(D(c), n)) < 1e-4) return c;
    };
    let N = r.shells.reduce((n, c) => Math.max(n, c.id), 0) + 1;
    const M = [], t = (n, c) => {
      const h = r.shellModsDir.get(n);
      h && r.shellModsDir.set(c, [
        ...h
      ]);
      const S = r.shellMods.get(n);
      S && r.shellMods.set(c, [
        ...S
      ]);
      const L = r.shellLoads.get(n);
      L !== void 0 && r.shellLoads.set(c, L);
      const m = r.shellTypes.get(n);
      m !== void 0 && r.shellTypes.set(c, m);
      const k = r.shellAngles.get(n);
      k !== void 0 && r.shellAngles.set(c, k);
    };
    for (const n of r.shells) {
      if (!ze(r, n.id) || n.pts.length !== 4 || n.pts.some(($) => !r.nodes.has($))) {
        M.push(n);
        continue;
      }
      const c = n.pts.map(D), h = y(c[0], c[1], n.pts), S = y(c[2], c[3], n.pts).map(($) => 1 - $), L = y(c[1], c[2], n.pts), m = y(c[3], c[0], n.pts).map(($) => 1 - $);
      let k = [
        0,
        ...U(h, S),
        1
      ], u = [
        0,
        ...U(L, m),
        1
      ];
      if (k.length === 2 && u.length === 2) {
        M.push(n);
        continue;
      }
      const O = ($, z) => [
        0,
        1,
        2
      ].map((J) => (1 - $) * (1 - z) * c[0][J] + $ * (1 - z) * c[1][J] + $ * z * c[2][J] + (1 - $) * z * c[3][J]);
      let j = u.map(($) => k.map((z) => C(O(z, $))));
      if (j.some(($) => $.some((z) => z === void 0)) && (k.length >= u.length ? u = [
        0,
        1
      ] : k = [
        0,
        1
      ], j = u.map(($) => k.map((z) => C(O(z, $)))), j.some(($) => $.some((z) => z === void 0)))) {
        M.push(n);
        continue;
      }
      let R = true;
      for (let $ = 0; $ < u.length - 1; $++) for (let z = 0; z < k.length - 1; z++) {
        const J = [
          j[$][z],
          j[$][z + 1],
          j[$ + 1][z + 1],
          j[$ + 1][z]
        ], _ = R ? n.id : N++;
        R || t(n.id, _), R = false, M.push({
          id: _,
          pts: J,
          t: n.t,
          E: n.E,
          rho: n.rho
        });
      }
    }
    r.shells = M;
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
      const h = B(c, n), S = Z(h), L = oe(h, 1 / S);
      return r.frames.filter((m) => [
        m.nI,
        m.nJ
      ].every((k) => {
        const u = r.nodes.get(k);
        if (!u) return false;
        const O = B(u, n), j = le(O, L);
        return j > -1e-4 && j < S + 1e-4 && Z(B(O, oe(L, j))) < 1e-4;
      }));
    };
    for (const n of r.shells) {
      if (!ze(r, n.id) || n.pts.length !== 4) continue;
      const c = r.selfWeight ? (n.rho ?? 2.45) * n.t * A * r.selfWeight : 0, h = r.shellLoads.get(n.id) ?? 0, S = -c + h;
      if (Math.abs(S) < 1e-15) continue;
      const L = n.pts.map(D);
      let m;
      if (r.deckOneWay) {
        const u = B(L[1], L[0]);
        let O = pe(u, B(L[3], L[0]));
        O = oe(O, 1 / Z(O));
        const j = oe(u, 1 / Z(u)), R = pe(O, j), $ = (r.shellAngles.get(n.id) ?? 0) * Math.PI / 180;
        m = [
          0,
          1,
          2
        ].map((z) => Math.cos($) * j[z] + Math.sin($) * R[z]);
      }
      const k = Xe(L, 200, m);
      for (let u = 0; u < 4; u++) {
        const { pts: O, dA: j } = k[u];
        if (!O.length) continue;
        const R = L[u], $ = L[(u + 1) % 4], z = i(R, $);
        if (!z.length) {
          const G = S * j * O.length;
          e(n.pts[u], [
            0,
            0,
            G / 2,
            0,
            0,
            0
          ]), e(n.pts[(u + 1) % 4], [
            0,
            0,
            G / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const J = B($, R), _ = Z(J), P = oe(J, 1 / _), X = O.map((G) => le(B(G, R), P));
        for (const G of z) {
          const de = D(G.nI), ne = D(G.nJ), H = le(B(de, R), P), he = le(B(ne, R), P), se = Math.min(H, he), ee = Math.max(H, he), te = ee - se;
          if (te < 1e-9) continue;
          const ue = ee >= _ - 1e-6, Ie = oe(B(ne, de), 1 / te), ae = pe(Ie, [
            0,
            0,
            1
          ]);
          let ge = 0, ce = 0, me = 0, ie = 0;
          for (const d of X) {
            if (d < se - 1e-9 || (ue ? d > ee + 1e-9 : d >= ee - 1e-9)) continue;
            let p = d - se;
            H > he && (p = te - p);
            const a = p / te;
            ge += 1 - 3 * a * a + 2 * a * a * a, ce += te * (a - 2 * a * a + a * a * a), me += 3 * a * a - 2 * a * a * a, ie += te * (-a * a + a * a * a);
          }
          const s = S * j;
          e(G.nI, [
            0,
            0,
            s * ge,
            ae[0] * s * ce,
            ae[1] * s * ce,
            ae[2] * s * ce
          ]), e(G.nJ, [
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
    availableShellResults: [],
    params: {},
    build(r, o) {
      var _a, _b;
      const D = window.__hekatanCliScript ?? Ue;
      window.__hekatanCliLastScript = D;
      const l = _e(D);
      l.autoMesh > 0 && Ge(l, l.autoMesh), l.deckEtabs && Ye(l);
      const y = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), C = [], N = Array.from(l.nodes.keys()).sort((s, d) => s - d);
      for (const s of N) y.set(s, C.length), C.push(l.nodes.get(s));
      const M = [], t = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
      for (const s of l.frames) {
        const d = y.get(s.nI), p = y.get(s.nJ);
        if (d === void 0 || p === void 0) {
          const I = N.length ? `IDs disponibles: ${N.join(", ")}` : "ning\xFAn nodo definido", W = [];
          d === void 0 && W.push(s.nI), p === void 0 && W.push(s.nJ), l.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${W.join(", ")}] \u2014 ${I}`);
          continue;
        }
        const a = M.length;
        M.push([
          d,
          p
        ]);
        const v = s.nu ?? 0.2;
        t.set(a, s.E), A.set(a, s.E / (2 * (1 + v))), e.set(a, s.A), i.set(a, s.I), n.set(a, s.Iy ?? s.I), c.set(a, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), h.set(a, s.rho ?? 2.45), J.set(a, v), s.D !== void 0 && isFinite(s.D) && S.set(a, s.D), s.B !== void 0 && isFinite(s.B) && L.set(a, s.B);
        const F = l.frameAngles.get(s.id);
        F !== void 0 && isFinite(F) && k.set(a, F);
        const g = l.frameReleases.get(s.id);
        g && u.set(a, g);
        const f = l.frameEndOffsets.get(s.id);
        f && O.set(a, f);
        const b = l.frameLoads.get(s.id);
        b && R.set(a, b);
        const E = l.frameShearAreas.get(s.id);
        if (E && (z.set(a, E[0]), $.set(a, E[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const I = {
            type: "general"
          };
          s.sec && (I.name = s.sec), s.D !== void 0 && isFinite(s.D) && (I.h = s.D), s.B !== void 0 && isFinite(s.B) && (I.b = s.B), m.set(a, I);
        }
        const w = l.frameCftc.get(s.id);
        if (w) {
          const I = Je(w.D, w.t, s.E, v, w.Ec, w.nuC);
          e.set(a, I.A), n.set(a, I.Iz), i.set(a, I.Iy), c.set(a, I.J), z.set(a, I.As2), $.set(a, I.As3), S.set(a, w.D), L.set(a, w.D), m.set(a, {
            type: "CFT",
            d: w.D,
            tw: w.t,
            fillE: w.Ec,
            name: s.sec ?? `CFTC ${Math.round(w.D * 1e3)}X${Math.round(w.t * 1e3)}`
          });
        }
        const x = l.frameCft.get(s.id);
        if (x) {
          const I = We(x.b, x.h, x.t, s.E, v, x.Ec, x.nuC);
          e.set(a, I.A), n.set(a, I.Iz), i.set(a, I.Iy), c.set(a, I.J), z.set(a, I.As2), $.set(a, I.As3), S.set(a, x.h), L.set(a, x.b), m.set(a, {
            type: "CFT",
            b: x.b,
            h: x.h,
            tw: x.t,
            fillE: x.Ec,
            name: s.sec ?? `CFT ${Math.round(x.h * 1e3)}X${Math.round(x.b * 1e3)}X${Math.round(x.t * 1e3)}`
          });
        }
      }
      if (l.meshCross) {
        const s = (g, f) => g[0] * f[0] + g[1] * f[1] + g[2] * f[2], d = [
          t,
          A,
          e,
          i,
          n,
          c,
          h,
          J,
          S,
          L,
          k,
          $,
          z,
          m,
          R
        ], p = (g, f) => {
          for (const b of d) b.has(g) && b.set(f, b.get(g));
        }, a = (g) => {
          for (let f = 0; f < C.length; f++) if (Math.hypot(C[f][0] - g[0], C[f][1] - g[1], C[f][2] - g[2]) < 1e-6) return f;
          return C.push([
            g[0],
            g[1],
            g[2]
          ]), C.length - 1;
        }, v = (g) => {
          const f = C[g[0]], b = C[g[1]];
          return [
            Math.min(f[0], b[0]),
            Math.min(f[1], b[1]),
            Math.min(f[2], b[2]),
            Math.max(f[0], b[0]),
            Math.max(f[1], b[1]),
            Math.max(f[2], b[2])
          ];
        };
        let F = 0;
        for (let g = 0; g < M.length; g++) {
          if (M[g].length !== 2) continue;
          const f = v(M[g]);
          for (let b = g + 1; b < M.length; b++) {
            if (M[b].length !== 2) continue;
            const [E, w] = M[g], [x, I] = M[b];
            if (E === x || E === I || w === x || w === I) continue;
            const W = v(M[b]);
            if (f[0] > W[3] + 1e-6 || W[0] > f[3] + 1e-6 || f[1] > W[4] + 1e-6 || W[1] > f[4] + 1e-6 || f[2] > W[5] + 1e-6 || W[2] > f[5] + 1e-6) continue;
            const T = C[E], V = C[w], q = C[x], Q = C[I], Y = [
              V[0] - T[0],
              V[1] - T[1],
              V[2] - T[2]
            ], K = [
              Q[0] - q[0],
              Q[1] - q[1],
              Q[2] - q[2]
            ], re = [
              T[0] - q[0],
              T[1] - q[1],
              T[2] - q[2]
            ], xe = s(Y, Y), ve = s(Y, K), ke = s(K, K), Se = s(Y, re), $e = s(K, re), ye = xe * ke - ve * ve;
            if (ye < 1e-10 * xe * ke) continue;
            const Me = (ve * $e - ke * Se) / ye, be = (xe * $e - ve * Se) / ye;
            if (Me < 1e-6 || Me > 1 - 1e-6 || be < 1e-6 || be > 1 - 1e-6) continue;
            const we = [
              T[0] + Me * Y[0],
              T[1] + Me * Y[1],
              T[2] + Me * Y[2]
            ], Le = [
              q[0] + be * K[0],
              q[1] + be * K[1],
              q[2] + be * K[2]
            ];
            if (Math.hypot(we[0] - Le[0], we[1] - Le[1], we[2] - Le[2]) > 1e-6) continue;
            const De = a(we);
            for (const fe of [
              g,
              b
            ]) {
              const [Te, je] = M[fe], Ee = M.length;
              M[fe] = [
                Te,
                De
              ], M.push([
                De,
                je
              ]), p(fe, Ee);
              const Ce = u.get(fe);
              Ce && (u.set(fe, [
                ...Ce.slice(0, 6),
                ...Array(6).fill(false)
              ]), u.set(Ee, [
                ...Array(6).fill(false),
                ...Ce.slice(6)
              ]));
              const Fe = O.get(fe);
              Fe && (O.set(fe, [
                Fe[0],
                0,
                Fe[2]
              ]), O.set(Ee, [
                0,
                Fe[1],
                Fe[2]
              ]));
            }
            F++;
          }
        }
        F > 0 && console.log(`[CLI Modeler] ${F} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of l.shells) {
        const d = s.pts.map((v) => y.get(v));
        if (d.some((v) => v === void 0)) {
          l.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = M.length;
        U.set(s.id, p), M.push(d), t.set(p, s.E), A.set(p, s.E / (2 * 1.2)), _.set(p, s.t), h.set(p, s.rho ?? 2.45), J.set(p, 0.2);
        const a = l.shellTypes.get(s.id);
        a !== void 0 && j.set(p, a);
      }
      const P = /* @__PURE__ */ new Map();
      for (const [s, d] of l.supports.entries()) {
        const p = y.get(s);
        p !== void 0 && P.set(p, d);
      }
      const X = /* @__PURE__ */ new Map();
      for (const [s, d] of l.loads.entries()) {
        const p = y.get(s);
        p !== void 0 && X.set(p, [
          ...d
        ]);
      }
      const G = /* @__PURE__ */ new Map();
      for (const [s, d] of l.diaphragms.entries()) {
        const p = y.get(s);
        p !== void 0 && G.set(p, d);
      }
      const de = /* @__PURE__ */ new Map();
      for (const [s, d] of l.masses.entries()) {
        const p = y.get(s);
        p !== void 0 && de.set(p, d);
      }
      if (l.frameLoads.size) {
        const s = (d, p) => {
          const a = X.get(d) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          X.set(d, [
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
          const v = y.get(a.nI), F = y.get(a.nJ);
          if (v === void 0 || F === void 0) continue;
          const g = C[v], f = C[F], b = [
            f[0] - g[0],
            f[1] - g[1],
            f[2] - g[2]
          ], E = Math.hypot(b[0], b[1], b[2]);
          if (E < 1e-9) continue;
          const w = [
            b[0] / E,
            b[1] / E,
            b[2] / E
          ], x = E * E / 12, I = [
            w[1] * p[2] - w[2] * p[1],
            w[2] * p[0] - w[0] * p[2],
            w[0] * p[1] - w[1] * p[0]
          ];
          s(v, [
            p[0] * E / 2,
            p[1] * E / 2,
            p[2] * E / 2,
            x * I[0],
            x * I[1],
            x * I[2]
          ]), s(F, [
            p[0] * E / 2,
            p[1] * E / 2,
            p[2] * E / 2,
            -x * I[0],
            -x * I[1],
            -x * I[2]
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
        const p = s.pts.map((F) => y.get(F));
        if (p.some((F) => F === void 0)) {
          l.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const a = p.map((F) => C[F]), v = [
          0,
          0,
          0,
          0
        ];
        for (const [F, g] of he) {
          const f = [
            0.25 * (1 - F) * (1 - g),
            0.25 * (1 + F) * (1 - g),
            0.25 * (1 + F) * (1 + g),
            0.25 * (1 - F) * (1 + g)
          ], b = [
            -0.25 * (1 - g),
            0.25 * (1 - g),
            0.25 * (1 + g),
            -0.25 * (1 + g)
          ], E = [
            -0.25 * (1 - F),
            -0.25 * (1 + F),
            0.25 * (1 + F),
            0.25 * (1 - F)
          ], w = [
            0,
            1,
            2
          ].map((T) => b.reduce((V, q, Q) => V + q * a[Q][T], 0)), x = [
            0,
            1,
            2
          ].map((T) => E.reduce((V, q, Q) => V + q * a[Q][T], 0)), I = [
            w[1] * x[2] - w[2] * x[1],
            w[2] * x[0] - w[0] * x[2],
            w[0] * x[1] - w[1] * x[0]
          ], W = Math.hypot(I[0], I[1], I[2]);
          for (let T = 0; T < 4; T++) v[T] += f[T] * d * W;
        }
        for (let F = 0; F < 4; F++) {
          const g = p[F], f = X.get(g) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          f[2] += v[F], X.set(g, f), ne.set(g, (ne.get(g) ?? 0) + v[F]);
        }
      }
      if (l.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [a, v] of U) l.deckTributario.has(a) && d.add(v);
        const p = (a, v) => {
          const F = X.get(a) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          F[2] += v, X.set(a, F);
        };
        M.forEach((a, v) => {
          const F = h.get(v) ?? 0;
          if (F && !d.has(v)) {
            if (a.length === 2) {
              const g = e.get(v) ?? 0, f = C[a[0]], b = C[a[1]], E = [
                b[0] - f[0],
                b[1] - f[1],
                b[2] - f[2]
              ];
              let w = Math.hypot(E[0], E[1], E[2]);
              const x = O.get(v);
              if (x) {
                const Y = Math.hypot(E[0], E[1]);
                Y > 1e-9 && Math.abs(Math.atan2(Math.abs(E[2]), Y)) * 180 / Math.PI < 20 && (w = Math.max(w - x[0] - x[1], 0));
              }
              const I = Math.hypot(E[0], E[1], E[2]), W = -g * F * 9.80665 * l.selfWeight, T = [
                E[0] / I,
                E[1] / I,
                E[2] / I
              ], V = w * w / 12, q = [
                T[1] * W,
                -T[0] * W,
                0
              ], Q = (Y, K) => {
                const re = X.get(Y) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                X.set(Y, [
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
                W * w / 2,
                V * q[0],
                V * q[1],
                0
              ]), Q(a[1], [
                0,
                0,
                W * w / 2,
                -V * q[0],
                -V * q[1],
                0
              ]);
            } else if (a.length === 4) {
              const g = _.get(v) ?? 0, f = a.map((w) => C[w]);
              let b = 0;
              for (let w = 1; w < 3; w++) {
                const x = [
                  f[w][0] - f[0][0],
                  f[w][1] - f[0][1],
                  f[w][2] - f[0][2]
                ], I = [
                  f[w + 1][0] - f[0][0],
                  f[w + 1][1] - f[0][1],
                  f[w + 1][2] - f[0][2]
                ], W = [
                  x[1] * I[2] - x[2] * I[1],
                  x[2] * I[0] - x[0] * I[2],
                  x[0] * I[1] - x[1] * I[0]
                ];
                b += Math.hypot(W[0], W[1], W[2]) / 2;
              }
              const E = b * g * F * 9.80665 * l.selfWeight;
              for (const w of a) p(w, -E / 4);
            }
          }
        });
      }
      const se = [];
      for (const s of l.springs) {
        const d = y.get(s.node);
        d !== void 0 && se.push({
          node: d,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of l.areaSprings) {
        const d = U.get(s.id);
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
        M.forEach((a, v) => {
          if (a.length === 3 || a.length === 4) {
            d.push(v);
            for (const F of a) s.add(F);
          }
        });
        let p = 0;
        for (const a of d) {
          const v = M[a], F = v.map((f) => C[f]), g = [
            0,
            1,
            2
          ].map((f) => [
            Math.min(...F.map((b) => b[f])),
            Math.max(...F.map((b) => b[f]))
          ]);
          for (let f = 0; f < C.length; f++) {
            if (v.includes(f)) continue;
            const b = C[f];
            if (b[0] < g[0][0] - 1e-6 || b[0] > g[0][1] + 1e-6 || b[1] < g[1][0] - 1e-6 || b[1] > g[1][1] + 1e-6 || b[2] < g[2][0] - 1e-6 || b[2] > g[2][1] + 1e-6) continue;
            let E = false;
            for (let x = 0; x < v.length && !E; x++) {
              const I = F[x], W = F[(x + 1) % v.length], T = [
                W[0] - I[0],
                W[1] - I[1],
                W[2] - I[2]
              ], V = T[0] * T[0] + T[1] * T[1] + T[2] * T[2];
              if (V < 1e-24) continue;
              const q = [
                b[0] - I[0],
                b[1] - I[1],
                b[2] - I[2]
              ], Q = (q[0] * T[0] + q[1] * T[1] + q[2] * T[2]) / V;
              if (Q <= 1e-6 || Q >= 1 - 1e-6) continue;
              const Y = [
                q[0] - Q * T[0],
                q[1] - Q * T[1],
                q[2] - Q * T[2]
              ];
              Math.hypot(Y[0], Y[1], Y[2]) <= 1e-6 * Math.sqrt(V) && (E = true);
            }
            !E || !M.some((x, I) => I !== a && x.includes(f)) || (se.push({
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
        const d = s.pts.map((a) => y.get(a));
        if (d.some((a) => a === void 0)) {
          l.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = M.length;
        M.push(d), t.set(p, s.E), J.set(p, s.nu), A.set(p, s.E / (2 * (1 + s.nu))), h.set(p, s.rho), ee.push(p);
      }
      o.nodes.val = C, o.elements.val = M, o.nodeInputs.val = {
        supports: P,
        loads: X,
        masses: de,
        diaphragms: G,
        springs: se
      }, o.springs && (o.springs.val = se);
      const te = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map();
      for (const s of l.shells) {
        const d = U.get(s.id);
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
        const F = l.shellMods.get(s.id);
        F && (te.set(d, F[0]), ue.set(d, F[1]));
      }
      if (o.elementInputs.val = {
        elasticities: t,
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
        thicknesses: _,
        membraneModifiers: te,
        bendingModifiers: ue,
        shellModifiers: Ie,
        shellSurfaceLoads: ae,
        shellAngles: ge,
        cargaDeArea: ne,
        cantos: S,
        anchos: L,
        sectionShapes: m,
        localAngles: k,
        shearAreasY: $,
        shearAreasZ: z,
        momentReleases: u,
        endOffsets: O,
        plateFormulations: j,
        frameLoads: R,
        meshAtIntersections: l.meshCross,
        solidIncompatible: l.solidIncompatible,
        selfWeight: l.selfWeight,
        etabsWallJoint: l.etabsWallJoint,
        areaObjects: l.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => y.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => U.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => l.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => l.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, l.doSolve && ee.length > 0 && ee.length === M.length) try {
        const s = t.get(ee[0]) ?? 25e6, d = J.get(ee[0]) ?? 0.2;
        ee.some((g) => Math.abs((t.get(g) ?? s) - s) > 1e-9 * s || Math.abs((J.get(g) ?? d) - d) > 1e-12) && l.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const p = /* @__PURE__ */ new Map();
        for (const [g, f] of o.nodeInputs.val.supports ?? []) p.set(g, [
          !!f[0],
          !!f[1],
          !!f[2]
        ]);
        const a = /* @__PURE__ */ new Map();
        for (const [g, f] of o.nodeInputs.val.loads ?? []) a.set(g, [
          f[0] ?? 0,
          f[1] ?? 0,
          f[2] ?? 0
        ]);
        const v = Be({
          nodes: C,
          elements: M,
          E: s,
          nu: d,
          supports: p,
          loads: a,
          incompatible: l.solidIncompatible
        }), F = /* @__PURE__ */ new Map();
        v.displacements.forEach(([g, f, b], E) => F.set(E, [
          g,
          f,
          b,
          0,
          0,
          0
        ])), o.deformOutputs.val = {
          deformations: F,
          reactions: /* @__PURE__ */ new Map()
        }, o.analyzeOutputs.val = {
          solidStress: v.stressPerElement,
          solidVonMises: v.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${M.length} solidos H8, ${C.length} nodos (${v.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        l.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (l.doSolve && C.length && M.length) try {
        o.deformOutputs.val = Re(C, M, o.nodeInputs.val, o.elementInputs.val, se.length ? se : void 0);
        try {
          o.analyzeOutputs.val = Ne(C, M, o.elementInputs.val, o.deformOutputs.val);
        } catch (s) {
          console.warn("[CLI Modeler] analyze:", (s == null ? void 0 : s.message) ?? s);
        }
        if (ee.length > 0) try {
          const s = o.deformOutputs.val.deformations, d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
          for (const a of ee) {
            const v = M[a], F = v.map((b) => C[b]), g = v.flatMap((b) => {
              const E = s.get(b) ?? [
                0,
                0,
                0
              ];
              return [
                E[0],
                E[1],
                E[2]
              ];
            }), f = qe(F, t.get(a) ?? 25e6, J.get(a) ?? 0.2, g, l.solidIncompatible);
            d.set(a, f.stress), p.set(a, f.vonMises);
          }
          o.analyzeOutputs.val = {
            ...o.analyzeOutputs.val ?? {},
            solidStress: d,
            solidVonMises: p
          };
        } catch (s) {
          console.warn("[CLI Modeler] tensiones de solidos:", (s == null ? void 0 : s.message) ?? s);
        }
        console.log("[CLI Modeler] Solve OK \u2014", M.length, "elementos,", C.length, "nodos");
      } catch (s) {
        l.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (o.objects3D.val = [], l.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of l.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = l.errors;
      let ce = 0, me = 0;
      const ie = o.deformOutputs.val;
      if ((_a = ie == null ? void 0 : ie.deformations) == null ? void 0 : _a.size) for (const [, s] of ie.deformations) Math.abs(s[2]) > Math.abs(ce) && (ce = s[2]);
      if ((_b = ie == null ? void 0 : ie.reactions) == null ? void 0 : _b.size) for (const [, s] of ie.reactions) me += s[2] || 0;
      window.__hekatanCliStats = {
        nodes: C.length,
        frames: l.frames.length,
        shells: l.shells.length,
        supports: P.size,
        loads: X.size,
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
  _e as p
};
