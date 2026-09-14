import { c as We, a as qe } from "./cadSections-DVtTZU6U.js";
import { h as _e, a as Be, __tla as __tla_0 } from "./h8-CE0H6FD1.js";
import { a as Ne } from "./analyze-DgLgRmKg.js";
import { m as Re, d as Xe, __tla as __tla_1 } from "./didacticCpp-reRUqpUx.js";
let es, Ue;
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
    ], c = t.split(/[\s,]+/).filter(Boolean);
    if (c.length > 1 && c.length <= 6 && c.every((x) => x === "0" || x === "1")) return c.forEach((x, W) => {
      $[W] = x === "1";
    }), $;
    for (const x of c) Ae[x] !== void 0 && ($[Ae[x]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let x = 0; x < t.length; x++) $[x] = t[x] === "1";
    return $;
  }
  Ue = function(r) {
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
      deckSecs: /* @__PURE__ */ new Map(),
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
    let $ = null, c = 0, x = 0, W = 0;
    const y = r.split(/\r?\n/);
    for (let q = 0; q < y.length; q++) {
      let F = y[q].trim();
      if (!F || F.startsWith("#") || F.startsWith("//")) continue;
      F = F.replace(/[;]+$/, "");
      const o = F.split(/\s+/), S = o[0].toLowerCase();
      if (S === "nodes" && o.length === 1) {
        $ = "nodes";
        continue;
      }
      if ((S === "elements" || S === "frames") && o.length === 1) {
        $ = "elements";
        continue;
      }
      if (S === "areas" && o.length === 1) {
        $ = "areas";
        continue;
      }
      if (S === "supports" && o.length === 1) {
        $ = "supports";
        continue;
      }
      if (S === "loads" && o.length === 1) {
        $ = "loads";
        continue;
      }
      if (S === "springs" && o.length === 1) {
        $ = "springs";
        continue;
      }
      if ($ && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if ($ === "nodes" && e.length >= 3) {
          c++, t.nodes.set(c, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if ($ === "elements" && e.length >= 2) {
          x++, t.frames.push({
            id: x,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if ($ === "areas" && e.length >= 4) {
          W++, t.shells.push({
            id: W,
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
        const e = parseInt(o[0], 10), a = o.slice(1).join(" ");
        t.supports.set(e, Oe(a));
        continue;
      }
      $ && !/^[\-\d]/.test(o[0]) && ($ = null);
      try {
        switch (S) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2]), n = parseFloat(o[3]), d = parseFloat(o[4]);
            !isFinite(e) || !isFinite(a) || !isFinite(n) || !isFinite(d) ? t.errors.push(`L${q + 1}: node mal formado: ${F}`) : t.nodes.set(e, [
              a,
              n,
              d
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const e = parseInt(o[1], 10), a = parseInt(o[2], 10), n = parseInt(o[3], 10), d = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.16"), A = parseFloat(o[6] ?? "0.001"), E = o[7] !== void 0 ? parseFloat(o[7]) : void 0, b = o[8] !== void 0 ? parseFloat(o[8]) : void 0, L = o[9] !== void 0 ? parseFloat(o[9]) : void 0, g = o[10] !== void 0 ? parseFloat(o[10]) : void 0, z = o[11] !== void 0 ? parseFloat(o[11]) : void 0, j = o[12] !== void 0 ? parseFloat(o[12]) : void 0, U = o.indexOf("#"), D = U >= 0 && o[U + 1] ? o[U + 1] : void 0;
            t.frames.push({
              id: e,
              nI: a,
              nJ: n,
              E: d,
              A: h,
              I: A,
              Iy: E,
              J: b,
              nu: L,
              rho: g,
              D: z,
              B: j,
              sec: D
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), d = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.2");
            isFinite(e) && a > 0 && n > 0 && n < a / 2 && d > 0 ? t.frameCftc.set(e, {
              D: a,
              t: n,
              Ec: d,
              nuC: isFinite(h) ? h : 0.2
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), d = parseFloat(o[4] ?? ""), h = parseFloat(o[5] ?? "25e6"), A = parseFloat(o[6] ?? "0.2");
            isFinite(e) && a > 0 && n > 0 && d > 0 && d < Math.min(a, n) / 2 && h > 0 ? t.frameCft.set(e, {
              b: a,
              h: n,
              t: d,
              Ec: h,
              nuC: isFinite(A) ? A : 0.2
            }) : t.errors.push(`cft ${o[1]}: hace falta b h t (m) y Ec (kN/m2), con t < min(b,h)/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0");
            isFinite(e) && isFinite(a) && isFinite(n) && t.frameShearAreas.set(e, [
              a,
              n
            ]);
            break;
          }
          case "release":
          case "rel": {
            const e = parseInt(o[1], 10), a = o.slice(2).map((d) => d.toLowerCase());
            if (!isFinite(e) || a.length === 0) {
              t.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const n = new Array(12).fill(false);
            if (a.length === 2 && a.every((d) => /^(pin|fix|libre|rigido)$/.test(d))) a.forEach((d, h) => {
              (d === "pin" || d === "libre") && (n[h * 6 + 4] = true, n[h * 6 + 5] = true);
            });
            else {
              const d = a.filter((h) => h === "0" || h === "1");
              if (d.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${d.length}`);
                break;
              }
              for (let h = 0; h < 12; h++) n[h] = d[h] === "1";
            }
            n.some(Boolean) && t.frameReleases.set(e, n);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const e = parseInt(o[1], 10), a = o.slice(2, 10).map((n) => parseInt(n, 10));
            if (!isFinite(e) || a.length !== 8 || a.some((n) => !isFinite(n))) {
              t.errors.push(`hex ${o[1]}: hacen falta 8 nudos`);
              break;
            }
            t.solids.push({
              id: e,
              pts: a,
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
            const e = (o[1] ?? "safe").toLowerCase(), a = e === "safe" ? 0.1 : parseFloat(e);
            t.torsionFactor = isFinite(a) && a > 0 ? a : 1;
            break;
          }
          case "decksec": {
            const e = parseInt(o[1], 10), a = o.slice(2).map(parseFloat);
            if (!isFinite(e) || a.length < 5 || a.slice(0, 5).some((n) => !isFinite(n) || n < 0) || !(a[0] > 0)) {
              t.errors.push(`decksec ${o[1]}: se esperaba ID tc hr wrt wrb sr [w]`);
              break;
            }
            t.deckSecs.set(e, {
              tc: a[0],
              hr: a[1],
              wrt: a[2],
              wrb: a[3],
              sr: a[4],
              w: isFinite(a[5]) ? a[5] : 0
            });
            break;
          }
          case "deck":
          case "deckmode": {
            const e = (o[1] ?? "etabs").toLowerCase();
            t.deckEtabs = e === "etabs" || e === "1" || e === "on" || e === "si", t.deckOneWay = o.slice(2).some((a) => /^(oneway|1way|unidireccional)$/i.test(a));
            break;
          }
          case "areaspring":
          case "winkler":
          case "springarea":
          case "winklerarea": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = o.slice(3).some((d) => /^(nodal|lumped|sap|etabs)$/i.test(d));
            isFinite(e) && isFinite(a) && a !== 0 ? t.areaSprings.push({
              id: e,
              ks: a,
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
            const a = parseFloat(e);
            t.autoMesh = isFinite(a) && a > 0 ? a : 1.25;
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
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), d = parseFloat(o[4] ?? "0");
            if (!isFinite(e) || !isFinite(a) || !isFinite(n)) {
              t.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            t.frameEndOffsets.set(e, [
              a,
              n,
              isFinite(d) ? d : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0");
            isFinite(e) && isFinite(a) && t.frameAngles.set(e, a);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const e = parseInt(o[1], 10), a = [
              parseInt(o[2], 10),
              parseInt(o[3], 10),
              parseInt(o[4], 10),
              parseInt(o[5], 10)
            ], n = parseFloat(o[6] ?? "0.20"), d = parseFloat(o[7] ?? "25e6"), h = o[9] !== void 0 ? parseFloat(o[9]) : void 0, A = h !== void 0 && isFinite(h) ? h : void 0;
            if (t.shells.push({
              id: e,
              pts: a,
              t: n,
              E: d,
              rho: A
            }), o[8] !== void 0) {
              const E = parseFloat(o[8]);
              isFinite(E) && E !== 0 && t.shellLoads.set(e, E);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const e = parseInt(o[1], 10), a = (o[2] ?? "").toLowerCase();
            if (!isFinite(e)) break;
            let n;
            if (a === "thin" || a === "delgada" || a === "kirchhoff" || a === "1" ? n = 1 : (a === "thick" || a === "gruesa" || a === "mindlin" || a === "0") && (n = 0), n === void 0) {
              t.errors.push(`shelltype ${e}: se esperaba thin o thick`);
              break;
            }
            t.shellTypes.set(e, n);
            break;
          }
          case "shellmod": {
            const e = parseInt(o[1], 10);
            if (!isFinite(e)) break;
            const a = o.slice(2).map(parseFloat);
            if (a.length >= 8) t.shellModsDir.set(e, a.slice(0, 8).map((n) => isFinite(n) ? n : 1));
            else {
              const n = a[0], d = a[1];
              t.shellMods.set(e, [
                isFinite(n) ? n : 1,
                isFinite(d) ? d : 1
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
            const [a, n, d, h, A, E, b] = e, L = [];
            for (let g = E; g <= b; g++) L.push(g);
            t.areaObjs.push({
              id: a,
              pts: [
                n,
                d,
                h,
                A
              ],
              cells: L
            });
            break;
          }
          case "shellang": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2]);
            if (!isFinite(e) || !isFinite(a)) {
              t.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            t.shellAngles.set(e, a);
            break;
          }
          case "areaload":
          case "qarea": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2]);
            if (!isFinite(e) || !isFinite(a)) {
              t.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            t.shellLoads.set(e, a);
            break;
          }
          case "support":
          case "fix": {
            const e = parseInt(o[1], 10), a = o.slice(2).join(" ");
            t.supports.set(e, Oe(a));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), d = parseFloat(o[4] ?? "0"), h = parseFloat(o[5] ?? "0"), A = parseFloat(o[6] ?? "0"), E = parseFloat(o[7] ?? "0");
            t.loads.set(e, [
              a,
              n,
              d,
              h,
              A,
              E
            ]);
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), d = parseFloat(o[4] ?? "0"), h = t.frameLoads.get(e) ?? [
              0,
              0,
              0
            ];
            t.frameLoads.set(e, [
              h[0] + a,
              h[1] + n,
              h[2] + d
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(o[1], 10), a = (o[2] ?? "uz").toLowerCase(), n = Ae[a] ?? 2, d = parseFloat(o[3] ?? "1000");
            t.springs.push({
              node: e,
              dof: n,
              k: d
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const e = parseInt(o[1], 10), a = parseInt(o[2] ?? "1", 10);
            isFinite(e) && isFinite(a) && a > 0 && t.diaphragms.set(e, a);
            break;
          }
          case "mass": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0");
            Number.isFinite(e) && Number.isFinite(a) ? t.masses.set(e, (t.masses.get(e) ?? 0) + a) : t.errors.push(`L${q + 1}: mass necesita <nudo> <toneladas>`);
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
            t.errors.push(`L${q + 1}: comando desconocido "${S}"`);
        }
      } catch (e) {
        t.errors.push(`L${q + 1}: error "${F}" \u2014 ${e.message}`);
      }
    }
    return t;
  };
  const Ye = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, N = (r, t) => [
    r[0] - t[0],
    r[1] - t[1],
    r[2] - t[2]
  ], ce = (r, t) => r[0] * t[0] + r[1] * t[1] + r[2] * t[2], me = (r, t) => [
    r[1] * t[2] - r[2] * t[1],
    r[2] * t[0] - r[0] * t[2],
    r[0] * t[1] - r[1] * t[0]
  ], G = (r) => Math.hypot(r[0], r[1], r[2]), ne = (r, t) => [
    r[0] * t,
    r[1] * t,
    r[2] * t
  ];
  function Te(r, t) {
    const $ = r.shellModsDir.get(t);
    return !!$ && Math.abs($[3]) < 1e-12 && Math.abs($[4]) < 1e-12 && Math.abs($[5]) < 1e-12;
  }
  function Ge(r, t = 200, $) {
    const c = [
      0,
      1,
      2
    ].map((b) => (r[0][b] + r[1][b] + r[2][b] + r[3][b]) / 4);
    let x = N(r[1], r[0]), W = me(x, N(r[3], r[0]));
    W = ne(W, 1 / G(W)), x = ne(x, 1 / G(x));
    const y = me(W, x), q = r.map((b) => [
      ce(N(b, c), x),
      ce(N(b, c), y)
    ]);
    let F = [
      0,
      1,
      2,
      3
    ];
    if ($) {
      const b = [
        0,
        1,
        2,
        3
      ].map((L) => {
        const g = N(r[(L + 1) % 4], r[L]);
        return Math.abs(ce(g, $)) / G(g);
      });
      F = [
        0,
        1,
        2,
        3
      ].sort((L, g) => b[L] - b[g]).slice(0, 2);
    }
    const o = q.map((b) => b[0]), S = q.map((b) => b[1]), e = Math.min(...o), a = Math.max(...o), n = Math.min(...S), d = Math.max(...S), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let A = 0;
    for (let b = 0; b < t; b++) for (let L = 0; L < t; L++) {
      const g = e + (a - e) * (b + 0.5) / t, z = n + (d - n) * (L + 0.5) / t;
      let j = 0, U = 0;
      for (let X = 0; X < 4; X++) {
        const _ = q[X], Q = q[(X + 1) % 4];
        (Q[0] - _[0]) * (z - _[1]) - (Q[1] - _[1]) * (g - _[0]) >= 0 ? j++ : U++;
      }
      if (j !== 4 && U !== 4) continue;
      let D = F[0], O = 1 / 0;
      for (const X of F) {
        const _ = q[X], Q = q[(X + 1) % 4], te = Q[0] - _[0], B = Q[1] - _[1], le = te * te + B * B, re = Math.max(0, Math.min(1, ((g - _[0]) * te + (z - _[1]) * B) / le)), oe = Math.hypot(g - (_[0] + re * te), z - (_[1] + re * B));
        oe < O && (O = oe, D = X);
      }
      h[D].pts.push([
        c[0] + g * x[0] + z * y[0],
        c[1] + g * x[1] + z * y[1],
        c[2] + g * x[2] + z * y[2]
      ]), A++;
    }
    const E = 0.5 * G(me(N(r[2], r[0]), N(r[3], r[1])));
    for (const b of h) b.dA = A ? E / A : 0;
    return h;
  }
  function Ze(r, t) {
    if (!(t > 0)) return;
    const $ = 1e-6, c = (S) => r.nodes.get(S);
    let x = Math.max(0, ...r.nodes.keys()) + 1, W = r.shells.reduce((S, e) => Math.max(S, e.id), 0) + 1;
    const y = (S) => {
      for (const [a, n] of r.nodes) if (G(N(n, S)) < $) return a;
      const e = x++;
      return r.nodes.set(e, [
        S[0],
        S[1],
        S[2]
      ]), e;
    }, q = (S, e) => {
      const a = r.shellModsDir.get(S);
      a && r.shellModsDir.set(e, [
        ...a
      ]);
      const n = r.shellMods.get(S);
      n && r.shellMods.set(e, [
        ...n
      ]);
      const d = r.shellLoads.get(S);
      d !== void 0 && r.shellLoads.set(e, d);
      const h = r.shellTypes.get(S);
      h !== void 0 && r.shellTypes.set(e, h);
      const A = r.shellAngles.get(S);
      A !== void 0 && r.shellAngles.set(e, A);
    }, F = [];
    let o = 0;
    for (const S of r.shells) {
      if (S.pts.length !== 4) {
        F.push(S);
        continue;
      }
      const e = S.pts.map(c);
      if (e.some((b) => !b)) {
        F.push(S);
        continue;
      }
      const a = (G(N(e[1], e[0])) + G(N(e[2], e[3]))) / 2, n = (G(N(e[3], e[0])) + G(N(e[2], e[1]))) / 2, d = Math.max(1, Math.ceil(a / t - 1e-9)), h = Math.max(1, Math.ceil(n / t - 1e-9));
      if (d === 1 && h === 1) {
        F.push(S);
        continue;
      }
      const A = (b, L) => [
        0,
        1,
        2
      ].map((g) => e[0][g] * (1 - b) * (1 - L) + e[1][g] * b * (1 - L) + e[2][g] * b * L + e[3][g] * (1 - b) * L), E = [];
      for (let b = 0; b <= d; b++) {
        const L = [];
        for (let g = 0; g <= h; g++) L.push(y(A(b / d, g / h)));
        E.push(L);
      }
      for (let b = 0; b < d; b++) for (let L = 0; L < h; L++) {
        const g = b === 0 && L === 0 ? S.id : W++;
        F.push({
          ...S,
          id: g,
          pts: [
            E[b][L],
            E[b + 1][L],
            E[b + 1][L + 1],
            E[b][L + 1]
          ]
        }), g !== S.id && q(S.id, g);
      }
      o++;
    }
    o && (r.shells = F, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${r.shells.length} cascaras, ${r.nodes.size} nudos`));
  }
  function Ve(r) {
    const $ = (n) => r.nodes.get(n), c = [
      ...r.nodes.keys()
    ], x = (n, d, h) => {
      const A = N(d, n), E = G(A), b = ne(A, 1 / E), L = [];
      for (const g of c) {
        if (h.includes(g)) continue;
        const z = N($(g), n), j = ce(z, b);
        j > 1e-6 && j < E - 1e-6 && G(N(z, ne(b, j))) < 1e-4 && L.push(j / E);
      }
      return L.sort((g, z) => g - z);
    }, W = (n, d) => {
      const h = [];
      for (const A of n) d.some((E) => Math.abs(A - E) < 1e-5) && !h.some((E) => Math.abs(A - E) < 1e-5) && h.push(A);
      return h;
    }, y = (n) => {
      for (const d of c) if (G(N($(d), n)) < 1e-4) return d;
    };
    let q = r.shells.reduce((n, d) => Math.max(n, d.id), 0) + 1;
    const F = [], o = (n, d) => {
      const h = r.shellModsDir.get(n);
      h && r.shellModsDir.set(d, [
        ...h
      ]);
      const A = r.shellMods.get(n);
      A && r.shellMods.set(d, [
        ...A
      ]);
      const E = r.shellLoads.get(n);
      E !== void 0 && r.shellLoads.set(d, E);
      const b = r.shellTypes.get(n);
      b !== void 0 && r.shellTypes.set(d, b);
      const L = r.shellAngles.get(n);
      L !== void 0 && r.shellAngles.set(d, L);
    };
    for (const n of r.shells) {
      if (!Te(r, n.id) || n.pts.length !== 4 || n.pts.some((D) => !r.nodes.has(D))) {
        F.push(n);
        continue;
      }
      const d = n.pts.map($), h = x(d[0], d[1], n.pts), A = x(d[2], d[3], n.pts).map((D) => 1 - D), E = x(d[1], d[2], n.pts), b = x(d[3], d[0], n.pts).map((D) => 1 - D);
      let L = [
        0,
        ...W(h, A),
        1
      ], g = [
        0,
        ...W(E, b),
        1
      ];
      if (L.length === 2 && g.length === 2) {
        F.push(n);
        continue;
      }
      const z = (D, O) => [
        0,
        1,
        2
      ].map((X) => (1 - D) * (1 - O) * d[0][X] + D * (1 - O) * d[1][X] + D * O * d[2][X] + (1 - D) * O * d[3][X]);
      let j = g.map((D) => L.map((O) => y(z(O, D))));
      if (j.some((D) => D.some((O) => O === void 0)) && (L.length >= g.length ? g = [
        0,
        1
      ] : L = [
        0,
        1
      ], j = g.map((D) => L.map((O) => y(z(O, D)))), j.some((D) => D.some((O) => O === void 0)))) {
        F.push(n);
        continue;
      }
      let U = true;
      for (let D = 0; D < g.length - 1; D++) for (let O = 0; O < L.length - 1; O++) {
        const X = [
          j[D][O],
          j[D][O + 1],
          j[D + 1][O + 1],
          j[D + 1][O]
        ], _ = U ? n.id : q++;
        U || o(n.id, _), U = false, F.push({
          id: _,
          pts: X,
          t: n.t,
          E: n.E,
          rho: n.rho
        });
      }
    }
    r.shells = F;
    const S = 9.80665, e = (n, d) => {
      const h = r.loads.get(n) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      r.loads.set(n, [
        h[0] + d[0],
        h[1] + d[1],
        h[2] + d[2],
        h[3] + d[3],
        h[4] + d[4],
        h[5] + d[5]
      ]);
    }, a = (n, d) => {
      const h = N(d, n), A = G(h), E = ne(h, 1 / A);
      return r.frames.filter((b) => [
        b.nI,
        b.nJ
      ].every((L) => {
        const g = r.nodes.get(L);
        if (!g) return false;
        const z = N(g, n), j = ce(z, E);
        return j > -1e-4 && j < A + 1e-4 && G(N(z, ne(E, j))) < 1e-4;
      }));
    };
    for (const n of r.shells) {
      if (!Te(r, n.id) || n.pts.length !== 4) continue;
      const d = r.selfWeight ? (n.rho ?? 2.45) * n.t * S * r.selfWeight : 0, h = r.shellLoads.get(n.id) ?? 0, A = -d + h;
      if (Math.abs(A) < 1e-15) continue;
      const E = n.pts.map($);
      let b;
      if (r.deckOneWay) {
        const g = N(E[1], E[0]);
        let z = me(g, N(E[3], E[0]));
        z = ne(z, 1 / G(z));
        const j = ne(g, 1 / G(g)), U = me(z, j), D = (r.shellAngles.get(n.id) ?? 0) * Math.PI / 180;
        b = [
          0,
          1,
          2
        ].map((O) => Math.cos(D) * j[O] + Math.sin(D) * U[O]);
      }
      const L = Ge(E, 200, b);
      for (let g = 0; g < 4; g++) {
        const { pts: z, dA: j } = L[g];
        if (!z.length) continue;
        const U = E[g], D = E[(g + 1) % 4], O = a(U, D);
        if (!O.length) {
          const B = A * j * z.length;
          e(n.pts[g], [
            0,
            0,
            B / 2,
            0,
            0,
            0
          ]), e(n.pts[(g + 1) % 4], [
            0,
            0,
            B / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const X = N(D, U), _ = G(X), Q = ne(X, 1 / _), te = z.map((B) => ce(N(B, U), Q));
        for (const B of O) {
          const le = $(B.nI), re = $(B.nJ), oe = ce(N(le, U), Q), se = ce(N(re, U), Q), Me = Math.min(oe, se), H = Math.max(oe, se), K = H - Me;
          if (K < 1e-9) continue;
          const he = H >= _ - 1e-6, ue = ne(N(re, le), 1 / K), ae = me(ue, [
            0,
            0,
            1
          ]);
          let be = 0, de = 0, ge = 0, fe = 0;
          for (const s of te) {
            if (s < Me - 1e-9 || (he ? s > H + 1e-9 : s >= H - 1e-9)) continue;
            let f = s - Me;
            oe > se && (f = K - f);
            const i = f / K;
            be += 1 - 3 * i * i + 2 * i * i * i, de += K * (i - 2 * i * i + i * i * i), ge += 3 * i * i - 2 * i * i * i, fe += K * (-i * i + i * i * i);
          }
          const ee = A * j;
          e(B.nI, [
            0,
            0,
            ee * be,
            ae[0] * ee * de,
            ae[1] * ee * de,
            ae[2] * ee * de
          ]), e(B.nJ, [
            0,
            0,
            ee * ge,
            ae[0] * ee * fe,
            ae[1] * ee * fe,
            ae[2] * ee * fe
          ]);
        }
      }
      r.deckTributario.add(n.id), r.shellLoads.delete(n.id);
    }
  }
  es = {
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
      const c = t.nodes.val, x = t.elements.val;
      if (!(!c.length || !x.length)) try {
        const W = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), y = t.nodeInputs.val, q = window.__hekatanCliSprings, F = Re(c, x, y, t.elementInputs.val, W, 0, 0, 1, (y == null ? void 0 : y.diaphragms) instanceof Map && y.diaphragms.size ? y.diaphragms : void 0, q && q.length ? q : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${F.frequencies.length} modos, T1 = ${F.frequencies[0] ? (1 / F.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = $ == null ? void 0 : $.render) == null ? void 0 : _a.call($, F, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (W) {
        console.error("[CLI Modeler] modal:", (W == null ? void 0 : W.message) ?? W);
      }
    },
    build(r, t) {
      var _a, _b;
      const $ = window.__hekatanCliScript ?? Ye;
      window.__hekatanCliLastScript = $;
      const c = Ue($);
      c.autoMesh > 0 && Ze(c, c.autoMesh), c.deckEtabs && Ve(c);
      const x = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), y = [], q = Array.from(c.nodes.keys()).sort((s, f) => s - f);
      for (const s of q) x.set(s, y.length), y.push(c.nodes.get(s));
      const F = [], o = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map();
      for (const s of c.frames) {
        const f = x.get(s.nI), i = x.get(s.nJ);
        if (f === void 0 || i === void 0) {
          const w = q.length ? `IDs disponibles: ${q.join(", ")}` : "ning\xFAn nodo definido", J = [];
          f === void 0 && J.push(s.nI), i === void 0 && J.push(s.nJ), c.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${J.join(", ")}] \u2014 ${w}`);
          continue;
        }
        const l = F.length;
        F.push([
          f,
          i
        ]);
        const m = s.nu ?? 0.2;
        o.set(l, s.E), S.set(l, s.E / (2 * (1 + m))), e.set(l, s.A), a.set(l, s.I), n.set(l, s.Iy ?? s.I), d.set(l, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), h.set(l, s.rho ?? 2.45), _.set(l, m), s.D !== void 0 && isFinite(s.D) && A.set(l, s.D), s.B !== void 0 && isFinite(s.B) && E.set(l, s.B);
        const M = c.frameAngles.get(s.id);
        M !== void 0 && isFinite(M) && L.set(l, M);
        const u = c.frameReleases.get(s.id);
        u && g.set(l, u);
        const p = c.frameEndOffsets.get(s.id);
        p && z.set(l, p);
        const I = c.frameLoads.get(s.id);
        I && D.set(l, I);
        const C = c.frameShearAreas.get(s.id);
        if (C && (X.set(l, C[0]), O.set(l, C[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const w = {
            type: "general"
          };
          s.sec && (w.name = s.sec), s.D !== void 0 && isFinite(s.D) && (w.h = s.D), s.B !== void 0 && isFinite(s.B) && (w.b = s.B), b.set(l, w);
        }
        const k = c.frameCftc.get(s.id);
        if (k) {
          const w = We(k.D, k.t, s.E, m, k.Ec, k.nuC);
          e.set(l, w.A), n.set(l, w.Iz), a.set(l, w.Iy), d.set(l, w.J), X.set(l, w.As2), O.set(l, w.As3), A.set(l, k.D), E.set(l, k.D), b.set(l, {
            type: "CFT",
            d: k.D,
            tw: k.t,
            fillE: k.Ec,
            name: s.sec ?? `CFTC ${Math.round(k.D * 1e3)}X${Math.round(k.t * 1e3)}`
          });
        }
        const v = c.frameCft.get(s.id);
        if (v) {
          const w = qe(v.b, v.h, v.t, s.E, m, v.Ec, v.nuC);
          e.set(l, w.A), n.set(l, w.Iz), a.set(l, w.Iy), d.set(l, w.J), X.set(l, w.As2), O.set(l, w.As3), A.set(l, v.h), E.set(l, v.b), b.set(l, {
            type: "CFT",
            b: v.b,
            h: v.h,
            tw: v.t,
            fillE: v.Ec,
            name: s.sec ?? `CFT ${Math.round(v.h * 1e3)}X${Math.round(v.b * 1e3)}X${Math.round(v.t * 1e3)}`
          });
        }
      }
      if (c.meshCross) {
        const s = (u, p) => u[0] * p[0] + u[1] * p[1] + u[2] * p[2], f = [
          o,
          S,
          e,
          a,
          n,
          d,
          h,
          _,
          A,
          E,
          L,
          O,
          X,
          b,
          D
        ], i = (u, p) => {
          for (const I of f) I.has(u) && I.set(p, I.get(u));
        }, l = (u) => {
          for (let p = 0; p < y.length; p++) if (Math.hypot(y[p][0] - u[0], y[p][1] - u[1], y[p][2] - u[2]) < 1e-6) return p;
          return y.push([
            u[0],
            u[1],
            u[2]
          ]), y.length - 1;
        }, m = (u) => {
          const p = y[u[0]], I = y[u[1]];
          return [
            Math.min(p[0], I[0]),
            Math.min(p[1], I[1]),
            Math.min(p[2], I[2]),
            Math.max(p[0], I[0]),
            Math.max(p[1], I[1]),
            Math.max(p[2], I[2])
          ];
        };
        let M = 0;
        for (let u = 0; u < F.length; u++) {
          if (F[u].length !== 2) continue;
          const p = m(F[u]);
          for (let I = u + 1; I < F.length; I++) {
            if (F[I].length !== 2) continue;
            const [C, k] = F[u], [v, w] = F[I];
            if (C === v || C === w || k === v || k === w) continue;
            const J = m(F[I]);
            if (p[0] > J[3] + 1e-6 || J[0] > p[3] + 1e-6 || p[1] > J[4] + 1e-6 || J[1] > p[4] + 1e-6 || p[2] > J[5] + 1e-6 || J[2] > p[5] + 1e-6) continue;
            const T = y[C], Z = y[k], R = y[v], V = y[w], Y = [
              Z[0] - T[0],
              Z[1] - T[1],
              Z[2] - T[2]
            ], P = [
              V[0] - R[0],
              V[1] - R[1],
              V[2] - R[2]
            ], ie = [
              T[0] - R[0],
              T[1] - R[1],
              T[2] - R[2]
            ], xe = s(Y, Y), we = s(Y, P), ye = s(P, P), $e = s(Y, ie), De = s(P, ie), Le = xe * ye - we * we;
            if (Le < 1e-10 * xe * ye) continue;
            const Fe = (we * De - ye * $e) / Le, Ie = (xe * De - we * $e) / Le;
            if (Fe < 1e-6 || Fe > 1 - 1e-6 || Ie < 1e-6 || Ie > 1 - 1e-6) continue;
            const ke = [
              T[0] + Fe * Y[0],
              T[1] + Fe * Y[1],
              T[2] + Fe * Y[2]
            ], Ce = [
              R[0] + Ie * P[0],
              R[1] + Ie * P[1],
              R[2] + Ie * P[2]
            ];
            if (Math.hypot(ke[0] - Ce[0], ke[1] - Ce[1], ke[2] - Ce[2]) > 1e-6) continue;
            const ze = l(ke);
            for (const pe of [
              u,
              I
            ]) {
              const [je, Je] = F[pe], Ee = F.length;
              F[pe] = [
                je,
                ze
              ], F.push([
                ze,
                Je
              ]), i(pe, Ee);
              const Se = g.get(pe);
              Se && (g.set(pe, [
                ...Se.slice(0, 6),
                ...Array(6).fill(false)
              ]), g.set(Ee, [
                ...Array(6).fill(false),
                ...Se.slice(6)
              ]));
              const ve = z.get(pe);
              ve && (z.set(pe, [
                ve[0],
                0,
                ve[2]
              ]), z.set(Ee, [
                0,
                ve[1],
                ve[2]
              ]));
            }
            M++;
          }
        }
        M > 0 && console.log(`[CLI Modeler] ${M} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of c.shells) {
        const f = s.pts.map((M) => x.get(M));
        if (f.some((M) => M === void 0)) {
          c.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = F.length;
        W.set(s.id, i), F.push(f), o.set(i, s.E), S.set(i, s.E / (2 * 1.2)), Q.set(i, s.t), h.set(i, s.rho ?? 2.45), _.set(i, 0.2);
        const l = c.shellTypes.get(s.id);
        l !== void 0 && j.set(i, l);
        const m = c.deckSecs.get(s.id);
        if (m) {
          const M = m.tc + (m.sr > 0 ? m.hr * (m.wrt + m.wrb) / 2 / m.sr : 0);
          Q.set(i, m.tc), h.set(i, ((s.rho ?? 2.45) * M + m.w / 9.80665) / m.tc), U.set(i, {
            ...m
          });
        }
      }
      const te = /* @__PURE__ */ new Map();
      for (const [s, f] of c.supports.entries()) {
        const i = x.get(s);
        i !== void 0 && te.set(i, f);
      }
      const B = /* @__PURE__ */ new Map();
      for (const [s, f] of c.loads.entries()) {
        const i = x.get(s);
        i !== void 0 && B.set(i, [
          ...f
        ]);
      }
      const le = /* @__PURE__ */ new Map();
      for (const [s, f] of c.diaphragms.entries()) {
        const i = x.get(s);
        i !== void 0 && le.set(i, f);
      }
      const re = /* @__PURE__ */ new Map();
      for (const [s, f] of c.masses.entries()) {
        const i = x.get(s);
        i !== void 0 && re.set(i, f);
      }
      if (c.frameLoads.size) {
        const s = (f, i) => {
          const l = B.get(f) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          B.set(f, [
            l[0] + i[0],
            l[1] + i[1],
            l[2] + i[2],
            l[3] + i[3],
            l[4] + i[4],
            l[5] + i[5]
          ]);
        };
        for (const [f, i] of c.frameLoads.entries()) {
          const l = c.frames.find((J) => J.id === f);
          if (!l) {
            c.errors.push(`frameload ${f}: no existe esa barra`);
            continue;
          }
          const m = x.get(l.nI), M = x.get(l.nJ);
          if (m === void 0 || M === void 0) continue;
          const u = y[m], p = y[M], I = [
            p[0] - u[0],
            p[1] - u[1],
            p[2] - u[2]
          ], C = Math.hypot(I[0], I[1], I[2]);
          if (C < 1e-9) continue;
          const k = [
            I[0] / C,
            I[1] / C,
            I[2] / C
          ], v = C * C / 12, w = [
            k[1] * i[2] - k[2] * i[1],
            k[2] * i[0] - k[0] * i[2],
            k[0] * i[1] - k[1] * i[0]
          ];
          s(m, [
            i[0] * C / 2,
            i[1] * C / 2,
            i[2] * C / 2,
            v * w[0],
            v * w[1],
            v * w[2]
          ]), s(M, [
            i[0] * C / 2,
            i[1] * C / 2,
            i[2] * C / 2,
            -v * w[0],
            -v * w[1],
            -v * w[2]
          ]);
        }
      }
      const oe = /* @__PURE__ */ new Map(), se = 1 / Math.sqrt(3), Me = [
        [
          -se,
          -se
        ],
        [
          se,
          -se
        ],
        [
          se,
          se
        ],
        [
          -se,
          se
        ]
      ];
      for (const s of c.shells) {
        const f = c.shellLoads.get(s.id);
        if (!f || c.deckTributario.has(s.id)) continue;
        const i = s.pts.map((M) => x.get(M));
        if (i.some((M) => M === void 0)) {
          c.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const l = i.map((M) => y[M]), m = [
          0,
          0,
          0,
          0
        ];
        for (const [M, u] of Me) {
          const p = [
            0.25 * (1 - M) * (1 - u),
            0.25 * (1 + M) * (1 - u),
            0.25 * (1 + M) * (1 + u),
            0.25 * (1 - M) * (1 + u)
          ], I = [
            -0.25 * (1 - u),
            0.25 * (1 - u),
            0.25 * (1 + u),
            -0.25 * (1 + u)
          ], C = [
            -0.25 * (1 - M),
            -0.25 * (1 + M),
            0.25 * (1 + M),
            0.25 * (1 - M)
          ], k = [
            0,
            1,
            2
          ].map((T) => I.reduce((Z, R, V) => Z + R * l[V][T], 0)), v = [
            0,
            1,
            2
          ].map((T) => C.reduce((Z, R, V) => Z + R * l[V][T], 0)), w = [
            k[1] * v[2] - k[2] * v[1],
            k[2] * v[0] - k[0] * v[2],
            k[0] * v[1] - k[1] * v[0]
          ], J = Math.hypot(w[0], w[1], w[2]);
          for (let T = 0; T < 4; T++) m[T] += p[T] * f * J;
        }
        for (let M = 0; M < 4; M++) {
          const u = i[M], p = B.get(u) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += m[M], B.set(u, p), oe.set(u, (oe.get(u) ?? 0) + m[M]);
        }
      }
      if (c.selfWeight) {
        const f = /* @__PURE__ */ new Set();
        for (const [l, m] of W) c.deckTributario.has(l) && f.add(m);
        const i = (l, m) => {
          const M = B.get(l) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          M[2] += m, B.set(l, M);
        };
        F.forEach((l, m) => {
          const M = h.get(m) ?? 0;
          if (M && !f.has(m)) {
            if (l.length === 2) {
              const u = e.get(m) ?? 0, p = y[l[0]], I = y[l[1]], C = [
                I[0] - p[0],
                I[1] - p[1],
                I[2] - p[2]
              ];
              let k = Math.hypot(C[0], C[1], C[2]);
              const v = z.get(m);
              if (v) {
                const Y = Math.hypot(C[0], C[1]);
                Y > 1e-9 && Math.abs(Math.atan2(Math.abs(C[2]), Y)) * 180 / Math.PI < 20 && (k = Math.max(k - v[0] - v[1], 0));
              }
              const w = Math.hypot(C[0], C[1], C[2]), J = -u * M * 9.80665 * c.selfWeight, T = [
                C[0] / w,
                C[1] / w,
                C[2] / w
              ], Z = k * k / 12, R = [
                T[1] * J,
                -T[0] * J,
                0
              ], V = (Y, P) => {
                const ie = B.get(Y) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                B.set(Y, [
                  ie[0] + P[0],
                  ie[1] + P[1],
                  ie[2] + P[2],
                  ie[3] + P[3],
                  ie[4] + P[4],
                  ie[5] + P[5]
                ]);
              };
              V(l[0], [
                0,
                0,
                J * k / 2,
                Z * R[0],
                Z * R[1],
                0
              ]), V(l[1], [
                0,
                0,
                J * k / 2,
                -Z * R[0],
                -Z * R[1],
                0
              ]);
            } else if (l.length === 4) {
              const u = Q.get(m) ?? 0, p = l.map((k) => y[k]);
              let I = 0;
              for (let k = 1; k < 3; k++) {
                const v = [
                  p[k][0] - p[0][0],
                  p[k][1] - p[0][1],
                  p[k][2] - p[0][2]
                ], w = [
                  p[k + 1][0] - p[0][0],
                  p[k + 1][1] - p[0][1],
                  p[k + 1][2] - p[0][2]
                ], J = [
                  v[1] * w[2] - v[2] * w[1],
                  v[2] * w[0] - v[0] * w[2],
                  v[0] * w[1] - v[1] * w[0]
                ];
                I += Math.hypot(J[0], J[1], J[2]) / 2;
              }
              const C = I * u * M * 9.80665 * c.selfWeight;
              for (const k of l) i(k, -C / 4);
            }
          }
        });
      }
      const H = [];
      for (const s of c.springs) {
        const f = x.get(s.node);
        f !== void 0 && H.push({
          node: f,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of c.areaSprings) {
        const f = W.get(s.id);
        if (f === void 0) {
          c.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        H.push({
          node: -(f + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (c.edgeEtabs) {
        const s = /* @__PURE__ */ new Set(), f = [];
        F.forEach((l, m) => {
          if (l.length === 3 || l.length === 4) {
            f.push(m);
            for (const M of l) s.add(M);
          }
        });
        let i = 0;
        for (const l of f) {
          const m = F[l], M = m.map((p) => y[p]), u = [
            0,
            1,
            2
          ].map((p) => [
            Math.min(...M.map((I) => I[p])),
            Math.max(...M.map((I) => I[p]))
          ]);
          for (let p = 0; p < y.length; p++) {
            if (m.includes(p)) continue;
            const I = y[p];
            if (I[0] < u[0][0] - 1e-6 || I[0] > u[0][1] + 1e-6 || I[1] < u[1][0] - 1e-6 || I[1] > u[1][1] + 1e-6 || I[2] < u[2][0] - 1e-6 || I[2] > u[2][1] + 1e-6) continue;
            let C = false;
            for (let v = 0; v < m.length && !C; v++) {
              const w = M[v], J = M[(v + 1) % m.length], T = [
                J[0] - w[0],
                J[1] - w[1],
                J[2] - w[2]
              ], Z = T[0] * T[0] + T[1] * T[1] + T[2] * T[2];
              if (Z < 1e-24) continue;
              const R = [
                I[0] - w[0],
                I[1] - w[1],
                I[2] - w[2]
              ], V = (R[0] * T[0] + R[1] * T[1] + R[2] * T[2]) / Z;
              if (V <= 1e-6 || V >= 1 - 1e-6) continue;
              const Y = [
                R[0] - V * T[0],
                R[1] - V * T[1],
                R[2] - V * T[2]
              ];
              Math.hypot(Y[0], Y[1], Y[2]) <= 1e-6 * Math.sqrt(Z) && (C = true);
            }
            !C || !F.some((v, w) => w !== l && v.includes(p)) || (H.push({
              node: -(l + 1),
              dof: -2,
              k: p
            }), i++);
          }
        }
        i && console.log(`[CLI Modeler] edge etabs: ${i} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const K = [];
      for (const s of c.solids) {
        const f = s.pts.map((l) => x.get(l));
        if (f.some((l) => l === void 0)) {
          c.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = F.length;
        F.push(f), o.set(i, s.E), _.set(i, s.nu), S.set(i, s.E / (2 * (1 + s.nu))), h.set(i, s.rho), K.push(i);
      }
      t.nodes.val = y, t.elements.val = F, t.nodeInputs.val = {
        supports: te,
        loads: B,
        masses: re,
        diaphragms: le,
        springs: H
      }, t.springs && (t.springs.val = H);
      const he = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map();
      for (const s of c.shells) {
        const f = W.get(s.id);
        if (f === void 0) continue;
        const i = c.shellLoads.get(s.id);
        i !== void 0 && be.set(f, i);
        const l = c.shellAngles.get(s.id);
        l !== void 0 && de.set(f, l);
        const m = c.shellModsDir.get(s.id);
        if (m) {
          ae.set(f, m), he.set(f, (m[0] + m[1]) / 2), ue.set(f, (m[3] + m[4]) / 2);
          continue;
        }
        const M = c.shellMods.get(s.id);
        M ? (he.set(f, M[0]), ue.set(f, M[1])) : c.deckSecs.has(s.id) && (he.set(f, 1), ue.set(f, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: S,
        areas: e,
        momentsOfInertiaY: a,
        momentsOfInertiaZ: n,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...d
        ].map(([s, f]) => [
          s,
          f * c.torsionFactor
        ])) : d,
        densities: h,
        poissonsRatios: _,
        thicknesses: Q,
        membraneModifiers: he,
        bendingModifiers: ue,
        shellModifiers: ae,
        shellSurfaceLoads: be,
        shellAngles: de,
        cargaDeArea: oe,
        cantos: A,
        anchos: E,
        sectionShapes: b,
        localAngles: L,
        shearAreasY: O,
        shearAreasZ: X,
        momentReleases: g,
        endOffsets: z,
        plateFormulations: j,
        deckSections: U,
        frameLoads: D,
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((s) => ({
          nodes: s.pts.map((f) => x.get(f)).filter((f) => f !== void 0),
          cells: s.cells.map((f) => W.get(f)).filter((f) => f !== void 0),
          q: s.cells.map((f) => c.shellLoads.get(f)).find((f) => f !== void 0),
          ang: s.cells.map((f) => c.shellAngles.get(f)).find((f) => f !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, c.doSolve && K.length > 0 && K.length === F.length) try {
        const s = o.get(K[0]) ?? 25e6, f = _.get(K[0]) ?? 0.2;
        K.some((u) => Math.abs((o.get(u) ?? s) - s) > 1e-9 * s || Math.abs((_.get(u) ?? f) - f) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const i = /* @__PURE__ */ new Map();
        for (const [u, p] of t.nodeInputs.val.supports ?? []) i.set(u, [
          !!p[0],
          !!p[1],
          !!p[2]
        ]);
        const l = /* @__PURE__ */ new Map();
        for (const [u, p] of t.nodeInputs.val.loads ?? []) l.set(u, [
          p[0] ?? 0,
          p[1] ?? 0,
          p[2] ?? 0
        ]);
        const m = _e({
          nodes: y,
          elements: F,
          E: s,
          nu: f,
          supports: i,
          loads: l,
          incompatible: c.solidIncompatible
        }), M = /* @__PURE__ */ new Map();
        m.displacements.forEach(([u, p, I], C) => M.set(C, [
          u,
          p,
          I,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: M,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: m.stressPerElement,
          solidVonMises: m.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${F.length} solidos H8, ${y.length} nodos (${m.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        c.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (c.doSolve && y.length && F.length) try {
        window.__hekatanCliSprings = H, t.deformOutputs.val = Xe(y, F, t.nodeInputs.val, t.elementInputs.val, H.length ? H : void 0);
        try {
          t.analyzeOutputs.val = Ne(y, F, t.elementInputs.val, t.deformOutputs.val);
        } catch (s) {
          console.warn("[CLI Modeler] analyze:", (s == null ? void 0 : s.message) ?? s);
        }
        if (c.areaSprings.length > 0) try {
          const s = t.deformOutputs.val.deformations, f = t.analyzeOutputs.val ?? {}, i = f.pressure instanceof Map ? f.pressure : /* @__PURE__ */ new Map();
          let l = 0, m = 0;
          for (const M of c.areaSprings) {
            const u = W.get(M.id);
            if (u === void 0) continue;
            const I = F[u].map((C) => {
              var _a2;
              const k = ((_a2 = s.get(C)) == null ? void 0 : _a2[2]) ?? 0, v = M.ks * k;
              return v < l && (l = v), v > m && (m = v), v;
            });
            i.set(u, I);
          }
          i.size > 0 && (f.pressure = i, f.colorMapRanges = {
            ...f.colorMapRanges ?? {},
            pressure: [
              m,
              l
            ]
          }, t.analyzeOutputs.val = f, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${l.toFixed(0)}..${m.toFixed(0)} kN/m\xB2`));
        } catch (s) {
          console.warn("[CLI Modeler] presi\xF3n:", (s == null ? void 0 : s.message) ?? s);
        }
        if (K.length > 0) try {
          const s = t.deformOutputs.val.deformations, f = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const l of K) {
            const m = F[l], M = m.map((I) => y[I]), u = m.flatMap((I) => {
              const C = s.get(I) ?? [
                0,
                0,
                0
              ];
              return [
                C[0],
                C[1],
                C[2]
              ];
            }), p = Be(M, o.get(l) ?? 25e6, _.get(l) ?? 0.2, u, c.solidIncompatible);
            f.set(l, p.stress), i.set(l, p.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: f,
            solidVonMises: i
          };
        } catch (s) {
          console.warn("[CLI Modeler] tensiones de solidos:", (s == null ? void 0 : s.message) ?? s);
        }
        console.log("[CLI Modeler] Solve OK \u2014", F.length, "elementos,", y.length, "nodos");
      } catch (s) {
        c.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (t.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of c.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = c.errors;
      let ge = 0, fe = 0;
      const ee = t.deformOutputs.val;
      if ((_a = ee == null ? void 0 : ee.deformations) == null ? void 0 : _a.size) for (const [, s] of ee.deformations) Math.abs(s[2]) > Math.abs(ge) && (ge = s[2]);
      if ((_b = ee == null ? void 0 : ee.reactions) == null ? void 0 : _b.size) for (const [, s] of ee.reactions) fe += s[2] || 0;
      window.__hekatanCliStats = {
        nodes: y.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: te.size,
        loads: B.size,
        springs: H.length,
        solved: c.doSolve,
        errors: c.errors.length,
        maxUzMm: +(ge * 1e3).toFixed(3),
        sumRz: +fe.toFixed(1)
      };
    }
  };
});
export {
  __tla,
  es as c,
  Ue as p
};
