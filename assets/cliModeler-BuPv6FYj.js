import { c as Je, a as We } from "./cadSections-DVtTZU6U.js";
import { h as qe, a as _e, __tla as __tla_0 } from "./h8-CxkkFRzA.js";
import { a as Be } from "./analyze-DgLgRmKg.js";
import { m as Ne, d as Re, __tla as __tla_1 } from "./didacticCpp-CnEP9H1T.js";
let He, Xe;
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
    const $ = [
      false,
      false,
      false,
      false,
      false,
      false
    ], l = t.split(/[\s,]+/).filter(Boolean);
    if (l.length > 1 && l.length <= 6 && l.every((k) => k === "0" || k === "1")) return l.forEach((k, q) => {
      $[q] = k === "1";
    }), $;
    for (const k of l) Ae[k] !== void 0 && ($[Ae[k]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let k = 0; k < t.length; k++) $[k] = t[k] === "1";
    return $;
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
    let $ = null, l = 0, k = 0, q = 0;
    const y = r.split(/\r?\n/);
    for (let _ = 0; _ < y.length; _++) {
      let M = y[_].trim();
      if (!M || M.startsWith("#") || M.startsWith("//")) continue;
      M = M.replace(/[;]+$/, "");
      const o = M.split(/\s+/), A = o[0].toLowerCase();
      if (A === "nodes" && o.length === 1) {
        $ = "nodes";
        continue;
      }
      if ((A === "elements" || A === "frames") && o.length === 1) {
        $ = "elements";
        continue;
      }
      if (A === "areas" && o.length === 1) {
        $ = "areas";
        continue;
      }
      if (A === "supports" && o.length === 1) {
        $ = "supports";
        continue;
      }
      if (A === "loads" && o.length === 1) {
        $ = "loads";
        continue;
      }
      if (A === "springs" && o.length === 1) {
        $ = "springs";
        continue;
      }
      if ($ && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if ($ === "nodes" && e.length >= 3) {
          l++, t.nodes.set(l, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if ($ === "elements" && e.length >= 2) {
          k++, t.frames.push({
            id: k,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if ($ === "areas" && e.length >= 4) {
          q++, t.shells.push({
            id: q,
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
        if ($ === "loads" && e.length >= 4) {
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
        if ($ === "springs" && e.length >= 3) {
          t.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if ($ === "supports" && /^\d/.test(o[0])) {
        const e = parseInt(o[0], 10), i = o.slice(1).join(" ");
        t.supports.set(e, ze(i));
        continue;
      }
      $ && !/^[\-\d]/.test(o[0]) && ($ = null);
      try {
        switch (A) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), i = parseFloat(o[2]), n = parseFloat(o[3]), c = parseFloat(o[4]);
            !isFinite(e) || !isFinite(i) || !isFinite(n) || !isFinite(c) ? t.errors.push(`L${_ + 1}: node mal formado: ${M}`) : t.nodes.set(e, [
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
            const e = parseInt(o[1], 10), i = parseInt(o[2], 10), n = parseInt(o[3], 10), c = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.16"), S = parseFloat(o[6] ?? "0.001"), E = o[7] !== void 0 ? parseFloat(o[7]) : void 0, m = o[8] !== void 0 ? parseFloat(o[8]) : void 0, L = o[9] !== void 0 ? parseFloat(o[9]) : void 0, g = o[10] !== void 0 ? parseFloat(o[10]) : void 0, z = o[11] !== void 0 ? parseFloat(o[11]) : void 0, j = o[12] !== void 0 ? parseFloat(o[12]) : void 0, R = o.indexOf("#"), D = R >= 0 && o[R + 1] ? o[R + 1] : void 0;
            t.frames.push({
              id: e,
              nI: i,
              nJ: n,
              E: c,
              A: h,
              I: S,
              Iy: E,
              J: m,
              nu: L,
              rho: g,
              D: z,
              B: j,
              sec: D
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
            const [i, n, c, h, S, E, m] = e, L = [];
            for (let g = E; g <= m; g++) L.push(g);
            t.areaObjs.push({
              id: i,
              pts: [
                n,
                c,
                h,
                S
              ],
              cells: L
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
            Number.isFinite(e) && Number.isFinite(i) ? t.masses.set(e, (t.masses.get(e) ?? 0) + i) : t.errors.push(`L${_ + 1}: mass necesita <nudo> <toneladas>`);
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
            t.errors.push(`L${_ + 1}: comando desconocido "${A}"`);
        }
      } catch (e) {
        t.errors.push(`L${_ + 1}: error "${M}" \u2014 ${e.message}`);
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
    const $ = r.shellModsDir.get(t);
    return !!$ && Math.abs($[3]) < 1e-12 && Math.abs($[4]) < 1e-12 && Math.abs($[5]) < 1e-12;
  }
  function Ye(r, t = 200, $) {
    const l = [
      0,
      1,
      2
    ].map((m) => (r[0][m] + r[1][m] + r[2][m] + r[3][m]) / 4);
    let k = B(r[1], r[0]), q = pe(k, B(r[3], r[0]));
    q = oe(q, 1 / Z(q)), k = oe(k, 1 / Z(k));
    const y = pe(q, k), _ = r.map((m) => [
      le(B(m, l), k),
      le(B(m, l), y)
    ]);
    let M = [
      0,
      1,
      2,
      3
    ];
    if ($) {
      const m = [
        0,
        1,
        2,
        3
      ].map((L) => {
        const g = B(r[(L + 1) % 4], r[L]);
        return Math.abs(le(g, $)) / Z(g);
      });
      M = [
        0,
        1,
        2,
        3
      ].sort((L, g) => m[L] - m[g]).slice(0, 2);
    }
    const o = _.map((m) => m[0]), A = _.map((m) => m[1]), e = Math.min(...o), i = Math.max(...o), n = Math.min(...A), c = Math.max(...A), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let S = 0;
    for (let m = 0; m < t; m++) for (let L = 0; L < t; L++) {
      const g = e + (i - e) * (m + 0.5) / t, z = n + (c - n) * (L + 0.5) / t;
      let j = 0, R = 0;
      for (let J = 0; J < 4; J++) {
        const X = _[J], H = _[(J + 1) % 4];
        (H[0] - X[0]) * (z - X[1]) - (H[1] - X[1]) * (g - X[0]) >= 0 ? j++ : R++;
      }
      if (j !== 4 && R !== 4) continue;
      let D = M[0], O = 1 / 0;
      for (const J of M) {
        const X = _[J], H = _[(J + 1) % 4], U = H[0] - X[0], Y = H[1] - X[1], de = U * U + Y * Y, ne = Math.max(0, Math.min(1, ((g - X[0]) * U + (z - X[1]) * Y) / de)), P = Math.hypot(g - (X[0] + ne * U), z - (X[1] + ne * Y));
        P < O && (O = P, D = J);
      }
      h[D].pts.push([
        l[0] + g * k[0] + z * y[0],
        l[1] + g * k[1] + z * y[1],
        l[2] + g * k[2] + z * y[2]
      ]), S++;
    }
    const E = 0.5 * Z(pe(B(r[2], r[0]), B(r[3], r[1])));
    for (const m of h) m.dA = S ? E / S : 0;
    return h;
  }
  function Ge(r, t) {
    if (!(t > 0)) return;
    const $ = 1e-6, l = (A) => r.nodes.get(A);
    let k = Math.max(0, ...r.nodes.keys()) + 1, q = r.shells.reduce((A, e) => Math.max(A, e.id), 0) + 1;
    const y = (A) => {
      for (const [i, n] of r.nodes) if (Z(B(n, A)) < $) return i;
      const e = k++;
      return r.nodes.set(e, [
        A[0],
        A[1],
        A[2]
      ]), e;
    }, _ = (A, e) => {
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
    let o = 0;
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
      const i = (Z(B(e[1], e[0])) + Z(B(e[2], e[3]))) / 2, n = (Z(B(e[3], e[0])) + Z(B(e[2], e[1]))) / 2, c = Math.max(1, Math.ceil(i / t - 1e-9)), h = Math.max(1, Math.ceil(n / t - 1e-9));
      if (c === 1 && h === 1) {
        M.push(A);
        continue;
      }
      const S = (m, L) => [
        0,
        1,
        2
      ].map((g) => e[0][g] * (1 - m) * (1 - L) + e[1][g] * m * (1 - L) + e[2][g] * m * L + e[3][g] * (1 - m) * L), E = [];
      for (let m = 0; m <= c; m++) {
        const L = [];
        for (let g = 0; g <= h; g++) L.push(y(S(m / c, g / h)));
        E.push(L);
      }
      for (let m = 0; m < c; m++) for (let L = 0; L < h; L++) {
        const g = m === 0 && L === 0 ? A.id : q++;
        M.push({
          ...A,
          id: g,
          pts: [
            E[m][L],
            E[m + 1][L],
            E[m + 1][L + 1],
            E[m][L + 1]
          ]
        }), g !== A.id && _(A.id, g);
      }
      o++;
    }
    o && (r.shells = M, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${r.shells.length} cascaras, ${r.nodes.size} nudos`));
  }
  function Ze(r) {
    const $ = (n) => r.nodes.get(n), l = [
      ...r.nodes.keys()
    ], k = (n, c, h) => {
      const S = B(c, n), E = Z(S), m = oe(S, 1 / E), L = [];
      for (const g of l) {
        if (h.includes(g)) continue;
        const z = B($(g), n), j = le(z, m);
        j > 1e-6 && j < E - 1e-6 && Z(B(z, oe(m, j))) < 1e-4 && L.push(j / E);
      }
      return L.sort((g, z) => g - z);
    }, q = (n, c) => {
      const h = [];
      for (const S of n) c.some((E) => Math.abs(S - E) < 1e-5) && !h.some((E) => Math.abs(S - E) < 1e-5) && h.push(S);
      return h;
    }, y = (n) => {
      for (const c of l) if (Z(B($(c), n)) < 1e-4) return c;
    };
    let _ = r.shells.reduce((n, c) => Math.max(n, c.id), 0) + 1;
    const M = [], o = (n, c) => {
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
      const L = r.shellAngles.get(n);
      L !== void 0 && r.shellAngles.set(c, L);
    };
    for (const n of r.shells) {
      if (!Oe(r, n.id) || n.pts.length !== 4 || n.pts.some((D) => !r.nodes.has(D))) {
        M.push(n);
        continue;
      }
      const c = n.pts.map($), h = k(c[0], c[1], n.pts), S = k(c[2], c[3], n.pts).map((D) => 1 - D), E = k(c[1], c[2], n.pts), m = k(c[3], c[0], n.pts).map((D) => 1 - D);
      let L = [
        0,
        ...q(h, S),
        1
      ], g = [
        0,
        ...q(E, m),
        1
      ];
      if (L.length === 2 && g.length === 2) {
        M.push(n);
        continue;
      }
      const z = (D, O) => [
        0,
        1,
        2
      ].map((J) => (1 - D) * (1 - O) * c[0][J] + D * (1 - O) * c[1][J] + D * O * c[2][J] + (1 - D) * O * c[3][J]);
      let j = g.map((D) => L.map((O) => y(z(O, D))));
      if (j.some((D) => D.some((O) => O === void 0)) && (L.length >= g.length ? g = [
        0,
        1
      ] : L = [
        0,
        1
      ], j = g.map((D) => L.map((O) => y(z(O, D)))), j.some((D) => D.some((O) => O === void 0)))) {
        M.push(n);
        continue;
      }
      let R = true;
      for (let D = 0; D < g.length - 1; D++) for (let O = 0; O < L.length - 1; O++) {
        const J = [
          j[D][O],
          j[D][O + 1],
          j[D + 1][O + 1],
          j[D + 1][O]
        ], X = R ? n.id : _++;
        R || o(n.id, X), R = false, M.push({
          id: X,
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
      const h = B(c, n), S = Z(h), E = oe(h, 1 / S);
      return r.frames.filter((m) => [
        m.nI,
        m.nJ
      ].every((L) => {
        const g = r.nodes.get(L);
        if (!g) return false;
        const z = B(g, n), j = le(z, E);
        return j > -1e-4 && j < S + 1e-4 && Z(B(z, oe(E, j))) < 1e-4;
      }));
    };
    for (const n of r.shells) {
      if (!Oe(r, n.id) || n.pts.length !== 4) continue;
      const c = r.selfWeight ? (n.rho ?? 2.45) * n.t * A * r.selfWeight : 0, h = r.shellLoads.get(n.id) ?? 0, S = -c + h;
      if (Math.abs(S) < 1e-15) continue;
      const E = n.pts.map($);
      let m;
      if (r.deckOneWay) {
        const g = B(E[1], E[0]);
        let z = pe(g, B(E[3], E[0]));
        z = oe(z, 1 / Z(z));
        const j = oe(g, 1 / Z(g)), R = pe(z, j), D = (r.shellAngles.get(n.id) ?? 0) * Math.PI / 180;
        m = [
          0,
          1,
          2
        ].map((O) => Math.cos(D) * j[O] + Math.sin(D) * R[O]);
      }
      const L = Ye(E, 200, m);
      for (let g = 0; g < 4; g++) {
        const { pts: z, dA: j } = L[g];
        if (!z.length) continue;
        const R = E[g], D = E[(g + 1) % 4], O = i(R, D);
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
        const J = B(D, R), X = Z(J), H = oe(J, 1 / X), U = z.map((Y) => le(B(Y, R), H));
        for (const Y of O) {
          const de = $(Y.nI), ne = $(Y.nJ), P = le(B(de, R), H), he = le(B(ne, R), H), ee = Math.min(P, he), se = Math.max(P, he), te = se - ee;
          if (te < 1e-9) continue;
          const ue = se >= X - 1e-6, Ie = oe(B(ne, de), 1 / te), ae = pe(Ie, [
            0,
            0,
            1
          ]);
          let ge = 0, ce = 0, me = 0, ie = 0;
          for (const d of U) {
            if (d < ee - 1e-9 || (ue ? d > se + 1e-9 : d >= se - 1e-9)) continue;
            let p = d - ee;
            P > he && (p = te - p);
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
  He = {
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
    hasModal: true,
    runModal(r, t, $) {
      var _a;
      const l = t.nodes.val, k = t.elements.val;
      if (!(!l.length || !k.length)) try {
        const q = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), y = t.nodeInputs.val, _ = window.__hekatanCliSprings, M = Ne(l, k, y, t.elementInputs.val, q, 0, 0, 1, (y == null ? void 0 : y.diaphragms) instanceof Map && y.diaphragms.size ? y.diaphragms : void 0, _ && _.length ? _ : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${M.frequencies.length} modos, T1 = ${M.frequencies[0] ? (1 / M.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = $ == null ? void 0 : $.render) == null ? void 0 : _a.call($, M, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (q) {
        console.error("[CLI Modeler] modal:", (q == null ? void 0 : q.message) ?? q);
      }
    },
    build(r, t) {
      var _a, _b;
      const $ = window.__hekatanCliScript ?? Ue;
      window.__hekatanCliLastScript = $;
      const l = Xe($);
      l.autoMesh > 0 && Ge(l, l.autoMesh), l.deckEtabs && Ze(l);
      const k = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), y = [], _ = Array.from(l.nodes.keys()).sort((s, d) => s - d);
      for (const s of _) k.set(s, y.length), y.push(l.nodes.get(s));
      const M = [], o = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
      for (const s of l.frames) {
        const d = k.get(s.nI), p = k.get(s.nJ);
        if (d === void 0 || p === void 0) {
          const w = _.length ? `IDs disponibles: ${_.join(", ")}` : "ning\xFAn nodo definido", W = [];
          d === void 0 && W.push(s.nI), p === void 0 && W.push(s.nJ), l.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${W.join(", ")}] \u2014 ${w}`);
          continue;
        }
        const a = M.length;
        M.push([
          d,
          p
        ]);
        const v = s.nu ?? 0.2;
        o.set(a, s.E), A.set(a, s.E / (2 * (1 + v))), e.set(a, s.A), i.set(a, s.I), n.set(a, s.Iy ?? s.I), c.set(a, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), h.set(a, s.rho ?? 2.45), J.set(a, v), s.D !== void 0 && isFinite(s.D) && S.set(a, s.D), s.B !== void 0 && isFinite(s.B) && E.set(a, s.B);
        const b = l.frameAngles.get(s.id);
        b !== void 0 && isFinite(b) && L.set(a, b);
        const u = l.frameReleases.get(s.id);
        u && g.set(a, u);
        const f = l.frameEndOffsets.get(s.id);
        f && z.set(a, f);
        const F = l.frameLoads.get(s.id);
        F && R.set(a, F);
        const C = l.frameShearAreas.get(s.id);
        if (C && (O.set(a, C[0]), D.set(a, C[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const w = {
            type: "general"
          };
          s.sec && (w.name = s.sec), s.D !== void 0 && isFinite(s.D) && (w.h = s.D), s.B !== void 0 && isFinite(s.B) && (w.b = s.B), m.set(a, w);
        }
        const x = l.frameCftc.get(s.id);
        if (x) {
          const w = Je(x.D, x.t, s.E, v, x.Ec, x.nuC);
          e.set(a, w.A), n.set(a, w.Iz), i.set(a, w.Iy), c.set(a, w.J), O.set(a, w.As2), D.set(a, w.As3), S.set(a, x.D), E.set(a, x.D), m.set(a, {
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
          e.set(a, w.A), n.set(a, w.Iz), i.set(a, w.Iy), c.set(a, w.J), O.set(a, w.As2), D.set(a, w.As3), S.set(a, I.h), E.set(a, I.b), m.set(a, {
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
          L,
          D,
          O,
          m,
          R
        ], p = (u, f) => {
          for (const F of d) F.has(u) && F.set(f, F.get(u));
        }, a = (u) => {
          for (let f = 0; f < y.length; f++) if (Math.hypot(y[f][0] - u[0], y[f][1] - u[1], y[f][2] - u[2]) < 1e-6) return f;
          return y.push([
            u[0],
            u[1],
            u[2]
          ]), y.length - 1;
        }, v = (u) => {
          const f = y[u[0]], F = y[u[1]];
          return [
            Math.min(f[0], F[0]),
            Math.min(f[1], F[1]),
            Math.min(f[2], F[2]),
            Math.max(f[0], F[0]),
            Math.max(f[1], F[1]),
            Math.max(f[2], F[2])
          ];
        };
        let b = 0;
        for (let u = 0; u < M.length; u++) {
          if (M[u].length !== 2) continue;
          const f = v(M[u]);
          for (let F = u + 1; F < M.length; F++) {
            if (M[F].length !== 2) continue;
            const [C, x] = M[u], [I, w] = M[F];
            if (C === I || C === w || x === I || x === w) continue;
            const W = v(M[F]);
            if (f[0] > W[3] + 1e-6 || W[0] > f[3] + 1e-6 || f[1] > W[4] + 1e-6 || W[1] > f[4] + 1e-6 || f[2] > W[5] + 1e-6 || W[2] > f[5] + 1e-6) continue;
            const T = y[C], V = y[x], N = y[I], K = y[w], G = [
              V[0] - T[0],
              V[1] - T[1],
              V[2] - T[2]
            ], Q = [
              K[0] - N[0],
              K[1] - N[1],
              K[2] - N[2]
            ], re = [
              T[0] - N[0],
              T[1] - N[1],
              T[2] - N[2]
            ], xe = s(G, G), ve = s(G, Q), ke = s(Q, Q), Se = s(G, re), $e = s(Q, re), ye = xe * ke - ve * ve;
            if (ye < 1e-10 * xe * ke) continue;
            const Me = (ve * $e - ke * Se) / ye, be = (xe * $e - ve * Se) / ye;
            if (Me < 1e-6 || Me > 1 - 1e-6 || be < 1e-6 || be > 1 - 1e-6) continue;
            const we = [
              T[0] + Me * G[0],
              T[1] + Me * G[1],
              T[2] + Me * G[2]
            ], Le = [
              N[0] + be * Q[0],
              N[1] + be * Q[1],
              N[2] + be * Q[2]
            ];
            if (Math.hypot(we[0] - Le[0], we[1] - Le[1], we[2] - Le[2]) > 1e-6) continue;
            const De = a(we);
            for (const fe of [
              u,
              F
            ]) {
              const [Te, je] = M[fe], Ce = M.length;
              M[fe] = [
                Te,
                De
              ], M.push([
                De,
                je
              ]), p(fe, Ce);
              const Ee = g.get(fe);
              Ee && (g.set(fe, [
                ...Ee.slice(0, 6),
                ...Array(6).fill(false)
              ]), g.set(Ce, [
                ...Array(6).fill(false),
                ...Ee.slice(6)
              ]));
              const Fe = z.get(fe);
              Fe && (z.set(fe, [
                Fe[0],
                0,
                Fe[2]
              ]), z.set(Ce, [
                0,
                Fe[1],
                Fe[2]
              ]));
            }
            b++;
          }
        }
        b > 0 && console.log(`[CLI Modeler] ${b} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of l.shells) {
        const d = s.pts.map((v) => k.get(v));
        if (d.some((v) => v === void 0)) {
          l.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = M.length;
        q.set(s.id, p), M.push(d), o.set(p, s.E), A.set(p, s.E / (2 * 1.2)), X.set(p, s.t), h.set(p, s.rho ?? 2.45), J.set(p, 0.2);
        const a = l.shellTypes.get(s.id);
        a !== void 0 && j.set(p, a);
      }
      const H = /* @__PURE__ */ new Map();
      for (const [s, d] of l.supports.entries()) {
        const p = k.get(s);
        p !== void 0 && H.set(p, d);
      }
      const U = /* @__PURE__ */ new Map();
      for (const [s, d] of l.loads.entries()) {
        const p = k.get(s);
        p !== void 0 && U.set(p, [
          ...d
        ]);
      }
      const Y = /* @__PURE__ */ new Map();
      for (const [s, d] of l.diaphragms.entries()) {
        const p = k.get(s);
        p !== void 0 && Y.set(p, d);
      }
      const de = /* @__PURE__ */ new Map();
      for (const [s, d] of l.masses.entries()) {
        const p = k.get(s);
        p !== void 0 && de.set(p, d);
      }
      if (l.frameLoads.size) {
        const s = (d, p) => {
          const a = U.get(d) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          U.set(d, [
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
          const v = k.get(a.nI), b = k.get(a.nJ);
          if (v === void 0 || b === void 0) continue;
          const u = y[v], f = y[b], F = [
            f[0] - u[0],
            f[1] - u[1],
            f[2] - u[2]
          ], C = Math.hypot(F[0], F[1], F[2]);
          if (C < 1e-9) continue;
          const x = [
            F[0] / C,
            F[1] / C,
            F[2] / C
          ], I = C * C / 12, w = [
            x[1] * p[2] - x[2] * p[1],
            x[2] * p[0] - x[0] * p[2],
            x[0] * p[1] - x[1] * p[0]
          ];
          s(v, [
            p[0] * C / 2,
            p[1] * C / 2,
            p[2] * C / 2,
            I * w[0],
            I * w[1],
            I * w[2]
          ]), s(b, [
            p[0] * C / 2,
            p[1] * C / 2,
            p[2] * C / 2,
            -I * w[0],
            -I * w[1],
            -I * w[2]
          ]);
        }
      }
      const ne = /* @__PURE__ */ new Map(), P = 1 / Math.sqrt(3), he = [
        [
          -P,
          -P
        ],
        [
          P,
          -P
        ],
        [
          P,
          P
        ],
        [
          -P,
          P
        ]
      ];
      for (const s of l.shells) {
        const d = l.shellLoads.get(s.id);
        if (!d || l.deckTributario.has(s.id)) continue;
        const p = s.pts.map((b) => k.get(b));
        if (p.some((b) => b === void 0)) {
          l.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const a = p.map((b) => y[b]), v = [
          0,
          0,
          0,
          0
        ];
        for (const [b, u] of he) {
          const f = [
            0.25 * (1 - b) * (1 - u),
            0.25 * (1 + b) * (1 - u),
            0.25 * (1 + b) * (1 + u),
            0.25 * (1 - b) * (1 + u)
          ], F = [
            -0.25 * (1 - u),
            0.25 * (1 - u),
            0.25 * (1 + u),
            -0.25 * (1 + u)
          ], C = [
            -0.25 * (1 - b),
            -0.25 * (1 + b),
            0.25 * (1 + b),
            0.25 * (1 - b)
          ], x = [
            0,
            1,
            2
          ].map((T) => F.reduce((V, N, K) => V + N * a[K][T], 0)), I = [
            0,
            1,
            2
          ].map((T) => C.reduce((V, N, K) => V + N * a[K][T], 0)), w = [
            x[1] * I[2] - x[2] * I[1],
            x[2] * I[0] - x[0] * I[2],
            x[0] * I[1] - x[1] * I[0]
          ], W = Math.hypot(w[0], w[1], w[2]);
          for (let T = 0; T < 4; T++) v[T] += f[T] * d * W;
        }
        for (let b = 0; b < 4; b++) {
          const u = p[b], f = U.get(u) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          f[2] += v[b], U.set(u, f), ne.set(u, (ne.get(u) ?? 0) + v[b]);
        }
      }
      if (l.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [a, v] of q) l.deckTributario.has(a) && d.add(v);
        const p = (a, v) => {
          const b = U.get(a) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          b[2] += v, U.set(a, b);
        };
        M.forEach((a, v) => {
          const b = h.get(v) ?? 0;
          if (b && !d.has(v)) {
            if (a.length === 2) {
              const u = e.get(v) ?? 0, f = y[a[0]], F = y[a[1]], C = [
                F[0] - f[0],
                F[1] - f[1],
                F[2] - f[2]
              ];
              let x = Math.hypot(C[0], C[1], C[2]);
              const I = z.get(v);
              if (I) {
                const G = Math.hypot(C[0], C[1]);
                G > 1e-9 && Math.abs(Math.atan2(Math.abs(C[2]), G)) * 180 / Math.PI < 20 && (x = Math.max(x - I[0] - I[1], 0));
              }
              const w = Math.hypot(C[0], C[1], C[2]), W = -u * b * 9.80665 * l.selfWeight, T = [
                C[0] / w,
                C[1] / w,
                C[2] / w
              ], V = x * x / 12, N = [
                T[1] * W,
                -T[0] * W,
                0
              ], K = (G, Q) => {
                const re = U.get(G) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                U.set(G, [
                  re[0] + Q[0],
                  re[1] + Q[1],
                  re[2] + Q[2],
                  re[3] + Q[3],
                  re[4] + Q[4],
                  re[5] + Q[5]
                ]);
              };
              K(a[0], [
                0,
                0,
                W * x / 2,
                V * N[0],
                V * N[1],
                0
              ]), K(a[1], [
                0,
                0,
                W * x / 2,
                -V * N[0],
                -V * N[1],
                0
              ]);
            } else if (a.length === 4) {
              const u = X.get(v) ?? 0, f = a.map((x) => y[x]);
              let F = 0;
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
                F += Math.hypot(W[0], W[1], W[2]) / 2;
              }
              const C = F * u * b * 9.80665 * l.selfWeight;
              for (const x of a) p(x, -C / 4);
            }
          }
        });
      }
      const ee = [];
      for (const s of l.springs) {
        const d = k.get(s.node);
        d !== void 0 && ee.push({
          node: d,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of l.areaSprings) {
        const d = q.get(s.id);
        if (d === void 0) {
          l.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        ee.push({
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
            for (const b of a) s.add(b);
          }
        });
        let p = 0;
        for (const a of d) {
          const v = M[a], b = v.map((f) => y[f]), u = [
            0,
            1,
            2
          ].map((f) => [
            Math.min(...b.map((F) => F[f])),
            Math.max(...b.map((F) => F[f]))
          ]);
          for (let f = 0; f < y.length; f++) {
            if (v.includes(f)) continue;
            const F = y[f];
            if (F[0] < u[0][0] - 1e-6 || F[0] > u[0][1] + 1e-6 || F[1] < u[1][0] - 1e-6 || F[1] > u[1][1] + 1e-6 || F[2] < u[2][0] - 1e-6 || F[2] > u[2][1] + 1e-6) continue;
            let C = false;
            for (let I = 0; I < v.length && !C; I++) {
              const w = b[I], W = b[(I + 1) % v.length], T = [
                W[0] - w[0],
                W[1] - w[1],
                W[2] - w[2]
              ], V = T[0] * T[0] + T[1] * T[1] + T[2] * T[2];
              if (V < 1e-24) continue;
              const N = [
                F[0] - w[0],
                F[1] - w[1],
                F[2] - w[2]
              ], K = (N[0] * T[0] + N[1] * T[1] + N[2] * T[2]) / V;
              if (K <= 1e-6 || K >= 1 - 1e-6) continue;
              const G = [
                N[0] - K * T[0],
                N[1] - K * T[1],
                N[2] - K * T[2]
              ];
              Math.hypot(G[0], G[1], G[2]) <= 1e-6 * Math.sqrt(V) && (C = true);
            }
            !C || !M.some((I, w) => w !== a && I.includes(f)) || (ee.push({
              node: -(a + 1),
              dof: -2,
              k: f
            }), p++);
          }
        }
        p && console.log(`[CLI Modeler] edge etabs: ${p} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const se = [];
      for (const s of l.solids) {
        const d = s.pts.map((a) => k.get(a));
        if (d.some((a) => a === void 0)) {
          l.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = M.length;
        M.push(d), o.set(p, s.E), J.set(p, s.nu), A.set(p, s.E / (2 * (1 + s.nu))), h.set(p, s.rho), se.push(p);
      }
      t.nodes.val = y, t.elements.val = M, t.nodeInputs.val = {
        supports: H,
        loads: U,
        masses: de,
        diaphragms: Y,
        springs: ee
      }, t.springs && (t.springs.val = ee);
      const te = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), ge = /* @__PURE__ */ new Map();
      for (const s of l.shells) {
        const d = q.get(s.id);
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
        const b = l.shellMods.get(s.id);
        b && (te.set(d, b[0]), ue.set(d, b[1]));
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
        thicknesses: X,
        membraneModifiers: te,
        bendingModifiers: ue,
        shellModifiers: Ie,
        shellSurfaceLoads: ae,
        shellAngles: ge,
        cargaDeArea: ne,
        cantos: S,
        anchos: E,
        sectionShapes: m,
        localAngles: L,
        shearAreasY: D,
        shearAreasZ: O,
        momentReleases: g,
        endOffsets: z,
        plateFormulations: j,
        frameLoads: R,
        meshAtIntersections: l.meshCross,
        solidIncompatible: l.solidIncompatible,
        selfWeight: l.selfWeight,
        etabsWallJoint: l.etabsWallJoint,
        areaObjects: l.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => k.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => q.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => l.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => l.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, l.doSolve && se.length > 0 && se.length === M.length) try {
        const s = o.get(se[0]) ?? 25e6, d = J.get(se[0]) ?? 0.2;
        se.some((u) => Math.abs((o.get(u) ?? s) - s) > 1e-9 * s || Math.abs((J.get(u) ?? d) - d) > 1e-12) && l.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
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
        const v = qe({
          nodes: y,
          elements: M,
          E: s,
          nu: d,
          supports: p,
          loads: a,
          incompatible: l.solidIncompatible
        }), b = /* @__PURE__ */ new Map();
        v.displacements.forEach(([u, f, F], C) => b.set(C, [
          u,
          f,
          F,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: b,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: v.stressPerElement,
          solidVonMises: v.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${M.length} solidos H8, ${y.length} nodos (${v.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        l.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (l.doSolve && y.length && M.length) try {
        window.__hekatanCliSprings = ee, t.deformOutputs.val = Re(y, M, t.nodeInputs.val, t.elementInputs.val, ee.length ? ee : void 0);
        try {
          t.analyzeOutputs.val = Be(y, M, t.elementInputs.val, t.deformOutputs.val);
        } catch (s) {
          console.warn("[CLI Modeler] analyze:", (s == null ? void 0 : s.message) ?? s);
        }
        if (l.areaSprings.length > 0) try {
          const s = t.deformOutputs.val.deformations, d = t.analyzeOutputs.val ?? {}, p = d.pressure instanceof Map ? d.pressure : /* @__PURE__ */ new Map();
          let a = 0, v = 0;
          for (const b of l.areaSprings) {
            const u = q.get(b.id);
            if (u === void 0) continue;
            const F = M[u].map((C) => {
              var _a2;
              const x = ((_a2 = s.get(C)) == null ? void 0 : _a2[2]) ?? 0, I = b.ks * x;
              return I < a && (a = I), I > v && (v = I), I;
            });
            p.set(u, F);
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
        if (se.length > 0) try {
          const s = t.deformOutputs.val.deformations, d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
          for (const a of se) {
            const v = M[a], b = v.map((F) => y[F]), u = v.flatMap((F) => {
              const C = s.get(F) ?? [
                0,
                0,
                0
              ];
              return [
                C[0],
                C[1],
                C[2]
              ];
            }), f = _e(b, o.get(a) ?? 25e6, J.get(a) ?? 0.2, u, l.solidIncompatible);
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
        console.log("[CLI Modeler] Solve OK \u2014", M.length, "elementos,", y.length, "nodos");
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
        nodes: y.length,
        frames: l.frames.length,
        shells: l.shells.length,
        supports: H.size,
        loads: U.size,
        springs: ee.length,
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
  He as c,
  Xe as p
};
