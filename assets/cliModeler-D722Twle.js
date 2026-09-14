import { c as qe, a as _e } from "./cadSections-Dft7f7lL.js";
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
    if (i.length > 1 && i.length <= 6 && i.every((C) => C === "0" || C === "1")) return i.forEach((C, N) => {
      $[N] = C === "1";
    }), $;
    for (const C of i) De[C] !== void 0 && ($[De[C]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let C = 0; C < t.length; C++) $[C] = t[C] === "1";
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
    let $ = null, i = 0, C = 0, N = 0;
    const E = r.split(/\r?\n/);
    for (let q = 0; q < E.length; q++) {
      let v = E[q].trim();
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
          C++, t.frames.push({
            id: C,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if ($ === "areas" && e.length >= 4) {
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
        const e = parseInt(o[0], 10), n = o.slice(1).join(" ");
        t.supports.set(e, Je(n));
        continue;
      }
      $ && !/^[\-\d]/.test(o[0]) && ($ = null);
      try {
        switch (S) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2]), a = parseFloat(o[3]), c = parseFloat(o[4]);
            !isFinite(e) || !isFinite(n) || !isFinite(a) || !isFinite(c) ? t.errors.push(`L${q + 1}: node mal formado: ${v}`) : t.nodes.set(e, [
              n,
              a,
              c
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const e = parseInt(o[1], 10), n = parseInt(o[2], 10), a = parseInt(o[3], 10), c = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.16"), x = parseFloat(o[6] ?? "0.001"), k = o[7] !== void 0 ? parseFloat(o[7]) : void 0, m = o[8] !== void 0 ? parseFloat(o[8]) : void 0, y = o[9] !== void 0 ? parseFloat(o[9]) : void 0, b = o[10] !== void 0 ? parseFloat(o[10]) : void 0, z = o[11] !== void 0 ? parseFloat(o[11]) : void 0, J = o[12] !== void 0 ? parseFloat(o[12]) : void 0, U = o.indexOf("#"), D = U >= 0 && o[U + 1] ? o[U + 1] : void 0;
            t.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: c,
              A: h,
              I: x,
              Iy: k,
              J: m,
              nu: y,
              rho: b,
              D: z,
              B: J,
              sec: D
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? ""), a = parseFloat(o[3] ?? ""), c = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.2"), x = parseFloat(o[6] ?? "2.4");
            isFinite(e) && n > 0 && a > 0 && a < n / 2 && c > 0 ? t.frameCftc.set(e, {
              D: n,
              t: a,
              Ec: c,
              nuC: isFinite(h) ? h : 0.2,
              rhoC: isFinite(x) && x >= 0 ? x : 2.4
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), n = o.slice(2).map((J) => parseFloat(J)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, c = n[0], h = n[1], x = n[2], k = a ? n[3] : n[2], m = a ? 4 : 3, y = isFinite(n[m]) ? n[m] : 25e6, b = isFinite(n[m + 1]) ? n[m + 1] : 0.2, z = isFinite(n[m + 2]) ? n[m + 2] : 2.4;
            isFinite(e) && c > 0 && h > 0 && x > 0 && k > 0 && k < c / 2 && x < h / 2 && y > 0 ? t.frameCft.set(e, {
              b: c,
              h,
              t: x,
              tw: k,
              Ec: y,
              nuC: b,
              rhoC: z >= 0 ? z : 2.4
            }) : t.errors.push(`cft ${o[1]}: hace falta b h t [tw] (m) y Ec (kN/m2), con tw < b/2 y t < h/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0");
            isFinite(e) && isFinite(n) && isFinite(a) && t.frameShearAreas.set(e, [
              n,
              a
            ]);
            break;
          }
          case "release":
          case "rel": {
            const e = parseInt(o[1], 10), n = o.slice(2).map((c) => c.toLowerCase());
            if (!isFinite(e) || n.length === 0) {
              t.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const a = new Array(12).fill(false);
            if (n.length === 2 && n.every((c) => /^(pin|fix|libre|rigido)$/.test(c))) n.forEach((c, h) => {
              (c === "pin" || c === "libre") && (a[h * 6 + 4] = true, a[h * 6 + 5] = true);
            });
            else {
              const c = n.filter((h) => h === "0" || h === "1");
              if (c.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${c.length}`);
                break;
              }
              for (let h = 0; h < 12; h++) a[h] = c[h] === "1";
            }
            a.some(Boolean) && t.frameReleases.set(e, a);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const e = parseInt(o[1], 10), n = o.slice(2, 10).map((a) => parseInt(a, 10));
            if (!isFinite(e) || n.length !== 8 || n.some((a) => !isFinite(a))) {
              t.errors.push(`hex ${o[1]}: hacen falta 8 nudos`);
              break;
            }
            t.solids.push({
              id: e,
              pts: n,
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
            const e = (o[1] ?? "safe").toLowerCase(), n = e === "safe" ? 0.1 : parseFloat(e);
            t.torsionFactor = isFinite(n) && n > 0 ? n : 1;
            break;
          }
          case "decksec": {
            const e = parseInt(o[1], 10), n = o.slice(2).map(parseFloat);
            if (!isFinite(e) || n.length < 5 || n.slice(0, 5).some((a) => !isFinite(a) || a < 0) || !(n[0] > 0)) {
              t.errors.push(`decksec ${o[1]}: se esperaba ID tc hr wrt wrb sr [w]`);
              break;
            }
            t.deckSecs.set(e, {
              tc: n[0],
              hr: n[1],
              wrt: n[2],
              wrb: n[3],
              sr: n[4],
              w: isFinite(n[5]) ? n[5] : 0
            });
            break;
          }
          case "deck":
          case "deckmode": {
            const e = (o[1] ?? "etabs").toLowerCase();
            t.deckEtabs = e === "etabs" || e === "1" || e === "on" || e === "si", t.deckOneWay = o.slice(2).some((n) => /^(oneway|1way|unidireccional)$/i.test(n));
            break;
          }
          case "areaspring":
          case "winkler":
          case "springarea":
          case "winklerarea": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = o.slice(3).some((c) => /^(nodal|lumped|sap|etabs)$/i.test(c));
            isFinite(e) && isFinite(n) && n !== 0 ? t.areaSprings.push({
              id: e,
              ks: n,
              nodal: a
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
            const n = parseFloat(e);
            t.autoMesh = isFinite(n) && n > 0 ? n : 1.25;
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
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0");
            if (!isFinite(e) || !isFinite(n) || !isFinite(a)) {
              t.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            t.frameEndOffsets.set(e, [
              n,
              a,
              isFinite(c) ? c : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0");
            isFinite(e) && isFinite(n) && t.frameAngles.set(e, n);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const e = parseInt(o[1], 10), n = [
              parseInt(o[2], 10),
              parseInt(o[3], 10),
              parseInt(o[4], 10),
              parseInt(o[5], 10)
            ], a = parseFloat(o[6] ?? "0.20"), c = parseFloat(o[7] ?? "25e6"), h = o[9] !== void 0 ? parseFloat(o[9]) : void 0, x = h !== void 0 && isFinite(h) ? h : void 0;
            if (t.shells.push({
              id: e,
              pts: n,
              t: a,
              E: c,
              rho: x
            }), o[8] !== void 0) {
              const k = parseFloat(o[8]);
              isFinite(k) && k !== 0 && t.shellLoads.set(e, k);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const e = parseInt(o[1], 10), n = (o[2] ?? "").toLowerCase();
            if (!isFinite(e)) break;
            let a;
            if (n === "thin" || n === "delgada" || n === "kirchhoff" || n === "1" ? a = 1 : (n === "thick" || n === "gruesa" || n === "mindlin" || n === "0") && (a = 0), a === void 0) {
              t.errors.push(`shelltype ${e}: se esperaba thin o thick`);
              break;
            }
            t.shellTypes.set(e, a);
            break;
          }
          case "shellmod": {
            const e = parseInt(o[1], 10);
            if (!isFinite(e)) break;
            const n = o.slice(2).map(parseFloat);
            if (n.length >= 8) t.shellModsDir.set(e, n.slice(0, 8).map((a) => isFinite(a) ? a : 1));
            else {
              const a = n[0], c = n[1];
              t.shellMods.set(e, [
                isFinite(a) ? a : 1,
                isFinite(c) ? c : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const e = o.slice(1).map((b) => parseInt(b, 10));
            if (e.length < 7 || e.some((b) => !isFinite(b))) {
              t.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [n, a, c, h, x, k, m] = e, y = [];
            for (let b = k; b <= m; b++) y.push(b);
            t.areaObjs.push({
              id: n,
              pts: [
                a,
                c,
                h,
                x
              ],
              cells: y
            });
            break;
          }
          case "shellang": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2]);
            if (!isFinite(e) || !isFinite(n)) {
              t.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            t.shellAngles.set(e, n);
            break;
          }
          case "areaload":
          case "qarea": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2]);
            if (!isFinite(e) || !isFinite(n)) {
              t.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            t.shellLoads.set(e, n);
            break;
          }
          case "support":
          case "fix": {
            const e = parseInt(o[1], 10), n = o.slice(2).join(" ");
            t.supports.set(e, Je(n));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), h = parseFloat(o[5] ?? "0"), x = parseFloat(o[6] ?? "0"), k = parseFloat(o[7] ?? "0"), m = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(m) ? t.loads.set(e, [
              n,
              a,
              c,
              h,
              x,
              k
            ]) : (t.loadsPat.has(m) || t.loadsPat.set(m, /* @__PURE__ */ new Map()), t.loadsPat.get(m).set(e, [
              n,
              a,
              c,
              h,
              x,
              k
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), c = parseFloat(o[4] ?? "0"), h = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", x = /^dead$/i.test(h) ? t.frameLoads : t.frameLoadsPat.get(h) ?? (t.frameLoadsPat.set(h, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(h)), k = x.get(e) ?? [
              0,
              0,
              0
            ];
            x.set(e, [
              k[0] + n,
              k[1] + a,
              k[2] + c
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(o[1], 10), n = (o[2] ?? "uz").toLowerCase(), a = De[n] ?? 2, c = parseFloat(o[3] ?? "1000");
            t.springs.push({
              node: e,
              dof: a,
              k: c
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const e = parseInt(o[1], 10), n = parseInt(o[2] ?? "1", 10);
            isFinite(e) && isFinite(n) && n > 0 && t.diaphragms.set(e, n);
            break;
          }
          case "mass": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0");
            Number.isFinite(e) && Number.isFinite(n) ? t.masses.set(e, (t.masses.get(e) ?? 0) + n) : t.errors.push(`L${q + 1}: mass necesita <nudo> <toneladas>`);
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
        t.errors.push(`L${q + 1}: error "${v}" \u2014 ${e.message}`);
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
  ], de = (r, t) => r[0] * t[0] + r[1] * t[1] + r[2] * t[2], we = (r, t) => [
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
    ].map((m) => (r[0][m] + r[1][m] + r[2][m] + r[3][m]) / 4);
    let C = B(r[1], r[0]), N = we(C, B(r[3], r[0]));
    N = ae(N, 1 / G(N)), C = ae(C, 1 / G(C));
    const E = we(N, C), q = r.map((m) => [
      de(B(m, i), C),
      de(B(m, i), E)
    ]);
    let v = [
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
      ].map((y) => {
        const b = B(r[(y + 1) % 4], r[y]);
        return Math.abs(de(b, $)) / G(b);
      });
      v = [
        0,
        1,
        2,
        3
      ].sort((y, b) => m[y] - m[b]).slice(0, 2);
    }
    const o = q.map((m) => m[0]), S = q.map((m) => m[1]), e = Math.min(...o), n = Math.max(...o), a = Math.min(...S), c = Math.max(...S), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let x = 0;
    for (let m = 0; m < t; m++) for (let y = 0; y < t; y++) {
      const b = e + (n - e) * (m + 0.5) / t, z = a + (c - a) * (y + 0.5) / t;
      let J = 0, U = 0;
      for (let X = 0; X < 4; X++) {
        const _ = q[X], K = q[(X + 1) % 4];
        (K[0] - _[0]) * (z - _[1]) - (K[1] - _[1]) * (b - _[0]) >= 0 ? J++ : U++;
      }
      if (J !== 4 && U !== 4) continue;
      let D = v[0], j = 1 / 0;
      for (const X of v) {
        const _ = q[X], K = q[(X + 1) % 4], se = K[0] - _[0], R = K[1] - _[1], fe = se * se + R * R, re = Math.max(0, Math.min(1, ((b - _[0]) * se + (z - _[1]) * R) / fe)), Q = Math.hypot(b - (_[0] + re * se), z - (_[1] + re * R));
        Q < j && (j = Q, D = X);
      }
      h[D].pts.push([
        i[0] + b * C[0] + z * E[0],
        i[1] + b * C[1] + z * E[1],
        i[2] + b * C[2] + z * E[2]
      ]), x++;
    }
    const k = 0.5 * G(we(B(r[2], r[0]), B(r[3], r[1])));
    for (const m of h) m.dA = x ? k / x : 0;
    return h;
  }
  function Ke(r, t) {
    if (!(t > 0)) return;
    const $ = 1e-6, i = (S) => r.nodes.get(S);
    let C = Math.max(0, ...r.nodes.keys()) + 1, N = r.shells.reduce((S, e) => Math.max(S, e.id), 0) + 1;
    const E = (S) => {
      for (const [n, a] of r.nodes) if (G(B(a, S)) < $) return n;
      const e = C++;
      return r.nodes.set(e, [
        S[0],
        S[1],
        S[2]
      ]), e;
    }, q = (S, e) => {
      const n = r.shellModsDir.get(S);
      n && r.shellModsDir.set(e, [
        ...n
      ]);
      const a = r.shellMods.get(S);
      a && r.shellMods.set(e, [
        ...a
      ]);
      const c = r.shellLoads.get(S);
      c !== void 0 && r.shellLoads.set(e, c);
      const h = r.shellTypes.get(S);
      h !== void 0 && r.shellTypes.set(e, h);
      const x = r.shellAngles.get(S);
      x !== void 0 && r.shellAngles.set(e, x);
    }, v = [];
    let o = 0;
    for (const S of r.shells) {
      if (S.pts.length !== 4) {
        v.push(S);
        continue;
      }
      const e = S.pts.map(i);
      if (e.some((m) => !m)) {
        v.push(S);
        continue;
      }
      const n = (G(B(e[1], e[0])) + G(B(e[2], e[3]))) / 2, a = (G(B(e[3], e[0])) + G(B(e[2], e[1]))) / 2, c = Math.max(1, Math.ceil(n / t - 1e-9)), h = Math.max(1, Math.ceil(a / t - 1e-9));
      if (c === 1 && h === 1) {
        v.push(S);
        continue;
      }
      const x = (m, y) => [
        0,
        1,
        2
      ].map((b) => e[0][b] * (1 - m) * (1 - y) + e[1][b] * m * (1 - y) + e[2][b] * m * y + e[3][b] * (1 - m) * y), k = [];
      for (let m = 0; m <= c; m++) {
        const y = [];
        for (let b = 0; b <= h; b++) y.push(E(x(m / c, b / h)));
        k.push(y);
      }
      for (let m = 0; m < c; m++) for (let y = 0; y < h; y++) {
        const b = m === 0 && y === 0 ? S.id : N++;
        v.push({
          ...S,
          id: b,
          pts: [
            k[m][y],
            k[m + 1][y],
            k[m + 1][y + 1],
            k[m][y + 1]
          ]
        }), b !== S.id && q(S.id, b);
      }
      o++;
    }
    o && (r.shells = v, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${r.shells.length} cascaras, ${r.nodes.size} nudos`));
  }
  function Qe(r) {
    const $ = (a) => r.nodes.get(a), i = [
      ...r.nodes.keys()
    ], C = (a, c, h) => {
      const x = B(c, a), k = G(x), m = ae(x, 1 / k), y = [];
      for (const b of i) {
        if (h.includes(b)) continue;
        const z = B($(b), a), J = de(z, m);
        J > 1e-6 && J < k - 1e-6 && G(B(z, ae(m, J))) < 1e-4 && y.push(J / k);
      }
      return y.sort((b, z) => b - z);
    }, N = (a, c) => {
      const h = [];
      for (const x of a) c.some((k) => Math.abs(x - k) < 1e-5) && !h.some((k) => Math.abs(x - k) < 1e-5) && h.push(x);
      return h;
    }, E = (a) => {
      for (const c of i) if (G(B($(c), a)) < 1e-4) return c;
    };
    let q = r.shells.reduce((a, c) => Math.max(a, c.id), 0) + 1;
    const v = [], o = (a, c) => {
      const h = r.shellModsDir.get(a);
      h && r.shellModsDir.set(c, [
        ...h
      ]);
      const x = r.shellMods.get(a);
      x && r.shellMods.set(c, [
        ...x
      ]);
      const k = r.shellLoads.get(a);
      k !== void 0 && r.shellLoads.set(c, k);
      const m = r.shellTypes.get(a);
      m !== void 0 && r.shellTypes.set(c, m);
      const y = r.shellAngles.get(a);
      y !== void 0 && r.shellAngles.set(c, y);
    };
    for (const a of r.shells) {
      if (!Re(r, a.id) || a.pts.length !== 4 || a.pts.some((D) => !r.nodes.has(D))) {
        v.push(a);
        continue;
      }
      const c = a.pts.map($), h = C(c[0], c[1], a.pts), x = C(c[2], c[3], a.pts).map((D) => 1 - D), k = C(c[1], c[2], a.pts), m = C(c[3], c[0], a.pts).map((D) => 1 - D);
      let y = [
        0,
        ...N(h, x),
        1
      ], b = [
        0,
        ...N(k, m),
        1
      ];
      if (y.length === 2 && b.length === 2) {
        v.push(a);
        continue;
      }
      const z = (D, j) => [
        0,
        1,
        2
      ].map((X) => (1 - D) * (1 - j) * c[0][X] + D * (1 - j) * c[1][X] + D * j * c[2][X] + (1 - D) * j * c[3][X]);
      let J = b.map((D) => y.map((j) => E(z(j, D))));
      if (J.some((D) => D.some((j) => j === void 0)) && (y.length >= b.length ? b = [
        0,
        1
      ] : y = [
        0,
        1
      ], J = b.map((D) => y.map((j) => E(z(j, D)))), J.some((D) => D.some((j) => j === void 0)))) {
        v.push(a);
        continue;
      }
      let U = true;
      for (let D = 0; D < b.length - 1; D++) for (let j = 0; j < y.length - 1; j++) {
        const X = [
          J[D][j],
          J[D][j + 1],
          J[D + 1][j + 1],
          J[D + 1][j]
        ], _ = U ? a.id : q++;
        U || o(a.id, _), U = false, v.push({
          id: _,
          pts: X,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    r.shells = v;
    const S = 9.80665, e = (a, c) => {
      const h = r.loads.get(a) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      r.loads.set(a, [
        h[0] + c[0],
        h[1] + c[1],
        h[2] + c[2],
        h[3] + c[3],
        h[4] + c[4],
        h[5] + c[5]
      ]);
    }, n = (a, c) => {
      const h = B(c, a), x = G(h), k = ae(h, 1 / x);
      return r.frames.filter((m) => [
        m.nI,
        m.nJ
      ].every((y) => {
        const b = r.nodes.get(y);
        if (!b) return false;
        const z = B(b, a), J = de(z, k);
        return J > -1e-4 && J < x + 1e-4 && G(B(z, ae(k, J))) < 1e-4;
      }));
    };
    for (const a of r.shells) {
      if (!Re(r, a.id) || a.pts.length !== 4) continue;
      const c = r.selfWeight ? (a.rho ?? 2.45) * a.t * S * r.selfWeight : 0, h = r.shellLoads.get(a.id) ?? 0, x = -c + h;
      if (Math.abs(x) < 1e-15) continue;
      const k = a.pts.map($);
      let m;
      if (r.deckOneWay) {
        const b = B(k[1], k[0]);
        let z = we(b, B(k[3], k[0]));
        z = ae(z, 1 / G(z));
        const J = ae(b, 1 / G(b)), U = we(z, J), D = (r.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        m = [
          0,
          1,
          2
        ].map((j) => Math.cos(D) * J[j] + Math.sin(D) * U[j]);
      }
      const y = Ve(k, 200, m);
      for (let b = 0; b < 4; b++) {
        const { pts: z, dA: J } = y[b];
        if (!z.length) continue;
        const U = k[b], D = k[(b + 1) % 4], j = n(U, D);
        if (!j.length) {
          const R = x * J * z.length;
          e(a.pts[b], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]), e(a.pts[(b + 1) % 4], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const X = B(D, U), _ = G(X), K = ae(X, 1 / _), se = z.map((R) => de(B(R, U), K));
        for (const R of j) {
          const fe = $(R.nI), re = $(R.nJ), Q = de(B(fe, U), K), be = de(B(re, U), K), pe = Math.min(Q, be), H = Math.max(Q, be), ce = H - pe;
          if (ce < 1e-9) continue;
          const te = H >= _ - 1e-6, ne = ae(B(re, fe), 1 / ce), oe = we(ne, [
            0,
            0,
            1
          ]);
          let he = 0, ue = 0, Fe = 0, me = 0;
          for (const ge of se) {
            if (ge < pe - 1e-9 || (te ? ge > H + 1e-9 : ge >= H - 1e-9)) continue;
            let le = ge - pe;
            Q > be && (le = ce - le);
            const s = le / ce;
            he += 1 - 3 * s * s + 2 * s * s * s, ue += ce * (s - 2 * s * s + s * s * s), Fe += 3 * s * s - 2 * s * s * s, me += ce * (-s * s + s * s * s);
          }
          const ee = x * J;
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
            ee * Fe,
            oe[0] * ee * me,
            oe[1] * ee * me,
            oe[2] * ee * me
          ]);
        }
      }
      r.deckTributario.add(a.id), r.shellLoads.delete(a.id);
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
      const i = t.nodes.val, C = t.elements.val;
      if (!(!i.length || !C.length)) try {
        const N = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), E = t.nodeInputs.val, q = window.__hekatanCliSprings, v = Ue(i, C, E, t.elementInputs.val, N, 0, 0, 1, (E == null ? void 0 : E.diaphragms) instanceof Map && E.diaphragms.size ? E.diaphragms : void 0, q && q.length ? q : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${v.frequencies.length} modos, T1 = ${v.frequencies[0] ? (1 / v.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = $ == null ? void 0 : $.render) == null ? void 0 : _a.call($, v, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (N) {
        console.error("[CLI Modeler] modal:", (N == null ? void 0 : N.message) ?? N);
      }
    },
    build(r, t) {
      var _a, _b;
      const $ = window.__hekatanCliScript ?? Ze;
      window.__hekatanCliLastScript = $;
      const i = Ge($);
      i.autoMesh > 0 && Ke(i, i.autoMesh), i.deckEtabs && Qe(i);
      const C = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), E = [], q = Array.from(i.nodes.keys()).sort((s, d) => s - d);
      for (const s of q) C.set(s, E.length), E.push(i.nodes.get(s));
      const v = [], o = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map();
      for (const s of i.frames) {
        const d = C.get(s.nI), w = C.get(s.nJ);
        if (d === void 0 || w === void 0) {
          const I = q.length ? `IDs disponibles: ${q.join(", ")}` : "ning\xFAn nodo definido", T = [];
          d === void 0 && T.push(s.nI), w === void 0 && T.push(s.nJ), i.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${T.join(", ")}] \u2014 ${I}`);
          continue;
        }
        const l = v.length;
        v.push([
          d,
          w
        ]);
        const f = s.nu ?? 0.2;
        o.set(l, s.E), S.set(l, s.E / (2 * (1 + f))), e.set(l, s.A), n.set(l, s.I), a.set(l, s.Iy ?? s.I), c.set(l, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), h.set(l, s.rho ?? 2.45), _.set(l, f), s.D !== void 0 && isFinite(s.D) && x.set(l, s.D), s.B !== void 0 && isFinite(s.B) && k.set(l, s.B);
        const u = i.frameAngles.get(s.id);
        u !== void 0 && isFinite(u) && y.set(l, u);
        const M = i.frameReleases.get(s.id);
        M && b.set(l, M);
        const p = i.frameEndOffsets.get(s.id);
        p && z.set(l, p);
        const L = i.frameLoads.get(s.id);
        L && D.set(l, L);
        const O = i.frameShearAreas.get(s.id);
        if (O && (X.set(l, O[0]), j.set(l, O[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const I = {
            type: "general"
          };
          s.sec && (I.name = s.sec), s.D !== void 0 && isFinite(s.D) && (I.h = s.D), s.B !== void 0 && isFinite(s.B) && (I.b = s.B), m.set(l, I);
        }
        const F = i.frameCftc.get(s.id);
        if (F) {
          const I = qe(F.D, F.t, s.E, f, F.Ec, F.nuC);
          e.set(l, I.A), a.set(l, I.Iz), n.set(l, I.Iy), c.set(l, I.J), X.set(l, I.As2), j.set(l, I.As3), x.set(l, F.D), k.set(l, F.D);
          const T = F.D - 2 * F.t, A = Math.PI * T * T / 4, P = Math.PI * F.D * F.D / 4 - A;
          h.set(l, ((s.rho ?? 7.85) * P + F.rhoC * A) / I.A), m.set(l, {
            type: "CFT",
            d: F.D,
            tw: F.t,
            fillE: F.Ec,
            fillRho: F.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(F.D * 1e3)}X${Math.round(F.t * 1e3)}`
          });
        }
        const g = i.frameCft.get(s.id);
        if (g) {
          const I = _e(g.b, g.h, g.t, s.E, f, g.Ec, g.nuC, g.tw);
          e.set(l, I.A), a.set(l, I.Iz), n.set(l, I.Iy), c.set(l, I.J), X.set(l, I.As2), j.set(l, I.As3), x.set(l, g.h), k.set(l, g.b);
          const T = (g.b - 2 * g.tw) * (g.h - 2 * g.t), A = g.b * g.h - T;
          h.set(l, ((s.rho ?? 7.85) * A + g.rhoC * T) / I.A);
          const P = (W) => Math.round(W * 1e3);
          m.set(l, {
            type: "CFT",
            b: g.b,
            h: g.h,
            tw: g.tw,
            tf: g.t,
            fillE: g.Ec,
            fillRho: g.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${P(g.h)}X${P(g.b)}X${P(g.t)}${g.tw !== g.t ? `X${P(g.tw)}` : ""}`
          });
        }
      }
      if (i.meshCross) {
        const s = (M, p) => M[0] * p[0] + M[1] * p[1] + M[2] * p[2], d = [
          o,
          S,
          e,
          n,
          a,
          c,
          h,
          _,
          x,
          k,
          y,
          j,
          X,
          m,
          D
        ], w = (M, p) => {
          for (const L of d) L.has(M) && L.set(p, L.get(M));
        }, l = (M) => {
          for (let p = 0; p < E.length; p++) if (Math.hypot(E[p][0] - M[0], E[p][1] - M[1], E[p][2] - M[2]) < 1e-6) return p;
          return E.push([
            M[0],
            M[1],
            M[2]
          ]), E.length - 1;
        }, f = (M) => {
          const p = E[M[0]], L = E[M[1]];
          return [
            Math.min(p[0], L[0]),
            Math.min(p[1], L[1]),
            Math.min(p[2], L[2]),
            Math.max(p[0], L[0]),
            Math.max(p[1], L[1]),
            Math.max(p[2], L[2])
          ];
        };
        let u = 0;
        for (let M = 0; M < v.length; M++) {
          if (v[M].length !== 2) continue;
          const p = f(v[M]);
          for (let L = M + 1; L < v.length; L++) {
            if (v[L].length !== 2) continue;
            const [O, F] = v[M], [g, I] = v[L];
            if (O === g || O === I || F === g || F === I) continue;
            const T = f(v[L]);
            if (p[0] > T[3] + 1e-6 || T[0] > p[3] + 1e-6 || p[1] > T[4] + 1e-6 || T[1] > p[4] + 1e-6 || p[2] > T[5] + 1e-6 || T[2] > p[5] + 1e-6) continue;
            const A = E[O], P = E[F], W = E[g], Z = E[I], Y = [
              P[0] - A[0],
              P[1] - A[1],
              P[2] - A[2]
            ], V = [
              Z[0] - W[0],
              Z[1] - W[1],
              Z[2] - W[2]
            ], ie = [
              A[0] - W[0],
              A[1] - W[1],
              A[2] - W[2]
            ], Le = s(Y, Y), xe = s(Y, V), Ce = s(V, V), Oe = s(Y, ie), ze = s(V, ie), Ee = Le * Ce - xe * xe;
            if (Ee < 1e-10 * Le * Ce) continue;
            const Ie = (xe * ze - Ce * Oe) / Ee, ve = (Le * ze - xe * Oe) / Ee;
            if (Ie < 1e-6 || Ie > 1 - 1e-6 || ve < 1e-6 || ve > 1 - 1e-6) continue;
            const ye = [
              A[0] + Ie * Y[0],
              A[1] + Ie * Y[1],
              A[2] + Ie * Y[2]
            ], Ae = [
              W[0] + ve * V[0],
              W[1] + ve * V[1],
              W[2] + ve * V[2]
            ];
            if (Math.hypot(ye[0] - Ae[0], ye[1] - Ae[1], ye[2] - Ae[2]) > 1e-6) continue;
            const Te = l(ye);
            for (const Me of [
              M,
              L
            ]) {
              const [We, Ne] = v[Me], Se = v.length;
              v[Me] = [
                We,
                Te
              ], v.push([
                Te,
                Ne
              ]), w(Me, Se);
              const $e = b.get(Me);
              $e && (b.set(Me, [
                ...$e.slice(0, 6),
                ...Array(6).fill(false)
              ]), b.set(Se, [
                ...Array(6).fill(false),
                ...$e.slice(6)
              ]));
              const ke = z.get(Me);
              ke && (z.set(Me, [
                ke[0],
                0,
                ke[2]
              ]), z.set(Se, [
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
        const d = s.pts.map((u) => C.get(u));
        if (d.some((u) => u === void 0)) {
          i.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const w = v.length;
        N.set(s.id, w), v.push(d), o.set(w, s.E), S.set(w, s.E / (2 * 1.2)), K.set(w, s.t), h.set(w, s.rho ?? 2.45), _.set(w, 0.2);
        const l = i.shellTypes.get(s.id);
        l !== void 0 && J.set(w, l);
        const f = i.deckSecs.get(s.id);
        if (f) {
          const u = f.tc + (f.sr > 0 ? f.hr * (f.wrt + f.wrb) / 2 / f.sr : 0);
          K.set(w, f.tc), h.set(w, ((s.rho ?? 2.45) * u + f.w / 9.80665) / f.tc), U.set(w, {
            ...f
          });
        }
      }
      const se = /* @__PURE__ */ new Map();
      for (const [s, d] of i.supports.entries()) {
        const w = C.get(s);
        w !== void 0 && se.set(w, d);
      }
      const R = /* @__PURE__ */ new Map();
      for (const [s, d] of i.loads.entries()) {
        const w = C.get(s);
        w !== void 0 && R.set(w, [
          ...d
        ]);
      }
      const fe = /* @__PURE__ */ new Map();
      for (const [s, d] of i.diaphragms.entries()) {
        const w = C.get(s);
        w !== void 0 && fe.set(w, d);
      }
      const re = /* @__PURE__ */ new Map();
      for (const [s, d] of i.masses.entries()) {
        const w = C.get(s);
        w !== void 0 && re.set(w, d);
      }
      const Q = /* @__PURE__ */ new Map();
      for (const [s, d] of i.loadsPat) {
        const w = /* @__PURE__ */ new Map();
        for (const [l, f] of d) {
          const u = C.get(l);
          u !== void 0 && w.set(u, [
            ...f
          ]);
        }
        Q.set(s, w);
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
        const w = (l, f) => {
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
          const u = i.frames.find((P) => P.id === l);
          if (!u) {
            i.errors.push(`frameload ${l}: no existe esa barra`);
            continue;
          }
          const M = C.get(u.nI), p = C.get(u.nJ);
          if (M === void 0 || p === void 0) continue;
          const L = E[M], O = E[p], F = [
            O[0] - L[0],
            O[1] - L[1],
            O[2] - L[2]
          ], g = Math.hypot(F[0], F[1], F[2]);
          if (g < 1e-9) continue;
          const I = [
            F[0] / g,
            F[1] / g,
            F[2] / g
          ], T = g * g / 12, A = [
            I[1] * f[2] - I[2] * f[1],
            I[2] * f[0] - I[0] * f[2],
            I[0] * f[1] - I[1] * f[0]
          ];
          w(M, [
            f[0] * g / 2,
            f[1] * g / 2,
            f[2] * g / 2,
            T * A[0],
            T * A[1],
            T * A[2]
          ]), w(p, [
            f[0] * g / 2,
            f[1] * g / 2,
            f[2] * g / 2,
            -T * A[0],
            -T * A[1],
            -T * A[2]
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
        const w = s.pts.map((u) => C.get(u));
        if (w.some((u) => u === void 0)) {
          i.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const l = w.map((u) => E[u]), f = [
          0,
          0,
          0,
          0
        ];
        for (const [u, M] of ce) {
          const p = [
            0.25 * (1 - u) * (1 - M),
            0.25 * (1 + u) * (1 - M),
            0.25 * (1 + u) * (1 + M),
            0.25 * (1 - u) * (1 + M)
          ], L = [
            -0.25 * (1 - M),
            0.25 * (1 - M),
            0.25 * (1 + M),
            -0.25 * (1 + M)
          ], O = [
            -0.25 * (1 - u),
            -0.25 * (1 + u),
            0.25 * (1 + u),
            0.25 * (1 - u)
          ], F = [
            0,
            1,
            2
          ].map((A) => L.reduce((P, W, Z) => P + W * l[Z][A], 0)), g = [
            0,
            1,
            2
          ].map((A) => O.reduce((P, W, Z) => P + W * l[Z][A], 0)), I = [
            F[1] * g[2] - F[2] * g[1],
            F[2] * g[0] - F[0] * g[2],
            F[0] * g[1] - F[1] * g[0]
          ], T = Math.hypot(I[0], I[1], I[2]);
          for (let A = 0; A < 4; A++) f[A] += p[A] * d * T;
        }
        for (let u = 0; u < 4; u++) {
          const M = w[u], p = R.get(M) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += f[u], R.set(M, p), pe.set(M, (pe.get(M) ?? 0) + f[u]);
        }
      }
      if (i.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [l, f] of N) i.deckTributario.has(l) && d.add(f);
        const w = (l, f) => {
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
              const M = e.get(f) ?? 0, p = E[l[0]], L = E[l[1]], O = [
                L[0] - p[0],
                L[1] - p[1],
                L[2] - p[2]
              ];
              let F = Math.hypot(O[0], O[1], O[2]);
              const g = z.get(f);
              if (g) {
                const Y = Math.hypot(O[0], O[1]);
                Y > 1e-9 && Math.abs(Math.atan2(Math.abs(O[2]), Y)) * 180 / Math.PI < 20 && (F = Math.max(F - g[0] - g[1], 0));
              }
              const I = Math.hypot(O[0], O[1], O[2]), T = -M * u * 9.80665 * i.selfWeight, A = [
                O[0] / I,
                O[1] / I,
                O[2] / I
              ], P = F * F / 12, W = [
                A[1] * T,
                -A[0] * T,
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
                T * F / 2,
                P * W[0],
                P * W[1],
                0
              ]), Z(l[1], [
                0,
                0,
                T * F / 2,
                -P * W[0],
                -P * W[1],
                0
              ]);
            } else if (l.length === 4) {
              const M = K.get(f) ?? 0, p = l.map((F) => E[F]);
              let L = 0;
              for (let F = 1; F < 3; F++) {
                const g = [
                  p[F][0] - p[0][0],
                  p[F][1] - p[0][1],
                  p[F][2] - p[0][2]
                ], I = [
                  p[F + 1][0] - p[0][0],
                  p[F + 1][1] - p[0][1],
                  p[F + 1][2] - p[0][2]
                ], T = [
                  g[1] * I[2] - g[2] * I[1],
                  g[2] * I[0] - g[0] * I[2],
                  g[0] * I[1] - g[1] * I[0]
                ];
                L += Math.hypot(T[0], T[1], T[2]) / 2;
              }
              const O = L * M * u * 9.80665 * i.selfWeight;
              for (const F of l) w(F, -O / 4);
            }
          }
        });
      }
      const te = [];
      for (const s of i.springs) {
        const d = C.get(s.node);
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
        v.forEach((l, f) => {
          if (l.length === 3 || l.length === 4) {
            d.push(f);
            for (const u of l) s.add(u);
          }
        });
        let w = 0;
        for (const l of d) {
          const f = v[l], u = f.map((p) => E[p]), M = [
            0,
            1,
            2
          ].map((p) => [
            Math.min(...u.map((L) => L[p])),
            Math.max(...u.map((L) => L[p]))
          ]);
          for (let p = 0; p < E.length; p++) {
            if (f.includes(p)) continue;
            const L = E[p];
            if (L[0] < M[0][0] - 1e-6 || L[0] > M[0][1] + 1e-6 || L[1] < M[1][0] - 1e-6 || L[1] > M[1][1] + 1e-6 || L[2] < M[2][0] - 1e-6 || L[2] > M[2][1] + 1e-6) continue;
            let O = false;
            for (let g = 0; g < f.length && !O; g++) {
              const I = u[g], T = u[(g + 1) % f.length], A = [
                T[0] - I[0],
                T[1] - I[1],
                T[2] - I[2]
              ], P = A[0] * A[0] + A[1] * A[1] + A[2] * A[2];
              if (P < 1e-24) continue;
              const W = [
                L[0] - I[0],
                L[1] - I[1],
                L[2] - I[2]
              ], Z = (W[0] * A[0] + W[1] * A[1] + W[2] * A[2]) / P;
              if (Z <= 1e-6 || Z >= 1 - 1e-6) continue;
              const Y = [
                W[0] - Z * A[0],
                W[1] - Z * A[1],
                W[2] - Z * A[2]
              ];
              Math.hypot(Y[0], Y[1], Y[2]) <= 1e-6 * Math.sqrt(P) && (O = true);
            }
            !O || !v.some((g, I) => I !== l && g.includes(p)) || (te.push({
              node: -(l + 1),
              dof: -2,
              k: p
            }), w++);
          }
        }
        w && console.log(`[CLI Modeler] edge etabs: ${w} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const ne = [];
      for (const s of i.solids) {
        const d = s.pts.map((l) => C.get(l));
        if (d.some((l) => l === void 0)) {
          i.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const w = v.length;
        v.push(d), o.set(w, s.E), _.set(w, s.nu), S.set(w, s.E / (2 * (1 + s.nu))), h.set(w, s.rho), ne.push(w);
      }
      t.nodes.val = E, t.elements.val = v, t.nodeInputs.val = {
        supports: se,
        loads: R,
        masses: re,
        diaphragms: fe,
        springs: te
      }, t.springs && (t.springs.val = te);
      const oe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const s of i.shells) {
        const d = N.get(s.id);
        if (d === void 0) continue;
        const w = i.shellLoads.get(s.id);
        w !== void 0 && Fe.set(d, w);
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
        momentsOfInertiaY: n,
        momentsOfInertiaZ: a,
        torsionalConstants: i.torsionFactor !== 1 ? new Map([
          ...c
        ].map(([s, d]) => [
          s,
          d * i.torsionFactor
        ])) : c,
        densities: h,
        poissonsRatios: _,
        thicknesses: K,
        membraneModifiers: oe,
        bendingModifiers: he,
        shellModifiers: ue,
        shellSurfaceLoads: Fe,
        shellAngles: me,
        cargaDeArea: pe,
        cantos: x,
        anchos: k,
        sectionShapes: m,
        localAngles: y,
        shearAreasY: j,
        shearAreasZ: X,
        momentReleases: b,
        endOffsets: z,
        plateFormulations: J,
        deckSections: U,
        frameLoads: D,
        meshAtIntersections: i.meshCross,
        solidIncompatible: i.solidIncompatible,
        selfWeight: i.selfWeight,
        etabsWallJoint: i.etabsWallJoint,
        areaObjects: i.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => C.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => N.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => i.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => i.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, i.doSolve && ne.length > 0 && ne.length === v.length) try {
        const s = o.get(ne[0]) ?? 25e6, d = _.get(ne[0]) ?? 0.2;
        ne.some((M) => Math.abs((o.get(M) ?? s) - s) > 1e-9 * s || Math.abs((_.get(M) ?? d) - d) > 1e-12) && i.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const w = /* @__PURE__ */ new Map();
        for (const [M, p] of t.nodeInputs.val.supports ?? []) w.set(M, [
          !!p[0],
          !!p[1],
          !!p[2]
        ]);
        const l = /* @__PURE__ */ new Map();
        for (const [M, p] of je({
          Dead: R,
          ...Object.fromEntries(Q)
        })) l.set(M, [
          p[0] ?? 0,
          p[1] ?? 0,
          p[2] ?? 0
        ]);
        const f = Be({
          nodes: E,
          elements: v,
          E: s,
          nu: d,
          supports: w,
          loads: l,
          incompatible: i.solidIncompatible
        }), u = /* @__PURE__ */ new Map();
        f.displacements.forEach(([M, p, L], O) => u.set(O, [
          M,
          p,
          L,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: u,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: f.stressPerElement,
          solidVonMises: f.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${v.length} solidos H8, ${E.length} nodos (${f.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        i.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (i.doSolve && E.length && v.length) try {
        window.__hekatanCliSprings = te;
        const s = je({
          Dead: R,
          ...Object.fromEntries(Q)
        });
        t.deformOutputs.val = Ye(E, v, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, te.length ? te : void 0);
        try {
          t.analyzeOutputs.val = Xe(E, v, t.elementInputs.val, t.deformOutputs.val);
        } catch (d) {
          console.warn("[CLI Modeler] analyze:", (d == null ? void 0 : d.message) ?? d);
        }
        if (i.areaSprings.length > 0) try {
          const d = t.deformOutputs.val.deformations, w = t.analyzeOutputs.val ?? {}, l = w.pressure instanceof Map ? w.pressure : /* @__PURE__ */ new Map();
          let f = 0, u = 0;
          for (const M of i.areaSprings) {
            const p = N.get(M.id);
            if (p === void 0) continue;
            const O = v[p].map((F) => {
              var _a2;
              const g = ((_a2 = d.get(F)) == null ? void 0 : _a2[2]) ?? 0, I = M.ks * g;
              return I < f && (f = I), I > u && (u = I), I;
            });
            l.set(p, O);
          }
          l.size > 0 && (w.pressure = l, w.colorMapRanges = {
            ...w.colorMapRanges ?? {},
            pressure: [
              u,
              f
            ]
          }, t.analyzeOutputs.val = w, console.log(`[CLI Modeler] presi\xF3n Winkler: ${l.size} shells, \u03C3 ${f.toFixed(0)}..${u.toFixed(0)} kN/m\xB2`));
        } catch (d) {
          console.warn("[CLI Modeler] presi\xF3n:", (d == null ? void 0 : d.message) ?? d);
        }
        if (ne.length > 0) try {
          const d = t.deformOutputs.val.deformations, w = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
          for (const f of ne) {
            const u = v[f], M = u.map((O) => E[O]), p = u.flatMap((O) => {
              const F = d.get(O) ?? [
                0,
                0,
                0
              ];
              return [
                F[0],
                F[1],
                F[2]
              ];
            }), L = Pe(M, o.get(f) ?? 25e6, _.get(f) ?? 0.2, p, i.solidIncompatible);
            w.set(f, L.stress), l.set(f, L.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: w,
            solidVonMises: l
          };
        } catch (d) {
          console.warn("[CLI Modeler] tensiones de solidos:", (d == null ? void 0 : d.message) ?? d);
        }
        console.log("[CLI Modeler] Solve OK \u2014", v.length, "elementos,", E.length, "nodos");
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
        nodes: E.length,
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
