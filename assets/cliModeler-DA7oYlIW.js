import { c as qe, a as _e } from "./cadSections-DVtTZU6U.js";
import { c as je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Be, a as Pe, __tla as __tla_0 } from "./h8-CDm7SKnU.js";
import { a as Xe } from "./analyze-DgLgRmKg.js";
import { m as Ue, d as Ye, __tla as __tla_1 } from "./didacticCpp-DH-WISVI.js";
let ns, Ge;
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
  const De = {
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
  function Je(r) {
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
    ], i = t.split(/[\s,]+/).filter(Boolean);
    if (i.length > 1 && i.length <= 6 && i.every((L) => L === "0" || L === "1")) return i.forEach((L, W) => {
      $[W] = L === "1";
    }), $;
    for (const L of i) De[L] !== void 0 && ($[De[L]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let L = 0; L < t.length; L++) $[L] = t[L] === "1";
    return $;
  }
  Ge = function(r) {
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
      loadsPat: /* @__PURE__ */ new Map(),
      frameLoadsPat: /* @__PURE__ */ new Map(),
      springs: [],
      masses: /* @__PURE__ */ new Map(),
      diaphragms: /* @__PURE__ */ new Map(),
      doSolve: false,
      errors: []
    };
    let $ = null, i = 0, L = 0, W = 0;
    const C = r.split(/\r?\n/);
    for (let N = 0; N < C.length; N++) {
      let v = C[N].trim();
      if (!v || v.startsWith("#") || v.startsWith("//")) continue;
      v = v.replace(/[;]+$/, "");
      const o = v.split(/\s+/), S = o[0].toLowerCase();
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
          i++, t.nodes.set(i, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if ($ === "elements" && e.length >= 2) {
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
        t.supports.set(e, Je(a));
        continue;
      }
      $ && !/^[\-\d]/.test(o[0]) && ($ = null);
      try {
        switch (S) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2]), n = parseFloat(o[3]), c = parseFloat(o[4]);
            !isFinite(e) || !isFinite(a) || !isFinite(n) || !isFinite(c) ? t.errors.push(`L${N + 1}: node mal formado: ${v}`) : t.nodes.set(e, [
              a,
              n,
              c
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const e = parseInt(o[1], 10), a = parseInt(o[2], 10), n = parseInt(o[3], 10), c = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.16"), y = parseFloat(o[6] ?? "0.001"), k = o[7] !== void 0 ? parseFloat(o[7]) : void 0, g = o[8] !== void 0 ? parseFloat(o[8]) : void 0, E = o[9] !== void 0 ? parseFloat(o[9]) : void 0, M = o[10] !== void 0 ? parseFloat(o[10]) : void 0, T = o[11] !== void 0 ? parseFloat(o[11]) : void 0, J = o[12] !== void 0 ? parseFloat(o[12]) : void 0, X = o.indexOf("#"), D = X >= 0 && o[X + 1] ? o[X + 1] : void 0;
            t.frames.push({
              id: e,
              nI: a,
              nJ: n,
              E: c,
              A: h,
              I: y,
              Iy: k,
              J: g,
              nu: E,
              rho: M,
              D: T,
              B: J,
              sec: D
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), c = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.2"), y = parseFloat(o[6] ?? "2.4");
            isFinite(e) && a > 0 && n > 0 && n < a / 2 && c > 0 ? t.frameCftc.set(e, {
              D: a,
              t: n,
              Ec: c,
              nuC: isFinite(h) ? h : 0.2,
              rhoC: isFinite(y) && y >= 0 ? y : 2.4
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), c = parseFloat(o[4] ?? ""), h = parseFloat(o[5] ?? "25e6"), y = parseFloat(o[6] ?? "0.2"), k = parseFloat(o[7] ?? "2.4");
            isFinite(e) && a > 0 && n > 0 && c > 0 && c < Math.min(a, n) / 2 && h > 0 ? t.frameCft.set(e, {
              b: a,
              h: n,
              t: c,
              Ec: h,
              nuC: isFinite(y) ? y : 0.2,
              rhoC: isFinite(k) && k >= 0 ? k : 2.4
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
            const e = parseInt(o[1], 10), a = o.slice(2).map((c) => c.toLowerCase());
            if (!isFinite(e) || a.length === 0) {
              t.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const n = new Array(12).fill(false);
            if (a.length === 2 && a.every((c) => /^(pin|fix|libre|rigido)$/.test(c))) a.forEach((c, h) => {
              (c === "pin" || c === "libre") && (n[h * 6 + 4] = true, n[h * 6 + 5] = true);
            });
            else {
              const c = a.filter((h) => h === "0" || h === "1");
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
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = o.slice(3).some((c) => /^(nodal|lumped|sap|etabs)$/i.test(c));
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
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0");
            if (!isFinite(e) || !isFinite(a) || !isFinite(n)) {
              t.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            t.frameEndOffsets.set(e, [
              a,
              n,
              isFinite(c) ? c : 0
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
            ], n = parseFloat(o[6] ?? "0.20"), c = parseFloat(o[7] ?? "25e6"), h = o[9] !== void 0 ? parseFloat(o[9]) : void 0, y = h !== void 0 && isFinite(h) ? h : void 0;
            if (t.shells.push({
              id: e,
              pts: a,
              t: n,
              E: c,
              rho: y
            }), o[8] !== void 0) {
              const k = parseFloat(o[8]);
              isFinite(k) && k !== 0 && t.shellLoads.set(e, k);
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
              const n = a[0], c = a[1];
              t.shellMods.set(e, [
                isFinite(n) ? n : 1,
                isFinite(c) ? c : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const e = o.slice(1).map((M) => parseInt(M, 10));
            if (e.length < 7 || e.some((M) => !isFinite(M))) {
              t.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [a, n, c, h, y, k, g] = e, E = [];
            for (let M = k; M <= g; M++) E.push(M);
            t.areaObjs.push({
              id: a,
              pts: [
                n,
                c,
                h,
                y
              ],
              cells: E
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
            t.supports.set(e, Je(a));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), h = parseFloat(o[5] ?? "0"), y = parseFloat(o[6] ?? "0"), k = parseFloat(o[7] ?? "0"), g = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(g) ? t.loads.set(e, [
              a,
              n,
              c,
              h,
              y,
              k
            ]) : (t.loadsPat.has(g) || t.loadsPat.set(g, /* @__PURE__ */ new Map()), t.loadsPat.get(g).set(e, [
              a,
              n,
              c,
              h,
              y,
              k
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), h = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", y = /^dead$/i.test(h) ? t.frameLoads : t.frameLoadsPat.get(h) ?? (t.frameLoadsPat.set(h, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(h)), k = y.get(e) ?? [
              0,
              0,
              0
            ];
            y.set(e, [
              k[0] + a,
              k[1] + n,
              k[2] + c
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(o[1], 10), a = (o[2] ?? "uz").toLowerCase(), n = De[a] ?? 2, c = parseFloat(o[3] ?? "1000");
            t.springs.push({
              node: e,
              dof: n,
              k: c
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
            Number.isFinite(e) && Number.isFinite(a) ? t.masses.set(e, (t.masses.get(e) ?? 0) + a) : t.errors.push(`L${N + 1}: mass necesita <nudo> <toneladas>`);
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
            t.errors.push(`L${N + 1}: comando desconocido "${S}"`);
        }
      } catch (e) {
        t.errors.push(`L${N + 1}: error "${v}" \u2014 ${e.message}`);
      }
    }
    return t;
  };
  const Ze = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, _ = (r, t) => [
    r[0] - t[0],
    r[1] - t[1],
    r[2] - t[2]
  ], de = (r, t) => r[0] * t[0] + r[1] * t[1] + r[2] * t[2], Fe = (r, t) => [
    r[1] * t[2] - r[2] * t[1],
    r[2] * t[0] - r[0] * t[2],
    r[0] * t[1] - r[1] * t[0]
  ], G = (r) => Math.hypot(r[0], r[1], r[2]), ae = (r, t) => [
    r[0] * t,
    r[1] * t,
    r[2] * t
  ];
  function Re(r, t) {
    const $ = r.shellModsDir.get(t);
    return !!$ && Math.abs($[3]) < 1e-12 && Math.abs($[4]) < 1e-12 && Math.abs($[5]) < 1e-12;
  }
  function Ve(r, t = 200, $) {
    const i = [
      0,
      1,
      2
    ].map((g) => (r[0][g] + r[1][g] + r[2][g] + r[3][g]) / 4);
    let L = _(r[1], r[0]), W = Fe(L, _(r[3], r[0]));
    W = ae(W, 1 / G(W)), L = ae(L, 1 / G(L));
    const C = Fe(W, L), N = r.map((g) => [
      de(_(g, i), L),
      de(_(g, i), C)
    ]);
    let v = [
      0,
      1,
      2,
      3
    ];
    if ($) {
      const g = [
        0,
        1,
        2,
        3
      ].map((E) => {
        const M = _(r[(E + 1) % 4], r[E]);
        return Math.abs(de(M, $)) / G(M);
      });
      v = [
        0,
        1,
        2,
        3
      ].sort((E, M) => g[E] - g[M]).slice(0, 2);
    }
    const o = N.map((g) => g[0]), S = N.map((g) => g[1]), e = Math.min(...o), a = Math.max(...o), n = Math.min(...S), c = Math.max(...S), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let y = 0;
    for (let g = 0; g < t; g++) for (let E = 0; E < t; E++) {
      const M = e + (a - e) * (g + 0.5) / t, T = n + (c - n) * (E + 0.5) / t;
      let J = 0, X = 0;
      for (let P = 0; P < 4; P++) {
        const q = N[P], K = N[(P + 1) % 4];
        (K[0] - q[0]) * (T - q[1]) - (K[1] - q[1]) * (M - q[0]) >= 0 ? J++ : X++;
      }
      if (J !== 4 && X !== 4) continue;
      let D = v[0], j = 1 / 0;
      for (const P of v) {
        const q = N[P], K = N[(P + 1) % 4], se = K[0] - q[0], R = K[1] - q[1], fe = se * se + R * R, re = Math.max(0, Math.min(1, ((M - q[0]) * se + (T - q[1]) * R) / fe)), Q = Math.hypot(M - (q[0] + re * se), T - (q[1] + re * R));
        Q < j && (j = Q, D = P);
      }
      h[D].pts.push([
        i[0] + M * L[0] + T * C[0],
        i[1] + M * L[1] + T * C[1],
        i[2] + M * L[2] + T * C[2]
      ]), y++;
    }
    const k = 0.5 * G(Fe(_(r[2], r[0]), _(r[3], r[1])));
    for (const g of h) g.dA = y ? k / y : 0;
    return h;
  }
  function Ke(r, t) {
    if (!(t > 0)) return;
    const $ = 1e-6, i = (S) => r.nodes.get(S);
    let L = Math.max(0, ...r.nodes.keys()) + 1, W = r.shells.reduce((S, e) => Math.max(S, e.id), 0) + 1;
    const C = (S) => {
      for (const [a, n] of r.nodes) if (G(_(n, S)) < $) return a;
      const e = L++;
      return r.nodes.set(e, [
        S[0],
        S[1],
        S[2]
      ]), e;
    }, N = (S, e) => {
      const a = r.shellModsDir.get(S);
      a && r.shellModsDir.set(e, [
        ...a
      ]);
      const n = r.shellMods.get(S);
      n && r.shellMods.set(e, [
        ...n
      ]);
      const c = r.shellLoads.get(S);
      c !== void 0 && r.shellLoads.set(e, c);
      const h = r.shellTypes.get(S);
      h !== void 0 && r.shellTypes.set(e, h);
      const y = r.shellAngles.get(S);
      y !== void 0 && r.shellAngles.set(e, y);
    }, v = [];
    let o = 0;
    for (const S of r.shells) {
      if (S.pts.length !== 4) {
        v.push(S);
        continue;
      }
      const e = S.pts.map(i);
      if (e.some((g) => !g)) {
        v.push(S);
        continue;
      }
      const a = (G(_(e[1], e[0])) + G(_(e[2], e[3]))) / 2, n = (G(_(e[3], e[0])) + G(_(e[2], e[1]))) / 2, c = Math.max(1, Math.ceil(a / t - 1e-9)), h = Math.max(1, Math.ceil(n / t - 1e-9));
      if (c === 1 && h === 1) {
        v.push(S);
        continue;
      }
      const y = (g, E) => [
        0,
        1,
        2
      ].map((M) => e[0][M] * (1 - g) * (1 - E) + e[1][M] * g * (1 - E) + e[2][M] * g * E + e[3][M] * (1 - g) * E), k = [];
      for (let g = 0; g <= c; g++) {
        const E = [];
        for (let M = 0; M <= h; M++) E.push(C(y(g / c, M / h)));
        k.push(E);
      }
      for (let g = 0; g < c; g++) for (let E = 0; E < h; E++) {
        const M = g === 0 && E === 0 ? S.id : W++;
        v.push({
          ...S,
          id: M,
          pts: [
            k[g][E],
            k[g + 1][E],
            k[g + 1][E + 1],
            k[g][E + 1]
          ]
        }), M !== S.id && N(S.id, M);
      }
      o++;
    }
    o && (r.shells = v, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${r.shells.length} cascaras, ${r.nodes.size} nudos`));
  }
  function Qe(r) {
    const $ = (n) => r.nodes.get(n), i = [
      ...r.nodes.keys()
    ], L = (n, c, h) => {
      const y = _(c, n), k = G(y), g = ae(y, 1 / k), E = [];
      for (const M of i) {
        if (h.includes(M)) continue;
        const T = _($(M), n), J = de(T, g);
        J > 1e-6 && J < k - 1e-6 && G(_(T, ae(g, J))) < 1e-4 && E.push(J / k);
      }
      return E.sort((M, T) => M - T);
    }, W = (n, c) => {
      const h = [];
      for (const y of n) c.some((k) => Math.abs(y - k) < 1e-5) && !h.some((k) => Math.abs(y - k) < 1e-5) && h.push(y);
      return h;
    }, C = (n) => {
      for (const c of i) if (G(_($(c), n)) < 1e-4) return c;
    };
    let N = r.shells.reduce((n, c) => Math.max(n, c.id), 0) + 1;
    const v = [], o = (n, c) => {
      const h = r.shellModsDir.get(n);
      h && r.shellModsDir.set(c, [
        ...h
      ]);
      const y = r.shellMods.get(n);
      y && r.shellMods.set(c, [
        ...y
      ]);
      const k = r.shellLoads.get(n);
      k !== void 0 && r.shellLoads.set(c, k);
      const g = r.shellTypes.get(n);
      g !== void 0 && r.shellTypes.set(c, g);
      const E = r.shellAngles.get(n);
      E !== void 0 && r.shellAngles.set(c, E);
    };
    for (const n of r.shells) {
      if (!Re(r, n.id) || n.pts.length !== 4 || n.pts.some((D) => !r.nodes.has(D))) {
        v.push(n);
        continue;
      }
      const c = n.pts.map($), h = L(c[0], c[1], n.pts), y = L(c[2], c[3], n.pts).map((D) => 1 - D), k = L(c[1], c[2], n.pts), g = L(c[3], c[0], n.pts).map((D) => 1 - D);
      let E = [
        0,
        ...W(h, y),
        1
      ], M = [
        0,
        ...W(k, g),
        1
      ];
      if (E.length === 2 && M.length === 2) {
        v.push(n);
        continue;
      }
      const T = (D, j) => [
        0,
        1,
        2
      ].map((P) => (1 - D) * (1 - j) * c[0][P] + D * (1 - j) * c[1][P] + D * j * c[2][P] + (1 - D) * j * c[3][P]);
      let J = M.map((D) => E.map((j) => C(T(j, D))));
      if (J.some((D) => D.some((j) => j === void 0)) && (E.length >= M.length ? M = [
        0,
        1
      ] : E = [
        0,
        1
      ], J = M.map((D) => E.map((j) => C(T(j, D)))), J.some((D) => D.some((j) => j === void 0)))) {
        v.push(n);
        continue;
      }
      let X = true;
      for (let D = 0; D < M.length - 1; D++) for (let j = 0; j < E.length - 1; j++) {
        const P = [
          J[D][j],
          J[D][j + 1],
          J[D + 1][j + 1],
          J[D + 1][j]
        ], q = X ? n.id : N++;
        X || o(n.id, q), X = false, v.push({
          id: q,
          pts: P,
          t: n.t,
          E: n.E,
          rho: n.rho
        });
      }
    }
    r.shells = v;
    const S = 9.80665, e = (n, c) => {
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
    }, a = (n, c) => {
      const h = _(c, n), y = G(h), k = ae(h, 1 / y);
      return r.frames.filter((g) => [
        g.nI,
        g.nJ
      ].every((E) => {
        const M = r.nodes.get(E);
        if (!M) return false;
        const T = _(M, n), J = de(T, k);
        return J > -1e-4 && J < y + 1e-4 && G(_(T, ae(k, J))) < 1e-4;
      }));
    };
    for (const n of r.shells) {
      if (!Re(r, n.id) || n.pts.length !== 4) continue;
      const c = r.selfWeight ? (n.rho ?? 2.45) * n.t * S * r.selfWeight : 0, h = r.shellLoads.get(n.id) ?? 0, y = -c + h;
      if (Math.abs(y) < 1e-15) continue;
      const k = n.pts.map($);
      let g;
      if (r.deckOneWay) {
        const M = _(k[1], k[0]);
        let T = Fe(M, _(k[3], k[0]));
        T = ae(T, 1 / G(T));
        const J = ae(M, 1 / G(M)), X = Fe(T, J), D = (r.shellAngles.get(n.id) ?? 0) * Math.PI / 180;
        g = [
          0,
          1,
          2
        ].map((j) => Math.cos(D) * J[j] + Math.sin(D) * X[j]);
      }
      const E = Ve(k, 200, g);
      for (let M = 0; M < 4; M++) {
        const { pts: T, dA: J } = E[M];
        if (!T.length) continue;
        const X = k[M], D = k[(M + 1) % 4], j = a(X, D);
        if (!j.length) {
          const R = y * J * T.length;
          e(n.pts[M], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]), e(n.pts[(M + 1) % 4], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const P = _(D, X), q = G(P), K = ae(P, 1 / q), se = T.map((R) => de(_(R, X), K));
        for (const R of j) {
          const fe = $(R.nI), re = $(R.nJ), Q = de(_(fe, X), K), be = de(_(re, X), K), pe = Math.min(Q, be), H = Math.max(Q, be), ce = H - pe;
          if (ce < 1e-9) continue;
          const te = H >= q - 1e-6, ne = ae(_(re, fe), 1 / ce), oe = Fe(ne, [
            0,
            0,
            1
          ]);
          let he = 0, ue = 0, we = 0, me = 0;
          for (const ge of se) {
            if (ge < pe - 1e-9 || (te ? ge > H + 1e-9 : ge >= H - 1e-9)) continue;
            let le = ge - pe;
            Q > be && (le = ce - le);
            const s = le / ce;
            he += 1 - 3 * s * s + 2 * s * s * s, ue += ce * (s - 2 * s * s + s * s * s), we += 3 * s * s - 2 * s * s * s, me += ce * (-s * s + s * s * s);
          }
          const ee = y * J;
          e(R.nI, [
            0,
            0,
            ee * he,
            oe[0] * ee * ue,
            oe[1] * ee * ue,
            oe[2] * ee * ue
          ]), e(R.nJ, [
            0,
            0,
            ee * we,
            oe[0] * ee * me,
            oe[1] * ee * me,
            oe[2] * ee * me
          ]);
        }
      }
      r.deckTributario.add(n.id), r.shellLoads.delete(n.id);
    }
  }
  ns = {
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
      const i = t.nodes.val, L = t.elements.val;
      if (!(!i.length || !L.length)) try {
        const W = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), C = t.nodeInputs.val, N = window.__hekatanCliSprings, v = Ue(i, L, C, t.elementInputs.val, W, 0, 0, 1, (C == null ? void 0 : C.diaphragms) instanceof Map && C.diaphragms.size ? C.diaphragms : void 0, N && N.length ? N : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${v.frequencies.length} modos, T1 = ${v.frequencies[0] ? (1 / v.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = $ == null ? void 0 : $.render) == null ? void 0 : _a.call($, v, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (W) {
        console.error("[CLI Modeler] modal:", (W == null ? void 0 : W.message) ?? W);
      }
    },
    build(r, t) {
      var _a, _b;
      const $ = window.__hekatanCliScript ?? Ze;
      window.__hekatanCliLastScript = $;
      const i = Ge($);
      i.autoMesh > 0 && Ke(i, i.autoMesh), i.deckEtabs && Qe(i);
      const L = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), C = [], N = Array.from(i.nodes.keys()).sort((s, d) => s - d);
      for (const s of N) L.set(s, C.length), C.push(i.nodes.get(s));
      const v = [], o = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map();
      for (const s of i.frames) {
        const d = L.get(s.nI), F = L.get(s.nJ);
        if (d === void 0 || F === void 0) {
          const I = N.length ? `IDs disponibles: ${N.join(", ")}` : "ning\xFAn nodo definido", z = [];
          d === void 0 && z.push(s.nI), F === void 0 && z.push(s.nJ), i.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${z.join(", ")}] \u2014 ${I}`);
          continue;
        }
        const l = v.length;
        v.push([
          d,
          F
        ]);
        const f = s.nu ?? 0.2;
        o.set(l, s.E), S.set(l, s.E / (2 * (1 + f))), e.set(l, s.A), a.set(l, s.I), n.set(l, s.Iy ?? s.I), c.set(l, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), h.set(l, s.rho ?? 2.45), q.set(l, f), s.D !== void 0 && isFinite(s.D) && y.set(l, s.D), s.B !== void 0 && isFinite(s.B) && k.set(l, s.B);
        const u = i.frameAngles.get(s.id);
        u !== void 0 && isFinite(u) && E.set(l, u);
        const m = i.frameReleases.get(s.id);
        m && M.set(l, m);
        const p = i.frameEndOffsets.get(s.id);
        p && T.set(l, p);
        const x = i.frameLoads.get(s.id);
        x && D.set(l, x);
        const O = i.frameShearAreas.get(s.id);
        if (O && (P.set(l, O[0]), j.set(l, O[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const I = {
            type: "general"
          };
          s.sec && (I.name = s.sec), s.D !== void 0 && isFinite(s.D) && (I.h = s.D), s.B !== void 0 && isFinite(s.B) && (I.b = s.B), g.set(l, I);
        }
        const w = i.frameCftc.get(s.id);
        if (w) {
          const I = qe(w.D, w.t, s.E, f, w.Ec, w.nuC);
          e.set(l, I.A), n.set(l, I.Iz), a.set(l, I.Iy), c.set(l, I.J), P.set(l, I.As2), j.set(l, I.As3), y.set(l, w.D), k.set(l, w.D);
          const z = w.D - 2 * w.t, A = Math.PI * z * z / 4, U = Math.PI * w.D * w.D / 4 - A;
          h.set(l, ((s.rho ?? 7.85) * U + w.rhoC * A) / I.A), g.set(l, {
            type: "CFT",
            d: w.D,
            tw: w.t,
            fillE: w.Ec,
            fillRho: w.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(w.D * 1e3)}X${Math.round(w.t * 1e3)}`
          });
        }
        const b = i.frameCft.get(s.id);
        if (b) {
          const I = _e(b.b, b.h, b.t, s.E, f, b.Ec, b.nuC);
          e.set(l, I.A), n.set(l, I.Iz), a.set(l, I.Iy), c.set(l, I.J), P.set(l, I.As2), j.set(l, I.As3), y.set(l, b.h), k.set(l, b.b);
          const z = (b.b - 2 * b.t) * (b.h - 2 * b.t), A = b.b * b.h - z;
          h.set(l, ((s.rho ?? 7.85) * A + b.rhoC * z) / I.A), g.set(l, {
            type: "CFT",
            b: b.b,
            h: b.h,
            tw: b.t,
            fillE: b.Ec,
            fillRho: b.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${Math.round(b.h * 1e3)}X${Math.round(b.b * 1e3)}X${Math.round(b.t * 1e3)}`
          });
        }
      }
      if (i.meshCross) {
        const s = (m, p) => m[0] * p[0] + m[1] * p[1] + m[2] * p[2], d = [
          o,
          S,
          e,
          a,
          n,
          c,
          h,
          q,
          y,
          k,
          E,
          j,
          P,
          g,
          D
        ], F = (m, p) => {
          for (const x of d) x.has(m) && x.set(p, x.get(m));
        }, l = (m) => {
          for (let p = 0; p < C.length; p++) if (Math.hypot(C[p][0] - m[0], C[p][1] - m[1], C[p][2] - m[2]) < 1e-6) return p;
          return C.push([
            m[0],
            m[1],
            m[2]
          ]), C.length - 1;
        }, f = (m) => {
          const p = C[m[0]], x = C[m[1]];
          return [
            Math.min(p[0], x[0]),
            Math.min(p[1], x[1]),
            Math.min(p[2], x[2]),
            Math.max(p[0], x[0]),
            Math.max(p[1], x[1]),
            Math.max(p[2], x[2])
          ];
        };
        let u = 0;
        for (let m = 0; m < v.length; m++) {
          if (v[m].length !== 2) continue;
          const p = f(v[m]);
          for (let x = m + 1; x < v.length; x++) {
            if (v[x].length !== 2) continue;
            const [O, w] = v[m], [b, I] = v[x];
            if (O === b || O === I || w === b || w === I) continue;
            const z = f(v[x]);
            if (p[0] > z[3] + 1e-6 || z[0] > p[3] + 1e-6 || p[1] > z[4] + 1e-6 || z[1] > p[4] + 1e-6 || p[2] > z[5] + 1e-6 || z[2] > p[5] + 1e-6) continue;
            const A = C[O], U = C[w], B = C[b], Z = C[I], Y = [
              U[0] - A[0],
              U[1] - A[1],
              U[2] - A[2]
            ], V = [
              Z[0] - B[0],
              Z[1] - B[1],
              Z[2] - B[2]
            ], ie = [
              A[0] - B[0],
              A[1] - B[1],
              A[2] - B[2]
            ], Le = s(Y, Y), xe = s(Y, V), Ce = s(V, V), Oe = s(Y, ie), ze = s(V, ie), Ee = Le * Ce - xe * xe;
            if (Ee < 1e-10 * Le * Ce) continue;
            const Ie = (xe * ze - Ce * Oe) / Ee, ve = (Le * ze - xe * Oe) / Ee;
            if (Ie < 1e-6 || Ie > 1 - 1e-6 || ve < 1e-6 || ve > 1 - 1e-6) continue;
            const ye = [
              A[0] + Ie * Y[0],
              A[1] + Ie * Y[1],
              A[2] + Ie * Y[2]
            ], Ae = [
              B[0] + ve * V[0],
              B[1] + ve * V[1],
              B[2] + ve * V[2]
            ];
            if (Math.hypot(ye[0] - Ae[0], ye[1] - Ae[1], ye[2] - Ae[2]) > 1e-6) continue;
            const Te = l(ye);
            for (const Me of [
              m,
              x
            ]) {
              const [We, Ne] = v[Me], Se = v.length;
              v[Me] = [
                We,
                Te
              ], v.push([
                Te,
                Ne
              ]), F(Me, Se);
              const $e = M.get(Me);
              $e && (M.set(Me, [
                ...$e.slice(0, 6),
                ...Array(6).fill(false)
              ]), M.set(Se, [
                ...Array(6).fill(false),
                ...$e.slice(6)
              ]));
              const ke = T.get(Me);
              ke && (T.set(Me, [
                ke[0],
                0,
                ke[2]
              ]), T.set(Se, [
                0,
                ke[1],
                ke[2]
              ]));
            }
            u++;
          }
        }
        u > 0 && console.log(`[CLI Modeler] ${u} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of i.shells) {
        const d = s.pts.map((u) => L.get(u));
        if (d.some((u) => u === void 0)) {
          i.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const F = v.length;
        W.set(s.id, F), v.push(d), o.set(F, s.E), S.set(F, s.E / (2 * 1.2)), K.set(F, s.t), h.set(F, s.rho ?? 2.45), q.set(F, 0.2);
        const l = i.shellTypes.get(s.id);
        l !== void 0 && J.set(F, l);
        const f = i.deckSecs.get(s.id);
        if (f) {
          const u = f.tc + (f.sr > 0 ? f.hr * (f.wrt + f.wrb) / 2 / f.sr : 0);
          K.set(F, f.tc), h.set(F, ((s.rho ?? 2.45) * u + f.w / 9.80665) / f.tc), X.set(F, {
            ...f
          });
        }
      }
      const se = /* @__PURE__ */ new Map();
      for (const [s, d] of i.supports.entries()) {
        const F = L.get(s);
        F !== void 0 && se.set(F, d);
      }
      const R = /* @__PURE__ */ new Map();
      for (const [s, d] of i.loads.entries()) {
        const F = L.get(s);
        F !== void 0 && R.set(F, [
          ...d
        ]);
      }
      const fe = /* @__PURE__ */ new Map();
      for (const [s, d] of i.diaphragms.entries()) {
        const F = L.get(s);
        F !== void 0 && fe.set(F, d);
      }
      const re = /* @__PURE__ */ new Map();
      for (const [s, d] of i.masses.entries()) {
        const F = L.get(s);
        F !== void 0 && re.set(F, d);
      }
      const Q = /* @__PURE__ */ new Map();
      for (const [s, d] of i.loadsPat) {
        const F = /* @__PURE__ */ new Map();
        for (const [l, f] of d) {
          const u = L.get(l);
          u !== void 0 && F.set(u, [
            ...f
          ]);
        }
        Q.set(s, F);
      }
      const be = [
        [
          i.frameLoads,
          R
        ]
      ];
      for (const [s, d] of i.frameLoadsPat) Q.has(s) || Q.set(s, /* @__PURE__ */ new Map()), be.push([
        d,
        Q.get(s)
      ]);
      for (const [s, d] of be) if (s.size) {
        const F = (l, f) => {
          const u = d.get(l) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          d.set(l, [
            u[0] + f[0],
            u[1] + f[1],
            u[2] + f[2],
            u[3] + f[3],
            u[4] + f[4],
            u[5] + f[5]
          ]);
        };
        for (const [l, f] of s.entries()) {
          const u = i.frames.find((U) => U.id === l);
          if (!u) {
            i.errors.push(`frameload ${l}: no existe esa barra`);
            continue;
          }
          const m = L.get(u.nI), p = L.get(u.nJ);
          if (m === void 0 || p === void 0) continue;
          const x = C[m], O = C[p], w = [
            O[0] - x[0],
            O[1] - x[1],
            O[2] - x[2]
          ], b = Math.hypot(w[0], w[1], w[2]);
          if (b < 1e-9) continue;
          const I = [
            w[0] / b,
            w[1] / b,
            w[2] / b
          ], z = b * b / 12, A = [
            I[1] * f[2] - I[2] * f[1],
            I[2] * f[0] - I[0] * f[2],
            I[0] * f[1] - I[1] * f[0]
          ];
          F(m, [
            f[0] * b / 2,
            f[1] * b / 2,
            f[2] * b / 2,
            z * A[0],
            z * A[1],
            z * A[2]
          ]), F(p, [
            f[0] * b / 2,
            f[1] * b / 2,
            f[2] * b / 2,
            -z * A[0],
            -z * A[1],
            -z * A[2]
          ]);
        }
      }
      const pe = /* @__PURE__ */ new Map(), H = 1 / Math.sqrt(3), ce = [
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
      for (const s of i.shells) {
        const d = i.shellLoads.get(s.id);
        if (!d || i.deckTributario.has(s.id)) continue;
        const F = s.pts.map((u) => L.get(u));
        if (F.some((u) => u === void 0)) {
          i.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const l = F.map((u) => C[u]), f = [
          0,
          0,
          0,
          0
        ];
        for (const [u, m] of ce) {
          const p = [
            0.25 * (1 - u) * (1 - m),
            0.25 * (1 + u) * (1 - m),
            0.25 * (1 + u) * (1 + m),
            0.25 * (1 - u) * (1 + m)
          ], x = [
            -0.25 * (1 - m),
            0.25 * (1 - m),
            0.25 * (1 + m),
            -0.25 * (1 + m)
          ], O = [
            -0.25 * (1 - u),
            -0.25 * (1 + u),
            0.25 * (1 + u),
            0.25 * (1 - u)
          ], w = [
            0,
            1,
            2
          ].map((A) => x.reduce((U, B, Z) => U + B * l[Z][A], 0)), b = [
            0,
            1,
            2
          ].map((A) => O.reduce((U, B, Z) => U + B * l[Z][A], 0)), I = [
            w[1] * b[2] - w[2] * b[1],
            w[2] * b[0] - w[0] * b[2],
            w[0] * b[1] - w[1] * b[0]
          ], z = Math.hypot(I[0], I[1], I[2]);
          for (let A = 0; A < 4; A++) f[A] += p[A] * d * z;
        }
        for (let u = 0; u < 4; u++) {
          const m = F[u], p = R.get(m) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += f[u], R.set(m, p), pe.set(m, (pe.get(m) ?? 0) + f[u]);
        }
      }
      if (i.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [l, f] of W) i.deckTributario.has(l) && d.add(f);
        const F = (l, f) => {
          const u = R.get(l) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          u[2] += f, R.set(l, u);
        };
        v.forEach((l, f) => {
          const u = h.get(f) ?? 0;
          if (u && !d.has(f)) {
            if (l.length === 2) {
              const m = e.get(f) ?? 0, p = C[l[0]], x = C[l[1]], O = [
                x[0] - p[0],
                x[1] - p[1],
                x[2] - p[2]
              ];
              let w = Math.hypot(O[0], O[1], O[2]);
              const b = T.get(f);
              if (b) {
                const Y = Math.hypot(O[0], O[1]);
                Y > 1e-9 && Math.abs(Math.atan2(Math.abs(O[2]), Y)) * 180 / Math.PI < 20 && (w = Math.max(w - b[0] - b[1], 0));
              }
              const I = Math.hypot(O[0], O[1], O[2]), z = -m * u * 9.80665 * i.selfWeight, A = [
                O[0] / I,
                O[1] / I,
                O[2] / I
              ], U = w * w / 12, B = [
                A[1] * z,
                -A[0] * z,
                0
              ], Z = (Y, V) => {
                const ie = R.get(Y) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                R.set(Y, [
                  ie[0] + V[0],
                  ie[1] + V[1],
                  ie[2] + V[2],
                  ie[3] + V[3],
                  ie[4] + V[4],
                  ie[5] + V[5]
                ]);
              };
              Z(l[0], [
                0,
                0,
                z * w / 2,
                U * B[0],
                U * B[1],
                0
              ]), Z(l[1], [
                0,
                0,
                z * w / 2,
                -U * B[0],
                -U * B[1],
                0
              ]);
            } else if (l.length === 4) {
              const m = K.get(f) ?? 0, p = l.map((w) => C[w]);
              let x = 0;
              for (let w = 1; w < 3; w++) {
                const b = [
                  p[w][0] - p[0][0],
                  p[w][1] - p[0][1],
                  p[w][2] - p[0][2]
                ], I = [
                  p[w + 1][0] - p[0][0],
                  p[w + 1][1] - p[0][1],
                  p[w + 1][2] - p[0][2]
                ], z = [
                  b[1] * I[2] - b[2] * I[1],
                  b[2] * I[0] - b[0] * I[2],
                  b[0] * I[1] - b[1] * I[0]
                ];
                x += Math.hypot(z[0], z[1], z[2]) / 2;
              }
              const O = x * m * u * 9.80665 * i.selfWeight;
              for (const w of l) F(w, -O / 4);
            }
          }
        });
      }
      const te = [];
      for (const s of i.springs) {
        const d = L.get(s.node);
        d !== void 0 && te.push({
          node: d,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of i.areaSprings) {
        const d = W.get(s.id);
        if (d === void 0) {
          i.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        te.push({
          node: -(d + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (i.edgeEtabs) {
        const s = /* @__PURE__ */ new Set(), d = [];
        v.forEach((l, f) => {
          if (l.length === 3 || l.length === 4) {
            d.push(f);
            for (const u of l) s.add(u);
          }
        });
        let F = 0;
        for (const l of d) {
          const f = v[l], u = f.map((p) => C[p]), m = [
            0,
            1,
            2
          ].map((p) => [
            Math.min(...u.map((x) => x[p])),
            Math.max(...u.map((x) => x[p]))
          ]);
          for (let p = 0; p < C.length; p++) {
            if (f.includes(p)) continue;
            const x = C[p];
            if (x[0] < m[0][0] - 1e-6 || x[0] > m[0][1] + 1e-6 || x[1] < m[1][0] - 1e-6 || x[1] > m[1][1] + 1e-6 || x[2] < m[2][0] - 1e-6 || x[2] > m[2][1] + 1e-6) continue;
            let O = false;
            for (let b = 0; b < f.length && !O; b++) {
              const I = u[b], z = u[(b + 1) % f.length], A = [
                z[0] - I[0],
                z[1] - I[1],
                z[2] - I[2]
              ], U = A[0] * A[0] + A[1] * A[1] + A[2] * A[2];
              if (U < 1e-24) continue;
              const B = [
                x[0] - I[0],
                x[1] - I[1],
                x[2] - I[2]
              ], Z = (B[0] * A[0] + B[1] * A[1] + B[2] * A[2]) / U;
              if (Z <= 1e-6 || Z >= 1 - 1e-6) continue;
              const Y = [
                B[0] - Z * A[0],
                B[1] - Z * A[1],
                B[2] - Z * A[2]
              ];
              Math.hypot(Y[0], Y[1], Y[2]) <= 1e-6 * Math.sqrt(U) && (O = true);
            }
            !O || !v.some((b, I) => I !== l && b.includes(p)) || (te.push({
              node: -(l + 1),
              dof: -2,
              k: p
            }), F++);
          }
        }
        F && console.log(`[CLI Modeler] edge etabs: ${F} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const ne = [];
      for (const s of i.solids) {
        const d = s.pts.map((l) => L.get(l));
        if (d.some((l) => l === void 0)) {
          i.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const F = v.length;
        v.push(d), o.set(F, s.E), q.set(F, s.nu), S.set(F, s.E / (2 * (1 + s.nu))), h.set(F, s.rho), ne.push(F);
      }
      t.nodes.val = C, t.elements.val = v, t.nodeInputs.val = {
        supports: se,
        loads: R,
        masses: re,
        diaphragms: fe,
        springs: te
      }, t.springs && (t.springs.val = te);
      const oe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const s of i.shells) {
        const d = W.get(s.id);
        if (d === void 0) continue;
        const F = i.shellLoads.get(s.id);
        F !== void 0 && we.set(d, F);
        const l = i.shellAngles.get(s.id);
        l !== void 0 && me.set(d, l);
        const f = i.shellModsDir.get(s.id);
        if (f) {
          ue.set(d, f), oe.set(d, (f[0] + f[1]) / 2), he.set(d, (f[3] + f[4]) / 2);
          continue;
        }
        const u = i.shellMods.get(s.id);
        u ? (oe.set(d, u[0]), he.set(d, u[1])) : i.deckSecs.has(s.id) && (oe.set(d, 1), he.set(d, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: S,
        areas: e,
        momentsOfInertiaY: a,
        momentsOfInertiaZ: n,
        torsionalConstants: i.torsionFactor !== 1 ? new Map([
          ...c
        ].map(([s, d]) => [
          s,
          d * i.torsionFactor
        ])) : c,
        densities: h,
        poissonsRatios: q,
        thicknesses: K,
        membraneModifiers: oe,
        bendingModifiers: he,
        shellModifiers: ue,
        shellSurfaceLoads: we,
        shellAngles: me,
        cargaDeArea: pe,
        cantos: y,
        anchos: k,
        sectionShapes: g,
        localAngles: E,
        shearAreasY: j,
        shearAreasZ: P,
        momentReleases: M,
        endOffsets: T,
        plateFormulations: J,
        deckSections: X,
        frameLoads: D,
        meshAtIntersections: i.meshCross,
        solidIncompatible: i.solidIncompatible,
        selfWeight: i.selfWeight,
        etabsWallJoint: i.etabsWallJoint,
        areaObjects: i.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => L.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => W.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => i.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => i.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, i.doSolve && ne.length > 0 && ne.length === v.length) try {
        const s = o.get(ne[0]) ?? 25e6, d = q.get(ne[0]) ?? 0.2;
        ne.some((m) => Math.abs((o.get(m) ?? s) - s) > 1e-9 * s || Math.abs((q.get(m) ?? d) - d) > 1e-12) && i.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const F = /* @__PURE__ */ new Map();
        for (const [m, p] of t.nodeInputs.val.supports ?? []) F.set(m, [
          !!p[0],
          !!p[1],
          !!p[2]
        ]);
        const l = /* @__PURE__ */ new Map();
        for (const [m, p] of je({
          Dead: R,
          ...Object.fromEntries(Q)
        })) l.set(m, [
          p[0] ?? 0,
          p[1] ?? 0,
          p[2] ?? 0
        ]);
        const f = Be({
          nodes: C,
          elements: v,
          E: s,
          nu: d,
          supports: F,
          loads: l,
          incompatible: i.solidIncompatible
        }), u = /* @__PURE__ */ new Map();
        f.displacements.forEach(([m, p, x], O) => u.set(O, [
          m,
          p,
          x,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: u,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: f.stressPerElement,
          solidVonMises: f.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${v.length} solidos H8, ${C.length} nodos (${f.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        i.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (i.doSolve && C.length && v.length) try {
        window.__hekatanCliSprings = te;
        const s = je({
          Dead: R,
          ...Object.fromEntries(Q)
        });
        t.deformOutputs.val = Ye(C, v, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, te.length ? te : void 0);
        try {
          t.analyzeOutputs.val = Xe(C, v, t.elementInputs.val, t.deformOutputs.val);
        } catch (d) {
          console.warn("[CLI Modeler] analyze:", (d == null ? void 0 : d.message) ?? d);
        }
        if (i.areaSprings.length > 0) try {
          const d = t.deformOutputs.val.deformations, F = t.analyzeOutputs.val ?? {}, l = F.pressure instanceof Map ? F.pressure : /* @__PURE__ */ new Map();
          let f = 0, u = 0;
          for (const m of i.areaSprings) {
            const p = W.get(m.id);
            if (p === void 0) continue;
            const O = v[p].map((w) => {
              var _a2;
              const b = ((_a2 = d.get(w)) == null ? void 0 : _a2[2]) ?? 0, I = m.ks * b;
              return I < f && (f = I), I > u && (u = I), I;
            });
            l.set(p, O);
          }
          l.size > 0 && (F.pressure = l, F.colorMapRanges = {
            ...F.colorMapRanges ?? {},
            pressure: [
              u,
              f
            ]
          }, t.analyzeOutputs.val = F, console.log(`[CLI Modeler] presi\xF3n Winkler: ${l.size} shells, \u03C3 ${f.toFixed(0)}..${u.toFixed(0)} kN/m\xB2`));
        } catch (d) {
          console.warn("[CLI Modeler] presi\xF3n:", (d == null ? void 0 : d.message) ?? d);
        }
        if (ne.length > 0) try {
          const d = t.deformOutputs.val.deformations, F = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
          for (const f of ne) {
            const u = v[f], m = u.map((O) => C[O]), p = u.flatMap((O) => {
              const w = d.get(O) ?? [
                0,
                0,
                0
              ];
              return [
                w[0],
                w[1],
                w[2]
              ];
            }), x = Pe(m, o.get(f) ?? 25e6, q.get(f) ?? 0.2, p, i.solidIncompatible);
            F.set(f, x.stress), l.set(f, x.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: F,
            solidVonMises: l
          };
        } catch (d) {
          console.warn("[CLI Modeler] tensiones de solidos:", (d == null ? void 0 : d.message) ?? d);
        }
        console.log("[CLI Modeler] Solve OK \u2014", v.length, "elementos,", C.length, "nodos");
      } catch (s) {
        i.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (t.objects3D.val = [], i.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of i.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = i.errors;
      let ee = 0, ge = 0;
      const le = t.deformOutputs.val;
      if ((_a = le == null ? void 0 : le.deformations) == null ? void 0 : _a.size) for (const [, s] of le.deformations) Math.abs(s[2]) > Math.abs(ee) && (ee = s[2]);
      if ((_b = le == null ? void 0 : le.reactions) == null ? void 0 : _b.size) for (const [, s] of le.reactions) ge += s[2] || 0;
      window.__hekatanCliStats = {
        nodes: C.length,
        frames: i.frames.length,
        shells: i.shells.length,
        supports: se.size,
        loads: R.size,
        springs: te.length,
        solved: i.doSolve,
        errors: i.errors.length,
        maxUzMm: +(ee * 1e3).toFixed(3),
        sumRz: +ge.toFixed(1)
      };
    }
  };
});
export {
  __tla,
  ns as c,
  Ge as p
};
