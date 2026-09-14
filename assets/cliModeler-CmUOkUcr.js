import { c as _e, a as Be } from "./cadSections-DVtTZU6U.js";
import { c as je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Re, a as Pe, __tla as __tla_0 } from "./h8-CE0H6FD1.js";
import { a as Xe } from "./analyze-DgLgRmKg.js";
import { m as Ue, d as Ye, __tla as __tla_1 } from "./didacticCpp-reRUqpUx.js";
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
    const A = [
      false,
      false,
      false,
      false,
      false,
      false
    ], i = t.split(/[\s,]+/).filter(Boolean);
    if (i.length > 1 && i.length <= 6 && i.every((y) => y === "0" || y === "1")) return i.forEach((y, N) => {
      A[N] = y === "1";
    }), A;
    for (const y of i) De[y] !== void 0 && (A[De[y]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let y = 0; y < t.length; y++) A[y] = t[y] === "1";
    return A;
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
    let A = null, i = 0, y = 0, N = 0;
    const L = r.split(/\r?\n/);
    for (let q = 0; q < L.length; q++) {
      let F = L[q].trim();
      if (!F || F.startsWith("#") || F.startsWith("//")) continue;
      F = F.replace(/[;]+$/, "");
      const o = F.split(/\s+/), S = o[0].toLowerCase();
      if (S === "nodes" && o.length === 1) {
        A = "nodes";
        continue;
      }
      if ((S === "elements" || S === "frames") && o.length === 1) {
        A = "elements";
        continue;
      }
      if (S === "areas" && o.length === 1) {
        A = "areas";
        continue;
      }
      if (S === "supports" && o.length === 1) {
        A = "supports";
        continue;
      }
      if (S === "loads" && o.length === 1) {
        A = "loads";
        continue;
      }
      if (S === "springs" && o.length === 1) {
        A = "springs";
        continue;
      }
      if (A && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if (A === "nodes" && e.length >= 3) {
          i++, t.nodes.set(i, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (A === "elements" && e.length >= 2) {
          y++, t.frames.push({
            id: y,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (A === "areas" && e.length >= 4) {
          N++, t.shells.push({
            id: N,
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
        if (A === "loads" && e.length >= 4) {
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
        if (A === "springs" && e.length >= 3) {
          t.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if (A === "supports" && /^\d/.test(o[0])) {
        const e = parseInt(o[0], 10), a = o.slice(1).join(" ");
        t.supports.set(e, Je(a));
        continue;
      }
      A && !/^[\-\d]/.test(o[0]) && (A = null);
      try {
        switch (S) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2]), n = parseFloat(o[3]), c = parseFloat(o[4]);
            !isFinite(e) || !isFinite(a) || !isFinite(n) || !isFinite(c) ? t.errors.push(`L${q + 1}: node mal formado: ${F}`) : t.nodes.set(e, [
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
            const e = parseInt(o[1], 10), a = parseInt(o[2], 10), n = parseInt(o[3], 10), c = parseFloat(o[4] ?? "25e6"), u = parseFloat(o[5] ?? "0.16"), E = parseFloat(o[6] ?? "0.001"), x = o[7] !== void 0 ? parseFloat(o[7]) : void 0, g = o[8] !== void 0 ? parseFloat(o[8]) : void 0, C = o[9] !== void 0 ? parseFloat(o[9]) : void 0, M = o[10] !== void 0 ? parseFloat(o[10]) : void 0, z = o[11] !== void 0 ? parseFloat(o[11]) : void 0, J = o[12] !== void 0 ? parseFloat(o[12]) : void 0, X = o.indexOf("#"), D = X >= 0 && o[X + 1] ? o[X + 1] : void 0;
            t.frames.push({
              id: e,
              nI: a,
              nJ: n,
              E: c,
              A: u,
              I: E,
              Iy: x,
              J: g,
              nu: C,
              rho: M,
              D: z,
              B: J,
              sec: D
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), c = parseFloat(o[4] ?? "25e6"), u = parseFloat(o[5] ?? "0.2");
            isFinite(e) && a > 0 && n > 0 && n < a / 2 && c > 0 ? t.frameCftc.set(e, {
              D: a,
              t: n,
              Ec: c,
              nuC: isFinite(u) ? u : 0.2
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? ""), n = parseFloat(o[3] ?? ""), c = parseFloat(o[4] ?? ""), u = parseFloat(o[5] ?? "25e6"), E = parseFloat(o[6] ?? "0.2");
            isFinite(e) && a > 0 && n > 0 && c > 0 && c < Math.min(a, n) / 2 && u > 0 ? t.frameCft.set(e, {
              b: a,
              h: n,
              t: c,
              Ec: u,
              nuC: isFinite(E) ? E : 0.2
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
            if (a.length === 2 && a.every((c) => /^(pin|fix|libre|rigido)$/.test(c))) a.forEach((c, u) => {
              (c === "pin" || c === "libre") && (n[u * 6 + 4] = true, n[u * 6 + 5] = true);
            });
            else {
              const c = a.filter((u) => u === "0" || u === "1");
              if (c.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${c.length}`);
                break;
              }
              for (let u = 0; u < 12; u++) n[u] = c[u] === "1";
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
            ], n = parseFloat(o[6] ?? "0.20"), c = parseFloat(o[7] ?? "25e6"), u = o[9] !== void 0 ? parseFloat(o[9]) : void 0, E = u !== void 0 && isFinite(u) ? u : void 0;
            if (t.shells.push({
              id: e,
              pts: a,
              t: n,
              E: c,
              rho: E
            }), o[8] !== void 0) {
              const x = parseFloat(o[8]);
              isFinite(x) && x !== 0 && t.shellLoads.set(e, x);
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
            const [a, n, c, u, E, x, g] = e, C = [];
            for (let M = x; M <= g; M++) C.push(M);
            t.areaObjs.push({
              id: a,
              pts: [
                n,
                c,
                u,
                E
              ],
              cells: C
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
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), u = parseFloat(o[5] ?? "0"), E = parseFloat(o[6] ?? "0"), x = parseFloat(o[7] ?? "0"), g = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(g) ? t.loads.set(e, [
              a,
              n,
              c,
              u,
              E,
              x
            ]) : (t.loadsPat.has(g) || t.loadsPat.set(g, /* @__PURE__ */ new Map()), t.loadsPat.get(g).set(e, [
              a,
              n,
              c,
              u,
              E,
              x
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), n = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), u = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", E = /^dead$/i.test(u) ? t.frameLoads : t.frameLoadsPat.get(u) ?? (t.frameLoadsPat.set(u, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(u)), x = E.get(e) ?? [
              0,
              0,
              0
            ];
            E.set(e, [
              x[0] + a,
              x[1] + n,
              x[2] + c
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
`, B = (r, t) => [
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
  function We(r, t) {
    const A = r.shellModsDir.get(t);
    return !!A && Math.abs(A[3]) < 1e-12 && Math.abs(A[4]) < 1e-12 && Math.abs(A[5]) < 1e-12;
  }
  function Ve(r, t = 200, A) {
    const i = [
      0,
      1,
      2
    ].map((g) => (r[0][g] + r[1][g] + r[2][g] + r[3][g]) / 4);
    let y = B(r[1], r[0]), N = Fe(y, B(r[3], r[0]));
    N = ae(N, 1 / G(N)), y = ae(y, 1 / G(y));
    const L = Fe(N, y), q = r.map((g) => [
      de(B(g, i), y),
      de(B(g, i), L)
    ]);
    let F = [
      0,
      1,
      2,
      3
    ];
    if (A) {
      const g = [
        0,
        1,
        2,
        3
      ].map((C) => {
        const M = B(r[(C + 1) % 4], r[C]);
        return Math.abs(de(M, A)) / G(M);
      });
      F = [
        0,
        1,
        2,
        3
      ].sort((C, M) => g[C] - g[M]).slice(0, 2);
    }
    const o = q.map((g) => g[0]), S = q.map((g) => g[1]), e = Math.min(...o), a = Math.max(...o), n = Math.min(...S), c = Math.max(...S), u = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let E = 0;
    for (let g = 0; g < t; g++) for (let C = 0; C < t; C++) {
      const M = e + (a - e) * (g + 0.5) / t, z = n + (c - n) * (C + 0.5) / t;
      let J = 0, X = 0;
      for (let P = 0; P < 4; P++) {
        const _ = q[P], K = q[(P + 1) % 4];
        (K[0] - _[0]) * (z - _[1]) - (K[1] - _[1]) * (M - _[0]) >= 0 ? J++ : X++;
      }
      if (J !== 4 && X !== 4) continue;
      let D = F[0], T = 1 / 0;
      for (const P of F) {
        const _ = q[P], K = q[(P + 1) % 4], se = K[0] - _[0], W = K[1] - _[1], fe = se * se + W * W, re = Math.max(0, Math.min(1, ((M - _[0]) * se + (z - _[1]) * W) / fe)), Q = Math.hypot(M - (_[0] + re * se), z - (_[1] + re * W));
        Q < T && (T = Q, D = P);
      }
      u[D].pts.push([
        i[0] + M * y[0] + z * L[0],
        i[1] + M * y[1] + z * L[1],
        i[2] + M * y[2] + z * L[2]
      ]), E++;
    }
    const x = 0.5 * G(Fe(B(r[2], r[0]), B(r[3], r[1])));
    for (const g of u) g.dA = E ? x / E : 0;
    return u;
  }
  function Ke(r, t) {
    if (!(t > 0)) return;
    const A = 1e-6, i = (S) => r.nodes.get(S);
    let y = Math.max(0, ...r.nodes.keys()) + 1, N = r.shells.reduce((S, e) => Math.max(S, e.id), 0) + 1;
    const L = (S) => {
      for (const [a, n] of r.nodes) if (G(B(n, S)) < A) return a;
      const e = y++;
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
      const c = r.shellLoads.get(S);
      c !== void 0 && r.shellLoads.set(e, c);
      const u = r.shellTypes.get(S);
      u !== void 0 && r.shellTypes.set(e, u);
      const E = r.shellAngles.get(S);
      E !== void 0 && r.shellAngles.set(e, E);
    }, F = [];
    let o = 0;
    for (const S of r.shells) {
      if (S.pts.length !== 4) {
        F.push(S);
        continue;
      }
      const e = S.pts.map(i);
      if (e.some((g) => !g)) {
        F.push(S);
        continue;
      }
      const a = (G(B(e[1], e[0])) + G(B(e[2], e[3]))) / 2, n = (G(B(e[3], e[0])) + G(B(e[2], e[1]))) / 2, c = Math.max(1, Math.ceil(a / t - 1e-9)), u = Math.max(1, Math.ceil(n / t - 1e-9));
      if (c === 1 && u === 1) {
        F.push(S);
        continue;
      }
      const E = (g, C) => [
        0,
        1,
        2
      ].map((M) => e[0][M] * (1 - g) * (1 - C) + e[1][M] * g * (1 - C) + e[2][M] * g * C + e[3][M] * (1 - g) * C), x = [];
      for (let g = 0; g <= c; g++) {
        const C = [];
        for (let M = 0; M <= u; M++) C.push(L(E(g / c, M / u)));
        x.push(C);
      }
      for (let g = 0; g < c; g++) for (let C = 0; C < u; C++) {
        const M = g === 0 && C === 0 ? S.id : N++;
        F.push({
          ...S,
          id: M,
          pts: [
            x[g][C],
            x[g + 1][C],
            x[g + 1][C + 1],
            x[g][C + 1]
          ]
        }), M !== S.id && q(S.id, M);
      }
      o++;
    }
    o && (r.shells = F, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${r.shells.length} cascaras, ${r.nodes.size} nudos`));
  }
  function Qe(r) {
    const A = (n) => r.nodes.get(n), i = [
      ...r.nodes.keys()
    ], y = (n, c, u) => {
      const E = B(c, n), x = G(E), g = ae(E, 1 / x), C = [];
      for (const M of i) {
        if (u.includes(M)) continue;
        const z = B(A(M), n), J = de(z, g);
        J > 1e-6 && J < x - 1e-6 && G(B(z, ae(g, J))) < 1e-4 && C.push(J / x);
      }
      return C.sort((M, z) => M - z);
    }, N = (n, c) => {
      const u = [];
      for (const E of n) c.some((x) => Math.abs(E - x) < 1e-5) && !u.some((x) => Math.abs(E - x) < 1e-5) && u.push(E);
      return u;
    }, L = (n) => {
      for (const c of i) if (G(B(A(c), n)) < 1e-4) return c;
    };
    let q = r.shells.reduce((n, c) => Math.max(n, c.id), 0) + 1;
    const F = [], o = (n, c) => {
      const u = r.shellModsDir.get(n);
      u && r.shellModsDir.set(c, [
        ...u
      ]);
      const E = r.shellMods.get(n);
      E && r.shellMods.set(c, [
        ...E
      ]);
      const x = r.shellLoads.get(n);
      x !== void 0 && r.shellLoads.set(c, x);
      const g = r.shellTypes.get(n);
      g !== void 0 && r.shellTypes.set(c, g);
      const C = r.shellAngles.get(n);
      C !== void 0 && r.shellAngles.set(c, C);
    };
    for (const n of r.shells) {
      if (!We(r, n.id) || n.pts.length !== 4 || n.pts.some((D) => !r.nodes.has(D))) {
        F.push(n);
        continue;
      }
      const c = n.pts.map(A), u = y(c[0], c[1], n.pts), E = y(c[2], c[3], n.pts).map((D) => 1 - D), x = y(c[1], c[2], n.pts), g = y(c[3], c[0], n.pts).map((D) => 1 - D);
      let C = [
        0,
        ...N(u, E),
        1
      ], M = [
        0,
        ...N(x, g),
        1
      ];
      if (C.length === 2 && M.length === 2) {
        F.push(n);
        continue;
      }
      const z = (D, T) => [
        0,
        1,
        2
      ].map((P) => (1 - D) * (1 - T) * c[0][P] + D * (1 - T) * c[1][P] + D * T * c[2][P] + (1 - D) * T * c[3][P]);
      let J = M.map((D) => C.map((T) => L(z(T, D))));
      if (J.some((D) => D.some((T) => T === void 0)) && (C.length >= M.length ? M = [
        0,
        1
      ] : C = [
        0,
        1
      ], J = M.map((D) => C.map((T) => L(z(T, D)))), J.some((D) => D.some((T) => T === void 0)))) {
        F.push(n);
        continue;
      }
      let X = true;
      for (let D = 0; D < M.length - 1; D++) for (let T = 0; T < C.length - 1; T++) {
        const P = [
          J[D][T],
          J[D][T + 1],
          J[D + 1][T + 1],
          J[D + 1][T]
        ], _ = X ? n.id : q++;
        X || o(n.id, _), X = false, F.push({
          id: _,
          pts: P,
          t: n.t,
          E: n.E,
          rho: n.rho
        });
      }
    }
    r.shells = F;
    const S = 9.80665, e = (n, c) => {
      const u = r.loads.get(n) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      r.loads.set(n, [
        u[0] + c[0],
        u[1] + c[1],
        u[2] + c[2],
        u[3] + c[3],
        u[4] + c[4],
        u[5] + c[5]
      ]);
    }, a = (n, c) => {
      const u = B(c, n), E = G(u), x = ae(u, 1 / E);
      return r.frames.filter((g) => [
        g.nI,
        g.nJ
      ].every((C) => {
        const M = r.nodes.get(C);
        if (!M) return false;
        const z = B(M, n), J = de(z, x);
        return J > -1e-4 && J < E + 1e-4 && G(B(z, ae(x, J))) < 1e-4;
      }));
    };
    for (const n of r.shells) {
      if (!We(r, n.id) || n.pts.length !== 4) continue;
      const c = r.selfWeight ? (n.rho ?? 2.45) * n.t * S * r.selfWeight : 0, u = r.shellLoads.get(n.id) ?? 0, E = -c + u;
      if (Math.abs(E) < 1e-15) continue;
      const x = n.pts.map(A);
      let g;
      if (r.deckOneWay) {
        const M = B(x[1], x[0]);
        let z = Fe(M, B(x[3], x[0]));
        z = ae(z, 1 / G(z));
        const J = ae(M, 1 / G(M)), X = Fe(z, J), D = (r.shellAngles.get(n.id) ?? 0) * Math.PI / 180;
        g = [
          0,
          1,
          2
        ].map((T) => Math.cos(D) * J[T] + Math.sin(D) * X[T]);
      }
      const C = Ve(x, 200, g);
      for (let M = 0; M < 4; M++) {
        const { pts: z, dA: J } = C[M];
        if (!z.length) continue;
        const X = x[M], D = x[(M + 1) % 4], T = a(X, D);
        if (!T.length) {
          const W = E * J * z.length;
          e(n.pts[M], [
            0,
            0,
            W / 2,
            0,
            0,
            0
          ]), e(n.pts[(M + 1) % 4], [
            0,
            0,
            W / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const P = B(D, X), _ = G(P), K = ae(P, 1 / _), se = z.map((W) => de(B(W, X), K));
        for (const W of T) {
          const fe = A(W.nI), re = A(W.nJ), Q = de(B(fe, X), K), be = de(B(re, X), K), pe = Math.min(Q, be), H = Math.max(Q, be), ce = H - pe;
          if (ce < 1e-9) continue;
          const te = H >= _ - 1e-6, ne = ae(B(re, fe), 1 / ce), oe = Fe(ne, [
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
          const ee = E * J;
          e(W.nI, [
            0,
            0,
            ee * he,
            oe[0] * ee * ue,
            oe[1] * ee * ue,
            oe[2] * ee * ue
          ]), e(W.nJ, [
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
    runModal(r, t, A) {
      var _a;
      const i = t.nodes.val, y = t.elements.val;
      if (!(!i.length || !y.length)) try {
        const N = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), L = t.nodeInputs.val, q = window.__hekatanCliSprings, F = Ue(i, y, L, t.elementInputs.val, N, 0, 0, 1, (L == null ? void 0 : L.diaphragms) instanceof Map && L.diaphragms.size ? L.diaphragms : void 0, q && q.length ? q : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${F.frequencies.length} modos, T1 = ${F.frequencies[0] ? (1 / F.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = A == null ? void 0 : A.render) == null ? void 0 : _a.call(A, F, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (N) {
        console.error("[CLI Modeler] modal:", (N == null ? void 0 : N.message) ?? N);
      }
    },
    build(r, t) {
      var _a, _b;
      const A = window.__hekatanCliScript ?? Ze;
      window.__hekatanCliLastScript = A;
      const i = Ge(A);
      i.autoMesh > 0 && Ke(i, i.autoMesh), i.deckEtabs && Qe(i);
      const y = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), L = [], q = Array.from(i.nodes.keys()).sort((s, d) => s - d);
      for (const s of q) y.set(s, L.length), L.push(i.nodes.get(s));
      const F = [], o = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map();
      for (const s of i.frames) {
        const d = y.get(s.nI), b = y.get(s.nJ);
        if (d === void 0 || b === void 0) {
          const w = q.length ? `IDs disponibles: ${q.join(", ")}` : "ning\xFAn nodo definido", j = [];
          d === void 0 && j.push(s.nI), b === void 0 && j.push(s.nJ), i.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${j.join(", ")}] \u2014 ${w}`);
          continue;
        }
        const l = F.length;
        F.push([
          d,
          b
        ]);
        const f = s.nu ?? 0.2;
        o.set(l, s.E), S.set(l, s.E / (2 * (1 + f))), e.set(l, s.A), a.set(l, s.I), n.set(l, s.Iy ?? s.I), c.set(l, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), u.set(l, s.rho ?? 2.45), _.set(l, f), s.D !== void 0 && isFinite(s.D) && E.set(l, s.D), s.B !== void 0 && isFinite(s.B) && x.set(l, s.B);
        const h = i.frameAngles.get(s.id);
        h !== void 0 && isFinite(h) && C.set(l, h);
        const m = i.frameReleases.get(s.id);
        m && M.set(l, m);
        const p = i.frameEndOffsets.get(s.id);
        p && z.set(l, p);
        const k = i.frameLoads.get(s.id);
        k && D.set(l, k);
        const O = i.frameShearAreas.get(s.id);
        if (O && (P.set(l, O[0]), T.set(l, O[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const w = {
            type: "general"
          };
          s.sec && (w.name = s.sec), s.D !== void 0 && isFinite(s.D) && (w.h = s.D), s.B !== void 0 && isFinite(s.B) && (w.b = s.B), g.set(l, w);
        }
        const v = i.frameCftc.get(s.id);
        if (v) {
          const w = _e(v.D, v.t, s.E, f, v.Ec, v.nuC);
          e.set(l, w.A), n.set(l, w.Iz), a.set(l, w.Iy), c.set(l, w.J), P.set(l, w.As2), T.set(l, w.As3), E.set(l, v.D), x.set(l, v.D), g.set(l, {
            type: "CFT",
            d: v.D,
            tw: v.t,
            fillE: v.Ec,
            name: s.sec ?? `CFTC ${Math.round(v.D * 1e3)}X${Math.round(v.t * 1e3)}`
          });
        }
        const I = i.frameCft.get(s.id);
        if (I) {
          const w = Be(I.b, I.h, I.t, s.E, f, I.Ec, I.nuC);
          e.set(l, w.A), n.set(l, w.Iz), a.set(l, w.Iy), c.set(l, w.J), P.set(l, w.As2), T.set(l, w.As3), E.set(l, I.h), x.set(l, I.b), g.set(l, {
            type: "CFT",
            b: I.b,
            h: I.h,
            tw: I.t,
            fillE: I.Ec,
            name: s.sec ?? `CFT ${Math.round(I.h * 1e3)}X${Math.round(I.b * 1e3)}X${Math.round(I.t * 1e3)}`
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
          u,
          _,
          E,
          x,
          C,
          T,
          P,
          g,
          D
        ], b = (m, p) => {
          for (const k of d) k.has(m) && k.set(p, k.get(m));
        }, l = (m) => {
          for (let p = 0; p < L.length; p++) if (Math.hypot(L[p][0] - m[0], L[p][1] - m[1], L[p][2] - m[2]) < 1e-6) return p;
          return L.push([
            m[0],
            m[1],
            m[2]
          ]), L.length - 1;
        }, f = (m) => {
          const p = L[m[0]], k = L[m[1]];
          return [
            Math.min(p[0], k[0]),
            Math.min(p[1], k[1]),
            Math.min(p[2], k[2]),
            Math.max(p[0], k[0]),
            Math.max(p[1], k[1]),
            Math.max(p[2], k[2])
          ];
        };
        let h = 0;
        for (let m = 0; m < F.length; m++) {
          if (F[m].length !== 2) continue;
          const p = f(F[m]);
          for (let k = m + 1; k < F.length; k++) {
            if (F[k].length !== 2) continue;
            const [O, v] = F[m], [I, w] = F[k];
            if (O === I || O === w || v === I || v === w) continue;
            const j = f(F[k]);
            if (p[0] > j[3] + 1e-6 || j[0] > p[3] + 1e-6 || p[1] > j[4] + 1e-6 || j[1] > p[4] + 1e-6 || p[2] > j[5] + 1e-6 || j[2] > p[5] + 1e-6) continue;
            const $ = L[O], U = L[v], R = L[I], Z = L[w], Y = [
              U[0] - $[0],
              U[1] - $[1],
              U[2] - $[2]
            ], V = [
              Z[0] - R[0],
              Z[1] - R[1],
              Z[2] - R[2]
            ], ie = [
              $[0] - R[0],
              $[1] - R[1],
              $[2] - R[2]
            ], Le = s(Y, Y), xe = s(Y, V), Ce = s(V, V), Oe = s(Y, ie), ze = s(V, ie), Ee = Le * Ce - xe * xe;
            if (Ee < 1e-10 * Le * Ce) continue;
            const Ie = (xe * ze - Ce * Oe) / Ee, ve = (Le * ze - xe * Oe) / Ee;
            if (Ie < 1e-6 || Ie > 1 - 1e-6 || ve < 1e-6 || ve > 1 - 1e-6) continue;
            const ye = [
              $[0] + Ie * Y[0],
              $[1] + Ie * Y[1],
              $[2] + Ie * Y[2]
            ], Se = [
              R[0] + ve * V[0],
              R[1] + ve * V[1],
              R[2] + ve * V[2]
            ];
            if (Math.hypot(ye[0] - Se[0], ye[1] - Se[1], ye[2] - Se[2]) > 1e-6) continue;
            const Te = l(ye);
            for (const Me of [
              m,
              k
            ]) {
              const [Ne, qe] = F[Me], Ae = F.length;
              F[Me] = [
                Ne,
                Te
              ], F.push([
                Te,
                qe
              ]), b(Me, Ae);
              const $e = M.get(Me);
              $e && (M.set(Me, [
                ...$e.slice(0, 6),
                ...Array(6).fill(false)
              ]), M.set(Ae, [
                ...Array(6).fill(false),
                ...$e.slice(6)
              ]));
              const ke = z.get(Me);
              ke && (z.set(Me, [
                ke[0],
                0,
                ke[2]
              ]), z.set(Ae, [
                0,
                ke[1],
                ke[2]
              ]));
            }
            h++;
          }
        }
        h > 0 && console.log(`[CLI Modeler] ${h} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of i.shells) {
        const d = s.pts.map((h) => y.get(h));
        if (d.some((h) => h === void 0)) {
          i.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const b = F.length;
        N.set(s.id, b), F.push(d), o.set(b, s.E), S.set(b, s.E / (2 * 1.2)), K.set(b, s.t), u.set(b, s.rho ?? 2.45), _.set(b, 0.2);
        const l = i.shellTypes.get(s.id);
        l !== void 0 && J.set(b, l);
        const f = i.deckSecs.get(s.id);
        if (f) {
          const h = f.tc + (f.sr > 0 ? f.hr * (f.wrt + f.wrb) / 2 / f.sr : 0);
          K.set(b, f.tc), u.set(b, ((s.rho ?? 2.45) * h + f.w / 9.80665) / f.tc), X.set(b, {
            ...f
          });
        }
      }
      const se = /* @__PURE__ */ new Map();
      for (const [s, d] of i.supports.entries()) {
        const b = y.get(s);
        b !== void 0 && se.set(b, d);
      }
      const W = /* @__PURE__ */ new Map();
      for (const [s, d] of i.loads.entries()) {
        const b = y.get(s);
        b !== void 0 && W.set(b, [
          ...d
        ]);
      }
      const fe = /* @__PURE__ */ new Map();
      for (const [s, d] of i.diaphragms.entries()) {
        const b = y.get(s);
        b !== void 0 && fe.set(b, d);
      }
      const re = /* @__PURE__ */ new Map();
      for (const [s, d] of i.masses.entries()) {
        const b = y.get(s);
        b !== void 0 && re.set(b, d);
      }
      const Q = /* @__PURE__ */ new Map();
      for (const [s, d] of i.loadsPat) {
        const b = /* @__PURE__ */ new Map();
        for (const [l, f] of d) {
          const h = y.get(l);
          h !== void 0 && b.set(h, [
            ...f
          ]);
        }
        Q.set(s, b);
      }
      const be = [
        [
          i.frameLoads,
          W
        ]
      ];
      for (const [s, d] of i.frameLoadsPat) Q.has(s) || Q.set(s, /* @__PURE__ */ new Map()), be.push([
        d,
        Q.get(s)
      ]);
      for (const [s, d] of be) if (s.size) {
        const b = (l, f) => {
          const h = d.get(l) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          d.set(l, [
            h[0] + f[0],
            h[1] + f[1],
            h[2] + f[2],
            h[3] + f[3],
            h[4] + f[4],
            h[5] + f[5]
          ]);
        };
        for (const [l, f] of s.entries()) {
          const h = i.frames.find((U) => U.id === l);
          if (!h) {
            i.errors.push(`frameload ${l}: no existe esa barra`);
            continue;
          }
          const m = y.get(h.nI), p = y.get(h.nJ);
          if (m === void 0 || p === void 0) continue;
          const k = L[m], O = L[p], v = [
            O[0] - k[0],
            O[1] - k[1],
            O[2] - k[2]
          ], I = Math.hypot(v[0], v[1], v[2]);
          if (I < 1e-9) continue;
          const w = [
            v[0] / I,
            v[1] / I,
            v[2] / I
          ], j = I * I / 12, $ = [
            w[1] * f[2] - w[2] * f[1],
            w[2] * f[0] - w[0] * f[2],
            w[0] * f[1] - w[1] * f[0]
          ];
          b(m, [
            f[0] * I / 2,
            f[1] * I / 2,
            f[2] * I / 2,
            j * $[0],
            j * $[1],
            j * $[2]
          ]), b(p, [
            f[0] * I / 2,
            f[1] * I / 2,
            f[2] * I / 2,
            -j * $[0],
            -j * $[1],
            -j * $[2]
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
        const b = s.pts.map((h) => y.get(h));
        if (b.some((h) => h === void 0)) {
          i.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const l = b.map((h) => L[h]), f = [
          0,
          0,
          0,
          0
        ];
        for (const [h, m] of ce) {
          const p = [
            0.25 * (1 - h) * (1 - m),
            0.25 * (1 + h) * (1 - m),
            0.25 * (1 + h) * (1 + m),
            0.25 * (1 - h) * (1 + m)
          ], k = [
            -0.25 * (1 - m),
            0.25 * (1 - m),
            0.25 * (1 + m),
            -0.25 * (1 + m)
          ], O = [
            -0.25 * (1 - h),
            -0.25 * (1 + h),
            0.25 * (1 + h),
            0.25 * (1 - h)
          ], v = [
            0,
            1,
            2
          ].map(($) => k.reduce((U, R, Z) => U + R * l[Z][$], 0)), I = [
            0,
            1,
            2
          ].map(($) => O.reduce((U, R, Z) => U + R * l[Z][$], 0)), w = [
            v[1] * I[2] - v[2] * I[1],
            v[2] * I[0] - v[0] * I[2],
            v[0] * I[1] - v[1] * I[0]
          ], j = Math.hypot(w[0], w[1], w[2]);
          for (let $ = 0; $ < 4; $++) f[$] += p[$] * d * j;
        }
        for (let h = 0; h < 4; h++) {
          const m = b[h], p = W.get(m) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += f[h], W.set(m, p), pe.set(m, (pe.get(m) ?? 0) + f[h]);
        }
      }
      if (i.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [l, f] of N) i.deckTributario.has(l) && d.add(f);
        const b = (l, f) => {
          const h = W.get(l) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          h[2] += f, W.set(l, h);
        };
        F.forEach((l, f) => {
          const h = u.get(f) ?? 0;
          if (h && !d.has(f)) {
            if (l.length === 2) {
              const m = e.get(f) ?? 0, p = L[l[0]], k = L[l[1]], O = [
                k[0] - p[0],
                k[1] - p[1],
                k[2] - p[2]
              ];
              let v = Math.hypot(O[0], O[1], O[2]);
              const I = z.get(f);
              if (I) {
                const Y = Math.hypot(O[0], O[1]);
                Y > 1e-9 && Math.abs(Math.atan2(Math.abs(O[2]), Y)) * 180 / Math.PI < 20 && (v = Math.max(v - I[0] - I[1], 0));
              }
              const w = Math.hypot(O[0], O[1], O[2]), j = -m * h * 9.80665 * i.selfWeight, $ = [
                O[0] / w,
                O[1] / w,
                O[2] / w
              ], U = v * v / 12, R = [
                $[1] * j,
                -$[0] * j,
                0
              ], Z = (Y, V) => {
                const ie = W.get(Y) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                W.set(Y, [
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
                j * v / 2,
                U * R[0],
                U * R[1],
                0
              ]), Z(l[1], [
                0,
                0,
                j * v / 2,
                -U * R[0],
                -U * R[1],
                0
              ]);
            } else if (l.length === 4) {
              const m = K.get(f) ?? 0, p = l.map((v) => L[v]);
              let k = 0;
              for (let v = 1; v < 3; v++) {
                const I = [
                  p[v][0] - p[0][0],
                  p[v][1] - p[0][1],
                  p[v][2] - p[0][2]
                ], w = [
                  p[v + 1][0] - p[0][0],
                  p[v + 1][1] - p[0][1],
                  p[v + 1][2] - p[0][2]
                ], j = [
                  I[1] * w[2] - I[2] * w[1],
                  I[2] * w[0] - I[0] * w[2],
                  I[0] * w[1] - I[1] * w[0]
                ];
                k += Math.hypot(j[0], j[1], j[2]) / 2;
              }
              const O = k * m * h * 9.80665 * i.selfWeight;
              for (const v of l) b(v, -O / 4);
            }
          }
        });
      }
      const te = [];
      for (const s of i.springs) {
        const d = y.get(s.node);
        d !== void 0 && te.push({
          node: d,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of i.areaSprings) {
        const d = N.get(s.id);
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
        F.forEach((l, f) => {
          if (l.length === 3 || l.length === 4) {
            d.push(f);
            for (const h of l) s.add(h);
          }
        });
        let b = 0;
        for (const l of d) {
          const f = F[l], h = f.map((p) => L[p]), m = [
            0,
            1,
            2
          ].map((p) => [
            Math.min(...h.map((k) => k[p])),
            Math.max(...h.map((k) => k[p]))
          ]);
          for (let p = 0; p < L.length; p++) {
            if (f.includes(p)) continue;
            const k = L[p];
            if (k[0] < m[0][0] - 1e-6 || k[0] > m[0][1] + 1e-6 || k[1] < m[1][0] - 1e-6 || k[1] > m[1][1] + 1e-6 || k[2] < m[2][0] - 1e-6 || k[2] > m[2][1] + 1e-6) continue;
            let O = false;
            for (let I = 0; I < f.length && !O; I++) {
              const w = h[I], j = h[(I + 1) % f.length], $ = [
                j[0] - w[0],
                j[1] - w[1],
                j[2] - w[2]
              ], U = $[0] * $[0] + $[1] * $[1] + $[2] * $[2];
              if (U < 1e-24) continue;
              const R = [
                k[0] - w[0],
                k[1] - w[1],
                k[2] - w[2]
              ], Z = (R[0] * $[0] + R[1] * $[1] + R[2] * $[2]) / U;
              if (Z <= 1e-6 || Z >= 1 - 1e-6) continue;
              const Y = [
                R[0] - Z * $[0],
                R[1] - Z * $[1],
                R[2] - Z * $[2]
              ];
              Math.hypot(Y[0], Y[1], Y[2]) <= 1e-6 * Math.sqrt(U) && (O = true);
            }
            !O || !F.some((I, w) => w !== l && I.includes(p)) || (te.push({
              node: -(l + 1),
              dof: -2,
              k: p
            }), b++);
          }
        }
        b && console.log(`[CLI Modeler] edge etabs: ${b} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const ne = [];
      for (const s of i.solids) {
        const d = s.pts.map((l) => y.get(l));
        if (d.some((l) => l === void 0)) {
          i.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const b = F.length;
        F.push(d), o.set(b, s.E), _.set(b, s.nu), S.set(b, s.E / (2 * (1 + s.nu))), u.set(b, s.rho), ne.push(b);
      }
      t.nodes.val = L, t.elements.val = F, t.nodeInputs.val = {
        supports: se,
        loads: W,
        masses: re,
        diaphragms: fe,
        springs: te
      }, t.springs && (t.springs.val = te);
      const oe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const s of i.shells) {
        const d = N.get(s.id);
        if (d === void 0) continue;
        const b = i.shellLoads.get(s.id);
        b !== void 0 && we.set(d, b);
        const l = i.shellAngles.get(s.id);
        l !== void 0 && me.set(d, l);
        const f = i.shellModsDir.get(s.id);
        if (f) {
          ue.set(d, f), oe.set(d, (f[0] + f[1]) / 2), he.set(d, (f[3] + f[4]) / 2);
          continue;
        }
        const h = i.shellMods.get(s.id);
        h ? (oe.set(d, h[0]), he.set(d, h[1])) : i.deckSecs.has(s.id) && (oe.set(d, 1), he.set(d, 0));
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
        densities: u,
        poissonsRatios: _,
        thicknesses: K,
        membraneModifiers: oe,
        bendingModifiers: he,
        shellModifiers: ue,
        shellSurfaceLoads: we,
        shellAngles: me,
        cargaDeArea: pe,
        cantos: E,
        anchos: x,
        sectionShapes: g,
        localAngles: C,
        shearAreasY: T,
        shearAreasZ: P,
        momentReleases: M,
        endOffsets: z,
        plateFormulations: J,
        deckSections: X,
        frameLoads: D,
        meshAtIntersections: i.meshCross,
        solidIncompatible: i.solidIncompatible,
        selfWeight: i.selfWeight,
        etabsWallJoint: i.etabsWallJoint,
        areaObjects: i.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => y.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => N.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => i.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => i.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, i.doSolve && ne.length > 0 && ne.length === F.length) try {
        const s = o.get(ne[0]) ?? 25e6, d = _.get(ne[0]) ?? 0.2;
        ne.some((m) => Math.abs((o.get(m) ?? s) - s) > 1e-9 * s || Math.abs((_.get(m) ?? d) - d) > 1e-12) && i.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const b = /* @__PURE__ */ new Map();
        for (const [m, p] of t.nodeInputs.val.supports ?? []) b.set(m, [
          !!p[0],
          !!p[1],
          !!p[2]
        ]);
        const l = /* @__PURE__ */ new Map();
        for (const [m, p] of je({
          Dead: W,
          ...Object.fromEntries(Q)
        })) l.set(m, [
          p[0] ?? 0,
          p[1] ?? 0,
          p[2] ?? 0
        ]);
        const f = Re({
          nodes: L,
          elements: F,
          E: s,
          nu: d,
          supports: b,
          loads: l,
          incompatible: i.solidIncompatible
        }), h = /* @__PURE__ */ new Map();
        f.displacements.forEach(([m, p, k], O) => h.set(O, [
          m,
          p,
          k,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: h,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: f.stressPerElement,
          solidVonMises: f.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${F.length} solidos H8, ${L.length} nodos (${f.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        i.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (i.doSolve && L.length && F.length) try {
        window.__hekatanCliSprings = te;
        const s = je({
          Dead: W,
          ...Object.fromEntries(Q)
        });
        t.deformOutputs.val = Ye(L, F, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, te.length ? te : void 0);
        try {
          t.analyzeOutputs.val = Xe(L, F, t.elementInputs.val, t.deformOutputs.val);
        } catch (d) {
          console.warn("[CLI Modeler] analyze:", (d == null ? void 0 : d.message) ?? d);
        }
        if (i.areaSprings.length > 0) try {
          const d = t.deformOutputs.val.deformations, b = t.analyzeOutputs.val ?? {}, l = b.pressure instanceof Map ? b.pressure : /* @__PURE__ */ new Map();
          let f = 0, h = 0;
          for (const m of i.areaSprings) {
            const p = N.get(m.id);
            if (p === void 0) continue;
            const O = F[p].map((v) => {
              var _a2;
              const I = ((_a2 = d.get(v)) == null ? void 0 : _a2[2]) ?? 0, w = m.ks * I;
              return w < f && (f = w), w > h && (h = w), w;
            });
            l.set(p, O);
          }
          l.size > 0 && (b.pressure = l, b.colorMapRanges = {
            ...b.colorMapRanges ?? {},
            pressure: [
              h,
              f
            ]
          }, t.analyzeOutputs.val = b, console.log(`[CLI Modeler] presi\xF3n Winkler: ${l.size} shells, \u03C3 ${f.toFixed(0)}..${h.toFixed(0)} kN/m\xB2`));
        } catch (d) {
          console.warn("[CLI Modeler] presi\xF3n:", (d == null ? void 0 : d.message) ?? d);
        }
        if (ne.length > 0) try {
          const d = t.deformOutputs.val.deformations, b = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
          for (const f of ne) {
            const h = F[f], m = h.map((O) => L[O]), p = h.flatMap((O) => {
              const v = d.get(O) ?? [
                0,
                0,
                0
              ];
              return [
                v[0],
                v[1],
                v[2]
              ];
            }), k = Pe(m, o.get(f) ?? 25e6, _.get(f) ?? 0.2, p, i.solidIncompatible);
            b.set(f, k.stress), l.set(f, k.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: b,
            solidVonMises: l
          };
        } catch (d) {
          console.warn("[CLI Modeler] tensiones de solidos:", (d == null ? void 0 : d.message) ?? d);
        }
        console.log("[CLI Modeler] Solve OK \u2014", F.length, "elementos,", L.length, "nodos");
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
        nodes: L.length,
        frames: i.frames.length,
        shells: i.shells.length,
        supports: se.size,
        loads: W.size,
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
